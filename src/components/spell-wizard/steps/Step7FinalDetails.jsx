import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import '../styles/spell-wizard.css';
import { StepNavigation } from '../common';

// Spell tag categories (from original Step9Advanced)
const SPELL_TAGS = [
  { id: 'offensive', name: 'Offensive', description: 'Spell that directly deals damage or harms targets' },
  { id: 'defensive', name: 'Defensive', description: 'Spell that protects or reduces incoming damage' },
  { id: 'utility', name: 'Utility', description: 'Spell with practical uses outside of direct combat' },
  { id: 'healing', name: 'Healing', description: 'Spell that restores health or cures conditions' },
  { id: 'control', name: 'Control', description: 'Spell that restricts enemy movement or actions' },
  { id: 'mobility', name: 'Mobility', description: 'Spell that enhances movement or positioning' },
  { id: 'buff', name: 'Buff', description: 'Spell that enhances allies\' abilities or stats' },
  { id: 'debuff', name: 'Debuff', description: 'Spell that weakens enemies\' abilities or stats' },
  { id: 'aoe', name: 'Area of Effect', description: 'Spell that affects multiple targets in an area' },
  { id: 'dot', name: 'Damage over Time', description: 'Spell that deals damage continuously over time' },
  { id: 'hot', name: 'Healing over Time', description: 'Spell that heals continuously over time' },
  { id: 'channeled', name: 'Channeled', description: 'Spell that requires concentration to maintain' },
  { id: 'summon', name: 'Summoning', description: 'Spell that calls creatures or objects to aid you' },
  { id: 'transformation', name: 'Transformation', description: 'Spell that changes form or properties' },
  { id: 'ritual', name: 'Ritual', description: 'Spell that takes extended time to cast but is powerful' }
];

// Spell complexity levels (from original Step9Advanced)
const COMPLEXITY_LEVELS = [
  { id: 'basic', name: 'Basic', description: 'Simple to understand and use, suitable for beginners' },
  { id: 'intermediate', name: 'Intermediate', description: 'More options and interactions, good for experienced players' },
  { id: 'advanced', name: 'Advanced', description: 'Complex mechanics requiring good knowledge of game systems' },
  { id: 'expert', name: 'Expert', description: 'Intricate interactions and timing, for mastery-level players' }
];

// Tooltip content types (from original Step9Advanced)
const TOOLTIP_CONTENT = [
  { id: 'simple', name: 'Simple', description: 'Basic information only (name, type, brief description)' },
  { id: 'standard', name: 'Standard', description: 'Normal amount of information for most spells' },
  { id: 'detailed', name: 'Detailed', description: 'Extended information including all mechanics and interactions' },
  { id: 'custom', name: 'Custom', description: 'Fully customized tooltip content' }
];

