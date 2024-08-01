const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

router.get('/', notificationsController.getAllNotifications);
router.post('/', notificationsController.addNotification);
router.delete('/:id', notificationsController.deleteNotification);

module.exports = router;
