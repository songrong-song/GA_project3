import React, { useEffect } from "react";
import { Button, Row, Col } from 'antd';
import { useCookies } from 'react-cookie';
import { isValidToken } from "./tokenUtils";
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.token;
    if (!token) {
      // Redirect to the login page if the token is not valid or not present
      // You can replace '/login' with the correct login page URL
      console.log(token)
      console.log(isValidToken(token))
      navigate('/login');
    }
  }, [cookies.token, navigate]);

  if (isValidToken(cookies.token)) {
    // Content for logged-in user
    return (
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <div className="container">
            <h2>Profile Page</h2>
            <p>Welcome, User!</p>
            <Button type="primary">Logout</Button>
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
