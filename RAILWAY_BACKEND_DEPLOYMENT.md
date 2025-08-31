# Railway Backend Server Deployment Guide

## Problem
Your frontend at `https://mythrill.netlify.app` is trying to connect to a backend server at `https://descension-production.up.railway.app`, but Railway is currently deploying your React frontend instead of the backend server.

## Solution
Deploy the backend server to Railway by following these steps:

## Step 1: Update Railway Configuration
✅ **COMPLETED** - The `railway.toml` file has been updated to deploy the backend server instead of the frontend.

## Step 2: Set Up Environment Variables in Railway

1. Go to your Railway dashboard: https://railway.app/dashboard
2. Select your `descension-production` project
3. Go to the **Variables** tab
4. Add the following environment variables:

### Required Environment Variables:

```
NODE_ENV=production
FIREBASE_PROJECT_ID=mythrill-ff7c6
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"mythrill-ff7c6",...}
```

### Getting the Firebase Service Account Key:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your `mythrill-ff7c6` project
3. Go to **Project Settings** > **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file
6. Copy the entire JSON content and paste it as the value for `FIREBASE_SERVICE_ACCOUNT_KEY`

## Step 3: Deploy to Railway

1. Commit and push the updated `railway.toml` file:
   ```bash
   git add railway.toml
   git commit -m "Configure Railway to deploy backend server"
   git push origin main
   ```

2. Railway will automatically redeploy with the new configuration

## Step 4: Verify Deployment

1. Wait for the deployment to complete (check Railway dashboard)
2. Test the health endpoint: https://descension-production.up.railway.app/health
3. You should see a JSON response with server status

## Step 5: Test Frontend Connection

1. Go to https://mythrill.netlify.app
2. Try to access multiplayer features
3. Check browser console for connection success

## Alternative: Use a Different Backend URL

If you prefer to deploy the backend to a different service, you can:

1. Deploy the `server` directory to Heroku, Render, or another platform
2. Update the `REACT_APP_SOCKET_URL` in `netlify.toml` to point to your new backend URL
3. Redeploy the frontend

## Troubleshooting

### If deployment fails:
- Check Railway build logs for errors
- Ensure all environment variables are set correctly
- Verify the Firebase service account key is valid JSON

### If CORS errors persist:
- Check that `https://mythrill.netlify.app` is in the `allowedOrigins` array in `server/server.js`
- Verify the backend server is actually running and accessible

### If Firebase errors occur:
- Verify the Firebase project ID is correct
- Ensure the service account key has the necessary permissions
- Check Firebase console for any project issues

## Current Configuration

The updated `railway.toml` now:
- Builds and runs the backend server from the `server` directory
- Uses `/health` as the health check endpoint
- Sets the required environment variables for production
