import React, { useState } from 'react';

const LocationSceneToolbar = ({
  isGM,
  maps = [],
  currentMap,
  onSelectMap,
  breadcrumbs = [],
  onEnterSubMap,
  onOpenNewMapModal,
  onOpenEditMapModal,
  // Pin & Label tools
  isDroppingPin,
  onToggleDroppingPin,
  isDroppingLabel,
  onToggleDroppingLabel,
  isCodexOpen,
  onToggleCodex,
  onSwitchToTactical,
  secretCount = 0,
  // Fog of War Props
  isFogActive,
  onToggleFogTool,
  fogMode,
  onSetFogMode,
  fogSize,
  onSetFogSize,
  onShroudAll,
  onClearFog,
  previewAsPlayer,
  onTogglePreviewAsPlayer,
  // Route / Waypoint Traversal Props
  isDrawingRoute,
  onToggleRouteTool,
  onClearRoutes,
  // Layers & Lock
  layers = [],
  onToggleLayer,
  isMapLocked,
  onToggleMapLock,
  // Zoom
  onZoomIn,
  onZoomOut,
  onResetZoom
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeFlyout, setActiveFlyout] = useState(null); // 'maps' | 'fog' | 'route' | 'layers' | null

  if (!isGM) {
    // Player View: Minimal right-side zoom and breadcrumbs
    return (
      <div className="location-scene-right-shelf" style={{ top: '80px', width: '42px' }}>
        <button type="button" className="btn-shelf-action" onClick={onZoomIn} title="Zoom In">
          <i className="fas fa-plus"></i>
        </button>
        <button type="button" className="btn-shelf-action" onClick={onZoomOut} title="Zoom Out">
          <i className="fas fa-minus"></i>
        </button>
        <button type="button" className="btn-shelf-action" onClick={onResetZoom} title="Reset View">
          <i className="fas fa-arrows-rotate"></i>
        </button>
      </div>
    );
  }

  return (
    <div className="location-scene-right-shelf">
      {/* Collapse / Expand Toggle Button */}
      <button
        type="button"
        className="btn-shelf-action"
        onClick={() => {
          setIsCollapsed(prev => !prev);
          setActiveFlyout(null);
        }}
        title={isCollapsed ? "Expand Exploration Tools" : "Collapse Exploration Tools"}
        style={{ height: '24px', fontSize: '11px' }}
      >
        <i className={`fas ${isCollapsed ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
      </button>

      {!isCollapsed && (
        <>
          {/* Tactical Battle Grid Switcher */}
          <button
            type="button"
            className="btn-shelf-action primary-tactical"
            onClick={onSwitchToTactical}
            title="Switch to Tactical Battle Grid (Combat / Tokens)"
          >
            <i className="fas fa-chess-board"></i>
            <span className="shelf-btn-label">Grid</span>
          </button>

          <div className="shelf-divider" />

          {/* Sub-Map Selector & Breadcrumb Drilldown */}
          <button
            type="button"
            className={`btn-shelf-action ${activeFlyout === 'maps' ? 'active' : ''}`}
            onClick={() => setActiveFlyout(activeFlyout === 'maps' ? null : 'maps')}
            title={`Active Region: ${currentMap?.name || 'Atlas'} (Click to change sub-map)`}
          >
            <i className="fas fa-map"></i>
            <span className="shelf-btn-label">Atlas</span>
          </button>

          {/* Add Landmark Pin Tool */}
          <button
            type="button"
            className={`btn-shelf-action ${isDroppingPin ? 'active' : ''}`}
            onClick={() => {
              onToggleDroppingPin();
              setActiveFlyout(null);
            }}
            title={isDroppingPin ? "Placing Landmark Pin — Click on map to place (or click here to cancel)" : "Add Landmark Pin to map"}
          >
            <i className="fas fa-location-dot"></i>
            <span className="shelf-btn-label">Pin</span>
          </button>

          {/* Add Region / Text Label Tool */}
          <button
            type="button"
            className={`btn-shelf-action ${isDroppingLabel ? 'active' : ''}`}
            onClick={() => {
              onToggleDroppingLabel();
              setActiveFlyout(null);
            }}
            title={isDroppingLabel ? "Placing Text Label — Click on map to place label (or click here to cancel)" : "Add Region / Text Label to map"}
          >
            <i className="fas fa-font"></i>
            <span className="shelf-btn-label">Label</span>
          </button>

          {/* Campaign & Journal Codex Hub */}
          <button
            type="button"
            className={`btn-shelf-action ${isCodexOpen ? 'active' : ''}`}
            onClick={() => {
              onToggleCodex();
              setActiveFlyout(null);
            }}
            title={isCodexOpen ? "Close Campaign & Journal Codex" : "Open Campaign & Journal Codex (Browse & Place Quests, NPCs, Creatures, Factions, Items, and Notes)"}
          >
            <i className="fas fa-book-atlas"></i>
            <span className="shelf-btn-label">Codex</span>
          </button>

          {/* Fog of War Brush Tool */}
          <button
            type="button"
            className={`btn-shelf-action ${isFogActive || activeFlyout === 'fog' ? 'active' : ''}`}
            onClick={() => {
              const next = activeFlyout === 'fog' ? null : 'fog';
              setActiveFlyout(next);
              if (next === 'fog' && !isFogActive) onToggleFogTool();
            }}
            title="Fog of War: Shroud or Reveal Map Areas"
          >
            <i className="fas fa-smog"></i>
            <span className="shelf-btn-label">Fog</span>
          </button>

          {/* Route & Waypoint Planner Tool */}
          <button
            type="button"
            className={`btn-shelf-action ${isDrawingRoute || activeFlyout === 'route' ? 'active' : ''}`}
            onClick={() => {
              const next = activeFlyout === 'route' ? null : 'route';
              setActiveFlyout(next);
              if (next === 'route' && !isDrawingRoute) onToggleRouteTool();
            }}
            title="Plot Expedition Waypoints & Route Trails"
          >
            <i className="fas fa-route"></i>
            <span className="shelf-btn-label">Route</span>
          </button>

          {/* Layers Visibility HUD */}
          <button
            type="button"
            className={`btn-shelf-action ${activeFlyout === 'layers' ? 'active' : ''}`}
            onClick={() => setActiveFlyout(activeFlyout === 'layers' ? null : 'layers')}
            title="Toggle Map Layers (Pins, Labels, Fog, Routes)"
          >
            <i className="fas fa-layer-group"></i>
            <span className="shelf-btn-label">Layers</span>
          </button>

          <div className="shelf-divider" />

          {/* Lock / Unlock Markers */}
          <button
            type="button"
            className={`btn-shelf-action ${isMapLocked ? 'active' : ''}`}
            onClick={onToggleMapLock}
            title={isMapLocked ? "Markers Locked (Drag disabled) - Click to Unlock" : "Lock Markers (Prevent accidental dragging)"}
          >
            <i className={`fas ${isMapLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
            <span className="shelf-btn-label">{isMapLocked ? 'Locked' : 'Lock'}</span>
          </button>

          {secretCount > 0 && (
            <span
              style={{
                fontSize: '9px',
                color: '#8a1f11',
                fontWeight: 900,
                padding: '2px 4px',
                borderRadius: '4px',
                background: '#fcf0f0',
                border: '1px solid #c0392b',
                marginTop: '2px'
              }}
              title={`${secretCount} secret item(s) hidden from players`}
            >
              {secretCount} <i className="fas fa-eye-slash"></i>
            </span>
          )}

          <div className="shelf-divider" />

          {/* Zoom Controls */}
          <button type="button" className="btn-shelf-action" onClick={onZoomIn} title="Zoom In" style={{ height: '30px' }}>
            <i className="fas fa-plus" style={{ fontSize: '11px' }}></i>
          </button>
          <button type="button" className="btn-shelf-action" onClick={onZoomOut} title="Zoom Out" style={{ height: '30px' }}>
            <i className="fas fa-minus" style={{ fontSize: '11px' }}></i>
          </button>
          <button type="button" className="btn-shelf-action" onClick={onResetZoom} title="Reset View" style={{ height: '30px' }}>
            <i className="fas fa-arrows-rotate" style={{ fontSize: '11px' }}></i>
          </button>
        </>
      )}

      {/* Slide-out Flyout: Sub-Map Selector & Breadcrumbs */}
      {activeFlyout === 'maps' && (
        <div className="shelf-flyout-tray vertical-menu" style={{ top: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #8c6738', paddingBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3d2614', textTransform: 'uppercase' }}>
              <i className="fas fa-compass" style={{ color: '#d4af37' }}></i> Cartography Atlas
            </span>
            <button type="button" onClick={() => setActiveFlyout(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c3e21' }}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Breadcrumb Trail */}
          {breadcrumbs.length > 1 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '4px 0', fontSize: '11px' }}>
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.id || idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {idx > 0 && <span style={{ color: '#8c6738', margin: '0 3px' }}>/</span>}
                  <button
                    type="button"
                    onClick={() => {
                      onEnterSubMap(crumb.id);
                      setActiveFlyout(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: crumb.id === currentMap?.id ? '#8a1f11' : '#5c3e21',
                      fontWeight: crumb.id === currentMap?.id ? 800 : 600,
                      cursor: 'pointer',
                      padding: 0,
                      fontFamily: 'Cinzel, serif'
                    }}
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Map List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
            {maps.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`btn-header-action ${m.id === currentMap?.id ? 'active' : ''}`}
                onClick={() => {
                  onSelectMap(m.id);
                  setActiveFlyout(null);
                }}
                style={{ justifyContent: 'flex-start', textAlign: 'left', width: '100%' }}
              >
                <i className={`fas ${m.type === 'world' ? 'fa-globe' : m.type === 'subregion' ? 'fa-city' : m.type === 'scene' ? 'fa-image' : 'fa-map'}`}></i>
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          {/* Action Buttons for Atlas Management */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(140, 103, 56, 0.3)' }}>
            <button
              type="button"
              className="btn-header-action active"
              onClick={() => {
                onOpenNewMapModal?.();
                setActiveFlyout(null);
              }}
              style={{ flex: 1, justifyContent: 'center' }}
              title="Upload new scene / place artwork or sub-region"
            >
              <i className="fas fa-plus"></i> + New Scene
            </button>
            <button
              type="button"
              className="btn-header-action"
              onClick={() => {
                onOpenEditMapModal?.(currentMap);
                setActiveFlyout(null);
              }}
              title="Change background artwork / edit scene details"
            >
              <i className="fas fa-gear"></i> Edit BG
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Flyout: Fog of War Controls */}
      {activeFlyout === 'fog' && (
        <div className="shelf-flyout-tray" style={{ top: '130px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#3d2614', textTransform: 'uppercase' }}>
            <i className="fas fa-smog" style={{ color: '#8c6738' }}></i> Fog Brush:
          </span>

          <button
            type="button"
            className={`btn-header-action ${fogMode === 'shroud' && isFogActive ? 'active' : ''}`}
            onClick={() => {
              onSetFogMode('shroud');
              if (!isFogActive) onToggleFogTool();
            }}
            title="Shroud terrain in dark fog"
          >
            <i className="fas fa-brush"></i> Shroud
          </button>

          <button
            type="button"
            className={`btn-header-action ${fogMode === 'reveal' && isFogActive ? 'active' : ''}`}
            onClick={() => {
              onSetFogMode('reveal');
              if (!isFogActive) onToggleFogTool();
            }}
            title="Erase fog to reveal terrain to players"
          >
            <i className="fas fa-eraser"></i> Reveal
          </button>

          {/* Brush Sizes */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {[
              { label: 'S', size: 60 },
              { label: 'M', size: 120 },
              { label: 'L', size: 240 },
              { label: 'XL', size: 400 }
            ].map(b => (
              <button
                key={b.size}
                type="button"
                className={`btn-header-action ${fogSize === b.size ? 'active' : ''}`}
                onClick={() => onSetFogSize(b.size)}
                style={{ padding: '2px 7px', minWidth: '22px', fontSize: '10px' }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <button type="button" className="btn-header-action" onClick={onShroudAll} title="Cover entire map in fog">
            <i className="fas fa-cloud-moon"></i> Shroud All
          </button>

          <button type="button" className="btn-header-action" onClick={onClearFog} title="Clear all fog" style={{ color: '#8a1f11' }}>
            <i className="fas fa-trash-can"></i> Clear
          </button>

          <button
            type="button"
            className={`btn-header-action ${previewAsPlayer ? 'active' : ''}`}
            onClick={onTogglePreviewAsPlayer}
            title="Preview opaque fog as seen by players"
          >
            <i className="fas fa-eye"></i> {previewAsPlayer ? 'Player View' : 'GM View'}
          </button>

          <button type="button" onClick={() => setActiveFlyout(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c3e21' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Slide-out Flyout: Route Planner */}
      {activeFlyout === 'route' && (
        <div className="shelf-flyout-tray" style={{ top: '175px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#3d2614', textTransform: 'uppercase' }}>
            <i className="fas fa-route" style={{ color: '#d35400' }}></i> Route Planner:
          </span>

          <span style={{ fontSize: '11px', color: '#5c3e21' }}>
            {isDrawingRoute ? 'Click map to place waypoint' : 'Plotting paused'}
          </span>

          <button
            type="button"
            className={`btn-header-action ${isDrawingRoute ? 'active' : ''}`}
            onClick={onToggleRouteTool}
          >
            <i className="fas fa-pen"></i> {isDrawingRoute ? 'Pause' : 'Plot'}
          </button>

          <button type="button" className="btn-header-action" onClick={onClearRoutes} style={{ color: '#8a1f11' }}>
            <i className="fas fa-trash"></i> Clear
          </button>

          <button type="button" onClick={() => setActiveFlyout(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c3e21' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Slide-out Flyout: Layers */}
      {activeFlyout === 'layers' && (
        <div className="shelf-flyout-tray" style={{ top: '220px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#3d2614', textTransform: 'uppercase' }}>
            <i className="fas fa-layer-group"></i> Visible Layers:
          </span>

          {[
            { id: 'pins', label: 'Pins', icon: 'fa-location-dot' },
            { id: 'labels', label: 'Labels', icon: 'fa-font' },
            { id: 'journey', label: 'Routes', icon: 'fa-route' },
            { id: 'fog', label: 'Fog', icon: 'fa-smog' },
            { id: 'secrets', label: 'Secrets', icon: 'fa-eye-slash' }
          ].map(l => {
            const isVisible = layers.find(layer => layer.id === l.id)?.isVisible !== false;
            return (
              <button
                key={l.id}
                type="button"
                className={`btn-header-action ${isVisible ? 'active' : ''}`}
                onClick={() => onToggleLayer(l.id)}
                title={isVisible ? `Hide ${l.label} layer` : `Show ${l.label} layer`}
              >
                <i className={`fas ${l.icon}`}></i> {l.label}
              </button>
            );
          })}

          <button type="button" onClick={() => setActiveFlyout(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5c3e21' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationSceneToolbar;
