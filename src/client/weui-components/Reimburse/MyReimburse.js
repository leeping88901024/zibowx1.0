import React from 'react';
import { Panel, PanelHeader, PanelBody, Dialog, Preview, PreviewHeader, PreviewItem,
    CellsTitle, PreviewBody, PreviewFooter, PreviewButton, Gallery, GalleryDelete, Button  } from 'react-weui';

class MyReimburse extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            imburselist: [],

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

            // 提示
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

            form_id: -1,

            // 相册
            showSingle: false,

            // 用户点击浏览图片的时候显示图片
            imgurl: [],
        }
        this.clickHander = this.clickHander.bind(this);
        this.handleShowImg = this.handleShowImg.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleclickDelete = this.handleclickDelete.bind(this);
    }

    hideDialog() {
        this.setState({show: false})
    }

    handleRecall() {
        console.log(this.state.form_id);
        const url = '/db/recall_reimburse?form_id=' + this.state.form_id;
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
                this.setState({show: false});
                // 跳转

                this.clickHander('/home');

            }
        }));
    }

    clickHander(url) {
        this.props.history.push(url);
    }

    componentWillMount() {
        fetch('/db/query_reimburse',
              {
                  method: 'get',
                  credentials: "include",
                  headers: {
                    accept: 'application/json'
              }
              }).then(response => response.json()
                .then(json => {
                    //console.log(json.rows[0][13]);
                    //console.log(json.rows[0][13].length);
                    this.setState({imburselist : json.rows});
            }));
    }

    handleClick(e) {
        // 通过表单序号查表单状态
        const result = this.state.imburselist.filter(x => x[0] == e.target.name);
        if (result[0][13] == 2) {
            var content_null = <div><font size="3" color="red">您已经撤销表单申请，请不要重复操作。</font></div>;
            this.setState({show_content: content_null});
            this.setState({show_null: true});
            return;
        }
        this.setState({form_id: e.target.name})
        this.setState({show: true});
    }

    handleDialogClickNull() {
        this.setState({show_null: false})
    }

    handleShowImg(e) {
        console.log(e.target.name);
        // 在show之前请求图片资源
        const queryImgurl = '/db/queryimg_reimburse?form_id=' + e.target.name;
        return fetch(
            queryImgurl,
            {
                method: 'post',
                headers: {
                    accept: 'application/json',
                },
            }
        ).then(res => res.json()
        .then(json => {
            // console.log(json);
            var imgarr=[];
            for (let i in json) {
                imgarr.push(json[i])
            }
            this.setState({imgurl: imgarr});

            this.setState({ showSingle: true}); 
        }));
    }

    handleEdit(e) {
        // console.log('You can edit form information here....');
        // 输出所选表单对象
        let tmp = this.state.imburselist.filter( x => x[0] == e.target.name);
        if(tmp[0][13] == 2) {
            this.setState({show_content: <div><font size="3" color="red">你已经撤销了该申请单！</font></div>});
            this.setState({show_null: true});
            return;
        }
        this.clickHander(`/reimburseedit/${e.target.name}`);
    }

    handleclickDelete(e,i) {
        console.log(i)
        this.setState({show_content: <div><font size="3" color="red">您点击了第#{i}张图片。</font></div>});
        this.setState({show_null: true});
    }

    render() {

        const BackButtonStyle = {
            display: 'inline-block',
            width: 'auto',
            color: 'white',
            border: 'none',
            position: 'absolute',
            top: '5px',
            left: '15px'
        }

        const reimburseComponent = this.state.imburselist.map(x => (
            <div key={x[0]}>
                <Preview>
                    <PreviewHeader>
                        <PreviewItem label="姓名" value={x[7]} />
                    </PreviewHeader>
                    <PreviewBody>
                        <PreviewItem label="申请编号" value={x[0].toString()} />
                        <PreviewItem label="申请时间" value={x[11].toString()} />
                        <PreviewItem label="申请单状态" value={x[12].toString()} />
                        <CellsTitle><strong>献血者信息</strong></CellsTitle>
                        <PreviewItem label="电话号码" value={x[8].toString()} />
                        <PreviewItem label="身份证号" value={x[9].toString()} />
                        <PreviewItem label="与用血者的关系" value={x[1].toString()} />
                        <CellsTitle><strong>转账信息</strong></CellsTitle>
                        <PreviewItem label="开户人" value={x[2].toString()} />
                        <PreviewItem label="银行卡号" value={x[3].toString()} />
                        <PreviewItem label="开户行名称" value={x[4].toString()} />
                        <PreviewItem label="开户支行" value={x[5].toString()} />
                        <PreviewItem label="开户省市" value={x[6].toString()} />
                    </PreviewBody>
                    <PreviewFooter>
                        <PreviewButton
                            name={x[0]}
                            primary
                            onClick={this.handleClick}
                            >撤销申请</PreviewButton>
                        <PreviewButton
                            primary
                            name={x[0]}
                            onClick={this.handleEdit}
                            >
                            编辑信息
                        </PreviewButton>
                    </PreviewFooter>
                </Preview>
                <Gallery src={this.state.imgurl} show={this.state.showSingle}>
                    <Button
                        style={BackButtonStyle}
                        onClick={e=>this.setState({ showSingle: false})}
                        plain
                    >
                        返回
                    </Button>
                    <GalleryDelete
                        onClick={this.handleclickDelete}
                    />
                </Gallery>
            </div>
        ))

        return (
            <div>
                <Panel>
                    <PanelHeader>
                        申请列表
                    </PanelHeader>
                    <PanelBody>
                       {reimburseComponent}
                    </PanelBody>
                    <Dialog type="ios" title={this.state.style2.title} buttons={this.state.style2.buttons} show={this.state.show}>
                      你确定要撤销该申请吗？
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

export default MyReimburse;