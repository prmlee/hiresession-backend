const express = require('express');
const {check} = require('express-validator/check');
const adminController = require('../controllers/AdminController');
const { isLoggedAdmin } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/createEvent')
    .post(
        isLoggedAdmin,
        adminController.createEvent
    );


router
    .route('/updateEvent')
    .patch(
        isLoggedAdmin,
        adminController.updateEvent
    );

router
    .route('/getLoggedInAdmin')
    .get(
        isLoggedAdmin,
        adminController.getLoggedInAdmin
    );

router
    .route('/getCompanies')
    .post(
        isLoggedAdmin,
        adminController.getCompanies
    );

router
    .route('/getOnlyCompanies')
    .get(
        isLoggedAdmin,
        adminController.getOnlyCompanies
    );
router
    .route('/getOneCompany/:id')
    .post(
        isLoggedAdmin,
        adminController.getOneCompany
    );
router
    .route('/changeCompanyProfile/:id')
    .patch(
        isLoggedAdmin,
        adminController.changeCompanyProfile
    );
    
router
    .route('/getOneCompanyEvents/:id')
    .post(
        isLoggedAdmin,
        adminController.getOneCompanyEvents
    );

router
    .route('/getArchivedCompanies')
    .get(
        isLoggedAdmin,
        adminController.getArchivedCompanies
    );

router
    .route('/archiveCompany')
    .put(
        isLoggedAdmin,
        [check('id').exists().isInt()],
        adminController.archiveCompany
    );

router
    .route('/revertCompany')
    .put(
        isLoggedAdmin,
        [check('id').exists().isInt()],
        adminController.revertCompany
    );

router
    .route('/deleteCompany/:id')
    .delete(
        isLoggedAdmin,
        adminController.deleteCompany
    );
router
    .route('/deleteOneCompanyEvent/:id')
    .delete(
        isLoggedAdmin,
        adminController.deleteOneCompanyEvent
    );
router
    .route('/updateOneCompanyEvent')
    .post(
        isLoggedAdmin,
        adminController.updateOneCompanyEvent
    );

router
    .route('/getCandidates')
    .post(
        isLoggedAdmin,
        adminController.getCandidates
    );
router
    .route('/getOneCandidate/:id')
    .post(
        isLoggedAdmin,
        adminController.getOneCandidate
    );

router
    .route('/changeCandidateProfile/:id')
    .patch(
        isLoggedAdmin,
        adminController.changeCandidateProfile
    );


router
    .route('/getArchivedCandidates')
    .get(
        isLoggedAdmin,
        adminController.getArchivedCandidates
    );

router
    .route('/archiveCandidate')
    .put(
        isLoggedAdmin,
        [check('id').exists().isInt()],
        adminController.archiveCandidate
    );

router
    .route('/revertCandidate')
    .put(
        isLoggedAdmin,
        [check('id').exists().isInt()],
        adminController.revertCandidate
    );

router
    .route('/deleteCandidate/:id')
    .delete(
        isLoggedAdmin,
        adminController.deleteCandidate
    );

router
    .route('/activities/:page?')
    .post(
        isLoggedAdmin,
        adminController.activities
    );

router
    .route('/groups/:page?')
    .post(
        isLoggedAdmin,
        adminController.groups
    );

router
    .route('/getEvents')
    .get(
        isLoggedAdmin,
        adminController.getEvents
    );

router
    .route('/getEvent/:id')
    .get(
        isLoggedAdmin,
        adminController.getSingleEvent

    );

module.exports = router;
