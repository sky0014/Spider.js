import rp from "request-promise-native";
import cheerio from "cheerio";

import { sleep } from "./util";

const print = console.log;

export default function spider(list, callback, options) {
    const next = async() => {
        if (list.length > 0) {
            let url = list.shift();
            print(`load ${url}`);
            try {
                let result = await rp({
                    uri: url,
                    ...options
                });
                let newurl = callback(result);
                if (newurl) list.push(newurl);
            } catch (e) {
                print(`load ${url} failed ${e}`);
            }
            await sleep(1000);
            next();
        } else {
            print("all done!");
            process.exit();
        }
    };

    next();
}