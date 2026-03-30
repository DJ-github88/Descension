import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSpellWizardState } from './context/spellWizardContext';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from './context/SpellLibraryContext';
import { useClassSpellLibrary } from '../../hooks/useClassSpellLibrary';
import SpellCardWithProcs from './components/common/SpellCardWithProcs';
import useSpellbookStore from '../../store/spellbookStore';
import useSettingsStore from '../../store/settingsStore';
import useAuthStore from '../../store/authStore';
import { saveUserSpell } from '../../services/firebase/userSpellService';

// External Live Preview Component that renders outside any window
const ExternalLivePreview = () => {
  const state = useSpellWizardState();
  const library = useSpellLibrary();
  const libraryDispatch = useSpellLibraryDispatch();
  const { addCustomSpell } = useClassSpellLibrary();
  const { activeTab, windowPosition, windowSize } = useSpellbookStore();
  const windowScale = useSettingsStore(state => state.windowScale);
  const { user } = useAuthStore();

  // State for completion feedback
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  // Only show when the wizard tab is active
  if (activeTab !== 'wizard') {
    return null;
  }

  // Handle spell completion
  const handleCompleteSpell = async () => {
    if (!state.name || state.name.trim() === '') {
      setCompletionMessage('Please enter a spell name before completing.');
      setTimeout(() => setCompletionMessage(''), 3000);
      return;
    }

    setIsCompleting(true);
    setCompletionMessage('');

    try {
      // Extract damage types properly - same logic as createPreviewSpell
      const extractedDamageTypes = [];
      if (state.typeConfig?.school) {
        extractedDamageTypes.push(state.typeConfig.school);
      }
      if (state.typeConfig?.secondaryElement) {
        extractedDamageTypes.push(state.typeConfig.secondaryElement);
      }
      if (extractedDamageTypes.length === 0 && state.damageConfig?.damageType) {
        if (state.damageConfig.elementType) {
          extractedDamageTypes.push(state.damageConfig.elementType);
        }
      }

      // Ensure targetingConfig has all required fields
      const fullTargetingConfig = {
        ...state.targetingConfig,
        aoeType: state.targetingConfig?.aoeType || state.targetingConfig?.aoeShape || 'sphere',
        targetingType: state.targetingConfig?.targetingType || 'single',
        rangeType: state.targetingConfig?.rangeType || 'ranged',
        rangeDistance: state.targetingConfig?.rangeDistance || 30
      };

      // Create spell data from wizard state
      const spellData = {
        ...state,
        id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: 'wizard',
        isCustom: true,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        // Ensure we have all necessary properties
        icon: state.icon || 'inv_misc_questionmark',
        spellType: state.spellType || 'ACTION',
        typeConfig: state.typeConfig || {},
        effectType: state.effectTypes && state.effectTypes.length > 0 ? state.effectTypes[0] : 'utility',
        effectTypes: state.effectTypes || [],
        // Use properly extracted damage types
        damageTypes: extractedDamageTypes.length > 0 ? extractedDamageTypes :
          (state.damageTypes ||
            (state.damageConfig?.elementType ? [state.damageConfig.elementType] : ['force'])),
        targetingConfig: fullTargetingConfig,
        tags: [
          ...(state.typeConfig?.tags || []),
          ...(state.effectTypes || []),
          ...(state.tags || []),
          'custom'
        ].filter(Boolean),
        // Ensure ALL effect configurations are saved
        damageConfig: state.damageConfig || null,
        healingConfig: state.healingConfig || null,
        buffConfig: state.buffConfig || null,
        debuffConfig: state.debuffConfig || null,
        utilityConfig: state.utilityConfig || null,
        controlConfig: state.controlConfig || null,
        summoningConfig: state.summoningConfig || null,
        transformationConfig: state.transformationConfig || null,
        purificationConfig: state.purificationConfig || null,
        restorationConfig: state.restorationConfig || null
      };

      // Transform Devotion Level resources to specialMechanics (Martyr)
      const resourceValues = state.resourceCost?.resourceValues || {};
      if (resourceValues.devotion_required !== undefined ||
        resourceValues.devotion_cost !== undefined ||
        resourceValues.devotion_gain !== undefined) {
        spellData.specialMechanics = {
          ...spellData.specialMechanics,
          devotionLevel: {
            required: resourceValues.devotion_required || 0,
            cost: resourceValues.devotion_cost || 0,
            amplifiedCost: resourceValues.devotion_cost || 0,
            gain: resourceValues.devotion_gain || 0
          }
        };

        // Also add flat properties for spell card display
        spellData.devotionRequired = resourceValues.devotion_required;
        spellData.devotionCost = resourceValues.devotion_cost;
        spellData.devotionGain = resourceValues.devotion_gain;
      }

      // Ensure spell has an ID
      if (!spellData.id) {
        const generateSpellId = (name) => {
          const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const timestamp = Date.now().toString(36);
          return `${base}-${timestamp}`;
        };
        spellData.id = generateSpellId(spellData.name || 'Unnamed Spell');
        spellData.dateCreated = new Date().toISOString();
        spellData.lastModified = new Date().toISOString();
      }

      // Add to spell library context (shows in spell library immediately)
      // This works whether logged in or not - saves to localStorage
      libraryDispatch(libraryActionCreators.addSpell(spellData));

      // Add to custom spells (for character-specific spell library)
      addCustomSpell(spellData);

      // Save to Firebase if user is logged in (for cloud sync)
      if (user?.uid) {
        const result = await saveUserSpell(user.uid, spellData);
        if (result.success) {
          console.log('✅ Spell saved to user account in Firebase');
          setCompletionMessage('✓ Spell added to library and saved to your account!');
        } else if (result.localOnly) {
          console.log('⚠️ Spell saved locally only (Firebase not available)');
          setCompletionMessage('✓ Spell added to library (will sync when online)');
        }
      } else {
        console.log('✓ Spell added to local library (not logged in - spell will not persist after page refresh)');
        setCompletionMessage('✓ Spell added to library! (Login to save to your account)');
      }

      // Clear the message after 3 seconds
      setTimeout(() => setCompletionMessage(''), 3000);

    } catch (error) {
      console.error('Error completing spell:', error);
      setCompletionMessage('✗ Failed to complete spell. Please try again.');
      setTimeout(() => setCompletionMessage(''), 3000);
    } finally {
      setIsCompleting(false);
    }
  };

  // Calculate position with fallback values and live updates - REACTIVE
  const spellbookWidth = (windowSize?.width || 1000) * windowScale;
  const spellbookX = windowPosition?.x || ((window.innerWidth - 1000) / 2);
  const spellbookY = windowPosition?.y || ((window.innerHeight - 700) / 2);

  const position = {
    left: spellbookX + spellbookWidth + 10, // Small gap from spellbook
    top: spellbookY + 60, // Aligned with content area
    position: 'fixed',
    zIndex: 9998,
    width: '340px', // Slightly smaller width
    maxHeight: 'none',
    overflow: 'visible'
  };



  // Create live preview spell data using the SAME transformation as Step10Review
  const createPreviewSpell = () => {
    try {
      // Use the same mapping function as Step10Review for consistency
      const previewSpell = mapWizardStateToPreviewState(state);

      // Debug logging for card/coin configurations and resolution method changes (commented out to avoid browser issues)
      // console.log('ExternalLivePreview Debug - Resolution Method Update:', {
      //   spellName: previewSpell.name,
      //   resolution: previewSpell.resolution,
      //   cardConfig: previewSpell.cardConfig,
      //   coinConfig: previewSpell.coinConfig,
      //   damageConfig: previewSpell.damageConfig,
      //   chanceOnHitConfig: previewSpell.chanceOnHitConfig,
      //   criticalConfig: previewSpell.criticalConfig,
      //   lastModified: state.lastModified,
      //   state: {
      //     damageConfig: state.damageConfig,
      //     healingConfig: state.healingConfig
      //   }
      // });

      return previewSpell;
    } catch (error) {
      console.warn('Error creating preview spell:', error);
      const fallbackSpell = {
        name: state.name || 'Unnamed Spell',
        description: state.description || 'No description yet...',
        level: state.level || 1,
        school: state.school || 'Arcane',
        spellType: state.spellType || 'Action',
        icon: state.typeConfig?.icon || 'inv_misc_questionmark'
      };
      return fallbackSpell;
    }
  };

  // Map wizard state to preview state (same as Step10Review)
  const mapWizardStateToPreviewState = (spellState) => {
    // Extract icon from spell state
    const extractSpellIcon = (state) => {
      return state.typeConfig?.icon || 'inv_misc_questionmark';
    };

    const formatCastTime = (state) => {
      if (!state) return 'Instant';

      // Handle different casting time formats
      if (state.actionType === 'channeled') return 'Channeled';
      if (state.spellType === 'reaction') return 'Reaction';
      if (state.spellType === 'ritual') return 'Ritual';
      if (state.spellType === 'passive') return 'Passive';

      const castTime = state.castTime ||
        state.castingTime ||
        (state.castingConfig && state.castingConfig.castTime) ||
        (state.typeConfig && state.typeConfig.castTime) ||
        'Instant';

      return castTime;
    };

    const icon = spellState.typeConfig?.icon || extractSpellIcon(spellState) || 'inv_misc_questionmark';

    // Determine damage types - SAME LOGIC AS STEP10REVIEW
    const damageTypes = [];

    // First check if we have a primary type selected in Step 1
    if (spellState.typeConfig?.school) {
      damageTypes.push(spellState.typeConfig.school);
    }

    // Check for secondary type in Step 1
    if (spellState.typeConfig?.secondaryElement) {
      damageTypes.push(spellState.typeConfig.secondaryElement);
    }

    // If no types are set in Step 1, check damage config
    if (damageTypes.length === 0 && spellState.damageConfig?.damageType) {
      // For direct damage
      if (spellState.damageConfig.damageType === 'direct' && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // For DoT damage
      else if (spellState.damageConfig.damageType === 'dot' && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // For combined damage (direct + DoT)
      else if (spellState.damageConfig.hasDotEffect && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // Fallback if elementType is not set
      else if (spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
    }

    // Create a properly structured spell object for the unified card
    return {
      // Basic Information
      id: 'preview',
      name: spellState.name || 'Unnamed Spell',
      description: spellState.description || '',
      level: spellState.level || 1,
      icon: icon,
      spellType: spellState.spellType || 'ACTION',
      effectType: spellState.effectTypes && spellState.effectTypes.length > 0 ? spellState.effectTypes[0] : 'utility',
      effectTypes: spellState.effectTypes || [],

      // Type configuration
      typeConfig: spellState.typeConfig || {},

      // Casting information
      castTime: formatCastTime(spellState),
      // Format range based on rangeType first, then fall back to rangeDistance
      range: (() => {
        const rangeType = spellState.targetingConfig?.rangeType;
        const rangeDistance = spellState.targetingConfig?.rangeDistance;
        if (rangeType === 'touch') return 'Touch';
        if (rangeType === 'sight') return 'Sight';
        if (rangeType === 'unlimited') return 'Unlimited';
        if (rangeType === 'self_centered' || spellState.targetingConfig?.targetingType === 'self') return 'Self';
        if (rangeType === 'ranged' && rangeDistance) return `${rangeDistance} ft`;
        if (rangeDistance) return `${rangeDistance} ft`;
        return '30 ft';
      })(),
      rangeType: spellState.targetingConfig?.rangeType || 'ranged',

      // Targeting information - NOTE: targetingMode is the mode ('unified' or 'effect'), not the targeting type
      // This was incorrectly set to targetingType before - keeping for backward compatibility but will be overridden below
      targetRestriction: spellState.targetingConfig?.targetRestrictions && spellState.targetingConfig.targetRestrictions.length > 0 ?
        spellState.targetingConfig.targetRestrictions[0] :
        spellState.targetingConfig?.targetRestriction || null,
      targetRestrictions: spellState.targetingConfig?.targetRestrictions && spellState.targetingConfig.targetRestrictions.length > 0 ?
        spellState.targetingConfig.targetRestrictions :
        spellState.targetingConfig?.targetRestriction ? [spellState.targetingConfig.targetRestriction] : [],
      maxTargets: spellState.targetingConfig?.maxTargets || 1,
      selectionMethod: spellState.targetingConfig?.selectionMethod ||
        spellState.targetingConfig?.targetSelectionMethod || 'manual',
      targetSelectionMethod: spellState.targetingConfig?.targetSelectionMethod ||
        spellState.targetingConfig?.selectionMethod || 'manual',
      rangeDistance: spellState.targetingConfig?.rangeDistance || 30,

      // AOE information
      aoeShape: spellState.targetingConfig?.aoeShape || 'circle',
      aoeSize: spellState.targetingConfig?.aoeParameters?.radius ||
        spellState.targetingConfig?.aoeParameters?.size ||
        spellState.targetingConfig?.aoeParameters?.length || 20,
      aoeParameters: spellState.targetingConfig?.aoeParameters || {},
      movementBehavior: spellState.targetingConfig?.movementBehavior || 'static',
      // Ensure targetingConfig includes aoeType and all fields
      targetingConfig: {
        ...spellState.targetingConfig,
        aoeType: spellState.targetingConfig?.aoeType || spellState.targetingConfig?.aoeShape || 'sphere',
        targetingType: spellState.targetingConfig?.targetingType || 'single',
        rangeType: spellState.targetingConfig?.rangeType || 'ranged',
        rangeDistance: spellState.targetingConfig?.rangeDistance || 30
      } || {},
      // CRITICAL: Include targetingMode and effectTargeting for effect-specific targeting
      targetingMode: spellState.targetingMode || 'unified',
      effectTargeting: spellState.effectTargeting || {},

      // Damage/Healing information
      primaryDamage: spellState.damageConfig ? {
        dice: spellState.damageConfig.formula ||
          spellState.damageConfig.diceNotation ||
          spellState.effectResolutions?.damage?.config?.formula ||
          '6d6',
        flat: spellState.damageConfig.flatBonus || 0,
        type: spellState.damageConfig.elementType || spellState.typeConfig?.school || 'force'
      } : null,

      // Damage types - CRITICAL: Use the same logic as Step10Review
      damageTypes: damageTypes.length > 0 ? damageTypes : ['force'],

      // Damage config
      damageConfig: {
        ...spellState.damageConfig,
        // Maintain backward compatibility with old structure
        savingThrow: spellState.damageConfig?.savingThrow || null,
        savingThrowType: spellState.damageConfig?.savingThrowType || 'agility',
        difficultyClass: spellState.damageConfig?.difficultyClass || 15,
        partialEffect: spellState.damageConfig?.partialEffect || false,
        partialEffectFormula: spellState.damageConfig?.partialEffectFormula || 'damage/2',
        partialEffectType: spellState.damageConfig?.partialEffectType || 'half',
        directDamageFormula: spellState.damageConfig?.directDamageFormula || 'damage/2',
        dotDamageFormula: spellState.damageConfig?.dotDamageFormula || 'dot_damage/2',
        // Include the new savingThrowConfig structure for UnifiedSpellCard
        savingThrowConfig: spellState.damageConfig?.savingThrowConfig || (
          spellState.damageConfig?.savingThrow ? {
            enabled: true,
            savingThrowType: spellState.damageConfig.savingThrowType || 'agility',
            difficultyClass: spellState.damageConfig.difficultyClass || 15,
            partialEffect: spellState.damageConfig.partialEffect || false,
            partialEffectFormula: spellState.damageConfig.partialEffectFormula || 'damage/2'
          } : null
        ),
        // Include chance on hit and critical hit configurations
        chanceOnHitConfig: spellState.damageConfig?.chanceOnHitConfig || null,
        criticalConfig: spellState.damageConfig?.criticalConfig || null,
      },

      // Chance on Hit Configuration (also at top level for easier access)
      chanceOnHitConfig: spellState.damageConfig?.chanceOnHitConfig || null,

      // Critical Hit Configuration (also at top level for easier access)
      criticalConfig: spellState.damageConfig?.criticalConfig || null,

      // Healing configuration
      healingConfig: spellState.healingConfig || null,

      // Buff configuration
      buffConfig: spellState.buffConfig || null,

      // Debuff configuration
      debuffConfig: spellState.debuffConfig || null,

      // Utility and Control configurations
      utilityConfig: spellState.utilityConfig || null,
      controlConfig: spellState.controlConfig || null,

      // Summoning configuration
      summonConfig: spellState.summonConfig || null,
      summoningConfig: spellState.summonConfig || null, // Also provide as summoningConfig for compatibility

      // Resolution type
      resolution: spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE',

      // Card configuration for card-based spells - ensure proper fallback when switching resolution methods
      cardConfig: (() => {
        const resolution = spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE';
        if (resolution === 'CARDS') {
          return spellState.damageConfig?.cardConfig || spellState.healingConfig?.cardConfig || {
            drawCount: 3,
            formula: 'CARD_VALUE + POKER_HAND_RANK * 3'
          };
        }
        // Always provide cardConfig even for non-card resolutions for consistency
        return spellState.damageConfig?.cardConfig || spellState.healingConfig?.cardConfig || {
          drawCount: 3,
          formula: 'CARD_VALUE + POKER_HAND_RANK * 3'
        };
      })(),

      // Coin configuration for coin-based spells - ensure proper fallback when switching resolution methods
      coinConfig: (() => {
        const resolution = spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE';
        if (resolution === 'COINS') {
          return spellState.damageConfig?.coinConfig || spellState.healingConfig?.coinConfig || {
            flipCount: 4,
            formula: 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
          };
        }
        // Always provide coinConfig even for non-coin resolutions for consistency
        return spellState.damageConfig?.coinConfig || spellState.healingConfig?.coinConfig || {
          flipCount: 4,
          formula: 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
        };
      })(),

      // School from typeConfig
      school: spellState.typeConfig?.school || 'Arcane',

      // Element type - check both typeConfig (Step 1) and damageConfig (damage effects)
      elementType: spellState.damageConfig?.elementType || spellState.typeConfig?.school,

      // Damage types array - check both Step 1 (typeConfig) and damage effects (damageConfig)
      damageTypes: (() => {
        const types = [];

        // Priority 1: Check damageConfig (from damage effects step)
        if (spellState.damageConfig?.elementType) {
          types.push(spellState.damageConfig.elementType);
        }
        if (spellState.damageConfig?.secondaryElementType) {
          types.push(spellState.damageConfig.secondaryElementType);
        }

        // Priority 2: If no damageConfig types, check typeConfig (from Step 1)
        if (types.length === 0) {
          if (spellState.typeConfig?.school) {
            types.push(spellState.typeConfig.school);
          }
          if (spellState.typeConfig?.secondaryElement) {
            types.push(spellState.typeConfig.secondaryElement);
          }
        }

        return types;
      })(),

      // Tags - combine from multiple sources like Step 10 Review does
      tags: [
        ...(spellState.typeConfig?.tags || []),
        ...(spellState.effectTypes || []),
        ...(spellState.tags || [])
      ].filter(Boolean),
      effectTypes: spellState.effectTypes || [],

      // Resource costs
      resourceConfig: spellState.resourceConfig || null,
      resourceCost: spellState.resourceCost || null,
      manaCost: spellState.resourceConfig?.resourceAmount || 25,

      // Pyrofiend Inferno Veil costs - extract from resourceCost.resourceValues
      infernoRequired: spellState.resourceCost?.resourceValues?.inferno_required || 0,
      infernoAscend: spellState.resourceCost?.resourceValues?.inferno_ascend || 0,
      infernoDescend: spellState.resourceCost?.resourceValues?.inferno_descend || 0,

      // Utility configuration
      utilityConfig: spellState.utilityConfig || null,

      // Control configuration
      controlConfig: spellState.controlConfig || null,

      // Summoning configuration
      summonConfig: spellState.summonConfig || null,
      summoningConfig: spellState.summonConfig || null,

      // Transformation configuration
      transformConfig: spellState.transformConfig || null,
      transformationConfig: spellState.transformConfig || null,

      // Purification configuration
      purificationConfig: spellState.purificationConfig || null,

      // Restoration configuration
      restorationConfig: spellState.restorationConfig || null,

      // Trigger configuration
      triggerConfig: spellState.triggerConfig || null,

      // Trap configuration
      trapConfig: spellState.trapConfig || null,

      // Channeling configuration
      channelingConfig: spellState.channelingConfig || null,

      // Propagation configuration
      propagation: spellState.propagation || {
        method: 'none',
        behavior: '',
        parameters: {}
      },

      // Cooldown configuration
      cooldownConfig: spellState.cooldownConfig || null,

      // Rollable table configuration
      rollableTable: spellState.rollableTable || null,

      // Mechanics configuration - THIS WAS MISSING!
      effectMechanicsConfigs: spellState.effectMechanicsConfigs || {},

      // Spell library for proc system and other mechanics
      library: library,

      // Rarity
      rarity: spellState.rarity || 'uncommon'
    };
  };



  return ReactDOM.createPortal(
    <div style={{
      ...position,
      border: 'none !important',
      outline: 'none !important',
      boxShadow: 'none !important',
      transform: `scale(${windowScale})`,
      transformOrigin: 'top left'
    }}>
      <style>
        {`
          /* Live preview uses the same unified-spell-tags-footer styling from cards.css */
        `}
      </style>
      {(() => {
        return (
          <SpellCardWithProcs
            key={`preview-${state.lastModified?.getTime() || Date.now()}`}
            spell={createPreviewSpell()}
            variant="wizard"
            showActions={false}
            showDescription={true}
            showStats={true}
            showTags={true}
            rollableTableData={state.rollableTable}
            procPosition="right"
            showProcs={true}
            style={{
              border: 'none !important',
              outline: 'none !important'
            }}
          />
        );
      })()}

      {/* Completion Button */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <button
          onClick={handleCompleteSpell}
          disabled={isCompleting}
          style={{
            background: isCompleting
              ? 'linear-gradient(135deg, #666 0%, #888 50%, #666 100%)'
              : 'linear-gradient(135deg, #2E8B57 0%, #3CB371 50%, #2E8B57 100%)',
            border: '2px solid #228B22',
            borderRadius: '6px',
            padding: '10px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'Cinzel, serif',
            cursor: isCompleting ? 'not-allowed' : 'pointer',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
            boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            width: '100%'
          }}
          onMouseOver={(e) => {
            if (!isCompleting) {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!isCompleting) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.3)';
            }
          }}
        >
          {isCompleting ? 'Completing Spell...' : '✓ Complete Spell'}
        </button>

        {/* Completion Message */}
        {completionMessage && (
          <div style={{
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'Cinzel, serif',
            textAlign: 'center',
            background: completionMessage.includes('✓')
              ? 'rgba(46, 139, 87, 0.9)'
              : 'rgba(220, 20, 60, 0.9)',
            color: 'white',
            border: completionMessage.includes('✓')
              ? '1px solid #2E8B57'
              : '1px solid #DC143C',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            {completionMessage}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ExternalLivePreview;
