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
//test
spider(
  "your start url or url list",
  html => {
    //your handle code    
  }
);
```

## Debug Info
```bash
set DEBUG=*,-spider.js    # hide debug info, see https://www.npmjs.com/package/debug
```