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

    it('should hash a password', async() => {
      const password = 'testpassword123';
      const hash = await hashPassword(password);

      expect(hash).to.be.a('string');
      expect(hash).to.not.equal(password);
      expect(hash.length).to.be.greaterThan(50);
    });

    it('should return null for empty password', async() => {
      const hash = await hashPassword('');
      expect(hash).to.be.null;
    });

    it('should return null for null password', async() => {
      const hash = await hashPassword(null);
      expect(hash).to.be.null;
    });

    it('should produce different hashes for same password', async() => {
      const hash1 = await hashPassword('password');
      const hash2 = await hashPassword('password');

      // bcrypt should produce different salts
      expect(hash1).to.not.equal(hash2);
    });
  });

  describe('verifyPassword', () => {
    const { hashPassword, verifyPassword } = require('../handlers/roomHandlers');

    it('should verify correct password', async() => {
      const password = 'correctpassword';
      const hash = await hashPassword(password);

      const result = await verifyPassword(password, hash);
      expect(result).to.be.true;
    });

    it('should reject incorrect password', async() => {
      const password = 'correctpassword';
      const hash = await hashPassword(password);

      const result = await verifyPassword('wrongpassword', hash);
      expect(result).to.be.false;
    });

    it('should allow access when room has no password and user provides none', async() => {
      const result = await verifyPassword(null, null);
      expect(result).to.be.true;
    });

    it('should allow access when room has no password and user provides empty string', async() => {
      const result = await verifyPassword('', null);
      expect(result).to.be.true;
    });

    it('should deny access when room has password and user provides none', async() => {
      const hash = await hashPassword('roompassword');

      const result = await verifyPassword(null, hash);
      expect(result).to.be.false;
    });
  });

  describe('getPublicRooms (Project 4 explicit opt-in discovery)', () => {
    const { getPublicRooms } = require('../handlers/roomHandlers');

    beforeEach(() => {
      // Explicit public opt-in
      rooms.set('room-1', {
        id: 'room-1',
        name: 'Active Public Room',
        isActive: true,
        gm: { name: 'GM 1' },
        players: new Map([['p1', {}]]),
        passwordHash: null,
        settings: { maxPlayers: 6, isPrivate: false },
        createdAt: new Date().toISOString()
      });

      // Active but inactive-room case
      rooms.set('room-2', {
        id: 'room-2',
        name: 'Inactive Room',
        isActive: false,
        gm: { name: 'GM 2' },
        players: new Map(),
        passwordHash: 'hashed',
        settings: { maxPlayers: 6, isPrivate: false },
        createdAt: new Date().toISOString()
      });

      // Explicitly private: hidden from discovery
      rooms.set('room-3', {
        id: 'room-3',
        name: 'Private Room',
        isActive: true,
        gm: { name: 'GM 3' },
        players: new Map([['p2', {}], ['p3', {}]]),
        passwordHash: 'hashed',
        settings: { maxPlayers: 4, isPrivate: true },
        createdAt: new Date().toISOString()
      });

      // Missing/legacy privacy state: unlisted
      rooms.set('room-4', {
        id: 'room-4',
        name: 'Legacy Room Without Privacy State',
        isActive: true,
        gm: { name: 'GM 4' },
        players: new Map(),
        passwordHash: null,
        settings: { maxPlayers: 6 },
        createdAt: new Date().toISOString()
      });

      // Public + password
      rooms.set('room-5', {
        id: 'room-5',
        name: 'Password Public Room',
        isActive: true,
        gm: { name: 'GM 5' },
        players: new Map(),
        passwordHash: 'hashed',
        settings: { maxPlayers: 6, isPrivate: false },
        createdAt: new Date().toISOString()
      });
    });

    it('lists only active rooms with explicit isPrivate === false', () => {
      const publicRooms = getPublicRooms(rooms);
      const ids = publicRooms.map(r => r.id);
      expect(ids).to.have.members(['room-1', 'room-5']);
      expect(ids).to.not.include('room-2'); // inactive
      expect(ids).to.not.include('room-3'); // private
      expect(ids).to.not.include('room-4'); // missing/legacy privacy state
    });

    it('returns exactly the frozen eight discovery fields', () => {
      const publicRooms = getPublicRooms(rooms);
      const room1 = publicRooms.find(r => r.id === 'room-1');
      expect(Object.keys(room1).sort()).to.deep.equal([
        'createdAt', 'gm', 'gmOnline', 'hasPassword', 'id', 'maxPlayers', 'name', 'playerCount'
      ].sort());
      // No raw membership/ownership/state leakage.
      expect(room1).to.not.have.property('gmId');
      expect(room1).to.not.have.property('members');
      expect(room1).to.not.have.property('passwordHash');
      expect(room1).to.not.have.property('gameState');
      expect(room1).to.not.have.property('bannedUsers');
    });

    it('includes correct player count (de-duplicating GM)', () => {
      // Case 1: GM not in players map
      rooms.set('test-1', {
        id: 'test-1',
        isActive: true,
        gm: { id: 'gm-1', name: 'GM 1' },
        players: new Map([['p1', {}]]),
        settings: { isPrivate: false }
      });

      // Case 2: GM IS in players map (e.g. after color update)
      rooms.set('test-2', {
        id: 'test-2',
        isActive: true,
        gm: { id: 'gm-2', name: 'GM 2' },
        players: new Map([['p2', {}], ['gm-2', {}]]),
        settings: { isPrivate: false }
      });

      const publicRooms = getPublicRooms(rooms);

      const roomTest1 = publicRooms.find(r => r.id === 'test-1');
      expect(roomTest1.playerCount).to.equal(2); // 1 player + 1 GM (not in map)

      const roomTest2 = publicRooms.find(r => r.id === 'test-2');
      expect(roomTest2.playerCount).to.equal(2); // 1 player + 1 GM (redundant in map)
    });

    it('reports password status correctly for opted-in rooms', () => {
      const publicRooms = getPublicRooms(rooms);

      const room1 = publicRooms.find(r => r.id === 'room-1');
      expect(room1.hasPassword).to.be.false;

      const room5 = publicRooms.find(r => r.id === 'room-5');
      expect(room5.hasPassword).to.be.true;
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

  describe('resume reconstruction (Project 3 replacement contract)', () => {
    const { mergeRoomGameStateForResume } = require('../handlers/roomHandlers');
    const roomCheckpoint = require('../services/roomCheckpoint');

    it('retires the old concatenating resume merge loudly', () => {
      expect(() => mergeRoomGameStateForResume({ tokens: { t1: {} } }, { tokens: { t2: {} } }))
        .to.throw(/retired \(Project 3\)/);
    });

    it('hydrates one selected snapshot by replacement, including deletions', () => {
      const snapshot = {
        global: { defaultMapId: 'default', combat: { isActive: true, turnOrder: ['a'], currentTurnIndex: 0, round: 2 } },
        maps: {
          default: {
            id: 'default',
            tokens: { t2: { id: 't2' } },
            characterTokens: {},
            gridItems: {},
            terrainData: { '1,1': 'grass' },
            drawingPaths: [{ id: 'stroke-1' }],
            fogOfWarPaths: [{ id: 'fog-1' }],
            environmentalObjects: [{ id: 'obj-1' }]
          }
        },
        mapIds: ['default']
      };

      const first = roomCheckpoint.hydrateSnapshotToGameState(snapshot);
      const second = roomCheckpoint.hydrateSnapshotToGameState(snapshot);

      // Replacement, not concatenation: identical results across hydrations.
      expect(second).to.deep.equal(first);
      expect(Object.keys(second.maps.default.tokens)).to.deep.equal(['t2']);
      expect(second.maps.default.drawingPaths).to.deep.equal([{ id: 'stroke-1' }]);
      expect(second.maps.default.fogOfWarPaths).to.deep.equal([{ id: 'fog-1' }]);
      expect(second.combat.turnOrder).to.deep.equal(['a']);
      expect(second.tokens).to.deep.equal({ t2: { id: 't2' } });
    });

    it('does not resurrect a deleted map or token from a previous live state', () => {
      const snapshot = {
        global: { defaultMapId: 'default', combat: null },
        maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } },
        mapIds: ['default']
      };

      const hydrated = roomCheckpoint.hydrateSnapshotToGameState(snapshot);

      expect(Object.keys(hydrated.maps)).to.deep.equal(['default']);
      expect(hydrated.maps['deleted-map']).to.equal(undefined);
      expect(hydrated.tokens).to.deep.equal({});
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
