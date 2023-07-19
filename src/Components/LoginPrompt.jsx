// LoginPrompt.jsx
import React from 'react';
import { Button, Row, Col } from 'antd';

const LoginPrompt = () => (
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

export default LoginPrompt;
