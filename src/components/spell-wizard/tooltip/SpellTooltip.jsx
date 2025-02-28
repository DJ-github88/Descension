import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Quality levels for styling
const QUALITY_LEVELS = {
  POOR: 'poor',
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact'
};

// Resource types and their icons
const RESOURCE_TYPES = {
  mana: {
    name: 'Mana',
    icon: 'inv_elemental_mote_mana',
    color: '#0070dd'
  },
  rage: {
    name: 'Rage',
    icon: 'spell_misc_emotionangry',
    color: '#ff0000'
  },
  energy: {
    name: 'Energy',
    icon: 'spell_shadow_shadowworddominate',
    color: '#ffff00'
  },
  focus: {
    name: 'Focus',
    icon: 'ability_hunter_focusfire',
    color: '#d3a100'
  },
  health: {
    name: 'Health',
    icon: 'inv_alchemy_elixir_05',
    color: '#00ff00'
  }
};

// Damage type colors
const DAMAGE_TYPES = {
  physical: '#ffffff',
  fire: '#ff4400',
  frost: '#00ccff',
  nature: '#4eff4e',
  shadow: '#a350c0',
  arcane: '#ff44ff',
  holy: '#ffff44'
};

/**
 * WoW-style tooltip component for displaying spell information.
 */
