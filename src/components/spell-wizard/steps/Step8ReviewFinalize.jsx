import React, { useState } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview, StepNavigation } from '../common';
import '../styles/spell-wizard.css';
import '../styles/spell-wizard-layout.css';

const Step8ReviewFinalize = ({ prevStep }) => {
  const { spellData, isStepValid } = useSpellWizardStore();
  const [selectedExportFormat, setSelectedExportFormat] = useState('json');
  const [exportedData, setExportedData] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Check validation status for all steps
  const validationStatus = {
    basicInfo: isStepValid(0),
    castingMechanics: isStepValid(1),
    targetingRange: isStepValid(2),
    effectSystem: isStepValid(3),
    secondaryEffects: isStepValid(4),
    advancedMechanics: isStepValid(5),
    visualsAudio: isStepValid(6),
    reviewFinalize: true // Always true
  };
  
  const allValid = Object.values(validationStatus).every(status => status);
  
  // Format specific export formats
  const exportFormats = {
    json: () => {
      return JSON.stringify(spellData, null, 2);
    },
    markdown: () => {
      return `# ${spellData.name || 'Unnamed Spell'}
      
## Description
${spellData.description || 'No description provided.'}

## Casting
**Action Type:** ${spellData.actionType || 'Standard'}
**Resource Cost:** ${Object.entries(spellData.resourceCosts || {})
  .map(([resource, cost]) => `${resource}: ${cost}`)
  .join(', ') || 'None'}
**Components:** ${(spellData.castingComponents || []).join(', ') || 'None'}
${spellData.requiresConcentration ? '**Concentration Required**' : ''}

## Targeting
**Range:** ${spellData.rangeType || 'Self'} ${spellData.rangeType === 'ranged' ? `(${spellData.range || 30} ft)` : ''}
**Targeting Mode:** ${spellData.targetingMode || 'Single'}
**Target Types:** ${(spellData.targetTypes || []).join(', ') || 'Any'}
${spellData.aoeShape ? `**Area of Effect:** ${spellData.aoeShape} (${spellData.aoeSize} ft)` : ''}

## Effects
**Primary Effect:** ${spellData.effectType || 'None'}
${spellData.effectType === 'damage' ? `
**Damage:** ${spellData.primaryDamage?.diceCount || 0}${spellData.primaryDamage?.diceType || 'd6'} + ${spellData.primaryDamage?.flat || 0}
**Damage Types:** ${(spellData.damageTypes || []).join(', ') || 'Physical'}
` : ''}
${spellData.isPersistent ? `
**Persistent Effect:** ${spellData.persistentTick || '1d6'} per round for ${spellData.persistentDuration || 1} rounds
` : ''}

${spellData.flavorText ? `> *${spellData.flavorText}*` : ''}

## Tags
${(spellData.tags || []).join(', ') || 'None'}
`;
    },
    dnd5e: () => {
      return `# ${spellData.name || 'Unnamed Spell'}
*${getDndLevel(spellData)} ${getDndSchool(spellData)}*

**Casting Time:** ${getDndCastingTime(spellData)}
**Range:** ${getDndRange(spellData)}
**Components:** ${getDndComponents(spellData)}
**Duration:** ${getDndDuration(spellData)}

${spellData.description || 'No description provided.'}

${spellData.effectType === 'damage' ? `
**At Higher Levels:** When you cast this spell using a spell slot of ${parseInt(getDndLevel(spellData).charAt(0), 10) + 1} level or higher, the damage increases by ${spellData.primaryDamage?.diceCount || 1}${spellData.primaryDamage?.diceType || 'd6'} for each slot level above ${getDndLevel(spellData).charAt(0)}.
` : ''}

${spellData.flavorText ? `*${spellData.flavorText}*` : ''}
`;
    },
    pathfinder: () => {
      return `# ${spellData.name || 'Unnamed Spell'}
*${getPathfinderLevel(spellData)}*

**Casting Time** ${getPathfinderCastingTime(spellData)}
**Components** ${getPathfinderComponents(spellData)}
**Range** ${getPathfinderRange(spellData)}
**Targets** ${getPathfinderTargets(spellData)}
**Duration** ${getPathfinderDuration(spellData)}
**Saving Throw** ${getPathfinderSave(spellData)}; **Spell Resistance** ${spellData.saveType ? 'yes' : 'no'}

${spellData.description || 'No description provided.'}

${spellData.flavorText ? `*${spellData.flavorText}*` : ''}
`;
    },
    wow: () => {
      return `# ${spellData.name || 'Unnamed Spell'}
${getWowSchool(spellData)}

**Casting Time:** ${getWowCastingTime(spellData)}
**Cooldown:** ${getWowCooldown(spellData)}
**Resource Cost:** ${Object.entries(spellData.resourceCosts || {})
  .map(([resource, cost]) => `${resource}: ${cost}`)
  .join(', ') || 'None'}
**Range:** ${spellData.range || 30} yards
**Targets:** ${getWowTargets(spellData)}

${spellData.description || 'No description provided.'}

${spellData.effectType === 'damage' ? `
**Damage:** ${((spellData.primaryDamage?.diceCount || 1) * parseInt((spellData.primaryDamage?.diceType || 'd6').replace('d', ''), 10) / 2 + (spellData.primaryDamage?.flat || 0)).toFixed(0)} ${(spellData.damageTypes || [])[0] || 'Physical'} damage
` : ''}

${spellData.flavorText ? `"${spellData.flavorText}"` : ''}
`;
    }
  };
  
  // Helper functions for D&D 5e format
  const getDndLevel = (data) => {
    // Simplified logic: determine level based on damage dice
    if (data.effectType === 'damage') {
      const diceTotal = (data.primaryDamage?.diceCount || 1) * 
        parseInt((data.primaryDamage?.diceType || 'd6').replace('d', ''), 10);
      
      if (diceTotal <= 8) return '1st-level';
      if (diceTotal <= 16) return '2nd-level';
      if (diceTotal <= 24) return '3rd-level';
      if (diceTotal <= 36) return '4th-level';
      if (diceTotal <= 48) return '5th-level';
      return '6th-level';
    }
    return 'Cantrip';
  };
  
  const getDndSchool = (data) => {
    const schoolMap = {
      'damage': 'evocation',
      'healing': 'conjuration',
      'buff': 'abjuration',
      'debuff': 'necromancy',
      'utility': 'transmutation'
    };
    return schoolMap[data.effectType] || 'evocation';
  };
  
  const getDndCastingTime = (data) => {
    const actionMap = {
      'action': '1 action',
      'bonus': '1 bonus action',
      'reaction': '1 reaction',
      'channeled': `${data.channelMaxRounds || 1} action(s)`
    };
    return actionMap[data.actionType] || '1 action';
  };
  
  const getDndRange = (data) => {
    if (data.rangeType === 'self') return 'Self';
    if (data.rangeType === 'touch') return 'Touch';
    if (data.aoeShape) {
      return `Self (${data.aoeSize || 20}-foot ${data.aoeShape})`;
    }
    return `${data.range || 30} feet`;
  };
  
  const getDndComponents = (data) => {
    const components = [];
    if ((data.castingComponents || []).includes('verbal')) components.push('V');
    if ((data.castingComponents || []).includes('somatic')) components.push('S');
    if ((data.castingComponents || []).includes('material')) {
      if (data.materialComponents) {
        components.push(`M (${data.materialComponents})`);
      } else {
        components.push('M');
      }
    }
    return components.join(', ') || 'None';
  };
  
  const getDndDuration = (data) => {
    if (data.requiresConcentration) {
      return `Concentration, up to ${data.durationRounds || 1} ${data.durationRounds === 1 ? 'round' : 'rounds'}`;
    }
    if (data.isPersistent) {
      return `${data.persistentDuration || 1} ${data.persistentDuration === 1 ? 'round' : 'rounds'}`;
    }
    return 'Instantaneous';
  };
  
  // Helper functions for Pathfinder format
  const getPathfinderLevel = (data) => {
    // Convert D&D level to Pathfinder classes
    const dndLevel = getDndLevel(data);
    const level = dndLevel.match(/\d+/) ? dndLevel.match(/\d+/)[0] : '1';
    
    // Based on effect type, assign appropriate classes
    const classMap = {
      'damage': `sorcerer/wizard ${level}, cleric ${level}`,
      'healing': `cleric ${level}, druid ${level}`,
      'buff': `bard ${level}, cleric ${level}, sorcerer/wizard ${level}`,
      'debuff': `sorcerer/wizard ${level}, witch ${level}`,
      'utility': `bard ${level}, sorcerer/wizard ${level}, druid ${level}`
    };
    
    return classMap[data.effectType] || `sorcerer/wizard ${level}`;
  };
  
  const getPathfinderCastingTime = (data) => {
    const actionMap = {
      'action': '1 standard action',
      'bonus': '1 swift action',
      'reaction': '1 immediate action',
      'channeled': `${data.channelMaxRounds || 1} full round action(s)`
    };
    return actionMap[data.actionType] || '1 standard action';
  };
  
  const getPathfinderComponents = (data) => {
    return getDndComponents(data); // Same as D&D
  };
  
  const getPathfinderRange = (data) => {
    if (data.rangeType === 'self') return 'Personal';
    if (data.rangeType === 'touch') return 'Touch';
    return `${data.range || 30} ft.`;
  };
  
  const getPathfinderTargets = (data) => {
    if (data.targetingMode === 'self') return 'You';
    
    const targetTypeText = {
      'enemy': 'One or more creatures',
      'ally': 'One or more allies',
      'object': 'One or more objects',
      'location': 'One point in space'
    };
    
    if (data.aoeShape) {
      return `${data.aoeSize || 20}-ft. ${data.aoeShape}`;
    }
    
    return (data.targetTypes || []).map(type => targetTypeText[type] || 'One target').join(' or ') || 'One target';
  };
  
  const getPathfinderDuration = (data) => {
    if (data.isPersistent) {
      return `${data.persistentDuration || 1} ${data.persistentDuration === 1 ? 'round' : 'rounds'}`;
    }
    return 'Instantaneous';
  };
  
  const getPathfinderSave = (data) => {
    if (!data.saveType) return 'None';
    
    // Map D&D saves to Pathfinder
    const saveMap = {
      'strength': 'Fortitude negates',
      'dexterity': 'Reflex half',
      'constitution': 'Fortitude negates',
      'intelligence': 'Will negates',
      'wisdom': 'Will negates',
      'charisma': 'Will negates'
    };
    
    return saveMap[data.saveType.toLowerCase()] || 'None';
  };
  
  // Helper functions for WoW format
  const getWowSchool = (data) => {
    const schoolMap = {
      'damage': (data.damageTypes || [])[0] === 'fire' ? 'Fire spell' : 
                (data.damageTypes || [])[0] === 'cold' ? 'Frost spell' :
                (data.damageTypes || [])[0] === 'lightning' ? 'Nature spell' :
                (data.damageTypes || [])[0] === 'poison' ? 'Nature spell' :
                (data.damageTypes || [])[0] === 'necrotic' ? 'Shadow spell' :
                (data.damageTypes || [])[0] === 'radiant' ? 'Holy spell' : 'Arcane spell',
      'healing': 'Holy spell',
      'buff': 'Arcane spell',
      'debuff': 'Shadow spell',
      'utility': 'Arcane spell'
    };
    return schoolMap[data.effectType] || 'Arcane spell';
  };
  
  const getWowCastingTime = (data) => {
    if (data.castTimeValue) {
      return `${data.castTimeValue} sec cast`;
    }
    return 'Instant cast';
  };
  
  const getWowCooldown = (data) => {
    if (data.cooldownValue) {
      return `${data.cooldownValue} ${data.cooldownCategory || 'sec'}`;
    }
    return 'No cooldown';
  };
  
  const getWowTargets = (data) => {
    if (data.targetingMode === 'self') return 'Self';
    
    const targetMap = {
      'single': 'Single target',
      'multiple': 'Multiple targets',
      'aoe': 'Area of Effect'
    };
    
    return targetMap[data.targetingMode] || 'Single target';
  };
  
  // Handle export button click
  const handleExport = () => {
    const exportFunction = exportFormats[selectedExportFormat];
    if (exportFunction) {
      const formattedData = exportFunction();
      setExportedData(formattedData);
      setShowExportModal(true);
    }
  };
  
  // Handle save to spellbook
  const handleSaveToSpellbook = () => {
    // In a real app, this would interact with a backend or storage API
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  // Copy exported data to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportedData);
  };
  
  return (
    <div className="wizard-step review-finalize">
      <h2>Review and Finalize</h2>
      
      <div className="section">
        <div className="section-title">Validation Status</div>
        <div className="validation-grid">
          <div className={`validation-item ${validationStatus.basicInfo ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.basicInfo ? '✓' : '⚠'}</div>
            <div className="status-label">Basic Information</div>
          </div>
          <div className={`validation-item ${validationStatus.castingMechanics ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.castingMechanics ? '✓' : '⚠'}</div>
            <div className="status-label">Casting Mechanics</div>
          </div>
          <div className={`validation-item ${validationStatus.targetingRange ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.targetingRange ? '✓' : '⚠'}</div>
            <div className="status-label">Targeting and Range</div>
          </div>
          <div className={`validation-item ${validationStatus.effectSystem ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.effectSystem ? '✓' : '⚠'}</div>
            <div className="status-label">Effect System</div>
          </div>
          <div className={`validation-item ${validationStatus.secondaryEffects ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.secondaryEffects ? '✓' : '⚠'}</div>
            <div className="status-label">Secondary Effects</div>
          </div>
          <div className={`validation-item ${validationStatus.advancedMechanics ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.advancedMechanics ? '✓' : '⚠'}</div>
            <div className="status-label">Advanced Mechanics</div>
          </div>
          <div className={`validation-item ${validationStatus.visualsAudio ? 'valid' : 'invalid'}`}>
            <div className="status-icon">{validationStatus.visualsAudio ? '✓' : '⚠'}</div>
            <div className="status-label">Visuals and Audio</div>
          </div>
        </div>
        
        {!allValid && (
          <div className="validation-message">
            Some sections of your spell are incomplete. You can still export or save, but consider reviewing the highlighted sections.
          </div>
        )}
      </div>
      
      <div className="section">
        <div className="section-title">Spell Preview</div>
        <div className="spell-preview-container">
          <SpellPreview spellData={spellData} />
        </div>
      </div>
      
      <div className="section">
        <div className="section-title">Export Options</div>
        <div className="export-selector">
          <div className="export-format-options">
            <div 
              className={`export-format-option ${selectedExportFormat === 'json' ? 'selected' : ''}`}
              onClick={() => setSelectedExportFormat('json')}
            >
              <span className="format-name">JSON</span>
              <span className="format-description">Raw data format for programming use</span>
            </div>
            <div 
              className={`export-format-option ${selectedExportFormat === 'markdown' ? 'selected' : ''}`}
              onClick={() => setSelectedExportFormat('markdown')}
            >
              <span className="format-name">Markdown</span>
              <span className="format-description">Formatted text for documentation</span>
            </div>
            <div 
              className={`export-format-option ${selectedExportFormat === 'dnd5e' ? 'selected' : ''}`}
              onClick={() => setSelectedExportFormat('dnd5e')}
            >
              <span className="format-name">D&D 5e</span>
              <span className="format-description">Compatible with D&D 5th Edition</span>
            </div>
            <div 
              className={`export-format-option ${selectedExportFormat === 'pathfinder' ? 'selected' : ''}`}
              onClick={() => setSelectedExportFormat('pathfinder')}
            >
              <span className="format-name">Pathfinder</span>
              <span className="format-description">Compatible with Pathfinder RPG</span>
            </div>
            <div 
              className={`export-format-option ${selectedExportFormat === 'wow' ? 'selected' : ''}`}
              onClick={() => setSelectedExportFormat('wow')}
            >
              <span className="format-name">World of Warcraft</span>
              <span className="format-description">Compatible with WoW-style systems</span>
            </div>
          </div>
        </div>
        
        <div className="export-actions">
          <button 
            className="nav-button export-button"
            onClick={handleExport}
          >
            Export Spell
          </button>
          
          <button 
            className="nav-button save-button primary"
            onClick={handleSaveToSpellbook}
          >
            Save to Spellbook
          </button>
          
          {saveSuccess && (
            <div className="success-message">
              Spell saved to your spellbook!
            </div>
          )}
        </div>
      </div>
      
      {showExportModal && (
        <div className="export-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>Export - {selectedExportFormat.toUpperCase()}</h4>
              <button 
                className="close-button"
                onClick={() => setShowExportModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <pre>{exportedData}</pre>
            </div>
            
            <div className="modal-footer">
              <button 
                className="nav-button"
                onClick={copyToClipboard}
              >
                Copy to Clipboard
              </button>
              
              <button 
                className="nav-button"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <StepNavigation 
        onPrevious={prevStep}
        showNext={false}
        isValid={true}
      />
    </div>
  );
};

export default Step8ReviewFinalize;