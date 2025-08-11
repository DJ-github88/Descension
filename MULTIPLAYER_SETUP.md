# Mythrill Multiplayer System Setup Guide

## 🎯 Overview

Mythrill now features a comprehensive multiplayer system similar to Roll20, with:

- **Persistent Rooms**: Firebase-backed rooms that survive server restarts
- **Real-time Synchronization**: Live updates for tokens, characters, maps, and combat
- **GM/Player Roles**: Full GM controls with player permissions
- **Authentication Integration**: Firebase Auth for user management
- **Hybrid Architecture**: In-memory for performance + Firebase for persistence

## 🏗️ Architecture

### Frontend (React)
- **Room Lobby**: Create/join rooms with Firebase integration
- **Room Service**: Firebase Firestore operations
- **Socket Integration**: Real-time communication with server
- **Game State Sync**: Automatic synchronization of all game elements

### Backend (Node.js + Socket.io)
- **Hybrid Room System**: In-memory + Firebase persistence
- **Firebase Admin SDK**: Server-side Firebase operations
- **Real-time Events**: Socket.io for instant updates
- **Game State Management**: Comprehensive state synchronization

## 🚀 Quick Start

### 1. Server Setup

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

3. **Set Firebase Credentials**:
   - For development: Set `GOOGLE_APPLICATION_CREDENTIALS` path
   - For production: Set `FIREBASE_SERVICE_ACCOUNT_KEY` JSON string

4. **Start Server**:
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd vtt-react
   npm install
   ```

2. **Configure Firebase**:
   - Update `.env.local` with your Firebase config
   - Ensure Firestore security rules are applied

3. **Start Frontend**:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Firebase Setup

1. **Enable Services**:
   - Authentication (Google Sign-in)
   - Firestore Database
   - (Optional) Analytics

2. **Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can manage their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Room management with proper permissions
       match /rooms/{roomId} {
         allow read: if request.auth != null && 
           (request.auth.uid == resource.data.gmId || 
            request.auth.uid in resource.data.members);
         allow create: if request.auth != null && 
           request.auth.uid == request.resource.data.gmId;
         allow update: if request.auth != null && 
           request.auth.uid == resource.data.gmId;
         allow delete: if request.auth != null && 
           request.auth.uid == resource.data.gmId;
       }
     }
   }
   ```

3. **Service Account** (Production):
   - Generate service account key in Firebase Console
   - Set as environment variable: `FIREBASE_SERVICE_ACCOUNT_KEY`

### Server Environment Variables

```bash
# Required
NODE_ENV=production
PORT=3001
FIREBASE_PROJECT_ID=your-project-id

# Production Firebase
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Development Firebase (alternative)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# CORS Configuration
CORS_ORIGIN=https://windtunnel.netlify.app
```

## 🎮 Features

### Room Management
- **Persistent Rooms**: Survive server restarts
- **Password Protection**: Secure room access
- **Member Management**: GM controls who can join
- **Room Discovery**: Browse available rooms

### Real-time Synchronization
- **Token Movement**: Live position updates
- **Character Sheets**: Real-time stat changes
- **Map Updates**: Background and environment changes
- **Combat State**: Turn order and combat tracking
- **Dice Rolls**: Shared roll results
- **Chat System**: Persistent chat history

### GM Controls
- **Full Permissions**: Control all game elements
- **Player Management**: Kick/ban players
- **Game State**: Pause/resume sessions
- **Map Control**: Upload and manage maps
- **Token Ownership**: Assign token permissions

### Player Features
- **Character Management**: Update own character
- **Token Control**: Move assigned tokens
- **Chat Participation**: Send messages and rolls
- **Real-time Updates**: See all game changes live

## 🔄 Data Flow

### Room Creation
1. User creates room in Firebase
2. Server loads room into memory
3. Socket connection established
4. Real-time sync begins

### Game State Updates
1. Player action triggers event
2. Server validates permissions
3. Memory state updated
4. Firebase persistence
5. Broadcast to all players

### Reconnection Handling
1. Player reconnects to server
2. Server loads latest state from Firebase
3. Player receives current game state
4. Real-time sync resumes

## 🚀 Deployment

### Railway (Server)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify (Frontend)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

## 🔍 Troubleshooting

### Common Issues

1. **Firebase Connection Failed**:
   - Check service account credentials
   - Verify project ID
   - Ensure Firestore is enabled

2. **Socket Connection Issues**:
   - Check CORS configuration
   - Verify server URL in frontend
   - Check firewall settings

3. **Permission Denied**:
   - Review Firestore security rules
   - Check user authentication
   - Verify room membership

### Debug Mode

Enable debug logging:
```bash
# Server
DEBUG=socket.io:* npm start

# Frontend
REACT_APP_DEBUG=true npm start
```

## 📈 Scaling Considerations

### Performance Optimization
- **Room Cleanup**: Inactive rooms marked for cleanup
- **Message Limits**: Chat history limited to 100 messages
- **State Compression**: Efficient data structures
- **Connection Pooling**: Optimized database connections

### Future Enhancements
- **Redis Integration**: For horizontal scaling
- **CDN Integration**: For map/asset storage
- **Voice/Video Chat**: WebRTC integration
- **Mobile Support**: Progressive Web App features

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase Console logs
3. Check server logs for errors
4. Verify network connectivity

## 🎉 Next Steps

Your multiplayer system is now ready! Players can:
1. Sign in with Google
2. Create persistent rooms
3. Invite friends with room IDs
4. Play together in real-time
5. Resume sessions anytime

The system automatically saves all progress and synchronizes everything across all connected players, providing a seamless Roll20-like experience!
