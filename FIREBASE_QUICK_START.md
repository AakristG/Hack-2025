# Firebase Configuration Quick Start

Follow these steps to configure Firebase for Google Sign-In.

## Step 1: Create/Select Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can skip Google Analytics for now)

## Step 2: Get Your Firebase Web App Config

1. In Firebase Console, click the **gear icon ⚙️** next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If you don't have a web app yet:
   - Click **"Add app"** (or the `</>` icon)
   - Register your app with a nickname (e.g., "Customer Satisfaction App")
   - Click **"Register app"**
5. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Copy these values!** You'll need them in the next step.

## Step 3: Enable Google Sign-In

1. In Firebase Console, go to **"Authentication"** (left sidebar)
2. Click **"Get started"** if you see it
3. Click the **"Sign-in method"** tab
4. Click on **"Google"** in the providers list
5. Toggle **"Enable"** to ON
6. Enter your **Project support email** (your email)
7. Click **"Save"**

## Step 4: Create Frontend .env File

Create a file called `.env` in the `client` directory with:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

Replace the values with your actual Firebase config values.

## Step 5: Get Firebase Admin Service Account (Backend)

1. In Firebase Console, go to **"Project settings"** (gear icon)
2. Click the **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the popup
5. A JSON file will download - **keep this safe!**

You have two options for backend config:

### Option A: Use Service Account JSON (Recommended)

Copy the entire JSON content and add it to your root `.env` file as a single line:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

**Important:** The entire JSON must be on one line as a string.

### Option B: Use Project ID Only

Simply add:
```env
FIREBASE_PROJECT_ID=your-project-id
```

## Step 6: Create Root .env File

Create a `.env` file in the root directory (same level as `package.json`):

```env
PORT=5001
JWT_SECRET=your-generated-jwt-secret-here
FIREBASE_PROJECT_ID=your-project-id
# OR use service account:
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## Step 7: Restart Your Servers

After creating/updating `.env` files:

1. Stop your current servers (Ctrl+C)
2. Restart:
   ```bash
   npm run dev
   ```

## Verification

1. Open your app at `http://localhost:3000`
2. Click "Sign up with Google"
3. You should see a Google Sign-In popup
4. After signing in, you should be redirected to the dashboard

## Troubleshooting

### "Firebase configuration is incomplete"
- Make sure all `REACT_APP_FIREBASE_*` variables are in `client/.env`
- Restart the React dev server after adding them

### "Firebase Admin is not initialized"
- Check that `FIREBASE_PROJECT_ID` or `FIREBASE_SERVICE_ACCOUNT` is in root `.env`
- For service account, make sure the JSON is on one line

### "Sign-in popup was blocked"
- Allow popups for localhost in your browser
- Try a different browser

### Still having issues?
- Check the browser console (F12) for errors
- Check the server console for errors
- Make sure both `.env` files are in the correct locations

