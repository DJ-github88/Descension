import React, { useState } from 'react';
import { BESTIARY_DATA } from '../../data/creatureData';
import './BestiaryDisplay.css';

const DANGER_COLORS = {
  Low: { bg: '#2d6a4f', text: '#fff' },
  Medium: { bg: '#bc6c25', text: '#fff' },
  High: { bg: '#9b2226', text: '#fff' }
};

const REGION_ICONS = {
  'frostwood-reach': 'fa-tree',
  'nordhalla': 'fa-snowflake',
  'sundale': 'fa-fire',
  'iceheart-sea': 'fa-water',
  'cragjaw-peaks': 'fa-mountain',
  'sundrift-vale': 'fa-wind',
  'bryngloom': 'fa-leaf'
};

const ATTR_LABELS = { 
  strength: { short: 'STR', full: 'Strength', desc: 'Physical power and muscle' }, 
  agility: { short: 'AGI', full: 'Agility', desc: 'Reflexes, speed, and precision' }, 
  constitution: { short: 'CON', full: 'Constitution', desc: 'Health, stamina, and resilience' }, 
  intelligence: { short: 'INT', full: 'Intelligence', desc: 'Reasoning, memory, and study' }, 
  spirit: { short: 'SPI', full: 'Spirit', desc: 'Awareness, willpower, and magical connection' }, 
  charisma: { short: 'CHA', full: 'Charisma', desc: 'Force of personality and presence' } 
};

const ELEMENT_DETAILS = {
  fire: { label: 'Fire', color: '#ff5722', icon: 'fa-fire' },
  cold: { label: 'Cold / Frost', color: '#00bcd4', icon: 'fa-snowflake' },
  frost: { label: 'Cold / Frost', color: '#00bcd4', icon: 'fa-snowflake' },
  necrotic: { label: 'Necrotic', color: '#9c27b0', icon: 'fa-skull' },
  radiant: { label: 'Radiant', color: '#ffb300', icon: 'fa-sun' },
  psychic: { label: 'Psychic', color: '#e91e63', icon: 'fa-brain' },
  poison: { label: 'Poison', color: '#4caf50', icon: 'fa-biohazard' },
  physical: { label: 'Physical', color: '#a1887f', icon: 'fa-shield-alt' },
  acid: { label: 'Acid', color: '#8bc34a', icon: 'fa-tint' },
  lightning: { label: 'Lightning', color: '#2196f3', icon: 'fa-bolt' }
};

// Core Helper Functions
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const getSoakDieFromArmor = (armorValue = 0) => {
  const armor = Math.max(0, Math.floor(armorValue));
  if (armor < 5) return '—';
  if (armor <= 9) return '1d4';
  if (armor <= 14) return '1d6';
  if (armor <= 19) return '1d8';
  if (armor <= 24) return '1d10';
  if (armor <= 29) return '1d12';
  if (armor <= 34) return '1d12 + 1d4';
  if (armor <= 39) return '1d12 + 1d6';
  if (armor <= 44) return '2d12';
  if (armor <= 49) return '2d12 + 1d4';
  return '2d12 + 1d6';
};

