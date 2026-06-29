/**
 * Socket Handler Tests
 * 
 * Tests for all socket event handlers
 * Run: npm run test:socket
 */

const { expect } = require('chai');
const sinon = require('sinon');

// Mock dependencies
const mockIo = () => {
  const socketsMap = new Map();
  const handlers = {};
  return {
    sockets: {
      sockets: socketsMap
    },
    to: sinon.stub().returns({ emit: sinon.stub() }),
    emit: sinon.stub(),
    use: sinon.stub(),
    on: sinon.stub().callsFake((event, handler) => {
      handlers[event] = handler;
    }),
    handlers
  };
};

const mockSocket = (id = 'test-socket-id') => {
  const handlers = {};
  return {
    id,
    data: {},
    join: sinon.stub(),
    leave: sinon.stub(),
    emit: sinon.stub(),
    to: sinon.stub().returns({ emit: sinon.stub() }),
    handshake: { auth: {}, headers: {} },
    on: sinon.stub().callsFake((event, handler) => {
      handlers[event] = handler;
    }),
    handlers
  };
};

const createMockRooms = () => new Map();
const createMockPlayers = () => new Map();
const createMockParties = () => new Map();

describe('Socket Handlers', function() {
  this.timeout(10000);
  
  let io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations;
  let helpers, services;

  beforeEach(() => {
    io = mockIo();
    rooms = createMockRooms();
    players = createMockPlayers();
    parties = createMockParties();
    userToParty = new Map();
    partyInvitations = new Map();
    onlineSocialUsers = new Map();
    pendingPartyCreations = new Map();

    helpers = {
      createRoom: sinon.stub().resolves({
        id: 'room-123',
        name: 'Test Room',
        gm: { id: 'room-123', name: 'Test GM' },
        players: new Map(),
        gameState: { maps: { default: {} } }
      }),
      hashPassword: sinon.stub().resolves('hashed-password'),
      verifyPassword: sinon.stub().resolves(true),
      getPublicRooms: sinon.stub().returns([]),
      validateRoomMembership: sinon.stub().returns({ 
        valid: true, 
        player: { id: 'player-1', name: 'Test Player' }, 
        room: { id: 'room-1', gameState: { maps: {} }, players: new Map() } 
      }),
      mergeRoomGameStateForResume: sinon.stub().returns({})
    };

    services = {
      firebaseBatchWriter: { queueWrite: sinon.stub(), flush: sinon.stub().resolves() },
      movementDebouncer: { queueMove: sinon.stub(), flush: sinon.stub(), flushCallback: null },
      eventBatcher: { queue: sinon.stub() },
      realtimeSync: { sync: sinon.stub() }
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  const getConnectedSocket = (id = 'socket-1') => {
    const socket = mockSocket(id);
    io.sockets.sockets.set(id, socket);
    const { registerSocketHandlers } = require('../handlers/socketHandlers');
    registerSocketHandlers(io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services);
    
    // Trigger connection
    const connectionHandler = io.on.getCall(0).args[1];
    connectionHandler(socket);
    return socket;
  };

  describe('Connection Handler', () => {
    it('should register connection handler', () => {
      const { registerSocketHandlers } = require('../handlers/socketHandlers');
      registerSocketHandlers(io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services);
      
      expect(io.on.calledWith('connection')).to.be.true;
    });
  });

  describe('Ping Handler', () => {
    it('should respond to ping with pong', () => {
      const socket = getConnectedSocket('socket-1');
      
      socket.handlers['ping']();
      expect(socket.emit.calledWith('pong', sinon.match.has('timestamp'))).to.be.true;
    });
  });

  describe('Room Creation', () => {
    it('should create room successfully', async () => {
      const mockRoom = {
        id: 'room-123',
        name: 'Test Room',
        gm: { id: 'room-123', name: 'Test GM' },
        players: new Map(),
        gameState: { maps: {} }
      };
      
      helpers.createRoom.resolves(mockRoom);
      
      const result = await helpers.createRoom('Test Room', 'Test GM', 'socket-1', '', '#d4af37', false);
      
      expect(result).to.exist;
      expect(result.name).to.equal('Test Room');
    });

    it('should fail without GM name', async () => {
      helpers.createRoom.resolves(null);
      
      const result = await helpers.createRoom('', '', 'socket-1', '', '#d4af37', false);
      
      expect(result).to.be.null;
    });
  });

  describe('Token Handlers', () => {
    let mockRoom, mockMap, socket;

    beforeEach(() => {
      mockMap = {
        tokens: {},
        characterTokens: {},
        gridItems: {}
      };
      
      mockRoom = {
        id: 'room-1',
        gameState: {
          maps: { 'default': mockMap },
          tokens: {},
          defaultMapId: 'default'
        },
        players: new Map()
      };
      
      rooms.set('room-1', mockRoom);

      helpers.validateRoomMembership = sinon.stub().returns({
        valid: true,
        player: { id: 'player-1', name: 'Test Player' },
        room: mockRoom
      });

      socket = getConnectedSocket('socket-1');
    });

    it('should create token successfully', async () => {
      const ackCallback = sinon.stub();
      const tokenData = {
        id: 'token-1',
        position: { x: 100, y: 100 },
        name: 'Test Token'
      };

      await socket.handlers['token_created']({
        roomId: 'room-1',
        mapId: 'default',
        token: tokenData
      }, ackCallback);

      expect(mockMap.tokens['token-1']).to.exist;
      expect(mockMap.tokens['token-1'].name).to.equal('Test Token');
      expect(ackCallback.calledWith(sinon.match({ success: true }))).to.be.true;
    });

    it('should queue token movement', async () => {
      mockMap.tokens['token-1'] = { id: 'token-1', position: { x: 100, y: 100 } };
      
      await socket.handlers['token_moved']({
        roomId: 'room-1',
        mapId: 'default',
        tokenId: 'token-1',
        position: { x: 200, y: 200 },
        velocity: { x: 1, y: 1 }
      });
      
      expect(services.movementDebouncer.queueMove.calledWith('room-1', 'token-1', sinon.match({
        position: { x: 200, y: 200 },
        velocity: { x: 1, y: 1 }
      }))).to.be.true;
    });

    it('should update token state', async () => {
      mockMap.tokens['token-1'] = { id: 'token-1', name: 'Old Name' };
      
      await socket.handlers['token_updated']({
        roomId: 'room-1',
        mapId: 'default',
        tokenId: 'token-1',
        updates: { name: 'New Name' }
      });
      
      expect(mockMap.tokens['token-1'].name).to.equal('New Name');
    });

    it('should remove token successfully', async () => {
      mockMap.tokens['token-1'] = { id: 'token-1' };
      
      await socket.handlers['token_removed']({
        roomId: 'room-1',
        mapId: 'default',
        tokenId: 'token-1'
      });
      
      expect(mockMap.tokens['token-1']).to.be.undefined;
    });
  });

  describe('Character Resource Updates', () => {
    let mockPlayer, mockRoom, socket;

    beforeEach(() => {
      mockPlayer = {
        id: 'player-1',
        name: 'Test Player',
        character: {
          health: { current: 45, max: 50 },
          mana: { current: 45, max: 50 },
          actionPoints: { current: 2, max: 3 }
        }
      };
      
      mockRoom = {
        id: 'room-1',
        gameState: { maps: {} },
        players: new Map([['player-1', mockPlayer]])
      };
      
      rooms.set('room-1', mockRoom);

      helpers.validateRoomMembership = sinon.stub().returns({
        valid: true,
        player: mockPlayer,
        room: mockRoom
      });

      socket = getConnectedSocket('socket-1');
    });

    it('should update resource state via character_resource_updated', async () => {
      await socket.handlers['character_resource_updated']({
        roomId: 'room-1',
        playerId: 'player-1',
        resource: 'health',
        current: 30,
        max: 50
      });
      
      expect(mockPlayer.character.health.current).to.equal(30);
    });

    it('should apply positive resource delta', async () => {
      await socket.handlers['character_resource_delta']({
        roomId: 'room-1',
        resource: 'health',
        delta: 2
      });
      
      expect(mockPlayer.character.health.current).to.equal(47);
    });

    it('should apply negative resource delta and clamp to 0', async () => {
      await socket.handlers['character_resource_delta']({
        roomId: 'room-1',
        resource: 'mana',
        delta: -100
      });
      
      expect(mockPlayer.character.mana.current).to.equal(0);
    });

    it('should clamp resource delta to max health', async () => {
      await socket.handlers['character_resource_delta']({
        roomId: 'room-1',
        resource: 'health',
        delta: 100
      });
      
      expect(mockPlayer.character.health.current).to.equal(50);
    });
  });

  describe('Chat Handlers', () => {
    let mockRoom, socket;

    beforeEach(() => {
      mockRoom = {
        id: 'room-1',
        chatHistory: [],
        gameState: { maps: {} },
        players: new Map()
      };
      
      rooms.set('room-1', mockRoom);

      helpers.validateRoomMembership = sinon.stub().returns({
        valid: true,
        player: { id: 'player-1', name: 'Test Player' },
        room: mockRoom
      });

      socket = getConnectedSocket('socket-1');

      // Populate players map so chatHandlers can resolve sender
      players.set('socket-1', {
        id: 'player-1',
        name: 'Test Player',
        roomId: 'room-1',
        isGM: false
      });
    });

    it('should add chat message to history', async () => {
      await socket.handlers['chat_message']({
        roomId: 'room-1',
        message: 'Hello!',
        type: 'chat'
      });
      
      expect(mockRoom.chatHistory).to.have.lengthOf(1);
      expect(mockRoom.chatHistory[0].content).to.equal('Hello!');
    });

    it('should limit chat history to 500 messages', async () => {
      // Pre-fill history with 499 messages
      for (let i = 0; i < 499; i++) {
        mockRoom.chatHistory.push({ id: `msg-${i}`, content: `Msg ${i}` });
      }

      // Add two more messages via socket
      await socket.handlers['chat_message']({ roomId: 'room-1', message: 'Hello 1', type: 'chat' });
      await socket.handlers['chat_message']({ roomId: 'room-1', message: 'Hello 2', type: 'chat' });
      
      expect(mockRoom.chatHistory).to.have.lengthOf(500);
      expect(mockRoom.chatHistory[0].content).to.equal('Msg 1');
    });
  });

  describe('Combat Handlers', () => {
    let mockPlayer, mockRoom, socket;

    beforeEach(() => {
      mockPlayer = {
        id: 'player-1',
        name: 'Test Player',
        isGM: true
      };
      
      mockRoom = {
        id: 'room-1',
        gameState: {
          maps: {},
          combat: {
            isActive: false,
            currentTurnIndex: 0,
            turnOrder: [],
            round: 0
          }
        },
        players: new Map([['player-1', mockPlayer]])
      };
      
      rooms.set('room-1', mockRoom);

      helpers.validateRoomMembership = sinon.stub().returns({
        valid: true,
        player: mockPlayer,
        room: mockRoom
      });

      socket = getConnectedSocket('socket-1');
    });

    it('should start combat', async () => {
      const ackCallback = sinon.stub();
      const turnOrder = [
        { tokenId: 't1', name: 'Legolas' },
        { tokenId: 't2', name: 'Goblin' }
      ];

      await socket.handlers['combat_started']({
        roomId: 'room-1',
        turnOrder,
        currentTurnIndex: 0,
        round: 1
      }, ackCallback);

      expect(mockRoom.gameState.combat.isActive).to.be.true;
      expect(mockRoom.gameState.combat.turnOrder).to.have.lengthOf(2);
      expect(mockRoom.gameState.combat.round).to.equal(1);
      expect(ackCallback.calledWith(sinon.match({ success: true }))).to.be.true;
    });

    it('should end combat', async () => {
      mockRoom.gameState.combat.isActive = true;
      const ackCallback = sinon.stub();

      await socket.handlers['combat_ended']({
        roomId: 'room-1'
      }, ackCallback);

      expect(mockRoom.gameState.combat.isActive).to.be.false;
      expect(ackCallback.calledWith(sinon.match({ success: true }))).to.be.true;
    });

    it('should advance turn', async () => {
      mockRoom.gameState.combat = {
        isActive: true,
        currentTurnIndex: 0,
        turnOrder: [
          { tokenId: 't1', name: 'Legolas' },
          { tokenId: 't2', name: 'Goblin' }
        ],
        round: 1
      };

      await socket.handlers['combat_turn_changed']({
        roomId: 'room-1',
        currentTurnIndex: 1,
        round: 1
      });

      expect(mockRoom.gameState.combat.currentTurnIndex).to.equal(1);
    });

    it('should increment round when turn order cycles', async () => {
      mockRoom.gameState.combat = {
        isActive: true,
        currentTurnIndex: 1,
        turnOrder: [
          { tokenId: 't1', name: 'Legolas' },
          { tokenId: 't2', name: 'Goblin' }
        ],
        round: 1
      };

      await socket.handlers['combat_turn_changed']({
        roomId: 'room-1',
        currentTurnIndex: 0,
        round: 2
      });

      expect(mockRoom.gameState.combat.currentTurnIndex).to.equal(0);
      expect(mockRoom.gameState.combat.round).to.equal(2);
    });
  });

  describe('Party System', () => {
    let socket;

    beforeEach(() => {
      socket = getConnectedSocket('socket-1');
      socket.data.userId = 'player-1';
    });

    it('should create party', async () => {
      await socket.handlers['create_party']({
        partyName: 'Adventure Party',
        leaderData: { name: 'Leader' }
      });
      
      const partyId = userToParty.get('player-1');
      expect(partyId).to.exist;
      expect(parties.has(partyId)).to.be.true;
      expect(parties.get(partyId).name).to.equal('Adventure Party');
    });

    it('should add member to party', async () => {
      const partyId = 'party-1';
      parties.set(partyId, {
        id: partyId,
        name: 'Test Party',
        leaderId: 'player-1',
        members: {
          'player-1': { id: 'player-1', name: 'Leader', isLeader: true }
        }
      });
      userToParty.set('player-1', partyId);
      
      const socket2 = getConnectedSocket('socket-2');
      socket2.data.userId = 'player-2';

      await socket2.handlers['join_party']({ partyId });

      const party = parties.get(partyId);
      expect(Object.keys(party.members)).to.have.lengthOf(2);
      expect(userToParty.get('player-2')).to.equal(partyId);
    });

    it('should remove member from party', async () => {
      const partyId = 'party-1';
      parties.set(partyId, {
        id: partyId,
        name: 'Test Party',
        leaderId: 'player-1',
        members: {
          'player-1': { id: 'player-1', name: 'Leader', isLeader: true },
          'player-2': { id: 'player-2', name: 'Member', isLeader: false }
        }
      });
      userToParty.set('player-1', partyId);
      userToParty.set('player-2', partyId);

      const socket2 = getConnectedSocket('socket-2');
      socket2.data.userId = 'player-2';

      await socket2.handlers['leave_party']();

      const party = parties.get(partyId);
      expect(Object.keys(party.members)).to.have.lengthOf(1);
      expect(party.members['player-2']).to.be.undefined;
      expect(userToParty.get('player-2')).to.be.undefined;
    });

    it('should disband party when leader leaves', async () => {
      const partyId = 'party-1';
      parties.set(partyId, {
        id: partyId,
        name: 'Test Party',
        leaderId: 'player-1',
        members: {
          'player-1': { id: 'player-1', name: 'Leader', isLeader: true }
        }
      });
      userToParty.set('player-1', partyId);

      await socket.handlers['leave_party']();

      expect(parties.has(partyId)).to.be.false;
      expect(userToParty.get('player-1')).to.be.undefined;
    });
  });

  describe('Movement Debouncer', () => {
    it('should queue movement', () => {
      const { MovementDebouncer } = require('../services/syncService');
      const debouncer = new MovementDebouncer(50);
      
      debouncer.queueMove('room-1', 'token-1', {
        position: { x: 100, y: 100 },
        velocity: { x: 1, y: 0 },
        playerId: 'player-1'
      });
      
      expect(debouncer.pendingMoves.has('room-1_token-1')).to.be.true;
      
      debouncer.stop();
    });

    it('should overwrite pending movement for same token', () => {
      const { MovementDebouncer } = require('../services/syncService');
      const debouncer = new MovementDebouncer(50);
      
      debouncer.queueMove('room-1', 'token-1', {
        position: { x: 100, y: 100 },
        playerId: 'player-1'
      });
      
      debouncer.queueMove('room-1', 'token-1', {
        position: { x: 150, y: 150 },
        playerId: 'player-1'
      });
      
      const pending = debouncer.pendingMoves.get('room-1_token-1');
      expect(pending.position).to.deep.equal({ x: 150, y: 150 });
      
      debouncer.stop();
    });
  });

  describe('Firebase Batch Writer', () => {
    it('should queue write', () => {
      const { FirebaseBatchWriter } = require('../services/syncService');
      const writer = new FirebaseBatchWriter(500, 50);
      
      writer.queueWrite('room-1', { tokens: {} });
      
      expect(writer.pendingWrites.has('room-1')).to.be.true;
      
      writer.stop();
    });

    it('should flush on max batch size', async () => {
      const { FirebaseBatchWriter } = require('../services/syncService');
      const writer = new FirebaseBatchWriter(50000, 3); // Max 3
      
      writer.queueWrite('room-1', { tokens: {} });
      writer.queueWrite('room-2', { tokens: {} });
      writer.queueWrite('room-3', { tokens: {} });
      
      // Should have flushed after 3
      await sleep(100);
      
      expect(writer.pendingWrites.size).to.equal(0);
      
      writer.stop();
    });
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  mockIo,
  mockSocket,
  createMockRooms,
  createMockPlayers,
  createMockParties
};
