var express = require('express');
var crypto = require('crypto');
var router = express.Router();

var token = "tgw0909"; //此处需要你自己修改！

/* GET home page. */
router.get('/wx', function(req, res, next) {

    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;

    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array(token,timestamp,nonce);
    array.sort();
    var str = array.toString().replace(/,/g,"");

    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");

    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        res.send(echostr)
    }else{
        res.send("error");
    }
});

router.post('/wx',(req,res)=>{
    var data = req.body.xml;
    if(data.msgtype === 'event' && data.event === 'subscribe'){
        data.content = '欢迎关注淄博市血液中心微信公众号！';
        msgText(res,data);
    }else if(data.msgtype === 'event' && data.event === 'unsubscribe'){
        //取消关注了
    }else if(data.msgtype === 'text'){//文本消息
        data.content = '你好公众号暂不支持消息回复';
        msgText(res,data);
    }else if(data.msgtype === 'image'){//图片消息
        data.content = '你好公众号暂不支持消息回复';
        msgText(res,data);
    }else if(data.msgtype === 'video'){//视频消息
        data.content = '你好公众号暂不支持消息回复';
        msssage(res,data);
    }else if(data.msgtype === 'voice'){//语言消息
        data.content = '你好公众号暂不支持消息回复';
        msssage(res,data);
    }
});
//文字消息模板
function msgText(res,data){
    //fromusername 接受者openid
    //tousername  发送者openid
    var resMsg = '<xml>' +
        '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
        '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
        '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
        '<MsgType><![CDATA[text]]></MsgType>' +
        '<Content><![CDATA['+data.content+']]></Content>' +
        '</xml>';
    res.end(resMsg);
}


module.exports = router;