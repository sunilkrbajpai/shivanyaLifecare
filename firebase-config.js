/**
 * Firebase configuration for Shivanya Lifecare Collection Center
 * Used to store booking form submissions in Firestore (appointments collection).
 *
 * Full steps: see FIREBASE-SETUP.md
 * Quick: Create project → Add web app → Enable Firestore → paste your config below.
 */

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRTAYDH-uV8uE3ck_rwgcuBQMpf610KGE",
  authDomain: "shivanyalifecare.firebaseapp.com",
  projectId: "shivanyalifecare",
  storageBucket: "shivanyalifecare.firebasestorage.app",
  messagingSenderId: "1009686726295",
  appId: "1:1009686726295:web:7bd506faa88125dcf4cbd2",
  measurementId: "G-FBY1E5KYYS"
};

// Initialize Firebase (only if config is set)
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
  firebase.initializeApp(firebaseConfig);
  window.firebaseInitialized = true;
} else {
  window.firebaseInitialized = false;
}
