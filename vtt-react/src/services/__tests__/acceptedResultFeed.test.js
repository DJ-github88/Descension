/** P13A accepted-result feed (MYTHRILL_PROJECT_13A_CONTRACT.md): exact-revision numbers, absorption
 * wording, visibility on every surface, live vs historical, deduplication. */
import { registerStore } from '../../store/storeRegistry';
import { buildFeed, chatLineFor, exactDeltas, hpParts, actorKey, publishAcceptedResult, registerRendered, resetCombatFeed, useCombatFeedStore, captureBefore, STRIKE, BLOCK } from '../acceptedResultFeed';
import { narrationReducer, emptyNarration } from '../../components/combat-narration-preview/narrationQueue';

const ref = (kind, tokenId, extra = {}) => ({ kind, roomId: 'room', mapId: 'map', tokenId, instanceId: `${tokenId}-1`, ...(kind === 'character' ? { ownerUid: 'u-owner', characterId: tokenId } : {}), ...extra });
const pc = ref('character', 'ilsa'), foe = ref('creature', 'foe');
const pools = (hp, temp = 0, ap = 4, mana = 0) => ({ hp: { current: hp, temp, max: 40 }, mana: { current: mana, temp: 0, max: 10 }, ap: { current: ap, temp: 0, max: 4 } });
const before = (revision, hp, temp = 0, ap = 4, name = 'X') => ({ revision, pools: { hp: { current: hp, temp }, mana: { current: 0, temp: 0 }, ap: { current: ap, temp: 0 } }, name });
const strikeReceipt = (finalHp, finalTemp, { outcome = 'hit' } = {}) => ({ success: true, receipt: { version: 1, roomId: 'room', commandId: 'c1', commitSequence: 5, source: pc, target: foe,
  authorization: { kind: 'owner-approval-gm' },
  adjudication: { definitionVersionOrHash: STRIKE, finalAmount: 9, chosenResult: JSON.stringify({ capability: 'p12a-strike:v1', weapon: { name: 'Iron Sword' }, rollOutcome: outcome, names: { source: 'Ilsa', target: 'Branvig' }, notApplied: [], proficiency: { kind: 'deferred' } }) },
  actors: [{ ref: pc, beforeRevision: 3, afterRevision: 4, finalResources: pools(30, 0, 2) }, { ref: foe, beforeRevision: 7, afterRevision: 8, finalResources: pools(finalHp, finalTemp) }] } });
const allVisible = { reportable: () => true, rendered: () => true };

test('A4 unavailable unused creature pools retain exact healing feedback, visibility and historical silence', () => {
  const result = strikeReceipt(36, 0); result.receipt.authorization.kind = 'gm-creature-ability';
  result.receipt.adjudication = { definitionVersionOrHash: `authored-immediate:v1/${'a'.repeat(64)}`, chosenResult: JSON.stringify({ kind: 'healing', spellName: 'Authored healing' }) };
  const prior = { [actorKey(foe)]: before(7, 30, 0, 4, 'Visible creature'), [actorKey(pc)]: before(3, 30) };
  for (const p of ['ap', 'mana']) { delete prior[actorKey(foe)].pools[p].current; delete result.receipt.actors[1].finalResources[p].current; }
  const live = buildFeed({ result, before: prior, viewer: allVisible, live: true });
  expect(live.floats).toEqual([{ key: actorKey(foe), parts: [{ kind: 'heal', amount: 6, text: '+6 HP' }] }]);
  expect(live.narration.text).toContain('Visible creature +6 HP');
  expect(buildFeed({ result, before: prior, viewer: allVisible, live: false }).floats).toEqual([]);
  const hidden = buildFeed({ result, before: prior, viewer: { reportable: r => r.kind === 'character', rendered: () => false }, live: true });
  expect(hidden.floats).toEqual([]); expect(hidden.narration.text).not.toContain('Visible creature');
});

