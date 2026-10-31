import {
  DREADNAUGHT_TREE_META,
  DREADNAUGHT_TREES,
  DREADNAUGHT_TALENT_NODES,
  DREADNAUGHT_PASSIVE_RECORDS,
  DREADNAUGHT_TALENT_CAPACITY
} from '../talentTrees/dreadnaught';

export { DREADNAUGHT_TALENT_CAPACITY };

export const DREADNAUGHT_CLASS_ID = 'dreadnaught';
export const DREADNAUGHT_RULESET_VERSION = 'cr-review-r1';
export const DREADNAUGHT_ICON = 'fas fa-shield-alt';
export const DREADNAUGHT_MANUAL_NOTICE = 'Manual tabletop only. No automatic pressure generation, heat vent calculation, damage reduction, or expiry.';

const flags = {
  classId: DREADNAUGHT_CLASS_ID,
  rulesetVersion: DREADNAUGHT_RULESET_VERSION,
  authoredOnly: true,
  manualOnly: true,
  executionEnabled: false,
  applicationMode: 'manual-tabletop',
  automatedCapabilities: [],
  manualNotice: DREADNAUGHT_MANUAL_NOTICE,
  specialization: 'siegebastion'
};

const instant = { durationType: 'instant', durationValue: 0, durationUnit: 'instant' };
const roundDuration = (rounds = 1) => ({ durationType: 'rounds', durationValue: rounds, durationUnit: 'rounds' });
const minuteDuration = (minutes = 1) => ({ durationType: 'minutes', durationValue: minutes, durationUnit: 'minutes' });
const _hourDuration = (hours = 1) => ({ durationType: 'hours', durationValue: hours, durationUnit: 'hours' });

const selfTarget = { targetingType: 'self', rangeType: 'self', rangeDistance: 0, targetRestrictions: ['self'], maxTargets: 1 };
const target = (roles, maxTargets = 1, rangeDistance = 5) => ({
  targetingType: maxTargets > 1 ? 'multi' : 'single',
  rangeType: rangeDistance <= 5 ? 'melee' : 'ranged',
  rangeDistance,
  targetRestrictions: roles,
  maxTargets
});
const enemy = (n = 1, feet = 5) => target(['enemy'], n, feet);
const ally = (n = 1, feet = 15) => target(['ally', 'self'], n, feet);
const area = (feet = 15, range = 30) => ({
  targetingType: 'area',
  rangeType: 'ranged',
  rangeDistance: range,
  targetRestrictions: ['area'],
  maxTargets: 1,
  areaRadius: feet
});

const dmg = (formula, type = 'fire') => ({
  formula,
  type,
  scaleStat: 'strength',
  scaleFactor: 1
});

export const DREADNAUGHT_CORE_RECORDS = [
  {
    ...flags,
    id: 'cr1_dreadnaught_stoke_furnace',
    name: 'Stoke Furnace',
    spellType: 'ACTION',
    level: 1,
    tier: 1,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: -20 },
    description: 'Shovel alchemical fuel or coal into the spinal firebox. Generate +20 Furnace Pressure and gain 5 temporary Hit Points until the end of the encounter.',
    effectTypes: ['resource_generation', 'temporary_hp'],
    damageConfig: null,
    targeting: selfTarget,
    duration: minuteDuration(10),
    cooldown: { type: 'turn', value: 1 }
  },
  {
    ...flags,
    id: 'cr1_dreadnaught_vent_steam',
    name: 'Vent Steam',
    spellType: 'ACTION',
    level: 1,
    tier: 1,
    school: 'Martial Engineering',
    cost: { actionPoints: 0 },
    actionPoints: 0,
    resourceCost: { furnacePressure: 30 },
    description: 'Open emergency boiler release valves as a reaction or free action. Vent 30 Furnace Pressure, creating a 10-foot radius scalding steam cloud that obscures vision and deals 2d6 fire damage to adjacent foes.',
    effectTypes: ['damage', 'area_denial', 'obscurity'],
    damageConfig: dmg('2d6', 'fire'),
    targeting: area(10, 0),
    duration: roundDuration(1),
    cooldown: { type: 'encounter', value: 1 }
  }
];

