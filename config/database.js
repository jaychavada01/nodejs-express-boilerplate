/**
 * @name checkDatabaseConnection
 * @param {Object} sequelizeInstance - Sequelize database instance
 * @description Authenticates database connection pool
 * @returns {Promise<boolean>}
 */
const checkDatabaseConnection = async (sequelizeInstance) => {
  if (!sequelizeInstance) {
    console.warn("⚠️ [Database] Sequelize instance is not configured. Running without database connection.");
    return false;
  }

  try {
    await sequelizeInstance.authenticate();
    console.log("✅ [Database] Connection established successfully.");
    return true;
  } catch (error) {
    console.error("❌ [Database] Unable to connect to the database:", error.message);
    return false;
  }
};

module.exports = { checkDatabaseConnection };
