import { uploadAsset } from '../../services/firebase/uploadService';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useFamilyTreeStore from '../../store/familyTreeStore';
import useAuthStore from '../../store/authStore';
import useCustomLineageStore from '../../store/customLineageStore';
import campaignService from '../../services/campaignService';
import { showConfirm } from '../../utils/dialogService';
import RichCampaignEditor from '../common/RichCampaignEditor';
import './FamilyTreeStudio.css';

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male', icon: 'fa-mars' },
  { id: 'female', label: 'Female', icon: 'fa-venus' },
  { id: 'other', label: 'Non-Binary / Other', icon: 'fa-genderless' }
];

const RELATION_TYPES = [
  { id: 'biological', label: 'Biological Child', desc: 'Natural-born blood descendant', icon: 'fa-dna' },
  { id: 'adoptive', label: 'Adopted Child', desc: 'Legally or formally adopted descendant', icon: 'fa-heart' },
  { id: 'illegitimate', label: 'Illegitimate / Natural Child', desc: 'Born out of wedlock / unofficial heir', icon: 'fa-shield-halved' },
  { id: 'clone', label: 'Magical Clone / Created', desc: 'Created through alchemy, magic, or divine forge', icon: 'fa-flask' }
];

const SPOUSE_STATUSES = [
  { id: 'married', label: 'Married (Spouse)', desc: 'Official marriage or primary spouse', icon: 'fa-ring' },
  { id: 'betrothed', label: 'Engaged / Betrothed', desc: 'Arranged marriage, fiancé(e), or promised union', icon: 'fa-gem' },
  { id: 'consort', label: 'Partner / Consort', desc: 'Romantic partner, companion, or unofficial consort', icon: 'fa-feather' },
  { id: 'divorced', label: 'Divorced / Separated', desc: 'Former spouse, separated, or dissolved union', icon: 'fa-link-slash' }
];

