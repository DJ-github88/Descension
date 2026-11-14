/** One staged side effect of an existing P7 cast/boundary, never an independent writer. */
const actors = require('./actorConsequences');
const pure = require('../shared/services/authoredCooldown');
const timing = require('../shared/services/sharedEffectTiming');
const MAX = 128; // technical retained-identity bound per actor, never a game-use limit
function check(room, approval, definition) {
  const source = actors.locate(room, approval.source);
  const state = pure.status(source.token, room.gameState.combat, approval.source, definition.definitionId);
  if (state.blocked) actors.fail(state.code, state.label);
  if (!definition.cooldown) return null;
  if (!pure.valid(definition.cooldown) || approval.source.kind !== 'character' || !source.contract.primary || approval.target.kind !== 'creature' || approval.classPayment !== null)
    actors.fail('unsupported_cooldown_route');
  const combat = require('./sharedEffectLifecycle').roster(room), clock = timing.clock(combat);
  if (!clock) actors.fail('cooldown_clock_required', 'Enable authenticated turn tracking before casting this ability; nothing was spent.');
  const index = combat.turnOrder.findIndex(e => actors.hash(e.actorRef) === actors.hash(approval.source));
  if (index < 0) actors.fail('cooldown_source_not_in_roster');
  if (Object.keys(source.token.state.authoredCooldowns || {}).length >= MAX) actors.fail('cooldown_capacity');
  const period = combat.turnOrder.length, occurrences = definition.cooldown.cooldownValue;
  const distance = (index - combat.currentTurnIndex + period) % period || period;
  const dueSequence = clock.sequence + distance + (occurrences - 1) * period;
  if (!Number.isSafeInteger(dueSequence)) actors.fail('turn_clock_exhausted');
  return { combatId: clock.id, startSequence: clock.sequence, dueSequence, occurrences, period };
}
function start(room, next, approval, commandId) {
  const definition = require('./installedAuthoredAbilities').lookup(room, approval.spell).canonicalDefinition;
  const item = check(room, approval, definition);
  if (!item) return;
  const token = actors.locate({ ...room, gameState: next }, approval.source).token;
  token.state.authoredCooldowns = Object.assign({}, token.state.authoredCooldowns, { [pure.key(approval.source, definition.definitionId)]: Object.assign(item, { commandId }) });
}
function release(room, next, sequence) {
  const combat = next.combat, clock = timing.clock(combat);
  if (!clock) {actors.fail('stale_turn_occurrence');}
  const incoming = combat.turnOrder[combat.currentTurnIndex].actorRef;
  const token = actors.locate({ ...room, gameState: next }, incoming).token;
  for (const [id, item] of Object.entries(token.state.authoredCooldowns || {})) {
    if (item.combatId === clock.id && item.period === combat.turnOrder.length && item.dueSequence === sequence) delete token.state.authoredCooldowns[id];
  }
}
/** Live cooldowns owned by the exact ref in the current clock. */
function liveFor(room, ref, clockId) {
  let token;
  try { token = actors.locate(room, ref).token; } catch (_) { return []; }
  return Object.values(token.state?.authoredCooldowns || {}).filter(item => item?.combatId === clockId);
}
/**
 * Re-anchor retained owners' cooldowns after a roster change. A bound leaving actor is refused
 * before this helper runs; an orphan token's live cooldown is removed with a `detached` record.
 */
function reanchorForRoster(next) {
  const clock = next.combat?.effectLifecycle;
  if (!clock) { return { changes: [], detached: [] }; }
  const order = next.combat.turnOrder, index = next.combat.currentTurnIndex, R = order.length;
  const indexByRef = new Map(order.map((entry, i) => [actors.hash(entry.actorRef), i]));
  const changes = [], detached = [];

  for (const map of Object.values(next.maps || {})) {
    for (const field of ['tokens', 'characterTokens', 'creatures']) {
      for (const token of Object.values(map[field] || {})) {
        const contract = token.state?.actorContract;
        if (!contract?.instanceId) { continue; }
        const ref = actors.refFor(contract);
        const targetIndex = indexByRef.get(actors.hash(ref));
        const entries = Object.entries(token.state?.authoredCooldowns || {});
        const live = entries.filter(([, item]) => item?.combatId === clock.id);
        if (!live.length) { continue; }
        if (targetIndex === undefined) {
          for (const [key] of live) {
            delete token.state.authoredCooldowns[key];
            detached.push({ key, ref, reason: 'owner_not_in_roster' });
          }
          continue;
        }
        for (const [key, item] of live) {
          if (!Number.isSafeInteger(item.period) || !Number.isSafeInteger(item.dueSequence)) {
            actors.fail('stale_effect_schedule');
          }
          const total = item.occurrences || 1;
          const left = timing.remaining(item, clock.sequence);
          if (left < 1 || left > total) { actors.fail('stale_effect_schedule'); }
          const distance = (targetIndex - index + R) % R || R;
          const nextBoundary = clock.sequence + distance; // releases at the owner's next turn start
          if (!Number.isSafeInteger(nextBoundary)) { actors.fail('turn_clock_exhausted'); }
          const before = { dueSequence: item.dueSequence, period: item.period };
          item.firstSequence = nextBoundary;
          item.firstOccurrence = total - left + 1;
          item.period = R;
          item.dueSequence = nextBoundary + (left - 1) * R;
          if (!Number.isSafeInteger(item.dueSequence)) { actors.fail('turn_clock_exhausted'); }
          changes.push({ key, ref, from: before, to: { dueSequence: item.dueSequence, period: item.period } });
        }
      }
    }
  }
  return { changes, detached };
}
module.exports = { check, start, release, liveFor, reanchorForRoster, MAX };
