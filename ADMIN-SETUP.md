# Admin page setup

The admin page lets you log in (using credentials from Firebase Remote Config), view booking requests with filters and pagination, and mark bookings as done.

## URL

- **Local:** Open `admin.html` (e.g. `http://localhost:8080/admin.html`).
- **Production:** Use `https://yoursite.com/admin.html`. To serve it at `/admin`, configure your host (e.g. Firebase Hosting rewrite: `"source": "/admin", "destination": "/admin.html"`).

## 1. Enable Remote Config

1. In [Firebase Console](https://console.firebase.google.com/) → your project.
2. Go to **Build → Remote Config**.
3. Add two parameters:
   - **Parameter key:** `admin_email`  
     **Default value:** your admin email (e.g. `admin@shivanyalifecare.com`).
   - **Parameter key:** `admin_password`  
     **Default value:** your admin password (keep it strong).
4. Click **Publish changes**.

Login on the admin page checks the entered email and password against these values.

## 2. Firestore rules

The admin page needs **read** and **update** on the `appointments` collection (read to list, update for "Mark as done"). The repo’s `firestore.rules` already include:

- `allow read, update: if true` for `appointments`.

Publish the rules in **Firestore Database → Rules** if you haven’t already.

## 3. Composite index (if required)

If you use the **Today / 1 week / 1 month** filters, Firestore may ask for a composite index. When you first use a filter, check the browser console. If you see an error with a link to create an index, open that link and create the index. It will be for:

- Collection: `appointments`
- Fields: `createdAt` (Descending)

## 4. Behaviour

- **Login:** Email and password are compared to Remote Config `admin_email` and `admin_password`. Session is stored in `sessionStorage` (cleared when the tab is closed).
- **Filters:** Today, 1 week, 1 month, All.
- **Pagination:** 100 bookings per page; **Next** loads the next 100, **First page** resets to the first 100.
- **Mark as done:** Sets `done: true` on the appointment so you can see which ones you’ve contacted.