export const DREADNAUGHT_OPTIONAL_RECORDS = [
  // --- LEVEL 1 ---
  {
    ...flags,
    id: 'dread_iron_trample',
    name: 'Iron Trample',
    spellType: 'ACTION',
    level: 1,
    tier: 1,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 15 },
    description: 'Power hydraulic legs and charge in a 20-foot straight line. Deal 2d8 bludgeoning damage to all foes in your path and force a DC 13 Strength check or be knocked prone.',
    effectTypes: ['damage', 'charge', 'knockdown'],
    damageConfig: dmg('2d8', 'bludgeoning'),
    targeting: { targetingType: 'line', rangeType: 'melee', rangeDistance: 20, targetRestrictions: ['enemy'], maxTargets: 3 },
    duration: instant,
    cooldown: { type: 'none', value: 0 }
  },
  {
    ...flags,
    id: 'dread_bedrock_cleats',
    name: 'Bedrock Cleats',
    spellType: 'ACTION',
    level: 1,
    tier: 1,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 0 },
    description: 'Drive hydraulic anchoring spikes into the ground beneath your iron greaves. You cannot be pushed, pulled, or knocked prone by any effect, and gain +2 to all Strength saves for 2 rounds.',
    effectTypes: ['buff', 'stance', 'forced_movement_immunity'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(2),
    cooldown: { type: 'none', value: 0 }
  },
  {
    ...flags,
    id: 'dread_steam_vent',
    name: 'Scalding Jet',
    spellType: 'ACTION',
    level: 1,
    tier: 1,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 25 },
    description: 'Discharge a concentrated burst of scalding boiler steam in a 10-foot burst. Deals 1d8 fire damage to all foes caught within and imposes disadvantage on their next attack roll.',
    effectTypes: ['damage', 'debuff', 'blind'],
    damageConfig: dmg('1d8', 'fire'),
    targeting: area(10, 10),
    duration: instant,
    cooldown: { type: 'turn', value: 1 }
  },
  {
    ...flags,
    id: 'dread_brace_impact',
    name: 'Brace for Impact',
    spellType: 'ACTION',
    level: 1,
    tier: 1,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 10 },
    description: 'Shift your center of mass and interlock frontal hull plates. Gain +4 Damage Reduction against the next incoming physical attack within 1 round.',
    effectTypes: ['buff', 'damage_reduction'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(1),
    cooldown: { type: 'none', value: 0 }
  },

  // --- LEVEL 2 ---
  {
    ...flags,
    id: 'dread_hydraulic_slam',
    name: 'Hydraulic Slam',
    spellType: 'ACTION',
    level: 2,
    tier: 2,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 20 },
    description: 'Engage arm pistons and slam a crushing blow into a single target. Deals 2d10 crushing bludgeoning damage and pushes the target 10 feet backwards.',
    effectTypes: ['damage', 'forced_movement'],
    damageConfig: dmg('2d10', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: instant,
    cooldown: { type: 'none', value: 0 }
  },
  {
    ...flags,
    id: 'dread_pressure_surge',
    name: 'Pressure Surge',
    spellType: 'ACTION',
    level: 2,
    tier: 2,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 25 },
    description: 'Reroute high-pressure steam directly to locomotion pistons. Gain +15 feet of movement speed this turn and ignore movement penalties from heavy armor or rough terrain.',
    effectTypes: ['buff', 'mobility'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(1),
    cooldown: { type: 'turn', value: 1 }
  },
  {
    ...flags,
    id: 'dread_firebox_roar',
    name: 'Firebox Roar',
    spellType: 'ACTION',
    level: 2,
    tier: 2,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 15 },
    description: 'Vent an explosive deafening blast of soot, fire, and furnace steam in a 15-foot cone. Enemies caught within must make a DC 13 Will save or be demoralized (-2 to hit) for 1 round.',
    effectTypes: ['control', 'debuff', 'demoralize'],
    damageConfig: null,
    targeting: { targetingType: 'cone', rangeType: 'ranged', rangeDistance: 15, targetRestrictions: ['enemy'], maxTargets: 4 },
    duration: roundDuration(1),
    cooldown: { type: 'turn', value: 1 }
  },
  {
    ...flags,
    id: 'dread_riveted_bulkhead',
    name: 'Riveted Bulkhead',
    spellType: 'ACTION',
    level: 2,
    tier: 2,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 20 },
    description: 'Tighten locking pins and expand overlapping armor plates. Gain +2 Armor Class and +2 on Constitution saves for 2 rounds.',
    effectTypes: ['buff', 'ac_buff'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(2),
    cooldown: { type: 'turn', value: 2 }
  },

  // --- LEVEL 3 ---
  {
    ...flags,
    id: 'dread_piston_punch',
    name: 'Piston Punch',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 25 },
    description: 'Drive a pneumatically charged gauntlet into the target. Deals 3d8 bludgeoning damage and knocks the target back 10 feet. If the target hits a solid obstacle, they take an additional 1d6 damage.',
    effectTypes: ['damage', 'knockback'],
    damageConfig: dmg('3d8', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: instant,
    cooldown: { type: 'none', value: 0 }
  },
  {
    ...flags,
    id: 'dread_steam_shroud',
    name: 'Steam Shroud',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 20 },
    description: 'Blanket your surroundings in dense, opaque exhaust steam in a 15-foot radius. Grants total concealment to yourself and all allies within the cloud against ranged attacks for 2 rounds.',
    effectTypes: ['utility', 'concealment', 'area_denial'],
    damageConfig: null,
    targeting: area(15, 0),
    duration: roundDuration(2),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_heavy_fortress_stance',
    name: 'Heavy Fortress Stance',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 0 },
    description: 'Lock your hydraulic chassis completely into position. You cannot move or be moved by any means for 2 rounds, but gain +6 Damage Reduction against all physical damage.',
    effectTypes: ['stance', 'buff', 'damage_reduction'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(2),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_crushing_cleave',
    name: 'Crushing Cleave',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 30 },
    description: 'Swing a massive heavy hammer or bladed bulwark in a wide arc. Deals 2d8 bludgeoning damage to up to 3 adjacent enemies.',
    effectTypes: ['damage', 'cleave'],
    damageConfig: dmg('2d8', 'bludgeoning'),
    targeting: enemy(3, 5),
    duration: instant,
    cooldown: { type: 'none', value: 0 }
  },

  // --- LEVEL 4 ---
  {
    ...flags,
    id: 'dread_boiler_eruption',
    name: 'Boiler Eruption',
    spellType: 'ACTION',
    level: 4,
    tier: 4,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 40 },
    description: 'Purposely trigger a violent pressure burst from your firebox. Deals 3d10 combined fire and bludgeoning damage to all foes within a 20-foot burst and knocks them back 5 feet.',
    effectTypes: ['damage', 'area_damage', 'knockback'],
    damageConfig: dmg('3d10', 'fire'),
    targeting: area(20, 0),
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_overdrive_pistons',
    name: 'Overdrive Pistons',
    spellType: 'ACTION',
    level: 4,
    tier: 4,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 30 },
    description: 'Overclock arm servos to maximum cycle rate. Gain +1 additional Action Point to spend on a melee strike this turn.',
    effectTypes: ['buff', 'action_grant'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(1),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_groven_shockwave',
    name: 'Groven Shockwave',
    spellType: 'ACTION',
    level: 4,
    tier: 4,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 25 },
    description: 'Stomp down with hydraulic pile-drivers, sending a seismic tremor through the earth in a 15-foot cone. All enemies must succeed on a DC 14 Strength save or fall prone and have their speed halved for 1 round.',
    effectTypes: ['control', 'knockdown', 'slow'],
    damageConfig: null,
    targeting: { targetingType: 'cone', rangeType: 'ranged', rangeDistance: 15, targetRestrictions: ['enemy'], maxTargets: 5 },
    duration: roundDuration(1),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_armor_recalibration',
    name: 'Armor Recalibration',
    spellType: 'ACTION',
    level: 4,
    tier: 4,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 20 },
    description: 'Engage internal alchemical welders and hydraulic clamp jacks to re-seat damaged chassis plates. Repair 2d8 Hit Points to your armored chassis.',
    effectTypes: ['heal', 'utility'],
    damageConfig: null,
    targeting: selfTarget,
    duration: instant,
    cooldown: { type: 'encounter', value: 2 }
  },

  // --- LEVEL 5 ---
  {
    ...flags,
    id: 'dread_cataclysmic_charge',
    name: 'Cataclysmic Charge',
    spellType: 'ACTION',
    level: 5,
    tier: 5,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 50 },
    description: 'Unleash full boiler thrust into a relentless 40-foot charge in a straight line. Deals 4d10 crushing damage to all enemies in the line, smashing through physical barriers and knocking all targets prone.',
    effectTypes: ['damage', 'charge', 'barrier_smash'],
    damageConfig: dmg('4d10', 'bludgeoning'),
    targeting: { targetingType: 'line', rangeType: 'melee', rangeDistance: 40, targetRestrictions: ['enemy'], maxTargets: 5 },
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_steam_jet_burst',
    name: 'Steam Jet Burst',
    spellType: 'ACTION',
    level: 5,
    tier: 5,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 35 },
    description: 'Fire downward-directed steam jets to launch your colossal armored bulk into the air, leaping up to 30 feet to an unoccupied space. Does not trigger opportunity attacks.',
    effectTypes: ['utility', 'mobility', 'leap'],
    damageConfig: null,
    targeting: area(0, 30),
    duration: instant,
    cooldown: { type: 'turn', value: 1 }
  },
  {
    ...flags,
    id: 'dread_molten_vent',
    name: 'Molten Slag Vent',
    spellType: 'ACTION',
    level: 5,
    tier: 5,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 40 },
    description: 'Purge superheated alchemical fire and molten slag from the boiler in a 15-foot cone. Deals 4d8 fire damage immediately and inflicts 1d6 ongoing fire burn for 2 rounds.',
    effectTypes: ['damage', 'dot', 'burn'],
    damageConfig: dmg('4d8', 'fire'),
    targeting: { targetingType: 'cone', rangeType: 'ranged', rangeDistance: 15, targetRestrictions: ['enemy'], maxTargets: 4 },
    duration: roundDuration(2),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_iron_citadel_brace',
    name: 'Iron Citadel Brace',
    spellType: 'ACTION',
    level: 5,
    tier: 5,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 30 },
    description: 'Plant your shield and expand interlocking ballistic flaps. For 2 rounds, you intercept all physical attacks directed at adjacent conscious allies, taking the damage on your armor instead.',
    effectTypes: ['buff', 'ally_intercept', 'protection'],
    damageConfig: null,
    targeting: ally(3, 10),
    duration: roundDuration(2),
    cooldown: { type: 'encounter', value: 1 }
  },

  // --- LEVEL 6 ---
  {
    ...flags,
    id: 'dread_seismic_pile_driver',
    name: 'Seismic Pile Driver',
    spellType: 'ACTION',
    level: 6,
    tier: 6,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 45 },
    description: 'Drive a hydraulic pile driver into a melee target with earth-shattering force. Deals 5d8 crushing damage and creates a localized shock fissure that turns adjacent ground into difficult terrain.',
    effectTypes: ['damage', 'terrain_modification'],
    damageConfig: dmg('5d8', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: minuteDuration(1),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_exhaust_hiss',
    name: 'Exhaust Hiss',
    spellType: 'ACTION',
    level: 6,
    tier: 6,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 30 },
    description: 'Release a deafening, high-pitch steam whistle from your manifold vents in a 20-foot radius. Foes within must pass a DC 15 Constitution save or be deafened and unable to cast vocal spells for 1 round.',
    effectTypes: ['control', 'silence', 'debuff'],
    damageConfig: null,
    targeting: area(20, 0),
    duration: roundDuration(1),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_boiler_overclock',
    name: 'Boiler Overclock',
    spellType: 'ACTION',
    level: 6,
    tier: 6,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 50 },
    description: 'Over-pressurize the combustion chambers, supercharging all servo pistons. For 1 round, all melee strike damage dice are automatically treated as maximum roll.',
    effectTypes: ['buff', 'damage_maximization'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(1),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_slag_spray',
    name: 'Slag Spray',
    spellType: 'ACTION',
    level: 6,
    tier: 6,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 35 },
    description: 'Spray liquefied furnace slag in a 20-foot cone. Deals 3d8 fire damage and burns away enemy protective layers, reducing target Armor Class by -2 for 2 rounds.',
    effectTypes: ['damage', 'armor_break', 'debuff'],
    damageConfig: dmg('3d8', 'fire'),
    targeting: { targetingType: 'cone', rangeType: 'ranged', rangeDistance: 20, targetRestrictions: ['enemy'], maxTargets: 5 },
    duration: roundDuration(2),
    cooldown: { type: 'turn', value: 2 }
  },

  // --- LEVEL 7 ---
  {
    ...flags,
    id: 'dread_hydraulic_crush',
    name: 'Hydraulic Crush',
    spellType: 'ACTION',
    level: 7,
    tier: 7,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 50 },
    description: 'Clamp massive industrial vise jaws onto an enemy. Deals 5d10 crushing damage and immediately shatters non-magical shields or parrying weapons held by the target.',
    effectTypes: ['damage', 'shield_shatter'],
    damageConfig: dmg('5d10', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_impenetrable_plating',
    name: 'Impenetrable Plating',
    spellType: 'ACTION',
    level: 7,
    tier: 7,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 40 },
    description: 'Lock auxiliary grooved plate reinforcements across vital joints. You are immune to critical hits and sneak attacks for 3 rounds.',
    effectTypes: ['buff', 'crit_immunity'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(3),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_steam_cyclone',
    name: 'Steam Cyclone',
    spellType: 'ACTION',
    level: 7,
    tier: 7,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 55 },
    description: 'Spin your colossal chassis while opening all circumferential steam gates. Deals 4d10 fire damage to all foes in a 15-foot radius and pulls them 5 feet closer to your crushing bulk.',
    effectTypes: ['damage', 'area_damage', 'vacuum_pull'],
    damageConfig: dmg('4d10', 'fire'),
    targeting: area(15, 0),
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_superheated_exhaust',
    name: 'Superheated Exhaust',
    spellType: 'ACTION',
    level: 7,
    tier: 7,
    school: 'Martial Engineering',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 30 },
    description: 'Trigger rear manifold jet blast in response to being flanked or struck. Retaliates against adjacent melee attackers, disorienting them and imposing disadvantage on attacks for 1 round.',
    effectTypes: ['reaction', 'control', 'debuff'],
    damageConfig: null,
    targeting: enemy(2, 5),
    duration: roundDuration(1),
    cooldown: { type: 'turn', value: 1 }
  },

  // --- LEVEL 8 ---
  {
    ...flags,
    id: 'dread_titan_drop',
    name: 'Titan Drop',
    spellType: 'ACTION',
    level: 8,
    tier: 8,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 60 },
    description: 'Fire twin pneumatic rocket thrusters and plummet down up to 30 feet away like a meteorite. Deals 6d10 crushing damage in a 15-foot impact crater and knocks all creatures prone.',
    effectTypes: ['damage', 'leap', 'knockdown'],
    damageConfig: dmg('6d10', 'bludgeoning'),
    targeting: area(15, 30),
    duration: instant,
    cooldown: { type: 'turn', value: 3 }
  },
  {
    ...flags,
    id: 'dread_volcanic_core_surge',
    name: 'Volcanic Core Surge',
    spellType: 'ACTION',
    level: 8,
    tier: 8,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 50 },
    description: 'Pump molten firebox embers through outer strike conductors. For 3 rounds, every melee attack ignites the target, dealing +2d8 additional fire damage.',
    effectTypes: ['buff', 'fire_infusion'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(3),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_unyielding_monolith',
    name: 'Unyielding Monolith',
    spellType: 'ACTION',
    level: 8,
    tier: 8,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 40 },
    description: 'Lock every hydraulic failsafe and brace the frame against mortal failure. For 1 round, your Hit Points cannot be reduced below 1 by any form of damage.',
    effectTypes: ['buff', 'invulnerability'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(1),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_siege_breaker_hammer',
    name: 'Siege Breaker Hammer',
    spellType: 'ACTION',
    level: 8,
    tier: 8,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 60 },
    description: 'Release maximum hydraulic piston pressure behind a single devastating blow. Deals 7d8 bludgeoning damage to a creature, or triple damage against buildings, fortifications, or stone gates.',
    effectTypes: ['damage', 'siege_break'],
    damageConfig: dmg('7d8', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },

  // --- LEVEL 9 ---
  {
    ...flags,
    id: 'dread_supercritical_vent',
    name: 'Supercritical Vent',
    spellType: 'ACTION',
    level: 9,
    tier: 9,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 80 },
    description: 'Vent all boiler valves at near-meltdown temperatures in a 30-foot burst. Deals 7d10 scalding fire and concussive steam damage to all enemies, leaving an impassable boiling fog for 2 rounds.',
    effectTypes: ['damage', 'area_damage', 'fog'],
    damageConfig: dmg('7d10', 'fire'),
    targeting: area(30, 0),
    duration: roundDuration(2),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_juggernaut_apex',
    name: 'Juggernaut Apex',
    spellType: 'ACTION',
    level: 9,
    tier: 9,
    school: 'Martial Engineering',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 60 },
    description: 'Bypass internal kinetic governors. Double your movement speed for 2 rounds and gain the ability to move directly through enemy spaces without hindrance, trampling each for 3d8 damage.',
    effectTypes: ['buff', 'speed', 'unstoppable'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(2),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_iron_fortress_shield',
    name: 'Deploy Iron Fortress',
    spellType: 'ACTION',
    level: 9,
    tier: 9,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 50 },
    description: 'Erect an impenetrable 30-foot wide deployable iron fortification barrier anchored to the ground. The barrier grants full cover to allies behind it and possesses 150 Hit Points for 3 rounds.',
    effectTypes: ['utility', 'barrier', 'cover'],
    damageConfig: null,
    targeting: area(30, 10),
    duration: roundDuration(3),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_pulverizing_strike',
    name: 'Pulverizing Strike',
    spellType: 'ACTION',
    level: 9,
    tier: 9,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 70 },
    description: 'Unleash four synchronized hydraulic pistons simultaneously. Deals 8d10 crushing bludgeoning damage to a single foe and permanently lowers their physical damage reduction by 5.',
    effectTypes: ['damage', 'armor_shred'],
    damageConfig: dmg('8d10', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },

  // --- LEVEL 10 ---
  {
    ...flags,
    id: 'dread_grand_engine_overload',
    name: 'Grand Engine Overload',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 100 },
    description: 'Intentionally breach the core boiler seal, unleashing a cataclysmic 40-foot explosion of fire, metal shrapnel, and concussive shockwaves. Deals 10d10 fire damage to all enemies and resets Furnace Pressure to 0 PSI.',
    effectTypes: ['damage', 'capstone', 'area_damage'],
    damageConfig: dmg('10d10', 'fire'),
    targeting: area(40, 0),
    duration: instant,
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_the_mountain_that_walks',
    name: 'The Mountain That Walks',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 80 },
    description: 'Expand hydraulic chassis struts to maximum size. For 3 rounds, your size becomes Huge, reach increases by +10 feet, gain +10 Damage Reduction, and gain advantage on all Strength and Constitution rolls.',
    effectTypes: ['buff', 'size_increase', 'damage_reduction'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(3),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_hydraulic_execution',
    name: 'Hydraulic Execution',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 90 },
    description: 'Bring the full crushing weight of the combustion engine down on a target. Deals 9d12 crushing damage; if the target has 50 HP or fewer remaining, they are instantly crushed to dust.',
    effectTypes: ['damage', 'execution'],
    damageConfig: dmg('9d12', 'bludgeoning'),
    targeting: enemy(1, 5),
    duration: instant,
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_perpetual_furnace',
    name: 'Perpetual Furnace',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Martial Engineering',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 75 },
    description: 'Ignite self-sustaining thermal alchemical reactions in the boiler. For 5 rounds, the boiler generates +20 Furnace Pressure automatically at the start of your turn, and you are immune to cold damage.',
    effectTypes: ['buff', 'resource_regen', 'cold_immunity'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(5),
    cooldown: { type: 'encounter', value: 1 }
  }
];

