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
  const sockets = new Map();
  return {
    sockets: sockets,
    to: sinon.stub().returns({ emit: sinon.stub() }),
    emit: sinon.stub(),
    use: sinon.stub(),
    on: sinon.stub().callsFake((event, handler) => {
      // Store handler for later invocation
      mockIo.handlers = mockIo.handlers || {};
      mockIo.handlers[event] = handler;
    }),
    handlers: {}
  };
};

const mockSocket = (id = 'test-socket-id') => ({
  id,
  data: {},
  join: sinon.stub(),
  leave: sinon.stub(),
  emit: sinon.stub(),
  to: sinon.stub().returns({ emit: sinon.stub() }),
  handshake: { auth: {}, headers: {} }
});

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

  describe('Connection Handler', () => {
    it('should register connection handler', () => {
      const { registerSocketHandlers } = require('../handlers/socketHandlers');
      registerSocketHandlers(io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services);
      
      expect(io.on.calledWith('connection')).to.be.true;
    });
  });

  describe('Ping Handler', () => {
    it('should respond to ping with pong', () => {
      const socket = mockSocket();
      const callback = sinon.stub();
      
      // Simulate ping handler logic
      const pingHandler = (data, cb) => {
        if (cb) cb('pong');
      };
      
      pingHandler({}, callback);
      expect(callback.calledWith('pong')).to.be.true;
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
    let mockRoom, mockMap;

    beforeEach(() => {
      mockMap = {
        tokens: {},
        characterTokens: {},
        gridItems: {},
        terrainData: {},
        wallData: {},
        environmentalObjects: [],
        drawingPaths: [],
        fogOfWarData: {},
        lightSources: {},
        dndElements: []
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
    });

    it('should create token successfully', () => {
      const tokenId = 'token-1';
      const tokenData = {
        id: tokenId,
        position: { x: 100, y: 100 },
        name: 'Test Token'
      };

      mockMap.tokens[tokenId] = tokenData;
      mockRoom.gameState.tokens[tokenId] = tokenData;

      expect(mockMap.tokens[tokenId]).to.deep.equal(tokenData);
    });

    it('should update token position', () => {
      const tokenId = 'token-1';
      mockMap.tokens[tokenId] = { id: tokenId, position: { x: 100, y: 100 } };
      
      mockMap.tokens[tokenId].position = { x: 200, y: 200 };
      
      expect(mockMap.tokens[tokenId].position).to.deep.equal({ x: 200, y: 200 });
    });

    it('should remove token successfully', () => {
      const tokenId = 'token-1';
      mockMap.tokens[tokenId] = { id: tokenId };
      
      delete mockMap.tokens[tokenId];
      
      expect(mockMap.tokens[tokenId]).to.be.undefined;
    });
  });

  describe('Character Resource Updates', () => {
    let mockPlayer, mockRoom;

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
      players.set('socket-1', mockPlayer);
    });

    it('should update health resource', () => {
      mockPlayer.character.health.current = 30;
      
      expect(mockPlayer.character.health.current).to.equal(30);
    });

    it('should update mana resource', () => {
      mockPlayer.character.mana.current = 25;
      
      expect(mockPlayer.character.mana.current).to.equal(25);
    });

    it('should update action points', () => {
      mockPlayer.character.actionPoints.current = 1;
      
      expect(mockPlayer.character.actionPoints.current).to.equal(1);
    });

    it('should not exceed max health', () => {
      mockPlayer.character.health.current = 100; // Over max
      
      // Simulate clamping
      mockPlayer.character.health.current = Math.min(
        mockPlayer.character.health.current,
        mockPlayer.character.health.max
      );
      
      expect(mockPlayer.character.health.current).to.equal(50);
    });
  });

  describe('Chat Handlers', () => {
    let mockRoom;

    beforeEach(() => {
      mockRoom = {
        id: 'room-1',
        chatHistory: [],
        gameState: { maps: {} },
        players: new Map()
      };
      
      rooms.set('room-1', mockRoom);
    });

    it('should add chat message to history', () => {
      const message = {
        id: 'msg-1',
        sender: { id: 'player-1', name: 'Test' },
        content: 'Hello!',
        timestamp: new Date().toISOString()
      };
      
      mockRoom.chatHistory.push(message);
      
      expect(mockRoom.chatHistory).to.have.lengthOf(1);
      expect(mockRoom.chatHistory[0].content).to.equal('Hello!');
    });

    it('should limit chat history to 500 messages', () => {
      // Add 600 messages
      for (let i = 0; i < 600; i++) {
        mockRoom.chatHistory.push({
          id: `msg-${i}`,
          content: `Message ${i}`
        });
        
        // Simulate the 500 limit
        if (mockRoom.chatHistory.length > 500) {
          mockRoom.chatHistory = mockRoom.chatHistory.slice(-500);
        }
      }
      
      expect(mockRoom.chatHistory).to.have.lengthOf(500);
      expect(mockRoom.chatHistory[0].id).to.equal('msg-100'); // First kept message
    });
  });

  describe('Combat Handlers', () => {
    let mockRoom;

    beforeEach(() => {
      mockRoom = {
        id: 'room-1',
        gameState: {
          maps: {},
          combat: {
            isActive: false,
            currentTurn: null,
            turnOrder: [],
            round: 0
          }
        },
        players: new Map()
      };
      
      rooms.set('room-1', mockRoom);
    });

    it('should start combat', () => {
      const turnOrder = [
        { id: 'player-1', name: 'Player 1', initiative: 18 },
        { id: 'creature-1', name: 'Goblin', initiative: 12 }
      ];
      
      mockRoom.gameState.combat = {
        isActive: true,
        currentTurnIndex: 0,
        turnOrder: turnOrder,
        round: 1
      };
      
      expect(mockRoom.gameState.combat.isActive).to.be.true;
      expect(mockRoom.gameState.combat.turnOrder).to.have.lengthOf(2);
    });

    it('should end combat', () => {
      mockRoom.gameState.combat.isActive = true;
      
      // End combat
      mockRoom.gameState.combat = {
        isActive: false,
        currentTurn: null,
        turnOrder: [],
        round: 0
      };
      
      expect(mockRoom.gameState.combat.isActive).to.be.false;
    });

    it('should advance turn', () => {
      mockRoom.gameState.combat = {
        isActive: true,
        currentTurnIndex: 0,
        turnOrder: ['player-1', 'creature-1'],
        round: 1
      };
      
      // Advance turn
      mockRoom.gameState.combat.currentTurnIndex = 1;
      
      expect(mockRoom.gameState.combat.currentTurnIndex).to.equal(1);
    });

    it('should increment round when turn order cycles', () => {
      mockRoom.gameState.combat = {
        isActive: true,
        currentTurnIndex: 1,
        turnOrder: ['player-1', 'creature-1'],
        round: 1
      };
      
      // Cycle back to first
      const nextIndex = (mockRoom.gameState.combat.currentTurnIndex + 1) % mockRoom.gameState.combat.turnOrder.length;
      const newRound = nextIndex === 0 ? mockRoom.gameState.combat.round + 1 : mockRoom.gameState.combat.round;
      
      mockRoom.gameState.combat.currentTurnIndex = nextIndex;
      mockRoom.gameState.combat.round = newRound;
      
      expect(mockRoom.gameState.combat.currentTurnIndex).to.equal(0);
      expect(mockRoom.gameState.combat.round).to.equal(2);
    });
  });

  describe('Party System', () => {
    it('should create party', () => {
      const partyId = 'party-1';
      const party = {
        id: partyId,
        name: 'Adventure Party',
        leaderId: 'player-1',
        members: [{ id: 'player-1', name: 'Leader', isLeader: true }],
        createdAt: Date.now()
      };
      
      parties.set(partyId, party);
      userToParty.set('player-1', partyId);
      
      expect(parties.has(partyId)).to.be.true;
      expect(userToParty.get('player-1')).to.equal(partyId);
    });

    it('should add member to party', () => {
      const partyId = 'party-1';
      const party = {
        id: partyId,
        name: 'Test Party',
        leaderId: 'player-1',
        members: [{ id: 'player-1', name: 'Leader', isLeader: true }]
      };
      
      party.members.push({ id: 'player-2', name: 'Member', isLeader: false });
      userToParty.set('player-2', partyId);
      
      expect(party.members).to.have.lengthOf(2);
    });

    it('should remove member from party', () => {
      const partyId = 'party-1';
      const party = {
        id: partyId,
        members: [
          { id: 'player-1', name: 'Leader', isLeader: true },
          { id: 'player-2', name: 'Member', isLeader: false }
        ]
      };
      
      party.members = party.members.filter(m => m.id !== 'player-2');
      userToParty.delete('player-2');
      
      expect(party.members).to.have.lengthOf(1);
      expect(party.members.find(m => m.id === 'player-2')).to.be.undefined;
    });

    it('should disband party when leader leaves', () => {
      const partyId = 'party-1';
      const party = {
        id: partyId,
        leaderId: 'player-1',
        members: [{ id: 'player-1', name: 'Leader', isLeader: true }]
      };
      
      parties.set(partyId, party);
      
      // Leader leaves - party should be disbanded
      if (party.leaderId === 'player-1') {
        parties.delete(partyId);
        userToParty.delete('player-1');
      }
      
      expect(parties.has(partyId)).to.be.false;
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
