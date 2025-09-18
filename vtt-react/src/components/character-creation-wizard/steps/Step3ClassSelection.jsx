/**
 * Step 3: Class Selection
 *
 * Class selection step with layout matching the race selection
 */

import React, { useState } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';

const Step3ClassSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedClass, setSelectedClass] = useState(state.characterData.class);
    const [hoveredClass, setHoveredClass] = useState(null);

    const { validationErrors } = state;

    // All 27 character classes as flat list (corrected from CharacterCreation.jsx)
    const characterClasses = [
        // Infernal Path
        { name: 'Pyrofiend', icon: 'fas fa-fire', description: 'Demonic fire wielder with ascending corruption stages', theme: 'fire' },
        { name: 'Minstrel', icon: 'fas fa-music', description: 'Musical spellcaster combining notes into powerful chords', theme: 'music' },
        { name: 'Chronarch', icon: 'fas fa-clock', description: 'Time manipulator building temporal energy', theme: 'time' },
        { name: 'Chaos Weaver', icon: 'fas fa-dice', description: 'Reality bender using chaos dice and entropy', theme: 'chaos' },
        { name: 'Gambler', icon: 'fas fa-coins', description: 'Fate manipulator balancing luck and risk', theme: 'luck' },

        // Zealot Path
        { name: 'Martyr', icon: 'fas fa-cross', description: 'Self-sacrificing warrior earning power through pain', theme: 'sacrifice' },
        { name: 'False Prophet', icon: 'fas fa-eye', description: 'Deceptive preacher spreading lies and corruption', theme: 'deception' },
        { name: 'Exorcist', icon: 'fas fa-ankh', description: 'Holy warrior banishing evil spirits', theme: 'holy' },

        // Harrow Path
        { name: 'Plaguebringer', icon: 'fas fa-skull', description: 'Disease spreader with contagious plague stacks', theme: 'disease' },
        { name: 'Lichborne', icon: 'fas fa-skull-crossbones', description: 'Undead spellcaster with phylactery power', theme: 'undead' },
        { name: 'Deathcaller', icon: 'fas fa-ghost', description: 'Necromancer harvesting souls for dark magic', theme: 'necromancy' },

        // Arcanist Path
        { name: 'Spellguard', icon: 'fas fa-shield-alt', description: 'Protective mage with magical ward layers', theme: 'protection' },
        { name: 'Inscriptor', icon: 'fas fa-scroll', description: 'Runic scholar creating magical glyph circuits', theme: 'runes' },
        { name: 'Arcanoneer', icon: 'fas fa-magic', description: 'Elemental cannon wielder with volatility risk', theme: 'elemental' },

        // Hexer Path
        { name: 'Witch Doctor', icon: 'fas fa-voodoo-doll', description: 'Spiritual invoker channeling loa spirits', theme: 'spiritual' },
        { name: 'Formbender', icon: 'fas fa-paw', description: 'Shapeshifter with primal instinct energy', theme: 'primal' },
        { name: 'Primalist', icon: 'fas fa-tree', description: 'Totem master resonating with elemental forces', theme: 'nature' },

        // Reaver Path
        { name: 'Berserker', icon: 'fas fa-axe-battle', description: 'Fury warrior with momentum thresholds', theme: 'rage' },
        { name: 'Dreadnaught', icon: 'fas fa-fortress', description: 'Fortress defender with siege capabilities', theme: 'fortress' },
        { name: 'Titan', icon: 'fas fa-mountain', description: 'Gravity manipulator with strain overload', theme: 'gravity' },

        // Mercenary Path
        { name: 'Toxicologist', icon: 'fas fa-flask', description: 'Poison crafter with alchemical vials', theme: 'alchemy' },
        { name: 'Covenbane', icon: 'fas fa-ban', description: 'Witch hunter with anti-magic seals', theme: 'anti-magic' },
        { name: 'Bladedancer', icon: 'fas fa-sword', description: 'Finesse fighter with edge and flourish', theme: 'finesse' },

        // Sentinel Path
        { name: 'Lunarch', icon: 'fas fa-moon', description: 'Lunar mage with phase-based energy', theme: 'lunar' },
        { name: 'Huntress', icon: 'fas fa-bow-arrow', description: 'Tracker with quarry marks and precision', theme: 'hunter' },
        { name: 'Warden', icon: 'fas fa-shield', description: 'Barrier guardian with protective bulwarks', theme: 'guardian' }
    ];

    // Handle class selection
    const handleClassSelect = (className) => {
        setSelectedClass(className);
        dispatch(wizardActionCreators.setClass(className));
    };

    // Get preview data (hovered or selected)
    const getPreviewClassData = () => {
        const previewName = hoveredClass || selectedClass;
        return previewName ? characterClasses.find(cls => cls.name === previewName) : null;
    };

    const previewClass = getPreviewClassData();

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="class-selection-layout">
                    {/* Left side - Class selection */}
                    <div className="class-selection-panel">
                        <div className="class-section">
                            <h3 className="section-title">
                                <i className="fas fa-sword"></i>
                                Choose Class
                            </h3>
                            <div className="class-grid">
                                {characterClasses.map((classData) => (
                                    <div
                                        key={classData.name}
                                        className={`class-card ${selectedClass === classData.name ? 'selected' : ''}`}
                                        onClick={() => handleClassSelect(classData.name)}
                                        onMouseEnter={() => setHoveredClass(classData.name)}
                                        onMouseLeave={() => setHoveredClass(null)}
                                    >
                                        <div className="class-icon">
                                            <i className={classData.icon}></i>
                                        </div>
                                        <div className="class-info">
                                            <h4 className="class-name">{classData.name}</h4>
                                            <p className="class-description">
                                                {classData.description.length > 50 ? classData.description.substring(0, 50) + '...' : classData.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {validationErrors.class && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i>
                                {validationErrors.class}
                            </div>
                        )}

                        <div className="step-footer">
                            <div className="step-hints">
                                <div className="hint">
                                    <i className="fas fa-lightbulb"></i>
                                    <span>Each class has unique abilities and spell specializations</span>
                                </div>
                                <div className="hint">
                                    <i className="fas fa-magic"></i>
                                    <span>Each class has unique spell specializations and abilities</span>
                                </div>
                                <div className="hint">
                                    <i className="fas fa-star"></i>
                                    <span>Your class choice affects available spells and combat options</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Class preview */}
                    <div className="class-preview">
                        {previewClass ? (
                            <div className="preview-card">
                                <div className="preview-header">
                                    <div className="preview-icon">
                                        <i className={previewClass.icon}></i>
                                    </div>
                                    <h3 className="preview-title">{previewClass.name}</h3>
                                </div>

                                <div className="preview-content">
                                    <div className="preview-section">
                                        <h4>Description</h4>
                                        <p className="class-full-description">
                                            {previewClass.description}
                                        </p>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Class Details</h4>
                                        <div className="class-details-preview">
                                            <div className="detail-item">
                                                <span className="detail-label">Theme:</span>
                                                <span className="detail-value">{previewClass.theme}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="preview-section">
                                        <h4>Class Features</h4>
                                        <div className="class-features">
                                            <div className="feature-item">
                                                <i className="fas fa-magic"></i>
                                                <span>Unique spell specializations</span>
                                            </div>
                                            <div className="feature-item">
                                                <i className="fas fa-fist-raised"></i>
                                                <span>Distinctive combat abilities</span>
                                            </div>
                                            <div className="feature-item">
                                                <i className="fas fa-chart-line"></i>
                                                <span>Progressive power scaling</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <i className="fas fa-sword"></i>
                                <h3>Select a Class</h3>
                                <p>Hover over or select a class to see its details and abilities.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3ClassSelection;
