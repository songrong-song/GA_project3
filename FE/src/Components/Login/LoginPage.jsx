import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import React from "react";
import Header from "../Header/Header";
import { Button, Form, Input, Col, Row, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "./LoginPage.css";
import Cookies from "js-cookie";
const jwt = require("jsonwebtoken");

export default function Login() {
  const navigate = useNavigate();
  const { loginSuccess } = useContext(AuthContext);
  const [formData, setFormData] = useState({});

  // add in the navigation with token
  useEffect(() => {
    const token = Cookies.get("token");
    const decodedToken = jwt.decode(token);
    if (decodedToken) {
      navigate("/home");
    }
  });

  const handleFormChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      loginSuccess(response.data.token);
      Cookies.set("token", response.data.token);
      if (localStorage.getItem("StartedAlready")) {
        navigate("/generator");
      } else {
        navigate("/home");
      }

      message.success("Logged in successfully!");
    } catch (error) {
      console.log(error);
      message.error("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div>
      <Header />
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <div className="form-container">
            <h2>Login to Itinerary Generator</h2>

            <Form onFinish={handleSubmit} className="login-form">
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  {
                    type: "email",
                    message: "Please enter a valid email address!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long!",
                  },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                    message:
                      "Password must contain at least one lowercase letter, one uppercase letter, and one digit!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  onChange={(e) => handleFormChange("password", e.target.value)}
                />
              </Form.Item>
              {/* 
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
              </Form.Item> */}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
                Or <Link to="/register">register now!</Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}
