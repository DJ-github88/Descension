import React from 'react';
import useCharacterStore from '../../store/characterStore';
import { calculateStatModifier } from '../../utils/characterUtils';
import StatTooltip from '../tooltips/StatTooltip';
import '../../styles/tooltips.css';

const ELEMENT_COLORS = {
  fire: 'red',
  ice: 'blue',
  lightning: 'yellow',
  poison: 'green',
  // Add more colors for other damage types as needed
};

export default function CharacterStats() {
  const {
    stats,
    derivedStats,
    updateStat,
    resistances,
    spellPower,
    updateResistance,
    updateSpellPower,
    name,
    race,
    updateCharacterInfo,
  } = useCharacterStore();

  const handleStatChange = (statName, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      updateStat(statName, numValue);
    }
  };

  return (
    <div className="stats-container">
      <div className="character-info">
        <div className="info-field">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => updateCharacterInfo('name', e.target.value)}
            className="wow-input"
          />
        </div>
        <div className="info-field">
          <label>Race:</label>
          <input
            type="text"
            value={race}
            onChange={(e) => updateCharacterInfo('race', e.target.value)}
            className="wow-input"
          />
        </div>
      </div>

      <div className="stats-section">
        <h3>Base Stats</h3>
        <div className="stats-grid">
          {Object.entries(stats).map(([stat, value]) => (
            <div key={stat} className="stat-item">
              <StatTooltip stat={stat} value={value} />
              <div className="stat-content">
                <img
                  src={`/icons/${stat}.png`}
                  alt={stat}
                  className="stat-icon"
                />
                <div className="stat-info">
                  <span className="stat-name">{stat}</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleStatChange(stat, e.target.value)}
                    className="stat-value wow-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h3>Health & Mana</h3>
        <div className="resource-grid">
          <div className="resource-item">
            <label>Health:</label>
            <div className="resource-bar health">
              <div
                className="resource-fill"
                style={{ width: `${(derivedStats.currentHealth / derivedStats.maxHealth) * 100}%` }}
              />
              <span className="resource-text">
                {derivedStats.currentHealth} / {derivedStats.maxHealth}
              </span>
            </div>
          </div>
          <div className="resource-item">
            <label>Mana:</label>
            <div className="resource-bar mana">
              <div
                className="resource-fill"
                style={{ width: `${(derivedStats.currentMana / derivedStats.maxMana) * 100}%` }}
              />
              <span className="resource-text">
                {derivedStats.currentMana} / {derivedStats.maxMana}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Advanced Stats</h3>
        <div className="advanced-stats-grid">
          <div className="stat-item">
            <label>Movement Speed:</label>
            <span>{derivedStats.moveSpeed} ft</span>
          </div>
          <div className="stat-item">
            <label>Critical Chance:</label>
            <span>{derivedStats.critChance}%</span>
          </div>
          <div className="stat-item">
            <label>Armor Class:</label>
            <span>{derivedStats.armor}</span>
          </div>
          <div className="stat-item">
            <label>Carrying Capacity:</label>
            <span>{derivedStats.carryingCapacity} lbs</span>
          </div>
          <div className="stat-item">
            <label>Health Regen:</label>
            <span>{derivedStats.healthRegen}/turn</span>
          </div>
          <div className="stat-item">
            <label>Mana Regen:</label>
            <span>{derivedStats.manaRegen}/turn</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Combat Stats</h3>
        <div className="combat-stats-grid">
          <div className="stat-item">
            <label>Melee Damage:</label>
            <span>{derivedStats.damage}</span>
          </div>
          <div className="stat-item">
            <label>Ranged Damage:</label>
            <span>{derivedStats.rangedDamage}</span>
          </div>
          <div className="stat-item">
            <label>Spell Damage:</label>
            <span>{derivedStats.spellDamage}</span>
          </div>
          <div className="stat-item">
            <label>Healing Power:</label>
            <span>{derivedStats.healingPower}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Offensive Stats</h3>
        <div className="stat-group">
          {/* ... existing offensive stats ... */}
        </div>
      </div>

      <div className="spell-power-section">
        <h3 style={{ color: '#69CCF0' }}>Spell Power</h3>
        <div className="spell-power-grid">
          <div className="spell-power-dropdown">
            <select
              className="stat-group-dropdown"
              onChange={(e) => setSelectedSpellType(e.target.value)}
              value={selectedSpellType}
              style={{ 
                borderColor: selectedSpellType === 'all' ? '#69CCF0' : ELEMENT_COLORS[selectedSpellType],
                color: selectedSpellType === 'all' ? '#69CCF0' : ELEMENT_COLORS[selectedSpellType]
              }}
            >
              <option value="all" style={{ color: '#69CCF0' }}>All Spell Types</option>
              {Object.entries(spellPower).map(([type, data]) => (
                <option key={type} value={type} style={{ color: ELEMENT_COLORS[type] }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Magic
                </option>
              ))}
            </select>
          </div>
          <div className="damage-type-grid">
            {Object.entries(spellPower)
              .filter(([type]) => selectedSpellType === 'all' || selectedSpellType === type)
              .map(([type, data]) => (
                <div key={type} 
                  className="damage-type-item" 
                  style={{ 
                    borderColor: ELEMENT_COLORS[type] ? `${ELEMENT_COLORS[type]}40` : 'rgba(255,255,255,0.1)',
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.4), ${ELEMENT_COLORS[type]}10)`
                  }}
                >
                  <div className="damage-type-header">
                    <img src={data.icon} alt={type} className="damage-type-icon" />
                    <label className="damage-type-label" style={{ color: ELEMENT_COLORS[type] }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                  <div className="stat-input-group">
                    <button className="stat-button" onClick={() => updateSpellPower(type, Math.max(0, data.value - 1))}>-</button>
                    <input
                      type="number"
                      value={data.value}
                      onChange={(e) => updateSpellPower(type, Math.max(0, parseInt(e.target.value) || 0))}
                      className="stat-input wow-input"
                      min="0"
                      style={{ color: ELEMENT_COLORS[type] }}
                    />
                    <button className="stat-button" onClick={() => updateSpellPower(type, data.value + 1)}>+</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="character-stats">
        <h3>Resistances</h3>
        <div className="resistance-grid">
          {Object.entries(resistances).map(([type, data]) => (
            <div key={type} className="resistance-item">
              <img 
                src={data.icon} 
                alt={type} 
                className="resistance-icon" 
              />
              <div className="resistance-value" style={{ color: ELEMENT_COLORS[type] }}>
                {data.value || 0}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
