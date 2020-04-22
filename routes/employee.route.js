const express = require('express');
const {check} = require('express-validator/check');
const EmployeeController = require('../controllers/EmployeeController');
const { isLoggedEmployer } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/settings')
    .patch(
        isLoggedEmployer,
        EmployeeController.settings
    );

module.exports = router;
