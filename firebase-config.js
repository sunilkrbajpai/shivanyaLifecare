/**
 * Firebase configuration for Shivanya Lifecare Collection Center
 *
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a project (or use existing)
 * 3. Add a web app and copy the config below
 * 4. Enable Firestore: Build → Firestore Database → Create database (test mode for quick start)
 * 5. Optional: Add security rules later (see README)
 */

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase (only if config is set)
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
  firebase.initializeApp(firebaseConfig);
  window.firebaseInitialized = true;
} else {
  window.firebaseInitialized = false;
}
