import React, { useContext } from 'react';
import jwt from 'jsonwebtoken';
export const isValidToken = (token) => {
  console.log("JWT");
  console.log(process.env.REACT_APP_JWT_SECRET);
  const jwt = require('jsonwebtoken');
  //try {
    const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    return decodedToken.exp > Date.now() / 1000; // Check if the token expiration is greater than the current time
 /* } catch (error) {
    return false; // Token verification failed
    console.log('token verification failed')
  }*/
};
