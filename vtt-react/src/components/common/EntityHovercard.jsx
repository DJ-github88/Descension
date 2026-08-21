import React, { useEffect, useState, useRef } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useCustomLineageStore from '../../store/customLineageStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import universalEntityService from '../../services/universalEntityService';
import './RichLoreText.css';

const EntityHovercard = ({ entityName, position, onClose, onAction, onMouseEnter, onMouseLeave }) => {
  const [entityData, setEntityData] = useState(null);
  const [backlinks, setBacklinks] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!entityName) return;

    const cleanName = entityName.trim();
    const resolved = universalEntityService.getEntity(cleanName);
    const foundBacklinks = universalEntityService.getBacklinks(cleanName);
    setBacklinks(foundBacklinks.slice(0, 3));

    if (resolved) {
      setEntityData({
        ...resolved,
        name: resolved.title || cleanName,
        type: resolved.type || 'lore',
        subtitle: resolved.subtitle || resolved.category,
        icon: resolved.icon || 'fa-scroll',
        summary: resolved.summary || 'Entity reference in campaign lore.',
        isPhantom: false
      });
      return;
    }

    setEntityData({
      name: cleanName,
      type: 'phantom',
      subtitle: 'Undefined Entity (Click to Create)',
      icon: 'fa-feather-pointed',
      summary: `"${cleanName}" has not yet been drafted. Click below to create a Note or World Dossier for it.`,
      isPhantom: true
    });
  }, [entityName]);

  if (!entityData) return null;

  // Calculate card position on screen with smart non-overlapping placement
  const cardWidth = 320;
  const estimatedCardHeight = 220;
  
  const anchorBottom = position?.bottom ?? (position?.y ?? 100);
  const anchorTop = position?.top ?? (position?.y ? position.y - 20 : 80);
  const anchorLeft = position?.left ?? (position?.x ?? 100);

  let top = anchorBottom + 6;
  // If placing below would overflow the window bottom, place above the link instead
  if (top + estimatedCardHeight > window.innerHeight - 14) {
    top = Math.max(12, anchorTop - estimatedCardHeight - 6);
  }
  
  let left = Math.max(12, Math.min(window.innerWidth - cardWidth - 16, anchorLeft - 20));

  const style = {
    top: `${top}px`,
    left: `${left}px`
  };

  const handleFlyToMap = () => {
    if (onAction) {
      onAction('fly_to_map', entityData);
    }
    // Also dispatch a custom event for global window listeners
    window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: entityData }));
    if (onClose) onClose();
  };

  const handleOpenDossier = () => {
    if (onAction) {
      onAction('open_dossier', entityData);
    }
    window.dispatchEvent(new CustomEvent('mythrill_open_world_dossier', { detail: entityData }));
    if (onClose) onClose();
  };

  return (
    <div 
      ref={cardRef} 
      className="entity-hovercard-portal" 
      style={style}
      onMouseEnter={(e) => {
        e.stopPropagation();
        if (onMouseEnter) onMouseEnter();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        if (onMouseLeave) onMouseLeave();
      }}
    >
      <div className="entity-hovercard-header">
        <div className="entity-hovercard-icon">
          <i className={`fas ${entityData.icon || 'fa-scroll'}`}></i>
        </div>
        <div className="entity-hovercard-title-group">
          <span className="entity-hovercard-type-badge">{entityData.type || 'Entity'}</span>
          <h4 className="entity-hovercard-name">{entityData.name}</h4>
          <span className="entity-hovercard-subtitle">{entityData.subtitle || entityData.essence || ''}</span>
        </div>
      </div>

      <div className="entity-hovercard-body">
        <p className="entity-hovercard-summary">{entityData.summary}</p>
        
        {entityData.secret && (
          <div className="entity-hovercard-secret" style={{ background: 'rgba(231, 76, 60, 0.1)', borderLeft: '3px solid #e74c3c', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', marginTop: '6px', color: '#f1948a' }}>
            <i className="fas fa-lock" style={{ marginRight: '5px' }}></i>
            <strong>GM Secret:</strong> {entityData.secret}
          </div>
        )}

        {entityData.sensory && (
          <div className="entity-hovercard-sensory">
            {entityData.sensory.sight && <div className="sensory-item"><i className="fas fa-eye"></i> <span>{entityData.sensory.sight}</span></div>}
            {entityData.sensory.sound && <div className="sensory-item"><i className="fas fa-volume-high"></i> <span>{entityData.sensory.sound}</span></div>}
            {entityData.sensory.smell && <div className="sensory-item"><i className="fas fa-wind"></i> <span>{entityData.sensory.smell}</span></div>}
            {entityData.sensory.feel && <div className="sensory-item"><i className="fas fa-temperature-low"></i> <span>{entityData.sensory.feel}</span></div>}
            {entityData.sensory.taste && <div className="sensory-item"><i className="fas fa-utensils"></i> <span>{entityData.sensory.taste}</span></div>}
          </div>
        )}

        {backlinks.length > 0 && (
          <div className="entity-hovercard-backlinks" style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#d4af37', fontWeight: 600, letterSpacing: '0.5px' }}>
              <i className="fas fa-link" style={{ marginRight: '4px' }}></i> Mentioned in ({backlinks.length}):
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px' }}>
              {backlinks.map((b, idx) => (
                <span key={idx} style={{ fontSize: '11px', color: '#bbb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className={`fas ${b.icon}`} style={{ fontSize: '9px', color: '#d4af37' }}></i>
                  <strong>{b.sourceTitle}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="entity-hovercard-actions">
        {entityData.type === 'dynasty' && (
          <button
            className="entity-hovercard-btn tree-btn"
            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05', borderColor: '#8b6508' }}
            onClick={() => {
              useFamilyTreeStore.getState().openStudio(entityData.treeId, entityData.nodeId);
              if (onClose) onClose();
            }}
            title="Explore Dynasty & Family Tree"
          >
            <i className="fas fa-sitemap"></i> Explore Dynasty Tree ↗
          </button>
        )}

        {(entityData.type === 'interactive_map' || entityData.type === 'map' || entityData.type === 'map_pin') && (
          <button
            className="entity-hovercard-btn map-btn"
            style={{ background: 'linear-gradient(135deg, #2980b9 0%, #1a5276 100%)', color: '#ffffff', borderColor: '#154360' }}
            onClick={() => {
              useInteractiveMapStore.getState().openStudio(entityData.mapId, entityData.pinId || entityData.id);
              if (onClose) onClose();
            }}
            title="Open in Interactive Map Maker"
          >
            <i className="fas fa-map-location-dot"></i> Open Map Studio ↗
          </button>
        )}

        {(entityData.type === 'location' || entityData.type === 'region' || entityData.type === 'campaign_location') && (
          <button className="entity-hovercard-btn map-btn" onClick={handleFlyToMap} title="Fly to on World Map">
            <i className="fas fa-map-location-dot"></i> Fly to Map
          </button>
        )}
        {entityData.isPhantom ? (
          <button 
            className="entity-hovercard-btn create-btn" 
            style={{ background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)', color: '#ffffff', borderColor: '#ba4a00' }}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('mythrill_quick_peek', { detail: { name: entityData.name, isPhantom: true } }));
              if (onClose) onClose();
            }}
            title="Create Note or World Dossier for this entity"
          >
            <i className="fas fa-plus-circle"></i> Create Entity ↗
          </button>
        ) : (
          <button className="entity-hovercard-btn dossier-btn" onClick={handleOpenDossier} title="View in World Dashboard">
            <i className="fas fa-book-open"></i> Dossier
          </button>
        )}
      </div>
    </div>
  );
};

export default EntityHovercard;
