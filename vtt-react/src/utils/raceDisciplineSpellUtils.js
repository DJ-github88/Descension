/**
 * Race and Discipline Spell Utilities
 *
 * Utility functions to extract and manage spells from race/subrace and discipline/path data
 */

// Import race data
import { RACE_DATA, getFullRaceData, getSubraceData } from '../data/raceData';

// Import path data from enhancedPathData.js (which already imports all paths)
import { ENHANCED_PATHS } from '../data/enhancedPathData';

// Import spell library context (avoid circular import by importing at top)
import { libraryActionCreators } from '../components/spellcrafting-wizard/context/SpellLibraryContext';

// Map of path IDs to path data (using ENHANCED_PATHS which already imports all paths)
const PATH_DATA_MAP = ENHANCED_PATHS;

// Normalize discipline abilities to use allowed resources/damage types
export const normalizeDisciplineAbility = (ability = {}) => {
    const normalized = { ...ability };

    // Resource cost: remove stamina, use mana instead
    if (normalized.resourceCost) {
        const { resourceTypes = [], resourceValues = {}, actionPoints } = normalized.resourceCost;
        const hasStamina = resourceTypes.includes('stamina') || resourceValues.stamina !== undefined;
        const staminaValue = resourceValues.stamina;
        const filteredTypes = resourceTypes.filter(r => r !== 'stamina');
        if (hasStamina) {
            const manaValue = typeof staminaValue === 'number' ? staminaValue : 5;
            normalized.resourceCost = {
                resourceTypes: [...filteredTypes, 'mana'],
                resourceValues: { ...resourceValues, mana: manaValue },
                actionPoints: actionPoints ?? 0,
                useFormulas: normalized.resourceCost.useFormulas || {}
            };
            delete normalized.resourceCost.resourceValues.stamina;
        }
    }

    // Damage types: replace "physical" with "bludgeoning" (allowed)
    if (Array.isArray(normalized.damageTypes)) {
        normalized.damageTypes = normalized.damageTypes.map(dt => dt === 'physical' ? 'bludgeoning' : dt);
    }
    if (normalized.damageConfig?.elementType === 'physical') {
        normalized.damageConfig = { ...normalized.damageConfig, elementType: 'bludgeoning' };
    }

    // Type/tags cleanup
    if (normalized.typeConfig) {
        normalized.typeConfig = {
            ...normalized.typeConfig,
            school: normalized.typeConfig.school === 'physical' ? 'martial' : normalized.typeConfig.school,
            icon: normalized.typeConfig.icon,
            tags: (normalized.typeConfig.tags || []).map(t => t === 'physical' ? 'martial' : t)
        };
    }
    if (Array.isArray(normalized.tags)) {
        normalized.tags = normalized.tags.map(t => t === 'physical' ? 'martial' : t);
    }
    if (normalized.visualTheme === 'physical') {
        normalized.visualTheme = 'martial';
    }

    return normalized;
};

/**
 * Check if a trait should be treated as a passive stat modifier (not a spell)
 * @param {Object} trait - The trait object to check
 * @returns {boolean} True if it should be a stat modifier, false if it should be a spell
 */
