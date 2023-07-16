import jwt from 'jsonwebtoken';

export const isValidToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.exp > Date.now() / 1000; // Check if the token expiration is greater than the current time
  } catch (error) {
    return false; // Token verification failed
    console.log('token verification failed')
  }
};
