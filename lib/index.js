// const udn   = require('./udn')
// const apple = require('./apple')

const post     = require('./post')

module.exports = {
  apple: post.appleDaily.parser,
  udn:   post.udn.parser
}