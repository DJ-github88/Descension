import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import {
  calculateActionPoints,
  calculateManaCost,
  calculateClassResourceCost,
  getResourceDescription
} from '../../core/mechanics/resourceManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faExclamationTriangle,
  faGem,
  faBolt,
  faFire,
  faLeaf,
  faMoon,
  faSun,
  faSkull,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import SimpleFormulaHelp from '../common/SimpleFormulaHelp';
import { Form, Card, Alert, Row, Col, Button, Badge } from 'react-bootstrap';
import SpellComponentsSelector from '../common/SpellComponentsSelector';
import '../../styles/resources.css';

const Step5Resources = () => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [calculatedResources, setCalculatedResources] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Initialize spell components from state or with defaults
  const [spellComponents, setSpellComponents] = useState({
    components: state.resourceCost.components || [],
    materialComponents: state.resourceCost.materialComponents || '',
    verbalText: state.resourceCost.verbalText || '',
    somaticText: state.resourceCost.somaticText || ''
  });

  // Initialize resource types and formulas
  const [selectedResources, setSelectedResources] = useState(
    state.resourceCost.resourceTypes || [state.resourceCost.primaryResourceType || 'mana']
  );

  // Action points are now treated as a regular resource type
  const actionPointsSelected = selectedResources.includes('actionPoints') ||
    (state.resourceCost.actionPoints !== undefined && state.resourceCost.actionPoints > 0);

  // Track which resources use formulas
  const [useFormulas, setUseFormulas] = useState(state.resourceCost.useFormulas || {});

  // Track resource values
  const [resourceValues, setResourceValues] = useState(state.resourceCost.resourceValues || {});

  // Track resource formulas
  const [resourceFormulas, setResourceFormulas] = useState(state.resourceCost.resourceFormulas || {});

  // Track which formula example dropdown is open
  const [openFormulaDropdown, setOpenFormulaDropdown] = useState(null);

  // Track formula help popup state
  const [showFormulaHelp, setShowFormulaHelp] = useState(false);
  const [activeResourceType, setActiveResourceType] = useState(null);

  // Resource types available in the system
  const resourceTypes = [
    { id: 'actionPoints', name: 'Action Points', description: 'Basic action economy', icon: faBolt },
    { id: 'mana', name: 'Mana', description: 'Standard magical energy', icon: faGem },
    { id: 'rage', name: 'Rage', description: 'Built through combat actions', icon: faFire },
    { id: 'energy', name: 'Energy', description: 'Regenerates quickly', icon: faBolt },
    { id: 'focus', name: 'Focus', description: 'Used for precise abilities', icon: faLeaf },
    { id: 'soul_shards', name: 'Soul Shards', description: 'Collected from enemies', icon: faSkull },
    { id: 'holy_power', name: 'Holy Power', description: 'Divine power source', icon: faSun },
    { id: 'astral_power', name: 'Astral Power', description: 'Cosmic energy', icon: faMoon },
  ];

  // Formula examples for different resource types
  const formulaExamples = {
    mana: [
      { name: '20% of max mana', formula: '0.2 * max_mana' },
      { name: '10% of current mana', formula: '0.1 * current_mana' },
      { name: 'Level × 5', formula: 'level * 5' },
      { name: 'Spell power / 2', formula: 'spell_power / 2' }
    ],
    rage: [
      { name: '10 + 5 per level', formula: '10 + (level * 5)' },
      { name: '25% of max rage', formula: '0.25 * max_rage' },
      { name: 'Current health / 10', formula: 'current_health / 10' }
    ],
    energy: [
      { name: '15 + agility / 2', formula: '15 + (agility / 2)' },
      { name: '40 - haste%', formula: '40 - haste_percent' }
    ],
    focus: [
      { name: '30 + target distance / 2', formula: '30 + (target_distance / 2)' },
      { name: '15 * targets_hit', formula: '15 * targets_hit' }
    ],
    soul_shards: [
      { name: 'Random 1-3 shards', formula: '1d3' },
      { name: '1 + crit_chance / 25', formula: '1 + (crit_chance / 25)' }
    ],
    holy_power: [
      { name: 'Enemies within 10yd / 2', formula: 'enemies_nearby / 2' },
      { name: 'Healing done / 1000', formula: 'healing_done / 1000' }
    ],
    astral_power: [
      { name: 'Time of day factor', formula: 'time_factor * 20' },
      { name: 'Nature damage taken / 5', formula: 'nature_damage_taken / 5' }
    ]
  };

  // Calculate base resources on component mount and when relevant state changes
  useEffect(() => {
    const baseCalculation = {
      actionPoints: selectedResources.includes('actionPoints') ? calculateActionPoints(state) : 0,
      mana: calculateManaCost(state),
      classResource: state.resourceCost.primaryResourceType ?
        calculateClassResourceCost(state, state.resourceCost.primaryResourceType) : 0
    };

    setCalculatedResources(baseCalculation);

    // Check for potential balance issues
    const newWarnings = validateResourceConfiguration(state, baseCalculation);
    setWarnings(newWarnings);
  }, [
    selectedResources,
    state.effectTypes,
    state.spellType,
    state.level,
    state.typeConfig,
    state.targetingConfig,
    state.durationConfig,
    state.resourceCost.primaryResourceType
  ]);

  // Save resource configuration when it changes
  useEffect(() => {
    dispatch(actionCreators.updateResourceCost({
      resourceTypes: selectedResources,
      resourceValues: resourceValues,
      resourceFormulas: resourceFormulas,
      useFormulas: useFormulas,
      actionPoints: selectedResources.includes('actionPoints') ? (resourceValues.actionPoints || 1) : 0
    }));
  }, [selectedResources, resourceValues, resourceFormulas, useFormulas]);

  // Handler for resource type selection
  const handleResourceTypeToggle = (resourceType) => {
    let updatedResources;
    let updatedResourceValues = { ...resourceValues };

    if (selectedResources.includes(resourceType)) {
      // Remove if already selected
      updatedResources = selectedResources.filter(type => type !== resourceType);

      // Also remove the resource value when deselected
      delete updatedResourceValues[resourceType];
      setResourceValues(updatedResourceValues);

      // Remove formula settings for this resource
      const updatedUseFormulas = { ...useFormulas };
      delete updatedUseFormulas[resourceType];
      setUseFormulas(updatedUseFormulas);

      const updatedResourceFormulas = { ...resourceFormulas };
      delete updatedResourceFormulas[resourceType];
      setResourceFormulas(updatedResourceFormulas);
    } else {
      // Add if not selected
      updatedResources = [...selectedResources, resourceType];

      // Initialize the resource value if it doesn't exist
      if (!updatedResourceValues[resourceType]) {
        updatedResourceValues[resourceType] = 1; // Default value
      }
    }

    // Allow having no resources selected
    // Update primary resource type for backward compatibility if resources exist
    if (updatedResources.length > 0) {
      dispatch(actionCreators.updateResourceCost({
        primaryResourceType: updatedResources[0],
        resourceValues: updatedResourceValues
      }));
    } else {
      dispatch(actionCreators.updateResourceCost({
        primaryResourceType: null,
        resourceValues: updatedResourceValues
      }));
    }

    setSelectedResources(updatedResources);
  };

  // Handler for resource value changes
  const handleResourceValueChange = (resourceType, value) => {
    const newValue = parseInt(value, 10) || 0;
    setResourceValues({
      ...resourceValues,
      [resourceType]: newValue
    });
  };

  // Handler for formula toggle
  const handleFormulaToggle = (resourceType) => {
    setUseFormulas({
      ...useFormulas,
      [resourceType]: !useFormulas[resourceType]
    });
  };

  // Handler for formula changes
  const handleFormulaChange = (resourceType, formula) => {
    setResourceFormulas({
      ...resourceFormulas,
      [resourceType]: formula
    });
  };

  // Handler for formula example selection
  const handleFormulaExampleSelect = (resourceType, formula) => {
    setResourceFormulas({
      ...resourceFormulas,
      [resourceType]: formula
    });
    setOpenFormulaDropdown(null);
  };

  // Toggle formula example dropdown
  const toggleFormulaDropdown = (resourceType) => {
    setOpenFormulaDropdown(openFormulaDropdown === resourceType ? null : resourceType);
  };

  // Open formula help popup
  const openFormulaHelp = (resourceType) => {
    console.log('Opening formula help for:', resourceType);
    setActiveResourceType(resourceType);
    setShowFormulaHelp(true);
  };

  // Handler for action points toggle - now uses regular resource toggle
  const handleActionPointsToggle = () => {
    handleResourceTypeToggle('actionPoints');
  };

  // Handler for resource cost adjustments
  const handleResourceCostChange = (resourceType, event) => {
    const value = parseInt(event.target.value, 10) || 0;

    dispatch(actionCreators.updateResourceCost({
      [resourceType]: value
    }));
  };

  // Handler for spell components change
  const handleComponentsChange = ({ components, materialComponents, verbalText, somaticText }) => {
    setSpellComponents({ components, materialComponents, verbalText, somaticText });

    dispatch(actionCreators.updateResourceCost({
      components,
      materialComponents,
      verbalText,
      somaticText
    }));
  };

  // Validate resource configuration and return warnings
  const validateResourceConfiguration = (state, resources) => {
    const warnings = [];

    // Check if spell has no resource costs
    if (selectedResources.length === 0) {
      warnings.push('This spell has no resource costs. It can be cast freely without limitations.');
    }

    // Check for potentially unbalanced resource configurations
    if (selectedResources.includes('actionPoints') && resources.actionPoints > 3) {
      warnings.push('This spell has a high action point cost. Consider if it should be split into multiple abilities.');
    }

    if (selectedResources.includes('mana') && state.level && resources.mana > state.level * 15) {
      warnings.push('The mana cost is very high for this spell level. This might make the spell inefficient to cast.');
    }

    if (selectedResources.includes('mana') && state.level && resources.mana < state.level * 3 && state.level > 3) {
      warnings.push('The mana cost seems too low for a spell of this level.');
    }

    return warnings;
  };

  // Get the current resource cost or default value
  const getCurrentResourceCost = (type) => {
    if (type === 'actionPoints') {
      return state.resourceCost.actionPoints !== undefined ?
        state.resourceCost.actionPoints :
        (calculatedResources ? calculatedResources.actionPoints : 1);
    }

    if (type === 'mana') {
      return state.resourceCost.mana !== undefined ?
        state.resourceCost.mana :
        (calculatedResources ? calculatedResources.mana : 0);
    }

    if (type === 'classResource') {
      return state.resourceCost.classResourceCost !== undefined ?
        state.resourceCost.classResourceCost :
        (calculatedResources ? calculatedResources.classResource : 0);
    }

    return 0;
  };

  // Get resource icon based on resource type
  const getResourceIcon = (resourceType) => {
    switch(resourceType) {
      case 'mana': return faGem;
      case 'rage': return faFire;
      case 'energy': return faBolt;
      case 'focus': return faLeaf;
      case 'soul_shards': return faSkull;
      case 'holy_power': return faSun;
      case 'astral_power': return faMoon;
      default: return faGem;
    }
  };

  return (
    <div className="resources-container">
      {/* Formula Help Popup */}
      <SimpleFormulaHelp
        show={showFormulaHelp}
        onClose={() => setShowFormulaHelp(false)}
        resourceType={activeResourceType}
      />

      {/* Resource Summary */}
      <div className="resource-summary">
        <div className="resource-summary-header">
          <h3>Resource Summary</h3>
        </div>
        <div className="resource-summary-body">
          {/* Show message when no resources are selected */}
          {selectedResources.length === 0 && (
            <div className="resource-cost-item free-spell">
              <div className="resource-icon action">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <div className="resource-cost-details">
                <div className="resource-cost-label">Free Spell</div>
                <div className="resource-cost-value">
                  This spell has no resource costs
                </div>
              </div>
            </div>
          )}

          {/* Selected Resources */}
          {selectedResources.map(resourceType => {
            const resourceInfo = resourceTypes.find(r => r.id === resourceType);
            if (!resourceInfo) return null;

            return (
              <div key={resourceType} className="resource-cost-item">
                <div className={`resource-icon ${resourceType}`}>
                  <FontAwesomeIcon icon={resourceInfo.icon} />
                </div>
                <div className="resource-cost-details">
                  <div className="resource-cost-label">{resourceInfo.name}</div>
                  <div className="resource-cost-value">
                    {useFormulas[resourceType] ? (
                      <span className="formula-text">{resourceFormulas[resourceType] || 'Formula'}</span>
                    ) : (
                      resourceValues[resourceType] ||
                      (resourceType === 'mana' ? calculatedResources?.mana || 0 :
                       resourceType === state.resourceCost.primaryResourceType ? calculatedResources?.classResource || 0 : 1)
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="resource-warnings">
          <div className="resource-warnings-header">
            <FontAwesomeIcon icon={faExclamationTriangle} /> Potential Issues
          </div>
          <ul className="resource-warnings-list">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Resource Configuration */}
      <div className="resource-config-section">
        <h3 className="resource-config-title">
          <FontAwesomeIcon icon={faGem} /> Resource Configuration
        </h3>

        <div className="resource-config-grid">
          {/* Resource Types */}
          <div className="resource-card">
            <div className="resource-card-header">
              <h4>Resource Types</h4>
              <div className="resource-card-subtitle">Select resources for your spell (or none for free spells)</div>
            </div>
            <div className="resource-card-body">
              <div className="resource-type-options">
                {resourceTypes.map(resource => (
                  <div
                    key={resource.id}
                    className={`resource-type-option ${selectedResources.includes(resource.id) ? 'selected' : ''}`}
                    onClick={() => handleResourceTypeToggle(resource.id)}
                    title={resource.description}
                  >
                    <div className="resource-type-icon">
                      <FontAwesomeIcon icon={resource.icon} />
                    </div>
                    <div className="resource-type-name">{resource.name}</div>
                  </div>
                ))}
              </div>



              {/* Resource Cost Configuration */}
              {selectedResources.map(resourceType => {
                const resourceInfo = resourceTypes.find(r => r.id === resourceType);
                if (!resourceInfo) return null;

                return (
                  <div key={resourceType} className="resource-cost-config">
                    <div className="resource-cost-header">
                      <div className="resource-type-icon small">
                        <FontAwesomeIcon icon={resourceInfo.icon} />
                      </div>
                      <div className="resource-type-name">{resourceInfo.name} Cost</div>
                      <div className="formula-controls">
                        <button
                          type="button"
                          className="formula-help-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openFormulaHelp(resourceType);
                          }}
                          title="View formula variables and examples"
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </button>
                        <button
                          className={`formula-toggle-btn ${useFormulas[resourceType] ? 'active' : ''}`}
                          onClick={() => handleFormulaToggle(resourceType)}
                        >
                          {useFormulas[resourceType] ? 'Using Formula' : 'Fixed Value'}
                        </button>
                      </div>
                    </div>

                    {useFormulas[resourceType] ? (
                      <div className="formula-input-container">
                        <input
                          type="text"
                          className="formula-input"
                          value={resourceFormulas[resourceType] || ''}
                          onChange={(e) => handleFormulaChange(resourceType, e.target.value)}
                          placeholder="Enter formula (e.g., level * 5)"
                        />
                        <div className="formula-examples">
                          <button
                            className="formula-examples-btn"
                            onClick={() => toggleFormulaDropdown(resourceType)}
                          >
                            Examples
                          </button>
                          {openFormulaDropdown === resourceType && (
                            <div className="formula-examples-dropdown">
                              {formulaExamples[resourceType]?.map((example, index) => (
                                <div
                                  key={index}
                                  className="formula-example-item"
                                  onClick={() => handleFormulaExampleSelect(resourceType, example.formula)}
                                >
                                  <div className="formula-example-name">{example.name}</div>
                                  <div className="formula-example-code">{example.formula}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="resource-input-group">
                        <input
                          type="number"
                          min="0"
                          className="resource-input"
                          value={resourceValues[resourceType] || 0}
                          onChange={(e) => handleResourceValueChange(resourceType, e.target.value)}
                        />
                        <div className="resource-input-hint">
                          Suggested cost for level {state.level || 1}: {state.level ? state.level * 5 : 5}-{state.level ? state.level * 10 : 10}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spell Components */}
          <div className="resource-card">
            <div className="resource-card-header">
              <h4>Spell Components</h4>
              <div className="resource-card-subtitle">Select physical requirements for casting this spell</div>
            </div>
            <div className="resource-card-body">
              <SpellComponentsSelector
                components={spellComponents.components}
                materialComponents={spellComponents.materialComponents}
                verbalText={spellComponents.verbalText}
                somaticText={spellComponents.somaticText}
                onChange={handleComponentsChange}
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Step5Resources;