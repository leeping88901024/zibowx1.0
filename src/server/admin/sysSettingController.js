var express = require('express');
var router = express.Router();
var session = require('express-session');
var fs = require('fs');
var uuid = require('node-uuid');
var wxconfig = require("../wxconfig");

var sysSettingDao = require('./sysSettingDao')

//加载nbsss中的献血地点
router.get('/loadLocations',(req,res)=>{
    var locationSeq = req.query.location_seq;
    console.log("我是locationSeq："+locationSeq)
        //调用dao返回数据
    sysSettingDao.loadNbsssLocation(res,locationSeq);
});
//加载献血点可提供的服务
router.get("/loadService",(req,res)=>{
    sysSettingDao.loadService(res);
});
//加载献血形式
router.get("/loadDonTypes",(req,res)=> {
    sysSettingDao.loadDonTypes(res);
});
//接受地点设置参数
router.post('/updateLocationDetail',(req, res) => {
    var  rImgPath  = '/wxImg/';
    var thumbSavePath =  wxconfig.serverPath + rImgPath;
    var locaDetail = req.body;
    //获取数据;
    var showUrl = "";
    console.log("当然我的图片呗修改过了:"+JSON.stringify(req.body))

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
                    console.log("采血点图片保存失败保存到服务器失败!");
                    let resBody = {
                        status: 10021,
                        message: '采血点图片设置失败失败'
                    }
                    res.send(resBody)
                    return
                }
                console.log("图片保存成功")
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

module.exports = router;