var express = require('express');
var router = express.Router();
var wxconfig = require('../wxconfig');
var token = require('./token');
var session = require('express-session');
var WxUserLogin = require('wechat-oauth');
var client = new WxUserLogin(wxconfig.appid, wxconfig.appscret);
var userdao =  require('./dao/userdao');
var svgCaptcha = require('svg-captcha');

/**
 * 从微信服务器获取微信用户信息
 */
router.get('/getWxUserInfoFromWx',(req,res) => {
    console.log("cookie："+req.cookies.sessionid);
    var code = req.query.code;
    client.getAccessToken(code,(err,result) => {
        if(result.errcode){
            console.log("拉取微信信息异常咯:"+result.msg)
            res.send({status:10013,message:'拉取用户信息失败'})
            return;
        }
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        client.getUser(openid,(err,result) => {
            if(err){
                res.send({status:10013,message:'拉取用户信息失败'});
            }
            var userInfo = result;
            //保存微信用户信息到session中
            var openidObj = {
                openId : userInfo.openid
            }
            //获取openid查询是否在系统中注册
            var openId = userInfo.openid;
            let user = {
                headimgurl:userInfo.headimgurl,
                openid:userInfo.openid,
                nickname:userInfo.nickname,
                nation:userInfo.country,
                province:userInfo.province,
                city:userInfo.city,
                sex:userInfo.sex,
                registdate:'',
                psn_seq:'',
                tell:''
            }
            //查询
            userdao.getUserByOpenId(openId).then((result)=> {
                console.log("我是user:"+result)
                if(result){
                    console.log("我是user:"+result);
                    result = JSON.parse(result);
                    //保存用户信息到session
                    user.psn_seq = result.PSN_SEQ;
                    user.registdate = result.REGIST_DATE;
                    //保存到session
                    req.session.user = user;
                    let resBody = {
                        status:200,
                        message:'ok',
                        tartget_url:req.session.tartget_url,
                        token:token.createToken(openidObj,7200)
                    }
                    //生成令牌发送给客户端
                    res.send(resBody);
                }else{
                    //如果没查到，保存微信信息到数据库
                    //调用数据库方法插入数据
                    userdao.insertUserInfo(user).then((result)=>{
                        //保存user到session
                        req.session.user=user;
                        let resbody = {
                            status:200,
                            message:'ok',
                            tartget_url:req.session.tartget_url,
                            token:token.createToken(openidObj,7200)
                        }
                        res.send(resbody);
                        return;
                    }).catch((err)=>{
                            console.log("拉取微信用户信息失败:"+err);
                            let resbody = {
                                status:10013,
                                message:'拉取微信用户信息失败！'+err
                            }
                            res.send(resbody);
                            return;
                        }
                    );
                }
            }).catch((err)=>{
                console.log("查询用户信息异常:"+err);
                let resbody = {
                    status:10013,
                    message:'查询用户信息异常！'+err
                }
                res.send(resbody);
                return;
            });
            console.log(userInfo);
        });
    });
});
/**
 * 发送手机验证码
 * @type {Router|router}
 */
router.get('/sendCaptcha',(req,res)=>{
    //获取手机号码
    var tell = req.query.tell;
    console.log("带来的号码是:"+tell);
    //调用验证码发送接口发送验证码
    var captcha = 123456;
    //保存到session
    req.session.tell = tell;
    req.session.captcha = captcha;
    //响应
    let resBody = {
        status:200,
        message:'ok'
    }
    //响应信息
    res.send(resBody);
});
/**
 * 发送图片验证码
 */
router.get("/getPicCatpcha",(req,res)=>{
    //生成图片验证码返回给客户端
    var captcha = svgCaptcha.create();
    req.session.picturecaptcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
});


module.exports = router;