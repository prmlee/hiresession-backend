const express = require('express');
//const { isLoggedCustomer, isLoggedAdmin } = require('../middlewares/auth');
const authRoutes = require('./auth.route');
const employeeRoutes = require('./employee.route');
const candidateRoutes = require('./candidate.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/employee', employeeRoutes);
router.use('/candidate', candidateRoutes);

module.exports = router;
