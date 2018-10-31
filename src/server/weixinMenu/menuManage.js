var WechatAPI = require('wechat-api');
var wxconfig = require('../wxconfig');
var wxmenu = require('../wxmenujson');

var api = new WechatAPI(wxconfig.appid, wxconfig.appscret);

api.getAccessToken(function (err, token) {
    console.log(err);
    console.log(token);  //accessToken
});

var menu = JSON.stringify(wxmenu);
api.createMenu(menu, function (err, result) {
    console.log(result); // { errcode: 0, errmsg: 'ok' }
});


