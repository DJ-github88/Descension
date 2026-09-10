import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PlaguebringerResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

const PlaguebringerResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const propVirulence = classResource?.virulence ?? classResource?.current ?? 0;
    const propAfflictions = classResource?.afflictions ?? 0;
    const propSpec = classResource?.specialization ?? classResource?.spec;

    const [localVirulence, setLocalVirulence] = useState(propVirulence);
    const [localAfflictions, setLocalAfflictions] = useState(propAfflictions);

    const kebabToCamel = (id) => !id ? '' : id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const [selectedSpec, setSelectedSpec] = useState(propSpec ? kebabToCamel(propSpec) : 'virulentSpreader');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => { if (propVirulence != null) setLocalVirulence(propVirulence); }, [propVirulence]);
    useEffect(() => { if (propAfflictions != null) setLocalAfflictions(propAfflictions); }, [propAfflictions]);
    useEffect(() => { if (propSpec) setSelectedSpec(kebabToCamel(propSpec)); }, [propSpec]);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [localVirulence, localAfflictions, selectedSpec]);

    // Namespace SVG def ids per instance so stacked PartyHUD frames never collide.
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        glow: `plagueGlow${uid}`,
        shadow: `plagueShadow${uid}`,
        brass: `plagueBrass${uid}`,
        glass: `plagueGlass${uid}`,
        fluid: `plagueFluid${uid}`,
        spore: `plagueSpore${uid}`,
        lead: `plagueLead${uid}`,
        clip: `plagueClip${uid}`
    };

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
            ? `${characterName} cultivated ${absAmount} ${resourceName}`
            : `${characterName} withered ${absAmount} ${resourceName}`;

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

    const maxVirulence = 100;
    const maxAfflictions = 10;

    const getVirulenceTier = (virulence) => {
        if (virulence >= 75) return { name: 'Peak Harvest', color: '#a3e635', bonus: '+2 dmg dice, ignore first dispel', fluid: ['#65a30d', '#a3e635', '#f7fee7'] };
        if (virulence >= 50) return { name: 'Blooming', color: '#84cc16', bonus: '+1 duration round, +5ft spread', fluid: ['#4d7c0f', '#84cc16', '#d9f99d'] };
        if (virulence >= 25) return { name: 'Sprouting', color: '#65a30d', bonus: '+1 dmg die to all afflictions', fluid: ['#3f6212', '#65a30d', '#a3e635'] };
        return { name: 'Dormant', color: '#4d7c0f', bonus: 'No bonus', fluid: ['#2c440f', '#4d7c0f', '#7ba428'] };
    };

    const virulenceTier = getVirulenceTier(localVirulence);

    const handleVirulenceChange = (delta) => {
        const newValue = Math.max(0, Math.min(maxVirulence, localVirulence + delta));
        const diff = Math.abs(newValue - localVirulence);
        if (diff > 0) {
            setLocalVirulence(newValue);
            logClassResourceChange('Virulence', diff, delta > 0, 'virulence');
            if (onClassResourceUpdate) onClassResourceUpdate('virulence', newValue);
        }
    };

    const handleAfflictionsChange = (delta) => {
        const newValue = Math.max(0, Math.min(maxAfflictions, localAfflictions + delta));
        const diff = Math.abs(newValue - localAfflictions);
        if (diff > 0) {
            setLocalAfflictions(newValue);
            logClassResourceChange('Afflictions', diff, delta > 0, 'afflictions');
            if (onClassResourceUpdate) onClassResourceUpdate('afflictions', newValue);
        }
    };

    // Click a pod to cultivate straight to it (click the lit count to wither one back).
    const handleAfflictionsSet = (id) => {
        const newValue = localAfflictions === id ? id - 1 : Math.max(0, Math.min(maxAfflictions, id));
        const diff = Math.abs(newValue - localAfflictions);
        if (diff === 0) return;
        setLocalAfflictions(newValue);
        logClassResourceChange('Afflictions', diff, newValue > localAfflictions, 'afflictions');
        if (onClassResourceUpdate) onClassResourceUpdate('afflictions', newValue);
    };

    // Click the vat to pour virulence straight to that mark (snapped to 5s).
    const handleVatClick = (e) => {
        if (!isOwner || !barRef.current) return;
        e.stopPropagation();
        const svg = barRef.current.querySelector('.plaguebringer-vat-svg');
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const vx = ((e.clientX - rect.left) / rect.width) * 300;
        const newValue = Math.max(0, Math.min(maxVirulence, Math.round(((vx - 20) / 260) * 100 / 5) * 5));
        const diff = Math.abs(newValue - localVirulence);
        if (diff === 0) return;
        setLocalVirulence(newValue);
        logClassResourceChange('Virulence', diff, newValue > localVirulence, 'virulence');
        if (onClassResourceUpdate) onClassResourceUpdate('virulence', newValue);
    };

    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); handleVirulenceChange(e.shiftKey ? 10 : 5); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); handleVirulenceChange(e.shiftKey ? -10 : -5); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowControls(!showControls); }
        if (e.key === 'Escape') { setShowControls(false); setShowTooltip(false); }
    };

    // 10 spore pods along the incubator rims (viewBox 0 0 300 64):
    // ids 1-5 across the upper rim, 6-10 across the lower rim.
    const podPositions = [
        { id: 1, cx: 52, cy: 13 },
        { id: 2, cx: 96, cy: 13 },
        { id: 3, cx: 150, cy: 12 },
        { id: 4, cx: 204, cy: 13 },
        { id: 5, cx: 248, cy: 13 },
        { id: 6, cx: 52, cy: 51 },
        { id: 7, cx: 96, cy: 51 },
        { id: 8, cx: 150, cy: 52 },
        { id: 9, cx: 204, cy: 51 },
        { id: 10, cx: 248, cy: 51 }
    ];

    // Root-Veil mycelium creeping across the slab — kindles with virulence.
    const tendrils = [
        'M 8,50 L 40,44 L 70,47 L 105,42 M 40,44 L 52,36 M 70,47 L 84,52',
        'M 292,20 L 260,26 L 228,22 L 196,27 M 260,26 L 248,34 M 228,22 L 216,15',
        'M 200,56 L 232,52 L 264,55 M 232,52 L 240,45'
    ];

    // Config-cog teeth around the menu button.
    const cogTeeth = Array.from({ length: 16 }, (_, k) => {
        const a = (k * Math.PI) / 8;
        const r = k % 2 ? 3.4 : 5.4;
        return `${(289 + Math.cos(a) * r).toFixed(2)},${(34 + Math.sin(a) * r).toFixed(2)}`;
    }).join(' ');
    const podShell = (cx, cy, r) =>
        `${cx},${cy - r} ${cx + r * 0.87},${cy - r * 0.5} ${cx + r * 0.87},${cy + r * 0.5} ` +
        `${cx},${cy + r} ${cx - r * 0.87},${cy + r * 0.5} ${cx - r * 0.87},${cy - r * 0.5}`;

    const isPeakHarvest = localVirulence >= 75;

    // Culture vat chamber: x=20, width=260. Tier marks at 25/50/75.
    const vatFillWidth = (localVirulence / maxVirulence) * 260;
    const tierMarks = [25, 50, 75];
    // Rising spore motes drift through live culture.
    const motes = [
        { cx: 70, cy: 40, r: 1.6, delay: '0s' },
        { cx: 130, cy: 42, r: 1.2, delay: '0.9s' },
        { cx: 185, cy: 39, r: 1.8, delay: '1.7s' },
        { cx: 235, cy: 41, r: 1.3, delay: '0.4s' }
    ];

    return (
        <div className={`plaguebringer-resource-wrapper ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    role="group"
                    tabIndex={isOwner ? 0 : -1}
                    aria-label={`Cultivar vat: virulence ${localVirulence} of ${maxVirulence}, ${localAfflictions} of ${maxAfflictions} afflictions, ${virulenceTier.name}`}
                    className={`plaguebringer-resource-bar ${size} clickable ${isPeakHarvest ? 'peak-harvest' : ''}`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => setShowTooltip(false)}
                    onFocus={() => { if (!showControls) setShowTooltip(false); }}
                    onKeyDown={handleKeyDown}
                    onClick={() => {
                        if (isOwner) {
                            setShowControls(!showControls);
                            if (showControls) setShowTooltip(false);
                        }
                    }}
                >
                    <svg
                        className="plaguebringer-vat-svg"
                        viewBox="0 0 300 64"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Phosphor spore glow */}
                            <filter id={ids.glow} x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.shadow} x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                            </filter>

                            {/* Oxidized verdigris brass */}
                            <linearGradient id={ids.brass} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3d4926" />
                                <stop offset="30%" stopColor="#253018" />
                                <stop offset="70%" stopColor="#192210" />
                                <stop offset="100%" stopColor="#0c1207" />
                            </linearGradient>

                            {/* Empty glass cavity */}
                            <linearGradient id={ids.glass} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0a1208" />
                                <stop offset="100%" stopColor="#142010" />
                            </linearGradient>

                            {/* Bioluminescent culture fluid — tint shifts with the tier */}
                            <linearGradient id={ids.fluid} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={virulenceTier.fluid[0]} />
                                <stop offset="55%" stopColor={virulenceTier.fluid[1]} />
                                <stop offset="100%" stopColor={virulenceTier.fluid[2]} />
                            </linearGradient>

                            {/* Lit spore heart */}
                            <radialGradient id={ids.spore} cx="50%" cy="42%" r="60%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="30%" stopColor="#d9f99d" />
                                <stop offset="70%" stopColor="#84cc16" />
                                <stop offset="100%" stopColor="#365314" />
                            </radialGradient>

                            {/* Culture fill clip */}
                            <clipPath id={ids.clip}>
                                <rect x="20" y="22" width={vatFillWidth} height="24" rx="5" />
                            </clipPath>

                            {/* Cold lead corner caps */}
                            <linearGradient id={ids.lead} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#5a6050" />
                                <stop offset="50%" stopColor="#33382c" />
                                <stop offset="100%" stopColor="#14160f" />
                            </linearGradient>
                        </defs>

                        {/* 1. VERDIGRIS INCUBATOR CASING — full bleed */}
                        <g filter={`url(#${ids.shadow})`}>
                            <path
                                d="M 5 8 L 295 8 L 297 14 L 297 50 L 295 56 L 5 56 L 3 50 L 3 14 Z"
                                fill={`url(#${ids.brass})`}
                                stroke={isPeakHarvest ? '#a3e635' : '#4d5f2a'}
                                strokeWidth={isPeakHarvest ? 2 : 1.5}
                            />
                            {/* Phosphor seam along the top edge */}
                            <line
                                x1="12" y1="10.5" x2="288" y2="10.5"
                                stroke={localVirulence === 0 ? 'rgba(163, 230, 53, 0.15)' : virulenceTier.color}
                                strokeWidth="1"
                                strokeLinecap="round"
                                opacity={localVirulence === 0 ? 1 : 0.35 + (localVirulence / maxVirulence) * 0.6}
                            />
                        </g>

                        {/* Lead corner caps */}
                        {[
                            'M 3 20 L 3 14 L 5 12 L 5 8 L 11 8 L 11 11 L 8 11 L 8 14 L 6 16 L 6 20 Z',
                            'M 297 20 L 297 14 L 295 12 L 295 8 L 289 8 L 289 11 L 292 11 L 292 14 L 294 16 L 294 20 Z',
                            'M 3 44 L 3 50 L 5 52 L 5 56 L 11 56 L 11 53 L 8 53 L 8 50 L 6 48 L 6 44 Z',
                            'M 297 44 L 297 50 L 295 52 L 295 56 L 289 56 L 289 53 L 292 53 L 292 50 L 294 48 L 294 44 Z'
                        ].map((d, i) => (
                            <path key={i} d={d} fill={`url(#${ids.lead})`} stroke="#0a0a0c" strokeWidth="0.6" />
                        ))}

                        {/* Root-Veil mycelium across the slab */}
                        <g
                            fill="none"
                            stroke={localVirulence >= 25 ? virulenceTier.color : '#2c3a1e'}
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity={localVirulence === 0 ? 0.35 : 0.3 + (localVirulence / maxVirulence) * 0.55}
                            pointerEvents="none"
                        >
                            {tendrils.map((d, i) => (
                                <path key={i} d={d} />
                            ))}
                        </g>

                        {/* 2. GLASS CULTURE CYLINDER — click to pour virulence */}
                        <g filter={`url(#${ids.shadow})`} onClick={handleVatClick} style={{ cursor: isOwner ? 'pointer' : 'default' }}>
                            <title>Virulence {localVirulence}/{maxVirulence} — click to pour</title>
                            <rect
                                x="20" y="22" width="260" height="24" rx="5"
                                fill={`url(#${ids.glass})`}
                                stroke="#223014"
                                strokeWidth="1.2"
                                pointerEvents="all"
                            />
                        </g>

                        {/* Live culture fluid */}
                        {localVirulence > 0 && (
                            <g pointerEvents="none">
                                <rect
                                    x="20" y="22" width={vatFillWidth} height="24" rx="5"
                                    fill={`url(#${ids.fluid})`}
                                    filter={`url(#${ids.glow})`}
                                    opacity="0.92"
                                />
                                {/* Breathing surface wave */}
                                <g clipPath={`url(#${ids.clip})`}>
                                    <path
                                        className="plague-surf"
                                        d="M -20,24 q 10,-3.5 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 t 20,0 L 320,22 L -20,22 Z"
                                        fill="#ffffff"
                                        opacity="0.28"
                                    />
                                </g>
                                {/* Rising spore motes */}
                                {motes.map((m, i) => (
                                    localVirulence > i * 20 && (
                                        <circle
                                            key={i}
                                            cx={Math.min(m.cx, 20 + vatFillWidth - 4)}
                                            cy={m.cy}
                                            r={m.r}
                                            fill="#ecfccb"
                                            opacity="0.8"
                                            className="plague-mote"
                                            style={{ animationDelay: m.delay }}
                                        />
                                    )
                                ))}
                            </g>
                        )}

                        {/* Glass glints */}
                        <line x1="22" y1="24.5" x2="278" y2="24.5" stroke="rgba(255, 255, 255, 0.16)" strokeWidth="0.8" pointerEvents="none" />
                        <line x1="22" y1="43.5" x2="278" y2="43.5" stroke="rgba(0, 0, 0, 0.4)" strokeWidth="0.8" pointerEvents="none" />

                        {/* Tier calibration marks (25 / 50 / 75) */}
                        {tierMarks.map((mark) => {
                            const x = 20 + 260 * (mark / 100);
                            const passed = localVirulence >= mark;
                            return (
                                <g key={mark} pointerEvents="none">
                                    <line x1={x} y1="21" x2={x} y2="47" stroke={passed ? virulenceTier.color : '#3d4926'} strokeWidth="1.4" />
                                    <polygon
                                        points={`${x},15.5 ${x + 2.2},18 ${x},20.5 ${x - 2.2},18`}
                                        fill={passed ? virulenceTier.color : '#223014'}
                                        stroke={passed ? '#ecfccb' : '#3d4926'}
                                        strokeWidth="0.7"
                                        filter={passed ? `url(#${ids.glow})` : undefined}
                                    />
                                </g>
                            );
                        })}

                        {/* 3. TRI-SPORE HEART at the vat's center */}
                        <g className="plague-center-emblem" pointerEvents="none" filter={`url(#${ids.shadow})`}>
                            <circle
                                cx="150" cy="34" r="11.5"
                                fill="#15220c"
                                stroke={localVirulence >= 25 ? virulenceTier.color : '#4d5f2a'}
                                strokeWidth="1.4"
                                filter={localVirulence >= 25 ? `url(#${ids.glow})` : undefined}
                            />
                            {/* Three spore lobes */}
                            {[[150, 28.5], [145.2, 37], [154.8, 37]].map(([cx, cy], i) => (
                                <circle
                                    key={i}
                                    cx={cx} cy={cy} r="3.1"
                                    fill={localVirulence >= 25 ? `url(#${ids.spore})` : '#223014'}
                                    filter={localVirulence >= 25 ? `url(#${ids.glow})` : undefined}
                                />
                            ))}
                            <circle cx="150" cy="34" r="1.4" fill="#ffffff" opacity={localVirulence >= 25 ? 0.95 : 0.25} />
                        </g>

                        {/* 4. 10 AFFLICTION SPORE PODS */}
                        {podPositions.map((pod) => {
                            const isActive = localAfflictions >= pod.id;

                            return (
                                <g
                                    key={pod.id}
                                    className={`affliction-nodule nodule-${pod.id} ${isActive ? 'active' : 'inactive'}`}
                                    onClick={(e) => {
                                        if (!isOwner) return;
                                        e.stopPropagation();
                                        handleAfflictionsSet(pod.id);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    <title>{`Affliction ${pod.id}`}</title>
                                    {/* Hypha stalk binding the pod to the vat */}
                                    <line
                                        x1={pod.cx}
                                        y1={pod.id <= 5 ? pod.cy + 6 : pod.cy - 6}
                                        x2={pod.cx}
                                        y2={pod.id <= 5 ? 22 : 46}
                                        stroke={isActive ? virulenceTier.color : '#2c3a1e'}
                                        strokeWidth="0.9"
                                        opacity={isActive ? 0.85 : 0.5}
                                    />
                                    {isActive && localAfflictions === pod.id && (
                                        <circle
                                            cx={pod.cx} cy={pod.cy} r="9.5"
                                            fill="none" stroke={virulenceTier.color} strokeWidth="1.2" opacity="0.8"
                                            className="plague-halo" filter={`url(#${ids.glow})`}
                                        />
                                    )}
                                    {/* Hex-carapace shell */}
                                    <polygon
                                        points={podShell(pod.cx, pod.cy, 6)}
                                        fill="#192312"
                                        stroke={isActive ? virulenceTier.color : '#334020'}
                                        strokeWidth={isActive ? 1.2 : 1}
                                        strokeLinejoin="round"
                                        filter={isActive ? `url(#${ids.glow})` : undefined}
                                    />
                                    {/* Spore heart */}
                                    <circle
                                        cx={pod.cx} cy={pod.cy} r="3.3"
                                        fill={isActive ? `url(#${ids.spore})` : '#0f170c'}
                                        filter={isActive ? `url(#${ids.glow})` : undefined}
                                    />
                                    {isActive && (
                                        <circle cx={pod.cx - 0.8} cy={pod.cy - 0.8} r="0.9" fill="#ffffff" className="plague-pod-heart" />
                                    )}
                                </g>
                            );
                        })}

                        {/* Config cog — the visible door to the setup menu */}
                        <g
                            className="plague-cog"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOwner) {
                                    setShowControls(true);
                                    setShowTooltip(false);
                                }
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            <title>Cultivar controls</title>
                            <circle cx="289" cy="34" r="8" fill="#0c1207" stroke="#4d5f2a" strokeWidth="1" />
                            <polygon
                                points={cogTeeth}
                                fill="none"
                                stroke={showControls ? '#ecfccb' : '#84cc16'}
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                                filter={`url(#${ids.glow})`}
                            />
                            <circle cx="289" cy="34" r="2" fill={showControls ? '#ecfccb' : '#4d5f2a'} />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip plaguebringer-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-biohazard"
                        tint={virulenceTier.color}
                        title={`Virulence · ${virulenceTier.name}`}
                        subtitle="Plaguebringer Alchemical Vat"
                        state={`${localVirulence}/${maxVirulence} · ${localAfflictions}/${maxAfflictions} afflictions`}
                        stateTone={localVirulence >= maxVirulence * 0.75 ? 'good' : 'neutral'}
                        mechanic="Sow Stage 0 Seeds and advance them to Stage 3 with any cultivation category (Weaken, Torment, Fester, Decay, Amplify). Virulence (0-100) measures the garden's maturity and decays 2/round without a plague cast; ember damage burns it back."
                        status={[
                            `${virulenceTier.name}: ${virulenceTier.bonus}.`,
                            localAfflictions > 0
                                ? `${localAfflictions} affliction(s) growing in the vat.`
                                : 'Nothing cultivated — seed something.',
                            'Ember damage strips rot and Virulence.'
                        ]}
                        usage={isOwner ? 'Click the vat to pour Virulence · Click a pod to set afflictions · Cog opens setup.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Compact Unified Pathfinder Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container plaguebringer-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
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
                            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                            let hudBottom = rect.bottom;
                            if (hudContainer) {
                                const hudRect = hudContainer.getBoundingClientRect();
                                hudBottom = hudRect.bottom;
                            }
                            return hudBottom + 8;
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            return rect.left + (rect.width / 2);
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">
                                Virulence: {localVirulence}/{maxVirulence} ({virulenceTier.name})
                            </div>

                            <div style={{ fontSize: '0.8rem', marginBottom: '8px', lineHeight: 1.35 }}>
                                <div><strong>Tier Bonus:</strong> {virulenceTier.bonus}</div>
                                <div><strong>Active Afflictions:</strong> {localAfflictions}/{maxAfflictions}</div>
                            </div>

                            {/* Virulence adjustments */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '6px' }}>
                                Virulence
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => handleVirulenceChange(-10)}>
                                    -10
                                </button>
                                <button className="context-menu-button spend" onClick={() => handleVirulenceChange(-5)}>
                                    -5
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleVirulenceChange(5)}>
                                    +5
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleVirulenceChange(10)}>
                                    +10
                                </button>
                            </div>

                            {/* Affliction adjustments */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '6px' }}>
                                Afflictions ({localAfflictions}/{maxAfflictions})
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => handleAfflictionsChange(-1)}>
                                    <i className="fas fa-minus"></i> -1 Stack
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleAfflictionsChange(1)}>
                                    <i className="fas fa-plus"></i> +1 Stack
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '12px 0' }}></div>

                            {/* Quick Actions */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        setLocalVirulence(0);
                                        setLocalAfflictions(0);
                                        if (onClassResourceUpdate) {
                                            onClassResourceUpdate('virulence', 0);
                                            onClassResourceUpdate('afflictions', 0);
                                        }
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        setLocalVirulence(maxVirulence);
                                        setLocalAfflictions(maxAfflictions);
                                        if (onClassResourceUpdate) {
                                            onClassResourceUpdate('virulence', maxVirulence);
                                            onClassResourceUpdate('afflictions', maxAfflictions);
                                        }
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-arrow-up"></i> Max
                                </button>
                            </div>

                            <button
                                className="context-menu-button danger"
                                onClick={() => setShowControls(false)}
                                style={{ width: '100%' }}
                            >
                                <i className="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PlaguebringerResourceBar;