test('exact numbers only at beforeRevision; overkill floats the actual drop', () => {
  const result = strikeReceipt(0, 0);
  const feed = buildFeed({ result, before: { [actorKey(pc)]: before(3, 30, 0, 4, 'Ilsa'), [actorKey(foe)]: before(7, 5, 0, 4, 'Branvig') }, viewer: allVisible, live: true });
  expect(feed.floats).toEqual([{ key: actorKey(foe), parts: [{ kind: 'damage', amount: 5, text: '−5 HP' }] }]);
  expect(feed.narration.text).toBe('Ilsa strikes Branvig with Iron Sword. Ilsa AP −2; Branvig −5 HP.');
  expect(exactDeltas(before(6, 5), result.receipt.actors[1])).toBeNull();
  const gap = buildFeed({ result, before: { [actorKey(foe)]: before(6, 5, 0, 4, 'Branvig'), [actorKey(pc)]: before(3, 30, 0, 4, 'Ilsa') }, viewer: allVisible, live: true });
  expect(gap.floats).toEqual([]);
  expect(gap.narration.text).toMatch(/Branvig updated/);
});
test('temporary HP: "absorbed" only when the accepted damage capability establishes it; otherwise neutral', () => {
  const result = strikeReceipt(26, 0);
  const feed = buildFeed({ result, before: { [actorKey(foe)]: before(7, 30, 3, 4, 'Branvig'), [actorKey(pc)]: before(3, 30, 0, 4, 'Ilsa') }, viewer: allVisible, live: true });
  expect(feed.floats[0].parts.map(p => p.text)).toEqual(['−4 HP', '3 absorbed']);
  expect(hpParts({ hp: { current: 0, temp: -3 } }, false).map(p => p.text)).toEqual(['−3 temp HP']);
  const gmDirect = { success: true, receipt: { version: 1, roomId: 'room', commandId: 'c2', commitSequence: 6, authorization: { kind: 'gm' },
    actors: [{ ref: foe, beforeRevision: 7, afterRevision: 8, finalResources: pools(30, 0) }] } };
  const neutral = buildFeed({ result: gmDirect, before: { [actorKey(foe)]: before(7, 30, 3, 4, 'Branvig') }, viewer: allVisible, live: true });
  expect(neutral.floats[0].parts.map(p => p.text)).toEqual(['−3 temp HP']);
  expect(neutral.narration.text).toBe('Branvig −3 temp HP.');
  const heal = buildFeed({ result: { ...gmDirect, receipt: { ...gmDirect.receipt, actors: [{ ref: foe, beforeRevision: 7, afterRevision: 8, finalResources: pools(36, 0) }] } }, before: { [actorKey(foe)]: before(7, 30, 0) }, viewer: allVisible, live: true });
  expect(heal.floats[0].parts[0].text).toBe('+6 HP');
});
test('a miss names the outcome; the attacker’s AP stays in narration, never a float', () => {
  const result = strikeReceipt(30, 0, { outcome: 'miss' });
  const feed = buildFeed({ result, before: { [actorKey(foe)]: before(7, 30), [actorKey(pc)]: before(3, 30, 0, 4, 'Ilsa') }, viewer: allVisible, live: true });
  expect(feed.floats).toEqual([]);
  expect(feed.narration.text).toMatch(/misses/);
  expect(feed.narration.text).toMatch(/miss\./);
});
test('visibility: a hidden actor is never named; nothing is published when nobody is reportable', () => {
  const result = strikeReceipt(20, 0);
  const prior = { [actorKey(foe)]: before(7, 30, 0, 4, 'Branvig'), [actorKey(pc)]: before(3, 30, 0, 4, 'Ilsa') };
  const onlyPc = buildFeed({ result, before: prior, viewer: { reportable: r => r.kind === 'character', rendered: () => true }, live: true });
  expect(onlyPc.narration.text).toBe('Ilsa AP −2.');
  expect(JSON.stringify(onlyPc)).not.toMatch(/Branvig|Iron Sword|strikes|10/);
  expect(onlyPc.narration.arithmetic).toBe('');
  expect(onlyPc.floats).toEqual([]);
  expect(buildFeed({ result, before: prior, viewer: { reportable: () => false, rendered: () => false }, live: true })).toEqual({ floats: [], narration: null });
  const notRendered = buildFeed({ result, before: prior, viewer: { reportable: () => true, rendered: r => r.kind === 'character' }, live: true });
  expect(notRendered.floats).toEqual([], 'floats only on rendered tokens');
});
test('block receipts: wear and AP go to narration; only HP floats', () => {
  const result = { success: true, receipt: { version: 1, roomId: 'room', commandId: 'c3', commitSequence: 7, source: foe, target: pc, authorization: { kind: 'owner-approval-gm' },
    adjudication: { definitionId: 'creature-attack-block', definitionVersionOrHash: BLOCK, finalAmount: 5, chosenResult: JSON.stringify({ capability: 'p12b-block:v1', names: { source: 'Branvig', target: 'Ilsa' },
      attack: { ability: { name: 'Raking Claw' }, apCost: 1 }, block: { name: 'Weathered Hide', reduction: 2 }, manual: [] }) },
    actors: [{ ref: foe, beforeRevision: 7, afterRevision: 8, finalResources: pools(30, 0, 3) },
      { ref: pc, beforeRevision: 3, afterRevision: 4, finalResources: pools(27, 0), equipmentWear: { slot: 'chest', name: 'Weathered Hide', kind: 'armor', beforeDie: 'd8', afterDie: 'd6', broken: false } }] } };
  const feed = buildFeed({ result, before: { [actorKey(foe)]: before(7, 30, 0, 4, 'Branvig'), [actorKey(pc)]: before(3, 30, 2, 4, 'Ilsa') }, viewer: allVisible, live: true });
  expect(feed.floats).toEqual([{ key: actorKey(pc), parts: [{ kind: 'damage', amount: 3, text: '−3 HP' }, { kind: 'absorbed', amount: 2, text: '2 absorbed' }] }]);
  expect(feed.narration.text).toBe('Branvig’s Raking Claw hits Ilsa; Weathered Hide blocks 2. Branvig AP −1; Ilsa −3 HP, 2 absorbed, Weathered Hide d8 → d6.');
});

