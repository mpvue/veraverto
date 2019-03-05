/**
 * @file 模板转换
 */

const fs = require('fs-extra')
const path = require('path')
const parser = require('himalaya')
const t = require('babel-types')
const generator = require('babel-generator').default
const babelTraverse = require('babel-traverse')
const prettier = require('prettier')
const chalk = require('chalk')
const traverse = babelTraverse.default
const eventKeyReg = /^(bind:|catch:|bind|catch|on)(\w+)/ // 匹配事件绑定名
const conditionReg = /(if|elif|else)$/  // 匹配条件语句
const loopsReg = /(for|for\-index|for\-item(s)?|key)$/ // 匹配循环语句
const compatibleSwan = 'swan' // 兼容百度小程序
const compatibleMy = 'my' // 兼容支付宝小程序
const closingTag = 'input'
const astWrapper = 'astWrap'
let _tarConfig = {}
let templTypeReg = ''

const NodeType = {
  Element: 'element',
  Comment: 'comment',
  Text: 'text'
}

/**
 * 节点解析 
 * @param {Object} node AST节点 
 */
function parseNode(node) {
  if (node.type === NodeType.Text) {
    return t.jSXText(node.content)
  }
  if (node.type === NodeType.Comment) {
    node.content.replace(templTypeReg, _tarConfig.fileTypes.TEMPL)
    let commentStr = '<!--' + node.content + '-->'
    return t.jSXText(commentStr)  
  }
  return parseElement(node)
}

/**
 * 元素解析
 * @param {Object} node AST节点 
 */
function parseElement(node) {
  let tagName = t.jSXIdentifier(node.tagName)
  let attributes = node.attributes
  let selfClosing = false
  if (node.tagName.toLowerCase() === closingTag) {
    selfClosing = true
  }
  return t.jSXElement(
    t.jSXOpeningElement(tagName, attributes.map(parseAttribute), selfClosing),
    t.jSXClosingElement(tagName),
    removEmptyText(node.children).map(parseNode),
    false
  )
}

/**
 * 移除空字符串
 * @param {Object} nodes AST节点
 */
function removEmptyText(nodes) {
  return nodes.filter(node => {
    return node.type === NodeType.Element
      || (node.type === NodeType.Text && node.content.trim().length !== 0)
      || node.type === NodeType.Comment
  })
}

/**
 * 属性解析
 * @param {Object} attr 标签属性对象
 */
function parseAttribute(attr) {
  let { key, value } = attr
  let jsxValue = null
  if (value) {
    jsxValue = t.stringLiteral(value)
  }
  return t.jSXAttribute(t.jSXIdentifier(key), jsxValue)
}

/**
 * 事件名替换
 * @param {Object} path AST节点path对象
 * @param {}
 */
function handleEventKey(path, nodeName, matchArr) {
  let evtName = matchArr[matchArr.length - 1].toLowerCase()
  let prefix = process.env.TARGETPLATFORM === compatibleMy ? 'on' : matchArr[matchArr.length - 2]
  path.node.name.name =  _tarConfig.eventTypes[evtName] ? prefix + _tarConfig.eventTypes[evtName] : nodeName
}

/**
 * 条件/循环属性替换
 * @param
 */
function handleConditionAndLoopsKey(path, matchArr, type) {
  path.node.name.name = _tarConfig[type][matchArr[0]]
  // 条件语句以及循环语句百度小程序与其它小程序互转兼容
  if (process.env.TARGETPLATFORM === compatibleSwan && path.node.value) {
    path.node.value.value = path.node.value.value.replace(/({|})/g, '')
  }
  if (process.env.SRCPLATFORM === compatibleSwan && path.node.value) {
    path.node.value.value = '{{' + path.node.value.value + '}}'
  }
}

/**
 * 兼容百度小程序中双向绑定
 * @param {Object} path AST节点
 */
function handleInputValueBinding(path) {
  if (process.env.TARGETPLATFORM === compatibleSwan) {
    path.node.value.value = path.node.value.value.replace(/({{)(.*)(}})/g, (...args) => {
      return '{=' + args[2] + '=}'
    })
  }
  if (process.env.SRCPLATFORM === compatibleSwan) {
    path.node.value.value = path.node.value.value.replace(/({=)(.*)(=})/g, (...args) => {
      return '{{' + args[2] + '}}'
    })
  }
}

