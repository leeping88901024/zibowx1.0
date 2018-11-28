import React,{ Component }  from 'react';
import {
    Button
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';

/**
 * 血液检测结果显示
 */
class TestResult extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            result:-1,
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
            <Button type="primary" style={{width:'90%'}} onClick={()=>{window.location.href = "/home"}} >返回</Button>
        </div>);
    }
}


export {TestResult};