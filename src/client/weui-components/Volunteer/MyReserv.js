import React from 'react';
import { Preview, PreviewHeader, PreviewBody, 
    PreviewItem, PreviewFooter,
    PreviewButton, CellsTitle, Panel, 
    PanelHeader, PanelBody, Dialog  } from 'react-weui';

class MyReserv extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            reservlist: [],

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
            reserv_id: -1,

            // 对已撤销的
            show_recalled: false,
            style_recalled: {
                title: '提示',
                buttons: [
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: this.handleDialogRecalled.bind(this)
                    }
                ]
            },
            // 保存从数据库取来的表单状态
            reserv_state: '-1',


        }
    }

    componentDidMount(){
        fetch('/db/query_reserv',
              {
                  method: 'get',
                  credentials: "include",
                  headers: {
                    accept: 'application/json'
              }
              }).then(response => response.json()
                .then(json => {
                    this.setState({reservlist : json.rows});
                }));
    }

    handleDialogRecalled() {
        this.setState({show_recalled: false});
    }

    handleClick(e) {
        // 判断表单状态，如果是已经撤销，则提示用户已经撤销，不能进行该操作。
        // 传入：表单序号
        const query_url = '/db/query_isreserv?reservid=' + e.target.name;
        fetch(query_url,
              {
                  method: 'get',
                  headers: {
                    accept: 'application/json'
              }
              }).then(response => response.json()
                .then(json => {
                    this.setState({reserv_state: json.reserv_state});             
                }));

        console.log(this.state.reserv_state);
        if(this.state.reserv_state.toString() === '2') {
            //console.log(this.state.reserv_state);
            this.setState({show_recalled: true});
            return;
        }
        this.setState({reserv_id: e.target.name});
        this.setState({show: true});

        //this.setState({reserv_state: -1});
    }

    hideDialog() {
        this.setState({show: false})
    }

    handleRecall() {
        const url = '/db/recall_reserv?reserv_id=' + this.state.reserv_id;
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
                // 更新组件属性
                

            }
        }));
    }

    render() {
        const reservComponent = this.state.reservlist.map(x => (
            <div key={x[5]}>
                <Preview>
                    <PreviewHeader>
                        <PreviewItem label="预约采血点" value={x[3]} />
                    </PreviewHeader>
                    <PreviewBody>
                        <PreviewItem label="预约时间段" value={x[2]} />
                        <PreviewItem label="提交日期" value={x[1]} />
                        <PreviewItem label="备注" value={x[0]} />
                        <PreviewItem label="状态" value={x[5]} />
                    </PreviewBody>
                    <PreviewFooter>
                        <PreviewButton
                            name={x[4]}
                            primary
                            onClick={this.handleClick.bind(this)}
                            >撤销预约</PreviewButton>
                    </PreviewFooter>
                </Preview>
            </div>
        ));
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        预约记录
                    </PanelHeader>
                    <PanelBody>
                        {reservComponent}
                    </PanelBody>
                    <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.show}>
                      你确定要撤销该预约吗？
                    </Dialog>
                    <Dialog type="ios" title={this.state.style_recalled.title} buttons={this.state.style_recalled.buttons} show={this.state.show_recalled}>
                      该申请单已经撤销，请不要重复操作。
                    </Dialog>
                </Panel>
            </div>
        )
    }
}

export default MyReserv;