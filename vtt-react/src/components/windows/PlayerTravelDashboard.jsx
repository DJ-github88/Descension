import React, { useMemo } from 'react';
import WowWindow from './WowWindow';
import useTravelStore from '../../store/travelStore';
import useGameStore from '../../store/gameStore';
import { BIOMES, getBiome } from '../../data/biomeData';
import { FaSnowflake, FaSun, FaTree, FaWater, FaAnchor, FaDungeon } from 'react-icons/fa';
import './TravelTrackerWindow.css';

const PLAYER_HOURS = [
  { n: 1, enc: false, rest: false, od: false },
  { n: 2, enc: true, rest: false, od: false },
  { n: 3, enc: false, rest: false, od: false },
  { n: 4, enc: true, rest: true, od: false },
  { n: 5, enc: false, rest: false, od: false },
  { n: 6, enc: true, rest: false, od: false },
  { n: 7, enc: false, rest: false, od: false },
  { n: 8, enc: true, rest: false, od: false },
  { n: 9, enc: true, rest: false, od: true },
  { n: 10, enc: false, rest: false, od: true },
  { n: 11, enc: true, rest: false, od: true },
  { n: 12, enc: false, rest: false, od: true },
  { n: 13, enc: true, rest: false, od: true },
  { n: 14, enc: false, rest: false, od: true }
];

const BIOME_ICONS = {
  arctic: FaSnowflake,
  desert: FaSun,
  forest: FaTree,
  swamp: FaWater,
  ocean: FaAnchor,
  underdark: FaDungeon
};

const ENCOUNTER_TYPE_LABELS = {
  none: 'None',
  combat: 'Combat',
  social: 'Social',
  hazard: 'Hazard',
  discovery: 'Discovery'
};

const getSeverityColor = (severity) => `severity-${Math.min(severity, 4)}`;

const GEAR_EFFECT_LABELS = {
  'auto-pass': { text: 'Auto-pass', className: 'tt-badge-green' },
  'advantage': { text: 'Advantage', className: 'tt-badge-accent' },
  'none': { text: 'No bonus', className: 'tt-badge-warn' }
};

function WaitingCard() {
  return (
    <div className="tt-tab-content">
      <div className="tt-cta-card">
        <div className="tt-cta-icon">&#x1F30D;</div>
        <div className="tt-cta-title">Waiting for GM...</div>
        <div className="tt-cta-text">The GM hasn&apos;t started travel yet. Once they begin tracking the journey, you&apos;ll see the weather, progress, and encounters here.</div>
      </div>
    </div>
  );
}

function PlayerTravelDashboard({ isOpen, onClose }) {
  const isInMultiplayer = useGameStore(s => s.isInMultiplayer);
  const isGMMode = useGameStore(s => s.isGMMode);
  const playerTravelState = useTravelStore(s => s.playerTravelState);

  if (!isInMultiplayer) {
    return (
      <WowWindow
        title="Travel"
        isOpen={isOpen}
        onClose={onClose}
        defaultSize={{ width: 520, height: 400 }}
        minConstraints={[400, 300]}
        maxConstraints={[660, 600]}
      >
        <div className="tt-window">
          <div className="tt-tab-content">
            <div className="tt-cta-card">
              <div className="tt-cta-icon">&#x1F50C;</div>
              <div className="tt-cta-title">Multiplayer Required</div>
              <div className="tt-cta-text">The travel dashboard is only available in multiplayer. Connect to a session to see the GM&apos;s travel tracker.</div>
            </div>
          </div>
        </div>
      </WowWindow>
    );
  }

  if (isGMMode) {
    return null;
  }

  const state = playerTravelState;
  if (!state) {
    return (
      <WowWindow
        title="Travel"
        isOpen={isOpen}
        onClose={onClose}
        defaultSize={{ width: 520, height: 400 }}
        minConstraints={[400, 300]}
        maxConstraints={[660, 600]}
      >
        <div className="tt-window">
          <WaitingCard />
        </div>
      </WowWindow>
    );
  }

  return <PlayerTravelContent state={state} isOpen={isOpen} onClose={onClose} />;
}

