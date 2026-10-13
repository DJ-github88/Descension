import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/AnimistResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';

import { INK, PAGE, PAPER, PANEL, RULE, ETCH, inked, washed } from '../../../../components/hud/calmBarPalette';
// Resonance & Spirit Erosion Tiers
export const RESONANCE_TIERS = [
    { min: 0, max: 4, name: 'Dormant', color: '#10b981', glow: '#34d399', hot: '#d1fae5', desc: 'Conduits cold, root-veins quiet. Spirits slumber.' },
    { min: 5, max: 9, name: 'Harmonized', color: '#059669', glow: '#6ee7b7', hot: '#ecfdf5', desc: 'Ancestors stir. Throat overtones thrum with ancestral guidance.' },
    { min: 10, max: 14, name: 'Apex Harmonic', color: '#06b6d4', glow: '#67e8f9', hot: '#cffafe', desc: 'Peak efficiency! Skin sigils ignite with ancestral static.' },
    { min: 15, max: 20, name: 'Spirit Erosion', color: '#ef4444', glow: '#f87171', hot: '#fee2e2', desc: 'THE TRIPLE TOLL: 100% ember vulnerability, no party healing, forced movement shatters networks, 1d6 Wyrd hoarder damage.' }
];

export const getResonanceTier = (val) => {
    return RESONANCE_TIERS.find(t => val >= t.min && val <= t.max) || RESONANCE_TIERS[0];
};

const AnimistResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const propResonance = classResource?.current ?? classResource?.resonance ?? classResource?.ancestralResonance ?? 0;
    const propSpec = classResource?.specialization ?? classResource?.spec;

    const [localResonance, setLocalResonance] = useState(propResonance);
    const toCamelId = (id) => !id ? '' : id.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase());
    const [selectedSpec, setSelectedSpec] = useState(propSpec ? toCamelId(propSpec) : 'thornwarden');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);

    const maxResonance = 20;
    const currentTier = getResonanceTier(localResonance);
    const isHarmonized = localResonance >= 5;
    const isApex = localResonance >= 10 && localResonance <= 14;
    const isErosion = localResonance >= 15;
    const isCataclysm = localResonance >= 20;

    const tooltipRef = useResourceBarTooltip(barRef, showTooltip && !showControls, [localResonance, selectedSpec, currentTier.name]);

    useEffect(() => { if (propResonance != null) setLocalResonance(propResonance); }, [propResonance]);
    useEffect(() => { if (propSpec) setSelectedSpec(toCamelId(propSpec)); }, [propSpec]);

    // Close controls menu when clicking outside
    useEffect(() => {
        if (!showControls) return;
        const handleClickOutside = (e) => {
            if (controlsMenuRef.current && controlsMenuRef.current.contains(e.target)) return;
            if (barRef.current && barRef.current.contains(e.target)) return;
            setShowControls(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showControls]);

    // Unique SVG ID namespace
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        glow: `anGlow${uid}`,
        shadow: `anShadow${uid}`,
        cataGlow: `anCataGlow${uid}`,
        woodBark: `anWood${uid}`,
        boneGrad: `anBone${uid}`,
        marrowEmpty: `anMarrowEmpty${uid}`,
        emeraldMarrow: `anEmMarrow${uid}`,
        apexMarrow: `anApexMarrow${uid}`,
        erosionMarrow: `anErosMarrow${uid}`,
        skullLens: `anSkullLens${uid}`
    };

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        const message = isPositive
            ? `${characterName} erupted ${absAmount} ${resourceName} into ancestral bone spurs`
            : `${characterName} exhaled ${absAmount} ${resourceName} through spirit conduits`;

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

    const handleResonanceChange = (delta) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxResonance, localResonance + delta));
        const diff = Math.abs(newValue - localResonance);
        if (diff > 0) {
            setLocalResonance(newValue);
            logClassResourceChange('Resonance', diff, delta > 0, 'resonance');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        }
    };

    const handleResonanceSet = (value) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxResonance, value));
        const diff = Math.abs(newValue - localResonance);
        if (diff > 0) {
            setLocalResonance(newValue);
            logClassResourceChange('Resonance', diff, newValue > localResonance, 'resonance');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        }
    };

    // Keyboard accessibility
    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            handleResonanceChange(e.shiftKey ? 5 : 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleResonanceChange(e.shiftKey ? -5 : -1);
        } else if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            handleResonanceChange(3); // Erupt Totem (+3)
        } else if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            handleResonanceChange(1); // Whisper Curse (+1)
        } else if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
            handleResonanceChange(-3); // Vent/Discharge (-3)
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowControls(prev => !prev);
        }
    };

    // 20 Erupted Bone Spurs: Left Bank (1..10) and Right Bank (11..20)
    const leftSpurs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const rightSpurs = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    // Status flavor profile
    const statusFlavor = getResourceStatusFlavor('Animist', { current: localResonance, resonance: localResonance });

    return (
        <div
            ref={barRef}
            className={`class-resource-bar animist-resource-bar ${size} ${currentTier.name.toLowerCase().replace(/\s+/g, '-')} ${isErosion ? 'spirit-erosion' : ''}`}
            onClick={(e) => {
                if (e.target === barRef.current || e.target.classList?.contains('animist-bar-wrapper')) {
                    setShowControls(prev => !prev);
                }
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onKeyDown={handleKeyDown}
            tabIndex={isOwner ? 0 : -1}
            role="slider"
            aria-label={`Animist Resonance: ${localResonance} of ${maxResonance} [${currentTier.name}]`}
            aria-valuenow={localResonance}
            aria-valuemin={0}
            aria-valuemax={maxResonance}
        >
            <div className="animist-bar-wrapper">
                <svg
                    className="animist-apparatus-svg"
                    viewBox="0 0 296 60"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs />

                    {/* ========================================================================= */}
                    {/* 1. GNARLED PETRIFIED BOG-WOOD SPINE & ROOT TENDRILS                       */}
                    {/* ========================================================================= */}
                    <g>
                        {/* Organic Staff Silhouette */}
                        <path
                            d="M 6 36 Q 35 32, 70 34 Q 110 32, 148 35 Q 186 32, 226 34 Q 260 32, 290 36 L 292 53 Q 260 56, 226 54 Q 186 56, 148 53 Q 110 56, 70 54 Q 35 56, 4 53 Z"
                            fill={PAPER}
                            stroke={isErosion ? inked('#ef4444', 0.6) : isApex ? inked('#06b6d4', 0.6) : isHarmonized ? inked('#10b981', 0.6) : RULE}
                            strokeWidth={isErosion ? 1.6 : 1.2}
                        />

                        {/* Knotted Bark Grain Lines */}
                        <path d="M 12 40 Q 60 38, 120 40" stroke={RULE} strokeWidth="0.9" fill="none" />
                        <path d="M 176 40 Q 230 38, 284 40" stroke={RULE} strokeWidth="0.9" fill="none" />
                        <path d="M 16 48 Q 70 47, 120 49" stroke={RULE} strokeWidth="0.8" fill="none" />
                        <path d="M 176 49 Q 230 47, 280 48" stroke={RULE} strokeWidth="0.8" fill="none" />

                        {/* Rawhide Sinew Wraps (Binding the Staff) */}
                        {[
                            "M 38 33 L 43 55 M 41 33 L 46 55",
                            "M 115 33 L 120 55 M 118 33 L 123 55",
                            "M 173 33 L 178 55 M 176 33 L 181 55",
                            "M 253 33 L 258 55 M 256 33 L 261 55"
                        ].map((wrapPath, i) => (
                            <path
                                key={`sinew-${i}`}
                                d={wrapPath}
                                stroke={RULE}
                                strokeWidth="1.1"
                                fill="none"
                                opacity="0.85"
                            />
                        ))}

                        {/* Bioluminescent Root-Vein Glow Seam */}
                        <path
                            d="M 10 38 Q 65 35, 120 37 M 176 37 Q 230 35, 286 38"
                            stroke={isErosion ? inked('#ef4444', 0.6) : localResonance > 0 ? inked('#34d399', 0.6) : ETCH}
                            strokeWidth="0.8"
                            fill="none"
                        />
                    </g>

                    {/* ========================================================================= */}
                    {/* 2. LEFT FLANK: TOTEM ROOT KNOT (x: 8..36, +1 / +3 Resonance)              */}
                    {/* ========================================================================= */}
                    <g
                        className="animist-totem-knot"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return;
                            if (e.altKey || e.shiftKey) {
                                handleResonanceChange(3); // Erupt Totem (+3)
                            } else {
                                handleResonanceChange(1); // Whisper Curse (+1)
                            }
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                    >
                        {/* Carved Root Bulb */}
                        <ellipse cx="22" cy="36" rx="14" ry="16" fill={PAPER} stroke={localResonance > 0 ? inked('#10b981', 0.6) : RULE} strokeWidth="1" />
                        <ellipse cx="22" cy="36" rx="11" ry="13" fill={PAPER} stroke={RULE} strokeWidth="0.8" />

                        {/* Carved Totem Eye / Spiral */}
                        <g transform="translate(22, 36)">
                            {/* Radiating Overtone Ring */}
                            <circle cx="0" cy="0" r="9" fill="none" stroke={localResonance > 0 ? inked('#34d399', 0.6) : RULE} strokeWidth="0.8" strokeDasharray="2 2" />
                            {/* Carved Antler Spur */}
                            <path
                                d="M -4 2 Q -6 -6, 0 -8 Q 6 -6, 4 2 Q 0 6, -4 2 Z"
                                fill={localResonance > 0 ? washed('#a7f3d0', 0.2) : PAPER}
                                stroke={localResonance > 0 ? INK : RULE}
                                strokeWidth="0.6"
                            />
                            {/* Glowing Totem Core Spark */}
                            <circle cx="0" cy="-1" r="1.5" fill={localResonance > 0 ? PAGE : PANEL} />
                        </g>

                        {/* Hanging Bone Fetish Bead */}
                        <line x1="22" y1="52" x2="22" y2="58" stroke={RULE} strokeWidth="1" />
                        <polygon points="20,58 24,58 22,60" fill={PAGE} />
                    </g>

                    {/* ========================================================================= */}
                    {/* 3. LEFT BANK: 10 ERUPTED BONE SPURS (x: 44..118, 1-10 Resonance)          */}
                    {/* ========================================================================= */}
                    <g className="animist-left-spurs">
                        {leftSpurs.map((val, idx) => {
                            const isFilled = localResonance >= val;
                            const isCurrent = localResonance === val;
                            const sx = 44 + (idx * 7.4);
                            const sw = 6.2;
                            const spurH = 34; // Base height reaching down to staff

                            return (
                                <g
                                    key={`spur-l-${val}`}
                                    className={`animist-bone-spur ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwner) return;
                                        handleResonanceSet(localResonance === val ? val - 1 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Weathered Outer Bone Tooth Silhouette */}
                                    <path
                                        d={`M ${sx} 48 L ${sx} 20 Q ${sx + sw / 2} 11 ${sx + sw} 20 L ${sx + sw} 48 Z`}
                                        fill={isFilled ? PANEL : PAPER}
                                        stroke={isFilled ? (isCurrent ? INK : inked('#10b981', 0.6)) : RULE}
                                        strokeWidth={isCurrent ? '1.3' : '0.8'}
                                    />

                                    {/* Glowing Marrow Core Column */}
                                    {isFilled && (
                                        <path
                                            d={`M ${sx + 1.2} 46 L ${sx + 1.2} 22 Q ${sx + sw / 2} 15 ${sx + sw - 1.2} 22 L ${sx + sw - 1.2} 46 Z`}
                                            fill={washed('#059669', 0.2)}
                                            opacity="0.9"
                                        />
                                    )}

                                    {/* Spine Marrow Glint */}
                                    {isFilled && (
                                        <line
                                            x1={sx + sw / 2}
                                            y1="23"
                                            x2={sx + sw / 2}
                                            y2="44"
                                            stroke={INK}
                                            strokeWidth="0.8"
                                            strokeLinecap="round"
                                            opacity="0.85"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank root milestone knot at 5 Resonance */}
                        <circle cx="81" cy="51" r="1.3" fill={localResonance >= 5 ? washed('#34d399', 0.2) : PAPER} />
                    </g>

                    {/* ========================================================================= */}
                    {/* 4. CENTER: THE ANCESTRAL SHAMAN SKULL HEARTH (x: 122..174)                 */}
                    {/* ========================================================================= */}
                    <g
                        className={`animist-skull-module ${isErosion ? 'is-erosion' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowControls(prev => !prev);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        {/* Swept Horns (Crown of the Skull) */}
                        <path
                            d="M 148 10 C 136 2, 122 6, 120 16 C 122 22, 128 22, 134 18 C 138 15, 144 14, 148 16 C 152 14, 158 15, 162 18 C 168 22, 174 22, 176 16 C 174 6, 160 2, 148 10 Z"
                            fill={isErosion ? PAPER : PAPER}
                            stroke={isErosion ? inked('#ef4444', 0.6) : isApex ? inked('#06b6d4', 0.6) : isHarmonized ? inked('#10b981', 0.6) : RULE}
                            strokeWidth="1"
                        />

                        {/* Carved Beast/Stag Cranium Slab */}
                        <path
                            d="M 134 16 L 162 16 L 166 32 L 157 48 L 139 48 L 130 32 Z"
                            fill={PAPER}
                            stroke={isErosion ? inked('#ef4444', 0.6) : isApex ? inked('#06b6d4', 0.6) : isHarmonized ? inked('#10b981', 0.6) : RULE}
                            strokeWidth={isErosion ? '1.8' : '1.3'}
                        />

                        {/* Inner Bone Forehead Hearth */}
                        <path
                            d="M 136 18 L 160 18 L 163 31 L 155 45 L 141 45 L 133 31 Z"
                            fill={PAPER}
                            opacity="0.9"
                        />

                        {/* Hollow Spirit Eye Sockets (Ignite with Tier Glow) */}
                        <ellipse cx="141" cy="34" rx="2.5" ry="3.5" fill={isErosion ? PAGE : localResonance > 0 ? PAGE : PAPER} />
                        <ellipse cx="155" cy="34" rx="2.5" ry="3.5" fill={isErosion ? PAGE : localResonance > 0 ? PAGE : PAPER} />

                        {/* Spirit Erosion Crackle Lines */}
                        {isErosion && (
                            <g stroke={INK} strokeWidth="1" strokeLinecap="round">
                                <line x1="148" y1="12" x2="148" y2="24" />
                                <line x1="135" y1="28" x2="140" y2="30" />
                                <line x1="161" y1="28" x2="156" y2="30" />
                                <line x1="148" y1="42" x2="148" y2="48" />
                            </g>
                        )}

                        {/* Bold High-Contrast Central Resonance Numeral */}
                        <text
                            x="148"
                            y="27"
                            fill={INK}
                            fontSize="13"
                            fontWeight="900"
                            textAnchor="middle"
                        >
                            {localResonance}
                        </text>
                    </g>

                    {/* ========================================================================= */}
                    {/* 5. RIGHT BANK: 10 ERUPTED BONE SPURS (x: 178..252, 11-20 Resonance)       */}
                    {/* ========================================================================= */}
                    <g className="animist-right-spurs">
                        {rightSpurs.map((val, idx) => {
                            const isFilled = localResonance >= val;
                            const isCurrent = localResonance === val;
                            const isErosionSlot = val >= 15;
                            const sx = 178 + (idx * 7.4);
                            const sw = 6.2;

                            // Spurs 15-20 erupt taller and more jagged
                            const spurTopY = isErosionSlot ? 8 : 20;
                            const spurPeakY = isErosionSlot ? 4 : 11;

                            const spurMarrow = isErosionSlot
                                ? `url(#${ids.erosionMarrow})`
                                : `url(#${ids.apexMarrow})`;

                            return (
                                <g
                                    key={`spur-r-${val}`}
                                    className={`animist-bone-spur ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''} ${isErosionSlot ? 'erosion-spur' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwner) return;
                                        handleResonanceSet(localResonance === val ? val - 1 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Bone Tooth/Horn Silhouette */}
                                    <path
                                        d={`M ${sx} 48 L ${sx} ${spurTopY} Q ${sx + sw / 2} ${spurPeakY} ${sx + sw} ${spurTopY} L ${sx + sw} 48 Z`}
                                        fill={isFilled ? PANEL : PAPER}
                                        stroke={isFilled ? (isErosionSlot ? inked('#ef4444', 0.6) : isCurrent ? INK : inked('#06b6d4', 0.6)) : isErosionSlot ? RULE : RULE}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                    />

                                    {/* Glowing Marrow Core Column */}
                                    {isFilled && (
                                        <path
                                            d={`M ${sx + 1.2} 46 L ${sx + 1.2} ${spurTopY + 2} Q ${sx + sw / 2} ${spurPeakY + 4} ${sx + sw - 1.2} ${spurTopY + 2} L ${sx + sw - 1.2} 46 Z`}
                                            fill={spurMarrow}
                                            opacity="0.9"
                                        />
                                    )}

                                    {/* Fissure Fracture Glint */}
                                    {isFilled && (
                                        <line
                                            x1={sx + sw / 2}
                                            y1={spurTopY + 3}
                                            x2={sx + sw / 2}
                                            y2="44"
                                            stroke={INK}
                                            strokeWidth="0.8"
                                            strokeLinecap="round"
                                            opacity="0.85"
                                        />
                                    )}

                                    {/* Extra Jagged Ember Crack for 15-20 */}
                                    {isFilled && isErosionSlot && (
                                        <line
                                            x1={sx + 1}
                                            y1={spurTopY + 8}
                                            x2={sx + sw - 1}
                                            y2={spurTopY + 14}
                                            stroke={inked('#fef08a', 0.6)}
                                            strokeWidth="0.7"
                                            strokeLinecap="round"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank root milestone knot at 15 Resonance (Erosion Boundary) */}
                        <circle cx="207" cy="51" r="1.3" fill={localResonance >= 15 ? washed('#ef4444', 0.2) : PAPER} />
                    </g>

                    {/* ========================================================================= */}
                    {/* 6. RIGHT FLANK: SPIRIT BONE WHISTLE & HANGING TALISMAN (x: 258..290)       */}
                    {/* ========================================================================= */}
                    <g className="animist-ritual-modules">
                        {/* A. Carved Bone Spirit Whistle (Top Right, Discharges -3 Resonance) */}
                        <g
                            className="animist-whistle-module"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isOwner) return;
                                handleResonanceChange(e.shiftKey ? -5 : -3);
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Hollow Bone Whistle Cylinder */}
                            <path
                                d="M 260 14 L 288 14 Q 292 20 288 26 L 260 26 Z"
                                fill={isErosion ? PAPER : PAPER}
                                stroke={isErosion ? inked('#ef4444', 0.6) : RULE}
                                strokeWidth="0.9"
                            />
                            {/* Whistle Breath Slits */}
                            {[265, 271, 277, 283].map((vx, i) => (
                                <line
                                    key={`slit-${i}`}
                                    x1={vx}
                                    y1="16"
                                    x2={vx}
                                    y2="24"
                                    stroke={isErosion ? inked('#f87171', 0.6) : inked('#34d399', 0.6)}
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                />
                            ))}
                        </g>

                        {/* B. Suspended Ancestral Talisman (Bottom Right, Toggles Council) */}
                        <g
                            className="animist-talisman-module"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowControls(prev => !prev);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Leather Sinew Cord */}
                            <line x1="274" y1="28" x2="274" y2="34" stroke={RULE} strokeWidth="1.2" />

                            {/* Triangular Carved Bone Talisman */}
                            <polygon
                                points="274,34 286,52 262,52"
                                fill={showControls ? PAPER : PAPER}
                                stroke={showControls ? inked('#10b981', 0.6) : RULE}
                                strokeWidth="0.9"
                            />
                            {/* Ancestral Spiral Inscription */}
                            <path
                                d="M 274 40 Q 277 44 274 47 Q 270 47 271 43"
                                stroke={showControls ? INK : inked('#6ee7b7', 0.6)}
                                strokeWidth="1"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </g>
                    </g>
                </svg>

                {/* Floating Tactical Popover Menu Portal */}
                {showControls && ReactDOM.createPortal(
                    <div
                        className="animist-council-popover unified-context-menu animist-menu-container class-resource-menu"
                        ref={controlsMenuRef}
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
                                if (!barRef.current) return '50%';
                                const rect = barRef.current.getBoundingClientRect();
                                const hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                let hudTop = rect.top;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                    hudTop = hudRect.top;
                                }
                                if (hudBottom + 360 > window.innerHeight) {
                                    return Math.max(10, hudTop - 360);
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!barRef.current) return '50%';
                                const rect = barRef.current.getBoundingClientRect();
                                return Math.max(165, Math.min(window.innerWidth - 165, rect.left + (rect.width / 2)));
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="cm" style={{ '--cm-accent': '#3f7a52', '--cm-accent-deep': '#1f4a2e', '--cm-wash': '#e1ecdc' }}>
                            <header className="cm-head">
                                <span className={`cm-seal ${localResonance === 0 ? 'is-quiet' : ''}`}>{localResonance}</span>
                                <div className="cm-titles">
                                    <div className="cm-eyebrow">The Shaman's Council</div>
                                    <div className="cm-title">{currentTier.name}</div>
                                    <div className="cm-sub">{localResonance}/{maxResonance} Resonance{statusFlavor?.text ? `. ${statusFlavor.text}` : ''}</div>
                                </div>
                                <button type="button" className="cm-x" aria-label="Close council" onClick={() => setShowControls(false)}>
                                    <i className="fas fa-times" aria-hidden="true"></i>
                                </button>
                            </header>
                            <div className="cm-meter" aria-hidden="true"><span style={{ width: `${Math.min(100, (localResonance / maxResonance) * 100)}%` }}></span></div>
                            <div className={`cm-burden ${isErosion ? 'is-severe' : localResonance < 5 ? 'is-quiet' : ''}`}>
                                <span className="cm-burden-label">{isErosion ? 'The Triple Toll' : 'The spirits answer'}</span>
                                <p className="cm-burden-text">
                                    {isErosion
                                        ? 'You take double ember damage, no ally can heal you, forced movement shatters your runes, and you suffer 1d6 wyrd if you end your turn here.'
                                        : currentTier.desc}
                                </p>
                            </div>
                            <div className="cm-section">
                                Calibrate
                                <span className="cm-section-aside">15+ brings the Toll</span>
                            </div>
                            <div className="cm-row" style={{ '--cm-cols': 3 }}>
                                {[[0, 'Dormant', 'cold root-veins'], [5, 'Stir', 'first overtone'], [10, 'Harmonized', 'balanced focus'], [14, 'Apex', 'max safe power'], [15, 'Erosion', 'Toll begins'], [20, 'Cataclysm', 'convergence']].map(([val, name, sub]) => (
                                    <button
                                        key={val}
                                        type="button"
                                        className={`context-menu-button is-stacked ${localResonance === val ? 'active' : ''} ${val >= 15 ? 'spend' : ''}`}
                                        onClick={() => handleResonanceSet(val)}
                                    >
                                        <span>{name} ({val})</span>
                                        <span className="cm-btn-sub">{sub}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="cm-section">Adjust</div>
                            <div className="cm-row" style={{ '--cm-cols': 4 }}>
                                <button type="button" className="context-menu-button spend" onClick={() => handleResonanceChange(-3)}>-3</button>
                                <button type="button" className="context-menu-button spend" onClick={() => handleResonanceChange(-1)}>-1</button>
                                <button type="button" className="context-menu-button gain" onClick={() => handleResonanceChange(1)}>+1</button>
                                <button type="button" className="context-menu-button gain" onClick={() => handleResonanceChange(3)}>+3</button>
                            </div>
                            <ClassMenuSpells className="Animist" resourceTypes={['resonance']} resourceLabel="Resonance" current={localResonance} />
                            <details className="cm-notes">
                                <summary>How Resonance works</summary>
                                <p>Your spells build and spend Resonance (0 to 20). 10 to 14 is the sweet spot.</p>
                                <p>At 15 and above the Triple Toll applies until you vent or ground it.</p>
                            </details>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Tactile Tooltip via ClassTip */}
                {showTooltip && !showControls && ReactDOM.createPortal(
                    <div
                        ref={tooltipRef}
                        className="unified-resourcebar-tooltip pathfinder-tooltip animist-tooltip"
                        style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                    >
                        <ClassTip
                            icon="fas fa-seedling"
                            tint="#16a34a"
                            title="Ancestral Bone-Cairn & Runic Lattice"
                            subtitle={`${currentTier.name} Stage`}
                            state={`${localResonance}/${maxResonance} AR`}
                            stateTone={isErosion ? 'critical' : localResonance >= 14 ? 'good' : 'neutral'}
                            mechanic="Resonance (0–20) powers invocations and rune detonations. At 15+ the Triple Toll applies: ember vulnerability, no party healing, and 1d6 wyrd each turn if you hoard."
                            status={[
                                `${currentTier.name}: ${currentTier.desc}`,
                                isErosion ? { text: 'TRIPLE TOLL: 100% ember vulnerability · no party healing · forced movement shatters runes (1d10 each) · 1d6 wyrd if you end at 15+.', tone: 'critical' } : null,
                                statusFlavor
                            ].filter(Boolean)}
                            usage="Click bone spurs to calibrate · Left-click Totem Knot for +1 (Shift for +3) · Click Whistle for -3."
                            hint="Click Skull or Talisman for council presets."
                        />
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};

export default React.memo(AnimistResourceBar);
