import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import UnifiedSpellCard from '../UnifiedSpellCard';
import { saveDisclosureForRecord } from '../spellSavePresentation';
import { definitionFromWizard } from '../../../../../services/authoredAbility';
import { TYPE as CD_TYPE } from '../../../../../services/authoredCooldown';
import { draftSubject } from '../../../utils/executionCompatibility';
import { manualText, saveLabel } from '../../../../../services/saveBranch';

jest.mock('../../../../../store/characterStore', () => ({ __esModule: true, default: selector => selector({ currentCharacter: { stats: { intelligence: 18 } } }) }));
jest.mock('../../../context/SpellLibraryContext', () => ({ useSpellLibrary: () => ({ getSpellById: () => null, dispatch: jest.fn() }), useSpellLibraryDispatch: () => jest.fn() }));
jest.mock('../../../../../utils/assetManager', () => ({ getIconUrl: i => `m/${i}.png`, getAbilityIconUrl: i => `m/${i}.png`, getCustomIconUrl: i => `m/${i}.png` }));
jest.mock('../SpellTooltip', () => () => <div />);
jest.mock('../../../../../services/effectProcessingService', () => ({ processOverTimeEffectsForTarget: jest.fn() }));

const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
const cond = {
  periodic: { profile: 'authored-effect:v1', effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Cinder Brand', expiryPolicy: 'target-start-count', occurrences: 3, durationText: 'While the cinders glow', gmNote: 'g' },
  movement: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Hobbled', expiryPolicy: 'target-next-end', durationText: 'Until the embers cool', gmNote: 'g' },
  stunnedTimed: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'target-next-end', durationText: 'Until end of turn', gmNote: 'g' },
  stunnedManual: { profile: 'authored-effect:v1', effect: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until shaken off', gmNote: 'g' },
  attribute: { profile: 'authored-effect:v1', effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden', expiryPolicy: 'target-next-end', durationText: 'Until the lead cools', gmNote: 'g' }
};

const spell = ({ kind, formula = '1d6+2', save, cd, noDirect, directType = 'damage', change }) => {
  const fields = {
    name: `Disposable ${kind}`, description: 'd', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: noDirect ? ['control'] : [directType, 'control'],
    controlConfig: { authoredCondition: { ...cond[kind], ...(save ? { save } : {}) } },
    ...(noDirect ? {} : directType === 'damage'
      ? { damageConfig: { damageType: 'direct', elementType: 'rime', formula, resolution: 'DICE' } }
      : { healingConfig: { healingType: 'direct', formula, resolution: 'DICE' } }),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { actionPoints: 1, mana: 2 },
    ...(cd ? { cooldownConfig: { cooldownType: CD_TYPE, cooldownValue: cd } } : {})
  };
  if (change) change(fields);
  return fields;
};

const wrap = draft => ({
  ...JSON.parse(JSON.stringify(draft)),
  authoredDefinitionId: '70000000-0000-4000-8000-0000000000d6',
  authoredDraft: JSON.parse(JSON.stringify(draft))
});

const renderCard = (fields, { attach = true, record } = {}) => {
  const stored = record || wrap(fields);
  if (attach) stored.authoredSaveDisclosure = saveDisclosureForRecord(stored);
  return render(
    <UnifiedSpellCard spell={{ ...JSON.parse(JSON.stringify(stored)), id: 'x' }} variant="wizard" showDescription showStats />
  );
};

const compiledSave = fields => {
  const result = definitionFromWizard(wrap(fields), { roomId: 'r', classId: 'arcanoneer', definitionVersion: 1 });
  expect(result.ok).toBe(true);
  return result.definition.effects.save;
};

describe('Saved spell card discloses the executable rider-local save', () => {
  test('plain immediate part + saved rider shows ability, DC, rider-local negates and the GM-recorded procedure', () => {
    const fields = spell({ kind: 'stunnedTimed', save: SAVE });
    const save = compiledSave(fields);
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(saveLabel(save)).toBe('Constitution DC 12');
    expect(text).toContain(`Save: ${manualText(save)}`);
    expect(text).toMatch(/The table rolls the Constitution DC 12 save/);
    expect(text).toMatch(/the GM records saved or failed/);
    expect(text).toMatch(/does not roll, calculate or validate the save/);
    expect(text).toMatch(/only the rider "Canonical Stunned" is negated/);
    expect(text).toMatch(/the direct damage part still applies on both outcomes/);
  });

  test('a raw saved record with authoredDraft discloses without a precomputed map marker', () => {
    const fields = spell({ kind: 'stunnedTimed', save: SAVE });
    const { container } = renderCard(fields, { attach: false });
    expect(container.textContent).toMatch(/Save: The table rolls the Constitution DC 12 save/);
  });

  test('the Review draft subject and a realistic saved record agree on the executable verdict', () => {
    const fields = spell({ kind: 'stunnedTimed', save: SAVE });
    const reviewState = {
      ...JSON.parse(JSON.stringify(fields)),
      editMode: false,
      editingSpellId: null,
      categoryIds: [],
      source: 'library'
    };
    expect(saveDisclosureForRecord(draftSubject(reviewState)).executable).toBe(true);

    const record = wrap(fields);
    const damageConfig = {
      ...record.damageConfig,
      canCrit: false,
      criticalConfig: { enabled: false },
      chanceOnHitConfig: { enabled: false },
      savingThrow: null,
      partialEffect: false
    };
    record.durationConfig = {};
    record.damageConfig = damageConfig;
    record.authoredDraft.durationConfig = {};
    record.authoredDraft.damageConfig = JSON.parse(JSON.stringify(damageConfig));
    expect(saveDisclosureForRecord(record).executable).toBe(true);
  });

  test('attribute-scaled immediate part + saved rider keeps the scaled damage and the same save contract', () => {
    const fields = spell({ kind: 'movement', formula: '2d6 + intelligence/3', save: SAVE });
    const save = compiledSave(fields);
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).toMatch(/2d6 \+ Intelligence \/ 3/);
    expect(text).toContain(`Save: ${manualText(save)}`);
    expect(text).toMatch(/only the rider "Hobbled" is negated/);
    expect(text).toMatch(/the direct damage part still applies on both outcomes/);
  });

  test('attribute rider + saved rider is executable on the installed plain-direct route', () => {
    const fields = spell({ kind: 'attribute', save: SAVE });
    const save = compiledSave(fields);
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).toContain(`Save: ${manualText(save)}`);
    expect(text).toMatch(/only the rider "Leaden" is negated/);
    expect(text).toMatch(/the direct damage part still applies on both outcomes/);
  });

  test('healing direct part names healing, not damage, on the same save contract', () => {
    const fields = spell({ kind: 'movement', save: SAVE, directType: 'healing' });
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).toMatch(/Save: The table rolls the Constitution DC 12 save/);
    expect(text).toMatch(/the direct healing part still applies on both outcomes/);
  });

  test('timed saved rider keeps expiry wording separate from the save wording', () => {
    const fields = spell({ kind: 'movement', save: SAVE });
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).toMatch(/expires at the end of the target's next turn/);
    expect(text).toMatch(/Save: The table rolls the Constitution DC 12 save/);
    expect(text).not.toMatch(/GM manages timing/);
    expect(text).not.toMatch(/GM removes/);
  });

  test('saved rider + authenticated cooldown keeps the cooldown line separate', () => {
    const fields = spell({ kind: 'stunnedTimed', save: SAVE, cd: 3 });
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).toMatch(/3 strictly upcoming caster-turn starts until reuse/);
    expect(text).toMatch(/Save: The table rolls the Constitution DC 12 save/);
    expect(text).toMatch(/only the rider "Canonical Stunned" is negated/);
  });

  test('a manual-expiry saved rider still says the GM removes the effect, next to the save line', () => {
    const fields = spell({ kind: 'stunnedManual', save: SAVE });
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).toMatch(/Stunned · GM removes/);
    expect(text).toMatch(/Save: The table rolls the Constitution DC 12 save/);
  });
});

