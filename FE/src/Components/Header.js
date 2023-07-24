import React, { useState, useContext, useEffect } from 'react';
import { Menu, message, Dropdown } from 'antd';
import { UserOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthProvider'; // Import AuthContext from the AuthProvider file
import './Header.css';
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import LogoImage from './Images/LogoImage.svg';


const Header = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const { logoutSuccess } = useContext(AuthContext); // Use AuthContext from the AuthProvider
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const navigate = useNavigate();
  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location]);

  const handleClick = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys([key]);
    }
  };

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    localStorage.clear();
    logoutSuccess();
    message.success('Logout successful');
    navigate('/home')

  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="/profile" icon={<UserOutlined />} className={location.pathname === '/profile' ? 'selected' : ''}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const token = Cookies.get('token');

  return (
    <header className="header">
    <div className="logo-container">
    <img src={LogoImage} alt="Logo" className="logo" />
    </div>
    <Menu mode="horizontal" selectedKeys={selectedKeys} style={{ justifyContent: 'flex-end' }}>

      <Menu.Item key="/home" icon={<HomeOutlined />} className={location.pathname === '/home' ? 'selected' : ''} onClick={() => handleClick('/home')}>
        <Link to="/home">Home</Link>
      </Menu.Item>
      <Menu.Item key="/my-saved-trip" className={location.pathname === '/my-saved-trip' ? 'selected' : ''} onClick={() => handleClick('/my-saved-trip')}>
        <Link to="/my-saved-trip">My Saved Trip</Link>
      </Menu.Item>
      {token ? (
        <Menu.Item key="/profile" className={location.pathname === '/profile' ? 'selected' : ''}>
          <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
            <Link to="/profile">
              <span className="nav-text">Profile</span>
            </Link>
          </Dropdown>
        </Menu.Item>
      ) : (
        <Menu.Item key="/login" className={location.pathname === '/login' ? 'selected' : ''}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
    </header>
  );
};

export default Header;
