import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import useShareableStore from '../../store/shareableStore';
import useFeatureFlag from '../../hooks/useFeatureFlag';
import { getCustomIconUrl } from '../../utils/assetManager';
import { BUILTIN_SUBREGION_MAPS, getCustomMaps } from '../../data/subregionMaps';
import campaignService from '../../services/campaignService';
import RichLoreText from '../common/RichLoreText';
import CustomLineageWizard from '../world/CustomLineageWizard';
import useCustomLineageStore from '../../store/customLineageStore';
import useFactionStore from '../../store/factionStore';
import './styles/AccountJournalManager.css';

const CANONICAL_MAP_PRESETS = [
  { id: 'mythril', name: 'Mythrill - Planetary World Map', image: '/assets/images/backgrounds/Mythril.jpeg', type: 'World Master Map' },
  { id: 'nordhalla', name: 'Nordhalla Continental Map', image: '/assets/images/backgrounds/nordhalla.jpeg', type: 'Canonical Realm' },
  { id: 'nordhalla-glacier-heart', name: 'Rime-Spire Peaks Subregion', image: '/assets/images/backgrounds/rime-spire-peaks.jpg', type: 'Subregion Map' },
  { id: 'frostwood-reach', name: 'Frostwood Reach', image: '/assets/images/backgrounds/Mythril.jpeg', type: 'Canonical Realm' },
  { id: 'sundale', name: 'Sundale', image: '/assets/images/backgrounds/Mythril.jpeg', type: 'Canonical Realm' }
];

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

  // Default to abilities folder
  return getCustomIconUrl(iconType, 'abilities');
};

// Icon options for boards and folders
const BOARD_ICONS = [
  { id: 'fa-project-diagram', icon: 'fa-project-diagram', label: 'Network' },
  { id: 'fa-layer-group', icon: 'fa-layer-group', label: 'Overview' },
  { id: 'fa-map', icon: 'fa-map', label: 'Map' },
  { id: 'fa-globe', icon: 'fa-globe', label: 'World' },
  { id: 'fa-compass', icon: 'fa-compass', label: 'Navigation' },
  { id: 'fa-scroll', icon: 'fa-scroll', label: 'Scroll' },
  { id: 'fa-book', icon: 'fa-book', label: 'Book' },
  { id: 'fa-book-open', icon: 'fa-book-open', label: 'Tome' },
  { id: 'fa-dungeon', icon: 'fa-dungeon', label: 'Dungeon' },
  { id: 'fa-chess-rook', icon: 'fa-chess-rook', label: 'Keep' },
  { id: 'fa-landmark', icon: 'fa-landmark', label: 'City' },
  { id: 'fa-crown', icon: 'fa-crown', label: 'Kingdom' },
  { id: 'fa-shield-halved', icon: 'fa-shield-halved', label: 'Faction' },
  { id: 'fa-skull', icon: 'fa-skull', label: 'Undead' },
  { id: 'fa-dragon', icon: 'fa-dragon', label: 'Monsters' },
  { id: 'fa-hat-wizard', icon: 'fa-hat-wizard', label: 'Spells' },
  { id: 'fa-gem', icon: 'fa-gem', label: 'Artifacts' },
  { id: 'fa-coins', icon: 'fa-coins', label: 'Vault' },
  { id: 'fa-mountain', icon: 'fa-mountain', label: 'Mountains' },
  { id: 'fa-tree', icon: 'fa-tree', label: 'Forest' },
  { id: 'fa-fire', icon: 'fa-fire', label: 'Ember' },
  { id: 'fa-snowflake', icon: 'fa-snowflake', label: 'Rime' },
  { id: 'fa-ghost', icon: 'fa-ghost', label: 'Specter' },
  { id: 'fa-feather-pointed', icon: 'fa-feather-pointed', label: 'Lore' }
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
  // Otherwise, construct path from /assets/Backgrounds/
  return `/assets/Backgrounds/${encodeURIComponent(imagePath)}`;
};

