import React from 'react';
import { Preview,PreviewHeader,PreviewItem,PreviewBody,Form,FormCell, 
     CellBody, CellsTitle, TextArea, PanelHeader,
    ButtonArea, Button,Panel , Page , PanelBody   } from 'react-weui';
import { NavLink } from 'react-router-dom';

class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location_id: this.props.match.params.location_id,
            location: [],
            reserv_period: this.props.match.params.peroid_id,  //预约时间段
            //  备注
            comms: '',
            // 用户信息
            userinfo: [],
            periodinfos: []
        };
        this.handletextAreaChange = this.handletextAreaChange.bind(this);
    }

    handletextAreaChange(e) {
        this.setState({comms: e.target.value});
    }

    componentDidMount() {
        // 采血点信息
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
         .then(json => {
            this.setState({ location: json.rows[0] });
            console.log(this.state.location)
         });

         // 取个人信息
         fetch(
             '/db/userinfo',
             {
                 method: 'get',
                 headers: {
                     accept: 'application/json'
                 }
             }
         ).then(res => res.json())
          .then(json => {
              console.log(`the user info is ${JSON.stringify(json)}`);
              this.setState({
                  userinfo: json.userinfo
              });
          });

        // 预约时间段信息
        const urlresv = '/db/selectedperiod?period_id=' + this.state.reserv_period;
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
            console.log(json)
            this.setState({ periodinfos: json.rows[0] });
         });
    }

    handleSubmit() {
        const reservdata = {
            period: this.state.reserv_period,
            comms: this.state.comms,
        } 

        fetch('/db/volunteer/add_resv',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservdata),
          }).then(response => response.json()
            .then(updatedApply => {
                var { msg } = updatedApply;
                this.state.responseMsg = msg;
            }));

    }

    render() {
        return (
                <Panel>
                    <PanelHeader>
                        核对预约信息
                    </PanelHeader>
                    <PanelBody>
                        <CellsTitle><strong>预约服务地点</strong></CellsTitle>
                        <Preview>
                            <PreviewHeader>
                                <PreviewItem label='采血点' value={`${this.state.location[1]}`} />
                            </PreviewHeader>
                            <PreviewBody>
                                <PreviewItem label='工作时间' value={`${this.state.location[2]} ~ ${this.state.location[3]}`} />
                                <PreviewItem label='详细地址' value={`${this.state.location[4]}`} />
                            </PreviewBody>
                        </Preview>
                        <CellsTitle><strong>个人信息</strong></CellsTitle>
                            <Preview>
                                <PreviewHeader>
                                    <PreviewItem label='姓名' value={this.state.userinfo[0]} />
                                </PreviewHeader>
                                <PreviewBody>
                                    <PreviewItem label='身份证号' value={this.state.userinfo[1]} />
                                    <PreviewItem label='手机号' value={this.state.userinfo[2]} />
                                </PreviewBody>
                            </Preview>
                        <CellsTitle><strong>预约时间</strong></CellsTitle>
                        <Preview>
                            <PreviewBody>
                                <PreviewItem label='时间段' value={<strong>{this.state.periodinfos[2]} ~ {this.state.periodinfos[3]}</strong>} />
                            </PreviewBody>
                        </Preview>
                        <Form>
                            <FormCell>
                                <CellBody>
                                    <TextArea placeholder="请输入备注" onChange={this.handletextAreaChange.bind(this)} rows="3"></TextArea>
                                </CellBody>
                            </FormCell>
                        </Form>
                        <ButtonArea>
                        <NavLink to='/volunteer/reservation/success'>
                            <Button
                                onClick={() => {
                                    this.handleSubmit();
                                }}>
                                确认
                            </Button>
                        </NavLink>
                    </ButtonArea>
                </PanelBody>
              </Panel>
        )
    }
}

export default Reservation;