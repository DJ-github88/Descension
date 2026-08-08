import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MapCanvas from './MapCanvas';
import LoreSidebar from './LoreSidebar';
import DevEditor from './DevEditor';
import CustomMapEditor from './CustomMapEditor';
import CustomZoneSidebar from './CustomZoneSidebar';
import BurnedParchmentBorder from './BurnedParchmentBorder';

// Custom player annotations components
import AnnotationToolbar from './AnnotationToolbar';
import AnnotationPopup from './AnnotationPopup';
import ShareDialog from './ShareDialog';
import AnnotationCollisionMenu from './AnnotationCollisionMenu';
import MapNotificationContainer, { notify } from './MapNotify';

// Stores & Services
import useMapAnnotationStore from '../../store/mapAnnotationStore';
import useCustomMapStore from '../../store/customMapStore';
import useAuthStore from '../../store/authStore';
import useSocialStore from '../../store/socialStore';
import subscriptionService, { isCustomMapsTier } from '../../services/subscriptionService';

// Data references
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { SUBREGIONS } from '../../data/subregions';
import { getSubregionMap, resolveBoundaryTarget, BUILTIN_SUBREGION_MAPS } from '../../data/subregionMaps';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { ZONE_DATA } from '../../data/zoneData';
import { pointInPolygon } from './RegionOverlay';
import campaignService from '../../services/campaignService';
import { preloadMapAssets } from '../../utils/mapImagePreloader';
import './WorldMapImmerse.css';

// Load cached drawn regions and pins from localStorage on initial load
const saveRegionsToCache = () => {
 try {
  localStorage.setItem('mythrill_region_polygons', JSON.stringify(REGION_POLYGONS));
  localStorage.setItem('mythrill_subregion_polygons', JSON.stringify(SUBREGIONS));
 } catch (e) {
  console.error('Failed to cache region polygons:', e);
 }
};

const saveCoordsToCache = () => {
 try {
  localStorage.setItem('mythrill_location_coordinates', JSON.stringify(LOCATION_COORDINATES));
 } catch (e) {
  console.error('Failed to cache location coordinates:', e);
 }
};

try {
 const cachedRegions = localStorage.getItem('mythrill_region_polygons');
 if (cachedRegions) {
  const parsed = JSON.parse(cachedRegions);
  Object.keys(parsed).forEach(key => {
   if (REGION_POLYGONS[key]) {
    if (parsed[key].points && parsed[key].points.length > 0) {
     REGION_POLYGONS[key].points = parsed[key].points;
    }
    if (parsed[key].labelPosition && parsed[key].labelPosition.length === 2 && parsed[key].labelPosition[0] > 0) {
     REGION_POLYGONS[key].labelPosition = parsed[key].labelPosition;
    }
   }
  });
 }
} catch (e) {
 console.warn('Could not restore cached region polygons:', e);
}

try {
 const cachedSubregions = localStorage.getItem('mythrill_subregion_polygons');
 if (cachedSubregions) {
  const parsed = JSON.parse(cachedSubregions);
  Object.keys(parsed).forEach(key => {
   if (SUBREGIONS[key]) {
    if (parsed[key].points && parsed[key].points.length > 0) {
     SUBREGIONS[key].points = parsed[key].points;
    }
    if (parsed[key].labelPosition && parsed[key].labelPosition.length === 2 && parsed[key].labelPosition[0] > 0) {
     SUBREGIONS[key].labelPosition = parsed[key].labelPosition;
    }
   }
  });
 }
} catch (e) {
 console.warn('Could not restore cached subregion polygons:', e);
}

try {
 const cachedCoords = localStorage.getItem('mythrill_location_coordinates');
 if (cachedCoords) {
  const parsed = JSON.parse(cachedCoords);
  Object.keys(LOCATION_COORDINATES).forEach(key => delete LOCATION_COORDINATES[key]);
  Object.assign(LOCATION_COORDINATES, parsed);
 }
} catch (e) {
 console.warn('Could not restore cached location coordinates:', e);
}

// Restore hand-drawn subregion polygons drawn on regional maps (regional 4096x3072 space)
try {
 Object.keys(BUILTIN_SUBREGION_MAPS).forEach(mapId => {
  const cached = localStorage.getItem(`mythrill_regional_polygons_${mapId}`);
  if (!cached) return;
  const parsed = JSON.parse(cached);
  const regEntry = BUILTIN_SUBREGION_MAPS[mapId];
  if (!regEntry || !Array.isArray(regEntry.subregions) || !Array.isArray(parsed)) return;
  parsed.forEach(cachedSub => {
   const liveSub = regEntry.subregions.find(s => s.id === cachedSub.id);
   if (liveSub && cachedSub.points && cachedSub.points.length > 0) {
    liveSub.points = cachedSub.points;
    if (cachedSub.labelPosition && cachedSub.labelPosition.length === 2) {
     liveSub.labelPosition = cachedSub.labelPosition;
    }
   }
  });
 });
} catch (e) {
 console.warn('Could not restore cached regional subregion polygons:', e);
}

// One-time cleanup for geometry that was generated before the hand-drawn
// cartography decision. Other regions remain registered as empty targets so
// the DevEditor can draw them later, but their old cached polygons must not
// appear on the immersion map.
const DRAWN_GEOMETRY_CACHE_VERSION = 'nordhalla-rime-spire-v1';
const CANONICAL_DRAWN_REGION_IDS = new Set(['nordhalla']);
const CANONICAL_DRAWN_SUBREGION_IDS = new Set(['nordhalla-glacier-heart']);

try {
 if (localStorage.getItem('mythrill_drawn_geometry_version') !== DRAWN_GEOMETRY_CACHE_VERSION) {
  Object.values(REGION_POLYGONS).forEach((region) => {
   if (!CANONICAL_DRAWN_REGION_IDS.has(region.id)) {
    region.points = [];
    region.labelPosition = [0, 0];
   }
  });

  Object.values(SUBREGIONS).forEach((subregion) => {
   if (!CANONICAL_DRAWN_SUBREGION_IDS.has(subregion.id)) {
    subregion.points = [];
    subregion.labelPosition = [0, 0];
   }
  });

  Object.values(BUILTIN_SUBREGION_MAPS).forEach((mapEntry) => {
   if (!Array.isArray(mapEntry.subregions)) return;
   mapEntry.subregions.forEach((subregion) => {
    if (!CANONICAL_DRAWN_SUBREGION_IDS.has(subregion.id)) {
     subregion.points = [];
     subregion.labelPosition = [0, 0];
    }
   });
   localStorage.setItem(`mythrill_regional_polygons_${mapEntry.id}`, JSON.stringify(mapEntry.subregions));
  });

  localStorage.setItem('mythrill_region_polygons', JSON.stringify(REGION_POLYGONS));
  localStorage.setItem('mythrill_subregion_polygons', JSON.stringify(SUBREGIONS));
  localStorage.setItem('mythrill_drawn_geometry_version', DRAWN_GEOMETRY_CACHE_VERSION);
 }
} catch (e) {
 console.warn('Could not migrate drawn geometry cache:', e);
}

const MAP_WIDTH = 4096;
const MAP_HEIGHT = 3072;

