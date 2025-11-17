const admin = require('firebase-admin');
const path = require('path');

let db;

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const serviceAccount = require(keyPath);
    console.log('✅ Service account loaded from:', keyPath);
    console.log('📋 Project ID:', serviceAccount.project_id);
    console.log('📧 Client Email:', serviceAccount.client_email);
    return serviceAccount;
  } catch (error) {
    console.error('❌ Failed to load service account:', error.message);
    throw new Error('Service account key file not found or invalid');
  }
}

function initializeFirebase() {
  if (!admin.apps.length) {
    try {
      const serviceAccount = loadServiceAccount();

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      throw error;
    }
  }

  if (!db) {
    db = admin.firestore();
    db.settings({
      ignoreUndefinedProperties: true,
    });
    console.log('✅ Firestore database connection established');
  }

  return db;
}

function getFirestore() {
  return db || initializeFirebase();
}

const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.Timestamp;

// Initialise Firebase immédiatement pour éviter les erreurs de course.
initializeFirebase();

module.exports = {
  admin,
  initializeFirebase,
  getFirestore,
  db: getFirestore,
  FieldValue,
  Timestamp,
};
