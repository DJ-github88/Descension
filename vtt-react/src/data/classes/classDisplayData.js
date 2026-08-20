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
        resource: 'Elemental Spheres',
        playstyle: 'An elemental weaver who combines raw elemental spheres into devastating compound spellcraft. Master of none but proficient in all, every weave balances raw destructive potential against calculated risk.',
        roleColor: '#e67e22',
        damageTypes: ['arcane', 'ember', 'rime', 'storm', 'wyrd', 'primal', 'blight', 'sacred']
    },
    {
        name: 'Berserker',
        imageIcon: '/assets/icons/classes/berserker.png',
        icon: faSkull,
        role: 'Striker / Juggernaut',
        resource: 'Blood Heat',
        playstyle: 'Channel the Hunger Pact through your veins, transforming ancestral starvation into unstoppable fury. Nordhalla frozen Archive forges have produced Berserkers for centuries, each carrying unrelenting martial momentum.',
        roleColor: '#e74c3c',
        damageTypes: ['smashing', 'stabbing', 'slicing']
    },
    {
        name: 'Shaper',
        imageIcon: '/assets/icons/classes/shaper.png',
        icon: faYinYang,
        role: 'Hybrid Adaptation',
        resource: 'Kinetic Flux & Body Toll',
        playstyle: 'The Groven bone-readers of the Cragjaw Peaks learned the Shaping Forms from the ancestor spans. Your body is the weapon, reshaping bone, sinew, and kinetic force into fluid martial stances.',
        roleColor: '#e74c3c',
        damageTypes: ['smashing', 'stabbing', 'slicing']
    },
    {
        name: 'Harbinger',
        imageIcon: '/assets/icons/classes/harbinger.png',
        icon: faHourglassHalf,
        role: 'Doom Caster / Control',
        resource: 'Mayhem & Heat',
        playstyle: 'Compute the doom arithmetic of dying stars. Channel entropic friction into living prophecies, building Mayhem pressure toward Wild Surges that rewrite probability in a radius of ash and planar silence.',
        roleColor: '#9b59b6',
        damageTypes: ['storm', 'blight', 'wyrd', 'ember']
    },
    {
        name: 'Chronarch',
        imageIcon: '/assets/icons/classes/chronarch.png',
        icon: faClock,
        role: 'Time Controller',
        resource: 'Time Shards & Strain',
        playstyle: 'The Fexric guild vaults guard clockwork engines that bend time inside the mountain blizzard. Slow your enemies, accelerate your allies, and rewind mortal wounds through brass chest engines.',
        roleColor: '#9b59b6',
        damageTypes: ['storm', 'arcane']
    },
    {
        name: 'Inquisitor',
        imageIcon: '/assets/icons/classes/inquisitor.png',
        icon: faGavel,
        role: 'Occult Arbiter',
        resource: 'Righteous Authority',
        playstyle: 'Swear the Barbed Vow and wield cold iron against aberrant horrors. Nullify reality warping corruption, sever dark contracts, and execute the supernatural with unyielding legal authority.',
        roleColor: '#8B0000',
        damageTypes: ['ember', 'storm', 'blight']
    },
    {
        name: 'Revenant',
        imageIcon: '/assets/icons/classes/revenant.png',
        icon: faSkull,
        role: 'Soul Harvester',
        resource: 'Death Toll & Phylactery',
        playstyle: 'In the Bryngloom, death does not end your contractual obligations. Harvest soul fragments and store them in a personal phylactery, resurrecting with the devastating authority of one the grave could not hold.',
        roleColor: '#e67e22',
        damageTypes: ['blight', 'rime', 'wyrd']
    },
    {
        name: 'False Prophet',
        imageIcon: '/assets/icons/classes/false_prophet.png',
        icon: faEye,
        role: 'Deception Controller',
        resource: 'Madness Points',
        playstyle: 'Manufacture a faith from silence and preach it as absolute revelation. Peer into the dark with blank eyes, trading sanity for a fanatical congregation that will follow your doctrine anywhere.',
        roleColor: '#9b59b6',
        damageTypes: ['wyrd', 'blight']
    },
    {
        name: 'Gambit',
        imageIcon: '/assets/icons/classes/gambit.png',
        icon: faMagic,
        role: 'Critical Gambler',
        resource: 'Fortune Points',
        playstyle: 'The Luck Ledger inquisitors audit probability like a merchant audits debt shares. Split your mind across alternate timelines, wager Fortune Points on high-stakes rolls, and claim stolen luck.',
        roleColor: '#f1c40f',
        damageTypes: ['wyrd', 'storm']
    },
    {
        name: 'Apex',
        imageIcon: '/assets/icons/classes/apex.png',
        icon: faMoon,
        role: 'Predator / Duelist',
        resource: 'Quarry Marks',
        playstyle: 'Mark priority targets from the absolute silence of the Silent Hunt. Read environmental vibrations through the whiteout fog and strike with lethal precision before the quarry knows you are there.',
        roleColor: '#e74c3c',
        damageTypes: ['smashing', 'stabbing', 'slicing']
    },
    {
        name: 'Animist',
        imageIcon: '/assets/icons/classes/animist.png',
        icon: faWind,
        role: 'Spirit Summoner',
        resource: 'Ancestral Resonance',
        playstyle: 'Open channels between the living and the ancestral courts, binding spectral power through bone totems, overtone songs, and sacred spore rites while managing progressive spirit erosion.',
        roleColor: '#2ecc71',
        damageTypes: ['primal', 'blight', 'storm']
    },
    {
        name: 'Lunarch',
        imageIcon: '/assets/icons/classes/lunarch.png',
        icon: faMoon,
        role: 'Moon Ritualist',
        resource: 'Lunar Phases',
        playstyle: 'Capture the dead moon silver light in your veins as a celestial symbiote feeds. Manipulate gravity fields across lunar phases to pull foes into devastating starlight collapses.',
        roleColor: '#f1c40f',
        damageTypes: ['arcane', 'ember']
    },
    {
        name: 'Martyr',
        imageIcon: '/assets/icons/classes/martyr.png',
        icon: faCross,
        role: 'Sacrificial Tank',
        resource: 'Devotion Gauge',
        playstyle: 'Swear the Vow and suffer for your allies, absorbing their pain through sympathetic obsidian scars. Convert received suffering into radiant shielding and explosive solar shockwaves.',
        roleColor: '#3498db',
        damageTypes: ['ember']
    },
    {
        name: 'Minstrel',
        imageIcon: '/assets/icons/classes/minstrel.png',
        icon: faMusic,
        role: 'Bardic Commander',
        resource: 'Harmonic Cadences',
        playstyle: 'Calm the storm gales with the maritime Tide Choir tradition. Weave acoustic melodies that shatter heavy armor, disrupt enemy incantations, and steady the resolve of your party.',
        roleColor: '#2ecc71',
        damageTypes: ['wyrd', 'storm']
    },
    {
        name: 'Plaguebringer',
        imageIcon: '/assets/icons/classes/plaguebringer.png',
        icon: faBiohazard,
        role: 'Miasma Striker',
        resource: 'Virulence Strains',
        playstyle: 'Cultivate ghost mycelium rot inside your own tissues, hosting active symbiotic disease. Breed contagious, evolving afflictions across enemy ranks and harvest mature infections for necrotic bursts.',
        roleColor: '#e67e22',
        damageTypes: ['blight']
    },
    {
        name: 'Pyrofiend',
        imageIcon: '/assets/icons/classes/pyrofiend.png',
        icon: faFire,
        role: 'Chaos Blaster',
        resource: 'Inferno Veil',
        playstyle: 'Swallow the volcanic embers of the Ashen Sovereign to become a living combustion chamber of volcanic fire. Trade stability for uncontrolled caldera heat capable of vaporizing armor.',
        roleColor: '#e74c3c',
        damageTypes: ['ember']
    },
    {
        name: 'Spellguard',
        imageIcon: '/assets/icons/classes/spellguard.png',
        icon: faShieldAlt,
        role: 'Anti-Magic Bulwark',
        resource: 'Arcane Energy Points',
        playstyle: 'Treat magical defense as forge engineering. Layer prismatic barriers, absorb incoming spell energy through heavy fortress shields, and discharge stored power back as kinetic shockwaves.',
        roleColor: '#3498db',
        damageTypes: ['arcane', 'storm']
    },
    {
        name: 'Toxicologist',
        imageIcon: '/assets/icons/classes/toxicologist.png',
        icon: faFlask,
        role: 'DoT / Master Apothecary',
        resource: 'Toxin Vials & Traps',
        playstyle: 'Master the Distillery craft by brewing vaporous chemical agents from wilderness flora and bog reagents. Deploy aerosol traps and coat blades in multi-stage neurotoxins.',
        roleColor: '#e67e22',
        damageTypes: ['blight']
    },
    {
        name: 'Warden',
        imageIcon: '/assets/icons/classes/warden.png',
        icon: faGavel,
        role: 'Territory Controller',
        resource: 'Vengeance Points',
        playstyle: 'Drive rusted cold-iron chains through your forearms to become one of the Bound. Tether monstrous foes into forced duels, building Vengeance Points to cage, drag, and execute your prey.',
        roleColor: '#e67e22',
        damageTypes: ['smashing', 'stabbing', 'slicing', 'storm', 'primal']
    },
    {
        name: 'Augur',
        imageIcon: '/assets/icons/classes/augur.png',
        icon: faDove,
        role: 'Fate Prophet / Debuffer',
        resource: 'Benediction & Malediction',
        playstyle: 'Read the signs in every die roll: even numbers fuel your Benediction, odd numbers your Malediction. Whisper omens across the battlefield to rewrite luck and predict incoming strikes.',
        roleColor: '#9b59b6',
        damageTypes: ['wyrd', 'ember']
    },
    {
        name: 'Crusader',
        imageIcon: '/assets/icons/classes/crusader.png',
        icon: faCross,
        role: 'Vanguard / Holy Defender',
        resource: 'Radiant Fervor',
        playstyle: 'Wield heavy starlight-forged greatswords and shields, channeling celestial sacrifice to purge abyss spawns. Build Radiant Fervor in battle to unleash devastating solar judgments.',
        roleColor: '#f59e0b',
        damageTypes: ['sacred', 'ember', 'smashing', 'stabbing', 'slicing', 'storm'],
        comingSoon: false
    }
];

export default CLASS_DISPLAY_DATA;
