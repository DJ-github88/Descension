import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './CreatureAbilityConfirmDialog.css';

/**
 * CreatureAbilityConfirmDialog
 * Confirmation popup when the GM clicks an ability in the hover fan-out.
 * Adheres to the calm manuscript TTRPG theme.
 * P8 unsupported use is explicitly notice-only; this presentation component never spends resources.
 */
const CreatureAbilityConfirmDialog = ({
  isOpen,
  creatureName = 'Creature',
  ability = null,
  currentAP = 0,
  currentMana = 0,
  tempAP = 0,
  tempMana = 0,
  maxAP = 0,
  maxMana = 0,
  rollText = null,
  noticeOnly = false,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (onCancel) onCancel();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [isOpen, onCancel]);

  if (!isOpen || !ability) return null;

  const apCost = Number(ability.apCost || 0);
  const manaCost = Number(ability.manaCost || 0);

  const effectiveAP = (Number(currentAP) || 0) + (Number(tempAP) || 0);
  const effectiveMana = (Number(currentMana) || 0) + (Number(tempMana) || 0);

  const hasEnoughAP = effectiveAP >= apCost;
  const hasEnoughMana = effectiveMana >= manaCost;
  const canAfford = noticeOnly || (hasEnoughAP && hasEnoughMana);

  const costParts = [];
  if (apCost > 0) costParts.push(`${apCost} AP`);
  if (manaCost > 0) costParts.push(`${manaCost} MP`);
  const costLabel = costParts.length > 0 ? costParts.join(' + ') : 'Free';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onCancel) onCancel();
  };

  return createPortal(
    <div
      className="creature-ability-confirm-overlay"
      onClick={handleBackdropClick}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="creature-ability-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={noticeOnly ? `Manual Notice: ${ability.name}` : `Use ${ability.name}?`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="dialog-header ability-confirm-header">
          <h3>
            <i className={noticeOnly ? 'fas fa-scroll' : 'fas fa-hand-sparkles'} />
            {noticeOnly ? 'Manual Ability Notice' : 'Confirm Ability'}
          </h3>
          <button
            type="button"
            className="dialog-close-btn ability-confirm-close"
            onClick={onCancel}
            aria-label="Close"
            title="Close (Esc)"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="dialog-content ability-confirm-content">
          <div className="creature-info ability-confirm-creature">
            <strong>{String(creatureName).toUpperCase()}</strong>
          </div>

          {noticeOnly && (
            <div className="ability-notice-card">
              <div className="ability-notice-badge">
                <i className="fas fa-feather-pointed" />
                <span>Notice Only · No Automated Consequence</span>
              </div>
              <p className="ability-notice-desc">
                Manual notice only. This does not roll dice, spend resources, or resolve effects automatically. Use GM manual controls to adjudicate the final outcome.
              </p>
            </div>
          )}

          <div className="ability-intent-card">
            <div className="ability-intent-header">
              <span className="ability-confirm-sub">Intent to use</span>
              <strong className="ability-confirm-name">{ability.name}</strong>
              {ability.formula && (
                <span className="ability-confirm-formula" title="Damage / Healing formula">
                  <i className="fas fa-dice-d20" /> {ability.formula}{ability.damageType ? ` ${ability.damageType}` : ''}
                </span>
              )}
            </div>

            {ability.description && (
              <p className="ability-confirm-desc">{ability.description}</p>
            )}

            <div className="ability-cost-panel">
              <div className="cost-panel-title">
                <i className="fas fa-sparkles" />
                <span>Resource Cost</span>
              </div>
              <div className="cost-row">
                <span className="cost-row-label">Action Points:</span>
                <span className="cost-row-value">{apCost > 0 ? `${apCost} AP` : 'Free'}</span>
              </div>
              {manaCost > 0 && (
                <div className="cost-row">
                  <span className="cost-row-label">Mana:</span>
                  <span className="cost-row-value">{manaCost} MP</span>
                </div>
              )}
            </div>
          </div>

          {rollText && (
            <div className="ability-confirm-roll">{rollText}</div>
          )}

          {!noticeOnly && (
            <div className="ability-confirm-resources">
              <div className="resources-title">
                <i className="fas fa-bolt" />
                <span>Current Resources</span>
              </div>
              <div className={`resource-row ${hasEnoughAP ? '' : 'insufficient'}`}>
                <span>Action Points:</span>
                <span>
                  <strong className="res-current">{effectiveAP}</strong> / {maxAP}
                  {apCost > 0 ? <span className="res-projected"> → {Math.max(0, effectiveAP - apCost)}</span> : null}
                </span>
              </div>
              {maxMana > 0 && (
                <div className={`resource-row ${hasEnoughMana ? '' : 'insufficient'}`}>
                  <span>Mana:</span>
                  <span>
                    <strong className="res-current">{effectiveMana}</strong> / {maxMana}
                    {manaCost > 0 ? <span className="res-projected"> → {Math.max(0, effectiveMana - manaCost)}</span> : null}
                  </span>
                </div>
              )}
            </div>
          )}

          {!canAfford && (
            <div className="ability-confirm-warning">
              <i className="fas fa-exclamation-triangle" />
              <span>
                {!hasEnoughAP && !hasEnoughMana
                  ? `Insufficient resources! Needs ${costLabel}, has ${effectiveAP} AP and ${effectiveMana} MP.`
                  : !hasEnoughAP
                    ? `Insufficient Action Points! Needs ${apCost} AP, has ${effectiveAP} AP.`
                    : `Insufficient Mana! Needs ${manaCost} MP, has ${effectiveMana} MP.`}
              </span>
            </div>
          )}
        </div>

        <div className="dialog-actions ability-confirm-actions">
          <button
            type="button"
            className="dialog-button ability-confirm-btn cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`dialog-button ability-confirm-btn confirm ${canAfford ? '' : 'disabled'}`}
            onClick={onConfirm}
            disabled={!canAfford}
          >
            {noticeOnly ? 'Post Manual Notice' : canAfford ? `Use ${ability.name}` : 'Insufficient Resources'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

CreatureAbilityConfirmDialog.propTypes = {
  isOpen: PropTypes.bool,
  creatureName: PropTypes.string,
  ability: PropTypes.object,
  currentAP: PropTypes.number,
  currentMana: PropTypes.number,
  tempAP: PropTypes.number,
  tempMana: PropTypes.number,
  maxAP: PropTypes.number,
  maxMana: PropTypes.number,
  rollText: PropTypes.string,
  noticeOnly: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

export default CreatureAbilityConfirmDialog;
