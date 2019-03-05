/**
 * @file js文件转换
 */

const fs = require('fs-extra')
const path = require('path')
const parser = require('@babel/parser').parse
const babelTraverse = require('babel-traverse').default
const generator = require('babel-generator').default
const t = require('babel-types')
const prettier = require('prettier')
const chalk = require('chalk')

exports.convertScript = function ({root, pages, srcConfig, tarConfig}) {
  if (!pages) {
    return
  }
  console.log(chalk.green('开始转换js脚本'))
  pages.forEach(page => {
    let pagePath = path.join(root, page)
    let pageTemplPath = pagePath + '.' + srcConfig.fileTypes.SCRIPT
    let contentString = String(fs.readFileSync(pageTemplPath))
    let ast = parser(contentString)
    babelTraverse(ast, {
      Identifier(path) {
        if (t.isIdentifier(path.node, {name: process.env.SRCPLATFORM})
          && t.isMemberExpression(path.parentPath.node)
          && path.parentKey === 'object'
        ) {
          path.node.name = process.env.TARGETPLATFORM
        }
        if (t.isIdentifier(path.node, {name: 'behaviors'})
          && path.parentPath.isObjectProperty()
          && t.isArrayExpression(path.parentPath.node.value)
        ) {
          let prefixReg = new RegExp('^' + process.env.SRCPLATFORM + '\:\/\/')
          path.parentPath.traverse({
            StringLiteral(path) {
              path.node.value = path.node.value.replace(prefixReg, process.env.TARGETPLATFORM + '://')
            }
          }, path.parentPath.node.value.elements)
        }
      }
    })
    let result = prettier.format(generator(ast).code, {parser: 'babel'})
    let distPath = path.join(root, 'convertDist', process.env.TARGETPLATFORM, page) + '.' + tarConfig.fileTypes.SCRIPT
    fs.ensureDirSync(path.dirname(distPath))
    fs.writeFileSync(distPath, result, 'utf8')
  })
}