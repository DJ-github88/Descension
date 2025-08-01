import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import DraggableWindow from '../windows/DraggableWindow';
import useItemStore from '../../store/itemStore';
import useCreatureStore from '../../store/creatureStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import SimpleCreatureTooltip from '../creature-wizard/components/common/SimpleCreatureTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import '../../styles/gm-notes-window.css';

const GMNotesWindow = ({ 
    isOpen, 
    onClose, 
    gmNotesData, 
    onUpdateNotes,
    position = { x: 100, y: 100 }
}) => {
    const [activeTab, setActiveTab] = useState('notes');
    const [notes, setNotes] = useState(gmNotesData?.notes || '');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredCreature, setHoveredCreature] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [showCreatureTooltip, setShowCreatureTooltip] = useState(false);
    
    const { items } = useItemStore();
    const { creatures } = useCreatureStore();
    
    // Get stored items and creatures for this GM Notes object
    const storedItems = gmNotesData?.items || [];
    const storedCreatures = gmNotesData?.creatures || [];

    const handleNotesChange = (e) => {
        const newNotes = e.target.value;
        setNotes(newNotes);
        onUpdateNotes({
            ...gmNotesData,
            notes: newNotes
        });
    };

    const handleItemDrop = (e) => {
        e.preventDefault();
        try {
            const itemData = e.dataTransfer.getData('text/plain');
            if (itemData) {
                const item = JSON.parse(itemData);
                if (item.type === 'item') {
                    const updatedItems = [...storedItems, item.id];
                    onUpdateNotes({
                        ...gmNotesData,
                        items: updatedItems
                    });
                }
            }
        } catch (error) {
            console.error('Error handling item drop:', error);
        }
    };

    const handleCreatureDrop = (e) => {
        e.preventDefault();
        try {
            const creatureData = e.dataTransfer.getData('text/plain');
            if (creatureData) {
                const creature = JSON.parse(creatureData);
                if (creature.type === 'creature') {
                    const updatedCreatures = [...storedCreatures, creature.id];
                    onUpdateNotes({
                        ...gmNotesData,
                        creatures: updatedCreatures
                    });
                }
            }
        } catch (error) {
            console.error('Error handling creature drop:', error);
        }
    };

    const handleItemMouseEnter = (item, e) => {
        setHoveredItem(item);
        setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
        setShowTooltip(true);
    };

    const handleItemMouseMove = (e) => {
        if (showTooltip && hoveredItem) {
            setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
        }
    };

    const handleItemMouseLeave = () => {
        setHoveredItem(null);
        setShowTooltip(false);
    };

    const handleCreatureMouseEnter = (creature, e) => {
        setHoveredCreature(creature);
        setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
        setShowCreatureTooltip(true);
    };

    const handleCreatureMouseMove = (e) => {
        if (showCreatureTooltip && hoveredCreature) {
            setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 });
        }
    };

    const handleCreatureMouseLeave = () => {
        setHoveredCreature(null);
        setShowCreatureTooltip(false);
    };

    const handleItemDragStart = (item, e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'item',
            id: item.id,
            ...item
        }));
    };

    const handleCreatureDragStart = (creature, e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'creature',
            id: creature.id,
            ...creature
        }));
        e.dataTransfer.setData('creature/id', creature.id);
    };

    const removeItem = (itemId) => {
        const updatedItems = storedItems.filter(id => id !== itemId);
        onUpdateNotes({
            ...gmNotesData,
            items: updatedItems
        });
    };

    const removeCreature = (creatureId) => {
        const updatedCreatures = storedCreatures.filter(id => id !== creatureId);
        onUpdateNotes({
            ...gmNotesData,
            creatures: updatedCreatures
        });
    };

    if (!isOpen) return null;

    return createPortal(
        <DraggableWindow
            isOpen={isOpen}
            onClose={onClose}
            defaultPosition={position}
            className="gm-notes-window"
            handleClassName="gm-notes-header"
        >
            <div className="gm-notes-container">
                <div className="gm-notes-header draggable-window-handle">
                    <div className="gm-notes-title">
                        <i className="fas fa-scroll"></i>
                        GM Prepared Notes
                    </div>
                    <button className="gm-notes-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="gm-notes-tabs">
                    <button
                        className={`gm-notes-tab ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        Notes
                    </button>
                    <button
                        className={`gm-notes-tab ${activeTab === 'items' ? 'active' : ''}`}
                        onClick={() => setActiveTab('items')}
                    >
                        Items ({storedItems.length})
                    </button>
                    <button
                        className={`gm-notes-tab ${activeTab === 'creatures' ? 'active' : ''}`}
                        onClick={() => setActiveTab('creatures')}
                    >
                        Creatures ({storedCreatures.length})
                    </button>
                </div>

                <div className="gm-notes-content">
                    {activeTab === 'notes' && (
                        <div className="gm-notes-section">
                            <textarea
                                className="gm-notes-textarea"
                                value={notes}
                                onChange={handleNotesChange}
                                placeholder="Write your GM notes here... Remember details about this location, NPCs, plot hooks, secrets, etc."
                                rows={12}
                            />
                        </div>
                    )}

                    {activeTab === 'items' && (
                        <div 
                            className="gm-notes-section gm-items-section"
                            onDrop={handleItemDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="gm-section-header">
                                <h4>Stored Items</h4>
                                <p>Drag items here to store them, then drag them out to the grid when needed.</p>
                            </div>
                            <div className="gm-items-grid">
                                {storedItems.map(itemId => {
                                    const item = items.find(i => i.id === itemId);
                                    if (!item) return null;
                                    
                                    return (
                                        <div
                                            key={itemId}
                                            className="gm-item"
                                            draggable
                                            onDragStart={(e) => handleItemDragStart(item, e)}
                                            onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                                            onMouseMove={handleItemMouseMove}
                                            onMouseLeave={handleItemMouseLeave}
                                        >
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${item.iconId || 'inv_misc_questionmark'}.jpg`}
                                                alt={item.name}
                                                className="gm-item-icon"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                                }}
                                            />
                                            <div className="gm-item-name">{item.name}</div>
                                            <button
                                                className="gm-item-remove"
                                                onClick={() => removeItem(itemId)}
                                                title="Remove from storage"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    );
                                })}
                                {storedItems.length === 0 && (
                                    <div className="gm-empty-message">
                                        No items stored. Drag items from the item library here.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'creatures' && (
                        <div 
                            className="gm-notes-section gm-creatures-section"
                            onDrop={handleCreatureDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="gm-section-header">
                                <h4>Stored Creatures</h4>
                                <p>Drag creatures here to store them, then drag them out to the grid when needed.</p>
                            </div>
                            <div className="gm-creatures-grid">
                                {storedCreatures.map(creatureId => {
                                    const creature = creatures.find(c => c.id === creatureId);
                                    if (!creature) return null;
                                    
                                    return (
                                        <div
                                            key={creatureId}
                                            className="gm-creature"
                                            draggable
                                            onDragStart={(e) => handleCreatureDragStart(creature, e)}
                                            onMouseEnter={(e) => handleCreatureMouseEnter(creature, e)}
                                            onMouseMove={handleCreatureMouseMove}
                                            onMouseLeave={handleCreatureMouseLeave}
                                        >
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg`}
                                                alt={creature.name}
                                                className="gm-creature-icon"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                                }}
                                            />
                                            <div className="gm-creature-name">{creature.name}</div>
                                            <button
                                                className="gm-creature-remove"
                                                onClick={() => removeCreature(creatureId)}
                                                title="Remove from storage"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    );
                                })}
                                {storedCreatures.length === 0 && (
                                    <div className="gm-empty-message">
                                        No creatures stored. Drag creatures from the creature library here.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Item Tooltip */}
            {showTooltip && hoveredItem && (
                <TooltipPortal>
                    <div
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        <ItemTooltip item={hoveredItem} />
                    </div>
                </TooltipPortal>
            )}

            {/* Creature Tooltip */}
            {showCreatureTooltip && hoveredCreature && createPortal(
                <div
                    className="creature-card-hover-preview-portal"
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        zIndex: 999999999
                    }}
                    onWheel={(e) => {
                        // Stop propagation to prevent background scrolling when scrolling tooltip
                        e.stopPropagation();
                    }}
                    onMouseEnter={() => {
                        // Keep tooltip visible when hovering over it
                        setShowCreatureTooltip(true);
                    }}
                    onMouseLeave={() => {
                        // Hide tooltip when leaving it
                        setShowCreatureTooltip(false);
                        setHoveredCreature(null);
                    }}
                >
                    <SimpleCreatureTooltip creature={hoveredCreature} />
                </div>,
                document.body
            )}
        </DraggableWindow>,
        document.body
    );
};

export default GMNotesWindow;
