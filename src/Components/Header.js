import React, { useState, useContext } from 'react';
import { Menu, message } from 'antd';
import { UserAddOutlined, AppstoreOutlined, SettingOutlined, LogoutOutlined, UserOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './auth/AuthProvider'; // Import AuthContext from the AuthProvider file

const Header = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
  const { logoutSuccess, getUserFromToken } = useContext(AuthContext); // Use AuthContext from the AuthProvider
  const user = getUserFromToken();

  const handleClick = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys([key]);
    }
  };

  const handleLogout = () => {
    logoutSuccess();
    message.success('Logout successful');
  };

  return (
    <Menu mode="horizontal" selectedKeys={selectedKeys} style={{ justifyContent: 'flex-end' }}>
      <Menu.Item key="/" icon={<HomeOutlined />} className={location.pathname === '/' ? 'selected' : ''} onClick={() => handleClick('/')}>
        <Link to="/">Home</Link>
      </Menu.Item>
      {user ? (
        <Menu.Item key="/profile" icon={<UserOutlined />} className={location.pathname === '/profile' ? 'selected' : ''} onClick={() => handleClick('/profile')}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="/login" icon={<LoginOutlined />} className={location.pathname === '/login' ? 'selected' : ''} onClick={() => handleClick('/login')}>
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="/register" icon={<UserAddOutlined />} className={location.pathname === '/register' ? 'selected' : ''} onClick={() => handleClick('/register')}>
            <Link to="/register">Register</Link>
          </Menu.Item>
        </>
      )}
      {user && (
        <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      )}
    </Menu>
  );
};

export default Header;
