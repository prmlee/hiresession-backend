const express = require('express');
const {check} = require('express-validator/check');
const adminController = require('../controllers/AdminController');
const { isLoggedAdmin } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/createEvent')
    .post(
        isLoggedAdmin,
        adminController.createEvent
    );


router
    .route('/updateEvent')
    .patch(
        isLoggedAdmin,
        adminController.updateEvent
    );

router
    .route('/getLoggedInAdmin')
    .get(
        isLoggedAdmin,
        adminController.getLoggedInAdmin
    );


module.exports = router;
