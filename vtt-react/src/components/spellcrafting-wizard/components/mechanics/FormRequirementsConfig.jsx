import React, { useState } from 'react';
import { 
  getForm, 
  getFormsForClass,
  canCastSpellInForm,
  applyFormModifiersToSpell
} from '../../core/mechanics/stanceFormSystem';
import { FaInfoCircle, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/FormRequirementsConfig.css';

const FormRequirementsConfig = ({ formRequirements, onChange, spellConfig }) => {
  const [selectedClass, setSelectedClass] = useState('DRUID');
  const [showInfo, setShowInfo] = useState(false);
  
  // Available classes with forms
  const availableClasses = [
    { id: 'DRUID', name: 'Druid' },
    { id: 'WARRIOR', name: 'Warrior' },
    { id: 'ROGUE', name: 'Rogue' },
    { id: 'PRIEST', name: 'Priest' }
  ];
  
  // Get forms for the selected class
  const classForms = getFormsForClass(selectedClass);
  
  // Handle adding a required form
  const handleAddRequiredForm = (formId) => {
    if (formRequirements.requiredForms.includes(formId)) return;
    
    onChange({
      ...formRequirements,
      requiredForms: [...formRequirements.requiredForms, formId],
      modifiedByForms: true
    });
  };
  
  // Handle removing a required form
  const handleRemoveRequiredForm = (formId) => {
    onChange({
      ...formRequirements,
      requiredForms: formRequirements.requiredForms.filter(id => id !== formId)
    });
  };
  
  // Handle adding a restricted form
  const handleAddRestrictedForm = (formId) => {
    if (formRequirements.restrictedForms.includes(formId)) return;
    
    onChange({
      ...formRequirements,
      restrictedForms: [...formRequirements.restrictedForms, formId]
    });
  };
  
  // Handle removing a restricted form
  const handleRemoveRestrictedForm = (formId) => {
    onChange({
      ...formRequirements,
      restrictedForms: formRequirements.restrictedForms.filter(id => id !== formId)
    });
  };
  
  // Toggle info panel
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  
  // Check if a spell can be cast in a form
  const checkFormCompatibility = (formId) => {
    const form = getForm(formId);
    if (!form || !spellConfig) return { compatible: true };
    
    return {
      compatible: canCastSpellInForm(spellConfig, form),
      form
    };
  };
  
  // Preview spell modifications in a form
  const previewFormModifications = (formId) => {
    const form = getForm(formId);
    if (!form || !spellConfig) return null;
    
    const modifiedSpell = applyFormModifiersToSpell(spellConfig, form);
    
    // Calculate differences
    const differences = [];
    
    // Check damage differences
    if (spellConfig.damageConfig && modifiedSpell.damageConfig) {
      const originalMultiplier = spellConfig.damageConfig.damageMultiplier || 1;
      const modifiedMultiplier = modifiedSpell.damageConfig.damageMultiplier || 1;
      
      if (originalMultiplier !== modifiedMultiplier) {
        const percentChange = ((modifiedMultiplier / originalMultiplier) - 1) * 100;
        differences.push({
          type: 'damage',
          change: percentChange > 0 ? `+${percentChange.toFixed(0)}%` : `${percentChange.toFixed(0)}%`,
          positive: percentChange > 0
        });
      }
    }
    
    // Check healing differences
    if (spellConfig.healingConfig && modifiedSpell.healingConfig) {
      const originalMultiplier = spellConfig.healingConfig.healingMultiplier || 1;
      const modifiedMultiplier = modifiedSpell.healingConfig.healingMultiplier || 1;
      
      if (originalMultiplier !== modifiedMultiplier) {
        const percentChange = ((modifiedMultiplier / originalMultiplier) - 1) * 100;
        differences.push({
          type: 'healing',
          change: percentChange > 0 ? `+${percentChange.toFixed(0)}%` : `${percentChange.toFixed(0)}%`,
          positive: percentChange > 0
        });
      }
    }
    
    // Check resource differences
    if (spellConfig.resourceConfig && modifiedSpell.resourceConfig) {
      if (spellConfig.resourceConfig.primaryResource !== modifiedSpell.resourceConfig.primaryResource) {
        differences.push({
          type: 'resource',
          change: `Changed from ${spellConfig.resourceConfig.primaryResource} to ${modifiedSpell.resourceConfig.primaryResource}`,
          positive: true
        });
      }
      
      if (spellConfig.resourceConfig.cost !== modifiedSpell.resourceConfig.cost) {
        const percentChange = ((spellConfig.resourceConfig.cost - modifiedSpell.resourceConfig.cost) / spellConfig.resourceConfig.cost) * 100;
        differences.push({
          type: 'cost',
          change: percentChange > 0 ? `${percentChange.toFixed(0)}% less` : `${Math.abs(percentChange).toFixed(0)}% more`,
          positive: percentChange > 0
        });
      }
    }
    
    return differences.length > 0 ? differences : null;
  };
  
  if (!formRequirements) return null;
  
  return (
    <div className="form-requirements-config">
      <div className="form-header">
        <h3>Form/Stance Requirements</h3>
        <button className="info-button" onClick={toggleInfo}>
          <FaInfoCircle /> Info
        </button>
      </div>
      
      {showInfo && (
        <div className="form-info-panel">
          <h4>About Forms and Stances</h4>
          <p>Forms and stances are special states that characters can enter, which modify their abilities and the spells they can cast.</p>
          <h5>Common Forms:</h5>
          <ul>
            <li><strong>Druid Forms:</strong> Bear Form, Cat Form, Moonkin Form, Tree of Life</li>
            <li><strong>Warrior Stances:</strong> Battle Stance, Defensive Stance, Berserker Stance</li>
            <li><strong>Other:</strong> Stealth (Rogue), Shadowform (Priest)</li>
          </ul>
          <p>Forms can affect your spell in several ways:</p>
          <ul>
            <li>Required Forms: The spell can only be cast in these forms</li>
            <li>Restricted Forms: The spell cannot be cast in these forms</li>
            <li>Modified Effects: The spell's effects may be enhanced or reduced in certain forms</li>
          </ul>
        </div>
      )}
      
      <div className="form-content">
        <div className="form-section">
          <h4>Class Selection</h4>
          <p className="section-description">Select a class to view available forms and stances</p>
          
          <div className="class-selector">
            {availableClasses.map(classInfo => (
              <button
                key={classInfo.id}
                className={`class-button ${selectedClass === classInfo.id ? 'active' : ''}`}
                onClick={() => setSelectedClass(classInfo.id)}
              >
                {classInfo.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h4>Available Forms</h4>
          <p className="section-description">Select forms to add as requirements or restrictions</p>
          
          <div className="forms-list">
            {classForms.length === 0 ? (
              <div className="empty-list">No forms available for this class</div>
            ) : (
              <div className="form-grid">
                {classForms.map(form => {
                  const compatibility = checkFormCompatibility(form.id);
                  const modifications = previewFormModifications(form.id);
                  
                  return (
                    <div 
                      key={form.id} 
                      className={`form-card ${!compatibility.compatible ? 'incompatible' : ''}`}
                      style={{ borderColor: form.color }}
                    >
                      <div className="form-card-header" style={{ backgroundColor: form.color }}>
                        <h5>{form.name}</h5>
                        <div className="form-actions">
                          <button 
                            className="form-action-button require"
                            onClick={() => handleAddRequiredForm(form.id)}
                            disabled={formRequirements.requiredForms.includes(form.id)}
                            title="Add as required form"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="form-action-button restrict"
                            onClick={() => handleAddRestrictedForm(form.id)}
                            disabled={formRequirements.restrictedForms.includes(form.id)}
                            title="Add as restricted form"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                      
                      <div className="form-card-content">
                        <p className="form-description">{form.description}</p>
                        
                        <div className="form-details">
                          <div className="form-detail">
                            <span className="detail-label">Resource:</span>
                            <span className="detail-value">{form.resourceType}</span>
                          </div>
                          
                          {form.comboPointSystem && (
                            <div className="form-detail">
                              <span className="detail-label">Combo System:</span>
                              <span className="detail-value">{form.comboPointSystem}</span>
                            </div>
                          )}
                          
                          {!compatibility.compatible && (
                            <div className="form-compatibility-warning">
                              <FaExclamationTriangle /> Incompatible with spell types
                            </div>
                          )}
                          
                          {modifications && (
                            <div className="form-modifications">
                              <h6>Effect Modifications:</h6>
                              <ul>
                                {modifications.map((mod, index) => (
                                  <li key={index} className={mod.positive ? 'positive' : 'negative'}>
                                    {mod.type}: {mod.change}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h4>Required Forms</h4>
          <p className="section-description">The spell can only be cast in these forms</p>
          
          <div className="selected-forms">
            {formRequirements.requiredForms.length === 0 ? (
              <div className="empty-list">No required forms selected</div>
            ) : (
              <div className="selected-forms-list">
                {formRequirements.requiredForms.map(formId => {
                  const form = getForm(formId);
                  if (!form) return null;
                  
                  return (
                    <div key={formId} className="selected-form-item" style={{ borderLeftColor: form.color }}>
                      <div className="selected-form-info">
                        <span className="selected-form-name">{form.name}</span>
                        <span className="selected-form-description">{form.description}</span>
                      </div>
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveRequiredForm(formId)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-section">
          <h4>Restricted Forms</h4>
          <p className="section-description">The spell cannot be cast in these forms</p>
          
          <div className="selected-forms">
            {formRequirements.restrictedForms.length === 0 ? (
              <div className="empty-list">No restricted forms selected</div>
            ) : (
              <div className="selected-forms-list">
                {formRequirements.restrictedForms.map(formId => {
                  const form = getForm(formId);
                  if (!form) return null;
                  
                  return (
                    <div key={formId} className="selected-form-item" style={{ borderLeftColor: form.color }}>
                      <div className="selected-form-info">
                        <span className="selected-form-name">{form.name}</span>
                        <span className="selected-form-description">{form.description}</span>
                      </div>
                      <button 
                        className="remove-button"
                        onClick={() => handleRemoveRestrictedForm(formId)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRequirementsConfig;
