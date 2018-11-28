var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local');
var oracledb = require('oracledb');
var dbconfig = require('../config/dbconfig');
var SHA2 = require('../utils/sha1');

passport.use(new localStrategy(
    function(username, password, done) {
        db.execute(
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
                console.log('here ....')
                return done(null, user);
            }
        )
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.userid);
});

passport.deserializeUser(function(userid, done) {
    done(null, {userid: userid})
});

/* router.get('/', function(req, res, next) {
     // console.log(`is authenticated?: ${req.isAuthenticated()}`);
     // console.log(`the user's session is ${JSON.stringify(req.session.passport.user)}`);
    if(req.isAuthenticated()) {
        console.log('正确登录了，但不执行这里了')
        res.send({
            url: '/testhome2'
        });
    } else {
        console.log('登录失败，返回到登录页面')
        res.send({
            url: '/login'
        });
    }
}); */

router.post('/',(req, res, next) => {
    console.log('fetch data througth post method ......')
    passport.authenticate('local', (err, user, info) => {
        //
        if (err) {
            console.log(err)
            return
        }
        console.log('#######')
        console.log(user)
        console.log(info)
        console.log('#######')
        if (user) {
            res.send({
                url: '/testhome2'
            });
        } else {
            res.send({
                url: '/loginl'
            });
        }
    })(req,res,next);
});

router.get('/logout',function(req,res) {
    req.logout();
    // 查看状态
    // console.log(`after logout is authenticated?: ${req.isAuthenticated()}`);
    // console.log(`after logout the user's session is ${JSON.stringify(req.session.passport.user)}`);
    res.send(
        {
            redirect: '/loginl'
        }
    );
});

oracledb.getConnection(
    dbconfig.wxdb
).then(connecttion => {
    db = connecttion;
}).catch(error => {
    console.log('ERROR:', error)
});

module.exports = router;

