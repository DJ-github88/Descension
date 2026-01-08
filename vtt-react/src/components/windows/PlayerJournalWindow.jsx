import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import WowWindow from './WowWindow';
import useShareableStore from '../../store/shareableStore';
import useGameStore from '../../store/gameStore';
import { getCustomIconUrl } from '../../utils/assetManager';
import { ASSET_PATHS } from '../../utils/assetManager';
import './PlayerJournalWindow.css';

// List of available background images (from /assets/Backgrounds/)
const BACKGROUND_FILES = [
  'CrystalCave.png',
  'DenseForest.png',
  'DesertTemple.png',
  'Embers.png',
  'Flowers.png',
  'Forest1.png',
  'Forest2.png',
  'Forest3.png',
  'Forest4.png',
  'Frost.png',
  'FrozTemple.png',
  'GloomyCave.png',
  'HazyCave.png',
  'MountainDesert.png',
  'MountainFrost.png',
  'MountainIce.png',
  'mountains1.png',
  'mountains2.png',
  'mountains3.png',
  'mountains4.png',
  'MountainSky.png',
  'NightFrost.png',
  'OpenForest.png',
  'Sky.png',
  'Smoke.png',
  'Spikey Cave.png',
  'Stonehedge.png',
  'Temple.png',
  'Volcano Lake.png',
  'Volcano.png'
];

// Helper to get background image URL
const getBackgroundImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If it's already a full URL or data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('/')) {
    return imagePath;
  }
  // Otherwise, construct path from Backgrounds folder (note: capital B)
  const encodedPath = encodeURIComponent(imagePath);
  return `/assets/Backgrounds/${encodedPath}`;
};


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
  
  // Check for ability categories
  const abilityCategories = ['Arcane', 'Fire', 'Frost', 'Nature', 'Shadow', 'Healing', 
    'Lightning', 'Radiant', 'Necrotic', 'Psychic', 'Force', 'Poison', 'Utility', 'General'];
  if (abilityCategories.some(cat => iconType.includes(cat))) {
    return getCustomIconUrl(iconType, 'abilities');
  }
  
  // Default to creatures
  return getCustomIconUrl(iconType, 'creatures');
};

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
  '#d4af37', // Gold
  '#cd7f32', // Bronze
  '#c0c0c0', // Silver
  '#e74c3c', // Red
  '#3498db', // Blue
  '#2ecc71', // Green
  '#9b59b6', // Purple
  '#f39c12', // Orange
  '#1abc9c', // Teal
  '#e91e63', // Pink
  '#795548', // Brown
  '#607d8b', // Gray
];

// Folder colors
const FOLDER_COLORS = [
  '#d4af37', '#cd7f32', '#8b4513', '#e74c3c', '#3498db', 
  '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#795548'
];

/**
 * Player Journal Window - Knowledge board for organizing shared information
 * Features: Folder organization, drag-to-create orbs, notes, connections
 */
