import React from 'react';
import { getCreatureSizeMapping } from '../../../../store/creatureStore';
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
              fontSize: '12px',
              color: '#000000',
              marginBottom: '16px',
              lineHeight: '1.5',
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 244, 235, 0.7) 100%)',
              border: '1px solid rgba(139, 69, 19, 0.4)',
              borderRadius: '8px',
              padding: '10px 12px',
              textAlign: 'justify',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
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
              fontSize: '20px',
              color: 'rgba(139, 69, 19, 0.4)',
              fontFamily: 'serif'
            }}>
              "
            </div>
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '6px',
              fontSize: '20px',
              color: 'rgba(139, 69, 19, 0.4)',
              fontFamily: 'serif'
            }}>
              "
            </div>

            <div style={{
              padding: '0 10px',
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
            gap: '8px',
            marginBottom: '14px'
          }}
        >
          {/* HP */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.25) 0%, rgba(139, 0, 0, 0.15) 100%)',
            border: '2px solid rgba(220, 53, 69, 0.4)',
            borderRadius: '8px',
            padding: '8px 6px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#000000',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              HP
            </div>
            <div style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              {creature.stats.currentHp || creature.stats.maxHp}/{creature.stats.maxHp}
            </div>
          </div>

          {/* Armor */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(108, 117, 125, 0.25) 0%, rgba(64, 64, 64, 0.15) 100%)',
            border: '2px solid rgba(108, 117, 125, 0.4)',
            borderRadius: '8px',
            padding: '10px 8px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#000000',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              ARMOR
            </div>
            <div style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              {creature.stats.armor || creature.stats.armorClass}
            </div>
          </div>

          {/* Initiative */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 140, 0, 0.15) 100%)',
            border: '2px solid rgba(255, 193, 7, 0.4)',
            borderRadius: '8px',
            padding: '10px 8px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#000000',
              fontWeight: '700',
              marginBottom: '4px',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              INIT
            </div>
            <div style={{
              fontSize: '16px',
              color: '#000000',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              +{creature.stats.initiative}
            </div>
          </div>
        </div>

        {/* Secondary Combat Stats - Mana and Action Points */}
        {(creature.stats.maxMana > 0 || creature.stats.maxActionPoints > 0) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: creature.stats.maxMana > 0 && creature.stats.maxActionPoints > 0 ? 'repeat(2, 1fr)' : '1fr',
              gap: '8px',
              marginBottom: '14px'
            }}
          >
            {/* Mana */}
            {creature.stats.maxMana > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.25) 0%, rgba(0, 86, 179, 0.15) 100%)',
                border: '2px solid rgba(13, 110, 253, 0.4)',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#000000',
                  fontWeight: '700',
                  marginBottom: '4px',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  MANA
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#000000',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  {creature.stats.currentMana || creature.stats.maxMana}/{creature.stats.maxMana}
                </div>
              </div>
            )}

            {/* Action Points */}
            {creature.stats.maxActionPoints > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(25, 135, 84, 0.25) 0%, rgba(20, 108, 67, 0.15) 100%)',
                border: '2px solid rgba(25, 135, 84, 0.4)',
                borderRadius: '8px',
                padding: '8px 6px',
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: '#000000',
                  fontWeight: '700',
                  marginBottom: '4px',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  AP
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#000000',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  {creature.stats.currentActionPoints || creature.stats.maxActionPoints}/{creature.stats.maxActionPoints}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Improved Resistances and Vulnerabilities */}
        {(creature.resistances && Object.keys(creature.resistances).length > 0) ||
         (creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0) ? (
          <div style={{ marginBottom: '16px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#d4af37',
              marginBottom: '12px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
              paddingBottom: '6px'
            }}>
              RESISTANCES & VULNERABILITIES
            </div>

            {/* Detailed Resistances and Vulnerabilities Display */}
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 230, 210, 0.7) 100%)',
              border: '2px solid rgba(139, 115, 85, 0.4)',
              borderRadius: '8px',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
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
                    padding: '6px 10px',
                    background: `${color}20`,
                    border: `1px solid ${color}60`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: color,
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.3',
                    wordWrap: 'break-word'
                  }}>
                    <strong>{typeName}:</strong> {description}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Enhanced Abilities Section */}
        {notableAbilities.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#4c1d95',
              marginBottom: '10px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
              borderBottom: '1px solid rgba(167, 139, 250, 0.3)',
              paddingBottom: '4px'
            }}>
              ABILITIES
            </div>

            {/* Ability Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notableAbilities.slice(0, 2).map((ability, index) => (
                <div key={index} style={{
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#3730a3',
                    marginBottom: '4px',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                  }}>
                    {ability.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#1e1b4b',
                    lineHeight: '1.4',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                  }}>
                    {ability.description.length > 80 ? ability.description.substring(0, 80) + '...' : ability.description}
                  </div>
                </div>
              ))}
            </div>

            {/* More abilities indicator */}
            {creature.abilities && creature.abilities.length > 2 && (
              <div style={{
                fontSize: '10px',
                color: '#374151',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: '8px',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
              }}>
                +{creature.abilities.length - 2} more abilities
              </div>
            )}
          </div>
        )}

        {/* Enhanced Loot Section */}
        {lootPreview && (
          <div style={{ marginBottom: '16px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#92400e',
              marginBottom: '10px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
              borderBottom: '1px solid rgba(251, 191, 36, 0.3)',
              paddingBottom: '4px'
            }}>
              LOOT
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '11px',
              color: '#451a03',
              lineHeight: '1.4',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              {lootPreview.slice(0, 3).join(', ')}
            </div>
          </div>
        )}

        {/* Shopkeeper Info */}
        {creature.isShopkeeper && (
          <div style={{ marginBottom: '16px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#064e3b',
              marginBottom: '10px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
              borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
              paddingBottom: '4px'
            }}>
              SHOPKEEPER
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '11px',
              color: '#022c22',
              lineHeight: '1.4',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
            }}>
              {creature.shopInventory?.shopName && (
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {creature.shopInventory.shopName}
                </div>
              )}
              {creature.shopInventory?.shopDescription && (
                <div style={{ fontSize: '10px', opacity: 0.9 }}>
                  {creature.shopInventory.shopDescription.length > 60
                    ? creature.shopInventory.shopDescription.substring(0, 60) + '...'
                    : creature.shopInventory.shopDescription}
                </div>
              )}
              {creature.shopInventory?.items?.length > 0 && (
                <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.8 }}>
                  {creature.shopInventory.items.length} items for sale
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Tags */}
        {creature.tags && creature.tags.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              justifyContent: 'center'
            }}>
              {creature.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '10px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.2) 0%, rgba(101, 67, 33, 0.15) 100%)',
                    color: '#78350f',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 69, 19, 0.3)',
                    fontWeight: '500',
                    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {tag}
                </span>
              ))}
              {creature.tags.length > 4 && (
                <span style={{
                  fontSize: '10px',
                  color: '#451a03',
                  fontStyle: 'italic',
                  alignSelf: 'center',
                  textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                }}>
                  +{creature.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ornate Footer */}
      <div
        style={{
          background: 'linear-gradient(145deg, #5a1e12 0%, #8B4513 50%, #5a1e12 100%)',
          borderTop: '2px solid #8B4513',
          height: '8px',
          position: 'relative'
        }}
      >
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
      </div>

      {/* Tooltip Footer */}
      <div className="creature-tooltip-footer"></div>
    </div>
  );
};

export default SimpleCreatureTooltip;
