# Firebase Google Sign-In Setup Guide

This guide will help you configure Firebase Google Sign-In for your application.

## Prerequisites

1. A Firebase project (created at https://console.firebase.google.com/)
2. Google Sign-In enabled in Firebase Authentication
3. Firebase configuration credentials

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. If you don't have a web app, click "Add app" and select the web icon `</>`
7. Register your app with a nickname
8. Copy the Firebase configuration object

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 2: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication**
2. Click **Get started** (if you haven't enabled it)
3. Go to the **Sign-in method** tab
4. Click on **Google**
5. Toggle **Enable**
6. Enter your project support email
7. Click **Save**

## Step 3: Configure Frontend Environment Variables

Create or update `.env` file in the `client` directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Important:** 
- All variables must start with `REACT_APP_` to be accessible in React
- Restart your development server after adding these variables

## Step 4: Configure Backend (Firebase Admin)

You have two options for backend Firebase Admin setup:

### Option A: Using Service Account JSON (Recommended)

1. In Firebase Console, go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Add to your `.env` file in the root directory:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Note:** The entire JSON should be on one line as a string.

### Option B: Using Environment Variables

Add to your `.env` file in the root directory:

```env
FIREBASE_PROJECT_ID=your-project-id
```

This will use default credentials (works in Google Cloud environments).

## Step 5: Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Make sure your domain is listed (localhost is included by default for development)

## Step 6: Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies (from root)
npm install
```

## Step 7: Test the Integration

1. Start your development servers:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Sign up with Google" or "Continue as an Employee"
4. You should see a Google Sign-In popup
5. Select your Google account
6. You should be redirected to the dashboard

## Troubleshooting

### "Firebase configuration is incomplete"
- Check that all `REACT_APP_FIREBASE_*` variables are set in `client/.env`
- Restart your React development server after adding environment variables

### "Firebase Admin is not initialized"
- Make sure you've set either `FIREBASE_SERVICE_ACCOUNT` or `FIREBASE_PROJECT_ID` in your root `.env` file
- For local development, you may need to use a service account JSON

### "Sign-in popup was blocked"
- Check your browser's popup blocker settings
- Try allowing popups for localhost

### "Invalid or expired Firebase token"
- Make sure Firebase Admin is properly configured
- Check that the service account has the correct permissions
- Verify the token hasn't expired (they expire after 1 hour)

### "Email not found in Firebase token"
- Make sure the user has granted email permission during sign-in
- Check Firebase Authentication settings

## Security Notes

1. **Never commit your `.env` files** - They're already in `.gitignore`
2. **Service Account Keys** - Keep them secure, they have admin access
3. **API Keys** - Firebase API keys are safe to expose in frontend code (they're restricted by domain)
4. **Production** - Use environment-specific configurations for production

## Example .env Files

### Root `.env` (Backend)
```env
PORT=5001
JWT_SECRET=your-jwt-secret-here
FIREBASE_PROJECT_ID=your-project-id
# OR use service account:
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

### Client `.env`
```env
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Google Sign-In with Firebase](https://firebase.google.com/docs/auth/web/google-signin)

