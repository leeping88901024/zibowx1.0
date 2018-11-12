var rowsData = require('../utils/rowsProcess');
var connPool = require("../connPool");

var mediaPushDao = {
    /**
     * 向数据库插入图文消息
     * @param articles
     * @returns {Promise<any>}
     */
    insertArticles : async (articles) => {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                //向数据库查询下一个ID
                let NEXT_ID = await conn.execute(
                    "SELECT SEQ_WX_MEIDA.NEXTVAL FROM DUAL"
                );
                let sql = "INSERT INTO  WX_PIC_TEXT_MEDIA(ID,TITLE,CONTENT,AUTHOR,DIGEST,SHOW_COVER_PIC,THUMB_URL,THUMB_PATH,THUMB_ORIGI_NAME,THUMB_SIZE,THUMB_TYPE,IS_PUSH,CREATE_DATE,LAST_MODIFY_DATE)  \n" +
                    "                    VALUES(:ID,:TITLE,:CONTENT,:AUTHOR,:DIGEST,:SHOW_COVER_PIC,:THUMB_URL,:THUMB_PATH,:THUMB_ORIGI_NAME,:THUMB_SIZE,:THUMB_TYPE,:IS_PUSH,sysdate,sysdate)";

                //插入文章
                let result = await conn.execute(sql,
                    [NEXT_ID.rows[0][0],articles.title,articles.content,articles.author,articles.digest,articles.show_cover_pic,articles.showUrl,articles.imgPath,articles.originalName,articles.thumb_size,articles.thumb_type,0],
                );
                conn.commit((err)=>{
                    if(err != null){
                        reject(err);
                    }
                });
                if(false == result){
                    resolve(null)
                }else{
                    resolve(NEXT_ID.rows[0][0]);
                }
                //返回
            } catch (err) { // catches errors in getConnection and the query
                console.log(err)
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        });

    },
    /**
     * 从数据库加载图文消息
     */
    loadMediaArticles :  function (res,rownumStart,rownumEnd) {
        var oracledb = require('oracledb');
        oracledb.fetchAsString = [ oracledb.CLOB ];
        connPool.getZibowxConn().then((connection)=>{
            connection.execute(
                "SELECT WXM.ID,\n" +
                "       WXM.TITLE,\n" +
                "       WXM.AUTHOR,\n" +
                "       WXM.DIGEST,\n" +
                "       WXM.THUMB_URL,\n" +
                "       WXM.SHOW_COVER_PIC,\n" +
                "       WXM.IS_PUSH,\n" +
                "       WXM.CREATE_DATE,\n" +
                "       WXM.IS_PUSH,\n" +
                "       TO_CHAR(WXM.LAST_MODIFY_DATE,'yyyy-MM-dd hh24:mi:ss') LAST_MODIFY_DATE\n" +
                " FROM (SELECT W.* , ROWNUM rn  FROM WX_PIC_TEXT_MEDIA W) WXM WHERE WXM.rn >= "+rownumStart+" and WXM.rn < "+rownumEnd,
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        let resBody = {
                            status : 10017,
                            message:'加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //直接向应给客户端
                    var data_cus =rowsData.toMap(result.metaData,result.rows);
                    console.log(data_cus)
                    let resBody ={
                        status :200,
                        message:"ok",
                        data:data_cus,
                        lastRownum: rownumEnd
                    }
                    res.send(resBody);
                    if(connection){
                        connection.close((err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                });
        }).catch((err)=>{
            console.error(err);
            let resBody = {
                status : 10017,
                message:'加载数据失败'
            }
            res.send(resBody);
            return
        })
    },
    /**
     * 根据图文id数组加载图文消息并返回
     */
    loadMediaArticlesByIds :  function (ids) {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();

                //加载文章
                let result = await conn.execute(
                    "SELECT WXM.ID,\n" +
                    "       WXM.TITLE,\n" +
                    "       WXM.CONTENT,\n" +
                    "       WXM.AUTHOR,\n" +
                    "       WXM.DIGEST,\n" +
                    "       WXM.SHOW_COVER_PIC,\n" +
                    "       WXM.THUMB_URL,\n" +
                    "       WXM.THUMB_PATH\n" +
                    " FROM  WX_PIC_TEXT_MEDIA WXM WHERE ID IN ("+ids+")",
                );
                if(false == result){
                    resolve(null)
                }else{
                    let data_cus =rowsData.toMap(result.metaData,result.rows);
                    resolve(data_cus);
                }
                //返回
            } catch (err) { // catches errors in getConnection and the query
                console.log("加载文章出错来自dao-loadMediaArticlesByIds:"+err)
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        });
    },
    /**
     * 根据图文id加载图文消息
     */
    loadMediaArticlesById :  function (res,id) {
        var oracledb = require('oracledb');
        oracledb.fetchAsString = [ oracledb.CLOB ];
        connPool.getZibowxConn().then((connection)=>{
            connection.execute(" SELECT WXM.ID,\n" +
                "       WXM.TITLE,\n" +
                "       WXM.CONTENT,\n" +
                "       WXM.AUTHOR,\n" +
                "       WXM.DIGEST,\n" +
                "       WXM.SHOW_COVER_PIC,\n" +
                "       WXM.THUMB_URL,\n" +
                "       WXM.THUMB_PATH,\n" +
                "       WXM.THUMB_ORIGI_NAME,\n" +
                "       WXM.THUMB_SIZE,\n" +
                "       WXM.THUMB_TYPE\n" +
                " FROM  WX_PIC_TEXT_MEDIA WXM WHERE ID = :id",
                [id]
                ,
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        let resBody = {
                            status : 10017,
                            message:'加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //直接向应给客户端
                    var data_cus =rowsData.toMap(result.metaData,result.rows);
                    console.log(data_cus)
                    let resBody ={
                        status :200,
                        message:"ok",
                        data:data_cus,
                    }
                    res.send(resBody);
                    if(connection){
                        connection.close((err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                });
        }).catch((err)=>{
            console.error(err);
            let resBody = {
                status : 10017,
                message:'加载数据失败'
            }
            res.send(resBody);
            return
        })


        oracledb.getConnection(
            {
                user: 'zibowx',
                password: 'zibowx',
                connectString: '192.168.1.51:1521/spda'
            },
            function (err, connection) {
                if (err) {
                    console.error(err.message);
                    return;
                }

            });
    },
    /**
     * 更新文章到数据库
     */
    updateArticles : async (articles) => {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                console.log("文章传过来没有"+JSON.stringify(articles))
                //插入文章
                let result = await conn.execute(
                    "UPDATE WX_PIC_TEXT_MEDIA SET TITLE = :TITLE,\n" +
                    "                             CONTENT = :CONTENT,\n" +
                    "                             AUTHOR=:AUTHOR,\n" +
                    "                             DIGEST=:DIGEST,\n" +
                    "                             SHOW_COVER_PIC = :SHOW_COVER_PIC,\n" +
                    "                             THUMB_URL = :THUMB_URL,\n" +
                    "                             THUMB_ORIGI_NAME = :THUMB_ORIGI_NAME,\n" +
                    "                             THUMB_SIZE = :THUMB_SIZE,\n" +
                    "                             THUMB_TYPE = :THUMB_TYPE,\n" +
                    "                             THUMB_MEDIA_ID = :THUMB_MEDIA_ID,\n" +
                    "                             ARTICLE_MEDIA_ID = :ARTICLE_MEDIA_ID,\n" +
                    "                             IS_PUSH = :IS_PUSH,\n" +
                    "                             LAST_MODIFY_DATE = sysdate\n" +
                    "                      WHERE ID = :ID",
                    [articles.title,articles.content,articles.author,articles.digest,articles.show_cover_pic,articles.showUrl,articles.originalName,articles.thumb_size,articles.thumb_type,articles.thumb_media_id,articles.article_media_id,articles.isPush,articles.id,],
                );
                conn.commit((err)=>{
                    if(err != null){
                        reject(err);
                    }
                });
                if(false == result){
                    resolve(null)
                }else{
                    resolve(articles.id);
                }
                //返回
            } catch (err) { // catches errors in getConnection and the query
                console.log("=="+err)
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        });

    },
    /**
     * 从数据库删除微信文章
     */
    deleteNews : async (id) => {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                //插入文章
                let result = await conn.execute("DELETE FROM WX_PIC_TEXT_MEDIA WHERE ID = :ID",
                    [id],
                );
                conn.commit((err)=>{
                    if(err != null){
                        reject(err);
                    }
                });
                if(false == result){
                    resolve(null)
                }else{
                    resolve(result);
                }
                //返回
            } catch (err) { // catches errors in getConnection and the query
                console.log("=="+err)
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        });

    },
}


module.exports=mediaPushDao;
