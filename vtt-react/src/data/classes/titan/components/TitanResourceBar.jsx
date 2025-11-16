import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../styles/TitanResourceBar.css';

const TitanResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud' }) => {
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
            benefit: '+2 armor, regenerate 5 HP at start of each turn',
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
            benefit: '+3 armor, resistance to physical damage',
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
        <div className={`titan-resource-container ${size}`}>
            {/* Main Resource Bar Row */}
            <div className="resource-bar-row">
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
                    <div className="tooltip-content">
                        <div className="tooltip-devotion">{currentDevotion.name}</div>
                        <div className="tooltip-stage">
                            {localCharge === 0 && 'Dormant - No divine connection'}
                            {localCharge > 0 && localCharge <= 20 && 'Faint - Weak divine presence'}
                            {localCharge > 20 && localCharge <= 40 && 'Awakening - Divine power stirring'}
                            {localCharge > 40 && localCharge <= 60 && 'Channeling - Active divine flow'}
                            {localCharge > 60 && localCharge <= 80 && 'Empowered - Strong celestial connection'}
                            {localCharge > 80 && 'Divine - Maximum celestial favor'}
                        </div>
                        <div className="tooltip-benefit">{currentDevotion.benefit}</div>
                    </div>
                </div>,
                document.body
            )}

            {/* Dev Controls */}
            {showControls && (
                <div className="titan-dev-controls">
                    {/* Compact Header */}
                    <div className="controls-header">
                        <span>Devotion Controls</span>
                        <button onClick={() => setShowControls(false)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Charge Controls */}
                    <div className="control-group charge-controls">
                        <div className="charge-buttons">
                            <div className="preset-buttons-row">
                                <button onClick={() => setLocalCharge(0)}>0</button>
                                <button onClick={() => setLocalCharge(50)}>50</button>
                                <button onClick={() => setLocalCharge(100)}>100</button>
                            </div>
                            <div className="adjust-buttons-row">
                                <button onClick={() => adjustCharge(-10)}>-10</button>
                                <button onClick={() => adjustCharge(10)}>+10</button>
                            </div>
                        </div>
                    </div>

                    {/* Devotion Selector */}
                    <div className="control-group devotion-selector">
                        <div className="devotion-buttons">
                            {Object.entries(devotionConfigs).map(([key, devotion]) => (
                                <button
                                    key={key}
                                    className={`devotion-btn ${selectedDevotion === key ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedDevotion(key);
                                        simulateSwitch();
                                    }}
                                    title={devotion.name}
                                >
                                    <i className={`fas ${devotion.icon}`}></i>
                                </button>
                            ))}
                        </div>
                        {/* Specialization Selector */}
                        <div className="spec-buttons">
                            {Object.entries(specConfigs).map(([key, spec]) => (
                                <button
                                    key={key}
                                    className={`spec-btn ${selectedSpec === key ? 'active' : ''}`}
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

