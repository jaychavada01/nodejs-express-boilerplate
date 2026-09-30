const express = require("express");
const router = express.Router();

const sampleRoutes = require("./sample.routes");
const notificationRoutes = require("./notification.routes");

router.use("/sample", sampleRoutes);
router.use("/notification", notificationRoutes);

module.exports = router;
