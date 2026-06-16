import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getClassResourceConfig } from '../../../../data/classResources';
import SpellTooltip from '../../../../components/spellcrafting-wizard/components/common/SpellTooltip';
import { formulationToSpell } from '../formulationToSpell';
import '../styles/SphereComboFinder.css';

/**
 * SphereComboFinder — "Building Blocks → Formulations" reference tool.
 *
 * Replaces the legacy `components/rules/SphereComboFinder.jsx`, which hardcoded
 * its own element IDs that never matched the matrix data (so the lookup always
 * returned "No combination found"). This new version:
 *
 *   - Reads block metadata from the SINGLE SOURCE OF TRUTH
 *     (`classResources.js` CLASS_RESOURCE_TYPES['Arcanoneer'].elements).
 *   - Fixes the matrix-entry lookup so combinations actually resolve.
 *   - Adds a "formulation-first" browse mode: pick one block to see every
 *     formulation it can build; optionally pick a second to narrow to that pair.
 *   - Surfaces the existing 5 Firing Profiles (Attack/Defend/Buff/Area/Trap)
 *     with mana cost, range, target, damage formula, and a prose description.
 *   - Highlights formulations that would be castable given an optional
 *     `bankedBlocks` prop (so the bar can pass in live state and the finder
 *     becomes a planning tool, not just a reference table).
 *
 * Props:
 *   combinationMatrix - { entries: [...] } passed from ClassDetailDisplay.
 *                       If omitted, falls back to ARCANONEER_DATA.combinationMatrix.
 *   bankedBlocks      - optional { blockId: count } map; formulations you can
 *                       currently cast are highlighted "ready".
 *   className         - optional wrapper class for layout overrides.
 */
const ACTIONS = [
    {
        name: 'Attack',
        icon: 'fa-crosshairs',
        mana: 5,
        range: '60ft',
        target: 'One enemy',
        damageFormula: (combo) => {
            if (combo.primaryEffect === 'cleanse' || combo.primaryEffect === 'barrier') return `Special — see effect`;
            if (combo.primaryEffect === 'healing') return `Heal 1d6 + INT/4`;
            return `1d6 + INT/4 ${combo.damageTypes.join('/')}`;
        },
        describe: (combo, blockName) => {
            if (combo.isChaosCombo) return `Deal 1d6 + INT/4 wyrd damage. Then roll on the Wyrd Effects Table for a bonus (or penalty).`;
            if (combo.primaryEffect === 'healing') return `Heal one ally for 1d6 + INT/4 HP.${combo.secondaryEffect === 'damage' ? ' Also deals 1 force damage to nearby undead.' : ''}`;
            let desc = `Deal 1d6 + INT/4 ${combo.damageTypes.join('/')} damage to one target.`;
            if (combo.secondaryEffect) desc += ` ${formatSecondaryAttack(combo.secondaryEffect)}`;
            return desc;
        }
    },
    {
        name: 'Defend',
        icon: 'fa-shield-alt',
        mana: 6,
        range: 'Self/Ally 30ft',
        target: 'One creature',
        damageFormula: () => 'Absorbs level HP',
        describe: (combo) => {
            if (combo.isChaosCombo) return `Barrier absorbs your level in HP. Roll Wyrd Table — the result modifies your shield in a random way.`;
            const types = combo.damageTypes?.length > 0 ? combo.damageTypes.join('/') + ' ' : '';
            return `Barrier absorbs your level in HP. Grants ${types}resistance for 1 round.${combo.secondaryEffect ? ' ' + formatSecondaryDefend(combo.secondaryEffect) : ''}`;
        }
    },
    {
        name: 'Buff',
        icon: 'fa-magic',
        mana: 4,
        range: 'Touch',
        target: 'One weapon',
        damageFormula: (combo) => {
            if (combo.primaryEffect === 'healing') return `+1d4 healing on next hit`;
            return `+1d4 ${combo.damageTypes?.[0] || 'force'} on next hit`;
        },
        describe: (combo) => {
            if (combo.isChaosCombo) return `Weapon glows with wyrd energy. +1d4 chaos on next hit. Then roll Wyrd Table for a bonus weapon effect.`;
            const type = combo.damageTypes?.[0] || 'force';
            let desc = `Imbue a weapon with ${type} energy. Next attack deals +1d4 ${type} damage.`;
            if (combo.secondaryEffect && combo.secondaryEffect !== 'damage') desc += ` ${formatSecondaryBuff(combo.secondaryEffect)}`;
            return desc;
        }
    },
    {
        name: 'Area',
        icon: 'fa-burst',
        mana: 7,
        range: '30ft center',
        target: '10ft radius',
        damageFormula: (combo) => {
            if (combo.primaryEffect === 'healing') return `Heal 1d4 + INT/4 each ally`;
            return `1d4 + INT/4 ${combo.damageTypes.join('/')} each`;
        },
        describe: (combo) => {
            if (combo.isChaosCombo) return `10ft burst of wyrd energy. 1d4 + INT/4 to all targets. Each target rolls separately on the Wyrd Table.`;
            if (combo.primaryEffect === 'healing') return `10ft pulse heals all allies for 1d4 + INT/4 HP.`;
            let desc = `10ft burst. 1d4 + INT/4 ${combo.damageTypes.join('/')} to each target.`;
            if (combo.secondaryEffect) desc += ` Secondary effect applies but halved duration.`;
            return desc;
        }
    },
    {
        name: 'Trap',
        icon: 'fa-draw-polygon',
        mana: 6,
        range: '30ft surface',
        target: '5ft zone',
        damageFormula: (combo) => {
            if (combo.primaryEffect === 'healing') return `Heal 1d6 + INT/4 (ally trigger)`;
            return `1d6 + INT/4 ${combo.damageTypes.join('/')}`;
        },
        describe: (combo) => {
            if (combo.isChaosCombo) return `Place a wyrd trap. When triggered: 1d6 + INT/4 + roll Wyrd Table. The trap's nature is unpredictable.`;
            if (combo.primaryEffect === 'healing') return `Sacred ground. Ally entering heals 1d6 + INT/4 HP (once). Undead take radiant instead. Lasts 1 min.`;
            let desc = `Hidden trap. When triggered: 1d6 + INT/4 ${combo.damageTypes.join('/')}.`;
            if (combo.secondaryEffect) desc += ` ${formatSecondaryTrap(combo.secondaryEffect)}`;
            desc += ` Lasts 1 minute.`;
            return desc;
        }
    }
];