describe('publication: live once, historical as history only, rendered tokens only', () => {
  let creatureTokens, characterTokens, game;
  beforeEach(() => {
    jest.useFakeTimers();
    game = { multiplayerRoom: { id: 'room' }, isGMMode: false };
    creatureTokens = [{ id: 'foe', creatureId: 'grimm', state: { currentHp: 30, tempHealth: 0, currentMana: 0, tempMana: 0, currentActionPoints: 4, tempActionPoints: 0, actorContract: { version: 1, ...foe, revision: 7 } } }];
    characterTokens = [{ id: 'ilsa', character: { name: 'Ilsa', health: { current: 30 }, mana: { current: 0 }, actionPoints: { current: 4 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 }, state: { actorContract: { version: 1, ...pc, revision: 3 } } }];
    registerStore('gameStore', { getState: () => game });
    registerStore('authStore', { getState: () => ({ user: { uid: 'u-viewer' } }) });
    registerStore('creatureStore', { getState: () => ({ creatureTokens, creatures: [{ id: 'grimm', name: 'Branvig' }] }) });
    registerStore('characterTokenStore', { getState: () => ({ characterTokens }) });
    resetCombatFeed('room');
    useCombatFeedStore.setState({ rendered: {} });
  });
  afterEach(() => jest.useRealTimers());
  test('one banner and one float for ack + broadcast; history-only for a recovery; no float on an unrendered token', () => {
    const unregister = registerRendered(actorKey(foe)); registerRendered(actorKey(pc));
    const result = strikeReceipt(21, 0);
    const prior = captureBefore(result.receipt);
    expect(prior[actorKey(foe)]).toMatchObject({ revision: 7, name: 'Branvig' });
    publishAcceptedResult({ result, before: prior, live: true });
    publishAcceptedResult({ result, before: prior, live: true }); // duplicate delivery
    const state = useCombatFeedStore.getState();
    expect(state.floats[actorKey(foe)]).toHaveLength(1);
    expect(state.narration.current.text).toMatch(/Branvig −9 HP/);
    expect(state.narration.waiting).toHaveLength(0);
    jest.advanceTimersByTime(1900);
    expect(useCombatFeedStore.getState().floats[actorKey(foe)]).toBeUndefined();
    const recovered = { ...strikeReceipt(21, 0), receipt: { ...strikeReceipt(21, 0).receipt, commandId: 'old' } };
    publishAcceptedResult({ result: recovered, before: prior, live: false });
    const after = useCombatFeedStore.getState();
    expect(after.narration.current.id).toBe('p13a:room:c1');
    expect(after.narration.history.map(h => [h.id, !!h.historical])).toEqual([['p13a:room:c1', false], ['p13a:room:old', true]]);
    expect(after.floats[actorKey(foe)]).toBeUndefined();
    unregister();
    publishAcceptedResult({ result: { ...result, receipt: { ...result.receipt, commandId: 'c9' } }, before: prior, live: true });
    expect(useCombatFeedStore.getState().floats[actorKey(foe)]).toBeUndefined();
    expect(useCombatFeedStore.getState().narration.history.find(h => h.id === 'p13a:room:c9').text).not.toMatch(/Branvig/);
  });
  test('another room’s receipt publishes nothing', () => {
    expect(publishAcceptedResult({ result: { ...strikeReceipt(21, 0), receipt: { ...strikeReceipt(21, 0).receipt, roomId: 'other' } }, before: {}, live: true })).toBeNull();
  });
});
test('queue: history-only events never become the banner or an announcement', () => {
  const state = narrationReducer(emptyNarration(), { type: 'history', events: [{ id: 'a', phase: 'outcome', accepted: true, text: 'x' }] });
  expect(state.current).toBeNull();
  expect(state.history).toHaveLength(1);
  const again = narrationReducer(state, { type: 'publish', events: [{ id: 'a', phase: 'outcome', accepted: true, text: 'x' }] });
  expect(again.current).toBeNull();
});

test('persistent combat-log lines follow the same visibility rule', () => {
  const result = strikeReceipt(20, 0);
  expect(chatLineFor(result, 'Accepted: full', allVisible)).toBe('Accepted: full');
  expect(chatLineFor(result, 'Accepted: full', { reportable: r => r.kind === 'character', rendered: () => false })).toMatch(/^Accepted result: .* changed\.$/);
  expect(chatLineFor(result, 'Accepted: full', { reportable: r => r.kind === 'character', rendered: () => false })).not.toMatch(/Branvig|full/);
  expect(chatLineFor(result, 'Accepted: full', { reportable: () => false, rendered: () => false })).toBeNull();
});

test('review 5: a hidden attacker’s miss is not revealed; the visible target reads only "updated"', () => {
  const result = strikeReceipt(30, 0, { outcome: 'miss' });
  const feed = buildFeed({ result, before: { [actorKey(foe)]: before(7, 30, 0, 4, 'Branvig'), [actorKey(pc)]: before(3, 30) }, viewer: { reportable: r => r.kind === 'creature', rendered: () => true }, live: true });
  expect(feed.narration.text).toBe('Branvig updated.');
});
describe('review 1: liveness without hydration; older receipts never live', () => {
  beforeEach(() => {
    registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'room' }, isGMMode: true }) });
    registerStore('authStore', { getState: () => ({ user: { uid: 'gm' } }) });
    registerStore('creatureStore', { getState: () => ({ creatureTokens: [], creatures: [] }) });
    registerStore('characterTokenStore', { getState: () => ({ characterTokens: [] }) });
    resetCombatFeed('room');
  });
  test('first live receipt on a fresh client is presented; an older one arriving later is history only', () => {
    const newer = { ...strikeReceipt(21, 0), receipt: { ...strikeReceipt(21, 0).receipt, commandId: 'n', commitSequence: 9 } };
    const older = { ...strikeReceipt(21, 0), receipt: { ...strikeReceipt(21, 0).receipt, commandId: 'o', commitSequence: 8 } };
    publishAcceptedResult({ result: newer, before: {}, live: true });
    publishAcceptedResult({ result: older, before: {}, live: true });
    const { narration } = useCombatFeedStore.getState();
    expect(narration.current.id).toBe('p13a:room:n');
    expect(narration.waiting).toHaveLength(0);
    expect(narration.history.find(h => h.id === 'p13a:room:o').historical).toBe(true);
  });
});
