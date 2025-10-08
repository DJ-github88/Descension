/**
 * Step 8: Lore & Details
 *
 * Define character backstory, personality, and other lore details
 */

import React, { useState, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';

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

    const loreFields = [
        {
            key: 'backstory',
            label: 'Backstory',
            icon: 'fas fa-book-open',
            placeholder: 'Describe your character\'s history, upbringing, and how they became an adventurer...',
            rows: 6
        },
        {
            key: 'personalityTraits',
            label: 'Personality Traits',
            icon: 'fas fa-smile',
            placeholder: 'What are your character\'s distinctive personality traits?',
            rows: 3
        },
        {
            key: 'ideals',
            label: 'Ideals',
            icon: 'fas fa-star',
            placeholder: 'What beliefs or principles guide your character?',
            rows: 3
        },
        {
            key: 'bonds',
            label: 'Bonds',
            icon: 'fas fa-heart',
            placeholder: 'Who or what is your character connected to?',
            rows: 3
        },
        {
            key: 'flaws',
            label: 'Flaws',
            icon: 'fas fa-exclamation-triangle',
            placeholder: 'What weaknesses or vices does your character have?',
            rows: 3
        },
        {
            key: 'appearance',
            label: 'Physical Appearance',
            icon: 'fas fa-user-circle',
            placeholder: 'Describe your character\'s physical features, clothing, and distinguishing marks...',
            rows: 4
        },
        {
            key: 'goals',
            label: 'Goals & Ambitions',
            icon: 'fas fa-bullseye',
            placeholder: 'What does your character hope to achieve?',
            rows: 3
        },
        {
            key: 'fears',
            label: 'Fears & Phobias',
            icon: 'fas fa-ghost',
            placeholder: 'What does your character fear most?',
            rows: 3
        },
        {
            key: 'allies',
            label: 'Allies & Friends',
            icon: 'fas fa-users',
            placeholder: 'Who are your character\'s allies and friends?',
            rows: 3
        },
        {
            key: 'enemies',
            label: 'Enemies & Rivals',
            icon: 'fas fa-skull-crossbones',
            placeholder: 'Who opposes your character?',
            rows: 3
        },
        {
            key: 'organizations',
            label: 'Organizations & Affiliations',
            icon: 'fas fa-flag',
            placeholder: 'What groups or organizations is your character affiliated with?',
            rows: 3
        },
        {
            key: 'notes',
            label: 'Additional Notes',
            icon: 'fas fa-sticky-note',
            placeholder: 'Any other details about your character...',
            rows: 4
        }
    ];

    return (
        <div className="wizard-step-content">
            <div className="step-body">
                <div className="lore-details-layout">
                    {/* Lore Section */}
                    <div className="lore-section">
                        <div className="lore-header">
                            <h2>
                                <i className="fas fa-scroll"></i>
                                Character Lore & Personality
                            </h2>
                            <p className="lore-description">
                                Bring your character to life by defining their backstory, personality, and motivations. 
                                All fields are optional, but adding details will make your character more memorable and engaging.
                            </p>
                        </div>

                        <div className="lore-fields-grid">
                            {loreFields.map((field) => (
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
                                    <div className="character-count">
                                        {(loreData[field.key] || '').length} characters
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step8LoreDetails;

