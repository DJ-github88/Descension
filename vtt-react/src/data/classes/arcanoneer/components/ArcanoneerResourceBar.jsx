import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ArcanoneerResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import SpellTooltip from '../../../../components/spellcrafting-wizard/components/common/SpellTooltip';
import { formulationToSpell } from '../formulationToSpell';
import { migrateBlockId } from '../../../../utils/arcanoneerMigration';
import SpellCastConfirmation from '../../../../components/ui/SpellCastConfirmation';

/**
 * Single source of truth for canonical elements with rich Arcanoneer styling
 */
const CANONICAL_ELEMENTS = [
    { id: 'arcane', name: 'Arcane', abbrev: 'ARC', color: '#9370DB', lightColor: '#d8b4fe', d8Value: 1, theme: 'Raw Magic', summary: 'Arcane damage, kinetic disorientation', flavor: 'The shape behind all other shapes, raw kinetic intent.' },
    { id: 'sacred', name: 'Sacred', abbrev: 'SAC', color: '#eab308', lightColor: '#fef08a', d8Value: 2, theme: 'Divine Light', summary: 'Sacred damage, blinding, protection, cleansing', flavor: 'The first clause of the First Contract: let there be sight.' },
    { id: 'blight', name: 'Blight', abbrev: 'BLI', color: '#8b5cf6', lightColor: '#c084fc', d8Value: 3, theme: 'Darkness', summary: 'Blight damage, curses, entropic decay', flavor: 'The silence after the clause, what the light leaves behind.' },
    { id: 'ember', name: 'Ember', abbrev: 'EMB', color: '#ea580c', lightColor: '#fdba74', d8Value: 4, theme: 'Flames', summary: 'Ember damage, ignition, combustion', flavor: 'The first tool humanity mastered, captured in a crystal shard.' },
    { id: 'rime', name: 'Rime', abbrev: 'RIM', color: '#0284c7', lightColor: '#7dd3fc', d8Value: 5, theme: 'Rime', summary: 'Rime damage, slowing, brittle', flavor: 'Entropy deferred, motion held still in crystal lattice.' },
    { id: 'primal', name: 'Primal', abbrev: 'PRI', color: '#16a34a', lightColor: '#86efac', d8Value: 6, theme: 'Growth', summary: 'Primal damage, grasping vines, poison (condition)', flavor: 'The green arc between seed and sky.' },
    { id: 'storm', name: 'Storm', abbrev: 'STO', color: '#0891b2', lightColor: '#67e8f9', d8Value: 7, theme: 'Storm', summary: 'Storm damage, stunning, chain resonance', flavor: 'The sky\'s voice captured in crystal, raw current and sound.' },
    { id: 'wyrd', name: 'Wyrd', abbrev: 'WYR', color: '#db2777', lightColor: '#f472b6', d8Value: 8, theme: 'Unpredictability', summary: 'Wyrd damage, chaotic variable effects', flavor: 'The clause Morvane will not interpret.', isGradient: true }
];

/**
 * ArcanoneerResourceBar: "The Calibrated Iron Sleeve"
 *
 * Magi-Ballistic Focus Cylinder in pure SVG & CSS.
 * - Sized cleanly for the Party HUD without stretching the card (74px height).
 * - Forged Gunmetal and Guild Brass apparatus with mechanical rivets & pressure gauge.
 * - 8 Themed Elemental Chambers with radiant 3D crystal orbs, glyphs, and brass pips.
 * - Kinetic Ignition Primer ("ROLL 4d8") with mechanical tumbler spin.
 * - Non-scrolling Matrix Explorer modal: select an element to instantly view its 8 combinations.
 */
const ArcanoneerResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null,
    showcase = false,
}) => {
    // ===== Configuration =====
    const blocks = (config?.elements && config.elements.length > 0) ? config.elements : CANONICAL_ELEMENTS;
    const maxBank = config?.mechanics?.max || 12;
    const matrix = config?.combinationMatrix || null;
    const matrixEntries = matrix?.entries || [];

    const canEdit = isOwner;

    // ===== State =====
    const normalizeSpheres = (arr) => Array.isArray(arr) ? arr.map(migrateBlockId) : [];
    const [localSpheres, setLocalSpheres] = useState(normalizeSpheres(classResource?.spheres));
    const [isRolling, setIsRolling] = useState(false);
    const [hoveredBlockId, setHoveredBlockId] = useState(null);
    const [showBarTooltip, setShowBarTooltip] = useState(false);
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    const [lastRollResult, setLastRollResult] = useState(null);

    // Matrix search/picker state: null = all ready or prompt, elementId = filter by element
    const [selectedElementA, setSelectedElementA] = useState(null);
    const [selectedElementB, setSelectedElementB] = useState(null);

    // Spell Cast Confirmation Modal state
    const [spellToCast, setSpellToCast] = useState(null);

    // Formulation spellcard hover
    const [hoveredFormulation, setHoveredFormulation] = useState(null);
    const formHoverTimeoutRef = useRef(null);
    const formHideTimeoutRef = useRef(null);

    // Keep localSpheres in sync if upstream changes
    useEffect(() => {
        const incoming = normalizeSpheres(classResource?.spheres);
        if (incoming.length !== localSpheres.length || incoming.some((v, i) => v !== localSpheres[i])) {
            setLocalSpheres(incoming);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classResource?.spheres]);

    const barRef = useRef(null);
    const matrixModalRef = useRef(null);

    // Shared tooltip hook for element and bar hovering
    const tooltipRef = useResourceBarTooltip(
        barRef,
        (hoveredBlockId !== null || showBarTooltip) && !showMatrixModal,
        [hoveredBlockId, showBarTooltip, showMatrixModal, localSpheres],
        {
            preferredWidth: 320,
            preferredHeight: 240,
        }
    );

    // Close Matrix Modal on outside click
    useEffect(() => {
        if (!showMatrixModal) return;
        const onDown = (e) => {
            const inModal = matrixModalRef.current && matrixModalRef.current.contains(e.target);
            const inBar = barRef.current && barRef.current.contains(e.target);
            if (!inModal && !inBar) {
                setShowMatrixModal(false);
            }
        };
        const id = setTimeout(() => document.addEventListener('mousedown', onDown), 0);
        return () => {
            clearTimeout(id);
            document.removeEventListener('mousedown', onDown);
        };
    }, [showMatrixModal]);

    // Stores & Combat Logging
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logChange = (blockName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        if (absAmount === 0) return;
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const verb = isPositive ? 'chambered' : 'expelled';
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'classResource',
            isPositive,
            customMessage: `${characterName} ${verb} ${absAmount} ${blockName} sphere${absAmount === 1 ? '' : 's'}`
        });
    };

    // Derived values
    const blockCounts = useMemo(() => {
        const counts = {};
        for (const b of blocks) counts[b.id] = 0;
        for (const id of localSpheres) {
            if (counts[id] !== undefined) counts[id] += 1;
        }
        return counts;
    }, [localSpheres, blocks]);

    const totalBanked = localSpheres.length;

    // Ready formulations
    const readyFormulations = useMemo(() => {
        const out = [];
        for (const entry of matrixEntries) {
            const [a, b] = entry.elements;
            const need = (a === b) ? 2 : 1;
            if ((blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need) {
                out.push(entry);
            }
        }
        return out;
    }, [matrixEntries, blockCounts]);

    const readyCount = readyFormulations.length;

    // Filtered formulations for the Matrix Explorer (NO SCROLLING)
    const filteredFormulations = useMemo(() => {
        if (selectedElementA && selectedElementB) {
            // Target exact pair
            return matrixEntries.filter(entry => {
                const [a, b] = entry.elements;
                return (a === selectedElementA && b === selectedElementB) || (a === selectedElementB && b === selectedElementA);
            });
        }
        if (selectedElementA) {
            // Target all 8 combinations involving selectedElementA
            return matrixEntries.filter(entry => entry.elements.includes(selectedElementA));
        }
        // Default when nothing selected: show ready formulations (if any), otherwise pure pairs (8 items)
        if (readyFormulations.length > 0) {
            return readyFormulations.slice(0, 8);
        }
        // Pure pairs (exactly 8 items, fits cleanly in 2x4 grid without scrolling)
        return matrixEntries.filter(entry => entry.elements[0] === entry.elements[1]);
    }, [matrixEntries, selectedElementA, selectedElementB, readyFormulations]);

    // Actions
    const commitSpheres = (next, changeLog = null) => {
        const capped = next.slice(0, maxBank);
        setLocalSpheres(capped);
        if (onClassResourceUpdate) onClassResourceUpdate('spheres', capped);
        if (changeLog) logChange(changeLog.name, changeLog.amount, changeLog.isPositive);
    };

    const addBlock = (blockId) => {
        if (!canEdit) return;
        if (totalBanked >= maxBank) return;
        const blockName = blocks.find(b => b.id === blockId)?.name || 'Sphere';
        commitSpheres([...localSpheres, blockId], { name: blockName, amount: 1, isPositive: true });
    };

    const removeBlock = (blockId) => {
        if (!canEdit) return;
        const idx = localSpheres.lastIndexOf(blockId);
        if (idx < 0) return;
        const next = [...localSpheres];
        next.splice(idx, 1);
        const blockName = blocks.find(b => b.id === blockId)?.name || 'Sphere';
        commitSpheres(next, { name: blockName, amount: 1, isPositive: false });
    };

    const clearAll = () => {
        if (!canEdit || totalBanked === 0) return;
        const cleared = [...localSpheres];
        commitSpheres([], { name: 'all spheres', amount: cleared.length, isPositive: false });
    };

    const roll4d8 = (e) => {
        if (e) e.stopPropagation();
        if (!canEdit || isRolling || totalBanked >= maxBank) return;
        setIsRolling(true);
        setLastRollResult(null);

        const dice = [];
        const newBlocks = [];
        for (let i = 0; i < 4; i++) {
            const roll = Math.floor(Math.random() * 8) + 1;
            dice.push(roll);
            const block = blocks.find(b => b.d8Value === roll);
            if (block) newBlocks.push(block.id);
        }
        setLastRollResult({ dice, blocks: newBlocks });

        setTimeout(() => {
            const next = [...localSpheres, ...newBlocks].slice(0, maxBank);
            const banked = next.length - localSpheres.length;
            commitSpheres(next, { name: 'Spheres (4d8)', amount: Math.max(0, banked), isPositive: true });
            setIsRolling(false);
        }, 480);
    };

    const getBlock = (id) => blocks.find(b => b.id === id);
    const formulationsUsingBlock = (blockId) => matrixEntries.filter(e => e.elements.includes(blockId));

    // ===== Spell Casting Confirmation Handlers =====
    const handleInitiateCast = (entry) => {
        if (!entry) return;
        const spell = formulationToSpell(entry, matrix);
        if (spell) {
            setSpellToCast(spell);
        }
    };

    const handleSpellCastConfirm = () => {
        if (!spellToCast) return;

        // 1. Extract resource costs
        const resourceCost = spellToCast.resourceCost || {};
        const resourceValues = resourceCost.resourceValues || {};
        const manaCost = resourceValues.mana || resourceCost.mana || 0;
        const apCost = resourceCost.actionPoints || 0;

        // Extract required elemental spheres
        const requiredSpheres = [];
        if (Array.isArray(spellToCast._arcanoneerElements)) {
            spellToCast._arcanoneerElements.forEach(el => requiredSpheres.push(migrateBlockId(el)));
        } else if (Array.isArray(spellToCast.elements)) {
            spellToCast.elements.forEach(el => requiredSpheres.push(migrateBlockId(el)));
        } else if (Array.isArray(resourceCost.spheres)) {
            resourceCost.spheres.forEach(el => requiredSpheres.push(migrateBlockId(el)));
        } else if (resourceValues) {
            Object.entries(resourceValues).forEach(([key, val]) => {
                if (key.endsWith('_sphere')) {
                    const elem = migrateBlockId(key.replace('_sphere', ''));
                    const cnt = Number(val) || 0;
                    for (let i = 0; i < cnt; i++) requiredSpheres.push(elem);
                }
            });
        }

        // 2. Validate availability
        const charStore = useCharacterStore.getState();
        const currentMana = charStore.mana;
        const currentAP = charStore.actionPoints;

        if (manaCost > 0 && (!currentMana || currentMana.current < manaCost)) return;
        if (apCost > 0 && (!currentAP || currentAP.current < apCost)) return;

        const sphereBankCopy = [...localSpheres];
        for (const req of requiredSpheres) {
            const idx = sphereBankCopy.indexOf(req);
            if (idx === -1) return; // Insufficient spheres
            sphereBankCopy.splice(idx, 1);
        }

        // 3. Deduct Mana
        if (manaCost > 0 && currentMana) {
            const newMana = Math.max(0, currentMana.current - manaCost);
            charStore.updateResource('mana', newMana);
            try {
                const usePartyStore = require('../../../../store/partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            mana: { current: newMana, max: currentMana.max }
                        }
                    });
                }
            } catch (err) {}
        }

        // 4. Deduct AP
        if (apCost > 0 && currentAP) {
            const newAP = Math.max(0, currentAP.current - apCost);
            charStore.updateResource('actionPoints', newAP);
            try {
                const usePartyStore = require('../../../../store/partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            actionPoints: { current: newAP, max: currentAP.max }
                        }
                    });
                }
            } catch (err) {}
        }

        // 5. Retract / Deduct Spheres
        commitSpheres(sphereBankCopy);
        charStore.updateClassResource?.('spheres', sphereBankCopy);

        try {
            const usePartyStore = require('../../../../store/partyStore').default;
            const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
            if (currentMember && currentMember.character?.classResource) {
                usePartyStore.getState().updatePartyMember('current-player', {
                    character: {
                        ...currentMember.character,
                        classResource: {
                            ...currentMember.character.classResource,
                            spheres: sphereBankCopy
                        }
                    }
                });
            }
        } catch (err) {}

        // 6. Combat Log Notification
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const sphereNames = requiredSpheres.map(s => blocks.find(b => b.id === s)?.name || s).join(' + ');
        addCombatNotification({
            type: 'spell_cast',
            attacker: actorName,
            target: characterName,
            spellName: spellToCast.name,
            customMessage: `${characterName} unleashed weave [${spellToCast.name}] (${sphereNames})! Consumed ${manaCost} Mana, ${apCost} AP, and chambered spheres.`
        });

        // 7. Multiplayer Emit
        const gameStore = useGameStore.getState();
        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
            gameStore.multiplayerSocket.emit('spell_cast', {
                spellId: spellToCast.id,
                spellName: spellToCast.name,
                casterId: charStore.currentCharacterId || charStore.id,
                targetIds: [],
                targetPositions: [],
                effects: spellToCast.effects || [],
                damage: spellToCast.damage || 0,
                healing: spellToCast.healing || 0,
                timestamp: Date.now()
            });
        }

        // 8. Close popup
        setSpellToCast(null);
    };

    const handleSpellCastCancel = () => {
        setSpellToCast(null);
    };

    // Formulation Hover Handlers
    const handleFormHoverEnter = (entry) => {
        if (formHideTimeoutRef.current) { clearTimeout(formHideTimeoutRef.current); formHideTimeoutRef.current = null; }
        if (formHoverTimeoutRef.current) clearTimeout(formHoverTimeoutRef.current);
        formHoverTimeoutRef.current = setTimeout(() => {
            setHoveredFormulation(entry);
        }, 200);
    };
    const handleFormHoverLeave = () => {
        if (formHoverTimeoutRef.current) clearTimeout(formHoverTimeoutRef.current);
        formHideTimeoutRef.current = setTimeout(() => setHoveredFormulation(null), 100);
    };
    const handleFormTooltipEnter = () => {
        if (formHideTimeoutRef.current) { clearTimeout(formHideTimeoutRef.current); formHideTimeoutRef.current = null; }
    };
    const handleFormTooltipLeave = () => {
        formHideTimeoutRef.current = setTimeout(() => setHoveredFormulation(null), 100);
    };

    const renderFormulationTooltip = () => {
        if (!hoveredFormulation) return null;
        const spell = formulationToSpell(hoveredFormulation, matrix);
        if (!spell) return null;
        return (
            <SpellTooltip
                spell={spell}
                fullscreenMode
                onMouseEnter={handleFormTooltipEnter}
                onMouseLeave={handleFormTooltipLeave}
            />
        );
    };

    // Element / Bar Hover Tooltip
    const renderHoverTooltip = () => {
        if (showMatrixModal) return null;
        if (!hoveredBlockId && !showBarTooltip) return null;

        if (hoveredBlockId) {
            const block = getBlock(hoveredBlockId);
            if (!block) return null;
            const count = blockCounts[block.id] || 0;
            const forms = formulationsUsingBlock(block.id);
            const readyForms = forms.filter(f => {
                const [a, b] = f.elements;
                const need = a === b ? 2 : 1;
                return (blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need;
            });

            return ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip arcanoneer-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none', zIndex: 100000 }}>
                    <ClassTip
                        icon="fas fa-gem"
                        tint={block.isGradient ? '#FF00FF' : block.color}
                        title={`${block.name} · d8 face ${block.d8Value}`}
                        subtitle="Arcanoneer Elemental Sphere"
                        state={`${count} banked`}
                        stateTone={count > 0 ? 'good' : 'neutral'}
                        mechanic={`${block.theme} — ${block.summary}`}
                        status={[
                            count > 0
                                ? `${count} chambered in the iron sleeve.`
                                : 'Chamber empty — roll 4d8 to draw elemental spheres.',
                            readyForms.length > 0
                                ? `Ready combinations: ${readyForms.map(f => f.name).join(', ')}.`
                                : forms.length > 0
                                    ? `No ready weave — needs a partner sphere (${forms.length} formulations use this).`
                                    : null,
                        ]}
                        usage={canEdit ? 'Click to chamber (+1) · Right-click to expel (-1)' : null}
                        hint={block.flavor}
                    />
                </div>,
                document.body
            );
        }

        // Bar-level hover
        const readyFormsCount = readyFormulations.length;
        return ReactDOM.createPortal(
            <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip arcanoneer-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none', zIndex: 100000 }}>
                <ClassTip
                    icon="fas fa-flask"
                    tint="#9370DB"
                    title="Calibrated Iron Sleeve"
                    subtitle="Arcanoneer Formulation Matrix & Spheres"
                    state={`${totalBanked} / ${maxBank} Banked`}
                    stateTone={totalBanked >= maxBank ? 'warn' : totalBanked > 0 ? 'good' : 'neutral'}
                    mechanic="Roll 4d8 at the start of your turn; each die banks 1 elemental sphere (max 12 — overflow is lost). Combine 2 spheres plus mana into a formulation; offensive weaves pin your movement to 0 for the turn, Defend does not."
                    status={[
                        `Cylinder: ${totalBanked}/${maxBank} spheres chambered.`,
                        readyFormsCount > 0
                            ? `Ready formulations: ${readyFormsCount} spell(s) primed for casting.`
                            : 'No formulations primed — draw or chamber matching sphere pairs.',
                        `${Math.max(0, maxBank - totalBanked)} chamber space left before overflow is lost.`
                    ]}
                    usage="Roll 4d8 to draw spheres · Click chamber (+1) / Right-click (-1) · Click MATRIX to craft"
                    hint="Arcanoneers synthesize arcane artillery by binding twin spheres into destructive or tactical formulations."
                />
            </div>,
            document.body
        );
    };

    // Vector elemental glyph paths centered at (cx, cy)
    const renderElementalGlyph = (id, cx, cy, isFilled) => {
        const strokeColor = isFilled ? '#ffffff' : 'rgba(251, 191, 36, 0.45)';
        const fillColor = isFilled ? '#ffffff' : 'none';

        switch (id) {
            case 'arcane':
                return (
                    <g pointerEvents="none">
                        <polygon
                            points={`${cx},${cy - 6.5} ${cx + 2},${cy - 2} ${cx + 6.5},${cy} ${cx + 2},${cy + 2} ${cx},${cy + 6.5} ${cx - 2},${cy + 2} ${cx - 6.5},${cy} ${cx - 2},${cy - 2}`}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="0.75"
                        />
                        <circle cx={cx} cy={cy} r="1.3" fill={isFilled ? '#3b0764' : '#fde047'} />
                    </g>
                );
            case 'sacred':
                return (
                    <g pointerEvents="none">
                        <circle cx={cx} cy={cy} r="3.2" fill={fillColor} stroke={strokeColor} strokeWidth="0.75" />
                        <line x1={cx} y1={cy - 5.5} x2={cx} y2={cy - 4} stroke={strokeColor} strokeWidth="0.75" />
                        <line x1={cx} y1={cy + 4} x2={cx} y2={cy + 5.5} stroke={strokeColor} strokeWidth="0.75" />
                        <line x1={cx - 5.5} y1={cy} x2={cx - 4} y2={cy} stroke={strokeColor} strokeWidth="0.75" />
                        <line x1={cx + 4} y1={cy} x2={cx + 5.5} y2={cy} stroke={strokeColor} strokeWidth="0.75" />
                    </g>
                );
            case 'blight':
                return (
                    <g pointerEvents="none">
                        <path
                            d={`M ${cx - 3.8} ${cy - 3.5} C ${cx - 3.8} ${cy - 6}, ${cx + 3.8} ${cy - 6}, ${cx + 3.8} ${cy - 3.5} C ${cx + 3.8} ${cy - 1}, ${cx + 2.5} ${cy + 2.5}, ${cx + 1.5} ${cy + 4} L ${cx - 1.5} ${cy + 4} C ${cx - 2.5} ${cy + 2.5}, ${cx - 3.8} ${cy - 1}, ${cx - 3.8} ${cy - 3.5} Z`}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="0.75"
                        />
                        <circle cx={cx - 1.5} cy={cy - 2.5} r="0.8" fill={isFilled ? '#180a24' : '#fde047'} />
                        <circle cx={cx + 1.5} cy={cy - 2.5} r="0.8" fill={isFilled ? '#180a24' : '#fde047'} />
                    </g>
                );
            case 'ember':
                return (
                    <g pointerEvents="none">
                        <path
                            d={`M ${cx} ${cy - 6.5} C ${cx + 3} ${cy - 3}, ${cx + 4.5} ${cy + 1}, ${cx + 3.5} ${cy + 4} C ${cx + 2.5} ${cy + 6.5}, ${cx - 2.5} ${cy + 6.5}, ${cx - 3.5} ${cy + 4} C ${cx - 4.5} ${cy + 1}, ${cx - 1.5} ${cy - 2.5}, ${cx} ${cy - 6.5} Z`}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="0.75"
                        />
                        <path
                            d={`M ${cx} ${cy - 2} C ${cx + 1.5} ${cy}, ${cx + 1.5} ${cy + 3}, ${cx} ${cy + 4} C ${cx - 1.5} ${cy + 3}, ${cx - 1.5} ${cy}, ${cx} ${cy - 2} Z`}
                            fill={isFilled ? '#fef08a' : 'none'}
                        />
                    </g>
                );
            case 'rime':
                return (
                    <g pointerEvents="none">
                        <line x1={cx} y1={cy - 5.5} x2={cx} y2={cy + 5.5} stroke={strokeColor} strokeWidth="0.85" />
                        <line x1={cx - 4.8} y1={cy - 2.8} x2={cx + 4.8} y2={cy + 2.8} stroke={strokeColor} strokeWidth="0.85" />
                        <line x1={cx - 4.8} y1={cy + 2.8} x2={cx + 4.8} y2={cy - 2.8} stroke={strokeColor} strokeWidth="0.85" />
                        <circle cx={cx} cy={cy} r="1.3" fill="#ffffff" />
                    </g>
                );
            case 'primal':
                return (
                    <g pointerEvents="none">
                        <path
                            d={`M ${cx - 4} ${cy + 4} C ${cx - 5} ${cy}, ${cx - 2.5} ${cy - 5}, ${cx + 4} ${cy - 5} C ${cx + 5} ${cy}, ${cx + 2.5} ${cy + 5}, ${cx - 4} ${cy + 4} Z`}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="0.75"
                        />
                        <line x1={cx - 2} y1={cy + 2} x2={cx + 2} y2={cy - 2} stroke={isFilled ? '#14532d' : '#fde047'} strokeWidth="0.6" />
                    </g>
                );
            case 'storm':
                return (
                    <g pointerEvents="none">
                        <polygon
                            points={`${cx + 1},${cy - 6.5} ${cx - 4},${cy} ${cx},${cy} ${cx - 1.5},${cy + 6.5} ${cx + 5},${cy - 0.5} ${cx + 1},${cy - 0.5}`}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth="0.75"
                        />
                    </g>
                );
            case 'wyrd':
            default:
                return (
                    <g pointerEvents="none">
                        <polygon
                            points={`${cx},${cy - 5.5} ${cx + 4},${cy - 3.8} ${cx + 5.5},${cy} ${cx + 4},${cy + 3.8} ${cx},${cy + 5.5} ${cx - 4},${cy + 3.8} ${cx - 5.5},${cy} ${cx - 4},${cy - 3.8}`}
                            fill={isFilled ? '#ffffff' : 'none'}
                            stroke={strokeColor}
                            strokeWidth="0.75"
                        />
                        <circle cx={cx} cy={cy} r="1.1" fill={isFilled ? '#ec4899' : '#fde047'} />
                    </g>
                );
        }
    };

    // ========================================================================
    // MATRIX EXPLORER MODAL (ZERO SCROLLING, ELEMENT-PICKER TARGETING)
    // ========================================================================
    const handleElementSelect = (elemId) => {
        if (!selectedElementA) {
            setSelectedElementA(elemId);
            setSelectedElementB(null);
        } else if (selectedElementA === elemId && !selectedElementB) {
            // Deselect
            setSelectedElementA(null);
            setSelectedElementB(null);
        } else if (!selectedElementB) {
            setSelectedElementB(elemId);
        } else if (selectedElementB === elemId) {
            setSelectedElementB(null);
        } else {
            // Replace second
            setSelectedElementB(elemId);
        }
    };

    const handleClearFilter = () => {
        setSelectedElementA(null);
        setSelectedElementB(null);
    };

    const renderMatrixModal = () => {
        if (!showMatrixModal || !barRef.current) return null;
        const barRect = barRef.current.getBoundingClientRect();
        const modalWidth = 310;
        let left = barRect.left + (barRect.width / 2) - (modalWidth / 2);
        if (left < 8) left = 8;
        if (left + modalWidth > window.innerWidth - 8) left = window.innerWidth - modalWidth - 8;

        const spaceBelow = window.innerHeight - barRect.bottom;
        const top = spaceBelow > 230 ? barRect.bottom + 4 : Math.max(8, barRect.top - 225);

        const isPairSelected = selectedElementA && selectedElementB;
        const singleSelection = selectedElementA && !selectedElementB;
        const blockA = selectedElementA ? getBlock(selectedElementA) : null;
        const blockB = selectedElementB ? getBlock(selectedElementB) : null;

        return ReactDOM.createPortal(
            <div
                ref={matrixModalRef}
                className="arc-matrix-popup-frame arcanoneer-menu-container class-resource-menu"
                onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onClick={(e) => { e.stopPropagation(); if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation(); }}
                onMouseEnter={(e) => { e.stopPropagation(); setShowBarTooltip(false); setHoveredBlockId(null); }}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseOver={(e) => e.stopPropagation()}
                style={{ position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${modalWidth}px`, zIndex: 100000 }}
            >
                {/* Header Strip */}
                <div className="arc-matrix-header-bar">
                    <div className="arc-matrix-title-badge">
                        <i className="fas fa-gear" />
                        <span>COMBINATION MATRIX</span>
                    </div>
                    <div className="arc-matrix-header-status">
                        <span className="arc-matrix-banked-text">Bank: {totalBanked}/12</span>
                        {readyCount > 0 && <span className="arc-matrix-ready-pill">{readyCount} Ready</span>}
                    </div>
                    <button className="arc-matrix-close-btn" onClick={(e) => { e.stopPropagation(); setShowMatrixModal(false); }}>
                        ✕
                    </button>
                </div>

                {/* Element Picker Bar: 8 Clickable Orbs */}
                <div className="arc-matrix-picker-strip">
                    {blocks.map(block => {
                        const isSelected = selectedElementA === block.id || selectedElementB === block.id;
                        const count = blockCounts[block.id] || 0;
                        return (
                            <button
                                key={block.id}
                                className={`arc-matrix-picker-orb ${isSelected ? 'selected' : ''} ${count > 0 ? 'banked' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleElementSelect(block.id); }}
                                title={`${block.name} (d8=${block.d8Value}): ${count} banked. Click to filter formulas.`}
                                style={{
                                    '--elem-color': block.color,
                                    '--elem-light': block.lightColor
                                }}
                            >
                                <span className="arc-picker-glyph">{block.name.slice(0, 3)}</span>
                                {count > 0 && <span className="arc-picker-dot" />}
                            </button>
                        );
                    })}
                    {(selectedElementA || selectedElementB) && (
                        <button className="arc-matrix-reset-btn" onClick={handleClearFilter} title="Reset element filters">
                            Clear
                        </button>
                    )}
                </div>

                {/* Sub-Banner / Prompt */}
                <div className="arc-matrix-filter-banner">
                    {isPairSelected ? (
                        <div className="arc-filter-banner-text">
                            Targeting: <strong style={{ color: blockA?.color }}>{blockA?.name}</strong> + <strong style={{ color: blockB?.color }}>{blockB?.name}</strong>
                        </div>
                    ) : singleSelection ? (
                        <div className="arc-filter-banner-text">
                            Showing all 8 formulas using <strong style={{ color: blockA?.color }}>{blockA?.name}</strong>. Pick another to isolate:
                        </div>
                    ) : (
                        <div className="arc-filter-banner-text">
                            {readyCount > 0
                                ? `Showing ${Math.min(8, readyCount)} Ready Formulas. Pick an element above to inspect:`
                                : 'Select an element above to inspect its 8 formulas:'}
                        </div>
                    )}
                </div>

                {/* Body Content Area — Strictly NO SCROLL (Max 8 cards) */}
                <div className="arc-matrix-cards-deck">
                    {isPairSelected && filteredFormulations.length > 0 ? (
                        // Exact Spotlight Card
                        (() => {
                            const entry = filteredFormulations[0];
                            const [a, b] = entry.elements;
                            const need = a === b ? 2 : 1;
                            const isReady = (blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need;
                            return (
                                <div
                                    className={`arc-spotlight-card ${isReady ? 'ready' : 'unready'}`}
                                    onMouseEnter={() => handleFormHoverEnter(entry)}
                                    onMouseLeave={handleFormHoverLeave}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInitiateCast(entry);
                                    }}
                                    title="Click to cast weave or inspect costs"
                                >
                                    <div className="arc-spotlight-header">
                                        <span className="arc-spotlight-title">{entry.name}</span>
                                        <span className={`arc-spotlight-status ${isReady ? 'ready' : 'unready'}`}>
                                            {isReady ? '✓ READY TO CAST' : `✗ NEEDS ${need}x SPHERES`}
                                        </span>
                                    </div>
                                    <div className="arc-spotlight-desc">{entry.effectDescription || entry.summary || 'Concentrated elemental burst.'}</div>
                                    <div className="arc-spotlight-meta">
                                        <span>Range: {entry.range || 60}ft</span>
                                        <span>Target: {entry.targetType || 'single'}</span>
                                        <button
                                            className={`arc-spotlight-cast-btn ${isReady ? 'ready' : 'unready'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInitiateCast(entry);
                                            }}
                                            title={isReady ? `Cast ${entry.name}` : `Inspect costs for ${entry.name}`}
                                        >
                                            <i className="fas fa-bolt" /> {isReady ? 'CAST WEAVE' : 'INSPECT'}
                                        </button>
                                        <span className="arc-spotlight-formula">
                                            {blockA?.name} + {blockB?.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        // Grid of up to 8 cards (2 columns x 4 rows, exact fit, zero scroll)
                        <div className="arc-matrix-grid-8">
                            {filteredFormulations.slice(0, 8).map(entry => {
                                const [a, b] = entry.elements;
                                const need = a === b ? 2 : 1;
                                const isReady = (blockCounts[a] || 0) >= need && (blockCounts[b] || 0) >= need;
                                const bA = getBlock(a);
                                const bB = getBlock(b);

                                return (
                                    <div
                                        key={entry.id}
                                        className={`arc-grid-card ${isReady ? 'ready' : 'unready'}`}
                                        onMouseEnter={() => handleFormHoverEnter(entry)}
                                        onMouseLeave={handleFormHoverLeave}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Clicking an item targets its exact pair and prompts cast confirmation
                                            setSelectedElementA(a);
                                            setSelectedElementB(b);
                                            handleInitiateCast(entry);
                                        }}
                                        title={`${entry.name}\n${bA?.name} + ${bB?.name}\nClick to cast · Hover for spellcard`}
                                    >
                                        <div className="arc-grid-card-pair">
                                            <span style={{ color: bA?.color }}>{bA?.abbrev || bA?.name?.slice(0, 3)}</span>
                                            <span className="plus">+</span>
                                            <span style={{ color: bB?.color }}>{bB?.abbrev || bB?.name?.slice(0, 3)}</span>
                                        </div>
                                        <div className="arc-grid-card-name">{entry.name}</div>
                                        {isReady && <span className="arc-grid-ready-icon" title="Ready to cast">⚡</span>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="arc-matrix-footer">
                    {canEdit && totalBanked > 0 && (
                        <button className="arc-matrix-vent-action" onClick={(e) => { e.stopPropagation(); clearAll(); }}>
                            <i className="fas fa-wind" /> Vent Chamber ({totalBanked})
                        </button>
                    )}
                    <span className="arc-matrix-footer-hint">Hover formulas for full spellcards</span>
                </div>
            </div>,
            document.body
        );
    };

    // ========================================================================
    // MASTER SVG RENDER: THE CALIBRATED IRON SLEEVE
    // ========================================================================
    return (
        <div className={`class-resource-bar arcanoneer-blocks ${size} ${context}-context ${showcase ? 'showcase-mode' : ''}`}>
            <div
                className="arc-apparatus-wrapper"
                ref={barRef}
                onMouseEnter={() => setShowBarTooltip(true)}
                onMouseLeave={() => setShowBarTooltip(false)}
            >

                <svg
                    className="arc-master-svg"
                    viewBox="0 0 286 74"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label={`Arcanoneer Calibrated Iron Sleeve. Spheres banked: ${totalBanked} of ${maxBank}.`}
                >
                    <defs>
                        {/* Antique Forged Gunmetal & Ironwood Base Plate */}
                        <linearGradient id="arcIronCasing" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2c221a" />
                            <stop offset="30%" stopColor="#201813" />
                            <stop offset="70%" stopColor="#150f0b" />
                            <stop offset="100%" stopColor="#0b0806" />
                        </linearGradient>

                        {/* Heavy Guild Brass Framing Rim */}
                        <linearGradient id="arcGuildBrass" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#5c3811" />
                            <stop offset="15%" stopColor="#b45309" />
                            <stop offset="45%" stopColor="#fef08a" />
                            <stop offset="55%" stopColor="#fef08a" />
                            <stop offset="85%" stopColor="#b45309" />
                            <stop offset="100%" stopColor="#5c3811" />
                        </linearGradient>

                        {/* Mechanical Firing Primer (Roll 4d8) */}
                        <linearGradient id="arcPrimerBed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7c2d12" />
                            <stop offset="50%" stopColor="#451a03" />
                            <stop offset="100%" stopColor="#200d02" />
                        </linearGradient>

                        <linearGradient id="arcPrimerBorder" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fde047" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#9a3412" />
                        </linearGradient>

                        {/* Matrix Button Plate */}
                        <linearGradient id="arcMatrixDial" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#312e81" />
                            <stop offset="50%" stopColor="#1e1b4b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>

                        {/* Searing 3D Spheres Gradients */}
                        <radialGradient id="arcSphere_arcane" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#faf5ff" />
                            <stop offset="35%" stopColor="#c084fc" />
                            <stop offset="75%" stopColor="#7e22ce" />
                            <stop offset="100%" stopColor="#3b0764" />
                        </radialGradient>
                        <radialGradient id="arcSphere_sacred" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="35%" stopColor="#fde047" />
                            <stop offset="75%" stopColor="#ca8a04" />
                            <stop offset="100%" stopColor="#713f12" />
                        </radialGradient>
                        <radialGradient id="arcSphere_blight" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#f3e8ff" />
                            <stop offset="35%" stopColor="#a855f7" />
                            <stop offset="75%" stopColor="#6b21a8" />
                            <stop offset="100%" stopColor="#2e1065" />
                        </radialGradient>
                        <radialGradient id="arcSphere_ember" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#fff7ed" />
                            <stop offset="35%" stopColor="#fb923c" />
                            <stop offset="75%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#7c2d12" />
                        </radialGradient>
                        <radialGradient id="arcSphere_rime" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#f0f9ff" />
                            <stop offset="35%" stopColor="#38bdf8" />
                            <stop offset="75%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#075985" />
                        </radialGradient>
                        <radialGradient id="arcSphere_primal" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#f0fdf4" />
                            <stop offset="35%" stopColor="#4ade80" />
                            <stop offset="75%" stopColor="#16a34a" />
                            <stop offset="100%" stopColor="#14532d" />
                        </radialGradient>
                        <radialGradient id="arcSphere_storm" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#ecfeff" />
                            <stop offset="35%" stopColor="#22d3ee" />
                            <stop offset="75%" stopColor="#0891b2" />
                            <stop offset="100%" stopColor="#164e63" />
                        </radialGradient>
                        <radialGradient id="arcSphere_wyrd" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="30%" stopColor="#f472b6" />
                            <stop offset="65%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#3b0764" />
                        </radialGradient>

                        {/* Filter Glow */}
                        <filter id="arcGlowShine" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Outer Forged Iron Plate */}
                    <rect
                        x="1.5"
                        y="1.5"
                        width="283"
                        height="71"
                        rx="5"
                        fill="url(#arcIronCasing)"
                        stroke="url(#arcGuildBrass)"
                        strokeWidth="1.2"
                        className="arc-iron-casing"
                    />

                    {/* Inner Calibration Inset Bevel */}
                    <rect
                        x="3.5"
                        y="3.5"
                        width="279"
                        height="67"
                        rx="3.5"
                        fill="none"
                        stroke="rgba(251, 191, 36, 0.22)"
                        strokeWidth="0.6"
                        pointerEvents="none"
                    />

                    {/* Heavy Mechanical Corner Screws */}
                    <circle cx="5.5" cy="5.5" r="1.3" fill="#451a03" stroke="#fde047" strokeWidth="0.4" pointerEvents="none" />
                    <circle cx="280.5" cy="5.5" r="1.3" fill="#451a03" stroke="#fde047" strokeWidth="0.4" pointerEvents="none" />
                    <circle cx="5.5" cy="68.5" r="1.3" fill="#451a03" stroke="#fde047" strokeWidth="0.4" pointerEvents="none" />
                    <circle cx="280.5" cy="68.5" r="1.3" fill="#451a03" stroke="#fde047" strokeWidth="0.4" pointerEvents="none" />

                    {/* ========================================================= */}
                    {/* TOP MECHANICAL MANTLE                                     */}
                    {/* ========================================================= */}

                    {/* LEFT: Chamber Capacity Pressure Gauge */}
                    <g className="arc-gauge-plate" pointerEvents="none">
                        <rect x="7" y="4.5" width="74" height="17" rx="3" fill="#140c07" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="0.75" />
                        <text x="12" y="16.5" className="arc-gauge-title">CHAMBER</text>
                        <text x="75" y="16.5" textAnchor="end" className="arc-gauge-reading">{totalBanked}/{maxBank}</text>
                        {/* 12 Pressure Segment Cells */}
                        <g>
                            {Array.from({ length: 12 }).map((_, seg) => {
                                const sx = 11 + seg * 5.6;
                                const isFilled = seg < totalBanked;
                                return (
                                    <rect
                                        key={seg}
                                        x={sx}
                                        y="18.5"
                                        width="4.5"
                                        height="1.5"
                                        rx="0.5"
                                        fill={isFilled ? (totalBanked >= maxBank ? '#ef4444' : '#f59e0b') : 'rgba(255,255,255,0.08)'}
                                    />
                                );
                            })}
                        </g>
                    </g>

                    {/* CENTER: Kinetic Ignition Primer ("ROLL 4d8") */}
                    <g
                        className={`arc-primer-trigger ${isRolling ? 'rolling' : ''} ${totalBanked >= maxBank ? 'bank-full' : ''}`}
                        onClick={roll4d8}
                        style={{ cursor: canEdit && !isRolling && totalBanked < maxBank ? 'pointer' : 'default' }}
                    >
                        <rect
                            x="87"
                            y="4"
                            width="112"
                            height="18"
                            rx="4"
                            fill="url(#arcPrimerBed)"
                            stroke="url(#arcPrimerBorder)"
                            strokeWidth="1"
                            className="arc-primer-button"
                        />
                        {/* Knurled grip ticks on primer button sides */}
                        <line x1="89" y1="8" x2="89" y2="18" stroke="rgba(254, 240, 138, 0.4)" strokeWidth="0.8" pointerEvents="none" />
                        <line x1="197" y1="8" x2="197" y2="18" stroke="rgba(254, 240, 138, 0.4)" strokeWidth="0.8" pointerEvents="none" />

                        {/* Kinetic d8 Octahedron Die Icon */}
                        <polygon
                            points="96,7 101,10 101,16 96,19 91,16 91,10"
                            fill="rgba(254, 240, 138, 0.18)"
                            stroke="#fef08a"
                            strokeWidth="0.85"
                            className={`arc-d8-tumbler ${isRolling ? 'tumbling' : ''}`}
                        />
                        <text x="106" y="16.5" className="arc-primer-label">
                            {isRolling ? 'PRIMING…' : (lastRollResult ? `🎲 ${lastRollResult.dice.join('·')}` : 'ROLL 4d8')}
                        </text>
                    </g>

                    {/* RIGHT: Matrix Registry Key (Opens Portal Modal) */}
                    <g
                        className={`arc-matrix-trigger ${showMatrixModal ? 'active' : ''} ${readyCount > 0 ? 'has-ready' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setShowMatrixModal(!showMatrixModal); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <rect
                            x="205"
                            y="4.5"
                            width="74"
                            height="17"
                            rx="3"
                            fill="url(#arcMatrixDial)"
                            stroke={readyCount > 0 ? 'rgba(74, 222, 128, 0.75)' : 'rgba(217, 119, 6, 0.4)'}
                            strokeWidth="0.85"
                            className="arc-matrix-key"
                        />
                        {/* Codex / Matrix Dial Icon */}
                        <path
                            d="M 211 8.5 L 215 7.5 L 215 15.5 L 211 16.5 Z M 215 7.5 L 219 8.5 L 219 16.5 L 215 15.5 Z"
                            fill="none"
                            stroke={readyCount > 0 ? '#86efac' : '#fef08a'}
                            strokeWidth="0.75"
                            pointerEvents="none"
                        />
                        <text x="223" y="16.5" className="arc-matrix-label" pointerEvents="none">
                            {readyCount > 0 ? `MATRIX (${readyCount})` : 'MATRIX'}
                        </text>
                    </g>

                    {/* ========================================================= */}
                    {/* 8 THEMED ELEMENTAL SPHERES (CYLINDER CHAMBERS)            */}
                    {/* ========================================================= */}
                    {blocks.map((block, i) => {
                        const cx = 21 + i * 34.8;
                        const cy = 44;
                        const count = blockCounts[block.id] || 0;
                        const isFilled = count > 0;
                        const isHovered = hoveredBlockId === block.id;

                        return (
                            <g
                                key={block.id}
                                className={`arc-orb-cell ${isFilled ? 'filled' : 'dormant'} ${isHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredBlockId(block.id)}
                                onMouseLeave={() => setHoveredBlockId(null)}
                                onClick={(e) => { e.stopPropagation(); addBlock(block.id); }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeBlock(block.id);
                                }}
                            >
                                {/* Transparent Hitbox */}
                                <rect x={cx - 16} y="24" width="32" height="46" fill="transparent" pointerEvents="all" />

                                {/* Heavy Brass Socket Bezel Housing */}
                                <circle
                                    cx={cx}
                                    cy={cy}
                                    r="13"
                                    fill="#120c08"
                                    stroke={isHovered ? '#fef08a' : (isFilled ? block.color : 'rgba(217, 119, 6, 0.35)')}
                                    strokeWidth={isHovered || isFilled ? '1.1' : '0.6'}
                                    className="arc-socket-bezel"
                                    pointerEvents="none"
                                />

                                {/* Subtle Mechanical Gear/Rivet Teeth on Socket Bezel */}
                                <circle cx={cx - 12} cy={cy} r="0.6" fill="rgba(251, 191, 36, 0.4)" pointerEvents="none" />
                                <circle cx={cx + 12} cy={cy} r="0.6" fill="rgba(251, 191, 36, 0.4)" pointerEvents="none" />

                                {/* Dormant Chamber Shadow (when empty) */}
                                {!isFilled && (
                                    <circle cx={cx} cy={cy} r="11.5" fill="#0d0805" pointerEvents="none" />
                                )}

                                {/* Searing 3D Glowing Elemental Orb (when banked) */}
                                {isFilled && (
                                    <g pointerEvents="none">
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r="11.5"
                                            fill={block.id === 'wyrd' ? 'url(#arcSphere_wyrd)' : `url(#arcSphere_${block.id})`}
                                            filter="url(#arcGlowShine)"
                                            className="arc-sphere-body"
                                        />
                                        {/* Specular White Glass Sheen */}
                                        <ellipse cx={cx - 3.5} cy={cy - 4.5} rx="4" ry="2.5" fill="rgba(255, 255, 255, 0.45)" />
                                    </g>
                                )}

                                {/* Vector Elemental Glyph inside sphere */}
                                {renderElementalGlyph(block.id, cx, cy, isFilled)}

                                {/* Engraved Brass Pip Coin (Top-Right of Bezel) */}
                                {isFilled && (
                                    <g pointerEvents="none">
                                        <circle cx={cx + 9} cy={cy - 8} r="4.5" fill="#180e07" stroke="#fde047" strokeWidth="0.75" />
                                        <text x={cx + 9} y={cy - 6} textAnchor="middle" className="arc-pip-count-badge">
                                            {count}
                                        </text>
                                    </g>
                                )}

                                {/* Micro Charge Dots (1-5 Pips at base of socket) */}
                                <g pointerEvents="none">
                                    {Array.from({ length: 5 }).map((_, p) => {
                                        const px = cx - 6 + p * 3;
                                        const on = p < count;
                                        return (
                                            <circle
                                                key={p}
                                                cx={px}
                                                cy="61.5"
                                                r="0.9"
                                                fill={on ? (block.isGradient ? '#f43f5e' : block.color) : 'rgba(255,255,255,0.08)'}
                                            />
                                        );
                                    })}
                                </g>

                                {/* Bottom Stamped Serial Plate */}
                                <text x={cx} y="69.5" textAnchor="middle" className="arc-serial-stamp" pointerEvents="none">
                                    {block.name.slice(0, 3).toUpperCase()}·{block.d8Value}
                                </text>
                            </g>
                        );
                    })}
                </svg>

            </div>

            {/* Matrix Explorer Modal (Portal - Zero Scrolling) */}
            {renderMatrixModal()}

            {/* Element Hover Tooltip (Portal) */}
            {renderHoverTooltip()}

            {/* Spellcard Hover Tooltip for Formulations (Portal) */}
            {renderFormulationTooltip()}

            {/* Spell Cast Confirmation Dialog (Portal) */}
            {spellToCast && (
                <SpellCastConfirmation
                    spell={spellToCast}
                    classResource={{ ...classResource, spheres: localSpheres }}
                    onConfirm={handleSpellCastConfirm}
                    onCancel={handleSpellCastCancel}
                />
            )}
        </div>
    );
};

export default ArcanoneerResourceBar;
