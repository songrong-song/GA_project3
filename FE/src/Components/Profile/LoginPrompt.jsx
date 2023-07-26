import React from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "antd";

const LoginPrompt = () => (
  <Row justify="center">
    <Col xs={24} sm={20} md={16} lg={12} xl={8}>
      <div className="container">
        <h2>Profile Page</h2>
        <p>You need to be logged in to use this function.</p>
        <Button type="primary" href="/login">
          Login
        </Button>
        <br />
        <br />

        <Button type="default">
          <Link to="/home">Back to Home</Link>
        </Button>
      </div>
    </Col>
  </Row>
);

export default LoginPrompt;
