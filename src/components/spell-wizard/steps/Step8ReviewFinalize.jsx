import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview, StepNavigation } from '../common';
import { CopyIcon, SaveIcon, DownloadIcon, CheckCircleIcon, XCircleIcon, 
  InfoCircleIcon, AlertTriangleIcon, ExternalLinkIcon } from '../icons';

// Import styles
import '../styles/Layout/wizard-layout.css';
import '../styles/Components/preview-card.css';

// Utility functions for export formats
const exportFormatters = {
  json: (spellData) => {
    return JSON.stringify(spellData, null, 2);
  },
  
  markdown: (spellData) => {
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
  
  dnd5e: (spellData) => {
    const getDndLevel = (data) => {
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
  
  pathfinder: (spellData) => {
    const getPathfinderLevel = (data) => {
      // Convert D&D level to Pathfinder classes
      const dndLevel = (data) => {
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
      
      const level = dndLevel(data).match(/\d+/) ? dndLevel(data).match(/\d+/)[0] : '1';
      
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
  
  wow: (spellData) => {
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

// Helper functions
const getClassName = (classId) => {
  if (!classId) return '';
  
  const classMap = {
    'pyrofiend': 'Pyrofiend',
    'gambler': 'Gambler',
    'fateweaver': 'Fate Weaver',
    'stormbringer': 'Stormbringer',
    'berserker': 'Berserker',
    'shadowdancer': 'Shadowdancer',
    'elementalist': 'Elementalist'
  };
  
  return classMap[classId] || classId;
};

const getSpellTypeName = (typeId) => {
  if (!typeId) return '';
  
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

// Success Notification Component
const SuccessNotification = ({ show, message }) => {
  if (!show) return null;
  
  return (
    <div className="success-message">
      {message}
    </div>
  );
};

// Export Modal Component
const ExportModal = ({ 
  showModal, 
  onClose, 
  exportedData, 
  selectedFormat, 
  copyToClipboard 
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleCopy = useCallback(() => {
    copyToClipboard();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }, [copyToClipboard]);

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Export - {selectedFormat.toUpperCase()}</h4>
          <button 
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <pre>{exportedData}</pre>
        </div>
        
        <div className="modal-footer">
          <button 
            className={`nav-button ${copySuccess ? 'success' : ''}`}
            onClick={handleCopy}
          >
            <CopyIcon />
            {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          
          <a 
            className="nav-button"
            href={`data:text/${selectedFormat === 'json' ? 'json' : 'plain'};charset=utf-8,${encodeURIComponent(exportedData)}`}
            download={`${selectedFormat}-spell.${selectedFormat === 'json' ? 'json' : 'txt'}`}
          >
            <DownloadIcon />
            Download File
          </a>
          
          <button 
            className="nav-button next-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Step8ReviewFinalize = ({ prevStep }) => {
  const { spellData, isStepValid } = useSpellWizardStore();
  const [selectedExportFormat, setSelectedExportFormat] = useState('json');
  const [exportedData, setExportedData] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Check validation status for all steps
  const validationStatus = useMemo(() => ({
    basicInfo: isStepValid(0),
    castingMechanics: isStepValid(1),
    targetingRange: isStepValid(2),
    effectSystem: isStepValid(3),
    secondaryEffects: isStepValid(4),
    advancedMechanics: isStepValid(5),
    visualsAudio: isStepValid(6),
    reviewFinalize: true // Always true
  }), [isStepValid]);
  
  const allValid = useMemo(() => Object.values(validationStatus).every(status => status), [validationStatus]);
  
  // Handle export button click
  const handleExport = useCallback(() => {
    const exportFunction = exportFormatters[selectedExportFormat];
    if (exportFunction) {
      const formattedData = exportFunction(spellData);
      setExportedData(formattedData);
      setShowExportModal(true);
    }
  }, [selectedExportFormat, spellData]);
  
  // Handle save to spellbook
  const handleSaveToSpellbook = useCallback(() => {
    // In a real app, this would interact with a backend or storage API
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, []);
  
  // Copy exported data to clipboard
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(exportedData);
  }, [exportedData]);
  
  // Generate share link
  const handleGenerateShareLink = useCallback(() => {
    // In a real app, this would generate a unique link
    navigator.clipboard.writeText(`https://spellcreator.example.com/shared/${Math.random().toString(36).substring(2, 10)}`);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  }, []);

  // Format an index (0-7) to step name
  const getStepName = (index) => {
    const steps = [
      'Basic Info',
      'Casting Mechanics',
      'Targeting & Range',
      'Effect System',
      'Secondary Effects',
      'Advanced Mechanics',
      'Visuals & Audio',
      'Review & Finalize'
    ];
    return steps[index] || `Step ${index + 1}`;
  };
  
  return (
    <div className="wizard-layout">
      {/* Main Content Area */}
      <div className="wizard-main-content">
        <div className="review-finalize-container">
          <h2 className="section-title">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_book_11.jpg" 
              alt="" 
              className="section-icon" 
            />
            Review & Finalize
          </h2>
          
          <p className="section-description">
            Your spell creation is nearly complete! Review all aspects of your spell, 
            make any final adjustments, and choose how you want to save or export your creation.
          </p>
          
          {/* Validation Status Section */}
          <div className="section">
            <div className="section-title">
              <InfoCircleIcon className="section-icon" />
              Validation Status
            </div>
            
            <div className="validation-grid">
              {Object.entries(validationStatus).map(([key, isValid], index) => (
                <div 
                  key={key} 
                  className={`validation-item ${isValid ? 'valid' : 'invalid'}`}
                  title={isValid ? 'This section is complete' : 'This section needs attention'}
                >
                  <div className="status-icon">
                    {isValid ? 
                      <CheckCircleIcon /> : 
                      <XCircleIcon />
                    }
                  </div>
                  <div className="status-label">
                    {getStepName(index)}
                  </div>
                </div>
              ))}
            </div>
            
            {!allValid && (
              <div className="validation-message">
                Some sections of your spell are incomplete. You can still export or save, but consider reviewing the highlighted sections.
              </div>
            )}
          </div>
          
          {/* Export Options Section */}
          <div className="section">
            <div className="section-title">
              <DownloadIcon className="section-icon" />
              Export Options
            </div>
            
            <p className="section-description">
              Export your spell in various formats for use in different game systems or sharing with others.
            </p>
            
            <div className="export-field-selector">
              {Object.keys(exportFormatters).map((format) => (
                <div
                  key={format}
                  className={`export-field-option ${selectedExportFormat === format ? 'selected' : ''}`}
                  onClick={() => setSelectedExportFormat(format)}
                >
                  {format.toUpperCase()}
                </div>
              ))}
            </div>
            
            <div className="format-description">
              {selectedExportFormat === 'json' && (
                <p>Raw JSON data format for programmatic use or storage. Contains all spell data in a structured format.</p>
              )}
              {selectedExportFormat === 'markdown' && (
                <p>Markdown format for easy reading and sharing. Perfect for documentation or posting online.</p>
              )}
              {selectedExportFormat === 'dnd5e' && (
                <p>Formatted for D&D 5th Edition. Includes appropriate spell level, components, and other D&D-specific attributes.</p>
              )}
              {selectedExportFormat === 'pathfinder' && (
                <p>Formatted for Pathfinder RPG. Includes appropriate spell level, components, and Pathfinder-specific mechanics.</p>
              )}
              {selectedExportFormat === 'wow' && (
                <p>Formatted for World of Warcraft style. Includes appropriate spell school, cooldown, and WoW-specific attributes.</p>
              )}
            </div>
            
            <button className="export-button primary" onClick={handleExport}>
              <DownloadIcon className="button-icon" />
              Export as {selectedExportFormat.toUpperCase()}
            </button>
          </div>
          
          {/* Save Options Section */}
          <div className="section">
            <div className="section-title">
              <SaveIcon className="section-icon" />
              Save & Share Options
            </div>
            
            <p className="section-description">
              Save your spell to your personal collection or share it with others.
            </p>
            
            <div className="save-share-grid">
              <div className="save-option">
                <h5 className="save-option-title">Save to Spellbook</h5>
                <p>Save your spell to your personal collection for future editing or reference.</p>
                <button className="export-button" onClick={handleSaveToSpellbook}>
                  <SaveIcon className="button-icon" />
                  Save to Spellbook
                </button>
              </div>
              
              <div className="save-option">
                <h5 className="save-option-title">Generate Share Link</h5>
                <p>Create a link that you can share with others to view your spell creation.</p>
                <button className="export-button" onClick={handleGenerateShareLink}>
                  <ExternalLinkIcon className="button-icon" />
                  Generate Share Link
                </button>
              </div>
            </div>
          </div>
          
          {/* Spell Summary Section */}
          <div className="section">
            <div className="section-title">
              <InfoCircleIcon className="section-icon" />
              Spell Summary
            </div>
            
            <div className="summary-grid">
              <div className="summary-row">
                <span className="summary-label">Name:</span>
                <span className="summary-value">{spellData.name || 'Unnamed Spell'}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Type:</span>
                <span className="summary-value">{getSpellTypeName(spellData.spellType)}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Source:</span>
                <span className="summary-value">
                  {spellData.source === 'class' && getClassName(spellData.class)}
                  {spellData.source === 'monster' && spellData.monsterType}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Action Type:</span>
                <span className="summary-value">{spellData.actionType || 'Standard'}</span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Resource Costs:</span>
                <span className="summary-value">
                  {Object.entries(spellData.resourceCosts || {}).map(([resource, cost]) => 
                    `${resource}: ${cost.baseAmount}`
                  ).join(', ') || 'None'}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Range:</span>
                <span className="summary-value">
                  {spellData.rangeType || 'Self'} 
                  {spellData.rangeType === 'ranged' && spellData.range && ` (${spellData.range} ft)`}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Effect:</span>
                <span className="summary-value">{spellData.effectType || 'None'}</span>
              </div>
              
              {spellData.effectType === 'damage' && (
                <div className="summary-row">
                  <span className="summary-label">Damage:</span>
                  <span className="summary-value">
                    {spellData.primaryDamage?.diceCount || 0}
                    {spellData.primaryDamage?.diceType || 'd6'} + 
                    {spellData.primaryDamage?.flat || 0}
                  </span>
                </div>
              )}
              
              <div className="summary-row">
                <span className="summary-label">Tags:</span>
                <div className="summary-tags">
                  {(spellData.tags || []).map((tag, index) => (
                    <span key={index} className="summary-tag">{tag}</span>
                  ))}
                  {spellData.tags?.length === 0 && <span className="summary-value">None</span>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <StepNavigation 
            onPrevious={prevStep}
            showNext={false}
            isValid={true}
          />
        </div>
      </div>
      
      {/* Side Panel */}
      <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
      
      {/* Export Modal */}
      <ExportModal 
        showModal={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportedData={exportedData}
        selectedFormat={selectedExportFormat}
        copyToClipboard={copyToClipboard}
      />
      
      {/* Success Notifications */}
      <SuccessNotification 
        show={saveSuccess} 
        message="Spell successfully saved to your spellbook!" 
      />
      
      <SuccessNotification 
        show={shareSuccess} 
        message="Share link copied to clipboard!" 
      />
    </div>
  );
};

export default Step8ReviewFinalize;