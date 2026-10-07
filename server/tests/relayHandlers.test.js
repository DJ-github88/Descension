/**
 * Relay-handler tests for the previously-orphaned client events:
 *   - spell_cast (combatHandlers) -> spell_cast
 *   - dice_roll (combatHandlers)  -> dice_roll_result (honours diceVisibility)
 *   - user_typing / user_stopped_typing (chatHandlers)
 *   - chat_message mute guard (chatHandlers)
 */

const { expect } = require('chai');
const { registerCombatHandlers } = require('../handlers/combatHandlers');
const { registerChatHandlers } = require('../handlers/chatHandlers');

function makeCombatCtx({ visibility = 'all', player } = {}) {
  const handlers = {};
  const roomEmits = [];
  const targetedEmits = [];

  const socket = {
    id: 's1',
    emit: () => {},
    to: (roomId) => ({ emit: (event, payload) => roomEmits.push({ event, payload, roomId }) }),
    on: (event, handler) => { handlers[event] = handler; }
  };

  const io = {
    to: (id) => ({ emit: (event, payload) => targetedEmits.push({ event, payload, id }) })
  };

  const room = {
    id: 'r1',
    settings: { diceVisibility: visibility },
    gm: { id: 'gm1', socketId: 'gm-sock' },
    gameState: { combat: { isActive: false } }
  };

  registerCombatHandlers({
    io,
    socket,
    logger: { info: () => {}, warn: () => {}, error: () => {} },
    validateRoomMembership: () => ({
      valid: true,
      player: player || { id: 'p1', name: 'Caster', isGM: false },
      room
    }),
    firebaseBatchWriter: { queueWrite: () => {} }
  });

  return { handlers, roomEmits, targetedEmits };
}

function makeChatCtx({ player } = {}) {
  const handlers = {};
  const roomEmits = [];

  const socket = {
    id: 's1',
    emit: () => {},
    to: (roomId) => ({ emit: (event, payload) => roomEmits.push({ event, payload, roomId }) }),
    on: (event, handler) => { handlers[event] = handler; }
  };

  const players = new Map([['s1', player || { id: 'p1', name: 'Talker', roomId: 'r1' }]]);
  const rooms = new Map([['r1', { id: 'r1', chatHistory: [], players: new Map() }]]);

  registerChatHandlers({
    io: { to: () => ({ emit: () => {} }) },
    socket,
    rooms,
    players,
    onlineSocialUsers: new Map(),
    logger: { info: () => {}, warn: () => {}, error: () => {} },
    uuidv4: () => 'uuid',
    sanitizeChatMessage: (s) => s,
    requireAuth: (fn) => fn,
    chatDebug: () => {},
    getSocketsByUserId: () => [],
    emitToUserId: () => {}
  });

  return { handlers, roomEmits };
}

describe('relay handlers', () => {
  describe('spell_cast', () => {
    it('broadcasts with server-stamped caster identity', () => {
      const { handlers, roomEmits } = makeCombatCtx();
      handlers.spell_cast({ spellId: 'fireball', spellName: 'Fireball', casterId: 'char1', targetIds: [] });

      expect(roomEmits).to.have.lengthOf(1);
      expect(roomEmits[0].event).to.equal('spell_cast');
      expect(roomEmits[0].payload.casterName).to.equal('Caster');
      expect(roomEmits[0].payload.playerId).to.equal('p1');
      expect(roomEmits[0].payload.spellName).to.equal('Fireball');
    });
  });

  describe('dice_roll', () => {
    it('broadcasts dice_roll_result when visibility is all', () => {
      const { handlers, roomEmits } = makeCombatCtx({ visibility: 'all' });
      handlers.dice_roll({ id: 'roll1', total: 15 });
      expect(roomEmits).to.have.lengthOf(1);
      expect(roomEmits[0].event).to.equal('dice_roll_result');
      expect(roomEmits[0].payload.playerId).to.equal('p1');
    });

    it('does not broadcast when visibility is private', () => {
      const { handlers, roomEmits } = makeCombatCtx({ visibility: 'private' });
      handlers.dice_roll({ id: 'roll1', total: 15 });
      expect(roomEmits).to.have.lengthOf(0);
    });

    it('targets the GM only when visibility is gm', () => {
      const { handlers, roomEmits, targetedEmits } = makeCombatCtx({ visibility: 'gm' });
      handlers.dice_roll({ id: 'roll1', total: 15 });
      expect(roomEmits).to.have.lengthOf(0);
      expect(targetedEmits).to.have.lengthOf(1);
      expect(targetedEmits[0].id).to.equal('gm-sock');
      expect(targetedEmits[0].event).to.equal('dice_roll_result');
    });
  });

  describe('typing indicators', () => {
    it('relays user_typing with server identity', () => {
      const { handlers, roomEmits } = makeChatCtx();
      handlers.user_typing({ playerId: 'spoofed', playerName: 'spoofed' });
      expect(roomEmits[0].event).to.equal('user_typing');
      expect(roomEmits[0].payload).to.deep.equal({ playerId: 'p1', playerName: 'Talker' });
    });

    it('relays user_stopped_typing', () => {
      const { handlers, roomEmits } = makeChatCtx();
      handlers.user_stopped_typing();
      expect(roomEmits[0].event).to.equal('user_stopped_typing');
    });
  });

  describe('chat_message mute guard', () => {
    it('blocks a muted player', async () => {
      const { handlers, roomEmits } = makeChatCtx({
        player: { id: 'p1', name: 'Talker', roomId: 'r1', muted: true }
      });
      await handlers.chat_message({ message: 'hello' });
      expect(roomEmits).to.have.lengthOf(0);
    });
  });
});
