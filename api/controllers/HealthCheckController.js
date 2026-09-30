const asyncHandler = require("../utils/asyncHandler");
const { OK_RESPONSE } = require("../utils/response");
const { sequelize } = require("../../config/sequelize");
const { isRabbitMQConnected } = require("../../config/rabbitmq");
const { isFCMReady } = require("../../config/firebase");
const { isSendGridConfigured } = require("../../config/sendgrid");

/**
 * @name healthCheck
 * @file HealthCheckController.js
 * @param {Request} req
 * @param {Response} res
 * @description Inspects application health, uptime, and database/queue/communication subsystem connectivity
 */
const healthCheck = asyncHandler(async (req, res) => {
  let dbStatus = "disconnected";

  if (sequelize) {
    try {
      await sequelize.authenticate();
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
  }

  const healthInfo = {
    app: process.env.APP_NAME || "nodejs-express-boilerplate",
    environment: process.env.NODE_ENV || "development",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      rabbitmq: isRabbitMQConnected() ? "connected" : "disabled_or_offline",
      firebase: isFCMReady() ? "ready" : "mock_mode",
      sendgrid: isSendGridConfigured() ? "ready" : "mock_mode",
    },
  };

  return OK_RESPONSE(res, "API is running smoothly", healthInfo);
});

module.exports = { healthCheck };
