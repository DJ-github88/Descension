/** Lifecycle order is independent of actor revisions, receipts and checkpoints.
 * A full actor projection on lifecycle delivery certifies absence, including
 * missed events. Bytes and cut are captured synchronously from the same state. */
function current(room) {
  const epoch = require('./actorConsequences').epoch(room);
  const stored = room.gameState.actorProjection;
  return { version: 1, roomId: room.id, epoch, cut: stored?.epoch === epoch ? stored.cut : 0 };
}
function advance(room, next = room.gameState, created = []) {
  const projection = current(room);
  if (!Number.isSafeInteger(projection.cut) || !Number.isSafeInteger(projection.cut + 1)) {
    require('./actorConsequences').fail('projection_order_exhausted');
  }
  next.actorProjection = { ...projection, cut: projection.cut + 1 };
  for (const token of created) {
    token.state = { ...token.state, actorLifecycle: { ...next.actorProjection } };
  }
  return next.actorProjection;
}
function snapshot(room) {
  const actorProjection = current(room);
  const access = require('./roomAccessService');
  const maps = Object.fromEntries(Object.entries(room.gameState.maps || {}).map(([id, map]) => [id,
    { ...access.projectMapDataForClient({ id, name: map.name, tokens: map.tokens || {}, creatures: map.creatures || {}, characterTokens: map.characterTokens || {} }), actorProjection }]));
  return JSON.parse(JSON.stringify({ roomId: room.id, actorProjection, maps }));
}
function metadataPath(value, depth = 0) {
  if (!value || typeof value !== 'object') {return null;}
  if (depth > 20) {return 'depth_limit';}
  for (const [key, child] of Object.entries(value)) {
    if (['actorProjection', 'actorLifecycle', 'actorSnapshot'].includes(key)) {return key;}
    if (metadataPath(child, depth + 1)) {return key;}
  }
  return null;
}
module.exports = { current, advance, snapshot, metadataPath };
