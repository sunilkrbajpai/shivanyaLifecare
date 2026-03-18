# Firebase setup for booking storage

Your site already saves bookings to Firebase Firestore when the config is set. Follow these steps to enable it.

## 1. Create a Firebase project

1. Go to **[Firebase Console](https://console.firebase.google.com/)** and sign in.
2. Click **Add project** (or use an existing one).
3. Enter a project name (e.g. `shivanya-lifecare`) and continue. You can turn off Google Analytics if you don’t need it.

## 2. Register your web app

1. In the project overview, click the **Web** icon (`</>`) to add an app.
2. Enter an app nickname (e.g. `Shivanya Website`) and click **Register app**.
3. Copy the **firebaseConfig** object (you’ll paste it in step 4).

## 3. Create Firestore Database

1. In the left sidebar go to **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** (for quick start). You can tighten rules later.
4. Pick a location (e.g. `asia-south1` for India) and click **Enable**.

## 4. Add your config to the site

1. Open **`firebase-config.js`** in this project.
2. Replace the placeholder values with your Firebase config:

```js
const firebaseConfig = {
  apiKey: 'AIza...',           // from Firebase Console
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc...',
};
```

**Security:** Don’t commit real API keys to a public repo. Use environment variables or a backend that injects config, or add `firebase-config.js` to `.gitignore` and keep a `firebase-config.example.js` with placeholders.

## 5. How it works

- When a user submits the **Book Appointment** form, the app checks `window.firebaseInitialized`.
- If the config is valid, it writes to the **`appointments`** collection in Firestore.
- Each document has: `name`, `phone`, `email`, `package`, `preferredDate`, `message`, `createdAt` (server timestamp), `source: 'shivanya-website'`.
- The collection is created automatically on the first write.

## 6. View bookings

- In Firebase Console go to **Build → Firestore Database**.
- Open the **`appointments`** collection to see submitted bookings.

## 7. (Optional) Secure Firestore rules

After testing, restrict who can read/write. Example (only allow create, no public read):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{docId} {
      allow create: if true;   // anyone can submit a booking
      allow read, update, delete: if false;  // only via Firebase Console / Admin
    }
  }
}
```

In Firestore, go to **Rules** and paste the above, then **Publish**.

---

**If config is not set:** The form still works but shows: *“Booking is not configured yet. Please call us at…”* and does not save to Firebase.
