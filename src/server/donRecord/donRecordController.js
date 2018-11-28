var express = require('express');
var router = express.Router();
var session = require('express-session');
var donRecordDao = require('./donRecordDao');
//日志
var loggerFile = require("../logs/loggerFile");

router.post('/queryDonRecord',(req,res)=>{

    var tell = req.body.tell;
    var captcha = req.body.captcha;

    //表单数据验证
    //献血者手机号码
    var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!tellReg.test(tell)) {
        let resBody = {
            status : 10018,
            message:'请输入正确的手机号码'
        }
        res.send(resBody)
        return
    }else{
        //验证手机号码是否为接收验证码的手机
        var session_tell = req.session.tell;
        if(session_tell != tell){
            let resBody = {
                status : 10011,
                message:'请使用接收验证码相同的手机号'
            }
            res.send(resBody)
            return
        }
    }
    //验证码
    if(!captcha){
        let resBody = {
            status : 10018,
            message:'验证码不能为空'
        }
        res.send(resBody)
        return
    }else{
        //验证验证码是否正确
        var sess_captcha = req.session.captcha;
        if(sess_captcha != captcha){
            let resBody = {
                status : 201,
                message:'验证码错误'
            }
            res.send(resBody)
            return
        }
    }

    function veryName(result){
        var flag = false;
        result.forEach((item,i)=>{
            if(JSON.parse(item).PSN_NAME == name){
                flag = true;
            }
        })

        return flag;
    }

    //获取session中的user
    var user = req.session.user;
    if(user == null){
        let resBody = {
            status:1024,
            message:'未进行微信授权'
        }
        res.send(resBody);
        return
    }

    //调用dao查询
    donRecordDao.queryDonRecord(user.psn_seq).then((result)=>{

        //保存结果到session
        req.session.recordResult = result;
        let resBody = {
            status : 200,
            message:'ok',
        }
        res.send(resBody)
        return
    }).catch((err)=>{
        loggerFile.error("来自donRecordController:"+err);
        let resBody = {
            status : 10020,
            message:'查询出错'+err
        }
        res.send(resBody)
        return
    })
})

router.get('/recordResult',(req,res)=>{
    //获取session中的user
    var user = req.session.user;
    if(user == null){
        let resBody = {
            status:1024,
            message:'未进行微信授权'
        }
        res.send(resBody);
        return
    }
    var psnSeq = user.psn_seq;
    if(psnSeq == null ){
        let resBody = {
            status : 10025,
            message:'未进行献血者认证'
        }
        res.send(resBody)
        return
    }
    //调用dao查询
    donRecordDao.queryDonRecord(psnSeq).then((result)=>{
        if(result == null){
            let resBody = {
                status:10019,
                message:'查询结果为空'
            }
            res.send(resBody);
            return
        }
        //对result做处理方便渲染
        var statistics = {
            maVolume : '',
            wbVolume : ''
        };
        result.forEach((record,i)=>{
            if(JSON.parse(record).PHLE_TYPE == 1){
                statistics.maVolume = JSON.parse(record).SUM_ACTUAL_VOLUME;
            }else {
                statistics.wbVolume = JSON.parse(record).SUM_ACTUAL_VOLUME;
            }
        })
        var resData = {
            statistics:statistics,
            records:result
        }

        let resbody = {
            status:200,
            message:'ok',
            data:resData
        }
        res.send(resbody);
        return
    }).catch((err)=>{
        loggerFile.error("来自donRecordController:检测结果查询异常"+err);
        let resBody = {
                status:10019,
                message:'检测结果查询异常'
            }
            res.send(resBody);
            return
    })
})

module.exports = router;