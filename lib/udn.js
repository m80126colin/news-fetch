const url    = require('url')
const moment = require('moment')
const _      = require('lodash')
const qs     = require('querystring')

const loader = require('./loader')

/**
 *
 */
const post = urlstr => {
  return loader(urlstr).then($ => {
    // root
    const r        = $('#story_body')
    // data
    const headline = $('#story_art_title', r).text()
    const tags     = $('#story_tags a', r)
      .clone()
      .map((i, el) => $(el).text())
      .get()
    const time    = $('.story_bady_info_author', r)
      .clone()
      .children()
      .remove()
      .end()
      .text()
    const author  = $('.story_bady_info_author span', r).text()
    const context = $('#story_body_content .video-container,figure.photo-story,p:not(:has(*),:empty),h1,h2', r)
      .map((i, el) => {
        const tag = $(el).prop('tagName')
        switch (tag) {
          case 'P':
            return {
              tag: 'paragraph',
              content: _.trim($(el).text())
            }
          case 'H1':
            return {
              tag: 'headline',
              content: $(el).text()
            }
          case 'H2':
            return {
              tag: 'section title',
              content: _.chain($(el).text()).invoke('substr', 1).trim().value()
            }
          case 'FIGURE':
            return {
              tag: 'picture',
              link: url.parse($('a', el).attr('href'), true).query.u,
              content: $('figcaption', el).text()
            }
          default:
            return {
              tag:  'multimedia',
              link: $('iframe', el).attr('src')
            }
        }
      })
      .get()
    return {
      meta: {
        headline: headline,
        tags:     tags,
        time:     moment(time).format(),
        author:   author
      },
      article: context
    }
  })
}

module.exports = {
  post: post
}