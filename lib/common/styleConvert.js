/**
 * @file 样式文件转换
 */

const fs = require('fs-extra')
const path = require('path')
const postcss = require('postcss')
const copyAssets = require('postcss-copy-assets')
const importExtPlugin = require('./plugins/postcss-plugin/postcss-import-ext-plugin')
const chalk = require('chalk')

function convertAllStyles({root, pages, srcConfig, tarConfig}) {
  console.log(chalk.green('开始转换样式文件'))
  pages.forEach(page => {
    let pagePath = path.join(root, page)
    let pageStylePath = pagePath + '.' + srcConfig.fileTypes.STYLE
    let distPath = path.join(root, 'convertDist', process.env.TARGETPLATFORM, page) + '.' + tarConfig.fileTypes.STYLE
    if (fs.existsSync(pageStylePath)) {
      fs.readFile(pageStylePath, (err, css) => {
        postcss([copyAssets({ base: 'convertDist/' + process.env.TARGETPLATFORM  }), importExtPlugin({resource: srcConfig.fileTypes.STYLE, target: tarConfig.fileTypes.STYLE})])
          .process(css, {from: pageStylePath, to: distPath})
          .then(result => {
            fs.ensureDirSync(path.dirname(distPath))
            fs.writeFileSync(distPath, result.css)
          })
      })
    }
  })
}

exports.convertStyle = convertAllStyles