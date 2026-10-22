import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ResourceOverflowModal.css';

/**
 * Resource configuration helper for Calm TTRPG theme
 */
export const getResourceConfig = (rawType) => {
  const type = (rawType || 'health').toLowerCase();

  if (type === 'mana' || type === 'mp') {
    return {
      type: 'mana',
      label: 'Mana',
      shortLabel: 'MP',
      tempName: 'Temporary Mana',
      title: 'Mana Surge Detected',
      icon: 'fas fa-wand-magic-sparkles',
      themeClass: 'theme-mana',
      explanation: 'Temporary Mana grants an arcane reserve, fueling incantations and spells beyond your standard capacity.',
      capButtonText: 'Cap at Max',
      tempButtonText: 'Add Temporary'
    };
  }

  if (type === 'actionpoints' || type === 'action_points' || type === 'ap') {
    return {
      type: 'actionPoints',
      label: 'Action Points',
      shortLabel: 'AP',
      tempName: 'Temporary AP',
      title: 'Action Surge Detected',
      icon: 'fas fa-bolt',
      themeClass: 'theme-ap',
      explanation: 'Temporary Action Points bestow decisive stamina, allowing for critical maneuvers and extra turns in combat.',
      capButtonText: 'Cap at Max',
      tempButtonText: 'Add Temporary'
    };
  }

  // Default to health
  return {
    type: 'health',
    label: 'Health',
    shortLabel: 'HP',
    tempName: 'Temporary HP',
    title: 'Overheal Detected',
    icon: 'fas fa-heart',
    themeClass: 'theme-health',
    explanation: 'Temporary HP forms a protective cushion, absorbing incoming strikes before your true vitality is diminished.',
    capButtonText: 'Cap at Max',
    tempButtonText: 'Add Temporary'
  };
};

/**
 * ResourceOverflowModal — Calm TTRPG Manuscript Modal
 * Replaces generic overheal alerts with a detailed, thematic manuscript popup
 * for Health (Overheal), Mana (Surge), and Action Points (Surge).
 */
