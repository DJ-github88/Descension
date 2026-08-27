import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import './UniversalEntityGraph.css';

const CANVAS_WIDTH = 1800;
const CANVAS_HEIGHT = 1200;

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

  // Pan & Zoom state
  const [panOffset, setPanOffset] = useState({ x: -100, y: -50 });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Node Dragging state
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [customPositions, setCustomPositions] = useState({});

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

  // 4. Default Positions Layout (Clustered & Clean)
  const defaultPositions = useMemo(() => {
    const positions = {};
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;

    if (layoutMode === 'orbital') {
      const factionNodes = visibleNodes.filter((n) => n.type === 'faction');
      const locationNodes = visibleNodes.filter((n) => n.type === 'location');
      const familyNodes = visibleNodes.filter((n) => n.type === 'family_node');

      // Center ring: Factions
      factionNodes.forEach((n, i) => {
        const angle = (i / (factionNodes.length || 1)) * Math.PI * 2 - Math.PI / 2;
        positions[n.id] = {
          x: cx + Math.cos(angle) * 280,
          y: cy + Math.sin(angle) * 200
        };
      });

      // Middle ring: Locations
      locationNodes.forEach((n, i) => {
        const angle = (i / (locationNodes.length || 1)) * Math.PI * 2 - Math.PI / 4;
        positions[n.id] = {
          x: cx + Math.cos(angle) * 520,
          y: cy + Math.sin(angle) * 360
        };
      });

      // Outer ring: Dynasty Family Nodes
      familyNodes.forEach((n, i) => {
        const angle = (i / (familyNodes.length || 1)) * Math.PI * 2;
        positions[n.id] = {
          x: cx + Math.cos(angle) * 740,
          y: cy + Math.sin(angle) * 480
        };
      });
    } else {
      // Cluster layout: Organized by Realms / Houses
      const realmClusters = {
        'frostwood-reach': { cx: cx - 280, cy: cy - 60 },
        'nordhalla': { cx: cx + 280, cy: cy - 60 },
        'sundale': { cx: cx, cy: cy + 280 }
      };

      const buckets = {};
      visibleNodes.forEach((n) => {
        const r = n.regionId || 'frostwood-reach';
        if (!buckets[r]) buckets[r] = [];
        buckets[r].push(n);
      });

      Object.entries(buckets).forEach(([region, nodes]) => {
        const center = realmClusters[region] || { cx, cy };
        nodes.forEach((n, i) => {
          const angle = (i / (nodes.length || 1)) * Math.PI * 2;
          const radius = nodes.length > 5 ? 160 + (i % 2) * 60 : 140;
          positions[n.id] = {
            x: center.cx + Math.cos(angle) * radius,
            y: center.cy + Math.sin(angle) * radius
          };
        });
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
  const centerOnNode = (nodeId) => {
    const pos = getNodePos(nodeId);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPanOffset({
      x: rect.width / 2 - pos.x * zoomLevel,
      y: rect.height / 2 - pos.y * zoomLevel
    });
  };

  // Auto-fit to screen
  const handleFitToScreen = () => {
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

    const padding = 120;
    const width = Math.max(maxX - minX + padding * 2, 400);
    const height = Math.max(maxY - minY + padding * 2, 400);

    const fitZoom = Math.max(0.45, Math.min(1.15, Math.min(rect.width / width, rect.height / height)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoomLevel(fitZoom);
    setPanOffset({
      x: rect.width / 2 - centerX * fitZoom,
      y: rect.height / 2 - centerY * fitZoom
    });
  };

  // Center once on initial mount
  useEffect(() => {
    handleFitToScreen();
  }, [visibleNodes.length]);

  // Pan Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.pathfinder-graph-node') || e.target.closest('.pathfinder-graph-toolbar')) return;
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
    const zoomDelta = e.deltaY > 0 ? -0.06 : 0.06;
    setZoomLevel((prev) => Math.max(0.4, Math.min(1.8, prev + zoomDelta)));
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
        <div className="toolbar-left">
          <div className="pathfinder-pill-group">
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('faction') ? 'active faction' : ''}`}
              onClick={() => toggleTypeFilter('faction')}
              title="Toggle Factions & Orders"
            >
              <i className="fas fa-shield-halved"></i> Factions ({factions.length})
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('location') ? 'active location' : ''}`}
              onClick={() => toggleTypeFilter('location')}
              title="Toggle Locations & Keeps"
            >
              <i className="fas fa-map-pin"></i> Locations ({locations.length})
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('family_node') ? 'active family' : ''}`}
              onClick={() => toggleTypeFilter('family_node')}
              title="Toggle Dynastic Lineages"
            >
              <i className="fas fa-crown"></i> Dynasties ({trees.reduce((acc, t) => acc + (t.nodes || []).length, 0)})
            </button>
          </div>

          <div className="toolbar-separator"></div>

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
        </div>

        <div className="toolbar-right">
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

          <button
            type="button"
            className={`pathfinder-toggle-btn ${hideDisconnected ? 'active' : ''}`}
            onClick={() => setHideDisconnected((prev) => !prev)}
            title={hideDisconnected ? "Showing Connected Only" : "Show All Nodes"}
          >
            <i className="fas fa-link"></i>
            <span>Connected Only</span>
          </button>

          <div className="zoom-controls">
            <button type="button" onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))} title="Zoom In">
              <i className="fas fa-plus"></i>
            </button>
            <button type="button" onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.15))} title="Zoom Out">
              <i className="fas fa-minus"></i>
            </button>
            <button type="button" onClick={handleFitToScreen} title="Fit Entire Lore Web to Screen">
              <i className="fas fa-expand"></i>
            </button>
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
      >
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
                <g key={edge.id} opacity={isDimmed ? 0.15 : isHighlighted || isEdgeHovered ? 1 : 0.7}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={edge.color || '#8b5a1a'}
                    strokeWidth={isHighlighted || isEdgeHovered ? 3.5 : 2}
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

      {/* Selected Entity Codex Drawer */}
      {selectedNode && (
        <div className="pathfinder-codex-drawer">
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
              <h4>Chronicle & Overview</h4>
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
      )}
    </div>
  );
};

export default UniversalEntityGraph;
