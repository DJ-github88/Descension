/**
 * Ancestral Gifts — permanent heritage loadouts chosen at character creation.
 *
 * Each heritage (subrace) with a loadout grants one CORE gift and three ROWS of two
 * mutually exclusive options; the player picks one option per row. The picks are
 * stored on the character as `ancestry` and sealed when the character is created.
 *
 * Row options either reference a trait the heritage already has in its race file
 * (by trait id) or a new gift record defined below in ANCESTRY_GIFTS. Race files are
 * not edited: this module is the single source of truth for the loadout shape, and
 * raceDisciplineSpellUtils applies it when granting racial traits.
 *
 * Characters without `ancestry` (made before this feature, or heritages that have no
 * loadout yet) keep the legacy behaviour: every heritage trait is granted.
 *
 * Numbers are the first draft for creator review (see the Ancestral Loadout pre-work doc).
 */
import { getRaceData, getSubraceData } from './raceData';
import { DRAFT_ANCESTRY_GIFTS } from './ancestryGiftRecords';

export const ANCESTRY_CATALOG_VERSION = 1;
export const ANCESTRY_ROW_COUNT = 3;
export const ANCESTRY_OPTIONS_PER_ROW = 2;

const gift = (fields) => ({
    level: 1,
    effectTypes: [],
    resourceCost: { actionPoints: 0, mana: 0, components: [] },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    ...fields,
    typeConfig: { category: 'racial', ...(fields.typeConfig || {}), tags: ['ancestral_gift', ...((fields.typeConfig && fields.typeConfig.tags) || [])] }
});

/**
 * New gift records (spell-format, same shape as race-file traits).
 * `ancestry` holds the player-facing rules summary shown in the creation drawer.
 */