describe('Unsupported save shapes stay honestly labelled as manual', () => {
  const expectManual = text => {
    expect(text).toMatch(/Saving throw \(Constitution DC 12\): manual only/);
    expect(text).toMatch(/Prism cannot run this save shape as authored/);
    expect(text).not.toMatch(/Save: The table rolls/);
  };

  test('a save on a periodic rider is manual, never described as executable', () => {
    const { container } = renderCard(spell({ kind: 'periodic', save: SAVE, noDirect: true }));
    expectManual(container.textContent);
  });

  test('a save on the direct part stays legacy/manual and does not become an executable rider save', () => {
    const fields = spell({ kind: 'stunnedTimed', save: SAVE, change: draft => {
      draft.damageConfig.savingThrowConfig = { enabled: true, savingThrowType: 'spirit', difficultyClass: 12 };
    } });
    expectManual(renderCard(fields).container.textContent);
  });

  test('an invalid or partial save outcome is manual, not executable', () => {
    const fields = spell({ kind: 'movement', save: { ability: 'constitution', dc: 12, outcome: 'halves' } });
    expectManual(renderCard(fields).container.textContent);
  });

  test('a rider-only save (no direct part) is manual', () => {
    const fields = spell({ kind: 'movement', save: SAVE, noDirect: true });
    expectManual(renderCard(fields).container.textContent);
  });

  test('attribute rider + save + authenticated cooldown stays manual', () => {
    const fields = spell({ kind: 'attribute', save: SAVE, cd: 2 });
    const text = renderCard(fields).container.textContent;
    expectManual(text);
    expect(text).toMatch(/2 strictly upcoming caster-turn starts until reuse/);
  });

  test('attribute rider + save + attribute-scaled direct part stays manual', () => {
    const fields = spell({ kind: 'attribute', save: SAVE, formula: '2d6 + intelligence/3' });
    expectManual(renderCard(fields).container.textContent);
  });

  test('mixed control configuration next to the save stays manual', () => {
    const fields = spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.controlConfig.savingThrow = { ability: 'spirit', difficultyClass: 12 };
    } });
    expectManual(renderCard(fields).container.textContent);
  });

  test('self-target or zero-range shapes do not print the executable save sentence', () => {
    const fields = spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.targetingConfig.targetRestrictions = ['self'];
      draft.targetingConfig.rangeDistance = 0;
    } });
    expectManual(renderCard(fields).container.textContent);
  });

  test('a legacy cooldown configuration does not print the executable save sentence', () => {
    const fields = spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.cooldownConfig = { cooldownType: 'turn_based', cooldownValue: 2 };
    } });
    expectManual(renderCard(fields).container.textContent);
  });

  test.each([
    ['missing-health formula', spell({ kind: 'movement', formula: '2d6 + caster_missing_health/4', save: SAVE })],
    ['invalid formula', spell({ kind: 'movement', formula: '1d6 + foo', save: SAVE })],
    ['DoT direct part', spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.damageConfig.damageType = 'dot';
      draft.damageConfig.hasDotEffect = true;
    } })],
    ['HoT direct part', spell({ kind: 'movement', save: SAVE, directType: 'healing', change: draft => {
      draft.healingConfig.healingType = 'hot';
      draft.healingConfig.hasHotEffect = true;
    } })],
    ['manual resolution', spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.damageConfig.resolution = 'MANUAL';
    } })],
    ['critical direct part', spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.damageConfig.canCrit = true;
    } })],
    ['savingThrowConfig false', spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.damageConfig.savingThrowConfig = false;
    } })]
  ])('%s never becomes an executable rider save', (_name, fields) => {
    expectManual(renderCard(fields).container.textContent);
  });

  test.each([
    ['unknown manual field', spell({ kind: 'movement', save: SAVE, change: draft => { draft.unrelatedManualSection = { note: 'table rule' }; } })],
    ['catalogue source', spell({ kind: 'movement', save: SAVE, change: draft => { draft.catalogueSource = { record: {}, spellId: 's', classId: 'arcanoneer', recordHash: '0'.repeat(64) }; } })],
    ['class payment', spell({ kind: 'movement', save: SAVE, change: draft => { draft.classPayment = { domain: 'rage' }; } })],
    ['retained damage config without the damage effect type', spell({ kind: 'movement', save: SAVE, change: draft => { draft.effectTypes = ['control']; } })],
    ['missing resolution', spell({ kind: 'movement', save: SAVE, change: draft => { delete draft.damageConfig.resolution; } })],
    ['missing spell type', spell({ kind: 'movement', save: SAVE, change: draft => { delete draft.spellType; } })]
  ])('%s does not become an executable rider save', (_name, fields) => {
    expectManual(renderCard(fields).container.textContent);
  });

  test('stale serializedData is refused by the same compiler subject the Review uses', () => {
    const fields = spell({ kind: 'movement', save: SAVE });
    const record = wrap(fields);
    record.serializedData = JSON.stringify({ ...JSON.parse(JSON.stringify(fields)), name: 'Stale old name' });
    expectManual(renderCard(fields, { record }).container.textContent);
  });

  test('an empty retained savingThrowConfig is inert, matching the compiler', () => {
    const fields = spell({ kind: 'movement', save: SAVE, change: draft => {
      draft.damageConfig.savingThrowConfig = {};
    } });
    const text = renderCard(fields).container.textContent;
    expect(text).toMatch(/Save: The table rolls the Constitution DC 12 save/);
  });
});

