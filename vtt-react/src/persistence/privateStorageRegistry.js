/**
 * Project 5 — private storage registry (Slice 1).
 *
 * ONE explicit registry for all P5-controlled browser-private storage. There
 * is no prefix-based ownership inference: `mythrill_*` is not "private",
 * `spell*` is not "disposable", `backup*` is not "safe to delete".
 *
 * Every entry declares the frozen architecture-review fields. Later slices
 * must resolve registered families only through this module (or the
 * registry-driven cleanup/legacy helpers). Unregistered keys are never
 * silently treated as public/burnable.
 *
 * Allowed scope kinds: subset of ['user','guest','dev'].
 * See docs: Project 5 architecture freeze review.
 */

import { ALL_SCOPE_KINDS } from './scopeModel';

export const STORAGE_MECHANISMS = Object.freeze({
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  INDEXED_DB_AND_LOCAL: 'indexedDB+localStorage'
});

export const PRIVACY_CLASSES = Object.freeze({
  PRIVATE: 'private',
  MIXED: 'mixed',
  PUBLIC: 'public'
});

export const DATA_CLASSES = Object.freeze({
  AUTHORED: 'authored',
  RECOVERABLE: 'recoverable',
  CONFLICT_CANDIDATE: 'conflict-candidate',
  QUARANTINE: 'quarantine',
  PRIVATE_PROJECTION: 'private-projection',
  PRIVATE_METADATA_HINT: 'private-metadata-hint',
  SESSION_ONLY: 'session-only',
  PUBLIC_CACHE: 'public-cache'
});

export const HANDOFF_BEHAVIORS = Object.freeze({
  PRESERVE: 'preserve',
  RELOAD_SCOPED: 'reload-scoped',
  DETACH_RESET: 'detach-reset',
  TAB_LOCAL_VALIDATE: 'tab-local-validate',
  CLEAR_TRANSIENT: 'clear-transient'
});

export const LOGOUT_RETENTIONS = Object.freeze({
  RETAIN: 'retain',
  RETAIN_RECOVERY: 'retain-recovery',
  CLEAR_TRANSIENT: 'clear-transient',
  CLEAR: 'clear'
});

export const MIGRATION_DISPOSITIONS = Object.freeze({
  FUTURE_SLICE: 'future-slice',
  QUARANTINE_ONLY: 'quarantine-only',
  NO_MIGRATION_NEEDED: 'no-migration-needed'
});

export const CONCURRENCY_STRATEGIES = Object.freeze({
  PLANNED_WEB_LOCK: 'planned:web-lock',
  PLANNED_TAB_LOCAL: 'planned:tab-local',
  PLANNED_SESSION: 'planned:session',
  PLANNED_READ_ONLY: 'planned:read-only',
  NONE: 'none'
});

export const ENVELOPE_KINDS = Object.freeze({
  DRAFT: 'draft-envelope',
  FAMILY_NATIVE: 'family-native'
});

export const CLOUD_BINDINGS = Object.freeze({
  CAMPAIGN_SINGLETON: 'campaign-singleton',
  WORLDBUILDING_DOC: 'worldbuilding-doc',
  JOURNAL_DOC: 'journal-doc',
  ROOM_STATES_DOC: 'room-states-doc',
  ACTION_BAR_DOC: 'action-bar-doc',
  ENTITY_GRAPH_DOC: 'entity-graph-doc',
  USER_LIBRARY_DOC: 'user-library-doc',
  SPELLBOOK_DOC: 'spellbook-doc'
});

/** Subregion custom maps live in IndexedDB with a localStorage mirror. */
export const SUBREGION_MAPS_INDEXEDDB = Object.freeze({
  database: 'mythrill_maps_db',
  store: 'custom_subregion_maps',
  mirrorKey: 'mythrill_custom_subregion_maps'
});

const ALL = Object.freeze([...ALL_SCOPE_KINDS]);
const GUEST = Object.freeze(['guest']);
const DEV = Object.freeze(['dev']);

function normalizeKeyDecl(decl) {
  if (typeof decl === 'string') {
    return { kind: 'exact', value: decl };
  }
  if (decl && typeof decl === 'object') {
    if (typeof decl.exact === 'string') return { kind: 'exact', value: decl.exact };
    if (typeof decl.prefix === 'string') return { kind: 'prefix', value: decl.prefix };
    if (typeof decl.builder === 'string') {
      const placeholderIndex = decl.builder.indexOf('{');
      if (placeholderIndex <= 0) {
        throw new Error(`P5 registry: builder declaration needs a literal prefix: ${decl.builder}`);
      }
      return {
        kind: 'builder',
        template: decl.builder,
        prefix: decl.builder.slice(0, placeholderIndex)
      };
    }
    if (decl.indexedDB && typeof decl.indexedDB === 'object') {
      const { database, store } = decl.indexedDB;
      if (typeof database !== 'string' || typeof store !== 'string') {
        throw new Error('P5 registry: indexedDB declaration requires database and store');
      }
      return { kind: 'indexedDB', database, store };
    }
  }
  throw new Error(`P5 registry: unsupported key declaration ${JSON.stringify(decl)}`);
}

