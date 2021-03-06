var express = require('express');
var router = express.Router();
var session = require('express-session');
var formidable = require("formidable");
var wxconfig = require("../wxconfig");
var WechatAPI = require('wechat-api');
var uuid = require('node-uuid');
var fs = require('fs');
var async = require('async');

var mediaPushDao = require('./mediaPushDao');


var api = new WechatAPI(wxconfig.appid, wxconfig.appscret);

/**
 * 上传图片素材
 */
router.post('/uploadImg',(req,res)=>{
    var form = new formidable.IncomingForm();
    var  rImgPath  = '/wxImg/'
    form.uploadDir = wxconfig.serverPath + rImgPath;//图片上传目录

    form.parse(req, function(err, fields, files) {
        console.log('fields',fields);//表单传递的input数据  
        console.log('files',files);//上传文件数据  

        //重新生成图片名称
        var new_fileName = uuid.v4() + "_"+files.imgfile.name;
        //图片写入地址；
        var newPath = form.uploadDir + new_fileName;
        //显示地址；
        var showUrl = wxconfig.domain + rImgPath + new_fileName;
        fs.renameSync(files.imgfile.path, newPath);  //重命名
        //上传到微信服务器 然后获取路径
        api.uploadImage(newPath,(err,result)=>{
            if(err){
                var resBody = {
                    "errno": -1,
                    "message" : '上传失败'
                }
                res.send(resBody);
            }
            //返回图片在微信服务器的地址
            var resBody = {
                "errno": 0,
                "data": [
                    result.url
                ]
            }
            res.send(resBody);
        });
    });
});
/**
 *媒体文章推送
 */
router.post('/wxMedia',(req,res)=>{
        async.waterfall([
            function (callback) {
                var checkedArticles = req.body.checkArticle;
                if(checkedArticles.length == 0){
                    callback("请至少选择一篇文章")
                    return
                }
                //根据id加载文章
                mediaPushDao.loadMediaArticlesByIds(checkedArticles).then(async (result) => {
                    if (result != null) {
                        let cover_count = 0;
                        let for_count = 0;
                        for(let arcle of result) {
                            console.log("要保存的文章?"+arcle)
                            if(JSON.parse(arcle).SHOW_COVER_PIC == 1){
                                cover_count= cover_count +1
                            }
                            for_count = for_count +1;
                            if(for_count == result.length){
                                if(cover_count > 1){
                                    callback("同时推送的文章中只能有一篇显示为封面！")
                                }else{
                                    callback(null, result);
                                }
                            }
                        }
                    } else {
                        callback(err)
                    }
                }).catch((err) => {
                    callback(err)
                })
            },
             function (result, callback) {
                //上传缩略图到微信
                var medias = new Array();
                 uploadThumb();
                async function uploadThumb() {
                    let count = 0;
                    let isErro = false;
                    let errMeg = '';
                   for (let atc of result) {
                        atc = JSON.parse(atc);
                       await  api.uploadMaterial(atc.THUMB_PATH, "thumb", (err, thumb_result) => {
                            if (err) {
                                isErro = true;
                                errMeg = err;
                            }
                            //上传成功则设置thumb_media_id
                            atc.THUMB_MEDIA_ID = thumb_result.media_id;
                            atc.THUMB_MEDIA_ID = "AvzeSlVi2Y7dTKNs90wAd1RxBGQHCCQeFYgXRyaT8lE";
                            medias = medias.concat(atc);
                            count++;
                            if (count == result.length) {
                                isErro ? callback(errMeg) :  callback(null, medias)
                            }
                            console.log(atc.THUMB_MEDIA_ID);
                        });
                    }
                }
            },
            function (medias, callback) {
                console.log("===我");
                //上传文章到微信得到media_id
                var articles_array = new Array();
                medias.forEach((media, index) => {
                    articles_array = articles_array.concat({
                        "title": media.TITLE,
                        "thumb_media_id": media.THUMB_MEDIA_ID,
                        "author": media.AUTHOR,
                        "digest": media.DIGEST,
                        "show_cover_pic": media.SHOW_COVER_PIC,
                        "content": media.CONTENT,
                        "content_source_url": wxconfig.articlelook_url + "?id=" + media.ID
                    })
                })
                console.log("媒体文章"+JSON.stringify(articles_array));
                callback(null, articles_array, medias);
            },
            function (articles_array, medias, callback) {
                //上传媒体消息到微信服务器得到media_id
                console.log("我就是最终上传的媒体文章:" + JSON.stringify(articles_array))
                var news = {
                    "articles": articles_array
                }
                //上传
                api.uploadNewsMaterial(news, (err,me_result)=>{
                    if(err){
                       callback(err);
                       return
                   }
                let media_id =  'AvzeSlVi2Y7dTKNs90wAd-vNgV7v15vCMJlcw4f-6hE';
                    callback(null,media_id,medias);
               });
            },
             function (article_media_id, medias, callback) {
            console.log("为啥没有美的id呢"+article_media_id)
                 async.waterfall([
                         function (done) {
                         updateWxMedia(medias);
                            async function updateWxMedia(medias) {
                                for(let arcle of medias) {
                                    console.log("要保存的文章?"+arcle)
                                    //更新文章到数据库
                                    let articles = {
                                        id: arcle.ID,
                                        title: arcle.TITLE,
                                        content: arcle.CONTENT,
                                        author: arcle.AUTHOR,
                                        digest: arcle.DIGEST,
                                        show_cover_pic: arcle.SHOW_COVER_PIC,
                                        showUrl: arcle.THUMB_URL,
                                        imgPath: arcle.THUMB_PATH,
                                        originalName: arcle.THUMB_ORIGI_NAME,
                                        thumb_size: arcle.THUMB_SIZE,
                                        thumb_type: arcle.THUMB_TYPE,
                                        thumb_media_id: arcle.THUMB_MEDIA_ID,
                                        article_media_id:article_media_id,
                                        isPush:1
                                    }
                                  await  mediaPushDao.updateArticles(articles).then((result) => {
                                        if(result == null){
                                            done("更新微信文章到数据库失败");
                                        }
                                    }).catch((err) => {
                                    done(err);
                                })
                                }
                            }
                         done(null)
                     }
                 ],function (err,result) {
                     if (err) {
                         callback(err)
                     }else {
                         callback(null)
                     }
                 })
            }], function (err, resu) {

            if (err) {
                var resBody = {
                    status: 10019,
                    message: "文章推送失败" + err,
                }
                res.send(resBody)
                return
            }else {
                var resBody = {
                    status: 200,
                    message: 'ok',
                }
                res.send(resBody)
                return
            }
        });
});
/**
 * 保存图文素材到数据库
 */
