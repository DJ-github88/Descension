import React from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import '../../styles/WizardSteps.css';
import './Step2Statistics.css';

// Damage types for resistances and vulnerabilities
const DAMAGE_TYPES = [
  { id: 'physical', name: 'Physical' },
  { id: 'fire', name: 'Fire' },
  { id: 'frost', name: 'Frost' },
  { id: 'arcane', name: 'Arcane' },
  { id: 'holy', name: 'Holy' },
  { id: 'shadow', name: 'Shadow' },
  { id: 'nature', name: 'Nature' },
  { id: 'poison', name: 'Poison' },
  { id: 'disease', name: 'Disease' },
  { id: 'psychic', name: 'Psychic' },
  { id: 'force', name: 'Force' },
  { id: 'thunder', name: 'Thunder' },
  { id: 'lightning', name: 'Lightning' },
  { id: 'acid', name: 'Acid' },
  { id: 'water', name: 'Water' }
];

// Resistance/vulnerability values
const RESISTANCE_VALUES = [
  { value: 0, label: 'None (0%)' },
  { value: 25, label: 'Resistant (25%)' },
  { value: 50, label: 'Highly Resistant (50%)' },
  { value: 75, label: 'Very Resistant (75%)' },
  { value: 100, label: 'Immune (100%)' }
];

