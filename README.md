# spider.js
A simple node spider

## Install
```bash
npm install a-spider --save
```

## Usage

* Definition
```js
/**
 * 
 * @param {Array|string} list page urls
 * @param {function} callback handle callback, (html,url)=>next url
 * @param {object} options 
 * {
    spiderDelay = 0, //get delay (ms)
    spiderBrowserSim = true, //simulate a browser
    spiderBrowserSimType = "pc", //simulate browser type, available now : pc, android, iphone, ipad
    spiderComplete, //complete callback
    ...rpOptions //other request options, see https://www.npmjs.com/package/request-promise
  }
 */
export default function spider(list, callback, options) 
```

* Example
```js
var spider = require("a-spider");
var cheerio = require("cheerio");
//test
spider(
  "http://www.gamersky.com/ent/201706/916302.shtml",
  html => {
    const $ = cheerio.load(html);
    const next = $(".page_css b").next().attr("href");
    return next;
  },
  {
    spiderDelay: 1000
  }
);
```
