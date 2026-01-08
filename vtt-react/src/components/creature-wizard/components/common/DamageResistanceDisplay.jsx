import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DAMAGE_TYPES } from '../../../spellcrafting-wizard/core/data/damageTypes';
import { getCustomIconUrl } from '../../../../utils/assetManager';
import './DamageResistanceDisplay.css';


const DamageResistanceDisplay = ({ resistances = {}, vulnerabilities = {} }) => {
  const [hoveredType, setHoveredType] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Get proper ability icon URL for damage types
  const getDamageTypeIconUrl = (damageTypeId) => {
    const iconMap = {
      'fire': 'Fire/Volcanic Corruption',
      'cold': 'Frost/Frostbite Variant 2',
      'lightning': 'Lightning/Thunderstorm',
      'acid': 'Poison/Poison Venom 4',
      'force': 'Force/Force Touch',
      'necrotic': 'Necrotic/Necrotic Wither',
      'radiant': 'Radiant/Radiant Light 5',
      'poison': 'Poison/Poison Venom 4',
      'psychic': 'Psychic/Psychic Telepathy',
      'thunder': 'Lightning/Thunderstorm',
      'bludgeoning': 'Bludgeoning/Hammer Crush',
      'piercing': 'Piercing/Piercing Thrust 3',
      'slashing': 'Slashing/Slashing Slash'
    };
    return getCustomIconUrl(iconMap[damageTypeId] || 'Utility/Utility', 'abilities');
  };

  // Combine resistances and vulnerabilities into a single object for easier processing
  const damageModifiers = {};
  
  // Add resistances
  Object.entries(resistances).forEach(([type, value]) => {
    if (typeof value === 'string') {
      damageModifiers[type] = value;
    } else if (typeof value === 'number') {
      // Convert old percentage system to new system
      if (value >= 100) damageModifiers[type] = 'immune';
      else if (value >= 50) damageModifiers[type] = 'resistant';
      else if (value > 0) damageModifiers[type] = 'resistant';
    }
  });

  // Add vulnerabilities
  Object.entries(vulnerabilities).forEach(([type, value]) => {
    if (typeof value === 'string') {
      damageModifiers[type] = value;
    } else if (typeof value === 'number') {
      // Convert old percentage system to new system
      if (value >= 100) damageModifiers[type] = 'vulnerable';
      else if (value >= 50) damageModifiers[type] = 'exposed';
      else if (value > 0) damageModifiers[type] = 'exposed';
    }
  });

  // Filter out damage types that have modifiers
  const relevantDamageTypes = DAMAGE_TYPES.filter(damageType => 
    damageModifiers[damageType.id]
  );

  if (relevantDamageTypes.length === 0) {
    return null;
  }

  // Get visual indicator for resistance level
  const getResistanceIndicator = (level) => {
    switch (level) {
      case 'immune':
        return { symbol: '🛡️', color: '#4CAF50', bgColor: '#E8F5E8' };
      case 'resistant':
        return { symbol: '🔰', color: '#2196F3', bgColor: '#E3F2FD' };
      case 'exposed':
        return { symbol: '⚠️', color: '#FF9800', bgColor: '#FFF3E0' };
      case 'vulnerable':
        return { symbol: '💥', color: '#F44336', bgColor: '#FFEBEE' };
      default:
        return { symbol: '⚪', color: '#9E9E9E', bgColor: '#F5F5F5' };
    }
  };

  // Get tooltip text for resistance level
  const getTooltipText = (damageType, level) => {
    const damageTypeName = damageType.name;
    
    switch (level) {
      case 'immune':
        return `Immune to ${damageTypeName}\n\nThis creature takes no damage from ${damageTypeName.toLowerCase()} attacks. The damage is completely negated.`;
      case 'resistant':
        return `Resistant to ${damageTypeName}\n\nThis creature takes half damage from ${damageTypeName.toLowerCase()} attacks. Damage is reduced by 50%.`;
      case 'exposed':
        return `Exposed to ${damageTypeName}\n\nThis creature takes increased damage from ${damageTypeName.toLowerCase()} attacks. Damage is increased by 50%.`;
      case 'vulnerable':
        return `Vulnerable to ${damageTypeName}\n\nThis creature takes double damage from ${damageTypeName.toLowerCase()} attacks. Damage is increased by 100%.`;
      default:
        return `Normal ${damageTypeName} resistance`;
    }
  };

  // Handle mouse events for tooltip
  const handleMouseEnter = (e, damageType, level) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setHoveredType({ damageType, level });
    updateTooltipPosition(e);

    // Show tooltip after delay
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // 500ms delay
  };

  const handleMouseMove = (e) => {
    if (hoveredType) {
      updateTooltipPosition(e);
    }
  };

  const handleMouseLeave = () => {
    // Clear timeout and hide tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredType(null);
    setShowTooltip(false);
  };

  const updateTooltipPosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    setTooltipPosition({
      x: rect.left + scrollX + rect.width / 2,
      y: rect.top + scrollY - 10
    });
  };

  return (
    <div className="damage-resistance-display">
      <div className="resistance-grid">
        {relevantDamageTypes.map(damageType => {
          const level = damageModifiers[damageType.id];
          const indicator = getResistanceIndicator(level);
          
          return (
            <div
              key={damageType.id}
              className={`resistance-item ${level}`}
              style={{
                backgroundColor: indicator.bgColor,
                borderColor: indicator.color
              }}
              onMouseEnter={(e) => handleMouseEnter(e, damageType, level)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="damage-type-icon">
                <img
                  src={damageType.icon?.startsWith('http') ? damageType.icon : getDamageTypeIconUrl(damageType.id)}
                  alt={damageType.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="fallback-icon" style={{ display: 'none' }}>
                  {damageType.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div 
                className="resistance-indicator"
                style={{ color: indicator.color }}
              >
                {indicator.symbol}
              </div>
              <div className="damage-type-name">
                {damageType.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredType && showTooltip && createPortal(
        <div
          className="resistance-tooltip"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          <div className="tooltip-content">
            {getTooltipText(hoveredType.damageType, hoveredType.level).split('\n').map((line, index) => (
              <div key={index} className={index === 0 ? 'tooltip-title' : 'tooltip-description'}>
                {line}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DamageResistanceDisplay;
