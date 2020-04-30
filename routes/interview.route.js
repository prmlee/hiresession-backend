const express = require('express');
const {check} = require('express-validator/check');
const InterviewController = require('../controllers/InterviewController');
const { isLoggedCandidate } = require('../middlewares/auth');

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


module.exports = router;
