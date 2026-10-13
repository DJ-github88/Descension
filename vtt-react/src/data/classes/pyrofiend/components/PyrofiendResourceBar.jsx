import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PyrofiendResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import PyrofiendVeilArt from './PyrofiendVeilArt';
import { PYRO_VEIL_MAX, normalizePyroResource, advancePyroDebtCall, getPyroRingLabel } from '../../../pyrofiendResourceContract';

const STAGE_NAMES = {
    0: 'Mortal',
    1: 'Ember',
    2: 'Smolder',
    3: 'Scorch',
    4: 'Blaze',
    5: 'Inferno',
    6: 'Conflagration',
    7: 'Cataclysm',
    8: 'Apocalypse',
    9: 'Oblivion'
};

const DRAWBACK_TEXTS = {
    0: 'None',
    1: '-2 Hit chance (distortions)',
    2: '1d4 Wyrd dmg/turn',
    3: '-10ft Movement, Fatigue',
    4: '+1d6 Damage taken from all sources',
    5: 'Bleeding: 1d6 blight/turn',
    6: 'Cannot be healed by others, disadvantage on Insight/Perception',
    7: '-15ft Speed, 1d6 Suffocation',
    8: '2d4 self-damage, disadvantage on Agility checks',
    9: 'Debt Call latches for three own turns; cooling does not cancel it. Terminal consequences require resolution.'
};

const PyrofiendResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const normalizedResource = normalizePyroResource(classResource);
    const infernoLevel = normalizedResource.current;
    const maxInfernoLevel = PYRO_VEIL_MAX;
    const debtCall = normalizedResource.debtCall;
    const remainingTurnsLabel = `${debtCall.turnsRemaining} own turn${debtCall.turnsRemaining === 1 ? '' : 's'}`;
    const ownTurnSequence = useRef(0);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [hoveredRune, setHoveredRune] = useState(null);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [infernoLevel, debtCall.turnsRemaining, debtCall.latched]);


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

    // Chat logging
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        const message = isPositive
            ? `${characterName} stoked ${absAmount} ${resourceName}`
            : `${characterName} cooled ${absAmount} ${resourceName}`;

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'infernoLevel',
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleInfernoChange = (delta) => {
        const newLevel = Math.max(0, Math.min(maxInfernoLevel, infernoLevel + delta));
        const actualAmount = Math.abs(newLevel - infernoLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Inferno Level', actualAmount, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newLevel);
        }
    };

    const handleInfernoSet = (level) => {
        const newLevel = Math.max(0, Math.min(maxInfernoLevel, level));
        const actualAmount = Math.abs(newLevel - infernoLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Inferno Level', actualAmount, newLevel > infernoLevel);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newLevel);
        }
    };

    const reportOwnTurn = () => {
        if (!isOwner || !onClassResourceUpdate) return;
        const result = advancePyroDebtCall(normalizedResource, `reported-own-turn:${Date.now()}:${++ownTurnSequence.current}`);
        if (!result.accepted) return;
        onClassResourceUpdate('debtCall', result.resource.debtCall);
        addCombatNotification({ type: 'combat_resource', attacker: getActorName(), target: currentPlayerName,
            amount: 1, resourceType: 'debtCall', isPositive: false,
            customMessage: `${currentPlayerName} reported an own turn: Debt Call ${result.resource.debtCall.turnsRemaining} remaining${result.resource.debtCall.expired ? ' — terminal consequence due' : ''}.` });
    };

    const getStageName = (level) => STAGE_NAMES[level] || 'Unknown';
    const getDrawbackText = (level) => DRAWBACK_TEXTS[level] || 'Unknown';


    const isSurging = infernoLevel >= 5;
    const isHeresy = infernoLevel >= 6;
    const isCatastrophic = debtCall.latched;

    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); handleInfernoChange(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); handleInfernoChange(-1); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowControls(!showControls); }
        if (e.key === 'Escape') { setShowControls(false); setShowTooltip(false); }
    };

    return (
        <div className={`pyrofiend-resource-wrapper ${size} ${isCatastrophic ? 'catastrophic-warning' : ''} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    role="slider"
                    tabIndex={isOwner ? 0 : -1}
                    aria-label={`Inferno Veil, stage ${infernoLevel} of ${maxInfernoLevel}, ${getStageName(infernoLevel)}, ${getPyroRingLabel(infernoLevel)}${debtCall.latched ? `, Debt Call ${remainingTurnsLabel} remaining` : ''}`}
                    aria-valuemin={0}
                    aria-valuemax={maxInfernoLevel}
                    aria-valuenow={infernoLevel}
                    className={`pyrofiend-resource-bar ${size} clickable ${isSurging ? 'surging' : ''} ${isHeresy ? 'heresy' : ''} ${isCatastrophic ? 'catastrophic' : ''}`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => {
                        setShowTooltip(false);
                        setHoveredRune(null);
                    }}
                    onFocus={() => { if (!showControls) setShowTooltip(false); }}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isOwner) {
                            setShowControls(!showControls);
                            if (showControls) setShowTooltip(false);
                        }
                    }}
                >
                    <PyrofiendVeilArt
                        infernoLevel={infernoLevel}
                        debtLatched={debtCall.latched}
                        hoveredRune={hoveredRune}
                        isOwner={isOwner}
                        getStageName={getStageName}
                        onRuneEnter={setHoveredRune}
                        onRuneLeave={() => setHoveredRune(null)}
                        onRuneSelect={handleInfernoSet}
                    />
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip pyrofiend-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-fire-flame-curved"
                        tint="#ff4500"
                        title={`${getStageName(infernoLevel)} (Stage ${infernoLevel})`}
                        subtitle="Pyrofiend Inferno Crucible"
                        state={`${infernoLevel >= 9 ? '+10' : `+${infernoLevel}`} ember/hit`}
                        stateTone={infernoLevel >= 7 ? 'bad' : infernoLevel >= 5 ? 'warn' : 'neutral'}
                        mechanic={`${getPyroRingLabel(infernoLevel)}: Each stage adds ember damage and drawbacks. Reaching nine latches a three-own-turn Debt Call; cooling can lower the Veil but cannot cancel it.`}
                        status={[
                            debtCall.latched
                                ? { text: debtCall.expired ? 'Debt Call expired — terminal consequence due. Resolve detonation/death effects separately.' : `Debt Call latched — ${remainingTurnsLabel} remaining, even after cooling.`, tone: 'critical' }
                                : infernoLevel >= 6
                                    ? { text: 'No outside healing. Whisper: Spirit save DC 12 + level each turn or your next attack is forced onto the nearest creature.', tone: 'bad' }
                                    : infernoLevel >= 5
                                        ? { text: 'Infernal Surge live — next ember spell +2d6. The Whisper watches; cool it or commit.', tone: 'warn' }
                                        : infernoLevel > 0
                                            ? 'Warming up — damage climbing, drawbacks still mild.'
                                            : 'Cold — cast ember spells to ascend.',
                        ]}
                        usage={isOwner ? 'Click the bar for controls · Click a seal to ascend or cool straight to it · Arrow keys stoke/cool.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Compact Unified Pathfinder Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container pyrofiend-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                            return Math.max(12, Math.min(hudBottom + 8, window.innerHeight - Math.min(560, window.innerHeight - 24) - 12));
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            const width = Math.min(340, window.innerWidth - 24);
                            return Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
                        })(),
                        width: Math.min(340, window.innerWidth - 24),
                        maxHeight: Math.min(560, window.innerHeight - 24),
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        zIndex: 100000
                    }}
                >
                    <div className="pyro-menu">
                        {/* Heading: the stage as a seal, not a boxed label */}
                        <header className="pyro-menu-head">
                            <span className={`pyro-menu-seal tier-${infernoLevel >= 7 ? 'severe' : infernoLevel >= 5 ? 'warn' : 'calm'}`}>{infernoLevel}</span>
                            <div className="pyro-menu-titles">
                                <div className="pyro-menu-eyebrow">Inferno: Stage {infernoLevel}/{maxInfernoLevel}</div>
                                <div className="pyro-menu-phase">{getStageName(infernoLevel)}</div>
                                <div className="pyro-menu-ring">{getPyroRingLabel(infernoLevel)}</div>
                            </div>
                            <button type="button" className="pyro-menu-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>

                        {/* What the fire costs right now */}
                        <div className={`pyro-burden ${infernoLevel >= 7 ? 'is-severe' : infernoLevel >= 5 ? 'is-warn' : ''}`}>
                            <span className="pyro-burden-label">{infernoLevel === 0 ? 'The fire is quiet' : 'The fire takes its due'}</span>
                            <p className="pyro-burden-text">{getDrawbackText(infernoLevel)}</p>
                        </div>

                        {/* Stage track: click any stage to jump straight to it */}
                        <div className="pyro-track" role="group" aria-label="Set Inferno stage">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    title={`${getStageName(lvl)} — ${getDrawbackText(lvl)}`}
                                    className={`pyro-pip ${infernoLevel === lvl ? 'active' : ''} ${lvl <= infernoLevel ? 'lit' : ''} ${[5, 6, 9].includes(lvl) ? 'gate' : ''}`}
                                    onClick={() => handleInfernoSet(lvl)}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>

                        <div className="pyro-stoke-row">
                            <button className="context-menu-button spend" onClick={() => handleInfernoChange(-1)}>
                                <i className="fas fa-snowflake" aria-hidden="true"></i> -1 (Cool)
                            </button>
                            <button className="context-menu-button gain" onClick={() => handleInfernoChange(1)}>
                                <i className="fas fa-fire" aria-hidden="true"></i> +1 (Stoke)
                            </button>
                        </div>

                        {/* Debt Call: quiet until it matters */}
                        <section className={`pyro-debt ${debtCall.latched ? (debtCall.expired ? 'is-expired' : 'is-latched') : 'is-idle'}`}>
                            <div className={`pyro-menu-line ${debtCall.latched ? 'is-debt' : ''}`}>
                                {!debtCall.latched ? 'Debt Call: not called' : debtCall.expired
                                    ? 'Debt Call expired — terminal consequence due'
                                    : `Debt Call latched: ${remainingTurnsLabel} remaining`}
                            </div>
                            <button className="context-menu-button pyro-debt-btn" onClick={reportOwnTurn} disabled={!debtCall.latched || debtCall.expired}>Record next own turn</button>
                        </section>

                        {/* Thresholds */}
                        <div className="pyro-gates-title">Thresholds</div>
                        <ul className="pyro-gates" aria-label="Veil thresholds">
                            <li className={`pyro-gate gate-whisper ${infernoLevel >= 5 ? 'reached' : ''}`}>
                                <span className="pyro-gate-seal">5</span>
                                <span className="pyro-gate-name">Whisper</span>
                                <span className="pyro-gate-note">Surge wakes. Each turn, save with Spirit or your next attack strikes the nearest creature.</span>
                            </li>
                            <li className={`pyro-gate gate-heresy ${infernoLevel >= 6 ? 'reached' : ''}`}>
                                <span className="pyro-gate-seal">6</span>
                                <span className="pyro-gate-name">Heresy</span>
                                <span className="pyro-gate-note">No one else can heal you. Disadvantage on Insight and Perception.</span>
                            </li>
                            <li className={`pyro-gate gate-oblivion ${infernoLevel >= 9 ? 'reached' : ''}`}>
                                <span className="pyro-gate-seal">9</span>
                                <span className="pyro-gate-name">Oblivion</span>
                                <span className="pyro-gate-note">The Debt Call latches for three of your turns.</span>
                            </li>
                        </ul>

                        <ClassMenuSpells className="Pyrofiend" resourceTypes={['inferno_veil']} resourceLabel="Inferno" current={infernoLevel} />
                        <details className="pyro-notes">
                            <summary>How this tracker works</summary>
                            <p>Damage comes from your spell; this tracker adds no bonuses or Surge.</p>
                            <p>Record your own turns here. Enemy turns, cooling and rest neither advance nor cancel the Debt Call.</p>
                        </details>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PyrofiendResourceBar;
