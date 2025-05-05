import React, { lazy, Suspense, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import WowWindow from './WowWindow';
import useSpellbookStore from '../../store/spellbookStore';
import { LIBRARY_SPELLS } from '../../data/spellLibraryData';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../spellcrafting-wizard/context/SpellLibraryContext';
import CollectionContextMenu from '../spellcrafting-wizard/components/library/CollectionContextMenu';
import CollectionViewWindow from '../spellcrafting-wizard/components/library/CollectionViewWindow';
import LibraryStyleSpellCard from '../spellcrafting-wizard/components/common/LibraryStyleSpellCard';

// Import styles
import '../spellcrafting-wizard/styles/SpellWizard.css';
import '../spellcrafting-wizard/styles/SpellLibrary.css';
import '../spellcrafting-wizard/styles/SpellLibraryFilters.css';
import '../spellcrafting-wizard/styles/SpellCardResources.css';
import '../spellcrafting-wizard/styles/ConsolidatedSpellCard.css';
import '../spellcrafting-wizard/styles/Step10Review.css';
import '../spellcrafting-wizard/styles/LibraryStyleRollableTable.css';
import '../spellcrafting-wizard/styles/buff-config-review.css';
import '../spellcrafting-wizard/styles/trigger-display-review.css';
import '../../styles/wow-classic.css';
import '../../styles/spell-library-cards.css';
import '../../styles/dropdown-fix.css';

// Define simple icon components instead of using react-icons/fa
const SearchIcon = () => <span style={{ fontSize: '12px' }}>🔍</span>;
const FilterIcon = () => <span style={{ fontSize: '12px' }}>🔣</span>;
const BookIcon = () => <span style={{ fontSize: '12px' }}>📚</span>;
const MagicIcon = () => <span style={{ fontSize: '12px' }}>✨</span>;
const BoltIcon = () => <span style={{ fontSize: '12px' }}>⚡</span>;
const PlusIcon = () => <span style={{ fontSize: '12px' }}>➕</span>;

// Lazy load SpellWizard to avoid circular dependencies
const SpellWizard = lazy(() => import('../spellcrafting-wizard/SpellWizardWrapper'));

// Using the imported SpellCard component from '../spellcrafting-wizard/components/library/SpellCard'




// Enhanced WoW-style Spell Card Component that matches the review step style
const SpellCardWrapper = ({ spell, onClick }) => {
  // Format damage or healing values
  const formatDamageOrHealing = (data) => {
    // Special handling for card-based spells
    if (spell.resolution === 'CARDS' && spell.cardConfig) {
      return spell.cardConfig.formula || `Draw ${spell.cardConfig.drawCount || 3} cards`;
    }

    // Special handling for coin-based spells
    if (spell.resolution === 'COINS' && spell.coinConfig) {
      return spell.coinConfig.formula || `Flip ${spell.coinConfig.flipCount || 5} coins`;
    }

    // Handle different data formats
    if (!data) {
      if (spell.resolution === 'CARDS') {
        return spell.cardConfig?.formula || 'Card-based';
      } else if (spell.resolution === 'COINS') {
        return spell.coinConfig?.formula || 'Coin-based';
      } else {
        return 'Variable';
      }
    }

    if (data.dice && data.dice !== 'N/A') {
      return `${data.dice}${data.flat > 0 ? ` + ${data.flat}` : ''}`;
    } else if (data.flat || data.flat === 0) {
      return `${data.flat}`;
    } else if (typeof data === 'string') {
      return data;
    } else if (data.formula) {
      return data.formula;
    }

    return 'Variable';
  };

  // Get rarity class for border coloring based on spell complexity
  const getRarityClass = () => {
    // Instead of level, use the number of effects or complexity
    const effectCount = [
      spell.primaryDamage ? 1 : 0,
      spell.healing ? 1 : 0,
      spell.debuffConfig ? 1 : 0,
      spell.buffConfig ? 1 : 0,
      spell.negativeEffects?.length > 0 ? 1 : 0,
      spell.utilityEffects?.length > 0 ? 1 : 0,
      spell.controlEffects?.length > 0 ? 1 : 0,
      spell.summoningConfig?.summonType ? 1 : 0,
      spell.transformationConfig?.transformType ? 1 : 0,
      spell.mechanicsConfig?.procs?.length > 0 ? 1 : 0,
      spell.mechanicsConfig?.forms?.length > 0 ? 1 : 0,
      spell.mechanicsConfig?.combos?.length > 0 ? 1 : 0,
      spell.mechanicsConfig?.stateRequirements?.length > 0 ? 1 : 0,
      spell.criticalConfig?.enabled ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    if (effectCount >= 6) return 'legendary';
    if (effectCount >= 4) return 'epic';
    if (effectCount >= 2) return 'rare';
    if (effectCount >= 1) return 'uncommon';
    return 'common';
  };

  // Get border color based on rarity
  const getBorderColor = () => {
    const rarity = getRarityClass();
    switch (rarity) {
      case 'legendary': return '#ff8000'; // Orange
      case 'epic': return '#a335ee';      // Purple
      case 'rare': return '#0070dd';       // Blue
      case 'uncommon': return '#1eff00';   // Green
      default: return '#9d9d9d';           // Gray
    }
  };

  // Get spell school color
  const getSpellSchoolColor = () => {
    // Special handling for specific spells
    if (spell.name === 'Arcane Gambit') {
      return 'spell-arcane';
    } else if (spell.name === 'Fortune Frost') {
      return 'spell-frost';
    }

    // Try to determine color from damage types
    if (spell.damageTypes && spell.damageTypes.length > 0) {
      const primaryDamageType = spell.damageTypes[0].toLowerCase();
      switch (primaryDamageType) {
        case 'fire': return 'spell-fire';
        case 'cold': case 'frost': return 'spell-frost';
        case 'arcane': case 'force': return 'spell-arcane';
        case 'acid': case 'poison': case 'nature': return 'spell-nature';
        case 'necrotic': case 'shadow': return 'spell-shadow';
        case 'radiant': case 'holy': return 'spell-holy';
        case 'lightning': case 'thunder': return 'spell-lightning';
        case 'slashing': case 'piercing': case 'bludgeoning': return 'spell-physical';
        default: return '';
      }
    }

    // Try to determine from spell name if no damage types
    const spellNameLower = spell.name ? spell.name.toLowerCase() : '';
    if (spellNameLower.includes('fire') || spellNameLower.includes('flame') || spellNameLower.includes('burn')) {
      return 'spell-fire';
    } else if (spellNameLower.includes('frost') || spellNameLower.includes('ice') || spellNameLower.includes('cold')) {
      return 'spell-frost';
    } else if (spellNameLower.includes('arcane') || spellNameLower.includes('magic') || spellNameLower.includes('gambit')) {
      return 'spell-arcane';
    } else if (spellNameLower.includes('nature') || spellNameLower.includes('poison') || spellNameLower.includes('acid')) {
      return 'spell-nature';
    } else if (spellNameLower.includes('shadow') || spellNameLower.includes('dark') || spellNameLower.includes('necrotic')) {
      return 'spell-shadow';
    } else if (spellNameLower.includes('holy') || spellNameLower.includes('light') || spellNameLower.includes('radiant')) {
      return 'spell-holy';
    } else if (spellNameLower.includes('lightning') || spellNameLower.includes('thunder') || spellNameLower.includes('storm')) {
      return 'spell-lightning';
    }

    // Default to physical or no color
    return spell.primaryDamage ? 'spell-physical' : '';
  };

  // Format casting time
  const formatCastingTime = () => {
    if (spell.actionType === 'channeled') return 'Channeled';
    if (spell.spellType === 'reaction') return 'Reaction';
    if (spell.spellType === 'ritual') return 'Ritual';
    if (spell.spellType === 'passive') return 'Passive';
    return 'Instant';
  };

  // Format range
  const formatRange = () => {
    if (spell.targetingMode === 'self') return 'Self';
    if (spell.targetingMode === 'aoe') {
      return `${spell.aoeShape || 'Area'} (${spell.aoeSize || 20} ft)`;
    }
    if (spell.range) return `${spell.range} ft`;
    return 'Touch';
  };

  // Format duration
  const formatDuration = () => {
    if (spell.durationType === 'instant') return 'Instant';

    if (spell.durationType === 'permanent') {
      const dispellable = spell.canBeDispelled ? ' (Dispellable)' : '';
      return `Permanent${dispellable}`;
    }

    if (spell.durationType === 'turns') {
      return `${spell.durationValue || 3} ${spell.durationValue === 1 ? 'Turn/Round' : 'Turns/Rounds'}`;
    }

    if (spell.durationType === 'time') {
      return `${spell.durationValue || 1} ${spell.durationUnit || 'minutes'}`;
    }

    if (spell.durationType === 'rest') {
      return `Until ${spell.restType === 'short' ? 'Short' : 'Long'} Rest`;
    }

    if (spell.actionType === 'channeled') {
      return `Up to ${spell.channelMaxRounds || 5} rounds`;
    }

    // Legacy format for backward compatibility
    if (spell.durationType && spell.durationValue) {
      return `${spell.durationValue} ${spell.durationType}`;
    }

    return 'Instant';
  };

  // Get resolution icon
  const getResolutionIcon = () => {
    if (spell.resolution === 'DICE' || (spell.tags && spell.tags.includes('dice-based'))) {
      return '🎲';
    } else if (spell.resolution === 'CARDS' || (spell.tags && spell.tags.includes('card-based'))) {
      return '🃏';
    } else if (spell.resolution === 'COINS' || (spell.tags && spell.tags.includes('coin-based'))) {
      return '🪙';
    }
    return null;
  };

  // Get resolution text
  const getResolutionText = () => {
    if (spell.resolution === 'DICE') {
      if (spell.diceConfig?.formula) return spell.diceConfig.formula;
      if (spell.primaryDamage?.dice) return spell.primaryDamage.dice;
      return 'Dice';
    } else if (spell.resolution === 'CARDS') {
      if (spell.cardConfig?.drawCount) return `Draw ${spell.cardConfig.drawCount}`;
      if (spell.cardConfig?.formula) return spell.cardConfig.formula;
      return 'Cards';
    } else if (spell.resolution === 'COINS') {
      if (spell.coinConfig?.flipCount) return `Flip ${spell.coinConfig.flipCount}`;
      if (spell.coinConfig?.formula) return spell.coinConfig.formula;
      return 'Coins';
    }
    return null;
  };

  // Get critical hit details
  const getCriticalHitDetails = () => {
    if (!spell.criticalConfig || !spell.criticalConfig.enabled) return null;

    // Check if using rollable table
    if (spell.criticalConfig.useRollableTable) {
      // Get the rollable table name from the spell
      const tableName = spell.rollableTable?.name || 'Random Effects Table';

      // Get the appropriate verb based on resolution type
      let actionVerb = 'Roll on';
      if (spell.criticalConfig.critType === 'cards' || spell.resolution === 'CARDS') {
        actionVerb = 'Draw on';
      } else if (spell.criticalConfig.critType === 'coins' || spell.resolution === 'COINS') {
        actionVerb = 'Flip on';
      }

      return spell.criticalConfig.critOnlyEffect
        ? `EFFECT-ONLY: ${actionVerb} ${tableName}`
        : `ON CRITICAL: ${actionVerb} ${tableName}`;
    }

    // Check if effect-only critical hit
    if (spell.criticalConfig.critOnlyEffect) {
      return 'EFFECT-ONLY CRITICAL';
    }

    let details = [];

    if (spell.criticalConfig.critType === 'dice' || spell.resolution === 'DICE') {
      if (spell.criticalConfig.critMultiplier) {
        details.push(`×${spell.criticalConfig.critMultiplier}`);
      }
      if (spell.criticalConfig.explodingDice) {
        details.push('Exploding');
      }
      if (spell.criticalConfig.rerollOnes) {
        details.push('Reroll 1s');
      }
    } else if (spell.criticalConfig.critType === 'cards' || spell.resolution === 'CARDS') {
      if (spell.criticalConfig.cardCritRule) {
        details.push(spell.criticalConfig.cardCritRule.replace(/_/g, ' '));
      }
      if (spell.criticalConfig.extraCardDraw) {
        details.push(`+${spell.criticalConfig.extraCardDraw} cards`);
      }
    } else if (spell.criticalConfig.critType === 'coins' || spell.resolution === 'COINS') {
      if (spell.criticalConfig.coinCritRule) {
        details.push(spell.criticalConfig.coinCritRule.replace(/_/g, ' '));
      }
      if (spell.criticalConfig.extraCoinFlips) {
        details.push(`+${spell.criticalConfig.extraCoinFlips} flips`);
      }
    }

    return details.length > 0 ? details.join(', ') : 'Critical';
  };

  return (
    <div
      className={`wow-spell-card ${getRarityClass()} ${getSpellSchoolColor()}`}
      onClick={() => onClick(spell.id)}
      style={{
        position: 'relative',
        backgroundColor: '#0a0a0a',
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        color: '#fff',
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), 0 0 10px ${getBorderColor()}40`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer'
      }}
    >
      {/* Card gloss effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Card header with icon and name */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
          borderBottom: '1px solid #1e3a8a'
        }}>
          {/* Spell icon */}
          <div style={{ position: 'relative', marginRight: '12px' }}>
            <div style={{
              border: '2px solid #4a4a4a',
              borderRadius: '6px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
              width: '48px',
              height: '48px',
              overflow: 'hidden'
            }}>
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon || 'inv_misc_questionmark'}.jpg`}
                alt={spell.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Resource cost display */}
            {spell.resourceCost && (
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                right: '-5px',
                backgroundColor: '#1e3a8a',
                color: '#38bdf8',
                borderRadius: '3px',
                padding: '1px 5px',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '1px solid #38bdf8',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }}>
                {spell.resourceCost.mana > 0 && <span style={{ color: '#38bdf8' }}>{spell.resourceCost.mana} Mana</span>}
                {spell.resourceCost.health > 0 && <span style={{ color: '#ef4444' }}>{spell.resourceCost.health} Health</span>}
                {spell.resourceCost.stamina > 0 && <span style={{ color: '#facc15' }}>{spell.resourceCost.stamina} Stamina</span>}
                {spell.resourceCost.focus > 0 && <span style={{ color: '#a855f7' }}>{spell.resourceCost.focus} Focus</span>}
                {!spell.resourceCost.mana && !spell.resourceCost.health && !spell.resourceCost.stamina && !spell.resourceCost.focus &&
                  <span style={{ color: '#aaa' }}>No Cost</span>}
              </div>
            )}
          </div>

          {/* Spell name and meta */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{
                color: '#ffd100',
                fontFamily: 'Cinzel, serif',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 2px 0',
                textShadow: '1px 1px 2px #000',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1
              }}>
                {spell.name}
              </h3>

              {/* Spell type badge */}
              <div style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '3px',
                padding: '1px 4px',
                fontSize: '9px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginLeft: '5px'
              }}>
                {spell.spellType || 'ACTION'}
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: '11px', color: '#aaa' }}>
              <span style={{ marginRight: '10px' }}>{formatCastingTime()}</span>
              <span>{formatRange()}</span>
            </div>
          </div>
        </div>

        {/* Tags display at the top */}
        {spell.tags && spell.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            padding: '6px 10px',
            borderBottom: '1px solid #334155',
            backgroundColor: 'rgba(15, 23, 42, 0.7)'
          }}>
            {spell.tags.map((tag, index) => (
              <span key={index} style={{
                backgroundColor: 'rgba(30, 58, 138, 0.3)',
                border: '1px solid #3b82f6',
                borderRadius: '3px',
                color: '#fff',
                padding: '1px 6px',
                fontSize: '10px'
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Card body with description and stats */}
        <div style={{
          padding: '10px',
          backgroundColor: '#0f172a',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Spell description */}
          <p style={{
            color: '#ccc',
            fontSize: '12px',
            marginBottom: '10px',
            lineHeight: '1.4',
            borderBottom: '1px solid #334155',
            paddingBottom: '8px'
          }}>
            {spell.description || 'No description available.'}
          </p>

          {/* Spell stats */}
          <div style={{ flex: 1, marginTop: '10px' }}>
            {/* Damage display */}
            {(spell.effectType === 'damage' || spell.primaryDamage || spell.damageConfig || (spell.resolution === 'CARDS' && spell.tags?.includes('damage')) || (spell.resolution === 'COINS' && spell.tags?.includes('damage'))) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>
                  Direct <span style={{
                    color: spell.damageConfig?.elementType ?
                      (spell.damageConfig.elementType === 'fire' ? '#ef4444' :
                       spell.damageConfig.elementType === 'frost' || spell.damageConfig.elementType === 'cold' ? '#38bdf8' :
                       spell.damageConfig.elementType === 'arcane' ? '#a855f7' :
                       spell.damageConfig.elementType === 'nature' ? '#22c55e' :
                       spell.damageConfig.elementType === 'shadow' ? '#6b21a8' :
                       spell.damageConfig.elementType === 'holy' ? '#f59e0b' :
                       spell.damageConfig.elementType === 'lightning' ? '#facc15' : '#9ca3af') :
                    '#9ca3af'
                  }}>
                    {spell.damageConfig?.elementType || (spell.damageTypes && spell.damageTypes.length > 0 ? spell.damageTypes[0] : 'Physical')}
                  </span> Damage:
                </span>
                <span style={{ color: '#ff4d4d' }}>
                  {spell.damageConfig?.formula || formatDamageOrHealing(spell.primaryDamage)}
                </span>
              </div>
            )}

            {/* Healing display */}
            {(spell.effectType === 'healing' || spell.healing || spell.healingConfig || (spell.resolution === 'CARDS' && spell.tags?.includes('healing')) || (spell.resolution === 'COINS' && spell.tags?.includes('healing'))) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>
                  Direct <span style={{ color: '#f59e0b' }}>Holy (Healing)</span>:
                </span>
                <span style={{ color: '#4dff4d' }}>
                  {spell.healingConfig?.formula || formatDamageOrHealing(spell.healing)}
                </span>
              </div>
            )}

            {/* Damage over time display */}
            {spell.damageConfig?.dotConfig?.enabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>
                  DoT <span style={{
                    color: spell.damageConfig.elementType ?
                      (spell.damageConfig.elementType === 'fire' ? '#ef4444' :
                       spell.damageConfig.elementType === 'frost' || spell.damageConfig.elementType === 'cold' ? '#38bdf8' :
                       spell.damageConfig.elementType === 'arcane' ? '#a855f7' :
                       spell.damageConfig.elementType === 'nature' ? '#22c55e' :
                       spell.damageConfig.elementType === 'shadow' ? '#6b21a8' :
                       spell.damageConfig.elementType === 'holy' ? '#f59e0b' :
                       spell.damageConfig.elementType === 'lightning' ? '#facc15' : '#9ca3af') :
                    '#9ca3af'
                  }}>
                    {spell.damageConfig.elementType || 'Physical'}
                  </span>:
                </span>
                <span style={{ color: '#ff4d4d' }}>
                  {spell.damageConfig.dotConfig.tickFormula} per {
                    spell.damageConfig.dotConfig.tickFrequency === 'start' ? 'round' : 'turn'
                  } for {spell.damageConfig.dotConfig.duration} {
                    spell.damageConfig.dotConfig.durationType
                  }
                </span>
              </div>
            )}

            {/* Healing over time display */}
            {spell.healingConfig?.hotConfig?.enabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>
                  HoT <span style={{ color: '#f59e0b' }}>Holy (Healing)</span>:
                </span>
                <span style={{ color: '#4dff4d' }}>
                  {spell.healingConfig.hotConfig.tickFormula} per {
                    spell.healingConfig.hotConfig.tickFrequency === 'start' ? 'round' : 'turn'
                  } for {spell.healingConfig.hotConfig.duration} {
                    spell.healingConfig.hotConfig.durationType
                  }
                </span>
              </div>
            )}

            {/* Targeting information */}
            {spell.targetingConfig && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Targeting:</span>
                <span style={{ color: '#38bdf8' }}>
                  {spell.targetingConfig.targetingType === 'single' && 'Single Target'}
                  {spell.targetingConfig.targetingType === 'aoe' && `${spell.targetingConfig.aoeType} (${spell.targetingConfig.aoeSize}ft)`}
                  {spell.targetingConfig.range && ` - Range: ${spell.targetingConfig.range}ft`}
                </span>
              </div>
            )}

            {/* Resolution method display */}
            {getResolutionIcon() && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Resolution:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px' }}>{getResolutionIcon()}</span>
                  <span style={{ color: '#ffcc00' }}>{getResolutionText()}</span>
                </span>
              </div>
            )}

            {/* Status effects display */}
            {spell.negativeEffects && spell.negativeEffects.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Effects:</span>
                <span style={{ color: '#cc99ff' }}>
                  {spell.negativeEffects.map(effect => effect.replace ? effect.replace(/_/g, ' ') : effect).join(', ')}
                </span>
              </div>
            )}

            {/* Critical hit display */}
            {spell.damageConfig?.criticalConfig?.enabled && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
                fontSize: '12px',
                padding: '4px 6px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '4px'
              }}>
                <span style={{ color: '#ff4d4d', fontWeight: 500 }}>On Critical:</span>
                <span style={{ color: '#ff4d4d' }}>
                  {spell.damageConfig.criticalConfig.critType === 'dice' &&
                    `${spell.damageConfig.criticalConfig.critMultiplier}x damage`}
                  {spell.damageConfig.criticalConfig.critEffects &&
                    spell.damageConfig.criticalConfig.critEffects.map(effect => ` + ${effect}`)}
                </span>
              </div>
            )}

            {/* Utility effects display */}
            {spell.utilityEffects && spell.utilityEffects.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Utility:</span>
                <span style={{ color: '#ffcc00' }}>
                  {spell.utilityEffects.map(effect => effect.replace(/_/g, ' ')).join(', ')}
                </span>
              </div>
            )}

            {/* Control effects display */}
            {spell.controlEffects && spell.controlEffects.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Control:</span>
                <span style={{ color: '#ff9933' }}>
                  {spell.controlEffects.map(effect => effect.replace(/_/g, ' ')).join(', ')}
                </span>
              </div>
            )}

            {/* Buff effects display */}
            {spell.buffConfig && spell.buffConfig.statBonuses && spell.buffConfig.statBonuses.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Buffs:</span>
                <span style={{ color: '#4d9eff' }}>
                  {spell.buffConfig.statBonuses.map(bonus =>
                    `${bonus.stat.replace(/_/g, ' ')} ${bonus.value > 0 ? '+' : ''}${bonus.value}${bonus.isPercentage ? '%' : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Debuff effects display */}
            {spell.debuffConfig && spell.debuffConfig.statPenalties && spell.debuffConfig.statPenalties.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Debuffs:</span>
                <span style={{ color: '#cc99ff' }}>
                  {spell.debuffConfig.statPenalties.map(penalty =>
                    `${penalty.stat.replace(/_/g, ' ')} ${penalty.value > 0 ? '+' : ''}${penalty.value}${penalty.isPercentage ? '%' : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Duration display */}
            {spell.durationType && spell.durationType !== 'instant' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Duration:</span>
                <span style={{ color: '#fff' }}>
                  {formatDuration()}
                </span>
              </div>
            )}

            {/* Summoning effects display */}
            {spell.summoningConfig && spell.summoningConfig.summonType && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Summon:</span>
                <span style={{ color: '#a855f7' }}>
                  {spell.summoningConfig.summonName || spell.summoningConfig.summonType}
                  {spell.summoningConfig.summonCount > 1 ? ` (×${spell.summoningConfig.summonCount})` : ''}
                </span>
              </div>
            )}

            {/* Transformation effects display */}
            {spell.transformationConfig && spell.transformationConfig.transformType && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Transform:</span>
                <span style={{ color: '#22c55e' }}>
                  {spell.transformationConfig.transformName || spell.transformationConfig.transformType}
                  {spell.transformationConfig.duration ? ` (${spell.transformationConfig.duration})` : ''}
                </span>
              </div>
            )}

            {/* Proc mechanics display */}
            {spell.mechanicsConfig && spell.mechanicsConfig.procs && spell.mechanicsConfig.procs.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Procs:</span>
                <span style={{ color: '#f59e0b' }}>
                  {spell.mechanicsConfig.procs.map(proc =>
                    `${proc.triggerType || 'On Hit'} ${proc.chance ? `(${proc.chance}%)` : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Form mechanics display */}
            {spell.mechanicsConfig && spell.mechanicsConfig.forms && spell.mechanicsConfig.forms.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Forms:</span>
                <span style={{ color: '#22c55e' }}>
                  {spell.mechanicsConfig.forms.map(form => form.formName || 'Form').join(', ')}
                </span>
              </div>
            )}

            {/* Combo mechanics display */}
            {spell.mechanicsConfig && spell.mechanicsConfig.combos && spell.mechanicsConfig.combos.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Combos:</span>
                <span style={{ color: '#3b82f6' }}>
                  {spell.mechanicsConfig.combos.map(combo =>
                    `${combo.comboType || 'Combo'} ${combo.pointsRequired ? `(${combo.pointsRequired} pts)` : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* State requirements display */}
            {spell.mechanicsConfig && spell.mechanicsConfig.stateRequirements && spell.mechanicsConfig.stateRequirements.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Requires:</span>
                <span style={{ color: '#64748b' }}>
                  {spell.mechanicsConfig.stateRequirements.map(req =>
                    `${req.statType || 'Health'} ${req.comparison || '>'} ${req.threshold || '50'}%`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Multiple thresholds display */}
            {spell.mechanicsConfig && spell.mechanicsConfig.stateOptions && spell.mechanicsConfig.stateOptions.thresholds && spell.mechanicsConfig.stateOptions.thresholds.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Thresholds:</span>
                <span style={{ color: '#3b82f6' }}>
                  {spell.mechanicsConfig.stateOptions.thresholds.map(threshold =>
                    `${threshold.resourceType || 'Health'} ${threshold.thresholdType === 'below' ? '<' :
                      threshold.thresholdType === 'above' ? '>' :
                      '='} ${threshold.value || '50'}${threshold.valueType === 'percentage' ? '%' : ''}`
                  ).join(', ')}
                </span>
              </div>
            )}

            {/* Cooldown display */}
            {spell.cooldown && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', padding: '2px 0' }}>
                <span style={{ color: '#aaa', fontWeight: 500 }}>Cooldown:</span>
                <span style={{ color: '#ff9933' }}>
                  {spell.cooldown}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card footer with cooldown */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          borderTop: '1px solid #333',
          minHeight: '20px'
        }}>
          {/* Spell type */}
          <div style={{ fontSize: '11px', color: '#aaa' }}>
            {spell.spellType || 'ACTION'}
          </div>

          {/* Cooldown display */}
          {spell.cooldownConfig && spell.cooldownConfig.enabled && (
            <div style={{ fontSize: '11px', color: '#ff4d4d', fontWeight: 'bold' }}>
              CD: {spell.cooldownConfig.cooldownRounds} {spell.cooldownConfig.cooldownType}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpellWizardTab = () => {
  // No local state, just render the wizard
  return (
    <Suspense fallback={<div className="loading-wizard">Loading Spell Wizard...</div>}>
      <div style={{ width: '100%', height: '100%', padding: 0, overflow: 'auto' }}>
        <SpellWizard hideHeader={true} />
      </div>
    </Suspense>
  );
};



const SpellbookWindow = ({ isOpen = true, onClose = () => {} }) => {
  const { activeTab, setActiveTab } = useSpellbookStore();
  const [isLoaded, setIsLoaded] = useState(false);

  // Set isLoaded to true after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Small delay for smoother transition

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="loading-wrapper">
          <div className="loading-text">Loading spellbook...</div>
        </div>
      );
    }

    switch (activeTab) {
      case 'wizard':
        return <SpellWizardTab />;
      case 'library':
        return <SpellLibraryTab />;
      case 'collections':
        return <SpellCollectionTab />;
      default:
        return <SpellWizardTab />;
    }
  };

  // Spell Library Tab Component
  const SpellLibraryTab = () => {
    // Get library state and dispatch from context
    const library = useSpellLibrary();
    const dispatch = useSpellLibraryDispatch();

    const [searchQuery, setSearchQuery] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [damageTypeFilter, setDamageTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };

    // Import the transformation functions from the SpellLibrary component
    const { transformSpellForCard, getSpellRollableTable } = require('../spellcrafting-wizard/core/utils/spellCardTransformer');

    // Apply filters to the spells
    const filteredSpells = React.useMemo(() => {
      return LIBRARY_SPELLS.filter(spell => {
        // Search filter
        if (searchQuery && !spell.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !spell.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // School filter
        if (schoolFilter !== 'all') {
          if (schoolFilter === 'damage' && spell.effectType !== 'damage') return false;
          if (schoolFilter === 'healing' && spell.effectType !== 'healing') return false;
          if (schoolFilter === 'buff' && spell.effectType !== 'buff') return false;
          if (schoolFilter === 'debuff' && spell.effectType !== 'debuff') return false;
          if (schoolFilter === 'utility' && spell.effectType !== 'utility') return false;
          if (schoolFilter === 'control' && spell.effectType !== 'control') return false;
          if (schoolFilter === 'summoning' && spell.effectType !== 'summoning') return false;
          if (schoolFilter === 'transformation' && spell.effectType !== 'transformation') return false;
        }

        // Type filter
        if (typeFilter !== 'all' && spell.spellType?.toLowerCase() !== typeFilter.toLowerCase()) {
          return false;
        }

        // Damage type filter
        if (damageTypeFilter !== 'all' &&
            (!spell.damageTypes || !spell.damageTypes.some(type =>
              type.toLowerCase() === damageTypeFilter.toLowerCase()))) {
          return false;
        }

        return true;
      });
    }, [searchQuery, schoolFilter, typeFilter, damageTypeFilter]);

    // Handle selecting a spell
    const handleSelectSpell = (spellId) => {
      console.log('Selected spell:', spellId);

      // Find the spell by ID
      const selectedSpell = filteredSpells.find(spell => spell.id === spellId);

      if (selectedSpell) {
        // Switch to the wizard tab
        setActiveTab('wizard');

        // Load the spell into the wizard
        // This requires accessing the SpellWizard component, which might be challenging
        // We'll use a custom event to communicate with the SpellWizard component
        const loadSpellEvent = new CustomEvent('loadSpellIntoWizard', {
          detail: { spell: selectedSpell, editMode: true }
        });
        window.dispatchEvent(loadSpellEvent);

        console.log('Switching to wizard tab and loading spell:', selectedSpell.name);
      }
    };

    return (
      <div className={`spell-library-container ${sidebarVisible ? '' : 'sidebar-hidden'}`}>
        {/* Header with title and view controls */}
        <header className="spell-library-header">
          <h2 className="spell-library-title">Spell Library</h2>
          <div className="spell-library-controls">
            <div className="view-mode-controls">
              <button
                className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <span className="view-mode-icon">⊞</span>
              </button>
              <button
                className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <span className="view-mode-icon">≡</span>
              </button>
            </div>
          </div>
        </header>

        {/* Filters and content area */}
        <div className="spell-library-content">
          {/* Sidebar toggle button */}
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} title={sidebarVisible ? "Hide Filters" : "Show Filters"}></button>

          {/* Sidebar with filters */}
          <aside className="spell-library-sidebar">
            <div className="filter-section">
              <h3 className="filter-section-header">Search</h3>
              <div className="filter-search">
                <input
                  type="text"
                  placeholder="Search spells..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-search-input"
                />
                <span className="filter-search-icon"><SearchIcon /></span>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-header">Spell Type</h3>
              <div className="filter-options">
                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Spell Types</option>
                  <option value="damage">Damage</option>
                  <option value="healing">Healing</option>
                  <option value="buff">Buff</option>
                  <option value="debuff">Debuff</option>
                  <option value="utility">Utility</option>
                  <option value="control">Control</option>
                  <option value="summoning">Summoning</option>
                  <option value="transformation">Transformation</option>
                </select>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-header">Cast Type</h3>
              <div className="filter-options">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Cast Types</option>
                  <option value="action">Action</option>
                  <option value="reaction">Reaction</option>
                  <option value="passive">Passive</option>
                  <option value="channeled">Channeled</option>
                  <option value="trap">Trap</option>
                </select>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-header">Damage Type</h3>
              <div className="filter-options">
                <select
                  value={damageTypeFilter}
                  onChange={(e) => setDamageTypeFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Damage Types</option>
                  <option value="acid">Acid</option>
                  <option value="bludgeoning">Bludgeoning</option>
                  <option value="cold">Cold</option>
                  <option value="fire">Fire</option>
                  <option value="force">Force</option>
                  <option value="lightning">Lightning</option>
                  <option value="necrotic">Necrotic</option>
                  <option value="piercing">Piercing</option>
                  <option value="poison">Poison</option>
                  <option value="psychic">Psychic</option>
                  <option value="radiant">Radiant</option>
                  <option value="slashing">Slashing</option>
                  <option value="thunder">Thunder</option>
                </select>
              </div>
            </div>

            <div className="filter-section">
              <button
                className="clear-filters-button"
                onClick={() => {
                  setSearchQuery('');
                  setSchoolFilter('all');
                  setTypeFilter('all');
                  setDamageTypeFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Main content area with spell cards */}
          <main className={`spell-library-spells ${viewMode}-view`}>
            {filteredSpells.length === 0 ? (
              <div className="spell-library-no-results">
                <p>No spells match your current filters.</p>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setSearchQuery('');
                    setSchoolFilter('all');
                    setTypeFilter('all');
                    setDamageTypeFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="spell-count-info">
                  Showing {filteredSpells.length} of {LIBRARY_SPELLS.length} spells
                </div>

                <div className="spell-cards-container" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '1rem',
                  padding: '0.5rem'
                }}>
                  {filteredSpells.map(spell => {
                    // Transform the spell data to match the format expected by LibraryStyleSpellCard
                    // This is the same transformation used in the review step
                    const transformedSpell = transformSpellForCard(spell);

                    // Get the rollable table data from the spell
                    const rollableTableData = getSpellRollableTable(spell);

                    // Ensure resource costs are properly formatted
                    if (!transformedSpell.resourceCost) {
                      transformedSpell.resourceCost = {
                        mana: 0,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        resourceValues: {}
                      };
                    }

                    // Ensure damage/healing configuration is properly formatted
                    if (transformedSpell.effectType === 'damage' && !transformedSpell.damageConfig) {
                      transformedSpell.damageConfig = {
                        damageType: 'direct',
                        elementType: transformedSpell.damageTypes?.[0] || 'fire',
                        formula: transformedSpell.primaryDamage?.dice || '6d6'
                      };
                    }

                    if (transformedSpell.effectType === 'healing' && !transformedSpell.healingConfig) {
                      transformedSpell.healingConfig = {
                        healingType: 'direct',
                        formula: transformedSpell.healing?.dice || '6d6'
                      };
                    }

                    // Ensure cooldown configuration is properly formatted
                    if (!transformedSpell.cooldownConfig) {
                      transformedSpell.cooldownConfig = {
                        enabled: false,
                        cooldownRounds: 0,
                        cooldownType: 'rounds'
                      };
                    }

                    console.log('Rendering spell card for:', transformedSpell.name);

                    return (
                      <div
                        key={spell.id}
                        className={`spell-card-wrapper`}
                        onClick={() => handleSelectSpell(spell.id)}
                      >
                        <div className="review-spell-preview">
                          <LibraryStyleSpellCard
                            spell={transformedSpell}
                            rollableTableData={rollableTableData}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    );
  };

  // Spell Collection Tab Component
  const SpellCollectionTab = () => {
    // Get the library context
    const library = useSpellLibrary();
    const dispatch = useSpellLibraryDispatch();

    // Function to clean up duplicate spells in collections
    const cleanupDuplicateSpells = () => {
      // For each spell, ensure it has no duplicate category IDs
      library.spells.forEach(spell => {
        if (spell.categoryIds) {
          // Get unique category IDs
          const uniqueCategoryIds = [...new Set(spell.categoryIds)];

          // If there were duplicates, update the spell
          if (uniqueCategoryIds.length !== spell.categoryIds.length) {
            dispatch(libraryActionCreators.categorizeSpell(spell.id, uniqueCategoryIds));
          }
        }
      });
    };

    // Function to validate the library and ensure only the 6 essential categories are used
    const validateLibraryCategories = () => {
      // Get the valid category IDs from the default categories
      const validCategoryIds = ['uncategorized', 'favorites', 'offensive', 'defensive', 'utility', 'healing'];

      // For each spell, filter out any invalid category IDs
      library.spells.forEach(spell => {
        if (spell.categoryIds) {
          const validSpellCategories = spell.categoryIds.filter(catId => validCategoryIds.includes(catId));

          // If the spell has no valid categories, add it to 'uncategorized'
          if (validSpellCategories.length === 0) {
            validSpellCategories.push('uncategorized');
          }

          // Update the spell with the valid categories
          if (JSON.stringify(validSpellCategories) !== JSON.stringify(spell.categoryIds)) {
            dispatch(libraryActionCreators.categorizeSpell(spell.id, validSpellCategories));
          }
        }
      });
    };

    // Function to update collection icons
    const updateCollectionIcons = () => {
      // Define the proper icons for each category
      const categoryIcons = {
        'uncategorized': 'inv_misc_book_09',
        'favorites': 'spell_holy_magicalsentry',
        'offensive': 'spell_fire_flamebolt',
        'defensive': 'spell_holy_powerwordshield',
        'utility': 'spell_nature_polymorph',
        'healing': 'spell_holy_flashheal'
      };

      // Update each category with the proper icon
      library.categories.forEach(category => {
        if (categoryIcons[category.id] && category.icon !== categoryIcons[category.id]) {
          dispatch(libraryActionCreators.updateCategory(category.id, {
            icon: categoryIcons[category.id]
          }));
        }
      });
    };

    // Clean up duplicates and validate categories when the component mounts
    useEffect(() => {
      cleanupDuplicateSpells();
      validateLibraryCategories();
      updateCollectionIcons();
    }, []);

    // Get the count of spells in each collection
    const getSpellCountByCollection = () => {
      const counts = {};

      // Initialize counts for all categories
      library.categories.forEach(category => {
        counts[category.id] = 0;
      });

      // Count spells in each category
      library.spells.forEach(spell => {
        if (spell.categoryIds) {
          spell.categoryIds.forEach(categoryId => {
            if (counts[categoryId] !== undefined) {
              counts[categoryId]++;
            }
          });
        }
      });

      return counts;
    };

    const spellCounts = getSpellCountByCollection();

    // State for context menu
    const [contextMenu, setContextMenu] = useState(null);

    // State for collection view window
    const [viewCollection, setViewCollection] = useState(null);

    // Handle right-click on collection
    const handleContextMenu = (e, collection) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        collection
      });
    };

    // Handle opening a collection
    const handleOpenCollection = (collectionId) => {
      const collection = library.categories.find(c => c.id === collectionId);
      if (collection) {
        setViewCollection(collection);
      }
    };

    // Handle editing a collection
    const handleEditCollection = (collectionId) => {
      console.log('Edit collection:', collectionId);
      // Implement edit functionality
    };

    // Handle deleting a collection
    const handleDeleteCollection = (collectionId) => {
      console.log('Delete collection:', collectionId);
      // Implement delete functionality
    };

    // Handle clicking outside to close context menu
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (contextMenu && !e.target.closest('.spell-context-menu')) {
          setContextMenu(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [contextMenu]);

    return (
      <div style={{ width: '100%', height: '100%', padding: '20px', overflow: 'auto', backgroundColor: '#0f172a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', margin: 0, fontFamily: 'Cinzel, serif', textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)' }}>Spell Collections</h2>
          <button style={{
            background: 'rgba(30, 58, 138, 0.3)',
            border: '1px solid #3b82f6',
            borderRadius: '3px',
            color: '#fff',
            padding: '5px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s ease'
          }}>
            <PlusIcon />
            Create Collection
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          padding: '10px 0'
        }}>
          {library.categories.map(collection => {
            const spellCount = spellCounts[collection.id] || 0;
            return (
              <div
                key={collection.id}
                onClick={() => handleOpenCollection(collection.id)}
                onContextMenu={(e) => handleContextMenu(e, collection)}
                style={{
                  position: 'relative',
                  backgroundColor: '#0a0a0a',
                  border: `2px solid ${collection.color || '#1e3a8a'}`,
                  borderRadius: '6px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  color: '#fff',
                  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), 0 0 10px ${collection.color || '#1e3a8a'}40`,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  cursor: 'pointer'
                }}
              >
                {/* Card gloss effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '30%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0))',
                  pointerEvents: 'none'
                }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Card header with icon and name */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
                    borderBottom: '1px solid #1e3a8a'
                  }}>
                    {/* Collection icon */}
                    <div style={{ position: 'relative', marginRight: '12px' }}>
                      <div style={{
                        border: '2px solid #4a4a4a',
                        borderRadius: '6px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        width: '48px',
                        height: '48px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={`https://wow.zamimg.com/images/wow/icons/large/${collection.icon || 'inv_misc_questionmark'}.jpg`}
                          alt={collection.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                          }}
                        />
                      </div>
                    </div>

                    {/* Collection name and count */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        color: '#ffd100',
                        fontFamily: '"Cinzel", serif',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        margin: '0 0 2px 0',
                        textShadow: '1px 1px 2px #000',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {collection.name.toUpperCase()}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{
                          backgroundColor: collection.color || '#1e3a8a',
                          color: '#fff',
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontWeight: 'bold'
                        }}>
                          {spellCount}
                        </span>
                        <span style={{ fontSize: '11px', color: '#aaa' }}>spells</span>
                      </div>
                    </div>
                  </div>

                  {/* Card body with description */}
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#0f172a',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#ccc',
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}>
                    {collection.description || 'A collection of spells'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Context Menu */}
        {contextMenu && ReactDOM.createPortal(
          <CollectionContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            collection={contextMenu.collection}
            onClose={() => setContextMenu(null)}
            onOpen={handleOpenCollection}
            onEdit={handleEditCollection}
            onDelete={handleDeleteCollection}
          />,
          document.body
        )}

        {/* Collection View Window */}
        {viewCollection && (
          <CollectionViewWindow
            isOpen={!!viewCollection}
            onClose={() => setViewCollection(null)}
            collectionId={viewCollection.id}
          />
        )}
      </div>
    );
  };

  return (
    <WowWindow
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 800, height: 600 }}
      title="Spellbook"
    >
      <div className="spellbook-layout" style={{ width: '100%', height: '100%', padding: 0, overflow: 'auto' }}>
        <div className="spellbook-header" style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.5)',
          borderBottom: '1px solid #444',
          padding: '10px 15px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('wizard')}
              style={{
                background: activeTab === 'wizard' ? 'rgba(0,0,0,0.3)' : 'transparent',
                border: '1px solid #444',
                borderRadius: '3px',
                color: '#fff',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <MagicIcon style={{ marginRight: '5px' }} />
              Spell Wizard
            </button>
            <button
              onClick={() => setActiveTab('library')}
              style={{
                background: activeTab === 'library' ? 'rgba(0,0,0,0.3)' : 'transparent',
                border: '1px solid #444',
                borderRadius: '3px',
                color: '#fff',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <BookIcon style={{ marginRight: '5px' }} />
              Spell Library
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              style={{
                background: activeTab === 'collections' ? 'rgba(0,0,0,0.3)' : 'transparent',
                border: '1px solid #444',
                borderRadius: '3px',
                color: '#fff',
                padding: '5px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <FilterIcon style={{ marginRight: '5px' }} />
              Collections
            </button>
          </div>
        </div>

        <div className="spellbook-main-content" style={{ width: '100%', height: 'calc(100% - 45px)', padding: 0, overflow: 'auto' }}>
          {renderContent()}
        </div>
      </div>
    </WowWindow>
  );
};

export default SpellbookWindow;
