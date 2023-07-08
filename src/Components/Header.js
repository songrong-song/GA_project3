import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserAddOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const handleClick = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys([key]);
    }
  };

  return (
    <Menu mode="horizontal" selectedKeys={selectedKeys} style={{ justifyContent: 'flex-end' }}>
      <Menu.Item key="/" icon={<HomeOutlined />} className={location.pathname === '/' ? 'selected' : ''} onClick={() => handleClick('/')}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="/login" icon={<LoginOutlined />} className={location.pathname === '/login' ? 'selected' : ''} onClick={() => handleClick('/login')}>
        <Link to="/login">Login</Link>
      </Menu.Item>
      <Menu.Item key="/register" icon={<UserAddOutlined />} className={location.pathname === '/register' ? 'selected' : ''} onClick={() => handleClick('/register')}>
        <Link to="/register">Register</Link>
      </Menu.Item>
      {/* Add other menu items here */}
    </Menu>
  );
};

export default App;
