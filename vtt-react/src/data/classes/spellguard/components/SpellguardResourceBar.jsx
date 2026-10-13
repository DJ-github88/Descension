import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
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
import { SPELLGUARD_AEP_MAX, SPELLGUARD_INTAKE_MODES, normalizeSpellguardResource, recordSpellguardIntake } from '../../../spellguardResourceContract';

import { INK, PAGE, PAPER, PANEL, RULE, inked, washed } from '../../../../components/hud/calmBarPalette';
// AEP Volatility & Radiation Tiers
export const AEP_TIERS = [
    { min: 0, max: 25, name: 'Grounded', color: '#38bdf8', glow: '#60a5fa', hot: '#bae6fd', desc: 'Cold iron dissipation. Conduits lead-quenched and stable.' },
    { min: 26, max: 50, name: 'Energized', color: '#0284c7', glow: '#38bdf8', hot: '#e0f2fe', desc: 'Clean energy banked for barriers and reflections.' },
    { min: 51, max: 75, name: 'Overcharged', color: '#7c3aed', glow: '#a78bfa', hot: '#f5d0fe', desc: 'Radiation seep. Blood hums with volatile trapped mana.' },
    { min: 76, max: 90, name: 'Critical Resonance', color: '#c026d3', glow: '#f472b6', hot: '#fdf2f8', desc: 'Heat-sink venting required. Unspent AEP erodes max HP.' },
    { min: 91, max: 100, name: 'Meltdown Imminent', color: '#ef4444', glow: '#f87171', hot: '#fee2e2', desc: 'CRITICAL MASS: 100 AEP triggers the 30 ft Meltdown Nova. Vent immediately!' }
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
    const normalizedResource = normalizeSpellguardResource(classResource);
    const propAEP = normalizedResource.current;
    const propSpec = classResource?.specialization ?? classResource?.spec;

    const [localAEP, setLocalAEP] = useState(propAEP);
    const toCamelId = (id) => !id ? '' : id.replace(/[-_]([a-z])/g, (_, c) => c.toUpperCase());
    const [selectedSpec, setSelectedSpec] = useState(propSpec ? toCamelId(propSpec) : 'arcaneWarden');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [intakeMode, setIntakeMode] = useState('containment');
    const [receiptId, setReceiptId] = useState('');
    const [incomingEnergy, setIncomingEnergy] = useState('20');
    const [capturedEnergy, setCapturedEnergy] = useState('20');
    const [redirectedEnergy, setRedirectedEnergy] = useState('0');
    const [dissipatedEnergy, setDissipatedEnergy] = useState('0');
    const [intakeMessage, setIntakeMessage] = useState('');

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);

    const maxAEP = SPELLGUARD_AEP_MAX;
    const currentTier = getAepTier(localAEP);
    const isOvercharged = localAEP >= 51;
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

    const handleIntake = () => {
        if (!isOwner || !onClassResourceUpdate) return;
        const result = recordSpellguardIntake({ ...classResource, current: localAEP }, {
            id: receiptId.trim(), mode: intakeMode, incoming: incomingEnergy, captured: capturedEnergy,
            redirected: redirectedEnergy, dissipated: dissipatedEnergy
        });
        if (!result.accepted) {
            const reasons = {
                'unknown-interface': 'Choose how you caught the spell.',
                'duplicate-receipt': 'That spell is already in the log. Give this catch its own name.',
                'invalid-or-zero-residual': 'Keep at least 1 AEP, in whole numbers.',
                'unaccounted-energy': 'Kept, sent away and faded must add up to the spell\'s energy.'
            };
            setIntakeMessage(reasons[result.reason] || 'That catch could not be logged.');
            return;
        }
        setLocalAEP(result.resource.current);
        onClassResourceUpdate('spellguardIntake', result.resource.spellguardIntake);
        onClassResourceUpdate('current', result.resource.current);
        setIntakeMessage(`Logged ${receiptId.trim()}: +${result.banked} AEP${result.overflow ? `, ${result.overflow} overflowed` : ''}.`);
        logClassResourceChange('reported residual AEP', result.banked, true, 'aep');
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
                    <defs />

                    {/* ========================================================================= */}
                    {/* 1. MITHRIL BASTION CHASSIS & LEAD BEVEL (Pure Vector Art)                 */}
                    {/* ========================================================================= */}
                    <g>
                        {/* Outer Lead-Forged Bevel */}
                        <rect
                            x="2"
                            y="2"
                            width="292"
                            height="56"
                            rx="5"
                            fill={PAPER}
                            stroke={isMeltdown ? inked('#ef4444', 0.6) : isCritical ? inked('#c026d3', 0.6) : isOvercharged ? inked('#818cf8', 0.6) : RULE}
                            strokeWidth={isMeltdown ? 1.6 : 1.2}
                        />

                        {/* Inner Cobalt-Mithril Plate */}
                        <rect
                            x="4"
                            y="4"
                            width="288"
                            height="52"
                            rx="4"
                            fill={PAPER}
                        />

                        {/* Perimeter Grounding Seams */}
                        <line x1="8" y1="5.5" x2="288" y2="5.5" stroke={isMeltdown ? inked('#ef4444', 0.6) : inked('#38bdf8', 0.6)} strokeWidth="0.8" />
                        <line x1="8" y1="54.5" x2="288" y2="54.5" stroke={RULE} strokeWidth="0.8" />

                        {/* Four Corner Grounding Rivets */}
                        {[
                            [6.5, 6.5],
                            [289.5, 6.5],
                            [6.5, 53.5],
                            [289.5, 53.5]
                        ].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="1.4" fill={PAPER} stroke={RULE} strokeWidth="0.6" />
                                <circle cx={cx - 0.3} cy={cy - 0.3} r="0.4" fill={washed('#94a3b8', 0.2)} />
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
                            fill={PAPER}
                            stroke={localAEP > 0 ? inked('#38bdf8', 0.6) : RULE}
                            strokeWidth="1"
                        />

                        {/* Recessed Intake Well */}
                        <rect
                            x="9.5"
                            y="8.5"
                            width="27"
                            height="43"
                            rx="3"
                            fill={PAPER}
                            stroke={RULE}
                            strokeWidth="0.8"
                        />

                        {/* Vector Siphon Vortex Blades */}
                        <g transform="translate(23, 30)">
                            {/* Outer intake ring */}
                            <circle cx="0" cy="0" r="11" fill="none" stroke={localAEP > 0 ? inked('#38bdf8', 0.6) : RULE} strokeWidth="1" />
                            <circle cx="0" cy="0" r="8" fill={PAPER} stroke={localAEP > 0 ? inked('#60a5fa', 0.6) : RULE} strokeWidth="0.8" />
                            {/* Vortex absorption fins */}
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                <line
                                    key={i}
                                    x1="0"
                                    y1="-3"
                                    x2="0"
                                    y2="-9.5"
                                    stroke={localAEP > 0 ? inked('#bae6fd', 0.6) : RULE}
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    transform={`rotate(${angle})`}
                                />
                            ))}
                            {/* Center Siphon Spark */}
                            <circle cx="0" cy="0" r="2.2" fill={localAEP > 0 ? PAGE : PANEL} />
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
                                        fill={PAPER}
                                        stroke={isFilled ? (isCurrent ? INK : inked('#38bdf8', 0.6)) : RULE}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
                                    />

                                    {/* Glowing Cathode Plasma Column */}
                                    {isFilled && (
                                        <rect
                                            x={cellX + 2}
                                            y={cellY + 3}
                                            width={cellW - 4}
                                            height={cellH - 6}
                                            rx="1.5"
                                            fill={washed('#38bdf8', 0.2)}
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
                                            stroke={INK}
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                            opacity="0.8"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank milestone mark at 25 AEP (between cell 2 and 3) */}
                        <circle cx="80" cy="7" r="1.2" fill={localAEP >= 25 ? washed('#38bdf8', 0.2) : PAPER} />
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
                    >
                        {/* Outer Alchemical Tower Shield Casing */}
                        <polygon
                            points="123,7 173,7 173,34 148,54 123,34"
                            fill={PAPER}
                            stroke={isMeltdown ? inked('#ef4444', 0.6) : isCritical ? inked('#c026d3', 0.6) : isOvercharged ? inked('#818cf8', 0.6) : inked('#38bdf8', 0.6)}
                            strokeWidth={isMeltdown ? '2' : '1.4'}
                        />

                        {/* Inner Beveled Tower Shield Facet */}
                        <polygon
                            points="126,9.5 170,9.5 170,33 148,51 126,33"
                            fill={PAPER}
                            stroke={isMeltdown ? inked('#fca5a5', 0.6) : isOvercharged ? inked('#c084fc', 0.6) : inked('#7dd3fc', 0.6)}
                            strokeWidth="0.8"
                            opacity="0.9"
                        />

                        {/* Center Warding Rune Lines */}
                        <line x1="148" y1="11" x2="148" y2="47" stroke={INK} strokeWidth="0.8" />
                        <line x1="132" y1="21" x2="164" y2="21" stroke={INK} strokeWidth="0.8" />

                        {/* Meltdown Electrical Arc Sparks */}
                        {isMeltdown && (
                            <g stroke={INK} strokeWidth="1.2" strokeLinecap="round">
                                <line x1="120" y1="12" x2="126" y2="16" />
                                <line x1="176" y1="12" x2="170" y2="16" />
                                <line x1="148" y1="51" x2="148" y2="57" />
                            </g>
                        )}

                        {/* Bold High-Contrast Central AEP Numeral */}
                        <text
                            x="148"
                            y="33"
                            fill={INK}
                            fontSize="13"
                            fontWeight="900"
                            textAnchor="middle"
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
                                        fill={PAPER}
                                        stroke={isFilled ? (isWarning ? inked('#ef4444', 0.6) : isCurrent ? INK : inked('#818cf8', 0.6)) : isWarning ? RULE : RULE}
                                        strokeWidth={isCurrent ? '1.4' : '0.8'}
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
                                            stroke={INK}
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                            opacity="0.8"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Mid-bank milestone mark at 75 AEP (between cell 7 and 8) */}
                        <circle cx="216" cy="7" r="1.2" fill={localAEP >= 75 ? washed('#c026d3', 0.2) : PAPER} />
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
                                fill={localAEP >= 75 ? PAPER : PAPER}
                                stroke={localAEP >= 75 ? inked('#c084fc', 0.6) : RULE}
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
                                    stroke={localAEP >= 75 ? inked('#f472b6', 0.6) : RULE}
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
                                fill={showControls ? PAPER : PAPER}
                                stroke={showControls ? inked('#38bdf8', 0.6) : RULE}
                                strokeWidth="0.8"
                            />
                            {/* Engraved Solari Forge Cross-Key */}
                            <line x1="264" y1="43" x2="282" y2="43" stroke={showControls ? INK : inked('#94a3b8', 0.6)} strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="273" y1="36" x2="273" y2="50" stroke={showControls ? INK : inked('#94a3b8', 0.6)} strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="273" cy="43" r="1.8" fill={showControls ? PAGE : washed('#cbd5e1', 0.2)} />
                        </g>
                    </g>
                </svg>

                {/* Floating Tactical Popover Menu Portal */}
                {showControls && ReactDOM.createPortal(
                    <div 
                        className="sg-tender-popover unified-context-menu spellguard-menu-container class-resource-menu" 
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
                                return Math.max(12, Math.min(hudBottom + 8, window.innerHeight - Math.min(600, window.innerHeight - 24) - 12));
                            })(),
                            left: (() => {
                                if (!barRef.current) return '50%';
                                const rect = barRef.current.getBoundingClientRect();
                                const width = Math.min(360, window.innerWidth - 24);
                                return Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
                            })(),
                            width: Math.min(360, window.innerWidth - 24),
                            maxHeight: Math.min(600, window.innerHeight - 24),
                            overflowY: 'auto',
                            boxSizing: 'border-box',
                            zIndex: 100000
                        }}
                    >
                        <div className="cm" style={{ '--cm-accent': '#3e6a8a', '--cm-accent-deep': '#1c3a52', '--cm-wash': '#dfe8ef' }}>
                            <header className="cm-head">
                                <span className={`cm-seal ${localAEP === 0 ? 'is-quiet' : ''}`}>{localAEP}</span>
                                <div className="cm-titles">
                                    <div className="cm-eyebrow">The Damon Forge-Tender</div>
                                    <div className="cm-title">{currentTier.name}</div>
                                    <div className="cm-sub">{localAEP}/{maxAEP} AEP held in the forge</div>
                                </div>
                                <button type="button" className="cm-x" aria-label="Close tender" onClick={() => setShowControls(false)}>
                                    <i className="fas fa-times" aria-hidden="true"></i>
                                </button>
                            </header>
                            <div className="cm-meter" aria-hidden="true"><span style={{ width: `${maxAEP ? Math.min(100, (localAEP / maxAEP) * 100) : 0}%` }}></span></div>
                            {localAEP >= 75 && (
                                <div className="cm-burden is-severe">
                                    <span className="cm-burden-label">{localAEP >= 100 ? 'Containment breach' : 'Running hot'}</span>
                                    <p className="cm-burden-text">{localAEP >= 100 ? 'The forge is full. A breach is due: resolve its damage and reset.' : 'Spend AEP soon. At 100 the forge breaches.'}</p>
                                </div>
                            )}

                            <div className="cm-section">
                                Catch a spell
                                <span className="cm-section-aside">{normalizedResource.spellguardIntake.receipts.length} logged</span>
                            </div>
                            {(() => {
                                const incoming = Number(incomingEnergy) || 0;
                                const split = (Number(capturedEnergy) || 0) + (Number(redirectedEnergy) || 0) + (Number(dissipatedEnergy) || 0);
                                const gap = incoming - split;
                                const modeLabels = { containment: 'Contained it', annulment: 'Annulled it', defusal: 'Defused it', deflection: 'Deflected it', siphon: 'Siphoned it' };
                                return (
                                    <div className="cm-catch">
                                        <div className="cm-intake">
                                            <label className="cm-field">
                                                <span className="cm-field-label">The spell</span>
                                                <input aria-label="Resolution receipt ID" value={receiptId} onChange={event => setReceiptId(event.target.value)} placeholder="e.g. Fireball, round 3" />
                                            </label>
                                            <label className="cm-field">
                                                <span className="cm-field-label">How you caught it</span>
                                                <select aria-label="Intake interface" value={intakeMode} onChange={event => setIntakeMode(event.target.value)}>
                                                    {SPELLGUARD_INTAKE_MODES.map(mode => <option key={mode} value={mode}>{modeLabels[mode] || mode}</option>)}
                                                </select>
                                            </label>
                                        </div>
                                        <label className="cm-field cm-field-wide">
                                            <span className="cm-field-label">Its energy</span>
                                            <input type="number" min="0" step="1" aria-label="Incoming energy" value={incomingEnergy} onChange={event => setIncomingEnergy(event.target.value)} />
                                        </label>
                                        <div className="cm-split">
                                            {[['Kept as AEP', 'Captured residual', capturedEnergy, setCapturedEnergy], ['Sent away', 'Redirected energy', redirectedEnergy, setRedirectedEnergy], ['Let fade', 'Dissipated energy', dissipatedEnergy, setDissipatedEnergy]].map(([shown, label, value, setter]) => (
                                                <label key={label} className="cm-field">
                                                    <span className="cm-field-label">{shown}</span>
                                                    <input type="number" min="0" step="1" aria-label={label} value={value} onChange={event => setter(event.target.value)} />
                                                </label>
                                            ))}
                                        </div>
                                        <p className={`cm-line ${gap === 0 ? '' : 'is-warn'}`}>
                                            {gap === 0 ? 'Balanced: every point of the spell is accounted for.' : gap > 0 ? `${gap} energy still unaccounted for.` : `${-gap} more than the spell carried.`}
                                        </p>
                                        <button type="button" className="cm-btn" onClick={handleIntake} disabled={!receiptId.trim()}>Record resolved intake</button>
                                        {intakeMessage && <p role="status" className="cm-line">{intakeMessage}</p>}
                                    </div>
                                );
                            })()}

                            <div className="cm-section">Spend</div>
                            <div className="cm-row" style={{ '--cm-cols': 4 }}>
                                {[10, 25, 40].map((n) => (
                                    <button key={n} type="button" className="context-menu-button spend" onClick={() => handleAEPChange(-n)} disabled={localAEP < n}>-{n}</button>
                                ))}
                                <button type="button" className="context-menu-button quiet" onClick={() => handleAEPSet(0)} disabled={localAEP === 0} title="Vent the forge to 0">Vent</button>
                            </div>
                            <ClassMenuSpells className="Spellguard" resourceTypes={['arcane_energy_points']} resourceLabel="AEP" current={localAEP} />

                            <details className="cm-notes">
                                <summary>Set AEP directly</summary>
                                <div className="cm-row" style={{ '--cm-cols': 3, marginTop: '6px' }}>
                                    {[[0, 'Grounded'], [25, 'Low'], [50, 'Charged'], [75, 'Overcharge'], [100, 'Meltdown']].map(([val, name]) => (
                                        <button key={val} type="button" className={`context-menu-button ${localAEP === val ? 'active' : ''} ${val >= 75 ? 'spend' : ''}`} onClick={() => handleAEPSet(val)}>
                                            {name} ({val})
                                        </button>
                                    ))}
                                </div>
                            </details>
                            <details className="cm-notes">
                                <summary>How catching works</summary>
                                <p>When a spell hits you, log how much energy it carried and split it: what you kept becomes AEP, the rest was sent away or faded. You must keep at least 1.</p>
                                <p>The forge holds 100 AEP. Anything past that is logged as overflow, not lost silently.</p>
                            </details>
                        </div>
                    </div>,
                    document.body
                )}
            </div>

            {/* Tactical Hover Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip spellguard-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    <ClassTip
                        icon="fas fa-shield-halved"
                        tint={currentTier.color}
                        title="Arcane Energy Points"
                        subtitle="Spellguard Silence-Scarred Aegis (AEP)"
                        state={`${localAEP}/100 • ${currentTier.name}`}
                        stateTone={isMeltdown ? 'bad' : isCritical ? 'warn' : 'good'}
                        mechanic="One 0–100 AEP pool powers every interface. Report captured, redirected and dissipated energy; spell costs and gains share the pool. Decay and risk effects are resolved separately."
                        status={[
                            `${currentTier.name}: ${currentTier.desc}`,
                            localAEP >= 100
                                ? { text: 'Containment breach due at 100. Resolve nova/radiation consequences separately; the tracker does not apply damage or reset automatically.', tone: 'critical' }
                                : localAEP >= 91
                                    ? { text: 'Meltdown imminent — below 100, the breach threshold has not yet been reached.', tone: 'bad' }
                                : localAEP >= 76
                                    ? { text: 'Critical Resonance — unspent AEP erodes max HP until a long rest.', tone: 'bad' }
                                    : localAEP >= 51
                                        ? { text: 'Overcharged — pressure is building. Spend before it turns on you.', tone: 'warn' }
                                        : 'Conduits grounded and cool.',
                            'Radiation/max-HP loss, decay and specialization multipliers are authored rules awaiting their effect/lifecycle integration.'
                        ]}
                        usage="Click chambers to set AEP · Left valve Siphon (+10) · Right valve Vent (-10) · Keystone opens the Tender."
                        hint="Arrow keys step AEP (Shift for ±25). Press 'V' to vent, 'S' to siphon, Enter for Tender menu."
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default React.memo(SpellguardResourceBar);
