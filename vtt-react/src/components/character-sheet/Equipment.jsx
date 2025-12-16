import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import StatTooltip from '../tooltips/StatTooltip';
import ResistanceTooltip from '../tooltips/ResistanceTooltip';
import GeneralStatTooltip from '../tooltips/GeneralStatTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import ItemTooltip from '../item-generation/ItemTooltip';
import UnequipContextMenu from '../equipment/UnequipContextMenu';
import ClassResourceBar from '../hud/ClassResourceBar';
import CharacterStats from './CharacterStats';
import { createInventoryItem, isOffHandDisabled } from '../../utils/equipmentUtils';
import { calculateDerivedStats } from '../../utils/characterUtils';
import { getClassResourceConfig, getResourceDisplayText } from '../../data/classResources';
import { getRaceList, getSubraceList, getRaceData } from '../../data/raceData';
import { ENHANCED_PATHS, getAllEnhancedPaths } from '../../data/enhancedPathData';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { selectRandomSpells, filterNewSpells, getRacialSpells, getRacialStatModifiers, addSpellsToLibrary, removeSpellsByCategory } from '../../utils/raceDisciplineSpellUtils';
import '../../styles/character-sheet.css';
import '../../styles/resistance-styles.css';
import '../../styles/racial-traits.css';

import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';

