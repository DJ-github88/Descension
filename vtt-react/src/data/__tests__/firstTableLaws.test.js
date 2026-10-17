/**
 * Project 10 — first-table Laws read their numbers from the owning runtime values.
 * Data-to-summary checks: each published figure is derived from the code that
 * executes it, not from a second copy of the literal.
 */
import fs from 'fs';
import path from 'path';
import { calculateCarryingCapacity, getInventoryGridDimensions, calculateDerivedStats } from '../../utils/characterUtils';
import { TALENT_SYSTEM } from '../talentTrees/talentSystem.mjs';
import { getXPForLevel } from '../../utils/experienceUtils';
import { GAMBIT_FORTUNE_MAX, GAMBIT_DEBT_MAX } from '../classResourceContracts';
import { PYRO_VEIL_MAX, PYRO_DEBT_CALL_TURNS } from '../pyrofiendResourceContract';
import { SPELLGUARD_AEP_MAX, SPELLGUARD_INTAKE_MODES } from '../spellguardResourceContract';
import { PC_BASE_ACTION_POINTS, BASIC_WEAPON_STRIKE_AP, DEFEND_AP, ELIXIR_AP, DEFAULT_AP_RESTORATION_MODE, restoredActionPoints } from '../firstTableRules';
import { getRaceList, getSubraceList, getRacialBaseStats } from '../raceData';
import { UNIVERSAL_COMBAT_SPELLS } from '../universalCombatSpells';
import { DATA_VERSIONS } from '../versions';
import { CLASS_DATA_MAP } from '../classSpellGenerator';
import { supportSpell } from '../../services/spellConsequence';
import { BASE_SKILL_POINTS, SKILL_RANK_UPGRADE_COSTS, TOTAL_COST_TO_RANK, SKILL_POINT_BONUSES, calculateTotalSkillPoints, calculatePointsSpent } from '../../constants/skillPointSystem';
import { BACKGROUND_DATA } from '../backgroundData';
import { RACE_DATA } from '../raceData';
import { WEAPON_TYPE_TIERS, WEAPON_TYPE_SIMPLE_TABLES } from '../../constants/weaponTypeSimpleTables';

const DATA = path.resolve(__dirname, '../../../public/data');
const rules = JSON.parse(fs.readFileSync(path.join(DATA, 'rules.json'), 'utf8'));
const lore = JSON.parse(fs.readFileSync(path.join(DATA, 'lore.json'), 'utf8'));
const abilities = JSON.parse(fs.readFileSync(path.join(DATA, 'abilities.json'), 'utf8'));
const page = (cat, sub) => rules.find(c => c.id === cat).subcategories.find(s => s.id === sub);
const text = node => JSON.stringify(node);
const allText = text(rules);

