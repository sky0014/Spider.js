import rp from "request-promise-native";
import createDebug from "debug";

const debug = createDebug("spider.js");

const USER_AGENTS = {
  pc:
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
  android:
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Mobile Safari/537.36",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",
  ipad:
    "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
};

function getHomeUrl(url) {
  if (url) {
    let a = url.match(/^https?:\/\/[^\/]*/);
    if (a) return a[0];
  }
}

export function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}

/**
 * Web Spider
 * 
 * @param {Array|string} list - page urls
 * @param {function} callback - handle callback, (html,url)=>next url
 * @param {object}   options  - advanced options 
 * <pre>
 * {
    spiderDelay = 0, //get delay (ms)
    spiderBrowserSim = true, //simulate a browser
    spiderBrowserSimType = "pc", //simulate browser type, available now : pc, android, iphone, ipad
    spiderComplete, //complete callback
    ...rpOptions //other request options, see https://www.npmjs.com/package/request-promise
  }
  </pre>
 */
export default function spider(
  list,
  callback,
  {
    spiderDelay = 0, //get delay (ms)
    spiderBrowserSim = true, //simulate a browser
    spiderBrowserSimType = "pc", //simulate browser type, available now : pc, android, iphone, ipad
    spiderComplete, //complete callback
    ...rpOptions //other request options, see https://www.npmjs.com/package/request-promise
  }
) {
  if (typeof list === "string") list = [list];
  if (!USER_AGENTS[spiderBrowserSimType]) {
    debug(
      `spiderBrowserSimType must be one of pc, android, iphone, ipad, wrong type ${spiderBrowserSimType}, change back to "pc"`
    );
    spiderBrowserSimType = "pc";
  }

  const next = async () => {
    if (list.length > 0) {
      let url = list.shift();
      debug(`load ${url}`);
      //添加headers模拟浏览器，防止被屏蔽
      let _rpOptions = { ...rpOptions };
      if (spiderBrowserSim) {
        const headers = {
          "User-Agent": USER_AGENTS[spiderBrowserSimType],
          Referer: getHomeUrl(url)
        };
        _rpOptions.headers = { ...headers, ...rpOptions.headers };
      }
      try {
        let result = await rp({
          uri: url,
          ..._rpOptions
        });
        let newurl = callback(result, url);
        if (newurl) list.push(newurl);
      } catch (e) {
        debug(`load ${url} failed ${e}`);
      }
      if (spiderDelay > 0) await sleep(spiderDelay);
      next();
    } else {
      debug("all done!");
      if (spiderComplete) spiderComplete();
    }
  };

  next();
}
