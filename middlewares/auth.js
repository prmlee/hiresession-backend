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

        const user = await User.findOne({
          where: {
            email: decodedToken.email
          },
          raw:true
        });

        if(!user){
          return  res
              .status(httpStatus.UNAUTHORIZED)
              .json({authorization: [{message: 'Unauthorized'}]});
        }

        res.locals.user = user;
        next();
      }else{
        res
            .status(httpStatus.UNAUTHORIZED)
            .json({authorization: [{message:  'Unauthorized'}]});
      }
    }catch (err) {
      return  res
          .status(httpStatus.UNAUTHORIZED)
          .json({authorization: [{message: err ? err.message : 'Unauthorized'}]});
    }
  } else {
    res
        .status(httpStatus.UNAUTHORIZED)
        .json({authorization: [{message: 'Unauthorized'}]});
  }
}

async function isUserLoggedIn(req, res, next) {
  if(req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];

    try{
      const decodedToken = await verifyToken(token);
      if(decodedToken){

        const user = await User.findOne({
          where: {
            email: decodedToken.email
          },
          raw:true
        });

        if(!user){
          return  res
              .status(httpStatus.UNAUTHORIZED)
              .json({authorization: [{message: 'Unauthorized'}]});
        }

        res.locals.user = user;
        next();
      }else{
        res
            .status(httpStatus.UNAUTHORIZED)
            .json({authorization: [{message:  'Unauthorized'}]});
      }
    }catch (err) {
      return  res
          .status(httpStatus.UNAUTHORIZED)
          .json({authorization: [{message: err ? err.message : 'Unauthorized'}]});
    }
  } else {
    res
        .status(httpStatus.UNAUTHORIZED)
        .json({authorization: [{message: 'Unauthorized'}]});
  }
}

module.exports = {isLoggedEmployer, isLoggedCandidate, isLoggedAdmin, isUserLoggedIn};
