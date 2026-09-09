import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/CreatureTooltip.css';

const getHealthState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  let color = '#3d7a2e'; // Rich forest green (high contrast on parchment)
  let label = 'Healthy';
  if (pct <= 0)  { color = '#6b7280'; label = 'Dead'; }
  else if (pct <= 25) { color = '#b91c1c'; label = 'Critical'; } // Deep crimson
  else if (pct <= 50) { color = '#c2410c'; label = 'Bloodied'; } // Deep rust orange
  else if (pct <= 75) { color = '#b45309'; label = 'Injured'; }  // Deep amber / ochre brown (never bright yellow)
  return { pct, color, label, barFill: Math.min(100, Math.max(0, pct)) };
};

const getManaState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return { pct, color: '#1d4ed8', barFill: Math.min(100, Math.max(0, pct)) }; // Deep royal blue
};

const getApState = (current, max) => {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return { pct, color: '#7e22ce', barFill: Math.min(100, Math.max(0, pct)) }; // Deep purple
};

/**
 * CharacterTooltip
 * Displays detailed or qualitative information when hovering over player/character tokens.
 * Adapts to playerTooltipMode ('vague' | 'partial' | 'full') when viewed by other players.
 * GM and token owner always see the complete 'full' view.
 */
const CharacterTooltip = ({
  characterData,
  characterImage,
  position,
  isInCombat = false,
  isMyTurn = false,
  isTargeted = false,
  activeBuffs = [],
  activeDebuffs = [],
  tokenId,
  playerTooltipMode = 'full',
  isGM = false,
  isOwner = false
}) => {
  if (!characterData) return null;

  // The GM and the token's owner always get full exact stats
  const effectiveMode = (isGM || isOwner) ? 'full' : (playerTooltipMode || 'vague');

  const currentHp = characterData.health?.current || 0;
  const maxHp     = characterData.health?.max || 100;
  const healthState = getHealthState(currentHp, maxHp);

  const currentMp = characterData.mana?.current || 0;
  const maxMp     = characterData.mana?.max || 100;
  const manaState = getManaState(currentMp, maxMp);
  const showMana  = maxMp > 0;

  const currentAp = characterData.actionPoints?.current ?? 0;
  const maxAp     = characterData.actionPoints?.max || 5;
  const apState   = getApState(currentAp, maxAp);

  const tempHp = characterData.tempHealth || 0;
  const tempMp = characterData.tempMana || 0;
  const tempAp = characterData.tempActionPoints || 0;

  const tooltipStyle = {
    left: position.x,
    top: position.y,
    position: 'fixed',
    transform: position.x > (typeof window !== 'undefined' ? window.innerWidth - 240 : 1000)
      ? 'translateX(-100%)'
      : 'none'
  };

  const tokenBuffs   = (activeBuffs   || []).filter(b => b.targetId === tokenId);
  const tokenDebuffs = (activeDebuffs || []).filter(d => d.targetId === tokenId);
  const activeConditions = [...tokenBuffs, ...tokenDebuffs];

  const getCondClass = (cond) => tokenBuffs.includes(cond) ? 'buff' : 'debuff';

  const charInitial = (characterData.name || 'P').trim().charAt(0).toUpperCase();

  return createPortal(
    <div className="creature-tooltip" style={tooltipStyle}>
      {/* ─── HEADER ─── */}
      <div className="creature-tooltip-header">
        <div className="tooltip-icon-wrapper">
          <div
            className="tooltip-icon"
            style={{
              borderColor: characterData.tokenSettings?.borderColor || 'rgba(139,69,19,0.45)'
            }}
          >
            {characterImage ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${characterImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            ) : (
              <div className="tooltip-icon-fallback" title={characterData.name}>
                {charInitial}
              </div>
            )}
          </div>
        </div>

        <div className="tooltip-title-section">
          <div className="tooltip-name" title={characterData.name}>
            {characterData.name}
          </div>
          <div className="tooltip-subtitle">
            {characterData.level ? `Lv.${characterData.level}` : null}
            {(characterData.raceDisplayName || characterData.race) ? (
              <span>{characterData.raceDisplayName || characterData.race}</span>
            ) : null}
            {characterData.class && (
              <span>{characterData.class}</span>
            )}
          </div>
        </div>

        <span className={`tooltip-role-badge ${isGM ? 'gm' : 'player'}`}>
          {isOwner ? 'You' : isGM ? 'GM' : 'Player'}
        </span>
      </div>

      {/* ─── BODY ─── */}
      <div className="creature-tooltip-body">
        {effectiveMode === 'full' ? (
          /* ══════ FULL VIEW (GM, Token Owner, or Full mode) ══════ */
          <>
            {/* Stat grid: HP / MP / AP */}
            <div className={`tt-stat-grid ${showMana ? '' : 'two-col'}`}>
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">HP</span>
                <span className="tt-stat-cell-value">
                  <span style={{ color: healthState.color }}>{currentHp}</span>
                  <span className="slash">/</span>
                  <span className="stat-max">{maxHp}</span>
                  {tempHp > 0 && <span className="tt-temp">+{tempHp}</span>}
                </span>
              </div>

              {showMana && (
                <div className="tt-stat-cell">
                  <span className="tt-stat-cell-label">MP</span>
                  <span className="tt-stat-cell-value">
                    <span style={{ color: manaState.color }}>{currentMp}</span>
                    <span className="slash">/</span>
                    <span className="stat-max">{maxMp}</span>
                    {tempMp > 0 && <span className="tt-temp">+{tempMp}</span>}
                  </span>
                </div>
              )}

              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">AP</span>
                <span className="tt-stat-cell-value">
                  <span style={{ color: '#9333ea' }}>{currentAp}</span>
                  <span className="slash">/</span>
                  <span className="stat-max">{maxAp}</span>
                  {tempAp > 0 && <span className="tt-temp">+{tempAp}</span>}
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
            {showMana && (
              <div className="tt-mana-bar">
                <div className="tt-bar-track" style={{ borderColor: 'rgba(96,165,250,0.35)' }}>
                  <div
                    className="tt-bar-fill"
                    style={{ width: `${manaState.barFill}%`, backgroundColor: manaState.color }}
                  />
                  <span className="tt-bar-label">
                    {Math.round(manaState.pct)}% Mana
                  </span>
                </div>
              </div>
            )}
          </>
        ) : effectiveMode === 'partial' ? (
          /* ══════ PARTIAL VIEW (Qualitative Bars & Status, No Exact HP pool numbers) ══════ */
          <>
            <div className="tt-stat-grid two-col">
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">Status</span>
                <span className="tt-stat-cell-value" style={{ color: healthState.color, fontSize: '11px' }}>
                  {healthState.label}
                </span>
              </div>
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">Action Points</span>
                <span className="tt-stat-cell-value">
                  <span style={{ color: '#9333ea' }}>{currentAp}</span>
                  <span className="slash">/</span>
                  <span className="stat-max">{maxAp}</span>
                </span>
              </div>
            </div>

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

            {showMana && (
              <div className="tt-mana-bar">
                <div className="tt-bar-track" style={{ borderColor: 'rgba(96,165,250,0.35)' }}>
                  <div
                    className="tt-bar-fill"
                    style={{ width: `${manaState.barFill}%`, backgroundColor: manaState.color }}
                  />
                  <span className="tt-bar-label">{Math.round(manaState.pct)}% Mana</span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ══════ VAGUE VIEW (Qualitative Descriptors & Visible Effects) ══════ */
          <>
            <div className="tt-vague-health">
              <span className="tt-vague-health-label">Health</span>
              <span
                className="tt-vague-health-state"
                style={{
                  color: healthState.color,
                  background: `${healthState.color}1c`,
                  border: `1px solid ${healthState.color}45`
                }}
              >
                {healthState.label}
              </span>
            </div>

            {showMana && (
              <div className="tt-descriptor-row">
                <span className="tt-descriptor-label">Mana</span>
                <span
                  className="tt-descriptor-badge"
                  style={{
                    color: manaState.color,
                    background: `${manaState.color}1c`,
                    border: `1px solid ${manaState.color}45`
                  }}
                >
                  {manaState.pct > 60 ? 'Abundant' : manaState.pct > 25 ? 'Depleting' : 'Exhausted'}
                </span>
              </div>
            )}
          </>
        )}

        {/* Combat / target status */}
        {(isInCombat || isTargeted) && (
          <div className={`tt-combat-status ${isMyTurn ? 'my-turn' : ''} ${isTargeted && !isMyTurn ? 'targeted' : ''}`}>
            {isTargeted && <span style={{ marginRight: 6 }}><i className="fas fa-crosshairs"></i> Targeted</span>}
            {isInCombat && (isMyTurn ? 'Current Turn' : 'Waiting')}
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
                    {cond.icon && (
                      <img
                        className="tt-chip-icon"
                        src={cond.icon}
                        alt=""
                        aria-hidden="true"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
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
