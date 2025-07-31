# Mythrill D&D Server

This is the multiplayer backend server for the Mythrill D&D Virtual Tabletop (VTT) application.

## Features

- **Real-time Communication**: Socket.io for instant messaging and game state synchronization
- **Room Management**: Create and join game rooms with GM/Player roles
- **Chat System**: Real-time chat with typing indicators
- **Player Management**: Track connected players and handle disconnections
- **CORS Support**: Configured for both development and production environments

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration (optional for development)

5. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

### Production Deployment

For production deployment (Heroku, Railway, etc.):

1. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=<your-port>` (optional, defaults to 3001)
   - Update CORS origins in the code to match your frontend domain

2. Start the server:
```bash
npm start
```

## API Endpoints

### REST API

- `GET /health` - Health check endpoint
- `GET /rooms` - List public rooms

### Socket.io Events

#### Client → Server

- `create_room` - Create a new game room
  ```javascript
  socket.emit('create_room', { roomName: 'My Game', gmName: 'GameMaster' });
  ```

- `join_room` - Join an existing room
  ```javascript
  socket.emit('join_room', { roomId: 'room-uuid', playerName: 'Player1' });
  ```

- `chat_message` - Send a chat message
  ```javascript
  socket.emit('chat_message', { message: 'Hello everyone!', type: 'chat' });
  ```

#### Server → Client

- `room_created` - Room successfully created
- `room_joined` - Successfully joined a room
- `player_joined` - Another player joined the room
- `player_left` - A player left the room
- `room_closed` - Room was closed (GM left)
- `chat_message` - New chat message received
- `error` - Error occurred

## Architecture

```
Frontend (React)     Backend (Node.js)
┌─────────────────┐  ┌──────────────────┐
│ Socket.io Client│◄─┤ Socket.io Server │
│ Room Lobby      │  │ Room Management  │
│ Chat Interface  │  │ Chat System      │
│ Game State      │  │ State Sync       │
└─────────────────┘  └──────────────────┘
```

## Data Structures

### Room Object
```javascript
{
  id: 'uuid',
  name: 'Room Name',
  gm: { id: 'uuid', name: 'GM Name', socketId: 'socket-id' },
  players: Map(), // playerId -> player object
  settings: { maxPlayers: 6, isPrivate: false },
  chatHistory: [],
  gameState: { characters: {}, combat: null, mapData: null },
  createdAt: Date
}
```

### Player Object
```javascript
{
  id: 'uuid',
  name: 'Player Name',
  socketId: 'socket-id',
  isGM: false,
  joinedAt: Date
}
```

## Development

### Running in Development

```bash
npm run dev
```

This uses nodemon for automatic restarts when files change.

### Testing

The server includes basic health check and room listing endpoints for testing:

```bash
# Health check
curl http://localhost:3001/health

# List rooms
curl http://localhost:3001/rooms
```

## Future Enhancements

- [ ] Persistent storage (Redis/Database)
- [ ] User authentication
- [ ] Game state synchronization
- [ ] Dice rolling system
- [ ] File upload for maps/tokens
- [ ] Voice chat integration
- [ ] Spectator mode
- [ ] Room passwords
- [ ] Player permissions system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
