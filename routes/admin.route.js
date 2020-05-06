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
    .get(
        isLoggedAdmin,
        adminController.getCompanies
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
    .route('/getCandidates')
    .get(
        isLoggedAdmin,
        adminController.getCandidates
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


module.exports = router;
