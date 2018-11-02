import React,{ Component }  from 'react';
import ReactDOM from 'react-dom';
import {
    Preview,
    PreviewHeader,
    PreviewItem,
    PreviewBody,
    PreviewFooter,
    PreviewButton,
    Form,
    FormCell,
    CellHeader,
    Label,
    CellBody,
    Input,
    Select,
    Button,
    ActionSheet,
    Dialog
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';
import './donLocation.css';
import {commonModule} from "../publicModule/publicModule"
import config from "../clientConfig";
import { NavBar, Icon } from 'antd-mobile';

/**
 * 献血征询
 */
class DonBldConsult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //献血类型
            donTypes:[
                {
                    value: 0,
                    label: '全血',
                },
                {
                    value: 1,
                    label: '机采'
                }
            ],
            //姓名
            name:'',
            idcard:'',
            donType:'',
            appointDate:'',
            phleLoc:'',
            phleLocSeq:'',
            certtype:'',
            certificationTypes:'',
            //身份证seq
            idcardSeq :'',
            showAndroid1: false,
            dialogMes:'',
            style1: {
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
        }
        this.onNameChange =this.onNameChange.bind(this);
        this.onIdcardChange = this.onIdcardChange.bind(this);
        this.submit = this.submit.bind(this);
        this.appointDataChange = this.appointDataChange.bind(this);
    }
    componentDidMount() {
        //获取参数
        const paramsString = this.props.location.search.substring(1);
        const searchParams = new URLSearchParams(paramsString);

        var donLocName = searchParams.get('donLocName');
        var donLocSeq = searchParams.get('donLocSeq');
        var donTypeId = searchParams.get('donTypeId');
        var donTypeDesc = searchParams.get('donTypeDesc');

        console.log(donLocName+'===='+donLocSeq+'=='+donTypeId+'=='+donTypeDesc)

        //设置献血类型默认值
        if (donTypeId == 0) {
            this.setState({
                donTypes: [{
                    value: 0,
                    label: '全血',
                }],
                donType: 0
            });
        } else if (donTypeId == 1) {
            this.setState({
                donTypes: [{
                    value: 1,
                    label: '成分血',
                }],
                donType: 1
            });
        } else {
            this.setState({
                donTypes: [
                    {
                        value: 0,
                        label: '全血',
                    },
                    {
                        value: 1,
                        label: '机采'
                    }
                ],
                donType: 0
            });
        }

        //设置预约地点
        this.setState({
            phleLoc:donLocName,
            phleLocSeq:donLocSeq
        });
        //判断献血者是否进行了献血者认证
        fetch('/private/donor/isDonorAuth',
            {credentials: "include",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status == 10024){
                    window.location.href = '/requestWxAuth?comeFromRouter=/donBldAppoint&donLocSeq='+donLocSeq+'&donLocName='+donLocName+'&donTypeId='+donTypeId+'&donTypeDesc='+donTypeDesc;
                }else if(responseJson.status == 10025){
                    //加载证件类型
                    fetch('/public/donAppoint/loadCertTypes',
                        {credentials: "include",
                            headers:{'Content-Type': 'application/json'},
                        })
                        .then((result) => result.json())
                        .then((resultJson) => {
                            if(resultJson.status === 200){

                                console.log(resultJson.data)
                                //设置证件类型
                                let certsArray = new Array();
                                resultJson.data[0].map((certs, k) => {
                                    //设置默认证件类型为身份证
                                    if( JSON.parse(certs).CERTIFICATE_NAME == '身份证'){
                                        this.setState({
                                            certtype: JSON.parse(certs).CERT_TYPE_SEQ,
                                            idcardSeq:JSON.parse(certs).CERT_TYPE_SEQ
                                        });
                                    }
                                    certsArray.push({
                                        value: JSON.parse(certs).CERT_TYPE_SEQ,
                                        label: JSON.parse(certs).CERTIFICATE_NAME
                                    });
                                })
                                this.setState({
                                    certificationTypes: certsArray
                                });
                            }else{
                                alert(resultJson.message);
                            }
                        }).catch(function(error){
                        console.log(error)
                    })
                }else if(responseJson.status = 200){
                    //获取献血者身份信息
                    fetch('/public/donAppoint/loadDonorInfo',
                        {credentials: "include",
                            headers:{'Content-Type': 'application/json'},
                        })
                        .then((ret) => ret.json())
                        .then((retJson) => {
                            if(retJson.status === 200){
                                console.log(JSON.stringify(retJson.data))
                                //加载用户信息
                                this.setState({
                                    certtype:retJson.data.CERT_TYPE,
                                    name:retJson.data.PSN_NAME,
                                    idcard:retJson.data.IDCARD,
                                    idcardSeq : retJson.data.IDCARD_SEQ,
                                    certificationTypes : [{
                                        value: retJson.data.CERT_TYPE,
                                        label: retJson.data.CERTIFICATE_NAME
                                    }]
                                })

                            }else{
                                alert(resultJson.message);
                            }
                        }).catch(function(error){
                        console.log(error)
                    })
                }
            }).catch(function(error){
            console.log(error)
        })

    }

    hideDialog() {
        this.setState({
            showAndroid1: false,
        });
    }

    //输入姓名时
    onNameChange = (e)=>{
        this.setState({
            name:e.target.value
        });
    }
    //输入身份证号时
    onIdcardChange = (e)=>{
        this.setState({
            idcard:e.target.value
        });
    }
    //献血类型
    donTypeClick = (e)=>{
        this.setState({
            donType:e.target.value
        });
    }
    //预约日期
    appointDataChange = (e)=>{

        if(!e.target.value){
            this.setState({
                showAndroid1: true,
                dialogMes:'预约日期不能为空',
            });
            return
        }else{
            var str = e.target.value.replace(/-/g, '/'); // "2010/08/01";
            // 创建日期对象
            var date = new Date(str);
            if(date < new Date()){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'预约日期必须在今天以后',
                });
                return
            }
            this.setState({
                appointDate:e.target.value
            });
        }
    }
    //提交表单
    submit = () =>{
        //对表单进行验证
        var regName =/^[\u4e00-\u9fa5]{2,4}$/;
        if(!this.state.name || !regName.test(this.state.name)){
            this.setState({
                showAndroid1: true,
                dialogMes:'输入的姓名需和证件上的姓名一致',
            });
            return
        }

        if(this.state.certtype == this.state.idcardSeq){
            if(!this.state.idcard || !commonModule.IdentityCodeValid(this.state.idcard)){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'身份证号输入错误',
                });
                return
            }
        }else{
            if(!this.state.idcard ){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'证件号码不能为空',
                });
                return
            }
        }

       if(!this.state.appointDate){
           this.setState({
               showAndroid1: true,
               dialogMes:'请选择预约日期',
           });
           return
       }else{
           var str = this.state.appointDate.replace(/-/g, '/'); // "2010/08/01";
           // 创建日期对象
           var date = new Date(str);
           if(date < new Date()){
               this.setState({
                   showAndroid1: true,
                   dialogMes:'预约日期必须在今天以后',
               });
               return
           }
       }
        //封装参数
        var data = {
            //姓名
            name:this.state.name,
            idcard:this.state.idcard,
            donType:this.state.donType,
            appointDate:this.state.appointDate,
            phleLoc:this.state.phleLoc,
            phleLocSeq:this.state.phleLocSeq,
            idcardSeq :this.state.idcardSeq,
            certtype : this.state.certtype
        }
        //提交数据到服务器
        fetch('/public/donAppoint/donBldConsult',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    //跳转到详细信息
                   if(this.state.idcardSeq == this.state.certtype){
                       window.location.href = '/donBldDetailInfo?idcard='+this.state.idcard+"&don_type="+this.state.donType;
                   }else {
                       window.location.href = '/donBldDetailInfo?don_type='+this.state.donType;
                   }
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    }



    render() {
        return (
            <div>
                <Dialog type="android" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showAndroid1}>
                    {this.state.dialogMes}
                </Dialog>
                <div style={{display:'block',margin:'4vh auto', textAlign: 'center'}}><h1 style={{color:'green',display:'inline'}} >献血征询</h1></div>
                <Form>
                <FormCell>
                         <CellHeader>
                            <Label>姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.name} onChange={this.onNameChange}   placeholder="请输入姓名"/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>证件类型</Label>
                        </CellHeader>
                        <CellBody>
                            <Select  value={this.state.certtype}  onChange={(e)=>{
                                this.setState({certtype:e.target.value})
                            }} data={this.state.certificationTypes} />
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>证件号码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input  value={this.state.idcard} onChange={this.onIdcardChange} type="tel" placeholder="请输入证件号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>献血类型</Label>
                        </CellHeader>
                        <CellBody>
                            <Select   value={this.state.donType} onChange={this.donTypeClick} data={this.state.donTypes} />
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>献血地点</Label>
                        </CellHeader>
                        <CellBody>
                            <Input disabled value={this.state.phleLoc}  />
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>预约日期</Label>
                        </CellHeader>
                        <CellBody>
                            <Input  value={this.state.appointDate} onChange={this.appointDataChange} type="date"  placeholder=""/>
                        </CellBody>
                    </FormCell>
                </Form>
                <Button style={{marginTop:'4vh'}} onClick={this.submit} >下一步</Button>
                <span style={{marginTop:'4vh',marginLeft:'2vw',fontSize:'14px',color:'green'}}>*温馨提示:某些地点只能预约全血</span><br/>
            </div>
        )
    }
}
/**
 * 详细资料
 */
class DonBldDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sexArray:[
                {
                  value:'',
                  label:'--选择--'
                },
                {
                    value:0,
                    label:'男'
                },
                {
                    value:1,
                    label:'女'
                }
            ],
            educationArray:[
                {
                    value:'',
                    label:'--选择--'
                }
            ],
            nationArray:[
                {
                    value:'',
                    label:'--选择--'
                }
            ],
            professionArray:[
                {
                    value:'',
                    label:'--选择--'
                }
            ],
            AboGroups :[
                {
                    value:'',
                    label:'--选择--'
                },
                {
                    value:'A',
                    label:'A'
                },
                {
                    value:'B',
                    label:'B'
                },{
                    value:'O',
                    label:'O'
                },
                {
                    value:'AB',
                    label:'AB'
                }
            ],
            aboGroup:'',
            tell:'',
            sex:'',
            education:'',
            nation:'',
            profession:'',
            unit:'',
            address:'',
            birthday:'',
            HintMes:'',
            donType : '',
            showAndroid1: false,
            dialogMes:'',
            style1: {
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
        }
    }
    componentDidMount(){
        //获取参数
        const paramsString = this.props.location.search.substring(1);
        const searchParams = new URLSearchParams(paramsString);
        var id_card = searchParams.get('idcard');
        var donType = searchParams.get('don_type');

        this.setState({
           donType:donType
        });

        if(id_card != null){
            //解析得到生日
            let birth = commonModule.GetBirthday(id_card);
            //解析得到性别
            let gender = commonModule.Getsex(id_card);
            //设置
            this.setState({
                birthday : birth,
                sex : gender,
            });
            if(gender == 0){
                this.setState({
                    sexArray :   [
                        {
                            value:gender,
                            label:'女'
                        }]
                });
            }else {
                this.setState({
                    sexArray :   [
                        {
                            value:gender,
                            label:'男'
                        }]
                });
            }
        }

        //加载学历’民族、职业信息
        fetch('/public/donAppoint/loadEduNationProfess',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    responseJson.data.map((item,i)=>{
                        //学历
                        if(i == 0){
                            let eduArray = new Array(this.state.educationArray);
                               item.map((eduArr,j)=>{
                                   eduArray.push({
                                       value:JSON.parse(eduArr).EDUCATION_SEQ,
                                       label:JSON.parse(eduArr).EDUCATION_NAME
                                   });
                               })
                            this.setState({
                                educationArray :eduArray
                            });
                        }
                        //民族
                        if(i == 1){
                            let nationArray = new Array(this.state.nationArray);
                            item.map((nation,k)=>{
                                nationArray.push({
                                    value:JSON.parse(nation).NATION_SEQ,
                                    label:JSON.parse(nation).NATION_NAME
                                });
                            })
                            this.setState({
                                nationArray :nationArray
                            });
                        }
                        //职业
                        if(i == 2){
                            let professArray = new Array(this.state.professionArray);
                            item.map((profess,k)=>{
                                professArray.push({
                                    value:JSON.parse(profess).PROFESSION_SEQ,
                                    label:JSON.parse(profess).PROFESSION_NAME
                                });
                            })
                            this.setState({
                                professionArray :professArray
                            });
                        }

                    });
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log("加载学历、职业、民族失败！"+error)
        })
    }

    onTellChange = (e)=>{
        this.setState({
            tell:e.target.value
        });
    }
    onSexChange = (e)=>{
        this.setState({
            sex:e.target.value
        });
    }
    birthdayChange = (e)=>{
        var str = e.target.value.replace(/-/g, '/'); // "2010/08/01";
        // 创建日期对象
        var date = new Date(str);
        if(date > new Date()){
            this.setState({
                showAndroid1: true,
                dialogMes:'生日必须小于今天',
            });
            return
        }
        this.setState({
            birthday:e.target.value
        });
    }
    donEducationChange=(e)=>{
        this.setState({
            education:e.target.value
        });
    }
    donNationChange =(e)=>{
        this.setState({
            nation:e.target.value
        });
    }
    professionChange=(e)=>{
        this.setState({
            profession:e.target.value
        });
    }
    onUnitChange=(e)=>{
        this.setState({
            unit:e.target.value
        });
    }
    onAddressChange = (e)=>{
        this.setState({
            address:e.target.value
        });
    }
    //提交表单
    submit = () =>{
        //对表单进行验证
        var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tellReg.test(this.state.tell)) {
            this.setState({
                showAndroid1: true,
                dialogMes:'输入的手机号码不正确',
            });
            return
        }
        //
        if (this.state.unit.length >26 ) {
            this.setState({
                showAndroid1: true,
                dialogMes:'工作单位超过字数限制',
            });
            return
        }
        if (this.state.address.length >26 ) {
            this.setState({
                showAndroid1: true,
                dialogMes:'地址超过字数限制',
            });
            return
        }
        //如果预约机采必须选择血型
        if (this.state.donType == 1 ) {
            if(!this.state.aboGroup){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'预约机采必须选择血型哦',
                });
                return
            }
        }

            var str = this.state.birthday.replace(/-/g, '/'); // "2010/08/01";
            // 创建日期对象
            var date = new Date(str);
            if(date > new Date()){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'生日必须小于今天',
                });
                return
            }

        //封装参数
        var data = {
            tell:this.state.tell,
            sex:this.state.sex,
            education:this.state.education,
            nation:this.state.nation,
            profession:this.state.profession,
            unit:this.state.unit,
            address:this.state.address,
            birthday:this.state.birthday,
            aboGroup: this.state.aboGroup
        }
        //提交数据到服务器
        fetch('/public/donAppoint/donBldDetail',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status == 200){
                    window.location.href = "/appointSucess";
                }else if(responseJson.status == 10014){
                    window.location.href = "/locationNavigation";
                } else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    }

    hideDialog() {
        this.setState({
            showAndroid1: false,
        });
    }


    render() {
        return (
            <div>
                <Dialog type="android" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showAndroid1}>
                    {this.state.dialogMes}
                </Dialog>
                <div style={{display:'block',margin:'4vh auto', textAlign: 'center'}}><h1 style={{color:'green',display:'inline'}} >详细信息</h1></div>
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>手机号码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input  value={this.state.tell} onChange={this.onTellChange}  placeholder="请输入手机号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>性别</Label>
                        </CellHeader>
                        <CellBody>
                            <Select   value={this.state.sex} onChange={this.onSexChange} data={this.state.sexArray}/>
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>血型</Label>
                        </CellHeader>
                        <CellBody>
                            <Select   value={this.state.aboGrop} onChange={(e)=>{
                                this.setState({aboGrop:e.target.value})
                            }} data={this.state.AboGroups}/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>生日</Label>
                        </CellHeader>
                        <CellBody>
                            <Input  value={this.state.birthday} onChange={this.birthdayChange} type="date" />
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>学历</Label>
                        </CellHeader>
                        <CellBody>
                            <Select   value={this.state.education} onChange={this.donEducationChange} data={this.state.educationArray} />
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>民族</Label>
                        </CellHeader>
                        <CellBody>
                            <Select   value={this.state.nation} onChange={this.donNationChange} data={this.state.nationArray} />
                        </CellBody>
                    </FormCell>
                    <FormCell select selectPos="after">
                        <CellHeader>
                            <Label>职业</Label>
                        </CellHeader>
                        <CellBody>
                            <Select   value={this.state.profession} onChange={this.professionChange} data={this.state.professionArray} />
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>工作单位</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type='text' value={this.state.unit} onChange={this.onUnitChange}  placeholder="工作单位"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>住址</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type='' value={this.state.address} onChange={this.onAddressChange}  placeholder="住址"/>
                        </CellBody>
                    </FormCell>
                </Form>
                <Button style={{marginTop:'4vh'}} onClick={this.submit} >下一步</Button>
            </div>
        )
    }
}
/**
 * 预约成功结果
 */
