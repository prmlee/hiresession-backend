const express = require('express');
const ticketController = require('../controllers/TicketController');
const { isLoggedAdmin,isLoggedEmployer} = require('../middlewares/auth');

const router = express.Router();

router
    .route('/addTicketType')
    .post(
        isLoggedAdmin,
        ticketController.addTicketType
    );

router
    .route('/getTicketTypes')
    .post(
        isLoggedAdmin,
        ticketController.getTicketTypes
    );

router
    .route('/deleteTicketType')
    .post(
        isLoggedAdmin,
        ticketController.deleteTicketType
    );

router
    .route('/updateTicketType')
    .post(
        isLoggedAdmin,
        ticketController.updateTicketType
    );

router
    .route('/getSingleTicketType')
    .post(
        isLoggedAdmin,
        ticketController.getSingleTicketType
    );

router
    .route('/getTicketTypesByEvent')
    .post(
        isLoggedEmployer,
        ticketController.getTicketTypesByEvent
    )
    

module.exports = router;
