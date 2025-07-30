import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGem,
  faBolt,
  faFire,
  faLeaf,
  faMoon,
  faSun,
  faSkull,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/formulaHelp.css';

const SimpleFormulaHelp = ({ show, onClose, resourceType }) => {
  if (!show) return null;

  // Common variables available for all resource types
  const commonVariables = [
    { name: 'level', description: 'Character level' },
    { name: 'spell_power', description: 'Caster\'s spell power stat' },
    { name: 'targets_hit', description: 'Number of targets affected' },
  ];

  // Resource-specific variables and formulas
  const resourceVariables = {
    mana: [
      { name: 'max_mana', description: 'Maximum mana pool' },
      { name: 'current_mana', description: 'Current mana amount' },
      { name: 'intellect', description: 'Intellect stat value' },
    ],
    rage: [
      { name: 'max_rage', description: 'Maximum rage capacity (100)' },
      { name: 'current_rage', description: 'Current rage amount' },
      { name: 'strength', description: 'Strength stat value' },
    ],
    energy: [
      { name: 'max_energy', description: 'Maximum energy capacity (100)' },
      { name: 'current_energy', description: 'Current energy amount' },
      { name: 'agility', description: 'Agility stat value' },
    ],
    focus: [
      { name: 'max_focus', description: 'Maximum focus capacity (100)' },
      { name: 'current_focus', description: 'Current focus amount' },
      { name: 'ranged_crit', description: 'Ranged critical chance' },
    ],
    soul_shards: [
      { name: 'max_shards', description: 'Maximum soul shard capacity (5)' },
      { name: 'current_shards', description: 'Current soul shard count' },
      { name: 'shadow_damage', description: 'Shadow damage dealt recently' },
    ],
    holy_power: [
      { name: 'max_holy_power', description: 'Maximum holy power capacity (5)' },
      { name: 'current_holy_power', description: 'Current holy power amount' },
      { name: 'healing_done', description: 'Recent healing done' },
    ],
    astral_power: [
      { name: 'max_astral_power', description: 'Maximum astral power (100)' },
      { name: 'current_astral_power', description: 'Current astral power amount' },
      { name: 'nature_damage', description: 'Nature damage dealt recently' },
    ]
  };

  // Thematic formula examples for each resource type
  const thematicExamples = {
    mana: [
      { name: 'Arcane Surge', formula: '0.15 * maxMana + (intelligence / 5)' },
      { name: 'Mana Burn', formula: 'min(50, currentMana * 0.2)' },
    ],
    rage: [
      { name: 'Berserker Strike', formula: 'strength / 5 + (maxHealth - currentHealth) / 2' },
      { name: 'Battle Fury', formula: '10 + (exhaustionLevel * 2)' },
    ],
    energy: [
      { name: 'Shadow Strike', formula: '35 - (agility / 20)' },
      { name: 'Combo Finisher', formula: '10 * level + 5' },
    ],
    focus: [
      { name: 'Aimed Shot', formula: '30 + (agility / 10)' },
      { name: 'Beast Bond', formula: '25 - (currentHealth / maxHealth * 10)' },
    ],
    soul_shards: [
      { name: 'Soul Harvest', formula: 'max(1, dot_count / 2)' },
      { name: 'Demonic Pact', formula: 'demons_active + 1' },
    ],
    holy_power: [
      { name: 'Divine Intervention', formula: 'max(1, allies_nearby / 3)' },
      { name: 'Blessing of Light', formula: 'min(3, healing_done / 10000)' },
    ],
    astral_power: [
      { name: 'Celestial Alignment', formula: '50 * eclipse_factor + 20' },
      { name: 'Nature\'s Balance', formula: 'nature_damage / 1000 + 15' },
    ]
  };

  // Get the icon for the resource type
  const getResourceIcon = (type) => {
    switch(type) {
      case 'mana': return faGem;
      case 'rage': return faFire;
      case 'energy': return faBolt;
      case 'focus': return faLeaf;
      case 'soul_shards': return faSkull;
      case 'holy_power': return faSun;
      case 'astral_power': return faMoon;
      default: return faInfoCircle;
    }
  };

  // Format resource name for display
  const formatResourceName = (type) => {
    if (!type) return 'Resource';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get the variables for the current resource type
  const currentVariables = resourceType ? resourceVariables[resourceType] || [] : [];
  const currentExamples = resourceType ? thematicExamples[resourceType] || [] : [];

  return (
    <div className="simple-formula-help">
      <div className="simple-formula-help-overlay" onClick={onClose}></div>
      <div className="simple-formula-help-content">
        <div className="simple-formula-help-header">
          <div className="resource-title">
            <FontAwesomeIcon icon={getResourceIcon(resourceType)} className={`resource-icon ${resourceType}`} />
            <span>{formatResourceName(resourceType)} Formula Variables</span>
          </div>
          <button className="simple-formula-help-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="simple-formula-help-body">
          <div className="formula-section">
            <h4>Resource-Specific Variables</h4>
            <div className="variable-list">
              {currentVariables.map((variable, index) => (
                <div key={index} className="variable-item">
                  <div className="variable-name"><code>{variable.name}</code></div>
                  <div className="variable-desc">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4>Common Variables</h4>
            <div className="variable-list">
              {commonVariables.map((variable, index) => (
                <div key={index} className="variable-item">
                  <div className="variable-name"><code>{variable.name}</code></div>
                  <div className="variable-desc">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4>Example Formulas</h4>
            <div className="example-list">
              {currentExamples.map((example, index) => (
                <div key={index} className="example-item">
                  <div className="example-name">{example.name}</div>
                  <div className="example-formula"><code>{example.formula}</code></div>
                </div>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4>Formula Syntax</h4>
            <div className="syntax-list">
              <div className="syntax-item">
                <div className="syntax-name"><code>+, -, *, /</code></div>
                <div className="syntax-desc">Basic arithmetic operations</div>
              </div>
              <div className="syntax-item">
                <div className="syntax-name"><code>min(a, b), max(a, b)</code></div>
                <div className="syntax-desc">Minimum or maximum of two values</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="simple-formula-help-footer">
          <button className="simple-formula-help-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleFormulaHelp;
