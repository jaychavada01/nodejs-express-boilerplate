const envConfig = require("./envConfig");

module.exports = {
  adapter: envConfig.DATABASE.ADAPTER,
  url: envConfig.DATABASE.URL,
  host: envConfig.DATABASE.HOST,
  port: envConfig.DATABASE.PORT,
  database: envConfig.DATABASE.NAME,
  username: envConfig.DATABASE.USER,
  password: envConfig.DATABASE.PASSWORD,
  pool: envConfig.DATABASE.POOL,
};
