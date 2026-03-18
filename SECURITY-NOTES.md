# Firebase config & GitHub Pages

## Is the Firebase config public?

**Yes.** On GitHub Pages (and any static hosting), everything in your repo is deployed. So `firebase-config.js` is visible to anyone who visits your site or looks at your repo.

## Does that cause a security problem?

**No.** Firebase is designed for this:

- The **apiKey** in the config is not a secret. It identifies your Firebase project and is meant to be used in client-side apps. It does **not** by itself grant access to your data.
- **Access is enforced by Firestore Security Rules** (and Firebase Auth, if you use it). Rules decide who can read/write what. So even with the config public, strangers cannot read or write unless your rules allow it.

Your current setup:

- **Bookings:** Anyone can **create** an appointment (submit the form). Only your **admin page** (after login) can **read** and **update** (mark as done). Rules enforce this.
- So having the config on GitHub Pages does **not** let anyone bypass that.

## Best practices

1. **Keep Firestore rules strict.** Do not allow `read, write: if true` for sensitive data. Your `appointments` rules are fine for a booking list.
2. **Optional – hide config from the repo:** If your repo is **public** and you prefer not to commit real keys, you can:
   - Add `firebase-config.js` to `.gitignore`.
   - Commit a `firebase-config.example.js` with placeholders (`YOUR_API_KEY`, etc.).
   - Locally (or in CI) copy/rename it to `firebase-config.js` and fill in real values. For GitHub Pages without a build step, you’d need to add the real file only when deploying (e.g. via GitHub Actions using a secret), or accept that the config is in the deployed site (which is still safe as long as rules are correct).

**Summary:** Hosting on GitHub Pages and having the Firebase config in the site is normal and does not, by itself, cause a security issue. Your data is protected by Firestore rules.
