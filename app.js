// ── 1. Load environment variables ──────────────────────────────────────────
require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");

const envConfig = require("./config/envConfig");
const { cors: corsConfig, helmet: helmetConfig } = require("./config/security");
const rateLimiter = require("./api/middlewares/rateLimiter");
const errorHandler = require("./api/middlewares/errorHandler");
const router = require("./config/routes");
const { sequelize } = require("./config/sequelize");
const { checkDatabaseConnection } = require("./config/database");
const { startServer } = require("./api/utils/server");
const { NOT_FOUND_RESPONSE } = require("./api/utils/response");

const PORT = envConfig.PORT || 3000;

/*
 * ANSI COLOR LOGGING MIDDLEWARE
 * Logs request method, URL, status code (color-coded), and execution duration in ms.
 */
function setupRequestLogging(app) {
  app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const status = res.statusCode;
      const method = req.method;
      const url = req.originalUrl || req.url;
      const duration = Date.now() - start;

      const resetColor = "\x1b[0m";
      const grayColor = "\x1b[90m";
      let statusColor = "\x1b[32m"; // 2xx Green

      if (status >= 500) {
        statusColor = "\x1b[31m"; // 5xx Red
      } else if (status >= 400) {
        statusColor = "\x1b[33m"; // 4xx Yellow
      } else if (status >= 300) {
        statusColor = "\x1b[36m"; // 3xx Cyan
      }

      console.log(
        `${method} ${url} ${statusColor}${status}${resetColor} - ${grayColor}${duration}ms${resetColor}`
      );
    });

    next();
  });
}

/**
 * Configure security and rate limiting middlewares.
 */
function setupSecurity(app) {
  app.use(helmetConfig);
  app.use(cors(corsConfig));
  app.use(rateLimiter);
}

/**
 * Configure body parsing middlewares.
 */
function setupBodyParsers(app) {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
}

/**
 * Configure application routes, 404 handler, and global error handler.
 */
function setupRoutes(app) {
  app.use(router);

  // 404 Not Found Handler
  app.use((req, res) => {
    return NOT_FOUND_RESPONSE(res, "ERR404", `Cannot ${req.method} ${req.originalUrl}`);
  });

  // Centralized Error Handler
  app.use(errorHandler);
}

/**
 * Wire all middlewares into Express app.
 */
function setupMiddleware(app) {
  setupRequestLogging(app);
  setupSecurity(app);
  setupBodyParsers(app);
  setupRoutes(app);
}

/**
 * Authenticate database connection.
 */
async function initializeDatabase() {
  await checkDatabaseConnection(sequelize);
}

/**
 * Starts HTTP listener.
 */
async function startHttpServer(server) {
  return new Promise((resolve, reject) => {
    server.listen(PORT, async () => {
      try {
        await startServer(server, PORT);
        await initializeDatabase();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Main application bootstrapper.
 */
async function startApplication() {
  const app = express();
  const server = createServer(app);

  setupMiddleware(app);
  await startHttpServer(server);

  /*
   * GRACEFUL SHUTDOWN HANDLERS
   * Traps SIGTERM and SIGINT signals to safely close connections and pools.
   */
  const shutdown = async (signal) => {
    console.log(`\n🛑 [Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      if (sequelize) {
        await sequelize.close();
        console.log("🔒 [Database] Connection pool closed.");
      }
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startApplication().catch((error) => {
  console.error("❌ [Server] Fatal error during startup:", error);
  process.exit(1);
});
