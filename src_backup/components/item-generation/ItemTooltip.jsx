import React from 'react';

// Rarity colors matching WoWhead style
const RARITY_COLORS = {
  poor: { text: '#9d9d9d', border: '#9d9d9d' },
  common: { text: '#ffffff', border: '#ffffff' },
  uncommon: { text: '#1eff00', border: '#1eff00' },
  rare: { text: '#0070dd', border: '#0070dd' },
  epic: { text: '#a335ee', border: '#a335ee' },
  legendary: { text: '#ff8000', border: '#ff8000' },
  artifact: { text: '#e6cc80', border: '#e6cc80' }
};

// Helper function to get color based on rarity
const getQualityColor = (quality) => {
  const qualityLower = quality?.toLowerCase() || 'common';
  return RARITY_COLORS[qualityLower]?.text || RARITY_COLORS.common.text;
};

const ItemTooltip = ({ item }) => {
  if (!item) return null;

  // Get the quality color for border and text
  const qualityLower = (item.quality || item.rarity || 'common').toLowerCase();
  const qualityColor = getQualityColor(qualityLower);
  const borderColor = RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;

  // Format item stats
  const renderStats = () => {
    if (!item.baseStats || Object.keys(item.baseStats).length === 0) {
      return null;
    }

    return (
      <div className="item-stats">
        {Object.entries(item.baseStats).map(([stat, value]) => (
          <div key={stat} className="item-stat">
            {`${value > 0 ? '+' : ''}${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`}
          </div>
        ))}
      </div>
    );
  };

  // Format item damage (for weapons)
  const renderDamage = () => {
    if (!item.damage || !item.damageType) {
      return null;
    }

    return (
      <div className="item-damage">
        {`${item.damage} ${item.damageType.charAt(0).toUpperCase() + item.damageType.slice(1)} Damage`}
      </div>
    );
  };

  // Format item effects
  const renderEffects = () => {
    if (!item.effects || item.effects.length === 0) {
      return null;
    }

    return (
      <div className="item-effects">
        {item.effects.map((effect, index) => {
          switch (effect.type) {
            case 'heal':
              return (
                <div key={index} className="item-effect heal">
                  {`Use: Restores ${effect.amount} health`}
                  {effect.duration > 0 && ` over ${effect.duration} seconds`}.
                </div>
              );
            case 'damage':
              return (
                <div key={index} className="item-effect damage">
                  {`Use: Deals ${effect.amount} ${effect.damageType || 'damage'}`}
                  {effect.duration > 0 && ` over ${effect.duration} seconds`}.
                </div>
              );
            case 'buff':
              return (
                <div key={index} className="item-effect buff">
                  {`Use: ${effect.description || 'Applies a buff'}`}
                  {effect.duration > 0 && ` for ${effect.duration} seconds`}.
                </div>
              );
            default:
              return (
                <div key={index} className="item-effect">
                  {effect.description || 'Unknown effect'}
                </div>
              );
          }
        })}
      </div>
    );
  };

  // Format item value
  const renderValue = () => {
    if (!item.value) {
      return null;
    }

    return (
      <div className="item-value">
        Value: {' '}
        {typeof item.value === 'object' ? (
          <>
            {item.value.gold > 0 && `${item.value.gold}g `}
            {item.value.silver > 0 && `${item.value.silver}s `}
            {item.value.copper > 0 && `${item.value.copper}c`}
            {(!item.value.gold && !item.value.silver && !item.value.copper) && '0c'}
          </>
        ) : (
          typeof item.value === 'string' || typeof item.value === 'number' ? item.value : '0c'
        )}
      </div>
    );
  };

  return (
    <div
      className="item-tooltip"
      data-quality={qualityLower}
      style={{
        borderColor: borderColor,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.4), 0 0 16px ${borderColor}80`,
        backgroundColor: 'rgba(16, 17, 20, 0.98)',
        border: '2px solid',
        borderRadius: '6px',
        padding: '16px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        minWidth: '280px',
        maxWidth: '300px',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
        margin: '0 auto',
        zIndex: 9999
      }}
    >
      {/* Item Name with dynamic font sizing */}
      <div
        style={{
          fontSize: item.name && item.name.length > 20 ? '18px' : '22px',
          marginBottom: '10px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          color: qualityColor,
          textShadow: `0 0 5px ${qualityColor}80`,
          fontWeight: 600
        }}
        title={item.name || 'Unknown Item'}
      >
        {item.name || 'Unknown Item'}
      </div>

      {/* Item Type */}
      <div style={{ color: '#aaaaaa', fontSize: '14px', marginBottom: '12px', letterSpacing: '0.2px' }}>
        {item.type && (
          <span>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            {item.subtype && ` • ${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1).toLowerCase()}`}
          </span>
        )}
      </div>

      {/* Item Icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <img
          src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`}
          alt={item.name}
          style={{
            width: '56px',
            height: '56px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
          onError={(e) => {
            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
          }}
        />
      </div>

      {/* Item Stats */}
      {renderStats()}

      {/* Item Damage */}
      {renderDamage()}

      {/* Item Effects */}
      {renderEffects()}

      {/* Item Description */}
      {item.description && (
        <div style={{ 
          color: '#cccccc', 
          fontStyle: 'italic', 
          margin: '10px 0', 
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          "{item.description}"
        </div>
      )}

      {/* Item Value */}
      {renderValue()}

      {/* Drop Chance (if provided) */}
      {item.dropChanceDisplay !== undefined && (
        <div style={{ color: '#aaaaaa', fontSize: '13px', marginTop: '8px' }}>
          Drop Chance: <span style={{ color: '#ffffff' }}>{item.dropChanceDisplay}%</span>
        </div>
      )}
    </div>
  );
};

export default ItemTooltip;