const PlayerJournalWindow = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('board');
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
  const [contextMenu, setContextMenu] = useState(null);
  const [showAddOrbPopup, setShowAddOrbPopup] = useState(false);
  const [addOrbStep, setAddOrbStep] = useState('select'); // 'select' or 'customize'
  const [selectedItemForOrb, setSelectedItemForOrb] = useState(null);
  const [addOrbIcon, setAddOrbIcon] = useState('scroll');
  const [addOrbColor, setAddOrbColor] = useState('#d4af37');
  const [addOrbTitle, setAddOrbTitle] = useState('');
  const [addOrbSearchTerm, setAddOrbSearchTerm] = useState('');
  const [addOrbActiveTab, setAddOrbActiveTab] = useState('received');
  const [addOrbFolderId, setAddOrbFolderId] = useState(null);
  const [showAddOrbFolderDropdown, setShowAddOrbFolderDropdown] = useState(false);
  const addOrbFolderDropdownRef = useRef(null);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [backgroundInput, setBackgroundInput] = useState('');
  const [availableBackgrounds, setAvailableBackgrounds] = useState([]);
  const [loadingBackgrounds, setLoadingBackgrounds] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [orbEditorLabel, setOrbEditorLabel] = useState('');
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const [showReceivedFolderDropdown, setShowReceivedFolderDropdown] = useState(false);
  const folderDropdownRef = useRef(null);
  const receivedFolderDropdownRef = useRef(null);
  const boardRef = useRef(null);
  
  const isGMMode = useGameStore(state => state.isGMMode);
  
  const {
    playerKnowledge,
    playerNotes,
    knowledgeOrbs,
    knowledgeConnections,
    journalFolders,
    knowledgeBoards,
    currentFolderId,
    currentBoardId,
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
    getBoardBackground,
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

  // Filter orbs based on current BOARD (separate from folders)
  const filteredOrbs = useMemo(() => {
    if (!currentBoardId) return knowledgeOrbs;
    return knowledgeOrbs.filter(o => o.boardId === currentBoardId);
  }, [knowledgeOrbs, currentBoardId]);

  // Filter for add orb popup
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

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Close folder dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (folderDropdownRef.current && !folderDropdownRef.current.contains(e.target)) {
        setShowFolderDropdown(false);
      }
      if (addOrbFolderDropdownRef.current && !addOrbFolderDropdownRef.current.contains(e.target)) {
        setShowAddOrbFolderDropdown(false);
      }
      if (receivedFolderDropdownRef.current && !receivedFolderDropdownRef.current.contains(e.target)) {
        setShowReceivedFolderDropdown(false);
      }
    };
    if (showFolderDropdown || showAddOrbFolderDropdown || showReceivedFolderDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showFolderDropdown, showAddOrbFolderDropdown, showReceivedFolderDropdown]);

  // Tabs for the journal
  const tabs = [
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
      
      // Get the actual board dimensions - use scrollWidth/scrollHeight for full area
      // This ensures orbs can move across the entire visible board area
      const boardElement = boardRef.current;
      const boardWidth = boardElement ? Math.max(boardElement.scrollWidth, boardElement.clientWidth, boardRect.width) : boardRect.width;
      const boardHeight = boardElement ? Math.max(boardElement.scrollHeight, boardElement.clientHeight, boardRect.height) : boardRect.height;
      
      // Allow orbs to move anywhere in the board area (accounting for orb size)
      const orbSize = 60;
      const maxX = Math.max(0, boardWidth - orbSize);
      const maxY = Math.max(0, boardHeight - orbSize);
      
      const newX = Math.max(0, Math.min(maxX, startOrbX + (moveEvent.clientX - startX)));
      const newY = Math.max(0, Math.min(maxY, startOrbY + (moveEvent.clientY - startY)));
      
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

  // Handle dropping knowledge/note onto the board
  const handleBoardDrop = useCallback((e) => {
    e.preventDefault();
    
    const knowledgeId = e.dataTransfer.getData('knowledge/id');
    const noteId = e.dataTransfer.getData('note/id');
    const sourceType = e.dataTransfer.getData('source/type');
    
    if (!knowledgeId && !noteId) return;
    
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;
    
    // Use the full board area for dropping
    const boardWidth = boardRef.current?.scrollWidth || boardRect.width;
    const boardHeight = boardRef.current?.scrollHeight || boardRect.height;
    
    const x = Math.max(0, Math.min(boardWidth - 60, e.clientX - boardRect.left - 30));
    const y = Math.max(0, Math.min(boardHeight - 60, e.clientY - boardRect.top - 30));
    
    if (noteId) {
      addKnowledgeOrb(noteId, { x, y }, 'note', 'sticky-note', '#f39c12');
    } else if (knowledgeId) {
      addKnowledgeOrb(knowledgeId, { x, y }, 'knowledge');
    }
  }, [addKnowledgeOrb]);

  const handleBoardDragOver = (e) => {
    e.preventDefault();
  };

  // Handle orb right-click
  const handleOrbContextMenu = (e, orb) => {
    e.preventDefault();
    e.stopPropagation();
    const content = getContentByOrb(orb);
    setOrbEditorLabel(orb.label || content?.title || '');
    setShowOrbEditor(orb);
  };

  // Handle orb double-click to view content
  const handleOrbDoubleClick = (orb) => {
    const content = getContentByOrb(orb);
    if (content) {
      setShowKnowledgePopup({ ...content, sourceType: orb.sourceType });
    }
  };

  // Handle starting connection mode from an orb
  const handleStartConnection = (orbId) => {
    setConnectingFrom(orbId);
  };

  // Handle adding item from popup to board
  const handleAddOrbConfirm = useCallback(() => {
    if (!selectedItemForOrb || !boardRef?.current) return;

    // Calculate position in center of visible board area
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

    // Set custom label if provided
    if (addOrbTitle.trim()) {
      updateOrb(orbId, { label: addOrbTitle.trim() });
    }

    // Set folder if selected
    if (addOrbFolderId) {
      updateOrb(orbId, { folderId: addOrbFolderId });
    }

    // Reset and close
    setShowAddOrbPopup(false);
    setAddOrbStep('select');
    setSelectedItemForOrb(null);
    setAddOrbIcon('scroll');
    setAddOrbColor('#d4af37');
    setAddOrbTitle('');
    setAddOrbFolderId(null);
  }, [selectedItemForOrb, addOrbIcon, addOrbColor, addOrbTitle, addOrbFolderId, addKnowledgeOrb, updateOrb]);

  // Handle selecting item for new orb
  const handleSelectItemForOrb = (item, type) => {
    const content = type === 'note' ? item : item;
    setSelectedItemForOrb({ ...item, sourceType: type });
    setAddOrbTitle(content?.title || '');
    
    // Auto-select icon and color based on type
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

  // Handle folder/board creation/update
  const handleSaveFolder = () => {
    if (!newFolderName.trim()) return;
    
    // Check if we're working with a board (from the Knowledge Board tab)
    const isBoard = editingFolder?.isBoard;
    
    if (isBoard) {
      // Handle board save
      if (editingFolder?.id) {
        // Editing existing board
        updateKnowledgeBoard(editingFolder.id, { name: newFolderName, color: newFolderColor });
      } else {
        // Creating new board
        const newId = addKnowledgeBoard(newFolderName, newFolderColor);
        setCurrentBoard(newId); // Auto-select the new board
      }
    } else {
      // Handle folder save
      if (editingFolder?.id) {
        // Editing existing folder
        updateFolder(editingFolder.id, { name: newFolderName, color: newFolderColor });
      } else {
        // Creating new folder
        addFolder(newFolderName, newFolderColor);
      }
    }
    
    setShowFolderModal(false);
    setNewFolderName('');
    setNewFolderColor(FOLDER_COLORS[0]);
    setEditingFolder(null);
  };

  // Handle note creation/update
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

  // Context menu handler
  const handleItemContextMenu = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
      type
    });
  };

  // Get current folder name for display (for Received/Notes tabs)
  const getCurrentFolderName = () => {
    if (!currentFolderId) return 'All';
    const folder = journalFolders.find(f => f.id === currentFolderId);
    return folder ? folder.name : 'All';
  };

  // Get current board name for display (for Knowledge Board tab)
  const getCurrentBoardName = () => {
    if (!currentBoardId) return 'All';
    const board = knowledgeBoards.find(b => b.id === currentBoardId);
    return board ? board.name : 'All';
  };

  // Render knowledge board tab
  const renderBoardTab = () => {
    const boardBackground = getBoardBackground();
    const backgroundUrl = boardBackground ? getBackgroundImageUrl(boardBackground.url) : null;
    
    return (
    <div className="journal-board-container">
      <div className="journal-board-toolbar">
        <div className="folder-dropdown-container" ref={folderDropdownRef}>
          <button
            className="toolbar-btn folder-selector"
            onClick={(e) => {
              e.stopPropagation();
              setShowFolderDropdown(!showFolderDropdown);
            }}
            title="Select knowledge board"
          >
            <i className="fas fa-project-diagram"></i>
            <span>{getCurrentBoardName()}</span>
            <i className={`fas fa-chevron-${showFolderDropdown ? 'up' : 'down'}`} style={{ fontSize: '10px', marginLeft: '4px' }}></i>
          </button>
          {showFolderDropdown && (
            <div className="folder-dropdown-menu">
              <button
                className={`folder-dropdown-item ${!currentBoardId ? 'selected' : ''}`}
                onClick={() => {
                  setCurrentBoard(null);
                  setShowFolderDropdown(false);
                }}
              >
                <i className="fas fa-globe"></i>
                <span>All</span>
              </button>
              {knowledgeBoards.map(board => (
                <button
                  key={board.id}
                  className={`folder-dropdown-item ${currentBoardId === board.id ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentBoard(board.id);
                    setShowFolderDropdown(false);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Edit board - reuse folder modal for boards
                    setEditingFolder({ ...board, isBoard: true });
                    setNewFolderName(board.name);
                    setNewFolderColor(board.color);
                    setShowFolderModal(true);
                    setShowFolderDropdown(false);
                  }}
                >
                  <i className={`fas ${board.icon || 'fa-project-diagram'}`} style={{ color: board.color }}></i>
                  <span>{board.name}</span>
                </button>
              ))}
              <div className="folder-dropdown-divider"></div>
              <button
                className="folder-dropdown-item add-folder"
                onClick={() => {
                  setEditingFolder({ isBoard: true }); // Mark as board creation
                  setNewFolderName('');
                  setNewFolderColor(FOLDER_COLORS[0]);
                  setShowFolderModal(true);
                  setShowFolderDropdown(false);
                }}
              >
                <i className="fas fa-plus"></i>
                <span>New Board</span>
              </button>
            </div>
          )}
        </div>
        <button
          className="toolbar-btn primary"
          onClick={() => {
            setShowAddOrbPopup(true);
            setAddOrbStep('select');
            setSelectedItemForOrb(null);
            setAddOrbSearchTerm('');
            setAddOrbActiveTab('received');
            setAddOrbFolderId(null);
          }}
          title="Add new orb to the board"
        >
          <i className="fas fa-plus-circle"></i>
          Add Orb
        </button>
        <button
          className={`toolbar-btn ${connectingFrom ? 'active' : ''}`}
          onClick={() => setConnectingFrom(connectingFrom ? null : 'waiting')}
          title="Connect orbs - click two orbs to connect them"
        >
          <i className="fas fa-link"></i>
          {connectingFrom ? 'Cancel' : 'Connect'}
        </button>
        <button
          className="toolbar-btn"
          onClick={() => {
            const currentBackground = getBoardBackground();
            setBackgroundInput(currentBackground?.url || '');
            setShowBackgroundModal(true);
          }}
          title={currentBoardId ? "Set board background image" : "Select a board first to set background"}
          disabled={!currentBoardId}
        >
          <i className="fas fa-image"></i>
          Background
        </button>
        <span className="toolbar-hint">
          {connectingFrom 
            ? 'Click two orbs to connect them' 
            : 'Click "Add Orb" to add content, or drag items from other tabs'}
        </span>
      </div>
      
      <div 
        ref={boardRef}
        className="journal-board"
        style={backgroundUrl ? {
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
        onDrop={handleBoardDrop}
        onDragOver={handleBoardDragOver}
      >
        {/* Connection Lines */}
        <svg className="connection-lines">
          {knowledgeConnections
            .filter(conn => {
              // Only show connections between orbs that are both in the current folder
              const fromOrb = knowledgeOrbs.find(o => o.id === conn.fromOrbId);
              const toOrb = knowledgeOrbs.find(o => o.id === conn.toOrbId);
              if (!fromOrb || !toOrb) return false;
              
              // If no board selected, show all connections
              if (!currentBoardId) return true;
              
              // If board selected, only show connections where both orbs are on that board
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
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="connection-line"
                />
                {/* Clickable area for removing connection */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="connection-line-hitbox"
                  onClick={() => removeConnection(conn.id)}
                />
                {conn.label && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 5}
                    className="connection-label"
                  >
                    {conn.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Knowledge Orbs */}
        {filteredOrbs.map(orb => {
          const content = getContentByOrb(orb);
          const hasCustomIcon = isCustomIcon(orb.iconType);
          const customIconUrl = hasCustomIcon ? getOrbIconUrl(orb.iconType) : null;
          const iconData = !hasCustomIcon ? (ORB_ICONS.find(i => i.id === orb.iconType) || ORB_ICONS[0]) : null;
          const displayLabel = orb.label || content?.title || '???';
          
          return (
            <div
              key={orb.id}
              className={`knowledge-orb ${draggedOrb === orb.id ? 'dragging' : ''} ${connectingFrom === orb.id ? 'connecting' : ''} ${connectingFrom && connectingFrom !== orb.id ? 'connectable' : ''}`}
              style={{
                left: orb.position.x,
                top: orb.position.y,
                '--orb-color': orb.color
              }}
              onMouseDown={(e) => handleOrbMouseDown(e, orb)}
              onContextMenu={(e) => handleOrbContextMenu(e, orb)}
              onDoubleClick={() => handleOrbDoubleClick(orb)}
              title={displayLabel}
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
              <span className="orb-label">{displayLabel}</span>
            </div>
          );
        })}
        
        {filteredOrbs.length === 0 && (
          <div className="board-empty-state">
            <i className="fas fa-project-diagram"></i>
            <p>Your knowledge board is empty</p>
            <span>Drag items from the Received or Notes tab to organize your thoughts</span>
          </div>
        )}
      </div>
    </div>
    );
  };

  // Render received knowledge tab
  const renderReceivedTab = () => {

    // Handle dropping item on folder
    const handleFolderDrop = (e, folderId) => {
      e.preventDefault();
      e.stopPropagation();
      
      const knowledgeId = e.dataTransfer.getData('knowledge/id');
      const noteId = e.dataTransfer.getData('note/id');
      
      if (knowledgeId) {
        moveKnowledgeToFolder(knowledgeId, folderId);
      } else if (noteId) {
        moveNoteToFolder(noteId, folderId);
      }
    };

    const handleFolderDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleFolderDragEnter = (e, folderId) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggedOverFolder(folderId);
    };

    const handleFolderDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggedOverFolder(null);
    };

    // Get items in each folder
    const getItemsInFolder = (folderId) => {
      if (folderId === null) {
        return playerKnowledge.filter(k => !k.folderId);
      }
      return playerKnowledge.filter(k => k.folderId === folderId);
    };

    return (
      <div className="journal-received-container">
        {/* Folder Toolbar */}
        <div className="received-toolbar">
          <div className="folder-dropdown-container" ref={receivedFolderDropdownRef}>
            <button
              className="toolbar-btn folder-selector"
              onClick={(e) => {
                e.stopPropagation();
                setShowReceivedFolderDropdown(!showReceivedFolderDropdown);
              }}
              title="Filter by folder"
            >
              <i className="fas fa-folder"></i>
              <span>{getCurrentFolderName()}</span>
              <i className={`fas fa-chevron-${showReceivedFolderDropdown ? 'up' : 'down'}`} style={{ fontSize: '10px', marginLeft: '4px' }}></i>
            </button>
            {showReceivedFolderDropdown && (
              <div className="folder-dropdown-menu">
                <button
                  className={`folder-dropdown-item ${!currentFolderId ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentFolder(null);
                    setShowReceivedFolderDropdown(false);
                  }}
                >
                  <i className="fas fa-globe"></i>
                  <span>All</span>
                </button>
                {journalFolders.map(folder => (
                  <button
                    key={folder.id}
                    className={`folder-dropdown-item ${currentFolderId === folder.id ? 'selected' : ''}`}
                    onClick={() => {
                      setCurrentFolder(folder.id);
                      setShowReceivedFolderDropdown(false);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingFolder(folder);
                      setNewFolderName(folder.name);
                      setNewFolderColor(folder.color);
                      setShowFolderModal(true);
                      setShowReceivedFolderDropdown(false);
                    }}
                  >
                    <i className={`fas ${folder.icon || 'fa-folder'}`} style={{ color: folder.color }}></i>
                    <span>{folder.name}</span>
                  </button>
                ))}
                <div className="folder-dropdown-divider"></div>
                <button
                  className="folder-dropdown-item add-folder"
                  onClick={() => {
                    setEditingFolder(null);
                    setNewFolderName('');
                    setNewFolderColor(FOLDER_COLORS[0]);
                    setShowFolderModal(true);
                    setShowReceivedFolderDropdown(false);
                  }}
                >
                  <i className="fas fa-plus"></i>
                  <span>New Folder</span>
                </button>
              </div>
            )}
          </div>
          <button
            className="toolbar-btn primary"
            onClick={() => {
              setEditingFolder(null);
              setNewFolderName('');
              setNewFolderColor(FOLDER_COLORS[0]);
              setShowFolderModal(true);
            }}
            title="Create a new folder"
          >
            <i className="fas fa-folder-plus"></i>
            New Folder
          </button>
        </div>

        {/* Folders List */}
        {!currentFolderId && (
          <div className="received-folders-list">
            {journalFolders.map(folder => {
              const itemsInFolder = getItemsInFolder(folder.id);
              return (
                <div
                  key={folder.id}
                  className={`received-folder ${draggedOverFolder === folder.id ? 'drag-over' : ''}`}
                  onDrop={(e) => {
                    handleFolderDrop(e, folder.id);
                    setDraggedOverFolder(null);
                  }}
                  onDragOver={handleFolderDragOver}
                  onDragEnter={(e) => handleFolderDragEnter(e, folder.id)}
                  onDragLeave={handleFolderDragLeave}
                >
                  <div className="received-folder-header">
                    <i className={`fas ${folder.icon || 'fa-folder'}`} style={{ color: folder.color }}></i>
                    <span className="received-folder-name">{folder.name}</span>
                    <span className="received-folder-count">({itemsInFolder.length})</span>
                  </div>
                  {itemsInFolder.length > 0 && (
                    <div className="received-folder-items">
                      {itemsInFolder.map(knowledge => (
                        <div
                          key={knowledge.id}
                          className="received-item"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('knowledge/id', knowledge.id);
                            e.dataTransfer.setData('source/type', 'knowledge');
                          }}
                          onClick={() => setShowKnowledgePopup({ ...knowledge, sourceType: 'knowledge' })}
                          onContextMenu={(e) => handleItemContextMenu(e, knowledge, 'knowledge')}
                        >
                          <div className="received-item-icon">
                            {knowledge.type === 'image' ? (
                              <img src={knowledge.content} alt="" />
                            ) : (
                              <i className="fas fa-file-alt"></i>
                            )}
                          </div>
                          <div className="received-item-info">
                            <span className="received-item-title">{knowledge.title}</span>
                            <span className="received-item-date">
                              {new Date(knowledge.receivedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <i className="fas fa-grip-vertical drag-handle"></i>
                        </div>
                      ))}
                    </div>
                  )}
                  {itemsInFolder.length === 0 && (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#8b7355', fontStyle: 'italic', fontSize: '12px' }}>
                      Drag items here to organize
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Uncategorized Items */}
        {!currentFolderId && (
          <div 
            className={`received-folder uncategorized ${draggedOverFolder === null ? 'drag-over' : ''}`}
            onDrop={(e) => {
              handleFolderDrop(e, null);
              setDraggedOverFolder(null);
            }}
            onDragOver={handleFolderDragOver}
            onDragEnter={(e) => handleFolderDragEnter(e, null)}
            onDragLeave={handleFolderDragLeave}
          >
            <div className="received-folder-header">
              <i className="fas fa-globe"></i>
              <span className="received-folder-name">Uncategorized</span>
              <span className="received-folder-count">({getItemsInFolder(null).length})</span>
            </div>
            {getItemsInFolder(null).length > 0 && (
              <div className="received-folder-items">
                {getItemsInFolder(null).map(knowledge => (
                  <div
                    key={knowledge.id}
                    className="received-item"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('knowledge/id', knowledge.id);
                      e.dataTransfer.setData('source/type', 'knowledge');
                    }}
                    onClick={() => setShowKnowledgePopup({ ...knowledge, sourceType: 'knowledge' })}
                    onContextMenu={(e) => handleItemContextMenu(e, knowledge, 'knowledge')}
                  >
                    <div className="received-item-icon">
                      {knowledge.type === 'image' ? (
                        <img src={knowledge.content} alt="" />
                      ) : (
                        <i className="fas fa-file-alt"></i>
                      )}
                    </div>
                    <div className="received-item-info">
                      <span className="received-item-title">{knowledge.title}</span>
                      <span className="received-item-date">
                        {new Date(knowledge.receivedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <i className="fas fa-grip-vertical drag-handle"></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filtered Items (when a folder is selected) */}
        {currentFolderId && (
          <div className="received-list">
            {filteredKnowledge.length === 0 ? (
              <div className="received-empty-state">
                <i className="fas fa-inbox"></i>
                <p>No items in this folder</p>
                <span>Try selecting "All" or drag items into this folder</span>
              </div>
            ) : (
              filteredKnowledge.map(knowledge => (
                <div
                  key={knowledge.id}
                  className="received-item"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('knowledge/id', knowledge.id);
                    e.dataTransfer.setData('source/type', 'knowledge');
                  }}
                  onClick={() => setShowKnowledgePopup({ ...knowledge, sourceType: 'knowledge' })}
                  onContextMenu={(e) => handleItemContextMenu(e, knowledge, 'knowledge')}
                >
                  <div className="received-item-icon">
                    {knowledge.type === 'image' ? (
                      <img src={knowledge.content} alt="" />
                    ) : (
                      <i className="fas fa-file-alt"></i>
                    )}
                  </div>
                  <div className="received-item-info">
                    <span className="received-item-title">{knowledge.title}</span>
                    <span className="received-item-date">
                      {new Date(knowledge.receivedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <i className="fas fa-grip-vertical drag-handle"></i>
                </div>
              ))
            )}
          </div>
        )}

        {/* Empty State (when no folder selected and no folders exist and no items) */}
        {!currentFolderId && journalFolders.length === 0 && playerKnowledge.length === 0 && (
          <div className="received-empty-state">
            <i className="fas fa-inbox"></i>
            <p>No knowledge received yet</p>
            <span>The GM will share information with you during the game</span>
          </div>
        )}
      </div>
    );
  };

  // Render notes tab with create/edit functionality
  const renderNotesTab = () => (
    <div className="journal-notes-container">
      {/* Note Editor */}
      <div className="note-editor">
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
          placeholder="Write your note here...

You can use this space to:
• Track your character's thoughts
• Note important NPCs and locations
• Plan your next moves
• Keep track of quests and objectives

Drag notes to the Knowledge Board to create visual connections!"
          rows={8}
        />
        <div className="note-editor-actions">
          {editingNote && (
            <button 
              className="note-cancel-btn"
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
            className="note-save-btn"
            onClick={handleSaveNote}
            disabled={!noteTitle.trim()}
          >
            <i className="fas fa-save"></i>
            {editingNote ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </div>
      
      {/* Notes List */}
      <div className="notes-list">
        <h4>Your Notes {filteredNotes.length > 0 && `(${filteredNotes.length})`}</h4>
        {filteredNotes.length === 0 ? (
          <div className="notes-empty-state">
            <i className="fas fa-sticky-note"></i>
            <p>No notes yet</p>
            <span>Create a note above to get started</span>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              className="note-item"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('note/id', note.id);
                e.dataTransfer.setData('source/type', 'note');
              }}
              onClick={() => {
                setEditingNote(note);
                setNoteTitle(note.title);
                setNoteContent(note.content);
              }}
              onContextMenu={(e) => handleItemContextMenu(e, note, 'note')}
            >
              <div className="note-item-icon">
                <i className="fas fa-sticky-note"></i>
              </div>
              <div className="note-item-info">
                <span className="note-item-title">{note.title}</span>
                <span className="note-item-preview">
                  {note.content.substring(0, 50)}{note.content.length > 50 ? '...' : ''}
                </span>
                <span className="note-item-date">
                  {new Date(note.lastModified).toLocaleDateString()}
                </span>
              </div>
              <i className="fas fa-grip-vertical drag-handle"></i>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'board':
        return renderBoardTab();
      case 'received':
        return renderReceivedTab();
      case 'notes':
        return renderNotesTab();
      default:
        return null;
    }
  };

  // Don't show to GM
  if (isGMMode) {
    return (
      <WowWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Player Journal"
        defaultSize={{ width: 800, height: 600 }}
        defaultPosition={{ x: 100, y: 100 }}
      >
        <div className="journal-gm-notice">
          <i className="fas fa-user-secret"></i>
          <p>This window is for players only</p>
          <span>As the GM, use the Campaign Manager to share content with players</span>
        </div>
      </WowWindow>
    );
  }

  return (
    <>
      <WowWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Player Journal"
        defaultSize={{ width: 950, height: 700 }}
        defaultPosition={{ x: 100, y: 100 }}
        customHeader={
          <div className="spellbook-tab-container">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        }
      >
        <div className="player-journal-content">
          {renderTabContent()}
        </div>
      </WowWindow>
      
      {/* Knowledge Popup */}
      {showKnowledgePopup && createPortal(
        <div 
          className="knowledge-popup-overlay"
          onClick={() => setShowKnowledgePopup(null)}
        >
          <div 
            className="knowledge-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="knowledge-popup-close"
              onClick={() => setShowKnowledgePopup(null)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <h3>{showKnowledgePopup.title}</h3>
            
            {showKnowledgePopup.type === 'image' && (
              <img 
                src={showKnowledgePopup.content} 
                alt={showKnowledgePopup.title}
                className="knowledge-popup-image"
              />
            )}
            
            {(showKnowledgePopup.type === 'text' || showKnowledgePopup.sourceType === 'note') && (
              <div className="knowledge-popup-text">
                {showKnowledgePopup.content}
              </div>
            )}
            
            {showKnowledgePopup.description && (
              <p className="knowledge-popup-description">
                <i className="fas fa-quote-left"></i>
                {showKnowledgePopup.description}
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
      
      {/* Orb Editor */}
      {showOrbEditor && createPortal(
        <div 
          className="orb-editor-overlay"
          onClick={() => setShowOrbEditor(null)}
        >
          <div 
            className="orb-editor"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Edit Knowledge Orb</h4>
            
            <div className="orb-editor-section">
              <label>Title</label>
              <input
                type="text"
                className="orb-editor-input"
                value={orbEditorLabel}
                onChange={(e) => setOrbEditorLabel(e.target.value)}
                onBlur={() => {
                  updateOrb(showOrbEditor.id, { label: orbEditorLabel.trim() || null });
                  setShowOrbEditor({ ...showOrbEditor, label: orbEditorLabel.trim() || null });
                }}
                placeholder="Orb label (leave empty to use content title)"
              />
            </div>
            
            <div className="orb-editor-section">
              <label>Icon</label>
              <div className="orb-icon-grid">
                {ORB_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    className={`orb-icon-option ${showOrbEditor.iconType === icon.id ? 'selected' : ''}`}
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
            
            <div className="orb-editor-section">
              <label>Color</label>
              <div className="orb-color-grid">
                {ORB_COLORS.map(color => (
                  <button
                    key={color}
                    className={`orb-color-option ${showOrbEditor.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      updateOrb(showOrbEditor.id, { color });
                      setShowOrbEditor({ ...showOrbEditor, color });
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="orb-editor-section">
              <label>Actions</label>
              <button
                className="orb-action-btn connect"
                onClick={() => {
                  setShowOrbEditor(null);
                  handleStartConnection(showOrbEditor.id);
                }}
              >
                <i className="fas fa-link"></i>
                Connect to Another
              </button>
            </div>
            
            <div className="orb-editor-actions">
              <button 
                className="orb-editor-delete"
                onClick={() => {
                  removeOrb(showOrbEditor.id);
                  setShowOrbEditor(null);
                }}
              >
                <i className="fas fa-trash"></i>
                Remove from Board
              </button>
              <button 
                className="orb-editor-done"
                onClick={() => {
                  updateOrb(showOrbEditor.id, { label: orbEditorLabel.trim() || null });
                  setShowOrbEditor(null);
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Folder/Board Modal */}
      {showFolderModal && createPortal(
        <div 
          className="folder-modal-overlay"
          onClick={() => setShowFolderModal(false)}
        >
          <div 
            className="folder-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>
              {editingFolder?.isBoard 
                ? (editingFolder?.id ? 'Edit Board' : 'New Board')
                : (editingFolder?.id ? 'Edit Folder' : 'New Folder')
              }
            </h4>
            
            <div className="folder-modal-field">
              <label>Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={editingFolder?.isBoard ? "Board name..." : "Folder name..."}
                autoFocus
              />
            </div>
            
            <div className="folder-modal-field">
              <label>Color</label>
              <div className="folder-color-grid">
                {FOLDER_COLORS.map(color => (
                  <button
                    key={color}
                    className={`folder-color-option ${newFolderColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewFolderColor(color)}
                  />
                ))}
              </div>
            </div>
            
            <div className="folder-modal-actions">
              {editingFolder?.id && (
                <button 
                  className="folder-delete-btn"
                  onClick={() => {
                    if (editingFolder.isBoard) {
                      removeKnowledgeBoard(editingFolder.id);
                    } else {
                      removeFolder(editingFolder.id);
                    }
                    setShowFolderModal(false);
                    setEditingFolder(null);
                  }}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
              )}
              <button 
                className="folder-cancel-btn"
                onClick={() => {
                  setShowFolderModal(false);
                  setEditingFolder(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="folder-save-btn"
                onClick={handleSaveFolder}
                disabled={!newFolderName.trim()}
              >
                {editingFolder?.id ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Context Menu */}
      {contextMenu && createPortal(
        <div 
          className="journal-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => {
            if (contextMenu.type === 'knowledge') {
              setShowKnowledgePopup({ ...contextMenu.item, sourceType: 'knowledge' });
            } else {
              setEditingNote(contextMenu.item);
              setNoteTitle(contextMenu.item.title);
              setNoteContent(contextMenu.item.content);
              setActiveTab('notes');
            }
            setContextMenu(null);
          }}>
            <i className="fas fa-eye"></i>
            View
          </button>
          
          {journalFolders.length > 0 && (
            <div className="context-menu-submenu">
              <button>
                <i className="fas fa-folder"></i>
                Move to Folder
                <i className="fas fa-chevron-right"></i>
              </button>
              <div className="context-submenu-items">
                <button onClick={() => {
                  if (contextMenu.type === 'knowledge') {
                    moveKnowledgeToFolder(contextMenu.item.id, null);
                  } else {
                    moveNoteToFolder(contextMenu.item.id, null);
                  }
                  setContextMenu(null);
                }}>
                  <i className="fas fa-globe"></i>
                  Uncategorized
                </button>
                {journalFolders.map(folder => (
                  <button 
                    key={folder.id}
                    onClick={() => {
                      if (contextMenu.type === 'knowledge') {
                        moveKnowledgeToFolder(contextMenu.item.id, folder.id);
                      } else {
                        moveNoteToFolder(contextMenu.item.id, folder.id);
                      }
                      setContextMenu(null);
                    }}
                  >
                    <i className="fas fa-folder" style={{ color: folder.color }}></i>
                    {folder.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button 
            className="context-menu-danger"
            onClick={() => {
              if (contextMenu.type === 'knowledge') {
                removePlayerKnowledge(contextMenu.item.id);
              } else {
                removeNote(contextMenu.item.id);
              }
              setContextMenu(null);
            }}
          >
            <i className="fas fa-trash"></i>
            Delete
          </button>
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
                {/* Search */}
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

                {/* Tabs */}
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

                {/* Content List */}
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
                
                <div className="orb-editor-section">
                  <label>Folder</label>
                  <div className="folder-dropdown-container" ref={addOrbFolderDropdownRef} style={{ position: 'relative' }}>
                    <button
                      className="orb-editor-input"
                      style={{ textAlign: 'left', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddOrbFolderDropdown(!showAddOrbFolderDropdown);
                      }}
                    >
                      <i className="fas fa-folder" style={{ marginRight: '8px' }}></i>
                      {addOrbFolderId 
                        ? journalFolders.find(f => f.id === addOrbFolderId)?.name || 'Select folder'
                        : 'No folder (All)'}
                      <i className={`fas fa-chevron-${showAddOrbFolderDropdown ? 'up' : 'down'}`} style={{ float: 'right', fontSize: '10px', marginTop: '4px' }}></i>
                    </button>
                    {showAddOrbFolderDropdown && (
                      <div className="folder-dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1001 }}>
                        <button
                          className={`folder-dropdown-item ${!addOrbFolderId ? 'selected' : ''}`}
                          onClick={() => {
                            setAddOrbFolderId(null);
                            setShowAddOrbFolderDropdown(false);
                          }}
                        >
                          <i className="fas fa-globe"></i>
                          <span>No folder (All)</span>
                        </button>
                        {journalFolders.map(folder => (
                          <button
                            key={folder.id}
                            className={`folder-dropdown-item ${addOrbFolderId === folder.id ? 'selected' : ''}`}
                            onClick={() => {
                              setAddOrbFolderId(folder.id);
                              setShowAddOrbFolderDropdown(false);
                            }}
                          >
                            <i className={`fas ${folder.icon || 'fa-folder'}`} style={{ color: folder.color }}></i>
                            <span>{folder.name}</span>
                          </button>
                        ))}
                        <div className="folder-dropdown-divider"></div>
                        <button
                          className="folder-dropdown-item add-folder"
                          onClick={() => {
                            setEditingFolder(null);
                            setNewFolderName('');
                            setNewFolderColor(FOLDER_COLORS[0]);
                            setShowFolderModal(true);
                            setShowAddOrbFolderDropdown(false);
                          }}
                        >
                          <i className="fas fa-plus"></i>
                          <span>New Folder</span>
                        </button>
                      </div>
                    )}
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

      {/* Background Selection Modal */}
      {showBackgroundModal && createPortal(
        <div 
          className="background-modal-overlay"
          onClick={() => setShowBackgroundModal(false)}
        >
          <div 
            className="background-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="background-modal-header">
              <h4>Set Board Background</h4>
              <button 
                className="background-modal-close"
                onClick={() => setShowBackgroundModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="background-modal-content">
              <label>Select Background Image</label>
              <div className="background-grid">
                <div 
                  className={`background-option ${!getBoardBackground() ? 'selected' : ''}`}
                  onClick={() => {
                    clearBoardBackground();
                    setShowBackgroundModal(false);
                  }}
                  title="No background"
                >
                  <div className="background-preview no-background">
                    <i className="fas fa-ban"></i>
                  </div>
                  <span>None</span>
                </div>
                {BACKGROUND_FILES.map(bgFile => {
                  const bgUrl = `/assets/Backgrounds/${encodeURIComponent(bgFile)}`;
                  const currentBackground = getBoardBackground();
                  const isSelected = currentBackground?.url === bgFile;
                  return (
                    <div
                      key={bgFile}
                      className={`background-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setBoardBackground({ url: bgFile, name: bgFile.replace('.png', '').replace(/([A-Z])/g, ' $1').trim() });
                        setShowBackgroundModal(false);
                      }}
                      title={bgFile.replace('.png', '').replace(/([A-Z])/g, ' $1').trim()}
                    >
                      <div className="background-preview">
                        <img 
                          src={bgUrl} 
                          alt={bgFile}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<i class="fas fa-image"></i>';
                          }}
                        />
                      </div>
                      <span>{bgFile.replace('.png', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="background-modal-actions">
              <button 
                className="background-modal-cancel"
                onClick={() => setShowBackgroundModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PlayerJournalWindow;