export const DREADNAUGHT_TALENT_ACTIVE_RECORDS = [
  // --- SIGNATURES (Level 3 | 10 pts gate) ---
  {
    ...flags,
    id: 'dread_sig_bedrock_lock',
    name: 'Bedrock Lock',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Siege Bastion',
    cost: { actionPoints: 1 },
    actionPoints: 1,
    resourceCost: { furnacePressure: 15 },
    description: 'Lock hydraulic anchors firmly into bedrock. For 3 rounds, you cannot be moved by any effect, gain +4 Damage Reduction against physical attacks, and grant half cover to allies behind you.',
    effectTypes: ['buff', 'signature', 'stance', 'damage_reduction'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(3),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_sig_boiler_burst',
    name: 'Boiler Burst',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Furnace Engine',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 30 },
    description: 'Discharge superheated steam in a 15-foot burst around your chassis. Deals 2d8 fire damage to all enemies caught within and blinds them for 1 round on a failed Constitution save.',
    effectTypes: ['damage', 'signature', 'blind', 'area_damage'],
    damageConfig: dmg('2d8', 'fire'),
    targeting: area(15, 0),
    duration: roundDuration(1),
    cooldown: { type: 'turn', value: 2 }
  },
  {
    ...flags,
    id: 'dread_sig_piston_trample',
    name: 'Piston Trample',
    spellType: 'ACTION',
    level: 3,
    tier: 3,
    school: 'Juggernaut Momentum',
    cost: { actionPoints: 2 },
    actionPoints: 2,
    resourceCost: { furnacePressure: 25 },
    description: 'Drive hydraulic pistons in a 20-foot trample line. Deals 2d10 bludgeoning damage and knocks all enemies in the line prone.',
    effectTypes: ['damage', 'signature', 'charge', 'knockdown'],
    damageConfig: dmg('2d10', 'bludgeoning'),
    targeting: { targetingType: 'line', rangeType: 'melee', rangeDistance: 20, targetRestrictions: ['enemy'], maxTargets: 3 },
    duration: instant,
    cooldown: { type: 'turn', value: 2 }
  },

  // --- CAPSTONES (Level 10 | 45 pts gate) ---
  {
    ...flags,
    id: 'dread_cap_unbreakable_colossus',
    name: 'Unbreakable Colossus',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Siege Bastion',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 50 },
    description: 'Erect an impenetrable bulwark stance that makes your frame invincible to siege weaponry. For 3 rounds, gain +10 Damage Reduction, become immune to all crowd control and critical hits, and intercept all attacks directed at allies within 15 feet.',
    effectTypes: ['buff', 'capstone', 'damage_reduction', 'ally_intercept'],
    damageConfig: null,
    targeting: selfTarget,
    duration: roundDuration(3),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_cap_superheated_engine',
    name: 'Superheated Engine',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Furnace Engine',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 60 },
    description: 'Enter permanent thermal overdrive for the duration of the combat. All fire and steam damage deals an additional +3d8 fire damage, your walking speed increases by +20 feet, and melee attackers suffer 2d8 fire damage on contact.',
    effectTypes: ['buff', 'capstone', 'fire_infusion', 'speed'],
    damageConfig: null,
    targeting: selfTarget,
    duration: minuteDuration(10),
    cooldown: { type: 'encounter', value: 1 }
  },
  {
    ...flags,
    id: 'dread_cap_avalanche_of_iron',
    name: 'Avalanche of Iron',
    spellType: 'ACTION',
    level: 10,
    tier: 10,
    school: 'Juggernaut Momentum',
    cost: { actionPoints: 3 },
    actionPoints: 3,
    resourceCost: { furnacePressure: 70 },
    description: 'Unleash a cataclysmic 60-foot charge that demolishes everything in its path. Deals 8d10 crushing bludgeoning damage to up to 6 enemies, shatters all obstacles in the line, and knocks all struck targets prone and stunned for 1 round.',
    effectTypes: ['damage', 'capstone', 'charge', 'stun'],
    damageConfig: dmg('8d10', 'bludgeoning'),
    targeting: { targetingType: 'line', rangeType: 'melee', rangeDistance: 60, targetRestrictions: ['enemy'], maxTargets: 6 },
    duration: instant,
    cooldown: { type: 'encounter', value: 1 }
  }
];

export { DREADNAUGHT_PASSIVE_RECORDS };

export const DREADNAUGHT_ALL_RECORDS = [
  ...DREADNAUGHT_CORE_RECORDS,
  ...DREADNAUGHT_OPTIONAL_RECORDS,
  ...DREADNAUGHT_TALENT_ACTIVE_RECORDS,
  ...DREADNAUGHT_PASSIVE_RECORDS
].map(record => ({
  ...record,
  resourceCost: {
    actionPoints: record.actionPoints ?? record.cost?.actionPoints ?? 0,
    mana: 0,
    furnacePressure: record.resourceCost?.furnacePressure ?? 0,
    ...(record.resourceCost || {})
  },
  cost: {
    actionPoints: record.actionPoints ?? record.cost?.actionPoints ?? 0,
    mana: 0,
    ...(record.cost || {})
  }
}));

export const DREADNAUGHT_PROJECTED_SPELLS = DREADNAUGHT_ALL_RECORDS;

export const DREADNAUGHT_PROJECTED_SPELLS_BY_ID = Object.fromEntries(
  DREADNAUGHT_PROJECTED_SPELLS.map(spell => [spell.id, spell])
);

export const DREADNAUGHT_SPELL_POOLS = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const level = index + 1;
    return [level, DREADNAUGHT_OPTIONAL_RECORDS.filter(spell => spell.level === level).map(spell => spell.id)];
  })
);

