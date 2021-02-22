const express = require('express');
const promoController = require('../controllers/PromoController');
const { isLoggedAdmin, isLoggedEmployer } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/createPromoCode')
    .post(
        isLoggedAdmin,
        promoController.createPromoCode
    );

router
    .route('/updatePromoCode')
    .post(
        isLoggedAdmin,
        promoController.updatePromoCode
    );

router
    .route('/getPromoCodes')
    .get(
		isLoggedAdmin,
        promoController.getPromoCodes
    );

router
    .route('/getSinglePromoCode')
    .post(
		isLoggedEmployer,
        promoController.getSinglePromoCode
    );

module.exports = router;