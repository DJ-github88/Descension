import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHandSparkles, faFlask } from '@fortawesome/free-solid-svg-icons';
import { formatComponentName } from './spellFormatterUtils';

const useComponentFormatters = ({ spell, library, className }) => {

  const formatSpellComponents = () => {
    if (!spell) {
      return null;
    }

    const cost = spell.resourceCost || {};
    let compList = [];
    if (Array.isArray(cost.components)) {
      compList = [...cost.components];
    } else if (Array.isArray(spell.components)) {
      compList = [...spell.components];
    } else if (cost.components && typeof cost.components === 'object') {
      compList = Object.entries(cost.components).filter(([_, v]) => Boolean(v)).map(([k]) => k);
    } else if (spell.components && typeof spell.components === 'object') {
      compList = Object.entries(spell.components).filter(([_, v]) => Boolean(v)).map(([k]) => k);
    }

    const verbalText = cost.verbalText ?? spell.verbalText;
    const somaticText = cost.somaticText ?? spell.somaticText;
    const materialText = cost.materialText ?? spell.materialText;
    const materialComponents = cost.materialComponents ?? spell.materialComponents;

    if (verbalText && !compList.includes('verbal')) compList.push('verbal');
    if (somaticText && !compList.includes('somatic')) compList.push('somatic');
    if ((materialComponents || materialText) && !compList.includes('material')) compList.push('material');

    if (compList.length === 0) return null;

    const components = compList.map(component => {
      switch(component) {
        case 'verbal':
          return {
            type: 'verbal',
            symbol: 'V',
            name: 'Verbal',
            description: (verbalText && formatComponentName(verbalText)) || 'Verbal component required (no specific incantation authored; GM/tabletop-managed)',
            customText: verbalText || null
          };
        case 'somatic':
          return {
            type: 'somatic',
            symbol: 'S',
            name: 'Somatic',
            description: (somaticText && formatComponentName(somaticText)) || 'Somatic component required (no specific gestures authored; GM/tabletop-managed)',
            customText: somaticText || null
          };
        case 'material': {
          const matDesc = materialText || (typeof materialComponents === 'string' && materialComponents ? materialComponents : null);
          return {
            type: 'material',
            symbol: 'M',
            name: 'Material',
            description: (matDesc && formatComponentName(matDesc)) || 'Material component required (no specific materials authored; GM/tabletop-managed)',
            customText: matDesc || null
          };
        }
        default: {
          const extText = cost[`${component}Text`] ?? spell[`${component}Text`];
          return {
            type: component,
            symbol: component.charAt(0).toUpperCase(),
            name: formatComponentName(component),
            description: (extText && formatComponentName(extText)) || `${formatComponentName(component)} required (GM/tabletop-managed)`,
            customText: extText || null
          };
        }
      }
    });

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
    if (!spell) return null;
    const cost = spell.resourceCost || {};
    const materialComponents = [];

    const matComp = cost.materialComponents ?? spell.materialComponents;
    const matText = cost.materialText ?? spell.materialText;

    if (matComp && Array.isArray(matComp)) {
      materialComponents.push(...matComp.map(item => formatComponentName(item.name || item)));
    } else if (matComp && typeof matComp === 'string' && matComp.trim()) {
      materialComponents.push(formatComponentName(matComp.trim()));
    }
    if (matText && typeof matText === 'string' && matText.trim()) {
      const formatted = formatComponentName(matText.trim());
      if (!materialComponents.includes(formatted)) {
        materialComponents.push(formatted);
      }
    }

    if (materialComponents.length === 0) return null;

    return (
      <div className="pf-spell-material-components">
        <span className="material-label">Materials: </span>
        <span className="material-list">{materialComponents.join(', ')}</span>
        <span className="material-note"> (not automatically consumed; GM/tabletop-managed)</span>
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
          const genAmount = config.comboOptions?.generationAmount || 1;
          mechanicsText = `Generates ${genAmount} combo point${Number(genAmount) === 1 ? '' : 's'}`;
        } else if (config.type === 'spender') {
          const count = config.thresholdValue || 1;
          mechanicsText = `Requires ${count} combo point${Number(count) === 1 ? '' : 's'}`;
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

        case 'STATE_REQUIREMENTS': {
          systemType = 'State Requirements';
          const subject = config.stateOptions?.targetType === 'caster' ? 'caster' : 'target';
          if (config.type === 'combat_state') {
            const combatState = config.stateOptions?.combatState || 'in_combat';
            const stateLabels = {
              'in_combat': 'in combat',
              'out_of_combat': 'out of combat',
              'stealthed': 'stealthed',
              'surprised': 'surprised',
              'bloodied': 'bloodied'
            };
            const label = stateLabels[combatState] || combatState.replace('_', ' ');
            mechanicsText = `Enhanced when ${subject} is ${label}`;
          } else {
            const isHealth = config.type === 'health_threshold';
            const rawResource = isHealth ? 'health' : (config.stateOptions?.resourceType || 'mana');
            const resourceType = rawResource === 'health' && !isHealth ? 'mana' : rawResource;
            const thresholdType = config.stateOptions?.thresholdType || 'below';
            const thresholdValue = config.stateOptions?.thresholdValue ?? (isHealth ? 20 : 50);
            const capitalizedResource = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

            mechanicsText = `Enhanced when ${subject} ${capitalizedResource} is ${thresholdType} ${thresholdValue}%`;
          }
          if (config.stateOptions?.modifiedFormula) {
            mechanicsText += ` (formula becomes: ${config.stateOptions.modifiedFormula})`;
          }
          break;
        }

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
        case 'PROPHECY_SYSTEM':
          systemType = 'Prophecy';
          if (config.type === 'prophecy_builder') {
            const range = config.prophecyOptions?.rangeDice || 'd8+d6';
            const res = config.prophecyOptions?.resolutionDie || 'd6';
            mechanicsText = `Sets Prophecy (${range} vs ${res})`;
          } else if (config.type === 'prophecy_detonator') {
            mechanicsText = 'Resolves active prophecies on target';
          } else {
            mechanicsText = 'Prophecy mechanic';
          }
          break;

        default:
          systemType = config.system ? config.system.replace('_', ' ') : 'Mechanic';
          mechanicsText = `${systemType.toLowerCase()} mechanic`;
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