/**
 * Step 8: Lore & Details
 *
 * Define character backstory, personality, and other lore details
 */

import React, { useState, useEffect } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import { LORE_PLACEHOLDERS, LORE_FIELD_HINTS } from '../../../constants/loreConstants';

const ALIGNMENT_OPTIONS = [
    { value: 'Lawful Good', label: 'Lawful Good', desc: 'Acts with honor, compassion, and duty.' },
    { value: 'Neutral Good', label: 'Neutral Good', desc: 'Guided by conscience to do what is right.' },
    { value: 'Chaotic Good', label: 'Chaotic Good', desc: 'Follows a personal moral compass without dogma.' },
    { value: 'Lawful Neutral', label: 'Lawful Neutral', desc: 'Driven by order, tradition, and code.' },
    { value: 'True Neutral', label: 'True Neutral', desc: 'Prefers balance and avoids extreme stances.' },
    { value: 'Chaotic Neutral', label: 'Chaotic Neutral', desc: 'Values individual freedom and passion above all.' },
    { value: 'Lawful Evil', label: 'Lawful Evil', desc: 'Methodically exploits hierarchy and authority.' },
    { value: 'Neutral Evil', label: 'Neutral Evil', desc: 'Self-serving and willing to do whatever it takes.' },
    { value: 'Chaotic Evil', label: 'Chaotic Evil', desc: 'Driven by greed, spite, or destructive impulse.' }
];

const LORE_GROUPS = [
    {
        key: 'narrative',
        label: 'Origin & Moral Alignment',
        icon: 'fas fa-book-open',
        fields: [
            {
                key: 'alignment',
                label: 'Moral Alignment',
                hint: 'Alignment',
                icon: 'fas fa-balance-scale',
                type: 'select',
                options: ALIGNMENT_OPTIONS
            },
            {
                key: 'backstory',
                label: 'Origin Story',
                hint: LORE_FIELD_HINTS.backstory,
                icon: 'fas fa-feather-alt',
                placeholder: LORE_PLACEHOLDERS.backstory,
                rows: 6
            }
        ]
    },
    {
        key: 'character',
        label: 'Heart & Fracture',
        icon: 'fas fa-brain',
        twoCol: true,
        fields: [
            { key: 'personalityTraits', label: 'Demeanor & Nature', hint: LORE_FIELD_HINTS.personalityTraits, icon: 'fas fa-smile', placeholder: LORE_PLACEHOLDERS.personalityTraits, rows: 3 },
            { key: 'ideals', label: 'Convictions', hint: LORE_FIELD_HINTS.ideals, icon: 'fas fa-star', placeholder: LORE_PLACEHOLDERS.ideals, rows: 3 },
            { key: 'bonds', label: 'Oaths & Tethers', hint: LORE_FIELD_HINTS.bonds, icon: 'fas fa-heart', placeholder: LORE_PLACEHOLDERS.bonds, rows: 3 },
            { key: 'flaws', label: 'Fractures & Weakness', hint: LORE_FIELD_HINTS.flaws, icon: 'fas fa-exclamation-triangle', placeholder: LORE_PLACEHOLDERS.flaws, rows: 3 }
        ]
    },
    {
        key: 'goals',
        label: 'Purpose & Dread',
        icon: 'fas fa-bullseye',
        twoCol: true,
        fields: [
            { key: 'goals', label: 'Purpose & Ambition', hint: LORE_FIELD_HINTS.goals, icon: 'fas fa-bullseye', placeholder: LORE_PLACEHOLDERS.goals, rows: 3 },
            { key: 'fears', label: 'Dreads', hint: LORE_FIELD_HINTS.fears, icon: 'fas fa-ghost', placeholder: LORE_PLACEHOLDERS.fears, rows: 3 }
        ]
    },
    {
        key: 'physical',
        label: 'Bearing & Aspect',
        icon: 'fas fa-user-circle',
        fields: [
            { key: 'appearance', label: 'Bearing & Aspect', hint: LORE_FIELD_HINTS.appearance, icon: 'fas fa-user-circle', placeholder: LORE_PLACEHOLDERS.appearance, rows: 4 }
        ]
    },
    {
        key: 'connections',
        label: 'Bonds & Marginalia',
        icon: 'fas fa-users',
        twoCol: true,
        fields: [
            { key: 'allies', label: 'Allies & Kin', hint: LORE_FIELD_HINTS.allies, icon: 'fas fa-users', placeholder: LORE_PLACEHOLDERS.allies, rows: 3 },
            { key: 'enemies', label: 'Adversaries & Blood-Debts', hint: LORE_FIELD_HINTS.enemies, icon: 'fas fa-skull-crossbones', placeholder: LORE_PLACEHOLDERS.enemies, rows: 3 },
            { key: 'organizations', label: 'Factions & Guilds', hint: LORE_FIELD_HINTS.organizations, icon: 'fas fa-flag', placeholder: LORE_PLACEHOLDERS.organizations, rows: 3 },
            { key: 'notes', label: 'Marginalia', hint: LORE_FIELD_HINTS.notes, icon: 'fas fa-sticky-note', placeholder: LORE_PLACEHOLDERS.notes, rows: 3 }
        ]
    }
];

const Step8LoreDetails = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const { characterData } = state;

    const [alignment, setAlignment] = useState(characterData.alignment || 'Neutral Good');
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

    // Keep alignment in sync with context basic info / characterData
    useEffect(() => {
        dispatch(wizardActionCreators.updateBasicInfo({ alignment }));
    }, [alignment, dispatch]);

    // Update context when lore data changes
    useEffect(() => {
        dispatch(wizardActionCreators.updateLore(loreData));
    }, [loreData, dispatch]);

    const handleLoreChange = (field, value) => {
        setLoreData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAlignmentChange = (value) => {
        setAlignment(value);
    };

    return (
        <div className="wizard-step-content">
            <div className="lore-details-layout">
                <div className="lore-section">
                    <div className="lore-header">
                        <h2>
                            <i className="fas fa-scroll"></i>
                            Forging Your Story
                        </h2>
                        <p className="lore-description">
                            The Wyrd finds its way in through the unwritten. Set down your character's moral alignment, origin, oaths, and the fears that hunt them in a world where the sun is dead and the fog eats memories.
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
                                        {field.hint && <span className="lore-field-hint">{field.hint}</span>}
                                        {field.type === 'select' ? (
                                            <select
                                                className="lore-field-input lore-field-select"
                                                value={alignment}
                                                onChange={(e) => handleAlignmentChange(e.target.value)}
                                            >
                                                {field.options.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label} — {opt.desc}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <textarea
                                                className="lore-field-input"
                                                placeholder={field.placeholder}
                                                value={loreData[field.key] || ''}
                                                onChange={(e) => handleLoreChange(field.key, e.target.value)}
                                                rows={field.rows}
                                            />
                                        )}
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
