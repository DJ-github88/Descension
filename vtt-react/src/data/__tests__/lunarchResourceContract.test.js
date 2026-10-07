import {
  normalizeLunarchResource, updateLunarchResource, getLunarchSpellResourcePlan,
  resolveLunarchPhase, advanceLunarchPhase, getLunarchPhaseIndex, LUNARCH_PHASES
} from '../lunarchResourceContract';
import { normalizeManagedClassResource, getManagedSpellResourcePlan } from '../classResourceContracts';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';

jest.mock('../../store/customLineageStore', () => ({ __esModule: true, default: { getState: () => ({ getLineage: () => null }) } }));
jest.mock('../../store/characterHelpers', () => ({ getEncumbranceState: () => 'normal', triggerCharacterAutoSave: jest.fn() }));

const makeStore = (className, resource) => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('phases resolve from names and indices and wrap around four states', () => {
  expect(resolveLunarchPhase('full_moon')).toBe('full_moon');
  expect(resolveLunarchPhase('Full Moon')).toBe('full_moon');
  expect(resolveLunarchPhase(3)).toBe('waning_moon');
  expect(advanceLunarchPhase('waning_moon', 1)).toBe('new_moon');
  expect(advanceLunarchPhase('new_moon', 2)).toBe('full_moon');
  expect(LUNARCH_PHASES).toHaveLength(4);
});

test('normalization stores the phase index, name and round timer without a scalar pool', () => {
  expect(normalizeLunarchResource({ currentLunarPhase: 'full_moon', roundsInPhase: 2 }))
    .toMatchObject({ type: 'lunarPhases', currentPhase: 'full_moon', currentLunarPhase: 'full_moon', current: 2, roundsInPhase: 2 });
  expect(updateLunarchResource({ currentLunarPhase: 'new_moon' }, 'current', 1)).toMatchObject({ currentPhase: 'waxing_moon' });
  expect(updateLunarchResource({ currentLunarPhase: 'new_moon' }, 'roundsInPhase', 3)).toMatchObject({ roundsInPhase: 3 });
});

test('plans express phase advancement and phase requirements, not scalar spend', () => {
  const advance = getLunarchSpellResourcePlan({ resourceCost: { classResource: { type: 'lunar_phase', phaseAdvancement: 1 } } }, { currentLunarPhase: 'new_moon' }, 'lunarPhases');
  expect(advance).toMatchObject({ handled: true, id: 'lunarPhases', cost: 0, gain: 0, phaseAdvancement: 1, fromPhase: 'new_moon', toPhase: 'waxing_moon', affordable: true });
  const required = getLunarchSpellResourcePlan({ resourceCost: { classResource: { type: 'lunar_phase', cost: 4, phaseRequired: 'eclipse' } } }, { currentLunarPhase: 'full_moon' }, 'lunarPhases');
  expect(required).toMatchObject({ handled: true, phaseCost: 4 });
  expect(required.affordable).toBe(false);
  expect(normalizeManagedClassResource({ currentLunarPhase: 'waning_moon' }, 'Lunarch')).toMatchObject({ currentPhase: 'waning_moon' });
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'lunar_phase', phaseAdvancement: 1 } } }, { currentLunarPhase: 'new_moon' }, 'Lunarch')).toMatchObject({ handled: true, id: 'lunarPhases' });
});

test('store phase changes route through the shared router', () => {
  const store = makeStore('Lunarch', { type: 'lunarPhases', currentLunarPhase: 'new_moon', roundsInPhase: 0 });
  store.getState().updateClassResource('currentLunarPhase', 'full_moon');
  expect(store.getState().classResource).toMatchObject({ currentPhase: 'full_moon', current: getLunarchPhaseIndex('full_moon') });
});
