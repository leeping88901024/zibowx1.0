var express = require('express');
var router = express.Router();
var session = require('express-session');
var userdao =  require('./dao/userdao');
var commonModule =  require('../commonModule');

/**
 * 验证用户是否进行献血者认证
 */
router.get('/isDonorAuth',(req,res) => {
    //从session中得到user
    var user = req.session.user;
    if(user != null ) {
        //获取psn_seq
        let psn_seq = user.psn_seq;
        console.log(psn_seq+":这个opsn_seq是多少")
        if (psn_seq !=  null) {
            let resBody = {
                status: 200,
                message: 'ok'
            }
            res.send(resBody);
            return

        } else {
            let resBody = {
                status: 10025,
                message: '未进行献血者认证'
            }
            res.send(resBody);
            return
        }
    }
});
/*
返回微信用户信息给客户端
 */
router.get('/getWxUserInfo', (req,res)=> {
    //congsession中获取微信信息返回
    var wxUser = req.session.user;
    if(wxUser){
        var wx = {
            nickname:wxUser.nickname,
            headimgurl:wxUser.headimgurl
        }
        let resBody = {
            status:200,
            message:'ok',
            data:wx
        }
        //响应信息
        res.send(resBody);
    }else{
        let resBody = {
            status:10013,
            message:'拉取用户信息失败'
        }
        //响应信息
        res.send(resBody);
    }
});
/**
 * 献血者认证//手机号认证
 */
router.post('/regist',function (req,res) {
    var name = req.body.name;
    var idcard = req.body.idcard;
    var certiType = req.body.certtype;
    var idCardSeq = req.body.idcardSeq;
    //获取提交的参数
    var tell = req.body.tell;
    var captcha = req.body.captcha;
    //获取session中的数据
    var sessTell = req.session.tell;
    var sessCapt = req.session.captcha;
    //判断是否存在


    if(sessTell === undefined|| sessCapt === undefined){
        let resbody = {
            status:10014,
            message:'会话已失效！'
        }
        res.send(resbody);
        return;
    }
    //验证手机号和验证码是否正确
    if(sessTell != tell){

        let resbody = {
            status:10015,
            message:'请使用接受验证码相同的手机号！'
        }
        res.send(resbody);
        return;
    }

    //验证验证码是否正确
    if(captcha != sessCapt){
        let resbody = {
            status:201,
            message:'验证码错误！'
        }
        res.send(resbody);
        return;
    }
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!name || !regName.test(name)) {
        let resbody = {
            status:10018,
            message:'请填写和身份证一致的姓名！'
        }
        res.send(resbody);
        return;
    }
    //如果相等说明使用了身份证
    if(certiType == idCardSeq){
        if(!idcard || !commonModule.IdentityCodeValid(idcard)){
            let resBody = {
                status:10018,
                message:'身份证号有误'
            }
            res.send(resBody)
            return
        }
    }else {
        if(!idcard ){
            let resBody = {
                status:10018,
                message:'证件号码不能为空'
            }
            res.send(resBody)
            return
        }
    }

//根据身份证号查询用户psn_seq
    userdao.getPsnSeqByIdcard(idCardSeq == certiType,certiType,idcard).then((result)=>{
        if(result.length == 0){
            let resBody = {
                status: 10019,
                message: '你还没在淄博市献过血哦,无法认证成为献血者'
            }
            res.send(resBody);
            return
        }
        //获取微信用户信息
        var user = req.session.user;
        if(user != null){
            user.psn_seq =  JSON.parse(result[0]).PSN_SEQ;
            user.tell = tell;
            //验证手机号
            if(tell != JSON.parse(result[0]).CELL_CALL){
                let resBody = {
                    status: 10019,
                    message: '您好，请使用最近一次献血使用的手机号'
                }
                res.send(resBody);
                return
                }

            //跟新用户信息到数据库
            userdao.updateUserInfo(user.openid,user.tell,user.psn_seq).then((result)=>{
                //保存user到session
                req.session.user=user;
                let resbody = {
                    status:200,
                    message:'ok'
                }
                res.send(resbody);
                return;
            }).catch((err)=>{
                    console.log("献血者认证出现错误:"+err);
                    let resbody = {
                        status:10016,
                        message:'认证失败！'+err
                    }
                    res.send(resbody);
                    return;
                }
            );

        }else {
            let resbody = {
                status:10014,
                message:'会话已失效'
            }
            res.send(resbody);
            return;
        }
    }).catch((err)=>{
        console.log("查询用户seq出错来自:donorAuth");
        let resbody = {
            status:500,
            message:'服务器出错'+err
        }
        res.send(resbody);
        return;
    })
});
/**
 * 献血者认证//献血编号认证
 */
