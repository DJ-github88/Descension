import {
  normalizeCrusaderResource, updateCrusaderResource, getCrusaderSpellResourcePlan,
  getCrusaderFervorTier, isCrusaderHarmonicStance, isCrusaderJudgmentReady,
  CRUSADER_FERVOR_MAX, CRUSADER_HARMONIC_STANCE, CRUSADER_SOLVAN_JUDGMENT
} from '../crusaderResourceContract';
import { normalizeManagedClassResource, getManagedSpellResourcePlan } from '../classResourceContracts';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';

jest.mock('../../store/customLineageStore', () => ({
  __esModule: true, default: { getState: () => ({ getLineage: () => null }) }
}));
jest.mock('../../store/characterHelpers', () => ({
  getEncumbranceState: () => 'normal', triggerCharacterAutoSave: jest.fn()
}));

const makeStore = (className, resource) => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('normalization prefers current, mirrors fervor aliases and clamps to 0-100', () => {
  expect(normalizeCrusaderResource({ type: 'fervor', current: 60 }))
    .toMatchObject({ type: 'radiantFervor', current: 60, max: CRUSADER_FERVOR_MAX });
  expect(normalizeCrusaderResource({ radiantFervor: 35 }).current).toBe(35);
  expect(normalizeCrusaderResource({ fervor: 250 }).current).toBe(100);
  expect(normalizeCrusaderResource({ fervor: 250, current: 12 }).current).toBe(12);
});

test('thresholds separate zeal, harmonic stance and judgment readiness', () => {
  expect(getCrusaderFervorTier(0).name).toBe('Zeal');
  expect(getCrusaderFervorTier(CRUSADER_HARMONIC_STANCE).name).toBe('Harmonic Stance');
  expect(getCrusaderFervorTier(CRUSADER_SOLVAN_JUDGMENT).name).toBe('Judgment Ready');
  expect(isCrusaderHarmonicStance(49)).toBe(false);
  expect(isCrusaderHarmonicStance(50)).toBe(true);
  expect(isCrusaderJudgmentReady(99)).toBe(false);
  expect(isCrusaderJudgmentReady(100)).toBe(true);
});

test('store generation and unleashing round-trip through the shared router', () => {
  const store = makeStore('Crusader', { type: 'radiantFervor', current: 40, max: 100 });
  store.getState().gainClassResource(15);
  expect(store.getState().classResource).toMatchObject({ current: 55, harmonicStance: true, judgmentReady: false });
  store.getState().consumeClassResource(25);
  expect(store.getState().classResource.current).toBe(30);
  store.getState().gainClassResource(100);
  expect(store.getState().classResource).toMatchObject({ current: 100, judgmentReady: true });
});

test('gain and cost encodings produce the correct plan and affordability', () => {
  const gain = getCrusaderSpellResourcePlan({ resourceCost: { classResource: { type: 'fervor', gain: 15 } } }, { current: 0 }, 'radiantFervor');
  expect(gain).toMatchObject({ handled: true, cost: 0, gain: 15, affordable: true });
  const spend = getCrusaderSpellResourcePlan({ resourceCost: { classResource: { type: 'fervor', cost: 100 } } }, { current: 100 }, 'radiantFervor');
  expect(spend).toMatchObject({ handled: true, cost: 100, gain: 0, affordable: true, judgmentReady: true });
  expect(getCrusaderSpellResourcePlan({ resourceCost: { classResource: { type: 'fervor', cost: 100 } } }, { current: 60 }, 'radiantFervor').affordable).toBe(false);
});

test('the shared router resolves Crusader resources and plans end to end', () => {
  expect(normalizeManagedClassResource({ type: 'fervor', current: 50 }, 'Crusader').current).toBe(50);
  const plan = getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'fervor', cost: 50 } } }, { type: 'radiantFervor', current: 50 }, 'Crusader');
  expect(plan).toMatchObject({ handled: true, id: 'radiantFervor', cost: 50, label: 'Fervor' });
  expect(updateCrusaderResource({ current: 0 }, 'current', 50)).toMatchObject({ current: 50, harmonicStance: true });
});