function buildFamily(definition) {
  const {
    id, title, keys, storage = STORAGE_MECHANISMS.LOCAL, privacyClass = PRIVACY_CLASSES.PRIVATE,
    dataClass = DATA_CLASSES.AUTHORED, allowedScopeKinds = ALL, serializer = 'json',
    schemaVersion = null, envelope = ENVELOPE_KINDS.FAMILY_NATIVE,
    handoff = HANDOFF_BEHAVIORS.RELOAD_SCOPED, logoutRetention = LOGOUT_RETENTIONS.RETAIN,
    legacyKeys = [], migration = MIGRATION_DISPOSITIONS.FUTURE_SLICE,
    cleanupEligible = false, concurrency = CONCURRENCY_STRATEGIES.PLANNED_WEB_LOCK,
    cloudBinding = null, globalWhen = null, notes = ''
  } = definition;

  return Object.freeze({
    id,
    title,
    keys: Object.freeze((keys || []).map(normalizeKeyDecl)),
    storage,
    privacyClass,
    dataClass,
    allowedScopeKinds,
    serializer,
    schemaVersion,
    envelope,
    handoff,
    logoutRetention,
    legacyKeys: Object.freeze((legacyKeys || []).map(normalizeKeyDecl)),
    migration,
    cleanupEligible,
    concurrency,
    cloudBinding,
    globalWhen,
    notes
  });
}

const authored = (id, title, keys, legacyKeys = [], overrides = {}) =>
  buildFamily({
    id, title, keys, legacyKeys,
    dataClass: DATA_CLASSES.AUTHORED,
    serializer: 'json',
    schemaVersion: 1,
    envelope: ENVELOPE_KINDS.DRAFT,
    ...overrides
  });

const recoverable = (id, title, keys, overrides = {}) =>
  buildFamily({
    id, title, keys,
    dataClass: DATA_CLASSES.RECOVERABLE,
    serializer: 'json',
    schemaVersion: 1,
    envelope: ENVELOPE_KINDS.DRAFT,
    handoff: HANDOFF_BEHAVIORS.RELOAD_SCOPED,
    logoutRetention: LOGOUT_RETENTIONS.RETAIN_RECOVERY,
    migration: MIGRATION_DISPOSITIONS.FUTURE_SLICE,
    ...overrides
  });

const projection = (id, title, keys, overrides = {}) =>
  buildFamily({
    id, title, keys,
    dataClass: DATA_CLASSES.PRIVATE_PROJECTION,
    serializer: 'json',
    handoff: HANDOFF_BEHAVIORS.DETACH_RESET,
    logoutRetention: LOGOUT_RETENTIONS.RETAIN_RECOVERY,
    ...overrides
  });

const selector = (id, title, key, overrides = {}) =>
  buildFamily({
    id, title, keys: [key],
    dataClass: DATA_CLASSES.PRIVATE_METADATA_HINT,
    handoff: HANDOFF_BEHAVIORS.TAB_LOCAL_VALIDATE,
    concurrency: CONCURRENCY_STRATEGIES.NONE,
    ...overrides
  });

const hint = (id, title, keys, overrides = {}) =>
  buildFamily({
    id, title, keys,
    dataClass: DATA_CLASSES.PRIVATE_METADATA_HINT,
    handoff: HANDOFF_BEHAVIORS.PRESERVE,
    concurrency: CONCURRENCY_STRATEGIES.NONE,
    ...overrides
  });

const sessionOnly = (id, title, keys, overrides = {}) =>
  buildFamily({
    id, title, keys,
    storage: STORAGE_MECHANISMS.SESSION,
    dataClass: DATA_CLASSES.SESSION_ONLY,
    handoff: HANDOFF_BEHAVIORS.CLEAR_TRANSIENT,
    logoutRetention: LOGOUT_RETENTIONS.CLEAR_TRANSIENT,
    cleanupEligible: true,
    concurrency: CONCURRENCY_STRATEGIES.PLANNED_SESSION,
    serializer: 'raw-string',
    ...overrides
  });

