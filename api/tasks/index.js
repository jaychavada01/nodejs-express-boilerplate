const sampleCleanupTask = require("./sampleCleanupTask");

/*
 * CRON TASK REGISTRY
 * Aggregates all recurring background cron jobs to be registered by config/cron.js.
 */
const tasks = [
  sampleCleanupTask,
];

module.exports = tasks;
