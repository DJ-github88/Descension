import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import usePartyStore from '../../store/partyStore';
import useGameStore from '../../store/gameStore';
import useChatStore from '../../store/chatStore';
import { useInspectionCharacter } from '../../contexts/InspectionContext';
import TooltipPortal from '../tooltips/TooltipPortal';
import ItemTooltip from '../item-generation/ItemTooltip';
import UnequipContextMenu from '../equipment/UnequipContextMenu';
import ClassResourceBar from '../hud/ClassResourceBar';
import { isOffHandDisabled } from '../../utils/equipmentUtils';
import { calculateDerivedStats } from '../../utils/characterUtils';
import { getClassResourceConfig } from '../../data/classResources';
import { getRaceList, getSubraceList, getRacialSavingThrowModifiers } from '../../data/raceData';
import { ENHANCED_PATHS, getAllEnhancedPaths } from '../../data/enhancedPathData';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { selectRandomSpells, filterNewSpells, getRacialSpells, getRacialStatModifiers, addSpellsToLibrary, removeSpellsByCategory } from '../../utils/raceDisciplineSpellUtils';
import { getPassiveAbilities } from '../../data/backgroundAbilities';
import { getBackgroundData } from '../../data/backgroundData';
import '../../styles/character-sheet.css';
import '../../styles/resistance-styles.css';
import '../../styles/racial-traits.css';

import { getIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import useItemStore from '../../store/itemStore';
import Languages from './Languages';

// Derive concise passive summaries: 1 line flavor text, then game mechanics
const getPassiveSummary = (passive = {}) => {
    const parts = [];
    
    // Handle background passives (they have description and details fields)
    if (passive.type === 'Passive' && passive.details) {
        // For background passives, use description as summary and details for full text
        if (passive.description) {
            parts.push(passive.description);
        }
        if (passive.usage && passive.usage !== 'Always Active' && passive.usage !== 'FEATURE') {
            parts.push(`(${passive.usage})`);
        }
        return parts.join(' ');
    }
    
    // Handle background features (they have name and description, usage is 'FEATURE')
    if (passive.type === 'Passive' && passive.usage === 'FEATURE') {
        if (passive.description) {
            return passive.description;
        }
        return 'Background feature';
    }
    
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



const ResourceBar = ({ current, max, temp = 0, className, label, resourceType, onUpdate, tooltipPosition, setTooltipPosition }) => {
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
        // Calculate the new value without capping (let onUpdate handle overheal detection)
        const newValue = current + amount;
        // Only cap negative values (damage)
        const cappedValue = amount < 0 ? Math.max(0, newValue) : newValue;
        onUpdate(resourceType, cappedValue, max);
    };

    const handleInputSubmit = () => {
        const value = parseInt(inputValue);
        if (!isNaN(value)) {
            // For input, allow values above max to trigger overheal detection
            const newValue = Math.max(0, value);
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
                <span className="resource-bar-values">
                    {current} / {max}
                    {temp > 0 && (
                        <span style={{ color: '#FF9800', marginLeft: '4px' }}>
                            +{temp} Temporary {resourceType === 'health' ? 'HP' : resourceType === 'mana' ? 'Mana' : 'AP'}
                        </span>
                    )}
                </span>
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
    // PERFORMANCE OPTIMIZATION: Use selector to only subscribe to needed values
    const characterStore = useCharacterStore((state) => ({
        equipment: state.equipment,
        stats: state.stats,
        equipmentBonuses: state.equipmentBonuses,
        derivedStats: state.derivedStats,
        health: state.health,
        mana: state.mana,
        actionPoints: state.actionPoints,
        tempHealth: state.tempHealth || 0,
        tempMana: state.tempMana || 0,
        tempActionPoints: state.tempActionPoints || 0,
        classResource: state.classResource,
        name: state.name,
        baseName: state.baseName,
        race: state.race,
        subrace: state.subrace,
        pathPassives: state.pathPassives,
        background: state.background,
        class: state.class,
        path: state.path,
        pathDisplayName: state.pathDisplayName,
        level: state.level,
        alignment: state.alignment,
        exhaustionLevel: state.exhaustionLevel,
        updateEquipment: state.updateEquipment,
        updateCharacterInfo: state.updateCharacterInfo,
        updateBaseName: state.updateBaseName,
        updateResource: state.updateResource,
        unequipItem: state.unequipItem,
        immunities: state.immunities,
        lore: state.lore
    }));

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
        tempHealth = 0,
        tempMana = 0,
        tempActionPoints = 0,
        classResource,
        name,
        baseName,
        race,
        subrace,
        pathPassives = [],
        background,
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
            icon: getCustomIconUrl('Nature/Stylized Tree', 'abilities')
        },
        equipment: {
            title: 'Equipment',
            icon: getCustomIconUrl('Utility/Brown Shield', 'abilities')
        },
        resources: {
            title: 'Resources',
            icon: getIconUrl('Healing/Golden Heart', 'abilities')
        },
        passives: {
            title: 'Passives',
            icon: getIconUrl('Utility/Glowing Orb', 'abilities')
        },
        languages: {
            title: 'Languages',
            icon: getIconUrl('Social/Party Gathering', 'abilities')
        }
    };

    // Inventory store for adding unequipped items back to inventory
    const { addItem } = useInventoryStore(state => ({
        addItem: state.addItem
    }));

    // Get chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    
    // Get GM mode status
    const isGMMode = useGameStore(state => state.isGMMode);
    
    // Get current player name for actor name in logs
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const [hoveredSlot, setHoveredSlot] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipDelay, setTooltipDelay] = useState(null);
    const [unequipContextMenu, setUnequipContextMenu] = useState({ visible: false, x: 0, y: 0, item: null, slotName: null });
    const [lastRaceSubracePath, setLastRaceSubracePath] = useState({ race: '', subrace: '', path: '' });
    const [lastCharacterId, setLastCharacterId] = useState(null);
    const [showOverhealModal, setShowOverhealModal] = useState(false);
    const [overhealData, setOverhealData] = useState(null); // { resourceType, adjustment, currentValue, maxValue }

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

                {/* Special Modifiers Section */}
                {race && subrace && (() => {
                    const savingThrowMods = getRacialSavingThrowModifiers(race, subrace);
                    const hasSpecialModifiers = savingThrowMods && (
                        (savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0) ||
                        (savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0)
                    );
                    
                    if (!hasSpecialModifiers) return null;
                    
                    return (
                        <div className="character-details-grid" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #8b7355' }}>
                            <div className="character-field" style={{ gridColumn: '1 / -1' }}>
                                <label className="character-field-label" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                                    Special Modifiers
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                                        <div style={{ padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '1px solid #4caf50' }}>
                                            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>Advantage on saves against: </span>
                                            <span>{savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                        </div>
                                    )}
                                    {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                                        <div style={{ padding: '8px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #f44336' }}>
                                            <span style={{ fontWeight: 'bold', color: '#f44336' }}>Disadvantage on saves against: </span>
                                            <span>{savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()}

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
                            // Handle potential key mismatch: check both camelCase and snake_case
                            let item = equipment[slotName];
                            if (!item && slotName === 'offHand') {
                                // Try snake_case version
                                item = equipment['off_hand'] || equipment['offHand'];
                            }
                            const isEmpty = !item;
                            const isDisabled = slotName === 'offHand' && isOffHandDisabled(equipment);

                            // Debug logging for off-hand slot
                            if (slotName === 'offHand') {
                                console.log('🛡️ Off-hand slot debug:', {
                                    slotName,
                                    hasItem: !!item,
                                    itemName: item?.name,
                                    iconId: item?.iconId,
                                    imageUrl: item?.imageUrl,
                                    equipmentKeys: Object.keys(equipment),
                                    offHandKey: 'offHand' in equipment,
                                    off_handKey: 'off_hand' in equipment,
                                    allEquipment: equipment
                                });
                            }

                            // Get the image source for the item
                            const getItemImageSrc = () => {
                                if (!item) return config.icon;
                                
                                // First check for valid imageUrl (not WoW URL)
                                if (item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) {
                                    return item.imageUrl;
                                }
                                
                                // Then check for iconId
                                if (item.iconId) {
                                    return getIconUrl(item.iconId, 'items', true);
                                }
                                
                                // Fallback: Try to look up the item from item store if we have an ID
                                if (item.id) {
                                    try {
                                        const itemStore = useItemStore.getState();
                                        const originalItem = itemStore.items.find(i => i.id === item.id);
                                        if (originalItem && originalItem.iconId) {
                                            return getIconUrl(originalItem.iconId, 'items', true);
                                        }
                                    } catch (e) {
                                        // Item store not available, continue to fallback
                                        console.warn('Could not look up item from store:', e);
                                    }
                                }
                                
                                // Final fallback to question mark
                                return getIconUrl('inv_misc_questionmark', 'items', true);
                            };

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
                                        src={getItemImageSrc()}
                                        alt={slotName}
                                        style={{ opacity: isDisabled ? 0.3 : 1 }}
                                        onError={(e) => {
                                            console.error('❌ Image load error for off-hand item:', {
                                                slotName,
                                                itemName: item?.name,
                                                iconId: item?.iconId,
                                                imageUrl: item?.imageUrl,
                                                attemptedSrc: e.target.src
                                            });
                                            e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
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

    // Helper function to get the actor name (current player, with GM suffix if in GM mode)
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    // Helper function to generate varied log messages for resource changes
    const logResourceChange = (characterName, resourceType, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        
        if (resourceType === 'health') {
            // Use existing combat_heal and combat_hit types for health
            if (isPositive) {
                const messages = [
                    `Healed ${characterName} for ${absAmount} health`,
                    `${characterName} regained ${absAmount} health`,
                    `${characterName} recovered ${absAmount} health`,
                    `Restored ${absAmount} health to ${characterName}`
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                addCombatNotification({
                    type: 'combat_heal',
                    healer: actorName,
                    target: characterName,
                    healing: absAmount,
                    customMessage: message
                });
            } else {
                const messages = [
                    `Hit ${characterName} for ${absAmount} damage`,
                    `${characterName} took ${absAmount} damage`,
                    `Dealt ${absAmount} damage to ${characterName}`,
                    `${characterName} suffered ${absAmount} damage`
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                addCombatNotification({
                    type: 'combat_hit',
                    attacker: actorName,
                    target: characterName,
                    damage: absAmount,
                    customMessage: message
                });
            }
        } else {
            // For mana and action points, create custom messages
            const resourceNames = {
                'mana': { positive: ['mana'], negative: ['mana'] },
                'actionPoints': { positive: ['action points', 'AP'], negative: ['action points', 'AP'] }
            };
            const resource = resourceNames[resourceType] || { positive: [resourceType], negative: [resourceType] };
            const variants = isPositive ? resource.positive : resource.negative;
            const resourceName = variants[Math.floor(Math.random() * variants.length)];

            let message = '';
            if (isPositive) {
                const messages = [
                    `Restored ${absAmount} ${resourceName} to ${characterName}`,
                    `${characterName} regained ${absAmount} ${resourceName}`,
                    `${characterName} recovered ${absAmount} ${resourceName}`,
                    `Replenished ${absAmount} ${resourceName} for ${characterName}`
                ];
                message = messages[Math.floor(Math.random() * messages.length)];
            } else {
                const messages = [
                    `${characterName} lost ${absAmount} ${resourceName}`,
                    `Drained ${absAmount} ${resourceName} from ${characterName}`,
                    `${characterName} expended ${absAmount} ${resourceName}`,
                    `${absAmount} ${resourceName} was drained from ${characterName}`
                ];
                message = messages[Math.floor(Math.random() * messages.length)];
            }

            // For non-health resources, use combat_hit format but with custom message
            addCombatNotification({
                type: 'combat_hit',
                attacker: actorName,
                target: characterName,
                damage: absAmount,
                resourceType: resourceType,
                customMessage: message
            });
        }
    };

    // Handler for resource updates with overheal detection
    const handleResourceUpdate = (resourceType, newValue, maxValue) => {
        // Get current resource values
        const currentResource = dataSource[resourceType] || { current: 0, max: 0 };
        const currentValue = currentResource.current || 0;
        const actualMax = maxValue || currentResource.max || 0;
        
        // Calculate the adjustment amount
        const adjustment = newValue - currentValue;
        
        // Check for overheal (positive adjustment that would exceed max)
        if (adjustment > 0 && newValue > actualMax) {
            const overhealAmount = newValue - actualMax;
            setOverhealData({
                resourceType,
                adjustment,
                overhealAmount,
                currentValue,
                maxValue: actualMax
            });
            setShowOverhealModal(true);
            return; // Don't apply yet, wait for user confirmation
        }
        
        // Normal update (no overheal or negative adjustment)
        // Log the resource change if there's an actual adjustment
        if (adjustment !== 0) {
            const characterName = dataSource.name || name || 'Character';
            logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
        }
        updateResource(resourceType, Math.max(0, Math.min(actualMax, newValue)), actualMax);
    };

    // Apply resource adjustment with optional temporary resource
    const applyResourceAdjustment = (asTemporary = false) => {
        if (!overhealData) return;
        
        const { resourceType, adjustment, currentValue, maxValue } = overhealData;
        const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
        };
        const tempField = tempFieldMap[resourceType];
        const currentTemp = dataSource[tempField] || 0;
        
        // Get character name for logging
        const characterName = dataSource.name || name || 'Character';
        
        if (asTemporary) {
            // Add as temporary resource
            const overhealAmount = (currentValue + adjustment) - maxValue;
            
            // Log the main resource change (up to max)
            const mainAdjustment = maxValue - currentValue;
            if (mainAdjustment > 0) {
                logResourceChange(characterName, resourceType, mainAdjustment, true);
            }
            
            // Set resource to max
            updateResource(resourceType, maxValue, maxValue);
            
            // Update temporary resource
            if (inspectionData) {
                // For inspected characters, update through party store
                const partyState = usePartyStore.getState();
                // Find member by name (inspection context provides name)
                const member = partyState.partyMembers.find(m => m.name === inspectionData.name);
                
                if (member) {
                    usePartyStore.getState().updatePartyMember(member.id, {
                        character: {
                            ...member.character,
                            [tempField]: currentTemp + overhealAmount
                        }
                    });
                } else {
                    // If not found in party, might be current player being inspected
                    // In that case, update character store directly
                    useCharacterStore.getState().updateTempResource(resourceType, currentTemp + overhealAmount);
                }
            } else {
                // Update current player's temporary resource
                useCharacterStore.getState().updateTempResource(resourceType, currentTemp + overhealAmount);
            }
        } else {
            // Just cap at max, don't add temporary
            // Log the resource change
            const mainAdjustment = maxValue - currentValue;
            if (mainAdjustment > 0) {
                logResourceChange(characterName, resourceType, mainAdjustment, true);
            }
            updateResource(resourceType, maxValue, maxValue);
        }
        
        setShowOverhealModal(false);
        setOverhealData(null);
    };

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
                        temp={tempHealth}
                        className="health"
                        label="Health"
                        resourceType="health"
                        onUpdate={handleResourceUpdate}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />
                    <ResourceBar
                        current={mana.current}
                        max={mana.max}
                        temp={tempMana}
                        className="mana"
                        label="Mana"
                        resourceType="mana"
                        onUpdate={handleResourceUpdate}
                        tooltipPosition={tooltipPosition}
                        setTooltipPosition={setTooltipPosition}
                    />
                    <ResourceBar
                        current={actionPoints.current}
                        max={actionPoints.max}
                        temp={tempActionPoints}
                        className="action-points"
                        label="Action Points"
                        resourceType="actionPoints"
                        onUpdate={handleResourceUpdate}
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
                                    onClassResourceUpdate={dataSource.updateClassResource || null}
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
        // Get all passive abilities from racial stat modifiers, path passives, and background passives
        const racialPassives = race && subrace ? getRacialStatModifiers(race, subrace) : [];
        
        // Get background passives (abilities) and features
        let backgroundPassives = [];
        if (background) {
            // Get passive abilities from backgroundAbilities.js
            const backgroundAbilities = getPassiveAbilities(background);
            backgroundPassives = [...backgroundAbilities];
            
            // Get background feature from backgroundData.js
            const backgroundData = getBackgroundData(background);
            if (backgroundData && backgroundData.feature) {
                // Format the feature as a passive ability
                backgroundPassives.push({
                    name: backgroundData.feature.name,
                    description: backgroundData.feature.description,
                    type: 'Passive',
                    usage: 'FEATURE'
                });
            }
        }
        
        const allPassives = [...racialPassives, ...(pathPassives || []), ...backgroundPassives];

        if (allPassives.length === 0) {
            return (
                <div className="passive-summary-container">
                    <div className="passive-summary-empty">
                        <p>No passive abilities available.</p>
                        <p>Select a race, subrace, discipline, or background to see passive abilities here.</p>
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

        const backgroundGroup = backgroundPassives.length > 0 ? {
            name: 'Background Passives',
            passives: backgroundPassives
        } : null;

        const groups = [racialGroup, pathGroup, backgroundGroup].filter(Boolean);

        // Get saving throw modifiers (special modifiers) for race/subrace
        const savingThrowMods = race && subrace ? getRacialSavingThrowModifiers(race, subrace) : null;
        const hasSpecialModifiers = savingThrowMods && (
            (savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0) ||
            (savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0)
        );

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
                                // Use 'abilities' category for all passives (racial, discipline, background) since they're all abilities
                                const iconCategory = 'abilities';

                                return (
                                    <div key={idx} className="passive-summary-item">
                                        <div className="passive-summary-icon-wrapper">
                                            <img
                                                src={getIconUrl(icon, iconCategory)}
                                                alt={name}
                                                className="passive-summary-icon"
                                                onError={(e) => e.target.src = getIconUrl('ui_icon_questionmark', 'ui')}
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
                
                {/* Special Modifiers Section */}
                {hasSpecialModifiers && (
                    <div className="passive-summary-group">
                        <div className="passive-summary-group-header">
                            <h3>Special Modifiers</h3>
                        </div>
                        <div className="passive-summary-list">
                            {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                                <div className="passive-summary-item">
                                    <div className="passive-summary-details">
                                        <div className="passive-summary-name" style={{ color: '#4caf50', fontWeight: 'bold' }}>
                                            Advantage on saves against:
                                        </div>
                                        <div className="passive-summary-description">
                                            {savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                                <div className="passive-summary-item">
                                    <div className="passive-summary-details">
                                        <div className="passive-summary-name" style={{ color: '#f44336', fontWeight: 'bold' }}>
                                            Disadvantage on saves against:
                                        </div>
                                        <div className="passive-summary-description">
                                            {savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
            case 'languages':
                return <Languages />;
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
            icon: getIconUrl('Armor/Head/head-brown-tan-banded-helmet', 'items'),
            info: 'Head'
        },
        neck: {
            position: { top: 50, left: -50 },
            icon: getIconUrl('Armor/Waist/brown-beaded-necklace-belt', 'items'),
            info: 'Neck'
        },
        shoulders: {
            position: { top: 100, left: -50 },
            icon: getIconUrl('Armor/Shoulder/shoulder-pauldron-segmented-brown-tan-cream-layered', 'items'),
            info: 'Shoulders'
        },
        back: {
            position: { top: 150, left: -50 },
            icon: getIconUrl('Armor/Cloak/cloak-autumn-leaf-trim-cape', 'items'),
            info: 'Back'
        },
        chest: {
            position: { top: 200, left: -50 },
            icon: getIconUrl('Armor/Chest/chest-barbarian-leather-tunic', 'items'),
            info: 'Chest'
        },
        shirt: {
            position: { top: 250, left: -50 },
            icon: getIconUrl('Armor/Chest/chest-flowing-sleeve-tunic', 'items'),
            info: 'Shirt'
        },
        tabard: {
            position: { top: 300, left: -50 },
            icon: getIconUrl('Armor/Chest/chest-harlequin-split-tunic', 'items'),
            info: 'Tabard'
        },
        wrists: {
            position: { top: 350, left: -50 },
            icon: getIconUrl('Armor/Wrist/worn-leather-bracer', 'items'),
            info: 'Wrists'
        },
        hands: {
            position: { top: 0, right: -50 },
            icon: getIconUrl('Armor/Hands/hands-orange-cream-banded-glove', 'items'),
            info: 'Hands'
        },
        waist: {
            position: { top: 50, right: -50 },
            icon: getIconUrl('Armor/Chest/chest-belted-brown-robe', 'items'),
            info: 'Waist'
        },
        legs: {
            position: { top: 100, right: -50 },
            icon: getIconUrl('Armor/Leggings/leggings-blood-stained-teal-pants', 'items'),
            info: 'Legs'
        },
        feet: {
            position: { top: 150, right: -50 },
            icon: getIconUrl('Armor/Feet/feet-tan-beige-boots-pair', 'items'),
            info: 'Feet'
        },
        ring1: {
            position: { top: 200, right: -50 },
            icon: getIconUrl('Armor/Finger/finger-ancient-bronze-ring', 'items'),
            info: 'Ring'
        },
        ring2: {
            position: { top: 250, right: -50 },
            icon: getIconUrl('Armor/Finger/finger-ancient-bronze-ring', 'items'),
            info: 'Ring'
        },
        trinket1: {
            position: { top: 300, right: -50 },
            icon: getIconUrl('Armor/Neck/glowing-orb-pendant', 'items'),
            info: 'Trinket'
        },
        trinket2: {
            position: { top: 350, right: -50 },
            icon: getIconUrl('Armor/Neck/fiery-orb-amulet', 'items'),
            info: 'Trinket'
        }
    };

    const weaponSlots = {
        mainHand: {
            icon: getIconUrl('Armor/Neck/magical-sword-pendant', 'items'),
            info: 'Main Hand'
        },
        offHand: {
            icon: getIconUrl('Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss', 'items'),
            info: 'Off Hand'
        },
        ranged: {
            icon: getIconUrl('Weapons/Bows/bow-simple-brown-tan-grip', 'items'),
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
                Object.entries(equipmentBonuses.resistances).forEach(([resistanceType, resistanceData]) => {
                    const resistanceKey = `${resistanceType}Resistance`;
                    // Handle new resistance level system
                    if (resistanceData && typeof resistanceData === 'object' && resistanceData.level !== undefined) {
                        // Store the full resistance data for the new system
                        totalStats[resistanceKey] = resistanceData;
                    } else if (typeof resistanceData === 'number') {
                        // Legacy system: simple numeric value
                        totalStats[resistanceKey] = Math.round((totalStats[resistanceKey] || 0) + resistanceData);
                    }
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
                    src={item ? ((item.imageUrl && !item.imageUrl.includes('wow.zamimg.com')) ? item.imageUrl : (item.iconId ? getIconUrl(item.iconId, 'items', true) : getIconUrl('inv_misc_questionmark', 'items', true))) : slotConfig.icon}
                    alt={slotName}
                    onError={(e) => {
                        e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
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

            <div 
                className={`character-content-area ${
                    activeSection === 'character' ? 'character-backdrop' : 
                    activeSection === 'equipment' ? 'equipment-backdrop' : 
                    activeSection === 'passives' ? 'passives-backdrop' : 
                    activeSection === 'languages' ? 'languages-backdrop' : 
                    activeSection === 'resources' ? 'resources-backdrop' : 
                    ''
                }`}
                style={{
                    ...(activeSection === 'passives' && {
                        backgroundImage: 'url(/assets/Backgrounds/Embers.png)'
                    }),
                    ...(activeSection === 'languages' && {
                        backgroundImage: 'url(/assets/Backgrounds/Temple.png)'
                    }),
                    ...(activeSection === 'resources' && {
                        backgroundImage: 'url(/assets/Backgrounds/Frost.png)'
                    })
                }}
            >
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

            {/* Overheal Confirmation Modal */}
            {showOverhealModal && overhealData && ReactDOM.createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                        margin: 0,
                        padding: 0
                    }}
                    onClick={() => {
                        setShowOverhealModal(false);
                        setOverhealData(null);
                    }}
                >
                    <div
                        className="overheal-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#7a3b2e',
                            minWidth: '350px',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                            Overheal Detected
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>
                            This would restore {overhealData.adjustment} {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'}, 
                            but the current value is {overhealData.currentValue}/{overhealData.maxValue}.
                            <br />
                            <strong>{overhealData.overhealAmount}</strong> would exceed the maximum.
                        </p>
                        <p style={{ margin: '0 0 20px 0', fontSize: '13px', fontStyle: 'italic' }}>
                            Would you like to add the excess as temporary {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'}?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => applyResourceAdjustment(true)}
                            >
                                Add as Temporary
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => applyResourceAdjustment(false)}
                            >
                                Cap at Maximum
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#e8dcc0',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => {
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}