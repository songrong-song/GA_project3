import React from 'react';
import { Menu } from 'antd';
import { UserAddOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


const App = () => (
  <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ justifyContent: 'flex-end' }}>
    <Menu.Item key="home" icon={<HomeOutlined />}>
    <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Item key="login" icon={<LoginOutlined />}>
    <Link to="/login">Login</Link>
    </Menu.Item>
    <Menu.Item key="useradd" icon={<UserAddOutlined />}>
    <Link to="/register">Register</Link>
    </Menu.Item>
    {/* <Menu.SubMenu key="SubMenu" title="Navigation Two - Submenu" icon={<SettingOutlined />}>
      <Menu.Item key="two" icon={<AppstoreOutlined />}>
        Navigation Two
      </Menu.Item>
      <Menu.Item key="three" icon={<AppstoreOutlined />}>
        Navigation Three
      </Menu.Item>
      <Menu.ItemGroup title="Item Group">
        <Menu.Item key="four" icon={<AppstoreOutlined />}>
          Navigation Four
        </Menu.Item>
        <Menu.Item key="five" icon={<AppstoreOutlined />}>
          Navigation Five
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu.SubMenu> */}
  </Menu>
);

export default App;