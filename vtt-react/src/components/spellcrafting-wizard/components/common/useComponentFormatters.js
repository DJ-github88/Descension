import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHandSparkles, faFlask } from '@fortawesome/free-solid-svg-icons';
import { formatComponentName } from './spellFormatterUtils';

const useComponentFormatters = ({ spell, library, className }) => {

  const formatSpellComponents = () => {
    if (!spell || !spell.resourceCost) {
      return null;
    }

    const components = [];

    // Check for spell components in resourceCost
    // Only add components if they have actual text - don't show empty components
    if (spell.resourceCost.components && spell.resourceCost.components.length > 0) {
      spell.resourceCost.components.forEach(component => {
        switch(component) {
          case 'verbal':
            // Only add verbal component if there's actual verbalText
            if (spell.resourceCost.verbalText && spell.resourceCost.verbalText.trim()) {
              components.push({
                type: 'verbal',
                symbol: 'V',
                name: 'Verbal',
                description: formatComponentName(spell.resourceCost.verbalText) || 'Requires speaking magical words',
                customText: spell.resourceCost.verbalText
              });
            }
            break;
          case 'somatic':
            // Only add somatic component if there's actual somaticText
            if (spell.resourceCost.somaticText && spell.resourceCost.somaticText.trim()) {
              components.push({
                type: 'somatic',
                symbol: 'S',
                name: 'Somatic',
                description: formatComponentName(spell.resourceCost.somaticText) || 'Requires specific hand gestures',
                customText: spell.resourceCost.somaticText
              });
            }
            break;
          case 'material':
            // Only add material component if there's actual materialComponents
            if (spell.resourceCost.materialComponents && spell.resourceCost.materialComponents.trim()) {
              components.push({
                type: 'material',
                symbol: 'M',
                name: 'Material',
                description: formatComponentName(spell.resourceCost.materialComponents) || 'Requires specific materials',
                customText: spell.resourceCost.materialComponents
              });
            }
            break;
        }
      });
    }

    if (components.length === 0) {
      return null;
    }

    return (
      <div className="pf-spell-components">
        {components.map((component, index) => (
          <div key={index} className="pf-component-row">
            <span
              className={`pf-component ${component.type}`}
              title={component.customText || component.description}
            >
              <FontAwesomeIcon
                icon={component.type === 'verbal' ? faComment :
                      component.type === 'somatic' ? faHandSparkles :
                      component.type === 'material' ? faFlask : faComment}
                style={{
                  color: '#FFFFFF',
                  textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000'
                }}
              />
            </span>
            {component.customText && (
              <span className="component-custom-text">
                {formatComponentName(component.customText)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Format material components as text
  const formatMaterialComponentsText = () => {
    if (!spell || !spell.resourceCost) return null;

    // Check for material components in resourceCost
    const materialComponents = [];

    if (spell.resourceCost.materialComponents && Array.isArray(spell.resourceCost.materialComponents)) {
      materialComponents.push(...spell.resourceCost.materialComponents.map(item => formatComponentName(item.name || item)));
    } else if (spell.resourceCost.materialComponents && typeof spell.resourceCost.materialComponents === 'string') {
      materialComponents.push(formatComponentName(spell.resourceCost.materialComponents));
    }

    if (materialComponents.length === 0) return null;

    return (
      <div className="pf-spell-material-components">
        <span className="material-label">Materials: </span>
        <span className="material-list">{materialComponents.join(', ')}</span>
      </div>
    );
  };

  // ===== MECHANICS FORMATTING =====
  const formatMechanics = () => {
    const mechanicsElements = [];

    // Process effect-specific mechanics
    if (spell.effectMechanicsConfigs) {
      Object.entries(spell.effectMechanicsConfigs).forEach(([effectId, config]) => {
        if (!config?.enabled) return;

        let effectName = 'Effect';
        if (effectId === 'effect_damage') effectName = 'Damage';
        else if (effectId === 'effect_healing') effectName = 'Healing';
        else if (effectId === 'effect_buff') effectName = 'Buff';
        else if (effectId === 'effect_debuff') effectName = 'Debuff';
        else if (effectId === 'effect_utility') effectName = 'Utility';
        else if (effectId === 'effect_control') effectName = 'Control';

        const mechanicData = processMechanicConfig(config, effectName);
        if (mechanicData) {
          mechanicsElements.push(mechanicData);
        }
      });
    }

    // Process global mechanics (mechanicsConfig array)
    if (spell.mechanicsConfig && Array.isArray(spell.mechanicsConfig)) {
      spell.mechanicsConfig.forEach((config) => {
        if (!config?.enabled) return;

        const mechanicData = processMechanicConfig(config, 'Global');
        if (mechanicData) {
          mechanicsElements.push(mechanicData);
        }
      });
    }

    // Process graduated effects
    const graduatedEffects = formatGraduatedEffects();
    if (graduatedEffects && graduatedEffects.length > 0) {
      mechanicsElements.push(...graduatedEffects);
    }

    return mechanicsElements.length > 0 ? mechanicsElements : null;
  };
  // ===== GRADUATED EFFECTS FORMATTING =====
  const formatGraduatedEffects = () => {
    const graduatedElements = [];

    // Check for graduated effects in toxic system mechanics
    if (spell.effectMechanicsConfigs) {
      Object.entries(spell.effectMechanicsConfigs).forEach(([, config]) => {
        if (!config?.enabled || config.system !== 'TOXIC_SYSTEM' || config.type !== 'toxic_consumer') return;

        const graduatedEffects = config.toxicOptions?.graduatedEffects;
        if (!graduatedEffects || Object.keys(graduatedEffects).length === 0) return;

        // Sort levels numerically
        const sortedLevels = Object.keys(graduatedEffects)
          .map(Number)
          .sort((a, b) => a - b);

        sortedLevels.forEach(level => {
          const effect = graduatedEffects[level];
          if (!effect) return;

          let mechanicsText = '';
          const requiredToxics = effect.requiredToxicTypes || {};
          const requiredCount = Object.values(requiredToxics).reduce((sum, count) => sum + count, 0);

          if (requiredCount > 0) {
            const toxicNames = Object.entries(requiredToxics)
              .filter(([_, count]) => count > 0)
              .map(([type, count]) => {
                const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                return count > 1 ? `${count}x ${capitalizedType}` : capitalizedType;
              });

            mechanicsText = `${requiredCount} Toxic${requiredCount > 1 ? 's' : ''} (${toxicNames.join(', ')})`;
          } else {
            mechanicsText = `${level} Toxic${level > 1 ? 's' : ''}`;
          }

          if (effect.formula && effect.formula !== 'damage') {
            mechanicsText += `: ${effect.formula}`;
          }

          if (effect.description && effect.description !== mechanicsText) {
            mechanicsText += ` - ${effect.description}`;
          }

          graduatedElements.push({
            effectName: 'Toxic Consumer',
            mechanicsText: mechanicsText,
            systemType: 'Graduated Effects',
            system: 'graduated_effects'
          });
        });
      });
    }

    // Check for graduated effects in chord and toxic system mechanics
    if (spell.effectMechanicsConfigs) {
      Object.entries(spell.effectMechanicsConfigs).forEach(([, config]) => {
        if (!config?.enabled) return;

        // Handle Chord System graduated effects
        if (config.system === 'CHORD_SYSTEM' && config.type === 'chord') {
          const graduatedEffects = config.chordOptions?.graduatedEffects;
          if (!graduatedEffects || Object.keys(graduatedEffects).length === 0) return;

          // Sort levels numerically
          const sortedLevels = Object.keys(graduatedEffects)
            .map(Number)
            .sort((a, b) => a - b);

          sortedLevels.forEach(level => {
            const effect = graduatedEffects[level];
            if (!effect) return;

            let mechanicsText = '';

            // Determine match type and requirements
            const requiredChords = effect.requiredToxicTypes || {};
            const requiredChordNames = Object.keys(requiredChords).map(chordId => {
              const chordName = chordId.charAt(0).toUpperCase() + chordId.slice(1);
              const count = requiredChords[chordId];
              return count > 1 ? `${chordName} (${count})` : chordName;
            });

            // Always show specific chord functions if they are configured
            if (requiredChordNames.length > 0) {
              mechanicsText = `${requiredChordNames.join(', ')}`;
            } else {
              mechanicsText = `${level} Chord Function${level > 1 ? 's' : ''}`;
            }

            if (effect.formula && effect.formula !== 'damage') {
              mechanicsText += `: ${effect.formula}`;
            }

            if (effect.description && effect.description !== mechanicsText) {
              mechanicsText += ` - ${effect.description}`;
            }

            graduatedElements.push({
              effectName: 'Chord System',
              mechanicsText: mechanicsText,
              systemType: 'Graduated Effects',
              system: 'graduated_effects'
            });
          });
        }

        // Handle Toxic System graduated effects
        if (config.system === 'TOXIC_SYSTEM' && (config.type === 'toxic_applier' || config.type === 'toxic_consumer')) {
          const graduatedEffects = config.toxicOptions?.toxicEffects;
          if (!graduatedEffects || Object.keys(graduatedEffects).length === 0) return;

          // Sort levels numerically
          const sortedLevels = Object.keys(graduatedEffects)
            .map(Number)
            .sort((a, b) => a - b);

          sortedLevels.forEach(level => {
            const effect = graduatedEffects[level];
            if (!effect) return;

            let mechanicsText = '';

            // Determine match type and requirements
            const matchType = effect.matchType || 'count';
            const requiredToxics = effect.requiredToxicTypes || {};
            const requiredToxicNames = Object.keys(requiredToxics).map(toxicId => {
              const toxicName = toxicId.charAt(0).toUpperCase() + toxicId.slice(1);
              const count = requiredToxics[toxicId];
              return count > 1 ? `${toxicName} (${count})` : toxicName;
            });

            // Always show specific toxic types if they are configured
            if (requiredToxicNames.length > 0) {
              mechanicsText = `${requiredToxicNames.join(', ')}`;
            } else {
              mechanicsText = `${level} Toxic Type${level > 1 ? 's' : ''}`;
            }

            if (effect.formula && effect.formula !== 'damage') {
              mechanicsText += `: ${effect.formula}`;
            }

            if (effect.description && effect.description !== mechanicsText) {
              mechanicsText += ` - ${effect.description}`;
            }

            graduatedElements.push({
              effectName: 'Toxic System',
              mechanicsText: mechanicsText,
              systemType: 'Graduated Effects',
              system: 'graduated_effects'
            });
          });
        }
      });
    }

    return graduatedElements;
  };

  // Helper function to process individual mechanic configurations
  const processMechanicConfig = (config, effectName) => {
    let mechanicsText = '';
    let systemType = '';

    switch (config.system) {
      case 'COMBO_POINTS':
        systemType = 'Combo Points';
        if (config.type === 'builder') {
          mechanicsText = 'Generates 1 combo point';
        } else if (config.type === 'spender') {
          mechanicsText = `Requires ${config.thresholdValue} combo points`;
          if (config.comboOptions?.consumptionRule === 'all') {
            mechanicsText += ' (consumes all)';
          } else if (config.comboOptions?.consumptionRule === 'none') {
            mechanicsText += ' (no consumption)';
          }
        }
        break;

        case 'PROC_SYSTEM':
          systemType = 'Proc System';
          mechanicsText = `${config.procOptions?.procChance || 15}% chance to trigger`;
          if (config.procOptions?.spellId) {
            // Try to find the spell name from the library context
            const linkedSpell = library?.spells?.find(s => s.id === config.procOptions.spellId);
            if (linkedSpell) {
              // Create a simple spell description
              let spellDesc = linkedSpell.name;

              // Add basic damage/healing info if available
              if (linkedSpell.damageConfig?.formula) {
                spellDesc += ` (${linkedSpell.damageConfig.formula} damage)`;
              } else if (linkedSpell.healingConfig?.formula) {
                spellDesc += ` (${linkedSpell.healingConfig.formula} healing)`;
              } else if (linkedSpell.buffConfig?.formula) {
                spellDesc += ` (${linkedSpell.buffConfig.formula} buff)`;
              }

              mechanicsText += ` ${spellDesc}`;
            } else {
              mechanicsText += ' linked spell';
            }
          } else {
            mechanicsText += ' additional effect';
          }
          if (config.procOptions?.triggerLimit > 1) {
            mechanicsText += ` (max ${config.procOptions.triggerLimit}/round)`;
          }
          break;

        case 'TOXIC_SYSTEM':
          systemType = 'Toxic System';
          if (config.type === 'toxic_applier') {
            const toxicTypes = config.toxicOptions?.selectedToxicTypes || {};
            const duration = config.toxicOptions?.duration || 3;
            const durationType = config.toxicOptions?.durationType || 'rounds';

            // Create detailed toxic effects list
            const toxicEffects = [];
            Object.entries(toxicTypes).forEach(([type, count]) => {
              if (count > 0) {
                const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                toxicEffects.push(`${count}x ${capitalizedType}`);
              }
            });

            if (toxicEffects.length > 0) {
              mechanicsText = `Applies ${toxicEffects.join(', ')} for ${duration} ${durationType}`;
            } else {
              mechanicsText = 'Applies toxic effects (not configured)';
            }
          } else if (config.type === 'toxic_consumer') {
            const toxicTypes = config.toxicOptions?.selectedToxicTypes || {};
            const consumptionRule = config.toxicOptions?.consumptionRule || 'all';
            const updateFormula = config.toxicOptions?.updateFormula;

            // Create detailed consumption description
            const consumedEffects = [];
            Object.entries(toxicTypes).forEach(([type, count]) => {
              if (count > 0) {
                const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                consumedEffects.push(`${count}x ${capitalizedType}`);
              }
            });

            if (consumedEffects.length > 0) {
              mechanicsText = `Consumes ${consumedEffects.join(', ')}`;
              if (updateFormula) {
                mechanicsText += ' for enhanced effects';
              }
            } else {
              const ruleText = consumptionRule === 'all' ? 'all toxics' :
                             consumptionRule === 'specific' ? 'specific toxics' :
                             'threshold-based toxics';
              mechanicsText = `Consumes ${ruleText} for enhanced effects`;
            }
          }
          break;

        case 'CHORD_SYSTEM':
          systemType = 'Chord System';
          if (config.type === 'chord') {
            const recipeDisplay = config.chordOptions?.recipeDisplay || [];
            if (recipeDisplay.length > 0) {
              const recipeNames = recipeDisplay.map(chord => chord.name).join(' → ');
              mechanicsText = `Requires chord: ${recipeNames}`;
              if (config.chordOptions?.improvisationWindow) {
                mechanicsText += ` (${config.chordOptions.improvisationWindow} rounds)`;
              }
            } else {
              mechanicsText = 'Requires chord sequence (not configured)';
            }
          } else if (config.type === 'note') {
            const chordFunction = config.chordOptions?.chordFunction || 'tonic';
            // Capitalize the chord function name
            const functionName = chordFunction.charAt(0).toUpperCase() + chordFunction.slice(1).replace('_', ' ');
            mechanicsText = `Plays ${functionName} note`;
          } else if (config.type === 'wildcard') {
            mechanicsText = 'Wildcard note (any chord function)';
          } else if (config.type === 'extender') {
            const duration = config.chordOptions?.extendDuration || 1;
            mechanicsText = `Extends improvisation window by ${duration} round${duration !== 1 ? 's' : ''}`;
          }
          break;

        case 'STATE_REQUIREMENTS':
          systemType = 'State Requirements';
          const resourceType = config.stateOptions?.resourceType || 'health';
          const thresholdType = config.stateOptions?.thresholdType || 'below';
          const thresholdValue = config.stateOptions?.thresholdValue || 50;
          const modifiedFormula = config.stateOptions?.modifiedFormula;
          const capitalizedResource = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

          mechanicsText = `Enhanced when target ${capitalizedResource} is ${thresholdType} ${thresholdValue}%`;
          if (modifiedFormula) {
            mechanicsText += ` (formula becomes: ${modifiedFormula})`;
          }
          break;

        case 'FORM_SYSTEM':
          systemType = 'Form System';
          const formType = config.formOptions?.formType?.replace('_', ' ') || 'specific form';
          const requiresForm = config.formOptions?.requiresForm;
          const bonusType = config.formOptions?.bonusType || 'damage';
          const bonusAmount = config.formOptions?.bonusAmount || 20;
          const formSpellId = config.formOptions?.formSpellId;

          const capitalizedForm = formType.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');

          mechanicsText = `${requiresForm ? 'Requires' : 'Enhanced by'} ${capitalizedForm}`;

          // Add bonus information
          mechanicsText += ` (+${bonusAmount}% ${bonusType})`;

          // Add form spell information if available
          if (formSpellId) {
            const formSpell = library?.spells?.find(s => s.id === formSpellId);
            if (formSpell) {
              mechanicsText += ` using ${formSpell.name}`;
            } else {
              mechanicsText += ` using linked form spell`;
            }
          }
          break;

        case 'PROPHECY':
          return null;

        default:
          systemType = config.system.replace('_', ' ');
          mechanicsText = `${config.system.replace('_', ' ').toLowerCase()} mechanic`;
    }

    if (mechanicsText) {
      return {
        effectName,
        mechanicsText,
        systemType,
        system: config.system
      };
    }

    return null;
  };

  // ===== CHANCE ON HIT FORMATTING =====

  return {
    formatSpellComponents,
    formatMaterialComponentsText,
    formatMechanics,
    formatGraduatedEffects,
    processMechanicConfig,
  };
};

export default useComponentFormatters;