import rp from "request-promise-native";
import cheerio from "cheerio";

import { sleep } from "./util";

const print = console.log;

export function spider(list, callback, options) {
  const next = async () => {
    if (list.length > 0) {
      let url = list.shift();
      print(`load ${url}`);
      let result = await rp({
        uri: url,
        ...options
      });
      let newurl = callback(result);
      if (newurl) list.push(newurl);
      // await sleep(5000);
      next();
    } else {
      print("all done!");
      process.exit();
    }
  };

  next();
}
