var rowsData = require('../utils/rowsProcess');
var connPool = require("../connPool");

var donRecordDao = {
    //证件类型、献血者于用血者关系
    queryDonRecord:(psn_seq)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                //献血记录查询
                var sql ='  SELECT P.PSN_NAME,\n' +
                    '                            P.IDCARD,\n' +
                    '                            P.ABO_GROUP,\n' +
                    '                            P.SEX,\n' +
                    '                            TO_CHAR(BC.COLLATE_DATE,\'yyyy-MM-dd\') COLLATE_DATE,\n' +
                    '                            DPL.LOCATION_NAME,\n' +
                    '                            BC.PHLE_TYPE,\n' +
                    '                            DDC.DONATION_NAME,\n' +
                    '                            BC.ACTUAL_VOLUME,\n' +
                    '                           SUM(BC.ACTUAL_VOLUME)OVER(PARTITION BY BC.PHLE_TYPE) SUM_ACTUAL_VOLUME,\n' +
                    '                           SUM(BC.PHLE_VOLUME)OVER(PARTITION BY BC.PSN_SEQ) SUM_PHLE_VOLUME \n' +
                    '                       FROM NBSSS.DNR_BLD_COLLECT BC,\n' +
                    '                            NBSSS.DNR_PERSON P,\n' +
                    '                            NBSSS.DNR_PHLE_LOCATION DPL,\n' +
                    '                            NBSSS.DNR_PSN_REG PR,\n' +
                    '                            NBSSS.DNR_DONATION_CLASS DDC\n' +
                    '                      WHERE BC.REG_SEQ = PR.REG_SEQ\n' +
                    '                        AND BC.LOCATION_SEQ = DPL.LOCATION_SEQ\n' +
                    '                        AND P.PSN_SEQ = PR.PSN_SEQ\n' +
                    '                        AND DDC.DONATION_CLASS = PR.DONATION_CLASS\n' +
                    '                        AND BC.ACTIVE = 1\n' +
                    '                        AND P.PSN_SEQ = :PSN_SEQ\n' +
                    '                   ORDER BY BC.COLLATE_DATE DESC   ';
                let result = await conn.execute(sql,[parseInt(psn_seq)]);
                if(false == result.rows){
                    resolve(null)
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


module.exports=donRecordDao;
