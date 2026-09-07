import { getClassResourceConfig } from '../data/classResources';

const pct = (cur, max) => (max > 0 ? cur / max : 0);

const tier = (value, breakpoints) => {
    for (let i = 0; i < breakpoints.length; i++) {
        if (value <= breakpoints[i].at) return breakpoints[i];
    }
    return breakpoints[breakpoints.length - 1];
};

const FLAVOR = {
    Pyrofiend: (res) => {
        const level = res?.current ?? 0;
        return tier(level, [
            { at: 0, line: "Scathrach slumbers. Your veins run cold.", tone: 'calm' },
            { at: 2, line: "A flicker of heat. The horror is stirring.", tone: 'calm' },
            { at: 4, line: "Embers crawl beneath your skin. It almost feels good.", tone: 'warm' },
            { at: 6, line: "Half-damned. The furnace door stands open.", tone: 'warm' },
            { at: 8, line: "You are mostly fire now. What's left of you is screaming.", tone: 'danger' },
            { at: 9, line: "NINTH CIRCLE. There is no further down: only ash.", tone: 'critical' },
        ]);
    },

    Berserker: (res) => {
        const rage = res?.current ?? 0;
        if (rage >= 150) return { line: "APOCALYPSE. You are no longer entirely human.", tone: 'critical' };
        if (rage >= 125) return { line: "ANNIHILATION. The bloodhammer drinks the room.", tone: 'critical' };
        if (rage >= 101) return { line: "OVERHEAT. Spend it now or it spends you.", tone: 'critical' };
        return tier(rage, [
            { at: 20, line: "Cold iron. Steady hands. For now.", tone: 'calm' },
            { at: 40, line: "The bloodhammer warms in your grip.", tone: 'calm' },
            { at: 60, line: "Teeth bared. You've stopped blinking.", tone: 'warm' },
            { at: 80, line: "They can smell the murder on you.", tone: 'warm' },
            { at: 100, line: "One more hit and you won't come back.", tone: 'danger' },
        ]);
    },

    Minstrel: (res) => {
        const count = res?.stacks?.length ?? res?.current ?? 0;
        return tier(count, [
            { at: 0, line: "Silence. The dead dimensions hold their breath.", tone: 'calm' },
            { at: 2, line: "A tentative melody. The room begins to listen.", tone: 'calm' },
            { at: 4, line: "Notes gather. A cadence is forming.", tone: 'warm' },
            { at: 6, line: "A symphony of stolen suns. Play it before it fades.", tone: 'warm' },
            { at: 99, line: "Every chord is loaded. Resolve something.", tone: 'danger' },
        ]);
    },

    Arcanoneer: (res) => {
        const count = res?.spheres?.length ?? res?.current ?? 0;
        return tier(count, [
            { at: 0, line: "The iron sleeve hangs empty. Roll the dice.", tone: 'calm' },
            { at: 2, line: "A few stray spheres rattling around.", tone: 'calm' },
            { at: 4, line: "The matrix hums: combinations are live.", tone: 'warm' },
            { at: 99, line: "Sleeve full. Combine or lose the overflow.", tone: 'danger' },
        ]);
    },

    Chronarch: (res) => {
        const strain = res?.temporalStrain?.current ?? res?.strain ?? 0;
        const shards = res?.timeShards?.current ?? res?.current ?? 0;
        if (strain >= 10) return { line: "TEMPORAL BACKLASH. You just lost your next turn.", tone: 'critical' };
        const t = tier(strain, [
            { at: 2, line: "The timeline holds. For now.", tone: 'calm' },
            { at: 4, line: "Reality blurs a little at your edges.", tone: 'calm' },
            { at: 6, line: "Your shadow is running two seconds behind you.", tone: 'warm' },
            { at: 8, line: "One more flux and the timeline snaps back.", tone: 'danger' },
            { at: 9, line: "Strain critical. Step away from the chronomancy.", tone: 'danger' },
        ]);
        if (shards >= 8 && strain <= 4) return { line: "Time Shards brimming. Spend before the strain catches up.", tone: 'warm' };
        return t;
    },

    Harbinger: (res) => {
        const mayhem = res?.current ?? 0;
        if (mayhem >= 100) return { line: "WILD SURGE. Nobody blink.", tone: 'critical' };
        return tier(mayhem, [
            { at: 25, line: "The entropy is quiet. Too quiet.", tone: 'calm' },
            { at: 50, line: "Every spell you cast is louder than the last.", tone: 'calm' },
            { at: 75, line: "The room is bending. Something is trying to get out.", tone: 'warm' },
            { at: 99, line: "Pressure peak. The surge is coming whether you want it or not.", tone: 'danger' },
        ]);
    },

    Gambit: (res) => {
        const fp = res?.current ?? 0;
        const max = res?.max ?? 1;
        const ratio = pct(fp, max);
        if (ratio >= 0.9) return { line: "All-in territory. The whole table is sweating.", tone: 'warm' };
        if (ratio >= 0.5) return { line: "You're riding the odds.", tone: 'calm' };
        if (fp <= 1) return { line: "Broke. The house always wins: until it doesn't.", tone: 'danger' };
        return { line: "A few chips left. Play them slow.", tone: 'calm' };
    },

    Revenant: (res) => {
        const tokens = res?.toll ?? res?.current ?? res?.bloodTokens ?? 0;
        if (tokens >= 16) return { line: "CRITICAL MASS. One death and you take the block with you.", tone: 'critical' };
        if (tokens >= 11) return { line: "Volatile. Healing won't take: you're a walking bomb.", tone: 'danger' };
        if (tokens >= 6) return { line: "Searing resonance. Frost-fire burns in your veins.", tone: 'warm' };
        if (tokens === 0) return { line: "Dry veins. No bargains struck. Yet.", tone: 'calm' };
        return { line: "Stable. The cold blood runs quiet, for now.", tone: 'calm' };
    },

    Animist: (res) => {
        const resonance = res?.resonance ?? res?.current ?? 0;
        if (resonance >= 20) return { line: "TRIPLE TOLL CATACLYSM. The ancestors consume you! Forced movement shatters all.", tone: 'critical' };
        if (resonance >= 15) return { line: "SPIRIT EROSION. 100% ember vulnerability! Party healing severed. Spend or bleed!", tone: 'danger' };
        if (resonance >= 10) return { line: "Apex harmonic. Skin sigils ignite with ancestral static. Peak efficiency.", tone: 'warm' };
        if (resonance >= 5) return { line: "Harmonized resonance. Totem conduits and sigils hum emerald.", tone: 'calm' };
        if (resonance > 0) return { line: "A faint throat-hum. The ancestors are listening.", tone: 'calm' };
        return { line: "The dead slumber. Conduits cold, root-veins quiet.", tone: 'calm' };
    },

    Martyr: (res) => {
        const lvl = res?.current ?? 0;
        return tier(lvl, [
            { at: 0, line: "Faith is a dry well. Bleed for it.", tone: 'calm' },
            { at: 2, line: "A trickle of grace. It costs you.", tone: 'calm' },
            { at: 4, line: "Radiant. They can feel it from across the room.", tone: 'warm' },
            { at: 6, line: "You are more wound than person now. Glorious.", tone: 'danger' },
        ]);
    },

    'False Prophet': (res) => {
        const madness = res?.current ?? 0;
        if (madness >= 20) return { line: "INSANITY CONVULSION. Something just broke.", tone: 'critical' };
        return tier(madness, [
            { at: 5, line: "The voices are distant. Mostly.", tone: 'calm' },
            { at: 9, line: "Whispers become words. Terrible words.", tone: 'calm' },
            { at: 14, line: "The Silence is wearing your face.", tone: 'warm' },
            { at: 19, line: "DANGER ZONE. One more revelation and you break.", tone: 'danger' },
        ]);
    },

    Inquisitor: (res) => {
        const auth = res?.current ?? 0;
        if (auth <= 0) return { line: "Your grip on the occult has slipped. The demons noticed.", tone: 'critical' };
        return tier(auth, [
            { at: 3, line: "Tenuous authority. They're testing you.", tone: 'warm' },
            { at: 6, line: "Firm grip. They kneel.", tone: 'calm' },
            { at: 8, line: "Inquisitor indeed. Speak, and they obey.", tone: 'calm' },
        ]);
    },

    Plaguebringer: (res) => {
        const vir = res?.currentVirulence ?? res?.current ?? 0;
        return tier(vir, [
            { at: 24, line: "Dormant spores. The garden hasn't woken.", tone: 'calm' },
            { at: 49, line: "Taking root. The afflictions are strengthening.", tone: 'calm' },
            { at: 74, line: "Blooming. Rot spreads in your wake.", tone: 'warm' },
            { at: 100, line: "PEAK HARVEST. Everything you touch, spoils.", tone: 'warm' },
        ]);
    },

    Toxicologist: (res) => {
        const vials = res?.toxinVials?.current ?? res?.current ?? 0;
        const max = res?.toxinVials?.max ?? res?.max ?? 1;
        const ratio = pct(vials, max);
        if (ratio >= 0.9) return { line: "Arsenal stocked. The battlefield is your lab.", tone: 'warm' };
        if (ratio <= 0.15) return { line: "Out of reagents. Time to brew.", tone: 'danger' };
        return { line: "A careful reserve. Spend them well.", tone: 'calm' };
    },

    Spellguard: (res) => {
        const aep = res?.current ?? 0;
        if (aep >= 100) return { line: "CRITICAL MELTDOWN IMMINENT. Vent or detonate.", tone: 'critical' };
        return tier(aep, [
            { at: 20, line: "The shell is thin. Siphon something.", tone: 'calm' },
            { at: 60, line: "Brimming with stolen magic.", tone: 'calm' },
            { at: 90, line: "Overloaded. One more absorption and you rupture.", tone: 'danger' },
        ]);
    },

    Lunarch: (res) => {
        const phase = res?.phase ?? res?.currentPhase ?? 'new_moon';
        const map = {
            new_moon: { line: "New moon. The parasite is hungry.", tone: 'calm' },
            waxing_moon: { line: "Waxing. You can feel it stirring.", tone: 'calm' },
            full_moon: { line: "Full moon. Power: at a steep cost.", tone: 'warm' },
            waning_moon: { line: "Waning. The hunger recedes. For now.", tone: 'calm' },
        };
        return map[phase] ?? { line: "The cycle turns.", tone: 'calm' };
    },

    Animist: (res) => {
        const ar = res?.current ?? 0;
        return tier(ar, [
            { at: 5, line: "The ancestors sleep.", tone: 'calm' },
            { at: 12, line: "They stir. Listen.", tone: 'calm' },
            { at: 20, line: "Spirit convergence. They speak through you.", tone: 'warm' },
        ]);
    },

    Apex: (res) => {
        const qm = res?.current ?? 0;
        if (qm <= 0) return { line: "No quarry marked. Where's your companion?", tone: 'danger' };
        if (qm >= 5) return { line: "Marked for death. Strike.", tone: 'critical' };
        return tier(qm, [
            { at: 2, line: "Prey sighted. The pack closes in.", tone: 'calm' },
            { at: 4, line: "The bond is taut. One good strike left.", tone: 'warm' },
        ]);
    },

    Warden: (res) => {
        const vp = res?.current ?? 0;
        if (vp >= 10) return { line: "MAX VENGEANCE. Avatar of Vengeance ready to unleash.", tone: 'critical' };
        return tier(vp, [
            { at: 2, line: "Vengeance quiet. Patient pursuit.", tone: 'calm' },
            { at: 5, line: "Retribution building. Speed surging.", tone: 'warm' },
            { at: 8, line: "Judgment near. Ready to strike.", tone: 'danger' },
        ]);
    },

    Crusader: (res) => {
        const fervor = res?.current ?? res?.fervor ?? 0;
        if (fervor >= 100) return { line: "MAX FERVOR. Solvan Judgment ready to unleash.", tone: 'critical' };
        if (fervor >= 50) return { line: "Harmonic Stance active. Sacred power surging.", tone: 'warm' };
        return tier(fervor, [
            { at: 20, line: "Zeal kindled. Holy strikes ignite.", tone: 'calm' },
            { at: 49, line: "Radiance gathering. Momentum building.", tone: 'warm' },
        ]);
    },

    Augur: (res) => {
        const ben = res?.benediction ?? 0;
        const mal = res?.malediction ?? 0;
        if (ben >= 8 && mal >= 8) return { line: "Balanced signs. Powerful: and costly.", tone: 'warm' };
        if (mal >= 8) return { line: "The omens bode ill. For them.", tone: 'warm' };
        if (ben >= 8) return { line: "The omens smile on you.", tone: 'warm' };
        if (ben <= 1 && mal <= 1) return { line: "The signs are mute. Roll something.", tone: 'calm' };
        return { line: "The omens gather. Read them when you're ready.", tone: 'calm' };
    },

    Shaper: (res) => {
        const flux = res?.momentum?.current ?? res?.momentum ?? res?.current ?? 0;
        const toll = res?.flourish?.current ?? res?.flourish ?? 0;
        if (toll >= 10) return { line: "CONVERGENCE COLLAPSE. Flesh unravels into raw sulfur-clay!", tone: 'critical' };
        if (toll >= 7) return { line: "Feral Mutation. The predatory beast-mind drowns your human thoughts.", tone: 'danger' };
        if (toll >= 5) return { line: "Identity Erosion. Vocal cords mutated; you can no longer speak.", tone: 'danger' };
        if (toll >= 3) return { line: "Joint Lock. Calcified bone plates grind with every step (-10ft speed).", tone: 'warm' };
        if (flux >= 16) return { line: "Apex momentum. The kinetic engine surges with fluid power.", tone: 'warm' };
        if (flux <= 0) return { line: "Static inertia. 0 Base Durability: move or die.", tone: 'calm' };
        return { line: "Form flowing. Bone and sinew adapt to the dance.", tone: 'calm' };
    },

    Toxicologist: (res) => {
        const vials = res?.toxinVials ?? res?.current ?? 0;
        const parts = res?.contraptionParts ?? 0;
        if (vials === 0 && parts === 0) return { line: "Bandolier dry. Even Varis would tell you to run.", tone: 'danger' };
        if (vials >= 5 && parts >= 4) return { line: "Fully primed: lethal aerosol clouds and spring-loaded traps at hand.", tone: 'warm' };
        if (vials <= 1) return { line: "Vials running low. Distill quickly before the fog turns.", tone: 'danger' };
        if (parts === 0) return { line: "Contraptions spent. Reclaim parts or rely on direct venoms.", tone: 'calm' };
        return { line: "The slow cup brews. Stained fingers, steady pour.", tone: 'calm' };
    },

    Inquisitor: (res) => {
        const auth = res?.current ?? res?.authority ?? 0;
        if (auth >= 8) return { line: "ABSOLUTE VERDICT. The Barbed Vow demands execution.", tone: 'critical' };
        if (auth >= 6) return { line: "Chains strained taut. Caged horrors shriek in your blood.", tone: 'danger' };
        if (auth >= 4) return { line: "Cold iron smoldering. Supernatural conduits primed for severance.", tone: 'warm' };
        if (auth >= 1) return { line: "Tenuous authority. The friction of magic stirs your brands.", tone: 'calm' };
        return { line: "Chains cold. Null-salt dry. Awaiting contact.", tone: 'calm' };
    },

    Lunarch: (res) => {
        const phase = res?.currentLunarPhase ?? res?.phase ?? res?.current ?? 'new_moon';
        if (phase === 'full_moon' || phase === 2) return { line: "FULL MOON ZENITH. The celestial parasite feasts on your sanity.", tone: 'critical' };
        if (phase === 'waxing_moon' || phase === 1) return { line: "Waxing Crescent. Starlight needles quicken your blood.", tone: 'warm' };
        if (phase === 'waning_moon' || phase === 3) return { line: "Waning Twilight. The gravity siphon drains memory and vitality.", tone: 'danger' };
        return { line: "New Moon dark. The parasite slumbers in the stygian chill.", tone: 'calm' };
    },
};

const TONE_STYLES = {
    calm: { color: '#9a9a9a', fontStyle: 'italic' },
    warm: { color: '#d4af37', fontStyle: 'italic' },
    danger: { color: '#FF6347', fontStyle: 'italic', fontWeight: 'bold' },
    critical: { color: '#FF4500', fontStyle: 'italic', fontWeight: 'bold' },
};

export const getResourceStatusFlavor = (className, classResource) => {
    const config = getClassResourceConfig(className);
    if (!config) return null;
    const fn = FLAVOR[className];
    if (typeof fn !== 'function') return null;
    try {
        const result = fn(classResource || {});
        if (!result) return null;
        return {
            text: result.line,
            tone: result.tone || 'calm',
            style: TONE_STYLES[result.tone] || TONE_STYLES.calm,
        };
    } catch {
        return null;
    }
};

export const getResourceStatusToneStyle = (tone) => TONE_STYLES[tone] || TONE_STYLES.calm;
