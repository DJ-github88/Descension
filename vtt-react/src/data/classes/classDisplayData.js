import { UTILITY_SPELLS } from '../spells/utilitySpells';
import {
    faSkull, faMagic, faAtom, faClock,
    faGavel, faEye, faShieldAlt, faMoon, faCross, faYinYang,
    faWind, faBiohazard, faFlask, faMusic, faFire,
    faDove, faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';

export const CLASS_DISPLAY_DATA = [
    {
        name: 'Arcanoneer',
        imageIcon: '/assets/icons/classes/arcanoneer.png',
        icon: faAtom,
        role: 'Elemental Combinator',
        resource: 'Spheres',
        complexityRating: 5,
        cognitiveTags: ['Dice-Pool Management', '36-Combo Matrix', 'Recoil Anchor'],
        playstyle: 'An elemental weaver who combines raw elemental spheres into devastating compound spellcraft. Master of none but proficient in all, every weave balances raw destructive potential against calculated risk.',
        roleColor: '#e67e22',
        damageTypes: ['arcane', 'ember', 'rime', 'storm', 'wyrd', 'primal', 'blight', 'sacred'],
        quickStartPresets: {
            striker: { name: 'Thermal Blaster', description: 'Focus on fire, frost, and storm combinations for direct burst damage.', spells: ['arcanoneer_attack_weave', 'arcanoneer_buff_weave'] },
            controller: { name: 'Area Trapper', description: 'Focus on environmental hazard zones, steam clouds, and defensive shields.', spells: ['arcanoneer_defend_weave', 'arcanoneer_trap_weave'] }
        }
    },
    {
        name: 'Berserker',
        imageIcon: '/assets/icons/classes/berserker.png',
        icon: faSkull,
        role: 'Striker / Juggernaut',
        resource: 'Rage',
        complexityRating: 1,
        cognitiveTags: ['High Risk/Reward', 'Battle-Trance', 'Execute Burst'],
        playstyle: 'Channel the Hunger Pact through your veins, transforming ancestral starvation into unstoppable fury. Nordhalla frozen Archive forges have produced Berserkers for centuries, each carrying unrelenting martial momentum.',
        roleColor: '#e74c3c',
        damageTypes: ['smashing', 'stabbing', 'slicing'],
        quickStartPresets: {
            striker: { name: 'Hunger Executioner', description: 'Relentless offensive strikes that build rapid Rage.', spells: ['bsk_hemorrhagic_strike', 'bsk_boiling_veins', 'bsk_hunger_scent'] },
            tank: { name: 'Caldera Juggernaut', description: 'Absorb incoming blows, ignoring pain and trading HP for unstoppable momentum.', spells: ['bsk_skull_splitter', 'bsk_retaliatory_cleave', 'bsk_caldera_warmth'] }
        }
    },
    {
        name: 'Shaper',
        imageIcon: '/assets/icons/classes/shaper.png',
        icon: faYinYang,
        role: 'Hybrid Adaptation',
        resource: 'Flux',
        complexityRating: 4,
        cognitiveTags: ['6 Dynamic Stances', '0 Base Armor', 'High APM'],
        playstyle: 'The Groven bone-readers of the Cragjaw Peaks learned the Shaping Forms from the ancestor spans. Your body is the weapon, reshaping bone, sinew, and kinetic force into fluid martial stances.',
        roleColor: '#e74c3c',
        damageTypes: ['smashing', 'stabbing', 'slicing'],
        quickStartPresets: {
            striker: { name: 'Centrifugal Striker', description: 'High-mobility kinetic attacker who spins between stances.', spells: ['shaper_bone_spike', 'shaper_centrifugal_fury', 'shaper_kinetic_glide'] },
            tank: { name: 'Calcified Bastion', description: 'Hardens skeletal structure into biological armor.', spells: ['shaper_deadened_bastion', 'shaper_reactive_parry', 'shaper_anatomical_mimicry'] }
        }
    },
    {
        name: 'Harbinger',
        imageIcon: '/assets/icons/classes/harbinger.png',
        icon: faHourglassHalf,
        role: 'Doom Caster / Control',
        resource: 'Mayhem',
        complexityRating: 3,
        cognitiveTags: ['Ticking Prophecies', 'Mayhem Pressure', 'd100 Wild Surges'],
        playstyle: 'Compute the doom arithmetic of dying stars. Channel entropic friction into living prophecies, building Mayhem pressure toward Wild Surges that rewrite probability in a radius of ash and planar silence.',
        roleColor: '#9b59b6',
        damageTypes: ['storm', 'blight', 'wyrd', 'ember'],
        quickStartPresets: {
            blaster: { name: 'Entropy Blaster', description: 'High-velocity storm and fire entropy spells.', spells: ['harbinger_doom_whisper', 'harbinger_cataclysm_countdown'] },
            controller: { name: 'Doomsday Prophet', description: 'Seed ticking prophecy bombs across multiple targets.', spells: ['harbinger_prophecy_of_ash', 'harbinger_planar_collapse'] }
        }
    },
    {
        name: 'Chronarch',
        imageIcon: '/assets/icons/classes/chronarch.png',
        icon: faClock,
        role: 'Time Controller',
        resource: 'Shards',
        complexityRating: 3,
        cognitiveTags: ['Time Banking', 'Undo Mechanics', 'Temporal Strain'],
        playstyle: 'The Fexric guild vaults guard clockwork engines that bend time inside the mountain blizzard. Slow your enemies, accelerate your allies, and rewind mortal wounds through brass chest engines.',
        roleColor: '#9b59b6',
        damageTypes: ['storm', 'arcane'],
        quickStartPresets: {
            support: { name: 'Timeline Medic', description: 'Rewind wounds and accelerate ally turn economy.', spells: ['chronarch_rewind_flesh', 'chronarch_time_dilation'] },
            controller: { name: 'Stasis Architect', description: 'Freeze projectiles and pin enemies in localized time fields.', spells: ['chronarch_clockwork_snare', 'chronarch_stasis_field'] }
        }
    },
    {
        name: 'Inquisitor',
        imageIcon: '/assets/icons/classes/inquisitor.png',
        icon: faGavel,
        role: 'Occult Arbiter',
        resource: 'Authority',
        complexityRating: 2,
        cognitiveTags: ['Anti-Magic Tank', 'Cold-Iron Brands', 'Contract Severing'],
        playstyle: 'Swear the Barbed Vow and wield cold iron against aberrant horrors. Nullify reality warping corruption, sever dark contracts, and execute the supernatural with unyielding legal authority.',
        roleColor: '#8B0000',
        damageTypes: ['ember', 'storm', 'blight'],
        quickStartPresets: {
            antiMage: { name: 'Witch Hammer', description: 'Specialize in counterspelling and silencing mages.', spells: ['inq_cold_iron_brand', 'inq_null_field', 'inq_iron_adjudication'] },
            brawler: { name: 'Iron Verdict', description: 'Heavy cold-iron melee bruiser with execution potential.', spells: ['inq_righteous_strike', 'inq_sever_contract', 'inq_iron_interrogation'] }
        }
    },
    {
        name: 'Revenant',
        imageIcon: '/assets/icons/classes/revenant.png',
        icon: faSkull,
        role: 'Soul Harvester',
        resource: 'Toll',
        complexityRating: 3,
        cognitiveTags: ['HP Casting', 'Phylactery Bank', 'Resurrection Freeze'],
        playstyle: 'In the Bryngloom, death does not end your contractual obligations. Harvest soul fragments and store them in a personal phylactery, resurrecting with the devastating authority of one the grave could not hold.',
        roleColor: '#e67e22',
        damageTypes: ['blight', 'rime', 'wyrd'],
        quickStartPresets: {
            tank: { name: 'Frost Stasis Lord', description: 'Peat-frost preservation, HP absorption, and self-resurrection.', spells: ['rv_tomb_frost_shroud', 'rv_corpse_walk', 'rv_frost_stasis'] },
            blaster: { name: 'Blood Harvester', description: 'Spend health for devastating necrotic burst damage.', spells: ['rv_necrotic_bolt', 'rv_corpse_explosion', 'rv_death_sense'] }
        }
    },
    {
        name: 'False Prophet',
        imageIcon: '/assets/icons/classes/false_prophet.png',
        icon: faEye,
        role: 'Deception Controller',
        resource: 'Madness',
        complexityRating: 3,
        cognitiveTags: ['Congregation Positioning', 'Damage Redirection', 'Madness Scaling'],
        playstyle: 'Manufacture a faith from silence and preach it as absolute revelation. Peer into the dark with blank eyes, trading sanity for a fanatical congregation that will follow your doctrine anywhere.',
        roleColor: '#9b59b6',
        damageTypes: ['wyrd', 'blight'],
        quickStartPresets: {
            support: { name: 'Martyr of Lies', description: 'Redirect ally wounds onto enemies with empathetic links.', spells: ['fp_stitch_of_suffering', 'fp_manufactured_miracle'] },
            controller: { name: 'Void Heretic', description: 'Disorient enemy formations with heresy whispers and void blasts.', spells: ['fp_heresy_whispers', 'fp_silence_gaze'] }
        }
    },
    {
        name: 'Gambit',
        imageIcon: '/assets/icons/classes/gambit.png',
        icon: faMagic,
        role: 'Critical Gambler',
        resource: 'Fortune',
        complexityRating: 4,
        cognitiveTags: ['Dice Nudging', 'Fate Card Overrides', 'Dual Collapse Limit'],
        playstyle: 'The Luck Ledger inquisitors audit probability like a merchant audits debt shares. Split your mind across alternate timelines, wager Fortune on high-stakes rolls, and claim stolen luck.',
        roleColor: '#f1c40f',
        damageTypes: ['wyrd', 'storm'],
        quickStartPresets: {
            blaster: { name: 'High Roller', description: 'Stack exploding critical strikes and high-stakes card throws.', spells: ['gambit_card_throw', 'gambit_jackpot_surge'] },
            support: { name: 'Probability Savant', description: 'Nudge ally attack rolls and save failures with Fortune.', spells: ['gambit_loaded_die', 'gambit_house_advantage'] }
        }
    },
    {
        name: 'Apex',
        imageIcon: '/assets/icons/classes/apex.png',
        icon: faMoon,
        role: 'Predator / Duelist',
        resource: 'Marks',
        complexityRating: 1,
        cognitiveTags: ['Companion Flanking', 'Glaive Chains', 'Stealth Ambush'],
        playstyle: 'Mark priority targets from the absolute silence of the Silent Hunt. Read environmental vibrations through the whiteout fog and strike with lethal precision before the quarry knows you are there.',
        roleColor: '#e74c3c',
        damageTypes: ['smashing', 'stabbing', 'slicing'],
        quickStartPresets: {
            melee: { name: 'Glaive Dancer', description: 'Chain devastating sweeping attacks across clustered enemies.', spells: ['apex_twin_fang', 'apex_shadow_tether', 'apex_pack_intercept'] },
            tracker: { name: 'Mist Stalker', description: 'Stalk from fog, striking from absolute silence with companion assistance.', spells: ['apex_shadow_leap', 'apex_fog_truesight', 'apex_beast_scout'] }
        }
    },
    {
        name: 'Animist',
        imageIcon: '/assets/icons/classes/animist.png',
        icon: faWind,
        role: 'Spirit Summoner',
        resource: 'Resonance',
        complexityRating: 3,
        cognitiveTags: ['Triple Tradition', 'Bone Terraforming', 'Spirit Erosion (15+)'],
        playstyle: 'Open channels between the living and the ancestral courts, binding spectral power through bone totems, overtone songs, and sacred spore rites while managing progressive spirit erosion.',
        roleColor: '#2ecc71',
        damageTypes: ['primal', 'blight', 'storm'],
        quickStartPresets: {
            controller: { name: 'Thornwarden', description: 'Lock down choke points with permanent bone walls and runic networks.', spells: ['animist_bone_wall', 'animist_earthen_splinter', 'animist_spirit_voice'] },
            summoner: { name: 'Spirit Binder', description: 'Summon beast specters and spread cascading ancestral curses.', spells: ['animist_corpse_curse', 'animist_ancestral_echo', 'animist_spirit_hawk'] }
        }
    },
    {
        name: 'Lunarch',
        imageIcon: '/assets/icons/classes/lunarch.png',
        icon: faMoon,
        role: 'Moon Ritualist',
        resource: 'Phases',
        complexityRating: 3,
        cognitiveTags: ['4-Phase Cycle', 'Gravity Fields', 'Transition Shock'],
        playstyle: 'Capture the dead moon silver light in your veins as a celestial symbiote feeds. Manipulate gravity fields across lunar phases to pull foes into devastating starlight collapses.',
        roleColor: '#f1c40f',
        damageTypes: ['arcane', 'ember'],
        quickStartPresets: {
            blaster: { name: 'Silence Speaker', description: 'Maximize Full Moon radiant crits and apogee cataclysms.', spells: ['lunarch_silence_rend', 'lunarch_waxing_crescent_scythe'] },
            support: { name: 'Sanguine Warden', description: 'Vampiric healing, eclipse barriers, and gravitational repositioning.', spells: ['lunarch_sanguine_transfer', 'lunarch_eclipse_aegis'] }
        }
    },
    {
        name: 'Martyr',
        imageIcon: '/assets/icons/classes/martyr.png',
        icon: faCross,
        role: 'Sacrificial Tank',
        resource: 'Devotion',
        complexityRating: 1,
        cognitiveTags: ['Damage Intercept', 'Devotion Tiers (1-6)', 'Solar Shockwaves'],
        playstyle: 'Swear the Vow and suffer for your allies, absorbing their pain through sympathetic obsidian scars. Convert received suffering into radiant shielding and explosive solar shockwaves.',
        roleColor: '#3498db',
        damageTypes: ['ember'],
        quickStartPresets: {
            tank: { name: 'Redemption Guardian', description: 'Absorb lethal damage meant for allies and cleanse debuffs.', spells: ['martyr_intervene', 'martyr_shared_agony'] },
            brawler: { name: 'Ironclad Dreadnaught', description: 'Convert absorbed pain into boiler-pressure furnace strikes.', spells: ['martyr_crown_of_thorns', 'martyr_solar_transfiguration'] }
        }
    },
    {
        name: 'Minstrel',
        imageIcon: '/assets/icons/classes/minstrel.png',
        icon: faMusic,
        role: 'Bardic Commander',
        resource: 'Notes',
        complexityRating: 2,
        cognitiveTags: ['Note Collecting (I-VII)', 'Cadence Chords', 'No Self-Heal'],
        playstyle: 'Calm the storm gales with the maritime Tide Choir tradition. Weave acoustic melodies that shatter heavy armor, disrupt enemy incantations, and steady the resolve of your party.',
        roleColor: '#2ecc71',
        damageTypes: ['wyrd', 'storm'],
        quickStartPresets: {
            commander: { name: 'Battlechoir', description: 'War chants that increase ally attack velocity and shatter armor.', spells: ['minstrel_tide_song', 'minstrel_resonance_shatter'] },
            healer: { name: 'Soulsinger', description: 'Harmonic melodies that restore ally resolve and soothe mental debuffs.', spells: ['minstrel_calming_melody', 'minstrel_harmonic_shield'] }
        }
    },
    {
        name: 'Plaguebringer',
        imageIcon: '/assets/icons/classes/plaguebringer.png',
        icon: faBiohazard,
        role: 'Miasma Striker',
        resource: 'Virulence',
        complexityRating: 2,
        cognitiveTags: ['Seed -> Advance -> Pop', 'Virulence (0-100)', 'Spreading DoTs'],
        playstyle: 'Cultivate ghost mycelium rot inside your own tissues, hosting active symbiotic disease. Breed contagious, evolving afflictions across enemy ranks and harvest mature infections for necrotic bursts.',
        roleColor: '#e67e22',
        damageTypes: ['blight'],
        quickStartPresets: {
            aoe: { name: 'Virulent Spreader', description: 'Infect entire groups with contagious, spreading mycelial spores.', spells: ['pb_ghost_spore_seed', 'pb_epidemic_wave'] },
            singleTarget: { name: 'Torment Weaver', description: 'Stack lethal 3-stage diseases on bosses to trigger massive harvests.', spells: ['pb_festering_boil', 'pb_black_death_harvest'] }
        }
    },
    {
        name: 'Pyrofiend',
        imageIcon: '/assets/icons/classes/pyrofiend.png',
        icon: faFire,
        role: 'Chaos Blaster',
        resource: 'Veil',
        complexityRating: 2,
        cognitiveTags: ['10 Veil Levels', 'Escalating Fire Damage', 'Level 9 Death Clock'],
        playstyle: 'Swallow the volcanic embers of the Ashen Sovereign to become a living combustion chamber of volcanic fire. Trade stability for uncontrolled caldera heat capable of vaporizing armor.',
        roleColor: '#e74c3c',
        damageTypes: ['ember'],
        quickStartPresets: {
            blaster: { name: 'Inferno Blaster', description: 'Raw long-range fire artillery that rapidly scales Veil levels.', spells: ['pyro_ashen_dart', 'pyro_caldera_eruption'] },
            hazard: { name: 'Wildfire Shaper', description: 'Ignite the ground with spreading magma traps and firewalls.', spells: ['pyro_scathrachs_grasp', 'pyro_wildfire_ignite'] }
        }
    },
    {
        name: 'Spellguard',
        imageIcon: '/assets/icons/classes/spellguard.png',
        icon: faShieldAlt,
        role: 'Anti-Magic Bulwark',
        resource: 'Resonance',
        complexityRating: 3,
        cognitiveTags: ['Spell Absorption', 'Silence Resonance', 'AEP Meltdown (100)'],
        playstyle: 'Treat magical defense as forge engineering. Layer prismatic barriers, absorb incoming spell energy through heavy fortress shields, and discharge stored power back as kinetic shockwaves.',
        roleColor: '#3498db',
        damageTypes: ['arcane', 'storm'],
        quickStartPresets: {
            tank: { name: 'Prismatic Bastion', description: 'Intercept spells, absorb hostile magic, and project group barriers.', spells: ['sg_aegis_barrier', 'sg_null_field_bastion'] },
            counter: { name: 'Entropic Eraser', description: 'Discharge stored spell energy back at mages with kinetic force.', spells: ['sg_kinetic_discharge', 'sg_prismatic_mirror_bastion'] }
        }
    },
    {
        name: 'Toxicologist',
        imageIcon: '/assets/icons/classes/toxicologist.png',
        icon: faFlask,
        role: 'DoT / Master Apothecary',
        resource: 'Vials',
        complexityRating: 2,
        cognitiveTags: ['Pre-Combat Prep', 'Aerosol Traps', 'Neurotoxin Coatings'],
        playstyle: 'Master the Distillery craft by brewing vaporous chemical agents from wilderness flora and bog reagents. Deploy aerosol traps and coat blades in multi-stage neurotoxins.',
        roleColor: '#e67e22',
        damageTypes: ['blight'],
        quickStartPresets: {
            trapper: { name: 'Gadgeteer', description: 'Deploy aerosol mines and mechanical spring traps before combat.', spells: ['tox_acid_spring_trap', 'tox_paralytic_cloud'] },
            striker: { name: 'Venomancer', description: 'Coat weapons in flesh-rotting neurotoxins that compound on strike.', spells: ['tox_neurotoxin_coating', 'tox_plague_grenade'] }
        }
    },
    {
        name: 'Warden',
        imageIcon: '/assets/icons/classes/warden.png',
        icon: faGavel,
        role: 'Territory Controller',
        resource: 'Tension',
        complexityRating: 2,
        cognitiveTags: ['15ft Forced Duel', 'Spine Chains', 'Tension & Drag'],
        playstyle: 'Drive rusted cold-iron chains through your forearms to become one of the Bound. Tether monstrous foes into forced duels, building Tension to cage, drag, and execute your prey.',
        roleColor: '#e67e22',
        damageTypes: ['smashing', 'stabbing', 'slicing', 'storm', 'primal'],
        quickStartPresets: {
            lockdown: { name: 'Iron Jailer', description: 'Tether the boss into a 15ft duel, pinning it away from allies.', spells: ['warden_iron_tether', 'warden_spine_anchor', 'warden_chain_grapple'] },
            punisher: { name: 'Relentless Tormentor', description: 'Reel enemies across broken ground to inflict crushing drag wounds.', spells: ['warden_reel_fracture', 'warden_chain_snap', 'warden_jailer_interrogation'] }
        }
    },
    {
        name: 'Augur',
        imageIcon: '/assets/icons/classes/augur.png',
        icon: faDove,
        role: 'Fate Prophet / Debuffer',
        resource: 'Omens',
        complexityRating: 3,
        cognitiveTags: ['Even/Odd d20 Tracking', 'Visceral Blood Price', 'Omen Intercepts'],
        playstyle: 'Read the signs in every die roll: even numbers fuel your Benediction, odd numbers your Malediction. Whisper omens across the battlefield to rewrite luck and predict incoming strikes.',
        roleColor: '#9b59b6',
        damageTypes: ['wyrd', 'ember'],
        quickStartPresets: {
            debuffer: { name: 'Harbinger of Rot', description: 'Spend Odd d20 rolls to cripple enemy armor and inflict rot.', spells: ['augur_read_the_signs', 'augur_bone_splinter_omen'] },
            healer: { name: 'Hierophant of Omens', description: 'Spend Even d20 rolls to ward allies and heal fatal strikes.', spells: ['augur_visceral_inscription', 'augur_fate_severance'] }
        }
    },
    {
        name: 'Crusader',
        imageIcon: '/assets/icons/classes/crusader.png',
        icon: faCross,
        role: 'Vanguard / Holy Defender',
        resource: 'Fervor',
        complexityRating: 1,
        cognitiveTags: ['Builder/Spender', 'Consecrated Ground', 'Solar Smite Burst'],
        playstyle: 'Wield heavy starlight-forged greatswords and shields, channeling celestial sacrifice to purge abyss spawns. Build Fervor in battle to unleash devastating solar judgments.',
        roleColor: '#f59e0b',
        damageTypes: ['sacred', 'ember', 'smashing', 'stabbing', 'slicing', 'storm'],
        quickStartPresets: {
            striker: { name: 'Solar Justiciar', description: 'Greatsword cleaves that generate fervor for massive smites.', spells: ['starlight_cleave', 'zealous_strike', 'crusader_beacon_of_truth'] },
            tank: { name: 'Dawn Bastion', description: 'Tower shield wall, consecrated territory, and party damage soak.', spells: ['bastion_stance', 'crusader_starlight_interposition', 'crusader_sanctified_hearth'] }
        }
    }
];

export default CLASS_DISPLAY_DATA;
