/**
 * Socket Handlers Module
 * 
 * Contains all socket.on event handlers organized by category:
 * - Room Management (create_room, join_room, leave_room, disconnect)
 * - Token Management (token_created, token_moved, token_updated, etc.)
 * - Character Management (character_updated, character_resource_updated, etc.)
 * - Map/Grid Management (map_update, grid_item_update, sync_map_state, etc.)
 * - GM Actions (gm_switch_view, gm_transfer_player, etc.)
 * - Combat (combat_started, combat_ended, combat_turn_changed)
 * - Chat (chat_message, global_chat_message, whisper_message)
 * - Party System (create_party, join_party, invite_to_party, etc.)
 * - Environment (fog_update, wall_update, light_source_update, etc.)
 * - Utility (ping, health_check, cursor_move, etc.)
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../services/logger');
const firebaseService = require('../services/firebaseService');
const { sanitizeChatMessage, sanitizePlayerName } = require('../services/sanitizationService');
const { ackFailure } = require('../utils/socketAck');
const { canCreateRoom, canJoinRoom } = require('../services/tierService');
const { registerUtilityHandlers } = require('./utilityHandlers');
const { registerTravelHandlers } = require('./travelHandlers');
const { registerChatHandlers } = require('./chatHandlers');
const { registerCombatHandlers } = require('./combatHandlers');
const { registerSyncHandlers } = require('./syncHandlers');
const { registerSessionHandlers } = require('./sessionHandlers');
const { registerTokenHandlers } = require('./tokenHandlers');
const { registerCharacterHandlers } = require('./characterHandlers');
const { registerEnvironmentHandlers } = require('./environmentHandlers');
const { registerMapHandlers } = require('./mapHandlers');
const { registerGmActionHandlers } = require('./gmActionHandlers');
const { registerAudioHandlers } = require('./audioHandlers');
const { registerRoomHandlers } = require('./roomLifecycleHandlers');
const { registerPartyHandlers } = require('./partyHandlers');
const { registerSessionInvitationHandlers } = require('./sessionInvitationHandlers');
const { registerJournalHandlers } = require('./journalHandlers');
const { registerQuestHandlers } = require('./questHandlers');
const { registerGmToolsHandlers } = require('./gmToolsHandlers');

const { INVITATION_EXPIRY_MS } = require('../utils/constants');
const { assertFreshRoomAuthority, attachOperationContext } = require('../services/roomAuthorityService');

// Echo Prevention Window - standardized timeout across all stores
const ECHO_PREVENTION_WINDOW_MS = 200;

/**
 * R5: events that mutate or disclose authoritative room state. Each is wrapped
 * with ONE shared async guard that resolves the SAME canonical target room the
 * handler will operate on, validates the caller's exact captured room token
 * against the local lifecycle and the backend before the handler runs, and
 * attaches the immutable operation context for awaited continuations.
 * Deliberately excluded:
 * - lifecycle/join/leave/disconnect (must always be able to clean up),
 * - global/profile/social/party operations (not room-authoritative),
 * - cursor_move (ephemeral relay with no room state or persistence).
 * Delayed/buffered work is epoch-bound at its own capture point.
 */
