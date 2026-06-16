import React, { useState, useEffect, useCallback, useRef } from 'react';
import MapCanvas from './MapCanvas';
import LoreSidebar from './LoreSidebar';
import DevEditor from './DevEditor';
import BurnedParchmentBorder from './BurnedParchmentBorder';

// Custom player annotations components
import AnnotationToolbar from './AnnotationToolbar';
import AnnotationPopup from './AnnotationPopup';
import ShareDialog from './ShareDialog';
import AnnotationCollisionMenu from './AnnotationCollisionMenu';
import MapNotificationContainer, { notify, confirmDialog } from './MapNotify';

// Stores & Services
import useMapAnnotationStore from '../../store/mapAnnotationStore';
import useAuthStore from '../../store/authStore';
import useSocialStore from '../../store/socialStore';
import subscriptionService from '../../services/subscriptionService';

// Data references
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { ZONE_DATA } from '../../data/zoneData';
import { pointInPolygon } from './RegionOverlay';
import campaignService from '../../services/campaignService';
import './WorldMapImmerse.css';

// Load cached drawn regions and pins from localStorage on initial load
const saveRegionsToCache = () => {
  try {
    localStorage.setItem('mythrill_region_polygons', JSON.stringify(REGION_POLYGONS));
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
        REGION_POLYGONS[key].points = parsed[key].points || [];
        REGION_POLYGONS[key].labelPosition = parsed[key].labelPosition || REGION_POLYGONS[key].labelPosition;
      }
    });
  }
} catch (e) {
  console.warn('Could not restore cached region polygons:', e);
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

const MAP_WIDTH = 4096;
const MAP_HEIGHT = 3072;

const WorldMapImmerse = ({ onClose, onClosing }) => {
  const [phase, setPhase] = useState('entering');
  const [showBorder, setShowBorder] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [hoveredRegionId, setHoveredRegionId] = useState(null);
  
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Dev mode and editor state
  const [devMode, setDevMode] = useState(false);
  const [devTool, setDevTool] = useState('drawRegion');
  const [currentRegion, setCurrentRegion] = useState('');
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [selectedPinType, setSelectedPinType] = useState('fortress');
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [cursorPos, setCursorPos] = useState(null);

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

  // Dev toast state — shows a quick-copy notification after drawing/placing
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

  const [tierInfo, setTierInfo] = useState(null);
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

  // Sync annotations on user load
  useEffect(() => {
    if (user?.uid) {
      syncAnnotations(user.uid);
      
      // Load subscription status
      const loadTier = async () => {
        const tier = await subscriptionService.getSubscriptionStatus(user.uid);
        setTierInfo(tier);
      };
      loadTier();
    }
    return () => cleanupSubscriptions();
  }, [user, syncAnnotations, cleanupSubscriptions]);

  // Calculate the "cover" transform — the map fills the entire viewport.
  // This matches the end state of the landing page dive transition, so the
  // crossfade from the CSS background to this canvas is seamless.
  const [initialTransform] = useState(() => {
    if (typeof window === 'undefined') return { scale: 0.4, posX: 0, posY: 0 };
    const W = window.innerWidth;
    const H = window.innerHeight;
    const fitScale = Math.max(W / 4096, H / 3072);
    const fitX = (W - 4096 * fitScale) / 2;
    const fitY = (H - 3072 * fitScale) / 2;
    return { scale: fitScale, posX: fitX, posY: fitY };
  });

  // The dive (zoom-out) happens on the landing page's own CSS background.
  // WorldMapImmerse starts transparent and crossfades in once the dive
  // is nearly complete, so the handoff is seamless.
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('immersed');
      setShowBorder(true);
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  const handleClose = useCallback(() => {
    if (onClosing) onClosing();
    setShowBorder(false);
    setSidebarOpen(false);
    setPhase('zoomingIn');

    setTimeout(() => {
      setPhase('complete');
      setTimeout(() => onClose(), 400);
    }, 1000);
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
        text = `Update the file src/data/regionPolygons.js — replace the '${r.id}' entry with these values (I just drew the boundary in the map editor):\n\n'${r.id}': {\n  points: [${r.points.map(p => `[${p[0]}, ${p[1]}]`).join(', ')}],\n  labelPosition: [${r.labelPosition[0]}, ${r.labelPosition[1]}]\n}`;
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

    // Dev drawing/pin logic
    if (devMode) {
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
            const existing = REGION_POLYGONS[currentRegion];
            showConfirm(
              `Are you sure you want to complete and save the boundaries for "${existing.name}"?`,
              () => {
                const cx = drawingPoints.reduce((s, p) => s + p[0], 0) / drawingPoints.length;
                const cy = drawingPoints.reduce((s, p) => s + p[1], 0) / drawingPoints.length;
                existing.points = [...drawingPoints];
                existing.labelPosition = [Math.round(cx), Math.round(cy)];
                setDrawingPoints([]);
                saveRegionsToCache();
                setUpdateTrigger(prev => prev + 1);
                showDevToast('region', {
                  id: existing.id,
                  name: existing.name,
                  points: [...existing.points],
                  color: existing.color,
                  glowColor: existing.glowColor,
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
        let pinData = {
          x: coords[0],
          y: coords[1],
          pinType: selectedPinType,
          regionId: currentRegion || selectedRegionId || ''
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
  }, [devMode, devTool, currentRegion, selectedRegionId, drawingPoints, selectedPinType, selectedZoneId, activeTool, playerDrawingPoints, playerPinIconType, user, pins.length, tierInfo, addPin, addArea, pinSourceType, selectedCampaignLocId, selectedCampaignLoreId, customPinName, customPinDesc, showConfirm]);

  const handleMapMouseMove = useCallback((e, transformRef) => {
    const coords = getImageCoords(e, transformRef);
    if (!coords) return;

    if (devMode && devTool === 'drawRegion' && drawingPoints.length > 0) {
      setCursorPos(coords);
    } else if (activeTool === 'drawArea' && playerDrawingPoints.length > 0) {
      setCursorPos(coords);
    }
  }, [devMode, devTool, drawingPoints, activeTool, playerDrawingPoints]);

  const handleTransformChange = useCallback((state) => {
    setTransformState(state || { scale: 0.4, positionX: 0, positionY: 0 });
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    setSelectedRegionId(null);
    setSelectedLocationId(null);
  }, []);

  // === Overlap Click Resolution logic ===
  const handleResolveClick = useCallback((x, y, fallbackItem) => {
    const hits = [];

    // 1. Proximity check on Dev Pins
    Object.entries(LOCATION_COORDINATES).forEach(([zoneId, coord]) => {
      const distance = Math.hypot(coord.x - x, coord.y - y);
      if (distance < 45) {
        const zone = ZONE_DATA.find(z => z.id === zoneId);
        if (zone) {
          hits.push({
            id: zoneId,
            title: zone.name,
            type: 'devPin',
            action: () => {
              setSelectedRegionId(zone.regionId);
              setSelectedLocationId(zoneId);
              setSidebarOpen(true);
            }
          });
        }
      }
    });

    // 2. Proximity check on Player Pins
    pins.forEach((pin) => {
      const distance = Math.hypot(pin.x - x, pin.y - y);
      if (distance < 45) {
        hits.push({
          id: pin.id,
          title: pin.title,
          type: 'playerPin',
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
    Object.values(REGION_POLYGONS).forEach((region) => {
      if (pointInPolygon(x, y, region.points)) {
        hits.push({
          id: region.id,
          title: region.name,
          type: 'region',
          action: () => {
            setSelectedRegionId(region.id);
            setSelectedLocationId(null);
            setSidebarOpen(true);
          }
        });
      }
    });

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
  }, [pins, areas, transformState]);

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

      <MapCanvas
        phase={phase}
        initialTransform={initialTransform}
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
      />

      {/* Floating Toolbar Gated by Subscription Tier */}
      {tierInfo && tierInfo.tierKey !== 'GUEST' && (
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
      />

      <DevEditor
        devMode={devMode}
        devTool={devTool}
        setDevTool={setDevTool}
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
      />

      {customConfirm.isOpen && (
        <div className="custom-confirm-overlay animate-fade-in" onClick={customConfirm.onCancel}>
          <div className="custom-confirm-card" onClick={e => e.stopPropagation()}>
            <div className="custom-confirm-header">
              <i className="fas fa-exclamation-triangle confirm-warn-icon"></i>
              <h3>Are You Sure?</h3>
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

      {/* Dev Quick-Copy Toast — appears after drawing a region or placing a pin */}
      {devToast && (
        <div className="dev-toast">
          <div className="dev-toast-header">
            <i className="fas fa-check-circle dev-toast-icon"></i>
            <span className="dev-toast-title">
              {devToast.type === 'region'
                ? `${devToast.item.name} boundary saved`
                : `Pin "${devToast.item.key}" placed`}
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
