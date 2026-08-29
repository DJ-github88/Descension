import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useCustomLineageStore from '../../store/customLineageStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import StylusDrawingCanvas from '../common/StylusDrawingCanvas';
import './styles/PlotConspiracyBoard.css';

// Evidence classification stamps (no emojis)
const EVIDENCE_STAMPS = [
  { id: 'suspect', label: 'SUSPECT', class: 'stamp-suspect', icon: 'fa-user-secret' },
  { id: 'poi', label: 'PERSON OF INTEREST', class: 'stamp-poi', icon: 'fa-eye' },
  { id: 'evidence', label: 'EVIDENCE', class: 'stamp-evidence', icon: 'fa-fingerprint' },
  { id: 'confidential', label: 'CONFIDENTIAL', class: 'stamp-confidential', icon: 'fa-lock' },
  { id: 'deceased', label: 'DECEASED', class: 'stamp-deceased', icon: 'fa-skull' },
  { id: 'verified', label: 'VERIFIED', class: 'stamp-verified', icon: 'fa-check' },
  { id: 'solved', label: 'SOLVED', class: 'stamp-solved', icon: 'fa-circle-check' },
  { id: 'herring', label: 'RED HERRING', class: 'stamp-herring', icon: 'fa-diamond' }
];

// Common TTRPG thread relationship labels
const RELATIONSHIP_PRESETS = [
  'Suspect',
  'Witness',
  'Location of Incident',
  'Motive / Blackmail',
  'Evidence Found',
  'Faction Connection',
  'Leads to',
  'Secret Meeting',
  'Allied With',
  'Opposed To'
];

// Thread yarn colors (no emojis)
const YARN_COLORS = [
  { id: 'red', name: 'Classic Red Thread', hex: '#c0392b', class: 'yarn-color-red' },
  { id: 'crimson', name: 'Dark Crimson', hex: '#7b1e15', class: 'yarn-color-crimson' },
  { id: 'yellow', name: 'Caution Gold', hex: '#d4ac0d', class: 'yarn-color-yellow' },
  { id: 'purple', name: 'Arcane Violet', hex: '#8e44ad', class: 'yarn-color-purple' },
  { id: 'green', name: 'Faction Green', hex: '#27ae60', class: 'yarn-color-green' },
  { id: 'blue', name: 'Lead Blue', hex: '#2980b9', class: 'yarn-color-blue' },
  { id: 'white', name: 'Chalk White', hex: '#bdc3c7', class: 'yarn-color-white' }
];

// Pin colors
const PIN_COLORS = ['pin-red', 'pin-brass', 'pin-silver', 'pin-black', 'pin-green'];

// Helper to calculate exact bounding box and pushpin anchor for any card variant
export function getNodeBounds(node) {
  let width = 190;
  let height = 130;
  let pinOffsetX = 95;
  let pinOffsetY = 2;

  switch (node.cardStyle) {
    case 'polaroid':
      width = 170;
      height = 230;
      pinOffsetX = 85;
      pinOffsetY = 2;
      break;
    case 'dossier':
      width = 220;
      height = 135;
      pinOffsetX = 110;
      pinOffsetY = 2;
      break;
    case 'indexcard':
      width = 190;
      height = 130;
      pinOffsetX = 95;
      pinOffsetY = 2;
      break;
    case 'quest':
      width = 200;
      height = 140;
      pinOffsetX = 100;
      pinOffsetY = 2;
      break;
    case 'sticky':
      width = 170;
      height = 150;
      pinOffsetX = 85;
      pinOffsetY = 2;
      break;
    case 'clue':
      width = 210;
      height = 135;
      pinOffsetX = 105;
      pinOffsetY = 2;
      break;
    default:
      width = 190;
      height = 130;
      pinOffsetX = 95;
      pinOffsetY = 2;
  }

  return {
    left: node.x,
    top: node.y,
    right: node.x + width,
    bottom: node.y + height,
    width,
    height,
    pinX: node.x + pinOffsetX,
    pinY: node.y + pinOffsetY
  };
}

