import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import useFactionStore, { RELATIONSHIP_TYPES, FACTION_TYPES } from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import { sanitizeLoreText } from './WorldDashboard';
import './FactionWebGraph.css';

const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1600;

const FactionWebGraph = ({ onFactionClick, selectedFactionId, worldId }) => {
  const activeWorldId = useWorldStore((state) => state.activeWorldId || 'mythrill');
  const targetWorldId = worldId || activeWorldId;
  const activeWorld = useWorldStore((state) => (state.getActiveWorld ? state.getActiveWorld() : null));

  const { getAllFactions, getFullRelationshipGraph, getRelationshipTypes } = useFactionStore();
  const worldFactions = useMemo(() => {
    return getAllFactions ? getAllFactions(targetWorldId) : [];
  }, [getAllFactions, targetWorldId]);

  const rawGraph = useMemo(() => {
    return getFullRelationshipGraph ? getFullRelationshipGraph(targetWorldId) : [];
  }, [getFullRelationshipGraph, targetWorldId]);

  // Normalize graph edges format (supports both array and object { edges: [] })
  const graphEdges = useMemo(() => {
    if (Array.isArray(rawGraph)) return rawGraph;
    return rawGraph?.edges || [];
  }, [rawGraph]);

  const [showSecrets, setShowSecrets] = useState(false);
  const [hoveredFactionId, setHoveredFactionId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(selectedFactionId || null);
  const [activeRelFilter, setActiveRelFilter] = useState('all'); // 'all' | 'allied' | 'rival' | 'hostile' | 'secret'
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredEdge, setHoveredEdge] = useState(null);

  // Pan & Zoom
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Node Dragging
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [customPositions, setCustomPositions] = useState({});

  const relTypes = getRelationshipTypes();

  // Filtered Factions for the active world
  const visibleFactions = useMemo(() => {
    let list = worldFactions;
    if (!showSecrets) {
      list = list.filter((f) => f.type !== 'secret_society' || f.publicGoal);
    }
    return list;
  }, [worldFactions, showSecrets]);

  // Initial Organic Multi-Ring Layout Generator with generous spacing
  const defaultPositions = useMemo(() => {
    const positions = {};
    const centerHouses = visibleFactions.filter(f => f.type === 'noble_house');
    const guildsAndOrders = visibleFactions.filter(f => ['guild', 'religious_order', 'military', 'merchant'].includes(f.type));
    const outerFactions = visibleFactions.filter(f => !centerHouses.includes(f) && !guildsAndOrders.includes(f));

    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;

    // Ring 1: Noble Houses (Inner Ring)
    centerHouses.forEach((f, i) => {
      const angle = (i / (centerHouses.length || 1)) * Math.PI * 2 - Math.PI / 2;
      positions[f.id] = {
        x: cx + Math.cos(angle) * 360,
        y: cy + Math.sin(angle) * 270
      };
    });

    // Ring 2: Guilds, Orders & Military (Middle Ring)
    guildsAndOrders.forEach((f, i) => {
      const angle = (i / (guildsAndOrders.length || 1)) * Math.PI * 2 - Math.PI / 4;
      positions[f.id] = {
        x: cx + Math.cos(angle) * 720,
        y: cy + Math.sin(angle) * 520
      };
    });

    // Ring 3: Secret Societies, Cults & Outer Factions (Outer Ring)
    outerFactions.forEach((f, i) => {
      const angle = (i / (outerFactions.length || 1)) * Math.PI * 2;
      positions[f.id] = {
        x: cx + Math.cos(angle) * 1050,
        y: cy + Math.sin(angle) * 700
      };
    });

    // Fallback for any unplaced
    visibleFactions.forEach((f, i) => {
      if (!positions[f.id]) {
        const angle = (i / visibleFactions.length) * Math.PI * 2;
        positions[f.id] = {
          x: cx + Math.cos(angle) * 800,
          y: cy + Math.sin(angle) * 580
        };
      }
    });

    return positions;
  }, [visibleFactions]);

  // Combined node positions (custom overrides default)
  const nodePositions = useMemo(() => {
    return { ...defaultPositions, ...customPositions };
  }, [defaultPositions, customPositions]);

  // Stable rendered node positions without clumping collision
  const renderedNodePositions = nodePositions;

  // Active focus faction ID (hovered or selected)
  const activeFocusFactionId = hoveredFactionId || selectedNodeId || null;

  // Filtered Edges based on filter & visibility
  const visibleEdges = useMemo(() => {
    const validIds = new Set(visibleFactions.map(f => f.id));
    return graphEdges.filter(edge => {
      if (!validIds.has(edge.source) || !validIds.has(edge.target)) return false;
      if (activeRelFilter === 'all') return true;
      if (activeRelFilter === 'allied') return edge.type === 'allied' || edge.type === 'friendly' || edge.type === 'vassal';
      if (activeRelFilter === 'rival') return edge.type === 'rival' || edge.type === 'distrustful' || edge.type === 'competing';
      if (activeRelFilter === 'hostile') return edge.type === 'hostile' || edge.type === 'war' || edge.type === 'nemesis';
      if (activeRelFilter === 'secret') return edge.type === 'infiltrating' || edge.type === 'puppet_master' || edge.type === 'blackmail';
      return edge.type === activeRelFilter;
    });
  }, [graphEdges, visibleFactions, activeRelFilter]);

  // Connected Faction IDs and Direct Edge Set for active focus faction
  const { connectedFactionIds, directEdgeSet } = useMemo(() => {
    const connected = new Set();
    const directEdges = new Set();
    if (!activeFocusFactionId) return { connectedFactionIds: connected, directEdgeSet: directEdges };

    visibleEdges.forEach(edge => {
      if (edge.source === activeFocusFactionId) {
        connected.add(edge.target);
        directEdges.add(`${edge.source}--${edge.target}`);
        directEdges.add(`${edge.target}--${edge.source}`);
      } else if (edge.target === activeFocusFactionId) {
        connected.add(edge.source);
        directEdges.add(`${edge.source}--${edge.target}`);
        directEdges.add(`${edge.target}--${edge.source}`);
      }
    });

    return { connectedFactionIds: connected, directEdgeSet: directEdges };
  }, [activeFocusFactionId, visibleEdges]);

  // Active Focus Faction Object & Relationships List
  const activeFocusFaction = useMemo(() => {
    if (!activeFocusFactionId) return null;
    return factions.find(f => f.id === activeFocusFactionId) || null;
  }, [activeFocusFactionId, factions]);

  const activeFocusRelationships = useMemo(() => {
    if (!activeFocusFaction) return [];
    return (activeFocusFaction.relationships || []).map(rel => {
      const target = factions.find(f => f.id === rel.targetFactionId);
      return {
        ...rel,
        targetName: target?.name || rel.targetFactionId,
        targetColor: target?.colors?.primary || '#888',
        targetType: target?.type || 'faction'
      };
    });
  }, [activeFocusFaction, factions]);

  // Reset Canvas View
  const resetCanvasView = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = rect.width / CANVAS_WIDTH;
      const scaleY = rect.height / CANVAS_HEIGHT;
      const initialZoom = Math.min(1.1, Math.max(0.45, Math.min(scaleX, scaleY) * 0.95));
      setZoomLevel(initialZoom);
      setPanOffset({
        x: Math.round((rect.width - CANVAS_WIDTH * initialZoom) / 2),
        y: Math.round((rect.height - CANVAS_HEIGHT * initialZoom) / 2)
      });
    } else {
      setPanOffset({ x: 0, y: 0 });
      setZoomLevel(0.85);
    }
  }, []);

  useEffect(() => {
    resetCanvasView();
  }, [resetCanvasView]);

  // Touch tracking refs
  const touchStateRef = useRef({
    mode: 'none',
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    nodeId: null,
    hasMoved: false,
    initialPinchDist: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 }
  });

  // Touch Event Handlers
  const handleTouchStart = (e) => {
    const touches = e.touches;
    if (touches.length === 1) {
      const touch = touches[0];
      const targetNode = e.target.closest('.world-graph-node');
      const isHUD = e.target.closest('.world-web-hud') || e.target.closest('.world-web-inspector') || e.target.closest('.faction-web-toolbar');
      if (isHUD) return;

      if (targetNode) {
        const factionId = targetNode.getAttribute('data-faction-id');
        touchStateRef.current = {
          mode: 'dragNode',
          startX: touch.clientX,
          startY: touch.clientY,
          lastX: touch.clientX,
          lastY: touch.clientY,
          nodeId: factionId,
          hasMoved: false,
          initialPinchDist: 0,
          initialZoom: zoomLevel,
          initialPan: { ...panOffset }
        };
      } else {
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
          initialPan: { ...panOffset }
        };
      }
    } else if (touches.length === 2) {
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
        initialPan: { ...panOffset }
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
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      state.lastX = touch.clientX;
      state.lastY = touch.clientY;
    } else if (state.mode === 'dragNode' && touches.length === 1 && state.nodeId) {
      const touch = touches[0];
      if (Math.hypot(touch.clientX - state.startX, touch.clientY - state.startY) > 8) {
        state.hasMoved = true;
        const dx = (touch.clientX - state.lastX) / zoomLevel;
        const dy = (touch.clientY - state.lastY) / zoomLevel;
        const currentPos = nodePositions[state.nodeId] || { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

        setCustomPositions(prev => ({
          ...prev,
          [state.nodeId]: {
            x: Math.max(80, Math.min(CANVAS_WIDTH - 80, currentPos.x + dx)),
            y: Math.max(50, Math.min(CANVAS_HEIGHT - 50, currentPos.y + dy))
          }
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
        const newZoom = Math.max(0.35, Math.min(2.5, state.initialZoom * factor));
        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = midX - rect.left;
        const cursorY = midY - rect.top;

        const zoomRatio = newZoom / state.initialZoom;
        const newPanX = cursorX - (cursorX - state.initialPan.x) * zoomRatio;
        const newPanY = cursorY - (cursorY - state.initialPan.y) * zoomRatio;

        setZoomLevel(newZoom);
        setPanOffset({ x: newPanX, y: newPanY });
      }
    }
  };

  const handleTouchEnd = () => {
    const state = touchStateRef.current;
    if (state.mode === 'dragNode' && !state.hasMoved && state.nodeId) {
      setSelectedNodeId(state.nodeId);
    }
    touchStateRef.current.mode = 'none';
    touchStateRef.current.nodeId = null;
  };

  // Reset custom layout
  const handleResetLayout = () => {
    setCustomPositions({});
    resetCanvasView();
  };

  // Canvas Mouse Down (Panning)
  const handleCanvasMouseDown = (e) => {
    if (e.target.closest('.world-graph-node') || e.target.closest('.world-web-hud') || e.target.closest('.world-web-inspector')) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    setSelectedNodeId(null);
  };

  // Node Mouse Down (Node Dragging)
  const handleNodeMouseDown = (e, factionId) => {
    e.stopPropagation();
    setDraggedNodeId(factionId);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setSelectedNodeId(factionId);
  };

  // Global Mouse Move (Panning or Node Dragging)
  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggedNodeId) {
      const dx = (e.clientX - dragStartPos.x) / zoomLevel;
      const dy = (e.clientY - dragStartPos.y) / zoomLevel;
      const currentPos = nodePositions[draggedNodeId] || { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

      setCustomPositions(prev => ({
        ...prev,
        [draggedNodeId]: {
          x: Math.max(80, Math.min(CANVAS_WIDTH - 80, currentPos.x + dx)),
          y: Math.max(50, Math.min(CANVAS_HEIGHT - 50, currentPos.y + dy))
        }
      }));
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, panStart, draggedNodeId, dragStartPos, zoomLevel, nodePositions]);

  // Mouse Up
  const handleMouseUp = useCallback(() => {
    if (isPanning) setIsPanning(false);
    if (draggedNodeId) setDraggedNodeId(null);
  }, [isPanning, draggedNodeId]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Zoom toward specific client coordinate or center
  const zoomAtPoint = useCallback((clientX, clientY, factor) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cursorX = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const cursorY = clientY !== undefined ? clientY - rect.top : rect.height / 2;

    setZoomLevel((prevZoom) => {
      const newZoom = Math.min(2.5, Math.max(0.35, +(prevZoom * factor).toFixed(3)));
      if (newZoom === prevZoom) return prevZoom;

      setPanOffset((prevPan) => {
        const worldX = (cursorX - prevPan.x) / prevZoom;
        const worldY = (cursorY - prevPan.y) / prevZoom;

        return {
          x: Math.round(cursorX - worldX * newZoom),
          y: Math.round(cursorY - worldY * newZoom)
        };
      });

      return newZoom;
    });
  }, []);

  // Native non-passive Wheel Zoom to prevent weird jump and page scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      zoomAtPoint(e.clientX, e.clientY, zoomFactor);
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, [zoomAtPoint]);

  return (
    <div className="faction-web-workspace">
      {/* Top Controls Toolbar */}
      <div className="faction-web-toolbar">
        <div className="toolbar-left">
          {/* Search Input */}
          <div className="web-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search factions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          {/* Relationship Filter Pills */}
          <div className="web-filter-pills">
            {[
              { id: 'all', label: 'All Relations' },
              { id: 'allied', label: 'Allied', color: '#2d8552' },
              { id: 'rival', label: 'Rival', color: '#c48b1e' },
              { id: 'hostile', label: 'Hostile', color: '#a12323' },
              { id: 'secret', label: 'Secret Pacts', color: '#6b2d8b' }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                className={`web-pill ${activeRelFilter === pill.id ? 'active' : ''}`}
                style={pill.color && activeRelFilter === pill.id ? { borderColor: pill.color, color: pill.color } : {}}
                onClick={() => setActiveRelFilter(pill.id)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          {/* Secrets Toggle */}
          <label className="world-toggle secrets-toggle">
            <input
              type="checkbox"
              checked={showSecrets}
              onChange={(e) => setShowSecrets(e.target.checked)}
            />
            <span className="toggle-label">
              <i className={`fas ${showSecrets ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              Show Secret Pacts & Societies
            </span>
          </label>
        </div>
      </div>

      {/* Main Interactive Graph Viewport */}
      <div
        className={`faction-web-viewport ${isPanning ? 'is-panning' : ''} ${draggedNodeId ? 'is-dragging-node' : ''}`}
        ref={containerRef}
        onMouseDown={handleCanvasMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Floating Instructions & Zoom HUD */}
        {visibleFactions.length === 0 ? (
          <div className="world-graph-empty-overlay" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            background: 'rgba(26, 15, 8, 0.92)',
            padding: '30px 40px',
            borderRadius: '12px',
            border: '1.5px solid #a67c2e',
            color: '#fdfbf7',
            zIndex: 10,
            maxWidth: '480px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
          }}>
            <i className="fas fa-project-diagram" style={{ fontSize: '36px', color: '#d4af37', marginBottom: '14px', display: 'block' }}></i>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: '#f1d779', margin: '0 0 8px 0' }}>No Factions in {activeWorld?.name || 'this World'} Yet</h3>
            <p style={{ fontSize: '13px', color: '#d5c7b3', margin: 0, lineHeight: 1.5 }}>
              Forge sovereign noble houses, knightly orders, and guilds to chart diplomatic alliances, secret treaties, and rivalries on this relationship web.
            </p>
          </div>
        ) : null}

        <div className="world-web-hud">
          <button
            type="button"
            className="btn-web-hud"
            onClick={() => zoomAtPoint(undefined, undefined, 1.18)}
            title="Zoom In"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            type="button"
            className="btn-web-hud btn-web-hud-pct"
            onClick={resetCanvasView}
            title="Reset Pan & Auto-Fit"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            className="btn-web-hud"
            onClick={() => zoomAtPoint(undefined, undefined, 0.85)}
            title="Zoom Out"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            type="button"
            className="btn-web-hud btn-web-layout-reset"
            onClick={handleResetLayout}
            title="Restore Default Ring Layout"
          >
            <i className="fas fa-arrows-rotate"></i>
          </button>
        </div>

        {/* Transformed SVG & HTML Node Canvas Plane */}
        <div
          className="faction-web-plane"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0'
          }}
        >
          {/* SVG Relationship Edge Lines */}
          <svg
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="faction-web-svg"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {visibleEdges.map((edge) => {
              const from = renderedNodePositions[edge.source];
              const to = renderedNodePositions[edge.target];
              if (!from || !to) return null;

              const edgeKey = `${edge.source}--${edge.target}`;
              const isDirectConnected = activeFocusFactionId && directEdgeSet.has(edgeKey);
              const rel = relTypes[edge.type] || relTypes.neutral || { color: '#888', lineStyle: 'solid' };

              // Determine Edge Visibility / Opacity
              let edgeOpacity = 0.22;
              let edgeStrokeWidth = 1.6;

              if (activeFocusFactionId) {
                if (isDirectConnected) {
                  edgeOpacity = 1.0;
                  edgeStrokeWidth = 3.8;
                } else {
                  edgeOpacity = 0.02; // Hide unrelated edges completely when hovering/selecting a faction!
                }
              }

              return (
                <g key={edgeKey} className={`edge-group ${isDirectConnected ? 'is-highlighted' : ''}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={rel.color}
                    strokeWidth={edgeStrokeWidth}
                    strokeDasharray={rel.lineStyle === 'dashed' ? '8,5' : rel.lineStyle === 'dotted' ? '3,3' : 'none'}
                    opacity={edgeOpacity}
                    filter={isDirectConnected ? 'url(#glow-line)' : undefined}
                    onMouseEnter={() => setHoveredEdge(edge)}
                    onMouseLeave={() => setHoveredEdge(null)}
                    className="faction-edge-line"
                  />
                  {/* Midpoint Label on Highlighted Direct Connections */}
                  {isDirectConnected && (
                    <g transform={`translate(${(from.x + to.x) / 2}, ${(from.y + to.y) / 2})`}>
                      <rect
                        x="-45"
                        y="-11"
                        width="90"
                        height="22"
                        rx="4"
                        fill="#fcf9f2"
                        stroke={rel.color}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="1"
                        fill="#2b1408"
                        fontSize="10.5"
                        fontWeight="bold"
                        fontFamily="'Cinzel', Georgia, serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {relTypes[edge.type]?.label || edge.type}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Faction Nodes */}
          {visibleFactions.map((faction) => {
            const pos = renderedNodePositions[faction.id] || { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
            const isSelected = selectedNodeId === faction.id;
            const isHovered = hoveredFactionId === faction.id;
            const isConnected = connectedFactionIds.has(faction.id);
            const isMatchesSearch = searchQuery && faction.name.toLowerCase().includes(searchQuery.toLowerCase());

            // Node Opacity, Blur & Interaction Dimming
            let nodeOpacity = 1.0;
            let nodeFilter = 'none';
            let pointerEvents = 'auto';

            if (activeFocusFactionId) {
              if (!isConnected && !isHovered && !isSelected) {
                nodeOpacity = 0.07; // Fade out unrelated nodes
                nodeFilter = 'blur(1.5px)';
                pointerEvents = 'none';
              }
            }
            if (searchQuery && !isMatchesSearch) {
              nodeOpacity = 0.15;
            }

            return (
              <div
                key={faction.id}
                data-faction-id={faction.id}
                className={`world-graph-node ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''} ${isConnected && activeFocusFactionId ? 'is-connected-target' : ''} ${isMatchesSearch ? 'is-search-match' : ''}`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  opacity: nodeOpacity,
                  filter: nodeFilter,
                  pointerEvents: pointerEvents,
                  '--fac-color-primary': faction.colors?.primary || '#8b5a1a',
                  '--fac-color-secondary': faction.colors?.secondary || '#444'
                }}
                onMouseEnter={() => setHoveredFactionId(faction.id)}
                onMouseLeave={() => setHoveredFactionId(null)}
                onMouseDown={(e) => handleNodeMouseDown(e, faction.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(faction.id);
                }}
                onDoubleClick={() => onFactionClick && onFactionClick(faction.id)}
                title="Drag to reposition • Click to inspect • Double-click to open full chronicle"
              >
                <div className="node-card-body">
                  <div className="node-color-accent" style={{ background: faction.colors?.primary || '#8b5a1a' }} />
                  <div className="node-info">
                    <span className="node-name">{sanitizeLoreText(faction.name)}</span>
                    <span className="node-type-pill">{(FACTION_TYPES[faction.type]?.label || faction.type?.replace(/_/g, ' ')).toUpperCase()}</span>
                  </div>
                </div>

                {faction.type === 'secret_society' && (
                  <span className="node-secret-tag" title="Secret Society">
                    <i className="fas fa-eye-slash"></i>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Hover Edge Tooltip */}
        {hoveredEdge && (
          <div className="edge-floating-tooltip" style={{ pointerEvents: 'none' }}>
            <div className="edge-tooltip-header">
              <strong>{sanitizeLoreText(hoveredEdge.sourceName)}</strong>
              <span className={`badge-rel-type ${hoveredEdge.type}`}>
                {relTypes[hoveredEdge.type]?.label || hoveredEdge.type}
              </span>
              <strong>{sanitizeLoreText(hoveredEdge.targetName)}</strong>
            </div>
            {hoveredEdge.description && (
              <p className="edge-tooltip-desc">{sanitizeLoreText(hoveredEdge.description)}</p>
            )}
          </div>
        )}

        {/* Floating Faction Inspector Panel */}
        {activeFocusFaction && (
          <aside className="world-web-inspector" onClick={e => e.stopPropagation()}>
            <div className="inspector-header">
              <div className="inspector-title-row">
                <div className="inspector-crest" style={{ background: activeFocusFaction.colors?.primary || '#8b5a1a' }}>
                  <i className={`fas fa-${FACTION_TYPES[activeFocusFaction.type]?.icon || 'shield-halved'}`}></i>
                </div>
                <div>
                  <h4>{sanitizeLoreText(activeFocusFaction.name)}</h4>
                  <span className="inspector-type">
                    {FACTION_TYPES[activeFocusFaction.type]?.label || activeFocusFaction.type?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-inspector"
                onClick={() => {
                  setSelectedNodeId(null);
                  setHoveredFactionId(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="inspector-body">
              {activeFocusFaction.publicGoal && (
                <div className="inspector-section">
                  <span className="section-heading"><i className="fas fa-bullseye"></i> Public Mandate</span>
                  <p className="inspector-text">{activeFocusFaction.publicGoal}</p>
                </div>
              )}

              {showSecrets && activeFocusFaction.hiddenAgenda && (
                <div className="inspector-section secret-section">
                  <span className="section-heading"><i className="fas fa-mask"></i> Hidden Agenda</span>
                  <p className="inspector-text">{activeFocusFaction.hiddenAgenda}</p>
                </div>
              )}

              {/* Direct Relationships Breakdown */}
              <div className="inspector-section">
                <span className="section-heading">
                  <i className="fas fa-diagram-project"></i> Direct Diplomatic Web ({activeFocusRelationships.length})
                </span>
                {activeFocusRelationships.length === 0 ? (
                  <p className="inspector-muted">No direct diplomatic ties recorded for this faction.</p>
                ) : (
                  <div className="inspector-rel-list">
                    {activeFocusRelationships.map((rel, idx) => {
                      const relConfig = relTypes[rel.type] || relTypes.neutral || { color: '#888', label: rel.type };
                      return (
                        <div key={idx} className="inspector-rel-card">
                          <div className="rel-card-top">
                            <span className="rel-target-name">{rel.targetName}</span>
                            <span
                              className="rel-type-pill"
                              style={{ backgroundColor: `${relConfig.color}25`, borderColor: relConfig.color, color: relConfig.color }}
                            >
                              {relConfig.label || rel.type}
                            </span>
                          </div>
                          {rel.description && (
                            <p className="rel-desc">{rel.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="inspector-footer">
              <button
                type="button"
                className="btn-open-dossier"
                onClick={() => onFactionClick && onFactionClick(activeFocusFaction.id)}
              >
                <i className="fas fa-book-open"></i> Read Full Order Chronicle ↗
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default FactionWebGraph;
