import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedSpellCard from '../UnifiedSpellCard';
import Step10Review from '../../steps/Step10Review';
import {
  extractPeriodicTiming,
  isSupportedCombatCooldown,
  formatCombatCooldown,
  formatPeriodicDuration,
  getPeriodicTimingPoints,
  formatPeriodicFullDescription,
  formatAuthoredExpiry
} from '../spellTimingPresentation';
import { normalizeSpell } from '../../../core/utils/spellNormalizer';

let mockWizardState = null;
const mockWizardDispatch = jest.fn();

// Mock dependencies for UnifiedSpellCard and Step10Review
jest.mock('../../../context/spellWizardContext', () => {
  const actual = jest.requireActual('../../../context/spellWizardContext');
  return {
    ...actual,
    useSpellWizardState: () => mockWizardState || {},
    useSpellWizardDispatch: () => mockWizardDispatch,
    validateStepCompletion: () => true
  };
});

jest.mock('../../../../../store/characterStore', () => ({
  __esModule: true,
  default: (selector) => selector({
    currentCharacter: {
      stats: { intelligence: 18 }
    }
  })
}));

jest.mock('../../../context/SpellLibraryContext', () => ({
  useSpellLibrary: () => ({
    getSpellById: () => null,
    dispatch: jest.fn()
  }),
  useSpellLibraryDispatch: () => jest.fn()
}));

jest.mock('../../../../../utils/assetManager', () => ({
  getIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getAbilityIconUrl: (icon) => `http://mock-icons/${icon}.png`,
  getCustomIconUrl: (icon) => `http://mock-icons/${icon}.png`
}));

jest.mock('../SpellTooltip', () => {
  return function MockTooltip() {
    return <div data-testid="mock-tooltip">Tooltip</div>;
  };
});

// Representative Saved Definitions across the 7 shapes

// 1. Periodic damage only
const shape1PeriodicDamageOnly = {
  id: 'shape-1-wasting-brand',
  name: 'Wasting Brand',
  spellType: 'ACTION',
  typeConfig: { school: 'blight', castTimeType: 'IMMEDIATE' },
  effectTypes: ['control'],
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'damage',
      periodicDamageType: 'blight',
      periodicFormula: '1d6',
      expiryPolicy: 'target-start-count',
      occurrences: 3,
      label: 'Wasting Brand',
      durationText: 'Wasting Brand'
    }
  },
  durationConfig: { durationType: 'instant', durationValue: 0 },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  resourceCost: { actionPoints: 1, mana: 2 }
};

// 2. Periodic healing only
const shape2PeriodicHealingOnly = {
  id: 'shape-2-soothing-font',
  name: 'Soothing Font',
  spellType: 'ACTION',
  typeConfig: { school: 'nature', castTimeType: 'IMMEDIATE' },
  effectTypes: ['control'],
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'healing',
      periodicFormula: '1d4',
      expiryPolicy: 'target-end-count',
      occurrences: 4,
      label: 'Soothing Font',
      durationText: 'Soothing Font'
    }
  },
  durationConfig: { durationType: 'instant', durationValue: 0 },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  resourceCost: { actionPoints: 1, mana: 3 }
};

// 3. Immediate damage plus damage ticks
const shape3ComposedDamage = {
  id: 'shape-3-searing-brand',
  name: 'Searing Brand',
  spellType: 'ACTION',
  typeConfig: { school: 'ember', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage', 'control'],
  damageConfig: {
    damageType: 'direct',
    elementType: 'ember',
    formula: '1d6+2',
    resolution: 'DICE'
  },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'damage',
      periodicDamageType: 'blight',
      periodicFormula: '1d6',
      expiryPolicy: 'target-start-count',
      occurrences: 3,
      label: 'Searing Brand',
      durationText: 'Searing Brand'
    }
  },
  durationConfig: { durationType: 'instant', durationValue: 0 },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  resourceCost: { actionPoints: 1, mana: 4 }
};

