/**
 * Project 4 R10 — positive outbound privacy projection.
 *
 * Plants unique secret markers in every private/unknown location and drives
 * the ACTUAL shared outbound routes. An unauthorized room member must receive
 * ZERO marker; supported public fields must still survive.
 */

const { expect } = require('chai');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const MARKERS = [
  'MARKER_STATS_INV',
  'MARKER_STATS_BLOB',
  'MARKER_TOKEN_UNKNOWN',
  'MARKER_TOKEN_BEARER',
  'MARKER_STATE_INV',
  'MARKER_STATE_BLOB',
  'MARKER_ALT_ASSET',
  'MARKER_COND',
  'MARKER_EQUIP_BEARER',
  'MARKER_EQUIP_DAMAGE_BLOB',
  'MARKER_EQUIP_DAMAGE_NOTES',
  'MARKER_EQUIP_ARMOR_BLOB',
  'MARKER_MAP_BG_BLOB',
  'MARKER_ROOT_BG_BLOB',
  'MARKER_CHAR_INV',
  'MARKER_CREATURE_UNKNOWN',
  'MARKER_EQUIP_SLOT',
  'MARKER_WEAPON_BLOB',
  'MARKER_TOKEN_IMAGE_OBJ',
  'MARKER_MAP_SNAPSHOT',
  'MARKER_MAPDATA',
  'MARKER_ENVELOPE'
];
const BEARER_URL = 'https://firebasestorage.googleapis.com/v0/b/mythrill/o/users%2Fgm%2Fportrait.png?alt=media&token=MARKER_TOKEN_BEARER';

