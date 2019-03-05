/**
 * @file 主函数
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const config = require('./lib')
const util = require('./lib/common/util')
const excludeDir = ['convertDist', 'node_modules']
class Convert {
  constructor (platform) {
    process.env.TARGETPLATFORM = platform
    process.env.SRCPLATFORM = 'wx'
    this.tarConfig = config[platform]
    this.srcConfig = {}
    this.root = process.cwd()
    this.convertRoot = path.join(this.root, 'convertDist', platform)
    this.components = new Set()
    this.templSet = new Set()
    this.styleSet = new Set()
    this.scriptSet = new Set()
    this.jsonSet = new Set()
    this.excludeDir = excludeDir.map(dir => {
      return path.join(this.root, dir)
    })
    this.init()
  }
  init () {
    this.clearDistDir()
    this.getApp()
  }
  clearDistDir () {

  }
  getApp () {
    this.entryJSONPath = path.join(this.root, 'app.json')
    try {
      this.entryJSON = JSON.parse(fs.readFileSync(this.entryJSONPath))
      let pages = this.entryJSON['pages']
      if (!pages || !pages.length) {
        throw new Error('invalid pages config...')
      }
      process.env.SRCPLATFORM = util.getSourcePlatform(this.root, pages)
      this.pages = new Set(pages)
      this.srcConfig = config[process.env.SRCPLATFORM]
      this.entryJSPath = path.join(this.root, `app.${this.srcConfig.fileTypes.SCRIPT}`)
      this.entryStylePath = path.join(this.root, `app.${this.srcConfig.fileTypes.STYLE}`)
      if (fs.existsSync(this.entryStylePath)) {
        this.entryStyle = String(fs.readFileSync(this.entryStylePath))
      }
    } catch(e) {
      console.log(e)
      this.entryJSON = {}
      process.exit(1)
    }
  }
  getSubPackages () {

  }
  traverseAndConvert(filePath, platform) {
    let files = fs.readdirSync(filePath)
    files.forEach(filename => {
      let absFilePath = path.join(filePath, filename)
      let stats = fs.statSync(absFilePath)
      let isFile = stats.isFile()
      let isDir = stats.isDirectory()
      if (this.excludeDir.includes(absFilePath)) {
        return
      }
      if (isFile) {
        let ext = path.extname(absFilePath) && path.extname(absFilePath).substr(1)
        let extReg = new RegExp('(\\.)(' + ext + ')$', 'g')
        let relativePath = path.relative(this.root, absFilePath)
        if (ext && util.PLATFORMMAPS[ext]) {
          this.templSet.add(relativePath.replace(extReg, ''))
          return
        }
        if (ext && util.STYLESMAPS[ext]) {
          this.styleSet.add(relativePath.replace(extReg, ''))
          return
        }
        if (ext && ext === 'js') {
          this.scriptSet.add(relativePath.replace(extReg, ''))
          return
        }
        if (ext && ext === 'json' && relativePath !== 'app.json') {
          this.jsonSet.add(relativePath.replace(extReg, ''))
          return
        }
        if (relativePath === 'app.json'
          && (process.env.SRCPLATFORM === 'my'
          || process.env.TARGETPLATFORM === 'my')
        ) {
          return
        }
        let distPath = path.join(this.root, 'convertDist', process.env.TARGETPLATFORM, relativePath)
        fs.ensureDirSync(path.dirname(distPath))
        fs.createReadStream(absFilePath).pipe(fs.createWriteStream(distPath))
      }
      if (isDir) {
        this.traverseAndConvert(absFilePath, platform)
      }
    })
  }
  run () {
    if (process.env.SRCPLATFORM === process.env.TARGETPLATFORM) {
      console.log(chalk.red('目标平台与当前平台相同，请选择其它目标平台...'))
      return
    }
    console.log(chalk.green('开始遍历文件...'))
    this.traverseAndConvert(this.root, process.env.SRCPLATFORM)
    const baseOptions = {
      root: this.root,
      srcConfig: this.srcConfig,
      tarConfig: this.tarConfig
    }
    console.log(chalk.green('开始转换文件...'))
    util.templConvert(Object.assign(baseOptions, {
      pages: this.templSet
    }))
    util.styleConvert(Object.assign(baseOptions, {
      pages: this.styleSet
    }))
    util.scriptConvert(Object.assign(baseOptions, {
      pages: this.scriptSet
    }))
    util.jsonConvert(Object.assign(baseOptions, {
      pages: this.jsonSet,
      entryJSON: (process.env.SRCPLATFORM === 'my' || process.env.TARGETPLATFORM === 'my') ? this.entryJSON : ''
    }))
  }
}

module.exports = Convert;