import React, { useState } from 'react';
import '../styles/Components/preview-card.css';

/**
 * Enhanced SpellPreview component that renders a detailed game-like card for spell data
 * Features a flip animation to show additional details and comprehensive data from all wizard steps
 */
const SpellPreview = ({ spellData, showFullDetails = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Toggle card flip
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Get icon for the effect type
  const getEffectTypeIcon = (effectType) => {
    switch (effectType) {
      case 'damage': return 'spell_fire_flameshock';
      case 'healing': return 'spell_holy_flashheal';
      case 'buff': return 'spell_holy_devotionaura';
      case 'debuff': return 'spell_shadow_curseofachimonde';
      case 'utility': return 'inv_misc_gear_08';
      default: return 'inv_misc_questionmark';
    }
  };

  // Get color for the visual theme
  const getThemeColor = (theme) => {
    switch (theme) {
      case 'fire': return '#FF4400';
      case 'frost': return '#00CCFF';
      case 'arcane': return '#CC44FF';
      case 'nature': return '#44DD44';
      case 'shadow': return '#8800AA';
      case 'holy': return '#FFDD00';
      case 'lightning': return '#55CCFF';
      case 'water': return '#0088CC';
      default: return '#3DB8FF';
    }
  };

  // Format damage or healing values
  const formatDamageOrHealing = (data) => {
    if (!data) return 'N/A';
    
    let result = '';
    if (data.dice) result += data.dice;
    if (data.flat > 0) {
      if (result) result += ` + ${data.flat}`;
      else result = data.flat.toString();
    }
    
    return result || 'N/A';
  };

  // Get spell quality class based on properties
  const getQualityClass = () => {
    if (!spellData) return 'common';
    
    // Map quality based on effect type and other properties
    if (spellData.spellType === 'ultimate') return 'legendary';
    if (spellData.spellType === 'ritual') return 'epic';
    if (spellData.selectedEffects && spellData.selectedEffects.includes('damage') && 
        spellData.primaryDamage?.dice?.includes('d12')) return 'rare';
    if (spellData.primaryDamage?.dice?.includes('d10')) return 'uncommon';
    
    return 'common';
  };

  // Get icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
    return `https://wow.zamimg.com/images/wow/icons/medium/${iconName}.jpg`;
  };

  // Get spell type display
  const getSpellTypeName = (typeId) => {
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual'
    };
    
    return typeMap[typeId] || typeId;
  };

  // Get class name display
  const getClassName = (classId) => {
    const classMap = {
      'pyrofiend': 'Pyrofiend',
      'gambler': 'Gambler',
      'fateweaver': 'Fateweaver',
      'stormbringer': 'Stormbringer',
      'berserker': 'Berserker',
      'shadowdancer': 'Shadowdancer',
      'elementalist': 'Elementalist'
    };
    
    return classMap[classId] || classId;
  };

  // Format targeting display
  const getTargetingDisplay = () => {
    if (!spellData.targetingMode) return 'Single Target';
    
    const targetMap = {
      'single': 'Single Target',
      'multiple': `Multiple Targets (${spellData.targetCount || 1})`,
      'aoe': `Area Effect (${spellData.aoeShape || 'circle'}, ${spellData.aoeSize || 10} ft)`,
      'self': 'Self'
    };
    
    return targetMap[spellData.targetingMode] || spellData.targetingMode;
  };

  // Format range display
  const getRangeDisplay = () => {
    if (!spellData.rangeType) return 'Melee';
    
    switch (spellData.rangeType) {
      case 'self': return 'Self';
      case 'touch': return 'Touch';
      case 'melee': return 'Melee (5 ft)';
      case 'ranged': return `${spellData.range || 30} ft`;
      case 'sight': return 'Line of Sight';
      case 'unlimited': return 'Unlimited';
      default: return spellData.rangeType;
    }
  };

  // Format cooldown display
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

  // Format duration display
  const getDurationDisplay = () => {
    if (!spellData.durationType || spellData.durationType === 'instant') return 'Instantaneous';
    
    return `${spellData.durationValue || 1} ${spellData.durationType}`;
  };

  // Get resource costs display
  const getResourceCostsDisplay = () => {
    if (!spellData.resourceCosts || Object.keys(spellData.resourceCosts).length === 0) {
      return 'None';
    }
    
    return Object.entries(spellData.resourceCosts)
      .map(([resource, data]) => {
        const baseCost = data.baseAmount || 0;
        const resourceName = resource.replace('_', ' ');
        return `${baseCost} ${resourceName}`;
      })
      .join(', ');
  };

  // Get attack resolution display
  const getAttackResolutionDisplay = () => {
    if (!spellData.attackResolution) return '';
    
    const resolutionMap = {
      'none': 'Automatic Effect',
      'attackRoll': 'Attack Roll',
      'savingThrow': `${spellData.saveAttribute?.toUpperCase() || ''} Saving Throw`
    };
    
    return resolutionMap[spellData.attackResolution] || spellData.attackResolution;
  };

  // Get saving throw result display
  const getSaveResultDisplay = () => {
    if (!spellData.saveResult) return '';
    
    const resultMap = {
      'negates': 'Negates Effect',
      'half': 'Half Damage',
      'partial': 'Partial Effect'
    };
    
    return resultMap[spellData.saveResult] || spellData.saveResult;
  };

  // Format casting components display
  const getCastingComponentsDisplay = () => {
    if (!spellData.castingComponents || spellData.castingComponents.length === 0) return 'None';
    
    return spellData.castingComponents.map(component => {
      switch (component) {
        case 'verbal': return 'Verbal';
        case 'somatic': return 'Somatic';
        case 'material': return 'Material';
        default: return component;
      }
    }).join(', ');
  };

  // Check if a specific section should display based on data
  const shouldDisplaySection = (sectionType) => {
    switch (sectionType) {
      case 'comboSystem':
        return spellData.isComboSystem;
      case 'utility':
        return spellData.utilityType || 
               (spellData.selectedEffects && spellData.selectedEffects.includes('utility'));
      case 'buffs':
        return spellData.selectedPrimaryStats?.length > 0 ||
               spellData.selectedSecondaryStats?.length > 0 ||
               spellData.selectedCombatStats?.length > 0 ||
               spellData.selectedResistances?.length > 0 ||
               spellData.selectedPositiveEffects?.length > 0 ||
               (spellData.selectedEffects && spellData.selectedEffects.includes('buff'));
      case 'debuffs':
        return spellData.selectedNegativeEffects?.length > 0 ||
               (spellData.selectedEffects && spellData.selectedEffects.includes('debuff'));
      case 'visuals':
        return spellData.visualTheme || spellData.visualEffect || 
               spellData.castingDescription || spellData.effectDescription || 
               spellData.impactDescription;
      case 'audio':
        return spellData.soundCategory || spellData.soundVariant;
      default:
        return false;
    }
  };

  // Format the visualTheme name for display
  const getVisualThemeName = (themeId) => {
    if (!themeId) return '';
    
    // Capitalize first letter
    return themeId.charAt(0).toUpperCase() + themeId.slice(1);
  };

  // Format the visual effect name for display
  const getVisualEffectName = (effectId) => {
    if (!effectId) return '';
    
    const effectMap = {
      'projectile': 'Projectile',
      'beam': 'Beam',
      'nova': 'Nova',
      'aura': 'Aura',
      'vortex': 'Vortex',
      'rain': 'Rain Effect',
      'burst': 'Burst',
      'wave': 'Wave'
    };
    
    return effectMap[effectId] || effectId;
  };

  // Format animation timing name
  const getAnimationTimingName = (timingId) => {
    if (!timingId) return '';
    
    const timingMap = {
      'instant': 'Instant',
      'buildup': 'Build-up',
      'pulsing': 'Pulsing',
      'phased': 'Phased',
      'sustained': 'Sustained',
      'delayed': 'Delayed',
      'sequential': 'Sequential',
      'chaotic': 'Chaotic'
    };
    
    return timingMap[timingId] || timingId;
  };

  // Get combo role name
  const getComboRoleName = (roleId) => {
    if (!roleId) return '';
    
    const roleMap = {
      'generator': 'Generator',
      'finisher': 'Finisher',
      'hybrid': 'Hybrid'
    };
    
    return roleMap[roleId] || roleId;
  };

  // Render the front content of the card
  const renderFrontContent = () => (
    <div className={`card-content ${isFlipped ? 'front-content' : ''}`}>
      <div className="spell-card-header">
        <div className="spell-icon-container">
          <img 
            src={getIconUrl(spellData.icon)}
            alt={spellData.name || 'Spell'}
            className="spell-icon"
          />
          {spellData.level && (
            <div className="spell-level">{spellData.level}</div>
          )}
        </div>
        <div className="spell-card-title">
          <h3>{spellData.name || 'Unnamed Spell'}</h3>
          <div className="spell-subtitle">
            {spellData.class && <span className="spell-class">{getClassName(spellData.class)}</span>}
            {spellData.spellType && <span className="spell-type">{getSpellTypeName(spellData.spellType)}</span>}
          </div>
        </div>
      </div>
      
      {spellData.description && (
        <p className="spell-description">{spellData.description}</p>
      )}
      
      <div className="spell-details">
        {/* Effect Type */}
        {spellData.selectedEffects && spellData.selectedEffects.length > 0 && (
          <div className="spell-detail">
            <span className="detail-label">Effect:</span>
            <span className="detail-value effect-type">
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/small/${getEffectTypeIcon(spellData.selectedEffects[0])}.jpg`}
                alt={spellData.selectedEffects[0]}
                className="effect-type-icon"
              />
              {spellData.selectedEffects.map(effect => 
                effect.charAt(0).toUpperCase() + effect.slice(1)
              ).join(', ')}
            </span>
          </div>
        )}
        
        {/* Targeting */}
        {spellData.targetingMode && (
          <div className="spell-detail">
            <span className="detail-label">Targeting:</span>
            <span className="detail-value">
              {getTargetingDisplay()}
            </span>
          </div>
        )}
        
        {/* Range */}
        {spellData.rangeType && (
          <div className="spell-detail">
            <span className="detail-label">Range:</span>
            <span className="detail-value">
              {getRangeDisplay()}
            </span>
          </div>
        )}
        
        {/* Attack Resolution */}
        {spellData.attackResolution && (
          <div className="spell-detail">
            <span className="detail-label">Resolution:</span>
            <span className="detail-value">
              {getAttackResolutionDisplay()}
            </span>
          </div>
        )}
        
        {/* Damage */}
        {spellData.selectedEffects && spellData.selectedEffects.includes('damage') && spellData.primaryDamage && (
          <div className="spell-detail">
            <span className="detail-label">Damage:</span>
            <span className="detail-value damage">
              {spellData.primaryDamage.dice || `${spellData.primaryDamage.flat || 0}`}
              {spellData.damageTypes && spellData.damageTypes.length > 0 && (
                <span className="damage-type"> {spellData.damageTypes[0]}</span>
              )}
            </span>
          </div>
        )}
        
        {/* Healing */}
        {spellData.selectedEffects && spellData.selectedEffects.includes('healing') && spellData.healing && (
          <div className="spell-detail">
            <span className="detail-label">Healing:</span>
            <span className="detail-value healing">
              {spellData.healing.dice || `${spellData.healing.flat || 0}`}
            </span>
          </div>
        )}
        
        {/* Persistent Effect (DoT/HoT) */}
        {spellData.isPersistent && (
          <div className="spell-detail">
            <span className="detail-label">
              {spellData.selectedEffects && spellData.selectedEffects.includes('damage') ? 'DoT:' : 'HoT:'}
            </span>
            <span className="detail-value dot-hot">
              {spellData.persistentTick || '1d4'} for {spellData.persistentDuration || 1} rounds
            </span>
          </div>
        )}
        
        {/* Resources */}
        {spellData.resourceCosts && Object.keys(spellData.resourceCosts).length > 0 && (
          <div className="spell-detail">
            <span className="detail-label">Cost:</span>
            <span className="detail-value">
              {getResourceCostsDisplay()}
            </span>
          </div>
        )}
        
        {/* Cooldown */}
        {spellData.cooldownCategory && (
          <div className="spell-detail">
            <span className="detail-label">Cooldown:</span>
            <span className="detail-value">
              {getCooldownDisplay()}
            </span>
          </div>
        )}
        
        {/* Duration */}
        {spellData.durationType && (
          <div className="spell-detail">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">
              {getDurationDisplay()}
            </span>
          </div>
        )}
        
        {/* Components */}
        {spellData.castingComponents && spellData.castingComponents.length > 0 && (
          <div className="spell-detail">
            <span className="detail-label">Components:</span>
            <span className="detail-value">
              {getCastingComponentsDisplay()}
            </span>
          </div>
        )}
        
        {/* Concentration */}
        {spellData.requiresConcentration && (
          <div className="spell-detail concentration">
            <span className="detail-label">Concentration:</span>
            <span className="detail-value">Required</span>
          </div>
        )}
      </div>
      
      {/* Tags */}
      {spellData.tags && spellData.tags.length > 0 && (
        <div className="spell-tags">
          {spellData.tags.map((tag, index) => (
            <span key={index} className="spell-tag">
              <img 
                src="https://wow.zamimg.com/images/wow/icons/small/inv_misc_note_06.jpg" 
                alt="" 
                className="tag-icon" 
              />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Spell type at the bottom */}
      <div className="spell-type-indicator">
        <span className={`spell-type ${getQualityClass()}`}>
          {spellData.spellType && getSpellTypeName(spellData.spellType)}
        </span>
        {spellData.selectedEffects && spellData.selectedEffects.length > 0 && (
          <span className={`spell-effect-type ${spellData.selectedEffects[0]}`}>
            {spellData.selectedEffects[0].charAt(0).toUpperCase() + spellData.selectedEffects[0].slice(1)}
          </span>
        )}
      </div>
    </div>
  );

  // Render the back content of the card
  const renderBackContent = () => (
    <div className={`card-content back-content ${isFlipped ? 'back-content' : ''}`}>
      <div className="spell-card-header">
        <div className="spell-icon-container">
          <img 
            src={getIconUrl(spellData.icon)}
            alt={spellData.name || 'Spell'}
            className="spell-icon"
          />
        </div>
        <div className="spell-card-title">
          <h3>{spellData.name || 'Unnamed Spell'}</h3>
          <div className="spell-subtitle">
            <span className="details-title">Additional Details</span>
          </div>
        </div>
      </div>
      
      {/* Visuals and Audio Section */}
      {shouldDisplaySection('visuals') && (
        <div className="card-section">
          <h4 className="section-title">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/small/spell_nature_starfall.jpg" 
              alt=""
              className="section-icon"
            />
            Visual Effects
          </h4>
          
          <div className="section-details">
            {spellData.visualTheme && (
              <div className="detail-row">
                <span className="detail-key">Theme:</span>
                <span className="detail-value">{getVisualThemeName(spellData.visualTheme)}</span>
              </div>
            )}
            
            {spellData.visualEffect && (
              <div className="detail-row">
                <span className="detail-key">Effect:</span>
                <span className="detail-value">{getVisualEffectName(spellData.visualEffect)}</span>
              </div>
            )}
            
            {spellData.animationTiming && (
              <div className="detail-row">
                <span className="detail-key">Timing:</span>
                <span className="detail-value">{getAnimationTimingName(spellData.animationTiming)}</span>
              </div>
            )}
            
            {spellData.soundCategory && (
              <div className="detail-row">
                <span className="detail-key">Sound:</span>
                <span className="detail-value">
                  {spellData.soundCategory}
                  {spellData.soundVariant && ` (${spellData.soundVariant})`}
                </span>
              </div>
            )}
          </div>
          
          {/* Visual descriptions */}
          {(spellData.castingDescription || spellData.effectDescription || spellData.impactDescription) && (
            <div className="visual-descriptions">
              {spellData.castingDescription && (
                <div className="visual-description-item">
                  <span className="visual-description-label">Casting: </span>
                  <span className="visual-description-text">{spellData.castingDescription}</span>
                </div>
              )}
              
              {spellData.effectDescription && (
                <div className="visual-description-item">
                  <span className="visual-description-label">Effect: </span>
                  <span className="visual-description-text">{spellData.effectDescription}</span>
                </div>
              )}
              
              {spellData.impactDescription && (
                <div className="visual-description-item">
                  <span className="visual-description-label">Impact: </span>
                  <span className="visual-description-text">{spellData.impactDescription}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Buff/Debuff Effects Section */}
      {(shouldDisplaySection('buffs') || shouldDisplaySection('debuffs')) && (
        <div className="card-section">
          <h4 className="section-title">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/small/spell_holy_divineprotection.jpg" 
              alt=""
              className="section-icon"
            />
            Status Effects
          </h4>
          
          {/* Primary stats */}
          {spellData.selectedPrimaryStats && spellData.selectedPrimaryStats.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Primary Stats:</span>
              <span className="detail-value">
                {spellData.selectedPrimaryStats.map(statId => {
                  const value = spellData.modifierValues?.[statId];
                  const type = spellData.modifierTypes?.[statId] === 'percentage' ? '%' : '';
                  return `${statId}${value ? ` ${value}${type}` : ''}`;
                }).join(', ')}
              </span>
            </div>
          )}
          
          {/* Secondary stats */}
          {spellData.selectedSecondaryStats && spellData.selectedSecondaryStats.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Secondary Stats:</span>
              <span className="detail-value">
                {spellData.selectedSecondaryStats.map(statId => {
                  const value = spellData.modifierValues?.[statId];
                  const type = spellData.modifierTypes?.[statId] === 'percentage' ? '%' : '';
                  return `${statId}${value ? ` ${value}${type}` : ''}`;
                }).join(', ')}
              </span>
            </div>
          )}
          
          {/* Positive effects */}
          {spellData.selectedPositiveEffects && spellData.selectedPositiveEffects.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Buffs:</span>
              <span className="detail-value">
                {spellData.selectedPositiveEffects.join(', ')}
              </span>
            </div>
          )}
          
          {/* Negative effects */}
          {spellData.selectedNegativeEffects && spellData.selectedNegativeEffects.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Debuffs:</span>
              <span className="detail-value">
                {spellData.selectedNegativeEffects.join(', ')}
              </span>
            </div>
          )}
          
          {/* Combat advantages */}
          {spellData.selectedAdvantages && spellData.selectedAdvantages.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Combat Effects:</span>
              <span className="detail-value">
                {spellData.selectedAdvantages.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Utility Effects Section */}
      {shouldDisplaySection('utility') && (
        <div className="card-section">
          <h4 className="section-title">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/small/inv_misc_gear_08.jpg" 
              alt=""
              className="section-icon"
            />
            Utility Effects
          </h4>
          
          {spellData.utilityType && (
            <div className="detail-row">
              <span className="detail-key">Type:</span>
              <span className="detail-value">{spellData.utilityType}</span>
            </div>
          )}
          
          {spellData.utilitySubtypes && spellData.utilitySubtypes.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Subtypes:</span>
              <span className="detail-value">
                {spellData.utilitySubtypes.join(', ')}
              </span>
            </div>
          )}
          
          {spellData.utilityDescription && (
            <div className="utility-description">
              {spellData.utilityDescription}
            </div>
          )}
        </div>
      )}
      
      {/* Combo System Section */}
      {shouldDisplaySection('comboSystem') && (
        <div className="card-section">
          <h4 className="section-title">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/small/ability_rogue_slicedice.jpg" 
              alt=""
              className="section-icon"
            />
            Combo System
          </h4>
          
          {spellData.comboRole && (
            <div className="detail-row">
              <span className="detail-key">Role:</span>
              <span className="detail-value">{getComboRoleName(spellData.comboRole)}</span>
            </div>
          )}
          
          {spellData.maxComboPoints && (
            <div className="detail-row">
              <span className="detail-key">Max Points:</span>
              <span className="detail-value">{spellData.maxComboPoints}</span>
            </div>
          )}
          
          {spellData.comboGenerator && spellData.comboGenerator.length > 0 && (
            <div className="detail-row">
              <span className="detail-key">Generation:</span>
              <span className="detail-value">
                {spellData.comboGenerator.join(', ')}
              </span>
            </div>
          )}
          
          {spellData.comboFinisher && (
            <div className="detail-row">
              <span className="detail-key">Finisher:</span>
              <span className="detail-value">{spellData.comboFinisher}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Flavor Text Section */}
      {spellData.flavorText && (
        <div className="spell-flavor">
          "{spellData.flavorText}"
        </div>
      )}
    </div>
  );

  return (
    <div 
      className={`spell-card-container ${isFlipped ? 'flipped' : ''}`} 
      onClick={handleCardFlip}
      style={{
        '--theme-color': getThemeColor(spellData.visualTheme),
        '--theme-color-transparent': `${getThemeColor(spellData.visualTheme)}40`,
        '--theme-glow': `${getThemeColor(spellData.visualTheme)}80`,
      }}
    >
      <div className="spell-card">
        <div className="flip-indicator">Click for details</div>
        <div className="card-content front-content">
          {renderFrontContent()}
        </div>
        <div className="card-content back-content">
          {renderBackContent()}
        </div>
      </div>
    </div>
  );
};

export default SpellPreview;