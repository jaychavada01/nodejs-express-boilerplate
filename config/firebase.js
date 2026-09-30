const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const envConfig = require("./envConfig");

let isFCMReady = false;

/*
 * MULTI-STRATEGY FIREBASE INITIALIZATION
 * Strategy 1: Service Account JSON File Path (FIREBASE_SERVICE_ACCOUNT_PATH)
 * Strategy 2: Raw JSON String in Env (FIREBASE_SERVICE_ACCOUNT_JSON)
 * Strategy 3: Individual Env Variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 * Fallback: Graceful Mock Mode for local offline development
 */
const initFirebase = () => {
  try {
    if (admin.apps.length > 0) {
      isFCMReady = true;
      return admin;
    }

    const { SERVICE_ACCOUNT_PATH, SERVICE_ACCOUNT_JSON, PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY } =
      envConfig.FIREBASE;

    // Strategy 1: JSON File Path
    if (SERVICE_ACCOUNT_PATH && fs.existsSync(path.resolve(SERVICE_ACCOUNT_PATH))) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(path.resolve(SERVICE_ACCOUNT_PATH), "utf8")
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: PROJECT_ID || serviceAccount.project_id,
      });
      isFCMReady = true;
      console.log("✅ [Firebase Admin] Initialized from service account file.");
      return admin;
    }

    // Strategy 2: Raw JSON String
    if (SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: PROJECT_ID || serviceAccount.project_id,
      });
      isFCMReady = true;
      console.log("✅ [Firebase Admin] Initialized from raw JSON env string.");
      return admin;
    }

    // Strategy 3: Individual Env Vars
    if (PROJECT_ID && CLIENT_EMAIL && PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: PROJECT_ID,
          clientEmail: CLIENT_EMAIL,
          privateKey: PRIVATE_KEY,
        }),
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
