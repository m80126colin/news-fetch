const url    = require('url')
const moment = require('moment')
const _      = require('lodash')

const util = require('../util')

const extractUrl = urlstr => {
  let x = url.parse(urlstr)
  if ('ent.appledaily.com.tw' === x.hostname) {
    const y = _.split(x.pathname, '/')
    if ('enews' === y[1]) {
      const p = _.join(['/section/article/headline', y[4], y[5]], '/')
      return `http://ent.appledaily.com.tw${p}`
    }
    return urlstr
  }
  else if (null === x.hostname)
    return `${config.root}${x.path}`
  return urlstr
}

const $arraify = ($, selector, context) => Array.apply(null, $(selector, $(context)))

const $stringify = ($, selector, context) => {
  const c = $(context)
  $(selector, c).replaceWith('\n')
  return c.text()
}

const toString = ($, selector, context) => {
  const target = $(context)
  $(selector, target).replaceWith('\n')
  return _.trim( target.text() )
}

/**
 *
 */
const selector = x => x

/**
 *
 */
const parser = urlstr => util.loader(extractUrl(urlstr))
  .then($ => {
    // root
    const r = $('.abdominis')
    // data
    const headline = $('hgroup h1', r).text()
    const subtitle = $('hgroup h2', r).text()
    const time     = $('time', r).attr('datetime')
    //
    const intro    = toString($, 'br', $('#introid', r))
    // context
    const context  = $('p#bcontent,h2,figure', $('.articulum')).map((i, el) => {
      const tag = $(el).prop('tagName')
      switch (tag) {
        case 'P':
          return {
            tag: 'paragraph',
            content: toString($, 'br', el)
          }
        case 'H2':
          return {
            tag: 'section title',
            content: $(el).text()
          }
        case 'FIGURE':
          return {
            tag: 'picture',
            link: $('a', el).attr('href'),
            content: $('#caption', el).text()
          }
        default:
          return {
            tag: 'unknown'
          }
      }
    })
    .get()
    // returns
    return {
      meta: {
        headline: headline,
        subtitle: subtitle,
        time:     moment(time).format()
      },
      intro:   intro,
      article: context
    }
  })

module.exports = {
  selector: selector,
  parser:   parser
}