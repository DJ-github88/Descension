import React, { useState, useCallback, useRef } from 'react';
import SpellTooltip from './SpellTooltip';
import '../styles/spell-preview.css';

// Utility functions for formatting
const formatDamage = (damageData) => {
  if (!damageData || (!damageData.dice && !damageData.flat)) return "—";
  let result = "";
  if (damageData.dice) result += damageData.dice;
  if (damageData.flat && damageData.dice) result += ` + ${damageData.flat}`;
  else if (damageData.flat) result += damageData.flat;
  return result;
};

const getQualityColor = (quality) => {
  const colors = {
    poor: '#9d9d9d',
    common: '#ffffff',
    uncommon: '#1eff00',
    rare: '#0070dd',
    epic: '#a335ee',
    legendary: '#ff8000',
    artifact: '#e6cc80'
  };
  return colors[quality?.toLowerCase()] || colors.common;
};

const getDamageTypeColor = (type) => {
  const colors = {
    acid: '#32CD32',
    bludgeoning: '#8B4513',
    cold: '#87CEEB',
    fire: '#FF4500',
    force: '#ff66ff',
    lightning: '#FFD700',
    necrotic: '#4B0082',
    piercing: '#C0C0C0',
    poison: '#008000',
    psychic: '#FF69B4',
    radiant: '#FFFACD',
    slashing: '#A52A2A',
    thunder: '#0066ff'
  };
  return colors[type?.toLowerCase()] || '#ffffff';
};

