const { Sequelize } = require("./packages");
const envConfig = require("./envConfig");

let sequelize = null;

/*
 * DATABASE ORM INSTANCE INITIALIZATION
 * Configures Sequelize with PostgreSQL dialect and connection pooling directly from DB_URL.
 * Suppresses noisy raw query logs during runtime.
 */
if (envConfig.DATABASE && envConfig.DATABASE.URL) {
  const connectionOptions = {
    dialect: "postgres",
    logging: false,
    pool: {
      max: envConfig.DATABASE.POOL.MAX || 20,
      min: envConfig.DATABASE.POOL.MIN || 0,
      acquire: envConfig.DATABASE.POOL.ACQUIRE || 30000,
      idle: envConfig.DATABASE.POOL.IDLE || 10000,
    },
  };

  sequelize = new Sequelize(envConfig.DATABASE.URL, connectionOptions);
}

module.exports = { sequelize };
