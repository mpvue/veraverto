#! /usr/bin/env node

const Convert = require('../main')
const program = require('commander')
const package = require('../package.json')
const platforms = ['wx', 'swan', 'tt', 'my']

function showAllPlatForms () {
  console.log('current platforms includes:wx,swan,tt,my');
}

function runConvert (val) {
  if (!platforms.includes(val)) {
    throw new Error('invalid value, get valid value by command veraverto -p')
    process.exit(1)
  }
  const convert = new Convert(val);
  convert.run()
}

program
  .version(package.version, '-v, --version')
  .option('-p, --platforms', 'all support platforms', showAllPlatForms)
  .option('-t, --target [value]', 'target platform', runConvert)

program.on('--help', () => {
  console.log('')
  console.log('Examples:')
  console.log(' $ veraverto -t swan')
})

program.parse(process.argv)