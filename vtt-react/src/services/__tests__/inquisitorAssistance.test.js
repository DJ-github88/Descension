let mockCharacter;
jest.mock('../../store/characterStore', () => {
  const hook = selector => selector ? selector(mockCharacter) : mockCharacter;
  hook.getState = () => mockCharacter;
  return { __esModule: true, default: hook };
});
jest.mock('../../store/chatStore', () => ({ __esModule: true, default: { getState: () => ({ addCombatNotification: jest.fn() }) } }));

import useConditionStore from '../../store/conditionStore';
import { processOverTimeEffectsForTarget, getStatModifiersForTarget } from '../effectProcessingService';
import { getAssistanceDecisionForTarget } from '../inquisitorAssistanceService';
import { getStore, registerStore } from '../../store/storeRegistry';

test('stored foreign buffs pause while the aura is active and resume after release without deleting provenance', () => {
  const previousConditions = useConditionStore.getState();
  const previousStores = ['characterStore', 'characterTokenStore', 'partyStore'].map(key => [key, getStore(key)]);
  mockCharacter = { id: 'inq-1', class: 'Inquisitor', classResource: { current: 4, nullAura: { active: false } },
    health: { current: 20, max: 40 }, stats: {}, resistances: {}, updateStat: jest.fn(),
    updateHealth: update => { mockCharacter.health = { ...mockCharacter.health, ...update }; } };
  registerStore('characterStore', { getState: () => mockCharacter });
  registerStore('characterTokenStore', { getState: () => ({ characterTokens: [], updateCharacterTokenState: jest.fn() }) });
  registerStore('partyStore', { getState: () => ({ partyMembers: [{ id: 'ally', character: { class: 'Martyr' } }] }) });
  useConditionStore.setState({ activeBuffs: [], activeDebuffs: [] });
  try {
    const store = useConditionStore.getState();
    const base = { targetId: 'player', targetType: 'player', source: 'spell', durationType: 'rounds', durationValue: 3, isMagical: true };
    store.addCondition('buff', { ...base, id: 'foreign', name: 'Foreign Ward', effectOrigin: 'foreign', sourceEntityId: 'healer', effects: { strength: 2 },
      hasOverTimeEffect: true, overTimeType: 'healing', overTimeFormula: '5', tickFrequency: 'turn_start' }, true);
    store.addCondition('buff', { ...base, id: 'self', name: 'Self Authority', effectOrigin: 'self', sourceEntityId: 'inq-1', effects: { strength: 1 } }, true);
    expect(useConditionStore.getState().activeBuffs.find(effect => effect.id === 'foreign')).toMatchObject({ sourceEntityId: 'healer', effectOrigin: 'foreign', isMagical: true });
    mockCharacter.classResource.nullAura.active = true;
    expect(useConditionStore.getState().getActiveEffects('buff').strength).toEqual([{ value: 1, source: 'Self Authority' }]);
    expect(getStatModifiersForTarget('player').strength).toBe(1);
    const suppressed = processOverTimeEffectsForTarget('player', 'turn_start');
    expect(suppressed).toEqual(expect.arrayContaining([expect.objectContaining({ suppressed: true, amount: 0 })]));
    expect(mockCharacter.health.current).toBe(20);
    expect(useConditionStore.getState().activeBuffs).toHaveLength(2);
    expect(getAssistanceDecisionForTarget({ kind: 'buff', effectOrigin: 'foreign', isMagical: true }, 'ally').suppressed).toBe(false);
    mockCharacter.classResource.nullAura.active = false;
    expect(getStatModifiersForTarget('player').strength).toBe(3);
    processOverTimeEffectsForTarget('player', 'turn_start');
    expect(mockCharacter.health.current).toBe(25);
    mockCharacter.classResource.nullAura.active = true;
    store.addCondition('debuff', { ...base, id: 'harm', name: 'Hostile Corruption', effectOrigin: 'foreign', sourceEntityId: 'enemy',
      hasOverTimeEffect: true, overTimeType: 'damage', overTimeElement: 'wyrd', overTimeFormula: '5', tickFrequency: 'turn_start' }, true);
    processOverTimeEffectsForTarget('player', 'turn_start');
    expect(mockCharacter.health.current).toBe(20);
  } finally {
    useConditionStore.setState(previousConditions, true);
    previousStores.forEach(([key, previous]) => registerStore(key, previous));
  }
});
