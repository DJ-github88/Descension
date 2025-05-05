import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
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

const FormulaHelpPopup = ({ show, onHide, resourceType }) => {
  // Common variables available for all resource types
  const commonVariables = [
    { name: 'level', description: 'Character level', example: 'level * 5' },
    { name: 'spell_power', description: 'Caster\'s spell power stat', example: 'spell_power / 10' },
    { name: 'targets_hit', description: 'Number of targets affected', example: '10 * targets_hit' },
    { name: 'target_distance', description: 'Distance to target in yards', example: '5 + (target_distance / 5)' },
    { name: 'crit_chance', description: 'Critical strike chance percentage', example: '20 + crit_chance' },
    { name: 'time_factor', description: 'Time of day factor (0-1)', example: 'time_factor * 50' },
  ];

  // Resource-specific variables and formulas
  const resourceVariables = {
    mana: [
      { name: 'max_mana', description: 'Maximum mana pool', example: '0.2 * max_mana' },
      { name: 'current_mana', description: 'Current mana amount', example: '0.1 * current_mana' },
      { name: 'intellect', description: 'Intellect stat value', example: 'intellect / 5' },
      { name: 'mana_regen', description: 'Mana regeneration rate', example: 'mana_regen * 3' },
      { name: 'spell_cost', description: 'Base spell cost', example: 'spell_cost * 1.5' },
    ],
    rage: [
      { name: 'max_rage', description: 'Maximum rage capacity (100)', example: '0.25 * max_rage' },
      { name: 'current_rage', description: 'Current rage amount', example: 'current_rage / 2' },
      { name: 'strength', description: 'Strength stat value', example: 'strength / 10' },
      { name: 'damage_taken', description: 'Recent damage taken', example: 'damage_taken * 0.1' },
      { name: 'missing_health', description: 'Missing health percentage', example: 'missing_health / 2' },
    ],
    energy: [
      { name: 'max_energy', description: 'Maximum energy capacity (100)', example: 'max_energy * 0.3' },
      { name: 'current_energy', description: 'Current energy amount', example: 'current_energy / 4' },
      { name: 'agility', description: 'Agility stat value', example: 'agility / 10' },
      { name: 'haste_percent', description: 'Haste percentage', example: '40 - haste_percent' },
      { name: 'combo_points', description: 'Current combo points', example: '10 * combo_points' },
    ],
    focus: [
      { name: 'max_focus', description: 'Maximum focus capacity (100)', example: 'max_focus * 0.2' },
      { name: 'current_focus', description: 'Current focus amount', example: 'current_focus / 5' },
      { name: 'ranged_crit', description: 'Ranged critical chance', example: 'ranged_crit / 2' },
      { name: 'pet_health_percent', description: 'Pet health percentage', example: '(100 - pet_health_percent) / 2' },
      { name: 'target_distance', description: 'Distance to target in yards', example: '30 + (target_distance / 2)' },
    ],
    soul_shards: [
      { name: 'max_shards', description: 'Maximum soul shard capacity (5)', example: 'max_shards - 2' },
      { name: 'current_shards', description: 'Current soul shard count', example: 'current_shards / 2' },
      { name: 'shadow_damage', description: 'Shadow damage dealt recently', example: 'shadow_damage / 1000' },
      { name: 'demons_active', description: 'Number of active demon summons', example: 'demons_active + 1' },
      { name: 'dot_count', description: 'Number of active DoTs on target', example: 'dot_count / 2' },
    ],
    holy_power: [
      { name: 'max_holy_power', description: 'Maximum holy power capacity (5)', example: 'max_holy_power - 1' },
      { name: 'current_holy_power', description: 'Current holy power amount', example: 'current_holy_power * 2' },
      { name: 'healing_done', description: 'Recent healing done', example: 'healing_done / 1000' },
      { name: 'allies_nearby', description: 'Number of allies within 10 yards', example: 'allies_nearby / 2' },
      { name: 'divine_favor', description: 'Divine favor stacks', example: 'divine_favor * 2' },
    ],
    astral_power: [
      { name: 'max_astral_power', description: 'Maximum astral power (100)', example: 'max_astral_power * 0.2' },
      { name: 'current_astral_power', description: 'Current astral power amount', example: 'current_astral_power / 5' },
      { name: 'nature_damage', description: 'Nature damage dealt recently', example: 'nature_damage / 500' },
      { name: 'eclipse_factor', description: 'Eclipse power (0-1)', example: 'eclipse_factor * 60' },
      { name: 'form_bonus', description: 'Druid form bonus', example: 'form_bonus * 10' },
    ]
  };

  // Thematic formula examples for each resource type
  const thematicExamples = {
    mana: [
      { name: 'Arcane Surge', formula: '0.15 * max_mana + (intellect / 5)', description: 'Powerful arcane spell that scales with intellect' },
      { name: 'Mana Burn', formula: 'min(50, current_mana * 0.2)', description: 'Burns a portion of current mana, up to 50' },
      { name: 'Intellect Drain', formula: 'intellect * 0.5 + level * 2', description: 'Drains intellect-based mana' },
      { name: 'Ley Line Tap', formula: 'spell_power * 0.3 + 20', description: 'Taps into ley lines for power' },
    ],
    rage: [
      { name: 'Berserker Strike', formula: 'strength / 5 + missing_health / 2', description: 'More powerful when low on health' },
      { name: 'Battle Fury', formula: '10 + (damage_taken * 0.05)', description: 'Converts recent damage into rage cost' },
      { name: 'Bloodthirst', formula: 'min(50, current_rage * 0.5)', description: 'Uses up to half of current rage, max 50' },
      { name: 'Warrior\'s Will', formula: '20 + (level * 2) - (missing_health / 5)', description: 'Less costly when injured' },
    ],
    energy: [
      { name: 'Shadow Strike', formula: '35 - (agility / 20) - (haste_percent / 5)', description: 'Reduced cost with high agility and haste' },
      { name: 'Combo Finisher', formula: '10 * combo_points + 5', description: 'Scales with combo points' },
      { name: 'Quick Reflexes', formula: 'max(15, 40 - (agility / 10))', description: 'Minimum 15 energy, reduced by agility' },
      { name: 'Momentum', formula: 'current_energy * 0.25 + 10', description: 'More costly with higher energy' },
    ],
    focus: [
      { name: 'Aimed Shot', formula: '30 + (target_distance / 10)', description: 'More focus for distant targets' },
      { name: 'Beast Bond', formula: '25 - (pet_health_percent / 5)', description: 'Less costly with injured pet' },
      { name: 'Hunter\'s Mark', formula: 'ranged_crit * 0.5 + 10', description: 'Scales with critical chance' },
      { name: 'Survival Instinct', formula: 'max(10, 30 - (targets_hit * 5))', description: 'Reduced cost in multi-target situations' },
    ],
    soul_shards: [
      { name: 'Soul Harvest', formula: 'max(1, dot_count / 2)', description: 'Scales with active DoTs' },
      { name: 'Demonic Pact', formula: 'demons_active + 1', description: 'More costly with more demons' },
      { name: 'Shadow Ritual', formula: 'min(3, current_shards * 0.5 + 1)', description: 'Uses up to 3 shards' },
      { name: 'Void Consumption', formula: 'ceil(shadow_damage / 5000)', description: 'Scales with shadow damage dealt' },
    ],
    holy_power: [
      { name: 'Divine Intervention', formula: 'max(1, allies_nearby / 3)', description: 'Scales with nearby allies' },
      { name: 'Blessing of Light', formula: 'min(3, healing_done / 10000)', description: 'Scales with healing done' },
      { name: 'Sacred Duty', formula: 'current_holy_power + 1', description: 'Uses current holy power plus one' },
      { name: 'Divine Favor', formula: 'max(1, divine_favor / 2)', description: 'Reduced by divine favor' },
    ],
    astral_power: [
      { name: 'Celestial Alignment', formula: '50 * eclipse_factor + 20', description: 'Powerful during eclipse' },
      { name: 'Nature\'s Balance', formula: 'nature_damage / 1000 + 15', description: 'Scales with nature damage' },
      { name: 'Astral Communion', formula: 'current_astral_power * 0.3 + 10', description: 'Uses portion of current astral power' },
      { name: 'Moonfire Surge', formula: 'form_bonus * 15 + 20', description: 'Enhanced by druid form' },
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

  console.log('FormulaHelpPopup - show:', show, 'resourceType:', resourceType);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      centered
      className="formula-help-modal"
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {resourceType && (
            <span className="resource-title">
              <FontAwesomeIcon icon={getResourceIcon(resourceType)} className={`resource-icon ${resourceType}`} />
              {formatResourceName(resourceType)} Formula Variables
            </span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="formula-help-content">
          <div className="formula-section">
            <h4>Resource-Specific Variables</h4>
            <div className="variable-list">
              {currentVariables.slice(0, 3).map((variable, index) => (
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
              {commonVariables.slice(0, 3).map((variable, index) => (
                <div key={index} className="variable-item">
                  <div className="variable-name"><code>{variable.name}</code></div>
                  <div className="variable-desc">{variable.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="formula-section">
            <h4>Thematic Formula Examples</h4>
            <div className="example-list">
              {currentExamples.slice(0, 2).map((example, index) => (
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
              <div className="syntax-item">
                <div className="syntax-name"><code>ceil(a), floor(a), round(a)</code></div>
                <div className="syntax-desc">Rounding functions</div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormulaHelpPopup;