export function isPassiveStatModifier(trait) {
    // Passive abilities that should be stats, not spells:
    // - PASSIVE spellType with only stat modifiers (no active abilities)
    // - Resistances, vulnerabilities, or other permanent stat changes
    if (!trait) return false;
    
    // NEVER filter out REACTION, ACTION, CHANNELED, or other active spell types
    if (trait.spellType && trait.spellType !== 'PASSIVE') {
        return false;
    }
    
    // Explicit check for known passive traits by ID or name
    const traitId = (trait.id || '').toLowerCase();
    const traitName = (trait.name || '').toLowerCase();
    if (traitId === 'deep_frost_nordmark' || traitName === 'deep frost') {
        return true; // Deep Frost is always a passive
    }

    // Defensive catch-all: any passive trait that clearly represents a resistance/vulnerability
    // should be treated as a stat modifier even if its tags are incomplete
    const idIndicatesResistance =
        traitId.includes('resistance') || traitId.includes('vulnerability') || traitId.includes('immunity');
    const nameIndicatesResistance =
        traitName.includes('resistance') || traitName.includes('vulnerability') || traitName.includes('immunity');
    if ((trait.spellType === 'PASSIVE' || !trait.spellType) && (idIndicatesResistance || nameIndicatesResistance)) {
        return true;
    }
    
    // Check tags first - if it has resistance/vulnerability/immunity tags, it's a stat modifier
    const tags = trait.typeConfig?.tags || trait.tags || [];
    const isResistanceOrVulnerabilityOrImmunity = tags.some(tag => 
        ['resistance', 'vulnerability', 'immunity'].includes(tag.toLowerCase())
    );
    
    if (isResistanceOrVulnerabilityOrImmunity) {
        return true;
    }
    
    // Also check trait name and description for immunity/resistance/vulnerability keywords
    const traitDesc = (trait.description || '').toLowerCase();
    const hasImmunityKeywords = (
        traitName.includes('immunity') || traitName.includes('immune') ||
        traitDesc.includes('immunity') || traitDesc.includes('immune') ||
        traitDesc.includes('cold immunity') || traitDesc.includes('immunity to') ||
        traitName.includes('resistance') || traitDesc.includes('resistance') ||
        traitName.includes('vulnerability') || traitDesc.includes('vulnerability')
    );
    
    // If it's a PASSIVE with immunity/resistance/vulnerability keywords, it's a stat modifier
    if (hasImmunityKeywords && trait.spellType === 'PASSIVE') {
        return true;
    }
    
    // Always-on racial perks: passive, no cost, permanent duration → treat as passive stat modifiers
    const isPassiveNoCost = trait.spellType === 'PASSIVE' &&
        (!trait.resourceCost || trait.resourceCost.actionPoints === 0);
    const hasPermanentBuffOrDebuff =
        trait.buffConfig?.durationType === 'permanent' ||
        trait.debuffConfig?.durationType === 'permanent';
    const hasPermanentUtility =
        trait.utilityConfig &&
        (!trait.utilityConfig.duration || trait.utilityConfig.duration === 0 || trait.utilityConfig.durationType === 'permanent');
    const hasPassiveHealing =
        trait.healingConfig &&
        isPassiveNoCost &&
        (
            trait.healingConfig.durationType === 'permanent' ||
            (trait.healingConfig.hotDuration || '').toLowerCase().includes('while') ||
            (trait.healingConfig.hotDuration || '').toLowerCase().includes('sun') ||
            (trait.healingConfig.hotDuration || '').toLowerCase().includes('sunlight')
        );
    if (isPassiveNoCost && (hasPermanentBuffOrDebuff || hasPermanentUtility || hasPassiveHealing)) {
        return true;
    }

    // If it's PASSIVE and only has stat modifiers (no triggers, no active effects)
    if (trait.spellType === 'PASSIVE') {
        // Check if it has stat modifiers in buffConfig or debuffConfig
        const hasStatModifiers = (
            (trait.buffConfig?.effects?.some(effect => effect.statModifier)) ||
            (trait.debuffConfig?.effects?.some(effect => effect.statModifier))
        );
        
        // Check if it has immunity-granting statusEffects (these are stat modifiers, not active effects)
        // Immunities are statusEffects that grant permanent immunities (check by name/description, any level)
        const hasImmunityStatusEffects = trait.buffConfig?.effects?.some(effect => {
            if (!effect.statusEffect) return false;
            const statusEffect = effect.statusEffect;
            const effectName = (effect.name || '').toLowerCase();
            const effectDesc = (effect.description || '').toLowerCase();
            
            // Check if this is an immunity-related effect (by name/description, any level)
            // Also check if it's extreme level (which often indicates immunity)
            const isImmunity = (
                (effectName.includes('immunity') || 
                 effectName.includes('immune') ||
                 effectDesc.includes('immune') ||
                 effectDesc.includes('immunity')) ||
                (statusEffect.level === 'extreme' && (
                    effectName.includes('immunity') || 
                    effectName.includes('immune') ||
                    effectDesc.includes('immune') ||
                    effectDesc.includes('immunity')
                ))
            );
            
            return isImmunity;
        });
        
        // Must not have action points (triggers are allowed for passives)
        const hasNoActionPoints = (!trait.resourceCost?.actionPoints || trait.resourceCost.actionPoints === 0);
        
        // Check for other active effects (excluding immunity statusEffects and survival utility)
        // If it has non-immunity statusEffect, buffConfig effects, or other active effects, keep it as a spell
        const hasActiveEffects = (
            trait.buffConfig?.effects?.some(effect => {
                // Skip immunity statusEffects - they're stat modifiers (check by name/description, not just level)
                if (effect.statusEffect) {
                    const effectName = (effect.name || '').toLowerCase();
                    const effectDesc = (effect.description || '').toLowerCase();
                    const statusEffect = effect.statusEffect;
                    // Check if this is an immunity-related effect (by name/description, any level)
                    const isImmunityRelated = (
                        effectName.includes('immunity') || 
                        effectName.includes('immune') ||
                        effectDesc.includes('immune') ||
                        effectDesc.includes('immunity') ||
                        (statusEffect.level === 'extreme' && (effectName.includes('immunity') || effectName.includes('immune')))
                    );
                    if (isImmunityRelated) return false; // Don't count immunity-related effects as active effects
                }
                // If it has statusEffect or buffType that's not a stat modifier, it's an active effect
                return effect.statusEffect || (effect.buffType && !effect.statModifier);
            }) ||
            trait.debuffConfig?.effects?.some(effect => {
                // Also check debuff effects for immunity-related status effects
                if (effect.statusEffect) {
                    const effectName = (effect.name || '').toLowerCase();
                    const effectDesc = (effect.description || '').toLowerCase();
                    const isImmunityRelated = (
                        effectName.includes('immunity') || 
                        effectName.includes('immune') ||
                        effectDesc.includes('immune') ||
                        effectDesc.includes('immunity')
                    );
                    if (isImmunityRelated) return false;
                }
                return effect.statusEffect && !effect.statModifier;
            }) ||
            // Allow utilityConfig if it's only survival/environmental (not combat utility)
            (trait.utilityConfig && trait.utilityConfig.utilityType !== 'survival') ||
            trait.controlConfig ||
            trait.healingConfig ||
            trait.damageConfig
        );
        
        // If it has active effects (excluding immunities and stat modifiers), it's a spell, not just a stat modifier
        if (hasActiveEffects) {
            return false;
        }
        
        // Return true if it has stat modifiers OR immunity statusEffects, and no action points
        // Passives with triggers (like Battle Fury) are still considered passives
        return (hasStatModifiers || hasImmunityStatusEffects) && hasNoActionPoints;
    }
    
    return false;
}

