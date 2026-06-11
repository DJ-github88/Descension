/**
 * Step 9: Character Summary & Finalization
 *
 * Final review of character before creation
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCharacterWizardState } from '../context/CharacterWizardContext';
import { ABILITY_SCORES, getStatBreakdown } from '../../../utils/pointBuySystem';
import { getWowIconUrl, getIconUrl, getCustomIconUrl, getAbilityIconUrl } from '../../../utils/assetManager';
import { getBackgroundData, getBackgroundStatModifiers } from '../../../data/backgroundData';
import { getBackgroundAbilities } from '../../../data/backgroundAbilities';
import { applyRacialModifiers, RACE_DATA, getFullRaceData } from '../../../data/raceData';
import { getEquipmentPreview, STARTING_EQUIPMENT_LIBRARY } from '../../../data/startingEquipmentData';
import ItemTooltip from '../../item-generation/ItemTooltip';
import ClassIcon from '../../common/ClassIcon';
import { ALL_CLASS_SPELLS, CLASS_DATA_MAP } from '../../../data/classSpellGenerator';

import '../styles/Step9CharacterSummary.css';

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
    
    // Nature icons
    'spell_nature_naturetouchgrow': 'Nature/Gnarled Roots',
    'spell_nature_naturesblessing': 'Nature/Growth',
    
    // Shadow icons
    'spell_shadow_charm': 'Utility/Glowing Hooded Figure',
    
    // Wild magic icons
    'spell_arcane_arcane04': 'Arcane/Magical Sword'
  };
  
  return iconMapping[wowIconId] || null;
};

// Helper function to get spell icon URL using local ability icons
const getSpellIconUrl = (iconId) => {
  if (!iconId) {
    return getCustomIconUrl('Utility/Utility', 'abilities');
  }
  if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
    return iconId;
  }
  if (iconId.includes('/') && !iconId.startsWith('http')) {
    return getCustomIconUrl(iconId, 'abilities');
  }
  if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
    const mappedIcon = mapSpellIcon(iconId);
    if (mappedIcon) {
      return getCustomIconUrl(mappedIcon, 'abilities');
    }
    return getAbilityIconUrl(iconId);
  }
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

const getSubraceImage = (subraceId, raceId) => {
    const mapping = {
        // Myrathil
        breaker_myrathil: 'breakersborn_illustration.png',
        deep_myrathil: 'deepborn_illustration.png',
        river_myrathil: 'riverfed_illustration.png',
        // Briaran
        unshorn_briaran: 'unshorn_illustration.png',
        smoothskinned_briaran: 'smoothskinned_illustration.png',
        // Emberth
        korr_emberth: 'korr_illustration.png',
        thrask_emberth: 'thrask_illustration.png',
        // Fexrick
        kethrin_fexric: 'kethrin_illustration.png',
        drall_fexric: 'drall_illustration.png',
        // Groven
        morgh_groven: 'morgh_illustration.png',
        ithran_groven: 'ithran_illustration.png',
        // Mimir
        maskborne_mimir: 'maskborne_illustration.png',
        mistwoven_mimir: 'mistwoven_illustration.png',
        unwoven_mimir: 'unwoven_illustration.png',
        // Neth
        velun_neth: 'velun_illustration.png',
        kessen_neth: 'kessen_illustration.png',
        drun_neth: 'drun_illustration.png',
        // Astril
        sylen_astril: 'sylen_illustration.png',
        muren_astril: 'muren_illustration.png',
        // Vreken
        clean_vreken: 'clean_illustration.png',
        marked_vreken: 'marked_illustration.png',
        // Human
        thalren_human: 'thalren_illustration.png',
        skald_human: 'skald_illustration.png',
        tessen_human: 'tessen_illustration.png',
        solvarn_human: 'solvarn_illustration.png',
        merryn_human: 'merryn_illustration.png',
        ordan_human: 'ordan_illustration.png',
        morren_human: 'morren_illustration.png'
    };
    
    if (subraceId && mapping[subraceId]) {
        return `/assets/images/races/${mapping[subraceId]}`;
    }
    
    if (raceId) {
        const cleanRaceId = raceId === 'fexrick' ? 'fexric' : raceId.toLowerCase();
        return `/assets/images/races/${cleanRaceId}_illustration.png`;
    }
    return null;
};

const formatDescriptionText = (text) => {
    if (!text) return '';
    let formatted = text
        .replace(/\s*—\s*/g, ' - ')
        .replace(/\s*--\s*/g, ' - ')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />');
        
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};const Step9CharacterSummary = () => {
    const state = useCharacterWizardState();
    const { characterData } = state;
    const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
    const [spellTooltip, setSpellTooltip] = useState({ show: false, spell: null, x: 0, y: 0 });
    const [isBagOpen, setIsBagOpen] = useState(false);
    const tooltipRef = useRef(null);

    // Helper function to format values (replace underscores with spaces, capitalize)
    const formatValue = (value) => {
        if (!value) return '';
        return value
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Get modifiers for stat breakdown
    const pathModifiers = {};
    const racialModifiers = characterData.race && characterData.subrace ? applyRacialModifiers({}, characterData.race, characterData.subrace) : {};
    const backgroundModifiers = characterData.background ? getBackgroundStatModifiers(characterData.background) : {};
    const statBreakdown = getStatBreakdown(characterData.baseStats, racialModifiers, backgroundModifiers, pathModifiers);

    // Helper functions for extended equipment preview
    const getFullItemObjects = (itemNames) => {
        if (!Array.isArray(itemNames)) return [];
        return itemNames.map(itemName => {
            // First try to find the item by its full original name
            let foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                item.name.toLowerCase() === itemName.toLowerCase()
            );

            if (foundItem) {
                return foundItem;
            }

            // If not found, try parsing quantity and finding base item
            const quantityMatch = itemName.match(/(.+?)\s*\((\d+)\s*(?:feet?|lbs?|gp|sp|cp|gold|silver|copper)?\)/i);
            if (quantityMatch) {
                const cleanName = quantityMatch[1].trim();
                foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                    item.name.toLowerCase() === cleanName.toLowerCase()
                );
                if (foundItem) {
                    return foundItem;
                }
            }

            // Try some common name variations (capitalization, spacing)
            const variations = [
                itemName,
                itemName.toLowerCase(),
                itemName.charAt(0).toUpperCase() + itemName.slice(1).toLowerCase(),
                itemName.replace(/\b\w/g, l => l.toUpperCase()) // Title case
            ];

            for (const variation of variations) {
                foundItem = STARTING_EQUIPMENT_LIBRARY.find(item =>
                    item.name === variation
                );
                if (foundItem) {
                    return foundItem;
                }
            }

            return null;
        }).filter(item => item); // Remove undefined items
    };

    // Equipment hover handlers (same as equipment selection)
    const handleItemMouseEnter = (e, item) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const tooltipWidth = 280;
        const tooltipHeight = 250;
        const margin = 15;

        // Preferred position: right of item, aligned to top
        let x = rect.right + margin;
        let y = rect.top;

        const fitsRight = (x + tooltipWidth) <= viewportWidth;
        const fitsBelow = (y + tooltipHeight) <= viewportHeight;

        if (!fitsRight) {
            x = rect.left - tooltipWidth - margin;
            if (x < margin) {
                x = (viewportWidth - tooltipWidth) / 2;
            }
        }

        if (!fitsBelow) {
            y = rect.top - tooltipHeight - margin;
            if (y < margin) {
                y = Math.max(margin, viewportHeight - tooltipHeight - margin);
            }
        }

        x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
        y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

        setTooltip({
            show: true,
            item: item,
            x: x,
            y: y
        });
    };

    const handleItemMouseMove = (e) => {
        if (tooltip.show) {
            const rect = e.currentTarget.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const tooltipWidth = 280;
            const tooltipHeight = 250;
            const margin = 15;

            let x = rect.right + margin;
            let y = rect.top;

            const fitsRight = (x + tooltipWidth) <= viewportWidth;
            const fitsBelow = (y + tooltipHeight) <= viewportHeight;

            if (!fitsRight) {
                x = rect.left - tooltipWidth - margin;
                if (x < margin) {
                    x = (viewportWidth - tooltipWidth) / 2;
                }
            }

            if (!fitsBelow) {
                y = rect.top - tooltipHeight - margin;
                if (y < margin) {
                    y = Math.max(margin, viewportHeight - tooltipHeight - margin);
                }
            }

            x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));
            y = Math.max(margin, Math.min(y, viewportHeight - tooltipHeight - margin));

            setTooltip(prev => ({
                ...prev,
                x: x,
                y: y
            }));
        }
    };

    const handleItemMouseLeave = () => {
        setTooltip({ show: false, item: null, x: 0, y: 0 });
    };

    // Spell hover handlers
    const handleSpellMouseEnter = (e, spell) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const tooltipWidth = 240;
        const tooltipHeight = 150;
        const margin = 15;

        let x = rect.right + margin;
        let y = rect.top;

        if (x + tooltipWidth > viewportWidth) {
            x = rect.left - tooltipWidth - margin;
        }
        if (y + tooltipHeight > viewportHeight) {
            y = Math.max(margin, viewportHeight - tooltipHeight - margin);
        }

        setSpellTooltip({
            show: true,
            spell: spell,
            x: x,
            y: y
        });
    };

    const handleSpellMouseLeave = () => {
        setSpellTooltip({ show: false, spell: null, x: 0, y: 0 });
    };

    // Get background and path data for display
    const backgroundData = characterData.background ? getBackgroundData(characterData.background) : null;
    const backgroundAbilities = characterData.background ? getBackgroundAbilities(characterData.background) : [];

    // Get race/subrace objects
    const selectedRace = characterData.race ? RACE_DATA[characterData.race] : null;
    const selectedSubrace = selectedRace && characterData.subrace ? Object.values(selectedRace.subraces).find(sr => sr.id === characterData.subrace) : null;

    // Build completion checklist
    const checklistItems = [
        { label: 'Character Name', done: !!(characterData.name && characterData.name.trim()) },
        { label: 'Race & Subrace', done: !!(characterData.race && characterData.subrace) },
        { label: 'Class', done: !!characterData.class },
        { label: 'Background', done: !!characterData.background },
        { label: 'Ability Scores', done: !!(characterData.baseStats && Object.values(characterData.baseStats).some(v => v > 0)) },
        { label: 'Equipment Chosen', done: !!(characterData.selectedEquipment && characterData.selectedEquipment.length > 0) },
    ];
    const allComplete = checklistItems.every(i => i.done);
    const missingCount = checklistItems.filter(i => !i.done).length;

    // Fetch starting spells chosen
    const chosenSpells = (characterData.class_spells?.known_spells || []).map(spellId => {
        const classSpells = ALL_CLASS_SPELLS[characterData.class] || [];
        return classSpells.find(s => s.id === spellId);
    }).filter(s => s);

    // Image style mapping for token image custom positioning
    const getImageStyle = () => {
        const transforms = characterData.imageTransformations || { scale: 1.2, rotation: 0, positionX: 0, positionY: 0 };
        const iconScale = characterData.iconScale || 1;
        const iconOffsetX = characterData.iconOffsetX || 0;
        const iconOffsetY = characterData.iconOffsetY || 0;
        return {
            transform: `scale(${transforms.scale * iconScale}) rotate(${transforms.rotation}deg) translate(${transforms.positionX + iconOffsetX}px, ${transforms.positionY + iconOffsetY}px)`
        };
    };

    // Dynamic backdrop styling for the whole summary step
    const summaryBgStyle = characterData.iconBackgroundImage
        ? {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.18)), url(/assets/Backgrounds/${encodeURIComponent(characterData.iconBackgroundImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
        : {};

    // Combine purchased and background equipment
    const allEquipment = [];
    if (characterData.selectedEquipment) {
        characterData.selectedEquipment.forEach(item => {
            const isBackgroundItem = backgroundData?.equipment &&
                backgroundData.equipment.some(bgItem =>
                    bgItem.toLowerCase().includes(item.name.toLowerCase()) ||
                    item.name.toLowerCase().includes(bgItem.toLowerCase().replace(/\s*\([^)]*\)/, ''))
                );

            const fullItem = getFullItemObjects([item.name])[0];
            if (fullItem) {
                allEquipment.push({
                    ...fullItem,
                    quantity: item.quantity || 1,
                    source: isBackgroundItem ? 'background' : 'purchased'
                });
            }
        });
    }

    // Dynamic resistances, immunities parsing from subrace traits
    const getRacialTraitsSummary = () => {
        const raceData = characterData.race && characterData.subrace ? getFullRaceData(characterData.race, characterData.subrace) : null;
        if (!raceData) return { resistances: [], immunities: [], vulnerabilities: [], other: [] };

        const traits = raceData.combinedTraits.traits || [];
        const resistances = [];
        const immunities = [];
        const vulnerabilities = [];
        const other = [];

        traits.forEach(trait => {
            const name = trait.name;
            const desc = trait.description || '';
            const tags = trait.typeConfig?.tags || [];

            const textToSearch = `${name} ${desc} ${tags.join(' ')}`.toLowerCase();

            if (textToSearch.includes('resistance') || textToSearch.includes('resistant')) {
                let type = 'General';
                if (textToSearch.includes('cold')) type = 'Cold';
                else if (textToSearch.includes('poison')) type = 'Poison';
                else if (textToSearch.includes('fire')) type = 'Fire';
                else if (textToSearch.includes('psychic')) type = 'Psychic';
                else if (textToSearch.includes('magic')) type = 'Magic';
                else if (textToSearch.includes('charm')) type = 'Charm';
                else if (textToSearch.includes('possession') || textToSearch.includes('domination')) type = 'Control';
                
                resistances.push({ name, type, desc });
            } else if (textToSearch.includes('immune') || textToSearch.includes('immunity')) {
                let type = 'General';
                if (textToSearch.includes('poison')) type = 'Poison';
                else if (textToSearch.includes('fear')) type = 'Fear';
                else if (textToSearch.includes('ash')) type = 'Ashfall';
                
                immunities.push({ name, type, desc });
            } else if (textToSearch.includes('vulnerab')) {
                let type = 'General';
                if (textToSearch.includes('cold')) type = 'Cold';
                else if (textToSearch.includes('heat') || textToSearch.includes('fire')) type = 'Heat/Fire';
                
                vulnerabilities.push({ name, type, desc });
            } else {
                other.push({ name, desc });
            }
        });

        return { resistances, immunities, vulnerabilities, other };
    };

    const racialTraits = getRacialTraitsSummary();
    const hasSpecialAttributes = racialTraits.resistances.length > 0 || racialTraits.immunities.length > 0 || racialTraits.vulnerabilities.length > 0;

    return (
        <div className="wizard-step-content summary-step-wrapper scroll-themed" style={summaryBgStyle}>
            <div className="character-summary-content-inner">
            
            {/* Floating Checklist Status Badge */}
            <div className="completion-badge-container">
                <div className={`completion-status-badge ${allComplete ? 'all-complete' : 'has-missing'}`}>
                    <i className={`fas ${allComplete ? 'fa-check' : 'fa-exclamation'}`}></i>
                </div>
                <div className="checklist-hover-panel">
                    <div className="hover-panel-title">
                        <i className="fas fa-clipboard-list"></i> Completion Status
                    </div>
                    <div className="hover-checklist-grid">
                        {checklistItems.map((item) => (
                            <div key={item.label} className={`hover-check-item ${item.done ? 'complete' : 'incomplete'}`}>
                                <span>{item.label}</span>
                                <span className="hover-check-status-text">
                                    {item.done ? '✓' : '✗'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className={`hover-ready-banner ${allComplete ? 'all-complete' : 'has-missing'}`}>
                        <i className={`fas ${allComplete ? 'fa-dragon' : 'fa-exclamation-circle'}`}></i>
                        {allComplete
                            ? 'Your hero is ready! Click "Create Character" to begin.'
                            : `${missingCount} item${missingCount > 1 ? 's' : ''} still needed.`}
                    </div>
                </div>
            </div>

            {/* Main 3-Column Dashboard Grid */}
            <div className="character-summary-dashboard">
                
                {/* Column 1: Character Visual Presentation Card */}
                <div className="dashboard-column scroll-themed">
                    <div className="summary-visual-card">
                        
                        {/* Immersive card header with character background scene */}
                        <div 
                            className="character-card-visual-backdrop"
                            style={{
                                backgroundImage: characterData.iconBackgroundImage 
                                    ? `linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.35)), url(/assets/Backgrounds/${encodeURIComponent(characterData.iconBackgroundImage)})`
                                    : 'none',
                                backgroundColor: characterData.iconBackgroundColor || '#f8f5eb',
                                backgroundSize: characterData.iconBackgroundImage ? `${(characterData.iconBackgroundScale || 2.5) * 100}%` : 'cover',
                                backgroundPosition: characterData.iconBackgroundImage ? `calc(50% + ${characterData.iconBackgroundOffsetX || 0}px) calc(50% + ${characterData.iconBackgroundOffsetY || 0}px)` : 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            {/* portrait avatar token */}
                            <div 
                                className="visual-card-token"
                                style={{
                                    backgroundColor: characterData.iconBackgroundColor,
                                    borderColor: characterData.iconBorderColor || '#d4af37'
                                }}
                            >
                                {characterData.characterImage ? (
                                    <div className="visual-card-token-inner">
                                        <img 
                                            src={characterData.characterImage} 
                                            alt="Avatar" 
                                            style={getImageStyle()} 
                                        />
                                    </div>
                                ) : characterData.characterIcon ? (
                                    <div className="visual-card-token-inner">
                                        <img 
                                            src={getCustomIconUrl(characterData.characterIcon, 'creatures')} 
                                            alt="Icon" 
                                            style={{
                                                transform: `scale(${characterData.iconScale || 1}) translate(${characterData.iconOffsetX || 0}px, ${characterData.iconOffsetY || 0}px)`,
                                                borderRadius: '50%'
                                            }}
                                            onError={(e) => { e.target.onerror = null; e.target.src = getCustomIconUrl('Human/Icon1', 'creatures'); }}
                                        />
                                    </div>
                                ) : (
                                    <div className="avatar-placeholder-silhouette">
                                        <i className="fas fa-user"></i>
                                    </div>
                                )}

                                {/* Class Badge Overlay */}
                                {characterData.class && (
                                    <div className="visual-card-class-badge-overlay" title={`Calling: ${characterData.class}`}>
                                        <ClassIcon 
                                            src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`} 
                                            alt={characterData.class} 
                                            size="small" 
                                            className="visual-class-badge-icon" 
                                            dataClass={characterData.class}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Basic Identity Details */}
                            <div className="visual-card-identity">
                                <h2 className="visual-card-name">{characterData.name || 'Unnamed Hero'}</h2>
                                <div className="visual-card-meta-tags">
                                    <span className="meta-tag gender-tag">{formatValue(characterData.gender)}</span>
                                    <span className="meta-tag race-tag">{selectedSubrace?.name || characterData.race || 'No Race'}</span>
                                    <span className="meta-tag class-tag">{characterData.class || 'No Class'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Framed Subrace Illustration */}
                        {(selectedSubrace || selectedRace) && (
                            <div className="visual-card-subrace-frame" style={{ marginTop: '0.75rem' }}>
                                <h4 className="visual-card-section-title">
                                    <i className="fas fa-users"></i> Heritage Details
                                </h4>
                                <div className="subrace-artwork-wrapper">
                                    <img 
                                        src={getSubraceImage(characterData.subrace, characterData.race)}
                                        alt={selectedSubrace?.name || selectedRace?.name}
                                        className="subrace-illustration"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/assets/images/races/human_illustration.png';
                                        }}
                                    />
                                </div>
                                <div className="subrace-flavor-text-block">
                                    <h5 className="subrace-flavor-title">{selectedSubrace?.name || selectedRace?.name}</h5>
                                    <p className="subrace-flavor-desc">
                                        {formatDescriptionText(selectedSubrace?.description || selectedRace?.description)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Framed Class Icon and Theme */}
                        {characterData.class && (
                            <div className="visual-card-class-frame" style={{ marginTop: '0.75rem' }}>
                                <h4 className="visual-card-section-title">
                                    <i className="fas fa-shield-alt"></i> Calling Selection
                                </h4>
                                <div className="visual-class-info-block">
                                    <div className="visual-class-icon-container">
                                        <ClassIcon 
                                            src={CLASS_DATA_MAP[characterData.class]?.imageIcon || `/assets/icons/classes/${characterData.class.toLowerCase().replace(' ', '_')}.png`} 
                                            alt={characterData.class} 
                                            size="large" 
                                            className="visual-class-pixel-icon" 
                                            dataClass={characterData.class}
                                        />
                                    </div>
                                    <div className="visual-class-details">
                                        <h5 className="visual-class-name">{characterData.class}</h5>
                                        <span className="visual-class-theme">Theme: {CLASS_DATA_MAP[characterData.class]?.overview?.theme || 'Specialist'}</span>
                                        <p className="visual-class-role" style={{ margin: 0 }}>Role: {CLASS_DATA_MAP[characterData.class]?.role || 'Versatile'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Stats Sheet, Attributes, and Resistances */}
                <div className="dashboard-column scroll-themed">
                    
                    {/* Basic Information Section */}
                    <div className="summary-dashboard-section">
                        <h3 className="section-title">
                            <i className="fas fa-user-shield"></i> Basic Info
                        </h3>
                        <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                            <div className="detail-item">
                                <span className="detail-label">Calling:</span>
                                <span className="detail-value">{formatValue(characterData.class) || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Background:</span>
                                <span className="detail-value">{backgroundData?.name || formatValue(characterData.background) || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Base Stats Section */}
                    <div className="summary-dashboard-section">
                        <h3 className="section-title">
                            <i className="fas fa-heartbeat"></i> Base Stats
                        </h3>
                        {(() => {
                            const { getRacialBaseStats } = require('../../../data/raceData');
                            const baseStats = getRacialBaseStats(characterData.race, characterData.subrace);

                            const finalConstitution = statBreakdown.constitution.final;
                            const finalIntelligence = statBreakdown.intelligence.final;

                            const baseHP = (finalConstitution * 5) + (baseStats.hp || 0);
                            const baseMana = (finalIntelligence * 5) + (baseStats.mana || 0);

                            return (
                                <div className="base-stats-compact-grid">
                                    <div className="base-stat-compact-item" title="Hit Points (Con * 5 + Race Base)">
                                        <div className="base-stat-compact-icon"><i className="fas fa-heart"></i></div>
                                        <div className="base-stat-compact-details">
                                            <span className="base-stat-compact-label">Health</span>
                                            <span className="base-stat-compact-val">{baseHP} HP</span>
                                        </div>
                                    </div>
                                    <div className="base-stat-compact-item" title="Mana (Int * 5 + Race Base)">
                                        <div className="base-stat-compact-icon" style={{ color: '#2563eb', background: 'rgba(37, 99, 235, 0.1)' }}><i className="fas fa-magic"></i></div>
                                        <div className="base-stat-compact-details">
                                            <span className="base-stat-compact-label">Mana</span>
                                            <span className="base-stat-compact-val">{baseMana} MP</span>
                                        </div>
                                    </div>
                                    <div className="base-stat-compact-item" title="Racial Base Speed">
                                        <div className="base-stat-compact-icon" style={{ color: '#27ae60', background: 'rgba(39, 174, 96, 0.1)' }}><i className="fas fa-running"></i></div>
                                        <div className="base-stat-compact-details">
                                            <span className="base-stat-compact-label">Speed</span>
                                            <span className="base-stat-compact-val">{baseStats.speed} FT</span>
                                        </div>
                                    </div>
                                    <div className="base-stat-compact-item" title="Action Points per Turn">
                                        <div className="base-stat-compact-icon" style={{ color: '#f39c12', background: 'rgba(243, 156, 18, 0.1)' }}><i className="fas fa-bolt"></i></div>
                                        <div className="base-stat-compact-details">
                                            <span className="base-stat-compact-label">Action Pts</span>
                                            <span className="base-stat-compact-val">{baseStats.ap} AP</span>
                                        </div>
                                    </div>
                                    {baseStats.armor !== undefined && baseStats.armor !== 0 && (
                                        <div className="base-stat-compact-item" title="Racial Defense Armor">
                                            <div className="base-stat-compact-icon" style={{ color: '#7f8c8d', background: 'rgba(127, 140, 141, 0.1)' }}><i className="fas fa-shield-alt"></i></div>
                                            <div className="base-stat-compact-details">
                                                <span className="base-stat-compact-label">Armor</span>
                                                <span className="base-stat-compact-val">+{baseStats.armor}</span>
                                            </div>
                                        </div>
                                    )}
                                    {baseStats.darkvision !== undefined && baseStats.darkvision !== 0 && (
                                        <div className="base-stat-compact-item" title="Distance visible in dark environments">
                                            <div className="base-stat-compact-icon" style={{ color: '#9d4edd', background: 'rgba(157, 78, 221, 0.1)' }}><i className="fas fa-eye"></i></div>
                                            <div className="base-stat-compact-details">
                                                <span className="base-stat-compact-label">Darkvision</span>
                                                <span className="base-stat-compact-val">{baseStats.darkvision} FT</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Ability Scores Section */}
                    <div className="summary-dashboard-section">
                        <h3 className="section-title">
                            <i className="fas fa-sliders"></i> Ability Scores
                        </h3>
                        <div className="abilities-compact-grid">
                            {ABILITY_SCORES.map((ability) => {
                                const breakdown = statBreakdown[ability.id];
                                return (
                                    <div key={ability.id} className="ability-compact-box" title={`${ability.name} Breakdown: Base ${breakdown.base} + Racial ${breakdown.racial >= 0 ? '+' : ''}${breakdown.racial} + Background ${breakdown.background >= 0 ? '+' : ''}${breakdown.background}`}>
                                        <i className={`ability-compact-icon ${ability.icon}`}></i>
                                        <span className="ability-compact-name">{ability.name.substring(0, 3)}</span>
                                        <div className="ability-compact-vals">
                                            <span className="ability-compact-score">{breakdown.final}</span>
                                            <span className="ability-compact-mod">({breakdown.modifier >= 0 ? '+' : ''}{breakdown.modifier})</span>
                                        </div>
                                        <span className="ability-compact-breakdown">
                                            Base: {breakdown.base} ({(breakdown.racial + breakdown.background) >= 0 ? '+' : ''}{breakdown.racial + breakdown.background} Mod)
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Column 3: Grimoire, Safeguards, Languages, Background benefits & Clickable Backpack */}
                <div className="dashboard-column scroll-themed">

                    {/* Immunities, Resistances, and Vulnerabilities */}
                    <div className="summary-dashboard-section">
                        <h3 className="section-title">
                            <i className="fas fa-shield-virus"></i> Safeguards & Traits
                        </h3>
                        <div className="resistances-grid">
                            {racialTraits.immunities.map((imm, idx) => (
                                <div key={`imm-${idx}`} className="resistance-shield-badge immunity" title={imm.desc}>
                                    <i className="fas fa-award"></i> Immune: {imm.type}
                                </div>
                            ))}
                            {racialTraits.resistances.map((res, idx) => (
                                <div key={`res-${idx}`} className="resistance-shield-badge resistance" title={res.desc}>
                                    <i className="fas fa-shield"></i> Resist: {res.type}
                                </div>
                            ))}
                            {racialTraits.vulnerabilities.map((vul, idx) => (
                                <div key={`vul-${idx}`} className="resistance-shield-badge vulnerability" title={vul.desc}>
                                    <i className="fas fa-heart-broken"></i> Weak: {vul.type}
                                </div>
                            ))}
                            {!hasSpecialAttributes && (
                                <span className="no-resistances-msg">
                                    <i className="fas fa-circle-info"></i> No special elemental resistances or immunities.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Languages Section */}
                    <div className="summary-dashboard-section">
                        <h3 className="section-title">
                            <i className="fas fa-language"></i> Known Languages
                        </h3>
                        <div className="languages-compact-list">
                            {(characterData.selectedLanguages || []).map((langName) => (
                                <div key={langName} className="language-compact-badge">
                                    <i className="fas fa-globe"></i> {langName}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Starting Spells Grid */}
                    {characterData.class && chosenSpells.length > 0 && (
                        <div className="summary-dashboard-section">
                            <h3 className="section-title">
                                <i className="fas fa-book-sparkles"></i> Grimoire
                            </h3>
                            <div className="summary-spell-grid">
                                {chosenSpells.map((spell, index) => (
                                    <div 
                                        key={spell.id || index} 
                                        className="summary-spell-grid-cell"
                                        onMouseEnter={(e) => handleSpellMouseEnter(e, spell)}
                                        onMouseLeave={handleSpellMouseLeave}
                                    >
                                        <img 
                                            src={getSpellIconUrl(spell.icon)} 
                                            alt={spell.name}
                                            className="summary-spell-grid-icon"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Background Benefits Summary */}
                    {backgroundData && (
                        <div className="summary-dashboard-section">
                            <h3 className="section-title">
                                <i className="fas fa-scroll"></i> Background Perks
                            </h3>
                            <div className="background-benefits-compact" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <div className="benefit-group-compact">
                                    <h5 style={{ margin: '0 0 0.25rem 0', fontFamily: 'Cinzel', fontSize: '0.75rem', color: '#7a5a35' }}>Skill Proficiencies</h5>
                                    <div className="skill-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                        {backgroundData.skillProficiencies.map((skill, index) => (
                                            <span key={index} className="skill-tag" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', background: 'rgba(153, 126, 85, 0.08)', border: '1px solid rgba(153, 126, 85, 0.15)', borderRadius: '4px', color: '#5d4037' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="benefit-group-compact">
                                    <h5 style={{ margin: '0 0 0.25rem 0', fontFamily: 'Cinzel', fontSize: '0.75rem', color: '#7a5a35' }}>Special Feature</h5>
                                    <div className="feature-display-compact" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(153, 126, 85, 0.15)', borderRadius: '6px', padding: '0.45rem' }}>
                                        <h6 style={{ margin: '0 0 0.15rem 0', fontFamily: 'Cinzel', fontSize: '0.74rem', color: '#2e1e0f' }}>{backgroundData.feature.name}</h6>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(46, 30, 15, 0.85)', lineHeight: '1.3' }}>{backgroundData.feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Backpack Clicker Card */}
                    {((characterData.selectedEquipment && characterData.selectedEquipment.length > 0) ||
                        (backgroundData?.equipment && backgroundData.equipment.length > 0)) && (
                            <div className="backpack-clicker-card" onClick={() => setIsBagOpen(true)}>
                                <div className="backpack-clicker-icon-container">
                                    <img 
                                        src={getIconUrl('Container/Bag/adventurer-backpack-gear', 'items')} 
                                        alt="Backpack" 
                                        className="backpack-clicker-icon-img"
                                    />
                                </div>
                                <div className="backpack-clicker-details">
                                    <h4 className="backpack-clicker-title">Adventurer Backpack</h4>
                                    <span className="backpack-clicker-subtitle">{allEquipment.length} items inside</span>
                                    <span className="backpack-clicker-hint">
                                        <i className="fas fa-hand-pointer"></i> Click to open your pack
                                    </span>
                                </div>
                            </div>
                    )}
                </div>

            </div>

            {/* Backpack Inventory Popup Window Overlay */}
            {isBagOpen && (
                <div className="backpack-modal-overlay" onClick={() => setIsBagOpen(false)}>
                    <div className="bag-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="bag-popup-header">
                            <div className="bag-popup-title-row">
                                <img 
                                    src={getIconUrl('Container/Bag/adventurer-backpack-gear', 'items')} 
                                    alt="Bag" 
                                    className="bag-popup-title-icon" 
                                />
                                <span className="bag-popup-title">Adventurer Backpack</span>
                            </div>
                            <button className="bag-popup-close-btn" onClick={() => setIsBagOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Tile-based inventory grid matching in-game inventory style */}
                        {(() => {
                            const COLS = 8;
                            const CELL_SIZE = 48;
                            const GAP = 2;
                            const cells = [];
                            const occupiedCells = new Map();

                            let currentRow = 0;
                            let currentCol = 0;

                            allEquipment.forEach((item, itemIndex) => {
                                const itemWidth = item.width || 1;
                                const itemHeight = item.height || 1;

                                let placed = false;
                                while (!placed) {
                                    let fits = true;
                                    for (let r = 0; r < itemHeight; r++) {
                                        for (let c = 0; c < itemWidth; c++) {
                                            const checkRow = currentRow + r;
                                            const checkCol = currentCol + c;
                                            if (checkCol >= COLS || occupiedCells.has(`${checkRow},${checkCol}`)) {
                                                fits = false;
                                                break;
                                            }
                                        }
                                        if (!fits) break;
                                    }

                                    if (fits) {
                                        for (let r = 0; r < itemHeight; r++) {
                                            for (let c = 0; c < itemWidth; c++) {
                                                occupiedCells.set(`${currentRow + r},${currentCol + c}`, {
                                                    item,
                                                    isOrigin: r === 0 && c === 0,
                                                    itemIndex
                                                });
                                            }
                                        }
                                        placed = true;
                                    }

                                    currentCol++;
                                    if (currentCol >= COLS) {
                                        currentCol = 0;
                                        currentRow++;
                                    }
                                }
                            });

                            const maxRow = occupiedCells.size > 0
                                ? Math.max(...Array.from(occupiedCells.keys()).map(k => parseInt(k.split(',')[0])))
                                : -1;
                            const totalRows = Math.max(maxRow + 1, 4);

                            for (let row = 0; row < totalRows; row++) {
                                for (let col = 0; col < COLS; col++) {
                                    const cellData = occupiedCells.get(`${row},${col}`);
                                    const cellItem = cellData?.item;
                                    const isOrigin = cellData?.isOrigin;
                                    const itemWidth = cellItem?.width || 1;
                                    const itemHeight = cellItem?.height || 1;

                                    cells.push(
                                        <div
                                            key={`${row}-${col}`}
                                            className={`bag-inv-cell ${cellItem ? 'occupied' : 'empty'}`}
                                        >
                                            {cellItem && isOrigin && (
                                                <div
                                                    className="bag-inv-item-wrapper"
                                                    style={{
                                                        width: `${itemWidth * CELL_SIZE + (itemWidth - 1) * GAP}px`,
                                                        height: `${itemHeight * CELL_SIZE + (itemHeight - 1) * GAP}px`
                                                    }}
                                                    onMouseEnter={(e) => handleItemMouseEnter(e, cellItem)}
                                                    onMouseMove={handleItemMouseMove}
                                                    onMouseLeave={handleItemMouseLeave}
                                                >
                                                    <div
                                                        className="bag-inv-item-icon"
                                                        style={{ backgroundImage: `url(${getIconUrl(cellItem.iconId, 'items')})` }}
                                                    />
                                                    {cellItem.quantity > 1 && (
                                                        <span className="bag-inv-item-qty">{cellItem.quantity}</span>
                                                    )}
                                                    {cellItem.source === 'background' && (
                                                        <span className="bag-inv-item-source" title="From Background">
                                                            <i className="fas fa-star"></i>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            }
                            return (
                                <div
                                    className="bag-inv-grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
                                        gridAutoRows: `${CELL_SIZE}px`,
                                        gap: `${GAP}px`
                                    }}
                                >
                                    {cells}
                                </div>
                            );
                        })()}

                        {/* Footer: remaining currency */}
                        <div className="bag-popup-footer">
                            <span className="bag-popup-stats-txt">{allEquipment.length} items</span>
                            <div className="bag-coins-row">
                                {characterData.remainingCurrency && (
                                    <>
                                        {characterData.remainingCurrency.platinum > 0 && (
                                            <div className="bag-coin-counter" title="Platinum">
                                                <span>{characterData.remainingCurrency.platinum}</span>
                                                <span className="bag-coin-dot platinum"></span>
                                            </div>
                                        )}
                                        {characterData.remainingCurrency.gold > 0 && (
                                            <div className="bag-coin-counter" title="Gold">
                                                <span>{characterData.remainingCurrency.gold}</span>
                                                <span className="bag-coin-dot gold"></span>
                                            </div>
                                        )}
                                        {characterData.remainingCurrency.silver > 0 && (
                                            <div className="bag-coin-counter" title="Silver">
                                                <span>{characterData.remainingCurrency.silver}</span>
                                                <span className="bag-coin-dot silver"></span>
                                            </div>
                                        )}
                                        {characterData.remainingCurrency.copper > 0 && (
                                            <div className="bag-coin-counter" title="Copper">
                                                <span>{characterData.remainingCurrency.copper}</span>
                                                <span className="bag-coin-dot copper"></span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Item Tooltip Overlay */}
            {tooltip.show && tooltip.item && (
                <div
                    ref={tooltipRef}
                    className="item-tooltip-overlay"
                    style={{
                        position: 'fixed',
                        left: tooltip.x,
                        top: tooltip.y,
                        zIndex: 10000,
                        pointerEvents: 'none'
                    }}
                >
                    <ItemTooltip item={tooltip.item} />
                </div>
            )}

            {/* Spell Tooltip Overlay */}
            {spellTooltip.show && spellTooltip.spell && (
                <div
                    className="item-tooltip-overlay"
                    style={{
                        position: 'fixed',
                        left: spellTooltip.x,
                        top: spellTooltip.y,
                        zIndex: 10000,
                        pointerEvents: 'none',
                        background: '#1c120c',
                        border: '2px solid #997e55',
                        borderRadius: '6px',
                        padding: '0.6rem 0.8rem',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
                        width: '240px'
                    }}
                >
                    <div className="summary-spell-tooltip-content">
                        <div className="summary-spell-tooltip-header">
                            <span style={{ color: '#f3e5ab', fontWeight: 700 }}>{spellTooltip.spell.name}</span>
                            <span style={{ fontSize: '0.68rem', color: '#8b7355', textTransform: 'uppercase' }}>{spellTooltip.spell.spellType}</span>
                        </div>
                        <div className="summary-spell-tooltip-cost" style={{ display: 'flex', gap: '0.6rem', margin: '0.2rem 0', fontSize: '0.7rem', color: '#5dade2', fontWeight: 700 }}>
                            {spellTooltip.spell.resourceCost?.mana > 0 && (
                                <span><i className="fas fa-magic"></i> {spellTooltip.spell.resourceCost.mana} Mana</span>
                            )}
                            {spellTooltip.spell.resourceCost?.actionPoints > 0 && (
                                <span><i className="fas fa-bolt"></i> {spellTooltip.spell.resourceCost.actionPoints} AP</span>
                            )}
                        </div>
                        <div className="summary-spell-tooltip-desc" style={{ fontSize: '0.72rem', color: '#fff', lineHeight: 1.35, borderTop: '1px solid rgba(153, 126, 85, 0.25)', paddingTop: '0.3rem', marginTop: '0.2rem' }}>
                            {spellTooltip.spell.description}
                        </div>
                    </div>
                </div>
            )}

            </div>
        </div>
    );
};

export default Step9CharacterSummary;
