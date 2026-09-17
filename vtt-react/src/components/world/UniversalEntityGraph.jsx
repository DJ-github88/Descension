import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import useFactionStore from '../../store/factionStore';
import useWorldStore from '../../store/worldStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import useCustomLineageStore from '../../store/customLineageStore';
import useAuthStore from '../../store/authStore';
import { syncEntityGraph, hydrateEntityGraph } from '../../services/firebase/entityGraphService';
import './UniversalEntityGraph.css';

const CANVAS_WIDTH = 3200;
const CANVAS_HEIGHT = 2400;
const CX = CANVAS_WIDTH / 2;
const CY = CANVAS_HEIGHT / 2;

export const UniversalEntityGraph = ({ onEntityClick, onEntityDoubleClick, selectedEntity }) => {
  const activeWorldId = useWorldStore((state) => state.activeWorldId || 'mythrill');
  const activeWorld = useWorldStore((state) => state.getActiveWorld ? state.getActiveWorld() : null);
  
  const allFactions = useFactionStore((state) => {
    return state.getAllFactions ? state.getAllFactions(activeWorldId) : (state.factions || []);
  });

  const locations = useWorldStore((state) => {
    const actWorld = state.getActiveWorld ? state.getActiveWorld() : null;
    const customLocs = actWorld?.customLocations || [];
    if (activeWorldId === 'mythrill') {
      return [...(state.locations || []), ...customLocs];
    }
    return customLocs;
  });

  const trees = useFamilyTreeStore((state) => {
    return state.getAllTrees ? state.getAllTrees(activeWorldId) : (state.trees || []);
  });

  const allLineages = useMemo(() => {
    try {
      return useWorldStore.getState().getAllLineages ? useWorldStore.getState().getAllLineages() : [];
    } catch { return []; }
  }, [activeWorldId]);
  const graphRegions = useMemo(() => {
    try { const ws = useWorldStore.getState(); return ws.getRegions ? ws.getRegions() : []; } catch { return []; }
  }, [activeWorldId]);

  const [activeTypeFilters, setActiveTypeFilters] = useState(['faction', 'lineage', 'location', 'family_node', 'custom']);
  const [activeRelFilter, setActiveRelFilter] = useState('all');
  const [showMinorPowers, setShowMinorPowers] = useState(false);
  const [layoutMode, setLayoutMode] = useState('cluster'); // 'cluster' | 'orbital'
  const [hideDisconnected, setHideDisconnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(selectedEntity?.id || null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [pathwayHistory, setPathwayHistory] = useState([]);
  const [strictPathway, setStrictPathway] = useState(false);

  // Hide redundant folk/culture factions (race-mirror factions) unless the user asks for them
  const factions = useMemo(
    () => allFactions.filter((f) => showMinorPowers || !f.minor),
    [allFactions, showMinorPowers]
  );

  // Pan & Zoom state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(0.55);
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef(null);

  // Synchronized refs to eliminate stale closures and effect churn in event handlers
  const panOffsetRef = useRef(panOffset);
  panOffsetRef.current = panOffset;
  const zoomLevelRef = useRef(zoomLevel);
  zoomLevelRef.current = zoomLevel;

  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  // Node Dragging state
  const draggedNodeIdRef = useRef(null);
  const dragStartPosRef = useRef({ clientX: 0, clientY: 0, nodeX: 0, nodeY: 0 });
  const [customPositions, setCustomPositions] = useState({});
  const customPositionsRef = useRef(customPositions);
  customPositionsRef.current = customPositions;

  // Custom user-authored nodes & connections state (persisted locally +
  // synced to Firestore users/{uid}/worldbuilding/entityGraph)
  const { user: authUser } = useAuthStore();
  const [customUserNodes, setCustomUserNodes] = useState(() => {
    try {
      const saved = localStorage.getItem('mythrill_custom_graph_nodes');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [customUserEdges, setCustomUserEdges] = useState(() => {
    try {
      const saved = localStorage.getItem('mythrill_custom_graph_edges');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Latest lists for the debounced cloud flush (state closures go stale)
  const customUserNodesRef = useRef(customUserNodes);
  customUserNodesRef.current = customUserNodes;
  const customUserEdgesRef = useRef(customUserEdges);
  customUserEdgesRef.current = customUserEdges;
  const cloudFlushTimerRef = useRef(null);

  // Authoring modals & link creation state
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showAddEdgeModal, setShowAddEdgeModal] = useState(false);
  const [linkingSourceNodeId, setLinkingSourceNodeId] = useState(null);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState('lineage');
  const [newNodeRegion, setNewNodeRegion] = useState('frostwood-reach');
  const [newNodeDesc, setNewNodeDesc] = useState('');

  const [newEdgeTargetId, setNewEdgeTargetId] = useState('');
  const [newEdgeType, setNewEdgeType] = useState('alliance');
  const [newEdgeLabel, setNewEdgeLabel] = useState('');

  // Hydrate custom nodes/edges from the cloud on mount. If the cloud doc is
  // empty but local data exists (first sync after this feature shipped),
  // push the local data up. Cloud wins when both exist (newest device state).
  useEffect(() => {
    const uid = authUser?.uid && !authUser.uid.startsWith('guest-') ? authUser.uid : null;
    if (!uid) return;
    let cancelled = false;
    (async () => {
      const cloud = await hydrateEntityGraph(uid);
      if (cancelled || !cloud) return;
      const hasCloudData = cloud.customNodes.length > 0 || cloud.customEdges.length > 0;
      const hasLocalData = customUserNodesRef.current.length > 0 || customUserEdgesRef.current.length > 0;
      if (hasCloudData) {
        setCustomUserNodes(cloud.customNodes);
        setCustomUserEdges(cloud.customEdges);
        try {
          localStorage.setItem('mythrill_custom_graph_nodes', JSON.stringify(cloud.customNodes));
          localStorage.setItem('mythrill_custom_graph_edges', JSON.stringify(cloud.customEdges));
        } catch {}
      } else if (hasLocalData) {
        syncEntityGraph(uid, {
          customNodes: customUserNodesRef.current,
          customEdges: customUserEdgesRef.current
        });
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid]);

  // Persist custom user nodes/edges to localStorage + debounced cloud sync
  const saveCustomNodes = (nodes) => {
    setCustomUserNodes(nodes);
    try { localStorage.setItem('mythrill_custom_graph_nodes', JSON.stringify(nodes)); } catch {}
    scheduleCloudFlush();
  };

  const saveCustomEdges = (edges) => {
    setCustomUserEdges(edges);
    try { localStorage.setItem('mythrill_custom_graph_edges', JSON.stringify(edges)); } catch {}
    scheduleCloudFlush();
  };

  const scheduleCloudFlush = () => {
    const uid = authUser?.uid && !authUser.uid.startsWith('guest-') ? authUser.uid : null;
    if (!uid) return;
    if (cloudFlushTimerRef.current) clearTimeout(cloudFlushTimerRef.current);
    cloudFlushTimerRef.current = setTimeout(() => {
      syncEntityGraph(uid, {
        customNodes: customUserNodesRef.current,
        customEdges: customUserEdgesRef.current
      });
    }, 2000);
  };

  // Flush pending cloud writes on unmount
  useEffect(() => {
    return () => {
      if (cloudFlushTimerRef.current) {
        clearTimeout(cloudFlushTimerRef.current);
        const uid = authUser?.uid && !authUser.uid.startsWith('guest-') ? authUser.uid : null;
        if (uid) {
          syncEntityGraph(uid, {
            customNodes: customUserNodesRef.current,
            customEdges: customUserEdgesRef.current
          });
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid]);

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

    // Lineages & Peoples (Species) nodes
    allLineages.forEach((l) => {
      nodes.push({
        id: `lineage:${l.id}`,
        rawId: l.id,
        name: l.name,
        type: 'lineage',
        subType: l.category || (l.isCustom ? 'Custom Species' : 'Lineage'),
        color: '#7d3c98',
        crestBg: '#f4ecf7',
        icon: 'fa-dna',
        imageUrl: l.icon || l.imageUrl || null,
        regionId: l.homelandRegionId || l.regionId || 'frostwood-reach',
        description: l.description || l.summary || '',
        data: l
      });
    });

    // Custom user authored nodes
    customUserNodes.forEach((cn) => {
      nodes.push({
        id: cn.id,
        rawId: cn.id,
        name: cn.name,
        type: cn.type || 'custom',
        subType: cn.subType || 'Custom Entity',
        color: cn.color || '#d4af37',
        crestBg: '#fffbf0',
        icon: cn.icon || 'fa-sparkles',
        regionId: cn.regionId || 'frostwood-reach',
        description: cn.description || '',
        isUserCreated: true,
        data: cn
      });
    });

    return nodes;
  }, [factions, locations, trees, allLineages, customUserNodes]);

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

    // Lineage ties to subraces or locations
    allLineages.forEach((l) => {
      if (l.homelandLocationId) {
        edges.push({
          id: `edge:lineage:homeland:${l.id}`,
          source: `lineage:${l.id}`,
          target: `location:${l.homelandLocationId}`,
          type: 'territory',
          label: 'Homeland',
          color: '#7d3c98',
          strokeDash: '4,4'
        });
      }
    });

    // Custom user-authored edges
    customUserEdges.forEach((ce) => {
      edges.push({
        id: ce.id,
        source: ce.source,
        target: ce.target,
        type: ce.type || 'alliance',
        label: ce.label || 'Connection',
        color: ce.color || (ce.type === 'hostile' ? '#a8241b' : ce.type === 'family' ? '#b03a74' : '#7d3c98'),
        isUserCreated: true
      });
    });

    return edges;
  }, [factions, trees, allLineages, customUserEdges]);

  // Connection lookup map
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

  // Filtered nodes
  const visibleNodes = useMemo(() => {
    return allNodes.filter((n) => {
      if (!activeTypeFilters.includes(n.type)) return false;
      if (hideDisconnected && (!connectionMap.has(n.id) || connectionMap.get(n.id).size === 0)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = n.name.toLowerCase().includes(q);
        const matchesSub = n.subType.toLowerCase().includes(q);
        const matchesDesc = n.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc) return false;
      }
      return true;
    });
  }, [allNodes, activeTypeFilters, hideDisconnected, connectionMap, searchQuery]);

  // Filtered edges
  const visibleEdges = useMemo(() => {
    const validNodeIds = new Set(visibleNodes.map((n) => n.id));
    return allEdges.filter((e) => {
      if (!validNodeIds.has(e.source) || !validNodeIds.has(e.target)) return false;
      if (activeRelFilter === 'all') return true;
      if (activeRelFilter === 'territory') return e.type === 'territory';
      if (activeRelFilter === 'family') return e.type === 'family';
      if (activeRelFilter === 'alliance') return e.type === 'alliance' || e.type === 'allied' || e.type === 'friendly';
      if (activeRelFilter === 'hostile') return e.type === 'hostile' || e.type === 'war' || e.type === 'rival';
      return e.type === activeRelFilter;
    });
  }, [allEdges, visibleNodes, activeRelFilter]);

  // Active Pathway Focus & Multi-tier Connectivity Computation
  const activeFocusId = hoveredNodeId || selectedNodeId;

  const pathwayData = useMemo(() => {
    if (!activeFocusId || !connectionMap.has(activeFocusId)) {
      return {
        degree0Id: activeFocusId || null,
        degree1Set: new Set(),
        degree2Set: new Set(),
        degree1Edges: new Set(),
        degree2Edges: new Set(),
        hasActivePathway: false,
        parentMap: new Map()
      };
    }

    const d1Set = new Set(connectionMap.get(activeFocusId) || []);
    const d2Set = new Set();
    const parentMap = new Map();

    d1Set.forEach((d1NodeId) => {
      const neighbors = connectionMap.get(d1NodeId);
      if (neighbors) {
        neighbors.forEach((n2) => {
          if (n2 !== activeFocusId && !d1Set.has(n2)) {
            d2Set.add(n2);
            if (!parentMap.has(n2)) {
              parentMap.set(n2, d1NodeId);
            }
          }
        });
      }
    });

    const d1Edges = new Set();
    const d2Edges = new Set();

    allEdges.forEach((edge) => {
      const isD0Source = edge.source === activeFocusId;
      const isD0Target = edge.target === activeFocusId;

      if ((isD0Source && d1Set.has(edge.target)) || (isD0Target && d1Set.has(edge.source))) {
        d1Edges.add(edge.id);
      } else if (
        (d1Set.has(edge.source) && d2Set.has(edge.target)) ||
        (d1Set.has(edge.target) && d2Set.has(edge.source)) ||
        (d1Set.has(edge.source) && d1Set.has(edge.target))
      ) {
        d2Edges.add(edge.id);
      }
    });

    return {
      degree0Id: activeFocusId,
      degree1Set: d1Set,
      degree2Set: d2Set,
      degree1Edges: d1Edges,
      degree2Edges: d2Edges,
      hasActivePathway: true,
      parentMap
    };
  }, [activeFocusId, connectionMap, allEdges]);

  // Dynamic Layout: Generous, responsive concentric arrangement
  const defaultPositions = useMemo(() => {
    const positions = {};

    // Specialized Pathway Radial Tree layout
    if (layoutMode === 'pathway') {
      const focusId = selectedNodeId || hoveredNodeId;
      if (!focusId || !visibleNodes.some((n) => n.id === focusId)) {
        visibleNodes.forEach((n, i) => {
          const angle = (i / (visibleNodes.length || 1)) * Math.PI * 2;
          const r = 380 + (i % 3) * 180;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * r),
            y: Math.round(CY + Math.sin(angle) * (r * 0.75))
          };
        });
        return positions;
      }

      positions[focusId] = { x: CX, y: CY };

      const d1Array = visibleNodes.filter((n) => pathwayData.degree1Set.has(n.id));
      const d2Array = visibleNodes.filter((n) => pathwayData.degree2Set.has(n.id));
      const otherNodes = visibleNodes.filter(
        (n) => n.id !== focusId && !pathwayData.degree1Set.has(n.id) && !pathwayData.degree2Set.has(n.id)
      );

      const d1Count = d1Array.length || 1;
      const d1Angles = new Map();
      d1Array.forEach((n, i) => {
        const angle = (i / d1Count) * Math.PI * 2 - Math.PI / 2;
        d1Angles.set(n.id, angle);
        positions[n.id] = {
          x: Math.round(CX + Math.cos(angle) * 480),
          y: Math.round(CY + Math.sin(angle) * 360)
        };
      });

      const d2Count = d2Array.length || 1;
      d2Array.forEach((n, i) => {
        const parentId = pathwayData.parentMap.get(n.id);
        const parentAngle = parentId && d1Angles.has(parentId) ? d1Angles.get(parentId) : (i / d2Count) * Math.PI * 2;
        const angleOffset = ((i % 5) - 2) * 0.18;
        const finalAngle = parentAngle + angleOffset;
        positions[n.id] = {
          x: Math.round(CX + Math.cos(finalAngle) * 920),
          y: Math.round(CY + Math.sin(finalAngle) * 680)
        };
      });

      const otherCount = otherNodes.length || 1;
      otherNodes.forEach((n, i) => {
        const angle = (i / otherCount) * Math.PI * 2;
        positions[n.id] = {
          x: Math.round(CX + Math.cos(angle) * 1400),
          y: Math.round(CY + Math.sin(angle) * 1050)
        };
      });

      return positions;
    }

    const factionNodes = visibleNodes.filter((n) => n.type === 'faction');
    const lineageNodes = visibleNodes.filter((n) => n.type === 'lineage');
    const locationNodes = visibleNodes.filter((n) => n.type === 'location');
    const familyNodes = visibleNodes.filter((n) => n.type === 'family_node');
    const customNodes = visibleNodes.filter((n) => n.type === 'custom');

    const totalActiveGroups = [factionNodes, lineageNodes, locationNodes, familyNodes, customNodes].filter(
      (g) => g.length > 0
    ).length;

    // Adapt radial tiers based on whether only a single group or multiple groups are active
    if (layoutMode === 'cluster' && totalActiveGroups <= 1) {
      // Single category focused layout: arrange smoothly in expanding rings from center
      const nodes = visibleNodes;
      const count = nodes.length;
      if (count <= 8) {
        nodes.forEach((n, i) => {
          const angle = (i / (count || 1)) * Math.PI * 2 - Math.PI / 2;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * 320),
            y: Math.round(CY + Math.sin(angle) * 240)
          };
        });
      } else if (count <= 20) {
        const ring1 = nodes.slice(0, 7);
        const ring2 = nodes.slice(7);
        ring1.forEach((n, i) => {
          const angle = (i / (ring1.length || 1)) * Math.PI * 2 - Math.PI / 2;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * 280),
            y: Math.round(CY + Math.sin(angle) * 210)
          };
        });
        ring2.forEach((n, i) => {
          const angle = (i / (ring2.length || 1)) * Math.PI * 2 - Math.PI / 4;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * 580),
            y: Math.round(CY + Math.sin(angle) * 440)
          };
        });
      } else {
        const ring1 = nodes.slice(0, 10);
        const ring2 = nodes.slice(10, 28);
        const ring3 = nodes.slice(28);
        ring1.forEach((n, i) => {
          const angle = (i / (ring1.length || 1)) * Math.PI * 2 - Math.PI / 2;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * 320),
            y: Math.round(CY + Math.sin(angle) * 240)
          };
        });
        ring2.forEach((n, i) => {
          const angle = (i / (ring2.length || 1)) * Math.PI * 2 - Math.PI / 4;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * 640),
            y: Math.round(CY + Math.sin(angle) * 480)
          };
        });
        ring3.forEach((n, i) => {
          const angle = (i / (ring3.length || 1)) * Math.PI * 2;
          positions[n.id] = {
            x: Math.round(CX + Math.cos(angle) * 940),
            y: Math.round(CY + Math.sin(angle) * 700)
          };
        });
      }
      return positions;
    }

    // Multi-group hierarchical / orbital layout
    const innerFactions = factionNodes.slice(0, 14);
    const midFactions = factionNodes.slice(14, 34);
    const outerFactions = factionNodes.slice(34);

    innerFactions.forEach((n, i) => {
      const angle = (i / (innerFactions.length || 1)) * Math.PI * 2 - Math.PI / 2;
      positions[n.id] = {
        x: Math.round(CX + Math.cos(angle) * 340),
        y: Math.round(CY + Math.sin(angle) * 260)
      };
    });

    midFactions.forEach((n, i) => {
      const angle = (i / (midFactions.length || 1)) * Math.PI * 2 - Math.PI / 4;
      positions[n.id] = {
        x: Math.round(CX + Math.cos(angle) * 620),
        y: Math.round(CY + Math.sin(angle) * 460)
      };
    });

    outerFactions.forEach((n, i) => {
      const angle = (i / (outerFactions.length || 1)) * Math.PI * 2;
      positions[n.id] = {
        x: Math.round(CX + Math.cos(angle) * 880),
        y: Math.round(CY + Math.sin(angle) * 650)
      };
    });

    const lineageRadius = factionNodes.length > 0 ? 1080 : 420;
    const lineageRadiusY = factionNodes.length > 0 ? 800 : 320;
    lineageNodes.forEach((n, i) => {
      const angle = (i / (lineageNodes.length || 1)) * Math.PI * 2 - Math.PI / 3;
      positions[n.id] = {
        x: Math.round(CX + Math.cos(angle) * lineageRadius),
        y: Math.round(CY + Math.sin(angle) * lineageRadiusY)
      };
    });

    const locationRadius = factionNodes.length + lineageNodes.length > 0 ? 1280 : 420;
    const locationRadiusY = factionNodes.length + lineageNodes.length > 0 ? 940 : 320;
    locationNodes.forEach((n, i) => {
      const angle = (i / (locationNodes.length || 1)) * Math.PI * 2 + Math.PI / 6;
      positions[n.id] = {
        x: Math.round(CX + Math.cos(angle) * locationRadius),
        y: Math.round(CY + Math.sin(angle) * locationRadiusY)
      };
    });

    const others = familyNodes.concat(customNodes);
    const othersRadius = factionNodes.length + lineageNodes.length + locationNodes.length > 0 ? 1440 : 420;
    const othersRadiusY = factionNodes.length + lineageNodes.length + locationNodes.length > 0 ? 1060 : 320;
    others.forEach((n, i) => {
      const angle = (i / (others.length || 1)) * Math.PI * 2;
      positions[n.id] = {
        x: Math.round(CX + Math.cos(angle) * othersRadius),
        y: Math.round(CY + Math.sin(angle) * othersRadiusY)
      };
    });

    return positions;
  }, [visibleNodes, layoutMode, pathwayData, selectedNodeId, hoveredNodeId]);

  const getNodePos = useCallback(
    (id) => {
      return customPositions[id] || defaultPositions[id] || { x: CX, y: CY };
    },
    [customPositions, defaultPositions]
  );

  // Auto-fit visible nodes to the screen
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current || visibleNodes.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const vWidth = rect.width || 1100;
    const vHeight = rect.height || 720;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    visibleNodes.forEach((n) => {
      const pos = customPositionsRef.current[n.id] || defaultPositions[n.id] || { x: CX, y: CY };
      if (pos.x < minX) minX = pos.x;
      if (pos.x > maxX) maxX = pos.x;
      if (pos.y < minY) minY = pos.y;
      if (pos.y > maxY) maxY = pos.y;
    });

    if (minX === Infinity) {
      minX = CX - 300; maxX = CX + 300; minY = CY - 200; maxY = CY + 200;
    }

    const padding = 160;
    const bWidth = Math.max(maxX - minX + padding * 2, 600);
    const bHeight = Math.max(maxY - minY + padding * 2, 450);

    const fitZoom = Math.max(0.25, Math.min(1.2, Math.min(vWidth / bWidth, vHeight / bHeight)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const newZoom = +fitZoom.toFixed(2);
    const newPan = {
      x: Math.round(vWidth / 2 - centerX * newZoom),
      y: Math.round(vHeight / 2 - centerY * newZoom)
    };

    setZoomLevel(newZoom);
    setPanOffset(newPan);
  }, [visibleNodes, defaultPositions]);

  // Re-fit when user alters active filters, layout mode, or search (or when focused node changes in pathway layout)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 60);
    return () => clearTimeout(timer);
  }, [activeTypeFilters, activeRelFilter, layoutMode, hideDisconnected, layoutMode === 'pathway' ? selectedNodeId : null]);

  const handleResetLayout = () => {
    setCustomPositions({});
    setTimeout(() => handleFitToScreen(), 50);
  };

  // Zoom by factor around viewport center
  const handleZoomByFactor = (factor) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const prevZoom = zoomLevelRef.current;
    const newZoom = Math.max(0.2, Math.min(2.5, +(prevZoom * factor).toFixed(2)));
    if (newZoom === prevZoom) return;

    const worldX = (centerX - panOffsetRef.current.x) / prevZoom;
    const worldY = (centerY - panOffsetRef.current.y) / prevZoom;

    const newPan = {
      x: Math.round(centerX - worldX * newZoom),
      y: Math.round(centerY - worldY * newZoom)
    };

    setZoomLevel(newZoom);
    setPanOffset(newPan);
  };

  // --- Pan & Mouse Dragging Engine ---
  const handleSelectNode = useCallback((nodeId) => {
    if (!nodeId) {
      setSelectedNodeId(null);
      return;
    }
    setSelectedNodeId((prevId) => {
      if (prevId && prevId !== nodeId) {
        setPathwayHistory((hist) => [...hist.slice(-15), prevId]);
      }
      return nodeId;
    });
    const node = allNodes.find((n) => n.id === nodeId);
    if (node && onEntityClick) onEntityClick(node);
  }, [allNodes, onEntityClick]);

  const handlePathwayBack = useCallback(() => {
    setPathwayHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setSelectedNodeId(last);
      return prev.slice(0, -1);
    });
  }, []);

  const handleMouseDown = (e) => {
    if (
      e.target.closest('.pathfinder-graph-node') ||
      e.target.closest('.pathfinder-graph-toolbar') ||
      e.target.closest('.pathfinder-floating-hud') ||
      e.target.closest('.pathway-trail-hud') ||
      e.target.closest('.custom-rel-modal-overlay') ||
      e.target.closest('.pathfinder-codex-drawer') ||
      e.target.closest('.edge-label-pill')
    ) {
      return;
    }
    isPanningRef.current = true;
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panOffsetRef.current.x,
      startPanY: panOffsetRef.current.y,
      hasMoved: false
    };
    setIsPanning(true);
  };

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (linkingSourceNodeId) {
      if (linkingSourceNodeId !== nodeId) {
        setNewEdgeTargetId(nodeId);
        setShowAddEdgeModal(true);
      }
      setLinkingSourceNodeId(null);
      return;
    }
    const curPos = getNodePos(nodeId);
    draggedNodeIdRef.current = nodeId;
    dragStartPosRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      nodeX: curPos.x,
      nodeY: curPos.y
    };
    handleSelectNode(nodeId);
  };

  // --- Touch Gesture State & Handlers ---
  const touchStateRef = useRef({
    mode: 'none',
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    nodeId: null,
    nodeStartX: 0,
    nodeStartY: 0,
    hasMoved: false,
    initialPinchDist: 0,
    initialZoom: 1,
    initialPan: { x: 0, y: 0 }
  });

  // Global mouse move and mouse up listeners with stable refs (no churn)
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        if (Math.hypot(dx, dy) > 5) {
          panStartRef.current.hasMoved = true;
        }
        setPanOffset({
          x: panStartRef.current.startPanX + dx,
          y: panStartRef.current.startPanY + dy
        });
      } else if (draggedNodeIdRef.current) {
        const nodeId = draggedNodeIdRef.current;
        const dx = (e.clientX - dragStartPosRef.current.clientX) / zoomLevelRef.current;
        const dy = (e.clientY - dragStartPosRef.current.clientY) / zoomLevelRef.current;
        setCustomPositions((prev) => ({
          ...prev,
          [nodeId]: {
            x: Math.round(dragStartPosRef.current.nodeX + dx),
            y: Math.round(dragStartPosRef.current.nodeY + dy)
          }
        }));
      }
    };

    const handleGlobalMouseUp = () => {
      if (isPanningRef.current) {
        if (!panStartRef.current.hasMoved) {
          setSelectedNodeId(null);
        }
        isPanningRef.current = false;
        setIsPanning(false);
      }
      if (draggedNodeIdRef.current) {
        draggedNodeIdRef.current = null;
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Native non-passive Touch handling for container (Pan, Node Drag, Pinch Zoom)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      const isControl =
        e.target.closest('.pathfinder-floating-hud') ||
        e.target.closest('.pathway-trail-hud') ||
        e.target.closest('.pathfinder-codex-drawer') ||
        e.target.closest('.custom-rel-modal-overlay') ||
        e.target.closest('.pathfinder-graph-toolbar');
      if (isControl) return;

      const touches = e.touches;
      if (touches.length === 1) {
        const touch = touches[0];
        const targetNode = e.target.closest('.pathfinder-graph-node');

        if (targetNode) {
          const nodeId = targetNode.getAttribute('data-node-id');
          if (nodeId) {
            const curPos = getNodePos(nodeId);
            touchStateRef.current = {
              mode: 'nodeDrag',
              startX: touch.clientX,
              startY: touch.clientY,
              startPanX: panOffsetRef.current.x,
              startPanY: panOffsetRef.current.y,
              nodeId,
              nodeStartX: curPos.x,
              nodeStartY: curPos.y,
              hasMoved: false,
              initialPinchDist: 0,
              initialZoom: zoomLevelRef.current,
              initialPan: { ...panOffsetRef.current }
            };
            if (e.cancelable) e.preventDefault();
            return;
          }
        }

        // Background canvas panning
        touchStateRef.current = {
          mode: 'pan',
          startX: touch.clientX,
          startY: touch.clientY,
          startPanX: panOffsetRef.current.x,
          startPanY: panOffsetRef.current.y,
          nodeId: null,
          nodeStartX: 0,
          nodeStartY: 0,
          hasMoved: false,
          initialPinchDist: 0,
          initialZoom: zoomLevelRef.current,
          initialPan: { ...panOffsetRef.current }
        };
        setIsPanning(true);
        if (e.cancelable) e.preventDefault();
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
          startPanX: panOffsetRef.current.x,
          startPanY: panOffsetRef.current.y,
          nodeId: null,
          nodeStartX: 0,
          nodeStartY: 0,
          hasMoved: true,
          initialPinchDist: dist,
          initialZoom: zoomLevelRef.current,
          initialPan: { ...panOffsetRef.current }
        };
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      const state = touchStateRef.current;
      if (state.mode === 'none') return;

      const touches = e.touches;

      if (state.mode === 'pan' && touches.length === 1) {
        const touch = touches[0];
        const dx = touch.clientX - state.startX;
        const dy = touch.clientY - state.startY;
        if (Math.hypot(dx, dy) > 4) {
          state.hasMoved = true;
        }
        setPanOffset({
          x: state.startPanX + dx,
          y: state.startPanY + dy
        });
        if (e.cancelable) e.preventDefault();
      } else if (state.mode === 'nodeDrag' && touches.length === 1 && state.nodeId) {
        const touch = touches[0];
        const dx = touch.clientX - state.startX;
        const dy = touch.clientY - state.startY;
        if (Math.hypot(dx, dy) > 6) {
          state.hasMoved = true;
        }
        const scaledDx = dx / zoomLevelRef.current;
        const scaledDy = dy / zoomLevelRef.current;
        setCustomPositions((prev) => ({
          ...prev,
          [state.nodeId]: {
            x: Math.round(state.nodeStartX + scaledDx),
            y: Math.round(state.nodeStartY + scaledDy)
          }
        }));
        if (e.cancelable) e.preventDefault();
      } else if (state.mode === 'pinch' && touches.length === 2) {
        const t1 = touches[0];
        const t2 = touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        if (state.initialPinchDist > 0) {
          const factor = currentDist / state.initialPinchDist;
          const newZoom = Math.max(0.2, Math.min(2.5, +(state.initialZoom * factor).toFixed(3)));
          const rect = el.getBoundingClientRect();
          const cursorX = midX - rect.left;
          const cursorY = midY - rect.top;

          const zoomRatio = newZoom / state.initialZoom;
          const newPanX = cursorX - (cursorX - state.initialPan.x) * zoomRatio;
          const newPanY = cursorY - (cursorY - state.initialPan.y) * zoomRatio;

          setZoomLevel(newZoom);
          setPanOffset({
            x: Math.round(newPanX),
            y: Math.round(newPanY)
          });
        }
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      const state = touchStateRef.current;
      if (state.mode === 'nodeDrag' && !state.hasMoved && state.nodeId) {
        // Tap on node: select it to open sidebar drawer
        setSelectedNodeId(state.nodeId);
      } else if (state.mode === 'pan' && !state.hasMoved) {
        setSelectedNodeId(null);
      }

      if (e.touches.length === 0) {
        setIsPanning(false);
        touchStateRef.current.mode = 'none';
        touchStateRef.current.nodeId = null;
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [allNodes, getNodePos, onEntityClick]);

  // --- Wheel Zoom around cursor & ResizeObserver ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const prevZoom = zoomLevelRef.current;
      const newZoom = Math.max(0.2, Math.min(2.5, +(prevZoom * zoomFactor).toFixed(3)));
      if (newZoom === prevZoom) return;

      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const worldX = (cursorX - panOffsetRef.current.x) / prevZoom;
      const worldY = (cursorY - panOffsetRef.current.y) / prevZoom;

      const newPan = {
        x: Math.round(cursorX - worldX * newZoom),
        y: Math.round(cursorY - worldY * newZoom)
      };

      setZoomLevel(newZoom);
      setPanOffset(newPan);
    };

    el.addEventListener('wheel', handleNativeWheel, { passive: false });

    let prevW = el.clientWidth;
    let prevH = el.clientHeight;

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (Math.abs(width - prevW) > 25 || Math.abs(height - prevH) > 25) {
            prevW = width;
            prevH = height;
            handleFitToScreen();
          }
        }
      });
      ro.observe(el);
    }

    return () => {
      el.removeEventListener('wheel', handleNativeWheel);
      if (ro) ro.disconnect();
    };
  }, [handleFitToScreen]);

  // --- Authoring Handlers ---
  const handleCreateCustomNode = () => {
    if (!newNodeName.trim()) return;
    const newNode = {
      id: `custom:${Date.now()}`,
      name: newNodeName.trim(),
      type: newNodeType,
      subType: newNodeType === 'lineage' ? 'Custom Lineage' : newNodeType === 'faction' ? 'Custom Order' : 'Custom Entity',
      color: newNodeType === 'lineage' ? '#7d3c98' : newNodeType === 'faction' ? '#8b261e' : '#d4af37',
      icon: newNodeType === 'lineage' ? 'fa-dna' : newNodeType === 'faction' ? 'fa-shield-halved' : 'fa-star',
      regionId: newNodeRegion,
      description: newNodeDesc.trim()
    };
    saveCustomNodes([...customUserNodes, newNode]);
    setNewNodeName('');
    setNewNodeDesc('');
    setShowAddNodeModal(false);
  };

  const handleCreateCustomEdge = () => {
    if (!linkingSourceNodeId && !selectedNodeId) return;
    const source = linkingSourceNodeId || selectedNodeId;
    const target = newEdgeTargetId;
    if (!target || source === target) return;

    const newEdge = {
      id: `custom_edge:${Date.now()}`,
      source,
      target,
      type: newEdgeType,
      label: newEdgeLabel.trim() || (newEdgeType === 'hostile' ? 'War' : newEdgeType === 'family' ? 'Bloodline' : 'Allied'),
      color: newEdgeType === 'hostile' ? '#a8241b' : newEdgeType === 'family' ? '#b03a74' : '#7d3c98'
    };

    saveCustomEdges([...customUserEdges, newEdge]);
    setNewEdgeLabel('');
    setShowAddEdgeModal(false);
    setLinkingSourceNodeId(null);
  };

  const deleteCustomNode = (nodeId) => {
    saveCustomNodes(customUserNodes.filter((n) => n.id !== nodeId));
    saveCustomEdges(customUserEdges.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const deleteCustomEdge = (edgeId) => {
    saveCustomEdges(customUserEdges.filter((e) => e.id !== edgeId));
  };

  const toggleTypeFilter = (type) => {
    setActiveTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectedNode = useMemo(() => {
    return allNodes.find((n) => n.id === selectedNodeId) || null;
  }, [allNodes, selectedNodeId]);

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
              title={`Toggle Factions & Orders (${factions.length})`}
            >
              <i className="fas fa-shield-halved"></i>
              <span className="chip-label">Factions</span>
              <span className="chip-count">({factions.length})</span>
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('lineage') ? 'active lineage' : ''}`}
              onClick={() => toggleTypeFilter('lineage')}
              title={`Toggle Lineages & Species (${allLineages.length})`}
            >
              <i className="fas fa-dna"></i>
              <span className="chip-label">Lineages</span>
              <span className="chip-count">({allLineages.length})</span>
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('location') ? 'active location' : ''}`}
              onClick={() => toggleTypeFilter('location')}
              title={`Toggle Locations & Realms (${locations.length})`}
            >
              <i className="fas fa-map-pin"></i>
              <span className="chip-label">Locations</span>
              <span className="chip-count">({locations.length})</span>
            </button>
            <button
              type="button"
              className={`pathfinder-filter-chip ${activeTypeFilters.includes('family_node') ? 'active family' : ''}`}
              onClick={() => toggleTypeFilter('family_node')}
              title={`Toggle Dynasty Trees (${trees.reduce((acc, t) => acc + (t.nodes || []).length, 0)})`}
            >
              <i className="fas fa-crown"></i>
              <span className="chip-label">Dynasties</span>
              <span className="chip-count">({trees.reduce((acc, t) => acc + (t.nodes || []).length, 0)})</span>
            </button>
            {customUserNodes.length > 0 && (
              <button
                type="button"
                className={`pathfinder-filter-chip ${activeTypeFilters.includes('custom') ? 'active custom' : ''}`}
                onClick={() => toggleTypeFilter('custom')}
                title={`Toggle Custom Entities (${customUserNodes.length})`}
              >
                <i className="fas fa-sparkles"></i>
                <span className="chip-label">Custom</span>
                <span className="chip-count">({customUserNodes.length})</span>
              </button>
            )}
          </div>

          <div className="toolbar-actions-group">
            <button
              type="button"
              className="pathfinder-action-btn primary"
              onClick={() => setShowAddNodeModal(true)}
              title="Create Custom Lineage, Faction or Entity in the Relationship Web"
              aria-label="Add Entity"
            >
              <i className="fas fa-plus"></i>
              <span className="btn-label-desktop"> Entity</span>
            </button>
            <button
              type="button"
              className={`pathfinder-action-btn ${linkingSourceNodeId ? 'active' : ''}`}
              onClick={() => {
                if (linkingSourceNodeId) setLinkingSourceNodeId(null);
                else if (selectedNodeId) setLinkingSourceNodeId(selectedNodeId);
                else alert('Click any node on the web first, then click Link Relation!');
              }}
              title="Click a node and link a custom relation to another node"
              aria-label="Link Relation"
            >
              <i className="fas fa-link"></i>
              <span className="btn-label-desktop">{linkingSourceNodeId ? ' Target...' : ' Link'}</span>
            </button>
            <button
              type="button"
              className={`pathfinder-action-btn mobile-search-toggle ${showMobileSearch ? 'active' : ''}`}
              onClick={() => setShowMobileSearch((prev) => !prev)}
              title="Toggle Search & Filters"
              aria-label="Toggle Filters"
            >
              <i className="fas fa-sliders"></i>
            </button>
          </div>
        </div>

        {/* Secondary controls row */}
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
              onChange={(e) => {
                const newMode = e.target.value;
                setLayoutMode(newMode);
                if (newMode === 'pathway' && !selectedNodeId && visibleNodes.length > 0) {
                  const firstFaction = visibleNodes.find((n) => n.type === 'faction') || visibleNodes[0];
                  if (firstFaction) handleSelectNode(firstFaction.id);
                }
              }}
              className="pathfinder-select"
              title="Layout Organization Mode"
            >
              <option value="cluster">Organic Clusters</option>
              <option value="orbital">Orbital Rings</option>
              <option value="pathway">Pathway Focus (Radial)</option>
            </select>
          </div>

          <button
            type="button"
            className={`pathfinder-action-btn ${showMinorPowers ? 'active' : ''}`}
            onClick={() => setShowMinorPowers((prev) => !prev)}
            title="Show minor powers: folk and culture factions that mirror the races"
            aria-label="Toggle minor powers"
          >
            <i className="fas fa-feather"></i>
            <span className="btn-label-desktop">Minor Powers</span>
          </button>

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
                title="Clear Search"
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
        className={`pathfinder-canvas-container ${isPanning ? 'panning' : ''} ${linkingSourceNodeId ? 'linking-mode' : ''} ${strictPathway ? 'strict-pathway' : ''}`}
        onMouseDown={handleMouseDown}
      >
        {/* Floating Canvas HUD Controls */}
        <div className="pathfinder-floating-hud">
          <button
            type="button"
            className="hud-btn"
            onClick={() => handleZoomByFactor(1.18)}
            title="Zoom In"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={() => handleZoomByFactor(0.85)}
            title="Zoom Out"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={handleFitToScreen}
            title="Fit Graph to Screen"
          >
            <i className="fas fa-expand"></i>
          </button>
          <button
            type="button"
            className="hud-btn"
            onClick={handleResetLayout}
            title="Reset to Default Layout"
          >
            <i className="fas fa-rotate"></i>
          </button>
        </div>

        {/* Unified Transformed Stage Viewport */}
        <div
          className="pathfinder-canvas-stage"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {/* SVG Canvas for Relationship Lines */}
          <svg
            className="pathfinder-graph-svg"
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          >
            {visibleEdges.map((edge) => {
              const p1 = getNodePos(edge.source);
              const p2 = getNodePos(edge.target);
              const isHovered = hoveredEdge === edge.id;

              const isD1Edge = pathwayData.hasActivePathway && pathwayData.degree1Edges.has(edge.id);
              const isD2Edge = pathwayData.hasActivePathway && pathwayData.degree2Edges.has(edge.id);
              const isDistantEdge = pathwayData.hasActivePathway && !isD1Edge && !isD2Edge;

              let edgeClass = 'graph-edge-group';
              if (pathwayData.hasActivePathway) {
                if (isD1Edge) edgeClass += ' pathway-edge-1';
                else if (isD2Edge) edgeClass += ' pathway-edge-2';
                else edgeClass += ' pathway-edge-distant dimmed';
              }
              if (isHovered) edgeClass += ' hovered';

              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const showLabel = edge.label && (isHovered || (isD1Edge && zoomLevel >= 0.45));

              return (
                <g
                  key={edge.id}
                  className={edgeClass}
                  onMouseEnter={() => setHoveredEdge(edge.id)}
                  onMouseLeave={() => setHoveredEdge(null)}
                >
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={edge.color}
                    strokeWidth={isHovered ? 4.5 : isD1Edge ? 3.6 : isD2Edge ? 2.2 : 1.6}
                    strokeDasharray={edge.strokeDash || (isD2Edge ? '4,3' : 'none')}
                    className="edge-line"
                  />
                  {showLabel && (
                    <g transform={`translate(${midX}, ${midY})`} className="edge-label-pill">
                      <rect
                        x={-(edge.label.length * 3.8 + 8)}
                        y="-9"
                        width={edge.label.length * 7.6 + 16}
                        height="18"
                        rx="4"
                        fill="#fefcf8"
                        stroke={edge.color}
                        strokeWidth="1.2"
                      />
                      <text x="0" y="3.5" textAnchor="middle" fill="#2b1408" fontSize="9.5" fontWeight="700">
                        {edge.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Rendered Graph Nodes Layer */}
          <div className="pathfinder-nodes-layer">
            {visibleNodes.map((node) => {
              const pos = getNodePos(node.id);
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isLinkingSource = linkingSourceNodeId === node.id;

              const isDegree0 = pathwayData.hasActivePathway && node.id === pathwayData.degree0Id;
              const isDegree1 = pathwayData.hasActivePathway && pathwayData.degree1Set.has(node.id);
              const isDegree2 = pathwayData.hasActivePathway && pathwayData.degree2Set.has(node.id);

              let nodeClasses = `pathfinder-graph-node ${node.type}`;
              if (isSelected) nodeClasses += ' selected';
              if (isHovered) nodeClasses += ' hovered';
              if (isLinkingSource) nodeClasses += ' linking-source';

              if (pathwayData.hasActivePathway) {
                if (isDegree0) nodeClasses += ' pathway-root';
                else if (isDegree1) nodeClasses += ' pathway-degree-1';
                else if (isDegree2) nodeClasses += ' pathway-degree-2';
                else nodeClasses += ' pathway-distant dimmed';
              }

              return (
                <div
                  key={node.id}
                  data-node-id={node.id}
                  className={nodeClasses}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    '--node-color': node.color,
                    '--node-crest-bg': node.crestBg
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectNode(node.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (onEntityDoubleClick) onEntityDoubleClick(node);
                  }}
                >
                  <div className="node-crest-seal">
                    {node.imageUrl ? (
                      <img src={node.imageUrl} alt={node.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <i className={`fas ${node.icon}`}></i>
                    )}
                  </div>
                  <div className="node-content-stack">
                    <div className="node-title-row">
                      <span className="node-name-text">{node.name}</span>
                      {isDegree0 && <span className="pathway-indicator-badge root" title="Focal Root Faction">ROOT</span>}
                      {isDegree1 && <span className="pathway-indicator-badge d1" title="Direct 1st-Degree Connection">1st</span>}
                      {isDegree2 && <span className="pathway-indicator-badge d2" title="Secondary 2nd-Degree Connection">2nd</span>}
                    </div>
                    <span className="node-type-badge">{node.subType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* On-Canvas Floating Pathway Trail & Navigator HUD */}
        {selectedNode && (
          <div className="pathway-trail-hud">
            <div className="pathway-trail-left">
              {pathwayHistory.length > 0 && (
                <button
                  type="button"
                  className="pathway-hud-btn back-btn"
                  onClick={handlePathwayBack}
                  title="Step back to previous faction along pathway"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
              )}
              <div className="pathway-hud-root-info">
                <span className="pathway-hud-tag">PATHWAY FOCUS</span>
                <span className="pathway-hud-name">
                  <i className={`fas ${selectedNode.icon}`} style={{ color: selectedNode.color, marginRight: 6 }}></i>
                  {selectedNode.name}
                </span>
              </div>
              <div className="pathway-hud-counts">
                <span className="pathway-count-chip d1" title="Direct 1st-degree connections">
                  <strong>{pathwayData.degree1Set.size}</strong> Direct
                </span>
                <span className="pathway-count-chip d2" title="Secondary 2nd-degree connections">
                  <strong>{pathwayData.degree2Set.size}</strong> 2nd Degree
                </span>
              </div>
            </div>

            {pathwayData.degree1Set.size > 0 && (
              <div className="pathway-trail-middle">
                <span className="pathway-hops-title">Hop to Connection:</span>
                <div className="pathway-hops-scroll">
                  {Array.from(pathwayData.degree1Set).map((d1Id) => {
                    const d1Node = allNodes.find((n) => n.id === d1Id);
                    if (!d1Node) return null;
                    return (
                      <button
                        key={d1Id}
                        type="button"
                        className="pathway-hop-btn"
                        onClick={() => handleSelectNode(d1Id)}
                        onMouseEnter={() => setHoveredNodeId(d1Id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        style={{ '--hop-color': d1Node.color }}
                        title={`Shift focus to ${d1Node.name}`}
                      >
                        <i className={`fas ${d1Node.icon}`} style={{ color: d1Node.color }}></i>
                        <span>{d1Node.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pathway-trail-right">
              <button
                type="button"
                className={`pathway-hud-btn isolate-btn ${strictPathway ? 'active' : ''}`}
                onClick={() => setStrictPathway((prev) => !prev)}
                title={strictPathway ? "Show faded distant nodes" : "Isolate pathway (hide distant nodes)"}
              >
                <i className={`fas ${strictPathway ? 'fa-eye-slash' : 'fa-filter'}`}></i>
                <span className="btn-label-desktop">{strictPathway ? 'Isolated' : 'Isolate'}</span>
              </button>
              <button
                type="button"
                className="pathway-hud-btn close-btn"
                onClick={() => {
                  setSelectedNodeId(null);
                  setPathwayHistory([]);
                }}
                title="Exit pathway focus and show full web"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Node Sidebar Inspector */}
      {selectedNode && (
        <div className="pathfinder-codex-drawer">
          <div className="drawer-header" style={{ borderColor: selectedNode.color }}>
            <div className="header-badge" style={{ background: selectedNode.color }}>
              <i className={`fas ${selectedNode.icon}`}></i>
            </div>
            <div>
              <h3>{selectedNode.name}</h3>
              <span className="sub-badge">{selectedNode.subType}</span>
            </div>
            <button
              type="button"
              className="btn-close-drawer"
              onClick={() => setSelectedNodeId(null)}
              title="Close Details"
            >
              &times;
            </button>
          </div>

          <div className="drawer-body">
            {selectedNode.description && (
              <p className="drawer-desc">{selectedNode.description}</p>
            )}

            <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {onEntityDoubleClick && (
                <button
                  type="button"
                  className="pathfinder-action-btn primary"
                  onClick={() => onEntityDoubleClick(selectedNode)}
                  style={{ flex: '1 1 auto', minWidth: '110px' }}
                  title="Open full codex / information site"
                >
                  <i className="fas fa-book-open"></i> Open Page
                </button>
              )}
              <button
                type="button"
                className="pathfinder-action-btn"
                onClick={() => setLinkingSourceNodeId(selectedNode.id)}
                style={{ flex: '1 1 auto', minWidth: '110px' }}
              >
                <i className="fas fa-link"></i> Link Relation
              </button>
              {selectedNode.isUserCreated && (
                <button
                  type="button"
                  className="pathfinder-action-btn danger"
                  onClick={() => deleteCustomNode(selectedNode.id)}
                  title="Delete Custom Entity"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>

            {/* Direct Connected Entities (Degree 1) */}
            <div className="drawer-pathway-section">
              <h4 style={{ marginTop: '14px', fontFamily: 'Cinzel', fontSize: '0.82rem', color: '#5a2e12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Direct Ties (1st Degree)</span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(139, 90, 26, 0.15)', padding: '1px 7px', borderRadius: '10px', fontWeight: 700 }}>
                  {pathwayData.degree1Set.size}
                </span>
              </h4>
              <div className="connected-entities-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {allEdges
                  .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((edge) => {
                    const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                    const otherNode = allNodes.find((n) => n.id === otherId);
                    if (!otherNode) return null;

                    return (
                      <div
                        key={edge.id}
                        className="connected-entity-item"
                        onClick={() => handleSelectNode(otherNode.id)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (onEntityDoubleClick) onEntityDoubleClick(otherNode);
                        }}
                        title={`Focus pathway on ${otherNode.name} (Double-click to open page)`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#fbf8f0',
                          border: '1px solid #e3d5be',
                          borderRadius: '4px',
                          padding: '6px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fas ${otherNode.icon}`} style={{ color: otherNode.color, fontSize: '0.8rem' }}></i>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2b1408' }}>{otherNode.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.72rem', color: edge.color, fontWeight: 700 }}>{edge.label}</span>
                          <i className="fas fa-arrow-right" style={{ fontSize: '0.65rem', color: '#8b5a1a', opacity: 0.7 }}></i>
                          {edge.isUserCreated && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCustomEdge(edge.id);
                              }}
                              style={{ background: 'none', border: 'none', color: '#a8241b', cursor: 'pointer', fontSize: '0.75rem' }}
                              title="Remove Connection"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Extended Connected Entities (Degree 2) */}
            {pathwayData.degree2Set.size > 0 && (
              <div className="drawer-pathway-section" style={{ marginTop: '16px' }}>
                <h4 style={{ fontFamily: 'Cinzel', fontSize: '0.82rem', color: '#7a5230', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Extended Web (2nd Degree)</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(122, 82, 48, 0.12)', padding: '1px 7px', borderRadius: '10px', fontWeight: 700 }}>
                    {pathwayData.degree2Set.size}
                  </span>
                </h4>
                <p style={{ margin: '2px 0 6px 0', fontSize: '0.73rem', color: '#8c6d46', fontStyle: 'italic' }}>
                  Connections of direct allies & holdings
                </p>
                <div className="connected-entities-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {Array.from(pathwayData.degree2Set).slice(0, 24).map((d2Id) => {
                    const d2Node = allNodes.find((n) => n.id === d2Id);
                    if (!d2Node) return null;
                    const viaId = pathwayData.parentMap.get(d2Id);
                    const viaNode = viaId ? allNodes.find((n) => n.id === viaId) : null;

                    return (
                      <div
                        key={d2Id}
                        className="connected-entity-item secondary"
                        onClick={() => handleSelectNode(d2Node.id)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (onEntityDoubleClick) onEntityDoubleClick(d2Node);
                        }}
                        title={`Shift pathway focus to ${d2Node.name}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#f8f4eb',
                          border: '1px dashed #d9caa7',
                          borderRadius: '4px',
                          padding: '5px 8px',
                          cursor: 'pointer',
                          opacity: 0.95
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className={`fas ${d2Node.icon}`} style={{ color: d2Node.color, fontSize: '0.76rem' }}></i>
                          <span style={{ fontSize: '0.79rem', fontWeight: 600, color: '#3d2516' }}>{d2Node.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {viaNode && (
                            <span style={{ fontSize: '0.68rem', color: '#8b693e' }}>via {viaNode.name}</span>
                          )}
                          <i className="fas fa-arrow-right" style={{ fontSize: '0.65rem', color: '#a07138' }}></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Custom Entity Node */}
      {showAddNodeModal && (
        <div className="custom-rel-modal-overlay" onClick={() => setShowAddNodeModal(false)}>
          <div className="custom-rel-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3><i className="fas fa-sparkles"></i> Create Lore Entity / Species / Faction</h3>
            <div>
              <label>Entity Name</label>
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                placeholder="e.g. Frost Elves, House of Dawn, Sunken Spires..."
                className="conspiracy-modal-input"
              />
            </div>
            <div>
              <label>Entity Category</label>
              <select
                value={newNodeType}
                onChange={(e) => setNewNodeType(e.target.value)}
                className="conspiracy-modal-input"
              >
                <option value="lineage">Lineage & Species (DNA Bloodline)</option>
                <option value="faction">Faction & Order</option>
                <option value="location">Settlement & Landmark</option>
                <option value="custom">Custom Entity</option>
              </select>
            </div>
            <div>
              <label>Region / Realm</label>
              <select
                value={newNodeRegion}
                onChange={(e) => setNewNodeRegion(e.target.value)}
                className="conspiracy-modal-input"
              >
                {graphRegions.length > 0 ? graphRegions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                )) : (
                  <>
                    <option value="frostwood-reach">Frostwood Reach</option>
                    <option value="nordhalla">Nordhalla</option>
                    <option value="sundale">Sundale</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label>Description & Lore</label>
              <textarea
                value={newNodeDesc}
                onChange={(e) => setNewNodeDesc(e.target.value)}
                placeholder="Describe this species, faction, or entity..."
                rows={3}
                className="conspiracy-modal-input"
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="pathfinder-action-btn" onClick={() => setShowAddNodeModal(false)}>
                Cancel
              </button>
              <button type="button" className="pathfinder-action-btn primary" onClick={handleCreateCustomNode}>
                + Add to Web
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Relationship Edge */}
      {showAddEdgeModal && (
        <div className="custom-rel-modal-overlay" onClick={() => setShowAddEdgeModal(false)}>
          <div className="custom-rel-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3><i className="fas fa-link"></i> Forge Relationship Tie</h3>
            <div>
              <label>Relationship Type</label>
              <select
                value={newEdgeType}
                onChange={(e) => setNewEdgeType(e.target.value)}
                className="conspiracy-modal-input"
              >
                <option value="alliance">Alliance / Friendly Tie</option>
                <option value="family">Kinship / Bloodline / Subrace</option>
                <option value="territory">Homeland / Seat / Holding</option>
                <option value="hostile">Hostility / War / Rival</option>
              </select>
            </div>
            <div>
              <label>Label / Title</label>
              <input
                type="text"
                value={newEdgeLabel}
                onChange={(e) => setNewEdgeLabel(e.target.value)}
                placeholder="e.g. Allied Bloodline, Liege Lord, Ancient Feud..."
                className="conspiracy-modal-input"
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="pathfinder-action-btn" onClick={() => setShowAddEdgeModal(false)}>
                Cancel
              </button>
              <button type="button" className="pathfinder-action-btn primary" onClick={handleCreateCustomEdge}>
                + Forge Tie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalEntityGraph;
