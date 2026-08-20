import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import MythrillWindow from './MythrillWindow';
import useShareableStore from '../../store/shareableStore';
import useGameStore from '../../store/gameStore';
import { getCustomIconUrl } from '../../utils/assetManager';
import { BUILTIN_SUBREGION_MAPS, getCustomMaps } from '../../data/subregionMaps';
import campaignService from '../../services/campaignService';
import useFeatureFlag from '../../hooks/useFeatureFlag';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import RichLoreText from '../common/RichLoreText';
import CustomLineageWizard from '../world/CustomLineageWizard';
import useCustomLineageStore from '../../store/customLineageStore';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import './PlayerJournalWindow.css';

const CANONICAL_MAP_PRESETS = [
  { id: 'mythril', name: 'Mythrill - Planetary World Map', image: '/assets/images/backgrounds/Mythril.jpeg', type: 'World Master Map' },
  { id: 'nordhalla', name: 'Nordhalla Continental Map', image: '/assets/images/backgrounds/nordhalla.jpeg', type: 'Canonical Realm' },
  { id: 'nordhalla-glacier-heart', name: 'Rime-Spire Peaks Subregion', image: '/assets/images/backgrounds/rime-spire-peaks.jpg', type: 'Subregion Map' },
  { id: 'frostwood-reach', name: 'Frostwood Reach', image: '/assets/images/backgrounds/Mythril.jpeg', type: 'Canonical Realm' },
  { id: 'sundale', name: 'Sundale', image: '/assets/images/backgrounds/Mythril.jpeg', type: 'Canonical Realm' }
];

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


// Check if an icon is a custom path (creature/ability icon, data URL, http, etc.)
const isCustomIcon = (iconType) => {
  return Boolean(
    iconType && (
      iconType.includes('/') ||
      iconType.includes('\\') ||
      iconType.startsWith('data:') ||
      iconType.startsWith('http') ||
      iconType.startsWith('blob:') ||
      iconType.startsWith('/assets')
    )
  );
};

