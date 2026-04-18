import React from 'react';
import { getCreatureSizeMapping } from '../../../../store/creatureStore';
import useItemStore from '../../../../store/itemStore';
import '../../../../styles/creature-token.css';
import '../../../../styles/wow-classic-tooltip.css';
import './SimpleCreatureTooltip.css';

// Complete thematic resistance descriptions matching spell wizard format
const getThematicResistanceDescription = (resistanceLevel, damageType) => {
  const thematicDescriptions = {
    vampiric: {
      fire: 'Flame Feast (heals for 200% of fire damage taken)',
      cold: 'Frost Drain (heals for 200% of cold damage taken)',
      lightning: 'Storm Siphon (heals for 200% of lightning damage taken)',
      acid: 'Corrosive Feed (heals for 200% of acid damage taken)',
      poison: 'Toxin Feast (heals for 200% of poison damage taken)',
      necrotic: 'Death Feast (heals for 200% of necrotic damage taken)',
      radiant: 'Light Drain (heals for 200% of radiant damage taken)',
      psychic: 'Mind Feast (heals for 200% of psychic damage taken)',
      thunder: 'Sound Drain (heals for 200% of thunder damage taken)',
      force: 'Energy Feast (heals for 200% of force damage taken)',
      damage: 'Vampiric (heals for 200% of damage taken)'
    },
    absorbing: {
      fire: 'Flame Absorption (heals for 100% of fire damage taken)',
      cold: 'Frost Absorption (heals for 100% of cold damage taken)',
      lightning: 'Storm Absorption (heals for 100% of lightning damage taken)',
      acid: 'Corrosive Absorption (heals for 100% of acid damage taken)',
      poison: 'Toxin Absorption (heals for 100% of poison damage taken)',
      necrotic: 'Death Absorption (heals for 100% of necrotic damage taken)',
      radiant: 'Light Absorption (heals for 100% of radiant damage taken)',
      psychic: 'Mind Absorption (heals for 100% of psychic damage taken)',
      thunder: 'Sound Absorption (heals for 100% of thunder damage taken)',
      force: 'Energy Absorption (heals for 100% of force damage taken)',
      damage: 'Absorbing (heals for 100% of damage taken)'
    },
    draining: {
      fire: 'Flame Draining (heals for 50% of fire damage taken)',
      cold: 'Frost Draining (heals for 50% of cold damage taken)',
      lightning: 'Storm Draining (heals for 50% of lightning damage taken)',
      acid: 'Corrosive Draining (heals for 50% of acid damage taken)',
      poison: 'Toxin Draining (heals for 50% of poison damage taken)',
      necrotic: 'Death Draining (heals for 50% of necrotic damage taken)',
      radiant: 'Light Draining (heals for 50% of radiant damage taken)',
      psychic: 'Mind Draining (heals for 50% of psychic damage taken)',
      thunder: 'Sound Draining (heals for 50% of thunder damage taken)',
      force: 'Energy Draining (heals for 50% of force damage taken)',
      damage: 'Draining (heals for 50% of damage taken)'
    },
    siphoning: {
      fire: 'Flame Siphoning (heals for 25% of fire damage taken)',
      cold: 'Frost Siphoning (heals for 25% of cold damage taken)',
      lightning: 'Storm Siphoning (heals for 25% of lightning damage taken)',
      acid: 'Corrosive Siphoning (heals for 25% of acid damage taken)',
      poison: 'Toxin Siphoning (heals for 25% of poison damage taken)',
      necrotic: 'Death Siphoning (heals for 25% of necrotic damage taken)',
      radiant: 'Light Siphoning (heals for 25% of radiant damage taken)',
      psychic: 'Mind Siphoning (heals for 25% of psychic damage taken)',
      thunder: 'Sound Siphoning (heals for 25% of thunder damage taken)',
      force: 'Energy Siphoning (heals for 25% of force damage taken)',
      damage: 'Siphoning (heals for 25% of damage taken)'
    },
    immune: {
      fire: 'Fire Immunity (immune to fire damage)',
      cold: 'Cold Immunity (immune to cold damage)',
      lightning: 'Lightning Immunity (immune to lightning damage)',
      acid: 'Acid Immunity (immune to acid damage)',
      poison: 'Poison Immunity (immune to poison damage)',
      necrotic: 'Necrotic Immunity (immune to necrotic damage)',
      radiant: 'Radiant Immunity (immune to radiant damage)',
      psychic: 'Psychic Immunity (immune to psychic damage)',
      thunder: 'Thunder Immunity (immune to thunder damage)',
      force: 'Force Immunity (immune to force damage)',
      damage: 'Immunity (immune to damage)'
    },
    highly_resistant: {
      fire: 'Fire Highly Resistant (75% less fire damage)',
      cold: 'Cold Highly Resistant (75% less cold damage)',
      lightning: 'Lightning Highly Resistant (75% less lightning damage)',
      acid: 'Acid Highly Resistant (75% less acid damage)',
      poison: 'Poison Highly Resistant (75% less poison damage)',
      necrotic: 'Necrotic Highly Resistant (75% less necrotic damage)',
      radiant: 'Radiant Highly Resistant (75% less radiant damage)',
      psychic: 'Psychic Highly Resistant (75% less psychic damage)',
      thunder: 'Thunder Highly Resistant (75% less thunder damage)',
      force: 'Force Highly Resistant (75% less force damage)',
      damage: 'Highly Resistant (75% less damage)'
    },
    slight_reduction: {
      fire: 'Fire Resistance (25% less fire damage)',
      cold: 'Cold Resistance (25% less cold damage)',
      lightning: 'Lightning Resistance (25% less lightning damage)',
      acid: 'Acid Resistance (25% less acid damage)',
      poison: 'Poison Resistance (25% less poison damage)',
      necrotic: 'Necrotic Resistance (25% less necrotic damage)',
      radiant: 'Radiant Resistance (25% less radiant damage)',
      psychic: 'Psychic Resistance (25% less psychic damage)',
      thunder: 'Thunder Resistance (25% less thunder damage)',
      force: 'Force Resistance (25% less force damage)',
      damage: 'Slight Resistance (25% less damage)'
    },
    resistant: {
      fire: 'Fire Resistance (50% less fire damage)',
      cold: 'Cold Resistance (50% less cold damage)',
      lightning: 'Lightning Resistance (50% less lightning damage)',
      acid: 'Acid Resistance (50% less acid damage)',
      poison: 'Poison Resistance (50% less poison damage)',
      necrotic: 'Necrotic Resistance (50% less necrotic damage)',
      radiant: 'Radiant Resistance (50% less radiant damage)',
      psychic: 'Psychic Resistance (50% less psychic damage)',
      thunder: 'Thunder Resistance (50% less thunder damage)',
      force: 'Force Resistance (50% less force damage)',
      damage: 'Resistance (50% less damage)'
    },
    guarded: {
      fire: 'Fire Guarded (75% less fire damage)',
      cold: 'Cold Guarded (75% less cold damage)',
      lightning: 'Lightning Guarded (75% less lightning damage)',
      acid: 'Acid Guarded (75% less acid damage)',
      poison: 'Poison Guarded (75% less poison damage)',
      necrotic: 'Necrotic Guarded (75% less necrotic damage)',
      radiant: 'Radiant Guarded (75% less radiant damage)',
      psychic: 'Psychic Guarded (75% less psychic damage)',
      thunder: 'Thunder Guarded (75% less thunder damage)',
      force: 'Force Guarded (75% less force damage)',
      damage: 'Guarded (75% less damage)'
    },
    nullified: {
      fire: 'Fire Nullified (no fire damage)',
      cold: 'Cold Nullified (no cold damage)',
      lightning: 'Lightning Nullified (no lightning damage)',
      acid: 'Acid Nullified (no acid damage)',
      poison: 'Poison Nullified (no poison damage)',
      necrotic: 'Necrotic Nullified (no necrotic damage)',
      radiant: 'Radiant Nullified (no radiant damage)',
      psychic: 'Psychic Nullified (no psychic damage)',
      thunder: 'Thunder Nullified (no thunder damage)',
      force: 'Force Nullified (no force damage)',
      damage: 'Nullified (no damage)'
    },
    susceptible: {
      fire: 'Fire Susceptible (25% more fire damage)',
      cold: 'Cold Susceptible (25% more cold damage)',
      lightning: 'Lightning Susceptible (25% more lightning damage)',
      acid: 'Acid Susceptible (25% more acid damage)',
      poison: 'Poison Susceptible (25% more poison damage)',
      necrotic: 'Necrotic Susceptible (25% more necrotic damage)',
      radiant: 'Radiant Susceptible (25% more radiant damage)',
      psychic: 'Psychic Susceptible (25% more psychic damage)',
      thunder: 'Thunder Susceptible (25% more thunder damage)',
      force: 'Force Susceptible (25% more force damage)',
      damage: 'Susceptible (25% more damage)'
    },
    exposed: {
      fire: 'Fire Exposed (50% more fire damage)',
      cold: 'Cold Exposed (50% more cold damage)',
      lightning: 'Lightning Exposed (50% more lightning damage)',
      acid: 'Acid Exposed (50% more acid damage)',
      poison: 'Poison Exposed (50% more poison damage)',
      necrotic: 'Necrotic Exposed (50% more necrotic damage)',
      radiant: 'Radiant Exposed (50% more radiant damage)',
      psychic: 'Psychic Exposed (50% more psychic damage)',
      thunder: 'Thunder Exposed (50% more thunder damage)',
      force: 'Force Exposed (50% more force damage)',
      damage: 'Exposed (50% more damage)'
    },
    vulnerable: {
      fire: 'Fire Vulnerable (double fire damage)',
      cold: 'Cold Vulnerable (double cold damage)',
      lightning: 'Lightning Vulnerable (double lightning damage)',
      acid: 'Acid Vulnerable (double acid damage)',
      poison: 'Poison Vulnerable (double poison damage)',
      necrotic: 'Necrotic Vulnerable (double necrotic damage)',
      radiant: 'Radiant Vulnerable (double radiant damage)',
      psychic: 'Psychic Vulnerable (double psychic damage)',
      thunder: 'Thunder Vulnerable (double thunder damage)',
      force: 'Force Vulnerable (double force damage)',
      damage: 'Vulnerable (double damage)'
    }
  };

  return thematicDescriptions[resistanceLevel]?.[damageType] ||
         thematicDescriptions[resistanceLevel]?.damage ||
         resistanceLevel;
};

