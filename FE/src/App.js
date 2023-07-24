import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import PathOne from './Components/PathOne';
import ItineraryGenerator from './pages/Itinerary';
import { ItineraryProvider } from './Components/ItineraryContext';
import Register from './Components/RegisterPage';
import LoginPrompt from './Components/LoginPrompt.jsx'
import Login from './Components/LoginPage'
import Guest from './Components/auth/GuestOnly';
import ProfilePage from './Components/ProfilePage';
import jwt from 'jsonwebtoken';
import MySavedTrip from './Components/MySavedTrip';
import Cookies from 'js-cookie';
import dotenv from 'dotenv';
dotenv.config();
// PrivateRoute component
const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');

  // Check if the token exists and is valid
  if (!token || !isValidToken(token)) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

// Helper function to validate token expiration
const isValidToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    // return decodedToken.exp > Date.now() / 1000; // Check if the token expiration is greater than the current time
  } catch (error) {
    return false; // Token verification failed
  }
};

function App() {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

  useEffect (() => {
    const token = Cookies.get('token');
    setIsLoggedIn(token && isValidToken(token));
  }, []);


  return (
    <ItineraryProvider
      destinationValue={destinationValue}
      durationValue={durationValue}
      selectedActivities={selectedActivities}
      selectedFood={selectedFood}
    >
      <Routes>
        {!isLoggedIn && <Route path="/" element={<PathOne />} />}
        <Route path="/generator" element={<ItineraryGenerator />} />
        <Route path="/home" element={<PathOne />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loginPrompt" element={<LoginPrompt />} />
        <Route path="/login" element={<Login />} />
    
        {/* <Route path="/guest" element={<Guest component={PathOne} />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-saved-trip" element={<MySavedTrip />} />
      </Routes>
    </ItineraryProvider>
  );
}

export default App;
