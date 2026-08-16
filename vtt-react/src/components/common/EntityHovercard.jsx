import React, { useEffect, useState, useRef } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useCustomLineageStore from '../../store/customLineageStore';
import './RichLoreText.css';

import useFamilyTreeStore from '../../store/familyTreeStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';

const EntityHovercard = ({ entityName, position, onClose, onAction, onMouseEnter, onMouseLeave }) => {
  const [entityData, setEntityData] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!entityName) return;

    const cleanName = entityName.trim();
    const lowerName = cleanName.toLowerCase();

    // 1. Check Family Tree & Dynasties
    const { trees } = useFamilyTreeStore.getState();
    const matchingTree = trees.find(t =>
      t.name.toLowerCase().includes(lowerName.replace(/^(bloodline:|dynasty:|tree:)\s*/i, '')) ||
      lowerName.replace(/^(bloodline:|dynasty:|tree:)\s*/i, '').includes(t.name.toLowerCase()) ||
      t.nodes.some(n => n.name.toLowerCase() === lowerName)
    );

    if (matchingTree) {
      const matchingNode = matchingTree.nodes.find(n => n.name.toLowerCase() === lowerName);
      setEntityData({
        name: matchingNode ? matchingNode.name : matchingTree.name,
        type: 'dynasty',
        subtitle: matchingNode ? (matchingNode.title || 'Dynasty Member') : `${matchingTree.nodes.length} Dynastic Members`,
        icon: 'fa-sitemap',
        summary: matchingNode ? (matchingNode.notes || `${matchingNode.name} of ${matchingTree.name}`) : (matchingTree.description || 'Ancient ruling dynasty and bloodlines.'),
        treeId: matchingTree.id,
        nodeId: matchingNode?.id || null
      });
      return;
    }

    // 2. Check Interactive Maps & Pins
    const { maps, pins } = useInteractiveMapStore.getState();
    const cleanMapQuery = lowerName.replace(/^(map:|pin:|location:)\s*/i, '');
    const matchingPin = pins.find(p => p.title.toLowerCase().includes(cleanMapQuery) || cleanMapQuery.includes(p.title.toLowerCase()));
    const matchingMap = maps.find(m => m.name.toLowerCase().includes(cleanMapQuery) || cleanMapQuery.includes(m.name.toLowerCase()));

    if (matchingPin || matchingMap) {
      setEntityData({
        name: matchingPin ? matchingPin.title : matchingMap.name,
        type: 'interactive_map',
        subtitle: matchingPin ? `${matchingPin.type?.toUpperCase()} Marker` : `${matchingMap.type?.toUpperCase()} Map`,
        icon: matchingPin ? (matchingPin.icon || 'fa-location-dot') : 'fa-map-location-dot',
        summary: matchingPin ? (matchingPin.description || 'Marked location on the interactive atlas.') : (matchingMap.description || 'Interactive multi-tier realm map.'),
        mapId: matchingPin?.mapId || matchingMap?.id,
        pinId: matchingPin?.id || null
      });
      return;
    }

    const searchResults = useWorldStore.getState().searchEntities(cleanName);
    
    if (searchResults && searchResults.length > 0) {
      const match = searchResults[0];
      
      // Enrich based on entity type
      if (match.type === 'location' && match.locationId) {
        const full = useWorldStore.getState().getLocation(match.locationId);
        setEntityData({
          ...match,
          ...full,
          summary: full?.description || full?.overview || 'A prominent location in the realm.',
          sensory: full?.sensoryProfile || null
        });
      } else if (match.type === 'faction' && match.factionId) {
        const faction = useFactionStore.getState().getFaction(match.factionId);
        setEntityData({
          ...match,
          ...faction,
          summary: faction?.publicGoal || faction?.description || 'An influential order or house.',
          secret: faction?.secretGoal || null
        });
      } else if (match.type === 'lineage' && match.lineageId) {
        const lineage = useWorldStore.getState().getLineage(match.lineageId);
        setEntityData({
          ...match,
          ...lineage,
          summary: lineage?.cardFlavor || lineage?.description?.slice(0, 180) + '...'
        });
      } else if (match.type === 'region' && match.regionId) {
        const region = useWorldStore.getState().getRegion(match.regionId);
        setEntityData({
          ...match,
          ...region,
          summary: region?.loreOverview || region?.description || 'A major continental territory.'
        });
      } else {
        setEntityData({
          ...match,
          summary: `Reference to ${match.name}.`
        });
      }
    } else {
      setEntityData({
        name: cleanName,
        type: 'lore',
        subtitle: 'World Reference',
        icon: 'fa-book-sparkles',
        summary: `Custom lore reference to "${cleanName}".`
      });
    }
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
        
        {entityData.sensory && (
          <div className="entity-hovercard-sensory">
            {entityData.sensory.sight && <div className="sensory-item"><i className="fas fa-eye"></i> <span>{entityData.sensory.sight}</span></div>}
            {entityData.sensory.sound && <div className="sensory-item"><i className="fas fa-volume-high"></i> <span>{entityData.sensory.sound}</span></div>}
            {entityData.sensory.smell && <div className="sensory-item"><i className="fas fa-wind"></i> <span>{entityData.sensory.smell}</span></div>}
            {entityData.sensory.feel && <div className="sensory-item"><i className="fas fa-temperature-low"></i> <span>{entityData.sensory.feel}</span></div>}
            {entityData.sensory.taste && <div className="sensory-item"><i className="fas fa-utensils"></i> <span>{entityData.sensory.taste}</span></div>}
          </div>
        )}

        {entityData.meaningfulTradeoffs && (
          <div className="entity-hovercard-tradeoff">
            <i className="fas fa-triangle-exclamation"></i>
            <span>{entityData.meaningfulTradeoffs}</span>
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

        {entityData.type === 'interactive_map' && (
          <button
            className="entity-hovercard-btn map-btn"
            style={{ background: 'linear-gradient(135deg, #2980b9 0%, #1a5276 100%)', color: '#ffffff', borderColor: '#154360' }}
            onClick={() => {
              useInteractiveMapStore.getState().openStudio(entityData.mapId, entityData.pinId);
              if (onClose) onClose();
            }}
            title="Open in Interactive Map Maker"
          >
            <i className="fas fa-map-location-dot"></i> Open Interactive Map ↗
          </button>
        )}

        {(entityData.type === 'location' || entityData.type === 'region') && (
          <button className="entity-hovercard-btn map-btn" onClick={handleFlyToMap} title="Fly to on World Map">
            <i className="fas fa-map-location-dot"></i> Fly to Map
          </button>
        )}
        <button className="entity-hovercard-btn dossier-btn" onClick={handleOpenDossier} title="View in World Dashboard">
          <i className="fas fa-book-open"></i> Dossier
        </button>
      </div>
    </div>
  );
};

export default EntityHovercard;
