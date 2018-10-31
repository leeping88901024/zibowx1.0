var express = require('express');
var router = express.Router();
var session = require('express-session');
var donBldAppointDao =  require('./donAppointDao');
var genetateSign = require('../wx_process/wx_js_sdk_cfg');
var commonModule = require("../commonModule")

//加载行政区域
router.get('/loadRegion',(req,res)=>{
    //调用dao层函数查询行政区
    donBldAppointDao.loadRegion(res);
});
//加载所有地点
router.get('/loadLocation',function (req,res) {
    donBldAppointDao.loadLocation(res);
});
//根据locationType加载地点
router.get('/getLocationById',(req,res)=>{
    //获取参数
    var locType = req.query.locType;
    donBldAppointDao.getLocationByType(res,locType)
});
//生成调用微信js-sdk配置信息给客户端
router.post('/getWxJsSdkCfgParms',(req,res)=>{
    //获取参数
    var url = req.body.url;
     genetateSign(url).then((result)=>{
         let resBody = {
             status:200,
             message:'ok',
             data:result
         }
         //响应给客户端
         res.send(resBody);
     }).catch((err)=>{
         let resBody = {
             status:10017,
             message:'加载数据失败！'+err,
         }
         //响应给客户端
         res.send(resBody);
     });
})
/**
 * 献血征询
 * @type {Router|router}
 */
router.post('/donBldConsult',(req,res)=>{

    //获取参数
    var reqBody = req.body;
    var p_name = reqBody.name;
    var p_idcard = reqBody.idcard;
    var p_donType = reqBody.donType;
    var p_appointDate = reqBody.appointDate;
    var p_phleLoc = reqBody.phleLoc;
    var p_phleLocSeq = reqBody.phleLocSeq;
    var p_idcardSeq = reqBody.idcardSeq;
    var p_certtype = reqBody.certtype;


    var consult = {
        name : p_name,
        idcard : p_idcard,
        donType : p_donType,
        appointDate : p_appointDate,
        phleLoc : p_phleLoc,
        phleLocSeq : p_phleLocSeq,
        idcardSeq:p_idcardSeq,
        certtype :p_certtype
    }


//验证接受到的数据
    var regName =/^[\u4e00-\u9fa5]{2,4}$/;
    if(!p_name || !regName.test(p_name)){
        let resBody = {
            status:10018,
            message:'请输入和身份证一致的姓名'
        }
        res.send(resBody)
        return
    }
    //如果相等说明使用了身份证
    if(p_idcardSeq == p_certtype){
        if(!p_idcard || !commonModule.IdentityCodeValid(p_idcard)){
            let resBody = {
                status:10018,
                message:'身份证号有误'
            }
            res.send(resBody)
            return
        }
    }else {
        if(!p_idcard ){
            let resBody = {
                status:10018,
                message:'证件号码不能为空'
            }
            res.send(resBody)
            return
        }
    }

    //处理预约日期
    var s_date = p_appointDate.replace(/-/g, '/'); // "2010/08/01";

    if(!p_appointDate){
        let resBody = {
            status:10018,
            message:'请选择预约日期'
        }
        res.send(resBody)
        return
    }else{
        // 创建日期对象
        let d_appointDate = new Date(s_date);
        if(p_appointDate < new Date()){
            let resBody = {
                status:10018,
                message:'预约日期必须在今天以后'
            }
            res.send(resBody)
            return
        }
    }

    if(p_donType == null){
        let resBody = {
            status:10018,
            message:'请选择献血类型'
        }
        res.send(resBody)
        return
    }
    //验证用户是否有待献血记录
    donBldAppointDao.isAlreadyAppoint(p_certtype == p_idcardSeq,p_certtype,p_idcard,p_appointDate).then((result)=>{
        console.log(result)
        if(result == false){
            let resBody = {
                status:10023,
                message:'您好,'+p_appointDate+'您已进行预约！'
            }
            res.send(resBody);
            return;
        }
        //调用dao层方法查询数据库数据
        donBldAppointDao.getDnrReturnDate(p_certtype == p_idcardSeq,p_certtype,p_idcard).then((response)=>{
            //如果返回结果为空 说明第一次献血
            if(response == null){
                consult.isFirst = true;
                consult.psn_seq = '';
                let resBody = {
                    status:200,
                    message:'ok',
                }
                res.send(resBody);
                return
            }

            consult.isFirst = false;
            consult.psn_seq = JSON.parse(response).PSN_SEQ;
            //如果预约全血
            if(consult.donType == 0){
                var daoDate = new Date(JSON.parse(response).WB_CAN_PHLE_DATE);
                //判断预约日期是否大于或等于可献全血日期
                if(consult.appointDate < daoDate){
                    let resBody = {
                        status:10020,
                        message:'您好，您需要到:'+JSON.parse(response).WB_CAN_PHLE_DATE+"才可以捐献全血"
                    }
                    res.send(resBody);
                    return
                }else{
                    let resBody = {
                        status:200,
                        message:'ok'
                    }
                    res.send(resBody);
                    return
                }
            }
            //如果预约机采
            if(consult.donType == 1){
                var daoDate = new Date(JSON.parse(response).MA_CAN_PHLE_DATE);
                //判断预约日期是否大于或等于可献全血日期
                if(consult.appointDate < daoDate){
                    let resBody = {
                        status:10020,
                        message:'您好，您需要到:'+JSON.parse(response).WB_CAN_PHLE_DATE+"才可以捐献成分血"
                    }
                    res.send(resBody);
                    return
                }else {
                    let resBody = {
                        status:200,
                        message:'ok'
                    }
                    res.send(resBody);
                    return
                }
            }
        }).catch((err)=>{
            console.log("献血征询controller模块异常"+err)
        });
        //把数据保存到session
        req.session.consult = consult;
        }).catch((err)=>{
            console.log("验证是否有待献血记录异常"+err);
            let resBody = {
                status:500,
                message:"服务器内部错误！"
            }
            res.send(resBody);
            return;
    })
});
/**
 * 加载献血预约详细信息页面民族 学历 职业下拉列表数据
 */
