/** The shared helper's unresolved-command registry (review findings F1, F6, F7, F5b). retryActorCommand is mocked: these cases are
 * about what the helper does with each answer, not about the room. An entry's unsent records are exercised through
 * applyConsumableCondition because a multi-record item still travels as one combined room command. */
import { applyConsumableCondition, reconcileUnresolved, settleEarlierUse, markUseCompleted, withConsumeLock, resetUnresolvedForTests, isHeld, markHeld, releaseHeld, preserveAcceptedForReconciliation, planConsumableResources, hasUnresolved, getHistoricalAcceptedForTests, normalizeForRoom } from '../consumableCondition';
import { retryActorCommand, roomCondition } from '../actorConsequenceService';
import { registerStore } from '../../store/storeRegistry';

const defaultRoomCondition = (raw, ref) => ({
  version: 1,
  id: raw.recordId || raw.id || 'cond-1',
  recordId: raw.recordId || raw.id || 'cond-1',
  name: raw.name,
  originalName: raw.originalName || raw.name,
  conditionKey: raw.conditionKey || raw.name?.toLowerCase(),
  type: raw.type || 'buff',
  kind: raw.kind || 'effect',
  target: ref,
  targetId: ref?.tokenId || 'pc2',
  targetType: ref?.kind || 'character',
  source: raw.source || 'item',
  sharedTiming: 'manual',
  durationType: raw.durationType || 'seconds',
  ...(raw.duration !== undefined ? { duration: raw.duration } : {}),
  ...(raw.durationValue !== undefined ? { durationValue: raw.durationValue } : {}),
  ...(raw.remainingRounds !== undefined ? { remainingRounds: raw.remainingRounds } : {}),
  ...(raw.startTime !== undefined ? { startTime: raw.startTime } : {}),
  ...(raw.endTime !== undefined ? { endTime: raw.endTime } : {}),
  ...(raw.effects ? { effects: raw.effects } : {})
});

jest.mock('../actorConsequenceService', () => ({
  __esModule: true,
  retryActorCommand: jest.fn(),
  roomCondition: jest.fn()
}));
const unknown = (commandId = 'c1') => ({ success: false, code: 'outcome_unknown', commandId });
const add = (...answers) => { const fn = jest.fn(); answers.forEach(a => fn.mockReturnValueOnce(Promise.resolve(a))); return fn; };
let notices;
const registerActor = (instanceId = 'inst-1', characterId = 'charA') => {
  const token = { id: 'pc2', ownerUserId: 'u2', character: { id: characterId },
    state: { actorContract: { version: 1, kind: 'character', roomId: 'r1', mapId: 'm', tokenId: 'pc2', instanceId, ownerUid: 'u2', characterId, primary: true, revision: 1 } } };
  registerStore('characterTokenStore', { getState: () => ({ characterTokens: [token] }) });
  registerStore('creatureStore', { getState: () => ({ creatureTokens: [] }) });
};
beforeEach(() => {
  resetUnresolvedForTests(); retryActorCommand.mockReset(); roomCondition.mockImplementation(defaultRoomCondition); notices = [];
  registerStore('chatStore', { getState: () => ({ addCombatNotification: n => notices.push(n.content) }) });
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r1' }, currentPlayer: { id: 'player-1' } }) });
  registerStore('authStore', { getState: () => ({ user: { uid: 'u2' } }) });
  registerStore('characterStore', { getState: () => ({ currentCharacterId: 'charA', id: 'charA' }) });
  registerActor();
});

test('an unknown buff carries the never-sent debuff; a confirmed replay hands it back to be sent', async () => {
  const buff = { polarity: 'buff', condition: { name: 'P' } };
  const debuff = { polarity: 'debuff', condition: { name: 'P' } };
  const sent = await applyConsumableCondition(add(unknown('b1')), buff.polarity, buff.condition, 'k', [debuff]);
  expect(sent.applied).toBe(false);
  retryActorCommand.mockResolvedValue({ success: true, commandId: 'b1' });
  const settled = await settleEarlierUse('k', 'P');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true });
  expect(settled.rest).toEqual([debuff]);
});

