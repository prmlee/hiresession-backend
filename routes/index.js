const express = require('express');
//const { isLoggedCustomer, isLoggedAdmin } = require('../middlewares/auth');
const authRoutes = require('./auth.route');
const employeeRoutes = require('./employee.route');
const candidateRoutes = require('./candidate.route');
const adminRoutes = require('./admin.route');
const eventRoutes = require('./event.route');
const interviewRoutes = require('./interview.route');
const ticketRoutes = require('./ticket.route');
const stripeRoutes = require('./stripe.route');
const dataRoutes = require('./data.route');
const notificationRoutes = require('./notification.route');
const zoomRoutes = require('./zoom.route');
const promoRoutes = require('./promo.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/employee', employeeRoutes);
router.use('/candidate', candidateRoutes);
router.use('/admin', adminRoutes);
router.use('/event', eventRoutes);
router.use('/interview', interviewRoutes);
router.use('/ticket', ticketRoutes);
router.use('/stripe', stripeRoutes);
router.use('/data', dataRoutes);
router.use('/notification', notificationRoutes);
router.use('/zoom',zoomRoutes);
router.use('/promo',promoRoutes);

module.exports = router;