// Compute string curve and place thread titles in clear, unobstructed open space
export function calculateThreadGeometry(conn, fromNode, toNode, allNodes = []) {
  if (!fromNode || !toNode) return null;

  const b1 = getNodeBounds(fromNode);
  const b2 = getNodeBounds(toNode);

  const x1 = b1.pinX;
  const y1 = b1.pinY;
  const x2 = b2.pinX;
  const y2 = b2.pinY;

  const midX = (x1 + x2) / 2;
  const baseMidY = (y1 + y2) / 2;
  const defaultSag = conn.sag !== undefined ? conn.sag : 28;

  // Bezier curve evaluation helper
  const getPointAt = (t, ctrlX, ctrlY) => {
    const inv = 1 - t;
    const x = inv * inv * x1 + 2 * inv * t * ctrlX + t * t * x2;
    const y = inv * inv * y1 + 2 * inv * t * ctrlY + t * t * y2;
    const dx = 2 * inv * (ctrlX - x1) + 2 * t * (x2 - ctrlX);
    const dy = 2 * inv * (ctrlY - y1) + 2 * t * (y2 - ctrlY);
    return { x, y, dx, dy };
  };

  const isOverlapping = (rect, box, pad = 6) => {
    return !(
      rect.right < box.left - pad ||
      rect.left > box.right + pad ||
      rect.bottom < box.top - pad ||
      rect.top > box.bottom + pad
    );
  };

  const tagLabel = conn.label || '';
  const tagWidth = Math.max(54, tagLabel.length * 8 + 26);
  const tagHeight = 24;

  const relevantBoxes = [b1, b2];
  if (Array.isArray(allNodes)) {
    for (const n of allNodes) {
      if (n.id !== fromNode.id && n.id !== toNode.id) {
        relevantBoxes.push(getNodeBounds(n));
      }
    }
  }

  // Candidate sag values if standard sag is obstructed by cards
  const sagCandidates = [
    defaultSag,
    defaultSag + 24,
    defaultSag + 50,
    Math.max(14, defaultSag - 16),
    defaultSag + 80,
    -defaultSag
  ];

  // Sample t along the curve from 0.15 to 0.85
  const tSteps = [];
  for (let step = 0; step <= 35; step++) {
    const delta = (step === 0 ? 0 : Math.ceil(step / 2) * 0.02 * (step % 2 === 1 ? -1 : 1));
    const tVal = 0.5 + delta;
    if (tVal >= 0.15 && tVal <= 0.85) {
      tSteps.push(tVal);
    }
  }

  let bestSag = defaultSag;
  let bestScore = -Infinity;
  let bestPos = null;
  let foundClean = false;

  for (const testSag of sagCandidates) {
    const ctrlX = midX;
    const ctrlY = baseMidY + testSag;

    for (const t of tSteps) {
      const pt = getPointAt(t, ctrlX, ctrlY);
      const tagRect = {
        left: pt.x - tagWidth / 2,
        right: pt.x + tagWidth / 2,
        top: pt.y - tagHeight / 2,
        bottom: pt.y + tagHeight / 2
      };

      let overlaps = false;
      let minDistanceToNode = Infinity;

      for (const box of relevantBoxes) {
        if (isOverlapping(tagRect, box, 4)) {
          overlaps = true;
          break;
        }
        const dx = Math.max(0, Math.max(box.left - tagRect.right, tagRect.left - box.right));
        const dy = Math.max(0, Math.max(box.top - tagRect.bottom, tagRect.top - box.bottom));
        const dist = Math.hypot(dx, dy);
        if (dist < minDistanceToNode) {
          minDistanceToNode = dist;
        }
      }

      if (!overlaps) {
        const tDistFromCenter = Math.abs(t - 0.5);
        const sagDiff = Math.abs(testSag - defaultSag);
        const score = minDistanceToNode * 2 - tDistFromCenter * 150 - sagDiff * 0.8;

        if (score > bestScore) {
          bestScore = score;
          bestSag = testSag;
          bestPos = pt;
          foundClean = true;
        }
      }
    }

    if (foundClean) break;
  }

  if (!bestPos) {
    bestSag = defaultSag;
    const ctrlX = midX;
    const ctrlY = baseMidY + bestSag;
    let minOverlapArea = Infinity;

    for (const t of tSteps) {
      const pt = getPointAt(t, ctrlX, ctrlY);
      const tagRect = {
        left: pt.x - tagWidth / 2,
        right: pt.x + tagWidth / 2,
        top: pt.y - tagHeight / 2,
        bottom: pt.y + tagHeight / 2
      };

      let totalOverlap = 0;
      for (const box of relevantBoxes) {
        const xOverlap = Math.max(0, Math.min(tagRect.right, box.right) - Math.max(tagRect.left, box.left));
        const yOverlap = Math.max(0, Math.min(tagRect.bottom, box.bottom) - Math.max(tagRect.top, box.top));
        totalOverlap += xOverlap * yOverlap;
      }

      if (totalOverlap < minOverlapArea) {
        minOverlapArea = totalOverlap;
        bestPos = pt;
      }
    }
  }

  const ctrlX = midX;
  const ctrlY = baseMidY + bestSag;
  const finalPt = bestPos || getPointAt(0.5, ctrlX, ctrlY);
  const pathD = `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;

  let angle = (Math.atan2(finalPt.dy, finalPt.dx) * 180) / Math.PI;
  if (angle > 90) angle -= 180;
  if (angle < -90) angle += 180;
  const clampedAngle = Math.max(-20, Math.min(20, angle * 0.5));

  return {
    x1,
    y1,
    x2,
    y2,
    ctrlX,
    ctrlY,
    pathD,
    tagX: finalPt.x,
    tagY: finalPt.y,
    tagAngle: clampedAngle,
    tagWidth,
    tagHeight
  };
}

export default function PlotConspiracyBoard({
  campaignData,
  updateCampaignData,
  onOpenEntity,
  className = ''
}) {
  const worldFactions = useFactionStore((state) => state.factions || []);
  const worldLineages = useMemo(() => {
    try {
      return useWorldStore.getState().getAllLineages ? useWorldStore.getState().getAllLineages() : useCustomLineageStore.getState().getAllLineages();
    } catch { return []; }
  }, []);
  const dynastyTrees = useFamilyTreeStore((state) => state.trees || []);

  const viewportRef = useRef(null);
  const canvasRef = useRef(null);

  // Viewport navigation state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 80, y: 60 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Board theme (cork, noir, parchment, sunless)
  const [theme, setTheme] = useState(() => campaignData?.plotBoard?.theme || 'cork');

  // Pinned evidence nodes & yarn connections state
  const [nodes, setNodes] = useState(() => campaignData?.plotBoard?.nodes || []);
  const [connections, setConnections] = useState(() => campaignData?.plotBoard?.connections || []);

  // Stamp picker popover state for a specific node
  const [activeStampPickerNodeId, setActiveStampPickerNodeId] = useState(null);

  // Dragging node state
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Interactive string creation state
  const [activeStringOrigin, setActiveStringOrigin] = useState(null);
  const [mouseCanvasPos, setMouseCanvasPos] = useState({ x: 0, y: 0 });

  // Selected string for edit / delete
  const [selectedString, setSelectedString] = useState(null);
  const [stringPopoverPos, setStringPopoverPos] = useState({ x: 0, y: 0 });

  // Inline & modal editing state for nodes
  const [editingNode, setEditingNode] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCardStyle, setEditCardStyle] = useState('indexcard');
  const [editPinColor, setEditPinColor] = useState('pin-red');

  // UI Drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState('plots'); // 'plots' | 'npcs' | 'quests' | 'locations' | 'lore'
  const [drawerSearch, setDrawerSearch] = useState('');
  const [selectedPlotFilter, setSelectedPlotFilter] = useState('all');

  // Quick note modal
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteType, setNoteType] = useState('sticky'); // 'sticky' | 'clue'
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteContent, setQuickNoteContent] = useState('');
  const [quickStickyColor, setQuickStickyColor] = useState('yellow');

  // Stylus / Apple Pencil Doodle Modal
  const [showDoodleModal, setShowDoodleModal] = useState(false);
  const [doodleTitle, setDoodleTitle] = useState('');
  const [doodleStrokes, setDoodleStrokes] = useState([]);

  // Sync to campaignData with debounce
  const syncTimerRef = useRef(null);
  const persistBoard = useCallback((updatedNodes, updatedConns, updatedTheme) => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      if (typeof updateCampaignData === 'function') {
        updateCampaignData({
          plotBoard: {
            nodes: updatedNodes,
            connections: updatedConns,
            theme: updatedTheme || theme,
            zoom,
            pan
          }
        });
      }
    }, 400);
  }, [updateCampaignData, theme, zoom, pan]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    persistBoard(nodes, connections, newTheme);
  };

  const getCanvasCoords = useCallback((clientX, clientY) => {
    if (!viewportRef.current) return { x: 0, y: 0 };
    const rect = viewportRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Initial Auto-Population if board is empty but plot threads exist
  useEffect(() => {
    if ((!nodes || nodes.length === 0) && campaignData?.plotThreads?.length > 0) {
      autoPopulateFromCampaign(true);
    }
  }, [campaignData?.plotThreads]);

  // ============ VIEWPORT PAN & ZOOM HANDLERS ============
  const handleViewportMouseDown = (e) => {
    if (e.target === viewportRef.current || e.target === canvasRef.current || e.target.classList.contains('conspiracy-canvas')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      if (activeStringOrigin) setActiveStringOrigin(null);
      if (selectedString) setSelectedString(null);
      if (editingNode) setEditingNode(null);
    }
  };

  const handleMouseMove = (e) => {
    const canvasPos = getCanvasCoords(e.clientX, e.clientY);
    setMouseCanvasPos(canvasPos);

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggedNodeId) {
      const updatedNodes = nodes.map(node => {
        if (node.id === draggedNodeId) {
          return {
            ...node,
            x: Math.max(20, Math.min(3200, canvasPos.x - dragOffset.x)),
            y: Math.max(20, Math.min(2200, canvasPos.y - dragOffset.y))
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (draggedNodeId) {
      setDraggedNodeId(null);
      persistBoard(nodes, connections, theme);
    }
  };

  // Attach native non-passive wheel listener to prevent outer page scroll
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      setZoom(prevZoom => {
        const newZoom = Math.min(2.4, Math.max(0.35, +(prevZoom * zoomFactor).toFixed(2)));
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setPan(prevPan => ({
          x: mouseX - (mouseX - prevPan.x) * (newZoom / prevZoom),
          y: mouseY - (mouseY - prevPan.y) * (newZoom / prevZoom)
        }));

        return newZoom;
      });
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleNativeWheel);
    };
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 80, y: 60 });
  };

  const fitAllInView = () => {
    if (nodes.length === 0) {
      resetView();
      return;
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + 220);
      maxY = Math.max(maxY, n.y + 240);
    });

    const vWidth = viewportRef.current?.clientWidth || 1000;
    const vHeight = viewportRef.current?.clientHeight || 700;
    const bWidth = Math.max(200, maxX - minX + 120);
    const bHeight = Math.max(200, maxY - minY + 120);

    const fitZoom = Math.min(1.4, Math.max(0.4, Math.min(vWidth / bWidth, vHeight / bHeight)));
    setZoom(+fitZoom.toFixed(2));
    setPan({
      x: Math.round((vWidth - (maxX + minX) * fitZoom) / 2),
      y: Math.round((vHeight - (maxY + minY) * fitZoom) / 2)
    });
  };

  // ============ NODE DRAGGING ============
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    if (e.target.closest('.node-pushpin-anchor') || e.target.closest('.node-quick-actions') || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
      return;
    }
    const canvasPos = getCanvasCoords(e.clientX, e.clientY);
    setDraggedNodeId(node.id);
    setDragOffset({
      x: canvasPos.x - node.x,
      y: canvasPos.y - node.y
    });
  };

  // ============ STRING ENGINE ============
  const handlePushpinClick = (e, node) => {
    e.stopPropagation();
    if (!activeStringOrigin) {
      setActiveStringOrigin(node.id);
    } else if (activeStringOrigin === node.id) {
      setActiveStringOrigin(null);
    } else {
      const exists = connections.some(c =>
        (c.fromNodeId === activeStringOrigin && c.toNodeId === node.id) ||
        (c.fromNodeId === node.id && c.toNodeId === activeStringOrigin)
      );

      if (!exists) {
        const fromNode = nodes.find(n => n.id === activeStringOrigin);
        let defaultLabel = 'Connected';
        if (fromNode?.entityType === 'npc' || node.entityType === 'npc') {
          defaultLabel = 'Suspect Link';
        } else if (node.entityType === 'location' || fromNode?.entityType === 'location') {
          defaultLabel = 'Location of Incident';
        }

        const newConnection = {
          id: 'yarn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          fromNodeId: activeStringOrigin,
          toNodeId: node.id,
          label: defaultLabel,
          color: 'red',
          style: 'catenary',
          sag: 26
        };
        const updated = [...connections, newConnection];
        setConnections(updated);
        persistBoard(nodes, updated, theme);
      }
      setActiveStringOrigin(null);
    }
  };

  const removeConnection = (connId) => {
    const updated = connections.filter(c => c.id !== connId);
    setConnections(updated);
    setSelectedString(null);
    persistBoard(nodes, updated, theme);
  };

  const updateConnection = (connId, updates) => {
    const updated = connections.map(c => c.id === connId ? { ...c, ...updates } : c);
    setConnections(updated);
    if (selectedString?.id === connId) {
      setSelectedString(prev => ({ ...prev, ...updates }));
    }
    persistBoard(nodes, updated, theme);
  };

  // ============ NODE OPERATIONS ============
  const removeNode = (nodeId) => {
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedConns = connections.filter(c => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
    setNodes(updatedNodes);
    setConnections(updatedConns);
    persistBoard(updatedNodes, updatedConns, theme);
  };

  const updateNode = (nodeId, updates) => {
    const updated = nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n);
    setNodes(updated);
    persistBoard(updated, connections, theme);
  };

  const cycleStamp = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const currentIndex = EVIDENCE_STAMPS.findIndex(s => s.id === node.stamp);
    const nextStamp = currentIndex === -1 ? EVIDENCE_STAMPS[0].id : (currentIndex === EVIDENCE_STAMPS.length - 1 ? null : EVIDENCE_STAMPS[currentIndex + 1].id);
    updateNode(nodeId, { stamp: nextStamp });
  };

  const startEditingNode = (node) => {
    setEditingNode(node);
    setEditTitle(node.title || '');
    setEditSubtitle(node.subtitle || '');
    setEditDesc(node.description || '');
    setEditImage(node.image || '');
    setEditCardStyle(node.cardStyle || 'indexcard');
    setEditPinColor(node.pinColor || 'pin-red');
  };

  const saveEditingNode = () => {
    if (!editingNode) return;
    updateNode(editingNode.id, {
      title: editTitle.trim() || 'Untitled',
      subtitle: editSubtitle.trim() || '',
      description: editDesc.trim(),
      image: editImage.trim() || null,
      cardStyle: editCardStyle,
      pinColor: editPinColor
    });
    setEditingNode(null);
  };

  const handleCreateQuickNote = () => {
    if (!quickNoteTitle.trim() && !quickNoteContent.trim()) return;
    const canvasCenter = getCanvasCoords(
      (viewportRef.current?.clientWidth || 800) / 2,
      (viewportRef.current?.clientHeight || 600) / 2
    );

    const isClue = noteType === 'clue';
    const newNode = {
      id: `${noteType}_${Date.now()}`,
      entityType: isClue ? 'lore' : 'note',
      title: quickNoteTitle.trim() || (isClue ? 'Field Report' : 'Note'),
      subtitle: isClue ? 'INVESTIGATION CLUE' : 'NOTE',
      description: quickNoteContent.trim(),
      x: canvasCenter.x - 90 + (Math.random() * 60 - 30),
      y: canvasCenter.y - 60 + (Math.random() * 60 - 30),
      rotation: Math.round(Math.random() * 6 - 3),
      pinColor: PIN_COLORS[Math.floor(Math.random() * PIN_COLORS.length)],
      stamp: isClue ? 'evidence' : null,
      cardStyle: isClue ? 'clue' : 'sticky',
      stickyColor: quickStickyColor
    };

    const updated = [...nodes, newNode];
    setNodes(updated);
    setQuickNoteTitle('');
    setQuickNoteContent('');
    setShowNoteModal(false);
    persistBoard(updated, connections, theme);
  };

  const handleSaveDoodleNode = (dataUrl) => {
    const canvasCenter = getCanvasCoords(
      (viewportRef.current?.clientWidth || 800) / 2,
      (viewportRef.current?.clientHeight || 600) / 2
    );

    const newNode = {
      id: `node-${Date.now()}`,
      title: doodleTitle.trim() || 'Hand-Drawn Evidence',
      subtitle: 'SKETCH / CIPHER',
      description: 'Hand-drawn evidence created with stylus',
      image: dataUrl,
      doodleStrokes: doodleStrokes,
      x: canvasCenter.x - 85,
      y: canvasCenter.y - 115,
      pinColor: 'pin-red',
      stamp: 'evidence',
      cardStyle: 'polaroid'
    };

    const updated = [...nodes, newNode];
    setNodes(updated);
    setDoodleTitle('');
    setDoodleStrokes([]);
    setShowDoodleModal(false);
    persistBoard(updated, connections, theme);
  };

  const pinCampaignEntity = (entityType, entity, parentPlot = null) => {
    const existing = nodes.find(n => n.entityType === entityType && String(n.entityId) === String(entity.id));
    if (existing) return;

    const canvasCenter = getCanvasCoords(
      (viewportRef.current?.clientWidth || 800) / 2,
      (viewportRef.current?.clientHeight || 600) / 2
    );

    let cardStyle = 'dossier';
    let pinColor = 'pin-red';
    let title = entity.name || entity.title || 'Untitled';
    let subtitle = entity.type || entity.role || '';
    let description = entity.description || entity.summary || entity.objective || '';
    let image = entity.image || entity.avatar || entity.tokenIcon || null;

    if (entityType === 'npc') {
      cardStyle = 'polaroid';
      pinColor = 'pin-brass';
      subtitle = entity.role || 'NPC / Suspect';
    } else if (entityType === 'beat') {
      cardStyle = 'indexcard';
      pinColor = 'pin-silver';
      subtitle = 'STORY BEAT';
    } else if (entityType === 'quest') {
      cardStyle = 'quest';
      pinColor = 'pin-red';
      subtitle = entity.status || 'QUEST';
    } else if (entityType === 'location') {
      cardStyle = 'polaroid';
      pinColor = 'pin-green';
      subtitle = 'LOCATION';
    } else if (entityType === 'lore') {
      cardStyle = 'clue';
      pinColor = 'pin-silver';
      subtitle = 'LORE & CLUE';
    } else if (entityType === 'lineage') {
      cardStyle = 'clue';
      pinColor = 'pin-brass';
      subtitle = entity.category || (entity.isCustom ? 'CUSTOM SPECIES' : 'LINEAGE & SPECIES');
    } else if (entityType === 'faction') {
      cardStyle = 'dossier';
      pinColor = 'pin-red';
      subtitle = entity.type ? entity.type.replace(/_/g, ' ').toUpperCase() : 'FACTION & ORDER';
    } else if (entityType === 'dynasty_member') {
      cardStyle = 'polaroid';
      pinColor = 'pin-brass';
      subtitle = entity.title || entity.role || 'DYNASTY MEMBER';
      image = entity.portraitUrl || null;
    } else if (entityType === 'dynasty_tree') {
      cardStyle = 'dossier';
      pinColor = 'pin-brass';
      subtitle = 'DYNASTY TREE';
    }

    const newNode = {
      id: `${entityType}_${entity.id || Date.now()}`,
      entityType,
      entityId: entity.id,
      parentPlotId: parentPlot?.id || entity.plotId || null,
      title,
      subtitle,
      description,
      image,
      x: canvasCenter.x - 100 + (Math.random() * 120 - 60),
      y: canvasCenter.y - 100 + (Math.random() * 120 - 60),
      rotation: Math.round(Math.random() * 6 - 3),
      pinColor,
      stamp: null,
      cardStyle,
      raw: entity
    };

    const updated = [...nodes, newNode];
    setNodes(updated);
    persistBoard(updated, connections, theme);
  };

  // ============ AUTO-ORGANIZE LOOM ============
  const autoPopulateFromCampaign = (isInitial = false) => {
    const plots = campaignData?.plotThreads || [];
    const npcs = campaignData?.npcs || [];
    const quests = campaignData?.quests || [];
    const locs = campaignData?.locations || [];

    const newNodes = [];
    const newConns = [];

    let currentX = 140;
    let currentY = 140;

    plots.forEach((plot) => {
      const plotNodeId = `plot_${plot.id}`;
      newNodes.push({
        id: plotNodeId,
        entityType: 'plot',
        entityId: plot.id,
        title: plot.title,
        subtitle: `${(plot.type || 'Main').toUpperCase()} STORYLINE`,
        description: plot.description || '',
        image: plot.image || null,
        x: currentX,
        y: currentY,
        rotation: 0,
        pinColor: 'pin-red',
        stamp: null,
        cardStyle: 'dossier',
        raw: plot
      });

      // Place story beats
      let beatX = currentX + 310;
      let beatY = currentY - 20;
      (plot.beats || []).forEach((beat, bIdx) => {
        const beatNodeId = `beat_${beat.id || bIdx}_${plot.id}`;
        newNodes.push({
          id: beatNodeId,
          entityType: 'beat',
          entityId: beat.id,
          parentPlotId: plot.id,
          title: beat.title,
          subtitle: `Beat #${bIdx + 1} (${beat.type || 'Milestone'})`,
          description: beat.description || '',
          image: null,
          x: beatX,
          y: beatY,
          rotation: Math.round(Math.random() * 6 - 3),
          pinColor: 'pin-silver',
          stamp: beat.status === 'completed' ? 'solved' : null,
          cardStyle: 'indexcard'
        });

        const fromId = bIdx === 0 ? plotNodeId : `beat_${plot.beats[bIdx - 1].id || bIdx - 1}_${plot.id}`;
        newConns.push({
          id: `yarn_${fromId}_${beatNodeId}`,
          fromNodeId: fromId,
          toNodeId: beatNodeId,
          label: beat.type === 'revelation' ? 'Reveals' : 'Leads to',
          color: 'red',
          style: 'catenary',
          sag: 26
        });

        beatX += 270;
        if (bIdx % 2 === 0) {
          beatY += 40;
        } else {
          beatY -= 40;
        }
      });

      // Linked NPCs as polaroids
      (plot.npcIds || []).forEach((npcId, nIdx) => {
        const npc = npcs.find(n => String(n.id) === String(npcId));
        if (npc) {
          const npcNodeId = `npc_${npc.id}`;
          if (!newNodes.some(n => n.id === npcNodeId)) {
            newNodes.push({
              id: npcNodeId,
              entityType: 'npc',
              entityId: npc.id,
              parentPlotId: plot.id,
              title: npc.name,
              subtitle: npc.role || 'NPC / Suspect',
              description: npc.notes || npc.backstory || '',
              image: npc.image || npc.avatar || null,
              x: currentX + 60 + nIdx * 250,
              y: currentY + 320,
              rotation: Math.round(Math.random() * 6 - 3),
              pinColor: 'pin-brass',
              stamp: 'suspect',
              cardStyle: 'polaroid'
            });
          }
          newConns.push({
            id: `yarn_${plotNodeId}_${npcNodeId}`,
            fromNodeId: plotNodeId,
            toNodeId: npcNodeId,
            label: 'Key Suspect',
            color: 'crimson',
            style: 'catenary',
            sag: 30
          });
        }
      });

      // Linked Quests
      (plot.questIds || []).forEach((questId, qIdx) => {
        const quest = quests.find(q => String(q.id) === String(questId));
        if (quest) {
          const questNodeId = `quest_${quest.id}`;
          if (!newNodes.some(n => n.id === questNodeId)) {
            newNodes.push({
              id: questNodeId,
              entityType: 'quest',
              entityId: quest.id,
              parentPlotId: plot.id,
              title: quest.title,
              subtitle: quest.status || 'Active Quest',
              description: quest.objective || quest.description || '',
              image: null,
              x: currentX - 250,
              y: currentY + 140 + qIdx * 190,
              rotation: Math.round(Math.random() * 4 - 2),
              pinColor: 'pin-red',
              stamp: quest.status === 'Completed' ? 'solved' : 'evidence',
              cardStyle: 'quest'
            });
          }
          newConns.push({
            id: `yarn_${plotNodeId}_${questNodeId}`,
            fromNodeId: plotNodeId,
            toNodeId: questNodeId,
            label: 'Mission Lead',
            color: 'yellow',
            style: 'catenary',
            sag: 24
          });
        }
      });

      currentY += 620;
    });

    setNodes(newNodes);
    setConnections(newConns);
    persistBoard(newNodes, newConns, theme);
    setTimeout(() => fitAllInView(), 150);
  };

  const filteredNodes = useMemo(() => {
    if (selectedPlotFilter === 'all') return nodes;
    return nodes.filter(n => {
      if (n.entityType === 'plot' && String(n.entityId) === String(selectedPlotFilter)) return true;
      if (n.parentPlotId && String(n.parentPlotId) === String(selectedPlotFilter)) return true;
      if (n.entityType === 'note' || n.entityType === 'lore') return true;
      return false;
    });
  }, [nodes, selectedPlotFilter]);

  return (
    <div className={`conspiracy-board-root ${className}`}>
      {/* ============ TOP TOOLBAR ============ */}
      <div className="conspiracy-top-bar">
        <div className="conspiracy-top-left">
          <span className="conspiracy-badge-title">
            <i className="fas fa-network-wired red-string-icon"></i>
            <span>Story Web & Investigation Board</span>
          </span>
        </div>

        <div className="conspiracy-top-center">
          <button
            type="button"
            className="conspiracy-tool-btn"
            onClick={() => {
              setNoteType('sticky');
              setQuickNoteTitle('');
              setQuickNoteContent('');
              setShowNoteModal(true);
            }}
            title="Create a new Sticky Note on the canvas"
          >
            <i className="fas fa-sticky-note"></i> + Note
          </button>

          <button
            type="button"
            className="conspiracy-tool-btn"
            onClick={() => {
              setNoteType('clue');
              setQuickNoteTitle('');
              setQuickNoteContent('');
              setShowNoteModal(true);
            }}
            title="Create a new Investigation Clue Document on the canvas"
          >
            <i className="fas fa-file-lines"></i> + Clue
          </button>

          <button
            type="button"
            className="conspiracy-tool-btn"
            onClick={() => {
              setDoodleTitle('');
              setDoodleStrokes([]);
              setShowDoodleModal(true);
            }}
            title="Draw hand-inked clue, map snippet, or cipher with Apple Pencil / Stylus"
          >
            <i className="fas fa-pen-nib"></i> + Doodle / Ink
          </button>

          <button
            type="button"
            className={`conspiracy-tool-btn ${showDrawer ? 'active' : ''}`}
            onClick={() => setShowDrawer(prev => !prev)}
            title="Pin NPCs, Quests, Locations, or Lore from Campaign"
          >
            <i className="fas fa-box-archive"></i> Pin Entity
          </button>

          <button
            type="button"
            className="conspiracy-tool-btn"
            onClick={() => autoPopulateFromCampaign(false)}
            title="Auto-organize plot threads and story beats into clean investigation lanes"
          >
            <i className="fas fa-sitemap"></i> Auto-Organize
          </button>

          {/* Filter by Plot Thread */}
          {(campaignData?.plotThreads || []).length > 0 && (
            <select
              value={selectedPlotFilter}
              onChange={(e) => setSelectedPlotFilter(e.target.value)}
              className="plot-filter-select"
              style={{ background: 'rgba(50, 30, 18, 0.9)', color: '#f5e6cb', borderColor: '#d4af37', height: '28px', fontSize: '0.78rem' }}
            >
              <option value="all">All Storylines</option>
              {(campaignData.plotThreads || []).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}
        </div>

        <div className="conspiracy-top-right">
          {/* Backdrop Selector (no emojis) */}
          <select
            value={theme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="plot-filter-select"
            style={{ background: 'rgba(50, 30, 18, 0.9)', color: '#f5e6cb', borderColor: 'rgba(212, 175, 55, 0.4)', height: '28px', fontSize: '0.78rem' }}
          >
            <option value="cork">Classic Corkboard</option>
            <option value="noir">Precinct Noir</option>
            <option value="parchment">Aged Parchment</option>
            <option value="sunless">Sunless Slate</option>
          </select>
        </div>
      </div>

      {/* ============ MAIN CANVAS VIEWPORT ============ */}
      <div
        ref={viewportRef}
        className={`conspiracy-viewport ${isPanning ? 'panning' : ''} ${activeStringOrigin ? 'string-mode' : ''}`}
        onMouseDown={handleViewportMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          ref={canvasRef}
          className={`conspiracy-canvas theme-${theme}`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* ============ RED YARN / STRING SVG LAYER ============ */}
          <svg className="conspiracy-string-svg">
            {connections.map(conn => {
              const fromNode = nodes.find(n => n.id === conn.fromNodeId);
              const toNode = nodes.find(n => n.id === conn.toNodeId);
              if (!fromNode || !toNode) return null;

              const geom = calculateThreadGeometry(conn, fromNode, toNode, filteredNodes);
              if (!geom) return null;

              const yarnColor = YARN_COLORS.find(c => c.id === conn.color) || YARN_COLORS[0];

              return (
                <g key={conn.id} className="yarn-connection-group">
                  <path d={geom.pathD} className="conspiracy-yarn-shadow" />
                  <path
                    d={geom.pathD}
                    className={`conspiracy-yarn-line ${yarnColor.class}`}
                    stroke={yarnColor.hex}
                    strokeWidth="3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedString(conn);
                      setStringPopoverPos({ x: geom.tagX, y: geom.tagY });
                    }}
                  />

                  {/* Luggage Tag Label - placed in clear, unobstructed open space */}
                  {conn.label && (
                    <g
                      className="yarn-tag-group"
                      transform={`translate(${geom.tagX}, ${geom.tagY}) rotate(${geom.tagAngle})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedString(conn);
                        setStringPopoverPos({ x: geom.tagX, y: geom.tagY });
                      }}
                    >
                      {/* String Tie to Tag */}
                      <line
                        x1={-geom.tagWidth / 2}
                        y1="0"
                        x2={-geom.tagWidth / 2 - 7}
                        y2="0"
                        stroke={yarnColor.hex}
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      {/* Luggage Tag Rectangle */}
                      <rect
                        x={-geom.tagWidth / 2}
                        y={-geom.tagHeight / 2}
                        width={geom.tagWidth}
                        height={geom.tagHeight}
                        className="yarn-tag-rect"
                      />
                      {/* Brass Eyelet */}
                      <circle
                        cx={-geom.tagWidth / 2 + 7}
                        cy="0"
                        r="2.5"
                        className="yarn-tag-eyelet"
                      />
                      {/* High-Legibility Tag Label Text */}
                      <text x="3" y="0" className="yarn-tag-text">
                        {conn.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Active Drawing Line */}
            {activeStringOrigin && (() => {
              const originNode = nodes.find(n => n.id === activeStringOrigin);
              if (!originNode) return null;
              const b = getNodeBounds(originNode);
              const x1 = b.pinX;
              const y1 = b.pinY;
              const x2 = mouseCanvasPos.x;
              const y2 = mouseCanvasPos.y;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 + 14;
              const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

              return (
                <g>
                  <path d={pathD} className="conspiracy-yarn-shadow" />
                  <path d={pathD} className="conspiracy-yarn-line active-drag yarn-color-red" stroke="#c0392b" strokeWidth="3" />
                </g>
              );
            })()}
          </svg>

          {/* ============ PINNED EVIDENCE NODES ============ */}
          {filteredNodes.map(node => {
            const isDragging = draggedNodeId === node.id;
            const isConnecting = activeStringOrigin === node.id;
            const stampData = EVIDENCE_STAMPS.find(s => s.id === node.stamp);

            return (
              <div
                key={node.id}
                className={`conspiracy-node ${isDragging ? 'dragging' : ''} ${isConnecting ? 'selected' : ''} ${activeStampPickerNodeId === node.id ? 'has-open-picker' : ''}`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: `rotate(${node.rotation || 0}deg)`
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onDoubleClick={() => startEditingNode(node)}
              >
                {/* Pushpin Anchor */}
                <div
                  className="node-pushpin-anchor"
                  onClick={(e) => handlePushpinClick(e, node)}
                  title={activeStringOrigin ? 'Click to tie thread here' : 'Click to start thread'}
                >
                  <div className={`pushpin-head ${node.pinColor || 'pin-red'}`} />
                  {isConnecting && <div className="pushpin-connect-pulse" />}
                </div>

                {/* 1. POLAROID CARD (NPCs / Suspects / Locations) */}
                {node.cardStyle === 'polaroid' && (
                  <div className="card-variant-polaroid">
                    <div className="polaroid-photo-frame">
                      {node.image ? (
                        <img src={node.image} alt={node.title} onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="polaroid-photo-placeholder">
                          <i className={`fas ${node.entityType === 'npc' ? 'fa-user' : 'fa-map-marker-alt'}`}></i>
                        </div>
                      )}
                    </div>
                    <div className="polaroid-caption-area">
                      <div className="polaroid-name" title={node.title}>{node.title}</div>
                      {node.subtitle && <div className="polaroid-role">{node.subtitle}</div>}
                    </div>
                  </div>
                )}

                {/* 2. MANILA CASE DOSSIER (Plot Threads) */}
                {node.cardStyle === 'dossier' && (
                  <div className="card-variant-dossier">
                    <div className="dossier-tab-header">
                      <span className="dossier-case-num">
                        <i className="fas fa-folder-closed"></i> {node.subtitle || 'STORYLINE'}
                      </span>
                      <i className="fas fa-paperclip" style={{ color: '#8c5825' }}></i>
                    </div>
                    {node.image && (
                      <div className="dossier-photo-attach" style={{ float: 'right', width: '48px', height: '48px', margin: '0 0 4px 6px', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(140,88,37,0.4)', background: '#fff' }}>
                        <img src={node.image} alt={node.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div className="dossier-title">{node.title}</div>
                    {node.description && <div className="dossier-summary">{node.description}</div>}
                    {node.raw?.beats && (
                      <div className="dossier-beats-strip">
                        <span><i className="fas fa-timeline"></i> {node.raw.beats.length} Beats</span>
                        <span>{node.raw.status || 'Active'}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. LINED INDEX CARD (Story Beats) */}
                {node.cardStyle === 'indexcard' && (
                  <div className="card-variant-indexcard">
                    <div className="indexcard-meta">
                      <span className="indexcard-tag">{node.subtitle || 'MILESTONE'}</span>
                      <i className="fas fa-bookmark" style={{ color: '#c0392b', fontSize: '0.72rem' }}></i>
                    </div>
                    {node.image && (
                      <div className="indexcard-photo-attach" style={{ float: 'right', width: '46px', height: '46px', margin: '0 0 4px 6px', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(140,88,37,0.4)', background: '#fff' }}>
                        <img src={node.image} alt={node.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div className="indexcard-title">{node.title}</div>
                    {node.description && <div className="indexcard-desc">{node.description}</div>}
                  </div>
                )}

                {/* 4. BOUNTY / QUEST SCROLL */}
                {node.cardStyle === 'quest' && (
                  <div className="card-variant-quest">
                    <div className="quest-scroll-seal">
                      <i className="fas fa-scroll"></i> {node.subtitle || 'QUEST'}
                    </div>
                    {node.image && (
                      <div style={{ float: 'right', width: '42px', height: '42px', margin: '0 0 4px 6px', borderRadius: '3px', overflow: 'hidden', border: '1px solid #8c5825', background: '#fff' }}>
                        <img src={node.image} alt={node.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div className="quest-scroll-title">{node.title}</div>
                    {node.description && (
                      <div style={{ fontSize: '0.78rem', color: '#54361c', marginTop: '4px', fontStyle: 'italic' }}>
                        {node.description}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. STICKY NOTE */}
                {node.cardStyle === 'sticky' && (
                  <div className={`card-variant-sticky color-${node.stickyColor || 'yellow'}`}>
                    {node.title && <div className="sticky-note-title">{node.title}</div>}
                    <div className="sticky-note-content">{node.description || 'Empty note...'}</div>
                  </div>
                )}

                {/* 6. TYPEWRITER CLUE MEMO */}
                {node.cardStyle === 'clue' && (
                  <div className="card-variant-clue">
                    <div className="clue-memo-header">
                      <span>{node.subtitle || 'DOCUMENT'}</span>
                      <i className="fas fa-file-invoice"></i>
                    </div>
                    {node.image && (
                      <div style={{ float: 'right', width: '44px', height: '44px', margin: '0 0 4px 6px', borderRadius: '3px', overflow: 'hidden', border: '1px solid #8c5825', background: '#fff' }}>
                        <img src={node.image} alt={node.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div className="clue-memo-title">{node.title}</div>
                    <div className="clue-memo-text">{node.description || 'No notes attached.'}</div>
                  </div>
                )}

                {/* Stamp overlay */}
                {stampData && (
                  <div className={`evidence-rubber-stamp ${stampData.class}`}>
                    {stampData.label}
                  </div>
                )}

                {/* Hover Quick Actions */}
                <div className="node-quick-actions">
                  <button
                    type="button"
                    className="node-action-btn btn-tie-yarn"
                    onClick={(e) => handlePushpinClick(e, node)}
                    title="Tie Thread"
                  >
                    <i className="fas fa-link"></i> Thread
                  </button>
                  <button
                    type="button"
                    className={`node-action-btn ${activeStampPickerNodeId === node.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStampPickerNodeId(activeStampPickerNodeId === node.id ? null : node.id);
                    }}
                    title="Select Classification Stamp"
                  >
                    <i className="fas fa-stamp"></i> Stamp
                  </button>

                  {/* Stamp Picker Popover Dropdown */}
                  {activeStampPickerNodeId === node.id && (
                    <div className="stamp-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="stamp-picker-header">
                        <span>Classification</span>
                        <button
                          type="button"
                          className="stamp-picker-clear-btn"
                          onClick={() => {
                            updateNode(node.id, { stamp: null });
                            setActiveStampPickerNodeId(null);
                          }}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="stamp-picker-options">
                        {EVIDENCE_STAMPS.map(stamp => (
                          <button
                            key={stamp.id}
                            type="button"
                            className={`stamp-picker-item ${stamp.class} ${node.stamp === stamp.id ? 'active' : ''}`}
                            onClick={() => {
                              updateNode(node.id, { stamp: stamp.id });
                              setActiveStampPickerNodeId(null);
                            }}
                          >
                            <i className={`fas ${stamp.icon}`}></i> {stamp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className="node-action-btn btn-edit-node"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingNode(node);
                    }}
                    title="Edit Card (Text, Image, Style)"
                  >
                    <i className="fas fa-pen"></i> Edit
                  </button>
                  <button
                    type="button"
                    className="node-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newRot = (node.rotation || 0) === 0 ? 4 : ((node.rotation || 0) > 0 ? -4 : 0);
                      updateNode(node.id, { rotation: newRot });
                    }}
                    title="Tilt Card Angle"
                  >
                    <i className="fas fa-rotate"></i>
                  </button>
                  <button
                    type="button"
                    className="node-action-btn btn-delete-node"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(node.id);
                    }}
                    title="Unpin Card"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============ FLOATING ZOOM & HUD ============ */}
      <div className="conspiracy-floating-hud">
        <button
          type="button"
          className="hud-btn"
          onClick={() => setZoom(prev => Math.min(2.4, +(prev * 1.15).toFixed(2)))}
          title="Zoom In"
        >
          <i className="fas fa-plus"></i>
        </button>
        <span className="hud-pct-text">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          className="hud-btn"
          onClick={() => setZoom(prev => Math.max(0.35, +(prev * 0.85).toFixed(2)))}
          title="Zoom Out"
        >
          <i className="fas fa-minus"></i>
        </button>
        <button
          type="button"
          className="hud-btn"
          onClick={resetView}
          title="Reset 100% Zoom"
        >
          <i className="fas fa-compress"></i>
        </button>
        <button
          type="button"
          className="hud-btn"
          onClick={fitAllInView}
          title="Fit All Pinned Evidence in View"
        >
          <i className="fas fa-expand"></i>
        </button>
      </div>

      {/* ============ PIN ENTITY DRAWER ============ */}
      {showDrawer && (
        <div className="conspiracy-drawer-overlay">
          <div className="drawer-header">
            <h4><i className="fas fa-box-archive"></i> Pin Campaign Entity</h4>
            <button
              type="button"
              className="hud-btn"
              style={{ width: '22px', height: '22px', border: 'none' }}
              onClick={() => setShowDrawer(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="drawer-tabs">
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'plots' ? 'active' : ''}`}
              onClick={() => setDrawerTab('plots')}
            >
              Plots
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'npcs' ? 'active' : ''}`}
              onClick={() => setDrawerTab('npcs')}
            >
              Cast
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'lineages' ? 'active' : ''}`}
              onClick={() => setDrawerTab('lineages')}
            >
              Lineages
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'factions' ? 'active' : ''}`}
              onClick={() => setDrawerTab('factions')}
            >
              Factions
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'dynasties' ? 'active' : ''}`}
              onClick={() => setDrawerTab('dynasties')}
            >
              Dynasties
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'quests' ? 'active' : ''}`}
              onClick={() => setDrawerTab('quests')}
            >
              Quests
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'locations' ? 'active' : ''}`}
              onClick={() => setDrawerTab('locations')}
            >
              Places
            </button>
            <button
              type="button"
              className={`drawer-tab-btn ${drawerTab === 'lore' ? 'active' : ''}`}
              onClick={() => setDrawerTab('lore')}
            >
              Lore
            </button>
          </div>

          <div style={{ padding: '8px 10px 0 10px' }}>
            <input
              type="text"
              placeholder="Search entities to pin..."
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              className="conspiracy-modal-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div className="drawer-content-list">
            {drawerTab === 'plots' && (
              <>
                {(campaignData?.plotThreads || [])
                  .filter(p => !drawerSearch || (p.title || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(plot => (
                    <div
                      key={plot.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('plot', plot)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-folder" style={{ color: '#d4af37' }}></i>
                        {plot.title}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}

            {drawerTab === 'npcs' && (
              <>
                {(campaignData?.npcs || [])
                  .filter(n => !drawerSearch || (n.name || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(npc => (
                    <div
                      key={npc.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('npc', npc)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-user" style={{ color: '#2ecc71' }}></i>
                        {npc.name}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}

            {drawerTab === 'lineages' && (
              <>
                {worldLineages
                  .filter(l => !drawerSearch || (l.name || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(lineage => (
                    <div
                      key={lineage.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('lineage', lineage)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-dna" style={{ color: '#9b59b6' }}></i>
                        {lineage.name}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}

            {drawerTab === 'factions' && (
              <>
                {worldFactions
                  .filter(f => !drawerSearch || (f.name || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(faction => (
                    <div
                      key={faction.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('faction', faction)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-shield-halved" style={{ color: '#e74c3c' }}></i>
                        {faction.name}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}

            {drawerTab === 'dynasties' && (
              <>
                {dynastyTrees.map((tree) => (
                  <div key={tree.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                    <div style={{ fontFamily: 'Cinzel', fontSize: '0.74rem', color: '#d4af37', fontWeight: 700, padding: '2px 4px', borderBottom: '1px dashed rgba(212, 175, 55, 0.3)' }}>
                      <i className="fas fa-crown"></i> {tree.name}
                    </div>
                    {(tree.nodes || [])
                      .filter(m => !drawerSearch || (m.name || '').toLowerCase().includes(drawerSearch.toLowerCase()) || (m.title || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                      .map(member => (
                        <div
                          key={member.id}
                          className="drawer-item-row"
                          onClick={() => pinCampaignEntity('dynasty_member', member)}
                        >
                          <span className="drawer-item-title">
                            <i className="fas fa-user-tag" style={{ color: '#f1c40f' }}></i>
                            {member.name} {member.title ? `(${member.title})` : ''}
                          </span>
                          <button type="button" className="drawer-item-add-btn">+ Pin</button>
                        </div>
                      ))}
                  </div>
                ))}
              </>
            )}

            {drawerTab === 'quests' && (
              <>
                {(campaignData?.quests || [])
                  .filter(q => !drawerSearch || (q.title || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(quest => (
                    <div
                      key={quest.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('quest', quest)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-scroll" style={{ color: '#f39c12' }}></i>
                        {quest.title}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}

            {drawerTab === 'locations' && (
              <>
                {(campaignData?.locations || [])
                  .filter(l => !drawerSearch || (l.name || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(loc => (
                    <div
                      key={loc.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('location', loc)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-map-marker-alt" style={{ color: '#e67e22' }}></i>
                        {loc.name}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}

            {drawerTab === 'lore' && (
              <>
                {(campaignData?.homebrew?.lore || [])
                  .filter(lore => !drawerSearch || (lore.title || lore.name || '').toLowerCase().includes(drawerSearch.toLowerCase()))
                  .map(lore => (
                    <div
                      key={lore.id}
                      className="drawer-item-row"
                      onClick={() => pinCampaignEntity('lore', lore)}
                    >
                      <span className="drawer-item-title">
                        <i className="fas fa-book-open" style={{ color: '#3498db' }}></i>
                        {lore.title || lore.name}
                      </span>
                      <button type="button" className="drawer-item-add-btn">+ Pin</button>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ QUICK NOTE / CLUE CREATOR MODAL ============ */}
      {showNoteModal && (
        <div className="string-edit-popover" style={{ top: '60px', left: '50%', transform: 'translateX(-50%)', minWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Cinzel', fontSize: '0.88rem', color: '#d4af37', fontWeight: 700 }}>
              <i className={`fas ${noteType === 'sticky' ? 'fa-sticky-note' : 'fa-file-lines'}`}></i> New {noteType === 'sticky' ? 'Sticky Note' : 'Investigation Clue'}
            </span>
            <button
              type="button"
              onClick={() => setShowNoteModal(false)}
              style={{ background: 'none', border: 'none', color: '#a08c70', cursor: 'pointer' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div>
            <label className="conspiracy-modal-label">Title / Header</label>
            <input
              type="text"
              value={quickNoteTitle}
              onChange={(e) => setQuickNoteTitle(e.target.value)}
              placeholder={noteType === 'sticky' ? 'e.g. Alibi Discrepancy' : 'e.g. Forged Seal Memo'}
              className="conspiracy-modal-input"
              style={{ width: '100%', boxSizing: 'border-box', marginTop: '3px' }}
            />
          </div>

          <div>
            <label className="conspiracy-modal-label">Content / Finding</label>
            <textarea
              value={quickNoteContent}
              onChange={(e) => setQuickNoteContent(e.target.value)}
              placeholder="Describe the clue, witness statement, or investigative finding..."
              rows={4}
              className="conspiracy-modal-input"
              style={{ width: '100%', boxSizing: 'border-box', marginTop: '3px' }}
            />
          </div>

          {noteType === 'sticky' && (
            <div>
              <label className="conspiracy-modal-label">Note Color</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[
                  { id: 'yellow', name: 'Yellow', bg: '#fff9a6' },
                  { id: 'parchment', name: 'Parchment', bg: '#ebd8b7' },
                  { id: 'mint', name: 'Mint', bg: '#c8f7dc' },
                  { id: 'slate', name: 'Slate', bg: '#d0d7de' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setQuickStickyColor(c.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: quickStickyColor === c.id ? '2px solid #d4af37' : '1px solid rgba(0,0,0,0.3)',
                      background: c.bg,
                      cursor: 'pointer'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '6px' }}>
            <button
              type="button"
              className="conspiracy-tool-btn"
              onClick={() => setShowNoteModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="conspiracy-tool-btn active"
              onClick={handleCreateQuickNote}
            >
              + Pin to Board
            </button>
          </div>
        </div>
      )}

      {/* ============ STYLUS DOODLE MODAL ============ */}
      {showDoodleModal && (
        <div className="string-edit-popover" style={{ top: '40px', left: '50%', transform: 'translateX(-50%)', minWidth: '500px', maxWidth: '90vw', zIndex: 10000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'Cinzel', fontSize: '0.95rem', color: '#d4af37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-feather-pointed"></i> Hand-Drawn Clue / Evidence Sketch
            </span>
            <button
              type="button"
              onClick={() => setShowDoodleModal(false)}
              style={{ background: 'none', border: 'none', color: '#a08c70', cursor: 'pointer', fontSize: '1rem' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={doodleTitle}
              onChange={(e) => setDoodleTitle(e.target.value)}
              placeholder="Clue Title / Cipher Name (e.g. Broken Royal Seal, Crypt Map)"
              className="conspiracy-modal-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <StylusDrawingCanvas
            initialStrokes={doodleStrokes}
            defaultBg="parchment"
            title={doodleTitle || 'Evidence Clue'}
            onChange={({ strokes }) => setDoodleStrokes(strokes)}
            aspectRatio="4/3"
            minHeight={280}
            maxHeight={420}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              className="conspiracy-tool-btn"
              onClick={() => setShowDoodleModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="conspiracy-tool-btn active"
              onClick={() => {
                // Find canvas and export
                const canvasEl = document.querySelector('.string-edit-popover .stylus-render-canvas');
                let dataUrl = '';
                if (canvasEl) {
                  const exportCanvas = document.createElement('canvas');
                  exportCanvas.width = canvasEl.width;
                  exportCanvas.height = canvasEl.height;
                  const expCtx = exportCanvas.getContext('2d');
                  expCtx.fillStyle = '#f4ebd0';
                  expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
                  expCtx.drawImage(canvasEl, 0, 0);
                  dataUrl = exportCanvas.toDataURL('image/png');
                }
                handleSaveDoodleNode(dataUrl);
              }}
            >
              <i className="fas fa-thumbtack"></i> Pin Clue to Board
            </button>
          </div>
        </div>
      )}

      {/* ============ STRING EDIT MODAL ============ */}
      {selectedString && (
        <div
          className="string-edit-popover"
          style={{
            left: `${pan.x + stringPopoverPos.x * zoom - 120}px`,
            top: `${pan.y + stringPopoverPos.y * zoom + 10}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Cinzel', fontSize: '0.78rem', color: '#d4af37', fontWeight: 700 }}>
              <i className="fas fa-link"></i> Thread Connection
            </span>
            <button
              type="button"
              onClick={() => setSelectedString(null)}
              style={{ background: 'none', border: 'none', color: '#a08c70', cursor: 'pointer' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div>
            <label className="conspiracy-modal-label">Connection Label</label>
            <input
              type="text"
              value={selectedString.label || ''}
              onChange={(e) => updateConnection(selectedString.id, { label: e.target.value })}
              placeholder="e.g. Suspect, Motive, Location..."
              className="conspiracy-modal-input"
              style={{ width: '100%', boxSizing: 'border-box', marginTop: '3px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: '#f5e6cb' }}>Quick Presets</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '3px' }}>
              {RELATIONSHIP_PRESETS.slice(0, 6).map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updateConnection(selectedString.id, { label: preset })}
                  style={{
                    background: selectedString.label === preset ? '#8b4513' : 'rgba(50, 30, 18, 0.8)',
                    color: '#f5e6cb',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '3px',
                    padding: '2px 5px',
                    fontSize: '0.65rem',
                    cursor: 'pointer'
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', color: '#f5e6cb' }}>Thread Color</label>
            <div className="string-color-palette">
              {YARN_COLORS.map(c => (
                <div
                  key={c.id}
                  className={`string-color-swatch ${selectedString.color === c.id ? 'active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => updateConnection(selectedString.id, { color: c.id })}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button
              type="button"
              className="conspiracy-tool-btn"
              style={{ background: '#c0392b', color: '#fff', fontSize: '0.7rem', padding: '3px 8px' }}
              onClick={() => removeConnection(selectedString.id)}
            >
              <i className="fas fa-scissors"></i> Cut Thread
            </button>
          </div>
        </div>
      )}

      {/* ============ EDIT CARD MODAL ============ */}
      {editingNode && (
        <div className="custom-rel-modal-overlay" onClick={() => setEditingNode(null)}>
          <div className="custom-rel-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3><i className="fas fa-pen-to-square"></i> Edit Evidence Card</h3>

            <div>
              <label>Card Title / Name</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Inciting Incident, Lord Corvus, Bloody Dagger..."
                className="conspiracy-modal-input"
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label>Status / Subtitle Tag</label>
                <input
                  type="text"
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="e.g. NOT-STARTED, SUSPECT, MILESTONE..."
                  className="conspiracy-modal-input"
                />
              </div>
              <div>
                <label>Card Format</label>
                <select
                  value={editCardStyle}
                  onChange={(e) => setEditCardStyle(e.target.value)}
                  className="conspiracy-modal-input"
                >
                  <option value="indexcard">Index Card (Lined Note)</option>
                  <option value="dossier">Manila Case Dossier</option>
                  <option value="polaroid">Polaroid Photo</option>
                  <option value="quest">Bounty / Quest Scroll</option>
                  <option value="sticky">Sticky Note</option>
                  <option value="clue">Typewriter Clue Memo</option>
                </select>
              </div>
            </div>

            <div>
              <label>Evidence Image URL (Optional)</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="Paste portrait or location image URL..."
                  className="conspiracy-modal-input"
                  style={{ flex: 1 }}
                />
                {editImage && (
                  <button
                    type="button"
                    className="pathfinder-action-btn"
                    onClick={() => setEditImage('')}
                    title="Remove Image"
                  >
                    Clear
                  </button>
                )}
              </div>
              {editImage && (
                <div style={{ marginTop: '6px', textAlign: 'center', background: '#f5edd9', padding: '4px', borderRadius: '4px', border: '1px solid #d4af37' }}>
                  <img
                    src={editImage}
                    alt="Preview"
                    style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain', borderRadius: '3px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div>
              <label>Description / Case Notes</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Details, motives, alibis, clues, or investigative notes..."
                rows={3}
                className="conspiracy-modal-input"
              />
            </div>

            <div>
              <label>Pushpin Color</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[
                  { id: 'pin-red', name: 'Crimson Red', color: '#c0392b' },
                  { id: 'pin-brass', name: 'Brass Gold', color: '#d4af37' },
                  { id: 'pin-silver', name: 'Steel Silver', color: '#bdc3c7' },
                  { id: 'pin-black', name: 'Obsidian Black', color: '#2c3e50' },
                  { id: 'pin-green', name: 'Forest Green', color: '#27ae60' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setEditPinColor(p.id)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: p.color,
                      border: editPinColor === p.id ? '2.5px solid #fff' : '1px solid rgba(0,0,0,0.5)',
                      boxShadow: editPinColor === p.id ? '0 0 6px rgba(212, 175, 55, 0.9)' : 'none',
                      cursor: 'pointer'
                    }}
                    title={p.name}
                  />
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="pathfinder-action-btn" onClick={() => setEditingNode(null)}>
                Cancel
              </button>
              <button type="button" className="pathfinder-action-btn primary" onClick={saveEditingNode}>
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
