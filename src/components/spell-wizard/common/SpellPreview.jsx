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
  
  // Get spell type name
  const getSpellTypeName = () => {
    if (!spellData.spellType) return '';
    
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual'
    };
    
    return typeMap[spellData.spellType] || spellData.spellType;
  };
  
  // Get spell type icon
  const getSpellTypeIcon = () => {
    if (!spellData.spellType) return '';
    
    const iconMap = {
      'active': 'spell_mage_flameorb',
      'passive': 'spell_holy_devotionaura',
      'aura': 'spell_holy_auraoflight',
      'ultimate': 'spell_arcane_arcane03',
      'reaction': 'ability_warrior_revenge',
      'ritual': 'spell_shadow_demonicempathy'
    };
    
    return iconMap[spellData.spellType] || '';
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
    <div className="spell-preview" ref={previewRef}>
      <div className="spell-header">
        {spellData.icon ? (
          <img 
            src={`https://wow.zamimg.com/images/wow/icons/medium/${spellData.icon}.jpg`} 
            alt=""
            className="spell-icon"
            onError={(e) => {
              e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
            }}
          />
        ) : (
          <img 
            src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" 
            alt=""
            className="spell-icon"
          />
        )}
        <div className="spell-title">
          <h3>{spellData.name || 'Unnamed Spell'}</h3>
          <div className="spell-source">
            {spellData.spellType && (
              <span className="spell-type-badge">
                {getSpellTypeIcon() && (
                  <img 
                    src={`https://wow.zamimg.com/images/wow/icons/small/${getSpellTypeIcon()}.jpg`} 
                    alt="" 
                  />
                )}
                {getSpellTypeName()}
              </span>
            )}
            {spellData.category && <span className="spell-category">{getCategoryName()}</span>}
          </div>
        </div>
      </div>
      
      <div className="spell-body">
        {spellData.description ? (
          <div className="spell-description">{spellData.description}</div>
        ) : (
          <div className="spell-description placeholder">No description provided yet</div>
        )}
        
        {spellData.tags && spellData.tags.length > 0 && (
          <div className="spell-tags">
            {spellData.tags.map((tag, index) => (
              <span key={index} className="spell-tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="spell-stats">
          {spellData.rangeType && (
            <div 
              className="spell-stat spell-range"
              onMouseEnter={(e) => showTooltip(e, 'Spell Range', `This spell can be cast at a range of ${getRangeDisplay()}.`)}
              onMouseLeave={hideTooltip}
            >
              Range: {getRangeDisplay()}
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
          
          {spellData.castTimeType && (
            <div className="spell-stat spell-cast-time">
              Cast: {spellData.castTimeValue || 0} {spellData.castTimeValue === 1 ? 'second' : 'seconds'}
            </div>
          )}
          
          {spellData.cooldownValue > 0 && (
            <div className="spell-stat spell-cooldown">
              Cooldown: {spellData.cooldownValue} {spellData.cooldownUnit}
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
                    type === 'cold' ? '#00bfff' :
                    type === 'lightning' ? '#ffd700' :
                    type === 'acid' ? '#32cd32' :
                    type === 'thunder' ? '#1e90ff' :
                    type === 'poison' ? '#008000' :
                    type === 'psychic' ? '#9370db' :
                    type === 'radiant' ? '#ffd700' :
                    type === 'necrotic' ? '#800080' :
                    type === 'force' ? '#9932cc' :
                    type === 'bludgeoning' ? '#a9a9a9' :
                    type === 'piercing' ? '#c0c0c0' :
                    type === 'slashing' ? '#d3d3d3' :
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
        
        {spellData.flavorText && (
          <div className="spell-flavor">"{spellData.flavorText}"</div>
        )}
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