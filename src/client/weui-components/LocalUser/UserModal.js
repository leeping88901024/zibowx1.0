import React from 'react'
import { Modal, Form, Input, Popover, Progress, Select, Button } from 'antd'
import { Link  } from 'react-router-dom'
const FormItem = Form.Item
const InputGroup = Input.Group

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

class UserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            count: 0,
            confirmDirty: false,
            help: '',
            prefix: '86',
        };
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({
            visible: true,
        });
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = () => {
        const { onOk } = this.props;
        this.props.form.validateFields((err,values) => {
            if (!err) {
                console.log(`the data will send is ${JSON.stringify(values)}`);
                onOk(values)
                this.hideModelHandler()
            }
        });
    };

    handleInputChange(e) {
        this.setItemValue(e.target.name,e.target.value);
        console.log(this.state.values);
    }

    setItemValue(field,value){
      let _values = Object.assign({},this.state.values,{[field]:value});
      this.setState({values:_values});
    }

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

    render() {
        const { children } = this.props
        const { getFieldDecorator } = this.props.form
        const { id, mail, mobile }  = this.props.record
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }

        return (
            <span>
                <span onClick={this.showModelHandler}>
                  {children}
                </span>
                <Modal
                    title='编辑用户信息'
                    visible={this.state.visible}
                    onOk={this.okHandler}
                    onCancel={this.hideModelHandler}>
                    <Form horizontal onSubmit={this.okHandler}>
                        <FormItem
                            {...formItemLayout}
                            label='邮箱'
                            >
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
                        initialValue: mail,
                        })(<Input size="large" placeholder="邮箱" />)}
                    </FormItem>
                    <FormItem 
                        help={this.state.help}
                        {...formItemLayout}
                        label='登录密码'
                        >
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
                    <FormItem
                        {...formItemLayout}
                        label='确认密码'
                        >
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
                    <FormItem
                        {...formItemLayout}
                        label='手机号'
                        >
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
                            initialValue: mobile,
                        })(<Input size="large" style={{ width: '80%' }} placeholder="11位手机号" />)}
                        </InputGroup>
                    </FormItem>
                    <FormItem>
                        <Link to="/login">
                        用现有账号登录
                        </Link>
                    </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}

export default Form.create()(UserModal);