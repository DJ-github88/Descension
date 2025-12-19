import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import SpellCastConfirmation from './SpellCastConfirmation';
import CooldownAdjustmentMenu from './CooldownAdjustmentMenu';
import actionBarPersistenceService from '../../services/actionBarPersistenceService';
import ExperienceBar from './ExperienceBar';
import './ActionBar.css';

const ActionBar = () => {
    // Get current room context for persistence
    const { currentRoomId } = useRoomContext();

    // Use the persistence hook instead of local state
    const {
        actionSlots,
        updateSlot,
        clearSlot,
        updateActionSlots
    } = useActionBarPersistence(currentRoomId);
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

    // Spell cast confirmation state
    const [showSpellConfirmation, setShowSpellConfirmation] = useState(false);
    const [spellToCast, setSpellToCast] = useState(null);
    const [spellSlotIndex, setSpellSlotIndex] = useState(null);

    // Cooldown adjustment menu state
    const [showCooldownMenu, setShowCooldownMenu] = useState(false);
    const [cooldownMenuSlotIndex, setCooldownMenuSlotIndex] = useState(null);

    // Get spell library for spell tooltips (hooks must be called unconditionally)
    const spellLibrary = useSpellLibrary();

    // Get inventory items to track quantities
    const inventoryItems = useInventoryStore(state => state.items);
    const removeItem = useInventoryStore(state => state.removeItem);

    // Get buff store functions
    const addBuff = useBuffStore(state => state.addBuff);

    // Get character store functions for applying effects
    const updateResource = useCharacterStore(state => state.updateResource);
    const gainClassResource = useCharacterStore(state => state.gainClassResource);
    const consumeClassResource = useCharacterStore(state => state.consumeClassResource);
    const health = useCharacterStore(state => state.health);
    const mana = useCharacterStore(state => state.mana);
    const experience = useCharacterStore(state => state.experience || 0);

    // Get combat store for turn restrictions and cooldown progression
    const { isInCombat, getCurrentCombatant, round, currentTurnIndex, turnOrder } = useCombatStore();
    const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
    
    // Track cooldown timers and types
    const cooldownTimersRef = useRef({});
    const cooldownTypesRef = useRef({});
    const lastProcessedRoundRef = useRef(0);
    const lastProcessedTurnRef = useRef(-1);

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

    // Handle turn-based cooldown progression in combat
    useEffect(() => {
        if (!isInCombat || !turnOrder || turnOrder.length === 0) {
            // Outside combat: time-based cooldowns still progress via their timers
            // Turn-based cooldowns pause (don't decrement)
            lastProcessedTurnRef.current = -1;
            return;
        }
        
        // Check if it's a new turn (track by round + turn index combination)
        const turnKey = `${round}-${currentTurnIndex}`;
        const lastTurnKey = `${lastProcessedRoundRef.current}-${lastProcessedTurnRef.current}`;
        const isNewTurn = turnKey !== lastTurnKey;
        
        // Process turn-based cooldowns when it's a new turn
        if (isNewTurn) {
            lastProcessedRoundRef.current = round;
            lastProcessedTurnRef.current = currentTurnIndex;
            
            updateActionSlots(currentSlots => {
                const updatedSlots = [...currentSlots];
                let hasChanges = false;
                
                currentSlots.forEach((item, index) => {
                    if (item && item.type === 'spell' && item.cooldown > 0 && item.cooldownType === 'turn_based') {
                        // Decrement turn-based cooldown on each turn (any combatant's turn)
                        const newCooldown = Math.max(0, item.cooldown - 1);
                        if (newCooldown !== item.cooldown) {
                            updatedSlots[index] = {
                                ...item,
                                cooldown: newCooldown
                            };
                            hasChanges = true;
                        }
                    }
                });
                
                return hasChanges ? updatedSlots : currentSlots;
            });
        }
    }, [round, isInCombat, currentTurnIndex, turnOrder, updateActionSlots]);

    // Cleanup timers on unmount
    useEffect(() => {
        const timers = cooldownTimersRef.current;
        return () => {
            Object.values(timers).forEach(timer => {
                if (timer) clearInterval(timer);
            });
        };
    }, []);

    // Helper function to get current quantity of a consumable item
    const getItemQuantity = useCallback((itemId) => {
        const item = inventoryItems.find(invItem =>
            invItem.originalItemId === itemId || invItem.id === itemId
        );
        return item ? (item.quantity || 1) : 0;
    }, [inventoryItems]);

    // Helper function to apply consumable effects
    const applyConsumableEffects = useCallback((item) => {
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
    }, [inventoryItems, health, mana, updateResource, addBuff]);

    const handleSlotClick = useCallback((slotIndex, e) => {
        const item = actionSlots[slotIndex];
        if (!item) return;
        
        // If spell is on cooldown and user left-clicks, show cooldown menu instead of casting
        if (item.type === 'spell' && item.cooldown > 0 && (!e || e.button === 0)) {
            setCooldownMenuSlotIndex(slotIndex);
            setShowCooldownMenu(true);
            return;
        }
        
        // Don't allow casting if on cooldown
        if (item.cooldown > 0) return;

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
            // Try to find the spell in the library first for the most up-to-date data
            const librarySpell = spellLibrary?.spells?.find(s => s.id === item.id);
            const spellToDisplay = librarySpell || item;

            // Show confirmation popup
            setSpellToCast(spellToDisplay);
            setSpellSlotIndex(slotIndex);
            setShowSpellConfirmation(true);
        } else if (item.type === 'consumable') {
            // Use the consumable item
            const currentQuantity = getItemQuantity(item.originalItemId);

            if (currentQuantity > 0) {
                // Apply consumable effects
                applyConsumableEffects(item);

                // Remove one item from inventory
                const inventoryItem = inventoryItems.find(invItem =>
                    invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
                );

                if (inventoryItem) {
                    removeItem(inventoryItem.id, 1);
                }

                // Log effect application
                // Effects applied (instant and buff effects handled internally)
            }
        }
    }, [actionSlots, isInCombat, getCurrentCombatant, spellLibrary, getItemQuantity, applyConsumableEffects, inventoryItems, removeItem]);

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
    }, [hotkeys, showHotkeyPopup, handleSlotClick]);

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

        try {
            // Try to get spell data from drag event
            const spellData = e.dataTransfer.getData('application/json');

            if (spellData) {
                const spell = JSON.parse(spellData);

                // Extract cooldown from cooldownConfig
                const cooldownConfig = spell.cooldownConfig || {};
                const cooldownValue = cooldownConfig.value || 0;
                const cooldownType = cooldownConfig.type || 'none';
                
                // Update the action slot with the complete spell data
                const newSpellSlot = {
                    // Store complete spell data for rich tooltip display
                    ...spell,
                    // Ensure action bar specific fields are set correctly
                    cooldown: 0, // Current cooldown (starts at 0)
                    maxCooldown: cooldownValue, // Max cooldown from cooldownConfig
                    cooldownType: cooldownType !== 'none' ? cooldownType : undefined, // Store cooldown type
                    type: 'spell' // Ensure action bar identifies this as a spell
                };
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

    const handleRightClick = (e, slotIndex) => {
        e.preventDefault();

        const item = actionSlots[slotIndex];
        
        // Shift + Right Click = Open hotkey assignment popup
        if (e.shiftKey) {
            setHotkeySlotIndex(slotIndex);
            setShowHotkeyPopup(true);
        } else if (item && item.type === 'spell') {
            // Check if spell has cooldown configuration
            const hasCooldown = item.cooldown > 0 || 
                               item.maxCooldown > 0 || 
                               (item.cooldownConfig && item.cooldownConfig.type !== 'none' && item.cooldownConfig.value > 0);
            
            if (hasCooldown) {
                // Right Click on spell with cooldown = Open cooldown adjustment menu
                setCooldownMenuSlotIndex(slotIndex);
                setShowCooldownMenu(true);
            } else {
                // Regular Right Click = Remove spell/consumable from action bar
                clearSlot(slotIndex);
            }
        } else {
            // Regular Right Click = Remove spell/consumable from action bar
            clearSlot(slotIndex);
        }
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
        if (!item || item.type !== 'spell' || !spellLibrary) {
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

        // Use library spell if found, otherwise use the complete spell data stored in the action slot
        const spellToDisplay = librarySpell || item;

        // Ensure we have valid spell data
        if (!spellToDisplay || !spellToDisplay.id) {
            return;
        }

        // Store the element reference to avoid null reference errors
        const targetElement = e.currentTarget;
        if (!targetElement) return;

        // Store the current mouse position for initial tooltip placement
        const currentMouseX = e.clientX;
        const currentMouseY = e.clientY;

        // Set hover timeout
        spellHoverTimeoutRef.current = setTimeout(() => {
            // Check if element still exists
            if (!targetElement || !document.contains(targetElement)) return;

            // Use mouse position for tooltip placement - this follows the cursor
            // Position tooltip above the mouse cursor
            const tooltipX = currentMouseX;
            const tooltipY = currentMouseY; // Use cursor Y directly, transform will position above

            setSpellTooltipPosition({ x: tooltipX, y: tooltipY });
            setTooltipSpell(spellToDisplay);
            setShowSpellTooltip(true);
        }, 300); // 300ms delay before showing tooltip
    };

    const handleSpellMouseMove = (e, item) => {
        if (!item || item.type !== 'spell') return;

        // Update tooltip position to follow the mouse cursor
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Position tooltip relative to mouse cursor
        const tooltipX = mouseX;
        const tooltipY = mouseY; // Use cursor Y directly, transform will position above

        // Update position whether tooltip is showing or not (for smooth appearance at current position)
        setSpellTooltipPosition({ x: tooltipX, y: tooltipY });
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

    // Handle confirmed spell cast
    const handleSpellCastConfirm = () => {
        if (!spellToCast || spellSlotIndex === null) {
            setShowSpellConfirmation(false);
            setSpellToCast(null);
            setSpellSlotIndex(null);
            return;
        }

        const item = actionSlots[spellSlotIndex];
        if (!item) {
            setShowSpellConfirmation(false);
            setSpellToCast(null);
            setSpellSlotIndex(null);
            return;
        }

        // Extract resource costs
        const resourceCost = spellToCast.resourceCost || {};
        const resourceValues = resourceCost.resourceValues || {};
        const manaCost = resourceValues.mana || resourceCost.mana || 0;
        const apCost = resourceCost.actionPoints || 0;
        
        // Extract class resource changes
        // IMPORTANT: inferno_ascend is a GAIN, not a requirement - it should NOT block casting
        // Only inferno_required should block casting
        const infernoAscend = resourceValues.inferno_ascend || spellToCast.infernoAscend || 0;
        const infernoDescend = resourceValues.inferno_descend || spellToCast.infernoDescend || 0;
        
        // CRITICAL: If a spell has inferno_ascend (gain), it means you're GAINING inferno
        // Therefore, you should NOT need inferno to cast it - ignore inferno_required in this case
        // This handles incorrectly configured spell data where both are set
        let infernoRequired = 0;
        if (infernoAscend === 0) {
            // Only check inferno_required if there's no inferno_ascend (gain)
            // If you're gaining inferno, you don't need it to cast
            infernoRequired = resourceValues.inferno_required || spellToCast.infernoRequired || 0;
        }
        // If infernoAscend > 0, infernoRequired stays 0 (spell gains inferno, doesn't require it)

        // Get fresh resource state
        const currentMana = useCharacterStore.getState().mana;
        const currentAP = useCharacterStore.getState().actionPoints;
        const currentClassResource = useCharacterStore.getState().classResource;

        // Check if player has enough resources (validation is now done in the popup, but double-check here)
        // Note: infernoAscend is NOT checked - it's a gain, not a requirement
        if (manaCost > 0 && currentMana.current < manaCost) {
            console.log('Not enough mana to cast spell');
            // Don't close popup - let it show the error
            return;
        }

        if (apCost > 0 && currentAP.current < apCost) {
            console.log('Not enough action points to cast spell');
            // Don't close popup - let it show the error
            return;
        }

        // Only check inferno_required - inferno_ascend does NOT block casting
        if (infernoRequired > 0 && (!currentClassResource || currentClassResource.current < infernoRequired)) {
            console.log('Not enough Inferno required to cast spell');
            // Don't close popup - let it show the error
            return;
        }

        // Apply resource costs - use updateResource with proper parameters
        if (manaCost > 0) {
            const newMana = Math.max(0, currentMana.current - manaCost);
            console.log('Casting spell - Mana:', { before: currentMana.current, cost: manaCost, after: newMana });
            
            // Use updateResource - pass undefined for max to keep it unchanged
            updateResource('mana', newMana, undefined);
            
            // Sync to party store for HUD updates
            try {
                const usePartyStore = require('../../store/partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            mana: {
                                current: newMana,
                                max: currentMana.max
                            }
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to sync mana to party store:', error);
            }
        }

        if (apCost > 0) {
            const newAP = Math.max(0, currentAP.current - apCost);
            console.log('Casting spell - AP:', { before: currentAP.current, cost: apCost, after: newAP });
            
            // Use updateResource - pass undefined for max to keep it unchanged
            updateResource('actionPoints', newAP, undefined);
            
            // Sync to party store for HUD updates
            try {
                const usePartyStore = require('../../store/partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            actionPoints: {
                                current: newAP,
                                max: currentAP.max
                            }
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to sync AP to party store:', error);
            }
        }

        // Apply class resource changes (Inferno)
        if (infernoAscend > 0 && currentClassResource) {
            const beforeInferno = currentClassResource.current;
            gainClassResource(infernoAscend);
            const afterInferno = Math.min(currentClassResource.max, beforeInferno + infernoAscend);
            console.log('Casting spell - Inferno Ascend:', { before: beforeInferno, gain: infernoAscend, after: afterInferno });
            
            // Sync to party store for HUD updates
            try {
                const usePartyStore = require('../../store/partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember && currentMember.character?.classResource) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            classResource: {
                                ...currentMember.character.classResource,
                                current: afterInferno
                            }
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to sync Inferno to party store:', error);
            }
        }
        if (infernoDescend > 0 && currentClassResource) {
            const beforeInferno = currentClassResource.current;
            consumeClassResource(infernoDescend);
            const afterInferno = Math.max(0, beforeInferno - infernoDescend);
            console.log('Casting spell - Inferno Descend:', { before: beforeInferno, cost: infernoDescend, after: afterInferno });
            
            // Sync to party store for HUD updates
            try {
                const usePartyStore = require('../../store/partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember && currentMember.character?.classResource) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            classResource: {
                                ...currentMember.character.classResource,
                                current: afterInferno
                            }
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to sync Inferno to party store:', error);
            }
        }

        // IMPROVEMENT: Sync spell cast to multiplayer
        try {
            const gameStore = require('../../store/gameStore').default;
            const gameState = gameStore.getState();
            const characterStore = require('../../store/characterStore').default;
            const characterState = characterStore.getState();
            
            if (gameState.isInMultiplayer && gameState.multiplayerSocket && gameState.multiplayerSocket.connected) {
                // Get spell data
                const spellData = spellToCast;
                const spellId = spellData.id || item.id;
                const spellName = spellData.name || item.name || 'Unknown Spell';
                const casterId = characterState.currentCharacterId || characterState.id;
                
                // Emit spell cast to server for synchronization
                gameState.multiplayerSocket.emit('spell_cast', {
                    spellId: spellId,
                    spellName: spellName,
                    casterId: casterId,
                    targetIds: [], // TODO: Add target selection
                    targetPositions: [], // TODO: Add position targeting
                    effects: spellData.effects || [],
                    damage: spellData.damage || 0,
                    healing: spellData.healing || 0,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.warn('Failed to sync spell cast to multiplayer:', error);
            // Continue with local spell cast even if sync fails
        }

        // Start cooldown if applicable
        const cooldownConfig = spellToCast.cooldownConfig || {};
        const cooldownType = cooldownConfig.type || item.cooldownType || 'none';
        const cooldownValue = cooldownConfig.value || item.maxCooldown || 0;
        
        if (cooldownValue > 0 && cooldownType !== 'none') {
            // Store cooldown type for this slot
            cooldownTypesRef.current[spellSlotIndex] = {
                type: cooldownType,
                value: cooldownValue,
                startTime: Date.now(),
                startRound: isInCombat ? round : null
            };
            
            // Initialize cooldown based on type
            if (cooldownType === 'turn_based') {
                // Turn-based: store remaining turns
                const itemWithCooldown = { 
                    ...item, 
                    cooldown: cooldownValue,
                    maxCooldown: cooldownValue,
                    cooldownType: 'turn_based',
                    cooldownStartRound: isInCombat ? round : null
                };
                updateSlot(spellSlotIndex, itemWithCooldown);
            } else if (cooldownType === 'real_time') {
                // Real-time: store end time
                const endTime = Date.now() + (cooldownValue * 1000);
                const itemWithCooldown = { 
                    ...item, 
                    cooldown: cooldownValue,
                    maxCooldown: cooldownValue,
                    cooldownType: 'real_time',
                    cooldownEndTime: endTime
                };
                updateSlot(spellSlotIndex, itemWithCooldown);
                
                // Start real-time countdown timer
                const timer = setInterval(() => {
                    updateActionSlots(currentSlots => {
                        const updatedSlots = [...currentSlots];
                        const slotItem = updatedSlots[spellSlotIndex];
                        if (slotItem && slotItem.cooldownEndTime) {
                            const remaining = Math.max(0, Math.ceil((slotItem.cooldownEndTime - Date.now()) / 1000));
                            if (remaining > 0) {
                                updatedSlots[spellSlotIndex] = {
                                    ...slotItem,
                                    cooldown: remaining
                                };
                            } else {
                                updatedSlots[spellSlotIndex] = {
                                    ...slotItem,
                                    cooldown: 0,
                                    cooldownEndTime: undefined
                                };
                                clearInterval(timer);
                                delete cooldownTimersRef.current[spellSlotIndex];
                            }
                        }
                        return updatedSlots;
                    });
                }, 1000);
                cooldownTimersRef.current[spellSlotIndex] = timer;
            } else {
                // Other types (short_rest, long_rest, etc.): use simple countdown for display
                // These don't progress automatically, they reset on rest
                const itemWithCooldown = { 
                    ...item, 
                    cooldown: cooldownValue,
                    maxCooldown: cooldownValue,
                    cooldownType 
                };
                updateSlot(spellSlotIndex, itemWithCooldown);
            }
        }

        // Close confirmation popup
        setShowSpellConfirmation(false);
        setSpellToCast(null);
        setSpellSlotIndex(null);
    };

    // Handle cancelled spell cast
    const handleSpellCastCancel = () => {
        setShowSpellConfirmation(false);
        setSpellToCast(null);
        setSpellSlotIndex(null);
    };

    // Handle cooldown adjustment
    const handleCooldownAdjust = (newValue) => {
        if (cooldownMenuSlotIndex === null) return;

        const item = actionSlots[cooldownMenuSlotIndex];
        if (!item) return;

        const cooldownType = item.cooldownType || item.cooldownConfig?.type || 'none';
        
        // Update cooldown value
        const updatedItem = {
            ...item,
            cooldown: newValue,
            maxCooldown: newValue
        };

        // For real-time cooldowns, update end time
        if (cooldownType === 'real_time' && newValue > 0) {
            updatedItem.cooldownEndTime = Date.now() + (newValue * 1000);
        }

        updateSlot(cooldownMenuSlotIndex, updatedItem);
    };

    // Handle cooldown menu close
    const handleCooldownMenuClose = () => {
        setShowCooldownMenu(false);
        setCooldownMenuSlotIndex(null);
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
                            onClick={(e) => handleSlotClick(index, e)}
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
                                } else if (item && item.type === 'spell') {
                                    handleSpellMouseMove(e, item);
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
                                            onLoad={() => {}}
                                            onError={(e) => {
                                                // Fallback to a default icon if the icon fails to load
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holybolt.jpg';
                                            }}
                                        />
                                </div>

                                {/* Cooldown overlay for spells */}
                                {item.cooldown > 0 && (
                                    <div className="cooldown-overlay">
                                        <div className="cooldown-text">
                                            {item.cooldownType === 'turn_based' 
                                                ? `${item.cooldown} turn${item.cooldown > 1 ? 's' : ''}`
                                                : item.cooldownType === 'real_time'
                                                ? (() => {
                                                    const seconds = item.cooldown;
                                                    const minutes = Math.floor(seconds / 60);
                                                    const remainingSeconds = seconds % 60;
                                                    return minutes > 0 
                                                        ? `${minutes}m ${remainingSeconds}s`
                                                        : `${seconds}s`;
                                                })()
                                                : item.cooldown
                                            }
                                        </div>
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

            {/* Spell Cast Confirmation */}
            {showSpellConfirmation && spellToCast && (
                <SpellCastConfirmation
                    spell={spellToCast}
                    onConfirm={handleSpellCastConfirm}
                    onCancel={handleSpellCastCancel}
                />
            )}

            {/* Cooldown Adjustment Menu */}
            {showCooldownMenu && cooldownMenuSlotIndex !== null && actionSlots[cooldownMenuSlotIndex] && (
                <CooldownAdjustmentMenu
                    slotIndex={cooldownMenuSlotIndex}
                    item={actionSlots[cooldownMenuSlotIndex]}
                    onAdjust={handleCooldownAdjust}
                    onClose={handleCooldownMenuClose}
                    actionBarRef={actionBarContainerRef}
                />
            )}
            </div>

            {/* Experience Bar - Below Action Bar */}
            <ExperienceBar currentXP={experience} />
        </>
    );
};

export default ActionBar;
