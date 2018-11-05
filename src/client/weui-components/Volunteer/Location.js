import React from 'react';
import { Route,NavLink } from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import { Preview,PreviewHeader,PreviewItem,PreviewBody,PreviewFooter,
    PreviewButton, FormCell, Article, Dialog, Badge, CellFooter, Radio, Form, 
    Page, PanelHeader, Panel, PanelBody, CellBody, CellHeader  } from 'react-weui';

class Location extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location_id: this.props.match.params.location_id,
            // 预约服务地点
            location: [],
            reservinfo: [],
            reserv_period: null,

            show: false,
            style: {
                title: "提示",
                buttons: [
                    {
                        label: '确认',
                        onClick: this.handleDialogClick.bind(this)
                    }
                ]
            },
        }

        this.handleonChangeRadio = this.handleonChangeRadio.bind(this);
    }

    handleDialogClick() {
        this.setState({ show: false });
   }

    handleonChangeRadio(e) {
        this.setState({reserv_period: e.target.value});
    }

    componentDidMount() {
        const url = '/db/location?location_id=' + this.state.location_id;
        fetch(
            url,
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }
        ).then(res => res.json())
         .then(json => this.setState({ location: json.rows[0] }));


         // 预约信息
         // 采血点预约时间段信息
        const urlresv = '/db/location/reservation?location_id=' + this.state.location_id;
        fetch(
            urlresv,
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }
        ).then(res => res.json())
         .then(json => {
            let { rows } = json;
            //console.log(json);
            this.setState({ reservinfo: rows });
            console.log(`this.state.reservinfo: ${this.state.reservinfo}    `);
         });
    }

    clickHander(url,e) {
        // console.log(e.target.name)
        if(this.state.reserv_period == null && e.target.name == 'rsv') {
            // console.log('please compelete the form');
            // 在这里显示对话框
            this.setState({show: true});
            return;
        }
        this.props.history.push(url);
    }

     render() {
        const reservinfoComponent = this.state.reservinfo.map(x => (
            <FormCell radio key={x[0]}>
                    <CellHeader>
                        {x[2].substr(0,4)}年
                    </CellHeader>
                    <CellBody>
                        <strong>{`${x[2].substr(5,14)} ~ ${x[3].substr(5,14)}`}</strong>
                        <Badge preset="body" >{`${x[4]}`}</Badge>
                    </CellBody>
                    <CellFooter>
                        <Radio onClick={this.handleonChangeRadio}  name="radio1" value={x[0]}/>
                    </CellFooter>
            </FormCell>
        ));

         return (
             <Page>
                 <Panel>
                    <PanelHeader>
                        采血信息-选择预约时间段
                    </PanelHeader>
                    <PanelBody>
                        <Preview>
                            <PreviewHeader>
                                <PreviewItem label='采血点' value={`${this.state.location[1]}`} />
                            </PreviewHeader>
                            <PreviewBody>
                                <PreviewItem label='工作时间' value={`${this.state.location[2]}-${this.state.location[3]}`} />
                                <PreviewItem label='详细地址' value={`${this.state.location[4]}`} />
                                <Form radio>
                                { reservinfoComponent }
                                </Form>
                            </PreviewBody>

                            <PreviewFooter>
                                <PreviewButton
                                primary
                                name='nvgt'
                                onClick={this.clickHander.bind(this,`/nvgtt/${this.state.location_id}`)}
                                >
                                导航</PreviewButton>
                                <PreviewButton
                                name='rsv'
                                onClick={this.clickHander.bind(this,`/volunteer/reservation/${this.state.location_id}/${this.state.reserv_period}`)} 
                                primary>预约</PreviewButton>
                            </PreviewFooter>
                        </Preview>
                    </PanelBody>
                    <Dialog
                        type="ios" title={this.state.style.title} 
                        show={this.state.show}
                        buttons={this.state.style.buttons} >
                        <Article>
                        <div><font  color="black" >你没有选择选择预约时间段,<br />请选择预约时间段后继续。</font></div>
                        </Article>
                    </Dialog>
                 </Panel>
             </Page>
         )
     }
 }

export default Location;