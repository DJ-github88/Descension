import React from 'react';
import TooltipPortal from '../tooltips/TooltipPortal';
import ClassTip from './ClassTip';

const ResourceTooltip = ({
  finalConfig,
  modifiedConfig,
  finalClassResource,
  showTooltip,
  chaosWeaverHoverSection,
  activeSpecialization,
  animistHoverSection,
  shaperHoverSection,
  chronarchHoverSection,
  hexbreakerHoverSection,
  ascensionHoverSection,
  falseProphetHoverSection,
  fateWeaverHoverSection,
  gamblerHoverSection,
  huntressHoverSection,
  lunarchHoverSection,
  minstrelHoverSection,
  tooltipRef,
  shaperMomentum,
  shaperFlourish,
  stanceValue,
  currentStance,
  selectedSpecialization,
  chronarchTimeShards,
  chronarchTemporalStrain,
  covenbaneHexbreakerCharges,
  covenbaneAttackCounter,
  localAscensionPaths,
  localBloodTokens,
  resilienceHoverSection,
  localDRP,
  selectedResistanceType,
  dominanceHoverSection,
  boundDemons,
  selectedDemonIndex,
  localDominanceDie,
  localMadness,
  getDangerLevel,
  getNextThreshold,
  localThreads,
  getThreadLevel,
  selectedFateWeaverSpec,
  localFortunePoints,
  localQuarryMarks,
  companionHP,
  companionMaxHP,
  phylacteryHoverSection,
  lichborneSpec,
  localPhylacteryHP,
  currentLunarPhase,
  roundsInPhase,
  lunarchSpec,
  localNotes,
  visionsHoverSection,
  oracleSpec,
  localVisions,
  berserkerRage,
}) => {
      
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
            finalConfig.visual?.type === 'revenant-toll' ||
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

        // Determine the class-specific CSS theme
        const getTooltipThemeClass = () => {
            const vType = finalConfig?.visual?.type || modifiedConfig?.visual?.type;
            if (vType === 'madness-gauge') return 'false-prophet-tooltip';
            if (vType === 'time-shards-strain') return 'chronarch-tooltip';
            if (vType === 'mayhem-gauge' || vType === 'mayhem-modifiers') return 'harbinger-tooltip';
            if (vType === 'fortune-points-gambling') return 'gambit-tooltip';
            if (vType === 'devotion-gauge') return 'martyr-tooltip';
            if (vType === 'ascension-blood') return 'ascension-tooltip';
            if (vType === 'hexbreaker-charges') return 'inquisitor-tooltip';
            if (vType === 'threads-of-destiny') return 'augur-tooltip';
            if (vType === 'quarry-marks-companion') return 'apex-tooltip';
            if (vType === 'lunar-phases') return 'lunarch-tooltip';
            if (vType === 'ancestral-resonance') return 'animist-tooltip';
            if (vType === 'musical-notes-combo') return 'minstrel-tooltip';
            if (vType === 'elemental-spheres' || finalConfig?.type === 'spheres') return 'arcanoneer-tooltip';
            if (vType === 'drp-resilience' || vType === 'vengeance-points') return 'warden-tooltip';
            if (vType === 'dominance-die') return 'warden-tooltip';
            if (vType === 'virulence-bar') return 'plaguebringer-tooltip';
            if (vType === 'dual-resource') return 'toxicologist-tooltip';
            if (vType === 'dual-omen') return 'augur-tooltip';
            if (vType === 'inferno-veil') return 'pyrofiend-tooltip';
            if (vType === 'arcane-absorption') return 'spellguard-tooltip';
            if (vType === 'eternal-frost-phylactery' || vType === 'revenant-toll') return 'revenant-tooltip';
            if (finalConfig?.type === 'rage' || modifiedConfig?.type === 'rage') return 'berserker-tooltip';
            if (vType === 'crusader-fervor') return 'crusader-tooltip';
            return '';
        };

        // Check if there's any content to show in the tooltip
        const hasTooltipContent =
            (modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-gauge' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'ancestral-resonance' && modifiedConfig.visual?.type !== 'dual-omen' && modifiedConfig.visual?.type !== 'inferno-veil' && modifiedConfig.visual?.type !== 'arcane-absorption' && modifiedConfig.visual?.type !== 'devotion-gauge' && modifiedConfig.visual?.type !== 'lunar-phases' && modifiedConfig.visual?.type !== 'elemental-spheres' && modifiedConfig.tooltip?.description) ||
            (finalConfig.type === 'spheres') ||
            (finalConfig.type === 'dual-resource' && shaperHoverSection) ||
            (finalConfig.visual?.type === 'time-shards-strain') ||
            (finalConfig.visual?.type === 'hexbreaker-charges' && hexbreakerHoverSection) ||
            (finalConfig.visual?.type === 'ascension-blood' && ascensionHoverSection) ||
            (finalConfig.visual?.type === 'madness-gauge') ||
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
                    className={`unified-resourcebar-tooltip pathfinder-tooltip ${getTooltipThemeClass()}`.trim()}
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    {modifiedConfig.type !== 'rage' && modifiedConfig.type !== 'dual-resource' && modifiedConfig.visual?.type !== 'mayhem-modifiers' && modifiedConfig.visual?.type !== 'mayhem-gauge' && modifiedConfig.visual?.type !== 'time-shards-strain' && modifiedConfig.visual?.type !== 'ascension-blood' && modifiedConfig.visual?.type !== 'hexbreaker-charges' && modifiedConfig.visual?.type !== 'drp-resilience' && modifiedConfig.visual?.type !== 'dominance-die' && modifiedConfig.visual?.type !== 'madness-gauge' && modifiedConfig.visual?.type !== 'threads-of-destiny' && modifiedConfig.visual?.type !== 'fortune-points-gambling' && modifiedConfig.visual?.type !== 'quarry-marks-companion' && modifiedConfig.visual?.type !== 'musical-notes-combo' && modifiedConfig.visual?.type !== 'prophetic-visions' && modifiedConfig.visual?.type !== 'vengeance-points' && modifiedConfig.visual?.type !== 'eternal-frost-phylactery' && modifiedConfig.visual?.type !== 'ancestral-resonance' && (
                        <ClassTip
                            icon="fas fa-scroll"
                            tint="#b7791f"
                            title={tooltipTitle || modifiedConfig.visual?.name || 'Class Resource'}
                            subtitle="Class Resource Mechanic"
                            state={finalClassResource?.current !== undefined ? `${finalClassResource.current}${finalClassResource.max ? `/${finalClassResource.max}` : ''}` : null}
                            stateTone="neutral"
                            mechanic={modifiedConfig.tooltip?.description || 'Track and manage this class resource during encounters.'}
                            status={finalClassResource?.current !== undefined ? [`Current pool: ${finalClassResource.current} available.`] : []}
                        />
                    )}

                    {/* Simple sphere count */}
                    {finalConfig.type === 'spheres' && (
                        <ClassTip
                            icon="🔮"
                            tint="#7b1fa2"
                            title="Elemental Spheres"
                            state={`${sphereCount}/${finalConfig.mechanics?.max || 12}`}
                            stateTone={sphereCount > 0 ? 'good' : 'neutral'}
                            mechanic={`Roll ${activeSpecialization === 'entropy-weaver' ? '5d8' : '4d8'} each turn; combine matching spheres to cast. Cap ${activeSpecialization === 'sphere-architect' ? 15 : 12}.`}
                            status={Object.entries(sphereBreakdown).map(([name, count]) => `${name}: ${count}`)}
                            usage="Left-click an orb to add · Right-click to remove."
                        />
                    )}

                    {/* Shaper Tooltips */}
                    {finalConfig.type === 'dual-resource' && shaperHoverSection && (
                        <div>
                            {shaperHoverSection === 'momentum' && (
                                <ClassTip
                                    icon="💨"
                                    tint="#4a90d9"
                                    title="Momentum"
                                    state={`${shaperMomentum}/20`}
                                    stateTone={shaperMomentum >= 12 ? 'good' : shaperMomentum >= 6 ? 'neutral' : 'warn'}
                                    mechanic="Combat flow: +1 on hit (+2 on max damage die), +1 on dodge/parry. Decays on misses and hits taken."
                                    status={[
                                        shaperMomentum >= 6
                                            ? `${shaperMomentum} banked — stance transitions (2–4) and abilities (3–6) available.`
                                            : 'Too low to spend — land hits to build it.',
                                    ]}
                                    usage="Spend 2–4 for stance transitions, 3–6 for abilities."
                                />
                            )}

                            {shaperHoverSection === 'flourish' && (
                                <ClassTip
                                    icon="✨"
                                    tint="#9b59b6"
                                    title="Flourish"
                                    state={`${shaperFlourish}/5`}
                                    stateTone={shaperFlourish >= 2 ? 'good' : 'neutral'}
                                    mechanic="+1 per signature move (one per stance). Never decays — persists between combats."
                                    status={[
                                        shaperFlourish >= 2
                                            ? `${shaperFlourish} banked — ultimates (2–5) available.`
                                            : 'Need 2+ for ultimates — land signature moves.',
                                    ]}
                                    usage="Spend 2–5 on ultimate abilities."
                                />
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
                                    'Silence Predator': {
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
                                    <ClassTip
                                        icon="🥋"
                                        tint="#b7791f"
                                        title={currentStance}
                                        state={currentStanceData.type || null}
                                        stateTone="neutral"
                                        mechanic={specBonus || 'Your current combat stance.'}
                                        status={[
                                            details.bonuses.length > 0 ? `+ ${details.bonuses.join(' · ')}` : null,
                                            details.penalties.length > 0 ? `− ${details.penalties.join(' · ')}` : null,
                                        ]}
                                        usage="Transitions cost 2–4 Momentum."
                                    />
                                );
                            })()}
                        </div>
                    )}

                    {/* Chronarch Time Shards & Temporal Strain Tooltips */}
                    {finalConfig.visual?.type === 'time-shards-strain' && (
                        <div>
                            {chronarchHoverSection === 'shards' && (
                                <ClassTip
                                    icon="fas fa-gem"
                                    tint="#38bdf8"
                                    title="Time Shards"
                                    subtitle="Chronarch Time Shards"
                                    state={`${chronarchTimeShards}/10 Shards`}
                                    stateTone={chronarchTimeShards >= 4 ? 'good' : 'neutral'}
                                    mechanic="Fuel for Flux abilities. Every basic spell banks +1 shard; shards persist between fights."
                                    status={[
                                        chronarchTimeShards >= 4
                                            ? `${chronarchTimeShards} banked — ready for heavy Flux.`
                                            : chronarchTimeShards > 0
                                                ? `Only ${chronarchTimeShards} banked — cast builders first.`
                                                : 'Empty — cast a basic spell to bank the first shard.',
                                    ]}
                                    usage="Click a diamond to set · Right-click −1 · Bed opens the ledger."
                                />
                            )}

                            {chronarchHoverSection === 'strain' && (() => {
                                const strainValue = chronarchTemporalStrain;
                                const getStrainState = (strain) => {
                                    if (strain >= 10) return { name: 'BACKLASH!', color: '#ef4444', tone: 'critical' };
                                    if (strain >= 9) return { name: 'Critical', color: '#ef4444', tone: 'bad' };
                                    if (strain >= 7) return { name: 'Danger', color: '#f87171', tone: 'bad' };
                                    if (strain >= 5) return { name: 'Warning', color: '#f97316', tone: 'warn' };
                                    if (strain >= 3) return { name: 'Caution', color: '#eab308', tone: 'warn' };
                                    return { name: 'Safe', color: '#22c55e', tone: 'good' };
                                };
                                const state = getStrainState(strainValue);

                                return (
                                    <ClassTip
                                        icon="fas fa-hourglass-half"
                                        tint={state.color}
                                        title="Temporal Strain"
                                        subtitle="Chronarch Paradox Strain"
                                        state={`${strainValue}/10 · ${state.name}`}
                                        stateTone={state.tone}
                                        mechanic="Paradox-weight from Flux abilities (+1 to +8 each). Decays −1 per turn when idle."
                                        status={[
                                            strainValue >= 10
                                                ? 'BACKLASH: phase out, lose next turn, roll the Anomaly Table.'
                                                : strainValue >= 7
                                                    ? 'One more Flux risks Backlash — cool down or Mend.'
                                                    : strainValue >= 4
                                                        ? 'Climbing — space out heavy Flux.'
                                                        : 'Safe — Flux freely.',
                                        ]}
                                        usage="Click a segment to set · Right-click −1 · Bed opens the ledger."
                                    />
                                );
                            })()}

                            {(!chronarchHoverSection || chronarchHoverSection === 'chronarch' || chronarchHoverSection === 'all') && (
                                <ClassTip
                                    icon="fas fa-hourglass-half"
                                    tint="#38bdf8"
                                    title="Astrolabe of Time"
                                    subtitle="Chronarch Shards & Temporal Strain"
                                    state={`${chronarchTimeShards}/10 Shards · ${chronarchTemporalStrain}/10 Strain`}
                                    stateTone={chronarchTemporalStrain >= 9 ? 'critical' : chronarchTemporalStrain >= 7 ? 'bad' : 'neutral'}
                                    mechanic="Dual temporal balance: bank Time Shards with basic spells to fuel Flux, while managing accumulating Temporal Strain to avoid timeline backlash."
                                    status={[
                                        `Shards: ${chronarchTimeShards}/10 available to fuel temporal manipulations.`,
                                        `Strain: ${chronarchTemporalStrain}/10 paradox weight (${chronarchTemporalStrain >= 10 ? 'BACKLASH!' : chronarchTemporalStrain >= 7 ? 'DANGER' : 'Stable'}).`,
                                        'Hover left wing for Shards or right wing for Strain details.'
                                    ]}
                                    usage="Click shard or strain pips to adjust · Click center dial for temporal console"
                                    hint="Chronarchs bend the stream of time, paying in paradox what they take in foresight."
                                />
                            )}
                        </div>
                    )}

                    {/* Covenbane Hexbreaker Charges Tooltips */}
                    {finalConfig.visual?.type === 'hexbreaker-charges' && hexbreakerHoverSection && (
                        <div>
                            {hexbreakerHoverSection === 'charges' && (() => {
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
                                    <ClassTip
                                        icon="⛓️"
                                        tint="#5d4037"
                                        title="Hexbreaker Charges"
                                        state={`${chargesValue}/${maxCharges}`}
                                        stateTone={chargesValue === maxCharges ? 'good' : 'neutral'}
                                        mechanic={`Combat abilities and attacks bank charges. Passive: ${bonuses.damage} damage, ${bonuses.speed} speed, crit ${bonuses.crit}.`}
                                        status={[
                                            chargesValue === maxCharges
                                                ? `FULL — Hexbreaker Fury ready: spend all ${maxCharges} for AoE damage + stun.`
                                                : `${chargesValue} banked — Shadow Step (1) · Curse Eater (2) · Dark Pursuit (3).`,
                                        ]}
                                        usage="Click the bar to spend charges."
                                    />
                                );
                            })()}

                            {hexbreakerHoverSection === 'counter' && (
                                <ClassTip
                                    icon="🎯"
                                    tint="#b7791f"
                                    title="Attack Counter"
                                    state={`${covenbaneAttackCounter}/3`}
                                    stateTone={covenbaneAttackCounter === 3 ? 'good' : 'neutral'}
                                    mechanic="Every 3rd attack deals bonus true damage (ignores DR and resistances). Base +1d6, +4d8 at 6 charges."
                                    status={[
                                        covenbaneAttackCounter === 3
                                            ? 'READY — next attack deals bonus true damage.'
                                            : `${3 - covenbaneAttackCounter} attack(s) until true damage.`,
                                    ]}
                                />
                            )}
                        </div>
                    )}

                    {/* Deathcaller Ascension Paths & Blood Tokens Tooltips */}
                    {finalConfig.visual?.type === 'ascension-blood' && ascensionHoverSection && (
                        <div>
                            {ascensionHoverSection === 'paths' && (() => {
                                const pathsArray = Array.isArray(localAscensionPaths) ? localAscensionPaths : [true, false, false, false, false, false, false];
                                const activePaths = pathsArray.filter(p => p).length;
                                const activePathsList = finalConfig.paths.filter((_, i) => pathsArray[i]);

                                return (
                                    <ClassTip
                                        icon="💀"
                                        tint="#6a1b9a"
                                        title="Necrotic Ascension"
                                        state={`${activePaths}/7 paths`}
                                        stateTone={activePaths > 0 ? 'good' : 'neutral'}
                                        mechanic="Each ascension path grants a boon — and a curse."
                                        status={activePathsList.length > 0
                                            ? activePathsList.map((path) => `${path.shortName}: +${path.boon} / −${path.curse}`)
                                            : ['No paths activated yet.']}
                                    />
                                );
                            })()}
                            {ascensionHoverSection === 'tokens' && (() => {
                                const tokensValue = localBloodTokens;
                                const warningThreshold = finalConfig.bloodTokens?.warningThreshold || 10;
                                const dangerThreshold = finalConfig.bloodTokens?.dangerThreshold || 20;
                                const burstDamage = tokensValue; // 1d10 per token

                                return (
                                    <ClassTip
                                        icon="🩸"
                                        tint="#c0392b"
                                        title="Blood Tokens"
                                        state={`${tokensValue} tokens`}
                                        stateTone={tokensValue >= dangerThreshold ? 'bad' : tokensValue >= warningThreshold ? 'warn' : 'neutral'}
                                        mechanic="1 HP sacrificed = 1 token (needs Crimson Pact). 1 token = +1d6 necrotic per spell."
                                        status={[
                                            tokensValue >= dangerThreshold
                                                ? `EXTREME: ${burstDamage}d10 burst (~${Math.floor(burstDamage * 5.5)} avg) within 10 min — spend them now.`
                                                : tokensValue >= warningThreshold
                                                    ? 'High count — spend soon or risk burst.'
                                                    : tokensValue > 0
                                                        ? `${tokensValue} banked — safe to hold a little longer.`
                                                        : 'Empty — sacrifice HP to mint tokens.',
                                        ]}
                                        usage="Spend tokens to empower necrotic spells."
                                    />
                                );
                            })()}
                        </div>
                    )}

                    {/* Dreadnaught DRP Tooltip */}
                    {finalConfig.visual?.type === 'drp-resilience' && resilienceHoverSection === 'drp' && (
                        <ClassTip
                            icon="🛡️"
                            tint="#546e7a"
                            title="Damage Resilience"
                            state={`${localDRP} DRP`}
                            stateTone={localDRP >= 10 ? 'good' : 'neutral'}
                            mechanic={`+1 DRP per 5 damage taken (from full damage). Spend on Shadow Shield (2:1), Wraith Strike (+1d6 per 5 DRP), Necrotic Aura (15 DRP).${localDRP >= 10 ? ` Resisting: ${selectedResistanceType} (halved).` : ''}`}
                            status={[
                                localDRP >= 10
                                    ? `Passives live: +${Math.floor(localDRP / 10)} HP/turn, revive at ${localDRP * 2} HP on death.`
                                    : 'Need 10+ DRP for passive benefits — go take a hit.',
                            ]}
                        />
                    )}

                    {/* Exorcist Dominance Tooltip */}
                    {finalConfig.visual?.type === 'dominance-die' && dominanceHoverSection === 'dominance' && (
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
                                        <ClassTip
                                            icon="😈"
                                            tint="#8B0000"
                                            title="Dominance Die"
                                            state="No demon bound"
                                            stateTone="warn"
                                            mechanic="Bind a defeated demon with a 10-minute ritual (2 slots, 4 as Demonologist). Its die decays d12 → d10 → d8 → d6 → 0 per action/hit."
                                            usage="Bind a demon to begin."
                                        />
                                    );
                                }

                                return (
                                    <ClassTip
                                        icon="⛓️"
                                        tint={state.color}
                                        title={`Dominance: ${currentDemon.name}`}
                                        state={`${ddLabel} · ${state.name}`}
                                        stateTone={currentDD <= 6 ? 'bad' : 'neutral'}
                                        mechanic={`Tier ${currentDemon.tier} demon. Die decays per action/hit; at 0 it saves DC ${currentDemon.saveDC} or escapes (d6: 1–2 flees, 3–6 attacks you).`}
                                        status={[
                                            currentDD === 0
                                                ? 'ESCAPED — re-bind with a ritual.'
                                                : currentDD <= 6
                                                    ? 'Near escape — Reassert Dominance (5 mana) or Chain of Command (4 mana) restores to max.'
                                                    : 'Under control — spend actions freely.',
                                        ]}
                                    />
                                );
                            })()}
                        </div>
                    )}

                    {/* False Prophet Madness Tooltip */}
                    {finalConfig.visual?.type === 'madness-gauge' && (
                        <ClassTip
                            icon="fas fa-eye"
                            tint="#c026d3"
                            title="The Silent Eye of the Void"
                            subtitle="False Prophet Wyrd Fracture & Madness"
                            state={`${localMadness}/20 · ${getDangerLevel ? getDangerLevel(localMadness).name : (localMadness >= 20 ? 'Convulsion' : localMadness >= 15 ? 'Danger' : 'Ascending')}`}
                            stateTone={localMadness >= 20 ? 'critical' : localMadness >= 15 ? 'bad' : localMadness >= 10 ? 'warn' : 'neutral'}
                            mechanic={`Spells generate Madness; some spend it. Shadow damage +${localMadness}. Milestones: 6 (Veil), 9 (Vision), 10 (+2d6 damage), 12 (Apocalypse), 15 (Danger), 20 (Convulsion).`}
                            status={[
                                localMadness >= 20
                                    ? 'CONVULSION ACTIVE: Roll 1d6 (burst · stun · disadvantage · teleport · fear · echoes), then reset to 0.'
                                    : localMadness >= 15
                                        ? 'Convulsion near (15+) — spend Madness or avoid generators to prevent mental fracture.'
                                        : localMadness >= 10
                                            ? 'Empowered (10+) — next shadow spell deals +2d6 bonus damage.'
                                            : 'Building — safe to generate.',
                            ]}
                            usage="Spend Madness on empowered shadow spells · Click the Eye to adjust."
                            hint="False Prophets pierce the veil of reality, harnessing forbidden madness until reality snaps back."
                        />
                    )}

                    {/* Fate Weaver Threads Tooltip */}
                    {modifiedConfig.visual?.type === 'threads-of-destiny' && fateWeaverHoverSection === 'threads' && (
                        <ClassTip
                            icon="🧵"
                            tint="#7b1fa2"
                            title="Threads of Destiny"
                            state={`${localThreads}/${modifiedConfig.mechanics?.max ?? 13} · ${getThreadLevel(localThreads).name}`}
                            stateTone={localThreads >= 5 ? 'good' : 'neutral'}
                            mechanic={`Failures weave threads. Spend 2 to call a card${selectedFateWeaverSpec === 'thread-weaver' && localThreads >= 3 ? ', 3 to force failure, 5 to force success' : ''}. ${selectedFateWeaverSpec === 'fortune-teller' ? 'Seer: see top card always, 1 thread for ally advantage.' : selectedFateWeaverSpec === 'card-master' ? 'Hold 7 cards, call 2 per 2 threads.' : '+1 thread on all gains.'}`}
                            status={[
                                localThreads >= 5
                                    ? `${localThreads} banked — fate-forcing available.`
                                    : localThreads >= 2
                                        ? 'Enough to call a card.'
                                        : 'Fail forward to weave more threads.',
                            ]}
                        />
                    )}

                    {/* Gambit Dual Ledger Tooltip */}
                    {finalConfig.visual?.type === 'fortune-points-gambling' && gamblerHoverSection === 'fp' && (() => {
                        const fpValue = finalClassResource.current ?? localFortunePoints;
                        const maxFP = finalClassResource.max ?? 7;
                        const riskValue = finalClassResource.risk ?? 0;
                        const maxRisk = 13;

                        return (
                            <ClassTip
                                icon="🪙"
                                tint="#b7791f"
                                title="Gambit Dual Ledger"
                                state={`${fpValue}/${maxFP} FP · ${riskValue}/${maxRisk} debt`}
                                stateTone={riskValue >= 10 ? 'bad' : fpValue === 0 ? 'warn' : 'good'}
                                mechanic="Spend Fortune to bend rolls (earned on successes and crits). Pushing luck accrues Karmic Debt — at 13 it demands payment in penalties."
                                status={[
                                    fpValue === 0
                                        ? 'Broke — earn FP before betting on rolls.'
                                        : `${fpValue} FP ready to spend.`,
                                    riskValue >= 10
                                        ? 'Debt nearly due — stop pushing.'
                                        : riskValue > 0
                                            ? `${riskValue} debt weighing on you.`
                                            : 'No debt outstanding.',
                                ]}
                            />
                        );
                    })()}

                    {/* Apex Marks & Companion Tooltip */}
                    {finalConfig.visual?.type === 'quarry-marks-companion' && huntressHoverSection && (
                        <div>
                            {huntressHoverSection === 'marks' && (() => {
                                const qmValue = finalClassResource.current ?? localQuarryMarks;
                                const maxQM = finalClassResource.max ?? 5;

                                return (
                                    <ClassTip
                                        icon="🎯"
                                        tint="#8B0000"
                                        title="Quarry Marks"
                                        state={`${qmValue}/${maxQM}`}
                                        stateTone={qmValue >= maxQM ? 'good' : 'neutral'}
                                        mechanic="Hunter strikes mark the quarry. Marks empower companion actions and unleash glaive chains."
                                        status={[
                                            qmValue >= maxQM
                                                ? 'FULL — unleash the glaive chain.'
                                                : qmValue > 0
                                                    ? `${qmValue} marked — keep striking to build.`
                                                    : 'Unmarked — land a hunter strike.',
                                        ]}
                                    />
                                );
                            })()}

                            {huntressHoverSection === 'companion' && (() => {
                                const companionHPValue = finalClassResource.companionHP ?? companionHP;
                                const companionMaxHPValue = finalClassResource.companionMaxHP ?? companionMaxHP;

                                return (
                                    <ClassTip
                                        icon="🐺"
                                        tint="#2E7D32"
                                        title="Beast Companion"
                                        state={`${companionHPValue}/${companionMaxHPValue} HP`}
                                        stateTone={companionHPValue <= 0 ? 'bad' : companionHPValue < companionMaxHPValue / 2 ? 'warn' : 'good'}
                                        mechanic="Your loyal beast fights beside you. At 0 HP it is incapacitated."
                                        status={[
                                            companionHPValue <= 0
                                                ? 'DOWN — incapacitated until revived.'
                                                : companionHPValue < companionMaxHPValue
                                                    ? 'Wounded — protect or heal it.'
                                                    : 'Healthy — fighting fit.',
                                        ]}
                                    />
                                );
                            })()}
                        </div>
                    )}

                    {/* Animist Tooltip */}
                    {finalConfig.visual?.type === 'ancestral-resonance' && animistHoverSection === 'resonance' && (
                        <div>
                            <ClassTip
                                icon="🔥"
                                tint="#2E7D32"
                                title="Ancestral Resonance"
                                state={`${finalClassResource.current ?? 0}/${finalClassResource.max ?? 20} AR`}
                                stateTone="neutral"
                                mechanic="Attunement with ancestral spirits. Powers runic invocations, spirit guides, and spirit-ward shields."
                            />
                        </div>
                    )}

                    {/* Lichborne Phylactery Tooltip - Only shows phylactery info, no aura content */}
                    {finalConfig.visual?.type === 'eternal-frost-phylactery' && phylacteryHoverSection === 'phylactery' && phylacteryHoverSection !== 'aura' && (
                        <div>
                            {(() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[lichborneSpec] || specs.frostbound_tyrant;
                                const maxPhylactery = currentSpec.maxPhylactery;
                                const specName = currentSpec.name;
                                
                                return (
                                    <ClassTip
                                        icon="❄️"
                                        tint="#4fc3f7"
                                        title={`${specName} Phylactery`}
                                        state={`${localPhylacteryHP}/${maxPhylactery} HP`}
                                        stateTone={localPhylacteryHP <= 0 ? 'bad' : 'neutral'}
                                        mechanic={`+1d6 HP per frost-spell kill banked. Death: spend it all to resurrect (once/combat) and freeze ${lichborneSpec === 'phylactery_guardian' ? '25' : '15'}ft for 1 round. ${lichborneSpec === 'frostbound_tyrant' ? 'Freeze +1d4 rounds, frozen foes +1d6, 50% shatter (3d6).' : lichborneSpec === 'spectral_reaper' ? 'Frost +1d6 necrotic; kills raise spectral minions (max 4).' : 'Stores 75 HP.'}`}
                                        status={[
                                            localPhylacteryHP <= 0
                                                ? 'Empty — no resurrection banked. Secure frost kills.'
                                                : `${localPhylacteryHP} HP banked — death will spend it to revive you.`,
                                        ]}
                                    />
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
                                            return { bonus: '+3 DR, immune to Charm/Fear', penalty: 'Attacks −2', theme: 'Defense' };
                                        case 'waxing_moon':
                                            return { bonus: '+1d6 damage, +10 ft speed', penalty: 'Cannot be healed', theme: 'Surge' };
                                        case 'full_moon':
                                            return { bonus: '+2d8 sacred damage, ignores 50% DR', penalty: 'Delirium risk, −5 max HP/round', theme: 'Offense' };
                                        case 'waning_moon':
                                            return { bonus: '25% vampiric drain, −3 mana cost', penalty: '−2 DR, −10 max HP', theme: 'Sustain' };
                                        default:
                                            return { bonus: '', penalty: '', theme: '' };
                                    }
                                };

                                const currentBonuses = getPhaseBonuses(currentLunarPhase);

                                return (
                                    <ClassTip
                                        icon="🌙"
                                        tint="#7b1fa2"
                                        title={currentPhaseConfig.name}
                                        state={currentBonuses.theme}
                                        stateTone="neutral"
                                        mechanic={`3 rounds per phase, auto-advances New → Waxing → Full → Waning. Now: ${currentBonuses.bonus}${currentBonuses.penalty !== 'None' ? `, drawback: ${currentBonuses.penalty}` : ''}.`}
                                        status={[
                                            `All phases — New: +3 DR · Waxing: +1d6 damage/+10 ft speed · Full: +2d8 sacred, ignores 50% DR · Waning: 25% vampiric, −3 mana cost.`,
                                        ]}
                                        usage="Shift phase early for 8 mana (resets the timer)."
                                    />
                                );
                            })()}

                            {lunarchHoverSection === 'timer' && (
                                <ClassTip
                                    icon="⏱️"
                                    tint="#7b1fa2"
                                    title="Phase Timer"
                                    state={`Round ${roundsInPhase + 1}/3`}
                                    stateTone={roundsInPhase >= 2 ? 'warn' : 'neutral'}
                                    mechanic={`Phase auto-advances after round 3.${lunarchSpec === 'moonlight_sentinel' ? ' Sentinel: Full-Moon crits +2d6 radiant.' : lunarchSpec === 'starfall_invoker' ? ' Invoker: Full-Moon AoE +5 ft.' : ' Guardian: Waxing healing +1d6 temp HP.'}`}
                                    status={[
                                        roundsInPhase >= 2
                                            ? 'Last round — spend the current bonus now.'
                                            : `${2 - roundsInPhase} round(s) left on this phase.`,
                                    ]}
                                />
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
                            <ClassTip
                                icon="♪"
                                tint="#9370DB"
                                title={note.name}
                                state={`${count}/${maxPerNote}`}
                                stateTone={count > 0 ? 'good' : 'neutral'}
                                mechanic={`${note.function} — banked by ${note.generatedBy}, spent in ${note.usedIn?.[0] || 'cadences'}.`}
                                status={[
                                    count > 0
                                        ? `${count} banked — spendable.`
                                        : 'Empty — play builders first.',
                                ]}
                            />
                        );
                    })()}

                    {/* Oracle Prophetic Visions Tooltip */}
                    {finalConfig.visual?.type === 'prophetic-visions' && visionsHoverSection && (
                        <div>
                            {visionsHoverSection === 'visions' && (() => {
                                const specs = finalConfig.visual;
                                const currentSpec = specs[oracleSpec] || specs.seer;
                                const specName = currentSpec.name;
                                const maxVisions = specs.max || 10;
                                const visionsValue = localVisions;

                                return (
                                    <ClassTip
                                        icon="🔮"
                                        tint="#5c6bc0"
                                        title={`${specName} Visions`}
                                        state={`${visionsValue}/${maxVisions}`}
                                        stateTone={visionsValue >= 3 ? 'good' : 'neutral'}
                                        mechanic={`Predictions bank visions (simple +1, moderate +2, complex +3). Spend 1–3 to Alter Fate. ${oracleSpec === 'seer' ? 'Seer: +1 per correct prediction, free predictions, initiative advantage.' : oracleSpec === 'truthseeker' ? 'Truthseeker: lies/illusions uncovered for +1 each.' : 'Fateseer: on a correct prediction, spend 1 for a fate effect (reroll, −1d6, adv/dis).'}`}
                                        status={[
                                            visionsValue >= 3
                                                ? `${visionsValue} banked — Alter Fate freely.`
                                                : visionsValue > 0
                                                    ? 'Thin — make predictions to bank more.'
                                                    : 'Empty — predict something.',
                                        ]}
                                        usage="Make predictions to gain; spend to Alter Fate."
                                    />
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
                                    <ClassTip
                                        icon="🔥"
                                        tint="#e64a19"
                                        title="Berserker Rage"
                                        state={isOverheated ? `${rageValue} · OVERHEAT` : currentState ? `${rageValue}/100 · ${currentState.name}` : `${rageValue}/100`}
                                        stateTone={isOverheated ? 'bad' : 'neutral'}
                                        mechanic="Rage fuels brutal states — higher rage, harder hits, thinner control."
                                        status={[
                                            currentState && currentState.bonuses?.length > 0 ? `+ ${currentState.bonuses.join(' · ')}` : null,
                                            currentState && currentState.penalties?.length > 0 ? `− ${currentState.penalties.join(' · ')}` : null,
                                            isOverheated ? 'OVERHEAT: spend it this round or take 2d6 damage.' : null,
                                        ]}
                                        usage="Spend rage on brutal abilities before it overcooks."
                                    />
                                );
                            })()}
                        </div>
                    )}

                    {/* Harbinger Tooltips */}
                    {finalConfig.visual?.type === 'mayhem-gauge' && chaosWeaverHoverSection === 'mayhem' && (
                        <div>
                            <ClassTip
                                icon="💥"
                                tint="#5E35B1"
                                title="Mayhem Gauge"
                                state={`${finalClassResource.current || 0}/${finalClassResource.max || 100}`}
                                stateTone={(finalClassResource.current || 0) >= 100 ? 'warn' : 'neutral'}
                                mechanic="Entropy pressure: amplifies all spells as it rises, and can be spent to widen prophecy ranges. At 100, Wild Surge triggers and Mayhem resets."
                                status={[
                                    (finalClassResource.current || 0) >= 100
                                        ? 'MAXIMUM — Wild Surge ready. Unleash it.'
                                        : 'Building — every spell hits a little harder.',
                                ]}
                            />
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

                                                                    
    // Hide CR bar if class has no resource system (max === 0)
    // This prevents showing "0/0" bars for GMs or characters without class resources
    if (!finalClassResource.max || finalClassResource.max === 0) {
        return null;
    }

    return renderTooltip();
};

export default ResourceTooltip;