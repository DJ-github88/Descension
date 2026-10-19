/** P13A (frozen contract MYTHRILL_PROJECT_13A_CONTRACT.md): accepted-result narration and calm floating
 * combat text. Presentation only: fed by accepted P7 receipts, never by proposals or pending approvals.
 * Numbers come only from the viewer's own projection at exactly the receipt's beforeRevision. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { emptyNarration, narrationReducer } from '../components/combat-narration-preview/narrationQueue';
import { acceptedText } from './weaponStrike';
import { acceptedBlockText } from './equipmentBlocking';
import { DEFINITION_HASH as RIPOSTE, riposteAcceptedText } from './riposteExecution';

const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const POOLS = { hp: ['currentHp', 'health', 'tempHealth'], mana: ['currentMana', 'mana', 'tempMana'], ap: ['currentActionPoints', 'actionPoints', 'tempActionPoints'] };
export const STRIKE = 'p12a-strike:v1/basic-weapon-strike';
export const BLOCK = 'p12b-block:v1/creature-attack-block';
export const FEATHER = 'feather-slash:v1/abilities:1.4.0';
export const SPELL_PREFIX = 'p9-spell:v1/';
export const FLOAT_KINDS = ['hp']; // F1 open: later slices may add 'ap', 'mana', 'wear' parts.
export const MAX_GROUPS = 3;
const KEY_LIMIT = 256;
const MINUS = '−';

export const sameRef = (a, b) => !!a && !!b && REF_KEYS.every(key => a[key] === b[key]);
/** Exact actor key (instance included) used by the token float layer and visibility registry. */
export const actorKey = ref => ref ? [ref.kind, ref.roomId, ref.mapId, ref.tokenId, ref.instanceId].join('|') : '';
const int = value => Number.isSafeInteger(value);
const signed = (value, unit) => `${value > 0 ? '+' : MINUS}${Math.abs(value)} ${unit}`;

export const useCombatFeedStore = create(() => ({ rendered: {}, floats: {}, narration: emptyNarration(), roomId: null }));

// ── Visibility registry: a token float layer registers its exact actor while it is rendered ──────────
export function registerRendered(key) {
  if (!key) return () => {};
  useCombatFeedStore.setState(s => ({ rendered: { ...s.rendered, [key]: (s.rendered[key] || 0) + 1 } }));
  return () => useCombatFeedStore.setState(s => {
    const rendered = { ...s.rendered }, count = (rendered[key] || 0) - 1;
    if (count > 0) rendered[key] = count; else delete rendered[key];
    return { rendered };
  });
}

