import { ALL_CLASSES_DATA } from '../data/classes';
import { initializeClassResource } from '../data/classResources';
import { pruneTalentsForChange, removedTalentGrantIds } from './characterSlices/progressionSlice';

/**
 * Build the class-owned part of a wizard edit that changes the character's
 * calling. Existing class nodes are removed, the new class allocation is
 * pruned to the character level, and incompatible specialization/resource
 * state is replaced before the save is written.
 */
export const buildClassSwitchPatch = (existingCharacter, nextClass, options = {}) => {
    const previousClass = existingCharacter?.class || '';
    if (!existingCharacter || !nextClass || nextClass === previousClass) return null;

    const level = Number.isInteger(options.level)
        ? options.level
        : (Number.isInteger(existingCharacter.level) ? existingCharacter.level : 1);
    const currentTalents = existingCharacter.talents || {};
    const talents = pruneTalentsForChange(currentTalents, {
        previousClass,
        nextClass,
        level
    });
    const removedGrantIds = removedTalentGrantIds(currentTalents, talents, previousClass);
    const classData = ALL_CLASSES_DATA[nextClass];
    const knownSpells = Array.isArray(options.classSpells)
        ? options.classSpells
        : (classData?.progression?.policy?.grantedCoreSpellIds || []);
    const stats = options.stats || existingCharacter.stats || {};
    // Health/mana/attribute gains remain valid across callings; spell picks
    // learned for the old calling do not and must not suppress the new class's
    // starting quota when the save is reopened.
    const levelUpHistory = Object.fromEntries(
        Object.entries(existingCharacter.levelUpHistory || {}).map(([levelKey, entry]) => {
            if (!entry || typeof entry !== 'object') return [levelKey, entry];
            const { spellId, ...rest } = entry;
            return [levelKey, rest];
        })
    );

    return {
        patch: {
            class: nextClass,
            class_spells: { known_spells: [...knownSpells] },
            talents,
            classResource: initializeClassResource(nextClass, { ...stats, level }),
            primarySpecialization: '',
            selectedAbility: '',
            levelUpHistory
        },
        removedGrantIds
    };
};
