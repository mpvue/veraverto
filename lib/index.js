/**
 * @file platform entry
 */

const wx = require('./wx')
const swan = require('./swan')
const my = require('./my')
const tt = require('./tt')

module.exports = {
  wx,
  swan,
  tt,
  my
}