/**
 * Get all racial spells for a given race and subrace
 * Filters out passive stat modifiers (those are handled separately)
 * @param {string} raceId - The race ID
 * @param {string} subraceId - The subrace ID
 * @returns {Array} Array of spell objects (excluding passive stat modifiers)
 */
export function getRacialSpells(raceId, subraceId) {
    const spells = [];

    if (!raceId || !RACE_DATA[raceId]) {
        console.warn('⚠️ [getRacialSpells] Invalid raceId:', raceId);
        return spells;
    }

    // Get subrace data using the helper function (handles ID lookup correctly)
    if (subraceId) {
        const subraceData = getSubraceData(raceId, subraceId);
        
        // Verify we got the correct subrace
        if (subraceData && subraceData.id !== subraceId) {
            console.error('❌ [getRacialSpells] Subrace ID mismatch!', {
                requested: subraceId,
                received: subraceData.id,
                raceId
            });
            return spells; // Return empty array if ID mismatch
        }
        
        console.log('🔍 [getRacialSpells] Subrace data:', {
            raceId,
            subraceId,
            subraceName: subraceData?.name,
            subraceIdFromData: subraceData?.id,
            found: !!subraceData,
            traitsCount: subraceData?.traits?.length || 0,
            traitIds: subraceData?.traits?.map(t => t.id) || [],
            traitNames: subraceData?.traits?.map(t => t.name) || []
        });
        
        if (subraceData && subraceData.traits) {
            // Filter out passive stat modifiers - only return actual spells
            const allTraits = subraceData.traits;
            const statModifiers = allTraits.filter(trait => {
                const isPassive = isPassiveStatModifier(trait);
                if (!isPassive && trait.name === 'Deep Frost') {
                    console.warn('⚠️ [getRacialSpells] Deep Frost not identified as passive!', {
                        trait,
                        tags: trait.typeConfig?.tags,
                        spellType: trait.spellType,
                        hasImmunityStatusEffects: trait.buffConfig?.effects?.some(effect => {
                            const effectName = (effect.name || '').toLowerCase();
                            return effectName.includes('immunity') || effectName.includes('immune');
                        })
                    });
                }
                return isPassive;
            });
            const actualSpells = allTraits.filter(trait => !isPassiveStatModifier(trait));
            
            console.log('🔍 [getRacialSpells] Filtered traits:', {
                subraceName: subraceData.name,
                subraceId: subraceData.id,
                totalTraits: allTraits.length,
                statModifiersCount: statModifiers.length,
                statModifierNames: statModifiers.map(s => s.name),
                actualSpellsCount: actualSpells.length,
                actualSpellIds: actualSpells.map(s => s.id),
                actualSpellNames: actualSpells.map(s => s.name)
            });
            
            // Double-check: ensure we're not adding spells that don't belong to this subrace
            // Also filter out any spells that should be passives (safety check)
            const safeSpells = actualSpells.filter(spell => {
                if (spell.name === 'Deep Frost') {
                    console.error('❌ [getRacialSpells] Deep Frost should not be in spells list! Filtering out.');
                    return false;
                }
                return true;
            });
            spells.push(...safeSpells);
        } else {
            console.warn('⚠️ [getRacialSpells] No subrace data or traits found:', {
                raceId,
                subraceId,
                hasSubraceData: !!subraceData,
                hasTraits: !!subraceData?.traits
            });
        }
    } else {
        console.warn('⚠️ [getRacialSpells] No subraceId provided:', { raceId, subraceId });
    }

    return spells;
}

