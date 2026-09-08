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
    const statusFlavor = getResourceStatusFlavor({ current: localResonance, resonance: localResonance }, 'Animist');

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
                    <defs>
                        {/* Ethereal Spirit Glow */}
                        <filter id={ids.glow} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Heavy Primal Drop Shadow */}
                        <filter id={ids.shadow} x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor="#000000" floodOpacity="0.9" />
                        </filter>

                        {/* Spirit Erosion Critical Flame Glow */}
                        <filter id={ids.cataGlow} x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Gnarled Bog-Wood Staff Texture */}
                        <linearGradient id={ids.woodBark} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2c1a0e" />
                            <stop offset="25%" stopColor="#1a0f07" />
                            <stop offset="65%" stopColor="#0d0804" />
                            <stop offset="100%" stopColor="#050302" />
                        </linearGradient>

                        {/* Fossilized Weathered Marrow-Bone Gradient */}
                        <linearGradient id={ids.boneGrad} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e5e7eb" />
                            <stop offset="30%" stopColor="#d1d5db" />
                            <stop offset="70%" stopColor="#9ca3af" />
                            <stop offset="100%" stopColor="#4b5563" />
                        </linearGradient>

                        {/* Empty Recessed Bone Marrow Cavity */}
                        <linearGradient id={ids.marrowEmpty} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#080c09" />
                            <stop offset="50%" stopColor="#111a14" />
                            <stop offset="100%" stopColor="#050806" />
                        </linearGradient>

                        {/* Glowing Emerald Lichen / Overtone Fluid (1-10) */}
                        <linearGradient id={ids.emeraldMarrow} x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#064e3b" />
                            <stop offset="40%" stopColor="#059669" />
                            <stop offset="85%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#a7f3d0" />
                        </linearGradient>

                        {/* Cyan-Violet Ancestral Static (11-14 Apex) */}
                        <linearGradient id={ids.apexMarrow} x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#0369a1" />
                            <stop offset="35%" stopColor="#0284c7" />
                            <stop offset="75%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#e0f2fe" />
                        </linearGradient>

                        {/* Smoldering Molten Ember-Crimson (15-20 Spirit Erosion) */}
                        <linearGradient id={ids.erosionMarrow} x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#7f1d1d" />
                            <stop offset="30%" stopColor="#dc2626" />
                            <stop offset="70%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#fef08a" />
                        </linearGradient>

                        {/* Ancestor Skull Crown Radial Core */}
                        <radialGradient id={ids.skullLens} cx="50%" cy="40%" r="60%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="25%" stopColor={isErosion ? '#fca5a5' : isApex ? '#bae6fd' : '#a7f3d0'} />
                            <stop offset="65%" stopColor={isErosion ? '#dc2626' : isApex ? '#0284c7' : '#059669'} />
                            <stop offset="100%" stopColor="#09130c" />
                        </radialGradient>
                    </defs>

                    {/* ========================================================================= */}
                    {/* 1. GNARLED PETRIFIED BOG-WOOD SPINE & ROOT TENDRILS                       */}
                    {/* ========================================================================= */}
                    <g filter={`url(#${ids.shadow})`}>
                        {/* Organic Staff Silhouette */}
                        <path
                            d="M 6 36 Q 35 32, 70 34 Q 110 32, 148 35 Q 186 32, 226 34 Q 260 32, 290 36 L 292 53 Q 260 56, 226 54 Q 186 56, 148 53 Q 110 56, 70 54 Q 35 56, 4 53 Z"
                            fill={`url(#${ids.woodBark})`}
                            stroke={isErosion ? '#ef4444' : isApex ? '#06b6d4' : isHarmonized ? '#10b981' : '#3f2715'}
                            strokeWidth={isErosion ? 1.6 : 1.2}
                        />

                        {/* Knotted Bark Grain Lines */}
                        <path d="M 12 40 Q 60 38, 120 40" stroke="rgba(92, 58, 33, 0.6)" strokeWidth="0.9" fill="none" />
                        <path d="M 176 40 Q 230 38, 284 40" stroke="rgba(92, 58, 33, 0.6)" strokeWidth="0.9" fill="none" />
                        <path d="M 16 48 Q 70 47, 120 49" stroke="rgba(44, 26, 14, 0.8)" strokeWidth="0.8" fill="none" />
                        <path d="M 176 49 Q 230 47, 280 48" stroke="rgba(44, 26, 14, 0.8)" strokeWidth="0.8" fill="none" />

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
                                stroke="#78350f"
                                strokeWidth="1.1"
                                fill="none"
                                opacity="0.85"
                            />
                        ))}

                        {/* Bioluminescent Root-Vein Glow Seam */}
                        <path
                            d="M 10 38 Q 65 35, 120 37 M 176 37 Q 230 35, 286 38"
                            stroke={isErosion ? 'rgba(239, 68, 68, 0.55)' : localResonance > 0 ? 'rgba(52, 211, 153, 0.45)' : 'rgba(16, 185, 129, 0.15)'}
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
                        <ellipse cx="22" cy="36" rx="14" ry="16" fill="#130b05" stroke={localResonance > 0 ? '#10b981' : '#3f2715'} strokeWidth="1" filter={localResonance > 0 ? `url(#${ids.glow})` : undefined} />
                        <ellipse cx="22" cy="36" rx="11" ry="13" fill="#090502" stroke="#2c1a0e" strokeWidth="0.8" />

                        {/* Carved Totem Eye / Spiral */}
                        <g transform="translate(22, 36)">
                            {/* Radiating Overtone Ring */}
                            <circle cx="0" cy="0" r="9" fill="none" stroke={localResonance > 0 ? '#34d399' : '#3f2715'} strokeWidth="0.8" strokeDasharray="2 2" />
                            {/* Carved Antler Spur */}
                            <path
                                d="M -4 2 Q -6 -6, 0 -8 Q 6 -6, 4 2 Q 0 6, -4 2 Z"
                                fill={localResonance > 0 ? '#a7f3d0' : '#374151'}
                                stroke={localResonance > 0 ? '#ffffff' : '#1f2937'}
                                strokeWidth="0.6"
                            />
                            {/* Glowing Totem Core Spark */}
                            <circle cx="0" cy="-1" r="1.5" fill={localResonance > 0 ? '#ffffff' : '#4b5563'} />
                        </g>

                        {/* Hanging Bone Fetish Bead */}
                        <line x1="22" y1="52" x2="22" y2="58" stroke="#78350f" strokeWidth="1" />
                        <polygon points="20,58 24,58 22,60" fill="#d1d5db" />
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
                                        fill={isFilled ? `url(#${ids.boneGrad})` : '#161c18'}
                                        stroke={isFilled ? (isCurrent ? '#ffffff' : '#10b981') : '#25352b'}
                                        strokeWidth={isCurrent ? '1.3' : '0.8'}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
                                    />

                                    {/* Glowing Marrow Core Column */}
                                    {isFilled && (
                                        <path
                                            d={`M ${sx + 1.2} 46 L ${sx + 1.2} 22 Q ${sx + sw / 2} 15 ${sx + sw - 1.2} 22 L ${sx + sw - 1.2} 46 Z`}
                                            fill={`url(#${ids.emeraldMarrow})`}
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
                                            stroke="#ffffff"
                                            strokeWidth="0.8"
                                            strokeLinecap="round"
                                            opacity="0.85"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank root milestone knot at 5 Resonance */}
                        <circle cx="81" cy="51" r="1.3" fill={localResonance >= 5 ? '#34d399' : '#3f2715'} />
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
                        filter={isErosion ? `url(#${ids.cataGlow})` : isApex ? `url(#${ids.glow})` : undefined}
                    >
                        {/* Swept Horns (Crown of the Skull) */}
                        <path
                            d="M 148 10 C 136 2, 122 6, 120 16 C 122 22, 128 22, 134 18 C 138 15, 144 14, 148 16 C 152 14, 158 15, 162 18 C 168 22, 174 22, 176 16 C 174 6, 160 2, 148 10 Z"
                            fill={isErosion ? '#450a0a' : '#1f2937'}
                            stroke={isErosion ? '#ef4444' : isApex ? '#06b6d4' : isHarmonized ? '#10b981' : '#4b5563'}
                            strokeWidth="1"
                        />

                        {/* Carved Beast/Stag Cranium Slab */}
                        <path
                            d="M 134 16 L 162 16 L 166 32 L 157 48 L 139 48 L 130 32 Z"
                            fill="#0d1410"
                            stroke={isErosion ? '#ef4444' : isApex ? '#06b6d4' : isHarmonized ? '#10b981' : '#374151'}
                            strokeWidth={isErosion ? '1.8' : '1.3'}
                        />

                        {/* Inner Bone Forehead Hearth */}
                        <path
                            d="M 136 18 L 160 18 L 163 31 L 155 45 L 141 45 L 133 31 Z"
                            fill={`url(#${ids.skullLens})`}
                            opacity="0.9"
                        />

                        {/* Hollow Spirit Eye Sockets (Ignite with Tier Glow) */}
                        <ellipse cx="141" cy="34" rx="2.5" ry="3.5" fill={isErosion ? '#ffffff' : localResonance > 0 ? '#ffffff' : '#050a07'} filter={localResonance > 0 ? `url(#${ids.glow})` : undefined} />
                        <ellipse cx="155" cy="34" rx="2.5" ry="3.5" fill={isErosion ? '#ffffff' : localResonance > 0 ? '#ffffff' : '#050a07'} filter={localResonance > 0 ? `url(#${ids.glow})` : undefined} />

                        {/* Spirit Erosion Crackle Lines */}
                        {isErosion && (
                            <g stroke="#ffffff" strokeWidth="1" strokeLinecap="round">
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
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="900"
                            textAnchor="middle"
                            filter="drop-shadow(0 1.5px 3px rgba(0,0,0,0.95))"
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
                                        fill={isFilled ? `url(#${ids.boneGrad})` : '#161c18'}
                                        stroke={isFilled ? (isErosionSlot ? '#ef4444' : isCurrent ? '#ffffff' : '#06b6d4') : isErosionSlot ? '#450a0a' : '#25352b'}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
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
                                            stroke="#ffffff"
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
                                            stroke="#fef08a"
                                            strokeWidth="0.7"
                                            strokeLinecap="round"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank root milestone knot at 15 Resonance (Erosion Boundary) */}
                        <circle cx="207" cy="51" r="1.3" fill={localResonance >= 15 ? '#ef4444' : '#3f2715'} />
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
                                fill={isErosion ? '#260a0a' : '#140c06'}
                                stroke={isErosion ? '#ef4444' : '#5c3a21'}
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
                                    stroke={isErosion ? '#f87171' : '#34d399'}
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
                            <line x1="274" y1="28" x2="274" y2="34" stroke="#78350f" strokeWidth="1.2" />

                            {/* Triangular Carved Bone Talisman */}
                            <polygon
                                points="274,34 286,52 262,52"
                                fill={showControls ? '#064e3b' : '#130d07'}
                                stroke={showControls ? '#10b981' : '#5c3a21'}
                                strokeWidth="0.9"
                            />
                            {/* Ancestral Spiral Inscription */}
                            <path
                                d="M 274 40 Q 277 44 274 47 Q 270 47 271 43"
                                stroke={showControls ? '#ffffff' : '#6ee7b7'}
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
                        className="animist-council-popover unified-context-menu"
                        ref={controlsMenuRef}
                        onClick={(e) => e.stopPropagation()}
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
                        <div className="animist-council-header">
                            <div className="animist-council-title">
                                <i className="fas fa-seedling"></i>
                                <span>The Shaman's Council</span>
                            </div>
                            <button
                                className="animist-council-close-btn"
                                onClick={() => setShowControls(false)}
                                title="Close council"
                            >
                                ×
                            </button>
                        </div>

                        {/* Status Flavor Banner */}
                        {statusFlavor && (
                            <div className="animist-status-flavor-banner" style={statusFlavor.style}>
                                <i className="fas fa-quote-left"></i> {statusFlavor.text}
                            </div>
                        )}

                        {/* Section 1: Resonance Presets */}
                        <div className="animist-council-section">
                            <div className="animist-section-label">
                                <span>Resonance Calibration</span>
                                <span className="animist-current-pill" style={{ color: currentTier.color }}>
                                    {localResonance}/20 Res ({currentTier.name})
                                </span>
                            </div>
                            <div className="animist-preset-grid">
                                <button
                                    className={`animist-preset-btn ${localResonance === 0 ? 'active' : ''}`}
                                    onClick={() => handleResonanceSet(0)}
                                >
                                    <span className="animist-btn-title">Dormant (0)</span>
                                    <span className="animist-btn-sub">Cold root-veins</span>
                                </button>
                                <button
                                    className={`animist-preset-btn ${localResonance === 5 ? 'active' : ''}`}
                                    onClick={() => handleResonanceSet(5)}
                                >
                                    <span className="animist-btn-title">Stir (5)</span>
                                    <span className="animist-btn-sub">First overtone</span>
                                </button>
                                <button
                                    className={`animist-preset-btn ${localResonance === 10 ? 'active' : ''}`}
                                    onClick={() => handleResonanceSet(10)}
                                >
                                    <span className="animist-btn-title">Harmonized (10)</span>
                                    <span className="animist-btn-sub">Balanced focus</span>
                                </button>
                                <button
                                    className={`animist-preset-btn ${localResonance === 14 ? 'active' : ''}`}
                                    onClick={() => handleResonanceSet(14)}
                                >
                                    <span className="animist-btn-title">Apex (14)</span>
                                    <span className="animist-btn-sub">Max safe power</span>
                                </button>
                                <button
                                    className={`animist-preset-btn is-danger ${localResonance === 15 ? 'active' : ''}`}
                                    onClick={() => handleResonanceSet(15)}
                                >
                                    <span className="animist-btn-title">Erosion (15)</span>
                                    <span className="animist-btn-sub">Triple Toll active</span>
                                </button>
                                <button
                                    className={`animist-preset-btn is-danger ${localResonance === 20 ? 'active' : ''}`}
                                    onClick={() => handleResonanceSet(20)}
                                >
                                    <span className="animist-btn-title">Cataclysm (20)</span>
                                    <span className="animist-btn-sub">Convergence</span>
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Quick Ancestral Actions */}
                        <div className="animist-council-section">
                            <div className="animist-section-label">
                                <span>Ancestral Invocations</span>
                            </div>
                            <div className="animist-actions-grid">
                                <button
                                    className="animist-action-btn"
                                    onClick={() => handleResonanceChange(3)}
                                    title="Erupt Bone Totem (+3 Resonance)"
                                >
                                    <span className="animist-action-icon"><i className="fas fa-bone"></i></span>
                                    <span>Erupt Totem (+3)</span>
                                </button>
                                <button
                                    className="animist-action-btn"
                                    onClick={() => handleResonanceChange(1)}
                                    title="Whisper Mojo Curse (+1 Resonance)"
                                >
                                    <span className="animist-action-icon"><i className="fas fa-comment-dots"></i></span>
                                    <span>Cast Curse (+1)</span>
                                </button>
                                <button
                                    className="animist-action-btn"
                                    onClick={() => handleResonanceChange(-3)}
                                    title="Exhale Spirit Whistle (-3 Resonance)"
                                >
                                    <span className="animist-action-icon"><i className="fas fa-wind"></i></span>
                                    <span>Vent Spirit (-3)</span>
                                </button>
                                <button
                                    className="animist-action-btn is-ground"
                                    onClick={() => handleResonanceSet(0)}
                                    title="Ground all resonance back to earth (Set to 0)"
                                >
                                    <span className="animist-action-icon"><i className="fas fa-mountain"></i></span>
                                    <span>Ground to Earth (0)</span>
                                </button>
                            </div>
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
                            mechanic="Harvest ancestral resonance to awaken ancient runic networks. Higher resonance empowers spirit wards, spirit guides, and primal council rites."
                            status={[
                                `Tier: ${currentTier.name} — ${currentTier.desc}`,
                                isErosion ? 'EROSION DANGER: 100% ember vulnerability! Party healing severed!' : null,
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
