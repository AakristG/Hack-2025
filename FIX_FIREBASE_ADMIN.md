# Fix Firebase Admin SDK Error

## The Error

```
Failed to determine project ID: Error while making request: getaddrinfo ENOTFOUND metadata.google.internal
```

This error means Firebase Admin SDK is trying to use default credentials (which only work on Google Cloud Platform), but you're running locally.

## The Solution

You need to provide Firebase Admin SDK with a **Service Account** credential. Here's how:

### Step 1: Get Your Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon ⚙️** next to "Project Overview"
4. Select **"Project settings"**
5. Click the **"Service accounts"** tab
6. Click **"Generate new private key"**
7. Click **"Generate key"** in the confirmation popup
8. A JSON file will download - **keep this secure!**

### Step 2: Add to Your .env File

Open your root `.env` file and add the service account JSON as a single line:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Important:**
- The entire JSON must be on **one line**
- Keep all the `\n` characters in the private key (they're needed)
- Don't add extra quotes around it
- Make sure there are no line breaks

### Step 3: Restart Your Server

After adding `FIREBASE_SERVICE_ACCOUNT` to your `.env` file:

1. Stop your server (Ctrl+C)
2. Restart it: `npm run dev`

### Alternative: Use a Service Account File

If you prefer to use a file instead of environment variable:

1. Save the downloaded JSON file as `server/config/serviceAccountKey.json`
2. Make sure it's in `.gitignore` (don't commit it!)
3. Update `server/config/firebase-admin.js` to use:
   ```javascript
   const serviceAccount = require('./serviceAccountKey.json');
   firebaseAdmin = admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   ```

## Verification

After restarting, you should see:
```
✅ Firebase Admin initialized using service account from environment variable
```

Instead of the error message.

## Security Note

⚠️ **Never commit your service account key to Git!**

- Make sure `.env` is in `.gitignore`
- If using a file, make sure `serviceAccountKey.json` is in `.gitignore`
- The service account key has full access to your Firebase project

## Still Having Issues?

1. Check that the JSON is valid (no syntax errors)
2. Make sure the entire JSON is on one line
3. Check that `FIREBASE_SERVICE_ACCOUNT` is in the **root** `.env` file (not `client/.env`)
4. Verify the server restarted after adding the variable
5. Check server console for initialization messages