export const DREADNAUGHT_PROGRESSION_POLICY = {
  classId: DREADNAUGHT_CLASS_ID,
  startingSpellPicks: 1,
  grantedCoreSpellIds: ['cr1_dreadnaught_stoke_furnace', 'cr1_dreadnaught_vent_steam'],
  optionalSpellPools: DREADNAUGHT_SPELL_POOLS,
  spellPoolLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  manualOnly: true
};

const dreadnaughtNodeById = Object.fromEntries(
  DREADNAUGHT_TALENT_NODES.map(node => [node.id, node])
);

const dreadnaughtTreePoints = (ranks, treeId) => DREADNAUGHT_TALENT_NODES
  .filter(node => node.treeId === treeId)
  .reduce((total, node) => total + (ranks[node.id] || 0), 0);

export const pruneDreadnaughtTalents = (talents, characterLevel) => {
  const ranks = talents && typeof talents === 'object' ? { ...talents } : {};
  const level = Number.isInteger(characterLevel) ? Math.max(1, characterLevel) : 10;
  Object.keys(ranks).forEach(nodeId => {
    const node = dreadnaughtNodeById[nodeId];
    if (!node || !Number.isInteger(ranks[nodeId]) || ranks[nodeId] < 1 || ranks[nodeId] > node.maxRanks) {
      delete ranks[nodeId];
    }
  });

  const pruneStructure = () => {
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of DREADNAUGHT_TALENT_NODES) {
        const rank = ranks[node.id];
        if (!rank) continue;
        const gatePoints = dreadnaughtTreePoints(ranks, node.treeId) - rank;
        const predecessorMissing = node.requires.some(predecessorId => {
          const predecessor = dreadnaughtNodeById[predecessorId];
          return !predecessor || (ranks[predecessorId] || 0) !== predecessor.maxRanks;
        });
        if (node.minLevel > level || gatePoints < node.requiresPoints || predecessorMissing) {
          delete ranks[node.id];
          changed = true;
        }
      }
    }
  };

  pruneStructure();
  const budget = Math.min(50, level * 5);
  let guard = 0;
  while (Object.values(ranks).reduce((total, rank) => total + rank, 0) > budget && guard < 200) {
    guard += 1;
    let targetId = null;
    DREADNAUGHT_TALENT_NODES.forEach(node => {
      if (!ranks[node.id]) return;
      if (targetId === null || node.minLevel >= dreadnaughtNodeById[targetId].minLevel) targetId = node.id;
    });
    if (targetId === null) break;
    ranks[targetId] -= 1;
    if (ranks[targetId] === 0) delete ranks[targetId];
    pruneStructure();
  }
  return ranks;
};