describe('P10 inventory page follows the pack grid code', () => {
  const inv = page('core-rules', 'inventory-encumbrance');
  test('Strength table rows equal getInventoryGridDimensions(calculateCarryingCapacity(STR))', () => {
    const rows = inv.content.tables[1].rows;
    expect(rows).toHaveLength(7);
    rows.forEach(([band, grid, slots]) => {
      const low = parseInt(band, 10);
      const dims = getInventoryGridDimensions(calculateCarryingCapacity(low));
      const high = getInventoryGridDimensions(calculateCarryingCapacity(low + 1));
      expect(high).toEqual(dims);
      expect(grid).toBe(`${dims.WIDTH} × ${dims.HEIGHT}`);
      expect(slots).toBe(`${dims.WIDTH * dims.HEIGHT} Slots`);
    });
    const base = getInventoryGridDimensions(calculateCarryingCapacity(10));
    expect(inv.quickFacts[0].value).toBe(`${base.WIDTH} × ${base.HEIGHT} (${base.WIDTH * base.HEIGHT} slots)`);
    expect(text(inv)).not.toMatch(/5 columns by 15 rows|vertical column \(15 slots\)/);
  });
  test('zone effects equal calculateDerivedStats encumbrance multipliers', () => {
    const stats = { strength: 20, constitution: 20, agility: 20, intelligence: 20, spirit: 20, charisma: 20 };
    const speed = state => calculateDerivedStats(stats, {}, { movementSpeed: 10 }, state).moveSpeed;
    const pct = (a, b) => Math.round(100 - (100 * a) / b);
    const enc = calculateDerivedStats(stats, {}, {}, 'encumbered').encumbranceEffects;
    const over = calculateDerivedStats(stats, {}, {}, 'overencumbered').encumbranceEffects;
    const zones = inv.content.tables[0].rows;
    expect(zones[1][2]).toContain(`-${pct(speed('encumbered'), speed('normal'))}% Movement Speed`);
    expect(zones[2][2]).toContain(`-${pct(speed('overencumbered'), speed('normal'))}% Movement Speed`);
    expect(zones[1][2]).toContain(`Constitution scores +${Math.round((enc.constitutionMultiplier - 1) * 100)}%`);
    expect(zones[1][2]).toContain(`scores -${Math.round((1 - enc.baseStatMultiplier) * 100)}%`);
    expect(zones[2][2]).toContain(`Constitution scores +${Math.round((over.constitutionMultiplier - 1) * 100)}%`);
    expect(zones[2][2]).toContain(`scores -${Math.round((1 - over.baseStatMultiplier) * 100)}%`);
  });
});

describe('P10 talents and advancement follow the live progression code', () => {
  test('talent page states TALENT_SYSTEM values and no longer says talents are unavailable', () => {
    const t = text(page('magic-system', 'talents'));
    expect(t).toContain(`**${TALENT_SYSTEM.TALENT_POINTS_PER_LEVEL} Talent Points**`);
    expect(t).toContain(`**${TALENT_SYSTEM.TOTAL_TALENT_POINTS} points** by the level cap of ${TALENT_SYSTEM.LEVEL_CAP}`);
    expect(t).toContain(`**${TALENT_SYSTEM.TREES_PER_CLASS} talent trees**`);
    expect(t).toContain(`**${TALENT_SYSTEM.TIER_COUNT} tiers**`);
    expect(t).toContain(`Tier 7 at ${TALENT_SYSTEM.FINAL_TIER_REQUIREMENT}`);
    expect(t).toContain(TALENT_SYSTEM.ALLOWED_MAX_RANKS.slice(0, -1).join(', ') + ' or ' + TALENT_SYSTEM.ALLOWED_MAX_RANKS.slice(-1));
    expect(allText).not.toMatch(/not yet available in active play|\*\*1 Talent Point\*\*|\+1 talent point/);
  });
  test('XP table totals equal getXPForLevel for every level up to the cap', () => {
    const rows = page('professions-advancement', 'experience').content.tables[0].rows;
    expect(rows).toHaveLength(TALENT_SYSTEM.LEVEL_CAP);
    rows.forEach(([level, , total]) => expect(Number(total.replace(/,/g, ''))).toBe(getXPForLevel(Number(level))));
  });
  test('level-up rewards equal the level-up modal and talent tree', () => {
    const modal = fs.readFileSync(path.resolve(__dirname, '../../components/modals/LevelUpChoiceModal.jsx'), 'utf8');
    const points = Number(modal.match(/const TOTAL_POINTS = (\d+);/)[1]);
    const hp = Number(modal.match(/healthCount \* (\d+)/)[1]);
    const mana = Number(modal.match(/manaCount \* (\d+)/)[1]);
    const tree = fs.readFileSync(path.resolve(__dirname, '../../components/talent-tree/TalentTreeContent.jsx'), 'utf8');
    expect(tree).toContain(`Math.min((level || 1) * ${TALENT_SYSTEM.TALENT_POINTS_PER_LEVEL}, ${TALENT_SYSTEM.TOTAL_TALENT_POINTS})`);
    const xp = page('professions-advancement', 'experience').content.sections[1].content;
    const attrs = page('professions-advancement', 'attributes-advancement').content.sections[0].content;
    for (const t of [xp, attrs]) {
      expect(t).toContain(`**2 advancement points**`.replace('2', points));
      expect(t).toContain(`+${hp} maximum HP`);
      expect(t).toContain(`+${mana} maximum mana`);
    }
    expect(xp).toContain(`**${TALENT_SYSTEM.TALENT_POINTS_PER_LEVEL} talent points**`);
    expect(attrs).not.toMatch(/12, 16|feat|multiclass/);
  });
});

