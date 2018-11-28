var WechatAPI = require('wechat-api');
var wxconfig = require('../wxconfig');
var wxmenu = require('../wxmenujson');
var loggerFile = require("../logs/loggerFile");
var api = new WechatAPI(wxconfig.appid, wxconfig.appscret);

function setMenu(mediaId,callback){

    api.getAccessToken(function (err, token) {
        console.log(err);
        console.log(token);  //accessToken
    });

    var menu = wxmenu.menuJson(mediaId);
    console.log(menu);
    api.createMenu(menu, function (err, result) {
        if(err){
            callback(err);
        }
        loggerFile.info("微信菜单设置成功"+JSON.stringify(result));
        callback(null,JSON.stringify(result));
    });
}

module.exports = setMenu;

