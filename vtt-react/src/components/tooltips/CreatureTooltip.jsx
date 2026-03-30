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

// Helper to capitalize words
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const CreatureTooltip = ({
  creature,
  tokenState,
  isGM,
  position,
  activeConditions = [],
  isInCombat = false,
  combatInfo = null
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

  // Format size and type with proper capitalization
  const sizeText = capitalize(creature.size);
  const typeText = capitalize(creature.type);

  const tooltipStyle = {
    left: position.x,
    top: position.y,
    position: 'fixed',
    transform: position.x > (typeof window !== 'undefined' ? window.innerWidth - 200 : 1000) ? 'translateX(-100%)' : 'none'
  };

  // Get condition type for styling
  const getConditionClass = (cond) => {
    if (cond.type === 'buff') return 'buff';
    if (cond.type === 'debuff') return 'debuff';
    return '';
  };

  return createPortal(
    <div className="creature-tooltip" style={tooltipStyle}>
      <div className="tooltip-border-top" />
      
      {/* View mode indicator - only show for GM */}
      {isGM && (
        <div className="tooltip-view-mode gm">
          GM
        </div>
      )}

      {/* Header */}
      <div className="creature-tooltip-header">
        <div className="tooltip-icon-wrapper">
          <img
            src={tokenState?.customIcon || getCreatureTokenIconUrl(creature.tokenIcon, creature.type)}
            alt={creature.name}
            className="tooltip-icon"
            onError={(e) => {
              e.target.src = getCreatureTokenIconUrl(null, creature.type);
            }}
          />
        </div>
        <div className="tooltip-title-section">
          <div className="tooltip-name">
            {tokenState?.customName || creature.name}
          </div>
          <div className="tooltip-subtitle">
            {sizeText} {typeText}
            {creature.challengeRating && (
              <span className="tooltip-cr"> CR {creature.challengeRating}</span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="creature-tooltip-body">
        {isGM ? (
          /* ===== GM VIEW ===== */
          <div className="gm-stats-view">
            {/* Combat Stats */}
            <div className="tooltip-section">
              <div className="tooltip-horizontal-stats">
                <div className="horizontal-stat">
                  <span className="stat-label">Spd</span>
                  <span className="stat-value">{speed}<span className="stat-unit">ft</span></span>
                </div>
                <div className="horizontal-stat">
                  <span className="stat-label">ARMOR</span>
                  <span className="stat-value">
                    <span className="armor-main">{armor}</span>
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

              <div className="tooltip-stat-row">
                <span className="stat-label">Attack</span>
                <span className="stat-value attack-value">
                  <span className="attack-dice">{attackInfo.formula}</span>
                  <span className="attack-type" style={{ color: '#5a1e12', fontWeight: 700 }}>
                    {damageType.label.toLowerCase()}
                  </span>
                </span>
              </div>
              
              <div className="tooltip-stat-row">
                <span className="stat-label">Armor Detail</span>
                <span className="stat-value">
                  <span className="armor-detail" style={{ marginLeft: 0 }}>DR {armorRating.passiveDR} • Soak {armorRating.soakDie}</span>
                </span>
              </div>
            </div>

            {/* Special Movement */}
            {specialMove.length > 0 && (
              <div className="tooltip-section special-movement">
                {specialMove.map((move, i) => (
                  <div key={i} className="tooltip-stat-row condensed">
                    <span className="stat-label">{move.type === 'fly' ? 'Fly' : 'Swim'}</span>
                    <span className="stat-value">{move.speed}<span className="stat-unit">ft</span></span>
                  </div>
                ))}
              </div>
            )}

            {/* Health */}
            <div className="tooltip-section health-section">
              <div className="tooltip-stat-row">
                <span className="stat-label">Health</span>
                <span className="stat-value">
                  <span className="hp-current" style={{ color: healthState.color }}>{currentHp}</span>
                  <span className="hp-separator">/</span>
                  <span className="hp-max">{maxHp}</span>
                  <span className="hp-pct" style={{ color: healthState.color }}>{Math.round(healthState.pct)}%</span>
                </span>
              </div>
              <div className="health-bar-container">
                <div 
                  className="health-bar-fill"
                  style={{ 
                    width: `${healthState.barFill}%`,
                    backgroundColor: healthState.color
                  }}
                />
                <span className="health-bar-label" style={{ color: healthState.color }}>
                  {healthState.label}
                </span>
              </div>
            </div>

            {/* Action Points were moved to horizontal stats above */}

            {/* Resistances */}
            {resistances.length > 0 && (
              <div className="tooltip-resistances">
                <div className="resist-label">
                  Resistances
                </div>
                <div className="resist-items">
                  {resistances.map((r, i) => (
                    <span key={i} className="resist-tag resistant" style={{ '--tag-color': r.color }}>
                      {r.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Immunities - extract from resistances where value is 'immune' */}
            {resistances.filter(r => r.level === 'immune').length > 0 && (
              <div className="tooltip-resistances immunities">
                <div className="resist-label">
                  Immunities
                </div>
                <div className="resist-items">
                  {resistances.filter(r => r.level === 'immune').map((r, i) => (
                    <span key={i} className="resist-tag immune" style={{ '--tag-color': r.color }}>
                      {r.type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vulnerabilities */}
            {vulnerabilities.length > 0 && (
              <div className="tooltip-resistances vulnerabilities">
                <div className="resist-label">
                  Vulnerabilities
                </div>
                <div className="resist-items">
                  {vulnerabilities.map((v, i) => (
                    <span key={i} className="resist-tag vulnerable" style={{ '--tag-color': v.color }}>
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Combat Status */}
            {isInCombat && combatInfo && (
              <div className={`tooltip-combat-status ${combatInfo.isMyTurn ? 'my-turn' : ''}`}>
                <div className="status-text">
                  {combatInfo.isMyTurn ? '⚔ Current Turn' : '⏳ Waiting'}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ===== PLAYER VIEW ===== */
          <div className="player-stats-view">
            <div className="tooltip-section" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
              <div className="tooltip-horizontal-stats" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                <div className="horizontal-stat">
                  <span className="stat-label">Speed</span>
                  <span className="stat-value" style={{ color: speedRating.color }}>
                    {speedRating.label}
                  </span>
                </div>
                
                <div className="horizontal-stat">
                  <span className="stat-label">Armor</span>
                  <span className="stat-value" style={{ color: armorRating.color }}>
                    {armorRating.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="tooltip-section health-section" style={{ background: 'transparent', padding: '0 0 6px 0', margin: 0 }}>
              <div className="tooltip-stat-row" style={{ paddingBottom: '2px' }}>
                <span className="stat-label">Health</span>
                <span className="stat-value" style={{ color: healthState.color, fontWeight: 700 }}>
                  {healthState.label}
                </span>
              </div>
              <div className="health-bar-container" style={{ marginTop: 0 }}>
                <div 
                  className="health-bar-fill"
                  style={{ 
                    width: `${healthState.barFill}%`,
                    backgroundColor: healthState.color
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditions - Both views */}
        {activeConditions && activeConditions.length > 0 && (
          <div className="tooltip-conditions">
            <div className="conditions-label">
              {isGM ? 'Active Effects' : 'Visible Effects'}
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

export default CreatureTooltip;
