import React, { useState, useRef, useEffect } from 'react';
import useInventoryStore from '../../store/inventoryStore';
import useBuffStore from '../../store/buffStore';
import useCharacterStore from '../../store/characterStore';
import useCombatStore from '../../store/combatStore';
import { RARITY_COLORS } from '../../constants/itemConstants';
import TooltipPortal from '../tooltips/TooltipPortal';
import ItemTooltip from '../item-generation/ItemTooltip';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import { useSpellLibrary } from '../spellcrafting-wizard/context/SpellLibraryContext';
import { useActionBarPersistence } from '../../hooks/useActionBarPersistence';
import { useRoomContext } from '../../contexts/RoomContext';
import HotkeyAssignmentPopup from './HotkeyAssignmentPopup';
import actionBarPersistenceService from '../../services/actionBarPersistenceService';
import ExperienceBar from './ExperienceBar';
import './ActionBar.css';

const ActionBar = () => {
    // Get current room context for persistence
    const { currentRoomId } = useRoomContext();

    // Use the persistence hook instead of local state
    const {
        actionSlots,
        isLoading,
        updateSlot,
        clearSlot,
        updateActionSlots
    } = useActionBarPersistence(currentRoomId);

    const [draggedSpell, setDraggedSpell] = useState(null);
    const dragOverSlot = useRef(null);
    const actionBarContainerRef = useRef(null);

    // Tooltip state for consumables
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipItem, setTooltipItem] = useState(null);

    // Spell tooltip state
    const [showSpellTooltip, setShowSpellTooltip] = useState(false);
    const [spellTooltipPosition, setSpellTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipSpell, setTooltipSpell] = useState(null);
    const spellHoverTimeoutRef = useRef(null);
    const spellHideTimeoutRef = useRef(null);

    // Hotkey assignment state
    const [showHotkeyPopup, setShowHotkeyPopup] = useState(false);
    const [hotkeySlotIndex, setHotkeySlotIndex] = useState(null);
    const [hotkeys, setHotkeys] = useState({});

    // Get spell library for spell tooltips (hooks must be called unconditionally)
    const spellLibrary = useSpellLibrary();

    // Get inventory items to track quantities
    const inventoryItems = useInventoryStore(state => state.items);
    const removeItem = useInventoryStore(state => state.removeItem);

    // Get buff store functions
    const addBuff = useBuffStore(state => state.addBuff);

    // Get character store functions for applying effects
    const updateResource = useCharacterStore(state => state.updateResource);
    const health = useCharacterStore(state => state.health);
    const mana = useCharacterStore(state => state.mana);
    const experience = useCharacterStore(state => state.experience || 0);

    // Get combat store for turn restrictions
    const { isInCombat, getCurrentCombatant } = useCombatStore();
    const currentCharacterId = useCharacterStore(state => state.currentCharacterId);

    // Load hotkeys on mount and when character/room changes
    useEffect(() => {
        if (currentCharacterId) {
            const loadedHotkeys = actionBarPersistenceService.loadHotkeys(currentCharacterId, currentRoomId);
            if (loadedHotkeys) {
                setHotkeys(loadedHotkeys);
            } else {
                // Set default hotkeys (1-9, 0)
                const defaultHotkeys = {};
                for (let i = 0; i < 10; i++) {
                    defaultHotkeys[i] = i === 9 ? '0' : `${i + 1}`;
                }
                setHotkeys(defaultHotkeys);
            }
        }
    }, [currentCharacterId, currentRoomId]);

    // Keyboard event listener for hotkey activation
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't handle if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            // Don't handle if hotkey popup is open
            if (showHotkeyPopup) {
                return;
            }

            // Build the pressed key combination
            let pressedKey = '';
            if (e.ctrlKey) pressedKey += 'Ctrl+';
            if (e.altKey) pressedKey += 'Alt+';
            if (e.shiftKey) pressedKey += 'Shift+';

            let keyName = e.key.toUpperCase();
            if (e.key === ' ') keyName = 'Space';
            else if (e.key.length === 1) keyName = e.key.toUpperCase();
            else keyName = e.key;

            pressedKey += keyName;

            // Find the slot with this hotkey
            const slotIndex = Object.keys(hotkeys).find(index => hotkeys[index] === pressedKey);

            if (slotIndex !== undefined) {
                e.preventDefault();
                handleSlotClick(parseInt(slotIndex));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hotkeys, showHotkeyPopup, actionSlots]);

    // Helper function to get current quantity of a consumable item
    const getItemQuantity = (itemId) => {
        const item = inventoryItems.find(invItem =>
            invItem.originalItemId === itemId || invItem.id === itemId
        );
        return item ? (item.quantity || 1) : 0;
    };

    // Helper function to apply consumable effects
    const applyConsumableEffects = (item) => {
        // Get the full item data from inventory to access combat stats
        const inventoryItem = inventoryItems.find(invItem =>
            invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
        );

        if (!inventoryItem) return;

        const combatStats = inventoryItem.combatStats || {};
        const effects = {};
        let hasInstantEffects = false;
        let hasBuffEffects = false;

        // Apply instant healing effects
        if (combatStats.healthRestore) {
            const healAmount = combatStats.healthRestore.value || 0;
            if (healAmount > 0) {
                // Add to current health instead of setting absolute value
                const newHealthValue = Math.min(health.max, health.current + healAmount);
                updateResource('health', newHealthValue, health.max);
                hasInstantEffects = true;
            }
        }

        // Apply instant mana restoration
        if (combatStats.manaRestore) {
            const manaAmount = combatStats.manaRestore.value || 0;
            if (manaAmount > 0) {
                // Add to current mana instead of setting absolute value
                const newManaValue = Math.min(mana.max, mana.current + manaAmount);
                updateResource('mana', newManaValue, mana.max);
                hasInstantEffects = true;
            }
        }

        // Collect stat buff effects from combatStats
        ['strength', 'agility', 'intelligence', 'constitution', 'spirit', 'charisma'].forEach(stat => {
            if (combatStats[stat] && combatStats[stat].value > 0) {
                effects[stat] = combatStats[stat].value;
                hasBuffEffects = true;
            }
        });

        // Also check baseStats for buff effects (this is where elixirs store their stat bonuses)
        const baseStats = inventoryItem.baseStats || {};
        Object.keys(baseStats).forEach(statName => {
            const statData = baseStats[statName];
            if (statData && (typeof statData === 'object' ? statData.value > 0 : statData > 0)) {
                const value = typeof statData === 'object' ? statData.value : statData;
                effects[statName] = value;
                hasBuffEffects = true;
                console.log(`Adding buff effect from baseStats: ${statName} +${value}`);
            }
        });

        // Apply buff effects if any exist
        if (hasBuffEffects) {
            addBuff({
                name: inventoryItem.name,
                icon: `https://wow.zamimg.com/images/wow/icons/large/${inventoryItem.iconId}.jpg`,
                description: inventoryItem.description || `Temporary enhancement from ${inventoryItem.name}`,
                effects: effects,
                duration: 180, // 3 minutes (3 rounds)
                source: 'consumable',
                stackable: false
            });
        }

        return { hasInstantEffects, hasBuffEffects };
    };

    const handleDragOver = (e, slotIndex) => {
        e.preventDefault();
        dragOverSlot.current = slotIndex;
    };

    const handleDragLeave = (e) => {
        // Only clear if we're actually leaving the slot area
        if (!e.currentTarget.contains(e.relatedTarget)) {
            dragOverSlot.current = null;
        }
    };

    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        console.log('Drop event triggered on slot:', slotIndex);

        try {
            // Try to get spell data from drag event
            const spellData = e.dataTransfer.getData('application/json');
            console.log('Spell data received:', spellData);

            if (spellData) {
                const spell = JSON.parse(spellData);
                console.log('Parsed spell:', spell);

                // Update the action slot with the complete spell data
                const newSpellSlot = {
                    // Store complete spell data for rich tooltip display
                    ...spell,
                    // Ensure action bar specific fields are set correctly
                    cooldown: 0, // Current cooldown (starts at 0)
                    maxCooldown: spell.cooldown || 0, // Max cooldown from spell definition
                    type: 'spell' // Ensure action bar identifies this as a spell
                };
                console.log('Setting new spell slot with complete data:', newSpellSlot);
                console.log('Icon URL will be:', getSlotIcon(newSpellSlot));
                updateSlot(slotIndex, newSpellSlot);
                dragOverSlot.current = null;
                return;
            }

            // Try to get inventory item data
            const itemData = e.dataTransfer.getData('text/plain');
            if (itemData) {
                const data = JSON.parse(itemData);

                // Check if it's an inventory item and if it's consumable
                if (data.type === 'inventory-item' && data.item && data.item.type === 'consumable') {
                    const item = data.item;

                    // Update the action slot with the consumable item
                    const newConsumableSlot = {
                        id: item.id,
                        name: item.name,
                        icon: item.iconId || 'inv_potion_51',
                        cooldown: 0,
                        maxCooldown: 0,
                        type: 'consumable',
                        originalItemId: item.originalItemId || item.id,
                        quality: item.quality || item.rarity || 'common',
                        rarity: item.rarity || item.quality || 'common'
                    };
                    updateSlot(slotIndex, newConsumableSlot);
                }
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }

        dragOverSlot.current = null;
    };

    const handleSlotClick = (slotIndex) => {
        const item = actionSlots[slotIndex];
        if (!item || item.cooldown > 0) return;

        // Check combat restrictions
        if (isInCombat) {
            const currentCombatant = getCurrentCombatant();
            // For now, we'll check if the current character is the active combatant
            // This might need adjustment based on how character IDs are handled
            if (!currentCombatant || currentCombatant.name !== useCharacterStore.getState().name) {
                console.log('Cannot use action - not your turn in combat');
                return;
            }
        }

        if (item.type === 'spell') {
            // Cast the spell
            console.log('Casting spell:', item.name);

            // Start cooldown if applicable
            if (item.maxCooldown > 0) {
                const itemWithCooldown = { ...item, cooldown: item.maxCooldown };
                updateSlot(slotIndex, itemWithCooldown);

                // Countdown timer
                const timer = setInterval(() => {
                    updateActionSlots(currentSlots => {
                        const updatedSlots = [...currentSlots];
                        if (updatedSlots[slotIndex] && updatedSlots[slotIndex].cooldown > 0) {
                            updatedSlots[slotIndex] = {
                                ...updatedSlots[slotIndex],
                                cooldown: updatedSlots[slotIndex].cooldown - 1
                            };

                            if (updatedSlots[slotIndex].cooldown === 0) {
                                clearInterval(timer);
                            }
                        }
                        return updatedSlots;
                    });
                }, 1000);
            }
        } else if (item.type === 'consumable') {
            // Use the consumable item
            const currentQuantity = getItemQuantity(item.originalItemId);

            if (currentQuantity > 0) {
                console.log('Using consumable:', item.name);

                // Apply consumable effects
                const effectResults = applyConsumableEffects(item);

                // Remove one item from inventory
                const inventoryItem = inventoryItems.find(invItem =>
                    invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
                );

                if (inventoryItem) {
                    removeItem(inventoryItem.id, 1);
                }

                // Log effect application
                if (effectResults) {
                    if (effectResults.hasInstantEffects) {
                        console.log(`Applied instant effects from ${item.name}`);
                    }
                    if (effectResults.hasBuffEffects) {
                        console.log(`Applied buff effects from ${item.name}`);
                    }
                }
            }
        }
    };

    const handleRightClick = (e, slotIndex) => {
        e.preventDefault();

        // Open hotkey assignment popup
        setHotkeySlotIndex(slotIndex);
        setShowHotkeyPopup(true);
    };

    const handleHotkeyAssign = (newHotkey) => {
        if (hotkeySlotIndex === null) return;

        // Update hotkeys state
        const updatedHotkeys = { ...hotkeys, [hotkeySlotIndex]: newHotkey };
        setHotkeys(updatedHotkeys);

        // Save to localStorage
        if (currentCharacterId) {
            actionBarPersistenceService.saveHotkeys(currentCharacterId, currentRoomId, updatedHotkeys);
        }

        // Close popup
        setShowHotkeyPopup(false);
        setHotkeySlotIndex(null);
    };

    const handleHotkeyPopupClose = () => {
        setShowHotkeyPopup(false);
        setHotkeySlotIndex(null);
    };

    const getSlotIcon = (item) => {
        if (!item) return null;

        // Handle different icon formats for spells vs consumables
        if (item.type === 'consumable') {
            // Use WoW icon URL for consumables
            return `https://wow.zamimg.com/images/wow/icons/large/${item.icon}.jpg`;
        } else {
            // Use WoW icon URL for spells as well
            return `https://wow.zamimg.com/images/wow/icons/large/${item.icon}.jpg`;
        }
    };

    // Helper function to get rarity border color for consumables
    const getRarityBorderColor = (item) => {
        if (!item || item.type !== 'consumable') return null;

        const quality = item.quality || item.rarity || 'common';
        const qualityLower = quality.toLowerCase();
        return RARITY_COLORS[qualityLower]?.border || RARITY_COLORS.common.border;
    };

    // Enhanced tooltip handlers for consumables with bottom-aligned positioning
    const calculateConsumableTooltipPosition = (e, item) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Tooltip dimensions (based on CSS)
        const tooltipWidth = 300; // max-width from CSS
        const baseTooltipHeight = 200; // Base height estimate

        // Estimate tooltip height based on item content
        let estimatedHeight = baseTooltipHeight;
        if (item) {
            // Add height for various item properties
            if (item.description) estimatedHeight += 40;
            if (item.baseStats && Object.keys(item.baseStats).length > 0) {
                estimatedHeight += Object.keys(item.baseStats).length * 20;
            }
            if (item.type === 'consumable' && item.effects) {
                estimatedHeight += 60; // For consumable effects section
            }
            if (item.requirements) estimatedHeight += 30;
            if (item.value) estimatedHeight += 20;

            // Cap the estimated height to reasonable bounds
            estimatedHeight = Math.min(estimatedHeight, 500);
            estimatedHeight = Math.max(estimatedHeight, 150);
        }

        // Calculate initial position with tooltip bottom at mouse cursor
        let x = mouseX + 15;
        let y = mouseY - estimatedHeight;

        // Check if we're near the bottom of the screen (action bar area)
        const isNearBottom = mouseY > viewportHeight - 150; // 150px from bottom

        if (isNearBottom) {
            // Position tooltip so its bottom aligns with mouse cursor
            y = mouseY - estimatedHeight;
        } else {
            // Use standard positioning for other areas
            y = mouseY - 10;
        }

        // Adjust horizontal position if tooltip would go off screen
        if (x + tooltipWidth > viewportWidth - 20) {
            x = mouseX - tooltipWidth - 15; // Position to the left of cursor
        }

        // Ensure tooltip doesn't go off the left edge
        if (x < 20) {
            x = 20;
        }

        // Ensure tooltip doesn't go off the top
        if (y < 20) {
            y = 20;
        }

        // Final check: if tooltip would still go off bottom, position it above cursor
        if (y + estimatedHeight > viewportHeight - 20) {
            y = mouseY - estimatedHeight - 10;
        }

        return { x, y };
    };

    const handleConsumableMouseEnter = (e, item) => {
        if (!item || item.type !== 'consumable') return;

        // Get the full item data from inventory
        const inventoryItem = inventoryItems.find(invItem =>
            invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
        );

        if (inventoryItem) {
            setTooltipItem(inventoryItem);
            const position = calculateConsumableTooltipPosition(e, inventoryItem);
            setTooltipPosition(position);
            setShowTooltip(true);
        }
    };

    const handleConsumableMouseMove = (e, item) => {
        if (showTooltip && item && item.type === 'consumable') {
            // Get the full item data for accurate positioning
            const inventoryItem = inventoryItems.find(invItem =>
                invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
            );

            if (inventoryItem) {
                const position = calculateConsumableTooltipPosition(e, inventoryItem);
                setTooltipPosition(position);
            }
        }
    };

    const handleConsumableMouseLeave = () => {
        setShowTooltip(false);
        setTooltipItem(null);
    };

    // Spell tooltip handlers
    const handleSpellMouseEnter = (e, item) => {
        console.log('Action bar spell hover:', item); // Debug log
        if (!item || item.type !== 'spell' || !spellLibrary) {
            console.log('Spell hover failed:', { item, hasLibrary: !!spellLibrary }); // Debug log
            return;
        }

        // Clear any existing timeouts
        if (spellHoverTimeoutRef.current) {
            clearTimeout(spellHoverTimeoutRef.current);
        }
        if (spellHideTimeoutRef.current) {
            clearTimeout(spellHideTimeoutRef.current);
            spellHideTimeoutRef.current = null;
        }

        // Try to find the spell in the library first for the most up-to-date data
        const librarySpell = spellLibrary?.spells?.find(s => s.id === item.id);
        console.log('Found spell in library:', librarySpell); // Debug log

        // Use library spell if found, otherwise use the complete spell data stored in the action slot
        const spellToDisplay = librarySpell || item;
        console.log('Using spell data for tooltip:', spellToDisplay); // Debug log

        // Ensure we have valid spell data
        if (!spellToDisplay || !spellToDisplay.id) {
            console.log('No valid spell data available for tooltip');
            return;
        }

        // Store the element reference to avoid null reference errors
        const targetElement = e.currentTarget;
        if (!targetElement) return;

        // Set hover timeout
        spellHoverTimeoutRef.current = setTimeout(() => {
            // Check if element still exists
            if (!targetElement || !document.contains(targetElement)) return;

            // Get the action slot element's position for better tooltip placement
            const rect = targetElement.getBoundingClientRect();

            // Anchor point: center-top of the slot. SpellTooltip will translate above.
            const tooltipX = rect.left + (rect.width / 2);
            const tooltipY = rect.top; // exact top edge; SpellTooltip handles offset

            console.log('Action bar spell tooltip positioning:', {
              x: tooltipX,
              y: tooltipY,
              slotRect: rect,
              spellName: spellToDisplay?.name,
              actionBarFixed: true,
              hasLibrarySpell: !!librarySpell,
              usingStoredData: !librarySpell
            }); // Debug log
            setSpellTooltipPosition({ x: tooltipX, y: tooltipY });
            setTooltipSpell(spellToDisplay);
            setShowSpellTooltip(true);
        }, 300); // 300ms delay before showing tooltip
    };

    const handleSpellMouseLeave = () => {
        // Clear hover timeout
        if (spellHoverTimeoutRef.current) {
            clearTimeout(spellHoverTimeoutRef.current);
            spellHoverTimeoutRef.current = null;
        }

        // Hide tooltip immediately when leaving the spell
        spellHideTimeoutRef.current = setTimeout(() => {
            setShowSpellTooltip(false);
            setTooltipSpell(null);
        }, 50); // Very short delay to allow moving to tooltip
    };

    const handleSpellTooltipMouseEnter = () => {
        // Keep tooltip visible when hovering over it
        if (spellHideTimeoutRef.current) {
            clearTimeout(spellHideTimeoutRef.current);
            spellHideTimeoutRef.current = null;
        }
    };

    const handleSpellTooltipMouseLeave = () => {
        // Hide tooltip immediately when leaving the tooltip
        setShowSpellTooltip(false);
        setTooltipSpell(null);
    };

    return (
        <>
            <div className="action-bar-container" ref={actionBarContainerRef}>
                <div className="action-bar">
                {actionSlots.map((item, index) => {
                    const isConsumable = item && item.type === 'consumable';
                    const quantity = isConsumable ? getItemQuantity(item.originalItemId) : 0;
                    const isOutOfStock = isConsumable && quantity === 0;
                    const rarityBorderColor = getRarityBorderColor(item);

                    // Check if action is restricted due to combat
                    const isRestricted = isInCombat && item && (() => {
                        const currentCombatant = getCurrentCombatant();
                        return !currentCombatant || currentCombatant.name !== useCharacterStore.getState().name;
                    })();

                    return (
                        <div
                            key={index}
                            className={`action-slot ${item ? 'filled' : 'empty'} ${
                                item && item.cooldown > 0 ? 'on-cooldown' : ''
                            } ${isOutOfStock ? 'out-of-stock' : ''} ${
                                isRestricted ? 'combat-restricted' : ''
                            } ${
                                dragOverSlot.current === index ? 'drag-over' : ''
                            }`}
                            style={{
                                ...(rarityBorderColor ? { borderColor: rarityBorderColor } : {}),
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onClick={() => handleSlotClick(index)}
                            onContextMenu={(e) => handleRightClick(e, index)}
                            onMouseEnter={(e) => {
                                if (item && item.type === 'consumable') {
                                    handleConsumableMouseEnter(e, item);
                                } else if (item && item.type === 'spell') {
                                    handleSpellMouseEnter(e, item);
                                }
                            }}
                            onMouseMove={(e) => {
                                if (item && item.type === 'consumable') {
                                    handleConsumableMouseMove(e, item);
                                }
                            }}
                            onMouseLeave={() => {
                                if (item && item.type === 'consumable') {
                                    handleConsumableMouseLeave();
                                } else if (item && item.type === 'spell') {
                                    handleSpellMouseLeave();
                                }
                            }}
                        >
                            {item && (
                                <>
                                    <div className="action-bar-icon">
                                        <img
                                            src={getSlotIcon(item)}
                                            alt={item.name || 'Action Item'}
                                            onLoad={() => console.log('Icon loaded:', getSlotIcon(item))}
                                            onError={(e) => {
                                                console.log('Icon failed to load:', getSlotIcon(item));
                                                // Fallback to a default icon if the icon fails to load
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg';
                                            }}
                                        />
                                </div>

                                {/* Cooldown overlay for spells */}
                                {item.cooldown > 0 && (
                                    <div className="cooldown-overlay">
                                        <div className="cooldown-text">{item.cooldown}</div>
                                    </div>
                                )}

                                {/* Quantity display for consumables */}
                                {isConsumable && (
                                    <div className="quantity-display">
                                        {quantity}
                                    </div>
                                )}
                            </>
                        )}
                        <div className="slot-number">{hotkeys[index] || (index + 1)}</div>
                    </div>
                    );
                })}
            </div>

            {/* Hotkey Assignment Popup */}
            {showHotkeyPopup && hotkeySlotIndex !== null && (
                <HotkeyAssignmentPopup
                    slotIndex={hotkeySlotIndex}
                    currentHotkey={hotkeys[hotkeySlotIndex]}
                    onAssign={handleHotkeyAssign}
                    onClose={handleHotkeyPopupClose}
                    actionBarRef={actionBarContainerRef}
                />
            )}

            {/* Consumable Tooltip */}
            {showTooltip && tooltipItem && (
                <TooltipPortal>
                    <div
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        <ItemTooltip item={tooltipItem} />
                    </div>
                </TooltipPortal>
            )}

            {/* Spell Tooltip */}
            {showSpellTooltip && tooltipSpell && (
                <SpellTooltip
                    spell={tooltipSpell}
                    position={spellTooltipPosition}
                    onMouseEnter={handleSpellTooltipMouseEnter}
                    onMouseLeave={handleSpellTooltipMouseLeave}
                    smartPositioning={true} // Enable smart positioning for action bar tooltips
                />
            )}
            </div>

            {/* Experience Bar - Below Action Bar */}
            <ExperienceBar currentXP={experience} />
        </>
    );
};

export default ActionBar;
