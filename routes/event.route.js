const express = require('express');
const {check} = require('express-validator/check');
const eventController = require('../controllers/EventController');


const router = express.Router();

router
    .route('/get')
    .get(
        eventController.getEvent
    );

router
    .route('/simpleGet')
    .get(
        eventController.simpleGetEvents
    );

router
    .route('/simpleGetOne')
    .post(
        eventController.simpleGetOne
    );

module.exports = router;