const SpellPreview = ({ spellData }) => {
  const [tooltip, setTooltip] = useState(null);
  const tooltipTimeoutRef = useRef(null);
  const previewRef = useRef(null);

  const handleMouseEnter = useCallback((e, title, description, icon) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    const previewRect = previewRef.current?.getBoundingClientRect();
    
    if (!previewRect) return;
    
    // Position tooltip to the right of the preview component
    const x = previewRect.right + window.scrollX;
    const y = rect.top + window.scrollY + (rect.height / 2);
    
    setTooltip({
      title,
      description,
      icon,
      position: { x, y }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltip(null);
    }, 50);
  }, []);

  if (!spellData) return null;

  const {
    name = 'Unnamed Spell',
    description = '',
    source,
    category,
    primaryDamage,
    damageTypes = [],
    healing,
    range,
    rangeType,
    manaCost,
    apCost,
    cooldownRounds,
    cooldownType,
    buffs = [],
    debuffs = [],
    durationRounds,
    auraEffects = [],
    onHitTriggers = [],
    color,
    icon,
    flavorText
  } = spellData;

  const getSpellQuality = () => {
    if (auraEffects.length > 0 || onHitTriggers.length > 0) return 'epic';
    if (damageTypes.length > 1 || buffs.length > 1 || debuffs.length > 1) return 'rare';
    if (primaryDamage?.dice || healing?.dice) return 'uncommon';
    return 'common';
  };

  const quality = getSpellQuality();
  const qualityColor = getQualityColor(quality);

  return (
    <>
      <div ref={previewRef} className="spell-preview" style={{ '--spell-color': color || '#ffffff' }}>
        <div className="spell-header" style={{ color: qualityColor }}>
          {icon && <img src={icon} alt="" className="spell-icon" />}
          <div className="spell-title">
            <h3>{name}</h3>
            {source && <div className="spell-source">{source}</div>}
          </div>
        </div>

        <div className="spell-stats">
          {(manaCost || apCost) && (
            <div 
              className="spell-cost"
              onMouseEnter={(e) => handleMouseEnter(e, 'Resource Cost', 'The resources required to cast this spell.')}
              onMouseLeave={handleMouseLeave}
            >
              {manaCost && <span className="mana-cost">{manaCost} Mana</span>}
              {apCost && <span className="ap-cost">{apCost} AP</span>}
            </div>
          )}
          
          {range && (
            <div 
              className="spell-range"
              onMouseEnter={(e) => handleMouseEnter(e, 'Range', `This spell can be cast at targets up to ${range} ${rangeType} away.`)}
              onMouseLeave={handleMouseLeave}
            >
              {range} {rangeType}
            </div>
          )}

          {cooldownRounds && (
            <div 
              className="spell-cooldown"
              onMouseEnter={(e) => handleMouseEnter(e, 'Cooldown', `This spell can be cast again after ${cooldownRounds} ${cooldownType || 'rounds'}.`)}
              onMouseLeave={handleMouseLeave}
            >
              {cooldownRounds} {cooldownType || 'rounds'}
            </div>
          )}
        </div>

        {description && (
          <div 
            className="spell-description"
            onMouseEnter={(e) => handleMouseEnter(e, 'Description', description)}
            onMouseLeave={handleMouseLeave}
          >
            {description}
          </div>
        )}

        {damageTypes.length > 0 && (
          <div 
            className="spell-damage"
            onMouseEnter={(e) => handleMouseEnter(e, 'Damage Types', `This spell deals ${damageTypes.join(' and ')} damage.`)}
            onMouseLeave={handleMouseLeave}
          >
            {damageTypes.map((type, i) => (
              <span 
                key={i} 
                className="damage-type"
                style={{ color: getDamageTypeColor(type) }}
              >
                {type}
                {i < damageTypes.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}

        {primaryDamage && (
          <div 
            className="spell-damage-value"
            onMouseEnter={(e) => handleMouseEnter(e, 'Damage', `Deals ${formatDamage(primaryDamage)} damage.`)}
            onMouseLeave={handleMouseLeave}
          >
            Damage: {formatDamage(primaryDamage)}
          </div>
        )}

        {healing && (
          <div 
            className="spell-healing"
            onMouseEnter={(e) => handleMouseEnter(e, 'Healing', `Restores ${formatDamage(healing)} health.`)}
            onMouseLeave={handleMouseLeave}
          >
            Healing: {formatDamage(healing)}
          </div>
        )}

        {(buffs.length > 0 || debuffs.length > 0) && (
          <div className="spell-effects">
            {buffs.length > 0 && (
              <div 
                className="buffs"
                onMouseEnter={(e) => handleMouseEnter(e, 'Beneficial Effects', 'Positive effects applied by this spell.')}
                onMouseLeave={handleMouseLeave}
              >
                <strong>Buffs:</strong>
                <ul>
                  {buffs.map((buff, i) => (
                    <li key={i}>{buff}</li>
                  ))}
                </ul>
              </div>
            )}
            {debuffs.length > 0 && (
              <div 
                className="debuffs"
                onMouseEnter={(e) => handleMouseEnter(e, 'Negative Effects', 'Negative effects applied by this spell.')}
                onMouseLeave={handleMouseLeave}
              >
                <strong>Debuffs:</strong>
                <ul>
                  {debuffs.map((debuff, i) => (
                    <li key={i}>{debuff}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {auraEffects.length > 0 && (
          <div 
            className="aura-effects"
            onMouseEnter={(e) => handleMouseEnter(e, 'Aura Effects', 'Persistent effects that affect an area around the target.')}
            onMouseLeave={handleMouseLeave}
          >
            <strong>Aura Effects:</strong>
            <ul>
              {auraEffects.map((effect, i) => (
                <li key={i}>{effect}</li>
              ))}
            </ul>
          </div>
        )}

        {onHitTriggers.length > 0 && (
          <div 
            className="on-hit-effects"
            onMouseEnter={(e) => handleMouseEnter(e, 'On-Hit Effects', 'Additional effects that trigger when the spell hits.')}
            onMouseLeave={handleMouseLeave}
          >
            <strong>On Hit:</strong>
            <ul>
              {onHitTriggers.map((trigger, i) => (
                <li key={i}>{trigger}</li>
              ))}
            </ul>
          </div>
        )}

        {flavorText && (
          <div 
            className="spell-flavor"
            onMouseEnter={(e) => handleMouseEnter(e, 'Flavor Text', 'Thematic description that adds character to the spell.')}
            onMouseLeave={handleMouseLeave}
          >
            <em>{flavorText}</em>
          </div>
        )}
      </div>
      {tooltip && <SpellTooltip {...tooltip} />}
    </>
  );
};

export default SpellPreview;