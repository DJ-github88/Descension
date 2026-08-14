import React, { useEffect, useState, useRef } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useCustomLineageStore from '../../store/customLineageStore';
import './RichLoreText.css';

const EntityHovercard = ({ entityName, position, onClose, onAction }) => {
  const [entityData, setEntityData] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!entityName) return;

    const cleanName = entityName.trim();
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

  // Calculate card position on screen
  const style = {
    top: Math.min(window.innerHeight - 280, Math.max(10, (position?.y || 100) + 12)),
    left: Math.min(window.innerWidth - 340, Math.max(10, (position?.x || 100) - 40))
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
      onMouseEnter={(e) => e.stopPropagation()}
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
            <div className="sensory-item"><i className="fas fa-eye"></i> <span>{entityData.sensory.sight || entityData.sensory.visuals}</span></div>
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
