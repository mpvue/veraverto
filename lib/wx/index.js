/**
 * @file weixin config
 */


module.exports = {
  fileTypes: {
    TEMPL: 'wxml',
    STYLE: 'wxss',
    SCRIPT: 'js',
    JSON: 'json'
  },
  eventTypes: {
    touchstart: 'touchstart',
    touchmove: 'touchmove',
    touchcancel: 'touchcancel',
    touchend: 'touchend',
    tap: 'tap',
    longtap: 'longtap',
    input: 'input',
    change: 'change',
    submit: 'submit',
    blur: 'blur',
    focus: 'focus',
    reset: 'reset',
    confirm: 'confirm',
    columnchange: 'columnchange',
    linechange: 'linechange',
    error: 'error',
    scrolltoupper: 'scrolltoupper',
    scrolltolower: 'scrolltolower',
    scroll: 'scroll',
    load: 'load'
  },
  conditionMap: {
    'if': 'wx:if',
    'elif': 'wx:elif',
    'else': 'wx:else'
  },
  loopsMap: {
    'for': 'wx:for',
    'for-index': 'wx:for-index',
    'for-item': 'wx:for-item',
    'for-items': 'wx:for-items',
    'key': 'wx:key'
  },
  entryJSONMap: {
    textColor: {
      name: 'color'
    },
    items: {
      name: 'list',
      item: {
        name: 'text',
        icon: 'iconPath',
        activeIcon: 'selectedIconPath'
      }
    }
  }
}