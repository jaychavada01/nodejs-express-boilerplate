const express = require("express");
const router = express.Router();
const HealthCheckController = require("../controllers/HealthCheckController");

router.get("/", HealthCheckController.healthCheck);

module.exports = router;
