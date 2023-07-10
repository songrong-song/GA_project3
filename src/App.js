import React, { useState, useNavigate, useEffect } from 'react';
import { BrowserRouter as Navigate, Routes, Route } from 'react-router-dom';
import PathOne from './Components/PathOne';
import ItineraryGenerator from './pages/Itinerary';
import { ItineraryProvider } from './Components/ItineraryContext';
import Register from './Components/RegisterPage';
import Login from './Components/LoginPage'
import Guest from './Components/auth/GuestOnly';
import ProfilePage from './Components/ProfilePage';
import jwt from 'jsonwebtoken';

// PrivateRoute component
const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Check if the token exists and is valid
  if (!token || !isValidToken(token)) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

// Helper function to validate token expiration
const isValidToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.exp > Date.now() / 1000; // Check if the token expiration is greater than the current time
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
    const token = localStorage.getItem('token');
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
          {!isLoggedIn && <Route path="/" element={<Login />} />}
          {isLoggedIn && <PrivateRoute path="/" component={PathOne} />}
          <Route path="/generator" element={<ItineraryGenerator />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/guest" element={<Guest component={PathOne} />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/mytrips" element={</MyTrip />} /> */}
        </Routes>
    
      </ItineraryProvider>
  );
}

export default App;