test('a debuff that stayed unknown after a consumed use does not make the NEXT potion look confirmed', async () => {
  await applyConsumableCondition(add({ success: true }), 'buff', {}, 'k');
  await applyConsumableCondition(add(unknown('d1')), 'debuff', {}, 'k');
  markUseCompleted('k');                                  // the first potion was consumed with one part pending
  retryActorCommand.mockResolvedValue({ success: true, commandId: 'd1' });
  const settled = await settleEarlierUse('k', 'P');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: false });   // the new potion still sends its own conditions
});

test('a command the service no longer holds is dropped once with a notice, never a permanent block', async () => {
  await applyConsumableCondition(add(unknown('x')), 'buff', { name: 'P' }, 'k');
  retryActorCommand.mockResolvedValue({ success: false, code: 'outcome_unknown' });   // no commandId: not pending any more
  expect(await settleEarlierUse('k', 'P')).toEqual({ proceed: false });
  expect(notices[0]).toMatch(/can no longer be re-asked/);
  expect(await reconcileUnresolved('k')).toEqual({ state: 'none' });                   // the next use is a new attempt
});

test('an accepted-but-unsynced FIRST send is applied, not shown as a refusal', async () => {
  const sent = await applyConsumableCondition(add({ success: false, code: 'snapshot_required', commandId: 's', acceptedReceipt: { commandId: 's' }, status: 'accepted' }), 'buff', { name: 'P' }, 'k');
  expect(sent.applied).toBe(true);
  expect(await reconcileUnresolved('k')).toEqual({ state: 'none' });
});

test('an accepted-but-unsynced answer counts as landed and is never re-sent', async () => {
  await applyConsumableCondition(add(unknown('a')), 'buff', { name: 'P' }, 'k');
  retryActorCommand.mockResolvedValue({ success: false, code: 'snapshot_required', commandId: 'a', acceptedReceipt: { commandId: 'a' }, status: 'accepted' });
  expect(await reconcileUnresolved('k')).toMatchObject({ state: 'applied' });
});

test('a pending approval or a silent room keeps the hold; a real refusal clears it', async () => {
  await applyConsumableCondition(add(unknown('a')), 'buff', { name: 'P' }, 'k');
  retryActorCommand.mockResolvedValue({ success: false, code: 'authorization_required', commandId: 'a' });
  expect((await reconcileUnresolved('k')).state).toBe('unresolved');
  retryActorCommand.mockResolvedValue({ success: false, code: 'attribute_change_gm_only', error: 'no', commandId: 'a' });
  expect((await reconcileUnresolved('k')).state).toBe('refused');
  expect((await reconcileUnresolved('k')).state).toBe('none');
});

test('an item with no key is not locked out', async () => {
  expect(await withConsumeLock('', async () => 'ran')).toBe('ran');
  const first = withConsumeLock('k', () => new Promise(r => setTimeout(() => r('a'), 5)));
  expect(await withConsumeLock('k', async () => 'b')).toEqual({ locked: true });
  expect(await first).toBe('a');
});

test('DS F2: unresolved command is bound to characterId and cannot be settled or completed by another character', async () => {
  // charA uses item k and gets outcome_unknown
  await applyConsumableCondition(add(unknown('cmdA')), 'buff', { name: 'P' }, 'k', [], 'charA');
  
  // charB tries to settle k - no entry for charB
  expect(await settleEarlierUse('k', 'P', 'charB')).toEqual({ proceed: true, alreadyConfirmed: false, rest: [] });
  expect(retryActorCommand).not.toHaveBeenCalled();

  // charB tries to markUseCompleted on k - should not mark charA's entry
  markUseCompleted('k', 'charB');

  // charA settles k - retryActorCommand is called for cmdA
  retryActorCommand.mockResolvedValueOnce({ success: true, commandId: 'cmdA' });
  const settled = await settleEarlierUse('k', 'P', 'charA');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true });
  expect(retryActorCommand).toHaveBeenCalledWith('cmdA');
});

