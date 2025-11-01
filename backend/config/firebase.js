const admin = require('firebase-admin');
const path = require('path');

let db;

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  const keyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(keyPath);
}

function initializeFirebase() {
  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  if (!db) {
    db = admin.firestore();
    db.settings({
      ignoreUndefinedProperties: true,
    });
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
