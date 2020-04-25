const express = require('express');
const {check} = require('express-validator/check');
const CandidateController = require('../controllers/CondidateController');
const { isLoggedCandidate } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/profile')
    .patch(
        isLoggedCandidate,
        CandidateController.profile
    );


router
    .route('/sheduleInterview')
    .patch(
        isLoggedCandidate,
        CandidateController.sheduleInterview
    );


module.exports = router;
