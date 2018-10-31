import React from 'react';
import { Panel, PanelHeader, PanelBody, Dialog, Article, Form, 
    FormCell, CellHeader, Label,CellBody,Input,
    ButtonArea , Button    } from 'react-weui';

import checkChinese from '../Volunteer/verifyFunc/chinese';
import checkIDCard from '../Volunteer/verifyFunc/idcard';
import isTelphoneNumber from '../Volunteer/verifyFunc/tel';
class Reimburse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            // 悉知
            show: false,
            style: {
                title: "悉知",
                buttons: [
                    {
                        label: '确认',
                        onClick: this.handleDialogClick.bind(this)
                    }
                ]
            },

            // 提交数据
            values: {
                name: '李秀英',
                idcard: '370923197210170948',
                phone: '15966950949',
            },

            // 验证表单对话框
            show_null: false,
            style_null: {
                title: "提示",
                buttons: [
                    {
                        label: '确认',
                        onClick: this.handleDialogClickNull.bind(this)
                    }
                ]
            },
            show_content: '',
            // 用于献血认证
            isdonation: false,

            //
            psnseq: 0,



        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleVerifyIdcard = this.handleVerifyIdcard.bind(this);
        this.handleVerifyName = this.handleVerifyName.bind(this);
        this.handleVerifyTel = this.handleVerifyTel.bind(this);
        this.handleClickPreview = this.handleClickPreview.bind(this);
    }

    handleDialogClick() {
        this.setState({show: false});
    }

    handleDialogClickNull() {
        this.setState({show_null: false})
    }

    
    handleInputChange(e){
        this.setItemValue(e.target.name,e.target.value);
    }

    setItemValue(field,value){
        let _values = Object.assign({},this.state.values,{[field]:value});
        this.setState({values:_values});
        console.log(this.state.values);
    }

    //  验证-姓名
    handleVerifyName(e) {
        if (!checkChinese(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">输入的姓名只能包含汉字</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    //  验证-身份证号码
    handleVerifyIdcard(e) {
        if(!checkIDCard(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">请输入有效的身份证号码</font></div>});
            this.setState({show_null: true});
            return;
        }
        
    }

    // 验证-电话号码
    handleVerifyTel(e) {
        if (!isTelphoneNumber(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">请输入有效的手机号码</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    // 第一步-献血认证
    handleClickNext() {
        let data = this.state.values;
        for(let key in data) {
            if (data[key].toString() == '') {
                // 显示对话框，提示哪项字段为空
                // 提示内容：字段名称
                var content_null = '';
                switch (key) {
                    case 'name':
                        content_null = <div><font size="3" color="red">姓名不能为空。</font></div>;
                        break;
                    case 'idcard':
                        content_null = <div><font size="3" color="red">身份证不能为空。</font></div>;
                        break;
                    case 'phone':
                        content_null = <div><font size="3" color="red">手机号码不能为空。</font></div>;
                        break;
                    default:
                        break;
                }
                this.setState({show_content: content_null});
                this.setState({show_null: true});
                return; 
        }
  
        };
        // 查询是否有该人的献血记录
        //console.log('uuuu')
        fetch('/db/query_isdonation',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).then(response => response.json()
            .then(json => {
                var { cnt } = json;
                var { psnseq } = json;
                //console.log(json)
                //console.log(cnt);
                if (cnt > 0) {
                     this.setState({isdonation: true});
                     this.setState({psnseq: psnseq})
                }
                //console.log('yyyy')
                // 代码会先执行这里的内容，再执行fetch的内容
                if(this.state.isdonation) {
                    this.clickHander(`/reimburseform/${this.state.psnseq}`);
                } else {
                    this.setState({show_content: <div><font size="3" color="red">献血认证失败-没有献血记录</font></div>});
                    this.setState({show_null: true});
                }
            }));
    }

    clickHander(url) {
        this.props.history.push(url);
    }

    handleClickPreview() {
        history.back();
    }

    render() {
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        用血报销-献血认证
                    </PanelHeader>
                    <PanelBody>
                    <Form>
                        <FormCell>
                            <CellHeader>
                                <Label>姓名</Label>
                            </CellHeader>
                            <CellBody>
                                <Input
                                    name="name" 
                                    value={this.state.values.name} 
                                    type="string" 
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleVerifyName}
                                    placeholder="请输入您的姓名"/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>身份证号</Label>
                            </CellHeader>
                            <CellBody>
                                <Input
                                    name="idcard" 
                                    value={this.state.values.idcard} 
                                    type="number" 
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleVerifyIdcard}
                                    placeholder="请输入您的身份证号#"/>
                            </CellBody>
                        </FormCell>
                        <FormCell>
                            <CellHeader>
                                <Label>手机号码</Label>
                            </CellHeader>
                            <CellBody>
                                <Input
                                    name="phone" 
                                    value={this.state.values.phone} 
                                    type="tel" 
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleVerifyTel}
                                    placeholder="请输入您的电话号码#"/>
                            </CellBody>
                        </FormCell>
                    </Form>
                    <ButtonArea direction="horizontal">
                        <Button 
                                onClick={this.handleClickPreview}
                                type="default">上一步</Button>
                        <Button
                            //button to display toptips
                            onClick={this.handleClickNext.bind(this)}>
                            下一步
                        </Button>
                    </ButtonArea>
                    </PanelBody>
                    <Dialog 
                        type="ios" title={this.state.style.title} 
                        show={this.state.show}
                        buttons={this.state.style.buttons} >
                        <div>
                        <Article>
                            ttt
                        </Article>
                        </div>
                    </Dialog>
                    <Dialog 
                        type="ios" title={this.state.style_null.title} 
                        show={this.state.show_null}
                        buttons={this.state.style_null.buttons} >
                        <div>
                            {this.state.show_content}
                        </div>
                    </Dialog>
                </Panel>
            </div>
        )
    }
}

export default Reimburse;