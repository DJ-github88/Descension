import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import WowWindow from './WowWindow';
import useTravelStore from '../../store/travelStore';
import usePartyStore from '../../store/partyStore';
import { BIOMES, getBiome, getAtmosphere, getEncounterTable } from '../../data/biomeData';
import useGameStore from '../../store/gameStore';
import { FaSnowflake, FaSun, FaTree, FaWater, FaAnchor, FaDungeon } from 'react-icons/fa';
import './TravelTrackerWindow.css';

const BIOME_ICONS = {
  arctic: FaSnowflake,
  desert: FaSun,
  forest: FaTree,
  swamp: FaWater,
  ocean: FaAnchor,
  underdark: FaDungeon
};

const TABS = [
  { id: 'setup', label: 'Setup', step: 1 },
  { id: 'journey', label: 'Journey', step: 2 },
  { id: 'encounters', label: 'Encounters', step: 3 },
  { id: 'broadcast', label: 'Broadcast', step: 4 }
];

const getSeverityColor = (severity) => `severity-${Math.min(severity, 4)}`;

const ENCOUNTER_TYPES = ['none', 'combat', 'social', 'hazard', 'discovery'];

const ENCOUNTER_TYPE_LABELS = {
  none: 'None', combat: 'Combat', social: 'Social', hazard: 'Hazard', discovery: 'Discovery'
};

const GEAR_EFFECT_LABELS = {
  'auto-pass': { text: 'Auto-pass', className: 'tt-badge-green' },
  'advantage': { text: 'Advantage', className: 'tt-badge-accent' },
  'none': { text: 'No bonus', className: 'tt-badge-warn' }
};

const PLAYER_GEAR_LABELS = {
  'equipped': { text: 'Equipped', color: '#4a7a4a', bg: 'rgba(74,122,74,0.12)' },
  'none': { text: 'No Gear', color: '#a83232', bg: 'rgba(168,50,50,0.12)' },
  'disadvantage': { text: 'Disadvantage', color: '#c87a2e', bg: 'rgba(200,122,46,0.12)' }
};

const EXHAUSTION_LABELS = ['No exhaustion', 'Level 1: Speed -10 ft', 'Level 2: Disadvantage on checks', 'Level 3: Speed halved', 'Level 4: Disadvantage on attacks/saves', 'Level 5: HP halved', 'Level 6: Dead'];

function useTravelBroadcast() {
  const showRestOverlay = useGameStore(s => s.showRestOverlay);
  const broadcastNarrative = useTravelStore(s => s.broadcastNarrative);

  const broadcastWithOverlay = useCallback((text, category) => {
    broadcastNarrative(text, category);
    showRestOverlay('travel', text);
  }, [broadcastNarrative, showRestOverlay]);

  return { broadcastWithOverlay };
}