export const ANCESTRY_GIFTS = {
    // ── Groven · shared regeneration cores ─────────────────────────────────────
    ithran_vat_knit_flesh: gift({
        id: 'ithran_vat_knit_flesh',
        name: 'Vat-Knit Flesh',
        description: 'At the end of each of your turns, recover 1 HP, up to your maximum. It does nothing while you are at 0 HP, and ember damage taken since your last turn stops the next recovery.',
        icon: 'spell_nature_rejuvenation',
        spellType: 'PASSIVE',
        effectTypes: ['healing'],
        typeConfig: { school: 'primal', tags: ['regeneration', 'passive', 'groven'] },
        healingConfig: {
            healingType: 'regeneration',
            formula: '1',
            durationType: 'permanent',
            hotDuration: 'while above 0 HP, at the end of each of your turns',
            suppressedBy: { damageTypes: ['ember'], until: 'next_tick' }
        },
        ancestry: {
            origin: 'Biological · vat-derived Groven physiology',
            requires: 'Above 0 HP.',
            limits: 'One recovery per turn, whatever the source. Never above maximum HP.',
            counters: 'Ember damage taken since your last turn stops the next recovery.'
        }
    }),
    morgh_slow_knit_stone: gift({
        id: 'morgh_slow_knit_stone',
        name: 'Slow-Knit Stone',
        description: 'At the end of each of your turns in which you did not move, recover 1 HP, up to your maximum. It does nothing while you are at 0 HP, and ember damage taken since your last turn stops the next recovery.',
        icon: 'spell_nature_stone',
        spellType: 'PASSIVE',
        effectTypes: ['healing'],
        typeConfig: { school: 'primal', tags: ['regeneration', 'passive', 'groven', 'anchored'] },
        healingConfig: {
            healingType: 'regeneration',
            formula: '1',
            durationType: 'permanent',
            hotDuration: 'while above 0 HP, at the end of each of your turns in which you did not move',
            suppressedBy: { damageTypes: ['ember'], until: 'next_tick' }
        },
        ancestry: {
            origin: 'Biological · vat-derived Groven physiology',
            requires: 'You did not move this turn, and you are above 0 HP.',
            limits: 'One recovery per turn, whatever the source. Never above maximum HP.',
            counters: 'Forcing you to move; ember damage stops the next recovery.'
        }
    }),

    // ── Amordjin (ithran_groven) ───────────────────────────────────────────────
    ithran_chasm_leap: gift({
        id: 'ithran_chasm_leap',
        name: 'Chasm Leap',
        description: 'Leap up to 15 ft across a gap or between ledges, landing on a surface you can grip. The leap counts as part of your movement.',
        icon: 'ability_rogue_sprint',
        spellType: 'ACTION',
        effectTypes: ['utility'],
        typeConfig: { school: 'primal', tags: ['movement', 'groven'] },
        utilityConfig: { utilityType: 'movement', selectedEffects: [{ id: 'chasm_leap_move', name: 'Chasm Leap', description: 'Leap up to 15 ft to a grippable landing you can see.' }] },
        targetingConfig: { targetingType: 'location', rangeType: 'ranged', rangeDistance: 15 },
        resourceCost: { actionPoints: 1, mana: 0, components: [] },
        ancestry: {
            origin: 'Biological · long-limbed spanners',
            requires: 'A landing you can see and grip, within 15 ft.',
            limits: 'Not while rooted, grappled or prone.',
            counters: 'Blocking or occupying the landing.'
        }
    }),
    ithran_overhang_strike: gift({
        id: 'ithran_overhang_strike',
        name: 'Overhang Strike',
        description: 'Drop onto a creature at least 10 ft below you and within 15 ft. You land beside it, and your next weapon strike this turn rolls its proficiency die one size larger.',
        icon: 'ability_warrior_charge',
        spellType: 'ACTION',
        effectTypes: ['buff'],
        typeConfig: { school: 'primal', tags: ['ambush', 'movement', 'groven'] },
        buffConfig: { buffType: 'statEnhancement', effects: [{ id: 'overhang_proficiency_step', name: 'From Above', description: 'Your next weapon strike this turn rolls its proficiency die one size larger.', statModifier: { stat: 'proficiency_die_step', magnitude: 1, magnitudeType: 'step' } }], durationValue: 1, durationType: 'turns', durationUnit: 'turns', canBeDispelled: false },
        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 15 },
        resourceCost: { actionPoints: 1, mana: 0, components: [] },
        ancestry: {
            origin: 'Trained · Amordjin hunting practice',
            requires: 'You are at least 10 ft above the target.',
            limits: 'Ends any climb; you land in a space beside the target.',
            counters: 'Fighting in the open, away from ledges and rafters.'
        }
    }),

    // ── Morgh (morgh_groven) ───────────────────────────────────────────────────
    morgh_load_bearer: gift({
        id: 'morgh_load_bearer',
        name: 'Load-Bearer',
        description: 'When an ally within 5 ft would be pushed, pulled or knocked prone, brace them against your body: the forced movement or the fall does not happen. Once per short rest.',
        icon: 'ability_warrior_defensivestance',
        spellType: 'REACTION',
        effectTypes: ['buff'],
        typeConfig: { school: 'smashing', tags: ['protection', 'anchored', 'groven'] },
        buffConfig: { buffType: 'statusEffectBuff', effects: [{ id: 'load_bearer_brace', name: 'Braced', description: 'The forced movement or fall is prevented.' }], durationValue: 0, durationType: 'instant', canBeDispelled: false },
        targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5 },
        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
        ancestry: {
            origin: 'Biological · load-bearing Thrumm frame',
            requires: 'An ally within 5 ft; your reaction is available.',
            limits: 'Once per short rest. Uses your reaction opportunity.',
            counters: 'Separating you from your allies; acting after your reaction is spent.'
        }
    }),
    morgh_bedrock_slam: gift({
        id: 'morgh_bedrock_slam',
        name: 'Bedrock Slam',
        description: 'Bring both fists down on the ground. Each creature within 5 ft of you must pass an Agility save or be knocked prone. Once per short rest.',
        icon: 'spell_nature_earthquake',
        spellType: 'ACTION',
        effectTypes: ['control'],
        typeConfig: { school: 'smashing', tags: ['control', 'area', 'groven'] },
        controlConfig: { controlType: 'knockdown', effects: [{ id: 'bedrock_prone', name: 'Prone', description: 'Knocked prone on a failed Agility save.' }] },
        targetingConfig: { targetingType: 'area', rangeType: 'self_centered', aoeShape: 'circle', aoeParameters: { radius: 5 }, targetRestrictions: ['ally', 'enemy'] },
        resourceCost: { actionPoints: 2, mana: 0, components: [] },
        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
        ancestry: {
            origin: 'Biological · mountain-heavy mass',
            requires: 'Standing on solid ground.',
            limits: 'Once per short rest. Hits allies within 5 ft too.',
            counters: 'An Agility save; staying out of reach.'
        }
    }),

    // ── Remaining heritages (draft, see ancestryGiftRecords.js) ───────────────
    ...DRAFT_ANCESTRY_GIFTS
};

