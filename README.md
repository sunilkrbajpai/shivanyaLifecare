# Shivanya Lifecare Collection Center – Website

Professional website for **Shivanya Lifecare Collection Center**, an authorized collection center for **Regency Diagnostics**. It includes package listing, appointment booking with phone/details stored in Firebase, and Regency branding.

## Features

- **Hero** – Lab name, “Your Health, Our Priority”, Regency tie-up
- **Packages** – Health checkup packages (Basic Wellness, Comprehensive, Senior Citizen, Women’s Wellness, Diabetes Care, Vitamin & Thyroid) with “Book Now” linking to the form
- **Book Appointment** – Form for name, phone, email, package, preferred date, message (e.g. home collection address); submissions saved to **Firebase Firestore**
- **Contact** – Address, phone, timings; Regency Diagnostics branding and link
- **Regency logo** – Partner badge and footer logo (replace `assets/regency_logo.png` with official asset if you have it)
- **Tests & Price List** – Full list of Regency tests with categories (RD1/RD2/RD3/RD4), MRP, and special discounted price; searchable page and **downloadable PDF** (Name, MRP, Special Price)

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. **Add a web app** in Project settings → Your apps → Add app → Web. Copy the `firebaseConfig` object.
3. Open **`firebase-config.js`** and replace the placeholder values with your config:
   - `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`
4. **Enable Firestore**  
   Build → **Firestore Database** → **Create database**  
   - Start in **test mode** for quick setup (you can tighten rules later).
5. Optional: add security rules so only your app can write (see [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started)).

Form submissions are stored in the **`appointments`** collection with: `name`, `phone`, `email`, `package`, `preferredDate`, `message`, `createdAt`, `source`.

## Before You Go Live

- **Phone number**: Search for `+919876543210` and `9876543210` in `index.html` and replace with your lab’s number.
- **Address**: In the “Visit Us” section, replace `[Your full address here]` with your real address.
- **Regency logo**: If Regency provides an official logo, replace `assets/regency-logo.svg` (or update the `<img src="...">` to their logo URL).

## Hosting (Free Options)

The site is **static** (HTML/CSS/JS). Form submission works by sending data to Firebase from the browser, so **no backend server** is needed.

### Option 1: GitHub Pages

- Push this folder to a GitHub repo.
- Settings → Pages → Source: **Deploy from a branch** → choose `main` (or `gh-pages`) and `/ (root)`.
- Your site will be at `https://<username>.github.io/<repo>/`.
- **Forms work** because they use the Firebase client SDK (no server-side form handling needed).

### Option 2: Netlify

- Sign up at [netlify.com](https://www.netlify.com/).
- Drag-and-drop the project folder, or connect the GitHub repo for auto-deploy.
- Free SSL and custom domain supported.

### Option 3: Vercel

- Sign up at [vercel.com](https://vercel.com/).
- Import the GitHub repo or upload the folder.
- Free SSL and custom domain supported.

### Option 4: Firebase Hosting

- Install Firebase CLI: `npm install -g firebase-tools`
- Login: `firebase login`
- In the project folder: `firebase init hosting` → choose this folder as the public directory, single-page app: No.
- Deploy: `firebase deploy`
- Optional: Connect the same repo in Firebase Console for automatic deploys.

## Running Locally

- Open **`index.html`** in a browser, or use a simple local server, e.g.  
  `npx serve .`  
  or  
  `python3 -m http.server 8000`
- Ensure **`firebase-config.js`** has your real config so the booking form writes to Firestore.

## Tests & Price List (Regency PDF)

Tests are categorized as **RD1**, **RD2**, **RD3**, **RD4** with discounts: **RD1 25% off**, **RD2 15% off**, **RD3 10% off**, **RD4 5% off**. The **Tests & Price** page (`tests.html`) lists all tests with search and links to the downloadable PDF.

To **regenerate** the list and PDF from a new Regency Lucknow PDF:

1. Install: `pip install -r requirements.txt` (needs `pypdf`, `reportlab`).
2. Run:  
   `python3 scripts/parse_regency_pdf.py "/path/to/Regency Lucknow -.pdf"`  
   This overwrites `tests.json` and `assets/Shivanya_Regency_Price_List.pdf`.

You can also pass extracted text:  
`python3 scripts/parse_regency_pdf.py --txt path/to/extracted.txt`

## File Structure

```
├── index.html          # Main page (hero, packages, form, contact)
├── tests.html          # Tests & price list (search + download PDF)
├── tests.json          # Test data (name, category, mrp, specialPrice)
├── styles.css          # Styles
├── app.js              # Form submit, menu, date min, package prefill
├── firebase-config.js  # Your Firebase config (replace placeholders)
├── requirements.txt    # Python deps for price-list script
├── assets/
│   ├── regency_logo.png
│   ├── banner.jpeg
│   ├── shop_image.jpeg
│   └── Shivanya_Regency_Price_List.pdf   # Generated price list PDF
├── scripts/
│   └── parse_regency_pdf.py   # Parse Regency PDF → tests.json + PDF
└── README.md
```

## Design Notes

Layout and content are inspired by diagnostic lab sites such as Apollo Diagnostics (packages, booking, trust badges) and Modern Path (tagline, clarity, NABL). The look is clean and professional with a teal/green medical palette and clear CTAs for booking and calling.

---

© Shivanya Lifecare Collection Center · Authorized collection center for Regency Diagnostics
