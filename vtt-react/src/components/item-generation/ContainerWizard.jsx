import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useWindowManagerStore from '../../store/windowManagerStore';
import { getIconUrl } from '../../utils/assetManager';
import '@fortawesome/fontawesome-free/css/all.min.css';

function ContainerWizard({ onComplete, onCancel, onClose, initialData, editingContainer, isEditing: isEditingProp }) {
    const resolvedOnCancel = onCancel || onClose;

    const windowId = useRef(`container-wizard-${Date.now()}-${Math.random()}`).current;
    const [overlayZIndex, setOverlayZIndex] = useState(2000);
    const [modalZIndex, setModalZIndex] = useState(2001);
    const [securityExpanded, setSecurityExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('type');

    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    useEffect(() => {
        const baseZIndex = registerWindow(windowId, 'modal');
        setOverlayZIndex(baseZIndex);
        setModalZIndex(baseZIndex + 1);
        return () => unregisterWindow(windowId);
    }, [windowId, registerWindow, unregisterWindow]);

    const containerIcons = [
        { id: 'inv_box_01', name: 'Wooden Chest', defaultName: 'Wooden Storage Chest', defaultDesc: 'A sturdy wooden chest with iron fittings.', defaultRows: 4, defaultCols: 6 },
        { id: 'inv_box_02', name: 'Iron Chest', defaultName: 'Iron-Bound Chest', defaultDesc: 'A reinforced chest made primarily of iron.', defaultRows: 5, defaultCols: 7 },
        { id: 'inv_box_03', name: 'Steel Chest', defaultName: 'Steel Strongbox', defaultDesc: 'A heavy-duty steel chest for maximum security.', defaultRows: 6, defaultCols: 8 },
        { id: 'inv_crate_01', name: 'Wooden Crate', defaultName: 'Wooden Shipping Crate', defaultDesc: 'A simple wooden crate for transporting goods.', defaultRows: 5, defaultCols: 5 },
        { id: 'inv_crate_02', name: 'Metal Crate', defaultName: 'Reinforced Metal Crate', defaultDesc: 'A durable metal crate for heavy-duty storage.', defaultRows: 6, defaultCols: 6 },
        { id: 'inv_misc_bag_07', name: 'Small Pouch', defaultName: 'Small Leather Pouch', defaultDesc: 'A compact leather pouch for small items.', defaultRows: 2, defaultCols: 3 },
        { id: 'inv_misc_bag_10', name: 'Leather Bag', defaultName: "Traveler's Leather Bag", defaultDesc: 'A well-crafted leather bag with compartments.', defaultRows: 3, defaultCols: 4 },
        { id: 'inv_misc_bag_11', name: 'Magic Bag', defaultName: 'Bag of Holding', defaultDesc: "A magical bag that's bigger on the inside.", defaultRows: 6, defaultCols: 8 },
        { id: 'inv_misc_bag_19', name: 'Large Sack', defaultName: 'Large Canvas Sack', defaultDesc: 'A spacious canvas sack for bulk storage.', defaultRows: 4, defaultCols: 5 },
        { id: 'inv_misc_bag_05', name: "Adventurer's Pack", defaultName: "Adventurer's Backpack", defaultDesc: 'A rugged backpack with numerous pockets.', defaultRows: 5, defaultCols: 6 },
        { id: 'inv_misc_bag_16', name: 'Enchanted Bag', defaultName: 'Enchanted Haversack', defaultDesc: 'A magically enhanced bag with extra-dimensional storage.', defaultRows: 7, defaultCols: 8 },
        { id: 'inv_box_04', name: 'Ornate Chest', defaultName: 'Ornate Treasure Chest', defaultDesc: 'A beautifully decorated chest with gold filigree.', defaultRows: 5, defaultCols: 7 }
    ];

    const resolvedInitialData = initialData || editingContainer;

    const [containerData, setContainerData] = useState(() => {
        const src = resolvedInitialData;
        if (src) {
            return {
                name: src.name || containerIcons[0].defaultName,
                rows: src.rows || src.containerProperties?.gridSize?.rows || containerIcons[0].defaultRows,
                cols: src.cols || src.containerProperties?.gridSize?.cols || containerIcons[0].defaultCols,
                isLocked: src.isLocked || src.containerProperties?.isLocked || false,
                lockType: src.lockType || src.containerProperties?.lockType || 'none',
                lockDC: src.lockDC || src.containerProperties?.lockDC || 10,
                lockCode: src.lockCode || src.containerProperties?.lockCode || '',
                iconId: src.iconId || containerIcons[0].id,
                quality: src.quality || 'common',
                description: src.description || containerIcons[0].defaultDesc,
                type: 'container',
                flavorText: src.flavorText || src.containerProperties?.flavorText || '',
                maxAttempts: src.maxAttempts || src.containerProperties?.maxAttempts || 3,
                failureAction: src.failureAction || src.containerProperties?.failureAction || 'none',
                failureActionDetails: src.failureActionDetails || src.containerProperties?.failureActionDetails || {
                    removeItems: false, removePercentage: 50, destroyContainer: false,
                    triggerTrap: false, trapDetails: '', transformIntoCreature: false, creatureType: ''
                }
            };
        }
        return {
            name: containerIcons[0].defaultName, rows: containerIcons[0].defaultRows,
            cols: containerIcons[0].defaultCols, isLocked: false, lockType: 'none',
            lockDC: 10, lockCode: '', iconId: containerIcons[0].id, quality: 'common',
            description: containerIcons[0].defaultDesc, type: 'container', flavorText: '',
            maxAttempts: 3, failureAction: 'none', failureActionDetails: {
                removeItems: false, removePercentage: 50, destroyContainer: false,
                triggerTrap: false, trapDetails: '', transformIntoCreature: false, creatureType: ''
            }
        };
    });

    const [prevIconId, setPrevIconId] = useState(containerData.iconId);

    useEffect(() => {
        if (resolvedInitialData && containerData.iconId !== prevIconId) {
            setPrevIconId(containerData.iconId);
        }
    }, [containerData.iconId]);

    const isEditing = isEditingProp || !!editingContainer;

    const selectedIcon = containerIcons.find(i => i.id === containerData.iconId);

    const handleSubmit = () => {
        const containerItem = {
            id: Date.now().toString(),
            name: containerData.name || 'Unnamed Container',
            quality: containerData.quality,
            description: containerData.description,
            type: 'container',
            iconId: containerData.iconId,
            containerProperties: {
                isLocked: containerData.isLocked,
                lockType: containerData.lockType,
                lockDC: containerData.lockDC,
                lockCode: containerData.lockCode,
                gridSize: { rows: parseInt(containerData.rows) || 4, cols: parseInt(containerData.cols) || 6 },
                items: [],
                flavorText: containerData.flavorText,
                maxAttempts: containerData.maxAttempts,
                failureAction: containerData.failureAction,
                failureActionDetails: containerData.failureActionDetails
            }
        };
        onComplete(containerItem);
    };

    const qualities = [
        { id: 'poor', name: 'Poor', color: '#9d9d9d' },
        { id: 'common', name: 'Common', color: '#ffffff' },
        { id: 'uncommon', name: 'Uncommon', color: '#1eff00' },
        { id: 'rare', name: 'Rare', color: '#0070dd' },
        { id: 'epic', name: 'Epic', color: '#a335ee' },
        { id: 'legendary', name: 'Legendary', color: '#ff8000' }
    ];

    const handleIconChange = (iconId) => {
        if (isEditing) return;
        const icon = containerIcons.find(i => i.id === iconId);
        setContainerData(prev => ({
            ...prev,
            iconId,
            name: prev.name === containerIcons.find(i => i.id === prev.iconId)?.defaultName ? icon.defaultName : prev.name,
            description: prev.description === containerIcons.find(i => i.id === prev.iconId)?.defaultDesc ? icon.defaultDesc : prev.description,
            rows: icon.defaultRows,
            cols: icon.defaultCols
        }));
    };

    const updateData = (updates) => setContainerData(prev => ({ ...prev, ...updates }));

    const updateFailureDetails = (updates) => setContainerData(prev => ({
        ...prev,
        failureActionDetails: { ...prev.failureActionDetails, ...updates }
    }));

    return createPortal(
        <>
            <div className="cw-overlay" style={{ zIndex: overlayZIndex }} onClick={resolvedOnCancel} />
            <div className="cw-overlay cw-overlay--modal" style={{ zIndex: modalZIndex }}>
                <div className="cw-modal" onClick={e => e.stopPropagation()}>
                    <div className="cw-header">
                        <div className="cw-header-left">
                            <img
                                src={getIconUrl(containerData.iconId, 'items', true)}
                                alt=""
                                className="cw-header-icon"
                                onError={e => { e.target.onerror = null; e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true); }}
                            />
                            <h2>{isEditing ? 'Edit Container' : 'New Container'}</h2>
                        </div>
                        <button className="cw-close" onClick={resolvedOnCancel}>
                            <i className="fas fa-times" />
                        </button>
                    </div>

                    <div className="cw-tabs">
                        <button className={`cw-tab ${activeTab === 'type' ? 'active' : ''}`} onClick={() => setActiveTab('type')}>
                            <i className="fas fa-box" /> Type & Size
                        </button>
                        <button className={`cw-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                            <i className="fas fa-scroll" /> Details
                        </button>
                        <button className={`cw-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                            <i className="fas fa-lock" /> Security
                            {containerData.isLocked && <span className="cw-tab-badge" />}
                        </button>
                    </div>

                    <div className="cw-body">
                        {activeTab === 'type' && (
                            <div className="cw-panel">
                                <div className="cw-icon-strip">
                                    {containerIcons.map(icon => (
                                        <button
                                            key={icon.id}
                                            className={`cw-icon-btn ${containerData.iconId === icon.id ? 'selected' : ''}`}
                                            onClick={() => handleIconChange(icon.id)}
                                            title={`${icon.name} (${icon.defaultRows}x${icon.defaultCols})`}
                                        >
                                            <img
                                                src={getIconUrl(icon.id, 'items', true)}
                                                alt={icon.name}
                                                onError={e => { e.target.onerror = null; e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true); }}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="cw-selected-info">
                                    <span className="cw-selected-name">{selectedIcon?.name}</span>
                                    <span className="cw-selected-size">{containerData.rows} x {containerData.cols} slots</span>
                                </div>
                                <div className="cw-grid-preview">
                                    <div className="cw-grid-inner" style={{
                                        gridTemplateColumns: `repeat(${containerData.cols}, 1fr)`,
                                        gridTemplateRows: `repeat(${containerData.rows}, 1fr)`
                                    }}>
                                        {Array.from({ length: containerData.rows * containerData.cols }).map((_, i) => (
                                            <div key={i} className="cw-grid-cell" />
                                        ))}
                                    </div>
                                </div>
                                <div className="cw-row">
                                    <div className="cw-field cw-field--sm">
                                        <label>Rows</label>
                                        <div className="cw-number-input">
                                            <button onClick={() => updateData({ rows: Math.max(1, containerData.rows - 1) })}>-</button>
                                            <span>{containerData.rows}</span>
                                            <button onClick={() => updateData({ rows: Math.min(12, containerData.rows + 1) })}>+</button>
                                        </div>
                                    </div>
                                    <div className="cw-field cw-field--sm">
                                        <label>Columns</label>
                                        <div className="cw-number-input">
                                            <button onClick={() => updateData({ cols: Math.max(1, containerData.cols - 1) })}>-</button>
                                            <span>{containerData.cols}</span>
                                            <button onClick={() => updateData({ cols: Math.min(12, containerData.cols + 1) })}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="cw-panel">
                                <div className="cw-row">
                                    <div className="cw-field">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={containerData.name}
                                            onChange={e => updateData({ name: e.target.value })}
                                            placeholder="Container name"
                                        />
                                    </div>
                                    <div className="cw-field cw-field--sm">
                                        <label>Quality</label>
                                        <select
                                            value={containerData.quality}
                                            onChange={e => updateData({ quality: e.target.value })}
                                            style={{ color: qualities.find(q => q.id === containerData.quality)?.color }}
                                        >
                                            {qualities.map(q => <option key={q.id} value={q.id} style={{ color: q.color }}>{q.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="cw-field">
                                    <label>Description</label>
                                    <textarea
                                        value={containerData.description}
                                        onChange={e => updateData({ description: e.target.value })}
                                        placeholder="Describe this container..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="cw-panel">
                                <label className="cw-toggle-row">
                                    <div className="cw-toggle-info">
                                        <i className="fas fa-lock" />
                                        <span>Lock this container</span>
                                    </div>
                                    <div className={`cw-switch ${containerData.isLocked ? 'on' : ''}`} onClick={() => updateData({
                                        isLocked: !containerData.isLocked,
                                        lockType: containerData.isLocked ? 'none' : (containerData.lockType === 'none' ? 'thievery' : containerData.lockType)
                                    })}>
                                        <div className="cw-switch-thumb" />
                                    </div>
                                </label>

                                {containerData.isLocked && (
                                    <div className="cw-lock-section">
                                        <div className="cw-lock-types">
                                            {[
                                                { value: 'thievery', icon: 'fa-dice-d20', label: 'Thievery' },
                                                { value: 'code', icon: 'fa-font', label: 'Word Lock' },
                                                { value: 'numeric', icon: 'fa-hashtag', label: 'Number Lock' }
                                            ].map(lt => (
                                                <button
                                                    key={lt.value}
                                                    className={`cw-lock-type ${containerData.lockType === lt.value ? 'active' : ''}`}
                                                    onClick={() => updateData({ lockType: lt.value, lockDC: lt.value === 'thievery' ? containerData.lockDC : 0, lockCode: '' })}
                                                >
                                                    <i className={`fas ${lt.icon}`} />
                                                    <span>{lt.label}</span>
                                                </button>
                                            ))}
                                        </div>

                                        {containerData.lockType === 'thievery' && (
                                            <div className="cw-field">
                                                <label>Thievery DC</label>
                                                <div className="cw-number-input">
                                                    <button onClick={() => updateData({ lockDC: Math.max(1, containerData.lockDC - 1) })}>-</button>
                                                    <span>{containerData.lockDC}</span>
                                                    <button onClick={() => updateData({ lockDC: Math.min(30, containerData.lockDC + 1) })}>+</button>
                                                </div>
                                            </div>
                                        )}

                                        {containerData.lockType === 'code' && (
                                            <div className="cw-field">
                                                <label>Secret Word</label>
                                                <input
                                                    type="text"
                                                    value={containerData.lockCode}
                                                    onChange={e => updateData({ lockCode: e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase().slice(0, 20) })}
                                                    placeholder="Word or phrase"
                                                    autoComplete="off"
                                                    data-form-type="other"
                                                />
                                                <div className="cw-hint">Hangman-style puzzle — spaces preserved</div>
                                            </div>
                                        )}

                                        {containerData.lockType === 'numeric' && (
                                            <div className="cw-field">
                                                <label>Secret Number</label>
                                                <input
                                                    type="text"
                                                    value={containerData.lockCode}
                                                    onChange={e => updateData({ lockCode: e.target.value.replace(/[^0-9]/g, '').slice(0, 8) })}
                                                    placeholder="Up to 8 digits"
                                                    autoComplete="off"
                                                    data-form-type="other"
                                                />
                                                <div className="cw-hint">Players must enter the exact number</div>
                                            </div>
                                        )}

                                        <div className="cw-field">
                                            <label>Lock Appearance</label>
                                            <input
                                                type="text"
                                                value={containerData.flavorText}
                                                onChange={e => updateData({ flavorText: e.target.value })}
                                                placeholder="What does the lock look like?"
                                            />
                                        </div>

                                        <div className="cw-row">
                                            <div className="cw-field cw-field--sm">
                                                <label>Max Attempts</label>
                                                <div className="cw-number-input">
                                                    <button onClick={() => updateData({ maxAttempts: Math.max(1, containerData.maxAttempts - 1) })}>-</button>
                                                    <span>{containerData.maxAttempts}</span>
                                                    <button onClick={() => updateData({ maxAttempts: Math.min(10, containerData.maxAttempts + 1) })}>+</button>
                                                </div>
                                            </div>
                                            <div className="cw-field">
                                                <label>On Final Failure</label>
                                                <select
                                                    value={containerData.failureAction}
                                                    onChange={e => {
                                                        const action = e.target.value;
                                                        updateData({
                                                            failureAction: action,
                                                            failureActionDetails: {
                                                                ...containerData.failureActionDetails,
                                                                removeItems: action === 'remove_items',
                                                                destroyContainer: action === 'destroy',
                                                                triggerTrap: action === 'trap',
                                                                transformIntoCreature: action === 'transform'
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <option value="none">Nothing</option>
                                                    <option value="remove_items">Remove Items</option>
                                                    <option value="destroy">Destroy Container</option>
                                                    <option value="trap">Trigger Trap</option>
                                                    <option value="transform">Transform to Creature</option>
                                                </select>
                                            </div>
                                        </div>

                                        {containerData.failureAction === 'remove_items' && (
                                            <div className="cw-field cw-field--inline">
                                                <label>Remove %</label>
                                                <div className="cw-number-input">
                                                    <button onClick={() => updateFailureDetails({ removePercentage: Math.max(1, containerData.failureActionDetails.removePercentage - 10) })}>-</button>
                                                    <span>{containerData.failureActionDetails.removePercentage}%</span>
                                                    <button onClick={() => updateFailureDetails({ removePercentage: Math.min(100, containerData.failureActionDetails.removePercentage + 10) })}>+</button>
                                                </div>
                                            </div>
                                        )}

                                        {containerData.failureAction === 'trap' && (
                                            <div className="cw-field">
                                                <label>Trap Description</label>
                                                <textarea
                                                    value={containerData.failureActionDetails.trapDetails}
                                                    onChange={e => updateFailureDetails({ trapDetails: e.target.value })}
                                                    placeholder="What happens..."
                                                    rows={2}
                                                />
                                            </div>
                                        )}

                                        {containerData.failureAction === 'transform' && (
                                            <div className="cw-field">
                                                <label>Creature Type</label>
                                                <input
                                                    type="text"
                                                    value={containerData.failureActionDetails.creatureType}
                                                    onChange={e => updateFailureDetails({ creatureType: e.target.value })}
                                                    placeholder="e.g., Mimic, Animated Armor..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="cw-footer">
                        <button className="cw-btn cw-btn--cancel" onClick={resolvedOnCancel}>
                            Cancel
                        </button>
                        <button
                            className="cw-btn cw-btn--create"
                            onClick={handleSubmit}
                            disabled={!containerData.name || (containerData.isLocked && containerData.lockType === 'code' && !containerData.lockCode)}
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

export default ContainerWizard;
