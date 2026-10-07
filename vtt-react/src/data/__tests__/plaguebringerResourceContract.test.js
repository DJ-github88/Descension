import {
  normalizePlaguebringerResource, getPlaguebringerSpellResourcePlan,
  getPlaguebringerTier, PLAGUEBRINGER_VIRULENCE_MAX, PLAGUEBRINGER_AFFLICTION_MAX
} from '../plaguebringerResourceContract';
import { normalizeManagedClassResource, getManagedSpellResourcePlan, getClassResourceValue } from '../classResourceContracts';
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

test('normalization reads virulence aliases, clamps finite pools and tiers', () => {
  expect(normalizePlaguebringerResource({ current: 50 })).toMatchObject({ type: 'virulenceCultivation', virulence: 50, max: PLAGUEBRINGER_VIRULENCE_MAX });
  expect(normalizePlaguebringerResource({ virulence: 250 }).virulence).toBe(PLAGUEBRINGER_VIRULENCE_MAX);
  expect(normalizePlaguebringerResource({ virulence: 30, afflictions: 99 }).afflictions).toBe(PLAGUEBRINGER_AFFLICTION_MAX);
  expect(getPlaguebringerTier(0).name).toBe('Dormant');
  expect(getPlaguebringerTier(25).name).toBe('Sprouting');
  expect(getPlaguebringerTier(50).name).toBe('Blooming');
  expect(getPlaguebringerTier(100).name).toBe('Peak Harvest');
});

test('store routes virulence and afflictions independently', () => {
  const store = makeStore('Plaguebringer', { type: 'virulenceCultivation', virulence: 40, afflictions: 2, maxAfflictions: 10 });
  store.getState().gainClassResource(15, 'virulence');
  expect(store.getState().classResource).toMatchObject({ virulence: 55, afflictions: 2 });
  store.getState().consumeClassResource(20, 'virulence');
  expect(store.getState().classResource.virulence).toBe(35);
  store.getState().updateClassResource('afflictions', 5);
  expect(store.getState().classResource.afflictions).toBe(5);
  expect(getClassResourceValue(store.getState().classResource, 'Plaguebringer', 'afflictions')).toBe(5);
});

test('plans follow gain/cost and the shared router', () => {
  expect(getPlaguebringerSpellResourcePlan({ resourceCost: { classResource: { type: 'virulence', gain: 15 } } }, { virulence: 0 }, 'virulenceCultivation')).toMatchObject({ handled: true, gain: 15 });
  expect(getPlaguebringerSpellResourcePlan({ resourceCost: { classResource: { type: 'virulence', cost: 50 } } }, { virulence: 60 }, 'virulenceCultivation')).toMatchObject({ cost: 50, affordable: true });
  expect(getPlaguebringerSpellResourcePlan({ resourceCost: { classResource: { type: 'virulence', cost: 50 } } }, { virulence: 20 }, 'virulenceCultivation').affordable).toBe(false);
  expect(normalizeManagedClassResource({ type: 'virulence', current: 30 }, 'Plaguebringer').virulence).toBe(30);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'virulence', gain: 10 } } }, { type: 'virulenceCultivation', virulence: 5 }, 'Plaguebringer')).toMatchObject({ handled: true, id: 'virulenceCultivation' });
});
