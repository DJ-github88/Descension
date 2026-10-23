/**
 * Local Loot Rolls + Test Players
 *
 * Lets you try Need / Greed / Pass loot rolls without a multiplayer room:
 * add "test players" from the party HUD context menu, and they join the roll
 * with you, choosing and rerolling on their own after a short delay.
 *
 * The rules are the same engine the server uses (utils/lootRollEngine.js);
 * here it runs in the browser and feeds lootRollStore directly.
 */
import { LootRollEngine } from '../utils/lootRollEngine';
import useLootRollStore, { setLocalLootRouter, LOOT_REVEAL_SETTLE_MS } from '../store/lootRollStore';
import usePartyStore from '../store/partyStore';
import useGridItemStore from '../store/gridItemStore';
import useInventoryStore from '../store/inventoryStore';
import useChatStore from '../store/chatStore';

export const LOCAL_SELF_ID = 'local-self';

// ------------------------------------------------------------------ test players

const TEST_PLAYER_NAMES = ['Brannoc', 'Ysolde', 'Tamsin', 'Corvin', 'Elin', 'Halvard', 'Maren', 'Osric'];

export const getTestPlayers = () =>
  (usePartyStore.getState().partyMembers || []).filter(m => m?.isTestPlayer);

/**
 * Add a pretend party member (local play only).
 * @param {Object} [selfMember] the local player's own HUD entry - added to the party
 *   first if the party is still empty, so your own frame doesn't disappear.
 */
