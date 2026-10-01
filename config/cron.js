const { CRON: cron } = require("./packages");
const envConfig = require("./envConfig");

const scheduledTasks = [];

/**
 * @name initCron
 * @description Registers and starts scheduled background cron tasks when enabled via env flag
 * @returns {Array} Array of registered scheduled tasks
 */
const initCron = () => {
  if (envConfig.CRON.ENABLE !== "Y") {
    console.log("ℹ️ [Cron] Background task scheduler disabled (ENABLE_CRON!=Y).");
    return scheduledTasks;
  }

  try {
    const tasks = require("../api/tasks");

    /*
     * CRON TASK REGISTRATION
     * Iterates over exported task definitions and schedules them with node-cron.
     */
    if (Array.isArray(tasks)) {
      tasks.forEach((task) => {
        if (task && task.schedule && typeof task.handler === "function") {
          const scheduled = cron.schedule(task.schedule, async () => {
            try {
              console.log(`⏰ [Cron] Running task: ${task.name || "anonymous"}`);
              await task.handler();
            } catch (taskErr) {
              console.error(`❌ [Cron] Error in task ${task.name}:`, taskErr);
            }
          });

          scheduledTasks.push({ name: task.name, instance: scheduled });
          console.log(`✅ [Cron] Registered task "${task.name}" (${task.schedule})`);
        }
      });
    }

    console.log(`✅ [Cron] Scheduler active with ${scheduledTasks.length} task(s).`);
  } catch (error) {
    console.error("❌ [Cron] Scheduler initialization error:", error.message);
  }

  return scheduledTasks;
};

/**
 * @name stopCron
 * @description Gracefully stops all active cron jobs on process termination
 */
const stopCron = () => {
  scheduledTasks.forEach((task) => {
    if (task.instance && typeof task.instance.stop === "function") {
      task.instance.stop();
    }
  });
  console.log("🔒 [Cron] All background tasks stopped.");
};

module.exports = {
  initCron,
  stopCron,
};
