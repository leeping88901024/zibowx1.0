var oracledb = require('oracledb');
//日志
var loggerFile = require("./logs/loggerFile");
/**
 * 数据库连接池
 * @type {{getZibowxConn: (function(): Promise<any>), getNbsssConn: (function(): Promise<any>)}}
 */
var connPool = {
    getZibowxConn:()=>{
        return new Promise(async function(resolve, reject) {
            try {
                oracledb.createPool (
                    {
                        user          : "zibowx",
                        password      : "zibowx",
                        connectString : "192.168.1.51:1521/spda"
                    },
                    function(err, pool) {
                        pool.getConnection (
                            function(err, connection) {
                                if(err){
                                    loggerFile.error("获取淄博微信数据库连接异常:"+err);
                                    reject('获取连接异常！');
                                    return;
                                }
                                resolve(connection);
                            });
                    });
            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("获取淄博微信数据库连接异常:"+err);
                reject(err);
            }
        });
    },
    getNbsssConn : () => {
        return new Promise(async function(resolve, reject) {
            try {
                oracledb.createPool (
                    {
                        user          : "nbsss",
                        password      : "a123456",
                        connectString : "192.168.1.16:1521/nbsss"
                    },
                    function(err, pool) {
                        pool.getConnection (
                            function(err, connection) {
                                if(err){
                                    loggerFile.error("获取NBSSS数据库连接异常:"+err);
                                    reject('获取连接异常！');
                                    return;
                                }
                                resolve(connection);
                            });
                    });
            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("获取NBSSS数据库连接异常:"+err);
                reject(err);
            }
        });
    }
};


module.exports=connPool;