const WorldMapImmerse = ({ onClose, onClosing, initialTransform: propInitialTransform, initialMapId: propInitialMapId }) => {
 const [phase, setPhase] = useState('entering');
 const [showBorder, setShowBorder] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [selectedRegionId, setSelectedRegionId] = useState(null);
 const [selectedLocationId, setSelectedLocationId] = useState(null);
 const [hoveredRegionId, setHoveredRegionId] = useState(null);

  // Subregion Map state & transitions
  const [activeMapId, setActiveMapId] = useState('mythril');
   const [mapStack, setMapStack] = useState([{ id: 'mythril', name: 'World Map of Mythril' }]);
   const [subregionTransition, setSubregionTransition] = useState({ active: false, targetName: '' });
   const [targetZoomPoint, setTargetZoomPoint] = useState(null);
   const [tierInfo, setTierInfo] = useState(null);
   const canAccessCustomMaps = isCustomMapsTier(tierInfo?.tierKey);

  const handleEnterSubregionMap = useCallback((regionId) => {
    const targetObj = REGION_POLYGONS[regionId] || SUBREGIONS[regionId];
    const mapData = getSubregionMap(regionId);
    const subregionName = targetObj?.name || mapData?.name || regionId;

    let center = [2048, 1536];
    if (targetObj?.labelPosition && targetObj.labelPosition.length === 2 && targetObj.labelPosition[0] > 0) {
      center = targetObj.labelPosition;
    } else if (targetObj?.points && targetObj.points.length >= 3) {
      const sumX = targetObj.points.reduce((s, p) => s + p[0], 0);
      const sumY = targetObj.points.reduce((s, p) => s + p[1], 0);
      center = [Math.round(sumX / targetObj.points.length), Math.round(sumY / targetObj.points.length)];
    }

    // Smoothly accelerate & camera-zoom into subregion centroid over 800ms
    setTargetZoomPoint({ x: center[0], y: center[1], scale: 1.85, duration: 800, id: Date.now() });

    // Activate RPG Transition Overlay fog curtain
    setSubregionTransition({ active: true, targetName: subregionName });
    setSidebarOpen(false);

    // Swap map asset at 650ms while transition curtain fully covers screen
    setTimeout(() => {
      setActiveMapId(regionId);
      setMapStack(prev => [...prev, { id: regionId, name: subregionName }]);
    }, 650);

    // Clear transition curtain at 1400ms after reveal
    setTimeout(() => {
      setSubregionTransition({ active: false, targetName: '' });
      setTargetZoomPoint(null);
    }, 1400);
  }, []);

  const handleReturnToParentMap = useCallback(() => {
    if (mapStack.length <= 1) return;
    const parentObj = mapStack[mapStack.length - 2] || { id: 'mythril', name: 'World Map of Mythril' };
    setSubregionTransition({ active: true, targetName: parentObj.name });
    setSidebarOpen(false);
    setSelectedRegionId(null);
    setSelectedLocationId(null);

    setTimeout(() => {
      setActiveMapId(parentObj.id);
      setMapStack(prev => prev.slice(0, -1));
    }, 400);

    setTimeout(() => {
      setSubregionTransition({ active: false, targetName: '' });
    }, 900);
  }, [mapStack]);

  // Deep-link: open directly on a target subregion map when initialMapId is provided
  // (e.g. "View on World Map" from the account map manager)
  useEffect(() => {
     if (!propInitialMapId || propInitialMapId === 'mythril' || !tierInfo) return;

     const isBuiltInMap = Boolean(
       BUILTIN_SUBREGION_MAPS[propInitialMapId] ||
       REGION_POLYGONS[propInitialMapId] ||
       SUBREGIONS[propInitialMapId]
     );
     if (!isBuiltInMap && !canAccessCustomMaps) return;

     const mapData = getSubregionMap(propInitialMapId);
    const targetObj = REGION_POLYGONS[propInitialMapId] || SUBREGIONS[propInitialMapId];
    const mapName = targetObj?.name || mapData?.name || propInitialMapId;

    setActiveMapId(propInitialMapId);
    setMapStack(prev => [{ id: 'mythril', name: 'World Map of Mythril' }, { id: propInitialMapId, name: mapName }]);
    setSidebarOpen(false);
    setSelectedRegionId(null);
    setSelectedLocationId(null);
   }, [propInitialMapId, tierInfo, canAccessCustomMaps]);

  // Camera zoom-in when selecting a continent region or subregion on the world map
  useEffect(() => {
    if (!selectedRegionId || activeMapId !== 'mythril') return;

    const targetObj = REGION_POLYGONS[selectedRegionId] || SUBREGIONS[selectedRegionId];
    if (!targetObj) return;

    let center = [2048, 1536];
    if (targetObj.labelPosition && targetObj.labelPosition.length === 2 && targetObj.labelPosition[0] > 0) {
      center = targetObj.labelPosition;
    } else if (targetObj.points && targetObj.points.length >= 3) {
      const sumX = targetObj.points.reduce((s, p) => s + p[0], 0);
      const sumY = targetObj.points.reduce((s, p) => s + p[1], 0);
      center = [Math.round(sumX / targetObj.points.length), Math.round(sumY / targetObj.points.length)];
    }

    const isSub = !!SUBREGIONS[selectedRegionId];
    const targetScale = isSub ? 1.35 : 0.85;

    setTargetZoomPoint({ x: center[0], y: center[1], scale: targetScale, duration: 850, id: Date.now() });
  }, [selectedRegionId, activeMapId]);

  const [updateTrigger, setUpdateTrigger] = useState(0);

 // Dev mode and editor state
 const [devMode, setDevMode] = useState(false);
 const [devTool, setDevTool] = useState('drawRegion');
 const [currentRegion, setCurrentRegion] = useState('');
 const [drawingPoints, setDrawingPoints] = useState([]);
 const [selectedPinType, setSelectedPinType] = useState('fortress');
 const [selectedZoneId, setSelectedZoneId] = useState('');
 const [cursorPos, setCursorPos] = useState(null);
  const [selectedDevPinId, setSelectedDevPinId] = useState(null);

  // Account-backed custom map workspace state
  const [customMapMode, setCustomMapMode] = useState(false);
   const [customDrawingActive, setCustomDrawingActive] = useState(false);
   const [customDrawingPoints, setCustomDrawingPoints] = useState([]);
   const [customZoneName, setCustomZoneName] = useState('');
   const [customEntryType, setCustomEntryType] = useState('continent');
   const [customParentId, setCustomParentId] = useState('');
   const [customLore, setCustomLore] = useState('');

 // Campaign & custom pin connection state
 const [currentCampaign, setCurrentCampaign] = useState(null);
 const [pinSourceType, setPinSourceType] = useState('world');
 const [selectedCampaignLocId, setSelectedCampaignLocId] = useState('');
 const [selectedCampaignLoreId, setSelectedCampaignLoreId] = useState('');
 const [customPinName, setCustomPinName] = useState('');
 const [customPinDesc, setCustomPinDesc] = useState('');

 // Custom confirm dialog state
 const [customConfirm, setCustomConfirm] = useState({
  isOpen: false,
  message: '',
  onConfirm: null,
  onCancel: null
 });

 // Dev toast state: shows a quick-copy notification after drawing/placing
 const [devToast, setDevToast] = useState(null);

 const showConfirm = (message, onConfirm) => {
  setCustomConfirm({
   isOpen: true,
   message,
   onConfirm: () => {
    onConfirm();
    setCustomConfirm(prev => ({ ...prev, isOpen: false }));
   },
   onCancel: () => {
    setCustomConfirm(prev => ({ ...prev, isOpen: false }));
   }
  });
 };

  useEffect(() => {
    preloadMapAssets();
    const preventDefaultContextMenu = (e) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', preventDefaultContextMenu, { capture: true });
    return () => {
      window.removeEventListener('contextmenu', preventDefaultContextMenu, { capture: true });
    };
  }, []);

 const [transformState, setTransformState] = useState({ scale: 0.4, positionX: 0, positionY: 0 });

 // === Player Annotations State ===
 const { user } = useAuthStore();
 const friends = useSocialStore((state) => state.friends) || [];
 
 const {
  pins,
  areas,
  shares,
  syncAnnotations,
  cleanupSubscriptions,
  addPin,
  updatePin,
  deletePin,
  addArea,
  updateArea,
  deleteArea,
  shareView,
  updateShareStatus,
  deleteShare
  } = useMapAnnotationStore();

  const {
   maps: customMaps,
   currentMapId: currentCustomMapId,
   draftZones: customDraftZones,
   selectedZoneId: selectedCustomZoneId,
   setSelectedZoneId: setSelectedCustomZoneId,
   isLoading: customMapsLoading,
   syncMaps: syncCustomMaps,
   cleanup: cleanupCustomMaps,
   createNewMap: createCustomMap,
   selectMap: selectCustomMap,
   setMapImage: setCustomMapImage,
   addDraftZone: addCustomDraftZone,
   updateDraftZone: updateCustomDraftZone,
   removeDraftZone: removeCustomDraftZone,
   renameMap: renameCustomMap,
   saveCurrentMap: saveCurrentCustomMap,
   deleteMap: deleteCustomMap,
   compressImageFile
  } = useCustomMapStore();
  const currentCustomMap = customMaps.find((map) => map.id === currentCustomMapId) || null;
  const selectedCustomZone = useMemo(() => {
    if (!selectedCustomZoneId) return null;
    return (customDraftZones || []).find((z) => z.id === selectedCustomZoneId) || null;
  }, [customDraftZones, selectedCustomZoneId]);

  const [activeTool, setActiveTool] = useState('none'); // 'none' | 'placePin' | 'drawArea'
  const [playerDrawingPoints, setPlayerDrawingPoints] = useState([]);
  const [playerPinIconType, setPlayerPinIconType] = useState('custom');

  // Popup / Dialog controls
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [showAnnotationPopup, setShowAnnotationPopup] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [activeShare, setActiveShare] = useState(null);

  // Overlap selection carousel controls
  const [collisionItems, setCollisionItems] = useState([]);
  const [collisionPosition, setCollisionPosition] = useState(null);
  const [showCollisionMenu, setShowCollisionMenu] = useState(false);

  // Load active campaign data
 useEffect(() => {
  const campaign = campaignService.getCurrentCampaign();
  setCurrentCampaign(campaign);
 }, []);

  // Load subscription status for both authenticated users and logged-out guests.
  useEffect(() => {
   let isMounted = true;
   const loadTier = async () => {
    const tier = await subscriptionService.getSubscriptionStatus(user?.uid || null);
    if (isMounted) setTierInfo(tier);
   };
   loadTier();
   return () => {
    isMounted = false;
   };
  }, [user?.uid]);

  // Sync annotations on user load.
  useEffect(() => {
   if (user?.uid) syncAnnotations(user.uid);
   return () => cleanupSubscriptions();
  }, [user?.uid, syncAnnotations, cleanupSubscriptions]);

  useEffect(() => {
   syncCustomMaps(canAccessCustomMaps ? user?.uid || null : null, canAccessCustomMaps);
   return () => cleanupCustomMaps();
  }, [user?.uid, canAccessCustomMaps, syncCustomMaps, cleanupCustomMaps]);

  useEffect(() => {
   if (canAccessCustomMaps || !customMapMode) return;
   setCustomMapMode(false);
   setCustomDrawingActive(false);
   setCustomDrawingPoints([]);
  }, [canAccessCustomMaps, customMapMode]);

  const denyCustomMapAccess = useCallback(() => {
   notify(
    user?.uid && !user?.isGuest
     ? 'Custom Maps require the Archmage (Ultimate) tier.'
     : 'Sign in with an Archmage (Ultimate) account to use Custom Maps.',
    'warning'
   );
   return false;
  }, [user?.uid, user?.isGuest]);

  // Calculate or use passed initial transform so the map enters at the exact scrolled location.
  const [initialTransform] = useState(() => {
    if (propInitialTransform && isFinite(propInitialTransform.scale)) {
      return propInitialTransform;
    }
    if (typeof window === 'undefined') return { scale: 0.4, posX: 0, posY: 0 };
    const W = window.innerWidth;
    const H = window.innerHeight;
    const fitScale = Math.max(W / 4096, H / 3072);
    const fitX = (W - 4096 * fitScale) / 2;
    const fitY = (H - 3072 * fitScale) / 2;
    return { scale: fitScale, posX: fitX, posY: fitY };
  });

  // Seamless entrance into interactive map mode:
  // Visible immediately at initialTransform with smooth border & control reel-in
  useEffect(() => {
    const t1 = setTimeout(() => {
      setShowBorder(true);
    }, 120);
    const t2 = setTimeout(() => {
      setPhase('immersed');
    }, 380);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Smoothly glide camera from landing dive position to centered world map overview over 1.4s
  useEffect(() => {
    if (propInitialTransform && propInitialTransform.scale) {
      const timer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          const W = window.innerWidth;
          const H = window.innerHeight;
          const fitScale = Math.max(W / 4096, H / 3072);
          setTargetZoomPoint({
            x: 2048,
            y: 1536,
            scale: Math.max(fitScale, 0.45),
            duration: 1400,
            id: Date.now()
          });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [propInitialTransform]);

  const handleClose = useCallback(() => {
    if (onClosing) onClosing();
    setShowBorder(false);
    setSidebarOpen(false);
    setPhase('zoomingIn');

    setTimeout(() => {
      setPhase('complete');
      onClose();
    }, 550);
  }, [onClose, onClosing]);

  const getImageCoords = (e, transformRef) => {
    try {
      const el = e.currentTarget || document.querySelector('.map-overlay-svg');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const x = (e.clientX - rect.left) * (MAP_WIDTH / rect.width);
      const y = (e.clientY - rect.top) * (MAP_HEIGHT / rect.height);

      if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) return null;
      return [Math.round(x), Math.round(y)];
    } catch (err) {
      return null;
    }
  };

  const handleToggleCustomMap = useCallback(() => {
   if (!canAccessCustomMaps) {
    denyCustomMapAccess();
    return;
   }
   setCustomMapMode((isActive) => {
    const next = !isActive;
    setCustomDrawingActive(false);
    setCustomDrawingPoints([]);
    setCursorPos(null);
    if (next) {
     setDevMode(false);
     setActiveTool('none');
     setSidebarOpen(false);
     setSelectedRegionId(null);
     setSelectedLocationId(null);
     setSelectedCustomZoneId(null);
    }
    return next;
   });
  }, [canAccessCustomMaps, denyCustomMapAccess, setSelectedCustomZoneId]);

  const handleSelectCustomZone = useCallback((zone) => {
    if (!zone) {
      setSelectedCustomZoneId(null);
      return;
    }
    setSelectedCustomZoneId(zone.id);
    setSelectedRegionId(null);
    setSelectedLocationId(null);
    setSidebarOpen(false);
  }, [setSelectedCustomZoneId]);

  const handleFocusCustomZone = useCallback((zone) => {
    if (!zone) return;
    if (zone.kind === 'location' || zone.geometry === 'point') {
      const [x, y] = zone.position || zone.points?.[0] || [];
      if (Number.isFinite(x) && Number.isFinite(y)) {
        setTargetZoomPoint({ x, y, scale: 1.85, duration: 600 });
      }
      return;
    }
    if (zone.points && zone.points.length > 0) {
      const minX = Math.min(...zone.points.map((p) => p[0]));
      const maxX = Math.max(...zone.points.map((p) => p[0]));
      const minY = Math.min(...zone.points.map((p) => p[1]));
      const maxY = Math.max(...zone.points.map((p) => p[1]));
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const w = Math.max(120, maxX - minX);
      const h = Math.max(120, maxY - minY);
      const fitScale = Math.max(0.4, Math.min(2.4, Math.min(window.innerWidth / (w + 240), window.innerHeight / (h + 240))));
      setTargetZoomPoint({ x: cx, y: cy, scale: fitScale, duration: 650 });
    }
  }, []);

  const handleAddLocationToRegion = useCallback((regionId) => {
    if (!canAccessCustomMaps) return denyCustomMapAccess();
    setCustomEntryType('location');
    setCustomParentId(regionId || '');
    const parentZone = customDraftZones.find((z) => z.id === regionId);
    if (parentZone) {
      handleFocusCustomZone(parentZone);
    }
    setCustomDrawingActive(true);
    setCursorPos(null);
    notify(`Placing location in "${parentZone?.name || 'Region'}". Click anywhere on the map to place the marker.`, 'info');
  }, [canAccessCustomMaps, customDraftZones, denyCustomMapAccess, handleFocusCustomZone]);

  const handleUndoCustomPoint = useCallback(() => {
    setCustomDrawingPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleCreateCustomMap = useCallback((name) => {
   if (!canAccessCustomMaps) return denyCustomMapAccess();
   createCustomMap(name || 'Untitled Map', canAccessCustomMaps);
   setCustomDrawingActive(false);
   setCustomDrawingPoints([]);
   setCustomZoneName('');
  }, [canAccessCustomMaps, createCustomMap, denyCustomMapAccess]);

  const handleSelectCustomMap = useCallback((mapId) => {
   if (!canAccessCustomMaps) return denyCustomMapAccess();
   selectCustomMap(mapId);
   setCustomDrawingActive(false);
   setCustomDrawingPoints([]);
   setCursorPos(null);
  }, [canAccessCustomMaps, denyCustomMapAccess, selectCustomMap]);

  const handleCustomImageFile = useCallback(async (file) => {
    if (!canAccessCustomMaps) {
     denyCustomMapAccess();
     return;
    }
    if (!currentCustomMap) {
    notify('Create a custom map before adding an image.', 'warning');
    return;
   }
   try {
    const compressed = await compressImageFile(file);
    setCustomMapImage(compressed.dataUrl, compressed.width, compressed.height);
    notify('Map image loaded. Save the workspace to sync it to your account.', 'success');
   } catch (error) {
    console.error('Failed to load custom map image:', error);
    notify('That image could not be loaded. Try a PNG, JPG, or WEBP file.', 'error');
   }
  }, [canAccessCustomMaps, currentCustomMap, compressImageFile, denyCustomMapAccess, setCustomMapImage]);

  const handleCompleteCustomZone = useCallback((points = customDrawingPoints) => {
    if (!canAccessCustomMaps) return denyCustomMapAccess();
    if (!currentCustomMap) {
    notify('Create a custom map before drawing zones.', 'warning');
    return false;
   }
   if (!points || points.length < 3) {
    notify('A zone needs at least three points.', 'warning');
    return false;
   }

   const zoneNumber = customDraftZones.length + 1;
    const entryLabels = {
     continent: 'Continent',
     region: 'Region',
     subregion: 'Subregion',
     location: 'Location'
    };
    addCustomDraftZone({
     id: `custom-zone-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
     name: customZoneName.trim() || `${entryLabels[customEntryType] || 'Region'} ${zoneNumber}`,
     points: [...points],
     kind: customEntryType,
     geometry: 'polygon',
     parentId: customParentId || null,
     lore: customLore.trim(),
     color: customEntryType === 'continent'
      ? 'rgba(135, 104, 196, 0.24)'
      : customEntryType === 'subregion'
       ? 'rgba(83, 151, 190, 0.24)'
       : 'rgba(196, 164, 74, 0.24)',
     stroke: '#f1d48a',
     createdAt: new Date().toISOString()
    });
   setCustomDrawingPoints([]);
    setCustomDrawingActive(false);
    setCustomZoneName('');
    setCustomParentId('');
    setCustomLore('');
    setCursorPos(null);
    notify(`${entryLabels[customEntryType] || 'Region'} added to the draft. Save the map to persist it.`, 'success');
    return true;
   }, [canAccessCustomMaps, currentCustomMap, customDrawingPoints, customDraftZones.length, customZoneName, customEntryType, customParentId, customLore, addCustomDraftZone, denyCustomMapAccess]);

  const [customLocationCategory, setCustomLocationCategory] = useState('settlement');

  const handleCompleteCustomLocation = useCallback((position, category = null) => {
    if (!canAccessCustomMaps) return denyCustomMapAccess();
    if (!currentCustomMap) {
      notify('Create a custom map before placing locations.', 'warning');
      return false;
    }
    const targetCategory = category || customLocationCategory || 'settlement';
    const locationNumber = customDraftZones.filter((entry) => entry.kind === 'location').length + 1;
    addCustomDraftZone({
      id: `custom-location-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: customZoneName.trim() || `Location ${locationNumber}`,
      points: [],
      position: [...position],
      kind: 'location',
      geometry: 'point',
      category: targetCategory,
      parentId: customParentId || null,
      lore: customLore.trim(),
      color: '#f1d48a',
      stroke: '#20150d',
      createdAt: new Date().toISOString()
    });
    setCustomDrawingActive(false);
    setCustomZoneName('');
    setCustomParentId('');
    setCustomLore('');
    setCursorPos(null);
    notify('Location placed with category icon to draft. Save map to persist.', 'success');
    return true;
  }, [canAccessCustomMaps, currentCustomMap, customLocationCategory, customDraftZones, customZoneName, customParentId, customLore, addCustomDraftZone, denyCustomMapAccess]);

  const handleStartCustomDrawing = useCallback((category = null) => {
    if (!canAccessCustomMaps) return denyCustomMapAccess();
    if (!currentCustomMap) {
      notify('Create a custom map before adding world entries.', 'warning');
      return;
    }
    if (category) {
      setCustomLocationCategory(category);
    }
    setDevMode(false);
    setActiveTool('none');
    setCustomDrawingPoints([]);
    setCursorPos(null);
    setCustomDrawingActive(true);
  }, [canAccessCustomMaps, currentCustomMap, denyCustomMapAccess]);

  const handleCancelCustomDrawing = useCallback(() => {
    setCustomDrawingActive(false);
    setCustomDrawingPoints([]);
    setCursorPos(null);
  }, []);

  const handleSaveCustomMap = useCallback(async () => {
    if (!canAccessCustomMaps) {
     denyCustomMapAccess();
     return;
    }
    if (!currentCustomMap) {
    notify('Create a custom map before saving.', 'warning');
    return;
   }
   if (!user?.uid) {
    notify('Sign in to save custom maps to your account.', 'warning');
    return;
   }
    const result = await saveCurrentCustomMap(user.uid, canAccessCustomMaps);
   if (result.success) {
    notify('Custom map saved to your account.', 'success');
   } else {
    notify(result.error || 'Custom map could not be saved.', 'error');
   }
   }, [canAccessCustomMaps, currentCustomMap, denyCustomMapAccess, user?.uid, saveCurrentCustomMap]);

   const handleDeleteCustomMap = useCallback(async (mapId, mapName) => {
    if (!canAccessCustomMaps) {
     denyCustomMapAccess();
     return;
    }
    if (!user?.uid) {
    notify('Sign in to manage saved custom maps.', 'warning');
    return;
   }
   if (typeof window !== 'undefined' && !window.confirm(`Delete custom map "${mapName}"?`)) return;
    const result = await deleteCustomMap(user.uid, mapId, canAccessCustomMaps);
    if (!result.success) notify(result.error || 'Custom map could not be deleted.', 'error');
   }, [canAccessCustomMaps, deleteCustomMap, denyCustomMapAccess, user?.uid]);

   const handleClearCustomMapImage = useCallback(() => {
    if (!canAccessCustomMaps) {
     denyCustomMapAccess();
     return;
    }
    if (!currentCustomMap) return;
   setCustomMapImage(null, currentCustomMap.width || MAP_WIDTH, currentCustomMap.height || MAP_HEIGHT);
   }, [canAccessCustomMaps, currentCustomMap, denyCustomMapAccess, setCustomMapImage]);

  // ── Dev Toast: per-item quick-copy ──
 const showDevToast = useCallback((type, item) => {
  setDevToast({ type, item, id: Date.now(), copied: null });
 }, []);

 const dismissDevToast = useCallback(() => setDevToast(null), []);

 const copyDevItem = useCallback((format) => {
  if (!devToast) return;
  let text = '';

  if (devToast.type === 'region') {
   const r = devToast.item;
   if (format === 'js') {
    text = `'${r.id}': {
 id: '${r.id}',
 name: '${r.name}',
 points: [${r.points.map(p => `[${p[0]}, ${p[1]}]`).join(', ')}],
 color: '${r.color}',
 glowColor: '${r.glowColor}',
 labelPosition: [${r.labelPosition[0]}, ${r.labelPosition[1]}]
}`;
   } else {
    text = `Update the file src/data/regionPolygons.js: replace the '${r.id}' entry with these values (I just drew the boundary in the map editor):\n\n'${r.id}': {\n points: [${r.points.map(p => `[${p[0]}, ${p[1]}]`).join(', ')}],\n labelPosition: [${r.labelPosition[0]}, ${r.labelPosition[1]}]\n}`;
   }
  } else if (devToast.type === 'pin') {
   const { key, data } = devToast.item;
   const dataStr = JSON.stringify(data, null, 2);
   if (format === 'js') {
    text = `'${key}': ${dataStr}`;
   } else {
    text = `Add this entry to the file src/data/locationCoordinates.js:\n\n'${key}': ${dataStr}`;
   }
  }

  navigator.clipboard.writeText(text);
  setDevToast(prev => prev ? { ...prev, copied: format } : null);
  setTimeout(() => setDevToast(prev => prev ? { ...prev, copied: null } : null), 2000);
 }, [devToast]);

 // Click handler on the map canvas
 const handleMapClick = useCallback((e, transformRef) => {
   const coords = getImageCoords(e, transformRef);
   if (!coords) return;

    // Custom-map zone drawing is deliberately separate from canonical regions
    // and player annotation areas.
    if (customMapMode) {
     if (!canAccessCustomMaps) {
      denyCustomMapAccess();
      return;
     }
     if (!currentCustomMap) {
      notify('Create a custom map in the workspace panel first.', 'warning');
      return;
     }
     if (!customDrawingActive) return;
     if (customEntryType === 'location') {
      handleCompleteCustomLocation(coords);
      return;
     }
     if (customDrawingPoints.length === 0) {
     setCustomDrawingPoints([coords]);
    } else {
     const first = customDrawingPoints[0];
     const dist = Math.hypot(coords[0] - first[0], coords[1] - first[1]);
     if (dist < 30 && customDrawingPoints.length >= 3) {
      handleCompleteCustomZone(customDrawingPoints);
     } else {
      setCustomDrawingPoints([...customDrawingPoints, coords]);
     }
    }
    return;
   }

   // Dev drawing/pin logic
  if (devMode) {
   if (devTool === 'movePin') {
    // Clicking empty map space in Move mode deselects the current pin.
    setSelectedDevPinId(null);
    return;
   }
   if (devTool === 'drawRegion') {
    if (!currentRegion) {
     notify('Please select a Region in the dropdown toolbar first to start drawing boundaries.', 'warning');
     return;
    }
    if (drawingPoints.length === 0) {
     setDrawingPoints([coords]);
    } else {
     const first = drawingPoints[0];
     const dist = Math.hypot(coords[0] - first[0], coords[1] - first[1]);
     if (dist < 30 && drawingPoints.length >= 3) {
      const { target: existing } = resolveBoundaryTarget(currentRegion, activeMapId);
      if (!existing) {
       console.warn(`Target region or subregion "${currentRegion}" not found.`);
       return;
      }
      showConfirm(
       `Are you sure you want to complete and save the boundaries for "${existing.name || currentRegion}"?`,
       () => {
        const cx = drawingPoints.reduce((s, p) => s + p[0], 0) / drawingPoints.length;
        const cy = drawingPoints.reduce((s, p) => s + p[1], 0) / drawingPoints.length;
        existing.points = [...drawingPoints];
        existing.labelPosition = [Math.round(cx), Math.round(cy)];
        setDrawingPoints([]);
        saveRegionsToCache();
        if (activeMapId && activeMapId !== 'mythril') {
         const regionalKey = `mythrill_regional_polygons_${activeMapId}`;
         try {
          localStorage.setItem(regionalKey, JSON.stringify(BUILTIN_SUBREGION_MAPS?.[activeMapId]?.subregions || []));
         } catch (e) { console.warn('Failed to cache regional subregion polygons:', e); }
        }
        setUpdateTrigger(prev => prev + 1);
        showDevToast('region', {
         id: existing.id || currentRegion,
         name: existing.name || currentRegion,
         points: [...existing.points],
         color: existing.color || 'rgba(70, 150, 220, 0.18)',
         glowColor: existing.glowColor || 'rgba(120, 200, 255, 0.75)',
         labelPosition: [...existing.labelPosition]
        });
       }
      );
     } else {
      setDrawingPoints([...drawingPoints, coords]);
     }
    }
   }

   if (devTool === 'placePin') {
    let pinKey = '';
    const pinData = {
     x: coords[0],
     y: coords[1],
     pinType: selectedPinType,
     regionId: currentRegion || selectedRegionId || '',
     mapId: activeMapId || 'mythril'
    };

    if (pinSourceType === 'world') {
     if (!selectedZoneId) {
      notify('Please select a Zone in the toolbar first to associate the pin with.', 'warning');
      return;
     }
     pinKey = selectedZoneId;
     pinData.source = 'world';
    } else if (pinSourceType === 'campaignLocation') {
     if (!selectedCampaignLocId) {
      notify('Please select a Campaign Location in the toolbar first.', 'warning');
      return;
     }
     pinKey = `campaign-loc-${selectedCampaignLocId}`;
     pinData.source = 'campaignLocation';
     pinData.sourceId = selectedCampaignLocId;
    } else if (pinSourceType === 'campaignLore') {
     if (!selectedCampaignLoreId) {
      notify('Please select a Campaign Lore article in the toolbar first.', 'warning');
      return;
     }
     pinKey = `campaign-lore-${selectedCampaignLoreId}`;
     pinData.source = 'campaignLore';
     pinData.sourceId = selectedCampaignLoreId;
    } else if (pinSourceType === 'custom') {
     if (!customPinName.trim()) {
      notify('Please enter a Name for your custom pin.', 'warning');
      return;
     }
     pinKey = `custom-${Date.now()}`;
     pinData.source = 'custom';
     pinData.name = customPinName;
     pinData.description = customPinDesc;
    }

    LOCATION_COORDINATES[pinKey] = pinData;
    saveCoordsToCache();
    setSelectedDevPinId(pinKey);
    setUpdateTrigger(prev => prev + 1);
    showDevToast('pin', { key: pinKey, data: { ...pinData } });
   }
   return;
  }

  // Player Place Pin Logic
  if (activeTool === 'placePin') {
   if (!user?.uid) return;
   
   const pinLimit = tierInfo?.tier?.characterLimit === -1 ? 9999 : 10;
   if (pins.length >= pinLimit) {
    notify(`Marker limit reached. Your Free Adventurer tier allows a maximum of ${pinLimit} custom markers.`, 'error');
    setActiveTool('none');
    return;
   }

   addPin(user.uid, {
    x: coords[0],
    y: coords[1],
    pinType: playerPinIconType,
    title: 'New Marker',
    description: 'Placed by explorer'
   });
   setActiveTool('none');
   return;
  }

  // Player Draw Area Logic
  if (activeTool === 'drawArea') {
   if (!user?.uid) return;

   if (playerDrawingPoints.length === 0) {
    setPlayerDrawingPoints([coords]);
   } else {
    const first = playerDrawingPoints[0];
    const dist = Math.hypot(coords[0] - first[0], coords[1] - first[1]);

    if (dist < 30 && playerDrawingPoints.length >= 3) {
     // Closed area - Save Area Polygon
     addArea(user.uid, {
      points: playerDrawingPoints,
      title: 'New Territory',
      color: 'rgba(196, 164, 74, 0.25)',
      status: 'discovered'
     });
     setPlayerDrawingPoints([]);
     setActiveTool('none');
    } else {
     setPlayerDrawingPoints([...playerDrawingPoints, coords]);
    }
   }
   return;
  }
  
  // Default click outside closes sidebars
  setSidebarOpen(false);
  setSelectedRegionId(null);
  setSelectedLocationId(null);
   }, [customMapMode, canAccessCustomMaps, denyCustomMapAccess, currentCustomMap, customDrawingActive, customDrawingPoints, customEntryType, handleCompleteCustomLocation, handleCompleteCustomZone, devMode, devTool, currentRegion, selectedRegionId, drawingPoints, selectedPinType, selectedZoneId, activeMapId, activeTool, playerDrawingPoints, playerPinIconType, user, pins.length, tierInfo, addPin, addArea, pinSourceType, selectedCampaignLocId, selectedCampaignLoreId, customPinName, customPinDesc, showConfirm, showDevToast]);

 const handleMapMouseMove = useCallback((e, transformRef) => {
  const coords = getImageCoords(e, transformRef);
  if (!coords) return;

    if (customMapMode && customDrawingActive && (customDrawingPoints.length > 0 || customEntryType === 'location')) {
     setCursorPos(coords);
   } else if (devMode && devTool === 'drawRegion' && drawingPoints.length > 0) {
    setCursorPos(coords);
   } else if (activeTool === 'drawArea' && playerDrawingPoints.length > 0) {
    setCursorPos(coords);
   }
   }, [customMapMode, customDrawingActive, customDrawingPoints, customEntryType, devMode, devTool, drawingPoints, activeTool, playerDrawingPoints]);

 const handleTransformChange = useCallback((state) => {
  setTransformState(state || { scale: 0.4, positionX: 0, positionY: 0 });
 }, []);

 const handleSidebarClose = useCallback(() => {
  setSidebarOpen(false);
  setSelectedRegionId(null);
  setSelectedLocationId(null);
 }, []);

 // ── Dev Move tool: arrow-key nudging of the selected pin ──
 useEffect(() => {
  if (!devMode || devTool !== 'movePin' || !selectedDevPinId) return;

  const handleKeyDown = (e) => {
   const key = e.key;
   if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) return;
   // Don't hijack arrows while editing a text/number input.
   const tag = ((document.activeElement && document.activeElement.tagName) || '').toLowerCase();
   if (tag === 'input' || tag === 'textarea') return;

   e.preventDefault();
   const step = e.shiftKey ? 10 : 1;
   const coord = LOCATION_COORDINATES[selectedDevPinId];
   if (!coord) return;

   if (key === 'ArrowUp')  coord.y = Math.max(0, coord.y - step);
   if (key === 'ArrowDown') coord.y = Math.min(MAP_HEIGHT, coord.y + step);
   if (key === 'ArrowLeft') coord.x = Math.max(0, coord.x - step);
   if (key === 'ArrowRight') coord.x = Math.min(MAP_WIDTH, coord.x + step);

   saveCoordsToCache();
   setUpdateTrigger((prev) => prev + 1);
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
 }, [devMode, devTool, selectedDevPinId]);

 // Clear dev selection when leaving dev mode or the move tool.
 useEffect(() => {
  if (!devMode || devTool !== 'movePin') {
   setSelectedDevPinId(null);
  }
 }, [devMode, devTool]);

 // === Overlap Click Resolution logic ===
 const handleResolveClick = useCallback((x, y, fallbackItem) => {
  const hits = [];

  // 1. Proximity check on Dev Pins
  if (devMode) {
   Object.entries(LOCATION_COORDINATES).forEach(([zoneId, coord]) => {
    const distance = Math.hypot(coord.x - x, coord.y - y);
    if (distance < 45) {
     const zone = ZONE_DATA.find(z => z.id === zoneId);
     if (zone) {
      hits.push({
       id: zoneId,
       title: zone.name,
       type: 'devPin',
       pinType: coord.pinType,
       regionId: zone.regionId,
       action: () => {
        setSelectedRegionId(zone.regionId);
        setSelectedLocationId(zoneId);
        setSidebarOpen(true);
       }
      });
     }
    }
   });
  }

  // 2. Proximity check on Player Pins
  pins.forEach((pin) => {
   const distance = Math.hypot(pin.x - x, pin.y - y);
   if (distance < 45) {
    hits.push({
     id: pin.id,
     title: pin.title,
     type: 'playerPin',
     pinType: pin.pinType,
     regionId: pin.regionId,
     action: () => {
      setSelectedAnnotation(pin);
      setShowAnnotationPopup(true);
     }
    });
   }
  });

  // 3. Containment check on Player Areas
  areas.forEach((area) => {
   if (pointInPolygon(x, y, area.points)) {
    hits.push({
     id: area.id,
     title: area.title,
     type: 'playerArea',
     action: () => {
      setSelectedAnnotation(area);
      setShowAnnotationPopup(true);
     }
    });
   }
  });

  // 4. Containment check on Region Polygons
  if (devMode) {
   Object.values(REGION_POLYGONS).forEach((region) => {
    if (pointInPolygon(x, y, region.points)) {
     hits.push({
      id: region.id,
      title: region.name,
      type: 'region',
      regionId: region.id,
      action: () => {
       setSelectedRegionId(region.id);
       setSelectedLocationId(null);
       setSidebarOpen(true);
      }
     });
    }
   });
  }

  // Resolve selection
  if (hits.length > 1) {
   // Open selection carousel
   // Convert image coordinates back to screen coordinates
   const scale = transformState.scale || 0.4;
   const posX = transformState.positionX || 0;
   const posY = transformState.positionY || 0;
   const screenX = x * scale + posX;
   const screenY = y * scale + posY;

   setCollisionItems(hits);
   setCollisionPosition({ x: screenX, y: screenY });
   setShowCollisionMenu(true);
  } else {
   // Just run the default fallback click action
   fallbackItem.action();
  }
 }, [pins, areas, transformState, devMode]);


 // Player drag updates coordinates in store
 const handleDragPlayerPin = useCallback((pinId, x, y) => {
  if (user?.uid) {
   updatePin(user.uid, pinId, { x, y });
  }
 }, [user, updatePin]);

 const handleDeletePlayerPin = useCallback((pinId) => {
  if (user?.uid) {
   deletePin(user.uid, pinId);
  }
 }, [user, deletePin]);

 const handleSaveAnnotation = useCallback((id, updatedData) => {
  if (!user?.uid) return;
  const isArea = areas.some(a => a.id === id);
  if (isArea) {
   updateArea(user.uid, id, updatedData);
  } else {
   updatePin(user.uid, id, updatedData);
  }
 }, [user, areas, updatePin, updateArea]);

 const handleDeleteAnnotation = useCallback((id) => {
  if (!user?.uid) return;
  const isArea = areas.some(a => a.id === id);
  if (isArea) {
   deleteArea(user.uid, id);
  } else {
   deletePin(user.uid, id);
  }
 }, [user, areas, deletePin, deleteArea]);

 // Friend Map Sharing handler
 const handleShareView = useCallback(async (friend, noteMessage) => {
  if (!user?.uid) return;
  // Calculate current viewport center in map image coordinates
  const W = window.innerWidth;
  const H = window.innerHeight;
  const scale = transformState.scale || 0.4;
  const posX = transformState.positionX || 0;
  const posY = transformState.positionY || 0;

  const centerX = Math.round((W / 2 - posX) / scale);
  const centerY = Math.round((H / 2 - posY) / scale);

  const viewState = {
   centerX,
   centerY,
   zoom: scale
  };

  const fromUserName = user.displayName || 'Friend';
  await shareView(user.uid, friend, viewState, `${fromUserName}: ${noteMessage}`);
 }, [user, transformState, shareView]);

  const handleAcceptShare = (share) => {
   setActiveShare(share);
   updateShareStatus(user.uid, share.id, 'accepted');
   setShowInbox(false);
  };

  const handleDeclineShare = (shareId) => {
   deleteShare(user.uid, shareId);
  };

  if (phase === 'complete') return null;

  const canDragPlayerPins = tierInfo ? tierInfo.tierKey !== 'FREE' : false;

  return (
   <div className={`world-map-immersive phase-${phase} ${sidebarOpen ? 'sidebar-open' : ''}`}>
    <BurnedParchmentBorder visible={showBorder} />

    {/* Subregion Breadcrumb Bar */}
    {activeMapId !== 'mythril' && (
     <div className="subregion-breadcrumb-bar animate-fade-in-down">
      <button className="btn-back-main-map" onClick={handleReturnToParentMap}>
       <i className="fas fa-arrow-left"></i> Return to World Map
      </button>
      <div className="breadcrumb-trail">
       <span className="breadcrumb-item clickable" onClick={handleReturnToParentMap}>World Map</span>
       <i className="fas fa-chevron-right breadcrumb-separator"></i>
       <span className="breadcrumb-item active">{mapStack[mapStack.length - 1]?.name || 'Subregion Map'}</span>
      </div>
     </div>
    )}

    {/* Atmospheric Subregion Transition Overlay */}
    {subregionTransition.active && (
     <div className="subregion-transition-overlay">
      <div className="subregion-transition-card">
       <i className="fas fa-compass transition-compass"></i>
       <span className="transition-subtitle">Entering Realm</span>
       <h3 className="transition-target-title">{subregionTransition.targetName}</h3>
       <div className="transition-glow-line"></div>
      </div>
     </div>
    )}

    <MapCanvas
      phase={phase}
      initialTransform={initialTransform}
      activeMapId={activeMapId}
      targetZoomPoint={targetZoomPoint}
      onEnterSubregionMap={handleEnterSubregionMap}
      devMode={devMode}
      devTool={devTool}
      currentRegion={currentRegion}
      drawingPoints={drawingPoints}
      selectedPinType={selectedPinType}
      setDrawingPoints={setDrawingPoints}
      onMapClick={handleMapClick}
      onMapMouseMove={handleMapMouseMove}
      selectedRegionId={selectedRegionId}
      setSelectedRegionId={setSelectedRegionId}
      selectedLocationId={selectedLocationId}
      setSelectedLocationId={setSelectedLocationId}
      setSidebarOpen={setSidebarOpen}
      hoveredRegionId={hoveredRegionId}
      setHoveredRegionId={setHoveredRegionId}
      onTransformChange={handleTransformChange}
      cursorPos={cursorPos}
      setCursorPos={setCursorPos}
      onClose={handleClose}
      onToggleDev={() => setDevMode(!devMode)}
      customMapMode={customMapMode && canAccessCustomMaps}
      customMap={currentCustomMap}
      customZones={customDraftZones}
      customEntryType={customEntryType}
      customDrawingActive={customDrawingActive}
      customDrawingPoints={customDrawingPoints}
      onCustomImageFile={handleCustomImageFile}
      onToggleCustomMap={handleToggleCustomMap}
      canAccessCustomMaps={canAccessCustomMaps}
      selectedCustomZoneId={selectedCustomZoneId}
      onSelectCustomZone={handleSelectCustomZone}
      onUndoCustomPoint={handleUndoCustomPoint}
      onFinishCustomDrawing={() => handleCompleteCustomZone()}
      onCancelCustomDrawing={handleCancelCustomDrawing}
      customZoneName={customZoneName}
    updateTrigger={updateTrigger}
    onUpdate={() => {
     saveRegionsToCache();
     saveCoordsToCache();
     setUpdateTrigger(prev => prev + 1);
    }}
    currentCampaign={currentCampaign}
    showConfirm={showConfirm}
    
    // Player annotations props
    activeTool={activeTool}
    playerDrawingPoints={playerDrawingPoints}
    onResolveClick={handleResolveClick}
    canDragPlayerPins={canDragPlayerPins}
    onDragPlayerPin={handleDragPlayerPin}
    onDeletePlayerPin={handleDeletePlayerPin}
    onSelectPlayerPin={(pin) => {
     setSelectedAnnotation(pin);
     setShowAnnotationPopup(true);
    }}
    onSelectPlayerArea={(area) => {
     setSelectedAnnotation(area);
     setShowAnnotationPopup(true);
    }}
    activeShare={activeShare}
    selectedDevPinId={selectedDevPinId}
    onSelectForMove={setSelectedDevPinId}
    />

    {customMapMode && canAccessCustomMaps && (
     <CustomMapEditor
      maps={customMaps}
      currentMap={currentCustomMap}
      draftZones={customDraftZones}
      selectedZoneId={selectedCustomZoneId}
      isLoading={customMapsLoading}
      hasAccount={Boolean(user?.uid && !user?.isGuest)}
      drawingActive={customDrawingActive}
      drawingPoints={customDrawingPoints}
      zoneName={customZoneName}
      setZoneName={setCustomZoneName}
      entryType={customEntryType}
      setEntryType={(nextType) => {
       setCustomEntryType(nextType);
       setCustomParentId('');
      }}
      parentId={customParentId}
      setParentId={setCustomParentId}
      lore={customLore}
      setLore={setCustomLore}
      onClose={() => handleToggleCustomMap()}
      onCreateMap={handleCreateCustomMap}
      onSelectMap={handleSelectCustomMap}
      onRenameMap={renameCustomMap}
      onSaveMap={handleSaveCustomMap}
      onDeleteMap={handleDeleteCustomMap}
      onStartDrawing={handleStartCustomDrawing}
      onFinishDrawing={() => handleCompleteCustomZone()}
      onCancelDrawing={handleCancelCustomDrawing}
      onUndoPoint={handleUndoCustomPoint}
      onDeleteZone={removeCustomDraftZone}
      onUpdateZone={updateCustomDraftZone}
      onSelectZone={(zoneId) => setSelectedCustomZoneId(zoneId)}
      onFocusZone={handleFocusCustomZone}
      onAddLocationToRegion={handleAddLocationToRegion}
      onImageSelected={handleCustomImageFile}
      onClearImage={handleClearCustomMapImage}
     />
    )}

    {/* Custom Zone Sidebar Popup Drawer */}
    {customMapMode && canAccessCustomMaps && selectedCustomZone && (
     <CustomZoneSidebar
       zone={selectedCustomZone}
       allZones={customDraftZones}
       isOpen={Boolean(selectedCustomZone)}
       onClose={() => setSelectedCustomZoneId(null)}
       onUpdateZone={(zoneId, updates) => updateCustomDraftZone(zoneId, updates)}
       onDeleteZone={(zoneId) => removeCustomDraftZone(zoneId)}
       onFocusZone={handleFocusCustomZone}
       onAddLocationToRegion={handleAddLocationToRegion}
       onSelectZone={(zoneId) => setSelectedCustomZoneId(zoneId)}
    />
    )}

    {/* Floating Toolbar Gated by Subscription Tier */}
    {!customMapMode && tierInfo && tierInfo.tierKey !== 'GUEST' && (
      <AnnotationToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        tierInfo={tierInfo}
        pendingSharesCount={shares.length}
        onOpenShares={() => setShowInbox(true)}
        onOpenShareDialog={() => setShowShareDialog(true)}
        selectedPinType={playerPinIconType}
        setSelectedPinType={setPlayerPinIconType}
      />
    )}

    {/* Detail Editor Popup */}
    <AnnotationPopup
      isOpen={showAnnotationPopup}
      onClose={() => {
        setShowAnnotationPopup(false);
        setSelectedAnnotation(null);
      }}
      annotation={selectedAnnotation}
      userId={user?.uid}
      onSave={handleSaveAnnotation}
      onDelete={handleDeleteAnnotation}
    />

    {/* Friend Coordinates Sharing Dialog */}
    <ShareDialog
      isOpen={showShareDialog}
      onClose={() => setShowShareDialog(false)}
      friends={friends}
      onShare={handleShareView}
    />

    {/* Overlapping selection menu (Selection Carousel) */}
    <AnnotationCollisionMenu
      isOpen={showCollisionMenu}
      onClose={() => {
        setShowCollisionMenu(false);
        setCollisionItems([]);
      }}
      items={collisionItems}
      position={collisionPosition}
      onSelectItem={(item) => item.action()}
    />

    {/* Incoming Shares Inbox panel */}
    {showInbox && (
      <div className="annotation-popup-overlay inbox-overlay animate-fade-in" onClick={() => setShowInbox(false)}>
        <div className="annotation-popup-container inbox-container" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close-btn" onClick={() => setShowInbox(false)}>
            <i className="fas fa-times"></i>
          </button>
          <h2 className="popup-header-title">
            <i className="fas fa-envelope"></i> Shared Coordinates ({shares.length})
          </h2>
          <div className="popup-form-scrollable inbox-list">
            {shares.length > 0 ? (
              shares.map((share) => (
                <div key={share.id} className="inbox-item-card">
                  <div className="inbox-item-details">
                    <span className="inbox-item-sender">
                      <i className="fas fa-compass"></i> From: {share.fromUserName}
                    </span>
                    <p className="inbox-item-message">"{share.message || 'No description provided'}"</p>
                    <span className="inbox-item-date">Expires: {new Date(share.expiresAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="inbox-item-actions">
                    <button className="inbox-btn decline-btn" onClick={() => handleDeclineShare(share.id)}>
                      Decline
                    </button>
                    <button className="inbox-btn accept-btn" onClick={() => handleAcceptShare(share)}>
                      View Location
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-inbox-state">
                <i className="fas fa-box-open"></i>
                <p>Your sharing inbox is empty.</p>
                <span>Shared views from friends will appear here.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    <LoreSidebar
      regionId={selectedRegionId}
      selectedLocationId={selectedLocationId}
      setSelectedLocationId={setSelectedLocationId}
      open={sidebarOpen}
      onClose={handleSidebarClose}
      currentCampaign={currentCampaign}
      onEnterSubregionMap={handleEnterSubregionMap}
      onAddLocation={(regId) => handleAddLocationToRegion(regId)}
    />

    <DevEditor
      devMode={devMode}
      devTool={devTool}
      setDevTool={setDevTool}
      activeMapId={activeMapId}
      currentRegion={currentRegion}
      setCurrentRegion={setCurrentRegion}
      drawingPoints={drawingPoints}
      setDrawingPoints={setDrawingPoints}
      selectedPinType={selectedPinType}
      setSelectedPinType={setSelectedPinType}
      selectedZoneId={selectedZoneId}
      setSelectedZoneId={setSelectedZoneId}
      currentCampaign={currentCampaign}
      pinSourceType={pinSourceType}
      setPinSourceType={setPinSourceType}
      selectedCampaignLocId={selectedCampaignLocId}
      setSelectedCampaignLocId={setSelectedCampaignLocId}
      selectedCampaignLoreId={selectedCampaignLoreId}
      setSelectedCampaignLoreId={setSelectedCampaignLoreId}
      customPinName={customPinName}
      setCustomPinName={setCustomPinName}
      customPinDesc={customPinDesc}
      setCustomPinDesc={setCustomPinDesc}
      cursorPos={cursorPos}
      onUpdate={() => {
        saveRegionsToCache();
        saveCoordsToCache();
        setUpdateTrigger(prev => prev + 1);
      }}
      showConfirm={showConfirm}
      selectedDevPinId={selectedDevPinId}
      setSelectedDevPinId={setSelectedDevPinId}
      setSelectedLocationId={setSelectedLocationId}
      setSidebarOpen={setSidebarOpen}
      updateTrigger={updateTrigger}
      setDevMode={setDevMode}
    />

    {customConfirm.isOpen && (
      <div className="custom-confirm-overlay animate-fade-in" onClick={customConfirm.onCancel}>
        <div className="custom-confirm-card" onClick={e => e.stopPropagation()}>
          <div className="custom-confirm-header">
            <i className="fas fa-scroll confirm-warn-icon"></i>
            <h3>Confirmation Required</h3>
          </div>
          <div className="custom-confirm-body">
            <p>{customConfirm.message}</p>
          </div>
          <div className="custom-confirm-actions">
            <button className="confirm-btn cancel" onClick={customConfirm.onCancel}>
              <i className="fas fa-times"></i> Cancel
            </button>
            <button className="confirm-btn confirm" onClick={customConfirm.onConfirm}>
              <i className="fas fa-check"></i> Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="world-map-watermark">
      <i className="fas fa-gem"></i>
      <span>Mythrill</span>
    </div>

    {/* Dev Quick-Copy Toast: appears after drawing a region or placing a pin */}
    {devToast && (
      <div className="dev-toast">
        <div className="dev-toast-header">
          <i className="fas fa-check-circle dev-toast-icon"></i>
          <span className="dev-toast-title">
            {devToast.type === 'region'
              ? `${devToast.item?.name || 'Region'} boundary saved`
              : `Pin "${devToast.item?.key || ''}" placed`}
          </span>
          <button className="dev-toast-close" onClick={dismissDevToast}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="dev-toast-meta">
          {devToast.type === 'region'
            ? `${devToast.item.points.length} points · ${devToast.item.id}`
            : `(${devToast.item.data.x}, ${devToast.item.data.y}) · ${devToast.item.data.pinType}`}
        </div>
        <div className="dev-toast-actions">
          <button className="dev-toast-btn" onClick={() => copyDevItem('js')}>
            {devToast.copied === 'js'
              ? <><i className="fas fa-check"></i> Copied!</>
              : <><i className="fas fa-code"></i> Copy JS</>}
          </button>
          <button className="dev-toast-btn agent" onClick={() => copyDevItem('agent')}>
            {devToast.copied === 'agent'
              ? <><i className="fas fa-check"></i> Copied!</>
              : <><i className="fas fa-robot"></i> Copy for Agent</>}
          </button>
        </div>
      </div>
    )}

    <MapNotificationContainer />
  </div>
 );
};

export default WorldMapImmerse;
