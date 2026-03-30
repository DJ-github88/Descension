import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/CreatureInspectView.css';

// Helper function to calculate ability modifier
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

// Helper function to format modifier with + or - sign
const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

const CreatureInspectView = ({ creature, onClose }) => {
  const [activeTab, setActiveTab] = useState('stats');

  if (!creature) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return ReactDOM.createPortal(
    <div className="creature-inspect-overlay" onClick={onClose}>
      <div className="creature-inspect-window" onClick={(e) => e.stopPropagation()}>
        <div className="creature-inspect-header">
          <div className="creature-inspect-title">
            <div
              className="creature-icon"
              style={{
                backgroundImage: `url(${getIconUrl(creature.tokenIcon)})`,
                borderColor: creature.tokenBorder
              }}
            ></div>
            <div>
              <h2>{creature.name}</h2>
              <div className="creature-subtitle">
                {creature.stats.challengeRating && (
                  <span>CR {creature.stats.challengeRating} </span>
                )}
                {creature.size} {creature.type}
              </div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="creature-inspect-tabs">
          <button
            className={`creature-inspect-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => handleTabChange('stats')}
          >
            <i className="fas fa-chart-bar"></i> Statistics
          </button>
          <button
            className={`creature-inspect-tab ${activeTab === 'abilities' ? 'active' : ''}`}
            onClick={() => handleTabChange('abilities')}
          >
            <i className="fas fa-magic"></i> Abilities
          </button>
          <button
            className={`creature-inspect-tab ${activeTab === 'loot' ? 'active' : ''}`}
            onClick={() => handleTabChange('loot')}
          >
            <i className="fas fa-coins"></i> Loot
          </button>
          <button
            className={`creature-inspect-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => handleTabChange('description')}
          >
            <i className="fas fa-book-open"></i> Description
          </button>
        </div>

        <div className="creature-inspect-content">
          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <>
              <div className="creature-inspect-section">
                <h3>Attributes</h3>
                <div className="creature-stats-grid">
                  {['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].map(attr => {
                    const value = creature.stats[attr] || 10;
                    const mod = calculateModifier(value);
                    return (
                      <div key={attr} className="creature-stat-block">
                        <div className="stat-name">{attr.substring(0, 3).toUpperCase()}</div>
                        <div className="stat-value">{value} ({formatModifier(mod)})</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="creature-inspect-section">
                <h3>Combat Stats</h3>
                <div className="combat-stats-grid">
                  <div className="combat-stat">
                    <span className="combat-stat-label">HP</span>
                    <span className="combat-stat-value">{creature.stats.maxHp}</span>
                  </div>
                  <div className="combat-stat">
                    <span className="combat-stat-label">AC</span>
                    <span className="combat-stat-value">{creature.stats.armorClass}</span>
                  </div>
                  <div className="combat-stat">
                    <span className="combat-stat-label">Initiative</span>
                    <span className="combat-stat-value">{formatModifier(creature.stats.initiative)}</span>
                  </div>
                  <div className="combat-stat">
                    <span className="combat-stat-label">Speed</span>
                    <span className="combat-stat-value">{creature.stats.speed} ft.</span>
                  </div>
                  {creature.stats.flying > 0 && (
                    <div className="combat-stat">
                      <span className="combat-stat-label">Flying</span>
                      <span className="combat-stat-value">{creature.stats.flying} ft.</span>
                    </div>
                  )}
                  {creature.stats.swimming > 0 && (
                    <div className="combat-stat">
                      <span className="combat-stat-label">Swimming</span>
                      <span className="combat-stat-value">{creature.stats.swimming} ft.</span>
                    </div>
                  )}
                  {creature.stats.darkvision > 0 && (
                    <div className="combat-stat">
                      <span className="combat-stat-label">Darkvision</span>
                      <span className="combat-stat-value">{creature.stats.darkvision} ft.</span>
                    </div>
                  )}
                </div>
              </div>

              {(Object.keys(creature.resistances || {}).length > 0 ||
                Object.keys(creature.vulnerabilities || {}).length > 0) && (
                <div className="creature-inspect-section">
                  <h3>Resistances & Vulnerabilities</h3>
                  <div className="resistances-grid">
                    {Object.keys(creature.resistances || {}).length > 0 && (
                      <div className="resistance-group">
                        <h4>Resistances</h4>
                        <ul className="resistance-list">
                          {Object.entries(creature.resistances).map(([type, value]) => (
                            <li key={`resist-${type}`} className="resistance-item">
                              <span className="damage-type">{type}</span>: {value}%
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Object.keys(creature.vulnerabilities || {}).length > 0 && (
                      <div className="vulnerability-group">
                        <h4>Vulnerabilities</h4>
                        <ul className="vulnerability-list">
                          {Object.entries(creature.vulnerabilities).map(([type, value]) => (
                            <li key={`vuln-${type}`} className="vulnerability-item">
                              <span className="damage-type">{type}</span>: {value}%
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Abilities Tab */}
          {activeTab === 'abilities' && creature.abilities && creature.abilities.length > 0 && (
            <div className="creature-inspect-section">
              <div className="creature-abilities-list">
                {creature.abilities.map((ability, index) => (
                  <div key={index} className="creature-ability">
                    <div className="ability-header">
                      <span className="ability-name">{ability.name}</span>
                      {ability.damage && (
                        <span className="ability-damage">
                          {typeof ability.damage === 'object'
                            ? `${ability.damage.diceCount}d${ability.damage.diceType}${ability.damage.bonus > 0 ? `+${ability.damage.bonus}` : ''} ${ability.damage.damageType || ''}`
                            : `${ability.damage} ${ability.damageType || ''}`
                          }
                        </span>
                      )}
                    </div>
                    <div className="ability-description">{ability.description}</div>
                    {ability.actionPointCost && (
                      <div className="ability-cost">Cost: {ability.actionPointCost} AP</div>
                    )}
                    {ability.cooldown > 0 && (
                      <div className="ability-cooldown">Cooldown: {ability.cooldown} rounds</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loot Tab */}
          {activeTab === 'loot' && creature.lootTable && (
            <div className="creature-inspect-section">
              <div className="loot-table">
                <h3>Currency</h3>
                <div className="currency-drops">
                  {creature.lootTable.currency.gold.max > 0 && (
                    <div className="currency-item">
                      <span className="currency-icon gold"></span>
                      <span className="currency-amount">
                        {creature.lootTable.currency.gold.min === creature.lootTable.currency.gold.max
                          ? creature.lootTable.currency.gold.min
                          : `${creature.lootTable.currency.gold.min}-${creature.lootTable.currency.gold.max}`
                        } Gold
                      </span>
                    </div>
                  )}
                  {creature.lootTable.currency.silver.max > 0 && (
                    <div className="currency-item">
                      <span className="currency-icon silver"></span>
                      <span className="currency-amount">
                        {creature.lootTable.currency.silver.min === creature.lootTable.currency.silver.max
                          ? creature.lootTable.currency.silver.min
                          : `${creature.lootTable.currency.silver.min}-${creature.lootTable.currency.silver.max}`
                        } Silver
                      </span>
                    </div>
                  )}
                  {creature.lootTable.currency.copper.max > 0 && (
                    <div className="currency-item">
                      <span className="currency-icon copper"></span>
                      <span className="currency-amount">
                        {creature.lootTable.currency.copper.min === creature.lootTable.currency.copper.max
                          ? creature.lootTable.currency.copper.min
                          : `${creature.lootTable.currency.copper.min}-${creature.lootTable.currency.copper.max}`
                        } Copper
                      </span>
                    </div>
                  )}
                </div>

                {creature.lootTable.items && creature.lootTable.items.length > 0 && (
                  <>
                    <h3>Items</h3>
                    <div className="item-drops">
                      {creature.lootTable.items.map((item, index) => (
                        <div key={index} className="loot-item">
                          <div className="item-icon-wrapper">
                            <div
                              className="item-icon"
                              style={{
                                backgroundImage: `url(${getIconUrl(item.iconId || 'inv_misc_questionmark')})`,
                                borderColor: item.quality ? getQualityColor(item.quality) : '#ffffff'
                              }}
                            ></div>
                          </div>
                          <div className="item-details">
                            <div className="item-name" style={{ color: item.quality ? getQualityColor(item.quality) : '#ffffff' }}>
                              {item.name || item.itemId}
                            </div>
                            <div className="item-drop-chance">
                              Drop Chance: {item.dropChance}%
                            </div>
                            <div className="item-quantity">
                              Quantity: {item.quantity?.min === item.quantity?.max
                                ? item.quantity?.min || 1
                                : `${item.quantity?.min || 1}-${item.quantity?.max || 1}`
                              }
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && creature.description && (
            <div className="creature-inspect-section">
              <div className="creature-description">{creature.description}</div>
              {creature.tags && creature.tags.length > 0 && (
                <div className="creature-tags-section">
                  <h3>Tags</h3>
                  <div className="creature-tags">
                    {creature.tags.map((tag, index) => (
                      <span key={index} className="creature-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Helper function to get color based on item quality
const getQualityColor = (quality) => {
  switch (quality.toLowerCase()) {
    case 'poor': return '#9d9d9d';
    case 'common': return '#ffffff';
    case 'uncommon': return '#1eff00';
    case 'rare': return '#0070dd';
    case 'epic': return '#a335ee';
    case 'legendary': return '#ff8000';
    case 'artifact': return '#e6cc80';
    default: return '#ffffff';
  }
};

export default CreatureInspectView;
