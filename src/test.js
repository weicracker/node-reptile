var http = require('http');      // http 网路
var cheerio = require('cheerio');  // html 解析
var fs = require("fs");        // 流

// 设置被查询的目标网址
var queryHref = "http://www.haha.mx/topic/1/new/";   
// 设置分页位置
var querySearch = 1;                

var urls = [];


/**
 * 根据url和参数获取分页内容
 * @param {String}： url
 * @param {int}： serach
 */
function getHtml(href, serach) {
  var pageData = "";
  var req = http.get(href + serach, function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      pageData += chunk;
    });

    res.on('end', function() {
      $ = cheerio.load(pageData);
      var html = $(".joke-list-item .joke-main-content a img");

      for(var i = 0; i < html.length; i++) {
        var src = html[i].attribs.src;
        // 筛选部分广告，不是真的段子
        if (src.indexOf("http://image.haha.mx") > -1) {
          urls.push(html[i].attribs.src)
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
    });
  });
}


/**
 * 下载图片
 * @param {String} imgurl：图片地址
 */
function downImg(imgurl) {
  var narr = imgurl.replace("http://image.haha.mx/", "").split("/")
  
  http.get(imgurl.replace("/small/", "/big/"), function(res) {
    var imgData = "";
    //一定要设置response的编码为binary否则会下载下来的图片打不开
    res.setEncoding("binary"); 

    res.on("data", function(chunk) {
      imgData += chunk;
    });
    
    res.on("end", function() {
      var savePath = "./" + narr[0]  + narr[1] + narr[2] + "_" + narr[4];
      fs.writeFile(savePath, imgData, "binary", function(err) {
        if(err) {
          console.log(err);
        }  else {
          console.log(narr[0]  + narr[1] + narr[2] + "_" + narr[4]);
          if (urls.length > 0) {
            downImg(urls.shift());
          } else {
            console.log("下载完毕");
          }
        }
      });
    });
  });
}

var pagemax = 2;    // 获取10页的内容
function start(){
  console.log("开始获取图片连接");
  for (var i = 1 ; i <= pagemax ; i++) {
    getHtml(queryHref, i);
  }
}

start();