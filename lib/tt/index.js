/**
 * @file toutiao config
 */

module.exports = {
  fileTypes: {
    TEMPL: 'ttml',
    STYLE: 'ttss',
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
    'if': 'tt:if',
    'elif': 'tt:elif',
    'else': 'tt:else'
  },
  loopsMap: {
    'for': 'tt:for',
    'for-index': 'tt:for-index',
    'for-item': 'tt:for-item',
    'for-items': 'tt:for',
    'key': 'tt:key'
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