function PlayerTravelContent({ state, isOpen, onClose }) {
  const biome = useMemo(() => getBiome(state.currentBiome), [state.currentBiome]);
  const biomeStyle = useMemo(() => (biome ? biome.cssVars : {}), [biome]);
  const BiomeIcon = BIOME_ICONS[state.currentBiome] || FaTree;

  const progress = state.progress || { covered: 0, lostHours: 0, remaining: state.journeyGoal || 0 };
  const progressPct = state.journeyGoal > 0
    ? Math.min(100, (progress.covered / state.journeyGoal) * 100)
    : 0;
  const gearInfo = state.weather ? (GEAR_EFFECT_LABELS[state.weather.gearEffect] || GEAR_EFFECT_LABELS['none']) : null;
  const lastBroadcast = state.lastBroadcast;

  return (
    <WowWindow
      title="Travel"
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: 560, height: 620 }}
      minConstraints={[440, 480]}
      maxConstraints={[660, 780]}
      customHeader={
        <div className="tt-custom-header">
          <span className="tt-header-title">Travel</span>
          {biome && (
            <div className="tt-row" style={{ gap: 6, alignItems: 'center' }}>
              <BiomeIcon style={{ fontSize: 14, opacity: 0.8 }} />
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 12,
                color: 'rgba(240,230,210,0.8)',
                letterSpacing: 0.5
              }}>
                {biome.name}
              </span>
            </div>
          )}
        </div>
      }
    >
      <div className="tt-window" style={biomeStyle}>
        <div className="tt-tab-content" style={{ gap: 10, padding: 10, flex: 1, overflow: 'auto' }}>

          {state.clock && (
            <div className="tt-row-between" style={{ padding: '6px 8px', background: 'rgba(139,115,85,0.06)', borderRadius: 4, fontSize: 11 }}>
              <span>
                <span className="tt-text-bold">Day {state.clock.day}</span>
                <span className="tt-text-muted"> | Tenday {state.clock.tenday}</span>
              </span>
              <span className="tt-text-muted">
                Hour {String(state.clock.hour).padStart(2, '0')}:00
              </span>
            </div>
          )}

          {state.weather && (
            <div className="tt-weather-card">
              <div className="tt-weather-card-header">
                <span className="tt-weather-condition">{state.weather.name}</span>
                <div className="tt-row tt-gap-xs">
                  <span className={`tt-severity-badge ${getSeverityColor(state.weather.severity)}`}>
                    Sev {state.weather.severity}
                  </span>
                  {state.weatherRemaining != null && (
                    <span className="tt-badge tt-badge-accent">{state.weatherRemaining}h left</span>
                  )}
                </div>
              </div>
              <div className="tt-weather-desc">{state.weather.desc}</div>
              <div className="tt-weather-stats">
                <div className="tt-weather-stat">
                  <span className="tt-stat-label">Navigator</span>
                  <span className="tt-die-badge nav-die">{state.weather.navDie}</span>
                </div>
                <div className="tt-weather-stat">
                  <span className="tt-stat-label">Environment</span>
                  <span className="tt-die-badge env-die">{state.weather.envDie}</span>
                </div>
                <div className="tt-weather-stat">
                  <span className="tt-stat-label">Gear</span>
                  {gearInfo
                    ? <span className={`tt-badge ${gearInfo.className}`}>{gearInfo.text}</span>
                    : <span className="tt-badge tt-badge-warn">No bonus</span>
                  }
                </div>
              </div>
            </div>
          )}

          {state.atmosphereText && (
            <div className="tt-atmosphere">
              <span className="tt-text-italic">&ldquo;{state.atmosphereText}&rdquo;</span>
            </div>
          )}

          {state.journeyGoal > 0 && (
            <div className="tt-map-progress">
              <div className="tt-map-header">
                <span className="tt-section-label" style={{ marginBottom: 0, border: 'none', padding: 0 }}>
                  Journey Progress
                </span>
                <span className="tt-text-sm tt-text-muted">{progressPct.toFixed(0)}%</span>
              </div>
              <div className="tt-map-road">
                <div className="tt-map-road-track" style={{ width: `${progressPct}%` }}>
                  <div className="tt-map-road-marker" />
                </div>
                <div className="tt-map-milestones">
                  {PLAYER_HOURS.map((h, i) => {
                    const isCompleted = i < (state.activeHour ?? -1);
                    const isActive = i === state.activeHour;
                    return (
                      <span
                        key={i}
                        className={`tt-map-milestone ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${h.enc ? 'encounter' : ''} ${h.rest ? 'rest' : ''} ${h.od ? 'overmarch' : ''}`}
                        title={`Hour ${h.n}${h.enc ? ' [Encounter]' : ''}${h.rest ? ' [Rest]' : ''}${h.od ? ' [Overmarch]' : ''}`}
                      >
                        {h.n}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="tt-journey-stats">
                <div className="tt-journey-stat">
                  <span className="tt-stat-label">Goal</span>
                  <span className="tt-stat-value">{state.journeyGoal} mi</span>
                </div>
                <div className="tt-journey-stat">
                  <span className="tt-stat-label">Covered</span>
                  <span className="tt-stat-value">{progress.covered.toFixed(1)} mi</span>
                </div>
                <div className="tt-journey-stat">
                  <span className="tt-stat-label">Remaining</span>
                  <span className="tt-stat-value">{Math.max(0, progress.remaining).toFixed(1)} mi</span>
                </div>
                <div className="tt-journey-stat">
                  <span className="tt-stat-label">Lost</span>
                  <span className="tt-stat-value">{progress.lostHours} hrs</span>
                </div>
              </div>
              {state.activeHour >= 0 && (
                <div className="tt-text-sm tt-text-muted tt-text-center">
                  Currently at Hour {state.activeHour + 1}
                  {state.navStatus && (
                    <span className={`tt-nav-result ${state.navStatus}`} style={{ marginLeft: 6 }}>
                      {state.navStatus === 'on-track' ? 'On Track' : 'Lost'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {state.lastEncounter && (
            <div className="tt-encounter-result-banner tt-fade-in">
              <div className="tt-row" style={{ gap: 8 }}>
                <span className="tt-text-bold">{state.lastEncounter.label}</span>
                <span className={`tt-encounter-type ${state.lastEncounter.type || 'none'}`}>
                  {ENCOUNTER_TYPE_LABELS[state.lastEncounter.type] || state.lastEncounter.type}
                </span>
                {state.lastEncounter.roll != null && (
                  <span className="tt-die-badge encounter-die">d20={state.lastEncounter.roll}</span>
                )}
              </div>
              <div className="tt-text-sm tt-text-muted">{state.lastEncounter.note}</div>
            </div>
          )}

          {lastBroadcast && (
            <div className="tt-broadcast-section">
              <div className="tt-section-label"><span>Latest Broadcast</span></div>
              <div className="tt-broadcast-log" style={{ maxHeight: 100 }}>
                <div className="tt-broadcast-entry">
                  <span className="tt-broadcast-time">
                    {new Date(lastBroadcast.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {lastBroadcast.category && (
                    <span className="tt-broadcast-category">{lastBroadcast.category}</span>
                  )}
                  <span className="tt-broadcast-text">{lastBroadcast.text}</span>
                </div>
              </div>
            </div>
          )}

          {!state.weather && !state.atmosphereText && state.journeyGoal <= 0 && !state.lastEncounter && (
            <WaitingCard />
          )}
        </div>
      </div>
    </WowWindow>
  );
}

export default PlayerTravelDashboard;
