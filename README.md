# News Fetch

Crawler for Taiwan News.

## Installation

```
npm install --save news-fetch
```

## Usage

``` js
const news = require('news-fetch')

news.apple('link/to/apple/daily/news')
  .then(res => {
    console.log(res)
  })
```