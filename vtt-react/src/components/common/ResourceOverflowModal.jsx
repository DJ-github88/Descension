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
 *
 * Fully accounts for existing temporary reserves (e.g. 3/3 Base + 4 Temp AP = 7 AP)
 * so incoming adjustments (+2 AP -> 9 total) are crystal-clear and mathematically intuitive:
 * 7 AP + 2 AP = 9 AP.
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
          'Multiple vitals have exceeded their natural boundaries. Choose whether to cap each pool at capacity or preserve the surplus in temporary reserves.',
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

  // Primary math calculations for single-item display
  const primaryCurrent = primaryItem.currentValue ?? 0;
  const primaryMax = primaryItem.maxValue ?? 0;
  const primaryTemp = primaryItem.currentTemp ?? primaryItem.temp ?? 0;
  const primaryIncoming = primaryItem.adjustment ?? primaryItem.amount ?? 0;
  const primaryFillAmount = Math.max(0, Math.min(primaryIncoming, primaryMax - primaryCurrent));
  const primaryExcess =
    primaryItem.overhealAmount ??
    Math.max(0, (primaryCurrent + primaryIncoming) - primaryMax);
  const primaryProjectedBase = Math.min(primaryMax, primaryCurrent + primaryFillAmount);
  const primaryProjectedTemp = primaryTemp + primaryExcess;
  const primaryTotalCurrent = primaryCurrent + primaryTemp;
  const primaryTotalProjected = primaryProjectedBase + primaryProjectedTemp;

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
              const currentTemp = item.currentTemp ?? item.temp ?? 0;
              const incoming = item.adjustment ?? item.amount ?? 0;
              const fillAmount = Math.max(0, Math.min(incoming, max - current));
              const excess =
                item.overhealAmount ??
                Math.max(0, (current + incoming) - max);
              const projectedBase = Math.min(max, current + fillAmount);
              const projectedTemp = currentTemp + excess;
              const totalCurrent = current + currentTemp;
              const totalProjected = projectedBase + projectedTemp;

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

                  {/* Mathematical Arithmetic Ledger: Current Total + Incoming = Projected Total | Temp Reserve */}
                  <div className="ledger-stats-grid">
                    <div className="ledger-stat-col">
                      <span className="stat-label">
                        {currentTemp > 0 ? 'Current Total' : 'Current'}
                      </span>
                      <span className="stat-val">
                        {currentTemp > 0 ? `${totalCurrent} ${cfg.shortLabel}` : `${current} / ${max}`}
                      </span>
                      {currentTemp > 0 ? (
                        <span className="stat-subval-temp">{current}/{max} + {currentTemp} Temp</span>
                      ) : (
                        <span className="stat-subval-temp">Base Pool</span>
                      )}
                    </div>

                    <div className="ledger-stat-math-sign">+</div>

                    <div className="ledger-stat-col">
                      <span className="stat-label">Incoming</span>
                      <span className="stat-val incoming">
                        +{incoming} {cfg.shortLabel}
                      </span>
                      <span className="stat-subval-temp">
                        {fillAmount > 0 && excess > 0 ? `+${fillAmount} Base, +${excess} Temp` : 'To Reserves'}
                      </span>
                    </div>

                    <div className="ledger-stat-math-sign">=</div>

                    <div className="ledger-stat-col">
                      <span className="stat-label">
                        {currentTemp > 0 ? 'Projected Total' : 'Projected'}
                      </span>
                      <span className="stat-val projected">
                        {totalProjected} {cfg.shortLabel}
                      </span>
                      <span className="stat-subval-temp">
                        {projectedBase}/{max} + {projectedTemp} Temp
                      </span>
                    </div>

                    <div className="ledger-stat-math-sign">|</div>

                    <div className="ledger-stat-col">
                      <span className="stat-label">
                        {currentTemp > 0 ? 'Temp Reserve' : 'Surplus'}
                      </span>
                      <span className="stat-val excess">
                        +{projectedTemp} {cfg.shortLabel}
                      </span>
                      <span className="stat-subval-temp">
                        {currentTemp > 0 ? `was +${currentTemp} Temp` : 'New Reserve'}
                      </span>
                    </div>
                  </div>

                  {/* Clarifying subrow showing exact allocation */}
                  <div className="ledger-breakdown-subrow">
                    {currentTemp > 0 ? (
                      fillAmount > 0 ? (
                        <>
                          <span className="breakdown-fill">
                            <i className="fas fa-arrow-up" /> Fills base: +{fillAmount} {cfg.shortLabel} ({max}/{max})
                          </span>
                          <span className="breakdown-dot">•</span>
                          <span className="breakdown-overflow">
                            <i className="fas fa-shield" /> Temp Reserve: {currentTemp} + {excess} = {projectedTemp} {cfg.shortLabel}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="breakdown-fill">
                            <i className="fas fa-check" /> Base pool full ({max}/{max})
                          </span>
                          <span className="breakdown-dot">•</span>
                          <span className="breakdown-overflow">
                            <i className="fas fa-shield" /> Temp Reserve: {currentTemp} + {excess} = {projectedTemp} {cfg.shortLabel}
                          </span>
                        </>
                      )
                    ) : fillAmount > 0 ? (
                      <>
                        <span className="breakdown-fill">
                          <i className="fas fa-arrow-up" /> Fills base: +{fillAmount} {cfg.shortLabel} ({max}/{max})
                        </span>
                        <span className="breakdown-dot">•</span>
                        <span className="breakdown-overflow">
                          <i className="fas fa-shield" /> Excess: +{excess} {cfg.shortLabel}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="breakdown-fill">
                          <i className="fas fa-check" /> Base pool full ({max}/{max})
                        </span>
                        <span className="breakdown-dot">•</span>
                        <span className="breakdown-overflow">
                          <i className="fas fa-shield" /> All +{excess} {cfg.shortLabel} overflows
                        </span>
                      </>
                    )}
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
                        {currentTemp > 0
                          ? `Add +${excess} (${projectedTemp} Temp Total)`
                          : `Add +${excess} Temp ${cfg.shortLabel}`}
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
                These restorations exceed pool maximums. Choose whether to cap each
                pool at capacity or preserve the surplus in temporary reserves.
              </>
            ) : primaryTemp > 0 ? (
              primaryFillAmount === 0 ? (
                <>
                  You currently have a total of <strong>{primaryTotalCurrent} {primaryConfig.shortLabel}</strong> (<strong>{primaryCurrent}/{primaryMax} Base</strong> plus{' '}
                  <strong>+{primaryTemp} Temporary {primaryConfig.shortLabel}</strong>).
                  Adding <strong>+{primaryIncoming} {primaryConfig.shortLabel}</strong> brings your total to{' '}
                  <strong>{primaryTotalProjected} {primaryConfig.shortLabel}</strong> (increasing your Temporary reserve from{' '}
                  <strong>+{primaryTemp}</strong> to <strong>+{primaryProjectedTemp}</strong>).
                </>
              ) : (
                <>
                  You currently have a total of <strong>{primaryTotalCurrent} {primaryConfig.shortLabel}</strong> (<strong>{primaryCurrent}/{primaryMax} Base</strong> plus{' '}
                  <strong>+{primaryTemp} Temporary {primaryConfig.shortLabel}</strong>).
                  Incoming <strong>+{primaryIncoming} {primaryConfig.shortLabel}</strong> restores{' '}
                  <strong>+{primaryFillAmount} {primaryConfig.shortLabel}</strong> to fill your base pool to capacity (
                  <strong>{primaryMax}/{primaryMax}</strong>), while the remaining{' '}
                  <strong>+{primaryExcess} {primaryConfig.shortLabel}</strong> increases your Temporary reserve from{' '}
                  <strong>+{primaryTemp}</strong> to <strong>+{primaryProjectedTemp}</strong>, giving you{' '}
                  <strong>{primaryTotalProjected} total {primaryConfig.shortLabel}</strong>.
                </>
              )
            ) : primaryFillAmount === 0 ? (
              <>
                Your <strong>{primaryConfig.label}</strong> is already at maximum capacity (
                <strong>
                  {primaryCurrent}/{primaryMax}
                </strong>
                ). The entire incoming{' '}
                <strong>
                  +{primaryIncoming} {primaryConfig.shortLabel}
                </strong>{' '}
                exceeds your limit and can be channeled into temporary reserve (
                <strong>+{primaryExcess} Temporary {primaryConfig.shortLabel}</strong>, {primaryTotalProjected} total).
              </>
            ) : (
              <>
                Incoming{' '}
                <strong>
                  +{primaryIncoming} {primaryConfig.shortLabel}
                </strong>{' '}
                will restore{' '}
                <strong>
                  +{primaryFillAmount} {primaryConfig.shortLabel}
                </strong>{' '}
                to reach full capacity (
                <strong>
                  {primaryMax}/{primaryMax}
                </strong>
                ), while the remaining{' '}
                <strong>
                  +{primaryExcess} {primaryConfig.shortLabel}
                </strong>{' '}
                can be channeled into temporary reserve ({primaryTotalProjected} total {primaryConfig.shortLabel}).
              </>
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
                {primaryTemp > 0
                  ? `Add Temporary (+${primaryExcess} ${primaryConfig.shortLabel} → ${primaryProjectedTemp} Temp Total)`
                  : `Add Temporary (+${primaryExcess} ${primaryConfig.shortLabel})`}
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
