const pageloader = require('./pageloader')

const realtimes = url => {
  return pageloader(url, $ => {
    const s = $('#summary')
    $('span, br', s).replaceWith('\n')
    return s.text()
  })
}

module.exports = {
  realtimes: realtimes
}