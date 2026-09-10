import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/GambitResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';

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
    0: 'Cosmic Bankruptcy: 2d10 blight, 100% vulnerability for 2 rounds, no Fortune generation',
    1: 'Calculated Risk: 1d4 wyrd self-damage per FP spent to nudge',
    2: 'Calculated Risk: 1d4 wyrd self-damage per FP spent to nudge',
    3: 'Calculated Risk: 1d4 wyrd per FP spent. Debtor\'s Tax applies while Strapped.',
    4: 'Calculated Risk: 1d4 wyrd per FP spent.',
    5: 'Calculated Risk: 1d4 wyrd per FP spent.',
    6: 'Calculated Risk: 1d4 wyrd per FP spent.',
    7: 'All-In: 1d4 wyrd per FP spent. One bad roll from Bust.'
};

const ROMAN_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

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
    const [hoverSection, setHoverSection] = useState('fp'); // 'fp', 'debt', or 'core'
    const [hoveredCoin, setHoveredCoin] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
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
                `${characterName} spent ${absAmount} ${resourceName} to nudge probability (${absAmount}d4 wyrd damage)`,
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
        if (level <= 6) return `Modify rolls by up to ±${level} FP`;
        return 'Modify rolls by up to ±7 FP • All-In';
    };

    // Coin coordinates (Left Flank: 7 massive doubloons in 2 staggered rows)
    // Row 1 (I-IV, y=24) and Row 2 (V-VII, y=52)
    const COIN_COORDS = [
        { x: 26, y: 24 }, // I
        { x: 52, y: 24 }, // II
        { x: 78, y: 24 }, // III
        { x: 104, y: 24 }, // IV
        { x: 39, y: 52 }, // V
        { x: 65, y: 52 }, // VI
        { x: 91, y: 52 }  // VII
    ];

    // Debt Card Coordinates (Right Flank: 2x6 grid of cards + tall 13th Calamity Card)
    // Tier 1 (1-6, y=24), Tier 2 (7-12, y=52), and Card XIII (13, full height y=38)
    const DEBT_CARD_COORDS = [
        // Row 1: Stacks 1 to 6 (y=24)
        { x: 177, y: 24, w: 11, h: 22 }, // 1
        { x: 192, y: 24, w: 11, h: 22 }, // 2
        { x: 207, y: 24, w: 11, h: 22 }, // 3
        { x: 222, y: 24, w: 11, h: 22 }, // 4
        { x: 237, y: 24, w: 11, h: 22 }, // 5
        { x: 252, y: 24, w: 11, h: 22 }, // 6

        // Row 2: Stacks 7 to 12 (y=52)
        { x: 177, y: 52, w: 11, h: 22 }, // 7
        { x: 192, y: 52, w: 11, h: 22 }, // 8
        { x: 207, y: 52, w: 11, h: 22 }, // 9
        { x: 222, y: 52, w: 11, h: 22 }, // 10
        { x: 237, y: 52, w: 11, h: 22 }, // 11
        { x: 252, y: 52, w: 11, h: 22 }, // 12

        // Card XIII: The Grand Calamity Tarot Card (Spanning full height, y=38)
        { x: 270, y: 38, w: 14, h: 50, isCalamity: true } // 13
    ];

    const isBust = fpLevel === 0;
    const isNearCollapse = debtLevel >= 12;

    return (
        <div className={`gambit-resource-wrapper ${size} ${context === 'party' ? 'party-context' : ''} ${isBust ? 'bust-active' : ''} ${isNearCollapse ? 'collapse-active' : ''}`}>
            {/* Main Pure Vector Apparatus */}
            <div
                ref={barRef}
                className="gambit-resource-bar gambit-dual-bar-container class-resource-bar clickable"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => {
                    setShowTooltip(false);
                    setHoveredCoin(null);
                    setHoveredCard(null);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                <svg
                    className="gambit-master-svg"
                    viewBox="0 0 292 76"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label={`Gambit Casino Tableau - Fortune ${fpLevel} of 7, Debt ${debtLevel} of 13`}
                >
                    <defs>
                        {/* Shaders and Gradients */}
                        <linearGradient id="gambitMahogany" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3d2314" />
                            <stop offset="35%" stopColor="#29160a" />
                            <stop offset="70%" stopColor="#1a0e06" />
                            <stop offset="100%" stopColor="#0d0602" />
                        </linearGradient>

                        <linearGradient id="gambitBaizeGreen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0f341e" />
                            <stop offset="40%" stopColor="#0a2314" />
                            <stop offset="85%" stopColor="#06160c" />
                            <stop offset="100%" stopColor="#030c07" />
                        </linearGradient>

                        <linearGradient id="gambitBrassTrim" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ffe9a8" />
                            <stop offset="30%" stopColor="#c9962e" />
                            <stop offset="65%" stopColor="#8c6414" />
                            <stop offset="85%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#634509" />
                        </linearGradient>

                        <radialGradient id="gambitGoldCoin" cx="35%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#fff8db" />
                            <stop offset="30%" stopColor="#ffd700" />
                            <stop offset="75%" stopColor="#d49b00" />
                            <stop offset="100%" stopColor="#805900" />
                        </radialGradient>

                        <linearGradient id="gambitCrimsonCard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ff8a7a" />
                            <stop offset="35%" stopColor="#c0392b" />
                            <stop offset="75%" stopColor="#78181a" />
                            <stop offset="100%" stopColor="#45080c" />
                        </linearGradient>

                        <radialGradient id="gambitCenterDie" cx="40%" cy="35%" r="65%">
                            <stop offset="0%" stopColor="#fff2c2" />
                            <stop offset="40%" stopColor="#d4af37" />
                            <stop offset="80%" stopColor="#7a5a12" />
                            <stop offset="100%" stopColor="#3d2a05" />
                        </radialGradient>

                        {/* Glow Filters */}
                        <filter id="gambitGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.8" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="gambitCrimsonGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2.0" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Chassis Base Plate: Dark Mahogany Table */}
                    <rect
                        x="1.5"
                        y="1.5"
                        width="289"
                        height="73"
                        rx="6"
                        fill="url(#gambitMahogany)"
                        stroke="url(#gambitBrassTrim)"
                        strokeWidth="1.6"
                        className="gambit-chassis-base"
                    />

                    {/* Casino Baize Green Felt Inset */}
                    <rect
                        x="3.5"
                        y="3.5"
                        width="285"
                        height="69"
                        rx="4.5"
                        fill="url(#gambitBaizeGreen)"
                        stroke="rgba(212, 175, 55, 0.45)"
                        strokeWidth="1.0"
                        pointerEvents="none"
                    />

                    {/* Corner Brass Brackets & Rivets */}
                    <g pointerEvents="none">
                        <polygon points="4,4 16,4 4,16" fill="url(#gambitBrassTrim)" />
                        <polygon points="288,4 276,4 288,16" fill="url(#gambitBrassTrim)" />
                        <polygon points="4,72 16,72 4,60" fill="url(#gambitBrassTrim)" />
                        <polygon points="288,72 276,72 288,60" fill="url(#gambitBrassTrim)" />
                        <circle cx="7.5" cy="7.5" r="1.2" fill="#fff5cc" />
                        <circle cx="284.5" cy="7.5" r="1.2" fill="#fff5cc" />
                        <circle cx="7.5" cy="68.5" r="1.2" fill="#fff5cc" />
                        <circle cx="284.5" cy="68.5" r="1.2" fill="#fff5cc" />
                    </g>

                    {/* Brass Rail Conduits behind coins & cards */}
                    <line x1="16" y1="24" x2="116" y2="24" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="1.2" />
                    <line x1="16" y1="52" x2="116" y2="52" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="1.2" />
                    <line x1="172" y1="24" x2="258" y2="24" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="1.2" />
                    <line x1="172" y1="52" x2="258" y2="52" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="1.2" />
                    <line x1="172" y1="38" x2="258" y2="38" stroke="rgba(212, 175, 55, 0.45)" strokeWidth="1.0" strokeDasharray="3 3" />

                    {/* ========================================================= */}
                    {/* LEFT FLANK: 7 LARGE GILDED FORTUNE COINS (I to VII)        */}
                    {/* ========================================================= */}
                    {Array.from({ length: maxFp }, (_, idx) => {
                        const coinNum = idx + 1;
                        const { x: cx, y: cy } = COIN_COORDS[idx];
                        const isFilled = fpLevel >= coinNum;
                        const isHovered = hoveredCoin === coinNum;

                        return (
                            <g
                                key={`coin-${coinNum}`}
                                className={`gambit-coin-slot slot-${coinNum} ${isFilled ? 'filled' : 'empty'} ${isHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => {
                                    setHoverSection('fp');
                                    setHoveredCoin(coinNum);
                                }}
                                onMouseLeave={() => setHoveredCoin(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isOwner) return;
                                    if (fpLevel === coinNum) {
                                        handleFpSet(coinNum - 1);
                                    } else {
                                        handleFpSet(coinNum);
                                    }
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isOwner) return;
                                    handleFpChange(-1);
                                }}
                                style={{ cursor: isOwner ? 'pointer' : 'default' }}
                            >
                                {/* Generous Hit area */}
                                <circle cx={cx} cy={cy} r="13" fill="transparent" pointerEvents="all" />

                                {/* Outer Knurled Brass Bezel Ring */}
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r="11.5"
                                    fill={isFilled ? "#1f1406" : "#0a180f"}
                                    stroke={isFilled ? "#ffe9a8" : "rgba(212, 175, 55, 0.75)"}
                                    strokeWidth={isFilled ? "1.4" : "1.1"}
                                    className="gambit-coin-bezel"
                                    pointerEvents="none"
                                />

                                {/* Knurl teeth marks around coin edge */}
                                {Array.from({ length: 8 }, (_, t) => {
                                    const ang = (t * 45 * Math.PI) / 180;
                                    const x1 = cx + 9.5 * Math.cos(ang);
                                    const y1 = cy + 9.5 * Math.sin(ang);
                                    const x2 = cx + 11.5 * Math.cos(ang);
                                    const y2 = cy + 11.5 * Math.sin(ang);
                                    return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke={isFilled ? "#ffe9a8" : "rgba(255, 233, 168, 0.55)"} strokeWidth="0.8" pointerEvents="none" />;
                                })}

                                {/* Heavy Gold Coin Disc */}
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r="9.6"
                                    fill={isFilled ? "url(#gambitGoldCoin)" : "rgba(14, 26, 18, 0.9)"}
                                    stroke={isFilled ? "#ffffff" : "rgba(212, 175, 55, 0.45)"}
                                    strokeWidth={isFilled ? "1.0" : "0.6"}
                                    filter={isFilled ? "url(#gambitGoldGlow)" : undefined}
                                    className="gambit-coin-disc"
                                    pointerEvents="none"
                                />

                                {/* Embossed Roman Numeral on Coin Face */}
                                <text
                                    x={cx}
                                    y={cy + 3.2}
                                    textAnchor="middle"
                                    fill={isFilled ? "#452f00" : "rgba(255, 233, 168, 0.65)"}
                                    fontSize="8.6"
                                    fontFamily="'Cinzel', serif"
                                    fontWeight="900"
                                    letterSpacing="0.2"
                                    pointerEvents="none"
                                >
                                    {ROMAN_NUMERALS[coinNum]}
                                </text>
                            </g>
                        );
                    })}

                    {/* ========================================================= */}
                    {/* CENTERPIECE: GILDED FATE WHEEL / CARD SHOE & D20 DIE     */}
                    {/* ========================================================= */}
                    <g
                        className="gambit-centerpiece"
                        onMouseEnter={() => setHoverSection('core')}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) {
                                handleRollDice(20);
                            }
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        title="Click to roll d20 on the Fate Table!"
                    >
                        {/* Outer Brass Roulette Bezel */}
                        <circle cx="146" cy="38" r="26.5" fill="none" stroke="rgba(212, 175, 55, 0.7)" strokeWidth="1.2" strokeDasharray="4 2" />
                        {Array.from({ length: 12 }, (_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const x1 = 146 + 24 * Math.cos(angle);
                            const y1 = 38 + 24 * Math.sin(angle);
                            const x2 = 146 + 27 * Math.cos(angle);
                            const y2 = 38 + 27 * Math.sin(angle);
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd700" strokeWidth="1.1" />;
                        })}

                        {/* Center Medallion Plate */}
                        <circle
                            cx="146"
                            cy="38"
                            r="22.5"
                            fill={isBust ? "#45080c" : isNearCollapse ? "#5c1015" : "url(#gambitCenterDie)"}
                            stroke={isBust || isNearCollapse ? "#ff4d4d" : "#ffe9a8"}
                            strokeWidth="1.6"
                            filter={isBust || isNearCollapse ? "url(#gambitCrimsonGlow)" : "url(#gambitGoldGlow)"}
                            className="gambit-center-disc"
                        />

                        {/* Medallion Display Text */}
                        {isBust ? (
                            <>
                                <text x="146" y="35" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontFamily="'Cinzel', serif" fontWeight="900" letterSpacing="0.6" pointerEvents="none">
                                    BUST
                                </text>
                                <text x="146" y="44" textAnchor="middle" fill="#ffb4b4" fontSize="6.5" fontFamily="'Cinzel', serif" fontWeight="800" pointerEvents="none">
                                    0 FP
                                </text>
                            </>
                        ) : isNearCollapse ? (
                            <>
                                <text x="146" y="35" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontFamily="'Cinzel', serif" fontWeight="900" letterSpacing="0.4" pointerEvents="none">
                                    WYRD
                                </text>
                                <text x="146" y="44" textAnchor="middle" fill="#ffb4b4" fontSize="6.5" fontFamily="'Cinzel', serif" fontWeight="800" pointerEvents="none">
                                    COLLAPSE
                                </text>
                            </>
                        ) : lastRollResult ? (
                            <>
                                <text x="146" y="33.5" textAnchor="middle" fill="#2d1c00" fontSize="7.5" fontFamily="'Cinzel', serif" fontWeight="800" pointerEvents="none">
                                    d{lastRollResult.sides}
                                </text>
                                <text x="146" y="47" textAnchor="middle" fill="#2d1c00" fontSize="14" fontFamily="'Cinzel', serif" fontWeight="900" pointerEvents="none">
                                    {lastRollResult.roll}
                                </text>
                            </>
                        ) : (
                            <>
                                <text x="146" y="36" textAnchor="middle" fill="#2d1c00" fontSize="11" fontFamily="'Cinzel', serif" fontWeight="900" pointerEvents="none">
                                    d20
                                </text>
                                <text x="146" y="45" textAnchor="middle" fill="#4a3000" fontSize="6.5" fontFamily="'Cinzel', serif" fontWeight="800" letterSpacing="0.8" pointerEvents="none">
                                    WAGER
                                </text>
                            </>
                        )}
                    </g>

                    {/* ========================================================= */}
                    {/* RIGHT FLANK: 12 CARDS (2x6 GRID) + CARD XIII (CALAMITY)  */}
                    {/* ========================================================= */}
                    {DEBT_CARD_COORDS.map((card, idx) => {
                        const debtNum = idx + 1;
                        const { x: cx, y: cy, w, h, isCalamity } = card;
                        const isFilled = debtLevel >= debtNum;
                        const isDanger = debtNum >= 12;
                        const isHovered = hoveredCard === debtNum;

                        return (
                            <g
                                key={`debt-${debtNum}`}
                                className={`gambit-debt-card slot-${debtNum} ${isFilled ? 'filled' : 'empty'} ${isDanger ? 'danger' : ''} ${isCalamity ? 'calamity-card' : ''} ${isHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => {
                                    setHoverSection('debt');
                                    setHoveredCard(debtNum);
                                }}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isOwner) return;
                                    if (debtLevel === debtNum) {
                                        handleDebtSet(debtNum - 1);
                                    } else {
                                        handleDebtSet(debtNum);
                                    }
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isOwner) return;
                                    handleDebtChange(-1);
                                }}
                                style={{ cursor: isOwner ? 'pointer' : 'default' }}
                            >
                                {/* Hit area */}
                                <rect
                                    x={cx - w / 2 - 2}
                                    y={cy - h / 2 - 2}
                                    width={w + 4}
                                    height={h + 4}
                                    fill="transparent"
                                    pointerEvents="all"
                                />

                                {/* Card Body Plate */}
                                <rect
                                    x={cx - w / 2}
                                    y={cy - h / 2}
                                    width={w}
                                    height={h}
                                    rx={isCalamity ? "2.4" : "1.8"}
                                    fill={isFilled ? (isDanger ? "#991b1b" : "url(#gambitCrimsonCard)") : (isCalamity ? "rgba(22, 6, 8, 0.95)" : "rgba(14, 8, 8, 0.9)")}
                                    stroke={isFilled ? (isDanger ? "#ffffff" : "#ff8a7a") : (isCalamity ? "rgba(231, 76, 60, 0.85)" : "rgba(212, 175, 55, 0.7)")}
                                    strokeWidth={isFilled ? (isDanger ? "1.4" : "1.1") : (isCalamity ? "1.2" : "0.9")}
                                    filter={isFilled ? "url(#gambitCrimsonGlow)" : undefined}
                                    className={`gambit-card-body ${isCalamity ? 'calamity-body' : ''}`}
                                    pointerEvents="none"
                                />

                                {isCalamity ? (
                                    /* Card XIII: The Grand Calamity Tarot Card */
                                    <g pointerEvents="none">
                                        {/* Top Title XIII */}
                                        <text
                                            x={cx}
                                            y={cy - 14}
                                            textAnchor="middle"
                                            fill={isFilled ? "#ffffff" : "rgba(255, 233, 168, 0.75)"}
                                            fontSize="5.5"
                                            fontFamily="'Cinzel', serif"
                                            fontWeight="900"
                                            letterSpacing="0.4"
                                        >
                                            XIII
                                        </text>

                                        {/* Center Skull / Wyrd Seal */}
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r="3.4"
                                            fill={isFilled ? "#ffffff" : "none"}
                                            stroke={isFilled ? "#991b1b" : "rgba(231, 76, 60, 0.85)"}
                                            strokeWidth="0.9"
                                        />
                                        <circle
                                            cx={cx - 1.1}
                                            cy={cy - 0.5}
                                            r="0.7"
                                            fill={isFilled ? "#991b1b" : "rgba(255, 233, 168, 0.75)"}
                                        />
                                        <circle
                                            cx={cx + 1.1}
                                            cy={cy - 0.5}
                                            r="0.7"
                                            fill={isFilled ? "#991b1b" : "rgba(255, 233, 168, 0.75)"}
                                        />

                                        {/* Bottom Label WYRD */}
                                        <text
                                            x={cx}
                                            y={cy + 18}
                                            textAnchor="middle"
                                            fill={isFilled ? "#ffb4b4" : "rgba(231, 76, 60, 0.85)"}
                                            fontSize="4.8"
                                            fontFamily="'Cinzel', serif"
                                            fontWeight="800"
                                            letterSpacing="0.6"
                                        >
                                            WYRD
                                        </text>
                                    </g>
                                ) : (
                                    /* Cards 1 to 12: Elegant Miniature Tarot Cards */
                                    <g pointerEvents="none">
                                        {/* Card Inset Spine / Symbol */}
                                        <line
                                            x1={cx}
                                            y1={cy - 7}
                                            x2={cx}
                                            y2={cy + 7}
                                            stroke={isFilled ? (isDanger ? "#ffffff" : "#ffe4e6") : "rgba(255, 233, 168, 0.45)"}
                                            strokeWidth="0.8"
                                            strokeDasharray="2 1.5"
                                        />

                                        {/* Center Diamond Pip */}
                                        <polygon
                                            points={`${cx},${cy - 3} ${cx + 2.2},${cy} ${cx},${cy + 3} ${cx - 2.2},${cy}`}
                                            fill={isFilled ? (isDanger ? "#ffffff" : "#ffccd2") : "rgba(255, 233, 168, 0.6)"}
                                        />

                                        {isDanger && isFilled && (
                                            <circle cx={cx} cy={cy} r="1.3" fill="#ffffff" />
                                        )}
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Shared ClassTip Tooltip (Mechanic / Right now / Use) */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip gambit-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    {hoverSection === 'debt' ? (
                        <ClassTip
                            icon="fas fa-scale-balanced"
                            tint="#a855f7"
                            title="Karmic Debt"
                            subtitle="Gambit Karmic Ledger"
                            state={`${debtLevel}/${maxDebt} · +${debtLevel * 5}% damage taken`}
                            stateTone={debtLevel >= 12 ? 'bad' : debtLevel >= 8 ? 'warn' : 'neutral'}
                            mechanic={`Card overrides and forced fate build Karmic Debt: each stack adds +5% damage taken and 1d4 wyrd strain at end of round. At 13, Wyrd Collapse hits for 6d10 irreducible wyrd, incapacitates you 1 round, empties your Fortune, and costs 5 max HP until a long rest.`}
                            status={[
                                debtLevel >= 12
                                    ? { text: 'One override from Wyrd Collapse — clear debt immediately!', tone: 'critical' }
                                    : debtLevel >= 8
                                        ? { text: `${debtLevel} stacks — +${debtLevel * 5}% damage taken, 1d4 wyrd per round.`, tone: 'warn' }
                                        : debtLevel > 0
                                            ? `${debtLevel} stacks — +${debtLevel * 5}% damage taken, 1d4 wyrd per round.`
                                            : 'Clean ledger — card overrides cost nothing yet.',
                            ]}
                            usage={isOwner ? 'Click a card slot to set · Right-click -1 · Center die rolls d20.' : null}
                        />
                    ) : (
                        <ClassTip
                            icon="fas fa-coins"
                            tint="#eab308"
                            title={getStageName(fpLevel)}
                            subtitle="Gambit Fortune Points"
                            state={`${fpLevel}/${maxFp} FP`}
                            stateTone={fpLevel === 0 ? 'bad' : 'good'}
                            mechanic={`Bank FP from gambler spells and lucky outcomes. Spend it to nudge any d20 by ±1 per point; each point spent deals 1d4 wyrd self-damage. ${getBonusText(fpLevel)}.`}
                            status={[
                                fpLevel === 0
                                    ? { text: 'BUST — no nudges available. Bank FP before risking big rolls.', tone: 'bad' }
                                    : `${fpLevel} FP banked — can nudge rolls by up to ±${Math.min(fpLevel, 7)}.`,
                                'Karmic Debt vulnerability comes from overrides, not from holding FP.',
                            ]}
                            usage={isOwner ? 'Click a coin to set · Right-click -1 · Center die rolls d20.' : null}
                        />
                    )}
                </div>,
                document.body
            )}

            {/* Unified Context Controls Drawer (Pathfinder Warm Beige/Parchment Theme) */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container gambit-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000,
                        maxWidth: '310px',
                        width: '100%'
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Gambit Fortune & Debt Ledger</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Fortune:</strong> {getStageName(fpLevel)} <span style={{ color: '#fef08a' }}>({fpLevel}/{maxFp} FP)</span></div>
                                <div><strong>Karmic Debt:</strong> <span style={{ color: debtLevel >= 8 ? '#f87171' : '#fef08a' }}>{debtLevel}/{maxDebt} Stacks (+{debtLevel * 5}% Damage Vulnerability)</span></div>
                                <div style={{ color: fpLevel === 0 ? '#f87171' : 'var(--crm-text-dim, #cbd5e1)' }}>
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
                                    style={{ flex: 1, backgroundColor: '#ca8a04', color: '#ffffff', fontWeight: 'bold' }}
                                    onClick={() => handleRollDice(20)}
                                >
                                    <i className="fas fa-dice-d20" style={{ marginRight: '4px' }}></i> Roll d20
                                </button>
                                <button
                                    className="context-menu-button"
                                    style={{ flex: 1, backgroundColor: '#4d7c0f', color: '#ffffff', fontWeight: 'bold' }}
                                    onClick={() => handleRollDice(12)}
                                >
                                    <i className="fas fa-dice" style={{ marginRight: '4px' }}></i> Roll d12
                                </button>
                            </div>

                            {lastRollResult && (
                                <div style={{ padding: '6px', background: 'rgba(202, 138, 4, 0.12)', border: '1px solid #ca8a04', borderRadius: '4px', fontSize: '0.76rem', marginBottom: '8px', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: '#fef08a' }}>
                                        d{lastRollResult.sides} = {lastRollResult.roll}
                                    </span>
                                </div>
                            )}

                            <button className="context-menu-button danger" onClick={() => setShowControls(false)} style={{ width: '100%', marginTop: '6px' }}>
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
