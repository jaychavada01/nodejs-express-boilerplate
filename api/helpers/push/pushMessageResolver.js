const { pushMessages } = require("../../../config/pushMessages");
const { LANGUAGES } = require("../../../config/constants");

/**
 * @name getPushMessage
 * @param {Object} params - Parameter object containing type, language, and replaceData
 * @description Resolves multi-language push notification templates and interpolates dynamic {{placeholders}}
 * @returns {Promise<{ title: string, body: string }>} Resolved title and body strings
 */
const getPushMessage = async ({
  type,
  language = LANGUAGES.EN,
  replaceData = {},
}) => {
  try {
    const translations = pushMessages[type];
    if (!translations) {
      return { title: "", body: "" };
    }

    const upperLang = (language || LANGUAGES.EN).toUpperCase();
    const messageEntry = translations[upperLang] || translations[LANGUAGES.EN] || {};

    let title = messageEntry.title || "";
    let body = messageEntry.body || "";

    /*
     * DYNAMIC PLACEHOLDER INTERPOLATION
     * Replaces {{variable}} tokens safely with values from replaceData object.
     */
    for (const [key, value] of Object.entries(replaceData)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      const safeValue = value !== undefined && value !== null ? String(value) : "";
      title = title.replace(regex, safeValue);
      body = body.replace(regex, safeValue);
    }

    return {
      title,
      body: body || title,
    };
  } catch (error) {
    console.error("❌ [PushMessageResolver] Error resolving message template:", error.message);
    return { title: "", body: "" };
  }
};

module.exports = { getPushMessage };
