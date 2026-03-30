/**
 * Step 8: Lore & Details
 *
 * Define character backstory, personality, and other lore details
 */

import React, { useState, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';

const LORE_GROUPS = [
    {
        key: 'narrative',
        label: 'Story',
        icon: 'fas fa-book-open',
        fields: [
            { key: 'backstory', label: 'Backstory', icon: 'fas fa-feather-alt', placeholder: 'How did your character become who they are today? Describe upbringing, pivotal moments, and path to adventure...', rows: 6 }
        ]
    },
    {
        key: 'character',
        label: 'Character',
        icon: 'fas fa-brain',
        twoCol: true,
        fields: [
            { key: 'personalityTraits', label: 'Personality Traits', icon: 'fas fa-smile', placeholder: 'Distinctive traits that define how your character acts...', rows: 3 },
            { key: 'ideals', label: 'Ideals', icon: 'fas fa-star', placeholder: 'Beliefs and principles that guide your character\'s choices...', rows: 3 },
            { key: 'bonds', label: 'Bonds', icon: 'fas fa-heart', placeholder: 'People, places, or things your character is deeply connected to...', rows: 3 },
            { key: 'flaws', label: 'Flaws', icon: 'fas fa-exclamation-triangle', placeholder: 'Weaknesses, vices, or dark secrets your character carries...', rows: 3 }
        ]
    },
    {
        key: 'goals',
        label: 'Goals & Fears',
        icon: 'fas fa-bullseye',
        twoCol: true,
        fields: [
            { key: 'goals', label: 'Goals & Ambitions', icon: 'fas fa-bullseye', placeholder: 'What does your character hope to achieve or become?', rows: 3 },
            { key: 'fears', label: 'Fears & Phobias', icon: 'fas fa-ghost', placeholder: 'What does your character fear most deeply?', rows: 3 }
        ]
    },
    {
        key: 'physical',
        label: 'Physical Appearance',
        icon: 'fas fa-user-circle',
        fields: [
            { key: 'appearance', label: 'Physical Appearance', icon: 'fas fa-user-circle', placeholder: 'Describe your character\'s physical features, clothing style, and distinguishing marks...', rows: 4 }
        ]
    },
    {
        key: 'connections',
        label: 'Connections & Notes',
        icon: 'fas fa-users',
        twoCol: true,
        fields: [
            { key: 'allies', label: 'Allies & Friends', icon: 'fas fa-users', placeholder: 'Trusted companions, mentors, or friends...', rows: 3 },
            { key: 'enemies', label: 'Enemies & Rivals', icon: 'fas fa-skull-crossbones', placeholder: 'Those who stand against your character...', rows: 3 },
            { key: 'organizations', label: 'Organizations', icon: 'fas fa-flag', placeholder: 'Factions, guilds, or groups your character belongs to...', rows: 3 },
            { key: 'notes', label: 'Additional Notes', icon: 'fas fa-sticky-note', placeholder: 'Any other details about your character...', rows: 3 }
        ]
    }
];

const Step8LoreDetails = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData } = state;

    const [loreData, setLoreData] = useState(characterData.lore || {
        backstory: '',
        personalityTraits: '',
        ideals: '',
        bonds: '',
        flaws: '',
        appearance: '',
        goals: '',
        fears: '',
        allies: '',
        enemies: '',
        organizations: '',
        notes: ''
    });

    // Update context when lore data changes
    useEffect(() => {
        dispatch(wizardActionCreators.updateLore(loreData));
    }, [loreData, dispatch]);

    const handleLoreChange = (field, value) => {
        setLoreData({
            ...loreData,
            [field]: value
        });
    };

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="lore-details-layout">
                    <div className="lore-section">
                        <div className="lore-header">
                            <h2>
                                <i className="fas fa-scroll"></i>
                                Character Lore &amp; Personality
                            </h2>
                            <p className="lore-description">
                                Bring your character to life by defining their backstory, personality, and motivations.
                                All fields are optional — but the more you add, the more memorable your hero becomes.
                            </p>
                        </div>

                        {LORE_GROUPS.map((group) => (
                            <div key={group.key} className="lore-group">
                                <div className="lore-group-header">
                                    <i className={group.icon}></i>
                                    {group.label}
                                </div>
                                <div className={`lore-group-fields${group.twoCol ? ' two-col' : ''}`}>
                                    {group.fields.map((field) => (
                                        <div key={field.key} className="lore-field-container">
                                            <label className="lore-field-label">
                                                <i className={field.icon}></i>
                                                {field.label}
                                            </label>
                                            <textarea
                                                className="lore-field-input"
                                                placeholder={field.placeholder}
                                                value={loreData[field.key] || ''}
                                                onChange={(e) => handleLoreChange(field.key, e.target.value)}
                                                rows={field.rows}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step8LoreDetails;
