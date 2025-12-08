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

/**
 * Check if a trait should be treated as a passive stat modifier (not a spell)
 * @param {Object} trait - The trait object to check
 * @returns {boolean} True if it should be a stat modifier, false if it should be a spell
 */
function isPassiveStatModifier(trait) {
    // Passive abilities that should be stats, not spells:
    // - PASSIVE spellType with only stat modifiers (no active abilities)
    // - Resistances, vulnerabilities, or other permanent stat changes
    if (!trait) return false;
    
    // NEVER filter out REACTION, ACTION, CHANNELED, or other active spell types
    if (trait.spellType && trait.spellType !== 'PASSIVE') {
        return false;
    }
    
    // Check tags first - if it has resistance/vulnerability tags, it's a stat modifier
    const tags = trait.typeConfig?.tags || trait.tags || [];
    const isResistanceOrVulnerability = tags.some(tag => 
        ['resistance', 'vulnerability'].includes(tag.toLowerCase())
    );
    
    if (isResistanceOrVulnerability) {
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
        // Immunities are statusEffects with level 'extreme' that grant permanent immunities
        const hasImmunityStatusEffects = trait.buffConfig?.effects?.some(effect => {
            if (!effect.statusEffect) return false;
            const statusEffect = effect.statusEffect;
            const effectName = (effect.name || '').toLowerCase();
            const effectDesc = (effect.description || '').toLowerCase();
            
            // Check if this is an immunity (level 'extreme' and name/description indicates immunity)
            const isImmunity = (
                statusEffect.level === 'extreme' &&
                (effectName.includes('immunity') || 
                 effectName.includes('immune') ||
                 effectDesc.includes('immune') ||
                 effectDesc.includes('immunity'))
            );
            
            return isImmunity;
        });
        
        // Must not have active triggers or action points
        const hasNoActiveFeatures = (
            !trait.triggerConfig?.global?.enabled &&
            (!trait.resourceCost?.actionPoints || trait.resourceCost.actionPoints === 0)
        );
        
        // Check for other active effects (excluding immunity statusEffects)
        // If it has non-immunity statusEffect, buffConfig effects, or other active effects, keep it as a spell
        const hasActiveEffects = (
            trait.buffConfig?.effects?.some(effect => {
                // Skip immunity statusEffects - they're stat modifiers
                if (effect.statusEffect) {
                    const effectName = (effect.name || '').toLowerCase();
                    const effectDesc = (effect.description || '').toLowerCase();
                    const isImmunity = (
                        effect.statusEffect.level === 'extreme' &&
                        (effectName.includes('immunity') || 
                         effectName.includes('immune') ||
                         effectDesc.includes('immune') ||
                         effectDesc.includes('immunity'))
                    );
                    if (isImmunity) return false; // Don't count immunities as active effects
                }
                return effect.statusEffect || effect.buffType;
            }) ||
            trait.debuffConfig?.effects?.some(effect => effect.statusEffect) ||
            trait.utilityConfig ||
            trait.controlConfig ||
            trait.healingConfig ||
            trait.damageConfig
        );
        
        // If it has active effects (excluding immunities), it's a spell, not just a stat modifier
        if (hasActiveEffects) {
            return false;
        }
        
        // Return true if it has stat modifiers OR immunity statusEffects, and no active features
        return (hasStatModifiers || hasImmunityStatusEffects) && hasNoActiveFeatures;
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
        console.log('🔍 [getRacialSpells] Subrace data:', {
            raceId,
            subraceId,
            found: !!subraceData,
            traitsCount: subraceData?.traits?.length || 0,
            traitIds: subraceData?.traits?.map(t => t.id) || []
        });
        
        if (subraceData && subraceData.traits) {
            // Filter out passive stat modifiers - only return actual spells
            const allTraits = subraceData.traits;
            const statModifiers = allTraits.filter(trait => isPassiveStatModifier(trait));
            const actualSpells = allTraits.filter(trait => !isPassiveStatModifier(trait));
            
            console.log('🔍 [getRacialSpells] Filtered traits:', {
                totalTraits: allTraits.length,
                statModifiersCount: statModifiers.length,
                actualSpellsCount: actualSpells.length,
                actualSpellIds: actualSpells.map(s => s.id),
                actualSpellNames: actualSpells.map(s => s.name)
            });
            
            spells.push(...actualSpells);
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
        spells.push(...pathData.abilities);
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
export function addSpellsToLibrary(dispatch, spells, categoryName = 'Character Abilities') {
    if (!dispatch || !spells || spells.length === 0) {
        return;
    }

    spells.forEach(spell => {
        if (spell && spell.id) {
            // Create a modified spell with category information
            const categorizedSpell = {
                ...spell,
                categoryIds: [categoryName],
                source: 'character',
                dateCreated: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

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
