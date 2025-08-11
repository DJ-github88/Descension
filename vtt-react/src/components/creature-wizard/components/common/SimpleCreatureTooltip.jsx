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

// Format resistance value with thematic description
const formatResistanceValue = (value) => {
  if (typeof value === 'number') {
    // Convert percentage to resistance level
    if (value === -200) return getThematicResistanceDescription('vampiric', 'damage');
    if (value === -100) return getThematicResistanceDescription('absorbing', 'damage');
    if (value === -50) return getThematicResistanceDescription('draining', 'damage');
    if (value === -25) return getThematicResistanceDescription('siphoning', 'damage');
    if (value === 0) return getThematicResistanceDescription('immune', 'damage');
    if (value === 25) return getThematicResistanceDescription('slight_reduction', 'damage');
    if (value === 50) return getThematicResistanceDescription('resistant', 'damage');
    if (value === 75) return getThematicResistanceDescription('guarded', 'damage');
    if (value === 100) return getThematicResistanceDescription('nullified', 'damage');
    if (value === 125) return getThematicResistanceDescription('susceptible', 'damage');
    if (value === 150) return getThematicResistanceDescription('exposed', 'damage');
    if (value === 200) return getThematicResistanceDescription('vulnerable', 'damage');

    // Fallback to percentage
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
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

  // Format resistance/vulnerability values
  const formatResistanceValue = (value) => {
    if (typeof value === 'string') {
      return value === 'resistant' ? '50%' :
             value === 'immune' ? '100%' :
             value === 'vulnerable' ? '+50%' :
             value === 'exposed' ? '+100%' : value;
    }
    return `${value}%`;
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
              fontWeight: '600'
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

            <div style={{ padding: '0 10px' }}>
              {creature.description.length > 140 ? creature.description.substring(0, 140) + '...' : creature.description}
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
              {creature.stats.maxHp}
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

        {/* Enhanced Resistances and Vulnerabilities */}
        {(creature.resistances && Object.keys(creature.resistances).length > 0) ||
         (creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0) ? (
          <div style={{ marginBottom: '16px' }}>
            {/* Section Header */}
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#d4af37',
              marginBottom: '10px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.6)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
              paddingBottom: '4px'
            }}>
              RESISTANCES & VULNERABILITIES
            </div>

            {/* Resistances and Vulnerabilities from single resistances object */}
            {creature.resistances && Object.keys(creature.resistances).length > 0 && (() => {
              // Separate resistances and vulnerabilities from the single resistances object
              const resistances = {};
              const vulnerabilities = {};

              Object.entries(creature.resistances).forEach(([type, value]) => {
                if (typeof value === 'number') {
                  if (value <= 100) {
                    resistances[type] = value;
                  } else {
                    vulnerabilities[type] = value;
                  }
                }
              });

              return (
                <>
                  {/* Resistances */}
                  {Object.keys(resistances).length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#1a5e20',
                        marginBottom: '6px',
                        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                      }}>
                        RESIST:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Object.entries(resistances).slice(0, 3).map(([type, value]) => {
                          // Convert value to resistance level
                          let resistanceLevel = 'resistant';
                          if (typeof value === 'number') {
                            if (value === -200) resistanceLevel = 'vampiric';
                            else if (value === -100) resistanceLevel = 'absorbing';
                            else if (value === -50) resistanceLevel = 'draining';
                            else if (value === -25) resistanceLevel = 'siphoning';
                            else if (value === 0) resistanceLevel = 'immune';
                            else if (value === 25) resistanceLevel = 'highly_resistant';
                            else if (value === 50) resistanceLevel = 'resistant';
                            else if (value === 75) resistanceLevel = 'guarded';
                            else if (value === 100) resistanceLevel = 'normal';
                          }

                          const thematicDesc = getThematicResistanceDescription(resistanceLevel, type);
                          return (
                            <div key={type} style={{
                              fontSize: '11px',
                              color: '#0f3a14',
                              background: 'rgba(34, 197, 94, 0.15)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                            }}>
                              • {thematicDesc}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Vulnerabilities */}
                  {Object.keys(vulnerabilities).length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#7f1d1d',
                        marginBottom: '6px',
                        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                      }}>
                        VULN:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Object.entries(vulnerabilities).slice(0, 3).map(([type, value]) => {
                          // Convert value to vulnerability level
                          let vulnerabilityLevel = 'vulnerable';
                          if (typeof value === 'number') {
                            if (value === 125) vulnerabilityLevel = 'susceptible';
                            else if (value === 150) vulnerabilityLevel = 'exposed';
                            else if (value === 200) vulnerabilityLevel = 'vulnerable';
                          }

                          const thematicDesc = getThematicResistanceDescription(vulnerabilityLevel, type);
                          return (
                            <div key={type} style={{
                              fontSize: '11px',
                              color: '#450a0a',
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
                            }}>
                              • {thematicDesc}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
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
