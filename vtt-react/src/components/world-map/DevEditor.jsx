import React, { useState, useRef, useEffect } from 'react';
import { REGION_POLYGONS, BASELINE_REGION_POLYGONS } from '../../data/regionPolygons';
import { LOCATION_COORDINATES, BASELINE_LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { PIN_TYPE_OPTIONS } from './mapPinIcons';
import PIN_ICONS from './mapPinIcons';
import { SUBREGIONS } from '../../data/subregions';
import { ZONE_DATA } from '../../data/zoneData';
import { saveCustomMap } from '../../data/subregionMaps';
import './DevEditor.css';

const MAP_WIDTH = 4096;
const MAP_HEIGHT = 3072;

const REGION_OPTIONS = [
  ...Object.values(REGION_POLYGONS).map(r => ({ id: r.id, name: `[Region] ${r.name}` })),
  ...Object.values(SUBREGIONS).map(s => ({ id: s.id, name: `[Subregion] ${s.name}` }))
];

const CustomSelect = ({ value, onChange, options, placeholder = 'Select...', width = '160px' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => String(o.id) === String(value));
  const displayLabel = selectedOption ? (selectedOption.name || selectedOption.title || selectedOption.label) : placeholder;

  return (
    <div className="custom-dev-select-container" style={{ width }} ref={dropdownRef}>
      <button 
        type="button"
        className={`custom-dev-select-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="custom-dev-select-dropdown animate-fade-in-up">
          {options.length === 0 ? (
            <div className="custom-dev-select-no-options">No options available</div>
          ) : (
            options.map(option => (
              <button
                key={option.id}
                type="button"
                className={`custom-dev-select-option ${String(option.id) === String(value) ? 'active' : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                {option.name || option.title || option.label}
                {option.badge && <span className="select-option-badge">{option.badge}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const CustomPinTypePicker = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = options.find(o => o.id === value) || options[0];
  const ActiveIcon = PIN_ICONS[activeOption.id];

  return (
    <div className="custom-pin-type-picker-container" ref={dropdownRef}>
      <button 
        type="button"
        className={`custom-pin-type-picker-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Pin Type: ${activeOption.label}`}
      >
        {ActiveIcon && (
          <svg viewBox={ActiveIcon.viewBox} width="16" height="16">
            <path d={ActiveIcon.path} fill="#ebd5a3" />
          </svg>
        )}
        <span className="picker-active-label">{activeOption.label}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} picker-arrow`}></i>
      </button>

      {isOpen && (
        <div className="custom-pin-type-picker-popover animate-fade-in-up">
          <div className="picker-popover-header">Select Pin Type</div>
          <div className="custom-pin-type-grid">
            {options.map(pt => {
              const icon = PIN_ICONS[pt.id];
              const isActive = pt.id === value;
              return (
                <button
                  key={pt.id}
                  type="button"
                  className={`custom-pin-type-cell ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onChange(pt.id);
                    setIsOpen(false);
                  }}
                  title={pt.label}
                >
                  {icon && (
                    <svg viewBox={icon.viewBox} width="20" height="20">
                      <path d={icon.path} fill={isActive ? '#ffe082' : '#ebd5a3'} />
                    </svg>
                  )}
                  <span className="pin-cell-label">{pt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const DevEditor = ({
  devMode,
  devTool,
  setDevTool,
  currentRegion,
  setCurrentRegion,
  drawingPoints,
  setDrawingPoints,
  selectedPinType,
  setSelectedPinType,
  selectedZoneId,
  setSelectedZoneId,
  currentCampaign,
  pinSourceType,
  setPinSourceType,
  selectedCampaignLocId,
  setSelectedCampaignLocId,
  selectedCampaignLoreId,
  setSelectedCampaignLoreId,
  customPinName,
  setCustomPinName,
  customPinDesc,
  setCustomPinDesc,
  cursorPos,
  onUpdate,
  showConfirm,
  selectedDevPinId,
  setSelectedDevPinId,
  updateTrigger
}) => {

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState({ regions: '', locations: '' });
  const [copiedType, setCopiedType] = useState(null);
  const [exportFormat, setExportFormat] = useState('agent');

  // Inspector draft coordinates for the currently selected dev pin.
  const [draftX, setDraftX] = useState('');
  const [draftY, setDraftY] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedParentRegion, setSelectedParentRegion] = useState(
    REGION_POLYGONS[currentRegion]?.id || SUBREGIONS[currentRegion]?.regionId || 'nordhalla'
  );
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Sync the inspector inputs whenever the selection changes, and also while
  // the pin is being dragged (updateTrigger bumps from WorldMapImmerse): but
  // never clobber the field the user is actively typing in.
  useEffect(() => {
    const c = selectedDevPinId ? LOCATION_COORDINATES[selectedDevPinId] : null;
    if (!c) { setDraftX(''); setDraftY(''); return; }
    const ae = document.activeElement;
    const focused = ae && (ae.dataset && ae.dataset.coordAxis);
    if (!focused) { setDraftX(String(c.x)); setDraftY(String(c.y)); }
  }, [selectedDevPinId, updateTrigger]);

  if (!devMode) return null;

  const MAIN_REGION_OPTIONS = Object.values(REGION_POLYGONS).map(r => ({
    id: r.id,
    name: r.name
  }));

  const activeParentObj = REGION_POLYGONS[selectedParentRegion];
  const subregionsForActiveParent = Object.values(SUBREGIONS).filter(s => s.regionId === selectedParentRegion);

  const SUBREGION_OPTIONS = [
    ...(activeParentObj ? [{ id: activeParentObj.id, name: `[Whole Region] ${activeParentObj.name}` }] : []),
    ...subregionsForActiveParent.map(s => ({ id: s.id, name: s.name }))
  ];

  const regionZones = (currentRegion ? ZONE_DATA.filter(z => z.regionId === currentRegion) : ZONE_DATA).map(z => {
    const regionName = REGION_POLYGONS[z.regionId]?.name || z.regionId;
    const isPlaced = !!LOCATION_COORDINATES[z.id];
    return {
      ...z,
      name: `${z.name}: ${regionName}`,
      badge: isPlaced ? null : 'not placed'
    };
  });
  const campaignLocations = currentCampaign?.campaignData?.locations || [];
  const campaignLoreArticles = currentCampaign?.campaignData?.homebrew?.lore || [];

  const getDrawnRegions = () => {
    const out = {};
    Object.values(REGION_POLYGONS).forEach(r => {
      if (r.points && r.points.length >= 3) out[r.id] = { ...r };
    });
    return out;
  };

  const formatRegionEntry = (r) => {
    const pts = r.points.map(p => `[${p[0]}, ${p[1]}]`).join(', ');
    return `'${r.id}': {\n  points: [${pts}],\n  labelPosition: [${r.labelPosition[0]}, ${r.labelPosition[1]}]\n}`;
  };

  // ── Diff computation against the committed file baseline ──
  const computeLocationDiff = () => {
    const moved = [], added = [], removed = [];
    Object.keys(LOCATION_COORDINATES).forEach((key) => {
      const cur = LOCATION_COORDINATES[key];
      const base = BASELINE_LOCATION_COORDINATES[key];
      if (!base) added.push(key);
      else if (cur.x !== base.x || cur.y !== base.y) {
        moved.push({ key, from: [base.x, base.y], to: [cur.x, cur.y] });
      }
    });
    Object.keys(BASELINE_LOCATION_COORDINATES).forEach((key) => {
      if (!LOCATION_COORDINATES[key]) removed.push(key);
    });
    return { moved, added, removed };
  };

  const computeRegionDiff = () => {
    const changed = [];
    Object.values(REGION_POLYGONS).forEach((r) => {
      const base = BASELINE_REGION_POLYGONS[r.id];
      if (!base || !r.points || r.points.length < 3) return;
      const ptsChanged = JSON.stringify(base.points) !== JSON.stringify(r.points);
      const labelChanged = JSON.stringify(base.labelPosition) !== JSON.stringify(r.labelPosition);
      if (ptsChanged || labelChanged) changed.push(r);
    });
    return changed;
  };

  const locDiff = computeLocationDiff();
  const regDiff = computeRegionDiff();
  const changeCount =
    locDiff.moved.length + locDiff.added.length + locDiff.removed.length + regDiff.length;

  // Resolve display info for the currently selected dev pin (inspector panel).
  const selectedPin = selectedDevPinId ? LOCATION_COORDINATES[selectedDevPinId] : null;
  const selectedPinZone = selectedDevPinId ? ZONE_DATA.find((z) => z.id === selectedDevPinId) : null;
  const selectedRegionName = (() => {
    const rid = selectedPinZone?.regionId || selectedPin?.regionId;
    return rid ? (REGION_POLYGONS[rid]?.name || rid) : '-';
  })();

  const commitCoord = (axis, raw) => {
    if (!selectedDevPinId || !selectedPin) return;
    const max = axis === 'x' ? MAP_WIDTH : MAP_HEIGHT;
    const parsed = parseInt(raw, 10);
    const val = Number.isFinite(parsed) ? Math.max(0, Math.min(max, parsed)) : 0;
    if (axis === 'x') setDraftX(raw); else setDraftY(raw);
    selectedPin[axis] = val;
    if (onUpdate) onUpdate();
  };

  const handleExport = () => {
    const drawnRegions = getDrawnRegions();

    let regionsStr = '';
    let locationsStr = '';

    if (exportFormat === 'agent') {
      // Agent format: emit ONLY the diff vs the committed file baseline so a
      // code agent gets a precise, minimal change-set to apply.
      const diff = computeLocationDiff();
      const rDiff = computeRegionDiff();
      const anyChanges =
        diff.moved.length || diff.added.length || diff.removed.length || rDiff.length;

      if (rDiff.length) {
        const entries = rDiff.map((r) => formatRegionEntry(r)).join('\n\n');
        regionsStr = `Update src/data/regionPolygons.js: replace each region entry's "points" and "labelPosition" with these values (edited in the map dev editor):\n\n${entries}`;
      } else {
        regionsStr = 'No region boundary changes to export.';
      }

      if (!anyChanges) {
        locationsStr = 'No location coordinate changes to export: the live map matches src/data/locationCoordinates.js exactly.';
      } else {
        const parts = [];
        if (diff.moved.length) {
          parts.push(`## Moved (${diff.moved.length})\n` + diff.moved.map((m) =>
            `'${m.key}': { x: ${m.to[0]}, y: ${m.to[1]} }  // was [${m.from[0]}, ${m.from[1]}]`
          ).join('\n'));
        }
        if (diff.added.length) {
          parts.push(`## Added (${diff.added.length})\n` + diff.added.map((k) =>
            `'${k}': ${JSON.stringify(LOCATION_COORDINATES[k])}`
          ).join('\n'));
        }
        if (diff.removed.length) {
          parts.push(`## Removed (${diff.removed.length})\n` + diff.removed.map((k) => `'${k}'`).join('\n'));
        }
        locationsStr = `Update src/data/locationCoordinates.js with these changes (edited in the map dev editor). Replace the matching entries' x/y (or add/remove the keys):\n\n${parts.join('\n\n')}`;
      }
    } else {
      // Full JS code format (complete dump)
      const regionsOutput = drawnRegions;
      regionsStr = `export const REGION_POLYGONS = ${JSON.stringify(regionsOutput, null, 2)};\n\nexport default REGION_POLYGONS;`;
      locationsStr = `export const LOCATION_COORDINATES = ${JSON.stringify(LOCATION_COORDINATES, null, 2)};\n\nexport default LOCATION_COORDINATES;`;
    }

    setExportData({ regions: regionsStr, locations: locationsStr });
    setExportModalOpen(true);
  };

  const handleClearAllPresetData = () => {
    showConfirm(
      'Are you sure you want to CLEAR ALL default location pins and drawn region boundaries? This will leave your map canvas empty so you can draw your custom subregions and pins from scratch.',
      () => {
        Object.keys(LOCATION_COORDINATES).forEach(key => delete LOCATION_COORDINATES[key]);
        localStorage.setItem('mythrill_location_coordinates', JSON.stringify({}));

        Object.values(REGION_POLYGONS).forEach(r => {
          r.points = [];
        });
        localStorage.setItem('mythrill_region_polygons', JSON.stringify(REGION_POLYGONS));

        setDrawingPoints([]);
        if (onUpdate) onUpdate();
      }
    );
  };

  const handleResetToDefaults = () => {
    showConfirm(
      'Are you sure you want to RESET all location pins and region boundaries back to original canonical defaults?',
      () => {
        Object.keys(LOCATION_COORDINATES).forEach(key => delete LOCATION_COORDINATES[key]);
        Object.assign(LOCATION_COORDINATES, JSON.parse(JSON.stringify(BASELINE_LOCATION_COORDINATES)));
        localStorage.setItem('mythrill_location_coordinates', JSON.stringify(LOCATION_COORDINATES));

        Object.keys(REGION_POLYGONS).forEach(key => {
          if (BASELINE_REGION_POLYGONS[key]) {
            REGION_POLYGONS[key].points = [...(BASELINE_REGION_POLYGONS[key].points || [])];
            REGION_POLYGONS[key].labelPosition = [...(BASELINE_REGION_POLYGONS[key].labelPosition || [])];
          }
        });
        localStorage.setItem('mythrill_region_polygons', JSON.stringify(REGION_POLYGONS));

        setDrawingPoints([]);
        if (onUpdate) onUpdate();
      }
    );
  };

  const handleResetSingleRegion = () => {
    if (!currentRegion) return;
    const regName = REGION_POLYGONS[currentRegion]?.name || SUBREGIONS[currentRegion]?.name || currentRegion;
    showConfirm(
      `Are you sure you want to reset boundaries for "${regName}" back to original code defaults?`,
      () => {
        if (BASELINE_REGION_POLYGONS[currentRegion]) {
          REGION_POLYGONS[currentRegion].points = [...(BASELINE_REGION_POLYGONS[currentRegion].points || [])];
          REGION_POLYGONS[currentRegion].labelPosition = [...(BASELINE_REGION_POLYGONS[currentRegion].labelPosition || [])];
        } else if (REGION_POLYGONS[currentRegion]) {
          REGION_POLYGONS[currentRegion].points = [];
        }
        if (SUBREGIONS[currentRegion]) {
          SUBREGIONS[currentRegion].points = [];
        }

        // Update localStorage
        try {
          localStorage.setItem('mythrill_region_polygons', JSON.stringify(REGION_POLYGONS));
        } catch (e) {}

        setDrawingPoints([]);
        if (onUpdate) onUpdate();
      }
    );
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCompleteBoundary = () => {
    if (drawingPoints.length >= 3 && currentRegion) {
      const target = REGION_POLYGONS[currentRegion] || SUBREGIONS[currentRegion];
      const targetName = target?.name || currentRegion;
      showConfirm(
        `Are you sure you want to complete and save boundaries for "${targetName}"?`,
        () => {
          const cx = Math.round(drawingPoints.reduce((s, p) => s + p[0], 0) / drawingPoints.length);
          const cy = Math.round(drawingPoints.reduce((s, p) => s + p[1], 0) / drawingPoints.length);
          if (REGION_POLYGONS[currentRegion]) {
            REGION_POLYGONS[currentRegion].points = [...drawingPoints];
            REGION_POLYGONS[currentRegion].labelPosition = [cx, cy];
          } else if (SUBREGIONS[currentRegion]) {
            SUBREGIONS[currentRegion].points = [...drawingPoints];
            SUBREGIONS[currentRegion].labelPosition = [cx, cy];
          }
          setDrawingPoints([]);
          if (onUpdate) onUpdate();
        }
      );
    }
  };

  const handleUploadImageFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/webp';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const base64 = evt.target.result;
        const target = REGION_POLYGONS[currentRegion] || SUBREGIONS[currentRegion];
        const mapName = target?.name || currentRegion;
        const mapData = {
          id: currentRegion,
          name: `${mapName} Regional Map`,
          regionId: currentRegion,
          mapType: 'subregion',
          image: base64,
          description: `Custom uploaded map asset for ${mapName}.`,
          width: 4096,
          height: 3072,
          subregions: []
        };
        await saveCustomMap(mapData);
        if (onUpdate) onUpdate();
        showToast(`Successfully uploaded custom subregion map for "${mapName}"!`);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleCopyJsSnippet = () => {
    if (!currentRegion) return;
    const reg = REGION_POLYGONS[currentRegion] || SUBREGIONS[currentRegion];
    if (!reg) return;
    const pts = (drawingPoints && drawingPoints.length >= 3 ? drawingPoints : reg.points || []);
    const ptsStr = pts.map(p => `[${p[0]}, ${p[1]}]`).join(', ');
    const cx = pts.length > 0 ? Math.round(pts.reduce((s, p) => s + p[0], 0) / pts.length) : (reg.labelPosition?.[0] || 0);
    const cy = pts.length > 0 ? Math.round(pts.reduce((s, p) => s + p[1], 0) / pts.length) : (reg.labelPosition?.[1] || 0);
    const jsSnippet = `'${reg.id}': {\n id: '${reg.id}',\n name: '${reg.name}',\n points: [${ptsStr}],\n color: '${reg.color || 'rgba(70, 150, 220, 0.18)'}',\n glowColor: '${reg.glowColor || 'rgba(120, 200, 255, 0.75)'}',\n labelPosition: [${cx}, ${cy}]\n}`;
    navigator.clipboard.writeText(jsSnippet);
    setCopiedType('jsSnippet');
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <>
      <div className={`dev-editor-card ${isMinimized ? 'minimized' : ''}`}>
        {isMinimized ? (
          <button className="dev-card-expand-btn" onClick={() => setIsMinimized(false)}>
            <i className="fas fa-compass"></i> <span>GM Cartography Tools</span>
          </button>
        ) : (
          <>
            <div className="dev-card-header">
              <div className="dev-card-title">
                <i className="fas fa-feather-alt"></i>
                <span>GM Cartography &amp; World Editor</span>
              </div>
              <button className="dev-card-minimize-btn" onClick={() => setIsMinimized(true)} title="Minimize panel">
                <i className="fas fa-minus"></i>
              </button>
            </div>

            {/* Editor Mode Tabs */}
            <div className="dev-card-tabs">
              <button
                className={`dev-tab-btn ${devTool === 'drawRegion' ? 'active' : ''}`}
                onClick={() => setDevTool('drawRegion')}
              >
                <i className="fas fa-draw-polygon"></i> Draw Boundary
              </button>
              <button
                className={`dev-tab-btn ${devTool === 'placePin' ? 'active' : ''}`}
                onClick={() => setDevTool('placePin')}
              >
                <i className="fas fa-map-pin"></i> Place Pin
              </button>
              <button
                className={`dev-tab-btn ${devTool === 'movePin' ? 'active' : ''}`}
                onClick={() => setDevTool('movePin')}
              >
                <i className="fas fa-arrows-up-down-left-right"></i> Move
              </button>
              <button
                className={`dev-tab-btn ${devTool === 'erasePin' ? 'active' : ''}`}
                onClick={() => setDevTool('erasePin')}
              >
                <i className="fas fa-eraser"></i> Erase
              </button>
            </div>

            {/* Step-by-step Cartography Workflow when drawing boundaries */}
            {devTool === 'drawRegion' && (
              <div className="dev-card-workflow animate-fade-in">
                {/* Step 1 */}
                <div className="workflow-step">
                  <span className="step-num">Step 1</span>
                  <span className="step-label">Select Continent &amp; Subregion Target:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#8b2626', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        1. Realm / Continent:
                      </span>
                      <CustomSelect
                        value={selectedParentRegion}
                        onChange={(newParentId) => {
                          setSelectedParentRegion(newParentId);
                          setCurrentRegion(newParentId);
                        }}
                        options={MAIN_REGION_OPTIONS}
                        placeholder="Select Continent..."
                        width="100%"
                      />
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#8b2626', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        2. Target Subregion / Zone:
                      </span>
                      <CustomSelect
                        value={currentRegion}
                        onChange={setCurrentRegion}
                        options={SUBREGION_OPTIONS}
                        placeholder="Select Subregion..."
                        width="100%"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="workflow-step">
                  <span className="step-num">Step 2</span>
                  <span className="step-label">Click Map Image to Outline Boundary:</span>
                  <div className="step-actions">
                    <button
                      className="dev-tool-btn secondary"
                      onClick={() => setDrawingPoints([])}
                      disabled={!drawingPoints || drawingPoints.length === 0}
                    >
                      <i className="fas fa-undo" /> Clear ({drawingPoints?.length || 0} pts)
                    </button>
                    <button
                      className="dev-tool-btn secondary"
                      onClick={() => { if (drawingPoints.length > 0) setDrawingPoints(drawingPoints.slice(0, -1)); }}
                      disabled={!drawingPoints || drawingPoints.length === 0}
                    >
                      <i className="fas fa-step-backward" /> Undo Point
                    </button>
                    <button
                      className="dev-tool-btn primary"
                      onClick={handleCompleteBoundary}
                      disabled={!drawingPoints || drawingPoints.length < 3 || !currentRegion}
                    >
                      <i className="fas fa-check" /> Complete Boundary
                    </button>
                    <button
                      className="dev-tool-btn danger"
                      onClick={handleResetSingleRegion}
                      disabled={!currentRegion}
                      title="Reset this region's boundaries back to original code defaults"
                    >
                      <i className="fas fa-rotate-left" /> Reset Code Default
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="workflow-step">
                  <span className="step-num">Step 3</span>
                  <span className="step-label">Attach Subregion Map Asset &amp; Code:</span>
                  <div className="step-actions">
                    <button
                      className="dev-tool-btn secondary"
                      onClick={handleUploadImageFile}
                      disabled={!currentRegion}
                    >
                      <i className="fas fa-image" /> Upload Subregion Map
                    </button>
                    <button
                      className="dev-tool-btn secondary"
                      onClick={handleCopyJsSnippet}
                      disabled={!currentRegion}
                    >
                      <i className="fas fa-code" /> {copiedType === 'jsSnippet' ? 'Copied JS!' : 'Copy JS Code'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Place Pin Mode */}
            {devTool === 'placePin' && (
              <div className="dev-card-workflow animate-fade-in">
                <div className="workflow-step">
                  <span className="step-label">Pin Category &amp; Icon:</span>
                  <CustomPinTypePicker
                    value={selectedPinType}
                    onChange={setSelectedPinType}
                    options={PIN_TYPE_OPTIONS}
                  />
                </div>
                <div className="workflow-step">
                  <span className="step-label">Data Source:</span>
                  <CustomSelect
                    value={pinSourceType}
                    onChange={setPinSourceType}
                    options={[
                      { id: 'world', label: 'World Lore' },
                      ...(currentCampaign ? [
                        { id: 'campaignLocation', label: 'Campaign Location' },
                        { id: 'campaignLore', label: 'Campaign Lore' }
                      ] : []),
                      { id: 'custom', label: 'Custom Pin' }
                    ]}
                    placeholder="Select source..."
                    width="100%"
                  />
                </div>
              </div>
            )}

            {/* Footer Quick Actions */}
            <div className="dev-footer-actions">
              <button className="dev-tool-btn danger" onClick={handleClearAllPresetData} title="Clear preset data">
                <i className="fas fa-trash-can"></i> Clear Map
              </button>
              <button className="dev-tool-btn export" onClick={handleExport} title="Copy coordinate changes">
                <i className="fas fa-code"></i> Export {changeCount > 0 ? `(${changeCount})` : ''}
              </button>
            </div>
          </>
        )}
      </div>

      {exportModalOpen && (
        <div className="dev-modal-overlay" onClick={() => setExportModalOpen(false)}>
          <div className="dev-modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="dev-modal-header">
              <h3><i className="fas fa-file-export"></i> Export Coordinates</h3>
              <button className="dev-modal-close" onClick={() => setExportModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="dev-modal-body">
              {/* Format toggle */}
              <div className="export-format-toggle">
                <button
                  className={`export-format-btn ${exportFormat === 'code' ? 'active' : ''}`}
                  onClick={() => { setExportFormat('code'); setTimeout(handleExport, 0); }}
                >
                  <i className="fas fa-code"></i> JS Code (full dump)
                </button>
                <button
                  className={`export-format-btn ${exportFormat === 'agent' ? 'active' : ''}`}
                  onClick={() => { setExportFormat('agent'); setTimeout(handleExport, 0); }}
                >
                  <i className="fas fa-robot"></i> Agent Diff
                  {changeCount > 0 && <span className="export-diff-count">{changeCount}</span>}
                </button>
              </div>

              {exportFormat === 'agent' && (
                <div className={`export-summary ${changeCount === 0 ? 'clean' : 'dirty'}`}>
                  {changeCount === 0 ? (
                    <><i className="fas fa-circle-check"></i> Live map matches the committed file: nothing to sync.</>
                  ) : (
                    <>
                      <i className="fas fa-pen-to-square"></i>
                      <span><strong>{locDiff.moved.length}</strong> moved · <strong>{locDiff.added.length}</strong> added · <strong>{locDiff.removed.length}</strong> removed · <strong>{regDiff.length}</strong> regions</span>
                    </>
                  )}
                </div>
              )}

              <div className="export-section">
                <div className="export-section-header">
                  <h4>{exportFormat === 'agent' ? 'Region Boundaries (Agent)' : 'regionPolygons.js'}</h4>
                  <button 
                    className="dev-tool-btn secondary mini-btn"
                    onClick={() => handleCopy(exportData.regions, 'regions')}
                  >
                    {copiedType === 'regions' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                  </button>
                </div>
                <textarea 
                  className="export-textarea" 
                  value={exportData.regions} 
                  readOnly 
                  onClick={e => e.target.select()}
                />
              </div>

              <div className="export-section">
                <div className="export-section-header">
                  <h4>{exportFormat === 'agent' ? 'Location Pins (Agent)' : 'locationCoordinates.js'}</h4>
                  <button 
                    className="dev-tool-btn secondary mini-btn"
                    onClick={() => handleCopy(exportData.locations, 'locations')}
                  >
                    {copiedType === 'locations' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                  </button>
                </div>
                <textarea 
                  className="export-textarea" 
                  value={exportData.locations} 
                  readOnly 
                  onClick={e => e.target.select()}
                />
              </div>
            </div>
            <div className="dev-modal-footer" style={{ justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="dev-tool-btn danger" onClick={handleClearAllPresetData} title="Clear all preset pins & regions to draw from scratch">
                  <i className="fas fa-trash-can"></i> Clear All Pins & Regions
                </button>
                <button className="dev-tool-btn" onClick={handleResetToDefaults} title="Restore original canonical baseline data">
                  <i className="fas fa-rotate-left"></i> Restore Defaults
                </button>
              </div>
              <button className="dev-tool-btn primary" onClick={() => setExportModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move-tool inspector: precise coordinate editing for the selected pin */}
      {devTool === 'movePin' && (
        <div className="dev-move-inspector animate-fade-in-up">
          {selectedDevPinId && selectedPin ? (
            <>
              <div className="dev-inspector-head">
                <i className="fas fa-arrows-up-down-left-right dev-inspector-grip" />
                <div className="dev-inspector-title">
                  <span className="dev-inspector-name">{selectedPinZone?.name || selectedDevPinId}</span>
                  <span className="dev-inspector-region">{selectedRegionName}</span>
                </div>
                <button
                  className="dev-inspector-close"
                  onClick={() => setSelectedDevPinId(null)}
                  title="Deselect pin"
                  aria-label="Deselect pin"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="dev-inspector-coords">
                <label className="dev-coord-field">
                  <span className="dev-coord-label">X</span>
                  <input
                    type="number"
                    data-coord-axis="x"
                    value={draftX}
                    onChange={(e) => commitCoord('x', e.target.value)}
                    min={0}
                    max={MAP_WIDTH}
                  />
                </label>
                <label className="dev-coord-field">
                  <span className="dev-coord-label">Y</span>
                  <input
                    type="number"
                    data-coord-axis="y"
                    value={draftY}
                    onChange={(e) => commitCoord('y', e.target.value)}
                    min={0}
                    max={MAP_HEIGHT}
                  />
                </label>
              </div>
              <div className="dev-inspector-hint">
                <i className="fas fa-keyboard" />
                <span>Arrow keys nudge 1px · <kbd>Shift</kbd>+arrows 10px · drag to move</span>
              </div>
            </>
          ) : (
            <div className="dev-inspector-empty">
              <i className="fas fa-hand-pointer" />
              <span>Click a pin on the map to select &amp; move it</span>
            </div>
          )}
        </div>
      )}

      {toastMessage && (
        <div className="dev-parchment-toast animate-fade-in-up">
          <i className="fas fa-scroll toast-icon" />
          <span>{toastMessage}</span>
          <button className="toast-close-btn" onClick={() => setToastMessage(null)}>
            <i className="fas fa-times" />
          </button>
        </div>
      )}
    </>
  );
};

export default DevEditor;
