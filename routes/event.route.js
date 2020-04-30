const express = require('express');
const {check} = require('express-validator/check');
const eventController = require('../controllers/EventController');


const router = express.Router();

router
    .route('/get')
    .get(
        eventController.getEvent
    );

module.exports = router;
