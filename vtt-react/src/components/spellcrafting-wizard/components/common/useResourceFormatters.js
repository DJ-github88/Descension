import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt, faGem, faFire, faRunning, faEye, faHeart,
  faStar, faSun, faSnowflake, faGhost, faMoon, faWind,
  faBrain, faFistRaised, faSkull, faAtom, faHourglass,
  faClock, faBatteryFull, faCoins, faArrowUp, faLeaf,
  faExclamationTriangle, faShield, faRandom, faScroll, faDice,
  faPaw, faCrosshairs, faTint, faBalanceScale, faCircleDot, faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { getInfernoStageNameWithSuffix, formatResourceName } from './spellFormatterUtils';
import { calculateManaCost } from '../../core/mechanics/resourceManager';

const useResourceFormatters = ({ spell, variant, className, library }) => {

  // Helper function to get resource icon and color
  const getResourceIcon = (resourceType) => {
    const resourceTypeMap = {
      'mana': faGem,
      'rage': faFire,
      'energy': faRunning,
      'focus': faEye,
      'health': faHeart,
      'combo_points': faStar,
      'holy_power': faSun,
      'runic_power': faSnowflake,
      'soul_shards': faGhost,
      'astral_power': faMoon,
      'arcane_energy_points': faBolt,
      'arcaneenergypoints': faBolt,
      'aep': faBolt,
      'maelstrom': faWind,
      'insanity': faBrain,
      'fury': faFistRaised,
      'pain': faSkull,
      'chi': faAtom,
      'cooldown': faHourglass,
      'uses': faClock,
      'charges': faBatteryFull,
      'ap': faBolt,
      'actionpoints': faBolt,
      'action_points': faBolt,
      'action-points': faBolt,
      'action': faCrosshairs,
      'bonus_action': faPlusCircle,
      'bonus-action': faPlusCircle,
      'reaction': faShield,
      'spell_slot': faCircleDot,
      'spell-slot': faCircleDot,
      'holypower': faSun,
      'holy-power': faSun,
      'astralpower': faMoon,
      'astral-power': faMoon
    };
    return resourceTypeMap[resourceType?.toLowerCase()?.replace(/\s+/g, '')] || faCoins;
  };

  const getResourceColor = (resourceType) => {
    const resourceColorMap = {
      'mana': '#4A90E2',
      'rage': '#E74C3C',
      'energy': '#F39C12',
      'focus': '#9B59B6',
      'health': '#E74C3C',
      'combo_points': '#F1C40F',
      'holy_power': '#F1C40F',
      'runic_power': '#3498DB',
      'soul_shards': '#8E44AD',
      'astral_power': '#9B59B6',
      'arcane_energy_points': '#4169E1',
      'arcaneenergypoints': '#4169E1',
      'aep': '#4169E1',
      'maelstrom': '#1ABC9C',
      'insanity': '#8E44AD',
      'fury': '#E74C3C',
      'pain': '#34495E',
      'chi': '#27AE60',
      'cooldown': '#95A5A6',
      'uses': '#95A5A6',
      'charges': '#3498DB',
      'ap': '#E67E22',
      'actionpoints': '#E67E22',
      'action_points': '#E67E22',
      'action-points': '#E67E22',
      'action': '#E67E22',
      'bonus_action': '#60A5FA',
      'bonus-action': '#60A5FA',
      'reaction': '#FBBF24',
      'spell_slot': '#C084FC',
      'spell-slot': '#C084FC',
      'holypower': '#F1C40F',
      'holy-power': '#F1C40F',
      'astralpower': '#9B59B6',
      'astral-power': '#9B59B6'
    };
    return resourceColorMap[resourceType?.toLowerCase()?.replace(/\s+/g, '')] || '#95A5A6';
  };
  const formatResourceCosts = () => {
    if (!spell) return null;

    const isArcanoneer = spell?.id?.startsWith('arc_');
    const resources = [];

    // Check for resource config (wizard format)
    if (spell.resourceConfig) {
      const { resourceType = 'Mana', resourceAmount = 0 } = spell.resourceConfig;
      if (resourceAmount > 0) {
        resources.push({
          type: resourceType.toLowerCase().replace(/\s+/g, '-'),
          amount: resourceAmount,
          name: formatResourceName(resourceType),
          icon: getResourceIcon(resourceType),
          color: getResourceColor(resourceType)
        });
      }
    }

    // Check for wizard format resource costs
    if (spell.resourceCost) {
      // Check all selected resource types and consolidate duplicates
      const selectedTypesRaw = spell.resourceCost.resourceTypes || [];
      
      // Consolidate duplicate resource types - count occurrences and use value from resourceValues
      const resourceTypeCounts = {};
      selectedTypesRaw.forEach(type => {
        resourceTypeCounts[type] = (resourceTypeCounts[type] || 0) + 1;
      });
      
      // Create deduplicated list (keep unique types only)
      const selectedTypes = Object.keys(resourceTypeCounts);

      // List of sphere resource types to skip (they're handled separately below)
      const sphereTypes = ['arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere', 'chaos_sphere'];

      // List of Inferno resource types to skip (they're handled separately below)
      const infernoTypes = ['inferno_required', 'inferno_ascend', 'inferno_descend'];

      // List of Chronarch resource types to skip (they're handled separately below)
      const chronarchTypes = ['time_shard_generate', 'time_shard_cost', 'temporal_strain_gain', 'temporal_strain_reduce'];

      // List of Devotion resource types to skip (custom badges below)
      const devotionTypes = ['devotion_required', 'devotion_cost', 'devotion_gain'];

      // List of Chaos Weaver resource types to skip (custom badges below)
      const mayhemTypes = ['mayhem_generate', 'mayhem_spend'];

      // List of Fate Weaver resource types to skip (custom badges below)
      const fateTypes = ['fate_generate', 'fate_spend', 'threads_generate', 'threads_spend'];

      // List of Musical Note resource types to skip (they're handled separately below)
      const musicalNoteTypes = ['note_i', 'note_ii', 'note_iii', 'note_iv', 'note_v', 'note_vi', 'note_vii'];

      // List of Berserker Rage State types to skip (handled separately below)
      const rageStateTypes = ['rage_state'];

      // List of Formbender Wild Instinct types to skip (handled separately below)
      const wildInstinctTypes = ['wild_instinct', 'wild_instinct_generate', 'wild_instinct_cost'];

      // List of Dreadnaught and Revenant types to skip (handled separately below)
      const drpTypes = ['drp'];
      const revenantTypes = ['bloodTokens', 'ascension_required', 'deathToll'];

      // List of Apex Quarry Mark types to skip (handled separately below)
      const quarryMarkTypes = ['quarry_marks', 'quarry_marks_generate', 'quarry_marks_cost'];

      // List of Warden Vengeance Point types to skip (handled separately below)
      const vengeancePointTypes = ['vengeance_points', 'vengeance_points_generate', 'vengeance_points_cost'];

      selectedTypes.forEach(type => {
        // Skip sphere types - they're handled separately below
        if (sphereTypes.includes(type)) {
          return;
        }

        // Skip Inferno types - they're handled separately below
        if (infernoTypes.includes(type)) {
          return;
        }

        // Skip Chronarch types - they're handled separately below
        if (chronarchTypes.includes(type)) {
          return;
        }

        // Skip Devotion types - handled below
        if (devotionTypes.includes(type)) {
          return;
        }

        // Skip Chaos Weaver Mayhem types - handled below
        if (mayhemTypes.includes(type)) {
          return;
        }

        // Skip Fate Weaver Fate Token types - handled below
        if (fateTypes.includes(type)) {
          return;
        }

        // Skip Musical Note types - handled below
        if (musicalNoteTypes.includes(type)) {
          return;
        }

        // Skip Rage State types - handled below
        if (rageStateTypes.includes(type)) {
          return;
        }

        // Skip Wild Instinct types - handled below
        if (wildInstinctTypes.includes(type)) {
          return;
        }

        // Skip DRP types - handled below
        if (drpTypes.includes(type)) {
          return;
        }

        // Skip Revenant types - handled below
        if (revenantTypes.includes(type)) {
          return;
        }

        // Skip Quarry Mark types - handled below
        if (quarryMarkTypes.includes(type)) {
          return;
        }

        // Skip Vengeance Point types - handled below
        if (vengeancePointTypes.includes(type)) {
          return;
        }

        const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
        const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
        const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

        // Show resource if it uses a formula OR has a value > 0
        if ((useFormula && formula) || (amount > 0)) {
          // Format the amount with frequency for channeling spells
          let displayAmount = useFormula ? formula : amount;

          // Add frequency for channeling spells
          if (spell.spellType === 'CHANNELED' && spell.resourceCost.channelingFrequency) {
            const frequency = spell.resourceCost.channelingFrequency;
            const frequencyText = frequency === 'per_round' ? '/round' :
                                 frequency === 'per_turn' ? '/turn' :
                                 frequency === 'per_second' ? '/sec' :
                                 frequency === 'atStart' ? ' (at start)' :
                                 frequency === 'atEnd' ? ' (at end)' : '';
            displayAmount = `${displayAmount}${frequencyText}`;
          }

          resources.push({
            type: type.toLowerCase().replace(/\s+/g, '-'),
            amount: displayAmount,
            name: formatResourceName(type),
            icon: getResourceIcon(type),
            color: getResourceColor(type),
            isFormula: useFormula,
            spellSlotLevel: type === 'spell_slot' ? (spell.resourceCost.resourceValues?.spell_slot_level || 1) : undefined
          });
        }
      });
    }

    // Check for simple resource cost format: { mana: 25, health: 0, stamina: 0, focus: 0, classResource: {...} }
    // This handles class spells, test spells, and any spell with direct resource properties
    if (spell.resourceCost && !spell.resourceCost.resourceTypes) {
      // List of valid resource types to check
      const validResourceTypes = ['mana', 'health', 'stamina', 'focus', 'actionPoints'];

      validResourceTypes.forEach(type => {
        const amount = spell.resourceCost[type];
        if (amount > 0) {
          // Don't add if already added from resourceValues
          if (!resources.some(r => r.type === type.toLowerCase().replace(/\s+/g, '-'))) {
            resources.push({
              type: type.toLowerCase().replace(/\s+/g, '-'),
              amount: amount,
              name: formatResourceName(type),
              icon: getResourceIcon(type),
              color: getResourceColor(type)
            });
          }
        }
      });

      // Check for class resource (e.g., arcane_charges, holy_power, etc.)
      if (spell.resourceCost.classResource && spell.resourceCost.classResource.cost > 0) {
        const classResourceType = spell.resourceCost.classResource.type;
        const classResourceCost = spell.resourceCost.classResource.cost;

        resources.push({
          type: classResourceType.toLowerCase().replace(/\s+/g, '-'),
          amount: classResourceCost,
          name: formatResourceName(classResourceType),
          icon: getResourceIcon(classResourceType),
          color: getResourceColor(classResourceType)
        });
      }
    }

    // Check for legacy resource costs (spellbook format) - only for actual spellbook spells
    // Only show spellbook resources if the spell has been saved to spellbook (has createdAt)
    if (spell.resourceCost && variant === 'spellbook' && spell.createdAt) {
      Object.entries(spell.resourceCost).forEach(([type, amount]) => {
        if (amount > 0 && type !== 'components' && type !== 'materialComponents' && type !== 'verbalText' && type !== 'somaticText' && type !== 'resourceValues' && type !== 'resourceTypes' && type !== 'resourceFormulas' && type !== 'useFormulas' && type !== 'actionPointsSelected' && type !== 'primaryResourceType' && type !== 'classResourceCost') {
          // Don't add if already added from resourceValues
          if (!resources.some(r => r.type === type.toLowerCase().replace(/\s+/g, '-'))) {
            resources.push({
              type: type.toLowerCase().replace(/\s+/g, '-'),
              amount: amount,
              name: type.charAt(0).toUpperCase() + type.slice(1),
              icon: getResourceIcon(type),
              color: getResourceColor(type)
            });
          }
        }
      });
    }

    // Check for enhanced spell library format (resourceCost.mana.baseAmount)
    if (spell.resourceCost && spell.resourceCost.mana && !resources.some(r => r.type === 'mana')) {
      let manaAmount = spell.resourceCost.mana.baseAmount || spell.resourceCost.mana;

      // If the mana cost is a generic 25, try to calculate a more appropriate cost
      if (manaAmount === 25 && spell.effectTypes && spell.effectTypes.length > 0) {
        try {
          const calculatedCost = calculateManaCost(spell);
          // Only use calculated cost if it's significantly different and reasonable
          if (calculatedCost !== 25 && calculatedCost >= 5 && calculatedCost <= 100) {
            manaAmount = calculatedCost;
          }
        } catch (error) {
          // Fall back to original cost if calculation fails
          console.warn('Failed to calculate mana cost for spell:', spell.name, error);
        }
      }

      resources.push({
        type: 'mana',
        amount: manaAmount,
        name: 'Mana',
        icon: getResourceIcon('mana'),
        color: getResourceColor('mana')
      });
    }

    // Check for simple mana cost (only for legacy spells or when mana is explicitly selected)
    if (spell.manaCost && spell.manaCost > 0 && !resources.some(r => r.type === 'mana')) {
      // Only add mana if it's a legacy spell (no resourceCost.resourceTypes) or if mana is selected
      const selectedTypes = spell.resourceCost?.resourceTypes || [];
      const isLegacySpell = !spell.resourceCost?.resourceTypes;
      const manaSelected = selectedTypes.includes('mana');

      if (isLegacySpell || manaSelected) {
        resources.push({
          type: 'mana',
          amount: spell.manaCost,
          name: 'Mana',
          icon: getResourceIcon('mana'),
          color: getResourceColor('mana')
        });
      }
    }

    // Add Action Points (moved here to appear early in resource list, after main resources but before spheres)
    if (spell.resourceCost && spell.resourceCost.actionPoints !== undefined && spell.resourceCost.actionPoints > 0) {
      // Check if actionPoints is already in resourceTypes (wizard format)
      const actionPointsInTypes = spell.resourceCost.resourceTypes && spell.resourceCost.resourceTypes.includes('action_points');

      // Check if already added (check all possible type variations: 'actionpoints', 'action-points', 'action_points')
      const alreadyAdded = resources.some(r =>
        r.type === 'action-points' ||
        r.type === 'action_points' ||
        r.type === 'actionpoints'
      );

      // Only add if:
      // 1. Not in resourceTypes (so it's not being handled by the wizard format loop above)
      // 2. Not already added from legacy format
      // 3. This is a wizard format spell (has resourceTypes) OR legacy format (no resourceTypes but actionPoints exists)
      if (!actionPointsInTypes && !alreadyAdded) {
        resources.push({
          type: 'action-points',
          amount: spell.resourceCost.actionPoints,
          name: 'Action Points',
          icon: faBolt,
          color: '#ffffff' // Use white to match other resources in header
        });
      }
    }

    // Check for sphere resources from wizard (new format) - process this FIRST
    const sphereResourceMap = {
      'arcane_sphere': { name: 'Arcane Sphere', color: '#9370DB', icon: faAtom },
      'holy_sphere': { name: isArcanoneer ? 'Radiant Sphere' : 'Holy Sphere', color: '#FFD700', icon: faSun },
      'shadow_sphere': { name: isArcanoneer ? 'Necrotic Sphere' : 'Shadow Sphere', color: '#1C1C1C', icon: faMoon },
      'fire_sphere': { name: 'Fire Sphere', color: '#FF4500', icon: faFire },
      'ice_sphere': { name: isArcanoneer ? 'Frost Sphere' : 'Ice Sphere', color: '#4169E1', icon: faSnowflake },
      'nature_sphere': { name: 'Nature Sphere', color: '#32CD32', icon: faLeaf },
      'healing_sphere': { name: isArcanoneer ? 'Flesh Sphere' : 'Healing Sphere', color: isArcanoneer ? '#C62828' : '#FFFF00', icon: faHeart },
      'chaos_sphere': { name: 'Chaos Sphere', color: '#FF00FF', icon: faBolt }
    };

    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      // Consolidate duplicate sphere types - deduplicate the resourceTypes array
      const uniqueSphereTypes = [...new Set(spell.resourceCost.resourceTypes.filter(type => sphereResourceMap[type]))];
      
      // Process each unique sphere type once, using the value from resourceValues
      uniqueSphereTypes.forEach(type => {
        const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
        const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
        const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

        if ((useFormula && formula) || (amount > 0)) {
          const sphereInfo = sphereResourceMap[type];
          // Check if already added to avoid duplicates
          if (!resources.some(r => r.type === `sphere-${type}`)) {
            resources.push({
              type: `sphere-${type}`,
              amount: useFormula ? formula : amount,
              name: sphereInfo.name,
              icon: sphereInfo.icon,
              color: sphereInfo.color,
              isSphere: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Check for Arcanoneer sphere costs (legacy array format) - ONLY if new format wasn't processed
    // Only use legacy format if resourceTypes doesn't contain any sphere types
    const hasNewFormatSpheres = spell.resourceCost?.resourceTypes?.some(type => 
      ['arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 
       'nature_sphere', 'healing_sphere', 'chaos_sphere'].includes(type)
    );

    if (!hasNewFormatSpheres && spell.resourceCost && spell.resourceCost.spheres && Array.isArray(spell.resourceCost.spheres)) {
      // Count sphere types
      const sphereCounts = {};
      spell.resourceCost.spheres.forEach(sphere => {
        sphereCounts[sphere] = (sphereCounts[sphere] || 0) + 1;
      });

      // Add each sphere type as a resource
      Object.entries(sphereCounts).forEach(([sphereType, count]) => {
        const nameMap = {
          'Arcane': 'Arcane Sphere',
          'ember': 'Fire Sphere',
          'Ice': isArcanoneer ? 'Frost Sphere' : 'Ice Sphere',
          'Healing': isArcanoneer ? 'Flesh Sphere' : 'Healing Sphere',
          'Nature': 'Nature Sphere',
          'blight': isArcanoneer ? 'Necrotic Sphere' : 'Shadow Sphere',
          'Chaos': 'Chaos Sphere',
          'ember': isArcanoneer ? 'Radiant Sphere' : 'Holy Sphere',
          // Fallback direct keys if they are already translated
          'rime': 'Frost Sphere',
          'blight': 'Necrotic Sphere',
          'ember': 'Radiant Sphere',
          'Flesh': 'Flesh Sphere'
        };

        const colorMap = {
          'Arcane': '#9370DB',
          'ember': '#FF4500',
          'Ice': '#4169E1',
          'rime': '#4169E1',
          'Healing': isArcanoneer ? '#C62828' : '#FFFF00',
          'Flesh': '#C62828',
          'Nature': '#32CD32',
          'blight': '#1C1C1C',
          'blight': '#1C1C1C',
          'Chaos': '#FF00FF',
          'ember': '#FFD700',
          'ember': '#FFD700'
        };

        const iconMap = {
          'Arcane': faAtom,
          'ember': faFire,
          'Ice': faSnowflake,
          'rime': faSnowflake,
          'Healing': faHeart,
          'Flesh': faHeart,
          'Nature': faLeaf,
          'blight': faMoon,
          'blight': faMoon,
          'Chaos': faBolt,
          'ember': faSun,
          'ember': faSun
        };

        // Check if already added to avoid duplicates
        const sphereTypeKey = `sphere-${sphereType.toLowerCase()}`;
        if (!resources.some(r => r.type === sphereTypeKey)) {
          resources.push({
            type: sphereTypeKey,
            amount: count,
            name: nameMap[sphereType] || `${sphereType} Sphere`,
            icon: iconMap[sphereType] || faAtom,
            color: colorMap[sphereType] || '#9370DB',
            isSphere: true
          });
        }
      });
    }


    // Add Pyrofiend Inferno costs - compact display
    const infernoRequired = spell.infernoRequired || spell.resourceCost?.resourceValues?.inferno_required;
    if (infernoRequired !== undefined && infernoRequired > 0) {
      resources.push({
        type: 'inferno-required',
        amount: `[${getInfernoStageNameWithSuffix(infernoRequired).replace(' Inferno', '')}]`,
        name: '',
        icon: faFire,
        color: '#8b0000',
        isInferno: true,
        isRequired: true,
        fullText: `Requires [${getInfernoStageNameWithSuffix(infernoRequired)}]`
      });
    }
    const infernoAscend = spell.infernoAscend || spell.resourceCost?.resourceValues?.inferno_ascend;
    if (infernoAscend !== undefined && infernoAscend > 0) {
      resources.push({
        type: 'inferno-ascend',
        amount: `+${infernoAscend}`,
        name: 'Inferno',
        icon: faFire,
        color: '#ff4500',
        isInferno: true,
        fullText: `Ascend Inferno +${infernoAscend}`
      });
    }
    const infernoDescend = spell.infernoDescend || spell.resourceCost?.resourceValues?.inferno_descend;
    if (infernoDescend !== undefined && infernoDescend !== 0 && infernoDescend !== '0') {
      // Handle both numeric and dice formula descend values
      const descendValue = typeof infernoDescend === 'string' ? infernoDescend : infernoDescend;
      resources.push({
        type: 'inferno-descend',
        amount: `-${descendValue}`,
        name: 'Inferno',
        icon: faFire,
        color: '#4682b4',
        isInferno: true,
        fullText: `Descend Inferno -${descendValue}`
      });
    }

    // Add Martyr Devotion Level costs - check both flat properties and specialMechanics
    const devotionRequired = spell.devotionRequired || spell.specialMechanics?.devotionLevel?.required;
    const devotionCost = spell.devotionCost || spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost;
    const devotionGain = spell.devotionGain || spell.specialMechanics?.devotionLevel?.gain;

    if (devotionRequired !== undefined && devotionRequired > 0) {
      resources.push({
        type: 'devotion-required',
        amount: `Requires Devotion Level ${devotionRequired}`,
        name: '',
        icon: faHeart,
        color: '#FFD700',
        isDevotion: true
      });
    }
    if (devotionCost !== undefined && devotionCost > 0) {
      resources.push({
        type: 'devotion-cost',
        amount: `Costs ${devotionCost} Devotion Level${devotionCost > 1 ? 's' : ''}`,
        name: '',
        icon: faShield,
        color: '#FFD700',
        isDevotion: true
      });
    }
    if (devotionGain !== undefined && devotionGain > 0) {
      resources.push({
        type: 'devotion-gain',
        amount: `+${devotionGain} Devotion Level${devotionGain > 1 ? 's' : ''}`,
        name: '',
        icon: faArrowUp,
        color: '#32CD32',
        isDevotion: true
      });
    }

    // Also check resourceCost.resourceValues for Devotion Level (wizard format)
    if (spell.resourceCost && spell.resourceCost.resourceValues) {
      const resourceValues = spell.resourceCost.resourceValues;
      if (resourceValues.devotion_required !== undefined && resourceValues.devotion_required > 0 && !devotionRequired) {
        resources.push({
          type: 'devotion-required',
          amount: `Requires Devotion Level ${resourceValues.devotion_required}`,
          name: '',
          icon: faHeart,
          color: '#FFD700',
          isDevotion: true
        });
      }
      if (resourceValues.devotion_cost !== undefined && resourceValues.devotion_cost > 0 && !devotionCost) {
        resources.push({
          type: 'devotion-cost',
          amount: `Costs ${resourceValues.devotion_cost} Devotion Level${resourceValues.devotion_cost > 1 ? 's' : ''}`,
          name: '',
          icon: faShield,
          color: '#FFD700',
          isDevotion: true
        });
      }
      if (resourceValues.devotion_gain !== undefined && resourceValues.devotion_gain > 0 && !devotionGain) {
        resources.push({
          type: 'devotion-gain',
          amount: `+${resourceValues.devotion_gain} Devotion Level${resourceValues.devotion_gain > 1 ? 's' : ''}`,
          name: '',
          icon: faArrowUp,
          color: '#32CD32',
          isDevotion: true
        });
      }
    }

    // Add Chronarch resources from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const chronarchResourceMap = {
        'time_shard_generate': { name: 'Time Shard', color: '#4169E1', icon: faClock, isGenerate: true },
        'time_shard_cost': { name: 'Time Shard', color: '#4169E1', icon: faHourglass, isConsume: true },
        'temporal_strain_gain': { name: 'Strain', color: '#DC143C', icon: faExclamationTriangle, isStrain: true },
        'temporal_strain_reduce': { name: 'Strain', color: '#32CD32', icon: faHeart, isStrainReduce: true }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (chronarchResourceMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

          if ((useFormula && formula) || (amount > 0)) {
            const chronarchInfo = chronarchResourceMap[type];
            const numericAmount = useFormula ? formula : amount;

            // Format with +/- prefix
            let displayAmount;
            if (chronarchInfo.isGenerate || chronarchInfo.isStrain) {
              displayAmount = numericAmount > 1 ? `+${numericAmount}` : '+1';
            } else {
              displayAmount = numericAmount > 1 ? `-${numericAmount}` : '-1';
            }
            // Only push the compact Chronarch badge, skip labeled legacy badge
            resources.push({
              type: `chronarch-${type}`,
              amount: displayAmount,
              name: chronarchInfo.name,
              icon: chronarchInfo.icon,
              color: chronarchInfo.color,
              isChronarch: true,
              isGenerate: chronarchInfo.isGenerate,
              isConsume: chronarchInfo.isConsume,
              isStrain: chronarchInfo.isStrain,
              isStrainReduce: chronarchInfo.isStrainReduce,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Chaos Weaver Mayhem Modifiers (generate/spend) from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const mayhemMap = {
        'mayhem_generate': { name: 'Mayhem Modifiers', color: '#8A2BE2', icon: faRandom, sign: '+' },
        'mayhem_spend': { name: 'Mayhem Modifiers', color: '#8A2BE2', icon: faRandom, sign: '-' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (mayhemMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const info = mayhemMap[type];
            resources.push({
              type,
              amount: useFormula ? `${info.sign}${formula}` : `${info.sign}${amount}`,
              name: info.name,
              icon: info.icon,
              color: info.color,
              isChaosWeaver: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Fate Weaver Fate Tokens (generate/spend) from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const fateMap = {
        'fate_generate': { name: 'Fate Tokens', color: '#2E86C1', icon: faRandom, sign: '+' },
        'fate_spend': { name: 'Fate Tokens', color: '#2E86C1', icon: faRandom, sign: '-' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (fateMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const info = fateMap[type];
            resources.push({
              type,
              amount: useFormula ? `${info.sign}${formula}` : `${info.sign}${amount}`,
              name: info.name,
              icon: info.icon,
              color: info.color,
              isFateWeaver: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Fate Weaver Threads of Destiny (generate/spend) from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const threadsMap = {
        'threads_generate': { name: 'Threads of Destiny', color: '#9370DB', icon: faScroll, sign: '+' },
        'threads_spend': { name: 'Threads of Destiny', color: '#9370DB', icon: faScroll, sign: '-' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (threadsMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const info = threadsMap[type];
            resources.push({
              type,
              amount: useFormula ? `${info.sign}${formula}` : `${info.sign}${amount}`,
              name: info.name,
              icon: info.icon,
              color: info.color,
              isFateWeaver: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Musical Notes from resourceCost.resourceTypes (wizard format)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const musicalNoteTypeMap = {
        'note_i': { note: 'I', functionName: 'Tonic' },
        'note_ii': { note: 'II', functionName: 'Supertonic' },
        'note_iii': { note: 'III', functionName: 'Mediant' },
        'note_iv': { note: 'IV', functionName: 'Subdominant' },
        'note_v': { note: 'V', functionName: 'Dominant' },
        'note_vi': { note: 'VI', functionName: 'Submediant' },
        'note_vii': { note: 'VII', functionName: 'Leading Tone' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (musicalNoteTypeMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const noteInfo = musicalNoteTypeMap[type];
            // For formulas, check if formula string starts with '-' to determine consuming
            // For numeric amounts, check the sign directly
            const isGenerating = useFormula 
              ? !formula.trim().startsWith('-')
              : amount > 0;

            // Format display text
            let displayText;
            if (useFormula) {
              // Formula already contains sign, just add function name
              displayText = `${formula} ${noteInfo.functionName} (${noteInfo.note})`;
            } else {
              const absAmount = Math.abs(amount);
              if (absAmount > 1) {
                displayText = `${isGenerating ? '+' : '-'}${absAmount} ${noteInfo.functionName} (${noteInfo.note})`;
              } else {
                displayText = `${isGenerating ? '+' : '-'}${noteInfo.functionName} (${noteInfo.note})`;
              }
            }

            resources.push({
              type: isGenerating ? 'musical-generates' : 'musical-consumes',
              amount: displayText,
              name: '',
              clefSymbol: isGenerating ? 'ð„ž' : 'ð„¢', // Treble clef for builder, bass clef for resolver
              color: isGenerating ? '#9370DB' : '#4169E1',
              isMusicalNote: true,
              isGenerate: isGenerating,
              isConsume: !isGenerating,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Berserker Rage State requirements
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'rage_state') {
          const rageState = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if (rageState) {
            resources.push({
              type: 'rage-state',
              amount: `Requires [${rageState}]`,
              name: '',
              icon: faFire,
              color: '#FF4500',
              isRageState: true
            });
          }
        }
      });
    }

    // Add Formbender Wild Instinct (generate/cost)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const wildInstinctMap = {
        'wild_instinct_generate': { name: 'Wild Instinct', color: '#228B22', icon: faPaw, sign: '+' },
        'wild_instinct_cost': { name: 'Wild Instinct', color: '#228B22', icon: faPaw, sign: '' },
        'wild_instinct': { name: 'Wild Instinct', color: '#228B22', icon: faPaw, sign: '' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (wildInstinctMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const config = wildInstinctMap[type];
            resources.push({
              type: type,
              amount: `${config.sign}${useFormula ? formula : amount}`,
              name: config.name,
              icon: config.icon,
              color: config.color,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Dreadnaught DRP (Dark Resilience Points)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'drp') {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0) || amount === 'variable') {
            const displayAmount = amount === 'variable' ? 'Variable' : (useFormula ? formula : amount);
            resources.push({
              type: 'drp',
              amount: displayAmount,
              name: 'DRP',
              icon: faShield,
              color: '#4B0082',
              isFormula: useFormula,
              isDRP: true
            });
          }
        }
      });
    }

    // Add Deathcaller Blood Tokens
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'bloodTokens') {
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if (typeof amount === 'number' && amount > 0) {
            resources.push({
              type: 'blood-tokens',
              amount: amount,
              name: 'Blood Tokens',
              icon: faTint,
              color: '#8B0000',
              isBloodTokens: true
            });
          }
        }
      });
    }

    // Add Deathcaller Ascension Path requirements
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'ascension_required') {
          const ascensionPath = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if (ascensionPath) {
            const pathNames = {
              'shrouded_veil': 'Shrouded Veil',
              'crimson_pact': 'Crimson Pact',
              'spectral_command': 'Spectral Command',
              'frostwalker': 'Frostwalker',
              'silent_shroud': 'Silent Shroud',
              'life_leech': 'Life Leech',
              'deep_void': 'Deep Void',
              'eternal_hunger': 'Eternal Hunger'
            };
            const displayName = pathNames[ascensionPath] || ascensionPath;
            resources.push({
              type: 'ascension-required',
              amount: `Requires ${displayName}`,
              name: '',
              icon: faSkull,
              color: '#2F4F4F',
              isAscensionRequired: true
            });
          }
        }
      });
    }

    // Add Apex Quarry Marks (generate/cost)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const quarryMarkMap = {
        'quarry_marks_generate': { name: 'Quarry Marks', color: '#8B4513', icon: faCrosshairs, sign: '+' },
        'quarry_marks_cost': { name: 'Quarry Marks', color: '#8B4513', icon: faCrosshairs, sign: '' },
        'quarry_marks': { name: 'Quarry Marks', color: '#8B4513', icon: faCrosshairs, sign: '' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (quarryMarkMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const config = quarryMarkMap[type];
            resources.push({
              type: type,
              amount: `${config.sign}${useFormula ? formula : amount}`,
              name: config.name,
              icon: config.icon,
              color: config.color,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Warden Vengeance Points (generate/cost)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const vengeancePointMap = {
        'vengeance_points_generate': { name: 'Vengeance Points', color: '#8B0000', icon: faBalanceScale, sign: '+' },
        'vengeance_points_cost': { name: 'Vengeance Points', color: '#8B0000', icon: faBalanceScale, sign: '' },
        'vengeance_points': { name: 'Vengeance Points', color: '#8B0000', icon: faBalanceScale, sign: '' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (vengeancePointMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const config = vengeancePointMap[type];
            resources.push({
              type: type,
              amount: `${config.sign}${useFormula ? formula : amount}`,
              name: config.name,
              icon: config.icon,
              color: config.color,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Minstrel Musical Combo costs - check both spell.musicalCombo and spell.specialMechanics.musicalCombo
    const musicalCombo = spell.musicalCombo || spell.specialMechanics?.musicalCombo;
    if (musicalCombo) {
      const noteFunctionMap = {
        'I': 'Tonic',
        'II': 'Supertonic',
        'III': 'Mediant',
        'IV': 'Subdominant',
        'V': 'Dominant',
        'VI': 'Submediant',
        'VII': 'Leading Tone'
      };

      if (musicalCombo.type === 'builder' && musicalCombo.generates) {
        // Builder spell - shows treble clef "ð„ž +X Note (I)" format
        musicalCombo.generates.forEach(noteGen => {
          const functionName = noteFunctionMap[noteGen.note] || noteGen.note;
          const displayText = noteGen.count > 1
            ? `+${noteGen.count} ${functionName} (${noteGen.note})`
            : `+${functionName} (${noteGen.note})`;
          resources.push({
            type: 'musical-generates',
            amount: displayText,
            name: '',
            clefSymbol: 'ð„ž', // Treble clef Unicode
            color: '#9370DB',
            isMusicalNote: true,
            isGenerate: true
          });
        });
      } else if (musicalCombo.type === 'resolver' && musicalCombo.consumes) {
        // Resolver spell - shows bass clef "ð„¢ -X Note (I)" format
        musicalCombo.consumes.forEach(noteReq => {
          const functionName = noteFunctionMap[noteReq.note] || noteReq.note;
          const displayText = noteReq.count > 1
            ? `-${noteReq.count} ${functionName} (${noteReq.note})`
            : `-${functionName} (${noteReq.note})`;
          resources.push({
            type: 'musical-consumes',
            amount: displayText,
            name: '',
            clefSymbol: 'ð„¢', // Bass clef Unicode
            color: '#4169E1',
            isMusicalNote: true,
            isConsume: true
          });
        });
      }
    }

    // Add Chronarch Time Shard resources - supports both generation and consumption
    const timeShardGenerate = spell.timeShardGenerate || spell.specialMechanics?.timeShards?.generated;
    const timeShardCost = spell.timeShardCost || spell.specialMechanics?.temporalFlux?.shardCost;

    if (timeShardGenerate !== undefined && timeShardGenerate > 0) {
      // Time Shard generation (basic spells) - uses clock icon with compact format
      const displayText = timeShardGenerate > 1 ? `+${timeShardGenerate}` : '+1';
      resources.push({
        type: 'time-shards-generate',
        amount: displayText,
        name: 'Time Shard',
        icon: faClock,
        color: '#4169E1',
        isChronarch: true,
        isGenerate: true
      });
    }

    if (timeShardCost !== undefined && timeShardCost > 0) {
      // Time Shard consumption (Flux abilities) - uses hourglass icon with compact format
      const displayText = timeShardCost > 1 ? `-${timeShardCost}` : '-1';
      resources.push({
        type: 'time-shards-cost',
        amount: displayText,
        name: 'Time Shard',
        icon: faHourglass,
        color: '#4169E1',
        isChronarch: true,
        isConsume: true
      });
    }

    // Add Chaos Weaver Mayhem Modifiers - supports both generation and consumption
    const mayhemGenerate = spell.mayhemGenerate || spell.resourceFormulas?.mayhem_generate;
    const mayhemCost = spell.mayhemCost || spell.resourceValues?.mayhem_spend || spell.resourceValues?.mayhem_cost;

    if (mayhemGenerate !== undefined && mayhemGenerate !== null) {
      // Mayhem Modifier generation - uses dice icon with compact format
      resources.push({
        type: 'mayhem-generate',
        amount: `+${mayhemGenerate}`,
        name: 'Mayhem Modifiers',
        icon: faDice,
        color: '#FF6B35',
        isChaosWeaver: true,
        isGenerate: true
      });
    }

    if (mayhemCost !== undefined && mayhemCost > 0) {
      // Mayhem Modifier consumption - uses dice icon with compact format
      const displayText = mayhemCost > 1 ? `-${mayhemCost}` : '-1';
      resources.push({
        type: 'mayhem-cost',
        amount: displayText,
        name: 'Mayhem Modifiers',
        icon: faDice,
        color: '#FF6B35',
        isChaosWeaver: true,
        isConsume: true
      });
    }

    // Add Chronarch Temporal Strain resources - supports both gain and reduction
    const temporalStrainGain = spell.temporalStrainGain || spell.temporalStrainGained || spell.specialMechanics?.temporalFlux?.strainGained;
    const temporalStrainReduce = spell.temporalStrainReduce || spell.specialMechanics?.temporalFlux?.strainReduced;

    if (temporalStrainGain !== undefined && temporalStrainGain > 0) {
      // Temporal Strain gain (Flux abilities) - uses warning triangle with compact format
      const displayText = temporalStrainGain > 1 ? `+${temporalStrainGain}` : '+1';
      resources.push({
        type: 'temporal-strain-gain',
        amount: displayText,
        name: 'Strain',
        icon: faExclamationTriangle,
        color: '#DC143C',
        isChronarch: true,
        isStrain: true
      });
    }

    if (temporalStrainReduce !== undefined && temporalStrainReduce > 0) {
      // Temporal Strain reduction (cleansing spells) - uses check icon with compact format
      const displayText = temporalStrainReduce > 1 ? `-${temporalStrainReduce}` : '-1';
      resources.push({
        type: 'temporal-strain-reduce',
        amount: displayText,
        name: 'Strain',
        icon: faHeart,
        color: '#32CD32',
        isChronarch: true,
        isStrainReduce: true
      });
    }

    if (resources.length === 0) return null;

    const primaryTypes = ['action_points', 'action-points', 'actionpoints', 'mana', 'health', 'energy', 'rage', 'focus', 'action', 'bonus_action', 'bonus-action', 'reaction', 'spell_slot', 'spell-slot', 'soul_shards', 'soul-shards', 'holy_power', 'holy-power', 'astral_power', 'astral-power', 'combo_points', 'runic_power', 'arcane_energy_points', 'chi', 'ap'];
    const primaryResources = resources.filter(r => primaryTypes.includes(r.type?.toLowerCase()?.replace(/\s+/g, '-')));
    const classResources = resources.filter(r => !primaryTypes.includes(r.type?.toLowerCase()?.replace(/\s+/g, '-')));

    const renderResourceBadge = (resource, index) => {
      let displayName = resource.name;
      if (resource.isSphere) {
         displayName = resource.name ? resource.name.replace(/ Spheres?/g, '') : '';
      } else if (resource.type === 'action-points' || resource.type === 'action_points' || resource.type === 'actionpoints') {
         displayName = 'AP';
      } else if (resource.type === 'bonus_action' || resource.type === 'bonus-action') {
         displayName = 'Bonus Action';
      } else if (resource.type === 'reaction') {
         displayName = 'Reaction';
      } else if (resource.type === 'spell_slot' || resource.type === 'spell-slot') {
         displayName = resource.spellSlotLevel ? `Slot Lv${resource.spellSlotLevel}` : 'Spell Slot';
      } else if (resource.type === 'action') {
         displayName = 'Action';
      } else if (resource.isInferno) {
         displayName = resource.isRequired ? null : resource.name;
      }

      let displayAmount = resource.isFormula ? resource.amount : resource.amount;
      
      return (
        <div
          key={index}
          className={`pf-resource-cost ${resource.type} ${resource.isFormula ? 'formula' : ''}`}
          title={resource.fullText || `${resource.name || resource.type}: ${resource.isFormula ? `Formula: ${resource.amount}` : resource.amount}`}
        >
          {resource.isMusicalNote ? (
            <span
              className="pf-musical-clef-icon"
              style={{ color: resource.color }}
            >
              {resource.clefSymbol}
            </span>
          ) : (
            <FontAwesomeIcon
              icon={resource.icon}
              className="pf-resource-icon"
              style={{ color: resource.color || '#ffffff' }}
            />
          )}
          
          <span 
            className="pf-resource-amount"
            style={{ 
              fontWeight: resource.isRequired ? 'bold' : 'normal' 
            }}
          >
            {displayAmount}
          </span>
          
          {displayName && (
            <span className="pf-resource-name">
              {displayName}
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="pf-spell-resources">
        <div className="pf-resource-group pf-resource-group-primary">
          {primaryResources.map((resource, index) => renderResourceBadge(resource, `p-${index}`))}
        </div>
        {classResources.length > 0 && (
          <>
            {primaryResources.length > 0 && <span className="pf-resource-divider" />}
            <div className="pf-resource-group pf-resource-group-secondary">
              {classResources.map((resource, index) => renderResourceBadge(resource, `c-${index}`))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Format spell components for display below spell name

  return {
    getResourceIcon,
    getResourceColor,
    formatResourceCosts,
  };
};

export default useResourceFormatters;