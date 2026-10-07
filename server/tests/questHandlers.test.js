/**
 * Handler-level tests for questHandlers.js.
 *
 * Drives the registered handlers via a captured-`socket.on` harness and
 * asserts the relay contract with the client quest protocol:
 *   - GM-only gating (share/rewards/deny)
 *   - room broadcast vs targeted delivery (emitToUserId)
 *   - oversized/missing payload rejection
 */

const { expect } = require('chai');
const sinon = require('sinon');
const { registerQuestHandlers } = require('../handlers/questHandlers');

function makeCtx(overrides = {}) {
  const handlers = {};
  const socketEmits = [];
  const roomEmits = [];
  const userEmits = [];

  const socket = {
    id: 'sock-1',
    emit: sinon.stub().callsFake((event, payload) => socketEmits.push({ event, payload })),
    to: sinon.stub().callsFake((roomId) => ({
      emit: (event, payload) => roomEmits.push({ event, payload, roomId })
    })),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; })
  };

  const player = overrides.player || { id: 'p-gm', name: 'Game Master' };
  const room = overrides.room || { id: 'r1' };

  const ctx = {
    socket,
    logger: { debug: sinon.stub(), info: sinon.stub(), warn: sinon.stub(), error: sinon.stub() },
    validateRoomMembership: sinon.stub().returns({
      valid: overrides.valid !== undefined ? overrides.valid : true,
      player,
      room
    }),
    emitToUserId: sinon.stub().callsFake((userId, event, payload) => {
      userEmits.push({ userId, event, payload });
    })
  };

  registerQuestHandlers(ctx);

  return { handlers, socketEmits, roomEmits, userEmits, ctx, player, room };
}

describe('questHandlers', () => {
  describe('share_quest (GM)', () => {
    it('broadcasts quest_shared to others and confirms to the GM', () => {
      const { handlers, roomEmits, socketEmits } = makeCtx();
      handlers.share_quest({ quest: { id: 'q1', title: 'Slay the Wyrm' } });

      expect(roomEmits).to.have.lengthOf(1);
      expect(roomEmits[0].event).to.equal('quest_shared');
      expect(roomEmits[0].roomId).to.equal('r1');
      expect(roomEmits[0].payload.quest.id).to.equal('q1');
      expect(roomEmits[0].payload.sharedBy).to.deep.equal({ id: 'p-gm', name: 'Game Master' });

      expect(socketEmits).to.have.lengthOf(1);
      expect(socketEmits[0].event).to.equal('quest_share_confirmed');
      expect(socketEmits[0].payload.questTitle).to.equal('Slay the Wyrm');
    });

    it('does nothing when validation fails (non-GM)', () => {
      const { handlers, roomEmits, socketEmits } = makeCtx({ valid: false });
      handlers.share_quest({ quest: { id: 'q1', title: 'Nope' } });
      expect(roomEmits).to.have.lengthOf(0);
      expect(socketEmits).to.have.lengthOf(0);
    });

    it('rejects a missing quest payload', () => {
      const { handlers, roomEmits, socketEmits } = makeCtx();
      handlers.share_quest({});
      expect(roomEmits).to.have.lengthOf(0);
      expect(socketEmits).to.have.lengthOf(0);
    });
  });

  describe('quest_accepted / quest_declined (player)', () => {
    it('relays acceptance to the room with player identity', () => {
      const { handlers, roomEmits } = makeCtx({ player: { id: 'p2', name: 'Player Two' } });
      handlers.quest_accepted({ questId: 'q1', questTitle: 'Slay' });

      expect(roomEmits).to.have.lengthOf(1);
      expect(roomEmits[0].event).to.equal('quest_accepted_notification');
      expect(roomEmits[0].payload).to.include({ questId: 'q1', playerId: 'p2', playerName: 'Player Two' });
    });

    it('relays decline to the room', () => {
      const { handlers, roomEmits } = makeCtx({ player: { id: 'p3', name: 'Player Three' } });
      handlers.quest_declined({ questId: 'q2', questTitle: 'Nah' });
      expect(roomEmits[0].event).to.equal('quest_declined_notification');
      expect(roomEmits[0].payload.playerId).to.equal('p3');
    });
  });

  describe('quest_complete_request (player)', () => {
    it('notifies the GM and confirms to the requester', () => {
      const { handlers, roomEmits, socketEmits } = makeCtx({ player: { id: 'p2', name: 'Player Two' } });
      handlers.quest_complete_request({ quest: { id: 'q1', title: 'Done' } });

      expect(roomEmits[0].event).to.equal('quest_completion_pending');
      expect(roomEmits[0].payload.quest.id).to.equal('q1');
      expect(socketEmits[0].event).to.equal('quest_completion_request_sent');
    });
  });

  describe('quest_rewards_delivered (GM)', () => {
    it('delivers rewards to the target player and confirms to the GM', () => {
      const { handlers, userEmits, socketEmits } = makeCtx();
      handlers.quest_rewards_delivered({
        questId: 'q1',
        questTitle: 'Slay',
        playerId: 'p2',
        playerName: 'Player Two',
        rewards: { experience: 100, currency: { gold: 50 } }
      });

      expect(userEmits).to.have.lengthOf(1);
      expect(userEmits[0].userId).to.equal('p2');
      expect(userEmits[0].event).to.equal('rewards_received');
      expect(userEmits[0].payload.rewards.experience).to.equal(100);
      expect(userEmits[0].payload.deliveredBy).to.equal('Game Master');

      expect(socketEmits[0].event).to.equal('rewards_delivery_confirmed');
      expect(socketEmits[0].payload.playerId).to.equal('p2');
    });

    it('requires a target player id', () => {
      const { handlers, userEmits } = makeCtx();
      handlers.quest_rewards_delivered({ questId: 'q1' });
      expect(userEmits).to.have.lengthOf(0);
    });
  });

  describe('quest_completion_denied (GM)', () => {
    it('notifies the target player', () => {
      const { handlers, userEmits } = makeCtx();
      handlers.quest_completion_denied({ questId: 'q1', questTitle: 'Slay', playerId: 'p2', reason: 'Not done' });

      expect(userEmits).to.have.lengthOf(1);
      expect(userEmits[0].userId).to.equal('p2');
      expect(userEmits[0].event).to.equal('completion_denied');
      expect(userEmits[0].payload.reason).to.equal('Not done');
    });
  });
});
