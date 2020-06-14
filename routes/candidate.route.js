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

router
    .route('/getLoggedInUser')
    .get(
        isLoggedCandidate,
        CandidateController.getLoggedInUser
    );

router
    .route('/getSingleEmployee/:id')
    .get(
        isLoggedCandidate,
        CandidateController.getSingleEmployee
    );

router
    .route('/getCompanies')
    .get(
        isLoggedCandidate,
        CandidateController.getCompanies
    );

router
    .route('/addFavorit')
    .post(
        [
      check('employeeId').exists().isInt()
        ],
        isLoggedCandidate,
        CandidateController.addFavorit
    );

router
    .route('/getFavorit')
    .get(
        isLoggedCandidate,
        CandidateController.getFavorit
    );

router
    .route('/deleteFavorit/:employeeId')
    .delete(
        isLoggedCandidate,
        CandidateController.deleteFavorit
    );

router
    .route('/getTimesForDay/:employeeId/:date/:eventId')
    .get(
        isLoggedCandidate,
        CandidateController.getTimesForDay
    );

router
  .route('/getInterviews/:page?')
  .get(
    isLoggedCandidate,
    CandidateController.getInterviews
  );

router
    .route('/interviews/:id')
    .patch(
        isLoggedCandidate,
        CandidateController.updateInterview
    );

router
  .route('/interviews/:id')
  .delete(
    isLoggedCandidate,
    CandidateController.deleteInterview
  );

module.exports = router;
