import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/GambitResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';

const STAGE_NAMES = {
    0: 'Bust / Cosmic Bankruptcy',
    1: 'Ante Up',
    2: 'Penny Ante',
    3: 'Calculated Bet',
    4: 'Flush Hand',
    5: 'Lucky Streak',
    6: 'High Roller',
    7: 'Grand Jackpot (All-In)'
};

const DRAWBACK_TEXTS = {
    0: 'Cosmic Bankruptcy: 2d10 Necrotic, 100% Spirit/Blight Vulnerability (2 rds)',
    1: 'Calculated Risk: 1d4 psychic self-damage per FP spent to nudge',
    2: 'Calculated Risk: 1d4 psychic self-damage per FP spent to nudge',
    3: 'Calculated Risk: 1d4 psychic per FP, Debtor’s tax on failed rolls',
    4: 'Calculated Risk: 1d4 psychic per FP, +5% Karmic vulnerability',
    5: 'Calculated Risk: 1d4 psychic per FP, +10% Karmic vulnerability',
    6: 'Calculated Risk: 1d4 psychic per FP, +15% Karmic vulnerability',
    7: 'All-In: 1d4 psychic per FP, maximum wager multipliers, one bad roll from Bust!'
};

const GambitResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    // Fortune (0–7) and Karmic Debt (0–13)
    const rawFp = classResource?.current ?? classResource?.fortunePoints ?? 3;
    const fpLevel = Math.min(7, Math.max(0, rawFp));
    const maxFp = 7;
    const rawDebt = classResource?.debt ?? classResource?.risk ?? 0;
    const debtLevel = Math.min(13, Math.max(0, rawDebt));
    const maxDebt = 13;

    const [showTooltip, setShowTooltip] = useState(false);
    const [hoverSection, setHoverSection] = useState('fp'); // 'fp' or 'debt'
    const [showControls, setShowControls] = useState(false);
    const [lastRollResult, setLastRollResult] = useState(null);

    const barRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [fpLevel, debtLevel, hoverSection]);
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
    const currentPlayerName = useCharacterStore(state => state.name || 'Gambit');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Gambit';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'fortunePoints') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} banked +${absAmount} ${resourceName} from the wager table`,
                `${characterName} harvested +${absAmount} ${resourceName} of stolen probability`,
                `Fortune smiles: +${absAmount} ${resourceName} pocketed by ${characterName}`,
                `${characterName} gained +${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} spent ${absAmount} ${resourceName} to nudge probability (${absAmount}d4 psychic damage)`,
                `${characterName} wagered ${absAmount} ${resourceName} on the turn of fate`,
                `${absAmount} ${resourceName} expended by ${characterName}`,
                `${characterName} parted with ${absAmount} ${resourceName}`
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

    const handleFpChange = (delta) => {
        const newFp = Math.max(0, Math.min(maxFp, fpLevel + delta));
        const actualAmount = Math.abs(newFp - fpLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Fortune', actualAmount, delta > 0, 'fortunePoints');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newFp);
        }
    };

    const handleFpSet = (level) => {
        const newFp = Math.max(0, Math.min(maxFp, level));
        const actualAmount = Math.abs(newFp - fpLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Fortune', actualAmount, newFp > fpLevel, 'fortunePoints');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newFp);
        }
    };

    const handleDebtChange = (delta) => {
        const newDebt = Math.max(0, Math.min(maxDebt, debtLevel + delta));
        const actualAmount = Math.abs(newDebt - debtLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Karmic Debt', actualAmount, delta > 0, 'karmicDebt');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('debt', newDebt);
        }
    };

    const handleDebtSet = (level) => {
        const newDebt = Math.max(0, Math.min(maxDebt, level));
        const actualAmount = Math.abs(newDebt - debtLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Karmic Debt', actualAmount, newDebt > debtLevel, 'karmicDebt');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('debt', newDebt);
        }
    };

    const handleRollDice = (sides) => {
        const roll = Math.floor(Math.random() * sides) + 1;
        setLastRollResult({ sides, roll });

        const actorName = getActorName();
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: actorName,
            amount: roll,
            resourceType: 'gamble_roll',
            isPositive: roll >= sides / 2,
            customMessage: `🎲 GAMBIT ROLL [d${sides}]: ${roll} (Available FP to nudge: ${fpLevel})`
        });
    };

    const getStageName = (level) => STAGE_NAMES[level] || 'Unknown';
    const getDrawbackText = (level) => DRAWBACK_TEXTS[level] || 'Unknown';

    const getBonusText = (level) => {
        if (level === 0) return 'None (Cosmic Bankruptcy Risk)';
        if (level <= 3) return `Modify d20 rolls by up to ±${level} FP`;
        if (level <= 6) return `Modify rolls by up to ±${level} FP • Mid-tier wagers active`;
        return `Modify rolls by up to ±7 FP • Maximum Wager Multipliers`;
    };

    const getDrawbackColor = (level) => {
        if (level === 0) return '#b30000';
        if (level <= 3) return '#8c2510';
        if (level <= 5) return '#4a3c2c';
        return '#5a4628';
    };

    return (
        <div className={`gambit-dual-wrapper ${size} ${context === 'party' ? 'party-context' : ''}`}>
            {/* Dual Split Resource Bar (Fortune on Left, Debt on Right) */}
            <div
                ref={barRef}
                className="gambit-dual-bar-container"
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                {/* Left Side: Fortune Bar (0–7 FP) */}
                <div
                    className={`gambit-sub-bar fp-bar ${fpLevel === 0 ? 'bust-warning' : ''}`}
                    onMouseEnter={() => {
                        setHoverSection('fp');
                        setShowTooltip(true);
                    }}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {/* Background Fill */}
                    <div
                        className="gambit-fill fp-fill"
                        style={{ width: `${(fpLevel / maxFp) * 100}%` }}
                    />

                    {/* 7 Coin Pips Track */}
                    <div className="gambit-pips-track">
                        {[1, 2, 3, 4, 5, 6, 7].map((coinIdx) => (
                            <div
                                key={coinIdx}
                                className={`gambit-pip coin-pip ${fpLevel >= coinIdx ? 'filled' : 'empty'}`}
                                onClick={(e) => {
                                    if (isOwner && e.shiftKey) {
                                        e.stopPropagation();
                                        handleFpSet(coinIdx);
                                    }
                                }}
                            >
                                <span className="pip-label">{coinIdx}</span>
                            </div>
                        ))}
                    </div>

                    {/* Centered Text */}
                    <div className="gambit-bar-label fp-label">
                        <span>Fortune: {fpLevel}/{maxFp}</span>
                    </div>
                </div>

                {/* Center Divider: Gilded Diamond Symbol */}
                <div className="gambit-center-divider">
                    <span className="divider-icon">♦</span>
                </div>

                {/* Right Side: Karmic Debt Bar (0–13 Debt) */}
                <div
                    className={`gambit-sub-bar debt-bar ${debtLevel >= 12 ? 'collapse-warning' : ''}`}
                    onMouseEnter={() => {
                        setHoverSection('debt');
                        setShowTooltip(true);
                    }}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {/* Background Fill */}
                    <div
                        className="gambit-fill debt-fill"
                        style={{ width: `${(debtLevel / maxDebt) * 100}%` }}
                    />

                    {/* 13 Tick Segments */}
                    <div className="gambit-ticks-track">
                        {Array.from({ length: 13 }, (_, i) => i + 1).map((tickIdx) => (
                            <div
                                key={tickIdx}
                                className={`gambit-tick ${debtLevel >= tickIdx ? 'active' : ''} ${tickIdx >= 12 ? 'danger-tick' : ''}`}
                                onClick={(e) => {
                                    if (isOwner && e.shiftKey) {
                                        e.stopPropagation();
                                        handleDebtSet(tickIdx);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* Centered Text */}
                    <div className="gambit-bar-label debt-label">
                        <span>Debt: {debtLevel}/{maxDebt}</span>
                    </div>
                </div>
            </div>

            {/* Pathfinder-styled Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip gambit-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <div className="tooltip-header" style={{ fontSize: '1.05rem', color: hoverSection === 'fp' ? '#b7791f' : '#8e44ad', letterSpacing: '0.6px' }}>
                        {hoverSection === 'fp'
                            ? `${getStageName(fpLevel)} (${fpLevel}/${maxFp} FP)`
                            : `Karmic Debt: ${debtLevel}/${maxDebt} Stacks (+${debtLevel * 5}% Vuln)`}
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-row" style={{ fontSize: '0.92rem', color: '#2C2416' }}>
                            <strong>{hoverSection === 'fp' ? 'Probability Manipulation:' : 'Karmic Consequence:'}</strong>{' '}
                            <span style={{ color: hoverSection === 'fp' ? '#b7791f' : '#8e44ad', fontWeight: 700 }}>
                                {hoverSection === 'fp' ? getBonusText(fpLevel) : `+${debtLevel * 5}% Damage taken from all sources`}
                            </span>
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: '#2C2416', fontWeight: 700 }}>CURRENT RISK & TOLL</div>
                        <div className="drawback-text" style={{ color: getDrawbackColor(fpLevel), fontWeight: fpLevel === 0 || debtLevel >= 8 ? 700 : 600, fontSize: '0.9rem', lineHeight: 1.35 }}>
                            {getDrawbackText(fpLevel)}
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label" style={{ color: '#2C2416', fontWeight: 700, marginBottom: '6px' }}>RESOURCE ECONOMY</div>
                        <div className="gambit-management-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.86rem' }}>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#b7791f' }}>Generate FP:</strong> <span style={{ color: '#3d2e1e' }}>Free on attacks, coin tosses, card draws</span>
                            </div>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#8c2510' }}>Spend FP:</strong> <span style={{ color: '#3d2e1e' }}>Nudge d20 rolls (takes 1d4 psychic per point)</span>
                            </div>
                            <div style={{ color: '#2C2416' }}>
                                <strong style={{ color: '#8e44ad' }}>Karmic Debt:</strong> <span style={{ color: '#3d2e1e' }}>Builds from card overrides, triggers Wyrd Collapse at 13</span>
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed rgba(139, 115, 85, 0.4)', fontSize: '0.78rem', color: '#5a4632', fontStyle: 'italic' }}>
                            Click bar to open controls menu. Shift+Click pips or ticks to set directly.
                        </div>
                    )}
                </div>,
                document.body
            )}

            {/* Unified Context Controls Menu (Standard Project Warm Beige/Cream Theme) */}
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
                            <div className="context-menu-section-header">Gambit Fortune & Debt Ledger</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Fortune:</strong> {getStageName(fpLevel)} <span style={{ color: '#b7791f' }}>({fpLevel}/{maxFp} FP)</span></div>
                                <div><strong>Karmic Debt:</strong> <span style={{ color: debtLevel >= 8 ? '#c0392b' : '#8e44ad' }}>{debtLevel}/{maxDebt} Stacks (+{debtLevel * 5}% Damage Vulnerability)</span></div>
                                <div style={{ color: fpLevel === 0 ? '#b30000' : '#5a4628' }}>
                                    <strong>Risk:</strong> {getDrawbackText(fpLevel)}
                                </div>
                            </div>

                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '8px', marginBottom: '8px' }}>
                                Set Fortune (FP)
                            </div>

                            {/* Direct Jump Grid (0 to 7) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                                    <button
                                        key={lvl}
                                        className={`context-menu-button ${fpLevel === lvl ? 'active' : ''} ${lvl === 0 ? 'danger' : ''}`}
                                        onClick={() => handleFpSet(lvl)}
                                    >
                                        {lvl} FP
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleFpChange(-1)}>
                                    <i className="fas fa-minus-circle"></i>
                                    -1 FP
                                </button>
                                <button className="context-menu-button" onClick={() => handleFpChange(1)}>
                                    <i className="fas fa-plus-circle"></i>
                                    +1 FP
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                            {/* Karmic Debt Controls */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '6px' }}>
                                Karmic Debt Management
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleDebtChange(-1)}>
                                    <i className="fas fa-minus"></i> -1 Debt
                                </button>
                                <button className="context-menu-button" onClick={() => handleDebtChange(1)}>
                                    <i className="fas fa-plus"></i> +1 Debt
                                </button>
                                <button className="context-menu-button" onClick={() => handleDebtChange(2)}>
                                    <i className="fas fa-layer-group"></i> +2 Debt
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                            {/* Quick Dice Roll Actions */}
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    style={{ flex: 1, backgroundColor: '#b7791f', color: '#ffffff', fontWeight: 'bold' }}
                                    onClick={() => handleRollDice(20)}
                                >
                                    <i className="fas fa-dice-d20" style={{ marginRight: '4px' }}></i> Roll d20
                                </button>
                                <button
                                    className="context-menu-button"
                                    style={{ flex: 1, backgroundColor: '#8e44ad', color: '#ffffff', fontWeight: 'bold' }}
                                    onClick={() => handleRollDice(12)}
                                >
                                    <i className="fas fa-dice" style={{ marginRight: '4px' }}></i> Roll d12
                                </button>
                            </div>

                            {lastRollResult && (
                                <div style={{ padding: '6px', background: 'rgba(183, 121, 31, 0.1)', border: '1px solid #b7791f', borderRadius: '4px', fontSize: '0.76rem', marginBottom: '8px', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: '#b7791f' }}>
                                        d{lastRollResult.sides} = {lastRollResult.roll}
                                    </span>
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

export default GambitResourceBar;
