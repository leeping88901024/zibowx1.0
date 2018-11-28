var rowsData = require('../utils/rowsProcess');
var connPool = require("../connPool");
//日志
var loggerFile = require("../logs/loggerFile");

var testResultDao = {
    //检测结果查询
    queryTestResult:(psn_seq)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                //血液检测结果查询
                var sql ='      SELECT DISTINCT  P.CELL_CALL,\n' +
                    '                           TO_CHAR(PR.REG_DATE,\'YYYY-mm-DD\') REG_DATE,\n' +
                    '                           DBT.TEST_RESULT,\n' +
                    '                           P.PSN_NAME\n' +
                    '                        FROM NBSSS.DNR_BLD_TEST DBT, \n' +
                    '                             NBSSS.DNR_PSN_REG PR,\n' +
                    '                             NBSSS.DNR_PERSON P\n' +
                    '                       WHERE DBT.REG_SEQ = PR.REG_SEQ\n' +
                    '                         AND P.PSN_SEQ=PR.PSN_SEQ    \n' +
                    '                         AND PR.REG_DATE = (SELECT MAX(REG_DATE) FROM DNR_PSN_REG WHERE PSN_SEQ = :PSN_SEQ)\n' +
                    '                       ';
                let result = await conn.execute(sql,[parseInt(psn_seq)]);
                if(false == result.rows){
                    resolve(null);
                }else{
                    resolve(rowsData.toMap(result.metaData,result.rows));
                }
                //返回
            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("来自testResultDao:"+err);
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自testResultDao:"+e);
                    }
                }
            }
        });
    }
}


module.exports=testResultDao;