/**
 * Get passive stat modifiers from racial traits
 * These should be applied directly to character stats, not added as spells
 * @param {string} raceId - The race ID
 * @param {string} subraceId - The subrace ID
 * @returns {Array} Array of passive stat modifier objects
 */
export function getRacialStatModifiers(raceId, subraceId) {
    const modifiers = [];

    if (!raceId || !RACE_DATA[raceId]) {
        return modifiers;
    }

    // Get subrace data using the helper function (handles ID lookup correctly)
    if (subraceId) {
        const subraceData = getSubraceData(raceId, subraceId);
        if (subraceData && subraceData.traits) {
            // Only return passive stat modifiers
            const passiveModifiers = subraceData.traits.filter(trait => isPassiveStatModifier(trait));
            modifiers.push(...passiveModifiers);
        }
    }

    return modifiers;
}

/**
 * Get all discipline/path spells for a given path
 * @param {string} pathId - The path ID
 * @returns {Array} Array of spell objects
 */
export function getDisciplineSpells(pathId) {
    const spells = [];

    if (!pathId || !PATH_DATA_MAP[pathId]) {
        return spells;
    }

    const pathData = PATH_DATA_MAP[pathId];

    // Extract abilities from the path
    if (pathData.abilities) {
        spells.push(...pathData.abilities.map(normalizeDisciplineAbility));
    }

    return spells;
}

/**
 * Get all racial and discipline spells for a character
 * @param {string} raceId - The race ID
 * @param {string} subraceId - The subrace ID
 * @param {string} pathId - The path ID
 * @returns {Array} Array of all racial and discipline spell objects
 */
export function getAllCharacterSpells(raceId, subraceId, pathId) {
    const racialSpells = getRacialSpells(raceId, subraceId);
    const disciplineSpells = getDisciplineSpells(pathId);

    return [...racialSpells, ...disciplineSpells];
}

/**
 * Randomly select spells from choices during character creation
 * Some paths have multiple options where player chooses 1 out of 3, etc.
 * @param {Array} spells - Array of spell objects
 * @param {Object} choices - Object defining which spells to randomly select
 * @returns {Array} Array of selected spell objects
 */
