const { verifyToken, Roles } = require('../helpers/JwtHelper');
const httpStatus = require('http-status');
const {User} = require('../models');

function isLoggedEmployer(req, res, next) {
  isLoggedUser(Roles.employer, req, res, next);
}

function isLoggedCandidate(req, res, next) {
  isLoggedUser(Roles.candidate, req, res, next);
}


function isLoggedAdmin(req, res, next) {
  isLoggedUser(Roles.admin, req, res, next);
}

async function isLoggedUser(role, req, res, next) {
  if(req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try{
      const decodedToken = await verifyToken(token);
      if(decodedToken && decodedToken.role === role){
      console.log(decodedToken.email);
        const user = await User.findOne({
          email:decodedToken.email,
          raw:true
        });

        if(!user){
          return  res
              .status(httpStatus.UNAUTHORIZED)
              .json({authorization: [{message: 'Unauthorized'}]});
        }

        res.locals.user = user;
        next();
      }
    }catch (err) {
      return  res
          .status(httpStatus.UNAUTHORIZED)
          .json({authorization: [{msg: err ? err.message : 'Unauthorized'}]});
    }
  } else {
    res
        .status(httpStatus.UNAUTHORIZED)
        .json({authorization: [{msg: 'Unauthorized'}]});
  }
}

module.exports = {isLoggedEmployer, isLoggedCandidate, isLoggedAdmin};