function formatSecondaryAttack(sec) {
    const map = {
        blind: 'Target is briefly blinded (disadvantage next attack).',
        slow: 'Target is slowed 10ft for 1 round.',
        stun: 'Target must Con save or be stunned 1 round.',
        heal: 'Also heals a nearby ally for the same amount.',
        damage: '',
        random: '',
        restrain: 'Target is restrained by elemental vines for 1 round.'
    };
    return map[sec] || `Applies: ${sec}.`;
}
function formatSecondaryDefend(sec) {
    const map = { blind: 'Melee attackers are briefly blinded.', slow: 'Melee attackers are slowed.', stun: 'Melee attackers must Con save or stunned.', damage: '', random: '', restrain: 'Melee attackers may be restrained.' };
    return map[sec] || '';
}
function formatSecondaryBuff(sec) {
    const map = { blind: 'Target hit is briefly blinded.', slow: 'Target hit is slowed 10ft.', stun: 'Target hit must Con save or stunned.', restrain: 'Target hit may be restrained.' };
    return map[sec] || '';
}
function formatSecondaryTrap(sec) {
    const map = { blind: 'Triggered creature is blinded 1 round.', slow: 'Triggered creature is slowed 10ft for 1 round.', stun: 'Triggered creature must Con save or stunned.', restrain: 'Triggered creature is restrained 1 round.' };
    return map[sec] || '';
}

