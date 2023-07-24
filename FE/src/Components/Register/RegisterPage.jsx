import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form, Input, Col, Row, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import React from "react";
import Header from "../Header/Header";
import "./RegisterPage.css";

export default function Register() {
  const navigate = useNavigate();

  // create state to store form data
  const [formData, setFormData] = useState({});
  const [lastMessage, setLastMessage] = useState(null); // State for the last message

  const handleFormChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/users/register", formData)
      .then((response) => {
        message.success("Registration successful!");
        console.log(response.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        // message.error('Registration failed. Please try again.');
      });
  };

  return (
    <div className="container">
      <Header activeMenu="register" />

      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <h2>Register</h2>

          <Form onFinish={handleSubmit}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Name"
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                onChange={(e) => handleFormChange("email", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                  message:
                    "Password must contain at least one lowercase letter, one uppercase letter, and one digit",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                onChange={(e) => handleFormChange("password", e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <span className="login-link">
                Already have an account? <Link to="/login"> Login </Link>
              </span>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
