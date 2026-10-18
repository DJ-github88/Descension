import {
  serializeSpell,
  deserializeSpell,
  createSpellTemplate,
  generateSpellFromTemplate
} from '../spellSerializer';
import { exportLibrary } from '../libraryManager';

jest.mock('../../../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: jest.fn(() => null),
  saveSpellLibraryData: jest.fn(),
  clearSpellLibraryDataScoped: jest.fn()
}));

const richConfig = () => ({
  id: 'fixture_rich',
  name: 'Rich Price Fixture',
  level: 3,
  spellType: 'ACTION',
  description: 'fixture with authored resource data',
  resourceCost: {
    actionPoints: 0,
    mana: 0,
    components: ['verbal', 'somatic'],
    materialComponents: 'a lock of hair',
    resourceTypes: ['mana', 'actionPoints', 'note_v', 'note_i', 'note_vi'],
    resourceValues: { mana: 0, actionPoints: 0, note_v: -2, note_i: -1, note_vi: -1 },
    resourceFormulas: { mana_formula: '2d6' },
    useFormulas: { mana: false },
    spheres: ['arcane', 'arcane', 'rime'],
    classResource: { type: 'fervor', gain: 10, cost: 3, state: 'rally' },
    secondaryCosts: [{ type: 'health', amount: 4 }],
    unknownExtension: { nested: { list: [1, 2, 3], flag: true } },
    classResourceProgram: { version: 99, steps: [{ op: 'gain', amount: 3 }] }
  }
});

const positiveConfig = () => ({
  id: 'fixture_positive',
  name: 'Positive Price Fixture',
  level: 2,
  resourceCost: {
    actionPoints: 1,
    mana: 4,
    notes: 'Soft',
    resourceValues: { mana: 4 }
  }
});

