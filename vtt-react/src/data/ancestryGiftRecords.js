/**
 * Ancestral Gifts — new gift records for the heritages beyond Morgh and Amordjin.
 *
 * Draft numbers for creator review (see ANCESTRAL_GIFTS_DRAFT_LOADOUTS.md). Each row of
 * RECORDS is one gift; `build` expands it to the same spell-format record the race files use.
 * Wording avoids the rules terms the registry test forbids (see ancestryLoadouts.test.js).
 */

// [id, name, icon, type, ap, cooldown, school, kind, target, description, origin, requires, limits, counters]
// type: P passive · A action · R reaction. cooldown: '' | 'short_rest' | 'long_rest'.
// target: 'self' | ['single', range] | ['area', radius] | ['location', range].
const RECORDS = [
    // ── Myrathil ───────────────────────────────────────────────────────────────
    ['corali_squall_caller', 'Squall-Caller', 'Arcane/Spiral Vortex', 'A', 1, 'short_rest', 'storm', 'control', ['area', 10],
        'Whip up a squall in a 10 ft radius within 20 ft. Until the start of your next turn, ranged attacks that start or end inside it roll their proficiency die one size smaller.',
        'Biological · storm-blooded tide-folk', 'Open air or open water within 20 ft.', 'Once per short rest; ends at the start of your next turn.', 'Sheltered or enclosed spaces; creatures that leave the area.'],
    ['corali_coral_hide', 'Coral-Hide', 'Nature/Earth Shield', 'P', 0, '', 'primal', 'buff', 'self',
        'While you are touching water or are wet from it, you take 1 less damage from each physical hit, to a minimum of 1.',
        'Biological · reef-hardened skin', 'You are in or touching water, or still wet from it.', 'Never reduces a hit below 1 damage.', 'Staying dry for a few minutes.'],
    ['corali_riptide_lunge', 'Riptide Lunge', 'Utility/Speed Dash', 'A', 1, 'short_rest', 'primal', 'utility', ['single', 20],
        'Surge up to 20 ft in a straight line through water or across wet ground, then make one melee strike against a creature at the end of the surge.',
        'Trained · Corali reef-hunters', 'Water or wet ground along the whole path.', 'Once per short rest; straight line only.', 'Dry ground; obstacles on the path.'],
    ['deepling_pressure_born', 'Pressure-Born', 'Utility/Shield', 'P', 0, '', 'primal', 'buff', 'self',
        'While you are submerged, you take 1 less damage from each force or smashing hit, to a minimum of 1, and your swim speed cannot be reduced.',
        'Biological · deep-water frame', 'You are fully submerged.', 'Never reduces a hit below 1 damage.', 'Leaving the water.'],
    ['deepling_lantern_lure', 'Lantern-Lure', 'Arcane/Orb Manipulation', 'A', 1, 'short_rest', 'spirit', 'control', ['area', 15],
        'Pulse a soft light from your vein-colors. Each creature within 15 ft that can see you must pass a Spirit save or use its next movement to move toward you.',
        'Biological · abyssal lure-light', 'Creatures that can see you within 15 ft.', 'Once per short rest. It cannot move a creature into a hazard.', 'A Spirit save; blindness; looking away.'],
    ['deepling_drowning_grip', 'Drowning Grip', 'Nature/Gnarled Roots', 'A', 1, 'short_rest', 'primal', 'control', ['single', 5],
        'Seize a creature within 5 ft in a rush of water. It is held until the end of your next turn unless it passes a Strength save, and a held creature cannot speak.',
        'Trained · Nereid deep-hunters', 'A creature within 5 ft, in or beside water.', 'Once per short rest; one creature at a time.', 'A Strength save; moving yourself away.'],
    ['riverling_silt_skin', 'Silt-Skin', 'Nature/Earth Shield', 'P', 0, '', 'primal', 'buff', 'self',
        'While you are in or beside water, silt clings to you: ranged attacks against you from beyond 30 ft roll their proficiency die one size smaller.',
        'Biological · estuary silt-coat', 'You are in or beside water.', 'Applies only to ranged attacks from beyond 30 ft.', 'Fighting far from water.'],
    ['riverling_current_tongue', 'Current-Tongue', 'Healing/Renewal', 'P', 0, '', 'primal', 'utility', 'self',
        'You understand the gist of speech carried across water, and can speak to creatures in the same river, lake or sea within 60 ft as if they stood beside you.',
        'Biological · river-voice', 'You and the listener share one body of water.', 'Gist only; it does not translate magic or writing.', 'Distance beyond 60 ft; separate bodies of water.'],
    ['riverling_eddy_step', 'Eddy-Step', 'Utility/Dash', 'R', 0, 'short_rest', 'primal', 'utility', ['single', 10],
        'When a creature moves adjacent to you, swap places with an ally within 10 ft, if both of you are in or touching water.',
        'Trained · Ondine ferry-hands', 'An ally within 10 ft; both of you touching water; your reaction is available.', 'Once per short rest. Uses your reaction.', 'Dry ground; acting after your reaction is spent.'],

    // ── Mimir ──────────────────────────────────────────────────────────────────
    ['veiled_porcelain_ward', 'Porcelain Ward', 'Utility/Shield', 'R', 0, 'short_rest', 'smashing', 'buff', 'self',
        'When you would take damage from a single physical hit, your mask takes it instead: reduce the damage by 1d6, to a minimum of 0. A hairline crack shows until your next long rest.',
        'Biological · mask-borne ward', 'You are wearing your lineage mask; your reaction is available.', 'Once per short rest; physical damage only.', 'Attacks that bypass armour or masks; acting after your reaction is spent.'],
    ['veiled_name_keeper', 'Name-Keeper', 'Utility/Glowing Hooded Figure', 'P', 0, '', 'spirit', 'utility', 'self',
        'You never forget a name or face you were introduced to, and you know the mask-lineage of any Mimir you meet.',
        'Biological · inscribed ancestral memory', 'You were introduced, or can see the mask.', 'Recall only; it does not reveal secrets.', 'Disguises and false introductions.'],
    ['tethered_tether_leap', 'Tether-Leap', 'Utility/Dash', 'A', 1, 'short_rest', 'storm', 'utility', ['location', 30],
        'Throw a line of storm-glass cord at a surface within 30 ft and pull yourself to it, landing on your feet.',
        'Trained · storm-glass rope-runners', 'A surface you can see and anchor to within 30 ft.', 'Once per short rest. Ends any climb or hold.', 'Smooth or crumbling surfaces; blocking the line.'],
    ['tethered_fulgurite_edge', 'Fulgurite Edge', 'Arcane/Magical Sword', 'A', 1, 'short_rest', 'storm', 'buff', 'self',
        'Your next weapon strike this turn deals +1d4 storm damage, and the target cannot take reactions until the start of your next turn.',
        'Biological · storm-glass shards', 'A weapon strike this turn.', 'Once per short rest; one strike.', 'Storm resistance; missing the strike.'],

    // ── Florae ─────────────────────────────────────────────────────────────────
    ['viridian_briar_oath', 'Briar-Oath', 'Nature/Gnarled Roots', 'R', 0, 'short_rest', 'primal', 'control', ['single', 15],
        'When a creature within 15 ft breaks a promise it made in your hearing, lash it with thorns for 1d6 piercing damage.',
        'Biological · fae-contract barbs', 'A broken promise made in your hearing; your reaction is available.', 'Once per short rest. Uses your reaction.', 'Promises you did not hear; creatures beyond 15 ft.'],
    ['oken_sap_surge', 'Sap-Surge', 'Healing/Renewal', 'A', 1, 'short_rest', 'primal', 'buff', 'self',
        'Drive sap through your limbs: recover 1d6 + Constitution HP and gain +5 ft speed until the end of your next turn.',
        'Biological · heartwood sap', 'You are above 0 HP.', 'Once per short rest. Never above maximum HP.', 'Ember damage; blight that sours the sap.'],

    // ── Solari ─────────────────────────────────────────────────────────────────
    ['korr_ember_sense', 'Ember-Sense', 'Utility/Watchful Eye', 'P', 0, '', 'ember', 'utility', 'self',
        'You feel the warmth of any living creature within 15 ft through walls and darkness, and cannot be ambushed by creatures that give off heat.',
        'Biological · deep-vault heat sense', 'Warm-blooded creatures within 15 ft.', 'Cold creatures and constructs are not sensed.', 'Heavy stone or water between you; creatures kept cold.'],
    ['korr_cinder_ward', 'Cinder-Ward', 'Utility/Shield', 'P', 0, '', 'ember', 'buff', 'self',
        'You take 1 less damage from each ember hit, to a minimum of 1, and hot vapor and ash never harm you.',
        'Biological · ash-hardened skin', 'Ember damage or hot vapor.', 'Never reduces a hit below 1 damage.', 'Rime damage cracks the ward; it grants nothing against rime.'],
    ['thrask_smoke_veil', 'Smoke-Veil', 'Utility/Hide', 'A', 1, 'short_rest', 'shadow', 'utility', ['area', 10],
        'Exhale a cloud of ash in a 10 ft radius around you. It lightly obscures the area until the start of your next turn, and you see through it.',
        'Trained · Anhur ash-runners', 'Open space around you.', 'Once per short rest; lasts until the start of your next turn.', 'Strong wind; creatures that leave the cloud.'],

    // ── Vreken ─────────────────────────────────────────────────────────────────
    ['clean_mourners_bloom', 'Mourner\'s Bloom', 'Healing/Golden Heart', 'A', 1, 'short_rest', 'primal', 'buff', ['single', 5],
        'Scatter glowing spores over a creature within 5 ft who is at 0 HP: it recovers 1d4 HP.',
        'Trained · Bedel crypt-keepers', 'A creature at 0 HP within 5 ft.', 'Once per short rest; one creature.', 'Blight that rots the spores; creatures beyond reach.'],
    ['marked_spore_cloak', 'Spore-Cloak', 'Utility/Hide', 'A', 1, 'short_rest', 'primal', 'utility', 'self',
        'Release a thin spore mist. Until the start of your next turn, creatures more than 15 ft away cannot see you unless they sense the Root-Veil.',
        'Biological · Ghost-Mycelium mist', 'Open air around you.', 'Once per short rest; ends if you attack.', 'Strong wind; creatures within 15 ft; Root-Veil sense.'],

    // ── Neth ───────────────────────────────────────────────────────────────────
    ['velun_oath_ward', 'Oath-Ward', 'Radiant/Divine Blessing', 'R', 0, 'short_rest', 'arcane', 'buff', ['single', 15],
        'When you or an ally within 15 ft who has sworn an agreement with you takes damage, reduce that damage by 1d6.',
        'Trained · Nethien pact-law', 'An agreement sworn aloud; your reaction is available.', 'Once per short rest. Uses your reaction.', 'Allies with no sworn agreement; acting after your reaction is spent.'],
    ['kessen_loose_thread', 'Loose-Thread', 'Arcane/Empowering Growth', 'A', 1, 'long_rest', 'arcane', 'utility', 'self',
        'Pull a loose thread of obligation: reroll one of your own d20 rolls made this turn and take the new result.',
        'Biological · Weft thread-sense', 'A d20 roll you made this turn.', 'Once per long rest.', 'Spending your action elsewhere.'],
    ['drun_unsigned_step', 'Unsigned Step', 'Utility/Hide', 'P', 0, '', 'shadow', 'utility', 'self',
        'The first 10 ft you move on each of your turns does not provoke reactions.',
        'Trained · Riven silence-walkers', 'Your own movement.', 'First 10 ft each turn only.', 'Being held or slowed.'],
    ['drun_pact_breaker', 'Pact-Breaker', 'Arcane/Magical Sword', 'A', 1, 'short_rest', 'arcane', 'control', ['single', 5],
        'Strike a creature within 5 ft. On a hit, it gains no protection from any pact or contract until the start of your next turn.',
        'Trained · Riven who severed the pact', 'A creature within 5 ft.', 'Once per short rest; one creature.', 'Missing the strike; protections that are not pacts.'],

    // ── Fexrick ────────────────────────────────────────────────────────────────
    ['kethrin_cold_iron_focus', 'Cold-Iron Focus', 'Utility/Target Crosshair', 'P', 0, 'short_rest', 'smashing', 'buff', 'self',
        'Once per short rest, after you succeed at a task involving a mechanical device, your next attack roll this turn rolls its proficiency die one size larger.',
        'Trained · Brasskin guild discipline', 'A completed device task this turn.', 'Once per short rest; one attack.', 'Failing the task; spending the focus before the attack.'],
    ['kethrin_ledger_of_hands', 'Ledger of Hands', 'Utility/Watchful Eye', 'P', 0, '', 'arcane', 'utility', 'self',
        'You know the maker\'s guild mark on any device, tool or weapon you touch, and can tell what it was built to do.',
        'Trained · guild ledgers', 'You are touching the item.', 'Recognition only; it does not reveal traps.', 'Unmarked or forged work.'],
    ['drall_sump_taste', 'Sump-Taste', 'Nature/Growth', 'P', 0, '', 'blight', 'utility', 'self',
        'By tasting a liquid, powder or airborne residue, you can name its poisons and alchemical makeup.',
        'Biological · sump-hardened palate', 'A sample you can safely taste.', 'Identification only.', 'Magical or inert samples.'],
    ['drall_slag_cast', 'Slag-Cast', 'Utility/Explosive Detonation', 'A', 1, 'short_rest', 'ember', 'control', ['single', 15],
        'Fling a blob of molten slag at a creature within 15 ft: it takes 1d6 ember damage and its speed is reduced by 10 ft until the end of its next turn.',
        'Trained · Alchemite foundry-hands', 'A creature you can see within 15 ft.', 'Once per short rest; one creature.', 'Ember resistance; cover.'],

    // ── Human ──────────────────────────────────────────────────────────────────
    ['thalren_ink_stained_hand', 'Ink-Stained Hand', 'Utility/Watchful Eye', 'P', 0, '', 'arcane', 'utility', 'self',
        'You copy any text you can read at twice the usual speed, and your copies match the original hand.',
        'Trained · Tallyn scribes', 'Text you can read, with ink and parchment.', 'Mundane writing only.', 'Magical script; unfamiliar scripts.'],
    ['thalren_archivists_gaze', 'Archivist\'s Gaze', 'Utility/Watchful Eye', 'A', 1, 'short_rest', 'arcane', 'utility', ['single', 15],
        'Study a creature or object for a moment; the GM tells you one true fact about its origin, maker or owner.',
        'Trained · Tallyn archivists', 'A creature or object within 15 ft.', 'Once per short rest; one fact.', 'Things with no record; illusions.'],
    ['skald_saga_memory', 'Saga-Memory', 'Healing/Renewal', 'P', 0, '', 'spirit', 'utility', 'self',
        'You recite any saga or song you have heard once, word for word. Allies who listen for a full minute ignore the next fear effect that would affect them before their next rest.',
        'Trained · Skald oral tradition', 'A full minute of recitation to listeners.', 'One fear effect per listener per rest.', 'Listeners who cannot hear you.'],
    ['skald_shield_brothers_oath', 'Shield-Brother\'s Oath', 'Utility/Shield', 'R', 0, 'short_rest', 'smashing', 'buff', ['single', 10],
        'When an ally within 10 ft is hit by a melee attack, move up to 5 ft and take the hit instead, reducing its damage by 1d4.',
        'Trained · Skald war-bands', 'An ally within 10 ft; your reaction is available.', 'Once per short rest. Uses your reaction.', 'Blocked paths; acting after your reaction is spent.'],
    ['tessen_keyhole_eye', 'Keyhole Eye', 'Utility/Watchful Eye', 'P', 0, '', 'shadow', 'utility', 'self',
        'You notice hidden doors, locks, trap mechanisms and secret compartments within 15 ft without searching.',
        'Trained · Tessic keep-rats', 'Features within 15 ft that you can see.', 'Notice only; it does not disarm.', 'Magical concealment; features out of sight.'],
    ['tessen_tinkers_fingers', 'Tinker\'s Fingers', 'Utility/Speed Dash', 'A', 1, 'short_rest', 'smashing', 'utility', ['single', 5],
        'Open a lock, jam a mechanism or disarm a trap you can touch, in a single action and without a roll, as long as it is not magical.',
        'Trained · Tessic tinkers', 'A mundane lock, mechanism or trap within reach.', 'Once per short rest; not magical devices.', 'Magical locks; mechanisms you cannot reach.'],
    ['merryn_rope_hand', 'Rope-Hand', 'Nature/Gnarled Roots', 'A', 1, 'short_rest', 'smashing', 'control', ['single', 15],
        'Whip a rope or chain at a creature within 15 ft: its speed is halved until the end of its next turn.',
        'Trained · Merryn deckhands', 'A rope or chain in hand; a creature within 15 ft.', 'Once per short rest; one creature.', 'Cut ropes; creatures out of reach.'],
    ['merryn_harbor_talk', 'Harbor Talk', 'Utility/Glowing Hooded Figure', 'P', 0, '', 'spirit', 'utility', 'self',
        'You find a rumor, a berth or a buyer in any port or market within an hour, whatever language is spoken.',
        'Trained · Merryn dockside', 'A port or market.', 'Takes an hour; finds leads, not guarantees.', 'Closed or hostile ports.'],
    ['ordan_horizon_eye', 'Horizon-Eye', 'Utility/Watchful Eye', 'P', 0, '', 'primal', 'utility', 'self',
        'You see clearly at three times the usual distance in open terrain, and always know the direction of the nearest water.',
        'Biological · steppe-born eyes', 'Open terrain with a clear line of sight.', 'Open terrain only.', 'Fog, forest and walls.'],
    ['ordan_saddle_born', 'Saddle-Born', 'Utility/Speed Dash', 'P', 0, '', 'primal', 'utility', 'self',
        'You mount or dismount at no cost, and while mounted you and your mount ignore difficult terrain.',
        'Trained · Ordu horse-lords', 'A willing mount.', 'Mounted only; mundane difficult terrain.', 'Magical terrain; unwilling mounts.']
];