/** Loadout maps, keyed by subrace id. Options are trait ids (race file) or ANCESTRY_GIFTS ids. */
export const ANCESTRY_LOADOUTS = {
    ithran_groven: {
        core: 'ithran_vat_knit_flesh',
        rows: [
            { id: 'traversal', label: 'Traversal', options: ['ithran_span_reach', 'ithran_chasm_leap'] },
            { id: 'reading', label: 'Reading', options: ['toll_keepers_eye', 'bone_reading_ithran'] },
            { id: 'hunt', label: 'The Hunt', options: ['fiber_cord_snare_ithran', 'ithran_overhang_strike'] }
        ]
    },
    morgh_groven: {
        core: 'morgh_slow_knit_stone',
        rows: [
            { id: 'bulwark', label: 'Bulwark', options: ['morgh_stone_scales', 'bridge_wardens_wall'] },
            { id: 'weight', label: 'Weight', options: ['ancestors_burden_morgh', 'morgh_load_bearer'] },
            { id: 'force', label: 'Force', options: ['chain_drive_morgh', 'morgh_bedrock_slam'] }
        ]
    },

    // ── Remaining heritages (draft, see ANCESTRAL_GIFTS_DRAFT_LOADOUTS.md) ────
    shoreling_myrathil: {
        core: 'amphibious_shore',
        rows: [
            { id: 'weather', label: 'Weather', options: ['storm_blood_shore', 'corali_squall_caller'] },
            { id: 'voice', label: 'Voice', options: ['tide_tongue_shore', 'spindrift_diplomacy'] },
            { id: 'reef', label: 'Reef', options: ['corali_coral_hide', 'corali_riptide_lunge'] }
        ]
    },
    deepling_myrathil: {
        core: 'amphibious_deep',
        rows: [
            { id: 'depths', label: 'Depths', options: ['abyssal_adaptation_deep', 'deepling_pressure_born'] },
            { id: 'voice', label: 'Voice', options: ['deep_hum', 'mareths_hum'] },
            { id: 'hunt', label: 'The Hunt', options: ['deepling_lantern_lure', 'deepling_drowning_grip'] }
        ]
    },
    riverling_myrathil: {
        core: 'amphibious_brook',
        rows: [
            { id: 'blood', label: 'Blood', options: ['brackish_heritage_brook', 'riverling_silt_skin'] },
            { id: 'face', label: 'Face', options: ['mask_estuary_brook', 'riverling_current_tongue'] },
            { id: 'lore', label: 'Lore', options: ['fresh_water_memory', 'riverling_eddy_step'] }
        ]
    },
    veiled_mimir: {
        core: 'mask_bound_mimir',
        rows: [
            { id: 'lineage', label: 'Lineage', options: ['heartwood_lineage_maskborne', 'veiled_porcelain_ward'] },
            { id: 'sight', label: 'Sight', options: ['fog_piercing_sight_maskborne', 'inscribed_memory_maskborne'] },
            { id: 'face', label: 'Face', options: ['borrowed_face_maskborne', 'veiled_name_keeper'] }
        ]
    },
    tethered_mimir: {
        core: 'mote_mimir',
        rows: [
            { id: 'senses', label: 'Senses', options: ['storm_glass_senses_mistwoven', 'first_alert_mistwoven'] },
            { id: 'reach', label: 'Reach', options: ['rope_runner_mistwoven', 'tethered_tether_leap'] },
            { id: 'strike', label: 'Strike', options: ['glass_shard_volley_mistwoven', 'tethered_fulgurite_edge'] }
        ]
    },
    viridian_florae: {
        core: 'branch_arm_brawn_florae',
        rows: [
            { id: 'body', label: 'Body', options: ['thorn_barb_bristle_viridian', 'hearth_water_vitality_florae'] },
            { id: 'sense', label: 'Sense', options: ['unwritten_word_viridian', 'nature_attunement_florae'] },
            { id: 'will', label: 'Will', options: ['fog_compact_refusal_viridian', 'viridian_briar_oath'] }
        ]
    },
    florae_unified: {
        core: 'branch_arm_brawn_florae',
        rows: [
            { id: 'body', label: 'Body', options: ['heartwood_durability_oken', 'hearth_water_vitality_florae'] },
            { id: 'reach', label: 'Reach', options: ['canopy_reach_oken', 'nature_attunement_florae'] },
            { id: 'root', label: 'Root', options: ['deep_root_anchor_oken', 'oken_sap_surge'] }
        ]
    },
    korr_solari: {
        core: 'vault_breath_solari',
        rows: [
            { id: 'breath', label: 'Breath', options: ['ash_lung_solari', 'vault_breath_exhale_korr'] },
            { id: 'senses', label: 'Senses', options: ['listening_dark_korr', 'korr_ember_sense'] },
            { id: 'pulse', label: 'Pulse', options: ['sols_breath_pulse_korr', 'korr_cinder_ward'] }
        ]
    },
    thrask_solari: {
        core: 'vault_breath_solari',
        rows: [
            { id: 'breath', label: 'Breath', options: ['ash_lung_solari', 'thrask_smoke_veil'] },
            { id: 'blood', label: 'Blood', options: ['border_blood_thrask', 'obsidian_graft_thrask'] },
            { id: 'stride', label: 'Stride', options: ['ash_skimmer_thrask', 'scree_sprint_thrask'] }
        ]
    },
    clean_vreken: {
        core: 'lantern_eyes_vreken',
        rows: [
            { id: 'blood', label: 'Blood', options: ['deep_glow_blood_clean', 'crypt_record_clean'] },
            { id: 'song', label: 'Song', options: ['crypt_chant_clean', 'crypt_pulse_clean'] },
            { id: 'sense', label: 'Sense', options: ['spore_sense_vreken', 'clean_mourners_bloom'] }
        ]
    },
    marked_vreken: {
        core: 'lantern_eyes_vreken',
        rows: [
            { id: 'sight', label: 'Sight', options: ['ghost_mycelium_sight_marked', 'spore_sense_vreken'] },
            { id: 'veil', label: 'Veil', options: ['hush_temptation_marked', 'root_veil_echo_vreken'] },
            { id: 'mark', label: 'Mark', options: ['death_mark_strike_marked', 'marked_spore_cloak'] }
        ]
    },
    velun_neth: {
        core: 'pact_stillness_neth',
        rows: [
            { id: 'word', label: 'Word', options: ['bound_tongue_velun', 'clause_of_binding_velun'] },
            { id: 'lore', label: 'Lore', options: ['memory_glass_training_velun', 'returned_count_neth'] },
            { id: 'flame', label: 'Flame', options: ['pact_flame_velun', 'velun_oath_ward'] }
        ]
    },
    kessen_neth: {
        core: 'pact_stillness_neth',
        rows: [
            { id: 'sight', label: 'Sight', options: ['keepers_sight_kessen', 'returned_count_neth'] },
            { id: 'thread', label: 'Thread', options: ['probability_weave_kessen', 'thread_snap_kessen'] },
            { id: 'ledger', label: 'Ledger', options: ['chronometric_intuition_kessen', 'kessen_loose_thread'] }
        ]
    },
    drun_neth: {
        core: 'pact_stillness_neth',
        rows: [
            { id: 'silence', label: 'Silence', options: ['silence_walker_drun', 'drun_unsigned_step'] },
            { id: 'body', label: 'Body', options: ['bog_survival_drun', 'returned_count_neth'] },
            { id: 'strike', label: 'Strike', options: ['null_strike_drun', 'drun_pact_breaker'] }
        ]
    },
    vashir_astril: {
        core: 'selunis_quest_astril',
        rows: [
            { id: 'light', label: 'Light', options: ['star_burst_vashir', 'luminous_eyes_astril'] },
            { id: 'night', label: 'Night', options: ['lumian_vigil_vashir', 'inverted_vision_astril'] },
            { id: 'blood', label: 'Blood', options: ['starlight_resonance_vashir', 'constellation_reading_vashir'] }
        ]
    },
    silath_astril: {
        core: 'selunis_quest_astril',
        rows: [
            { id: 'tide', label: 'Tide', options: ['read_the_tide_silath', 'lunar_attunement_silath'] },
            { id: 'dream', label: 'Dream', options: ['memory_of_lumia_silath', 'silver_eyes_silath'] },
            { id: 'sight', label: 'Sight', options: ['inverted_vision_astril', 'luminous_eyes_astril'] }
        ]
    },
    kethrin_fexric: {
        core: 'still_air_sense_fexric',
        rows: [
            { id: 'craft', label: 'Craft', options: ['guild_precision_kethrin', 'machine_song_kethrin'] },
            { id: 'burst', label: 'Burst', options: ['neural_overclock_kethrin', 'kethrin_cold_iron_focus'] },
            { id: 'secret', label: 'Secret', options: ['hoarded_secret_kethrin', 'kethrin_ledger_of_hands'] }
        ]
    },
    drall_fexric: {
        core: 'still_air_sense_fexric',
        rows: [
            { id: 'blood', label: 'Blood', options: ['sump_acclimation_drall', 'drall_sump_taste'] },
            { id: 'salvage', label: 'Salvage', options: ['sump_salvage_drall', 'scrap_shield_drall'] },
            { id: 'rig', label: 'Rig', options: ['jury_rig_drall', 'drall_slag_cast'] }
        ]
    },
    thalren_human: {
        core: 'desperate_will_human',
        rows: [
            { id: 'mind', label: 'Mind', options: ['lineage_recall_thalren', 'written_word_thalren'] },
            { id: 'fog', label: 'Fog', options: ['fog_sense_thalren', 'fog_step_thalren'] },
            { id: 'quill', label: 'Quill', options: ['thalren_ink_stained_hand', 'thalren_archivists_gaze'] }
        ]
    },
    skald_human: {
        core: 'desperate_will_human',
        rows: [
            { id: 'cold', label: 'Cold', options: ['cold_endurance_skald', 'glacier_rage_skald'] },
            { id: 'pride', label: 'Pride', options: ['bloodline_pride_skald', 'frost_knuckle_skald'] },
            { id: 'saga', label: 'Saga', options: ['skald_saga_memory', 'skald_shield_brothers_oath'] }
        ]
    },
    tessen_human: {
        core: 'desperate_will_human',
        rows: [
            { id: 'shadow', label: 'Shadow', options: ['keep_rat_tessen', 'sealed_silence_tessen'] },
            { id: 'debt', label: 'Debt', options: ['favor_debt_tessen', 'geothermal_sense_tessen'] },
            { id: 'lock', label: 'Lock', options: ['tessen_keyhole_eye', 'tessen_tinkers_fingers'] }
        ]
    },
    merryn_human: {
        core: 'desperate_will_human',
        rows: [
            { id: 'sea', label: 'Sea', options: ['sea_legs_merryn', 'storm_luck_merryn'] },
            { id: 'deal', label: 'Deal', options: ['tattoo_contract_merryn', 'salt_cut_merryn'] },
            { id: 'rope', label: 'Rope', options: ['merryn_rope_hand', 'merryn_harbor_talk'] }
        ]
    },
    ordan_human: {
        core: 'desperate_will_human',
        rows: [
            { id: 'march', label: 'March', options: ['endless_march_ordan', 'herd_instinct_ordan'] },
            { id: 'song', label: 'Song', options: ['throat_song_ordan', 'mound_offering_ordan'] },
            { id: 'steppe', label: 'Steppe', options: ['ordan_horizon_eye', 'ordan_saddle_born'] }
        ]
    }
};

