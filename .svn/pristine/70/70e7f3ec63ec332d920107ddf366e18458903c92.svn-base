var express = require('express');
var router = express.Router();
var session = require('express-session');
var bldRepayDao = require('./bldRepayDao');

/**
 * 加载z证件类型、献血者于用血者关系
 */
router.get('/loadCertTypeRel',(req,res)=>{
    bldRepayDao.getCertTypeRel().then((result)=>{
        //返回
        let resBody = {
            status:200,
            message:'ok',
            data:result
        }
        res.send(resBody);
        return;
    }).catch((err)=>{
      let resBody = {
          status:10017,
          message:'加载数据失败！'
      }
      res.send(resBody);
      return;
    })
});
/**
 * 献血报销
 * @type {Router|router}
 */
router.post('/bldRepayProcess',(req,res)=>{
    //照片
    var images = {
        dnridcardfront : req.body.dnridcardfront,
        dnridcardreverse : req.body.dnridcardreverse,
        dnrdonorcard : req.body.dnrdonorcard,
        patidcardfront : req.body.patidcardfront,
        patidcardreverse : req.body.patidcardreverse,
        bldlist : req.body.bldlist,
        chargebill : req.body.chargebill,
        certofkindred : req.body.certofkindred,
        bankcard : req.body.bankcard
    }

        //用血者
    var patientname= req.body.patientname;
    var patientcerttype= req.body.patientcerttype;
    var patientcertNum= req.body.patientcertNum;
        //献血者
    var donorname= req.body.donorname;
    var donorcerttype= req.body.donorcerttype;
    var donorcertNum= req.body.donorcertNum;
    var donortell= req.body.donortell;
    var donorrelation= req.body.donorrelation;
        //银行卡
    var bankuser = req.body.bankuser;
    var bankaccount= req.body.bankaccount;
    var bankname= req.body.bankname;
    var bankcity= req.body.bankcity;
    var bankbrunch= req.body.bankbrunch;


    console.log(req.body)
    //图片非空校验
        if(!isEmpty(images)){
            let resBody ={
                status:10018,
                message:'必须上传所有证明照'
            }
            res.send(resBody)
            return
        }

    //图片大小校验
    if(!imgSizeCheck(images)){
        let resBody ={
            status:10018,
            message:'每张图片不能超出1M'
        }
        res.send(resBody)
        return
    }
//其他字段校验
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!patientname || !regName.test(patientname)) {
        let resBody ={
            status:10018,
            message:'请输入和身份证一致的用血者姓名'
        }
        res.send(resBody)
        return
    }
    //用血者证件类型
    if (!patientcerttype) {
        let resBody ={
            status:10018,
            message:'证件类型不能为空'
        }
        res.send(resBody)
        return
    }
    //用血者证件号码
    var regCertNum = /^[0-9a-zA-Z]+$/
    if (!patientcertNum || !regCertNum.test(patientcertNum)) {
        let resBody ={
            status:10018,
            message:'请输入正确的用血者证件号码'
        }
        res.send(resBody)
        return
    }
    //献血者姓名
    if (!donorname || !regName.test(donorname)) {
        let resBody ={
            status:10018,
            message:'请输入正确的献血者姓名'
        }
        res.send(resBody)
        return
    }
    //用血者证件类型
    if (!donorcerttype) {
        let resBody ={
            status:10018,
            message:'请输入正确的献血者证件类型'
        }
        res.send(resBody)
        return
    }
    //献血者证件号码
    var regCertNum = /^[0-9a-zA-Z]+$/
    if (!donorcertNum || !regCertNum.test(donorcertNum)) {
        let resBody ={
            status:10018,
            message:'请输入正确的献血者证件号码'
        }
        res.send(resBody)
        return
    }
    //献血者手机号码
    var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!tellReg.test(donortell)) {
        let resBody ={
            status:10018,
            message:'请输入正确的手机号码'
        }
        res.send(resBody)
        return
    }
    //于用血者关系
    if(!donorrelation){
        let resBody ={
            status:10018,
            message:'与用血者关系类型不能为空'
        }
        res.send(resBody)
        return
    }
    //开户人
    if (!bankuser || !regName.test(bankuser)) {
        let resBody ={
            status:10018,
            message:'请输入开户人姓名'
        }
        res.send(resBody)
        return
    }
    //银行卡账号
    var  regBank = /^\d{15,21}$/;
    if(!bankaccount || !regBank.test(bankaccount)){
        let resBody ={
            status:10018,
            message:'请输入正确的银行行卡号'
        }
        res.send(resBody)
        return

    }else{
        if(!luhnCheck(bankaccount)){
            let resBody ={
                status:10018,
                message:'请输入正确的银行行卡号'
            }
            res.send(resBody)
            return

        }
    }
    //开户行名称
    if(!bankname ){
        let resBody ={
            status:10018,
            message:'开户行名称不能为空'
        }
        res.send(resBody)
        return
    }else if(bankname.length > 26){
        let resBody ={
            status:10018,
            message:'银行开户行名称超出字数限制'
        }
        res.send(resBody)
        return
    }
    //开户行省市
    if(!bankcity ){
        let resBody ={
            status:10018,
            message:'开户行省市不能为空'
        }
        res.send(resBody)
        return
    }else if(bankcity.length > 26){
        let resBody ={
            status:10018,
            message:'银行开户行省市超出字数限制'
        }
        res.send(resBody)
        return
    }
    //开户行支行
    if(!bankbrunch ){
        let resBody ={
            status:10018,
            message:'开户行支行不能为空'
        }
        res.send(resBody)
        return
    }else if(bankbrunch.length > 26){
        let resBody ={
            status:10018,
            message:'银行开户行支行超出字数限制'
        }
        res.send(resBody)
        return
    }

    //将数据插入数据库得到反馈

    let resBody = {
        status:200,
        message:'ok'
    }
    res.send(resBody);
    return;
});

//图片大小校验
imgSizeCheck = (img)=>{
    var flag = true;
    Object.keys(img).forEach(function(key){
        img[key].map((item,i)=>{
            if(showSize(item.url)> 1024 *1024 || showSize(item.url) == 0){
                flag = false;
            }
        })
    });
    return flag;
}
//获取base64图片大小
 showSize = (base64url) =>{
    //获取base64图片大小
    var str = base64url.replace('data:image/png;base64,', '');
    var equalIndex = str.indexOf('=');
    if(str.indexOf('=')>0) {
        str=str.substring(0, equalIndex);
    }
    var strLength=str.length;
    var fileLength=parseInt(strLength-(strLength/8)*2);
   return fileLength;
}
//bankno位银行卡号
luhnCheck = (bankno)=> {
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhn进行比较）

    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9

    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
                arrJiShu.push(parseInt(newArr[j])*2);
            else
                arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
            arrOuShu.push(newArr[j]);
    }

    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }

    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }

    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }

    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

    //计算luhn值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;
    var luhn= 10-k;

    if(lastNum==luhn){
        return true;
    }
    else{
        alert("银行卡号必须符合luhn校验");
        return false;
    }
}
//检查上传图片是否有空
 isEmpty = (images) => {
        var flag = true;
        //图片大小校验
          Object.keys(images).forEach(function(key){
            if(images[key] == ''){
                flag = false;
            }
        });
        return flag;
}

module.exports = router;