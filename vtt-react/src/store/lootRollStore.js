/**
 * Loot Roll Store
 *
 * Client mirror of the server's Need / Greed / Pass loot roll sessions.
 * The server makes every d20 roll; this store only tracks what to show and
 * sends the player's choices.
 */
import { create } from 'zustand';
import useGameStore from './gameStore';
import useInventoryStore from './inventoryStore';

// Dice in the roll frames tumble for up to ~2.5s before landing (see
// LootRollManager). Chat lines and auto-loot wait this long so they don't
// spoil the result.
export const LOOT_REVEAL_SETTLE_MS = 2700;
const RESOLVED_LINGER_MS = 11500;
const dismissTimers = new Map();

// The server sends "remainingMs" rather than absolute times so client clock skew
// doesn't matter. Convert to local deadlines on receipt.
const localizeItem = (item) => {
  const now = Date.now();
  return {
    ...item,
    deadline: now + (item.remainingMs || 0),
    tiebreak: item.tiebreak
      ? { ...item.tiebreak, deadline: now + (item.tiebreak.remainingMs || 0) }
      : null
  };
};

const emit = (event, payload) => {
  const gameState = useGameStore.getState();
  const socket = gameState.multiplayerSocket;
  const roomId = gameState.multiplayerRoom?.id;
  if (!socket || !socket.connected || !roomId) return false;
  socket.emit(event, { roomId, ...payload }, (ack) => {
    if (ack && ack.success === false) {
      console.warn(`[LootRoll] ${event} rejected:`, ack.error);
    }
  });
  return true;
};

// Local (offline / test-player) rolls are run in the browser by
// services/localLootRollService.js, which registers itself here so this store
// doesn't need to import it.
let localRouter = null;
export const setLocalLootRouter = (router) => { localRouter = router; };

const useLootRollStore = create((set, get) => ({
  // sessionId -> { sessionId, creatureName, canRoll, yourPlayerId, order: [dropId], items: { dropId: item } }
  sessions: {},
  // `${sessionId}:${dropId}` -> 'need' | 'greed' | 'pass' | 'reroll' (optimistic, until the server echoes)
  pending: {},
  // This client's server-side player id (learned from loot_roll_started), used to
  // tell whether a reserved orb was won by us.
  myPlayerId: null,

  sessionStarted: (payload) => {
    if (!payload?.sessionId || !Array.isArray(payload.items)) return;
    if (payload.yourPlayerId && !payload.isLocal) set({ myPlayerId: payload.yourPlayerId });
    const items = {};
    payload.items.forEach(item => { items[item.dropId] = localizeItem(item); });
    set(state => ({
      sessions: {
        ...state.sessions,
        [payload.sessionId]: {
          sessionId: payload.sessionId,
          creatureName: payload.creatureName || 'creature',
          creatureImage: payload.creatureImage || null,
          isLocal: !!payload.isLocal,
          startedBy: payload.startedBy,
          canRoll: !!payload.canRoll,
          yourPlayerId: payload.yourPlayerId || null,
          order: payload.items.map(it => it.dropId),
          items,
          ended: !!payload.ended
        }
      }
    }));
  },

  itemUpdated: (sessionId, item) => {
    if (!item) return;
    set(state => {
      const session = state.sessions[sessionId];
      if (!session || !session.items[item.dropId]) return state;
      return {
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...session,
            items: { ...session.items, [item.dropId]: { ...localizeItem(item), resolvedAt: session.items[item.dropId].resolvedAt } }
          }
        }
      };
    });
  },

  itemResolved: (sessionId, item) => {
    if (!item) return;
    const session = get().sessions[sessionId];
    if (!session || !session.items[item.dropId]) return;
    set(state => ({
      sessions: {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          items: { ...state.sessions[sessionId].items, [item.dropId]: { ...localizeItem(item), resolvedAt: Date.now() } }
        }
      }
    }));
    const key = `${sessionId}:${item.dropId}`;
    if (dismissTimers.has(key)) clearTimeout(dismissTimers.get(key));
    dismissTimers.set(key, setTimeout(() => {
      dismissTimers.delete(key);
      get().dismissItem(sessionId, item.dropId);
    }, RESOLVED_LINGER_MS));
  },

  sessionEnded: (sessionId) => {
    set(state => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      return { sessions: { ...state.sessions, [sessionId]: { ...session, ended: true } } };
    });
  },

  dismissItem: (sessionId, dropId) => {
    set(state => {
      const session = state.sessions[sessionId];
      if (!session) return state;
      const order = session.order.filter(id => id !== dropId);
      const sessions = { ...state.sessions };
      if (order.length === 0) {
        delete sessions[sessionId];
      } else {
        sessions[sessionId] = { ...session, order };
      }
      return { sessions };
    });
  },

  choose: (sessionId, dropId, choice) => {
    const key = `${sessionId}:${dropId}`;
    if (get().pending[key]) return;
    const characterName = useInventoryStore.getState().characterName || undefined;
    if (get().sessions[sessionId]?.isLocal) {
      set(state => ({ pending: { ...state.pending, [key]: choice } }));
      localRouter?.choose(sessionId, dropId, choice, characterName);
      return;
    }
    if (emit('loot_roll_choice', { sessionId, dropId, choice, characterName })) {
      set(state => ({ pending: { ...state.pending, [key]: choice } }));
    }
  },

  reroll: (sessionId, dropId, round) => {
    const key = `${sessionId}:${dropId}:reroll:${round}`;
    if (get().pending[key]) return;
    if (get().sessions[sessionId]?.isLocal) {
      set(state => ({ pending: { ...state.pending, [key]: 'reroll' } }));
      localRouter?.reroll(sessionId, dropId);
      return;
    }
    if (emit('loot_roll_reroll', { sessionId, dropId })) {
      set(state => ({ pending: { ...state.pending, [key]: 'reroll' } }));
    }
  },

  reset: () => {
    dismissTimers.forEach(t => clearTimeout(t));
    dismissTimers.clear();
    set({ sessions: {}, pending: {} });
  }
}));

// Best-known id of the local player in the multiplayer room.
export const getMyLootPlayerId = () =>
  useLootRollStore.getState().myPlayerId || useGameStore.getState().currentPlayer?.id || null;

export default useLootRollStore;