test('DS F4: held keys can be marked, inspected, released, and cleared on test reset', () => {
  expect(isHeld('item-123')).toBe(false);
  markHeld('item-123');
  expect(isHeld('item-123')).toBe(true);
  releaseHeld('item-123');
  expect(isHeld('item-123')).toBe(false);

  markHeld('item-456');
  resetUnresolvedForTests();
  expect(isHeld('item-456')).toBe(false);
});

test('DS F2: preserved accepted command is bound to characterId and reconciles for original character without refusal', async () => {
  preserveAcceptedForReconciliation('k', { commandId: 'cmdAcceptedA', name: 'Potion A', characterId: 'charA' });

  // charB does not see or settle charA's accepted use
  expect(await settleEarlierUse('k', 'Potion A', 'charB')).toEqual({ proceed: true, alreadyConfirmed: false, rest: [] });
  expect(retryActorCommand).not.toHaveBeenCalled();

  // charA settles: retryActorCommand is called and returns accepted receipt
  retryActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted', commandId: 'cmdAcceptedA', acceptedReceipt: { commandId: 'cmdAcceptedA' } });
  const settled = await settleEarlierUse('k', 'Potion A', 'charA');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true });
  expect(retryActorCommand).toHaveBeenCalledWith('cmdAcceptedA');
  expect(notices.some(n => n.includes('refused'))).toBe(false);
});

test('planConsumableResources plans non-overhealing updates and flags overheal unless allowOverhealCap is set', () => {
  registerStore('characterStore', {
    getState: () => ({ health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 })
  });
  expect(planConsumableResources({ combatStats: { healthRestore: { value: 5 }, manaRestore: { value: 4 } } })).toEqual({
    overheal: false,
    updates: { currentHp: 25, tempHealth: 0, currentMana: 14, tempMana: 0 }
  });
  expect(planConsumableResources({ combatStats: { healthRestore: { value: 25 } } })).toEqual({
    overheal: true,
    updates: null,
    overhealPools: [{ resourceType: 'health', amount: 25, overhealAmount: 5, currentValue: 20, maxValue: 40, currentTemp: 0 }]
  });
  expect(planConsumableResources({ combatStats: { healthRestore: { value: 25 } } }, { allowOverhealCap: true })).toEqual({
    overheal: false,
    updates: { currentHp: 40, tempHealth: 0 }
  });
});

test('persisted unresolved command survives reload and reconciles when actorInstanceId matches', async () => {
  window.localStorage.clear();
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r1' } }) });
  registerStore('authStore', { getState: () => ({ user: { uid: 'u2' } }) });
  registerStore('characterStore', { getState: () => ({ currentCharacterId: 'charA', id: 'charA' }) });
  const frozenCmd = { version: 1, roomId: 'r1', commandId: 'cmd-reload-1', actors: [{ ref: { kind: 'character', tokenId: 'pc2', instanceId: 'inst-1' } }] };
  preserveAcceptedForReconciliation('potion-reload', {
    commandId: 'cmd-reload-1',
    command: frozenCmd,
    actorInstanceId: 'inst-1',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-reload-1' },
    characterId: 'charA'
  });
  resetUnresolvedForTests({ keepStorage: true });
  expect(hasUnresolved('potion-reload', 'charA')).toBe(true);
  retryActorCommand.mockResolvedValueOnce({ success: false, code: 'outcome_unknown' });
  const settled = await settleEarlierUse('potion-reload', 'Potion', 'charA');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true });
  expect(hasUnresolved('potion-reload', 'charA')).toBe(false);
});

