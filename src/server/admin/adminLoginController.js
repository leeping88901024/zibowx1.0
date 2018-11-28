var express = require('express');
var router = express.Router();
var session = require('express-session');
const NodeRSA = require('node-rsa')
const fs = require('fs');


/**
 * 生成公钥密钥
 */
router.get("/generateKey",(req,res)=>{
// Generate new 512bit-length key
    try {
        var key = new NodeRSA({b: 512})
        key.setOptions({encryptionScheme: 'pkcs1'})

        var privatePem = key.exportKey('pkcs1-private-pem')
        var publicDer = key.exportKey('pkcs8-public-der')
        var publicDerStr = publicDer.toString('base64');

        //保存公钥密钥到内存
        req.session.privatePem = privatePem;
        req.session.publicDerStr = publicDerStr;

        //返回公钥给客户端

        let resBody = {
            status:200,
            message:'ok',
            data:publicDerStr
        }
        res.send(resBody);
        return
    }catch (e) {
        let resBody = {
            status:10017,
            message:'获取公钥失败',
        }
        res.send(resBody);
        return
    }
});
/**
 * 用户登录
 */
router.post("/adminLogin",(req,res)=>{
    //获取参数
    var reqBody = req.body;
    console.log(JSON.stringify(reqBody));

    //验证信息
    var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
    //对用户名吗，密码进行校验
    if (!reqBody.username || !uPattern.test(reqBody.username)) {
        let resBody = {
            status:10018,
            message:'用户名无效'
        }
        return
    }
    //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
    var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
    if (!reqBody.password || !pPattern.test(reqBody.password)) {
       let resBody = {
           status:10018,
           message:'密码错误'
       }
        return
    }


    let resBody = {
        status:200,
        message:'ok'
    }
    res.send(resBody);
    return
});
/**
 * 加载管理员用户信息
 * @type {Router|router}
 */
router.get('/loadAdminUser',(req,res)=>{

});
//检查用户名是否存在
router.get("/isExitUsername",(req,res)=>{
    
});


module.exports = router;