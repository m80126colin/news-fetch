const chalk  = require('chalk')

const debug  = false
const logTag = (msg, tag) => { console.log(`[${tag}] ${msg}`) }

const logger  = {
  info:  msg => { logTag(msg, chalk.green(' INFO'))             },
  warn:  msg => { logTag(msg, chalk.yellow(' WARN'))            },
  error: msg => { logTag(msg, chalk.red(' ERR '))               },
  debug: msg => { debug ? logTag(msg, chalk.blue('DEBUG')) : '' }
}

module.exports = logger