// Get icon URL for custom icons
const getOrbIconUrl = (iconType) => {
  if (!iconType || !isCustomIcon(iconType)) return null;

  // If already a full URL or data URI, return directly
  if (iconType.startsWith('data:') || iconType.startsWith('http') || iconType.startsWith('blob:') || iconType.startsWith('/')) {
    return iconType;
  }
  
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
  const [noteImage, setNoteImage] = useState(null);
  const [orbEditorLabel, setOrbEditorLabel] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const boardRef = useRef(null);

  // Media uploads → Firebase Storage for auth users (base64 fallback for guests)
  const { uploadImage, removeImage } = useMediaUpload();

  // Helper to read and optimize image files; cloud users get a Storage URL,
  // guests get an inline base64 data URL.
  const handleImageUpload = useCallback((file, callback) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    const finishUpload = (blob) => {
      uploadImage(blob, 'journal')
        .then((url) => { if (url) callback(url); })
        .catch((err) => {
          console.error('Journal image upload failed:', err);
          alert(err.message || 'Image upload failed. Please try a smaller file.');
        });
    };
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) finishUpload(blob);
            else callback(canvas.toDataURL('image/png'));
          }, 'image/png');
        } else {
          finishUpload(file);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [uploadImage]);
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
  const [bgCategoryTab, setBgCategoryTab] = useState('maps'); // 'maps' | 'upload' | 'scenery'
  const [customBgPreview, setCustomBgPreview] = useState(null);
  const [customBgFile, setCustomBgFile] = useState(null);
  const [customBgName, setCustomBgName] = useState('');
  const [campaignData, setCampaignData] = useState(null);
  const [backgroundInput, setBackgroundInput] = useState('');
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const [showReceivedFolderDropdown, setShowReceivedFolderDropdown] = useState(false);
  const folderDropdownRef = useRef(null);
  const receivedFolderDropdownRef = useRef(null);
  
  const isGMMode = useGameStore(state => state.isGMMode);
  const { allowed: journalBasicAllowed, loading: journalBasicLoading } = useFeatureFlag('journalBasic');
  const { allowed: journalFullAllowed } = useFeatureFlag('journalFull');

  const [noteEditMode, setNoteEditMode] = useState('edit');
  const [showPromoteMenu, setShowPromoteMenu] = useState(false);
  const { openWizard: openLineageWizard } = useCustomLineageStore();

  const handlePromoteNote = (targetType, noteData = null) => {
    const title = noteData?.title || noteTitle || 'Untitled';
    const content = noteData?.content || noteContent || '';

    if (targetType === 'lineage') {
      openLineageWizard({
        name: title,
        cardFlavor: content.slice(0, 120),
        description: content,
        culturalBackground: content
      });
    } else if (targetType === 'faction') {
      const factionId = `fac_custom_${Date.now()}`;
      useFactionStore.getState().factions.push({
        id: factionId,
        name: title,
        type: 'noble_house',
        publicGoal: content || 'Custom faction created from Journal brainstorm.',
        colors: { primary: '#d4af37', secondary: '#333' }
      });
      alert(`Created Faction "${title}"! It is now visible in the World Dashboard and Faction Web.`);
    } else if (targetType === 'map_pin') {
      window.dispatchEvent(new CustomEvent('mythrill_create_map_pin', { detail: { title, content } }));
      alert(`Sent "${title}" to Immerse Map! Open the World Map to place or view this location.`);
    }
    setShowPromoteMenu(false);
    if (contextMenu) setContextMenu(null);
  };

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaigns = await campaignService.getCampaigns();
        if (campaigns && campaigns.length > 0) {
          const active = campaigns.find(c => c.isActive) || campaigns[0];
          setCampaignData(active?.campaignData || active);
        }
      } catch (e) {
        console.warn('Could not load campaign data for journal window:', e);
      }
    };
    loadCampaign();
  }, []);
  
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

    let targetId = selectedItemForOrb.id;
    let targetSourceType = selectedItemForOrb.sourceType;

    if (selectedItemForOrb.sourceType === 'campaign') {
      const item = selectedItemForOrb;
      let noteBody = '';
      if (item.campaignKind === 'npc') {
        noteBody = `:::npc ${item.name}\nDescription: ${item.description || 'N/A'}\nLocation: ${item.location || 'N/A'}\nRelationship: ${item.relationship || 'neutral'}\nPlot Relevance: ${item.plotRelevance || 'moderate'}\nNotes: ${item.notes || 'N/A'}\n:::`;
      } else if (item.campaignKind === 'location') {
        noteBody = `:::readaloud\n${item.name}\n:::\n\n**Type:** ${item.type || 'Location'}\n**Region:** ${item.region || 'Unknown'}\n\n**Notable Features:**\n${item.notableFeatures || 'None'}\n\n**Notes:**\n${item.notes || 'None'}`;
      } else if (item.campaignKind === 'plot') {
        noteBody = `:::quest ${item.title}\nStatus: ${item.status || 'Active'}\nPriority: ${item.priority || 'Medium'}\nDescription: ${item.description || 'N/A'}\nNotes: ${item.notes || 'N/A'}\n:::`;
      } else if (item.campaignKind === 'lore') {
        noteBody = `## ${item.title}\n*Category: ${item.category || 'Chronicle'}*\n\n${item.content || item.description || ''}\n\n${item.notes ? `**Notes:**\n${item.notes}` : ''}`;
      }
      const newNoteId = addNote(item.name || item.title, noteBody, item.image || null);
      targetId = newNoteId;
      targetSourceType = 'note';
    }

    const orbIconToUse = selectedItemForOrb.image || addOrbIcon;

    const orbId = addKnowledgeOrb(
      targetId,
      { x: Math.max(20, x), y: Math.max(20, y) },
      targetSourceType,
      orbIconToUse,
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
  }, [selectedItemForOrb, addOrbIcon, addOrbColor, addOrbTitle, addOrbFolderId, addKnowledgeOrb, updateOrb, addNote]);

  // Handle selecting item for new orb
  const handleSelectItemForOrb = (item, type, campaignKind = null) => {
    setSelectedItemForOrb({ ...item, sourceType: type, campaignKind });
    setAddOrbTitle(item?.name || item?.title || '');
    
    // Auto-select icon and color based on type
    if (type === 'campaign') {
      if (campaignKind === 'npc') {
        setAddOrbIcon(item.image || 'user');
        setAddOrbColor('#3498db');
      } else if (campaignKind === 'location') {
        setAddOrbIcon(item.image || 'map-marker-alt');
        setAddOrbColor('#2ecc71');
      } else if (campaignKind === 'plot') {
        setAddOrbIcon(item.image || 'scroll');
        setAddOrbColor('#9b59b6');
      } else {
        setAddOrbIcon(item.image || 'book');
        setAddOrbColor('#d4af37');
      }
    } else if (type === 'note') {
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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <input
            type="text"
            className="note-title-input"
            style={{ flex: 1, margin: 0 }}
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title..."
          />
          <div className="note-editor-mode-toggle" style={{ display: 'flex', gap: '4px' }}>
            <button 
              type="button"
              className={`toolbar-btn ${noteEditMode === 'edit' ? 'active' : ''}`}
              onClick={() => setNoteEditMode('edit')}
              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }}
              title="Edit markdown"
            >
              <i className="fas fa-pen"></i> Edit
            </button>
            <button 
              type="button"
              className={`toolbar-btn ${noteEditMode === 'preview' ? 'active' : ''}`}
              onClick={() => setNoteEditMode('preview')}
              style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px' }}
              title="Rich markdown preview with [[Wiki]] links and blocks"
            >
              <i className="fas fa-eye"></i> Preview
            </button>
          </div>
        </div>

        {noteEditMode === 'edit' ? (
          <textarea
            className="note-content-input"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note here...
• Use [[Entity Name]] for wiki-links (e.g. [[Nordhalla]], [[House Skalvyr]])
• Use @Mentions for characters or tags
• Use :::gmnote for secret GM blocks or :::readaloud for boxed text

Drag notes to the Knowledge Board to create visual connections!"
            rows={8}
          />
        ) : (
          <div className="note-content-preview" style={{ background: '#11141c', padding: '14px', borderRadius: '6px', minHeight: '160px', maxHeight: '220px', overflowY: 'auto', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '10px' }}>
            <RichLoreText text={noteContent || '*No content to preview*'} />
          </div>
        )}

        <div className="note-editor-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="note-promote-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              className="note-promote-btn"
              style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(160,120,30,0.35) 100%)',
                border: '1px solid #d4af37',
                color: '#f1d779',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setShowPromoteMenu(!showPromoteMenu)}
              title="Convert this note into a permanent worldbuilding entity"
            >
              <i className="fas fa-bolt"></i> Promote to World ▾
            </button>
            {showPromoteMenu && (
              <div className="note-promote-menu" style={{ position: 'absolute', bottom: '110%', left: 0, background: '#151821', border: '1px solid #d4af37', borderRadius: '6px', padding: '4px', minWidth: '190px', zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.85)' }}>
                <button style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => handlePromoteNote('lineage')}>
                  <i className="fas fa-dna" style={{ color: '#d4af37' }}></i> <strong>Custom Lineage</strong>
                </button>
                <button style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => handlePromoteNote('faction')}>
                  <i className="fas fa-shield-halved" style={{ color: '#3498db' }}></i> <strong>Custom Faction</strong>
                </button>
                <button style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => handlePromoteNote('map_pin')}>
                  <i className="fas fa-map-location-dot" style={{ color: '#2ecc71' }}></i> <strong>Immerse Map Pin</strong>
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
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

  const renderBoardLockedView = () => {
    return (
      <div className="journal-locked-container">
        <div className="journal-locked-card">
          <div className="journal-locked-icon-wrapper">
            <i className="fas fa-crown journal-locked-icon"></i>
          </div>
          <h2>Knowledge Board</h2>
          <div className="premium-badge">Dungeon Master & Archmage Feature</div>
          <p className="journal-locked-subtitle">
            Visualize your campaign's secrets, lore, and connections on an interactive canvas.
          </p>
          <div className="journal-locked-features">
            <div className="locked-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Create interactive visual orbs from your notes and lore</span>
            </div>
            <div className="locked-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Draw connections between people, places, and events</span>
            </div>
            <div className="locked-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Set custom backgrounds for different maps or campaigns</span>
            </div>
            <div className="locked-feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Track complex plots and clues dynamically</span>
            </div>
          </div>
          <p className="journal-locked-hint">
            Upgrade your account to Dungeon Master (Pro) or higher to unlock the visual Knowledge Board.
          </p>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'board':
        return journalFullAllowed ? renderBoardTab() : renderBoardLockedView();
      case 'received':
        return renderReceivedTab();
      case 'notes':
        return renderNotesTab();
      default:
        return null;
    }
  };

  // Don't show if journalBasic is restricted (e.g. Guest accounts)
  if (!journalBasicLoading && !journalBasicAllowed && !isGMMode) {
    return (
      <MythrillWindow
        isOpen={isOpen}
        onClose={onClose}
        title=""
        className="journal-locked-window"
        defaultSize={{ width: 600, height: 450 }}
        defaultPosition={{ x: 100, y: 100 }}
        centered
      >
        <div className="journal-locked-container basic-lock">
          <div className="journal-locked-card">
            <div className="journal-locked-icon-wrapper basic">
              <i className="fas fa-lock journal-locked-icon"></i>
            </div>
            <h2>Player Journal Restricted</h2>
            <div className="premium-badge free">Adventurer Feature</div>
            <p className="journal-locked-subtitle">
              Guest accounts do not support permanent player journals.
            </p>
            <p className="journal-locked-hint">
              Please sign up or log in to a free Adventurer account to access journals, save notes, and receive knowledge from your GM!
            </p>
          </div>
        </div>
      </MythrillWindow>
    );
  }

  return (
    <>
      <MythrillWindow
        isOpen={isOpen}
        onClose={onClose}
        title={isGMMode ? "Creative Workbench & Journal" : "Player Journal"}
        defaultSize={{ width: 950, height: 700 }}
        defaultPosition={{ x: 100, y: 100 }}
        customHeader={
          <div className="spellbook-tab-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex' }}>
              {tabs.map(tab => {
                const isLocked = tab.id === 'board' && !journalFullAllowed;
                return (
                  <button
                    key={tab.id}
                    className={`spellbook-tab-button ${activeTab === tab.id ? 'active' : ''} ${isLocked ? 'locked-tab' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>
                      {tab.label} {isLocked && <i className="fas fa-lock tab-lock-icon" style={{ marginLeft: '4px', fontSize: '11px', color: '#ff9800' }}></i>}
                    </span>
                  </button>
                );
              })}
            </div>
            {isGMMode && (
              <span className="gm-workbench-badge" style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid #d4af37', color: '#f1d779', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginRight: '10px' }}>
                <i className="fas fa-crown"></i> GM Workbench
              </span>
            )}
          </div>
        }
      >
        <div className="player-journal-content">
          {renderTabContent()}
        </div>
      </MythrillWindow>
      
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
                <RichLoreText text={showKnowledgePopup.content} />
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
            <h4><i className="fas fa-magic"></i> Edit Knowledge Orb</h4>
            
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

            {/* Custom Image / PNG Upload Section */}
            <div className="orb-editor-section">
              <label>Custom Image / Portrait (PNG, JPG)</label>
              <div className="orb-image-upload-row">
                <div
                  className="orb-image-preview-badge"
                  style={{ '--orb-color': showOrbEditor.color }}
                >
                  {showOrbEditor.iconType && isCustomIcon(showOrbEditor.iconType) ? (
                    <img
                      src={getOrbIconUrl(showOrbEditor.iconType)}
                      alt=""
                      className="orb-preview-img"
                    />
                  ) : (
                    <i className={`fas ${ORB_ICONS.find(i => i.id === showOrbEditor.iconType)?.icon || 'fa-scroll'}`}></i>
                  )}
                </div>
                <div className="orb-image-actions">
                  <label className="orb-image-upload-btn">
                    <i className="fas fa-upload"></i>
                    <span>Upload PNG / Image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, (dataUrl) => {
                            updateOrb(showOrbEditor.id, { iconType: dataUrl, customImage: dataUrl });
                            setShowOrbEditor(prev => ({ ...prev, iconType: dataUrl, customImage: dataUrl }));
                          });
                        }
                      }}
                    />
                  </label>
                  {showOrbEditor.iconType && isCustomIcon(showOrbEditor.iconType) && (
                    <button
                      type="button"
                      className="orb-image-reset-btn"
                      onClick={() => {
                        updateOrb(showOrbEditor.id, { iconType: 'scroll', customImage: null });
                        setShowOrbEditor(prev => ({ ...prev, iconType: 'scroll', customImage: null }));
                      }}
                    >
                      <i className="fas fa-undo"></i> Reset to icon
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="orb-editor-section">
              <label>Or Choose Standard Icon</label>
              <div className="orb-icon-grid">
                {ORB_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    className={`orb-icon-option ${showOrbEditor.iconType === icon.id ? 'selected' : ''}`}
                    onClick={() => {
                      updateOrb(showOrbEditor.id, { iconType: icon.id, customImage: null });
                      setShowOrbEditor({ ...showOrbEditor, iconType: icon.id, customImage: null });
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
          
          <div className="context-menu-submenu">
            <button>
              <i className="fas fa-bolt" style={{ color: '#d4af37' }}></i>
              Promote to World
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="context-submenu-items">
              <button onClick={() => handlePromoteNote('lineage', contextMenu.item)}>
                <i className="fas fa-dna" style={{ color: '#d4af37' }}></i>
                Custom Lineage
              </button>
              <button onClick={() => handlePromoteNote('faction', contextMenu.item)}>
                <i className="fas fa-shield-halved" style={{ color: '#3498db' }}></i>
                Custom Faction
              </button>
              <button onClick={() => handlePromoteNote('map_pin', contextMenu.item)}>
                <i className="fas fa-map-location-dot" style={{ color: '#2ecc71' }}></i>
                Immerse Map Pin
              </button>
            </div>
          </div>
          
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
                    <button
                      className={`toolbar-btn ${addOrbActiveTab === 'campaign' ? 'active' : ''}`}
                      style={{ flex: 1, fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => setAddOrbActiveTab('campaign')}
                    >
                      <i className="fas fa-scroll"></i> Campaign ({searchedCampaignItems.length})
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

                  {/* Campaign Tab */}
                  {addOrbActiveTab === 'campaign' && (
                    <>
                      {searchedCampaignItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8b7355' }}>
                          <i className="fas fa-scroll" style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}></i>
                          <p>No campaign entries found</p>
                        </div>
                      ) : (
                        searchedCampaignItems.map(item => {
                          const isNpc = item.campaignKind === 'npc';
                          const isLoc = item.campaignKind === 'location';
                          const isPlot = item.campaignKind === 'plot';
                          const title = item.name || item.title;
                          const subtitle = isNpc ? (item.location || 'NPC') : isLoc ? (item.type || 'Location') : isPlot ? (item.status || 'Quest') : 'Lore';
                          const iconClass = isNpc ? 'fa-user' : isLoc ? 'fa-map-marker-alt' : isPlot ? 'fa-scroll' : 'fa-book';
                          const badgeColor = isNpc ? '#3498db' : isLoc ? '#2ecc71' : isPlot ? '#9b59b6' : '#d4af37';

                          return (
                            <div
                              key={`${item.campaignKind}-${item.id}`}
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
                              onClick={() => handleSelectItemForOrb(item, 'campaign', item.campaignKind)}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 69, 19, 0.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 69, 19, 0.05)'}
                            >
                              <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {item.image ? (
                                  <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <i className={`fas ${iconClass}`} style={{ color: '#fff' }}></i>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'Cinzel', fontWeight: 600, color: '#5a1e12', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                                <div style={{ fontSize: '11px', color: '#8b7355' }}>
                                  <span style={{ padding: '1px 5px', borderRadius: '3px', background: 'rgba(212, 175, 55, 0.2)', marginRight: '6px', textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>{subtitle}</span>
                                  {(item.description || item.notes || '').substring(0, 35)}
                                </div>
                              </div>
                              <i className="fas fa-chevron-right" style={{ color: '#8b7355' }}></i>
                            </div>
                          );
                        })
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
            style={{ maxWidth: '650px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="background-modal-header">
              <h4><i className="fas fa-map"></i> Set Board Background & Canvas</h4>
              <button 
                className="background-modal-close"
                onClick={() => setShowBackgroundModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="background-modal-content">
              {/* Category tabs */}
              <div className="bg-category-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  className={`toolbar-btn ${bgCategoryTab === 'maps' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '8px', fontSize: '11px' }}
                  onClick={() => setBgCategoryTab('maps')}
                >
                  <i className="fas fa-atlas"></i> Maps & Atlas
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${bgCategoryTab === 'upload' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '8px', fontSize: '11px' }}
                  onClick={() => setBgCategoryTab('upload')}
                >
                  <i className="fas fa-upload"></i> Upload Map File
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${bgCategoryTab === 'scenery' ? 'active' : ''}`}
                  style={{ flex: 1, padding: '8px', fontSize: '11px' }}
                  onClick={() => setBgCategoryTab('scenery')}
                >
                  <i className="fas fa-mountain-sun"></i> Scenery
                </button>
              </div>

              {/* Tab 1: Maps & Atlas */}
              {bgCategoryTab === 'maps' && (
                <div className="background-grid">
                  <div 
                    className={`background-option ${!getBoardBackground() ? 'selected' : ''}`}
                    onClick={() => {
                      clearBoardBackground();
                      setShowBackgroundModal(false);
                    }}
                    title="No background (Default Grid)"
                  >
                    <div className="background-preview no-background">
                      <i className="fas fa-ban"></i>
                    </div>
                    <span>None (Grid)</span>
                  </div>
                  {CANONICAL_MAP_PRESETS.map((m) => {
                    const isSelected = getBoardBackground()?.url === m.image;
                    return (
                      <div
                        key={m.id}
                        className={`background-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setBoardBackground({ url: m.image, name: m.name, isMap: true, mapId: m.id });
                          setShowBackgroundModal(false);
                        }}
                        title={m.name}
                      >
                        <div className="background-preview">
                          <img src={m.image} alt={m.name} />
                        </div>
                        <span>{m.name}</span>
                      </div>
                    );
                  })}
                  {Object.values(getCustomMaps()).map((cm) => {
                    const isSelected = getBoardBackground()?.url === cm.image;
                    return (
                      <div
                        key={cm.id}
                        className={`background-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setBoardBackground({ url: cm.image, name: cm.name, isMap: true, mapId: cm.id });
                          setShowBackgroundModal(false);
                        }}
                        title={`${cm.name} (Custom)`}
                      >
                        <div className="background-preview">
                          <img src={cm.image} alt={cm.name} />
                        </div>
                        <span>{cm.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Upload Custom Map / Image File */}
              {bgCategoryTab === 'upload' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px 20px',
                    border: '2px dashed #a67c2e',
                    borderRadius: '8px',
                    background: 'rgba(139, 69, 19, 0.05)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    gap: '10px',
                    fontFamily: 'Cinzel',
                    color: '#6b1a1a',
                    fontWeight: 700
                  }}>
                    <i className="fas fa-cloud-arrow-up" style={{ fontSize: '28px', color: '#8b2626' }}></i>
                    <span>Click or drag image to upload custom map or battlemap</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCustomBgName(file.name);
                          setCustomBgFile(file);
                          const reader = new FileReader();
                          reader.onload = (ev) => setCustomBgPreview(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {customBgPreview && (
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(139, 69, 19, 0.08)', padding: '12px', borderRadius: '8px' }}>
                      <img src={customBgPreview} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #8b2626' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 8px 0', fontFamily: 'Cinzel', fontWeight: 700, fontSize: '13px', color: '#5a1e12' }}>{customBgName || 'Custom Map Ready'}</p>
                        <button
                          type="button"
                          className="toolbar-btn active"
                          style={{ padding: '8px 14px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          onClick={async () => {
                            try {
                              let bgUrl = customBgPreview;
                              if (customBgFile) {
                                const uploaded = await uploadImage(customBgFile, 'board-backgrounds');
                                if (uploaded) bgUrl = uploaded;
                              }
                              const previousBg = getBoardBackground();
                              if (previousBg?.isCustom && previousBg?.url) {
                                removeImage(previousBg.url).catch((err) => console.warn('Failed to remove old background from cloud:', err));
                              }
                              setBoardBackground({ url: bgUrl, name: customBgName || 'Custom Map', isCustom: true });
                              setShowBackgroundModal(false);
                            } catch (err) {
                              console.error('Background upload failed:', err);
                              alert(err.message || 'Background upload failed. Please try a smaller file.');
                            }
                          }}
                        >
                          <i className="fas fa-check"></i> Apply as Background
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Scenery Presets */}
              {bgCategoryTab === 'scenery' && (
                <div className="background-grid">
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
              )}
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

      {/* Custom Lineage Wizard for fast worldbuilding */}
      <CustomLineageWizard />
    </>
  );
};

export default PlayerJournalWindow;