const REGISTRY_ENTRIES = [
  // ── Campaign planning ────────────────────────────────────────────────────
  authored('campaign.collection', 'Campaign planning collection', ['mythrill-campaigns'], [
    'mythrill-current-campaign'
  ], { cloudBinding: CLOUD_BINDINGS.CAMPAIGN_SINGLETON }),
  selector('campaign.currentId', 'Current campaign selector', 'mythrill-current-campaign-id'),
  hint('campaign.pendingConflict', 'Pending campaign reconciliation identity', [
    { builder: 'mythrill_pending_campaign_conflict_{scopeRef}' }
  ], {
    notes: 'P5-native reconciliation identity record (no legacy source); never cloud-uploaded.'
  }),

  // ── Local rooms / room working copies ────────────────────────────────────
  authored('localRoom.registry', 'Local room registry', ['mythrill_local_rooms']),
  recoverable('localRoom.statePrimary', 'Primary local room snapshot', [
    { builder: 'mythrill_local_room_state_{roomId}' }
  ]),
  recoverable('localRoom.stateLegacy', 'Legacy local room snapshot format', [
    { builder: 'mythrill-room-state-{roomId}' }
  ], { notes: 'Parallel legacy format; later slices reduce to one authority.' }),
  recoverable('localRoom.playerState', 'Local per-player restore snapshot', [
    { builder: 'mythrill-player-state-{roomId}_{characterId}' }
  ]),
  selector('localRoom.activeRoomId', 'Active local room selector', 'selectedLocalRoomId'),
  selector('localRoom.activeFlag', 'Local-room mode flag', 'isLocalRoom'),

  // ── Core private working projections ─────────────────────────────────────
  recoverable('core.inventory', 'Private inventory working state', ['inventory']),
  recoverable('core.mapWorking', 'Map working state (sandbox + room projections)', ['map-store'], {
    privacyClass: PRIVACY_CLASSES.MIXED,
    notes: 'Mixed authored sandbox content and room projection cache; split later.'
  }),
  authored('core.savedMaps', 'Saved map snapshots', ['vtt-saved-maps']),
  projection('core.characterTokens', 'Character-token working projection', ['character-token-store']),
  projection('core.chat', 'Private chat/history projection', ['chat-store']),
  projection('core.conditions', 'Private condition working state', ['condition-store']),
  projection('core.cooldowns', 'Private cooldown working state', ['gameStore-activeCooldowns']),

  // ── Character foundation ─────────────────────────────────────────────────
  authored('character.roster', 'Local character roster', ['mythrill-characters']),
  authored('character.guestRoster', 'Guest character roster', ['mythrill-guest-characters'], [
    'mythrill-guest-character'
  ]),
  selector('character.activeId', 'Active character selector', 'mythrill-active-character'),

  // ── Worldbuilding categories ─────────────────────────────────────────────
  authored('worldbuilding.books', 'Worldbuilding books', ['mythrill_books_storage'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.interactiveMaps', 'Worldbuilding interactive maps', ['mythrill_interactive_maps_storage'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.familyTrees', 'Worldbuilding family trees', ['mythrill_family_trees_storage'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.lineages', 'Worldbuilding custom lineages', ['mythrill_custom_lineages'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.factions', 'Worldbuilding factions', ['mythrill_factions'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.timelines', 'Worldbuilding timelines', ['mythrill_custom_timelines'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.quests', 'Worldbuilding quests', ['quest-store'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.worlds', 'Worldbuilding worlds', ['mythrill_worlds_storage'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.deities', 'Worldbuilding deities', ['mythrill_deities'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),
  authored('worldbuilding.languages', 'Worldbuilding languages', ['mythrill_languages'], [], { cloudBinding: CLOUD_BINDINGS.WORLDBUILDING_DOC }),

  // ── Worldbuilding dirty state ────────────────────────────────────────────
  hint('worldbuilding.dirty', 'Worldbuilding per-category dirty markers', [
    { builder: 'mythrill_wb_dirty_{category}' }
  ], {
    migration: MIGRATION_DISPOSITIONS.FUTURE_SLICE,
    concurrency: CONCURRENCY_STRATEGIES.PLANNED_WEB_LOCK,
    notes: 'Global Boolean becomes owner/category/revision-bound in a later slice.'
  }),

  // ── Journal / shareable ──────────────────────────────────────────────────
  authored('journal.shareable', 'Journal and shareable authored work', ['mythrill-shareable-storage'], [
    'mythrill-shareable'
  ], { cloudBinding: CLOUD_BINDINGS.JOURNAL_DOC }),

  // ── Additional authored/private content ──────────────────────────────────
  authored('graph.entitiesNodes', 'Custom entity graph nodes', ['mythrill_custom_graph_nodes'], [], { cloudBinding: CLOUD_BINDINGS.ENTITY_GRAPH_DOC }),
  authored('graph.entitiesEdges', 'Custom entity graph edges', ['mythrill_custom_graph_edges'], [], { cloudBinding: CLOUD_BINDINGS.ENTITY_GRAPH_DOC }),
  hint('graph.factionLayout', 'Entity-linked faction graph layout', [
    { builder: 'mythrill_faction_graph_positions_{worldId}' }
  ]),
  buildFamily({
    id: 'map.subregionCache',
    title: 'Custom subregion maps (IndexedDB source + localStorage mirror)',
    keys: [
      SUBREGION_MAPS_INDEXEDDB.mirrorKey,
      { indexedDB: { database: SUBREGION_MAPS_INDEXEDDB.database, store: SUBREGION_MAPS_INDEXEDDB.store } }
    ],
    storage: STORAGE_MECHANISMS.INDEXED_DB_AND_LOCAL,
    dataClass: DATA_CLASSES.AUTHORED,
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'Existing multi-MB authored recovery source; ownership unknown until proven.'
  }),
  hint('map.starterSelection', 'Starter/immerse map selection', ['mythrill_primary_starter_map']),
  authored('map.notes', 'Authored map-making notes', ['mapMakingSectionNotes_v1']),
  authored('map.checklist', 'Authored map-making checklist', ['mapMakingSectionChecklist_v4']),
  recoverable('map.historyBackup', 'Map history backup', ['mythrill_map_history_backup'], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'Listed in a current disposable-cleanup set; protected from Slice 2 onward.'
  }),
  recoverable('map.legacySectionState', 'Declared map-making section state', ['mapMakingSectionState_v1'], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'No current writer found; preserve raw if any installation contains it.'
  }),
  authored('map.customFallback', 'Custom map local fallback', [
    { builder: 'mythrill_custom_maps_{scopeRef}' }
  ]),
  authored('map.annotationsPins', 'Private map annotation pins', [
    { builder: 'mythrill_map_pins_{scopeRef}' }
  ]),
  authored('map.annotationsAreas', 'Private map annotation areas', [
    { builder: 'mythrill_map_areas_{scopeRef}' }
  ]),
  hint('map.annotationsShares', 'Map annotation sharing metadata', [
    { builder: 'mythrill_map_shares_{scopeRef}' }
  ]),
  authored('library.user', 'User content library', [
    { builder: 'userLibrary_{scopeRef}' }
  ], [], { cloudBinding: CLOUD_BINDINGS.USER_LIBRARY_DOC }),
  authored('library.items', 'Custom items library', ['item-store']),
  authored('library.spells', 'Custom spells library', ['spell-store']),
  authored('library.spellbook', 'Spellbook collections', ['spellbook-storage'], [], { cloudBinding: CLOUD_BINDINGS.SPELLBOOK_DOC }),
  authored('library.spellData', 'Spell library data', ['spell_library_data'], [
    'spell-library-data'
  ]),
  authored('library.customSpells', 'User created spells', ['mythrill-custom-spells']),
  authored('library.deletedSpells', 'User deleted-spell choices', ['mythrill-deleted-spells']),
  hint('library.spellFilterPresets', 'Spell library filter presets', ['spellLibraryFilterPresets']),
  hint('library.spellCollapsedSections', 'Spell library UI section state', ['spellLibraryCollapsedSections']),
  authored('library.summons', 'Custom summon templates', ['mythrill-custom-summons']),
  authored('library.effectPresets', 'Custom effect presets', ['effect-preset-store']),
  recoverable('library.spellcraftingHistory', 'Spellcrafting history', ['spellcrafting_history'], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY
  }),
  hint('library.itemCreatorRecent', 'Item creator recent state', ['item_creator_recent'], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY
  }),
  authored('character.crafting', 'Crafting progress', ['crafting-storage']),
  authored('campaign.tagRegistry', 'Campaign/world tag registry', ['mythrill-universal-tag-registry']),
  authored('character.actionBar', 'Character action bars', [
    { builder: 'mythrill-actionbar-{characterId}-{roomId}' }
  ], [
    { builder: 'mythrill-actionbar-{characterId}' }
  ], { cloudBinding: CLOUD_BINDINGS.ACTION_BAR_DOC }),
  authored('character.hotkeys', 'Character hotkeys', [
    { builder: 'mythrill-hotkeys-{characterId}-{roomId}' }
  ]),
  authored('character.spellActionBar', 'Character spell action bar', [
    { builder: 'mythrill_spell_action_bar_{characterId}' }
  ]),
  hint('quest.notificationState', 'Quest notification suppression state', [
    { builder: 'achievement_{skillId}_{questId}' }
  ]),
  hint('party.hudPositions', 'Actor HUD positions', ['mythrill_party_hud_positions']),
  buildFamily({
    id: 'dice.history',
    title: 'Dice preferences and private roll history',
    keys: ['dice-store'],
    privacyClass: PRIVACY_CLASSES.MIXED,
    dataClass: DATA_CLASSES.PRIVATE_PROJECTION,
    notes: 'Preferences are pure UI; rollHistory may contain actor context. Split later.',
    globalWhen: null
  }),
  buildFamily({
    id: 'ui.windowPositions',
    title: 'Window positions (fixed UI ids; entity-bearing entries conditional)',
    keys: ['mythrill-window-positions'],
    privacyClass: PRIVACY_CLASSES.MIXED,
    dataClass: DATA_CLASSES.PRIVATE_METADATA_HINT,
    globalWhen: 'fixed-ui-window-ids-only',
    handoff: HANDOFF_BEHAVIORS.TAB_LOCAL_VALIDATE,
    concurrency: CONCURRENCY_STRATEGIES.NONE,
    notes: 'Only fixed UI window ids may remain global; entity-bearing entries must scope later.'
  }),

  // ── Offline caches / queues / character sync ─────────────────────────────
  recoverable('offline.characters', 'Offline character cache', ['offline_characters'], {
    legacyKeys: [{ prefix: 'offline_characters_' }],
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY
  }),
  recoverable('offline.maps', 'Offline map cache', ['offline_maps'], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY
  }),
  buildFamily({
    id: 'offline.actionQueue',
    title: 'Offline action queue',
    keys: ['offline_action_queue'],
    dataClass: DATA_CLASSES.RECOVERABLE,
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'Actions carry userId; replay truthfulness and cross-account isolation are later-slice work.'
  }),
  hint('offline.syncStatus', 'Offline sync status', ['offline_sync_status']),
  hint('offline.lastSync', 'Offline last-sync marker', ['offline_last_sync']),
  buildFamily({
    id: 'character.offlineChanges',
    title: 'Character offline change queue',
    keys: ['mythrill-offline-changes'],
    dataClass: DATA_CLASSES.RECOVERABLE,
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'Ownership isolation only; replay/status semantics belong to Project 6.'
  }),
  hint('character.syncStatus', 'Character sync status', ['mythrill-sync-status']),
  hint('character.migrationStatus', 'Character migration status', ['mythrill-migration-status']),
  recoverable('character.backups', 'Character backup recovery sources', [
    { prefix: 'mythrill-backup-' }
  ], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'Never generic-cleanup eligible; sole recovery copies.'
  }),
  recoverable('character.draftCache', 'Character draft cache', [
    { builder: 'character_draft_{draftRef}' }
  ], {
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    notes: 'Currently deleted by generic emergency cleanup; must be protected.'
  }),

  // ── Conversion / recent-room / multiplayer selection ─────────────────────
  recoverable('localRoom.conversionTransfer', 'Local-room conversion transfer payload', [
    'convertingLocalRoom'
  ]),
  hint('localRoom.conversionFlag', 'Local-room conversion flag', ['isConverting']),
  hint('room.recent.data', 'Recent room metadata cache', [
    { builder: 'room-data-{roomId}' }
  ]),
  hint('room.recent.lastJoined', 'Recent joined-room hint', ['lastJoinedRoom']),
  hint('room.recent.lastCreated', 'Recent created-room hint', ['lastCreatedRoom']),
  hint('room.recent.changed', 'Room data changed flag', ['roomDataChanged']),
  hint('guest.joinedRooms', 'Guest joined multiplayer rooms', ['mythrill-guest-joined-rooms']),
  hint('guest.joinedRoomLegacy', 'Legacy singular guest joined room', ['mythrill-guest-joined-room']),
  selector('multiplayer.selectedRoomId', 'Selected multiplayer room', 'selectedRoomId'),
  selector('multiplayer.gmResume', 'GM resume flag', 'isGMResume'),
  selector('multiplayer.resumeRoomName', 'Resume room name', 'resumeRoomName'),
  selector('multiplayer.testRoomFlag', 'Test-room flag', 'isTestRoom'),
  selector('multiplayer.worldBuilderFlag', 'World-builder flag', 'isWorldBuilderMode'),
  selector('multiplayer.autoCreateTestRoom', 'Auto-create test-room flag', 'autoCreateTestRoom'),

  // ── Session-scoped state ─────────────────────────────────────────────────
  sessionOnly('session.selectedRoomPassword', 'Selected room password', ['selectedRoomPassword']),
  sessionOnly('session.pendingGmInvitation', 'Pending GM session invitation', [
    'pendingGMSessionInvitation'
  ]),
  sessionOnly('session.lastEmittedInvitationId', 'Last emitted invitation id', [
    'lastEmittedInvitationId'
  ]),
  sessionOnly('session.invitationRetryCount', 'Invitation retry count', ['invitationRetryCount']),
  sessionOnly('session.enteringMultiplayer', 'Entering multiplayer flag', ['enteringMultiplayer']),
  sessionOnly('session.legacyFirebaseUserId', 'Legacy firebaseUserId session hint', ['firebaseUserId'], {
    notes: 'Legacy party-store fallback read; no current writer found.'
  }),
  sessionOnly('session.diagnosticsIds', 'Diagnostic session id markers', [
    'performance_session_id',
    'analytics_session_id'
  ]),

  // ── Account/session metadata hints ───────────────────────────────────────
  hint('account.sessionState', 'Client session metadata hint', ['mythrill-session-state']),
  hint('account.lastAccountType', 'Last observed account type marker', ['mythrill-last-account-type'], {
    notes: 'A hint, never ownership proof.'
  }),
  hint('account.lastUserId', 'Last observed user id marker', ['mythrill-last-user-id'], {
    notes: 'A hint, never ownership proof.'
  }),
  hint('account.guestIdentity', 'Guest identity/session metadata', [
    'mythrill-guest-user',
    'mythrill-guest-user-data',
    'mythrill-guest-initialized',
    'mythrill-guest-explicit-login'
  ], {
    allowedScopeKinds: GUEST,
    logoutRetention: LOGOUT_RETENTIONS.CLEAR_TRANSIENT
  }),
  buildFamily({
    id: 'account.devIdentity',
    title: 'Development/demo identity storage',
    keys: ['mythrill-admin-user', 'mythrill-admin-user-data', 'mythrill-admin-active', 'mythrill-demo-user', 'mythrill-demo-users', { builder: 'mythrill-user-{scopeRef}' }],
    dataClass: DATA_CLASSES.PRIVATE_METADATA_HINT,
    allowedScopeKinds: DEV,
    handoff: HANDOFF_BEHAVIORS.PRESERVE,
    logoutRetention: LOGOUT_RETENTIONS.CLEAR_TRANSIENT,
    concurrency: CONCURRENCY_STRATEGIES.NONE
  }),

  // ── Private diagnostics ──────────────────────────────────────────────────
  projection('diagnostics.performance', 'Private performance metrics', ['performance_data'], {
    serializer: 'json',
    notes: 'Identity-bearing records; pure operational counters may remain global later.'
  }),
  projection('diagnostics.errors', 'Private error logs', ['error_logs'], {
    serializer: 'json',
    legacyKeys: ['usage_stats']
  }),

  // ── Mixed map geometry edits ─────────────────────────────────────────────
  buildFamily({
    id: 'map.geometryMixed',
    title: 'Region/subregion/coordinate geometry (mixed public seed + edits)',
    keys: [
      'mythrill_region_polygons',
      'mythrill_subregion_polygons',
      { builder: 'mythrill_regional_polygons_{mapId}' },
      'mythrill_location_coordinates'
    ],
    privacyClass: PRIVACY_CLASSES.MIXED,
    dataClass: DATA_CLASSES.RECOVERABLE,
    globalWhen: 'verified-public-seed-only',
    migration: MIGRATION_DISPOSITIONS.FUTURE_SLICE,
    notes: 'Global only when the payload is a verified public seed; custom edits are private.'
  }),

  // ── Social private state ─────────────────────────────────────────────────
  hint('social.ignoredUsers', 'Ignored users list', [
    { builder: 'mythrill_ignored_{scopeRef}' }
  ]),

  // ── Legacy compatibility keys ────────────────────────────────────────────
  buildFamily({
    id: 'legacy.compatKeys',
    title: 'Legacy store/auth compatibility keys',
    keys: [
      'auth-store',
      'auth-storage',
      'party-store',
      'combat-store',
      'buff-store',
      'debuff-store',
      'spell-library-storage',
      'spell-library',
      'spellLibrary',
      'spellbook',
      'spells',
      'spellbook_state',
      'spell_cache_version',
      'mythrill-subregion-polygons'
    ],
    storage: STORAGE_MECHANISMS.LOCAL,
    dataClass: DATA_CLASSES.QUARANTINE,
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    handoff: HANDOFF_BEHAVIORS.PRESERVE,
    logoutRetention: LOGOUT_RETENTIONS.RETAIN_RECOVERY,
    notes: 'Compatibility/migration inputs; never ownership proof.'
  }),
  buildFamily({
    id: 'legacy.tempPrefixes',
    title: 'Generic temp/cache/debug prefixes currently treated as disposable',
    keys: [
      { prefix: 'mythrill-temp-' },
      { prefix: 'mythrill-cache-' },
      { prefix: 'mythrill-debug-' }
    ],
    dataClass: DATA_CLASSES.QUARANTINE,
    migration: MIGRATION_DISPOSITIONS.QUARANTINE_ONLY,
    handoff: HANDOFF_BEHAVIORS.PRESERVE,
    logoutRetention: LOGOUT_RETENTIONS.RETAIN_RECOVERY,
    notes: 'Fail-closed until Slice 2 explicitly re-verifies each prefix as rebuildable.'
  })
];

