const { CRON_SCHEDULES } = require("../../config/constants");

/**
 * @name sampleCleanupTask
 * @description Periodic task to simulate daily log/temp file cleanup
 */
const sampleCleanupTask = {
  name: "SampleDailyCleanup",
  schedule: CRON_SCHEDULES.DAILY_MIDNIGHT,
  handler: async () => {
    /*
     * PERIODIC MAINTENANCE WORKER LOGIC
     * Executes scheduled housekeeping, cache pruning, or report generation.
     */
    console.log("🧹 [Cron Worker] Daily cleanup executed successfully.");
  },
};

module.exports = sampleCleanupTask;
