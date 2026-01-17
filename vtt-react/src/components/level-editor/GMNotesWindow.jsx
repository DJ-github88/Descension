import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import DraggableWindow from '../windows/DraggableWindow';
import useItemStore from '../../store/itemStore';
import useCreatureStore from '../../store/creatureStore';
import useShareableStore from '../../store/shareableStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import SimpleCreatureTooltip from '../creature-wizard/components/common/SimpleCreatureTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { getIconUrl, getCreatureTokenIconUrl } from '../../utils/assetManager';
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
    const [handouts, setHandouts] = useState(gmNotesData?.handouts || []);
    const [structuredNotes, setStructuredNotes] = useState(gmNotesData?.structuredNotes || {
        readAloud: '',
        sensoryDetails: { smell: '', sound: '', touch: '', additional: '' },
        dynamicState: '',
        keyFeatures: '',
        gmHidden: { clues: '', triggers: '', consequences: '' }
    });
    const [title, setTitle] = useState(gmNotesData?.title || '');
    const [description, setDescription] = useState(gmNotesData?.description || '');
    const [isRenaming, setIsRenaming] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredCreature, setHoveredCreature] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [showCreatureTooltip, setShowCreatureTooltip] = useState(false);

    // Window size state for resizing
    const [windowSize, setWindowSize] = useState({ width: 700, height: 600 });
    const [isResizing, setIsResizing] = useState(false);

    const { items } = useItemStore();
    const { creatures } = useCreatureStore();
    const { showToPlayers } = useShareableStore();

    // Get stored items and creatures for this GM Notes object
    const storedItems = gmNotesData?.items || [];
    const storedCreatures = gmNotesData?.creatures || [];

    // Resize handlers
    const handleResizeStart = () => {
        setIsResizing(true);
    };

    const handleResize = (event, { size }) => {
        setWindowSize(size);
    };

    const handleResizeStop = (event, { size }) => {
        setIsResizing(false);
        setWindowSize(size);
    };

    // Update state when gmNotesData changes (ensure stable updates)
    useEffect(() => {
        if (!gmNotesData) return;

        if (gmNotesData.title !== undefined && gmNotesData.title !== title) {
            setTitle(gmNotesData.title || '');
        }
        if (gmNotesData.description !== undefined && gmNotesData.description !== description) {
            setDescription(gmNotesData.description || '');
        }
        if (gmNotesData.notes !== undefined && gmNotesData.notes !== notes) {
            setNotes(gmNotesData.notes || '');
        }
        if (gmNotesData.structuredNotes) {
            // Simple comparison for structuredNotes to avoid infinite loop
            const newStructuredNotes = gmNotesData.structuredNotes;
            if (JSON.stringify(newStructuredNotes) !== JSON.stringify(structuredNotes)) {
                setStructuredNotes(newStructuredNotes);
            }
        }
        if (gmNotesData.handouts && JSON.stringify(gmNotesData.handouts) !== JSON.stringify(handouts)) {
            setHandouts(gmNotesData.handouts || []);
        }
    }, [gmNotesData]);

    const handleNotesChange = (e) => {
        const newNotes = e.target.value;
        setNotes(newNotes);
        onUpdateNotes({
            ...gmNotesData,
            notes: newNotes
        });
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        onUpdateNotes({
            ...gmNotesData,
            title: newTitle
        });
    };

    const handleDescriptionChange = (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);
        onUpdateNotes({
            ...gmNotesData,
            description: newDescription
        });
    };

    const handleStructuredNotesChange = (section, subsection = null, value) => {
        const newStructuredNotes = { ...structuredNotes };

        if (subsection) {
            newStructuredNotes[section] = { ...newStructuredNotes[section], [subsection]: value };
        } else {
            newStructuredNotes[section] = value;
        }

        setStructuredNotes(newStructuredNotes);
        onUpdateNotes({
            ...gmNotesData,
            structuredNotes: newStructuredNotes
        });
    };

    const handleRename = () => {
        setIsRenaming(true);
    };

    const handleTitleBlur = () => {
        setIsRenaming(false);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsRenaming(false);
        }
        if (e.key === 'Escape') {
            setTitle(gmNotesData?.title || '');
            setIsRenaming(false);
        }
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
            item: item // Store the full item data in an 'item' property
        }));
    };

    const handleCreatureDragStart = (creature, e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            type: 'creature',
            id: creature.id,
            creature: creature // Store the full creature data in a separate property
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

    // Handouts handlers
    const handleHandoutDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newHandout = {
                    id: `handout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'image',
                    title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
                    content: event.target.result,
                    createdAt: Date.now()
                };

                const updatedHandouts = [...handouts, newHandout];
                setHandouts(updatedHandouts);
                onUpdateNotes({
                    ...gmNotesData,
                    handouts: updatedHandouts
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const removeHandout = (handoutId) => {
        const updatedHandouts = handouts.filter(h => h.id !== handoutId);
        setHandouts(updatedHandouts);
        onUpdateNotes({
            ...gmNotesData,
            handouts: updatedHandouts
        });
    };

    const showHandoutToPlayers = (handout) => {
        showToPlayers({
            type: handout.type,
            title: handout.title,
            content: handout.content,
            description: '',
            background: 'parchment'
        });
    };

    if (!isOpen) return null;

    return createPortal(
        <DraggableWindow
            isOpen={isOpen}
            onClose={onClose}
            defaultPosition={position}
            defaultSize={windowSize}
            className="gm-notes-window"
            handleClassName="gm-notes-header"
        >
            <Resizable
                width={windowSize.width}
                height={windowSize.height}
                minConstraints={[500, 400]}
                maxConstraints={[1200, 900]}
                onResizeStart={handleResizeStart}
                onResize={handleResize}
                onResizeStop={handleResizeStop}
                resizeHandles={['se']}
                className={isResizing ? 'resizing' : ''}
            >
                <div
                    className="gm-notes-container"
                    style={{
                        width: windowSize.width,
                        height: windowSize.height
                    }}
                >
                    <div className="gm-notes-header draggable-window-handle">
                        <div className="gm-notes-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <i className="fas fa-scroll"></i>
                            {isRenaming ? (
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    onBlur={handleTitleBlur}
                                    onKeyDown={handleTitleKeyDown}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        minWidth: '200px',
                                        outline: 'none'
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    onClick={handleRename}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    title="Click to rename"
                                >
                                    {title || 'GM Prepared Notes'}
                                </span>
                            )}
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
                            className={`gm-notes-tab ${activeTab === 'handouts' ? 'active' : ''}`}
                            onClick={() => setActiveTab('handouts')}
                        >
                            Handouts ({handouts.length})
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
                        {activeTab === 'handouts' && (
                            <div
                                className="gm-notes-section gm-handouts-section"
                                onDrop={handleHandoutDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <div className="gm-section-header">
                                    <h4>Handouts</h4>
                                    <p>Drag images here to create handouts that can be shown to players.</p>
                                </div>
                                <div className="gm-handouts-grid">
                                    {handouts.map(handout => (
                                        <div key={handout.id} className="gm-handout">
                                            <div className="gm-handout-preview">
                                                {handout.type === 'image' ? (
                                                    <img
                                                        src={handout.content}
                                                        alt={handout.title}
                                                        className="gm-handout-image"
                                                    />
                                                ) : (
                                                    <div className="gm-handout-document">
                                                        <i className="fas fa-file-alt"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="gm-handout-info">
                                                <div className="gm-handout-title">{handout.title}</div>
                                                <div className="gm-handout-actions">
                                                    <button
                                                        className="gm-handout-show"
                                                        onClick={() => showHandoutToPlayers(handout)}
                                                        title="Show to Players"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="gm-handout-remove"
                                                        onClick={() => removeHandout(handout.id)}
                                                        title="Remove handout"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {handouts.length === 0 && (
                                        <div className="gm-empty-message">
                                            No handouts added. Drag images here from your file explorer.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'notes' && (
                            <div className="gm-notes-section">
                                <div className="gm-notes-structured">
                                    {/* Purpose/Example (Description shown in tooltip) */}
                                    <div className="gm-notes-field">
                                        <label className="gm-notes-label">
                                            <i className="fas fa-lightbulb"></i>
                                            Purpose/Example (shown in tooltip)
                                        </label>
                                        <textarea
                                            className="gm-notes-textarea"
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            placeholder="Ancient temple chamber that tests greed and patience. The room is safe until disturbed; careless looting or rushed movement escalates it into a flood + alarm sequence."
                                            rows={3}
                                        />
                                    </div>

                                    {/* What to read aloud to players */}
                                    <div className="gm-notes-field">
                                        <label className="gm-notes-label">
                                            <i className="fas fa-volume-up"></i>
                                            Read Aloud to Players
                                        </label>
                                        <textarea
                                            className="gm-notes-textarea"
                                            value={structuredNotes.readAloud}
                                            onChange={(e) => handleStructuredNotesChange('readAloud', null, e.target.value)}
                                            placeholder="A low, arched doorway opens into a stone chapel half-swallowed by dark water. An altar rises from the flooded floor, and a saint's statue watches with a cracked, blind face."
                                            rows={4}
                                        />
                                    </div>

                                    {/* Sensory Details */}
                                    <div className="gm-notes-field">
                                        <label className="gm-notes-label">
                                            <i className="fas fa-eye"></i>
                                            Sensory Details
                                        </label>
                                        <div className="gm-notes-sensory-grid">
                                            <div className="gm-notes-sensory-item">
                                                <label className="gm-notes-sensory-label">Smell</label>
                                                <input
                                                    type="text"
                                                    className="gm-notes-sensory-input"
                                                    value={structuredNotes.sensoryDetails.smell}
                                                    onChange={(e) => handleStructuredNotesChange('sensoryDetails', 'smell', e.target.value)}
                                                    placeholder="Mold, damp stone, faint incense"
                                                />
                                            </div>
                                            <div className="gm-notes-sensory-item">
                                                <label className="gm-notes-sensory-label">Sound</label>
                                                <input
                                                    type="text"
                                                    className="gm-notes-sensory-input"
                                                    value={structuredNotes.sensoryDetails.sound}
                                                    onChange={(e) => handleStructuredNotesChange('sensoryDetails', 'sound', e.target.value)}
                                                    placeholder="Distant dripping, faint echoes"
                                                />
                                            </div>
                                            <div className="gm-notes-sensory-item">
                                                <label className="gm-notes-sensory-label">Touch</label>
                                                <input
                                                    type="text"
                                                    className="gm-notes-sensory-input"
                                                    value={structuredNotes.sensoryDetails.touch}
                                                    onChange={(e) => handleStructuredNotesChange('sensoryDetails', 'touch', e.target.value)}
                                                    placeholder="Cold, slick stone walls"
                                                />
                                            </div>
                                            <div className="gm-notes-sensory-item">
                                                <label className="gm-notes-sensory-label">Additional</label>
                                                <input
                                                    type="text"
                                                    className="gm-notes-sensory-input"
                                                    value={structuredNotes.sensoryDetails.additional}
                                                    onChange={(e) => handleStructuredNotesChange('sensoryDetails', 'additional', e.target.value)}
                                                    placeholder="Taste: metallic tang in the air"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic State */}
                                    <div className="gm-notes-field">
                                        <label className="gm-notes-label">
                                            <i className="fas fa-wind"></i>
                                            Dynamic State (what they notice)
                                        </label>
                                        <textarea
                                            className="gm-notes-textarea"
                                            value={structuredNotes.dynamicState}
                                            onChange={(e) => handleStructuredNotesChange('dynamicState', null, e.target.value)}
                                            placeholder="The waterline subtly rises and falls in pulses. The statue's head is angled as if listening — and the longer you stand still, the more you notice faint vibrations in the stone."
                                            rows={3}
                                        />
                                    </div>

                                    {/* Key Features / Landmarks */}
                                    <div className="gm-notes-field">
                                        <label className="gm-notes-label">
                                            <i className="fas fa-map-marker-alt"></i>
                                            Key Features / Landmarks (with hooks)
                                        </label>
                                        <textarea
                                            className="gm-notes-textarea"
                                            value={structuredNotes.keyFeatures}
                                            onChange={(e) => handleStructuredNotesChange('keyFeatures', null, e.target.value)}
                                            placeholder={`Flooded floor — slows movement, muffles footsteps, hides hazards

Stone altar — dry platform, carvings, offerings bowl

Blind saint statue — rotatable base, hollow interior

Wall niches — old reliquaries, rotten candles, clue plaques`}
                                            rows={6}
                                        />
                                    </div>

                                    {/* GM Hidden Section */}
                                    <div className="gm-notes-field gm-notes-hidden">
                                        <label className="gm-notes-label gm-notes-hidden-label">
                                            <i className="fas fa-eye-slash"></i>
                                            GM Hidden Section
                                        </label>

                                        <div className="gm-notes-hidden-content">
                                            <div className="gm-notes-subfield">
                                                <label className="gm-notes-sublabel">Environmental Clues</label>
                                                <textarea
                                                    className="gm-notes-textarea gm-notes-hidden-textarea"
                                                    value={structuredNotes.gmHidden.clues}
                                                    onChange={(e) => handleStructuredNotesChange('gmHidden', 'clues', e.target.value)}
                                                    placeholder={`Water ripples avoid the altar's perimeter, like something blocks the current

Wax drips on the niche plaques are fresh compared to the dust

Scrape marks near the statue's base suggest it has been turned before`}
                                                    rows={4}
                                                />
                                            </div>

                                            <div className="gm-notes-subfield">
                                                <label className="gm-notes-sublabel">Triggers</label>
                                                <textarea
                                                    className="gm-notes-textarea gm-notes-hidden-textarea"
                                                    value={structuredNotes.gmHidden.triggers}
                                                    onChange={(e) => handleStructuredNotesChange('gmHidden', 'triggers', e.target.value)}
                                                    placeholder={`IF someone takes an offering / disturbs the altar → a soft click; the water begins to rise

IF someone steps hard on the altar ring → hidden plates depress; the statue slowly turns

IF someone forces the drain-grate → a wet gasp; something stirs below

IF the statue is turned to face the doorway → a hidden latch releases (secret compartment)`}
                                                    rows={6}
                                                />
                                            </div>

                                            <div className="gm-notes-subfield">
                                                <label className="gm-notes-sublabel">Consequences</label>
                                                <textarea
                                                    className="gm-notes-textarea gm-notes-hidden-textarea"
                                                    value={structuredNotes.gmHidden.consequences}
                                                    onChange={(e) => handleStructuredNotesChange('gmHidden', 'consequences', e.target.value)}
                                                    placeholder={`IF the room stays in "alarm" state too long → a distant bell tolls (draws attention)

Careful parties get clues and control the mechanism. Reckless parties trigger rising water + noise, turning the room into a timed problem (and possibly calling trouble).`}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                                    src={getIconUrl(item.iconId || 'inv_misc_questionmark', 'items')}
                                                    alt={item.name}
                                                    className="gm-item-icon"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
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
                                                    src={getCreatureTokenIconUrl(creature.tokenIcon, creature.type)}
                                                    alt={creature.name}
                                                    className="gm-creature-icon"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getCreatureTokenIconUrl(null, creature.type);
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
            </Resizable>

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
                >
                    <div
                        className="creature-card-hover-preview-interactive"
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
                    </div>
                </div>,
                document.body
            )}
        </DraggableWindow>,
        document.body
    );
};

export default GMNotesWindow;