// ── Pure parts ────────────────────────────────────────────────────────────────────────────────────────
/** Local projection of one actor (pools + revision + display name) from a store token. */
export function projectionOf(token, kind, creatures = []) {
  const revision = token?.state?.actorContract?.revision;
  const pools = {};
  for (const [pool, [stateKey, pcKey, tempKey]] of Object.entries(POOLS)) {
    const current = kind === 'character' ? token?.character?.[pcKey]?.current : token?.state?.[stateKey];
    const temp = kind === 'character' ? token?.character?.[tempKey] : token?.state?.[tempKey];
    pools[pool] = { current, temp: temp ?? 0 };
  }
  const name = kind === 'character' ? (token?.character?.name || token?.name)
    : (token?.state?.customName || token?.customName || token?.name || creatures.find(c => c.id === token?.creatureId)?.name);
  return { revision, pools, name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 60) : null };
}
/** Exact deltas, or null when the projection is not at exactly beforeRevision (never inferred). */
export function exactDeltas(before, actor) {
  if (!before || !int(before.revision) || before.revision !== actor?.beforeRevision) return null;
  const out = {};
  for (const pool of Object.keys(POOLS)) {
    const a = actor.finalResources?.[pool], b = before.pools?.[pool];
    if (![a?.current, a?.temp, b?.current, b?.temp].every(Number.isFinite)) return null;
    out[pool] = { current: a.current - b.current, temp: a.temp - b.temp };
  }
  return out;
}
/** Capability facts used for wording (only public receipt fields). */
export function capabilityOf(receipt) {
  const adjudication = receipt?.adjudication || {}, hashId = adjudication.definitionVersionOrHash;
  let chosen = null;
  try { chosen = typeof adjudication.chosenResult === 'string' ? JSON.parse(adjudication.chosenResult) : null; } catch (_) { chosen = null; }
  if (!chosen || typeof hashId !== 'string') return { kind: 'none' };
  if (hashId === STRIKE) return { kind: 'strike', label: chosen.weapon?.name, outcome: chosen.rollOutcome, damage: chosen.rollOutcome !== 'miss' };
  if (hashId === RIPOSTE) return { kind: 'riposte', label: 'Riposte', outcome: chosen.rollOutcome, damage: chosen.rollOutcome !== 'miss' };
  if (hashId === BLOCK) return { kind: 'block', label: chosen.attack?.ability?.name, blockName: chosen.block?.name, reduction: chosen.block?.reduction, damage: true };
  if (hashId === FEATHER) return { kind: 'feather', label: 'Feather Slash', damage: true };
  if (hashId.startsWith(SPELL_PREFIX)) return { kind: 'spell', label: chosen.spellName, damage: chosen.kind === 'damage' };
  return { kind: 'none' };
}
/** HP float parts. "absorbed" only when the accepted consequence establishes damage absorption (§2). */
export function hpParts(delta, establishesAbsorption) {
  if (!delta?.hp) return [];
  const { current, temp } = delta.hp, parts = [];
  if (current < 0) parts.push({ kind: 'damage', amount: -current, text: `${MINUS}${-current} HP` });
  if (current > 0) parts.push({ kind: 'heal', amount: current, text: `+${current} HP` });
  if (temp < 0) parts.push(establishesAbsorption ? { kind: 'absorbed', amount: -temp, text: `${-temp} absorbed` } : { kind: 'temp-loss', amount: -temp, text: `${MINUS}${-temp} temp HP` });
  if (temp > 0) parts.push({ kind: 'temp-gain', amount: temp, text: `+${temp} temp HP` });
  return parts;
}
function actorWords(delta, establishesAbsorption, wear, miss) {
  const words = [];
  if (miss) words.push('miss');
  if (delta) {
    words.push(...hpParts(delta, establishesAbsorption).map(part => part.text));
    if (delta.ap.current || delta.ap.temp) words.push(`AP ${signed(delta.ap.current + delta.ap.temp, '').trim()}`);
    if (delta.mana.current || delta.mana.temp) words.push(`mana ${signed(delta.mana.current + delta.mana.temp, '').trim()}`);
  }
  if (wear && typeof wear.name === 'string' && wear.beforeDie !== wear.afterDie) words.push(`${wear.name} ${wear.beforeDie} → ${wear.broken ? 'broken' : wear.afterDie}`);
  return words;
}
/**
 * Builds floats and one narration event for an accepted result.
 * viewer: { reportable(ref) → bool, rendered(ref) → bool }. Pure: no store access.
 */
