import React, { useState, useMemo } from 'react';
import useTagRegistryStore from '../../store/tagRegistryStore';
import tagRegistryService from '../../services/tagRegistryService';
import './UniversalTagManager.css';

export const UniversalTagManager = ({
  entityType,
  entityId,
  entityName,
  entityObj,
  isOpen,
  onClose,
  onSelectEntity
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedTagForBrowse, setSelectedTagForBrowse] = useState(null);

  const customTags = useTagRegistryStore((state) =>
    state.getCustomTags(entityType, entityId)
  );
  const addTagToEntity = useTagRegistryStore((state) => state.addTagToEntity);
  const removeTagFromEntity = useTagRegistryStore((state) => state.removeTagFromEntity);
  const tagMetadata = useTagRegistryStore((state) => state.tagMetadata);

  // All tags including derived
  const allEntityTags = useMemo(() => {
    return tagRegistryService.getAllTagsForEntity(entityType, entityId, entityObj);
  }, [entityType, entityId, entityObj, customTags]);

  // Tag cloud
  const tagCloud = useMemo(() => {
    return tagRegistryService.getTagCloud();
  }, [customTags]);

  // Entities matching selected browse tag
  const matchingEntities = useMemo(() => {
    if (!selectedTagForBrowse) return [];
    return tagRegistryService.queryByTag(selectedTagForBrowse);
  }, [selectedTagForBrowse]);

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    addTagToEntity(entityType, entityId, newTagInput.trim());
    setNewTagInput('');
  };

  return (
    <div className="tag-manager-overlay" onClick={onClose}>
      <div className="tag-manager-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tag-manager-header">
          <div className="tag-manager-title">
            <i className="fas fa-tags"></i>
            <span>Tag Registry & Cross-References</span>
          </div>
          <button className="tag-manager-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tag-manager-body">
          {entityType && entityId && (
            <div className="tag-section current-entity-section">
              <h4>
                <i className="fas fa-tag"></i> Tags for: <strong>{entityName || entityId}</strong> ({entityType})
              </h4>

              <div className="tag-pill-container">
                {allEntityTags.map((tag) => {
                  const isCustom = customTags.includes(tag);
                  const meta = tagMetadata[tag] || {};
                  return (
                    <span
                      key={tag}
                      className={`tag-pill ${isCustom ? 'custom' : 'derived'}`}
                      style={meta.color ? { borderColor: meta.color } : {}}
                      onClick={() => setSelectedTagForBrowse(tag)}
                    >
                      {meta.icon && <i className={`fas ${meta.icon}`}></i>}
                      #{tag}
                      {isCustom && (
                        <button
                          type="button"
                          className="remove-tag-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTagFromEntity(entityType, entityId, tag);
                          }}
                          title="Remove Tag"
                        >
                          &times;
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>

              <form onSubmit={handleAddTag} className="add-tag-form">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. #rival, #ancient-order)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="add-tag-input"
                />
                <button type="submit" className="add-tag-submit-btn">
                  <i className="fas fa-plus"></i> Add
                </button>
              </form>
            </div>
          )}

          {/* Global Tag Cloud & Cross Reference Explorer */}
          <div className="tag-section tag-cloud-section">
            <h4>
              <i className="fas fa-cloud"></i> Universal Tag Cloud
            </h4>
            <div className="tag-cloud-pills">
              {tagCloud.map(({ tag, count, meta }) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-cloud-item ${selectedTagForBrowse === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTagForBrowse(tag === selectedTagForBrowse ? null : tag)}
                  style={{
                    backgroundColor: selectedTagForBrowse === tag ? (meta.color || '#3b82f6') : 'rgba(255,255,255,0.05)',
                    borderColor: meta.color || '#475569'
                  }}
                >
                  <i className={`fas ${meta.icon || 'fa-tag'}`}></i>
                  <span>#{tag}</span>
                  <span className="tag-count-badge">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cross-Referenced Entities for Selected Tag */}
          {selectedTagForBrowse && (
            <div className="tag-section matching-entities-section">
              <h4>
                <i className="fas fa-network-wired"></i> Entities Tagged with <strong>#{selectedTagForBrowse}</strong> ({matchingEntities.length})
              </h4>
              <div className="matching-entities-grid">
                {matchingEntities.length === 0 ? (
                  <p className="no-entities-text">No other entities share this tag.</p>
                ) : (
                  matchingEntities.map((ent) => (
                    <div
                      key={`${ent.type}:${ent.id}`}
                      className="matching-entity-card"
                      onClick={() => {
                        if (onSelectEntity) onSelectEntity(ent);
                      }}
                    >
                      <div className="entity-card-icon">
                        <i className={`fas ${ent.icon}`}></i>
                      </div>
                      <div className="entity-card-details">
                        <div className="entity-card-name">{ent.name}</div>
                        <div className="entity-card-type">{ent.type}</div>
                        {ent.summary && <div className="entity-card-summary">{ent.summary}</div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalTagManager;