function SetupTab() {
  const currentBiome = useTravelStore(s => s.currentBiome);
  const transportMode = useTravelStore(s => s.transportMode);
  const terrainType = useTravelStore(s => s.terrainType);
  const partyExhaustion = useTravelStore(s => s.partyExhaustion);
  const broadcastToggles = useTravelStore(s => s.broadcastToggles);
  const playerGearStates = useTravelStore(s => s.playerGearStates);
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const setBiome = useTravelStore(s => s.setBiome);
  const setTransportMode = useTravelStore(s => s.setTransportMode);
  const setTerrainType = useTravelStore(s => s.setTerrainType);
  const setExhaustion = useTravelStore(s => s.setExhaustion);
  const toggleBroadcast = useTravelStore(s => s.toggleBroadcast);
  const setPlayerGear = useTravelStore(s => s.setPlayerGear);
  const setAllPlayerGear = useTravelStore(s => s.setAllPlayerGear);
  const getSpeed = useTravelStore(s => s.getSpeed);

  const partyMembers = usePartyStore(s => s.partyMembers);

  const connectedPlayers = useMemo(() => {
    if (!partyMembers) return [];
    return partyMembers.filter(m => !m.isGM && m.isConnected);
  }, [partyMembers]);

  const biome = useMemo(() => getBiome(currentBiome), [currentBiome]);
  const speed = useMemo(() => getSpeed(), [transportMode, terrainType, partyExhaustion, currentBiome]);

  const getMemberId = useCallback((m) => m.id || m.userId, []);

  const getGearState = useCallback((member) => {
    const id = getMemberId(member);
    return playerGearStates[id] || 'equipped';
  }, [playerGearStates, getMemberId]);

  const handleGearCycle = useCallback((member) => {
    const id = getMemberId(member);
    const current = playerGearStates[id] || 'equipped';
    const next = current === 'equipped' ? 'none' : current === 'none' ? 'disadvantage' : 'equipped';
    setPlayerGear(id, next);
  }, [playerGearStates, getMemberId, setPlayerGear]);

  const hasAnyUngearred = useMemo(() => {
    return connectedPlayers.some(m => {
      const state = playerGearStates[getMemberId(m)] || 'equipped';
      return state !== 'equipped';
    });
  }, [connectedPlayers, playerGearStates, getMemberId]);

  const allEquipped = !hasAnyUngearred;

  return (
    <div className="tt-tab-content tt-tab-content-fill">
      <div className="tt-setup-section">
        <div className="tt-section-label">
          <span>Biome</span>
          <span className="tt-step-hint">Select your travel environment</span>
        </div>
        <div className="tt-biome-grid">
          {BIOMES.map((b) => {
            const Icon = BIOME_ICONS[b.id];
            return (
              <button
                key={b.id}
                className={`tt-biome-card ${currentBiome === b.id ? 'active' : ''}`}
                onClick={() => setBiome(b.id)}
              >
                <Icon className="tt-biome-card-icon" />
                <span className="tt-biome-card-name">{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="tt-setup-row">
        <div className="tt-setup-section tt-flex-1">
          <div className="tt-section-label">
            <span>Transport</span>
            <span className="tt-step-hint">How is the party traveling?</span>
          </div>
          <div className="tt-transport-grid">
            {biome?.transportModes?.map((m) => (
              <button
                key={m.id}
                className={`tt-btn ${transportMode === m.id ? 'tt-btn-primary' : ''}`}
                onClick={() => setTransportMode(m.id)}
              >
                {m.name}
              </button>
            ))}
          </div>
          {biome?.transportModes?.find(m => m.id === transportMode) && (
            <div className="tt-text-sm tt-text-muted tt-mt-sm">
              {biome.transportModes.find(m => m.id === transportMode).desc}
            </div>
          )}
        </div>

        <div className="tt-setup-section" style={{ minWidth: 180 }}>
          <div className="tt-section-label">
            <span>Speed</span>
          </div>
          <div className="tt-speed-display">
            <span className="tt-speed-value">{speed}</span>
            <span className="tt-speed-unit">mi/hr</span>
          </div>
          <div className="tt-text-sm tt-text-muted tt-text-center">
            {(speed * 14).toFixed(1)} mi/day est.
          </div>
        </div>
      </div>

      <div className="tt-setup-row">
        <div className="tt-setup-section tt-flex-1">
          <div className="tt-section-label">
            <span>Terrain</span>
            <span className="tt-step-hint">What lies ahead?</span>
          </div>
          <select className="tt-select" value={terrainType} onChange={(e) => setTerrainType(parseInt(e.target.value, 10))}>
            {biome?.terrainTypes?.map((t, i) => (
              <option key={t.id} value={i}>{t.name}</option>
            ))}
          </select>
          {biome?.terrainTypes?.[terrainType] && (
            <div className="tt-text-sm tt-text-muted tt-mt-sm">
              {biome.terrainTypes[terrainType].desc}
            </div>
          )}
        </div>

        <div className="tt-setup-section" style={{ minWidth: 180 }}>
          <div className="tt-section-label">
            <span>Exhaustion</span>
          </div>
          <div className="tt-exhaustion-track">
            {[0, 1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                className={`tt-exhaustion-pip ${lvl > 0 && partyExhaustion >= lvl ? 'filled' : ''}`}
                onClick={() => setExhaustion(partyExhaustion === lvl && lvl > 0 ? lvl - 1 : lvl)}
                title={lvl === 0 ? 'No exhaustion' : `Level ${lvl} (click to set)`}
              />
            ))}
          </div>
          <div className="tt-text-sm tt-text-muted tt-mt-sm">
            {partyExhaustion >= 5 ? 'Incapacitated' : partyExhaustion === 0 ? 'No exhaustion' : `Level ${partyExhaustion}`}
          </div>
        </div>
      </div>

      <div className="tt-setup-section">
        <div className="tt-section-label">
          <span>Party Roster</span>
          <span className="tt-step-hint">
            {connectedPlayers.length === 0
              ? 'No players connected'
              : `${connectedPlayers.length} player${connectedPlayers.length > 1 ? 's' : ''}`}
          </span>
        </div>
        {connectedPlayers.length === 0 ? (
          <div className="tt-roster-empty">
            <span className="tt-text-sm tt-text-muted">Players will appear here when they connect to the session.</span>
          </div>
        ) : (
          <div className="tt-roster">
            <div className="tt-roster-header">
              <span className="tt-roster-col-name">Character</span>
              <span className="tt-roster-col-exhaustion">Exhaustion</span>
              <span className="tt-roster-col-gear">
                Environmental Gear
                <button
                  className="tt-btn tt-btn-xs"
                  onClick={() => setAllPlayerGear(allEquipped ? 'none' : 'equipped')}
                  title={allEquipped ? 'Remove gear from all' : 'Equip gear on all'}
                  style={{ marginLeft: 4 }}
                >
                  {allEquipped ? 'Remove All' : 'Equip All'}
                </button>
              </span>
            </div>
            {connectedPlayers.map((member) => {
              const char = member.character || {};
              const exhaustion = char.exhaustionLevel || 0;
              const gearState = getGearState(member);
              const gearLabel = PLAYER_GEAR_LABELS[gearState] || PLAYER_GEAR_LABELS['equipped'];
              const memberName = member.name || char.raceDisplayName || 'Unknown';
              const memberClass = char.class || '';
              return (
                <div key={getMemberId(member)} className="tt-roster-row">
                  <div className="tt-roster-cell tt-roster-cell-name">
                    <div className="tt-roster-avatar">
                      {memberName.charAt(0).toUpperCase()}
                    </div>
                    <div className="tt-roster-name-info">
                      <span className="tt-roster-name">{memberName}</span>
                      {memberClass && <span className="tt-roster-class">{memberClass}</span>}
                    </div>
                  </div>
                  <div className="tt-roster-cell tt-roster-cell-exhaustion">
                    <div className="tt-roster-exhaustion-mini">
                      {[0, 1, 2, 3, 4, 5].map((lvl) => (
                        <span
                          key={lvl}
                          className={`tt-roster-exh-pip ${lvl > 0 && exhaustion >= lvl ? 'filled' : ''}`}
                          title={EXHAUSTION_LABELS[lvl]}
                        />
                      ))}
                    </div>
                    {exhaustion > 0 && (
                      <span className="tt-roster-exh-label">{exhaustion}/5</span>
                    )}
                  </div>
                  <div className="tt-roster-cell tt-roster-cell-gear">
                    <button
                      className="tt-roster-gear-btn"
                      style={{ borderColor: gearLabel.color, background: gearLabel.bg, color: gearLabel.color }}
                      onClick={() => handleGearCycle(member)}
                      title="Click to cycle: Equipped → No Gear → Disadvantage"
                    >
                      {gearLabel.text}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isInMultiplayer && (
        <div className="tt-setup-section tt-setup-broadcast-settings">
          <div className="tt-section-label">
            <span>Broadcast Settings</span>
            <span className="tt-step-hint">Auto-send to players on events</span>
          </div>
          <div className="tt-settings">
            {['atmosphere', 'weather', 'encounter', 'progress', 'exhaustion'].map((type) => (
              <div key={type} className="tt-settings-row">
                <span className="tt-settings-label" style={{ textTransform: 'capitalize' }}>{type}</span>
                <button className={`tt-toggle ${broadcastToggles[type] ? 'on' : ''}`} onClick={() => toggleBroadcast(type)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherPanel({ compact }) {
  const weather = useTravelStore(s => s.weather);
  const weatherRoll = useTravelStore(s => s.weatherRoll);
  const weatherDuration = useTravelStore(s => s.weatherDuration);
  const weatherRemaining = useTravelStore(s => s.weatherRemaining);
  const weatherPrediction = useTravelStore(s => s.weatherPrediction);
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const rollWeather = useTravelStore(s => s.rollWeather);
  const predictWeatherDuration = useTravelStore(s => s.predictWeatherDuration);
  const clearPrediction = useTravelStore(s => s.clearPrediction);
  const getPredictionDie = useTravelStore(s => s.getPredictionDie);
  const { broadcastWithOverlay } = useTravelBroadcast();
  const [showPrediction, setShowPrediction] = useState(false);

  const predictionDie = useMemo(() => getPredictionDie(), [weather, getPredictionDie]);

  const handleBroadcastWeather = useCallback(() => {
    if (!weather) return;
    const text = `[Weather] ${weather.name} (Severity ${weather.severity}) \u2014 ${weather.desc}`;
    broadcastWithOverlay(text, 'weather');
  }, [weather, broadcastWithOverlay]);

  const gearInfo = useMemo(() => {
    if (!weather) return null;
    return GEAR_EFFECT_LABELS[weather.gearEffect] || GEAR_EFFECT_LABELS['none'];
  }, [weather]);

  if (!weather) {
    return (
      <div className={compact ? 'tt-weather-compact-empty' : 'tt-cta-card'}>
        <div className="tt-weather-roll-prompt">
          <div className="tt-weather-roll-icon"><i className="fas fa-cloud-sun" /></div>
          <div>
            <div className="tt-weather-roll-title">Roll for Weather</div>
            <div className="tt-text-sm tt-text-muted">Determine conditions for today&apos;s travel.</div>
          </div>
          <button className="tt-btn tt-btn-primary" onClick={rollWeather}>Roll d20 + d8</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tt-weather-panel">
      <div className="tt-weather-panel-header">
        <div className="tt-weather-panel-condition">
          <span className="tt-weather-condition">{weather.name}</span>
          <div className="tt-row tt-gap-xs">
            <span className={`tt-severity-badge ${getSeverityColor(weather.severity)}`}>Sev {weather.severity}</span>
            <span className="tt-badge tt-badge-accent">{weatherRemaining}h left</span>
            {weatherRemaining <= 0 && <span className="tt-badge tt-badge-danger">EXPIRED</span>}
          </div>
        </div>
        <div className="tt-weather-panel-stats">
          <div className="tt-weather-stat">
            <span className="tt-stat-label">Navigator</span>
            <span className="tt-die-badge nav-die">{weather.navDie}</span>
          </div>
          <div className="tt-weather-stat">
            <span className="tt-stat-label">Environment</span>
            <span className="tt-die-badge env-die">{weather.envDie}</span>
          </div>
          <div className="tt-weather-stat">
            <span className="tt-stat-label">Gear</span>
            {gearInfo && <span className={`tt-badge ${gearInfo.className}`}>{gearInfo.text}</span>}
          </div>
        </div>
      </div>

      <div className="tt-weather-desc">{weather.desc}</div>

      <div className="tt-weather-panel-actions">
        <div className="tt-text-xs tt-text-muted">d20={weatherRoll}, d8={weatherDuration}</div>
        <div className="tt-row" style={{ gap: 4, marginLeft: 'auto' }}>
          {!compact && (
            <button className="tt-btn tt-btn-xs" onClick={() => setShowPrediction(!showPrediction)}>
              <i className="fas fa-eye" style={{ fontSize: 9 }} /> Predict
            </button>
          )}
          {isInMultiplayer && (
            <button className="tt-btn tt-btn-xs tt-btn-broadcast" onClick={handleBroadcastWeather}>Broadcast</button>
          )}
          <button className="tt-btn tt-btn-xs" onClick={rollWeather}>Re-roll</button>
        </div>
      </div>

      {showPrediction && (
        <div className="tt-prediction-panel tt-fade-in">
          <div className="tt-prediction-header">
            <span className="tt-text-bold">Weather Forecast</span>
            <span className="tt-text-xs tt-text-muted">Survival or Nature vs {predictionDie}</span>
            <button className="tt-btn tt-btn-xs" onClick={() => setShowPrediction(false)} style={{ marginLeft: 'auto' }}>
              <i className="fas fa-times" style={{ fontSize: 9 }} />
            </button>
          </div>
          {weatherPrediction ? (
            <div className="tt-prediction-result">
              <div className={`tt-prediction-result-text ${weatherPrediction.outcome}`}>
                {weatherPrediction.text}
              </div>
              <button className="tt-btn tt-btn-xs" onClick={clearPrediction}>Re-predict</button>
            </div>
          ) : (
            <div className="tt-prediction-buttons">
              <span className="tt-text-xs tt-text-muted">Player check result:</span>
              <button className="tt-btn tt-btn-xs tt-btn-primary" onClick={() => predictWeatherDuration('success')}>Success</button>
              <button className="tt-btn tt-btn-xs" onClick={() => predictWeatherDuration('partial')}>Partial</button>
              <button className="tt-btn tt-btn-xs tt-btn-danger-text" onClick={() => predictWeatherDuration('fail')}>Fail</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EncountersTab() {
  const currentBiome = useTravelStore(s => s.currentBiome);
  const lastEncounter = useTravelStore(s => s.lastEncounter);
  const selectedEncounterRow = useTravelStore(s => s.selectedEncounterRow);
  const editingEncounterRow = useTravelStore(s => s.editingEncounterRow);
  const encounterEditDraft = useTravelStore(s => s.encounterEditDraft);
  const encounterLog = useTravelStore(s => s.encounterLog);
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const rollEncounter = useTravelStore(s => s.rollEncounter);
  const rollEncounterFromTable = useTravelStore(s => s.rollEncounterFromTable);
  const selectEncounterRow = useTravelStore(s => s.selectEncounterRow);
  const startEditingEncounter = useTravelStore(s => s.startEditingEncounter);
  const updateEncounterDraft = useTravelStore(s => s.updateEncounterDraft);
  const saveEncounterEdit = useTravelStore(s => s.saveEncounterEdit);
  const cancelEncounterEdit = useTravelStore(s => s.cancelEncounterEdit);
  const addNewEncounterRow = useTravelStore(s => s.addNewEncounterRow);
  const removeEncounterRow = useTravelStore(s => s.removeEncounterRow);
  const { broadcastWithOverlay } = useTravelBroadcast();

  const encounterTable = useMemo(() => getEncounterTable(currentBiome), [currentBiome]);

  const handleRollRandom = useCallback(() => {
    rollEncounter();
  }, [rollEncounter]);

  const handleRowRoll = useCallback((index) => {
    rollEncounterFromTable(index);
  }, [rollEncounterFromTable]);

  const handleBroadcastEncounter = useCallback(() => {
    if (!lastEncounter) return;
    const typeLabel = ENCOUNTER_TYPE_LABELS[lastEncounter.type] || lastEncounter.type;
    const text = `[Encounter] ${typeLabel}: ${lastEncounter.label} \u2014 ${lastEncounter.note}`;
    broadcastWithOverlay(text, 'encounter');
  }, [lastEncounter, broadcastWithOverlay]);

  return (
    <div className="tt-tab-content tt-tab-content-fill tt-encounters-tab">
      <div className="tt-encounter-controls-bar">
        <button className="tt-btn tt-btn-primary" onClick={handleRollRandom}>Roll Random d20</button>
        {isInMultiplayer && lastEncounter && (
          <button className="tt-btn tt-btn-broadcast" onClick={handleBroadcastEncounter}>Broadcast Encounter</button>
        )}
        <button className="tt-btn tt-btn-xs" onClick={addNewEncounterRow} style={{ marginLeft: 'auto' }}>+ Add Row</button>
      </div>

      {lastEncounter && (
        <div className="tt-encounter-result-banner tt-fade-in">
          <div className="tt-row" style={{ gap: 8 }}>
            <span className="tt-text-bold">{lastEncounter.label}</span>
            <span className={`tt-encounter-type ${lastEncounter.type || 'none'}`}>
              {ENCOUNTER_TYPE_LABELS[lastEncounter.type] || lastEncounter.type}
            </span>
            <span className="tt-die-badge encounter-die">d20={lastEncounter.roll}</span>
          </div>
          <div className="tt-text-sm tt-text-muted">{lastEncounter.note}</div>
        </div>
      )}

      <div className="tt-encounter-table-wrap">
        <table className="tt-encounter-table">
          <thead>
            <tr>
              <th style={{ width: 55 }}>d20</th>
              <th style={{ width: 80 }}>Type</th>
              <th>Encounter</th>
              <th style={{ width: 40 }}></th>
              <th style={{ width: 90 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {encounterTable.map((row, i) => {
              const isEditing = editingEncounterRow === i;
              const isSelected = selectedEncounterRow === i && !isEditing;
              return (
                <tr key={i} className={`${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`}>
                  {isEditing && encounterEditDraft ? (
                    <>
                      <td>
                        <div className="tt-row tt-gap-xs">
                          <input className="tt-input tt-input-xs" type="number" min="1" max="20" value={encounterEditDraft.range[0]} onChange={e => updateEncounterDraft('range', [parseInt(e.target.value) || 1, encounterEditDraft.range[1]])} />
                          <span>-</span>
                          <input className="tt-input tt-input-xs" type="number" min="1" max="20" value={encounterEditDraft.range[1]} onChange={e => updateEncounterDraft('range', [encounterEditDraft.range[0], parseInt(e.target.value) || 1])} />
                        </div>
                      </td>
                      <td>
                        <select className="tt-select tt-select-xs" value={encounterEditDraft.type} onChange={e => updateEncounterDraft('type', e.target.value)}>
                          {ENCOUNTER_TYPES.map(t => <option key={t} value={t}>{ENCOUNTER_TYPE_LABELS[t]}</option>)}
                        </select>
                      </td>
                      <td>
                        <input className="tt-input" type="text" value={encounterEditDraft.label} onChange={e => updateEncounterDraft('label', e.target.value)} placeholder="Encounter name" />
                        <input className="tt-input tt-mt-sm" type="text" value={encounterEditDraft.note} onChange={e => updateEncounterDraft('note', e.target.value)} placeholder="GM note" style={{ fontSize: 10 }} />
                      </td>
                      <td />
                      <td className="tt-table-actions">
                        <button className="tt-btn tt-btn-xs tt-btn-primary" onClick={() => saveEncounterEdit()}>Save</button>
                        <button className="tt-btn tt-btn-xs" onClick={() => cancelEncounterEdit()}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="tt-table-range">{row.range[0]}{row.range[0] !== row.range[1] ? `-${row.range[1]}` : ''}</td>
                      <td><span className={`tt-encounter-type ${row.type || 'none'} tt-type-sm`}>{ENCOUNTER_TYPE_LABELS[row.type] || row.type}</span></td>
                      <td className="tt-table-encounter-label">
                        <span className="tt-text-bold">{row.label}</span>
                        <span className="tt-text-sm tt-text-muted">{row.note}</span>
                      </td>
                      <td>
                        <button className="tt-btn tt-btn-xs" onClick={() => handleRowRoll(i)} title="Roll this encounter">
                          <i className="fas fa-dice-d20" style={{ fontSize: 10 }} />
                        </button>
                      </td>
                      <td className="tt-table-actions">
                        <button className="tt-btn tt-btn-xs" onClick={() => startEditingEncounter(i)} title="Edit">
                          <i className="fas fa-pen" style={{ fontSize: 9 }} />
                        </button>
                        <button className="tt-btn tt-btn-xs tt-btn-danger-text" onClick={() => removeEncounterRow(i)} title="Delete">
                          <i className="fas fa-trash" style={{ fontSize: 9 }} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {encounterLog.length > 0 && (
        <div className="tt-encounter-log">
          <div className="tt-section-label"><span>Encounter Log</span></div>
          <div className="tt-encounter-log-entries">
            {encounterLog.slice().reverse().map((entry, i) => (
              <div key={i} className="tt-encounter-log-entry">
                <span className="tt-text-xs tt-text-muted">Hour {entry.hour + 1}</span>
                <span className="tt-text-bold">{entry.encounter.label}</span>
                <span className={`tt-encounter-type ${entry.encounter.type || 'none'} tt-type-xs`}>{ENCOUNTER_TYPE_LABELS[entry.encounter.type]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function JourneyTab() {
  const activeHour = useTravelStore(s => s.activeHour);
  const navStatus = useTravelStore(s => s.navStatus);
  const clock = useTravelStore(s => s.clock);
  const journeyGoal = useTravelStore(s => s.journeyGoal);
  const weather = useTravelStore(s => s.weather);
  const lastEncounter = useTravelStore(s => s.lastEncounter);
  const playerGearStates = useTravelStore(s => s.playerGearStates);
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const selectHour = useTravelStore(s => s.selectHour);
  const setNavStatus = useTravelStore(s => s.setNavStatus);
  const setJourneyGoal = useTravelStore(s => s.setJourneyGoal);
  const advanceHour = useTravelStore(s => s.advanceHour);
  const getSchedule = useTravelStore(s => s.getSchedule);
  const getJourneyProgress = useTravelStore(s => s.getJourneyProgress);
  const getHours = useTravelStore(s => s.getHours);
  const getAtmosphereText = useTravelStore(s => s.getAtmosphereText);
  const rollEncounter = useTravelStore(s => s.rollEncounter);
  const resetDay = useTravelStore(s => s.resetDay);
  const { broadcastWithOverlay } = useTravelBroadcast();

  const hours = useMemo(() => getHours(), []);
  const schedule = useMemo(() => getSchedule(), []);
  const progress = useMemo(() => getJourneyProgress(), [journeyGoal, activeHour, navStatus]);
  const atmosphereText = useMemo(() => getAtmosphereText(), []);
  const activeHourData = useMemo(() => {
    if (activeHour < 0 || !hours[activeHour]) return null;
    return hours[activeHour];
  }, [activeHour, hours]);
  const progressPct = journeyGoal > 0 ? Math.min(100, (progress.covered / journeyGoal) * 100) : 0;
  const scheduleDisplay = useMemo(() => {
    const prev = schedule[activeHour - 1];
    const prevMiles = prev ? prev.miles : 0;
    const cur = schedule[activeHour];
    const curMiles = cur ? cur.miles : 0;
    return curMiles - prevMiles;
  }, [schedule, activeHour]);

  const gearInfo = useMemo(() => {
    if (!weather) return null;
    return GEAR_EFFECT_LABELS[weather.gearEffect] || GEAR_EFFECT_LABELS['none'];
  }, [weather]);

  const handleAdvanceHour = useCallback(() => {
    advanceHour();
  }, [advanceHour]);

  const handleBroadcastAtmosphere = useCallback(() => {
    if (!atmosphereText) return;
    broadcastWithOverlay(atmosphereText, 'atmosphere');
  }, [atmosphereText, broadcastWithOverlay]);

  const handleBroadcastEncounter = useCallback(() => {
    if (!lastEncounter) return;
    const typeLabel = ENCOUNTER_TYPE_LABELS[lastEncounter.type] || lastEncounter.type;
    const text = `[Encounter] ${typeLabel}: ${lastEncounter.label} \u2014 ${lastEncounter.note}`;
    broadcastWithOverlay(text, 'encounter');
  }, [lastEncounter, broadcastWithOverlay]);

  return (
    <div className="tt-tab-content tt-tab-content-fill tt-journey-tab">
      <WeatherPanel compact />

      <div className="tt-map-progress">
        <div className="tt-map-header">
          <span className="tt-section-label" style={{ marginBottom: 0, border: 'none', padding: 0 }}>Journey Map</span>
          <div className="tt-row tt-gap-xs">
            <span className="tt-text-sm tt-text-muted">Day {clock.day} | Hour {clock.hour}:00 | Tenday {clock.tenday}</span>
            <button className="tt-btn tt-btn-xs" onClick={() => { if (window.confirm('Reset all travel progress for this journey?')) resetDay(); }}>Reset</button>
          </div>
        </div>
        <div className="tt-map-road">
          <div className="tt-map-road-track" style={{ width: `${progressPct}%` }}>
            <div className="tt-map-road-marker" />
          </div>
          <div className="tt-map-milestones">
            {hours.map((h, i) => {
              const sch = schedule[i];
              const isCompleted = i < activeHour;
              const isActive = i === activeHour;
              return (
                <button
                  key={i}
                  className={`tt-map-milestone ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${h.enc ? 'encounter' : ''} ${h.rest ? 'rest' : ''} ${h.od ? 'overmarch' : ''}`}
                  onClick={() => selectHour(i)}
                  title={`Hour ${h.n}${sch?.isRest ? ' (Rest)' : ` \u2014 ${sch?.miles ?? 0} mi`}${h.enc ? ' [Encounter]' : ''}${h.od ? ' [Overmarch]' : ''}`}
                >
                  {h.n}
                </button>
              );
            })}
          </div>
        </div>
        <div className="tt-journey-stats">
          <div className="tt-journey-stat">
            <span className="tt-stat-label">Goal</span>
            <span className="tt-stat-value">{journeyGoal} mi</span>
          </div>
          <div className="tt-journey-stat">
            <span className="tt-stat-label">Covered</span>
            <span className="tt-stat-value">{progress.covered.toFixed(1)} mi</span>
          </div>
          <div className="tt-journey-stat">
            <span className="tt-stat-label">Remaining</span>
            <span className="tt-stat-value">{progress.remaining.toFixed(1)} mi</span>
          </div>
          <div className="tt-journey-stat">
            <span className="tt-stat-label">Lost</span>
            <span className="tt-stat-value">{progress.lostHours} hrs</span>
          </div>
          <div className="tt-journey-stat">
            <span className="tt-stat-label">Progress</span>
            <span className="tt-stat-value">{progressPct.toFixed(0)}%</span>
          </div>
        </div>
        <div className="tt-row tt-gap-sm tt-mt-sm">
          <span className="tt-text-sm tt-text-muted">Goal (mi):</span>
          <input className="tt-input tt-input-sm" type="number" min="1" step="1" value={journeyGoal} onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) setJourneyGoal(v); }} />
        </div>
      </div>

      {activeHour >= 0 && (
        <div className="tt-hour-detail tt-fade-in">
          <div className="tt-hour-detail-header">
            <div className="tt-row" style={{ gap: 8, alignItems: 'center' }}>
              <span className="tt-hour-detail-title">Hour {activeHour + 1}</span>
              {schedule[activeHour]?.isRest && <span className="tt-badge tt-badge-accent">Rest Hour</span>}
              {scheduleDisplay > 0 && <span className="tt-hour-mileage">{scheduleDisplay.toFixed(1)} mi</span>}
            </div>
            <button className="tt-btn tt-btn-primary" onClick={handleAdvanceHour}>Advance Hour</button>
          </div>

          {weather && (
            <div className="tt-hour-weather-bar">
              <div className="tt-hour-weather-bar-left">
                <span className={`tt-severity-badge ${getSeverityColor(weather.severity)}`}>Sev {weather.severity}</span>
                <span className="tt-hour-weather-name">{weather.name}</span>
              </div>
              <div className="tt-hour-weather-bar-right">
                {gearInfo && <span className={`tt-badge ${gearInfo.className}`}>{gearInfo.text}</span>}
              </div>
            </div>
          )}

          {atmosphereText && (
            <div className="tt-atmosphere">
              <span className="tt-text-italic">&ldquo;{atmosphereText}&rdquo;</span>
              <div className="tt-row tt-gap-xs" style={{ marginTop: 4 }}>
                <button className="tt-btn tt-btn-xs" onClick={() => getAtmosphereText()}>Regenerate</button>
                {isInMultiplayer && <button className="tt-btn tt-btn-xs tt-btn-broadcast" onClick={handleBroadcastAtmosphere}>Broadcast</button>}
              </div>
            </div>
          )}

          <div className="tt-checklist">
            {weather && (
              <div className="tt-check-card">
                <div className="tt-check-card-header">
                  <div className="tt-check-card-icon nav-icon"><i className="fas fa-compass" /></div>
                  <div className="tt-check-card-info">
                    <span className="tt-check-card-title">Navigator Check</span>
                    <span className="tt-check-card-subtitle">Survival vs difficulty die</span>
                  </div>
                  <div className="tt-check-card-dc">{weather.navDie}</div>
                </div>
                <div className="tt-check-card-actions">
                  <button className={`tt-btn tt-btn-sm ${navStatus === 'on-track' ? 'tt-btn-primary' : ''}`} onClick={() => setNavStatus('on-track')}>On Track</button>
                  <button className={`tt-btn tt-btn-sm ${navStatus === 'lost' ? 'tt-btn-danger-text' : ''}`} onClick={() => setNavStatus('lost')}>Lost</button>
                  {navStatus && <span className={`tt-nav-result ${navStatus}`}>{navStatus === 'on-track' ? 'On Track' : 'Lost'}</span>}
                </div>
              </div>
            )}

            {weather && (() => {
              const partyMembers = usePartyStore.getState().partyMembers;
              const players = (partyMembers || []).filter(m => !m.isGM && m.isConnected);
              const pgs = playerGearStates || {};
              const unequipped = players.filter(m => {
                const gs = pgs[m.id || m.userId] || 'equipped';
                return gs !== 'equipped';
              });
              const disadvPlayers = players.filter(m => {
                const gs = pgs[m.id || m.userId] || 'equipped';
                return gs === 'disadvantage';
              });
              return (
                <div className="tt-check-card">
                  <div className="tt-check-card-header">
                    <div className="tt-check-card-icon env-icon"><i className="fas fa-shield-alt" /></div>
                    <div className="tt-check-card-info">
                      <span className="tt-check-card-title">Environmental Save</span>
                      <span className="tt-check-card-subtitle">Constitution vs {weather.envDie} &mdash; fail = 1 exhaustion</span>
                    </div>
                    <div className="tt-check-card-dc">{weather.envDie}</div>
                  </div>
                  {gearInfo && unequipped.length === 0 ? (
                    <div className="tt-check-card-note tt-note-good">
                      <i className="fas fa-check-circle" style={{ fontSize: 9 }} />
                      <span>All players equipped: {gearInfo.text === 'Auto-pass' ? 'automatic success, no roll needed' : 'roll with advantage'}</span>
                    </div>
                  ) : (
                    <div className="tt-check-card-note tt-note-bad">
                      <i className="fas fa-exclamation-triangle" style={{ fontSize: 9 }} />
                      <span>
                        {unequipped.length} player{unequipped.length > 1 ? 's' : ''} without gear
                        {disadvPlayers.length > 0 && ` (${disadvPlayers.length} at disadvantage)`}
                        {gearInfo.text === 'Auto-pass' && unequipped.length < players.length
                          ? ' — equipped players auto-pass, others roll normally'
                          : gearInfo.text === 'Advantage' && unequipped.length < players.length
                            ? ' — equipped players get advantage, others roll normally'
                            : ' — no gear bonus for anyone'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeHourData?.prov && (
              <div className="tt-check-card">
                <div className="tt-check-card-header">
                  <div className="tt-check-card-icon prov-icon"><i className="fas fa-drumstick-bite" /></div>
                  <div className="tt-check-card-info">
                    <span className="tt-check-card-title">Ration Check</span>
                    <span className="tt-check-card-subtitle">Each character consumes 1 ration</span>
                  </div>
                  <div className="tt-check-card-dc prov-dc">d8</div>
                </div>
                <div className="tt-check-card-note">
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: 9 }} />
                  <span>No ration: Constitution vs d8 or gain 1 exhaustion</span>
                </div>
              </div>
            )}

            {activeHourData?.rest && (
              <div className="tt-check-card tt-check-card-rest">
                <div className="tt-check-card-header">
                  <div className="tt-check-card-icon rest-icon"><i className="fas fa-campground" /></div>
                  <div className="tt-check-card-info">
                    <span className="tt-check-card-title">Rest Point</span>
                    <span className="tt-check-card-subtitle">Short rest recommended. Spend Hit Dice.</span>
                  </div>
                </div>
                <div className="tt-check-card-note">
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: 9 }} />
                  <span>Skip rest: Constitution vs d8 starting next hour, die steps up each hour (d10, d12...)</span>
                </div>
              </div>
            )}

            {activeHourData?.od && (() => {
              const odDie = activeHour <= 10 ? 'd10' : activeHour <= 12 ? 'd12' : 'd20';
              const odLabel = activeHour >= 13 ? 'Extreme Danger' : activeHour >= 11 ? 'High Danger' : 'Danger';
              return (
                <div className="tt-check-card tt-check-card-warning">
                  <div className="tt-check-card-header">
                    <div className="tt-check-card-icon od-icon"><i className="fas fa-skull-crossbones" /></div>
                    <div className="tt-check-card-info">
                      <span className="tt-check-card-title">Overmarching</span>
                      <span className="tt-check-card-subtitle">Constitution vs {odDie} or 1 exhaustion per character</span>
                    </div>
                    <div className="tt-check-card-dc od-dc">{odDie}</div>
                  </div>
                  <div className="tt-check-card-note">
                    <i className="fas fa-exclamation-circle" style={{ fontSize: 9 }} />
                    <span>{odLabel}: past 8-hour travel day. Speed halved at hour 10+. {activeHour >= 11 ? 'High risk of incapacitation.' : ''}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {activeHourData?.enc && (
            <div className="tt-encounter-inline">
              <div className="tt-row-between">
                <span className="tt-section-label" style={{ marginBottom: 0, border: 'none', padding: 0 }}>Encounter</span>
                <div className="tt-row tt-gap-xs">
                  <button className="tt-btn" onClick={() => rollEncounter()}>Roll d20</button>
                  {isInMultiplayer && lastEncounter && (
                    <button className="tt-btn tt-btn-broadcast" onClick={handleBroadcastEncounter}>Broadcast</button>
                  )}
                </div>
              </div>
              {lastEncounter ? (
                <div className="tt-encounter-result tt-fade-in">
                  <div className="tt-row" style={{ gap: 8 }}>
                    <span className="tt-text-bold">{lastEncounter.label}</span>
                    <span className={`tt-encounter-type ${lastEncounter.type || 'none'}`}>{ENCOUNTER_TYPE_LABELS[lastEncounter.type]}</span>
                    <span className="tt-die-badge encounter-die">d20={lastEncounter.roll}</span>
                  </div>
                  <div className="tt-text-sm tt-text-muted">{lastEncounter.note}</div>
                </div>
              ) : (
                <div className="tt-empty-state-inline">Roll to determine encounter</div>
              )}
            </div>
          )}
        </div>
      )}

      {activeHour < 0 && (
        <div className="tt-cta-card">
          <div className="tt-cta-icon"><i className="fas fa-map-marked-alt" /></div>
          <div className="tt-cta-title">Begin Your Journey</div>
          <div className="tt-cta-text">
            {!weather
              ? 'Roll weather above, then click an hour on the map to begin tracking progress.'
              : 'Click an hour on the map above to begin tracking progress.'
            }
          </div>
        </div>
      )}
    </div>
  );
}

function BroadcastTab() {
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const broadcastHistory = useTravelStore(s => s.broadcastHistory);
  const weather = useTravelStore(s => s.weather);
  const lastEncounter = useTravelStore(s => s.lastEncounter);
  const atmosphereText = useTravelStore(s => s.getAtmosphereText());
  const broadcastTravelState = useTravelStore(s => s.broadcastTravelState);
  const logRef = useRef(null);
  const { broadcastWithOverlay } = useTravelBroadcast();

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [broadcastHistory]);

  const handleBroadcastWeather = useCallback(() => {
    if (!weather) return;
    const text = `[Weather] ${weather.name} (Severity ${weather.severity}) \u2014 ${weather.desc}`;
    broadcastWithOverlay(text, 'weather');
  }, [weather, broadcastWithOverlay]);

  const handleBroadcastAtmosphere = useCallback(() => {
    if (!atmosphereText) return;
    broadcastWithOverlay(atmosphereText, 'atmosphere');
  }, [atmosphereText, broadcastWithOverlay]);

  const handleBroadcastEncounter = useCallback(() => {
    if (!lastEncounter) return;
    const typeLabel = ENCOUNTER_TYPE_LABELS[lastEncounter.type] || lastEncounter.type;
    const text = `[Encounter] ${typeLabel}: ${lastEncounter.label} \u2014 ${lastEncounter.note}`;
    broadcastWithOverlay(text, 'encounter');
  }, [lastEncounter, broadcastWithOverlay]);

  if (!isInMultiplayer) {
    return (
      <div className="tt-tab-content tt-tab-content-fill">
        <div className="tt-cta-card">
          <div className="tt-cta-icon"><i className="fas fa-satellite-dish" /></div>
          <div className="tt-cta-title">Multiplayer Required</div>
          <div className="tt-cta-text">Broadcast features are available when connected to a multiplayer session. Players will see travel updates in their Travel window (W) and in the Travel tab of the community panel.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tt-tab-content tt-tab-content-fill">
      <div className="tt-broadcast-section">
        <div className="tt-section-label"><span>Quick Broadcast</span><span className="tt-step-hint">Send narrative moments to players</span></div>
        <div className="tt-broadcast-quick">
          <button className="tt-btn tt-btn-broadcast tt-btn-block" onClick={handleBroadcastWeather} disabled={!weather}>
            Broadcast Weather
          </button>
          <button className="tt-btn tt-btn-broadcast tt-btn-block" onClick={handleBroadcastAtmosphere} disabled={!atmosphereText}>
            Broadcast Atmosphere
          </button>
          <button className="tt-btn tt-btn-broadcast tt-btn-block" onClick={handleBroadcastEncounter} disabled={!lastEncounter}>
            Broadcast Encounter
          </button>
          <button className="tt-btn tt-btn-primary tt-btn-block" onClick={broadcastTravelState}>
            Sync Full Travel State
          </button>
        </div>
      </div>

      <div className="tt-broadcast-section tt-broadcast-log-section">
        <div className="tt-section-label"><span>Broadcast Log</span></div>
        <div className="tt-broadcast-log" ref={logRef}>
          {broadcastHistory.length === 0 ? (
            <div className="tt-empty-state-inline">No broadcasts yet</div>
          ) : (
            broadcastHistory.map((entry, i) => (
              <div key={i} className="tt-broadcast-entry">
                <span className="tt-broadcast-time">{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                {entry.category && <span className="tt-broadcast-category">{entry.category}</span>}
                <span className="tt-broadcast-text">{entry.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const TravelTrackerWindow = ({ isOpen, onClose }) => {
  const currentBiome = useTravelStore(s => s.currentBiome);
  const activeTab = useTravelStore(s => s.activeTab);
  const setActiveTab = useTravelStore(s => s.setActiveTab);
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);

  const biome = useMemo(() => getBiome(currentBiome), [currentBiome]);
  const biomeStyle = useMemo(() => {
    if (!biome) return {};
    return biome.cssVars;
  }, [biome]);

  const visibleTabs = useMemo(() => {
    return TABS.filter(t => t.id !== 'broadcast' || isInMultiplayer);
  }, [isInMultiplayer]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'setup': return <SetupTab />;
      case 'journey': return <JourneyTab />;
      case 'encounters': return <EncountersTab />;
      case 'broadcast': return <BroadcastTab />;
      default: return <SetupTab />;
    }
  }, [activeTab]);

  return (
    <WowWindow
      title="Travel Tracker"
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 760, height: 780 }}
      minConstraints={[660, 560]}
      maxConstraints={[900, 960]}
    >
      <div className="tt-window" style={biomeStyle}>
        <div className="tt-tab-bar">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`tt-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tt-tab-step">{tab.step}</span>
              <span className="tt-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="tt-tab-content-area">
          {tabContent}
        </div>
      </div>
    </WowWindow>
  );
};

export default TravelTrackerWindow;
