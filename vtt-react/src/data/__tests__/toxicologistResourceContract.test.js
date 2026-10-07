import {
  normalizeToxicologistResource, getToxicologistSpellResourcePlan,
  getToxicologistPoolValue, TOXICOLOGIST_PARTS_MAX
} from '../toxicologistResourceContract';
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

test('normalization respects the INT-based vial capacity and the parts cap', () => {
  const r = normalizeToxicologistResource({ toxinVials: 99, toxinVialsMax: 7, contraptionParts: 99, contraptionPartsMax: 5 });
  expect(r).toMatchObject({ type: 'toxinVialsContraptions', toxinVials: 7, maxVials: 7, contraptionParts: 5, contraptionPartsMax: TOXICOLOGIST_PARTS_MAX });
  expect(normalizeToxicologistResource({ toxinVials: 3 }).toxinVials).toBe(3);
  expect(normalizeToxicologistResource({ toxinVials: 3 }).maxVials).toBeGreaterThanOrEqual(4);
});

test('store routes vials and contraption parts independently', () => {
  const store = makeStore('Toxicologist', { type: 'toxinVialsContraptions', toxinVials: 4, toxinVialsMax: 7, contraptionParts: 3, contraptionPartsMax: 5 });
  store.getState().gainClassResource(2, 'vials');
  expect(store.getState().classResource.toxinVials).toBe(6);
  store.getState().consumeClassResource(3, 'vials');
  expect(store.getState().classResource.toxinVials).toBe(3);
  store.getState().consumeClassResource(2, 'contraption_parts');
  expect(store.getState().classResource.contraptionParts).toBe(1);
  expect(getClassResourceValue(store.getState().classResource, 'Toxicologist', 'contraption_parts')).toBe(1);
  expect(getToxicologistPoolValue(store.getState().classResource, 'vials')).toBe(3);
});

test('plans bind vials and contraption parts and the router resolves them', () => {
  expect(getToxicologistSpellResourcePlan({ resourceCost: { classResource: { type: 'vials', cost: 2 } } }, { toxinVials: 4, toxinVialsMax: 7 }, 'toxinVialsContraptions'))
    .toMatchObject({ handled: true, pool: 'vials', cost: 2, affordable: true });
  expect(getToxicologistSpellResourcePlan({ resourceCost: { classResource: { type: 'contraption_parts', cost: 4 } } }, { toxinVials: 4, contraptionParts: 1, contraptionPartsMax: 5 }, 'toxinVialsContraptions'))
    .toMatchObject({ handled: true, pool: 'parts', cost: 4, affordable: false });
  expect(normalizeManagedClassResource({ toxinVials: 5, contraptionParts: 2 }, 'Toxicologist')).toMatchObject({ toxinVials: 5, contraptionParts: 2 });
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'vials', cost: 3 } } }, { toxinVials: 5, toxinVialsMax: 7 }, 'Toxicologist')).toMatchObject({ handled: true, id: 'toxinVialsContraptions' });
});
