const express = require('express');
const {check} = require('express-validator/check');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/register')
  .post(
    AuthController.register
  );


router
    .route('/login')
    .post(
        [check('email').isEmail(), check('password').isLength({min: 6})],
        AuthController.login
    );

router
    .route('/adminLogin')
    .post(
        [check('email').isEmail(), check('password').isLength({min: 6})],
        AuthController.adminLogin
    );

router
    .route('/resetPassEmail')
    .post(
        [check('email').isEmail()],
        AuthController.resetPassEmail
    );

router
    .route('/resetPassword')
    .put(
        [check('password').isLength({min: 6}),check('confirmPassword').isLength({min: 6}),check('token').exists()],
        AuthController.resetPassword
    );

module.exports = router;