const AUTHORITATIVE_ROOM_EVENTS = new Set([
  // authoritative state reads
  'request_room_checkpoint',
  'request_full_sync', 'sync_tokens', 'sync_grid_items', 'sync_character_tokens', 'request_combat_sync',
  'save_room_state_request',
  // tokens
  'token_created', 'token_moved', 'token_updated', 'token_control_granted', 'token_control_response',
  'character_token_created', 'character_token_updated', 'token_removed', 'token_dismissed', 'character_token_removed',
  // characters
  'character_moved', 'character_resource_delta', 'character_updated', 'character_equipment_updated',
  'character_resource_updated', 'buff_update', 'debuff_update',
  // environment
  'container_update', 'creature_added', 'creature_updated', 'wall_update', 'door_state_changed',
  'light_source_update', 'fog_update', 'weather_update', 'drawing_update', 'environmental_object_update',
  // maps
  'update_current_map', 'sync_level_editor_state', 'map_update', 'request_full_map_sync', 'grid_item_update',
  'sync_map_state', 'set_scene_mode', 'sync_location_scene_state', 'sync_party_marker', 'pull_players_to_map',
  // combat
  'combat_started', 'combat_ended', 'combat_log', 'dice_update', 'combat_turn_changed', 'item_looted',
  'inventory_update', 'inventory_share_grant', 'inventory_share_revoke', 'spell_cast', 'dice_roll',
  // shared chat
  'chat_message', 'user_typing', 'user_stopped_typing',
  // audio room state
  'audio_broadcast', 'audio_stop', 'audio_stop_all', 'audio_sync_request',
  // session
  'launch_game_session', 'respond_to_game_session', 'respond_to_room_invitation', 'update_player_color',
  // GM actions
  'gm_switch_view', 'gm_transfer_player', 'gm_request_fresh_positions', 'player_use_connection',
  'gm_action', 'sync_gameplay_settings', 'gm_note_update',
  // GM tools / metadata / access / deletion
  'request_player_list', 'request_room_settings', 'update_room_settings', 'update_room_metadata',
  'mute_player', 'kick_player', 'delete_room', 'leave_room_membership',
  // quests / journals
  'share_quest', 'quest_accepted', 'quest_declined', 'quest_complete_request', 'quest_rewards_delivered',
  'quest_completion_denied', 'journal_show_to_players',
  // travel
  'request_travel_sync', 'travel_sync', 'travel_update', 'travel_broadcast'
]);

/**
 * Account/cloud-targeted events where the payload room id IS the legitimate
 * target (the caller may not be a live member of it). For these the canonical
 * target is the payload room id (falling back to the session room); the
 * handler still performs its own entitlement/ownership proof. Every other
 * authoritative event must target the caller's current session room.
 */
const PAYLOAD_TARGETED_ROOM_EVENTS = new Set([
  'request_room_checkpoint',
  'update_room_metadata',
  'delete_room',
  'create_room_draft'
]);

// Event Sequence Counter - ensures event ordering across socket broadcasts
let eventSequenceNumber = 0;

function getNextEventSequence() {
  return ++eventSequenceNumber;
}

// Map Validation Helper - ensures maps exist before assigning data
function validateMapExists(room, mapId, preferredName = null) {
  if (!room.gameState.maps) {
    room.gameState.maps = {};
  }

  if (!room.gameState.maps[mapId]) {
    let initialName = preferredName;
    if (!initialName) {
      initialName = mapId === 'default' ? 'Default Map' : `Map ${mapId}`;
    }

    room.gameState.maps[mapId] = {
      id: mapId,
      name: initialName,
      tokens: {},
      characterTokens: {},
      gridItems: {},
      terrainData: {},
      wallData: {},
      drawingPaths: [],
      fogOfWarData: [],
      dndElements: [],
      lightSources: {},
      environmentalObjects: [],
      gridSettings: {
        gridType: 'square',
        gridSize: 50,
        gridOffsetX: 0,
        gridOffsetY: 0,
        gridLineColor: '#000000',
        gridLineThickness: 1,
        gridLineOpacity: 0.5,
        gridBackgroundColor: '#d4c5b9',
        viewMode: '2d'
      },
      viewMode: '2d',
      elevationData: {},
      rampData: {},
      sunSettings: {
        azimuth: 135,
        elevation: 45,
        color: '#fff4e0',
        intensity: 1.0,
        ambient: 0.2
      },
      createdAt: new Date()
    };
    logger.debug(`Created new map structure: ${mapId} (${initialName})`);
  } else if (preferredName && (!room.gameState.maps[mapId].name || room.gameState.maps[mapId].name.startsWith('Map '))) {
    room.gameState.maps[mapId].name = preferredName;
  }

  return room.gameState.maps[mapId];
}

