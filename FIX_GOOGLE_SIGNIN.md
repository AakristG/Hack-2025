# Fix "Google Sign-In Failed" Error

## The Problem

Your Firebase configuration values are not set yet. The `.env` files have placeholder values that need to be replaced with your actual Firebase credentials.

## Quick Fix Steps

### Step 1: Get Your Firebase Config

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create one if you haven't)
3. **Click the gear icon ⚙️** (top left, next to "Project Overview")
4. **Click "Project settings"**
5. **Scroll down to "Your apps"** section
6. **Find your web app** (or click "Add app" > Web icon `</>` to create one)
7. **Click on the config icon** (looks like `</>` or "SDK setup and configuration")
8. **Copy the config values** - you'll see something like:

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

### Step 2: Update `client/.env`

Open `client/.env` and replace the placeholder values:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
REACT_APP_FIREBASE_AUTH_DOMAIN=my-project-12345.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=my-project-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=my-project-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=987654321098
REACT_APP_FIREBASE_APP_ID=1:987654321098:web:abcdef1234567890
```

**Important:**
- Use YOUR actual values from Firebase Console
- Don't include quotes around the values
- Don't include `const firebaseConfig = {` or `};`
- Just the values themselves

### Step 3: Update Root `.env`

Open `.env` in the root directory and add your project ID:

```env
FIREBASE_PROJECT_ID=my-project-12345
```

(Use the same `projectId` from Step 2)

### Step 4: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **"Authentication"** (left sidebar)
2. Click **"Get started"** if you see it
3. Click the **"Sign-in method"** tab
4. Find **"Google"** in the list and click on it
5. Toggle **"Enable"** to ON
6. Enter your **Project support email** (your email address)
7. Click **"Save"**

### Step 5: Add localhost to Authorized Domains

1. Still in Firebase Console > Authentication
2. Click the **"Settings"** tab
3. Scroll to **"Authorized domains"**
4. Make sure `localhost` is in the list (it should be there by default)
5. If not, click **"Add domain"** and add `localhost`

### Step 6: Restart Your Servers

**IMPORTANT:** You must restart your development servers after changing `.env` files!

1. Stop your current servers (press `Ctrl+C` in the terminal)
2. Start them again:
   ```bash
   npm run dev
   ```

### Step 7: Test Again

1. Open your app: http://localhost:3000
2. Click "Sign up with Google"
3. You should see a Google Sign-In popup
4. Sign in with your Google account
5. You should be redirected to the dashboard

## Still Getting Errors?

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. The new error messages will tell you exactly what's wrong

### Check Server Console
Look at your terminal where the server is running. You should see:
- "Firebase Admin initialized successfully" (if backend is configured)
- Any error messages about Firebase

### Common Issues

**"Firebase is not configured"**
- Make sure `client/.env` has all 6 values
- Make sure you restarted the React dev server

**"Unauthorized domain"**
- Make sure `localhost` is in Firebase authorized domains

**"Operation not allowed"**
- Make sure Google Sign-In is enabled in Firebase Console

**"Invalid API key"**
- Double-check you copied the API key correctly
- Make sure there are no extra spaces

## Need Help?

Check the detailed guides:
- `FIREBASE_QUICK_START.md` - Step-by-step setup
- `FIREBASE_VISUAL_GUIDE.md` - Where to find values in Firebase Console
- `FIREBASE_TROUBLESHOOTING.md` - Common errors and solutions

