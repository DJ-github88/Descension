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
  if (!clock) actors.fail('stale_turn_occurrence');
  const incoming = combat.turnOrder[combat.currentTurnIndex].actorRef;
  const token = actors.locate({ ...room, gameState: next }, incoming).token;
  for (const [id, item] of Object.entries(token.state.authoredCooldowns || {})) {
    if (item.combatId === clock.id && item.period === combat.turnOrder.length && item.dueSequence === sequence) delete token.state.authoredCooldowns[id];
  }
}
module.exports = { check, start, release, MAX };
