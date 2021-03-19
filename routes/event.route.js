const express = require('express');
const {check} = require('express-validator/check');
const eventController = require('../controllers/EventController');
const { isLoggedAdmin } = require('../middlewares/auth');

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

router
	.route("/getEventsByCode")
	.post(
		isLoggedAdmin,
		eventController.getEventsByCode
	);


module.exports = router;
