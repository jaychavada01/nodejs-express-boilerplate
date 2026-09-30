const { Sequelize } = require("sequelize");
const datastores = require("./datastores");

let sequelize = null;

/*
 * DATABASE ORM INSTANCE INITIALIZATION
 * Configures Sequelize with PostgreSQL dialect, connection pooling,
 * and suppresses noisy raw query logs during runtime.
 */
if (datastores.url || (datastores.adapter && datastores.database)) {
  const connectionOptions = {
    dialect: datastores.adapter || "postgres",
    logging: false,
    pool: {
      max: datastores.pool.MAX || 20,
      min: datastores.pool.MIN || 0,
      acquire: datastores.pool.ACQUIRE || 30000,
      idle: datastores.pool.IDLE || 10000,
    },
  };

  sequelize = datastores.url
    ? new Sequelize(datastores.url, connectionOptions)
    : new Sequelize(
        datastores.database,
        datastores.username,
        datastores.password,
        {
          host: datastores.host,
          port: datastores.port,
          ...connectionOptions,
        }
      );
}

module.exports = { sequelize };
