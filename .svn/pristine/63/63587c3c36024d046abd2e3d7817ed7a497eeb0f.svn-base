import React,{ Component }  from 'react';
import ReactDOM from 'react-dom';
import {
    Msg,
    Radio,
    VCode,
    Input,
    Label,
    Form,
    FormCell,
    CellHeader,
    Button,
    Tab,
    NavBarItem,
    ActionSheet,
    Select,
    Flex,
    FlexItem,
    CellsTitle,
    CellBody,
    Cells,
    Cell,
    CellFooter,
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';

/**
 * 检测结果查询
 */
class QueryTestResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tell:'',
            captcha:'',
            sendCaprButVal:'获取验证码',
            isDisabled:''
        }
    }
    componentDidMount(){

    }

    //发送验证码
    sendCaptcha = ()=>{
        //检测手机号是否有效
        var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tellReg.test(this.state.tell)) {
            alert("请输入有效的手机号码");
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
        //请求服务器 发送验证码
        fetch('/public/wxUserLogin/sendCaptcha?tell='+this.state.tell,{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log("验证码发送成功！");
                }else{
                    console.log("验证码发送失败！");
                    this.setState({
                        hint:'验证码发送失败！',
                    });
                    clearInterval(clocker);
                    this.setState({sendCaprButVal:"获取验证码",
                        isDisabled:!this.state.isDisabled
                    });
                    //按钮可用
                }
            }).catch(function(error){
            console.log("验证码发送失败！"+error)
        })
    }

    //提交表单
    submit = () =>{
        //献血者手机号码
        var tellReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tellReg.test(this.state.tell)) {
            alert("请输入正确的手机号码");
            return
        }
        //验证码
        if(!this.state.captcha){
            alert('请输入验证码');
            return
        }

        let postData = {
            tell:this.state.tell,
            captcha:this.state.captcha
        }

        //提交数据到服务器
        fetch('/private/testResult/queryTestResult',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(postData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data[0])
                    //处理查询结果
                    window.location.href = '/testResult?result_code='+responseJson.data[0];
                }else if(responseJson.status == 201){
                    alert("验证码错误");
                }else if(responseJson.status == 10024){
                    window.location.href = '/requestWxAuth';
                }
                else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })

    }

    render() {
        return (
            <div>
                <div style={{display:'block',margin:'4vh auto', textAlign: 'center'}}><h2 style={{color:'green',display:'inline'}} >检测结果查询</h2></div>
                <Form style={{marginTop:'2vh'}}>
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
                <Button style={{marginTop:'4vh'}} onClick={this.submit} >查询</Button>
                <span style={{marginTop:'4vh',marginLeft:'2vw',fontSize:'14px',color:'green'}}></span><br/>
            </div>
        )
    }
}

/**
 * 血液检测结果显示
 */
class TestResult extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            result:'',
            regDate: '',
            psnName:''
        };
    }
    componentDidMount(){
       //请求服务器查询结果
        fetch('/private/testResult/queryTestResult',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data);
                    this.setState({
                        result:JSON.parse(responseJson.data).TEST_RESULT,
                        regDate:JSON.parse(responseJson.data).REG_DATE,
                        psnName : JSON.parse(responseJson.data).PSN_NAME,
                    })
                }else if(responseJson.status == 10014){
                    //会话失效，重新请求微信授权
                    window.location.href = "/requestWxAuth";
                }else if(responseJson.status == 10025){
                    //进行献血者认证
                    window.location.href = "/login";
                }
                else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log("血液检测结果查询异常"+error)
        })
    }

    render(){
        return(<div style={{marginTop:'0',height:'100vh',background:'#fff'}}>
            <div style={{height:'50vh',background:'#dafff3',margin:'8vh 8vw',borderRadius:'4px',padding:'10vh',fontSize:'18px',
                            lineHeight:'8vh'}} >
                        姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:&nbsp;&nbsp;&nbsp;{this.state.psnName}<br />
                        献血时间:&nbsp;&nbsp;&nbsp;{this.state.regDate}<br />
                        检测结果:&nbsp;&nbsp;&nbsp;{this.state.result == 1 ? '合格' : (this.state.result == 0 ? '不合格' : '未查到数据')}
            </div>
                <span style={{display:'block',marginTop:'-6vh',marginBottom:'2vh',fontSize:'18px',textAlign:'center'}}> 感谢您的爱心奉献，<br />祝您生活愉快！</span>
            {/*   <Button type="primary" style={{width:'90%'}} onClick={()=>{this.props.location.history.goBack()}} >返回</Button>*/}
        </div>);
    }
}


export {QueryTestResult,TestResult};