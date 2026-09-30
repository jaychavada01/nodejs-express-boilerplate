const { initSampleSubscribers } = require("./sampleSubscriber");

/**
 * @name initSubscribers
 * @description Registers all message queue consumers across the microservice
 * @returns {Promise<void>}
 */
const initSubscribers = async () => {
  try {
    await initSampleSubscribers();
    console.log("✅ [Subscribers] All message queue subscribers registered.");
  } catch (error) {
    console.error("❌ [Subscribers] Initialization failed:", error.message);
  }
};

module.exports = { initSubscribers };
