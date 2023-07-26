import jwt from 'jsonwebtoken';


export const isValidToken = (token) => {


  try {
    console.log(process.env.REACT_APP_JWT_SECRET)

    const decodedToken = jwt.decode(token);

    return decodedToken.exp > Date.now() / 1000; // Check if the token expiration is greater than the current time
  } catch (error) {
    console.log('Token verification failed:', error.message);
    // return false; // Token verification failed
  }
};
