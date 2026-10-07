/**
 * Project 4 — Room and Private-Data Access Boundary.
 *
 * Real registered handlers through the real production middleware stack over a
 * real socket.io transport. Only external boundaries are stubbed by the shared
 * fixture (Firebase token verification, durable membership persistence and
 * character-owner lookup). Cloud rules themselves are covered by the rules
 * emulator matrix.
 */

const { expect } = require('chai');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const firebaseService = require('../services/firebaseService');
const { hashPassword } = require('../handlers/roomHandlers');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
});

const once = (socket, event, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});

const collect = (socket, event, ms) => new Promise((resolve) => {
  const events = [];
  const handler = (payload) => events.push(payload);
  socket.on(event, handler);
  setTimeout(() => {
    socket.off(event, handler);
    resolve(events);
  }, ms);
});

const emitAck = (socket, event, payload, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout for "${event}"`)), timeoutMs);
  socket.emit(event, payload, (response) => {
    clearTimeout(timer);
    resolve(response);
  });
});

describe('Project 4 room and private-data access boundary', function() {
  this.timeout(20000);

  let server;
  let clients;

  beforeEach(async() => {
    server = createProductionStackServer({ debounceMs: 40 });
    await server.start();
    clients = [];
  });

  afterEach(async() => {
    for (const client of clients) {
      try { client.disconnect(); } catch (_) { /* noop */ }
    }
    clients = [];
    try { await server.stop(); } catch (_) { /* noop */ }
  });

  const openVerified = async(provider = 'password') => {
    const userId = server.nextUserId();
    const token = `test-token:${userId}:${Math.random().toString(36).slice(2, 8)}`;
    server.registerAuthToken(token, userId, provider);
    const client = server.connect({ token });
    clients.push(client);
    await connected(client);
    return { client, userId };
  };

  const seedRoomFor = (gm, opts = {}) => server.seedRoom(gm.client.id, {
    gmUserId: gm.userId,
    ...opts
  });

  const join = async(client, roomId, payload = {}) => {
    const joined = once(client, 'room_joined');
    client.emit('join_room', {
      roomId,
      playerName: payload.playerName || 'Player',
      password: payload.password || '',
      ...payload
    });
    return joined;
  };

  const joinError = async(client, roomId, payload = {}) => {
    const error = once(client, 'room_error');
    client.emit('join_room', {
      roomId,
      playerName: payload.playerName || 'Player',
      password: payload.password || '',
      ...payload
    });
    return error;
  };

  // -------------------------------------------------------------------------
  // Durable membership / admission
  // -------------------------------------------------------------------------

  it('password join establishes durable UID entitlement before success', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-membership', password: 'secret' });
    const member = await openVerified();

    const joined = await join(member.client, room.id, { password: 'secret' });
    expect(joined.player.userId).to.equal(member.userId);
    expect(room.members).to.include(member.userId);
  });

  it('membership persistence failure produces zero side effects and no success', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-failure' });
    const member = await openVerified();
    const playersBefore = room.players.size;
    const assignmentsBefore = Object.keys(room.gameState.playerMapAssignments || {}).length;

    const original = firebaseService.addRoomMember;
    firebaseService.addRoomMember = async() => ({ ok: false, reason: 'simulated' });
    try {
      const error = await joinError(member.client, room.id);
      expect(error.code).to.equal('membership_persistence_failed');
      expect(room.players.size).to.equal(playersBefore);
      expect(room.members || []).to.not.include(member.userId);
      expect(Object.keys(room.gameState.playerMapAssignments || {}).length).to.equal(assignmentsBefore);
      expect(server.players.get(member.client.id)).to.equal(undefined);
    } finally {
      firebaseService.addRoomMember = original;
    }
  });

  it('capacity uses the real populated Map and counts distinct member UIDs once', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-capacity' });
    room.settings.maxPlayers = 2;

    // Member A joins on two devices; the same verified UID is one slot.
    const memberA = await openVerified();
    await join(memberA.client, room.id, { playerName: 'Member A' });
    const token2 = `test-token:${memberA.userId}:b`;
    server.registerAuthToken(token2, memberA.userId);
    const memberADevice2 = server.connect({ token: token2 });
    clients.push(memberADevice2);
    await connected(memberADevice2);
    await join(memberADevice2, room.id, { playerName: 'Member A phone' });

    // Member B fills the second slot.
    const memberB = await openVerified();
    await join(memberB.client, room.id, { playerName: 'Member B' });

    const { countActiveMemberSlots } = require('../services/roomAccessService');
    expect(countActiveMemberSlots(room)).to.equal(2);

    // A third distinct member is refused.
    const foreign = await openVerified();
    const error = await joinError(foreign.client, room.id);
    expect(error.code).to.equal('capacity_reached');
  });

  it('a foreign account cannot resume an owned permanent room and changes nothing', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-owner' });
    const foreign = await openVerified();

    const gmSocketBefore = room.gm.socketId;
    const errorPromise = once(foreign.client, 'room_error');
    foreign.client.emit('create_room', {
      gmName: 'Impostor',
      persistentRoomId: room.id,
      roomName: 'Hijack'
    });
    const payload = await errorPromise;
    expect(payload.code).to.equal('owner_required');
    expect(room.gm.socketId).to.equal(gmSocketBefore);
    expect(room.name).to.not.equal('Hijack');
  });

  it('an unowned legacy room requires explicit recovery and is never assigned to the caller', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-unowned' });
    room.gmId = null;

    const claimant = await openVerified();
    const errorPromise = once(claimant.client, 'room_error');
    claimant.client.emit('create_room', {
      gmName: 'Claimant',
      persistentRoomId: room.id,
      roomName: 'Claim'
    });
    const payload = await errorPromise;
    expect(payload.code).to.equal('owner_recovery_required');
    expect(room.gmId).to.equal(null);
  });

  it('concurrent absent-memory resume re-authorizes every waiter and never inherits owner reconstruction', async() => {
    const owner = await openVerified();
    const foreign = await openVerified();
    const roomId = 'persist-concurrent';
    const classification = {
      kind: 'CANONICAL_COMPLETE_CHECKPOINT',
      roomId,
      readOnly: true,
      diagnostics: [],
      revision: 1,
      checkpoint: {
        schemaVersion: 1,
        revision: 1,
        mapIds: [],
        committed: true,
        contentHash: 'a'.repeat(64),
        provenance: {}
      },
      selectedCandidateId: 'split',
      selectedSnapshot: { global: { defaultMapId: 'default' }, maps: {}, mapIds: [] },
      migrationRequired: false,
      roomMetadata: {
        name: 'Reconstructed',
        description: null,
        settings: { maxPlayers: 6 },
        gmId: owner.userId,
        members: [owner.userId],
        passwordHash: null,
        bannedUsers: [],
        isPermanent: true,
        persistentRoomId: roomId
      },
      candidates: { inline: null, split: null },
      selection: null
    };

    const original = firebaseService.readRoomCheckpoint;
    firebaseService.readRoomCheckpoint = async() => classification;
    try {
      const ownerJoined = once(owner.client, 'room_joined');
      const foreignError = once(foreign.client, 'room_error');
      owner.client.emit('create_room', { gmName: 'Owner', persistentRoomId: roomId, roomName: 'Room' });
      foreign.client.emit('create_room', { gmName: 'Foreign', persistentRoomId: roomId, roomName: 'Room' });

      await ownerJoined;
      const payload = await foreignError;
      expect(payload.code).to.equal('owner_required');

      const liveRoom = server.rooms.get(roomId);
      expect(liveRoom.gmId).to.equal(owner.userId);
      expect(liveRoom.gm.socketId).to.equal(owner.client.id);
    } finally {
      firebaseService.readRoomCheckpoint = original;
    }
  });

  it('stored password policy survives reconstruction and a request password never replaces it', async() => {
    const owner = await openVerified();
    const roomId = 'persist-password';
    const storedHash = await hashPassword('stored-secret');
    const classification = {
      kind: 'CANONICAL_COMPLETE_CHECKPOINT',
      roomId,
      readOnly: true,
      diagnostics: [],
      revision: 2,
      checkpoint: {
        schemaVersion: 1,
        revision: 2,
        mapIds: [],
        committed: true,
        contentHash: 'b'.repeat(64),
        provenance: {}
      },
      selectedCandidateId: 'split',
      selectedSnapshot: { global: { defaultMapId: 'default' }, maps: {}, mapIds: [] },
      migrationRequired: false,
      roomMetadata: {
        name: 'Locked Room',
        description: null,
        settings: { maxPlayers: 6 },
        gmId: owner.userId,
        members: [owner.userId],
        passwordHash: storedHash,
        bannedUsers: [],
        isPermanent: true,
        persistentRoomId: roomId
      },
      candidates: { inline: null, split: null },
      selection: null
    };

    const originalRead = firebaseService.readRoomCheckpoint;
    const originalAdd = firebaseService.addRoomMember;
    firebaseService.readRoomCheckpoint = async() => classification;
    firebaseService.addRoomMember = async() => ({ ok: true });
    try {
      const ownerJoined = once(owner.client, 'room_joined');
      owner.client.emit('create_room', {
        gmName: 'Owner',
        persistentRoomId: roomId,
        roomName: 'Locked Room',
        password: 'request-password-must-not-persist'
      });
      await ownerJoined;

      const liveRoom = server.rooms.get(roomId);
      expect(liveRoom.passwordHash).to.equal(classification.roomMetadata.passwordHash);

      const member = await openVerified();
      const wrong = await joinError(member.client, roomId, { password: 'request-password-must-not-persist' });
      expect(wrong.code).to.equal('invalid_password');
    } finally {
      firebaseService.readRoomCheckpoint = originalRead;
      firebaseService.addRoomMember = originalAdd;
    }
  });

  it('anonymous identities cannot gain durable permanent-room membership (H2)', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-h2' });
    const anonymous = await openVerified('anonymous');

    const error = await joinError(anonymous.client, room.id);
    expect(error.code).to.equal('account_required');
    expect(room.members || []).to.not.include(anonymous.userId);
  });

  it('tokenless guests are rejected from join_room entirely', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-guest' });
    const guest = server.connect({ guest: true });
    clients.push(guest);
    await connected(guest);

    const authError = once(guest, 'auth_error');
    guest.emit('join_room', { roomId: room.id, playerName: 'Guest', password: '' });
    await authError;
    expect(server.players.get(guest.id)).to.equal(undefined);
  });

  it('kick revokes durable entitlement and detaches every matching device', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-kick' });
    const member = await openVerified();
    await join(member.client, room.id, { playerName: 'Kick Me' });
    expect(room.members).to.include(member.userId);

    const kicked = once(member.client, 'player_kicked');
    gm.client.emit('kick_player', { playerId: Array.from(room.players.values()).find(p => p.userId === member.userId).id });
    await kicked;

    expect(room.members || []).to.not.include(member.userId);
    expect(Array.from(room.players.values()).some(p => p.userId === member.userId)).to.equal(false);
  });

  it('request_my_rooms returns a verified metadata listing including inactive rooms', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-myrooms' });
    room.isActive = false;

    const response = await emitAck(gm.client, 'request_my_rooms', {});
    expect(response.success).to.equal(true);
    const listed = response.rooms.find(r => r.id === room.id);
    expect(listed).to.exist;
    expect(listed.userRole).to.equal('gm');
    expect(listed).to.not.have.property('gameState');
    expect(listed).to.not.have.property('passwordHash');
  });

  // -------------------------------------------------------------------------
  // Invitations
  // -------------------------------------------------------------------------

  it('invitation acceptance enforces intended recipient, expiry, one-time use and no pre-creation', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-invite' });
    const intended = await openVerified();
    const wrong = await openVerified();

    const invitation = {
      version: 1,
      kind: 'room',
      id: 'inv-1',
      roomId: room.id,
      fromUserId: gm.userId,
      toUserId: intended.userId,
      role: 'member',
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000
    };
    server.partyInvitations.set(invitation.id, invitation);

    // Wrong recipient cannot consume it.
    const wrongError = once(wrong.client, 'join_error');
    wrong.client.emit('respond_to_room_invitation', { invitationId: 'inv-1', roomId: room.id, accepted: true });
    expect((await wrongError).code).to.equal('invitation_wrong_recipient');
    expect(server.partyInvitations.get('inv-1').status).to.equal('pending');

    // Invalid invitation creates no player record.
    const invalidError = once(wrong.client, 'join_error');
    wrong.client.emit('respond_to_room_invitation', { invitationId: 'does-not-exist', accepted: true });
    expect((await invalidError).code).to.equal('invitation_reissue_required');
    expect(server.players.get(wrong.client.id)).to.equal(undefined);

    // Intended recipient succeeds and consumes it.
    const joined = once(intended.client, 'room_joined');
    intended.client.emit('respond_to_room_invitation', { invitationId: 'inv-1', roomId: room.id, accepted: true });
    await joined;
    expect(server.partyInvitations.get('inv-1').status).to.equal('accepted');
    expect(room.members).to.include(intended.userId);

    // One-time: a second acceptance is consumed, not another admission.
    const replayError = once(intended.client, 'join_error');
    intended.client.emit('respond_to_room_invitation', { invitationId: 'inv-1', roomId: room.id, accepted: true });
    expect((await replayError).code).to.equal('invitation_consumed');
  });

  it('expired invitations fail with invitation_expired', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-expiry' });
    const recipient = await openVerified();
    server.partyInvitations.set('inv-expired', {
      version: 1,
      kind: 'room',
      id: 'inv-expired',
      roomId: room.id,
      fromUserId: gm.userId,
      toUserId: recipient.userId,
      role: 'member',
      status: 'pending',
      createdAt: Date.now() - 60000,
      expiresAt: Date.now() - 1
    });

    const error = once(recipient.client, 'join_error');
    recipient.client.emit('respond_to_room_invitation', { invitationId: 'inv-expired', roomId: room.id, accepted: true });
    expect((await error).code).to.equal('invitation_expired');
  });

  it('a social party invitation never authorizes room admission', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-social' });
    const recipient = await openVerified();
    server.partyInvitations.set('party-1', {
      id: 'party-1',
      kind: 'party',
      partyId: 'p1',
      fromUserId: gm.userId,
      toUserId: recipient.userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000
    });

    const error = once(recipient.client, 'join_error');
    recipient.client.emit('respond_to_room_invitation', { invitationId: 'party-1', roomId: room.id, accepted: true });
    expect((await error).code).to.equal('invitation_reissue_required');
    expect(room.members || []).to.not.include(recipient.userId);
  });

  it('a GM unrelated to the request room cannot approve it', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-approve-a' });
    const otherGm = await openVerified();
    await seedRoomFor(otherGm, { persistentRoomId: 'persist-approve-b' });
    const requester = await openVerified();

    const requestEvent = once(gm.client, 'session_join_request');
    requester.client.emit('request_to_join_session', {
      leaderId: gm.userId,
      roomId: room.id,
      requesterName: 'Requester'
    });
    const request = await requestEvent;

    const error = once(otherGm.client, 'join_error');
    otherGm.client.emit('respond_to_join_request', { requestId: request.id, accepted: true });
    expect((await error).code).to.equal('gm_required');
  });

  // -------------------------------------------------------------------------
  // Private inventory + consent
  // -------------------------------------------------------------------------

  it('private inventory reaches only the owner devices and never the room', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-inventory' });
    const owner = await openVerified();
    await join(owner.client, room.id, { playerName: 'Owner' });

    const token2 = `test-token:${owner.userId}:device2`;
    server.registerAuthToken(token2, owner.userId);
    const device2 = server.connect({ token: token2 });
    clients.push(device2);
    await connected(device2);
    await join(device2, room.id, { playerName: 'Owner phone' });

    server.setCharacterOwner('char-owner', owner.userId);

    const gmReceipts = collect(gm.client, 'inventory_update', 400);
    const ownerDevice2 = once(device2, 'inventory_update');

    owner.client.emit('inventory_update', {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'u-1',
      inventoryData: { items: [{ id: 'sword' }], changeType: 'full' }
    });

    const received = await ownerDevice2;
    expect(received.playerId).to.equal('char-owner');
    expect(received.inventoryData.items[0].id).to.equal('sword');
    expect(await gmReceipts).to.have.length(0);
  });

  it('a foreign member cannot author or receive another account inventory, and forged selectors do not redirect', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-forge' });
    const owner = await openVerified();
    await join(owner.client, room.id, { playerName: 'Owner' });
    const foreign = await openVerified();
    await join(foreign.client, room.id, { playerName: 'Foreign' });

    server.setCharacterOwner('char-owner', owner.userId);

    const foreignReceipts = collect(foreign.client, 'inventory_update', 400);
    owner.client.emit('inventory_update', {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'u-2',
      inventoryData: { items: [], changeType: 'full' }
    });
    // Foreign member receives nothing.
    expect(await foreignReceipts).to.have.length(0);

    // A forged author selector cannot attribute a foreign account's inventory.
    const ownerReceipts = collect(owner.client, 'inventory_update', 400);
    foreign.client.emit('inventory_update', {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'u-3',
      inventoryData: { items: [{ id: 'forged' }], changeType: 'full' }
    });
    expect(await ownerReceipts).to.have.length(0);
  });

  it('GM inventory visibility requires explicit owner consent, is read-only, revocable and does not survive session end', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-consent' });
    const owner = await openVerified();
    await join(owner.client, room.id, { playerName: 'Owner' });
    server.setCharacterOwner('char-owner', owner.userId);

    // No consent: GM receives nothing.
    const preConsent = collect(gm.client, 'inventory_update', 300);
    owner.client.emit('inventory_update', {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'u-pre',
      inventoryData: { items: [{ id: 'secret' }], changeType: 'full' }
    });
    expect(await preConsent).to.have.length(0);

    // Grant consent.
    const grantAck = await emitAck(owner.client, 'inventory_share_grant', {
      roomId: room.id,
      characterId: 'char-owner'
    });
    expect(grantAck.success).to.equal(true);
    expect(room.inventoryShares['char-owner'].gmUserId).to.equal(gm.userId);

    // Consented projection reaches the bound GM only.
    const gmShared = once(gm.client, 'inventory_update');
    owner.client.emit('inventory_update', {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'u-shared',
      inventoryData: { items: [{ id: 'shared' }], changeType: 'full' }
    });
    const shared = await gmShared;
    expect(shared.sharedWithGm).to.equal(true);
    expect(shared.inventoryData.items[0].id).to.equal('shared');

    // Revoke stops delivery.
    const revokeAck = await emitAck(owner.client, 'inventory_share_revoke', {
      roomId: room.id,
      characterId: 'char-owner'
    });
    expect(revokeAck.success).to.equal(true);
    const afterRevoke = collect(gm.client, 'inventory_update', 300);
    owner.client.emit('inventory_update', {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'u-after',
      inventoryData: { items: [{ id: 'hidden-again' }], changeType: 'full' }
    });
    expect(await afterRevoke).to.have.length(0);

    // A GM session end terminates every share.
    await emitAck(owner.client, 'inventory_share_grant', { roomId: room.id, characterId: 'char-owner' });
    gm.client.emit('leave_room');
    await wait(150);
    expect(room.inventoryShares).to.deep.equal({});
  });

  it('duplicate inventory updates apply once and never echo back to the sender', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-dup' });
    const owner = await openVerified();
    await join(owner.client, room.id, { playerName: 'Owner' });
    const token2 = `test-token:${owner.userId}:device2`;
    server.registerAuthToken(token2, owner.userId);
    const device2 = server.connect({ token: token2 });
    clients.push(device2);
    await connected(device2);
    await join(device2, room.id, { playerName: 'Owner phone' });
    server.setCharacterOwner('char-owner', owner.userId);

    const senderEcho = collect(owner.client, 'inventory_update', 400);
    const receipts = collect(device2, 'inventory_update', 500);
    const payload = {
      roomId: room.id,
      playerId: 'char-owner',
      updateId: 'dup-1',
      inventoryData: { item: { id: 'potion' }, changeType: 'add_item' }
    };
    owner.client.emit('inventory_update', payload);
    owner.client.emit('inventory_update', payload);

    const received = await receipts;
    expect(received).to.have.length(1);
    expect(await senderEcho).to.have.length(0);
  });

  it('private inventory is absent from every alternate shared envelope', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-envelopes' });
    const member = await openVerified();

    const gmPlayerJoined = once(gm.client, 'player_joined');
    const joined = await join(member.client, room.id, {
      playerName: 'Member',
      character: {
        id: 'char-envelope',
        name: 'Envelope',
        health: { current: 10, max: 10 },
        inventory: { items: [{ id: 'private-sword' }] },
        currency: { gold: 99 }
      }
    });
    // The joining member's own projection is redacted.
    expect(joined.player.character.inventory).to.equal(undefined);
    expect(joined.player.character.currency).to.equal(undefined);
    // The GM's presence projection is redacted.
    const presence = await gmPlayerJoined;
    expect(presence.player.character.inventory).to.equal(undefined);

    // Character update envelope is redacted.
    const charUpdate = once(gm.client, 'character_updated');
    member.client.emit('character_updated', {
      roomId: room.id,
      characterId: 'char-envelope',
      character: { inventory: { items: [{ id: 'private-sword' }] }, name: 'Envelope' }
    });
    const updated = await charUpdate;
    expect(updated.character.inventory).to.equal(undefined);

    // Full sync envelope is redacted.
    const sync = once(gm.client, 'full_game_state_sync');
    gm.client.emit('request_full_sync', { mapId: 'default' });
    const syncPayload = await sync;
    for (const player of syncPayload.players || []) {
      if (player.character) {
        expect(player.character.inventory).to.equal(undefined);
        expect(player.character.currency).to.equal(undefined);
      }
    }
  });

  // -------------------------------------------------------------------------
  // Bounded metadata / deletion
  // -------------------------------------------------------------------------

  it('bounded GM metadata edits succeed; arbitrary settings are refused', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-metadata' });

    const ok = await emitAck(gm.client, 'update_room_metadata', {
      roomId: room.id,
      name: 'Renamed Hall',
      description: 'A quieter hall'
    });
    expect(ok.success).to.equal(true);
    expect(room.name).to.equal('Renamed Hall');

    const bad = await emitAck(gm.client, 'update_room_metadata', {
      roomId: room.id,
      members: ['intruder']
    });
    expect(bad.success).to.equal(false);
    expect(room.members || []).to.not.include('intruder');
  });

  it('canonical deletion is a server-mediated owner operation', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-delete' });
    const foreign = await openVerified();
    await join(foreign.client, room.id, { playerName: 'Foreign' });

    const denied = await emitAck(foreign.client, 'delete_room', { roomId: room.id });
    expect(denied.success).to.equal(false);
    expect(denied.code).to.equal('owner_required');
    expect(server.rooms.has(room.id)).to.equal(true);

    const allowed = await emitAck(gm.client, 'delete_room', { roomId: room.id });
    expect(allowed.success).to.equal(true);
    expect(server.rooms.has(room.id)).to.equal(false);
  });

  it('unowned legacy deletion is refused with owner_recovery_required', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm, { persistentRoomId: 'persist-delete-unowned' });
    room.gmId = null;

    const refused = await emitAck(gm.client, 'delete_room', { roomId: room.id });
    expect(refused.success).to.equal(false);
    expect(refused.code).to.equal('owner_recovery_required');
    expect(server.rooms.has(room.id)).to.equal(true);
  });
});
