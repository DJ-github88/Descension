/** Original P8 only. This planner owns bookkeeping, never defense or mitigation. */
import { DATA_VERSIONS } from '../data/versions';

export const FEATHER_ID = 'grimmstalk_feather_slash';
// Stable command/receipt identity: both reviewed datasets contain this exact capability.
export const FEATHER_CAPABILITY = 'feather-slash:v1/abilities:1.4.0';
export const canonical = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]));
  return value;
}
const equal = (a, b) => canonical(a) === canonical(b);
const keysOnly = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
export function supportsFeatherSlash(raw, creatureId = 'grimmstalk') {
  return creatureId === 'grimmstalk' && ['1.4.0', '1.5.0'].includes(DATA_VERSIONS.abilities) &&
    keysOnly(raw, ['id', 'name', 'description', 'level', 'spellType', 'icon', 'typeConfig', 'targetingConfig', 'resourceCost', 'cooldownConfig', 'tags', 'effectTypes', 'damageConfig', 'priorityRange']) &&
    raw.id === FEATHER_ID && raw.spellType === 'ACTION' &&
    equal(raw.typeConfig, { school: 'slicing', icon: 'ability_rogue_findweakness', tags: ['slicing'], castTime: 1, castTimeType: 'IMMEDIATE' }) &&
    equal(raw.targetingConfig, { targetingType: 'single', rangeType: 'melee', rangeDistance: 10, targetRestrictions: ['enemies'] }) &&
    equal(raw.resourceCost, { actionPoints: 1, mana: 0, components: ['somatic'] }) &&
    equal(raw.cooldownConfig, { cooldownType: 'turn_based', cooldownValue: 0 }) &&
    equal(raw.effectTypes, ['damage']) && equal(raw.damageConfig, { formula: '2d8 + 5', damageTypes: ['slicing'], resolution: 'DICE' }) &&
    equal(raw.priorityRange, { min: 1, max: 11, resolution: 'DICE' });
}
const number = (value, name) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw Error(`Invalid ${name}; use finite nonnegative resource values.`);
  return value;
};
export function depleteTempFirst(current, temp, amount, requireAffordable = false) {
  [current, temp, amount].forEach((value, i) => number(value, ['current pool', 'temporary pool', 'amount'][i]));
  if (requireAffordable && (amount - temp > current)) throw Error('Insufficient current + temporary resources; nothing submitted.');
  const fromTemp = Math.min(temp, amount);
  return { current: Math.max(0, current - (amount - fromTemp)), temp: temp - fromTemp };
}
export function creaturePayment(token, costs) {
  const finalResources = {};
  for (const [pool, costKey, currentKey, tempKey] of [['ap', 'actionPoints', 'currentActionPoints', 'tempActionPoints'], ['mana', 'mana', 'currentMana', 'tempMana']]) {
    const amount = number(costs[costKey], costKey);
    if (amount > 0) finalResources[pool] = depleteTempFirst(token?.state?.[currentKey], token?.state?.[tempKey], amount, true);
  }
  return finalResources;
}
export function recordedFaces(mode, faces) {
  if (!['digital', 'physical'].includes(mode) || !Array.isArray(faces) || faces.length !== 2 || faces.some(value => !Number.isInteger(value) || value < 1 || value > 8)) throw Error('Enter exactly two integer d8 faces from 1 to 8.');
  return { mode, faces: [...faces], total: faces[0] + faces[1] + 5 };
}
export function digitalFaces() { return recordedFaces('digital', [Math.floor(Math.random() * 8) + 1, Math.floor(Math.random() * 8) + 1]); }
export const sameExactRef = (a, b) => !!a && !!b && equal(a, b);
export function exactActor(tokens, ref, roomId, mapId) {
  if (!ref || ref.roomId !== roomId || ref.mapId !== mapId || !['creature', 'character'].includes(ref.kind) ||
    !['roomId', 'mapId', 'tokenId', 'instanceId'].every(key => typeof ref[key] === 'string' && ref[key].length > 0)) throw Error('Binding required: select an exact current room/map/incarnation.');
  const matches = tokens.filter(token => {
    const binding = token.state?.actorContract;
    return binding?.version === 1 && sameExactRef(Object.fromEntries(['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'].filter(key => binding[key] !== undefined).map(key => [key, binding[key]])), ref) && token.id === ref.tokenId && token.mapId === mapId;
  });
  if (matches.length !== 1) throw Error('Exact actor is missing or retired; no fallback target.');
  const token = matches[0], binding = token.state.actorContract;
  if (!Number.isSafeInteger(binding.revision) || binding.revision < 0) throw Error('Invalid actor revision.');
  if (ref.kind === 'character' && (!binding.primary || !ref.ownerUid || !ref.characterId || token.ownerUserId !== ref.ownerUid || token.character?.id !== ref.characterId)) throw Error('Only the exact canonical owner primary PC attachment is supported.');
  return token;
}
export function rangeDiagnostic(source, target, gridSize, feetPerTile) {
  const positions = [source?.position, target?.position];
  if (!positions.every(p => Number.isFinite(p?.x) && Number.isFinite(p?.y)) || !Number.isFinite(gridSize) || gridSize <= 0 || !Number.isFinite(feetPerTile) || feetPerTile <= 0) return 'Geometry/calibration unavailable — GM adjudication required.';
  const distance = Math.hypot(positions[0].x - positions[1].x, positions[0].y - positions[1].y) / gridSize * feetPerTile;
  if (!Number.isFinite(distance)) return 'Geometry/calibration unavailable — GM adjudication required.';
  return `Advisory planar center distance ${distance.toFixed(1)} ft; authored melee 10 ft. Elevation, contact, reach and line of effect require GM adjudication.`;
}
export function planFeatherSlash({ raw, sourceRef, targetRef, tokens, roomId, mapId, roll, adjudicated, finalAmount, reason = '', geometry }) {
  const source = exactActor(tokens, sourceRef, roomId, mapId), target = exactActor(tokens, targetRef, roomId, mapId);
  if (sourceRef.kind !== 'creature' || !supportsFeatherSlash(raw, source.creatureId)) throw Error('Unsupported raw configuration — manual notice only; no target consequence.');
  if (sameExactRef(sourceRef, targetRef)) throw Error('Choose a distinct target.');
  const recorded = recordedFaces(roll?.mode, roll?.faces);
  if (recorded.total !== roll.total) throw Error('Recorded total does not match the retained faces.');
  if (adjudicated !== true) throw Error('GM must explicitly adjudicate enemy, range, legality, defense and mitigation.');
  number(finalAmount, 'final damage');
  if (typeof reason !== 'string' || reason.length > 2000 || (finalAmount !== recorded.total && !reason.trim())) throw Error('Explain the adjustment from the recorded total.');
  const payment = creaturePayment(source, raw.resourceCost);
  const targetValues = targetRef.kind === 'character' ? target.character : target.state;
  const hp = depleteTempFirst(targetRef.kind === 'character' ? targetValues.health?.current : targetValues.currentHp, targetValues.tempHealth, finalAmount);
  return {
    entries: [{ ref: sourceRef, expectedRevision: source.state.actorContract.revision, finalResources: payment }, { ref: targetRef, expectedRevision: target.state.actorContract.revision, finalResources: { hp } }],
    extra: { source: sourceRef, target: targetRef, adjudication: { definitionId: FEATHER_ID, definitionVersionOrHash: FEATHER_CAPABILITY,
      chosenResult: JSON.stringify({ capability: FEATHER_CAPABILITY, rawDefinition: canonical(raw), ...recorded, sourceName: source.state?.customName || 'Branvig', targetName: target.state?.customName || target.character?.name || target.name || target.id, geometry: geometry || 'GM adjudication required', gmConfirmed: true }), finalAmount, adjustmentReason: reason.trim() } }
  };
}
export function featherReceipt(result) {
  const receipt = result?.receipt, adjudication = receipt?.adjudication;
  if (!result?.success || receipt?.version !== 1 || adjudication?.definitionId !== FEATHER_ID || adjudication.definitionVersionOrHash !== FEATHER_CAPABILITY) return null;
  try {
    const recorded = JSON.parse(adjudication.chosenResult), roll = recordedFaces(recorded.mode, recorded.faces);
    if (recorded.capability !== FEATHER_CAPABILITY || recorded.total !== roll.total || recorded.gmConfirmed !== true || !supportsFeatherSlash(JSON.parse(recorded.rawDefinition))) return null;
    number(adjudication.finalAmount, 'accepted final damage');
    const source = receipt.actors.find(actor => sameExactRef(actor.ref, receipt.source)), target = receipt.actors.find(actor => sameExactRef(actor.ref, receipt.target));
    if (!source || !target) return null;
    for (const values of [source.finalResources.ap, target.finalResources.hp]) for (const key of ['current', 'temp']) number(values[key], 'accepted pool');
    return { receipt, recorded, source, target, status: receipt.checkpointRevision === null ? 'live-only' : result.status === 'checkpoint-confirmed' ? 'checkpoint-confirmed' : 'accepted-live / checkpoint pending' };
  } catch (_) { return null; }
}
