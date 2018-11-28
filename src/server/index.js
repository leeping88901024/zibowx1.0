var express = require('express');
var  session= require('express-session');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var cookie  = require('cookie-parser');
var path = require('path');
var wxUserLogin = require('./user/wxUserLogin');
var wxProcess = require('./wx_process/wx_process');
var donAppoint = require('./donAppoint/donAppointController');
var queryTestResult  = require('./testResult/testResultController');
var donRecord = require('./donRecord/donRecordController');
var adminMedia = require('./admin/mediaPushController');
var donorAuth = require('./user/donorAuth');
var sysSetting  = require('./admin/sysSettingController');
// var adminLogin = require("./admin/adminLoginController")
var log4js = require("log4js");
var log4js_config = require("./logs/logconfig");
log4js.configure(log4js_config);
var loggerFile = log4js.getLogger("file");

var oracledb = require('oracledb');
var dbstring = require('./config/dbconfig');
var SHA2 = require('./utils/sha1');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
    function(username, password, done) {
        oracledb.getConnection(dbstring.wxdb, (err, conn) => {
            if (err) {
                console.log(err.message);
                return;
            }
            conn.execute(
                `select * from WX_USER_LOCAL t
                where t.active = 1 
                  and t.mail = :mail`,
                [username], //通过邮箱来登录
                (err,result) => {
                    if(err) {
                        console.log(err);
                        return done(err);
                    }
                    // 用户不存在 或者被停用
                    if(result.rows.length != 1) {
                        console.log('用户不存在')
                        return done(null, false);
                    }
                    // 密码错误
                    if(result.rows[0][1] != SHA2(password)) {
                        console.log('密码错误')
                        return done(null, false);
                    }
                    console.log('将成功设置session')
                    let user = {
                        userid: result.rows[0][0]
                    }

                    console.log(`the user's info is ${JSON.stringify(user)}`)
                    console.log('here ....');

                    // release
                    conn.close(err => {
                        if (err) {
                            console.log(err)
                        }
                    });
                    // true
                    return done(null, user);
                    
                }
            );
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.userid);
});

passport.deserializeUser(function(userid, done) {
    done(null, {userid: userid})
});


var dbrouter = require('./routes/db');


var app = express();


// 可以访问 (get) 静态资源 和前端的路由没有关系
// app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cookie ());
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
app.use(session({
    secret: 'zibowx',
    name: 'sessionid',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge:  1000 * 60 * 30 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session() );

 //测试使用，不可删！
app.use('*',(req,res,next) => {
    var url = req.originalUrl;
    var ip = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip.replace(/::ffff:/, '');
    loggerFile.info("ip为："+ip+"访问路径："+url);
    //保存url到session
    req.session.tartget_url = url;
    next();
}); 

/*
// just for local test
app.use('*', (req, res, next) => {
    req.session.user = {
        openid: 'o5qvz1NKiFMJZG_JpUYdtj3lJhVc'
    };
    next();
})
*/
app.use('/db',dbrouter);

//拦截器实现
app.all('/private/*',function (req,res,next) {
        let user = req.session.user;
        if(user == null){
                //说明未进行微信授权,告知客户未进行微信授权
                loggerFile.info("未进行微信授权");
                let resbody = {
                    status:10024,
                    message:'未进行微信授权'
                }
                res.send(resbody);
                return
            }else{
                next();
            }
});
app.use('/wxImg',express.static('src/server/wxImg'));
//公共模块/微信用户信息授权登录
app.use('/public/wxUserLogin',wxUserLogin);
//公共模块/处理微信消息
app.use('/public/wxProcess',wxProcess);
//献血预约
app.use('/public/donAppoint',donAppoint);
//检测结果查询
app.use('/private/testResult',queryTestResult);
//献血记录查询
app.use('/private/donRecord',donRecord);
//献血者认证
app.use("/private/donor",donorAuth);
//系统设置
app.use("/public/admin/locationSet",sysSetting);

app.post('/loginlocal',
  passport.authenticate('local', { failureRedirect: '/loginlocal' }),
  (req, res) => {
      console.log('success')
      console.log(`is authenticated?: ${req.isAuthenticated()}`);
      console.log(`the user's session is ${JSON.stringify(req.session.passport)}`);
      res.send({
        url: '/testhome2'
      });
  });

// login false
app.get('/loginlocal', (req,res) => {
    res.send({
        url: '/loginl'
    });
});

// logout
app.get('/logoutlocal', (req, res) => {
    req.logout();
    res.send({
        redirect: '/loginl'
    });
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(80,() => console.log('Listening on port 80.'));
