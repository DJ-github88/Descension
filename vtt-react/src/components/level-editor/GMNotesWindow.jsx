import React, { useState, useRef, useEffect, useMemo } from 'react';
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

const NOTE_ICONS = [
    { id: 'scroll', icon: 'fa-scroll', label: 'General Note', color: '#8B4513' },
    { id: 'location', icon: 'fa-map-marker-alt', label: 'Location', color: '#2d6a4f' },
    { id: 'npc', icon: 'fa-users', label: 'NPC', color: '#6a4c93' },
    { id: 'encounter', icon: 'fa-skull-crossbones', label: 'Encounter', color: '#9b2226' },
    { id: 'trap', icon: 'fa-exclamation-triangle', label: 'Trap', color: '#e76f51' },
    { id: 'quest', icon: 'fa-flag', label: 'Quest', color: '#264653' },
    { id: 'puzzle', icon: 'fa-puzzle-piece', label: 'Puzzle', color: '#457b9d' },
    { id: 'treasure', icon: 'fa-gem', label: 'Treasure', color: '#b5838d' },
    { id: 'lore', icon: 'fa-book-open', label: 'Lore', color: '#5a189a' },
    { id: 'shop', icon: 'fa-store', label: 'Shop', color: '#606c38' },
    { id: 'secret', icon: 'fa-eye-slash', label: 'Secret', color: '#4a4e69' },
    { id: 'monster', icon: 'fa-dragon', label: 'Monster', color: '#6b0f1a' },
    { id: 'puzzle-door', icon: 'fa-dungeon', label: 'Dungeon', color: '#343a40' },
    { id: 'event', icon: 'fa-bolt', label: 'Event', color: '#e9c46a' },
    { id: 'read-aloud', icon: 'fa-book-reader', label: 'Read Aloud', color: '#d4af37' },
    { id: 'safe-rest', icon: 'fa-campground', label: 'Safe Haven', color: '#2a9d8f' },
];

const PREDEFINED_TAGS = [
    'Trap', 'Mystery', 'Combat', 'Social', 'Ambush', 'Puzzle',
    'Lore', 'Quest', 'Treasure', 'Moral Quandary', 'Sanctuary',
    'Shop', 'Job', 'NPC', 'Environmental', 'Stealth', 'Boss'
];

const BLOCK_TYPES = [
    { id: 'read-aloud', icon: 'fa-scroll', label: 'Read Aloud', color: '#d4af37' },
    { id: 'obvious', icon: 'fa-eye', label: 'Obvious', color: '#2d6a4f' },
    { id: 'hidden', icon: 'fa-search', label: 'Hidden', color: '#457b9d' },
    { id: 'conditional', icon: 'fa-question-circle', label: 'If/Then', color: '#6a4c93' },
];

const TAG_COLORS = {
    'Trap': { bg: 'rgba(155,34,38,0.12)', border: 'rgba(155,34,38,0.35)', text: '#9b2226' },
    'Mystery': { bg: 'rgba(69,123,157,0.12)', border: 'rgba(69,123,157,0.35)', text: '#457b9d' },
    'Combat': { bg: 'rgba(194,88,40,0.12)', border: 'rgba(194,88,40,0.35)', text: '#c25828' },
    'Social': { bg: 'rgba(106,76,147,0.12)', border: 'rgba(106,76,147,0.35)', text: '#6a4c93' },
    'Ambush': { bg: 'rgba(180,74,30,0.12)', border: 'rgba(180,74,30,0.35)', text: '#b44a1e' },
    'Puzzle': { bg: 'rgba(42,110,122,0.12)', border: 'rgba(42,110,122,0.35)', text: '#2a6e7a' },
    'Lore': { bg: 'rgba(90,24,154,0.12)', border: 'rgba(90,24,154,0.35)', text: '#5a189a' },
    'Quest': { bg: 'rgba(38,70,83,0.12)', border: 'rgba(38,70,83,0.35)', text: '#264653' },
    'Treasure': { bg: 'rgba(181,131,141,0.12)', border: 'rgba(181,131,141,0.35)', text: '#b5838d' },
    'Moral Quandary': { bg: 'rgba(106,76,147,0.15)', border: 'rgba(106,76,147,0.45)', text: '#6a4c93' },
    'Sanctuary': { bg: 'rgba(42,157,143,0.12)', border: 'rgba(42,157,143,0.35)', text: '#2a9d8f' },
    'Shop': { bg: 'rgba(96,108,56,0.12)', border: 'rgba(96,108,56,0.35)', text: '#606c38' },
    'Job': { bg: 'rgba(180,130,30,0.12)', border: 'rgba(180,130,30,0.35)', text: '#b4821e' },
    'NPC': { bg: 'rgba(106,76,147,0.12)', border: 'rgba(106,76,147,0.35)', text: '#6a4c93' },
    'Environmental': { bg: 'rgba(42,157,143,0.12)', border: 'rgba(42,157,143,0.35)', text: '#2a9d8f' },
    'Stealth': { bg: 'rgba(74,78,105,0.12)', border: 'rgba(74,78,105,0.35)', text: '#4a4e69' },
    'Boss': { bg: 'rgba(107,15,26,0.12)', border: 'rgba(107,15,26,0.35)', text: '#6b0f1a' },
};

