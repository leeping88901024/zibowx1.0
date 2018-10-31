var express = require('express');
var router = express.Router();
var wxconfig = require('../config/wxconfig');

var OAuth = require('wechat-oauth');
var client = new OAuth(wxconfig.appid, wxconfig.appscret);

router.get('/wx',(req,res) => {
    var domain = wxconfig.domain;
    var auth_callback_url = domain + '/loginwx/callback';
    var state = wxconfig.state;
    var url = client.getAuthorizeURL(auth_callback_url,state,'snsapi_userinfo');
    res.send({
        url: url
    });
});

router.get('/callback',(req,res) => {
    var code = req.query.code;
    client.getAccessToken(code,(err,result) => {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        // 
        client.getUser(openid,(err,result) => {
            var userInfo = result;
            console.log(userInfo);
            res.json(userInfo);
        });
    });
});

module.exports = router;