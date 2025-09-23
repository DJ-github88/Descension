import React, { useState, useEffect } from 'react';
import useCharacterStore from '../../store/characterStore';
import { getAllBackgrounds } from '../../data/backgroundData';
import { useInspectionCharacter } from '../../contexts/InspectionContext';

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
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;
    const { lore, updateLore } = dataSource;

    // Token settings are only available when not in inspection mode
    const { tokenSettings, updateTokenSettings } = inspectionData ? { tokenSettings: null, updateTokenSettings: null } : characterStore;

    const [activeSection, setActiveSection] = useState('background');
    const [showImageControls, setShowImageControls] = useState(false);

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

    const sections = {
        background: {
            title: 'Background & History',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_scroll_03.jpg',
            fields: [
                { key: 'background', label: 'Background', type: 'select', options: getAllBackgrounds() },
                { key: 'backstory', label: 'Backstory', placeholder: 'Write your character\'s detailed backstory and history...', type: 'textarea' }
            ]
        },
        personality: {
            title: 'Personality & Traits',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_innerrage.jpg',
            fields: [
                { key: 'personalityTraits', label: 'Personality Traits', placeholder: 'Describe your character\'s personality traits and quirks...', type: 'textarea' },
                { key: 'ideals', label: 'Ideals', placeholder: 'What principles and beliefs drive your character?...', type: 'textarea' },
                { key: 'bonds', label: 'Bonds', placeholder: 'What connects your character to the world? Family, friends, organizations?...', type: 'textarea' },
                { key: 'flaws', label: 'Flaws', placeholder: 'What weaknesses or vices does your character have?...', type: 'textarea' }
            ]
        },
        appearance: {
            title: 'Appearance & Description',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_pearl_05.jpg',
            fields: [
                { key: 'characterImage', label: 'Character Portrait', placeholder: 'Upload or paste image URL...', type: 'image' },
                { key: 'appearance', label: 'Physical Appearance', placeholder: 'Describe your character\'s physical appearance, clothing, and distinguishing features...', type: 'textarea' },
                ...(tokenSettings ? [{ key: 'tokenBorder', label: 'Token Border Color', type: 'borderColor' }] : [])
            ]
        },
        relationships: {
            title: 'Relationships & Connections',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_groupneedmore.jpg',
            fields: [
                { key: 'allies', label: 'Allies & Friends', placeholder: 'List and describe your character\'s allies, friends, and positive relationships...', type: 'textarea' },
                { key: 'enemies', label: 'Enemies & Rivals', placeholder: 'List and describe your character\'s enemies, rivals, and negative relationships...', type: 'textarea' },
                { key: 'organizations', label: 'Organizations & Factions', placeholder: 'What organizations, guilds, or factions is your character affiliated with?...', type: 'textarea' }
            ]
        },
        goals: {
            title: 'Goals & Motivations',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_note_01.jpg',
            fields: [
                { key: 'goals', label: 'Goals & Ambitions', placeholder: 'What does your character hope to achieve? What are their short and long-term goals?...', type: 'textarea' },
                { key: 'fears', label: 'Fears & Concerns', placeholder: 'What does your character fear most? What keeps them awake at night?...', type: 'textarea' }
            ]
        },
        notes: {
            title: 'Notes & Miscellaneous',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            fields: [
                { key: 'notes', label: 'General Notes', placeholder: 'Any additional notes, reminders, or information about your character...', type: 'textarea' }
            ]
        }
    };

    const handleFieldChange = (field, value) => {
        updateLore(field, value);

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



    const renderField = (field) => {
        if (field.type === 'textarea') {
            return (
                <div key={field.key} className="lore-field">
                    <label className="lore-field-label">{field.label}</label>
                    <textarea
                        className="lore-textarea"
                        value={lore[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={6}
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
                        <input
                            type="text"
                            className="lore-image-input"
                            value={lore[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                        />

                        {lore[field.key] && (
                            <div className="character-image-preview-large">
                                {/* Draggable Image Preview */}
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
                                            {/* Scale Control */}
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

                                            {/* Rotation Control */}
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

                                            {/* Position Controls */}
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

                                            {/* Action Buttons */}
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

    return (
        <div className="lore-container">
            <div className="lore-navigation">
                {Object.entries(sections).map(([key, section]) => (
                    <button
                        key={key}
                        className={`lore-nav-button ${activeSection === key ? 'active' : ''}`}
                        onClick={() => setActiveSection(key)}
                    >
                        <img src={section.icon} alt="" className="lore-nav-icon" />
                        <span className="lore-nav-text">{section.title}</span>
                    </button>
                ))}
            </div>

            <div className="lore-content">
                <div className="lore-section-header">
                    <img
                        src={sections[activeSection].icon}
                        alt=""
                        className="lore-section-icon"
                    />
                    <h2 className="lore-section-title">{sections[activeSection].title}</h2>
                </div>

                <div className="lore-fields">
                    {sections[activeSection].fields.map(renderField)}
                </div>
            </div>


        </div>
    );
}
