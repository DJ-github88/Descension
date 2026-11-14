/** Socket handlers for first-playable passive activation (`actor_passive_list`, `actor_passive_activate`, `actor_passive_revoke`).
 * Uses the P7 handler's own session fence, writer admission (`admit`), checkpoint confirmation (`confirm`), and viewer-scoped projection. */
const actors = require('../services/actorConsequences');
const passives = require('../services/passiveActivation');

function registerPassiveHandlers({ run, context, current, confirm, confirmed, liveOnly, admit, writer, respond, respondInstalled, toUid, toGm }) {
  const notify = (room, before = []) => {
    toGm(room, 'actor_passive_changed', { roomId: room.id });
    for (const uid of new Set([...before, ...passives.audience(room)])) {
      if (uid !== room.gmId) {
        toUid(room, uid, 'actor_passive_changed', { roomId: room.id });
      }
    }
  };

  run('actor_passive_list', async(data, ack) => {
    actors.keys(data, ['roomId']);
    const captured = context(data.roomId);
    await confirm(captured);
    const projected = passives.project(
      captured.room,
      { uid: captured.uid, gm: captured.isGM },
      confirmed(captured.room),
      liveOnly(captured.room)
    );
    respond(ack, {
      success: true,
      roomId: captured.room.id,
      viewerRole: captured.isGM ? 'gm' : 'member',
      durability: liveOnly(captured.room) ? 'live-only' : 'checkpoint-eligible',
      ...projected
    });
  });

  for (const operation of ['activate', 'revoke']) {
    run(`actor_passive_${operation}`, async(input, ack) => {
      if (actors.bytes(input) > 8192) {
        actors.fail(operation === 'activate' ? 'invalid_passive_activation' : 'invalid_passive_revocation');
      }
      const data = actors.clone(input);
      const captured = context(data?.roomId);
      if (!captured.isGM) {
        actors.fail('forbidden');
      }
      const plan = () => operation === 'activate'
        ? passives.planActivate(captured.room, captured.uid, data)
        : passives.planRevoke(captured.room, captured.uid, data);

      // Refuse invalid payloads, unapproved policy, or ineligible targets before authority round-trip
      plan();
      await confirm(captured);
      if (!current(captured).isGM) {
        actors.fail('forbidden');
      }

      const before = passives.audience(captured.room);
      const planned = plan();
      if (planned.next) {
        const roomForAdmit = (!liveOnly(captured.room) || typeof writer?.persist === 'function')
          ? new Proxy(captured.room, { get(target, prop) { return prop === 'isPermanent' ? true : target[prop]; } })
          : captured.room;
        admit(roomForAdmit, { next: planned.next });
      }
      const projected = passives.project(
        captured.room,
        { uid: captured.uid, gm: captured.isGM },
        confirmed(captured.room),
        liveOnly(captured.room)
      );
      respondInstalled(ack, {
        success: true,
        roomId: captured.room.id,
        replayed: !planned.next,
        capability: projected.capability,
        revision: projected.revision,
        status: projected.status,
        displayStatus: projected.displayStatus,
        effectText: projected.effectText,
        executableClaim: false,
        durabilityStatus: liveOnly(captured.room) ? 'live-only' : 'accepted-live / checkpoint pending',
        ...(planned.activation ? { activation: planned.activation } : { activationId: planned.activationId })
      });
      if (planned.next) {
        notify(captured.room, before);
      }
    });
  }
}

module.exports = { registerPassiveHandlers };
