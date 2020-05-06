const express = require('express');
const {check} = require('express-validator/check');
const InterviewController = require('../controllers/InterviewController');
const { isLoggedCandidate, isLoggedEmployer } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/create')
    .post(
        [
            check('employeeId').exists().isInt(), check('eventId').exists().isInt(), check('candidateId').exists().isInt(), check('date').exists(), check('startTime').exists(), check('endTime').exists()
        ],
        isLoggedCandidate,
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
    .route('/changeRating')
    .put(
        isLoggedEmployer,
        [check('id').exists().isInt(), check('rating').exists().isInt()],
        InterviewController.changeRating
    );

module.exports = router;
