import React, { useState, useEffect } from 'react';
import '../styles/Components/preview-card.css';

/**
 * Enhanced SpellPreview component that renders a game-like tooltip for spell data
 * This component dynamically updates based on spell properties - without duplicate header
 */
const SpellPreview = ({ spellData }) => {
  // State for tracking hover effects and tooltip display
  const [activeSection, setActiveSection] = useState(null);
  
  // Get spell quality class based on properties
  const getQualityClass = () => {
    if (!spellData) return 'common';
    
    // Map quality based on effect type and other properties
    if (spellData.spellType === 'ultimate') return 'legendary';
    if (spellData.spellType === 'ritual') return 'epic';
    if (spellData.category === 'damage' && spellData.primaryDamage?.dice?.includes('d12')) return 'rare';
    if (spellData.primaryDamage?.dice?.includes('d10')) return 'uncommon';
    
    return 'common';
  };
  
  // Helper functions remain the same
  const getIconUrl = (iconName) => {
    if (!iconName) return 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
    return `https://wow.zamimg.com/images/wow/icons/medium/${iconName}.jpg`;
  };
  
  const formatDamageTypes = () => {
    if (!spellData.damageTypes || spellData.damageTypes.length === 0) return "None";
    return spellData.damageTypes.join(', ');
  };
  
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
  
  const getRangeDisplay = () => {
    if (!spellData.rangeType) return '';
    
    switch (spellData.rangeType) {
      case 'self': return 'Self';
      case 'touch': return 'Touch';
      case 'melee': return 'Melee (5 ft)';
      case 'ranged': return `${spellData.range || 30} ft`;
      default: return spellData.rangeType;
    }
  };
  
  const getTargetingDisplay = () => {
    if (!spellData.targetingMode) return '';
    
    const targetMap = {
      'single': 'Single Target',
      'multiple': `Multiple Targets (${spellData.targetCount || 1})`,
      'aoe': `Area Effect (${spellData.aoeShape || 'circle'}, ${spellData.aoeSize || 10} ft)`,
      'self': 'Self'
    };
    
    return targetMap[spellData.targetingMode] || spellData.targetingMode;
  };
  
  const getCooldownDisplay = () => {
    if (!spellData.cooldownCategory) return 'None';
    
    switch (spellData.cooldownCategory) {
      case 'none': return 'None';
      case 'rounds': return `${spellData.cooldownValue || 0} rounds`;
      case 'encounter': return 'Once per encounter';
      case 'short_rest': return 'Short rest';
      case 'long_rest': return 'Long rest';
      default: return spellData.cooldownCategory;
    }
  };
  
  const getCastingTimeDisplay = () => {
    if (!spellData.actionType) return 'Standard action';
    
    const actionMap = {
      'action': 'Standard action',
      'reaction': 'Reaction',
      'free_action': 'Free action',
      'channeled': `Channeled (${spellData.channelMaxRounds || 1} rounds)`
    };
    
    return actionMap[spellData.actionType] || spellData.actionType;
  };
  
  const formatResourceCosts = () => {
    if (!spellData.resourceCosts || Object.keys(spellData.resourceCosts).length === 0) {
      return 'None';
    }
    
    return Object.entries(spellData.resourceCosts)
      .map(([resource, data]) => `${data.baseAmount || 0} ${resource}`)
      .join(', ');
  };
  
  // Tooltip handlers
  const showTooltip = (section) => setActiveSection(section);
  const hideTooltip = () => setActiveSection(null);
  
  return (
    <div className="spell-preview">
      {/* Type indication (subtly shown) */}
      <div className="spell-type-indicator">
        <span className={`spell-type ${getQualityClass()}`}>{getSpellTypeName()}</span>
        {spellData.category && <span className="spell-category">{getCategoryName()}</span>}
      </div>
      
      {/* Description */}
      <div className="spell-description">
        {spellData.description || 'No description provided.'}
      </div>
      
      {/* Tags */}
      {spellData.tags && spellData.tags.length > 0 && (
        <div className="spell-tags">
          {spellData.tags.map((tag, index) => (
            <span key={index} className="spell-tag">{tag}</span>
          ))}
        </div>
      )}
      
      {/* Core Properties */}
      <div className="spell-properties">
        {/* Casting Properties */}
        <div className="property-section casting-properties">
          <h4 className="section-title">Casting</h4>
          <div className="property-grid">
            <div className="property-item" 
                 onMouseEnter={() => showTooltip('actionType')}
                 onMouseLeave={hideTooltip}>
              <span className="property-name">Action:</span>
              <span className="property-value">{getCastingTimeDisplay()}</span>
              {activeSection === 'actionType' && (
                <div className="property-tooltip">
                  Action determines how quickly this spell can be cast and how it fits into combat timing.
                </div>
              )}
            </div>
            
            <div className="property-item" 
                 onMouseEnter={() => showTooltip('resources')}
                 onMouseLeave={hideTooltip}>
              <span className="property-name">Cost:</span>
              <span className="property-value">{formatResourceCosts()}</span>
              {activeSection === 'resources' && (
                <div className="property-tooltip">
                  Resources required to cast this spell.
                </div>
              )}
            </div>
            
            <div className="property-item" 
                 onMouseEnter={() => showTooltip('cooldown')}
                 onMouseLeave={hideTooltip}>
              <span className="property-name">Cooldown:</span>
              <span className="property-value">{getCooldownDisplay()}</span>
              {activeSection === 'cooldown' && (
                <div className="property-tooltip">
                  Time before this spell can be cast again.
                </div>
              )}
            </div>
            
            {spellData.castingComponents && spellData.castingComponents.length > 0 && (
              <div className="property-item" 
                   onMouseEnter={() => showTooltip('components')}
                   onMouseLeave={hideTooltip}>
                <span className="property-name">Components:</span>
                <span className="property-value">{spellData.castingComponents.join(', ')}</span>
                {activeSection === 'components' && (
                  <div className="property-tooltip">
                    Physical components required for this spell's casting.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Targeting Properties */}
        <div className="property-section targeting-properties">
          <h4 className="section-title">Targeting</h4>
          <div className="property-grid">
            <div className="property-item" 
                 onMouseEnter={() => showTooltip('range')}
                 onMouseLeave={hideTooltip}>
              <span className="property-name">Range:</span>
              <span className="property-value">{getRangeDisplay()}</span>
              {activeSection === 'range' && (
                <div className="property-tooltip">
                  The maximum distance at which this spell can be cast.
                </div>
              )}
            </div>
            
            <div className="property-item" 
                 onMouseEnter={() => showTooltip('targeting')}
                 onMouseLeave={hideTooltip}>
              <span className="property-name">Targets:</span>
              <span className="property-value">{getTargetingDisplay()}</span>
              {activeSection === 'targeting' && (
                <div className="property-tooltip">
                  How this spell targets recipients.
                </div>
              )}
            </div>
            
            {spellData.attackResolution && (
              <div className="property-item" 
                   onMouseEnter={() => showTooltip('resolution')}
                   onMouseLeave={hideTooltip}>
                <span className="property-name">Resolution:</span>
                <span className="property-value">
                  {spellData.attackResolution === 'attackRoll' ? 'Attack Roll' : 
                   spellData.attackResolution === 'savingThrow' ? `${spellData.saveAttribute?.toUpperCase() || ''} Save` : 
                   'Automatic'}
                </span>
                {activeSection === 'resolution' && (
                  <div className="property-tooltip">
                    How this spell determines success against targets.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Effects Properties */}
        {(spellData.effectType || 
          (spellData.primaryDamage && (spellData.primaryDamage.dice || spellData.primaryDamage.flat)) ||
          spellData.damageTypes?.length > 0) && (
          <div className="property-section effect-properties">
            <h4 className="section-title">Effects</h4>
            <div className="property-grid">
              {spellData.effectType && (
                <div className="property-item" 
                     onMouseEnter={() => showTooltip('effectType')}
                     onMouseLeave={hideTooltip}>
                  <span className="property-name">Type:</span>
                  <span className="property-value">{getCategoryName()}</span>
                  {activeSection === 'effectType' && (
                    <div className="property-tooltip">
                      The primary category of this spell's effect.
                    </div>
                  )}
                </div>
              )}
              
              {spellData.primaryDamage && (spellData.primaryDamage.dice || spellData.primaryDamage.flat > 0) && (
                <div className="property-item" 
                     onMouseEnter={() => showTooltip('damage')}
                     onMouseLeave={hideTooltip}>
                  <span className="property-name">Damage:</span>
                  <span className="property-value">
                    {spellData.primaryDamage.dice && spellData.primaryDamage.dice}
                    {spellData.primaryDamage.dice && spellData.primaryDamage.flat > 0 && ' + '}
                    {spellData.primaryDamage.flat > 0 && spellData.primaryDamage.flat}
                  </span>
                  {activeSection === 'damage' && (
                    <div className="property-tooltip">
                      Damage dealt by this spell.
                    </div>
                  )}
                </div>
              )}
              
              {spellData.damageTypes && spellData.damageTypes.length > 0 && (
                <div className="property-item" 
                     onMouseEnter={() => showTooltip('damageTypes')}
                     onMouseLeave={hideTooltip}>
                  <span className="property-name">Damage Types:</span>
                  <span className="property-value damage-types">
                    {spellData.damageTypes.map((type, index) => (
                      <span key={type} className={`damage-type ${type}`}>
                        {type}
                        {index < spellData.damageTypes.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                  {activeSection === 'damageTypes' && (
                    <div className="property-tooltip">
                      Types of damage dealt by this spell.
                    </div>
                  )}
                </div>
              )}
              
              {spellData.isPersistent && (
                <div className="property-item" 
                     onMouseEnter={() => showTooltip('persistent')}
                     onMouseLeave={hideTooltip}>
                  <span className="property-name">Over Time:</span>
                  <span className="property-value">
                    {spellData.persistentTick || '1d4'} for {spellData.persistentDuration || 1} rounds
                  </span>
                  {activeSection === 'persistent' && (
                    <div className="property-tooltip">
                      Damage or healing applied over multiple rounds.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Secondary Effects */}
        {((spellData.buffs && spellData.buffs.length > 0) ||
          (spellData.debuffs && spellData.debuffs.length > 0) ||
          (spellData.movementEffects && spellData.movementEffects.length > 0) ||
          (spellData.auraEffects && spellData.auraEffects.length > 0)) && (
          <div className="property-section secondary-effects">
            <h4 className="section-title">Secondary Effects</h4>
            
            {spellData.buffs && spellData.buffs.length > 0 && (
              <div className="effect-group">
                <span className="effect-group-name">Buffs:</span>
                <div className="effect-tags">
                  {spellData.buffs.map(buff => (
                    <span key={buff} className="effect-tag buff">{buff}</span>
                  ))}
                </div>
              </div>
            )}
            
            {spellData.debuffs && spellData.debuffs.length > 0 && (
              <div className="effect-group">
                <span className="effect-group-name">Debuffs:</span>
                <div className="effect-tags">
                  {spellData.debuffs.map(debuff => (
                    <span key={debuff} className="effect-tag debuff">{debuff}</span>
                  ))}
                </div>
              </div>
            )}
            
            {spellData.movementEffects && spellData.movementEffects.length > 0 && (
              <div className="effect-group">
                <span className="effect-group-name">Movement:</span>
                <div className="effect-tags">
                  {spellData.movementEffects.map(effect => (
                    <span key={effect} className="effect-tag movement">{effect}</span>
                  ))}
                </div>
              </div>
            )}
            
            {spellData.auraEffects && spellData.auraEffects.length > 0 && (
              <div className="effect-group">
                <span className="effect-group-name">Auras:</span>
                <div className="aura-effects">
                  {spellData.auraEffects.map(aura => (
                    <div key={aura.id} className="aura-effect">
                      {aura.name}: {aura.effect} ({aura.range}ft)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Flavor Text */}
      {spellData.flavorText && (
        <div className="spell-flavor">"{spellData.flavorText}"</div>
      )}
    </div>
  );
};

export default SpellPreview;