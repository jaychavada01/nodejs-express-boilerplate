const { bootstrap } = require("../../config/bootstrap");

/**
 * @name startServer
 * @param {Object} server - HTTP Server instance
 * @param {number} port - Port number
 * @description Initializes server startup and runs bootstrap services
 * @returns {Promise<void>}
 */
const startServer = async (server, port) => {
  try {
    await bootstrap();
    console.log(`🚀 [Server] Application running on port: ${port}`);
  } catch (error) {
    console.error("❌ [Server] Startup failure:", error);
    process.exit(1);
  }
};

module.exports = { startServer };
