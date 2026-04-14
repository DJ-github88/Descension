import React, { useState, useMemo, useCallback } from 'react';
import { BIOMES, getBiome, getBiomeWeather, getBiomeEncounter, getAtmosphere } from '../../data/biomeData';
import { FaSnowflake, FaSun, FaTree, FaWater, FaAnchor, FaDungeon, FaDice, FaCloudSunRain, FaHiking, FaSkullCrossbones, FaUtensils, FaBed } from 'react-icons/fa';
import './AdvancedTravelDisplay.css';

const BIOME_ICONS = {
  arctic: FaSnowflake,
  desert: FaSun,
  forest: FaTree,
  swamp: FaWater,
  ocean: FaAnchor,
  underdark: FaDungeon
};

const rollDie = (max) => Math.floor(Math.random() * max) + 1;

const SEVERITY_LABELS = ['Clear', 'Mild', 'Moderate', 'Severe', 'Extreme'];
const SEVERITY_COLORS = ['#4a7a4a', '#6a7a4a', '#8a7a2a', '#b86a1a', '#a83232'];

const HOURLY_CHECKLIST = [
  { hour: 1, encounter: false, rations: false, rest: false, overmarch: false, notes: 'Confirm cold/weather gear. No encounter (just left settlement).' },
  { hour: 2, encounter: true, rations: false, rest: false, overmarch: false, notes: 'First encounter check.' },
  { hour: 3, encounter: false, rations: false, rest: false, overmarch: false, notes: 'Check if anyone at exhaustion level 2+ (speed halved).' },
  { hour: 4, encounter: true, rations: true, rest: true, overmarch: false, notes: 'First ration tick. Recommended short rest.' },
  { hour: 5, encounter: false, rations: false, rest: false, overmarch: false, notes: 'If rest was skipped at hour 4: Con vs d8 or exhaustion.' },
  { hour: 6, encounter: true, rations: false, rest: false, overmarch: false, notes: 'Good moment for fatigue roleplay.' },
  { hour: 7, encounter: false, rations: false, rest: false, overmarch: false, notes: 'Decision point: push for hour 8 or make camp?' },
  { hour: 8, encounter: true, rations: true, rest: false, overmarch: false, notes: 'End of standard travel day. Second ration.' },
  { hour: '9+', encounter: true, rations: false, rest: false, overmarch: true, notes: 'Con vs d10 per 2-hour block, difficulty increases.' }
];

