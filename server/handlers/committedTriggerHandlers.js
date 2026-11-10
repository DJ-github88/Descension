/** Shared trigger foundation v1: diagnostic listener registration, list and GM dismissal.
 * Uses the P7 handler's own session fence, writer admission and receipt publication; owns no persistence. */
const actors = require('../services/actorConsequences');
const triggers = require('../services/committedTriggers');

function registerCommittedTriggerHandlers({ run, context, current, confirm, confirmed, liveOnly, admit, resultFor, respond, respondInstalled, publishInstalled, toUid, toGm }) {
  const notify = (room, before = []) => {
    toGm(room, 'actor_trigger_changed', { roomId: room.id });
    for (const uid of new Set([...before, ...triggers.audience(room)])) {if (uid !== room.gmId) {toUid(room, uid, 'actor_trigger_changed', { roomId: room.id });}}
  };
  run('actor_trigger_list', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const captured = context(data.roomId);
    await confirm(captured);
    respond(ack, { success: true, roomId: captured.room.id, capability: triggers.CAPABILITY, mode: 'diagnostic', viewerRole: captured.isGM ? 'gm' : 'member',
      durability: liveOnly(captured.room) ? 'live-only' : 'checkpoint-eligible',
      ...triggers.project(captured.room, { uid: captured.uid, gm: captured.isGM }, confirmed(captured.room), liveOnly(captured.room)) });
  });
  for (const operation of ['register', 'revoke']) {
    run(`actor_trigger_${operation}`, async(input, ack) => {
      if (actors.bytes(input) > 8192) {actors.fail('invalid_trigger_listener');}
      const data = actors.clone(input), captured = context(data.roomId);
      if (!captured.isGM) {actors.fail('forbidden');}
      const plan = () => operation === 'register' ? triggers.planRegister(captured.room, captured.uid, data) : triggers.planRevoke(captured.room, captured.uid, data);
      plan(); // refuse before any authority round-trip
      await confirm(captured);
      if (!current(captured).isGM) {actors.fail('forbidden');}
      // Re-planned from current state after the await; no await separates this from admission.
      const before = triggers.audience(captured.room), planned = plan();
      if (planned.next) {admit(captured.room, { next: planned.next });}
      respondInstalled(ack, { success: true, roomId: captured.room.id, capability: triggers.CAPABILITY, mode: 'diagnostic',
        ...(planned.listener ? { listener: planned.listener } : { listenerId: planned.listenerId }),
        revision: triggers.ledger(captured.room.gameState).revision, status: liveOnly(captured.room) ? 'live-only' : 'accepted-live / checkpoint pending' });
      if (planned.next) {notify(captured.room, before);}
    });
  }
  run('actor_trigger_dismiss', async(data, ack) => {
    triggers.validateDismiss(data);
    const captured = context(data.roomId);
    if (!captured.isGM) {actors.fail('forbidden');}
    const old = actors.knownReceipt(captured.room, captured.uid, data);
    if (old) {respondInstalled(ack, resultFor(captured.room, old)); return;}
    await confirm(captured);
    const afterConfirm = actors.knownReceipt(captured.room, captured.uid, data);
    if (afterConfirm) {respondInstalled(ack, resultFor(captured.room, afterConfirm)); return;}
    const before = triggers.audience(captured.room);
    const staged = triggers.stageDismiss(captured.room, captured.player, captured.uid, data, confirmed(captured.room));
    current(captured);
    admit(captured.room, staged);
    publishInstalled(captured.room, 'actor_consequence_accepted', resultFor(captured.room, staged.receipt), ack);
    notify(captured.room, before);
  });
}
module.exports = { registerCommittedTriggerHandlers };
