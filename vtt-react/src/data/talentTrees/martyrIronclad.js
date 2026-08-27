// ============================================
// martyrIronclad (v4: Canonical Economy & Balanced)
// Schema mirrors sibling Martyr trees. Rank N spell = rank N-1 + rankUpgrades[N-2].
//
// SPEC IDENTITY: The Welded Martyr / Living Forge (Groven Dreadnaught heritage).
// Where Redemption bleeds to feed allies and Zealot burns with wrath, the Ironclad
// SEALED ITSELF inside superheated iron plating — voluntarily. Devotion is fuel:
// high Devotion calcifies into armor and ignites the air around the Martyr;
// steam vents vent that stored suffering as scalding area denial.
// Weaknesses preserved by canon: -10 ft movement, Storm-conductive / Cold-lockable
// plating, cannot stealth or swim, low healing output.
// ============================================

export const MARTYR_IRONCLAD = [
{
"id": "icl_t1_furnace_vow",
"name": "Furnace Vow",
"icon": "spell_fire_fireball02",
"maxRanks": 3,
"position": { "x": 1, "y": 0 },
"requires": null,
"spell": {
"name": "Furnace Vow",
"description": "Passive: Your furnace-plate runs hotter as faith deepens. While your current Devotion Level is 2+, gain +2 Damage Reduction against physical attacks.",
"flavorText": "The vow was iron before it was words.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "dr", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "Threshold lowers to Devotion Level 1+, and bonus increases to +3 DR." },
{ "description": "Bonus becomes +4 DR at Devotion Level 3+, and you gain 1 Devotion whenever a melee attack hits you." }
]
},
{
"id": "icl_t1_voluntary_seal",
"name": "Voluntary Seal",
"icon": "spell_holy_divineshield",
"maxRanks": 2,
"position": { "x": 2, "y": 0 },
"requires": null,
"spell": {
"name": "Voluntary Seal",
"description": "Passive: You chose this coffin; fear of small spaces died inside it. While your Devotion Level is 2+, gain advantage on saving throws against Fear effects.",
"flavorText": "Panic requires an exit. He welded his shut.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "fear-resist", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "You are immune to Fear while at Devotion Level 4+." }
]
},
{
"id": "icl_t1_piston_fist",
"name": "Piston Fist",
"icon": "ability_warrior_battleshout",
"maxRanks": 3,
"position": { "x": 3, "y": 0 },
"requires": null,
"spell": {
"name": "Piston Fist",
"description": "Spend 1 AP: Hurl a plated fist in a crushing hydraulic blow within 10 feet: 1d8 smashing damage. Deals +1d6 bonus damage if you took damage since your last turn.",
"flavorText": "Boiler pressure makes for honest knuckles.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "ACTIVE", "category": "damage",
"actionPoints": 1,
"targetingMode": "single", "rangeType": "melee", "range": 10,
"castTimeType": "instant", "castTimeValue": 0,
"cooldownValue": 0, "cooldownUnit": "round",
"damageTypes": ["smashing"],
"primaryDamage": { "dice": "1d8", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["melee", "smashing", "suffering-payoff", "ironclad"]
},
"rankUpgrades": [
{ "description": "Deals 1d10 smashing damage.", "primaryDamage": { "dice": "1d10", "flat": 0, "procChance": 100 } },
{ "description": "Deals 2d6 smashing damage, pushes the target 5 feet, and gains +2d6 bonus damage instead of +1d6 when wounded recently.", "primaryDamage": { "dice": "2d6", "flat": 0, "procChance": 100 } }
]
},
{
"id": "icl_t2_steam_vent",
"name": "Steam Vent",
"icon": "spell_fire_selfdestruct",
"maxRanks": 3,
"position": { "x": 1, "y": 1 },
"requires": "icl_t1_furnace_vow",
"spell": {
"name": "Steam Vent",
"description": "Spend 1 AP and lower your Devotion Level by 1: seam vents hiss open, blasting scalding steam — all creatures within 10 feet take 2d6 ember damage (Reflex halves) and suffer -2 to hit until the end of their next turn.",
"flavorText": "Every grievance he ever swallowed comes back out as weather.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "ACTIVE", "category": "damage",
"actionPoints": 1,
"targetingMode": "aoe", "rangeType": "self-centered", "range": 10,
"castTimeType": "instant", "castTimeValue": 0,
"saveType": "reflex",
"resourceCosts": {},
"damageTypes": ["ember"],
"primaryDamage": { "dice": "2d6", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["aoe", "nova", "debilitate", "devotion-cost", "signature", "ironclad"]
},
"rankUpgrades": [
{ "description": "Damage increases to 3d6 ember.", "primaryDamage": { "dice": "3d6", "flat": 0, "procChance": 100 } },
{ "description": "Failed saves also leave enemies Blinded until the end of their next turn; the blast leaves the area Difficult Terrain for 1 round." }
]
},
{
"id": "icl_t2_heatsink_thorns",
"name": "Heatsink Plating",
"icon": "spell_fire_flameblades",
"maxRanks": 3,
"position": { "x": 2, "y": 1 },
"requires": "icl_t1_piston_fist",
"spell": {
"name": "Heatsink Plating",
"description": "Passive: Melee attackers take 1d6 ember damage on every hit against you while your Devotion Level is 3+.",
"flavorText": "Hitting him is agreement to be burned.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "damage",
"targetingMode": "self",
"damageTypes": ["ember"],
"primaryDamage": { "dice": "1d6", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["passive", "thorns", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "Thorn damage increases to 2d6 ember and triggers on ranged attacks within 10 feet.", "primaryDamage": { "dice": "2d6", "flat": 0, "procChance": 100 } },
{ "description": "Attackers also ignite: they take an additional 1d6 ember at the start of each of their turns while within 5 feet of you, lasting 1 round." }
]
},
{
"id": "icl_t3_welded_bulwark",
"name": "Welded Bulwark",
"icon": "ability_warrior_shieldwall",
"maxRanks": 3,
"position": { "x": 1, "y": 2 },
"requires": "icl_t2_steam_vent",
"spell": {
"name": "Welded Bulwark",
"description": "Passive: Nothing moves a man who is already part of the wall. While your Devotion Level is 3+, you cannot be pushed, pulled, or forcibly moved.",
"flavorText": "The Groven taught him: roots first, then armor.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "immunity", "anchor", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "Threshold lowers to Devotion Level 2+." },
{ "description": "You are additionally immune to being knocked Prone and count as one size larger vs shove attempts." }
]
},
{
"id": "icl_t3_cauterizing_walk",
"name": "Cauterizing Walk",
"icon": "spell_fire_elementaldevastation",
"maxRanks": 2,
"position": { "x": 2, "y": 2 },
"requires": "icl_t2_heatsink_thorns",
"spell": {
"name": "Cauterizing Walk",
"description": "Passive: Enemies that start their turn adjacent to you take 1d6 ember damage while your Devotion Level is 4+ (the Ironclad Vow's furnace aura, arrived early).",
"flavorText": "Proximity is devotion's tax.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "damage",
"targetingMode": "aura", "rangeType": "self", "auraRadius": 5,
"damageTypes": ["ember"],
"primaryDamage": { "dice": "1d6", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["passive", "aura", "dot", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "Threshold lowers to Devotion Level 3+ and radius extends to 10 feet for half damage if you moved this round." }
]
},
{
"id": "icl_t4_crushing_pistons",
"name": "Crushing Pistons",
"icon": "ability_warrior_intensifyrage",
"maxRanks": 3,
"position": { "x": 1, "y": 3 },
"requires": "icl_t3_welded_bulwark",
"spell": {
"name": "Crushing Pistons",
"description": "Passive: Servo-assisted plates flex on command. Gain advantage on checks and saves to escape grapples and restraints; escape attempts you make deal 1d8 smashing damage to whatever holds you.",
"flavorText": "Roots, chains, fingers — the answer is identical.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "cc-break", "grapple", "ironclad"]
},
"rankUpgrades": [
{ "description": "Once per round when restrained, you may break free automatically (no check) as a free action while at Devotion Level 3+." },
{ "description": "At Devotion Level 5+, you are simply immune to the Restrained and Grappled conditions — pistons crush roots and chains before they settle." }
]
},
{
"id": "icl_t4_overpressure_blast",
"name": "Overpressure Blast",
"icon": "spell_fire_supernova",
"maxRanks": 3,
"position": { "x": 2, "y": 3 },
"requires": "icl_t3_cauterizing_walk",
"spell": {
"name": "Overpressure Blast",
"description": "Spend 2 AP and lower your Devotion Level by 2: catastrophic vent discharge — all creatures within 15 feet take 4d6 ember damage (Reflex halves) and are thrown 10 feet away from you.",
"flavorText": "The boiler has opinions about being crowded.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "ACTIVE", "category": "damage",
"actionPoints": 2,
"targetingMode": "aoe", "rangeType": "self-centered", "range": 15,
"castTimeType": "instant", "castTimeValue": 0,
"saveType": "reflex",
"damageTypes": ["ember"],
"primaryDamage": { "dice": "4d6", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["aoe", "knockback", "devotion-cost", "finisher", "ironclad"]
},
"rankUpgrades": [
{ "description": "Damage increases to 5d6 ember.", "primaryDamage": { "dice": "5d6", "flat": 0, "procChance": 100 } },
{ "description": "Failed saves leave creatures Prone where they land; the cleared area counts as Difficult Terrain for 2 rounds from heat shimmer and debris." }
]
},
{
"id": "icl_t5_molten_spine",
"name": "Molten Spine",
"icon": "spell_shadow_antimagic",
"maxRanks": 2,
"position": { "x": 1, "y": 4 },
"requires": "icl_t4_crushing_pistons",
"spell": {
"name": "Molten Spine",
"description": "Passive: Once per round while at Devotion Level 4+, the first critical hit scored against you is reduced to a normal hit as white-hot metal slag flows into the wound channel.",
"flavorText": "Critical hits need soft tissue. He stopped selling any.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "crit-shrug", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "When Molten Spine absorbs a critical hit, attackers also take 2d6 ember from the molten backspray." }
]
},
{
"id": "icl_t5_furnace_flare",
"name": "Furnace Flare",
"icon": "spell_fire_burningwind",
"maxRanks": 3,
"position": { "x": 2, "y": 4 },
"requires": "icl_t4_overpressure_blast",
"spell": {
"name": "Furnace Flare",
"description": "REACTION — When hit by a melee attack while at Devotion Level 3+, crack your plates wide: the attacker takes 2d8 ember damage (no save for touching what flares).",
"flavorText": "Thank you for volunteering.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "REACTION", "category": "damage",
"actionPoints": 0,
"targetingMode": "single", "rangeType": "melee", "range": 5,
"castTimeType": "reaction", "castTimeValue": 1,
"cooldownValue": 1, "cooldownUnit": "round",
"damageTypes": ["ember"],
"primaryDamage": { "dice": "2d8", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["reaction", "retaliation", "devotion-scaling", "ironclad"]
},
"rankUpgrades": [
{ "description": "Damage increases to 3d8 ember.", "primaryDamage": { "dice": "3d8", "flat": 0, "procChance": 100 } },
{ "description": "Furnace Flare no longer costs your Reaction while at Devotion Level 5+ — it triggers automatically on every melee hit against you." }
]
},
{
"id": "icl_t6_walking_forge",
"name": "Walking Forge",
"icon": "spell_fire_elemental_totem",
"maxRanks": 3,
"position": { "x": 1, "y": 5 },
"requires": "icl_t5_molten_spine",
"spell": {
"name": "Walking Forge",
"description": "Passive: Allies within 10 feet share your furnace. They treat Cold damage as one step less severe (halved), ignore the first instance of movement-slowing Cold effects each combat, and gain resistance to Chill conditions while your Devotion Level is 3+.",
"flavorText": "A hearth that walks beside you is worth ten prayers to Sol.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self", "auraRadius": 10,
"visualTheme": "fire", "tags": ["passive", "aura", "party-buff", "cold-counter", "ironclad"]
},
"rankUpgrades": [
{ "description": "Allies within 10 feet also gain +1 DR against physical attacks while your Devotion Level is 5+ — sparks and shrapnel spray off your plates onto theirs." },
{ "description": "Radius extends to 15 feet." }
]
},
{
"id": "icl_t6_welded_in_the_breach",
"name": "Welded in the Breach",
"icon": "inv_misc_book_09",
"maxRanks": 2,
"position": { "x": 2, "y": 5 },
"requires": "icl_t5_furnace_flare",
"spell": {
"name": "Welded in the Breach",
"description": "Passive: Declare a corridor, doorway, or gap up to 15 feet wide as your Breach (while stationary). Enemies cannot move through your square or the squares immediately beside it while you have any Calcified plating active — they must succeed on a contested Might check to squeeze past at all.",
"flavorText": "'There was a door here once,' observers agree. 'There still is,' says the door.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "control",
"targetingMode": "self", "auraRadius": 5,
"visualTheme": "fire", "tags": ["passive", "body-block", "zone-control", "defense", "ironclad"]
},
"rankUpgrades": [
{ "description": "Enemies that fail the Might check take 1d8 ember damage from contact with the plates." }
]
},
{
"id": "icl_t6_meltdown_protocol",
"name": "Meltdown Protocol",
"icon": "spell_fire_selfdestruct",
"maxRanks": 3,
"position": { "x": 3, "y": 5 },
"requires": "icl_t5_furnace_flare",
"spell": {
"name": "Meltdown Protocol",
"description": "Spend 3 AP: Convert ALL remaining Devotion into a single catastrophic bloom — nova of 6d6 ember damage within 20 feet (Reflex halves). For 1 round afterward your plating runs cold: lose an additional 10 feet of movement and Furnace Vow/heatsink bonuses are suspended until you regain at least 1 Devotion.",
"flavorText": "There is always one more thing to burn. Sometimes it is him.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "ACTIVE", "category": "damage",
"actionPoints": 3,
"targetingMode": "aoe", "rangeType": "self-centered", "range": 20,
"castTimeType": "instant", "castTimeValue": 0,
"saveType": "reflex",
"damageTypes": ["ember"],
"primaryDamage": { "dice": "6d6", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["aoe", "ultimate", "all-in", "self-punishing", "finisher", "ironclad"]
},
"rankUpgrades": [
{ "description": "Add your former Devotion Level in flat ember damage (e.g., spent at level 5: 6d6+5)." },
{ "description": "The cold-down lasts only until the end of your next turn instead of until regaining Devotion." }
]
},

// ──────────────── TIER 7 (Capstone Row) ────────────────
{
"id": "icl_t7_avatar_of_the_living_forge",
"name": "Avatar of the Living Forge",
"icon": "spell_fire_elementaldevastation",
"maxRanks": 1,
"position": { "x": 0.5, "y": 6 },
"requires": "icl_t6_meltdown_protocol",
"spell": {
"name": "Avatar of the Living Forge",
"description": "CAPSTONE: Spend 2 AP (requires Devotion Level 5): become the forge itself for 3 rounds. +6 DR against all damage, immune to Grapple/Restrain/Push/Pull/Fear, aura doubles (enemies within 10 feet take 2d6 ember at the start of your turns), Steam Vent costs no AP and requires no Reaction to place, and your Piston Fist auto-triggers against any enemy that ends its turn adjacent to you.",
"flavorText": "For three rounds, nobody asks whether he is a man or an industry. The question answers them.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "ACTIVE", "category": "buff",
"actionPoints": 2,
"targetingMode": "self", "rangeType": "self", "range": 0,
"castTimeType": "instant", "castTimeValue": 0,
"cooldownCategory": "once_per_combat", "cooldownValue": 1, "cooldownUnit": "combat",
"durationConfig": { "durationType": "rounds", "durationValue": 3, "durationUnit": "round" },
"visualTheme": "fire", "tags": ["capstone", "transformation", "immunity", "aura", "signature", "ironclad"]
},
"rankUpgrades": []
},
{
"id": "icl_t7_forge_doctrine",
"name": "Forge Doctrine",
"icon": "inv_misc_book_09",
"maxRanks": 3,
"position": { "x": 1.5, "y": 6 },
"requires": "icl_t6_welded_in_the_breach",
"spell": {
"name": "Forge Doctrine",
"description": "Passive: All I have built, I reinforce. Furnace Vow, Heatsink Plating, Cauterizing Walk, and Furnace Flare each improve by +1 damage tier (or +1 threshold where numeric).",
"flavorText": "Doctrine is a cathedral made of repeat decisions.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "scaling", "doctrine", "capstone-row", "ironclad"]
},
"rankUpgrades": [
{ "description": "Bonus improves again (+2 tiers/thresholds total)." },
{ "description": "Steam Vent and Overpressure Blast add +2d6 ember damage." }
]
},
{
"id": "icl_t7_unquenched_core",
"name": "Unquenched Core",
"icon": "spell_fire_soulburn",
"maxRanks": 2,
"position": { "x": 2.5, "y": 6 },
"requires": "icl_t6_walking_forge",
"spell": {
"name": "Unquenched Core",
"description": "Passive: The fire in the plates predates the body wearing them. While at Devotion Level 3+, reduction effects against you (DR strip, resistance-pierce, ability-score drain) fail unless they exceed twice your Devotion Level, and you gain +2 to Constitution saves.",
"flavorText": "Cold approached and asked permission. It was denied.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "anti-dispel", "saves", "capstone-row", "ironclad"]
},
"rankUpgrades": [
{ "description": "The first time each combat an enemy applies Cold-slow or Storm-vulnerability effects to you, they instead take 3d6 ember backlash from the plates drinking it." }
]
},
{
"id": "icl_t7_debt_of_embers",
"name": "Debt of Embers",
"icon": "ability_warrior_revenge",
"maxRanks": 2,
"position": { "x": 3.5, "y": 6 },
"requires": "icl_t6_walking_forge",
"spell": {
"name": "Debt of Embers",
"description": "Passive: Whenever the same enemy damages you twice in a single round while within 30 feet, its accumulated debt settles: 3d6 ember damage erupts along its weapon-arm (once per round per enemy).",
"flavorText": "He keeps books in slag. Payments are automatic.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "damage",
"targetingMode": "aura", "rangeType": "self", "auraRadius": 30,
"damageTypes": ["ember"],
"primaryDamage": { "dice": "3d6", "flat": 0, "procChance": 100 },
"visualTheme": "fire", "tags": ["passive", "retaliation", "punish-repeat-offenders", "capstone-row", "ironclad"]
},
"rankUpgrades": [
{ "description": "Eruption damage increases to 5d6 ember and the attacker is disarmed of weapons held in the eruption zone for 1 round on a failed Fortitude save.", "primaryDamage": { "dice": "5d6", "flat": 0, "procChance": 100 } }
]
},
{
"id": "icl_t7_litany_of_coals",
"name": "Litany of Coals",
"icon": "spell_holy_sealofwrath",
"maxRanks": 2,
"position": { "x": 4.25, "y": 6 },
"requires": "icl_t6_welded_in_the_breach",
"spell": {
"name": "Litany of Coals",
"description": "Passive: He recites it through welded lips as plates run hot. Gain +2 to all saving throws. While at least one hostile creature stands within 10 feet, you are immune to Frightened and Despair effects — the litany has no verse for running.",
"flavorText": "Sol does not ask the coal to leap from the fire. Neither should you.",
"source": "talent", "class": "Martyr", "treeId": "ironclad",
"spellType": "PASSIVE", "category": "buff",
"targetingMode": "self",
"visualTheme": "fire", "tags": ["passive", "saves", "fear-immunity", "tank-presence", "capstone-row", "ironclad"]
},
"rankUpgrades": [
{ "description": "Saving throw bonus increases to +4, and allies within 10 feet gain half the bonus (+2) so long as you remain standing — the litany carries." }
]
}
];
