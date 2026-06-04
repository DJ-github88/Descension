import React, { useState, useEffect } from 'react';
import useCharacterStore from '../../store/characterStore';
import { getAllBackgrounds } from '../../data/backgroundData';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import { getFullRaceData, getSubraceData, getRaceData, getRaceList, getSubraceList } from '../../data/raceData';
// import { ENHANCED_PATHS } from '../../data/enhancedPathData'; // Disciplines removed
import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import CharacterAppearanceModal from '../character-creation-wizard/components/CharacterAppearanceModal';

// Helper function to format ability icon paths correctly
// Folders are capitalized (Utility, Social, etc.) and files use proper names
const getAbilityIconPath = (path) => {
    // Path should be in format: "utility/icon-name" or "Utility/Icon Name"
    // Return as-is, getAbilityIconUrl will handle the path resolution
    return path;
};

// Border color options for tokens
const BORDER_COLORS = [
    '#ffffff', // White
    '#ffd100', // Gold
    '#ff6b6b', // Red
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#FF9800', // Orange
    '#795548', // Brown
    '#607D8B', // Gray
    '#000000'  // Black
];


export default function Lore() {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    // PERFORMANCE OPTIMIZATION: Use selector to only subscribe to needed values
    const characterStore = useCharacterStore((state) => ({
        lore: state.lore,
        updateLore: state.updateLore,
        updateBackground: state.updateBackground,
        tokenSettings: state.tokenSettings,
        updateTokenSettings: state.updateTokenSettings,
        race: state.race,
        subrace: state.subrace,
        path: state.path,
        name: state.name,
        baseName: state.baseName,
        class: state.class,
        alignment: state.alignment,
        updateCharacterInfo: state.updateCharacterInfo,
        updateBaseName: state.updateBaseName,
        background: state.background
    }));

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;
    const { 
        lore, 
        updateLore,
        race,
        subrace,
        path,
        name,
        baseName,
        class: characterClass,
        alignment,
        updateCharacterInfo,
        updateBaseName,
        updateBackground,
        background
    } = dataSource;

    // Token settings are only available when not in inspection mode
    const { tokenSettings, updateTokenSettings } = inspectionData ? { tokenSettings: null, updateTokenSettings: null } : characterStore;

    const [activeSection, setActiveSection] = useState('identity');
    const [subPage, setSubPage] = useState(0);

    // Reset sub-page when active section changes
    useEffect(() => {
        setSubPage(0);
    }, [activeSection]);

    const [showLabels, setShowLabels] = useState(false); // Start with icons only
    const [showImageControls, setShowImageControls] = useState(false);
    const [showAppearanceModal, setShowAppearanceModal] = useState(false);

    // Apply default transformations if image exists but no transformations are set
    useEffect(() => {
        if (lore.characterImage && !lore.imageTransformations) {
            const defaultTransforms = {
                scale: 1.2, // Start larger since object-fit: contain makes images smaller
                rotation: 0,
                positionX: 0,
                positionY: 0
            };
            updateLore('imageTransformations', defaultTransforms);
        }
    }, [lore.characterImage, lore.imageTransformations]);

    // Sync existing lore.background to top-level background field if not already set
    useEffect(() => {
        if (lore.background && !inspectionData && updateBackground) {
            const { getAllBackgrounds } = require('../../data/backgroundData');
            const backgrounds = getAllBackgrounds();
            const selectedBg = backgrounds.find(bg => bg.name === lore.background);
            if (selectedBg) {
                // Check if background is already synced
                if (!background || background !== selectedBg.id) {
                    updateBackground(selectedBg.id, selectedBg.name);
                }
            }
        }
    }, [lore.background, inspectionData, updateBackground, background]);

    // Get race and subrace data
    const raceData = race ? getRaceData(race) : null;
    const subraceData = race && subrace ? getSubraceData(race, subrace) : null;
    const fullRaceData = race && subrace ? getFullRaceData(race, subrace) : null;
    // const pathData = path ? ENHANCED_PATHS[path] : null; // Disciplines removed

    const sections = {
        identity: {
            title: 'Identity & Origin',
            label: 'Identity',
            icon: getIconUrl('Utility/Utility', 'abilities'),
            leftFields: [
                { key: 'name', label: 'Character Name', type: 'characterName' },
                { key: 'class', label: 'Class', type: 'classSelect' },
                { key: 'race', label: 'Ancestry (Race)', type: 'raceSelect' },
                { key: 'subrace', label: 'Subrace', type: 'subraceSelect' },
                { key: 'alignment', label: 'Alignment', type: 'alignmentSelect' }
            ],
            rightFields: [
                { key: 'background', label: 'Social Background', type: 'backgroundSelect' },
                { key: 'backstory', label: 'Detailed Backstory', placeholder: 'Write your character\'s detailed backstory and history...', type: 'textarea', fullPage: true }
            ]
        },
        personality: {
            title: 'Personality & Traits',
            label: 'Personality',
            icon: getIconUrl('Utility/Meditative Figure', 'abilities'),
            leftFields: [
                { key: 'personalityTraits', label: 'Personality Traits', placeholder: 'Describe your character\'s personality traits and quirks...', type: 'textarea' },
                { key: 'ideals', label: 'Ideals', placeholder: 'What principles and beliefs drive your character?...', type: 'textarea' }
            ],
            rightFields: [
                { key: 'bonds', label: 'Bonds', placeholder: 'What connects your character to the world? Family, friends, organizations?...', type: 'textarea' },
                { key: 'flaws', label: 'Flaws', placeholder: 'What weaknesses or vices does your character have?...', type: 'textarea' }
            ]
        },
        appearance: {
            title: 'Appearance & Description',
            label: 'Appearance',
            icon: getIconUrl('Utility/Robed Figure', 'abilities'),
            leftFields: [
                { key: 'characterImage', label: 'Character Portrait', placeholder: 'Upload or paste image URL...', type: 'image' },
                ...(tokenSettings ? [{ key: 'tokenBorder', label: 'Token Border Color', type: 'borderColor' }] : [])
            ],
            rightFields: [
                { key: 'appearance', label: 'Physical Appearance', placeholder: 'Describe your character\'s physical appearance, clothing, and distinguishing features...', type: 'textarea', fullPage: true }
            ]
        },
        relationships: {
            title: 'Relationships & Connections',
            label: 'Relationships',
            icon: getIconUrl('Social/Party Gathering', 'abilities'),
            leftFields: [
                { key: 'allies', label: 'Allies & Friends', placeholder: 'List and describe your character\'s allies, friends, and positive relationships...', type: 'textarea', fullPage: true }
            ],
            rightFields: [
                { key: 'enemies', label: 'Enemies & Rivals', placeholder: 'List and describe your character\'s enemies, rivals, and negative relationships...', type: 'textarea' },
                { key: 'organizations', label: 'Organizations & Factions', placeholder: 'What organizations, guilds, or factions is your character affiliated with?...', type: 'textarea' }
            ]
        },
        goals: {
            title: 'Goals & Motivations',
            label: 'Goals',
            icon: getIconUrl('Utility/Comet Trail', 'abilities'),
            leftFields: [
                { key: 'goals', label: 'Goals & Ambitions', placeholder: 'What does your character hope to achieve? What are their short and long-term goals?...', type: 'textarea', fullPage: true }
            ],
            rightFields: [
                { key: 'fears', label: 'Fears & Concerns', placeholder: 'What does your character fear most? What keeps them awake at night?...', type: 'textarea', fullPage: true }
            ]
        },
        notes: {
            title: 'Notes & Miscellaneous',
            label: 'Notes',
            icon: getIconUrl('Utility/Utility', 'abilities'),
            leftFields: [],
            rightFields: [
                { key: 'notes', label: 'General Notes', placeholder: 'Any additional notes, reminders, or information about your character...', type: 'textarea', fullPage: true }
            ]
        },
        heritage: {
            title: 'Heritage',
            label: 'Heritage',
            icon: getIconUrl('Nature/World Map', 'abilities'),
            leftFields: [],
            rightFields: [],
            isReadOnly: true,
            customRender: true
        }
    };

    const handleFieldChange = (field, value) => {
        updateLore(field, value);

        // If background is changed, sync it to the top-level background field
        if (field === 'background' && value && !inspectionData) {
            // Find the background by name to get its ID
            const { getAllBackgrounds } = require('../../data/backgroundData');
            const backgrounds = getAllBackgrounds();
            const selectedBg = backgrounds.find(bg => bg.name === value);
            if (selectedBg) {
                updateBackground(selectedBg.id, selectedBg.name);
            }
        }

        // If this is a character image field and we're setting a new image URL,
        // set default transformations if none exist
        if (field === 'characterImage' && value && !lore.imageTransformations) {
            const defaultTransforms = {
                scale: 0.7, // Start smaller so user can see more of the image
                rotation: 0,
                positionX: 0,
                positionY: 0
            };
            updateLore('imageTransformations', defaultTransforms);
        }
    };

    // Image manipulation state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Handle toggling image controls
    const handleToggleImageControls = () => {
        if (lore.characterImage) {
            setShowImageControls(!showImageControls);
        }
    };

    // Handle image transformation changes
    const handleTransformationChange = (property, value) => {
        const currentTransforms = lore.imageTransformations || {};
        const newTransforms = {
            ...currentTransforms,
            [property]: value
        };
        updateLore('imageTransformations', newTransforms);
    };

    // Reset image transformations
    const handleResetTransformations = () => {
        updateLore('imageTransformations', {
            scale: 1,
            rotation: 0,
            positionX: 0,
            positionY: 0
        });
    };

    // Center image
    const handleCenterImage = () => {
        const currentTransforms = lore.imageTransformations || {};
        updateLore('imageTransformations', {
            ...currentTransforms,
            positionX: 0,
            positionY: 0
        });
    };

    // Drag handlers for image positioning (from ImageEditor)
    const handleDragStart = (clientX, clientY) => {
        const transforms = lore.imageTransformations || {};
        setIsDragging(true);
        setDragStart({
            x: clientX - (transforms.positionX || 0),
            y: clientY - (transforms.positionY || 0)
        });
    };

    const handleDragMove = (clientX, clientY) => {
        if (!isDragging) return;

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        // Constrain movement within reasonable bounds
        const maxOffset = 100;
        const constrainedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
        const constrainedY = Math.max(-maxOffset, Math.min(maxOffset, newY));

        handleTransformationChange('positionX', constrainedX);
        handleTransformationChange('positionY', constrainedY);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Mouse event handlers
    const handleMouseDown = (e) => {
        handleDragStart(e.clientX, e.clientY);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        handleDragMove(e.clientX, e.clientY);
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
        e.preventDefault();
    };

    const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleDragMove(touch.clientX, touch.clientY);
        }
    };

    // Add global event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleDragEnd);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleDragEnd);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleDragEnd);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleDragEnd);
            };
        }
    }, [isDragging, dragStart]);

    // Get image style with transformations
    const getImageStyle = () => {
        const transforms = lore.imageTransformations;
        if (!transforms) return {};

        return {
            transform: `scale(${transforms.scale || 1}) rotate(${transforms.rotation || 0}deg) translate(${transforms.positionX || 0}px, ${transforms.positionY || 0}px)`
        };
    };

    const hasPortrait = !!(lore.characterImage || lore.characterIcon);
    const portraitPreviewStyle = {
        backgroundColor: lore.iconBackgroundColor || '#f8f5eb',
        borderColor: lore.iconBorderColor || '#d4af37',
        backgroundImage: lore.iconBackgroundImage
            ? `url(/assets/backgrounds/${encodeURIComponent(lore.iconBackgroundImage)})`
            : 'none',
        backgroundSize: lore.iconBackgroundImage
            ? `${(lore.iconBackgroundScale || 2.5) * 100}%`
            : 'cover',
        backgroundPosition: lore.iconBackgroundImage
            ? `calc(50% + ${lore.iconBackgroundOffsetX || 0}px) calc(50% + ${lore.iconBackgroundOffsetY || 0}px)`
            : 'center',
        backgroundRepeat: 'no-repeat'
    };

    const portraitContentStyle = lore.characterIcon && !lore.characterImage
        ? {
            transform: `scale(${lore.iconScale || 1}) translate(${lore.iconOffsetX || 0}px, ${lore.iconOffsetY || 0}px)`
        }
        : {
            transform: `scale(${lore.imageTransformations?.scale || 1}) rotate(${lore.imageTransformations?.rotation || 0}deg) translate(${lore.imageTransformations?.positionX || 0}px, ${lore.imageTransformations?.positionY || 0}px)`
        };

    const formatTextWithDropCap = (text) => {
        if (!text || typeof text !== 'string') return text;
        const trimmed = text.trim();
        if (!trimmed) return text;
        
        // Find the first letter/word character
        const match = trimmed.match(/^([a-zA-Z])(.*)/s);
        if (!match) return trimmed;
        
        const firstLetter = match[1];
        const restOfText = match[2];
        
        return (
            <p className="book-body-text">
                <span className="drop-cap">{firstLetter}</span>
                {restOfText}
            </p>
        );
    };

    const renderField = (field) => {
        if (field.type === 'characterName') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <input
                        type="text"
                        className="lore-input"
                        value={baseName || name || ''}
                        onChange={(e) => updateBaseName ? updateBaseName(e.target.value) : (updateCharacterInfo ? updateCharacterInfo('name', e.target.value) : null)}
                        placeholder={field.placeholder}
                        disabled={!!inspectionData}
                        maxLength={30}
                    />
                </div>
            );
        } else if (field.type === 'classSelect') {
            const classesList = [
                "Pyrofiend", "Minstrel", "Chronarch", "Chaos Weaver", "Fate Weaver",
                "Gambler", "Martyr", "False Prophet", "Exorcist", "Oracle",
                "Plaguebringer", "Lichborne", "Deathcaller", "Spellguard", "Inscriptor",
                "Arcanoneer", "Witch Doctor", "Formbender", "Primalist", "Berserker",
                "Dreadnaught", "Titan", "Toxicologist", "Covenbane", "Bladedancer",
                "Lunarch", "Huntress", "Warden", "Augur", "Doomsayer"
            ];
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <select
                        className="lore-select"
                        value={characterClass || ''}
                        onChange={(e) => updateCharacterInfo ? updateCharacterInfo('class', e.target.value) : null}
                        disabled={!!inspectionData}
                    >
                        <option value="">Select a class</option>
                        {classesList.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'raceSelect') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <select
                        className="lore-select"
                        value={race || ''}
                        onChange={(e) => updateCharacterInfo ? updateCharacterInfo('race', e.target.value) : null}
                        disabled={!!inspectionData}
                    >
                        <option value="">Select an ancestry</option>
                        {getRaceList().map(raceOption => (
                            <option key={raceOption.id} value={raceOption.id}>
                                {raceOption.name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'subraceSelect') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <select
                        className="lore-select"
                        value={subrace || ''}
                        onChange={(e) => updateCharacterInfo ? updateCharacterInfo('subrace', e.target.value) : null}
                        disabled={!race || !!inspectionData}
                    >
                        <option value="">Select a subrace</option>
                        {race && getSubraceList(race).map(subraceOption => (
                            <option key={subraceOption.id} value={subraceOption.id}>
                                {subraceOption.name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'alignmentSelect') {
            const alignmentsList = [
                "Lawful Good", "Neutral Good", "Chaotic Good",
                "Lawful Neutral", "True Neutral", "Chaotic Neutral",
                "Lawful Evil", "Neutral Evil", "Chaotic Evil"
            ];
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <select
                        className="lore-select"
                        value={alignment || ''}
                        onChange={(e) => updateCharacterInfo ? updateCharacterInfo('alignment', e.target.value) : null}
                        disabled={!!inspectionData}
                    >
                        <option value="">Select an alignment</option>
                        {alignmentsList.map(align => (
                            <option key={align} value={align}>{align}</option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'backgroundSelect') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <select
                        className="lore-select"
                        value={background || ''}
                        onChange={(e) => {
                            const bgId = e.target.value;
                            const backgrounds = getAllBackgrounds();
                            const selectedBg = backgrounds.find(bg => bg.id === bgId);
                            if (selectedBg) {
                                if (updateBackground) updateBackground(selectedBg.id, selectedBg.name);
                                updateLore('background', selectedBg.name);
                            } else {
                                if (updateBackground) updateBackground('', '');
                                updateLore('background', '');
                            }
                        }}
                        disabled={!!inspectionData}
                    >
                        <option value="">Select a background</option>
                        {getAllBackgrounds().map(bgOption => (
                            <option key={bgOption.id} value={bgOption.id}>
                                {bgOption.name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'textarea') {
            return (
                <div key={field.key} className="lore-field has-textarea">
                    <label className="lore-field-label">{field.label}</label>
                    <textarea
                        className="lore-textarea"
                        value={lore[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={6}
                        disabled={!!inspectionData}
                    />
                </div>
            );
        } else if (field.type === 'select') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <select
                        className="lore-select"
                        value={lore[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    >
                        <option value="">Select a {field.label.toLowerCase()}</option>
                        {field.options.map(option => (
                            <option key={option.id} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            );
        } else if (field.type === 'image') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <div className="character-image-section">
                        <div className="portrait-options">
                            <div className="portrait-option-label">Customize your portrait or paste an image URL:</div>
                            <div
                                className="portrait-appearance-preview"
                                onClick={() => !inspectionData && setShowAppearanceModal(true)}
                                style={portraitPreviewStyle}
                                title="Click to open Portrait Workshop"
                            >
                                {hasPortrait ? (
                                    lore.characterImage ? (
                                        <img
                                            src={lore.characterImage}
                                            alt="Portrait"
                                            className="portrait-preview-img"
                                            style={portraitContentStyle}
                                            draggable={false}
                                        />
                                    ) : (
                                        <img
                                            src={getCustomIconUrl(lore.characterIcon, 'creatures')}
                                            alt="Icon"
                                            className="portrait-preview-img"
                                            style={portraitContentStyle}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getCustomIconUrl('Human/Icon1', 'creatures');
                                            }}
                                        />
                                    )
                                ) : (
                                    <div className="portrait-preview-empty">
                                        <i className="fas fa-user-plus"></i>
                                        <span>Click to customize</span>
                                    </div>
                                )}
                                {!inspectionData && (
                                    <div className="icon-overlay">
                                        <i className="fas fa-edit"></i>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!inspectionData && (
                            <input
                                type="text"
                                className="lore-image-input"
                                value={lore[field.key] || ''}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                            />
                        )}

                        {lore[field.key] && (
                            <div className="character-image-preview-large">
                                <div className="inline-image-editor-preview">
                                    <div className="inline-image-preview-container">
                                        <img
                                            src={lore[field.key]}
                                            alt="Character Portrait"
                                            className="inline-image-preview"
                                            style={{
                                                transform: `scale(${lore.imageTransformations?.scale || 1}) rotate(${lore.imageTransformations?.rotation || 0}deg) translate(${lore.imageTransformations?.positionX || 0}px, ${lore.imageTransformations?.positionY || 0}px)`,
                                                cursor: isDragging ? 'grabbing' : 'grab'
                                            }}
                                            onMouseDown={handleMouseDown}
                                            onTouchStart={handleTouchStart}
                                            draggable={false}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="drag-instructions">
                                        <i className="fas fa-hand-paper"></i>
                                        <span>Drag image to reposition</span>
                                    </div>
                                </div>

                                <div className="image-controls-section">
                                    <button
                                        type="button"
                                        className="toggle-controls-btn"
                                        onClick={handleToggleImageControls}
                                        title="Toggle Image Controls"
                                    >
                                        <i className={`fas ${showImageControls ? 'fa-chevron-up' : 'fa-sliders-h'}`}></i>
                                        {showImageControls ? 'Hide Controls' : 'Edit Image'}
                                    </button>

                                    {showImageControls && (
                                        <div className="inline-image-controls">
                                            <div className="control-group">
                                                <label className="control-label">Size</label>
                                                <div className="control-row">
                                                    <input
                                                        type="range"
                                                        min="0.5"
                                                        max="3"
                                                        step="0.1"
                                                        value={lore.imageTransformations?.scale || 1}
                                                        onChange={(e) => handleTransformationChange('scale', parseFloat(e.target.value))}
                                                        className="control-slider"
                                                    />
                                                    <span className="control-value">
                                                        {Math.round((lore.imageTransformations?.scale || 1) * 100)}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="control-group">
                                                <label className="control-label">Rotation</label>
                                                <div className="control-row">
                                                    <input
                                                        type="range"
                                                        min="-180"
                                                        max="180"
                                                        step="5"
                                                        value={lore.imageTransformations?.rotation || 0}
                                                        onChange={(e) => handleTransformationChange('rotation', parseInt(e.target.value))}
                                                        className="control-slider"
                                                    />
                                                    <span className="control-value">
                                                        {lore.imageTransformations?.rotation || 0}°
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="control-group">
                                                <label className="control-label">Position</label>
                                                <div className="center-control">
                                                    <button
                                                        type="button"
                                                        className="center-btn"
                                                        onClick={handleCenterImage}
                                                        title="Center Image"
                                                    >
                                                        <i className="fas fa-crosshairs"></i>
                                                        Center Image
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="control-actions">
                                                <button
                                                    type="button"
                                                    className="reset-btn"
                                                    onClick={handleResetTransformations}
                                                    title="Reset All Transformations"
                                                >
                                                    <i className="fas fa-undo"></i>
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        } else if (field.type === 'borderColor') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <div className="border-color-selector">
                        <div className="color-options" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '8px'
                        }}>
                            {BORDER_COLORS.map(color => (
                                <div
                                    key={color}
                                    className={`color-option ${tokenSettings?.borderColor === color ? 'selected' : ''}`}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: color,
                                        border: tokenSettings?.borderColor === color ? '3px solid #fff' : '2px solid #666',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        boxShadow: tokenSettings?.borderColor === color ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none'
                                    }}
                                    onClick={() => updateTokenSettings('borderColor', color)}
                                />
                            ))}
                        </div>
                        <div className="token-preview" style={{
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ color: '#ccc', fontSize: '14px' }}>Preview:</span>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    border: `3px solid ${tokenSettings?.borderColor || '#4CAF50'}`,
                                    backgroundImage: lore.characterImage ? `url(${lore.characterImage})` : 'none',
                                    backgroundColor: lore.characterImage ? 'transparent' : '#333',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {!lore.characterImage && (dataSource.name ? dataSource.name.charAt(0).toUpperCase() : '?')}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderPortraitSummary = () => {
        return (
            <>
                <div className="character-book-header">
                    <div className="decorative-header-arch"></div>
                    <h1 className="character-book-name">{dataSource.name || 'Unnamed Adventurer'}</h1>
                    <div className="character-book-subtitle">
                        {raceData?.name || 'Unknown Race'} {subraceData?.name ? `(${subraceData.name})` : ''} 
                        {characterClass ? ` • ${characterClass}` : ''}
                    </div>
                    <div className="decorative-double-hr"></div>
                </div>

                {/* Gothic Ornate Portrait Frame */}
                <div className="book-portrait-frame-wrapper">
                    <div 
                        className="book-portrait-frame" 
                        style={portraitPreviewStyle}
                        onClick={() => !inspectionData && setShowAppearanceModal(true)}
                        title={!inspectionData ? 'Click to craft character portrait' : 'Character Portrait'}
                    >
                        {hasPortrait ? (
                            lore.characterImage ? (
                                <img
                                    src={lore.characterImage}
                                    alt="Character Portrait"
                                    className="book-portrait-img"
                                    style={portraitContentStyle}
                                    draggable={false}
                                />
                            ) : (
                                <img
                                    src={getCustomIconUrl(lore.characterIcon, 'creatures')}
                                    alt="Character Icon"
                                    className="book-portrait-img"
                                    style={portraitContentStyle}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getCustomIconUrl('Human/Icon1', 'creatures');
                                    }}
                                />
                            )
                        ) : (
                            <div className="book-portrait-empty">
                                <i className="fas fa-user-plus"></i>
                                <span>Craft Portrait</span>
                            </div>
                        )}
                        {!inspectionData && (
                            <div className="book-portrait-edit-badge">
                                <i className="fas fa-feather-alt"></i> Edit
                            </div>
                        )}
                    </div>
                </div>

                {/* Ornate Character Identity Metadata block */}
                <div className="book-character-meta-block">
                    <h3 className="meta-block-title">Chronicles & Identity</h3>
                    <div className="meta-rows">
                        <div className="meta-row-item">
                            <span className="meta-item-label">Ancestry</span>
                            <span className="meta-item-val">{raceData?.name || 'Uncharted'}</span>
                        </div>
                        <div className="meta-row-item">
                            <span className="meta-item-label">Subrace</span>
                            <span className="meta-item-val">{subraceData?.name || 'None'}</span>
                        </div>
                        <div className="meta-row-item">
                            <span className="meta-item-label">Class</span>
                            <span className="meta-item-val">{characterClass || 'Adventurer'}</span>
                        </div>
                        <div className="meta-row-item">
                            <span className="meta-item-label">Alignment</span>
                            <span className="meta-item-val">{alignment || 'Neutral'}</span>
                        </div>
                        <div className="meta-row-item">
                            <span className="meta-item-label">Social Background</span>
                            <span className="meta-item-val">{lore.background || 'Commoner'}</span>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderLeftFields = () => {
        return (
            <>
                <div className="lore-section-header-enhanced">
                    <div className="section-title-wrapper">
                        <img
                            src={sections[activeSection].icon}
                            alt=""
                            className="lore-section-icon-enhanced"
                        />
                        <h2 className="lore-section-title-enhanced">{sections[activeSection].title}</h2>
                    </div>
                    <div className="decorative-single-hr"></div>
                </div>

                <div className="lore-fields-enhanced">
                    {sections[activeSection].leftFields.map(renderField)}
                </div>
            </>
        );
    };

    const renderBackstoryPage = () => {
        return (
            <>
                <div className="lore-section-header-enhanced">
                    <div className="section-title-wrapper">
                        <img
                            src={sections.identity.icon}
                            alt=""
                            className="lore-section-icon-enhanced"
                        />
                        <h2 className="lore-section-title-enhanced">Chronicles & Backstory</h2>
                    </div>
                    <div className="decorative-single-hr"></div>
                </div>

                <div className="lore-fields-enhanced">
                    {sections.identity.rightFields.map(renderField)}
                </div>
            </>
        );
    };

    const renderIdentityInputs = () => {
        return (
            <>
                <div className="lore-section-header-enhanced">
                    <div className="section-title-wrapper">
                        <img
                            src={sections.identity.icon}
                            alt=""
                            className="lore-section-icon-enhanced"
                        />
                        <h2 className="lore-section-title-enhanced">Identity & Origin</h2>
                    </div>
                    <div className="decorative-single-hr"></div>
                </div>

                <div className="lore-fields-enhanced">
                    {sections.identity.leftFields.map(renderField)}
                </div>
            </>
        );
    };

    const renderRightFields = () => {
        return (
            <>
                {(!sections[activeSection].leftFields || sections[activeSection].leftFields.length === 0) && (
                    <div className="lore-section-header-enhanced">
                        <div className="section-title-wrapper">
                            <img
                                src={sections[activeSection].icon}
                                alt=""
                                className="lore-section-icon-enhanced"
                            />
                            <h2 className="lore-section-title-enhanced">{sections[activeSection].title}</h2>
                        </div>
                        <div className="decorative-single-hr"></div>
                    </div>
                )}

                <div className="lore-fields-enhanced">
                    {sections[activeSection].rightFields && sections[activeSection].rightFields.map(renderField)}
                </div>
            </>
        );
    };

    const renderDecorativeFantasyPage = () => {
        return (
            <div className="lore-book-decorative-page">
                <img 
                    src="/assets/images/watercolor_tome.png" 
                    alt="Tome" 
                    className="fantasy-decorative-icon"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/images/watercolor_scroll.png";
                    }}
                />
                <div className="fantasy-quote-divider"></div>
                <blockquote className="fantasy-quote-text">
                    "Every legend begins with a single step, and every chronicle is written in the echoes of their deeds across the realm."
                </blockquote>
                <div className="fantasy-page-flourish"></div>
            </div>
        );
    };

    return (
        <div className="lore-book-wrapper">
            {/* BOOK NAVIGATION bookmarks/ribbons */}
            <div className={`lore-book-navigation ${showLabels ? 'with-labels' : 'icons-only'}`}>
                <button
                    className="lore-bookmark-toggle-btn"
                    onClick={() => setShowLabels(!showLabels)}
                    title={showLabels ? 'Hide Labels' : 'Show Labels'}
                >
                    <span className="stats-toggle-icon">{showLabels ? '◀' : '▶'}</span>
                </button>
                {Object.entries(sections).map(([key, section]) => (
                    <button
                        key={key}
                        className={`lore-book-bookmark ${activeSection === key ? 'active' : ''}`}
                        onClick={() => setActiveSection(key)}
                        title={section.title}
                    >
                        <img src={section.icon} alt="" className="bookmark-icon-img" />
                        {showLabels && <span className="bookmark-label-text">{section.label || section.title}</span>}
                    </button>
                ))}
            </div>

            {/* MAIN BOOK SPREAD CONTAINER */}
            <div className="lore-book-spread-container">
                <div className="lore-book-spread">
                    
                    {/* LEFT PAGE: Split fields list or static Character Portrait fallback */}
                    <div className="lore-book-page left-page">
                        <div className="page-filigree-border">
                            <div className="page-ornament top-ornament"></div>
                            <div className="book-page-content">
                                {activeSection === 'identity' ? (
                                    subPage === 0 ? (
                                        renderPortraitSummary()
                                    ) : (
                                        renderBackstoryPage()
                                    )
                                ) : sections[activeSection].leftFields && sections[activeSection].leftFields.length > 0 ? (
                                    renderLeftFields()
                                ) : (
                                    renderPortraitSummary()
                                )}
                            </div>
                            <div className="page-number-marker">
                                {activeSection === 'identity' ? (subPage === 0 ? 'Page I' : 'Page III') : 'Page I'}
                            </div>
                            {activeSection === 'identity' && subPage === 1 && (
                                <button
                                    type="button"
                                    className="book-page-flip-btn prev-page"
                                    onClick={() => setSubPage(0)}
                                    title="Go back to Character Identity (Page I)"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                    <span>Identity Details</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* BOOK SPINE - 3D spine and deep book gutter shadow */}
                    <div className="lore-book-spine-divider">
                        <div className="spine-ring top-ring"></div>
                        <div className="spine-ring mid-ring"></div>
                        <div className="spine-ring bot-ring"></div>
                    </div>

                    {/* RIGHT PAGE: Active Lore content fields/views */}
                    <div className="lore-book-page right-page">
                        <div className="page-filigree-border">
                            <div className="page-ornament top-ornament"></div>
                            <div className="book-page-content">
                                {activeSection === 'identity' ? (
                                    subPage === 0 ? (
                                        renderIdentityInputs()
                                    ) : (
                                        renderDecorativeFantasyPage()
                                    )
                                ) : sections[activeSection].customRender ? (
                                    renderHeritageSection()
                                ) : (
                                    renderRightFields()
                                )}
                            </div>
                            <div className="page-number-marker">
                                {activeSection === 'identity' ? (subPage === 0 ? 'Page II' : 'Page IV') : 'Page II'}
                            </div>
                            {activeSection === 'identity' && subPage === 0 && (
                                <button
                                    type="button"
                                    className="book-page-flip-btn next-page"
                                    onClick={() => setSubPage(1)}
                                    title="Flip to Backstory (Page III)"
                                >
                                    <span>Detailed Backstory</span>
                                    <i className="fas fa-feather-alt"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Portrait Customization Appearance Modal */}
            <CharacterAppearanceModal
                isOpen={showAppearanceModal}
                onClose={() => setShowAppearanceModal(false)}
                characterData={{
                    characterImage: lore.characterImage,
                    characterIcon: lore.characterIcon,
                    iconBackgroundColor: lore.iconBackgroundColor,
                    iconBorderColor: lore.iconBorderColor,
                    iconBackgroundImage: lore.iconBackgroundImage,
                    iconScale: lore.iconScale,
                    iconOffsetX: lore.iconOffsetX,
                    iconOffsetY: lore.iconOffsetY,
                    iconBackgroundScale: lore.iconBackgroundScale,
                    iconBackgroundOffsetX: lore.iconBackgroundOffsetX,
                    iconBackgroundOffsetY: lore.iconBackgroundOffsetY
                }}
                onUpdate={(updates) => {
                    Object.entries(updates).forEach(([key, value]) => {
                        updateLore(key, value);
                    });
                }}
                imagePreview={lore.characterImage}
                onImageUpload={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if (!file.type.startsWith('image/')) return;
                        if (file.size > 5 * 1024 * 1024) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            updateLore('characterImage', event.target.result);
                            updateLore('imageTransformations', {
                                scale: 1.2,
                                rotation: 0,
                                positionX: 0,
                                positionY: 0
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                }}
                onRemoveImage={() => {
                    updateLore('characterImage', null);
                    updateLore('imageTransformations', null);
                }}
                imageTransformations={lore.imageTransformations}
                onApplyTransformations={(t) => updateLore('imageTransformations', t)}
            />
        </div>
    );

    function renderHeritageSection() {
        return (
            <div className="heritage-section-enhanced">
                {subraceData ? (
                    <>
                        {subraceData.description && (
                            <div className="lore-field-enhanced">
                                <label className="lore-field-label-enhanced">Description</label>
                                <div className="heritage-readonly-text-enhanced">
                                    {formatTextWithDropCap(subraceData.description)}
                                </div>
                            </div>
                        )}
                        {subraceData.culturalBackground && (
                            <div className="lore-field-enhanced">
                                <label className="lore-field-label-enhanced">Cultural Background</label>
                                <div className="heritage-readonly-text-enhanced">
                                    {formatTextWithDropCap(subraceData.culturalBackground)}
                                </div>
                            </div>
                        )}
                        
                        {fullRaceData && fullRaceData.race && fullRaceData.race.baseTraits && (
                            <div className="lore-field-enhanced">
                                <label className="lore-field-label-enhanced">Ancestral Statistics & Traits</label>
                                <div className="heritage-traits-grid-enhanced">
                                    {fullRaceData.race.baseTraits.height && (
                                        <div className="grid-item">
                                            <span className="grid-item-label">Typical Height</span>
                                            <span className="grid-item-val">{fullRaceData.race.baseTraits.height}</span>
                                        </div>
                                    )}
                                    {fullRaceData.race.baseTraits.weight && (
                                        <div className="grid-item">
                                            <span className="grid-item-label">Typical Weight</span>
                                            <span className="grid-item-val">{fullRaceData.race.baseTraits.weight}</span>
                                        </div>
                                    )}
                                    {fullRaceData.race.baseTraits.build && (
                                        <div className="grid-item">
                                            <span className="grid-item-label">Typical Build</span>
                                            <span className="grid-item-val">{fullRaceData.race.baseTraits.build}</span>
                                        </div>
                                    )}
                                    {fullRaceData.race.baseTraits.lifespan && (
                                        <div className="grid-item">
                                            <span className="grid-item-label">Typical Lifespan</span>
                                            <span className="grid-item-val">{fullRaceData.race.baseTraits.lifespan}</span>
                                        </div>
                                    )}
                                    {fullRaceData.race.baseTraits.size && (
                                        <div className="grid-item">
                                            <span className="grid-item-label">Size Class</span>
                                            <span className="grid-item-val">{fullRaceData.race.baseTraits.size}</span>
                                        </div>
                                    )}
                                    {fullRaceData.combinedTraits && fullRaceData.combinedTraits.speed && (
                                        <div className="grid-item">
                                            <span className="grid-item-label">Base Speed</span>
                                            <span className="grid-item-val">{fullRaceData.combinedTraits.speed} ft</span>
                                        </div>
                                    )}
                                    {fullRaceData.combinedTraits && fullRaceData.combinedTraits.languages && fullRaceData.combinedTraits.languages.length > 0 && (
                                        <div className="grid-item full-width">
                                            <span className="grid-item-label">Known Languages</span>
                                            <span className="grid-item-val">{fullRaceData.combinedTraits.languages.join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {raceData && raceData.overview && (
                            <div className="lore-field-enhanced">
                                <label className="lore-field-label-enhanced">Ancestry Overview</label>
                                <div className="heritage-readonly-text-enhanced">
                                    {formatTextWithDropCap(raceData.overview)}
                                </div>
                            </div>
                        )}
                        {raceData && raceData.culturalBackground && (
                            <div className="lore-field-enhanced">
                                <label className="lore-field-label-enhanced">Racial Society & Culture</label>
                                <div className="heritage-readonly-text-enhanced">
                                    {formatTextWithDropCap(raceData.culturalBackground)}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="heritage-empty-enhanced">
                        <i className="fas fa-scroll decorative-scroll-icon"></i>
                        <p>No heritage information available. Select a race and subrace to unlock these ancient chronicled texts.</p>
                    </div>
                )}
            </div>
        );
    }
}
