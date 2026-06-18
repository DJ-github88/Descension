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
            { at: 2, line: "A flicker of heat. The demon is stirring.", tone: 'calm' },
            { at: 4, line: "Embers crawl beneath your skin. It almost feels good.", tone: 'warm' },
            { at: 6, line: "Half-damned. The furnace door stands open.", tone: 'warm' },
            { at: 8, line: "You are mostly fire now. What's left of you is screaming.", tone: 'danger' },
            { at: 9, line: "NINTH CIRCLE. There is no further down — only ash.", tone: 'critical' },
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
            { at: 4, line: "The matrix hums — combinations are live.", tone: 'warm' },
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
        if (fp <= 1) return { line: "Broke. The house always wins — until it doesn't.", tone: 'danger' };
        return { line: "A few chips left. Play them slow.", tone: 'calm' };
    },

    Revenant: (res) => {
        const tokens = res?.bloodTokens ?? 0;
        if (tokens >= 16) return { line: "CRITICAL MASS. One death and you take the block with you.", tone: 'critical' };
        if (tokens >= 11) return { line: "Volatile. Healing won't take — you're a walking bomb.", tone: 'danger' };
        if (tokens >= 6) return { line: "The tokens itch. They want out.", tone: 'warm' };
        const paths = (res?.stacks ?? []).filter(Boolean).length;
        if (tokens === 0 && paths === 0) return { line: "Dry veins. No bargains struck. Yet.", tone: 'calm' };
        return { line: "Stable. The blood runs quiet, for now.", tone: 'calm' };
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
            { at: 14, line: "The void is wearing your face.", tone: 'warm' },
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
            full_moon: { line: "Full moon. Power — at a steep cost.", tone: 'warm' },
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
        const tension = res?.current ?? 0;
        if (tension >= 10) return { line: "MAX TENSION. Release or break.", tone: 'critical' };
        return tier(tension, [
            { at: 2, line: "Chains slack. Patient.", tone: 'calm' },
            { at: 5, line: "The iron groans. Keep winding.", tone: 'calm' },
            { at: 8, line: "Tether taut. Something's about to snap.", tone: 'danger' },
        ]);
    },

    Augur: (res) => {
        const ben = res?.benediction ?? 0;
        const mal = res?.malediction ?? 0;
        if (ben >= 8 && mal >= 8) return { line: "Balanced signs. Powerful — and costly.", tone: 'warm' };
        if (mal >= 8) return { line: "The omens bode ill. For them.", tone: 'warm' };
        if (ben >= 8) return { line: "The omens smile on you.", tone: 'warm' };
        if (ben <= 1 && mal <= 1) return { line: "The signs are mute. Roll something.", tone: 'calm' };
        return { line: "The omens gather. Read them when you're ready.", tone: 'calm' };
    },

    Shaper: (res) => {
        const flux = res?.momentum?.current ?? res?.momentum ?? res?.current ?? 0;
        const toll = res?.flourish?.current ?? res?.flourish ?? 0;
        if (toll >= 8) return { line: "Your body remembers every transformation. It's failing.", tone: 'danger' };
        if (flux <= 0) return { line: "Stillness. The form has not yet chosen you.", tone: 'calm' };
        if (flux >= 16) return { line: "The dance is live. Keep moving or lose the rhythm.", tone: 'warm' };
        return { line: "Form flowing. Momentum building.", tone: 'calm' };
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
