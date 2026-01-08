// Account Journal Manager - Full page journal view for Account Dashboard
// Syncs player knowledge, notes, and knowledge board across sessions
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useShareableStore from '../../store/shareableStore';
import { getCustomIconUrl } from '../../utils/assetManager';
import './styles/AccountJournalManager.css';

// Check if an icon is a custom path (creature/ability icon) or built-in
const isCustomIcon = (iconType) => {
  return iconType && (iconType.includes('/') || iconType.includes('\\'));
};

// Get icon URL for custom icons
const getOrbIconUrl = (iconType) => {
  if (!iconType || !isCustomIcon(iconType)) return null;
  
  // Determine icon category based on path
  if (iconType.toLowerCase().includes('icon') || 
      iconType.includes('Dark Elf') || iconType.includes('Demon') || 
      iconType.includes('Dwarf') || iconType.includes('Elves') ||
      iconType.includes('Human') || iconType.includes('Monsters') ||
      iconType.includes('Undead') || iconType.includes('Pirates') ||
      iconType.includes('Kobolds') || iconType.includes('Orc')) {
    return getCustomIconUrl(iconType, 'creatures');
  }
  
  // Default to abilities folder
  return getCustomIconUrl(iconType, 'abilities');
};

// Icon options for boards and folders
const BOARD_ICONS = [
  { id: 'fa-project-diagram', icon: 'fa-project-diagram', label: 'Board' },
  { id: 'fa-map', icon: 'fa-map', label: 'Map' },
  { id: 'fa-globe', icon: 'fa-globe', label: 'World' },
  { id: 'fa-scroll', icon: 'fa-scroll', label: 'Scroll' },
  { id: 'fa-book', icon: 'fa-book', label: 'Book' },
  { id: 'fa-chess', icon: 'fa-chess', label: 'Strategy' },
  { id: 'fa-mountain', icon: 'fa-mountain', label: 'Mountain' },
  { id: 'fa-tree', icon: 'fa-tree', label: 'Forest' },
  { id: 'fa-dungeon', icon: 'fa-dungeon', label: 'Dungeon' },
  { id: 'fa-castle', icon: 'fa-chess-rook', label: 'Castle' },
  { id: 'fa-skull', icon: 'fa-skull', label: 'Skull' },
  { id: 'fa-dragon', icon: 'fa-dragon', label: 'Dragon' }
];

// Icon options for knowledge orbs
const ORB_ICONS = [
  { id: 'scroll', icon: 'fa-scroll', label: 'Scroll' },
  { id: 'book', icon: 'fa-book', label: 'Book' },
  { id: 'map', icon: 'fa-map', label: 'Map' },
  { id: 'gem', icon: 'fa-gem', label: 'Gem' },
  { id: 'skull', icon: 'fa-skull', label: 'Skull' },
  { id: 'crown', icon: 'fa-crown', label: 'Crown' },
  { id: 'shield', icon: 'fa-shield-alt', label: 'Shield' },
  { id: 'star', icon: 'fa-star', label: 'Star' },
  { id: 'key', icon: 'fa-key', label: 'Key' },
  { id: 'eye', icon: 'fa-eye', label: 'Eye' },
  { id: 'user', icon: 'fa-user', label: 'Person' },
  { id: 'location', icon: 'fa-map-marker-alt', label: 'Location' },
  { id: 'question', icon: 'fa-question', label: 'Unknown' },
  { id: 'exclamation', icon: 'fa-exclamation', label: 'Important' },
  { id: 'heart', icon: 'fa-heart', label: 'Heart' },
  { id: 'dragon', icon: 'fa-dragon', label: 'Monster' },
  { id: 'coins', icon: 'fa-coins', label: 'Treasure' },
  { id: 'landmark', icon: 'fa-landmark', label: 'Building' }
];

// Color options for orbs
const ORB_COLORS = [
  '#d4af37', '#cd7f32', '#c0c0c0', '#e74c3c', '#3498db', 
  '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e91e63', 
  '#795548', '#607d8b'
];

// Folder colors
const FOLDER_COLORS = [
  '#d4af37', '#cd7f32', '#8b4513', '#e74c3c', '#3498db', 
  '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#795548'
];

// Helper to get background image URL
const getBackgroundImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL or data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('/')) {
    return imagePath;
  }
  // Otherwise, construct path from /assets/Backgrounds/
  return `/assets/Backgrounds/${encodeURIComponent(imagePath)}`;
};

