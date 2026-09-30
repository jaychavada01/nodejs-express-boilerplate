const { connectRabbitMQ } = require("./rabbitmq");
const { initSubscribers } = require("../api/subscribers");

/**
 * @name bootstrap
 * @description Bootstrap application background workers, subscribers, and listeners
 * @returns {Promise<void>}
 */
const bootstrap = async () => {
  try {
    const channel = await connectRabbitMQ();
    if (channel) {
      await initSubscribers();
    }
  } catch (error) {
    console.error("❌ [Bootstrap] Error during application bootstrap:", error);
  }
};

module.exports = { bootstrap };
