/*
 * @Author: jiwei 
 * @Date: 2017-01-20 12:59:08 
 * @Last Modified by: jiwei
 * @Last Modified time: 2017-01-20 14:02:43
 */
/**
 * http 服务
*/
import http = require("http");
/**
 * http 所请求的html 解析服务
 * */
import cheerio = require("cheerio");
/*
*文件处理读取服务
*/
import fs = require("fs");
import path = require("path");
// 设置被爬虫爬取 目标网址
const queryHref: string = "http://www.haha.mx/topic/1/new/";

// 设置分页位置
let querySearch: number = 1;
let urls: Array<any> = [];
let pagemax: number = 2;
//
// ─── GETHTML FUNCTION ───────────────────────────────────────────────────────────
//
const getHtml = (href: string, serach: number) => {
    let serachPage = serach.toString();
    let pagePath: string = path.join(href, serachPage);
    let pageData: string = "";
    const request = http.get(href + serach, (res: any) => {
        res.setEncoding('utf8');
        res.on("data", (chunk: any) => {
            pageData += chunk;
        })
        res.on('end', () => {
            let $: any = cheerio.load(pageData);
            let html: NodeList = $(".joke-list-item .joke-main-content a img");
            for (let i = 0; i < html.length; i++) {
                let src: string = $(html[i]).attr('src');
                // 筛选部分广告，不是真的段子
                if (src.indexOf("http://image.haha.mx") > -1) {
                    urls.push($(html[i]).attr('src'));
                }
            }
            if (serach == pagemax) {
                console.log("图片链接获取完毕！" + urls.length);
                console.log("链接总数量：" + urls.length);
                if (urls.length > 0) {
                    downImg(urls.shift());
                } else {
                    console.log("下载完毕");
                }
            }
        })
    })
};
// ────────────────────────────────────────────────────────────────────────────────
//
// ─── DOWNIMG FUNCITON ───────────────────────────────────────────────────────────
//

const downImg = (imgurl: string) => {
    let narr: any[] = imgurl.replace("http://image.haha.mx/", "").split("/");
    http.get(imgurl.replace("/small/", "/big/"), (res: any) => {
        let imgData = "";
        res.setEncoding("binary");
        res.on("data", (chunk: any) => {
            imgData += chunk;
        })
        res.on("end", () => {
            let savePath: string = "./" + narr[0]  + narr[1] + narr[2] + "_" + narr[4];
            fs.writeFile(savePath, imgData, "binary", (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(narr[0] + narr[1] + narr[2] + "_" + narr[4]);
                    if (urls.length > 0) {
                        downImg(urls.shift());
                    } else {
                        console.log("下载完毕");
                    }
                }
            })
        })
    }
};
// ────────────────────────────────────────────────────────────────────────────────
//
// ─── START FUNCTION ─────────────────────────────────────────────────────────────
//


const start = () => {
    console.log("开始获取图片连接");
    for (let i = 1; i <= pagemax; i++) {
        getHtml(queryHref, i);
    }
}
// ────────────────────────────────────────────────────────────────────────────────

start();



