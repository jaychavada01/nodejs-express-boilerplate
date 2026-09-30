require("dotenv").config({ quiet: true });

const envConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_NAME: process.env.APP_NAME || "nodejs-express-boilerplate",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  DATABASE: {
    ADAPTER: process.env.DB_ADAPTER || "postgres",
    URL: process.env.DB_URL || "postgres://postgres:postgres@localhost:5432/swp_boilerplate_db",
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 5432,
    NAME: process.env.DB_NAME || "swp_boilerplate_db",
    USER: process.env.DB_USER || "postgres",
    PASSWORD: process.env.DB_PASSWORD || "postgres",
    POOL: {
      MAX: Number(process.env.DB_POOL_MAX) || 20,
      MIN: Number(process.env.DB_POOL_MIN) || 0,
      ACQUIRE: Number(process.env.DB_POOL_ACQUIRE) || 30000,
      IDLE: Number(process.env.DB_POOL_IDLE) || 10000,
    },
  },

  JWT: {
    SECRET: process.env.JWT_SECRET || "boilerplate_jwt_secret_key_change_in_prod",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  },

  RATELIMIT: {
    ENABLE_RATE_LIMIT: process.env.ENABLE_RATE_LIMIT || "N",
    RATE_LIMIT_WINDOWS: Number(process.env.RATE_LIMIT_WINDOWS) || 900000, // 15 mins
    RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,
    RATE_LIMIT_ERROR_MESSAGE: process.env.RATE_LIMIT_ERROR_MESSAGE || "Too many requests, please try again later.",
  },

  SENDGRID: {
    API_KEY: process.env.SENDGRID_API_KEY || "",
    DEFAULT_FROM: process.env.MAIL_DEFAULT_FROM || "noreply@example.com",
  },

  FIREBASE: {
    SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "",
    SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "",
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "",
  },

  RABBITMQ: {
    ENABLE: process.env.ENABLE_RABBITMQ || "N",
    URL: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672/",
    HOST: process.env.RABBITMQ_HOST || "localhost",
    PORT: process.env.RABBITMQ_PORT || 5672,
    USERNAME: process.env.RABBITMQ_USERNAME || "guest",
    PASSWORD: process.env.RABBITMQ_PASSWORD || "guest",
    VHOST: process.env.RABBITMQ_VHOST || "/",
  },
};

module.exports = envConfig;
