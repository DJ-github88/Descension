import React, { useRef, useEffect, useCallback } from 'react';
import { Context as TransformContext } from 'react-zoom-pan-pinch';
import './LocationWaypointPopup.css';

/**
 * Calm TTRPG Expedition Waypoint Popup / Camp Docket
 * Renders an illuminated parchment chronicle docket anchored to a journey waypoint node.
 * Dynamically counter-scales with map zoom to preserve a comfortable, readable size.
 */
const LocationWaypointPopup = ({
  waypoint,
  waypointIndex = 0,
  isGM,
  onClose,
  onInspect,
  onDelete,
  isTopFlipped = false,
  zoomScale = 1.0
}) => {
  const popupRef = useRef(null);
  const transformCtx = React.useContext(TransformContext);

  const updatePopupScale = useCallback((scale) => {
    if (!popupRef.current) return;
    const currentScale = scale || 1.0;
    const counterScale = currentScale > 0 ? (1 / Math.max(0.65, currentScale)) : 1.0;
    popupRef.current.style.setProperty('--popup-scale', counterScale.toFixed(4));
  }, []);

  useEffect(() => {
    const initialScale = transformCtx?.state?.scale || zoomScale || 1.0;
    updatePopupScale(initialScale);

    if (transformCtx?.onChange) {
      return transformCtx.onChange((ctx) => {
        const s = ctx?.instance?.state?.scale;
        if (s) updatePopupScale(s);
      });
    }
  }, [transformCtx, zoomScale, updatePopupScale]);

  if (!waypoint) return null;

  const dayNumber = waypoint.day || waypointIndex + 1;
  const title = waypoint.title || `Day ${dayNumber} Encampment`;
  const notesExcerpt = waypoint.notes
    ? (waypoint.notes.length > 120 ? `${waypoint.notes.slice(0, 120)}...` : waypoint.notes)
    : null;

  return (
    <div
      ref={popupRef}
      className={`calm-waypoint-popup-docket ${isTopFlipped ? 'flipped-bottom' : 'flipped-top'}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={`${title} encampment docket`}
    >
      <div className="docket-corner top-left" />
      <div className="docket-corner top-right" />
      <div className="docket-corner bottom-left" />
      <div className="docket-corner bottom-right" />

      {/* Header */}
      <div className="calm-waypoint-header">
        <div className="calm-waypoint-identity">
          <div className="calm-waypoint-medallion">
            <span>{dayNumber}</span>
          </div>
          <div className="calm-waypoint-titles">
            <span className="calm-waypoint-type-badge">EXPEDITION WAYPOINT</span>
            <h4 className="calm-waypoint-name">{title}</h4>
          </div>
        </div>

        <button
          type="button"
          className="calm-waypoint-close-btn"
          onClick={onClose}
          title="Dismiss Docket"
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Secret GM Tag */}
      {waypoint.isSecretGM && isGM && (
        <div className="calm-waypoint-status">
          <span className="calm-waypoint-secret-badge">
            <i className="fas fa-eye-slash"></i> Secret Camp (GM Only)
          </span>
        </div>
      )}

      {/* Camp Chronicle Notes */}
      {notesExcerpt ? (
        <div className="calm-waypoint-excerpt">
          <p>{notesExcerpt}</p>
        </div>
      ) : (
        <div className="calm-waypoint-empty-notes">
          <p>No expedition notes recorded for this camp.</p>
        </div>
      )}

      {/* Actions */}
      <div className="calm-waypoint-actions">
        <button
          type="button"
          className="calm-waypoint-action-btn primary"
          onClick={() => onInspect?.(waypoint)}
          title="Open camp chronicle editor"
        >
          <i className="fas fa-pen-nib"></i>
          <span>Chronicle</span>
        </button>

        {isGM && (
          <button
            type="button"
            className="calm-waypoint-action-btn delete"
            onClick={() => onDelete?.(waypoint.id)}
            title="Remove waypoint from journey trail"
          >
            <i className="fas fa-trash-can"></i>
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationWaypointPopup;
