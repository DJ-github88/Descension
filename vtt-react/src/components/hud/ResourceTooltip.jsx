import React from 'react';
import ReactDOM from 'react-dom';
import TooltipPortal from '../tooltips/TooltipPortal';

const ResourceTooltip = ({
  finalConfig,
  modifiedConfig,
  finalClassResource,
  showTooltip,
  chaosWeaverHoverSection,
  activeSpecialization,
  animistHoverSection,
  tooltipRef,
}) => {
  const isArcanoneer = finalConfig.visual.type === 'elemental-spheres';
  const isMartyr = finalConfig.visual?.type === 'devotion-gauge';
  const isAugur = finalConfig.visual?.type === 'dual-omen';

    const getRageState = (rageValue) => {
        if (rageValue > 100) return 'Obliteration';
        if (rageValue >= 81) return 'Cataclysm';
        if (rageValue >= 61) return 'Carnage';
        if (rageValue >= 41) return 'Primal';
        if (rageValue >= 21) return 'Frenzied';
        return 'Smoldering';
    };

    // Render tooltip (following item tooltip pattern)
    const renderTooltip = () => {
        // Classes that handle their own tooltips don't need finalConfig.tooltip
        const handlesOwnTooltips = finalConfig.visual?.type === 'musical-notes-combo' ||
            finalConfig.visual?.type === 'time-shards-strain' ||
            finalConfig.visual?.type === 'mayhem-gauge' ||
            finalConfig.visual?.type === 'ascension-blood' ||
            finalConfig.visual?.type === 'hexbreaker-charges' ||
            finalConfig.visual?.type === 'madness-gauge' ||
            finalConfig.visual?.type === 'threads-of-destiny' ||
            finalConfig.visual?.type === 'fortune-points-gambling' ||
            finalConfig.visual?.type === 'quarry-marks-companion' ||
            finalConfig.visual?.type === 'lunar-phases' ||
            finalConfig.visual?.type === 'virulence-bar' ||
            finalConfig.visual?.type === 'dual-resource' ||
            finalConfig.visual?.type === 'vengeance-points' ||
            finalConfig.visual?.type === 'ancestral-resonance' ||
            finalConfig.visual?.type === 'dual-omen' ||
            finalConfig.visual?.type === 'inferno-veil' ||
            finalConfig.visual?.type === 'arcane-absorption' ||
            finalConfig.visual?.type === 'devotion-gauge' ||
            finalConfig.visual?.type === 'elemental-spheres';

        // Hide tooltip when menus are open to prevent conflicts
        if (false) return null; // Placeholder: was showWIMenu

        if (!showTooltip) return null;
        if (!handlesOwnTooltips && !finalConfig.tooltip) return null;

        const sphereCount = finalClassResource.spheres?.length || 0;
        const rageState = modifiedConfig.type === 'rage' ? getRageState(finalClassResource.current) : '';

        // Skip tooltip title replacement for classes that handle their own tooltips
        const tooltipTitle = modifiedConfig.tooltip?.title
            ? modifiedConfig.tooltip.title
                .replace('{current}', finalClassResource.current)
                .replace('{max}', finalClassResource.max)
                .replace('{count}', sphereCount)
                .replace('{state}', rageState)
                .replace('{stacks}', finalClassResource.stacks?.length || 0)
                .replace('{risk}', finalClassResource.risk || 0)
                .replace('{volatility}', finalClassResource.volatility || 0)
            : '';

        // Calculate sphere breakdown for Arcanoneer
        const sphereBreakdown = {};
        if (modifiedConfig.type === 'spheres' && finalClassResource.spheres) {
            finalClassResource.spheres.forEach(elementId => {
                const element = finalConfig.elements?.find(el => el.id === elementId);
                if (element) {
                    sphereBreakdown[element.name] = (sphereBreakdown[element.name] || 0) + 1;
                }
            });
        }

        // Check if there's any content to show in the tooltip
        const hasTooltipContent =
            (modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-gauge' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'ancestral-resonance' && modifiedConfig.visual?.type !== 'dual-omen' && modifiedConfig.visual?.type !== 'inferno-veil' && modifiedConfig.visual?.type !== 'arcane-absorption' && modifiedConfig.visual?.type !== 'devotion-gauge' && modifiedConfig.visual?.type !== 'lunar-phases' && modifiedConfig.visual?.type !== 'elemental-spheres' && modifiedConfig.tooltip?.description) ||
            (finalConfig.type === 'spheres') ||
            (finalConfig.type === 'dual-resource' && shaperHoverSection) ||
            (finalConfig.visual?.type === 'time-shards-strain' && chronarchHoverSection) ||
            (finalConfig.visual?.type === 'hexbreaker-charges' && covenbaneHoverSection) ||
            (finalConfig.visual?.type === 'ascension-blood' && deathcallerHoverSection) ||
            (finalConfig.visual?.type === 'madness-gauge' && falseProphetHoverSection === 'madness') ||
            (finalConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection) ||
            (finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp') ||
            (finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection) ||
            (finalConfig.visual?.type === 'lunar-phases' && lunarchHoverSection) ||
            (finalConfig.visual?.type === 'mayhem-gauge' && chaosWeaverHoverSection) ||
            (finalConfig.visual?.type === 'ancestral-resonance' && animistHoverSection === 'resonance') ||
            (finalConfig.visual?.type === 'musical-notes-combo' && minstrelHoverSection && minstrelHoverSection.startsWith('note-')) ||
            (finalConfig.type === 'rage' && finalConfig.rageStates);

        if (!hasTooltipContent) {
            return null;
        }

        return (
            <TooltipPortal>
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    {modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-modifiers' && modifiedConfig.visual?.type !== 'mayhem-gauge' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'drp-resilience' && modifiedConfig.visual?.type !== 'dominance-die' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'prophetic-visions' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'eternal-frost-phylactery' && modifiedConfig.visual?.type !== 'ancestral-resonance' && modifiedConfig.tooltip?.description && (
                        <>
                            <div className="tooltip-header">{tooltipTitle || modifiedConfig.visual?.name || 'Class Resource'}</div>
                            <div className="tooltip-section">
                                {modifiedConfig.tooltip.description}
                            </div>
                        </>
                    )}

                    {/* Simple sphere count */}
                    {finalConfig.type === 'spheres' && (
                        <>
                            <div className="tooltip-header">Elemental Spheres</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Banked:</strong> {sphereCount} sphere{sphereCount !== 1 ? 's' : ''} / {finalConfig.mechanics?.max || 12}
                                </div>
                                {sphereCount > 0 && (
                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                        {Object.entries(sphereBreakdown).map(([name, count]) => (
                                            <div key={name}>{name}: {count}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Sphere Management</div>
                                <div className="level-management">
                                    <strong>Generate:</strong>
                                    <span>Roll {activeSpecialization === 'entropy-weaver' ? '5d8' : '4d8'} each turn</span>
                                    <strong>Combine:</strong>
                                    <span>Spend matching spheres to cast spells</span>
                                    <strong>Bank Cap:</strong>
                                    <span>{activeSpecialization === 'sphere-architect' ? 15 : 12} spheres max</span>
                                    <strong>Add:</strong>
                                    <span>Left-click an element orb</span>
                                    <strong>Remove:</strong>
                                    <span>Right-click an active orb</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Shaper Tooltips */}
                    {finalConfig.type === 'dual-resource' && shaperHoverSection && (
                        <div>
                            {shaperHoverSection === 'momentum' && (
                                <>
                                    <div className="tooltip-header">Momentum</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {shaperMomentum}/20
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Momentum Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>+1 on hit, +2 on max damage die (crit), +1 on dodge/parry</span>
                                            <strong>Spend:</strong>
                                            <span>2-4 for stance transitions, 3-6 for abilities</span>
                                            <strong>Decay:</strong>
                                            <span>-1 on lowest damage die (miss), -1 when taking damage</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {shaperHoverSection === 'flourish' && (
                                <>
                                    <div className="tooltip-header">Flourish</div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {shaperFlourish}/5
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Flourish Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>+1 per signature move (each stance has 1 signature move)</span>
                                            <strong>Spend:</strong>
                                            <span>2-5 for ultimate abilities</span>
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(101, 67, 33, 0.8)' }}>
                                            Does not decay - persists between combats
                                        </div>
                                    </div>
                                </>
                            )}

                            {shaperHoverSection === 'stance' && (() => {
                                const stances = finalConfig.visual?.stances || {};
                                const currentStanceData = stances[stanceValue] || {};
                                const details = {
                                    'Ataxic Flow': {
                                        bonuses: ['+2 dodge', '+10 ft movement', 'Advantage on Disengage'],
                                        penalties: ['No offensive bonuses']
                                    },
                                    'Arterial Strike': {
                                        bonuses: ['+2 attack rolls', 'Expanded crit range'],
                                        penalties: ['No defensive bonuses']
                                    },
                                    'Centrifugal Fury': {
                                        bonuses: ['Attacks cleave to adjacent enemies', '+5 ft reach'],
                                        penalties: ['Cannot parry']
                                    },
                                    'Deadened Bastion': {
                                        bonuses: ['Reaction parry', '+20 temp HP', 'Immune to knockback'],
                                        penalties: ['-15 ft movement', 'Cannot dash']
                                    },
                                    'Fluid Apex': {
                                        bonuses: ['+1 all rolls', 'Can transition to any form (4 Flux)'],
                                        penalties: ['No stance-specific defensive bonuses']
                                    },
                                    'Void Predator': {
                                        bonuses: ['Advantage on first attack', '+2d6 damage from stealth', '+10 ft movement'],
                                        penalties: ['Penalties in bright light']
                                    }
                                }[currentStance] || { bonuses: [], penalties: [] };

                                const specBonus = (() => {
                                    if (selectedSpecialization === 'Iron Dancer' && (currentStance === 'Arterial Strike' || currentStance === 'Deadened Bastion')) {
                                        return 'Iron Dancer: +2 attack | Reroll 1s on damage | Harvest traits on kill';
                                    }
                                    return null;
                                })();

                                return (
                                    <>
                                        <div className="tooltip-header">{currentStance}</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Type:</strong> {currentStanceData.type}
                                            </div>
                                            {specBonus && (
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(139, 69, 19, 1)',
                                                    fontStyle: 'italic',
                                                    marginTop: '4px',
                                                    padding: '4px',
                                                    background: 'rgba(160, 82, 45, 0.1)',
                                                    borderRadius: '3px'
                                                }}>
                                                    ★  {specBonus}
                                                </div>
                                            )}
                                        </div>
                                        {details.bonuses.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Bonuses</div>
                                                    {details.bonuses.map((bonus, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '2px' }}>{bonus}</div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {details.penalties.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Penalties</div>
                                                    {details.penalties.map((penalty, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginBottom: '2px', color: 'rgba(178, 34, 52, 1)' }}>{penalty}</div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {details.penalties.length === 0 && details.bonuses.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Penalties</div>
                                                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(101, 67, 33, 0.7)' }}>None</div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Chronarch Time Shards & Temporal Strain Tooltips */}
                    {finalConfig.visual?.type === 'time-shards-strain' && chronarchHoverSection && (
                        <div>
                            {chronarchHoverSection === 'shards' && (
                                <>
                                    <div className="tooltip-header">Time Shards</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {chronarchTimeShards}/10 shards
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Power resource:</strong> Accumulate to unleash time magic
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Shard Management</div>
                                        <div className="level-management">
                                            <strong>Gain:</strong>
                                            <span>+1 per spell cast, persists between combats</span>
                                            <strong>Spend:</strong>
                                            <span>Temporal Flux spells (1-10 shards)</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {chronarchHoverSection === 'strain' && (() => {
                                const strainValue = chronarchTemporalStrain;
                                const getStrainState = (strain) => {
                                    if (strain >= 10) return { name: 'BACKLASH!', color: '#8b3a2a' };
                                    if (strain >= 9) return { name: 'Critical', color: '#C62828' };
                                    if (strain >= 7) return { name: 'Danger', color: '#E53935' };
                                    if (strain >= 5) return { name: 'Warning', color: '#FB8C00' };
                                    if (strain >= 3) return { name: 'Caution', color: '#F9A825' };
                                    return { name: 'Safe', color: '#2E7D32' };
                                };
                                const state = getStrainState(strainValue);

                                return (
                                    <>
                                        <div className="tooltip-header">Temporal Strain</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {strainValue}/10 ({state.name})
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Risk resource:</strong> Balance power with safety
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Strain Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>+1 to +5 per Flux ability</span>
                                                <strong>Decay:</strong>
                                                <span>-1 per turn (if no Flux used)</span>
                                            </div>
                                        </div>

                                        {strainValue >= 10 && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Temporal Backlash</div>
                                                    <div className="drawback-text">
                                                        Lose next turn, take 4d6 Force damage, strain resets to 0
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {strainValue >= 7 && strainValue < 10 && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Warning</div>
                                                    <div className="drawback-text">
                                                        Approaching Backlash threshold!
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Covenbane Hexbreaker Charges Tooltips */}
                    {finalConfig.visual?.type === 'hexbreaker-charges' && covenbaneHoverSection && (
                        <div>
                            {covenbaneHoverSection === 'charges' && (() => {
                                const maxCharges = finalConfig.mechanics?.max || 8;
                                const chargesValue = covenbaneHexbreakerCharges;
                                const getPassiveBonuses = (charges) => {
                                    const bonuses = {
                                        0: { damage: '0', speed: '+0ft', crit: '20', trueDmg: '0%' },
                                        1: { damage: '+1d4', speed: '+5ft', crit: '20', trueDmg: '6%' },
                                        2: { damage: '+1d6', speed: '+10ft', crit: '20', trueDmg: '7%' },
                                        3: { damage: '+2d6', speed: '+15ft', crit: '19-20', trueDmg: '8%' },
                                        4: { damage: '+3d6', speed: '+20ft', crit: '19-20', trueDmg: '9%' },
                                        5: { damage: '+4d6', speed: '+25ft', crit: '18-20', trueDmg: '10%' },
                                        6: { damage: '+5d6', speed: '+30ft', crit: '18-20', trueDmg: '11%' },
                                        7: { damage: '+6d6', speed: '+35ft', crit: '17-20', trueDmg: '12%' },
                                        8: { damage: '+7d6', speed: '+40ft', crit: '17-20', trueDmg: '13%' }
                                    };
                                    return bonuses[charges] || bonuses[charges > 8 ? 8 : 0];
                                };
                                const bonuses = getPassiveBonuses(chargesValue);

                                return (
                                    <>
                                        <div className="tooltip-header">Hexbreaker Charges</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {chargesValue}/{maxCharges} charges
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Passive:</strong> {bonuses.damage} damage, {bonuses.speed} speed
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Charge Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>Combat abilities and attacks</span>
                                                <strong>Spend:</strong>
                                                <span>Shadow Step (1), Curse Eater (2), Dark Pursuit (3), Fury ({maxCharges})</span>
                                            </div>
                                        </div>

                                        {chargesValue === maxCharges && (
                                            <div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Ultimate Ready</div>
                                                    <div className="passive-desc">
                                                        Hexbreaker Fury: Spend all {maxCharges} charges for AoE damage and stun.
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </>
                                );
                            })()}

                            {covenbaneHoverSection === 'counter' && (
                                <>
                                    <div className="tooltip-header">Attack Counter</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current:</strong> {covenbaneAttackCounter}/3 attacks
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Every 3rd attack:</strong> Deals bonus true damage
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">True Damage Scaling</div>
                                        <div className="passive-desc">
                                            Base: +1d6 true damage<br />
                                            At 6 charges: +4d8 true damage
                                        </div>
                                    </div>

                                    {covenbaneAttackCounter === 3 && (
                                        <>
                                            <div className="tooltip-divider"></div>
                                            <div className="tooltip-section">
                                                <div className="tooltip-label">True Damage Ready</div>
                                                <div className="passive-desc">
                                                    Next attack deals bonus true damage (ignores armor/resistances)
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </>
                            )}
                        </div>
                    )}

                    {/* Deathcaller Ascension Paths & Blood Tokens Tooltips */}
                    {finalConfig.visual?.type === 'ascension-blood' && deathcallerHoverSection && (
                        <div>
                            {deathcallerHoverSection === 'paths' && (() => {
                                const pathsArray = Array.isArray(localAscensionPaths) ? localAscensionPaths : [true, false, false, false, false, false, false];
                                const activePaths = pathsArray.filter(p => p).length;
                                const activePathsList = finalConfig.paths.filter((_, i) => pathsArray[i]);

                                return (
                                    <>
                                        <div className="tooltip-header">Necrotic Ascension</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Active Paths:</strong> {activePaths}/7
                                            </div>
                                        </div>
                                        {activePathsList.length > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Active Boons</div>
                                                    {activePathsList.map((path, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                            <strong>{path.shortName}:</strong> {path.boon}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Active Curses</div>
                                                    {activePathsList.map((path, i) => (
                                                        <div key={i} style={{ fontSize: '0.85rem', marginTop: '4px', color: '#8b3a2a' }}>
                                                            <strong>{path.shortName}:</strong> {path.curse}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {activePathsList.length === 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#4E342E' }}>
                                                        No paths activated yet
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                            {deathcallerHoverSection === 'tokens' && (() => {
                                const tokensValue = localBloodTokens;
                                const warningThreshold = finalConfig.bloodTokens?.warningThreshold || 10;
                                const dangerThreshold = finalConfig.bloodTokens?.dangerThreshold || 20;
                                const burstDamage = tokensValue; // 1d10 per token

                                return (
                                    <>
                                        <div className="tooltip-header">Blood Tokens</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {tokensValue} tokens
                                            </div>
                                        </div>
                                        <div className="tooltip-divider"></div>
                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Token Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>1 HP sacrificed = 1 Token (requires Crimson Pact path)</span>
                                                <strong>Spend:</strong>
                                                <span>1 Token = +1d6 necrotic damage (can spend multiple per spell)</span>
                                            </div>
                                        </div>
                                        {tokensValue >= dangerThreshold && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: '#8b3a2a' }}>
                                                        EXTREME DANGER!
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        <strong>Burst Damage:</strong> {burstDamage}d10 damage (~{Math.floor(burstDamage * 5.5)} average)
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        <strong>Timer:</strong> 10 minutes (15 with Crimson Pact)
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {tokensValue >= warningThreshold && tokensValue < dangerThreshold && (
                                            <div style={{
                                                fontStyle: 'italic',
                                                fontSize: '9px',
                                                textAlign: 'center',
                                                color: '#8b3a2a',
                                                marginTop: '6px',
                                                padding: '4px',
                                                background: 'rgba(255, 107, 107, 0.15)',
                                                borderRadius: '3px'
                                            }}>
                                                High token count - use soon or risk burst!
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Dreadnaught DRP Tooltip */}
                    {finalConfig.visual?.type === 'drp-resilience' && dreadnaughtHoverSection === 'drp' && (
                        <>
                            <div className="tooltip-header">Damage Resilience Points</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localDRP} DRP
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">DRP Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>+1 DRP per 5 damage taken (calculated from full damage, before resistance)</span>
                                    <strong>Spend:</strong>
                                    <span>Shadow Shield (2:1 absorption), Wraith Strike (+1d6 per 5 DRP), Necrotic Aura (15 DRP)</span>
                                </div>
                            </div>
                            {localDRP >= 10 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Active Resistance</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            <strong>Type:</strong> {selectedResistanceType}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            Halves damage taken. DRP calculated from full damage.
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Regeneration</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            <strong>+{Math.floor(localDRP / 10)} HP/turn</strong> (1 HP per 10 DRP)
                                        </div>
                                    </div>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Dark Rebirth</div>
                                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                            If you die, revive with <strong>{localDRP * 2} HP</strong>
                                        </div>
                                    </div>
                                </>
                            )}
                            {localDRP < 10 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#4E342E' }}>
                                            Need <strong>10+ DRP</strong> to activate passive benefits
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Exorcist Dominance Tooltip */}
                    {finalConfig.visual?.type === 'dominance-die' && exorcistHoverSection === 'dominance' && (
                        <div>
                            {(() => {
                                const currentDemon = boundDemons[selectedDemonIndex];
                                const currentDD = currentDemon?.dd ?? localDominanceDie ?? 0;
                                const isDemonBound = currentDemon && currentDD > 0;

                                const getDDState = (dd) => {
                                    switch (dd) {
                                        case 12: return { name: 'Full Control', color: '#8B6508' };
                                        case 10: return { name: 'Good Control', color: '#8B6508' };
                                        case 8: return { name: 'Moderate Risk', color: '#8B6508' };
                                        case 6: return { name: 'High Risk', color: '#8B0000' };
                                        case 0: return { name: 'ESCAPED', color: '#8B0000' };
                                        default: return { name: 'Unknown', color: '#4E342E' };
                                    }
                                };

                                const state = getDDState(currentDD);
                                const ddLabel = currentDD === 0 ? 'ESCAPED' : `d${currentDD}`;

                                // If no demon is bound, show binding instructions
                                if (!isDemonBound) {
                                    return (
                                        <>
                                            <div className="tooltip-header">Dominance Die</div>
                                            <div className="tooltip-section">
                                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                    <strong>Status:</strong> No Demon Bound
                                                </div>
                                            </div>
                                            <div className="tooltip-divider"></div>
                                            <div className="tooltip-section">
                                                <div className="tooltip-label">Binding Ritual</div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    Requires <strong>ritual</strong> (10 min). Target must be <strong>defeated</strong>.
                                                </div>
                                            </div>
                                            <div className="tooltip-divider"></div>
                                            <div className="tooltip-section">
                                                <div className="tooltip-label">Demon Slots</div>
                                                <div className="level-management">
                                                    <strong>Base:</strong>
                                                    <span>2 demons</span>
                                                    <strong>Demonologist:</strong>
                                                    <span>4 demons</span>
                                                    <strong>Demon Lord:</strong>
                                                    <span>1 demon</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                }

                                return (
                                    <>
                                        <div className="tooltip-header">Dominance Die</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Demon:</strong> {currentDemon.name} (Tier {currentDemon.tier})
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Current DD:</strong> <span style={{ color: state.color, fontWeight: 'bold' }}>{ddLabel}</span> ({state.name})
                                            </div>
                                        </div>
                                        <div className="tooltip-divider"></div>
                                        <div className="tooltip-section">
                                            <div className="tooltip-label">DD Progression</div>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <strong>Progression:</strong> d12 → d10 → d8 → d6 → 0
                                            </div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                Decreases per action/hit
                                            </div>
                                        </div>
                                        <div className="tooltip-divider"></div>
                                        <div className="tooltip-section">
                                            <div className="tooltip-label">At DD = 0</div>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                <strong>Save DC:</strong> {currentDemon.saveDC}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px', color: '#8b3a2a' }}>
                                                Fail: Demon escapes
                                            </div>
                                        </div>

                                        {currentDD <= 6 && currentDD > 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: currentDD === 6 ? '#8b3a2a' : '#8B6508' }}>
                                                        {currentDD === 6 ? 'CRITICAL - Demon Near Escape!' : 'WARNING - Low Dominance'}
                                                    </div>
                                                    <div className="level-management" style={{ marginTop: '4px' }}>
                                                        <strong>Reassert Dominance:</strong>
                                                        <span>5 mana - Restore to max DD, +1 DD for 3 actions</span>
                                                        <strong>Chain of Command:</strong>
                                                        <span>4 mana - Restore to max DD, +1 DD for 3 actions</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {currentDD === 0 && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label" style={{ color: '#8b3a2a' }}>
                                                        DEMON ESCAPED!
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                        Demon flees or attacks. Must re-bind (ritual).
                                                    </div>
                                                    <div className="level-management" style={{ marginTop: '4px' }}>
                                                        <strong>Behavior (d6):</strong>
                                                        <span>1-2: Flees, 3-6: Attacks you</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* False Prophet Madness Tooltip */}
                    {finalConfig.visual?.type === 'madness-gauge' && falseProphetHoverSection === 'madness' && (
                        <>
                            <div className="tooltip-header">Madness Points</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localMadness}/20 ({getDangerLevel(localMadness).name})
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Shadow Damage:</strong> +{localMadness}
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Next Threshold:</strong> {getNextThreshold(localMadness)}
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Madness Management</div>
                                <div className="level-management">
                                    <strong>Gain:</strong>
                                    <span>Spells generate Madness</span>
                                    <strong>Spend:</strong>
                                    <span>Some spells spend Madness</span>
                                    <strong>At 10+:</strong>
                                    <span>Next shadow spell +2d6</span>
                                </div>
                            </div>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label">Madness Thresholds</div>
                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                    <strong>6:</strong> Veil of Shadows
                                </div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <strong>9:</strong> Eldritch Vision
                                </div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <strong>10:</strong> Empowerment (+2d6)
                                </div>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <strong>12:</strong> Apocalyptic Revelation
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#8b3a2a', marginTop: '4px' }}>
                                    <strong>15:</strong> DANGER ZONE
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#8b3a2a' }}>
                                    <strong>20:</strong> INSANITY CONVULSION
                                </div>
                            </div>
                            {localMadness >= 15 && (
                                <>
                                    <div className="tooltip-divider"></div>
                                    <div className="tooltip-section">
                                        <div className="tooltip-label" style={{ color: localMadness === 20 ? '#8b3a2a' : '#8B6508' }}>
                                            {localMadness === 20 ? 'INSANITY CONVULSION!' : 'HIGH CONVULSION RISK'}
                                        </div>
                                        {localMadness === 20 ? (
                                            <>
                                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                    Roll 1d6 on Convulsion Table:
                                                </div>
                                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                    <strong>1:</strong> Shadow Burst (5d6 necrotic AoE)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>2:</strong> Mind Shatter (stunned 2 rounds)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>3:</strong> Dark Whispers (disadvantage 3 rounds)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>4:</strong> Chaotic Pulse (teleport + 4d6 psychic)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>5:</strong> Psychic Scream (AoE fear 3 rounds)
                                                </div>
                                                <div style={{ fontSize: '0.85rem' }}>
                                                    <strong>6:</strong> Nightmare Echoes (6d6 + madness)
                                                </div>
                                                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px', color: '#4E342E' }}>
                                                    After Convulsion: Madness resets to 0
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                Approaching Convulsion. Consider spending Madness or avoiding Madness-generating spells.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Fate Weaver Threads Tooltip */}
                    {modifiedConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection === 'threads' && (
                        <>
                            <div className="tooltip-header">Threads of Destiny</div>

                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                    <strong>Current:</strong> {localThreads}/{modifiedConfig.mechanics?.max ?? 13} Threads
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                    <strong>Level:</strong> {getThreadLevel(localThreads).name}
                                </div>
                            </div>

                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">Thread Management</div>
                                <div className="level-management">
                                    <strong>Generate:</strong>
                                    <span>Failures generate Threads</span>
                                    <strong>Spend:</strong>
                                    <span>2 Threads: Call specific card{selectedFateWeaverSpec === 'thread-weaver' && localThreads >= 3 ? ', 3 Threads: Force failure, 5 Threads: Force success' : ''}</span>
                                </div>
                            </div>

                            <div className="tooltip-divider"></div>

                            <div className="tooltip-section">
                                <div className="tooltip-label">Specialization: {selectedFateWeaverSpec === 'fortune-teller' ? 'Fortune Teller' : selectedFateWeaverSpec === 'card-master' ? 'Card Master' : 'Thread Weaver'}</div>
                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                    {selectedFateWeaverSpec === 'fortune-teller' && 'See top card always. 1 Thread for ally advantage.'}
                                    {selectedFateWeaverSpec === 'card-master' && 'Hold 7 cards. Call 2 cards per 2 Threads.'}
                                    {selectedFateWeaverSpec === 'thread-weaver' && '+1 Thread on all gains. 5T auto-success. 3T auto-fail.'}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Gambit Dual Ledger Tooltip */}
                    {finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp' && (() => {
                        const fpValue = finalClassResource.current ?? localFortunePoints;
                        const maxFP = finalClassResource.max ?? 7;
                        const riskValue = finalClassResource.risk ?? 0;
                        const maxRisk = 13;

                        return (
                            <div>
                                <div className="tooltip-header">Gambit Dual Ledger</div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#8B6508' }}>
                                        <strong>Fortune Points:</strong> {fpValue}/{maxFP} FP
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                        Spend Fortune Points to influence fate and adjust rolls. Gain points from successful actions and critical hits.
                                    </div>
                                </div>

                                <div className="tooltip-divider"></div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#8b3a2a' }}>
                                        <strong>Karmic Debt:</strong> {riskValue}/{maxRisk} Debt
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                        Represents the accumulated cost of pushing your luck. Accumulated risk will eventually demand payment, imposing dangerous penalties or cascading effects.
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Apex Quarry Marks & Companion Tooltip */}
                    {finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection && (
                        <div>
                            {huntressHoverSection === 'marks' && (() => {
                                const qmValue = finalClassResource.current ?? localQuarryMarks;
                                const maxQM = finalClassResource.max ?? 5;

                                return (
                                    <>
                                        <div className="tooltip-header">Quarry Marks</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#8B0000' }}>
                                                <strong>Marks:</strong> {qmValue}/{maxQM}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                                Used to enhance companion actions and unleash deadly glaive chains. Generated by successful hunter strikes.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {huntressHoverSection === 'companion' && (() => {
                                const companionHPValue = finalClassResource.companionHP ?? companionHP;
                                const companionMaxHPValue = finalClassResource.companionMaxHP ?? companionMaxHP;

                                return (
                                    <>
                                        <div className="tooltip-header">Beast Companion</div>
                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#1B5E20' }}>
                                                <strong>HP:</strong> {companionHPValue}/{companionMaxHPValue}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                                The vital health of your loyal beast companion. If they fall to 0 HP, they are incapacitated.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Animist Tooltip */}
                    {finalConfig.visual?.type === 'ancestral-resonance' && animistHoverSection === 'resonance' && (
                        <div>
                            <div className="tooltip-header">Ancestral Resonance</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#1B5E20' }}>
                                    <strong>Current:</strong> {finalClassResource.current ?? 0}/{finalClassResource.max ?? 20} AR
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                    Represents your attunement with ancestral spirits. Used to power runic invocations, summon ancestral guides, and manifest spirit-ward shields.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lichborne Phylactery Tooltip - Only shows phylactery info, no aura content */}
                    {finalConfig.visual?.type === 'eternal-frost-phylactery' && lichborneHoverSection === 'phylactery' && lichborneHoverSection !== 'aura' && (
                        <div>
                            {(() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[lichborneSpec] || specs.frostbound_tyrant;
                                const maxPhylactery = currentSpec.maxPhylactery;
                                const specName = currentSpec.name;
                                const specGlow = currentSpec.glow || '#6495ED';

                                return (
                                    <>
                                        <div className="tooltip-header">Phylactery</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>HP:</strong> {localPhylacteryHP}/{maxPhylactery}
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Style:</strong> {specName}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Phylactery Management</div>
                                            <div className="level-management">
                                                <strong>Charge:</strong>
                                                <span>+1d6 HP per enemy killed by frost spells</span>
                                                <strong>Resurrect:</strong>
                                                <span>Spend all stored HP, once per combat. Death Trigger: Freeze 15ft for 1 round.</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">{specName}</div>
                                            <div className="passive-desc">
                                                {lichborneSpec === 'frostbound_tyrant' && 'Freeze effects last +1d4 rounds. Frozen enemies take +1d6 damage. 50% Shatter chance (3d6 burst, ends freeze).'}
                                                {lichborneSpec === 'spectral_reaper' && 'Frost spells deal +1d6 necrotic. Every kill raises a spectral minion (max 4). 10 HP, 1d6 dmg/turn.'}
                                                {lichborneSpec === 'phylactery_guardian' && 'Phylactery stores 75 HP. Death Trigger freeze radius 25ft (vs 15ft).'}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Lunarch Lunar Phases Tooltip */}
                    {finalConfig.visual?.type === 'lunar-phases' && lunarchHoverSection && (
                        <div>
                            {lunarchHoverSection === 'phase' && (() => {
                                const phases = finalConfig.visual;
                                const currentPhaseConfig = phases[currentLunarPhase];
                                const phaseOrder = ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'];

                                const getPhaseBonuses = (phase) => {
                                    switch (phase) {
                                        case 'new_moon':
                                            return { bonus: '+2 Armor', penalty: 'Damage -1d6', theme: 'Defense' };
                                        case 'waxing_moon':
                                            return { bonus: 'Healing +1d4', penalty: 'None', theme: 'Healing' };
                                        case 'full_moon':
                                            return { bonus: 'Damage +2d6', penalty: 'Armor -1', theme: 'Offense' };
                                        case 'waning_moon':
                                            return { bonus: 'Mana -2 cost', penalty: 'Healing -1d4', theme: 'Efficiency' };
                                        default:
                                            return { bonus: '', penalty: '', theme: '' };
                                    }
                                };

                                const currentBonuses = getPhaseBonuses(currentLunarPhase);

                                return (
                                    <>
                                        <div className="tooltip-header">Lunar Phases</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current Phase:</strong> {currentPhaseConfig.name} ({currentBonuses.theme})
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Phase Bonus:</strong> {currentBonuses.bonus}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Phase Management</div>
                                            <div className="level-management">
                                                <strong>Duration:</strong>
                                                <span>3 rounds per phase</span>
                                                <strong>Manual Shift:</strong>
                                                <span>8 mana (instant, resets timer)</span>
                                                <strong>Natural Cycle:</strong>
                                                <span>Auto-advances after 3 rounds</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">All Phases</div>
                                            <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                                {phaseOrder.map((phase, idx) => {
                                                    const phaseConfig = phases[phase];
                                                    const bonuses = getPhaseBonuses(phase);
                                                    return (
                                                        <div key={phase} style={{ marginBottom: '3px' }}>
                                                            <strong style={{ color: '#2C2416' }}>{phaseConfig.name}:</strong> {bonuses.bonus}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Lunar Empowerment (Shared Passive)</div>
                                            <div className="passive-desc">
                                                Darkvision 60 ft. Advantage vs charm/fear during Full Moon.
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {lunarchHoverSection === 'timer' && (
                                <>
                                    <div className="tooltip-header">Phase Timer</div>

                                    <div className="tooltip-section">
                                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                            <strong>Current Round:</strong> {roundsInPhase + 1}/3
                                        </div>
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <strong>Rounds Remaining:</strong> {3 - roundsInPhase}
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Natural Cycling</div>
                                        <div className="level-management">
                                            <strong>Duration:</strong>
                                            <span>3 rounds per phase</span>
                                            <strong>Cycle Order:</strong>
                                            <span>New → Waxing → Full → Waning</span>
                                            <strong>Auto-Advance:</strong>
                                            <span>After round 3 completes</span>
                                        </div>
                                    </div>

                                    <div className="tooltip-divider"></div>

                                    <div className="tooltip-section">
                                        <div className="tooltip-label">Specialization Passive</div>
                                        <div className="passive-desc">
                                            {lunarchSpec === 'moonlight_sentinel' && 'Critical hits during Full Moon deal +2d6 radiant damage.'}
                                            {lunarchSpec === 'starfall_invoker' && 'AoE spells during Full Moon affect +5 ft radius.'}
                                            {lunarchSpec === 'lunar_guardian' && 'Healing during Waxing Moon grants +1d6 temporary HP.'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Minstrel Musical Notes Tooltip */}
                    {finalConfig.visual?.type === 'musical-notes-combo' && minstrelHoverSection && minstrelHoverSection.startsWith('note-') && (() => {
                        const noteIndex = parseInt(minstrelHoverSection.split('-')[1]);
                        const note = finalConfig.visual?.notes?.[noteIndex];

                        if (!note) return null;

                        const count = localNotes[noteIndex] || 0;
                        const maxPerNote = finalConfig.mechanics?.maxPerNote || 5;

                        return (
                            <>
                                <div className="tooltip-header">{note.name}</div>

                                <div className="tooltip-section">
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                        <strong>Current:</strong> {count}/{maxPerNote} notes
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <strong>Effect:</strong> {note.function}
                                    </div>
                                </div>

                                <div className="tooltip-divider"></div>

                                <div className="tooltip-section">
                                    <div className="tooltip-label">Note Management</div>
                                    <div className="level-management">
                                        <strong>Generate:</strong>
                                        <span>{note.generatedBy}</span>
                                        <strong>Use:</strong>
                                        <span>{note.usedIn?.[0] || 'Various cadences'}</span>
                                    </div>
                                </div>
                            </>
                        );
                    })()}

                    {/* Oracle Prophetic Visions Tooltip */}
                    {finalConfig.visual?.type === 'prophetic-visions' && oracleHoverSection && (
                        <div>
                            {oracleHoverSection === 'visions' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[oracleSpec] || specs.seer;
                                const specName = currentSpec.name;
                                const maxVisions = specs.max || 10;
                                const visionsValue = localVisions;

                                return (
                                    <>
                                        <div className="tooltip-header">{specName} Visions</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {visionsValue}/{maxVisions} visions
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <strong>Next Prediction:</strong> +1-3 visions
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">Vision Management</div>
                                            <div className="level-management">
                                                <strong>Gain:</strong>
                                                <span>Make predictions (simple +1, moderate +2, complex +3)</span>
                                                <strong>Spend:</strong>
                                                <span>Alter Fate (1-3 visions per use)</span>
                                            </div>
                                        </div>

                                        <div className="tooltip-divider"></div>

                                        <div className="tooltip-section">
                                            <div className="tooltip-label">{specName} Passive</div>
                                            <div className="passive-desc">
                                                {oracleSpec === 'seer' && 'Gain +1 Vision per correct prediction. Predictions cost no action points. Advantage on initiative.'}
                                                {oracleSpec === 'truthseeker' && 'Detect lies and illusions. Uncover hidden knowledge for +1 Vision each.'}
                                                {oracleSpec === 'fateseer' && 'Premonition: When a prediction resolves correctly, spend 1 Vision to immediately apply a fate effect (reroll, ±1d6, or advantage/disadvantage) related to that prediction.'}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Berserker Rage Tooltip */}
                    {finalConfig.type === 'rage' && finalConfig.rageStates && (
                        <div>
                            {(() => {
                                const rageValue = berserkerRage;
                                const currentState = finalConfig.rageStates.find(s => rageValue >= s.range[0] && rageValue <= s.range[1]);
                                const isOverheated = rageValue > 100;

                                return (
                                    <>
                                        <div className="tooltip-header">Berserker Rage</div>

                                        <div className="tooltip-section">
                                            <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                                                <strong>Current:</strong> {rageValue}/100 rage
                                            </div>
                                            {currentState && (
                                                <div style={{ fontSize: '0.9rem' }}>
                                                    <strong>State:</strong> {currentState.name}
                                                </div>
                                            )}
                                        </div>

                                        {currentState && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Current Effects</div>
                                                    {currentState.bonuses && currentState.bonuses.length > 0 && (
                                                        <div style={{ fontSize: '0.85rem', marginBottom: '4px' }}>
                                                            <strong>Bonuses:</strong> {currentState.bonuses.join(', ')}
                                                        </div>
                                                    )}
                                                    {currentState.penalties && currentState.penalties.length > 0 && (
                                                        <div style={{ fontSize: '0.85rem' }}>
                                                            <strong>Penalties:</strong> {currentState.penalties.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {isOverheated && (
                                            <>
                                                <div className="tooltip-divider"></div>
                                                <div className="tooltip-section">
                                                    <div className="tooltip-label">Overheat Warning</div>
                                                    <div className="drawback-text">
                                                        Take 2d6 damage if not spent this round!
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* Harbinger Tooltips */}
                    {finalConfig.visual?.type === 'mayhem-gauge' && chaosWeaverHoverSection === 'mayhem' && (
                        <div>
                            <div className="tooltip-header">Mayhem Gauge</div>
                            <div className="tooltip-section">
                                <div style={{ fontSize: '0.9rem', marginBottom: '4px', color: '#5E35B1' }}>
                                    <strong>Current:</strong> {finalClassResource.current || 0}/{finalClassResource.max || 100} Mayhem
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#4E342E' }}>
                                    Passive chaos pressure gauge â€” CANNOT be spent. Passively amplifies all spells as it rises. Only release is Wild Surge at 100.
                                </div>
                            </div>
                        </div>
                    )}

                    {finalConfig.stages && finalClassResource.current < finalConfig.stages.length && (
                        <div className="tooltip-stage-info">
                            <div className="stage-name">{finalConfig.stages[finalClassResource.current].name}</div>
                            {finalConfig.stages[finalClassResource.current].bonuses.length > 0 && (
                                <div className="stage-bonuses">
                                    <strong>Bonuses:</strong>
                                    <ul>
                                        {finalConfig.stages[finalClassResource.current].bonuses.map((bonus, i) => (
                                            <li key={i}>{bonus}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {finalConfig.stages[finalClassResource.current].drawbacks.length > 0 && (
                                <div className="stage-drawbacks">
                                    <strong>Drawbacks:</strong>
                                    <ul>
                                        {finalConfig.stages[finalClassResource.current].drawbacks.map((drawback, i) => (
                                            <li key={i}>{drawback}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {finalConfig.thresholds && (
                        <div className="tooltip-thresholds">
                            <strong>Thresholds:</strong>
                            {finalConfig.thresholds.map((threshold, i) => (
                                <div
                                    key={i}
                                    className={`threshold-info ${finalClassResource.current >= threshold.value ? 'achieved' : 'pending'}`}
                                >
                                    <span className="threshold-value">{threshold.value}:</span>
                                    <span className="threshold-name">{threshold.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </TooltipPortal>
        );
    };

    const isShaper = finalConfig.type === 'dual-resource';
    const isBerserker = finalConfig.type === 'rage';
    const isHarbinger = finalConfig.visual?.type === 'mayhem-gauge';
    const isChronarch = finalConfig.visual?.type === 'time-shards-strain';
    const isRevenant = finalConfig.visual?.type === 'ascension-blood';
    const isFalseProphet = finalConfig.visual?.type === 'madness-gauge';
    const isGambitThreads = modifiedConfig.visual?.type === 'threads-of-destiny';
    const isGambit = finalConfig.visual?.type === 'fortune-points-gambling';
    const isApex = finalConfig.visual?.type === 'quarry-marks-companion';
    const isAnimist = finalConfig.visual?.type === 'ancestral-resonance';
    const isInquisitor = finalConfig.visual?.type === 'hexbreaker-charges';
    const isLunarch = finalConfig.visual?.type === 'lunar-phases';
    const isMinstrel = finalConfig.visual?.type === 'musical-notes-combo';
    const isPlaguebringer = finalConfig.visual?.type === 'virulence-bar';
    const isPyrofiend = finalConfig.visual?.type === 'inferno-veil';
    const isSpellguard = finalConfig.visual?.type === 'arcane-absorption';
    const isWarden = finalConfig.visual?.type === 'vengeance-points';

    // Hide CR bar if class has no resource system (max === 0)
    // This prevents showing "0/0" bars for GMs or characters without class resources
    if (!finalClassResource.max || finalClassResource.max === 0) {
        return null;
    }


};

export default ResourceTooltip;