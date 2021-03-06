var router = require('express').Router();
var oracledb = require('oracledb');
var dbconfig = require('../config/dbconfig');
var getAbsTime  = require('../utils/time');
// var connPool = require("../connPool");

// var db=connPool.getZibowxConn();

// console.log(db)

router.get('/locations', (req, res) => {
    db.execute(
        `select  l.location_seq,
        l.location_name,
        t.openingtime,
        t.closedtime,
        t.exact_address,    
        tmp.available,
        t.img_uri
    from WX_LOCATION_DETAIL t, WX_DNR_PHLE_LOCATION l,
    (select t.location_id,sum(t.available) as  available
        from WX_DNR_LOCATION_RESERVATION t
        group by t.location_id) tmp
    where t.location_seq = l.location_seq
      and t.location_seq = tmp.location_id`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});

router.get('/locationslist', (req, res) => {
    db.execute(
        `select  l.location_seq,
            l.location_name,
            t.openingtime,
            t.closedtime,
            t.exact_address
        from WX_LOCATION_DETAIL t, WX_DNR_PHLE_LOCATION l
        where t.location_seq = l.location_seq`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});


router.get('/location', (req, res) => {
    const location_id = req.query.location_id;
    db.execute(
        `select  l.location_seq,
            l.location_name,
            t.openingtime,
            t.closedtime,
            t.exact_address,
            t.lat,
            t.lng
        from WX_LOCATION_DETAIL t, WX_DNR_PHLE_LOCATION l
        where t.location_seq = l.location_seq
            and l.location_seq = :id`,
        [location_id],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.get('/profession', (req, res) => {
    db.execute(
        `select t.profession_seq,
         t.profession_name
         from DNR_PROFESSION t
         where t.active = 1`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});

router.get('/education', (req, res) => {
    db.execute(
        `select t.education_seq,
         t.education_name 
         from DNR_EDUCATION t
         where t.active = 1`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});

router.get('/nation', (req, res) => {
    db.execute(
        `select t.nation_seq,
         t.nation_name 
         from DNR_NATION t`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});

router.get('/abogroup', (req, res) => {
    db.execute(
        `select t.id_abo,
        t.desc_abo 
        from WX_DNR_ABO t`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});

router.get('/reaction_type', (req, res) => {
    db.execute(
        `select t.type_seq,
        t.type_desc
        from NBSSS.DNR_PHLE_REACTION_TYPE@dl_nbsss t
        where t.active = 1`,
        (err,result) => {
            res.send(result.rows)
        }
    )
});

router.get('/relationship', (req, res) => {
    db.execute(
        `select t.relation_type_code,
            t.relation_type_desc 
        from NBSSS.DNR_RELATION_TYPE@dl_nbsss t
        where t.active = 1`,
        (err,result) => {
            res.send(result.rows);
        }
    )
});

router.post('/add_apply', (req, res) => {
     const data = req.body;
     let userid = req.session.user.openid
     db.execute(`BEGIN 
                   insert into WX_VOLUNTEER_APPLY(NAME,idcard,phone,email,company,profession,education,nation,abogroup,isdonation,address,ispermanentresidence,residence,profileimg,user_id,create_date,form_state)
                   values(:NAME,:idcard,:phone,:email,:company,:profession,:education,:nation,:abogroup,:isdonation,:address,:ispermanentresidence,:residence,:profileimg,:user_id,sysdate,:form_state);
                   update wx_user t set t.volunte_status = 1 where t.openid = :wx_user_id;
                 END;`,
                [
                    data.name,
                    data.idcard,
                    data.phone,
                    data.email,
                    data.company,
                    data.profession,
                    data.education,
                    data.nation,
                    data.abogroup,
                    data.isdonation.toString(),
                    data.address,
                    data.ispermanentresident.toString(),
                    data.residence,
                    data.url,
                    userid,
                    1, //默认表单状态
                    userid
                ],
                { autoCommit: true}, 
                (err,result) =>{
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
     data.msg = '提交成功(服务端返回)';
     res.json(data);
 });

router.get('/query_apply', (req, res) => {
    let userid = req.session.user.openid;
    db.execute(
        `select  t.id,
        t.name,
        t.idcard,
        t.phone,
        t.email,
        t.company,
        p.profession_name,
        e.education_name,
        n.nation_name,
        a.desc_abo,
        decode(t.isdonation,'true','是','false','否',t.isdonation) as isdonation,
        t.address,
        decode(t.ispermanentresidence,'true','是','false','否',t.ispermanentresidence) as ispermanentresidence,
        t.residence,
        t.user_id,
        t.create_date,
        s.state_desc
        from (select * from WX_VOLUNTEER_APPLY where user_id = :user_id) t,
        DNR_PROFESSION p,
        DNR_EDUCATION e,
        DNR_NATION n,
        WX_DNR_ABO a,
        wx_volunteer_apply_state s
        where t.profession = p.profession_seq
        and t.education = e.education_seq
        and t.nation = n.nation_seq
        and t.abogroup = a.id_abo
        and t.form_state = s.id
        order by t.create_date desc`,
        [userid],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});



router.get('/query_reimburse',(req,res) => {
    let userid = req.session.user.openid;
    db.execute(
        `select t.id,
            r.relation_type_desc,
            t.account,
            t.bankaccount,
            t.bankname,
            t.branchname,
            t.city,
            t.name,
            t.telphone,
            t.idcard,
            t.psn_seq,
            t.create_date,
            s.state_desc,
            t.state
        from (select * from WX_DNR_REIMBURSE where user_id = :user_id) t,dnr_relation_type r,wx_dnr_reimburse_state s
        where t.relation = r.relation_type_code
          and t.state = s.id
        order by t.create_date desc`,
        [userid],
        (err,result) => {
            res.json(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.get('/query_reserv', (req, res) => {
    // console.log(`i am query reservations, the user's infomation is ${req.session.userid}`);
    let userid = req.session.user.openid;
    db.execute(
        `select t.comms,
        t.create_date,
        p.period_begin||'~'||p.peried_end as period,
        l.location_name,
        t.id,
        s.reserv_desc
        from (select * from WX_VOLUNTEER_RESERV where user_id = :user_id) t,
          WX_DNR_LOCATION_RESERVATION p,
          WX_DNR_PHLE_LOCATION l,
          WX_VOLUNTEER_RESERV_STATE s
        where t.period_id = p.id
          and l.location_seq = p.location_id
          and s.id = t.reserv_state
        order by t.create_date desc`,
        [userid],
        (err,result) => {
            if(result == undefined) { return; }
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.get('/query_isreserv', (req, res) => {
    const reserv_id = req.query.reservid;
    db.execute(`select t.reserv_state from WX_VOLUNTEER_RESERV t where t.id = :reserv_id`,
                [reserv_id],
                (err,result) => {
                    res.send({
                        reserv_state: result.rows[0][0]
                    });
                }
              );
});

router.get('/query_reaction', (req, res) => {
    db.execute(
        `select t.record_seq,
            t.create_date,
            t.contact_seq,
            t.comments
        from DNR_REACTION_RECORD t`,
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.post('/query_isdonation', (req, res) => {
    const data = req.body;
    db.execute(`select count(*) as cnt,t.psn_seq from 
                NBSSS.DNR_PERSON@dl_nbsss t
                where t.psn_name = :name
                and t.idcard = :idcard
                and t.cell_call = :phone
                and t.active = 1
                group by t.psn_seq`,
                [
                    data.name,
                    data.idcard,
                    data.phone
                ],
               (err,result) =>{
                   if(err) {
                       return;
                   } else {
                       if (result.rows.length == 1) {
                            data.cnt = result.rows[0][0];
                            data.psnseq = result.rows[0][1]
                       }
                       res.json(data);
                   }
               });
    
});

router.get('/query_period', (req, res) => {
    db.execute(
        `select t.id,
            t.location_id,
            p.location_name,
            t.period_begin,
            t.peried_end,
            t.available,
            t.create_date,
            l.mail 
        from WX_DNR_LOCATION_RESERVATION t, wx_dnr_phle_location p, wx_user_local l
        where p.location_seq = t.location_id
          and l.id = t.user_id`,
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.get('/query_localusers', (req, res) => {
    db.execute(
        `select t.id,t.mail,t.mobile,decode(t.active, 1, '在用', 0, '已停用')
        from WX_USER_LOCAL t
        order by t.id`,
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.post('/examination/answers', (req, res) => {
    let question_id = req.query.question_id;
    db.execute(
        `select * from WX_VOLUNTEER_QUESTION_ANSWER t where t.question_id = :id`,
        [question_id],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            )
        }
    )
});

router.post('/recall_apply', (req, res) => {
    let form_id = req.query.form_id;
    db.execute(
        `update wx_volunteer_apply t set t.form_state=2 where t.id = :form_id returning rowid into :rid`,
        {
            form_id: form_id,
            rid:   { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true},
        (err,result) => {
            if (err) {
                console.error(err);
                return;
              }
              res.send({
                  rowid: result.outBinds
              });
        }
    );
});

router.post('/recall_reimburse', (req, res) => {
    let form_id = req.query.form_id;
    db.execute(
        `update wx_dnr_reimburse t set t.state=2 where t.id = :form_id returning rowid into :rid`,
        {
            form_id: form_id,
            rid:   { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true},
        (err,result) => {
            if (err) {
                console.error(err);
                return;
              }
              res.send({
                  rowid: result.outBinds
              });
        }
    );
});

// 删
router.post('/queryimg_reimburse', (req, res) => {
    let form_id = req.query.form_id;
    db.execute(
        `select t.idcardimg1url,t.idcardimg2url from WX_DNR_REIMBURSE t where t.id = :form_id`,
        {
            form_id: form_id
        },
        (err,result) => {
        if (err) {
            console.error(err);
            return;
        }
        // 身份证照正面
        var c_idcardimg1url = '';
        var idcardimg1url = result.rows[0][0];
        if (idcardimg1url === null) { console.log("BLOB was NULL"); return; }
        idcardimg1url.setEncoding('utf8');
        idcardimg1url.on(
            'error',
            function(err)
            {
                console.log("lob.on 'error' event");
                console.error(err);
            });
        idcardimg1url.on('data', function (chunk) {
            c_idcardimg1url += chunk; 
            });
        
        // 身份证照反面
        var c_idcardimg1ur2 = '';
        var idcardimg1ur2 = result.rows[0][1];
        if (idcardimg1ur2 === null) { console.log("BLOB was NULL"); return; }
        idcardimg1ur2.on(
            'end',
            function()
            {
                 res.send({
                    idcardimg1url: c_idcardimg1url,
                    idcardimg1ur2: c_idcardimg1ur2
                 });
            });
        idcardimg1ur2.on('data', function (chunk) {
            c_idcardimg1ur2 += chunk;
            });
        }
    );
});

router.post('/recall_reserv', (req, res) => {
    let reserv_id = req.query.reserv_id;
    db.execute(
        `update WX_VOLUNTEER_RESERV t set t.reserv_state = 2 where t.id = :reserv_id returning rowid into :rid`,
        {
            reserv_id: reserv_id,
            rid:   { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true},
        (err,result) => {
            if (err) {
                console.error(err);
                return;
              }
              res.send({
                  rowid: result.outBinds
              });
        }
    );
});

router.get('/questions', (req, res) => {
    db.execute(
        `select * from WX_VOLUNTEER_QUESTION t order by t.id`,
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            )
        }
    )
});

router.get('/location/reservation', (req, res) => {
    const location_id = req.query.location_id;
    db.execute(
        `select * from WX_DNR_LOCATION_RESERVATION t
        where t.location_id = :location_id for update`,
        [location_id],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            )
        }
    )
});

router.get('/selectedperiod', (req, res) => {
    const period_id = req.query.period_id;
    // console.log(period_id);
    db.execute(
        `select * from WX_DNR_LOCATION_RESERVATION t
        where t.id = :period_id`,   
        [period_id],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            )
        }
    )
});

router.post('/volunteer/add_resv', (req, res) => {
    const data = req.body;
    let userid = req.session.user.openid;
    const bindvars = {
        period: data.period,
        user_id: userid,
        comms: data.comms,
    };

    db.execute(`BEGIN volunteer_reserv_proc(:period, :user_id, :comms); END;`,
                bindvars,
                (err,result) =>{
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
    res.json(data);
});

router.get('/reaction', (req, res) => {
    const idcard = req.query.idcard;
    db.execute(
        `select tmp.reg_seq,
        tmp.reg_emp,
        e.employee_name,
        tmp.reg_date,
        tmp.org_seq,
        o.org_name,
        tmp.psn_name,
        tmp.reg_emp 
        from ( select * 
        from NBSSS.DNR_PSN_REG@dl_nbsss 
        where idcard = :idcard
        order by reg_date desc) tmp,NBSSS.ORG_ORGANIZATION@dl_nbsss o,NBSSS.ORG_EMPLOYEE@dl_nbsss e
        where rownum = 1
            and o.org_seq = tmp.org_seq
            and tmp.reg_emp = e.employee_seq`,
        [idcard],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.post('/add_reaction', (req, res) => {
    const data = req.body;
    db.execute(`insert into DNR_REACTION_RECORD(RECORD_SEQ,REG_SEQ,TYPE_SEQ,
                ORG_SEQ,REG_EMP,REG_DATE,CREATE_EMP,
                CREATE_DATE,COMMENTS,STATUS,CONTACT_SEQ)values(:RECORD_SEQ,:REG_SEQ,:TYPE_SEQ,
                :ORG_SEQ,:REG_EMP,:REG_DATE,:CREATE_EMP,
                sysdate,:COMMENTS,:STATUS,:CONTACT_SEQ)`,
               [
                   1,// recode_seq
                   data.reg_seq,
                   data.reaction_type,
                   data.org_seq,
                   data.reg_emp,
                   data.reg_date,
                   2324,// create_emp 微信
                   data.comms,
                   1, // 表单状态 初始值1
                   data.contact
               ],
               { autoCommit: true}, 
               (err,result) =>{
                   if(err) {
                       console.log(err);
                       return;
                   } else {
                       console.log('提交成功: ' + result.rowsAffected + '个记录。');
                   }
               });
    data.msg = '提交成功(服务端返回)';
    res.json(data);
});

router.get('/doninfo', (req, res) => {
    const psnseq = req.query.psnseq;
    db.execute(
        `select t.psn_name,
            t.idcard,
            t.cell_call
        from NBSSS.DNR_PERSON@dl_nbsss t
        where t.psn_seq = :psnseq`,
        [psnseq],
        (err,result) => {
            res.send(
                {
                    rows: result.rows
                }
            );
        }
    )
});

router.post('/add_reimburse', (req, res) => {
    const data = req.body;
    // 让全局变量保存测试的图片
    tmpp = data.idcardImg1url;
    //console.log(`the bloodusername is ${data.bloodusername}`);
    let userid = req.session.user.openid;
    const bindvars = {
        relation: data.relation,
        account: data.account,
        bankaccount: data.bankaccount,
        bankname: data.bankname,
        branchname: data.branchname,
        city: data.city,
        idcardimg1url: data.idcardImg1url, // 身份证正面
        idcardimg2url: data.idcardImg2url, // 身份证背面
        name: data.name,
        telphone: data.telphone,
        idcard: data.idcard,
        psn_seq: data.psnseq,
        user_id: userid,
        handleidcard: data.handleIdcardImg, // 手持身份证
        inpatientInvoice: data.inpatientInvoiceImg, // 标识不可空
        inpatientInvoice2: data.inpatientInvoiceImg2.url, // 标识可以为空
        inpatientInvoice3: data.inpatientInvoiceImg3.url,
        inpatientInvoice4: data.inpatientInvoiceImg4.url,
        blooddetail: data.blooddetailImg,
        blooddetail2: data.blooddetailImg2.url,
        blooddetail3: data.blooddetailImg3.url,
        blooddetail4: data.blooddetailImg4.url,
        bloodusername: data.bloodusername,
        proofofrelation: data.proofofrelationImg.url,
        proofofrelation2: data.proofofrelationImg2.url,
        proofofrelation3: data.proofofrelationImg3.url,
        proofofrelation4: data.proofofrelationImg4.url,
    };

    db.execute(`insert into WX_DNR_REIMBURSE(RELATION,ACCOUNT,BANKACCOUNT,
                    BANKNAME,BRANCHNAME,CITY,IDCARDIMG1URL,IDCARDIMG2URL,
                    NAME,TELPHONE,IDCARD,PSN_SEQ,user_id,create_date,state,handleidcard,
                    inpatientInvoice,
                    inpatientInvoice2,
                    inpatientInvoice3,
                    inpatientInvoice4,
                    blooddetail, blooddetail2, blooddetail3, blooddetail4,
                    bloodusername,
                    proofofrelation,proofofrelation2,proofofrelation3,proofofrelation4)values(:relation,:account,:bankaccount,
                    :bankname,:branchname,:city,:idcardimg1url,:idcardimg2url,
                    :name,:telphone,:idcard,:psn_seq,:user_id,sysdate,1,:handleidcard,
                    :inpatientInvoice,
                    :inpatientInvoice2,
                    :inpatientInvoice3,
                    :inpatientInvoice4,
                    :blooddetail, :blooddetail2, :blooddetail3, :blooddetail4,
                    :bloodusername,
                    :proofofrelation, :proofofrelation2, :proofofrelation3, :proofofrelation4)`,
                bindvars,
                { autoCommit: true},
                (err,result) =>{
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        data.msg = 'success';
                        res.json(data);
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
});

router.post('/add_period', (req, res) => {
    const data = req.body;
    // console.log(data);
    const userid = req.session.passport.user;
    const localstart = getAbsTime(data.start);
    const localend = getAbsTime(data.end);
    db.execute(`insert into WX_DNR_LOCATION_RESERVATION(id, location_id, PERIOD_BEGIN, PERIED_END, available, create_date, USER_ID)
                values(SEQ_VOLUNTEER_period_ID.nextval, :1, :2, :3, :4, sysdate, :5)`,
                [
                    data.collectionpoint,
                    localstart,
                    localend,
                    data.available,
                    userid
                ],
                { autoCommit: true},
                (err,result) =>{
                    if(err) {
                        // console.log(err);
                        return;
                    } else {
                        data.msg = 'success';
                        res.json(data);
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
});

router.post('/edit_period', (req, res) => {
    const data = req.body;
    const localstart = getAbsTime(data.start);
    const localend = getAbsTime(data.end);
    db.execute(`update WX_DNR_LOCATION_RESERVATION t 
                set t.location_id = :1,
                    t.period_begin = :2,
                    t.peried_end = :3,
                    t.available = :4
                where t.id = :5`,
                [
                    data.collectionpoint,
                    localstart,
                    localend,
                    data.available,
                    data.id
                ],
                { autoCommit: true},
                (err,result) =>{
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        data.msg = 'success';
                        res.json(data);
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
});

router.post('/edit_localusrpswd', (req, res) => {
    const data = req.body;
    db.execute(`update wx_user_local t 
                set t.password = :1,
                    t.mobile = :2
                where t.id = :3`,
                [
                    data.password,
                    data.mobile,
                    data.id
                ],
                { autoCommit: true},
                (err,result) =>{
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        data.msg = 'success';
                        res.json(data);
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
});

router.post('/update_reimburse', (req, res) => {
    const data = req.body;
    const bindvars = {
        form_id: data.form_id,
        relation: data.relation,
        account: data.account,
        bankaccount: data.bankaccount,
        bankname: data.bankname,
        branchname: data.branchname,
        city: data.city,
        idcardimg1url: data.idcardImg1url,
        idcardimg2url: data.idcardImg2url,
        handleidcard: data.handleIdcardImg,
        inpatientInvoice: data.inpatientInvoiceImg,
        inpatientInvoice2: data.inpatientInvoiceImg2.url,
        inpatientInvoice3: data.inpatientInvoiceImg3.url,
        inpatientInvoice4: data.inpatientInvoiceImg4.url,
        blooddetail: data.blooddetailImg,
        blooddetail2: data.blooddetailImg2.url,
        blooddetail3: data.blooddetailImg3.url,
        blooddetail4: data.blooddetailImg4.url,
        bloodusername: data.bloodusername,
        proofofrelation: data.proofofrelationImg.url,
        proofofrelation2: data.proofofrelationImg2.url,
        proofofrelation3: data.proofofrelationImg3.url,
        proofofrelation4: data.proofofrelationImg4.url,

    };
    db.execute(`update WX_DNR_REIMBURSE t 
                set t.relation = :relation,
                    t.account = :account,
                    t.bankaccount = :bankaccount,
                    t.bankname = :bankname,
                    t.branchname = :branchname,
                    t.city = :city,
                    t.idcardimg1url = :idcardimg1url,
                    t.idcardimg2url = :idcardimg2url,
                    t.handleidcard = :handleidcard,
                    t.inpatientInvoice = :inpatientInvoice,
                    t.inpatientInvoice2 = :inpatientInvoice2,
                    t.inpatientInvoice3 = :inpatientInvoice3,
                    t.inpatientInvoice4 = :inpatientInvoice4,
                    t.blooddetail = :blooddetail,
                    t.blooddetail2 = :blooddetail2,
                    t.blooddetail3 = :blooddetail3,
                    t.blooddetail4 = :blooddetail4,
                    t.bloodusername = :bloodusername,
                    t.proofofrelation = : proofofrelation,
                    t.proofofrelation2 = : proofofrelation2,
                    t.proofofrelation3 = : proofofrelation3,
                    t.proofofrelation4 = : proofofrelation4
                where t.id = :form_id`,
                bindvars,
                { autoCommit: true},
                (err,result) =>{
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        data.msg = 'success';
                        res.json(data);
                        console.log('提交成功: ' + result.rowsAffected + '个记录。');
                    }
                });
});

router.get('/delete_period', (req, res) => {
    const id = req.query.id;
    db.execute(`delete WX_DNR_LOCATION_RESERVATION where id = :id`,
    [id],
    {autoCommit: true},
    (err,result) => {
        if(err) {
            console.log(err);
            return;
        } else {       
            res.json({message: 'success'});
            console.log('提交成功: ' + result.rowsAffected + '个记录。');
        }
    }
    )
});

router.post('/localusr_disable', (req, res) => {
    const data = req.body;
    db.execute(`update wx_user_local t set t.active = :1 where t.id = :2`,
    [data.active,data.id],
    {autoCommit: true},
    (err,result) => {
        if(err) {
            console.log(err);
            return;
        } else {       
            res.json({message: 'success'});
            console.log('提交成功: ' + result.rowsAffected + '个记录。');
        }
    }
    )
});

router.get('/editreimburse', (req, res) => {
    const form_id = req.query.form_id;
    db.execute(
        `select * from WX_DNR_REIMBURSE t where t.id = :id`,
        [form_id],
        (err,result) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('start read img ...')
            // 注：一张张读，原因：promise里的executor会立刻执行
            var c_idcardimg1url = '';
            var idcardimg1url = result.rows[0][7];
            if (idcardimg1url === null) { console.log("BLOB was NULL"); }
            // idcardimg1url.setEncoding('utf8');
            idcardimg1url.on(
                'end',
                () => {
                    // 身份证照反面
                    var c_idcardimg1ur2 = '';
                    var idcardimg1ur2 = result.rows[0][8];
                    if (idcardimg1ur2 === null) { console.log("BLOB was NULL"); }
                    idcardimg1ur2.on('data', function (chunk) {
                        c_idcardimg1ur2 += chunk;
                        });
                    idcardimg1ur2.on(
                        'end',
                        () => {
                            // 用血者手持身份证
                            var c_handleidcard = '';
                            var handleidcard = result.rows[0][16];
                            if (handleidcard === null) { console.log("BLOB was NULL"); return;}
                            handleidcard.on('data', function (chunk) {
                                c_handleidcard += chunk;
                                });
                            handleidcard.on(
                                'end',
                                () => {
                                    // 住院发票1
                                    var c_inpatientInvoice = '';
                                    var inpatientInvoice = result.rows[0][17];
                                    if (inpatientInvoice === null) { console.log("BLOB was NULL"); return;}
                                    inpatientInvoice.on('data', function (chunk) {
                                        c_inpatientInvoice += chunk;
                                        });
                                    inpatientInvoice.on(
                                        'end',
                                        () => {
                                            // 住院发票2
                                            var c_inpatientInvoice2 = '';
                                            var inpatientInvoice2 = result.rows[0][19];
                                            if (inpatientInvoice2 === null) { console.log("BLOB was NULL"); return;}
                                            inpatientInvoice2.on('data', function (chunk) {
                                                c_inpatientInvoice2 += chunk;
                                                });
                                            inpatientInvoice2.on(
                                                'end',
                                                () => {
                                                    // 住院发票3
                                                    var c_inpatientInvoice3 = '';
                                                    var inpatientInvoice3 = result.rows[0][20];
                                                    if (inpatientInvoice3 === null) { console.log("BLOB was NULL"); return;}
                                                    inpatientInvoice3.on('data', function (chunk) {
                                                        c_inpatientInvoice3 += chunk;
                                                        });
                                                    inpatientInvoice3.on(
                                                        'end',
                                                        () => {
                                                            // 住院发票4
                                                            var c_inpatientInvoice4 = '';
                                                            var inpatientInvoice4 = result.rows[0][21];
                                                            if (inpatientInvoice4 === null) { console.log("BLOB was NULL"); return;}
                                                            inpatientInvoice4.on('data', function (chunk) {
                                                                c_inpatientInvoice4 += chunk;
                                                                });
                                                            inpatientInvoice4.on(
                                                                'end',
                                                                () => {
                                                                    // 用血明细 1
                                                                    var c_blooddetail = '';
                                                                    var blooddetail = result.rows[0][18];
                                                                    if (blooddetail === null) { console.log("BLOB was NULL"); return;}
                                                                    blooddetail.on('data', function (chunk) {
                                                                        c_blooddetail += chunk;
                                                                        });
                                                                    blooddetail.on(
                                                                        'end',
                                                                        () => {
                                                                            // 用血明细 2
                                                                            var c_blooddetail2 = '';
                                                                            var blooddetail2 = result.rows[0][22];
                                                                            if (blooddetail2 === null) { console.log("BLOB was NULL"); return;}
                                                                            blooddetail2.on('data', function (chunk) {
                                                                                c_blooddetail2 += chunk;
                                                                                });
                                                                            blooddetail2.on(
                                                                                'end',
                                                                                () => {
                                                                                    // 用血明细 3
                                                                                    var c_blooddetail3 = '';
                                                                                    var blooddetail3 = result.rows[0][23];
                                                                                    if (blooddetail3 === null) { console.log("BLOB was NULL"); return;}
                                                                                    // 为空，终止读
                                                                                    blooddetail3.on('data', function (chunk) {
                                                                                        c_blooddetail3 += chunk;
                                                                                        });
                                                                                    blooddetail3.on(
                                                                                        'end',
                                                                                        () => {
                                                                                            // 用血明细 4
                                                                                            var c_blooddetail4 = '';
                                                                                            var blooddetail4 = result.rows[0][24];
                                                                                            if (blooddetail4 === null) { console.log("BLOB was NULL"); return;}
                                                                                            blooddetail4.on('data', function (chunk) {
                                                                                                c_blooddetail4 += chunk;
                                                                                                });
                                                                                            blooddetail4.on(
                                                                                                'end',
                                                                                                () => {
                                                                                                    // 献血者与用血关系证明材料1
                                                                                                    var c_proofofrelation = '';
                                                                                                    var proofofrelation = result.rows[0][26];
                                                                                                    if(proofofrelation === null) { console.log("BLOB was NULL"); return; }
                                                                                                    proofofrelation.on('data',function (chunk) {
                                                                                                        c_proofofrelation += chunk;
                                                                                                    });
                                                                                                    proofofrelation.on(
                                                                                                        'end',
                                                                                                        () => {
                                                                                                            // 献血者与用血关系证明材料2
                                                                                                            var c_proofofrelation2 = '';
                                                                                                            var proofofrelation2 = result.rows[0][27];
                                                                                                            if(proofofrelation2 === null) { console.log("BLOB was NULL"); return; }
                                                                                                            proofofrelation2.on('data',function (chunk) {
                                                                                                                c_proofofrelation2 += chunk;
                                                                                                            });
                                                                                                            proofofrelation2.on(
                                                                                                                'end',
                                                                                                                () => {
                                                                                                                    // 献血者与用血关系证明材料3
                                                                                                                    var c_proofofrelation3 = '';
                                                                                                                    var proofofrelation3 = result.rows[0][28];
                                                                                                                    if(proofofrelation3 === null) { console.log("BLOB was NULL"); return; }
                                                                                                                    proofofrelation3.on('data',function (chunk) {
                                                                                                                        c_proofofrelation3 += chunk;
                                                                                                                    });
                                                                                                                    proofofrelation3.on(
                                                                                                                        'end',
                                                                                                                        () => {
                                                                                                                            // 献血者与用血关系证明材料4
                                                                                                                            var c_proofofrelation4 = '';
                                                                                                                            var proofofrelation4 = result.rows[0][29];
                                                                                                                            if(proofofrelation4 === null) { console.log("BLOB was NULL"); return; }
                                                                                                                            proofofrelation4.on('data',function (chunk) {
                                                                                                                                c_proofofrelation4 += chunk;
                                                                                                                            });
                                                                                                                            proofofrelation4.on(
                                                                                                                                'end',
                                                                                                                                () => {
                                                                                                                                    //
                                                                                                                                    console.log('end.. start send')
                                                                                                                                    res.send({
                                                                                                                                        idcardimg1url: c_idcardimg1url,
                                                                                                                                        idcardimg1ur2: c_idcardimg1ur2,
                                                                                                                                        handleidcard: c_handleidcard,
                                                                                                                                        inpatientInvoice: c_inpatientInvoice,
                                                                                                                                        inpatientInvoice2: c_inpatientInvoice2,
                                                                                                                                        inpatientInvoice3: c_inpatientInvoice3,
                                                                                                                                        inpatientInvoice4: c_inpatientInvoice4,
                                                                                                                                        blooddetail: c_blooddetail,
                                                                                                                                        blooddetail2: c_blooddetail2,
                                                                                                                                        blooddetail3: c_blooddetail3,
                                                                                                                                        blooddetail4: c_blooddetail4,
                                                                                                                                        relation: result.rows[0][1],
                                                                                                                                        account: result.rows[0][2],
                                                                                                                                        bankaccount: result.rows[0][3],
                                                                                                                                        bankname: result.rows[0][4],
                                                                                                                                        branchname: result.rows[0][5],
                                                                                                                                        city: result.rows[0][6],
                                                                                                                                        form_state: result.rows[0][15],
                                                                                                                                        // 仅用于显示
                                                                                                                                        name: result.rows[0][9],
                                                                                                                                        idcard: result.rows[0][10],
                                                                                                                                        telphone: result.rows[0][11],
                                                                                                                                        bloodusername: result.rows[0][25],
                                                                                                                                        proofofrelation: c_proofofrelation,
                                                                                                                                        proofofrelation2: c_proofofrelation2,
                                                                                                                                        proofofrelation3: c_proofofrelation3,
                                                                                                                                        proofofrelation4: c_proofofrelation4,
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            );
                                                                                                                        }
                                                                                                                    );

                                                                                                                }
                                                                                                            );

                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                    )
                                                                                }
                                                                            )
                                                                        }
                                                                    )
                                                                }
                                                            )
                                                            
                                                        }
                                                    )
                                                }
                                            )
                                        }
                                    )
                                }
                            )
                        }
                    )
                });
            idcardimg1url.on('data', function (chunk) {
                c_idcardimg1url += chunk;
                });
        }
    )
});

router.get('/userinfo', (req, res) => {

    // user.openid
    // redirect: '/requestWxAuth?comeFromRouter=/home'

    let userid = req.session.user.openid;
    db.execute(
        `select p.psn_name,p.idcard,p.cell_call
            from WX_USER t,NBSSS.DNR_PERSON@dl_nbsss p
            where p.psn_seq = t.psn_seq
            and t.openid = :userid`,
        [userid],
        (err,result) => {
            res.send({
                userinfo: result.rows[0]
            });
        }
    )
});

router.get('/userinfo-h', (req, res) => {
    if(!('user' in req.session)) {
        res.send({
            userinfo: false
        })
        return;
    }
    let userid = req.session.user.openid;
    db.execute(
        `select t.online_name,t.img_path,t.tell,t.volunte_status
            from WX_USER t
            where t.openid = :userid`,
        [userid],
        (err,result) => {
            res.send({
                userinfo: result.rows[0]
            });
        }
    )
});

router.get('/updtusrv', (req, res) => {
    // console.log(`you are here ...`)
    let userid = req.session.user.openid;
    db.execute(
        `BEGIN 
           update wx_user t set t.volunte_status = 2 where t.openid = :userid;
        END;`,
        [userid],
        { autoCommit: true},
        (err,result) => {
            res.send({
                message: 'success'
            });
        }
    )
});

router.post('/user_register', (req, res) => {
    let { mail, password, mobile } = req.body;
    db.execute(
        `insert into WX_USER_LOCAL(ID,PASSWORD,MAIL,mobile,active)
        values(seq_local_user_id.nextval,:password,:mail,:mobile,1)`,
        [password, mail, mobile],
        {autoCommit: true},
        (err,result) => {
            if(err) {
                return;
            }
            res.send({
                message: 'success'
            });
        }
    )
});

router.post('/check_mail',(req, res) => {
    let mail = req.body.mail;
    db.execute(
        `select * from WX_USER_LOCAL t
        where t.mail = :email`,
        [mail],
        (err, result) => {
            if(result.rows.length > 0) {
                res.send(
                    {
                        isvalid: false
                    }
                );
            } else {
                res.send(
                    {
                        isvalid: true
                    }
                );
            }
        }
    )
});

router.get('/userinfo_local', (req, res) => {
    if (!('passport' in req.session)) {
        console.log('session 中无 passport ')
        return res.send({
            message: {
                id: false,
                content: '/login'
            }
        });
    }
    if (!('user' in req.session.passport)) {
        console.log('passport 中无 user')
        return res.send({
            message: {
                id: false,
                content: '/login'
            }
        });
    }
    let userid = req.session.passport.user;
    db.execute(
        `select t.id, t.mail, t.mobile from wx_user_local t where t.id = :id`,
        [userid],
        (err,result) => {
            res.send({
                message: {
                    id: true,
                    content: result.rows[0]
                }
            })
        }
    )


});

oracledb.getConnection(
    dbconfig.wxdb
).then(connecttion => {
    db = connecttion;
}).catch(error => {
    console.log('11111——ERROR:', error)
});


module.exports = router;