router.post('/saveArticles',(req,res)=>{

    var  rImgPath  = '/wxImg/';
    var thumbSavePath =  wxconfig.serverPath + rImgPath;
    //获取数据;
    var originalName = JSON.parse(JSON.stringify(req.body.thumb[0])).name;
    var size = JSON.parse(JSON.stringify(req.body.thumb[0])).size;
    var imgType = JSON.parse(JSON.stringify(req.body.thumb[0])).type;
    var imgData = JSON.parse(JSON.stringify(req.body.thumb[0])).thumbUrl;
    //验证缩略图是否满足微信条件
    if(imgType != 'image/jpeg'){
        var resBody = {
            status:10019,
            message:'缩略图仅支持jpg格式哦'
        }
        res.send(resBody)
        return
    }
    //缩略图大小验证
    if(size/1000 > 64){
        var resBody = {
            status:10019,
            message:'缩略图不能超多64kb哦'
        }
        res.send(resBody)
        return
    }

    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    //重新生成图片名称
    var new_fileName = uuid.v4() + "_"+originalName;
    //图片写入地址;
    var newPath = thumbSavePath + new_fileName;
    //显示地址；
    var showUrl = wxconfig.domain + rImgPath + new_fileName;

    fs.writeFile(newPath, dataBuffer, function(err) {
        if(err){
            console.log("缩略图保存到服务器失败！");
        }else{
            console.log("保存成功！");
            //保存到数据库
                    var articles = {
                        title: req.body.title,
                        content:req.body.content,
                        author: req.body.author,
                        digest: req.body.digest,
                        show_cover_pic: req.body.show_cover_pic,
                        showUrl:showUrl,
                        imgPath:newPath,
                        originalName:originalName,
                        thumb_size:size,
                        thumb_type:imgType
                    }

                    mediaPushDao.insertArticles(articles).then((result)=>{
                        console.log(result)
                            var resBody = {
                                status:200,
                                message:'ok',
                                data:result
                            }
                            res.send(resBody)

                    }).catch((err)=>{
                        console.log(err)
                        var resBody = {
                            status:10019,
                            message:'文章保存失败'+err
                        }
                        res.send(resBody)
                    })
        }
    });
});
/**
 * 更新数据库文章
 */
