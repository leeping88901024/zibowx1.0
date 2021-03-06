import React from 'react';
import { Checkbox, Alert, Icon, Modal  } from 'antd';
//import styles from './Login.less';
// import style
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import Login from './components/Login/index';
const { Tab, UserName, Password, Submit } = Login;


let styles = {
    width: '368px',
    margin:'20vh auto'
}


class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'account',
            autoLogin: true,
            visible: false,
            tips: <div>
                可能的错误：
                <ul>
                    <li>您输入的用户名或者密码错误。</li>
                    <li>用户被管理员停用。</li>
                </ul>
            </div>,
        }

        this.handleLogin = this.handleLogin.bind(this);     
    }

    handleLogin(values) {
        let userinfo = {
            username: values.userName,
            password: values.password,
        }

        // 管理员用户
        if(userinfo.username === 'admin') {
            if(userinfo.password === '8888') {
                this.props.history.push('/testhome3');
                return;
            }
            // 提示用户密码不正确
            this.setState({tips: '请输入正确的管理员密码！'});
            this.setState({visible: true});
            return;
        }

        // 一般用户
        fetch(
            '/loginlocal',
            {
                method: 'post',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userinfo)
            }   
        ).then(res => res.json())
         .then(json => {
             // 如果登录失败
             console.log(json);
             if (json.url === '/loginl') {
                 this.setState({visible: true});
                 return;
             }
             // 否则
             this.props.history.push(json.url);
             // window.location.href = json.url;
         })
    }

    handleOk = (e) => {
        // console.log(e);
        this.setState({
          visible: false,
        });
    }
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
    }

    onTabChange = type => {
        this.setState({ type });
      };
    
    handleSubmit = (err, values) => {
        // console.log(values);
        this.handleLogin(values)
    };

    onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

    changeAutoLogin = e => {
        this.setState({
          autoLogin: e.target.checked,
        });
      };
    
      renderMessage = content => (
        <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
      );

    render() {

        return (
            <div>
                {/*
                <a href={this.state.url}>微信登录</a>
                <br/>
                <p>本地登录</p>
                */}
                <div style={styles}>
                    <Login
                        defaultActiveKey={this.state.type}
                        onTabChange={this.onTabChange}
                        onSubmit={this.handleSubmit}
                        ref={form => {
                            this.loginForm = form;
                        }}
                        >
                        <Tab key="account" tab="账户密码登录">
                            <UserName name="userName" placeholder="请您输入用户名" />
                            <Password
                            name="password"
                            placeholder="请您输入用户密码"
                            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
                            />
                        </Tab>
                        
                        {/*
                        <Tab key="mobile" tab="手机号登录">
                            <Mobile name="mobile" />
                            <Captcha name="captcha" countDown={120} onGetCaptcha={this.onGetCaptcha} />
                        </Tab>
                        */}  
                         
                        <div>
                            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
                            自动登录
                            </Checkbox>
                            <a style={{ float: 'right' }} href="">
                            忘记密码
                            </a>
                        </div>
                        <Submit style={{width: "100%",marginTop:'2vh',height:'6vh'}} >登录</Submit>
                        {/*
                        <div style={{
                            textAlign: 'left',
                            marginTop: '24px',
                            lineHeight: '22px',
                        }}>
                            其他登录方式
                            <Icon type="wechat" theme="outlined" />
                        </div>
                        */}
                    </Login>
                    <Modal
                        title="提示信息"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        >
                    <p>{this.state.tips}</p>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default Example;