const Step2Statistics = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  // Handle attribute change
  const handleAttributeChange = (attribute, value) => {
    const numValue = parseInt(value, 10) || 0;

    dispatch(wizardActionCreators.setStats({
      [attribute]: numValue
    }));

    // Update derived stats if needed
    if (attribute === 'constitution') {
      // Update HP based on constitution
      const newMaxHp = numValue * 10;
      dispatch(wizardActionCreators.setStats({
        maxHp: newMaxHp,
        currentHp: newMaxHp
      }));
    } else if (attribute === 'intelligence') {
      // Update mana based on intelligence
      const newMaxMana = numValue * 5;
      dispatch(wizardActionCreators.setStats({
        maxMana: newMaxMana,
        currentMana: newMaxMana
      }));
    }
  };

  // Handle derived stat change
  const handleDerivedStatChange = (stat, value) => {
    const numValue = parseInt(value, 10) || 0;

    dispatch(wizardActionCreators.setStats({
      [stat]: numValue
    }));
  };

  // Handle resistance change
  const handleResistanceChange = (damageType, value) => {
    const numValue = parseInt(value, 10) || 0;

    const updatedResistances = {
      ...wizardState.resistances
    };

    if (numValue === 0) {
      // Remove resistance if set to 0
      delete updatedResistances[damageType];
    } else {
      updatedResistances[damageType] = numValue;
    }

    dispatch(wizardActionCreators.setResistances(updatedResistances));
  };

  // Handle vulnerability change
  const handleVulnerabilityChange = (damageType, value) => {
    const numValue = parseInt(value, 10) || 0;

    const updatedVulnerabilities = {
      ...wizardState.vulnerabilities
    };

    if (numValue === 0) {
      // Remove vulnerability if set to 0
      delete updatedVulnerabilities[damageType];
    } else {
      updatedVulnerabilities[damageType] = numValue;
    }

    dispatch(wizardActionCreators.setVulnerabilities(updatedVulnerabilities));
  };

  // Helper function to calculate attribute modifier
  const getAttributeModifier = (attributeValue) => {
    return Math.floor((attributeValue - 10) / 2);
  };

  // Helper function to render attribute modifier
  const renderModifier = (value) => {
    const mod = getAttributeModifier(value);
    return mod >= 0 ? `+${mod}` : mod;
  };

  return (
    <div className="wizard-step">
      <h2 className="step-title">Statistics</h2>

      <div className="stats-container">
        {/* Core Attributes */}
        <div className="stats-section">
          <h3>Core Attributes</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="strength">Strength</label>
              <input
                id="strength"
                type="number"
                min="1"
                max="30"
                value={wizardState.stats.strength}
                onChange={(e) => handleAttributeChange('strength', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.strength / 30) * 100}%` }}></div>
              </div>
              <div className="attribute-mod">{renderModifier(wizardState.stats.strength)}</div>
            </div>

            <div className="stat-item">
              <label htmlFor="agility">Agility</label>
              <input
                id="agility"
                type="number"
                min="1"
                max="30"
                value={wizardState.stats.agility}
                onChange={(e) => handleAttributeChange('agility', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.agility / 30) * 100}%` }}></div>
              </div>
              <div className="attribute-mod">{renderModifier(wizardState.stats.agility)}</div>
            </div>

            <div className="stat-item">
              <label htmlFor="constitution">Constitution</label>
              <input
                id="constitution"
                type="number"
                min="1"
                max="30"
                value={wizardState.stats.constitution}
                onChange={(e) => handleAttributeChange('constitution', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.constitution / 30) * 100}%` }}></div>
              </div>
              <div className="attribute-mod">{renderModifier(wizardState.stats.constitution)}</div>
            </div>

            <div className="stat-item">
              <label htmlFor="intelligence">Intelligence</label>
              <input
                id="intelligence"
                type="number"
                min="1"
                max="30"
                value={wizardState.stats.intelligence}
                onChange={(e) => handleAttributeChange('intelligence', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.intelligence / 30) * 100}%` }}></div>
              </div>
              <div className="attribute-mod">{renderModifier(wizardState.stats.intelligence)}</div>
            </div>

            <div className="stat-item">
              <label htmlFor="spirit">Spirit</label>
              <input
                id="spirit"
                type="number"
                min="1"
                max="30"
                value={wizardState.stats.spirit}
                onChange={(e) => handleAttributeChange('spirit', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.spirit / 30) * 100}%` }}></div>
              </div>
              <div className="attribute-mod">{renderModifier(wizardState.stats.spirit)}</div>
            </div>

            <div className="stat-item">
              <label htmlFor="charisma">Charisma</label>
              <input
                id="charisma"
                type="number"
                min="1"
                max="30"
                value={wizardState.stats.charisma}
                onChange={(e) => handleAttributeChange('charisma', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.charisma / 30) * 100}%` }}></div>
              </div>
              <div className="attribute-mod">{renderModifier(wizardState.stats.charisma)}</div>
            </div>
          </div>
        </div>

        {/* Derived Stats */}
        <div className="stats-section">
          <h3>Derived Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="maxHp">Max HP</label>
              <input
                id="maxHp"
                type="number"
                min="1"
                value={wizardState.stats.maxHp}
                onChange={(e) => handleDerivedStatChange('maxHp', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.maxHp / 300) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="currentHp">Current HP</label>
              <input
                id="currentHp"
                type="number"
                min="0"
                max={wizardState.stats.maxHp}
                value={wizardState.stats.currentHp}
                onChange={(e) => handleDerivedStatChange('currentHp', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill health-bar" style={{ width: `${(wizardState.stats.currentHp / wizardState.stats.maxHp) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="maxMana">Max Mana</label>
              <input
                id="maxMana"
                type="number"
                min="0"
                value={wizardState.stats.maxMana}
                onChange={(e) => handleDerivedStatChange('maxMana', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.maxMana / 200) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="currentMana">Current Mana</label>
              <input
                id="currentMana"
                type="number"
                min="0"
                max={wizardState.stats.maxMana}
                value={wizardState.stats.currentMana}
                onChange={(e) => handleDerivedStatChange('currentMana', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill mana-bar" style={{ width: `${(wizardState.stats.currentMana / wizardState.stats.maxMana) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="armorClass">Armor Class</label>
              <input
                id="armorClass"
                type="number"
                min="1"
                value={wizardState.stats.armorClass}
                onChange={(e) => handleDerivedStatChange('armorClass', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.armorClass / 30) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="initiative">Initiative</label>
              <input
                id="initiative"
                type="number"
                min="0"
                value={wizardState.stats.initiative}
                onChange={(e) => handleDerivedStatChange('initiative', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.initiative / 10) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="maxActionPoints">Max Action Points</label>
              <input
                id="maxActionPoints"
                type="number"
                min="1"
                max="10"
                value={wizardState.stats.maxActionPoints}
                onChange={(e) => handleDerivedStatChange('maxActionPoints', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.maxActionPoints / 10) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="currentActionPoints">Current AP</label>
              <input
                id="currentActionPoints"
                type="number"
                min="0"
                max={wizardState.stats.maxActionPoints}
                value={wizardState.stats.currentActionPoints}
                onChange={(e) => handleDerivedStatChange('currentActionPoints', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill ap-bar" style={{ width: `${(wizardState.stats.currentActionPoints / wizardState.stats.maxActionPoints) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="armor">Armor</label>
              <input
                id="armor"
                type="number"
                min="0"
                value={wizardState.stats.armor}
                onChange={(e) => handleDerivedStatChange('armor', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.armor / 100) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Stats */}
        <div className="stats-section">
          <h3>Combat Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="criticalChance">Critical Chance (%)</label>
              <input
                id="criticalChance"
                type="number"
                min="0"
                max="100"
                value={wizardState.stats.criticalChance}
                onChange={(e) => handleDerivedStatChange('criticalChance', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${wizardState.stats.criticalChance}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="criticalMultiplier">Critical Multiplier</label>
              <input
                id="criticalMultiplier"
                type="number"
                min="1"
                step="0.1"
                value={wizardState.stats.criticalMultiplier}
                onChange={(e) => handleDerivedStatChange('criticalMultiplier', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.criticalMultiplier / 5) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="hitChance">Hit Chance (%)</label>
              <input
                id="hitChance"
                type="number"
                min="0"
                max="100"
                value={wizardState.stats.hitChance}
                onChange={(e) => handleDerivedStatChange('hitChance', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${wizardState.stats.hitChance}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="evasion">Evasion (%)</label>
              <input
                id="evasion"
                type="number"
                min="0"
                max="100"
                value={wizardState.stats.evasion}
                onChange={(e) => handleDerivedStatChange('evasion', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${wizardState.stats.evasion}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="parryChance">Parry Chance (%)</label>
              <input
                id="parryChance"
                type="number"
                min="0"
                max="100"
                value={wizardState.stats.parryChance || 0}
                onChange={(e) => handleDerivedStatChange('parryChance', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${wizardState.stats.parryChance || 0}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="spellPower">Spell Power</label>
              <input
                id="spellPower"
                type="number"
                min="0"
                value={wizardState.stats.spellPower}
                onChange={(e) => handleDerivedStatChange('spellPower', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.spellPower / 100) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="healingPower">Healing Power</label>
              <input
                id="healingPower"
                type="number"
                min="0"
                value={wizardState.stats.healingPower}
                onChange={(e) => handleDerivedStatChange('healingPower', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.healingPower / 100) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Damage Types */}
        <div className="stats-section">
          <h3>Physical Damage</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="slashingDamage">Slashing Damage</label>
              <input
                id="slashingDamage"
                type="number"
                min="0"
                value={wizardState.stats.slashingDamage || 0}
                onChange={(e) => handleDerivedStatChange('slashingDamage', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${((wizardState.stats.slashingDamage || 0) / 100) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="piercingDamage">Piercing Damage</label>
              <input
                id="piercingDamage"
                type="number"
                min="0"
                value={wizardState.stats.piercingDamage || 0}
                onChange={(e) => handleDerivedStatChange('piercingDamage', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${((wizardState.stats.piercingDamage || 0) / 100) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="bludgeoningDamage">Bludgeoning Damage</label>
              <input
                id="bludgeoningDamage"
                type="number"
                min="0"
                value={wizardState.stats.bludgeoningDamage || 0}
                onChange={(e) => handleDerivedStatChange('bludgeoningDamage', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${((wizardState.stats.bludgeoningDamage || 0) / 100) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Regeneration Stats */}
        <div className="stats-section">
          <h3>Regeneration</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="healthRegen">Health Regen</label>
              <input
                id="healthRegen"
                type="number"
                min="0"
                value={wizardState.stats.healthRegen}
                onChange={(e) => handleDerivedStatChange('healthRegen', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.healthRegen / 20) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="manaRegen">Mana Regen</label>
              <input
                id="manaRegen"
                type="number"
                min="0"
                value={wizardState.stats.manaRegen}
                onChange={(e) => handleDerivedStatChange('manaRegen', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.manaRegen / 20) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Movement */}
        <div className="stats-section">
          <h3>Movement</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="speed">Walking Speed</label>
              <input
                id="speed"
                type="number"
                min="0"
                value={wizardState.stats.speed}
                onChange={(e) => handleDerivedStatChange('speed', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.speed / 60) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="flying">Flying Speed</label>
              <input
                id="flying"
                type="number"
                min="0"
                value={wizardState.stats.flying}
                onChange={(e) => handleDerivedStatChange('flying', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.flying / 60) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="swimming">Swimming Speed</label>
              <input
                id="swimming"
                type="number"
                min="0"
                value={wizardState.stats.swimming}
                onChange={(e) => handleDerivedStatChange('swimming', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.swimming / 60) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="stats-section">
          <h3>Vision</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <label htmlFor="sightRange">Sight Range</label>
              <input
                id="sightRange"
                type="number"
                min="0"
                value={wizardState.stats.sightRange}
                onChange={(e) => handleDerivedStatChange('sightRange', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.sightRange / 120) * 100}%` }}></div>
              </div>
            </div>

            <div className="stat-item">
              <label htmlFor="darkvision">Darkvision Range</label>
              <input
                id="darkvision"
                type="number"
                min="0"
                value={wizardState.stats.darkvision}
                onChange={(e) => handleDerivedStatChange('darkvision', e.target.value)}
              />
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(wizardState.stats.darkvision / 120) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      {/* Resistances & Vulnerabilities */}
      <div className="stats-section">
        <h3>Resistances & Vulnerabilities</h3>

        <div className="damage-types-grid">
          <div className="damage-type-header">Damage Type</div>
          <div className="damage-type-header">Resistance</div>
          <div className="damage-type-header">Vulnerability</div>

          {DAMAGE_TYPES.map(damageType => (
            <React.Fragment key={damageType.id}>
              <div className="damage-type-name" data-type={damageType.name}>{damageType.name}</div>

              <div className="damage-type-value">
                <select
                  value={wizardState.resistances[damageType.id] || 0}
                  onChange={(e) => handleResistanceChange(damageType.id, e.target.value)}
                  aria-label={`${damageType.name} resistance`}
                >
                  {RESISTANCE_VALUES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="damage-type-value">
                <select
                  value={wizardState.vulnerabilities[damageType.id] || 0}
                  onChange={(e) => handleVulnerabilityChange(damageType.id, e.target.value)}
                  aria-label={`${damageType.name} vulnerability`}
                >
                  {RESISTANCE_VALUES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2Statistics;
