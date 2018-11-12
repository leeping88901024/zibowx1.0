import React from 'react';
import { Layout, Menu, Icon, Dropdown, Avatar } from 'antd';
 import { withRouter } from 'react-router-dom';
import styles from './RightContent.less';
import headerstyles from './Header.css';

const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Home3 extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        collapsed: false
      };
      this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
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
    console.log('you will logout ')
    this.props.history.push('/login');
}

  render() {
    const menu = (
      <Menu className={styles.menu}  selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <Sider
          style={{
            background: '#F5F5F5'
          }}
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleMenuClick}>
            <Menu.Item key="/testhome3">
                <Icon type="file" />
                <span>主页</span>
            </Menu.Item>
            <SubMenu key="sub33" title={<span><Icon type="team" /><span>管理</span></span>}>
                <Menu.Item key="/localusers">用户</Menu.Item>
                
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff', with: '100%' }} className={headerstyles.fixedHeader}>
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
                      }}>admin</span>
                    </span>
                  </Dropdown>
                ) : (
                  <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                )}
                </div>
             </div>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {this.props.children}
          </Content>
        </Layout>
        </Layout>
    );
  }
}

export default withRouter(Home3);