describe('P10 AP baseline (creator decision 1A)', () => {
  test('every heritage resolves to the first-table PC base AP', () => {
    const seen = [];
    getRaceList().forEach(race => getSubraceList(race.id).forEach(sub => {
      seen.push(getRacialBaseStats(race.id, sub.id).ap);
    }));
    expect(seen.length).toBeGreaterThan(10);
    expect(new Set(seen)).toEqual(new Set([PC_BASE_ACTION_POINTS]));
  });
  test('the tracker refills to maximum by default; the initiative variant is opt-in', () => {
    expect(DEFAULT_AP_RESTORATION_MODE).toBe('max');
    expect(restoredActionPoints(undefined, PC_BASE_ACTION_POINTS, 3)).toBe(PC_BASE_ACTION_POINTS);
    expect(restoredActionPoints({ apRestorationMode: 'initiative' }, 4, 3)).toBe(0);
    expect(restoredActionPoints({ apRestorationMode: 'set', apRestorationAmount: 9 }, 4, 3)).toBe(4);
  });
  test('cards and Laws agree on strike, Defend and elixir costs; authored ability costs are untouched', () => {
    const card = id => UNIVERSAL_COMBAT_SPELLS.find(spell => spell.id === id);
    expect(card('universal_attack').resourceCost.actionPoints).toBe(BASIC_WEAPON_STRIKE_AP);
    expect(card('universal_defend').resourceCost.actionPoints).toBe(DEFEND_AP);
    expect(card('universal_defend').spellType).toBe('ACTION');
    const basics = page('combat-system', 'combat-basics');
    expect(basics.quickFacts[0].value).toBe(`${PC_BASE_ACTION_POINTS} AP`);
    expect(basics.quickFacts[2].value).toBe(`${BASIC_WEAPON_STRIKE_AP} AP`);
    expect(basics.content.tables[0].rows.find(r => r[0]?.spellId === 'universal_defend')[3]).toBe(`${DEFEND_AP} AP`);
    expect(text(basics)).toContain(`**${ELIXIR_AP} AP**`);
    let feather;
    JSON.stringify(abilities, (k, v) => { if (v && v.id === 'grimmstalk_feather_slash') feather = v; return v; });
    const first = text(page('getting-started', 'first-table'));
    expect(first).toContain(`Feather Slash** (${feather.resourceCost.actionPoints} AP, melee ${feather.targetingConfig.rangeDistance} ft`);
    expect(first).toContain(feather.damageConfig.formula);
    expect(allText).not.toMatch(/3 Action Points|\*\*3 AP\*\*|Casting a spell costs 1-3 AP/);
  });
});

