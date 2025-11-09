# Firebase Configuration - Visual Guide

## Where to Find Your Firebase Config Values

### Step 1: Open Firebase Console
Go to: **https://console.firebase.google.com/**

### Step 2: Navigate to Project Settings

```
Firebase Console
├─ Your Project Name
│  └─ ⚙️ Gear Icon (top left, next to "Project Overview")
│     └─ "Project settings"
```

### Step 3: Find Your Web App Config

In "Project settings", scroll down to **"Your apps"** section:

```
Project settings
├─ General tab
├─ Service accounts tab
└─ Your apps section
   └─ Web app (</> icon)
      └─ SDK setup and configuration
         └─ Config (radio button)
            └─ Shows your firebaseConfig object
```

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
  authDomain: "my-project-12345.firebaseapp.com",
  projectId: "my-project-12345",
  storageBucket: "my-project-12345.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abcdef1234567890"
};
```

### Step 4: Copy Each Value

Copy each value and paste it into your `client/.env` file:

| Firebase Config | .env Variable Name |
|----------------|-------------------|
| `apiKey` | `REACT_APP_FIREBASE_API_KEY` |
| `authDomain` | `REACT_APP_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `REACT_APP_FIREBASE_PROJECT_ID` |
| `storageBucket` | `REACT_APP_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `REACT_APP_FIREBASE_APP_ID` |

### Step 5: Enable Google Sign-In

```
Firebase Console
├─ Your Project
│  └─ Authentication (left sidebar)
│     └─ Sign-in method (tab)
│        └─ Google
│           └─ Enable toggle → ON
│           └─ Project support email → your-email@example.com
│           └─ Save
```

### Step 6: Get Service Account (Backend)

```
Firebase Console
├─ Your Project
│  └─ ⚙️ Project settings
│     └─ Service accounts (tab)
│        └─ Generate new private key (button)
│           └─ Generate key (confirm)
│           └─ JSON file downloads
```

**Important:** The downloaded JSON file contains sensitive credentials. Keep it secure!

## Example .env Files

### client/.env
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
REACT_APP_FIREBASE_AUTH_DOMAIN=my-project-12345.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=my-project-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=my-project-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=987654321098
REACT_APP_FIREBASE_APP_ID=1:987654321098:web:abcdef1234567890
```

### Root .env
```env
PORT=5001
JWT_SECRET=your-64-character-secret-here
FIREBASE_PROJECT_ID=my-project-12345
```

## Quick Checklist

- [ ] Created Firebase project
- [ ] Added web app to Firebase project
- [ ] Copied Firebase config values
- [ ] Created `client/.env` with Firebase values
- [ ] Enabled Google Sign-In in Firebase Console
- [ ] Got service account JSON (or just project ID)
- [ ] Created root `.env` with `FIREBASE_PROJECT_ID`
- [ ] Restarted development server

## Testing

After configuration:

1. Start server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Click "Sign up with Google"
4. Should see Google Sign-In popup
5. After sign-in, should redirect to dashboard

If you see errors, check:
- Browser console (F12)
- Server console
- That `.env` files are in correct locations
- That you restarted the server after creating `.env` files