export default function SphereComboFinder({ combinationMatrix, bankedBlocks = {}, className = '' }) {
    // Single source of truth: read block list from the classResources config.
    const config = getClassResourceConfig('Arcanoneer');
    const blocks = config?.elements || [];

    // Fallback to ARCANONEER_DATA if combinationMatrix not provided.
    const matrix = useMemo(() => {
        if (combinationMatrix) return combinationMatrix;
        try {
            const data = require('../../arcanoneerData').ARCANONEER_DATA;
            return data?.combinationMatrix || { entries: [] };
        } catch {
            return { entries: [] };
        }
    }, [combinationMatrix]);
    const entries = matrix?.entries || [];

    const [block1, setBlock1] = useState(null);
    const [block2, setBlock2] = useState(null);
    const [hoveredForm, setHoveredForm] = useState(null);
    const hoverTimerRef = useRef(null);
    const hideTimerRef = useRef(null);

    // Reset selections whenever the matrix source changes.
    useEffect(() => { setBlock1(null); setBlock2(null); }, [matrix]);

    const block = (id) => blocks.find(b => b.id === id);

    // Formulations matching the current selection.
    // - No selection: all entries.
    // - One block selected: every entry that uses that block.
    // - Two blocks selected: the single entry whose element set matches.
    const visibleFormulations = useMemo(() => {
        if (!block1) return entries;
        if (!block2) return entries.filter(e => e.elements.includes(block1));
        const wanted = [block1, block2].sort();
        return entries.filter(e => {
            const have = [...e.elements].sort();
            return have[0] === wanted[0] && have[1] === wanted[1];
        });
    }, [entries, block1, block2]);

    // The "active" combo for the 5-action breakdown — the focused pair.
    const activeCombo = (visibleFormulations.length === 1) ? visibleFormulations[0] : null;

    const selectBlock = (id) => {
        if (!block1) {
            setBlock1(id);
        } else if (!block2) {
            if (id === block1) {
                // Toggle off if same.
                setBlock1(null);
            } else {
                setBlock2(id);
            }
        } else {
            // Both selected — start over with this as the first.
            setBlock1(id);
            setBlock2(null);
        }
    };

    const reset = () => { setBlock1(null); setBlock2(null); };

    const isFormulationReady = (entry) => {
        const [a, b] = entry.elements;
        const need = a === b ? 2 : 1;
        return (bankedBlocks[a] || 0) >= need && (bankedBlocks[b] || 0) >= need;
    };

    const hasBankedState = Object.keys(bankedBlocks).length > 0;

    // Hover spell-card handlers for formulation cards
    const handleFormHoverEnter = (entry) => {
        if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => setHoveredForm(entry), 350);
    };
    const handleFormHoverLeave = () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hideTimerRef.current = setTimeout(() => setHoveredForm(null), 100);
    };
    const handleTooltipEnter = () => {
        if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
    };
    const handleTooltipLeave = () => {
        hideTimerRef.current = setTimeout(() => setHoveredForm(null), 100);
    };

    return (
        <div className={`scf-root ${className}`}>
            <div className="scf-header">
                <div className="scf-title">Spheres → Formulations</div>
                <div className="scf-subtitle">
                    {!block1 && 'Pick a Sphere to see every formulation it can build.'}
                    {block1 && !block2 && `Showing ${visibleFormulations.length} formulation${visibleFormulations.length === 1 ? '' : 's'} using ${block(block1)?.name}. Pick a second block to narrow to that pair.`}
                    {block1 && block2 && `${block(block1)?.name} + ${block(block2)?.name}`}
                    {(block1 || block2) && <button className="scf-reset-btn" onClick={reset} title="Clear selection">Reset</button>}
                </div>
            </div>

            <div className="scf-blocks-row">
                {blocks.map(b => {
                    const isB1 = block1 === b.id;
                    const isB2 = block2 === b.id;
                    const banked = bankedBlocks[b.id] || 0;
                    return (
                        <button
                            key={b.id}
                            className={`scf-block-btn${isB1 ? ' sel1' : ''}${isB2 ? ' sel2' : ''}${banked > 0 ? ' has-banked' : ''}`}
                            style={{ '--block-color': b.isGradient ? '#FF00FF' : b.color, '--block-glow': b.glowColor }}
                            onClick={() => selectBlock(b.id)}
                            title={`${b.name} (d8=${b.d8Value}): ${b.summary}`}
                        >
                            <i className={`${b.icon} scf-block-icon`} />
                            <span className="scf-block-name">{b.name}</span>
                            <span className="scf-block-d8">d8={b.d8Value}</span>
                            {hasBankedState && <span className="scf-block-banked">{banked}</span>}
                        </button>
                    );
                })}
            </div>

            {/* The focused pair's 5-action breakdown */}
            {activeCombo && (
                <div className="scf-focus">
                    <div className="scf-focus-header">
                        <span className="scf-focus-name">{activeCombo.name}</span>
                        <span className="scf-focus-costs">
                            {activeCombo.elements.map(id => block(id)?.name || id).join(' + ')}
                        </span>
                        {activeCombo.isChaosCombo && <span className="scf-focus-tag is-wyrd">Wyrd</span>}
                        {isFormulationReady(activeCombo) && <span className="scf-focus-tag ready">Ready</span>}
                    </div>
                    {activeCombo.effectDescription && (
                        <div className="scf-focus-desc">{activeCombo.effectDescription}</div>
                    )}
                    {activeCombo.isChaosCombo && (
                        <div className="scf-wyrd-note">
                            This is a <strong>Wyrd formulation</strong> — every use rolls on the Wyrd Effects Table (d20) for a bonus or penalty. The cards below show the base effect; the chaos roll modifies it.
                        </div>
                    )}
                    <div className="scf-actions-grid">
                        {ACTIONS.map((action, i) => (
                            <div key={i} className="scf-action-card">
                                <div className="scf-action-header">
                                    <i className={`fas ${action.icon}`}></i>
                                    <span className="scf-action-name">{action.name}</span>
                                    <span className="scf-action-cost">{action.mana} mana</span>
                                </div>
                                <div className="scf-action-meta">
                                    <span><i className="fas fa-ruler" /> {action.range}</span>
                                    <span><i className="fas fa-bullseye" /> {action.target}</span>
                                </div>
                                <div className="scf-action-damage">{action.damageFormula(activeCombo)}</div>
                                <div className="scf-action-text">{action.describe(activeCombo)}</div>
                            </div>
                        ))}
                    </div>
                    {activeCombo.randomEffects && activeCombo.randomEffects.length > 0 && (
                        <div className="scf-wyrd-effects">
                            <div className="scf-wyrd-effects-title">Wyrd Effects Table (roll randomly):</div>
                            <ul>
                                {activeCombo.randomEffects.map((re, i) => (
                                    <li key={i}>
                                        <strong>{re.name}</strong> — {re.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Browse grid of all matching formulations */}
            {!activeCombo && (
                <div className="scf-formulations">
                    <div className="scf-formulations-header">
                        <span>{visibleFormulations.length} formulation{visibleFormulations.length === 1 ? '' : 's'}</span>
                        {hasBankedState && <span className="scf-formulations-hint">Green = ready to cast</span>}
                    </div>
                    <div className="scf-formulations-grid">
                        {visibleFormulations.map(entry => {
                            const ready = isFormulationReady(entry);
                            return (
                                <div
                                    key={entry.id}
                                    className="scf-form-card-wrapper"
                                    onMouseEnter={() => handleFormHoverEnter(entry)}
                                    onMouseLeave={handleFormHoverLeave}
                                >
                                    <button
                                        className={`scf-form-card ${ready ? 'ready' : ''} ${entry.isChaosCombo ? 'is-wyrd' : ''}`}
                                        onClick={() => { const e = entry.elements; setBlock1(e[0]); setBlock2(e[1]); }}
                                        title="Click to focus this formulation · Hover for spell card"
                                    >
                                        <div className="scf-form-card-name">{entry.name}</div>
                                        <div className="scf-form-card-cost">
                                            {entry.elements.map((id, eIdx) => (
                                                <span key={id + '_' + eIdx} className="scf-form-card-chip" style={{ '--block-color': block(id)?.color || '#888' }}>
                                                    {block(id)?.name?.charAt(0) || '?'}
                                                </span>
                                            ))}
                                        </div>
                                        {entry.primaryEffect && <div className="scf-form-card-effect">{entry.primaryEffect}</div>}
                                        {entry.damageTypes?.length > 0 && (
                                            <div className="scf-form-card-dmg">{entry.damageTypes.join(' / ')}</div>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {hoveredForm && (() => {
                        const spell = formulationToSpell(hoveredForm, matrix);
                        if (!spell) return null;
                        return (
                            <SpellTooltip
                                spell={spell}
                                fullscreenMode
                                onMouseEnter={handleTooltipEnter}
                                onMouseLeave={handleTooltipLeave}
                            />
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
