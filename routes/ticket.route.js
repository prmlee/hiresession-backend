const express = require('express');
const ticketController = require('../controllers/TicketController');
const { isLoggedAdmin,isLoggedEmployer} = require('../middlewares/auth');

const router = express.Router();
	
router
    .route('/getEventTicketTypeByEvent')
    .post(
        ticketController.getEventTicketTypeByEvent
	)
	
router
    .route('/updateEventTicketType')
    .post(
        isLoggedAdmin,
        ticketController.updateEventTicketType
	);

router
    .route('/getEventTickets')
    .post(
        isLoggedAdmin,
        ticketController.getEventTickets
	);
	
router
    .route('/getEmployerTickets')
    .get(
        isLoggedEmployer,
        ticketController.getEmployerTickets
    );


module.exports = router;
