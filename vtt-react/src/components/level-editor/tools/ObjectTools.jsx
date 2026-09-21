import React, { useMemo, useState, useEffect } from 'react';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useMapStore from '../../../store/mapStore';
import ConnectionRenameDialog from '../ConnectionRenameDialog';
import CanvasObjectThumbnail from '../objects/CanvasObjectThumbnail';
import './styles/ObjectTools.css';

const TransformRow = ({ label, options, value, formatOption, onSelect, disabled = false }) => (
    <div className="transform-row">
        <span className="transform-label">{label}</span>
        <div className="transform-options" role="group" aria-label={label}>
            {options.map((option) => {
                const isActive = value === option;
                return (
                    <button
                        key={option}
                        type="button"
                        className={`transform-btn${isActive ? ' active' : ''}`}
                        aria-pressed={isActive}
                        title={`${label}: ${formatOption(option)}`}
                        disabled={disabled}
                        onClick={() => onSelect(option)}
                    >
                        {formatOption(option)}
                    </button>
                );
            })}
        </div>
    </div>
);

// Fixed display order for the catalog category chips/sections.
const CATEGORY_ORDER = ['structures', 'furniture', 'props', 'crypt', 'nature', 'lighting', 'gm'];

// Object categories for organization (all 100% 3D assets)
const categoryMetadata = {
    structures: { name: '3D Structures & Architecture', short: 'Structures', icon: 'Utility/Falling Block' },
    furniture: { name: '3D Furniture & Interior', short: 'Furniture', icon: 'items/Container/Chest/stone-block-chest' },
    props: { name: '3D Props, Containers & Traps', short: 'Props', icon: 'Fire/Fire Logs' },
    crypt: { name: '3D Crypt, Graveyard & Tombs', short: 'Crypt', icon: 'items/Container/Chest/stone-block-chest' },
    nature: { name: '3D Nature & Environment', short: 'Nature', icon: 'inv_misc_tree_01' },
    lighting: { name: '3D Lighting & Banners', short: 'Lighting', icon: 'inv_misc_lantern_01' },
    utility: { name: 'Utility & GM Tools', short: 'Utility', icon: 'Utility/Utility' },
    gm: { name: 'GM Notes & Markers', short: 'GM Tools', icon: 'Utility/Utility' }
};

