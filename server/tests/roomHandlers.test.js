/**
 * Room Handler Tests
 * 
 * Tests for room CRUD operations and helper functions
 */

const { expect } = require('chai');
const sinon = require('sinon');

// Mock Firebase service
const mockFirebaseService = {
  saveRoomData: sinon.stub().resolves(true),
  getRoomData: sinon.stub().resolves(null),
  loadPersistentRooms: sinon.stub().resolves([]),
  updateRoomGameState: sinon.stub().resolves(true)
};

describe('Room Handlers', () => {
  let rooms, players;

  beforeEach(() => {
    rooms = new Map();
    players = new Map();

    // Reset stubs
    mockFirebaseService.saveRoomData.reset();
    mockFirebaseService.getRoomData.reset();
    mockFirebaseService.loadPersistentRooms.reset();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('hashPassword', () => {
    const { hashPassword } = require('../handlers/roomHandlers');

    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);

      expect(hash).to.be.a('string');
      expect(hash).to.not.equal(password);
      expect(hash.length).to.be.greaterThan(50);
    });

    it('should return null for empty password', async () => {
      const hash = await hashPassword('');
      expect(hash).to.be.null;
    });

    it('should return null for null password', async () => {
      const hash = await hashPassword(null);
      expect(hash).to.be.null;
    });

    it('should produce different hashes for same password', async () => {
      const hash1 = await hashPassword('password');
      const hash2 = await hashPassword('password');

      // bcrypt should produce different salts
      expect(hash1).to.not.equal(hash2);
    });
  });

  describe('verifyPassword', () => {
    const { hashPassword, verifyPassword } = require('../handlers/roomHandlers');

    it('should verify correct password', async () => {
      const password = 'correctpassword';
      const hash = await hashPassword(password);

      const result = await verifyPassword(password, hash);
      expect(result).to.be.true;
    });

    it('should reject incorrect password', async () => {
      const password = 'correctpassword';
      const hash = await hashPassword(password);

      const result = await verifyPassword('wrongpassword', hash);
      expect(result).to.be.false;
    });

    it('should allow access when room has no password and user provides none', async () => {
      const result = await verifyPassword(null, null);
      expect(result).to.be.true;
    });

    it('should allow access when room has no password and user provides empty string', async () => {
      const result = await verifyPassword('', null);
      expect(result).to.be.true;
    });

    it('should deny access when room has password and user provides none', async () => {
      const hash = await hashPassword('roompassword');

      const result = await verifyPassword(null, hash);
      expect(result).to.be.false;
    });
  });

  describe('getPublicRooms', () => {
    const { getPublicRooms } = require('../handlers/roomHandlers');

    beforeEach(() => {
      // Add test rooms
      rooms.set('room-1', {
        id: 'room-1',
        name: 'Active Room',
        isActive: true,
        gm: { name: 'GM 1' },
        players: new Map([['p1', {}]]),
        passwordHash: null,
        settings: { maxPlayers: 6 },
        createdAt: new Date().toISOString()
      });

      rooms.set('room-2', {
        id: 'room-2',
        name: 'Inactive Room',
        isActive: false,
        gm: { name: 'GM 2' },
        players: new Map(),
        passwordHash: 'hashed',
        settings: { maxPlayers: 6 },
        createdAt: new Date().toISOString()
      });

      rooms.set('room-3', {
        id: 'room-3',
        name: 'Another Active Room',
        isActive: true,
        gm: { name: 'GM 3' },
        players: new Map([['p2', {}], ['p3', {}]]),
        passwordHash: 'hashed',
        settings: { maxPlayers: 4 },
        createdAt: new Date().toISOString()
      });
    });

    it('should return only active rooms', () => {
      const publicRooms = getPublicRooms(rooms);

      expect(publicRooms).to.have.lengthOf(2);
      expect(publicRooms.find(r => r.id === 'room-1')).to.exist;
      expect(publicRooms.find(r => r.id === 'room-2')).to.be.undefined;
    });

    it('should include correct player count (de-duplicating GM)', () => {
      // Case 1: GM not in players map
      rooms.set('test-1', {
        id: 'test-1',
        isActive: true,
        gm: { id: 'gm-1', name: 'GM 1' },
        players: new Map([['p1', {}]]),
      });

      // Case 2: GM IS in players map (e.g. after color update)
      rooms.set('test-2', {
        id: 'test-2',
        isActive: true,
        gm: { id: 'gm-2', name: 'GM 2' },
        players: new Map([['p2', {}], ['gm-2', {}]]),
      });

      const publicRooms = getPublicRooms(rooms);

      const roomTest1 = publicRooms.find(r => r.id === 'test-1');
      expect(roomTest1.playerCount).to.equal(2); // 1 player + 1 GM (not in map)

      const roomTest2 = publicRooms.find(r => r.id === 'test-2');
      expect(roomTest2.playerCount).to.equal(2); // 1 player + 1 GM (redundant in map)
    });

    it('should report password status correctly', () => {
      const publicRooms = getPublicRooms(rooms);

      const room1 = publicRooms.find(r => r.id === 'room-1');
      expect(room1.hasPassword).to.be.false;

      const room3 = publicRooms.find(r => r.id === 'room-3');
      expect(room3.hasPassword).to.be.true;
    });
  });

  describe('validateRoomMembership', () => {
    const { validateRoomMembership } = require('../handlers/roomHandlers');

    it('should return invalid for non-existent player', () => {
      const socket = { id: 'socket-1' };

      const result = validateRoomMembership(socket, 'room-1', false, players, rooms);

      expect(result.valid).to.be.false;
      expect(result.error).to.equal('Player not found');
    });

    it('should return invalid for wrong room', () => {
      const socket = { id: 'socket-1' };
      players.set('socket-1', { id: 'player-1', roomId: 'room-1' });

      const result = validateRoomMembership(socket, 'room-2', false, players, rooms);

      expect(result.valid).to.be.false;
      expect(result.error).to.equal('Not a member of this room');
    });

    it('should return invalid for non-GM trying GM action', () => {
      const socket = { id: 'socket-1' };
      players.set('socket-1', { id: 'player-1', roomId: 'room-1', isGM: false });
      rooms.set('room-1', { id: 'room-1', players: new Map([['player-1', {}]]) });

      const result = validateRoomMembership(socket, 'room-1', true, players, rooms);

      expect(result.valid).to.be.false;
      expect(result.error).to.equal('GM privileges required');
    });

    it('should return valid for GM', () => {
      const socket = { id: 'socket-1' };
      players.set('socket-1', { id: 'player-1', roomId: 'room-1', isGM: true });
      rooms.set('room-1', { id: 'room-1', players: new Map() });

      const result = validateRoomMembership(socket, 'room-1', true, players, rooms);

      expect(result.valid).to.be.true;
      expect(result.player).to.exist;
      expect(result.room).to.exist;
    });

    it('should return valid for regular player in room', () => {
      const socket = { id: 'socket-1' };
      players.set('socket-1', { id: 'player-1', roomId: 'room-1', isGM: false });
      rooms.set('room-1', { id: 'room-1', players: new Map([['player-1', { id: 'player-1' }]]) });

      const result = validateRoomMembership(socket, 'room-1', false, players, rooms);

      expect(result.valid).to.be.true;
    });
  });

  describe('mergeRoomGameStateForResume', () => {
    const { mergeRoomGameStateForResume } = require('../handlers/roomHandlers');

    it('should return base state if resume state is null', () => {
      const baseState = { tokens: { t1: {} } };

      const result = mergeRoomGameStateForResume(baseState, null);

      expect(result).to.equal(baseState);
    });

    it('should merge maps deeply', () => {
      const baseState = {
        maps: {
          'default': {
            tokens: { t1: { x: 0 } },
            gridItems: { g1: {} }
          }
        }
      };

      const resumeState = {
        maps: {
          'default': {
            tokens: { t2: { x: 100 } },
            terrainData: { data: 'new' }
          },
          'new-map': {
            tokens: { t3: {} }
          }
        }
      };

      const result = mergeRoomGameStateForResume(baseState, resumeState);

      expect(result.maps['default'].tokens.t1).to.exist;
      expect(result.maps['default'].tokens.t2).to.exist;
      expect(result.maps['default'].terrainData.data).to.equal('new');
      expect(result.maps['new-map']).to.exist;
    });

    it('should merge combat state', () => {
      const baseState = {
        combat: { isActive: false, turnOrder: [] }
      };

      const resumeState = {
        combat: {
          isActive: true,
          turnOrder: ['player-1', 'creature-1'],
          round: 2
        }
      };

      const result = mergeRoomGameStateForResume(baseState, resumeState);

      expect(result.combat.isActive).to.be.true;
      expect(result.combat.round).to.equal(2);
    });

    it('should merge player map assignments', () => {
      const baseState = {
        playerMapAssignments: { 'player-1': 'default' }
      };

      const resumeState = {
        playerMapAssignments: { 'player-2': 'dungeon', 'player-1': 'forest' }
      };

      const result = mergeRoomGameStateForResume(baseState, resumeState);

      expect(result.playerMapAssignments['player-1']).to.equal('forest');
      expect(result.playerMapAssignments['player-2']).to.equal('dungeon');
    });
  });

  describe('cleanupInactiveRooms', () => {
    const { cleanupInactiveRooms } = require('../handlers/roomHandlers');

    beforeEach(() => {
      // Active room
      rooms.set('room-1', {
        id: 'room-1',
        isActive: true,
        isPermanent: false,
        players: new Map()
      });

      // Inactive room with no players
      rooms.set('room-2', {
        id: 'room-2',
        isActive: false,
        isPermanent: false,
        players: new Map()
      });

      // Inactive room with players (should not be deleted)
      rooms.set('room-3', {
        id: 'room-3',
        isActive: false,
        isPermanent: false,
        players: new Map([['p1', {}]])
      });

      // Permanent room (should never be deleted)
      rooms.set('room-4', {
        id: 'room-4',
        isActive: false,
        isPermanent: true,
        players: new Map()
      });
    });

    it('should remove inactive rooms with no players', () => {
      cleanupInactiveRooms(rooms, players);

      expect(rooms.has('room-1')).to.be.true;
      expect(rooms.has('room-2')).to.be.false;
    });

    it('should not remove rooms with players', () => {
      cleanupInactiveRooms(rooms, players);

      expect(rooms.has('room-3')).to.be.true;
    });

    it('should not remove permanent rooms', () => {
      cleanupInactiveRooms(rooms, players);

      expect(rooms.has('room-4')).to.be.true;
    });
  });
});

module.exports = {
  mockFirebaseService
};
