const express = require('express');
const {check} = require('express-validator/check');
const EmployeeController = require('../controllers/EmployeeController');
const { isLoggedEmployer } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/profile')
    .patch(
        isLoggedEmployer,
        EmployeeController.profile
    );


router
    .route('/updateSettings')
    .patch(
        [
            check('id').exists().isInt(),
        ],
        isLoggedEmployer,
        EmployeeController.updateSettings
    );

router
    .route('/settings')
    .post(
        isLoggedEmployer,
        [
            check('date').exists(),
            check('startTimeFrom').exists(),
            check('startTimeTo').exists(),
            check('endTimeFrom').exists(),
            check('endTimeTo').exists(),
            check('duration').exists(),
            check('durationType').exists(),
        ],
        EmployeeController.settings
    );

router
    .route('/getSettings')
    .get(
        isLoggedEmployer,
        EmployeeController.getSettings
    );

module.exports = router;
