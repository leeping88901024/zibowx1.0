var rowsData = require('../../utils/rowsProcess');
var connPool = require("../../connPool");

/**
 * 向数据库查询用户
 */
var userdao = {
    getUserByOpenId : function (openid) {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
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
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
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
            return new Promise(async function(resolve, reject) {
                let conn;
                try {
                    conn = await  connPool.getNbsssConn();
                    var db_psn_seq = '';
                    //如果是身份证
                    if(isIdcard){
                        let result = await conn.execute("select psn_seq,cell_call from DNR_PERSON where idcard = :idcard",
                            [certNbr]);
                        db_psn_seq = result;

                    }else{
                        let result = await conn.execute("select p.psn_seq,\n" +
                            "       p.cell_call \n" +
                            "  from DNR_PSN_CERTIFICATE DPC,\n" +
                            "       DNR_PERSON P\n" +
                            " where dpc.psn_seq = p.psn_seq\n" +
                            "   and cert_type_seq = :cert_type_seq and certificate_nbr = :cert_nbr",
                            [certType,certNbr]);
                            db_psn_seq = result;
                    }

                    if(false == db_psn_seq){
                        resolve(null)
                    }else{
                        resolve(rowsData.toMap(db_psn_seq.metaData,db_psn_seq.rows));
                    }
                    //返回
                } catch (err) { // catches errors in getConnection and the query
                    console.log(err+"来自皮皮虾")
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
//根据psn_seq和献血编号查询用户信息
    getDonByPsnSeqDonId : (psn_seq,don_id)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                let result = await conn.execute("select count(*) cnt from dnr_bld_collect where psn_seq = :PSN_SEQ  and don_id = :DON_ID\n",
                        [parseInt(psn_seq),don_id]);
                console.log(JSON.stringify(result));

                if(false == result){
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
    },

//更新用户信息
    updateUserInfo : (openid,tell,psn_seq) =>{
            return new Promise(async function(resolve, reject) {
                let conn;
                try {
                    conn = await  connPool.getZibowxConn();
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