export function selectRandomSpells(spells, choices = {}) {
    if (!spells || spells.length === 0) {
        return [];
    }

    // Group spells by their spellType
    const spellsByType = {};
    spells.forEach(spell => {
        const type = spell.spellType || 'UNKNOWN';
        if (!spellsByType[type]) {
            spellsByType[type] = [];
        }
        spellsByType[type].push(spell);
    });

    // For each spell type, randomly select based on choices
    // Default behavior: select 1 of each type (common for paths)
    const selectedSpells = [];

    Object.entries(spellsByType).forEach(([spellType, typeSpells]) => {
        const numToSelect = choices[spellType.toLowerCase()] || 1; // Default to 1

        if (numToSelect >= typeSpells.length) {
            // Select all if we want more than available
            selectedSpells.push(...typeSpells);
        } else {
            // Randomly select the specified number
            const shuffled = [...typeSpells].sort(() => 0.5 - Math.random());
            selectedSpells.push(...shuffled.slice(0, numToSelect));
        }
    });

    return selectedSpells;
}

/**
 * Add spells to the spell library context
 * @param {Function} dispatch - Spell library dispatch function
 * @param {Array} spells - Array of spell objects to add
 * @param {string} categoryName - Category name for the spells
 */
export function addSpellsToLibrary(dispatch, spells, categoryName = 'Character Abilities', existingSpells = []) {
    if (!dispatch || !spells || spells.length === 0) {
        console.warn('⚠️ [addSpellsToLibrary] Invalid parameters:', {
            hasDispatch: !!dispatch,
            spellCount: spells?.length || 0,
            categoryName
        });
        return;
    }

    // Filter out spells that already exist in the library
    const newSpells = filterNewSpells(spells, existingSpells);

    console.log('📚 [addSpellsToLibrary] Adding spells:', {
        totalSpells: spells.length,
        newSpellsCount: newSpells.length,
        existingSpellsCount: existingSpells.length,
        filteredOut: spells.length - newSpells.length,
        newSpellIds: newSpells.map(s => s.id),
        newSpellNames: newSpells.map(s => s.name),
        categoryName
    });

    if (newSpells.length === 0) {
        console.warn('⚠️ [addSpellsToLibrary] All spells were filtered out as duplicates');
        return;
    }

    newSpells.forEach(spell => {
        if (spell && spell.id) {
            // Create a modified spell with category information
            const categorizedSpell = {
                ...spell,
                categoryIds: [categoryName],
                source: 'character',
                dateCreated: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

            console.log('➕ [addSpellsToLibrary] Adding spell:', spell.id, spell.name);
            dispatch(libraryActionCreators.addSpell(categorizedSpell));
        }
    });
}

/**
 * Check if a spell is already in the spell library
 * @param {Array} existingSpells - Array of existing spells in library
 * @param {string} spellId - Spell ID to check
 * @returns {boolean} True if spell exists in library
 */
export function isSpellInLibrary(existingSpells, spellId) {
    if (!existingSpells || !spellId) {
        return false;
    }

    return existingSpells.some(spell => spell.id === spellId);
}

/**
 * Filter out spells that are already in the library
 * @param {Array} spells - Array of spells to filter
 * @param {Array} existingSpells - Array of existing spells in library
 * @returns {Array} Array of spells not already in library
 */
export function filterNewSpells(spells, existingSpells) {
    if (!spells) return [];
    if (!existingSpells) return spells;

    return spells.filter(spell => !isSpellInLibrary(existingSpells, spell.id));
}

/**
 * Remove spells from the spell library by category
 * @param {Function} dispatch - Spell library dispatch function
 * @param {string} categoryName - Category name of spells to remove
 * @param {Array} existingSpells - Array of existing spells in library
 */
export function removeSpellsByCategory(dispatch, categoryName, existingSpells) {
    if (!dispatch || !existingSpells || !categoryName) {
        return;
    }

    // Find spells with the matching category
    const spellsToRemove = existingSpells.filter(spell =>
        spell.categoryIds && spell.categoryIds.includes(categoryName)
    );

    // Remove each spell
    spellsToRemove.forEach(spell => {
        if (spell && spell.id) {
            dispatch(libraryActionCreators.deleteSpell(spell.id));
        }
    });
}
