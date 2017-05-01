const chalk  = require('chalk')

const debug  = false
const tagLog = (msg, tag) => { console.log(`[${tag}] ${msg}`) }

const logger  = {
  info:  msg => { tagLog(msg, chalk.green(' INFO'))             },
  warn:  msg => { tagLog(msg, chalk.yellow(' WARN'))            },
  error: msg => { tagLog(msg, chalk.red(' ERR '))               },
  debug: msg => { debug ? tagLog(msg, chalk.blue('DEBUG')) : '' }
}

module.exports = logger