router.get('/loadEduNationProfess',(req,res)=>{
    //通过数据库查询
    donBldAppointDao.getEduNationProf().then((result)=>{
       let  resBody = {
           status:200,
           message:'ok',
           data:result
       }
       res.send(resBody);
       return
    }).catch((err)=>{
        console.log('加载学历职业民族出错'+err);
        let  resBody = {
            status:10017,
            message:'加载数据失败'+err
        }
        res.send(resBody);
        return
    })
});
/**
 * 献血详细信息
 * @type {Router|router}
 */
router.post('/donBldDetail',(req,res)=>{

    //获取参数
     var tell = req.body.tell;
     var sex = req.body.sex;
     var education = req.body.education;
    var  nation = req.body.nation;
    var  profession = req.body.profession;
    var  unit = req.body.unit;
    var  address = req.body.address;
    var  birthday = req.body.birthday;
    var  aboGroup = req.body.aboGroup;

    //对表单进行验证
    var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!tellReg.test(tell)) {
        let resBody = {
            status:10018,
            message:'手机号码错误'
        }
        res.send(resBody)
        return
    }
    //
    if (unit.length >26 ) {
        let resBody = {
            status:10018,
            message:'工作单位超出字数限制'
        }
        res.send(resBody)
        return
    }
    if (address.length >26 ) {
        let resBody = {
            status:10018,
            message:'地址超出字数限制'
        }
        res.send(resBody)
        return
    }

    var str = birthday.replace(/-/g, '/'); // "2010/08/01";
    // 创建日期对象
    var date = new Date(str);
    if(date > new Date()){
        let resBody = {
            status:10018,
            message:'生日必须小于今天'
        }
        res.send(resBody)
        return
    }

    //封装信息传入dao插入到数据库
    var consult = req.session.consult;
    if(consult == null){
        let resBody = {
            status:10014,
            message:'会话失效'
        }
        res.send(resBody)
        return
    }

    let dnrInfo = {
         name : consult.name,
         idcard : consult.idcard,
         donType : consult.donType,
         appointDate : consult.appointDate,
         phleLoc : consult.phleLoc,
         phleLocSeq : consult.phleLocSeq,
         certType:consult.certtype,
         idcardSeq : consult.idcardSeq,
         isFirst :consult.isFirst,
         psn_seq:consult.psn_seq,
         tell : tell,
         sex : sex,
         education : education,
          nation : nation,
          profession : profession,
          unit :  unit,
          address : address,
          birthday : birthday,
         aboGroup : aboGroup
    }
    console.log(JSON.stringify(dnrInfo)+"就算耶稣也救不了他 我说的")

    //传入dao层插入数据局
    donBldAppointDao.insertAppointInfo(dnrInfo).then((result)=>{
        //将recruit_seq存入session
        req.session.recruitSeq = result;
        //返回结果
        let resBody = {
            status:200,
            message:'ok'
        }
        res.send(resBody)
        return
    }).catch((err)=>{
        let resBody = {
            status:10019,
            message:'微信预约失败'+err
        }
        res.send(resBody)
        return
    });
});
/**
 * 加载证件类型
 */