const getNoteIcon = (iconId) => NOTE_ICONS.find(i => i.id === iconId) || NOTE_ICONS[0];
const getBlockConfig = (type) => BLOCK_TYPES.find(b => b.id === type) || BLOCK_TYPES[0];
const getTagColor = (tag) => TAG_COLORS[tag] || { bg: 'rgba(139,69,19,0.08)', border: 'rgba(139,69,19,0.25)', text: '#8B4513' };
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createEmptyStructuredNotes = () => ({
    sensoryDetails: { smell: '', sound: '', touch: '', additional: '' },
    sections: [
        {
            id: generateId('section'),
            title: 'Scene Overview',
            blocks: [],
            column: 'left'
        }
    ],
    tags: []
});

const migrateOldFormat = (oldNotes) => {
    const migrated = createEmptyStructuredNotes();
    migrated.sensoryDetails = oldNotes.sensoryDetails || migrated.sensoryDetails;
    const blocks = [];

    if (oldNotes.readAloud) {
        blocks.push({ id: generateId('block'), type: 'read-aloud', text: oldNotes.readAloud });
    }
    if (oldNotes.dynamicState) {
        blocks.push({ id: generateId('block'), type: 'obvious', text: oldNotes.dynamicState });
    }
    if (oldNotes.keyFeatures) {
        blocks.push({ id: generateId('block'), type: 'obvious', text: oldNotes.keyFeatures });
    }
    if (oldNotes.gmHidden?.clues) {
        blocks.push({ id: generateId('block'), type: 'hidden', text: oldNotes.gmHidden.clues });
    }
    if (oldNotes.gmHidden?.triggers) {
        blocks.push({ id: generateId('block'), type: 'conditional', text: oldNotes.gmHidden.triggers });
    }
    if (oldNotes.gmHidden?.consequences) {
        blocks.push({ id: generateId('block'), type: 'conditional', text: oldNotes.gmHidden.consequences });
    }

    migrated.sections[0].blocks = blocks;
    return migrated;
};

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
    const [structuredNotes, setStructuredNotes] = useState(() => {
        const raw = gmNotesData?.structuredNotes;
        if (!raw) return createEmptyStructuredNotes();
        if (raw.sections) return { ...createEmptyStructuredNotes(), ...raw, sensoryDetails: raw.sensoryDetails || createEmptyStructuredNotes().sensoryDetails };
        return migrateOldFormat(raw);
    });
    const [title, setTitle] = useState(gmNotesData?.title || '');
    const [description, setDescription] = useState(gmNotesData?.description || '');
    const [noteIconId, setNoteIconId] = useState(gmNotesData?.noteIcon || 'scroll');
    const [isRenaming, setIsRenaming] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [mode, setMode] = useState('prep');
    const [sensoryExpanded, setSensoryExpanded] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredCreature, setHoveredCreature] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [showCreatureTooltip, setShowCreatureTooltip] = useState(false);
    const [npcs, setNpcs] = useState(gmNotesData?.npcs || []);

    const [windowSize, setWindowSize] = useState({ width: 700, height: 600 });
    const [isResizing, setIsResizing] = useState(false);
    const iconPickerRef = useRef(null);

    const { items } = useItemStore();
    const { creatures } = useCreatureStore();
    const { showToPlayers } = useShareableStore();

    const storedItems = gmNotesData?.items || [];
    const storedCreatures = gmNotesData?.creatures || [];

    const handleResizeStart = () => setIsResizing(true);
    const handleResize = (event, { size }) => setWindowSize(size);
    const handleResizeStop = (event, { size }) => { setIsResizing(false); setWindowSize(size); };

    const isSession = mode === 'session';

    const sectionsWithColumns = useMemo(() => {
        return structuredNotes.sections.map((s, i) => ({
            ...s,
            column: s.column || (i % 2 === 0 ? 'left' : 'right')
        }));
    }, [structuredNotes.sections]);

    const leftSections = sectionsWithColumns.filter(s => s.column === 'left');
    const rightSections = sectionsWithColumns.filter(s => s.column === 'right');

    const hasSensoryDetails = structuredNotes.sensoryDetails &&
        Object.values(structuredNotes.sensoryDetails).some(v => v && v.trim());

    useEffect(() => {
        if (!gmNotesData) return;
        if (gmNotesData.title !== undefined && gmNotesData.title !== title) setTitle(gmNotesData.title || '');
        if (gmNotesData.description !== undefined && gmNotesData.description !== description) setDescription(gmNotesData.description || '');
        if (gmNotesData.notes !== undefined && gmNotesData.notes !== notes) setNotes(gmNotesData.notes || '');
        if (gmNotesData.structuredNotes) {
            const incoming = gmNotesData.structuredNotes;
            const migrated = incoming.sections
                ? { ...createEmptyStructuredNotes(), ...incoming, sensoryDetails: incoming.sensoryDetails || createEmptyStructuredNotes().sensoryDetails }
                : migrateOldFormat(incoming);
            if (JSON.stringify(migrated) !== JSON.stringify(structuredNotes)) setStructuredNotes(migrated);
        }
        if (gmNotesData.handouts && JSON.stringify(gmNotesData.handouts) !== JSON.stringify(handouts)) setHandouts(gmNotesData.handouts || []);
        if (gmNotesData.noteIcon && gmNotesData.noteIcon !== noteIconId) setNoteIconId(gmNotesData.noteIcon);
        if (gmNotesData.npcs && JSON.stringify(gmNotesData.npcs) !== JSON.stringify(npcs)) setNpcs(gmNotesData.npcs || []);
    }, [gmNotesData]);

    const pushUpdate = (partial) => {
        onUpdateNotes({ ...gmNotesData, ...partial });
    };

    const handleTitleChange = (e) => { setTitle(e.target.value); pushUpdate({ title: e.target.value }); };
    const handleDescriptionChange = (e) => { setDescription(e.target.value); pushUpdate({ description: e.target.value }); };
    const handleNotesChange = (e) => { setNotes(e.target.value); pushUpdate({ notes: e.target.value }); };

    const handleSensoryChange = (field, value) => {
        const newStructured = {
            ...structuredNotes,
            sensoryDetails: { ...structuredNotes.sensoryDetails, [field]: value }
        };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const handleTagToggle = (tag) => {
        const current = structuredNotes.tags || [];
        const newTags = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
        const newStructured = { ...structuredNotes, tags: newTags };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const addSection = () => {
        const newSection = { id: generateId('section'), title: '', blocks: [], column: 'left' };
        const newStructured = { ...structuredNotes, sections: [...structuredNotes.sections, newSection] };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const updateSectionTitle = (sectionId, newTitle) => {
        const newStructured = {
            ...structuredNotes,
            sections: structuredNotes.sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s)
        };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const removeSection = (sectionId) => {
        if (structuredNotes.sections.length <= 1) return;
        const newStructured = { ...structuredNotes, sections: structuredNotes.sections.filter(s => s.id !== sectionId) };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const toggleSectionColumn = (sectionId) => {
        const newStructured = {
            ...structuredNotes,
            sections: structuredNotes.sections.map(s =>
                s.id === sectionId ? { ...s, column: (s.column === 'left') ? 'right' : 'left' } : s
            )
        };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const addBlock = (sectionId, blockType) => {
        const newBlock = { id: generateId('block'), type: blockType, text: '' };
        const newStructured = {
            ...structuredNotes,
            sections: structuredNotes.sections.map(s =>
                s.id === sectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s
            )
        };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const updateBlockText = (sectionId, blockId, text) => {
        const newStructured = {
            ...structuredNotes,
            sections: structuredNotes.sections.map(s =>
                s.id === sectionId
                    ? { ...s, blocks: s.blocks.map(b => b.id === blockId ? { ...b, text } : b) }
                    : s
            )
        };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const removeBlock = (sectionId, blockId) => {
        const newStructured = {
            ...structuredNotes,
            sections: structuredNotes.sections.map(s =>
                s.id === sectionId ? { ...s, blocks: s.blocks.filter(b => b.id !== blockId) } : s
            )
        };
        setStructuredNotes(newStructured);
        pushUpdate({ structuredNotes: newStructured });
    };

    const handleIconSelect = (iconId) => {
        setNoteIconId(iconId);
        setShowIconPicker(false);
        pushUpdate({ noteIcon: iconId });
    };

    useEffect(() => {
        if (!showIconPicker) return;
        const handler = (e) => {
            if (iconPickerRef.current && !iconPickerRef.current.contains(e.target)) setShowIconPicker(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showIconPicker]);

    const handleRename = () => setIsRenaming(true);
    const handleTitleBlur = () => setIsRenaming(false);
    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); setIsRenaming(false); }
        if (e.key === 'Escape') { setTitle(gmNotesData?.title || ''); setIsRenaming(false); }
    };

    const addNpc = () => {
        const newNpc = { id: generateId('npc'), name: '', race: '', desc: '' };
        const updated = [...npcs, newNpc];
        setNpcs(updated);
        pushUpdate({ npcs: updated });
    };

    const updateNpc = (npcId, field, value) => {
        const updated = npcs.map(n => n.id === npcId ? { ...n, [field]: value } : n);
        setNpcs(updated);
        pushUpdate({ npcs: updated });
    };

    const removeNpc = (npcId) => {
        const updated = npcs.filter(n => n.id !== npcId);
        setNpcs(updated);
        pushUpdate({ npcs: updated });
    };

    const handleItemDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const itemData = e.dataTransfer.getData('text/plain');
            if (itemData) {
                const item = JSON.parse(itemData);
                if (item.type === 'item') pushUpdate({ items: [...storedItems, item.id] });
            }
        } catch (error) { console.error('Error handling item drop:', error); }
    };

    const handleCreatureDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const creatureData = e.dataTransfer.getData('text/plain');
            if (creatureData) {
                const creature = JSON.parse(creatureData);
                if (creature.type === 'creature') pushUpdate({ creatures: [...storedCreatures, creature.id] });
            }
        } catch (error) { console.error('Error handling creature drop:', error); }
    };

    const handleItemMouseEnter = (item, e) => { setHoveredItem(item); setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 }); setShowTooltip(true); };
    const handleItemMouseMove = (e) => { if (showTooltip && hoveredItem) setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 }); };
    const handleItemMouseLeave = () => { setHoveredItem(null); setShowTooltip(false); };
    const handleCreatureMouseEnter = (creature, e) => { setHoveredCreature(creature); setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 }); setShowCreatureTooltip(true); };
    const handleCreatureMouseMove = (e) => { if (showCreatureTooltip && hoveredCreature) setTooltipPosition({ x: e.clientX + 15, y: e.clientY - 10 }); };
    const handleCreatureMouseLeave = () => { setHoveredCreature(null); setShowCreatureTooltip(false); };

    const handleItemDragStart = (item, e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'item', id: item.id, item }));
    };

    const handleCreatureDragStart = (creature, e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'creature', id: creature.id, creature }));
        e.dataTransfer.setData('creature/id', creature.id);
    };

    const removeItem = (itemId) => pushUpdate({ items: storedItems.filter(id => id !== itemId) });
    const removeCreature = (creatureId) => pushUpdate({ creatures: storedCreatures.filter(id => id !== creatureId) });

    const handleHandoutDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newHandout = {
                    id: generateId('handout'),
                    type: 'image',
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    content: event.target.result,
                    createdAt: Date.now()
                };
                const updated = [...handouts, newHandout];
                setHandouts(updated);
                pushUpdate({ handouts: updated });
            };
            reader.readAsDataURL(file);
        });
    };

    const removeHandout = (handoutId) => {
        const updated = handouts.filter(h => h.id !== handoutId);
        setHandouts(updated);
        pushUpdate({ handouts: updated });
    };

    const showHandoutToPlayers = (handout) => {
        showToPlayers({ type: handout.type, title: handout.title, content: handout.content, description: '', background: 'parchment' });
    };

    const SENSORY_ICONS = { smell: 'fa-wind', sound: 'fa-volume-up', touch: 'fa-hand-paper', additional: 'fa-plus' };

    const renderBlock = (block, sectionId) => {
        const cfg = getBlockConfig(block.type);

        if (isSession) {
            return (
                <div key={block.id} className={`gm-block-card gm-block-card-${block.type}`}>
                    <div className="gm-block-card-icon-row">
                        <i className={`fas ${cfg.icon}`} style={{ color: cfg.color }}></i>
                        <span className="gm-block-card-type-badge" style={{ color: cfg.color }}>
                            {block.type === 'hidden' ? 'Hidden / Check' : block.type === 'conditional' ? 'If / Then' : cfg.label}
                        </span>
                    </div>
                    {block.type === 'read-aloud' ? (
                        <div className="gm-block-card-quote">
                            <p className="gm-block-card-text gm-block-card-text-italic">{block.text}</p>
                        </div>
                    ) : (
                        <p className="gm-block-card-text">{block.text}</p>
                    )}
                </div>
            );
        }

        return (
            <div key={block.id} className={`gm-block gm-block-${block.type}`}>
                <div className="gm-block-header">
                    <i className={`fas ${cfg.icon}`} style={{ color: cfg.color }}></i>
                    <span className="gm-block-type-label">{cfg.label}</span>
                    <button className="gm-block-remove" onClick={() => removeBlock(sectionId, block.id)} title="Remove block">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <textarea
                    className="gm-block-textarea"
                    value={block.text}
                    onChange={(e) => updateBlockText(sectionId, block.id, e.target.value)}
                    placeholder={
                        block.type === 'read-aloud' ? 'Box text to read aloud to players...' :
                        block.type === 'obvious' ? 'What players immediately see or notice...' :
                        block.type === 'hidden' ? 'Hidden details requiring a check or inspection...' :
                        'IF this happens THEN...'
                    }
                    rows={2}
                />
            </div>
        );
    };

    const renderSection = (section) => (
        <div key={section.id} className="gm-section-block">
            <div className="gm-section-block-header">
                {isSession ? (
                    <span className="gm-section-title-display">{section.title || 'Untitled Section'}</span>
                ) : (
                    <>
                        <input
                            type="text"
                            className="gm-section-title-input"
                            value={section.title}
                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                            placeholder="Section Title..."
                        />
                        <button
                            className="gm-column-toggle"
                            onClick={() => toggleSectionColumn(section.id)}
                            title={`Move to ${section.column === 'left' ? 'right' : 'left'} column`}
                        >
                            <i className={`fas fa-arrow-${section.column === 'left' ? 'right' : 'left'}`}></i>
                        </button>
                        {structuredNotes.sections.length > 1 && (
                            <button className="gm-section-remove" onClick={() => removeSection(section.id)} title="Remove section">
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </>
                )}
            </div>
            <div className="gm-section-blocks">
                {section.blocks.map(block => renderBlock(block, section.id))}
                {section.blocks.length === 0 && (
                    <div className="gm-block-empty">
                        {isSession ? 'No entries yet.' : 'Click a type below to add your first block'}
                    </div>
                )}
            </div>
            {!isSession && (
                <div className="gm-section-toolbar">
                    {BLOCK_TYPES.map(bt => (
                        <button key={bt.id} className="gm-section-toolbar-btn" onClick={() => addBlock(section.id, bt.id)} title={`Add ${bt.label} block`}>
                            <i className={`fas ${bt.icon}`} style={{ color: bt.color }}></i>
                            <span>{bt.label}</span>
                        </button>
                    ))}
                </div>
            )}
            {isSession && section !== rightSections[rightSections.length - 1] && section !== leftSections[leftSections.length - 1] && (
                <div className="gm-section-divider">
                    <span className="gm-section-divider-ornament">&#10022;</span>
                </div>
            )}
        </div>
    );

    const renderNpcSection = () => (
        <div className="gm-npc-section">
            <div className="gm-npc-section-header">
                <h4><i className="fas fa-users"></i> NPCs</h4>
                {!isSession && (
                    <button className="gm-npc-add-btn" onClick={addNpc} title="Add NPC">
                        <i className="fas fa-plus"></i> Add
                    </button>
                )}
            </div>
            {npcs.length > 0 ? (
                <div className="gm-npc-table-wrap">
                    <table className="gm-npc-table">
                        <thead>
                            <tr>
                                <th className="gm-npc-th-name">Name</th>
                                <th className="gm-npc-th-race">Race / Type</th>
                                <th className="gm-npc-th-desc">Description</th>
                                {!isSession && <th className="gm-npc-th-actions"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {npcs.map(npc => (
                                <tr key={npc.id}>
                                    <td className="gm-npc-name-cell">
                                        {isSession ? (npc.name || '—') : (
                                            <input type="text" className="gm-npc-input" value={npc.name} onChange={(e) => updateNpc(npc.id, 'name', e.target.value)} placeholder="Name" />
                                        )}
                                    </td>
                                    <td className="gm-npc-race-cell">
                                        {isSession ? (npc.race || '—') : (
                                            <input type="text" className="gm-npc-input" value={npc.race} onChange={(e) => updateNpc(npc.id, 'race', e.target.value)} placeholder="Human, Elf..." />
                                        )}
                                    </td>
                                    <td className="gm-npc-desc-cell">
                                        {isSession ? (npc.desc || '—') : (
                                            <input type="text" className="gm-npc-input" value={npc.desc} onChange={(e) => updateNpc(npc.id, 'desc', e.target.value)} placeholder="Brief description..." />
                                        )}
                                    </td>
                                    {!isSession && (
                                        <td>
                                            <button className="gm-npc-remove" onClick={() => removeNpc(npc.id)} title="Remove NPC">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--pf-text-muted)', fontStyle: 'italic', fontSize: '12px' }}>
                    {isSession ? 'No NPCs listed.' : 'Click Add to create an NPC.'}
                </div>
            )}
        </div>
    );

    if (!isOpen) return null;

    return createPortal(
        <DraggableWindow
            isOpen={isOpen}
            onClose={onClose}
            defaultPosition={position}
            defaultSize={windowSize}
            className={`gm-notes-window ${isSession ? 'gm-mode-session' : 'gm-mode-prep'}`}
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
                <div className="gm-notes-container" style={{ width: windowSize.width, height: windowSize.height }}>
                    {/* Header */}
                    <div className="gm-notes-header draggable-window-handle">
                        <div className="gm-notes-title">
                            {!isSession ? (
                                <div className="gm-notes-icon-selector" ref={iconPickerRef}>
                                    <button
                                        className={`gm-notes-icon-button ${showIconPicker ? 'active' : ''}`}
                                        onClick={() => setShowIconPicker(!showIconPicker)}
                                        title={`Note type: ${getNoteIcon(noteIconId).label} (click to change)`}
                                    >
                                        <i className={`fas ${getNoteIcon(noteIconId).icon}`}></i>
                                    </button>
                                    {showIconPicker && (
                                        <div className="gm-notes-icon-picker">
                                            <div className="gm-notes-icon-picker-header"><span>Select Note Type</span></div>
                                            <div className="gm-notes-icon-picker-grid">
                                                {NOTE_ICONS.map(icon => (
                                                    <button
                                                        key={icon.id}
                                                        className={`gm-notes-icon-option ${noteIconId === icon.id ? 'selected' : ''}`}
                                                        onClick={() => handleIconSelect(icon.id)}
                                                        title={icon.label}
                                                    >
                                                        <i className={`fas ${icon.icon}`} style={{ color: noteIconId === icon.id ? icon.color : undefined }}></i>
                                                        <span className="gm-notes-icon-option-label">{icon.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="gm-notes-icon-static">
                                    <i className={`fas ${getNoteIcon(noteIconId).icon}`} style={{ color: getNoteIcon(noteIconId).color }}></i>
                                </div>
                            )}
                            {isRenaming && !isSession ? (
                                <input
                                    type="text" value={title} onChange={handleTitleChange}
                                    onBlur={handleTitleBlur} onKeyDown={handleTitleKeyDown}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '4px 8px', color: '#fff', fontSize: '14px', fontWeight: '600', minWidth: '200px', outline: 'none' }}
                                    autoFocus
                                />
                            ) : (
                                <span
                                    onClick={!isSession ? handleRename : undefined}
                                    style={{ cursor: isSession ? 'default' : 'pointer', userSelect: 'none' }}
                                    title={!isSession ? 'Click to rename' : undefined}
                                >
                                    {title || 'GM Prepared Notes'}
                                </span>
                            )}
                        </div>
                        <div className="gm-notes-header-actions">
                            <div className="gm-mode-switcher">
                                <button
                                    className={`gm-mode-switcher-btn ${!isSession ? 'active' : ''}`}
                                    onClick={() => setMode('prep')}
                                    title="Prep Mode — edit notes"
                                >
                                    <i className="fas fa-pen-fancy"></i> Prep
                                </button>
                                <button
                                    className={`gm-mode-switcher-btn ${isSession ? 'active' : ''}`}
                                    onClick={() => setMode('session')}
                                    title="Session Mode — read during game"
                                >
                                    <i className="fas fa-book-open"></i> Session
                                </button>
                            </div>
                            <button className="gm-notes-close" onClick={onClose}><i className="fas fa-times"></i></button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="gm-notes-tabs">
                        <button className={`gm-notes-tab ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                            {isSession ? 'Scene' : 'Notes'}
                        </button>
                        <button className={`gm-notes-tab ${activeTab === 'handouts' ? 'active' : ''}`} onClick={() => setActiveTab('handouts')}>Handouts ({handouts.length})</button>
                        <button className={`gm-notes-tab ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>Items ({storedItems.length})</button>
                        <button className={`gm-notes-tab ${activeTab === 'creatures' ? 'active' : ''}`} onClick={() => setActiveTab('creatures')}>Creatures ({storedCreatures.length})</button>
                    </div>

                    {/* Content */}
                    <div className="gm-notes-content">

                        {/* ===== NOTES TAB ===== */}
                        {activeTab === 'notes' && (
                            <div className="gm-notes-section">
                                <div className="gm-notes-structured">

                                    {/* Scene Header */}
                                    <div className="gm-scene-header">
                                        {/* Tags Display */}
                                        <div className="gm-scene-tags">
                                            {(structuredNotes.tags || []).map(tag => {
                                                const colors = getTagColor(tag);
                                                return (
                                                    <span key={tag} className="gm-tag-colored" style={{
                                                        background: colors.bg,
                                                        borderColor: colors.border,
                                                        color: colors.text
                                                    }}>
                                                        {tag}
                                                    </span>
                                                );
                                            })}
                                            {!isSession && (
                                                <button className="gm-tag-edit-btn" title="Toggle tags below">
                                                    <i className="fas fa-tags"></i>
                                                </button>
                                            )}
                                        </div>

                                        {/* Summary */}
                                        {isSession ? (
                                            description && (
                                                <div className="gm-scene-summary">
                                                    <p>{description}</p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="gm-notes-field">
                                                <label className="gm-notes-label"><i className="fas fa-lightbulb"></i> Purpose / Summary (shown in tooltip)</label>
                                                <textarea
                                                    className="gm-notes-textarea"
                                                    value={description}
                                                    onChange={handleDescriptionChange}
                                                    placeholder="Ancient temple chamber that tests greed and patience. The room is safe until disturbed; careless looting or rushed movement escalates it into a flood + alarm sequence."
                                                    rows={3}
                                                />
                                            </div>
                                        )}

                                        {/* Sensory Details */}
                                        {!isSession ? (
                                            <div className="gm-sensory-section">
                                                <button className="gm-sensory-toggle" onClick={() => setSensoryExpanded(!sensoryExpanded)}>
                                                    <i className={`fas fa-chevron-${sensoryExpanded ? 'down' : 'right'}`}></i>
                                                    <i className="fas fa-eye" style={{ color: 'var(--pf-gold, #d4af37)' }}></i> Sensory Details
                                                    {!sensoryExpanded && hasSensoryDetails && <span className="gm-sensory-indicator"></span>}
                                                </button>
                                                {sensoryExpanded && (
                                                    <div className="gm-notes-sensory-grid">
                                                        <div className="gm-notes-sensory-item">
                                                            <label className="gm-notes-sensory-label">Smell</label>
                                                            <input type="text" className="gm-notes-sensory-input" value={structuredNotes.sensoryDetails.smell} onChange={(e) => handleSensoryChange('smell', e.target.value)} placeholder="Mold, damp stone, faint incense" />
                                                        </div>
                                                        <div className="gm-notes-sensory-item">
                                                            <label className="gm-notes-sensory-label">Sound</label>
                                                            <input type="text" className="gm-notes-sensory-input" value={structuredNotes.sensoryDetails.sound} onChange={(e) => handleSensoryChange('sound', e.target.value)} placeholder="Distant dripping, faint echoes" />
                                                        </div>
                                                        <div className="gm-notes-sensory-item">
                                                            <label className="gm-notes-sensory-label">Touch</label>
                                                            <input type="text" className="gm-notes-sensory-input" value={structuredNotes.sensoryDetails.touch} onChange={(e) => handleSensoryChange('touch', e.target.value)} placeholder="Cold, slick stone walls" />
                                                        </div>
                                                        <div className="gm-notes-sensory-item">
                                                            <label className="gm-notes-sensory-label">Additional</label>
                                                            <input type="text" className="gm-notes-sensory-input" value={structuredNotes.sensoryDetails.additional} onChange={(e) => handleSensoryChange('additional', e.target.value)} placeholder="Taste: metallic tang in the air" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            hasSensoryDetails && (
                                                <div className="gm-sensory-chips">
                                                    {Object.entries(structuredNotes.sensoryDetails).map(([key, value]) =>
                                                        value && value.trim() ? (
                                                            <span key={key} className="gm-sensory-chip">
                                                                <i className={`fas ${SENSORY_ICONS[key] || 'fa-plus'}`}></i>
                                                                {value}
                                                            </span>
                                                        ) : null
                                                    )}
                                                </div>
                                            )
                                        )}

                                        {/* Tags Editor (prep only) */}
                                        {!isSession && (
                                            <div className="gm-notes-field">
                                                <label className="gm-notes-label"><i className="fas fa-tags"></i> Tags</label>
                                                <div className="gm-tags-row">
                                                    {PREDEFINED_TAGS.map(tag => {
                                                        const colors = getTagColor(tag);
                                                        const isActive = (structuredNotes.tags || []).includes(tag);
                                                        return (
                                                            <button
                                                                key={tag}
                                                                className={`gm-tag-pill ${isActive ? 'active' : ''}`}
                                                                style={isActive ? { background: colors.text, borderColor: colors.text, color: '#f8f4e6' } : {}}
                                                                onClick={() => handleTagToggle(tag)}
                                                            >
                                                                {tag}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Block Legend (sticky) */}
                                    <div className="gm-block-legend">
                                        {BLOCK_TYPES.map(bt => (
                                            <div key={bt.id} className="gm-block-legend-item">
                                                <i className={`fas ${bt.icon}`} style={{ color: bt.color }}></i>
                                                <span>{bt.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Two-Column Sections */}
                                    <div className="gm-sections-columns">
                                        <div className="gm-sections-column">
                                            {leftSections.map(renderSection)}
                                            {leftSections.length === 0 && (
                                                <div className="gm-section-placeholder">
                                                    <p>Add a section to this column</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="gm-sections-column">
                                            {rightSections.map(renderSection)}
                                            {/* NPC Section (bottom of right column) */}
                                            {(npcs.length > 0 || !isSession) && renderNpcSection()}
                                            {rightSections.length === 0 && npcs.length === 0 && isSession && (
                                                <div className="gm-section-placeholder">
                                                    <p>Add a section to fill this column</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add Section (prep only) */}
                                    {!isSession && (
                                        <button className="gm-add-section-btn" onClick={addSection}>
                                            <i className="fas fa-plus"></i> Add Section
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ===== HANDOUTS TAB ===== */}
                        {activeTab === 'handouts' && (
                            <div className="gm-notes-section gm-handouts-section" onDrop={handleHandoutDrop} onDragOver={(e) => e.preventDefault()}>
                                <div className="gm-section-header">
                                    <h4>Handouts</h4>
                                    <p>Drag images here to create handouts that can be shown to players.</p>
                                </div>
                                <div className="gm-handouts-grid">
                                    {handouts.map(handout => (
                                        <div key={handout.id} className="gm-handout">
                                            <div className="gm-handout-preview">
                                                {handout.type === 'image' ? (
                                                    <img src={handout.content} alt={handout.title} className="gm-handout-image" />
                                                ) : (
                                                    <div className="gm-handout-document"><i className="fas fa-file-alt"></i></div>
                                                )}
                                            </div>
                                            <div className="gm-handout-info">
                                                <div className="gm-handout-title">{handout.title}</div>
                                                <div className="gm-handout-actions">
                                                    <button className="gm-handout-show" onClick={() => showHandoutToPlayers(handout)} title="Show to Players"><i className="fas fa-eye"></i></button>
                                                    <button className="gm-handout-remove" onClick={() => removeHandout(handout.id)} title="Remove handout"><i className="fas fa-times"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {handouts.length === 0 && <div className="gm-empty-message">No handouts added. Drag images here from your file explorer.</div>}
                                </div>
                            </div>
                        )}

                        {/* ===== ITEMS TAB ===== */}
                        {activeTab === 'items' && (
                            <div className="gm-notes-section gm-items-section" onDrop={handleItemDrop} onDragOver={(e) => e.preventDefault()}>
                                <div className="gm-section-header">
                                    <h4>Stored Items</h4>
                                    <p>Drag items here to store them, then drag them out to the grid when needed.</p>
                                </div>
                                <div className="gm-items-grid">
                                    {storedItems.map(itemId => {
                                        const item = items.find(i => i.id === itemId);
                                        if (!item) return null;
                                        return (
                                            <div key={itemId} className="gm-item" draggable onDragStart={(e) => handleItemDragStart(item, e)} onMouseEnter={(e) => handleItemMouseEnter(item, e)} onMouseMove={handleItemMouseMove} onMouseLeave={handleItemMouseLeave}>
                                                <img src={getIconUrl(item.iconId || 'inv_misc_questionmark', 'items')} alt={item.name} className="gm-item-icon" onError={(e) => { e.target.onerror = null; e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items'); }} />
                                                <div className="gm-item-name">{item.name}</div>
                                                <button className="gm-item-remove" onClick={() => removeItem(itemId)} title="Remove from storage"><i className="fas fa-times"></i></button>
                                            </div>
                                        );
                                    })}
                                    {storedItems.length === 0 && <div className="gm-empty-message">No items stored. Drag items from the item library here.</div>}
                                </div>
                            </div>
                        )}

                        {/* ===== CREATURES TAB ===== */}
                        {activeTab === 'creatures' && (
                            <div className="gm-notes-section gm-creatures-section" onDrop={handleCreatureDrop} onDragOver={(e) => e.preventDefault()}>
                                <div className="gm-section-header">
                                    <h4>Stored Creatures</h4>
                                    <p>Drag creatures here to store them, then drag them out to the grid when needed.</p>
                                </div>
                                <div className="gm-creatures-grid">
                                    {storedCreatures.map(creatureId => {
                                        const creature = creatures.find(c => c.id === creatureId);
                                        if (!creature) return null;
                                        return (
                                            <div key={creatureId} className="gm-creature" draggable onDragStart={(e) => handleCreatureDragStart(creature, e)} onMouseEnter={(e) => handleCreatureMouseEnter(creature, e)} onMouseMove={handleCreatureMouseMove} onMouseLeave={handleCreatureMouseLeave}>
                                                <img src={getCreatureTokenIconUrl(creature.tokenIcon, creature.type)} alt={creature.name} className="gm-creature-icon" onError={(e) => { e.target.onerror = null; e.target.src = getCreatureTokenIconUrl(null, creature.type); }} />
                                                <div className="gm-creature-name">{creature.name}</div>
                                                <button className="gm-creature-remove" onClick={() => removeCreature(creatureId)} title="Remove from storage"><i className="fas fa-times"></i></button>
                                            </div>
                                        );
                                    })}
                                    {storedCreatures.length === 0 && <div className="gm-empty-message">No creatures stored. Drag creatures from the creature library here.</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Resizable>

            {/* Item Tooltip */}
            {showTooltip && hoveredItem && (
                <TooltipPortal>
                    <div style={{ position: 'fixed', left: tooltipPosition.x, top: tooltipPosition.y, pointerEvents: 'none', zIndex: 999999999 }}>
                        <ItemTooltip item={hoveredItem} />
                    </div>
                </TooltipPortal>
            )}

            {/* Creature Tooltip */}
            {showCreatureTooltip && hoveredCreature && createPortal(
                <div className="creature-card-hover-preview-portal" style={{ position: 'fixed', left: tooltipPosition.x, top: tooltipPosition.y, zIndex: 999999999 }}>
                    <div className="creature-card-hover-preview-interactive"
                        onWheel={(e) => e.stopPropagation()}
                        onMouseEnter={() => setShowCreatureTooltip(true)}
                        onMouseLeave={() => { setShowCreatureTooltip(false); setHoveredCreature(null); }}
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
