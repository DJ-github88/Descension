import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/TitanResourceBar.css';

const TitanResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', onClassResourceUpdate = null }) => {
    const [localCharge, setLocalCharge] = useState(60);
    const [selectedDevotion, setSelectedDevotion] = useState('solara');
    const [selectedSpec, setSelectedSpec] = useState('celestialChampion');
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isCharging, setIsCharging] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    
    const barRef = useRef(null);
    const tooltipRef = useRef(null);

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
            passiveDesc: 'Can switch devotions using action points (3 uses per long rest). Switching triggers burst effect. At devotion switch: short burst flash animation.'
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
        if (showTooltip && tooltipRef.current && barRef.current) {
            const updatePosition = () => {
                const tooltip = tooltipRef.current;
                const bar = barRef.current;
                if (!tooltip || !bar) {
                    requestAnimationFrame(updatePosition);
                    return;
                }

                const tooltipRect = tooltip.getBoundingClientRect();
                const barRect = bar.getBoundingClientRect();

                if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
                    requestAnimationFrame(updatePosition);
                    return;
                }

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const margin = 8;

                let hudContainer = bar.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                let hudBottom = barRect.bottom;

                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    hudBottom = hudRect.bottom;
                }

                const tooltipWidth = tooltipRect.width > 0 ? tooltipRect.width : 300;
                const tooltipHeight = tooltipRect.height > 0 ? tooltipRect.height : 200;

                let left = barRect.left + (barRect.width / 2) - (tooltipWidth / 2);
                let top = hudBottom + margin;

                if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                    requestAnimationFrame(updatePosition);
                }

                if (left < margin) {
                    left = margin;
                }
                if (left + tooltipWidth > viewportWidth - margin) {
                    left = viewportWidth - tooltipWidth - margin;
                }

                if (top + tooltipHeight > viewportHeight - margin) {
                    if (hudContainer) {
                        const hudRect = hudContainer.getBoundingClientRect();
                        top = hudRect.top - tooltipHeight - margin;
                    } else {
                        top = barRect.top - tooltipHeight - margin;
                    }
                    if (top < margin) {
                        top = margin;
                    }
                }

                tooltip.style.position = 'fixed';
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.transform = 'none';
                tooltip.style.zIndex = '2147483647';
                tooltip.style.borderRadius = '0';
                tooltip.style.padding = '10px 12px';
            };

            updatePosition();
            requestAnimationFrame(() => {
                requestAnimationFrame(updatePosition);
            });

            const timeoutId = setTimeout(updatePosition, 50);

            return () => clearTimeout(timeoutId);
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

    // Get chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');
    
    // Helper function to get the actor name
    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };
    
    // Helper function to log class resource changes
    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        
        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} gained ${absAmount} ${resourceName}`,
                `${characterName} acquired ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was added to ${characterName}`,
                `${characterName} received ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} spent ${absAmount} ${resourceName}`,
                `${characterName} used ${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} was consumed by ${characterName}`,
                `${characterName} expended ${absAmount} ${resourceName}`
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

    const adjustCharge = (amount) => {
        const newCharge = Math.max(0, Math.min(maxCharge, localCharge + amount));
        const actualAmount = Math.abs(newCharge - localCharge);
        setLocalCharge(newCharge);
        
        if (actualAmount > 0) {
            logClassResourceChange('Celestial Charge', actualAmount, amount > 0, 'celestialCharge');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newCharge);
        }
        
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
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip">
                    <div className="tooltip-header">Celestial Devotion</div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current:</strong> {localCharge}/100 Charge
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            <strong>Devotion:</strong> {currentDevotion.name} ({currentDevotion.title})
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Devotion Benefit</div>
                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                            {currentDevotion.benefit}
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Charge Management</div>
                        <div className="level-management">
                            <strong>Gain:</strong>
                            <span>Channel divine energy (varies by action)</span>
                            <strong>Spend:</strong>
                            <span>Ultimate abilities, devotion switches</span>
                        </div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">{currentSpec.passive} ({currentSpec.name})</div>
                        <div className="passive-desc">
                            {currentSpec.passiveDesc}
                        </div>
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
                                <button onClick={() => {
                                    const resetAmount = localCharge;
                                    setLocalCharge(0);
                                    if (resetAmount > 0) {
                                        logClassResourceChange('Celestial Charge', resetAmount, false, 'celestialCharge');
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }
                                }}>0</button>
                                <button onClick={() => {
                                    const newValue = 50;
                                    const amount = Math.abs(newValue - localCharge);
                                    setLocalCharge(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Celestial Charge', amount, newValue > localCharge, 'celestialCharge');
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                    }
                                }}>50</button>
                                <button onClick={() => {
                                    const newValue = 100;
                                    const amount = Math.abs(newValue - localCharge);
                                    setLocalCharge(newValue);
                                    if (amount > 0) {
                                        logClassResourceChange('Celestial Charge', amount, newValue > localCharge, 'celestialCharge');
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
                                    }
                                }}>100</button>
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

