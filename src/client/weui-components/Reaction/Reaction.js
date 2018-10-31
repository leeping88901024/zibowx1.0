import React from 'react';
import { Panel, PanelHeader, PanelBody, Preview, PreviewHeader, PreviewItem, PreviewBody, 
    Form, FormCell, CellHeader, Label, CellBody, Select, CellsTitle, Input, TextArea,ButtonArea ,Button, Dialog   } from 'react-weui';
import isTelphoneNumber from '../Volunteer/verifyFunc/tel';

class Reaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idcard: '370303197604041315',
            // 献血者注册号reg_seq
            reginfo: [],

            // 代码表
            reaction_type: [],
            
            //提交的数据
            reaction_typev: '',
            contact: '',
            comms: '',

            // 表单验证对话框
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
        }
        this.handleReactionTypeChange = this.handleReactionTypeChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleCommsChange = this.handleCommsChange.bind(this);
        this.handleVerifyTel = this.handleVerifyTel.bind(this);
    }

    componentDidMount() {
        const url = '/db/reaction?idcard=' + this.state.idcard;
        fetch(
            url,
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }
        ).then(res => res.json())
         .then(json => {
             this.setState({reginfo: json.rows[0]});
             //console.log(this.state.reginfo);
         });

         // 反应类型
         fetch(
            '/db/reaction_type',
            {
                method: 'get'
            }
        ).then(this.parseJson)
         .then(json => {
            
            let NewReactionType= json.map( x => {
              let obj = {
                value: x[0],
                label: x[1]
              };
              return obj;
            })
            
            this.setState({ reaction_type: NewReactionType });
  
             // console.log(Newprofession);
         });
    }

    parseJson(response) {
        return response.json();
    }

    handleVerifyTel(e) {
        if(!isTelphoneNumber(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">请您输入有效的电话号码</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    handleSubmist() {
        if(this.state.reaction_typev == '') {
            this.setState({show_content: <div><font size="3" color="red">请您选择反应程度</font></div>});
            this.setState({show_null: true});
            return;
        }
        if(this.state.contact == '') {
            this.setState({show_content: <div><font size="3" color="red">请您输入手机号码</font></div>});
            this.setState({show_null: true});
            return;
        }
        if(this.state.comms == '') {
            this.setState({show_content: <div><font size="3" color="red">请您输入必要的备注信息</font></div>});
            this.setState({show_null: true});
            return;
        }

        let newdate = new Date();

        let postdata = Object.assign({},{
            reaction_type: this.state.reaction_typev, 
            contact: this.state.contact,
            comms: this.state.comms,
            reg_seq: this.state.reginfo[0],
            reg_emp: this.state.reginfo[1],
            reg_date: this.state.reginfo[3],
            org_seq: this.state.reginfo[4],
            create_date: newdate
        });
        console.log(postdata);
        console.log(this.state.reginfo);

        fetch('/db/add_reaction',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postdata),
          }).then(response => response.json()
            .then(mss => {
                console.log(mss.msg);
            }));

        this.clickHander('/reaction/success');

    }

    clickHander(url) {
        this.props.history.push(url);
    }

    handleDialogClickNull() {
        this.setState({show_null: false})
    }

    handleReactionTypeChange(e) {
        //console.log(e.target.value);
        this.setState({reaction_typev: e.target.value});
    }

    handleContactChange(e) {
        this.setState({contact: e.target.value});
    }

    handleCommsChange(e) {
        this.setState({comms: e.target.value});
    }

    render() {
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        献血反应
                    </PanelHeader>
                    <PanelBody>
                        <Preview>
                            <PreviewHeader>
                                <PreviewItem label="姓名" value={this.state.reginfo[6]} />
                            </PreviewHeader>
                            <PreviewBody>
                                <PreviewItem label="登记机构" value={this.state.reginfo[5]} />
                                <PreviewItem label="登记人" value={this.state.reginfo[2]} />
                                <PreviewItem label="登记日期" value={this.state.reginfo[3]} />
                            </PreviewBody>
                        </Preview>
                        <Form>
                            <FormCell select selectPos="after">
                                <CellHeader>
                                    <Label>反应程度</Label>
                                </CellHeader>
                                <CellBody>
                                    <Select 
                                      onChange={this.handleReactionTypeChange}
                                      value={this.state.reaction_typev}
                                      data={this.state.reaction_type} />
                                </CellBody>
                            </FormCell>
                            <CellsTitle>联系信息</CellsTitle>
                            <FormCell select selectPos="before">
                                <CellHeader>
                                    <Select>
                                        <option value="1">手机</option>
                                        <option value="2">电话</option>
                                    </Select>
                                </CellHeader>
                                <CellBody>
                                    <Input 
                                      type="tel"
                                      value={this.state.contact}
                                      onChange={this.handleContactChange}
                                      onBlur={this.handleVerifyTel}
                                      placeholder="请您输入联系信息"/>
                                </CellBody>
                            </FormCell>
                        </Form>
                        <CellsTitle>备注信息</CellsTitle>
                        <Form>
                            <FormCell>
                                <CellBody>
                                    <TextArea 
                                       placeholder="请您输入备注"
                                       value={this.state.comms}
                                       onChange={this.handleCommsChange}
                                       rows="3"></TextArea>
                                </CellBody>
                            </FormCell>
                        </Form>
                        <ButtonArea>
                            <Button
                                //button to display toptips
                                onClick={this.handleSubmist.bind(this)}>
                                提交
                            </Button>
                        </ButtonArea>
                    </PanelBody>
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

export default Reaction;