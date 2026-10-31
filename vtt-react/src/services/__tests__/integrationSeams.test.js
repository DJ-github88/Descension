import useCharacterStore from '../../store/characterStore';
import useConditionStore from '../../store/conditionStore';
import useCreatureStore from '../../store/creatureStore';
import useCombatStore from '../../store/combatStore';
import { registerStore } from '../../store/storeRegistry';
import { combatAttributes } from '../combatAttributes';
import { supportSpell, readFormula } from '../spellConsequence';
import { supportStrike } from '../weaponStrike';
import { getEffectiveAttributes, planAttributeSave } from '../../utils/attributeProfile';
import { buildCharacterResourceSnapshot } from '../../utils/characterResourceSnapshot';
import { characterWizardReducer, initialState, ACTION_TYPES, getWizardAttributePreview } from '../../components/character-creation-wizard/context/CharacterWizardContext';
import { makeMovementRecord } from '../sharedConditionProfile';

const base = { strength: 5, agility: 5, constitution: 5, intelligence: 5, spirit: 15, charisma: 5 };
const record = { race: 'vreken', subrace: 'clean_vreken', background: 'sanctuarySeneschal',
  statsModel: 'base+earned@1', baseStats: base, stats: { ...base, intelligence: 6 },
  levelUpHistory: { 2: { attributes: ['intelligence'] } }, class: 'Arcanoneer',
  classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane'] }, equipment: {} };

test('saved gains agree in edit preview, spell score/divisor and strike modifier; base edits retain current adjustments', () => {
  const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });
  const recalculated = characterWizardReducer(loaded, { type: ACTION_TYPES.RECALCULATE_FINAL_STATS });
  expect(getWizardAttributePreview(recalculated).intelligence).toBe(11);
  expect(recalculated.characterData.finalStats.intelligence).toBe(11);
  expect(supportSpell({ id: 'arc_spark_bolt' }, record).reading.constant).toBe(2);
  expect(readFormula('1d4+intelligence', combatAttributes(record)).constant).toBe(11);
  expect(supportStrike({ id: 'universal_attack' }, record).weapon).toMatchObject({ score: 2, modifier: -4 });
  const edited = { ...loaded, characterData: { ...loaded.characterData, baseStats: { ...base, intelligence: 7 } } };
  expect(getWizardAttributePreview(edited).intelligence).toBe(13);
  expect(planAttributeSave(record, base, loaded.loadedAttributes).stats.intelligence).toBe(6);
});

test('legacy resource and edit previews retain saved interpretation and never fabricate provenance', () => {
  const { baseStats, statsModel, ...legacy } = record;
  const before = JSON.stringify(legacy);
  const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: legacy });
  expect(getWizardAttributePreview(loaded)).toEqual(getEffectiveAttributes(legacy));
  expect(buildCharacterResourceSnapshot(legacy).effectiveStats).toEqual(getEffectiveAttributes(legacy));
  expect(planAttributeSave(legacy, loaded.characterData.baseStats, loaded.loadedAttributes)).toEqual({});
  expect(JSON.stringify(legacy)).toBe(before);
});

test('an absent saved attribute stays unavailable to combat, while complete legacy scores remain valid', () => {
  const { intelligence, ...incomplete } = record.stats;
  expect(supportSpell({ id: 'arc_spark_bolt' }, { ...record, stats: incomplete }).supported).toBe(false);
  const { baseStats, statsModel, ...legacy } = record;
  expect(combatAttributes(legacy).intelligence).toBe(getEffectiveAttributes(legacy).intelligence);
});

test('live combat reuses sheet equipment and signed current buff/debuff path', () => {
  useCharacterStore.setState({ ...record, equipment: {} });
  const effects = jest.spyOn(useConditionStore.getState(), 'getActiveEffects')
    .mockImplementation(kind => ({ intelligence: [{ value: kind === 'buff' ? 3 : -1 }] }));
  try {
    const state = useCharacterStore.getState();
    expect(combatAttributes(state).intelligence).toBe(13);
    expect(supportSpell({ id: 'arc_spark_bolt' }, state).reading.constant).toBe(3);
    expect(effects).toHaveBeenCalledWith('debuff');
  } finally { effects.mockRestore(); }
});

test.each([-10, -30])('movement budgets use effective speed %i and remain finite at zero', feet => {
  registerStore('creatureStore', useCreatureStore);
  const ref = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 't', instanceId: 'i' };
  const condition = makeMovementRecord(ref, '10000000-0000-4000-8000-000000000001',
    { sourceActor: { ...ref, tokenId: 's' }, sourceOccurrence: 'authored-effect:10000000-0000-4000-8000-000000000001', timing: 'manual', authoredDuration: 'manual', feet, label: 'Mired' });
  useCreatureStore.setState({ tokens: [{ id: 't', state: { conditions: [condition] } }] });
  useCombatStore.setState({ turnOrder: [{ tokenId: 't', creatureId: 'c', currentActionPoints: 3 }], turnMovementUsed: new Map([['t', 5]]), movementUnlocked: new Set(['t']), turnStartPositions: new Map() });
  const creatures = [{ id: 'c', stats: { speed: 30 } }], state = useCombatStore.getState();
  expect(state.getRemainingMovement('t', creatures)).toBe(feet === -30 ? 0 : 75);
  expect(Number.isFinite(state.getTotalUnlockedMovement('t', creatures))).toBe(true);
  if (feet === -30) expect(state.validateMovement('t', { x: 0, y: 0 }, { x: 50, y: 0 }, creatures)).toMatchObject({ isValid: false, needsConfirmation: false });
  useCreatureStore.setState({ tokens: [{ id: 't', state: { conditions: [] } }] });
  expect(state.getRemainingMovement('t', creatures)).toBe(115);
  const startPosition={x:0,y:0},finalPosition={x:50,y:0};
  const quote=state.validateMovement('t',startPosition,finalPosition,creatures);
  state.setPendingMovementConfirmation({tokenId:'t',startPosition,finalPosition,requiredAP:quote.additionalAPNeeded,totalDistance:quote.totalMovementAfterThis,baseMovement:quote.creatureSpeed,currentAP:quote.currentAP});
  const beforeAP=useCombatStore.getState().turnOrder[0].currentActionPoints;
  useCreatureStore.setState({ tokens: [{ id:'t',state:{conditions:[condition]} }] });
  expect(state.reviewMovementConfirmation(creatures)).toEqual(feet===-30?{ready:false}:{ready:false,repriced:true});
  expect(useCombatStore.getState().turnOrder[0].currentActionPoints).toBe(beforeAP);
  expect(useCombatStore.getState().turnMovementUsed.get('t')).toBe(5);
  if(feet===-10)expect(state.reviewMovementConfirmation(creatures)).toEqual({ready:true});
});
