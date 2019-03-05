/**
 * @file baidu box config
 */

module.exports = {
  fileTypes: {
    TEMPL: 'swan',
    STYLE: 'css',
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
    'if': 's-if',
    'elif': 's-elif',
    'else': 's-else'
  },
  loopsMap: {
    'for': 's-for',
    'for-index': 's-for-index',
    'for-item': 's-for-item',
    'for-items': 's-for',
    'key': 's-key'
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