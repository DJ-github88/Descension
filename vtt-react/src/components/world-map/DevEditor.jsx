import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { REGION_POLYGONS, BASELINE_REGION_POLYGONS } from '../../data/regionPolygons';
import { LOCATION_COORDINATES, BASELINE_LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { PIN_TYPE_OPTIONS } from './mapPinIcons';
import PIN_ICONS from './mapPinIcons';
import { SUBREGIONS } from '../../data/subregions';
import { ZONE_DATA } from '../../data/zoneData';
import { DEEP_LOCATIONS } from '../../data/deepLocationData';
import { saveCustomMap, resolveBoundaryTarget, BUILTIN_SUBREGION_MAPS } from '../../data/subregionMaps';
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
  return (
    <div className="custom-pin-type-picker-inline">
      <div className="custom-pin-type-grid">
        {options.map((pt) => {
          const icon = PIN_ICONS[pt.id];
          const isActive = pt.id === value;
          return (
            <button
              key={pt.id}
              type="button"
              className={`custom-pin-type-cell ${isActive ? 'active' : ''}`}
              onClick={() => onChange(pt.id)}
              title={pt.label}
            >
              {icon && (
                <svg viewBox={icon.viewBox} width="16" height="16">
                  <path d={icon.path} fill={isActive ? '#ffe082' : '#ebd5a3'} />
                </svg>
              )}
              <span className="picker-cell-label">{pt.label.split('/')[0]}</span>
            </button>
          );
        })}
      </div>
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
  setSelectedLocationId,
  setSidebarOpen,
  onDeletePin,
  updateTrigger,
  setDevMode,
  activeMapId
}) => {

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState({ regions: '', locations: '' });
  const [copiedType, setCopiedType] = useState(null);
  const [exportFormat, setExportFormat] = useState('agent');

  // Search & filter state for linking World Lore locations in Place Pin mode
  const [loreSearchTerm, setLoreSearchTerm] = useState('');
  const [loreRegionFilter, setLoreRegionFilter] = useState('all');

  // Inspector draft coordinates for the currently selected dev pin.
  const [draftX, setDraftX] = useState('');
  const [draftY, setDraftY] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedParentRegion, setSelectedParentRegion] = useState(
    REGION_POLYGONS[currentRegion]?.id || SUBREGIONS[currentRegion]?.regionId || 'nordhalla'
  );
  const [toastMessage, setToastMessage] = useState(null);

  // Custom subregion creation
  const [showAddSubregion, setShowAddSubregion] = useState(false);
  const [newSubregionName, setNewSubregionName] = useState('');
  const [newSubregionDescription, setNewSubregionDescription] = useState('');
  const [newSubregionClimate, setNewSubregionClimate] = useState('');
  const [newSubregionTerrain, setNewSubregionTerrain] = useState('');

  // Undo / Redo Action History Stack
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const saveSnapshot = useCallback((actionName = 'Edit') => {
    const coordsSnapshot = JSON.parse(JSON.stringify(LOCATION_COORDINATES));
    const pointsSnapshot = [...(drawingPoints || [])];
    setHistoryStack(prev => [...prev, { name: actionName, coords: coordsSnapshot, points: pointsSnapshot }]);
    setRedoStack([]);
  }, [drawingPoints]);

  const handleUndo = useCallback(() => {
    if (historyStack.length === 0) return;
    const last = historyStack[historyStack.length - 1];
    const currentCoords = JSON.parse(JSON.stringify(LOCATION_COORDINATES));
    const currentPoints = [...(drawingPoints || [])];

    setRedoStack(prev => [...prev, { name: 'Revert', coords: currentCoords, points: currentPoints }]);
    setHistoryStack(prev => prev.slice(0, -1));

    Object.keys(LOCATION_COORDINATES).forEach(k => delete LOCATION_COORDINATES[k]);
    Object.assign(LOCATION_COORDINATES, last.coords);

    if (setDrawingPoints) setDrawingPoints(last.points);
    if (onUpdate) onUpdate();
    showToast(`Undid action: ${last.name}`);
  }, [historyStack, drawingPoints, setDrawingPoints, onUpdate]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    const currentCoords = JSON.parse(JSON.stringify(LOCATION_COORDINATES));
    const currentPoints = [...(drawingPoints || [])];

    setHistoryStack(prev => [...prev, { name: 'Redo', coords: currentCoords, points: currentPoints }]);
    setRedoStack(prev => prev.slice(0, -1));

    Object.keys(LOCATION_COORDINATES).forEach(k => delete LOCATION_COORDINATES[k]);
    Object.assign(LOCATION_COORDINATES, next.coords);

    if (setDrawingPoints) setDrawingPoints(next.points);
    if (onUpdate) onUpdate();
    showToast(`Redid action`);
  }, [redoStack, drawingPoints, setDrawingPoints, onUpdate]);

  useEffect(() => {
    if (!devMode) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [devMode, handleUndo, handleRedo]);

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

  const campaignLocations = currentCampaign?.campaignData?.locations || [];
  const campaignLoreArticles = currentCampaign?.campaignData?.homebrew?.lore || [];

  const MAIN_REGION_OPTIONS = useMemo(() => Object.values(REGION_POLYGONS).map(r => ({
    id: r.id,
    name: r.name
  })), []);

  const activeParentObj = REGION_POLYGONS[selectedParentRegion];
  const subregionsForActiveParent = Object.values(SUBREGIONS).filter(s => s.regionId === selectedParentRegion);

  const SUBREGION_OPTIONS = useMemo(() => [
    ...(activeParentObj ? [{ id: activeParentObj.id, name: `[Whole Region] ${activeParentObj.name}` }] : []),
    ...subregionsForActiveParent.map(s => ({ id: s.id, name: s.name }))
  ], [activeParentObj, subregionsForActiveParent]);

  const regionZones = useMemo(() => (currentRegion ? ZONE_DATA.filter(z => z.regionId === currentRegion) : ZONE_DATA).map(z => {
    const regionName = REGION_POLYGONS[z.regionId]?.name || z.regionId;
    const isPlaced = !!LOCATION_COORDINATES[z.id];
    return {
      ...z,
      name: `${z.name}: ${regionName}`,
      badge: isPlaced ? null : 'not placed'
    };
  }), [currentRegion]);

  const mapZoneTypeToPinType = useCallback((type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('city') || t.includes('capital')) return 'city';
    if (t.includes('fortress') || t.includes('stronghold') || t.includes('watchtower') || t.includes('keep')) return 'fortress';
    if (t.includes('port') || t.includes('harbor') || t.includes('coastal')) return 'harbor';
    if (t.includes('archive') || t.includes('temple') || t.includes('shrine') || t.includes('sacred')) return 'shrine';
    if (t.includes('ruin')) return 'ruin';
    if (t.includes('tomb')) return 'tomb';
    if (t.includes('camp')) return 'camp';
    if (t.includes('mine') || t.includes('forge') || t.includes('industrial') || t.includes('sump')) return 'tower';
    if (t.includes('mountain') || t.includes('peak') || t.includes('col')) return 'mountain';
    if (t.includes('forest') || t.includes('grove')) return 'forest';
    if (t.includes('cave') || t.includes('dungeon')) return 'cave';
    if (t.includes('settlement') || t.includes('town') || t.includes('village')) return 'settlement';
    return 'poi';
  }, []);

  const filteredWorldZones = useMemo(() => {
    const term = loreSearchTerm.trim().toLowerCase();
    return ZONE_DATA.filter((z) => {
      if (loreRegionFilter !== 'all') {
        if (z.regionId !== loreRegionFilter && z.subregionId !== loreRegionFilter) return false;
      }
      if (term) {
        return `${z.name} ${z.id} ${z.type} ${z.regionId} ${z.subregionId || ''}`.toLowerCase().includes(term);
      }
      return true;
    });
  }, [loreSearchTerm, loreRegionFilter]);

  const activePlacementTarget = useMemo(() => {
    if (devTool !== 'placePin') return null;
    if (pinSourceType === 'world' && selectedZoneId) {
      const z = ZONE_DATA.find((item) => item.id === selectedZoneId);
      return z ? { name: z.name, sub: `${z.type} • ${z.regionId}` } : null;
    }
    if (pinSourceType === 'campaignLocation' && selectedCampaignLocId) {
      const cl = campaignLocations.find((l) => String(l.id) === String(selectedCampaignLocId));
      return cl ? { name: cl.name, sub: 'Campaign Location' } : null;
    }
    if (pinSourceType === 'campaignLore' && selectedCampaignLoreId) {
      const cl = campaignLoreArticles.find((l) => String(l.id) === String(selectedCampaignLoreId));
      return cl ? { name: cl.title, sub: 'Campaign Lore' } : null;
    }
    if (pinSourceType === 'custom' && customPinName.trim()) {
      return { name: customPinName, sub: 'Custom Marker' };
    }
    return null;
  }, [devTool, pinSourceType, selectedZoneId, selectedCampaignLocId, selectedCampaignLoreId, customPinName, campaignLocations, campaignLoreArticles]);

  if (!devMode) return null;

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

        // Regional-space polygons (drawn while viewing a regional map) get cleared too
        if (activeMapId && activeMapId !== 'mythril') {
          const regEntry = BUILTIN_SUBREGION_MAPS[activeMapId];
          if (regEntry && Array.isArray(regEntry.subregions)) {
            const sub = regEntry.subregions.find(s => s.id === currentRegion);
            if (sub) {
              sub.points = [];
              sub.labelPosition = [0, 0];
            }
            try {
              localStorage.setItem(`mythrill_regional_polygons_${activeMapId}`, JSON.stringify(regEntry.subregions));
            } catch (e) {}
          }
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

  const handleAddSubregion = () => {
    const name = newSubregionName.trim();
    if (!name) {
      showToast('Please enter a name for the new subregion.');
      return;
    }
    const parentId = selectedParentRegion;
    if (!REGION_POLYGONS[parentId]) {
      showToast('Please select a valid continent first.');
      return;
    }
    // Build a hyphenated id from the name, namespaced under the parent region
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const baseId = `${parentId}-${slug}`;
    let id = baseId;
    let n = 2;
    while (SUBREGIONS[id]) {
      id = `${baseId}-${n}`;
      n += 1;
    }

    SUBREGIONS[id] = {
      id,
      name,
      regionId: parentId,
      description: newSubregionDescription.trim() || `Custom subregion of ${REGION_POLYGONS[parentId]?.name || parentId}.`,
      climate: newSubregionClimate.trim() || '',
      dominantTerrain: newSubregionTerrain.trim() || '',
      primaryRaces: [],
      primaryFactions: [],
      zoneIds: [],
      points: [],
      labelPosition: []
    };

    try {
      localStorage.setItem('mythrill_subregion_polygons', JSON.stringify(SUBREGIONS));
    } catch (e) {}

    setCurrentRegion(id);
    setShowAddSubregion(false);
    setNewSubregionName('');
    setNewSubregionDescription('');
    setNewSubregionClimate('');
    setNewSubregionTerrain('');
    if (onUpdate) onUpdate();
    showToast(`Custom subregion "${name}" created. Now draw its boundary on the map.`);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCompleteBoundary = () => {
    if (drawingPoints.length >= 3 && currentRegion) {
      const { target } = resolveBoundaryTarget(currentRegion, activeMapId);
      const targetName = target?.name || (SUBREGIONS[currentRegion]?.name || REGION_POLYGONS[currentRegion]?.name) || currentRegion;
      showConfirm(
        `Are you sure you want to complete and save boundaries for "${targetName}"?`,
        () => {
          const cx = Math.round(drawingPoints.reduce((s, p) => s + p[0], 0) / drawingPoints.length);
          const cy = Math.round(drawingPoints.reduce((s, p) => s + p[1], 0) / drawingPoints.length);
          if (target) {
            target.points = [...drawingPoints];
            target.labelPosition = [cx, cy];
            if (activeMapId && activeMapId !== 'mythril') {
              try {
                localStorage.setItem(`mythrill_regional_polygons_${activeMapId}`, JSON.stringify(BUILTIN_SUBREGION_MAPS?.[activeMapId]?.subregions || []));
              } catch (e) {}
            }
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
          <div className="dev-minimized-bar">
            <button className="dev-card-expand-btn" onClick={() => setIsMinimized(false)}>
              <i className="fas fa-compass"></i> <span>GM Cartography Tools</span>
            </button>
            {setDevMode && (
              <button
                className="dev-card-close-editor-btn mini"
                onClick={() => setDevMode(false)}
                title="Close &amp; Exit GM Cartography Editor Mode"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="dev-card-header">
              <div className="dev-card-title">
                <i className="fas fa-feather-alt"></i>
                <span>GM Cartography Editor</span>
              </div>
              <div className="dev-header-actions">
                <button
                  className="dev-undo-btn"
                  onClick={handleUndo}
                  disabled={historyStack.length === 0}
                  title="Undo last map edit (Ctrl+Z)"
                >
                  <i className="fas fa-rotate-left"></i> Undo ({historyStack.length})
                </button>
                <button
                  className="dev-undo-btn"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  title="Redo map edit (Ctrl+Y)"
                >
                  <i className="fas fa-rotate-right"></i> Redo ({redoStack.length})
                </button>
                <button className="dev-card-minimize-btn" onClick={() => setIsMinimized(true)} title="Minimize panel">
                  <i className="fas fa-minus"></i>
                </button>
                {setDevMode && (
                  <button
                    className="dev-card-close-editor-btn"
                    onClick={() => setDevMode(false)}
                    title="Close &amp; Exit GM Cartography Editor Mode"
                  >
                    <i className="fas fa-times"></i> Exit
                  </button>
                )}
              </div>
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

            {/* Scrollable Workflow Body */}
            <div className="dev-card-scrollable-body">
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
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <CustomSelect
                            value={currentRegion}
                            onChange={setCurrentRegion}
                            options={SUBREGION_OPTIONS}
                            placeholder="Select Subregion..."
                            width="100%"
                          />
                          <button
                            type="button"
                            className="dev-tool-btn secondary"
                            style={{ flexShrink: 0, padding: '6px 10px' }}
                            onClick={() => setShowAddSubregion(s => !s)}
                            title="Create a new custom subregion"
                          >
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                        {showAddSubregion && (
                          <div className="animate-fade-in" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '8px', background: 'rgba(0,0,0,0.18)', borderRadius: '6px' }}>
                            <input
                              className="dev-input"
                              placeholder="Subregion name (e.g. Dragonspine Vale)"
                              value={newSubregionName}
                              onChange={(e) => setNewSubregionName(e.target.value)}
                            />
                            <input
                              className="dev-input"
                              placeholder="Description (optional)"
                              value={newSubregionDescription}
                              onChange={(e) => setNewSubregionDescription(e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input
                                className="dev-input"
                                placeholder="Climate (optional)"
                                value={newSubregionClimate}
                                onChange={(e) => setNewSubregionClimate(e.target.value)}
                                style={{ flex: 1 }}
                              />
                              <input
                                className="dev-input"
                                placeholder="Terrain (optional)"
                                value={newSubregionTerrain}
                                onChange={(e) => setNewSubregionTerrain(e.target.value)}
                                style={{ flex: 1 }}
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="dev-tool-btn primary"
                                style={{ flex: 1 }}
                                onClick={handleAddSubregion}
                              >
                                <i className="fas fa-check" /> Create
                              </button>
                              <button
                                type="button"
                                className="dev-tool-btn secondary"
                                onClick={() => setShowAddSubregion(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
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
                  {/* Step 1: Data Source Selection */}
                  <div className="workflow-step">
                    <span className="step-num">Step 1</span>
                    <span className="step-label">Select Lore Data Source:</span>
                    <CustomSelect
                      value={pinSourceType}
                      onChange={(newSource) => {
                        setPinSourceType(newSource);
                      }}
                      options={[
                        { id: 'world', label: 'World Lore (Canonical POIs)' },
                        ...(currentCampaign ? [
                          { id: 'campaignLocation', label: 'Campaign Custom Location' },
                          { id: 'campaignLore', label: 'Campaign Lore Article' }
                        ] : []),
                        { id: 'custom', label: 'New Custom Marker' }
                      ]}
                      placeholder="Select source..."
                      width="100%"
                    />
                  </div>

                  {/* Step 2: Target Lore Location Selector */}
                  {pinSourceType === 'world' && (
                    <div className="workflow-step lore-target-step">
                      <span className="step-num">Step 2</span>
                      <span className="step-label">Link to World Lore Location:</span>
                      
                      {/* Search & Filter bar */}
                      <div className="lore-selector-controls">
                        <div className="lore-search-input-wrap">
                          <i className="fas fa-search search-icon" />
                          <input
                            type="text"
                            className="dev-input lore-search-field"
                            placeholder="Search lore locations (e.g. Hvalhavn)..."
                            value={loreSearchTerm}
                            onChange={(e) => setLoreSearchTerm(e.target.value)}
                          />
                          {loreSearchTerm && (
                            <button className="clear-search-btn" onClick={() => setLoreSearchTerm('')}>
                              <i className="fas fa-times" />
                            </button>
                          )}
                        </div>
                        
                        <div className="lore-region-filter-wrap">
                          <select
                            className="dev-native-select"
                            value={loreRegionFilter}
                            onChange={(e) => setLoreRegionFilter(e.target.value)}
                          >
                            <option value="all">All Regions &amp; Subrealms</option>
                            <option value="nordhalla">Nordhalla (All)</option>
                            <option value="nordhalla-glacier-heart">  ↳ Rime-Spire Peaks</option>
                            <option value="nordhalla-fjord-coast">  ↳ Skaldfjord Dal</option>
                            <option value="nordhalla-frostfang-wastes">  ↳ Frostfang Wastes</option>
                            <option value="frostwood-reach">Frostwood Reach</option>
                            <option value="sundale">Sundale</option>
                            <option value="bryngloom-forest">Bryngloom Forest</option>
                            <option value="cragjaw-peaks">Cragjaw Peaks</option>
                            <option value="iceheart-sea">Iceheart Sea</option>
                            <option value="sundrift-vale">Sundrift Vale</option>
                          </select>
                        </div>
                      </div>

                      {/* Zone options list */}
                      <div className="lore-location-picker-list">
                        {filteredWorldZones.length === 0 ? (
                          <div className="empty-picker-notice">
                            <i className="fas fa-search-minus" /> No matching lore locations found.
                          </div>
                        ) : (
                          filteredWorldZones.map((z, zIdx) => {
                            const isSelected = selectedZoneId === z.id;
                            const isPlaced = !!LOCATION_COORDINATES[z.id];
                            const hasDeep = !!DEEP_LOCATIONS[z.id];
                            const coord = LOCATION_COORDINATES[z.id];
                            return (
                              <button
                                key={`${z.id}-${zIdx}`}
                                type="button"
                                className={`lore-picker-item ${isSelected ? 'active' : ''} ${isPlaced ? 'placed' : 'unplaced'}`}
                                onClick={() => {
                                  setSelectedZoneId(z.id);
                                  const suggested = mapZoneTypeToPinType(z.type);
                                  setSelectedPinType(suggested);
                                }}
                              >
                                <div className="picker-item-main">
                                  <span className="picker-item-title">{z.name}</span>
                                  <span className="picker-item-type">{z.type}</span>
                                </div>
                                <div className="picker-item-badges">
                                  {hasDeep && (
                                    <span className="badge-deep" title="Deep Lore Profile Available">
                                      <i className="fas fa-gem" /> Deep
                                    </span>
                                  )}
                                  {isPlaced ? (
                                    <div className="badge-placed-wrap">
                                      <span className="badge-placed" title={`Placed on map at (${coord.x}, ${coord.y})`}>
                                        <i className="fas fa-map-pin" /> Placed ({coord.x},{coord.y})
                                      </span>
                                      <button
                                        type="button"
                                        className="badge-unplace-btn"
                                        title={`Remove pin placement for ${z.name}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          saveSnapshot(`Unplace ${z.name}`);
                                          delete LOCATION_COORDINATES[z.id];
                                          if (selectedDevPinId === z.id) setSelectedDevPinId(null);
                                          if (onUpdate) onUpdate();
                                          showToast(`Unplaced "${z.name}" from map`);
                                        }}
                                      >
                                        <i className="fas fa-times" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="badge-unplaced" title="Not placed yet - click map to drop pin">
                                      <i className="fas fa-sparkles" /> Unplaced
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {pinSourceType === 'campaignLocation' && (
                    <div className="workflow-step">
                      <span className="step-num">Step 2</span>
                      <span className="step-label">Select Campaign Location:</span>
                      <CustomSelect
                        value={selectedCampaignLocId}
                        onChange={setSelectedCampaignLocId}
                        options={campaignLocations.map(l => ({
                          id: String(l.id),
                          name: l.name,
                          badge: LOCATION_COORDINATES[`campaign-loc-${l.id}`] ? 'Placed' : 'Unplaced'
                        }))}
                        placeholder="Select Campaign Location..."
                        width="100%"
                      />
                    </div>
                  )}

                  {pinSourceType === 'campaignLore' && (
                    <div className="workflow-step">
                      <span className="step-num">Step 2</span>
                      <span className="step-label">Select Campaign Lore Article:</span>
                      <CustomSelect
                        value={selectedCampaignLoreId}
                        onChange={setSelectedCampaignLoreId}
                        options={campaignLoreArticles.map(l => ({
                          id: String(l.id),
                          name: l.title,
                          badge: LOCATION_COORDINATES[`campaign-lore-${l.id}`] ? 'Placed' : 'Unplaced'
                        }))}
                        placeholder="Select Campaign Lore Article..."
                        width="100%"
                      />
                    </div>
                  )}

                  {pinSourceType === 'custom' && (
                    <div className="workflow-step custom-pin-inputs">
                      <span className="step-num">Step 2</span>
                      <span className="step-label">Configure Custom Marker Details:</span>
                      <input
                        type="text"
                        className="dev-input"
                        placeholder="Marker Title (e.g. Ancient Dragon Barrow)..."
                        value={customPinName}
                        onChange={(e) => setCustomPinName(e.target.value)}
                      />
                      <textarea
                        className="dev-textarea"
                        placeholder="Marker Notes &amp; Lore Description..."
                        value={customPinDesc}
                        onChange={(e) => setCustomPinDesc(e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Step 3: Pin Category & Icon Picker */}
                  <div className="workflow-step">
                    <span className="step-num">Step 3</span>
                    <span className="step-label">Pin Category &amp; Icon:</span>
                    <CustomPinTypePicker
                      value={selectedPinType}
                      onChange={setSelectedPinType}
                      options={PIN_TYPE_OPTIONS}
                    />
                  </div>

                  {/* Placement Guidance Banner */}
                  {activePlacementTarget && (
                    <div className="dev-placement-guidance animate-fade-in">
                      <i className="fas fa-crosshairs guidance-icon" />
                      <div className="guidance-text">
                        <span className="guidance-title">Target Ready to Place</span>
                        <span className="guidance-target">
                          <strong>{activePlacementTarget.name}</strong> ({activePlacementTarget.sub})
                        </span>
                        <span className="guidance-instruction">
                          Click anywhere on the map image to drop this pin
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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

      {/* Dev Pin Inspector: precise coordinate editing, lore sidebar linking, and pin management */}
      {(devTool === 'movePin' || devTool === 'placePin') && (
        <div className="dev-move-inspector animate-fade-in-up">
          {selectedDevPinId && selectedPin ? (
            <>
              <div className="dev-inspector-head">
                <i className="fas fa-map-pin dev-inspector-grip" />
                <div className="dev-inspector-title">
                  <span className="dev-inspector-name">{selectedPinZone?.name || selectedPin.name || selectedDevPinId}</span>
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

              {/* Icon Type Switcher */}
              <div className="dev-inspector-icon-picker">
                <span className="dev-coord-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.72rem' }}>
                  Pin Icon Category:
                </span>
                <div className="dev-icon-grid" style={{ maxHeight: '100px' }}>
                  {PIN_TYPE_OPTIONS.map((pt) => {
                    const iconObj = PIN_ICONS[pt.id];
                    const isActive = (selectedPin.pinType || 'custom') === pt.id;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        className={`dev-icon-cell ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          saveSnapshot(`Change icon to ${pt.label}`);
                          selectedPin.pinType = pt.id;
                          if (onUpdate) onUpdate();
                        }}
                        title={`Change icon to ${pt.label}`}
                      >
                        {iconObj && (
                          <svg viewBox={iconObj.viewBox} width="14" height="14">
                            <path d={iconObj.path} fill={isActive ? '#ffe082' : '#ebd5a3'} />
                          </svg>
                        )}
                        <span className="dev-icon-cell-label">{pt.label.split('/')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="dev-inspector-actions">
                {setSelectedLocationId && setSidebarOpen && (
                  <button
                    className="dev-inspector-btn lore-btn"
                    onClick={() => {
                      setSelectedLocationId(selectedDevPinId);
                      setSidebarOpen(true);
                    }}
                    title="Open Immersion Sidebar for this location"
                  >
                    <i className="fas fa-book-open" /> Open Lore Sidebar
                  </button>
                )}
                {devTool !== 'movePin' && (
                  <button
                    className="dev-inspector-btn move-btn"
                    onClick={() => setDevTool('movePin')}
                    title="Switch to drag-and-move mode"
                  >
                    <i className="fas fa-arrows-up-down-left-right" /> Move
                  </button>
                )}
                <button
                  className="dev-inspector-btn delete-btn"
                  onClick={() => {
                    if (onDeletePin) {
                      onDeletePin(selectedDevPinId);
                    } else {
                      delete LOCATION_COORDINATES[selectedDevPinId];
                      setSelectedDevPinId(null);
                      if (onUpdate) onUpdate();
                    }
                  }}
                  title="Remove this pin from the map"
                >
                  <i className="fas fa-trash-can" /> Delete Pin
                </button>
              </div>

              <div className="dev-inspector-hint">
                <i className="fas fa-keyboard" />
                <span>Arrow keys nudge 1px · <kbd>Shift</kbd>+arrows 10px</span>
              </div>
            </>
          ) : (
            <div className="dev-inspector-empty">
              <i className="fas fa-hand-pointer" />
              <span>{devTool === 'placePin' ? 'Select a lore location above and click on the map to drop a pin' : 'Click any pin on the map to inspect, move, or open its lore'}</span>
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
