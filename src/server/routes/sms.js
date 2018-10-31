/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 * 
 * 接口入参说明：
 * PhoneNumbers：短信接收号码
 * SignName：短信签名
 * TemplateCode：短信模板ID
 * TemplateParam：短信模板变量替换JSON
 * 
 * 出参说明：
 * RequestId：请求ID
 * Code：状态码
 * Message：状态码的表述
 * BizId：发送回执ID
 * 
 */
const express = require('express');
const router = express.Router();
const SMSClient = require('../utils/aliyunsms')
const smsconfig = require('../config/smsconfig');

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = smsconfig.accesskeyid
const secretAccessKey = smsconfig.accesskeysecret

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-'

router.get('/send',(req, res) => {
    console.log('you will send message to user');
    //发送短信
    //初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    // 发送短信的手机号和发送验证码由自己生成
    smsClient.sendSMS({
        PhoneNumbers: '1500000000',
        SignName: '云通信产品',
        TemplateCode: 'SMS_000000',
        TemplateParam: '{"code":"12345","product":"云通信"}'
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    });

});

module.exports = router;
