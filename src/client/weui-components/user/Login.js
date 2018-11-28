import React,{ Component }  from 'react';
import './login.css';
var wxconfig = require('../../../server/wxconfig');
// import style
import {
    Button,
    Cell,
    CellHeader,
    CellBody,
    CellFooter,
    Form,
    FormCell,
    Input,
    VCode,
    Label, CellsTitle, Select, Dialog,Footer,FooterText
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';
import {commonModule} from "../publicModule/publicModule";
import {Icon, NavBar} from "antd-mobile";

/**
 * 使用手机号码认证
 */
class Regist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nickname : '昵称加载失败',
            prof_img_url:'',
            sendCaprButVal:'获取验证码',
            idcard:'',
            name:'',
            tell:'',
            captcha:'',
            isDisabled:'',
            certtype:'',
            certificationTypes:'',
            idcardSeq:'',
            clocker:'',
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
            dialogMes2:'',
            showAndroid2: false,
            style2: {
                title: '您好:',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: ()=>{
                            window.location.href = '/requestWxAuth?comeFromRouter=/regist';
                        }
                    }
                ]
            }
        };
        this.sendCaptcha = this.sendCaptcha.bind(this);
        this.submit = this.submit.bind(this);
    }
    //控件挂在完毕加载数据
    componentDidMount(){
        fetch('/private/donor/getWxUserInfo',{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status == 200){
                    this.setState({nickname: responseJson.data.nickname, prof_img_url: responseJson.data.headimgurl});
                }else if(responseJson.status == 10024){
                    window.location.href = '/requestWxAuth?comeFromRouter=/regist';
                }else{
                    this.setState({
                        showAndroid2: true,
                        dialogMes2:'加载用户信息失败,是否继续认证?',
                    });
                }
            }).catch(function(err){
                this.setState({
                    showAndroid2: true,
                    dialogMes2:'加载用户信息失败,是否继续认证?',
                });

        });
        //加载证件类型
        fetch('/public/donAppoint/loadCertTypes',
            {credentials: "include",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data)
                    //设置证件类型
                    let certsArray = new Array();
                    responseJson.data[0].map((certs, k) => {
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
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    };
    //发送验证码
    sendCaptcha = ()=>{
        //验证电话号码是否合法
        //献血者手机号码
        var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tellReg.test(this.state.tell)) {
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入有效的手机号码',
            });
            return
        }
        //倒计时
        let seconds = 60;
        this.setState({
            //按钮禁用
            isDisabled: !this.state.isDisabled,
        });
        let clocker = setInterval(()=>{
            if(seconds>0){
                this.setState({ sendCaprButVal:"重新获取"+seconds});
                seconds--;
            }else{
                clearInterval(clocker);
                this.setState({sendCaprButVal:"获取验证码"
                    ,isDisabled:!this.state.isDisabled});
            }
        },1000);

        this.setState({
            clocker : clocker
        });

        //请求服务器 发送验证码
        fetch('/public/wxUserLogin/sendCaptcha?tell='+this.state.tell,{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log("验证码发送成功！");
                }else{
                    console.log("验证码发送失败！");
                    this.setState({
                        showAndroid1: true,
                        dialogMes:'验证码发送失败！',
                    });
                    clearInterval(clocker);
                    this.setState({sendCaprButVal:"获取验证码",
                        isDisabled:!this.state.isDisabled
                    });
                    //按钮可用
                }
            }).catch(function(error){
           console.log("验证码发送失败！");
            this.setState({
                showAndroid1: true,
                dialogMes:'验证码发送失败！',
            });
            clearInterval(clocker);
            this.setState({sendCaprButVal:"获取验证码",
                isDisabled:!this.state.isDisabled
            });
        })
    }
    //提交表单
    submit = () =>{
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        if (!this.state.name || !regName.test(this.state.name)) {
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入和证件一致的姓名！',
            });
            return
        }
        //用血者证件号码
        if(this.state.certtype == this.state.idcardSeq){
            if(!this.state.idcard || !commonModule.IdentityCodeValid(this.state.idcard)){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'身份证号码有误',
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

        //献血者手机号码
        var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tellReg.test(this.state.tell)) {
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入正确的手机号码',
            });
            return
        }
        //验证码
        if(!this.state.captcha){
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入验证码',
            });
            return
        }

        //封装参数
        var data = {
            name:this.state.name,
            certtype:this.state.certtype,
            idcardSeq : this.state.idcardSeq,
            idcard:this.state.idcard,
            tell:this.state.tell,
            captcha:this.state.captcha
        }
    //提交数据到服务器
        fetch('/private/donor/regist',
            {credentials: "include", method: "POST",
                headers:{token:window.localStorage.getItem("token"),'Content-Type': 'application/json'},
                body:JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    this.setState({
                        showAndroid1: true,
                        dialogMes:'认证成功！',
                    });
                    //从localstorage取出用户想到达的控件
                    window.location.href = commonModule.getCookie("afterAuthTo");
                }else if(responseJson.status === 10024){
                    //说明用户未进行微信授权
                    window.location.href='/requestWxAuth?comeFromRouter=/regist'
                } else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                    clearInterval(this.state.clocker);
                    this.setState({sendCaprButVal:"获取验证码",
                        isDisabled:!this.state.isDisabled
                    });
                }
            }).catch(function(error){
            console.log(error)
            this.setState({
                showAndroid1: true,
                dialogMes:'服务器出错！',
            });
            clearInterval(this.state.clocker);
            this.setState({sendCaprButVal:"获取验证码",
                isDisabled:!this.state.isDisabled
            });
        })
    }


    hideDialog() {
        this.setState({
            showAndroid1: false,
            showAndroid2: false,
        });
    }


    render() {
        return (
            <div>
                <Dialog type="android" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showAndroid1}>
                    {this.state.dialogMes}
                </Dialog>
                <Dialog type="android" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showAndroid2}>
                    {this.state.dialogMes2}
                </Dialog>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    leftContent="返回"
                    onLeftClick={() => {window.location.href= "/home"}}
                    style={{borderBottom:'1px solid #108ee9'}}
                >献血者认证</NavBar>
                <div className="wx_info_show">
                    <div style={{width:'80px',height:'80px',borderRadius:'40px', overflow:'hidden',margin:'4vh auto'}}><img alt="头像加载失败" style={{width:'100%',height:'100%'}} src={this.state.prof_img_url} /></div>
                    <div style={{margin:'10px auto',textAlign:'center',fontSize:'16px'}}>{this.state.nickname}</div>
                </div>
                <Form style={{marginTop:'2vh'}}>
                    <FormCell>
                        <CellHeader>
                            <Label>姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.name} onChange={(e)=>{
                                this.setState({name:e.target.value})
                            }}   placeholder="请输入姓名"/>
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
                            <Input  value={this.state.idcard} onChange={(e)=>{
                                this.setState({
                                    idcard:e.target.value
                                });
                            }} type="tel" placeholder="请输入证件号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>手机</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="tel" onChange={(e)=>{
                                this.setState({tell:e.target.value})
                            }} placeholder="请输入最近一次献血预留手机号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell vcode>
                        <CellHeader>
                            <Label>验证码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="tel"  onChange={(e)=>{
                                this.setState({captcha:e.target.value})
                            }} placeholder="请输入验证码"/>
                        </CellBody>
                        <CellFooter>
                            <Button plain disabled={this.state.isDisabled} onClick={this.sendCaptcha} type="primary" >{this.state.sendCaprButVal}</Button>
                        </CellFooter>
                    </FormCell>
                </Form>
                <CellsTitle style={{textAlign:'right',color:'blue'}} ><a href="/donorAuthByDonId" >通过献血编号认证？</a></CellsTitle>
                <Button style={{marginTop:'2vh'}} onClick={this.submit} >认证</Button>
                <Footer>
                    <FooterText style={{marginTop:'2vh'}}>温馨提示:献血者认证即将微信信息与献血信息关联，关联后不可更改！</FooterText>
                </Footer>

            </div>
        )
    }
}
/**
 * 使用献血编号认证
 */
