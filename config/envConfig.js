const { DOTENV } = require("./packages");
DOTENV.config({ quiet: true });

const envConfig = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_NAME: process.env.APP_NAME || "nodejs-express-boilerplate",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  DATABASE: {
    URL: process.env.DB_URL || "postgres://postgres:postgres@localhost:5432/swp_boilerplate_db",
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
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
    PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID || "",
    PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : "",
    CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
    CLIENT_ID: process.env.FIREBASE_CLIENT_ID || "",
    CLIENT_X509_CERT_URL: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
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

  REDIS: {
    ENABLE: process.env.ENABLE_REDIS || "N",
    URL: process.env.REDIS_URL || "",
    HOST: process.env.REDIS_HOST || "localhost",
    PORT: Number(process.env.REDIS_PORT) || 6379,
    PASSWORD: process.env.REDIS_PASSWORD || "",
    DB: Number(process.env.REDIS_DB) || 0,
  },

  CRON: {
    ENABLE: process.env.ENABLE_CRON || "N",
  },

  MAINTENANCE: {
    ENABLE: process.env.MAINTENANCE_MODE || "N",
    BYPASS_SECRET: process.env.MAINTENANCE_BYPASS_SECRET || "",
    ALLOWED_IPS: (process.env.MAINTENANCE_ALLOWED_IPS || "")
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean),
  },

  AWS_S3: {
    ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    REGION: process.env.AWS_REGION || "us-east-1",
    BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "",
    ENDPOINT: process.env.AWS_S3_ENDPOINT || "",
    FORCE_PATH_STYLE: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
    CUSTOM_DOMAIN: process.env.AWS_S3_CUSTOM_DOMAIN || "",
  },

  ENCRYPTION: {
    SECRET_KEY: process.env.ENCRYPTION_KEY || "12345678901234567890123456789012", // 32 characters key for aes-256
  },
};

module.exports = envConfig;
