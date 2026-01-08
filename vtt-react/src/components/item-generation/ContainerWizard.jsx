import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import { getIconUrl } from '../../utils/assetManager';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../styles/container-wizard.css';

function ContainerWizard({ onComplete, onCancel, initialData = null, isEditing = false }) {
    // Generate unique window ID
    const windowId = useRef(`container-wizard-${Date.now()}-${Math.random()}`).current;
    const [overlayZIndex, setOverlayZIndex] = useState(2000);
    const [modalZIndex, setModalZIndex] = useState(2001);

    // Window manager store actions
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    // Register modal with window manager on mount
    useEffect(() => {
        const baseZIndex = registerWindow(windowId, 'modal');
        setOverlayZIndex(baseZIndex);
        setModalZIndex(baseZIndex + 1);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow]);
    const containerIcons = [
        { 
            id: 'inv_box_01',
            name: 'Wooden Chest',
            defaultName: 'Wooden Storage Chest',
            defaultDesc: 'A sturdy wooden chest with iron fittings. Perfect for storing general items.',
            defaultRows: 4,
            defaultCols: 6
        },
        { 
            id: 'inv_box_02',
            name: 'Iron Chest',
            defaultName: 'Iron-Bound Chest',
            defaultDesc: 'A reinforced chest made primarily of iron. Offers excellent protection for valuable items.',
            defaultRows: 5,
            defaultCols: 7
        },
        { 
            id: 'inv_box_03',
            name: 'Steel Chest',
            defaultName: 'Steel Strongbox',
            defaultDesc: 'A heavy-duty steel chest designed for maximum security.',
            defaultRows: 6,
            defaultCols: 8
        },
        { 
            id: 'inv_crate_01',
            name: 'Wooden Crate',
            defaultName: 'Wooden Shipping Crate',
            defaultDesc: 'A simple wooden crate commonly used for transporting goods.',
            defaultRows: 5,
            defaultCols: 5
        },
        { 
            id: 'inv_crate_02',
            name: 'Metal Crate',
            defaultName: 'Reinforced Metal Crate',
            defaultDesc: 'A durable metal crate designed for heavy-duty storage and transport.',
            defaultRows: 6,
            defaultCols: 6
        },
        { 
            id: 'inv_misc_bag_07',
            name: 'Small Pouch',
            defaultName: 'Small Leather Pouch',
            defaultDesc: 'A compact leather pouch for carrying small items and coins.',
            defaultRows: 2,
            defaultCols: 3
        },
        { 
            id: 'inv_misc_bag_10',
            name: 'Leather Bag',
            defaultName: 'Traveler\'s Leather Bag',
            defaultDesc: 'A well-crafted leather bag with multiple compartments for organized storage.',
            defaultRows: 3,
            defaultCols: 4
        },
        { 
            id: 'inv_misc_bag_11',
            name: 'Magic Bag',
            defaultName: 'Bag of Holding',
            defaultDesc: 'A magical bag that\'s bigger on the inside than it appears.',
            defaultRows: 6,
            defaultCols: 8
        },
        { 
            id: 'inv_misc_bag_19',
            name: 'Large Sack',
            defaultName: 'Large Canvas Sack',
            defaultDesc: 'A spacious canvas sack suitable for bulk storage.',
            defaultRows: 4,
            defaultCols: 5
        },
        { 
            id: 'inv_misc_bag_05',
            name: 'Adventurer\'s Pack',
            defaultName: 'Adventurer\'s Backpack',
            defaultDesc: 'A rugged backpack with numerous pockets and compartments, perfect for adventuring.',
            defaultRows: 5,
            defaultCols: 6
        },
        { 
            id: 'inv_misc_bag_16',
            name: 'Enchanted Bag',
            defaultName: 'Enchanted Haversack',
            defaultDesc: 'A magically enhanced bag with extra-dimensional storage space.',
            defaultRows: 7,
            defaultCols: 8
        },
        { 
            id: 'inv_box_04',
            name: 'Ornate Chest',
            defaultName: 'Ornate Treasure Chest',
            defaultDesc: 'A beautifully decorated chest with gold filigree, perfect for storing valuable treasures.',
            defaultRows: 5,
            defaultCols: 7
        }
    ];

    const [containerData, setContainerData] = useState(() => {
        if (initialData) {
            // When editing, use the initialData but ensure all required fields are present
            return {
                name: initialData.name || containerIcons[0].defaultName,
                rows: initialData.rows || containerIcons[0].defaultRows,
                cols: initialData.cols || containerIcons[0].defaultCols,
                isLocked: initialData.isLocked || false,
                lockType: initialData.lockType || 'none',
                lockDC: initialData.lockDC || 10,
                lockCode: initialData.lockCode || '',
                iconId: initialData.iconId || containerIcons[0].id,
                quality: initialData.quality || 'common',
                description: initialData.description || containerIcons[0].defaultDesc,
                type: 'container',
                flavorText: initialData.flavorText || '',
                maxAttempts: initialData.maxAttempts || 3,
                failureAction: initialData.failureAction || 'none',
                failureActionDetails: initialData.failureActionDetails || {
                    removeItems: false,
                    removePercentage: 50,
                    destroyContainer: false,
                    triggerTrap: false,
                    trapDetails: '',
                    transformIntoCreature: false,
                    creatureType: ''
                }
            };
        }

        // Default new container
        return {
            name: containerIcons[0].defaultName,
            rows: containerIcons[0].defaultRows,
            cols: containerIcons[0].defaultCols,
            isLocked: false,
            lockType: 'none',
            lockDC: 10,
            lockCode: '',
            iconId: containerIcons[0].id,
            quality: 'common',
            description: containerIcons[0].defaultDesc,
            type: 'container',
            flavorText: '',
            maxAttempts: 3,
            failureAction: 'none',
            failureActionDetails: {
                removeItems: false,
                removePercentage: 50,
                destroyContainer: false,
                triggerTrap: false,
                trapDetails: '',
                transformIntoCreature: false,
                creatureType: ''
            }
        };
    });

    const handleSubmit = () => {
        // Create an item that represents this container
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
                gridSize: {
                    rows: parseInt(containerData.rows) || 4,
                    cols: parseInt(containerData.cols) || 6
                },
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
        const selectedIcon = containerIcons.find(icon => icon.id === iconId);
        setContainerData(prev => ({
            ...prev,
            iconId,
            name: selectedIcon.defaultName,
            description: selectedIcon.defaultDesc,
            rows: selectedIcon.defaultRows,
            cols: selectedIcon.defaultCols
        }));
    };

    return createPortal(
        <>
            {/* Overlay - rendered as sibling to modal */}
            <div
                className="container-wizard-overlay"
                style={{ zIndex: overlayZIndex }}
                onClick={onCancel}
            />

            {/* Modal - rendered as sibling to overlay */}
            <div
                className="container-wizard-overlay"
                style={{
                    zIndex: modalZIndex,
                    background: 'transparent',
                    pointerEvents: 'none'
                }}
            >
                <div
                    className="wizard-container"
                    onClick={(e) => e.stopPropagation()}
                    style={{ pointerEvents: 'auto' }}
                >
                    <div className="wizard-header">
                        <h2>{isEditing ? 'Edit Container' : 'Create Container'}</h2>
                        <button className="close-button" onClick={onCancel}>×</button>
                    </div>
                    <div className="wizard-content">
                    {/* Basic Information Section */}
                    <div className="wizard-section">
                        <div className="wizard-section-title">
                            <i className="fas fa-info-circle"></i>
                            Basic Information
                        </div>
                        <div className="wizard-two-column">
                            <div className="form-group">
                                <label>
                                    <i className="fas fa-tag"></i>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={containerData.name}
                                    onChange={(e) => setContainerData({ ...containerData, name: e.target.value })}
                                    placeholder="Enter container name"
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <i className="fas fa-star"></i>
                                    Quality
                                </label>
                                <div className="select-wrapper">
                                    <select
                                        value={containerData.quality}
                                        onChange={(e) => setContainerData({ ...containerData, quality: e.target.value })}
                                        style={{ color: qualities.find(q => q.id === containerData.quality)?.color }}
                                    >
                                        {qualities.map(quality => (
                                            <option
                                                key={quality.id}
                                                value={quality.id}
                                                style={{ color: quality.color }}
                                            >
                                                {quality.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <i className="fas fa-align-left"></i>
                                Description
                            </label>
                            <textarea
                                value={containerData.description}
                                onChange={(e) => setContainerData({ ...containerData, description: e.target.value })}
                                placeholder="Enter container description"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Container Type & Size Section */}
                    <div className="wizard-section">
                        <div className="wizard-section-title">
                            <i className="fas fa-box"></i>
                            Container Type & Size
                        </div>
                        <div className="form-group">
                            <label>Container Type</label>
                            <div className="icon-grid">
                                {containerIcons.map(icon => (
                                    <div
                                        key={icon.id}
                                        className={`icon-option ${containerData.iconId === icon.id ? 'selected' : ''}`}
                                        onClick={() => handleIconChange(icon.id)}
                                        title={icon.name}
                                    >
                                        <img
                                            src={getIconUrl(icon.id, 'items', true)}
                                            alt={icon.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items', true);
                                            }}
                                        />
                                        <span>{icon.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <i className="fas fa-th"></i>
                                Grid Size
                            </label>
                            <div className="grid-size-inputs">
                                <div>
                                    <label>
                                        <i className="fas fa-arrows-alt-v"></i>
                                        Rows
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={containerData.rows}
                                        onChange={(e) => setContainerData({
                                            ...containerData,
                                            rows: Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                                        })}
                                    />
                                </div>
                                <div>
                                    <label>
                                        <i className="fas fa-arrows-alt-h"></i>
                                        Columns
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={containerData.cols}
                                        onChange={(e) => setContainerData({
                                            ...containerData,
                                            cols: Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="wizard-section">
                        <div className="wizard-section-title">
                            <i className="fas fa-lock"></i>
                            Security Settings
                        </div>
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={containerData.isLocked}
                                    onChange={(e) => setContainerData({
                                        ...containerData,
                                        isLocked: e.target.checked,
                                        lockType: e.target.checked ? containerData.lockType : 'none'
                                    })}
                                />
                                <span>Lock Container</span>
                            </label>
                        </div>

                            {containerData.isLocked && (
                                <>
                                    <div className="lock-type-selection">
                                        <label>
                                            <input
                                                type="radio"
                                                value="code"
                                                checked={containerData.lockType === 'code'}
                                                onChange={(e) => setContainerData({
                                                    ...containerData,
                                                    lockType: e.target.value,
                                                    lockDC: 0,
                                                    lockCode: ''
                                                })}
                                            />
                                            <span>Word Lock</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="numeric"
                                                checked={containerData.lockType === 'numeric'}
                                                onChange={(e) => setContainerData({
                                                    ...containerData,
                                                    lockType: e.target.value,
                                                    lockDC: 0,
                                                    lockCode: ''
                                                })}
                                            />
                                            <span>Number Lock</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="thievery"
                                                checked={containerData.lockType === 'thievery'}
                                                onChange={(e) => setContainerData({
                                                    ...containerData,
                                                    lockType: e.target.value,
                                                    lockCode: ''
                                                })}
                                            />
                                            <span>Thievery Check</span>
                                        </label>
                                    </div>

                                    {containerData.lockType === 'code' && (
                                        <div className="lock-details">
                                            <label>Secret Word:</label>
                                            <input
                                                type="text"
                                                value={containerData.lockCode}
                                                onChange={(e) => setContainerData({
                                                    ...containerData,
                                                    lockCode: e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase().slice(0, 20)
                                                })}
                                                placeholder="Enter word or phrase (letters and spaces only)"
                                                autoComplete="off"
                                                data-form-type="other"
                                            />
                                            <div className="hint-text">
                                                <i className="fas fa-info-circle"></i>
                                                Players will see this as a hangman-style puzzle with spaces preserved
                                            </div>
                                        </div>
                                    )}

                                    {containerData.lockType === 'numeric' && (
                                        <div className="lock-details">
                                            <label>Secret Number:</label>
                                            <input
                                                type="text"
                                                value={containerData.lockCode}
                                                onChange={(e) => setContainerData({
                                                    ...containerData,
                                                    lockCode: e.target.value.replace(/[^0-9]/g, '').slice(0, 8)
                                                })}
                                                placeholder="Enter numeric code (up to 8 digits)"
                                                autoComplete="off"
                                                data-form-type="other"
                                            />
                                            <div className="hint-text">
                                                <i className="fas fa-info-circle"></i>
                                                Players must enter the exact number to unlock
                                            </div>
                                        </div>
                                    )}

                                    {containerData.lockType === 'thievery' && (
                                        <div className="lock-details">
                                            <label>DC:</label>
                                            <input
                                                type="number"
                                                min="5"
                                                max="30"
                                                value={containerData.lockDC}
                                                onChange={(e) => setContainerData({
                                                    ...containerData,
                                                    lockDC: Math.min(30, Math.max(5, parseInt(e.target.value) || 5))
                                                })}
                                            />
                                        </div>
                                    )}

                                    <div className="lock-details">
                                        <label>Lock Description:</label>
                                        <textarea
                                            value={containerData.flavorText}
                                            onChange={(e) => setContainerData({
                                                ...containerData,
                                                flavorText: e.target.value
                                            })}
                                            placeholder="Describe what the lock looks like..."
                                            rows={2}
                                        />
                                    </div>

                                    <div className="lock-details">
                                        <label>Maximum Attempts:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={containerData.maxAttempts}
                                            onChange={(e) => setContainerData({
                                                ...containerData,
                                                maxAttempts: Math.min(10, Math.max(1, parseInt(e.target.value) || 1))
                                            })}
                                        />
                                    </div>

                                    <div className="lock-details">
                                        <label>On Final Failure:</label>
                                        <select
                                            value={containerData.failureAction}
                                            onChange={(e) => {
                                                const action = e.target.value;
                                                setContainerData(prev => ({
                                                    ...prev,
                                                    failureAction: action,
                                                    failureActionDetails: {
                                                        ...prev.failureActionDetails,
                                                        removeItems: action === 'remove_items',
                                                        destroyContainer: action === 'destroy',
                                                        triggerTrap: action === 'trap',
                                                        transformIntoCreature: action === 'transform'
                                                    }
                                                }));
                                            }}
                                        >
                                            <option value="none">Nothing Special</option>
                                            <option value="remove_items">Remove Some Items</option>
                                            <option value="destroy">Destroy Container</option>
                                            <option value="trap">Trigger Trap</option>
                                            <option value="transform">Transform into Creature</option>
                                        </select>
                                    </div>

                                    {containerData.failureAction === 'remove_items' && (
                                        <div className="lock-details">
                                            <label>Remove Percentage:</label>
                                            <div className="percentage-input">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={containerData.failureActionDetails.removePercentage}
                                                    onChange={(e) => setContainerData(prev => ({
                                                        ...prev,
                                                        failureActionDetails: {
                                                            ...prev.failureActionDetails,
                                                            removePercentage: Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                                                        }
                                                    }))}
                                                />
                                                <span>%</span>
                                            </div>
                                        </div>
                                    )}

                                    {containerData.failureAction === 'trap' && (
                                        <div className="lock-details">
                                            <label>Trap Description:</label>
                                            <textarea
                                                value={containerData.failureActionDetails.trapDetails}
                                                onChange={(e) => setContainerData(prev => ({
                                                    ...prev,
                                                    failureActionDetails: {
                                                        ...prev.failureActionDetails,
                                                        trapDetails: e.target.value
                                                    }
                                                }))}
                                                placeholder="Describe what happens when the trap triggers..."
                                                rows={2}
                                            />
                                        </div>
                                    )}

                                    {containerData.failureAction === 'transform' && (
                                        <div className="lock-details">
                                            <label>Creature Type:</label>
                                            <input
                                                type="text"
                                                value={containerData.failureActionDetails.creatureType}
                                                onChange={(e) => setContainerData(prev => ({
                                                    ...prev,
                                                    failureActionDetails: {
                                                        ...prev.failureActionDetails,
                                                        creatureType: e.target.value
                                                    }
                                                }))}
                                                placeholder="e.g., Mimic, Animated Armor..."
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                    </div>
                    </div>

                    <div className="wizard-footer">
                        <button className="cancel-button" onClick={onCancel}>
                            <i className="fas fa-times"></i>
                            Cancel
                        </button>
                        <button 
                            className="create-button" 
                            onClick={handleSubmit}
                            disabled={!containerData.name || (containerData.isLocked && containerData.lockType === 'code' && !containerData.lockCode)}
                        >
                            <i className="fas fa-plus"></i>
                            {isEditing ? 'Update Container' : 'Create Container'}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

export default ContainerWizard;
