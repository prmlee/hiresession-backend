const express = require('express');
const stripeController = require('../controllers/StripeController');
const { isLoggedAdmin,isLoggedEmployer} = require('../middlewares/auth');

const router = express.Router();


router
    .route('/getTicketTypesByEvent')
    .post(
        isLoggedEmployer,
        stripeController.createPaymentIntent
    )

module.exports = router;