const EXHAUSTION_TABLE = [
  { level: 1, penalty: 'Speed -10 ft', impact: 'Fatigued but functional' },
  { level: 2, penalty: 'Disadvantage on ability checks', impact: 'Skills and tools suffer' },
  { level: 3, penalty: 'Speed halved', impact: 'Severely slowed, affects party pace' },
  { level: 4, penalty: 'Disadvantage on attacks and saves', impact: 'Combat and resistance degraded' },
  { level: 5, penalty: 'HP maximum halved', impact: 'Critically weakened' },
  { level: 6, penalty: 'Death', impact: 'The body gives out' }
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const BiomeSelector = ({ selectedBiome, onSelect }) => (
  <div className="atd-biome-selector">
    {BIOMES.map((b) => {
      const Icon = BIOME_ICONS[b.id];
      const isActive = selectedBiome === b.id;
      return (
        <button
          key={b.id}
          className={`atd-biome-pill ${isActive ? 'active' : ''}`}
          onClick={() => onSelect(b.id)}
          title={b.name}
        >
          <Icon className="atd-biome-pill-icon" />
          <span>{b.name}</span>
        </button>
      );
    })}
  </div>
);

const DiceRoller = ({ label, dieSize, onRoll, result, className }) => (
  <div className={`atd-dice-roller ${className || ''}`}>
    <span className="atd-dice-label">{label}</span>
    <button className="atd-dice-btn" onClick={onRoll} title={`Roll ${dieSize}`}>
      <FaDice className="atd-dice-icon" />
      <span>{dieSize}</span>
    </button>
    {result !== null && result !== undefined && (
      <span className="atd-dice-result atd-fade-in">{result}</span>
    )}
  </div>
);

const SeverityBadge = ({ severity }) => (
  <span
    className="atd-severity-badge"
    style={{
      '--severity-color': SEVERITY_COLORS[Math.min(severity, 4)],
      '--severity-bg': `${SEVERITY_COLORS[Math.min(severity, 4)]}20`
    }}
  >
    {SEVERITY_LABELS[Math.min(severity, 4)]} ({severity})
  </span>
);

const CollapsibleSection = ({ title, icon: Icon, defaultOpen = false, children, accentColor }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`atd-collapsible ${isOpen ? 'open' : ''}`}>
      <button
        className="atd-collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        style={accentColor ? { '--section-accent': accentColor } : {}}
      >
        {Icon && <Icon className="atd-collapsible-icon" />}
        <span>{title}</span>
        <span className={`atd-chevron ${isOpen ? 'open' : ''}`}>▸</span>
      </button>
      <div className={`atd-collapsible-body ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AdvancedTravelDisplay = () => {
  const [selectedBiome, setSelectedBiome] = useState('arctic');
  const [weatherRoll, setWeatherRoll] = useState(null);
  const [durationRoll, setDurationRoll] = useState(null);
  const [encounterRoll, setEncounterRoll] = useState(null);
  const [atmosphereText, setAtmosphereText] = useState(null);
  const [activeChecklistHour, setActiveChecklistHour] = useState(null);

  const biome = useMemo(() => getBiome(selectedBiome), [selectedBiome]);
  const currentWeather = useMemo(() => {
    if (weatherRoll === null) return null;
    return getBiomeWeather(selectedBiome, weatherRoll);
  }, [selectedBiome, weatherRoll]);
  const currentEncounter = useMemo(() => {
    if (encounterRoll === null) return null;
    return getBiomeEncounter(selectedBiome, encounterRoll);
  }, [selectedBiome, encounterRoll]);

  const handleBiomeChange = useCallback((id) => {
    setSelectedBiome(id);
    setWeatherRoll(null);
    setDurationRoll(null);
    setEncounterRoll(null);
    setAtmosphereText(null);
    setActiveChecklistHour(null);
  }, []);

  const handleRollWeather = useCallback(() => {
    const d20 = rollDie(20);
    const d8 = rollDie(8);
    setWeatherRoll(d20);
    setDurationRoll(d8);
  }, []);

  const handleRollEncounter = useCallback(() => {
    const d20 = rollDie(20);
    setEncounterRoll(d20);
  }, []);

  const handleGenerateAtmosphere = useCallback(() => {
    const severity = currentWeather ? currentWeather.severity : 0;
    const timeOfDay = 'day';
    const text = getAtmosphere(selectedBiome, severity, timeOfDay);
    setAtmosphereText(text);
  }, [selectedBiome, currentWeather]);

  const getEncounterTypeClass = (type) => {
    const map = { combat: 'danger', social: 'green', hazard: 'warn', discovery: 'accent', none: 'muted' };
    return map[type] || 'muted';
  };

  return (
    <div className="atd-container">
      {/* Intro */}
      <div className="atd-intro">
        <p>
          The Advanced Travel System provides a structured, hour-by-hour procedure for running overland journeys.
          Each travel day is broken into discrete hours, and the GM works through a checklist for each one.
          Use the <strong>Travel Tracker</strong> tool (press <kbd>W</kbd> in-game, GM only) to automate rolling, tracking, and broadcasting.
        </p>
        <p className="atd-intro-sub">
          Select a biome below to explore its weather tables, encounter pools, and survival rules interactively.
        </p>
      </div>

      {/* Biome Selector */}
      <BiomeSelector selectedBiome={selectedBiome} onSelect={handleBiomeChange} />

      {/* Biome Header */}
      {biome && (
        <div className="atd-biome-header atd-fade-in" key={selectedBiome}>
          <div className="atd-biome-name">
            {React.createElement(BIOME_ICONS[selectedBiome], { className: 'atd-biome-header-icon' })}
            <span>{biome.name}</span>
          </div>
          <div className="atd-biome-meta">
            <span>{biome.terrainTypes.length} terrain types</span>
            <span className="atd-meta-sep">•</span>
            <span>{biome.transportModes.length} transport modes</span>
            <span className="atd-meta-sep">•</span>
            <span>{biome.encounterTable.length} encounter entries</span>
          </div>
        </div>
      )}

      {/* ─── Interactive Weather ─────────────────────────────────────────── */}
      <CollapsibleSection title="Weather System" icon={FaCloudSunRain} defaultOpen={true} accentColor="#3d6e90">
        <div className="atd-weather-section">
          <div className="atd-weather-roller">
            <div className="atd-roller-group">
              <DiceRoller
                label="Weather Condition"
                dieSize="d20"
                onRoll={handleRollWeather}
                result={weatherRoll}
                className="primary"
              />
              {durationRoll !== null && (
                <div className="atd-duration-result atd-fade-in">
                  Duration: <strong>{durationRoll} hours</strong>
                </div>
              )}
            </div>
            {currentWeather && (
              <div className="atd-weather-card atd-fade-in">
                <div className="atd-weather-card-header">
                  <span className="atd-weather-name">{currentWeather.name}</span>
                  <SeverityBadge severity={currentWeather.severity} />
                </div>
                <div className="atd-weather-card-body">
                  <p className="atd-weather-desc">{currentWeather.desc}</p>
                  <div className="atd-weather-dice-row">
                    <span className="atd-die-tag nav">Nav: {currentWeather.navDie}</span>
                    <span className="atd-die-tag env">Env: {currentWeather.envDie}</span>
                    <span className={`atd-die-tag ${currentWeather.gearEffect === 'auto-pass' ? 'gear-auto' : 'gear-advantage'}`}>
                      {currentWeather.gearEffect === 'auto-pass' ? 'Gear: Auto-pass' : 'Gear: Advantage'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button className="atd-atmosphere-btn" onClick={handleGenerateAtmosphere}>
              Generate Atmosphere Text
            </button>
            {atmosphereText && (
              <blockquote className="atd-atmosphere-quote atd-fade-in">
                {atmosphereText}
              </blockquote>
            )}
          </div>

          {/* Full Weather Table */}
          <div className="atd-table-wrapper">
            <table className="atd-table">
              <thead>
                <tr>
                  <th>d20</th>
                  <th>Condition</th>
                  <th>Sev</th>
                  <th>Nav</th>
                  <th>Env</th>
                  <th>Gear</th>
                  <th>Special</th>
                </tr>
              </thead>
              <tbody>
                {biome?.weatherTable.map((row, i) => {
                  const rangeStr = row.range[0] === row.range[1]
                    ? `${row.range[0]}`
                    : `${row.range[0]}-${row.range[1]}`;
                  const isHighlighted = weatherRoll !== null &&
                    weatherRoll >= row.range[0] && weatherRoll <= row.range[1];
                  return (
                    <tr key={i} className={isHighlighted ? 'atd-row-highlight' : ''}>
                      <td className="atd-cell-range">{rangeStr}</td>
                      <td className="atd-cell-name">{row.name}</td>
                      <td>
                        <span
                          className="atd-mini-badge"
                          style={{ background: `${SEVERITY_COLORS[row.severity]}20`, color: SEVERITY_COLORS[row.severity] }}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="atd-cell-die">{row.navDie}</td>
                      <td className="atd-cell-die">{row.envDie}</td>
                      <td>{row.gearEffect === 'auto-pass' ? 'Auto' : 'Adv'}</td>
                      <td className="atd-cell-desc">{row.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Severity Scale */}
          <div className="atd-severity-scale">
            <span className="atd-severity-scale-label">Severity Scale:</span>
            {SEVERITY_LABELS.map((label, i) => (
              <span key={i} className="atd-severity-pip" style={{ background: `${SEVERITY_COLORS[i]}20`, color: SEVERITY_COLORS[i], borderColor: `${SEVERITY_COLORS[i]}40` }}>
                {i} — {label}
              </span>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* ─── Terrain & Transport ─────────────────────────────────────────── */}
      <CollapsibleSection title="Terrain & Transport" icon={FaHiking} accentColor="#4a7a4a">
        <div className="atd-grid-2">
          <div>
            <h5 className="atd-sub-title">Terrain Types</h5>
            <div className="atd-card-stack">
              {biome?.terrainTypes.map((t) => (
                <div key={t.id} className="atd-info-card">
                  <div className="atd-info-card-header">
                    <span className="atd-info-card-name">{t.name}</span>
                    <span className="atd-info-card-stat">×{t.speedMod}</span>
                  </div>
                  <div className="atd-info-card-body">
                    <span className="atd-die-tag nav" style={{ fontSize: 10 }}>Nav: {t.navDie}</span>
                    <span className="atd-info-card-desc">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="atd-sub-title">Transport Modes</h5>
            <div className="atd-card-stack">
              {biome?.transportModes.map((m) => (
                <div key={m.id} className="atd-info-card">
                  <div className="atd-info-card-header">
                    <span className="atd-info-card-name">{m.name}</span>
                    <span className="atd-info-card-stat">×{m.speed} speed</span>
                  </div>
                  <div className="atd-info-card-body">
                    {m.restEvery && (
                      <span className="atd-die-tag" style={{ fontSize: 10, background: 'rgba(139,115,85,0.1)', color: '#6a5a40' }}>
                        Rest every {m.restEvery}h ({m.restDur}h)
                      </span>
                    )}
                    <span className="atd-info-card-desc">{m.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ─── Encounter System ─────────────────────────────────────────── */}
      <CollapsibleSection title="Encounters" icon={FaSkullCrossbones} accentColor="#a83232">
        <div className="atd-encounter-section">
          <div className="atd-encounter-roller">
            <DiceRoller
              label="Encounter Check"
              dieSize="d20"
              onRoll={handleRollEncounter}
              result={encounterRoll}
              className="danger"
            />
            {currentEncounter && (
              <div className={`atd-encounter-card atd-fade-in atd-encounter-${getEncounterTypeClass(currentEncounter.type)}`}>
                <div className="atd-encounter-card-header">
                  <span className="atd-encounter-label">{currentEncounter.label}</span>
                  <span className={`atd-encounter-type-badge ${getEncounterTypeClass(currentEncounter.type)}`}>
                    {currentEncounter.type}
                  </span>
                </div>
                <p className="atd-encounter-note">{currentEncounter.note}</p>
              </div>
            )}
          </div>

          {/* Full Encounter Table */}
          <div className="atd-table-wrapper">
            <table className="atd-table">
              <thead>
                <tr>
                  <th>d20</th>
                  <th>Type</th>
                  <th>Encounter</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {biome?.encounterTable.map((row, i) => {
                  const rangeStr = row.range[0] === row.range[1]
                    ? `${row.range[0]}`
                    : `${row.range[0]}-${row.range[1]}`;
                  const isHighlighted = encounterRoll !== null &&
                    encounterRoll >= row.range[0] && encounterRoll <= row.range[1];
                  return (
                    <tr key={i} className={isHighlighted ? 'atd-row-highlight' : ''}>
                      <td className="atd-cell-range">{rangeStr}</td>
                      <td>
                        <span className={`atd-encounter-type-badge ${getEncounterTypeClass(row.type)}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="atd-cell-name">{row.label}</td>
                      <td className="atd-cell-desc">{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* ─── Hourly Checklist ─────────────────────────────────────────── */}
      <CollapsibleSection title="Hourly Checklist" icon={FaUtensils} accentColor="#9a6e10">
        <div className="atd-checklist">
          <p className="atd-checklist-intro">
            Click an hour to see what to check. A standard travel day is <strong>8 hours</strong>. Beyond hour 8 is overmarching territory.
          </p>
          <div className="atd-hour-strip">
            {HOURLY_CHECKLIST.map((row, i) => {
              const isActive = activeChecklistHour === i;
              const isOvermarch = row.overmarch;
              return (
                <button
                  key={i}
                  className={`atd-hour-cell ${isActive ? 'active' : ''} ${isOvermarch ? 'overmarch' : ''}`}
                  onClick={() => setActiveChecklistHour(isActive ? null : i)}
                >
                  {row.hour}
                </button>
              );
            })}
          </div>
          {activeChecklistHour !== null && (
            <div className="atd-checklist-detail atd-fade-in">
              {(() => {
                const row = HOURLY_CHECKLIST[activeChecklistHour];
                return (
                  <>
                    <h5 className="atd-checklist-hour-title">Hour {row.hour}</h5>
                    <div className="atd-checklist-flags">
                      <span className={`atd-checklist-flag ${row.encounter ? 'on' : 'off'}`}>⚔ Encounter</span>
                      <span className={`atd-checklist-flag ${row.rations ? 'on' : 'off'}`}>🍖 Rations</span>
                      <span className={`atd-checklist-flag ${row.rest ? 'on' : 'off'}`}>⛺ Rest</span>
                      <span className={`atd-checklist-flag ${row.overmarch ? 'on danger' : 'off'}`}>⚠ Overmarch</span>
                    </div>
                    <p className="atd-checklist-notes">{row.notes}</p>
                  </>
                );
              })()}
            </div>
          )}

          {/* Checklist Summary Table */}
          <div className="atd-table-wrapper" style={{ marginTop: 12 }}>
            <table className="atd-table atd-table-compact">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>Encounter</th>
                  <th>Rations</th>
                  <th>Rest</th>
                  <th>Overmarch</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {HOURLY_CHECKLIST.map((row, i) => (
                  <tr
                    key={i}
                    className={`${activeChecklistHour === i ? 'atd-row-highlight' : ''} ${row.overmarch ? 'atd-row-danger' : ''}`}
                    onClick={() => setActiveChecklistHour(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="atd-cell-range">{row.hour}</td>
                    <td>{row.encounter ? '✓' : '—'}</td>
                    <td>{row.rations ? '✓' : '—'}</td>
                    <td>{row.rest ? '✓' : '—'}</td>
                    <td>{row.overmarch ? '⚠' : '—'}</td>
                    <td className="atd-cell-desc">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>

      {/* ─── Exhaustion & Survival ─────────────────────────────────────── */}
      <CollapsibleSection title="Exhaustion & Survival" icon={FaBed} accentColor="#8b4000">
        <div className="atd-exhaustion-section">
          <div className="atd-exhaustion-intro">
            <p>
              Exhaustion is the primary threat during extended travel. Characters gain levels from failing environmental saves,
              missing rations, skipping rest, overmarching, and biome-specific hazards.
            </p>
          </div>

          {/* Visual Exhaustion Track */}
          <div className="atd-exhaustion-track-visual">
            {EXHAUSTION_TABLE.map((row) => (
              <div key={row.level} className={`atd-exhaustion-level ${row.level >= 5 ? 'critical' : ''} ${row.level === 6 ? 'death' : ''}`}>
                <span className="atd-exhaustion-num">{row.level}</span>
                <div className="atd-exhaustion-info">
                  <span className="atd-exhaustion-penalty">{row.penalty}</span>
                  <span className="atd-exhaustion-impact">{row.impact}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="atd-grid-2" style={{ marginTop: 12 }}>
            <div>
              <h5 className="atd-sub-title">Environmental Saves</h5>
              <div className="atd-rules-block">
                <p>Each hour of travel in severe weather requires a <strong>Constitution save</strong> against the weather's environmental die.</p>
                <ul>
                  <li><strong>Severity 0-1:</strong> Proper gear grants auto-pass</li>
                  <li><strong>Severity 2-4:</strong> Gear grants advantage only</li>
                  <li>Without gear: roll normally</li>
                  <li>Resistance/immunity: always auto-pass</li>
                </ul>
              </div>
            </div>
            <div>
              <h5 className="atd-sub-title">Overmarching</h5>
              <div className="atd-rules-block">
                <p>Pushing past 8 hours is dangerous:</p>
                <ul>
                  <li><strong>Hours 9-10:</strong> Con vs d10 or 1 exhaustion</li>
                  <li><strong>Hours 11-12:</strong> Con vs d12, speed halved</li>
                  <li><strong>Hours 13-14:</strong> Con vs d20 — survival territory</li>
                  <li>Beyond hour 14 is not recommended</li>
                </ul>
              </div>
            </div>
          </div>

          <h5 className="atd-sub-title" style={{ marginTop: 16 }}>Recovery</h5>
          <div className="atd-table-wrapper">
            <table className="atd-table atd-table-compact">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Recovery</th>
                  <th>Requirements</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Long rest with provisions</td><td>1 level</td><td>Warmth/shade + rations + water + 8 hours</td></tr>
                <tr><td>Long rest without provisions</td><td>0 levels</td><td>Does not remove exhaustion</td></tr>
                <tr><td>Lesser Restoration</td><td>1 level</td><td>Spell or equivalent</td></tr>
                <tr><td>Greater Restoration</td><td>All levels</td><td>Spell or equivalent</td></tr>
                <tr><td>Healer's kit + Medicine</td><td>1 level</td><td>Medicine vs d8, consumes 2 uses</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default AdvancedTravelDisplay;
