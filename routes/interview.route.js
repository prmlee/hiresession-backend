const express = require('express');
const {check} = require('express-validator/check');
const InterviewController = require('../controllers/InterviewController');
const { isLoggedCandidate, isLoggedEmployer } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/create')
    .post(

        InterviewController.createInterview
    );

router
    .route('/changeStatus')
    .put(
        isLoggedEmployer,

        [check('id').exists().isInt(), check('status').exists().isInt()],
        InterviewController.changeStatus
    );

router
    .route('/updateEmployeeNote')
    .put(
        isLoggedEmployer,

        [check('id').exists().isInt(), check('employeeNote').exists()],
        InterviewController.updateEmployeeNote
    );

router
    .route('/changeCronStatus')
    .get(InterviewController.changeCronStatus);

router
    .route('/changeRating')
    .put(
        isLoggedEmployer,
        [check('id').exists().isInt(), check('rating').exists().isInt()],
        InterviewController.changeRating
    );

router
    .route('/changeNotes')
    .put(
        isLoggedEmployer,
        [check('id').exists().isInt(), check('notes').exists()],
        InterviewController.changeNotes
    );

module.exports = router;
