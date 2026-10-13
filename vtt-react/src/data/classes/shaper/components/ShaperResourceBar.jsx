import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useCharacterStore from '../../../../store/characterStore';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../styles/ShaperResourceBar.css';
import { INK, PAPER, PANEL, RULE, inked, washed } from '../../../../components/hud/calmBarPalette';
import { SHAPER_FLUX_MAX, SHAPER_TOLL_MAX, SHAPER_FORMS, normalizeShaperResource, getShaperFormAdoptionPlan,
    BODY_TOLL_TIERS, getBodyTollTier } from '../../../shaperResourceContract';

export { BODY_TOLL_TIERS, getBodyTollTier };

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
        color: '#10b981',
        glow: '#34d399',
        benefit: '+2 Dodge, +10 ft movement, advantage on Disengage',
        desc: 'Unanchored fluidity; bone density softens to absorb kinetic recoil.'
    },
    {
        name: 'Arterial Strike',
        role: 'Offense / Precision',
        color: '#ef4444',
        glow: '#f87171',
        benefit: '+2 attack, crit on 19-20, bypasses 25% DR and Durability',
        desc: 'Serrated calcified talons erupt from fingertips to shred vital arteries.'
    },
    {
        name: 'Centrifugal Fury',
        role: 'Cleave / Multi-Hit',
        color: '#f59e0b',
        glow: '#fbbf24',
        benefit: '+5 ft melee reach; melee hits cleave adjacent foes for 50%',
        desc: 'Ligaments loosen into whip-like sinew bands for lethal rotational momentum.'
    },
    {
        name: 'Deadened Bastion',
        role: 'Defense / Carapace',
        color: '#64748b',
        glow: '#94a3b8',
        benefit: '+20 temporary HP, +4 Durability, -10 ft speed',
        desc: 'Dense keratinous chitin calcifies over vital organs and joints.'
    },
    {
        name: 'Fluid Apex',
        role: 'Evasion / Counter',
        color: '#a855f7',
        glow: '#c084fc',
        benefit: '+1 to all d20 rolls, +1 Flux per round, free form transitions',
        desc: 'Sub-cellular phase shifts dodge through incoming kinetic shockwaves.'
    },
    {
        name: 'Silence Predator',
        role: 'Stealth / Burst',
        color: '#3b82f6',
        glow: '#60a5fa',
        benefit: 'Advantage on Stealth; first concealed strike +2d6 blight',
        desc: 'Pigment-absorbing skin cells and sound-dampening fibrous pads on limbs.'
    }
].map(stance => {
    const contract = SHAPER_FORMS.find(form => form.name === stance.name);
    return { ...stance, cost: contract.fluxCost, tollCost: contract.tollCost };
});

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
    const normalizedResource = normalizeShaperResource(classResource);
    const propFlux = normalizedResource.current;
    const propToll = normalizedResource.bodyToll;
    const propStance = normalizedResource.stance?.current ?? normalizedResource.stance;

    const [localFlux, setLocalFlux] = useState(propFlux);
    const [localToll, setLocalToll] = useState(propToll);
    const [localStance, setLocalStance] = useState(propStance || 'Ataxic Flow');
    // Forms are spells ("Form: <name>") learned level by level: only show the ones this character knows.
    const shaperCharacterClass = useCharacterStore(state => state.class);
    const shaperKnownSpells = useCharacterStore(state => state.class_spells?.known_spells);
    const knownForms = useMemo(() => {
        if (shaperCharacterClass !== 'Shaper') return null;
        const known = new Set(shaperKnownSpells || []);
        return new Set(SHAPER_STANCES.filter((st) => known.has(`shaper_stance_${st.name.toLowerCase().replace(/[^a-z]+/g, '_')}`)).map((st) => st.name));
    }, [shaperCharacterClass, shaperKnownSpells]);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const tooltipTimerRef = useRef(null);
    const suppressTooltipUntilRef = useRef(0);

    const barRef = useRef(null);
    const matrixMenuRef = useRef(null);
    const crucibleRef = useRef(null);

    const maxFlux = SHAPER_FLUX_MAX;
    const maxToll = SHAPER_TOLL_MAX;

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
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const logClassResourceChange = (resourceType, amount, isPositive, subKey) => {
        if (!addCombatNotification) return;
        const actorName = currentPlayerName;
        const characterName = currentPlayerName;
        const sign = isPositive ? '+' : '-';
        const absAmount = Math.abs(amount);
        const verb = resourceType === 'Body Toll' ? (isPositive ? 'accumulated' : 'recovered') : (isPositive ? 'gained' : 'spent');
        const message = `${actorName} ${verb} ${absAmount} ${resourceType} (${sign}${absAmount} ${resourceType})`;

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
        const plan = getShaperFormAdoptionPlan({ ...classResource, current: localFlux, bodyToll: localToll, stance: localStance }, targetStance.name);
        if (!plan.affordable) return;
        const cost = plan.cost;
        const newFlux = plan.nextResource.current;
        setLocalFlux(newFlux);
        setLocalToll(plan.nextResource.bodyToll);
        setLocalStance(targetStance.name);
        setShowMatrix(false);

        logClassResourceChange('Stance Shift', cost, false, 'flux');
        if (onClassResourceUpdate) {
            onClassResourceUpdate('flux', newFlux);
            onClassResourceUpdate('current', newFlux);
            onClassResourceUpdate('momentum', newFlux);
            onClassResourceUpdate('bodyToll', plan.nextResource.bodyToll);
            onClassResourceUpdate('toll', plan.nextResource.bodyToll);
            onClassResourceUpdate('flourish', plan.nextResource.bodyToll);
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
                        <line x1="140" y1="22" x2="156" y2="38" stroke={inked('#ef4444', 0.6)} strokeWidth="2.2" strokeLinecap="round" />
                        <line x1="156" y1="22" x2="140" y2="38" stroke={inked('#ef4444', 0.6)} strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="148" cy="30" r="3.5" fill={washed('#fee2e2', 0.2)} stroke={inked('#ef4444', 0.6)} strokeWidth="1" />
                        <path d="M 148 19 L 148 23 M 148 37 L 148 41 M 137 30 L 141 30 M 155 30 L 159 30" stroke={inked('#f87171', 0.6)} strokeWidth="1.4" />
                    </g>
                );
            case 'Centrifugal Fury':
                // Twin curved spinning cleaver blades / centrifugal vortex
                return (
                    <g className="stance-emblem centrifugal">
                        <path d="M 148 20 C 158 20, 160 30, 154 36 C 152 32, 152 26, 148 20 Z" fill={washed('#f59e0b', 0.2)} />
                        <path d="M 148 40 C 138 40, 136 30, 142 24 C 144 28, 144 34, 148 40 Z" fill={washed('#f59e0b', 0.2)} />
                        <circle cx="148" cy="30" r="2.8" fill={washed('#fef3c7', 0.2)} />
                        <circle cx="148" cy="30" r="9" fill="none" stroke={inked('#fbbf24', 0.6)} strokeWidth="1" strokeDasharray="3,3" />
                    </g>
                );
            case 'Deadened Bastion':
                // Overlapping chitinous shell plates / fortified carapace aegis
                return (
                    <g className="stance-emblem bastion">
                        <path d="M 141 23 L 155 23 L 157 32 L 148 39 L 139 32 Z" fill={PANEL} stroke={inked('#94a3b8', 0.6)} strokeWidth="1.4" />
                        <path d="M 144 26 L 152 26 L 154 32 L 148 36 L 142 32 Z" fill={PAPER} stroke={inked('#cbd5e1', 0.6)} strokeWidth="1" />
                        <line x1="148" y1="23" x2="148" y2="36" stroke={inked('#94a3b8', 0.6)} strokeWidth="1.2" />
                    </g>
                );
            case 'Fluid Apex':
                // Intertwined double-helix / balanced chimeric serpent spiral
                return (
                    <g className="stance-emblem apex">
                        <circle cx="148" cy="30" r="8.5" fill="none" stroke={inked('#a855f7', 0.6)} strokeWidth="1.5" />
                        <path d="M 148 21.5 C 153 21.5, 153 30, 148 30 C 143 30, 143 38.5, 148 38.5" fill="none" stroke={inked('#c084fc', 0.6)} strokeWidth="1.6" />
                        <circle cx="148" cy="25.5" r="1.8" fill={washed('#f3e8ff', 0.2)} />
                        <circle cx="148" cy="34.5" r="1.8" fill={washed('#a855f7', 0.2)} />
                    </g>
                );
            case 'Silence Predator':
                // Retractable shadow mantis talons / predator visor slits
                return (
                    <g className="stance-emblem predator">
                        <path d="M 140 24 Q 148 21 156 24 L 153 27 Q 148 25 143 27 Z" fill={washed('#38bdf8', 0.2)} />
                        <path d="M 141 30 Q 148 28 155 30 L 153 33 Q 148 31 143 33 Z" fill={washed('#60a5fa', 0.2)} />
                        <path d="M 143 36 L 148 40 L 153 36" fill="none" stroke={inked('#93c5fd', 0.6)} strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                );
            case 'Ataxic Flow':
            default:
                // Fluid biomantic wave / sinew flow node
                return (
                    <g className="stance-emblem ataxic">
                        <circle cx="148" cy="30" r="8.5" fill="none" stroke={inked('#10b981', 0.6)} strokeWidth="1.4" />
                        <path d="M 141 30 Q 145 23 148 30 T 155 30" fill="none" stroke={inked('#34d399', 0.6)} strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="148" cy="30" r="2.5" fill={washed('#a7f3d0', 0.2)} />
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
                    <defs />

                    {/* ========================================================================= */}
                    {/* 1. SCULPTED WEAPON CRADLE BACKING (Grounded, full-presence chassis)        */}
                    {/* ========================================================================= */}
                    <g>
                        <path
                            d="M 6 18 L 122 18 L 138 12 L 148 10 L 158 12 L 174 18 L 278 22 L 290 30 L 278 38 L 174 42 L 158 48 L 148 50 L 138 48 L 122 42 L 6 42 L 3 30 Z"
                            fill={PAPER}
                            stroke={isConvergenceCollapse ? inked('#ef4444', 0.6) : RULE}
                            strokeWidth={isConvergenceCollapse ? '1.8' : '1.2'}
                        />
                        {/* Subtle organic blade spine seams */}
                        <line x1="14" y1="30" x2="120" y2="30" stroke={RULE} strokeWidth="0.8" />
                        <line x1="174" y1="30" x2="274" y2="30" stroke={RULE} strokeWidth="0.8" />
                    </g>

                    {/* ========================================================================= */}
                    {/* 2. LEFT WING: SINEW-WRAPPED SWORD HILT & GRIP (x: 8..124)                 */}
                    {/* ========================================================================= */}
                    <g className="shaper-flux-wing">
                        {/* Sculpted Heavy Bio-Pommel Counterweight */}
                        <path
                            d="M 8 30 L 14 18 L 42 18 L 46 22 L 46 38 L 42 42 L 14 42 Z"
                            fill={PAPER}
                            stroke={RULE}
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
                            <circle cx="20" cy="30" r="7" fill={PAPER} stroke={inked('#0284c7', 0.6)} strokeWidth="1.3" />
                            <circle
                                cx="20"
                                cy="30"
                                r="3.5"
                                fill={localFlux > 0 ? washed('#38bdf8', 0.2) : washed('#0369a1', 0.2)}
                            />
                        </g>

                        {/* Monospace Cyan Flux Numeral Readout (Set cleanly in pommel plaque) */}
                        <text
                            className="shaper-flux-numeral"
                            x="34"
                            y="34.5"
                            textAnchor="middle"
                            fill={inked('#38bdf8', 0.55)}
                            fontSize="12.5"
                            fontWeight="900"
                            fontFamily="monospace"
                            style={{ pointerEvents: 'none' }}
                        >
                            {localFlux}
                        </text>

                        {/* Sword Grip Bed (Recessed track under wraps) */}
                        <rect x="46" y="20" width="76" height="20" rx="3" fill={PAPER} stroke={RULE} strokeWidth="0.8" />

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
                                        fill={isFilled ? washed('#0284c7', 0.2) : PAPER}
                                        stroke={isFilled ? (isCurrent ? INK : inked('#38bdf8', 0.6)) : RULE}
                                        strokeWidth={isCurrent ? '1.3' : '0.6'}
                                    />
                                    {/* Living kinetic spark line inside filled tendons */}
                                    {isFilled && (
                                        <line
                                            x1={px + pw / 2}
                                            y1="25"
                                            x2={px + pw / 2}
                                            y2="35"
                                            stroke={inked('#e0f2fe', 0.6)}
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
                            fill={washed('#f8fafc', 0.2)}
                            stroke={RULE}
                            strokeWidth="1.1"
                        />

                        {/* Lower Sweeping Bone Quillon (curving forward under blade) */}
                        <path
                            d="M 124 37 C 132 46, 142 55, 154 55 C 163 55, 169 51, 171 46 C 164 48, 150 46, 141 37 Z"
                            fill={washed('#f8fafc', 0.2)}
                            stroke={RULE}
                            strokeWidth="1.1"
                        />

                        {/* Outer Faceted Diamond Chrysalis Cartouche */}
                        <path
                            d="M 148 12 L 165 30 L 148 48 L 131 30 Z"
                            fill={PAPER}
                            stroke={isConvergenceCollapse ? inked('#ef4444', 0.6) : inked(activeStanceData.color, 0.55)}
                            strokeWidth="1.8"
                        />

                        {/* Inner Faceted Diamond Inset */}
                        <path
                            d="M 148 16 L 160 30 L 148 44 L 136 30 Z"
                            fill={PAPER}
                            stroke={inked(activeStanceData.glow, 0.55)}
                            strokeWidth="0.9"
                        />

                        {/* Active Stance Vector Glyph inside the Chrysalis */}
                        {renderCrucibleEmblem()}

                        {/* Convergence Collapse Warning Pulse Fissures */}
                        {isConvergenceCollapse && (
                            <g className="collapse-sparks">
                                <line x1="148" y1="12" x2="148" y2="48" stroke={INK} strokeWidth="1.4" strokeDasharray="3,2" />
                                <line x1="131" y1="30" x2="165" y2="30" stroke={inked('#fca5a5', 0.6)} strokeWidth="1.2" strokeDasharray="3,2" />
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
                            stroke={inked('#ef4444', 0.6)}
                            strokeWidth="3.2"
                            strokeLinecap="round"
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
                            let plateFill = washed('#f8fafc', 0.2);
                            let plateStroke = inked('#cbd5e1', 0.6);
                            if (val >= 10) {
                                plateFill = washed('#dc2626', 0.2);
                                plateStroke = INK;
                            } else if (val >= 7) {
                                plateFill = washed('#991b1b', 0.2);
                                plateStroke = inked('#f87171', 0.6);
                            } else if (val >= 5) {
                                plateFill = washed('#831843', 0.2);
                                plateStroke = inked('#f472b6', 0.6);
                            } else if (val >= 3) {
                                plateFill = PAPER;
                                plateStroke = inked('#fbbf24', 0.6);
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
                                                fill={washed('#fecaca', 0.2)}
                                                stroke={inked('#ef4444', 0.6)}
                                                strokeWidth="0.8"
                                            />
                                            {/* Lower ventral bone spur */}
                                            <polygon
                                                points={`${px + 1},${topY + segH} ${px + pw / 2},${topY + segH + 10} ${px + pw - 1},${topY + segH}`}
                                                fill={washed('#fecaca', 0.2)}
                                                stroke={inked('#ef4444', 0.6)}
                                                strokeWidth="0.8"
                                            />
                                        </g>
                                    )}

                                    {/* Segmented Vertebral Cutter Tooth */}
                                    <path
                                        d={`M ${px} ${topY} L ${px + pw} ${topY + 1.5} L ${px + pw} ${topY + segH - 1.5} L ${px} ${topY + segH} Z`}
                                        fill={isFilled ? plateFill : PAPER}
                                        stroke={isFilled ? (isCurrent ? INK : plateStroke) : RULE}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                    />

                                    {/* Stress fracture fissure for Tier 3+ (Amber) */}
                                    {isFilled && val >= 3 && (
                                        <line
                                            x1={px + 1.2}
                                            y1={topY + 4}
                                            x2={px + pw - 1.2}
                                            y2={topY + 9}
                                            stroke={inked('#fef08a', 0.6)}
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
                                            stroke={inked('#f472b6', 0.6)}
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
                            fill={PAPER}
                            stroke={RULE}
                            strokeWidth="1.2"
                        />

                        {/* Bold Monospace Ruby Toll Numeral */}
                        <text
                            className="shaper-toll-numeral"
                            x="261"
                            y="34.5"
                            textAnchor="middle"
                            fill={inked('#f87171', 0.55)}
                            fontSize="12.5"
                            fontWeight="900"
                            fontFamily="monospace"
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
                            <circle cx="278" cy="30" r="6.5" fill={PAPER} stroke={inked('#10b981', 0.6)} strokeWidth="1.2" />
                            <circle
                                cx="278"
                                cy="30"
                                r="3"
                                fill={localToll > 0 ? washed('#34d399', 0.2) : washed('#059669', 0.2)}
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
                    className="unified-context-menu shaper-matrix-popover shaper-menu-container class-resource-menu"
                    ref={matrixMenuRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                    }}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
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
                    <div className="cm" style={{ '--cm-accent': '#8a4a6a', '--cm-accent-deep': '#4a1f36', '--cm-wash': '#f0e0e6' }}>
                        <header className="cm-head">
                            <span className="cm-seal"><i className="fas fa-dna" aria-hidden="true"></i></span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">Six-Form Stance Matrix</div>
                                <div className="cm-title">{`${localStance} Stance`}</div>
                                <div className="cm-sub">{statusFlavor?.text || 'Flesh is only a suggestion.'}</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowMatrix(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="cm-stats">
                            <div className="cm-stat">
                                <span className="cm-stat-label">Flux</span>
                                <span className="cm-stat-value">{localFlux}/20</span>
                                <span className="cm-stat-note">pays for forms</span>
                            </div>
                            <div className={`cm-stat ${localToll >= 8 ? 'is-severe' : ''}`}>
                                <span className="cm-stat-label">Body Toll</span>
                                <span className="cm-stat-value">{localToll}/10</span>
                                <span className="cm-stat-note">strain on the flesh</span>
                            </div>
                        </div>
                        <div className="cm-section">
        Forms
        {knownForms && <span className="cm-section-aside">{knownForms.size} learned</span>}
    </div>
                        <div className="cm-forms">
                            {SHAPER_STANCES.filter((st) => !knownForms || knownForms.has(st.name) || st.name === localStance).map((st) => {
                                const isActive = st.name === localStance;
                                const canAfford = getShaperFormAdoptionPlan({ ...classResource, current: localFlux, bodyToll: localToll, stance: localStance }, st.name).affordable;
                                return (
                                    <button
                                        key={st.name}
                                        type="button"
                                        className={`context-menu-button shaper-stance-card cm-form ${isActive ? 'active' : ''}`}
                                        onClick={() => canAfford && !isActive && handleStanceChange(st)}
                                        disabled={!canAfford && !isActive}
                                        aria-current={isActive ? "true" : undefined}
                                        title={st.benefit}
                                    >
                                        <span className="cm-form-name">{st.name}</span>
                                        <span className="cm-form-role">{st.role}</span>
                                        <span className="cm-form-cost">{st.cost} Flux · +{st.tollCost} Toll</span>
                                    </button>
                                );
                            })}
                        </div>
                        {knownForms && knownForms.size === 0 && (
                            <p className="cm-line is-quiet">You have not learned a Form yet. Forms are spells you choose as you level.</p>
                        )}
                        <div className="cm-section">Calibrate</div>
                        <div className="cm-row">
                            <button type="button" className="context-menu-button gain" onClick={() => handleFluxChange(2)}>+2 Flux</button>
                            <button type="button" className="context-menu-button spend" onClick={() => handleTollChange(1)}><i className="fas fa-bolt" aria-hidden="true"></i> +1 Toll</button>
                            <button type="button" className="context-menu-button gain" onClick={() => handleTollChange(-2)}>-2 Toll</button>
                            <button type="button" className="context-menu-button quiet" onClick={() => { handleTollSet(0); handleFluxSet(0); }}><i className="fas fa-undo" aria-hidden="true"></i> Rest (0/0)</button>
                        </div>
                        <details className="cm-notes">
                            <summary>How forms work</summary>
                            <p>Adopting a form pays its Form spell cost in Flux and adds Body Toll. Hover a form to read its benefit.</p>
                            <p>Directed network rules, opening-free shifts and specialization modifiers are still pending; these controls apply no stat bonuses or penalties.</p>
                        </details>
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
                        mechanic="Flux (0–20) is spent adopting Forms (2–4 each). Each adoption adds 1 Body Toll (0–10 strain; Fluid Apex adds 2). Triggers and risk penalties are resolved separately."
                        status={[
                            `Active Stance: ${localStance} — ${activeStanceData.benefit}`,
                            `Mutation Tier: ${currentTollTier.name} (${localToll}/10) — ${currentTollTier.desc}`,
                            isConvergenceCollapse ? 'CRITICAL: flesh integrity failing — purge Body Toll immediately.' : null
                        ].filter(Boolean)}
                        usage="Click tendon wraps to set Flux (pommel +2, Shift +5). Click blade teeth to set Toll (tip -1, Shift -3). Chrysalis opens the Six-Form Matrix."
                        hint="Arrow keys step Flux (Shift ±5). Press 'T' for Toll, 'S' or click Chrysalis for Stances."
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default React.memo(ShaperResourceBar);
