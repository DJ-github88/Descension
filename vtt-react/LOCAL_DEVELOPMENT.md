# Local Development with Production Backend

This guide explains how to run the frontend locally on `localhost:3000` while connecting to the production Railway backend for testing real multiplayer/realtime behavior.

## Overview

- **Backend**: Always online on Railway at `https://descension-mythrill.up.railway.app`
- **Frontend Production**: Deployed at `https://mythrill.netlify.app`
- **Frontend Local**: Runs on `localhost:3000` for testing

## Configuration

### Environment Variables

The frontend uses different environment files based on how it's run:

- **Local Development** (`.env.development`): Points to Railway production backend
- **Production Build** (`.env.production`): Also points to Railway production backend

Both configurations use the same backend URL: `https://descension-mythrill.up.railway.app`

### Backend CORS

The backend server is configured to accept connections from:

**Production Domains:**
- `https://mythrill.netlify.app`
- `https://windtunnel.netlify.app`
- `https://descension-mythrill.netlify.app`

**Local Development:**
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

## Running Locally

### 1. Navigate to Frontend Directory

```bash
cd vtt-react
```

### 2. Install Dependencies (if needed)

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000` and automatically connect to the production Railway backend.

## Testing Multiplayer

### Scenario 1: Test with Two Local Browsers

1. Open `http://localhost:3000` in one browser window (Player 1)
2. Open `http://localhost:3000` in another browser window or incognito tab (Player 2)
3. Player 1 creates a room
4. Player 2 joins the room
5. Test real-time interactions

### Scenario 2: Test Local + Production

1. Open `http://localhost:3000` locally (Developer)
2. Open `https://mythrill.netlify.app` on another device (Tester)
3. Both connect to the same room via the production backend
4. Test multiplayer features without redeploying

### Scenario 3: Test with URL Room Codes

1. Create a room locally
2. Copy the room code from the URL (e.g., `/multiplayer/abc123`)
3. Share with others who can join via production site or local

## Benefits of This Setup

✅ **No Backend Routing**: Frontend initiates all connections  
✅ **Production Backend Stays Online**: No downtime or disruption  
✅ **Fast Local Testing**: No need to redeploy to Netlify  
✅ **Real Multiplayer Testing**: Test with multiple clients  
✅ **Safe Changes**: Production site remains stable while you test locally  

## Deployment

### Deploying Backend Changes

If you make changes to the backend (`/server`):

1. Commit changes to GitHub
2. Railway automatically redeploys
3. Both production and local frontends connect to updated backend

### Deploying Frontend Changes

If you make changes to the frontend (`/vtt-react`):

1. Test locally at `localhost:3000`
2. When ready, commit to GitHub
3. Netlify automatically rebuilds and deploys
4. Production site at `mythrill.netlify.app` is updated

## Troubleshooting

### Can't Connect to Backend

**Check if backend is online:**
```bash
curl https://descension-mythrill.up.railway.app/health
```

**Expected response:**
```json
{"status": "OK", "timestamp": "..."}
```

### CORS Errors

If you see CORS errors in the browser console:

1. Check that the backend includes your origin in allowed origins
2. Verify `REACT_APP_SOCKET_URL` in `.env.development`
3. Clear browser cache and restart frontend

### Socket Connection Issues

**Check the browser console for:**
- WebSocket connection status
- Socket.io transport errors
- Authentication errors

**Common fixes:**
- Ensure you're authenticated (sign in)
- Check Firebase configuration in `.env.development`
- Restart the local development server

## Environment Variables Reference

### Frontend (.env.development)

```bash
REACT_APP_SOCKET_URL=https://descension-mythrill.up.railway.app
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
```

### Backend (Railway Environment)

The backend automatically detects `RAILWAY_ENVIRONMENT` and enables production CORS with localhost support.

## Architecture

```
┌─────────────────────┐
│  localhost:3000     │
│  (Local Frontend)   │
└──────────┬──────────┘
           │ Socket.IO
           │ WebSocket
           ▼
┌─────────────────────────────────┐
│  Railway Backend               │
│  descension-mythrill.up.       │
│  railway.app                   │
│  - CORS allows localhost       │
│  - CORS allows netlify domains │
└──────────┬──────────────────────┘
           │ Socket.IO
           │ WebSocket
           ▼
┌─────────────────────┐
│  mythrill.netlify   │
│  .app               │
│  (Production)       │
└─────────────────────┘
```

## Security Notes

- Backend validates all WebSocket connections
- Firebase authentication required for protected features
- CORS is configured to allow only specific origins
- Guest users can join rooms but have limited permissions

## Next Steps

- Test multiplayer features locally before deploying
- Use Chrome DevTools Network tab to monitor WebSocket traffic
- Check Railway logs for backend connection details
- Report any issues via GitHub Issues
