/**
 * P11 — player-facing skill progression wording for character creation and the sheet.
 *
 * Mirrors the P10 Laws (public/data/rules.json, components/rules/SkillsDisplay.jsx)
 * and the creator-confirmed rules: Standard ranks are player-set through training
 * and story; Advanced ranks advance through authored tasks; the proficiency die
 * grows d4 → d20; budget, check resolution, explosion, modifiers and face mapping
 * stay [Open]. Change wording here, not in each component.
 */
import { SKILL_RANKS } from './skillDefinitions';
import { WEAPON_TYPE_TIERS } from './weaponTypeSimpleTables';
import { TOTAL_COST_TO_RANK, BASE_SKILL_POINTS } from './skillPointSystem';

const RANK_KEYS = Object.keys(SKILL_RANKS);

/** Die size per rank, read from the authored weapon tiers (the confirmed ladder). */
export const PROFICIENCY_DIE_BY_RANK = Object.freeze(RANK_KEYS.reduce((ladder, rankKey) => {
    const dice = Object.values(WEAPON_TYPE_TIERS).filter(tier => tier.rankReq === rankKey).map(tier => tier.dieReq);
    return dice.length ? { ...ladder, [rankKey]: Math.max(...dice) } : ladder;
}, {}));

export const proficiencyDieLadderText = () => RANK_KEYS
    .filter(rankKey => PROFICIENCY_DIE_BY_RANK[rankKey])
    .map(rankKey => `d${PROFICIENCY_DIE_BY_RANK[rankKey]} ${SKILL_RANKS[rankKey].name}`)
    .join(', ');

export const SKILL_OPEN_RULES = Object.freeze({
    rollFormula: '[Open: whether stat and rank modifiers are added and whether the die explodes. The sheet shows its current formula; the GM rules until it is decided.]',
    checkResolution: '[Open: fixed DCs (Standard) or a GM Difficulty Die (Advanced). The GM rules until it is decided.]',
    explosion: '[Open: whether the die explodes is not confirmed. The GM rules until it is decided.]',
    rankBonus: '[Open: whether a rank adds a flat bonus to checks as well as setting your die. The GM rules until it is decided.]',
    weaponFaces: "[Open: whether a modifier is added to the proficiency roll, whether it explodes, and how a result maps onto the weapon table's faces 1–20.]",
    budget: '[Open: the starting budget and any bonus points are not yet confirmed.]'
});

export const STANDARD_ADVANCEMENT_TEXT = "When your character trains or the story changes them, raise this skill yourself. Ranks don't follow your level, and you don't need the GM's approval.";

export const ADVANCED_ADVANCEMENT_TEXT = "Advanced Skills: completing authored tasks (Skill Quests) raises this rank. Rolls and outcome tables are the same as Standard. A task's listed unlocks are applied by the GM; the VTT does not grant them.";

export const SKILL_VTT_SCOPE = 'The VTT stores your ranks and rolls the die you choose. It does not apply skill or weapon results in combat; the GM does.';

export const WEAPON_PROFICIENCY_TEXT = `Each weapon type has its own rank, and its die grows with rank (${proficiencyDieLadderText()}). The attack card, your rank with that weapon type and the weapon's outcome table are separate. ${SKILL_VTT_SCOPE}`;

const costSteps = () => RANK_KEYS.slice(1).map((rankKey, index) => TOTAL_COST_TO_RANK[rankKey] - TOTAL_COST_TO_RANK[RANK_KEYS[index]]);

/**
 * Point-buy summary. Costs and base pool are read from skillPointSystem.js; the
 * Intelligence term describes calculateTotalSkillPoints (+1 per point above 10).
 * Its background/race bonus tables match no current background or heritage ID,
 * so no bonus is described; the budget remains [Open].
 */
export const pointBuyText = () => {
    const steps = costSteps();
    const master = TOTAL_COST_TO_RANK.MASTER;
    return `At creation you buy starting ranks with training points: ${steps[0]} point to reach Novice, then ${steps.slice(1).join(', ')} for each rank after it (${master} in total for Master). `
        + `You start with ${BASE_SKILL_POINTS} points plus 1 for each point of Intelligence above 10. `
        + "Your background's skills and your class skill start at Novice, paid from the same points. "
        + 'Weapon Mastery is bought per weapon type. '
        + SKILL_OPEN_RULES.budget;
};