router.get('/loadCertTypes',(req,res)=>{
    //通过数据库查询
    donBldAppointDao.getCertTypes().then((result)=>{
        let  resBody = {
            status:200,
            message:'ok',
            data:result
        }
        res.send(resBody);
        return
    }).catch((err)=>{
        console.log('加载证件类型失败!来自donAppointController:'+err);
        let  resBody = {
            status:10017,
            message:'加载数据失败'+err
        }
        res.send(resBody);
        return
    })
});
/**
 * 加载本次预约记录
 */
router.get('/getAppointRecd',(req,res)=>{
    //值加载本次预约记录
    var recruitSeq = req.session.recruitSeq;
    if(recruitSeq == null){
        let  resBody = {
            status:10014,
            message:'会话已失效',
        }
        res.send(resBody);
        return
    }
    //通过数据库查询
    donBldAppointDao.getAppointRecordByRecruitSeq(recruitSeq).then((result)=>{
        let  resBody = {
            status:200,
            message:'ok',
            data:result
        }
        res.send(resBody);
        return
    }).catch((err)=>{
        console.log('加载预约记录失败!来自donAppointController:'+err);
        let  resBody = {
            status:10017,
            message:'加载数据失败'+err
        }
        res.send(resBody);
        return
    })
});
/**
 * 加载我的所有预约记录
 */
router.get('/loadMyAppointRecord',(req,res)=>{
    //值加载本次预约记录
    var user = req.session.user;
    if(user == null){
        let  resBody = {
            status:10024,
            message:'微信未授权',
        }
        res.send(resBody);
        return
    }
    var psnSeq = req.session.user.psn_seq;
    if(psnSeq == null){
        let  resBody = {
            status:10025,
            message:'未进行献血者认证',
        }
        res.send(resBody);
        return
    }
    //通过数据库查询
    donBldAppointDao.getAppointRecordByPsnseq(psnSeq).then((result)=>{
        console.log(JSON.stringify(result))
        let  resBody = {
            status:200,
            message:'ok',
            data:result
        }
        res.send(resBody);
        return
    }).catch((err)=>{
        console.log('加载预约记录失败!来自donAppointController:'+err);
        let  resBody = {
            status:10017,
            message:'加载数据失败'+err
        }
        res.send(resBody);
        return
    })
});
/**
 * 取消微信献血预约
 */
router.post('/cancelAppoint',(req,res)=>{
    var recruitSeq = req.body.recruitSeq;
    console.log("我是那啥seq："+recruitSeq)
    if(recruitSeq == null){
        let  resBody = {
            status:10017,
            message:'取消预约失败'
        }
        res.send(resBody);
        return
    }
    
    //通过数据库查询
    donBldAppointDao.cancelAppoint(recruitSeq).then((result)=>{
        let  resBody = {
            status:200,
            message:'ok',
            data:result
        }
        res.send(resBody);
        return
    }).catch((err)=>{
        console.log('取消预约失败!来自donAppointController:'+err);
        let  resBody = {
            status:10017,
            message:'取消预约失败'+err
        }
        res.send(resBody);
        return
    })
});
/**
 * 更久seq加载地址
 */
router.get("/loadNvgationAddress",(req,res)=>{
    //获取seq
    var locationSeq = req.query.locationSeq;
    donBldAppointDao.loadAddressByLocSeq(locationSeq).then((result)=>{
        let resBody = {
            status:200,
            message: 'ok',
            data:result
        }
        res.send(resBody);
        return
    }).catch((err)=>{
        let resBody = {
            status:10017,
            message: '加载地址失败',
        }
        res.send(resBody);
        return
    })
});
/**
 * 加载用户献血者身份信息
 */
router.get("/loadDonorInfo",(req,res)=>{
    //值加载本次预约记录
    var user = req.session.user;
    if(user == null){
        let  resBody = {
            status:10014,
            message:'会话已失效',
        }
        res.send(resBody);
        return
    }
    if(user.psn_seq == null){
        let  resBody = {
            status:10025,
            message:'未进行献血者认证',
        }
        res.send(resBody);
        return
    }
    //通过数据库查询
    donBldAppointDao.loadDonorInfoByPsnseq(user.psn_seq).then((result)=>{
        let  resBody = {
            status:200,
            message:'ok',
            data:result
        }
        res.send(resBody);
        return
    }).catch((err)=>{
        console.log('加载献血者身份信息失败!来自donAppointController:'+err);
        let  resBody = {
            status:10017,
            message:'加载数据失败'+err
        }
        res.send(resBody);
        return
    })
});
module.exports = router;