describe('Presentation safety, privacy and narrow layout', () => {
  test('save disclosure reuses the wrapping mechanics class and the narrow CSS contract', () => {
    const { container } = renderCard(spell({ kind: 'stunnedTimed', save: SAVE }));
    const node = container.querySelector('.healing-effect-save .healing-effect-mechanics');
    expect(node).toBeInTheDocument();
    expect(node.textContent).toMatch(/^Save: /);

    const css = fs.readFileSync(path.join(process.cwd(), 'src/components/spellcrafting-wizard/styles/pathfinder/components/spell-card-enhancements.css'), 'utf8');
    expect(css).toMatch(/\.damage-effect-description,\s*\.healing-effect-description,\s*\.damage-effect-mechanics,\s*\.healing-effect-mechanics\s*\{[^}]*overflow-wrap:\s*break-word/);
  });

  test('GM notes and unknown manual fields are not rendered, and the supplied record is not mutated', () => {
    const fields = spell({ kind: 'stunnedTimed', save: SAVE, change: draft => {
      draft.controlConfig.authoredCondition.gmNote = 'secret gm note';
      draft.unrelatedManualSection = { note: 'private table rule' };
    } });
    const before = JSON.stringify(fields);
    const { container } = renderCard(fields);
    const text = container.textContent;

    expect(text).not.toMatch(/secret gm note/);
    expect(text).not.toMatch(/private table rule/);
    expect(JSON.stringify(fields)).toBe(before);
  });
});
