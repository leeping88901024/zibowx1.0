import React from 'react';
//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import { Tab, TabBarItem, CellsTitle ,TabBody,TabBar,Cells,Cell,CellHeader,CellBody,Badge,CellFooter,Grids } from 'react-weui';
import IconHome from '../img/home.png';
import IconUser from '../img/user.png';
import IconApply from '../img/apply.png';
import IconExamination from '../img/examination.png';
import IconReservationServce from '../img/reservation_services.png';
import iconMyReinburse from '../img/myreinburse.png';
import iconApply from '../img/apply.png';
import iconReserv from '../img/reservation_services.png';
import iconReaction from '../img/reaction.png';
import iconReimburse from '../img/reinburse.png';
import iconReinburseprogress from '../img/progress.png';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            userinfo: []
        }
    }

    gridsdata = [
        {
            icon: <img src={IconApply} />,
            label: '志愿者申请',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/volunteer/apply')
        },
        {
            icon: <img src={IconExamination} />,
            label: '志愿者考试',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/volunteer/examination')
        },
        {
            icon: <img src={IconReservationServce} />,
            label: '预约志愿服务',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/locations')
        },
        {
            icon: <img src={iconReaction} />,
            label: '献血反应',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/reaction')
        },
        {
            icon: <img src={iconReimburse} />,
            label: '用血报销',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/learntoknow')
        },
        {
            icon: <img src={iconMyReinburse} />,
            label: '我的报销',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/my/reimburse')
        },
        {
            icon: <img src={iconReimburse} />,
            label: '登录',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/login')
        }
    ]

    clickHander(url) {
        this.props.history.push(url);
    }

    componentDidMount() {
        fetch(
            '/db/userinfo-h',
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                },
            }
        ).then(res => res.json())
         .then(json => {
             this.setState({userinfo: json.userinfo});
         })
    }

    render() {
        return (
            <Tab>
                <TabBody>
                    <Grids style={{display: this.state.tab == 0 ? null : 'none'}} data={this.gridsdata} />
                    <div style={{display: this.state.tab == 1 ? null : 'none'}} >
                        <Cells>
                            <Cell>
                                <CellHeader style={{ position: 'relative', marginRight: '10px' }}>
                                    <img src={IconUser} style={{ width: '50px', display: 'block' }} />
                                </CellHeader>
                                <CellBody>
                                    <p>{this.state.userinfo[0]}</p>
                                    <p style={{ fontSize: '13px', color: '#888888' }}>{this.state.userinfo[2]}</p>
                                </CellBody>
                            </Cell>
                        </Cells>
                        <CellsTitle>志愿服务</CellsTitle>
                        <Cells>
                            <Cell onClick={this.clickHander.bind(this,'/my/volunteer/apply')}>
                                <CellHeader>
                                    <img src={iconApply} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
                                </CellHeader>
                                <CellBody>
                                    我的申请
                                </CellBody>
                                <CellFooter>
                                </CellFooter>
                            </Cell>
                            <Cell onClick={this.clickHander.bind(this,'/my/volunteer/reserv')}>
                                <CellHeader>
                                    <img src={iconReserv} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
                                </CellHeader>
                                <CellBody>
                                    我的预约
                                </CellBody>
                                <CellFooter>
                                </CellFooter>
                            </Cell>
                        </Cells>
                        <CellsTitle>献血反应</CellsTitle>
                        <Cells>
                            <Cell onClick={this.clickHander.bind(this,'/my/reaction')}>
                                <CellHeader>
                                    <img src={iconReaction} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
                                </CellHeader>
                                <CellBody>
                                    献血反应提交记录
                                </CellBody>
                                <CellFooter>
                                </CellFooter>
                            </Cell>
                        </Cells>
                        <CellsTitle>用血报销</CellsTitle>
                        <Cells>
                            <Cell onClick={this.clickHander.bind(this,'/my/reimburse')}>
                                <CellHeader>
                                    <img src={iconReimburse} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
                                </CellHeader>
                                <CellBody>
                                    我的申请
                                </CellBody>
                                <CellFooter>
                                </CellFooter>
                            </Cell>
                            <Cell onClick={this.clickHander.bind(this,'/my/reimburseprogress')}>
                                <CellHeader>
                                    <img src={iconReinburseprogress} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
                                </CellHeader>
                                <CellBody>
                                    报销进度
                                </CellBody>
                                <CellFooter>
                                </CellFooter>
                            </Cell>
                        </Cells>
                    </div>
                    
                </TabBody>
                <TabBar>
                    <TabBarItem
                        active={this.state.tab == 0}
                        onClick={e=>this.setState({tab:0})}
                        icon={<img src={IconHome}/>}
                        label="主页"
                    />
                    <TabBarItem
                        active={this.state.tab == 1}
                        onClick={e=>this.setState({tab:1})}
                        icon={<img src={IconUser}/>}
                        label="我的"
                    />
                </TabBar>
            </Tab>
        );
    }

    
}

export default Home;