const ResourceOverflowModal = ({
  isOpen = true,
  data,
  targetName,
  itemName,
  onCancel,
  onCap,
  onAddTemporary,
  onCapAll,
  onAddTemporaryAll
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onCancel) onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !data) {
    return null;
  }

  // Normalize single vs array data
  const items = Array.isArray(data)
    ? data.filter((d) => d && typeof d === 'object')
    : typeof data === 'object'
    ? [data]
    : [];

  if (items.length === 0) {
    return null;
  }

  const isMulti = items.length > 1;
  const primaryItem = items[0];
  const primaryConfig = isMulti
    ? {
        type: 'multi',
        label: 'Resources',
        shortLabel: 'Vitals',
        title: 'Resource Surge Detected',
        icon: 'fas fa-flask',
        themeClass: 'theme-multi',
        explanation:
          'Multiple vitals have exceeded their natural boundaries. Choose whether to cap at the limits or preserve the surplus as temporary reserves.',
        capButtonText: 'Cap All at Max',
        tempButtonText: 'Add All Temporary'
      }
    : getResourceConfig(primaryItem.resourceType);

  // Extract source item name if available from item payload
  const resolvedItemName =
    itemName ||
    primaryItem.item?.name ||
    primaryItem.itemName ||
    null;

  const content = (
    <div
      className="resource-overflow-overlay modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-overflow-title"
    >
      <div
        className={`resource-overflow-dialog ${primaryConfig.themeClass} overheal-modal`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top 3px Gilded Accent Bar */}
        <div className="resource-overflow-accent-bar" />

        {/* Header */}
        <div className="resource-overflow-header">
          <div className="resource-overflow-icon-frame">
            <i className={primaryConfig.icon} />
          </div>
          <h3 id="resource-overflow-title" className="resource-overflow-title">
            {primaryConfig.title}
          </h3>
        </div>

        {/* Body */}
        <div className="resource-overflow-body">
          {/* Context pill if target or item is identified */}
          {(targetName || resolvedItemName) && (
            <div className="resource-overflow-context-pill">
              {targetName && (
                <span className="context-target">
                  <i className="fas fa-shield-halved" /> {targetName}
                </span>
              )}
              {targetName && resolvedItemName && <span className="context-sep">✦</span>}
              {resolvedItemName && (
                <span className="context-source">
                  <i className="fas fa-sparkles" /> {resolvedItemName}
                </span>
              )}
            </div>
          )}

          {/* Ledger card list */}
          <div className="resource-overflow-ledger-list">
            {items.map((item, idx) => {
              const cfg = getResourceConfig(item.resourceType);
              const current = item.currentValue ?? 0;
              const max = item.maxValue ?? 0;
              const restore = item.adjustment ?? item.amount ?? 0;
              const excess =
                item.overhealAmount ??
                Math.max(0, current + restore - max);

              return (
                <div
                  key={idx}
                  className={`resource-overflow-ledger-card ${cfg.themeClass}`}
                >
                  <div className="ledger-header">
                    <span className="ledger-resource-name">
                      <i className={cfg.icon} /> {cfg.label}
                    </span>
                    <span className="ledger-excess-badge">
                      +{excess} {cfg.shortLabel} Surplus
                    </span>
                  </div>

                  <div className="ledger-stats-grid">
                    <div className="ledger-stat-col">
                      <span className="stat-label">Current</span>
                      <span className="stat-val">
                        {current} / {max}
                      </span>
                    </div>
                    <div className="ledger-stat-arrow">
                      <i className="fas fa-arrow-right" />
                    </div>
                    <div className="ledger-stat-col">
                      <span className="stat-label">Restoring</span>
                      <span className="stat-val restore">
                        +{restore} {cfg.shortLabel}
                      </span>
                    </div>
                    <div className="ledger-stat-arrow">
                      <i className="fas fa-equals" />
                    </div>
                    <div className="ledger-stat-col">
                      <span className="stat-label">Exceeds By</span>
                      <span className="stat-val excess">+{excess}</span>
                    </div>
                  </div>

                  {/* Individual actions for multi-resource lists */}
                  {isMulti && (
                    <div className="ledger-item-actions">
                      <button
                        type="button"
                        className="overflow-btn overflow-btn-subtle"
                        onClick={() => onCap && onCap(item.resourceType)}
                      >
                        Cap {cfg.shortLabel}
                      </button>
                      <button
                        type="button"
                        className={`overflow-btn overflow-btn-primary ${cfg.themeClass}`}
                        onClick={() =>
                          onAddTemporary && onAddTemporary(item.resourceType)
                        }
                      >
                        Add {cfg.shortLabel} as Temp
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanatory text */}
          <p className="resource-overflow-narrative">
            {isMulti ? (
              <>
                These restorations exceed natural maximum thresholds. Choose whether
                to cap each reserve at its limit or channel the excess into temporary
                vitality.
              </>
            ) : (
              (() => {
                const restore =
                  primaryItem.adjustment ?? primaryItem.amount ?? 0;
                const excess =
                  primaryItem.overhealAmount ??
                  Math.max(
                    0,
                    (primaryItem.currentValue || 0) +
                      restore -
                      (primaryItem.maxValue || 0)
                  );
                return (
                  <>
                    This restoration would restore{' '}
                    <strong>
                      +{restore} {primaryConfig.shortLabel}
                    </strong>
                    , but current capacity is{' '}
                    <strong>
                      {primaryItem.currentValue}/{primaryItem.maxValue}
                    </strong>
                    .{' '}
                    <strong>
                      +{excess} {primaryConfig.shortLabel}
                    </strong>{' '}
                    would exceed the maximum.
                  </>
                );
              })()
            )}
          </p>

          {/* Tactical Note Callout */}
          <div className={`resource-overflow-tip ${primaryConfig.themeClass}`}>
            <div className="tip-icon">
              <i className="fas fa-feather-pointed" />
            </div>
            <div className="tip-text">{primaryConfig.explanation}</div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="resource-overflow-actions">
          <button
            type="button"
            className="overflow-btn overflow-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          {!isMulti ? (
            <>
              <button
                type="button"
                className="overflow-btn overflow-btn-cap"
                onClick={() => onCap && onCap(primaryItem.resourceType)}
              >
                Cap at Max
              </button>
              <button
                type="button"
                className={`overflow-btn overflow-btn-primary ${primaryConfig.themeClass}`}
                onClick={() =>
                  onAddTemporary && onAddTemporary(primaryItem.resourceType)
                }
              >
                Add Temporary
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="overflow-btn overflow-btn-cap"
                onClick={() =>
                  onCapAll ? onCapAll() : onCap && onCap()
                }
              >
                Cap All
              </button>
              <button
                type="button"
                className={`overflow-btn overflow-btn-primary ${primaryConfig.themeClass}`}
                onClick={() =>
                  onAddTemporaryAll
                    ? onAddTemporaryAll()
                    : onAddTemporary && onAddTemporary()
                }
              >
                Add All Temporary
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body);
  }

  return content;
};

export default ResourceOverflowModal;
