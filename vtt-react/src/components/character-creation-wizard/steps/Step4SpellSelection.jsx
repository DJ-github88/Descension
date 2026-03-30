/**
 * Step 4: Spell Selection (All Classes)
 *
 * Allows all classes to select 3 starting spells from Level 1 pool
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators } from '../context/CharacterWizardContext';
import UnifiedSpellCard from '../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { getAbilityIconUrl, getCustomIconUrl } from '../../../utils/assetManager';
// Import all class data
import { ARCANONEER_DATA } from '../../../data/classes/arcanoneerData';
import { BERSERKER_DATA } from '../../../data/classes/berserkerData';
import { BLADEDANCER_DATA } from '../../../data/classes/bladedancerData';
import { CHAOS_WEAVER_DATA } from '../../../data/classes/chaosWeaverData';
import { CHRONARCH_DATA } from '../../../data/classes/chronarchData';
import { COVENBANE_DATA } from '../../../data/classes/covenbaneData';
import { DEATHCALLER_DATA } from '../../../data/classes/deathcallerData';
import { DREADNAUGHT_DATA } from '../../../data/classes/dreadnaughtData';
import { EXORCIST_DATA } from '../../../data/classes/exorcistData';
import { FALSE_PROPHET_DATA } from '../../../data/classes/falseProphetData';
import { FATE_WEAVER_DATA } from '../../../data/classes/fateWeaverData';
import { FORMBENDER_DATA } from '../../../data/classes/formbenderData';
import { GAMBLER_DATA } from '../../../data/classes/gamblerData';
import { HUNTRESS_DATA } from '../../../data/classes/huntressData';
import { INSCRIPTOR_DATA } from '../../../data/classes/inscriptorData';
import { LICHBORNE_DATA } from '../../../data/classes/lichborneData';
import { LUNARCH_DATA } from '../../../data/classes/lunarchData';
import { MARTYR_DATA } from '../../../data/classes/martyrData';
import { MINSTREL_DATA } from '../../../data/classes/minstrelData';
import { ORACLE_DATA } from '../../../data/classes/oracleData';
import { PLAGUEBRINGER_DATA } from '../../../data/classes/plaguebringerData';
import { PRIMALIST_DATA } from '../../../data/classes/primalistData';
import { PYROFIEND_DATA } from '../../../data/classes/pyrofiendData';
import { SPELLGUARD_DATA } from '../../../data/classes/spellguardData';
import { TITAN_DATA } from '../../../data/classes/titanData';
import { TOXICOLOGIST_DATA } from '../../../data/classes/toxicologistData';
import { WARDEN_DATA } from '../../../data/classes/wardenData';
import { WITCH_DOCTOR_DATA } from '../../../data/classes/witchDoctorData';
import '../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../spellcrafting-wizard/styles/pathfinder/components/wow-spellbook.css';
import './Step4SpellSelection.css';

// Helper function to map WoW icon IDs to local ability icons for spells
const mapSpellIcon = (wowIconId) => {
  const iconMapping = {
    // Combat/Attack icons
    'ability_meleedamage': 'General/Combat Downward Strike',
    'ability_warrior_savageblow': 'General/Combat Downward Strike',
    'ability_warrior_charge': 'General/Combat Downward Strike',
    'ability_warrior_revenge': 'General/Combat Downward Strike',
    'ability_warrior_cleave': 'General/Combat Downward Strike',
    'ability_warrior_riposte': 'Utility/Parry',
    'ability_warrior_shieldbash': 'Utility/Shield',
    'ability_rogue_evasion': 'Utility/Speed Dash',
    'ability_rogue_feint': 'Utility/Parry',
    'ability_rogue_sprint': 'Utility/Speed Dash',
    'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
    'ability_stealth': 'Utility/Hide',
    'ability_hunter_snipershot': 'Utility/Target Crosshair',
    'ability_hunter_markedshot': 'Utility/Target Crosshair',
    'ability_hunter_markedfordeath': 'Utility/Target Crosshair',
    
    // Defensive icons
    'inv_shield_05': 'Utility/Shield',
    'inv_shield_04': 'Utility/Shield',
    'ability_warrior_defensivestance': 'Utility/Shield',
    'spell_holy_powerwordshield': 'Utility/Shield',
    'spell_holy_devotionaura': 'Radiant/Divine Blessing',
    
    // Healing/Support icons
    'spell_holy_greaterheal': 'Healing/Golden Heart',
    'spell_holy_heal02': 'Healing/Golden Heart',
    'spell_holy_flashheal': 'Healing/Golden Heart',
    'spell_holy_renew': 'Healing/Renewal',
    
    // Utility icons
    'spell_arcane_portaldalaran': 'Utility/Utility',
    'spell_arcane_teleportundercity': 'Utility/Utility',
    'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
    'inv_misc_questionmark': 'Utility/Utility',
    'inv_misc_book_07': 'Utility/Utility',
    'inv_misc_bag_08': 'Utility/Utility',
    
    // Magic/Damage icons
    'spell_fire_fireball02': 'Fire/Swirling Fireball',
    'spell_fire_flamebolt': 'Fire/Flame Burst',
    'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
    'spell_arcane_blast': 'Arcane/Magical Sword',
    'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
    'spell_holy_holysmite': 'Radiant/Divine Blessing',
    'spell_nature_lightning': 'Lightning/Lightning Bolt',
    
    // Control icons
    'spell_frost_chainsofice': 'Frost/Frozen in Ice',
    'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
    
    // Buff icons
    'spell_holy_divineillumination': 'Radiant/Divine Blessing',
    'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
    
    // Summoning icons
    'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
    'spell_shadow_summoninfernal': 'Utility/Summon Minion',
    
    // Transformation icons
    'ability_druid_catform': 'Utility/Utility',
    
    // Trap icons
    'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
    
    // Wild magic icons
    'spell_arcane_arcane04': 'Arcane/Magical Sword'
  };
  
  return iconMapping[wowIconId] || null;
};

// Helper function to get spell icon URL using local ability icons
const getSpellIconUrl = (iconId) => {
  // If no icon is set, use default
  if (!iconId) {
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // If it's already a full URL (ability icon), return as-is
  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
    return iconId;
  }

  // If it's already an ability icon path (e.g., "Fire/Flame Burst"), use it directly
  if (iconId.includes('/') && !iconId.startsWith('http')) {
    // Check if it's using the new folder structure (e.g., "Fire/Flame Burst")
    if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
      return getCustomIconUrl(iconId, 'abilities');
    }
    // Otherwise try to use it as-is
    return getCustomIconUrl(iconId, 'abilities');
  }

  // If it's a WoW icon ID, try to map it to a local ability icon
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const mappedIcon = mapSpellIcon(iconId);
    if (mappedIcon) {
      return getCustomIconUrl(mappedIcon, 'abilities');
    }
    // If no mapping found, use default instead of getAbilityIconUrl (which adds creature- prefix)
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }

  // Default fallback
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

// Map of class names to their data
const CLASS_DATA_MAP = {
    'Arcanoneer': ARCANONEER_DATA,
    'Berserker': BERSERKER_DATA,
    'Bladedancer': BLADEDANCER_DATA,
    'Chaos Weaver': CHAOS_WEAVER_DATA,
    'Chronarch': CHRONARCH_DATA,
    'Covenbane': COVENBANE_DATA,
    'Deathcaller': DEATHCALLER_DATA,
    'Dreadnaught': DREADNAUGHT_DATA,
    'Exorcist': EXORCIST_DATA,
    'False Prophet': FALSE_PROPHET_DATA,
    'Fate Weaver': FATE_WEAVER_DATA,
    'Formbender': FORMBENDER_DATA,
    'Gambler': GAMBLER_DATA,
    'Huntress': HUNTRESS_DATA,
    'Inscriptor': INSCRIPTOR_DATA,
    'Lichborne': LICHBORNE_DATA,
    'Lunarch': LUNARCH_DATA,
    'Martyr': MARTYR_DATA,
    'Minstrel': MINSTREL_DATA,
    'Oracle': ORACLE_DATA,
    'Plaguebringer': PLAGUEBRINGER_DATA,
    'Primalist': PRIMALIST_DATA,
    'Pyrofiend': PYROFIEND_DATA,
    'Spellguard': SPELLGUARD_DATA,
    'Titan': TITAN_DATA,
    'Toxicologist': TOXICOLOGIST_DATA,
    'Warden': WARDEN_DATA,
    'Witch Doctor': WITCH_DOCTOR_DATA
};

// All classes that have spells
const SPELL_CLASSES = Object.keys(CLASS_DATA_MAP);

// Helper function to get level 1 spell IDs from class data
const getLevel1SpellIds = (classData) => {
    if (!classData) return [];
    
    // First try spellPools[1]
    if (classData.spellPools && classData.spellPools[1]) {
        return classData.spellPools[1];
    }
    
    // Fallback: filter spells array for level 1 spells
    if (classData.spells && Array.isArray(classData.spells)) {
        return classData.spells
            .filter(spell => spell.level === 1)
            .map(spell => spell.id);
    }
    
    return [];
};

const Step4SpellSelection = () => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();
    const [selectedSpells, setSelectedSpells] = useState([]);
    const [viewingSpell, setViewingSpell] = useState(null);

    // Get character class
    const characterClass = state.characterData.class;

    // Get Level 1 spell pool based on class
    const level1SpellPool = useMemo(() => {
        if (!SPELL_CLASSES.includes(characterClass)) return [];

        const classData = CLASS_DATA_MAP[characterClass];
        if (!classData) return [];

        const level1SpellIds = getLevel1SpellIds(classData);
        // Support both 'spells' (new format) and 'exampleSpells' (legacy format)
        const allSpells = classData.spells || classData.exampleSpells || [];

        // Filter spells that are in the level 1 pool and map class-specific mechanics
        return allSpells
            .filter(spell => level1SpellIds.includes(spell.id))
            .map(spell => ({
                ...spell,
                // Flatten Inferno Level mechanics for Pyrofiend spell cards
                infernoRequired: spell.specialMechanics?.infernoLevel?.required,
                infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,
                infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy,
                // Musical combo mechanics are already in the correct format for Minstrel
                musicalCombo: spell.specialMechanics?.musicalCombo,
                // Temporal mechanics for Chronarch spell cards (both generation and consumption)
                timeShardGenerate: spell.specialMechanics?.timeShards?.generated,
                timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,
                temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,
                temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced,
                // Mayhem mechanics for Chaos Weaver spell cards (both generation and consumption)
                mayhemGenerate: spell.resourceFormulas?.mayhem_generate,
                mayhemCost: spell.resourceValues?.mayhem_spend || spell.resourceValues?.mayhem_cost,
                // Devotion Level mechanics for Martyr spell cards
                devotionRequired: spell.specialMechanics?.devotionLevel?.required,
                devotionCost: spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost,
                devotionGain: spell.specialMechanics?.devotionLevel?.gain
            }));
    }, [characterClass]);

    // Load existing spell selection if available
    useEffect(() => {
        if (SPELL_CLASSES.includes(characterClass)) {
            // Check if spells are already selected
            const existingSpells = state.characterData.class_spells?.known_spells || [];

            if (existingSpells.length > 0) {
                // Load existing selection
                setSelectedSpells(existingSpells);
            }
        }
    }, [characterClass, state.characterData.class_spells]);

    // If not a spell-casting class, skip this step
    if (!SPELL_CLASSES.includes(characterClass)) {
        return (
            <div className="wizard-step spell-selection-step">
                <div className="step-header">
                    <h2>Starting Spells</h2>
                    <p className="step-description">
                        No spells available for this class. You can proceed to the next step.
                    </p>
                </div>
            </div>
        );
    }

    // Fallback spell pool if data not found
    const displaySpellPool = level1SpellPool.length > 0 ? level1SpellPool : [
        {
            id: 'arc_minor_arcane_bolt',
            name: 'Minor Arcane Bolt',
            description: 'A basic arcane projectile',
            icon: 'spell_arcane_blast',
            spellType: 'ACTION',
            school: 'Evocation',
            level: 1,
            sphereCost: ['Arcane'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60 },
            durationConfig: { durationType: 'instant' },
            resourceCost: { mana: 3, spheres: ['Arcane'] },
            resolution: 'ATTACK',
            damageConfig: { formula: '1d6', damageType: 'force' },
            tags: ['1-sphere', 'arcane', 'force', 'single-target']
        },
        {
            id: 'arc_flame_spark',
            name: 'Flame Spark',
            description: 'A small burst of fire',
            icon: 'spell_fire_flamebolt',
            spellType: 'ACTION',
            school: 'Evocation',
            level: 1,
            sphereCost: ['Fire'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30 },
            durationConfig: { durationType: 'instant' },
            resourceCost: { mana: 3, spheres: ['Fire'] },
            resolution: 'SAVE',
            saveConfig: { saveType: 'agility', saveDC: 12, onSaveEffect: 'half' },
            damageConfig: { formula: '1d8', damageType: 'fire' },
            tags: ['1-sphere', 'fire', 'single-target']
        },
        {
            id: 'arc_frost_touch',
            name: 'Frost Touch',
            description: 'A chilling touch that slows enemies',
            icon: 'spell_frost_frostbolt02',
            spellType: 'ACTION',
            school: 'Evocation',
            level: 1,
            sphereCost: ['Ice'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5 },
            durationConfig: { durationType: 'rounds', durationAmount: 2 },
            resourceCost: { mana: 3, spheres: ['Ice'] },
            resolution: 'ATTACK',
            damageConfig: { formula: '1d4', damageType: 'frost' },
            effects: {
                debuff: {
                    type: 'speed_reduction',
                    value: -10,
                    duration: 2
                }
            },
            tags: ['1-sphere', 'ice', 'cold', 'debuff']
        },
        {
            id: 'arc_healing_light',
            name: 'Healing Light',
            description: 'A gentle healing glow',
            icon: 'spell_holy_flashheal',
            spellType: 'ACTION',
            school: 'Restoration',
            level: 1,
            sphereCost: ['Healing'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5 },
            durationConfig: { durationType: 'instant' },
            resourceCost: { mana: 4, spheres: ['Healing'] },
            resolution: 'AUTO',
            healingConfig: { formula: '1d6+2', healingType: 'direct' },
            tags: ['1-sphere', 'healing', 'support']
        },
        {
            id: 'arc_nature_growth',
            name: 'Nature\'s Growth',
            description: 'Summon minor plant growth',
            icon: 'spell_nature_naturetouchgrow',
            spellType: 'ACTION',
            school: 'Conjuration',
            level: 1,
            sphereCost: ['Nature'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'ground', rangeType: 'ranged', rangeDistance: 30, aoeType: 'circle', aoeSize: 10 },
            durationConfig: { durationType: 'minutes', durationAmount: 10 },
            resourceCost: { mana: 3, spheres: ['Nature'] },
            resolution: 'AUTO',
            effects: {
                terrain: {
                    type: 'difficult_terrain',
                    duration: 10
                }
            },
            tags: ['1-sphere', 'nature', 'terrain', 'control']
        },
        {
            id: 'arc_shadow_veil',
            name: 'Shadow Veil',
            description: 'Cloak yourself in shadows',
            icon: 'spell_shadow_charm',
            spellType: 'ACTION',
            school: 'Illusion',
            level: 1,
            sphereCost: ['Shadow'],
            typeConfig: { castTime: 1, castTimeType: 'ACTION' },
            targetingConfig: { targetingType: 'self', rangeType: 'self' },
            durationConfig: { durationType: 'minutes', durationAmount: 5 },
            resourceCost: { mana: 4, spheres: ['Shadow'] },
            resolution: 'AUTO',
            effects: {
                buff: {
                    type: 'stealth_bonus',
                    value: 5,
                    duration: 5
                }
            },
            tags: ['1-sphere', 'shadow', 'stealth', 'utility']
        }
    ];

    const handleSpellToggle = (spellId) => {
        setSelectedSpells(prev => {
            let newSelection;
            if (prev.includes(spellId)) {
                // Deselect
                newSelection = prev.filter(id => id !== spellId);
            } else {
                // Select (max 3)
                if (prev.length >= 3) {
                    return prev; // Don't allow more than 3
                }
                newSelection = [...prev, spellId];
            }
            
            // Update wizard state
            dispatch(wizardActionCreators.setStartingSpells(newSelection));
            return newSelection;
        });
    };

    const handleSpellView = (spellId) => {
        setViewingSpell(spellId);
    };

    const currentSpell = viewingSpell ? displaySpellPool.find(s => s.id === viewingSpell) : null;

    // Get class-specific description
    const getClassDescription = () => {
        if (characterClass === 'Arcanoneer') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as an Arcanoneer. These spells will form the foundation of your sphere-combining arsenal.';
        } else if (characterClass === 'Pyrofiend') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as a Pyrofiend. These spells will help you master the Inferno Veil and demonic fire.';
        } else if (characterClass === 'Minstrel') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as a Minstrel. These spells will help you build musical notes and perform powerful cadences.';
        } else if (characterClass === 'Chronarch') {
            return 'Select 3 spells from the Level 1 spell pool to begin your journey as a Chronarch. These spells will help you generate Time Shards and manage Temporal Strain.';
        }
        return 'Select 3 starting spells for your character.';
    };

    return (
        <div className="wizard-step spell-selection-step">
            <div className="step-header">
                <h2>Choose Your Starting Spells</h2>
                <p className="step-description">
                    {getClassDescription()}
                </p>
                <div className="selection-counter">
                    <span className={selectedSpells.length === 3 ? 'complete' : 'incomplete'}>
                        {selectedSpells.length} / 3 spells selected
                    </span>
                </div>
            </div>

            <div className="spell-selection-layout">
                {/* Left: Spell Icon Grid */}
                <div className="spell-icons-column">
                    <h4 className="spell-category-title">
                        <i className="fas fa-magic"></i> Level 1 Spells
                    </h4>
                    <div className="spell-icon-grid">
                        {displaySpellPool.map(spell => {
                            const isSelected = selectedSpells.includes(spell.id);
                            const isViewing = viewingSpell === spell.id;

                            return (
                                <div
                                    key={spell.id}
                                    className={`spell-icon-card ${isSelected ? 'selected' : ''} ${isViewing ? 'viewing' : ''}`}
                                    onClick={() => handleSpellView(spell.id)}
                                    title={spell.name}
                                >
                                    <div className="spell-icon-image">
                                        <img
                                            src={getSpellIconUrl(spell.icon)}
                                            alt={spell.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                            }}
                                        />
                                        {isSelected && (
                                            <div className="selection-checkmark">
                                                <i className="fas fa-check-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="spell-icon-name">{spell.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Spell Detail Card */}
                <div className="spell-detail-column">
                    {currentSpell ? (
                        <>
                            <UnifiedSpellCard
                                spell={currentSpell}
                                variant="wizard"
                                showActions={false}
                                showDescription={true}
                                showStats={true}
                                showTags={true}
                            />
                            <div className="spell-action-buttons">
                                <button
                                    className={`spell-select-btn ${selectedSpells.includes(currentSpell.id) ? 'selected' : ''}`}
                                    onClick={() => handleSpellToggle(currentSpell.id)}
                                    disabled={!selectedSpells.includes(currentSpell.id) && selectedSpells.length >= 3}
                                >
                                    {selectedSpells.includes(currentSpell.id) ? (
                                        <>
                                            <i className="fas fa-check-circle"></i> Selected
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-plus-circle"></i> Select Spell
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-spell-selected">
                            <i className="fas fa-hand-pointer"></i>
                            <p>Click a spell icon to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4SpellSelection;

