import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import useGameStore from '../../store/gameStore';
import { getStore, registerStore } from '../../store/storeRegistry';

const makeStore = (resource, className) => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource, stats: {}, level: 1,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

const runRest = (store, restType) => {
  const previousGame = useGameStore.getState();
  const previousStores = ['characterStore', 'partyStore', 'conditionStore'].map(key => [key, getStore(key)]);
  registerStore('characterStore', store);
  registerStore('partyStore', { getState: () => ({ partyMembers: [] }) });
  registerStore('conditionStore', { getState: () => ({ clearAllConditions: jest.fn() }) });
  try {
    if (restType === 'short') useGameStore.getState().takeShortRest();
    else useGameStore.getState().takeLongRest();
  } finally {
    previousStores.forEach(([key, previous]) => registerStore(key, previous));
    useGameStore.setState(previousGame, true);
  }
};

test('short rest vents combat build-up pools to zero without a generic recovery', () => {
  const cases = [
    ['Berserker', { type: 'bloodHeat', current: 60, max: 100 }, r => r.current],
    ['Harbinger', { type: 'mayhemGauge', current: 70, max: 100 }, r => r.current],
    ['Crusader', { type: 'radiantFervor', current: 40, max: 100 }, r => r.current],
    ['Animist', { type: 'ancestralResonance', current: 12, max: 20 }, r => r.current],
    ['False Prophet', { type: 'madnessPoints', current: 14, max: 20 }, r => r.current],
    ['Warden', { type: 'vengeance-points', current: 7, max: 10 }, r => r.current]
  ];
  cases.forEach(([className, resource, read]) => {
    const store = makeStore(resource, className);
    runRest(store, 'short');
    expect(read(store.getState().classResource)).toBe(0);
  });
});

test('short rest clears Plaguebringer Virulence but keeps its affliction count', () => {
  const store = makeStore({ type: 'virulenceCultivation', virulence: 60, afflictions: 3, maxAfflictions: 10 }, 'Plaguebringer');
  runRest(store, 'short');
  expect(store.getState().classResource).toMatchObject({ virulence: 0, afflictions: 3 });
});

test('short rest vents Augur pools with no Omen Debt and returns one Toxicologist Part', () => {
  const augur = makeStore({ benediction: 4, malediction: 6, maxBenediction: 10, maxMalediction: 10, specialization: 'auspex', omenDebt: 0 }, 'Augur');
  runRest(augur, 'short');
  expect(augur.getState().classResource).toMatchObject({ benediction: 0, malediction: 0, omenDebt: 0 });

  const tox = makeStore({ toxinVials: 5, toxinVialsMax: 7, contraptionParts: 2, contraptionPartsMax: 5 }, 'Toxicologist');
  runRest(tox, 'short');
  expect(tox.getState().classResource).toMatchObject({ toxinVials: 5, contraptionParts: 3 });
});

test('short rest preserves Chronarch Shards/Strain, the Lunarch phase and the finite Revenant anchor', () => {
  const chronarch = makeStore({ timeShards: { current: 5, max: 10 }, temporalStrain: { current: 3, max: 10 } }, 'Chronarch');
  runRest(chronarch, 'short');
  expect(chronarch.getState().classResource.timeShards.current).toBe(5);
  expect(chronarch.getState().classResource.temporalStrain.current).toBe(3);

  const lunarch = makeStore({ currentLunarPhase: 'full_moon', roundsInPhase: 2 }, 'Lunarch');
  runRest(lunarch, 'short');
  expect(lunarch.getState().classResource).toMatchObject({ currentPhase: 'full_moon', roundsInPhase: 2 });

  const revenant = makeStore({ toll: 8, phylacteryHP: 30, maxToll: 20, maxPhylacteryHP: 50 }, 'Revenant');
  runRest(revenant, 'short');
  expect(revenant.getState().classResource).toMatchObject({ toll: 8, phylacteryHP: 30 });
});

test('long rest refills Toxicologist pools and accrues Augur Omen Debt before clearing', () => {
  const tox = makeStore({ toxinVials: 2, toxinVialsMax: 7, contraptionParts: 1, contraptionPartsMax: 5 }, 'Toxicologist');
  runRest(tox, 'long');
  expect(tox.getState().classResource).toMatchObject({ toxinVials: 7, contraptionParts: 5 });

  const augur = makeStore({ benediction: 4, malediction: 6, maxBenediction: 10, maxMalediction: 10, specialization: 'auspex', omenDebt: 0 }, 'Augur');
  runRest(augur, 'long');
  expect(augur.getState().classResource).toMatchObject({ benediction: 0, malediction: 0, omenDebt: -10 });
});

test('long rest resets the other new pools through the managed normalizer', () => {
  const berserker = makeStore({ type: 'bloodHeat', current: 90, max: 100 }, 'Berserker');
  runRest(berserker, 'long');
  expect(berserker.getState().classResource).toMatchObject({ type: 'bloodHeat', current: 0, max: 100 });

  const chronarch = makeStore({ timeShards: { current: 8, max: 10 }, temporalStrain: { current: 9, max: 10 } }, 'Chronarch');
  runRest(chronarch, 'long');
  expect(chronarch.getState().classResource.timeShards.current).toBe(0);
  expect(chronarch.getState().classResource.temporalStrain.current).toBe(0);

  const warden = makeStore({ type: 'vengeance-points', current: 9, max: 10 }, 'Warden');
  runRest(warden, 'long');
  expect(warden.getState().classResource.current).toBe(0);

  const plague = makeStore({ type: 'virulenceCultivation', virulence: 80, afflictions: 2 }, 'Plaguebringer');
  runRest(plague, 'long');
  expect(plague.getState().classResource).toMatchObject({ virulence: 0 });
});