class DonorAuthByDonId extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nickname : '昵称加载失败',
            prof_img_url:'',
            donId :'',
            sendCaprButVal:'获取验证码',
            idcard:'',
            name:'',
            picturecaptcha:'',
            isDisabled:'',
            certtype:'',
            certificationTypes:'',
            idcardSeq:'',
            clocker:'',
            showAndroid1: false,
            dialogMes:'',
            picCaptchUrl:'',
            style1: {
                buttons: [
                    {
                        label: 'Ok',
                        onClick: this.hideDialog.bind(this)
                    }
                ]
            },
            dialogMes2:'',
            showAndroid2: false,
            style2: {
                title: '您好:',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: ()=>{
                            window.location.href = '/requestWxAuth?comeFromRouter=donorAuthByDonId';
                        }
                    }
                ]
            }
        };
        this.submit = this.submit.bind(this);
    }
    //控件挂在完毕加载数据
    componentDidMount(){
        fetch('/private/donor/getWxUserInfo',{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    this.setState({nickname: responseJson.data.nickname, prof_img_url: responseJson.data.headimgurl});
                }else if(responseJson.status === 10024){
                    window.location.href = '/requestWxAuth?comeFromRouter=/donorAuthByDonId';
                }else{
                    this.setState({
                        showAndroid2: true,
                        dialogMes2:'加载用户信息失败,是否继续认证?',
                    });
                }
            }).catch(function(){
            this.setState({
                showAndroid2: true,
                dialogMes2:'加载用户信息失败,是否继续认证?',
            });
        });

        //请求图片验证码
        fetch('/public/wxUserLogin/getPicCatpcha',
            {credentials: "include",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => {
                this.setState({
                    picCaptchUrl : response.url
                })
            })
           .catch(function(error){
            console.log(error)
        })


        //加载证件类型
        fetch('/public/donAppoint/loadCertTypes',
            {credentials: "include",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data)
                    //设置证件类型
                    let certsArray = new Array();
                    responseJson.data[0].map((certs, k) => {
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
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
            console.log(error)
        })
    };

    //提交表单
    submit = () =>{
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        if (!this.state.name || !regName.test(this.state.name)) {
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入和证件一致的姓名！',
            });
            return
        }
        //用血者证件号码
        if(this.state.certtype == this.state.idcardSeq){
            if(!this.state.idcard || !commonModule.IdentityCodeValid(this.state.idcard)){
                this.setState({
                    showAndroid1: true,
                    dialogMes:'身份证号码有误',
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

        //献血编号
        if(!this.state.donId){
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入献血编号',
            });
            return
        }

        //验证码
        if(!this.state.picturecaptcha){
            this.setState({
                showAndroid1: true,
                dialogMes:'请输入验证码',
            });
            return
        }

        //封装参数
        var data = {
            name:this.state.name,
            certtype:this.state.certtype,
            idcardSeq : this.state.idcardSeq,
            idcard:this.state.idcard,
            donId:this.state.donId,
            picturecaptcha : this.state.picturecaptcha
        }
        //提交数据到服务器
        fetch('/private/donor/donAuthByDonId',
            {credentials: "include", method: "POST",
                headers:{token:window.localStorage.getItem("token"),'Content-Type': 'application/json'},
                body:JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    this.setState({
                        showAndroid1: true,
                        dialogMes:'认证成功！',
                    });
                    //从localstorage取出用户想到达的控件
                    window.location.href = commonModule.getCookie("afterAuthTo");
                }else if(responseJson.status === 10024){
                    //说明用户未进行微信授权
                    this.setState({
                        showAndroid2: true,
                        dialogMes2:'微信授权已失效，是否重新授权?',
                    });
                }else if(responseJson.status == 10014){
                    this.setState({
                        showAndroid2: true,
                        dialogMes2:'微信授权已失效，是否重新授权？',
                    });
                }
                else{
                    this.setState({
                        showAndroid1: true,
                        dialogMes:responseJson.message,
                    });
                }
            }).catch(function(error){
                console.log(error)
                this.setState({
                    showAndroid1: true,
                    dialogMes:'服务器出错！',
                });
        })
    }


    hideDialog() {
        this.setState({
            showAndroid1: false,
            showAndroid2: false,
        });
    }


    render() {
        return (
            <div>
                <Dialog type="android" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showAndroid1}>
                    {this.state.dialogMes}
                </Dialog>
                <Dialog type="android" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.showAndroid2}>
                    {this.state.dialogMes2}
                </Dialog>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    leftContent="返回"
                    onLeftClick={() => {window.location.href= "/home"}}
                    style={{borderBottom:'1px solid #108ee9'}}
                >献血者认证</NavBar>
                <div className="wx_info_show">
                    <div style={{width:'80px',height:'80px',borderRadius:'40px', overflow:'hidden',margin:'4vh auto'}}><img alt="头像加载失败" style={{width:'100%',height:'100%'}} src={this.state.prof_img_url} /></div>
                    <div style={{margin:'10px auto',textAlign:'center',fontSize:'16px'}}>{this.state.nickname}</div>
                </div>
                <Form style={{marginTop:'2vh'}}>
                    <FormCell>
                        <CellHeader>
                            <Label>姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input   value={this.state.name} onChange={(e)=>{
                                this.setState({name:e.target.value})
                            }}   placeholder="请输入姓名"/>
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
                            <Input  value={this.state.idcard} onChange={(e)=>{
                                this.setState({
                                    idcard:e.target.value
                                });
                            }} type="tel" placeholder="请输入证件号码"/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>献血编号</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="tel" onChange={(e)=>{
                                this.setState({donId:e.target.value})
                            }} placeholder="请输入献血编号"/>
                        </CellBody>
                    </FormCell>
                    <FormCell vcode>
                        <CellHeader>
                            <Label>验证码</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="tel"  onChange={(e)=>{
                                this.setState({picturecaptcha:e.target.value})
                            }} placeholder="请输入验证码"/>
                        </CellBody>
                        <CellFooter>
                            <img  src={this.state.picCaptchUrl} onClick={()=>{
                                this.setState({
                                    picCaptchUrl : this.state.picCaptchUrl+'?'+new Date().getTime()
                                });
                            }} ></img>
                         </CellFooter>
                    </FormCell>
                </Form>
                <Button style={{marginTop:'2vh'}} onClick={this.submit} >认证</Button>
                <Footer>
                    <FooterText style={{marginTop:'2vh'}}>温馨提示:献血者认证即将微信信息与献血信息关联，关联后不可更改！</FooterText>
                </Footer>

            </div>
        )
    }
}
export {Regist,DonorAuthByDonId};