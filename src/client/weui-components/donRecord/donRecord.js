import React,{ Component }  from 'react';
import ReactDOM from 'react-dom';
import {
    Msg,
    Radio,
    VCode,
    Input,
    CellFooter,
    CellBody,
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
    CellsTitle
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';
import './donRecord.css';

/**
 * 献血记录查询
 */
class QueryDonRecord extends React.Component {
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
        //献血者手机号码
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
        fetch('/private/donRecord/queryDonRecord',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(postData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    window.location.href = '/donRecord';
                    //处理查询结果
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
                <div style={{display:'block',margin:'4vh auto', textAlign: 'center'}}><h2 style={{color:'green',display:'inline'}} >献血记录查询</h2></div>
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
 * 献血记录结果显示
 */
class DonRecord extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            idcard:'',
            sex:'',
            aboGroup:'',
            records:[],
            statistics:'',
            donBldEqui:'',
            recordsHead:['COLLATE_DATE','LOCATION_NAME','DONATION_NAME','PHLE_TYPE',"ACTUAL_VOLUME"]
        };
    }
    componentDidMount(){
        fetch('/private/donRecord/recordResult',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data)
                    this.setState({
                        donBldEqui:JSON.parse(responseJson.data.records[0]).SUM_PHLE_VOLUME,
                        statistics:responseJson.data.statistics,
                        records:responseJson.data.records,
                        name:JSON.parse(responseJson.data.records[0]).PSN_NAME,
                        idcard:JSON.parse(responseJson.data.records[0]).IDCARD,
                        sex:JSON.parse(responseJson.data.records[0]).SEX,
                        aboGroup:JSON.parse(responseJson.data.records[0]).ABO_GROUP,
                    })
                }else if(responseJson.status == 10024){
                    window.location.href = '/requestWxAuth';
                }else if(responseJson.status == 10025){
                    //进行献血者认证
                    window.location.href = "/login";
                }else{
                    alert(responseJson.message)
                }
            }).catch(function(err){
                console.log("系统异常"+err)
            //window.location.href = '/queryDonRecord';
            });
    }

    render(){
        return(
            <div className="all">
                <div style={{display:'block',margin:'4vh auto', textAlign: 'center'}}><h2 style={{color:'green',display:'inline'}} >献血记录</h2></div>
                <CellsTitle >姓名:<span className='result_span'>{this.state.name+'  '}</span> 身份证号:<span className='result_span'>{this.state.idcard+'  '}</span>性别:<span className='result_span'>{this.state.sex == 0 ? '男' :  '女' +'  '}</span>血型:<span className='result_span'>{this.state.aboGroup}</span></CellsTitle>
                <CellsTitle >机采血量:<span className='result_span'>{this.state.statistics.maVolume != '' ? this.state.statistics.maVolume+'治疗量  ' : '0治疗量'}</span> 全血血量:<span className='result_span'>{this.state.statistics.wbVolume != '' ?  this.state.statistics.wbVolume+' ml ' : ' 0 ml'}</span>献血当量:<span className='result_span'>{this.state.donBldEqui+'ml  '}</span></CellsTitle>
                <div style={{overflow:'scroll'}} >
                    <table>
                        <tr>
                            {this.state.recordsHead.map((head,i)=>{
                                switch (head) {
                                    case "COLLATE_DATE": return(<th key={i}>献血日期</th>); break;
                                    case 'LOCATION_NAME': return(<th key={i} >献血地点</th>); break;
                                    case 'DONATION_NAME': return(<th key={i}>献血类型</th>); break;
                                    case 'PHLE_TYPE': return(<th key={i}>献血流程</th>); break;
                                    case 'ACTUAL_VOLUME': return(<th key={i}>献血量</th>); break;
                                }
                            })}
                        </tr>
                        {this.state.records.map((record,k)=>{
                            return(<tr>{this.state.recordsHead.map((head,i)=>{
                                switch (head) {
                                    case "COLLATE_DATE": return(<td key={i} >{JSON.parse(record).COLLATE_DATE}</td>); break;
                                    case 'LOCATION_NAME': return(<td key={i} >{JSON.parse(record).LOCATION_NAME}</td>); break;
                                    case 'DONATION_NAME': return(<td key={i} >{JSON.parse(record).DONATION_NAME}</td>); break;
                                    case 'PHLE_TYPE': return(<td key={i} >{JSON.parse(record).PHLE_TYPE == 1 ? '机采' : '全血'}</td>);  break;
                                    case 'ACTUAL_VOLUME': return(<td key={i} >{JSON.parse(record).ACTUAL_VOLUME }{JSON.parse(record).PHLE_TYPE == 1 ? '治疗量' : 'ml'}</td>); break;
                                }
                            })}</tr>)
                        })}
                    </table>
                </div>
            </div>
        );
    }
}


export {QueryDonRecord,DonRecord};