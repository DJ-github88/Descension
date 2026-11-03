import React from 'react';
import { render as renderReact, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { summon, dmg, heal, buff, ctrl, util, transform } from '../../data/creatureAbilityBuilders';
import { transformAbilityToSpell } from '../creatureAbilityUtils';
import UnifiedSpellCard from '../../components/spellcrafting-wizard/components/common/UnifiedSpellCard';
import { normalizeCreatureForWizard } from '../../components/creature-wizard/CreatureWizardApp';
import useCreatureStore from '../../store/creatureStore';
import { SpellLibraryStateContext } from '../../components/spellcrafting-wizard/context/SpellLibraryContext';

// Only unrelated book/preview surfaces and icon assets are replaced. Builder,
// creature reopen/store, adapter and card are production implementations.
jest.mock('../../components/books/BookTtrpgBlocks', () => ({ normalizeDangerLevel: () => 'Medium', CREATURE_PRESETS: [] }));
jest.mock('../../components/creature-wizard/components/common/ExternalCreaturePreview', () => () => null);
jest.mock('../assetManager', () => ({
  getIconUrl: () => 'test-icon.png', getAbilityIconUrl: () => 'test-icon.png', getCustomIconUrl: () => 'test-icon.png'
}));

const clone = value => JSON.parse(JSON.stringify(value));
const render = ui => renderReact(<SpellLibraryStateContext.Provider value={{ spells: [], getSpellById: () => null }}>{ui}</SpellLibraryStateContext.Provider>);
const freeze = value => {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
const modern = () => summon({
  id: 'fixture-call', name: 'Fixture Call', creatureName: 'Fixture Spirit Wolf',
  quantity: 2, maxQuantity: 4, quantityFormula: '1d4', duration: 7,
  hpFormula: '3d6 + 7', attackFormula: '2d6 + 1', commandable: false,
  abilities: ['Manual tracking'], difficulty: 'hard', ap: 0, range: 0
});
const rich = () => ({
  ...modern().summoningConfig,
  creatures: [{
    id: 'fixture-wolf', name: 'Fixture Spirit Wolf', size: 'Medium', type: 'Spirit',
    description: 'GM adjudicates this summon manually.', stats: { maxHp: 31, maxMana: 0, maxAp: 5 },
    config: { quantity: 2, hasDuration: false, concentration: false, controlType: 'mental', controlRange: 0, attachedEffects: {} }
  }],
  hasDuration: false, concentration: false, controlRange: 0, controlType: '',
  manualExtension: { note: '', enabled: false, count: 0, options: [] }
});
const fixtures = () => {
  const built = modern();
  const { summoningConfig, ...base } = built;
  return {
    builder: built,
    rich: { ...base, summoningConfig: rich() },
    legacy: { ...base, summonConfig: rich() },
    dual: { ...base, summoningConfig: rich(), summonConfig: { ...summoningConfig, creatureName: 'Fixture Stale Golem' } },
    empty: { ...base, summoningConfig: {}, summonConfig: { creatureName: 'Fixture Stale Golem' } }
  };
};

afterEach(() => { cleanup(); useCreatureStore.setState({ creatures: [] }); });

describe.each(['builder', 'rich', 'legacy', 'dual', 'empty'])('creature summon definition: %s', kind => {
  test('store/reopen then conversion preserves whole definitions, aliases, manual fields and repeated no-op conversion', () => {
    const source = freeze({ ...fixtures()[kind], manualMechanics: { executable: false, notes: '', extra: [] }, custom: { zero: 0, off: false } });
    const before = clone(source);
    useCreatureStore.getState().addCreature({ id: 'fixture-creature', name: 'Fixture Creature', abilities: [source] });
    const reopened = normalizeCreatureForWizard(useCreatureStore.getState().getCreature('fixture-creature'));
    expect(reopened.abilities).toEqual([before]);
    const saved = freeze(reopened.abilities[0]);
    const first = transformAbilityToSpell(saved);
    expect(first).toMatchObject(before);
    expect(first.summoningConfig).toEqual(before.summoningConfig);
    expect(first.summonConfig).toEqual(before.summonConfig);
    expect(first.resourceCost.actionPoints).toBe(0);
    expect(first.targetingConfig.rangeDistance).toBe(0);
    const second = transformAbilityToSpell(freeze(first));
    expect(second).toEqual(first);
    expect(transformAbilityToSpell(second)).toEqual(first);
    expect(source).toEqual(before);
    expect(saved).toEqual(before);
    expect(first).not.toBe(saved);
  });
});

describe.each(['builder', 'rich', 'legacy', 'dual'])('real creature card: %s', kind => {
  test('displays the canonical definition (legacy fallback) without a cast control', () => {
    const source = freeze(fixtures()[kind]);
    const before = clone(source);
    render(<UnifiedSpellCard spell={transformAbilityToSpell(source)} variant="wizard" showActions={false} showDescription showStats />);
    expect(screen.getByText(/Summon Fixture Spirit Wolf/)).toBeInTheDocument();
    expect(screen.queryByText(/Fixture Stale Golem/)).not.toBeInTheDocument();
    if (kind !== 'builder') {
      expect(screen.getByText(/Permanent.*Mental Link \(Unlimited\)/)).toBeInTheDocument();
      expect(screen.getByText(/GM adjudicates this summon manually/)).toBeInTheDocument();
    }
    expect(screen.queryByRole('button', { name: /cast|execute|spawn/i })).not.toBeInTheDocument();
    expect(source).toEqual(before);
  });
});

test('an explicitly empty canonical config wins without deleting the alternate payload', () => {
  const source = fixtures().empty;
  const converted = transformAbilityToSpell(source);
  render(<UnifiedSpellCard spell={converted} variant="wizard" showActions={false} />);
  expect(screen.getByText('Effect details not configured')).toBeInTheDocument();
  expect(screen.queryByText(/Fixture Stale Golem/)).not.toBeInTheDocument();
  expect(converted.summonConfig).toEqual(source.summonConfig);
});

test.each([['damage', dmg], ['healing', heal], ['buff', buff], ['control', ctrl], ['utility', util], ['transformation', transform]])(
  'representative %s builder keeps existing effects, targeting and prices', (kind, build) => {
    const source = freeze(build({ id: `fixture-${kind}`, name: `Fixture ${kind}`, formula: '2d6', duration: 3, ap: 2, range: 20 }));
    const converted = transformAbilityToSpell(source);
    expect(converted.effectTypes).toEqual(source.effectTypes);
    expect(converted[`${kind}Config`]).toEqual(source[`${kind}Config`]);
    expect(converted.targetingConfig).toEqual(source.targetingConfig);
    expect(converted.resourceCost).toEqual(source.resourceCost);
    expect(transformAbilityToSpell(converted)).toEqual(converted);
  }
);

test('legacy damage mapping remains stable and unsupported manual fields survive', () => {
  const source = freeze({ name: 'Claw', type: 'melee', actionPointCost: 1, range: 5,
    description: 'GM adjudicates the unknown rider manually.',
    damage: { diceCount: 2, diceType: 6, bonus: 2, damageType: 'slashing' },
    manualMechanics: { executable: false, unknownRider: { count: 0, enabled: false } } });
  const result = transformAbilityToSpell(source);
  expect(result.damageConfig.formula).toBe('2d6+2');
  expect(result.resourceCost).toEqual({ actionPoints: 1 });
  expect(result.range).toBe(5);
  expect(result.manualMechanics).toEqual(source.manualMechanics);
  render(<UnifiedSpellCard spell={result} variant="wizard" showActions={false} showDescription />);
  expect(screen.getByText(source.description)).toBeInTheDocument();
});
