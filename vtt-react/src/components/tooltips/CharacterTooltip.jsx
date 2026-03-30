import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/CreatureTooltip.css';

// Helper to determine health state color
const getHealthState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  let color = '#4CAF50'; // Green
  let label = 'Healthy';
  
  if (pct <= 0) {
    color = '#9e9e9e'; // Gray
    label = 'Dead';
  } else if (pct <= 25) {
    color = '#F44336'; // Red
    label = 'Critical';
  } else if (pct <= 50) {
    color = '#FF9800'; // Orange
    label = 'Bloodied';
  } else if (pct <= 75) {
    color = '#FFEB3B'; // Yellow
    label = 'Injured';
  }

  return { pct, color, label, barFill: Math.min(100, Math.max(0, pct)) };
};

// Helper to determine mana state color
const getManaState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return { pct, color: '#2196F3', barFill: Math.min(100, Math.max(0, pct)) };
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
  const maxHp = characterData.health?.max || 100;
  const healthState = getHealthState(currentHp, maxHp);

  const currentMp = characterData.mana?.current || 0;
  const maxMp = characterData.mana?.max || 100;
  const manaState = getManaState(currentMp, maxMp);

  const currentAp = characterData.actionPoints?.current || 0;
  const maxAp = characterData.actionPoints?.max || 5;

  const tooltipStyle = {
    left: position.x,
    top: position.y,
    position: 'fixed',
    transform: position.x > (typeof window !== 'undefined' ? window.innerWidth - 200 : 1000) ? 'translateX(-100%)' : 'none'
  };

  const tokenBuffs = (activeBuffs || []).filter(b => b.targetId === tokenId);
  const tokenDebuffs = (activeDebuffs || []).filter(d => d.targetId === tokenId);
  const activeConditions = [...tokenBuffs, ...tokenDebuffs];

  // Get condition type for styling
  const getConditionClass = (cond) => {
    const isBuff = tokenBuffs.includes(cond);
    return isBuff ? 'buff' : 'debuff';
  };

  return createPortal(
    <div className="creature-tooltip" style={tooltipStyle}>
      <div className="tooltip-border-top" />

      {/* View mode indicator - Player */}
      <div className="tooltip-view-mode gm" style={{ background: 'rgba(33, 150, 243, 0.9)', color: '#fff' }}>
        PLAYER
      </div>

      {/* Header */}
      <div className="creature-tooltip-header">
        <div className="tooltip-icon-wrapper">
          <div
            className="tooltip-icon"
            style={{
              backgroundImage: characterImage ? `url(${characterImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderColor: characterData.tokenSettings?.borderColor || '#8b4513'
            }}
          />
        </div>
        <div className="tooltip-title-section">
          <div className="tooltip-name">
            {characterData.name}
          </div>
          <div className="tooltip-subtitle">
            Level {characterData.level} {characterData.raceDisplayName || characterData.race} {characterData.class}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="creature-tooltip-body">
        <div className="gm-stats-view">
          {/* Vitals */}
          <div className="tooltip-section health-section">
            <div className="tooltip-horizontal-stats" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
              <div className="horizontal-stat">
                <span className="stat-label">HP</span>
                <span className="stat-value">
                  <span className="hp-current" style={{ color: healthState.color }}>{currentHp}</span>
                  <span className="hp-separator">/</span>
                  <span className="hp-max">{maxHp}</span>
                </span>
              </div>
              <div className="horizontal-stat">
                <span className="stat-label">MP</span>
                <span className="stat-value">
                  <span className="hp-current" style={{ color: manaState.color }}>{currentMp}</span>
                  <span className="hp-separator">/</span>
                  <span className="hp-max">{maxMp}</span>
                </span>
              </div>
              <div className="horizontal-stat">
                <span className="stat-label">AP</span>
                <span className="stat-value ap-value">
                  <span className="ap-current">{currentAp}</span>
                  <span className="ap-separator">/</span>
                  <span className="ap-max">{maxAp}</span>
                </span>
              </div>
            </div>
            
            <div className="health-bar-container">
              <div 
                className="health-bar-fill"
                style={{ 
                  width: `${healthState.barFill}%`,
                  backgroundColor: healthState.color
                }}
              />
              <span className="health-bar-label" style={{ color: '#fff' }}>
                {healthState.label}
              </span>
            </div>
            
            <div className="health-bar-container" style={{ border: '1px solid rgba(33, 150, 243, 0.2)', backgroundColor: 'rgba(33, 150, 243, 0.1)', marginTop: '4px' }}>
              <div 
                className="health-bar-fill"
                style={{ 
                  width: `${manaState.barFill}%`,
                  backgroundColor: manaState.color
                }}
              />
            </div>
          </div>

          {/* Combat & Target Status */}
          {(isInCombat || isTargeted) && (
            <div className={`tooltip-combat-status ${isMyTurn ? 'my-turn' : ''}`} style={isTargeted ? { borderColor: '#FF9800', background: 'rgba(255, 152, 0, 0.05)' } : {}}>
              <div className="status-text">
                {isTargeted && <span style={{ color: '#FF9800', marginRight: '8px' }}>🎯 Targeted</span>}
                {isInCombat && (isMyTurn ? '⚔ Current Turn' : '⏳ Waiting')}
              </div>
            </div>
          )}
        </div>

        {/* Conditions */}
        {activeConditions && activeConditions.length > 0 && (
          <div className="tooltip-conditions">
            <div className="conditions-label">
              Active Effects
            </div>
            <div className="conditions-list">
              {activeConditions.slice(0, 4).map((cond, i) => {
                const condName = cond.name || cond;
                return (
                  <span 
                    key={i} 
                    className={`condition-tag ${getConditionClass(cond)}`}
                  >
                    {condName}
                    {cond.remainingRounds && (
                      <span className="condition-duration">{cond.remainingRounds}r</span>
                    )}
                  </span>
                );
              })}
              {activeConditions.length > 4 && (
                <span className="more-conditions">
                  +{activeConditions.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="tooltip-border-bottom" />
    </div>,
    document.body
  );
};

export default CharacterTooltip;