router.post('/donAuthByDonId',function (req,res) {
    var name = req.body.name;
    var idcard = req.body.idcard;
    var certiType = req.body.certtype;
    var idCardSeq = req.body.idcardSeq;
    //获取提交的参数
    var donId = req.body.donId;
    var p_picturecaptcha = req.body.picturecaptcha;
    //获取session中的数据
    var s_picturecaptcha = req.session.picturecaptcha;

    if(s_picturecaptcha == undefined){

        let resbody = {
            status:10014,
            message:'会话已失效！'
        }
        res.send(resbody);
        return;
    }
    //验证验证码是否正确
    if(p_picturecaptcha.toUpperCase() != s_picturecaptcha.toUpperCase()){
        let resbody = {
            status:201,
            message:'验证码错误！'
        }
        res.send(resbody);
        return;
    }

    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!name || !regName.test(name)) {
        let resbody = {
            status:10018,
            message:'请填写和身份证一致的姓名！'
        }
        res.send(resbody);
        return;
    }
    //如果相等说明使用了身份证
    if(certiType == idCardSeq){
        if(!idcard || !commonModule.IdentityCodeValid(idcard)){
            let resBody = {
                status:10018,
                message:'身份证号有误'
            }
            res.send(resBody)
            return
        }
    }else {
        if(!idcard ){
            let resBody = {
                status:10018,
                message:'证件号码不能为空'
            }
            res.send(resBody)
            return
        }
    }

    //验证验证码是否正确
    if(!donId){
        let resbody = {
            status:10018,
            message:'请输入献血编号'
        }
        res.send(resbody);
        return;
    }


//根据身份证号查询用户psn_seq
    userdao.getPsnSeqByIdcard(idCardSeq == certiType,certiType,idcard).then((result)=>{
        if(result.length == 0){
            let resBody = {
                status: 10019,
                message: '你还没在淄博市献过血哦,无法认证成为献血者'
            }
            res.send(resBody);
            return
        }
        //获取微信用户信息
        var user = req.session.user;
        if(user != null){
            user.psn_seq =  JSON.parse(result[0]).PSN_SEQ;
            //验证献血编号
            userdao.getDonByPsnSeqDonId(JSON.parse(result[0]).PSN_SEQ,donId).then((result)=>{
                if(JSON.parse(result[0]).CNT == 0){
                    let resbody = {
                        status:10016,
                        message:'认证失败！未查询到此献血编号信息'
                    }
                    res.send(resbody);
                    return;
                }
                //跟新用户信息到数据库
                userdao.updateUserInfo(user.openid,user.tell,user.psn_seq).then((result)=>{
                    //保存user到session
                    req.session.user=user;
                    let resbody = {
                        status:200,
                        message:'ok'
                    }
                    res.send(resbody);
                    return;
                }).catch((err)=>{
                        console.log("献血者认证出现错误:"+err);
                        let resbody = {
                            status:10016,
                            message:'认证失败！'+err
                        }
                        res.send(resbody);
                        return;
                    }
                );
            }).catch((err)=>{
                console.log("验证献血编号出错:donorAuth");
                let resbody = {
                    status:500,
                    message:'服务器出错'+err
                }
                res.send(resbody);
                return;
            })

        }else {
            let resbody = {
                status:10014,
                message:'会话已失效'
            }
            res.send(resbody);
            return;
        }
    }).catch((err)=>{
        console.log("查询用户seq出错来自:donorAuth"+err);
        let resbody = {
            status:500,
            message:'服务器出错'+err
        }
        res.send(resbody);
        return;
    })
});


module.exports = router;