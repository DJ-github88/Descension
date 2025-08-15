# Mythrill VTT Multiplayer Deployment Guide

## Overview
This guide covers deploying the Mythrill VTT multiplayer system with:
- **Frontend**: Netlify (React app)
- **Backend**: Railway (Node.js Socket.IO server)

## Prerequisites
- GitHub repository with latest code
- Netlify account
- Railway account (for backend server)

## Backend Deployment (Railway)

### 1. Deploy Server to Railway
1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub repository
3. Select the `server` folder as the root directory
4. Railway will automatically detect the Node.js app

### 2. Configure Environment Variables
Set these in Railway dashboard:
```
NODE_ENV=production
PORT=3001
```

### 3. Get Railway URL
After deployment, Railway will provide a URL like:
`https://descension-production.up.railway.app`

## Frontend Deployment (Netlify)

### 1. Deploy to Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build directory to `vtt-react`
4. Build command: `npm run build`
5. Publish directory: `build`

### 2. Configure Environment Variables
In Netlify dashboard, set:
```
REACT_APP_SOCKET_URL=https://your-railway-url.up.railway.app
```

### 3. Domain Configuration
Your Netlify app will be available at:
`https://windtunnel.netlify.app`

## Testing Multiplayer on Netlify

### 1. Basic Connection Test
1. Visit `https://windtunnel.netlify.app/multiplayer?debug=true`
2. Check the debug panel for environment info
3. Verify socket URL points to Railway server

### 2. Multiplayer Flow Test
1. **Create Room**: Navigate to multiplayer, create a room
2. **Join Room**: Open another browser tab/incognito window
3. **Test Features**:
   - Chat messages between players
   - Player join/leave notifications
   - Token movement synchronization
   - GM crown indicator

### 3. Multi-Device Testing
1. Open on different devices/browsers
2. Test room creation and joining
3. Verify real-time synchronization

## Troubleshooting

### Common Issues

#### 1. Socket Connection Failed
- Check Railway server is running
- Verify REACT_APP_SOCKET_URL environment variable
- Check browser console for CORS errors

#### 2. Chat Not Working
- Verify socket connection is established
- Check server logs for chat message events
- Ensure players are in the same room

#### 3. Players Not Seeing Each Other
- Check player_joined events in server logs
- Verify party system integration
- Check HUD updates

### Debug Tools

#### Environment Debug Panel
Add `?debug=true` to URL to show environment info:
`https://windtunnel.netlify.app/multiplayer?debug=true`

#### Browser Console Logs
Look for these log patterns:
- `🌐 Multiplayer Environment Check`
- `🎮 Player joined event received`
- `💬 Sending chat message`
- `📢 Broadcasting player_joined event`

#### Server Logs (Railway)
Monitor Railway logs for:
- Socket connections
- Room creation/joining
- Chat message broadcasting
- Player events

## Production Checklist

### Before Deployment
- [ ] All code committed to GitHub
- [ ] Environment variables configured
- [ ] CORS settings updated for Netlify domain
- [ ] Socket URL points to Railway server

### After Deployment
- [ ] Frontend builds successfully on Netlify
- [ ] Backend server starts on Railway
- [ ] Socket connection works from Netlify to Railway
- [ ] Room creation and joining works
- [ ] Chat system functions properly
- [ ] Player notifications appear
- [ ] Token movement synchronizes

### Performance Verification
- [ ] Multiple players can join simultaneously
- [ ] Chat messages appear in real-time
- [ ] Token movement is smooth
- [ ] No memory leaks or connection issues
- [ ] Error handling works properly

## Support

If you encounter issues:
1. Check the debug panel (`?debug=true`)
2. Review browser console logs
3. Monitor Railway server logs
4. Verify environment variables are set correctly
5. Test with multiple browser instances

The multiplayer system is designed to be robust and handle connection issues gracefully. All debugging information is logged to help identify and resolve any problems quickly.
