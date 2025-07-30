import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import IconSelectionCard from '../../components/common/IconSelectionCard';
import CriticalHitConfig from '../../components/mechanics/CriticalHitConfig';
import ChanceOnHitConfig from '../../components/mechanics/ChanceOnHitConfig';
import SavingThrowConfig from '../../components/mechanics/SavingThrowConfig';
import MechanicsPopup from '../../components/common/MechanicsPopup';
import { FaDiceD20, FaClone, FaCoins, FaCog } from 'react-icons/fa';

import { ALL_VARIABLES } from '../../core/data/formulaVariables';
import MathHelpModal from '../../components/common/MathHelpModal';
import './damage-effects.css';
import './progressive-buff.css';

const DamageEffects = () => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [drawCount, setDrawCount] = useState(3);
  const [coinCount, setCoinCount] = useState(5);
  const [selectedCards, setSelectedCards] = useState([]);
  const [activeSuit, setActiveSuit] = useState('hearts');
  const [selectedCoinPattern, setSelectedCoinPattern] = useState('basic');
  const [showMathHelp, setShowMathHelp] = useState(false);

  // Popup states
  const [showCriticalHitPopup, setShowCriticalHitPopup] = useState(false);
  const [showSavingThrowPopup, setShowSavingThrowPopup] = useState(false);
  const [showChanceOnHitPopup, setShowChanceOnHitPopup] = useState(false);

  // Initialize damage config from global state
  const initializeDamageConfig = () => {
    const currentDamageConfig = state.damageConfig || {};
    
    // Use damage types from Step 1 if available, otherwise use current config or defaults
    const primaryElementType = currentDamageConfig.elementType || state.typeConfig?.school || 'fire';
    const secondaryElementType = currentDamageConfig.secondaryElementType || state.typeConfig?.secondaryElement || null;

    return {
      damageType: currentDamageConfig.damageType || 'direct',
      elementType: primaryElementType,
      secondaryElementType: secondaryElementType,
      formula: currentDamageConfig.formula || '2d6 + intelligence',
      resolution: currentDamageConfig.resolution || 'DICE',
      canCrit: currentDamageConfig.canCrit !== undefined ? currentDamageConfig.canCrit : false,
      critMultiplier: currentDamageConfig.critMultiplier || 2,
      hasDotEffect: currentDamageConfig.hasDotEffect || false,
      dotConfig: currentDamageConfig.dotConfig || {
        duration: 3,
        tickFrequency: 'round',
        scalingType: 'flat',
        dotFormula: '1d4 + intelligence/2'
      },
      // Critical Hit Configuration
      criticalConfig: currentDamageConfig.criticalConfig || {
        enabled: currentDamageConfig.canCrit !== undefined ? currentDamageConfig.canCrit : false,
        critType: 'dice',
        critMultiplier: currentDamageConfig.critMultiplier || 2,
        critDiceOnly: false,
        extraDice: '',
        explodingDice: false,
        explodingDiceType: 'reroll_add',
        critEffects: [],
        cardCritRule: 'face_cards',
        cardCritResolution: 'draw_add',
        extraCardDraw: 2,
        coinCritRule: 'all_heads',
        coinCritResolution: 'flip_add',
        extraCoinFlips: 3,
        coinCount: 3,
        critSuit: 'hearts',
        spellEffect: null,
        critOnlyEffect: false,
        useRollableTable: false
      },
      // Chance-on-Hit Configuration
      chanceOnHitConfig: currentDamageConfig.chanceOnHitConfig || {
        enabled: false,
        procType: 'dice',
        procChance: 15,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: [],
        useRollableTable: false
      },
      // Saving Throw Configuration
      savingThrow: currentDamageConfig.savingThrow || null,
      difficultyClass: currentDamageConfig.difficultyClass || 15,
      partialEffect: currentDamageConfig.partialEffect || false,
      partialEffectFormula: currentDamageConfig.partialEffectFormula || 'damage/2'
    };
  };

  const [damageConfig, setDamageConfig] = useState(() => initializeDamageConfig());

  // Set selected resolution from damage config
  const [currentResolution, setCurrentResolution] = useState(() => {
    // Use the resolution from damageConfig if available
    return damageConfig.resolution || 'DICE';
  });

  // Update local state when global state changes (but preserve user input)
  useEffect(() => {
    if (state.damageConfig) {
      setDamageConfig(prevConfig => ({
        ...prevConfig,
        ...state.damageConfig,
        // Preserve existing formula if user has set one and global state doesn't have a different one
        formula: state.damageConfig.formula || prevConfig.formula,
        // Preserve existing cardConfig and coinConfig if they exist
        cardConfig: state.damageConfig.cardConfig || prevConfig.cardConfig,
        coinConfig: state.damageConfig.coinConfig || prevConfig.coinConfig
      }));
    }
  }, [state.damageConfig, state.typeConfig]);

  // Update currentResolution when damageConfig changes
  useEffect(() => {
    const newResolution = damageConfig.resolution || 'DICE';
    if (newResolution !== currentResolution) {
      setCurrentResolution(newResolution);
    }
  }, [damageConfig.resolution]);

  const handleDamageConfigChange = (key, value) => {
    // console.log('handleDamageConfigChange called:', key, value);

    // Create new config with careful merging to preserve existing values
    const newConfig = { ...damageConfig };

    // Handle nested objects carefully
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      newConfig[key] = { ...damageConfig[key], ...value };
    } else {
      newConfig[key] = value;
    }

    // console.log('New config:', newConfig);
    setDamageConfig(newConfig);
    dispatch(actionCreators.updateDamageConfig(newConfig));
  };

  const handleFormulaChange = (formula) => {
    // Update the appropriate config based on current resolution
    if (currentResolution === 'CARDS') {
      handleDamageConfigChange('cardConfig', {
        ...damageConfig.cardConfig,
        formula: formula
      });
    } else if (currentResolution === 'COINS') {
      handleDamageConfigChange('coinConfig', {
        ...damageConfig.coinConfig,
        formula: formula
      });
    } else {
      // For DICE resolution, update the main formula
      handleDamageConfigChange('formula', formula);
    }
  };

  const addToFormula = (term) => {
    let currentFormula;
    if (currentResolution === 'CARDS') {
      currentFormula = damageConfig.cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
    } else if (currentResolution === 'COINS') {
      currentFormula = damageConfig.coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
    } else {
      currentFormula = damageConfig.formula || '2d6';
    }
    const newFormula = currentFormula + ' + ' + term;
    handleFormulaChange(newFormula);
  };

  const handleResolutionChange = (resolution) => {
    // console.log('DamageEffects - Resolution change:', resolution);

    // Update the local state
    setCurrentResolution(resolution);

    // Update progressive stage formulas if they exist
    if (damageConfig.dotConfig?.progressiveStages?.length > 0) {
      const updatedStages = damageConfig.dotConfig.progressiveStages.map(stage => {
        // Get appropriate base formula based on new resolution method
        let newFormula;
        if (resolution === 'CARDS') {
          newFormula = 'cards * 2 + INT/2';
        } else if (resolution === 'COINS') {
          newFormula = 'heads * 3 + INT/2';
        } else {
          newFormula = '1d4 + INT/2';
        }

        return {
          ...stage,
          formula: newFormula
        };
      });

      // Update the dotConfig with new progressive stages
      handleDamageConfigChange('dotConfig', {
        ...damageConfig.dotConfig,
        progressiveStages: updatedStages
      });
    }

    // Create a comprehensive config update to avoid multiple state updates
    const configUpdate = {
      resolution: resolution
    };

    // Always initialize config objects when switching to card/coin resolution
    if (resolution === 'CARDS') {
      configUpdate.cardConfig = {
        drawCount: damageConfig.cardConfig?.drawCount || 3,
        formula: damageConfig.cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3'
      };

      // Also initialize DoT card config if DoT is enabled
      if (damageConfig.hasDamageOverTime) {
        configUpdate.dotConfig = {
          ...damageConfig.dotConfig,
          cardConfig: {
            drawCount: damageConfig.dotConfig?.cardConfig?.drawCount || 3,
            formula: damageConfig.dotConfig?.cardConfig?.formula || 'CARD_VALUE/2 + intelligence/3'
          }
        };
      }
    } else if (resolution === 'COINS') {
      configUpdate.coinConfig = {
        flipCount: damageConfig.coinConfig?.flipCount || 4,
        formula: damageConfig.coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
      };

      // Also initialize DoT coin config if DoT is enabled
      if (damageConfig.hasDamageOverTime) {
        configUpdate.dotConfig = {
          ...damageConfig.dotConfig,
          coinConfig: {
            flipCount: damageConfig.dotConfig?.coinConfig?.flipCount || 4,
            formula: damageConfig.dotConfig?.coinConfig?.formula || 'HEADS_COUNT * 2 + intelligence/3'
          }
        };
      }
    }

    // Apply all changes in a single update
    // console.log('DamageEffects - Applying config update:', configUpdate);
    const newConfig = { ...damageConfig, ...configUpdate };
    setDamageConfig(newConfig);
    dispatch(actionCreators.updateDamageConfig(newConfig));
  };

  const getElementCode = (element) => {
    const elementCodes = {
      fire: 'intelligence',
      cold: 'intelligence',
      lightning: 'intelligence',
      acid: 'intelligence',
      poison: 'intelligence',
      necrotic: 'intelligence',
      radiant: 'spirit',
      psychic: 'intelligence',
      force: 'intelligence',
      thunder: 'constitution'
    };
    return elementCodes[element] || 'intelligence';
  };

  const getCurrentElement = () => {
    return damageConfig.elementType || 'fire';
  };

  // Get all available character stats organized by category
  const getCharacterStatsByCategory = () => {
    return {
      'Primary Attributes': [
        { key: 'strength', name: 'Strength', description: 'Physical power and melee damage' },
        { key: 'agility', name: 'Agility', description: 'Dexterity, reflexes, and ranged accuracy' },
        { key: 'constitution', name: 'Constitution', description: 'Health, stamina, and physical resilience' },
        { key: 'intelligence', name: 'Intelligence', description: 'Magical power, knowledge, and spell effectiveness' },
        { key: 'spirit', name: 'Spirit', description: 'Willpower, spiritual energy, and mana regeneration' },
        { key: 'charisma', name: 'Charisma', description: 'Social influence, leadership, and divine magic' }
      ],
      'Combat Stats': [
        { key: 'damage', name: 'Melee Damage', description: 'Physical damage bonus from strength and equipment' },
        { key: 'spellDamage', name: 'Spell Damage', description: 'Magical damage bonus from intelligence and equipment' },
        { key: 'rangedDamage', name: 'Ranged Damage', description: 'Ranged attack damage bonus from agility and equipment' },
        { key: 'healingPower', name: 'Healing Power', description: 'Healing effectiveness bonus from spirit and equipment' },
        { key: 'armor', name: 'Armor', description: 'Physical damage reduction' },
        { key: 'initiative', name: 'Initiative', description: 'Initiative bonus for combat order' }
      ],
      'Resources': [
        { key: 'maxHealth', name: 'Max Health', description: 'Maximum health points' },
        { key: 'currentHealth', name: 'Current Health', description: 'Current health points' },
        { key: 'maxMana', name: 'Max Mana', description: 'Maximum mana points' },
        { key: 'currentMana', name: 'Current Mana', description: 'Current mana points' },
        { key: 'maxActionPoints', name: 'Max Action Points', description: 'Maximum action points per turn' },
        { key: 'currentActionPoints', name: 'Current Action Points', description: 'Current action points remaining' }
      ],
      'Recovery & Utility': [
        { key: 'healthRegen', name: 'Health Regeneration', description: 'Health points regenerated per turn' },
        { key: 'manaRegen', name: 'Mana Regeneration', description: 'Mana points regenerated per turn' },
        { key: 'moveSpeed', name: 'Movement Speed', description: 'Base movement speed in feet per turn' },
        { key: 'carryingCapacity', name: 'Carrying Capacity', description: 'Maximum weight that can be carried' }
      ],
      'Progression': [
        { key: 'level', name: 'Character Level', description: 'Current character level' },
        { key: 'exhaustionLevel', name: 'Exhaustion Level', description: 'Current exhaustion level (0-6)' }
      ]
    };
  };

  // Get advanced formula examples with plain English descriptions
  const getAdvancedFormulaExamples = () => {
    return [
      {
        name: 'Health-based Scaling',
        formula: '2d6 + intelligence + (currentHealth < maxHealth/2 ? 10 : 0)',
        description: 'Cast 2d6, channel Intelligence, +10 if wounded',
        category: 'Conditional'
      },
      {
        name: 'Mana Scaling',
        formula: '1d8 + fireDamage + (currentMana > maxMana*0.75 ? 15 : 5)',
        description: 'Cast 1d8, channel flame mastery, +15 if essence high',
        category: 'Conditional'
      },
      {
        name: 'Resource Sacrifice',
        formula: '3d8 + (currentMana >= 20 ? currentMana/4 : 0)',
        description: 'Cast 3d8, sacrifice essence for power',
        category: 'Resource'
      },
      {
        name: 'Exhaustion Penalty',
        formula: '2d8 + intelligence - exhaustionLevel*3',
        description: 'Cast 2d8, channel Intelligence, -3 per fatigue',
        category: 'Conditional'
      },
      {
        name: 'Action Point Boost',
        formula: '1d10 + fireDamage + currentActionPoints*5',
        description: 'Cast 1d10, channel flame mastery, +5 per action',
        category: 'Resource'
      },
      {
        name: 'Constitution Scaling',
        formula: '1d6 + constitution + armor/2',
        description: 'Cast 1d6, channel Constitution + defense',
        category: 'Defensive'
      }
    ];
  };

  // Get dice formula examples
  const getDiceFormulaExamples = () => {
    return [
      { name: 'Arcane Missile', formula: '3d4 + intelligence + arcaneDamage', description: 'Multiple small dice with arcane mastery' },
      { name: 'Berserker Fury', formula: '2d12 + strength + (currentHealth < maxHealth/2 ? strength : 0)', description: 'High variance, bonus when wounded' },
      { name: 'Elemental Storm', formula: '4d6 + intelligence + fireDamage + (currentMana > 50 ? 15 : 0)', description: 'Quad dice with mana scaling' },
      { name: 'Assassinate', formula: '1d20 + agility + (target.currentHealth < target.maxHealth/4 ? 25 : 0)', description: 'Execute bonus on low health targets' },
      { name: 'Divine Wrath', formula: '5d8 + spirit + holyDamage + MAX(intelligence, spirit)', description: 'Massive holy damage with stat synergy' },
      { name: 'Chaos Bolt', formula: '2d10 + intelligence + (RANDOM(1,100) > 75 ? 2d10 : 0)', description: 'Random chance for double damage' },
      { name: 'Soul Burn', formula: '3d8 + intelligence + shadowDamage + MIN(currentMana/10, 20)', description: 'Mana-scaling shadow magic' },
      { name: 'Titan Strike', formula: '6d6 + strength * 2 + constitution + (strength > 25 ? 30 : 0)', description: 'Overwhelming physical assault' },
      { name: 'Mind Blast', formula: '2d8 + intelligence * 3 + psychicDamage + (target.currentMana < 20 ? 12 : 0)', description: 'Psychic damage with mana drain bonus' },
      { name: 'Void Rift', formula: '4d10 + intelligence + voidDamage + ROUND(currentHealth/10)', description: 'Reality-tearing magic scaling with vitality' }
    ];
  };

  // Get card formula examples
  const getCardFormulaExamples = () => {
    return [
      { name: 'Basic Value', formula: 'CARD_VALUE + intelligence', description: 'Draw from deck, channel Intelligence' },
      { name: 'Face Card Bonus', formula: 'CARD_VALUE + FACE_CARDS * 5', description: 'Draw from deck, +5 per royal' },
      { name: 'Poker Hand Power', formula: 'CARD_VALUE + POKER_HAND_RANK * 10', description: 'Bonus based on poker hand strength' },
      { name: 'Royal Flush', formula: 'ROYAL_FLUSH ? CARD_VALUE * 4 : CARD_VALUE', description: 'Quadruple damage with royal flush' },
      { name: 'Straight Power', formula: 'STRAIGHT ? CARD_VALUE * 2 + 15 : CARD_VALUE', description: 'Double damage + 15 with straight' },
      { name: 'Flush Mastery', formula: 'FLUSH ? CARD_VALUE * 2.5 : CARD_VALUE + SUIT_COUNT * 3', description: 'Major bonus for flush, minor for suits' },
      { name: 'Pair Synergy', formula: 'CARD_VALUE + PAIRS * 8 + (PAIRS > 1 ? 20 : 0)', description: '8 per pair, +20 for multiple pairs' },
      { name: 'Ace Supremacy', formula: 'ACES > 0 ? CARD_VALUE + ACES * 15 + intelligence : CARD_VALUE', description: '15 per ace + Intelligence if any aces' },
      { name: 'Color Harmony', formula: 'SAME_SUIT ? RED_COUNT * 8 + BLACK_COUNT * 8 : RED_COUNT * 4 + BLACK_COUNT * 6', description: 'Better damage if all same color' },
      { name: 'High Stakes', formula: 'HIGHEST_CARD > 10 ? CARD_VALUE * 2 + intelligence * 2 : CARD_VALUE', description: 'Double everything with face card high' }
    ];
  };

  // Get coin formula examples
  const getCoinFormulaExamples = () => {
    return [
      { name: 'Heads Count', formula: 'HEADS_COUNT * 8 + intelligence', description: 'Flip fate coins, 8 per heads + Intelligence' },
      { name: 'All or Nothing', formula: 'ALL_HEADS ? 60 : ALL_TAILS ? 30 : 10', description: '60 if all heads, 30 if all tails, 10 mixed' },
      { name: 'Streak Mastery', formula: 'LONGEST_STREAK * 15 + CONSECUTIVE_HEADS * 5', description: '15 per longest streak + 5 per consecutive heads' },
      { name: 'Pattern Power', formula: 'ALTERNATING_PATTERN ? 45 + intelligence : PATTERN_MATCH * 12', description: '45 + Intelligence if alternating, 12 per pattern match' },
      { name: 'Ratio Magic', formula: 'HEADS_RATIO * 80 + intelligence', description: 'Damage scales with heads percentage' },
      { name: 'Consecutive Force', formula: 'CONSECUTIVE_HEADS > 2 ? HEADS_COUNT * 12 : HEADS_COUNT * 6', description: 'Double damage per head with 3+ consecutive' },
      { name: 'Balance Chaos', formula: 'HEADS_COUNT == TAILS_COUNT ? 55 + intelligence * 2 : ABS(HEADS_COUNT - TAILS_COUNT) * 8', description: 'Big bonus if balanced, damage from imbalance' },
      { name: 'Fortune Storm', formula: 'HEADS_COUNT * 7 + (ALL_HEADS ? 30 : CONSECUTIVE_HEADS * 4)', description: '7 per head, +30 if all heads or +4 per consecutive' },
      { name: 'Fate Weaver', formula: 'COIN_COUNT * 4 + LONGEST_STREAK * 8 + (PATTERN_MATCH > 0 ? 20 : 0)', description: 'Complex fate manipulation with pattern bonus' },
      { name: 'Probability Bend', formula: 'HEADS_RATIO > 0.7 ? intelligence * 3 + HEADS_COUNT * 10 : HEADS_COUNT * 5', description: 'Massive bonus if 70%+ heads' }
    ];
  };

  // Get DoT formula examples based on resolution type
  const getDotFormulaExamples = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return [
          { name: 'Light Burn', formula: '1d4 + intelligence/2', description: 'Light damage each round' },
          { name: 'Moderate Burn', formula: '1d6 + intelligence/2', description: 'Moderate damage each round' },
          { name: 'Heavy Burn', formula: '1d8 + intelligence', description: 'Heavy damage each round' },
          { name: 'Escalating', formula: '1d4 + roundNumber', description: 'Damage increases each round' },
          { name: 'Weakening', formula: '2d4 - roundNumber', description: 'Damage decreases each round' },
          { name: 'Health-based', formula: '1d6 + (maxHealth - currentHealth)/10', description: 'More damage when wounded' }
        ];
      case 'CARDS':
        return [
          { name: 'Card Burn', formula: 'CARD_VALUE/2 + intelligence/3', description: 'Half card value + Intelligence' },
          { name: 'Face Burn', formula: 'FACE_CARDS * 3 + 2', description: '3 damage per face card + 2' },
          { name: 'Suit Power', formula: 'SAME_SUIT_COUNT * 4', description: '4 damage per matching suit' },
          { name: 'High Card', formula: 'HIGHEST_CARD + intelligence/4', description: 'Highest card + Intelligence' },
          { name: 'Red Burn', formula: 'RED_COUNT * 3 + BLACK_COUNT', description: '3 per red, 1 per black' },
          { name: 'Ace Power', formula: 'ACES * 8 + CARD_VALUE/3', description: '8 per ace + card value' }
        ];
      case 'COINS':
        return [
          { name: 'Heads Burn', formula: 'HEADS_COUNT * 3 + intelligence/3', description: '3 per heads + Intelligence' },
          { name: 'Tails Burn', formula: 'TAILS_COUNT * 4 + 1', description: '4 per tails + 1' },
          { name: 'All Heads', formula: 'ALL_HEADS ? 12 : 3', description: '12 if all heads, 3 otherwise' },
          { name: 'Balance Burn', formula: 'HEADS_COUNT == TAILS_COUNT ? 8 : 4', description: '8 if balanced, 4 otherwise' },
          { name: 'Chaos Burn', formula: 'HEADS_COUNT * TAILS_COUNT + 2', description: 'Heads × tails + 2' },
          { name: 'Streak Burn', formula: 'LONGEST_STREAK * 2 + 3', description: '2 per longest streak + 3' }
        ];
      default:
        return [];
    }
  };



  // DoT formula helper functions
  const handleDotFormulaChange = (formula) => {
    // Update the appropriate DoT config based on current resolution
    if (currentResolution === 'CARDS') {
      handleDamageConfigChange('dotConfig', {
        ...damageConfig.dotConfig,
        cardConfig: {
          ...damageConfig.dotConfig?.cardConfig,
          formula: formula
        }
      });
    } else if (currentResolution === 'COINS') {
      handleDamageConfigChange('dotConfig', {
        ...damageConfig.dotConfig,
        coinConfig: {
          ...damageConfig.dotConfig?.coinConfig,
          formula: formula
        }
      });
    } else {
      // For DICE resolution, update the main DoT formula
      handleDamageConfigChange('dotConfig', {
        ...damageConfig.dotConfig,
        dotFormula: formula
      });
    }
  };

  const addToDotFormula = (term) => {
    let currentFormula;
    if (currentResolution === 'CARDS') {
      currentFormula = damageConfig.dotConfig?.cardConfig?.formula || 'CARD_VALUE/2';
    } else if (currentResolution === 'COINS') {
      currentFormula = damageConfig.dotConfig?.coinConfig?.formula || 'HEADS_COUNT * 2';
    } else {
      currentFormula = damageConfig.dotConfig?.dotFormula || '1d4';
    }
    const newFormula = currentFormula + ' + ' + term;
    handleDotFormulaChange(newFormula);
  };

  // Card helper functions
  const getSuitSymbol = (suit) => {
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    };
    return symbols[suit] || '?';
  };

  const getSuitColor = (suit) => {
    return (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black';
  };

  const toggleCardSelection = (suit, rank) => {
    const cardId = `${rank}-${suit}`;
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(c => c !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const addCardToFormula = (cardType) => {
    const currentFormula = damageConfig.formula || 'CARD_VALUE + intelligence';
    const newFormula = currentFormula + ' + ' + cardType;
    handleFormulaChange(newFormula);
  };

  // Coin helper functions
  const getCoinPatterns = () => {
    return [
      { id: 'basic', name: 'Basic Flips', description: 'Simple heads/tails counting' },
      { id: 'streaks', name: 'Streak Focus', description: 'Bonus for consecutive results' },
      { id: 'patterns', name: 'Pattern Matching', description: 'Bonus for specific sequences' },
      { id: 'balance', name: 'Balance Focus', description: 'Bonus for equal heads/tails' }
    ];
  };

  return (
    <div className="damage-effects-container">
      {/* First section: Damage Type Selection */}
      <div className="damage-type-section section">
        <h3>Damage Type</h3>
        <div className="two-column">
          <IconSelectionCard
            icon=""
            title="Immediate Damage"
            description="Deals damage immediately upon casting"
            onClick={() => {
              console.log('Immediate Damage clicked');
              const newConfig = {
                ...damageConfig,
                damageType: 'direct',
                hasDotEffect: false
              };
              setDamageConfig(newConfig);
              dispatch(actionCreators.updateDamageConfig(newConfig));
            }}
            selected={damageConfig.damageType === 'direct' && !damageConfig.hasDotEffect}
          />
          <IconSelectionCard
            icon=""
            title="DoT (Damage Over Time)"
            description="Deals recurring damage over multiple turns"
            onClick={() => {
              console.log('DoT (Damage Over Time) clicked');
              const newConfig = {
                ...damageConfig,
                damageType: 'dot',
                hasDotEffect: false
              };
              setDamageConfig(newConfig);
              dispatch(actionCreators.updateDamageConfig(newConfig));
            }}
            selected={damageConfig.damageType === 'dot' && !damageConfig.hasDotEffect}
          />
          <IconSelectionCard
            icon=""
            title="Immediate + DoT"
            description="Deals immediate damage plus damage over time"
            onClick={() => {
              console.log('Immediate + DoT clicked');
              const newConfig = {
                ...damageConfig,
                damageType: 'direct',
                hasDotEffect: true
              };
              setDamageConfig(newConfig);
              dispatch(actionCreators.updateDamageConfig(newConfig));
            }}
            selected={damageConfig.damageType === 'direct' && damageConfig.hasDotEffect}
          />
        </div>
      </div>

      {/* Second section: Resolution Method - Only show for instant damage or instant+DoT */}
      {(damageConfig.damageType === 'direct' || damageConfig.hasDotEffect) && (
        <div className="resolution-section section">
          <h3>Resolution Method</h3>
          <div className="resolution-options">
            <div
              className={`resolution-option ${currentResolution === 'DICE' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Dice div clicked');
                handleResolutionChange('DICE');
              }}
              style={{
                pointerEvents: 'auto',
                zIndex: 20,
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <FaDiceD20 className="resolution-icon" />
              <span>Dice</span>
            </div>
            <div
              className={`resolution-option ${currentResolution === 'CARDS' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cards div clicked');
                handleResolutionChange('CARDS');
              }}
              style={{
                pointerEvents: 'auto',
                zIndex: 20,
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <FaClone className="resolution-icon" />
              <span>Cards</span>
            </div>
            <div
              className={`resolution-option ${currentResolution === 'COINS' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Coins div clicked');
                handleResolutionChange('COINS');
              }}
              style={{
                pointerEvents: 'auto',
                zIndex: 20,
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <FaCoins className="resolution-icon" />
              <span>Coins</span>
            </div>
          </div>

          {/* Count Configuration for Cards/Coins */}
          {currentResolution === 'CARDS' && (
            <div className="count-config-section">
              <label htmlFor="card-draw-count">Cards Drawn:</label>
              <input
                id="card-draw-count"
                type="number"
                min="1"
                max="10"
                value={damageConfig.cardConfig?.drawCount || 4}
                onChange={(e) => {
                  const drawCount = parseInt(e.target.value) || 4;
                  handleDamageConfigChange('cardConfig', {
                    ...damageConfig.cardConfig,
                    drawCount: drawCount,
                    formula: damageConfig.cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="count-config-section">
              <label htmlFor="coin-flip-count">Coins Flipped:</label>
              <input
                id="coin-flip-count"
                type="number"
                min="1"
                max="10"
                value={damageConfig.coinConfig?.flipCount || 5}
                onChange={(e) => {
                  const flipCount = parseInt(e.target.value) || 5;
                  handleDamageConfigChange('coinConfig', {
                    ...damageConfig.coinConfig,
                    flipCount: flipCount,
                    formula: damageConfig.coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2'
                  });
                }}
                className="count-input"
              />
            </div>
          )}

        {/* Resolution-specific configuration */}
        <div className="resolution-config-section">
          {/* Formula Input - Right below buttons */}
          <div className="formula-input-section">
            <h4>Formula</h4>
            <textarea
              value={
                currentResolution === 'CARDS'
                  ? (damageConfig.cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3')
                  : currentResolution === 'COINS'
                  ? (damageConfig.coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2')
                  : (damageConfig.formula || '2d6 + intelligence')
              }
              onChange={(e) => handleFormulaChange(e.target.value)}
              placeholder={`Enter ${currentResolution.toLowerCase()} formula`}
              className="main-formula-input"
              rows="2"
            />
          </div>

          {/* Character Variables Section */}
          <div className="character-variables-section">
            <h5>
              Character Variables
              <button
                className="math-help-button"
                onClick={() => setShowMathHelp(true)}
                title="Math & Formula Help"
              >
                ?
              </button>
            </h5>

            <div className="character-variables-compact">
              {/* Core Attributes */}
              <div className="variable-category">
                <h6>Core Attributes</h6>
                <div className="variables-grid">
                  {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => (
                    <button
                      key={attr}
                      className="variable-button"
                      onClick={() => addToFormula(attr)}
                    >
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Combat Stats */}
              <div className="variable-category">
                <h6>Combat Stats</h6>
                <div className="variables-grid">
                  {['damage', 'rangedDamage', 'healingPower'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button"
                      onClick={() => addToFormula(stat)}
                    >
                      {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spell Damage Types */}
              <div className="variable-category">
                <h6>Spell Damage</h6>
                <div className="variables-grid">
                  {['fireDamage', 'frostDamage', 'arcaneDamage', 'poisonDamage'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button spell-damage-type"
                      onClick={() => addToFormula(stat)}
                    >
                      {stat.replace(/Damage$/, '').charAt(0).toUpperCase() + stat.replace(/Damage$/, '').slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* More Spell Damage Types */}
              <div className="variable-category">
                <h6>More Spell Damage</h6>
                <div className="variables-grid">
                  {['holyDamage', 'shadowDamage', 'natureDamage', 'lightningDamage'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button spell-damage-type"
                      onClick={() => addToFormula(stat)}
                    >
                      {stat.replace(/Damage$/, '').charAt(0).toUpperCase() + stat.replace(/Damage$/, '').slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Defensive Stats */}
              <div className="variable-category">
                <h6>Defensive Stats</h6>
                <div className="variables-grid">
                  {['armor', 'maxHealth', 'maxMana', 'healthRegen', 'manaRegen'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button"
                      onClick={() => addToFormula(stat)}
                    >
                      {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Resources */}
              <div className="variable-category">
                <h6>Current Resources</h6>
                <div className="variables-grid">
                  {['currentHealth', 'currentMana', 'currentActionPoints', 'exhaustionLevel'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button"
                      onClick={() => addToFormula(stat)}
                    >
                      {stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resolution-Specific Variables */}
            {currentResolution === 'DICE' && (
              <div className="variable-category dice-variables-section">
                <h6>Dice Variables</h6>
                <div className="variables-grid">
                  {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '2d6', '3d6'].map(dice => (
                    <button
                      key={dice}
                      className="variable-button resolution-specific"
                      onClick={() => addToFormula(dice)}
                    >
                      {dice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentResolution === 'DICE' && (
              <div className="variable-category dice-functions-section">
                <h6>Dice Functions</h6>
                <div className="variables-grid">
                  {['DICE_COUNT', 'DICE_SIDES', 'TOTAL_ROLL', 'HIGHEST_DIE', 'LOWEST_DIE', 'CRITICAL_HITS'].map(variable => (
                    <button
                      key={variable}
                      className="variable-button resolution-specific"
                      onClick={() => addToFormula(variable)}
                    >
                      {variable.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentResolution === 'CARDS' && (
              <div className="variable-category">
                <h6>Card Variables</h6>
                <div className="variables-grid">
                  {['CARD_VALUE', 'FACE_CARDS', 'ACES', 'HIGHEST_CARD', 'RED_COUNT', 'BLACK_COUNT', 'SUIT_COUNT', 'PAIRS', 'SAME_SUIT', 'FLUSH', 'STRAIGHT', 'ROYAL_FLUSH', 'POKER_HAND_RANK'].map(variable => (
                    <button
                      key={variable}
                      className="variable-button resolution-specific"
                      onClick={() => addToFormula(variable)}
                    >
                      {variable.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentResolution === 'COINS' && (
              <div className="variable-category">
                <h6>Coin Variables</h6>
                <div className="variables-grid">
                  {['HEADS_COUNT', 'TAILS_COUNT', 'ALL_HEADS', 'ALL_TAILS', 'LONGEST_STREAK', 'ALTERNATING_PATTERN', 'COIN_COUNT', 'HEADS_RATIO', 'CONSECUTIVE_HEADS', 'CONSECUTIVE_TAILS', 'PATTERN_MATCH'].map(variable => (
                    <button
                      key={variable}
                      className="variable-button resolution-specific"
                      onClick={() => addToFormula(variable)}
                    >
                      {variable.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentResolution === 'DICE' && (
            <div className="dice-examples-section">
              <h5>Dice Formula Examples</h5>
              <div className="examples-grid">
                {getDiceFormulaExamples().slice(0, 8).map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${damageConfig.formula === example.formula ? 'active' : ''}`}
                    onClick={() => handleFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentResolution === 'CARDS' && (
            <div className="card-examples-section">
              <h5>Card Formula Examples</h5>
              <div className="examples-grid">
                {getCardFormulaExamples().slice(0, 10).map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${damageConfig.formula === example.formula ? 'active' : ''}`}
                    onClick={() => handleFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card Selection Area */}
          {currentResolution === 'CARDS' && (
            <div className="card-selector-container">
              <h4>Select Specific Cards for Bonuses</h4>
              <p className="card-selection-help">
                Click cards below to select them. Selected cards will add a bonus to your formula if those exact cards are drawn.
              </p>
              <div className="card-suit-tabs">
                <div
                  className={`card-suit-tab red ${activeSuit === 'hearts' ? 'active' : ''}`}
                  onClick={() => setActiveSuit('hearts')}
                >
                  <span className="suit-symbol">♥</span> Hearts
                </div>
                <div
                  className={`card-suit-tab red ${activeSuit === 'diamonds' ? 'active' : ''}`}
                  onClick={() => setActiveSuit('diamonds')}
                >
                  <span className="suit-symbol">♦</span> Diamonds
                </div>
                <div
                  className={`card-suit-tab black ${activeSuit === 'clubs' ? 'active' : ''}`}
                  onClick={() => setActiveSuit('clubs')}
                >
                  <span className="suit-symbol">♣</span> Clubs
                </div>
                <div
                  className={`card-suit-tab black ${activeSuit === 'spades' ? 'active' : ''}`}
                  onClick={() => setActiveSuit('spades')}
                >
                  <span className="suit-symbol">♠</span> Spades
                </div>
              </div>

              <div className="card-grid">
                {['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].map((rank) => (
                  <div
                    key={`${activeSuit}-${rank}`}
                    className={`playing-card ${activeSuit} ${selectedCards.includes(`${rank}-${activeSuit}`) ? 'selected' : ''}`}
                    onClick={() => toggleCardSelection(activeSuit, rank)}
                  >
                    <div className="card-corner card-top-left">
                      <div className="card-rank">{rank}</div>
                      <div className="card-suit">{getSuitSymbol(activeSuit)}</div>
                    </div>
                    <div className="card-center">
                      {getSuitSymbol(activeSuit)}
                    </div>
                    <div className="card-corner card-bottom-right">
                      <div className="card-rank">{rank}</div>
                      <div className="card-suit">{getSuitSymbol(activeSuit)}</div>
                    </div>
                    {selectedCards.includes(`${rank}-${activeSuit}`) && (
                      <div className="card-selected-indicator">
                        {selectedCards.indexOf(`${rank}-${activeSuit}`) + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}






          {currentResolution === 'COINS' && (
            <div className="coin-examples-section">
              <h5>Coin Formula Examples</h5>
              <div className="examples-grid">
                {getCoinFormulaExamples().slice(0, 10).map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${damageConfig.formula === example.formula ? 'active' : ''}`}
                    onClick={() => handleFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>
      )}

      {/* DoT Configuration Section */}
      {(damageConfig.damageType === 'dot' || damageConfig.hasDotEffect) && (
        <div className="dot-config-section section">
          <h3>Damage Over Time Configuration</h3>

          {/* Resolution Method for pure DoT */}
          {damageConfig.damageType === 'dot' && !damageConfig.hasDotEffect && (
            <div className="dot-resolution-section">
              <h4>DoT Resolution Method</h4>
              <div className="resolution-options">
                <button
                  className={`resolution-option ${currentResolution === 'DICE' ? 'active' : ''}`}
                  onClick={() => handleResolutionChange('DICE')}
                >
                  <FaDiceD20 className="resolution-icon" />
                  <span>Dice</span>
                </button>
                <button
                  className={`resolution-option ${currentResolution === 'CARDS' ? 'active' : ''}`}
                  onClick={() => handleResolutionChange('CARDS')}
                >
                  <FaClone className="resolution-icon" />
                  <span>Cards</span>
                </button>
                <button
                  className={`resolution-option ${currentResolution === 'COINS' ? 'active' : ''}`}
                  onClick={() => handleResolutionChange('COINS')}
                >
                  <FaCoins className="resolution-icon" />
                  <span>Coins</span>
                </button>
              </div>
            </div>
          )}

          {/* Count Configuration for DoT Cards/Coins */}
          {currentResolution === 'CARDS' && (
            <div className="count-config-section">
              <label htmlFor="dot-card-draw-count">Cards Drawn (DoT):</label>
              <input
                id="dot-card-draw-count"
                type="number"
                min="1"
                max="10"
                value={damageConfig.dotConfig?.cardConfig?.drawCount || 3}
                onChange={(e) => {
                  const drawCount = parseInt(e.target.value) || 3;
                  handleDamageConfigChange('dotConfig', {
                    ...damageConfig.dotConfig,
                    cardConfig: {
                      ...damageConfig.dotConfig?.cardConfig,
                      drawCount: drawCount,
                      formula: damageConfig.dotConfig?.cardConfig?.formula || 'CARD_VALUE/2 + intelligence/3'
                    }
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="count-config-section">
              <label htmlFor="dot-coin-flip-count">Coins Flipped (DoT):</label>
              <input
                id="dot-coin-flip-count"
                type="number"
                min="1"
                max="10"
                value={damageConfig.dotConfig?.coinConfig?.flipCount || 4}
                onChange={(e) => {
                  const flipCount = parseInt(e.target.value) || 4;
                  handleDamageConfigChange('dotConfig', {
                    ...damageConfig.dotConfig,
                    coinConfig: {
                      ...damageConfig.dotConfig?.coinConfig,
                      flipCount: flipCount,
                      formula: damageConfig.dotConfig?.coinConfig?.formula || 'HEADS_COUNT * 2 + intelligence/3'
                    }
                  });
                }}
                className="count-input"
              />
            </div>
          )}

          {/* Duration and Frequency Controls */}
          <div className="dot-config-grid">
            <div className="dot-config-item">
              <label>Duration:</label>
              <div className="dot-duration-controls">
                <input
                  type="number"
                  value={damageConfig.dotConfig?.duration || 3}
                  onChange={(e) => handleDamageConfigChange('dotConfig', {
                    ...damageConfig.dotConfig,
                    duration: parseInt(e.target.value, 10)
                  })}
                  min="1"
                  max="10"
                  className="dot-input"
                />
                <select
                  value={damageConfig.dotConfig?.tickFrequency || 'round'}
                  onChange={(e) => handleDamageConfigChange('dotConfig', {
                    ...damageConfig.dotConfig,
                    tickFrequency: e.target.value
                  })}
                  className="dot-select"
                >
                  <option value="round">Rounds</option>
                  <option value="turn">Turns</option>
                  <option value="minute">Minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* DoT Formula Input Section */}
          <div className="formula-input-section">
            <h4>DoT Formula</h4>
            <textarea
              value={
                currentResolution === 'CARDS'
                  ? (damageConfig.dotConfig?.cardConfig?.formula || 'CARD_VALUE/2 + intelligence/3')
                  : currentResolution === 'COINS'
                  ? (damageConfig.dotConfig?.coinConfig?.formula || 'HEADS_COUNT * 2 + intelligence/3')
                  : (damageConfig.dotConfig?.dotFormula || '1d4 + intelligence/2')
              }
              onChange={(e) => handleDotFormulaChange(e.target.value)}
              placeholder={`Enter ${currentResolution.toLowerCase()} DoT formula`}
              className="main-formula-input"
              rows="2"
            />
          </div>

          {/* Character Variables Section for DoT */}
          <div className="character-variables-section">
            <h5>
              Character Variables
              <button
                className="math-help-button"
                onClick={() => setShowMathHelp(true)}
                title="Math & Formula Help"
              >
                ?
              </button>
            </h5>

            <div className="character-variables-compact">
              {/* Core Attributes */}
              <div className="variable-category">
                <h6>Core Attributes</h6>
                <div className="variables-grid">
                  {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => (
                    <button
                      key={attr}
                      className="variable-button"
                      onClick={() => addToDotFormula(attr)}
                    >
                      {attr.charAt(0).toUpperCase() + attr.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spell Damage Types */}
              <div className="variable-category">
                <h6>Spell Damage</h6>
                <div className="variables-grid">
                  {['fireDamage', 'frostDamage', 'arcaneDamage', 'poisonDamage'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button spell-damage-type"
                      onClick={() => addToDotFormula(stat)}
                    >
                      {stat.replace(/Damage$/, '').charAt(0).toUpperCase() + stat.replace(/Damage$/, '').slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* More Spell Damage Types */}
              <div className="variable-category">
                <h6>More Spell Damage</h6>
                <div className="variables-grid">
                  {['holyDamage', 'shadowDamage', 'natureDamage', 'lightningDamage'].map(stat => (
                    <button
                      key={stat}
                      className="variable-button spell-damage-type"
                      onClick={() => addToDotFormula(stat)}
                    >
                      {stat.replace(/Damage$/, '').charAt(0).toUpperCase() + stat.replace(/Damage$/, '').slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resolution-specific variables for DoT */}
            {currentResolution === 'DICE' && (
              <div className="variable-category">
                <h6>Dice Variables</h6>
                <div className="variables-grid">
                  {['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '2d6', '3d6'].map(dice => (
                    <button
                      key={dice}
                      className="variable-button resolution-specific"
                      onClick={() => addToDotFormula(dice)}
                    >
                      {dice}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentResolution === 'CARDS' && (
              <div className="variable-category">
                <h6>Card Variables</h6>
                <div className="variables-grid">
                  {['CARD_VALUE', 'FACE_CARDS', 'ACES', 'HIGHEST_CARD', 'RED_COUNT', 'BLACK_COUNT', 'SUIT_COUNT'].map(variable => (
                    <button
                      key={variable}
                      className="variable-button resolution-specific"
                      onClick={() => addToDotFormula(variable)}
                    >
                      {variable.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentResolution === 'COINS' && (
              <div className="variable-category">
                <h6>Coin Variables</h6>
                <div className="variables-grid">
                  {['HEADS_COUNT', 'TAILS_COUNT', 'ALL_HEADS', 'ALL_TAILS', 'LONGEST_STREAK', 'ALTERNATING_PATTERN', 'COIN_COUNT'].map(variable => (
                    <button
                      key={variable}
                      className="variable-button resolution-specific"
                      onClick={() => addToDotFormula(variable)}
                    >
                      {variable.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DoT Formula Examples */}
          {currentResolution === 'DICE' && (
            <div className="dice-examples-section">
              <h5>DoT Dice Formula Examples</h5>
              <div className="examples-grid">
                {getDotFormulaExamples('DICE').map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${damageConfig.dotConfig?.dotFormula === example.formula ? 'active' : ''}`}
                    onClick={() => handleDotFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentResolution === 'CARDS' && (
            <div className="card-examples-section">
              <h5>DoT Card Formula Examples</h5>
              <div className="examples-grid">
                {getDotFormulaExamples('CARDS').map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${damageConfig.dotConfig?.dotFormula === example.formula ? 'active' : ''}`}
                    onClick={() => handleDotFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentResolution === 'COINS' && (
            <div className="coin-examples-section">
              <h5>DoT Coin Formula Examples</h5>
              <div className="examples-grid">
                {getDotFormulaExamples('COINS').map((example, index) => (
                  <button
                    key={index}
                    className={`example-card ${damageConfig.dotConfig?.dotFormula === example.formula ? 'active' : ''}`}
                    onClick={() => handleDotFormulaChange(example.formula)}
                  >
                    <div className="example-title">{example.name}</div>
                    <div className="example-desc">{example.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progressive DoT Configuration */}
          <div className="progressive-buff-config">
            <h4>Progressive DoT Configuration</h4>
            <p className="stage-description">Configure custom formulas for each turn of damage over time</p>
            <div className="config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`pf-button ${damageConfig.dotConfig?.isProgressiveDot ? 'active' : ''}`}
                    onClick={() => {
                      const newValue = !damageConfig.dotConfig?.isProgressiveDot;
                      const newDotConfig = {
                        ...damageConfig.dotConfig,
                        isProgressiveDot: newValue,
                        scalingType: newValue ? 'progressive' : 'flat'
                      };

                      // Initialize progressiveStages array when enabling progressive effect
                      if (newValue && (!damageConfig.dotConfig?.progressiveStages || damageConfig.dotConfig.progressiveStages.length === 0)) {
                        const duration = damageConfig.dotConfig?.duration || 3;

                        // Get appropriate base formula based on resolution method
                        let baseFormula;
                        if (currentResolution === 'CARDS') {
                          baseFormula = damageConfig.dotConfig?.dotFormula || 'cards * 2 + INT/2';
                        } else if (currentResolution === 'COINS') {
                          baseFormula = damageConfig.dotConfig?.dotFormula || 'heads * 3 + INT/2';
                        } else {
                          baseFormula = damageConfig.dotConfig?.dotFormula || '1d4 + INT/2';
                        }

                        // Create stages for each turn of the duration
                        const stages = [];
                        for (let i = 1; i <= duration; i++) {
                          stages.push({
                            turn: i,
                            formula: baseFormula,
                            spellEffect: null
                          });
                        }
                        newDotConfig.progressiveStages = stages;
                      }

                      handleDamageConfigChange('dotConfig', newDotConfig);
                    }}
                  >
                    <div className="toggle-icon">
                      {damageConfig.dotConfig?.isProgressiveDot ? '✓' : ''}
                    </div>
                    <span>Enable Progressive DoT</span>
                  </button>
                </div>
              </div>
            </div>

            {damageConfig.dotConfig?.isProgressiveDot && (
              <div className="progressive-stages">
                <h4>DoT Stages</h4>
                <div className="stage-list">
                  {(damageConfig.dotConfig?.progressiveStages || []).map((stage, index) => {
                    const tickFrequency = damageConfig.dotConfig?.tickFrequency || 'round';
                    const unitLabel = tickFrequency === 'round' ? 'Round' :
                                     tickFrequency === 'turn' ? 'Turn' :
                                     tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

                    return (
                      <div key={index} className="stage-item">
                        <div className="stage-header">
                          <h5 className="stage-title">{unitLabel} {stage.turn || index + 1}</h5>
                        <button
                          className="stage-action remove-stage"
                          onClick={() => {
                            const progressiveStages = damageConfig.dotConfig?.progressiveStages || [];
                            const newStages = progressiveStages.filter((_, i) => i !== index);
                            // Update turn numbers for remaining stages
                            const updatedStages = newStages.map((s, i) => ({ ...s, turn: i + 1 }));
                            handleDamageConfigChange('dotConfig', {
                              ...damageConfig.dotConfig,
                              progressiveStages: updatedStages
                            });
                          }}
                          title="Remove Turn"
                        >
                          ×
                        </button>
                      </div>

                      <div className="stage-content">
                        <div className="stage-field">
                          <label className="field-label">Formula:</label>
                          <input
                            type="text"
                            className="pf-input"
                            value={stage.formula}
                            onChange={(e) => {
                              const progressiveStages = [...(damageConfig.dotConfig?.progressiveStages || [])];
                              progressiveStages[index] = {
                                ...progressiveStages[index],
                                formula: e.target.value
                              };
                              handleDamageConfigChange('dotConfig', {
                                ...damageConfig.dotConfig,
                                progressiveStages
                              });
                            }}
                            placeholder="e.g., 1d4 + INT/2"
                          />
                        </div>

                        <div className="stage-field">
                          <label className="field-label">Special Effect (Optional):</label>
                          <select
                            className="pf-input"
                            value={stage.spellEffect || ''}
                            onChange={(e) => {
                              const progressiveStages = [...(damageConfig.dotConfig?.progressiveStages || [])];
                              progressiveStages[index] = {
                                ...progressiveStages[index],
                                spellEffect: e.target.value || null
                              };
                              handleDamageConfigChange('dotConfig', {
                                ...damageConfig.dotConfig,
                                progressiveStages
                              });
                            }}
                          >
                            <option value="">No special effect</option>
                            <option value="knockback">Knockback</option>
                            <option value="stun">Stun</option>
                            <option value="slow">Slow</option>
                            <option value="blind">Blind</option>
                            <option value="poison">Poison</option>
                            <option value="burn">Burn</option>
                            <option value="freeze">Freeze</option>
                            <option value="shock">Shock</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    );
                  })}

                  <button
                    className="pf-button add-stage-btn"
                    onClick={() => {
                      const progressiveStages = damageConfig.dotConfig?.progressiveStages || [];

                      // Get appropriate base formula based on resolution method
                      let baseFormula;
                      if (currentResolution === 'CARDS') {
                        baseFormula = damageConfig.dotConfig?.dotFormula || 'cards * 2 + INT/2';
                      } else if (currentResolution === 'COINS') {
                        baseFormula = damageConfig.dotConfig?.dotFormula || 'heads * 3 + INT/2';
                      } else {
                        baseFormula = damageConfig.dotConfig?.dotFormula || '1d4 + INT/2';
                      }

                      const newStage = {
                        turn: progressiveStages.length + 1,
                        formula: baseFormula,
                        spellEffect: null
                      };
                      handleDamageConfigChange('dotConfig', {
                        ...damageConfig.dotConfig,
                        progressiveStages: [...progressiveStages, newStage]
                      });
                    }}
                  >
                    + Add Turn
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Mechanics Configuration Buttons */}
      <div className="mechanics-buttons-section section">
        <h3>Spell Mechanics</h3>
        <p>Configure advanced spell mechanics like critical hits, saving throws, and chance-on-hit effects.</p>

        <div className="mechanics-buttons-grid">
          <button
            className={`mechanics-config-button ${damageConfig.criticalConfig?.enabled ? 'active' : ''}`}
            onClick={() => setShowCriticalHitPopup(true)}
          >
            <FaCog className="mechanics-button-icon" />
            <div className="mechanics-button-content">
              <h4>Critical Hit</h4>
              <p>{damageConfig.criticalConfig?.enabled ? 'Configured' : 'Configure critical hit mechanics'}</p>
            </div>
          </button>

          <button
            className={`mechanics-config-button ${damageConfig.savingThrowConfig?.enabled || damageConfig.savingThrow ? 'active' : ''}`}
            onClick={() => setShowSavingThrowPopup(true)}
          >
            <FaCog className="mechanics-button-icon" />
            <div className="mechanics-button-content">
              <h4>Saving Throw</h4>
              <p>{damageConfig.savingThrowConfig?.enabled || damageConfig.savingThrow ? 'Configured' : 'Configure saving throw mechanics'}</p>
            </div>
          </button>

          <button
            className={`mechanics-config-button ${damageConfig.chanceOnHitConfig?.enabled ? 'active' : ''}`}
            onClick={() => setShowChanceOnHitPopup(true)}
          >
            <FaCog className="mechanics-button-icon" />
            <div className="mechanics-button-content">
              <h4>Chance on Hit</h4>
              <p>{damageConfig.chanceOnHitConfig?.enabled ? 'Configured' : 'Configure chance-on-hit effects'}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Math Help Modal */}
      <MathHelpModal
        show={showMathHelp}
        onHide={() => setShowMathHelp(false)}
      />

      {/* Mechanics Configuration Popups */}
      <MechanicsPopup
        show={showCriticalHitPopup}
        onHide={() => setShowCriticalHitPopup(false)}
        title="Critical Hit Configuration"
        size="large"
      >
        <CriticalHitConfig
          config={damageConfig.criticalConfig}
          onConfigChange={(critConfig) => {
            const newConfig = {
              ...damageConfig,
              criticalConfig: critConfig,
              canCrit: critConfig.enabled,
              critMultiplier: critConfig.critMultiplier
            };
            setDamageConfig(newConfig);
            dispatch(actionCreators.updateDamageConfig(newConfig));
          }}
        />
      </MechanicsPopup>

      <MechanicsPopup
        show={showSavingThrowPopup}
        onHide={() => setShowSavingThrowPopup(false)}
        title="Saving Throw Configuration"
        size="large"
      >
        <SavingThrowConfig
          config={damageConfig.savingThrowConfig || {
            enabled: damageConfig.savingThrow !== null && damageConfig.savingThrow !== undefined,
            savingThrowType: damageConfig.savingThrow || 'agility',
            difficultyClass: damageConfig.difficultyClass || 15,
            partialEffect: damageConfig.partialEffect || false,
            partialEffectFormula: damageConfig.partialEffectFormula,
            damageFormula: damageConfig.formula || '',
            dotFormula: damageConfig.dotConfig?.dotFormula || '',
            damageType: damageConfig.damageType || 'direct',
            hasDotEffect: damageConfig.hasDotEffect || false
          }}
          onConfigChange={(saveConfig) => {
            console.log('DamageEffects onConfigChange received:', saveConfig);
            const newConfig = { ...damageConfig };

            // Store the complete saving throw configuration
            newConfig.savingThrowConfig = saveConfig;

            // Also maintain backward compatibility with old structure
            if (saveConfig.enabled) {
              newConfig.savingThrow = saveConfig.savingThrowType;
              newConfig.difficultyClass = saveConfig.difficultyClass;
              newConfig.partialEffect = saveConfig.partialEffect;
              newConfig.partialEffectFormula = saveConfig.partialEffectFormula;
            } else {
              newConfig.savingThrow = null;
              newConfig.partialEffect = false;
              newConfig.savingThrowConfig = null;
            }
            console.log('DamageEffects setting new config:', newConfig);
            setDamageConfig(newConfig);
            dispatch(actionCreators.updateDamageConfig(newConfig));
          }}
        />
      </MechanicsPopup>

      <MechanicsPopup
        show={showChanceOnHitPopup}
        onHide={() => setShowChanceOnHitPopup(false)}
        title="Chance on Hit Configuration"
        size="large"
      >
        <ChanceOnHitConfig
          config={damageConfig.chanceOnHitConfig}
          onConfigChange={(procConfig) => {
            handleDamageConfigChange('chanceOnHitConfig', procConfig);
          }}
        />
      </MechanicsPopup>

    </div>
  );
};

export default DamageEffects;
