const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { sgMail, isSendGridConfigured, defaultFrom } = require("../../../config/sendgrid");

const templateCache = new Map();

/**
 * @name getCompiledTemplate
 * @param {Object} params - Object containing templateName
 * @description Compiles and caches Handlebars email templates from assets/templates/email
 * @returns {Function} Compiled Handlebars template function
 */
const getCompiledTemplate = ({ templateName }) => {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  const templatePath = path.resolve(
    __dirname,
    "../../../assets/templates/email",
    `${templateName}.hbs`
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`[EmailService] Template file not found: ${templatePath}`);
  }

  const source = fs.readFileSync(templatePath, "utf8");
  const compiled = handlebars.compile(source);
  templateCache.set(templateName, compiled);
  return compiled;
};

/**
 * @name sendEmail
 * @param {Object} params - Parameter object containing to, subject, html, text, from, cc, bcc, and attachments
 * @description Sends an email via SendGrid or logs in mock mode if unconfigured
 * @returns {Promise<Object>} Status object
 */
const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from = defaultFrom,
  cc,
  bcc,
  attachments = [],
}) => {
  if (!isSendGridConfigured()) {
    console.log(`✉️ [SendGrid Mock] Email to: ${to} | Subject: "${subject}" (SENDGRID_API_KEY not configured)`);
    return { success: true, mocked: true };
  }

  try {
    const msg = {
      to,
      from,
      subject,
      text: text || undefined,
      html: html || undefined,
      cc: cc && cc.length ? cc : undefined,
      bcc: bcc && bcc.length ? bcc : undefined,
      attachments: attachments && attachments.length ? attachments : undefined,
    };

    const [response] = await sgMail.send(msg);
    return { success: true, statusCode: response.statusCode };
  } catch (error) {
    if (error.response && error.response.body && error.response.body.errors) {
      console.error(
        "❌ [SendGrid Error] Detailed:",
        JSON.stringify(error.response.body.errors, null, 2)
      );
    } else {
      console.error("❌ [SendGrid Error]:", error.message);
    }
    throw error;
  }
};

/**
 * @name sendTemplateEmail
 * @param {Object} params - Parameter object containing to, subject, templateName, templateData, from, cc, bcc, and attachments
 * @description Renders a Handlebars template and dispatches email via SendGrid
 * @returns {Promise<Object>} Status object
 */
const sendTemplateEmail = async ({
  to,
  subject,
  templateName,
  templateData = {},
  from = defaultFrom,
  cc,
  bcc,
  attachments = [],
}) => {
  const templateFn = getCompiledTemplate({ templateName });
  const html = templateFn(templateData);

  return sendEmail({
    to,
    subject,
    html,
    from,
    cc,
    bcc,
    attachments,
  });
};

module.exports = {
  sendEmail,
  sendTemplateEmail,
};
