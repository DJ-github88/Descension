# Server Deployment Guide

## Current Issue
The Railway server at `https://descension-production.up.railway.app` is returning 404 errors, indicating it's either down or not properly deployed.

## Quick Fix Options

### Option 1: Redeploy to Railway (Recommended)
1. **Check Railway Dashboard**: Go to [railway.app](https://railway.app) and check your project status
2. **Redeploy**: If the deployment failed, trigger a new deployment
3. **Check Logs**: Look at the deployment logs for any errors

### Option 2: Deploy to a New Service
If Railway is having issues, you can quickly deploy to:

#### Render.com (Free tier available)
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set the following:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add any required env vars

#### Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Add a `Procfile` in the server directory: `web: npm start`
4. Deploy: `git subtree push --prefix server heroku main`

### Option 3: Temporary Local Development
For immediate testing, you can run the server locally:

```bash
cd server
npm install
npm start
```

Then update the React app to use `http://localhost:3001` for development.

## Environment Variables Needed
Make sure these are set in your deployment platform:
- `NODE_ENV=production`
- `PORT` (usually auto-set by the platform)
- Any Firebase or database credentials

## CORS Configuration
The server code has been updated to allow `mythrill.netlify.app`, but the deployment needs to be updated for this to take effect.

## Next Steps
1. Check Railway dashboard and redeploy if needed
2. If Railway is down, consider migrating to Render or Heroku
3. Update the React app's `REACT_APP_SOCKET_URL` environment variable to point to the new server URL
