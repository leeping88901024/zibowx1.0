const express = require('express');
var  session= require('express-session');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var cookie  = require('cookie-parser');
var path = require('path');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var wxUserLogin = require('./user/wxUserLogin');
var wxProcess = require('./wx_process/wx_process');
var donAppoint = require('./donAppoint/donAppointController');
var bldRepay = require('./bldRepay/bldRepayController');
var queryTestResult  = require('./testResult/testResultController');
var donRecord = require('./donRecord/donRecordController');
var adminMedia = require('./admin/mediaPushController');
var donorAuth = require('./user/donorAuth');
var sysSetting  = require('./admin/sysSettingController');
// var adminLogin = require("./admin/adminLoginController")
/*志愿者*/
var passport = require('passport');
var loginwx = require('./routes/loginwx');
var dbrouter = require('./routes/db');
var wxreply = require('./routes/reply');
var login = require('./routes/login');
var aliyunsms = require('./routes/sms');

const app = express();

app.use(express.static('dist'));

app.use(cookie ());
app.use(session({
    secret: 'zibowx',
    name: 'sessionid',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge:  1000 * 60 * 30 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({limit: '100mb'}));
app.use(bodyParser.json({limit: '100mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));// for parsing application/x-www-form-urlencoded
//解析xml
app.use(bodyParser.xml({
    limit: '50MB',
    xmlParseOptions: {
        normalize: true,
        normalizeTags: true,
        explicitArray: false
    }
}));

app.use('*',(req,res,next) => {
    if(req.session.userid == null) {
        // req.session.userid = 'o4loR1XR4EhJCTs4GyRKGOOgVY9A';
    }
    next();
});

// 本地登录
app.use('/loginlocal', login);

app.use('/loginwx',loginwx);

app.use('/db',dbrouter);

app.use('/reply',wxreply);

app.use('/sms', aliyunsms);

/*
app.get('*',(req,res) => {
    res.sendFile(path.resolve('dist','index.html'));
});
*/

//#####################################################

//拦截器实现
app.all('/private/*',function (req,res,next) {
    console.log("cookie："+req.cookies.sessionid);
    console.log("拦截器被执行了")
    var url = req.originalUrl;
    //公共页面放行
    if(url.indexOf("/public") >=　0){
        next();
    }else {
            //保存url到session
            req.session.tartget_url = url;
        /**
         * 验证用户是否已进行微信授权
         */
        //从session获取微信用户信息
        let user = req.session.user;
            if(user == null){
                //说明未进行微信授权,告知客户未进行微信授权
                let resbody = {
                    status:10024,
                    message:'未进行微信授权'
                }
                res.send(resbody);
                return
            }else{
                next();
            }
        }
});
app.use('/wxImg',express.static('src/server/wxImg'));
//公共模块/微信用户信息授权登录
app.use('/public/wxUserLogin',wxUserLogin);
//公共模块/处理微信消息
app.use('/public/wxProcess',wxProcess);
//献血预约
app.use('/public/donAppoint',donAppoint);
//用血报销
app.use('/public/bldRepay',bldRepay);
//获取access_token
app.get("/getAccessToken", function(req, res) {
   var accessToken = require('./wx_process/getAccessToken');
   console.log("请求微信获取access_token")
        accessToken();
    let resBody = {
        status:200,
        message:'ok'
    }
    res.send(resBody);
});
//检测结果查询
app.use('/private/testResult',queryTestResult);
//献血记录查询
app.use('/private/donRecord',donRecord);
//管理员 媒体文章推送
app.use("/public/admin/media",adminMedia);
//献血者认证
app.use("/private/donor",donorAuth);
//系统设置
app.use("/public/admin/locationSet",sysSetting);
//管理员用户管理
// app.use("/public/admin/login",adminLogin);


app.listen(8080,() => console.log('Listening on port 8080.'));