function handleTemplateData(path) {
  if (process.env.TARGETPLATFORM === compatibleSwan) {
    path.node.value.value = path.node.value.value.replace(/({{)(.*)(}})/g, (...args) => {
      return '{{{' + args[2] + '}}}'
    })
  }
  if (process.env.SRCPLATFORM === compatibleSwan) {
    path.node.value.value = path.node.value.value.replace(/({{{)(.*)(}}})/g, (...args) => {
      return '{{' + args[2] + '}}'
    })
  }
}

function handleIncludeSrc(path, srcConfig, tarConfig) {
  const extRegExp = new RegExp(srcConfig.fileTypes.TEMPL + '$')
  path.node.value.value = path.node.value.value.replace(extRegExp, tarConfig.fileTypes.TEMPL)
}

exports.convertTemplate = function ({root, pages, srcConfig, tarConfig}) {
  _tarConfig = tarConfig
  templTypeReg = new RegExp(srcConfig.fileTypes.TEMPL + '$')
  console.log(chalk.green('开始转换模板文件'))
  pages.forEach(page => {
    let pagePath = path.join(root, page)
    let pageTemplPath = pagePath + '.' + srcConfig.fileTypes.TEMPL
    let contentString = String(fs.readFileSync(pageTemplPath))
    let parseOptions = Object.assign(parser.parseDefaults, {
      childlessTags: ['style', 'script']
    })
    let codeObj = parser.parse(contentString.trim(), parseOptions)
    let ast = t.file(
      t.program(
        [
          t.expressionStatement(parseNode({
            tagName: astWrapper,
            type: NodeType.Element,
            attributes: [],
            children: codeObj
          }))
        ]
      )
    )
    traverse(ast, {
      JSXIdentifier(path) {
        
      },
      JSXAttribute(path) {
        const nodeName = path.node.name.name
        const eventMatchArr = nodeName.match(eventKeyReg)
        const conditionMatchArr = nodeName.match(conditionReg)
        const loopsMatchArr = nodeName.match(loopsReg)
        if (eventMatchArr) {
          handleEventKey(path, nodeName, eventMatchArr)
        }
        if (conditionMatchArr) {
          handleConditionAndLoopsKey(path, conditionMatchArr, 'conditionMap')
        }
        if (loopsMatchArr) {
          handleConditionAndLoopsKey(path, loopsMatchArr, 'loopsMap')
        }
        if ((process.env.SRCPLATFORM === compatibleSwan || process.env.TARGETPLATFORM === compatibleSwan)
          && path.get('name').isJSXIdentifier({name: 'value'})
          && (path.parentPath.get('name').isJSXIdentifier({name: 'input'})
          || path.parentPath.get('name').isJSXIdentifier({name: 'textarea'}))
        ) {
          handleInputValueBinding(path)
        }
      },
      JSXElement: {
        exit(path) {
          const openingElement = path.get('openingElement')
          const jsxName = openingElement.get('name')
          if (jsxName.isJSXIdentifier({ name: 'template' })
            || jsxName.isJSXIdentifier({ name: 'import' })
            || jsxName.isJSXIdentifier({ name: 'include' })
          ) {
            openingElement.traverse({
              JSXAttribute(path) {
                if (path.get('name').isJSXIdentifier({ name: 'data' })
                  && (process.env.SRCPLATFORM === compatibleSwan || process.env.TARGETPLATFORM === compatibleSwan)
                ) {
                  handleTemplateData(path)
                }
                if (path.get('name').isJSXIdentifier({ name: 'src' })) {
                  handleIncludeSrc(path, srcConfig, tarConfig)
                }
              }
            })
          }
          if (jsxName.isJSXIdentifier({ name: astWrapper })) {
            path.parentPath.replaceWithMultiple(path.node.children)
            path.parentPath.stop() // 替换节点后这里会重新触发一次遍历，影响转换性能，所以通过stop来停止替换后重新遍历
          }
        }
      }
    })
    let output = prettier.format(generator(ast).code, {
      parser: 'html',
      htmlWhitespaceSensitivity: 'ignore'
    })
    let distPath = path.join(root, 'convertDist', process.env.TARGETPLATFORM, page) + '.' + _tarConfig.fileTypes.TEMPL
    fs.ensureDirSync(path.dirname(distPath))
    fs.writeFileSync(distPath, output, 'utf8')
  })
}