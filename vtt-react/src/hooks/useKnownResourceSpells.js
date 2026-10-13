import { useMemo } from 'react';
import useCharacterStore from '../store/characterStore';
import { ALL_CLASS_SPELLS } from '../data/classSpellGenerator';

/**
 * useKnownResourceSpells
 *
 * Class menus must never assume a character has a particular spell: spells are
 * chosen level by level. This hook returns only the spells the *current*
 * character has actually learned (class_spells.known_spells) that spend or
 * build the given class resource, with the cost taken from the spell data.
 *
 * Returns { hasCharacter, spenders, builders }.
 *  - hasCharacter is false when the current character is not of this class
 *    (rules previews, another player's bar). Menus then show no spell list.
 *  - spenders: [{ id, name, cost, level }] sorted by cost
 *  - builders: [{ id, name, gain, level }] ("gain" may be a dice string)
 */
export default function useKnownResourceSpells(className, resourceTypes = []) {
    const characterClass = useCharacterStore(state => state.class);
    const knownIds = useCharacterStore(state => state.class_spells?.known_spells);
    const typesKey = resourceTypes.join('|');

    return useMemo(() => {
        const empty = { hasCharacter: false, spenders: [], builders: [] };
        if (!className || !characterClass || characterClass !== className) return empty;
        const known = new Set(Array.isArray(knownIds) ? knownIds : []);
        const types = new Set(typesKey ? typesKey.split('|') : []);
        const spenders = [];
        const builders = [];
        (ALL_CLASS_SPELLS[className] || []).forEach((spell) => {
            if (!spell?.id || !known.has(spell.id)) return;
            const res = spell.resourceCost?.classResource;
            if (!res || (types.size && res.type && !types.has(res.type))) return;
            const entry = { id: spell.id, name: spell.name, level: spell.level || 1, type: res.type };
            const cost = Number(res.cost);
            if (typeof res.cost === 'string' && res.cost.toUpperCase() === 'ALL') spenders.push({ ...entry, cost: 'All', costValue: 1 });
            else if (Number.isFinite(cost) && cost > 0) spenders.push({ ...entry, cost, costValue: cost });
            else if (Number.isFinite(cost) && cost < 0) builders.push({ ...entry, gain: -cost });
            else if (res.gain !== undefined && res.gain !== null && res.gain !== 0) builders.push({ ...entry, gain: res.gain });
        });
        spenders.sort((a, b) => a.costValue - b.costValue || a.name.localeCompare(b.name));
        builders.sort((a, b) => String(a.gain).localeCompare(String(b.gain), undefined, { numeric: true }) || a.name.localeCompare(b.name));
        return { hasCharacter: true, spenders, builders };
    }, [className, characterClass, knownIds, typesKey]);
}
