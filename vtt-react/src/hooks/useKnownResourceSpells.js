import { useMemo } from 'react';
import useCharacterStore from '../store/characterStore';
import { ALL_CLASS_SPELLS } from '../data/classSpellGenerator';
import { normalizeManagedClassResource, getManagedSpellResourcePlan } from '../data/classResourceContracts';
import { resolveClassResourceEngineId } from '../data/classResourceAliases';

/**
 * useKnownResourceSpells
 *
 * Class menus must never assume a character has a particular spell: spells are
 * chosen level by level. This hook returns only the spells the *current*
 * character has learned (class_spells.known_spells) whose cast actually changes
 * the class resource.
 *
 * Costs come from the same planner the action bar uses when the spell is cast
 * (getManagedSpellResourcePlan, then the generic classResource fallback), so the
 * menu can never promise a cost or gain that casting does not apply.
 *
 * Returns { hasCharacter, spenders, builders }.
 *  - hasCharacter is false when the current character is not of this class
 *    (rules previews, another player's bar). Menus then show no spell list.
 *  - spenders: [{ id, name, level, cost, required, affordable, short, label }]
 *  - builders: [{ id, name, level, gain, label }]
 */
export function planKnownResourceSpells(className, knownIds, classResource, resourceTypes = []) {
    const known = new Set(Array.isArray(knownIds) ? knownIds : []);
    const types = new Set(resourceTypes);
    const resource = normalizeManagedClassResource(classResource || {}, className);
    const spenders = [];
    const builders = [];

    (ALL_CLASS_SPELLS[className] || []).forEach((spell) => {
        if (!spell?.id || !known.has(spell.id)) return;
        const base = { id: spell.id, name: spell.name, level: spell.level || 1 };
        const plan = getManagedSpellResourcePlan(spell, resource, className);

        if (plan.handled) {
            // Bank resources (notes, spheres) are lists, not numbers; those classes have their own panels.
            if (plan.bank) return;
            // No type filter here: the planner already picks the right pool (Vials vs Parts,
            // Light vs Dark) and names it in plan.label, which the menu shows beside the cost.
            const cost = Number(plan.cost) || 0;
            const gain = Number(plan.gain) || 0;
            const required = Number(plan.required) || 0;
            const current = Number(plan.current) || 0;
            if (cost > 0 || required > 0) {
                spenders.push({
                    ...base, cost, required, label: plan.label,
                    affordable: !!plan.affordable,
                    short: Math.max(0, Math.max(cost, required) - current)
                });
            }
            if (gain > 0) builders.push({ ...base, gain, label: plan.label });
            return;
        }

        // Same generic path the action bar takes for Tension, Authority, Resonance and similar.
        const generic = spell.resourceCost?.classResource || {};
        if (!generic.type || resolveClassResourceEngineId(generic.type) === 'timeShardsStrain') return;
        if (types.size && !types.has(generic.type)) return;
        const raw = Number(generic.cost || 0);
        if (!Number.isFinite(raw) || raw === 0) return;
        const current = Number(resource?.current ?? classResource?.current ?? 0) || 0;
        if (raw > 0) spenders.push({ ...base, cost: raw, required: 0, label: '', affordable: current >= raw, short: Math.max(0, raw - current) });
        else builders.push({ ...base, gain: -raw, label: '' });
    });

    spenders.sort((a, b) => Math.max(a.cost, a.required) - Math.max(b.cost, b.required) || a.name.localeCompare(b.name));
    builders.sort((a, b) => a.gain - b.gain || a.name.localeCompare(b.name));
    return { spenders, builders };
}

export default function useKnownResourceSpells(className, resourceTypes = []) {
    const characterClass = useCharacterStore(state => state.class);
    const knownIds = useCharacterStore(state => state.class_spells?.known_spells);
    const classResource = useCharacterStore(state => state.classResource);
    const typesKey = resourceTypes.join('|');

    return useMemo(() => {
        if (!className || !characterClass || characterClass !== className) {
            return { hasCharacter: false, spenders: [], builders: [] };
        }
        const types = typesKey ? typesKey.split('|') : [];
        return { hasCharacter: true, ...planKnownResourceSpells(className, knownIds, classResource, types) };
    }, [className, characterClass, knownIds, classResource, typesKey]);
}
