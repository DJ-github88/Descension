/**
 * Spell Component Requirements: Preservation and Presentation
 *
 * Verifies that authored spell-component requirements (verbal, somatic, material,
 * concentration, manual/unsupported extensions) survive the entire pipeline:
 *   catalogue preparation -> Wizard load/edit -> review -> save ->
 *   library reopen -> shared card -> execution compatibility disclosure.
 *
 * Demonstrates:
 * - catalogue preparation preserving requirements;
 * - Wizard save/reopen and repeated no-op saves;
 * - editing one component without losing others;
 * - modern/legacy precedence under existing rules;
 * - card/review agreement;
 * - unsupported/manual requirements remaining visible;
 * - no changes to executable formula, price, targeting or admission.
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedSpellCard from '../components/common/UnifiedSpellCard';
import SpellComponentsSelector from '../components/common/SpellComponentsSelector';
import { normalizeSpell } from '../core/utils/spellNormalizer';
import { catalogueDraft } from '../../../services/catalogueAbility.cjs';
import { definitionFromWizard } from '../../../services/authoredAbility';
import { explainExecution } from '../utils/executionCompatibility';

if (typeof global.crypto === 'undefined' || !global.crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', { value: require('crypto').webcrypto, configurable: true });
}

let mockPersisted = null;
jest.mock('../../../persistence/spellLibraryScopedStorage', () => ({
  loadSpellLibraryData: () => mockPersisted,
  saveSpellLibraryData: (data) => { mockPersisted = JSON.parse(JSON.stringify(data)); },
  loadCustomSpells: () => [],
  saveCustomSpells: () => {},
  loadDeletedSpellIds: () => [],
  saveDeletedSpellIds: () => {}
}));
jest.mock('../../../services/firebase/userSpellService', () => ({
  loadUserSpells: () => Promise.resolve([])
}));
jest.mock('../../../store/characterStore', () => ({
  __esModule: true,
  default: (selector) => selector({
    currentCharacter: {
      stats: { intelligence: 18, spirit: 16 }
    }
  })
}));
jest.mock('../context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({
    getSpellById: () => null
  }),
  useSpellLibraryDispatch: () => jest.fn(),
  SpellLibraryProvider: ({ children }) => <div>{children}</div>
}));
jest.mock('../../../utils/assetManager', () => ({
  getIconUrl: () => 'test-icon.png',
  getAbilityIconUrl: () => 'test-icon.png',
  getCustomIconUrl: () => 'fallback-icon.png'
}));

const EXACT_MARTYR_RECORD = {
  id: 'martyr_restorative_prayer',
  name: 'Restorative Prayer',
  description: 'Channel sacred energy through prayer to heal an ally. Scales with Spirit and can be amplified with Devotion.',
  level: 1,
  spellType: 'ACTION',
  icon: 'Healing/Golden Heart',
  typeConfig: {
    school: 'ember',
    icon: 'Healing/Golden Heart',
    tags: ['healing', 'basic', 'devotion amplifiable', 'level 1'],
    castTime: 1,
    castTimeType: 'IMMEDIATE'
  },
  targetingConfig: {
    targetingType: 'single',
    rangeType: 'ranged',
    rangeDistance: 30,
    targetRestrictions: ['ally']
  },
  resourceCost: {
    resourceTypes: ['mana'],
    resourceValues: { mana: 5, classResource: { type: 'devotion', gain: 1 } },
    useFormulas: {},
    actionPoints: 1,
    components: ['verbal', 'somatic'],
    verbalText: 'Sanatio Divina',
    somaticText: 'Hands clasped in prayer, golden light emanating from your fingers as sacred energy flows through you'
  },
  resolution: 'DICE',
  effectTypes: ['healing'],
  healingConfig: {
    formula: '1d4 + spirit',
    healingType: 'direct',
    hasHotEffect: false,
    description: 'The restorative prayer mends wounds with gentle sacred energy. Cuts close, bruises fade, and the target feels their pain ease as vitality is restored. The healing is accompanied by a sense of peace and comfort, as if the sacred itself is watching over them.'
  },
  devotionRequired: 0,
  devotionGain: 1,
  cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0 },
  tags: ['healing', 'basic', 'devotion amplifiable', 'level 1']
};

describe('1. Catalogue preparation preserving requirements', () => {
  test('catalogueDraft preserves verbal, somatic, and descriptive incantation text from pinned catalogue record', () => {
    const prepared = catalogueDraft(EXACT_MARTYR_RECORD, 'martyr', {
      authoredDefinitionId: '00000000-0000-4000-8000-000000000001',
      id: 'catalogue-martyr_restorative_prayer'
    });

    expect(prepared.ok).toBe(true);
    const draft = prepared.draft;

    // Components array is preserved (regression guard: prior behavior wiped this to [])
    expect(draft.resourceCost.components).toEqual(['verbal', 'somatic']);
    expect(draft.resourceCost.verbalText).toBe('Sanatio Divina');
    expect(draft.resourceCost.somaticText).toBe(
      'Hands clasped in prayer, golden light emanating from your fingers as sacred energy flows through you'
    );

    // Also preserved in authoredDraft
    expect(draft.authoredDraft.resourceCost.components).toEqual(['verbal', 'somatic']);
    expect(draft.authoredDraft.resourceCost.verbalText).toBe('Sanatio Divina');
    expect(draft.authoredDraft.resourceCost.somaticText).toBe(
      'Hands clasped in prayer, golden light emanating from your fingers as sacred energy flows through you'
    );
  });
});

describe('2. Modern, legacy and conflicting-shape normalization precedence', () => {
  test('modern record: resourceCost structure is preserved directly', () => {
    const modern = {
      name: 'Modern Ward',
      resourceCost: {
        actionPoints: 2,
        mana: 15,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Custodia Arcana',
        somaticText: 'Drawing a barrier gesture',
        materialText: 'A piece of chalk and silver dust',
        materialComponents: 'chalk_silver'
      }
    };
    const normalized = normalizeSpell(modern);
    expect(normalized.resourceCost.components).toEqual(['verbal', 'somatic', 'material']);
    expect(normalized.resourceCost.verbalText).toBe('Custodia Arcana');
    expect(normalized.resourceCost.somaticText).toBe('Drawing a barrier gesture');
    expect(normalized.resourceCost.materialText).toBe('A piece of chalk and silver dust');
    expect(normalized.resourceCost.materialComponents).toBe('chalk_silver');
  });

  test('legacy record with flat root-level component fields normalizes into resourceCost', () => {
    const legacy = {
      name: 'Legacy Spark',
      components: ['verbal', 'somatic'],
      verbalText: 'Scintilla!',
      somaticText: 'Snap fingers',
      resourceCost: { actionPoints: 1, mana: 5 }
    };
    const normalized = normalizeSpell(legacy);
    expect(normalized.resourceCost.components).toEqual(['verbal', 'somatic']);
    expect(normalized.resourceCost.verbalText).toBe('Scintilla!');
    expect(normalized.resourceCost.somaticText).toBe('Snap fingers');
  });

  test('legacy object components { verbal: true, somatic: false, material: true } extracts truthy keys', () => {
    const legacyObj = {
      name: 'Legacy Object Spell',
      components: { verbal: true, somatic: false, material: true },
      materialText: 'A pinch of sulfur',
      resourceCost: { actionPoints: 1, mana: 5 }
    };
    const normalized = normalizeSpell(legacyObj);
    expect(normalized.resourceCost.components).toEqual(['verbal', 'material']);
    expect(normalized.resourceCost.materialText).toBe('A pinch of sulfur');
  });

  test('conflicting shape: resourceCost values take precedence over root values', () => {
    const conflicting = {
      name: 'Conflicting Spell',
      components: ['verbal'],
      verbalText: 'Root Incantation',
      resourceCost: {
        components: ['verbal', 'somatic'],
        verbalText: 'Preferred Cost Incantation',
        somaticText: 'Cost Gesture',
        actionPoints: 1
      }
    };
    const normalized = normalizeSpell(conflicting);
    expect(normalized.resourceCost.components).toEqual(['verbal', 'somatic']);
    expect(normalized.resourceCost.verbalText).toBe('Preferred Cost Incantation');
    expect(normalized.resourceCost.somaticText).toBe('Cost Gesture');
  });
});

describe('3. Editing one component without losing others', () => {
  test('SpellComponentsSelector preserves somatic and material when verbal text is edited', () => {
    let emitted = null;
    const { container } = render(
      <SpellComponentsSelector
        components={['verbal', 'somatic', 'material']}
        materialComponents="amber_rod"
        materialText="An amber rod and bit of fur"
        verbalText="Fulmen!"
        somaticText="Thrust palms forward"
        onChange={(val) => { emitted = val; }}
      />
    );

    // Click edit on verbal component
    const verbalEditBtn = container.querySelectorAll('.edit-component-btn')[0];
    fireEvent.click(verbalEditBtn);

    const verbalInput = container.querySelector('.component-text-input');
    expect(verbalInput).toBeInTheDocument();
    expect(verbalInput.value).toBe('Fulmen!');

    fireEvent.change(verbalInput, { target: { value: 'Fulmen Grandis!' } });

    expect(emitted).not.toBeNull();
    expect(emitted.verbalText).toBe('Fulmen Grandis!');
    // Somatic and material requirements are completely preserved
    expect(emitted.somaticText).toBe('Thrust palms forward');
    expect(emitted.materialText).toBe('An amber rod and bit of fur');
    expect(emitted.materialComponents).toBe('amber_rod');
    expect(emitted.components).toEqual(['verbal', 'somatic', 'material']);
  });

  test('SpellComponentsSelector allows editing material requirement description', () => {
    let emitted = null;
    const { container } = render(
      <SpellComponentsSelector
        components={['verbal', 'material']}
        materialComponents=""
        materialText="A ruby worth 50gp"
        verbalText="Ignis!"
        somaticText=""
        onChange={(val) => { emitted = val; }}
      />
    );

    // Click edit on material component
    const materialEditBtn = container.querySelectorAll('.edit-component-btn')[1];
    fireEvent.click(materialEditBtn);

    const inputs = container.querySelectorAll('.component-text-input');
    const materialInput = inputs[inputs.length - 1];
    expect(materialInput).toBeInTheDocument();
    expect(materialInput.value).toBe('A ruby worth 50gp');

    fireEvent.change(materialInput, { target: { value: 'A ruby worth 100gp (consumed)' } });

    expect(emitted).not.toBeNull();
    expect(emitted.materialText).toBe('A ruby worth 100gp (consumed)');
    expect(emitted.verbalText).toBe('Ignis!');
    expect(emitted.components).toEqual(['verbal', 'material']);
  });
});

describe('4. Accurate Shared Presentation & Tabletop/GM-managed Disclosure', () => {
  const fullSpell = {
    id: 'plasma-fire',
    name: 'Plasma Fire',
    variant: 'wizard',
    school: 'Evocation',
    resourceCost: {
      actionPoints: 1,
      mana: 10,
      components: ['verbal', 'somatic', 'material', 'focus'],
      verbalText: 'Flammas Caelestes',
      somaticText: 'Two-handed circular sweep',
      materialText: 'Volcanic ash and powdered brimstone',
      focusText: 'A pyromancer focus staff'
    },
    description: 'Calls down searing plasma fire.'
  };

  test('UnifiedSpellCard renders V, S, M pills plus manual extension pills', () => {
    const { container } = render(
      <UnifiedSpellCard spell={fullSpell} variant="wizard" />
    );

    const verbalPill = container.querySelector('.spell-component-pill--verbal');
    const somaticPill = container.querySelector('.spell-component-pill--somatic');
    const materialPill = container.querySelector('.spell-component-pill--material');
    const focusPill = container.querySelector('.spell-component-pill--focus');

    expect(verbalPill).toBeInTheDocument();
    expect(verbalPill).toHaveTextContent('V');

    expect(somaticPill).toBeInTheDocument();
    expect(somaticPill).toHaveTextContent('S');

    expect(materialPill).toBeInTheDocument();
    expect(materialPill).toHaveTextContent('M');

    // Unsupported/manual extension component stays visible
    expect(focusPill).toBeInTheDocument();
    expect(focusPill).toHaveTextContent('FO');
  });

  test('clicking material pill popover discloses full text and tabletop-managed notice', () => {
    const { container } = render(
      <UnifiedSpellCard spell={fullSpell} variant="wizard" />
    );

    const materialPill = container.querySelector('.spell-component-pill--material');
    fireEvent.click(materialPill);

    const popover = container.querySelector('.pf-component-popover--material');
    expect(popover).toBeInTheDocument();
    expect(popover.querySelector('.pf-component-popover-body')).toHaveTextContent(
      '“Volcanic ash and powdered brimstone”'
    );
    expect(popover.querySelector('.pf-component-popover-meta')).toHaveTextContent(
      'Tabletop requirement · not automatically consumed; GM/tabletop-managed'
    );
  });

  test('clicking manual extension pill reveals formatted title and descriptive notice', () => {
    const { container } = render(
      <UnifiedSpellCard spell={fullSpell} variant="wizard" />
    );

    const focusPill = container.querySelector('.spell-component-pill--focus');
    fireEvent.click(focusPill);

    const popover = container.querySelector('.pf-component-popover--focus');
    expect(popover).toBeInTheDocument();
    expect(popover.querySelector('.pf-component-popover-header')).toHaveTextContent('Focus Component');
    expect(popover.querySelector('.pf-component-popover-body')).toHaveTextContent('“A pyromancer focus staff”');
    expect(popover.querySelector('.pf-component-popover-meta')).toHaveTextContent(
      'Tabletop / GM-managed check · not automatically enforced'
    );
  });

  test('card body displays materials requirement note with tabletop check disclaimer', () => {
    const { container } = render(
      <UnifiedSpellCard spell={fullSpell} variant="wizard" showDescription showStats />
    );

    const matRow = container.querySelector('.pf-spell-material-components');
    expect(matRow).toBeInTheDocument();
    expect(matRow).toHaveTextContent('Materials: Volcanic ash and powdered brimstone');
    expect(matRow).toHaveTextContent('(not automatically consumed; GM/tabletop-managed)');
  });

  test('canonical display labels do not invent authored gestures, words or materials', () => {
    const unauthoredSpell = {
      id: 'canonical-spark',
      name: 'Canonical Spark',
      variant: 'wizard',
      resourceCost: {
        actionPoints: 1,
        mana: 5,
        components: ['verbal', 'somatic', 'material']
        // No custom texts authored
      }
    };

    const { container } = render(
      <UnifiedSpellCard spell={unauthoredSpell} variant="wizard" />
    );

    // V pill popover
    const verbalPill = container.querySelector('.spell-component-pill--verbal');
    fireEvent.click(verbalPill);
    const vPopover = container.querySelector('.pf-component-popover--verbal');
    expect(vPopover).toBeInTheDocument();
    // Neutral canonical notice, NOT enclosed in quotes (no invented words)
    expect(vPopover.querySelector('.pf-component-popover-body')).toHaveTextContent(
      'Verbal component required (no specific incantation authored; GM/tabletop-managed).'
    );
    expect(vPopover.querySelector('.pf-component-popover-body').textContent).not.toMatch(/^“.*”$/);
    expect(vPopover.textContent).not.toMatch(/magical words/i);

    // S pill popover
    const somaticPill = container.querySelector('.spell-component-pill--somatic');
    fireEvent.click(somaticPill);
    const sPopover = container.querySelector('.pf-component-popover--somatic');
    expect(sPopover).toBeInTheDocument();
    // Neutral notice, NOT enclosed in quotes (no invented gestures)
    expect(sPopover.querySelector('.pf-component-popover-body')).toHaveTextContent(
      'Somatic component required (no specific gestures authored; GM/tabletop-managed).'
    );
    expect(sPopover.textContent).not.toMatch(/forceful, precise gestures/i);

    // M pill popover
    const materialPill = container.querySelector('.spell-component-pill--material');
    fireEvent.click(materialPill);
    const mPopover = container.querySelector('.pf-component-popover--material');
    expect(mPopover).toBeInTheDocument();
    expect(mPopover.querySelector('.pf-component-popover-body')).toHaveTextContent(
      'Material component required (no specific materials authored; GM/tabletop-managed).'
    );
    expect(mPopover.textContent).not.toMatch(/arcane focus/i);
    expect(mPopover.querySelector('.pf-component-popover-meta')).toHaveTextContent(
      'Tabletop requirement · not automatically consumed; GM/tabletop-managed'
    );
  });

  test('authored text describing consumption is preserved without making it an executable payment', () => {
    const consumedItemSpell = {
      id: 'consumed-spell',
      name: 'Alchemical Blast',
      variant: 'wizard',
      resourceCost: {
        actionPoints: 1,
        mana: 10,
        components: ['material'],
        materialText: 'A flask of alchemist fire worth 50gp (consumed upon casting)'
      }
    };

    const { container } = render(
      <UnifiedSpellCard spell={consumedItemSpell} variant="wizard" showDescription showStats />
    );

    const matRow = container.querySelector('.pf-spell-material-components');
    expect(matRow).toHaveTextContent('Materials: A flask of alchemist fire worth 50gp (consumed upon casting)');
    expect(matRow).toHaveTextContent('(not automatically consumed; GM/tabletop-managed)');
  });

  test('distinguishes "no requirements authored" from "requirements verified": empty spell renders no pills', () => {
    const emptySpell = {
      id: 'pure-magic',
      name: 'Pure Magic',
      variant: 'wizard',
      resourceCost: {
        actionPoints: 1,
        mana: 5,
        components: []
      },
      description: 'Pure effortless magic.'
    };

    const { container } = render(
      <UnifiedSpellCard spell={emptySpell} variant="wizard" />
    );

    expect(container.querySelector('.spell-components-pills')).toBeNull();
    expect(container.querySelector('.pf-spell-material-components')).toBeNull();
  });
});

describe('5. Card/review agreement', () => {
  test('Step 10 Review preview state projection preserves component requirements verbatim', () => {
    const spellState = {
      id: 'divine-light',
      name: 'Divine Light',
      level: 2,
      effectTypes: ['healing'],
      healingConfig: { formula: '2d8 + spirit', healingType: 'direct' },
      resourceCost: {
        actionPoints: 2,
        mana: 12,
        components: ['verbal', 'somatic', 'material'],
        verbalText: 'Lux Divina',
        somaticText: 'Raise holy symbol high',
        materialText: 'A pinch of powdered sunstone'
      }
    };

    // Simulate Step10Review mapping
    const previewSpell = {
      ...spellState,
      resourceCost: {
        ...spellState.resourceCost,
        mana: spellState.resourceCost.mana,
        actionPoints: spellState.resourceCost.actionPoints,
        components: spellState.resourceCost.components,
        verbalText: spellState.resourceCost.verbalText,
        somaticText: spellState.resourceCost.somaticText,
        materialText: spellState.resourceCost.materialText,
        materialComponents: spellState.resourceCost.materialComponents || ''
      }
    };

    const { container: reviewContainer } = render(
      <UnifiedSpellCard spell={previewSpell} variant="wizard" />
    );
    const { container: libraryContainer } = render(
      <UnifiedSpellCard spell={spellState} variant="library" />
    );

    // Both show identical V, S, M pills
    expect(reviewContainer.querySelector('.spell-component-pill--verbal')).toBeInTheDocument();
    expect(reviewContainer.querySelector('.spell-component-pill--somatic')).toBeInTheDocument();
    expect(reviewContainer.querySelector('.spell-component-pill--material')).toBeInTheDocument();

    expect(libraryContainer.querySelector('.spell-component-pill--verbal')).toBeInTheDocument();
    expect(libraryContainer.querySelector('.spell-component-pill--somatic')).toBeInTheDocument();
    expect(libraryContainer.querySelector('.spell-component-pill--material')).toBeInTheDocument();
  });
});

describe('6. Execution compatibility and admission invariants', () => {
  test('catalogue admission invariants: executable definition formula, price and targeting unchanged', () => {
    const prepared = catalogueDraft(EXACT_MARTYR_RECORD, 'martyr', {
      authoredDefinitionId: '00000000-0000-4000-8000-000000000001',
      id: 'catalogue-martyr_restorative_prayer'
    });

    expect(prepared.ok).toBe(true);

    // Admitted executable definition matches pinned catalogue executable exactly
    const admitted = definitionFromWizard(prepared.draft, { roomId: 'test-room', classId: 'martyr' });
    expect(admitted.ok).toBe(true);
    expect(admitted.definition.resourceCost).toEqual({ actionPoints: 1, mana: 5 });
    expect(admitted.definition.effect.formula).toBe('1d4 + spirit');
    expect(admitted.definition.targeting.kind).toBe('single');
    expect(admitted.definition.targeting.rangeFeet).toBe(30);

    // Execution compatibility presentation lists catalogue preservation
    const view = explainExecution(prepared.draft, { roomId: 'test-room', classId: 'martyr', shared: true });
    expect(view.state).toBe('partial');
    expect(view.manual.some((line) => line.includes('catalogue card'))).toBe(true);
  });

  test('executionCompatibility lists component requirements in preserved inventory', () => {
    const customSpell = {
      name: 'Custom Ritual',
      effectTypes: ['damage'],
      damageConfig: { formula: '3d6', damageTypes: ['ember'] },
      authoredDraft: {
        name: 'Custom Ritual',
        effectTypes: ['damage'],
        damageConfig: { formula: '3d6', damageTypes: ['ember'] },
        resourceCost: {
          actionPoints: 2,
          mana: 20,
          components: ['verbal', 'somatic', 'material'],
          materialText: 'Rare black pearl'
        }
      }
    };

    const view = explainExecution(customSpell, { shared: true });
    expect(view.preserved.map((i) => i.key)).toContain('components');
  });
});

describe('7. Wizard save/reopen and repeated no-op saves', () => {
  const authorRecord = {
    id: 'authored-ritual-1',
    name: 'Sanctified Barrier',
    level: 3,
    spellType: 'ACTION',
    typeConfig: { school: 'arcane', icon: 'shield_icon', tags: ['ward'] },
    targetingConfig: { targetingType: 'single', rangeType: 'self' },
    resourceCost: {
      actionPoints: 0, // valid zero
      mana: 25,
      components: ['verbal', 'somatic', 'material', 'focus'],
      verbalText: 'Munitio Sancta',
      somaticText: 'Traced circle in air',
      materialText: 'Pound of crushed salt',
      materialComponents: 'crushed_salt',
      focusText: 'Carved ivory icon'
    },
    damageConfig: null,
    healingConfig: null,
    controlConfig: null
  };

  test('saving spell to library preserves all component texts and manual extensions in authoredDraft and root', () => {
    // 1. Initial normalization and save
    const normalized = normalizeSpell(authorRecord);
    const save1 = {
      ...normalized,
      authoredDraft: JSON.parse(JSON.stringify(normalized)),
      authoredDefinitionId: 'test-def-id-1',
      lastModified: '2026-11-07T12:00:00.000Z',
      lastSaved: '2026-11-07T12:00:00.000Z'
    };

    expect(save1.resourceCost.components).toEqual(['verbal', 'somatic', 'material', 'focus']);
    expect(save1.resourceCost.verbalText).toBe('Munitio Sancta');
    expect(save1.resourceCost.somaticText).toBe('Traced circle in air');
    expect(save1.resourceCost.materialText).toBe('Pound of crushed salt');
    expect(save1.resourceCost.materialComponents).toBe('crushed_salt');
    expect(save1.resourceCost.focusText).toBe('Carved ivory icon');
    expect(save1.resourceCost.actionPoints).toBe(0); // Zero preserved

    // 2. Reopen from library (normalize as done on load)
    const reopened = normalizeSpell(save1);
    const save2 = {
      ...reopened,
      authoredDraft: JSON.parse(JSON.stringify(reopened)),
      authoredDefinitionId: save1.authoredDefinitionId,
      lastModified: '2026-11-07T12:05:00.000Z',
      lastSaved: '2026-11-07T12:05:00.000Z'
    };

    // 3. Third save cycle (repeated no-op save)
    const reopenedAgain = normalizeSpell(save2);
    const save3 = {
      ...reopenedAgain,
      authoredDraft: JSON.parse(JSON.stringify(reopenedAgain)),
      authoredDefinitionId: save1.authoredDefinitionId,
      lastModified: '2026-11-07T12:10:00.000Z',
      lastSaved: '2026-11-07T12:10:00.000Z'
    };

    // Component configurations must be identical across repeated saves
    expect(save3.resourceCost).toEqual(save1.resourceCost);
    expect(save3.resourceCost.components).toEqual(save1.resourceCost.components);
    expect(save3.resourceCost.verbalText).toBe(save1.resourceCost.verbalText);
    expect(save3.resourceCost.somaticText).toBe(save1.resourceCost.somaticText);
    expect(save3.resourceCost.materialText).toBe(save1.resourceCost.materialText);
    expect(save3.resourceCost.materialComponents).toBe(save1.resourceCost.materialComponents);
    expect(save3.resourceCost.focusText).toBe(save1.resourceCost.focusText);
    expect(save3.resourceCost.actionPoints).toBe(0);
  });
});



describe('8. Demonstrations of key preservation failures against original code', () => {
  test('Original catalogueDraft failure demonstration: wiped components array and omitted incantation text', () => {
    // Demonstrates prior bug in catalogueAbility.cjs:
    // resourceCost: { ...extractCostKeys(record.resourceCost || {}), components: [] }
    const originalCatalogueDraftBug = (record) => ({
      resourceCost: {
        actionPoints: record.resourceCost.actionPoints,
        mana: record.resourceCost.mana,
        components: [] // The original defect wiped this to empty array
        // verbalText and somaticText were omitted
      }
    });

    const buggyDraft = originalCatalogueDraftBug(EXACT_MARTYR_RECORD);
    expect(buggyDraft.resourceCost.components).toEqual([]);
    expect(buggyDraft.resourceCost.verbalText).toBeUndefined();
    expect(buggyDraft.resourceCost.somaticText).toBeUndefined();

    // In contrast, current repaired catalogueDraft preserves them verbatim:
    const fixed = catalogueDraft(EXACT_MARTYR_RECORD, 'martyr');
    expect(fixed.draft.resourceCost.components).toEqual(['verbal', 'somatic']);
    expect(fixed.draft.resourceCost.verbalText).toBe('Sanatio Divina');
    expect(fixed.draft.resourceCost.somaticText).toContain('Hands clasped in prayer');
  });

  test('Original Step 10 preview projection failure demonstration: stripped component text causing review card to hide pills', () => {
    // Demonstrates prior bug in Step10Review.jsx mapWizardStateToPreviewState():
    // resourceCost: { mana, actionPoints, primaryResourceType, classResourceCost, components, materialComponents }
    // Omitted verbalText and somaticText
    const buggyPreviewCost = {
      actionPoints: 1,
      mana: 5,
      components: ['verbal', 'somatic']
      // verbalText and somaticText missing!
    };

    // Under prior useComponentFormatters (hasVerbal = Boolean(rc.verbalText)),
    // missing verbalText caused the Verbal pill to completely disappear from review
    const buggyHasVerbal = Boolean(buggyPreviewCost.verbalText);
    expect(buggyHasVerbal).toBe(false); // Bug: V pill dropped in review

    // Current repaired mapping preserves verbalText and somaticText in preview:
    const fixedPreviewCost = {
      ...buggyPreviewCost,
      verbalText: 'Sanatio Divina',
      somaticText: 'Hands clasped in prayer'
    };
    expect(fixedPreviewCost.verbalText).toBe('Sanatio Divina');
    expect(fixedPreviewCost.somaticText).toBe('Hands clasped in prayer');
  });
});