test('retired_principal and foreign context refuse settlement even when stored entry is accepted, preserving historicalAccepted', async () => {
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r1' } }) });
  registerStore('authStore', { getState: () => ({ user: { uid: 'u2' } }) });
  registerStore('characterStore', { getState: () => ({ currentCharacterId: 'charA', id: 'charA' }) });
  preserveAcceptedForReconciliation('potion-retire', {
    commandId: 'cmd-retire-1',
    roomId: 'r1',
    ownerUid: 'u2',
    actorInstanceId: 'inst-1',
    itemId: 'inv-1',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-retire-1' },
    acceptedReceipt: { commandId: 'cmd-retire-1' },
    characterId: 'charA'
  });

  // Case 1: retryActorCommand returns retired_principal
  retryActorCommand.mockResolvedValueOnce({ success: false, code: 'retired_principal' });
  const settled1 = await settleEarlierUse('potion-retire', 'Potion', 'charA');
  expect(settled1).toEqual({ proceed: false });
  expect(notices.some(n => /room session changed/.test(n))).toBe(true);
  expect(hasUnresolved('potion-retire', 'charA')).toBe(false);
  expect(getHistoricalAcceptedForTests()).toEqual([
    expect.objectContaining({ commandId: 'cmd-retire-1', key: 'potion-retire', retiredReason: 'retired_principal' })
  ]);

  // Case 2: foreign room context (r1 -> r2) refuses before falling back to stored accepted outcome
  preserveAcceptedForReconciliation('potion-retire-room', {
    commandId: 'cmd-retire-2',
    roomId: 'r1',
    ownerUid: 'u2',
    actorInstanceId: 'inst-1',
    itemId: 'inv-1',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-retire-2' },
    characterId: 'charA'
  });
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r2' } }) });
  retryActorCommand.mockResolvedValueOnce({ success: false, code: 'outcome_unknown' });
  const settled2 = await settleEarlierUse('potion-retire-room', 'Potion', 'charA');
  expect(settled2).toEqual({ proceed: false });
  expect(hasUnresolved('potion-retire-room', 'charA')).toBe(false);
  expect(getHistoricalAcceptedForTests()).toHaveLength(2);
});

test('settleEarlierUse returns settledItemId bound to the exact inventoryItem.id', async () => {
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r1' } }) });
  registerStore('authStore', { getState: () => ({ user: { uid: 'u2' } }) });
  registerStore('characterStore', { getState: () => ({ currentCharacterId: 'charA', id: 'charA' }) });
  preserveAcceptedForReconciliation('potion-id', {
    commandId: 'cmd-item-1',
    itemId: 'inv-exact-1',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-item-1' },
    characterId: 'charA'
  });
  retryActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted', commandId: 'cmd-item-1' });
  const settled = await settleEarlierUse('potion-id', 'Potion', 'charA');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true, settledItemId: 'inv-exact-1' });
  expect(hasUnresolved('potion-id', 'charA')).toBe(false);
});

test('a durable deduction marker written with the item save makes an accepted replay skip the second deduction', async () => {
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r1' } }) });
  registerStore('authStore', { getState: () => ({ user: { uid: 'u2' } }) });
  registerStore('characterStore', { getState: () => ({ currentCharacterId: 'charA', id: 'charA', characters: [{
    id: 'charA', inventory: { consumableCommandCompletions: [{ commandId: 'cmd-dup', itemId: 'inv-1', characterId: 'charA', quantity: 1 }] }
  }] }) });
  registerStore('inventoryStore', { getState: () => ({ consumableCommandCompletions: [] }) });
  preserveAcceptedForReconciliation('potion-dup', {
    commandId: 'cmd-dup', itemId: 'inv-1', characterId: 'charA',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-dup' }
  });
  retryActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted', commandId: 'cmd-dup' });
  const settled = await settleEarlierUse('potion-dup', 'Potion', 'charA');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true, alreadyDeducted: true, settledCommandId: 'cmd-dup' });
});

test('without a durable deduction marker an accepted replay still needs the single deduction', async () => {
  registerStore('gameStore', { getState: () => ({ multiplayerRoom: { id: 'r1' } }) });
  registerStore('authStore', { getState: () => ({ user: { uid: 'u2' } }) });
  registerStore('characterStore', { getState: () => ({ currentCharacterId: 'charA', id: 'charA', characters: [{ id: 'charA', inventory: { consumableCommandCompletions: [] } }] }) });
  registerStore('inventoryStore', { getState: () => ({ consumableCommandCompletions: [] }) });
  preserveAcceptedForReconciliation('potion-nomarker', {
    commandId: 'cmd-nomarker', itemId: 'inv-1', characterId: 'charA',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-nomarker' }
  });
  retryActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted', commandId: 'cmd-nomarker' });
  const settled = await settleEarlierUse('potion-nomarker', 'Potion', 'charA');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true, settledCommandId: 'cmd-nomarker' });
  expect(settled.alreadyDeducted).toBeFalsy();
});

