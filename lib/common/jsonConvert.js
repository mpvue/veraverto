/**
 * @file 页面配置文件转换
 */

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const prettier = require('prettier')
const urlRegExp = /^(\.|\/)/

exports.convertJSON = function ({root, pages, srcConfig, tarConfig, entryJSON}) {
  console.log(chalk.green('开始转换json文件'))
  if (entryJSON && entryJSON['tabBar']) {
    let tempEntryJson = Object.assign({}, entryJSON)
    let _config = process.env.SRCPLATFORM === 'my' ?  srcConfig.entryJSONMap : tarConfig.entryJSONMap
    let keys = Object.keys(_config)
    keys.forEach(key => {
      let mapKey = _config[key].name
      let itemMap = _config[key].item
      tempEntryJson['tabBar'][mapKey] = tempEntryJson['tabBar'][key]
      if (itemMap) {
        let itemKeys = Object.keys(itemMap)
        tempEntryJson['tabBar'][mapKey].map(obj => {
          itemKeys.forEach(itemKey => {
            if (obj[itemKey]) {
              let itemKeyMap = itemMap[itemKey]
              obj[itemKeyMap] = obj[itemKey]
              delete obj[itemKey]
            }
          })
          return obj
        })
      }
      delete tempEntryJson['tabBar'][key]
    })
    let result = prettier.format(JSON.stringify(tempEntryJson), {parser: 'json-stringify'})
    let distPath = path.join(root, 'convertDist', process.env.TARGETPLATFORM, 'app') + '.' + tarConfig.fileTypes.JSON
    fs.ensureDirSync(path.dirname(distPath))
    fs.writeFileSync(distPath, result, 'utf8')
  }
  pages.forEach(page => {
    let pagePath = path.join(root, page)
    let pageConfigPath = pagePath + '.' + srcConfig.fileTypes.JSON
    let result = ''
    if (process.env.TARGETPLATFORM === 'my') {
      let jsonConfig = JSON.parse(fs.readFileSync(pageConfigPath))
      if (jsonConfig.usingComponents) {
        let allComponents = Object.keys(jsonConfig.usingComponents)
        allComponents.forEach(component => {
          if (!component.match(urlRegExp)) {
            jsonConfig.usingComponents[component] = './' + jsonConfig.usingComponents[component]
          }
        })
      }
      result = JSON.stringify(jsonConfig)
    }
    let distPath = path.join(root, 'convertDist', process.env.TARGETPLATFORM, page) + '.' + srcConfig.fileTypes.JSON
    fs.ensureDirSync(path.dirname(distPath))
    if (process.env.TARGETPLATFORM === 'my') {
      let formatResult = prettier.format(result, {parser: 'json-stringify'})
      fs.writeFileSync(distPath, formatResult, 'utf8')
      return
    }
    fs.createReadStream(pageConfigPath).pipe(fs.createWriteStream(distPath))
  })
}