const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
});
const once = (socket, event, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});
const emitAck = (socket, event, payload, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout for "${event}"`)), timeoutMs);
  socket.emit(event, payload, (response) => { clearTimeout(timer); resolve(response); });
});

function buildPlantedGameState() {
  return {
    defaultMapId: 'default',
    playerMapAssignments: {},
    mapData: {
      backgrounds: [{
        id: 'bg1', name: 'Background', src: BEARER_URL,
        secretBlob: 'MARKER_ROOT_BG_BLOB', portraitUrl: BEARER_URL,
        position: { x: 0, y: 0 }, scale: 1, opacity: 1, zIndex: 0
      }],
      activeBackgroundId: 'bg1',
      cameraPosition: { x: 0, y: 0 },
      zoomLevel: 1,
      secretBlob: 'MARKER_MAPDATA'
    },
    characters: {
      hero: {
        id: 'hero',
        name: 'Hero',
        stats: {
          strength: 16,
          inventory: { secret: 'MARKER_STATS_INV' },
          secretBlob: 'MARKER_STATS_BLOB'
        },
        inventory: [{ secret: 'MARKER_CHAR_INV' }],
        equipment: {
          mainHand: {
            name: 'Blade',
            secretBlob: 'MARKER_EQUIP_SLOT',
            image: BEARER_URL,
            damage: {
              dice: '1d8', type: 'slashing',
              secretBlob: 'MARKER_EQUIP_DAMAGE_BLOB',
              privateNotes: 'MARKER_EQUIP_DAMAGE_NOTES',
              image: BEARER_URL
            },
            armor: { value: 2, isPercentage: false, secretBlob: 'MARKER_EQUIP_ARMOR_BLOB' }
          },
          weapon: { name: 'Sword', image: BEARER_URL, secretBlob: 'MARKER_WEAPON_BLOB' }
        }
      }
    },
    tokens: {},
    characterTokens: {},
    maps: {
      default: {
        id: 'default',
        name: 'Default',
        backgrounds: [{
          id: 'map-bg', name: 'Map BG', url: BEARER_URL,
          thumbnail: '/assets/public-thumb.png',
          secretBlob: 'MARKER_MAP_BG_BLOB',
          position: { x: 1, y: 2 }, scale: 1, opacity: 1, zIndex: 0
        }],
        tokens: {
          secretToken: {
            id: 'secretToken',
            name: 'Creature',
            position: { x: 1, y: 2 },
            image: BEARER_URL,
            portraitUrl: BEARER_URL,
            icon: { url: BEARER_URL, secret: 'MARKER_TOKEN_IMAGE_OBJ' },
            alternateAsset: { secret: 'MARKER_ALT_ASSET' },
            unknown: { deep: { secret: 'MARKER_TOKEN_UNKNOWN' } },
            state: {
              currentHp: 7,
              inventory: { secret: 'MARKER_STATE_INV' },
              secretBlob: 'MARKER_STATE_BLOB'
            }
          }
        },
        characterTokens: {
          heroToken: {
            id: 'heroToken',
            name: 'Hero Token',
            ownerUserId: 'PLACEHOLDER_GM',
            position: { x: 3, y: 4 },
            character: {
              id: 'hero',
              name: 'Hero',
              stats: { strength: 16, inventory: { secret: 'MARKER_STATS_INV' } },
              inventory: [{ secret: 'MARKER_CHAR_INV' }]
            },
            state: {
              conditions: [{ id: 'c1', name: 'Poisoned', secretBlob: 'MARKER_COND' }]
            }
          }
        },
        creatures: {
          critter: {
            id: 'critter',
            name: 'Critter',
            unknown: { deep: { secret: 'MARKER_CREATURE_UNKNOWN' } }
          }
        }
      }
    }
  };
}

const payloadText = (payload) => {
  try {return JSON.stringify(payload);} catch (_error) {return String(payload);}
};

const expectClean = (label, payload) => {
  const text = payloadText(payload);
  for (const marker of MARKERS) {
    expect(text.includes(marker), `${label} leaked ${marker}`).to.equal(false);
  }
  expect(text.includes('firebasestorage.googleapis.com'), `${label} leaked a bearer URL`).to.equal(false);
};

describe('Project 4 R10 positive outbound privacy projection', function() {
  this.timeout(30000);

  let server;
  let gmClient;
  let playerClient;
  let room;

  before(async() => {
    server = createProductionStackServer();
    await server.start();

    const gmUid = server.nextUserId('gm');
    const playerUid = server.nextUserId('player');
    server.registerAuthToken(`tok-${gmUid}`, gmUid);
    server.registerAuthToken(`tok-${playerUid}`, playerUid);

    gmClient = server.connect({ token: `tok-${gmUid}` });
    playerClient = server.connect({ token: `tok-${playerUid}` });
    await Promise.all([connected(gmClient), connected(playerClient)]);

    const gameState = buildPlantedGameState();
    gameState.maps.default.characterTokens.heroToken.ownerUserId = gmUid;
    room = await server.seedRoom(gmClient.id, {
      name: 'Privacy Room',
      gmName: 'GM',
      gmUserId: gmUid,
      initialGameState: gameState
    });

    // Attach the player as an ordinary (non-owner) room member.
    const playerRecord = {
      id: 'pl-1',
      socketId: playerClient.id,
      roomId: room.id,
      userId: playerUid,
      isGM: false,
      name: 'Player',
      currentMapId: 'default'
    };
    room.players.set('pl-1', playerRecord);
    server.players.set(playerClient.id, playerRecord);
    server.io.sockets.sockets.get(playerClient.id).join(room.id);
  });

  after(async() => {
    if (server) {await server.stop();}
  });

  it('full sync, room checkpoint and GM map routes never leak planted markers', async() => {
    const fullSync = once(playerClient, 'full_game_state_sync');
    playerClient.emit('request_full_sync', { roomId: room.id });
    expectClean('full_game_state_sync', await fullSync);

    const checkpoint = await emitAck(gmClient, 'request_room_checkpoint', { roomId: room.id });
    expect(checkpoint.success).to.equal(true);
    expectClean('room_checkpoint', checkpoint.projection);

    const gmView = once(gmClient, 'gm_view_changed');
    gmClient.emit('gm_switch_view', { roomId: room.id, newMapId: 'default' });
    expectClean('gm_view_changed', await gmView);

    const fresh = once(gmClient, 'fresh_positions_received');
    gmClient.emit('gm_request_fresh_positions', { roomId: room.id, mapId: 'default' });
    expectClean('fresh_positions_received', await fresh);
  });

  it('forced transfer and pulled map snapshot routes never leak planted markers', async() => {
    const forced = once(playerClient, 'forced_map_transfer');
    gmClient.emit('gm_transfer_player', {
      roomId: room.id,
      playerId: 'pl-1',
      targetMapId: 'default',
      destinationMapName: 'Default'
    });
    expectClean('forced_map_transfer', await forced);

    const pulled = once(playerClient, 'players_pulled_to_map');
    gmClient.emit('pull_players_to_map', {
      roomId: room.id,
      mapId: 'default',
      mapName: 'Default',
      mapSnapshot: { ...buildPlantedGameState().maps.default, secretBlob: 'MARKER_MAP_SNAPSHOT' }
    });
    expectClean('players_pulled_to_map', await pulled);
  });

  it('token, creature and character-token update relays never leak planted markers', async() => {
    const tokenUpdated = once(playerClient, 'token_updated');
    gmClient.emit('token_updated', {
      roomId: room.id,
      mapId: 'default',
      tokenId: 'secretToken',
      updates: {
        currentHp: 5,
        secretBlob: 'MARKER_STATE_BLOB',
        inventory: { secret: 'MARKER_STATE_INV' },
        envelopeSecret: 'MARKER_ENVELOPE'
      }
    });
    const tokenPayload = await tokenUpdated;
    expectClean('token_updated', tokenPayload);
    // Supported scalar state still survives.
    expect(tokenPayload.updates.currentHp).to.equal(5);

    const creatureUpdated = once(playerClient, 'creature_updated');
    gmClient.emit('creature_updated', {
      roomId: room.id,
      mapId: 'default',
      creatureId: 'critter',
      updates: {
        currentHp: 3,
        secretBlob: 'MARKER_CREATURE_UNKNOWN',
        inventory: { secret: 'MARKER_STATE_INV' }
      }
    });
    const creaturePayload = await creatureUpdated;
    expectClean('creature_updated', creaturePayload);
    expect(creaturePayload.updates.currentHp).to.equal(3);

    const charTokenUpdated = once(playerClient, 'character_token_updated');
    gmClient.emit('character_token_updated', {
      roomId: room.id,
      mapId: 'default',
      tokenId: 'heroToken',
      stateUpdates: {
        currentHp: 9,
        inventory: { secret: 'MARKER_STATE_INV' },
        secretBlob: 'MARKER_STATE_BLOB'
      }
    });
    const charPayload = await charTokenUpdated;
    expectClean('character_token_updated', charPayload);
    expect(charPayload.stateUpdates.currentHp).to.equal(9);
  });

  it('token delta and creature_added routes never leak planted markers', async() => {
    const creatureAdded = once(playerClient, 'creature_added');
    gmClient.emit('creature_added', {
      roomId: room.id,
      mapId: 'default',
      creature: {
        id: 'critter-2',
        name: 'Critter Two',
        secretBlob: 'MARKER_CREATURE_UNKNOWN',
        unknown: { deep: { secret: 'MARKER_TOKEN_UNKNOWN' } }
      }
    });
    const added = await creatureAdded;
    expectClean('creature_added', added);
    expect(added.creature.name).to.equal('Critter Two');
  });

  it('character and equipment update routes never leak planted markers', async() => {
    const updated = once(playerClient, 'character_updated');
    gmClient.emit('character_updated', {
      roomId: room.id,
      characterId: 'hero',
      character: {
        name: 'Hero',
        equipment: {
          mainHand: { name: 'Blade', secretBlob: 'MARKER_EQUIP_SLOT', image: BEARER_URL },
          weapon: { name: 'Sword', secretBlob: 'MARKER_WEAPON_BLOB' }
        },
        stats: { strength: 16, inventory: { secret: 'MARKER_STATS_INV' } }
      }
    });
    const payload = await updated;
    expectClean('character_updated', payload);
    expect(payload.character.equipment.mainHand.name).to.equal('Blade');
    expect(payload.character.stats.strength).to.equal(16);

    const equipmentUpdated = once(playerClient, 'character_equipment_updated');
    gmClient.emit('character_equipment_updated', {
      roomId: room.id,
      characterId: 'hero',
      slot: 'mainHand',
      equipment: { mainHand: { name: 'Axe', secretBlob: 'MARKER_EQUIP_SLOT', image: BEARER_URL } }
    });
    const eqPayload = await equipmentUpdated;
    expectClean('character_equipment_updated', eqPayload);
    expect(eqPayload.equipment.mainHand.name).to.equal('Axe');
  });

  it('C4: nested damage/armor and background shapes never leak private fields through real routes', async() => {
    const updated = once(playerClient, 'character_updated');
    gmClient.emit('character_updated', {
      roomId: room.id,
      characterId: 'hero',
      character: {
        name: 'Hero',
        equipment: {
          mainHand: {
            name: 'Blade',
            damage: {
              dice: '1d8', type: 'slashing',
              secretBlob: 'MARKER_EQUIP_DAMAGE_BLOB',
              privateNotes: 'MARKER_EQUIP_DAMAGE_NOTES',
              image: BEARER_URL
            },
            armor: { value: 2, isPercentage: false, secretBlob: 'MARKER_EQUIP_ARMOR_BLOB' }
          }
        }
      }
    });
    const payload = await updated;
    expectClean('C4 character_updated', payload);
    // Approved public damage/armor values still survive.
    expect(payload.character.equipment.mainHand.damage.dice).to.equal('1d8');
    expect(payload.character.equipment.mainHand.damage.type).to.equal('slashing');
    expect(payload.character.equipment.mainHand.armor.value).to.equal(2);

    const equipmentUpdated = once(playerClient, 'character_equipment_updated');
    gmClient.emit('character_equipment_updated', {
      roomId: room.id,
      characterId: 'hero',
      slot: 'mainHand',
      equipment: {
        mainHand: {
          name: 'Axe',
          damage: { dice: '2d6', type: 'fire', secretBlob: 'MARKER_EQUIP_DAMAGE_BLOB' },
          armor: { value: 1, secretBlob: 'MARKER_EQUIP_ARMOR_BLOB' }
        }
      }
    });
    const eqPayload = await equipmentUpdated;
    expectClean('C4 character_equipment_updated', eqPayload);
    expect(eqPayload.equipment.mainHand.damage.dice).to.equal('2d6');

    // Per-map backgrounds through the pull route: private bearer URL and
    // unknown nested fields dropped, approved asset fields survive.
    const pulled = once(playerClient, 'players_pulled_to_map');
    gmClient.emit('pull_players_to_map', {
      roomId: room.id,
      mapId: 'default',
      mapName: 'Default',
      mapSnapshot: {
        id: 'default',
        name: 'Default',
        backgrounds: [{
          id: 'snap-bg', name: 'Snapshot BG', url: BEARER_URL,
          thumbnail: '/assets/public-thumb.png',
          secretBlob: 'MARKER_MAP_BG_BLOB'
        }]
      }
    });
    const pulledPayload = await pulled;
    expectClean('C4 players_pulled_to_map', pulledPayload);
    const pulledBg = pulledPayload.mapSnapshot && Array.isArray(pulledPayload.mapSnapshot.backgrounds)
      ? pulledPayload.mapSnapshot.backgrounds[0]
      : null;
    expect(pulledBg && pulledBg.thumbnail).to.equal('/assets/public-thumb.png');

    // GM map view reads the room's per-map backgrounds (planted with markers).
    const gmView = once(gmClient, 'gm_view_changed');
    gmClient.emit('gm_switch_view', { roomId: room.id, newMapId: 'default' });
    const viewPayload = await gmView;
    expectClean('C4 gm_view_changed', viewPayload);
    const viewBg = viewPayload.mapData && Array.isArray(viewPayload.mapData.backgrounds)
      ? viewPayload.mapData.backgrounds[0]
      : null;
    expect(viewBg && viewBg.thumbnail).to.equal('/assets/public-thumb.png');

    // Forced transfer reads the same per-map backgrounds.
    const forced = once(playerClient, 'forced_map_transfer');
    gmClient.emit('gm_transfer_player', {
      roomId: room.id,
      playerId: 'pl-1',
      targetMapId: 'default',
      destinationMapName: 'Default'
    });
    const forcedPayload = await forced;
    expectClean('C4 forced_map_transfer', forcedPayload);
    const forcedBg = forcedPayload.mapData && Array.isArray(forcedPayload.mapData.backgrounds)
      ? forcedPayload.mapData.backgrounds[0]
      : null;
    expect(forcedBg && forcedBg.thumbnail).to.equal('/assets/public-thumb.png');
  });

  it('the real token-delta flush is authority-checked and positively projected', async() => {
    // Populate the root token mirror the delta lane reads, then exercise the
    // REAL debounced flush with the feature enabled.
    room.gameState.tokens.secretToken = {
      id: 'secretToken',
      name: 'Creature',
      image: BEARER_URL,
      icon: { url: BEARER_URL, secret: 'MARKER_TOKEN_IMAGE_OBJ' },
      unknown: { deep: { secret: 'MARKER_TOKEN_UNKNOWN' } }
    };
    const original = process.env.ENABLE_TOKENS_DELTA;
    process.env.ENABLE_TOKENS_DELTA = 'true';
    try {
      const delta = once(playerClient, 'tokens_delta');
      gmClient.emit('token_updated', {
        roomId: room.id,
        mapId: 'default',
        tokenId: 'secretToken',
        updates: { currentHp: 6, secretBlob: 'MARKER_STATE_BLOB' }
      });
      const payload = await delta;
      expectClean('tokens_delta', payload);
      const tokens = Array.isArray(payload.tokens) ? payload.tokens : [];
      expect(tokens.some((token) => token && token.name === 'Creature')).to.equal(true);
    } finally {
      if (original === undefined) {delete process.env.ENABLE_TOKENS_DELTA;}
      else {process.env.ENABLE_TOKENS_DELTA = original;}
    }
  });

  it('direct projection helpers are positive allowlists', () => {
    const roomAccess = require('../services/roomAccessService');
    const planted = buildPlantedGameState();

    const character = roomAccess.projectCharacterForClient(planted.characters.hero);
    expectClean('projectCharacterForClient', character);
    expect(character.stats.strength).to.equal(16);
    expect(character.name).to.equal('Hero');

    const token = roomAccess.projectTokenForClient(planted.maps.default.tokens.secretToken);
    expectClean('projectTokenForClient', token);
    expect(token.name).to.equal('Creature');
    expect(token.position).to.deep.equal({ x: 1, y: 2 });
    expect(token.state.currentHp).to.equal(7);

    const updates = roomAccess.projectTokenUpdateForClient({
      currentHp: 4,
      secretBlob: 'MARKER_STATE_BLOB',
      inventory: { secret: 'MARKER_STATE_INV' },
      image: BEARER_URL
    });
    expectClean('projectTokenUpdateForClient', updates);
    expect(updates.currentHp).to.equal(4);

    const mapData = roomAccess.projectMapDataForClient(planted.maps.default);
    expectClean('projectMapDataForClient', mapData);
    expect(mapData.name).to.equal('Default');

    const rootMap = roomAccess.projectRootMapDataForClient(planted.mapData);
    expectClean('projectRootMapDataForClient', rootMap);
    expect(Array.isArray(rootMap.backgrounds)).to.equal(true);
    expect(rootMap.secretBlob).to.equal(undefined);

    const unknownMap = roomAccess.projectMapDataForClient({
      ...planted.maps.default,
      secretBlob: 'MARKER_MAP_SNAPSHOT',
      inventory: { secret: 'MARKER_MAP_SNAPSHOT' }
    });
    expectClean('projectMapDataForClient-unknown', unknownMap);
    expect(unknownMap.secretBlob).to.equal(undefined);

    const objectAsset = roomAccess.projectTokenForClient({
      id: 't-obj',
      name: 'Obj',
      image: { url: BEARER_URL, secret: 'MARKER_TOKEN_IMAGE_OBJ' }
    });
    expectClean('token-image-object', objectAsset);
    expect(objectAsset.image).to.equal(undefined);

    const equipment = roomAccess.projectEquipmentForClient({
      mainHand: { name: 'Blade', secretBlob: 'MARKER_EQUIP_SLOT', image: BEARER_URL },
      weapon: { name: 'Sword', secretBlob: 'MARKER_WEAPON_BLOB' },
      secretBlob: 'MARKER_ENVELOPE'
    });
    expectClean('projectEquipmentForClient', equipment);
    expect(equipment.mainHand.name).to.equal('Blade');
    expect(equipment.secretBlob).to.equal(undefined);

    // C4A: nested damage/armor records are positive schemas; approved public
    // gameplay values survive, unknown keys and bearer assets never do.
    const nestedEquipment = roomAccess.projectEquipmentForClient({
      mainHand: {
        name: 'Blade',
        damage: {
          dice: '1d8', type: 'slashing', bonus: 2,
          secretBlob: 'MARKER_EQUIP_DAMAGE_BLOB',
          privateNotes: 'MARKER_EQUIP_DAMAGE_NOTES',
          image: BEARER_URL
        },
        armor: { value: 2, isPercentage: false, secretBlob: 'MARKER_EQUIP_ARMOR_BLOB' }
      }
    });
    expectClean('nested-equipment', nestedEquipment);
    expect(nestedEquipment.mainHand.damage).to.deep.equal({ dice: '1d8', type: 'slashing', bonus: 2 });
    expect(nestedEquipment.mainHand.armor).to.deep.equal({ value: 2, isPercentage: false });

    // C4B: per-map and root backgrounds use the same positive projector.
    expect(mapData.backgrounds[0].id).to.equal('map-bg');
    expect(mapData.backgrounds[0].thumbnail).to.equal('/assets/public-thumb.png');
    expect(mapData.backgrounds[0].secretBlob).to.equal(undefined);
    expect(rootMap.backgrounds[0].id).to.equal('bg1');
    expect(rootMap.backgrounds[0].secretBlob).to.equal(undefined);
    expect(rootMap.backgrounds[0].portraitUrl).to.equal(undefined);
    expect(rootMap.backgrounds[0].src).to.equal(undefined);

    // C4: invalid root mapData types never survive the outbound projection.
    const arrayRoot = roomAccess.projectGameStateForClient({
      mapData: [{
        backgrounds: [{ secretBlob: 'ROOT_ARRAY_PRIVATE_MARKER', src: BEARER_URL }]
      }]
    });
    expectClean('root-mapdata-array', arrayRoot);
    expect(arrayRoot.mapData).to.equal(undefined);
    const stringRoot = roomAccess.projectGameStateForClient({ mapData: 'ROOT_ARRAY_PRIVATE_MARKER' });
    expectClean('root-mapdata-string', stringRoot);
    expect(stringRoot.mapData).to.equal(undefined);
    const numberRoot = roomAccess.projectGameStateForClient({ mapData: 42 });
    expect(numberRoot.mapData).to.equal(undefined);
    const nullRoot = roomAccess.projectGameStateForClient({ mapData: null });
    expect(nullRoot.mapData).to.equal(undefined);
  });

  it('C4: array/string root mapData never leaks through real shared routes', async() => {
    const server = createProductionStackServer();
    let gm = null;
    try {
      await server.start();
      const gmUid = server.nextUserId('gm');
      server.registerAuthToken(`tok-${gmUid}`, gmUid);
      gm = server.connect({ token: `tok-${gmUid}` });
      await connected(gm);

      const room = await server.seedRoom(gm.id, {
        name: 'C4 Root', gmName: 'GM', gmUserId: gmUid,
        initialGameState: {
          defaultMapId: 'default',
          playerMapAssignments: {},
          mapData: [{
            backgrounds: [{ secretBlob: 'ROOT_ARRAY_PRIVATE_MARKER', src: BEARER_URL }]
          }],
          maps: { default: { id: 'default', name: 'Default', tokens: {}, characterTokens: {}, gridItems: {} } },
          tokens: {},
          characterTokens: {},
          gridItems: {}
        }
      });

      // buildRoomProjection: array root mapData is dropped, never raw.
      const roomAccess = require('../services/roomAccessService');
      const projection = roomAccess.buildRoomProjection(room);
      expectClean('C4 buildRoomProjection', projection);
      expect(projection.gameState.mapData).to.equal(undefined);

      // Real checkpoint response.
      const checkpoint = await emitAck(gm, 'request_room_checkpoint', { roomId: room.id });
      expect(checkpoint.success).to.equal(true);
      expectClean('C4 room_checkpoint', checkpoint.projection);
      expect(checkpoint.projection.gameState.mapData).to.equal(undefined);

      // A string root mapData is also dropped on the real route.
      room.gameState.mapData = 'ROOT_ARRAY_PRIVATE_MARKER';
      const stringCheckpoint = await emitAck(gm, 'request_room_checkpoint', { roomId: room.id });
      expectClean('C4 room_checkpoint string', stringCheckpoint.projection);
      expect(stringCheckpoint.projection.gameState.mapData).to.equal(undefined);

      // Legitimate object-shaped root mapData continues to project correctly.
      room.gameState.mapData = {
        backgrounds: [{ id: 'ok-bg', name: 'OK', thumbnail: '/assets/public-thumb.png', secretBlob: 'MARKER_ROOT_BG_BLOB' }],
        activeBackgroundId: 'ok-bg'
      };
      const objectCheckpoint = await emitAck(gm, 'request_room_checkpoint', { roomId: room.id });
      expectClean('C4 room_checkpoint object', objectCheckpoint.projection);
      expect(objectCheckpoint.projection.gameState.mapData.backgrounds[0].id).to.equal('ok-bg');
      expect(objectCheckpoint.projection.gameState.mapData.backgrounds[0].thumbnail).to.equal('/assets/public-thumb.png');
      expect(objectCheckpoint.projection.gameState.mapData.activeBackgroundId).to.equal('ok-bg');
    } finally {
      if (server) {await server.stop();}
    }
  });
});