export function buildFeed({ result, before = {}, viewer, live }) {
  const receipt = result?.receipt;
  if (!receipt || receipt.version !== 1 || !Array.isArray(receipt.actors) || receipt.readOnly) return { floats: [], narration: null };
  const capability = capabilityOf(receipt);
  const actors = receipt.actors.filter(actor => actor?.ref && !actor.readOnly);
  const lines = [], floats = [];
  let reportableCount = 0;
  for (const actor of actors) {
    const key = actorKey(actor.ref), prior = before[key];
    const delta = exactDeltas(prior, actor);
    const isTarget = receipt.target && sameRef(actor.ref, receipt.target);
    const absorbs = !!(capability.damage && isTarget);
    const missTarget = ['strike', 'riposte'].includes(capability.kind) && capability.outcome === 'miss' && isTarget;
    if (!viewer.reportable(actor.ref)) continue;
    reportableCount += 1;
    lines.push({ ref: actor.ref, name: prior?.name || (actor.ref.kind === 'character' ? 'A character' : 'A creature'), delta, absorbs, wear: actor.equipmentWear, missTarget });
    const parts = FLOAT_KINDS.includes('hp') ? hpParts(delta, absorbs) : [];
    if (live && parts.length && viewer.rendered(actor.ref)) floats.push({ key, parts });
  }
  if (!reportableCount) return { floats: [], narration: null };
  // Review 10: read-only or ref-less actors count as not reportable; source/target must be shown actors.
  const allReportable = reportableCount === receipt.actors.length && (!receipt.source || lines.some(l => sameRef(l.ref, receipt.source))) &&
    (!receipt.target || lines.some(l => sameRef(l.ref, receipt.target)));
  // Review 5: the outcome word belongs to the capability; it is shown only when every actor is reportable.
  for (const line of lines) line.words = actorWords(line.delta, line.absorbs, line.wear, allReportable && line.missTarget);
  const nameOf = ref => lines.find(line => sameRef(line.ref, ref))?.name;
  const body = lines.map(line => `${line.name}${line.words.length ? ` ${line.words.join(', ')}` : ' updated'}`).join('; ');
  let text = body, arithmetic = '';
  if (allReportable && capability.kind !== 'none') {
    const src = nameOf(receipt.source) || 'Someone', tgt = nameOf(receipt.target) || 'someone', label = typeof capability.label === 'string' ? capability.label.slice(0, 80) : 'an action';
    const lead = capability.kind === 'strike' ? `${src} ${capability.outcome === 'miss' ? 'misses' : 'strikes'} ${tgt} with ${label}${capability.outcome === 'critical' ? ' (critical)' : ''}`
      : capability.kind === 'riposte' ? `${src} ${capability.outcome === 'miss' ? 'misses' : 'counter-attacks'} ${tgt} with Riposte`
        : capability.kind === 'block' ? `${src}’s ${label} hits ${tgt}${capability.blockName ? `; ${capability.blockName} blocks ${capability.reduction}` : ''}`
        : capability.kind === 'spell' ? `${src} casts ${label} on ${tgt}`
          : `${src}’s ${label} hits ${tgt}`;
    text = `${lead}. ${body}.`;
    arithmetic = capability.kind === 'riposte' ? riposteAcceptedText(result) : capability.kind === 'strike' ? acceptedText(result) || '' : capability.kind === 'block' ? acceptedBlockText(result) || '' : '';
  } else {
    text = `${body}.`;
  }
  return { floats, narration: { id: `p13a:${receipt.roomId}:${receipt.commandId}`, phase: 'outcome', accepted: true, important: true, text, arithmetic } };
}