const FamilyTreeStudio = () => {
  const { user } = useAuthStore();
  const {
    trees,
    activeTreeId,
    selectedNodeId,
    isStudioOpen,
    searchQuery,
    zoomLevel,
    panOffset,
    closeStudio,
    setActiveTree,
    setSelectedNode,
    setSearchQuery,
    setZoomLevel,
    setPanOffset,
    resetView,
    createTree,
    updateTree,
    deleteTree,
    addMember,
    updateMember,
    updateMemberPosition,
    removeMember,
    addSpouseRelationship,
    addChildRelationship,
    removeRelationship,
    autoLayoutTree,
    syncToCloud,
    hydrateFromCloud
  } = useFamilyTreeStore();

  const { getAllLineages } = useCustomLineageStore();
  const lineages = useMemo(() => getAllLineages(), [getAllLineages]);

  // Active Tree
  const activeTree = useMemo(() => {
    return trees.find(t => t.id === activeTreeId) || trees[0] || null;
  }, [trees, activeTreeId]);

  // Canvas Interaction States
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Modals & Drawers
  const [showMemberDrawer, setShowMemberDrawer] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showCreateTreeModal, setShowCreateTreeModal] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');
  const [newTreeDesc, setNewTreeDesc] = useState('');
  const [showRelModal, setShowRelModal] = useState(null); // { type: 'spouse' | 'child' | 'parent', sourceId }
  const [relMode, setRelMode] = useState('existing'); // 'existing' | 'new'
  const [targetMemberSelect, setTargetMemberSelect] = useState('');
  const [newRelName, setNewRelName] = useState('');
  const [newRelTitle, setNewRelTitle] = useState('');
  const [newRelGender, setNewRelGender] = useState('female');
  const [relCustomStatus, setRelCustomStatus] = useState('married');

  // Hydrate on mount
  useEffect(() => {
    if (user?.uid) {
      hydrateFromCloud(user.uid);
    }
  }, [user?.uid, hydrateFromCloud]);

  // Selected Member Object
  const selectedMember = useMemo(() => {
    if (!activeTree || !selectedNodeId) return null;
    return activeTree.nodes.find(n => n.id === selectedNodeId) || null;
  }, [activeTree, selectedNodeId]);

  // Filtered nodes based on search
  const searchedNodeIds = useMemo(() => {
    if (!activeTree || !searchQuery.trim()) return new Set();
    const q = searchQuery.toLowerCase().trim();
    const matches = activeTree.nodes.filter(
      n =>
        n.name.toLowerCase().includes(q) ||
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.role && n.role.toLowerCase().includes(q))
    );
    return new Set(matches.map(n => n.id));
  }, [activeTree, searchQuery]);

  // Canvas Mouse Down (Panning)
  const handleCanvasMouseDown = (e) => {
    if (e.target.closest('.family-tree-node') || e.target.closest('.studio-floating-toolbar') || e.target.closest('.studio-drawer')) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    setSelectedNode(null);
  };

  // Global Mouse Move (Drag node or Pan canvas)
  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggedNodeId && activeTree) {
      const newX = Math.round((e.clientX - panOffset.x - dragOffset.x) / zoomLevel);
      const newY = Math.round((e.clientY - panOffset.y - dragOffset.y) / zoomLevel);
      updateMemberPosition(activeTree.id, draggedNodeId, { x: newX, y: newY });
    }
  }, [isPanning, panStart, panOffset, draggedNodeId, dragOffset, zoomLevel, activeTree, updateMemberPosition, setPanOffset]);

  // Mouse Up
  const handleMouseUp = useCallback(() => {
    if (isPanning) setIsPanning(false);
    if (draggedNodeId) {
      setDraggedNodeId(null);
      syncToCloud(user?.uid);
    }
  }, [isPanning, draggedNodeId, syncToCloud, user?.uid]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Node Drag Start
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setSelectedNode(node.id);
    setDraggedNodeId(node.id);

    const screenX = node.position.x * zoomLevel + panOffset.x;
    const screenY = node.position.y * zoomLevel + panOffset.y;

    setDragOffset({
      x: e.clientX - screenX,
      y: e.clientY - screenY
    });
  };

  // Zoom Handler
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoomLevel(prev => Math.min(2.5, Math.max(0.35, +(prev * zoomFactor).toFixed(2))));
  };

  // Quick Member Form Submission
  const handleSaveMemberForm = (e) => {
    e.preventDefault();
    if (!editingMember || !activeTree) return;

    if (editingMember.isNew) {
      addMember(activeTree.id, {
        name: editingMember.name,
        title: editingMember.title,
        lifespan: editingMember.lifespan,
        role: editingMember.role,
        portraitUrl: editingMember.portraitUrl,
        gender: editingMember.gender,
        isDeceased: editingMember.isDeceased,
        generationTier: Number(editingMember.generationTier) || 1,
        notes: editingMember.notes,
        lineageId: editingMember.lineageId,
        position: editingMember.position
      });
    } else {
      updateMember(activeTree.id, editingMember.id, {
        name: editingMember.name,
        title: editingMember.title,
        lifespan: editingMember.lifespan,
        role: editingMember.role,
        portraitUrl: editingMember.portraitUrl,
        gender: editingMember.gender,
        isDeceased: editingMember.isDeceased,
        generationTier: Number(editingMember.generationTier) || 1,
        notes: editingMember.notes,
        lineageId: editingMember.lineageId
      });
    }

    setShowMemberDrawer(false);
    setEditingMember(null);
    syncToCloud(user?.uid);
  };

  // Open Edit Member Drawer
  const openMemberEditor = (member = null, defaultTier = 1) => {
    if (member) {
      setEditingMember({ ...member, isNew: false });
    } else {
      setEditingMember({
        isNew: true,
        name: '',
        title: '',
        lifespan: '',
        role: '',
        portraitUrl: '',
        gender: 'male',
        isDeceased: false,
        generationTier: defaultTier,
        notes: '',
        lineageId: lineages[0]?.id || null,
        position: { x: 500, y: (defaultTier - 1) * 220 + 120 }
      });
    }
    setShowMemberDrawer(true);
  };

  // Add Relationship
  const handleConfirmRelationship = (e) => {
    e.preventDefault();
    if (!showRelModal || !activeTree) return;

    const { type, sourceId } = showRelModal;
    const sourceNode = activeTree.nodes.find(n => n.id === sourceId);
    let targetId = targetMemberSelect;

    if (relMode === 'new') {
      if (!newRelName.trim()) return;
      const sourceTier = sourceNode?.generationTier || 1;
      let targetTier = sourceTier;
      let defaultY = sourceNode ? sourceNode.position.y : 200;
      let defaultX = sourceNode ? sourceNode.position.x + 180 : 300;

      if (type === 'child') {
        targetTier = sourceTier + 1;
        defaultY = sourceNode ? sourceNode.position.y + 220 : 350;
      } else if (type === 'parent') {
        targetTier = Math.max(1, sourceTier - 1);
        defaultY = sourceNode ? Math.max(80, sourceNode.position.y - 220) : 100;
      }

      const created = addMember(activeTree.id, {
        name: newRelName.trim(),
        title: newRelTitle.trim(),
        gender: newRelGender,
        generationTier: targetTier,
        position: { x: defaultX, y: defaultY }
      });
      if (!created) return;
      targetId = created.id;
    }

    if (!targetId) return;

    if (type === 'spouse') {
      addSpouseRelationship(activeTree.id, sourceId, targetId, relCustomStatus);
    } else if (type === 'child') {
      const spouseRel = activeTree.relationships.find(
        r => r.type === 'spouse' && (r.sourceId === sourceId || r.targetId === sourceId)
      );
      const parentId2 = spouseRel ? (spouseRel.sourceId === sourceId ? spouseRel.targetId : spouseRel.sourceId) : null;
      addChildRelationship(activeTree.id, sourceId, parentId2, targetId, relCustomStatus);
    } else if (type === 'parent') {
      addChildRelationship(activeTree.id, targetId, null, sourceId, relCustomStatus);
    }

    setShowRelModal(null);
    setTargetMemberSelect('');
    setNewRelName('');
    setNewRelTitle('');
    syncToCloud(user?.uid);
  };

  // Compute Generations
  const maxGenerationTier = useMemo(() => {
    if (!activeTree || activeTree.nodes.length === 0) return 3;
    const maxTier = Math.max(...activeTree.nodes.map(n => n.generationTier || 1));
    return Math.max(3, maxTier + 1);
  }, [activeTree]);

  if (!isStudioOpen) return null;

  return ReactDOM.createPortal(
    <div className="family-tree-studio-overlay">
      {/* Studio Header Toolbar */}
      <header className="family-tree-header">
        <div className="header-primary-row">
          <div className="header-left">
            <button
              type="button"
              className="btn-studio-action btn-back-studio"
              onClick={closeStudio}
              title="Exit Family Tree Studio"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="btn-label">Exit</span>
            </button>
            <div className="header-icon-box" title="Dynasty Lineage Studio">
              <i className="fas fa-sitemap"></i>
            </div>
            <div className="tree-selector-container">
              <select
                className="tree-select"
                value={activeTree?.id || ''}
                onChange={(e) => setActiveTree(e.target.value)}
                disabled={trees.length === 0}
                title={activeTree ? activeTree.name : 'No dynasty selected'}
              >
                {trees.length === 0 ? (
                  <option value="">No Dynasty</option>
                ) : (
                  trees.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.nodes.length} {t.nodes.length === 1 ? 'Member' : 'Members'})
                    </option>
                  ))
                )}
              </select>
              <button
                type="button"
                className="btn-studio-action btn-new-tree"
                onClick={() => {
                  setNewTreeName('');
                  setNewTreeDesc('');
                  setShowCreateTreeModal(true);
                }}
                title="Create a new dynasty family tree"
              >
                <i className="fas fa-plus"></i>
                <span className="btn-label">New Dynasty</span>
              </button>
              {activeTree && (
                <button
                  type="button"
                  className="btn-studio-action btn-delete-tree"
                  onClick={async () => {
                    const confirmed = await showConfirm({
                      title: 'Delete Dynasty Family Tree',
                      message: `Are you sure you want to delete the dynasty tree "${activeTree.name}"?`,
                      subMessage: 'All members, generations, and lineage relationships in this family tree will be permanently removed.',
                      confirmText: 'Delete Dynasty',
                      cancelText: 'Cancel',
                      isDestructive: true
                    });
                    if (confirmed) {
                      deleteTree(activeTree.id);
                      syncToCloud(user?.uid);
                    }
                  }}
                  title="Delete this dynasty family tree"
                >
                  <i className="fas fa-trash-alt"></i>
                  <span className="btn-label">Delete Dynasty</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="header-search-container desktop-search">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search family member, title, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Action Controls */}
          <div className="header-right">
            {activeTree && (
              <>
                <button
                  type="button"
                  className="btn-studio-action btn-add-member"
                  onClick={() => openMemberEditor(null, 1)}
                  title="Add a new member to this dynasty"
                >
                  <i className="fas fa-user-plus"></i>
                  <span className="btn-label">Add Member</span>
                </button>

                <button
                  type="button"
                  className="btn-studio-action btn-autolayout"
                  onClick={() => {
                    autoLayoutTree(activeTree.id);
                    syncToCloud(user?.uid);
                  }}
                  title="Auto-arrange members into clean generation tiers"
                >
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <span className="btn-label">Auto-Arrange</span>
                </button>
              </>
            )}

            <button
              type="button"
              className="btn-studio-action btn-close-studio"
              onClick={closeStudio}
              title="Close Family Tree Studio"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="header-mobile-search-row">
          <div className="header-search-container mobile-search">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search member, title, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Studio Canvas Area */}
      <main
        className={`family-tree-canvas ${isPanning ? 'is-panning' : ''}`}
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
      >
        {/* Canvas World Container */}
        <div
          className="canvas-world"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Generation Tier Background Guidelines */}
          <div className="generation-guidelines">
            {Array.from({ length: maxGenerationTier }).map((_, idx) => {
              const tierNum = idx + 1;
              const yPos = (tierNum - 1) * 220 + 40;
              return (
                <div
                  key={tierNum}
                  className="generation-tier-row"
                  style={{ top: `${yPos}px` }}
                >
                  <span className="generation-label">
                    GENERATION {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][idx] || tierNum}
                  </span>
                  <div className="generation-divider-line"></div>
                </div>
              );
            })}
          </div>

          {!activeTree && (
            <div className="canvas-empty-state" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#8b6f47', background: 'rgba(255,255,255,0.92)', padding: '30px 40px', borderRadius: '12px', border: '1.5px dashed #c59b3f', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 10 }}>
              <i className="fas fa-sitemap" style={{ fontSize: '3rem', color: '#d4af37', marginBottom: '12px', opacity: 0.85, display: 'block' }}></i>
              <h3 style={{ fontFamily: 'Cinzel, serif', color: '#4a2711', margin: '0 0 8px 0', fontSize: '1.25rem' }}>No Dynasty Trees Found</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', maxWidth: '340px' }}>This dynasty was removed. Create a new dynasty family tree to track bloodlines.</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-studio-action btn-new-tree"
                  onClick={() => {
                    setNewTreeName('');
                    setNewTreeDesc('');
                    setShowCreateTreeModal(true);
                  }}
                >
                  <i className="fas fa-plus"></i>
                  <span>Forge New Dynasty</span>
                </button>
                <button
                  type="button"
                  className="btn-studio-action btn-back-studio"
                  onClick={closeStudio}
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Exit Studio</span>
                </button>
              </div>
            </div>
          )}

          {/* SVG Relationship Connector Lines */}
          <svg className="family-tree-svg" style={{ overflow: 'visible' }}>
            {activeTree && activeTree.relationships.map(rel => {
              // 1. Marriage / Spouse Bridge Lines
              if (rel.type === 'spouse') {
                const node1 = activeTree.nodes.find(n => n.id === rel.sourceId);
                const node2 = activeTree.nodes.find(n => n.id === rel.targetId);
                if (!node1 || !node2) return null;

                const x1 = node1.position.x + 45;
                const y1 = node1.position.y + 45;
                const x2 = node2.position.x + 45;
                const y2 = node2.position.y + 45;
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={rel.id} className="rel-group spouse-group">
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      className={`rel-line spouse-line ${rel.status || 'married'}`}
                    />
                    <circle cx={midX} cy={midY} r={9} className="marriage-ring-badge" fill="#d4af37" stroke="#8b5a1a" strokeWidth="1.5" />
                    <circle cx={midX - 3} cy={midY} r={3.5} fill="none" stroke="#2b1408" strokeWidth="1.2" />
                    <circle cx={midX + 3} cy={midY} r={3.5} fill="none" stroke="#2b1408" strokeWidth="1.2" />
                  </g>
                );
              }

              // 2. Parent-Child Vertical Drop Lines
              if (rel.type === 'parent_child') {
                const parent1 = activeTree.nodes.find(n => n.id === rel.parentId1);
                const parent2 = rel.parentId2 ? activeTree.nodes.find(n => n.id === rel.parentId2) : null;
                const child = activeTree.nodes.find(n => n.id === rel.childId);
                if (!parent1 || !child) return null;

                let startX = parent1.position.x + 45;
                let startY = parent1.position.y + 45;

                // If two parents, drop from marriage midpoint
                if (parent2) {
                  startX = (parent1.position.x + parent2.position.x) / 2 + 45;
                  startY = (parent1.position.y + parent2.position.y) / 2 + 45;
                }

                const endX = child.position.x + 45;
                const endY = child.position.y + 45;
                const midY = startY + (endY - startY) * 0.55;

                // Stepped hierarchical path
                const pathD = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;

                return (
                  <g key={rel.id} className="rel-group child-group">
                    <path
                      d={pathD}
                      className={`rel-line child-line ${rel.relationType || 'biological'}`}
                    />
                    <circle cx={endX} cy={endY - 38} r={3.5} className="child-fork-dot" />
                  </g>
                );
              }

              return null;
            })}
          </svg>

          {/* Member Node Tokens */}
          {activeTree && activeTree.nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isSearched = searchedNodeIds.has(node.id);
            const lineage = lineages.find(l => l.id === node.lineageId);

            return (
              <div
                key={node.id}
                className={`family-tree-node ${isSelected ? 'is-selected' : ''} ${isSearched ? 'is-highlighted' : ''} ${node.isDeceased ? 'is-deceased' : ''}`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onDoubleClick={() => openMemberEditor(node)}
              >
                {/* Circular Token Portrait */}
                <div className="node-token-frame">
                  {node.portraitUrl ? (
                    <img src={node.portraitUrl} alt={node.name} className="node-portrait-img" />
                  ) : (
                    <div className="node-portrait-fallback">
                      <i className={`fas ${node.gender === 'female' ? 'fa-female' : node.gender === 'male' ? 'fa-male' : 'fa-user-shield'}`}></i>
                    </div>
                  )}
                  {node.isDeceased && (
                    <div className="node-status-badge deceased" title="Deceased">
                      <i className="fas fa-cross"></i>
                    </div>
                  )}
                  {lineage && (
                    <div className="node-lineage-badge" title={`Lineage: ${lineage.name}`}>
                      <i className="fas fa-dna"></i>
                    </div>
                  )}
                </div>

                {/* Nameplate & Title Banner */}
                <div className="node-nameplate">
                  {node.title && <span className="node-title-label">{node.title}</span>}
                  <h4 className="node-name">{node.name}</h4>
                  {node.lifespan && <span className="node-lifespan">{node.lifespan}</span>}
                </div>

                {/* Selected Node Action Controls */}
                {isSelected && (
                  <div className="node-floating-actions" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      className="node-act-btn btn-act-spouse"
                      onClick={() => {
                        setShowRelModal({ type: 'spouse', sourceId: node.id });
                        setTargetMemberSelect('');
                      }}
                      title="Link Spouse / Partner"
                    >
                      <i className="fas fa-ring"></i>
                    </button>
                    <button
                      type="button"
                      className="node-act-btn btn-act-child"
                      onClick={() => {
                        setShowRelModal({ type: 'child', sourceId: node.id });
                        setTargetMemberSelect('');
                      }}
                      title="Link Child / Descendant"
                    >
                      <i className="fas fa-child"></i>
                    </button>
                    <button
                      type="button"
                      className="node-act-btn btn-act-edit"
                      onClick={() => openMemberEditor(node)}
                      title="Edit Bio & Traits"
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="node-act-btn btn-act-delete"
                      onClick={async () => {
                        const confirmed = await showConfirm({
                          title: 'Remove Dynasty Member',
                          message: `Remove ${node.name} from dynasty?`,
                          subMessage: 'This will remove the character and their relationships from this family tree.',
                          confirmText: 'Remove',
                          cancelText: 'Cancel',
                          isDestructive: true
                        });
                        if (confirmed) {
                          removeMember(activeTree.id, node.id);
                          syncToCloud(user?.uid);
                        }
                      }}
                      title="Remove Member"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Canvas Navigation HUD */}
        <div className="studio-floating-hud">
          <button
            type="button"
            className="btn-hud-control"
            onClick={() => setZoomLevel(prev => Math.min(2.5, +(prev * 1.2).toFixed(2)))}
            title="Zoom In"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            type="button"
            className="btn-hud-control btn-hud-pct"
            onClick={resetView}
            title="Reset Pan & 100% Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            className="btn-hud-control"
            onClick={() => setZoomLevel(prev => Math.max(0.35, +(prev * 0.83).toFixed(2)))}
            title="Zoom Out"
          >
            <i className="fas fa-minus"></i>
          </button>
          <div className="hud-divider"></div>
          <button
            type="button"
            className="btn-hud-control"
            onClick={() => {
              if (activeTree) {
                autoLayoutTree(activeTree.id);
                resetView();
              }
            }}
            title="Center & Auto-Align"
          >
            <i className="fas fa-crosshairs"></i>
          </button>
        </div>
      </main>

      {/* Member Inspector & Editor Drawer */}
      {showMemberDrawer && editingMember && (
        <div className="studio-drawer-backdrop" onClick={() => setShowMemberDrawer(false)}>
          <aside className="studio-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-row">
                <i className="fas fa-user-gear"></i>
                <h3>{editingMember.isNew ? 'Forge Dynasty Member' : `Edit ${editingMember.name}`}</h3>
              </div>
              <button
                type="button"
                className="btn-close-drawer"
                onClick={() => setShowMemberDrawer(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="drawer-body" onSubmit={handleSaveMemberForm}>
              {/* Portrait Upload / URL */}
              <div className="form-group">
                <label><i className="fas fa-image"></i> Token Portrait Artwork</label>
                <div className="portrait-preview-row">
                  <div className="portrait-preview-token">
                    {editingMember.portraitUrl ? (
                      <img src={editingMember.portraitUrl} alt="Preview" />
                    ) : (
                      <i className="fas fa-user-shield fallback-icon"></i>
                    )}
                  </div>
                  <div className="portrait-inputs">
                    <input
                      type="text"
                      placeholder="Paste image URL (or upload below)..."
                      value={editingMember.portraitUrl || ''}
                      onChange={e => setEditingMember(prev => ({ ...prev, portraitUrl: e.target.value }))}
                    />
                    <label className="btn-upload-file">
                      <i className="fas fa-upload"></i> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const user = useAuthStore.getState().user;
                              const currentUserId = user?.uid || (user?.isGuest ? 'guest' : null);
                              const result = await uploadAsset(currentUserId, file, 'portraits', { profile: 'PORTRAIT' });
                              if (result.success && result.url) {
                                setEditingMember(prev => ({ ...prev, portraitUrl: result.url }));
                              }
                            } catch (err) {
                              console.error('Failed to upload member portrait:', err);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name & Title */}
              <div className="form-row-2">
                <div className="form-group">
                  <label><i className="fas fa-font"></i> Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nikolaos Alduin"
                    value={editingMember.name || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-crown"></i> Title / Honorific</label>
                  <input
                    type="text"
                    placeholder="e.g. High King, Arch-Mage"
                    value={editingMember.title || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              {/* Lifespan & Role */}
              <div className="form-row-2">
                <div className="form-group">
                  <label><i className="fas fa-hourglass-half"></i> Lifespan / Epoch</label>
                  <input
                    type="text"
                    placeholder="e.g. 750 - 825 or 820 - Present"
                    value={editingMember.lifespan || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev, lifespan: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label><i className="fas fa-briefcase"></i> Dynastic Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Ruler, Spymaster, Heir"
                    value={editingMember.role || ''}
                    onChange={e => setEditingMember(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
              </div>

              {/* Generation Tier & Gender */}
              <div className="form-row-2">
                <div className="form-group">
                  <label><i className="fas fa-layer-group"></i> Generation Tier</label>
                  <select
                    value={editingMember.generationTier || 1}
                    onChange={e => setEditingMember(prev => ({ ...prev, generationTier: Number(e.target.value) }))}
                  >
                    <option value={1}>Generation I (Founders / Grandparents)</option>
                    <option value={2}>Generation II (Heirs / Parents)</option>
                    <option value={3}>Generation III (Children / Scions)</option>
                    <option value={4}>Generation IV (Grandchildren)</option>
                    <option value={5}>Generation V (Descendants)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><i className="fas fa-venus-mars"></i> Gender</label>
                  <select
                    value={editingMember.gender || 'male'}
                    onChange={e => setEditingMember(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    {GENDER_OPTIONS.map(g => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Species / Cultural Lineage */}
              <div className="form-group">
                <label><i className="fas fa-dna"></i> Species / Cultural Lineage</label>
                <select
                  value={editingMember.lineageId || ''}
                  onChange={e => setEditingMember(prev => ({ ...prev, lineageId: e.target.value || null }))}
                >
                  <option value="">-- No specific species assigned --</option>
                  {lineages.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.essence || 'Canonical'})</option>
                  ))}
                </select>
              </div>

              {/* Deceased Switch */}
              <div className="form-group switch-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingMember.isDeceased || false}
                    onChange={e => setEditingMember(prev => ({ ...prev, isDeceased: e.target.checked }))}
                  />
                  <span>Deceased / Historical Figure</span>
                </label>
              </div>

              {/* Bio & Chronicle Notes */}
              <div className="form-group">
                <RichCampaignEditor
                  label="Bio, Deeds & Secrets"
                  icon="fa-scroll"
                  placeholder="Record bloodline secrets, heroic deeds, magical inheritances, or GM secrets..."
                  value={editingMember.notes || ''}
                  onChange={val => setEditingMember(prev => ({ ...prev, notes: val }))}
                  rows={4}
                  compact={true}
                />
              </div>

              {/* Linked Relationships & Unlink Actions */}
              {!editingMember.isNew && activeTree && (
                <div className="form-group">
                  <label><i className="fas fa-link"></i> Linked Dynastic Relationships</label>
                  <div className="drawer-rel-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    {activeTree.relationships
                      .filter(r => (
                        (r.type === 'spouse' && (r.sourceId === editingMember.id || r.targetId === editingMember.id)) ||
                        (r.type === 'parent_child' && (r.childId === editingMember.id || r.parentId1 === editingMember.id || r.parentId2 === editingMember.id))
                      ))
                      .map(rel => {
                        let relLabel = '';
                        let targetNodeName = '';
                        if (rel.type === 'spouse') {
                          const partnerId = rel.sourceId === editingMember.id ? rel.targetId : rel.sourceId;
                          const partner = activeTree.nodes.find(n => n.id === partnerId);
                          const spouseMeta = SPOUSE_STATUSES.find(s => s.id === rel.status) || SPOUSE_STATUSES[0];
                          relLabel = spouseMeta.label;
                          targetNodeName = partner?.name || 'Partner';
                        } else if (rel.type === 'parent_child') {
                          if (rel.childId === editingMember.id) {
                            const p1 = activeTree.nodes.find(n => n.id === rel.parentId1);
                            const p2 = rel.parentId2 ? activeTree.nodes.find(n => n.id === rel.parentId2) : null;
                            relLabel = 'Parent';
                            targetNodeName = [p1?.name, p2?.name].filter(Boolean).join(' & ') || 'Parent';
                          } else {
                            const child = activeTree.nodes.find(n => n.id === rel.childId);
                            const childMeta = RELATION_TYPES.find(r => r.id === rel.relationType) || RELATION_TYPES[0];
                            relLabel = childMeta.label;
                            targetNodeName = child?.name || 'Child';
                          }
                        }

                        return (
                          <div
                            key={rel.id}
                            className="drawer-rel-row"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: '#fbf9f4',
                              border: '1px solid rgba(139, 69, 19, 0.2)',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <span>
                              <strong style={{ color: '#8b5a1a' }}>{relLabel}:</strong> {targetNodeName}
                            </span>
                            <button
                              type="button"
                              className="btn-unlink-rel"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#c0392b',
                                cursor: 'pointer',
                                padding: '2px 6px',
                                fontSize: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={async () => {
                                const confirmed = await showConfirm({
                                  title: 'Unlink Relationship',
                                  message: `Remove relationship between ${editingMember.name} and ${targetNodeName}?`,
                                  confirmText: 'Unlink',
                                  cancelText: 'Cancel',
                                  isDestructive: true
                                });
                                if (confirmed) {
                                  removeRelationship(activeTree.id, rel.id);
                                  syncToCloud(user?.uid);
                                }
                              }}
                              title="Unlink this relationship"
                            >
                              <i className="fas fa-link-slash"></i> Unlink
                            </button>
                          </div>
                        );
                      })}
                    {activeTree.relationships.filter(r => (
                      (r.type === 'spouse' && (r.sourceId === editingMember.id || r.targetId === editingMember.id)) ||
                      (r.type === 'parent_child' && (r.childId === editingMember.id || r.parentId1 === editingMember.id || r.parentId2 === editingMember.id))
                    )).length === 0 && (
                      <span style={{ fontSize: '0.78rem', color: '#997c60', fontStyle: 'italic' }}>
                        No linked spouses or descendants yet. Link from canvas action buttons.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Drawer Actions */}
              <div className="drawer-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                {!editingMember.isNew && (
                  <button
                    type="button"
                    className="btn-drawer delete"
                    style={{ background: 'rgba(231, 76, 60, 0.12)', border: '1px solid rgba(231, 76, 60, 0.4)', color: '#c0392b', padding: '7px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    onClick={async () => {
                      const confirmed = await showConfirm({
                        title: 'Remove Dynasty Member',
                        message: `Remove ${editingMember.name} from dynasty?`,
                        subMessage: 'This will remove the character and their relationships from this family tree.',
                        confirmText: 'Remove Member',
                        cancelText: 'Cancel',
                        isDestructive: true
                      });
                      if (confirmed) {
                        removeMember(activeTree.id, editingMember.id);
                        syncToCloud(user?.uid);
                        setShowMemberDrawer(false);
                      }
                    }}
                  >
                    <i className="fas fa-trash-alt"></i> Delete Member
                  </button>
                )}
                <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                  <button
                    type="button"
                    className="btn-drawer cancel"
                    onClick={() => setShowMemberDrawer(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-drawer save"
                  >
                    <i className="fas fa-check"></i> Save Member
                  </button>
                </div>
              </div>
            </form>
          </aside>
        </div>
      )}

      {/* Relationship Linker Modal */}
      {showRelModal && activeTree && (
        <div className="studio-modal-backdrop" onClick={() => setShowRelModal(null)}>
          <div className="studio-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-link"></i>
              <h4>
                {showRelModal.type === 'spouse' && 'Link Spouse / Partner'}
                {showRelModal.type === 'child' && 'Link Child / Descendant'}
                {showRelModal.type === 'parent' && 'Link Parent / Ancestor'}
              </h4>
            </div>

            <form onSubmit={handleConfirmRelationship} className="modal-body">
              {/* Mode Switcher */}
              <div className="rel-mode-toggle-bar" style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button
                  type="button"
                  className={`btn-mode-pill ${relMode === 'existing' ? 'active' : ''}`}
                  style={relMode === 'existing' ? { background: '#2b1408', color: '#f5d77f' } : { background: '#ede4d6', color: '#5a2e12' }}
                  onClick={() => setRelMode('existing')}
                >
                  <i className="fas fa-link"></i> Link Existing Member
                </button>
                <button
                  type="button"
                  className={`btn-mode-pill ${relMode === 'new' ? 'active' : ''}`}
                  style={relMode === 'new' ? { background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', color: '#1a0f05' } : { background: '#ede4d6', color: '#5a2e12' }}
                  onClick={() => setRelMode('new')}
                >
                  <i className="fas fa-user-plus"></i> + Create New Relative
                </button>
              </div>

              {relMode === 'existing' ? (
                <div className="form-group">
                  <label>Select Target Relative</label>
                  <select
                    required
                    value={targetMemberSelect}
                    onChange={e => setTargetMemberSelect(e.target.value)}
                  >
                    <option value="">-- Choose Member --</option>
                    {activeTree.nodes
                      .filter(n => n.id !== showRelModal.sourceId)
                      .map(n => (
                        <option key={n.id} value={n.id}>
                          {n.name} {n.title ? `(${n.title})` : ''} — Gen {n.generationTier || 1}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Princess Vespera Alduin"
                      value={newRelName}
                      onChange={e => setNewRelName(e.target.value)}
                    />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Title / Honorific</label>
                      <input
                        type="text"
                        placeholder="e.g. Duchess, Consort"
                        value={newRelTitle}
                        onChange={e => setNewRelTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={newRelGender}
                        onChange={e => setNewRelGender(e.target.value)}
                      >
                        {GENDER_OPTIONS.map(g => (
                          <option key={g.id} value={g.id}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {showRelModal.type === 'spouse' && (
                <div className="form-group">
                  <label>Relationship / Union Status</label>
                  <select
                    value={relCustomStatus}
                    onChange={e => setRelCustomStatus(e.target.value)}
                  >
                    {SPOUSE_STATUSES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <small className="form-hint" style={{ color: '#7a5230', marginTop: '4px', display: 'block', fontSize: '0.78rem' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
                    {SPOUSE_STATUSES.find(s => s.id === relCustomStatus)?.desc}
                  </small>
                </div>
              )}

              {showRelModal.type === 'child' && (
                <div className="form-group">
                  <label>Child Descent Type</label>
                  <select
                    value={relCustomStatus}
                    onChange={e => setRelCustomStatus(e.target.value)}
                  >
                    {RELATION_TYPES.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                  <small className="form-hint" style={{ color: '#7a5230', marginTop: '4px', display: 'block', fontSize: '0.78rem' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
                    {RELATION_TYPES.find(r => r.id === relCustomStatus)?.desc}
                  </small>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal cancel"
                  onClick={() => setShowRelModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal confirm"
                  disabled={relMode === 'existing' ? !targetMemberSelect : !newRelName.trim()}
                >
                  <i className="fas fa-check"></i> {relMode === 'new' ? 'Create & Link' : 'Establish Connection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Tree Modal */}
      {showCreateTreeModal && (
        <div className="studio-modal-backdrop" onClick={() => setShowCreateTreeModal(false)}>
          <div className="studio-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <i className="fas fa-crown"></i>
              <h4>Forge New Family Dynasty</h4>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newTreeName.trim()) {
                  createTree(newTreeName, newTreeDesc);
                  setShowCreateTreeModal(false);
                  syncToCloud(user?.uid);
                }
              }}
              className="modal-body"
            >
              <div className="form-group">
                <label>Dynasty / House Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House Tolavarak of the Gilded Vale"
                  value={newTreeName}
                  onChange={e => setNewTreeName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Chronicle Description</label>
                <textarea
                  rows={3}
                  placeholder="Origins, ruling seat, heraldry, or historical notes..."
                  value={newTreeDesc}
                  onChange={e => setNewTreeDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal cancel"
                  onClick={() => setShowCreateTreeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal confirm"
                  disabled={!newTreeName.trim()}
                >
                  <i className="fas fa-plus"></i> Create Dynasty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default FamilyTreeStudio;