test('a post-submission journal write failure keeps the uncertain entry and warns visibly instead of discarding it', async () => {
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    const err = new Error('QuotaExceededError'); err.name = 'QuotaExceededError'; throw err;
  });
  try {
    preserveAcceptedForReconciliation('potion-warn', {
      commandId: 'cmd-warn', actorInstanceId: 'inst-1', characterId: 'charA',
      outcome: { success: true, status: 'accepted', commandId: 'cmd-warn' }
    });
    expect(hasUnresolved('potion-warn', 'charA')).toBe(true);
    expect(notices.some(n => /could not save the recovery record/.test(n))).toBe(true);
    expect(notices.some(n => /was not used and is still in your pack|did not accept/i.test(n))).toBe(false);
  } finally {
    spy.mockRestore();
  }
});


test('a different inventory instance never settles the original use', async () => {
  preserveAcceptedForReconciliation('potion-copy', {
    commandId: 'cmd-copy-1',
    itemId: 'inv-1',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-copy-1' },
    characterId: 'charA'
  });
  // Clicking another copy of the same item must not replay or consume the first copy's accepted use.
  expect(await settleEarlierUse('potion-copy', 'Potion', 'charA', 'inv-2')).toEqual({ proceed: true, alreadyConfirmed: false, rest: [] });
  expect(retryActorCommand).not.toHaveBeenCalled();
  retryActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted', commandId: 'cmd-copy-1' });
  const settled = await settleEarlierUse('potion-copy', 'Potion', 'charA', 'inv-1');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true, settledItemId: 'inv-1' });
});

test('stored accepted outcome never overrides a missing/retired actor incarnation', async () => {
  registerStore('characterTokenStore', { getState: () => ({ characterTokens: [] }) });
  registerStore('creatureStore', { getState: () => ({ creatureTokens: [] }) });
  preserveAcceptedForReconciliation('potion-gone', {
    commandId: 'cmd-gone',
    roomId: 'r1',
    ownerUid: 'u2',
    actorInstanceId: 'inst-gone',
    itemId: 'inv-1',
    outcome: { success: true, status: 'accepted', commandId: 'cmd-gone' },
    acceptedReceipt: { commandId: 'cmd-gone' },
    characterId: 'charA'
  });
  const settled = await settleEarlierUse('potion-gone', 'Potion', 'charA', 'inv-1');
  expect(settled).toEqual({ proceed: false });
  expect(retryActorCommand).not.toHaveBeenCalled();
  expect(notices.some(n => /room session changed/.test(n))).toBe(true);
  expect(getHistoricalAcceptedForTests()).toEqual([
    expect.objectContaining({ commandId: 'cmd-gone', key: 'potion-gone', retiredReason: 'retired_principal' })
  ]);
});

test('completing one inventory instance does not clear another copy accepted use', async () => {
  const accepted = id => ({ success: true, status: 'accepted', commandId: id });
  preserveAcceptedForReconciliation('potion-two', { commandId: 'cmd-a', itemId: 'inv-a', outcome: accepted('cmd-a'), characterId: 'charA' });
  preserveAcceptedForReconciliation('potion-two', { commandId: 'cmd-b', itemId: 'inv-b', outcome: accepted('cmd-b'), characterId: 'charA' });
  markUseCompleted('potion-two', 'charA', 'inv-a');
  retryActorCommand.mockResolvedValueOnce(accepted('cmd-b'));
  const settled = await settleEarlierUse('potion-two', 'Potion', 'charA', 'inv-b');
  expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true, settledItemId: 'inv-b' });
});