export function validateDreadnaughtState(state) {
  const errors = [];
  if (!state || typeof state !== 'object') return { valid: false, errors: ['state must be an object'] };
  const psi = Number(state.psi ?? state.pressure ?? state.current ?? 20);
  if (!Number.isInteger(psi) || psi < 0 || psi > 100) {
    errors.push('furnace pressure must be an integer from 0 to 100');
  }
  return { valid: errors.length === 0, errors };
}

export const DREADNAUGHT_DATA = {
  id: 'dreadnaught',
  name: 'Dreadnaught',
  icon: 'fas fa-shield-alt',
  color: '#b45309',
  role: 'Juggernaut / Heavy Tank',
  damageTypes: ['fire', 'bludgeoning', 'physical'],
  primaryStats: ['strength', 'constitution', 'intelligence'],
  developmentStatus: 'development',
  statusLabel: 'Development - manual tabletop',
  manualOnly: true,
  executionEnabled: false,
  restrictions: {
    allowedSubraces: [],
    hardBlocks: [],
    narrativeUnlock: true,
    acquisition: {
      status: 'proposed',
      records: [
        { id: 'boiler_apprenticeship', label: 'Boiler Apprenticeship', text: 'Apprenticeship in Groven steam boiler fabrication, firebox welding, and pressure relief valve maintenance.' },
        { id: 'hydraulic_chassis_binding', label: 'Hydraulic Chassis Binding', text: 'Surgical and armor fitting of spinal steam pistons and bedrock grounding cleats.' },
        { id: 'cragjaw_vow', label: 'Cragjaw Vow', text: 'The solemn front-line vow to serve as an immovable bulwark against the mountain storms.' }
      ]
    },
    justification: 'The Dreadnaught calling is open to warriors of any ancestry willing to undergo the grueling process of being welded into hydraulic boiler-plate.'
  },
  classResource: {
    type: 'furnace_pressure',
    base: 20,
    max: 100,
    generationNote: 'Built from suffering physical impacts (+10 PSI), hydraulic locomotion/movement (+15 PSI), or stoking the firebox (+20 PSI).',
    mechanicsNote: 'Spent on steam vents, hydraulic slams, and piston charges. Overheat at 91+ PSI requires venting or inflicts 2d6 self-burn.'
  },
  overview: {
    title: 'The Dreadnaught',
    subtitle: 'The Ironclad Furnace & Juggernaut',
    originStory: `The vertical bridges of the Cragjaw Peaks are spans of bone and rope, hanging over blizzards that swallow both sound and direction. When the smoothing plague first swept through the Fexric vats, the Groven troll-kin broke their alchemical chains and claimed these bridges as their sanctuary. Yet, during the War of Thousand Screams, the blue-fleshed Skreika descended from the northern fjords, threatening to sweep the refugees into the bottomless rifts.

In that hour of ruin, a Skald blacksmith named Vaelen Bloodhammer took the heavy brass plates of the Frozen Archive's heating pipes and welded them directly onto the skin of his frontliners. He mounted alchemical steam-pistons to their limbs, powered by alchemical coal-boilers mounted to their spines. These warriors marched back into the blizzard, belching black soot and superheated steam, shrugging off icy claws to anchor themselves to the crumbling spans.

This was the birth of the Dreadnaught — a calling that transforms the body into an immovable steam-powered fortress. The constant heat of the combustion engine blisters the skin, and the crushing weight of the iron plates causes severe skeletal fatigue, slowing the wearer to a methodical, unstoppable advance.

You are the iron wall between your kin and the freezing dark. Let the storm howl and the enemy strike. You are the shield of the Peaks, and your resolve is welded to the stone.`,
    quickOverview: {
      title: 'Class Overview',
      content: `**Who they are**: Colossal, steam-belching front-line juggernauts permanently sealed inside superheated iron plating, powered by a spinal combustion boiler.

**The hook**: Convert enemy impacts and hydraulic locomotion into Furnace Pressure (0-100 PSI). Higher pressure grants damage reduction and bonus fire damage, but reaching 91+ PSI risks boiler Overheat.

**The resource bar & costs**: **Furnace Pressure** (0-100 PSI, starts at 20). Built by stoking the firebox and absorbing hits; spent on concussive steam vents, hydraulic slams, and unstoppable charges.

**Bring one for**: Unrivaled physical damage reduction, immunity to forced movement and knockdowns, wide area-of-effect steam obscurement, and devastating wall-shattering charges.`
    },
    description: 'The Dreadnaught is a colossal, steam-belching front-line juggernaut permanently sealed inside superheated iron plating, converting trauma into boiling furnace pressure.',
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `**HISTORY: THE CRAGJAW BASTION**
The Dreadnaught's immovable defense was forged on the precipitous spans of the Cragjaw Peaks. Groven iron-smiths discovered that high-pressure steam boilers could power massive piston servos, allowing a single heavily armored sentinel to hold an entire mountain pass against an advancing horde.

**CIVIL RECEPTION**
Dreadnaughts are viewed with profound awe and slight dread. The deafening hiss of their relief valves, the smell of sulfur and coal smoke, and the heavy rhythmic thud of their bedrock cleats announce their arrival long before they come into sight.

**NOTABLE PRACTITIONERS**
* **Vaelen Bloodhammer**: The legendary Skald blacksmith who forged the first spinal combustion harness.
* **Garek the Unmoved**: A Groven sentinel who held the Broken Span for fourteen days against avalanche beasts without yielding a single yard.`
    },
    signatureQuote: {
      text: '"Let them swing until their iron breaks. The firebox is stoked, the valves are holding, and the mountain does not move."',
      speaker: 'Garek the Unmoved',
      context: 'Before absorbing a frost giant siege catapult impact at the High Pass'
    }
  },
  specializations: {
    title: 'Three Industrial Disciplines',
    description: 'First investment chooses a primary tree. Five talent points per level, global cap fifty. Signatures require ten same-tree points at level three; capstones forty-five at level ten.',
    specs: DREADNAUGHT_TREE_META.map(meta => ({
      id: meta.id,
      name: meta.name,
      icon: 'fas fa-shield-alt',
      theme: meta.tagline,
      description: meta.tagline,
      playstyle: meta.tagline
    }))
  },
  resourceSystem: {
    id: 'furnace_pressure',
    name: 'Furnace Pressure',
    manualOnly: true,
    executionEnabled: false,
    resourceDefinition: {
      name: 'Furnace Pressure',
      manualOnly: true,
      executionEnabled: false
    }
  },
  spells: DREADNAUGHT_PROJECTED_SPELLS,
  exampleSpells: DREADNAUGHT_PROJECTED_SPELLS,
  progression: {
    policy: DREADNAUGHT_PROGRESSION_POLICY,
    spellPools: DREADNAUGHT_SPELL_POOLS
  },
  spellPools: DREADNAUGHT_SPELL_POOLS,
  talentTrees: DREADNAUGHT_TREES
};

export default DREADNAUGHT_DATA;
