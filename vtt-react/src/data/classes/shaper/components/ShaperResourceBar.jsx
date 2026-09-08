import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../styles/ShaperResourceBar.css';

/**
 * SHAPER CLASS RESOURCE BAR: "The Biomantic Morphic Osteo-Blade"
 *
 * A living predatory bio-sword forged from calcified bone, striated kinetic muscle
 * sinew, and volatile cellular marrow:
 *
 * - Left Wing (Grip & Pommel, x: 8..124):
 *   Alchemical bio-pommel with impulse core nodule (+2 Flux), monospace {flux}
 *   numeral, and 20 striated kinetic tendon wraps along the living sword grip.
 *
 * - Centerpiece (Crossguard & Chrysalis, x: 124..172):
 *   Sweeping curved bone quillons (zero round circles!) bracketing an angular
 *   morphic diamond chrysalis displaying the active Stance vector glyph.
 *   Clicking toggles the portalled Six-Form Stance Matrix.
 *
 * - Right Wing (Articulated Osteo-Blade, x: 172..288):
 *   Heavy Greatsword / Chitin Cleaver blade with living ruby marrow fuller canal,
 *   10 chunky articulated vertebral blade cutters (teeth) that erupt vicious
 *   barbed bone spurs at Toll 7+, monospace {toll} numeral, and blade-tip purge siphon.
 *
 * - Tactile Hover Tooltip (ClassTip):
 *   No native browser title attributes. Polite 400ms hover delay with immediate
 *   suppression on ANY click or adjustment so tooltips never interfere with play.
 *
 * - Unified Context Menu:
 *   Uses the standard parchment theme (warm beige, brown borders, Garamond/Bookman serif)
 *   matching all other VTT menus. Zero emojis, zero AP.
 */

// Six Canonical Shaper Stances with costs, roles, and tactical benefits (NO AP, NO EMOJIS)
export const SHAPER_STANCES = [
    {
        name: 'Ataxic Flow',
        role: 'Default / Mobility',
        cost: 0,
        color: '#10b981',
        glow: '#34d399',
        benefit: '+10ft movement speed, Dash without movement penalty, immunity to slow',
        desc: 'Unanchored fluidity; bone density softens to absorb kinetic recoil.'
    },
    {
        name: 'Arterial Strike',
        role: 'Offense / Bleed',
        cost: 2,
        color: '#ef4444',
        glow: '#f87171',
        benefit: 'Attacks inflict Arterial Gash (1d8 bleed/turn for 3 turns)',
        desc: 'Serrated calcified talons erupt from fingertips to shred vital arteries.'
    },
    {
        name: 'Centrifugal Fury',
        role: 'Cleave / Multi-Hit',
        cost: 4,
        color: '#f59e0b',
        glow: '#fbbf24',
        benefit: 'Attacks strike in a 10ft arc; +1 additional attack per round',
        desc: 'Ligaments loosen into whip-like sinew bands for lethal rotational momentum.'
    },
    {
        name: 'Deadened Bastion',
        role: 'Defense / Carapace',
        cost: 3,
        color: '#64748b',
        glow: '#94a3b8',
        benefit: 'Physical damage reduction 4, immunity to forced displacement',
        desc: 'Dense keratinous chitin calcifies over vital organs and joints.'
    },
    {
        name: 'Fluid Apex',
        role: 'Evasion / Counter',
        cost: 5,
        color: '#a855f7',
        glow: '#c084fc',
        benefit: 'Gain 25% displacement dodge; successful dodges generate +2 Flux',
        desc: 'Sub-cellular phase shifts dodge through incoming kinetic shockwaves.'
    },
    {
        name: 'Silence Predator',
        role: 'Stealth / Burst',
        cost: 3,
        color: '#3b82f6',
        glow: '#60a5fa',
        benefit: 'Invisibility in dim light, +3d6 Ambush burst',
        desc: 'Pigment-absorbing skin cells and sound-dampening fibrous pads on limbs.'
    }
];

