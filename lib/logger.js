const chalk   = require('chalk')

const debug   = false

const logger  = {
  info:  msg => { console.log(`[${chalk.green(' INFO')}] ${msg}`) },
  warn:  msg => { console.log(`[${chalk.yellow(' WARN')}] ${msg}`) },
  error: msg => { console.log(`[${chalk.red(' ERR ')}] ${msg}`) },
  debug: msg => { debug ? console.log(`[${chalk.blue('DEBUG')}] ${msg}`) : '' }
}

module.exports = logger