var rowsData = require('../../utils/rowsProcess');
/**
 * 向数据库查询用户
 */
var userdao = {
    getUserByOpenId : function (openid) {
        var oracledb = require('oracledb');
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                        conn = await oracledb.getConnection({
                            user          : "zibowx",
                            password      : "zibowx",
                            connectString : "192.168.1.51:1521/spda"
                        });
                        //献血者认证
                        let result = await conn.execute(
                            "SELECT * FROM WX_USER WHERE OPENID =:openid",
                            [openid],
                        );

                         if(result.rows == false){
                             resolve(null);
                            }else {
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
    },
//向数据库插入数据
    insertUserInfo : async (user) => {
        var oracledb = require('oracledb');
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await oracledb.getConnection({
                    user          : "zibowx",
                    password      : "zibowx",
                    connectString : "192.168.1.51:1521/spda"
                });
                //献血者认证
                let result = await conn.execute(
                    "insert into wx_user(id,img_path,openid,online_name,nation,province,city,sex,regist_date)" +
                    " values(seq_zb_user.nextval,:img_path,:openid,:online_name,:nation,:province,:city,:sex,sysdate)",
                    [user.headimgurl, user.openid, user.nickname, user.country, user.province, user.city, user.sex],
                );
                conn.commit((err)=>{
                   if(err != null){
                       reject(err);
                       return;
                   }
                });
                resolve(result);
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
    },
    /**
     *
     * @param isIdcard
     * @param certType
     * @param certNbr
     * @returns {Promise<any>}
     */
//根据证件类型和编号查询psn_seq
    getPsnSeqByIdcard : (isIdcard,certType,certNbr)=>{
            var oracledb = require('oracledb');
            return new Promise(async function(resolve, reject) {
                let conn;
                try {
                    conn = await oracledb.getConnection({
                        user          : "nbsss",
                        password      : "a123456",
                        connectString : "192.168.1.16:1521/nbsss"
                    });

                    var db_psn_seq = '';
                    //如果是身份证
                    if(isIdcard){
                        let result = await conn.execute("select psn_seq from DNR_PERSON where idcard = :idcard",
                            [certNbr]);
                        db_psn_seq = result.rows;

                    }else{
                        let result = await conn.execute("select psn_seq from DNR_PSN_CERTIFICATE t where cert_type_seq = :cert_type_seq and certificate_nbr = :cert_nbr",
                            [certType,certNbr]);
                        db_psn_seq = result.rows;
                    }

                    if(false == db_psn_seq){
                        resolve(null)
                    }else{
                        resolve(db_psn_seq);
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
        },
//更新用户信息
    updateUserInfo : (openid,tell,psn_seq) =>{
            var oracledb = require('oracledb');
            return new Promise(async function(resolve, reject) {
                let conn;
                try {
                    conn = await oracledb.getConnection({
                        user          : "zibowx",
                        password      : "zibowx",
                        connectString : "192.168.1.51:1521/spda"
                    });
                    //献血者认证
                    let result = await conn.execute(
                        "UPDATE WX_USER SET TELL = :TELL,PSN_SEQ =  :PSN_SEQ  WHERE  OPENID = :OPENID",
                        [tell,parseInt(psn_seq),openid],
                    );
                    conn.commit((err)=>{
                        if(err != null){
                            reject(err);
                            return;
                        }
                    });
                    resolve(result);
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


module.exports=userdao;
