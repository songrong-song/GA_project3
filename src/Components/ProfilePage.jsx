import React, { useContext } from "react";
import { AuthContext } from './auth/AuthProvider';
import { Button, Row, Col } from 'antd';

export default function ProfilePage() {
  const { getUserFromToken, logoutSuccess } = useContext(AuthContext);
  const user = getUserFromToken();

  const handleLogout = () => {
    logoutSuccess();
  };

  if (user) {
    // Content for logged-in user
    return (
    <Row justify="center">
    <Col xs={24} sm={20} md={16} lg={12} xl={8}>
      <div className="container">
        <h2>Profile Page</h2>
        <p>Welcome, {user.name}!</p>
        <Button type="primary" danger onClick={handleLogout}>Logout</Button>
      </div>
      </Col>
      </Row>
    );
  } else {
    // Content for logged-out user
    return (
        <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
      <div className="container">
        <h2>Profile Page</h2>
        <p>You need to be logged in to view this page.</p>
        <Button type="primary" href="/login">Login</Button>
        <Button type="default" href="/">Back to Home</Button>
      </div>
      </Col>
      </Row>
    );
  }
}