// Body Toll Mutation Milestones (0–10)
export const BODY_TOLL_TIERS = [
    { min: 0, max: 2, name: 'Supple Clay', color: '#10b981', glow: '#34d399', desc: 'Cellular cohesion stable. No biological penalty.' },
    { min: 3, max: 4, name: 'Joint Lock', color: '#f59e0b', glow: '#fbbf24', desc: 'Stiffened ligaments impose -5ft speed and minor kinetic drag.' },
    { min: 5, max: 6, name: 'Identity Erosion', color: '#ec4899', glow: '#f472b6', desc: 'Cellular drift. Disadvantage on mental saves and social checks.' },
    { min: 7, max: 9, name: 'Feral Mutation', color: '#ef4444', glow: '#f87171', desc: 'Violent bone spurs erupt. Vulnerability to psychic damage, +2 melee damage.' },
    { min: 10, max: 10, name: 'Convergence Collapse', color: '#dc2626', glow: '#f43f5e', desc: 'CRITICAL OVERLOAD: Flesh liquefaction threat! Severe damage each turn until purged.' }
];

export const getBodyTollTier = (toll) => {
    return BODY_TOLL_TIERS.find(t => toll >= t.min && toll <= t.max) || BODY_TOLL_TIERS[0];
};

const ShaperResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null,
    showcase = false
}) => {
    // Normalization for Dual Resources: Kinetic Flux (0-20) + Body Toll (0-10)
    const propFlux = classResource?.flux ?? classResource?.momentum?.current ?? classResource?.momentum ?? classResource?.current ?? 0;
    const propToll = classResource?.toll ?? classResource?.bodyToll ?? classResource?.flourish?.current ?? classResource?.flourish ?? 0;
    const propStance = classResource?.stance?.current ?? classResource?.stance ?? (typeof classResource?.currentStance === 'string' ? classResource.currentStance : 'Ataxic Flow');

    const [localFlux, setLocalFlux] = useState(propFlux);
    const [localToll, setLocalToll] = useState(propToll);
    const [localStance, setLocalStance] = useState(propStance || 'Ataxic Flow');

    const [showTooltip, setShowTooltip] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const tooltipTimerRef = useRef(null);
    const suppressTooltipUntilRef = useRef(0);

    const barRef = useRef(null);
    const matrixMenuRef = useRef(null);
    const crucibleRef = useRef(null);

    const maxFlux = 20;
    const maxToll = 10;

    const currentTollTier = getBodyTollTier(localToll);
    const isConvergenceCollapse = localToll >= 10;
    const isFeral = localToll >= 7;

    const activeStanceData = SHAPER_STANCES.find(s => s.name === localStance) || SHAPER_STANCES[0];

    const tooltipRef = useResourceBarTooltip(barRef, showTooltip && !showMatrix, [localFlux, localToll, localStance, currentTollTier.name]);

    const handleMouseEnter = () => {
        if (showMatrix || Date.now() < suppressTooltipUntilRef.current) return;
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => {
            if (!showMatrix && Date.now() >= suppressTooltipUntilRef.current) {
                setShowTooltip(true);
            }
        }, 400);
    };

    const handleMouseLeave = () => {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setShowTooltip(false);
    };

    const dismissTooltip = () => {
        suppressTooltipUntilRef.current = Date.now() + 850;
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setShowTooltip(false);
    };

    useEffect(() => {
        if (propFlux != null) setLocalFlux(propFlux);
    }, [propFlux]);

    useEffect(() => {
        if (propToll != null) setLocalToll(propToll);
    }, [propToll]);

    useEffect(() => {
        if (propStance) setLocalStance(propStance);
    }, [propStance]);

    // Close Matrix popover when clicking outside
    useEffect(() => {
        if (!showMatrix) return;
        const handleClickOutside = (e) => {
            if (matrixMenuRef.current && matrixMenuRef.current.contains(e.target)) return;
            if (barRef.current && barRef.current.contains(e.target)) return;
            setShowMatrix(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMatrix]);

    // Unique SVG ID namespace to avoid collisions in multi-portrait or party HUDs
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        fluxGlow: `shFluxGlow${uid}`,
        tollGlow: `shTollGlow${uid}`,
        collapseGlow: `shCollGlow${uid}`,
        marrowGlow: `shMarrowGlow${uid}`,
        scabbardGrad: `shScabbard${uid}`,
        hiltGrad: `shHilt${uid}`,
        boneGrad: `shBone${uid}`,
        marrowGrad: `shMarrow${uid}`,
        shadowGrad: `shShadow${uid}`
    };

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const logClassResourceChange = (resourceType, amount, isPositive, subKey) => {
        if (!addCombatNotification) return;
        const actorName = currentPlayerName;
        const characterName = currentPlayerName;
        const sign = isPositive ? '+' : '-';
        const absAmount = Math.abs(amount);
        const message = `${actorName} ${isPositive ? 'gained' : 'spent'} ${absAmount} ${resourceType} (${sign}${absAmount} ${resourceType})`;

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: resourceType,
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleFluxChange = (delta) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxFlux, localFlux + delta));
        const diff = Math.abs(newValue - localFlux);
        if (diff > 0) {
            setLocalFlux(newValue);
            logClassResourceChange('Kinetic Flux', diff, delta > 0, 'flux');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('flux', newValue);
                onClassResourceUpdate('current', newValue);
                onClassResourceUpdate('momentum', newValue);
            }
        }
    };

    const handleFluxSet = (value) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxFlux, value));
        const diff = Math.abs(newValue - localFlux);
        if (diff > 0) {
            setLocalFlux(newValue);
            logClassResourceChange('Kinetic Flux', diff, newValue > localFlux, 'flux');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('flux', newValue);
                onClassResourceUpdate('current', newValue);
                onClassResourceUpdate('momentum', newValue);
            }
        }
    };

    const handleTollChange = (delta) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxToll, localToll + delta));
        const diff = Math.abs(newValue - localToll);
        if (diff > 0) {
            setLocalToll(newValue);
            logClassResourceChange('Body Toll', diff, delta > 0, 'toll');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('toll', newValue);
                onClassResourceUpdate('flourish', newValue);
                onClassResourceUpdate('bodyToll', newValue);
            }
        }
    };

    const handleTollSet = (value) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxToll, value));
        const diff = Math.abs(newValue - localToll);
        if (diff > 0) {
            setLocalToll(newValue);
            logClassResourceChange('Body Toll', diff, newValue > localToll, 'toll');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('toll', newValue);
                onClassResourceUpdate('flourish', newValue);
                onClassResourceUpdate('bodyToll', newValue);
            }
        }
    };

    const handleStanceChange = (targetStance) => {
        if (!isOwner || targetStance.name === localStance) return;
        const cost = targetStance.cost;
        if (localFlux < cost && !isGMMode) return;

        const newFlux = Math.max(0, localFlux - cost);
        setLocalFlux(newFlux);
        setLocalStance(targetStance.name);
        setShowMatrix(false);

        logClassResourceChange('Stance Shift', cost, false, 'flux');
        if (onClassResourceUpdate) {
            onClassResourceUpdate('flux', newFlux);
            onClassResourceUpdate('current', newFlux);
            onClassResourceUpdate('momentum', newFlux);
            onClassResourceUpdate('stance', targetStance.name);
        }
    };

    // Keyboard controls
    const handleKeyDown = (e) => {
        if (!isOwner) return;
        dismissTooltip();
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            handleFluxChange(e.shiftKey ? 5 : 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleFluxChange(e.shiftKey ? -5 : -1);
        } else if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            handleTollChange(e.shiftKey ? -1 : 1);
        } else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            setShowMatrix(prev => !prev);
        }
    };

    const statusFlavor = getResourceStatusFlavor('Shaper', localToll, {
        stance: localStance,
        flux: localFlux
    });

    // Vector art renderer for the 6 Stance emblems inside the rotating crucible
    const renderCrucibleEmblem = () => {
        switch (localStance) {
            case 'Arterial Strike':
                // Crossed sharp bone talons / puncture reticle
                return (
                    <g className="stance-emblem arterial">
                        <line x1="140" y1="22" x2="156" y2="38" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
                        <line x1="156" y1="22" x2="140" y2="38" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="148" cy="30" r="3.5" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
                        <path d="M 148 19 L 148 23 M 148 37 L 148 41 M 137 30 L 141 30 M 155 30 L 159 30" stroke="#f87171" strokeWidth="1.4" />
                    </g>
                );
            case 'Centrifugal Fury':
                // Twin curved spinning cleaver blades / centrifugal vortex
                return (
                    <g className="stance-emblem centrifugal">
                        <path d="M 148 20 C 158 20, 160 30, 154 36 C 152 32, 152 26, 148 20 Z" fill="#f59e0b" />
                        <path d="M 148 40 C 138 40, 136 30, 142 24 C 144 28, 144 34, 148 40 Z" fill="#f59e0b" />
                        <circle cx="148" cy="30" r="2.8" fill="#fef3c7" />
                        <circle cx="148" cy="30" r="9" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                    </g>
                );
            case 'Deadened Bastion':
                // Overlapping chitinous shell plates / fortified carapace aegis
                return (
                    <g className="stance-emblem bastion">
                        <path d="M 141 23 L 155 23 L 157 32 L 148 39 L 139 32 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.4" />
                        <path d="M 144 26 L 152 26 L 154 32 L 148 36 L 142 32 Z" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="148" y1="23" x2="148" y2="36" stroke="#94a3b8" strokeWidth="1.2" />
                    </g>
                );
            case 'Fluid Apex':
                // Intertwined double-helix / balanced chimeric serpent spiral
                return (
                    <g className="stance-emblem apex">
                        <circle cx="148" cy="30" r="8.5" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                        <path d="M 148 21.5 C 153 21.5, 153 30, 148 30 C 143 30, 143 38.5, 148 38.5" fill="none" stroke="#c084fc" strokeWidth="1.6" />
                        <circle cx="148" cy="25.5" r="1.8" fill="#f3e8ff" />
                        <circle cx="148" cy="34.5" r="1.8" fill="#a855f7" />
                    </g>
                );
            case 'Silence Predator':
                // Retractable shadow mantis talons / predator visor slits
                return (
                    <g className="stance-emblem predator">
                        <path d="M 140 24 Q 148 21 156 24 L 153 27 Q 148 25 143 27 Z" fill="#38bdf8" />
                        <path d="M 141 30 Q 148 28 155 30 L 153 33 Q 148 31 143 33 Z" fill="#60a5fa" />
                        <path d="M 143 36 L 148 40 L 153 36" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                );
            case 'Ataxic Flow':
            default:
                // Fluid biomantic wave / sinew flow node
                return (
                    <g className="stance-emblem ataxic">
                        <circle cx="148" cy="30" r="8.5" fill="none" stroke="#10b981" strokeWidth="1.4" />
                        <path d="M 141 30 Q 145 23 148 30 T 155 30" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="148" cy="30" r="2.5" fill="#a7f3d0" />
                    </g>
                );
        }
    };

    return (
        <div
            ref={barRef}
            className={`class-resource-bar shaper-resource-bar ${size} ${currentTollTier.name.toLowerCase().replace(/\s+/g, '-')} ${isConvergenceCollapse ? 'convergence-collapse' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={dismissTooltip}
            onKeyDown={handleKeyDown}
            tabIndex={isOwner ? 0 : -1}
            role="slider"
            aria-label={`Shaper Morphic Armature: ${localFlux}/20 Flux, ${localToll}/10 Toll, Stance: ${localStance}`}
            aria-valuenow={localFlux}
            aria-valuemin={0}
            aria-valuemax={maxFlux}
        >
            <div className="shaper-bar-wrapper">
                <svg
                    className="shaper-apparatus-svg"
                    viewBox="0 0 296 60"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Shaper Vector Filters & Glows */}
                        <filter id={ids.fluxGlow} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id={ids.tollGlow} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id={ids.marrowGlow} x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="2.2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id={ids.collapseGlow} x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="2.4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id={ids.shadowGrad} x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                        </filter>

                        {/* Heavy Scabbard / Weapon Spine Cradle */}
                        <linearGradient id={ids.scabbardGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1e140d" />
                            <stop offset="35%" stopColor="#120c08" />
                            <stop offset="70%" stopColor="#0a0705" />
                            <stop offset="100%" stopColor="#040302" />
                        </linearGradient>

                        {/* Living Hilt Leather & Chitin Gradient */}
                        <linearGradient id={ids.hiltGrad} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2c1a10" />
                            <stop offset="50%" stopColor="#1a0f0a" />
                            <stop offset="100%" stopColor="#0d0805" />
                        </linearGradient>

                        {/* Articulated Osteo-Blade Ivory Bone Gradient */}
                        <linearGradient id={ids.boneGrad} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="50%" stopColor="#e2e8f0" />
                            <stop offset="85%" stopColor="#cbd5e1" />
                            <stop offset="100%" stopColor="#94a3b8" />
                        </linearGradient>

                        {/* Living Ruby Marrow Canal Gradient */}
                        <linearGradient id={ids.marrowGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#991b1b" />
                            <stop offset="40%" stopColor="#ef4444" />
                            <stop offset="80%" stopColor="#f87171" />
                            <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>

                        {/* Kinetic Flux Sinew Glow */}
                        <linearGradient id="shFluxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0284c7" />
                            <stop offset="50%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                    </defs>

                    {/* ========================================================================= */}
                    {/* 1. SCULPTED WEAPON CRADLE BACKING (Grounded, full-presence chassis)        */}
                    {/* ========================================================================= */}
                    <g filter={`url(#${ids.shadowGrad})`}>
                        <path
                            d="M 6 18 L 122 18 L 138 12 L 148 10 L 158 12 L 174 18 L 278 22 L 290 30 L 278 38 L 174 42 L 158 48 L 148 50 L 138 48 L 122 42 L 6 42 L 3 30 Z"
                            fill={`url(#${ids.scabbardGrad})`}
                            stroke={isConvergenceCollapse ? '#ef4444' : '#78350f'}
                            strokeWidth={isConvergenceCollapse ? '1.8' : '1.2'}
                        />
                        {/* Subtle organic blade spine seams */}
                        <line x1="14" y1="30" x2="120" y2="30" stroke="#382115" strokeWidth="0.8" />
                        <line x1="174" y1="30" x2="274" y2="30" stroke="#382115" strokeWidth="0.8" />
                    </g>

                    {/* ========================================================================= */}
                    {/* 2. LEFT WING: SINEW-WRAPPED SWORD HILT & GRIP (x: 8..124)                 */}
                    {/* ========================================================================= */}
                    <g className="shaper-flux-wing">
                        {/* Sculpted Heavy Bio-Pommel Counterweight */}
                        <path
                            d="M 8 30 L 14 18 L 42 18 L 46 22 L 46 38 L 42 42 L 14 42 Z"
                            fill={`url(#${ids.hiltGrad})`}
                            stroke="#854d0e"
                            strokeWidth="1.2"
                        />

                        {/* Impulse Core Trigger Nodule (Pommel Core, x: 20, y: 30) */}
                        <g
                            className="shaper-impulse-node"
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissTooltip();
                                if (!isOwner) return;
                                handleFluxChange(e.shiftKey ? 5 : 2);
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            <circle cx="20" cy="30" r="7" fill="#0b1320" stroke="#0284c7" strokeWidth="1.3" />
                            <circle
                                cx="20"
                                cy="30"
                                r="3.5"
                                fill={localFlux > 0 ? '#38bdf8' : '#0369a1'}
                                filter={localFlux > 0 ? `url(#${ids.fluxGlow})` : undefined}
                            />
                        </g>

                        {/* Monospace Cyan Flux Numeral Readout (Set cleanly in pommel plaque) */}
                        <text
                            className="shaper-flux-numeral"
                            x="34"
                            y="34.5"
                            textAnchor="middle"
                            fill="#38bdf8"
                            fontSize="12.5"
                            fontWeight="900"
                            fontFamily="monospace"
                            filter={`url(#${ids.fluxGlow})`}
                            style={{ pointerEvents: 'none' }}
                        >
                            {localFlux}
                        </text>

                        {/* Sword Grip Bed (Recessed track under wraps) */}
                        <rect x="46" y="20" width="76" height="20" rx="3" fill="#0a060d" stroke="#1e1428" strokeWidth="0.8" />

                        {/* 20 Kinetic Tendon Wraps along the Sword Grip (x: 47 to 121) */}
                        {Array.from({ length: maxFlux }, (_, i) => {
                            const val = i + 1;
                            const isFilled = val <= localFlux;
                            const isCurrent = val === localFlux;
                            const px = 47.5 + (i * 3.65);
                            const pw = 2.7;

                            return (
                                <g
                                    key={`flux-tendon-${val}`}
                                    className={`shaper-flux-fiber ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismissTooltip();
                                        if (!isOwner) return;
                                        handleFluxSet(localFlux === val ? val - 1 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    <rect
                                        x={px}
                                        y="21"
                                        width={pw}
                                        height="18"
                                        rx="1.3"
                                        fill={isFilled ? 'url(#shFluxGrad)' : '#161022'}
                                        stroke={isFilled ? (isCurrent ? '#ffffff' : '#38bdf8') : '#261b38'}
                                        strokeWidth={isCurrent ? '1.3' : '0.6'}
                                        filter={isFilled ? `url(#${ids.fluxGlow})` : undefined}
                                    />
                                    {/* Living kinetic spark line inside filled tendons */}
                                    {isFilled && (
                                        <line
                                            x1={px + pw / 2}
                                            y1="25"
                                            x2={px + pw / 2}
                                            y2="35"
                                            stroke="#e0f2fe"
                                            strokeWidth="0.7"
                                            strokeLinecap="round"
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* ========================================================================= */}
                    {/* 3. CENTERPIECE: CURVED BONE QUILLOINS & CHRYSALIS (NO CIRCLE! x: 124..172) */}
                    {/* ========================================================================= */}
                    <g
                        ref={crucibleRef}
                        className={`shaper-crucible-module ${showMatrix ? 'active' : ''} ${isConvergenceCollapse ? 'collapse-active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            dismissTooltip();
                            setShowMatrix(prev => !prev);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Upper Sweeping Bone Quillon (curving forward over blade) */}
                        <path
                            d="M 124 23 C 132 14, 142 5, 154 5 C 163 5, 169 9, 171 14 C 164 12, 150 14, 141 23 Z"
                            fill={`url(#${ids.boneGrad})`}
                            stroke="#78350f"
                            strokeWidth="1.1"
                        />

                        {/* Lower Sweeping Bone Quillon (curving forward under blade) */}
                        <path
                            d="M 124 37 C 132 46, 142 55, 154 55 C 163 55, 169 51, 171 46 C 164 48, 150 46, 141 37 Z"
                            fill={`url(#${ids.boneGrad})`}
                            stroke="#78350f"
                            strokeWidth="1.1"
                        />

                        {/* Outer Faceted Diamond Chrysalis Cartouche */}
                        <path
                            d="M 148 12 L 165 30 L 148 48 L 131 30 Z"
                            fill="#0e0a07"
                            stroke={isConvergenceCollapse ? '#ef4444' : activeStanceData.color}
                            strokeWidth="1.8"
                            filter={isConvergenceCollapse ? `url(#${ids.collapseGlow})` : undefined}
                        />

                        {/* Inner Faceted Diamond Inset */}
                        <path
                            d="M 148 16 L 160 30 L 148 44 L 136 30 Z"
                            fill="#16100c"
                            stroke={activeStanceData.glow}
                            strokeWidth="0.9"
                        />

                        {/* Active Stance Vector Glyph inside the Chrysalis */}
                        {renderCrucibleEmblem()}

                        {/* Convergence Collapse Warning Pulse Fissures */}
                        {isConvergenceCollapse && (
                            <g className="collapse-sparks">
                                <line x1="148" y1="12" x2="148" y2="48" stroke="#ffffff" strokeWidth="1.4" strokeDasharray="3,2" />
                                <line x1="131" y1="30" x2="165" y2="30" stroke="#fca5a5" strokeWidth="1.2" strokeDasharray="3,2" />
                            </g>
                        )}
                    </g>

                    {/* ========================================================================= */}
                    {/* 4. RIGHT WING: ARTICULATED LIVING OSTEO-BLADE (x: 172..288)               */}
                    {/* ========================================================================= */}
                    <g className="shaper-toll-wing">
                        {/* Living Ruby Marrow Fuller Spine running down blade center */}
                        <line
                            x1="172"
                            y1="30"
                            x2="252"
                            y2="30"
                            stroke={`url(#${ids.marrowGrad})`}
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            filter={`url(#${ids.marrowGlow})`}
                        />

                        {/* 10 Articulated Vertebral Blade Cutters / Teeth (x: 174..249) */}
                        {Array.from({ length: maxToll }, (_, i) => {
                            const val = i + 1;
                            const isFilled = val <= localToll;
                            const isCurrent = val === localToll;
                            const px = 174.5 + (i * 7.4);
                            const pw = 6.2;
                            const topY = 18;
                            const segH = 24;

                            // Cohesive biological mutation tones
                            let plateFill = `url(#${ids.boneGrad})`;
                            let plateStroke = '#cbd5e1';
                            if (val >= 10) {
                                plateFill = '#dc2626';
                                plateStroke = '#ffffff';
                            } else if (val >= 7) {
                                plateFill = '#991b1b';
                                plateStroke = '#f87171';
                            } else if (val >= 5) {
                                plateFill = '#831843';
                                plateStroke = '#f472b6';
                            } else if (val >= 3) {
                                plateFill = '#78350f';
                                plateStroke = '#fbbf24';
                            }

                            return (
                                <g
                                    key={`toll-plate-${val}`}
                                    className={`shaper-toll-plate ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismissTooltip();
                                        if (!isOwner) return;
                                        handleTollSet(localToll === val ? val - 1 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Feral Barbed Bone Spurs physically erupting outward at Toll 7+ */}
                                    {isFilled && val >= 7 && (
                                        <g className="shaper-feral-spur">
                                            {/* Upper dorsal bone spur */}
                                            <polygon
                                                points={`${px + 1},${topY} ${px + pw / 2},${topY - 10} ${px + pw - 1},${topY}`}
                                                fill="#fecaca"
                                                stroke="#ef4444"
                                                strokeWidth="0.8"
                                            />
                                            {/* Lower ventral bone spur */}
                                            <polygon
                                                points={`${px + 1},${topY + segH} ${px + pw / 2},${topY + segH + 10} ${px + pw - 1},${topY + segH}`}
                                                fill="#fecaca"
                                                stroke="#ef4444"
                                                strokeWidth="0.8"
                                            />
                                        </g>
                                    )}

                                    {/* Segmented Vertebral Cutter Tooth */}
                                    <path
                                        d={`M ${px} ${topY} L ${px + pw} ${topY + 1.5} L ${px + pw} ${topY + segH - 1.5} L ${px} ${topY + segH} Z`}
                                        fill={isFilled ? plateFill : '#160e10'}
                                        stroke={isFilled ? (isCurrent ? '#ffffff' : plateStroke) : '#2a181c'}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                        filter={isFilled ? `url(#${ids.tollGlow})` : undefined}
                                    />

                                    {/* Stress fracture fissure for Tier 3+ (Amber) */}
                                    {isFilled && val >= 3 && (
                                        <line
                                            x1={px + 1.2}
                                            y1={topY + 4}
                                            x2={px + pw - 1.2}
                                            y2={topY + 9}
                                            stroke="#fef08a"
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                        />
                                    )}

                                    {/* Cellular mutation vein for Tier 5+ (Magenta) */}
                                    {isFilled && val >= 5 && (
                                        <line
                                            x1={px + pw - 1.2}
                                            y1={topY + 13}
                                            x2={px + 1.2}
                                            y2={topY + 18}
                                            stroke="#f472b6"
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Chisel Point Razor Blade Tip Housing */}
                        <path
                            d="M 252 19 L 286 30 L 252 41 Z"
                            fill={`url(#${ids.hiltGrad})`}
                            stroke="#854d0e"
                            strokeWidth="1.2"
                        />

                        {/* Bold Monospace Ruby Toll Numeral */}
                        <text
                            className="shaper-toll-numeral"
                            x="261"
                            y="34.5"
                            textAnchor="middle"
                            fill="#f87171"
                            fontSize="12.5"
                            fontWeight="900"
                            fontFamily="monospace"
                            filter={`url(#${ids.tollGlow})`}
                            style={{ pointerEvents: 'none' }}
                        >
                            {localToll}
                        </text>

                        {/* Purge Siphon Valve at Blade Point Apex (x: 278, y: 30) */}
                        <g
                            className="shaper-purge-node"
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissTooltip();
                                if (!isOwner) return;
                                handleTollChange(e.shiftKey ? -3 : -1);
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            <circle cx="278" cy="30" r="6.5" fill="#14221a" stroke="#10b981" strokeWidth="1.2" />
                            <circle
                                cx="278"
                                cy="30"
                                r="3"
                                fill={localToll > 0 ? '#34d399' : '#059669'}
                                filter={localToll > 0 ? `url(#${ids.fluxGlow})` : undefined}
                            />
                        </g>
                    </g>
                </svg>
            </div>

            {/* ========================================================================= */}
            {/* 5. PORTALLED SIX-FORM STANCE MATRIX (Portalled to document.body)           */}
            {/* ========================================================================= */}
            {showMatrix && ReactDOM.createPortal(
                <div
                    className="unified-context-menu shaper-matrix-popover"
                    ref={matrixMenuRef}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'fixed',
                        top: (() => {
                            if (!crucibleRef.current) return '50%';
                            const rect = crucibleRef.current.getBoundingClientRect();
                            const hudContainer = barRef.current?.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                            let hudBottom = rect.bottom;
                            let hudTop = rect.top;
                            if (hudContainer) {
                                const hudRect = hudContainer.getBoundingClientRect();
                                hudBottom = hudRect.bottom;
                                hudTop = hudRect.top;
                            }
                            if (hudBottom + 410 > window.innerHeight) {
                                return Math.max(10, hudTop - 410);
                            }
                            return hudBottom + 8;
                        })(),
                        left: (() => {
                            if (!crucibleRef.current) return '50%';
                            const rect = crucibleRef.current.getBoundingClientRect();
                            return Math.max(175, Math.min(window.innerWidth - 175, rect.left + (rect.width / 2)));
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        {/* Header */}
                        <div className="context-menu-section-header shaper-matrix-header">
                            <span className="shaper-matrix-title">
                                <i className="fas fa-dna" style={{ marginRight: '6px', color: '#8b4513' }}></i>
                                Six-Form Stance Matrix
                            </span>
                            <button
                                className="shaper-matrix-close-btn"
                                onClick={() => setShowMatrix(false)}
                                title="Close"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Status Flavor Banner */}
                        {statusFlavor && (
                            <div className="menu-status-flavor" style={statusFlavor.style}>
                                {statusFlavor.text}
                            </div>
                        )}

                        {/* Section 1: Active Stance & Shift Grid */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Form Transmutation</span>
                                <span style={{ color: '#5e2e23', fontWeight: 'bold' }}>
                                    {localFlux}/20 Flux • {localToll}/10 Toll
                                </span>
                            </div>

                            <div className="shaper-stance-grid">
                                {SHAPER_STANCES.map((st) => {
                                    const isActive = st.name === localStance;
                                    const canAfford = localFlux >= st.cost || isGMMode;

                                    return (
                                        <button
                                            key={st.name}
                                            type="button"
                                            className={`context-menu-button shaper-stance-card ${isActive ? 'active' : ''}`}
                                            onClick={() => canAfford && handleStanceChange(st)}
                                            disabled={!canAfford}
                                        >
                                            <div className="shaper-stance-card-header">
                                                <span className="shaper-stance-card-name">
                                                    {st.name}
                                                </span>
                                                <span className="shaper-stance-cost-badge">
                                                    {st.cost === 0 ? 'Free' : `${st.cost} Flux`}
                                                </span>
                                            </div>
                                            <div className="shaper-stance-role-text">{st.role}</div>
                                            <div className="shaper-stance-benefit-text">{st.benefit}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section 2: Metabolic Calibration Actions */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-title">Metabolic Calibration</div>
                            <div className="shaper-actions-grid">
                                <button
                                    type="button"
                                    className="context-menu-button"
                                    onClick={() => handleFluxChange(2)}
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>+2 Flux</span>
                                </button>
                                <button
                                    type="button"
                                    className="context-menu-button"
                                    onClick={() => handleTollChange(1)}
                                >
                                    <i className="fas fa-bolt"></i>
                                    <span>+1 Toll</span>
                                </button>
                                <button
                                    type="button"
                                    className="context-menu-button"
                                    onClick={() => handleTollChange(-2)}
                                >
                                    <i className="fas fa-minus"></i>
                                    <span>-2 Toll</span>
                                </button>
                                <button
                                    type="button"
                                    className="context-menu-button danger"
                                    onClick={() => {
                                        handleTollSet(0);
                                        handleFluxSet(0);
                                    }}
                                >
                                    <i className="fas fa-undo"></i>
                                    <span>Rest (0/0)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ========================================================================= */}
            {/* 6. TACTILE HOVER TOOLTIP VIA CLASSTIP (Portalled to document.body)          */}
            {/* ========================================================================= */}
            {showTooltip && !showMatrix && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip shaper-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    <ClassTip
                        icon="fas fa-dna"
                        tint={activeStanceData.color}
                        title="The Morphic Osteo-Blade"
                        subtitle="Shaper Morphic Osteo-Blade"
                        state={`${localFlux}/20 Flux • ${localToll}/10 Toll`}
                        stateTone={isConvergenceCollapse ? 'bad' : isFeral ? 'warn' : 'good'}
                        mechanic="Kinetic Flux powers instant biomantic shapeshifting. Body Toll measures cellular mutation and flesh strain."
                        status={[
                            `Active Stance: ${localStance} — ${activeStanceData.benefit}`,
                            `Mutation Tier: ${currentTollTier.name} (${localToll}/10) — ${currentTollTier.desc}`,
                            isConvergenceCollapse ? 'CRITICAL: Flesh integrity failure! Purge Body Toll immediately.' : null
                        ].filter(Boolean)}
                        usage="Click hilt wraps for Flux (+2 on pommel). Click blade segments for Toll (-1 on tip). Click crossguard chrysalis for Six-Form Matrix."
                        hint="Arrow keys step Flux. Press 'T' for Toll, 'S' or click Chrysalis for Stances."
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default React.memo(ShaperResourceBar);