describe('spellSerializer resourceCost round-trip', () => {
  it('retains AP0/mana0 and AP0/mana4 exactly with their exact types', () => {
    const zero = deserializeSpell(serializeSpell(richConfig()));
    expect(zero.resourceCost).toEqual(richConfig().resourceCost);
    expect(zero.resourceCost.actionPoints).toBe(0);
    expect(zero.resourceCost.mana).toBe(0);

    const positive = positiveConfig();
    const survivor = deserializeSpell(serializeSpell(positive));
    expect(survivor.resourceCost).toEqual(positive.resourceCost);
    expect(survivor.resourceCost.actionPoints).toBe(1);
    expect(survivor.resourceCost.mana).toBe(4);
  });

  it('preserves sphere multiset multiplicity and order', () => {
    const roundTrip = deserializeSpell(serializeSpell(richConfig()));
    expect(roundTrip.resourceCost.spheres).toEqual(['arcane', 'arcane', 'rime']);
  });

  it('preserves seven-note counts and signed legacy note values exactly', () => {
    const roundTrip = deserializeSpell(serializeSpell(richConfig()));
    expect(roundTrip.resourceCost.resourceValues.note_v).toBe(-2);
    expect(roundTrip.resourceCost.resourceValues.note_i).toBe(-1);
    expect(roundTrip.resourceCost.resourceValues.note_vi).toBe(-1);
    expect(roundTrip.resourceCost.resourceTypes).toEqual(
      ['mana', 'actionPoints', 'note_v', 'note_i', 'note_vi']
    );
  });

  it('preserves class cost/gain/secondary objects, materials and formulas', () => {
    const roundTrip = deserializeSpell(serializeSpell(richConfig()));
    expect(roundTrip.resourceCost.classResource).toEqual({ type: 'fervor', gain: 10, cost: 3, state: 'rally' });
    expect(roundTrip.resourceCost.secondaryCosts).toEqual([{ type: 'health', amount: 4 }]);
    expect(roundTrip.resourceCost.materialComponents).toBe('a lock of hair');
    expect(roundTrip.resourceCost.resourceFormulas).toEqual({ mana_formula: '2d6' });
  });

  it('preserves unknown resource extensions and unknown-version programs as inert data', () => {
    const roundTrip = deserializeSpell(serializeSpell(richConfig()));
    expect(roundTrip.resourceCost.unknownExtension).toEqual({
      nested: { list: [1, 2, 3], flag: true }
    });
    expect(roundTrip.resourceCost.classResourceProgram).toEqual({
      version: 99,
      steps: [{ op: 'gain', amount: 3 }]
    });
  });

  it('keeps absent, empty and null resourceCost distinct', () => {
    const absent = positiveConfig();
    delete absent.resourceCost;
    const absentRoundTrip = deserializeSpell(serializeSpell(absent));
    expect('resourceCost' in absentRoundTrip).toBe(false);

    const empty = positiveConfig();
    empty.resourceCost = {};
    expect(deserializeSpell(serializeSpell(empty)).resourceCost).toEqual({});

    const nulled = positiveConfig();
    nulled.resourceCost = null;
    expect(deserializeSpell(serializeSpell(nulled)).resourceCost).toBeNull();
  });

  it('is stable across two cycles and never mutates its input', () => {
    const config = richConfig();
    const snapshot = JSON.parse(JSON.stringify(config));

    const first = serializeSpell(config);
    const second = serializeSpell(config);

    expect(second).toBe(first);
    expect(deserializeSpell(second).resourceCost).toEqual(snapshot.resourceCost);
    expect(config).toEqual(snapshot);
  });

  it('keeps the price in createSpellTemplate while adding template metadata', () => {
    const config = richConfig();
    const template = createSpellTemplate(config, 'rich-template');

    expect(template.resourceCost).toEqual(config.resourceCost);
    expect(template._isTemplate).toBe(true);
    expect(template._templateName).toBe('rich-template');
    expect(config._isTemplate).toBeUndefined();
  });

  it('keeps the price through template instantiation, including a serialized template string', () => {
    const config = richConfig();
    const template = createSpellTemplate(config, 'rich-template');

    const instance = generateSpellFromTemplate(template, {});
    expect(instance.resourceCost).toEqual(config.resourceCost);
    expect(instance._isTemplate).toBeUndefined();
    expect(instance._templateName).toBeUndefined();
    expect(instance._dateCreated).toBeUndefined();
    expect(instance._parameterOptions).toBeUndefined();
    expect(instance.name).toBe('Rich Price Fixture');

    const fromString = generateSpellFromTemplate(JSON.stringify(template), {});
    expect(fromString.resourceCost).toEqual(config.resourceCost);
  });

  it('applies a dotted AP change only to the new instance without mutating template or original', () => {
    const original = positiveConfig();
    const template = createSpellTemplate(original, 'positive-template');
    const templateSnapshot = JSON.parse(JSON.stringify(template));
    const originalSnapshot = JSON.parse(JSON.stringify(original));

    const instance = generateSpellFromTemplate(template, {
      'resourceCost.actionPoints': 0,
      'resourceCost.notes': 'Soft zero'
    });

    expect(instance.resourceCost.actionPoints).toBe(0);
    expect(instance.resourceCost.notes).toBe('Soft zero');
    expect(template).toEqual(templateSnapshot);
    expect(original).toEqual(originalSnapshot);
    expect(instance.resourceCost).not.toBe(template.resourceCost);

    const secondInstance = generateSpellFromTemplate(template, {});
    expect(secondInstance.resourceCost.actionPoints).toBe(1);
    expect(secondInstance.resourceCost.notes).toBe('Soft');
  });

  it('retains whole-object replacement semantics for explicit resourceCost modifications', () => {
    const template = createSpellTemplate(positiveConfig(), 'replace-template');
    const replaced = generateSpellFromTemplate(template, { resourceCost: { actionPoints: 3 } });

    expect(replaced.resourceCost).toEqual({ actionPoints: 3 });
    expect('mana' in replaced.resourceCost).toBe(false);
  });

  it('keeps top-level private-field cleanup without recursive stripping', () => {
    const config = positiveConfig();
    config._draft = true;
    config.resourceCost._legacyNote = 'kept';

    const roundTrip = deserializeSpell(serializeSpell(config));
    expect('_draft' in roundTrip).toBe(false);
    expect(roundTrip.resourceCost._legacyNote).toBe('kept');
  });

  it('retains the outer record price through the Review secondary serializedData path', () => {
    const spellState = {
      ...richConfig(),
      resourceCost: { ...richConfig().resourceCost, actionPoints: 0, mana: 4 }
    };

    const serializedData = serializeSpell(spellState);
    const parsedSecondary = deserializeSpell(serializedData);

    expect(parsedSecondary.resourceCost).toEqual(spellState.resourceCost);
  });

  it('raw-library JSON export keeps the authored price as a positive control', () => {
    const config = richConfig();
    const library = {
      spells: [{ id: 's1', name: 'Keeper', resourceCost: config.resourceCost }]
    };

    const exportJson = exportLibrary(library, 'json');
    const parsedExport = JSON.parse(exportJson);

    expect(parsedExport.data.spells[0].resourceCost).toEqual(config.resourceCost);
    expect(exportJson).toContain('"actionPoints": 0');
  });
});
