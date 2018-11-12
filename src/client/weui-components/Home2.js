import React from 'react';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
import styles from './RightContent.less';
import headerstyles from './Header.css';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Home2 extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        collapsed: false,
        userinfo: []
      };
      this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  componentDidMount() {
    //this.setState({username: '1179320194@qq.com'})
    fetch(
      '/db/userinfo_local',
      {
        method: 'get',
        headers: {
          accept: 'application/json'
        }
      }
    ).then(res => res.json())
     .then(json => {
       //console.log(json);
       if(json.message.id) {
         this.setState({userinfo: json.message.content});
       } else {
         this.props.history.push(json.message.content);
       }
     });
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleMenuClick(item) {
    if(item.key == 'logout') {
      this.handleLogout();
      return;
    }
    this.props.history.push(item.key);
  }

  handleLogout() {
    // console.log('you will logout....');
    fetch(
        '/loginlocal/logout',
        {
            method: 'get',
            headers: {
                accept: 'application/json'
            }
        }
    ).then(res => res.json())
     .then(json => {
         // console.log(json);
         this.props.history.push(json.redirect);
     })
}

  render() {
    const menu = (
      <Menu className={styles.menu}  selectedKeys={[]} onClick={this.handleMenuClick}>
        {/*
        <Menu.Item key="userCenter">
          <Icon type="user" />
          个人信息
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          设置
        </Menu.Item>
        */}
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{width:'100%',height:'100%'}} >
          <Header style={{ padding: 0, background: '#0099cb', with: '100%' }} className={headerstyles.fixedHeader}>
              {/* header */}
              <div className={styles.header}>
                  {/* left content */}
                  <div style={{ float: 'left'}}>
                      <Icon
                          className="trigger"
                          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                          onClick={this.toggle}
                      />
                  </div>
                  {/*center content*/}
                  <div style={{display:'inline-block',marginLeft:'30vw',fontSize:'24px'}}>微信献血公众服务系统后台管理系统</div>
                  {/* right content */}
                  <div className={styles.right} style={{
                      float: 'right',
                      height: '100%',
                      overflow: 'hidden',
                      paddingRight: 100
                  }}>
                      {'yyyyy' ? (
                          <Dropdown overlay={menu} size="large">
                    <span style={{
                        cursor: 'pointer',
                        padding: '0 12px',
                        display: 'inline-block',
                        transition: 'all 0.3s',
                        height: '100%',
                    }}>
                      <Avatar style={{
                          //height: '64px',
                          lineHeight: '58px',
                          verticalAlign: 'center',
                          display: 'inline-block',
                          //padding: '0 0 0 24px',
                          cursor: 'pointer',
                          fontSize: '20px'
                      }}
                              size="large"
                              className={styles.avatar}
                              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                              alt="avatar"
                      />
                      <span style={{
                          fontSize: '15px',
                          height: '64px',
                          cursor: 'pointer',
                          verticalAlign: 'center',
                          transition: 'all 0.3s, padding 0s',
                          padding: '10px 14px 0 0',
                      }}>{this.state.userinfo[1]}</span>
                    </span>
                          </Dropdown>
                      ) : (
                          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                      )}
                  </div>
              </div>
          </Header>
        <Layout >
            <Sider
                style={{
                    background: '#f0f2f5',
                }}
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
            >
                {<div className="logo" style={{height:'24px'}} />}
                <Menu style={{background: '#fff', height:'96%'}} theme="light" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleMenuClick}>
                    <Menu.Item key="/testhome2">
                        <Icon type="file" />
                        <span>主页</span>
                    </Menu.Item>
                    <SubMenu key="sub3" title={<span><Icon type="team" /><span>志愿者</span></span>}>
                        <Menu.Item key="/updateperiod">预约服务人数</Menu.Item>
                    </SubMenu>
                    {/*
            <SubMenu key="sub4" title={<span><Icon type="file" /><span>微信文章</span></span>}>
                <Menu.Item key="/admin_articlesList">微信文章列表</Menu.Item>
                <Menu.Item key="/admin_uploadMaterial">新建微信文章</Menu.Item>
                <Menu.Item key="/admin_wxArticlesLook">预览</Menu.Item>
                <Menu.Item key="/admin_perMaterialsList">素材列表</Menu.Item>
            </SubMenu>
            */}
                    <SubMenu key="sub5" title={<span><Icon type="file" /><span>采血点设置</span></span>}>
                        <Menu.Item key="/admin_locationList">采血点列表</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              {this.props.children}
             </Content>
        </Layout>
        </Layout>
    );
  }
}

export default withRouter(Home2);