// Derive concise passive summaries: 1 line flavor text, then game mechanics
const getPassiveSummary = (passive = {}) => {
    const parts = [];
    
    // Extract first sentence of description as flavor text
    if (passive.description) {
        const firstSentence = passive.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    // Extract condition from triggerConfig if present
    let conditionText = '';
    if (passive.triggerConfig?.global?.compoundTriggers) {
        const healthTrigger = passive.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
        if (healthTrigger?.parameters) {
            const percentage = healthTrigger.parameters.percentage;
            const comparison = healthTrigger.parameters.comparison;
            if (percentage && comparison) {
                if (comparison === 'less_than' || comparison === 'below') {
                    conditionText = `when below ${percentage}% HP`;
                } else if (comparison === 'greater_than' || comparison === 'above') {
                    conditionText = `when above ${percentage}% HP`;
                }
            }
        }
    }

    const formatStatMod = (mod = {}) => {
        const stat = (mod.stat || 'stat').replace(/_/g, ' ');
        const mag = mod.magnitudeType === 'percentage'
            ? `${mod.magnitude}%`
            : `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        return `${stat} ${mag}`;
    };

    // Group stat modifiers together
    const statMods = [];
    const otherEffects = [];

    // Process buff effects
    if (passive.buffConfig?.effects) {
        passive.buffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Process debuff effects
    if (passive.debuffConfig?.effects) {
        passive.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Add healing config
    if (passive.healingConfig) {
        const { formula = 'healing', hotTickInterval, hotDuration, durationType } = passive.healingConfig;
        const intervalText = hotTickInterval
            ? ` every ${hotTickInterval} round${hotTickInterval > 1 ? 's' : ''}`
            : '';
        const durationText = hotDuration
            ? ` while ${hotDuration}`
            : durationType === 'permanent'
                ? ' continuously'
                : '';
        parts.push(`Regenerates ${formula}${intervalText}${durationText}`.trim() + '.');
    }

    // Add stat modifiers (grouped together)
    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    // Add other effects
    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};



const ResourceBar = ({ current, max, className, label, resourceType, onUpdate, tooltipPosition, setTooltipPosition }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [controlsPosition, setControlsPosition] = useState({ x: 0, y: 0 });
    const percentage = (current / max) * 100;

    const handleMouseEnter = (e) => {
        setIsHovered(true);
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleBarClick = (e) => {
        if (!showControls) {
            // Calculate position for the controls popup
            const rect = e.currentTarget.getBoundingClientRect();
            const x = rect.left;
            const y = rect.bottom + 8; // Position below the bar with some spacing

            // Ensure the popup stays within viewport
            const popupWidth = 200; // Approximate width of controls
            const popupHeight = 100; // Approximate height of controls

            const adjustedX = Math.min(x, window.innerWidth - popupWidth - 20);
            const adjustedY = Math.min(y, window.innerHeight - popupHeight - 20);

            setControlsPosition({ x: adjustedX, y: adjustedY });
        }
        setShowControls(!showControls);
    };

    const handleAdjustment = (amount) => {
        const newValue = Math.max(0, Math.min(max, current + amount));
        onUpdate(resourceType, newValue, max);
    };

    const handleInputSubmit = () => {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            const newValue = Math.max(0, Math.min(max, value));
            onUpdate(resourceType, newValue, max);
        }
        setInputValue('');
        setShowControls(false);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleInputSubmit();
        } else if (e.key === 'Escape') {
            setInputValue('');
            setShowControls(false);
        }
    };

    const getTooltipContent = () => {
        switch(resourceType) {
            case 'health':
                return {
                    title: 'Health Points',
                    description: 'Your life force. When reduced to 0, you fall unconscious and must make death saving throws. Click to adjust.'
                };
            case 'mana':
                return {
                    title: 'Mana Points',
                    description: 'Your magical energy used to cast spells and activate magical abilities. Click to adjust.'
                };
            case 'actionPoints':
                return {
                    title: 'Action Points',
                    description: 'Points used to perform actions in combat. Refreshes at the start of your turn. Click to adjust.'
                };
            default:
                return null;
        }
    };

    const tooltipContent = getTooltipContent();

    return (
        <div className="resource-bar-container">
            <div className="resource-bar-header">
                <span className="resource-bar-label">{label}</span>
                <span className="resource-bar-values">{current} / {max}</span>
            </div>

            <div
                className="resource-bar-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleBarClick}
            >
                <div className={`resource-bar-track ${className}`}>
                    <div className="resource-bar-fill" style={{ width: `${percentage}%` }} />
                </div>
            </div>

            {showControls && ReactDOM.createPortal(
                <div
                    className="resource-controls"
                    style={{
                        left: controlsPosition.x,
                        top: controlsPosition.y,
                        pointerEvents: 'auto'
                    }}
                >
                        <div className="resource-controls-header">
                            <span className="resource-controls-title">Adjust {label}</span>
                            <button
                                className="resource-controls-close"
                                onClick={() => setShowControls(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="resource-adjustment-buttons">
                            <button onClick={() => handleAdjustment(-10)} className="adjust-btn">-10</button>
                            <button onClick={() => handleAdjustment(-5)} className="adjust-btn">-5</button>
                            <button onClick={() => handleAdjustment(-1)} className="adjust-btn">-1</button>
                            <button onClick={() => handleAdjustment(1)} className="adjust-btn">+1</button>
                            <button onClick={() => handleAdjustment(5)} className="adjust-btn">+5</button>
                            <button onClick={() => handleAdjustment(10)} className="adjust-btn">+10</button>
                        </div>
                        <div className="resource-input-section">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleInputKeyPress}
                                placeholder={`Set to...`}
                                className="resource-input"
                                min="0"
                                max={max}
                            />
                            <button onClick={handleInputSubmit} className="set-btn">Set</button>
                        </div>
                    </div>,
                document.body
            )}

            {isHovered && tooltipContent && (
                <TooltipPortal>
                    <div
                        className="equipment-slot-tooltip"
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            transform: 'translate(10px, -50%)',
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        <div className="equipment-slot-name">
                            {tooltipContent.title}
                        </div>
                        <div className="equipment-slot-description">
                            {tooltipContent.description}
                        </div>
                    </div>
                </TooltipPortal>
            )}
        </div>
    );
};

export default function CharacterPanel() {
    // Use inspection context if available, otherwise use regular character store
    const inspectionData = useInspectionCharacter();
    const characterStore = useCharacterStore();

    // Choose data source based on whether we're in inspection mode
    const dataSource = inspectionData || characterStore;

    const {
        equipment,
        stats,
        equipmentBonuses,
        derivedStats,
        health,
        mana,
        actionPoints,
        classResource,
        name,
        baseName,
        race,
        subrace,
        pathPassives = [],
        class: characterClass,
        path,
        pathDisplayName,
        level,
        alignment,
        exhaustionLevel,
        updateEquipment,
        updateCharacterInfo,
        updateBaseName,
        updateResource,
        unequipItem,
        immunities = [], // Default to empty array if not provided
        lore = {} // Get lore data for character image
    } = dataSource;

    // Get spell library dispatch and state for adding spells
    const libraryDispatch = useSpellLibraryDispatch();
    const spellLibrary = useSpellLibrary();

    // State for navigation
    const [activeSection, setActiveSection] = useState('character');
    const [showLabels, setShowLabels] = useState(false); // Start with icons only

    // Define sections for navigation
    const sections = {
        character: {
            title: 'Character Info',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg'
        },
        equipment: {
            title: 'Equipment',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate06.jpg'
        },
        resources: {
            title: 'Resources',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg'
        },
        passives: {
            title: 'Passives',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_devotion.jpg'
        }
    };

    // Inventory store for adding unequipped items back to inventory
    const { addItem } = useInventoryStore(state => ({
        addItem: state.addItem
    }));

    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipDelay, setTooltipDelay] = useState(null);
    const [unequipContextMenu, setUnequipContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, slotName: null });
    const [lastRaceSubracePath, setLastRaceSubracePath] = useState({ race: '', subrace: '', path: '' });
    const [lastCharacterId, setLastCharacterId] = useState(null);

    // Get current character ID from store
    const currentCharacterId = characterStore?.currentCharacterId || null;

    useEffect(() => {
        return () => {
            if (tooltipDelay) {
                clearTimeout(tooltipDelay);
            }
        };
    }, [tooltipDelay]);

    // Clean up all character-specific spells when character changes
    useEffect(() => {
        // Only run if we're not in inspection mode
        if (inspectionData) return;
        
        // Skip if character hasn't actually changed
        if (currentCharacterId === lastCharacterId) {
            return;
        }

        // If we had a previous character, clean up their spells
        if (lastCharacterId !== null) {
            console.log('🧹 [Equipment] Cleaning up spells for previous character:', lastCharacterId);
            // Remove all character-specific spell categories
            removeSpellsByCategory(libraryDispatch, 'Racial Abilities', spellLibrary.spells);
            removeSpellsByCategory(libraryDispatch, 'Discipline Abilities', spellLibrary.spells);
            removeSpellsByCategory(libraryDispatch, 'Discipline Passives', spellLibrary.spells);
            
            // Also remove any passives that might have been added as spell cards
            const oldPassives = spellLibrary.spells.filter(spell => 
                spell.spellType === 'PASSIVE' && 
                (spell.tags?.includes('discipline') || spell.typeConfig?.tags?.includes('discipline') ||
                 spell.categoryIds?.includes('Discipline Passives'))
            );
            oldPassives.forEach(spell => {
                if (spell && spell.id) {
                    libraryDispatch(libraryActionCreators.deleteSpell(spell.id));
                }
            });
        }

        // Update last character ID
        setLastCharacterId(currentCharacterId);
        
        // Reset race/subrace/path tracking so new character's spells will be added
        // This ensures the spell addition effect runs even if race/subrace/path are the same
        setLastRaceSubracePath({ race: '', subrace: '', path: '' });
    }, [currentCharacterId, lastCharacterId, inspectionData, libraryDispatch, spellLibrary.spells]);

    // Handle spell addition and passives when race/subrace/path changes
    useEffect(() => {
        // Only run if we're not in inspection mode and if something actually changed
        if (inspectionData) return; // Skip in inspection mode
        
        const current = { race: race || '', subrace: subrace || '', path: path || '' };
        const last = lastRaceSubracePath;
        
        // Check if anything changed (including if last was reset to empty by character change)
        const hasChanges = current.race !== last.race || current.subrace !== last.subrace || current.path !== last.path;
        
        // Also check if character changed (if lastRaceSubracePath was reset, we need to add spells)
        const characterChanged = last.race === '' && last.subrace === '' && last.path === '' && 
                                 (current.race !== '' || current.subrace !== '' || current.path !== '');
        
        if (!hasChanges && !characterChanged) {
            return; // No changes
        }

        // Track which spells we're removing so we can exclude them from the existing spells list when adding
        let removedSpellIds = [];

        // IMPORTANT: Remove old spells BEFORE updating lastRaceSubracePath
        // This ensures we always remove spells when race/subrace changes, even if the effect re-runs
        if (current.race !== last.race || current.subrace !== last.subrace) {
            if (!characterChanged) {
                // Get the latest spells from the library
                const currentSpells = spellLibrary.spells;
                
                // Get the old racial spells by ID to ensure we remove the exact spells
                // Only remove if we had a previous race/subrace selection
                let oldRacialSpellIds = [];
                if (last.race && last.subrace) {
                    const oldRacialSpells = getRacialSpells(last.race, last.subrace);
                    oldRacialSpellIds = oldRacialSpells.map(s => s.id);
                }
                
                // Always remove all racial spells when race/subrace changes to ensure clean state
                // This prevents old spells from different subraces from persisting
                if (current.race !== last.race || current.subrace !== last.subrace) {
                    // Always remove ALL racial spells when race/subrace changes
                    // This ensures we don't have leftover spells from previous selections
                    const allRacialSpellsToRemove = currentSpells.filter(s => 
                        s.categoryIds && s.categoryIds.includes('Racial Abilities')
                    );
                    
                    // Remove duplicates by ID
                    const uniqueSpellsToRemove = Array.from(
                        new Map(allRacialSpellsToRemove.map(s => [s.id, s])).values()
                    );
                    
                    // Track the IDs we're removing
                    removedSpellIds = uniqueSpellsToRemove.map(s => s.id);
                    
                    console.log('🧹 [Equipment] Removing old racial spells:', {
                        lastRace: last.race,
                        lastSubrace: last.subrace,
                        currentRace: current.race,
                        currentSubrace: current.subrace,
                        totalSpells: currentSpells.length,
                        oldRacialSpellIds,
                        spellsToRemove: uniqueSpellsToRemove.length,
                        spellIds: removedSpellIds,
                        spellNames: uniqueSpellsToRemove.map(s => s.name)
                    });
                    
                    // Remove each racial spell individually to ensure they're deleted
                    uniqueSpellsToRemove.forEach(spell => {
                        if (spell && spell.id) {
                            console.log('🗑️ [Equipment] Deleting racial spell:', spell.id, spell.name);
                            libraryDispatch(libraryActionCreators.deleteSpell(spell.id));
                        }
                    });
                } else {
                    console.log('🧹 [Equipment] No old racial spells to remove (first selection)');
                }
            }
        }

        // Update last state AFTER removal
        setLastRaceSubracePath(current);

        // Handle racial spells - add new ones if race/subrace changed OR if character changed
        if (current.race !== last.race || current.subrace !== last.subrace || characterChanged) {
            // Add new racial spells (only if both race and subrace are set)
            // Note: Old spells were already removed above before updating lastRaceSubracePath
            if (current.race && current.subrace) {
                const racialSpells = getRacialSpells(current.race, current.subrace);
                
                // Filter out the spells we just removed from the existing spells list
                // This prevents them from being filtered out as "already existing" when we try to add them
                const existingSpellsWithoutRemoved = spellLibrary.spells.filter(
                    s => !removedSpellIds.includes(s.id)
                );
                
                // Also filter out any existing racial spells that don't match the current race/subrace
                // This ensures we can add new racial spells even if there are old ones in the library
                const currentRacialSpellIds = new Set(racialSpells.map(s => s.id));
                const existingSpellsFiltered = existingSpellsWithoutRemoved.filter(spell => {
                    // Keep spells that are not in the "Racial Abilities" category
                    if (!spell.categoryIds || !spell.categoryIds.includes('Racial Abilities')) {
                        return true;
                    }
                    // For racial spells, only keep them if they match the current race/subrace
                    return currentRacialSpellIds.has(spell.id);
                });
                
                console.log('🔍 [Equipment] Adding racial spells:', {
                    race: current.race,
                    subrace: current.subrace,
                    spellCount: racialSpells.length,
                    spellIds: racialSpells.map(s => s.id),
                    spellNames: racialSpells.map(s => s.name),
                    characterChanged,
                    existingSpellCount: spellLibrary.spells.length,
                    existingSpellCountAfterFilter: existingSpellsWithoutRemoved.length,
                    existingSpellCountAfterRacialFilter: existingSpellsFiltered.length,
                    removedSpellIds,
                    newSpellIds: racialSpells.map(s => s.id)
                });
                if (racialSpells.length > 0) {
                    // Pass filtered existing spells to prevent duplicates, but exclude the ones we just removed
                    // Also filter out any other racial spells that don't match current race/subrace
                    addSpellsToLibrary(libraryDispatch, racialSpells, 'Racial Abilities', existingSpellsFiltered);
                    console.log('✅ [Equipment] Called addSpellsToLibrary with', racialSpells.length, 'spells');
                } else {
                    console.warn('⚠️ [Equipment] No racial spells found for:', {
                        race: current.race,
                        subrace: current.subrace
                    });
                }
            } else {
                // If subrace is cleared or race is cleared, spells were already removed above
                console.log('🧹 [Equipment] Race or subrace cleared, racial spells removed');
            }
        }

        // Handle discipline/path spells
        // Add spells if path changed OR if character changed (last was reset to empty)
        if (current.path !== last.path || characterChanged) {
            // Remove old discipline spells (both abilities and passives) - only if not a character change
            if (!characterChanged) {
                removeSpellsByCategory(libraryDispatch, 'Discipline Abilities', spellLibrary.spells);
                removeSpellsByCategory(libraryDispatch, 'Discipline Passives', spellLibrary.spells);
            }
            // Also remove old passives by checking for spells with 'discipline' tag and passive type (fallback)
            const oldPassives = spellLibrary.spells.filter(spell => 
                spell.spellType === 'PASSIVE' && 
                (spell.tags?.includes('discipline') || spell.typeConfig?.tags?.includes('discipline')) &&
                !spell.categoryIds?.includes('Discipline Passives') // Don't double-remove
            );
            oldPassives.forEach(spell => {
                if (spell && spell.id) {
                    libraryDispatch(libraryActionCreators.deleteSpell(spell.id));
                }
            });

            if (path) {
                const pathData = ENHANCED_PATHS[path];
                
                // Get available spells from path abilities
                let availableSpells = [];
                if (pathData && pathData.abilities) {
                    availableSpells = pathData.abilities;
                }

                // If we have spells available, select randomly based on spell types
                if (availableSpells.length > 0) {
                    // Select 1 of each spell type (passive, reaction, action)
                    const choices = { passive: 1, reaction: 1, action: 1 };
                    const selectedSpells = selectRandomSpells(availableSpells, choices);

                    // Filter out spells that are already in the library
                    const newSpells = filterNewSpells(selectedSpells, spellLibrary.spells);

                    // Add new spells to library
                    newSpells.forEach(spell => {
                        if (spell && spell.id) {
                            libraryDispatch(libraryActionCreators.addSpell(spell));
                        }
                    });
                }

                // Store passives from path and convert non-stat passives to spell cards
                if (pathData && pathData.mechanicalBenefits) {
                    // Store passives in character store
                    updateCharacterInfo('pathPassives', pathData.mechanicalBenefits);
                    
                    // Convert non-stat passives to spell cards and add to library
                    pathData.mechanicalBenefits.forEach(passive => {
                        // Skip stat bonuses - they're applied automatically
                        if (passive.type === 'stat') {
                            return;
                        }
                        
                        // Create spell card from passive
                        const spellCard = {
                            id: `passive_${passive.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`,
                            name: passive.name || 'Unknown Passive',
                            description: passive.description || '',
                            level: 1,
                            spellType: 'PASSIVE',
                            tags: ['passive', 'discipline'],
                            effectTypes: ['utility'],
                            damageTypes: [],
                            icon: 'spell_holy_devotion',
                            typeConfig: {
                                school: 'divine',
                                icon: 'spell_holy_devotion',
                                tags: ['passive', 'discipline']
                            },
                            targetingConfig: {
                                targetingType: 'self'
                            },
                            resourceCost: {
                                actionPoints: 0
                            },
                            resolution: 'AUTO',
                            visualTheme: 'holy',
                            categoryIds: ['Discipline Passives'],
                            dateCreated: new Date().toISOString(),
                            lastModified: new Date().toISOString()
                        };
                        
                        // Add spell to library (old ones were already removed above)
                        libraryDispatch(libraryActionCreators.addSpell(spellCard));
                    });
                }
            } else {
                // Path was removed, clear passives
                updateCharacterInfo('pathPassives', []);
            }
        }
    }, [race, subrace, path, inspectionData, libraryDispatch, updateCharacterInfo, lastRaceSubracePath]);

    const updateTooltipPosition = (e) => {
        // Position tooltip near cursor but with a small offset
        setTooltipPosition({
            x: e.clientX + 15,
            y: e.clientY - 10
        });
    };

    // Render character info section with side-by-side layout
    const renderCharacterInfo = () => (
        <div className="character-info-content">
            {/* Character Info and Model Layout */}
            <div className="character-summary-layout">
                {/* Left Side - Character Model and Info */}
                <div className="character-summary-portrait">
                    <div className="character-identity-section">
                        <div className="character-name-section">
                            <label className="character-field-label">Character Name</label>
                            <input
                                type="text"
                                value={baseName || name}
                                onChange={(e) => updateBaseName ? updateBaseName(e.target.value) : updateCharacterInfo('name', e.target.value)}
                                className="character-field-input"
                                placeholder="Enter character name"
                                maxLength={30}
                            />
                        </div>

                <div className="character-details-grid">
                    <div className="character-field">
                        <label className="character-field-label">Race</label>
                        <select
                            value={race}
                            onChange={(e) => updateCharacterInfo('race', e.target.value)}
                            className="character-field-input"
                        >
                            <option value="">Select a race</option>
                            {getRaceList().map(raceOption => (
                                <option key={raceOption.id} value={raceOption.id}>
                                    {raceOption.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Subrace</label>
                        <select
                            value={subrace}
                            onChange={(e) => updateCharacterInfo('subrace', e.target.value)}
                            className="character-field-input"
                            disabled={!race}
                        >
                            <option value="">Select a subrace</option>
                            {race && getSubraceList(race).map(subraceOption => (
                                <option key={subraceOption.id} value={subraceOption.id}>
                                    {subraceOption.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Class</label>
                        <select
                            value={characterClass}
                            onChange={(e) => updateCharacterInfo('class', e.target.value)}
                            className="character-field-input"
                        >
                            <option value="">Select a class</option>
                            <option value="Pyrofiend">Pyrofiend</option>
                            <option value="Minstrel">Minstrel</option>
                            <option value="Chronarch">Chronarch</option>
                            <option value="Chaos Weaver">Chaos Weaver</option>
                            <option value="Fate Weaver">Fate Weaver</option>
                            <option value="Gambler">Gambler</option>
                            <option value="Martyr">Martyr</option>
                            <option value="False Prophet">False Prophet</option>
                            <option value="Exorcist">Exorcist</option>
                            <option value="Oracle">Oracle</option>
                            <option value="Plaguebringer">Plaguebringer</option>
                            <option value="Lichborne">Lichborne</option>
                            <option value="Deathcaller">Deathcaller</option>
                            <option value="Spellguard">Spellguard</option>
                            <option value="Inscriptor">Inscriptor</option>
                            <option value="Arcanoneer">Arcanoneer</option>
                            <option value="Witch Doctor">Witch Doctor</option>
                            <option value="Formbender">Formbender</option>
                            <option value="Primalist">Primalist</option>
                            <option value="Berserker">Berserker</option>
                            <option value="Dreadnaught">Dreadnaught</option>
                            <option value="Titan">Titan</option>
                            <option value="Toxicologist">Toxicologist</option>
                            <option value="Covenbane">Covenbane</option>
                            <option value="Bladedancer">Bladedancer</option>
                            <option value="Lunarch">Lunarch</option>
                            <option value="Huntress">Huntress</option>
                            <option value="Warden">Warden</option>
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Discipline</label>
                        <select
                            value={path || ''}
                            onChange={(e) => {
                                const selectedPath = e.target.value;
                                const pathData = selectedPath ? ENHANCED_PATHS[selectedPath] : null;
                                updateCharacterInfo('path', selectedPath);
                                if (pathData) {
                                    updateCharacterInfo('pathDisplayName', pathData.name);
                                } else {
                                    updateCharacterInfo('pathDisplayName', '');
                                }
                            }}
                            className="character-field-input"
                        >
                            <option value="">Select a discipline</option>
                            {getAllEnhancedPaths().map(pathOption => (
                                <option key={pathOption.id} value={pathOption.id}>
                                    {pathOption.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Level</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={level}
                            onChange={(e) => updateCharacterInfo('level', parseInt(e.target.value) || 1)}
                            className="character-field-input"
                        />
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Alignment</label>
                        <select
                            value={alignment}
                            onChange={(e) => updateCharacterInfo('alignment', e.target.value)}
                            className="character-field-select"
                        >
                            <option value="Lawful Good">Lawful Good</option>
                            <option value="Neutral Good">Neutral Good</option>
                            <option value="Chaotic Good">Chaotic Good</option>
                            <option value="Lawful Neutral">Lawful Neutral</option>
                            <option value="True Neutral">True Neutral</option>
                            <option value="Chaotic Neutral">Chaotic Neutral</option>
                            <option value="Lawful Evil">Lawful Evil</option>
                            <option value="Neutral Evil">Neutral Evil</option>
                            <option value="Chaotic Evil">Chaotic Evil</option>
                        </select>
                    </div>

                    <div className="character-field">
                        <label className="character-field-label">Exhaustion Level</label>
                        <select
                            value={exhaustionLevel}
                            onChange={(e) => updateCharacterInfo('exhaustionLevel', parseInt(e.target.value))}
                            className="character-field-select"
                        >
                            <option value={0}>None</option>
                            <option value={1}>Level 1</option>
                            <option value={2}>Level 2</option>
                            <option value={3}>Level 3</option>
                            <option value={4}>Level 4</option>
                            <option value={5}>Level 5</option>
                            <option value={6}>Level 6</option>
                        </select>
                    </div>
                </div>

                    </div>
                </div>


            </div>
        </div>
    );

    // Render equipment section
    const renderEquipment = () => (
        <div className="equipment-content">
            <div className="equipment-layout">
                {/* Left Equipment Column */}
                <div className="left-equipment">
                    {Object.entries(slots).filter(([slotName]) =>
                        ['head', 'neck', 'shoulders', 'back', 'chest', 'shirt', 'tabard', 'wrists'].includes(slotName)
                    ).map(([slotName, config]) => renderSlot(slotName, config))}
                </div>

                {/* Character Portrait Section */}
                <div className="character-center-section">
                    <div className="character-image-container">
                        {lore?.characterImage ? (
                            <img
                                src={lore.characterImage}
                                alt="Character Portrait"
                                className="character-portrait"
                            />
                        ) : (
                            <div className="character-portrait-placeholder">
                                <i className="fas fa-user"></i>
                                <span>No Image</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Weapon Slots Below Image */}
                    <div className="weapon-slots-bottom">
                        {Object.entries(weaponSlots).map(([slotName, config]) => {
                            const item = equipment[slotName];
                            const isEmpty = !item;
                            const isDisabled = slotName === 'offHand' && isOffHandDisabled(equipment);

                            // Weapon slot descriptions
                            const slotDescriptions = {
                                mainHand: "Your primary weapon used for attacking. Choose based on your combat style and training.",
                                offHand: isDisabled ?
                                    "Off-hand is disabled while wielding a two-handed weapon." :
                                    "Secondary weapons, shields, or magical focuses held in your off-hand.",
                                ranged: "Bows, crossbows, wands, or thrown weapons used to attack from a distance."
                            };

                            return (
                                <div
                                    key={slotName}
                                    className={`weapon-slot ${isEmpty ? 'empty' : ''} ${isDisabled ? 'disabled' : ''}`}
                                    onMouseEnter={(e) => {
                                        setHoveredSlot(slotName);
                                        updateTooltipPosition(e);
                                    }}
                                    onMouseMove={updateTooltipPosition}
                                    onMouseLeave={() => setHoveredSlot(null)}
                                    onContextMenu={(e) => {
                                        if (item && !isDisabled) {
                                            handleUnequipContextMenu(e, item, slotName);
                                        }
                                    }}
                                >
                                    <img
                                        src={item ? (item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')) : config.icon}
                                        alt={slotName}
                                        style={{ opacity: isDisabled ? 0.3 : 1 }}
                                        onError={(e) => {
                                            e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                        }}
                                    />

                                    {/* Red cross overlay for disabled off-hand */}
                                    {isDisabled && (
                                        <div className="disabled-overlay">
                                            <div className="red-cross">
                                                <div className="cross-line cross-line-1"></div>
                                                <div className="cross-line cross-line-2"></div>
                                            </div>
                                        </div>
                                    )}

                                    {hoveredSlot === slotName && item && !isDisabled && renderTooltip(item)}
                                    {hoveredSlot === slotName && (isEmpty || isDisabled) && (
                                        <TooltipPortal>
                                            <div
                                                className="equipment-slot-tooltip"
                                                style={{
                                                    position: 'fixed',
                                                    left: tooltipPosition.x,
                                                    top: tooltipPosition.y,
                                                    transform: 'translate(10px, -50%)',
                                                    pointerEvents: 'none',
                                                    zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                                                }}
                                            >
                                                <div className="equipment-slot-name">{config.info}</div>
                                                <div className="equipment-slot-description">{slotDescriptions[slotName] || `Slot for ${config.info} equipment`}</div>
                                            </div>
                                        </TooltipPortal>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Equipment Column */}
                <div className="right-equipment">
                    {Object.entries(slots).filter(([slotName]) =>
                        ['hands', 'waist', 'legs', 'feet', 'ring1', 'ring2', 'trinket1', 'trinket2'].includes(slotName)
                    ).map(([slotName, config]) => renderSlot(slotName, config))}
                </div>
            </div>
        </div>
    );

    // Render resources section
    const renderResources = () => {
        // Get class resource configuration
        const classResourceConfig = characterClass ? getClassResourceConfig(characterClass) : null;

        return (
            <div className="resources-content">
                <div className="resource-bars-section">
                    <ResourceBar
                        current={health.current}
                        max={health.max}
                        className="health"
                        label="Health"
                        resourceType="health"
                        onUpdate={updateResource}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />
                    <ResourceBar
                        current={mana.current}
                        max={mana.max}
                        className="mana"
                        label="Mana"
                        resourceType="mana"
                        onUpdate={updateResource}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />
                    <ResourceBar
                        current={actionPoints.current}
                        max={actionPoints.max}
                        className="action-points"
                        label="Action Points"
                        resourceType="actionPoints"
                        onUpdate={updateResource}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />

                    {/* Class Resource - Show if character has a class and class resource */}
                    {characterClass && classResource && classResourceConfig && (
                        <div className="class-resource-section">
                            <h4 className="resource-section-title">{classResourceConfig.name}</h4>
                            <div className="class-resource-display">
                                <ClassResourceBar
                                    characterClass={characterClass}
                                    classResource={classResource}
                                    character={{ health, mana, actionPoints }}
                                    size="large"
                                />
                            </div>
                            <div className="class-resource-details">
                                <div className="resource-description">
                                    {classResourceConfig.description}
                                </div>
                                <div className="resource-mechanics">
                                    <div className="resource-stat">
                                        <span className="stat-label">Current:</span>
                                        <span className="stat-value">{classResource.current}</span>
                                    </div>
                                    <div className="resource-stat">
                                        <span className="stat-label">Maximum:</span>
                                        <span className="stat-value">{classResource.max}</span>
                                    </div>
                                    {classResource.stacks && classResource.stacks.length > 0 && (
                                        <div className="resource-stat">
                                            <span className="stat-label">Stacks:</span>
                                            <span className="stat-value">{classResource.stacks.length}</span>
                                        </div>
                                    )}
                                    {classResource.risk !== undefined && classResource.risk > 0 && (
                                        <div className="resource-stat">
                                            <span className="stat-label">Risk:</span>
                                            <span className="stat-value">{classResource.risk}</span>
                                        </div>
                                    )}
                                    {classResource.volatility !== undefined && classResource.volatility > 0 && (
                                        <div className="resource-stat">
                                            <span className="stat-label">Volatility:</span>
                                            <span className="stat-value">{classResource.volatility}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render content based on active section
    // Render passives summary section
    const renderPassives = () => {
        // Get all passive abilities from racial stat modifiers and path passives
        const racialPassives = race && subrace ? getRacialStatModifiers(race, subrace) : [];
        const allPassives = [...racialPassives, ...(pathPassives || [])];

        if (allPassives.length === 0) {
            return (
                <div className="passive-summary-container">
                    <div className="passive-summary-empty">
                        <p>No passive abilities available.</p>
                        <p>Select a race, subrace, and discipline to see passive abilities here.</p>
                    </div>
                </div>
            );
        }

        // Group passives by source
        const racialGroup = racialPassives.length > 0 ? {
            name: 'Racial Passives',
            passives: racialPassives
        } : null;

        const pathGroup = pathPassives && pathPassives.length > 0 ? {
            name: 'Discipline Passives',
            passives: pathPassives
        } : null;

        const groups = [racialGroup, pathGroup].filter(Boolean);

        return (
            <div className="passive-summary-container">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="passive-summary-group">
                        <div className="passive-summary-group-header">
                            <h3>{group.name}</h3>
                        </div>
                        <div className="passive-summary-list">
                            {group.passives.map((passive, idx) => {
                                const icon = passive?.icon || 'spell_holy_devotion';
                                const name = passive?.name || 'Passive Ability';
                                const description = getPassiveSummary(passive);

                                return (
                                    <div key={idx} className="passive-summary-item">
                                        <div className="passive-summary-icon-wrapper">
                                            <img
                                                src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                                                alt={name}
                                                className="passive-summary-icon"
                                                onError={(e) => e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg'}
                                            />
                                        </div>
                                        <div className="passive-summary-details">
                                            <div className="passive-summary-name">{name}</div>
                                            <div className="passive-summary-description">{description}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'character':
                return renderCharacterInfo();
            case 'equipment':
                return renderEquipment();
            case 'resources':
                return renderResources();
            case 'passives':
                return renderPassives();
            default:
                return renderCharacterInfo();
        }
    };

    // Handle unequip context menu
    const handleUnequipContextMenu = (e, item, slotName) => {
        e.preventDefault();
        e.stopPropagation();

        // Calculate position to ensure menu stays within viewport
        const x = Math.min(e.clientX, window.innerWidth - 250);
        const y = Math.min(e.clientY, window.innerHeight - 150);

        setUnequipContextMenu({
            visible: true,
            x,
            y,
            item,
            slotName
        });
    };

    // Handle unequipping an item
    const handleUnequipItem = (slotName) => {
        try {
            // Unequip the item from the character
            const unequippedItem = unequipItem(slotName);

            if (unequippedItem) {
                // Add the item back to inventory
                addItem(unequippedItem);
                console.log(`Unequipped ${unequippedItem.name} from ${slotName}`);
            }
        } catch (error) {
            console.error('Error unequipping item:', error);
        }
    };

    const slots = {
        head: {
            position: { top: 0, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_helmet_01.jpg',
            info: 'Head'
        },
        neck: {
            position: { top: 50, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_necklace_01.jpg',
            info: 'Neck'
        },
        shoulders: {
            position: { top: 100, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_01.jpg',
            info: 'Shoulders'
        },
        back: {
            position: { top: 150, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_cape_01.jpg',
            info: 'Back'
        },
        chest: {
            position: { top: 200, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_cloth_01.jpg',
            info: 'Chest'
        },
        shirt: {
            position: { top: 250, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shirt_white_01.jpg',
            info: 'Shirt'
        },
        tabard: {
            position: { top: 300, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shirt_guildtabard_01.jpg',
            info: 'Tabard'
        },
        wrists: {
            position: { top: 350, left: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_bracer_02.jpg',
            info: 'Wrists'
        },
        hands: {
            position: { top: 0, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_01.jpg',
            info: 'Hands'
        },
        waist: {
            position: { top: 50, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_belt_01.jpg',
            info: 'Waist'
        },
        legs: {
            position: { top: 100, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_pants_01.jpg',
            info: 'Legs'
        },
        feet: {
            position: { top: 150, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_boots_01.jpg',
            info: 'Feet'
        },
        ring1: {
            position: { top: 200, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_01.jpg',
            info: 'Ring'
        },
        ring2: {
            position: { top: 250, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_ring_02.jpg',
            info: 'Ring'
        },
        trinket1: {
            position: { top: 300, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_01.jpg',
            info: 'Trinket'
        },
        trinket2: {
            position: { top: 350, right: -50 },
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_02.jpg',
            info: 'Trinket'
        }
    };

    const weaponSlots = {
        mainHand: {
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_01.jpg',
            info: 'Main Hand'
        },
        offHand: {
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_01.jpg',
            info: 'Off Hand'
        },
        ranged: {
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_weapon_bow_01.jpg',
            info: 'Ranged'
        }
    };

    // Calculate total stats (base + equipment bonuses)
    const getTotalStats = () => {
        const totalStats = { ...stats };

        if (equipmentBonuses) {
            // Add equipment bonuses to base stats
            const statMapping = {
                str: 'strength',
                con: 'constitution',
                agi: 'agility',
                int: 'intelligence',
                spir: 'spirit',
                cha: 'charisma'
            };

            Object.entries(statMapping).forEach(([bonusKey, statKey]) => {
                if (equipmentBonuses[bonusKey]) {
                    totalStats[statKey] = Math.round((totalStats[statKey] || 0) + equipmentBonuses[bonusKey]);
                }
            });

            // Calculate fresh derived stats with current equipment bonuses
            const encumbranceState = useInventoryStore.getState().encumbranceState || 'normal';
            const freshDerivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, exhaustionLevel || 0, health, race, subrace);

            // Add derived stats (all rounded)
            totalStats.maxHealth = Math.round(freshDerivedStats.maxHealth || health.max);
            totalStats.maxMana = Math.round(freshDerivedStats.maxMana || mana.max);
            totalStats.healthRegen = Math.round(freshDerivedStats.healthRegen || 0);
            totalStats.manaRegen = Math.round(freshDerivedStats.manaRegen || 0);
            totalStats.armor = Math.round(freshDerivedStats.armor || 0);
            totalStats.movementSpeed = Math.round(freshDerivedStats.moveSpeed ?? 30);
            totalStats.carryingCapacity = Math.round(freshDerivedStats.carryingCapacity || 0);
            totalStats.damage = Math.round(freshDerivedStats.damage || 0);
            totalStats.spellDamage = Math.round(freshDerivedStats.spellDamage || 0);
            totalStats.healingPower = Math.round(freshDerivedStats.healingPower || 0);
            totalStats.rangedDamage = Math.round(freshDerivedStats.rangedDamage || 0);

            // Add resistances from equipment
            if (equipmentBonuses.resistances) {
                Object.entries(equipmentBonuses.resistances).forEach(([resistanceType, value]) => {
                    const resistanceKey = `${resistanceType}Resistance`;
                    totalStats[resistanceKey] = Math.round((totalStats[resistanceKey] || 0) + value);
                });
            }

            // Add spell damage types from equipment (base spell power is 0)
            if (equipmentBonuses.spellDamageTypes) {
                Object.entries(equipmentBonuses.spellDamageTypes).forEach(([spellType, value]) => {
                    const spellPowerKey = `${spellType}SpellPower`;
                    // Base spell power is 0, only equipment bonuses
                    totalStats[spellPowerKey] = Math.round(0 + value);
                });
            }

            // Add immunities from equipment
            if (equipmentBonuses.immunities && equipmentBonuses.immunities.length > 0) {
                totalStats.immunities = [...(totalStats.immunities || []), ...equipmentBonuses.immunities];
                // Remove duplicates
                totalStats.immunities = [...new Set(totalStats.immunities)];
            }
        }

        return totalStats;
    };

    const totalStats = getTotalStats();





    const renderSlot = (slotName, slotConfig) => {
        const item = equipment[slotName];
        const isEmpty = !item;

        // Equipment slot descriptions
        const slotDescriptions = {
            head: "Protects your head from blows and the elements. Helmets often enhance perception, intelligence, or provide magical protection.",
            neck: "Amulets and necklaces that grant magical properties, protection, or enhance your natural abilities.",
            shoulders: "Pauldrons and spaulders that provide additional protection and can enhance strength or intimidation.",
            back: "Cloaks and capes that offer protection from the elements and can grant stealth or movement bonuses.",
            chest: "Your primary armor piece, offering the most protection and often enhancing your core attributes.",
            shirt: "Primarily decorative, but some magical shirts can provide comfort in harsh environments.",
            tabard: "Displays your allegiance or achievements. Some magical tabards grant special abilities.",
            wrists: "Bracers that protect your forearms and can enhance spellcasting or physical abilities.",
            hands: "Gauntlets and gloves that protect your hands and can enhance agility or attack power.",
            waist: "Belts and girdles that can hold items and sometimes enhance strength or constitution.",
            legs: "Greaves and leggings that protect your lower body and can enhance mobility or endurance.",
            feet: "Boots that protect your feet and can enhance speed, stealth, or provide stability.",
            ring1: "Magical rings that can enhance attributes, grant special abilities, or provide protection.",
            ring2: "A second magical ring. Wearing too many powerful rings can be dangerous.",
            trinket1: "Magical devices with unique effects that can be activated in times of need.",
            trinket2: "A second magical trinket. Choose wisely to complement your abilities.",
            mainHand: "Your primary weapon used for attacking. Choose based on your combat style and training.",
            offHand: "Secondary weapons, shields, or magical focuses held in your off-hand.",
            ranged: "Bows, crossbows, wands, or thrown weapons used to attack from a distance."
        };

        return (
            <div
                key={slotName}
                className={`gear-slot ${isEmpty ? 'empty' : ''}`}
                onMouseEnter={(e) => {
                    setHoveredSlot(slotName);
                    updateTooltipPosition(e);
                }}
                onMouseMove={updateTooltipPosition}
                onMouseLeave={() => setHoveredSlot(null)}
                onContextMenu={(e) => {
                    if (item) {
                        handleUnequipContextMenu(e, item, slotName);
                    }
                }}
            >
                <img
                    src={item ? (item.imageUrl || (item.iconId ? `https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg` : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg')) : slotConfig.icon}
                    alt={slotName}
                    onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                    }}
                />
                {hoveredSlot === slotName && item && renderTooltip(item)}
                {hoveredSlot === slotName && isEmpty && (
                    <TooltipPortal>
                        <div
                            className="equipment-slot-tooltip"
                            style={{
                                position: 'fixed',
                                left: tooltipPosition.x,
                                top: tooltipPosition.y,
                                transform: 'translate(10px, -50%)',
                                pointerEvents: 'none',
                                zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                            }}
                        >
                            <div className="equipment-slot-name">{slotConfig.info}</div>
                            <div className="equipment-slot-description">{slotDescriptions[slotName] || `Slot for ${slotConfig.info} equipment`}</div>
                        </div>
                    </TooltipPortal>
                )}
            </div>
        );
    };

    const renderTooltip = (item) => {
        if (!item) return null;

        return (
            <TooltipPortal>
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translate(10px, -50%)',
                        pointerEvents: 'none',
                        zIndex: 999999999 /* Maximum z-index to ensure it appears above all windows */
                    }}
                >
                    <ItemTooltip item={item} />
                </div>
            </TooltipPortal>
        );
    };

    return (
        <div className="character-container">
            <div className={`character-navigation ${showLabels ? 'with-labels' : 'icons-only'}`}>
                <button
                    className="stats-label-toggle-button"
                    onClick={() => setShowLabels(!showLabels)}
                    title={showLabels ? 'Hide Labels' : 'Show Labels'}
                >
                    <span className="stats-toggle-icon">{showLabels ? '◀' : '▶'}</span>
                </button>
                {Object.entries(sections).map(([key, section]) => (
                    <button
                        key={key}
                        className={`character-nav-button ${activeSection === key ? 'active' : ''}`}
                        onClick={() => setActiveSection(key)}
                        title={section.title}
                    >
                        <img src={section.icon} alt="" className="character-nav-icon" />
                        {showLabels && <span className="character-nav-text">{section.title}</span>}
                    </button>
                ))}
            </div>

            <div className={`character-content-area ${activeSection === 'character' ? 'character-backdrop' : activeSection === 'equipment' ? 'equipment-backdrop' : ''}`}>
                <div className="character-section-header">
                    <img
                        src={sections[activeSection].icon}
                        alt=""
                        className="character-section-icon"
                    />
                    <h2 className="character-section-title">{sections[activeSection].title}</h2>
                </div>

                <div className="character-fields">
                    {renderSectionContent()}
                </div>
            </div>

            {/* Unequip Context Menu - Render at document level for proper positioning */}
            {unequipContextMenu.visible && ReactDOM.createPortal(
                <UnequipContextMenu
                    x={unequipContextMenu.x}
                    y={unequipContextMenu.y}
                    item={unequipContextMenu.item}
                    slotName={unequipContextMenu.slotName}
                    onClose={() => setUnequipContextMenu({ visible: false })}
                    onUnequip={handleUnequipItem}
                />,
                document.body
            )}
        </div>
    );
}