test('storage write failure (QuotaExceededError) degrades gracefully to in-memory session registry without throwing', async () => {
  const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    const err = new Error('QuotaExceededError');
    err.name = 'QuotaExceededError';
    throw err;
  });
  try {
    expect(() => preserveAcceptedForReconciliation('potion-quota', {
      commandId: 'cmd-quota-1',
      actorInstanceId: 'inst-1',
      itemId: 'inv-1',
      outcome: { success: true, status: 'accepted', commandId: 'cmd-quota-1' },
      characterId: 'charA'
    })).not.toThrow();
    expect(hasUnresolved('potion-quota', 'charA')).toBe(true);
    retryActorCommand.mockResolvedValueOnce({ success: true, status: 'accepted', commandId: 'cmd-quota-1' });
    const settled = await settleEarlierUse('potion-quota', 'Potion', 'charA');
    expect(settled).toMatchObject({ proceed: true, alreadyConfirmed: true, settledItemId: 'inv-1' });
    expect(hasUnresolved('potion-quota', 'charA')).toBe(false);
  } finally {
    spy.mockRestore();
  }
});

describe('normalizeForRoom schema cleanliness and zero preservation', () => {
  const mockRef = { kind: 'character', roomId: 'r1', mapId: 'm1', tokenId: 'pc2', ownerUid: 'u2', characterId: 'charA' };

  test('omits absent optional fields rather than emitting null', () => {
    const rawCondition = {
      name: 'Potion of Vigor',
      description: 'Regen buff',
      effects: { healthRegen: 2 },
      duration: 60,
      source: 'consumable',
      target: 'player'
    };

    const record = normalizeForRoom('buff', rawCondition, mockRef);
    expect(record.version).toBe(1);
    expect(record.name).toBe('Potion of Vigor');
    expect(record.type).toBe('buff');
    expect(record.kind).toBe('effect');
    expect(record.effects).toEqual({ healthRegen: 2 });
    expect(record.duration).toBe(60);
    expect(record.durationType).toBe('seconds');
    expect(typeof record.startTime).toBe('number');
    expect(typeof record.endTime).toBe('number');
    expect(record.endTime).toBeGreaterThan(record.startTime);

    // Verify absent optional fields are NOT present
    expect('durationValue' in record).toBe(false);
    expect('remainingRounds' in record).toBe(false);
    expect('overTimeType' in record).toBe(false);
    expect('overTimeFormula' in record).toBe(false);
    expect('overTimeElement' in record).toBe(false);
    expect('tickFrequency' in record).toBe(false);
    expect('tickFrequencyValue' in record).toBe(false);
    expect('tickFrequencyUnit' in record).toBe(false);

    // No property should have a null value
    for (const [key, value] of Object.entries(record)) {
      expect(value).not.toBeNull();
    }
  });

  test('preserves valid explicit zero values without falling back to truthiness defaults', () => {
    const zeroCondition = {
      name: 'Zero Buff',
      effects: { healthRegen: 0 },
      duration: 0,
      durationValue: 0,
      remainingRounds: 0,
      startTime: 0,
      endTime: 0,
      durationType: 'rounds'
    };

    const record = normalizeForRoom('buff', zeroCondition, mockRef);
    expect(record.duration).toBe(0);
    expect(record.durationValue).toBe(0);
    expect(record.remainingRounds).toBe(0);
    expect(record.startTime).toBe(0);
    expect(record.effects).toEqual({ healthRegen: 0 });
    expect('endTime' in record).toBe(false); // rounds omit endTime
  });

  test('rounds durationType sets integer durationValue and remainingRounds, omitting endTime', () => {
    const roundCondition = {
      name: 'Round Potion',
      effects: { armor: 2 },
      duration: 18,
      durationType: 'rounds'
    };

    const record = normalizeForRoom('buff', roundCondition, mockRef);
    expect(record.durationType).toBe('rounds');
    expect(record.durationValue).toBe(3); // Math.ceil(18 / 6)
    expect(record.remainingRounds).toBe(3);
    expect('endTime' in record).toBe(false);
  });
});
