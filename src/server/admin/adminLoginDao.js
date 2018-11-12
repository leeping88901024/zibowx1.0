var rowsData = require('../utils/rowsProcess');
var connPool = require("../connPool");

var adminLoginDao = {
    /**
     * 根据用户名查询用户
     * @param articles
     * @returns {Promise<any>}
     */
    getUserByUsername : async (articles) => {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                let sql = "SELECT COUNT(*) FROM WX_USER_ADMIN WHERE USERNAME = :USERNAME";
                //插入文章
                let result = await conn.execute(sql);

                if(false == result.rows){
                    resolve(null)
                }else{
                    resolve();
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
}


module.exports=adminLoginDao;
