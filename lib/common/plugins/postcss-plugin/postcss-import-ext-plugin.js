/**
 * @file 处理样式文件中import引入文件的后缀问题
 */

const postcss = require('postcss')
const path = require('path')

module.exports = postcss.plugin('postcss-import-ext-plugin', (opts) => {
  let extRegExp = new RegExp('(\\.)(' + opts.resource + ')', '')
  return function (root, result) {
    root.walkAtRules(decl => {
      let matchedArr = decl.params && decl.params.match(extRegExp)
      if (matchedArr) {
        decl.params = decl.params.replace(extRegExp, (...args) => {
          return args[1] + opts.target
        })
      }
    })
    root.walkComments(comment => {
      let matchedArr = comment.text && comment.text.match(extRegExp)
      if (matchedArr) {
        comment.text = comment.text.replace(extRegExp, (...args) => {
          return args[1] + opts.target
        })
      }
    })
  }
})