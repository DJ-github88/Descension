/** P14-A1 thin A1a lookup. Installation stays with P7's admission owner. */
const definitions = require('./authoredSpellDefinitions');
const actors = require('./actorConsequences');
const pure = require('../../vtt-react/src/services/authoredAbility');
function registry(room) {
  if (room.gameState.authoredSpellRegistry === undefined) return definitions.emptyRegistry(room.id);
  const result = definitions.decodeRegistry(JSON.stringify(room.gameState.authoredSpellRegistry));
  if (!result.ok || result.registry.roomId !== room.id) actors.fail('invalid_authored_registry');
  return result.registry;
}
function list(room) {
  const r = registry(room);
  return { revision: r.revision, entries: r.definitions.map(entry => ({ ...actors.clone(entry), revoked: r.decisions.some(d => d.action === 'revoke' && pure.actionId(d.definitionRef) === pure.actionId(entry.definitionRef)) })) };
}
function lookup(room, spell) {
  const entry = list(room).entries.find(e => pure.actionId(e.definitionRef) === spell.definitionId);
  if (!entry) actors.fail('definition_not_admitted');
  if (entry.revoked) actors.fail('definition_revoked');
  return entry;
}
function checkApproval(room, approval) {
  const entry = lookup(room, approval.spell), d = entry.canonicalDefinition, desc = entry.descriptor;
  const wanted = { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${pure.CAPABILITY}/${entry.definitionRef.definitionHash}`, name: d.name, kind: d.effect.kind, damageTypes: desc.effect.damageTypes };
  if (actors.hash(approval.spell) !== actors.hash(wanted) || actors.hash(approval.price) !== actors.hash(desc.price) || approval.classPayment !== null) actors.fail('authored_approval_mismatch');
  const reading = pure.readFormula(d.effect.formula), roll = approval.roll;
  if (roll.constant !== reading.constant || roll.reading !== reading.reading || roll.dice.length !== 1 || roll.dice[0].sides !== reading.dice[0].sides || roll.dice[0].faces.length !== reading.dice[0].count) actors.fail('authored_roll_mismatch');
  const source = actors.locate(room, approval.source);
  const classId = String(source.token.character?.class || '').toLowerCase().replace(/ /g, '_');
  if (classId !== d.binding.classId) actors.fail('unsupported_binding');
  if (d.targeting.restriction === 'self' && actors.hash(approval.source) !== actors.hash(approval.target)) actors.fail('authored_target_mismatch');
  return entry;
}
module.exports = { registry, list, lookup, checkApproval };