/**
 * Register all socket event handlers
 * @param {Object} io - Socket.io server instance
 * @param {Map} rooms - Rooms map (roomId -> room object)
 * @param {Map} players - Players map (socketId -> player object)
 * @param {Map} parties - Parties map (partyId -> party object)
 * @param {Map} userToParty - User to party mapping
 * @param {Map} partyInvitations - Party invitations map
 * @param {Map} onlineSocialUsers - Online social users map
 * @param {Map} pendingPartyCreations - Pending party creations map
 * @param {Object} helpers - Helper functions
 * @param {Function} helpers.createRoom - Create room function
 * @param {Function} helpers.hashPassword - Hash password function
 * @param {Function} helpers.verifyPassword - Verify password function
 * @param {Function} helpers.getPublicRooms - Get public rooms function
 * @param {Function} helpers.validateRoomMembership - Validate room membership
 * @param {Function} helpers.mergeRoomGameStateForResume - Merge game state for resume
 * @param {Object} services - Service instances
 * @param {Object} services.firebaseBatchWriter - Firebase batch writer
 * @param {Object} services.movementDebouncer - Movement debouncer
 * @param {Object} services.eventBatcher - Event batcher
 * @param {Object} services.realtimeSync - Realtime sync engine
 */
function registerSocketHandlers(io, rooms, players, parties, userToParty, partyInvitations, onlineSocialUsers, pendingPartyCreations, helpers, services) {
  const { createRoom, hashPassword, verifyPassword, getPublicRooms, validateRoomMembership, mergeRoomGameStateForResume } = helpers;
  const buildRoomCandidate = helpers.buildRoomCandidate || null;
  const installRoomCandidate = helpers.installRoomCandidate || null;
  const { firebaseBatchWriter, movementDebouncer, eventBatcher, realtimeSync } = services;

  const roomJoinRequests = new Map();

  // Evict expired join requests + party invitations (they carry expiresAt but can
  // linger if never acted upon). Prevents unbounded Map growth.
  setInterval(() => {
    const now = Date.now();
    for (const [id, req] of roomJoinRequests) {
      if (now > (req.expiresAt || 0)) {roomJoinRequests.delete(id);}
    }
    for (const [id, inv] of partyInvitations) {
      if (now > (inv.expiresAt || 0)) {partyInvitations.delete(id);}
    }
  }, INVITATION_EXPIRY_MS);

  io.on('connection', (socket) => {
    logger.info('Player connected', { socketId: socket.id, authenticated: socket.data.authenticated, isGuest: socket.data.isGuest });

    const requireAuth = (callback) => {
      return (...args) => {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
        const allowDevAuth = !isProduction && (process.env.ALLOW_DEV_AUTH === 'true' || process.env.NODE_ENV === 'development');
        if (!socket.data.authenticated) {
          const payload = args[0];
          // Local-development convenience only: auto-authenticate from an event
          // payload. Never in production / without ALLOW_DEV_AUTH.
          if (allowDevAuth && payload && (payload.userId || payload.character?.userId) && !payload.isGuest && payload.userId !== 'guest' && socket.data.isGuest !== true) {
            const devUid = payload.userId || payload.character?.userId;
            socket.data.authenticated = true;
            socket.data.userId = devUid;
            socket.data.isGuest = false;
            logger.info('Socket auto-authenticated in development from event payload', { socketId: socket.id, userId: devUid });
            return callback(...args);
          }

          logger.warn('Unauthenticated socket attempted restricted action', { socketId: socket.id, isGuest: socket.data.isGuest });
          socket.emit('auth_error', { error: 'Authentication required. Please log in to perform this action.' });
          // Do not leave an ack-bearing request waiting on an authorization denial.
          const ack = [...args].reverse().find(a => typeof a === 'function');
          ackFailure(ack, { success: false, error: 'Authentication required', event: 'authorization' });
          return;
        }
        return callback(...args);
      };
    };

    const chatDebugEnabled = process.env.CHAT_DEBUG === 'true' || process.env.NODE_ENV === 'development';
    const chatDebug = (...args) => {
      if (chatDebugEnabled) {
        logger.debug('[chat]', ...args);
      }
    };

    // ==================== SOCIAL/PARTY HELPERS ====================

    const getSocialUserIdFromSocket = (targetSocket = socket) => {
      const directUserId = targetSocket?.data?.userId;
      if (directUserId) {return directUserId;}

      const socialUser = onlineSocialUsers.get(targetSocket.id);
      if (socialUser?.originalUserId) {return socialUser.originalUserId;}
      if (socialUser?.userId) {return socialUser.userId;}

      const roomPlayer = players.get(targetSocket.id);
      if (roomPlayer?.id) {return roomPlayer.id;}

      return null;
    };

    const getOnlineUserById = (userId) => {
      if (!userId) {return null;}

      for (const socialUser of onlineSocialUsers.values()) {
        if (socialUser?.userId === userId || socialUser?.originalUserId === userId) {
          return socialUser;
        }
      }

      return null;
    };

    const getSocketsByUserId = (userId) => {
      if (!userId) {return [];}

      return Array.from(io.sockets.sockets.values()).filter((s) => {
        const socialUser = onlineSocialUsers.get(s.id);
        if (socialUser && (socialUser.userId === userId || socialUser.originalUserId === userId)) {return true;}

        const player = players.get(s.id);
        if (player && (player.id === userId || player.userId === userId)) {return true;}

        if (s.data && s.data.userId === userId) {return true;}

        return false;
      });
    };

    const emitToUserId = (userId, eventName, payload) => {
      const userSockets = getSocketsByUserId(userId);
      userSockets.forEach((s) => s.emit(eventName, payload));
      return userSockets.length;
    };

    const getUserDisplayName = (userId, fallback = 'Unknown') => {
      const socialUser = getOnlineUserById(userId);
      if (!socialUser) {return fallback;}

      return (
        socialUser.name ||
        socialUser.characterName ||
        socialUser.accountName ||
        fallback
      );
    };

    const buildPartyMemberData = (userId, overrides = {}) => {
      const socialUser = getOnlineUserById(userId) || {};
      const userSockets = getSocketsByUserId(userId);

      const characterClass =
        overrides.characterClass ||
        socialUser.characterClass ||
        socialUser.class ||
        socialUser.character?.class ||
        'Unknown';

      const characterLevel =
        overrides.characterLevel ||
        socialUser.characterLevel ||
        socialUser.level ||
        socialUser.character?.level ||
        1;

      const defaultCharacter = {
        class: characterClass,
        level: characterLevel,
        health: { current: 45, max: 50 },
        mana: { current: 45, max: 50 },
        actionPoints: { current: 1, max: 3 }
      };

      const mergedCharacter = {
        ...defaultCharacter,
        ...(socialUser.character || {}),
        ...(overrides.character || {}),
        health: {
          ...defaultCharacter.health,
          ...(socialUser.character?.health || {}),
          ...(overrides.character?.health || {})
        },
        mana: {
          ...defaultCharacter.mana,
          ...(socialUser.character?.mana || {}),
          ...(overrides.character?.mana || {})
        },
        actionPoints: {
          ...defaultCharacter.actionPoints,
          ...(socialUser.character?.actionPoints || {}),
          ...(overrides.character?.actionPoints || {})
        }
      };

      const displayName =
        overrides.name ||
        overrides.characterName ||
        socialUser.name ||
        socialUser.characterName ||
        socialUser.accountName ||
        getUserDisplayName(userId, 'Unknown');

      return {
        id: userId,
        userId,
        socketId: userSockets[0]?.id || socialUser.socketId || null,
        name: displayName,
        characterName: overrides.characterName || socialUser.characterName || displayName,
        characterClass,
        characterLevel,
        character: mergedCharacter,
        health: mergedCharacter.health,
        mana: mergedCharacter.mana,
        actionPoints: mergedCharacter.actionPoints,
        status: socialUser.status || 'online',
        isConnected: userSockets.length > 0,
        isGM: !!overrides.isGM,
        joinedAt: overrides.joinedAt || Date.now()
      };
    };

    const getPartyByUserId = (userId) => {
      const partyId = userToParty.get(userId);
      if (!partyId) {return null;}

      const party = parties.get(partyId);
      if (!party) {
        userToParty.delete(userId);
        return null;
      }

      return party;
    };

    const emitToPartyMembers = (party, eventName, payload) => {
      if (!party?.members) {return;}

      Object.keys(party.members).forEach((memberUserId) => {
        emitToUserId(memberUserId, eventName, payload);
      });
    };

    /**
     * Handle party member departure (called by leave_party and disconnect)
     * Handles edge case of multiple tabs/windows: only removes from party if no other connections exist
     * @param {string} userId - User ID leaving the party
     * @param {string} userName - User's display name
     * @param {string} socketId - Socket ID (for multi-tab detection)
     */
    const handlePartyLeave = (userId, userName, socketId) => {
      if (!userId) {
        logger.debug('[handlePartyLeave] No userId provided, skipping');
        return;
      }

      const partyId = userToParty.get(userId);
      if (!partyId) {
        logger.debug('[handlePartyLeave] User not in any party', { userId });
        return;
      }

      const party = parties.get(partyId);
      if (!party) {
        logger.warn('[handlePartyLeave] Party not found', { partyId, userId });
        userToParty.delete(userId);
        return;
      }

      // EDGE CASE: Check if user has other active connections (multiple tabs/windows)
      const userSockets = getSocketsByUserId(userId);
      const hasOtherConnections = userSockets.some(s => s.id !== socketId && s.connected);

      if (hasOtherConnections) {
        logger.info('[handlePartyLeave] User has other active connections, keeping in party', {
          userId,
          socketId,
          otherSocketCount: userSockets.filter(s => s.id !== socketId && s.connected).length
        });
        return;
      }

      // Remove member from party
      delete party.members[userId];
      userToParty.delete(userId);

      // Check if party should be disbanded
      const remainingMemberIds = Object.keys(party.members);
      if (remainingMemberIds.length === 0 || party.leaderId === userId) {
        // Disband party
        logger.info('[handlePartyLeave] Disbanding party', {
          partyId,
          partyName: party.name,
          reason: remainingMemberIds.length === 0 ? 'empty' : 'leader_left',
          leaderId: party.leaderId,
          leavingUserId: userId
        });

        remainingMemberIds.forEach(memberId => {
          userToParty.delete(memberId);
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_disbanded', { partyId, partyName: party.name, reason: 'leader_left' }));
        });
        parties.delete(partyId);
      } else {
        // Notify remaining members
        logger.info('[handlePartyLeave] Member left party, notifying others', {
          userId,
          userName,
          partyId,
          remainingMembers: remainingMemberIds.length
        });

        remainingMemberIds.forEach(memberId => {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_member_left', {
            partyId,
            memberId: userId,
            memberName: userName
          }));
        });
      }
    };

    const notifyPartyMembersOfGMJoin = (userId, roomId, gmData, explicitPartyMembers = []) => {
      logger.info('GM joined room - checking for party', { userId, roomId, gmName: gmData.name, explicitPartyCount: explicitPartyMembers.length });

      const room = rooms.get(roomId);
      if (!room) {
        logger.warn('Room not found for GM session notification');
        return;
      }

      const roomMemberUserIds = new Set();
      for (const [socketId, player] of players.entries()) {
        if (player.roomId === roomId) {
          const s = io.sockets.sockets.get(socketId);
          if (s?.data?.userId) {
            roomMemberUserIds.add(s.data.userId);
          }
          const socialUser = onlineSocialUsers.get(socketId);
          if (socialUser?.userId) {
            roomMemberUserIds.add(socialUser.userId);
          }
        }
      }

      const notifiedSocketIds = new Set();

      const sendInvitationToSockets = (targetSockets, partyName = room.name, partyId = 'explicit-party') => {
        if (!targetSockets || targetSockets.length === 0) {return;}

        // P4: room invitations are typed and recipient-bound. Socket ids are
        // delivery hints only; the verified account UID is the recipient.
        const byRecipientUid = new Map();
        for (const s of targetSockets) {
          const recipientUid = s && s.data && s.data.userId;
          if (!recipientUid || recipientUid === userId) {continue;}
          if (!byRecipientUid.has(recipientUid)) {byRecipientUid.set(recipientUid, []);}
          byRecipientUid.get(recipientUid).push(s);
        }

        for (const [recipientUid, recipientSockets] of byRecipientUid.entries()) {
          const invitation = {
            version: 1,
            kind: 'room',
            id: uuidv4(),
            partyId,
            roomId,
            fromUserId: userId,
            toUserId: recipientUid,
            role: 'member',
            partyName: room.name || partyName,
            roomName: room.name,
            gmName: gmData.name,
            gmCharacterName: gmData.characterName,
            gmClass: gmData.characterClass,
            gmLevel: gmData.characterLevel,
            isPermanent: room.isPermanent || false,
            roomDescription: room.settings?.description || gmData.description || room.description || '',
            description: room.settings?.description || gmData.description || room.description || '',
            currentPlayers: Array.from(room.players.values()).filter(p => !p.isGM).map(p => ({
              id: p.id,
              name: p.name,
              class: p.character?.class || 'Unknown'
            })),
            status: 'pending',
            createdAt: Date.now(),
            expiresAt: Date.now() + INVITATION_EXPIRY_MS
          };

          partyInvitations.set(invitation.id, invitation);

          recipientSockets.forEach(s => {
            if (!notifiedSocketIds.has(s.id)) {
              notifiedSocketIds.add(s.id);
              s.emit('gm_session_invitation', invitation);
              logger.info('GM session invitation sent to recipient', { socketId: s.id, roomId, recipientUid });
            }
          });
        }
      };

      const partyId = userToParty.get(userId);
      logger.info('Party lookup result', { userId, partyId, userToPartySize: userToParty.size });

      if (partyId && parties.has(partyId)) {
        const party = parties.get(partyId);
        logger.info('Party found', {
          partyId,
          partyName: party.name,
          isActive: party.isActive,
          leaderId: party.leaderId,
          memberCount: Object.keys(party.members).length,
          memberIds: Object.keys(party.members)
        });

        if (party.isActive !== false) {
          logger.info('GM has active party, notifying members', { partyId, partyName: party.name });

          const partyMembersNotInRoom = Object.keys(party.members).filter(memberId => {
            const isGM = memberId === party.leaderId || memberId === userId;
            const isAlreadyInRoom = roomMemberUserIds.has(memberId);
            return !isGM && !isAlreadyInRoom;
          });

          logger.info('Party members to invite from social party', { partyMembersNotInRoom, count: partyMembersNotInRoom.length });

          partyMembersNotInRoom.forEach(memberId => {
            const memberSockets = getSocketsByUserId(memberId);
            sendInvitationToSockets(memberSockets, party.name, partyId);
          });
        }
      }

      // Also process explicit party members passed in room creation
      if (Array.isArray(explicitPartyMembers) && explicitPartyMembers.length > 0) {
        explicitPartyMembers.forEach(member => {
          const memberId = member.userId || member.id;
          if (memberId && memberId !== userId && memberId !== 'current-player' && !roomMemberUserIds.has(memberId)) {
            let memberSockets = getSocketsByUserId(memberId);
            if (memberSockets.length === 0 && member.socketId) {
              const directSocket = io.sockets.sockets.get(member.socketId);
              if (directSocket) {memberSockets = [directSocket];}
            }
            sendInvitationToSockets(memberSockets, room.name, partyId || 'explicit-party');
          }
        });
      }
    };

    // Hook up movement debouncer flush callback
    if (!movementDebouncer.flushCallback) {
      movementDebouncer.flushCallback = () => {
        movementDebouncer.flush(io, rooms, players);
      };
    }

    // Utility to strip undefined values from objects before Firestore write
    // Firestore crashes with "invalid data" error if fields are explicitly undefined
    const stripUndefined = (obj) => {
      if (obj === null || typeof obj !== 'object') {return obj;}
      if (Array.isArray(obj)) {return obj.map(stripUndefined);}

      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          newObj[key] = stripUndefined(value);
        }
      }
      return newObj;
    };

    // Shared handler context - threads all closures needed by extracted domain modules
    const handlerCtx = {
      io,
      socket,
      rooms,
      players,
      parties,
      userToParty,
      partyInvitations,
      onlineSocialUsers,
      pendingPartyCreations,
      roomJoinRequests,
      logger,
      uuidv4,
      sanitizeChatMessage,
      sanitizePlayerName,
      firebaseService,
      canCreateRoom,
      canJoinRoom,
      requireAuth,
      chatDebug,
      createRoom,
      buildRoomCandidate,
      installRoomCandidate,
      hashPassword,
      verifyPassword,
      getPublicRooms,
      validateRoomMembership,
      mergeRoomGameStateForResume,
      firebaseBatchWriter,
      movementDebouncer,
      eventBatcher,
      realtimeSync,
      authorityService: services.authorityService || null,
      getNextEventSequence,
      ECHO_PREVENTION_WINDOW_MS,
      validateMapExists,
      getSocialUserIdFromSocket,
      getOnlineUserById,
      getSocketsByUserId,
      emitToUserId,
      getUserDisplayName,
      buildPartyMemberData,
      getPartyByUserId,
      emitToPartyMembers,
      handlePartyLeave,
      notifyPartyMembersOfGMJoin,
      stripUndefined
    };

    // R5/R1: one shared fresh-authority guard for every authoritative room
    // event. The canonical target is the room the handler will actually
    // operate on, resolved from server-side session state - never trusted from
    // the client alone. A client room id contradicting the session room is
    // rejected before the handler runs. The exact captured token is validated
    // locally AND freshly against the backend, and the immutable operation
    // context is attached to the payload so awaited continuations revalidate
    // the SAME epoch (never a successor token resolved by roomId).
    const originalOn = socket.on.bind(socket);
    socket.on = (event, handler) => {
      if (typeof handler !== 'function' || !AUTHORITATIVE_ROOM_EVENTS.has(event)) {
        return originalOn(event, handler);
      }
      return originalOn(event, async(...args) => {
        const data = args[0];
        const deny = (code, message = 'Room is not currently available on this server') => {
          socket.emit('room_error', {
            code,
            event,
            message
          });
          const ack = [...args].reverse().find((arg) => typeof arg === 'function');
          ackFailure(ack, {
            success: false,
            error: message,
            code,
            event
          });
        };
        try {
          const roomAuthority = services.authorityService || null;
          if (roomAuthority) {
            // C1: capture the IMMUTABLE operation binding before any await.
            const player = players.get(socket.id) || null;
            const playerRoomId = (player && typeof player.roomId === 'string' && player.roomId) || null;
            const clientRoomId = (data && typeof data === 'object' && typeof data.roomId === 'string' && data.roomId)
              || null;
            const payloadTargeted = PAYLOAD_TARGETED_ROOM_EVENTS.has(event);
            if (!payloadTargeted && clientRoomId && playerRoomId && clientRoomId !== playerRoomId) {
              deny('room_target_mismatch', 'Not a member of this room');
              return;
            }
            const canonicalRoomId = payloadTargeted
              ? (clientRoomId || playerRoomId)
              : playerRoomId;
            const room = canonicalRoomId ? rooms.get(canonicalRoomId) : null;
            const captured = {
              socketId: socket.id,
              player,
              playerId: player ? player.id : null,
              userId: (player && player.userId) || (socket.data && socket.data.userId) || null,
              roomId: canonicalRoomId || null,
              room: room || null,
              token: room && room.authorityToken ? room.authorityToken : null,
              payloadTargeted
            };
            if (room) {
              const check = await assertFreshRoomAuthority(room, roomAuthority);
              if (!check.ok) {
                deny(check.code || 'room_authority_lost');
                return;
              }
              // C1: after the authority await the operation may continue ONLY
              // against the exact runtime/binding it started with. It may never
              // migrate to a replacement room, successor runtime or replacement
              // player binding.
              const currentPlayer = players.get(socket.id) || null;
              const runtimeChanged = rooms.get(canonicalRoomId) !== captured.room;
              const playerChanged = payloadTargeted
                ? false
                : (!currentPlayer ||
                   currentPlayer !== captured.player ||
                   currentPlayer.roomId !== captured.roomId ||
                   (captured.playerId && currentPlayer.id !== captured.playerId));
              const tokenChanged = !!(captured.token && room.authorityToken &&
                (room.authorityToken.authorityInstanceId !== captured.token.authorityInstanceId ||
                 room.authorityToken.authorityGeneration !== captured.token.authorityGeneration));
              if (runtimeChanged || playerChanged || tokenChanged) {
                deny('room_binding_changed', 'Room session changed during authorization; the operation was not applied');
                return;
              }
              if (room.authorityToken && data && typeof data === 'object') {
                attachOperationContext(data, {
                  roomId: room.id,
                  authorityInstanceId: room.authorityToken.authorityInstanceId,
                  authorityGeneration: room.authorityToken.authorityGeneration,
                  token: room.authorityToken,
                  socketId: socket.id,
                  playerId: captured.playerId,
                  userId: captured.userId,
                  roomRef: room,
                  playerRef: captured.player
                });
              }
            }
          }
        } catch (error) {
          logger.error('Room authority guard failed; event refused', { event, error: error.message });
          return;
        }
        return handler.apply(socket, args);
      });
    };

    // ==================== UTILITY HANDLERS ====================
    registerUtilityHandlers(handlerCtx);

    // ==================== ROOM MANAGEMENT HANDLERS ====================
    registerRoomHandlers(handlerCtx);

    // ==================== TOKEN MANAGEMENT HANDLERS ====================
    registerTokenHandlers(handlerCtx);

    // ==================== CHARACTER MANAGEMENT HANDLERS ====================
    registerCharacterHandlers(handlerCtx);


    // ==================== MAP/GRID MANAGEMENT HANDLERS ====================
    registerMapHandlers(handlerCtx);

    // ==================== GM ACTION HANDLERS ====================
    registerGmActionHandlers(handlerCtx);

    // ==================== TRAVEL HANDLERS ====================
    registerTravelHandlers(handlerCtx);

    // ==================== COMBAT HANDLERS ====================
    registerCombatHandlers(handlerCtx);

    // ==================== CHAT HANDLERS ====================
    registerChatHandlers(handlerCtx);

    // ==================== ENVIRONMENT HANDLERS ====================
    registerEnvironmentHandlers(handlerCtx);

    // ==================== SYNC HANDLERS ====================
    registerSyncHandlers(handlerCtx);

    // ==================== SESSION HANDLERS ====================
    registerSessionHandlers(handlerCtx);

    // ==================== PARTY HANDLERS ====================
    registerPartyHandlers(handlerCtx);

    // ==================== SESSION INVITATION HANDLERS ====================
    registerSessionInvitationHandlers(handlerCtx);

    // ===== AUDIO / JUKEBOX EVENTS =====
    registerAudioHandlers(handlerCtx);

    // ===== JOURNAL EVENTS =====
    registerJournalHandlers(handlerCtx);

    // ===== QUEST EVENTS =====
    registerQuestHandlers(handlerCtx);

    // ===== GM TOOLS EVENTS =====
    registerGmToolsHandlers(handlerCtx);

  });
}

module.exports = {
  registerSocketHandlers,
  validateMapExists,
  getNextEventSequence,
  ECHO_PREVENTION_WINDOW_MS
};
