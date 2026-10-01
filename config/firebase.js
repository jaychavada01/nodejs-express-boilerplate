const { FIREBASE_ADMIN: admin } = require("./packages");
const envConfig = require("./envConfig");

let isFCMReady = false;

/**
 * @name initFirebase
 * @description Initializes Firebase Admin SDK using individual environment credentials (Option 2)
 * @returns {Object} Firebase Admin SDK instance
 */
const initFirebase = () => {
  try {
    if (admin.apps.length > 0) {
      isFCMReady = true;
      return admin;
    }

    const {
      PROJECT_ID,
      PRIVATE_KEY_ID,
      PRIVATE_KEY,
      CLIENT_EMAIL,
      CLIENT_ID,
      CLIENT_X509_CERT_URL,
    } = envConfig.FIREBASE;

    /*
     * FIREBASE CREDENTIAL INITIALIZATION
     * Initializes Admin SDK with individual service account credential properties.
     * Fallback to graceful mock mode when credentials are not configured.
     */
    if (PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY) {
      const serviceAccount = {
        projectId: PROJECT_ID,
        clientEmail: CLIENT_EMAIL,
        privateKey: PRIVATE_KEY,
        ...(PRIVATE_KEY_ID && { privateKeyId: PRIVATE_KEY_ID }),
        ...(CLIENT_ID && { clientId: CLIENT_ID }),
        ...(CLIENT_X509_CERT_URL && { clientX509CertUrl: CLIENT_X509_CERT_URL }),
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: PROJECT_ID,
      });

      isFCMReady = true;
      console.log("✅ [Firebase Admin] Initialized from individual environment variables.");
      return admin;
    }

    console.warn("⚠️ [Firebase Admin] Credentials not configured. Push notifications running in mock mode.");
  } catch (error) {
    console.error("❌ [Firebase Admin] Initialization failed:", error.message);
    isFCMReady = false;
  }

  return admin;
};

initFirebase();

module.exports = {
  admin,
  messaging: admin.apps.length > 0 ? admin.messaging() : null,
  isFCMReady: () => isFCMReady,
};
