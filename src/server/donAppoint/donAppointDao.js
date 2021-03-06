var rowsData = require('../utils/rowsProcess');
var connPool = require("../connPool");
var wxconfig = require("../wxconfig");
//日志
var loggerFile = require("../logs/loggerFile");

var donBldAppointDao = {
    //加载所有的行政区
    loadRegion : function (res) {
        connPool.getZibowxConn().then((connection)=>{
            connection.execute(
                "select location_id,location_name from WX_REGION where active = 1",
                function (err, result) {
                    if (err) {
                        loggerFile.error("来自donBldAppointDao_loadRegion:加载所有的行政区失败"+err);
                        let resBody = {
                            status : 10017,
                            message:'加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }

                    //直接向应给客户端
                    var data_cus =rowsData.toMap(result.metaData,result.rows);
                    let resBody ={
                        status :200,
                        message:"ok",
                        data:data_cus
                    }
                    res.send(resBody);
                    if(connection){
                        connection.close((err) => {
                            if (err) {
                                loggerFile.error("来自donBldAppointDao_loadRegion:关闭connection异常"+err);
                            }
                        });
                    }
                });
        }).catch((err)=>{
            loggerFile.error("来自donBldAppointDao_loadRegion:加载所有的行政区失败"+err);
            let resBody = {
                status : 10017,
                message:'加载数据失败'
            }
            res.send(resBody);
            return
        })
    },
    //加载所有地点
    loadLocation:function (res){
        connPool.getZibowxConn().then((connection)=>{
            var sql ="\n" +
                "SELECT WLD.EXACT_ADDRESS,\n" +
                "       WLD.LOCATION_SEQ,\n" +
                "       DT.TYPE_DESC,\n" +
                "       WLD.TYPE_ID,\n" +
                "       WLD.OPENINGTIME,\n" +
                "       WLD.CLOSEDTIME,\n" +
                "       WLD.LOCATION_NAME,\n" +
                "       WLD.IMG_URI,\n" +
                "      (SELECT wmsys.wm_concat('''' || ls.icon_path || '''')  \n" +
                "      FROM wx_location_service ls\n" +
                "      WHERE ls.service_id IN (SELECT sdr.service_id \n" +
                "      FROM wx_service_detail_relation sdr \n" +
                "      WHERE sdr.detail_id = WLD.LOCATION_SEQ)) AS services \n" +
                "  FROM  WX_LOCATION_DETAIL WLD,\n" +
                "        WX_LOCATION_DON_TYPE DT,\n" +
                "        NBSSS.DNR_PHLE_LOCATION@DL_FZ DPL\n" +
                "WHERE  DPL.LOCATION_SEQ = WLD.LOCATION_SEQ\n" +
                "  AND  DT.TYPE_ID = WLD.TYPE_ID\n" +
                "  AND DPL.ACTIVE = 1   ";
            connection.execute(
                sql,
                function (err, result) {
                    if (err) {
                        loggerFile.error("来自donBldAppointDao_loadLocation:加载所有地点"+err);
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
                                loggerFile.error("来自donBldAppointDao_loadLocation:关闭数据库连接失败"+err);
                            }
                        });
                    }
                });

        }).catch((err)=>{
            loggerFile.error("来自donBldAppointDao_loadLocation:加载所有地点"+err);
            let resBody = {
                status : 10017,
                message:'加载数据失败'
            }
            res.send(resBody);
            return
        })
    },
    //查询献血者可献血日期
    getDnrReturnDate:function(isIdcard,certType,certNumn) {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                //如果身份证
                if(isIdcard){
                    let result = await conn.execute('SELECT DISTINCT P.PSN_NAME,\n' +
                        '                P.IDCARD,\n' +
                        '                P.PSN_SEQ,\n' +
                        '                TO_CHAR(PS.WB_CAN_PHLE_DATE,\'YYYY/MM/DD\') WB_CAN_PHLE_DATE,\n' +
                        '                TO_CHAR(PS.MA_CAN_PHLE_DATE,\'YYYY/MM/DD\') MA_CAN_PHLE_DATE\n' +
                        'FROM   NBSSS.DNR_PERSON@'+wxconfig.datalink+' P,\n' +
                        '       NBSSS.DNR_PSN_STATE@'+wxconfig.datalink+' PS\n' +
                        'WHERE  P.PSN_SEQ = PS.PSN_SEQ\n' +
                        ' AND   P.IDCARD = :IDCARD\n',
                        [certNumn]
                    );
                    if(false == result.rows){
                        resolve(null);
                    }else{
                        resolve(rowsData.toMap(result.metaData,result.rows));
                    }
                }else{
                    let result = await conn.execute(" SELECT TO_CHAR(PS.WB_CAN_PHLE_DATE,'YYYY/MM/DD') WB_CAN_PHLE_DATE,\n" +
                        "        TO_CHAR(PS.MA_CAN_PHLE_DATE,'YYYY/MM/DD') MA_CAN_PHLE_DATE,\n" +
                        "        PS.PSN_SEQ\n" +
                        "  FROM  NBSSS.DNR_PSN_STATE@"+wxconfig.datalink+" PS\n" +
                        " WHERE PS.PSN_SEQ = ( \n" +
                        " SELECT DISTINCT PC.PSN_SEQ \n" +
                        "   FROM NBSSS.DNR_PSN_CERTIFICATE@"+wxconfig.datalink+" PC \n" +
                        "  WHERE PC.CERT_TYPE_SEQ = :TYPE\n" +
                        "   AND  PC.CERTIFICATE_NBR = :NUM)",
                        [certType,certNumn]
                    );
                    if(false == result.rows){
                        resolve(null);
                    }else{
                        resolve(rowsData.toMap(result.metaData,result.rows));
                    }
                }

            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("来自donBldAppointDao_getDnrReturnDate:查询献血者可献血日期"+err);
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_getDnrReturnDate:"+e);
                    }
                }
            }
        });
    },
    //验证用户是否已经预约
    isAlreadyAppoint:function(isIdcard,certType,certNumn,appDate) {
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                let db_psn_seq = '';
                //如果身份证
                if(isIdcard){
                    let result = await conn.execute("select psn_seq from DNR_PERSON where idcard = :idcard",
                        [certNumn]
                    );
                    if(false == result.rows){
                        resolve(null);
                    }else{
                        db_psn_seq = result.rows;
                    }
                }else{
                    let result = await conn.execute("select psn_seq from DNR_PSN_CERTIFICATE t where cert_type_seq = :cert_type_seq and certificate_nbr = :cert_nbr",
                        [certType,certNumn]
                    );

                    if(false == result.rows){
                        resolve(null);
                    }else{
                        db_psn_seq = result.rows;
                    }
                }
                db_psn_seq = parseInt(db_psn_seq);
                //根据seq查询用户是否有待献血记录
                let result_recruit = await conn.execute("select count(*) from DNR_RECRUIT where psn_seq = :psn_seq  and to_char(valid_from,'yyyy-MM-dd') = :appDate and  recruit_status_code = 1\n",
                    [db_psn_seq,appDate]);
                if(result_recruit.rows[0] == 0){
                    resolve(true);
                }else {
                    resolve(false);
                }

            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("来自donBldAppointDao_isAlreadyAppoint:验证用户是否已经预约异常"+err);
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_isAlreadyAppoint:"+e);
                    }
                }
            }
        });
    },
    //根据location_type加载区域
    getLocationByType:function (res,locationType) {
        connPool.getZibowxConn().then((connection)=>{
            connection.execute('select dpl.location_seq,\n' +
                '       dpl.location_name,\n' +
                '       dpl.location_type,\n' +
                '       r.location_name region_name,\n' +
                '       ld.opening_hours,\n' +
                '       ld.img_path,\n' +
                '       ld.exact_address,\n' +
                '       ld.lng,\n' +
                '       ld.lat,\n' +
                '       ldt.type_id,\n' +
                '       ldt.type_desc,\n' +
                '       (select wmsys.wm_concat(\'\'\'\' || ls.icon_path || \'\'\'\') \n' +
                '       from wx_location_service ls\n' +
                '       where ls.service_id in (select sdr.service_id \n' +
                '       from wx_service_detail_relation sdr \n' +
                '       where sdr.detail_id = ld.id)) as services       \n' +
                'from WX_DNR_PHLE_LOCATION dpl,\n' +
                '     WX_LOCATION_DETAIL ld,\n' +
                '     WX_REGION r,\n' +
                '     WX_LOCATION_DON_TYPE ldt\n' +
                'where dpl.location_seq = ld.location_seq\n' +
                '  and dpl.location_type = r.location_id\n' +
                '  and ld.type_id = ldt.type_id\n' +
                '  and dpl.location_type = :LOC_TYPE',
                [locationType],
                function (err, result) {
                    if (err) {
                        loggerFile.error("来自donBldAppointDao_getLocationByType:"+err);
                        let resBody = {
                            status : 10017,
                            message:'加载数据失败'
                        }
                        res.send(resBody);
                        return
                    }
                    //直接向应给客户端
                    var data_cus =rowsData.toMap(result.metaData,result.rows);
                    let resBody ={
                        status :200,
                        message:"ok",
                        data:data_cus
                    }
                    res.send(resBody);
                    if(connection){
                        connection.close((err) => {
                            if (err) {
                                loggerFile.error("来自donBldAppointDao_getLocationByType:"+err);
                            }
                        });
                    }
                });
        }).catch((err)=>{
            loggerFile.error("来自donBldAppointDao_getLocationByType:"+err);
            let resBody = {
                status : 10017,
                message:'加载数据失败'
            }
            res.send(resBody);
            return
        })
    },
    //加载学历、民族、职业
    getEduNationProf:()=>{
            return new Promise(async function(resolve, reject) {
                let conn;
                try {
                    conn = await  connPool.getZibowxConn();
                    //定义数组
                    var dataArray = new Array();
                    //查询学历
                    let resultEdu = await conn.execute('SELECT DE.EDUCATION_SEQ,DE.EDUCATION_NAME FROM NBSSS.DNR_EDUCATION@'+wxconfig.datalink+' DE WHERE ACTIVE = 1');
                    if(false == resultEdu.rows){
                      console.log("加载出的学历为空！");
                    }else{
                        dataArray[0] =  rowsData.toMap(resultEdu.metaData,resultEdu.rows);
                    }
                    //查询民族
                    let resultNation = await conn.execute('SELECT NN.NATION_SEQ,NN.NATION_NAME  FROM NBSSS.DNR_NATION@'+wxconfig.datalink+' NN ');
                    if(false == resultNation.rows){
                        console.log("加载出的民族为空！");
                    }else{
                        dataArray[1] =  rowsData.toMap(resultNation.metaData,resultNation.rows);
                    }
                    //加载职业
                    let resultProfession = await conn.execute('SELECT  DP.PROFESSION_SEQ,DP.PROFESSION_NAME FROM NBSSS.DNR_PROFESSION@'+wxconfig.datalink+' DP WHERE DP.ACTIVE =1 ');
                    if(false == resultNation.rows){
                        console.log("加载出的学历为空！");
                    }else{
                        dataArray[2] =  rowsData.toMap(resultProfession.metaData,resultProfession.rows);
                    }
                    //返回
                    resolve(dataArray);
                } catch (err) { // catches errors in getConnection and the query
                    loggerFile.error("来自donBldAppointDao_getEduNationProf:"+err);
                    reject(err);
                } finally {
                    if (conn) {   // the conn assignment worked, must release
                        try {
                            await conn.release();
                        } catch (e) {
                            loggerFile.error("来自donBldAppointDao_getEduNationProf:"+e);
                        }
                    }
                }
            });
    },
    //加载证件类型
    getCertTypes:()=>{
        var oracledb = require('oracledb');
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                //定义数组
                var dataArray = new Array();
                //查询证件类型
                let resultCertTypes = await conn.execute('SELECT DCT.CERT_TYPE_SEQ,DCT.CERTIFICATE_NAME FROM NBSSS.DNR_CERTIFICATE_TYPE@'+wxconfig.datalink+' DCT WHERE DCT.ACTIVE = 1');
                if(false == resultCertTypes.rows){
                    loggerFile.error("来自donBldAppointDao_getCertTypes:加载出的证件类型为空");
                }else{
                    dataArray[0] =  rowsData.toMap(resultCertTypes.metaData,resultCertTypes.rows);
                }
                //返回
                resolve(dataArray);
            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("来自donBldAppointDao_getCertTypes:"+err);
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_getCertTypes:"+e);
                    }
                }
            }
        });
    },
    //向数据库插入预约信息
    insertAppointInfo : (appointInfo)=>{
        var oracledb = require("oracledb");
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                //如果是第一次献血并且未使用身份证
                if(appointInfo.isFirst && appointInfo.certType != appointInfo.idcardSeq ) {
                    let  d_psn_seq = '';

                    //查询该献血者信息是否已经存在
                    let resCertSeq = await conn.execute("select psn_seq from DNR_PSN_CERTIFICATE t where cert_type_seq = :certType and certificate_nbr = :certNbr",
                        [appointInfo.certType,appointInfo.idcard]);


                    if(resCertSeq.rows == false){
                        //向dnr_person插入数据
                        let result_person = await conn.execute("begin\n" +
                            "  :ret := a_recruit.new_dnr_person(:p_psn_name,\n" +
                            "                                      :p_idcard,\n" +
                            "                                      :p_sex,\n" +
                            "                                      to_date(:p_birthday,\'yyyy-MM-dd\'),\n" +
                            "                                      :p_abo_group,\n" +
                            "                                      :p_rhd,\n" +
                            "                                      :p_fixed_call,\n" +
                            "                                      :p_cell_call,\n" +
                            "                                      :p_local_call,\n" +
                            "                                      :p_email,\n" +
                            "                                      :p_qq,\n" +
                            "                                      :p_msn,\n" +
                            "                                      :p_address,\n" +
                            "                                      :p_postcode,\n" +
                            "                                      :p_country_seq,\n" +
                            "                                      :p_province_seq,\n" +
                            "                                      :p_city,\n" +
                            "                                      :p_education_seq,\n" +
                            "                                      :p_profession_seq,\n" +
                            "                                      :p_politics_seq,\n" +
                            "                                      :p_nation_seq,\n" +
                            "                                      :p_group_seq,\n" +
                            "                                      :p_local_type);\n" +
                            "end;\n",
                            {
                                ret: {dir: oracledb.BIND_OUT, type: oracledb.INTEGER},
                                p_psn_name: appointInfo.name,
                                p_sex: appointInfo.sex,
                                p_birthday: appointInfo.birthday,
                                p_abo_group: appointInfo.aboGroup,
                                p_cell_call: appointInfo.tell,
                                p_address: appointInfo.address,
                                p_education_seq: appointInfo.education,
                                p_profession_seq: appointInfo.profession,
                                p_nation_seq: appointInfo.nation,
                                p_local_type: 0,
                                p_idcard: '',
                                p_rhd: '',
                                p_fixed_call: '',
                                p_local_call: '',
                                p_email: '',
                                p_qq: '',
                                p_msn: '',
                                p_postcode: '',
                                p_country_seq: '',
                                p_province_seq: '',
                                p_city: '',
                                p_politics_seq: '',
                                p_group_seq: '',
                            }
                        );
                        //得到psn_seq
                        d_psn_seq = result_person.outBinds.ret;
                        //插入证件类型和证件编号
                        let result_cert = await conn.execute("begin\n" +
                            "  a_recruit.new_dnr_psn_certificate(:p_psn_seq,\n" +
                            "                                    :p_cert_type_seq,\n" +
                            "                                    :p_certificate_nbr);\n" +
                            "end;\n",
                            {
                                p_psn_seq :d_psn_seq,
                                p_cert_type_seq :appointInfo.certType,
                                p_certificate_nbr :appointInfo.idcard
                            });
                    }else{
                        d_psn_seq = resCertSeq.rows;
                    }


                //向dnr_recriut表插入数据
                let result_recruit = await conn.execute(
                    "begin\n" +
                    "    :ret := a_recruit.save_dnr_recruit(:p_recruit_seq,\n" +
                    "                                        :p_psn_seq,\n" +
                    "                                        :p_component_code,\n" +
                    "                                        :p_type_code,\n" +
                    "                                        :p_location_seq,\n" +
                    "                                        :p_intend_phle_volume,\n" +
                    "                                        :p_recruit_type_code,\n" +
                    "                                        :p_group_seq,\n" +
                    "                                        :p_last_recruit_date,\n" +
                    "                                        :p_last_recruit_employee,\n" +
                    "                                        :p_next_recruit_date,\n" +
                    "                                        :p_recruit_status_code,\n" +
                    "                                        :p_comments,\n" +
                    "                                        trunc(to_date(:p_valid_from,\'yyyy-MM-dd\')),\n" +
                    "                                        trunc(to_date(:p_valid_from,\'yyyy-MM-dd\')+1),\n" +
                    "                                        :p_recruit_title,\n" +
                    "                                        :p_recruit_handle_emp,\n" +
                    "                                        :p_recruit_plan_seq);\n" +
                    "end;\n",
                    {
                        ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                        p_psn_seq : d_psn_seq,
                        p_type_code : appointInfo.donType,
                        p_location_seq :appointInfo.phleLocSeq,
                        p_recruit_status_code: 1,
                        p_comments :'微信预约' ,
                        p_valid_from : appointInfo.appointDate,
                        p_recruit_title :'微信预约',
                        p_recruit_seq :'',
                        p_component_code:'',
                        p_intend_phle_volume :'',
                        p_recruit_type_code:19500,
                        p_group_seq:'',
                        p_last_recruit_date:'',
                        p_last_recruit_employee:'',
                        p_next_recruit_date:'',
                        p_recruit_handle_emp:'',
                        p_recruit_plan_seq:''
                    }
                );
                //得到recruit_seq
                let d_recruit_seq = result_recruit.outBinds.ret;
                //插入recruit_record表
                let result_recu_record = await conn.execute("begin\n" +
                    "  :ret := a_recruit.save_dnr_recruit_record(:p_record_seq,\n" +
                    "                                               :p_recruit_seq,\n" +
                    "                                               :p_inform_type_code,\n" +
                    "                                               :p_recruit_status_code,\n" +
                    "                                               :p_record_employee,\n" +
                    "                                               :p_record_date,\n" +
                    "                                               :p_next_recruit_employee,\n" +
                    "                                               :p_next_recruit_date,\n" +
                    "                                               :p_comments);\n" +
                    "end;\n",
                    {
                        ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                        p_recruit_seq :d_recruit_seq,
                        p_recruit_status_code :1,
                        p_comments :'微信预约',
                        p_record_seq:'',
                        p_inform_type_code:'',
                        p_record_employee:32000,
                        p_record_date:'',
                        p_next_recruit_employee:'',
                        p_next_recruit_date:''
                    });

                let result_record = result_recu_record.outBinds.ret;
                    conn.commit((err) => {
                        loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+err);
                        if (err != null) {
                            loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+err);
                            conn.rollback((r_err) => {
                                loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+r_err);
                                reject(err);
                            })
                            reject(err);
                        }
                    });

                    let reObj = {
                        d_psn_seq : d_psn_seq,
                        d_recruit_seq : d_recruit_seq
                    }
                    //返回recruit提供给日后查询
                    resolve(reObj);

                }
                //第一次献血且使用身份证
                if(appointInfo.isFirst && appointInfo.certType == appointInfo.idcardSeq ){
                    let  d_psn_seq = '';
                    //查询该献血者信息是否已经存在
                    let resCertSeq = await conn.execute("select psn_seq from DNR_PERSON where idcard = :idcard",
                        [appointInfo.idcard]);
                    if(resCertSeq.rows == false){
                        //向dnr_person插入数据
                        let result_person = await conn.execute("begin\n" +
                            "  :ret := a_recruit.new_dnr_person(:p_psn_name,\n" +
                            "                                      :p_idcard,\n" +
                            "                                      :p_sex,\n" +
                            "                                      to_date(:p_birthday,\'yyyy-MM-dd\'),\n" +
                            "                                      :p_abo_group,\n" +
                            "                                      :p_rhd,\n" +
                            "                                      :p_fixed_call,\n" +
                            "                                      :p_cell_call,\n" +
                            "                                      :p_local_call,\n" +
                            "                                      :p_email,\n" +
                            "                                      :p_qq,\n" +
                            "                                      :p_msn,\n" +
                            "                                      :p_address,\n" +
                            "                                      :p_postcode,\n" +
                            "                                      :p_country_seq,\n" +
                            "                                      :p_province_seq,\n" +
                            "                                      :p_city,\n" +
                            "                                      :p_education_seq,\n" +
                            "                                      :p_profession_seq,\n" +
                            "                                      :p_politics_seq,\n" +
                            "                                      :p_nation_seq,\n" +
                            "                                      :p_group_seq,\n" +
                            "                                      :p_local_type);\n" +
                            "end;\n",
                            {
                                ret: {dir: oracledb.BIND_OUT, type: oracledb.INTEGER},
                                p_psn_name: appointInfo.name,
                                p_sex: appointInfo.sex,
                                p_birthday: appointInfo.birthday,
                                p_abo_group: appointInfo.aboGroup,
                                p_cell_call: appointInfo.tell,
                                p_address: appointInfo.address,
                                p_education_seq: appointInfo.education,
                                p_profession_seq: appointInfo.profession,
                                p_nation_seq: appointInfo.nation,
                                p_local_type: 0,
                                p_idcard: appointInfo.idcard,
                                p_rhd: '',
                                p_fixed_call: '',
                                p_local_call: '',
                                p_email: '',
                                p_qq: '',
                                p_msn: '',
                                p_postcode: '',
                                p_country_seq: '',
                                p_province_seq: '',
                                p_city: '',
                                p_politics_seq: '',
                                p_group_seq: '',
                            }
                        );
                        //得到psn_seq
                        d_psn_seq = result_person.outBinds.ret;
                    }else{
                        d_psn_seq = resCertSeq.rows;
                    }
                    //向dnr_recriut表插入数据
                    let result_recruit = await conn.execute(
                        "begin\n" +
                        "    :ret := a_recruit.save_dnr_recruit(:p_recruit_seq,\n" +
                        "                                        :p_psn_seq,\n" +
                        "                                        :p_component_code,\n" +
                        "                                        :p_type_code,\n" +
                        "                                        :p_location_seq,\n" +
                        "                                        :p_intend_phle_volume,\n" +
                        "                                        :p_recruit_type_code,\n" +
                        "                                        :p_group_seq,\n" +
                        "                                        :p_last_recruit_date,\n" +
                        "                                        :p_last_recruit_employee,\n" +
                        "                                        :p_next_recruit_date,\n" +
                        "                                        :p_recruit_status_code,\n" +
                        "                                        :p_comments,\n" +
                        "                                        trunc(to_date(:p_valid_from,\'yyyy-MM-dd\')),\n" +
                        "                                        trunc(to_date(:p_valid_from,\'yyyy-MM-dd\')+1),\n" +
                        "                                        :p_recruit_title,\n" +
                        "                                        :p_recruit_handle_emp,\n" +
                        "                                        :p_recruit_plan_seq);\n" +
                        "end;\n",
                        {
                            ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                            p_psn_seq : parseInt(d_psn_seq),
                            p_type_code : appointInfo.donType,
                            p_location_seq :appointInfo.phleLocSeq,
                            p_recruit_status_code: 1,
                            p_comments :'微信预约' ,
                            p_valid_from : appointInfo.appointDate,
                            p_recruit_title :'微信预约',
                            p_recruit_seq :'',
                            p_component_code:'',
                            p_intend_phle_volume :'',
                            p_recruit_type_code:19500,
                            p_group_seq:'',
                            p_last_recruit_date:'',
                            p_last_recruit_employee:'',
                            p_next_recruit_date:'',
                            p_recruit_handle_emp:'',
                            p_recruit_plan_seq:''
                        }
                    );
                    //得到recruit_seq
                    let d_recruit_seq = result_recruit.outBinds.ret;
                    //插入recruit_record表
                    let result_recu_record = await conn.execute("begin\n" +
                        "  :ret := a_recruit.save_dnr_recruit_record(:p_record_seq,\n" +
                        "                                               :p_recruit_seq,\n" +
                        "                                               :p_inform_type_code,\n" +
                        "                                               :p_recruit_status_code,\n" +
                        "                                               :p_record_employee,\n" +
                        "                                               :p_record_date,\n" +
                        "                                               :p_next_recruit_employee,\n" +
                        "                                               :p_next_recruit_date,\n" +
                        "                                               :p_comments);\n" +
                        "end;\n",
                        {
                            ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                            p_recruit_seq :d_recruit_seq,
                            p_recruit_status_code :1,
                            p_comments :'微信预约',
                            p_record_seq:'',
                            p_inform_type_code:'',
                            p_record_employee:32000,
                            p_record_date:'',
                            p_next_recruit_employee:'',
                            p_next_recruit_date:''
                        });

                    let result_record = result_recu_record.outBinds.ret;
                    conn.commit((err) => {
                        loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+err);
                        if (err != null) {
                            loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+err);
                            conn.rollback((r_err) => {
                                loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+r_err);
                                reject(err);
                            })
                            reject(err);
                        }
                    });
                    //返回结果
                    let reObj = {
                        d_psn_seq : d_psn_seq,
                        d_recruit_seq : d_recruit_seq
                    }
                    //返回recruit提供给日后查询
                    resolve(reObj);
                }
                //不是第一次献血
                if(!appointInfo.isFirst){
                    let d_psn_seq = appointInfo.psn_seq;
                    //判断psn-seq是否为空
                    if(appointInfo.psn_seq == null){
                        reject("psn_seq为空！");
                        return;
                    }
                    //向dnr_recriut表插入数据
                    let result_recruit = await conn.execute(
                        "begin\n" +
                        "    :ret := a_recruit.save_dnr_recruit(:p_recruit_seq,\n" +
                        "                                        :p_psn_seq,\n" +
                        "                                        :p_component_code,\n" +
                        "                                        :p_type_code,\n" +
                        "                                        :p_location_seq,\n" +
                        "                                        :p_intend_phle_volume,\n" +
                        "                                        :p_recruit_type_code,\n" +
                        "                                        :p_group_seq,\n" +
                        "                                        :p_last_recruit_date,\n" +
                        "                                        :p_last_recruit_employee,\n" +
                        "                                        :p_next_recruit_date,\n" +
                        "                                        :p_recruit_status_code,\n" +
                        "                                        :p_comments,\n" +
                        "                                        trunc(to_date(:p_valid_from,\'yyyy-MM-dd\')),\n" +
                        "                                        trunc(to_date(:p_valid_from,\'yyyy-MM-dd\')+1),\n" +
                        "                                        :p_recruit_title,\n" +
                        "                                        :p_recruit_handle_emp,\n" +
                        "                                        :p_recruit_plan_seq);\n" +
                        "end;\n",
                        {
                            ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                            p_psn_seq : d_psn_seq,
                            p_type_code : appointInfo.donType,
                            p_location_seq :appointInfo.phleLocSeq,
                            p_recruit_status_code: 1,
                            p_comments :'微信预约' ,
                            p_valid_from : appointInfo.appointDate,
                            p_recruit_title :'微信预约',
                            p_recruit_seq :'',
                            p_component_code:'',
                            p_intend_phle_volume :'',
                            p_recruit_type_code:19500,
                            p_group_seq:'',
                            p_last_recruit_date:'',
                            p_last_recruit_employee:'',
                            p_next_recruit_date:'',
                            p_recruit_handle_emp:'',
                            p_recruit_plan_seq:''
                        }
                    );
                    //得到recruit_seq
                    let d_recruit_seq = result_recruit.outBinds.ret;
                    //插入recruit_record表
                    let result_recu_record = await conn.execute("begin\n" +
                        "  :ret := a_recruit.save_dnr_recruit_record(:p_record_seq,\n" +
                        "                                               :p_recruit_seq,\n" +
                        "                                               :p_inform_type_code,\n" +
                        "                                               :p_recruit_status_code,\n" +
                        "                                               :p_record_employee,\n" +
                        "                                               :p_record_date,\n" +
                        "                                               :p_next_recruit_employee,\n" +
                        "                                               :p_next_recruit_date,\n" +
                        "                                               :p_comments);\n" +
                        "end;\n",
                        {
                            ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                            p_recruit_seq :d_recruit_seq,
                            p_recruit_status_code :1,
                            p_comments :'微信预约',
                            p_record_seq:'',
                            p_inform_type_code:'',
                            p_record_employee:32000,
                            p_record_date:'',
                            p_next_recruit_employee:'',
                            p_next_recruit_date:''
                        });

                    let result_record = result_recu_record.outBinds.ret;
                    conn.commit((err) => {
                        loggerFile.error("来自donBldAppointDao_insertAppointInfo不是第一次献血:"+err);
                        if (err != null) {
                            loggerFile.error("来自donBldAppointDao_insertAppointInfo不是第一次献血:"+err);
                            conn.rollback((r_err) => {
                                loggerFile.error("来自donBldAppointDao_insertAppointInfo不是第一次献血:"+r_err);
                                reject(err);
                            })
                            reject(err);
                        }
                    });
                    //返回结果
                   let reObj = {
                        d_psn_seq : d_psn_seq,
                        d_recruit_seq : d_recruit_seq
                    }
                    //返回recruit提供给日后查询
                    resolve(reObj);
                }
            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+err);
                conn.rollback((r_err)=>{
                    loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+r_err);
                    reject(r_err);
                })
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_insertAppointInfo:"+e);
                    }
                }
            }
        });
    },

    //查询我的预约记录根据psn_seq
    getAppointRecordByPsnseq : (psn_seq)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                let resultEdu = await conn.execute('SELECT R.RECRUIT_SEQ, \n' +
                    '                           R.PSN_SEQ,\n' +
                    '                           R.LOCATION_SEQ,\n' +
                    '                           P.LOCATION_NAME,\n' +
                    '                           R.RECRUIT_STATUS_CODE,\n' +
                    '                           RSC.RECRUIT_STATUS_DESC,\n' +
                    '                           TO_CHAR(R.CREATE_DATE,\'yyyy-MM-dd hh24:mi:ss\') CREATE_DATE,\n' +
                    '                           TO_CHAR(R.VALID_FROM,\'yyyy-MM-dd hh24:mi:ss\') VALID_FROM\n' +
                    '                      FROM DNR_RECRUIT R,\n' +
                    '                           DNR_RECRUIT_STATUS_CODE RSC,\n' +
                    '                           DNR_PHLE_LOCATION P\n' +
                    '                     WHERE R.RECRUIT_STATUS_CODE = RSC.RECRUIT_STATUS_CODE\n' +
                    '                       AND P.LOCATION_SEQ = R.LOCATION_SEQ\n' +
                    '                       AND R.PSN_SEQ = :PSN_SEQ\n' +
                    '                  ORDER BY CREATE_DATE DESC ',
                    [parseInt(psn_seq)]);
                console.log(JSON.stringify(resultEdu))
                if(false == resultEdu.rows){
                    loggerFile.error("来自donBldAppointDao_getAppointRecordByPsnseq:预约数据为空");
                }else{
                    resolve(rowsData.toMap(resultEdu.metaData,resultEdu.rows));
                }
            } catch (err) {
                loggerFile.error("来自donBldAppointDao_getAppointRecordByPsnseq:"+err);
                reject(err);
            } finally {
                if (conn) {
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_getAppointRecordByPsnseq:"+e);
                    }
                }
            }
        });
    },
    //查询我的预约记录根据recruit_seq
    getAppointRecordByRecruitSeq : (recruit_seq)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                let resultEdu = await conn.execute('\n' +
                    'SELECT R.RECRUIT_SEQ,\n' +
                    '       R.PSN_SEQ,\n' +
                    '       R.LOCATION_SEQ,\n' +
                    '       P.LOCATION_NAME,\n' +
                    '       R.RECRUIT_STATUS_CODE,\n' +
                    '       RSC.RECRUIT_STATUS_DESC,\n' +
                    '       TO_CHAR(R.CREATE_DATE,\'yyyy-MM-dd hh24:mi:ss\') CREATE_DATE,\n' +
                    '       TO_CHAR(R.VALID_FROM,\'yyyy-MM-dd hh24:mi:ss\') VALID_FROM\n' +
                    '  FROM DNR_RECRUIT R,\n' +
                    '       DNR_RECRUIT_STATUS_CODE RSC,\n' +
                    '       DNR_PHLE_LOCATION P\n' +
                    ' WHERE R.RECRUIT_STATUS_CODE = RSC.RECRUIT_STATUS_CODE\n' +
                    '   AND P.LOCATION_SEQ = R.LOCATION_SEQ\n' +
                    '   AND R.RECRUIT_SEQ = :RECRUIT_SEQ',
                    [recruit_seq]);

                if(false == resultEdu.rows){
                    loggerFile.error("来自donBldAppointDao_getAppointRecordByRecruitSeq:预约数据为空");
                }else{
                    resolve(rowsData.toMap(resultEdu.metaData,resultEdu.rows));
                }
            } catch (err) {
                reject(err);
            } finally {
                if (conn) {
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_getAppointRecordByRecruitSeq:"+e);
                    }
                }
            }
        });
    },
    //取消预约
    cancelAppoint : (recruit_seq)=>{
        let oracledb =  require("oracledb");
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getNbsssConn();
                //插入recruit_record表
                    let result_recu_record = await conn.execute("begin\n" +
                        "  :ret := a_recruit.save_dnr_recruit_record(:p_record_seq,\n" +
                        "                                               :p_recruit_seq,\n" +
                        "                                               :p_inform_type_code,\n" +
                        "                                               :p_recruit_status_code,\n" +
                        "                                               :p_record_employee,\n" +
                        "                                               :p_record_date,\n" +
                        "                                               :p_next_recruit_employee,\n" +
                        "                                               :p_next_recruit_date,\n" +
                        "                                               :p_comments);\n" +
                        "end;\n",
                        {
                            ret: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                            p_recruit_seq :recruit_seq,
                            p_recruit_status_code :4,
                            p_comments :'取消微信献血预约',
                            p_record_seq:'',
                            p_inform_type_code:'',
                            p_record_employee:32000,
                            p_record_date:'',
                            p_next_recruit_employee:'',
                            p_next_recruit_date:''
                        });

                    let result_record = result_recu_record.outBinds.ret;
                    conn.commit((err) => {
                        loggerFile.error("来自donBldAppointDao_cancelAppoint:"+err);
                        if (err != null) {
                            loggerFile.error("来自donBldAppointDao_cancelAppoint:"+err);
                            conn.rollback((r_err) => {
                                loggerFile.error("来自donBldAppointDao_cancelAppoint:"+r_err);
                                reject(r_err);
                            })
                            reject(err);
                        }
                    });
                    //返回结果
                    resolve(result_record);

            } catch (err) { // catches errors in getConnection and the query
                loggerFile.error("来自donBldAppointDao_cancelAppoint:"+err);
                conn.rollback((r_err)=>{
                    loggerFile.error("来自donBldAppointDao_cancelAppoint:"+r_err);
                    reject(r_err);
                })
                reject(err);
            } finally {
                if (conn) {   // the conn assignment worked, must release
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_cancelAppoint:"+e);
                    }
                }
            }
        });
    },
    //根据locationSeq加载地址
    loadAddressByLocSeq : (locSeq)=>{
        return new Promise(async function(resolve, reject) {
            let conn;
            try {
                conn = await  connPool.getZibowxConn();
                let resultEdu = await conn.execute('  \n' +
                    ' SELECT  LD.EXACT_ADDRESS\n' +
                    '  FROM WX_LOCATION_DETAIL  LD\n' +
                    ' WHERE LD.LOCATION_SEQ = :SEQ',
                    [locSeq]);
                if(false == resultEdu.rows){
                    loggerFile.error("来自donBldAppointDao_loadAddressByLocSeq:地址数据为空！");
                }else{
                    resolve(rowsData.toMap(resultEdu.metaData,resultEdu.rows));
                }
            } catch (err) {
                loggerFile.error("来自donBldAppointDao_loadAddressByLocSeq:"+err);
                reject(err);
            } finally {
                if (conn) {
                    try {
                        await conn.release();
                    } catch (e) {
                        loggerFile.error("来自donBldAppointDao_loadAddressByLocSeq:"+e);
                    }
                }
            }
        });
    },
    //查询献血身份信息
    loadDonorInfoByPsnseq : (psn_seq)=>{
    var oracledb = require('oracledb');
    return new Promise(async function(resolve, reject) {
        let conn;
        try {
            conn = await  connPool.getNbsssConn();
            let resultEdu = await conn.execute('SELECT P.PSN_SEQ,\n' +
                '                           P.PSN_NAME,\n' +
                '                           (select CERT_TYPE_SEQ from DNR_CERTIFICATE_TYPE WHERE CERTIFICATE_NAME = \'身份证\') CERT_TYPE,\n' +
                '                           (select CERT_TYPE_SEQ from DNR_CERTIFICATE_TYPE WHERE CERTIFICATE_NAME = \'身份证\') IDCARD_SEQ,\n' +
                '                           \'身份证\' as CERTIFICATE_NAME,\n' +
                '                           P.IDCARD\n' +
                '                      FROM DNR_PERSON P\n' +
                '                     WHERE P.PSN_SEQ = :PSN_SEQ',
                [psn_seq]);
            if(false == resultEdu.rows){
                loggerFile.error("来自donBldAppointDao_loadDonorInfoByPsnseq:身份信息为空");
            }else{
                let donor = JSON.parse(rowsData.toMap(resultEdu.metaData,resultEdu.rows));
                if(donor.IDCARD == null){
                    let resultEdu = await conn.execute('SELECT PC.CERT_TYPE_SEQ,\n' +
                        '       PC.CERTIFICATE_NBR,\n' +
                        '       CT.CERTIFICATE_NAME\n' +
                        '  FROM DNR_PSN_CERTIFICATE PC,\n' +
                        '       DNR_CERTIFICATE_TYPE CT  \n' +
                        ' WHERE CT.CERT_TYPE_SEQ = PC.CERT_TYPE_SEQ\n' +
                        '   AND PC.PSN_SEQ = ：PSN_SEQ',
                        [psn_seq]);
                    let cert = JSON.parse(rowsData.toMap(resultEdu.metaData,resultEdu.rows));
                    donor.CERT_TYPE = cert.CERT_TYPE_SEQ;
                    donor.IDCARD = cert.CERTIFICATE_NBR;
                    donor.CERTIFICATE_NAME = cert.CERTIFICATE_NAME;
                }
                resolve(donor);
            }
        } catch (err) {
            loggerFile.error("来自donBldAppointDao_loadDonorInfoByPsnseq:"+err);
            reject(err);
        } finally {
            if (conn) {
                try {
                    await conn.release();
                } catch (e) {
                    loggerFile.error("来自donBldAppointDao_loadDonorInfoByPsnseq:"+e);
                }
            }
        }
    });
},
}

module.exports=donBldAppointDao;
