import React, { useEffect, useState } from "react";
import { Button, Row, Col } from 'antd';
import { useCookies } from 'react-cookie';
import { isValidToken } from "./tokenUtils";
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken'; // Import jwt library


export default function ProfilePage() {
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); 


  useEffect(() => {
    const token = cookies.token;
    if (!token) {
      console.log(token)
      console.log(isValidToken(token))
      navigate('/login');
    }
    else {
      const decodedToken = jwt.decode(token);
      setUserName(decodedToken.name);
    }
  }, [cookies.token, navigate]);

  if (isValidToken(cookies.token)) {
    // Content for logged-in user
    return (
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <div className="container">
            <h2>Profile Page</h2>
            <p>Welcome, {userName}!</p>
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
