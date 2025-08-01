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
    <div className="pf-creature-tooltip">
      {/* Tooltip borders for consistency with spell tooltips */}
      <div className="tooltip-top-border"></div>

      {/* Tooltip content container */}
      <div className="wc3-tooltip-content" style={{ padding: '12px' }}>
        {/* Creature name with challenge rating */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '4px',
          color: '#7a3b2e',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.3px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{creature.name}</span>
        {challengeInfo && (
          <span style={{
            fontSize: '10px',
            background: 'rgba(122, 59, 46, 0.2)',
            padding: '1px 4px',
            borderRadius: '3px',
            color: '#7a3b2e',
            fontWeight: 'normal'
          }}>
            {challengeInfo}
          </span>
        )}
      </div>

      {/* Type and size */}
      <div
        style={{
          fontSize: '10px',
          color: '#8b6914',
          marginBottom: '6px',
          fontStyle: 'italic'
        }}
      >
        {formatSizeName(creature.size)} {formatTypeName(creature.type)} • {sizeMapping.width}×{sizeMapping.height}
      </div>

      {/* Flavor text description - truncated */}
      {creature.description && (
        <div
          style={{
            fontSize: '10px',
            color: '#5d4e37',
            marginBottom: '8px',
            lineHeight: '1.3',
            fontStyle: 'italic',
            borderLeft: '2px solid #a08c70',
            paddingLeft: '6px',
            background: 'rgba(160, 140, 112, 0.08)',
            padding: '4px 6px',
            borderRadius: '0 3px 3px 0',
            maxHeight: '40px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          "{creature.description.length > 120 ? creature.description.substring(0, 120) + '...' : creature.description}"
        </div>
      )}

      {/* Core stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '11px'
        }}
      >
        <div style={{ textAlign: 'center', background: 'rgba(122, 59, 46, 0.1)', padding: '3px 6px', borderRadius: '3px', flex: 1, marginRight: '4px' }}>
          <div style={{ fontWeight: 'bold', color: '#7a3b2e', fontSize: '9px' }}>HP</div>
          <div style={{ color: '#3e2723' }}>{creature.stats.maxHp}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(122, 59, 46, 0.1)', padding: '3px 6px', borderRadius: '3px', flex: 1, marginRight: '4px' }}>
          <div style={{ fontWeight: 'bold', color: '#7a3b2e', fontSize: '9px' }}>Armor</div>
          <div style={{ color: '#3e2723' }}>{creature.stats.armor || creature.stats.armorClass}</div>
        </div>
        <div style={{ textAlign: 'center', background: 'rgba(122, 59, 46, 0.1)', padding: '3px 6px', borderRadius: '3px', flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#7a3b2e', fontSize: '9px' }}>Init</div>
          <div style={{ color: '#3e2723' }}>{creature.stats.initiative}</div>
        </div>
      </div>

      {/* Resistances and Vulnerabilities */}
      {(creature.resistances && Object.keys(creature.resistances).length > 0) ||
       (creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0) ? (
        <div style={{ marginBottom: '6px' }}>
          {creature.resistances && Object.keys(creature.resistances).length > 0 && (
            <div style={{ marginBottom: '2px' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#2e7d32' }}>Resist: </span>
              <span style={{ fontSize: '9px', color: '#388e3c' }}>
                {Object.entries(creature.resistances).slice(0, 2).map(([type, value]) =>
                  `${type.substring(0, 4)} ${formatResistanceValue(value)}`
                ).join(', ')}
              </span>
            </div>
          )}
          {creature.vulnerabilities && Object.keys(creature.vulnerabilities).length > 0 && (
            <div>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#d32f2f' }}>Vuln: </span>
              <span style={{ fontSize: '9px', color: '#f44336' }}>
                {Object.entries(creature.vulnerabilities).slice(0, 2).map(([type, value]) =>
                  `${type.substring(0, 4)} ${formatResistanceValue(value)}`
                ).join(', ')}
              </span>
            </div>
          )}
        </div>
      ) : null}

      {/* Notable Abilities - compact */}
      {notableAbilities.length > 0 && (
        <div style={{ marginBottom: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#7a3b2e', marginBottom: '2px' }}>
            Abilities:
          </div>
          {notableAbilities.slice(0, 1).map((ability, index) => (
            <div key={index} style={{
              fontSize: '9px',
              color: '#5d4e37',
              marginBottom: '2px',
              paddingLeft: '6px',
              borderLeft: '1px solid #a08c70'
            }}>
              <span style={{ fontWeight: 'bold', color: '#7a3b2e' }}>{ability.name}:</span> {ability.description.length > 60 ? ability.description.substring(0, 60) + '...' : ability.description}
            </div>
          ))}
          {creature.abilities && creature.abilities.length > 1 && (
            <div style={{ fontSize: '8px', color: '#8b6914', fontStyle: 'italic', marginTop: '1px' }}>
              +{creature.abilities.length - 1} more abilities
            </div>
          )}
        </div>
      )}

      {/* Loot Preview */}
      {lootPreview && (
        <div style={{ marginBottom: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#7a3b2e', marginBottom: '2px' }}>
            Loot:
          </div>
          <div style={{ fontSize: '9px', color: '#8b6914' }}>
            {lootPreview.slice(0, 2).join(', ')}
          </div>
        </div>
      )}

      {/* Tags */}
      {creature.tags && creature.tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          marginTop: '4px'
        }}>
          {creature.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                fontSize: '8px',
                background: 'rgba(139, 69, 19, 0.15)',
                color: '#7a3b2e',
                padding: '1px 4px',
                borderRadius: '6px',
                border: '1px solid rgba(139, 69, 19, 0.2)'
              }}
            >
              {tag}
            </span>
          ))}
          {creature.tags.length > 3 && (
            <span style={{
              fontSize: '8px',
              color: '#8b6914',
              fontStyle: 'italic',
              alignSelf: 'center'
            }}>
              +{creature.tags.length - 3}
            </span>
          )}
        </div>
      )}
      </div>

      {/* Tooltip bottom border */}
      <div className="tooltip-bottom-border"></div>
    </div>
  );
};

export default SimpleCreatureTooltip;
