const { SENDGRID_MAIL: sgMail } = require("./packages");
const envConfig = require("./envConfig");

let isSendGridConfigured = false;

/*
 * SENDGRID CLIENT INITIALIZATION
 * Configures API key for outbound emails with fallback mock mode.
 */
if (envConfig.SENDGRID.API_KEY && envConfig.SENDGRID.API_KEY.startsWith("SG.")) {
  sgMail.setApiKey(envConfig.SENDGRID.API_KEY);
  isSendGridConfigured = true;
  console.log("✅ [SendGrid] Mail client configured.");
} else {
  console.warn("⚠️ [SendGrid] SENDGRID_API_KEY is not set. Email service will run in mock mode.");
}

module.exports = {
  sgMail,
  isSendGridConfigured: () => isSendGridConfigured,
  defaultFrom: envConfig.SENDGRID.DEFAULT_FROM,
};
