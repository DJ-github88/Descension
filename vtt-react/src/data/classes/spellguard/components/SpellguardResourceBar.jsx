import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/SpellguardResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';

// AEP Volatility & Radiation Tiers
export const AEP_TIERS = [
    { min: 0, max: 25, name: 'Grounded', color: '#38bdf8', glow: '#60a5fa', hot: '#bae6fd', desc: 'Cold iron dissipation. Conduits lead-quenched and stable.' },
    { min: 26, max: 50, name: 'Energized', color: '#0284c7', glow: '#38bdf8', hot: '#e0f2fe', desc: 'Active Leyline Siphon. Clean energy banked for barrier deployment.' },
    { min: 51, max: 75, name: 'Overcharged', color: '#7c3aed', glow: '#a78bfa', hot: '#f5d0fe', desc: 'Radiation seep. Veins hum with volatile trapped mana (+1d4 arcane).' },
    { min: 76, max: 90, name: 'Critical Resonance', color: '#c026d3', glow: '#f472b6', hot: '#fdf2f8', desc: 'Heat-sink venting required. Max-HP erosion begins.' },
    { min: 91, max: 100, name: 'Meltdown Imminent', color: '#ef4444', glow: '#f87171', hot: '#fee2e2', desc: 'CRITICAL MASS: 100 AEP triggers 10d6 30ft Meltdown Nova! Vent immediately!' }
];

export const getAepTier = (aep) => {
    return AEP_TIERS.find(t => aep >= t.min && aep <= t.max) || AEP_TIERS[0];
};

const SpellguardResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const propAEP = classResource?.current ?? classResource?.aep ?? classResource?.resonance ?? 0;
    const propSpec = classResource?.specialization ?? classResource?.spec;

    const [localAEP, setLocalAEP] = useState(propAEP);
    const toCamelId = (id) => !id ? '' : id.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase());
    const [selectedSpec, setSelectedSpec] = useState(propSpec ? toCamelId(propSpec) : 'arcaneWarden');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);

    const maxAEP = 100;
    const currentTier = getAepTier(localAEP);
    const isOvercharged = localAEP >= 75;
    const isCritical = localAEP >= 76 && localAEP <= 90;
    const isMeltdown = localAEP >= 91;

    const tooltipRef = useResourceBarTooltip(barRef, showTooltip && !showControls, [localAEP, selectedSpec, currentTier.name]);

    useEffect(() => { if (propAEP != null) setLocalAEP(propAEP); }, [propAEP]);
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
        glow: `sgGlow${uid}`,
        shadow: `sgShadow${uid}`,
        cataGlow: `sgCataGlow${uid}`,
        chassis: `sgChassis${uid}`,
        borderGrad: `sgBorder${uid}`,
        channelRecess: `sgRecess${uid}`,
        plasmaGrad: `sgPlasma${uid}`,
        meltdownPlasma: `sgMeltPlasma${uid}`,
        coreLens: `sgCoreLens${uid}`
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
            ? `${characterName} absorbed ${absAmount} ${resourceName} into Aegis`
            : `${characterName} vented ${absAmount} ${resourceName} through heat-sinks`;

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

    const handleAEPChange = (delta) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxAEP, localAEP + delta));
        const diff = Math.abs(newValue - localAEP);
        if (diff > 0) {
            setLocalAEP(newValue);
            logClassResourceChange('AEP', diff, delta > 0, 'aep');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        }
    };

    const handleAEPSet = (value) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxAEP, value));
        const diff = Math.abs(newValue - localAEP);
        if (diff > 0) {
            setLocalAEP(newValue);
            logClassResourceChange('AEP', diff, newValue > localAEP, 'aep');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        }
    };

    // Keyboard accessibility
    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            handleAEPChange(e.shiftKey ? 25 : 10);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleAEPChange(e.shiftKey ? -25 : -10);
        } else if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
            handleAEPChange(-10);
        } else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            handleAEPChange(10);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowControls(prev => !prev);
        } else if (e.key === 'Escape') {
            setShowControls(false);
            setShowTooltip(false);
        }
    };

    // Status flavor text
    const statusFlavor = getResourceStatusFlavor('Spellguard', { current: localAEP, max: maxAEP });

    // 10 Capacitor Chamber definitions: Left bank (1-5) and Right bank (6-10)
    const leftChambers = [10, 20, 30, 40, 50];
    const rightChambers = [60, 70, 80, 90, 100];

    return (
        <div 
            className={`class-resource-bar spellguard-resource-bar ${size} ${isOvercharged ? 'is-overcharged' : ''} ${isMeltdown ? 'is-meltdown' : ''}`}
            ref={barRef}
            role="slider"
            tabIndex={isOwner ? 0 : -1}
            aria-label={`Spellguard Aegis: ${localAEP} of ${maxAEP} AEP [${currentTier.name}]`}
            aria-valuemin={0}
            aria-valuemax={maxAEP}
            aria-valuenow={localAEP}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="spellguard-bar-wrapper">
                <svg
                    className="spellguard-apparatus-svg"
                    viewBox="0 0 296 60"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Soft Arcane Plasma Glow */}
                        <filter id={ids.glow} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Heavy Sarcophagus Drop Shadow */}
                        <filter id={ids.shadow} x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
                        </filter>

                        {/* Meltdown Critical Arc Glow */}
                        <filter id={ids.cataGlow} x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Lead-Lined Cobalt-Mithril Chassis */}
                        <linearGradient id={ids.chassis} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e2c40" />
                            <stop offset="40%" stopColor="#111a28" />
                            <stop offset="100%" stopColor="#080e16" />
                        </linearGradient>

                        {/* Beveled Alloy Edge */}
                        <linearGradient id={ids.borderGrad} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#475569" />
                            <stop offset="45%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>

                        {/* Recessed Conduit Channel Bed */}
                        <linearGradient id={ids.channelRecess} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#02060c" />
                            <stop offset="50%" stopColor="#08101a" />
                            <stop offset="100%" stopColor="#02060c" />
                        </linearGradient>

                        {/* Standard Arcane Plasma Gradient */}
                        <linearGradient id={ids.plasmaGrad} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#bae6fd" />
                            <stop offset="35%" stopColor="#38bdf8" />
                            <stop offset="70%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>

                        {/* Overcharged Plasma Gradient */}
                        <linearGradient id="sgOverchargeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fae8ff" />
                            <stop offset="35%" stopColor="#c084fc" />
                            <stop offset="70%" stopColor="#9333ea" />
                            <stop offset="100%" stopColor="#581c87" />
                        </linearGradient>

                        {/* Meltdown Nova Plasma Gradient */}
                        <linearGradient id={ids.meltdownPlasma} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fee2e2" />
                            <stop offset="35%" stopColor="#f87171" />
                            <stop offset="70%" stopColor="#dc2626" />
                            <stop offset="100%" stopColor="#7f1d1d" />
                        </linearGradient>

                        {/* Keystone Crystalline Ley-Core */}
                        <radialGradient id={ids.coreLens} cx="50%" cy="45%" r="55%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="25%" stopColor={isMeltdown ? '#fca5a5' : isOvercharged ? '#d8b4fe' : '#7dd3fc'} />
                            <stop offset="70%" stopColor={isMeltdown ? '#dc2626' : isOvercharged ? '#7c3aed' : '#0284c7'} />
                            <stop offset="100%" stopColor="#09101d" />
                        </radialGradient>
                    </defs>

                    {/* ========================================================================= */}
                    {/* 1. MITHRIL BASTION CHASSIS & LEAD BEVEL (Pure Vector Art)                 */}
                    {/* ========================================================================= */}
                    <g filter={`url(#${ids.shadow})`}>
                        {/* Outer Lead-Forged Bevel */}
                        <rect
                            x="2"
                            y="2"
                            width="292"
                            height="56"
                            rx="5"
                            fill={`url(#${ids.borderGrad})`}
                            stroke={isMeltdown ? '#ef4444' : isCritical ? '#c026d3' : isOvercharged ? '#818cf8' : '#334155'}
                            strokeWidth={isMeltdown ? 1.6 : 1.2}
                        />

                        {/* Inner Cobalt-Mithril Plate */}
                        <rect
                            x="4"
                            y="4"
                            width="288"
                            height="52"
                            rx="4"
                            fill={`url(#${ids.chassis})`}
                        />

                        {/* Perimeter Grounding Seams */}
                        <line x1="8" y1="5.5" x2="288" y2="5.5" stroke={isMeltdown ? 'rgba(239, 68, 68, 0.45)' : 'rgba(56, 189, 248, 0.25)'} strokeWidth="0.8" />
                        <line x1="8" y1="54.5" x2="288" y2="54.5" stroke="rgba(15, 23, 42, 0.7)" strokeWidth="0.8" />

                        {/* Four Corner Grounding Rivets */}
                        {[
                            [6.5, 6.5],
                            [289.5, 6.5],
                            [6.5, 53.5],
                            [289.5, 53.5]
                        ].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="1.4" fill="#090e17" stroke="#475569" strokeWidth="0.6" />
                                <circle cx={cx - 0.3} cy={cy - 0.3} r="0.4" fill="#94a3b8" />
                            </g>
                        ))}
                    </g>

                    {/* ========================================================================= */}
                    {/* 2. LEFT FLANK: LEYLINE SIPHON VALVE (x: 7..39, Siphons +10 AEP)           */}
                    {/* ========================================================================= */}
                    <g
                        className="sg-siphon-module"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return;
                            if (e.altKey || e.shiftKey) {
                                handleAEPChange(-10);
                            } else {
                                handleAEPChange(10);
                            }
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                    >
                        {/* Socket Frame */}
                        <rect
                            x="7"
                            y="6"
                            width="32"
                            height="48"
                            rx="4"
                            fill="#060c14"
                            stroke={localAEP > 0 ? '#38bdf8' : '#1e293b'}
                            strokeWidth="1"
                            filter={localAEP > 0 ? `url(#${ids.glow})` : undefined}
                        />

                        {/* Recessed Intake Well */}
                        <rect
                            x="9.5"
                            y="8.5"
                            width="27"
                            height="43"
                            rx="3"
                            fill="#03070d"
                            stroke="#0f172a"
                            strokeWidth="0.8"
                        />

                        {/* Vector Siphon Vortex Blades */}
                        <g transform="translate(23, 30)">
                            {/* Outer intake ring */}
                            <circle cx="0" cy="0" r="11" fill="none" stroke={localAEP > 0 ? '#38bdf8' : '#334155'} strokeWidth="1" />
                            <circle cx="0" cy="0" r="8" fill="#08101a" stroke={localAEP > 0 ? '#60a5fa' : '#1e293b'} strokeWidth="0.8" />
                            {/* Vortex absorption fins */}
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                <line
                                    key={i}
                                    x1="0"
                                    y1="-3"
                                    x2="0"
                                    y2="-9.5"
                                    stroke={localAEP > 0 ? '#bae6fd' : '#475569'}
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    transform={`rotate(${angle})`}
                                />
                            ))}
                            {/* Center Siphon Spark */}
                            <circle cx="0" cy="0" r="2.2" fill={localAEP > 0 ? '#ffffff' : '#475569'} filter={localAEP > 0 ? `url(#${ids.glow})` : undefined} />
                        </g>
                    </g>

                    {/* ========================================================================= */}
                    {/* 3. LEFT CAPACITOR BANK: 5 CHUNKY LEY-CHAMBERS (x: 43..118, 10-50 AEP)     */}
                    {/* ========================================================================= */}
                    <g className="sg-left-bank">
                        {leftChambers.map((val, idx) => {
                            const isFilled = localAEP >= val;
                            const isCurrent = localAEP >= val - 9 && localAEP <= val;
                            const cellX = 43 + (idx * 15.2);
                            const cellY = 8;
                            const cellW = 13.5;
                            const cellH = 44;

                            return (
                                <g
                                    key={`cell-l-${val}`}
                                    className={`sg-chamber ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwner) return;
                                        handleAEPSet(localAEP === val ? val - 10 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Chamber Outer Frame */}
                                    <rect
                                        x={cellX}
                                        y={cellY}
                                        width={cellW}
                                        height={cellH}
                                        rx="2.5"
                                        fill={`url(#${ids.channelRecess})`}
                                        stroke={isFilled ? (isCurrent ? '#ffffff' : '#38bdf8') : '#1e293b'}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
                                    />

                                    {/* Glowing Cathode Plasma Column */}
                                    {isFilled && (
                                        <rect
                                            x={cellX + 2}
                                            y={cellY + 3}
                                            width={cellW - 4}
                                            height={cellH - 6}
                                            rx="1.5"
                                            fill={`url(#${ids.plasmaGrad})`}
                                            opacity="0.9"
                                        />
                                    )}

                                    {/* Central Filament Glint */}
                                    {isFilled && (
                                        <line
                                            x1={cellX + cellW / 2}
                                            y1={cellY + 6}
                                            x2={cellX + cellW / 2}
                                            y2={cellY + cellH - 6}
                                            stroke="#ffffff"
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                            opacity="0.8"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank milestone mark at 25 AEP (between cell 2 and 3) */}
                        <circle cx="80" cy="7" r="1.2" fill={localAEP >= 25 ? '#38bdf8' : '#334155'} />
                    </g>

                    {/* ========================================================================= */}
                    {/* 4. CENTER: DAMON'S ALCHEMICAL TOWER SHIELD KEYSTONE (x: 122..174)         */}
                    {/* ========================================================================= */}
                    <g
                        className={`sg-keystone-module ${isMeltdown ? 'is-meltdown' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowControls(prev => !prev);
                        }}
                        style={{ cursor: 'pointer' }}
                        filter={isMeltdown ? `url(#${ids.cataGlow})` : isOvercharged ? `url(#${ids.glow})` : undefined}
                    >
                        {/* Outer Alchemical Tower Shield Casing */}
                        <polygon
                            points="123,7 173,7 173,34 148,54 123,34"
                            fill="#0b121e"
                            stroke={isMeltdown ? '#ef4444' : isCritical ? '#c026d3' : isOvercharged ? '#818cf8' : '#38bdf8'}
                            strokeWidth={isMeltdown ? '2' : '1.4'}
                        />

                        {/* Inner Beveled Tower Shield Facet */}
                        <polygon
                            points="126,9.5 170,9.5 170,33 148,51 126,33"
                            fill={`url(#${ids.coreLens})`}
                            stroke={isMeltdown ? '#fca5a5' : isOvercharged ? '#c084fc' : '#7dd3fc'}
                            strokeWidth="0.8"
                            opacity="0.9"
                        />

                        {/* Center Warding Rune Lines */}
                        <line x1="148" y1="11" x2="148" y2="47" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                        <line x1="132" y1="21" x2="164" y2="21" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />

                        {/* Meltdown Electrical Arc Sparks */}
                        {isMeltdown && (
                            <g stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round">
                                <line x1="120" y1="12" x2="126" y2="16" />
                                <line x1="176" y1="12" x2="170" y2="16" />
                                <line x1="148" y1="51" x2="148" y2="57" />
                            </g>
                        )}

                        {/* Bold High-Contrast Central AEP Numeral */}
                        <text
                            x="148"
                            y="33"
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="900"
                            textAnchor="middle"
                            filter="drop-shadow(0 1.5px 3px rgba(0,0,0,0.95))"
                        >
                            {localAEP}
                        </text>
                    </g>

                    {/* ========================================================================= */}
                    {/* 5. RIGHT CAPACITOR BANK: 5 CHUNKY LEY-CHAMBERS (x: 178..254, 60-100 AEP)  */}
                    {/* ========================================================================= */}
                    <g className="sg-right-bank">
                        {rightChambers.map((val, idx) => {
                            const isFilled = localAEP >= val;
                            const isCurrent = localAEP >= val - 9 && localAEP <= val;
                            const isWarning = val >= 90;
                            const cellX = 178 + (idx * 15.2);
                            const cellY = 8;
                            const cellW = 13.5;
                            const cellH = 44;

                            const cellPlasma = val >= 90 ? `url(#${ids.meltdownPlasma})` : val >= 60 && isOvercharged ? 'url(#sgOverchargeGrad)' : `url(#${ids.plasmaGrad})`;

                            return (
                                <g
                                    key={`cell-r-${val}`}
                                    className={`sg-chamber ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwner) return;
                                        handleAEPSet(localAEP === val ? val - 10 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Chamber Outer Frame */}
                                    <rect
                                        x={cellX}
                                        y={cellY}
                                        width={cellW}
                                        height={cellH}
                                        rx="2.5"
                                        fill={`url(#${ids.channelRecess})`}
                                        stroke={isFilled ? (isWarning ? '#ef4444' : isCurrent ? '#ffffff' : '#818cf8') : isWarning ? '#451a1a' : '#1e293b'}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
                                    />

                                    {/* Glowing Cathode Plasma Column */}
                                    {isFilled && (
                                        <rect
                                            x={cellX + 2}
                                            y={cellY + 3}
                                            width={cellW - 4}
                                            height={cellH - 6}
                                            rx="1.5"
                                            fill={cellPlasma}
                                            opacity="0.9"
                                        />
                                    )}

                                    {/* Central Filament Glint */}
                                    {isFilled && (
                                        <line
                                            x1={cellX + cellW / 2}
                                            y1={cellY + 6}
                                            x2={cellX + cellW / 2}
                                            y2={cellY + cellH - 6}
                                            stroke="#ffffff"
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                            opacity="0.8"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank milestone mark at 75 AEP (between cell 7 and 8) */}
                        <circle cx="216" cy="7" r="1.2" fill={localAEP >= 75 ? '#c026d3' : '#334155'} />
                    </g>

                    {/* ========================================================================= */}
                    {/* 6. RIGHT FLANK: KINETIC DISCHARGE VENT & FORGE KEY (x: 258..288)          */}
                    {/* ========================================================================= */}
                    <g className="sg-actions-module">
                        {/* A. Kinetic Vent Valve (Top Right, Discharges -10 AEP) */}
                        <g
                            className="sg-vent-module"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isOwner) return;
                                handleAEPChange(-10);
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Frame */}
                            <rect
                                x="257"
                                y="6"
                                width="32"
                                height="22"
                                rx="3.5"
                                fill={localAEP >= 75 ? '#1a0b1e' : '#0a101b'}
                                stroke={localAEP >= 75 ? '#c084fc' : '#334155'}
                                strokeWidth="0.8"
                            />
                            {/* Vector Heat-Sink Exhaust Vents */}
                            {[262, 267, 272, 277, 282].map((vx, i) => (
                                <line
                                    key={i}
                                    x1={vx}
                                    y1="10"
                                    x2={vx}
                                    y2="24"
                                    stroke={localAEP >= 75 ? '#f472b6' : '#64748b'}
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                />
                            ))}
                        </g>

                        {/* B. Forge-Tender Relic Key (Bottom Right, Opens Popover) */}
                        <g
                            className="sg-tender-key"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowControls(prev => !prev);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <rect
                                x="257"
                                y="32"
                                width="32"
                                height="22"
                                rx="3.5"
                                fill={showControls ? '#1e3a5f' : '#0a101b'}
                                stroke={showControls ? '#38bdf8' : '#334155'}
                                strokeWidth="0.8"
                            />
                            {/* Engraved Solari Forge Cross-Key */}
                            <line x1="264" y1="43" x2="282" y2="43" stroke={showControls ? '#ffffff' : '#94a3b8'} strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="273" y1="36" x2="273" y2="50" stroke={showControls ? '#ffffff' : '#94a3b8'} strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="273" cy="43" r="1.8" fill={showControls ? '#ffffff' : '#cbd5e1'} />
                        </g>
                    </g>
                </svg>

                {/* Floating Tactical Popover Menu Portal */}
                {showControls && ReactDOM.createPortal(
                    <div 
                        className="sg-tender-popover unified-context-menu" 
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
                        <div className="sg-tender-header">
                            <div className="sg-tender-title">
                                <i className="fas fa-shield-halved"></i>
                                <span>The Damon Forge-Tender</span>
                            </div>
                            <button 
                                className="sg-tender-close-btn"
                                onClick={() => setShowControls(false)}
                                title="Close tender"
                            >
                                ×
                            </button>
                        </div>

                        {/* Status Flavor Banner */}
                        {statusFlavor && (
                            <div className="sg-status-flavor-banner" style={statusFlavor.style}>
                                <i className="fas fa-quote-left"></i> {statusFlavor.text}
                            </div>
                        )}

                        {/* Section 1: AEP Presets */}
                        <div className="sg-tender-section">
                            <div className="sg-section-label">
                                <span>Arcane Energy Presets</span>
                                <span className="sg-current-pill" style={{ color: currentTier.color }}>
                                    {localAEP}/100 AEP ({currentTier.name})
                                </span>
                            </div>
                            <div className="sg-preset-grid">
                                <button 
                                    className={`sg-preset-btn ${localAEP === 0 ? 'active' : ''}`}
                                    onClick={() => handleAEPSet(0)}
                                >
                                    <span className="sg-btn-title">Grounded (0)</span>
                                    <span className="sg-btn-sub">Cold iron base</span>
                                </button>
                                <button 
                                    className={`sg-preset-btn ${localAEP === 25 ? 'active' : ''}`}
                                    onClick={() => handleAEPSet(25)}
                                >
                                    <span className="sg-btn-title">Siphon (25)</span>
                                    <span className="sg-btn-sub">Low radiation</span>
                                </button>
                                <button 
                                    className={`sg-preset-btn ${localAEP === 50 ? 'active' : ''}`}
                                    onClick={() => handleAEPSet(50)}
                                >
                                    <span className="sg-btn-title">Energized (50)</span>
                                    <span className="sg-btn-sub">Balanced charge</span>
                                </button>
                                <button 
                                    className={`sg-preset-btn ${localAEP === 75 ? 'active' : ''}`}
                                    onClick={() => handleAEPSet(75)}
                                >
                                    <span className="sg-btn-title">Overcharge (75)</span>
                                    <span className="sg-btn-sub">+1d4 Arcane dice</span>
                                </button>
                                <button 
                                    className={`sg-preset-btn cata ${localAEP === 100 ? 'active' : ''}`}
                                    onClick={() => handleAEPSet(100)}
                                >
                                    <span className="sg-btn-title">Meltdown (100)</span>
                                    <span className="sg-btn-sub">Nova risk!</span>
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Tactical Absorption & Discharge */}
                        <div className="sg-tender-section">
                            <div className="sg-section-label">
                                <span>Tactical Channeling</span>
                            </div>
                            <div className="sg-actions-grid">
                                <button 
                                    className="sg-action-btn gain"
                                    onClick={() => handleAEPChange(15)}
                                    disabled={localAEP >= maxAEP}
                                >
                                    <i className="fas fa-plus"></i> Intercept (+15)
                                </button>
                                <button 
                                    className="sg-action-btn spend"
                                    onClick={() => handleAEPChange(-25)}
                                    disabled={localAEP < 25}
                                >
                                    <i className="fas fa-bolt"></i> Discharge (-25)
                                </button>
                                <button 
                                    className="sg-action-btn spend"
                                    onClick={() => handleAEPChange(-40)}
                                    disabled={localAEP < 40}
                                >
                                    <i className="fas fa-shield"></i> Barrier (-40)
                                </button>
                                <button 
                                    className="sg-action-btn purge"
                                    onClick={() => handleAEPSet(0)}
                                    disabled={localAEP === 0}
                                >
                                    <i className="fas fa-rotate-left"></i> Emergency Ground (0)
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>

            {/* Tactical Hover Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    <ClassTip
                        icon="fas fa-shield-halved"
                        tint={currentTier.color}
                        title="Silence-Scarred Aegis (AEP)"
                        state={`${localAEP}/100 • ${currentTier.name}`}
                        stateTone={isMeltdown ? 'bad' : isCritical ? 'warn' : 'good'}
                        mechanic="Absorb hostile spells and physical blows into living vascular tissue. Spend stored AEP on devastating shields, reflections, and kinetic strikes."
                        status={[
                            `Radiation Level: ${currentTier.name} — ${currentTier.desc}`,
                            localAEP >= 91
                                ? 'MELTDOWN IMMINENT: 100 AEP detonates 10d6 in a 30ft radius and drops you to 1 HP. Purge now!'
                                : localAEP >= 76
                                    ? 'Critical Resonance: Unspent AEP erodes max HP until rested.'
                                    : localAEP >= 51
                                        ? 'Overcharged: +1d4 arcane on all weapon and spell strikes.'
                                        : 'Conduits grounded and cool.',
                            `Capacity: ${localAEP}/100 AEP (${100 - localAEP} AEP head-room remaining)`
                        ]}
                        usage="Click chambers to set AEP · Click left valve to Siphon (+10) · Click right valve to Vent (-10) · Click Keystone for Tender."
                        hint="Arrow keys step AEP (Shift for ±25). Press 'V' to vent, 'S' to siphon, Enter for Tender menu."
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default React.memo(SpellguardResourceBar);
