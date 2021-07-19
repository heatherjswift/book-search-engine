// // code from 21.2 auth.js
// import decode from 'jwt-decode';

// class AuthService {
//   // retrieve data saved in token
//   getProfile() {
//     return decode(this.getToken());
//   }

//   // check if the user is still logged in
//   loggedIn() {
//     // Checks if there is a saved token and it's still valid
//     const token = this.getToken();
//     // use type coersion to check if token is NOT undefined and the token is NOT expired
//     return !!token && !this.isTokenExpired(token);
//   }

//   // check if the token has expired
//   isTokenExpired(token) {
//     try {
//       const decoded = decode(token);
//       if (decoded.exp < Date.now() / 1000) {
//         return true;
//       } else {
//         return false;
//       }
//     } catch (err) {
//       return false;
//     }
//   }

//   // retrieve token from localStorage
//   getToken() {
//     // retrieves the user token from localStorage
//     return localStorage.getItem('id_token');
//   }

//   // set toekn to localStorage and reload page to homepage
//   login(idToken) {
//     // saves user token to localstorage
//     localStorage.setItem('id_token', idToken);

//     window.location.assign('/');
//   }

//   // clear token from localStorage and force logout with reload
//   logout() {
//     // clear user token and profile data from localStorage
//     localStorage.removeItem('id_token');
//     // this will reload the page and reset the state of the application
//     window.location.assign('/');
//   }
// }

// export default new AuthService();


// provided auth.js code

const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
