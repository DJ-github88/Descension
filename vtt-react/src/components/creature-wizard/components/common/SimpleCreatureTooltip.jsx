import React from 'react';
import { getCreatureSizeMapping } from '../../../../store/creatureStore';
import '../../../../styles/creature-token.css';
import '../../../../styles/wow-classic-tooltip.css';

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

  // Get challenge rating or experience points
  const getChallengeInfo = () => {
    if (creature.stats?.challengeRating) {
      return `CR ${creature.stats.challengeRating}`;
    }
    if (creature.stats?.experiencePoints) {
      return `${creature.stats.experiencePoints} XP`;
    }
    return null;
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
    }

    // Add notable items
    if (items && items.length > 0) {
      const notableItems = items.filter(item =>
        item.quality === 'rare' || item.quality === 'epic' || item.quality === 'legendary'
      ).slice(0, 2);

      notableItems.forEach(item => {
        lootItems.push(item.name || 'Special Item');
      });
    }

    return lootItems.length > 0 ? lootItems : null;
  };

  const challengeInfo = getChallengeInfo();
  const notableAbilities = getNotableAbilities();
  const lootPreview = getLootPreview();

  return (
    <div
      className="creature-preview-tooltip"
      style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        border: '2px solid #4a4a4a',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        color: '#e0e0e0',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        fontSize: '13px',
        maxWidth: '320px',
        minWidth: '280px',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header with creature name and type */}
      <div
        style={{
          background: 'linear-gradient(90deg, #3a3a3a 0%, #2a2a2a 100%)',
          borderBottom: '1px solid #4a4a4a',
          padding: '12px 16px',
          borderRadius: '10px 10px 0 0'
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            marginBottom: '4px'
          }}
        >
          {creature.name}
        </div>

        <div
          style={{
            fontSize: '12px',
            color: '#b0b0b0',
            fontWeight: '400'
          }}
        >
          {sizeMapping[creature.size] || creature.size} {creature.type}
          {challengeInfo && (
            <span style={{
              marginLeft: '8px',
              fontSize: '11px',
              background: 'rgba(255, 215, 0, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#ffd700',
              fontWeight: '500'
            }}>
              {challengeInfo}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '16px' }}>
        {/* Description */}
        {creature.description && (
          <div
            style={{
              fontSize: '12px',
              color: '#c0c0c0',
              marginBottom: '12px',
              lineHeight: '1.4',
            }}
          >
            "{creature.description.length > 100 ? creature.description.substring(0, 100) + '...' : creature.description}"
          </div>
        )}

        {/* Core stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}
        >
          {/* HP */}
          <div style={{
            background: 'rgba(220, 53, 69, 0.2)',
            border: '1px solid rgba(220, 53, 69, 0.4)',
            borderRadius: '6px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: '#ff6b7a', fontWeight: '600', marginBottom: '2px' }}>HP</div>
            <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>{creature.stats.maxHp}</div>
          </div>

          {/* Armor */}
          <div style={{
            background: 'rgba(108, 117, 125, 0.2)',
            border: '1px solid rgba(108, 117, 125, 0.4)',
            borderRadius: '6px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: '600', marginBottom: '2px' }}>ARMOR</div>
            <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>{creature.stats.armor || creature.stats.armorClass}</div>
          </div>

          {/* Initiative */}
          <div style={{
            background: 'rgba(255, 193, 7, 0.2)',
            border: '1px solid rgba(255, 193, 7, 0.4)',
            borderRadius: '6px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: '#ffc107', fontWeight: '600', marginBottom: '2px' }}>INIT</div>
            <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>+{creature.stats.initiative}</div>
          </div>
        </div>

        {/* Resistances and Vulnerabilities */}
        {(creature.resistances && Object.keys(creature.resistances).length > 0) ||
         (creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0) ? (
          <div style={{
            marginBottom: '12px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {creature.resistances && Object.keys(creature.resistances).length > 0 && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                <span style={{ color: '#22c55e', fontWeight: '600' }}>RESIST: </span>
                <span style={{ color: '#86efac' }}>
                  {Object.entries(creature.resistances).slice(0, 2).map(([type, value]) =>
                    `${type.substring(0, 4)} ${formatResistanceValue(value)}`
                  ).join(', ')}
                </span>
              </div>
            )}
            {creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                <span style={{ color: '#ef4444', fontWeight: '600' }}>VULN: </span>
                <span style={{ color: '#fca5a5' }}>
                  {Object.entries(creature.vulnerabilities).slice(0, 2).map(([type, value]) =>
                    `${type.substring(0, 4)} ${formatResistanceValue(value)}`
                  ).join(', ')}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {/* Notable Abilities */}
        {notableAbilities.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#a78bfa',
              marginBottom: '6px',
              borderBottom: '1px solid rgba(167, 139, 250, 0.3)',
              paddingBottom: '2px'
            }}>
              ABILITIES
            </div>
            {notableAbilities.slice(0, 2).map((ability, index) => (
              <div key={index} style={{
                fontSize: '11px',
                color: '#d1d5db',
                marginBottom: '4px',
                padding: '6px 8px',
                background: 'rgba(167, 139, 250, 0.1)',
                borderRadius: '4px',
                border: '1px solid rgba(167, 139, 250, 0.2)'
              }}>
                <span style={{ fontWeight: '600', color: '#c4b5fd' }}>{ability.name}:</span> {ability.description.length > 50 ? ability.description.substring(0, 50) + '...' : ability.description}
              </div>
            ))}
            {creature.abilities && creature.abilities.length > 2 && (
              <div style={{ fontSize: '10px', color: '#9ca3af', fontStyle: 'italic', textAlign: 'center' }}>
                +{creature.abilities.length - 2} more abilities
              </div>
            )}
          </div>
        )}

        {/* Loot Preview */}
        {lootPreview && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#fbbf24',
              marginBottom: '4px'
            }}>
              LOOT
            </div>
            <div style={{
              fontSize: '11px',
              color: '#fde68a',
              background: 'rgba(251, 191, 36, 0.1)',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              {lootPreview.slice(0, 2).join(', ')}
            </div>
          </div>
        )}

        {/* Tags */}
        {creature.tags && creature.tags.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {creature.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: '9px',
                  background: 'rgba(156, 163, 175, 0.2)',
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                  color: '#d1d5db',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
            {creature.tags.length > 3 && (
              <span style={{
                fontSize: '9px',
                color: '#9ca3af',
                fontStyle: 'italic',
                alignSelf: 'center'
              }}>
                +{creature.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleCreatureTooltip;
