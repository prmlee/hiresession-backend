const express = require('express');
const stripeController = require('../controllers/StripeController');
const { isLoggedAdmin,isLoggedEmployer} = require('../middlewares/auth');

const router = express.Router();


router
    .route('/createPaymentIntent')
    .post(
        isLoggedEmployer,
        stripeController.createPaymentIntent
    );

router
    .route('/completePayment')
    .post(
        isLoggedEmployer,
        stripeController.completePayment
    )

module.exports = router;
