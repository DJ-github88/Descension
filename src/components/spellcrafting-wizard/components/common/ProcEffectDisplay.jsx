import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faPercent, faDice, faSkull } from '@fortawesome/free-solid-svg-icons';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import UnifiedSpellCard from './UnifiedSpellCard';
import '../../styles/ProcEffectDisplay.css';

/**
 * ProcEffectDisplay Component
 * Displays proc effects alongside spell cards without taking up space on the main card
 * Shows a simplified version of the linked spell with proc information
 */
const ProcEffectDisplay = ({
  spell,
  className = '',
  position = 'right' // 'right', 'left', 'below'
}) => {
  const library = useSpellLibrary();

  // Check if spell has proc system mechanics
  const hasProcSystem = spell?.mechanicsConfig?.some(config => 
    config.system === 'PROC_SYSTEM' && config.procOptions?.spellId
  );

  if (!hasProcSystem) {
    return null;
  }

  // Get all proc configurations
  const procConfigs = spell.mechanicsConfig.filter(config => 
    config.system === 'PROC_SYSTEM' && config.procOptions?.spellId
  );

  return (
    <div className={`proc-effect-display ${position} ${className}`}>
      <div className="proc-effect-header">
        <FontAwesomeIcon icon={faBolt} className="proc-icon" />
        <span className="proc-title">Proc Effects</span>
      </div>
      
      <div className="proc-effects-list">
        {procConfigs.map((config, index) => {
          const linkedSpell = library?.spells?.find(s => s.id === config.procOptions.spellId);
          
          if (!linkedSpell) {
            return (
              <div key={index} className="proc-effect-missing">
                <FontAwesomeIcon icon={faSkull} className="missing-icon" />
                <span className="missing-text">Linked spell not found</span>
              </div>
            );
          }

          return (
            <div key={index} className="proc-effect-item">
              {/* Proc trigger information */}
              <div className="proc-trigger-info">
                <div className="proc-chance">
                  <FontAwesomeIcon icon={faPercent} className="chance-icon" />
                  <span className="chance-value">{config.procOptions.procChance || 15}%</span>
                </div>
                <div className="proc-type">
                  <span className="trigger-text">
                    {config.procOptions.procType?.replace('_', ' ') || 'on hit'}
                  </span>
                </div>
                {config.procOptions.triggerLimit > 1 && (
                  <div className="proc-limit">
                    <span className="limit-text">
                      max {config.procOptions.triggerLimit}/round
                    </span>
                  </div>
                )}
              </div>

              {/* Simplified spell card for the linked spell */}
              <div className="proc-spell-card">
                <UnifiedSpellCard
                  spell={linkedSpell}
                  variant="compact"
                  showActions={false}
                  showDescription={true}
                  showStats={true}
                  showTags={false}
                  className="proc-linked-spell"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcEffectDisplay;
