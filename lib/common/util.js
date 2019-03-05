
const fs = require('fs')
const path = require('path')
const templHandler = require('./templConvert')
const styleHandler = require('./styleConvert')
const scriptHandler = require('./scriptConvert')
const jsonHandler = require('./jsonConvert')

const PLATFORMMAPS = {
  'wxml': 'wx',
  'swan': 'swan',
  'ttml': 'tt',
  'axml': 'my'
}

const STYLESMAPS = {
  'wxss': 'wx',
  'css': 'swan',
  'ttss': 'tt',
  'acss': 'my'
}

exports.getSourcePlatform = function (rootPath, pages) {
  let platform = ''
  let pageDirArr = pages[0].split('/')
  pageDirArr.pop()
  let absDirPath = path.join(rootPath, pageDirArr.join('/'))
  let files = fs.readdirSync(absDirPath)
  files.forEach((file) => {
    if (platform) {
      return
    }
    let ext = path.extname(file) && path.extname(file).substr(1)
    if (ext && PLATFORMMAPS[ext]) {
      platform = PLATFORMMAPS[ext]
    }
  })
  return platform
}

exports.templConvert = templHandler.convertTemplate

exports.styleConvert = styleHandler.convertStyle

exports.scriptConvert = scriptHandler.convertScript

exports.jsonConvert = jsonHandler.convertJSON

exports.PLATFORMMAPS = PLATFORMMAPS

exports.STYLESMAPS = STYLESMAPS
