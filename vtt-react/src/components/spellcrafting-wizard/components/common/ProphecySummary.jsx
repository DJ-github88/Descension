import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull, faHourglassHalf, faBolt, faEye, faSkullCrossbones, faBan, faCrosshairs, faShieldAlt, faSkullCrossbones as faDeath, faLink } from '@fortawesome/free-solid-svg-icons';
import ProphecyRollTable from './ProphecyRollTable';
import './ProphecySummary.css';

/**
 * Prophecy Summary Component
 * Renders the Doomsayer's prophecy resolution table with a charcoal-and-ink aesthetic.
 */
const ProphecySummary = ({ prophecyData, damageType = 'necrotic', className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!prophecyData) return null;

  const {
    rangeDice = ['d4', 'd4'],
    resolutionDie = 'd4',
    prophesied = {},
    base = {},
    outside = {}
  } = prophecyData;

  const formatRange = (dice) => {
    if (Array.isArray(dice)) return dice.join('+');
    return dice;
  };

  const rangeText = formatRange(rangeDice);

  const formatSaveDC = (dc, saveType) => {
    if (!dc) return null;
    const dcText = typeof dc === 'string' ? dc.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : dc;
    return `DC ${dcText} ${saveType || ''} save negates`;
  };

  // Helper to format damage type for display
  const formatDamageType = (type) => {
    if (!type) return 'necrotic';
    return type.toLowerCase();
  };

  const effectiveDamageType = formatDamageType(damageType);

  // Helper to prevent double-printing damage types if they're already in the formula
  const formatDamageDisplay = (damage, type) => {
    if (!damage) return null;
    if (typeof damage !== 'string') return `${damage} ${type}`;
    
    const knownTypes = [
      'fire', 'frost', 'lightning', 'arcane', 'nature', 'force', 
      'necrotic', 'radiant', 'poison', 'psychic', 'chaos', 'void', 'physical'
    ];
    
    const hasType = knownTypes.some(t => damage.toLowerCase().includes(t));
    return hasType ? damage : `${damage} ${type}`;
  };

  return (
    <div className={`prophecy-summary ${className} ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="prophecy-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="prophecy-title">
          <FontAwesomeIcon icon={faEye} className="prophecy-icon" />
          <span>Prophecy Resolution</span>
          <span className="prophecy-die-info">({rangeText} vs {resolutionDie})</span>
        </div>
        <div className="prophecy-toggle">{isExpanded ? '▼' : '▲'}</div>
      </div>

      {isExpanded && (
        <div className="prophecy-body">
          <div className="prophecy-track">
            {/* Prophesied Outcome */}
            <div className="prophecy-outcome prophesied">
              <div className="outcome-meta">
                <span className="outcome-label">Prophesied</span>
                <span className="outcome-range">Target Range</span>
              </div>
              <div className="outcome-content">
                {prophesied.damage && (
                  <div className="outcome-mechanic damage">
                    <FontAwesomeIcon icon={faSkull} />
                    <span>{formatDamageDisplay(prophesied.damage, effectiveDamageType)}</span>
                  </div>
                )}
                {prophesied.effect && (
                  <div className="outcome-mechanic effect">
                    <FontAwesomeIcon icon={faSkullCrossbones} />
                    {typeof prophesied.effect === 'object' ? (
                      <div className="effect-details">
                        <span className="effect-name">{prophesied.effect.name}</span>
                        {prophesied.effect.duration && (
                          <span className="effect-duration">
                            <FontAwesomeIcon icon={faHourglassHalf} className="detail-icon" /> {prophesied.effect.duration} {prophesied.effect.unit || 'rounds'}
                          </span>
                        )}
                        {prophesied.effect.damagePerRound && (
                          <span className="effect-dot">
                            <FontAwesomeIcon icon={faSkull} className="detail-icon" /> {prophesied.effect.damagePerRound} per round
                          </span>
                        )}
                        {prophesied.effect.statModifiers && (
                          <div className="effect-stat-mods">
                            {prophesied.effect.statModifiers.map((mod, i) => (
                              <span key={i} className="stat-mod-badge">
                                {mod.stat} {mod.value > 0 ? '+' : ''}{mod.value}
                              </span>
                            ))}
                          </div>
                        )}
                        {prophesied.effect.healingBlock && (
                          <span className="effect-tag healing-block">
                            <FontAwesomeIcon icon={faBan} className="detail-icon" /> No Healing
                          </span>
                        )}
                        {prophesied.effect.bonusDamageTaken && (
                          <span className="effect-tag bonus-damage">
                            <FontAwesomeIcon icon={faCrosshairs} className="detail-icon" /> +{prophesied.effect.bonusDamageTaken} {prophesied.effect.bonusDamageType || ''} from all sources
                          </span>
                        )}
                        {prophesied.effect.saveDC && (
                          <span className="effect-tag save-check">
                            <FontAwesomeIcon icon={faShieldAlt} className="detail-icon" /> {formatSaveDC(prophesied.effect.saveDC, prophesied.effect.saveType)}
                          </span>
                        )}
                        {prophesied.effect.instantKill && (
                          <span className="effect-tag instant-kill">
                            <FontAwesomeIcon icon={faDeath} className="detail-icon" /> Instant Death{prophesied.effect.bypassImmunity ? ' (Bypasses Immunity)' : ''}
                          </span>
                        )}
                        {prophesied.effect.instantKillThreshold && !prophesied.effect.instantKill && (
                          <span className="effect-tag instant-kill">
                            <FontAwesomeIcon icon={faDeath} className="detail-icon" /> Instant Death if below {Math.round(prophesied.effect.instantKillThreshold * 100)}% HP
                          </span>
                        )}
                        {prophesied.effect.cascadeDamage && (
                          <span className="effect-tag cascade">
                            <FontAwesomeIcon icon={faLink} className="detail-icon" /> Cascades {prophesied.effect.cascadeDamage} to targets within {prophesied.effect.cascadeRange}ft
                          </span>
                        )}
                        {prophesied.effect.description && (
                          <span className="effect-detail-text">{prophesied.effect.description}</span>
                        )}
                      </div>
                    ) : (
                      <span>{prophesied.effect.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                )}
                {prophesied.havocGain !== undefined && (
                  <div className="outcome-mechanic havoc">
                    <FontAwesomeIcon icon={faBolt} />
                    <span>+{prophesied.havocGain} Havoc</span>
                  </div>
                )}
                {prophesied.description && (
                  <div className="outcome-description">{prophesied.description}</div>
                )}
              </div>
            </div>

            {/* Base Outcome */}
            <div className="prophecy-outcome base">
              <div className="outcome-meta">
                <span className="outcome-label">Base</span>
                <span className="outcome-range">Normal Success</span>
              </div>
              <div className="outcome-content">
                {base.damage && (
                  <div className="outcome-mechanic damage">
                    <FontAwesomeIcon icon={faSkull} />
                    <span>{formatDamageDisplay(base.damage, effectiveDamageType)}</span>
                  </div>
                )}
                {base.effect && (
                  <div className="outcome-mechanic effect">
                    <FontAwesomeIcon icon={faSkullCrossbones} />
                    {typeof base.effect === 'object' ? (
                      <div className="effect-details">
                        <span className="effect-name">{base.effect.name}</span>
                        {base.effect.duration && (
                          <span className="effect-duration">
                            ({base.effect.duration} {base.effect.unit || 'rounds'})
                          </span>
                        )}
                        {base.effect.damagePerRound && (
                          <span className="effect-dot">
                            <FontAwesomeIcon icon={faSkull} className="detail-icon" /> {base.effect.damagePerRound} per round
                          </span>
                        )}
                        {base.effect.statModifiers && (
                          <div className="effect-stat-mods">
                            {base.effect.statModifiers.map((mod, i) => (
                              <span key={i} className="stat-mod-badge">
                                {mod.stat} {mod.value > 0 ? '+' : ''}{mod.value}
                              </span>
                            ))}
                          </div>
                        )}
                        {base.effect.healingBlock && (
                          <span className="effect-tag healing-block">
                            <FontAwesomeIcon icon={faBan} className="detail-icon" /> No Healing
                          </span>
                        )}
                        {base.effect.bonusDamageTaken && (
                          <span className="effect-tag bonus-damage">
                            <FontAwesomeIcon icon={faCrosshairs} className="detail-icon" /> +{base.effect.bonusDamageTaken} {base.effect.bonusDamageType || ''} from all sources
                          </span>
                        )}
                        {base.effect.saveDC && (
                          <span className="effect-tag save-check">
                            <FontAwesomeIcon icon={faShieldAlt} className="detail-icon" /> {formatSaveDC(base.effect.saveDC, base.effect.saveType)}
                          </span>
                        )}
                        {base.effect.instantKill && (
                          <span className="effect-tag instant-kill">
                            <FontAwesomeIcon icon={faDeath} className="detail-icon" /> Instant Death{base.effect.bypassImmunity ? ' (Bypasses Immunity)' : ''}
                          </span>
                        )}
                        {base.effect.instantKillThreshold && !base.effect.instantKill && (
                          <span className="effect-tag instant-kill">
                            <FontAwesomeIcon icon={faDeath} className="detail-icon" /> Instant Death if below {Math.round(base.effect.instantKillThreshold * 100)}% HP
                          </span>
                        )}
                        {base.effect.cascadeDamage && (
                          <span className="effect-tag cascade">
                            <FontAwesomeIcon icon={faLink} className="detail-icon" /> Cascades {base.effect.cascadeDamage} to targets within {base.effect.cascadeRange}ft
                          </span>
                        )}
                        {base.effect.description && (
                          <span className="effect-detail-text">{base.effect.description}</span>
                        )}
                      </div>
                    ) : (
                      <span>{base.effect.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                )}
                {base.havocGain !== undefined && (
                  <div className="outcome-mechanic havoc">
                    <FontAwesomeIcon icon={faBolt} />
                    <span>+{base.havocGain} Havoc</span>
                  </div>
                )}
                {base.description && (
                  <div className="outcome-description">{base.description}</div>
                )}
              </div>
            </div>

            {/* Outside Outcome */}
            <div className="prophecy-outcome outside">
              <div className="outcome-meta">
                <span className="outcome-label">Outside</span>
                <span className="outcome-range">Backlash</span>
              </div>
              <div className="outcome-content">
                {outside.backlash && (
                  <div className="outcome-mechanic backlash">
                    <FontAwesomeIcon icon={faHourglassHalf} />
                    <span>Backlash: {typeof outside.backlash === 'object' ? outside.backlash.name || outside.backlash.description || JSON.stringify(outside.backlash) : outside.backlash}</span>
                    {typeof outside.backlash === 'object' && outside.backlash.description && outside.backlash.name && (
                      <span className="effect-detail-text">{outside.backlash.description}</span>
                    )}
                  </div>
                )}
                {outside.effect && (
                  <div className="outcome-mechanic effect">
                    <FontAwesomeIcon icon={faSkullCrossbones} />
                    {typeof outside.effect === 'object' ? (
                      <div className="effect-details">
                        <span className="effect-name">{outside.effect.name}</span>
                        {outside.effect.duration && (
                          <span className="effect-duration">
                            <FontAwesomeIcon icon={faHourglassHalf} className="detail-icon" /> {outside.effect.duration} {outside.effect.unit || 'rounds'}
                          </span>
                        )}
                        {outside.effect.description && (
                          <span className="effect-detail-text">{outside.effect.description}</span>
                        )}
                      </div>
                    ) : (
                      <span>{outside.effect.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                )}
                {outside.havocGain !== undefined && (
                  <div className="outcome-mechanic havoc">
                    <FontAwesomeIcon icon={faBolt} />
                    <span>+{outside.havocGain} Havoc</span>
                  </div>
                )}
                {outside.description && (
                  <div className="outcome-description">{outside.description}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="prophecy-footer">
            <p>Roll {resolutionDie} against {rangeText} thresholds. Prophesied occurs if result is within prediction. Outside occurs on failure.</p>
          </div>
        </div>
      )}

      {/* Roll Tables (e.g., Rain Table) */}
      {prophecyData.tableConfig && isExpanded && (
        <div className="prophecy-tables-section">
          <ProphecyRollTable tableConfig={prophecyData.tableConfig} />
        </div>
      )}
    </div>
  );
};

ProphecySummary.propTypes = {
  prophecyData: PropTypes.shape({
    rangeDice: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    resolutionDie: PropTypes.string,
    prophesied: PropTypes.object,
    base: PropTypes.object,
    outside: PropTypes.object
  }),
  damageType: PropTypes.string,
  className: PropTypes.string
};

export default ProphecySummary;
