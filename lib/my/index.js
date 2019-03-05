
/**
 * @file alipay config
 */

module.exports = {
  fileTypes: {
    TEMPL: 'axml',
    STYLE: 'acss',
    SCRIPT: 'js',
    JSON: 'json'
  },
  eventTypes: {
    touchstart: 'TouchStart',
    touchmove: 'TouchMove',
    touchcancel: 'TouchCancel',
    touchend: 'TouchEnd',
    tap: 'Tap',
    longtap: 'LongTap',
    input: 'Input',
    change: 'Change',
    submit: 'Submit',
    blur: 'Blur',
    focus: 'Focus',
    reset: 'Reset',
    confirm: 'Confirm',
    columnchange: 'ColumnChange',
    linechange: 'LineChange',
    error: 'Error',
    scrolltoupper: 'ScrollToUpper',
    scrolltolower: 'ScrollToLower',
    scroll: 'Scroll',
    load: 'Load'
  },
  conditionMap: {
    'if': 'a:if',
    'elif': 'a:elif',
    'else': 'a:else'
  },
  loopsMap: {
    'for': 'a:for',
    'for-index': 'a:for-index',
    'for-item': 'a:for-item',
    'for-items': 'a:for',
    'key': 'a:key'
  },
  entryJSONMap: {
    color: {
      name: 'textColor'
    },
    list: {
      name: 'items',
      item: {
        text: 'name',
        iconPath: 'icon',
        selectedIconPath: 'activeIcon'
      }
    }
  }
}