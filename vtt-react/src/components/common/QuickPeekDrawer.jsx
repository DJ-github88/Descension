import React, { useState, useEffect } from 'react';
import universalEntityService from '../../services/universalEntityService';
import useShareableStore from '../../store/shareableStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import RichLoreText from './RichLoreText';
import './QuickPeekDrawer.css';

const ARCHETYPE_ICONS = {
  note: { icon: 'fa-sticky-note', color: '#3498db', label: 'Journal Note' },
  npc: { icon: 'fa-user-ninja', color: '#e74c3c', label: 'NPC Character' },
  location: { icon: 'fa-landmark', color: '#2ecc71', label: 'World Location' },
  faction: { icon: 'fa-shield-halved', color: '#e67e22', label: 'Faction & Order' },
  item: { icon: 'fa-gem', color: '#9b59b6', label: 'Item & Relic' },
  quest: { icon: 'fa-scroll', color: '#f39c12', label: 'Quest & Arc' },
  lore: { icon: 'fa-book-bookmark', color: '#d4af37', label: 'Canonical Lore' }
};

export const QuickPeekDrawer = ({ isOpen: controlledIsOpen, entity: controlledEntity, onClose: controlledOnClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'backlinks' | 'refactor'
  
  // Note editing inside drawer
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editArchetype, setEditArchetype] = useState('note');

  // Refactor title state
  const [newTitle, setNewTitle] = useState('');
  const [refactorSuccessMsg, setRefactorSuccessMsg] = useState('');

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const entityData = controlledEntity || currentEntity;

  // Global listener for mythrill_quick_peek
  useEffect(() => {
    const handleQuickPeek = (e) => {
      if (e.detail) {
        const detail = e.detail;
        const name = detail.name || detail.title;
        const resolved = universalEntityService.getEntity(name) || detail;
        
        setCurrentEntity(resolved);
        setEditContent(resolved.raw?.content || resolved.content || '');
        setEditArchetype(resolved.raw?.archetype || resolved.archetype || 'note');
        setNewTitle(resolved.title || resolved.name || '');
        setIsEditing(false);
        setActiveTab('overview');
        setRefactorSuccessMsg('');
        setInternalIsOpen(true);
      }
    };

    window.addEventListener('mythrill_quick_peek', handleQuickPeek);
    return () => window.removeEventListener('mythrill_quick_peek', handleQuickPeek);
  }, []);

  if (!isOpen || !entityData) return null;

  const entityTitle = entityData.title || entityData.name || 'Untitled Entity';
  const entityType = entityData.archetype || entityData.type || 'note';
  const isPhantom = entityData.isPhantom || (!entityData.id && !universalEntityService.hasEntity(entityTitle));
  const archetypeConfig = ARCHETYPE_ICONS[entityType] || ARCHETYPE_ICONS.note;

  // Compute backlinks and unlinked mentions
  const backlinks = universalEntityService.getBacklinks(entityTitle);
  const directLinks = backlinks.directLinks || backlinks || [];
  const unlinkedMentions = backlinks.unlinkedMentions || [];

  const handleClose = () => {
    if (controlledOnClose) controlledOnClose();
    setInternalIsOpen(false);
  };

  const handleCreatePhantomNote = (archetype = 'note') => {
    const addNote = useShareableStore.getState().addNote;
    const newNoteId = addNote(entityTitle, `Draft notes for ${entityTitle}.`, { archetype });
    
    const freshEntity = universalEntityService.getEntity(entityTitle);
    if (freshEntity) {
      setCurrentEntity(freshEntity);
      setEditContent(freshEntity.raw?.content || '');
      setEditArchetype(archetype);
    }
  };

  const handleSaveNoteEdits = () => {
    if (!entityData.raw?.id) return;
    useShareableStore.getState().updateNote(entityData.raw.id, {
      content: editContent,
      archetype: editArchetype
    });
    setIsEditing(false);
    
    // Refresh entity
    const freshEntity = universalEntityService.getEntity(entityTitle);
    if (freshEntity) setCurrentEntity(freshEntity);
  };

  const handleLinkifyMention = (noteId) => {
    const convertedCount = useShareableStore.getState().convertUnlinkedMentions(noteId, entityTitle);
    if (convertedCount > 0) {
      // Force trigger state update
      setCurrentEntity({ ...entityData });
    }
  };

  const handleExecuteRefactor = () => {
    if (!newTitle.trim() || newTitle.trim() === entityTitle) return;
    const count = useShareableStore.getState().renameEntityRefactor(entityTitle, newTitle.trim());
    
    // Update the note's own title if it's a playerNote
    if (entityData.raw?.id) {
      useShareableStore.getState().updateNote(entityData.raw.id, { title: newTitle.trim() });
    }
    
    setRefactorSuccessMsg(`Successfully updated ${count} reference${count === 1 ? '' : 's'} to "[[${newTitle.trim()}]]"!`);
    setTimeout(() => {
      const refreshed = universalEntityService.getEntity(newTitle.trim());
      if (refreshed) setCurrentEntity(refreshed);
    }, 400);
  };

  return (
    <div className="quick-peek-overlay" onClick={handleClose}>
      <div className="quick-peek-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="quick-peek-header">
          <div className="quick-peek-title-group">
            <div className="quick-peek-icon-badge" style={{ color: archetypeConfig.color }}>
              <i className={`fas ${archetypeConfig.icon}`}></i>
            </div>
            <div>
              <div className="quick-peek-badge-row">
                <span className="quick-peek-type-pill" style={{ color: archetypeConfig.color, borderColor: archetypeConfig.color }}>
                  {isPhantom ? 'Uncreated Draft' : archetypeConfig.label}
                </span>
                {entityData.aliases && entityData.aliases.length > 0 && (
                  <span className="quick-peek-alias-tag">
                    aka {entityData.aliases.join(', ')}
                  </span>
                )}
              </div>
              <h3 className="quick-peek-name">{entityTitle}</h3>
            </div>
          </div>

          <button className="quick-peek-close-btn" onClick={handleClose} title="Close drawer">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Drawer Nav Tabs */}
        <div className="quick-peek-tabs">
          <button 
            className={`quick-peek-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-file-lines"></i> Overview
          </button>
          <button 
            className={`quick-peek-tab ${activeTab === 'backlinks' ? 'active' : ''}`}
            onClick={() => setActiveTab('backlinks')}
          >
            <i className="fas fa-link"></i> References ({directLinks.length + unlinkedMentions.length})
          </button>
          {entityData.type === 'note' && (
            <button 
              className={`quick-peek-tab ${activeTab === 'refactor' ? 'active' : ''}`}
              onClick={() => setActiveTab('refactor')}
            >
              <i className="fas fa-wand-magic-sparkles"></i> Refactor
            </button>
          )}
        </div>

        {/* Drawer Body */}
        <div className="quick-peek-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="quick-peek-overview-tab">
              {isPhantom ? (
                <div className="quick-peek-phantom-card">
                  <i className="fas fa-feather-pointed phantom-hero-icon"></i>
                  <h4>"{entityTitle}" is not defined yet</h4>
                  <p>Create a first-class Note or World Dossier for this entity to track lore, statblocks, and connections.</p>
                  
                  <div className="quick-peek-create-archetypes">
                    {Object.entries(ARCHETYPE_ICONS).map(([key, cfg]) => (
                      <button
                        key={key}
                        className="quick-peek-create-arch-btn"
                        onClick={() => handleCreatePhantomNote(key)}
                      >
                        <i className={`fas ${cfg.icon}`} style={{ color: cfg.color }}></i>
                        <span>Draft {cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Note Editing Controls */}
                  {entityData.type === 'note' && (
                    <div className="quick-peek-edit-bar">
                      <div className="quick-peek-arch-selector">
                        <label>Archetype:</label>
                        <select 
                          value={editArchetype} 
                          onChange={(e) => {
                            setEditArchetype(e.target.value);
                            if (!isEditing) {
                              useShareableStore.getState().updateNote(entityData.raw.id, { archetype: e.target.value });
                            }
                          }}
                        >
                          <option value="note">Journal Note</option>
                          <option value="npc">Custom NPC</option>
                          <option value="location">Custom Location</option>
                          <option value="faction">Custom Faction</option>
                          <option value="item">Custom Item / Relic</option>
                          <option value="quest">Custom Quest</option>
                          <option value="lore">Custom Lore</option>
                        </select>
                      </div>

                      <button 
                        className={`quick-peek-btn ${isEditing ? 'active' : ''}`}
                        onClick={() => {
                          if (isEditing) handleSaveNoteEdits();
                          else setIsEditing(true);
                        }}
                      >
                        <i className={`fas ${isEditing ? 'fa-save' : 'fa-pen'}`}></i>
                        {isEditing ? 'Save Markdown' : 'Edit'}
                      </button>
                    </div>
                  )}

                  {/* Content View / Edit */}
                  {isEditing ? (
                    <textarea
                      className="quick-peek-editor"
                      rows={12}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Write entity lore, markdown, or [[links]] here..."
                    />
                  ) : (
                    <div className="quick-peek-rendered-content">
                      <RichLoreText text={entityData.raw?.content || entityData.content || entityData.summary || '*No written lore available.*'} />
                    </div>
                  )}

                  {/* GM Secret Block if present */}
                  {entityData.secret && (
                    <div className="quick-peek-secret-box">
                      <i className="fas fa-lock"></i>
                      <div>
                        <strong>GM Secret:</strong>
                        <p>{entityData.secret}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Shortcuts */}
                  <div className="quick-peek-actions-row">
                    {entityData.type === 'map_pin' && (
                      <button 
                        className="quick-peek-action-btn"
                        onClick={() => useInteractiveMapStore.getState().openStudio(entityData.mapId, entityData.id)}
                      >
                        <i className="fas fa-map-location-dot"></i> View on Atlas Map
                      </button>
                    )}
                    {entityData.type === 'dynasty' && (
                      <button 
                        className="quick-peek-action-btn"
                        onClick={() => useFamilyTreeStore.getState().openStudio(entityData.id)}
                      >
                        <i className="fas fa-sitemap"></i> Explore Dynasty Tree
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: BACKLINKS & UNLINKED MENTIONS */}
          {activeTab === 'backlinks' && (
            <div className="quick-peek-backlinks-tab">
              {/* Direct Links */}
              <div className="quick-peek-section-title">
                <i className="fas fa-link" style={{ color: '#d4af37' }}></i>
                Direct Wiki-Links ({directLinks.length})
              </div>
              {directLinks.length === 0 ? (
                <div className="quick-peek-empty-state">No other documents explicitly link to [[{entityTitle}]] yet.</div>
              ) : (
                <div className="quick-peek-backlinks-list">
                  {directLinks.map((link, idx) => (
                    <div 
                      key={idx} 
                      className="quick-peek-backlink-card"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('mythrill_quick_peek', { detail: link.raw || link }));
                      }}
                    >
                      <div className="backlink-card-header">
                        <i className={`fas ${link.icon || 'fa-sticky-note'}`}></i>
                        <strong>{link.sourceTitle}</strong>
                        <span className="backlink-type-tag">{link.sourceType}</span>
                      </div>
                      <div className="backlink-card-snippet">{link.snippet}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Unlinked Mentions */}
              <div className="quick-peek-section-title" style={{ marginTop: '18px' }}>
                <i className="fas fa-magnifying-glass" style={{ color: '#3498db' }}></i>
                Unlinked Mentions ({unlinkedMentions.length})
              </div>
              {unlinkedMentions.length === 0 ? (
                <div className="quick-peek-empty-state">No unlinked text mentions found in notes.</div>
              ) : (
                <div className="quick-peek-backlinks-list">
                  {unlinkedMentions.map((mention, idx) => (
                    <div key={idx} className="quick-peek-backlink-card unlinked">
                      <div className="backlink-card-header">
                        <i className={`fas ${mention.icon || 'fa-sticky-note'}`}></i>
                        <strong>{mention.sourceTitle}</strong>
                        <button 
                          className="quick-peek-linkify-btn"
                          onClick={() => handleLinkifyMention(mention.id)}
                          title={`Convert "${entityTitle}" into [[${entityTitle}]] in ${mention.sourceTitle}`}
                        >
                          <i className="fas fa-bolt"></i> Linkify
                        </button>
                      </div>
                      <div className="backlink-card-snippet">{mention.snippet}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REFACTOR & RENAME */}
          {activeTab === 'refactor' && (
            <div className="quick-peek-refactor-tab">
              <div className="quick-peek-section-title">
                <i className="fas fa-wand-magic-sparkles" style={{ color: '#9b59b6' }}></i>
                Global Entity Rename & Refactoring
              </div>
              <p style={{ fontSize: '12px', color: '#bbb', margin: '8px 0 14px 0' }}>
                Renaming this entity will automatically update all <code>[[{entityTitle}]]</code> links across your notes without breaking your story bible or world lore.
              </p>

              <div className="quick-peek-refactor-input-row">
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="New entity name..."
                />
                <button 
                  className="quick-peek-refactor-btn"
                  onClick={handleExecuteRefactor}
                  disabled={!newTitle.trim() || newTitle.trim() === entityTitle}
                >
                  <i className="fas fa-check"></i> Refactor Links
                </button>
              </div>

              {refactorSuccessMsg && (
                <div className="quick-peek-success-msg">
                  <i className="fas fa-circle-check"></i> {refactorSuccessMsg}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickPeekDrawer;
