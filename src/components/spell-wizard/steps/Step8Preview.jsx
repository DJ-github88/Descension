import React, { useState, useEffect } from 'react';
import { useSpellWizardStore } from '../../../store/spellWizardStore';
import { SpellPreview, StepNavigation } from '../common';
import '../styles/spell-wizard.css';
import { damageTypes } from '../../../data/damageTypes';
import { getAllStatusEffects } from '../../../data/statusEffects';

const Step8Preview = () => {
  const { spellData, updateSpellData, isStepValid } = useSpellWizardStore();
  
  // Local state
  const [exportFormat, setExportFormat] = useState('json');
  const [exportCode, setExportCode] = useState('');
  const [showExportCode, setShowExportCode] = useState(false);
  const [canFinalize, setCanFinalize] = useState(false);
  
  // Check if the spell can be finalized
  useEffect(() => {
    // All steps should be valid (except this preview step)
    const stepsValid = Object.entries(isStepValid)
      .filter(([key]) => key !== 'preview')
      .every(([_, valid]) => valid);
    
    // Name and description are required
    const hasName = spellData.name && spellData.name.trim().length > 0;
    const hasDescription = spellData.description && spellData.description.trim().length > 0;
    
    setCanFinalize(stepsValid && hasName && hasDescription);
  }, [spellData, isStepValid]);
  
  // Generate export code
  useEffect(() => {
    if (exportFormat === 'json') {
      setExportCode(JSON.stringify(spellData, null, 2));
    } else if (exportFormat === 'lua') {
      generateLuaCode();
    } else if (exportFormat === 'xml') {
      generateXmlCode();
    } else if (exportFormat === 'markdown') {
      generateMarkdownCode();
    }
  }, [exportFormat, spellData]);
  
  // Helper function to generate a spell ID
  const generateSpellId = () => {
    const cleanName = (spellData.name || 'spell').toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `spell_${cleanName}_${Date.now().toString(36)}`;
  };
  
  // Helper function to escape XML
  const escapeXml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  // Helper function to get class name
  const getClassName = (classId) => {
    const classMap = {
      'pyrofiend': 'Pyrofiend',
      'gambler': 'Gambler',
      'fateweaver': 'Fate Weaver',
      'primalist': 'Primalist',
      'berserker': 'Berserker',
      // Other classes would be mapped here
    };
    
    return classMap[classId] || classId;
  };
  
  // Helper function to get spell type name
  const getSpellTypeName = (typeId) => {
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual',
      'channeled': 'Channeled Ability'
    };
    
    return typeMap[typeId] || typeId;
  };
  
  // Generate Lua code
  const generateLuaCode = () => {
    // This is a simplified version - real implementation would be more complex
    let code = `-- ${spellData.name || 'Unnamed Spell'} Spell Definition\n`;
    code += `local spell = {\n`;
    code += `  id = "${generateSpellId()}",\n`;
    code += `  name = "${(spellData.name || '').replace(/"/g, '\\"')}",\n`;
    code += `  description = "${(spellData.description || '').replace(/"/g, '\\"')}",\n`;
    code += `  category = "${spellData.category || ''}",\n`;
    code += `  spellType = "${spellData.spellType || ''}",\n`;
    code += `  damageTypes = {${(spellData.damageTypes || []).map(t => `"${t}"`).join(', ')}},\n`;
    code += `  cooldown = ${spellData.cooldownValue || 0},\n`;
    code += `  resourceCost = ${JSON.stringify(spellData.resourceCosts || {})},\n`;
    
    // Add damage info if applicable
    if (spellData.primaryDamage?.dice || spellData.primaryDamage?.flat) {
      code += `  damage = {\n`;
      code += `    dice = "${spellData.primaryDamage?.dice || ''}",\n`;
      code += `    flat = ${spellData.primaryDamage?.flat || 0},\n`;
      code += `    isDot = ${spellData.isDot || false},\n`;
      code += `    dotDuration = ${spellData.dotDuration || 0}\n`;
      code += `  },\n`;
    }
    
    // Add healing info if applicable
    if (spellData.healing?.dice || spellData.healing?.flat) {
      code += `  healing = {\n`;
      code += `  healing = {\n`;
      code += `    dice = "${spellData.healing?.dice || ''}",\n`;
      code += `    flat = ${spellData.healing?.flat || 0},\n`;
      code += `    isHoT = ${spellData.healing?.isHoT || false},\n`;
      code += `    hotDuration = ${spellData.healing?.hotDuration || 0}\n`;
      code += `  },\n`;
    }
    
    // Add other properties
    code += `  range = ${spellData.range || 0},\n`;
    code += `  castTime = ${spellData.castTimeValue || 0},\n`;
    code += `  targeting = "${spellData.targetingMode || 'single'}",\n`;
    
    // Close the table
    code += `}\n\n`;
    code += `return spell`;
    
    setExportCode(code);
  };
  
  // Generate XML code
  const generateXmlCode = () => {
    let code = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    code += `<Spell id="${generateSpellId()}">\n`;
    code += `  <Name>${escapeXml(spellData.name || '')}</Name>\n`;
    code += `  <Description>${escapeXml(spellData.description || '')}</Description>\n`;
    code += `  <Category>${escapeXml(spellData.category || '')}</Category>\n`;
    code += `  <SpellType>${escapeXml(spellData.spellType || '')}</SpellType>\n`;
    
    // Add damage types
    code += `  <DamageTypes>\n`;
    (spellData.damageTypes || []).forEach(damageType => {
      code += `    <DamageType>${escapeXml(damageType)}</DamageType>\n`;
    });
    code += `  </DamageTypes>\n`;
    
    // Add resource costs
    code += `  <ResourceCosts>\n`;
    Object.entries(spellData.resourceCosts || {}).forEach(([resource, cost]) => {
      code += `    <ResourceCost type="${escapeXml(resource)}" amount="${cost.baseAmount}"/>\n`;
    });
    code += `  </ResourceCosts>\n`;
    
    // Add damage if applicable
    if (spellData.primaryDamage?.dice || spellData.primaryDamage?.flat) {
      code += `  <Damage>\n`;
      code += `    <Dice>${escapeXml(spellData.primaryDamage?.dice || '')}</Dice>\n`;
      code += `    <Flat>${spellData.primaryDamage?.flat || 0}</Flat>\n`;
      if (spellData.isDot) {
        code += `    <IsDot>true</IsDot>\n`;
        code += `    <DotDuration>${spellData.dotDuration || 0}</DotDuration>\n`;
      }
      code += `  </Damage>\n`;
    }
    
    // Add healing if applicable
    if (spellData.healing?.dice || spellData.healing?.flat) {
      code += `  <Healing>\n`;
      code += `    <Dice>${escapeXml(spellData.healing?.dice || '')}</Dice>\n`;
      code += `    <Flat>${spellData.healing?.flat || 0}</Flat>\n`;
      if (spellData.healing?.isHoT) {
        code += `    <IsHoT>true</IsHoT>\n`;
        code += `    <HotDuration>${spellData.healing?.hotDuration || 0}</HotDuration>\n`;
      }
      code += `  </Healing>\n`;
    }
    
    // Add other properties
    code += `  <Range>${spellData.range || 0}</Range>\n`;
    code += `  <CastTime>${spellData.castTimeValue || 0}</CastTime>\n`;
    code += `  <Cooldown>${spellData.cooldownValue || 0}</Cooldown>\n`;
    code += `  <Targeting>${escapeXml(spellData.targetingMode || 'single')}</Targeting>\n`;
    
    // Add visual effects
    code += `  <Visuals>\n`;
    code += `    <Theme>${escapeXml(spellData.visualTheme || '')}</Theme>\n`;
    code += `    <Effect>${escapeXml(spellData.visualEffect || '')}</Effect>\n`;
    code += `    <Description>${escapeXml(spellData.effectDescription || '')}</Description>\n`;
    code += `  </Visuals>\n`;
    
    // Close the XML
    code += `</Spell>`;
    
    setExportCode(code);
  };
  
  // Generate Markdown description
  const generateMarkdownCode = () => {
    let code = `# ${spellData.name || 'Unnamed Spell'}\n\n`;
    
    // Class or monster type
    if (spellData.source === 'class' && spellData.class) {
      code += `*${getClassName(spellData.class)} ${getSpellTypeName(spellData.spellType || '')
}*\n\n`;
    } else if (spellData.source === 'monster' && spellData.monsterType) {
      code += `*${spellData.monsterType} Ability*\n\n`;
    }
    
    // Description
    code += `${spellData.description || ''}\n\n`;
    
    // Core mechanics
    code += `## Mechanics\n\n`;
    
    // Cast Time
    code += `**Cast Time:** `;
    if (spellData.castTimeType === 'instant') {
      code += 'Instant';
    } else if (spellData.castTimeType === 'channeled') {
      code += `Channeled (up to ${spellData.channelMaxTime} seconds)`;
    } else {
      code += `${spellData.castTimeValue} seconds`;
    }
    code += '\n\n';
    
    // Cooldown
    code += `**Cooldown:** `;
    if (spellData.cooldownCategory === 'instant') {
      code += 'None';
    } else if (spellData.cooldownCategory === 'encounter') {
      code += 'Once per encounter';
    } else if (spellData.cooldownCategory === 'daily') {
      code += 'Once per day/rest';
    } else {
      code += `${spellData.cooldownValue} ${spellData.cooldownUnit || 'seconds'}`;
    }
    code += '\n\n';
    
    // Range
    code += `**Range:** `;
    if (spellData.rangeType === 'self') {
      code += 'Self';
    } else if (spellData.rangeType === 'touch') {
      code += 'Touch';
    } else if (spellData.rangeType === 'melee') {
      code += 'Melee (5 ft)';
    } else if (spellData.rangeType === 'global') {
      code += 'Global';
    } else if (spellData.rangeType === 'ranged') {
      code += `${spellData.range} ft`;
    }
    code += '\n\n';
    
    // Resource Cost
    if (spellData.resourceCosts) {
      code += `**Cost:** `;
      const costs = [];
      
      Object.entries(spellData.resourceCosts).forEach(([resource, cost]) => {
        if (cost.baseAmount > 0) {
          if (resource === 'health') {
            costs.push(`${cost.baseAmount} Health`);
          } else {
            costs.push(`${cost.baseAmount} ${resource}`);
          }
        }
      });
      
      code += costs.join(', ') || 'None';
      code += '\n\n';
    }
    
    // Targeting
    code += `**Targeting:** ${spellData.targetingMode === 'aoe' ? 'Area of Effect' : 'Single Target'}`;
    if (spellData.targetingMode === 'aoe' && spellData.aoeShape) {
      const shapeMap = {
        'circle': 'Circle',
        'cone': 'Cone',
        'line': 'Line',
        'custom': 'Custom'
      };
      code += ` (${shapeMap[spellData.aoeShape] || spellData.aoeShape}, ${spellData.aoeSize} ft)`;
    }
    code += '\n\n';
    
    // Effects section
    code += `## Effects\n\n`;
    
    // Damage
    if (spellData.primaryDamage?.dice || spellData.primaryDamage?.flat) {
      code += `**Damage:** `;
      
      const diceStr = spellData.primaryDamage.dice;
      const flatDmg = spellData.primaryDamage.flat;
      
      if (diceStr && flatDmg) {
        code += `${diceStr} + ${flatDmg}`;
      } else if (diceStr) {
        code += diceStr;
      } else if (flatDmg) {
        code += flatDmg;
      }
      
      if (spellData.damageTypes && spellData.damageTypes.length > 0) {
        code += ` ${spellData.damageTypes.join('/')} damage`;
      }
      
      if (spellData.isDot) {
        code += ` over ${spellData.dotDuration} rounds`;
      }
      
      code += '\n\n';
    }
    
    // Healing
    if (spellData.healing?.dice || spellData.healing?.flat) {
      code += `**Healing:** `;
      
      const diceStr = spellData.healing.dice;
      const flatHeal = spellData.healing.flat;
      
      if (diceStr && flatHeal) {
        code += `${diceStr} + ${flatHeal}`;
      } else if (diceStr) {
        code += diceStr;
      } else if (flatHeal) {
        code += flatHeal;
      }
      
      if (spellData.healing.isHoT) {
        code += ` over ${spellData.healing.hotDuration} rounds`;
      }
      
      code += '\n\n';
    }
    
    // Buffs
    if (spellData.buffs && spellData.buffs.length > 0) {
      code += `**Buffs:** `;
      const allEffects = getAllStatusEffects();
      const buffNames = spellData.buffs.map(buffId => {
        const buff = allEffects.find(e => e.id === buffId);
        return buff ? buff.name : buffId;
      }).join(', ');
      code += `${buffNames}\n\n`;
    }
    
    // Debuffs
    if (spellData.debuffs && spellData.debuffs.length > 0) {
      code += `**Debuffs:** `;
      const allEffects = getAllStatusEffects();
      const debuffNames = spellData.debuffs.map(debuffId => {
        const debuff = allEffects.find(e => e.id === debuffId);
        return debuff ? debuff.name : debuffId;
      }).join(', ');
      code += `${debuffNames}\n\n`;
    }
    
    // Triggers
    if ((spellData.onHitTriggers && spellData.onHitTriggers.length > 0) || 
        (spellData.onDamageTriggers && spellData.onDamageTriggers.length > 0)) {
      code += `## Triggers\n\n`;
      
      if (spellData.onHitTriggers && spellData.onHitTriggers.length > 0) {
        code += `**On Hit:**\n\n`;
        spellData.onHitTriggers.forEach(trigger => {
          code += `- ${trigger.chance < 100 ? `${trigger.chance}% chance: ` : ''}${trigger.effect}${trigger.duration > 0 ? ` for ${trigger.duration} rounds` : ''}\n`;
        });
        code += '\n';
      }
      
      if (spellData.onDamageTriggers && spellData.onDamageTriggers.length > 0) {
        code += `**On Damage Taken:**\n\n`;
        spellData.onDamageTriggers.forEach(trigger => {
          code += `- ${trigger.chance < 100 ? `${trigger.chance}% chance: ` : ''}${trigger.effect}${trigger.duration > 0 ? ` for ${trigger.duration} rounds` : ''}\n`;
        });
        code += '\n';
      }
    }
    
    // Aura effects
    if (spellData.auraEffects && spellData.auraEffects.length > 0) {
      code += `## Aura Effects\n\n`;
      
      spellData.auraEffects.forEach(aura => {
        const targetText = aura.target === 'allies' ? 'Allies' : 
                          aura.target === 'enemies' ? 'Enemies' : 
                          'All creatures';
        
        code += `**${aura.name}:** ${aura.effect} (Affects: ${targetText} within ${aura.range} ft)\n\n`;
      });
    }
    
    // Visual and sound effects
    if (spellData.effectDescription || spellData.soundDescription || spellData.animationDescription) {
      code += `## Visual & Sound Effects\n\n`;
      
      if (spellData.effectDescription) {
        code += `**Visual:** ${spellData.effectDescription}\n\n`;
      }
      
      if (spellData.soundDescription) {
        code += `**Sound:** ${spellData.soundDescription}\n\n`;
      }
      
      if (spellData.animationDescription) {
        code += `**Animation:** ${spellData.animationDescription}\n\n`;
      }
    }
    
    // Flavor text
    if (spellData.flavorText) {
      code += `---\n\n*${spellData.flavorText}*`;
    }
    
    setExportCode(code);
  };
  
  // Handle export format change
  const handleExportFormatChange = (format) => {
    setExportFormat(format);
  };
  
  // Toggle export code visibility
  const handleShowExportCode = () => {
    setShowExportCode(prev => !prev);
  };
  
  // Finalize the spell (save to spellbook)
  const handleFinalize = () => {
    // Create a completed spell object
    const finalSpell = {
      ...spellData,
      id: generateSpellId(),
      createdAt: new Date().toISOString()
    };
    
    // In a real implementation, you would:
    // 1. Add the spell to the spellbook store
    // 2. Save to local storage or database
    // 3. Show success message
    // 4. Reset wizard or redirect
    
    // For now, just trigger an event that parent components can listen for
    const event = new CustomEvent('spellFinalized', { detail: finalSpell });
    window.dispatchEvent(event);
    
    // Show success message
    alert('Spell successfully added to your spellbook!');
  };
  
  return (
    <div className="preview-step">
      <div className="section spell-preview-section">
        <h4 className="section-title">Spell Preview</h4>
        <p className="section-description">
          Review your spell before finalizing it.
        </p>
        
        <SpellPreview spellData={spellData} />
      </div>
      
      <div className="section export-section">
        <h4 className="section-title">Export Options</h4>
        <p className="section-description">
          Export your spell in various formats for use in different systems.
        </p>
        
        <div className="export-format-options">
          <div className="format-options">
            <button 
              className={`format-option ${exportFormat === 'json' ? 'selected' : ''}`}
              onClick={() => handleExportFormatChange('json')}
            >
              JSON
            </button>
            <button 
              className={`format-option ${exportFormat === 'lua' ? 'selected' : ''}`}
              onClick={() => handleExportFormatChange('lua')}
            >
              Lua
            </button>
            <button 
              className={`format-option ${exportFormat === 'xml' ? 'selected' : ''}`}
              onClick={() => handleExportFormatChange('xml')}
            >
              XML
            </button>
            <button 
              className={`format-option ${exportFormat === 'markdown' ? 'selected' : ''}`}
              onClick={() => handleExportFormatChange('markdown')}
            >
              Markdown
            </button>
          </div>
          
          <button 
            className="show-export-btn"
            onClick={handleShowExportCode}
          >
            {showExportCode ? 'Hide Code' : 'Show Export Code'}
          </button>
        </div>
        
        {showExportCode && (
          <div className="export-code">
            <pre>{exportCode}</pre>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText(exportCode)}>
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
      
      {/* Finalize Section */}
      <div className="finalize-section">
        <h4 className="section-title">Finalize Your Spell</h4>
        <p className="section-description">
          When you're satisfied with your spell, add it to your spellbook to make it available in-game.
        </p>
        
        <div className="completion-status">
          <h5>Completion Status</h5>
          <div className="status-list">
            {!spellData.name && (
              <div className="status-item incomplete">
                <span className="status-icon">⚠️</span>
                <span className="status-text">Missing spell name</span>
              </div>
            )}
            
            {!spellData.description && (
              <div className="status-item incomplete">
                <span className="status-icon">⚠️</span>
                <span className="status-text">Missing description</span>
              </div>
            )}
            
            {!canFinalize && !spellData.name && !spellData.description && (
              <div className="status-item incomplete">
                <span className="status-icon">ℹ️</span>
                <span className="status-text">Some required settings are missing</span>
              </div>
            )}
            
            {canFinalize && (
              <div className="status-item complete">
                <span className="status-icon">✓</span>
                <span className="status-text">Spell is ready to be finalized</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          className={`finalize-btn ${canFinalize ? 'enabled' : 'disabled'}`}
          onClick={handleFinalize}
          disabled={!canFinalize}
        >
          Add to Spellbook
        </button>
        
        {!canFinalize && (
          <div className="finalize-warning">
            {!spellData.name ? (
              <p>Please provide a spell name to continue.</p>
            ) : !spellData.description ? (
              <p>Please provide a spell description to continue.</p>
            ) : (
              <p>Please complete all required steps to finalize this spell.</p>
            )}
          </div>
        )}
      </div>
      <StepNavigation 
        currentStep={7} 
        totalSteps={8} 
        onNext={() => {/* navigation to create/save spell */}} 
        onPrev={() => {/* navigate to previous step */}} 
        isNextEnabled={canFinalize}
      />
    </div>
  );
};

export default Step8Preview;