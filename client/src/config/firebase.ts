import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
};

// Validate that all required config values are present
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId;

if (!isFirebaseConfigured) {
  console.warn('⚠️  Firebase configuration is incomplete. Please check your .env file.');
  console.warn('⚠️  Google Sign-In will not work until Firebase is properly configured.');
  console.warn('📝 See FIREBASE_QUICK_START.md for setup instructions.');
  console.warn('📋 Current config status:');
  console.warn('   - API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
  console.warn('   - Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing');
  console.warn('   - Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
}

// Initialize Firebase only if configuration is present
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Don't throw - allow app to continue without Firebase
    app = null;
    auth = null;
    googleProvider = null;
  }
} else {
  console.warn('Firebase not configured - Google Sign-In will be disabled');
}

export { auth, googleProvider };
export default app;

