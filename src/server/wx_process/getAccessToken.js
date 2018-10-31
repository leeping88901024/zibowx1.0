var wxconfig = require('../wxconfig');
const request = require('request');
var fs = require('fs');
var https = require('https');
const qs = require('qs');

const getAccessToken = function () {
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': wxconfig.appid,
        'secret': wxconfig.appscret
    };

    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?'+qs.stringify(queryParams);
    let options = {
        method: 'GET',
        url: wxGetAccessTokenBaseUrl
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    })
};

//保存与更新
const saveToken = function () {
    getAccessToken().then(res => {
        let token = res['access_token'];
        //根据access_token获取ticket
        let options = {
            method: 'GET',
            url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+token+'&type=jsapi'
        };
        request(options, function (err, res, body) {
            if (res) {
                let data = {
                    access_token:token,
                    ticket:JSON.parse(body).ticket
                }
                fs.writeFile('src/server/wx_process/access_token.txt', JSON.stringify(data), function (err) {
                    console.log(err)
                });
            } else {
               console.log("获取ticket失败！")
            }
        });
    })
};

const refreshToken = function () {
    saveToken();
    setInterval(function () {
        saveToken();
    }, 7000*1000);
};

module.exports = refreshToken;