const AccountJournalManager = ({ user }) => {
  const { allowed: journalFullAllowed } = useFeatureFlag('journalFull');
  const defaultSection = journalFullAllowed ? 'board' : 'received';
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [showKnowledgePopup, setShowKnowledgePopup] = useState(null);
  const [showOrbEditor, setShowOrbEditor] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [bgCategoryTab, setBgCategoryTab] = useState('maps'); // 'maps' | 'upload' | 'scenery'
  const [backgroundInput, setBackgroundInput] = useState('');
  const [customBgPreview, setCustomBgPreview] = useState(null);
  const [customBgName, setCustomBgName] = useState('');
  const [campaignData, setCampaignData] = useState(null);
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
  const [addOrbActiveTab, setAddOrbActiveTab] = useState('received'); // 'received' | 'notes' | 'campaign'
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardColor, setNewBoardColor] = useState(FOLDER_COLORS[0]);
  const [newBoardIcon, setNewBoardIcon] = useState('fa-project-diagram');
  const [orbEditorLabel, setOrbEditorLabel] = useState('');
  const [noteImage, setNoteImage] = useState(null);
  const [noteEditMode, setNoteEditMode] = useState('edit');
  const [showPromoteMenu, setShowPromoteMenu] = useState(false);
  const [showCampaignWeaverModal, setShowCampaignWeaverModal] = useState(false);
  const [campaignWeaverTab, setCampaignWeaverTab] = useState('all');
  const [campaignWeaverSearch, setCampaignWeaverSearch] = useState('');
  const { openWizard: openLineageWizard } = useCustomLineageStore();

  const handlePromoteNote = (targetType) => {
    const title = noteTitle.trim() || 'Untitled Note Entity';
    const content = noteContent.trim();
    if (!content && !noteTitle) {
      alert('Please write something in your note before promoting it to the world.');
      return;
    }

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
      window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: { title, content } }));
      alert(`Sent "${title}" to Immerse Map! Open the World section to place or view this location.`);
    }
    setShowPromoteMenu(false);
  };

  const boardRef = useRef(null);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaigns = await campaignService.getCampaigns(user?.uid);
        if (campaigns && campaigns.length > 0) {
          const active = campaigns.find(c => c.isActive) || campaigns[0];
          setCampaignData(active?.campaignData || active);
        }
      } catch (e) {
        console.warn('Could not load campaign data for journal:', e);
      }
    };
    loadCampaign();
  }, [user]);

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
    getBoardBreadcrumbs,
    addKnowledgeOrb,
    updateOrbPosition,
    updateOrb,
    removeOrb,
    addTagToOrb,
    removeTagFromOrb,
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
    clearBoardBackground,
    linkOrbToBoard,
    unlinkOrbBoard,
    addCampaignEntityAsOrb,
    syncToCloud,
    hydrateFromCloud,
    toggleBoardBgMode
  } = useShareableStore();

  const [showBoardAtlasModal, setShowBoardAtlasModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [noteViewMode, setNoteViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [noteSearchTerm, setNoteSearchTerm] = useState('');

  // Canvas Pan & Zoom States
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [bgModalMode, setBgModalMode] = useState('canvas'); // 'canvas' (pinned to map) | 'static' (window backdrop)

  // Reset zoom & pan to default
  const resetBoardView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(1);
  }, []);

  // Hydrate journal from Firebase on mount if user is logged in
  useEffect(() => {
    if (user?.uid) {
      hydrateFromCloud(user.uid);
    }
  }, [user?.uid, hydrateFromCloud]);

  // Helper to insert markdown formatting syntax into note content at current cursor position
  const insertNoteSyntax = (prefix, suffix = '') => {
    const textarea = document.getElementById('mythrill-note-textarea');
    if (!textarea) {
      setNoteContent(prev => prev + prefix + suffix);
      return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = noteContent.substring(start, end);
    const replacement = prefix + selected + suffix;
    const newText = noteContent.substring(0, start) + replacement + noteContent.substring(end);
    setNoteContent(newText);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + (selected ? selected.length : 0);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const campaignEntities = useMemo(() => {
    if (!campaignData) return [];
    const list = [];
    (campaignData.npcs || []).forEach(n => {
      list.push({ id: n.id, name: n.name, type: 'npc', description: n.role || n.description || '', image: n.avatar || n.image });
    });
    (campaignData.locations || []).forEach(l => {
      list.push({ id: l.id, name: l.name, type: 'location', description: l.type || l.description || '', image: l.image || l.banner });
    });
    (campaignData.plots || campaignData.quests || []).forEach(q => {
      list.push({ id: q.id, name: q.title || q.name, type: 'quest', description: q.description || q.summary || '' });
    });
    (campaignData.homebrew?.items || campaignData.selectedItems || []).forEach(i => {
      list.push({ id: i.id, name: i.name, type: 'item', description: i.type || i.properties || '' });
    });
    (campaignData.homebrew?.monsters || campaignData.selectedCreatures || []).forEach(m => {
      list.push({ id: m.id, name: m.name, type: 'monster', description: `${m.type || 'Beast'} • HP ${m.hp || 30}` });
    });
    (campaignData.homebrew?.lore || []).forEach(lr => {
      list.push({ id: lr.id, name: lr.title || lr.name, type: 'lore', description: lr.category || lr.summary || '' });
    });
    (useFactionStore.getState().factions || []).forEach(f => {
      list.push({ id: f.id, name: f.name, type: 'faction', description: f.publicGoal || f.type || '' });
    });
    return list;
  }, [campaignData]);

  // Helper to read and optimize image files to Data URL
  const handleImageUpload = useCallback((file, callback) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const maxDim = 200;
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
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const openOrbEditor = useCallback((orb) => {
    const content = getContentByOrb(orb);
    setOrbEditorLabel(orb.label || content?.title || '');
    setShowOrbEditor(orb);
  }, [getContentByOrb]);

  // Filter content based on current folder
  // When a folder is selected, show ONLY items in that folder
  // When "All" is selected (currentFolderId is null), show ALL items
  const filteredKnowledge = useMemo(() => {
    if (!currentFolderId) return playerKnowledge;
    return playerKnowledge.filter(k => k.folderId === currentFolderId);
  }, [playerKnowledge, currentFolderId]);

  const filteredNotes = useMemo(() => {
    let list = playerNotes || [];
    if (currentFolderId) {
      list = list.filter(n => n.folderId === currentFolderId);
    }
    if (noteSearchTerm.trim()) {
      const term = noteSearchTerm.toLowerCase();
      list = list.filter(n => (n.title || '').toLowerCase().includes(term) || (n.content || '').toLowerCase().includes(term));
    }
    return list;
  }, [playerNotes, currentFolderId, noteSearchTerm]);

  const filteredOrbs = useMemo(() => {
    if (!currentBoardId) return knowledgeOrbs;
    return knowledgeOrbs.filter(o => o.boardId === currentBoardId);
  }, [knowledgeOrbs, currentBoardId]);

  // Sections
  const sections = [
    { id: 'board', label: 'Knowledge Board', icon: 'fa-project-diagram', pro: true },
    { id: 'received', label: 'Received', icon: 'fa-inbox' },
    { id: 'notes', label: 'My Notes', icon: 'fa-sticky-note' }
  ].filter(s => !s.pro || journalFullAllowed);

  // Handle orb drag
  const handleOrbMouseDown = useCallback((e, orb) => {
    // Only handle left mouse button (button 0)
    if (e.button !== 0) return;

    if (connectingFrom) {
      if (connectingFrom === 'waiting') {
        setConnectingFrom(orb.id);
        return;
      } else if (connectingFrom === orb.id) {
        setConnectingFrom(null);
        return;
      } else {
        addConnection(connectingFrom, orb.id);
        setConnectingFrom(null);
        return;
      }
    }

    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startOrbX = orb.position.x;
    const startOrbY = orb.position.y;

    let hasMoved = false;
    const DRAG_THRESHOLD = 5;

    setDraggedOrb(orb.id);

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoomLevel;
      const deltaY = (moveEvent.clientY - startY) / zoomLevel;

      if (Math.abs(moveEvent.clientX - startX) > DRAG_THRESHOLD || Math.abs(moveEvent.clientY - startY) > DRAG_THRESHOLD) {
        hasMoved = true;
      }

      const newX = Math.round(startOrbX + deltaX);
      const newY = Math.round(startOrbY + deltaY);

      updateOrbPosition(orb.id, { x: newX, y: newY });
    };

    const handleMouseUp = (upEvent) => {
      if (upEvent.button !== 0) {
        setDraggedOrb(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        return;
      }

      setDraggedOrb(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (!hasMoved) {
        const content = getContentByOrb(orb);
        if (content) {
          setShowKnowledgePopup({
            ...content,
            orbId: orb.id,
            orbLabel: orb.label || content.title || content.name || 'Knowledge Record',
            sourceType: orb.sourceType,
            linkedBoardId: orb.linkedBoardId,
            tags: orb.tags || content.tags || (orb.entityType ? [orb.entityType.toUpperCase()] : ['NOTE']),
            entityType: orb.entityType || content.entityType || 'note'
          });
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [connectingFrom, addConnection, updateOrbPosition, getContentByOrb, zoomLevel]);

  // Handle dropping onto board
  const handleBoardDrop = useCallback((e) => {
    e.preventDefault();

    const knowledgeId = e.dataTransfer.getData('knowledge/id');
    const noteId = e.dataTransfer.getData('note/id');

    if (!knowledgeId && !noteId) return;

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const x = Math.round(((e.clientX - boardRect.left) - panOffset.x) / zoomLevel - 30);
    const y = Math.round(((e.clientY - boardRect.top) - panOffset.y) / zoomLevel - 30);

    if (noteId) {
      const note = playerNotes.find(n => n.id === noteId);
      const iconToUse = note?.image || 'sticky-note';
      addKnowledgeOrb(noteId, { x, y }, 'note', iconToUse, '#f39c12');
    } else if (knowledgeId) {
      const knowledge = playerKnowledge.find(k => k.id === knowledgeId);
      const iconToUse = knowledge?.image || (knowledge?.type === 'image' ? knowledge?.content : 'scroll');
      addKnowledgeOrb(knowledgeId, { x, y }, 'knowledge', iconToUse);
    }
  }, [addKnowledgeOrb, playerNotes, playerKnowledge, panOffset, zoomLevel]);

  // Handle adding item from popup to board
  const handleAddOrbConfirm = useCallback(() => {
    if (!selectedItemForOrb || !boardRef?.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const x = Math.round(((boardRect.width / 2) - panOffset.x) / zoomLevel - 30 + (Math.random() - 0.5) * 100);
    const y = Math.round(((boardRect.height / 2) - panOffset.y) / zoomLevel - 30 + (Math.random() - 0.5) * 100);

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
      } else {
        noteBody = `**${item.name}**\n\n${item.description || ''}`;
      }
      targetId = addNote(item.name || item.title, noteBody, item.image || null);
      targetSourceType = 'note';
    }

    const orbIconToUse = isCustomIcon(addOrbIcon)
      ? addOrbIcon
      : (ORB_ICONS.find(i => i.id === addOrbIcon)?.id || 'scroll');

    const orbId = addKnowledgeOrb(
      targetId,
      { x: Math.max(20, x), y: Math.max(20, y) },
      targetSourceType,
      orbIconToUse,
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
  }, [selectedItemForOrb, addOrbIcon, addOrbColor, addOrbTitle, addKnowledgeOrb, updateOrb, addNote, panOffset, zoomLevel]);

  // Handle canvas background mouse drag (Panning)
  const handleBoardMouseDown = (e) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (
      e.target.closest('.board-orb') ||
      e.target.closest('.connection-hitbox') ||
      e.target.closest('.canvas-floating-hud') ||
      e.target.closest('.canvas-floating-breadcrumbs') ||
      e.target.closest('button') ||
      e.target.closest('input')
    ) {
      return;
    }

    e.preventDefault();
    setIsPanning(true);
    const startX = e.clientX - panOffset.x;
    const startY = e.clientY - panOffset.y;

    const handleMouseMove = (moveEvent) => {
      setPanOffset({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Wheel Zoom Listener
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl || activeSection !== 'board') return;

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = boardEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;

      setZoomLevel((prevZoom) => {
        const nextZoom = Math.min(2.5, Math.max(0.35, +(prevZoom * zoomFactor).toFixed(3)));
        if (nextZoom === prevZoom) return prevZoom;

        const scaleRatio = nextZoom / prevZoom;
        setPanOffset((prevPan) => ({
          x: Math.round(mouseX - (mouseX - prevPan.x) * scaleRatio),
          y: Math.round(mouseY - (mouseY - prevPan.y) * scaleRatio)
        }));
        return nextZoom;
      });
    };

    boardEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      boardEl.removeEventListener('wheel', handleWheel);
    };
  }, [activeSection]);

  // Fit all orbs in current view
  const fitOrbsInView = useCallback(() => {
    if (!filteredOrbs || filteredOrbs.length === 0) {
      resetBoardView();
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    filteredOrbs.forEach(o => {
      minX = Math.min(minX, o.position.x);
      minY = Math.min(minY, o.position.y);
      maxX = Math.max(maxX, o.position.x + 80);
      maxY = Math.max(maxY, o.position.y + 80);
    });

    const boardRect = boardRef.current?.getBoundingClientRect();
    if (!boardRect) return;

    const contentWidth = Math.max(300, maxX - minX + 120);
    const contentHeight = Math.max(200, maxY - minY + 120);

    const scaleX = boardRect.width / contentWidth;
    const scaleY = boardRect.height / contentHeight;
    const fitZoom = Math.min(1.4, Math.max(0.4, Math.min(scaleX, scaleY) * 0.9));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoomLevel(fitZoom);
    setPanOffset({
      x: Math.round((boardRect.width / 2) - (centerX * fitZoom)),
      y: Math.round((boardRect.height / 2) - (centerY * fitZoom))
    });
  }, [filteredOrbs, resetBoardView]);

  const handleSelectItemForOrb = (item, type, campaignKind = null) => {
    setSelectedItemForOrb({ ...item, sourceType: type, campaignKind });
    setAddOrbTitle(item?.name || item?.title || '');

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

  const campaignNPCs = campaignData?.npcs || [];
  const campaignLocations = campaignData?.locations || [];
  const campaignPlots = campaignData?.plotThreads || [];
  const campaignLore = campaignData?.homebrew?.lore || campaignData?.lore || [];

  const searchedCampaignItems = useMemo(() => {
    const s = addOrbSearchTerm.toLowerCase();
    const npcs = campaignNPCs.filter(n => !s || n.name?.toLowerCase().includes(s) || n.description?.toLowerCase().includes(s)).map(n => ({ ...n, campaignKind: 'npc' }));
    const locs = campaignLocations.filter(l => !s || l.name?.toLowerCase().includes(s) || l.description?.toLowerCase().includes(s)).map(l => ({ ...l, campaignKind: 'location' }));
    const plots = campaignPlots.filter(p => !s || p.title?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)).map(p => ({ ...p, campaignKind: 'plot' }));
    const lore = campaignLore.filter(l => !s || l.title?.toLowerCase().includes(s) || l.description?.toLowerCase().includes(s)).map(l => ({ ...l, campaignKind: 'lore' }));
    return [...npcs, ...locs, ...plots, ...lore];
  }, [campaignNPCs, campaignLocations, campaignPlots, campaignLore, addOrbSearchTerm]);

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
    console.log('AccountJournalManager: handleSaveFolder called', { newFolderName, editingFolder });
    if (!newFolderName.trim()) return;

    if (editingFolder) {
      updateFolder(editingFolder.id, { name: newFolderName, color: newFolderColor });
    } else {
      const newId = addFolder(newFolderName, newFolderColor);
      setCurrentFolder(newId);
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

    syncToCloud(user?.uid);
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
      updateNote(editingNote.id, { title: noteTitle, content: noteContent, image: noteImage });
    } else {
      addNote(noteTitle, noteContent, noteImage);
    }

    syncToCloud(user?.uid);
    setEditingNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteImage(null);
  };

  // Handle adding current note as an orb onto active knowledge board
  const handleAddCurrentNoteToBoard = () => {
    const title = noteTitle.trim() || editingNote?.title || 'Untitled Note';
    let targetNoteId = editingNote?.id;
    if (!targetNoteId) {
      targetNoteId = addNote(title, noteContent, noteImage);
    } else {
      updateNote(targetNoteId, { title, content: noteContent, image: noteImage });
    }
    const currentOrbs = (knowledgeOrbs || []).filter(o => o.boardId === currentBoardId);
    const count = currentOrbs.length;
    const posX = 120 + ((count % 4) * 160);
    const posY = 120 + (Math.floor(count / 4) * 140);
    addKnowledgeOrb(targetNoteId, { x: posX, y: posY }, 'note', 'scroll', '#d4af37');
    syncToCloud(user?.uid);
    alert(`Added "${title}" as an Orb to your Knowledge Board!`);
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
                type="button"
                className="btn-vtt-action btn-vtt-atlas"
                onClick={() => setShowBoardAtlasModal(true)}
                title="View Connected Boards Hierarchy Atlas"
              >
                <i className="fas fa-sitemap"></i>
                <span>Board Atlas</span>
              </button>
              <button
                type="button"
                className="btn-vtt-action btn-vtt-add"
                onClick={() => {
                  setEditingBoard(null);
                  setNewBoardName('');
                  setNewBoardColor(FOLDER_COLORS[0]);
                  setNewBoardIcon('fa-project-diagram');
                  setShowBoardModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
                <span>New Board</span>
              </button>
              {currentBoardId && (
                <>
                  <button
                    type="button"
                    className="btn-vtt-action btn-vtt-edit-icon"
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
                    title="Edit board name and icon"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    type="button"
                    className="btn-vtt-action btn-vtt-del-icon"
                    onClick={() => {
                      const board = knowledgeBoards.find(b => b.id === currentBoardId);
                      if (board && window.confirm(`Delete "${board.name}"? Orbs will be moved to "All Boards".`)) {
                        removeKnowledgeBoard(board.id);
                        syncToCloud(user?.uid);
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
                type="button"
                className="btn-vtt-action btn-vtt-add"
                onClick={() => {
                  setEditingFolder(null);
                  setNewFolderName('');
                  setNewFolderColor(FOLDER_COLORS[0]);
                  setShowFolderModal(true);
                }}
              >
                <i className="fas fa-plus"></i>
                <span>New Folder</span>
              </button>
              {currentFolderId && (
                <>
                  <button
                    type="button"
                    className="btn-vtt-action btn-vtt-edit-icon"
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
                    type="button"
                    className="btn-vtt-action btn-vtt-del-icon"
                    onClick={() => {
                      const folder = journalFolders.find(f => f.id === currentFolderId);
                      if (folder && window.confirm(`Delete "${folder.name}"? Content will be moved to "All Folders".`)) {
                        removeFolder(folder.id);
                        syncToCloud(user?.uid);
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
          {!journalFullAllowed && (
            <span className="journal-upsell-hint">
              Knowledge Board & quest sharing unlock with Dungeon Master+
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="journal-content-area">        {/* Knowledge Board */}
        {activeSection === 'board' && journalFullAllowed && (
          <div className="journal-board-section">
            <div className="board-toolbar">
              <div className="board-toolbar-left">
                <button
                  type="button"
                  className="btn-vtt-action btn-vtt-add"
                  onClick={() => {
                    setShowAddOrbPopup(true);
                    setAddOrbStep('select');
                    setSelectedItemForOrb(null);
                    setAddOrbSearchTerm('');
                    setAddOrbActiveTab('received');
                  }}
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Add Orb</span>
                </button>

                <button
                  type="button"
                  className="btn-vtt-action btn-vtt-weave"
                  onClick={() => setShowCampaignWeaverModal(true)}
                  title="Import NPCs, Locations, Quests, Items, and Factions from Campaign directly into Knowledge Board"
                >
                  <i className="fas fa-network-wired"></i>
                  <span>⚡ Weave Campaign</span>
                </button>

                <button
                  type="button"
                  className={`btn-vtt-action btn-vtt-connect ${connectingFrom ? 'active' : ''}`}
                  onClick={() => setConnectingFrom(connectingFrom ? null : 'waiting')}
                  title={connectingFrom ? "Cancel connecting mode" : "Click to connect two orbs"}
                >
                  <i className="fas fa-link"></i>
                  <span>{connectingFrom ? 'Cancel Link' : 'Connect'}</span>
                </button>

                <button
                  type="button"
                  className="btn-vtt-action btn-vtt-bg"
                  onClick={() => {
                    const currentBackground = getBoardBackground();
                    setBackgroundInput(currentBackground?.url || '');
                    setBgModalMode(currentBackground?.bgMode || 'canvas');
                    setShowBackgroundModal(true);
                  }}
                  title="Set board background image, regional map, or scenery"
                >
                  <i className="fas fa-image"></i>
                  <span>Background</span>
                </button>

                {/* Quick Background Mode Switcher (Canvas Pinned vs Static Backdrop) */}
                {getBoardBackground() && (
                  <button
                    type="button"
                    className="btn-vtt-action btn-vtt-bgmode"
                    onClick={() => {
                      toggleBoardBgMode();
                      syncToCloud(user?.uid);
                    }}
                    title={
                      (getBoardBackground()?.bgMode || 'canvas') === 'canvas'
                        ? "Currently: Pinned to Canvas Map (Zooms & pans with pins). Click to switch to Static Window Backdrop."
                        : "Currently: Static Backdrop (Stationary wallpaper). Click to switch to Pinned Canvas Map."
                    }
                  >
                    <i className={`fas ${(getBoardBackground()?.bgMode || 'canvas') === 'canvas' ? 'fa-map-location-dot' : 'fa-thumbtack'}`}></i>
                    <span>{(getBoardBackground()?.bgMode || 'canvas') === 'canvas' ? 'Map Mode' : 'Static Mode'}</span>
                  </button>
                )}
              </div>

              <div className="board-toolbar-right">
                <span className="toolbar-hint">
                  {connectingFrom
                    ? '⚡ Select two orbs to weave a connection between them'
                    : 'Click & drag canvas to pan • Mouse wheel to zoom • Drag orbs freely'}
                </span>
              </div>
            </div>

            <div
              ref={boardRef}
              className={`knowledge-board ${isPanning ? 'is-panning' : ''}`}
              style={(() => {
                const boardBackground = getBoardBackground();
                const bgMode = boardBackground?.bgMode || 'canvas';
                if (boardBackground && bgMode === 'static') {
                  return {
                    backgroundImage: `url(${getBackgroundImageUrl(boardBackground.url)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  };
                }
                return {};
              })()}
              onMouseDown={handleBoardMouseDown}
              onDrop={handleBoardDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Hierarchical Sub-Board Floating Breadcrumb Bar */}
              <div className="canvas-floating-breadcrumbs">
                <button
                  type="button"
                  className={`breadcrumb-node ${!currentBoardId ? 'active' : ''}`}
                  onClick={() => setCurrentBoard(null)}
                  title="Return to Master Overview Board"
                >
                  <i className="fas fa-layer-group"></i> Master Board
                </button>
                {getBoardBreadcrumbs().map((b) => (
                  <React.Fragment key={b.id}>
                    <span className="breadcrumb-arrow"><i className="fas fa-chevron-right"></i></span>
                    <button
                      type="button"
                      className={`breadcrumb-node ${b.id === currentBoardId ? 'active' : ''}`}
                      onClick={() => setCurrentBoard(b.id)}
                    >
                      <i className={`fas ${b.icon || 'fa-project-diagram'}`}></i>
                      <span>{b.name}</span>
                    </button>
                  </React.Fragment>
                ))}
                {currentBoardId && (
                  <button
                    type="button"
                    className="btn-back-parent"
                    onClick={() => {
                      const current = knowledgeBoards.find(x => x.id === currentBoardId);
                      setCurrentBoard(current?.parentBoardId || null);
                    }}
                    title="Navigate back up to parent board"
                  >
                    <i className="fas fa-level-up-alt"></i> Back Up
                  </button>
                )}
              </div>

              {/* Transformed Canvas Layer for Orbs, SVG Connections, and Canvas Maps */}
              <div
                className="board-transform-layer"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: '0 0'
                }}
              >
                {/* Canvas Map Plane (when background mode is canvas-pinned) */}
                {(() => {
                  const boardBackground = getBoardBackground();
                  const bgMode = boardBackground?.bgMode || 'canvas';
                  if (boardBackground && bgMode === 'canvas') {
                    return (
                      <div
                        className="board-canvas-map-plane"
                        style={{
                          backgroundImage: `url(${getBackgroundImageUrl(boardBackground.url)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    );
                  }
                  return null;
                })()}

                {/* Connection Lines */}
                <svg className="connection-svg" style={{ width: '4000px', height: '4000px' }}>
                  {knowledgeConnections
                    .filter(conn => {
                      const fromOrb = knowledgeOrbs.find(o => o.id === conn.fromOrbId);
                      const toOrb = knowledgeOrbs.find(o => o.id === conn.toOrbId);
                      if (!fromOrb || !toOrb) return false;
                      if (!currentBoardId) return true;
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
                  const orbIconSource = orb.customImage || orb.iconType;
                  const hasCustomIcon = isCustomIcon(orbIconSource);
                  const customIconUrl = hasCustomIcon ? getOrbIconUrl(orbIconSource) : null;
                  const iconData = !hasCustomIcon ? (ORB_ICONS.find(i => i.id === orb.iconType) || ORB_ICONS[0]) : null;
                  const displayTitle = orb.label || content?.title || '???';

                  return (
                    <div
                      key={orb.id}
                      className={`board-orb ${draggedOrb === orb.id ? 'dragging' : ''} ${connectingFrom === orb.id ? 'connecting' : ''} ${connectingFrom && connectingFrom !== orb.id ? 'connectable' : ''} ${orb.linkedBoardId ? 'has-subboard' : ''}`}
                      style={{
                        left: orb.position.x,
                        top: orb.position.y,
                        '--orb-color': orb.color
                      }}
                      onMouseDown={(e) => handleOrbMouseDown(e, orb)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        openOrbEditor(orb);
                      }}
                      onDoubleClick={() => {
                        const c = getContentByOrb(orb);
                        if (c) {
                          setShowKnowledgePopup({
                            ...c,
                            orbId: orb.id,
                            orbLabel: orb.label || c.title || c.name || displayTitle,
                            sourceType: orb.sourceType,
                            linkedBoardId: orb.linkedBoardId,
                            tags: orb.tags || c.tags || (orb.entityType ? [orb.entityType.toUpperCase()] : ['NOTE']),
                            entityType: orb.entityType || c.entityType || 'note',
                            customImage: orb.customImage || (hasCustomIcon ? customIconUrl : null)
                          });
                        }
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
                      <span className="orb-title">{displayTitle}</span>
                    </div>
                  );
                })}

                {filteredOrbs.length === 0 && (
                  <div className="board-empty-floating">
                    <i className="fas fa-project-diagram"></i>
                    <p>Your knowledge board is empty</p>
                    <span>Click "Add Orb" or drag notes to start weaving lore</span>
                  </div>
                )}
              </div>

              {/* Floating Canvas Navigation & Zoom HUD */}
              <div className="canvas-floating-hud">
                <button
                  type="button"
                  className="btn-hud-control"
                  onClick={() => {
                    setZoomLevel(prev => Math.min(2.5, +(prev * 1.2).toFixed(2)));
                  }}
                  title="Zoom In"
                >
                  <i className="fas fa-plus"></i>
                </button>
                <button
                  type="button"
                  className="btn-hud-control btn-hud-pct"
                  onClick={resetBoardView}
                  title="Reset Pan & 100% Zoom"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  className="btn-hud-control"
                  onClick={() => {
                    setZoomLevel(prev => Math.max(0.35, +(prev * 0.83).toFixed(2)));
                  }}
                  title="Zoom Out"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <div className="hud-divider"></div>
                <button
                  type="button"
                  className="btn-hud-control"
                  onClick={fitOrbsInView}
                  title="Fit & Center All Orbs in View"
                >
                  <i className="fas fa-expand-arrows-alt"></i>
                </button>
              </div>
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
                      {knowledge.type === 'image' || knowledge.image ? (
                        <img src={knowledge.image || knowledge.content} alt="" />
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

        {/* Notes Section: Codex Manuscript Studio */}
        {activeSection === 'notes' && (
          <div className="journal-notes-studio">
            {/* Left Column: Notes List & Navigation Sidebar */}
            <div className="studio-sidebar">
              <div className="studio-sidebar-header">
                <div className="studio-sidebar-title">
                  <i className="fas fa-feather-pointed" style={{ color: '#8b5a1a' }}></i>
                  <span>Codex Notes ({filteredNotes.length})</span>
                </div>
                <button
                  type="button"
                  className="btn-new-studio-note"
                  onClick={() => {
                    setEditingNote(null);
                    setNoteTitle('');
                    setNoteContent('');
                    setNoteImage(null);
                  }}
                  title="Create a new note"
                >
                  <i className="fas fa-plus"></i> New Note
                </button>
              </div>

              <div className="studio-search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Filter notes or lore..."
                  value={noteSearchTerm}
                  onChange={(e) => setNoteSearchTerm(e.target.value)}
                />
                {noteSearchTerm && (
                  <button type="button" className="btn-clear-search" onClick={() => setNoteSearchTerm('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="studio-notes-scroll">
                {filteredNotes.length === 0 ? (
                  <div className="studio-empty-notes">
                    <i className="fas fa-scroll"></i>
                    <p>No notes found</p>
                    <span>Click "New Note" to begin drafting lore.</span>
                  </div>
                ) : (
                  filteredNotes.map(note => {
                    const isSelected = editingNote?.id === note.id;
                    return (
                      <div
                        key={note.id}
                        className={`studio-note-card ${isSelected ? 'selected' : ''}`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('note/id', note.id);
                        }}
                        onClick={() => {
                          setEditingNote(note);
                          setNoteTitle(note.title);
                          setNoteContent(note.content);
                          setNoteImage(note.image || null);
                        }}
                      >
                        {note.image && (
                          <img src={note.image} alt="" className="studio-card-thumb" />
                        )}
                        <div className="studio-card-body">
                          <div className="studio-card-top">
                            <span className="studio-card-title">{note.title || 'Untitled Note'}</span>
                            <button
                              type="button"
                              className="btn-studio-card-del"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm({ type: 'note', item: note });
                              }}
                              title="Delete note"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                          <p className="studio-card-snippet">
                            {(note.content || '').replace(/#+\s|:::[\w-]+|\*|\[\[|\]\]/g, '').substring(0, 75) || 'No text...'}
                          </p>
                          <div className="studio-card-foot">
                            <span className="studio-card-date">{new Date(note.lastModified || note.createdAt || Date.now()).toLocaleDateString()}</span>
                            {note.tags && note.tags.length > 0 && (
                              <span className="studio-card-tag">{note.tags[0]}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Grand Manuscript Studio & Real-time Live Split View */}
            <div className="studio-main-workspace">
              {/* Studio Top Control Bar */}
              <div className="studio-header-bar">
                <div className="studio-title-wrap">
                  <i className="fas fa-feather" style={{ color: '#8b5a1a', fontSize: '18px' }}></i>
                  <input
                    type="text"
                    className="studio-title-input"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Enter Note Title, Entity Name, or Lore Heading..."
                  />
                </div>

                <div className="studio-header-actions">
                  {/* View Mode Switcher */}
                  <div className="studio-view-toggle">
                    <button
                      type="button"
                      className={`view-toggle-btn ${noteViewMode === 'split' ? 'active' : ''}`}
                      onClick={() => setNoteViewMode('split')}
                      title="Side-by-side editing and real-time live manuscript preview"
                    >
                      <i className="fas fa-columns"></i> Live Split
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${noteViewMode === 'edit' ? 'active' : ''}`}
                      onClick={() => setNoteViewMode('edit')}
                      title="Focus on editor"
                    >
                      <i className="fas fa-pen"></i> Editor
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${noteViewMode === 'preview' ? 'active' : ''}`}
                      onClick={() => setNoteViewMode('preview')}
                      title="View full rendered manuscript"
                    >
                      <i className="fas fa-eye"></i> Manuscript
                    </button>
                  </div>

                  {/* Image Attachment Trigger */}
                  {noteImage ? (
                    <div className="studio-image-preview-badge">
                      <img src={noteImage} alt="" />
                      <button type="button" onClick={() => setNoteImage(null)} title="Remove attachment">×</button>
                    </div>
                  ) : (
                    <label className="btn-studio-attach" title="Attach portrait or map graphic">
                      <i className="fas fa-image"></i> Attach Image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, (dataUrl) => {
                              setNoteImage(dataUrl);
                            });
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="studio-formatting-ribbon">
                <div className="ribbon-group">
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('# ', '\n')} title="Heading 1">
                    <strong>H1</strong>
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('## ', '\n')} title="Heading 2">
                    <strong>H2</strong>
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('### ', '\n')} title="Heading 3">
                    <strong>H3</strong>
                  </button>
                </div>

                <div className="ribbon-divider"></div>

                <div className="ribbon-group">
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('**', '**')} title="Bold">
                    <i className="fas fa-bold"></i>
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('*', '*')} title="Italic">
                    <i className="fas fa-italic"></i>
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('==', '==')} title="Highlight">
                    <i className="fas fa-highlighter"></i>
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('[[', ']]')} title="Wiki Link (e.g. [[Nordhalla]])">
                    <i className="fas fa-link"></i> Wiki Link
                  </button>
                </div>

                <div className="ribbon-divider"></div>

                {/* Fantasy Callout Blocks */}
                <div className="ribbon-group">
                  <button type="button" className="btn-ribbon callout-readaloud" onClick={() => insertNoteSyntax(':::readaloud\nThe heavy oak doors groan open as cold air rushes into the hall...\n:::\n')} title="Read-Aloud Box">
                    <i className="fas fa-quote-left"></i> Read Aloud
                  </button>
                  <button type="button" className="btn-ribbon callout-gm" onClick={() => insertNoteSyntax(':::gmnote\n**Secret GM Note**: The guard is bribable for 10 gold.\n:::\n')} title="Secret GM Note">
                    <i className="fas fa-eye-slash"></i> GM Note
                  </button>
                  <button type="button" className="btn-ribbon callout-quest" onClick={() => insertNoteSyntax(':::quest\n**Quest Objective**: Recover the Sunstone of Thalreth.\n**Reward**: 150 GP and Faction Renown.\n:::\n')} title="Quest Hook">
                    <i className="fas fa-star"></i> Quest
                  </button>
                  <button type="button" className="btn-ribbon callout-npc" onClick={() => insertNoteSyntax(':::npc\n**Name**: Bilbo\n**Role**: Chronicler of the Rime\n**Disposition**: Friendly\n:::\n')} title="NPC Dossier Block">
                    <i className="fas fa-user"></i> NPC
                  </button>
                  <button type="button" className="btn-ribbon callout-statblock" onClick={() => insertNoteSyntax(':::statblock\n**Frost Wolf**\n**HP**: 34 | **Mana**: 0 | **AP**: 3 | **Speed**: 35ft\n**Traits**: Pack Tactics, Frostbite Bite\n:::\n')} title="Statblock Box">
                    <i className="fas fa-dragon"></i> Statblock
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('> [!NOTE]\n> **Footnote**: Recorded in the third cycle of the Eclipse.\n\n')} title="Footnote / Callout">
                    <i className="fas fa-sticky-note"></i> Footnote
                  </button>
                  <button type="button" className="btn-ribbon" onClick={() => insertNoteSyntax('\n---\n')} title="Filigree Divider">
                    <i className="fas fa-minus"></i> Filigree
                  </button>
                </div>
              </div>

              {/* Workspace Content Area */}
              <div className={`studio-panes-container ${noteViewMode}`}>
                {/* Editor Sub-pane */}
                {(noteViewMode === 'split' || noteViewMode === 'edit') && (
                  <div className="studio-pane editor-pane">
                    <textarea
                      id="mythrill-note-textarea"
                      className="studio-textarea"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Begin writing your campaign journal, lore, relationship web, family lineage, or quest notes here...

• Live updates: Formatting syntax (H1, :::gmnote, :::quest, :::readaloud) renders on the right in real-time!
• Use [[Entity Name]] for wiki links
• Use --- for ornamental dividers"
                    />
                  </div>
                )}

                {/* Live Manuscript Preview Sub-pane */}
                {(noteViewMode === 'split' || noteViewMode === 'preview') && (
                  <div className="studio-pane preview-pane">
                    <div className="manuscript-parchment-sheet">
                      {noteImage && (
                        <div className="manuscript-attached-header-img">
                          <img src={noteImage} alt="" />
                        </div>
                      )}
                      {noteTitle && (
                        <h1 className="manuscript-headline">{noteTitle}</h1>
                      )}
                      <RichLoreText text={noteContent || '*Start typing on the left to watch your manuscript render live in parchment style...*'} />
                    </div>
                  </div>
                )}
              </div>

              {/* Studio Bottom Action Bar */}
              <div className="studio-footer-bar">
                <div className="studio-footer-stats">
                  <span className="stat-pill">
                    <i className="fas fa-file-alt"></i> {(noteContent || '').trim() ? (noteContent.trim().split(/\s+/).length) : 0} Words
                  </span>
                  <span className="stat-pill">
                    <i className="fas fa-font"></i> {(noteContent || '').length} Chars
                  </span>
                  <span className="stat-cloud-status">
                    <i className="fas fa-cloud-check" style={{ color: '#27ae60' }}></i> Cloud Synced
                  </span>
                </div>

                <div className="studio-footer-actions">
                  {/* Promote to World Dropdown */}
                  <div className="note-promote-dropdown-wrapper">
                    <button
                      type="button"
                      className="btn-studio-promote"
                      onClick={() => setShowPromoteMenu(!showPromoteMenu)}
                      title="Promote this note into a Lineage, Faction, or Map Pin"
                    >
                      <i className="fas fa-bolt" style={{ color: '#d4af37' }}></i> Promote to World ▾
                    </button>
                    {showPromoteMenu && (
                      <div className="studio-promote-menu">
                        <button type="button" onClick={() => handlePromoteNote('lineage')}>
                          <i className="fas fa-dna" style={{ color: '#d4af37' }}></i>
                          <div>
                            <strong>Custom Lineage / Race</strong>
                            <small>Import into Custom Lineage Wizard</small>
                          </div>
                        </button>
                        <button type="button" onClick={() => handlePromoteNote('faction')}>
                          <i className="fas fa-shield-halved" style={{ color: '#3498db' }}></i>
                          <div>
                            <strong>Custom Faction</strong>
                            <small>Add to World Faction Web</small>
                          </div>
                        </button>
                        <button type="button" onClick={() => handlePromoteNote('map_pin')}>
                          <i className="fas fa-map-location-dot" style={{ color: '#2ecc71' }}></i>
                          <div>
                            <strong>Immerse Map Location</strong>
                            <small>Send to World Map as Map Pin</small>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-studio-add-orb"
                    onClick={handleAddCurrentNoteToBoard}
                    title="Create an Orb on the Knowledge Board from this note"
                  >
                    <i className="fas fa-project-diagram"></i> Add to Board ↗
                  </button>

                  {editingNote && (
                    <button
                      type="button"
                      className="btn-studio-cancel"
                      onClick={() => {
                        setEditingNote(null);
                        setNoteTitle('');
                        setNoteContent('');
                        setNoteImage(null);
                      }}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-studio-save"
                    onClick={handleSaveNote}
                    disabled={!noteTitle.trim()}
                  >
                    <i className="fas fa-save"></i>
                    {editingNote ? 'Update Note' : 'Save Note'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Knowledge / Note Popup Modal (Parchment Note Dossier) */}
      {showKnowledgePopup && createPortal(
        <div className="modal-overlay" onClick={() => setShowKnowledgePopup(null)}>
          <div className="knowledge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="knowledge-modal-header">
              <div className="knowledge-modal-title-wrap">
                <span className="dossier-icon-badge" style={{ background: showKnowledgePopup.color || '#8b5a1a' }}>
                  <i className={`fas ${
                    showKnowledgePopup.entityType === 'npc' ? 'fa-user' :
                    showKnowledgePopup.entityType === 'location' ? 'fa-landmark' :
                    showKnowledgePopup.entityType === 'quest' ? 'fa-star' :
                    showKnowledgePopup.entityType === 'faction' ? 'fa-shield-halved' :
                    showKnowledgePopup.entityType === 'monster' ? 'fa-dragon' :
                    showKnowledgePopup.entityType === 'item' ? 'fa-gem' :
                    showKnowledgePopup.entityType === 'lineage' || showKnowledgePopup.entityType === 'race' ? 'fa-dna' : 'fa-scroll'
                  }`}></i>
                </span>
                <div>
                  <h3>{showKnowledgePopup.title || showKnowledgePopup.orbLabel || 'Knowledge Record'}</h3>
                  <span className="dossier-type-tag">{showKnowledgePopup.entityType ? showKnowledgePopup.entityType.toUpperCase() : 'NOTE'}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowKnowledgePopup(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Interactive Tags Section */}
            <div className="dossier-tags-section">
              <div className="dossier-tags-label">
                <i className="fas fa-tags"></i> Tags:
              </div>
              <div className="dossier-tags-list">
                {(showKnowledgePopup.tags || []).map((tag, tIdx) => (
                  <span key={tIdx} className="dossier-tag-chip">
                    {tag}
                    {showKnowledgePopup.orbId && (
                      <button
                        type="button"
                        className="btn-remove-tag"
                        onClick={() => {
                          removeTagFromOrb(showKnowledgePopup.orbId, tag);
                          setShowKnowledgePopup(prev => ({
                            ...prev,
                            tags: (prev.tags || []).filter(t => t !== tag)
                          }));
                        }}
                        title={`Remove tag "${tag}"`}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                
                {/* Inline Tag Adder */}
                {showKnowledgePopup.orbId && (
                  <div className="dossier-add-tag-wrap">
                    <input
                      type="text"
                      className="dossier-tag-input"
                      placeholder="+ Add tag..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTagInput.trim()) {
                          const tag = newTagInput.trim();
                          addTagToOrb(showKnowledgePopup.orbId, tag);
                          setShowKnowledgePopup(prev => ({
                            ...prev,
                            tags: [...(prev.tags || []), tag]
                          }));
                          setNewTagInput('');
                        }
                      }}
                    />
                    {newTagInput.trim() && (
                      <button
                        type="button"
                        className="btn-submit-tag"
                        onClick={() => {
                          const tag = newTagInput.trim();
                          addTagToOrb(showKnowledgePopup.orbId, tag);
                          setShowKnowledgePopup(prev => ({
                            ...prev,
                            tags: [...(prev.tags || []), tag]
                          }));
                          setNewTagInput('');
                        }}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tag Presets */}
            {showKnowledgePopup.orbId && (
              <div className="dossier-quick-presets">
                <span className="preset-label">Quick:</span>
                {['Important', 'Allied', 'Hostile', 'Secret', 'Active', 'Completed'].map(preset => {
                  const hasPreset = (showKnowledgePopup.tags || []).includes(preset);
                  if (hasPreset) return null;
                  return (
                    <button
                      key={preset}
                      type="button"
                      className="btn-quick-preset"
                      onClick={() => {
                        addTagToOrb(showKnowledgePopup.orbId, preset);
                        setShowKnowledgePopup(prev => ({
                          ...prev,
                          tags: [...(prev.tags || []), preset]
                        }));
                      }}
                    >
                      + {preset}
                    </button>
                  );
                })}
              </div>
            )}

            {/* If item has an image, portrait, or customImage */}
            {(showKnowledgePopup.image || showKnowledgePopup.imageUrl || showKnowledgePopup.customImage || showKnowledgePopup.type === 'image' || (showKnowledgePopup.iconType && isCustomIcon(showKnowledgePopup.iconType))) && (
              <div className="knowledge-modal-image-wrapper">
                <img
                  src={
                    showKnowledgePopup.image ||
                    showKnowledgePopup.imageUrl ||
                    showKnowledgePopup.customImage ||
                    (showKnowledgePopup.type === 'image' ? showKnowledgePopup.content : null) ||
                    getOrbIconUrl(showKnowledgePopup.iconType)
                  }
                  alt={showKnowledgePopup.title}
                  className="modal-image"
                />
              </div>
            )}

            {(showKnowledgePopup.type === 'text' || showKnowledgePopup.sourceType === 'note' || !showKnowledgePopup.type) && (
              <div className="modal-text"><RichLoreText text={showKnowledgePopup.content} /></div>
            )}
            {showKnowledgePopup.description && (
              <p className="modal-description"><i className="fas fa-quote-left"></i> {showKnowledgePopup.description}</p>
            )}

            {/* Action Footer to Enter/Dive into Sub-Board */}
            <div className="knowledge-modal-actions">
              {showKnowledgePopup.orbId && (
                <button
                  type="button"
                  className="btn-dive-subboard"
                  title={showKnowledgePopup.linkedBoardId ? "Dive straight into this orb's sub-board" : "Create a dedicated sub-board for this entity and dive into it"}
                  onClick={() => {
                    if (showKnowledgePopup.linkedBoardId) {
                      setCurrentBoard(showKnowledgePopup.linkedBoardId);
                    } else {
                      createSubBoardForOrb(showKnowledgePopup.orbId, showKnowledgePopup.title || showKnowledgePopup.orbLabel || 'Sub-Board', true);
                    }
                    setShowKnowledgePopup(null);
                  }}
                >
                  <i className="fas fa-level-down-alt"></i>
                  <span>Dive Into Board ↗</span>
                </button>
              )}
              {showKnowledgePopup.orbId && (
                <button
                  type="button"
                  className="btn-edit-from-popup"
                  onClick={() => {
                    const orb = knowledgeOrbs.find(o => o.id === showKnowledgePopup.orbId);
                    if (orb) {
                      setOrbEditorLabel(orb.label || showKnowledgePopup.title || '');
                      setShowOrbEditor(orb);
                    }
                    setShowKnowledgePopup(null);
                  }}
                >
                  <i className="fas fa-edit"></i>
                  <span>Edit Orb</span>
                </button>
              )}
              <button
                type="button"
                className="btn-close-popup"
                onClick={() => setShowKnowledgePopup(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Orb Editor Modal */}
      {showOrbEditor && createPortal(
        <div className="modal-overlay" onClick={() => setShowOrbEditor(null)}>
          <div className="folder-modal orb-editor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4><i className="fas fa-magic"></i> Edit Knowledge Orb</h4>
              <button className="modal-close-btn" onClick={() => setShowOrbEditor(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Orb Label / Name Input */}
              <div className="form-field">
                <label>Orb Title / Name</label>
                <input
                  type="text"
                  value={orbEditorLabel}
                  onChange={(e) => {
                    setOrbEditorLabel(e.target.value);
                    updateOrb(showOrbEditor.id, { label: e.target.value });
                  }}
                  placeholder="Enter orb title or character name..."
                />
              </div>

              {/* Linked Sub-Board / Node Drilldown */}
              <div className="form-field" style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1.5px solid rgba(139, 69, 19, 0.3)', borderRadius: '8px', padding: '12px 14px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ color: '#5a1e12', fontWeight: 700, fontFamily: 'Cinzel, serif', fontSize: '12px' }}><i className="fas fa-network-wired"></i> Linked Sub-Board / Drilldown</span>
                  {showOrbEditor.linkedBoardId && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ fontSize: '11px', padding: '3px 8px', background: '#d4af37', border: '1px solid #8b6508', color: '#1a1005', fontWeight: 700 }}
                      onClick={() => {
                        setCurrentBoard(showOrbEditor.linkedBoardId);
                        setShowOrbEditor(null);
                      }}
                    >
                      <i className="fas fa-level-down-alt"></i> Dive In ↗
                    </button>
                  )}
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={showOrbEditor.linkedBoardId || ''}
                    onChange={(e) => {
                      const targetId = e.target.value || null;
                      updateOrb(showOrbEditor.id, { linkedBoardId: targetId });
                      setShowOrbEditor(prev => ({ ...prev, linkedBoardId: targetId }));
                    }}
                    style={{ background: '#ffffff', color: '#2d1810', border: '1.5px solid rgba(139, 69, 19, 0.35)', borderRadius: '5px', padding: '6px 10px', fontSize: '12.5px', flex: 1, fontWeight: 600 }}
                  >
                    <option value="">-- No Linked Sub-Board --</option>
                    {knowledgeBoards
                      .filter(b => b.id !== currentBoardId)
                      .map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="btn"
                    style={{ whiteSpace: 'nowrap', fontSize: '11.5px', padding: '6px 10px', background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', border: '1px solid #8b6508', color: '#1a1005', fontWeight: 700, borderRadius: '5px', cursor: 'pointer' }}
                    onClick={() => {
                      createSubBoardForOrb(showOrbEditor.id, orbEditorLabel || showOrbEditor.label || 'Sub-Board', true);
                      setShowOrbEditor(null);
                    }}
                    title="Create a new nested board for this entity and jump into it"
                  >
                    <i className="fas fa-plus"></i> Create Sub-Board
                  </button>
                </div>
              </div>

              {/* Custom Image / PNG Upload Section */}
              <div className="form-field">
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

              {/* Standard Icons Grid */}
              <div className="form-field">
                <label>Or Choose Standard Icon</label>
                <div className="orb-editor-icon-grid">
                  {ORB_ICONS.map(icon => (
                    <button
                      key={icon.id}
                      type="button"
                      className={`orb-editor-icon-btn ${showOrbEditor.iconType === icon.id ? 'selected' : ''}`}
                      onClick={() => {
                        updateOrb(showOrbEditor.id, { iconType: icon.id, customImage: null });
                        setShowOrbEditor(prev => ({ ...prev, iconType: icon.id, customImage: null }));
                      }}
                      title={icon.label}
                    >
                      <i className={`fas ${icon.icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches Grid */}
              <div className="form-field">
                <label>Orb Glow Color</label>
                <div className="folder-color-grid">
                  {ORB_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`folder-color-btn ${showOrbEditor.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        updateOrb(showOrbEditor.id, { color });
                        setShowOrbEditor(prev => ({ ...prev, color }));
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  removeOrb(showOrbEditor.id);
                  setShowOrbEditor(null);
                }}
              >
                <i className="fas fa-trash"></i> Remove
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (orbEditorLabel) {
                    updateOrb(showOrbEditor.id, { label: orbEditorLabel.trim() });
                  }
                  setShowOrbEditor(null);
                }}
              >
                <i className="fas fa-check"></i> Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Campaign Entity Weaver Modal */}
      {showCampaignWeaverModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowCampaignWeaverModal(false)}>
          <div className="campaign-weaver-modal" onClick={(e) => e.stopPropagation()}>
            <div className="weaver-modal-header">
              <div className="weaver-header-title">
                <i className="fas fa-network-wired"></i>
                <div>
                  <h4>Weave Campaign Entities</h4>
                  <span className="weaver-subtitle">Pull NPCs, Locations, Quests, Factions, and Lore onto your Knowledge Board</span>
                </div>
              </div>
              <button className="weaver-close-btn" onClick={() => setShowCampaignWeaverModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="weaver-modal-body">
              {/* Search Bar */}
              <div className="weaver-search-wrap">
                <i className="fas fa-search weaver-search-icon"></i>
                <input
                  type="text"
                  className="weaver-search-input"
                  placeholder="Search campaign NPCs, Locations, Quests, Items, Monsters, Lore, Factions..."
                  value={campaignWeaverSearch}
                  onChange={(e) => setCampaignWeaverSearch(e.target.value)}
                />
                {campaignWeaverSearch && (
                  <button type="button" className="weaver-search-clear" onClick={() => setCampaignWeaverSearch('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="weaver-tabs-row">
                {[
                  { id: 'all', label: 'All Entities', icon: 'fa-layer-group' },
                  { id: 'npc', label: 'NPCs', icon: 'fa-user' },
                  { id: 'location', label: 'Locations', icon: 'fa-landmark' },
                  { id: 'quest', label: 'Quests', icon: 'fa-star' },
                  { id: 'faction', label: 'Factions', icon: 'fa-shield-halved' },
                  { id: 'monster', label: 'Monsters', icon: 'fa-dragon' },
                  { id: 'item', label: 'Items', icon: 'fa-gem' },
                  { id: 'lore', label: 'Lore', icon: 'fa-book-open' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`weaver-filter-btn ${campaignWeaverTab === tab.id ? 'active' : ''}`}
                    onClick={() => setCampaignWeaverTab(tab.id)}
                  >
                    <i className={`fas ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Entity Grid */}
              <div className="weaver-cards-grid">
                {campaignEntities
                  .filter(ent => {
                    const matchesTab = campaignWeaverTab === 'all' || ent.type === campaignWeaverTab;
                    const matchesSearch = !campaignWeaverSearch ||
                      ent.name.toLowerCase().includes(campaignWeaverSearch.toLowerCase()) ||
                      ent.description.toLowerCase().includes(campaignWeaverSearch.toLowerCase());
                    return matchesTab && matchesSearch;
                  })
                  .map(ent => (
                    <div key={`${ent.type}-${ent.id}`} className="weaver-card">
                      <div className="weaver-card-top">
                        <span className={`weaver-type-tag type-${ent.type}`}>
                          <i className={`fas ${
                            ent.type === 'npc' ? 'fa-user' :
                            ent.type === 'location' ? 'fa-landmark' :
                            ent.type === 'quest' ? 'fa-star' :
                            ent.type === 'faction' ? 'fa-shield-halved' :
                            ent.type === 'monster' ? 'fa-dragon' :
                            ent.type === 'item' ? 'fa-gem' : 'fa-book-open'
                          }`}></i>
                          <span>{ent.type}</span>
                        </span>
                      </div>

                      <div className="weaver-card-middle">
                        <h5 className="weaver-card-name">{ent.name}</h5>
                        <p className="weaver-card-text">
                          {ent.description || 'No additional notes'}
                        </p>
                      </div>

                      <div className="weaver-card-actions">
                        <button
                          type="button"
                          className="btn-weaver-add-orb"
                          onClick={() => {
                            addCampaignEntityAsOrb(ent, ent.type);
                            setShowCampaignWeaverModal(false);
                          }}
                        >
                          <i className="fas fa-plus"></i> Add as Orb
                        </button>
                        {ent.type === 'location' && (
                          <button
                            type="button"
                            className="btn-weaver-subboard"
                            title="Add Location Orb and automatically create a dedicated nested Sub-Board to place NPCs inside!"
                            onClick={() => {
                              const { orbId } = addCampaignEntityAsOrb(ent, ent.type);
                              createSubBoardForOrb(orbId, ent.name, true);
                              setShowCampaignWeaverModal(false);
                            }}
                          >
                            <i className="fas fa-level-down-alt"></i> + Sub-Board ↗
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                {campaignEntities.length === 0 && (
                  <div className="weaver-empty-state">
                    <i className="fas fa-feather-alt"></i>
                    <h5>No Campaign Entities Found</h5>
                    <p>Create NPCs, Locations, or Homebrew in the Campaign Manager to weave them here!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="weaver-modal-footer">
              <button
                type="button"
                className="btn-weaver-close"
                onClick={() => setShowCampaignWeaverModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Folder Creation/Editing Modal */}
      {showFolderModal && createPortal(
        <div className="modal-overlay folder-modal-overlay" onClick={() => setShowFolderModal(false)}>
          <div className="folder-modal journal-folder-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{editingFolder ? 'Edit Folder' : 'Create New Folder'}</h4>

            <div className="form-field">
              <label>Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name..."
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
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveFolder}
                disabled={!newFolderName.trim()}
              >
                <i className="fas fa-check"></i> {editingFolder ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Board Creation/Editing Modal */}
      {showBoardModal && createPortal(
        <div className="modal-overlay board-modal-overlay" onClick={() => setShowBoardModal(false)}>
          <div className="folder-modal board-creation-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{editingBoard ? 'Edit Knowledge Board' : 'Create New Knowledge Board'}</h4>

            {/* Board Presets */}
            {!editingBoard && (
              <div className="board-presets-section">
                <label className="field-label-sub">Quick Board Presets</label>
                <div className="board-presets-grid">
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => {
                      setNewBoardName('Regional Atlas & Map Notes');
                      setNewBoardIcon('fa-map');
                      setNewBoardColor('#3498db');
                    }}
                  >
                    <i className="fas fa-map"></i>
                    <span>Regional Map</span>
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => {
                      setNewBoardName('Lineages & Bloodlines');
                      setNewBoardIcon('fa-crown');
                      setNewBoardColor('#d4af37');
                    }}
                  >
                    <i className="fas fa-crown"></i>
                    <span>Lineages</span>
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => {
                      setNewBoardName('Plot Threads & Clues');
                      setNewBoardIcon('fa-scroll');
                      setNewBoardColor('#9b59b6');
                    }}
                  >
                    <i className="fas fa-scroll"></i>
                    <span>Plot & Mystery</span>
                  </button>
                  <button
                    type="button"
                    className="preset-btn"
                    onClick={() => {
                      setNewBoardName('Chronicles & Codex');
                      setNewBoardIcon('fa-book');
                      setNewBoardColor('#2ecc71');
                    }}
                  >
                    <i className="fas fa-book"></i>
                    <span>Codex</span>
                  </button>
                </div>
              </div>
            )}

            <div className="form-field">
              <label>Board Name</label>
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="e.g. Nordhalla Exploration or House Thalreth Lineage..."
                autoFocus
              />
            </div>

            <div className="form-field">
              <label>Board Icon</label>
              <div className="orb-icon-grid">
                {BOARD_ICONS.map(icon => (
                  <button
                    key={icon.id}
                    className={`orb-icon-option ${newBoardIcon === icon.icon ? 'selected' : ''}`}
                    onClick={() => setNewBoardIcon(icon.icon)}
                    title={icon.label}
                  >
                    <i className={`fas ${icon.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label>Board Color</label>
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
                <i className="fas fa-times"></i> Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveBoard}
                disabled={!newBoardName.trim()}
              >
                <i className="fas fa-check"></i> {editingBoard ? 'Save' : 'Create'}
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
                <i className="fas fa-times"></i> Cancel
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

      {/* Enhanced Background Selection Modal (Custom Maps, Atlas Maps, Scenery) */}
      {showBackgroundModal && createPortal(
        <div className="modal-overlay background-modal-overlay" onClick={() => setShowBackgroundModal(false)}>
          <div className="folder-modal background-selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4><i className="fas fa-map"></i> Set Board Background & Canvas</h4>
              <button className="modal-close-btn" onClick={() => setShowBackgroundModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Background Placement Mode Selector */}
              <div className="bg-mode-selector-bar">
                <span className="bg-mode-label"><i className="fas fa-layer-group"></i> Placement Mode:</span>
                <div className="bg-mode-toggle-group">
                  <button
                    type="button"
                    className={`bg-mode-btn ${bgModalMode === 'canvas' ? 'active' : ''}`}
                    onClick={() => setBgModalMode('canvas')}
                    title="Background is bound to canvas coordinates and pans/zooms with your map pins"
                  >
                    <i className="fas fa-map-location-dot"></i> 🗺️ Pinned to Map (Pans & Zooms)
                  </button>
                  <button
                    type="button"
                    className={`bg-mode-btn ${bgModalMode === 'static' ? 'active' : ''}`}
                    onClick={() => setBgModalMode('static')}
                    title="Background stays stationary like wallpaper while orbs and pins float over it"
                  >
                    <i className="fas fa-thumbtack"></i> 📌 Static Backdrop (Fixed Window)
                  </button>
                </div>
              </div>

              {/* Category tabs */}
              <div className="bg-category-tabs">
                <button
                  type="button"
                  className={`bg-tab-btn ${bgCategoryTab === 'maps' ? 'active' : ''}`}
                  onClick={() => setBgCategoryTab('maps')}
                >
                  <i className="fas fa-atlas"></i> World & Regional Maps
                </button>
                <button
                  type="button"
                  className={`bg-tab-btn ${bgCategoryTab === 'upload' ? 'active' : ''}`}
                  onClick={() => setBgCategoryTab('upload')}
                >
                  <i className="fas fa-upload"></i> Upload Custom Map
                </button>
                <button
                  type="button"
                  className={`bg-tab-btn ${bgCategoryTab === 'scenery' ? 'active' : ''}`}
                  onClick={() => setBgCategoryTab('scenery')}
                >
                  <i className="fas fa-mountain-sun"></i> Atmospheric Scenery
                </button>
              </div>

              {/* Tab 1: World & Regional Maps */}
              {bgCategoryTab === 'maps' && (
                <div className="background-grid">
                  <div
                    className={`background-option ${!getBoardBackground() ? 'selected' : ''}`}
                    onClick={() => {
                      clearBoardBackground();
                      syncToCloud(user?.uid);
                      setShowBackgroundModal(false);
                    }}
                  >
                    <div className="bg-preview-none">
                      <i className="fas fa-ban"></i>
                    </div>
                    <span className="bg-name">None (Grid Canvas)</span>
                  </div>

                  {/* Canonical Map Presets */}
                  {CANONICAL_MAP_PRESETS.map((m) => {
                    const isSelected = getBoardBackground()?.url === m.image;
                    return (
                      <div
                        key={m.id}
                        className={`background-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setBoardBackground({ url: m.image, name: m.name, isMap: true, mapId: m.id, bgMode: bgModalMode });
                          syncToCloud(user?.uid);
                          setShowBackgroundModal(false);
                        }}
                      >
                        <div className="bg-preview">
                          <img src={m.image} alt={m.name} />
                        </div>
                        <span className="bg-name">{m.name}</span>
                      </div>
                    );
                  })}

                  {/* Custom Uploaded Maps from Archmage Map Manager */}
                  {Object.values(getCustomMaps()).map((cm) => {
                    const isSelected = getBoardBackground()?.url === cm.image;
                    return (
                      <div
                        key={cm.id}
                        className={`background-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setBoardBackground({ url: cm.image, name: cm.name, isMap: true, mapId: cm.id, bgMode: bgModalMode });
                          syncToCloud(user?.uid);
                          setShowBackgroundModal(false);
                        }}
                      >
                        <div className="bg-preview">
                          <img src={cm.image} alt={cm.name} />
                        </div>
                        <span className="bg-name">{cm.name} (Custom)</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Upload Custom Map / Image File */}
              {bgCategoryTab === 'upload' && (
                <div className="custom-map-upload-box">
                  <label className="custom-map-dropzone">
                    <i className="fas fa-cloud-arrow-up"></i>
                    <span>Click or drag image to upload custom map or battlemap</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCustomBgName(file.name);
                          const reader = new FileReader();
                          reader.onload = (ev) => setCustomBgPreview(ev.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {customBgPreview && (
                    <div className="custom-bg-preview-row">
                      <div className="preview-img-wrap">
                        <img src={customBgPreview} alt="Custom Map Preview" />
                      </div>
                      <div className="preview-actions">
                        <p className="preview-filename">{customBgName || 'Custom Map Ready'}</p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setBoardBackground({ url: customBgPreview, name: customBgName || 'Custom Map', isCustom: true, bgMode: bgModalMode });
                            syncToCloud(user?.uid);
                            setShowBackgroundModal(false);
                          }}
                        >
                          <i className="fas fa-check"></i> Apply as Board Background
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Atmospheric Scenery */}
              {bgCategoryTab === 'scenery' && (
                <div className="background-grid">
                  {BACKGROUND_FILES.map(bgFile => {
                    const bgUrl = getBackgroundImageUrl(bgFile);
                    const isSelected = getBoardBackground()?.url === bgFile;
                    return (
                      <div
                        key={bgFile}
                        className={`background-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setBoardBackground({ url: bgFile, name: bgFile.replace('.png', '').replace(/([A-Z])/g, ' $1').trim(), bgMode: bgModalMode });
                          syncToCloud(user?.uid);
                          setShowBackgroundModal(false);
                        }}
                      >
                        <div className="bg-preview">
                          <img src={bgUrl} alt={bgFile} />
                        </div>
                        <span className="bg-name">{bgFile.replace('.png', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowBackgroundModal(false)}>
                <i className="fas fa-times"></i> Close
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
                      placeholder="Search items, notes, NPCs, lore..."
                      value={addOrbSearchTerm}
                      onChange={(e) => setAddOrbSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="orb-editor-section">
                  <div className="board-toolbar-actions" style={{ marginBottom: '12px', display: 'flex', gap: '6px' }}>
                    <button
                      className={`btn ${addOrbActiveTab === 'received' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: '11px', padding: '8px' }}
                      onClick={() => setAddOrbActiveTab('received')}
                    >
                      <i className="fas fa-inbox"></i> Received ({searchedKnowledge.length})
                    </button>
                    <button
                      className={`btn ${addOrbActiveTab === 'notes' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: '11px', padding: '8px' }}
                      onClick={() => setAddOrbActiveTab('notes')}
                    >
                      <i className="fas fa-sticky-note"></i> Notes ({searchedNotes.length})
                    </button>
                    <button
                      className={`btn ${addOrbActiveTab === 'campaign' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, fontSize: '11px', padding: '8px' }}
                      onClick={() => setAddOrbActiveTab('campaign')}
                    >
                      <i className="fas fa-scroll"></i> Campaign ({searchedCampaignItems.length})
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
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'var(--my-parchment-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddOrbPopup(false);
                      setAddOrbStep('select');
                      setSelectedItemForOrb(null);
                    }}
                    style={{ flex: 1 }}
                  >
                    <i className="fas fa-times"></i> Cancel
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
                    className="btn btn-secondary"
                    onClick={() => {
                      setAddOrbStep('select');
                      setSelectedItemForOrb(null);
                    }}
                  >
                    <i className="fas fa-chevron-left"></i> Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddOrbConfirm}
                  >
                    <i className="fas fa-plus-circle"></i> Add to Board
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Board Atlas / Connected Hierarchy Tree Modal */}
      {showBoardAtlasModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowBoardAtlasModal(false)}>
          <div className="folder-modal board-atlas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header atlas-header">
              <div className="atlas-header-title">
                <i className="fas fa-sitemap" style={{ color: '#d4af37' }}></i>
                <h4>Connected Boards & Atlas Overview</h4>
              </div>
              <button className="modal-close-btn" onClick={() => setShowBoardAtlasModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body atlas-body">
              <p className="atlas-hint">
                View your interconnected campaign and world boards. Click any board to jump directly into it.
              </p>

              <div className="atlas-tree-list">
                {/* Master Overview Board */}
                <div className={`atlas-tree-item root ${!currentBoardId ? 'current-active' : ''}`}>
                  <div className="atlas-item-left">
                    <span className="atlas-item-icon" style={{ background: '#3d2314', color: '#d4af37' }}>
                      <i className="fas fa-layer-group"></i>
                    </span>
                    <div className="atlas-item-info">
                      <span className="atlas-item-name">Master Overview Board</span>
                      <span className="atlas-item-sub">Root Campaign Board</span>
                    </div>
                  </div>
                  <div className="atlas-item-right">
                    <span className="atlas-count-badge">
                      {(knowledgeOrbs || []).filter(o => !o.boardId).length} Orbs
                    </span>
                    <button
                      type="button"
                      className="btn-atlas-jump"
                      onClick={() => {
                        setCurrentBoard(null);
                        setShowBoardAtlasModal(false);
                      }}
                    >
                      Jump to Board ↗
                    </button>
                  </div>
                </div>

                {/* All Custom & Sub-Boards */}
                {(knowledgeBoards || []).map(board => {
                  const isCurrent = currentBoardId === board.id;
                  const orbCount = (knowledgeOrbs || []).filter(o => o.boardId === board.id).length;
                  const parentBoard = knowledgeBoards.find(b => b.id === board.parentBoardId);
                  const isNested = Boolean(board.parentBoardId);

                  return (
                    <div
                      key={board.id}
                      className={`atlas-tree-item ${isNested ? 'nested' : ''} ${isCurrent ? 'current-active' : ''}`}
                    >
                      <div className="atlas-item-left">
                        {isNested && <span className="atlas-nest-indent"><i className="fas fa-turn-up fa-rotate-90"></i></span>}
                        <span className="atlas-item-icon" style={{ background: board.color || '#d4af37', color: '#1a1005' }}>
                          <i className={`fas ${board.icon || 'fa-project-diagram'}`}></i>
                        </span>
                        <div className="atlas-item-info">
                          <span className="atlas-item-name">{board.name}</span>
                          <span className="atlas-item-sub">
                            {parentBoard ? `Sub-board of ${parentBoard.name}` : 'Custom Board'}
                          </span>
                        </div>
                      </div>
                      <div className="atlas-item-right">
                        <span className="atlas-count-badge">{orbCount} Orbs</span>
                        <button
                          type="button"
                          className="btn-atlas-edit"
                          title="Rename board or change icon/color"
                          onClick={() => {
                            setEditingBoard(board);
                            setNewBoardName(board.name);
                            setNewBoardColor(board.color || FOLDER_COLORS[0]);
                            setNewBoardIcon(board.icon || 'fa-project-diagram');
                            setShowBoardAtlasModal(false);
                            setShowBoardModal(true);
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          type="button"
                          className="btn-atlas-jump"
                          onClick={() => {
                            setCurrentBoard(board.id);
                            setShowBoardAtlasModal(false);
                          }}
                        >
                          Jump to Board ↗
                        </button>
                      </div>
                    </div>
                  );
                })}

                {knowledgeBoards.length === 0 && (
                  <div className="atlas-empty-note">
                    <i className="fas fa-info-circle"></i>
                    <span>No sub-boards created yet. Enter any orb or click "New Board" to start nesting locations and relationships.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setEditingBoard(null);
                  setNewBoardName('');
                  setNewBoardColor(FOLDER_COLORS[0]);
                  setNewBoardIcon('fa-project-diagram');
                  setShowBoardModal(true);
                  setShowBoardAtlasModal(false);
                }}
              >
                <i className="fas fa-plus"></i> Create New Board
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowBoardAtlasModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Lineage Wizard for Fast Worldbuilding in Journal */}
      <CustomLineageWizard />
    </div>
  );
};

export default AccountJournalManager;

