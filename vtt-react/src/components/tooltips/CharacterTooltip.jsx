import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/CreatureTooltip.css';

const getHealthState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  let color = '#4ade80'; // green
  let label = 'Healthy';
  if (pct <= 0)  { color = '#6b7280'; label = 'Dead'; }
  else if (pct <= 25) { color = '#f87171'; label = 'Critical'; }
  else if (pct <= 50) { color = '#fb923c'; label = 'Bloodied'; }
  else if (pct <= 75) { color = '#facc15'; label = 'Injured'; }
  return { pct, color, label, barFill: Math.min(100, Math.max(0, pct)) };
};

const getManaState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return { pct, color: '#60a5fa', barFill: Math.min(100, Math.max(0, pct)) };
};

const CharacterTooltip = ({
  characterData,
  characterImage,
  position,
  isInCombat = false,
  isMyTurn = false,
  isTargeted = false,
  activeBuffs = [],
  activeDebuffs = [],
  tokenId
}) => {
  if (!characterData) return null;

  const currentHp = characterData.health?.current || 0;
  const maxHp     = characterData.health?.max || 100;
  const healthState = getHealthState(currentHp, maxHp);

  const currentMp = characterData.mana?.current || 0;
  const maxMp     = characterData.mana?.max || 100;
  const manaState = getManaState(currentMp, maxMp);

  const currentAp = characterData.actionPoints?.current ?? 0;
  const maxAp     = characterData.actionPoints?.max || 5;

  const tooltipStyle = {
    left: position.x,
    top: position.y,
    position: 'fixed',
    transform: position.x > (typeof window !== 'undefined' ? window.innerWidth - 220 : 1000)
      ? 'translateX(-100%)'
      : 'none'
  };

  const tokenBuffs   = (activeBuffs   || []).filter(b => b.targetId === tokenId);
  const tokenDebuffs = (activeDebuffs || []).filter(d => d.targetId === tokenId);
  const activeConditions = [...tokenBuffs, ...tokenDebuffs];

  const getCondClass = (cond) => tokenBuffs.includes(cond) ? 'buff' : 'debuff';

  return createPortal(
    <div className="creature-tooltip" style={tooltipStyle}>
      {/* ─── HEADER ─── */}
      <div className="creature-tooltip-header">
        <div className="tooltip-icon-wrapper">
          <div
            className="tooltip-icon"
            style={{
              backgroundImage: characterImage ? `url(${characterImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderColor: characterData.tokenSettings?.borderColor || 'rgba(99,179,237,0.4)'
            }}
          />
        </div>
        <div className="tooltip-title-section">
          <div className="tooltip-name">{characterData.name}</div>
          <div className="tooltip-subtitle">
            Lv.{characterData.level}{' '}
            {characterData.raceDisplayName || characterData.race}{' '}
            {characterData.class}
          </div>
        </div>
        <span className="tooltip-role-badge player">Player</span>
      </div>

      {/* ─── BODY ─── */}
      <div className="creature-tooltip-body">
        {/* Stat grid: HP / MP / AP */}
        <div className="tt-stat-grid">
          <div className="tt-stat-cell">
            <span className="tt-stat-cell-label">HP</span>
            <span className="tt-stat-cell-value">
              <span style={{ color: healthState.color }}>{currentHp}</span>
              <span className="slash">/</span>
              <span style={{ color: 'rgba(240,230,210,0.4)', fontSize: 10 }}>{maxHp}</span>
            </span>
          </div>
          <div className="tt-stat-cell">
            <span className="tt-stat-cell-label">MP</span>
            <span className="tt-stat-cell-value">
              <span style={{ color: manaState.color }}>{currentMp}</span>
              <span className="slash">/</span>
              <span style={{ color: 'rgba(240,230,210,0.4)', fontSize: 10 }}>{maxMp}</span>
            </span>
          </div>
          <div className="tt-stat-cell">
            <span className="tt-stat-cell-label">AP</span>
            <span className="tt-stat-cell-value">
              <span style={{ color: '#c084fc' }}>{currentAp}</span>
              <span className="slash">/</span>
              <span style={{ color: 'rgba(240,230,210,0.4)', fontSize: 10 }}>{maxAp}</span>
            </span>
          </div>
        </div>

        {/* Health bar */}
        <div className="tt-divider" />
        <div className="tt-health-section">
          <div className="tt-health-header">
            <span className="tt-health-label">Health</span>
            <span className="tt-health-value">
              <span className="hp-pct" style={{ color: healthState.color }}>
                {healthState.label}
              </span>
            </span>
          </div>
          <div className="tt-bar-track">
            <div
              className="tt-bar-fill"
              style={{ width: `${healthState.barFill}%`, backgroundColor: healthState.color }}
            />
            <span className="tt-bar-label">{Math.round(healthState.pct)}%</span>
          </div>
        </div>

        {/* Mana bar */}
        <div className="tt-mana-bar">
          <div className="tt-bar-track" style={{ borderColor: 'rgba(96,165,250,0.12)' }}>
            <div
              className="tt-bar-fill"
              style={{ width: `${manaState.barFill}%`, backgroundColor: manaState.color }}
            />
            <span className="tt-bar-label" style={{ color: 'rgba(96,165,250,0.9)' }}>
              Mana
            </span>
          </div>
        </div>

        {/* Combat / target status */}
        {(isInCombat || isTargeted) && (
          <div className={`tt-combat-status ${isMyTurn ? 'my-turn' : ''} ${isTargeted && !isMyTurn ? 'targeted' : ''}`}>
            {isTargeted && <span style={{ marginRight: 6 }}>🎯 Targeted</span>}
            {isInCombat && (isMyTurn ? '⚔ Current Turn' : '⏳ Waiting')}
          </div>
        )}

        {/* Conditions */}
        {activeConditions.length > 0 && (
          <div className="tt-conditions-section">
            <div className="tt-conditions-title">Active Effects</div>
            <div className="tt-condition-chips">
              {activeConditions.slice(0, 5).map((cond, i) => {
                const condName = cond.name || cond;
                return (
                  <span key={i} className={`tt-cond-chip ${getCondClass(cond)}`}>
                    {condName}
                    {cond.remainingRounds && (
                      <span className="tt-cond-duration">{cond.remainingRounds}r</span>
                    )}
                  </span>
                );
              })}
              {activeConditions.length > 5 && (
                <span className="tt-more-cond">+{activeConditions.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default CharacterTooltip;