// ── Runtime glue ──────────────────────────────────────────────────────────────────────────────────────
const published = [];
// Per-room highest commitSequence this client has presented (live or history): an older receipt is never live.
const marks = new Map();
const store = key => getStore(key)?.getState?.() || {};
/** The viewer's own projections of every receipt actor, read before the receipt is applied. */
export function captureBefore(receipt) {
  const out = {};
  if (!Array.isArray(receipt?.actors)) return out;
  const creatures = store('creatureStore').creatures || [];
  const tokens = [...(store('creatureStore').creatureTokens || []).map(token => ['creature', token]), ...(store('characterTokenStore').characterTokens || []).map(token => ['character', token])];
  for (const actor of receipt.actors) {
    if (!actor?.ref) continue;
    const found = tokens.find(([kind, token]) => kind === actor.ref.kind && sameRef(refOf(token), actor.ref));
    if (found) out[actorKey(actor.ref)] = projectionOf(found[1], found[0], creatures);
  }
  return out;
}
const refOf = token => {
  const binding = token?.state?.actorContract;
  return binding?.version === 1 ? Object.fromEntries(REF_KEYS.filter(key => binding[key] !== undefined).map(key => [key, binding[key]])) : null;
};
export function liveViewer() {
  const game = store('gameStore'), uid = store('authStore').user?.uid;
  const rendered = ref => (useCombatFeedStore.getState().rendered[actorKey(ref)] || 0) > 0;
  return {
    rendered,
    reportable: ref => game.isGMMode === true || (ref.kind === 'character' && !!uid && ref.ownerUid === uid) || rendered(ref)
  };
}
const reducedMotion = () => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } };
export const FLOAT_MS = 1800, FLOAT_REDUCED_MS = 2500;
function pushFloat({ key, parts }) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  useCombatFeedStore.setState(s => ({ floats: { ...s.floats, [key]: [...(s.floats[key] || []), { id, parts }].slice(-12) } }));
  setTimeout(() => useCombatFeedStore.setState(s => {
    const remaining = (s.floats[key] || []).filter(group => group.id !== id), floats = { ...s.floats };
    if (remaining.length) floats[key] = remaining; else delete floats[key];
    return { floats };
  }), reducedMotion() ? FLOAT_REDUCED_MS : FLOAT_MS);
}
/** Publishes one accepted result. live=false (recoveries, retries) only adds a history entry. */
export function publishAcceptedResult({ result, before, live }) {
  const receipt = result?.receipt;
  if (!receipt?.roomId || !receipt.commandId) return null;
  const game = store('gameStore');
  if (receipt.roomId !== game.multiplayerRoom?.id) return null;
  if (useCombatFeedStore.getState().roomId !== receipt.roomId) useCombatFeedStore.setState({ roomId: receipt.roomId, floats: {}, narration: emptyNarration() });
  const id = `${receipt.roomId}:${receipt.commandId}`, mark = marks.get(receipt.roomId);
  const fresh = live === true && !published.includes(id) && (!Number.isSafeInteger(mark) || receipt.commitSequence > mark);
  if (Number.isSafeInteger(receipt.commitSequence) && (!Number.isSafeInteger(mark) || receipt.commitSequence > mark)) marks.set(receipt.roomId, receipt.commitSequence);
  const feed = buildFeed({ result, before, viewer: liveViewer(), live: fresh });
  if (!feed.narration) return feed;
  if (fresh) {
    published.push(id); if (published.length > KEY_LIMIT) published.shift();
    feed.floats.forEach(pushFloat);
    useCombatFeedStore.setState(s => ({ narration: narrationReducer(s.narration, { type: 'publish', events: [feed.narration] }) }));
  } else {
    useCombatFeedStore.setState(s => ({ narration: narrationReducer(s.narration, { type: 'history', events: [feed.narration] }) }));
  }
  return feed;
}
/**
 * P13A §4 applied to the existing persistent combat-log lines of P8/P9/P12A/P12B: the full line only when
 * every actor of the receipt is reportable to this viewer; otherwise a neutral line naming only reportable
 * actors (no capability, ability, source or numbers); null when nobody is reportable.
 */
export function chatLineFor(result, fullText, viewer = liveViewer()) {
  const actors = (result?.receipt?.actors || []).filter(actor => actor?.ref);
  if (!actors.length) return fullText;
  const shown = actors.filter(actor => viewer.reportable(actor.ref));
  if (shown.length === actors.length) return fullText;
  if (!shown.length) return null;
  const prior = captureBefore({ actors: shown });
  const names = shown.map(actor => prior[actorKey(actor.ref)]?.name || (actor.ref.kind === 'character' ? 'A character' : 'A creature'));
  return `Accepted result: ${names.join(', ')} changed.`;
}
export const advanceNarration = () => useCombatFeedStore.setState(s => ({ narration: narrationReducer(s.narration, { type: 'advance' }) }));
export function resetCombatFeed(roomId = null) {
  published.length = 0; marks.clear();
  useCombatFeedStore.setState({ floats: {}, narration: emptyNarration(), roomId });
}
