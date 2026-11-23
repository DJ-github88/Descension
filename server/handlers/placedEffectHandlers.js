/** Socket handlers for placed map effects (`actor_placed_effect_list`, `actor_placed_effect_place`, `actor_placed_effect_remove`).
 * Uses the P7 session fence, writer admission (`admit`), checkpoint confirmation (`confirm`), and viewer-scoped projection. */
const actors = require('../services/actorConsequences');
const placed = require('../services/placedEffect');

function registerPlacedEffectHandlers({ run, context, current, confirm, confirmed, liveOnly, admit, writer, respond, respondInstalled, deliver, toUid, toGm }) {
  const notify = (room, before) => {
    const after = placed.audience(room);
    if (before.publicChange || after.publicChange) {
      deliver(room, 'actor_placed_effect_changed', { roomId: room.id });
      return;
    }
    toGm(room, 'actor_placed_effect_changed', { roomId: room.id });
    for (const uid of new Set([...before.ownerUids, ...after.ownerUids])) {
      if (uid !== room.gmId) {
        toUid(room, uid, 'actor_placed_effect_changed', { roomId: room.id });
      }
    }
  };

  run('actor_placed_effect_list', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const captured = context(data.roomId);
    await confirm(captured);
    const projected = placed.project(captured.room, { uid: captured.uid, gm: captured.isGM });
    respond(ack, {
      success: true,
      roomId: captured.room.id,
      viewerRole: captured.isGM ? 'gm' : 'member',
      durability: liveOnly(captured.room) ? 'live-only' : 'checkpoint-eligible',
      ...projected
    });
  });

  for (const operation of ['place', 'remove']) {
    run(`actor_placed_effect_${operation}`, async(input, ack) => {
      if (actors.bytes(input) > 16384) {
        actors.fail('invalid_placed_effect');
      }
      const data = actors.clone(input);
      const captured = context(data?.roomId);
      if (!captured.isGM) {
        actors.fail('forbidden');
      }
      const plan = () => operation === 'place'
        ? placed.planPlace(captured.room, captured.uid, data)
        : placed.planRemove(captured.room, captured.uid, data);

      // Fail closed on invalid payloads, unapproved arming, or stale revisions before authority check
      plan();
      await confirm(captured);
      if (!current(captured).isGM) {
        actors.fail('forbidden');
      }

      const before = placed.audience(captured.room);
      const planned = plan();
      if (planned.next) {
        const roomForAdmit = (!liveOnly(captured.room) || typeof writer?.persist === 'function')
          ? new Proxy(captured.room, { get(target, prop) { return prop === 'isPermanent' ? true : target[prop]; } })
          : captured.room;
        admit(roomForAdmit, { next: planned.next });
      }
      const projected = placed.project(captured.room, { uid: captured.uid, gm: captured.isGM });
      respondInstalled(ack, {
        success: true,
        roomId: captured.room.id,
        replayed: !planned.next,
        durabilityStatus: liveOnly(captured.room) ? 'live-only' : 'accepted-live / checkpoint pending',
        ...(planned.placement ? { placement: planned.placement } : { placementId: planned.placementId }),
        ...projected
      });
      if (planned.next) {
        notify(captured.room, before);
      }
    });
  }
}

module.exports = { registerPlacedEffectHandlers };
