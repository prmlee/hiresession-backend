const express = require('express');
const dataController = require('../controllers/DataController');

const router = express.Router();


router
    .route('/getSchools')
    .get(
        dataController.getSchools
    );

module.exports = router;