class AppointSucess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointStatusDesc:'',
            recruitSeq:'',
            locationSeq:'',
            locationName:'',
            createDate:'',
            recruit_status_code :'',
            appointRecords : [],
            currLocSeq : '',
            currRecruitSeq :'',
            EXACT_ADDRESS : '',
            menus: [{
                label: '百度地图',
                onClick: ()=> {
                    //调用百度uri接口
                    //window.location.href = 'http://api.map.baidu.com/geocoder?location='+this.state.lat+','+this.state.lng+'&coord_type=gcj02&output=html&src=webapp.kmsp.zibowx';
                    window.location.href = 'http://api.map.baidu.com/geocoder?address='+this.state.EXACT_ADDRESS+'&output=html&src=webapp.baidu.openAPIdemo'
                }
            }, {
                label: '腾讯地图',
                onClick: ()=> {
                    //调用腾讯uri接口
                    //window.location.href ='https://apis.map.qq.com/uri/v1/marker?marker=coord:'+this.state.lat+','+this.state.lng+'&referer=zibowx'
                    window.location.href='https://apis.map.qq.com/uri/v1/search?keyword='+this.state.EXACT_ADDRESS+'&region='+config.map_seach_range+'&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
                }
            },
                {
                    label: '高德地图',
                    onClick: ()=> {
                        //吊起高德地图URL:
                        // window.location.href = 'https://uri.amap.com/marker?position='+this.state.lng+','+this.state.lat;
                        window.location.href = "http://uri.amap.com/search?keyword="+this.state.EXACT_ADDRESS+"&city="+config.map_seach_range+"&view=map&src=mypage&coordinate=gaode&callnative=0"

                    }
                }],
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            showAndroid1: false,
            dialogMes:'',
            style1: {
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
        }
    }
    componentDidMount(){
        fetch('/public/donAppoint/getAppointRecd',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                console.log(responseJson.data);
                let records = new Array();
                    responseJson.data.map((item,i)=>{
                        item = JSON.parse(item);
                        records = records.concat(item);

                    });
                    this.setState({
                        appointRecords :records
                    });
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log("加载预约记录失败"+error)
        })
    }


    //map选项隐藏
    hide(){
        this.setState({
            auto_show: false,
            ios_show: false,
        });
    }

    //取消预约按钮被点击
    cancelAppoint = (recSeq)=>{
        alert(this.state.currRecruitSeq);
        fetch('/public/donAppoint/cancelAppoint',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({recruitSeq:recSeq})
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    window.location.href = "/myAppointRecord";
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    };
    //预约成功导航
    locaNvgation = (locSeq)=>{
        fetch('/public/donAppoint/loadNvgationAddress?locationSeq='+locSeq,
            {credentials: "include",
                headers:{'Content-Type': 'application/json'}
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status == 200) {
                    this.setState({
                        ios_show: true,
                        EXACT_ADDRESS: responseJson.data.EXACT_ADDRESS
                    })
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    }


    hideDialog() {
        this.setState({
            showAndroid1: false,
        });
    }

    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    leftContent="返回"
                    onLeftClick={() => {window.location.href= "/home"}}
                    style={{borderBottom:'1px solid #108ee9'}}
                >我的预约</NavBar>
                {this.state.appointRecords.map((item,i)=>{
                    return  <Preview  style={{backgroundColor:'#f7f7f7',marginTop:'4vh'}}>
                                <PreviewHeader>
                                    <PreviewItem label="状态" style={{fontSize:'0.8em'}} value={item.RECRUIT_STATUS_DESC} />
                                </PreviewHeader>
                                <PreviewBody>
                                    <PreviewItem  style={{display : 'none'}} label="recruit_seq" value={item.RECRUIT_SEQ} />
                                    <PreviewItem  style={{display : 'none'}} label="location_seq" value={item.LOCATION_SEQ} />
                                    <PreviewItem  label="地点" value={item.LOCATION_NAME} />
                                    <PreviewItem label="预约时间" value={item.VALID_FROM} />
                                    <PreviewItem label="创建时间" value={item.CREATE_DATE} />

                                </PreviewBody>
                            {item.RECRUIT_STATUS_CODE == 1 ?  <PreviewFooter><PreviewButton style={{color:'green'}} onClick={()=>{this.locaNvgation(item.LOCATION_SEQ)}}  >去献血</PreviewButton><PreviewButton primary style={{color:'green'}} onClick={()=>{this.cancelAppoint(item.RECRUIT_SEQ)}} >取消预约</PreviewButton></PreviewFooter>  : ''}
                    </Preview>
                })}
                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.ios_show}
                    type="ios"
                    onRequestClose={e=>this.setState({ios_show: false})}
                />
                <Dialog type="android" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showAndroid1}>
                    {this.state.dialogMes}
                </Dialog>
            </div>
        )
    }
}
/**
 * 我的预约
 */
class MyAppointRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointStatusDesc:'',
            recruitSeq:'',
            locationSeq:'',
            locationName:'',
            createDate:'',
            recruit_status_code :'',
            appointRecords : [],
            EXACT_ADDRESS : '',
            menus: [{
                label: '百度地图',
                onClick: ()=> {
                    //调用百度uri接口
                    //window.location.href = 'http://api.map.baidu.com/geocoder?location='+this.state.lat+','+this.state.lng+'&coord_type=gcj02&output=html&src=webapp.kmsp.zibowx';
                    window.location.href = 'http://api.map.baidu.com/geocoder?address='+this.state.EXACT_ADDRESS+'&output=html&src=webapp.baidu.openAPIdemo'
                }
            }, {
                label: '腾讯地图',
                onClick: ()=> {
                    //调用腾讯uri接口
                    //window.location.href ='https://apis.map.qq.com/uri/v1/marker?marker=coord:'+this.state.lat+','+this.state.lng+'&referer=zibowx'
                    window.location.href='https://apis.map.qq.com/uri/v1/search?keyword='+this.state.EXACT_ADDRESS+'&region='+config.map_seach_range+'&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
                }
            },
                {
                    label: '高德地图',
                    onClick: ()=> {
                        //吊起高德地图URL:
                        // window.location.href = 'https://uri.amap.com/marker?position='+this.state.lng+','+this.state.lat;
                        window.location.href = "http://uri.amap.com/search?keyword="+this.state.EXACT_ADDRESS+"&city="+config.map_seach_range+"&view=map&src=mypage&coordinate=gaode&callnative=0"

                    }
                }],
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            showAndroid1: false,
            dialogMes:'',
            style1: {
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
        }
    }

    //map选项隐藏
    hide(){
        this.setState({
            auto_show: false,
            ios_show: false,
        });
    }

    hideDialog() {
        this.setState({
            showAndroid1: false,
        });
    }

    componentDidMount(){
        fetch('/public/donAppoint/loadMyAppointRecord',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data);
                    let records = new Array();
                    responseJson.data.map((item,i)=>{
                        item = JSON.parse(item);
                        records = records.concat(item);
                    });
                    this.setState({
                        appointRecords :records
                    });
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log("加载预约记录失败"+error)
        })
    }
    //取消预约按钮被点击
    cancelAppoint = (recruitSeq)=>{
        fetch('/public/donAppoint/cancelAppoint',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({recruitSeq:recruitSeq})
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    //alert
                    window.location.href = "/myAppointRecord";
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    }

    //预约成功导航
    locaNvgation = (locSeq)=>{
        fetch('/public/donAppoint/loadNvgationAddress?locationSeq='+locSeq,
            {credentials: "include",
                headers:{'Content-Type': 'application/json'}
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status == 200) {
                    this.setState({
                        ios_show: true,
                        EXACT_ADDRESS: responseJson.data.EXACT_ADDRESS
                    })
                }else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    }


    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    leftContent="返回"
                    onLeftClick={() => {window.location.href= "/home"}}
                    style={{borderBottom:'1px solid #108ee9'}}
                >我的预约</NavBar>
                {this.state.appointRecords.map((item,i)=>{
                    return  (<Preview style={{backgroundColor:'#f7f7f7',marginTop:'4vh'}} >
                        <PreviewHeader>
                            <PreviewItem label="状态" style={{fontSize:'0.8em'}} value={item.RECRUIT_STATUS_DESC} />
                        </PreviewHeader>
                        <PreviewBody>
                            <PreviewItem  style={{display : 'none'}} label="recruit_seq" value={item.RECRUIT_SEQ} />
                            <PreviewItem  style={{display : 'none'}} label="location_seq" value={item.LOCATION_SEQ} />
                            <PreviewItem  label="地点" value={item.LOCATION_NAME} />
                            <PreviewItem label="预约时间" value={item.VALID_FROM} />
                            <PreviewItem label="创建时间" value={item.CREATE_DATE} />
                        </PreviewBody>
                        {item.RECRUIT_STATUS_CODE == 1 ?  <PreviewFooter><PreviewButton style={{color:'green'}} onClick={()=>{this.locaNvgation(item.LOCATION_SEQ)}} >去献血</PreviewButton><PreviewButton primary style={{color:'green'}} onClick={()=>{this.cancelAppoint(item.RECRUIT_SEQ)}} >取消预约</PreviewButton></PreviewFooter> : ''}
                    </Preview>)
                })}

                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.ios_show}
                    type="ios"
                    onRequestClose={e=>this.setState({ios_show: false})}
                />
                <Dialog type="android" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showAndroid1}>
                    {this.state.dialogMes}
                </Dialog>
            </div>
        )
    }
}



export {DonBldConsult,DonBldDetailInfo,AppointSucess,MyAppointRecord};