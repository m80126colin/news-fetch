const request = require('request-promise')
const errors  = require('request-promise/errors')
const cheerio = require('cheerio')
const chalk   = require('chalk')
const _       = require('lodash')

const debug   = false

const logger  = {
  info:  msg => { console.log(`[${chalk.green(' INFO')}] ${msg}`) },
  warn:  msg => { console.log(`[${chalk.yellow(' WARN')}] ${msg}`) },
  error: msg => { console.log(`[${chalk.red(' ERR ')}] ${msg}`) },
  debug: msg => { debug ? console.log(`[${chalk.blue('DEBUG')}] ${msg}`) : '' }
}

/**
 *  @param {function} selector(data)
 *  @param {function} processor
 */
const pageloader = (url, processor) => {
  logger.info(`Start url: ${url}`)
  return request
    .get({
      uri:       url,
      transform: body => cheerio.load(body)
    })
    .then($ => {
      processor = processor || _.identity
      logger.info('Retrieve and process data.')
      return processor($)
    })
    .catch(errors.StatusCodeError, reason => {
      logger.warn(`Status code: ${reason.statusCode}`)
      logger.warn(reason)
    })
    .catch(errors.RequestError, reason => {
      logger.error(`Request error.`)
      logger.error(reason)
    })
}

module.exports = pageloader