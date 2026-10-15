import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { Context as TransformContext } from 'react-zoom-pan-pinch';
import useQuestStore from '../../store/questStore';
import useNpcStore from '../../store/npcStore';
import useCreatureStore from '../../store/creatureStore';
import useFactionStore from '../../store/factionStore';
import useInventoryStore from '../../store/inventoryStore';
import './LocationPinPopup.css';

/**
 * Calm TTRPG Location Pin Popup / Docket
 * Renders an illuminated cartographic docket right above or below a landmark pin.
 * Follows the project's calm TTRPG design system (--adventure-* tokens, Cinzel/Crimson Text).
 * Dynamically counter-scales with map zoom to preserve a comfortable, readable reading size.
 */
const LocationPinPopup = ({
  pin,
  isGM,
  onClose,
  onInspect,
  onPlotRoute,
  onEnterSubMap,
  onOpenInCodex,
  onEditPin,
  onToggleSecret,
  isTopFlipped = false,
  zoomScale = 1.0
}) => {
  const popupRef = useRef(null);
  const transformCtx = React.useContext(TransformContext);

  const pinScale = useMemo(() => {
    if (pin?.scale !== undefined) return pin.scale;
    if (pin?.size === 'small') return 0.75;
    if (pin?.size === 'large') return 1.35;
    if (pin?.size === 'epic') return 1.75;
    return 1.0;
  }, [pin?.scale, pin?.size]);

  // Dynamically compute counter-scale so the docket remains comfortably sized on screen
  const updatePopupScale = useCallback((scale) => {
    if (!popupRef.current) return;
    const currentScale = scale || 1.0;
    const effectiveZoom = currentScale * (pinScale || 1.0);
    // Counter-scale when zoomed in (effectiveZoom > 1) so docket never grows overly big,
    // and limit scaling when zoomed out so it remains clearly legible.
    const counterScale = effectiveZoom > 0 ? (1 / Math.max(0.65, effectiveZoom)) : 1.0;
    popupRef.current.style.setProperty('--popup-scale', counterScale.toFixed(4));
  }, [pinScale]);

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
  const quests = useQuestStore((state) => state.quests) || [];
  const npcs = useNpcStore((state) => state.npcs) || [];
  const creatures = useCreatureStore((state) => state.creatures) || [];
  const factions = useFactionStore((state) => state.factions) || [];
  const items = useInventoryStore((state) => state.items) || [];

  const linked = pin?.linkedEntities || {};

  // Resolve linked entity counts and names
  const linkedDetails = useMemo(() => {
    const qList = (linked.questIds || [])
      .map(id => quests.find(q => q.id === id))
      .filter(Boolean);

    const nList = (linked.npcIds || [])
      .map(id => npcs.find(n => n.id === id))
      .filter(Boolean);

    const cList = (linked.creatureIds || [])
      .map(id => creatures.find(c => c.id === id || c.name === id))
      .filter(Boolean);

    const fList = (linked.factionIds || [])
      .map(id => factions.find(f => f.id === id))
      .filter(Boolean);

    const iList = (linked.itemIds || [])
      .map(id => items.find(i => i.id === id || i.name === id))
      .filter(Boolean);

    return {
      quests: qList,
      npcs: nList,
      creatures: cList,
      factions: fList,
      items: iList,
      hasEntities: (qList.length + nList.length + cList.length + fList.length + iList.length) > 0 || Boolean(linked.locationId)
    };
  }, [linked, quests, npcs, creatures, factions, items]);

  if (!pin) return null;

  const pinTypeLabel = (pin.type || 'poi').replace(/_/g, ' ').toUpperCase();
  const hasSubMap = Boolean(pin.targetMapId);
  const excerpt = pin.description
    ? (pin.description.length > 140 ? `${pin.description.slice(0, 140)}...` : pin.description)
    : null;

  return (
    <div
      ref={popupRef}
      className={`calm-pin-popup-docket ${isTopFlipped ? 'flipped-bottom' : 'flipped-top'}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={`${pin.title} landmark docket`}
    >
      {/* Decorative parchment corner brackets */}
      <div className="docket-corner top-left" />
      <div className="docket-corner top-right" />
      <div className="docket-corner bottom-left" />
      <div className="docket-corner bottom-right" />

      {/* Header bar */}
      <div className="calm-pin-popup-header">
        <div className="calm-pin-identity">
          <div
            className="calm-pin-mini-crest"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${pin.color || '#9b835e'} 0%, #302419 100%)`,
              borderColor: pin.color || 'var(--adventure-brass, #c4ab79)'
            }}
          >
            <i className={`fas ${pin.icon || 'fa-location-dot'}`}></i>
          </div>
          <div className="calm-pin-titles">
            <span className="calm-pin-type-badge">{pinTypeLabel}</span>
            <h4 className="calm-pin-name">{pin.title}</h4>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className="calm-pin-popup-close-btn"
          onClick={onClose}
          title="Dismiss Docket"
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Badges strip (Secret GM & Connected Realm) */}
      <div className="calm-pin-status-strip">
        {pin.isSecretGM && isGM && (
          <span className="calm-pin-badge secret" title="Hidden from Adventurers">
            <i className="fas fa-eye-slash"></i> Secret (GM Only)
          </span>
        )}
        {hasSubMap && (
          <span className="calm-pin-badge submap" title="Connected Sub-Map Available">
            <i className="fas fa-door-open"></i> Sub-Map Link
          </span>
        )}
      </div>

      {/* Lore excerpt if present */}
      {excerpt && (
        <div className="calm-pin-popup-excerpt">
          <p>{excerpt}</p>
        </div>
      )}

      {/* Linked Entity Summary Chips */}
      {linkedDetails.hasEntities && (
        <div className="calm-pin-entity-pills">
          {linkedDetails.quests.length > 0 && (
            <span className="calm-entity-pill quest" title={linkedDetails.quests.map(q => q.title).join(', ')}>
              <i className="fas fa-scroll"></i>
              <span>{linkedDetails.quests.length} {linkedDetails.quests.length === 1 ? 'Quest' : 'Quests'}</span>
            </span>
          )}
          {linkedDetails.npcs.length > 0 && (
            <span className="calm-entity-pill npc" title={linkedDetails.npcs.map(n => n.name).join(', ')}>
              <i className="fas fa-user-shield"></i>
              <span>{linkedDetails.npcs.length} {linkedDetails.npcs.length === 1 ? 'NPC' : 'NPCs'}</span>
            </span>
          )}
          {linkedDetails.creatures.length > 0 && (
            <span className="calm-entity-pill creature" title={linkedDetails.creatures.map(c => c.name).join(', ')}>
              <i className="fas fa-skull-crossbones"></i>
              <span>{linkedDetails.creatures.length} {linkedDetails.creatures.length === 1 ? 'Threat' : 'Threats'}</span>
            </span>
          )}
          {linkedDetails.items.length > 0 && (
            <span className="calm-entity-pill item" title={linkedDetails.items.map(i => i.name).join(', ')}>
              <i className="fas fa-gem"></i>
              <span>{linkedDetails.items.length} {linkedDetails.items.length === 1 ? 'Relic' : 'Relics'}</span>
            </span>
          )}
          {linkedDetails.factions.length > 0 && (
            <span className="calm-entity-pill faction" title={linkedDetails.factions.map(f => f.name).join(', ')}>
              <i className="fas fa-shield-halved"></i>
              <span>{linkedDetails.factions[0].name}</span>
            </span>
          )}
        </div>
      )}

      {/* Actions Footer */}
      <div className="calm-pin-popup-actions">
        {/* Inspect Full Dossier */}
        <button
          type="button"
          className="calm-pin-action-btn primary"
          onClick={() => onInspect?.(pin)}
          title="Open complete field dossier folio"
        >
          <i className="fas fa-book-open"></i>
          <span>Dossier</span>
        </button>

        {/* Plot Route / Journey Waypoint */}
        <button
          type="button"
          className="calm-pin-action-btn route"
          onClick={() => onPlotRoute?.(pin)}
          title="Add expedition waypoint connecting party to this landmark"
        >
          <i className="fas fa-route"></i>
          <span>Plot Route</span>
        </button>

        {/* Enter Sub-Map if available */}
        {hasSubMap && (
          <button
            type="button"
            className="calm-pin-action-btn submap"
            onClick={() => onEnterSubMap?.(pin.targetMapId)}
            title="Transition into this location's sub-map"
          >
            <i className="fas fa-door-open"></i>
            <span>Enter</span>
          </button>
        )}

        {/* Open in Campaign Codex */}
        <button
          type="button"
          className="calm-pin-action-btn codex"
          onClick={() => onOpenInCodex?.(pin)}
          title="Browse this location in the Campaign Codex Drawer"
        >
          <i className="fas fa-book-atlas"></i>
          <span>Codex</span>
        </button>

        {/* GM Controls */}
        {isGM && (
          <div className="calm-pin-gm-actions">
            <button
              type="button"
              className={`calm-pin-action-btn gm-tool ${pin.isSecretGM ? 'is-secret' : ''}`}
              onClick={() => onToggleSecret?.(pin.id)}
              title={pin.isSecretGM ? "Reveal to players" : "Hide from players"}
            >
              <i className={`fas ${pin.isSecretGM ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            <button
              type="button"
              className="calm-pin-action-btn gm-tool"
              onClick={() => onEditPin?.(pin)}
              title="Edit landmark metadata and links"
            >
              <i className="fas fa-feather-pointed"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPinPopup;
