import React from "react";
import {Toast,Gallery,GalleryDelete,Cell,Uploader,CellsTitle,Button, CellBody, CellFooter, CellHeader, Form, FormCell, Input, Label, Select} from "react-weui";
import 'react-weui/build/packages/react-weui.css';


class DonBldAuth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showToast:false,
            toastTimer: null,
            gallery: false,
            //证件类型
            certificationTypes:[],
            //关系
            relation:[],
            //当前照片
            currImg:'',
            //照片
            dnridcardfront : [],
            dnridcardreverse:[],
            dnrdonorcard:[],
            patidcardfront:[],
            patidcardreverse:[] ,
            bldlist:[],
            chargebill:[],
            certofkindred:[],
            bankcard:[],
            //用血者
            patientname:'',
            patientcerttype:'',
            patientcertNum:'',
            //献血者
            donorname:'',
            donorcerttype:'',
            donorcertNum:'',
            donortell:'',
            donorrelation: '',
            //银行卡
            bankuser:'',
            bankaccount:'',
            bankname:'',
            bankcity:'',
            bankbrunch:''

        }
    }
    componentDidMount(){
        this.state.toastTimer && clearTimeout(this.state.toastTimer);
    //加载证件类型、关系类型
        fetch('/public/bldRepay/loadCertTypeRel',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    responseJson.data.map((item,i)=>{
                        //证件类型
                        if(i == 0) {
                            let certsArray = new Array();
                            item.map((certs, k) => {
                                certsArray.push({
                                    value: JSON.parse(certs).CERT_TYPE_SEQ,
                                    label: JSON.parse(certs).CERTIFICATE_NAME
                                });
                            })
                            this.setState({
                                certificationTypes: certsArray,
                                donorcerttype: certsArray[0].value,
                                patientcerttype: certsArray[0].value
                            });
                        }
                        //关系类型
                        if(i == 1){
                            let relatArray = new Array();
                            item.map((relation,k)=>{
                                relatArray.push({
                                    value:JSON.parse(relation).RELATION_TYPE_CODE,
                                    label:JSON.parse(relation).RELATION_TYPE_DESC
                                });
                            })
                            this.setState({
                                relation :relatArray,
                                donorrelation:relatArray[0].value
                            });
                        }
                    });
                }else{

                }

            }).catch(function(error){
            console.log("加载证件类型、关系失败！"+error)
        })
    }
    renderGallery(){
        if(!this.state.gallery) return false;
        return (
            <Gallery
                src={this.state.gallery.url}
                show
                defaultIndex={this.state.gallery.id}
                onClick={ e=> {
                    //avoid click background item
                    e.preventDefault()
                    e.stopPropagation();
                    this.setState({gallery: false})
                }}
            >

                <GalleryDelete onClick={ (e, id)=> {
                    switch (this.state.currImg) {
                        case 'dnridcardfront':
                            this.setState({
                                dnridcardfront: this.state.dnridcardfront.filter((e,i)=>i != id),
                                gallery: this.state.dnridcardfront.length <= 1 ? true : false
                            })
                            break;
                        case 'dnridcardreverse':
                            this.setState({
                                dnridcardreverse: this.state.dnridcardreverse.filter((e,i)=>i != id),
                                gallery: this.state.dnridcardreverse.length <= 1 ? true : false
                            })
                            break;
                        case 'dnrdonorcard':
                            this.setState({
                                dnrdonorcard: this.state.dnrdonorcard.filter((e,i)=>i != id),
                                gallery: this.state.dnrdonorcard.length <= 1 ? true : false
                            })
                            break;
                        case 'patidcardfront':
                            this.setState({
                                patidcardfront: this.state.patidcardfront.filter((e,i)=>i != id),
                                gallery: this.state.patidcardfront.length <= 1 ? true : false
                            })
                            break;
                        case 'patidcardreverse':
                            this.setState({
                                patidcardreverse: this.state.patidcardreverse.filter((e,i)=>i != id),
                                gallery: this.state.patidcardreverse.length <= 1 ? true : false
                            })
                            break;
                        case 'bldlist':
                            this.setState({
                                bldlist: this.state.bldlist.filter((e,i)=>i != id),
                                gallery: this.state.bldlist.length <= 1 ? true : false
                            })
                            break;
                        case 'chargebill':
                            this.setState({
                                chargebill: this.state.chargebill.filter((e,i)=>i != id),
                                gallery: this.state.chargebill.length <= 1 ? true : false
                            })
                            break;
                        case 'certofkindred':
                            this.setState({
                                certofkindred: this.state.certofkindred.filter((e,i)=>i != id),
                                gallery: this.state.certofkindred.length <= 1 ? true : false
                            })
                            break;
                        case 'bankcard':
                            this.setState({
                                bankcard: this.state.bankcard.filter((e,i)=>i != id),
                                gallery: this.state.bankcard.length <= 1 ? true : false
                            })
                            break;
                    }
                }} />

            </Gallery>
        )
    }
    //提交数据
    submit = ()=> {
        //
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        if (!this.state.patientname || !regName.test(this.state.patientname)) {
            alert('请输入和身份证一致的用血者姓名');
            return
        }
        //用血者证件类型
        if (!this.state.patientcerttype) {
            alert("请选择用血者证件类型");
            return;
        }
        //用血者证件号码
        var regCertNum = /^[0-9a-zA-Z]+$/
        if (!this.state.patientcertNum || !regCertNum.test(this.state.patientcertNum)) {
            alert("请输入正确的用血者证件编号");
            return;
        }
        //献血者姓名
        if (!this.state.donorname || !regName.test(this.state.donorname)) {
            alert("请输入正确的献血者姓名");
            return;
        }
        //用血者证件类型
        if (!this.state.donorcerttype) {
            alert("请选择献血者证件类型");
            return;
        }
        //献血者证件号码
        var regCertNum = /^[0-9a-zA-Z]+$/
        if (!this.state.donorcertNum || !regCertNum.test(this.state.donorcertNum)) {
            alert("请输入正确的献血者证件编号");
            return;
        }
        //献血者手机号码
        var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tellReg.test(this.state.donortell)) {
            alert("请输入正确的手机号码");
            return
        }
        //于用血者关系
        if(!this.state.donorrelation){
            alert("请选择于用血者的关系类型");
            return;
        }
        //开户人
        if (!this.state.bankuser || !regName.test(this.state.bankuser)) {
            alert("请输入开户人姓名");
            return;
        }
        //银行卡账号
        var  regBank = /^\d{15,21}$/;
        if(!this.state.bankaccount || !regBank.test(this.state.bankaccount)){
            alert("请输入正确的银行行卡号");
            return
        }else{
            if(!this.luhnCheck(this.state.bankaccount)){
                alert("请输入正确的银行行卡号");
                return
            }
        }
        //开户行名称
        if(!this.state.bankname ){
            alert("开户行名称不能为空");
            return
        }else if(this.state.bankname.length > 26){
            alert("银行开户行名称超出字数限制");
            return
        }
        //开户行省市
        if(!this.state.bankcity ){
            alert("开户行省市不能为空");
            return
        }else if(this.state.bankcity.length > 26){
            alert("银行开户行省市超出字数限制");
            return
        }
        //开户行支行
        if(!this.state.bankbrunch ){
            alert("开户行支行不能为空");
            return
        }else if(this.state.bankbrunch.length > 26){
            alert("银行开户行支行超出字数限制");
            return
        }

        //封装提交数据
        let postData = {
            //照片
            dnridcardfront : this.state.dnridcardfront,
            dnridcardreverse:this.state.dnridcardreverse,
            dnrdonorcard:this.state.dnrdonorcard,
            patidcardfront:this.state.patidcardfront,
            patidcardreverse:this.state.patidcardreverse,
            bldlist:this.state.bldlist,
            chargebill:this.state.chargebill,
            certofkindred:this.state.certofkindred,
            bankcard:this.state.bankcard,
            //用血者
            patientname:this.state.patientname,
            patientcerttype:this.state.patientcerttype,
            patientcertNum:this.state.patientcertNum,
            //献血者
            donorname:this.state.donorname,
            donorcerttype:this.state.donorcerttype,
            donorcertNum:this.state.donorcertNum,
            donortell:this.state.donortell,
            donorrelation: this.state.donorrelation,
            //银行卡
            bankuser:this.state.bankuser,
            bankaccount:this.state.bankaccount,
            bankname:this.state.bankname,
            bankcity:this.state.bankcity,
            bankbrunch:this.state.bankbrunch
        }
        //提交数据到服务器
        fetch('/public/bldRepay/bldRepayProcess',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(postData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                   this.showToast();
                }else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })
    }
    //银行卡luhn校验
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
    //
    showToast() {
        this.setState({showToast: true});

        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    render() {
        return (
            <div>
                <Toast icon="success-no-circle" show={this.state.showToast}>申请已提交</Toast>
                <span style={{display:'block',width:'20vw',margin:'2vh auto'}}>用血报销</span>
                <CellsTitle>用血者信息</CellsTitle>
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input  type='text' value={this.state.patientname}  onChange={(e)=>{
                               this.setState({patientname:e.target.value})
                            }} placeholder="请输入姓名"/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>证件类型</Label>
                        </CellHeader>
                        <CellBody>
                            <Select  value={this.state.patientcerttype}  onChange={(e)=>{
                                this.setState({patientcerttype:e.target.value})
                            }} data={this.state.certificationTypes} />
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>证件号码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input  value={this.state.patientcertNum} onChange={(e)=>{
                                this.setState({patientcertNum:e.target.value})
                            }} type="tel" placeholder="请输入证件号码"/>
                        </CellBody>
                    </FormCell>
                </Form>
                <CellsTitle>献血者信息</CellsTitle>
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.donorname} onChange={(e)=>{
                                this.setState({donorname:e.target.value})
                            }}   placeholder="请输入姓名"/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>证件类型</Label>
                        </CellHeader>
                        <CellBody>
                            <Select value={this.state.donorcerttype} onChange={(e)=>{
                                this.setState({donorcerttype:e.target.value})
                            }}  data={this.state.certificationTypes} />
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>证件号码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input value={this.state.donorcertNum} onChange={(e)=>{
                                this.setState({donorcertNum:e.target.value})
                            }} type="tel" placeholder="请输入证件号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>电话</Label>
                        </CellHeader>
                        <CellBody>
                            <Input value={this.state.donortell} onChange={(e)=>{
                                this.setState({donortell:e.target.value})
                            }} type="tel" placeholder="电话号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>与患者关系</Label>
                        </CellHeader>
                        <CellBody>
                            <Select value={this.state.donorrelation} onChange={(e)=>{
                                this.setState({donorrelation:e.target.value})
                            }}  data={this.state.relation} />
                        </CellBody>
                    </FormCell>
                </Form>
                <CellsTitle>银行卡信息</CellsTitle>
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>开户人姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.bankuser}  onChange={(e)=>{
                                this.setState({bankuser:e.target.value})
                            }}  placeholder="开户人姓名"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>银行卡账号</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.bankaccount} onChange={(e)=>{
                                this.setState({bankaccount:e.target.value})
                            }}    placeholder="银行卡账号"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>开户行名称</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.bankname}  onChange={(e)=>{
                                this.setState({bankname:e.target.value})
                            }}   placeholder="开户行名称"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>开户行省市</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.bankcity}   onChange={(e)=>{
                                this.setState({bankcity:e.target.value})
                            }}   placeholder="开户行省市"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>开户行支行</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.bankbrunch}    onChange={(e)=>{
                                this.setState({bankbrunch:e.target.value})
                            }} placeholder="开户行支行"/>
                        </CellBody>
                    </FormCell>
                </Form>
                <CellsTitle>献血者凭证照片</CellsTitle>
                { this.renderGallery() }
                <Form>
                    {/*身份证正面照*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="身份证正面照"
                                maxCount={1}
                                files={this.state.dnridcardfront}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.dnridcardfront, {url:file.data,name:'dnridcardfrontimg'}];
                                    this.setState({
                                        dnridcardfront: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'dnridcardfront',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*身份证反面照*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="身份证反面照"
                                maxCount={1}
                                files={this.state.dnridcardreverse}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.dnridcardreverse, {url:file.data,name:'dnridcardreverseimg'}];
                                    this.setState({
                                        dnridcardreverse: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'dnridcardreverse',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*献血证*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="献血证"
                                maxCount={1}
                                files={this.state.dnrdonorcard}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.dnrdonorcard, {url:file.data,name:'dnrdonorcardimg'}];
                                    this.setState({
                                        dnrdonorcard: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'dnrdonorcard',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*亲属关系证明*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="亲属关系证明"
                                maxCount={1}
                                files={this.state.certofkindred}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.certofkindred, {url:file.data,name:'certofkindredimg'}];
                                    this.setState({
                                        certofkindred: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'certofkindred',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*银行卡*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="银行卡"
                                maxCount={1}
                                files={this.state.bankcard}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.bankcard, {url:file.data,name:'bankcardimg'}];
                                    this.setState({
                                        bankcard: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'bankcard',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                </Form>
                <CellsTitle>用血者凭证照片</CellsTitle>
                <Form>
                    {/*身份证反面照*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="身份证正面照"
                                maxCount={1}
                                files={this.state.patidcardfront}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.patidcardfront, {url:file.data,name:'patidcardfrontimg'}];
                                    this.setState({
                                        patidcardfront: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'patidcardfront',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*身份证反面照*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="身份证反面照"
                                maxCount={1}
                                files={this.state.patidcardreverse}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.patidcardreverse, {url:file.data,name:'patidcardreverseimg'}];
                                    this.setState({
                                        patidcardreverse: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'patidcardreverse',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*用血清单*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="用血清单"
                                maxCount={1}
                                files={this.state.bldlist}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.bldlist, {url:file.data,name:'bldlistimg'}];
                                    this.setState({
                                        bldlist: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'bldlist',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                    {/*收费票据*/}
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="医院收费票据"
                                maxCount={1}
                                files={this.state.chargebill}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                    let newFiles = [...this.state.chargebill, {url:file.data,name:'chargebillimg'}];
                                    this.setState({
                                        chargebill: newFiles
                                    });
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file, i)
                                        this.setState({
                                            currImg:'chargebill',
                                            gallery: {
                                                url: file.url,
                                                id: i
                                            }
                                        })
                                    }
                                }
                                lang={{
                                    maxError: maxCount => `最大允许${maxCount}张`
                                }}
                            />
                        </CellBody>
                    </Cell>
                </Form>
                <Button style={{marginTop:'4vh'}} onClick={this.submit} >提交</Button>
            </div>
        )
    }
}

export  {DonBldAuth};