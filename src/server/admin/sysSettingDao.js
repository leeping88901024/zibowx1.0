var rowsData = require('../utils/rowsProcess');
var connPool = require("../connPool");
//日志
var loggerFile = require("../logs/loggerFile");

var sysSettingDao = {
    //加载指定地点详细信息
    loadNbsssLocation:function (res,loactionSeq){
        loggerFile.info("来自sysSettingDao:loadNbsssLocation被执行！")
        connPool.getZibowxConn().then((connection)=>{
            var sql = 'SELECT LD.EXACT_ADDRESS,\n' +
                '       DPL.LOCATION_SEQ,\n' +
                '       LD.TYPE_ID,\n' +
                '       LD.IMG_URI,\n' +
                '       LD.IMG_PATH,\n' +
                '       LD.OPENINGTIME,\n' +
                '       LD.CLOSEDTIME,\n' +
                '       DPL.LOCATION_NAME\n' +
                '  FROM WX_LOCATION_DETAIL LD RIGHT OUTER JOIN \n' +
                '       NBSSS.DNR_PHLE_LOCATION@DL_FZ DPL ON LD.LOCATION_SEQ = DPL.LOCATION_SEQ\n' +
                ' WHERE DPL.LOCATION_SEQ = :LOCATION_SEQ\n' +
                '   AND DPL.ACTIVE = 1';
            connection.execute(
                sql,[loactionSeq],
                function (err, result) {
                    if (err) {
                        loggerFile.error("来自sysSettingDao:加载指定地点详细信息异常"+err)
                        let resBody = {
                            status : 10017,
                            message:'加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //console.log(result.rows+result.metaData)
                    //直接向应给客户端
                    let data_cus =rowsData.toMap(result.metaData,result.rows);
                    let resBody ={
                        status :200,
                        message:"ok",
                        data:data_cus
                    }
                    res.send(resBody);
                    if(connection){
                        connection.close((err) => {
                            if (err) {
                                loggerFile.error("来自sysSettingDao:关闭connection异常"+err)
                            }
                        });
                    }
                });
        }).catch((err)=>{
            loggerFile.error("来自sysSettingDao:加载数据失败"+err)
            let resBody = {
                status : 10017,
                message:'加载数据失败'
            }
            res.send(resBody);
            return
        })
    },
    //加载地点服务
    loadService :function (res){
        loggerFile.info("来自sysSettingDao:loadService被执行！")
        connPool.getZibowxConn().then((connection)=> {
            var sql = 'select * from WX_LOCATION_SERVICE';
            connection.execute(
                sql,
                function (err, result) {
                    if (err) {
                        console.error(err.message);
                        let resBody = {
                            status: 10017,
                            message: '加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //console.log(result.rows+result.metaData)
                    //直接向应给客户端
                    let data_cus = rowsData.toMap(result.metaData, result.rows);
                    let resBody = {
                        status: 200,
                        message: "ok",
                        data: data_cus
                    }
                    res.send(resBody);
                    if (connection) {
                        connection.close((err) => {
                            if (err) {
                                console.error(err);
                            }
                        });
                    }
                })
                }).catch((err) => {
            loggerFile.error("来自sysSettingDao:加载地点服务失败"+err)
            let resBody = {
                    status: 10017,
                    message: '加载数据失败'
                }
                res.send(resBody);
                return
            })
        },
    //加载献血形式
    loadDonTypes:function (res){
        loggerFile.info("来自sysSettingDao:loadDonTypes被执行！")
        connPool.getZibowxConn().then((connection)=> {
            var sql = 'select * from WX_LOCATION_DON_TYPE';
            connection.execute(
                sql,
                function (err, result) {
                    if (err) {
                        loggerFile.error("来自sysSettingDao_loadDonTypes：加载献血形式失败！"+err);
                        let resBody = {
                            status: 10017,
                            message: '加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //console.log(result.rows+result.metaData)
                    //直接向应给客户端
                    let data_cus = rowsData.toMap(result.metaData, result.rows);
                    let resBody = {
                        status: 200,
                        message: "ok",
                        data: data_cus
                    }
                    res.send(resBody);
                    if (connection) {
                        connection.close((err) => {
                            if (err) {
                                loggerFile.error("来自sysSettingDao_loadDonTypes：关闭数据库连接异常！"+err);
                            }
                        });
                    }

                })
        }).catch((err) => {
            loggerFile.error("来自sysSettingDao_loadDonTypes：加载献血形式失败！"+err);
            let resBody = {
                    status: 10017,
                    message: '加载数据失败'
                }
                res.send(resBody);
                return
            })
    },
    //更新地点详细信息
    updateLocationdDetail:(locationDetail)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                var sql_loc = "\n" +
                    "merge into WX_LOCATION_DETAIL ld\n" +
                    "using (select "+locationDetail.locationSeq+ "locationSeq from dual) t\n" +
                    "on (t.locationSeq = ld.location_seq )\n" +
                    "when matched then\n" +
                    "     update set ld.exact_address = \'"+locationDetail.addressDetail+"\', ld.type_id = "+locationDetail.donType+",ld.img_path = \'"+locationDetail.imgPath+"\',ld.openingtime=\'"+locationDetail.openingTime+"\' ,closedtime = \'"+locationDetail.closedTime+"\',LOCATION_NAME = \'"+locationDetail.locationName+"\',IMG_URI=\'"+locationDetail.imgUri+"\'\n" +
                    "when not matched then\n" +
                    "     insert values (seq_location_detail.nextval,\'"+locationDetail.addressDetail+"\',"+locationDetail.locationSeq+",null,null,"+locationDetail.donType+",\'"+locationDetail.imgPath+"\',\'"+locationDetail.openingTime+"\',\'"+locationDetail.closedTime+"\',\'"+locationDetail.locationName+"\',\'"+locationDetail.imgUri+"\')"

                //向表wx_location_detail更新记录
                let result_loc_detail = await conn.execute(sql_loc);
                conn.commit((err) => {
                    if (err != null) {
                        loggerFile.error("来自sysSettingDao_updateLocationdDetail：提交数据异常"+err);
                        conn.rollback((r_err) => {
                            reject(err);
                        })
                        reject(err);
                    }
                });
                //返回结果
                resolve(result_loc_detail);
            } catch (err) {
                loggerFile.error("来自sysSettingDao_updateLocationdDetail：更新地点详细信息异常"+err);
                conn.rollback((r_err)=>{
                    reject(r_err);
                })
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
    //加载地点详细信息
    loadLocationDetail : (res)=>{
        connPool.getZibowxConn().then((connection)=> {
            var sql = "   SELECT LD.EXACT_ADDRESS,\n" +
                "       DPL.LOCATION_SEQ,\n" +
                "       LD.TYPE_ID,\n" +
                "       LD.IMG_URI,\n" +
                "       LD.OPENINGTIME,\n" +
                "       LD.CLOSEDTIME,\n" +
                "       DPL.LOCATION_NAME\n" +
                "  FROM WX_LOCATION_DETAIL LD RIGHT OUTER JOIN \n" +
                "       NBSSS.DNR_PHLE_LOCATION@DL_FZ DPL ON LD.LOCATION_SEQ = DPL.LOCATION_SEQ\n" +
                " WHERE DPL.ACTIVE = 1";
            connection.execute(
                sql,
                function (err, result) {
                    if (err) {
                        loggerFile.error("来自sysSettingDao_loadLocationDetail：加载地点详细信息"+err);
                        let resBody = {
                            status : 10017,
                            message:'加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //直接向应给客户端
                    let data_cus =rowsData.toMap(result.metaData,result.rows);
                    let resBody ={
                        status :200,
                        message:"ok",
                        data:data_cus
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
                }).catch((err) => {
            loggerFile.error("来自sysSettingDao_loadLocationDetail：加载地点详细信息"+err);
                let resBody = {
                    status: 10017,
                    message: '加载数据失败'
                }
                res.send(resBody);
                return
            })
    }
}


module.exports=sysSettingDao;