export const getAncestryLoadout = (subraceId) => (subraceId && ANCESTRY_LOADOUTS[subraceId]) || null;
export const hasAncestryLoadout = (subraceId) => !!getAncestryLoadout(subraceId);

const subraceTraits = (raceId, subraceId) => {
    const sub = raceId && subraceId ? getSubraceData(raceId, subraceId) : null;
    const traits = sub?.traits;
    return Array.isArray(traits) ? traits : Object.values(traits || {});
};

/** Resolve a gift id to its full record (new gift, or the heritage's existing trait). */
export function resolveAncestryGift(raceId, subraceId, giftId) {
    if (!giftId) return null;
    if (ANCESTRY_GIFTS[giftId]) return ANCESTRY_GIFTS[giftId];
    const shared = raceId ? (getRaceData(raceId)?.sharedTraits || []) : [];
    return subraceTraits(raceId, subraceId).find(t => t && t.id === giftId) || shared.find(t => t && t.id === giftId) || null;
}

/** The loadout with every id resolved to its record, for UI and tests. */
export function getResolvedAncestryLoadout(raceId, subraceId) {
    const loadout = getAncestryLoadout(subraceId);
    if (!loadout) return null;
    return {
        core: resolveAncestryGift(raceId, subraceId, loadout.core),
        rows: loadout.rows.map(row => ({
            ...row,
            options: row.options.map(id => resolveAncestryGift(raceId, subraceId, id))
        }))
    };
}

