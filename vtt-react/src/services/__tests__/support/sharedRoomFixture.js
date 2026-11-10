/** Fake shared room for the consumable tests (disclosed fixture): one owner (u2 / character c2) with one primary PC token,
 * a socket whose 'actor_snapshot' returns that token and whose 'actor_consequence' answers through `room.respond`.
 * REFUSAL is the recorded production shape for `attribute_change_gm_only` (server/services/actorConsequences.js).
 * The projection fence is module state in the service (cuts only move forward, revisions never go back): `reset()` gives each
 * test a later cut and a new actor instance. */
export const REFUSAL = { success: false, code: 'attribute_change_gm_only',
  error: 'Only the GM can record a manual change to this attribute; authored changes go through an approved action. Nothing was applied.' };

let cutBase = 0;
export function createRoom() {
  const room = { emitted: [], respond: null, revision: 3, conditions: [], commitSeq: 5, projection: null, ref: null };
  room.reset = () => {
    cutBase += 10; Object.assign(room, { emitted: [], revision: 3, conditions: [], commitSeq: 5 });
    room.ref = { kind: 'character', roomId: 'r', mapId: 'm', tokenId: 'pc2', instanceId: `i${cutBase}`, ownerUid: 'u2', characterId: 'c2' };
    room.projection = { version: 1, epoch: 'e1', cut: cutBase, roomId: 'r' };
    room.respond = event => (event === 'actor_snapshot' ? room.snapshot() : REFUSAL);
  };
  room.pcToken = () => ({ id: 'pc2', ownerUserId: 'u2',
    character: { id: 'c2', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 },
    state: { conditions: room.conditions, actorContract: { version: 1, ...room.ref, revision: room.revision, primary: true } } });
  room.snapshot = () => ({ success: true, roomId: 'r', actionEpoch: 1, commitSequence: room.commitSeq, replayFloor: 0, actorProjection: room.projection,
    maps: { m: { id: 'm', actorProjection: room.projection, tokens: {}, creatures: {}, characterTokens: { pc2: room.pcToken() } } } });
  room.accepted = payload => {
    const op = payload.actors[0];
    const conditions = [...room.conditions, ...op.conditions.map(value => ({ ...value.record }))];
    const before = room.revision; room.revision += 1; room.conditions = conditions; room.commitSeq += 1;
    room.projection = { ...room.projection, cut: room.projection.cut + 1 };
    const res = { hp: { current: 20, max: 40, temp: 0 }, mana: { current: 10, max: 30, temp: 0 }, ap: { current: 2, max: 5, temp: 0 } };
    return { success: true, status: 'accepted', delivery: 'live', receipt: { version: 1, roomId: 'r', admissionEpoch: 1, commitSequence: room.commitSeq,
        actors: [{ ref: room.ref, beforeRevision: before, afterRevision: room.revision, conditions, finalResources: res }] },
      actorSnapshot: room.snapshot() };
  };
  room.socket = () => ({ connected: true, id: 'sock', emit: (event, payload, ack) => { room.emitted.push({ event, payload });
    if (typeof ack === 'function') ack(room.respond(event, payload)); } });
  room.actorEvents = () => room.emitted.filter(e => /^actor_/.test(e.event));  // other emits are the existing sheet resource syncs
  room.commands = () => room.emitted.filter(e => e.event === 'actor_consequence');
  return room;
}
