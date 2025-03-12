import React, { useState, useEffect } from 'react';
import { 
  WizardStepContainer,
  DiceCalculator
} from './EffectWizardComponents';

import {
  UTILITY_EFFECT_TYPES,
  UTILITY_PARAMETERS,
  getWowIconPath
} from './effectSystemData';

import { useEffectWizardState, useEffectWizardDispatch } from './EffectWizardContext';
import { isValidDiceNotation, getAverageRoll } from './DiceRules';

/**
 * UtilitySelectionPage - Component for configuring utility effects
 */
export const UtilitySelectionPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [errors, setErrors] = useState({});
  
  // Get current utility configuration
  const utilityConfig = state.utilityConfig || {};
  
  // Handlers for updating utility config
  const handleUtilityTypeChange = (utilityType) => {
    dispatch({
      type: 'UPDATE_UTILITY_CONFIG',
      payload: {
        utilityType,
        utilitySubtype: null,
        parameters: {}
      }
    });
  };
  
  const handleUtilitySubtypeChange = (utilitySubtype) => {
    dispatch({
      type: 'UPDATE_UTILITY_CONFIG',
      payload: {
        utilitySubtype,
        // Reset parameters when subtype changes
        parameters: {}
      }
    });
  };
  
  const handleParameterChange = (paramName, value) => {
    dispatch({
      type: 'UPDATE_UTILITY_CONFIG',
      payload: {
        parameters: {
          ...utilityConfig.parameters,
          [paramName]: value
        }
      }
    });
  };
  
  // Get subtypes based on selected main type
  const getSubtypes = () => {
    if (!utilityConfig.utilityType) return [];
    
    const utilityType = UTILITY_EFFECT_TYPES.find(
      type => type.id === utilityConfig.utilityType
    );
    
    return utilityType ? utilityType.subtypes : [];
  };
  
  // Get parameters for the selected utility subtype
  const getParameters = () => {
    if (!utilityConfig.utilityType || !utilityConfig.utilitySubtype) 
      return [];
    
    const utilityType = UTILITY_EFFECT_TYPES.find(
      type => type.id === utilityConfig.utilityType
    );
    
    if (!utilityType) return [];
    
    const subtype = utilityType.subtypes.find(
      sub => sub.id === utilityConfig.utilitySubtype
    );
    
    return subtype && subtype.parameters ? subtype.parameters : [];
  };
  
  // Validate the utility configuration
  const validateConfig = () => {
    const newErrors = {};
    
    if (!utilityConfig.utilityType) {
      newErrors.utilityType = 'Please select a utility type';
    }
    
    if (utilityConfig.utilityType && !utilityConfig.utilitySubtype) {
      newErrors.utilitySubtype = 'Please select a subtype';
    }
    
    // Validate required parameters
    const parameters = getParameters();
    parameters.forEach(param => {
      // Skip validation for dice params that have valid dice notation
      const paramValue = utilityConfig.parameters && utilityConfig.parameters[param];
      
      // Check if parameter looks like it should be dice notation
      const isDiceParam = param.toLowerCase().includes('dice') || 
                         param.toLowerCase().includes('roll') ||
                         param.toLowerCase().includes('damage');
      
      if (!paramValue) {
        newErrors[param] = `${formatParamName(param)} is required`;
      } else if (isDiceParam && !isValidDiceNotation(paramValue)) {
        newErrors[param] = `${formatParamName(param)} must be valid dice notation (e.g. 2d6)`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate when configuration changes
  useEffect(() => {
    validateConfig();
  }, [utilityConfig]);
  
  const subtypes = getSubtypes();
  const parameters = getParameters();
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="utility-selection">
        <div className="section-intro">
          <h3>Utility Effect Configuration</h3>
          <p>
            Utility effects provide non-combat functionality like movement enhancement, 
            environmental manipulation, illusions, and more. Select a type and configure 
            parameters to define your effect.
          </p>
        </div>
        
        <div className="utility-type-selection">
          <h3>Effect Type</h3>
          <div className="utility-type-grid">
            {UTILITY_EFFECT_TYPES.map(type => (
              <div 
                key={type.id}
                className={`utility-type-card ${utilityConfig.utilityType === type.id ? 'selected' : ''}`}
                onClick={() => handleUtilityTypeChange(type.id)}
              >
                <div className="utility-icon">
                  <img src={getWowIconPath(type.icon)} alt={type.name} />
                </div>
                <div className="utility-info">
                  <h4>{type.name}</h4>
                  <p>{type.description}</p>
                  <span className="ap-cost">AP Cost: {type.actionPointCost}</span>
                </div>
              </div>
            ))}
          </div>
          
          {errors.utilityType && (
            <div className="error-message">{errors.utilityType}</div>
          )}
        </div>
        
        {utilityConfig.utilityType && (
          <div className="utility-subtype-selection">
            <h3>Effect Subtype</h3>
            <p className="section-hint">
              {getUtilityTypeHint(utilityConfig.utilityType)}
            </p>
            
            <div className="utility-subtype-grid">
              {subtypes.map(subtype => (
                <div 
                  key={subtype.id}
                  className={`utility-subtype-card ${utilityConfig.utilitySubtype === subtype.id ? 'selected' : ''}`}
                  onClick={() => handleUtilitySubtypeChange(subtype.id)}
                >
                  <div className="subtype-icon">
                    <img src={getWowIconPath(subtype.icon)} alt={subtype.name} />
                  </div>
                  <div className="subtype-info">
                    <h4>{subtype.name}</h4>
                    <p>{subtype.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {errors.utilitySubtype && (
              <div className="error-message">{errors.utilitySubtype}</div>
            )}
          </div>
        )}
        
        {utilityConfig.utilityType && utilityConfig.utilitySubtype && (
          <div className="utility-parameters">
            <h3>Effect Parameters</h3>
            <p className="section-hint">
              Configure the strength, range, and properties of your {getSubtypeName(utilityConfig)} effect.
            </p>
            
            <div className="parameters-grid">
              {parameters.map(param => {
                // Get parameter definition
                const paramDef = getParamDefinition(utilityConfig.utilityType, param);
                if (!paramDef) return null;
                
                // Determine if this is a dice-based parameter
                const isDiceParam = param.toLowerCase().includes('dice') || 
                                   param.toLowerCase().includes('roll') ||
                                   param.toLowerCase().includes('damage') ||
                                   param.toLowerCase().includes('amount');
                
                return (
                  <div key={param} className="parameter-item">
                    <label htmlFor={param}>{formatParamName(param)}</label>
                    
                    {isDiceParam ? (
                      <DiceCalculator
                        label=""
                        value={utilityConfig.parameters?.[param] || ''}
                        onChange={(value) => handleParameterChange(param, value)}
                        placeholder={`e.g. ${paramDef.default || '2d6'}`}
                      />
                    ) : (
                      renderParameterInput(
                        param,
                        paramDef,
                        utilityConfig.parameters?.[param],
                        (value) => handleParameterChange(param, value)
                      )
                    )}
                    
                    {errors[param] && (
                      <div className="parameter-error">{errors[param]}</div>
                    )}
                    
                    {getParameterHint(param, paramDef) && (
                      <p className="parameter-hint">{getParameterHint(param, paramDef)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {utilityConfig.utilityType && utilityConfig.utilitySubtype && (
          <UtilityEffectPreview 
            utilityConfig={utilityConfig} 
            parameters={parameters}
          />
        )}
        
        {utilityConfig.utilityType && (
          <UtilityExamples utilityType={utilityConfig.utilityType} />
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * UtilityEffectPreview - Component for previewing the configured utility effect
 */
function UtilityEffectPreview({ utilityConfig, parameters = [] }) {
  // Get utility type and subtype details
  const utilityType = UTILITY_EFFECT_TYPES.find(type => type.id === utilityConfig.utilityType);
  const subtype = utilityType?.subtypes.find(sub => sub.id === utilityConfig.utilitySubtype);
  
  if (!utilityType || !subtype) return null;
  
  // Calculate effect magnitude from dice-based parameters
  const getMagnitude = () => {
    const magnitudeParams = parameters.filter(param => 
      param.toLowerCase().includes('damage') || 
      param.toLowerCase().includes('amount') ||
      param.toLowerCase().includes('distance')
    );
    
    if (magnitudeParams.length === 0) return null;
    
    const param = magnitudeParams[0];
    const value = utilityConfig.parameters?.[param];
    
    if (!value || !isValidDiceNotation(value)) return null;
    
    const average = getAverageRoll(value);
    return {
      param: formatParamName(param),
      value,
      average
    };
  };
  
  const magnitude = getMagnitude();
  
  return (
    <div className="utility-preview">
      <h3>Effect Preview</h3>
      <div className="preview-card">
        <div className="preview-header">
          <img src={getWowIconPath(subtype.icon)} alt={subtype.name} className="preview-icon" />
          <div className="preview-title">
            <h4>{utilityType.name}: {subtype.name}</h4>
            <span className="ap-cost">AP Cost: {utilityType.actionPointCost}</span>
          </div>
        </div>
        
        <div className="preview-description">
          <p>{subtype.description}</p>
        </div>
        
        {magnitude && (
          <div className="preview-magnitude">
            <h5>Effect Magnitude</h5>
            <p>
              {magnitude.param}: {magnitude.value} 
              (Average: {magnitude.average.toFixed(1)})
            </p>
          </div>
        )}
        
        <div className="preview-parameters">
          <h5>Effect Parameters</h5>
          <ul>
            {parameters.filter(param => utilityConfig.parameters?.[param])
              .map(param => {
                const value = utilityConfig.parameters[param];
                const paramDef = getParamDefinition(utilityConfig.utilityType, param);
                
                return (
                  <li key={param}>
                    <strong>{formatParamName(param)}:</strong> {
                      typeof value === 'boolean' 
                        ? (value ? 'Yes' : 'No') 
                        : value + (paramDef?.unit ? ` ${paramDef.unit}` : '')
                    }
                  </li>
                );
              })}
          </ul>
        </div>
        
        <div className="preview-visual">
          {renderEffectVisual(utilityConfig)}
        </div>
      </div>
    </div>
  );
}

/**
 * UtilityExamples - Component showing examples for the selected utility type
 */
function UtilityExamples({ utilityType }) {
  // Define examples for each utility type
  const examples = {
    movement: [
      { title: "Quick Escape", description: "Teleport 30ft to safety when attacked", parameters: "Distance: 3d10 feet, No Line of Sight" },
      { title: "Scout Flight", description: "Gain flight for reconnaissance missions", parameters: "Speed: 60ft, Duration: 10 minutes" },
      { title: "Ghost Walk", description: "Phase through walls for short distances", parameters: "Distance: 1d6 × 5 feet, Corporeality: None" }
    ],
    control: [
      { title: "Gravitational Pull", description: "Pull enemies toward a central point", parameters: "Force: 3d6, Range: 30ft, Save DC: 15" },
      { title: "Force Barrier", description: "Create an impenetrable wall of force", parameters: "Size: 15ft × 15ft, HP: 10d10, Duration: 1d4+1 minutes" },
      { title: "Forceful Repulsion", description: "Push all creatures away from a point", parameters: "Distance: 2d6 feet, Direction: Away from center" }
    ],
    environment: [
      { title: "Treacherous Terrain", description: "Turn normal ground into difficult terrain", parameters: "Area: 20ft radius, Duration: 1 minute" },
      { title: "Dancing Lights", description: "Create multiple floating lights", parameters: "Light Count: 1d4+1, Brightness: Medium, Movement: Yes" },
      { title: "Toxic Cloud", description: "Fill an area with poisonous gas", parameters: "Damage: 1d6 per round, Radius: 15ft, Duration: 1 minute" }
    ],
    illusion: [
      { title: "Phantom Soldier", description: "Create an illusory warrior to distract enemies", parameters: "Complexity: 8, Interactivity: 4, Duration: 1 minute" },
      { title: "Sound Mimicry", description: "Create convincing sounds from a distance", parameters: "Complexity: 7, Volume: High, Direction: Variable" },
      { title: "Mirror Image", description: "Create multiple illusory duplicates of yourself", parameters: "Duplicates: 1d4, Believability: 16, Movement: Synchronized" }
    ],
    transformation: [
      { title: "Beast Shape", description: "Transform into a bear for combat", parameters: "Form: Bear, Abilities: Strength +4, Claws 1d8" },
      { title: "Stone Body", description: "Partially transform your body into living stone", parameters: "Damage Reduction: 3d6, Movement: -10ft, Duration: 1 minute" },
      { title: "Giant Growth", description: "Increase size and strength dramatically", parameters: "Size Increase: 2x, Strength Bonus: 1d6, Duration: 1 minute" }
    ],
    divination: [
      { title: "Detect Magic", description: "Sense magical auras within range", parameters: "Range: 30ft, Detail: High, Duration: 10 minutes" },
      { title: "Scrying Eye", description: "View a distant location", parameters: "Range: 1 mile, Clarity: Medium, Duration: 1d4 minutes" },
      { title: "Find Object", description: "Locate a specific object you've seen before", parameters: "Range: 1000ft, Accuracy: High, Blocked by: Lead" }
    ]
  };
  
  const typeExamples = examples[utilityType] || [];
  
  if (typeExamples.length === 0) return null;
  
  return (
    <div className="utility-examples">
      <h3>Examples for {getUtilityTypeName(utilityType)} Effects</h3>
      <div className="examples-grid">
        {typeExamples.map((example, index) => (
          <div key={index} className="example-card">
            <h4>{example.title}</h4>
            <p>{example.description}</p>
            <div className="example-parameters">
              <strong>Parameters:</strong> {example.parameters}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== Helper Functions ==========

/**
 * Get a parameter definition from utility parameters
 */
function getParamDefinition(utilityType, paramName) {
  if (!utilityType || !paramName) return null;
  
  const typeParams = UTILITY_PARAMETERS[utilityType] || {};
  return typeParams[paramName] || null;
}

/**
 * Format parameter name for display
 */
function formatParamName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ');
}

/**
 * Get utility type name
 */
function getUtilityTypeName(typeId) {
  const type = UTILITY_EFFECT_TYPES.find(t => t.id === typeId);
  return type ? type.name : 'Unknown';
}

/**
 * Get full subtype name (type + subtype)
 */
function getSubtypeName(config) {
  const { utilityType, utilitySubtype } = config;
  
  const type = UTILITY_EFFECT_TYPES.find(t => t.id === utilityType);
  if (!type) return 'Unknown';
  
  const subtype = type.subtypes.find(s => s.id === utilitySubtype);
  if (!subtype) return type.name;
  
  return `${type.name} (${subtype.name})`;
}

/**
 * Get hint text for utility type selection
 */
function getUtilityTypeHint(typeId) {
  const hints = {
    movement: "Movement effects allow targets to travel in ways they normally couldn't. Great for traversal and escape.",
    control: "Control effects manipulate the battlefield by moving creatures or creating barriers. Excellent for tactical play.",
    environment: "Environment effects alter terrain, create hazards, or manipulate light and sound. Perfect for area control.",
    illusion: "Illusion effects deceive the senses, creating false images, sounds, or other sensory inputs. Ideal for deception.",
    transformation: "Transformation effects change physical forms and properties. Versatile for both combat and utility.",
    divination: "Divination effects reveal hidden information or locate entities. Essential for information gathering."
  };
  
  return hints[typeId] || "Select a subtype that defines how this effect works.";
}

/**
 * Get parameter-specific hint text
 */
function getParameterHint(paramName, paramDef) {
  // Add custom hints for common parameters
  const customHints = {
    distance: "How far the effect can reach or move something",
    duration: "How long the effect lasts before dissipating",
    range: "The maximum distance from the caster at which the effect can be created",
    damage: "The amount of damage dealt by the effect, if applicable",
    radius: "The size of the circular area affected",
    saveDC: "The difficulty for targets to resist the effect",
    complexity: "How intricate and detailed the effect is; higher values create more convincing effects",
    flightSpeed: "How quickly the target can fly; comparable to walking speed"
  };
  
  for (const key in customHints) {
    if (paramName.toLowerCase().includes(key.toLowerCase())) {
      return customHints[key];
    }
  }
  
  // Return unit-based hints or generic descriptions
  if (paramDef?.unit) {
    return `Measured in ${paramDef.unit}`;
  }
  
  if (paramDef?.description) {
    return paramDef.description;
  }
  
  if (paramDef?.min !== undefined && paramDef?.max !== undefined) {
    return `Value between ${paramDef.min} and ${paramDef.max}${paramDef.unit ? ' ' + paramDef.unit : ''}`;
  }
  
  return null;
}

/**
 * Render appropriate input for parameter based on type
 */
function renderParameterInput(paramName, paramDef, value, onChange) {
  if (!paramDef) return null;
  
  // Boolean parameters
  if (paramDef.type === 'boolean') {
    return (
      <div className="toggle-input">
        <label className="switch">
          <input 
            type="checkbox" 
            checked={value || false} 
            onChange={(e) => onChange(e.target.checked)} 
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">{value ? 'Yes' : 'No'}</span>
      </div>
    );
  }
  
  // Select from options
  if (paramDef.options) {
    return (
      <select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="parameter-select"
      >
        <option value="">Select an option</option>
        {paramDef.options.map(option => (
          <option key={option} value={option}>
            {typeof option === 'string' ? formatParamName(option) : option}
          </option>
        ))}
      </select>
    );
  }
  
  // Range input
  if (paramDef.min !== undefined && paramDef.max !== undefined) {
    const defaultValue = value !== undefined ? value : (paramDef.default || paramDef.min);
    return (
      <div className="range-input">
        <input 
          type="range" 
          min={paramDef.min} 
          max={paramDef.max} 
          value={defaultValue} 
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
        />
        <div className="range-value">
          <span>{defaultValue}</span>
          {paramDef.unit && <span className="unit">{paramDef.unit}</span>}
        </div>
      </div>
    );
  }
  
  // Default to text input
  return (
    <input 
      type="text" 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={paramDef.default || `Enter ${formatParamName(paramName)}`}
      className="parameter-input"
    />
  );
}

/**
 * Render visual representation of the effect
 */
function renderEffectVisual(utilityConfig) {
  const { utilityType, utilitySubtype, parameters } = utilityConfig;
  
  // Base visual styles based on effect type
  let visualClassName = 'effect-visual';
  let visualContent = null;
  
  switch (utilityType) {
    case 'movement':
      visualClassName += ' movement-visual';
      visualContent = (
        <div className="movement-diagram">
          <div className="source-point"></div>
          <div className="effect-path"></div>
          <div className="target-point"></div>
          <div className="movement-icon">
            {utilitySubtype === 'teleport' && '⚡'}
            {utilitySubtype === 'flight' && '✈️'}
            {utilitySubtype === 'phasing' && '👻'}
            {utilitySubtype === 'speed' && '💨'}
            {utilitySubtype === 'wallWalking' && '🧗'}
          </div>
        </div>
      );
      break;
      
    case 'control':
      visualClassName += ' control-visual';
      visualContent = (
        <div className="control-diagram">
          <div className="field-of-effect"></div>
          <div className="affected-targets">
            {utilitySubtype === 'pull' && '↓'}
            {utilitySubtype === 'push' && '↑'}
            {utilitySubtype === 'barrier' && '🛡️'}
            {utilitySubtype === 'gravity' && '⚓'}
          </div>
        </div>
      );
      break;
      
    case 'environment':
      visualClassName += ' environment-visual';
      visualContent = (
        <div className="environment-diagram">
          <div className="terrain-representation"></div>
          <div className="environment-icon">
            {utilitySubtype === 'terrain' && '🏔️'}
            {utilitySubtype === 'hazard' && '🔥'}
            {utilitySubtype === 'light' && '💡'}
            {utilitySubtype === 'weather' && '🌧️'}
          </div>
        </div>
      );
      break;
      
    case 'illusion':
      visualClassName += ' illusion-visual';
      visualContent = (
        <div className="illusion-diagram">
          <div className="observer"></div>
          <div className="illusion-projection"></div>
          <div className="illusion-icon">
            {utilitySubtype === 'visual' && '👁️'}
            {utilitySubtype === 'sound' && '👂'}
            {utilitySubtype === 'complex' && '🎭'}
            {utilitySubtype === 'disguise' && '🎭'}
          </div>
        </div>
      );
      break;
      
    case 'transformation':
      visualClassName += ' transformation-visual';
      visualContent = (
        <div className="transformation-diagram">
          <div className="original-form"></div>
          <div className="transformation-arrow">→</div>
          <div className="transformed-form"></div>
          <div className="transformation-icon">
            {utilitySubtype === 'animal' && '🐺'}
            {utilitySubtype === 'element' && '🔥'}
            {utilitySubtype === 'size' && '📏'}
            {utilitySubtype === 'object' && '📦'}
            {utilitySubtype === 'phaseshift' && '👻'}
          </div>
        </div>
      );
      break;
      
    case 'divination':
      visualClassName += ' divination-visual';
      visualContent = (
        <div className="divination-diagram">
          <div className="diviner"></div>
          <div className="divination-rays"></div>
          <div className="target-object"></div>
          <div className="divination-icon">
            {utilitySubtype === 'detection' && '🔍'}
            {utilitySubtype === 'scrying' && '🔮'}
            {utilitySubtype === 'identification' && '📋'}
            {utilitySubtype === 'prediction' && '🔮'}
            {utilitySubtype === 'truesight' && '👁️'}
          </div>
        </div>
      );
      break;
      
    default:
      visualContent = <div>No visualization available</div>;
  }
  
  return (
    <div className={visualClassName}>
      {visualContent}
      <p className="visual-caption">
        Visual representation of {getSubtypeName(utilityConfig)}
      </p>
    </div>
  );
}

export default UtilitySelectionPage;