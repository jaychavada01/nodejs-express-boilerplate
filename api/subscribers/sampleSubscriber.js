const { consumeQueue } = require("../helpers/queue/consumer");
const { QUEUE_NAMES } = require("../../config/constants");

/**
 * @name handleNotificationMessage
 * @param {Object} payload - Event payload
 * @param {Object} properties - Message metadata properties
 * @description Consumer worker logic for notification queue events
 * @returns {Promise<void>}
 */
const handleNotificationMessage = async (payload, properties) => {
  console.log(`📩 [Subscriber] Received message on "${QUEUE_NAMES.NOTIFICATIONS}":`, {
    correlationId: properties.correlationId,
    payload,
  });
};

/**
 * @name initSampleSubscribers
 * @description Registers consumers for sample notification queues
 * @returns {Promise<void>}
 */
const initSampleSubscribers = async () => {
  await consumeQueue({
    queue: QUEUE_NAMES.NOTIFICATIONS,
    onMessage: handleNotificationMessage,
  });
};

module.exports = { initSampleSubscribers };
