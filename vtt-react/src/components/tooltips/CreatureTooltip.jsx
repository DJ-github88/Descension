import React from 'react';
import { createPortal } from 'react-dom';
import {
  getHealthState,
  getSpeedRating,
  getArmorRating,
  getBaseAttackDie,
  getSpecialMovement,
  getResistancesSummary,
  getVulnerabilitiesSummary,
  formatDamageType
} from '../../utils/creatureTooltipUtils';
import { getCreatureTokenIconUrl } from '../../utils/assetManager';
import '../../styles/CreatureTooltip.css';

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * playerTooltipMode:
 *   'vague'   – shows color-coded descriptors (default for players)
 *   'partial' – shows health bar + descriptive labels (no exact numbers)
 *   'full'    – shows everything the GM sees (exact numbers)
 */
const CreatureTooltip = ({
  creature,
  tokenState,
  isGM,
  position,
  activeConditions = [],
  isInCombat = false,
  combatInfo = null,
  playerTooltipMode = 'vague'
}) => {
  if (!creature) return null;

  const stats = creature.stats || {};
  const currentHp = tokenState?.currentHp ?? stats.currentHp ?? stats.maxHp ?? 0;
  const maxHp = stats.maxHp || 100;
  const armor = stats.armorClass || stats.armor || 10;
  const speed = stats.speed || 30;

  const healthState = getHealthState(currentHp, maxHp);
  const speedRating = getSpeedRating(speed);
  const armorRating = getArmorRating(armor);
  const attackInfo = getBaseAttackDie(creature);
  const specialMove = getSpecialMovement(creature);
  const resistances = getResistancesSummary(creature);
  const vulnerabilities = getVulnerabilitiesSummary(creature);
  const damageType = formatDamageType(attackInfo.damageType);

  const currentAp = tokenState?.currentActionPoints ?? stats.currentActionPoints ?? stats.maxActionPoints ?? 5;
  const maxAp = stats.maxActionPoints || 5;

  const sizeText = capitalize(creature.size);
  const typeText = capitalize(creature.type);

  // Smart screen-edge positioning
  const tooltipStyle = {
    left: position.x,
    top: position.y,
    position: 'fixed',
    transform: position.x > (typeof window !== 'undefined' ? window.innerWidth - 220 : 1000)
      ? 'translateX(-100%)'
      : 'none'
  };

  const getConditionClass = (cond) => {
    if (cond.type === 'buff') return 'buff';
    if (cond.type === 'debuff') return 'debuff';
    return 'neutral';
  };

  // Resistances split out properly
  const pureResistances = resistances.filter(r => r.level !== 'immune');
  const immunities = resistances.filter(r => r.level === 'immune');

  return createPortal(
    <div className="creature-tooltip" style={tooltipStyle}>
      {/* ─── HEADER ─── */}
      <div className="creature-tooltip-header">
        <div className="tooltip-icon-wrapper">
          <img
            src={tokenState?.customIcon || getCreatureTokenIconUrl(creature.tokenIcon, creature.type)}
            alt={creature.name}
            className="tooltip-icon"
            onError={(e) => { e.target.src = getCreatureTokenIconUrl(null, creature.type); }}
          />
        </div>
        <div className="tooltip-title-section">
          <div className="tooltip-name">
            {tokenState?.customName || creature.name}
          </div>
          <div className="tooltip-subtitle">
            {sizeText} {typeText}
            {creature.challengeRating && (
              <span className="tooltip-cr">CR {creature.challengeRating}</span>
            )}
          </div>
        </div>
        <span className={`tooltip-role-badge ${isGM ? 'gm' : 'player'}`}>
          {isGM ? 'GM' : 'Player'}
        </span>
      </div>

      {/* ─── BODY ─── */}
      <div className="creature-tooltip-body">

        {isGM ? (
          /* ══════ GM VIEW – full data ══════ */
          <>
            {/* Stat grid: SPD / AC / AP */}
            <div className="tt-stat-grid">
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">Speed</span>
                <span className="tt-stat-cell-value">
                  {speed}<span className="stat-unit">ft</span>
                </span>
              </div>
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">Armor</span>
                <span className="tt-stat-cell-value">{armor}</span>
              </div>
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">AP</span>
                <span className="tt-stat-cell-value">
                  <span style={{ color: '#7dd3fc' }}>{currentAp}</span>
                  <span className="slash">/</span>
                  <span style={{ color: 'rgba(240,230,210,0.4)', fontSize: 10 }}>{maxAp}</span>
                </span>
              </div>
            </div>

            {/* Attack + Armor Detail rows */}
            <div className="tt-divider" />
            <div className="tt-row">
              <span className="tt-row-label">Attack</span>
              <span className="tt-row-value">
                <span className="dice-badge">{attackInfo.formula}</span>
                <span className="dmg-type">{damageType.label.toLowerCase()}</span>
              </span>
            </div>
            <div className="tt-row">
              <span className="tt-row-label">Armor</span>
              <span className="tt-row-value">
                <span style={{ color: '#e8d9b8' }}>DR {armorRating.passiveDR}</span>
                <span className="armor-detail">• Soak {armorRating.soakDie}</span>
              </span>
            </div>

            {/* Special movement */}
            {specialMove.length > 0 && (
              <>
                <div className="tt-divider" />
                {specialMove.map((move, i) => (
                  <div key={i} className="tt-special-move">
                    <span className="tt-special-move-icon">
                      {move.type === 'fly' ? '🦅' : '🌊'}
                    </span>
                    <span className="tt-special-move-label">
                      {move.type === 'fly' ? 'Fly' : 'Swim'}
                    </span>
                    <span className="tt-special-move-value">
                      {move.speed}<span style={{ fontSize: 9, opacity: 0.6 }}>ft</span>
                    </span>
                  </div>
                ))}
              </>
            )}

            {/* Health bar */}
            <div className="tt-divider" />
            <div className="tt-health-section">
              <div className="tt-health-header">
                <span className="tt-health-label">Health</span>
                <span className="tt-health-value">
                  <span className="hp-num" style={{ color: healthState.color }}>{currentHp}</span>
                  <span className="hp-slash">/</span>
                  <span className="hp-max">{maxHp}</span>
                  <span className="hp-pct" style={{ color: healthState.color }}>
                    {Math.round(healthState.pct)}%
                  </span>
                </span>
              </div>
              <div className="tt-bar-track">
                <div
                  className="tt-bar-fill"
                  style={{ width: `${healthState.barFill}%`, backgroundColor: healthState.color }}
                />
                <span className="tt-bar-label">{healthState.label}</span>
              </div>
            </div>

            {/* Resistances */}
            {(pureResistances.length > 0 || immunities.length > 0 || vulnerabilities.length > 0) && (
              <div className="tt-resist-section">
                {pureResistances.length > 0 && (
                  <>
                    <div className="tt-resist-title">Resistances</div>
                    <div className="tt-resist-chips">
                      {pureResistances.map((r, i) => (
                        <span key={i} className="tt-chip resistant">{r.label}</span>
                      ))}
                    </div>
                  </>
                )}
                {immunities.length > 0 && (
                  <>
                    <div className="tt-resist-title" style={{ marginTop: pureResistances.length > 0 ? 6 : 0 }}>Immunities</div>
                    <div className="tt-resist-chips">
                      {immunities.map((r, i) => (
                        <span key={i} className="tt-chip immune">{r.type}</span>
                      ))}
                    </div>
                  </>
                )}
                {vulnerabilities.length > 0 && (
                  <>
                    <div className="tt-resist-title" style={{ marginTop: 6 }}>Vulnerabilities</div>
                    <div className="tt-resist-chips">
                      {vulnerabilities.map((v, i) => (
                        <span key={i} className="tt-chip vulnerable">{v.label}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Combat status */}
            {isInCombat && combatInfo && (
              <div className={`tt-combat-status ${combatInfo.isMyTurn ? 'my-turn' : ''}`}>
                {combatInfo.isMyTurn ? '⚔ Current Turn' : '⏳ Waiting'}
              </div>
            )}
          </>
        ) : playerTooltipMode === 'full' ? (
          /* ══════ PLAYER VIEW – full (GM grants) ══════ */
          <>
            <div className="tt-stat-grid two-col">
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">Speed</span>
                <span className="tt-stat-cell-value">{speed}<span className="stat-unit">ft</span></span>
              </div>
              <div className="tt-stat-cell">
                <span className="tt-stat-cell-label">Armor</span>
                <span className="tt-stat-cell-value">{armor}</span>
              </div>
            </div>
            <div className="tt-health-section">
              <div className="tt-health-header">
                <span className="tt-health-label">Health</span>
                <span className="tt-health-value">
                  <span className="hp-num" style={{ color: healthState.color }}>{currentHp}</span>
                  <span className="hp-slash">/</span>
                  <span className="hp-max">{maxHp}</span>
                </span>
              </div>
              <div className="tt-bar-track">
                <div className="tt-bar-fill" style={{ width: `${healthState.barFill}%`, backgroundColor: healthState.color }} />
                <span className="tt-bar-label">{healthState.label}</span>
              </div>
            </div>
          </>
        ) : playerTooltipMode === 'partial' ? (
          /* ══════ PLAYER VIEW – partial (bar + labels) ══════ */
          <>
            <div className="tt-descriptor-row">
              <span className="tt-descriptor-label">Speed</span>
              <span className="tt-descriptor-badge" style={{ color: speedRating.color }}>
                {speedRating.label}
              </span>
            </div>
            <div className="tt-descriptor-row">
              <span className="tt-descriptor-label">Armor</span>
              <span className="tt-descriptor-badge" style={{ color: armorRating.color }}>
                {armorRating.label}
              </span>
            </div>
            <div className="tt-divider" />
            <div className="tt-vague-health">
              <span className="tt-vague-health-label">Health</span>
              <span
                className="tt-vague-health-state"
                style={{
                  color: healthState.color,
                  background: `${healthState.color}18`,
                  border: `1px solid ${healthState.color}35`
                }}
              >
                {healthState.label}
              </span>
            </div>
            <div className="tt-bar-track">
              <div className="tt-bar-fill" style={{ width: `${healthState.barFill}%`, backgroundColor: healthState.color }} />
            </div>
          </>
        ) : (
          /* ══════ PLAYER VIEW – vague (default) ══════ */
          <>
            <div className="tt-descriptor-row">
              <span className="tt-descriptor-label">Speed</span>
              <span className="tt-descriptor-badge" style={{ color: speedRating.color }}>
                {speedRating.label}
              </span>
            </div>
            <div className="tt-descriptor-row">
              <span className="tt-descriptor-label">Armor</span>
              <span className="tt-descriptor-badge" style={{ color: armorRating.color }}>
                {armorRating.label}
              </span>
            </div>
            <div className="tt-divider" />
            <div className="tt-vague-health">
              <span className="tt-vague-health-label">Health</span>
              <span
                className="tt-vague-health-state"
                style={{
                  color: healthState.color,
                  background: `${healthState.color}18`,
                  border: `1px solid ${healthState.color}35`
                }}
              >
                {healthState.label}
              </span>
            </div>
          </>
        )}

        {/* ─── Conditions – shown to both but label differs ─── */}
        {activeConditions && activeConditions.length > 0 && (
          <div className="tt-conditions-section">
            <div className="tt-conditions-title">
              {isGM ? 'Active Effects' : 'Visible Effects'}
            </div>
            <div className="tt-condition-chips">
              {activeConditions.slice(0, 5).map((cond, i) => {
                const condName = cond.name || cond;
                return (
                  <span key={i} className={`tt-cond-chip ${getConditionClass(cond)}`}>
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

export default CreatureTooltip;
