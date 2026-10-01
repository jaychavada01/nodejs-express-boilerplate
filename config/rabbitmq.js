const { AMQPLIB: amqp } = require("./packages");
const envConfig = require("./envConfig");
const { QUEUE_NAMES, EXCHANGES, DLQ_NAMES } = require("./constants");

let connection = null;
let channel = null;
let isConnected = false;

const MAX_RETRY_COUNT = 5;

/**
 * @name connectRabbitMQ
 * @description Connect to RabbitMQ broker and initialize core queues and DLQ topology
 * @returns {Promise<Channel|null>}
 */
const connectRabbitMQ = async () => {
  if (envConfig.RABBITMQ.ENABLE !== "Y") {
    console.log("ℹ️ [RabbitMQ] Disabled via configuration (ENABLE_RABBITMQ != Y).");
    return null;
  }

  try {
    const amqpUrl =
      envConfig.RABBITMQ.URL ||
      `amqp://${envConfig.RABBITMQ.USERNAME}:${envConfig.RABBITMQ.PASSWORD}@${envConfig.RABBITMQ.HOST}:${envConfig.RABBITMQ.PORT}/${encodeURIComponent(envConfig.RABBITMQ.VHOST)}`;

    connection = await amqp.connect(amqpUrl);

    connection.on("error", (err) => {
      console.error("❌ [RabbitMQ] Connection error:", err.message);
      isConnected = false;
    });

    connection.on("close", () => {
      console.warn("⚠️ [RabbitMQ] Connection closed.");
      isConnected = false;
    });

    channel = await connection.createConfirmChannel();

    channel.on("error", (err) => {
      console.error("❌ [RabbitMQ] Channel error:", err.message);
    });

    await channel.prefetch(10);

    /*
     * DEAD LETTER TOPOLOGY SETUP
     * Declares Dead Letter Exchange and Queue to catch permanently failed messages
     * after maximum retries are exhausted.
     */
    await channel.assertExchange(EXCHANGES.NOTIFICATIONS_DLX, "fanout", { durable: true });
    await channel.assertQueue(DLQ_NAMES.NOTIFICATIONS_DLQ, { durable: true });
    await channel.bindQueue(DLQ_NAMES.NOTIFICATIONS_DLQ, EXCHANGES.NOTIFICATIONS_DLX, "");

    /*
     * WORKER QUEUES TOPOLOGY
     * Asserts primary microservice queues bound to Dead Letter Exchange.
     */
    await channel.assertQueue(QUEUE_NAMES.NOTIFICATIONS, {
      durable: true,
      arguments: { "x-dead-letter-exchange": EXCHANGES.NOTIFICATIONS_DLX },
    });

    await channel.assertQueue(QUEUE_NAMES.EMAILS, { durable: true });
    await channel.assertQueue(QUEUE_NAMES.EVENTS, { durable: true });

    isConnected = true;
    console.log("✅ [RabbitMQ] Connected successfully. Topology asserted.");
    return channel;
  } catch (error) {
    console.error("❌ [RabbitMQ] Connection failed:", error.message);
    isConnected = false;
    return null;
  }
};

/**
 * @name getChannel
 * @description Returns active RabbitMQ channel or throws error if uninitialized
 * @returns {Channel}
 */
const getChannel = () => {
  if (!channel || !isConnected) {
    throw new Error("[RabbitMQ] Channel not initialized or connection offline.");
  }
  return channel;
};

/**
 * @name isRabbitMQConnected
 * @description Returns RabbitMQ connection state
 * @returns {boolean}
 */
const isRabbitMQConnected = () => isConnected;

module.exports = {
  connectRabbitMQ,
  getChannel,
  isRabbitMQConnected,
  MAX_RETRY_COUNT,
};