const TARGETING = (t) => {
    if (t === 'self') return { targetingType: 'self' };
    const [kind, n] = t;
    if (kind === 'single') return { targetingType: 'single', rangeType: n <= 5 ? 'touch' : 'ranged', rangeDistance: n };
    if (kind === 'location') return { targetingType: 'location', rangeType: 'ranged', rangeDistance: n };
    return { targetingType: 'area', rangeType: 'self_centered', aoeShape: 'circle', aoeParameters: { radius: n } };
};

function build([id, name, icon, type, ap, cooldown, school, kind, target, description, origin, requires, limits, counters]) {
    const spellType = { P: 'PASSIVE', A: 'ACTION', R: 'REACTION' }[type];
    const effect = [{ id: `${id}_effect`, name, description }];
    const configs = {
        utility: { effectTypes: ['utility'], utilityConfig: { utilityType: 'utility', selectedEffects: effect } },
        buff: { effectTypes: ['buff'], buffConfig: { buffType: 'statusEffectBuff', effects: effect, durationValue: 0, durationType: type === 'P' ? 'permanent' : 'instant', canBeDispelled: false } },
        control: { effectTypes: ['control'], controlConfig: { controlType: 'debuff', effects: effect } }
    }[kind];
    return {
        id, name, description, icon, spellType, level: 1,
        ...configs,
        typeConfig: { category: 'racial', school, tags: ['ancestral_gift', kind, spellType.toLowerCase()] },
        targetingConfig: TARGETING(target),
        resourceCost: { actionPoints: ap, mana: 0, components: [] },
        cooldownConfig: cooldown ? { cooldownType: cooldown, cooldownValue: 1 } : { cooldownType: 'none', cooldownValue: 0 },
        ancestry: { origin, requires, limits, counters }
    };
}

export const DRAFT_ANCESTRY_GIFTS = Object.fromEntries(RECORDS.map(r => [r[0], build(r)]));