describe('P10 defense Laws (creator decision 2A)', () => {
  test('rejected Armor Score / soak mechanics are gone; unresolved items stay marked', () => {
    expect(allText).not.toMatch(/Armor Score - 10|Active Soak Die|Soak Die\*\*|passive DR by 2|Passive DR reduced|Passive DR absorbs|ignores the target's passive DR/);
    const ad = text(page('combat-system', 'attacks-damage'));
    expect(ad).toContain('No Armor Score, no soak die');
    expect(ad).toMatch(/\[Open: whether criticals also go around shields/);
    expect(text(page('combat-system', 'reactions'))).toMatch(/\[Open: new wording; this line conflicts with shields wearing only on a 1/);
    expect(text(page('combat-system', 'reactions'))).toContain('[Proposed:');
    expect(text(page('getting-started', 'first-table'))).toMatch(/\[Open: criticals against shields/);
    expect(allText).not.toMatch(/armor bonus/i);
  });
});

describe('P10 support matrix matches the executed P8/P9 sets', () => {
  test('the four named spells are exactly the authored spells with a supported P9 shape and payer', () => {
    // Same positive-support probe as the accepted P9 suite: a caster who owns each class bank.
    const stats = { strength: 12, agility: 11, constitution: 13, intelligence: 16, spirit: 14, charisma: 9 };
    const supported = [];
    Object.entries(CLASS_DATA_MAP).forEach(([cls, data]) => (data?.spells || []).forEach(spell => {
      const classResource = cls === 'Arcanoneer' ? { type: 'elementalSpheres', spheres: ['arcane', 'arcane'] }
        : cls === 'Minstrel' ? { type: 'musicalNotes', notes: [1, 1, 1, 1, 1, 1, 1] }
          : cls === 'Martyr' ? { type: 'devotionGauge', damage: 62, spentLevels: 2 } : undefined;
      const result = supportSpell(spell, { class: cls, classResource, stats });
      if (result.supported) supported.push(result.name);
    }));
    const listed = ['Marrow-Piercing Slug', 'Restorative Prayer', 'Opening Chord', 'Harmonic Strike'];
    expect([...new Set(supported)].sort()).toEqual([...listed].sort());
    const tracker = text(page('combat-system', 'combat-tracker'));
    listed.forEach(name => expect(tracker).toContain(name));
  });
});

describe('P10 resource summaries follow the class contracts', () => {
  test('Gambit, Pyrofiend and Spellguard rows carry the contract bounds and Gambit appears once', () => {
    const classes = page('character-creation', 'classes').content.tables[0].rows;
    const resources = page('magic-system', 'magic-resources').content.tables[1].rows;
    expect(classes.filter(r => r[0] === 'Gambit')).toHaveLength(1);
    expect(resources.filter(r => r[1] === 'Gambit')).toHaveLength(1);
    const r = name => text(resources.find(row => row[1] === name));
    expect(r('Gambit')).toContain(`0-${GAMBIT_FORTUNE_MAX}`);
    expect(r('Gambit')).toContain(`0-${GAMBIT_DEBT_MAX}`);
    expect(r('Pyrofiend')).toContain(`0 to ${PYRO_VEIL_MAX}`);
    expect(r('Pyrofiend')).toContain(['', 'one', 'two', 'three'][PYRO_DEBT_CALL_TURNS] + ' of your own turns');
    expect(r('Spellguard')).toContain(`0-${SPELLGUARD_AEP_MAX}`);
    SPELLGUARD_INTAKE_MODES.forEach(mode => expect(r('Spellguard')).toContain(mode));
  });
});

describe('P10 canon, links and cache revision', () => {
  test('changed lexicon entries keep their ids and links and drop scrapped claims', () => {
    ['the_deepening', 'the_breach', 'viridian'].forEach(id => {
      expect(lore[id].id).toBe(id);
      lore[id].relatedTerms.forEach(term => expect(lore[term] || rules.some(c => c.id === term)).toBeTruthy());
    });
    const changed = text([lore.the_deepening, lore.the_breach, lore.viridian]);
    expect(changed).not.toMatch(/cleansing key the scholars|true seventh keystone|dropped the mask and ate them|twenty-five years inside mortal councils/);
  });
  test('class headline canon follows the approved blueprint', () => {
    const read = f => fs.readFileSync(path.resolve(__dirname, '../classes', f), 'utf8');
    expect(read('arcanoneerData.js')).not.toMatch(/Valerius<\/LoreLink> drafted the First Contract|who drafted the First Contract/);
    expect(read('shaperData.js')).not.toMatch(/status: `Deceased\. Veyra/);
    const minstrel = read('minstrelData.js');
    expect(minstrel).not.toMatch(/Reality's Death Rattle|tears music from dying dimensions|resonance of dying realities/);
  });
  test('every rules link in the P10 pages resolves to a live page', () => {
    const ids = new Set(rules.flatMap(c => c.subcategories.map(s => `${c.id}/${s.id}`)));
    const links = [...allText.matchAll(/\]\(([a-z0-9-]+\/[a-z0-9-]+)\)/g)].map(m => m[1]);
    const p10 = ['combat-system/combat-tracker', 'combat-system/attacks-damage', 'magic-system/talents', 'combat-system/combat-basics', 'core-rules/character-statistics'];
    p10.forEach(link => expect(ids.has(link)).toBe(true));
    expect(links.filter(link => !ids.has(link) && p10.includes(link))).toEqual([]);
  });
  test('rules and lore cache versions are bumped so the new text reaches the codex', () => {
    expect(DATA_VERSIONS.rules).toBe('2.3.0');
    expect(DATA_VERSIONS.lore).toBe('2.3.0');
  });
});

describe('P10: no Armor score on player-facing sheets and tooltips (creator-confirmed)', () => {
  const src = rel => fs.readFileSync(path.resolve(__dirname, '../..', rel), 'utf8');
  test('sheet cards, item lists and stat tooltips no longer show an Armor score', () => {
    const tooltip = src('components/tooltips/GeneralStatTooltip.jsx');
    expect(tooltip).not.toMatch(/'Armor': \{|Armor ÷ 10|Passive Damage Reduction/);
    expect(tooltip).toContain("title: 'Flat Damage Reduction'");
    expect(src('components/account/CharacterManagement.jsx')).not.toContain('character.armor');
    expect(src('components/auth/CharacterManager.jsx')).not.toContain('character.armor');
    expect(src('components/item-generation/ItemLibrary.jsx')).not.toMatch(/\} AC<\/span>/);
    expect(src('components/item-generation/ItemTooltip.jsx')).not.toContain('Increases your armor by');
    expect(src('components/rules/WeaponsRulesDisplay.jsx')).not.toMatch(/does <strong>not<\/strong> use flat Damage Reduction|armor soak/);
  });
  test('the legacy armor field drives no derived stat (kept, not reinterpreted)', () => {
    const base = { strength: 10, constitution: 10, agility: 10, intelligence: 10, spirit: 10, charisma: 10 };
    const plain = calculateDerivedStats(base, {}, {}, 'normal');
    const withArmor = calculateDerivedStats(base, { armor: 40, armorClass: 18 }, {}, 'normal');
    expect(withArmor.damageReduction || 0).toBe(plain.damageReduction || 0);
    expect(withArmor.actionPoints).toBe(plain.actionPoints);
  });
});

describe('P10: creatures have no Armor score or AC (creator-confirmed)', () => {
  const src = rel => fs.readFileSync(path.resolve(__dirname, '../..', rel), 'utf8');
  test('GM codex, homebrew monster editor, creature Defending marker and settings show no AC; flat DR and resistances stay visible', () => {
    const codex = src('components/location-scene/CampaignCodexSidebar.jsx');
    expect(codex).not.toMatch(/\{c\.ac\} AC/);
    expect(codex).toContain('{c.damageReduction}');
    expect(codex).toContain('{c.resistances}');
    for (const f of ['components/account/CampaignManager.jsx', 'components/windows/CampaignManagerWindow.jsx']) {
      const s = src(f);
      expect(s).not.toMatch(/monster\.ac \|\||ac: e\.target\.value/);
      expect(s).toContain('value={monster.resistances');
    }
    expect(src('components/grid/CreatureToken.jsx')).not.toMatch(/effects: \{ armor: 2 \}|Increased armor and damage resistance/);
    expect(src('components/windows/SettingsWindow.jsx')).not.toContain('Armor Class');
    const ad = text(page('combat-system', 'attacks-damage'));
    expect(ad).toContain('Creatures have no Armor score, no AC and no equipment DR dice, and their defenses never wear');
    expect(ad).toContain('any rolled defensive effect their stat block authors');
    expect(ad).toMatch(/\[Open: the amount, cost and duration of creature Defend\./);
    expect(src('utils/creatureTooltipUtils.js')).not.toMatch(/getArmorRating|getSoakDie/);
    expect(src('components/tooltips/CreatureTooltip.jsx')).not.toMatch(/armorRating|getArmorRating/);
    expect(src('components/grid/CreatureToken.jsx')).toContain("authored DR benefit, or adjudicates one if none is written");
    expect(src('components/hud/TargetHUD.jsx')).toContain("'armor': 'Legacy armor (unresolved, no current effect)'");
    expect(ad).toMatch(/\[Open: Raise Shield's wording[^\]]*order in which resistances, DR and flat DR apply/);
  });
});

describe('P10 skills and weapon proficiency (creator clarifications 2026-10-16)', () => {
  const src = rel => fs.readFileSync(path.resolve(__dirname, '../..', rel), 'utf8');
  const skills = text(page('character-creation', 'skills'));
  const weapons = text(page('equipment-system', 'weapons'));
  // The confirmed growing proficiency die, read from the authored weapon tiers (rank -> die).
  const RANK_NAMES = { UNTRAINED: 'Untrained', NOVICE: 'Novice', TRAINED: 'Trained', APPRENTICE: 'Apprentice', ADEPT: 'Adept', EXPERT: 'Expert', MASTER: 'Master' };
  const dieOf = {};
  Object.values(WEAPON_TYPE_TIERS).forEach(t => { dieOf[t.rankReq] = dieOf[t.rankReq] ?? t.dieReq; });
  const ladder = ['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT'].map(r => `d${dieOf[r]} ${RANK_NAMES[r]}`).join(', ')
    + `, d${dieOf.EXPERT} Expert and Master`;
  test('the growing proficiency die is confirmed on both pages, with lookup details left open', () => {
    expect(dieOf).toEqual({ UNTRAINED: 4, NOVICE: 6, TRAINED: 8, APPRENTICE: 10, ADEPT: 12, EXPERT: 20, MASTER: 20 });
    expect(skills).toContain(ladder);
    expect(weapons).toContain(ladder);
    ['components/rules/WeaponsRulesDisplay.jsx', 'components/rules/SkillsDisplay.jsx'].forEach(f =>
      expect(src(f).replace(/\s+/g, ' ')).toContain(ladder));
    [weapons, src('components/rules/WeaponsRulesDisplay.jsx'), src('components/rules/SkillsDisplay.jsx')].forEach(t =>
      expect(t).toContain('[Open: whether a modifier is added to the proficiency roll, whether the die explodes'));
    expect(Object.keys(WEAPON_TYPE_SIMPLE_TABLES.mace)).toHaveLength(20);
  });
  test('point-buy is described as current creation-step behaviour; budget and bonuses stay open', () => {
    const steps = Object.values(SKILL_RANK_UPGRADE_COSTS);
    expect(steps).toEqual([1, 2, 3, 4, 5, 6]);
    const display = src('components/rules/SkillsDisplay.jsx');
    [skills, display].forEach(t => {
      expect(t).toContain(`currently charges ${steps[0]} point to reach Novice`);
      expect(t).toContain(`then ${steps.slice(1, -1).join(', ')} and ${steps[steps.length - 1]} for each rank after it (${TOTAL_COST_TO_RANK.MASTER} in total for Master)`);
      expect(t).toContain(`gives ${BASE_SKILL_POINTS} points plus 1 for each point of Intelligence above 10`);
      expect(t).toContain('[Open: the starting budget and any bonus points are not yet confirmed.');
    });
    [10, 11, 14, 17].forEach(int =>
      expect(calculateTotalSkillPoints({ finalStats: { intelligence: int } })).toBe(BASE_SKILL_POINTS + int - 10));
    // Granted and class-skill Novice ranks are paid from the same pool.
    expect(calculatePointsSpent({ a: 'NOVICE' })).toBe(SKILL_RANK_UPGRADE_COSTS.UNTRAINED_TO_NOVICE);
    // The bonus lists name no Mythrill background or heritage id (the wizard stores ids), so the pages omit them.
    const ids = new Set([...Object.keys(BACKGROUND_DATA), ...Object.keys(RACE_DATA)]);
    [...Object.keys(SKILL_POINT_BONUSES.BACKGROUNDS), ...Object.keys(SKILL_POINT_BONUSES.RACES)].forEach(k => expect(ids.has(k)).toBe(false));
  });
  test('Standard and Advanced differ only in advancement', () => {
    expect(skills).toContain("you raise that skill's rank yourself on your sheet");
    expect(skills).toContain('Advanced Skills: Skill Quests');
    expect(weapons).toContain('Rolls and outcome tables are the same in both');
    const sd = src('components/rules/SkillsDisplay.jsx');
    const wr = src('components/rules/WeaponsRulesDisplay.jsx');
    expect(sd).not.toMatch(/awarded by the GM|quests? completed<|11-12 quests</);
    expect(sd).toContain('Advanced Skills are not part of the first-table rules');
    // Superseded fixed-d8 / alternative-procedure text is gone from both Laws components.
    [wr, sd].forEach(code => expect(code).not.toMatch(
      /step the mastery die down|<em>d6<\/em> type outcome|simpler d6 outcome|richer outcome tables|No flat DR|static <strong>d8<\/strong>|doesn't use the skill-die ladder|Weapon Outcomes \(d8\)|The d8 Outcome Scale|\[1, 2, 3, 4, 5, 6, 7, 8\]\.map/));
    expect(weapons).not.toMatch(/Weapon Type d8|static d8|becomes a \*\*d8\*\*/);
    expect(sd).toContain('const authored = getWeaponSimpleTable(selectedWeaponType)?.[clampedRoll];');
    expect((sd.match(/\[Open: whether a rank adds a flat bonus to checks/g) || []).length).toBe(2);
  });
  test('weapon identity: no generic bonus, no AC, legacy AC/to-hit outcomes flagged not reinterpreted', () => {
    expect(weapons).toContain('no generic accuracy or damage bonus and no Armor Class');
    expect(weapons).toContain('[Open: some authored weapon outcomes still mention Armor Class or to-hit modifiers; they are not reinterpreted here.');
    expect(src('components/rules/WeaponsRulesDisplay.jsx')).toContain('What Makes a Weapon');
    // The authored tables themselves are untouched by P10.
    expect(WEAPON_TYPE_SIMPLE_TABLES.mace[12]).toContain('+1 Defense/AC');
  });
});

describe('P10: every source file P10 edits still parses', () => {
  // Several P10 edits are text inside UI files no unit test imports; parse them so a quoting slip cannot ship.
  const { parse } = require('@babel/parser');
  const files = [
    'components/grid/CreatureToken.jsx', 'components/hud/TargetHUD.jsx', 'components/windows/CampaignManagerWindow.jsx',
    'components/account/CampaignManager.jsx', 'components/account/CharacterManagement.jsx', 'components/auth/CharacterManager.jsx',
    'components/location-scene/CampaignCodexSidebar.jsx', 'components/item-generation/ItemLibrary.jsx', 'components/item-generation/ItemTooltip.jsx',
    'components/tooltips/GeneralStatTooltip.jsx', 'components/tooltips/CreatureTooltip.jsx', 'components/rules/WeaponsRulesDisplay.jsx',
    'components/rules/SkillsDisplay.jsx',
    'components/character-sheet/CharacterStats.jsx', 'components/windows/SettingsWindow.jsx',
    'components/spellcrafting-wizard/components/common/UnifiedSpellCard.jsx', 'data/universalCombatSpells.js',
    'data/classes/arcanoneerData.js', 'data/classes/shaperData.js', 'data/classes/minstrelData.js',
  ];
  test.each(files)('%s', rel => {
    const code = fs.readFileSync(path.resolve(__dirname, '../..', rel), 'utf8');
    expect(() => parse(code, { sourceType: 'module', plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator', 'dynamicImport'] })).not.toThrow();
  });
});
