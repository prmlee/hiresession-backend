const express = require('express');
const {check} = require('express-validator/check');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/register')
  .post(
    AuthController.register
  );


module.exports = router;