// Dynamic Game-Mechanic Formatter
// Converts raw text descriptions of damage rolls, save DCs, etc., into gorgeous, styled inline RPG badges
const formatCombatMechanicsText = (text) => {
  if (!text) return null;
  
  // Regular expressions to catch:
  // 1. Damage rolls (e.g. 2d10+5, 1d6, 6d8, 10d10) plus optional elemental damage types
  // 2. Difficulty Checks (e.g. DC 14 STR, DC 18 SPI, DC 16 CON)
  // 3. Spacial Ranges and Radii (e.g. 30-ft radius, 60-ft, 30 ft, 60 ft)
  // 4. Hit Points/DR listings (e.g. 40 HP, DR 5)
  const regex = /(\b\d+d\d+(?:\+\d+)?\b(?:\s+(?:piercing|bludgeoning|slashing|cold|fire|psychic|necrotic|radiant|poison|lightning|acid|physical))?|\bDC\s+\d+\s+[A-Z]{3,4}\b|\b\d+-ft\s+(?:radius|cone|range|diameter)?\b|\b\d+\s+HP,\s+DR\s+\d+\b)/gi;
  
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (regex.test(part)) {
      let cls = "bestiary-inline-mechanic";
      let icon = "fa-dice-d20";
      
      const lowerPart = part.toLowerCase();
      if (lowerPart.includes("hp") || lowerPart.includes("dr")) {
        cls += " stats-highlight";
        icon = "fa-heartbeat";
      } else if (lowerPart.includes("dc")) {
        cls += " dc-highlight";
        icon = "fa-gavel";
      } else if (lowerPart.includes("ft")) {
        cls += " range-highlight";
        icon = "fa-arrows-alt";
      } else {
        cls += " roll-highlight";
        icon = "fa-sparkles";
      }
      
      return (
        <span key={i} className={cls}>
          <i className={`fas ${icon} mechanic-icon`}></i>
          {part}
        </span>
      );
    }
    return part;
  });
};