router.post('/updateArticles',(req,res)=>{
    var  rImgPath  = '/wxImg/';
    var thumbSavePath =  wxconfig.serverPath + rImgPath;
    //获取数据;
    var originalName = JSON.parse(JSON.stringify(req.body.thumb[0])).name;
    var size = JSON.parse(JSON.stringify(req.body.thumb[0])).size;
    var imgType = JSON.parse(JSON.stringify(req.body.thumb[0])).type;
    var imgData = JSON.parse(JSON.stringify(req.body.thumb[0])).thumbUrl;
    var thumb_flag = req.body.thumbFlag;

    console.log("图片类型:"+JSON.stringify(req.body));
    //如果图图片被改变
    if(thumb_flag == true){
        //验证缩略图是否满足微信条件
        if(imgType != 'image/jpeg'){
            var resBody = {
                status:10019,
                message:'缩略图仅支持jpg格式哦'
            }
            res.send(resBody)
            return
        }
        //缩略图大小验证
        if(size/1000 > 64){
            var resBody = {
                status:10019,
                message:'缩略图不能超多64kb哦'
            }
            res.send(resBody)
            return
        }

        //过滤data:URL
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        //重新生成图片名称
        var new_fileName = uuid.v4() + "_"+originalName;
        //图片写入地址；
        var newPath = thumbSavePath + new_fileName;
        //显示地址；
        var showUrl = wxconfig.domain + rImgPath + new_fileName;

        fs.writeFile(newPath, dataBuffer, function(err) {
            if(err){
                console.log("缩略图保存到服务器失败！");
            }else{
                console.log("保存成功！");
                //更新到数据库
                let articles = {
                    id:req.body.id,
                    title: req.body.title,
                    content:req.body.content,
                    author: req.body.author,
                    digest: req.body.digest,
                    show_cover_pic: req.body.show_cover_pic,
                    showUrl:showUrl,
                    imgPath:newPath,
                    originalName:originalName,
                    thumb_size:size,
                    thumb_type:imgType,
                    thumb_media_id: '',
                    article_media_id:'',
                    isPush:0
                }

                mediaPushDao.updateArticles(articles).then((result)=>{
                    console.log(result)
                    var resBody = {
                        status:200,
                        message:'ok',
                        data:result
                    }
                    res.send(resBody)

                }).catch((err)=>{
                    console.log(err)
                    var resBody = {
                        status:10019,
                        message:'文章保存失败'+err
                    }
                    res.send(resBody)
                })
            }
        });
    }else {
        //更新到数据库
        let articles = {
            id:req.body.id,
            title: req.body.title,
            content:req.body.content,
            author: req.body.author,
            digest: req.body.digest,
            show_cover_pic: req.body.show_cover_pic,
            showUrl:JSON.parse(JSON.stringify(req.body.thumb[0])).url,
            originalName:originalName,
            thumb_size:size,
            thumb_type:imgType,
            isPush: 0
        }

        mediaPushDao.updateArticles(articles).then((result)=>{
            console.log(result)
            var resBody = {
                status:200,
                message:'ok',
                data:result
            }
            res.send(resBody)

        }).catch((err)=>{
            console.log(err)
            var resBody = {
                status:10019,
                message:'文章保存失败'+err
            }
            res.send(resBody)
        })
    }

});
/**
 * 从数据库加载图文素材
 */

router.get("/loalMedia",(req,res)=>{
    //得到参数
    var count = req.query.count;
    var rownumStart = req.query.rownum;
    console.log(parseInt(rownumStart)+parseInt(count))
    //调用dao加载数据
    mediaPushDao.loadMediaArticles(res,rownumStart,parseInt(rownumStart)+parseInt(count));
});
/**
 * 从数据库加载图文素材根据id
 */
router.get("/loalMediaById",(req,res)=>{
    const id = req.query.id;
    console.log(id+'========')
    //调用dao加载数据
    mediaPushDao.loadMediaArticlesById(res,id);
});
/**
 * 获取所有微信Media
 */
router.get("/loalAllWxMediaFromWx",(req,res)=>{
    api.getMaterials("news", 0, 20, (err,result,res)=>{
            console.log(JSON.stringify(result));
    });
    res.send("ok")
});
/**
 * 获取微信关注者列表
 */
router.get("/loadFollowers",(req,res)=>{
    api.getFollowers((err,result)=>{
        console.log(JSON.stringify(result))
    });
    res.send("ok")
});
/**
 * 预览图文消息
 */
router.get("/previewhMedia",(req,res)=>{
    api.previewNews("o4loR1XR4EhJCTs4GyRKGOOgVY9A", "AvzeSlVi2Y7dTKNs90wAd8ZqZ9mttdzqqzhyk3KEYDU", (err,result)=>{
        if(err){
            console.log(err);
            return
        }
        console.log(result.errmsg)
        res.send("ok")
    });
});

module.exports = router;