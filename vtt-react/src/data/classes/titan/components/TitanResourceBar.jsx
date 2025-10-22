import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/TitanResourceBar.css';

const TitanResourceBar = ({ classResource = {}, size = 'normal', config = {} }) => {
    const [localCharge, setLocalCharge] = useState(60);
    const [selectedDevotion, setSelectedDevotion] = useState('solara');
    const [selectedSpec, setSelectedSpec] = useState('celestialChampion');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isCharging, setIsCharging] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, placement: 'top' });

    const maxCharge = 100;

    // Devotion configurations - five celestial beings
    const devotionConfigs = {
        solara: {
            name: 'Solara',
            title: 'The Radiant Sun',
            baseColor: '#B8860B',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            icon: 'fa-sun',
            benefit: '+1d6 radiant damage on melee attacks',
            ultimate: 'Solar Flare: 3d8 radiant damage to all enemies within 10 ft, blind for 1 turn',
            restriction: 'Enemies have advantage on attacks against you in bright light'
        },
        lunara: {
            name: 'Lunara',
            title: 'The Moon Guardian',
            baseColor: '#4682B4',
            activeColor: '#87CEEB',
            glowColor: '#B0E0E6',
            icon: 'fa-moon',
            benefit: '+2 AC, regenerate 5 HP at start of each turn',
            ultimate: 'Lunar Shield: Absorb 50 damage for all allies within 15 ft',
            restriction: 'Healing received from external sources is halved'
        },
        astraeus: {
            name: 'Astraeus',
            title: 'The Star Sage',
            baseColor: '#6A5ACD',
            activeColor: '#9370DB',
            glowColor: '#BA55D3',
            icon: 'fa-star',
            benefit: '+10 ft movement, advantage on Dexterity saves',
            ultimate: 'Starfall: 4d6 force damage to target, stun for 1 turn',
            restriction: 'Take +1d6 damage from non-magical attacks'
        },
        terranox: {
            name: 'Terranox',
            title: 'The Earth Titan',
            baseColor: '#654321',
            activeColor: '#8B4513',
            glowColor: '#A0522D',
            icon: 'fa-mountain',
            benefit: '+3 AC, resistance to physical damage',
            ultimate: 'Earthshatter: 3d6 bludgeoning damage, knock prone all enemies within 20 ft',
            restriction: 'Movement speed reduced by 10 ft'
        },
        zephyra: {
            name: 'Zephyra',
            title: 'The Wind Spirit',
            baseColor: '#5F9EA0',
            activeColor: '#00CED1',
            glowColor: '#AFEEEE',
            icon: 'fa-wind',
            benefit: '+1 attack per turn, +1d4 lightning damage on attacks',
            ultimate: 'Tempest Strike: Teleport 30 ft, deal 3d6 lightning damage in 5 ft radius',
            restriction: 'When hit by melee attack, pushed back 5 ft'
        }
    };

    // Specialization configurations
    const specConfigs = {
        celestialChampion: {
            name: 'Celestial Champion',
            passive: 'Divine Amplification',
            passiveDesc: 'Devotion benefits increased by 50%. Ultimate abilities recharge on short rest. At 80+ charge: double flare effect when channeling divine energy.'
        },
        divineConduit: {
            name: 'Divine Conduit',
            passive: 'Balanced Channeling',
            passiveDesc: 'Devotion restrictions reduced by 50%. Can partially attune to a second devotion at 50% effectiveness. At 60+ charge: gentle dual-glow showing both devotions.'
        },
        astralWarrior: {
            name: 'Astral Warrior',
            passive: 'Combat Versatility',
            passiveDesc: 'Can switch devotions as bonus action (3 uses per long rest). Switching triggers burst effect. At devotion switch: short burst flash animation.'
        }
    };

    const currentDevotion = devotionConfigs[selectedDevotion];
    const currentSpec = specConfigs[selectedSpec];

    // Calculate visual intensity based on charge level
    const getVisualIntensity = () => {
        if (localCharge === 0) return 'dormant';
        if (localCharge <= 20) return 'faint';
        if (localCharge <= 40) return 'awakening';
        if (localCharge <= 60) return 'channeling';
        if (localCharge <= 80) return 'empowered';
        return 'divine';
    };

    const visualIntensity = getVisualIntensity();
    const percentage = (localCharge / maxCharge) * 100;

    // Auto-adjust tooltip position
    useEffect(() => {
        if (showTooltip && barRef.current && tooltipRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            let top = barRect.top - tooltipRect.height - 10;
            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let placement = 'top';

            // Check if tooltip goes off top of screen
            if (top < 10) {
                top = barRect.bottom + 10;
                placement = 'bottom';
            }

            // Check if tooltip goes off right side
            if (left + tooltipRect.width > viewportWidth - 10) {
                left = viewportWidth - tooltipRect.width - 10;
            }

            // Check if tooltip goes off left side
            if (left < 10) {
                left = 10;
            }

            setTooltipPosition({ top, left, placement });
        }
    }, [showTooltip, localCharge, selectedDevotion, selectedSpec]);

    // Simulate charging effect
    const simulateCharging = () => {
        setIsCharging(true);
        setTimeout(() => setIsCharging(false), 1000);
    };

    // Simulate devotion switch effect
    const simulateSwitch = () => {
        setIsSwitching(true);
        setTimeout(() => setIsSwitching(false), 800);
    };

    const adjustCharge = (amount) => {
        const newCharge = Math.max(0, Math.min(maxCharge, localCharge + amount));
        setLocalCharge(newCharge);
        
        if (amount > 0) {
            simulateCharging();
        }
    };

    // Cycle through devotions
    const cycleDevotion = () => {
        const devotions = Object.keys(devotionConfigs);
        const currentIndex = devotions.indexOf(selectedDevotion);
        const nextIndex = (currentIndex + 1) % devotions.length;
        setSelectedDevotion(devotions[nextIndex]);
        simulateSwitch();
    };



    return (
        <div className="titan-resource-container">
            {/* Devotion Button and Main Bar Row */}
            <div className="resource-bar-row">
                {/* Devotion Cycle Button */}
                <button
                    className="devotion-cycle-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        cycleDevotion();
                    }}
                    title={`Current: ${currentDevotion.name}\nClick to cycle`}
                    style={{
                        borderColor: currentDevotion.activeColor,
                        color: currentDevotion.glowColor,
                        boxShadow: `0 0 8px ${currentDevotion.glowColor}40`
                    }}
                >
                    <i className={`fas ${currentDevotion.icon}`}></i>
                </button>

                {/* Main Resource Bar */}
                <div
                    ref={barRef}
                    className={`titan-resource-bar ${size} ${visualIntensity} ${isCharging ? 'charging' : ''} ${isSwitching ? 'switching' : ''} ${selectedSpec === 'celestialChampion' && localCharge >= 80 ? 'champion-flare' : ''} ${selectedSpec === 'divineConduit' && localCharge >= 60 ? 'conduit-dual' : ''} clickable`}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowControls(!showControls)}
                    style={{
                        '--devotion-base-color': currentDevotion.baseColor,
                        '--devotion-active-color': currentDevotion.activeColor,
                        '--devotion-glow-color': currentDevotion.glowColor
                    }}
                >
                    {/* Celestial background pattern */}
                    <div className="celestial-background"></div>

                    {/* Divine aura overlay */}
                    <div className="divine-aura">
                        <div className="aura-particle"></div>
                        <div className="aura-particle"></div>
                        <div className="aura-particle"></div>
                    </div>

                    {/* Charge fill bar */}
                    <div 
                        className="charge-fill"
                        style={{ width: `${percentage}%` }}
                    >
                        <div className="divine-energy"></div>
                    </div>

                    {/* Devotion-specific overlay effects */}
                    {selectedDevotion === 'solara' && localCharge > 50 && (
                        <div className="radiant-rays"></div>
                    )}
                    {selectedDevotion === 'lunara' && localCharge > 50 && (
                        <div className="lunar-glow"></div>
                    )}
                    {selectedDevotion === 'astraeus' && localCharge > 50 && (
                        <div className="starlit-shimmer"></div>
                    )}
                    {selectedDevotion === 'terranox' && localCharge > 50 && (
                        <div className="earthen-pulse"></div>
                    )}
                    {selectedDevotion === 'zephyra' && localCharge > 50 && (
                        <div className="wind-swirl"></div>
                    )}

                    {/* Charge display */}
                    <div className="charge-display">
                        <span className="charge-current">{localCharge}</span>
                        <span className="charge-separator">/</span>
                        <span className="charge-max">{maxCharge}</span>
                        <span className="charge-label">Divine Charge</span>
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className={`titan-tooltip ${tooltipPosition.placement}`}
                    style={{
                        position: 'fixed',
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        zIndex: 100000
                    }}
                >
                    <div className="tooltip-header">
                        {currentDevotion.name}, {currentDevotion.title} - Divine Charge: {localCharge}/{maxCharge}
                    </div>
                    
                    <div className="tooltip-section">
                        <div className="tooltip-label">Charge Level:</div>
                        <div className="tooltip-value">
                            {localCharge === 0 && 'Dormant - No divine connection'}
                            {localCharge > 0 && localCharge <= 20 && 'Faint - Weak divine presence'}
                            {localCharge > 20 && localCharge <= 40 && 'Awakening - Divine power stirring'}
                            {localCharge > 40 && localCharge <= 60 && 'Channeling - Active divine flow'}
                            {localCharge > 60 && localCharge <= 80 && 'Empowered - Strong celestial connection'}
                            {localCharge > 80 && 'Divine - Maximum celestial favor'}
                        </div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Devotion Benefit:</div>
                        <div className="tooltip-value">{currentDevotion.benefit}</div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Ultimate Ability (1/Long Rest):</div>
                        <div className="tooltip-value">{currentDevotion.ultimate}</div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Restriction:</div>
                        <div className="tooltip-value">{currentDevotion.restriction}</div>
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Shared Passive - Celestial Attunement:</div>
                        <div className="tooltip-value">
                            Attune to one celestial being each day. Gain divine charge through combat and devotion fulfillment. Switch devotions during long rest.
                        </div>
                    </div>

                    <div className="tooltip-section spec-section">
                        <div className="tooltip-label">{currentSpec.name} - {currentSpec.passive}:</div>
                        <div className="tooltip-value">
                            {currentSpec.passiveDesc}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Dev Controls */}
            {showControls && (
                <div className="titan-dev-controls">
                    <div className="controls-header">
                        <span>Celestial Devotion System</span>
                        <button onClick={() => setShowControls(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="control-group">
                        <label>Divine Charge: {localCharge}/{maxCharge}</label>
                        <div className="charge-info">
                            Build charge through combat and devotion fulfillment. Higher charge = stronger divine connection.
                        </div>
                        <div className="button-row">
                            <button onClick={() => setLocalCharge(0)}>0</button>
                            <button onClick={() => setLocalCharge(25)}>25</button>
                            <button onClick={() => setLocalCharge(50)}>50</button>
                            <button onClick={() => setLocalCharge(75)}>75</button>
                            <button onClick={() => setLocalCharge(100)}>100</button>
                        </div>
                        <div className="button-row">
                            <button onClick={() => adjustCharge(-10)}>-10</button>
                            <button onClick={() => adjustCharge(-5)}>-5</button>
                            <button onClick={() => adjustCharge(5)}>+5</button>
                            <button onClick={() => adjustCharge(10)}>+10</button>
                        </div>
                    </div>

                    <div className="control-group">
                        <label>Active Devotion</label>
                        <div className="devotion-grid">
                            {Object.entries(devotionConfigs).map(([key, devotion]) => (
                                <button
                                    key={key}
                                    className={selectedDevotion === key ? 'active' : ''}
                                    onClick={() => {
                                        setSelectedDevotion(key);
                                        simulateSwitch();
                                    }}
                                    style={{
                                        borderColor: selectedDevotion === key ? devotion.activeColor : 'transparent',
                                        color: selectedDevotion === key ? devotion.glowColor : '#8B7355'
                                    }}
                                >
                                    <i className={`fas ${devotion.icon}`}></i>
                                    <span>{devotion.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="control-group">
                        <label>Specialization</label>
                        <div className="spec-grid">
                            {Object.entries(specConfigs).map(([key, spec]) => (
                                <button
                                    key={key}
                                    className={selectedSpec === key ? 'active' : ''}
                                    onClick={() => setSelectedSpec(key)}
                                >
                                    {spec.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TitanResourceBar;

