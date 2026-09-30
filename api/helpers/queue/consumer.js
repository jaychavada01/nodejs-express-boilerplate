const { getChannel, isRabbitMQConnected, MAX_RETRY_COUNT } = require("../../../config/rabbitmq");
const { publishToQueue } = require("./publisher");

/**
 * @name consumeQueue
 * @param {Object} params - Parameter object containing queue name and onMessage handler function
 * @description Starts a durable RabbitMQ consumer with exponential backoff and DLQ routing
 * @returns {Promise<void>}
 */
const consumeQueue = async ({ queue, onMessage }) => {
  if (!isRabbitMQConnected()) {
    console.warn(`⚠️ [RabbitMQ Consumer] Cannot start consumer on "${queue}": RabbitMQ offline.`);
    return;
  }

  const channel = getChannel();

  await channel.consume(
    queue,
    async (msg) => {
      if (!msg) return;

      const retryCount = msg.properties.headers?.["x-retry-count"] || 0;
      let payload = null;

      try {
        payload = JSON.parse(msg.content.toString());
      } catch (err) {
        console.error(`❌ [RabbitMQ Consumer] Malformed JSON payload on "${queue}" — sending to DLQ (no retry):`, err.message);
        channel.nack(msg, false, false);
        return;
      }

      try {
        await onMessage(payload, msg.properties);
        channel.ack(msg);
      } catch (err) {
        console.error(
          `❌ [RabbitMQ Consumer] Processing error on "${queue}" (Attempt ${retryCount + 1}/${MAX_RETRY_COUNT}):`,
          err.message
        );

        if (retryCount >= MAX_RETRY_COUNT) {
          console.error(
            `❌ [RabbitMQ Consumer] Max retries (${MAX_RETRY_COUNT}) exceeded on "${queue}". Dropping to DLQ.`
          );
          channel.nack(msg, false, false);
          return;
        }

        /*
         * EXPONENTIAL BACKOFF RETRY STRATEGY
         * Delays retry with exponential formula: 2^(retry+1) seconds (2s, 4s, 8s, 16s...)
         */
        const delayMs = Math.pow(2, retryCount + 1) * 1000;
        console.warn(`⏳ [RabbitMQ Consumer] Scheduling retry ${retryCount + 1}/${MAX_RETRY_COUNT} in ${delayMs / 1000}s...`);

        setTimeout(() => {
          publishToQueue({
            queue,
            message: payload,
            options: {
              headers: {
                ...(msg.properties.headers || {}),
                "x-retry-count": retryCount + 1,
              },
            },
          }).catch((pubErr) => {
            console.error("❌ [RabbitMQ Consumer] Retry re-publish error:", pubErr.message);
          });

          channel.ack(msg);
        }, delayMs);
      }
    },
    { noAck: false }
  );

  console.log(`🎧 [RabbitMQ Consumer] Listening on queue: "${queue}"`);
};

module.exports = { consumeQueue };