export const PRIVATE_STORAGE_REGISTRY = Object.freeze(REGISTRY_ENTRIES);

/**
 * Required frozen Slice 1 family IDs. The S1-01 test asserts every ID exists
 * in the registry so no frozen private family is silently omitted.
 */
export const FROZEN_SLICE1_FAMILY_IDS = Object.freeze([
  // Campaign planning
  'campaign.collection',
  'campaign.currentId',
  'campaign.pendingConflict',
  // Local rooms
  'localRoom.registry',
  'localRoom.statePrimary',
  'localRoom.stateLegacy',
  'localRoom.playerState',
  'localRoom.activeRoomId',
  'localRoom.activeFlag',
  // Core working projections
  'core.inventory',
  'core.mapWorking',
  'core.savedMaps',
  'core.characterTokens',
  'core.chat',
  'core.conditions',
  'core.cooldowns',
  // Character foundation
  'character.roster',
  'character.guestRoster',
  'character.activeId',
  // Worldbuilding categories
  'worldbuilding.books',
  'worldbuilding.interactiveMaps',
  'worldbuilding.familyTrees',
  'worldbuilding.lineages',
  'worldbuilding.factions',
  'worldbuilding.timelines',
  'worldbuilding.quests',
  'worldbuilding.worlds',
  'worldbuilding.deities',
  'worldbuilding.languages',
  'worldbuilding.dirty',
  // Journal
  'journal.shareable',
  // Additional authored/private
  'graph.entitiesNodes',
  'graph.entitiesEdges',
  'graph.factionLayout',
  'map.subregionCache',
  'map.starterSelection',
  'map.notes',
  'map.checklist',
  'map.historyBackup',
  'map.legacySectionState',
  'map.customFallback',
  'map.annotationsPins',
  'map.annotationsAreas',
  'map.annotationsShares',
  'library.user',
  'library.items',
  'library.spells',
  'library.spellbook',
  'library.spellData',
  'library.customSpells',
  'library.deletedSpells',
  'library.spellFilterPresets',
  'library.spellCollapsedSections',
  'library.summons',
  'library.effectPresets',
  'library.spellcraftingHistory',
  'library.itemCreatorRecent',
  'character.crafting',
  'campaign.tagRegistry',
  'character.actionBar',
  'character.hotkeys',
  'character.spellActionBar',
  'quest.notificationState',
  'party.hudPositions',
  'dice.history',
  'ui.windowPositions',
  'offline.characters',
  'offline.maps',
  'offline.actionQueue',
  'offline.syncStatus',
  'offline.lastSync',
  'character.offlineChanges',
  'character.syncStatus',
  'character.migrationStatus',
  'character.backups',
  'character.draftCache',
  'localRoom.conversionTransfer',
  'localRoom.conversionFlag',
  'room.recent.data',
  'room.recent.lastJoined',
  'room.recent.lastCreated',
  'room.recent.changed',
  'guest.joinedRooms',
  'guest.joinedRoomLegacy',
  'multiplayer.selectedRoomId',
  'multiplayer.gmResume',
  'multiplayer.resumeRoomName',
  'multiplayer.testRoomFlag',
  'multiplayer.worldBuilderFlag',
  'multiplayer.autoCreateTestRoom',
  'session.selectedRoomPassword',
  'session.pendingGmInvitation',
  'session.lastEmittedInvitationId',
  'session.invitationRetryCount',
  'session.enteringMultiplayer',
  'session.legacyFirebaseUserId',
  'session.diagnosticsIds',
  'account.sessionState',
  'account.lastAccountType',
  'account.lastUserId',
  'account.guestIdentity',
  'account.devIdentity',
  'diagnostics.performance',
  'diagnostics.errors',
  'map.geometryMixed',
  'social.ignoredUsers',
  'legacy.compatKeys',
  'legacy.tempPrefixes'
]);

