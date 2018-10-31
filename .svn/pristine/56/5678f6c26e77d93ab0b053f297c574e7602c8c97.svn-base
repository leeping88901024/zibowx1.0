var rowsData = require('../utils/rowsProcess');

var bldRepayDao = {
    //证件类型、献血者于用血者关系
    getCertTypeRel:()=>{
        var oracledb = require('oracledb');
        return new Promise(async function(resolve, reject) {
            let conn;

            try {
                conn = await oracledb.getConnection({
                    user          : "zibowx",
                    password      : "zibowx",
                    connectString : "192.168.1.51:1521/spda"
                });
                //定义数组
                var dataArray = new Array();
                //查询证件类型
                let resultCertTypes = await conn.execute('SELECT DCT.CERT_TYPE_SEQ,DCT.CERTIFICATE_NAME FROM NBSSS.DNR_CERTIFICATE_TYPE@DL_NBSSS DCT WHERE DCT.ACTIVE = 1');
                if(false == resultCertTypes.rows){
                    console.log("加载出的证件类型！");
                }else{
                    dataArray[0] =  rowsData.toMap(resultCertTypes.metaData,resultCertTypes.rows);
                }
                //查询关系
                let resultRelation = await conn.execute('SELECT DRT.RELATION_TYPE_CODE,DRT.RELATION_TYPE_DESC FROM NBSSS.DNR_RELATION_TYPE@DL_NBSSS DRT WHERE DRT.ACTIVE = 1');
                if(false == resultRelation.rows){
                    console.log("加载出的关系类型！");
                }else{
                    dataArray[1] =  rowsData.toMap(resultRelation.metaData,resultRelation.rows);
                }
                //返回
                resolve(dataArray);
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


module.exports=bldRepayDao;