const Step7FinalDetails = () => {
  const { spellData, updateSpellData, setStepValidation, isStepValid } = useSpellWizardStore();
  
  // Local state
  const [selectedTags, setSelectedTags] = useState(spellData.tags || []);
  const [complexity, setComplexity] = useState(spellData.complexity || 'intermediate');
  const [tooltipType, setTooltipType] = useState(spellData.tooltipType || 'standard');
  const [customTooltip, setCustomTooltip] = useState(spellData.customTooltip || '');
  const [interruptible, setInterruptible] = useState(spellData.interruptible !== false);
  const [locksCasting, setLocksCasting] = useState(spellData.locksCasting || false);
  const [usableWhileMoving, setUsableWhileMoving] = useState(spellData.usableWhileMoving !== false);
  const [requiresLoS, setRequiresLoS] = useState(spellData.requiresLoS !== false);
  const [hasTravelTime, setHasTravelTime] = useState(spellData.hasTravelTime || false);
  const [projectileSpeed, setProjectileSpeed] = useState(spellData.projectileSpeed || 30);
  const [customNotes, setCustomNotes] = useState(spellData.customNotes || '');
  
  // Validation (this step is always valid - all fields are optional)
  useEffect(() => {
    setStepValidation(6, true);
    
    // Update spell data with current values
    updateSpellData({
      tags: selectedTags,
      complexity,
      tooltipType,
      customTooltip,
      interruptible,
      locksCasting,
      usableWhileMoving,
      requiresLoS,
      hasTravelTime,
      projectileSpeed: hasTravelTime ? Number(projectileSpeed) : 0,
      customNotes
    });
  }, [
    selectedTags,
    complexity,
    tooltipType,
    customTooltip,
    interruptible,
    locksCasting,
    usableWhileMoving,
    requiresLoS,
    hasTravelTime,
    projectileSpeed,
    customNotes,
    setStepValidation,
    updateSpellData
  ]);
  
  // Toggle a tag selection
  const toggleTag = (tagId) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  // Handle complexity selection
  const handleComplexitySelect = (complexityId) => {
    setComplexity(complexityId);
  };
  
  // Handle tooltip type selection
  const handleTooltipTypeSelect = (tooltipId) => {
    setTooltipType(tooltipId);
  };
  
  // Handle projectile speed change
  const handleProjectileSpeedChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setProjectileSpeed(value);
    }
  };
  
  // Auto-suggest tags based on previous selections
  const getSuggestedTags = () => {
    const suggestions = [];
    
    // Add category-based tags
    if (spellData.category) {
      switch (spellData.category) {
        case 'damage':
          suggestions.push('offensive');
          break;
        case 'healing':
          suggestions.push('healing');
          break;
        case 'buff':
          suggestions.push('buff');
          break;
        case 'debuff':
          suggestions.push('debuff');
          break;
        case 'utility':
          suggestions.push('utility');
          break;
      }
    }
    
    // Add targeting-based tags
    if (spellData.targetingMode === 'aoe') {
      suggestions.push('aoe');
    }
    
    // Add mechanic-based tags
    if (spellData.isDot) {
      suggestions.push('dot');
    }
    
    if (spellData.healing?.isHoT) {
      suggestions.push('hot');
    }
    
    if (spellData.castTimeType === 'channeled') {
      suggestions.push('channeled');
    }
    
    // Add range-based tags
    if (spellData.rangeType === 'self') {
      suggestions.push('defensive');
    }
    
    if (spellData.rangeType === 'melee') {
      suggestions.push('offensive');
    }
    
    // Add advanced behavior tags
    if (spellData.advancedBehaviors) {
      if (spellData.advancedBehaviors.includes('transformation_effect')) {
        suggestions.push('transformation');
      }
      
      if (spellData.advancedBehaviors.includes('charge_system')) {
        suggestions.push('channeled');
      }
    }
    
    // Return unique suggestions
    return [...new Set(suggestions)];
  };
  
  // Auto-suggest complexity based on spell mechanics
  const getSuggestedComplexity = () => {
    let complexityScore = 0;
    
    // Count complexity-increasing features
    if (spellData.isDot) complexityScore += 1;
    if (spellData.healing?.isHoT) complexityScore += 1;
    if (spellData.onHitTriggers?.length > 0) complexityScore += 1;
    if (spellData.onDamageTriggers?.length > 0) complexityScore += 1;
    if (spellData.auraEffects?.length > 0) complexityScore += 1;
    if (spellData.advancedBehaviors?.length > 0) complexityScore += spellData.advancedBehaviors.length;
    if (spellData.costScalingType === 'variable') complexityScore += 1;
    if (spellData.castTimeType === 'channeled' || spellData.castTimeType === 'charged') complexityScore += 1;
    
    // Map score to complexity level
    if (complexityScore >= 5) return 'expert';
    if (complexityScore >= 3) return 'advanced';
    if (complexityScore >= 1) return 'intermediate';
    return 'basic';
  };
  
  // Generate tooltip preview based on type
  const generateTooltipPreview = () => {
    if (tooltipType === 'custom' && customTooltip) {
      // If custom tooltip, use that directly (with placeholders replaced)
      let preview = customTooltip;
      
      // Replace placeholders with actual values
      preview = preview.replace('{DAMAGE}', spellData.primaryDamage?.dice || '');
      preview = preview.replace('{HEALING}', spellData.healing?.dice || '');
      preview = preview.replace('{DURATION}', spellData.durationRounds || '0');
      preview = preview.replace('{COST}', 'Resource Cost');
      preview = preview.replace('{COOLDOWN}', spellData.cooldownValue || '0');
      
      return preview;
    }
    
    // Default tooltip preview based on type
    let tooltipContent = '';
    
    // Name and type always included
    tooltipContent += `${spellData.name || 'Unnamed Spell'}\n`;
    
    if (spellData.source === 'class' && spellData.class) {
      tooltipContent += `${spellData.class} ${spellData.spellType || ''}\n`;
    } else if (spellData.source === 'monster' && spellData.monsterType) {
      tooltipContent += `${spellData.monsterType} Ability\n`;
    }
    
    // Description
    tooltipContent += `\n${spellData.description || 'No description'}\n`;
    
    // Simple tooltips stop here
    if (tooltipType === 'simple') return tooltipContent;
    
    // Standard and detailed add mechanics
    tooltipContent += `\nCost: [Resource costs]\n`;
    tooltipContent += `Cooldown: ${spellData.cooldownValue || 0} ${spellData.cooldownUnit || 'seconds'}\n`;
    tooltipContent += `Cast Time: ${spellData.castTimeValue || 'Instant'}\n`;
    
    if (spellData.primaryDamage?.dice || spellData.primaryDamage?.flat) {
      tooltipContent += `Damage: ${spellData.primaryDamage.dice || ''} ${spellData.primaryDamage.flat ? `+ ${spellData.primaryDamage.flat}` : ''}\n`;
    }
    
    if (spellData.healing?.dice || spellData.healing?.flat) {
      tooltipContent += `Healing: ${spellData.healing.dice || ''} ${spellData.healing.flat ? `+ ${spellData.healing.flat}` : ''}\n`;
    }
    
    // Detailed tooltips add even more info
    if (tooltipType === 'detailed') {
      if (spellData.buffs && spellData.buffs.length > 0) {
        tooltipContent += `\nBuffs: ${spellData.buffs.join(', ')}\n`;
      }
      
      if (spellData.debuffs && spellData.debuffs.length > 0) {
        tooltipContent += `Debuffs: ${spellData.debuffs.join(', ')}\n`;
      }
      
      if (spellData.isDot) {
        tooltipContent += `DoT: ${spellData.dotTick} damage per tick for ${spellData.dotDuration} rounds\n`;
      }
      
      if (spellData.healing?.isHoT) {
        tooltipContent += `HoT: ${spellData.healing.hotTick} healing per tick for ${spellData.healing.hotDuration} rounds\n`;
      }
      
      // Add flavor text for detailed tooltips
      if (spellData.flavorText) {
        tooltipContent += `\n"${spellData.flavorText}"\n`;
      }
    }
    
    return tooltipContent;
  };
  
  // Get suggested tags and complexity
  const suggestedTags = getSuggestedTags();
  const suggestedComplexity = getSuggestedComplexity();
  
  // Generate tooltip preview
  const tooltipPreview = generateTooltipPreview();
  
  return (
    <div className="final-details-step">
      <div className="section">
        <h4 className="section-title">Spell Tags</h4>
        <p className="section-description">
          Add tags to categorize your spell. These help with searching, filtering, and organization.
        </p>
        
        {/* Auto-suggested tags */}
        {suggestedTags.length > 0 && (
          <div className="suggested-tags">
            <h5>Suggested Tags:</h5>
            <div className="tag-suggestions">
              {suggestedTags.map(tagId => {
                const tag = SPELL_TAGS.find(t => t.id === tagId);
                if (!tag) return null;
                
                return (
                  <div 
                    key={tagId}
                    className={`suggested-tag ${selectedTags.includes(tagId) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tagId)}
                  >
                    {tag.name}
                  </div>
                );
              })}
            </div>
            <div className="suggestion-hint">
              Click on suggested tags to add them to your spell. These are based on your previous selections.
            </div>
          </div>
        )}
        
        <div className="tags-container">
          {SPELL_TAGS.map(tag => (
            <div 
              key={tag.id}
              className={`tag-option ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
              onClick={() => toggleTag(tag.id)}
            >
              <div className="tag-name">{tag.name}</div>
              <div className="tag-description">{tag.description}</div>
            </div>
          ))}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="selected-tags">
            <h5>Selected Tags:</h5>
            <div className="tag-list">
              {selectedTags.map(tagId => {
                const tag = SPELL_TAGS.find(t => t.id === tagId);
                if (!tag) return null;
                
                return (
                  <div key={tagId} className="selected-tag">
                    <span>{tag.name}</span>
                    <button 
                      className="remove-tag-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(tagId);
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="section">
        <h4 className="section-title">Spell Complexity</h4>
        <p className="section-description">
          Define how complex your spell is to understand and use effectively.
        </p>
        
        {/* Complexity recommendation */}
        <div className="complexity-recommendation">
          <div className="recommendation-header">
            <span className="recommendation-icon">📊</span>
            <span>Recommended Complexity: </span>
            <span className="recommendation-value">
              {COMPLEXITY_LEVELS.find(c => c.id === suggestedComplexity)?.name || 'Intermediate'}
            </span>
          </div>
          <p className="recommendation-reason">
            Based on your spell's mechanics and interactions
          </p>
        </div>
        
        <div className="complexity-options">
          {COMPLEXITY_LEVELS.map(level => (
            <div 
              key={level.id}
              className={`complexity-option ${complexity === level.id ? 'selected' : ''}`}
              onClick={() => handleComplexitySelect(level.id)}
            >
              <div className="complexity-name">{level.name}</div>
              <div className="complexity-description">{level.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Casting Mechanics</h4>
        <p className="section-description">
          Configure advanced options for how your spell is cast and behaves.
        </p>
        
        <div className="casting-options">
          <div className="option-row">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="interruptible"
                checked={interruptible}
                onChange={() => setInterruptible(prev => !prev)}
              />
              <label htmlFor="interruptible">Interruptible</label>
              <div className="option-description">
                If checked, damage taken while casting may interrupt the spell.
              </div>
            </div>
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="locks-casting"
                checked={locksCasting}
                onChange={() => setLocksCasting(prev => !prev)}
              />
              <label htmlFor="locks-casting">Locks Casting</label>
              <div className="option-description">
                If checked, player cannot cast other spells while this is active.
              </div>
            </div>
          </div>
          
          <div className="option-row">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="usable-moving"
                checked={usableWhileMoving}
                onChange={() => setUsableWhileMoving(prev => !prev)}
              />
              <label htmlFor="usable-moving">Usable While Moving</label>
              <div className="option-description">
                If checked, caster can move while casting this spell.
              </div>
            </div>
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="requires-los"
                checked={requiresLoS}
                onChange={() => setRequiresLoS(prev => !prev)}
              />
              <label htmlFor="requires-los">Requires Line of Sight</label>
              <div className="option-description">
                If checked, caster must have line of sight to the target.
              </div>
            </div>
          </div>
          
          <div className="option-row">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="travel-time"
                checked={hasTravelTime}
                onChange={() => setHasTravelTime(prev => !prev)}
              />
              <label htmlFor="travel-time">Has Projectile Travel Time</label>
              <div className="option-description">
                If checked, spell effect takes time to reach the target after casting.
              </div>
            </div>
            
            {hasTravelTime && (
              <div className="option-input-group">
                <label>Projectile Speed (feet/second):</label>
                <input
                  type="number"
                  min="1"
                  value={projectileSpeed}
                  onChange={handleProjectileSpeedChange}
                  className="projectile-speed-input"
                />
                <div className="speed-examples">
                  <span>Examples: </span>
                  <span>Slow: 15-25</span>
                  <span>Medium: 30-50</span>
                  <span>Fast: 60-100+</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Tooltip Information</h4>
        <p className="section-description">
          Configure how much information to display in the spell's tooltip.
        </p>
        
        <div className="tooltip-options">
          {TOOLTIP_CONTENT.map(option => (
            <div 
              key={option.id}
              className={`tooltip-option ${tooltipType === option.id ? 'selected' : ''}`}
              onClick={() => handleTooltipTypeSelect(option.id)}
            >
              <div className="tooltip-name">{option.name}</div>
              <div className="tooltip-description">{option.description}</div>
            </div>
          ))}
        </div>
        
        {tooltipType === 'custom' && (
          <div className="custom-tooltip-section">
            <label>Custom Tooltip Content:</label>
            <textarea
              value={customTooltip}
              onChange={(e) => setCustomTooltip(e.target.value)}
              placeholder="Enter your custom tooltip content..."
              className="custom-tooltip-input"
              rows={5}
            />
            <div className="tooltip-hints">
              <p>You can use the following placeholders in your tooltip:</p>
              <ul>
                <li><code>{'{DAMAGE}'}</code>: Shows the spell's damage</li>
                <li><code>{'{HEALING}'}</code>: Shows the spell's healing</li>
                <li><code>{'{DURATION}'}</code>: Shows effect duration</li>
                <li><code>{'{COST}'}</code>: Shows resource cost</li>
                <li><code>{'{COOLDOWN}'}</code>: Shows cooldown time</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Tooltip Preview */}
        <div className="tooltip-preview">
          <h5>Tooltip Preview</h5>
          <div className="tooltip-preview-box">
            <pre>{tooltipPreview}</pre>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Custom Notes</h4>
        <p className="section-description">
          Add any additional notes or information about your spell.
        </p>
        
        <textarea
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
          placeholder="Enter any additional notes, implementation details, or special considerations..."
          className="custom-notes-input"
          rows={5}
        />
      </div>
      
      {/* Overall Completion Status */}
      <div className="completion-status">
        <h4>Spell Creation Progress</h4>
        <div className="progress-overview">
          {Object.entries(isStepValid).map(([stepKey, isValid]) => {
            const getStepName = (key) => {
              const stepMap = {
                'origin': 'Origin & Identity',
                'category': 'Primary Function',
                'resources': 'Resource System',
                'damage': 'Damage & Healing',
                'effects': 'Secondary Effects',
                'visuals': 'Visual & Audio',
                'advanced': 'Final Details',
                'preview': 'Preview'
              };
              return stepMap[key] || key;
            };
            
            return (
              <div key={stepKey} className={`progress-item ${isValid ? 'complete' : 'incomplete'}`}>
                <div className="progress-icon">{isValid ? '✓' : '○'}</div>
                <div className="progress-label">{getStepName(stepKey)}</div>
              </div>
            );
          })}
        </div>
        <div className="next-step-hint">
          Once you're satisfied with your spell, proceed to the final Preview step to review and export your creation.
        </div>
      </div>
    </div>
  );
};

export default Step7FinalDetails;