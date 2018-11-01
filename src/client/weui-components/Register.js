import React from 'react';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import { Link  } from 'react-router-dom';
import SHA2 from './Volunteer/verifyFunc/sha1';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div >强度：强</div>,
  pass: <div >强度：中</div>,
  poor: <div >强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

class Register extends React.Component {
    state = {
        count: 0,
        confirmDirty: false,
        visible: false,
        help: '',
        prefix: '86',
      };
    
    componentDidUpdate() {
    // console.log('you')
    // const { form, register } = this.props;
    // const account = form.getFieldValue('mail');
    // if (register.status === 'ok') {
    //     router.push({
    //     pathname: '/user/register-result',
    //     state: {
    //         account,
    //     },
    //     });
    // }
    }
    
    componentWillUnmount() {
    clearInterval(this.interval);
    }

    onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
        count -= 1;
        this.setState({ count });
        if (count === 0) {
        clearInterval(this.interval);
        }
    }, 1000);
    };

    getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
        return 'ok';
    }
    if (value && value.length > 5) {
        return 'pass';
    }
    return 'poor';
    };

    handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields({ force: true }, (err, values) => {
        if (!err) {
        console.log(values);
        let  { password } = values;
        let data = {
            password: SHA2(password),
            mail: values.mail,
            mobile: values.mobile
        }
        fetch(
            '/db/user_register',
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        ).then(res => res.json())
         .then(json => {
             console.log(json);
             // redirect to 
             this.props.history.push('/login');
         });
        }
    });
    };

    handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
    };

    checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不匹配!');
    } else {
        callback();
    }
    };

    checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
        this.setState({
        help: '请输入密码！',
        visible: !!value,
        });
        callback('error');
    } else {
        this.setState({
        help: '',
        });
        if (!visible) {
        this.setState({
            visible: !!value,
        });
        }
        if (value.length < 6) {
        callback('error');
        } else {
        const { form } = this.props;
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
        }
    }
    };

    changePrefix = value => {
    this.setState({
        prefix: value,
    });
    };

    renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
        <div>
        <Progress
            status={passwordProgressMap[passwordStatus]}
            strokeWidth={6}
            percent={value.length * 10 > 100 ? 100 : value.length * 10}
            showInfo={false}
        />
        </div>
    ) : null;
    };

    checkMail = (rule, value, callback) => {
        //const { form } = this.props;
        //console.log(value);
        let data = {
            mail: value
        }
        fetch(
            '/db/check_mail',
            {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        ).then(res => res.json())
         .then(json => {
             console.log(json);
             if(!json.isvalid) {
                 callback('该邮箱已经被注册。');
                 return;
             }
             callback();
         })
        
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{
                width: '368px',
                margin: '0 auto'
            }}>
                <h3>创建用户</h3>
                <Form onSubmit={this.handleSubmit}>
                <FormItem>
                    {getFieldDecorator('mail', {
                    rules: [
                        {
                        required: true,
                        message: '请输入邮箱地址！',
                        },
                        {
                        type: 'email',
                        message: '邮箱地址格式错误！',
                        },
                        {
                            validator: this.checkMail,
                        },
                    ],
                    })(<Input size="large" placeholder="邮箱" />)}
                </FormItem>
                <FormItem help={this.state.help}>
                    <Popover
                    content={
                        <div style={{ padding: '4px 0' }}>
                        {passwordStatusMap[this.getPasswordStatus()]}
                        {this.renderPasswordProgress()}
                        <div style={{ marginTop: 10 }}>
                            请至少输入 6 个字符。请不要使用容易被猜到的密码。
                        </div>
                        </div>
                    }
                    overlayStyle={{ width: 240 }}
                    placement="right"
                    visible={this.state.visible}
                    >
                    {getFieldDecorator('password', {
                        rules: [
                        {
                            validator: this.checkPassword,
                        },
                        ],
                    })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
                    </Popover>
                </FormItem>
                <FormItem>
                    {getFieldDecorator('confirm', {
                    rules: [
                        {
                        required: true,
                        message: '请确认密码！',
                        },
                        {
                        validator: this.checkConfirm,
                        },
                    ],
                    })(<Input size="large" type="password" placeholder="确认密码" />)}
                </FormItem>
                <FormItem>
                    <InputGroup compact>
                    <Select
                        size="large"
                        value={this.state.prefix}
                        onChange={this.changePrefix}
                        style={{ width: '20%' }}
                    >
                        <Option value="86">+86</Option>
                        <Option value="87">+87</Option>
                    </Select>
                    {getFieldDecorator('mobile', {
                        rules: [
                        {
                            required: true,
                            message: '请输入手机号！',
                        },
                        {
                            pattern: /^1\d{10}$/,
                            message: '手机号格式错误！',
                        },
                        ],
                    })(<Input size="large" style={{ width: '80%' }} placeholder="11位手机号" />)}
                    </InputGroup>
                </FormItem>
                {/*
                <FormItem>
                    <Row gutter={8}>
                    <Col span={16}>
                        {getFieldDecorator('captcha', {
                        rules: [
                            {
                            required: true,
                            message: '请输入验证码！',
                            },
                        ],
                        })(<Input size="large" placeholder="验证码" />)}
                    </Col>
                    <Col span={8}>
                        <Button
                        size="large"
                        disabled={this.state.count}
                        onClick={this.onGetCaptcha}
                        >
                        {this.state.count ? `${this.state.count} s` : '获取验证码'}
                        </Button>
                    </Col>
                    </Row>
                </FormItem>
                */}
                <FormItem>
                    <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    >
                    确定
                    </Button>
                    <Link to="/login">
                    用现有账号登录
                    </Link>
                </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(Register);