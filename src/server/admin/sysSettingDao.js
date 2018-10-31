var rowsData = require('../utils/rowsProcess');

var sysSettingDao = {
    //加载指定地点详细信息
    loadNbsssLocation:function (res,loactionSeq){
        var oracledb = require('oracledb');
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
                            console.error(err.message);
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
                            connection.close();
                        }
                    });
            });

    },
    //加载地点服务
    loadService :function (res){
        var oracledb = require('oracledb');
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
                var sql = 'select * from WX_LOCATION_SERVICE';
                connection.execute(
                    sql,
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
                            connection.close();
                        }
                    });
            });

    },
    //加载献血形式
    loadDonTypes:function (res){
        var oracledb = require('oracledb');
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
                var sql = 'select * from WX_LOCATION_DON_TYPE';
                connection.execute(
                    sql,
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
                            connection.close();
                        }
                    });
            });

    },
    //更新地点详细信息
    updateLocationdDetail:(locationDetail)=>{
        var oracledb = require('oracledb');
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await oracledb.getConnection({
                    user          : "zibowx",
                    password      : "zibowx",
                    connectString : "192.168.1.51:1521/spda"
                });


                var sql_loc = "\n" +
                    "merge into WX_LOCATION_DETAIL ld\n" +
                    "using (select "+locationDetail.locationSeq+ "locationSeq from dual) t\n" +
                    "on (t.locationSeq = ld.location_seq )\n" +
                    "when matched then\n" +
                    "     update set ld.exact_address = \'"+locationDetail.addressDetail+"\', ld.type_id = "+locationDetail.donType+",ld.img_path = \'"+locationDetail.imgPath+"\',ld.openingtime=\'"+locationDetail.openingTime+"\' ,closedtime = \'"+locationDetail.closedTime+"\',LOCATION_NAME = \'"+locationDetail.locationName+"\',IMG_URI=\'"+locationDetail.imgUri+"\'\n" +
                    "when not matched then\n" +
                    "     insert values (seq_location_detail.nextval,\'"+locationDetail.addressDetail+"\',"+locationDetail.locationSeq+",null,null,"+locationDetail.donType+",\'"+locationDetail.imgPath+"\',\'"+locationDetail.openingTime+"\',\'"+locationDetail.closedTime+"\',\'"+locationDetail.locationName+"\',\'"+locationDetail.imgUri+"\')"

                console.log(sql_loc);
                //向表wx_location_detail更新记录
                let result_loc_detail = await conn.execute(sql_loc);
                //删除所有 本地点的相关服务记录
                let delete_relation = await conn.execute("DELETE FROM WX_SERVICE_DETAIL_RELATION WHERE DETAIL_ID = :DETAIL_ID",
                    [locationDetail.locationSeq]);

                //更地点和服务关系表
                let result_relation = '';
                for(let i=0;i<locationDetail.services.length;i++){
                    let sql_relation = "merge into WX_SERVICE_DETAIL_RELATION SDR\n" +
                        "using (select "+locationDetail.locationSeq+" as detailseq,"+locationDetail.services[i]+" as serviceid from dual) t\n" +
                        "on (t.detailseq = sdr.detail_id and t.serviceid = sdr.service_id)\n" +
                        "when not matched then\n" +
                        "     insert values ("+locationDetail.locationSeq+","+locationDetail.services[i]+")"

                     result_relation = await conn.execute(sql_relation);
                }

                conn.commit((err) => {
                    if (err != null) {
                        conn.rollback((r_err) => {
                            reject(err);
                        })
                        reject(err);
                    }
                });
                //返回结果
                resolve(result_relation);
            } catch (err) {
                // catches errors in getConnection and the query
                console.log(err)
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
        var oracledb = require('oracledb');
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
                            console.error(err.message);
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
                            connection.close();
                        }
                    });
            });
    }
}


module.exports=sysSettingDao;