const ObjectTools = ({ selectedTool, settings, onSettingsChange }) => {
    const [selectedObjectType, setSelectedObjectType] = useState(undefined);
    const [objectRotation, setObjectRotation] = useState(0);
    const [objectRotationX, setObjectRotationX] = useState(0);
    const [objectRotationY, setObjectRotationY] = useState(0);
    const [objectScale, setObjectScale] = useState(1);
    const [objectElevation, setObjectElevation] = useState(0);
    const [editingConnection, setEditingConnection] = useState(null);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [catalogSearch, setCatalogSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const { 
        dndElements, 
        updateDndElement,
        objectManipulationEnabled,
        setObjectManipulationEnabled,
        environmentalObjects,
        removeEnvironmentalObject,
        updateEnvironmentalObject,
        setEnvironmentalObjectLocked,
        setAllEnvironmentalObjectsLocked
    } = useLevelEditorStore();
    const { maps, getCurrentMapId } = useMapStore();
    const currentMapId = getCurrentMapId();
    const selectedEnvObj = (environmentalObjects || []).find(o => o.selected);

    // Derived lock state for the global "Lock All" control. There is no stored
    // flag: the button snapshots the lock onto the objects placed so far, and
    // objects dropped afterwards start unlocked.
    const objectLockStats = useMemo(() => {
        const objs = environmentalObjects || [];
        const locked = objs.filter(o => o.locked).length;
        return {
            total: objs.length,
            locked,
            allLocked: objs.length > 0 && locked === objs.length,
            partial: locked > 0 && locked < objs.length
        };
    }, [environmentalObjects]);

    // Get connections (portals) from current map's dndElements (should match level editor store)
    const connections = dndElements.filter(el => el.type === 'portal');

    const handleObjectSelect = (objectId) => {
        if (selectedObjectType === objectId) {
            setSelectedObjectType(undefined);
            onSettingsChange({
                selectedObjectType: undefined,
                selectedPlacementType: undefined,
                objectRotation: settings?.objectRotation || objectRotation,
                objectRotationX: settings?.objectRotationX || objectRotationX,
                objectRotationY: settings?.objectRotationY || objectRotationY,
                objectScale: settings?.objectScale || objectScale,
                objectElevation: settings?.objectElevation ?? objectElevation ?? 0
            });
            return;
        }
        setSelectedObjectType(objectId);
        onSettingsChange({
            selectedObjectType: objectId,
            selectedPlacementType: undefined,
            objectRotation: settings?.objectRotation || objectRotation,
            objectRotationX: settings?.objectRotationX || objectRotationX,
            objectRotationY: settings?.objectRotationY || objectRotationY,
            objectScale: settings?.objectScale || objectScale,
            objectElevation: settings?.objectElevation ?? objectElevation ?? 0
        });
    };

    const handleTransformSelect = (field, value) => {
        // Locked objects are frozen: the transform rows are disabled, this is a
        // second guard for keyboard/programmatic activation.
        if (selectedEnvObj?.locked) return;
        const settersByField = {
            objectScale: setObjectScale,
            objectRotation: setObjectRotation,
            objectRotationX: setObjectRotationX,
            objectRotationY: setObjectRotationY,
            objectElevation: setObjectElevation
        };
        settersByField[field]?.(value);
        onSettingsChange({ ...settings, [field]: value });
        if (selectedEnvObj) {
            const transformKeys = {
                objectScale: 'scale',
                objectRotation: 'rotation',
                objectRotationX: 'rotationX',
                objectRotationY: 'rotationY',
                objectElevation: 'elevation'
            };
            const propKey = transformKeys[field];
            if (propKey) {
                updateEnvironmentalObject(selectedEnvObj.id, { [propKey]: value });
            }
        }
    };

    useEffect(() => {
        if (selectedEnvObj) {
            if (selectedEnvObj.scale !== undefined) setObjectScale(selectedEnvObj.scale);
            if (selectedEnvObj.rotation !== undefined) setObjectRotation(selectedEnvObj.rotation);
            if (selectedEnvObj.rotationX !== undefined) setObjectRotationX(selectedEnvObj.rotationX);
            if (selectedEnvObj.rotationY !== undefined) setObjectRotationY(selectedEnvObj.rotationY);
            if (selectedEnvObj.elevation !== undefined) setObjectElevation(selectedEnvObj.elevation);
        }
    }, [selectedEnvObj]);

    useEffect(() => {
        // Sync the local catalog selection with the store even when it is
        // cleared (tab switches write `selectedObjectType: undefined`); a stale
        // local id made the next card click toggle "off" instead of arming.
        if (settings && 'selectedObjectType' in settings) setSelectedObjectType(settings.selectedObjectType);
        if (settings?.objectRotation !== undefined) setObjectRotation(settings.objectRotation);
        if (settings?.objectRotationX !== undefined) setObjectRotationX(settings.objectRotationX);
        if (settings?.objectRotationY !== undefined) setObjectRotationY(settings.objectRotationY);
        if (settings?.objectScale !== undefined) setObjectScale(settings.objectScale);
        if (settings?.objectElevation !== undefined) setObjectElevation(settings.objectElevation);
    }, [settings?.selectedObjectType, settings?.objectRotation, settings?.objectRotationX, settings?.objectRotationY, settings?.objectScale, settings?.objectElevation]);

    // NOTE: the panel intentionally does not reset tool settings on mount. The
    // editor clears the catalog selection when the Objects tab is opened
    // (`handleTabChange`), and a mount-time reset raced with the sync effect:
    // it copied the previous selection into local state before clearing the
    // store, so the next catalog click toggled the object off instead of
    // arming it for placement.

    const handleConnectionRename = (connection, newName) => {
        updateDndElement(connection.id, {
            ...connection,
            properties: { ...connection.properties, portalName: newName }
        }, currentMapId);
    };

    const handleConnectionClick = (connection) => {
        setEditingConnection(connection);
        setShowRenameDialog(true);
    };

    // Group objects by category
    const groupedObjects = useMemo(() => Object.entries(PROFESSIONAL_OBJECTS).reduce((acc, [id, obj]) => {
        const category = obj.category || 'misc';
        if (!acc[category]) acc[category] = [];
        acc[category].push({ id, ...obj });
        return acc;
    }, {}), []);

    const searchTerm = catalogSearch.trim().toLowerCase();
    const isSearching = searchTerm.length > 0;

    const matchesSearch = (obj) => !isSearching
        || obj.name?.toLowerCase().includes(searchTerm)
        || obj.id.toLowerCase().includes(searchTerm);

    const connectionMatchesSearch = !isSearching
        || 'connection'.includes(searchTerm)
        || 'portal'.includes(searchTerm);

    const gmObjects = (groupedObjects.gm || []).filter(matchesSearch);

    const chips = useMemo(() => ([
        {
            id: 'all',
            label: 'All',
            count: Object.keys(PROFESSIONAL_OBJECTS).length + 1
        },
        {
            id: 'utility',
            label: 'Utility',
            count: (groupedObjects.gm || []).length + 1
        },
        ...CATEGORY_ORDER.filter(cat => cat !== 'gm' && (groupedObjects[cat] || []).length > 0).map(cat => ({
            id: cat,
            label: categoryMetadata[cat]?.short || cat,
            count: groupedObjects[cat].length
        }))
    ]), [groupedObjects]);

    const objectCard = (obj) => (
        <button
            key={obj.id}
            type="button"
            className={`object-card mini${settings?.selectedObjectType === obj.id ? ' selected' : ''}`}
            onClick={() => handleObjectSelect(obj.id)}
            title={obj.name}
        >
            <CanvasObjectThumbnail objectType={obj.id} className="mini-img" size={64} />
            <span className="mini-name">{obj.name}</span>
        </button>
    );

    const connectionCard = (
        <button
            key="__connection"
            type="button"
            className={`object-card mini${settings?.selectedPlacementType === 'connection' ? ' selected' : ''}`}
            onClick={() => {
                setSelectedObjectType(undefined);
                onSettingsChange({
                    ...settings,
                    selectedPlacementType: 'connection',
                    selectedObjectType: undefined
                });
            }}
            title="Place a map connection between two locations"
        >
            <span className="mini-icon"><i className="fas fa-link"></i><i className="fas fa-arrow-right mini-icon-arrow"></i><i className="fas fa-link"></i></span>
            <span className="mini-name">Connection</span>
            <span className="mini-badge">GM only</span>
        </button>
    );

    const renderSection = (categoryId, items, { includeConnection = false } = {}) => {
        if (!items.length && !includeConnection) return null;
        const meta = categoryMetadata[categoryId];
        return (
            <div className="object-category-section" key={categoryId}>
                <h5 className="category-header">
                    <span className="category-name">{meta?.name || categoryId}</span>
                    <span className="category-count">{items.length + (includeConnection ? 1 : 0)}</span>
                </h5>
                <div className="objects-grid">
                    {includeConnection && connectionCard}
                    {items.map(objectCard)}
                </div>
            </div>
        );
    };

    // Search spans the whole catalog; chips switch to a single category view.
    const visibleSections = isSearching
        ? CATEGORY_ORDER.map(cat => renderSection(cat, (groupedObjects[cat] || []).filter(matchesSearch), { includeConnection: cat === 'gm' && connectionMatchesSearch }))
        : activeCategory === 'all'
            ? [
                renderSection('gm', gmObjects, { includeConnection: connectionMatchesSearch }),
                ...CATEGORY_ORDER.filter(cat => cat !== 'gm').map(cat => renderSection(cat, groupedObjects[cat] || []))
            ]
            : activeCategory === 'utility'
                ? [renderSection('gm', gmObjects, { includeConnection: connectionMatchesSearch })]
                : [renderSection(activeCategory, (groupedObjects[activeCategory] || []).filter(matchesSearch))];

    const visibleCount = isSearching
        ? CATEGORY_ORDER.reduce((sum, cat) => sum + (groupedObjects[cat] || []).filter(matchesSearch).length, 0)
            + (connectionMatchesSearch ? 1 : 0)
        : chips.find(c => c.id === activeCategory)?.count || 0;

    return (
        <div className="object-tools" onMouseDown={(e) => e.stopPropagation()}>
            {/* Master Interaction Control */}
            <div className="object-mode-bar">
                <div className="object-mode-info">
                    <span className={`object-mode-icon${objectManipulationEnabled ? ' unlocked' : ''}`}>
                        <i className={`fas ${objectManipulationEnabled ? 'fa-lock-open' : 'fa-lock'}`}></i>
                    </span>
                    <div className="lock-text">
                        <span className="lock-status">{objectManipulationEnabled ? 'Interaction Unlocked' : 'Interaction Locked'}</span>
                        <span className="lock-desc">{objectManipulationEnabled ? 'Edit mode active' : 'Play mode active'}</span>
                    </div>
                </div>
                <button
                    type="button"
                    role="switch"
                    aria-checked={objectManipulationEnabled}
                    aria-label="Toggle object interaction"
                    className={`interaction-switch ${objectManipulationEnabled ? 'active' : ''}`}
                    onClick={() => setObjectManipulationEnabled(!objectManipulationEnabled)}
                >
                    <div className="switch-knob"></div>
                </button>
            </div>

            {/* Global Object Lock */}
            <div className="object-lock-bar">
                <div className="object-lock-info">
                    <span className={`object-lock-icon${objectLockStats.allLocked ? ' locked' : objectLockStats.partial ? ' partial' : ''}`}>
                        <i className={`fas ${objectLockStats.allLocked || objectLockStats.partial ? 'fa-lock' : 'fa-lock-open'}`}></i>
                    </span>
                    <div className="lock-text">
                        <span className="lock-status">
                            {objectLockStats.total === 0
                                ? 'No Objects Placed'
                                : objectLockStats.allLocked
                                    ? `All ${objectLockStats.total} Objects Locked`
                                    : objectLockStats.partial
                                        ? `${objectLockStats.locked} of ${objectLockStats.total} Objects Locked`
                                        : 'All Objects Unlocked'}
                        </span>
                        <span className="lock-desc">
                            {objectLockStats.total === 0
                                ? 'Place objects, then freeze them in place'
                                : objectLockStats.allLocked
                                    ? 'Nothing can be moved accidentally'
                                    : 'Freeze placed objects against accidental moves'}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    className={`object-lock-all-btn${objectLockStats.allLocked ? ' active' : ''}`}
                    disabled={objectLockStats.total === 0}
                    title={objectLockStats.total === 0
                        ? 'Place an object first'
                        : objectLockStats.allLocked
                            ? 'Unlock every object so it can be moved again'
                            : `Lock all ${objectLockStats.total} placed objects (new placements stay unlocked)`}
                    onClick={() => setAllEnvironmentalObjectsLocked(!objectLockStats.allLocked, currentMapId)}
                >
                    <i className={`fas ${objectLockStats.allLocked ? 'fa-lock-open' : 'fa-lock'}`}></i>
                    {objectLockStats.allLocked ? 'Unlock All' : 'Lock All'}
                </button>
            </div>

            <div className="object-tools-scroll">
                {selectedTool === 'object_place' && (
                    <>
                        {/* Selected Object Action Bar */}
                        {selectedEnvObj && (
                            <div className="obj-selected-bar">
                                <span className="obj-selected-name">
                                    <i className={`fas ${selectedEnvObj.locked ? 'fa-lock' : 'fa-cube'}`}></i>
                                    {PROFESSIONAL_OBJECTS[selectedEnvObj.type]?.name || selectedEnvObj.type}
                                    {selectedEnvObj.locked ? ' (Locked)' : ''}
                                </span>
                                <div className="obj-selected-actions">
                                    <button
                                        type="button"
                                        className={`obj-action-btn lock${selectedEnvObj.locked ? ' active' : ''}`}
                                        title={selectedEnvObj.locked
                                            ? 'Unlock this object so it can be moved again'
                                            : 'Lock this object in place (no move, resize, rotate or delete)'}
                                        onClick={() => {
                                            setEnvironmentalObjectLocked(selectedEnvObj.id, !selectedEnvObj.locked);
                                        }}
                                    >
                                        <i className={`fas ${selectedEnvObj.locked ? 'fa-lock-open' : 'fa-lock'}`}></i>
                                        {selectedEnvObj.locked ? 'Unlock' : 'Lock'}
                                    </button>
                                    <button
                                        type="button"
                                        className="obj-action-btn danger"
                                        disabled={selectedEnvObj.locked}
                                        title={selectedEnvObj.locked ? 'Unlock this object first' : 'Delete this object'}
                                        onClick={() => {
                                            removeEnvironmentalObject(selectedEnvObj.id);
                                        }}
                                    >
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Transform Toolbar */}
                        <div className="transform-panel">
                            <div className="transform-panel-header">
                                <i className="fas fa-sliders-h"></i>
                                <span>Object Transform</span>
                            </div>
                            <TransformRow
                                label="Scale"
                                options={[0.5, 1, 1.5, 2, 3]}
                                value={settings?.objectScale ?? objectScale}
                                formatOption={(v) => `${v}×`}
                                disabled={!!selectedEnvObj?.locked}
                                onSelect={(v) => handleTransformSelect('objectScale', v)}
                            />
                            <TransformRow
                                label="Height"
                                options={[-1, 0, 0.5, 1, 1.5, 2, 3]}
                                value={settings?.objectElevation ?? objectElevation}
                                formatOption={(v) => `${v} lvl`}
                                disabled={!!selectedEnvObj?.locked}
                                onSelect={(v) => handleTransformSelect('objectElevation', v)}
                            />
                            <TransformRow
                                label="Rotation"
                                options={[0, 90, 180, 270]}
                                value={settings?.objectRotation ?? objectRotation}
                                formatOption={(v) => `${v}°`}
                                disabled={!!selectedEnvObj?.locked}
                                onSelect={(v) => handleTransformSelect('objectRotation', v)}
                            />
                            <TransformRow
                                label="Tilt (X)"
                                options={[-45, -15, 0, 15, 45]}
                                value={settings?.objectRotationX ?? objectRotationX}
                                formatOption={(v) => `${v}°`}
                                disabled={!!selectedEnvObj?.locked}
                                onSelect={(v) => handleTransformSelect('objectRotationX', v)}
                            />
                            <TransformRow
                                label="Roll (Y)"
                                options={[-45, -15, 0, 15, 45]}
                                value={settings?.objectRotationY ?? objectRotationY}
                                formatOption={(v) => `${v}°`}
                                disabled={!!selectedEnvObj?.locked}
                                onSelect={(v) => handleTransformSelect('objectRotationY', v)}
                            />
                            <div className="transform-snap-row">
                                <span className="transform-snap-label">
                                    <i className="fas fa-magnet"></i> Snap to Walls
                                </span>
                                <button
                                    type="button"
                                    className={`transform-chip ${(settings?.snapToWall ?? false) ? 'active' : ''}`}
                                    aria-pressed={settings?.snapToWall ?? false}
                                    onClick={() => {
                                        const next = !(settings?.snapToWall ?? false);
                                        onSettingsChange({ ...settings, snapToWall: next });
                                    }}
                                >
                                    {(settings?.snapToWall ?? false) ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            <details className="transform-shortcuts">
                                <summary><i className="fas fa-keyboard"></i> Shortcuts</summary>
                                <div className="transform-hint">
                                    <span className="transform-hint-item"><kbd>Wheel</kbd> Resize</span>
                                    <span className="transform-hint-item"><kbd>Shift</kbd>+<kbd>E</kbd>+<kbd>Wheel</kbd> Height</span>
                                    <span className="transform-hint-item"><kbd>Alt</kbd>+<kbd>Wheel</kbd> Rotate</span>
                                    <span className="transform-hint-item"><kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Wheel</kbd> Tilt</span>
                                    <span className="transform-hint-item"><kbd>Shift</kbd>+<kbd>Wheel</kbd> Roll</span>
                                    <span className="transform-hint-item"><kbd>L</kbd> Lock / Unlock Selected</span>
                                    <span className="transform-hint-item"><kbd>Shift</kbd>+<kbd>L</kbd> Lock / Unlock All</span>
                                </div>
                            </details>
                        </div>

                        {/* Object Catalog */}
                        <div className="object-catalog">
                            <div className="object-catalog-head">
                                <div className="object-catalog-title-row">
                                    <h4>Object Catalog</h4>
                                    <span className="object-catalog-count">{visibleCount}</span>
                                </div>
                                <div className="object-search">
                                    <i className="fas fa-search"></i>
                                    <input
                                        type="text"
                                        value={catalogSearch}
                                        placeholder="Search objects..."
                                        aria-label="Search object catalog"
                                        onChange={(e) => setCatalogSearch(e.target.value)}
                                    />
                                    {catalogSearch && (
                                        <button
                                            type="button"
                                            className="object-search-clear"
                                            onClick={() => setCatalogSearch('')}
                                            title="Clear search"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                                <div className="object-chips" role="tablist" aria-label="Object categories">
                                    {chips.map(chip => (
                                        <button
                                            key={chip.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={!isSearching && activeCategory === chip.id}
                                            className={`object-chip${!isSearching && activeCategory === chip.id ? ' active' : ''}`}
                                            onClick={() => {
                                                setCatalogSearch('');
                                                setActiveCategory(chip.id);
                                            }}
                                        >
                                            {chip.label}
                                            <span className="object-chip-count">{chip.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="object-catalog-scroll">
                                {visibleSections.some(Boolean) ? (
                                    visibleSections
                                ) : (
                                    <div className="object-catalog-empty">
                                        <i className="fas fa-search"></i>
                                        <span>No objects match “{catalogSearch}”</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Connections List */}
                {connections.length > 0 && (
                    <div className="object-connections">
                        <h4><i className="fas fa-link"></i> Connections ({connections.length})</h4>
                        <div className="connections-list">
                            {connections.map((conn) => (
                                <button
                                    key={conn.id}
                                    type="button"
                                    className="connection-item"
                                    onClick={() => handleConnectionClick(conn)}
                                >
                                    <span className="conn-info">
                                        <span className="conn-name">{conn.properties?.portalName || 'Unnamed Connection'}</span>
                                        {conn.properties?.isHidden && <span className="conn-hidden">Hidden</span>}
                                    </span>
                                    <span className="conn-dest">
                                        {maps.find(m => m.id === conn.properties?.destinationMapId)?.name || 'No Destination'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showRenameDialog && editingConnection && (
                <ConnectionRenameDialog
                    isOpen={showRenameDialog}
                    onClose={() => { setShowRenameDialog(false); setEditingConnection(null); }}
                    connection={editingConnection}
                    onSave={(newName) => {
                        handleConnectionRename(editingConnection, newName);
                        setShowRenameDialog(false);
                        setEditingConnection(null);
                    }}
                />
            )}
        </div>
    );
};

export default ObjectTools;
