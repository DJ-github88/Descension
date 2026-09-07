/**
 * Race and Discipline Spell Utilities
 *
 * Utility functions to extract and manage spells from race/subrace and discipline/path data
 */

// Import race data
import { RACE_DATA, getSubraceData, getFullRaceData } from '../data/raceData';

// Import spell library context (avoid circular import by importing at top)
import { libraryActionCreators } from '../components/spellcrafting-wizard/context/SpellLibraryContext';

// Normalize discipline abilities to use allowed resources/damage types (stub)
export const normalizeDisciplineAbility = (ability = {}) => {
    return ability;
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
    
    // Defensive catch-all: any passive trait that clearly represents a resistance/vulnerability
    // should be treated as a stat modifier even if its tags are incomplete
    const idIndicatesResistance =
        (trait.id || '').toLowerCase().includes('resistance') || (trait.id || '').toLowerCase().includes('vulnerability') || (trait.id || '').toLowerCase().includes('immunity');
    const nameIndicatesResistance =
        (trait.name || '').toLowerCase().includes('resistance') || (trait.name || '').toLowerCase().includes('vulnerability') || (trait.name || '').toLowerCase().includes('immunity');
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
    const traitName = (trait.name || '').toLowerCase();
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

        // Must not have action points (triggers are allowed for passives)
        const hasNoActionPoints = (!trait.resourceCost?.actionPoints || trait.resourceCost.actionPoints === 0);
        
        // A passive is rendered as a plain passive entry (not a spell card) unless it has
        // genuine *active* combat configuration. Status-effect / buffType passives
        // (triggered, sensory, immunity, etc.) are plain passives and should be laid out
        // consistently with other racial passives.
        const hasActiveEffects = (
            (trait.utilityConfig && trait.utilityConfig.utilityType !== 'survival') ||
            trait.controlConfig ||
            trait.healingConfig ||
            trait.damageConfig
        );

        // Any PASSIVE with no action-point cost and no active combat config is a plain passive.
        // This keeps subrace passives uniform instead of rendering some as spell cards.
        return hasNoActionPoints && !hasActiveEffects;
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
        return spells;
    }

    const fullRaceData = getFullRaceData(raceId, subraceId);
    if (!fullRaceData || !fullRaceData.combinedTraits?.traits) {
        return spells;
    }

    const allTraits = fullRaceData.combinedTraits.traits;
    const actualSpells = allTraits.filter(trait => !isPassiveStatModifier(trait));
    spells.push(...actualSpells);

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

    const fullRaceData = getFullRaceData(raceId, subraceId);
    if (!fullRaceData || !fullRaceData.combinedTraits?.traits) {
        return modifiers;
    }

    const passiveModifiers = fullRaceData.combinedTraits.traits.filter(trait => isPassiveStatModifier(trait));
    modifiers.push(...passiveModifiers);

    return modifiers;
}

/**
 * Get all discipline/path spells for a given path
 * @param {string} pathId - The path ID
 * @returns {Array} Array of spell objects
 */
export function getDisciplineSpells(pathId) {
    // Disciplines have been removed from the system - always return empty array
    const spells = [];
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