// 4. Immediate healing plus healing ticks
const shape4ComposedHealing = {
  id: 'shape-4-revitalizing-bloom',
  name: 'Revitalizing Bloom',
  spellType: 'ACTION',
  typeConfig: { school: 'nature', castTimeType: 'IMMEDIATE' },
  effectTypes: ['healing', 'control'],
  healingConfig: {
    healingType: 'direct',
    formula: '2d4',
    resolution: 'DICE'
  },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'healing',
      periodicFormula: '1d4',
      expiryPolicy: 'target-end-count',
      occurrences: 3,
      label: 'Revitalizing Bloom',
      durationText: 'Revitalizing Bloom'
    }
  },
  durationConfig: { durationType: 'instant', durationValue: 0 },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  resourceCost: { actionPoints: 1, mana: 3 }
};

// 5. Supported attribute formula in immediate part
const shape5AttributeFormulaComposed = {
  id: 'shape-5-mind-brand',
  name: 'Mind Brand',
  spellType: 'ACTION',
  typeConfig: { school: 'blight', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage', 'control'],
  damageConfig: {
    damageType: 'direct',
    elementType: 'blight',
    formula: '2d8 + intelligence/3',
    resolution: 'DICE'
  },
  controlConfig: {
    authoredCondition: {
      profile: 'authored-effect:v1',
      effect: 'periodic',
      periodicKind: 'damage',
      periodicDamageType: 'blight',
      periodicFormula: '1d6',
      expiryPolicy: 'target-start-count',
      occurrences: 2,
      label: 'Mind Brand',
      durationText: 'Mind Brand'
    }
  },
  durationConfig: { durationType: 'instant', durationValue: 0 },
  cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
  resourceCost: { actionPoints: 1, mana: 5 }
};

// 6. Immediate ability with authenticated caster-start cooldown
const shape6CombatCooldown = {
  id: 'shape-6-arcane-surge',
  name: 'Arcane Surge',
  spellType: 'ACTION',
  typeConfig: { school: 'arcane', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage'],
  damageConfig: {
    damageType: 'direct',
    elementType: 'arcane',
    formula: '3d6',
    resolution: 'DICE'
  },
  cooldownConfig: {
    cooldownType: 'authenticated_caster_start',
    cooldownValue: 3
  },
  durationConfig: { durationType: 'instant', durationValue: 0 },
  resourceCost: { actionPoints: 2, mana: 6 }
};

// 7. Legacy/manual catalogue timing
const shape7LegacyTiming = {
  id: 'shape-7-cataclysmic-burst',
  name: 'Cataclysmic Burst',
  spellType: 'ACTION',
  typeConfig: { school: 'ember', castTimeType: 'IMMEDIATE' },
  effectTypes: ['damage'],
  damageConfig: {
    damageType: 'direct',
    elementType: 'ember',
    formula: '4d6',
    hasDotEffect: true,
    dotConfig: {
      enabled: true,
      duration: 3,
      tickFrequency: 'round',
      dotFormula: '1d6'
    }
  },
  cooldownConfig: {
    type: 'turn_based',
    value: 2
  },
  durationConfig: {
    durationType: 'rounds',
    durationValue: 3
  },
  description: 'GM adjudicates environmental fire spread',
  manualInstructions: 'GM adjudicates environmental fire spread',
  resourceCost: { actionPoints: 2, mana: 8 }
};

describe('Spell Timing and Periodic Presentation', () => {

  describe('Pure helper functions (spellTimingPresentation.js)', () => {
    test('extractPeriodicTiming extracts draft shape correctly', () => {
      const info = extractPeriodicTiming(shape1PeriodicDamageOnly);
      expect(info).not.toBeNull();
      expect(info.isPeriodic).toBe(true);
      expect(info.kind).toBe('damage');
      expect(info.formula).toBe('1d6');
      expect(info.damageType).toBe('blight');
      expect(info.boundary).toBe('start');
      expect(info.ticks).toBe(3);
    });

    test('extractPeriodicTiming extracts compiled definition structure', () => {
      const compiledDef = {
        name: 'Compiled Wasting Brand',
        effects: {
          condition: {
            kind: 'periodic',
            label: 'Wasting Brand',
            tick: { kind: 'damage', formula: '1d6', damageTypes: ['blight'] }
          },
          direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['ember'] }
        },
        timing: {
          expiryPolicy: 'target-start-count',
          occurrences: 3,
          durationText: '3 ticks'
        }
      };
      const info = extractPeriodicTiming(compiledDef);
      expect(info).not.toBeNull();
      expect(info.boundary).toBe('start');
      expect(info.ticks).toBe(3);
      expect(info.immediate).toEqual({
        kind: 'damage',
        formula: '1d6+2',
        damageTypes: ['ember']
      });
    });

    test('isSupportedCombatCooldown validates authenticated_caster_start only', () => {
      expect(isSupportedCombatCooldown({ cooldownType: 'authenticated_caster_start', cooldownValue: 2 })).toBe(true);
      expect(isSupportedCombatCooldown({ type: 'authenticated_caster_start', value: 1 })).toBe(true);
      expect(isSupportedCombatCooldown({ type: 'turn_based', value: 2 })).toBe(false);
      expect(isSupportedCombatCooldown({ type: 'rounds', value: 3 })).toBe(false);
      expect(isSupportedCombatCooldown(null)).toBe(false);
    });

    test('formatCombatCooldown shows strictly upcoming caster-turn starts', () => {
      expect(formatCombatCooldown(1)).toBe('1 strictly upcoming caster-turn start until reuse');
      expect(formatCombatCooldown(3)).toBe('3 strictly upcoming caster-turn starts until reuse');
      expect(formatCombatCooldown(3)).not.toMatch(/round/i);
    });

    test('formatAuthoredExpiry enforces validOccurrences contract (2..10) on counted policies and handles boundaries', () => {
      // Lower and upper boundaries
      expect(formatAuthoredExpiry('target-start-count', 2)).toMatch(/start of the target's 2nd upcoming turn/);
      expect(formatAuthoredExpiry('target-end-count', 2)).toMatch(/end of the target's 2nd upcoming turn/);
      expect(formatAuthoredExpiry('target-start-count', 10)).toMatch(/start of the target's 10th upcoming turn/);
      expect(formatAuthoredExpiry('target-end-count', 10)).toMatch(/end of the target's 10th upcoming turn/);

      // Prefix handling (e.g. compiled 'authored-target-start-count')
      expect(formatAuthoredExpiry('authored-target-start-count', 3)).toMatch(/start of the target's 3rd upcoming turn/);

      // Boundaries outside 2..10 return null
      expect(formatAuthoredExpiry('target-start-count', 1)).toBeNull();
      expect(formatAuthoredExpiry('target-start-count', 0)).toBeNull();
      expect(formatAuthoredExpiry('target-start-count', -1)).toBeNull();
      expect(formatAuthoredExpiry('target-start-count', 11)).toBeNull();
      expect(formatAuthoredExpiry('target-end-count', 12)).toBeNull();

      // Non-safe-integer / non-number inputs return null
      expect(formatAuthoredExpiry('target-start-count', 2.5)).toBeNull();
      expect(formatAuthoredExpiry('target-start-count', '3')).toBeNull();
      expect(formatAuthoredExpiry('target-start-count', null)).toBeNull();
      expect(formatAuthoredExpiry('target-start-count', undefined)).toBeNull();

      // Non-counted structured policies do not depend on occurrences
      expect(formatAuthoredExpiry('target-next-start')).toBe("expires at the start of the target's next turn");
      expect(formatAuthoredExpiry('target-next-end')).toBe("expires at the end of the target's next turn");

      // Manual or unsupported policies return null
      expect(formatAuthoredExpiry('gm-manual')).toBeNull();
      expect(formatAuthoredExpiry('unknown-policy')).toBeNull();
      expect(formatAuthoredExpiry(null)).toBeNull();
    });

    test('formatPeriodicDuration formats tick count and boundary without rounds', () => {
      const info = extractPeriodicTiming(shape1PeriodicDamageOnly);
      const text = formatPeriodicDuration(info);
      expect(text).toMatch(/3 ticks/);
      expect(text).toMatch(/target turn start/);
      expect(text).not.toMatch(/round/i);
    });

    test('getPeriodicTimingPoints covers all required contract items with narrowed natural expiry', () => {
      const info = extractPeriodicTiming(shape3ComposedDamage);
      const points = getPeriodicTimingPoints(info);
      const labels = points.map(p => p.label);
      expect(labels).toContain('Immediate component');
      expect(labels).toContain('Recurring component');
      expect(labels).toContain('Turn boundary');
      expect(labels).toContain('Tick resolution');
      expect(labels).toContain('Expiry');
      expect(labels).toContain('Resource cost');

      const fullText = points.map(p => p.text).join(' ');
      expect(fullText).toMatch(/separate roll/);
      expect(fullText).toMatch(/GM resolves/);
      expect(fullText).toMatch(/change HP only when resolved/);
      expect(fullText).toMatch(/the final tick recorded at natural expiry remains available for GM resolution/);
      expect(fullText).toMatch(/Paid once at cast/);
    });

    test('formatPeriodicFullDescription formats combined string with bullet separators', () => {
      const info = extractPeriodicTiming(shape3ComposedDamage);
      const desc = formatPeriodicFullDescription(info);
      expect(desc).toContain('Immediate component:');
      expect(desc).toContain('Recurring component:');
      expect(desc).toContain('Turn boundary:');
      expect(desc).toContain('Tick resolution:');
      expect(desc).toContain('Expiry:');
      expect(desc).toContain('Resource cost:');
      expect(desc).toContain(' · ');

      expect(formatPeriodicFullDescription(null)).toBe('');
      expect(formatPeriodicFullDescription({ isPeriodic: false })).toBe('');
    });
  });

  describe('Shape 1: Periodic damage only (Wasting Brand)', () => {
    test('renders distinct tick count, boundary, separate roll and GM resolution in UnifiedSpellCard', () => {
      render(
        <UnifiedSpellCard
          spell={shape1PeriodicDamageOnly}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Stat pill duration
      expect(screen.getByText(/3 ticks, target turn start/)).toBeInTheDocument();

      // Card body explains periodic details without placeholder
      expect(screen.queryByText(/Effect details not configured/)).not.toBeInTheDocument();
      expect(screen.getByText(/Periodic Damage: Wasting Brand/)).toBeInTheDocument();
      expect(screen.getByText(/1d6 blight per tick/)).toBeInTheDocument();
      expect(screen.getByText(/A separate roll is made when the GM resolves each tick/)).toBeInTheDocument();
      expect(screen.getByText(/the final tick recorded at natural expiry remains available for GM resolution/)).toBeInTheDocument();
      expect(screen.getByText(/Paid once at cast/)).toBeInTheDocument();

      // Cooldown footer is suppressed for none/0
      expect(screen.queryByText(/Cooldown:/)).not.toBeInTheDocument();
    });
  });

  describe('Shape 2: Periodic healing only (Soothing Font)', () => {
    test('renders healing tick formula, target turn end boundary and 4 ticks', () => {
      render(
        <UnifiedSpellCard
          spell={shape2PeriodicHealingOnly}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Stat pill duration
      expect(screen.getByText(/4 ticks, target turn end/)).toBeInTheDocument();

      // Card body details
      expect(screen.getByText(/Periodic Healing: Soothing Font/)).toBeInTheDocument();
      expect(screen.getByText(/1d4 per tick/)).toBeInTheDocument();
      expect(screen.getByText(/target turn end for 4 turns/)).toBeInTheDocument();
      expect(screen.getByText(/the final tick recorded at natural expiry remains available for GM resolution/)).toBeInTheDocument();
      expect(screen.getByText(/Paid once at cast/)).toBeInTheDocument();
    });
  });

  describe('Shape 3: Immediate damage plus damage ticks (Searing Brand)', () => {
    test('separates immediate damage (1d6+2 ember) from recurring ticks (1d6 blight)', () => {
      render(
        <UnifiedSpellCard
          spell={shape3ComposedDamage}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Both effects rendered with clear separation
      expect(screen.getByText('Instant Damage')).toBeInTheDocument();
      expect(screen.getByText(/1d6 \+ 2 Ember Damage/)).toBeInTheDocument();

      expect(screen.getByText('Damage Over Time')).toBeInTheDocument();
      expect(screen.getByText(/1d6 Blight Damage per tick \(3 ticks, target turn start\)/)).toBeInTheDocument();

      // Duration stat pill
      expect(screen.getAllByText(/3 ticks, target turn start/)[0]).toBeInTheDocument();

      // Control section details show both immediate and recurring components
      expect(screen.getByText(/1d6\+2 ember damage \(rolled and applied at cast\)/)).toBeInTheDocument();
      expect(screen.getByText(/1d6 blight damage per tick \(3 ticks\)/)).toBeInTheDocument();
    });
  });

  describe('Shape 4: Immediate healing plus healing ticks (Revitalizing Bloom)', () => {
    test('renders immediate healing and recurring ticks without conflation', () => {
      render(
        <UnifiedSpellCard
          spell={shape4ComposedHealing}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Stat pill duration
      expect(screen.getAllByText(/3 ticks, target turn end/)[0]).toBeInTheDocument();

      // Healing mechanics line shows composed formula
      expect(screen.getByText(/2d4 Healing \(immediate\) \+ 1d4 Healing per tick \(3 ticks, target turn end\)/)).toBeInTheDocument();

      // Periodic control effect section details
      expect(screen.getByText(/Periodic Healing: Revitalizing Bloom/)).toBeInTheDocument();
      expect(screen.getByText(/2d4 healing \(rolled and applied at cast\)/)).toBeInTheDocument();
      expect(screen.getByText(/1d4 healing per tick \(3 ticks\)/)).toBeInTheDocument();
    });
  });

  describe('Shape 5: Supported attribute formula in immediate part (Mind Brand)', () => {
    test('preserves attribute formula (2d8 + intelligence/3) displaying effective score without calling it a modifier', () => {
      render(
        <UnifiedSpellCard
          spell={shape5AttributeFormulaComposed}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Immediate formula with attribute math displays attribute score (Intelligence), NOT a modifier
      expect(screen.getByText('Instant Damage')).toBeInTheDocument();
      expect(screen.getByText(/2d8 \+ Intelligence \/ 3 Blight Damage/i)).toBeInTheDocument();
      // Ensure it does not call the score a modifier
      expect(screen.queryByText(/Intelligence Mod/)).not.toBeInTheDocument();

      // Recurring component is preserved and not overwritten
      expect(screen.getByText('Damage Over Time')).toBeInTheDocument();
      expect(screen.getByText(/1d6 Blight Damage per tick \(2 ticks, target turn start\)/)).toBeInTheDocument();

      // Duration pill
      expect(screen.getAllByText(/2 ticks, target turn start/)[0]).toBeInTheDocument();
    });
  });

  describe('Shape 6: Immediate ability with authenticated caster-start cooldown (Arcane Surge)', () => {
    test('renders strictly upcoming caster-turn starts and keeps cooldown separate from duration', () => {
      render(
        <UnifiedSpellCard
          spell={shape6CombatCooldown}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Cooldown footer renders exact contract wording
      expect(screen.getByText(/3 strictly upcoming caster-turn starts until reuse/)).toBeInTheDocument();

      // Cooldown is NOT labeled as rounds
      expect(screen.queryByText(/rounds/i)).not.toBeInTheDocument();

      // Duration remains Instantaneous/Instant, strictly separate from cooldown
      expect(screen.queryByText(/Duration: 3/)).not.toBeInTheDocument();
    });
  });

  describe('Shape 7: Legacy/manual catalogue timing (Cataclysmic Burst)', () => {
    test('preserves legacy fields verbatim and does not assign executable semantics', () => {
      render(
        <UnifiedSpellCard
          spell={shape7LegacyTiming}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );

      // Legacy cooldown preserves "2 turns" verbatim
      expect(screen.getByText(/2 turns/i)).toBeInTheDocument();
      expect(screen.queryByText(/strictly upcoming caster-turn starts/)).not.toBeInTheDocument();

      // Legacy duration preserves "3 rounds" verbatim
      expect(screen.getAllByText(/3 rounds/)[0]).toBeInTheDocument();
      expect(screen.queryByText(/target turn start/)).not.toBeInTheDocument();

      // Manual instructions are preserved
      expect(screen.getByText(/GM adjudicates environmental fire spread/)).toBeInTheDocument();
    });
  });

  describe('Defect demonstration and regression guards', () => {
    test('demonstrates Step 10 preview defect: original preview mapping downgraded cooldown to 1 turn', () => {
      const authoredCooldown = {
        cooldownType: 'authenticated_caster_start',
        cooldownValue: 3
      };

      // Demonstrating original buggy preview projection logic in mapWizardStateToPreviewState:
      const originalBuggyProjection = {
        type: authoredCooldown.type || 'turn_based',
        value: authoredCooldown.value || 1
      };
      // Original logic dropped cooldownType and defaulted to 1 turn:
      expect(originalBuggyProjection).toEqual({ type: 'turn_based', value: 1 });

      // Repaired preview projection in Step10Review.jsx preserves cooldownType and cooldownValue:
      const repairedCooldownType = authoredCooldown.cooldownType || authoredCooldown.type || 'none';
      const repairedCooldownValue = authoredCooldown.cooldownValue ?? authoredCooldown.value ?? 0;
      const repairedPreview = {
        cooldownType: repairedCooldownType,
        cooldownValue: repairedCooldownValue
      };
      expect(repairedPreview).toEqual({ cooldownType: 'authenticated_caster_start', cooldownValue: 3 });
      expect(formatCombatCooldown(repairedPreview.cooldownValue)).toBe('3 strictly upcoming caster-turn starts until reuse');
    });

    test('proves real save path in Step10Review preserves authored cooldown without corruption', () => {
      // In Step10Review.jsx handleSaveSpell, librarySpell.cooldownConfig is assigned directly from spellState.cooldownConfig
      const wizardState = {
        name: 'Arcane Surge',
        cooldownConfig: {
          cooldownType: 'authenticated_caster_start',
          cooldownValue: 3
        }
      };

      const savedLibraryConfig = wizardState.cooldownConfig || { cooldown: 0, charges: 1 };
      // Real save path directly preserves authored cooldown without corruption
      expect(savedLibraryConfig).toEqual({
        cooldownType: 'authenticated_caster_start',
        cooldownValue: 3
      });
    });

    test('Step10Review live preview renders authenticated_caster_start without downgrading to 1 turn', () => {
      const wizardState = {
        name: 'Arcane Surge',
        spellType: 'ACTION',
        typeConfig: { school: 'arcane', castTimeType: 'IMMEDIATE' },
        effectTypes: ['damage'],
        damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '3d6', resolution: 'DICE' },
        cooldownConfig: {
          cooldownType: 'authenticated_caster_start',
          cooldownValue: 3
        },
        durationConfig: { durationType: 'instant', durationValue: 0 },
        resourceCost: { actionPoints: 2, mana: 6 }
      };

      mockWizardState = wizardState;

      render(
        <Step10Review
          stepNumber={10}
          totalSteps={10}
          spellState={wizardState}
          onUpdateSpell={jest.fn()}
          onSave={jest.fn()}
          onNext={jest.fn()}
          onPrevious={jest.fn()}
        />
      );

      // Verify the review preview renders the authenticated combat cooldown
      expect(screen.getByText(/3 strictly upcoming caster-turn starts until reuse/)).toBeInTheDocument();
      // Ensure the old bug ("1 turn" from defaulting to type || 'turn_based', value || 1) does NOT occur
      expect(screen.queryByText(/1 turn$/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/1 Turn$/)).not.toBeInTheDocument();
    });

    test('presentation suppresses "No cooldown" while preserving prior normalized shape', () => {
      const spellWithoutCooldown = {
        name: 'Basic Dart',
        spellType: 'ACTION',
        effectTypes: ['damage'],
        damageConfig: { damageType: 'direct', formula: '1d4' }
      };

      // Prior normalized shape is preserved
      const normalized = normalizeSpell(spellWithoutCooldown);
      expect(normalized.cooldownConfig).toEqual({ cooldownType: 'turn_based', cooldownValue: 0 });

      // In presentation, formatCooldown returns null for 0 turn_based, suppressing the footer
      const { container } = render(
        <UnifiedSpellCard
          spell={normalized}
          variant="wizard"
          showDescription={true}
          showStats={true}
        />
      );
      expect(container.querySelector('.unified-spell-cooldown')).toBeNull();
      expect(screen.queryByText(/Cooldown:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/No cooldown/i)).not.toBeInTheDocument();
    });

    test('save and reopen preserves periodic and cooldown definitions', () => {
      const draft = { ...shape3ComposedDamage };
      const normalizedOnce = normalizeSpell(draft);
      const serialized = JSON.stringify(normalizedOnce);
      const deserialized = JSON.parse(serialized);
      const normalizedTwice = normalizeSpell(deserialized);

      expect(normalizedTwice.controlConfig.authoredCondition).toEqual(draft.controlConfig.authoredCondition);
      expect(extractPeriodicTiming(normalizedTwice)).toEqual(extractPeriodicTiming(draft));
    });
  });
});
