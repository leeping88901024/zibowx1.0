import React from 'react';
import { Preview, PreviewHeader, PreviewBody, 
     PreviewItem, PreviewFooter,
     PreviewButton, CellsTitle, Panel, 
     PanelHeader, PanelBody, Dialog  } from 'react-weui';

class MyApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applylist: [],

            // 对话框
            show: false,
            style2: {
                title: '提示',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: this.handleRecall.bind(this)
                    }
                ]
            },

            //保存目前的表单号
            form_id: -1,
        }
        this.clickHander = this.clickHander.bind(this);
    }

    hideDialog() {
        this.setState({show: false})
    }

    handleRecall() {
        console.log(this.state.form_id);
        const url = '/db/recall_apply?form_id=' + this.state.form_id;
        return fetch(
            url,
            {
                method: 'post',
                headers: {
                    accept: 'application/json',
                },
            }
        ).then(res => res.json()
        .then(json => {
            //console.log(json);
            let { rowid } = json;
            if (rowid !== null || rowid !== undefined || rowid !== '') {
                // 成功
                console.log(rowid.rid);
                // 打开成功对话框
                this.setState({show: false})
                this.clickHander('/home');
            }
        }));
    }

    clickHander(url) {
        this.props.history.push(url);
    }

    componentDidMount(){
        fetch('/db/query_apply',
              {
                  method: 'get',
                  headers: {
                    accept: 'application/json'
              }
              }).then(response => response.json()
                .then(json => {
                    //console.log(json.rows);
                    this.setState({applylist : json.rows});
                }));
    }

    handleClick(e) {
        this.setState({form_id: e.target.name})
        this.setState({show: true});

    }
    render() {
        const applyComponent = this.state.applylist.map(x => (
            <div key={x[0]}>
                <Preview>
                    <PreviewHeader>
                        <PreviewItem label="姓名" value={x[1]} />
                    </PreviewHeader>
                    <PreviewBody>
                        <CellsTitle>详细信息</CellsTitle>
                        <PreviewItem label="申请编号" value={x[0].toString()} />
                        <PreviewItem label="状态" value={x[16]} />
                        <PreviewItem label="身份证号" value={x[2].toString()} />
                        <PreviewItem label="手机号码" value={x[3].toString()} />
                        <PreviewItem label="电子邮件" value={x[4]} />
                        <PreviewItem label="公司" value={x[5]} />
                        <PreviewItem label="职业" value={x[6]} />
                        <PreviewItem label="学历" value={x[7]} />
                        <PreviewItem label="民族" value={x[8]} />
                        <PreviewItem label="ABO血型" value={x[9]} />
                        <PreviewItem label="是否有过献血经历" value={x[10]} />
                        <PreviewItem label="地址" value={x[11]} />
                        <PreviewItem label="是否常住此地" value={x[12]} />
                        <PreviewItem label="户口所在地" value={x[13]} />
                        <PreviewItem label="申请日期" value={x[15]} />
                    </PreviewBody>
                    <PreviewFooter>
                        <PreviewButton
                            name={x[0]}
                            primary
                            onClick={this.handleClick.bind(this)}
                            >撤销申请</PreviewButton>
                    </PreviewFooter>
                </Preview>
            </div>
        ))
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        申请列表
                    </PanelHeader>
                    <PanelBody>
                        {applyComponent}
                    </PanelBody>
                    <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.show}>
                      你确定要撤销该申请吗？
                    </Dialog>
                </Panel>
            </div>
        )
    }
}

export default MyApply;