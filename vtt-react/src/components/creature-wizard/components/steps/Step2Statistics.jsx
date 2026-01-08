import React, { useState } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import { DAMAGE_TYPES } from '../../../spellcrafting-wizard/core/data/damageTypes';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, SKILL_RANKS } from '../../../../constants/skillDefinitions';
import { calculateStatModifier } from '../../../../utils/characterUtils';
import { getIconUrl } from '../../../../utils/assetManager';
import '../../styles/WizardSteps.css';
import './Step2Statistics.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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

  // Get all skills grouped by category
  const skillsByCategory = Object.entries(SKILL_DEFINITIONS).reduce((acc, [skillId, skill]) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push({ id: skillId, ...skill });
    return acc;
  }, {});

  // Get skill rank for a skill
  const getSkillRank = (skillId) => {
    const rankKey = (wizardState.stats.skillRanks && wizardState.stats.skillRanks[skillId]) || 'UNTRAINED';
    return { key: rankKey, ...SKILL_RANKS[rankKey] };
  };

  // Calculate skill modifier
  const calculateSkillModifier = (skill, skillId) => {
    const skillIdToUse = skillId || (typeof skill === 'string' ? skill : skill.id);
    const skillDef = typeof skill === 'object' ? skill : SKILL_DEFINITIONS[skillIdToUse];
    
    const primaryMod = calculateStatModifier(wizardState.stats[skillDef.primaryStat] || 10);
    const secondaryMod = calculateStatModifier(wizardState.stats[skillDef.secondaryStat] || 10);
    const rank = getSkillRank(skillIdToUse);
    const rankBonus = rank.statBonus || 0;

    return primaryMod + Math.floor(secondaryMod / 2) + rankBonus;
  };

  // Handle stat change
  const handleStatChange = (statName, value) => {
    // Convert value to number
    const numValue = parseInt(value, 10) || 0;

    dispatch(wizardActionCreators.setStats({
      [statName]: numValue
    }));
  };

  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Check if skill is selected (exists in creature's skill list)
  const isSkillSelected = (skillId) => {
    return wizardState.stats.skillRanks && wizardState.stats.skillRanks.hasOwnProperty(skillId);
  };

  // Handle skill rank change
  const handleSkillRankChange = (skillId, rankKey) => {
    const updatedSkillRanks = {
      ...(wizardState.stats.skillRanks || {})
    };

    // Always set the rank - checkbox controls whether skill is included
    updatedSkillRanks[skillId] = rankKey;

    dispatch(wizardActionCreators.setStats({
      skillRanks: updatedSkillRanks
    }));
  };

  // Handle damage resistance change
  const handleResistanceChange = (damageType, value) => {
    const updatedResistances = { ...wizardState.resistances };

    if (value === 'none') {
      // Remove resistance if set to none
      delete updatedResistances[damageType];
    } else {
      // Find the resistance level to get the percentage value
      const resistanceLevel = resistanceLevels.find(level => level.value === value);
      if (resistanceLevel) {
        // Store the percentage value for proper tooltip display
        updatedResistances[damageType] = resistanceLevel.percentage;
      }
    }

    dispatch(wizardActionCreators.setResistances(updatedResistances));
  };

  // Handle spell power change
  const handleSpellPowerChange = (damageType, value) => {
    // Convert value to number
    const numValue = parseInt(value, 10) || 0;

    const updatedSpellPowers = {
      ...(wizardState.stats.spellPowers || {})
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
      ...(wizardState.stats.attackPowers || {})
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

  // Helper function to format ability icon paths correctly
  // Folders are capitalized (Utility, Social, etc.) and files use proper names
  const getAbilityIconPath = (path) => {
    // Path should be in format: "utility/icon-name" or "Utility/Icon Name"
    // Return as-is, getAbilityIconUrl will handle the path resolution
    return path;
  };

  // Map damage type IDs to local ability icons
  const getDamageTypeIcon = (damageTypeId) => {
    const iconMap = {
      bludgeoning: 'Bludgeoning/Hammer',
      piercing: 'Piercing/Scatter Shot',
      slashing: 'Slashing/Bloody Meat Cleaver',
      fire: 'Fire/Flame Burst',
      cold: 'Frost/Dripping Ice',
      lightning: 'Lightning/Lightning Bolt',
      thunder: 'Lightning/Lightning Storm',
      acid: 'Poison/Poison Venom',
      force: 'Force/Force Touch',
      necrotic: 'Necrotic/Necrotic Skull',
      radiant: 'Radiant/Radiant Sunburst',
      poison: 'Poison/Poison Venom',
      psychic: 'Psychic/Brain Psionics',
      chaos: 'Chaos/Chaotic Shuffle'
    };
    return getIconUrl(iconMap[damageTypeId] || 'Utility/Utility', 'abilities');
  };

  // Map skill category names to local ability icons
  const getSkillCategoryIcon = (categoryName) => {
    const iconMap = {
      'Combat Mastery': 'Slashing/Crossed Swords',
      'Exploration & Survival': 'Nature/World Map',
      'Social & Influence': 'Social/Golden Crown',
      'Arcane Studies': 'Arcane/Magical Staff'
    };
    return getIconUrl(iconMap[categoryName] || 'Utility/Utility', 'abilities');
  };

  // Map skill IDs to local ability icons
  const getSkillIcon = (skillId) => {
    const iconMap = {
      // Combat Mastery
      weaponMastery: 'Arcane/Enchanted Sword',
      tacticalCombat: 'Slashing/Crossed Swords',
      // Exploration & Survival
      investigation: 'Nature/World Map',
      athletics: 'General/Strength',
      acrobatics: 'Utility/Upward Jump',
      animalHandling: 'Nature/Wolf Dash',
      nature: 'Nature/Nature Natural',
      perception: 'Utility/All Seeing Eye',
      stealth: 'Utility/Hide',
      survival: 'Nature/Sense',
      // Social & Influence
      persuasion: 'Social/Hand Shake',
      deception: 'Utility/Peep',
      leadership: 'Social/Golden Crown',
      intimidation: 'Utility/Roaring Beast Head',
      performance: 'Social/Golden Harp',
      // Arcane Studies
      arcaneKnowledge: 'Arcane/Magical Staff',
      ritualMagic: 'Arcane/Spellcasting Aura',
      arcana: 'Arcane/Magical Staff',
      history: 'Utility/Ornate Symbol',
      insight: 'Utility/All Seeing Eye',
      medicine: 'Healing/Armored Healing',
      religion: 'Radiant/Prayer of the Desperate',
      sleightOfHand: 'Utility/Grab'
    };
    // If skill.icon is already a URL, try to extract the skill ID or use a fallback
    if (skillId && typeof skillId === 'string') {
      return getIconUrl(iconMap[skillId] || 'Utility/Utility', 'abilities');
    }
    return getIconUrl('Utility/Utility', 'abilities');
  };

  // Melee damage types
  const meleeTypes = ['bludgeoning', 'piercing', 'slashing'];

  // Enhanced resistance levels with thematic descriptions
  const resistanceLevels = [
    { value: 'none', label: 'None', modifier: 0, percentage: 100 },
    // Healing from damage (negative multipliers)
    { value: 'vampiric', label: 'Vampiric', modifier: -200, percentage: -200, description: 'Heals for 200% of damage taken' },
    { value: 'absorbing', label: 'Absorbing', modifier: -100, percentage: -100, description: 'Heals for 100% of damage taken' },
    { value: 'draining', label: 'Draining', modifier: -50, percentage: -50, description: 'Heals for 50% of damage taken' },
    { value: 'siphoning', label: 'Siphoning', modifier: -25, percentage: -25, description: 'Heals for 25% of damage taken' },
    // Immunity and resistance
    { value: 'immune', label: 'Immune', modifier: -100, percentage: 0, description: 'Takes no damage' },
    { value: 'highly_resistant', label: 'Highly Resistant', modifier: -75, percentage: 25, description: 'Takes 25% damage' },
    { value: 'resistant', label: 'Resistant', modifier: -50, percentage: 50, description: 'Takes 50% damage' },
    { value: 'guarded', label: 'Guarded', modifier: -25, percentage: 75, description: 'Takes 75% damage' },
    // Increased Damage Taken
    { value: 'susceptible', label: 'Susceptible', modifier: 25, percentage: 125, description: 'Takes 125% damage' },
    { value: 'exposed', label: 'Exposed', modifier: 50, percentage: 150, description: 'Takes 150% damage' },
    { value: 'vulnerable', label: 'Vulnerable', modifier: 100, percentage: 200, description: 'Takes 200% damage' }
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
            { key: 'strength', name: 'Strength', icon: 'General/Strength' },
            { key: 'agility', name: 'Agility', icon: 'Piercing/Scatter Shot' },
            { key: 'constitution', name: 'Constitution', icon: 'Healing/Heart Shield' },
            { key: 'intelligence', name: 'Intelligence', icon: 'Psychic/Brain Psionics' },
            { key: 'spirit', name: 'Spirit', icon: 'Radiant/Radiant Aura' },
            { key: 'charisma', name: 'Charisma', icon: 'Radiant/Radiant Aura' }
          ].map(stat => {
            const value = wizardState.stats[stat.key] || 10;
            const modifier = calculateModifier(value);

            return (
              <div key={stat.key} className="core-stat-item">
                <div className="stat-header">
                  <img
                    src={getIconUrl(stat.icon, 'abilities')}
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
                  src={getIconUrl('Healing/Red Heart', 'abilities')}
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
                  src={getIconUrl('Utility/Glowing Orb', 'abilities')}
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
                  src={getIconUrl('Arcane/Enchanted Sword 2', 'abilities')}
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
                  src={getIconUrl('Utility/Golden Shield', 'abilities')}
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
                  src={getIconUrl('Arcane/Swift Boot', 'abilities')}
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
                  src={getIconUrl('Utility/Running Figure', 'abilities')}
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
                  src={getIconUrl('Utility/Stylized Wing', 'abilities')}
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
                  src={getIconUrl('Piercing/Upward Arrow', 'abilities')}
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
                  src={getIconUrl('Utility/All Seeing Eye', 'abilities')}
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
                  src={getIconUrl('Utility/Watchful Eye', 'abilities')}
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
                  src={getIconUrl('Healing/Armored Healing', 'abilities')}
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
                  src={getIconUrl('Healing/Golden Heart', 'abilities')}
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
                  src={getIconUrl('Healing/Red Heart', 'abilities')}
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
                  src={getIconUrl('Arcane/Orb Manipulation', 'abilities')}
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
                  src={getIconUrl('Utility/Golden Toothed Gear', 'abilities')}
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
                  src={getIconUrl('Healing/Red Heart', 'abilities')}
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
                  src={getIconUrl('Utility/Glowing Orb', 'abilities')}
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
                  src={getIconUrl('Arcane/Enchanted Sword 2', 'abilities')}
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
                  src={getDamageTypeIcon(damageType.id)}
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
                    value={(() => {
                      const currentPercentage = wizardState.resistances[damageType.id];
                      if (currentPercentage === undefined) return 'none';
                      const level = resistanceLevels.find(l => l.percentage === currentPercentage);
                      return level ? level.value : 'none';
                    })()}
                    onChange={(e) => handleResistanceChange(damageType.id, e.target.value)}
                    className={`resistance-select ${wizardState.resistances[damageType.id] || 'none'}`}
                  >
                    {resistanceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label} {level.description && `(${level.description})`}
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
                      value={(wizardState.stats.spellPowers && wizardState.stats.spellPowers[damageType.id]) || 0}
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
                      value={(wizardState.stats.attackPowers && wizardState.stats.attackPowers[damageType.id]) || 0}
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

  // Toggle skill selection (add/remove from creature's skills)
  const toggleSkillSelection = (skillId) => {
    if (isSkillSelected(skillId)) {
      // Remove skill
      const updatedSkillRanks = { ...(wizardState.stats.skillRanks || {}) };
      delete updatedSkillRanks[skillId];
      dispatch(wizardActionCreators.setStats({
        skillRanks: updatedSkillRanks
      }));
    } else {
      // Add skill with default NOVICE rank
      handleSkillRankChange(skillId, 'NOVICE');
    }
  };

  // Toggle category collapse state
  const toggleCategory = (categoryName) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Render skills tab
  const renderSkillsTab = () => {
    return (
      <div className="tab-content">
        <div className="skills-container">
          <div className="skills-header">
            <h3>Skills & Proficiencies</h3>
            <p className="skills-description">
              Select which skills this creature knows and set their proficiency levels.
            </p>
          </div>

          <div className="skills-category-list">
            {Object.entries(skillsByCategory).map(([categoryName, skills]) => {
              const categoryData = Object.values(SKILL_CATEGORIES).find(cat => cat.name === categoryName);
              const isCollapsed = collapsedCategories[categoryName];

              return (
                <div key={categoryName} className="skill-category-section">
                  <div
                    className="skill-category-header"
                    onClick={() => toggleCategory(categoryName)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={getSkillCategoryIcon(categoryName)} alt="" className="skill-category-icon" />
                    <span className="skill-category-name">{categoryName}</span>
                    <i className={`fas fa-chevron-${isCollapsed ? 'down' : 'up'} category-toggle-icon`}></i>
                  </div>
                  {!isCollapsed && (
                    <div className="skills-grid">
                      {skills.map(skill => {
                        const rank = getSkillRank(skill.id);
                        const modifier = calculateSkillModifier(skill, skill.id);
                        const isSelected = isSkillSelected(skill.id);

                        return (
                          <div key={skill.id} className={`skill-row ${isSelected ? 'selected' : ''}`}>
                            <div className="skill-row-left">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSkillSelection(skill.id)}
                                className="skill-checkbox"
                              />
                              <img src={getSkillIcon(skill.id)} alt={skill.name} className="skill-row-icon" />
                              <div className="skill-row-info">
                                <div className="skill-row-name">{skill.name}</div>
                                <div className="skill-row-stats">
                                  <span className="skill-row-modifier">{formatModifier(modifier)}</span>
                                  <span className="skill-row-stat">{skill.primaryStat.charAt(0).toUpperCase()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="skill-row-right">
                              <select
                                value={rank.key}
                                onChange={(e) => handleSkillRankChange(skill.id, e.target.value)}
                                className={`skill-proficiency-select ${rank.key}`}
                                disabled={!isSelected}
                                style={{ borderColor: isSelected ? rank.color : '#d5cbb0' }}
                              >
                                {Object.entries(SKILL_RANKS).map(([rankKey, rankData]) => (
                                  <option key={rankKey} value={rankKey}>
                                    {rankData.name} (+{rankData.statBonus})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wizard-step">
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
