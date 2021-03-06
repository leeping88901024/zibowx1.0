var express = require('express');
var router = express.Router();
var session = require('express-session');
var testResultDao = require('./testResultDao');
//日志
var loggerFile = require("../logs/loggerFile");


router.get('/queryTestResult',(req,res)=>{
    //获取session中的用户信息
    var user = req.session.user;
    //
    if(user == null){
        let resBody = {
            status : 10014,
            message:'会话已失效'
        }
        res.send(resBody)
        return
    }
    var psnSeq = user.psn_seq;
    if(psnSeq == null ){
        let resBody = {
            status : 10024,
            message:'未进行献血者认证'
        }
        res.send(resBody)
        return
    }
    //调用dao查询
    testResultDao.queryTestResult(psnSeq).then((result)=>{
        if(result == null){
            let resBody = {
                status : 10019,
                message:'查询结果为空，要保证信息正确哦'
            }
            res.send(resBody)
            return
        }
        //校验电话号码是否为献血者
        let resBody = {
            status : 200,
            message:'ok',
            data:result
        }
        res.send(resBody)
        return
    }).catch((err)=>{
        loggerFile.error("来自testResultController:"+err);
        let resBody = {
            status : 10020,
            message:'查询出错'+err
        }
        res.send(resBody)
        return
    })
})


module.exports = router;