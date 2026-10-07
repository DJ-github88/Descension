import {
  normalizeAnimistResource, getAnimistSpellResourcePlan,
  getAnimistStage, isAnimistSpiritErosion, ANIMIST_RESONANCE_MAX, ANIMIST_SPIRIT_EROSION
} from '../animistResourceContract';
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

test('normalization reads resonance aliases, clamps to 20 and flags erosion', () => {
  expect(normalizeAnimistResource({ current: 12 })).toMatchObject({ type: 'ancestralResonance', current: 12, max: ANIMIST_RESONANCE_MAX, spiritErosion: false });
  expect(normalizeAnimistResource({ resonance: 30 }).current).toBe(ANIMIST_RESONANCE_MAX);
  expect(normalizeAnimistResource({ ancestralResonance: 16 }).spiritErosion).toBe(true);
});

test('stage table separates dormant through spirit erosion', () => {
  expect(getAnimistStage(0).name).toBe('Dormant');
  expect(getAnimistStage(5).name).toBe('Harmonized');
  expect(getAnimistStage(10).name).toBe('Apex Harmonic');
  expect(getAnimistStage(15).name).toBe('Spirit Erosion');
  expect(isAnimistSpiritErosion(ANIMIST_SPIRIT_EROSION)).toBe(true);
});

test('store and plans treat negative cost as generation and positive as spend', () => {
  const store = makeStore('Animist', { type: 'ancestralResonance', current: 5, max: 20 });
  store.getState().gainClassResource(4);
  expect(store.getState().classResource).toMatchObject({ current: 9, spiritErosion: false });
  store.getState().consumeClassResource(3, 'resonance');
  expect(store.getState().classResource.current).toBe(6);
  store.getState().gainClassResource(100);
  expect(store.getState().classResource).toMatchObject({ current: 20, spiritErosion: true });
  expect(getAnimistSpellResourcePlan({ resourceCost: { classResource: { type: 'resonance', cost: -3 } } }, { current: 0 }, 'ancestralResonance')).toMatchObject({ cost: 0, gain: 3 });
  expect(getAnimistSpellResourcePlan({ resourceCost: { classResource: { type: 'resonance', cost: 6 } } }, { current: 10 }, 'ancestralResonance')).toMatchObject({ cost: 6, affordable: true });
  expect(normalizeManagedClassResource({ type: 'resonance', current: 12 }, 'Animist').current).toBe(12);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'resonance', cost: 6 } } }, { type: 'ancestralResonance', current: 10 }, 'Animist')).toMatchObject({ handled: true, id: 'ancestralResonance' });
});
