import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create a context for spell state
const SpellContext = createContext();

/**
 * Custom hook to consume the SpellContext
 */
export const useSpellContext = () => {
  const context = useContext(SpellContext);
  if (!context) {
    throw new Error('useSpellContext must be used within a SpellProvider');
  }
  return context;
};

/**
 * SpellProvider component
 * Provides state and functions for managing spell data
 *
 * @param {Object} props.spellData - Initial spell data to populate the context
 * @param {React.ReactNode} props.children - Child components
 */
export const SpellProvider = ({ spellData, children }) => {
  // Use a ref to track the previous spellData
  const prevSpellDataRef = useRef();

  // Initialize state with default values or passed in spellData
  const [spellState, setSpellState] = useState(spellData || {
    // Basic Information
    name: 'Arcane Blast',
    description: 'Blasts the target with arcane energy, dealing damage and slowing movement speed.',
    level: 3,
    // No school classification
    spellType: 'Spell',

    // Casting Configuration
    castingConfig: {
      castTime: '2 seconds',
      components: ['V', 'S'],
      concentration: false,
      ritual: false,
    },

    // Targeting Configuration
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      areaType: 'sphere',
      areaSize: 10,
      targetSelection: 'enemy',
    },

    // Duration Configuration
    durationConfig: {
      durationType: 'timed',
      durationAmount: 6,
      durationUnit: 'seconds',
      requiresConcentration: false,
    },

    // Resource Configuration
    resourceConfig: {
      resourceType: 'Mana',
      resourceAmount: 25,
      costScaling: true,
      scalingAmount: 5,
      scalingFactor: 'level',
    },

    // Cooldown Configuration
    cooldownConfig: {
      cooldownTime: '8 seconds',
      charges: 1,
      sharesCooldown: false,
      cooldownGroup: '',
    },

    // Effects Configuration
    effectsConfig: {
      effects: [
        {
          effectType: 'damage',
          effectName: 'Arcane Damage',
          damageType: 'arcane',
          damageAmount: '5d6',
        },
        {
          effectType: 'debuff',
          effectName: 'Arcane Slow',
          debuffEffect: 'Reduces movement speed by 30%',
          duration: '4 seconds',
        }
      ],
    },

    // Example data for other configurations
    propagationConfig: {
      propagationType: '',
    },

    channelingConfig: {
      channelType: '',
    },

    triggerConfig: {
      triggerType: '',
    },
  });

  // Update spell state when spellData prop changes
  useEffect(() => {
    // Only update if spellData exists and has changed
    if (spellData && prevSpellDataRef.current !== spellData) {
      setSpellState(spellData);
      prevSpellDataRef.current = spellData;
    }
  }, [spellData]);

  // Function to update a single property of the spell
  const updateSpellProperty = (property, value) => {
    setSpellState(prevState => ({
      ...prevState,
      [property]: value
    }));
  };

  // Function to update a nested config property
  const updateConfigProperty = (configName, property, value) => {
    setSpellState(prevState => ({
      ...prevState,
      [configName]: {
        ...prevState[configName],
        [property]: value
      }
    }));
  };

  // Function to add an effect
  const addEffect = (effect) => {
    setSpellState(prevState => ({
      ...prevState,
      effectsConfig: {
        ...prevState.effectsConfig,
        effects: [...(prevState.effectsConfig?.effects || []), effect]
      }
    }));
  };

  // Function to remove an effect
  const removeEffect = (index) => {
    setSpellState(prevState => {
      const newEffects = [...(prevState.effectsConfig?.effects || [])];
      newEffects.splice(index, 1);
      return {
        ...prevState,
        effectsConfig: {
          ...prevState.effectsConfig,
          effects: newEffects
        }
      };
    });
  };

  // Function to reset spell state
  const resetSpell = () => {
    setSpellState({
      // Basic Information
      name: 'Arcane Blast',
      description: 'Blasts the target with arcane energy, dealing damage and slowing movement speed.',
      level: 3,
      // No school classification
      spellType: 'Spell',

      // Casting Configuration
      castingConfig: {
        castTime: '2 seconds',
        components: ['V', 'S'],
        concentration: false,
        ritual: false,
      },

      // Targeting Configuration
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        areaType: 'sphere',
        areaSize: 10,
        targetSelection: 'enemy',
      },

      // Duration Configuration
      durationConfig: {
        durationType: 'timed',
        durationAmount: 6,
        durationUnit: 'seconds',
        requiresConcentration: false,
      },

      // Resource Configuration
      resourceConfig: {
        resourceType: 'Mana',
        resourceAmount: 25,
        costScaling: true,
        scalingAmount: 5,
        scalingFactor: 'level',
      },

      // Cooldown Configuration
      cooldownConfig: {
        cooldownTime: '8 seconds',
        charges: 1,
        sharesCooldown: false,
        cooldownGroup: '',
      },

      // Effects Configuration
      effectsConfig: {
        effects: [
          {
            effectType: 'damage',
            effectName: 'Arcane Damage',
            damageType: 'arcane',
            damageAmount: '5d6',
          },
          {
            effectType: 'debuff',
            effectName: 'Arcane Slow',
            debuffEffect: 'Reduces movement speed by 30%',
            duration: '4 seconds',
          }
        ],
      },

      // Example data for other configurations
      propagationConfig: {
        propagationType: '',
      },

      channelingConfig: {
        channelType: '',
      },

      triggerConfig: {
        triggerType: '',
      },
    });
  };

  // Context value
  const value = {
    spellState,
    setSpellState,
    updateSpellProperty,
    updateConfigProperty,
    addEffect,
    removeEffect,
    resetSpell
  };

  return (
    <SpellContext.Provider value={value}>
      {children}
    </SpellContext.Provider>
  );
};

export default SpellContext;