export const addTestPlayer = (selfMember = null) => {
  const party = usePartyStore.getState();
  const members = party.partyMembers || [];

  if (selfMember && !members.some(m => m && !m.isTestPlayer)) {
    party.addPartyMember({ ...selfMember, isConnected: true });
  }

  const usedNames = new Set(getTestPlayers().map(m => m.name));
  const name = TEST_PLAYER_NAMES.find(n => !usedNames.has(n)) || `Test Player ${getTestPlayers().length + 1}`;
  const id = `test-player-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const maxHp = 20 + Math.floor(Math.random() * 20);

  party.addPartyMember({
    id,
    userId: id,
    name,
    characterName: name,
    isConnected: true,
    isGM: false,
    isTestPlayer: true,
    character: {
      level: 1,
      health: { current: maxHp, max: maxHp },
      mana: { current: 20, max: 20 },
      actionPoints: { current: 3, max: 3 },
      tempHealth: 0,
      tempMana: 0,
      tempActionPoints: 0,
      exhaustionLevel: 0
    }
  });

  useChatStore.getState().addSocialNotification?.({
    sender: { name: 'System', class: 'system', level: 0 },
    content: `${name} (test player) joined the party.`,
    type: 'system'
  });
  return id;
};

export const removeTestPlayer = (memberId) => {
  if (!memberId) return;
  usePartyStore.getState().removePartyMember(memberId);
};

export const removeAllTestPlayers = () => {
  getTestPlayers().forEach(m => removeTestPlayer(m.id));
};

// ------------------------------------------------------------------ local rolls

const botTimers = new Set();
const botSchedule = (fn, minMs, maxMs) => {
  const t = setTimeout(() => {
    botTimers.delete(t);
    fn();
  }, minMs + Math.random() * (maxMs - minMs));
  botTimers.add(t);
};

// Test players always press Need (they still reroll on their own when tied).
const pickBotChoice = () => 'need';

let engine = null;
const scheduledRerolls = new Set(); // `${sessionId}:${dropId}:${round}:${playerId}`

const announce = (item) => {
  const content = item.winner
    ? `${item.winner.name} won ${item.name} (${item.winner.category === 'need' ? 'Need' : 'Greed'} · d20 ${item.winner.roll}${item.tiebreakHistory?.length ? ` after ${item.tiebreakHistory.length} reroll${item.tiebreakHistory.length > 1 ? 's' : ''}` : ''}).`
    : `Everyone passed on ${item.name} — it stays on the ground.`;
  useChatStore.getState().addSocialNotification?.({
    sender: { name: 'Loot', class: 'system', level: 0 },
    content,
    type: 'system'
  });
};

const getEngine = () => {
  if (engine) return engine;
  engine = new LootRollEngine({
    hooks: {
      broadcast: (session, event, payload) => {
        const store = useLootRollStore.getState();
        if (event === 'loot_roll_updated') {
          store.itemUpdated(payload.sessionId, payload.item);
          // Tied test players reroll by themselves after a moment.
          const tb = payload.item?.tiebreak;
          if (tb) {
            tb.playerIds.forEach(pid => {
              if (pid === LOCAL_SELF_ID || tb.rerolled.includes(pid)) return;
              const key = `${session.id}:${payload.item.dropId}:${tb.round}:${pid}`;
              if (scheduledRerolls.has(key)) return;
              scheduledRerolls.add(key);
              botSchedule(() => engine.reroll(session.id, pid, payload.item.dropId), 900, 2600);
            });
          }
        } else if (event === 'loot_roll_item_resolved') {
          store.itemResolved(payload.sessionId, payload.item);
          setTimeout(() => announce(payload.item), LOOT_REVEAL_SETTLE_MS);
        } else if (event === 'loot_roll_ended') {
          store.sessionEnded(payload.sessionId);
        }
      },
      onItemResolved: (session, item) => {
        // Hand the item over once the dice have landed on screen.
        setTimeout(() => applyLocalResult(item), LOOT_REVEAL_SETTLE_MS);
      }
    }
  });

  setLocalLootRouter({
    choose: (sessionId, dropId, choice, characterName) =>
      engine.choose(sessionId, LOCAL_SELF_ID, dropId, choice, characterName),
    reroll: (sessionId, dropId) => engine.reroll(sessionId, LOCAL_SELF_ID, dropId)
  });
  return engine;
};

const applyLocalResult = (item) => {
  const gridStore = useGridItemStore.getState();
  const exists = (gridStore.gridItems || []).some(gi => gi?.id === item.gridItemId);
  if (!exists) return;

  if (item.winner?.playerId === LOCAL_SELF_ID) {
    const looterName = useInventoryStore.getState().characterName || 'Player';
    gridStore.updateGridItemProperties(item.gridItemId, {
      lootRollLocked: false, lootRollSessionId: null, lootRollExpiresAt: null
    }, false);
    gridStore.lootItem(item.gridItemId, 'default', looterName, false, { force: true });
  } else if (item.winner) {
    // A test player won: they "pick it up".
    gridStore.removeItemFromGrid(item.gridItemId, false);
  } else {
    gridStore.updateGridItemProperties(item.gridItemId, {
      lootRollLocked: false,
      lootRollSessionId: null,
      lootRollExpiresAt: null,
      lootRollWinnerId: null,
      lootRollWinnerName: null
    }, false);
  }
};

/**
 * Start a roll in the browser between you and the party's test players.
 * @returns {boolean} true if a roll started
 */
export const startLocalLootRoll = ({ sessionId, creatureName, creatureImage, durationSec, items }) => {
  const bots = getTestPlayers();
  const selfName = useInventoryStore.getState().characterName || 'You';
  const eng = getEngine();

  const result = eng.startSession({
    sessionId,
    roomId: 'local',
    mapId: 'local',
    creatureName,
    creatureImage,
    startedBy: selfName,
    durationMs: (Number(durationSec) || 30) * 1000,
    items,
    eligible: [
      { playerId: LOCAL_SELF_ID, name: selfName },
      ...bots.map(b => ({ playerId: b.id, name: b.name }))
    ]
  });
  if (!result.ok) return false;

  useLootRollStore.getState().sessionStarted({
    ...eng.publicSession(result.session),
    yourPlayerId: LOCAL_SELF_ID,
    canRoll: true,
    isLocal: true
  });

  result.session.items.forEach(item => {
    bots.forEach(bot => {
      botSchedule(() => eng.choose(sessionId, bot.id, item.dropId, pickBotChoice()), 1200, 5500);
    });
  });
  return true;
};