/** All trait ids a loadout governs (core + every option). */
export function getGovernedGiftIds(subraceId) {
    const loadout = getAncestryLoadout(subraceId);
    if (!loadout) return new Set();
    return new Set([loadout.core, ...loadout.rows.flatMap(r => r.options)]);
}

/** Empty picks object for a heritage. */
export function emptyAncestryPicks(subraceId) {
    const loadout = getAncestryLoadout(subraceId);
    return loadout ? Object.fromEntries(loadout.rows.map(r => [r.id, null])) : {};
}

/** Build the stored ancestry value for a heritage and a picks map. */
export function buildAncestry(subraceId, picks = {}) {
    const loadout = getAncestryLoadout(subraceId);
    if (!loadout) return null;
    return {
        heritageId: subraceId,
        core: loadout.core,
        picks: { ...emptyAncestryPicks(subraceId), ...picks },
        catalogVersion: ANCESTRY_CATALOG_VERSION
    };
}

/**
 * Check a character's ancestry against its heritage's loadout.
 * Returns { required, complete, chosen, missingRows, errors }.
 */
export function validateAncestry(subraceId, ancestry) {
    const loadout = getAncestryLoadout(subraceId);
    if (!loadout) return { required: false, complete: true, chosen: 0, missingRows: [], errors: [] };
    const errors = [];
    const picks = (ancestry && ancestry.heritageId === subraceId && ancestry.picks) || {};
    if (ancestry && ancestry.heritageId && ancestry.heritageId !== subraceId) {
        errors.push('These gifts belong to a different heritage.');
    }
    const missingRows = [];
    let chosen = 0;
    loadout.rows.forEach(row => {
        const pick = picks[row.id];
        if (!pick) { missingRows.push(row.id); return; }
        if (!row.options.includes(pick)) { errors.push(`"${pick}" is not an option in the ${row.label} row.`); missingRows.push(row.id); return; }
        chosen += 1;
    });
    return { required: true, complete: missingRows.length === 0 && errors.length === 0, chosen, missingRows, errors };
}

/**
 * Apply a character's ancestry to a heritage's combined trait list.
 * - No loadout for the heritage, or no (matching) ancestry on the character: unchanged (legacy).
 * - Otherwise: drop governed traits that were not picked, and add the core and any
 *   picked new gifts that are not race-file traits.
 */
export function applyAncestryToTraits(traits, raceId, subraceId, ancestry) {
    const list = Array.isArray(traits) ? traits : [];
    const loadout = getAncestryLoadout(subraceId);
    if (!loadout || !ancestry || ancestry.heritageId !== subraceId) return list;
    const chosen = new Set([loadout.core, ...loadout.rows.map(r => ancestry.picks?.[r.id]).filter(id => id && loadout.rows.some(r => r.options.includes(id)))]);
    const governed = getGovernedGiftIds(subraceId);
    const kept = list.filter(t => !t || !governed.has(t.id) || chosen.has(t.id));
    const present = new Set(kept.map(t => t && t.id));
    chosen.forEach(id => {
        if (!present.has(id)) {
            const rec = resolveAncestryGift(raceId, subraceId, id);
            if (rec) kept.push(rec);
        }
    });
    return kept;
}
