var rowsData = require('../utils/rowsProcess');

var testResultDao = {
    //检测结果查询
    queryTestResult:(psn_seq)=>{
        console.log("血液检测结果收到的 记录为 "+psn_seq)
        var oracledb = require('oracledb');
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await oracledb.getConnection({
                    user          : "nbsss",
                    password      : "a123456",
                    connectString : "192.168.1.16:1521/nbsss"
                });
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
    }
}


module.exports=testResultDao;
