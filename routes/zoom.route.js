const express = require('express');
const {check} = require('express-validator/check');
const zoomController = require('../controllers/ZoomController');

const router = express.Router();

	
router
	.route('/subscription')
	.post(zoomController.subscription
	);


module.exports = router;
