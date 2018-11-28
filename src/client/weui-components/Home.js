import React from 'react';
//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import { Tab, TabBarItem, CellsTitle ,TabBody,TabBar,
    Cells,Cell,CellHeader,CellBody,Dialog,CellFooter,Grids } from 'react-weui';
import IconHome from '../img/home.png';
import IconUser from '../img/user.png';
import IconApply from '../img/apply.png';
import IconExamination from '../img/examination.png';
import IconReservationServce from '../img/reservation_services.png';
import iconMyReinburse from '../img/myreinburse.png';
import iconReserv from '../img/reservation_services.png';
import iconReaction from '../img/reaction.png';
import iconReimburse from '../img/reinburse.png';
import iconReinburseprogress from '../img/progress.png';
import iconyuyue from '../img/yuyue.png';
import iconchazha from '../img/chazhaxianxuedian.png';
import iconjiance from '../img/jiancejieguo.png';
import jilu from '../img/jianlu.png';

class  Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0,
            userinfo: [],
            tmpdata: [],
            show: false,
            style: {
                title: "提示",
                buttons: [
                    {
                        label: '确认',
                        onClick: this.handleDialogClick.bind(this)
                    }
                ],
                show_content: '',
            },
        };
        // this.clickHander = this.clickHander.bind(this);
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
        // {
        //     icon: <img src={iconReimburse} />,
        //     label: '登录',
        //     href: 'javascript:;',
        //     onClick: this.clickHander.bind(this,'/login')
        // },
        {
            icon: <img src={iconyuyue} />,
            label: '献血预约',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/locationNavigation')
        },
        {
            icon: <img src={iconchazha} />,
            label: '查找献血点',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/locationNavigation')
        },
        {
            icon: <img src={iconjiance} />,
            label: '检测结果',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/testResult')
        },
        {
            icon: <img src={jilu} />,
            label: '献血记录',
            href: 'javascript:;',
            onClick: this.clickHander.bind(this,'/donRecord')
        }
    ];

    handleDialogClick() {
        this.setState({ show: false });
   }

    clickHander(url) {
        // console.log(`the voluntee status is ${this.state.userinfo[3]}`)
        if (url == '/volunteer/examination' || url == '/locations') {
            if (this.state.userinfo[3] == null) {
                // console.log('you want to exemination...')
                this.setState({show_content: <font size="3" color="red">你还没有申请志愿，请申请志愿后进入考试</font>});
                this.setState({show: true});
                return;
            }
            // 已经提交志愿者申请表单，但没有完成考试
            if (url == '/locations' && this.state.userinfo[3] == 1) {
                this.setState({show_content: <font size="3" color="red">你没有通过考试，请先通过考试再进行预约志愿服务</font>});
                this.setState({show: true});
                return;
            }
        } 
        this.props.history.push(url);
    }

    componentDidMount() {

        fetch(
            '/db/userinfo-h',
            {
                method: 'get',
                credentials: "include",
                headers: {
                    accept: 'application/json'
                },
            }
        ).then(res => res.json())
         .then(json => {
             // console.log(`the user info is ${json.userinfo}`);
             if(!json.userinfo) {
                  this.props.history.push('/requestWxAuth?comeFromRouter=/home');
                 return;
             }
             // 用户显示个人信息
             this.setState({userinfo: json.userinfo});
             // 根据 用户个人信息来对菜单进行过滤
            switch (json.userinfo[3]) {
                case null:
                    this.setState({tmpdata: this.gridsdata})
                    break;
                case 1:
                    this.setState({tmpdata: this.gridsdata.filter( x => x.label != '志愿者申请')})
                    break;
                case 2:
                this.setState({tmpdata: this.gridsdata.filter( x => x.label != '志愿者申请' && x.label != '志愿者考试')})
                    break;
                default:
                    break;
            }
         })

    }

    render() {
        return (
            <Tab>
                <TabBody>
                    <Grids style={{display: this.state.tab == 0 ? null : 'none'}} data={this.state.tmpdata} />
                    <div style={{display: this.state.tab == 1 ? null : 'none'}} >
                        <Cells>
                            <Cell>
                                <CellHeader style={{ position: 'relative', marginRight: '10px' }}>
                                    <img src={this.state.userinfo[1]} style={{ width: '50px', display: 'block' }} />
                                </CellHeader>
                                <CellBody>
                                    <div>
                                    {this.state.userinfo[0]}
                                    <br/>
                                    {this.state.userinfo[2]}
                                    </div>
                                </CellBody>
                            </Cell>
                        </Cells>
                        <CellsTitle>志愿服务</CellsTitle>
                        <Cells>
                            {/*
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
                            */}
                            <Cell onClick={this.clickHander.bind(this,'/my/volunteer/reserv')}>
                                <CellHeader>
                                    <img src={iconReserv} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
                                </CellHeader>
                                <CellBody>
                                    预约服务
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
                                    献血反应
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
                                    报销申请
                                </CellBody>
                                <CellFooter>
                                </CellFooter>
                            </Cell>
                            {/*
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
                            */}
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
                <Dialog 
                type="ios" title={this.state.style.title} 
                show={this.state.show}
                buttons={this.state.style.buttons} >
                <div>
                  {this.state.show_content}
                </div>
              </Dialog>
            </Tab>
        );
    }

    
}

export default Home;