import React, { useEffect, useState } from "react";
import { Button, Row, Col } from 'antd';
import { useCookies } from 'react-cookie';
import { isValidToken } from "./tokenUtils";
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import "./ProfilePage.css";

export default function ProfilePage() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); 

  useEffect(() => {
    const token = cookies.token;
    console.log("checkpoint2")
    console.log(isValidToken(token))
    if (token && isValidToken(token)) {
      const decodedToken = jwt.decode(token);
      setUserName(decodedToken.name);
    }
    else {
      console.log('Invalid or no token found', token);
      navigate('/loginPrompt');
    }
  }, [cookies.token, navigate]);

  const handleLogout = () => {
    removeCookie('token');
    navigate('/home')
  };

  const handleNavigateToHistoricalPage = () => {
    // Redirect the user to the historical page when the button is clicked
    navigate('/my-saved-trip');
  };

  if (cookies.token && isValidToken(cookies.token)) {
    const decodedToken = jwt.decode(cookies.token);
    console.log(decodedToken)
    // Content for logged-in user
    return (
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <div className="container">
            <h2>Profile Page</h2>
            <p>Welcome, {decodedToken.userName}!</p>
            <div className="prompt">
              <p>What do you want to do?</p>
              <br/>
            <div className = "options">
              <div className="optionItems">
              <p> &#x1F6A2; Check your past itinerary:</p>
              <Button className="ProfileButton" type="primary" onClick={handleNavigateToHistoricalPage}>View Itinerary</Button>
              </div>
            </div >
            <div className="optionItems"> 
            <p> &#x1F6A2; Log out:</p>
            <Button className="ProfileButton" type="primary" onClick={handleLogout}>Logout</Button>
            </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  } else {
    // Content for logged-out user
    navigate('/loginPrompt');
    return null; // or you can return some placeholder content here
  }
}
