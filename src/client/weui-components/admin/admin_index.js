import React,{ Component }  from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import 'antd/dist/antd.css';
import './admin_index.css'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import {Link} from 'react-router-dom';

class Admin extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }

    componentDidMount(){

    }
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="user" /><span>用户</span></span>}
                        >
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
                            <Menu.Item key="5">Alex</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span><Icon type="team" /><span>微信文章管理</span></span>}
                        >
                          <Menu.Item key="6"  onClick={(e)=>{
                              window.location.href = "/admin_uploadMaterial"
                          }} >新建微信文章</Menu.Item>
                            <Menu.Item key="7"  onClick={(e)=>{
                                window.location.href = "/admin_articlesList"
                            }} >微信文章列表</Menu.Item>
                            <Menu.Item key="7"  onClick={(e)=>{
                                window.location.href = "/admin_locationList"
                            }} >献血地点设置</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="9">
                            <Icon type="file" />
                            <span>File</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="header_title">淄博微信公众号后台管理系统</Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>

                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            <div>{this.props.children}</div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        淄博微信公众号
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export {Admin};