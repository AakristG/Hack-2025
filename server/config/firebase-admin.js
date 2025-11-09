const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
// You can either use a service account JSON file or environment variables
let firebaseAdmin;

try {
  // Option 1: Use service account JSON from environment variable (recommended)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      console.log('✅ Firebase Admin initialized using service account from environment variable');
    } catch (parseError) {
      console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', parseError.message);
      throw parseError;
    }
  }
  // Option 2: Use project ID only (requires service account file or proper GCP setup)
  // This won't work locally without credentials, so we'll throw a helpful error
  else if (process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️  FIREBASE_PROJECT_ID is set but FIREBASE_SERVICE_ACCOUNT is not.');
    console.warn('⚠️  Firebase Admin requires credentials to verify tokens.');
    console.warn('⚠️  Please set FIREBASE_SERVICE_ACCOUNT in your .env file.');
    console.warn('⚠️  See FIREBASE_QUICK_START.md for instructions on getting service account credentials.');
    throw new Error('Firebase Admin requires FIREBASE_SERVICE_ACCOUNT to be set. Project ID alone is not sufficient for local development.');
  }
  // Option 3: Try to use default credentials (only works on Google Cloud)
  else {
    console.warn('⚠️  No Firebase Admin credentials found. Attempting to use default credentials...');
    console.warn('⚠️  This will only work on Google Cloud Platform.');
    firebaseAdmin = admin.initializeApp();
    console.log('✅ Firebase Admin initialized using default credentials (GCP only)');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.error('❌ Firebase authentication will not work until properly configured.');
  console.error('');
  console.error('📝 To fix this:');
  console.error('   1. Go to Firebase Console > Project Settings > Service Accounts');
  console.error('   2. Click "Generate new private key"');
  console.error('   3. Copy the entire JSON content');
  console.error('   4. Add it to your .env file as: FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}');
  console.error('   5. Make sure the entire JSON is on one line');
  console.error('');
  // Don't throw - allow server to start, but authentication won't work
  firebaseAdmin = null;
}

/**
 * Verify a Firebase ID token
 * @param {string} idToken - The Firebase ID token to verify
 * @returns {Promise<Object>} - Decoded token with user information
 */
async function verifyIdToken(idToken) {
  if (!firebaseAdmin) {
    const error = new Error('Firebase Admin is not initialized. Please configure FIREBASE_SERVICE_ACCOUNT in your .env file.');
    console.error('❌', error.message);
    throw error;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Error verifying Firebase ID token:', error.message);
    if (error.code === 'app/invalid-credential') {
      console.error('❌ This usually means Firebase Admin is not properly configured with credentials.');
      console.error('❌ Please check your FIREBASE_SERVICE_ACCOUNT in .env file.');
    }
    throw new Error(`Invalid Firebase ID token: ${error.message}`);
  }
}

module.exports = {
  admin: firebaseAdmin,
  verifyIdToken
};