const byId = new Map(PRIVATE_STORAGE_REGISTRY.map((entry) => [entry.id, entry]));

export function listFamilies() {
  return [...PRIVATE_STORAGE_REGISTRY];
}

export function listFamilyIds() {
  return PRIVATE_STORAGE_REGISTRY.map((entry) => entry.id);
}

export function getFamily(familyId) {
  return byId.get(familyId) || null;
}

export function requireFamily(familyId) {
  const family = getFamily(familyId);
  if (!family) {
    throw new Error(`P5 registry: unknown private storage family "${String(familyId)}"`);
  }
  return family;
}

function keyDeclMatches(decl, rawKey) {
  if (decl.kind === 'exact') return rawKey === decl.value;
  if (decl.kind === 'prefix') return rawKey.startsWith(decl.value);
  if (decl.kind === 'builder') return rawKey.startsWith(decl.prefix);
  return false;
}

/** All families whose key or legacy-key declarations match the raw key. */
export function findFamiliesForKey(rawKey) {
  if (typeof rawKey !== 'string' || rawKey.length === 0) return [];
  return PRIVATE_STORAGE_REGISTRY.filter((family) =>
    family.keys.some((decl) => keyDeclMatches(decl, rawKey)) ||
    family.legacyKeys.some((decl) => keyDeclMatches(decl, rawKey))
  );
}

