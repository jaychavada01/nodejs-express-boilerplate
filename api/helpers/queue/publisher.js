const { getChannel, isRabbitMQConnected } = require("../../../config/rabbitmq");

/**
 * @name publishToQueue
 * @param {Object} params - Parameter object containing queue name, message payload, and optional amqplib options
 * @description Publishes a durable, JSON-serialized message to RabbitMQ queue
 * @returns {Promise<boolean>}
 */
const publishToQueue = async ({ queue, message, options = {} }) => {
  if (!isRabbitMQConnected()) {
    console.log(`📬 [RabbitMQ Mock Publisher] Target queue: "${queue}" | Message:`, message);
    return false;
  }

  const channel = getChannel();
  const content = Buffer.from(JSON.stringify(message));

  return new Promise((resolve, reject) => {
    const ok = channel.sendToQueue(
      queue,
      content,
      { persistent: true, ...options },
      (err) => {
        if (err) {
          console.error(`❌ [RabbitMQ] Failed to publish message to queue "${queue}":`, err.message);
          return reject(err);
        }
        resolve(true);
      }
    );

    if (!ok) {
      channel.once("drain", () => {});
    }
  });
};

/**
 * @name publishToExchange
 * @param {Object} params - Parameter object containing exchange, routingKey, message, and options
 * @description Publishes message to RabbitMQ exchange
 * @returns {Promise<boolean>}
 */
const publishToExchange = async ({ exchange, routingKey, message, options = {} }) => {
  if (!isRabbitMQConnected()) {
    console.log(`📬 [RabbitMQ Mock Exchange] Exchange: "${exchange}" | Key: "${routingKey}" | Message:`, message);
    return false;
  }

  const channel = getChannel();
  const content = Buffer.from(JSON.stringify(message));

  return channel.publish(exchange, routingKey, content, {
    persistent: true,
    ...options,
  });
};

module.exports = {
  publishToQueue,
  publishToExchange,
};