// Format resistance value using exact wizard dropdown descriptions
const formatResistanceValue = (value, damageType) => {
  if (typeof value === 'number') {
    // Use exact descriptions from the creature wizard dropdown
    if (value === -200) return `Vampiric (Heals for 200% of damage taken)`;
    if (value === -100) return `Absorbing (Heals for 100% of damage taken)`;
    if (value === -50) return `Draining (Heals for 50% of damage taken)`;
    if (value === -25) return `Siphoning (Heals for 25% of damage taken)`;
    if (value === 0) return `Immune (Takes no damage)`;
    if (value === 25) return `Highly Resistant (Takes 25% damage)`;
    if (value === 50) return `Resistant (Takes 50% damage)`;
    if (value === 75) return `Guarded (Takes 75% damage)`;
    if (value === 100) return `Normal (Takes normal damage)`;
    if (value === 125) return `Susceptible (Takes 125% damage)`;
    if (value === 150) return `Exposed (Takes 150% damage)`;
    if (value === 200) return `Vulnerable (Takes 200% damage)`;

    // Fallback to percentage
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}% damage modifier`;
  }
  return value;
};

const SimpleCreatureTooltip = ({ creature }) => {
  const { items: itemLibrary } = useItemStore();

  if (!creature) return null;

  // Get size mapping for grid display
  const sizeMapping = getCreatureSizeMapping(creature.size);

  // Format type name for display
  const formatTypeName = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format size name for display
  const formatSizeName = (size) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };





  // Get notable abilities (first 2)
  const getNotableAbilities = () => {
    if (!creature.abilities || creature.abilities.length === 0) return [];
    return creature.abilities.slice(0, 2);
  };

  // Format ability stats for display
  const formatAbilityStats = (ability) => {
    const stats = [];
    
    // Action Point Cost
    if (ability.actionPointCost || ability.castingConfig?.actionPointCost) {
      const apCost = ability.actionPointCost || ability.castingConfig?.actionPointCost;
      stats.push(`${apCost} AP`);
    }
    
    // Range
    if (ability.range || ability.targetingConfig?.rangeDistance) {
      const range = ability.range || ability.targetingConfig?.rangeDistance;
      if (typeof range === 'number') {
        stats.push(`${range} ft`);
      } else if (range) {
        stats.push(range);
      }
    }
    
    // Damage
    if (ability.damage) {
      const { diceCount, diceType, bonus, damageType } = ability.damage;
      if (diceCount > 0) {
        let damageText = `${diceCount}d${diceType}`;
        if (bonus > 0) damageText += `+${bonus}`;
        if (damageType && damageType !== 'physical') {
          damageText += ` ${damageType}`;
        }
        stats.push(damageText);
      }
    } else if (ability.effects) {
      // Check for damage effects
      const damageEffect = ability.effects.find(e => e.type === 'damage' || e.type === 'DAMAGE');
      if (damageEffect) {
        if (damageEffect.formula) {
          stats.push(damageEffect.formula);
        } else if (damageEffect.damageType) {
          stats.push(`Damage (${damageEffect.damageType})`);
        }
      }
    }
    
    // Cooldown
    if (ability.cooldown && ability.cooldown > 0) {
      stats.push(`CD: ${ability.cooldown}r`);
    }
    
    return stats;
  };

  // Format effects concisely for display
  const formatAbilityEffects = (ability) => {
    const effects = [];
    
    if (ability.effects && Array.isArray(ability.effects)) {
      ability.effects.forEach(effect => {
        const type = effect.type?.toLowerCase() || '';
        
        if (type === 'damage' || type === 'damage') {
          const formula = effect.formula || '';
          const damageType = effect.damageType || 'physical';
          if (formula) {
            effects.push(`${formula} ${damageType} damage`);
          } else {
            effects.push(`${damageType} damage`);
          }
        } else if (type === 'healing' || type === 'heal') {
          const formula = effect.formula || effect.healingFormula || '';
          if (formula) {
            effects.push(`${formula} healing`);
          } else {
            effects.push('Healing');
          }
        } else if (type === 'buff') {
          const buffName = effect.name || effect.buffName || 'Buff';
          effects.push(buffName);
        } else if (type === 'debuff') {
          const debuffName = effect.name || effect.debuffName || 'Debuff';
          effects.push(debuffName);
        } else if (type === 'status') {
          const statusName = effect.name || effect.statusName || 'Status Effect';
          effects.push(statusName);
        } else if (type === 'condition') {
          const conditionName = effect.name || effect.conditionName || 'Condition';
          effects.push(conditionName);
        } else if (effect.name) {
          effects.push(effect.name);
        }
      });
    }
    
    // Check for damage config
    if (ability.damageConfig) {
      const formula = ability.damageConfig.formula || ability.damageConfig.damageFormula || '';
      const damageType = ability.damageConfig.damageType || 
                        (ability.damageConfig.damageTypes && ability.damageConfig.damageTypes[0]) || 
                        'physical';
      if (formula) {
        effects.push(`${formula} ${damageType} damage`);
      }
    }
    
    // Check for healing config
    if (ability.healingConfig) {
      const formula = ability.healingConfig.formula || '';
      if (formula) {
        effects.push(`${formula} healing`);
      } else {
        effects.push('Healing');
      }
    }
    
    // Check for buff config
    if (ability.buffConfig) {
      if (ability.buffConfig.statModifiers && ability.buffConfig.statModifiers.length > 0) {
        const mods = ability.buffConfig.statModifiers.map(mod => {
          const stat = mod.stat.charAt(0).toUpperCase() + mod.stat.slice(1);
          const sign = mod.value >= 0 ? '+' : '';
          return `${sign}${mod.value} ${stat}`;
        });
        effects.push(`Buff: ${mods.join(', ')}`);
      } else {
        effects.push('Buff');
      }
    }
    
    // Check for debuff config
    if (ability.debuffConfig) {
      if (ability.debuffConfig.statModifiers && ability.debuffConfig.statModifiers.length > 0) {
        const mods = ability.debuffConfig.statModifiers.map(mod => {
          const stat = mod.stat.charAt(0).toUpperCase() + mod.stat.slice(1);
          const sign = mod.value >= 0 ? '+' : '';
          return `${sign}${mod.value} ${stat}`;
        });
        effects.push(`Debuff: ${mods.join(', ')}`);
      } else {
        effects.push('Debuff');
      }
    }
    
    return effects;
  };

  // Get loot preview
  const getLootPreview = () => {
    if (!creature.lootTable) return null;

    const { currency, items } = creature.lootTable;
    const lootItems = [];

    // Add currency if significant
    if (currency?.gold?.max > 0) {
      lootItems.push(`${currency.gold.min}-${currency.gold.max} gold`);
    } else if (currency?.silver?.max > 0) {
      lootItems.push(`${currency.silver.min}-${currency.silver.max} silver`);
    } else if (currency?.copper?.max > 0) {
      lootItems.push(`${currency.copper.min}-${currency.copper.max} copper`);
    }

    // Add items with drop chances
    if (items && items.length > 0) {
      // Show up to 3 items, prioritizing higher quality and drop chance
      const sortedItems = items
        .filter(item => item.dropChance > 0)
        .sort((a, b) => {
          const qualityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1, poor: 0 };
          const qualityDiff = (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
          if (qualityDiff !== 0) return qualityDiff;
          return b.dropChance - a.dropChance;
        })
        .slice(0, 3);

      sortedItems.forEach(item => {
        const dropText = item.dropChance < 100 ? ` (${item.dropChance}%)` : '';
        lootItems.push(`${item.name || 'Item'}${dropText}`);
      });
    }

    return lootItems.length > 0 ? lootItems : null;
  };

  const notableAbilities = getNotableAbilities();
  const lootPreview = getLootPreview();

  return (
    <div className="enhanced-creature-tooltip">
      {/* Ornate Header */}
      <div className="creature-tooltip-header">
        {/* Decorative pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 3px,
                rgba(139, 69, 19, 0.15) 3px,
                rgba(139, 69, 19, 0.15) 6px
              )
            `,
            pointerEvents: 'none'
          }}
        />

        <div className="creature-tooltip-name">
          {creature.name}
        </div>

        {/* Type and Size */}
        <div className="creature-tooltip-subtitle">
          {formatSizeName(creature.size)} {formatTypeName(creature.type)} • {sizeMapping.width}×{sizeMapping.height}
        </div>
      </div>

      {/* Main Content */}
      <div className="creature-tooltip-content creature-tooltip-scrollable">


        {/* Rich Flavor Text Description */}
        {creature.description && (
          <div
            style={{
              fontSize: '13px',
              color: '#2d1810',
              marginBottom: '12px',
              lineHeight: '1.5',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, #f8f4e6 100%)',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'justify',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              position: 'relative',
              fontWeight: '600',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Decorative quote marks */}
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '6px',
              fontSize: '18px',
              color: 'rgba(139, 69, 19, 0.5)',
              fontFamily: 'serif'
            }}>
              "
            </div>
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '6px',
              fontSize: '18px',
              color: 'rgba(139, 69, 19, 0.5)',
              fontFamily: 'serif'
            }}>
              "
            </div>

            <div style={{
              padding: '0 8px',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              whiteSpace: 'normal'
            }}>
              {creature.description}
            </div>
          </div>
        )}

        {/* Core Combat Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '5px',
            marginBottom: '10px'
          }}
        >
          {/* HP */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.4) 0%, rgba(139, 0, 0, 0.3) 100%)',
            border: '2px solid #dc3545',
            borderRadius: '8px',
            padding: '8px 6px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#2d1810',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              lineHeight: '1.2'
            }}>
              HP
            </div>
            <div style={{
              fontSize: '15px',
              color: '#2d1810',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              lineHeight: '1.3'
            }}>
              {creature.stats?.currentHp ?? creature.stats?.maxHp ?? 0}/{creature.stats?.maxHp ?? 0}
            </div>
          </div>

          {/* Armor */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(108, 117, 125, 0.4) 0%, rgba(64, 64, 64, 0.3) 100%)',
            border: '2px solid #6c757d',
            borderRadius: '8px',
            padding: '8px 6px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#2d1810',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              lineHeight: '1.2'
            }}>
              ARMOR
            </div>
            <div style={{
              fontSize: '15px',
              color: '#2d1810',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              lineHeight: '1.3'
            }}>
              {creature.stats?.armor ?? creature.stats?.armorClass ?? 0}
            </div>
          </div>

          {/* Initiative */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.4) 0%, rgba(255, 140, 0, 0.3) 100%)',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '8px 6px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#2d1810',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              lineHeight: '1.2'
            }}>
              INIT
            </div>
            <div style={{
              fontSize: '15px',
              color: '#2d1810',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              lineHeight: '1.3'
            }}>
              +{creature.stats?.initiative ?? 0}
            </div>
          </div>
        </div>

        {/* Secondary Combat Stats - Mana and Action Points */}
        {((creature.stats?.maxMana ?? 0) > 0 || (creature.stats?.maxActionPoints ?? 0) > 0) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: (creature.stats?.maxMana ?? 0) > 0 && (creature.stats?.maxActionPoints ?? 0) > 0 ? 'repeat(2, 1fr)' : '1fr',
              gap: '5px',
              marginBottom: '10px'
            }}
          >
            {/* Mana */}
            {(creature.stats?.maxMana ?? 0) > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.4) 0%, rgba(0, 86, 179, 0.3) 100%)',
                border: '2px solid #0d6efd',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#2d1810',
                  fontWeight: '700',
                  marginBottom: '4px',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.2'
                }}>
                  MANA
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#2d1810',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.3'
                }}>
                  {creature.stats?.currentMana ?? creature.stats?.maxMana ?? 0}/{creature.stats?.maxMana ?? 0}
                </div>
              </div>
            )}

            {/* Action Points */}
            {(creature.stats?.maxActionPoints ?? 0) > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.4) 0%, rgba(20, 108, 67, 0.3) 100%)',
                border: '2px solid #198754',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#2d1810',
                  fontWeight: '700',
                  marginBottom: '4px',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.2'
                }}>
                  AP
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#2d1810',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.3'
                }}>
                  {creature.stats?.currentActionPoints ?? creature.stats?.maxActionPoints ?? 0}/{creature.stats?.maxActionPoints ?? 0}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Improved Resistances and Vulnerabilities */}
        {(creature.resistances && Object.keys(creature.resistances).length > 0) ||
         (creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0) ? (
          <div style={{ marginBottom: '10px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#8B4513',
              marginBottom: '8px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              borderBottom: '2px solid #8B4513',
              paddingBottom: '4px',
              lineHeight: '1.3'
            }}>
              RESISTANCES & VULNERABILITIES
            </div>

            {/* Detailed Resistances and Vulnerabilities Display */}
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, #f8f4e6 100%)',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)'
            }}>
              {Object.entries(creature.resistances || {}).map(([type, value]) => {
                // Get detailed thematic description using the formatResistanceValue function
                const description = formatResistanceValue(value, type);

                // Determine color based on resistance level
                let color;
                if (typeof value === 'number') {
                  if (value <= -100) {
                    color = '#ff0080'; // Vampiric/Absorbing
                  } else if (value <= -25) {
                    color = '#ff8080'; // Draining/Siphoning
                  } else if (value === 0) {
                    color = '#059669'; // Immune
                  } else if (value <= 50) {
                    color = '#0d9488'; // Resistant
                  } else if (value <= 100) {
                    color = '#6b7280'; // Normal
                  } else if (value <= 150) {
                    color = '#dc2626'; // Vulnerable
                  } else {
                    color = '#991b1b'; // Weak
                  }
                } else {
                  color = '#6b7280';
                }

                // Format damage type name
                const typeName = type.charAt(0).toUpperCase() + type.slice(1);

                return (
                  <div key={type} style={{
                    display: 'block',
                    margin: '4px 0',
                    padding: '6px 8px',
                    background: `${color}25`,
                    border: `2px solid ${color}80`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#2d1810',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.4',
                    wordWrap: 'break-word'
                  }}>
                    <strong style={{ color: color }}>{typeName}:</strong> {description}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Enhanced Abilities Section */}
        {notableAbilities.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#8B4513',
              marginBottom: '8px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              borderBottom: '2px solid #8B4513',
              paddingBottom: '4px',
              lineHeight: '1.3'
            }}>
              ABILITIES
            </div>

            {/* Ability Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notableAbilities.slice(0, 2).map((ability, index) => {
                const abilityStats = formatAbilityStats(ability);
                const abilityEffects = formatAbilityEffects(ability);
                const hasDescription = ability.description && ability.description.trim().length > 0;
                
                return (
                  <div key={index} style={{
                    background: 'linear-gradient(135deg, rgba(240, 230, 210, 0.95) 0%, rgba(232, 220, 192, 0.9) 100%)',
                    border: '2px solid #8B4513',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#2d1810',
                      marginBottom: '6px',
                      textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                      lineHeight: '1.3',
                      fontFamily: 'Cinzel, serif'
                    }}>
                      {ability.name}
                    </div>
                    {/* Ability Stats */}
                    {abilityStats.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '5px',
                        marginBottom: '8px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {abilityStats.map((stat, statIndex) => (
                          <span key={statIndex} style={{
                            background: 'rgba(139, 69, 19, 0.2)',
                            border: '1px solid rgba(139, 69, 19, 0.5)',
                            borderRadius: '4px',
                            padding: '3px 7px',
                            color: '#5a1e12',
                            textShadow: '1px 1px 1px rgba(255, 255, 255, 0.8)',
                            whiteSpace: 'nowrap',
                            fontFamily: 'Crimson Text, serif'
                          }}>
                            {stat}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Effects List */}
                    {abilityEffects.length > 0 && (
                      <div style={{
                        fontSize: '11px',
                        color: '#3a2a1a',
                        lineHeight: '1.5',
                        marginBottom: hasDescription ? '6px' : '0',
                        fontFamily: 'Crimson Text, serif'
                      }}>
                        <div style={{
                          fontWeight: '600',
                          color: '#5a1e12',
                          marginBottom: '3px',
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Effects:
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          {abilityEffects.map((effect, effectIndex) => (
                            <div key={effectIndex} style={{
                              paddingLeft: '8px',
                              position: 'relative'
                            }}>
                              <span style={{
                                position: 'absolute',
                                left: '0',
                                color: '#8B4513',
                                fontWeight: '700'
                              }}>•</span>
                              <span>{effect}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Description */}
                    {hasDescription && (
                      <div style={{
                        fontSize: '11px',
                        color: '#3a2a1a',
                        lineHeight: '1.4',
                        fontStyle: 'italic',
                        marginTop: abilityEffects.length > 0 ? '6px' : '0',
                        paddingTop: abilityEffects.length > 0 ? '6px' : '0',
                        borderTop: abilityEffects.length > 0 ? '1px solid rgba(139, 69, 19, 0.2)' : 'none',
                        fontFamily: 'Crimson Text, serif'
                      }}>
                        {ability.description.length > 100 ? ability.description.substring(0, 100) + '...' : ability.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* More abilities indicator */}
            {creature.abilities && creature.abilities.length > 2 && (
              <div style={{
                fontSize: '11px',
                color: '#2d1810',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: '6px',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)'
              }}>
                +{creature.abilities.length - 2} more abilities
              </div>
            )}
          </div>
        )}

        {/* Enhanced Loot Section */}
        {lootPreview && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#8B4513',
              textAlign: 'center',
              borderBottom: '2px solid #8B4513',
              paddingBottom: '4px',
              lineHeight: '1.3',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              &#9876; Spoils of Victory &#9876;
            </div>

            <div style={{
              background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.2) 0%, rgba(139, 69, 19, 0.15) 100%)',
              border: '2px solid #8B4513',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#2d1810',
              marginTop: '8px'
            }}>
              {(() => {
                const lootItems = creature.lootTable?.items || [];
                const currency = creature.lootTable?.currency;
                const hasGold = currency?.gold?.max > 0;
                const hasSilver = currency?.silver?.max > 0;
                const hasCopper = currency?.copper?.max > 0;
                const hasAnyCurrency = hasGold || hasSilver || hasCopper;

                const sortedLoot = lootItems
                  .filter(item => item.dropChance > 0)
                  .sort((a, b) => {
                    const qualityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1, poor: 0 };
                    const qualityDiff = (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0);
                    if (qualityDiff !== 0) return qualityDiff;
                    return b.dropChance - a.dropChance;
                  })
                  .slice(0, 5);

                const totalItems = lootItems.filter(i => i.dropChance > 0).length;

                const getQualityColor = (quality) => {
                  switch ((quality || 'common').toLowerCase()) {
                    case 'poor': return '#6b6b6b';
                    case 'common': return '#1a0f08';
                    case 'uncommon': return '#1eff00';
                    case 'rare': return '#0070dd';
                    case 'epic': return '#a335ee';
                    case 'legendary': return '#ff8000';
                    default: return '#1a0f08';
                  }
                };

                const getQualityDot = (quality) => {
                  switch ((quality || 'common').toLowerCase()) {
                    case 'poor': return '#9d9d9d';
                    case 'common': return '#c4b89a';
                    case 'uncommon': return '#1eff00';
                    case 'rare': return '#0070dd';
                    case 'epic': return '#a335ee';
                    case 'legendary': return '#ff8000';
                    default: return '#c4b89a';
                  }
                };

                const getQualityLabel = (quality) => {
                  switch ((quality || 'common').toLowerCase()) {
                    case 'poor': return { text: 'Trash', color: '#8a8276', bg: '#e8e4de' };
                    case 'common': return { text: 'Common', color: '#5a4a3a', bg: '#f5f0e5' };
                    case 'uncommon': return { text: 'Uncommon', color: '#1eff00', bg: 'rgba(30, 255, 0, 0.12)' };
                    case 'rare': return { text: 'Rare', color: '#0070dd', bg: 'rgba(0, 112, 221, 0.12)' };
                    case 'epic': return { text: 'Epic', color: '#a335ee', bg: 'rgba(163, 53, 238, 0.12)' };
                    case 'legendary': return { text: 'Legendary', color: '#ff8000', bg: 'rgba(255, 128, 0, 0.15)' };
                    default: return { text: 'Common', color: '#5a4a3a', bg: '#f5f0e5' };
                  }
                };

                const getDropChanceStyle = (chance) => {
                  if (chance >= 100) return { label: 'Guaranteed', color: '#2d6a2e', bg: 'rgba(45, 106, 46, 0.12)' };
                  if (chance >= 50) return { label: `${chance}%`, color: '#5a4a3a', bg: 'rgba(139, 115, 85, 0.15)' };
                  if (chance >= 20) return { label: `${chance}%`, color: '#8b6914', bg: 'rgba(184, 134, 11, 0.15)' };
                  return { label: `${chance}%`, color: '#8b2635', bg: 'rgba(139, 38, 53, 0.12)' };
                };

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Currency Section */}
                    {hasAnyCurrency && (
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          background: 'linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
                          border: '1px solid rgba(184, 134, 11, 0.4)',
                          borderRadius: '5px'
                        }}>
                          <span style={{ fontSize: '14px' }}>&#176;</span>
                          <span style={{ fontSize: '11px', color: '#5a4a3a', fontWeight: '600', fontStyle: 'italic' }}>Coin Purse</span>
                          <span style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: '700', color: '#8b6914' }}>
                            {hasGold && <span>{currency.gold.min}-{currency.gold.max}g </span>}
                            {hasSilver && <span>{currency.silver.min}-{currency.silver.max}s </span>}
                            {hasCopper && <span>{currency.copper.min}-{currency.copper.max}c</span>}
                          </span>
                        </div>
                        {sortedLoot.length > 0 && (
                          <div style={{ borderBottom: '1px dashed rgba(139, 115, 85, 0.35)', margin: '2px 0' }} />
                        )}
                      </>
                    )}

                    {/* Item Drops */}
                    {sortedLoot.map((item, index) => {
                      const quality = item.quality || 'common';
                      const color = getQualityColor(quality);
                      const dotColor = getQualityDot(quality);
                      const qlabel = getQualityLabel(quality);
                      const isLowQuality = quality === 'common' || quality === 'poor';
                      const drop = getDropChanceStyle(item.dropChance);

                      return (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 7px',
                          background: qlabel.bg,
                          borderLeft: `3px solid ${dotColor}`,
                          borderRadius: '0 4px 4px 0',
                          fontSize: '12px',
                          lineHeight: '1.3'
                        }}>
                          {/* Quality dot */}
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: dotColor,
                            flexShrink: 0,
                            boxShadow: quality === 'legendary' || quality === 'epic'
                              ? `0 0 4px ${dotColor}`
                              : 'none'
                          }} />

                          {/* Item name */}
                          <span style={{
                            color: color,
                            fontWeight: '700',
                            textShadow: isLowQuality ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.4)',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.name || 'Unknown Item'}
                          </span>

                          {/* Drop chance */}
                          <span style={{
                            fontSize: '9px',
                            fontWeight: '700',
                            color: drop.color,
                            background: drop.bg,
                            padding: '2px 5px',
                            borderRadius: '3px',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.3px',
                            textTransform: drop.label === 'Guaranteed' ? 'uppercase' : 'none'
                          }}>
                            {drop.label}
                          </span>
                        </div>
                      );
                    })}

                    {totalItems > 5 && (
                      <div style={{
                        fontSize: '10px',
                        color: '#6b5b47',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        marginTop: '2px'
                      }}>
                        ...and {totalItems - 5} more treasures to discover
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Shopkeeper Info */}
        {creature.isShopkeeper && (
          <div style={{ marginBottom: '10px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#8B4513',
              marginBottom: '4px',
              textAlign: 'center',
              borderBottom: '2px solid #8B4513',
              paddingBottom: '4px',
              lineHeight: '1.3'
            }}>
              MERCHANT
            </div>
            <div style={{
              fontSize: '11px',
              color: '#5a4a3a',
              textAlign: 'center',
              fontStyle: 'italic',
              marginBottom: '8px'
            }}>
              Wares available for trade:
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.15) 0%, rgba(139, 69, 19, 0.2) 50%, rgba(160, 82, 45, 0.15) 100%)',
              border: '2px solid #daa520',
              borderRadius: '8px',
              padding: '10px 12px',
              color: '#2d1810',
              boxShadow: 'inset 0 1px 0 rgba(255, 215, 0, 0.1), 0 2px 8px rgba(139, 69, 19, 0.3)'
            }}>
              {creature.shopInventory?.shopName && (
                <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '13px', textAlign: 'center' }}>
                  {creature.shopInventory.shopName}
                </div>
              )}
              {creature.shopInventory?.shopDescription && (
                <div style={{
                  fontSize: '11px',
                  color: '#5a4a3a',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  marginBottom: creature.shopInventory?.items?.length > 0 ? '8px' : '0',
                  paddingBottom: creature.shopInventory?.items?.length > 0 ? '8px' : '0',
                  borderBottom: creature.shopInventory?.items?.length > 0 ? '1px solid rgba(139, 115, 85, 0.3)' : 'none'
                }}>
                  {creature.shopInventory.shopDescription.length > 80
                    ? creature.shopInventory.shopDescription.substring(0, 80) + '...'
                    : creature.shopInventory.shopDescription}
                </div>
              )}
              {creature.shopInventory?.items?.length > 0 && (() => {
                const shopItems = creature.shopInventory.items;
                const maxDisplay = 5;

                const getMerchantQualityColor = (quality) => {
                  switch ((quality || 'common').toLowerCase()) {
                    case 'poor': return '#6b6b6b';
                    case 'common': return '#1a0f08';
                    case 'uncommon': return '#1eff00';
                    case 'rare': return '#0070dd';
                    case 'epic': return '#a335ee';
                    case 'legendary': return '#ff8000';
                    default: return '#1a0f08';
                  }
                };

                const getMerchantQualityBg = (quality) => {
                  switch ((quality || 'common').toLowerCase()) {
                    case 'poor': return '#e8e4de';
                    case 'common': return '#fffdf7';
                    case 'uncommon': return 'rgba(30, 255, 0, 0.08)';
                    case 'rare': return 'rgba(0, 112, 221, 0.1)';
                    case 'epic': return 'rgba(163, 53, 238, 0.1)';
                    case 'legendary': return 'rgba(255, 128, 0, 0.12)';
                    default: return '#fffdf7';
                  }
                };

                const getMerchantQualityBorder = (quality) => {
                  switch ((quality || 'common').toLowerCase()) {
                    case 'poor': return '#b0a89c';
                    case 'common': return '#9c8b74';
                    case 'uncommon': return 'rgba(30, 255, 0, 0.35)';
                    case 'rare': return 'rgba(0, 112, 221, 0.4)';
                    case 'epic': return 'rgba(163, 53, 238, 0.4)';
                    case 'legendary': return 'rgba(255, 128, 0, 0.5)';
                    default: return '#9c8b74';
                  }
                };

                const resolvedItems = shopItems
                  .map(si => {
                    const item = itemLibrary.find(i => i.id === si.itemId);
                    return item ? { ...si, name: item.name, quality: item.quality || 'common' } : null;
                  })
                  .filter(Boolean);

                const displayItems = resolvedItems.slice(0, maxDisplay);
                const remainingCount = resolvedItems.length - maxDisplay;

                if (displayItems.length === 0) {
                  return <div style={{ fontSize: '11px', fontStyle: 'italic', textAlign: 'center' }}>{shopItems.length} wares for sale</div>;
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {displayItems.map((item, index) => {
                      const quality = item.quality || 'common';
                      const isLowQuality = quality === 'common' || quality === 'poor';

                      return (
                        <div key={item.itemId || index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          background: getMerchantQualityBg(quality),
                          border: `1px solid ${getMerchantQualityBorder(quality)}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          lineHeight: '1.3'
                        }}>
                          <span style={{
                            color: getMerchantQualityColor(quality),
                            fontWeight: '700',
                            textShadow: isLowQuality ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.4)',
                          }}>
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                    {remainingCount > 0 && (
                      <div style={{
                        fontSize: '10px',
                        color: '#6b5b47',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        marginTop: '2px'
                      }}>
                        +{remainingCount} more wares
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Enhanced Tags */}
        {creature.tags && creature.tags.length > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              justifyContent: 'center'
            }}>
              {creature.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '11px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.35) 0%, rgba(101, 67, 33, 0.3) 100%)',
                    color: '#2d1810',
                    padding: '5px 10px',
                    borderRadius: '12px',
                    border: '2px solid #8B4513',
                    fontWeight: '600',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.2'
                  }}
                >
                  {tag}
                </span>
              ))}
              {creature.tags.length > 4 && (
                <span style={{
                  fontSize: '11px',
                  color: '#2d1810',
                  fontStyle: 'italic',
                  alignSelf: 'center',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)'
                }}>
                  +{creature.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default SimpleCreatureTooltip;
