import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import './UniversalEntityGraph.css';

const CANVAS_WIDTH = 2800;
const CANVAS_HEIGHT = 2000;

export const UniversalEntityGraph = ({ onEntityClick, selectedEntity }) => {
  const factions = useFactionStore((state) => state.factions || []);
  const locations = useWorldStore((state) => state.locations || []);
  const trees = useFamilyTreeStore((state) => state.trees || []);

  const [activeTypeFilters, setActiveTypeFilters] = useState(['faction', 'location', 'family_node']);
  const [activeRelFilter, setActiveRelFilter] = useState('all');
  const [layoutMode, setLayoutMode] = useState('cluster'); // 'cluster' | 'orbital'
  const [hideDisconnected, setHideDisconnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(selectedEntity?.id || null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Pan & Zoom state
  const [panOffset, setPanOffset] = useState({ x: -200, y: -100 });
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Node Dragging state
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [customPositions, setCustomPositions] = useState({});

  // Touch tracking refs
  const touchStateRef = useRef({
    mode: 'none', // 'none' | 'pan' | 'pinch' | 'dragNode'
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    nodeId: null,
    hasMoved: false,
    initialPinchDist: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 },
    lastTapTime: 0
  });

  // 1. Build universal graph nodes
  const allNodes = useMemo(() => {
    const nodes = [];

    // Faction nodes
    factions.forEach((f) => {
      nodes.push({
        id: `faction:${f.id}`,
        rawId: f.id,
        name: f.name,
        type: 'faction',
        subType: f.type ? f.type.replace(/_/g, ' ') : 'Order',
        color: f.colors?.primary || '#8b261e',
        crestBg: '#f5edd9',
        icon: 'fa-shield-halved',
        imageUrl: f.icon,
        regionId: f.regionId || 'frostwood-reach',
        description: f.publicDescription || f.publicGoal || '',
        data: f
      });
    });

    // Location nodes
    locations.forEach((l) => {
      nodes.push({
        id: `location:${l.id}`,
        rawId: l.id,
        name: l.name,
        type: 'location',
        subType: l.type || 'Settlement',
        color: '#2d5a3c',
        crestBg: '#e8f2ea',
        icon: 'fa-map-pin',
        imageUrl: l.imageUrl,
        regionId: l.regionId || 'nordhalla',
        description: l.description || '',
        data: l
      });
    });

    // Family tree nodes
    trees.forEach((t) => {
      (t.nodes || []).forEach((n) => {
        nodes.push({
          id: `family_node:${n.id}`,
          rawId: n.id,
          name: n.name,
          type: 'family_node',
          subType: n.title || n.role || 'Noble',
          color: '#966014',
          crestBg: '#fef7e6',
          icon: 'fa-crown',
          imageUrl: n.portraitUrl,
          regionId: 'frostwood-reach',
          description: `${n.title || ''} — ${n.role || ''} (${t.name})`,
          data: n
        });
      });
    });

    return nodes;
  }, [factions, locations, trees]);

  // 2. Build universal edges
  const allEdges = useMemo(() => {
    const edges = [];

    // Faction Headquarters -> Location
    factions.forEach((f) => {
      if (f.headquarters) {
        edges.push({
          id: `edge:hq:${f.id}:${f.headquarters}`,
          source: `faction:${f.id}`,
          target: `location:${f.headquarters}`,
          type: 'territory',
          label: 'Seat / Hold',
          color: '#2d5a3c',
          strokeDash: '5,4'
        });
      }

      // Faction relationships
      (f.relationships || []).forEach((rel) => {
        edges.push({
          id: `edge:rel:${f.id}:${rel.targetFactionId}`,
          source: `faction:${f.id}`,
          target: `faction:${rel.targetFactionId}`,
          type: rel.type || 'alliance',
          label: rel.type === 'hostile' ? 'War' : rel.type === 'rival' ? 'Rival' : 'Allied',
          color: rel.type === 'hostile' ? '#a8241b' : rel.type === 'rival' ? '#c26213' : '#39784b'
        });
      });
    });

    // Family Relationships
    trees.forEach((t) => {
      (t.relationships || []).forEach((r) => {
        if (r.type === 'spouse') {
          edges.push({
            id: `edge:fam:${r.id}`,
            source: `family_node:${r.sourceId}`,
            target: `family_node:${r.targetId}`,
            type: 'family',
            label: r.label || 'Spouse',
            color: '#b03a74'
          });
        } else if (r.type === 'parent_child') {
          if (r.parentId1) {
            edges.push({
              id: `edge:fam:${r.id}:p1`,
              source: `family_node:${r.parentId1}`,
              target: `family_node:${r.childId}`,
              type: 'family',
              label: 'Parent',
              color: '#a07138'
            });
          }
          if (r.parentId2) {
            edges.push({
              id: `edge:fam:${r.id}:p2`,
              source: `family_node:${r.parentId2}`,
              target: `family_node:${r.childId}`,
              type: 'family',
              label: 'Parent',
              color: '#a07138'
            });
          }
        }
      });
    });

    return edges;
  }, [factions, trees]);

  // Connection lookup map for quick connection tests
  const connectionMap = useMemo(() => {
    const map = new Map();
    allEdges.forEach((e) => {
      if (!map.has(e.source)) map.set(e.source, new Set());
      if (!map.has(e.target)) map.set(e.target, new Set());
      map.get(e.source).add(e.target);
      map.get(e.target).add(e.source);
    });
    return map;
  }, [allEdges]);

  // 3. Filtered nodes and edges
  const visibleNodes = useMemo(() => {
    return allNodes.filter((n) => {
      if (!activeTypeFilters.includes(n.type)) return false;
      if (hideDisconnected && (!connectionMap.has(n.id) || connectionMap.get(n.id).size === 0)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allNodes, activeTypeFilters, hideDisconnected, connectionMap, searchQuery]);

  const visibleNodeIdSet = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return allEdges.filter((e) => {
      if (!visibleNodeIdSet.has(e.source) || !visibleNodeIdSet.has(e.target)) return false;
      if (activeRelFilter !== 'all' && e.type !== activeRelFilter) return false;
      return true;
    });
  }, [allEdges, visibleNodeIdSet, activeRelFilter]);

  // 4. Default Positions Layout (Concentric Multi-Ring Layout)
  const defaultPositions = useMemo(() => {
    const positions = {};
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;

    if (layoutMode === 'orbital') {
      const factionNodes = visibleNodes.filter((n) => n.type === 'faction');
      const locationNodes = visibleNodes.filter((n) => n.type === 'location');
      const familyNodes = visibleNodes.filter((n) => n.type === 'family_node');

      // Distribute factions in orbital tiers if dense
      if (factionNodes.length <= 10) {
        factionNodes.forEach((n, i) => {
          const angle = (i / (factionNodes.length || 1)) * Math.PI * 2 - Math.PI / 2;
          positions[n.id] = {
            x: cx + Math.cos(angle) * 320,
            y: cy + Math.sin(angle) * 240
          };
        });
      } else {
        const half = Math.ceil(factionNodes.length / 2);
        factionNodes.slice(0, half).forEach((n, i) => {
          const angle = (i / half) * Math.PI * 2 - Math.PI / 2;
          positions[n.id] = {
            x: cx + Math.cos(angle) * 260,
            y: cy + Math.sin(angle) * 190
          };
        });
        factionNodes.slice(half).forEach((n, i) => {
          const count = factionNodes.length - half;
          const angle = (i / count) * Math.PI * 2 - Math.PI / 4;
          positions[n.id] = {
            x: cx + Math.cos(angle) * 440,
            y: cy + Math.sin(angle) * 320
          };
        });
      }

      // Middle ring: Locations
      locationNodes.forEach((n, i) => {
        const angle = (i / (locationNodes.length || 1)) * Math.PI * 2 - Math.PI / 4;
        positions[n.id] = {
          x: cx + Math.cos(angle) * 650,
          y: cy + Math.sin(angle) * 480
        };
      });

      // Outer ring: Dynasty Family Nodes
      familyNodes.forEach((n, i) => {
        const angle = (i / (familyNodes.length || 1)) * Math.PI * 2;
        positions[n.id] = {
          x: cx + Math.cos(angle) * 880,
          y: cy + Math.sin(angle) * 650
        };
      });
    } else {
      // Clustered Concentric Multi-Ring Layout by Region
      const realmClusters = {
        'frostwood-reach': { cx: cx - 400, cy: cy - 100 },
        'nordhalla': { cx: cx + 400, cy: cy - 100 },
        'sundale': { cx: cx, cy: cy + 420 }
      };

      const buckets = {};
      visibleNodes.forEach((n) => {
        const r = n.regionId || 'frostwood-reach';
        if (!buckets[r]) buckets[r] = [];
        buckets[r].push(n);
      });

      Object.entries(buckets).forEach(([region, nodes]) => {
        const center = realmClusters[region] || { cx, cy };

        if (nodes.length <= 6) {
          nodes.forEach((n, i) => {
            const angle = (i / (nodes.length || 1)) * Math.PI * 2 - Math.PI / 2;
            positions[n.id] = {
              x: center.cx + Math.cos(angle) * 160,
              y: center.cy + Math.sin(angle) * 130
            };
          });
        } else {
          // Concentric tiered rings with generous padding
          const rings = [
            { capacity: 6, rx: 160, ry: 130 },
            { capacity: 12, rx: 320, ry: 250 },
            { capacity: 18, rx: 490, ry: 380 },
            { capacity: 24, rx: 670, ry: 510 },
            { capacity: 30, rx: 860, ry: 650 },
            { capacity: 40, rx: 1060, ry: 800 }
          ];

          let nodeIdx = 0;
          for (let r = 0; r < rings.length && nodeIdx < nodes.length; r++) {
            const ring = rings[r];
            const remaining = nodes.length - nodeIdx;
            const countInRing = Math.min(ring.capacity, remaining);
            const angleOffset = r % 2 === 1 ? Math.PI / countInRing : 0;

            for (let c = 0; c < countInRing; c++) {
              const n = nodes[nodeIdx++];
              const angle = (c / countInRing) * Math.PI * 2 - Math.PI / 2 + angleOffset;
              positions[n.id] = {
                x: center.cx + Math.cos(angle) * ring.rx,
                y: center.cy + Math.sin(angle) * ring.ry
              };
            }
          }
        }
      });
    }

    return positions;
  }, [visibleNodes, layoutMode]);

  const getNodePos = useCallback(
    (id) => {
      return customPositions[id] || defaultPositions[id] || { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
    },
    [customPositions, defaultPositions]
  );

  // Focus on Selected Node
  const centerOnNode = useCallback((nodeId) => {
    const pos = getNodePos(nodeId);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPanOffset({
      x: rect.width / 2 - pos.x * zoomLevel,
      y: rect.height / 2 - pos.y * zoomLevel
    });
  }, [getNodePos, zoomLevel]);

  // Auto-fit all nodes to screen
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current || visibleNodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    visibleNodes.forEach((n) => {
      const pos = getNodePos(n.id);
      if (pos.x < minX) minX = pos.x;
      if (pos.x > maxX) maxX = pos.x;
      if (pos.y < minY) minY = pos.y;
      if (pos.y > maxY) maxY = pos.y;
    });

    const padding = 140;
    const width = Math.max(maxX - minX + padding * 2, 400);
    const height = Math.max(maxY - minY + padding * 2, 400);

    const fitZoom = Math.max(0.35, Math.min(1.15, Math.min(rect.width / width, rect.height / height)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoomLevel(fitZoom);
    setPanOffset({
      x: rect.width / 2 - centerX * fitZoom,
      y: rect.height / 2 - centerY * fitZoom
    });
  }, [visibleNodes, getNodePos]);

  // Center once on initial mount or filter change
  useEffect(() => {
    handleFitToScreen();
  }, [visibleNodes.length, handleFitToScreen]);

  // Reset custom layout positions
  const handleResetLayout = () => {
    setCustomPositions({});
    setTimeout(() => handleFitToScreen(), 50);
  };

  // --- Mouse Pan & Drag Handlers ---
  const handleMouseDown = (e) => {
    if (e.target.closest('.pathfinder-graph-node') || e.target.closest('.pathfinder-graph-toolbar') || e.target.closest('.pathfinder-floating-hud')) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggedNodeId) {
      const dx = (e.clientX - dragStartPos.x) / zoomLevel;
      const dy = (e.clientY - dragStartPos.y) / zoomLevel;
      const cur = getNodePos(draggedNodeId);
      setCustomPositions((prev) => ({
        ...prev,
        [draggedNodeId]: { x: cur.x + dx, y: cur.y + dy }
      }));
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.07 : 0.07;
    setZoomLevel((prev) => Math.max(0.35, Math.min(2.0, prev + zoomDelta)));
  };

  // --- Touch & Gesture Engine for Mobile Devices ---
  const handleTouchStart = (e) => {
    const touches = e.touches;

    if (touches.length === 1) {
      const touch = touches[0];
      const targetNode = e.target.closest('.pathfinder-graph-node');
      const isToolbarOrHUD = e.target.closest('.pathfinder-graph-toolbar') || e.target.closest('.pathfinder-floating-hud') || e.target.closest('.pathfinder-codex-drawer');

      if (isToolbarOrHUD) return;

      if (targetNode) {
        const nodeId = targetNode.getAttribute('data-node-id');
        touchStateRef.current = {
          mode: 'dragNode',
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          lastY: touch.clientY,
          nodeId: nodeId,
          hasMoved: false,
          initialPinchDist: 0,
          initialZoom: zoomLevel,
          initialPan: { ...panOffset },
          lastTapTime: touchStateRef.current.lastTapTime
        };
      } else {
        // Double tap detection on canvas
        const now = Date.now();
        if (now - touchStateRef.current.lastTapTime < 300) {
          handleFitToScreen();
          touchStateRef.current.lastTapTime = 0;
          return;
        }
        touchStateRef.current.lastTapTime = now;

        touchStateRef.current = {
          mode: 'pan',
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          lastY: touch.clientY,
          nodeId: null,
          hasMoved: false,
          initialPinchDist: 0,
          initialZoom: zoomLevel,
          initialPan: { ...panOffset },
          lastTapTime: now
        };
      }
    } else if (touches.length === 2) {
      // Pinch to zoom initialization
      const t1 = touches[0];
      const t2 = touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      touchStateRef.current = {
        mode: 'pinch',
        startX: midX,
        startY: midY,
        lastX: midX,
        lastY: midY,
        nodeId: null,
        hasMoved: true,
        initialPinchDist: dist,
        initialZoom: zoomLevel,
        initialPan: { ...panOffset },
        lastTapTime: 0
      };
    }
  };

  const handleTouchMove = (e) => {
    const touches = e.touches;
    const state = touchStateRef.current;

    if (state.mode === 'pan' && touches.length === 1) {
      const touch = touches[0];
      const dx = touch.clientX - state.lastX;
      const dy = touch.clientY - state.lastY;

      if (Math.hypot(touch.clientX - state.startX, touch.clientY - state.startY) > 6) {
        state.hasMoved = true;
      }

      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      state.lastX = touch.clientX;
      state.lastY = touch.clientY;
    } else if (state.mode === 'dragNode' && touches.length === 1 && state.nodeId) {
      const touch = touches[0];
      const totalDist = Math.hypot(touch.clientX - state.startX, touch.clientY - state.startY);

      if (totalDist > 8) {
        state.hasMoved = true;
        const dx = (touch.clientX - state.lastX) / zoomLevel;
        const dy = (touch.clientY - state.lastY) / zoomLevel;
        const cur = getNodePos(state.nodeId);

        setCustomPositions((prev) => ({
          ...prev,
          [state.nodeId]: { x: cur.x + dx, y: cur.y + dy }
        }));
      }

      state.lastX = touch.clientX;
      state.lastY = touch.clientY;
    } else if (state.mode === 'pinch' && touches.length === 2) {
      const t1 = touches[0];
      const t2 = touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      if (state.initialPinchDist > 0 && containerRef.current) {
        const factor = currentDist / state.initialPinchDist;
        const newZoom = Math.max(0.35, Math.min(2.0, state.initialZoom * factor));

        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = midX - rect.left;
        const cursorY = midY - rect.top;

        // Anchor pinch zoom around touch midpoint
        const zoomRatio = newZoom / state.initialZoom;
        const newPanX = cursorX - (cursorX - state.initialPan.x) * zoomRatio;
        const newPanY = cursorY - (cursorY - state.initialPan.y) * zoomRatio;

        setZoomLevel(newZoom);
        setPanOffset({ x: newPanX, y: newPanY });
      }
    }
  };

  const handleTouchEnd = (e) => {
    const state = touchStateRef.current;

    // If tapped on a node without significant movement, select it
    if (state.mode === 'dragNode' && !state.hasMoved && state.nodeId) {
      const targetNode = allNodes.find((n) => n.id === state.nodeId);
      if (targetNode) {
        setSelectedNodeId(targetNode.id);
        if (onEntityClick) onEntityClick(targetNode);
      }
    }

    touchStateRef.current.mode = 'none';
    touchStateRef.current.nodeId = null;
  };

  const toggleTypeFilter = (type) => {
    setActiveTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectedNode = useMemo(() => {
    return allNodes.find((n) => n.id === selectedNodeId) || null;
  }, [allNodes, selectedNodeId]);

  // Connected nodes to the hovered/selected node for spotlighting
  const activeFocusId = hoveredNodeId || selectedNodeId;
  const directNeighborSet = useMemo(() => {
    if (!activeFocusId || !connectionMap.has(activeFocusId)) return null;
    const neighbors = new Set(connectionMap.get(activeFocusId));
    neighbors.add(activeFocusId);
    return neighbors;
  }, [activeFocusId, connectionMap]);

  return (
    <div className="pathfinder-relationship-web-wrapper">
      {/* Top Parchment Ribbon Toolbar */}
      <div className="pathfinder-graph-toolbar">
        <div className="toolbar-top-row">
          {/* Scrollable Entity Filter Chips */}
          <div className="pathfinder-pill-group">
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('faction') ? 'active faction' : ''}`}
              onClick={() => toggleTypeFilter('faction')}
              title="Toggle Factions & Orders"
            >
              <i className="fas fa-shield-halved"></i>
              <span>Factions ({factions.length})</span>
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('location') ? 'active location' : ''}`}
              onClick={() => toggleTypeFilter('location')}
              title="Toggle Locations & Keeps"
            >
              <i className="fas fa-map-pin"></i>
              <span>Locations ({locations.length})</span>
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('family_node') ? 'active family' : ''}`}
              onClick={() => toggleTypeFilter('family_node')}
              title="Toggle Dynastic Lineages"
            >
              <i className="fas fa-crown"></i>
              <span>Dynasties ({trees.reduce((acc, t) => acc + (t.nodes || []).length, 0)})</span>
            </button>
          </div>

          {/* Mobile search toggle & Connected-only quick toggle */}
          <div className="toolbar-mobile-actions">
            <button
              type="button"
              className={`pathfinder-toggle-btn mobile-search-toggle ${showMobileSearch ? 'active' : ''}`}
              onClick={() => setShowMobileSearch((prev) => !prev)}
              title="Search graph"
            >
              <i className="fas fa-search"></i>
            </button>

            <button
              type="button"
              className={`pathfinder-toggle-btn ${hideDisconnected ? 'active' : ''}`}
              onClick={() => setHideDisconnected((prev) => !prev)}
              title={hideDisconnected ? 'Showing Connected Only' : 'Show All Nodes'}
            >
              <i className="fas fa-link"></i>
              <span className="btn-label-desktop">Connected</span>
            </button>
          </div>
        </div>

        {/* Secondary controls row: Filters, Layouts & Search */}
        <div className={`toolbar-controls-row ${showMobileSearch ? 'show-search-mobile' : ''}`}>
          <div className="pathfinder-select-group">
            <select
              value={activeRelFilter}
              onChange={(e) => setActiveRelFilter(e.target.value)}
              className="pathfinder-select"
              title="Filter Relationship Type"
            >
              <option value="all">All Alliances & Ties</option>
              <option value="territory">Seats & Holdings</option>
              <option value="family">Kinship & Spouses</option>
              <option value="alliance">Alliances</option>
              <option value="hostile">Hostilities & Wars</option>
            </select>

            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
              className="pathfinder-select"
              title="Layout Organization Mode"
            >
              <option value="cluster">Group by Realm</option>
              <option value="orbital">Orbital Rings</option>
            </select>
          </div>

          <div className="pathfinder-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search lore web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pathfinder-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div
        ref={containerRef}
        className="pathfinder-canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Floating Mobile Canvas HUD Controls */}
        <div className="pathfinder-floating-hud">
          <button
            type="button"
            className="hud-btn"
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.18))}
            title="Zoom In"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={() => setZoomLevel((z) => Math.max(0.35, z - 0.18))}
            title="Zoom Out"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={handleFitToScreen}
            title="Fit Entire Web to Screen"
          >
            <i className="fas fa-expand"></i>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={handleResetLayout}
            title="Reset to Default Layout"
          >
            <i className="fas fa-arrows-rotate"></i>
          </button>
        </div>

        <div
          className="pathfinder-canvas"
          style={{
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {/* SVG Connection Lines */}
          <svg className="pathfinder-svg-layer" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            {visibleEdges.map((edge) => {
              const src = getNodePos(edge.source);
              const tgt = getNodePos(edge.target);
              const isEdgeHovered = hoveredEdge?.id === edge.id;
              const isHighlighted =
                directNeighborSet &&
                directNeighborSet.has(edge.source) &&
                directNeighborSet.has(edge.target);
              const isDimmed = directNeighborSet && !isHighlighted;

              return (
                <g key={edge.id} opacity={isDimmed ? 0.12 : isHighlighted || isEdgeHovered ? 1 : 0.65}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={edge.color || '#8b5a1a'}
                    strokeWidth={isHighlighted || isEdgeHovered ? 3.5 : 1.8}
                    strokeDasharray={edge.strokeDash || undefined}
                    onMouseEnter={() => setHoveredEdge(edge)}
                    onMouseLeave={() => setHoveredEdge(null)}
                    style={{ cursor: 'pointer' }}
                  />
                  {(isEdgeHovered || isHighlighted) && (
                    <g transform={`translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2})`}>
                      <rect
                        x="-38"
                        y="-12"
                        width="76"
                        height="18"
                        rx="4"
                        fill="#fcf9f2"
                        stroke={edge.color || '#8b5a1a'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="1"
                        fill="#2b1408"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="'Cinzel', Georgia, serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node Cards */}
          {visibleNodes.map((node) => {
            const pos = getNodePos(node.id);
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isDimmed = directNeighborSet && !directNeighborSet.has(node.id);

            return (
              <div
                key={node.id}
                data-node-id={node.id}
                className={`pathfinder-graph-node ${node.type} ${isSelected ? 'selected' : ''} ${
                  isHovered ? 'hovered' : ''
                } ${isDimmed ? 'dimmed' : ''}`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  borderLeftColor: node.color
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggedNodeId(node.id);
                  setDragStartPos({ x: e.clientX, y: e.clientY });
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                  if (onEntityClick) onEntityClick(node);
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <div className="crest-seal" style={{ backgroundColor: node.crestBg, color: node.color }}>
                  <i className={`fas ${node.icon}`}></i>
                </div>
                <div className="node-text-block">
                  <div className="node-title" title={node.name}>
                    {node.name}
                  </div>
                  <div className="node-subtitle" style={{ color: node.color }}>
                    {node.subType}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Entity Codex Drawer / Bottom Sheet on mobile */}
      {selectedNode && (
        <>
          <div
            className="pathfinder-codex-backdrop"
            onClick={() => setSelectedNodeId(null)}
          />
          <div className="pathfinder-codex-drawer">
            <div className="codex-drawer-handle" />
            <div className="codex-drawer-header">
              <div className="codex-drawer-title">
                <span className="drawer-crest" style={{ color: selectedNode.color }}>
                  <i className={`fas ${selectedNode.icon}`}></i>
                </span>
                <div>
                  <h3>{selectedNode.name}</h3>
                  <span className="codex-type" style={{ color: selectedNode.color }}>
                    {selectedNode.type.toUpperCase()} • {selectedNode.subType}
                  </span>
                </div>
              </div>
              <button className="codex-close-btn" onClick={() => setSelectedNodeId(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="codex-drawer-body">
              {selectedNode.imageUrl && (
                <div className="codex-portrait-frame">
                  <img src={selectedNode.imageUrl} alt={selectedNode.name} className="codex-portrait" />
                </div>
              )}

              <div className="codex-section">
                <h4>Chronicle &amp; Overview</h4>
                <p>{selectedNode.description || 'No detailed records inscribed.'}</p>
              </div>

              {/* Direct Connections in Codex */}
              <div className="codex-section">
                <h4>Direct Inscribed Ties</h4>
                <div className="codex-links-list">
                  {visibleEdges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge) => {
                      const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const otherNode = allNodes.find((n) => n.id === otherId);
                      if (!otherNode) return null;

                      return (
                        <div
                          key={edge.id}
                          className="codex-link-chip"
                          onClick={() => {
                            setSelectedNodeId(otherNode.id);
                            centerOnNode(otherNode.id);
                          }}
                        >
                          <span className="link-rel-badge" style={{ borderColor: edge.color, color: edge.color }}>
                            {edge.label}
                          </span>
                          <span className="link-target-name">{otherNode.name}</span>
                          <i className="fas fa-arrow-right-long link-arrow"></i>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="codex-footer-actions">
                <button
                  type="button"
                  className="btn-center-node"
                  onClick={() => centerOnNode(selectedNode.id)}
                >
                  <i className="fas fa-crosshairs"></i> Center View
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UniversalEntityGraph;

