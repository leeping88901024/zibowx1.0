var express = require('express');
var router = express.Router();
var session = require('express-session');
var fs = require('fs');
var uuid = require('node-uuid');
var wxconfig = require("../wxconfig");
var WechatAPI = require('wechat-api');
var api = new WechatAPI(wxconfig.appid, wxconfig.appscret);
//日志
var loggerFile = require("../logs/loggerFile");
var sysSettingDao = require('./sysSettingDao');
var setWxMenu = require("../weixinMenu/menuManage");

//加载nbsss中的献血地点
router.get('/loadLocations',(req,res)=>{
    loggerFile.info("来自模块sysSettingController：加载nbsss中的献血地点请求");
    var locationSeq = req.query.location_seq;
        //调用dao返回数据
    sysSettingDao.loadNbsssLocation(res,locationSeq);
});
//加载献血点可提供的服务
router.get("/loadService",(req,res)=>{
    sysSettingDao.loadService(res);
});
//加载献血形式
router.get("/loadDonTypes",(req,res)=> {
    loggerFile.info("来自模块sysSettingController：加载献血形式请求");
    sysSettingDao.loadDonTypes(res);
});
//接受地点设置参数
router.post('/updateLocationDetail',(req, res) => {
    loggerFile.info("来自模块sysSettingController：接受地点设置参数请求");
    var  rImgPath  = '/wxImg/';
    var thumbSavePath =  wxconfig.serverPath + rImgPath;
    var locaDetail = req.body;
    //获取数据;
    var showUrl = "";

    //如果修改了献血点图片
    if(locaDetail.thumbFlag == true){
        if(req.body.thumb.length != 0) {
            var originalName = JSON.parse(JSON.stringify(req.body.thumb[0])).name;
            var size = JSON.parse(JSON.stringify(req.body.thumb[0])).size;
            var imgType = JSON.parse(JSON.stringify(req.body.thumb[0])).type;
            var imgData = JSON.parse(JSON.stringify(req.body.thumb[0])).thumbUrl;

            //过滤data:URL
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            //重新生成图片名称
            var new_fileName = uuid.v4() + "_" + originalName;
            //图片写入地址；
            var newPath = thumbSavePath + new_fileName;
            //显示地址；
            showUrl = wxconfig.domain + rImgPath + new_fileName;

            fs.writeFile(newPath, dataBuffer, function (err) {
                if (err) {
                    loggerFile.error("来自模块sysSettingController：采血点图片保存失败保存到服务器失败!");
                    console.log("");
                    let resBody = {
                        status: 10021,
                        message: '采血点图片设置失败失败'
                    }
                    res.send(resBody)
                    return
                }
                loggerFile.info("来自模块sysSettingController：采血点图片保存成功!");
            });
        }
        locaDetail.imgUri = showUrl;
        locaDetail.imgPath = newPath;

    }else{
        locaDetail.imgUri = JSON.parse(JSON.stringify(req.body.thumb[0])).url
        locaDetail.imgPath = req.body.imgPath;
    }
//调用dao插入数据
    sysSettingDao.updateLocationdDetail(locaDetail).then((result)=>{
        let resBody = {
            status:200,
            message:"ok"
        }
        res.send(resBody)
        return
    }).catch((err)=>{
        loggerFile.error("来自模块sysSettingController：采血点信心保存到数据库失败!"+err);

        let resBody = {
              status:10021,
              message:'设置失败'
          }
        res.send(resBody)
        return
    });
});
/**
 * 加载地点详细信息
 */
router.get("/loadLocationDetail",(req,res)=>{
        //调用dao响应数据
    sysSettingDao.loadLocationDetail(res);
});
/**
 * 获取所有微信Media
 */
router.get("/loalAllWxMediaFromWx",(req,res)=>{
    loggerFile.info("进入路径:/loalAllWxMediaFromWx");
/*
    api.getMaterials("news", 0, 20, (err,result)=> {
        if (err) {
            loggerFile.error("加载media失败！" + err);
            let resBody = {
                status: 10017,
                message: '加载数据失败'
            }
            res.send(resBody);
            return
        }

        console.log(JSON.stringify(result));
        let resBody = {
            status: 200,
            message: 'ok',
            data: result
        }
        res.send(resBody);
        return;
    });
*/
        //fs.writeFileSync(__dirname + '/test_w.txt', JSON.stringify(result));
        var medias = fs.readFileSync(__dirname + '/test_w.txt', {flag: 'r+', encoding: 'utf8'});
        console.log(medias);
        let resBody = {
            status : 200,
            message:'ok',
            data:JSON.parse(medias)
        }
        res.send(resBody);
        return
});
/**
 * 设置献血须知媒体文章
 */
router.get("/setDonNoticeMenu",(req,res)=>{
    loggerFile.info("进入路径:/setDonNoticeMenu");
    //获取mdia_id
    var mediaId = req.query.mediaId;
    if(!mediaId) {
        let resBody = {
            status: 2001,
            message: "mediaId不能为空"
        }
        res.send(resBody);
        return;
    }
    //重新设置菜单
    setWxMenu(mediaId,(err,result)=>{
        if(err){
            let resBody = {
                status:2001,
                message:'设置失败！'+err
            }
            res.send(resBody);
            return;
        }
        loggerFile.info("微信菜单设置成功！"+result);

        let resBody = {
                status:200,
                message:"ok"
            }
            res.send(resBody);
            return
    });
});

module.exports = router;