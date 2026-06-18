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
        label: 'Origin',
        icon: 'fas fa-book-open',
        fields: [
            { key: 'backstory', label: 'Origin Story', icon: 'fas fa-feather-alt', placeholder: 'Where were you when the fog found you? Trace your life from the cold hearth of your upbringing to the moment you took the frozen road...', rows: 6 }
        ]
    },
    {
        key: 'character',
        label: 'Heart & Fracture',
        icon: 'fas fa-brain',
        twoCol: true,
        fields: [
            { key: 'personalityTraits', label: 'Demeanor & Nature', icon: 'fas fa-smile', placeholder: 'How do you carry yourself beneath the endless dark? Mannerisms, habits, and the face you show strangers in the lamplight...', rows: 3 },
            { key: 'ideals', label: 'Convictions', icon: 'fas fa-star', placeholder: 'What principle do you cling to when the lamps go out? The Solbrand\'s fading warmth, the Keeper\'s ledger, a personal oath — what will you not betray?', rows: 3 },
            { key: 'bonds', label: 'Oaths & Tethers', icon: 'fas fa-heart', placeholder: 'To what — or whom — are you bound? A name carved in glacier-ice, an entry in the Canopy-Ledger, a debt to something that does not forget...', rows: 3 },
            { key: 'flaws', label: 'Fractures & Weakness', icon: 'fas fa-exclamation-triangle', placeholder: 'Where are you cracked? The Wyrd finds the broken places first — a vice, a buried dread, a secret the cold has kept for you...', rows: 3 }
        ]
    },
    {
        key: 'goals',
        label: 'Purpose & Dread',
        icon: 'fas fa-bullseye',
        twoCol: true,
        fields: [
            { key: 'goals', label: 'Purpose & Ambition', icon: 'fas fa-bullseye', placeholder: 'What keeps you walking the frozen roads? A name to restore, a ledger to settle, a light to rekindle — or simply to see one more Dimming...', rows: 3 },
            { key: 'fears', label: 'Dreads', icon: 'fas fa-ghost', placeholder: 'Fear spawns things in Mythrill. What hunts you in the quiet? The dark beneath the caldera, the day the Solbrand dies, the name you almost forgot...', rows: 3 }
        ]
    },
    {
        key: 'physical',
        label: 'Bearing & Aspect',
        icon: 'fas fa-user-circle',
        fields: [
            { key: 'appearance', label: 'Bearing & Aspect', icon: 'fas fa-user-circle', placeholder: 'Wind-leather and ash-cloth, bog-iron and bone. Describe how your character looks and dresses, and the marks the dark world has left on them...', rows: 4 }
        ]
    },
    {
        key: 'connections',
        label: 'Bonds & Marginalia',
        icon: 'fas fa-users',
        twoCol: true,
        fields: [
            { key: 'allies', label: 'Allies & Kin', icon: 'fas fa-users', placeholder: 'Who walks the dark beside you? A mentor of your tradition, a bond-kin of your people, a contractor who has not yet betrayed you...', rows: 3 },
            { key: 'enemies', label: 'Adversaries & Blood-Debts', icon: 'fas fa-skull-crossbones', placeholder: 'Who hunts you across the regions? A Marked Vreken, a broken contract\'s enforcer, a rival of your house — and what stands between you?', rows: 3 },
            { key: 'organizations', label: 'Factions & Guilds', icon: 'fas fa-flag', placeholder: 'The Luminarchy, the Solbrand tending-clans, a Neth house, a Bloodhammer band — what banner do you answer to, openly or in the dark?', rows: 3 },
            { key: 'notes', label: 'Marginalia', icon: 'fas fa-sticky-note', placeholder: 'Scratchings for the long dark — rumors overheard at the waystation, ledger-balances, a verse half-remembered...', rows: 3 }
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
                            Before you lies a blank page in a freezing world. Set down who your character is — their origin, the oaths that bind them, the dreads that hunt them. All fields are optional, but the unwritten is where the Wyrd finds its way in.
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
