const express = require('express');
const { isUserLoggedIn } = require('../middlewares/auth');
const NotificationController = require('../controllers/NotificationController');

const router = express.Router();

router
  .route('/getNotifications')
  .post(
    isUserLoggedIn,
    NotificationController.getNotifications
  );

router
  .route('/removeNotifcation')
  .post(
    isUserLoggedIn,
    NotificationController.removeNotification
  );

router
  .route('/removeAllNotifications')
  .post(
    isUserLoggedIn,
    NotificationController.removeAllNotifications
  );

module.exports = router;
