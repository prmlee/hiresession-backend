const jwt = require('jsonwebtoken');
const config = require('../config');
const tokenExpiration = 7;

const Roles = Object.freeze({
  customer: 0,
  admin: 1
});

function createToken(email, firstName, lastName, role) {
  return new Promise((resolve, reject) => {
    const userObj = {email, firstName, role};
    if(lastName) {
      userObj.lastName = lastName;
    }
    jwt.sign(userObj, config.jwtSecret, {expiresIn: `${tokenExpiration} days`}, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function createResetPassToken(email) {
  return new Promise((resolve, reject) => {
    jwt.sign({email}, config.jwtSecret, {expiresIn: '1d'}, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
      if (err || !decodedToken) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
}

module.exports = {createToken, createResetPassToken, verifyToken, Roles};