/** First matching family; exact matches win over prefix/builder matches. */
export function getFamilyForKey(rawKey) {
  const matches = findFamiliesForKey(rawKey);
  if (matches.length === 0) return null;
  const exact = matches.find((family) =>
    family.keys.some((decl) => decl.kind === 'exact' && decl.value === rawKey)
  );
  return exact || matches[0];
}

/** Registry integrity checks used by tests. Throws on the first violation. */
export function assertRegistryValid() {
  const seenIds = new Set();
  for (const family of PRIVATE_STORAGE_REGISTRY) {
    if (!family.id || typeof family.id !== 'string') {
      throw new Error('P5 registry: family id missing');
    }
    if (seenIds.has(family.id)) {
      throw new Error(`P5 registry: duplicate family id "${family.id}"`);
    }
    seenIds.add(family.id);
    if (!family.title) throw new Error(`P5 registry: "${family.id}" missing title`);
    if (!Object.values(STORAGE_MECHANISMS).includes(family.storage)) {
      throw new Error(`P5 registry: "${family.id}" invalid storage`);
    }
    if (!Object.values(PRIVACY_CLASSES).includes(family.privacyClass)) {
      throw new Error(`P5 registry: "${family.id}" invalid privacy class`);
    }
    if (!Object.values(DATA_CLASSES).includes(family.dataClass)) {
      throw new Error(`P5 registry: "${family.id}" invalid data class`);
    }
    if (!Array.isArray(family.allowedScopeKinds) ||
      family.allowedScopeKinds.length === 0 ||
      family.allowedScopeKinds.some((kind) => !ALL_SCOPE_KINDS.includes(kind))) {
      throw new Error(`P5 registry: "${family.id}" invalid allowed scope kinds`);
    }
    if (!Object.values(HANDOFF_BEHAVIORS).includes(family.handoff)) {
      throw new Error(`P5 registry: "${family.id}" invalid handoff behavior`);
    }
    if (!Object.values(LOGOUT_RETENTIONS).includes(family.logoutRetention)) {
      throw new Error(`P5 registry: "${family.id}" invalid logout retention`);
    }
    if (!Object.values(MIGRATION_DISPOSITIONS).includes(family.migration)) {
      throw new Error(`P5 registry: "${family.id}" invalid migration disposition`);
    }
    if (typeof family.cleanupEligible !== 'boolean') {
      throw new Error(`P5 registry: "${family.id}" cleanup eligibility must be boolean`);
    }
    if (!family.keys || family.keys.length === 0) {
      throw new Error(`P5 registry: "${family.id}" has no key declarations`);
    }
    const cleanupSafeClasses = [DATA_CLASSES.PUBLIC_CACHE, DATA_CLASSES.SESSION_ONLY];
    if (family.cleanupEligible && !cleanupSafeClasses.includes(family.dataClass)) {
      throw new Error(
        `P5 registry: "${family.id}" is cleanup eligible but is ${family.dataClass}; authored/recovery data cannot be generic-cleanup eligible`
      );
    }
  }
  for (const requiredId of FROZEN_SLICE1_FAMILY_IDS) {
    if (!seenIds.has(requiredId)) {
      throw new Error(`P5 registry: frozen family missing from registry: ${requiredId}`);
    }
  }
  return true;
}

/** Totals by classification, for the Slice 1 audit report. */
export function registryTotals() {
  const totals = {};
  for (const family of PRIVATE_STORAGE_REGISTRY) {
    totals[family.dataClass] = (totals[family.dataClass] || 0) + 1;
  }
  return {
    familyCount: PRIVATE_STORAGE_REGISTRY.length,
    requiredCount: FROZEN_SLICE1_FAMILY_IDS.length,
    byDataClass: totals
  };
}