const SpellTooltip = ({
  children,
  spell,
  position = 'right',
  showOnHover = true,
  alwaysVisible = false,
  usePortal = false,
  className = '',
  style = {},
  size = 'normal'
}) => {
  const [visible, setVisible] = useState(alwaysVisible);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Show the tooltip
  const showTooltip = () => {
    if (showOnHover) {
      setVisible(true);
    }
  };

  // Hide the tooltip
  const hideTooltip = () => {
    if (showOnHover && !alwaysVisible) {
      setVisible(false);
    }
  };

  // Calculate the quality class based on the spell
  const getQualityClass = () => {
    if (!spell) return QUALITY_LEVELS.COMMON;
    
    // Example logic - you can customize this based on your game rules
    if (spell.quality) {
      return spell.quality.toLowerCase();
    }
    
    // Default logic based on rareness or power
    if (spell.isLegendary) return QUALITY_LEVELS.LEGENDARY;
    if (spell.isEpic || (spell.level && spell.level >= 80)) return QUALITY_LEVELS.EPIC;
    if (spell.isRare || (spell.level && spell.level >= 60)) return QUALITY_LEVELS.RARE;
    if (spell.isUncommon || (spell.level && spell.level >= 40)) return QUALITY_LEVELS.UNCOMMON;
    
    return QUALITY_LEVELS.COMMON;
  };

  // Calculate tooltip position
  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    const updatePosition = () => {
      const trigger = triggerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      let newPosition = { top: 0, left: 0 };

      switch (position) {
        case 'top':
          newPosition = {
            top: trigger.top + scrollY - tooltip.height - 10,
            left: trigger.left + scrollX + (trigger.width / 2) - (tooltip.width / 2)
          };
          break;
        case 'bottom':
          newPosition = {
            top: trigger.bottom + scrollY + 10,
            left: trigger.left + scrollX + (trigger.width / 2) - (tooltip.width / 2)
          };
          break;
        case 'left':
          newPosition = {
            top: trigger.top + scrollY + (trigger.height / 2) - (tooltip.height / 2),
            left: trigger.left + scrollX - tooltip.width - 10
          };
          break;
        case 'right':
        default:
          newPosition = {
            top: trigger.top + scrollY + (trigger.height / 2) - (tooltip.height / 2),
            left: trigger.right + scrollX + 10
          };
          break;
      }

      // Ensure tooltip stays within viewport
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Check horizontal bounds
      if (newPosition.left < 0) {
        newPosition.left = 10;
      } else if (newPosition.left + tooltip.width > viewport.width) {
        newPosition.left = viewport.width - tooltip.width - 10;
      }

      // Check vertical bounds
      if (newPosition.top < 0) {
        newPosition.top = 10;
      } else if (newPosition.top + tooltip.height > scrollY + viewport.height) {
        newPosition.top = scrollY + viewport.height - tooltip.height - 10;
      }

      setTooltipPosition(newPosition);
    };

    // Update position initially and on window resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [visible, position]);

  // Format resource cost display
  const formatResourceCost = (cost, type) => {
    if (!cost || cost <= 0) return null;
    
    const resourceInfo = RESOURCE_TYPES[type] || RESOURCE_TYPES.mana;
    
    return (
      <div className="spell-tooltip-cost">
        <img 
          src={`https://wow.zamimg.com/images/wow/icons/small/${resourceInfo.icon}.jpg`}
          alt={resourceInfo.name}
          className="cost-icon"
        />
        <span className={type}>{cost} {resourceInfo.name}</span>
      </div>
    );
  };

  // Format damage type display
  const formatDamage = (damage, type) => {
    if (!damage) return null;
    
    // Format damage string (e.g. "100-150" or "50")
    let damageText = damage;
    if (typeof damage === 'object') {
      damageText = `${damage.min}-${damage.max}`;
    }
    
    return (
      <span className={type} style={{ color: DAMAGE_TYPES[type] || DAMAGE_TYPES.physical }}>
        {damageText}
      </span>
    );
  };

  // If no spell data provided, don't render anything
  if (!spell) {
    return children;
  }

  const tooltipClasses = [
    'spell-tooltip',
    visible ? 'visible' : 'hidden',
    size === 'compact' ? 'compact' : size === 'expanded' ? 'expanded' : '',
    className
  ].filter(Boolean).join(' ');

  const qualityClass = getQualityClass();
  
  // Determine arrow position class
  const arrowClass = `spell-tooltip-arrow ${position}`;

  // Render the tooltip content
  const renderTooltipContent = () => (
    <div 
      className={tooltipClasses} 
      ref={tooltipRef}
      style={{
        ...style,
        ...(!usePortal ? tooltipPosition : {}),
        display: visible ? 'block' : 'none'
      }}
    >
      <div className={arrowClass}></div>
      
      {/* Tooltip Header */}
      <div className="spell-tooltip-header">
        <h3 className={`spell-tooltip-name ${qualityClass}`}>{spell.name}</h3>
        <div className="spell-tooltip-type">
          {spell.type} {spell.subType ? `• ${spell.subType}` : ''}
        </div>
      </div>
      
      {/* Tooltip Body */}
      <div className="spell-tooltip-body">
        {/* Cast Info (cast time, cooldown, range) */}
        <div className="spell-tooltip-castinfo">
          {spell.castTime && (
            <div className="cast-time">
              <span className="label">Cast:</span>
              <span className="value">{spell.castTime}</span>
            </div>
          )}
          
          {spell.cooldown && (
            <div className="cooldown">
              <span className="label">Cooldown:</span>
              <span className="value">{spell.cooldown}</span>
            </div>
          )}
          
          {spell.range && (
            <div className="range">
              <span className="label">Range:</span>
              <span className="value">{spell.range}</span>
            </div>
          )}
        </div>
        
        {/* Resource costs */}
        {spell.resourceCosts && Object.entries(spell.resourceCosts).map(([type, cost]) => (
          formatResourceCost(cost, type)
        ))}
        
        {/* Description */}
        {spell.description && (
          <div className="spell-tooltip-description">
            {spell.description}
          </div>
        )}
        
        {/* Effects */}
        {spell.effects && spell.effects.length > 0 && (
          <div className="spell-tooltip-effects">
            {spell.effects.map((effect, index) => (
              <div key={index} className="effect">
                {effect.icon && (
                  <img 
                    src={`https://wow.zamimg.com/images/wow/icons/small/${effect.icon}.jpg`}
                    alt=""
                    className="effect-icon"
                  />
                )}
                <div className="effect-text">{effect.text}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Damage and Healing */}
        {(spell.damage || spell.healing) && (
          <div className="spell-tooltip-damage">
            {spell.damage && (
              <div className="damage">
                <span className="label">Damage: </span>
                {formatDamage(spell.damage.amount, spell.damage.type || 'physical')}
                {spell.damage.extra && ` + ${formatDamage(spell.damage.extra.amount, spell.damage.extra.type || 'physical')}`}
              </div>
            )}
            
            {spell.healing && (
              <div className="healing spell-tooltip-healing">
                <span className="label">Healing: </span>
                <span>{spell.healing.amount}</span>
                {spell.healing.duration && ` over ${spell.healing.duration}s`}
              </div>
            )}
          </div>
        )}
        
        {/* Duration */}
        {spell.duration && (
          <div className="spell-tooltip-duration">
            <span className="label">Duration: </span>
            <span className="value">{spell.duration}</span>
          </div>
        )}
        
        {/* Flavor text */}
        {spell.flavorText && (
          <div className="spell-tooltip-flavor">
            "{spell.flavorText}"
          </div>
        )}
        
        {/* Tags */}
        {spell.tags && spell.tags.length > 0 && (
          <div className="spell-tooltip-tags">
            {spell.tags.map((tag, index) => (
              <div key={index} className="spell-tooltip-tag">{tag}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render the tooltip
  return (
    <div className="spell-tooltip-wrapper" ref={triggerRef}>
      <div 
        className="tooltip-trigger"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      
      {renderTooltipContent()}
    </div>
  );
};

SpellTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  spell: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    subType: PropTypes.string,
    description: PropTypes.string,
    castTime: PropTypes.string,
    cooldown: PropTypes.string,
    range: PropTypes.string,
    resourceCosts: PropTypes.object,
    effects: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.string,
      text: PropTypes.string
    })),
    damage: PropTypes.shape({
      amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({
          min: PropTypes.number,
          max: PropTypes.number
        })
      ]),
      type: PropTypes.string,
      extra: PropTypes.object
    }),
    healing: PropTypes.shape({
      amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({
          min: PropTypes.number,
          max: PropTypes.number
        })
      ]),
      duration: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    duration: PropTypes.string,
    flavorText: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    quality: PropTypes.string,
    isLegendary: PropTypes.bool,
    isEpic: PropTypes.bool,
    isRare: PropTypes.bool,
    isUncommon: PropTypes.bool,
    level: PropTypes.number
  }),
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  showOnHover: PropTypes.bool,
  alwaysVisible: PropTypes.bool,
  usePortal: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(['compact', 'normal', 'expanded'])
};

export default SpellTooltip;