var crypto = require('crypto');
var fs = require("fs");
const sha1 = require('sha1')

const createNonceStr = () => Math.random().toString(36).substr(2, 15);
const createTimeStamp = () => parseInt(new Date().getTime() / 1000) + '';
const calcSignature = function (ticket, noncestr, ts, url) {
    var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;  // (第一步设置的域名+接口)
    shaObj = sha1(str);
    console.log("要加密的str=="+str);
    return shaObj;
}

//获取tick
var genetateSign = function genetateSign(url){
        return new Promise((resolve, reject) => {
            fs.readFile('src/server/wx_process/access_token.txt', 'utf-8', function(err, data) {
                // 读取文件失败/错误
                if (err) {
                    reject(err);
                }
                const noncestr = createNonceStr();
                const timestamp = createTimeStamp();
                const signature = calcSignature(JSON.parse(data).ticket, noncestr, timestamp, url);  // 通过sha1算法得到
                let sign = {
                    noncestr:noncestr,
                    timestamp:timestamp,
                    signature:signature
                }
                // 读取文件成功
                resolve(sign);
            });
        })

}

module.exports =genetateSign;