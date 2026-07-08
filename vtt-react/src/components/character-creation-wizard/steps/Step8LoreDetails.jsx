/**
 * Step 8: Lore & Details
 *
 * Define character backstory, personality, and other lore details
 */

import React, { useState, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { LORE_PLACEHOLDERS } from '../../../constants/loreConstants';

const LORE_GROUPS = [
    {
        key: 'narrative',
        label: 'Origin',
        icon: 'fas fa-book-open',
        fields: [
            { key: 'backstory', label: 'Origin Story', icon: 'fas fa-feather-alt', placeholder: LORE_PLACEHOLDERS.backstory, rows: 6 }
        ]
    },
    {
        key: 'character',
        label: 'Heart & Fracture',
        icon: 'fas fa-brain',
        twoCol: true,
        fields: [
            { key: 'personalityTraits', label: 'Demeanor & Nature', icon: 'fas fa-smile', placeholder: LORE_PLACEHOLDERS.personalityTraits, rows: 3 },
            { key: 'ideals', label: 'Convictions', icon: 'fas fa-star', placeholder: LORE_PLACEHOLDERS.ideals, rows: 3 },
            { key: 'bonds', label: 'Oaths & Tethers', icon: 'fas fa-heart', placeholder: LORE_PLACEHOLDERS.bonds, rows: 3 },
            { key: 'flaws', label: 'Fractures & Weakness', icon: 'fas fa-exclamation-triangle', placeholder: LORE_PLACEHOLDERS.flaws, rows: 3 }
        ]
    },
    {
        key: 'goals',
        label: 'Purpose & Dread',
        icon: 'fas fa-bullseye',
        twoCol: true,
        fields: [
            { key: 'goals', label: 'Purpose & Ambition', icon: 'fas fa-bullseye', placeholder: LORE_PLACEHOLDERS.goals, rows: 3 },
            { key: 'fears', label: 'Dreads', icon: 'fas fa-ghost', placeholder: LORE_PLACEHOLDERS.fears, rows: 3 }
        ]
    },
    {
        key: 'physical',
        label: 'Bearing & Aspect',
        icon: 'fas fa-user-circle',
        fields: [
            { key: 'appearance', label: 'Bearing & Aspect', icon: 'fas fa-user-circle', placeholder: LORE_PLACEHOLDERS.appearance, rows: 4 }
        ]
    },
    {
        key: 'connections',
        label: 'Bonds & Marginalia',
        icon: 'fas fa-users',
        twoCol: true,
        fields: [
            { key: 'allies', label: 'Allies & Kin', icon: 'fas fa-users', placeholder: LORE_PLACEHOLDERS.allies, rows: 3 },
            { key: 'enemies', label: 'Adversaries & Blood-Debts', icon: 'fas fa-skull-crossbones', placeholder: LORE_PLACEHOLDERS.enemies, rows: 3 },
            { key: 'organizations', label: 'Factions & Guilds', icon: 'fas fa-flag', placeholder: LORE_PLACEHOLDERS.organizations, rows: 3 },
            { key: 'notes', label: 'Marginalia', icon: 'fas fa-sticky-note', placeholder: LORE_PLACEHOLDERS.notes, rows: 3 }
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
            <div className="lore-details-layout">
                <div className="lore-section">
                    <div className="lore-header">
                        <h2>
                            <i className="fas fa-scroll"></i>
                            Character Chronicle
                        </h2>
                        <p className="lore-description">
                            Before you lies a blank page in a freezing world. Set down who your character is: their origin, the oaths that bind them, the dreads that hunt them. All fields are optional, but the unwritten is where the Wyrd finds its way in.
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
    );
};

export default Step8LoreDetails;
