import React, { useState, useRef } from 'react';

const SpellPreview = ({ spellData }) => {
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { x: 0, y: 0 }, title: '' });
  const previewRef = useRef(null);
  
  // Show tooltip with specific content
  const showTooltip = (e, title, content) => {
    const rect = previewRef.current.getBoundingClientRect();
    const position = {
      x: rect.right + 10,
      y: e.clientY
    };
    
    setTooltip({
      visible: true,
      title,
      content,
      position
    });
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };
  
  // Format damage types for display
  const formatDamageTypes = () => {
    if (!spellData.damageTypes || spellData.damageTypes.length === 0) return "None";
    
    return spellData.damageTypes.join(', ');
  };
  
  // Get class name
  const getClassName = () => {
    if (!spellData.class) return '';
    
    const classMap = {
      'pyrofiend': 'Pyrofiend',
      'gambler': 'Gambler',
      'fateweaver': 'Fate Weaver',
      'stormbringer': 'Stormbringer'
    };
    
    return classMap[spellData.class] || spellData.class;
  };
  
  // Get spell type name
  const getSpellTypeName = () => {
    if (!spellData.spellType) return '';
    
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability'
    };
    
    return typeMap[spellData.spellType] || spellData.spellType;
  };
  
  // Get category name
  const getCategoryName = () => {
    if (!spellData.category) return '';
    
    const categoryMap = {
      'damage': 'Damage',
      'healing': 'Healing',
      'buff': 'Buff',
      'debuff': 'Debuff',
      'utility': 'Utility'
    };
    
    return categoryMap[spellData.category] || spellData.category;
  };
  
  // Get range display
  const getRangeDisplay = () => {
    if (!spellData.rangeType) return '';
    
    switch (spellData.rangeType) {
      case 'self':
        return 'Self';
      case 'touch':
        return 'Touch';
      case 'melee':
        return 'Melee (5 ft)';
      case 'ranged':
        return `${spellData.range || 30} ft`;
      default:
        return spellData.rangeType;
    }
  };
  
  return (
    <div className="spell-preview-container">
      <div className="spell-preview" ref={previewRef}>
        <div className="spell-header">
          {spellData.icon ? (
            <img src={spellData.icon} alt="" className="spell-icon" />
          ) : (
            <div className="spell-icon-placeholder"></div>
          )}
          
          <div className="spell-title">
            <h3>{spellData.name || 'Unnamed Spell'}</h3>
            <div className="spell-source">
              {spellData.source === 'class' && getClassName()}
              {spellData.source === 'monster' && spellData.monsterType}
              {spellData.spellType && ` · ${getSpellTypeName()}`}
            </div>
          </div>
        </div>
        
        <div className="spell-body">
          {spellData.description ? (
            <div className="spell-description">{spellData.description}</div>
          ) : (
            <div className="spell-description placeholder">No description provided yet</div>
          )}
          
          <div className="spell-stats">
            {spellData.category && (
              <div 
                className="spell-stat spell-category"
                onMouseEnter={(e) => showTooltip(e, 'Spell Category', `${getCategoryName()} spells primarily ${
                  spellData.category === 'damage' ? 'deal damage to targets' :
                  spellData.category === 'healing' ? 'restore health to allies' :
                  spellData.category === 'buff' ? 'enhance allies\' abilities' :
                  spellData.category === 'debuff' ? 'weaken enemies\' abilities' :
                  spellData.category === 'utility' ? 'provide practical benefits outside combat' :
                  'have various effects'
                }.`)}
                onMouseLeave={hideTooltip}
              >
                {getCategoryName()}
              </div>
            )}
            
            {spellData.rangeType && (
              <div 
                className="spell-stat spell-range"
                onMouseEnter={(e) => showTooltip(e, 'Spell Range', `This spell can be cast at a range of ${getRangeDisplay()}.`)}
                onMouseLeave={hideTooltip}
              >
                {getRangeDisplay()}
              </div>
            )}
            
            {spellData.targetingMode && (
              <div 
                className="spell-stat spell-targeting"
                onMouseEnter={(e) => showTooltip(e, 'Targeting Mode', `This spell ${
                  spellData.targetingMode === 'single' ? 'affects a single target' : 
                  'affects multiple targets in an area'
                }.`)}
                onMouseLeave={hideTooltip}
              >
                {spellData.targetingMode === 'single' ? 'Single Target' : 'Area of Effect'}
              </div>
            )}
          </div>
          
          {spellData.category === 'damage' && (
            <div 
              className="spell-damage-types"
              onMouseEnter={(e) => showTooltip(e, 'Damage Types', `This spell deals ${formatDamageTypes()} damage.`)}
              onMouseLeave={hideTooltip}
            >
              <span className="label">Damage Types: </span>
              {spellData.damageTypes && spellData.damageTypes.map((type, index) => (
                <span 
                  key={type} 
                  className="damage-type"
                  style={{ 
                    color: 
                      type === 'fire' ? '#ff4500' :
                      type === 'frost' ? '#00bfff' :
                      type === 'arcane' ? '#9932cc' :
                      type === 'nature' ? '#32cd32' :
                      type === 'shadow' ? '#800080' :
                      type === 'holy' ? '#ffd700' :
                      type === 'physical' ? '#c0c0c0' : 
                      '#ffffff'
                  }}
                >
                  {type}
                  {index < spellData.damageTypes.length - 1 && ', '}
                </span>
              ))}
              {(!spellData.damageTypes || spellData.damageTypes.length === 0) && (
                <span className="none-text">None</span>
              )}
            </div>
          )}
          
          {spellData.primaryDamage && (spellData.primaryDamage.dice || spellData.primaryDamage.flat > 0) && (
            <div 
              className="spell-damage-value"
              onMouseEnter={(e) => showTooltip(e, 'Damage', `This spell deals ${spellData.primaryDamage.dice || ''} ${
                spellData.primaryDamage.dice && spellData.primaryDamage.flat > 0 ? '+ ' : ''
              }${spellData.primaryDamage.flat > 0 ? spellData.primaryDamage.flat : ''} damage.`)}
              onMouseLeave={hideTooltip}
            >
              <span className="label">Damage: </span>
              {spellData.primaryDamage.dice}{' '}
              {spellData.primaryDamage.dice && spellData.primaryDamage.flat > 0 && '+ '}
              {spellData.primaryDamage.flat > 0 && spellData.primaryDamage.flat}
            </div>
          )}
          
          {/* Add more stats as needed */}
          
          {spellData.flavorText && (
            <div className="spell-flavor">"{spellData.flavorText}"</div>
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      <div 
        className={`spell-tooltip ${tooltip.visible ? 'visible' : ''}`}
        style={{
          top: tooltip.position.y,
          left: tooltip.position.x
        }}
      >
        {tooltip.title && <div className="tooltip-title">{tooltip.title}</div>}
        {tooltip.content && <div className="tooltip-content">{tooltip.content}</div>}
      </div>
    </div>
  );
};

export default SpellPreview;