const BestiaryDisplay = () => {
  const [selectedRegion, setSelectedRegion] = useState(BESTIARY_DATA.regions[0].id);
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [activeTab, setActiveTab] = useState('lore'); // 'lore' | 'combat' | 'tactics'

  const currentRegion = BESTIARY_DATA.regions.find(r => r.id === selectedRegion);
  const currentCreature = selectedCreature
    ? currentRegion?.creatures.find(c => c.id === selectedCreature)
    : null;

  const handleBack = () => {
    setSelectedCreature(null);
    setActiveTab('lore'); // Reset tab state
  };

  const renderResistanceBadge = (type, value, isVuln = false) => {
    const details = ELEMENT_DETAILS[type.toLowerCase()] || { label: type, color: '#888', icon: 'fa-shield-alt' };
    const style = {
      border: `1.5px solid ${details.color}`,
      background: `${details.color}10`,
      color: '#3a3020'
    };
    const valString = typeof value === 'number' ? `${value}%` : (value === true || value === '100' ? 'Immune' : value);
    return (
      <div key={type} className={`bestiary-res-badge ${isVuln ? 'vuln' : 'resist'}`} style={style}>
        <span className="bestiary-res-pill" style={{ backgroundColor: details.color }}>
          <i className={`fas ${details.icon} bestiary-res-icon`}></i>
          {details.label}
        </span>
        <span className="bestiary-res-value-text" style={{ color: isVuln ? '#9b2226' : '#2d6a4f' }}>
          {isVuln ? `Vulnerable (+${valString})` : `Resist (${valString})`}
        </span>
      </div>
    );
  };

  return (
    <div className="bestiary-display">
      {!currentCreature && (
        <div className="bestiary-intro">
          <h3 className="bestiary-intro-title">📜 The Lore of the Wyrd</h3>
          <p className="bestiary-intro-text">
            The Wyrd is a formless primordial spiritual energy that manifests using human fear and folklore
            as a structural blueprint. It cannot create — it can only occupy. The creatures that stalk
            the seven continents are not alien invaders. They are the shape of your own nightmares, given
            flesh by an ancient corruption that has been sealed beneath the world since before the first stars.
            Every region breeds its own monsters from its own fears. Understanding the folklore is understanding
            the weakness.
          </p>
        </div>
      )}

      <div className="bestiary-layout">
        {/* Left Continent Sidebar */}
        <div className="bestiary-sidebar">
          <h4 className="bestiary-sidebar-title">Continents</h4>
          <ul className="bestiary-region-list">
            {BESTIARY_DATA.regions.map(region => (
              <li
                key={region.id}
                className={`bestiary-region-item ${selectedRegion === region.id ? 'active' : ''}`}
                onClick={() => { setSelectedRegion(region.id); setSelectedCreature(null); }}
              >
                <i className={`fas ${REGION_ICONS[region.id] || 'fa-globe'} bestiary-region-icon`}></i>
                <div className="bestiary-region-info">
                  <span className="bestiary-region-name">{region.name}</span>
                  <span className="bestiary-region-folklore">{region.folklore}</span>
                </div>
                <span className="bestiary-region-count">{region.creatures.length}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="bestiary-main">
          {currentCreature ? (
            <div className="bestiary-detail fade-in">
              <button className="bestiary-back-btn" onClick={handleBack}>
                <i className="fas fa-arrow-left"></i> Back to {currentRegion.name}
              </button>

              {/* Creature Banner Header */}
              <div className="bestiary-detail-header">
                <div className="bestiary-detail-title-group">
                  <h2 className="bestiary-detail-name">{currentCreature.name}</h2>
                  <span
                    className="bestiary-detail-badge"
                    style={{ 
                      backgroundColor: DANGER_COLORS[currentCreature.dangerLevel].bg, 
                      color: DANGER_COLORS[currentCreature.dangerLevel].text 
                    }}
                  >
                    {currentCreature.dangerLevel} Danger
                  </span>
                </div>
                <p className="bestiary-detail-role">
                  <i className="fas fa-shield-halved bestiary-header-shield-icon"></i> {currentCreature.role}
                </p>
              </div>

              {/* Double Column Journal Page */}
              <div className="bestiary-detail-body">
                {/* Column 1: Portrait & Quick Stats */}
                <div className="bestiary-portrait-col">
                  {currentCreature.illustration ? (
                    <div className="bestiary-detail-illustration">
                      <div className="bestiary-portrait-frame">
                        <img
                          src={currentCreature.illustration}
                          alt={currentCreature.illustrationCaption || currentCreature.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      {currentCreature.illustrationCaption && (
                        <div className="bestiary-detail-caption">
                          <i className="fas fa-camera-retro"></i> {currentCreature.illustrationCaption}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bestiary-detail-illustration fallback-avatar">
                      <div className="bestiary-portrait-frame empty">
                        <i className={`fas ${REGION_ICONS[currentRegion.id] || 'fa-globe'} fallback-icon`}></i>
                        <span>No sketch available</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Stats Panel (Matching wizard-derived stats) */}
                  {currentCreature.stats && (
                    <div className="bestiary-quick-stats-card">
                      <h4 className="bestiary-quick-stats-title">
                        <i className="fas fa-heart-pulse"></i> Vital Statistics
                      </h4>
                      <div className="bestiary-quick-stats-grid">
                        <div className="bestiary-quick-stat-item hp">
                          <span className="label">HP</span>
                          <span className="value">{currentCreature.stats.maxHp}</span>
                        </div>
                        {currentCreature.stats.maxMana > 0 ? (
                          <div className="bestiary-quick-stat-item mana">
                            <span className="label">Mana</span>
                            <span className="value">{currentCreature.stats.maxMana}</span>
                          </div>
                        ) : (
                          <div className="bestiary-quick-stat-item mana disabled">
                            <span className="label">Mana</span>
                            <span className="value">—</span>
                          </div>
                        )}
                        <div className="bestiary-quick-stat-item ap">
                          <span className="label">AP Limit</span>
                          <span className="value">{currentCreature.stats.maxActionPoints}</span>
                        </div>
                        <div className="bestiary-quick-stat-item speed">
                          <span className="label">Speed</span>
                          <span className="value">{currentCreature.stats.speed} ft</span>
                        </div>
                        <div className="bestiary-quick-stat-item initiative">
                          <span className="label">Initiative</span>
                          <span className="value">
                            {formatModifier(calculateModifier(currentCreature.stats.agility || 10))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column 2: Tabbed Details */}
                <div className="bestiary-tabs-col">
                  {/* Premium Tab Buttons */}
                  <div className="bestiary-tabs-navigation">
                    <button 
                      className={`bestiary-tab-btn ${activeTab === 'lore' ? 'active' : ''}`}
                      onClick={() => setActiveTab('lore')}
                    >
                      <i className="fas fa-scroll"></i> Lore &amp; Legends
                    </button>
                    <button 
                      className={`bestiary-tab-btn ${activeTab === 'combat' ? 'active' : ''}`}
                      onClick={() => setActiveTab('combat')}
                    >
                      <i className="fas fa-swords"></i> Combat Statistics
                    </button>
                    <button 
                      className={`bestiary-tab-btn ${activeTab === 'tactics' ? 'active' : ''}`}
                      onClick={() => setActiveTab('tactics')}
                    >
                      <i className="fas fa-chess-knight"></i> Tactics &amp; Actions
                    </button>
                  </div>

                  {/* Tab 1 Content: Lore & Legends */}
                  {activeTab === 'lore' && (
                    <div className="bestiary-tab-content fade-in">
                      <div className="bestiary-lore-section scroll-bg">
                        <h4><i className="fas fa-feather-pointed"></i> Folklore Origin</h4>
                        <p>{currentCreature.origin}</p>
                      </div>

                      <div className="bestiary-lore-section">
                        <h4><i className="fas fa-dragon"></i> Nature &amp; Behavior</h4>
                        <p>{currentCreature.nature}</p>
                      </div>

                      <div className="bestiary-lore-section">
                        <h4><i className="fas fa-map-location-dot"></i> Habitat</h4>
                        <p>{currentCreature.habitat}</p>
                      </div>

                      <div className="bestiary-lore-section bestiary-depth">
                        <h4><i className="fas fa-mask-cat"></i> The Truth Beneath</h4>
                        <p>{currentCreature.depth}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2 Content: Combat Statistics */}
                  {activeTab === 'combat' && (
                    <div className="bestiary-tab-content fade-in">
                      {currentCreature.stats ? (
                        <>
                          {/* D&D Character Sheet Style Attributes Shield Grid */}
                          <div className="bestiary-attributes-section">
                            <h4 className="bestiary-section-subtitle">
                              <i className="fas fa-shield"></i> Core Attributes
                            </h4>
                            <div className="bestiary-attr-shield-grid">
                              {Object.entries(ATTR_LABELS).map(([key, attr]) => {
                                const score = currentCreature.stats[key] ?? 10;
                                const mod = calculateModifier(score);
                                return (
                                  <div key={key} className="bestiary-attr-shield" title={attr.desc}>
                                    <div className="bestiary-attr-title">{attr.short}</div>
                                    <div className="bestiary-attr-score">{score}</div>
                                    <div className="bestiary-attr-mod-badge">{formatModifier(mod)}</div>
                                    <div className="bestiary-attr-fullname">{attr.full}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Senses and Sights */}
                          <div className="bestiary-senses-section">
                            <h4 className="bestiary-section-subtitle">
                              <i className="fas fa-eye"></i> Senses & Sights
                            </h4>
                            <div className="bestiary-senses-grid">
                              <div className="bestiary-sense-item">
                                <i className="fas fa-person-circle-exclamation"></i>
                                <span className="label">Passive Perception:</span>
                                <span className="value">
                                  {10 + calculateModifier(currentCreature.stats.spirit || 10)}
                                </span>
                              </div>
                              <div className="bestiary-sense-item">
                                <i className="fas fa-moon"></i>
                                <span className="label">Sight:</span>
                                <span className="value">
                                  {currentRegion.id === 'bryngloom' || currentRegion.id === 'nordhalla' 
                                    ? 'Darkvision 60 ft' 
                                    : 'Normal vision'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Colored Resistances and Vulnerabilities */}
                          <div className="bestiary-resistances-section">
                            <h4 className="bestiary-section-subtitle">
                              <i className="fas fa-shield-heart"></i> Resistances &amp; Weaknesses
                            </h4>
                            <div className="bestiary-res-container">
                              {/* Resistances */}
                              {currentCreature.stats.resistances && Object.keys(currentCreature.stats.resistances).length > 0 ? (
                                <div className="bestiary-res-group">
                                  {Object.entries(currentCreature.stats.resistances).map(([type, val]) =>
                                    renderResistanceBadge(type, val, false)
                                  )}
                                </div>
                              ) : null}

                              {/* Vulnerabilities */}
                              {currentCreature.stats.vulnerabilities && Object.keys(currentCreature.stats.vulnerabilities).length > 0 ? (
                                <div className="bestiary-res-group">
                                  {Object.entries(currentCreature.stats.vulnerabilities).map(([type, val]) =>
                                    renderResistanceBadge(type, val, true)
                                  )}
                                </div>
                              ) : null}

                              {(!currentCreature.stats.resistances || Object.keys(currentCreature.stats.resistances).length === 0) &&
                               (!currentCreature.stats.vulnerabilities || Object.keys(currentCreature.stats.vulnerabilities).length === 0) && (
                                <p className="bestiary-no-res">No specific elemental resistances or vulnerabilities noted.</p>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="bestiary-no-stats">
                          <i className="fas fa-triangle-exclamation"></i> No mechanical statistics have been configured for this entity.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3 Content: Tactics & Actions */}
                  {activeTab === 'tactics' && (
                    <div className="bestiary-tab-content fade-in">
                      {/* Combat Guidelines (With dynamically formatted dice/DCs/radii) */}
                      {currentCreature.combat && (
                        <div className="bestiary-tactics-section">
                          <h4 className="bestiary-section-subtitle">
                            <i className="fas fa-chess-board"></i> Combat Behavior &amp; Abilities
                          </h4>
                          <div className="bestiary-narrative-mechanics-card">
                            <p>{formatCombatMechanicsText(currentCreature.combat)}</p>
                          </div>
                        </div>
                      )}

                      {/* Quest Approaches / GM Adventure Hooks */}
                      {currentCreature.hooks && currentCreature.hooks.length > 0 && (
                        <div className="bestiary-tactics-section">
                          <h4 className="bestiary-section-subtitle">
                            <i className="fas fa-compass-drafting"></i> GM Adventure Hooks
                          </h4>
                          <ul className="bestiary-adventure-hooks">
                            {currentCreature.hooks.map((hook, i) => (
                              <li key={i} className="bestiary-hook-card">
                                <div className="bestiary-hook-number">Hook {i + 1}</div>
                                <div className="bestiary-hook-content">{hook}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Continent Overview Title */}
              <div className="bestiary-region-header">
                <h2>{currentRegion?.name}</h2>
                <p className="bestiary-folklore-label">
                  <i className="fas fa-book-open"></i> Folklore Blueprint: {currentRegion?.folklore}
                </p>
              </div>

              {/* Creatures Grid */}
              <div className="bestiary-creature-grid">
                {currentRegion?.creatures.map(creature => (
                  <div
                    key={creature.id}
                    className="bestiary-creature-card"
                    onClick={() => { setSelectedCreature(creature.id); setActiveTab('lore'); }}
                    style={{ borderTopColor: DANGER_COLORS[creature.dangerLevel].bg }}
                  >
                    <div className="bestiary-card-image">
                      {creature.illustration ? (
                        <img
                          src={creature.illustration}
                          alt={creature.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <i className={`fas ${REGION_ICONS[currentRegion.id] || 'fa-globe'} fallback-card-icon`}></i>
                      )}
                    </div>
                    <div className="bestiary-card-body">
                      <div className="bestiary-card-header">
                        <h3>{creature.name}</h3>
                        <span
                          className="bestiary-card-badge"
                          style={{ 
                            backgroundColor: DANGER_COLORS[creature.dangerLevel].bg, 
                            color: DANGER_COLORS[creature.dangerLevel].text 
                          }}
                        >
                          {creature.dangerLevel}
                        </span>
                      </div>
                      <p className="bestiary-card-role">{creature.role}</p>
                      <p className="bestiary-card-origin">{creature.origin.split('.')[0]}.</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestiaryDisplay;
