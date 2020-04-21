const express = require('express');
//const { isLoggedCustomer, isLoggedAdmin } = require('../middlewares/auth');
const authRoutes = require('./auth.route');

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;
