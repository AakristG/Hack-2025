# Firebase Google Sign-In Troubleshooting

## Common Errors and Solutions

### 1. "Firebase is not configured"
**Solution:**
- Check that `client/.env` exists and has all Firebase config values
- Make sure all values start with `REACT_APP_`
- Restart your React dev server after adding/updating `.env` file

### 2. "Unauthorized domain" or "auth/unauthorized-domain"
**Solution:**
1. Go to Firebase Console > Authentication > Settings
2. Scroll to "Authorized domains"
3. Add `localhost` if it's not there
4. For production, add your domain

### 3. "Operation not allowed" or "auth/operation-not-allowed"
**Solution:**
1. Go to Firebase Console > Authentication
2. Click "Sign-in method" tab
3. Find "Google" in the list
4. Click on it and toggle "Enable" to ON
5. Enter your project support email
6. Click "Save"

### 4. "Invalid API key" or "auth/invalid-api-key"
**Solution:**
- Double-check your `REACT_APP_FIREBASE_API_KEY` in `client/.env`
- Make sure there are no extra spaces or quotes
- Get a fresh API key from Firebase Console > Project Settings > Your apps

### 5. "Popup blocked" or "auth/popup-blocked"
**Solution:**
- Allow popups for `localhost` in your browser settings
- Try a different browser
- Check if you have a popup blocker extension installed

### 6. "Firebase Admin is not initialized" (Backend Error)
**Solution:**
- Check that `.env` in root directory has `FIREBASE_PROJECT_ID`
- Or use `FIREBASE_SERVICE_ACCOUNT` with full JSON (on one line)
- Restart your backend server after updating `.env`

### 7. "Invalid or expired Firebase token" (Backend Error)
**Solution:**
- Make sure Firebase Admin SDK is properly initialized
- Check server console for initialization errors
- Verify `FIREBASE_PROJECT_ID` matches your frontend config

## Quick Checklist

- [ ] Firebase project created
- [ ] Web app added to Firebase project
- [ ] `client/.env` has all 6 Firebase config values
- [ ] Google Sign-In enabled in Firebase Console
- [ ] `localhost` added to authorized domains
- [ ] Root `.env` has `FIREBASE_PROJECT_ID`
- [ ] Both servers restarted after `.env` changes
- [ ] Browser console checked for errors
- [ ] Server console checked for errors

## Debug Steps

1. **Check Browser Console (F12)**
   - Look for Firebase initialization messages
   - Check for any red error messages
   - Note the exact error code

2. **Check Server Console**
   - Look for "Firebase Admin initialized successfully"
   - Check for any error messages
   - Verify token verification logs

3. **Verify Environment Variables**
   ```bash
   # Check if React can see the variables (in client directory)
   cd client
   node -e "console.log(process.env.REACT_APP_FIREBASE_API_KEY)"
   ```
   Note: This won't work in Node, but you can check the `.env` file directly

4. **Test Firebase Config**
   - Open browser console
   - Type: `console.log(process.env)` (won't show in React, but check Network tab)
   - Or add temporary `console.log` in `firebase.ts` to see config values

5. **Verify Firebase Setup**
   - Go to Firebase Console > Authentication > Users
   - Try signing in - you should see a user appear here if it works
   - Check Authentication > Settings for any warnings

## Still Not Working?

1. **Clear browser cache and localStorage**
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```

2. **Check Firebase Console for errors**
   - Go to Firebase Console > Project Settings
   - Check for any warnings or errors

3. **Verify OAuth Consent Screen** (if using Google Cloud)
   - Go to Google Cloud Console
   - APIs & Services > OAuth consent screen
   - Make sure it's configured

4. **Try incognito/private window**
   - Rules out browser extension issues

5. **Check network tab**
   - Look for failed requests to Firebase
   - Check CORS errors

## Getting More Detailed Errors

The code now logs more detailed error information. Check:
- Browser console for frontend errors
- Server console for backend errors
- Both will show specific error codes and messages