const AccountJournalManager = ({ user }) => {
  const [activeSection, setActiveSection] = useState('board');
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [showKnowledgePopup, setShowKnowledgePopup] = useState(null);
  const [showOrbEditor, setShowOrbEditor] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [draggedOrb, setDraggedOrb] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddOrbPopup, setShowAddOrbPopup] = useState(false);
  const [addOrbStep, setAddOrbStep] = useState('select');
  const [selectedItemForOrb, setSelectedItemForOrb] = useState(null);
  const [addOrbIcon, setAddOrbIcon] = useState('scroll');
  const [addOrbColor, setAddOrbColor] = useState('#d4af37');
  const [addOrbTitle, setAddOrbTitle] = useState('');
  const [addOrbSearchTerm, setAddOrbSearchTerm] = useState('');
  const [addOrbActiveTab, setAddOrbActiveTab] = useState('received');
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardColor, setNewBoardColor] = useState(FOLDER_COLORS[0]);
  const [newBoardIcon, setNewBoardIcon] = useState('fa-project-diagram');
  const boardRef = useRef(null);

  const {
    playerKnowledge,
    playerNotes,
    knowledgeOrbs,
    knowledgeConnections,
    journalFolders,
    knowledgeBoards,
    currentFolderId,
    currentBoardId,
    getBoardBackground,
    addKnowledgeOrb,
    updateOrbPosition,
    updateOrb,
    removeOrb,
    addConnection,
    removeConnection,
    removePlayerKnowledge,
    addNote,
    updateNote,
    removeNote,
    addFolder,
    updateFolder,
    removeFolder,
    setCurrentFolder,
    addKnowledgeBoard,
    updateKnowledgeBoard,
    removeKnowledgeBoard,
    setCurrentBoard,
    getContentByOrb,
    moveKnowledgeToFolder,
    moveNoteToFolder,
    clearFolderContent,
    setBoardBackground,
    clearBoardBackground
  } = useShareableStore();

  // Filter content based on current folder
  // When a folder is selected, show ONLY items in that folder
  // When "All" is selected (currentFolderId is null), show ALL items
  const filteredKnowledge = useMemo(() => {
    if (!currentFolderId) return playerKnowledge;
    return playerKnowledge.filter(k => k.folderId === currentFolderId);
  }, [playerKnowledge, currentFolderId]);

  const filteredNotes = useMemo(() => {
    if (!currentFolderId) return playerNotes;
    return playerNotes.filter(n => n.folderId === currentFolderId);
  }, [playerNotes, currentFolderId]);

  const filteredOrbs = useMemo(() => {
    if (!currentBoardId) return knowledgeOrbs;
    return knowledgeOrbs.filter(o => o.boardId === currentBoardId);
  }, [knowledgeOrbs, currentBoardId]);

  // Sections
  const sections = [
    { id: 'board', label: 'Knowledge Board', icon: 'fa-project-diagram' },
    { id: 'received', label: 'Received', icon: 'fa-inbox' },
    { id: 'notes', label: 'My Notes', icon: 'fa-sticky-note' }
  ];

  // Handle orb drag
  const handleOrbMouseDown = useCallback((e, orb) => {
    // Only handle left mouse button (button 0)
    // Right button (button 2) is handled by onContextMenu
    if (e.button !== 0) return;
    
    if (connectingFrom) {
      // We're in connection mode
      if (connectingFrom === 'waiting') {
        // First orb selected - set it as the source
        setConnectingFrom(orb.id);
        return;
      } else if (connectingFrom === orb.id) {
        // Clicked the same orb - cancel connection mode
        setConnectingFrom(null);
        return;
      } else {
        // Second orb selected - create the connection
        addConnection(connectingFrom, orb.id);
        setConnectingFrom(null);
        return;
      }
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startOrbX = orb.position.x;
    const startOrbY = orb.position.y;
    
    let hasMoved = false;
    const DRAG_THRESHOLD = 5; // Pixels of movement before considering it a drag
    
    setDraggedOrb(orb.id);
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);
      
      // If mouse moved more than threshold, it's a drag
      if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
        hasMoved = true;
      }
      
      const newX = Math.max(0, Math.min(boardRect.width - 60, startOrbX + (moveEvent.clientX - startX)));
      const newY = Math.max(0, Math.min(boardRect.height - 60, startOrbY + (moveEvent.clientY - startY)));
      
      updateOrbPosition(orb.id, { x: newX, y: newY });
    };
    
    const handleMouseUp = (upEvent) => {
      // Only handle left mouse button
      if (upEvent.button !== 0) {
        setDraggedOrb(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        return;
      }
      
      setDraggedOrb(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // If mouse didn't move much, treat it as a click and open the popup
      if (!hasMoved) {
        const content = getContentByOrb(orb);
        if (content) {
          setShowKnowledgePopup({ ...content, sourceType: orb.sourceType });
        }
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [connectingFrom, addConnection, updateOrbPosition, getContentByOrb]);

  // Handle dropping onto board
  const handleBoardDrop = useCallback((e) => {
    e.preventDefault();
    
    const knowledgeId = e.dataTransfer.getData('knowledge/id');
    const noteId = e.dataTransfer.getData('note/id');
    
    if (!knowledgeId && !noteId) return;
    
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;
    
    const x = e.clientX - boardRect.left - 30;
    const y = e.clientY - boardRect.top - 30;
    
    if (noteId) {
      addKnowledgeOrb(noteId, { x, y }, 'note', 'sticky-note', '#f39c12');
    } else if (knowledgeId) {
      addKnowledgeOrb(knowledgeId, { x, y }, 'knowledge');
    }
  }, [addKnowledgeOrb]);

  // Handle adding item from popup to board
  const handleAddOrbConfirm = useCallback(() => {
    if (!selectedItemForOrb || !boardRef?.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = (boardRect.width / 2) - 30 + (Math.random() - 0.5) * 100;
    const y = (boardRect.height / 2) - 30 + (Math.random() - 0.5) * 100;

    const orbId = addKnowledgeOrb(
      selectedItemForOrb.id,
      { x: Math.max(20, x), y: Math.max(20, y) },
      selectedItemForOrb.sourceType,
      addOrbIcon,
      addOrbColor
    );

    if (addOrbTitle.trim()) {
      updateOrb(orbId, { label: addOrbTitle.trim() });
    }

    setShowAddOrbPopup(false);
    setAddOrbStep('select');
    setSelectedItemForOrb(null);
    setAddOrbIcon('scroll');
    setAddOrbColor('#d4af37');
    setAddOrbTitle('');
  }, [selectedItemForOrb, addOrbIcon, addOrbColor, addOrbTitle, addKnowledgeOrb, updateOrb]);

  const handleSelectItemForOrb = (item, type) => {
    setSelectedItemForOrb({ ...item, sourceType: type });
    setAddOrbTitle(item?.title || '');
    
    if (type === 'note') {
      setAddOrbIcon('sticky-note');
      setAddOrbColor('#f39c12');
    } else if (item.type === 'image') {
      setAddOrbIcon('map');
      setAddOrbColor('#3498db');
    } else {
      setAddOrbIcon('scroll');
      setAddOrbColor('#d4af37');
    }
    
    setAddOrbStep('customize');
  };

  const searchedKnowledge = useMemo(() => {
    return filteredKnowledge.filter(k =>
      k.title?.toLowerCase().includes(addOrbSearchTerm.toLowerCase())
    );
  }, [filteredKnowledge, addOrbSearchTerm]);

  const searchedNotes = useMemo(() => {
    return filteredNotes.filter(n =>
      n.title?.toLowerCase().includes(addOrbSearchTerm.toLowerCase()) ||
      n.content?.toLowerCase().includes(addOrbSearchTerm.toLowerCase())
    );
  }, [filteredNotes, addOrbSearchTerm]);

  // Handle folder save (for received/notes)
  const handleSaveFolder = () => {
    if (!newFolderName.trim()) return;
    
    if (editingFolder) {
      updateFolder(editingFolder.id, { name: newFolderName, color: newFolderColor });
    } else {
      addFolder(newFolderName, newFolderColor);
    }
    
    setShowFolderModal(false);
    setNewFolderName('');
    setNewFolderColor(FOLDER_COLORS[0]);
    setEditingFolder(null);
  };

  // Handle board save (for knowledge board)
  const handleSaveBoard = () => {
    if (!newBoardName.trim()) return;
    
    if (editingBoard) {
      updateKnowledgeBoard(editingBoard.id, { name: newBoardName, color: newBoardColor, icon: newBoardIcon });
    } else {
      const newId = addKnowledgeBoard(newBoardName, newBoardColor, newBoardIcon);
      setCurrentBoard(newId);
    }
    
    setShowBoardModal(false);
    setNewBoardName('');
    setNewBoardColor(FOLDER_COLORS[0]);
    setNewBoardIcon('fa-project-diagram');
    setEditingBoard(null);
  };

  // Handle note save
  const handleSaveNote = () => {
    if (!noteTitle.trim()) return;
    
    if (editingNote) {
      updateNote(editingNote.id, { title: noteTitle, content: noteContent });
    } else {
      addNote(noteTitle, noteContent);
    }
    
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
  };

  // Get current folder name
  const currentFolder = journalFolders.find(f => f.id === currentFolderId);

  return (
    <div className="account-journal-manager">
      {/* Header with folder/board selector, tabs, and stats */}
      <div className="journal-manager-header">
        <div className="journal-folder-selector">
          {activeSection === 'board' ? (
            /* Board selector for Knowledge Board tab */
            <>
              <select 
                value={currentBoardId || ''} 
                onChange={(e) => setCurrentBoard(e.target.value || null)}
                className="folder-select"
              >
                <option value="">All Boards</option>
                {knowledgeBoards.map(board => (
                  <option key={board.id} value={board.id}>{board.name}</option>
                ))}
              </select>
              <button 
                className="btn btn-primary journal-new-folder-btn"
                onClick={() => {
                  setEditingBoard(null);
                  setNewBoardName('');
                  setNewBoardColor(FOLDER_COLORS[0]);
                  setNewBoardIcon('fa-project-diagram');
                  setShowBoardModal(true);
                }}
              >
                + New Board
              </button>
              {currentBoardId && (
                <>
                  <button 
                    className="btn btn-secondary folder-edit-btn"
                    onClick={() => {
                      const board = knowledgeBoards.find(b => b.id === currentBoardId);
                      if (board) {
                        setEditingBoard(board);
                        setNewBoardName(board.name);
                        setNewBoardColor(board.color);
                        setNewBoardIcon(board.icon || 'fa-project-diagram');
                        setShowBoardModal(true);
                      }
                    }}
                    title="Edit board"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-danger folder-delete-btn"
                    onClick={() => {
                      const board = knowledgeBoards.find(b => b.id === currentBoardId);
                      if (board && window.confirm(`Delete "${board.name}"? Orbs will be moved to "All Boards".`)) {
                        removeKnowledgeBoard(board.id);
                      }
                    }}
                    title="Delete board"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </>
              )}
            </>
          ) : (
            /* Folder selector for Received/Notes tabs */
            <>
              <select 
                value={currentFolderId || ''} 
                onChange={(e) => setCurrentFolder(e.target.value || null)}
                className="folder-select"
              >
                <option value="">All Folders</option>
                {journalFolders.map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
              <button 
                className="btn btn-primary journal-new-folder-btn"
                onClick={() => {
                  setEditingFolder(null);
                  setNewFolderName('');
                  setNewFolderColor(FOLDER_COLORS[0]);
                  setShowFolderModal(true);
                }}
              >
                + New Folder
              </button>
              {currentFolderId && (
                <>
                  <button 
                    className="btn btn-secondary folder-edit-btn"
                    onClick={() => {
                      const folder = journalFolders.find(f => f.id === currentFolderId);
                      if (folder) {
                        setEditingFolder(folder);
                        setNewFolderName(folder.name);
                        setNewFolderColor(folder.color);
                        setShowFolderModal(true);
                      }
                    }}
                    title="Edit folder"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="btn btn-danger folder-delete-btn"
                    onClick={() => {
                      const folder = journalFolders.find(f => f.id === currentFolderId);
                      if (folder && window.confirm(`Delete "${folder.name}"? Content will be moved to "All Folders".`)) {
                        removeFolder(folder.id);
                      }
                    }}
                    title="Delete folder"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </>
              )}
            </>
          )}
        </div>
        <div className="journal-section-tabs">
          {sections.map(section => (
            <button
              key={section.id}
              className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <i className={`fas ${section.icon}`}></i>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
        <div className="journal-stats">
          <span><i className="fas fa-inbox"></i> {filteredKnowledge.length} Received</span>
          <span><i className="fas fa-sticky-note"></i> {filteredNotes.length} Notes</span>
          <span><i className="fas fa-circle"></i> {filteredOrbs.length} Orbs</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="journal-content-area">
        {/* Knowledge Board */}
        {activeSection === 'board' && (
          <div className="journal-board-section">
            <div className="board-toolbar">
              <button
                className="toolbar-btn primary"
                onClick={() => {
                  setShowAddOrbPopup(true);
                  setAddOrbStep('select');
                  setSelectedItemForOrb(null);
                  setAddOrbSearchTerm('');
                  setAddOrbActiveTab('received');
                }}
              >
                <i className="fas fa-plus-circle"></i>
                Add Orb
              </button>
              <button
                className={`toolbar-btn ${connectingFrom ? 'active' : ''}`}
                onClick={() => setConnectingFrom(connectingFrom ? null : 'waiting')}
              >
                <i className="fas fa-link"></i>
                {connectingFrom ? 'Cancel' : 'Connect'}
              </button>
              <span className="toolbar-hint">
                {connectingFrom 
                  ? 'Click two orbs to connect them' 
                  : 'Click "Add Orb" to add content, or drag items from other tabs'}
              </span>
            </div>
            
            <div 
              ref={boardRef}
              className="knowledge-board"
              style={(() => {
                const boardBackground = getBoardBackground();
                return boardBackground ? {
                  backgroundImage: `url(${getBackgroundImageUrl(boardBackground.url)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                } : {};
              })()}
              onDrop={handleBoardDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Connection Lines */}
              <svg className="connection-svg">
                {knowledgeConnections
                  .filter(conn => {
                    // Only show connections between orbs that are both in the current board
                    const fromOrb = knowledgeOrbs.find(o => o.id === conn.fromOrbId);
                    const toOrb = knowledgeOrbs.find(o => o.id === conn.toOrbId);
                    if (!fromOrb || !toOrb) return false;
                    
                    // If no board selected, show all connections
                    if (!currentBoardId) return true;
                    
                    // If board selected, only show connections where both orbs are in that board
                    return fromOrb.boardId === currentBoardId && toOrb.boardId === currentBoardId;
                  })
                  .map(conn => {
                  const fromOrb = filteredOrbs.find(o => o.id === conn.fromOrbId);
                  const toOrb = filteredOrbs.find(o => o.id === conn.toOrbId);
                  
                  if (!fromOrb || !toOrb) return null;
                  
                  const x1 = fromOrb.position.x + 30;
                  const y1 = fromOrb.position.y + 30;
                  const x2 = toOrb.position.x + 30;
                  const y2 = toOrb.position.y + 30;
                  
                  return (
                    <g key={conn.id} className="connection-group">
                      <line
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        className="connection-line"
                      />
                      <line
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        className="connection-hitbox"
                        onClick={() => removeConnection(conn.id)}
                      />
                    </g>
                  );
                })}
              </svg>
              
              {/* Orbs */}
              {filteredOrbs.map(orb => {
                const content = getContentByOrb(orb);
                const hasCustomIcon = isCustomIcon(orb.iconType);
                const customIconUrl = hasCustomIcon ? getOrbIconUrl(orb.iconType) : null;
                const iconData = !hasCustomIcon ? (ORB_ICONS.find(i => i.id === orb.iconType) || ORB_ICONS[0]) : null;
                
                return (
                  <div
                    key={orb.id}
                    className={`board-orb ${draggedOrb === orb.id ? 'dragging' : ''} ${connectingFrom === orb.id ? 'connecting' : ''} ${connectingFrom && connectingFrom !== orb.id ? 'connectable' : ''}`}
                    style={{
                      left: orb.position.x,
                      top: orb.position.y,
                      '--orb-color': orb.color
                    }}
                    onMouseDown={(e) => handleOrbMouseDown(e, orb)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowOrbEditor(orb);
                    }}
                    onDoubleClick={() => {
                      const c = getContentByOrb(orb);
                      if (c) setShowKnowledgePopup({ ...c, sourceType: orb.sourceType });
                    }}
                  >
                    {hasCustomIcon ? (
                      <img 
                        src={customIconUrl} 
                        alt="" 
                        className="orb-custom-icon"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <i className={`fas ${iconData?.icon || 'fa-scroll'}`}></i>
                    )}
                    <span className="orb-title">{content?.title || '???'}</span>
                  </div>
                );
              })}
              
              {filteredOrbs.length === 0 && (
                <div className="board-empty">
                  <i className="fas fa-project-diagram"></i>
                  <p>Your knowledge board is empty</p>
                  <span>Drag items from Received or Notes to create orbs and organize your knowledge</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Received Section */}
        {activeSection === 'received' && (
          <div className="journal-received-section">
            {filteredKnowledge.length === 0 ? (
              <div className="section-empty">
                <i className="fas fa-inbox"></i>
                <p>No knowledge received yet</p>
                <span>When your GM shares information during a game, it will appear here</span>
              </div>
            ) : (
              <div className="received-grid">
                {filteredKnowledge.map(knowledge => (
                  <div
                    key={knowledge.id}
                    className="received-card"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('knowledge/id', knowledge.id);
                    }}
                    onClick={() => setShowKnowledgePopup({ ...knowledge, sourceType: 'knowledge' })}
                  >
                    <div className="card-preview">
                      {knowledge.type === 'image' ? (
                        <img src={knowledge.content} alt="" />
                      ) : (
                        <div className="text-preview">
                          <i className="fas fa-file-alt"></i>
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <span className="card-title">{knowledge.title}</span>
                      <span className="card-date">{new Date(knowledge.receivedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="card-actions">
                      <button 
                        className="card-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm({ type: 'knowledge', item: knowledge });
                        }}
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Section */}
        {activeSection === 'notes' && (
          <div className="journal-notes-section">
            {/* Note Editor */}
            <div className="note-editor-panel">
              <h4>{editingNote ? 'Edit Note' : 'New Note'}</h4>
              <input
                type="text"
                className="note-title-input"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title..."
              />
              <textarea
                className="note-content-input"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note here..."
                rows={10}
              />
              <div className="note-editor-actions">
                {editingNote && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingNote(null);
                      setNoteTitle('');
                      setNoteContent('');
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  className="btn btn-primary"
                  onClick={handleSaveNote}
                  disabled={!noteTitle.trim()}
                >
                  <i className="fas fa-save"></i>
                  {editingNote ? 'Update' : 'Save'}
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="notes-list-panel">
              <h4>Your Notes ({filteredNotes.length})</h4>
              {filteredNotes.length === 0 ? (
                <div className="notes-empty">
                  <i className="fas fa-sticky-note"></i>
                  <p>No notes yet</p>
                  <span>Create a note to get started</span>
                </div>
              ) : (
                <div className="notes-grid">
                  {filteredNotes.map(note => (
                    <div
                      key={note.id}
                      className="note-card"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('note/id', note.id);
                      }}
                      onClick={() => {
                        setEditingNote(note);
                        setNoteTitle(note.title);
                        setNoteContent(note.content);
                      }}
                    >
                      <div className="note-card-header">
                        <i className="fas fa-sticky-note"></i>
                        <span className="note-title">{note.title}</span>
                      </div>
                      <p className="note-preview">
                        {note.content.substring(0, 100)}{note.content.length > 100 ? '...' : ''}
                      </p>
                      <div className="note-card-footer">
                        <span className="note-date">{new Date(note.lastModified).toLocaleDateString()}</span>
                        <button 
                          className="note-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm({ type: 'note', item: note });
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Knowledge Popup Modal */}
      {showKnowledgePopup && createPortal(
        <div className="modal-overlay" onClick={() => setShowKnowledgePopup(null)}>
          <div className="knowledge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowKnowledgePopup(null)}>
              <i className="fas fa-times"></i>
            </button>
            <h3>{showKnowledgePopup.title}</h3>
            {showKnowledgePopup.type === 'image' && (
              <img src={showKnowledgePopup.content} alt={showKnowledgePopup.title} className="modal-image" />
            )}
            {(showKnowledgePopup.type === 'text' || showKnowledgePopup.sourceType === 'note') && (
              <div className="modal-text">{showKnowledgePopup.content}</div>
            )}
            {showKnowledgePopup.description && (
              <p className="modal-description"><i className="fas fa-quote-left"></i> {showKnowledgePopup.description}</p>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Orb Editor Modal */}
      {showOrbEditor && createPortal(
        <div className="modal-overlay" onClick={() => setShowOrbEditor(null)}>
          <div className="orb-editor-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Edit Orb</h4>
            
            <div className="editor-section">
              <label>Icon</label>
              <div className="icon-grid">
                {ORB_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    className={`icon-option ${showOrbEditor.iconType === icon.id ? 'selected' : ''}`}
                    onClick={() => {
                      updateOrb(showOrbEditor.id, { iconType: icon.id });
                      setShowOrbEditor({ ...showOrbEditor, iconType: icon.id });
                    }}
                    title={icon.label}
                  >
                    <i className={`fas ${icon.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="editor-section">
              <label>Color</label>
              <div className="color-grid">
                {ORB_COLORS.map(color => (
                  <button
                    key={color}
                    className={`color-option ${showOrbEditor.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      updateOrb(showOrbEditor.id, { color });
                      setShowOrbEditor({ ...showOrbEditor, color });
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="editor-actions">
              <button 
                className="btn btn-danger"
                onClick={() => {
                  removeOrb(showOrbEditor.id);
                  setShowOrbEditor(null);
                }}
              >
                <i className="fas fa-trash"></i> Remove
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowOrbEditor(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Folder Modal (for Received/Notes) */}
      {showFolderModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowFolderModal(false)}>
          <div className="folder-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{editingFolder ? 'Edit Folder' : 'New Folder'}</h4>
            
            <div className="form-field">
              <label>Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Icewind Dale Campaign"
                autoFocus
              />
            </div>
            
            <div className="form-field">
              <label>Color</label>
              <div className="folder-color-grid">
                {FOLDER_COLORS.map(color => (
                  <button
                    key={color}
                    className={`folder-color-btn ${newFolderColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewFolderColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="modal-actions">
              {editingFolder && (
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    removeFolder(editingFolder.id);
                    setShowFolderModal(false);
                    setEditingFolder(null);
                  }}
                >
                  <i className="fas fa-trash"></i> Delete Folder
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setShowFolderModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveFolder}
                disabled={!newFolderName.trim()}
              >
                {editingFolder ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Board Modal (for Knowledge Board) */}
      {showBoardModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowBoardModal(false)}>
          <div className="folder-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{editingBoard ? 'Edit Board' : 'New Board'}</h4>
            
            <div className="form-field">
              <label>Board Name</label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="e.g., Main Quest Board"
                autoFocus
              />
            </div>
            
            <div className="form-field">
              <label>Icon</label>
              <div className="icon-grid">
                {BOARD_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    className={`icon-option ${newBoardIcon === icon.id ? 'selected' : ''}`}
                    onClick={() => setNewBoardIcon(icon.id)}
                    title={icon.label}
                  >
                    <i className={`fas ${icon.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-field">
              <label>Color</label>
              <div className="folder-color-grid">
                {FOLDER_COLORS.map(color => (
                  <button
                    key={color}
                    className={`folder-color-btn ${newBoardColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewBoardColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="modal-actions">
              {editingBoard && (
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    removeKnowledgeBoard(editingBoard.id);
                    setShowBoardModal(false);
                    setEditingBoard(null);
                  }}
                >
                  <i className="fas fa-trash"></i> Delete Board
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setShowBoardModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveBoard}
                disabled={!newBoardName.trim()}
              >
                {editingBoard ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && createPortal(
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Delete {showDeleteConfirm.type === 'knowledge' ? 'Knowledge' : 'Note'}</h4>
            <p>Are you sure you want to delete <strong>{showDeleteConfirm.item.title}</strong>?</p>
            <p className="warning">This will also remove any orbs referencing this item.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  if (showDeleteConfirm.type === 'knowledge') {
                    removePlayerKnowledge(showDeleteConfirm.item.id);
                  } else {
                    removeNote(showDeleteConfirm.item.id);
                  }
                  setShowDeleteConfirm(null);
                }}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add Orb Popup */}
      {showAddOrbPopup && createPortal(
        <div 
          className="orb-editor-overlay"
          onClick={() => {
            setShowAddOrbPopup(false);
            setAddOrbStep('select');
            setSelectedItemForOrb(null);
          }}
        >
          <div 
            className="orb-editor"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>{addOrbStep === 'select' ? 'Add to Knowledge Board' : 'Customize Orb'}</h4>
            
            {addOrbStep === 'select' ? (
              <>
                <div className="orb-editor-section">
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8b7355' }}></i>
                    <input
                      type="text"
                      className="orb-editor-input"
                      style={{ paddingLeft: '36px' }}
                      placeholder="Search..."
                      value={addOrbSearchTerm}
                      onChange={(e) => setAddOrbSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="orb-editor-section">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                      className={`toolbar-btn ${addOrbActiveTab === 'received' ? 'active' : ''}`}
                      style={{ flex: 1, fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => setAddOrbActiveTab('received')}
                    >
                      <i className="fas fa-inbox"></i> Received ({searchedKnowledge.length})
                    </button>
                    <button
                      className={`toolbar-btn ${addOrbActiveTab === 'notes' ? 'active' : ''}`}
                      style={{ flex: 1, fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => setAddOrbActiveTab('notes')}
                    >
                      <i className="fas fa-sticky-note"></i> Notes ({searchedNotes.length})
                    </button>
                  </div>
                </div>

                <div className="orb-editor-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {addOrbActiveTab === 'received' && (
                    <>
                      {searchedKnowledge.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8b7355' }}>
                          <i className="fas fa-inbox" style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}></i>
                          <p>No received content yet</p>
                        </div>
                      ) : (
                        searchedKnowledge.map(item => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              marginBottom: '8px',
                              background: 'rgba(139, 69, 19, 0.05)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleSelectItemForOrb(item, 'knowledge')}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 69, 19, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 69, 19, 0.05)'}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: '#f0e6d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {item.type === 'image' ? (
                                <img src={item.content} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <i className="fas fa-file-alt" style={{ color: '#8b7355' }}></i>
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: 'Cinzel', fontWeight: 600, color: '#5a1e12', marginBottom: '4px' }}>{item.title}</div>
                              <div style={{ fontSize: '11px', color: '#8b7355' }}>{new Date(item.receivedAt).toLocaleDateString()}</div>
                            </div>
                            <i className="fas fa-chevron-right" style={{ color: '#8b7355' }}></i>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {addOrbActiveTab === 'notes' && (
                    <>
                      {searchedNotes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8b7355' }}>
                          <i className="fas fa-sticky-note" style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}></i>
                          <p>No notes yet</p>
                        </div>
                      ) : (
                        searchedNotes.map(note => (
                          <div
                            key={note.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              marginBottom: '8px',
                              background: 'rgba(139, 69, 19, 0.05)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleSelectItemForOrb(note, 'note')}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 69, 19, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 69, 19, 0.05)'}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#f39c12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="fas fa-sticky-note" style={{ color: '#fff' }}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: 'Cinzel', fontWeight: 600, color: '#5a1e12', marginBottom: '4px' }}>{note.title}</div>
                              <div style={{ fontSize: '11px', color: '#8b7355' }}>{note.content.substring(0, 40)}{note.content.length > 40 ? '...' : ''}</div>
                            </div>
                            <i className="fas fa-chevron-right" style={{ color: '#8b7355' }}></i>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>

                <div className="orb-editor-actions">
                  <button 
                    className="orb-editor-done"
                    onClick={() => {
                      setShowAddOrbPopup(false);
                      setAddOrbStep('select');
                      setSelectedItemForOrb(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="orb-editor-section">
                  <label>Title</label>
                  <input
                    type="text"
                    className="orb-editor-input"
                    value={addOrbTitle}
                    onChange={(e) => setAddOrbTitle(e.target.value)}
                    placeholder="Orb label (leave empty to use content title)"
                  />
                </div>
                
                <div className="orb-editor-section">
                  <label>Icon</label>
                  <div className="orb-icon-grid">
                    {ORB_ICONS.map(icon => (
                      <button
                        key={icon.id}
                        className={`orb-icon-option ${addOrbIcon === icon.id ? 'selected' : ''}`}
                        onClick={() => setAddOrbIcon(icon.id)}
                        title={icon.label}
                      >
                        <i className={`fas ${icon.icon}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="orb-editor-section">
                  <label>Color</label>
                  <div className="orb-color-grid">
                    {ORB_COLORS.map(color => (
                      <button
                        key={color}
                        className={`orb-color-option ${addOrbColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setAddOrbColor(color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="orb-editor-actions">
                  <button 
                    className="orb-editor-done"
                    onClick={() => {
                      setAddOrbStep('select');
                      setSelectedItemForOrb(null);
                    }}
                  >
                    Back
                  </button>
                  <button 
                    className="orb-editor-done"
                    onClick={handleAddOrbConfirm}
                  >
                    Add to Board
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AccountJournalManager;

