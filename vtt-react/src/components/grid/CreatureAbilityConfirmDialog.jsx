import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import './CreatureAbilityConfirmDialog.css';

/**
 * CreatureAbilityConfirmDialog
 * Confirmation popup when the GM clicks an ability in the hover fan-out.
 * Shows the ability cost vs the creature token's live resources and deducts
 * AP + mana from that token's state on confirm.
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
  const canAfford = hasEnoughAP && hasEnoughMana;

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
        aria-label={`Use ${ability.name}?`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="ability-confirm-header">
          <h3>Use Ability?</h3>
          <button
            type="button"
            className="ability-confirm-close"
            onClick={onCancel}
            aria-label="Close"
            title="Close (Esc)"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="ability-confirm-content">
          <div className="ability-confirm-creature">
            <strong>{String(creatureName).toUpperCase()}</strong>
            <span className="ability-confirm-sub">wants to use</span>
            <strong className="ability-confirm-name">{ability.name}</strong>
          </div>

          <div className="ability-confirm-cost-row">
            <span className="cost-label">Cost:</span>
            <span className="cost-value">{costLabel}</span>
            {ability.formula && (
              <span className="ability-confirm-formula" title="Damage formula">
                {ability.formula}{ability.damageType ? ` ${ability.damageType}` : ''}
              </span>
            )}
          </div>

          {rollText && (
            <div className="ability-confirm-roll">{rollText}</div>
          )}

          <div className="ability-confirm-resources">
            <div className={`resource-row ${hasEnoughAP ? '' : 'insufficient'}`}>
              <span>Action Points:</span>
              <span>{effectiveAP} / {maxAP} {apCost > 0 ? `→ ${Math.max(0, effectiveAP - apCost)}` : ''}</span>
            </div>
            <div className={`resource-row ${hasEnoughMana ? '' : 'insufficient'}`}>
              <span>Mana:</span>
              <span>{effectiveMana} / {maxMana} {manaCost > 0 ? `→ ${Math.max(0, effectiveMana - manaCost)}` : ''}</span>
            </div>
          </div>

          {!canAfford && (
            <div className="ability-confirm-warning">
              <i className="fas fa-exclamation-triangle" />
              {!hasEnoughAP && !hasEnoughMana
                ? `Insufficient resources! Needs ${costLabel}, has ${effectiveAP} AP and ${effectiveMana} MP.`
                : !hasEnoughAP
                  ? `Insufficient Action Points! Needs ${apCost} AP, has ${effectiveAP} AP.`
                  : `Insufficient Mana! Needs ${manaCost} MP, has ${effectiveMana} MP.`}
            </div>
          )}
        </div>

        <div className="ability-confirm-actions">
          <button
            type="button"
            className="ability-confirm-btn cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`ability-confirm-btn confirm ${canAfford ? '' : 'disabled'}`}
            onClick={onConfirm}
            disabled={!canAfford}
          >
            {canAfford ? `Use ${ability.name} (${costLabel})` : 'Insufficient Resources'}
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
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

export default CreatureAbilityConfirmDialog;
