const express = require("express");
const router = express.Router();
const NotificationDemoController = require("../../controllers/v1/NotificationDemoController");

/*
 * NOTIFICATION DEMO ROUTES
 * Clean route bindings - validation is handled inside controllers
 */
router.post("/push", NotificationDemoController.sendPushDemo);
router.post("/email", NotificationDemoController.sendEmailDemo);
router.post("/queue", NotificationDemoController.publishQueueDemo);

module.exports = router;
