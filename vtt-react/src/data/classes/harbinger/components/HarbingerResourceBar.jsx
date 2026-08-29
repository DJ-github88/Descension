import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/HarbingerResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';

const STAGE_NAMES = {
    0: 'Stable Anchor',
    1: 'Whispered Doom',
    2: 'Looming Shadow',
    3: 'Incipient Friction',
    4: 'Planar Strain',
    5: 'Spatial Distortion',
    6: 'Probability Shear',
    7: 'Planar Thinning',
    8: 'Redline Entropy',
    9: 'Molecular Dissociation',
    10: 'Master Wild Surge'
};

const DRAWBACK_TEXTS = {
    0: 'None (Planar anchor intact)',
    1: 'Faint timeline echo (-1 Insight saves)',
    2: 'Minor spatial friction (1d4 Wyrd dmg on miss)',
    3: '10% Misfire chance (2d6 Storm damage to self)',
    4: '10% Misfire, cannot receive healing while prophesying',
    5: '10% Misfire, -5ft Movement speed',
    6: '25% Misfire, +25% Bludgeoning/Slashing vulnerability',
    7: '25% Misfire, +25% Phys Vuln, 2d6 self-damage on spell fizzle',
    8: '25% Misfire, +50% Phys Vuln, -10ft Movement speed',
    9: '25% Misfire, +50% Phys Vuln, 3d8 Force self-dmg on miss',
    10: 'Anomalous Dissociation: 100% Phys Vuln (2 rounds), Mayhem vents!'
};

const MASTER_WILD_SURGE_TABLE = [
    { range: [1, 15], cat: 'Unstable Miracle', name: 'Chronal Mending Wave', desc: 'A soothing temporal rift opens. All allies within 30ft regain 4d8 HP and shed 1 ongoing condition.' },
    { range: [16, 30], cat: 'Unstable Miracle', name: 'Gravitational Aegis', desc: 'Gravity bends around the party. Allies gain +3 AC and immunity to forced movement for 2 rounds.' },
    { range: [31, 45], cat: 'Radical Area Ruin', name: 'Sundrift Gravity Shear', desc: 'Grass grows sideways; 30ft radius zone becomes inverted difficult terrain dealing 3d8 Force damage to all creatures.' },
    { range: [46, 60], cat: 'Radical Area Ruin', name: 'Entropy Conflagration', desc: 'A chaotic blast wave erupts. All hostile creatures within 25ft take 5d10 Blight/Wyrd damage and are knocked prone.' },
    { range: [61, 70], cat: 'Reality Reversal', name: 'Probability Inversion Field', desc: 'For 1 round, all missed attack rolls count as hits, and critical hits count as critical fumbles.' },
    { range: [71, 80], cat: 'Reality Reversal', name: 'Spatial Transposition Scramble', desc: 'All combatants within 40ft instantly swap positions randomly. DC 15 Spirit save or disoriented (Slowed).' },
    { range: [81, 90], cat: 'Physical Backlash', name: 'Molecular Dissociation', desc: 'Caster suffers 3d10 Force damage and gains 100% physical vulnerability for 2 rounds as density drops to zero.' },
    { range: [91, 100], cat: 'Physical Backlash', name: 'Catastrophic Timeline Shear', desc: 'Caster loses all remaining Mana and takes 4d10 Necrotic damage. A permanent 10ft Chaos Pocket forms at the caster’s feet.' }
];

const HarbingerResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    // Stage value from 0 to 10 (or mapped from 0-100 Mayhem)
    const rawVal = classResource?.current ?? classResource?.mayhem ?? 0;
    const mayhemStage = rawVal > 10 ? Math.min(10, Math.max(0, Math.round(rawVal / 10))) : Math.min(10, Math.max(0, rawVal));
    const maxStage = 10;

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [hoveredRune, setHoveredRune] = useState(null);
    const [lastSurgeResult, setLastSurgeResult] = useState(null);

    const barRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [mayhemStage]);
    const controlsMenuRef = useRef(null);

    // Close controls menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showControls) {
                const clickedElement = event.target;
                const isInsideMenu = controlsMenuRef.current?.contains(clickedElement);
                const isInsideBar = barRef.current?.contains(clickedElement);

                if (!isInsideMenu && !isInsideBar) {
                    setShowControls(false);
                }
            }
        };

        if (showControls) {
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showControls]);

    // Chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Harbinger');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Harbinger';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'mayhemStage') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} accumulated +${absAmount} ${resourceName}`,
                `${characterName}'s entropy gauge rose by +${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} harvested from collapsing timelines by ${characterName}`,
                `${characterName} channeled +${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} vented ${absAmount} ${resourceName}`,
                `${characterName} spent ${absAmount} ${resourceName} manipulating prophecy bounds`,
                `${absAmount} ${resourceName} released by ${characterName}`,
                `${characterName}'s planar matrix cooled by ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }

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

    const handleStageChange = (delta) => {
        const newStage = Math.max(0, Math.min(maxStage, mayhemStage + delta));
        const actualAmount = Math.abs(newStage - mayhemStage);
        if (actualAmount > 0) {
            logClassResourceChange('Mayhem Stage', actualAmount, delta > 0, 'mayhemStage');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newStage);
        }
    };

    const handleStageSet = (level) => {
        const newStage = Math.max(0, Math.min(maxStage, level));
        const actualAmount = Math.abs(newStage - mayhemStage);
        if (actualAmount > 0) {
            logClassResourceChange('Mayhem Stage', actualAmount, newStage > mayhemStage, 'mayhemStage');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newStage);
        }
    };

    const handleRollWildSurge = () => {
        const roll = Math.floor(Math.random() * 100) + 1;
        const surge = MASTER_WILD_SURGE_TABLE.find(s => roll >= s.range[0] && roll <= s.range[1]) || MASTER_WILD_SURGE_TABLE[0];
        setLastSurgeResult({ roll, ...surge });

        const actorName = getActorName();
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: actorName,
            amount: roll,
            resourceType: 'wild_surge',
            isPositive: surge.cat === 'Unstable Miracle',
            customMessage: `⚡ MASTER WILD SURGE [d100: ${roll}]: ${surge.name} (${surge.cat}) — ${surge.desc}`
        });

        // Reset Mayhem to 0 on Surge
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', 0);
        }
    };

    const getVisualIntensity = () => {
        if (mayhemStage === 0) return 'dormant';
        if (mayhemStage <= 3) return 'whisper';
        if (mayhemStage <= 5) return 'escalating';
        if (mayhemStage <= 7) return 'volatile';
        if (mayhemStage <= 9) return 'redline';
        return 'catastrophic';
    };

    const getStageName = (level) => STAGE_NAMES[level] || 'Unknown';
    const getDrawbackText = (level) => DRAWBACK_TEXTS[level] || 'Unknown';

    const getBonusText = (level) => {
        if (level === 0) return 'None (Base power)';
        if (level <= 2) return '+1 Damage on critical rolls';
        if (level <= 4) return '+1 Bonus Damage/Healing Die';
        if (level <= 6) return '+2 Bonus Dice • +5ft AoE Radius';
        if (level <= 8) return '+3 Bonus Dice • +10ft AoE Radius';
        if (level === 9) return '+3 Bonus Dice • +10ft AoE • +1 Target';
        return 'd100 Master Wild Surge Detonation!';
    };

    const getDrawbackColor = (level) => {
        if (level === 0) return '#4a3c2c';
        if (level <= 4) return '#7f8c8d';
        if (level <= 6) return '#8e44ad';
        if (level <= 8) return '#c0392b';
        return '#b30000';
    };

    // Render 10 Runes with custom generated illustrated game assets
    const renderRunes = () => {
        const runes = [];
        for (let i = 1; i <= maxStage; i++) {
            const isFilled = mayhemStage >= i;
            const isCurrentTier = mayhemStage === i;
            const isCatastrophic = i === 10 && mayhemStage >= 10;
            const isHovered = hoveredRune === i;

            runes.push(
                <div
                    key={i}
                    className={`harbinger-rune-slot slot-${i} ${isFilled ? 'filled' : 'empty'} ${isCurrentTier ? 'current-active' : ''} ${isCatastrophic ? 'catastrophic' : ''} ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredRune(i)}
                    onMouseLeave={() => setHoveredRune(null)}
                    onClick={(e) => {
                        if (isOwner && e.shiftKey) {
                            e.stopPropagation();
                            handleStageSet(i);
                        }
                    }}
                >
                    {/* Unlit Carved Rune (Obsidian Stone) */}
                    <img
                        src={`/assets/ui/classes/harbinger/Empty Stage ${i}.PNG`}
                        alt={`Unlit Stage ${i}`}
                        className={`harbinger-rune-img rune-empty ${!isFilled ? 'visible' : 'faded'}`}
                        draggable={false}
                    />

                    {/* Lit Glowing Rune (Void / Amethyst Fire) */}
                    <img
                        src={`/assets/ui/classes/harbinger/Filled Stage ${i}.PNG`}
                        alt={`Lit Stage ${i}`}
                        className={`harbinger-rune-img rune-filled ${isFilled ? 'visible' : 'faded'}`}
                        draggable={false}
                    />
                </div>
            );
        }
        return runes;
    };

    return (
        <div className={`harbinger-resource-wrapper ${size} ${mayhemStage >= 10 ? 'catastrophic-warning' : ''}`}>
            {/* Main Resource Bar - Interactive Illustrated Component */}
            <div
                ref={barRef}
                className={`harbinger-resource-bar ${size} clickable intensity-${getVisualIntensity()}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => {
                    setShowTooltip(false);
                    setHoveredRune(null);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                {/* Base Carved Void-Stone Bar Background Asset */}
                <img
                    src="/assets/ui/classes/harbinger/Empty Bar.PNG"
                    alt="Harbinger Bar Base"
                    className="harbinger-bar-base-asset"
                    draggable={false}
                />

                {/* 10 Runes Track */}
                <div className="harbinger-runes-track">
                    {renderRunes()}
                </div>
            </div>

            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip harbinger-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <div className="tooltip-header" style={{ fontSize: '1.05rem', color: mayhemStage > 0 ? '#6c3483' : '#2C2416', letterSpacing: '0.6px' }}>
                        {getStageName(mayhemStage)} (Stage {mayhemStage}/{maxStage})
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-row" style={{ fontSize: '0.92rem', color: '#2C2416' }}>
                            <strong>Spell Amplification:</strong> <span style={{ color: '#6c3483', fontWeight: 700 }}>{getBonusText(mayhemStage)}</span>
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: '#2C2416', fontWeight: 700 }}>CURRENT DRAWBACK</div>
                        <div className="drawback-text" style={{ color: getDrawbackColor(mayhemStage), fontWeight: mayhemStage >= 6 ? 700 : 600, fontSize: '0.9rem', lineHeight: 1.35 }}>
                            {getDrawbackText(mayhemStage)}
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: '#2C2416', fontWeight: 700, marginBottom: '6px' }}>LEVEL MANAGEMENT</div>
                        <div className="harbinger-management-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.86rem' }}>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#6c3483' }}>Ascend:</strong> <span style={{ color: '#3d2e1e' }}>Cast spells (+1 to +3 stages by spell tier & fulfilled prophecies)</span>
                            </div>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#1e5f74' }}>Descend:</strong> <span style={{ color: '#3d2e1e' }}>Spend Mayhem to widen prophecy range, -1 per min out of combat</span>
                            </div>
                        </div>
                    </div>

                    {mayhemStage >= 6 && (
                        <>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label" style={{ color: '#c0392b', fontWeight: 700 }}>PLANAR INSTABILITY (ACTIVE)</div>
                                <div className="passive-desc" style={{ color: '#2C2416', fontSize: '0.88rem', fontWeight: 500 }}>
                                    At Stage 6+: <strong>25% Misfire chance</strong> (2d6 Storm damage) and <strong>+{mayhemStage >= 8 ? '50%' : '25%'} Physical Vulnerability</strong>.
                                </div>
                            </div>
                        </>
                    )}

                    {isOwner && (
                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed rgba(139, 115, 85, 0.4)', fontSize: '0.78rem', color: '#5a4632', fontStyle: 'italic' }}>
                            Click bar to open controls menu. Shift+Click rune to set level directly.
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Unified Context Controls Menu (Standard Project Beige/Cream Theme) */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={{
                        position: 'fixed',
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Harbinger Mayhem Controls</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Stage:</strong> {getStageName(mayhemStage)} <span style={{ color: '#8e44ad' }}>(Level {mayhemStage}/{maxStage})</span></div>
                                <div><strong>Bonus:</strong> {getBonusText(mayhemStage)}</div>
                                <div style={{ color: mayhemStage >= 8 ? '#c0392b' : mayhemStage >= 6 ? '#8e44ad' : '#5a4628' }}>
                                    <strong>Drawback:</strong> {getDrawbackText(mayhemStage)}
                                </div>
                                {mayhemStage >= 6 && (
                                    <div style={{ color: '#c0392b', fontStyle: 'italic', marginTop: '2px' }}>
                                        Planar Instability active — Physical vulnerability & misfire risks engaged.
                                    </div>
                                )}
                                {mayhemStage === 0 && (
                                    <div style={{ color: '#5a4628', fontStyle: 'italic', marginTop: '2px' }}>
                                        Cast spells to build Mayhem. Spend Mayhem to widen prophecy ranges.
                                    </div>
                                )}
                            </div>

                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '8px', marginBottom: '8px' }}>
                                Set Mayhem Level
                            </div>

                            {/* Direct Jump Grid (0 to 10) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                                    <button
                                        key={lvl}
                                        className={`context-menu-button ${mayhemStage === lvl ? 'active' : ''} ${lvl >= 10 ? 'danger' : ''}`}
                                        onClick={() => handleStageSet(lvl)}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleStageChange(-1)}>
                                    <i className="fas fa-minus-circle"></i>
                                    -1
                                </button>
                                <button className="context-menu-button" onClick={() => handleStageChange(1)}>
                                    <i className="fas fa-plus-circle"></i>
                                    +1
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '10px 0' }}></div>

                            {/* Master Wild Surge Trigger */}
                            <button
                                className="context-menu-button"
                                style={{ width: '100%', marginBottom: '8px', backgroundColor: '#8e44ad', color: '#ffffff', fontWeight: 'bold' }}
                                onClick={handleRollWildSurge}
                            >
                                <i className="fas fa-dice-d20" style={{ marginRight: '6px' }}></i>
                                Roll d100 Master Wild Surge
                            </button>

                            {lastSurgeResult && (
                                <div style={{ padding: '6px', background: 'rgba(142, 68, 173, 0.1)', border: '1px solid #8e44ad', borderRadius: '4px', fontSize: '0.76rem', marginBottom: '8px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#6c3483' }}>
                                        d100 = {lastSurgeResult.roll}: {lastSurgeResult.name}
                                    </div>
                                    <div style={{ color: '#4a3c2c', fontSize: '0.72rem', marginTop: '2px' }}>
                                        {lastSurgeResult.desc}
                                    </div>
                                </div>
                            )}

                            <button className="context-menu-button danger" onClick={() => setShowControls(false)} style={{ width: '100%' }}>
                                <i className="fas fa-times"></i>
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default HarbingerResourceBar;
