"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = spider;

var _requestPromiseNative = require("request-promise-native");

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const debug = (0, _debug2.default)("spider.js");

const USER_AGENTS = {
  pc: "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
  android: "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Mobile Safari/537.36",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
  ipad: "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
};

function getHomeUrl(url) {
  if (url) {
    let a = url.match(/^https?:\/\/[^\/]*/);
    if (a) return a[0];
  }
}

exports.sleep = _util.sleep;

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

function spider(list, callback, options) {
  if (typeof list === "string") list = [list];
  let {
    spiderDelay = 0, //get delay (ms)
    spiderBrowserSim = true, //simulate a browser
    spiderBrowserSimType = "pc", //simulate browser type, available now : pc, android, iphone, ipad
    spiderComplete } = options,
      rpOptions = _objectWithoutProperties(options, ["spiderDelay", "spiderBrowserSim", "spiderBrowserSimType", "spiderComplete"]);
  if (!USER_AGENTS[spiderBrowserSimType]) {
    debug(`spiderBrowserSimType must be one of pc, android, iphone, ipad, wrong type ${spiderBrowserSimType}, change back to "pc"`);
    spiderBrowserSimType = "pc";
  }

  const next = async () => {
    if (list.length > 0) {
      let url = list.shift();
      debug(`load ${url}`);
      //添加headers模拟浏览器，防止被屏蔽
      let _rpOptions = _extends({}, rpOptions);
      if (spiderBrowserSim) {
        const headers = {
          "User-Agent": USER_AGENTS[spiderBrowserSimType],
          Referer: getHomeUrl(url)
        };
        _rpOptions.headers = _extends({}, headers, rpOptions.headers);
      }
      try {
        let result = await (0, _requestPromiseNative2.default)(_extends({
          uri: url
        }, _rpOptions));
        let newurl = callback(result, url);
        if (newurl) list.push(newurl);
      } catch (e) {
        debug(`load ${url} failed ${e}`);
      }
      if (spiderDelay > 0) await (0, _util.sleep)(spiderDelay);
      next();
    } else {
      debug("all done!");
      if (spiderComplete) spiderComplete();
    }
  };

  next();
}