import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import useInventoryStore from '../../store/inventoryStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
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
import { getIconUrl, getCustomIconUrl, getAbilityIconUrl } from '../../utils/assetManager';
import './ActionBar.css';

// Spell damage types constant - used for consumable effects
const SPELL_DAMAGE_TYPES = ['fire', 'frost', 'arcane', 'nature', 'lightning', 'acid', 'force', 'thunder', 'chaos', 'necrotic', 'radiant'];

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
    const consumableHoverTimeoutRef = useRef(null);
    const consumableHideTimeoutRef = useRef(null);

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
    
    // Overheal modal state
    const [showOverhealModal, setShowOverhealModal] = useState(false);
    const [overhealData, setOverhealData] = useState(null); // { resourceType, amount, currentValue, maxValue, item } or array of these

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
    const actionPoints = useCharacterStore(state => state.actionPoints);
    const tempHealth = useCharacterStore(state => state.tempHealth || 0);
    const tempMana = useCharacterStore(state => state.tempMana || 0);
    const tempActionPoints = useCharacterStore(state => state.tempActionPoints || 0);
    const experience = useCharacterStore(state => state.experience || 0);
    const updateTempResource = useCharacterStore(state => state.updateTempResource);

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

    // Apply resource adjustment with optional temporary resource
    // Returns: { applied: boolean, pendingOverheal: object|null }
    const applyResourceAdjustmentWithOverheal = useCallback((resourceType, amount, item) => {
        const resourceMap = {
            'health': health,
            'mana': mana,
            'actionPoints': actionPoints
        };
        const tempMap = {
            'health': tempHealth,
            'mana': tempMana,
            'actionPoints': tempActionPoints
        };
        
        const currentResource = resourceMap[resourceType];
        const currentTemp = tempMap[resourceType];
        
        if (!currentResource) return { applied: false, pendingOverheal: null };
        
        const currentValue = currentResource.current || 0;
        const maxValue = currentResource.max || 0;
        const newValue = currentValue + amount;
        
        // Check for overheal (positive adjustment that would exceed max)
        // Also check if already at max and trying to add more
        if (amount > 0 && (newValue > maxValue || (currentValue >= maxValue && amount > 0))) {
            const overhealAmount = newValue - maxValue;
            return {
                applied: false,
                pendingOverheal: {
                    resourceType,
                    amount,
                    overhealAmount,
                    currentValue,
                    maxValue,
                    item
                }
            };
        }
        
        // Normal application (no overheal or negative adjustment)
        const finalValue = Math.max(0, Math.min(maxValue, newValue));
        updateResource(resourceType, finalValue, maxValue);
        return { applied: true, pendingOverheal: null };
    }, [health, mana, actionPoints, tempHealth, tempMana, tempActionPoints, updateResource]);

    // Apply remaining consumable effects (after overheal is handled)
    const applyRemainingConsumableEffects = useCallback((inventoryItem, skipResourceType = null) => {
        const combatStats = inventoryItem.combatStats || {};
        const buffEffects = {};
        const debuffEffects = {};
        let hasBuffEffects = false;
        let hasDebuffEffects = false;

        // Collect stat effects from combatStats (both positive and negative)
        ['strength', 'agility', 'intelligence', 'constitution', 'spirit', 'charisma'].forEach(stat => {
            if (combatStats[stat] && combatStats[stat].value !== 0) {
                const value = combatStats[stat].value;
                if (value > 0) {
                    buffEffects[stat] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[stat] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Collect other combat stat effects
        ['armor', 'damage', 'spellDamage', 'healingPower', 'healthRegen', 'manaRegen', 'moveSpeed'].forEach(stat => {
            if (combatStats[stat] && combatStats[stat].value !== 0) {
                const value = combatStats[stat].value;
                if (value > 0) {
                    buffEffects[stat] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[stat] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Handle spell damage types
        if (combatStats.spellDamage && combatStats.spellDamage.types) {
            Object.entries(combatStats.spellDamage.types).forEach(([spellType, spellData]) => {
                const value = typeof spellData === 'object' ? spellData.value : spellData;
                if (value > 0) {
                    buffEffects[`${spellType}SpellPower`] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[`${spellType}SpellPower`] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            });
        }

        // Handle individual spell damage types
        SPELL_DAMAGE_TYPES.forEach(type => {
            const typeKey = `${type}Damage`;
            const spellPowerKey = `${type}SpellPower`;

            if (combatStats[typeKey] && combatStats[typeKey].value !== 0) {
                const value = combatStats[typeKey].value;
                if (value > 0) {
                    buffEffects[spellPowerKey] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[spellPowerKey] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }

            if (combatStats[spellPowerKey] && combatStats[spellPowerKey].value !== 0) {
                const value = combatStats[spellPowerKey].value;
                if (value > 0) {
                    buffEffects[spellPowerKey] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[spellPowerKey] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Also check baseStats for buff/debuff effects
        const baseStats = inventoryItem.baseStats || {};
        let foundDuration = null;
        Object.keys(baseStats).forEach(statName => {
            const statData = baseStats[statName];
            if (statData) {
                const value = typeof statData === 'object' ? statData.value : statData;
                if (value > 0) {
                    buffEffects[statName] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[statName] = Math.abs(value);
                    hasDebuffEffects = true;
                }
                // Extract duration from stat data if present
                if (typeof statData === 'object' && statData.duration && !foundDuration) {
                    foundDuration = statData.duration;
                }
            }
        });

        // Check combatStats for duration (e.g., maxHealth.duration)
        if (!foundDuration && combatStats.maxHealth && combatStats.maxHealth.duration) {
            foundDuration = combatStats.maxHealth.duration;
        }

        // Check utilityStats for duration (e.g., movementSpeed.duration)
        const utilityStats = inventoryItem.utilityStats || {};
        if (!foundDuration && utilityStats.movementSpeed && utilityStats.movementSpeed.duration) {
            foundDuration = utilityStats.movementSpeed.duration;
        }

        // Check utilityStats.duration (the main duration field for consumables)
        if (!foundDuration && utilityStats.duration) {
            const durationValue = utilityStats.duration.value || 1;
            const durationType = utilityStats.duration.type || 'MINUTES';
            // Convert to seconds: ROUNDS = value * 6, MINUTES = value * 60
            foundDuration = durationType === 'ROUNDS' ? durationValue * 6 : durationValue * 60;
        }

        // Use found duration or default to 60 seconds (1 minute)
        const buffDuration = foundDuration || 60;
        const debuffDuration = foundDuration || 60;

        // Apply buff effects if any exist
        if (hasBuffEffects) {
            addBuff({
                name: inventoryItem.name,
                icon: getIconUrl(inventoryItem.iconId, 'items'),
                description: inventoryItem.description || `Temporary enhancement from ${inventoryItem.name}`,
                effects: buffEffects,
                duration: buffDuration,
                source: 'consumable',
                stackable: false
            });
        }

        // Apply debuff effects if any exist
        if (hasDebuffEffects) {
            const { addDebuff } = useDebuffStore.getState();
            addDebuff({
                name: inventoryItem.name,
                icon: getIconUrl(inventoryItem.iconId, 'items'),
                description: inventoryItem.description || `Temporary negative effect from ${inventoryItem.name}`,
                effects: debuffEffects,
                duration: debuffDuration,
                source: 'consumable',
                stackable: false
            });
        }
    }, [addBuff]);

    // Apply resource adjustment with temporary resource support
    // Now handles both single overheal and array of overheals
    const applyResourceWithTemporary = useCallback((asTemporary, resourceType = null) => {
        if (!overhealData) return;
        
        // Handle both single object and array - ensure it's always a valid array
        const overheals = Array.isArray(overhealData) 
            ? overhealData.filter(oh => oh != null)
            : (overhealData && typeof overhealData === 'object' ? [overhealData] : []);
        
        // Safety check: ensure we have valid overheals
        if (!Array.isArray(overheals) || overheals.length === 0) return;
        
        // If resourceType is specified, only process that one (for individual buttons)
        const overhealsToProcess = resourceType 
            ? overheals.filter(oh => oh.resourceType === resourceType)
            : overheals;
        
        const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
        };
        
        overhealsToProcess.forEach(overheal => {
            const { resourceType: resType, amount, currentValue, maxValue } = overheal;
            const tempField = tempFieldMap[resType];
            const currentTemp = tempField === 'tempHealth' ? tempHealth : 
                               tempField === 'tempMana' ? tempMana : tempActionPoints;
            
            if (asTemporary) {
                // Add as temporary resource
                const overhealAmount = (currentValue + amount) - maxValue;
                
                // Set resource to max
                updateResource(resType, maxValue, maxValue);
                
                // Update temporary resource
                updateTempResource(resType, currentTemp + overhealAmount);
            } else {
                // Just cap at max, don't add temporary
                updateResource(resType, maxValue, maxValue);
            }
        });
        
        // Get the item from the first overheal (they should all have the same item)
        const firstOverheal = overheals[0];
        const item = firstOverheal?.item;
        
        // Check if all overheals have been processed
        const remainingOverheals = resourceType 
            ? overheals.filter(oh => oh.resourceType !== resourceType)
            : [];
        
        // If all overheals are processed, continue with consumable effects
        if (remainingOverheals.length === 0) {
            // Continue with the rest of consumable effects
            if (item) {
                const inventoryItem = inventoryItems.find(invItem =>
                    invItem.originalItemId === item.originalItemId || 
                    invItem.id === item.originalItemId
                );
                if (inventoryItem) {
                    applyRemainingConsumableEffects(inventoryItem);
                }
            }
            
            // Remove the item from inventory after decision is made
            if (item) {
                const inventoryItem = inventoryItems.find(invItem =>
                    invItem.originalItemId === item.originalItemId || 
                    invItem.id === item.originalItemId
                );
                if (inventoryItem) {
                    removeItem(inventoryItem.id, 1);
                }
            }
            
            setShowOverhealModal(false);
            setOverhealData(null);
        } else {
            // Update overheal data to remaining overheals
            setOverhealData(remainingOverheals.length === 1 ? remainingOverheals[0] : remainingOverheals);
        }
    }, [overhealData, tempHealth, tempMana, tempActionPoints, updateResource, updateTempResource, inventoryItems, applyRemainingConsumableEffects, removeItem]);

    // Helper function to apply consumable effects
    const applyConsumableEffects = useCallback((item) => {
        // Get the full item data from inventory to access combat stats
        const inventoryItem = inventoryItems.find(invItem =>
            invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
        );

        if (!inventoryItem) return;

        const combatStats = inventoryItem.combatStats || {};
        const buffEffects = {};
        const debuffEffects = {};
        let hasInstantEffects = false;
        let hasBuffEffects = false;
        let hasDebuffEffects = false;
        const pendingOverheals = []; // Array to collect all pending overheals

        // Apply instant healing effects with overheal detection
        // IMPORTANT: Check ALL resources first before applying any, to catch all overheals
        if (combatStats.healthRestore) {
            const healAmount = combatStats.healthRestore.value || 0;
            if (healAmount > 0) {
                const result = applyResourceAdjustmentWithOverheal('health', healAmount, item);
                if (result.applied) {
                    hasInstantEffects = true;
                } else if (result.pendingOverheal) {
                    pendingOverheals.push(result.pendingOverheal);
                }
            }
        }

        // Apply instant mana restoration with overheal detection
        if (combatStats.manaRestore) {
            const manaAmount = combatStats.manaRestore.value || 0;
            if (manaAmount > 0) {
                const result = applyResourceAdjustmentWithOverheal('mana', manaAmount, item);
                if (result.applied) {
                    hasInstantEffects = true;
                } else if (result.pendingOverheal) {
                    pendingOverheals.push(result.pendingOverheal);
                }
            }
        }

        // Apply action point restoration with overheal detection (if supported)
        if (combatStats.actionPointRestore || combatStats.apRestore) {
            const apAmount = (combatStats.actionPointRestore?.value || combatStats.apRestore?.value || 0);
            if (apAmount > 0) {
                const result = applyResourceAdjustmentWithOverheal('actionPoints', apAmount, item);
                if (result.applied) {
                    hasInstantEffects = true;
                } else if (result.pendingOverheal) {
                    pendingOverheals.push(result.pendingOverheal);
                }
            }
        }

        // If there are pending overheals, show modal with all of them
        if (pendingOverheals.length > 0) {
            // Set overheal data - use array if multiple, single object if one
            setOverhealData(pendingOverheals.length === 1 ? pendingOverheals[0] : pendingOverheals);
            setShowOverhealModal(true);
            return { hasInstantEffects: false, hasBuffEffects: false, pendingOverheal: true };
        }

        // Collect stat effects from combatStats (both positive and negative)
        ['strength', 'agility', 'intelligence', 'constitution', 'spirit', 'charisma'].forEach(stat => {
            if (combatStats[stat] && combatStats[stat].value !== 0) {
                const value = combatStats[stat].value;
                if (value > 0) {
                    buffEffects[stat] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[stat] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Collect other combat stat effects
        ['armor', 'damage', 'spellDamage', 'healingPower', 'healthRegen', 'manaRegen', 'moveSpeed'].forEach(stat => {
            if (combatStats[stat] && combatStats[stat].value !== 0) {
                const value = combatStats[stat].value;
                if (value > 0) {
                    buffEffects[stat] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[stat] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Handle spell damage types
        if (combatStats.spellDamage && combatStats.spellDamage.types) {
            Object.entries(combatStats.spellDamage.types).forEach(([spellType, spellData]) => {
                const value = typeof spellData === 'object' ? spellData.value : spellData;
                if (value > 0) {
                    buffEffects[`${spellType}SpellPower`] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[`${spellType}SpellPower`] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            });
        }

        // Handle individual spell damage types
        SPELL_DAMAGE_TYPES.forEach(type => {
            const typeKey = `${type}Damage`;
            const spellPowerKey = `${type}SpellPower`;

            if (combatStats[typeKey] && combatStats[typeKey].value !== 0) {
                const value = combatStats[typeKey].value;
                if (value > 0) {
                    buffEffects[spellPowerKey] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[spellPowerKey] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }

            if (combatStats[spellPowerKey] && combatStats[spellPowerKey].value !== 0) {
                const value = combatStats[spellPowerKey].value;
                if (value > 0) {
                    buffEffects[spellPowerKey] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[spellPowerKey] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Collect other combat stat effects
        ['armor', 'damage', 'spellDamage', 'healingPower', 'healthRegen', 'manaRegen', 'moveSpeed'].forEach(stat => {
            if (combatStats[stat] && combatStats[stat].value !== 0) {
                const value = combatStats[stat].value;
                if (value > 0) {
                    buffEffects[stat] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[stat] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Handle spell damage types
        if (combatStats.spellDamage && combatStats.spellDamage.types) {
            Object.entries(combatStats.spellDamage.types).forEach(([spellType, spellData]) => {
                const value = typeof spellData === 'object' ? spellData.value : spellData;
                if (value > 0) {
                    buffEffects[`${spellType}SpellPower`] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[`${spellType}SpellPower`] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            });
        }

        // Handle individual spell damage types
        SPELL_DAMAGE_TYPES.forEach(type => {
            const typeKey = `${type}Damage`;
            const spellPowerKey = `${type}SpellPower`;

            if (combatStats[typeKey] && combatStats[typeKey].value !== 0) {
                const value = combatStats[typeKey].value;
                if (value > 0) {
                    buffEffects[spellPowerKey] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[spellPowerKey] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }

            if (combatStats[spellPowerKey] && combatStats[spellPowerKey].value !== 0) {
                const value = combatStats[spellPowerKey].value;
                if (value > 0) {
                    buffEffects[spellPowerKey] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[spellPowerKey] = Math.abs(value);
                    hasDebuffEffects = true;
                }
            }
        });

        // Also check baseStats for buff/debuff effects (this is where elixirs store their stat bonuses/penalties)
        const baseStats = inventoryItem.baseStats || {};
        let foundDuration = null;
        Object.keys(baseStats).forEach(statName => {
            const statData = baseStats[statName];
            if (statData) {
                const value = typeof statData === 'object' ? statData.value : statData;
                if (value > 0) {
                    buffEffects[statName] = value;
                    hasBuffEffects = true;
                } else if (value < 0) {
                    debuffEffects[statName] = Math.abs(value);
                    hasDebuffEffects = true;
                }
                // Extract duration from stat data if present
                if (typeof statData === 'object' && statData.duration && !foundDuration) {
                    foundDuration = statData.duration;
                }
            }
        });

        // Check combatStats for duration (e.g., maxHealth.duration)
        if (!foundDuration && combatStats.maxHealth && combatStats.maxHealth.duration) {
            foundDuration = combatStats.maxHealth.duration;
        }

        // Check utilityStats for duration (e.g., movementSpeed.duration)
        const utilityStats = inventoryItem.utilityStats || {};
        if (!foundDuration && utilityStats.movementSpeed && utilityStats.movementSpeed.duration) {
            foundDuration = utilityStats.movementSpeed.duration;
        }

        // Check utilityStats.duration (the main duration field for consumables)
        if (!foundDuration && utilityStats.duration) {
            const durationValue = utilityStats.duration.value || 1;
            const durationType = utilityStats.duration.type || 'MINUTES';
            // Convert to seconds: ROUNDS = value * 6, MINUTES = value * 60
            foundDuration = durationType === 'ROUNDS' ? durationValue * 6 : durationValue * 60;
        }

        // Use found duration or default to 60 seconds (1 minute)
        const buffDuration = foundDuration || 60;
        const debuffDuration = foundDuration || 60;

        // Apply buff effects if any exist
        if (hasBuffEffects) {
            addBuff({
                name: inventoryItem.name,
                icon: getIconUrl(inventoryItem.iconId, 'items'),
                description: inventoryItem.description || `Temporary enhancement from ${inventoryItem.name}`,
                effects: buffEffects,
                duration: buffDuration,
                source: 'consumable',
                stackable: false
            });
        }

        // Apply debuff effects if any exist
        if (hasDebuffEffects) {
            const { addDebuff } = useDebuffStore.getState();
            addDebuff({
                name: inventoryItem.name,
                icon: getIconUrl(inventoryItem.iconId, 'items'),
                description: inventoryItem.description || `Temporary negative effect from ${inventoryItem.name}`,
                effects: debuffEffects,
                duration: debuffDuration,
                source: 'consumable',
                stackable: false
            });
        }

        return { hasInstantEffects, hasBuffEffects, pendingOverheal: false };
    }, [inventoryItems, applyResourceAdjustmentWithOverheal, addBuff]);

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
                // Cannot use action - not your turn in combat
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
                const result = applyConsumableEffects(item);

                // Only remove item if there's no pending overheal (user will decide in modal)
                if (result && !result.pendingOverheal) {
                    // Remove one item from inventory
                    const inventoryItem = inventoryItems.find(invItem =>
                        invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
                    );

                    if (inventoryItem) {
                        removeItem(inventoryItem.id, 1);
                    }
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
                
                // Extract icon from various possible locations to ensure it's preserved
                const iconId = spell?.typeConfig?.icon ||
                               spell?.icon ||
                               spell?.damageConfig?.icon ||
                               spell?.healingConfig?.icon ||
                               null;
                
                // Update the action slot with the complete spell data
                const newSpellSlot = {
                    // Store complete spell data for rich tooltip display
                    ...spell,
                    // Ensure icon is explicitly set from extracted value
                    icon: iconId || spell.icon || 'inv_misc_questionmark',
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

                    // Extract icon from various possible locations
                    const iconId = item.iconId || item.icon || 'inv_potion_51';

                    // Update the action slot with the consumable item
                    const newConsumableSlot = {
                        id: item.id,
                        name: item.name,
                        icon: iconId, // Ensure icon is explicitly set
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

    // Helper function to extract spell icon from various possible locations
    const extractSpellIcon = (spell) => {
        if (!spell) return null;
        
        // Extract icon from various possible locations (same logic as SpellLibrary)
        const iconId = spell?.typeConfig?.icon ||
                       spell?.icon ||
                       spell?.damageConfig?.icon ||
                       spell?.healingConfig?.icon ||
                       null;

        return iconId;
    };

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
    const getSpellIconUrl = (spell) => {
        // Extract icon from various possible locations
        const iconId = extractSpellIcon(spell);

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
            // If no mapping found, use default
            return getCustomIconUrl('Utility/Utility', 'abilities');
        }

        // Default fallback
        return getCustomIconUrl('Utility/Utility', 'abilities');
    };

    const getSlotIcon = (item) => {
        if (!item) return null;

        // Handle different icon formats for spells vs consumables
        if (item.type === 'consumable') {
            // Use item icon URL for consumables
            return getIconUrl(item.icon, 'items');
        } else if (item.type === 'spell') {
            // Use spell icon URL helper for spells
            return getSpellIconUrl(item);
        } else {
            // Fallback for other types
            return getIconUrl(item.icon, 'items');
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

        // Clear any existing timeouts
        if (consumableHoverTimeoutRef.current) {
            clearTimeout(consumableHoverTimeoutRef.current);
        }
        if (consumableHideTimeoutRef.current) {
            clearTimeout(consumableHideTimeoutRef.current);
            consumableHideTimeoutRef.current = null;
        }

        // Get the full item data from inventory
        const inventoryItem = inventoryItems.find(invItem =>
            invItem.originalItemId === item.originalItemId || invItem.id === item.originalItemId
        );

        if (!inventoryItem) {
            return;
        }

        // Store the element reference to avoid null reference errors
        const targetElement = e.currentTarget;
        if (!targetElement) return;

        // Store the current mouse position for initial tooltip placement
        const currentMouseX = e.clientX;
        const currentMouseY = e.clientY;

        // Set hover timeout
        consumableHoverTimeoutRef.current = setTimeout(() => {
            // Check if element still exists
            if (!targetElement || !document.contains(targetElement)) return;

            // Use mouse position for tooltip placement
            const tooltipX = currentMouseX;
            const tooltipY = currentMouseY;

            setTooltipPosition({ x: tooltipX, y: tooltipY });
            setTooltipItem(inventoryItem);
            setShowTooltip(true);
        }, 300); // 300ms delay before showing tooltip
    };

    const handleConsumableMouseMove = (e, item) => {
        if (!item || item.type !== 'consumable') return;

        // Update tooltip position to follow the mouse cursor
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Position tooltip relative to mouse cursor
        const tooltipX = mouseX;
        const tooltipY = mouseY;

        // Update position whether tooltip is showing or not (for smooth appearance at current position)
        setTooltipPosition({ x: tooltipX, y: tooltipY });
    };

    const handleConsumableMouseLeave = () => {
        // Clear hover timeout
        if (consumableHoverTimeoutRef.current) {
            clearTimeout(consumableHoverTimeoutRef.current);
            consumableHoverTimeoutRef.current = null;
        }

        // Hide tooltip immediately when leaving the action slot
        if (consumableHideTimeoutRef.current) {
            clearTimeout(consumableHideTimeoutRef.current);
        }
        setShowTooltip(false);
        setTooltipItem(null);
    };

    const handleConsumableTooltipMouseEnter = () => {
        // Keep tooltip visible when hovering over it
        if (consumableHideTimeoutRef.current) {
            clearTimeout(consumableHideTimeoutRef.current);
            consumableHideTimeoutRef.current = null;
        }
    };

    const handleConsumableTooltipMouseLeave = () => {
        // Hide tooltip immediately when leaving the tooltip
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

        // Hide tooltip immediately when leaving the action slot
        if (spellHideTimeoutRef.current) {
            clearTimeout(spellHideTimeoutRef.current);
        }
        setShowSpellTooltip(false);
        setTooltipSpell(null);
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
            // Not enough mana to cast spell
            // Don't close popup - let it show the error
            return;
        }

        if (apCost > 0 && currentAP.current < apCost) {
            // Not enough action points to cast spell
            // Don't close popup - let it show the error
            return;
        }

        // Only check inferno_required - inferno_ascend does NOT block casting
        if (infernoRequired > 0 && (!currentClassResource || currentClassResource.current < infernoRequired)) {
            // Not enough Inferno required to cast spell
            // Don't close popup - let it show the error
            return;
        }

        // Apply resource costs - use updateResource with proper parameters
        if (manaCost > 0) {
            const newMana = Math.max(0, currentMana.current - manaCost);
            
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
                                                if (item.type === 'spell') {
                                                    e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                                } else {
                                                    e.target.src = getIconUrl('inv_potion_51', 'items');
                                                }
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

            {/* Consumable Tooltip - Fullscreen Modal Mode */}
            {showTooltip && tooltipItem && (
                ReactDOM.createPortal(
                    <div
                        className="spellbook-popup-overlay action-bar-consumable-tooltip"
                        onMouseEnter={handleConsumableTooltipMouseEnter}
                        onMouseLeave={handleConsumableTooltipMouseLeave}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'radial-gradient(circle at center, rgba(100, 100, 150, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999, // Lower than action bar to keep it visible
                            cursor: 'default',
                            margin: 0,
                            padding: 0,
                            pointerEvents: 'none' // Allow clicks to pass through to action bar
                        }}
                    >
                        <div
                            className="spellbook-popup-content action-bar-consumable-content"
                            onMouseEnter={handleConsumableTooltipMouseEnter}
                            onMouseLeave={handleConsumableTooltipMouseLeave}
                            style={{
                                padding: '20px',
                                maxWidth: '600px',
                                width: '100%',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                cursor: 'default',
                                pointerEvents: 'auto' // Re-enable pointer events for the item tooltip
                            }}
                        >
                            <div className="action-bar-item-tooltip-wrapper">
                                <ItemTooltip item={tooltipItem} />
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            )}

            {/* Spell Tooltip */}
            {showSpellTooltip && tooltipSpell && (
                <SpellTooltip
                    spell={tooltipSpell}
                    position={spellTooltipPosition}
                    onMouseEnter={handleSpellTooltipMouseEnter}
                    onMouseLeave={handleSpellTooltipMouseLeave}
                    fullscreenMode={true} // Enable fullscreen modal mode with cloudy background for action bar tooltips
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
                        {(() => {
                            // Ensure overhealData is valid and convert to array
                            if (!overhealData) return null;
                            
                            // Defensive conversion to array with explicit type checking
                            let overhealsArray = [];
                            try {
                                if (Array.isArray(overhealData)) {
                                    overhealsArray = overhealData.filter(oh => oh != null && typeof oh === 'object');
                                } else if (overhealData && typeof overhealData === 'object' && !Array.isArray(overhealData)) {
                                    overhealsArray = [overhealData];
                                } else {
                                    // If it's not an array or object, return null
                                    console.warn('Invalid overhealData type:', typeof overhealData, overhealData);
                                    return null;
                                }
                                
                                // Force conversion to array if somehow it's still not an array
                                if (!Array.isArray(overhealsArray)) {
                                    overhealsArray = [];
                                }
                            } catch (e) {
                                console.error('Error processing overhealData:', e, overhealData);
                                return null;
                            }
                            
                            // Safety check: ensure overhealsArray is an array with valid entries
                            if (!Array.isArray(overhealsArray)) {
                                console.error('overhealsArray is not an array after processing:', typeof overhealsArray, overhealsArray);
                                return null;
                            }
                            
                            if (overhealsArray.length === 0) {
                                return null;
                            }
                            
                            // Final verification that map function exists
                            if (typeof overhealsArray.map !== 'function') {
                                console.error('overhealsArray.map is not a function:', typeof overhealsArray, overhealsArray);
                                // Try to force it to be an array
                                overhealsArray = Array.from(overhealsArray);
                                if (typeof overhealsArray.map !== 'function') {
                                    return null;
                                }
                            }
                            
                            const firstOverheal = overhealsArray[0];
                            const item = firstOverheal?.item;
                            
                            return (
                                <>
                                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                                        {overhealsArray.length > 1 ? 'Overheals Detected' : 'Overheal Detected'}
                                    </h3>
                                    
                                    {item && (() => {
                                        const inventoryItem = inventoryItems.find(invItem =>
                                            invItem.originalItemId === item.originalItemId || 
                                            invItem.id === item.originalItemId
                                        );
                                        const itemName = inventoryItem?.name || item.name || 'Item';
                                        return (
                                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: 'bold' }}>
                                                {itemName}
                                            </p>
                                        );
                                    })()}
                                    
                                    {(() => {
                                        // Final safety check right before rendering
                                        if (!Array.isArray(overhealsArray) || overhealsArray.length === 0) {
                                            return null;
                                        }
                                        return overhealsArray.map((overheal, index) => {
                                            if (!overheal || typeof overheal !== 'object') return null;
                                            const resourceLabel = overheal.resourceType === 'health' ? 'HP' : 
                                                             overheal.resourceType === 'mana' ? 'Mana' : 'AP';
                                            return (
                                                <div key={index} style={{ 
                                                    marginBottom: index < overhealsArray.length - 1 ? '15px' : '20px',
                                                    padding: '10px',
                                                    backgroundColor: 'rgba(160, 140, 112, 0.1)',
                                                    borderRadius: '4px'
                                                }}>
                                                    <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                                        This would restore <strong>{overheal.amount}</strong> {resourceLabel}, 
                                                        but the current value is {overheal.currentValue}/{overheal.maxValue}.
                                                    </p>
                                                    <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>
                                                        <strong>{overheal.overhealAmount}</strong> would exceed the maximum.
                                                    </p>
                                                    {Array.isArray(overhealsArray) && overhealsArray.length > 1 && (
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                                                            <button
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    border: '1px solid #a08c70',
                                                                    borderRadius: '4px',
                                                                    backgroundColor: '#d4c4a8',
                                                                    color: '#7a3b2e',
                                                                    cursor: 'pointer',
                                                                    fontSize: '11px'
                                                                }}
                                                                onClick={() => applyResourceWithTemporary(true, overheal.resourceType)}
                                                            >
                                                                Add {resourceLabel} as Temporary
                                                            </button>
                                                            <button
                                                                style={{
                                                                    padding: '6px 12px',
                                                                    border: '1px solid #a08c70',
                                                                    borderRadius: '4px',
                                                                    backgroundColor: '#d4c4a8',
                                                                    color: '#7a3b2e',
                                                                    cursor: 'pointer',
                                                                    fontSize: '11px'
                                                                }}
                                                                onClick={() => applyResourceWithTemporary(false, overheal.resourceType)}
                                                            >
                                                                Cap {resourceLabel} at Max
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}
                                    
                                    {Array.isArray(overhealsArray) && overhealsArray.length === 1 && (
                                        <>
                                            <p style={{ margin: '0 0 20px 0', fontSize: '13px', fontStyle: 'italic' }}>
                                                Would you like to add the excess as temporary {firstOverheal.resourceType === 'health' ? 'HP' : firstOverheal.resourceType === 'mana' ? 'Mana' : 'AP'}?
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
                                                    onClick={() => applyResourceWithTemporary(true)}
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
                                                    onClick={() => applyResourceWithTemporary(false)}
                                                >
                                                    Cap at Maximum
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    
                                    {Array.isArray(overhealsArray) && overhealsArray.length > 1 && (
                                        <>
                                            <p style={{ margin: '15px 0 0 0', fontSize: '12px', fontStyle: 'italic', color: '#8b7355' }}>
                                                You can handle each resource individually above, or use the buttons below to apply the same choice to all.
                                            </p>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
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
                                                    onClick={() => {
                                                        // Process all overheals at once
                                                        (Array.isArray(overhealsArray) ? overhealsArray : []).forEach(oh => {
                                                            const tempFieldMap = {
                                                                'health': 'tempHealth',
                                                                'mana': 'tempMana',
                                                                'actionPoints': 'tempActionPoints'
                                                            };
                                                            const tempField = tempFieldMap[oh.resourceType];
                                                            const currentTemp = tempField === 'tempHealth' ? tempHealth : 
                                                                               tempField === 'tempMana' ? tempMana : tempActionPoints;
                                                            const overhealAmount = (oh.currentValue + oh.amount) - oh.maxValue;
                                                            updateResource(oh.resourceType, oh.maxValue, oh.maxValue);
                                                            updateTempResource(oh.resourceType, currentTemp + overhealAmount);
                                                        });
                                                        
                                                        // Continue with consumable effects
                                                        const item = firstOverheal?.item;
                                                        if (item) {
                                                            const inventoryItem = inventoryItems.find(invItem =>
                                                                invItem.originalItemId === item.originalItemId || 
                                                                invItem.id === item.originalItemId
                                                            );
                                                            if (inventoryItem) {
                                                                applyRemainingConsumableEffects(inventoryItem);
                                                            }
                                                        }
                                                        
                                                        // Remove item
                                                        if (item) {
                                                            const inventoryItem = inventoryItems.find(invItem =>
                                                                invItem.originalItemId === item.originalItemId || 
                                                                invItem.id === item.originalItemId
                                                            );
                                                            if (inventoryItem) {
                                                                removeItem(inventoryItem.id, 1);
                                                            }
                                                        }
                                                        
                                                        setShowOverhealModal(false);
                                                        setOverhealData(null);
                                                    }}
                                                >
                                                    Add All as Temporary
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
                                                    onClick={() => {
                                                        // Process all overheals at once
                                                        (Array.isArray(overhealsArray) ? overhealsArray : []).forEach(oh => {
                                                            updateResource(oh.resourceType, oh.maxValue, oh.maxValue);
                                                        });
                                                        
                                                        // Continue with consumable effects
                                                        const item = firstOverheal?.item;
                                                        if (item) {
                                                            const inventoryItem = inventoryItems.find(invItem =>
                                                                invItem.originalItemId === item.originalItemId || 
                                                                invItem.id === item.originalItemId
                                                            );
                                                            if (inventoryItem) {
                                                                applyRemainingConsumableEffects(inventoryItem);
                                                            }
                                                        }
                                                        
                                                        // Remove item
                                                        if (item) {
                                                            const inventoryItem = inventoryItems.find(invItem =>
                                                                invItem.originalItemId === item.originalItemId || 
                                                                invItem.id === item.originalItemId
                                                            );
                                                            if (inventoryItem) {
                                                                removeItem(inventoryItem.id, 1);
                                                            }
                                                        }
                                                        
                                                        setShowOverhealModal(false);
                                                        setOverhealData(null);
                                                    }}
                                                >
                                                    Cap All at Maximum
                                                </button>
                                            </div>
                                        </>
                                    )}
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
                                </>
                            );
                        })()}
                    </div>
                </div>,
                document.body
            )}

            {/* Experience Bar - Below Action Bar */}
            <ExperienceBar currentXP={experience} />
        </>
    );
};

export default ActionBar;
