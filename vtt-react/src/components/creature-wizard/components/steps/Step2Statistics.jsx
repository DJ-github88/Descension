import React, { useState } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import { DAMAGE_TYPES } from '../../../spellcrafting-wizard/core/data/damageTypes';
import '../../styles/WizardSteps.css';
import './Step2Statistics.css';
import ReactTooltip from 'react-tooltip';

const Step2Statistics = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();
  const [activeTab, setActiveTab] = useState('core');

  // Calculate ability modifier (D&D style)
  const calculateModifier = (abilityScore) => {
    return Math.floor((abilityScore - 10) / 2);
  };

  // Format modifier for display
  const formatModifier = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // D&D skills with their associated ability
  const SKILLS = [
    { id: 'acrobatics', name: 'Acrobatics', ability: 'agility' },
    { id: 'animalHandling', name: 'Animal Handling', ability: 'spirit' },
    { id: 'arcana', name: 'Arcana', ability: 'intelligence' },
    { id: 'athletics', name: 'Athletics', ability: 'strength' },
    { id: 'deception', name: 'Deception', ability: 'charisma' },
    { id: 'history', name: 'History', ability: 'intelligence' },
    { id: 'insight', name: 'Insight', ability: 'spirit' },
    { id: 'intimidation', name: 'Intimidation', ability: 'charisma' },
    { id: 'investigation', name: 'Investigation', ability: 'intelligence' },
    { id: 'medicine', name: 'Medicine', ability: 'spirit' },
    { id: 'nature', name: 'Nature', ability: 'intelligence' },
    { id: 'perception', name: 'Perception', ability: 'spirit' },
    { id: 'performance', name: 'Performance', ability: 'charisma' },
    { id: 'persuasion', name: 'Persuasion', ability: 'charisma' },
    { id: 'religion', name: 'Religion', ability: 'intelligence' },
    { id: 'sleightOfHand', name: 'Sleight of Hand', ability: 'agility' },
    { id: 'stealth', name: 'Stealth', ability: 'agility' },
    { id: 'survival', name: 'Survival', ability: 'spirit' }
  ];

  // Handle stat change
  const handleStatChange = (statName, value) => {
    // Convert value to number
    const numValue = parseInt(value, 10) || 0;

    dispatch(wizardActionCreators.setStats({
      [statName]: numValue
    }));
  };

  // Handle damage resistance change
  const handleResistanceChange = (damageType, value) => {
    const updatedResistances = { ...wizardState.resistances };

    if (value === 'none') {
      // Remove resistance if set to none
      delete updatedResistances[damageType];
    } else {
      // Update resistance
      updatedResistances[damageType] = value;
    }

    dispatch(wizardActionCreators.setResistances(updatedResistances));
  };

  // Handle spell power change
  const handleSpellPowerChange = (damageType, value) => {
    // Convert value to number
    const numValue = parseInt(value, 10) || 0;

    const updatedSpellPowers = {
      ...(wizardState.spellPowers || {})
    };

    if (numValue === 0) {
      // Remove spell power if set to 0
      delete updatedSpellPowers[damageType];
    } else {
      updatedSpellPowers[damageType] = numValue;
    }

    dispatch(wizardActionCreators.setStats({
      spellPowers: updatedSpellPowers
    }));
  };

  // Handle attack power change
  const handleAttackPowerChange = (damageType, value) => {
    // Convert value to number
    const numValue = parseInt(value, 10) || 0;

    const updatedAttackPowers = {
      ...(wizardState.attackPowers || {})
    };

    if (numValue === 0) {
      // Remove attack power if set to 0
      delete updatedAttackPowers[damageType];
    } else {
      updatedAttackPowers[damageType] = numValue;
    }

    dispatch(wizardActionCreators.setStats({
      attackPowers: updatedAttackPowers
    }));
  };

  // Handle saving throw proficiency change
  const handleSavingThrowChange = (ability, isChecked) => {
    const updatedSavingThrows = {
      ...(wizardState.stats.savingThrows || {})
    };

    if (isChecked) {
      updatedSavingThrows[ability] = true;
    } else {
      delete updatedSavingThrows[ability];
    }

    dispatch(wizardActionCreators.setStats({
      savingThrows: updatedSavingThrows
    }));
  };

  // Handle skill bonus change
  const handleSkillChange = (skillId, value) => {
    const numValue = parseInt(value, 10) || 0;
    const updatedSkills = {
      ...(wizardState.stats.skills || {})
    };

    if (numValue === 0) {
      delete updatedSkills[skillId];
    } else {
      updatedSkills[skillId] = numValue;
    }

    dispatch(wizardActionCreators.setStats({
      skills: updatedSkills
    }));
  };

  // Handle challenge rating change
  const handleChallengeRatingChange = (value) => {
    dispatch(wizardActionCreators.setStats({
      challengeRating: value
    }));

    // Update XP based on challenge rating
    const xpValues = {
      '0': 10,
      '1/8': 25,
      '1/4': 50,
      '1/2': 100,
      '1': 200,
      '2': 450,
      '3': 700,
      '4': 1100,
      '5': 1800,
      '6': 2300,
      '7': 2900,
      '8': 3900,
      '9': 5000,
      '10': 5900,
      '11': 7200,
      '12': 8400,
      '13': 10000,
      '14': 11500,
      '15': 13000,
      '16': 15000,
      '17': 18000,
      '18': 20000,
      '19': 22000,
      '20': 25000,
      '21': 33000,
      '22': 41000,
      '23': 50000,
      '24': 62000,
      '25': 75000,
      '26': 90000,
      '27': 105000,
      '28': 120000,
      '29': 135000,
      '30': 155000
    };

    dispatch(wizardActionCreators.setStats({
      experiencePoints: xpValues[value] || 0
    }));
  };

  // Use imported damage types
  const damageTypes = DAMAGE_TYPES;

  // Melee damage types
  const meleeTypes = ['bludgeoning', 'piercing', 'slashing'];

  // Resistance levels with new system
  const resistanceLevels = [
    { value: 'none', label: 'None', modifier: 0 },
    // Increased Damage Taken
    { value: 'susceptible', label: 'Susceptible (+25%)', modifier: 25 },
    { value: 'exposed', label: 'Exposed (+50%)', modifier: 50 },
    { value: 'vulnerable', label: 'Vulnerable (+100%)', modifier: 100 },
    // Reduced Damage Taken
    { value: 'guarded', label: 'Guarded (-25%)', modifier: -25 },
    { value: 'resistant', label: 'Resistant (-50%)', modifier: -50 },
    { value: 'immune', label: 'Immune (-100%)', modifier: -100 }
  ];

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'core':
        return renderCoreStatsTab();
      case 'combat':
        return renderCombatTab();
      case 'resistances':
        return renderResistancesTab();
      case 'skills':
        return renderSkillsTab();
      default:
        return renderCoreStatsTab();
    }
  };

  // Render core stats tab
  const renderCoreStatsTab = () => (
    <div className="tab-content">
      <div className="stats-builder">
        <div className="stats-header">
          <h3>Core Attributes</h3>
          <p className="stats-description">
            Set the creature's primary ability scores. Modifiers are calculated automatically.
          </p>
        </div>

        <div className="core-stats-grid">
          {[
            { key: 'strength', name: 'Strength', icon: 'inv_gauntlets_04' },
            { key: 'agility', name: 'Agility', icon: 'inv_boots_08' },
            { key: 'constitution', name: 'Constitution', icon: 'inv_chest_plate06' },
            { key: 'intelligence', name: 'Intelligence', icon: 'inv_misc_book_09' },
            { key: 'spirit', name: 'Spirit', icon: 'spell_holy_heal' },
            { key: 'charisma', name: 'Charisma', icon: 'inv_jewelry_necklace_07' }
          ].map(stat => {
            const value = wizardState.stats[stat.key] || 10;
            const modifier = calculateModifier(value);

            return (
              <div key={stat.key} className="core-stat-item">
                <div className="stat-header">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/small/${stat.icon}.jpg`}
                    alt={stat.name}
                    className="stat-icon"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <label htmlFor={`stat-${stat.key}`}>{stat.name}</label>
                </div>
                <div className="stat-input-group">
                  <input
                    id={`stat-${stat.key}`}
                    type="number"
                    min="1"
                    max="30"
                    value={value}
                    onChange={(e) => handleStatChange(stat.key, e.target.value)}
                    className="stat-input"
                  />
                  <div className="stat-modifier">
                    {formatModifier(modifier)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render combat tab
  const renderCombatTab = () => (
    <div className="tab-content">
      <div className="combat-stats-container">
        {/* Primary Combat Stats */}
        <div className="combat-section">
          <h3>Primary Combat Stats</h3>
          <div className="combat-stats-grid">
            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_misc_bone_humanskull_01.jpg"
                  alt="Health"
                  className="stat-icon"
                />
                <label htmlFor="stat-maxHp">Max Health</label>
              </div>
              <input
                id="stat-maxHp"
                type="number"
                min="1"
                value={wizardState.stats.maxHp}
                onChange={(e) => handleStatChange('maxHp', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_elemental_mote_mana.jpg"
                  alt="Mana"
                  className="stat-icon"
                />
                <label htmlFor="stat-maxMana">Max Mana</label>
              </div>
              <input
                id="stat-maxMana"
                type="number"
                min="0"
                value={wizardState.stats.maxMana}
                onChange={(e) => handleStatChange('maxMana', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/ability_warrior_innerrage.jpg"
                  alt="Action Points"
                  className="stat-icon"
                />
                <label htmlFor="stat-maxActionPoints">Max Action Points</label>
              </div>
              <input
                id="stat-maxActionPoints"
                type="number"
                min="1"
                max="10"
                value={wizardState.stats.maxActionPoints}
                onChange={(e) => handleStatChange('maxActionPoints', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_chest_plate06.jpg"
                  alt="Armor"
                  className="stat-icon"
                />
                <label htmlFor="stat-armorClass">Armor</label>
              </div>
              <input
                id="stat-armorClass"
                type="number"
                min="1"
                value={wizardState.stats.armorClass}
                onChange={(e) => handleStatChange('armorClass', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/ability_warrior_charge.jpg"
                  alt="Initiative"
                  className="stat-icon"
                />
                <label htmlFor="stat-initiative">Initiative</label>
              </div>
              <input
                id="stat-initiative"
                type="number"
                min="0"
                value={wizardState.stats.initiative}
                onChange={(e) => handleStatChange('initiative', e.target.value)}
                className="combat-input"
              />
            </div>
          </div>
        </div>

        {/* Movement & Vision */}
        <div className="combat-section">
          <h3>Movement & Vision</h3>
          <div className="movement-stats-grid">
            <div className="movement-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_boots_08.jpg"
                  alt="Speed"
                  className="stat-icon"
                />
                <label htmlFor="stat-speed">Speed (ft)</label>
              </div>
              <input
                id="stat-speed"
                type="number"
                min="0"
                value={wizardState.stats.speed}
                onChange={(e) => handleStatChange('speed', e.target.value)}
                className="movement-input"
              />
            </div>

            <div className="movement-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/ability_druid_flightform.jpg"
                  alt="Flying"
                  className="stat-icon"
                />
                <label htmlFor="stat-flying">Flying (ft)</label>
              </div>
              <input
                id="stat-flying"
                type="number"
                min="0"
                value={wizardState.stats.flying}
                onChange={(e) => handleStatChange('flying', e.target.value)}
                className="movement-input"
              />
            </div>

            <div className="movement-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/ability_druid_aquaticform.jpg"
                  alt="Swimming"
                  className="stat-icon"
                />
                <label htmlFor="stat-swimming">Swimming (ft)</label>
              </div>
              <input
                id="stat-swimming"
                type="number"
                min="0"
                value={wizardState.stats.swimming}
                onChange={(e) => handleStatChange('swimming', e.target.value)}
                className="movement-input"
              />
            </div>

            <div className="movement-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/spell_shadow_detectinvisibility.jpg"
                  alt="Sight Range"
                  className="stat-icon"
                />
                <label htmlFor="stat-sightRange">Sight Range (ft)</label>
              </div>
              <input
                id="stat-sightRange"
                type="number"
                min="0"
                value={wizardState.stats.sightRange}
                onChange={(e) => handleStatChange('sightRange', e.target.value)}
                className="movement-input"
              />
            </div>

            <div className="movement-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/spell_shadow_detectinvisibility.jpg"
                  alt="Darkvision"
                  className="stat-icon"
                />
                <label htmlFor="stat-darkvision">Darkvision (ft)</label>
              </div>
              <input
                id="stat-darkvision"
                type="number"
                min="0"
                value={wizardState.stats.darkvision}
                onChange={(e) => handleStatChange('darkvision', e.target.value)}
                className="movement-input"
              />
            </div>
          </div>
        </div>

        {/* Additional Combat Stats */}
        <div className="combat-section">
          <h3>Additional Combat Stats</h3>
          <div className="combat-stats-grid">
            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/spell_holy_heal.jpg"
                  alt="Healing Power"
                  className="stat-icon"
                />
                <label htmlFor="stat-healingPower">Healing Power</label>
              </div>
              <input
                id="stat-healingPower"
                type="number"
                min="0"
                value={wizardState.stats.healingPower || 0}
                onChange={(e) => handleStatChange('healingPower', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/spell_holy_healingfocus.jpg"
                  alt="Healing Received"
                  className="stat-icon"
                />
                <label htmlFor="stat-healingReceived">Healing Received (%)</label>
              </div>
              <input
                id="stat-healingReceived"
                type="number"
                min="0"
                max="200"
                value={wizardState.stats.healingReceived || 100}
                onChange={(e) => handleStatChange('healingReceived', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/spell_nature_regeneration.jpg"
                  alt="Health Regen"
                  className="stat-icon"
                />
                <label htmlFor="stat-healthRegen">Health Regen (per round)</label>
              </div>
              <input
                id="stat-healthRegen"
                type="number"
                min="0"
                value={wizardState.stats.healthRegen || 0}
                onChange={(e) => handleStatChange('healthRegen', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/spell_nature_lightning.jpg"
                  alt="Mana Regen"
                  className="stat-icon"
                />
                <label htmlFor="stat-manaRegen">Mana Regen (per round)</label>
              </div>
              <input
                id="stat-manaRegen"
                type="number"
                min="0"
                value={wizardState.stats.manaRegen || 0}
                onChange={(e) => handleStatChange('manaRegen', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_misc_coin_01.jpg"
                  alt="Experience Points"
                  className="stat-icon"
                />
                <label htmlFor="stat-experiencePoints">Experience Points</label>
              </div>
              <input
                id="stat-experiencePoints"
                type="number"
                min="0"
                value={wizardState.stats.experiencePoints || 0}
                onChange={(e) => handleStatChange('experiencePoints', e.target.value)}
                className="combat-input"
                data-tooltip-id="xp-tooltip"
                data-tooltip-content="XP awarded when this creature is defeated"
              />
              <ReactTooltip id="xp-tooltip" className="tooltip-style" />
            </div>
          </div>
        </div>

        {/* Current Resources */}
        <div className="combat-section">
          <h3>Current Resources</h3>
          <div className="combat-stats-grid">
            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_misc_bone_humanskull_01.jpg"
                  alt="Current HP"
                  className="stat-icon"
                />
                <label htmlFor="stat-currentHp">Current HP</label>
              </div>
              <input
                id="stat-currentHp"
                type="number"
                min="0"
                max={wizardState.stats.maxHp}
                value={wizardState.stats.currentHp || wizardState.stats.maxHp}
                onChange={(e) => handleStatChange('currentHp', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_elemental_mote_mana.jpg"
                  alt="Current Mana"
                  className="stat-icon"
                />
                <label htmlFor="stat-currentMana">Current Mana</label>
              </div>
              <input
                id="stat-currentMana"
                type="number"
                min="0"
                max={wizardState.stats.maxMana}
                value={wizardState.stats.currentMana || wizardState.stats.maxMana}
                onChange={(e) => handleStatChange('currentMana', e.target.value)}
                className="combat-input"
              />
            </div>

            <div className="combat-stat-item">
              <div className="stat-header">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/ability_warrior_innerrage.jpg"
                  alt="Current AP"
                  className="stat-icon"
                />
                <label htmlFor="stat-currentActionPoints">Current AP</label>
              </div>
              <input
                id="stat-currentActionPoints"
                type="number"
                min="0"
                max={wizardState.stats.maxActionPoints}
                value={wizardState.stats.currentActionPoints || wizardState.stats.maxActionPoints}
                onChange={(e) => handleStatChange('currentActionPoints', e.target.value)}
                className="combat-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render resistances tab
  const renderResistancesTab = () => (
    <div className="tab-content">
      <div className="resistances-container">
        <div className="resistances-header">
          <h3>Damage Resistances & Powers</h3>
          <p className="resistances-description">
            Configure how this creature interacts with different damage types.
          </p>
        </div>

        <div className="damage-types-grid">
          {damageTypes.map(damageType => (
            <div key={damageType.id} className="damage-type-card">
              <div className="damage-type-header">
                <img
                  src={`https://wow.zamimg.com/images/wow/icons/small/${damageType.icon}.jpg`}
                  alt={damageType.name}
                  className="damage-type-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline-block';
                  }}
                />
                <span className="fallback-icon" style={{ display: 'none' }}>
                  {damageType.name.charAt(0).toUpperCase()}
                </span>
                <div className="damage-type-name">
                  {damageType.name}
                </div>
              </div>

              <div className="damage-type-controls">
                <div className="resistance-control">
                  <label>Resistance</label>
                  <select
                    value={wizardState.resistances[damageType.id] || 'none'}
                    onChange={(e) => handleResistanceChange(damageType.id, e.target.value)}
                    className={`resistance-select ${wizardState.resistances[damageType.id] || 'none'}`}
                  >
                    {resistanceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Only show spell power for non-physical damage types */}
                {!meleeTypes.includes(damageType.id) && (
                  <div className="power-control">
                    <label>Spell Power</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={(wizardState.spellPowers && wizardState.spellPowers[damageType.id]) || 0}
                      onChange={(e) => handleSpellPowerChange(damageType.id, e.target.value)}
                      className="power-input"
                    />
                  </div>
                )}

                {/* Show attack power for physical damage types */}
                {meleeTypes.includes(damageType.id) && (
                  <div className="power-control">
                    <label>Attack Power</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={(wizardState.attackPowers && wizardState.attackPowers[damageType.id]) || 0}
                      onChange={(e) => handleAttackPowerChange(damageType.id, e.target.value)}
                      className="power-input"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render skills tab
  const renderSkillsTab = () => (
    <div className="tab-content">
      <div className="skills-container">
        <div className="skills-header">
          <h3>Skills & Proficiencies</h3>
          <p className="skills-description">
            Select which skills this creature is proficient or expert in.
          </p>
        </div>

        <div className="skills-grid">
          {SKILLS.map(skill => {
            const abilityScore = wizardState.stats[skill.ability] || 10;
            const modifier = calculateModifier(abilityScore);
            const skillBonus = (wizardState.stats.skills && wizardState.stats.skills[skill.id]) || 0;
            const totalBonus = modifier + skillBonus;

            return (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <div className="skill-name">
                    {skill.name}
                    <span className="skill-ability">({skill.ability.charAt(0).toUpperCase()})</span>
                  </div>
                  <div className="skill-bonus">
                    {formatModifier(totalBonus)}
                  </div>
                </div>

                <div className="skill-controls">
                  <label htmlFor={`skill-${skill.id}`}>Skill Bonus</label>
                  <input
                    id={`skill-${skill.id}`}
                    type="number"
                    min="0"
                    max="20"
                    value={skillBonus}
                    onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                    className="skill-bonus-input"
                    placeholder="0"
                  />
                  <div className="skill-breakdown">
                    Base: {formatModifier(modifier)} + Bonus: +{skillBonus}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="wizard-step">
      <h2 className="step-title">Statistics</h2>

      {/* Tab Navigation */}
      <div className="stats-tabs">
        <button
          className={`stats-tab ${activeTab === 'core' ? 'active' : ''}`}
          onClick={() => setActiveTab('core')}
        >
          <i className="fas fa-fist-raised"></i>
          Core Stats
        </button>
        <button
          className={`stats-tab ${activeTab === 'combat' ? 'active' : ''}`}
          onClick={() => setActiveTab('combat')}
        >
          <i className="fas fa-sword"></i>
          Combat
        </button>
        <button
          className={`stats-tab ${activeTab === 'resistances' ? 'active' : ''}`}
          onClick={() => setActiveTab('resistances')}
        >
          <i className="fas fa-shield-alt"></i>
          Resistances
        </button>
        <button
          className={`stats-tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <i className="fas fa-tools"></i>
          Skills
        </button>
      </div>

      {/* Tab Content */}
      <div className="stats-container">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Step2Statistics;
