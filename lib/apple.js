const url    = require('url')
const moment = require('moment')
const _      = require('lodash')

const loader = require('./loader')

/**
 *
 */
const config = {
  root: 'http://www.appledaily.com.tw'
}

/**
 *
 */
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

/**
 *
 */
const $arraify = ($, selector, context) => Array.apply(null, $(selector, $(context)))

const $stringify = ($, selector, context) => {
  const c = $(context)
  $(selector, c).replaceWith('\n')
  return c.text()
}

/**
 *
 */
_.mixin({
  filterIndex: (arr, f) => _.chain(arr)
    .map((v, i) => [v, i])
    .filter( et => f(et[0]) )
    .map(et => et[1])
    .value(),
  adjacentPair: arr => _.chain(arr)
    .initial()
    .zip(_.tail(arr))
    .value()
})

/**
 *
 */
const realtimesPost = urlstr => loader(extractUrl(urlstr))
  .then($ => $stringify($, 'span, br', '#summary'))

/**
 *
 */
const dailyList = raw_date => {
  const date   = moment(raw_date).format('YYYYMMDD')
  const urlstr = `${config.root}/appledaily/archive/${date}`
  return loader(urlstr).then($ => {
    const s = $arraify($, 'header, article', '#coverstory .abdominis')
    const header = _.filterIndex(s, v => 'header' === v.name)
    header.push(s.length)
    return _.chain(header)
      .adjacentPair()
      .flatMapDeep(x => _.chain(s)
        .slice(x[0] + 1, x[1])
        .map(article => _.map(
          $arraify($, 'ul li > a', article),
          link => {
            return {
              link:  extractUrl( $(link).attr('href') ),
              title: $(link).attr('title'),
              meta: {
                cate: _.trim( $('h1', $(s[ x[0] ])).text() ),
                sub:  _.trim( $('h2', $(article)).text() )
              }
            }
          })
        )
        .value()
      )
      .value()
  })
}

/**
 *
 */
const dailyPost = urlstr => loader(extractUrl(urlstr))
  .then($ => {
    return _.map(
      $arraify($, 'p, h2', 'div.articulum'),
      el => {
        return {
          type: $(el).attr('id'),
          text: $stringify($, 'br', el)
        }
      }
    )
  })

/**
 *
 */
module.exports = {
  realtimes: {
    post: realtimesPost
  },
  daily: {
    list: dailyList,
    post: dailyPost
  }
}