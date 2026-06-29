const useTriggerFormatters = ({ spell, library }) => {

  const formatChanceOnHit = () => {
    const chanceConfig = spell.damageConfig?.chanceOnHitConfig || spell.healingConfig?.chanceOnHitConfig || spell.chanceOnHitConfig;
    if (!chanceConfig?.enabled) return null;

    const { procType, procChance, diceThreshold, cardProcRule, coinProcRule, coinCount,
            spellEffect, useRollableTable, procSuit, customEffects } = chanceConfig;

    let procText = '';
    let effectText = '';

    // Determine what effect happens
    if (useRollableTable) {
      effectText = 'triggers rollable table';
    } else if (spellEffect) {
      // Try to get spell name from library or use ID
      effectText = `casts ${spellEffect}`;
    } else if (customEffects && customEffects.length > 0) {
      // Format custom effects with detailed information
      const formattedEffects = customEffects.map(effect => {
        const effectName = effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Special handling for slow effect - show detailed information
        if (effect === 'slow' || effect === 'slowed') {
          const slowConfig = chanceConfig.slowConfig || {};
          const speedReduction = slowConfig.speedReduction || slowConfig.slowAmount || 30;
          const speedReductionType = slowConfig.speedReductionType || 'percentage';
          const duration = slowConfig.duration || slowConfig.durationValue || 2;
          const durationUnit = slowConfig.durationUnit || slowConfig.durationType || 'rounds';
          const saveDC = slowConfig.saveDC || slowConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = slowConfig.saveType || slowConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          const speedText = speedReductionType === 'flat' 
            ? `${speedReduction} feet speed reduction`
            : `${speedReduction}% speed reduction`;
          
          let slowDetails = `${effectName} (${speedText}`;
          if (duration) {
            const durationText = duration === 1 ? `1 ${durationUnit}` : `${duration} ${durationUnit}`;
            slowDetails += `, ${durationText}`;
          }
          if (saveDC) {
            slowDetails += `, DC ${saveDC} ${saveType} save`;
          }
          slowDetails += ')';
          return slowDetails;
        }
        
        // Special handling for burning effect - show detailed information
        if (effect === 'burning' || effect === 'burn') {
          const burningConfig = chanceConfig.burningConfig || {};
          const damagePerRound = burningConfig.damagePerRound || burningConfig.damage || '1d6';
          const duration = burningConfig.duration || burningConfig.durationValue || 2;
          const durationUnit = burningConfig.durationUnit || burningConfig.durationType || 'rounds';
          const saveDC = burningConfig.saveDC || burningConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = burningConfig.saveType || burningConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          let burningDetails = `${effectName} (${damagePerRound} fire damage per round`;
          if (duration) {
            const durationText = duration === 1 ? `1 ${durationUnit}` : `${duration} ${durationUnit}`;
            burningDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            burningDetails += `, DC ${saveDC} ${saveType} save ends early`;
          }
          burningDetails += ')';
          return burningDetails;
        }
        
        // Special handling for stun effect - show detailed information
        if (effect === 'stun' || effect === 'stunned') {
          const stunConfig = chanceConfig.stunConfig || {};
          const duration = stunConfig.duration || stunConfig.durationValue || 1;
          const durationUnit = stunConfig.durationUnit || stunConfig.durationType || 'round';
          const saveDC = stunConfig.saveDC || stunConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = stunConfig.saveType || stunConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          let stunDetails = `${effectName} (cannot take actions or reactions`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            stunDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            stunDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          stunDetails += ')';
          return stunDetails;
        }
        
        // Special handling for knockback effect - show detailed information
        if (effect === 'knockback' || effect === 'push') {
          const knockbackConfig = chanceConfig.knockbackConfig || {};
          const distance = knockbackConfig.distance || knockbackConfig.pushDistance || 10;
          
          return `${effectName} (pushed back ${distance} feet)`;
        }
        
        // Special handling for shock effect - show detailed information
        if (effect === 'shock' || effect === 'shocked') {
          const shockConfig = chanceConfig.shockConfig || {};
          const duration = shockConfig.duration || shockConfig.durationValue || 1;
          const durationUnit = shockConfig.durationUnit || shockConfig.durationType || 'round';
          
          let shockDetails = `${effectName} (reduces action economy`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            shockDetails += ` for ${durationText}`;
          }
          shockDetails += ')';
          return shockDetails;
        }
        
        // Special handling for freeze effect - show detailed information
        if (effect === 'freeze' || effect === 'frozen') {
          const freezeConfig = chanceConfig.freezeConfig || {};
          const speedReduction = freezeConfig.speedReduction || 50;
          const duration = freezeConfig.duration || freezeConfig.durationValue || 1;
          const durationUnit = freezeConfig.durationUnit || freezeConfig.durationType || 'round';
          const saveDC = freezeConfig.saveDC || freezeConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = freezeConfig.saveType || freezeConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          let freezeDetails = `${effectName} (${speedReduction}% speed reduction`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            freezeDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            freezeDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          freezeDetails += ')';
          return freezeDetails;
        }
        
        // Special handling for disarm effect - show detailed information
        if (effect === 'disarm' || effect === 'disarmed') {
          return `${effectName} (target drops their weapon)`;
        }
        
        // Special handling for fear effect - show detailed information
        if (effect === 'fear' || effect === 'frightened') {
          const fearConfig = chanceConfig.fearConfig || {};
          const duration = fearConfig.duration || fearConfig.durationValue || 2;
          const durationUnit = fearConfig.durationUnit || fearConfig.durationType || 'rounds';
          const saveDC = fearConfig.saveDC || fearConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = fearConfig.saveType || fearConfig.savingThrowType || chanceConfig.saveType || 'spirit';
          
          let fearDetails = `${effectName} (target is frightened`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const isPlural = durationUnit.endsWith('s') || duration !== 1;
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            fearDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            fearDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          fearDetails += ')';
          return fearDetails;
        }
        
        // Default: return capitalized effect name
        return effectName;
      }).join(', ');
      effectText = formattedEffects;
    } else {
      effectText = 'triggers effect';
    }

    // Format based on resolution type
    switch (procType) {
      case 'dice':
        procText = `Roll d20: ${diceThreshold}+ (${procChance}%) ${effectText}`;
        break;
      case 'cards':
        let cardRule = '';
        let cardChance = '';

        if (cardProcRule === 'face_cards') {
          cardRule = 'Face Cards (J,Q,K)';
          cardChance = '23%';
        } else if (cardProcRule === 'aces') {
          cardRule = 'Aces';
          cardChance = '8%';
        } else if (cardProcRule === 'specific_suit') {
          cardRule = `${procSuit?.charAt(0).toUpperCase() + procSuit?.slice(1) || 'Hearts'} suit`;
          cardChance = '25%';
        } else if (cardProcRule === 'red_cards') {
          cardRule = 'Red Cards';
          cardChance = '50%';
        } else if (cardProcRule === 'black_cards') {
          cardRule = 'Black Cards';
          cardChance = '50%';
        } else if (cardProcRule === 'pairs') {
          cardRule = 'Pairs';
          cardChance = '6%';
        } else {
          cardRule = cardProcRule.replace('_', ' ');
          cardChance = '25%';
        }

        procText = `Draw card: ${cardRule} (${cardChance}) ${effectText}`;
        break;
      case 'coins':
        let coinRule = '';
        let coinChance = '';

        if (coinProcRule === 'all_heads') {
          coinRule = 'All Heads';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'all_tails') {
          coinRule = 'All Tails';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'sequence') {
          coinRule = 'Specific Sequence';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'pattern') {
          coinRule = 'Pattern Match';
          coinChance = '25%';
        } else {
          coinRule = coinProcRule.replace('_', ' ');
          coinChance = '50%';
        }

        procText = `Flip ${coinCount} coins: ${coinRule} (${coinChance}) ${effectText}`;
        break;
      default:
        procText = `${procChance}% chance ${effectText}`;
    }

    return procText;
  };
  // ===== TRIGGER FORMATTING HELPER =====
  // Helper to format trigger ID when trigger object isn't available
  const formatTriggerId = (triggerId) => {
    if (!triggerId || triggerId === 'default') return 'Default';
    
    // Handle common trigger IDs with plain English formatting
    const triggerIdMap = {
      'spell_interrupt': 'a spell is interrupted',
      'spell_interrupted': 'a spell is interrupted',
      'last_ally_standing': 'I am the last ally standing',
      'last_stand': 'I am the last ally standing',
      'movement_end': 'movement stops',
      'movement_start': 'movement starts',
      'health_threshold': 'health threshold is reached',
      'damage_taken': 'damage is taken',
      'damage_dealt': 'damage is dealt',
      'critical_hit': 'a critical hit lands',
      'turn_start': 'turn starts',
      'turn_end': 'turn ends',
      'combat_start': 'combat starts',
      'combat_end': 'combat ends'
    };
    
    // Check if we have a mapping
    if (triggerIdMap[triggerId]) {
      return triggerIdMap[triggerId];
    }
    
    // Convert snake_case to readable text
    return triggerId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTriggerText = (trigger) => {
    if (!trigger) return 'Unknown trigger';

    let displayText = trigger.name;

    // Handle all trigger types with comprehensive parameter support
    if (trigger.id === 'damage_taken') {
      const amount = trigger.parameters?.amount;
      const damageType = trigger.parameters?.damage_type;
      const perspective = trigger.parameters?.perspective || 'self';

      const whoMap = {
        'self': 'I take',
        'target': 'my target takes',
        'ally': 'an ally takes',
        'enemy': 'an enemy takes',
        'any': 'anyone takes'
      };

      displayText = `When ${whoMap[perspective]}`;
      if (amount) displayText += ` ${amount} pts of`;
      if (damageType && damageType !== 'any') {
        displayText += ` ${damageType}`;
      }
      displayText += ' damage';
    } else if (trigger.id === 'damage_dealt') {
      const perspective = trigger.parameters?.perspective || 'self';
      const amount = trigger.parameters?.amount || '';
      const damageType = trigger.parameters?.damage_type || 'any';

      const whoMap = {
        'self': 'I deal',
        'target': 'my target deals',
        'ally': 'an ally deals',
        'enemy': 'an enemy deals',
        'any': 'anyone deals'
      };

      displayText = `When ${whoMap[perspective] || 'I deal'}`;
      if (amount) displayText += ` ${amount} pts of`;
      if (damageType && damageType !== 'any') displayText += ` ${damageType}`;
      displayText += ' damage';
    } else if (trigger.id === 'critical_hit') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I land',
        'target': 'my target lands',
        'ally': 'an ally lands',
        'enemy': 'an enemy lands',
        'any': 'anyone lands'
      };
      displayText = `When ${whoMap[perspective]} a critical hit`;
    } else if (trigger.id === 'critical_hit_taken') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I receive',
        'target': 'my target receives',
        'ally': 'an ally receives',
        'enemy': 'an enemy receives',
        'any': 'anyone receives'
      };
      displayText = `When ${whoMap[perspective]} a critical hit`;
    } else if (trigger.id === 'miss') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When an enemy\'s attack misses me',
        'target': 'When my target\'s attack misses',
        'ally': 'When an ally\'s attack misses',
        'enemy': 'When an enemy\'s attack misses',
        'any': 'When anyone\'s attack misses'
      };
      displayText = whoMap[perspective] || 'When an enemy\'s attack misses me';
    } else if (trigger.id === 'dodge') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I dodge an attack',
        'target': 'When my target dodges an attack',
        'ally': 'When an ally dodges an attack',
        'enemy': 'When an enemy dodges an attack',
        'any': 'When anyone dodges an attack'
      };
      displayText = whoMap[perspective] || 'When I dodge an attack';
    } else if (trigger.id === 'parry') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I parry an attack',
        'target': 'When my target parries an attack',
        'ally': 'When an ally parries an attack',
        'enemy': 'When an enemy parries an attack',
        'any': 'When anyone parries an attack'
      };
      displayText = whoMap[perspective] || 'When I parry an attack';
    } else if (trigger.id === 'block') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I block an attack',
        'target': 'When my target blocks an attack',
        'ally': 'When an ally blocks an attack',
        'enemy': 'When an enemy blocks an attack',
        'any': 'When anyone blocks an attack'
      };
      displayText = whoMap[perspective] || 'When I block an attack';
    } else if (trigger.id === 'leave_area') {
      const perspective = trigger.parameters?.perspective || 'self';
      const areaType = trigger.parameters?.area_type || 'area';
      const whoMap = {
        'self': 'I leave',
        'target': 'my target leaves',
        'ally': 'an ally leaves',
        'enemy': 'an enemy leaves',
        'any': 'anyone leaves'
      };
      displayText = `When ${whoMap[perspective] || 'I leave'} ${areaType}`;
    } else if (trigger.id === 'enter_area') {
      const perspective = trigger.parameters?.perspective || 'self';
      const areaType = trigger.parameters?.area_type || 'area';
      const whoMap = {
        'self': 'I enter',
        'target': 'my target enters',
        'ally': 'an ally enters',
        'enemy': 'an enemy enters',
        'any': 'anyone enters'
      };
      displayText = `When ${whoMap[perspective] || 'I enter'} ${areaType}`;
    } else if (trigger.id === 'proximity') {
      const distance = trigger.parameters?.distance || 30;
      const entityType = trigger.parameters?.entity_type || 'any';
      const entityMap = {
        'any': 'anyone',
        'ally': 'an ally',
        'enemy': 'an enemy',
        'self': 'I'
      };
      displayText = `When ${entityMap[entityType] || 'anyone'} comes within ${distance} ft`;
    } else if (trigger.id === 'health_threshold') {
      const perspective = trigger.parameters?.perspective || 'self';
      const percentage = trigger.parameters?.percentage || 50;
      const comparison = trigger.parameters?.comparison || 'below';
      const whoMap = {
        'self': 'my health',
        'target': 'target\'s health',
        'ally': 'ally\'s health',
        'enemy': 'enemy\'s health',
        'any': 'anyone\'s health'
      };
      // Map all possible comparison values (both new format and legacy)
      const compMap = {
        'less_than': 'falls below',
        'greater_than': 'rises above',
        'equal': 'equals',
        'below': 'falls below',  // Legacy support
        'above': 'rises above',  // Legacy support
        'equals': 'equals'      // Legacy support
      };
      displayText = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;
    } else if (trigger.id === 'spell_cast') {
      const spellName = trigger.parameters?.spell_name;
      const spellLevel = trigger.parameters?.spell_level;
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I cast',
        'target': 'my target casts',
        'ally': 'an ally casts',
        'enemy': 'an enemy casts',
        'any': 'anyone casts'
      };
      displayText = `When ${whoMap[perspective]}`;
      if (spellName) {
        displayText += ` ${spellName}`;
      } else if (spellLevel) {
        displayText += ` a level ${spellLevel} spell`;
      } else {
        displayText += ' a spell';
      }
    } else if (trigger.id === 'spell_interrupt' || trigger.id === 'spell_interrupted') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'a spell I cast is interrupted',
        'target': 'a spell my target casts is interrupted',
        'ally': 'a spell an ally casts is interrupted',
        'enemy': 'a spell an enemy casts is interrupted',
        'any': 'a spell is interrupted'
      };
      displayText = `When ${whoMap[perspective] || 'a spell is interrupted'}`;
    } else if (trigger.id === 'turn_start') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'my turn starts',
        'target': 'target\'s turn starts',
        'ally': 'ally\'s turn starts',
        'enemy': 'enemy\'s turn starts',
        'any': 'anyone\'s turn starts'
      };
      displayText = `When ${whoMap[perspective] || 'my turn starts'}`;
    } else if (trigger.id === 'turn_end') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'my turn ends',
        'target': 'target\'s turn ends',
        'ally': 'ally\'s turn ends',
        'enemy': 'enemy\'s turn ends',
        'any': 'anyone\'s turn ends'
      };
      displayText = `When ${whoMap[perspective] || 'my turn ends'}`;
    } else if (trigger.id === 'combat_start') {
      displayText = 'When combat starts';
    } else if (trigger.id === 'combat_end') {
      displayText = 'When combat ends';
    } else if (trigger.id === 'low_health') {
      const threshold = trigger.parameters?.threshold || 25;
      displayText = `When below ${threshold}% health`;
    } else if (trigger.id === 'movement_start') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I start moving',
        'target': 'When my target starts moving',
        'ally': 'When an ally starts moving',
        'enemy': 'When an enemy starts moving',
        'any': 'When anyone starts moving'
      };
      displayText = whoMap[perspective] || 'When I start moving';
    } else if (trigger.id === 'movement_end') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'movement stops',
        'target': 'my target\'s movement stops',
        'ally': 'an ally\'s movement stops',
        'enemy': 'an enemy\'s movement stops',
        'any': 'movement stops'
      };
      displayText = `When ${whoMap[perspective] || 'movement stops'}`;
    } else if (trigger.id === 'effect_applied') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const whoMap = {
        'self': 'I gain',
        'target': 'my target gains',
        'ally': 'an ally gains',
        'enemy': 'an enemy gains',
        'any': 'anyone gains'
      };
      displayText = `When ${whoMap[perspective] || 'I gain'} ${effectType}`;
    } else if (trigger.id === 'effect_removed') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const whoMap = {
        'self': 'I lose',
        'target': 'my target loses',
        'ally': 'an ally loses',
        'enemy': 'an enemy loses',
        'any': 'anyone loses'
      };
      displayText = `When ${whoMap[perspective] || 'I lose'} ${effectType}`;
    } else if (trigger.id === 'on_death') {
      const targetType = trigger.parameters?.target_type || 'any';
      const targetMap = {
        'self': 'I die',
        'ally': 'an ally dies',
        'enemy': 'an enemy dies',
        'any': 'anyone dies'
      };
      displayText = `When ${targetMap[targetType] || 'anyone dies'}`;
    } else if (trigger.id === 'critical_hit_dealt') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I deal',
        'target': 'my target deals',
        'ally': 'an ally deals',
        'enemy': 'an enemy deals',
        'any': 'anyone deals'
      };
      displayText = `When ${whoMap[perspective]} a critical hit`;
    } else if (trigger.id === 'distance_moved') {
      const distance = trigger.parameters?.distance || 30;
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I move',
        'target': 'my target moves',
        'ally': 'an ally moves',
        'enemy': 'an enemy moves',
        'any': 'anyone moves'
      };
      displayText = `When ${whoMap[perspective]} ${distance} ft`;
    } else if (trigger.id === 'resource_threshold') {
      const resourceType = trigger.parameters?.resource_type || 'health';
      const thresholdValue = trigger.parameters?.threshold_value || 50;
      const thresholdType = trigger.parameters?.threshold_type || 'percentage';
      const perspective = trigger.parameters?.perspective || 'self';

      const whoMap = {
        'self': 'my',
        'target': "my target's",
        'ally': "an ally's",
        'enemy': "an enemy's",
        'any': "anyone's"
      };

      const suffix = thresholdType === 'percentage' ? '%' : ' pts';
      const resourceName = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
      const operator = thresholdType === 'percentage' && thresholdValue <= 50 ? 'drops below' : 'reaches';

      displayText = `When ${whoMap[perspective]} ${resourceName.toLowerCase()} ${operator} ${thresholdValue}${suffix}`;
    } else if (trigger.id === 'terrain_type') {
      const terrainType = trigger.parameters?.terrain_type;
      if (terrainType) {
        displayText = `When on ${terrainType} terrain`;
      }
    } else if (trigger.id === 'enter_range') {
      const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
      const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
      const entityMap = {
        'any': 'anyone',
        'allies': 'an ally',
        'enemies': 'an enemy',
        'self': 'I'
      };
      displayText = `When ${entityMap[entityType] || 'anyone'} enters within ${distance} ft`;
    } else if (trigger.id === 'exit_range') {
      const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
      const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
      const entityMap = {
        'any': 'anyone',
        'allies': 'an ally',
        'enemies': 'an enemy',
        'self': 'I'
      };
      displayText = `When ${entityMap[entityType] || 'anyone'} exits ${distance} ft range`;
    } else if (trigger.id === 'last_ally_standing') {
      displayText = "I am the last ally standing";
    } else if (trigger.id === 'outnumbered') {
      const ratio = trigger.parameters?.ratio || 2;
      displayText = `When outnumbered ${ratio}:1`;
    } else if (trigger.id === 'near_death') {
      const threshold = trigger.parameters?.health_threshold || 10;
      const targetType = trigger.parameters?.target_type || 'self';
      const targetMap = {
        'self': 'I am',
        'ally': 'an ally is',
        'enemy': 'an enemy is',
        'any': 'anyone is'
      };
      displayText = `When ${targetMap[targetType] || 'I am'} near death (${threshold}% health)`;
    } else if (trigger.id === 'stepped_on') {
      const creatureType = trigger.parameters?.creature_type || 'any';
      const creatureMap = {
        'any': 'any creature',
        'enemy': 'an enemy',
        'ally': 'an ally',
        'player': 'a player',
        'npc': 'an NPC'
      };
      displayText = `When ${creatureMap[creatureType] || 'any creature'} steps on the trap`;
    } else if (trigger.id === 'timer') {
      const seconds = trigger.parameters?.seconds || trigger.parameters?.time || 10;
      displayText = `After ${seconds} seconds`;
    } else if (trigger.id === 'weather_change') {
      const weatherType = trigger.parameters?.weather_type || 'rain';
      displayText = `When weather changes to ${weatherType}`;
    } else if (trigger.id === 'day_night') {
      const isDay = trigger.parameters?.is_day !== false;
      displayText = `When it becomes ${isDay ? 'day' : 'night'}`;
    } else if (trigger.id === 'underwater') {
      displayText = 'When underwater';
    } else if (trigger.id === 'in_darkness') {
      displayText = 'When in darkness or dim light';
    } else if (trigger.id === 'in_bright_light') {
      displayText = 'When in bright light';
    } else if (trigger.id === 'round_start') {
      displayText = 'When a combat round starts';
    } else if (trigger.id === 'round_end') {
      displayText = 'When a combat round ends';
    } else if (trigger.id === 'first_strike') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I make the first attack',
        'target': 'my target makes the first attack',
        'ally': 'an ally makes the first attack',
        'enemy': 'an enemy makes the first attack',
        'any': 'anyone makes the first attack'
      };
      displayText = `When ${whoMap[perspective] || 'I make the first attack'}`;
    } else if (trigger.id === 'last_stand' || trigger.id === 'last_ally_standing') {
      displayText = 'I am the last ally standing';
    } else if (trigger.id === 'outnumbered') {
      const ratio = trigger.parameters?.ratio || 2;
      displayText = `When outnumbered ${ratio}:1`;
    } else if (trigger.id === 'forced_movement') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I am forcibly moved',
        'target': 'my target is forcibly moved',
        'ally': 'an ally is forcibly moved',
        'enemy': 'an enemy is forcibly moved',
        'any': 'anyone is forcibly moved'
      };
      displayText = `When ${whoMap[perspective] || 'I am forcibly moved'}`;
    } else if (trigger.id === 'falling') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I am falling',
        'target': 'my target is falling',
        'ally': 'an ally is falling',
        'enemy': 'an enemy is falling',
        'any': 'anyone is falling'
      };
      displayText = `When ${whoMap[perspective] || 'I am falling'}`;
    } else if (trigger.id === 'effect_duration') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const duration = trigger.parameters?.duration || 5;
      const whoMap = {
        'self': 'my',
        'target': 'target\'s',
        'ally': 'ally\'s',
        'enemy': 'enemy\'s',
        'any': 'anyone\'s'
      };
      displayText = `When ${whoMap[perspective] || 'my'} ${effectType} has ${duration} seconds remaining`;
    } else if (trigger.id === 'dispel') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'any';
      const whoMap = {
        'self': 'an effect is dispelled from me',
        'target': 'an effect is dispelled from my target',
        'ally': 'an effect is dispelled from an ally',
        'enemy': 'an effect is dispelled from an enemy',
        'any': 'an effect is dispelled'
      };
      if (effectType === 'buff') {
        displayText = `When a buff is dispelled from ${perspective === 'self' ? 'me' : perspective === 'target' ? 'my target' : perspective === 'ally' ? 'an ally' : perspective === 'enemy' ? 'an enemy' : 'anyone'}`;
      } else if (effectType === 'debuff') {
        displayText = `When a debuff is dispelled from ${perspective === 'self' ? 'me' : perspective === 'target' ? 'my target' : perspective === 'ally' ? 'an ally' : perspective === 'enemy' ? 'an enemy' : 'anyone'}`;
      } else {
        displayText = `When ${whoMap[perspective] || whoMap['any']}`;
      }
    } else if (trigger.id === 'cleanse') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'any';
      const whoMap = {
        'self': 'I am cleansed',
        'target': 'my target is cleansed',
        'ally': 'an ally is cleansed',
        'enemy': 'an enemy is cleansed',
        'any': 'anyone is cleansed'
      };
      if (effectType && effectType !== 'any') {
        displayText = `When ${effectType} is cleansed from ${perspective === 'self' ? 'me' : perspective === 'target' ? 'my target' : perspective === 'ally' ? 'an ally' : perspective === 'enemy' ? 'an enemy' : 'anyone'}`;
      } else {
        displayText = `When ${whoMap[perspective] || whoMap['any']}`;
      }
    } else if (trigger.id === 'immunity') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const whoMap = {
        'self': 'I am immune to',
        'target': 'my target is immune to',
        'ally': 'an ally is immune to',
        'enemy': 'an enemy is immune to',
        'any': 'anyone is immune to'
      };
      displayText = `When ${whoMap[perspective] || 'I am immune to'} ${effectType}`;
    } else if (trigger.id === 'effect_stack') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const stackCount = trigger.parameters?.stack_count || 3;
      const whoMap = {
        'self': 'my',
        'target': 'target\'s',
        'ally': 'ally\'s',
        'enemy': 'enemy\'s',
        'any': 'anyone\'s'
      };
      displayText = `When ${whoMap[perspective] || 'my'} ${effectType} reaches ${stackCount} stacks`;
    } else if (trigger.id === 'duration_threshold') {
      const duration = trigger.parameters?.duration || 5;
      const comparison = trigger.parameters?.comparison || 'below';
      // Map all possible comparison values (both new format and legacy)
      const compMap = {
        'less_than': 'falls below',
        'greater_than': 'rises above',
        'equal': 'equals',
        'below': 'falls below',  // Legacy support
        'above': 'rises above',  // Legacy support
        'equals': 'equals'      // Legacy support
      };
      displayText = `When spell duration ${compMap[comparison] || 'falls below'} ${duration} seconds`;
    }
    // Handle any remaining triggers with fallback logic

    // Ensure we always return a string, never undefined or null
    return displayText || trigger.id || 'Unknown trigger';
  };

  // Format trigger text for conditional display (e.g., "If below 50% health" instead of "When my health falls below 50%")
  const formatTriggerForConditionalDisplay = (trigger) => {
    if (!trigger) return 'Unknown trigger';

    // Special handling for health_threshold to make it more concrete
    // Also check if trigger name suggests it's a health threshold trigger
    const isHealthThreshold = trigger.id === 'health_threshold' || 
                              trigger.id?.includes('health_threshold') ||
                              (trigger.name && /low health|health threshold|health.*below|health.*above/i.test(trigger.name));
    
    if (isHealthThreshold) {
      const percentage = trigger.parameters?.percentage || 
                        trigger.parameters?.health_threshold || 
                        50; // Default to 50% if not specified
      const comparison = trigger.parameters?.comparison || 'below';
      const perspective = trigger.parameters?.perspective || 'self';
      
      // Map comparison values
      const compMap = {
        'less_than': 'below',
        'greater_than': 'above',
        'equal': 'at',
        'below': 'below',  // Legacy support
        'above': 'above',  // Legacy support
        'equals': 'at'      // Legacy support
      };
      
      const compText = compMap[comparison] || 'below';
      
      // For self perspective, simplify to just "If below X% health"
      if (perspective === 'self') {
        return `If ${compText} ${percentage}% health`;
      } else {
        // For other perspectives, include the target
        const whoMap = {
          'target': 'target',
          'ally': 'ally',
          'enemy': 'enemy',
          'any': 'anyone'
        };
        return `If ${whoMap[perspective] || 'target'} ${compText} ${percentage}% health`;
      }
    }

    // For all other triggers, convert "When" to "If" and simplify
    let text = formatTriggerText(trigger);
    
    // Safety check: ensure text is a string before calling startsWith
    if (!text || typeof text !== 'string') {
      text = trigger.id || 'Unknown trigger';
    }
    
    // Convert "When" to "If" - but don't add "If" if it already starts with "If"
    if (text.startsWith('When ')) {
      text = 'If ' + text.substring(5);
    } else if (!text.startsWith('If ')) {
      text = 'If ' + text;
    }
    
    // Simplify common patterns
    text = text.replace(/^If I /, 'If ');
    text = text.replace(/^If my /, 'If ');
    
    return text;
  };

  // Helper function to get damage type suffix for conditional formulas

  return {
    formatChanceOnHit,
    formatTriggerId,
    formatTriggerText,
    formatTriggerForConditionalDisplay,
  };
};

export default useTriggerFormatters;