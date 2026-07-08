import React, { useState } from 'react';
import { WEAPON_TYPE_META } from '../../constants/weaponTypeMeta';
import {
    WEAPON_TYPE_TIERS,
    getWeaponArchetype,
    getWeaponSimpleTable
} from '../../constants/weaponTypeSimpleTables';
import { WEAPON_FACE_TEXT } from '../character-sheet/Skills';
import './WeaponsRulesDisplay.css';

const WEAPON_CATEGORIES = [
    {
        key: 'one-handed', label: 'One-Handed', icon: 'fas fa-hand-fist',
        weapons: ['sword', 'axe', 'mace', 'dagger', 'rapier', 'katana', 'saber', 'sickle', 'flail', 'fist weapon', 'parrying dagger', 'off hand blade', 'war mace']
    },
    {
        key: 'two-handed', label: 'Two-Handed', icon: 'fas fa-hammer',
        weapons: ['greatsword', 'greataxe', 'maul', 'polearm', 'staff', 'halberd', 'scythe', 'jousting spear', 'double sided sword']
    },
    {
        key: 'ranged', label: 'Ranged', icon: 'fas fa-bullseye',
        weapons: ['bow', 'crossbow', 'thrown', 'wand', 'blowgun', 'sling', 'boomerang', 'chakram', 'shuriken', 'dart']
    },
    {
        key: 'instruments', label: 'Instruments', icon: 'fas fa-music',
        weapons: ['harp', 'lute', 'flute', 'drum', 'horn', 'violin', 'guitar']
    },
    {
        key: 'special', label: 'Special', icon: 'fas fa-star',
        weapons: ['unarmed']
    }
];

const DAMAGE_DICE = {
    sword: 'd6', axe: 'd8', mace: 'd6', dagger: 'd4', sickle: 'd4', flail: 'd6', 'fist weapon': 'd4',
    rapier: 'd6', katana: 'd6', saber: 'd6', 'war mace': 'd8',
    'parrying dagger': 'd4', 'off hand blade': 'd4', buckler: 'd4',
    greatsword: '2d6', greataxe: 'd12', maul: '2d6', polearm: 'd10',
    halberd: 'd10', scythe: 'd10', 'jousting spear': 'd10', 'double sided sword': 'd8', staff: 'd6',
    bow: 'd8', crossbow: 'd10', thrown: 'd6', wand: 'd6',
    blowgun: 'd4', sling: 'd4', boomerang: 'd6', chakram: 'd6', shuriken: 'd4', dart: 'd4',
    harp: 'd6', lute: 'd6', flute: 'd4', drum: 'd6', horn: 'd4', violin: 'd6', guitar: 'd6',
    unarmed: 'd4'
};

const TONE_LABEL = {
    bad: 'Fumble', weak: 'Glancing', base: 'Clean', ok: 'Solid', good: 'Strong', great: 'Expert', crit: 'Signature'
};

export default function WeaponsRulesDisplay() {
    const [isSimple, setIsSimple] = useState(true);
    const [selectedWeaponType, setSelectedWeaponType] = useState('sword');

    const meta = WEAPON_TYPE_META[selectedWeaponType] || WEAPON_TYPE_META.sword;
    const archetype = getWeaponArchetype(selectedWeaponType);
    const archetypeLabel = WEAPON_TYPE_META[archetype]?.label || 'Sword';
    const damageDie = DAMAGE_DICE[selectedWeaponType] || 'd6';
    const simpleTable = getWeaponSimpleTable(selectedWeaponType);
    const advancedTable = WEAPON_FACE_TEXT[archetype] || WEAPON_FACE_TEXT.sword;
    const usesArchetype = archetype !== selectedWeaponType;

    return (
        <div className="weapons-rules-layout">
            <div className="premium-parchment-scroll">
                {/* Mode toggle */}
                <div className="weapons-rules-toggle">
                    <button
                        type="button"
                        className={`rpg-btn ${isSimple ? 'active' : ''}`}
                        onClick={() => setIsSimple(true)}
                    >
                        <i className="fas fa-dice"></i> Standard Rules
                    </button>
                    <button
                        type="button"
                        className={`rpg-btn ${!isSimple ? 'active' : ''}`}
                        onClick={() => setIsSimple(false)}
                    >
                        <i className="fas fa-cogs"></i> Advanced Rules
                    </button>
                </div>

                <div className="scroll-title-header">
                    <span className="scroll-tag">
                        <i className={isSimple ? 'fas fa-dice-four' : 'fas fa-cogs'}></i>
                        {isSimple ? ' TWO-DICE COMBAT — QUICK PLAY' : ' WEAPON MASTERY — FULL SYSTEM'}
                    </span>
                    <h3>Weapons</h3>
                    <p className="scroll-subtitle">
                        {isSimple
                            ? 'Roll a Weapon Type d8 + your Weapon Damage die — the type die adds flavor and a tactical effect to every strike.'
                            : 'The full Weapon Mastery system: d8 outcomes, quest ladders, and exploding crits.'}
                    </p>
                </div>

                {/* The two-dice explainer card */}
                <div className="weapons-two-dice-card">
                    <div className="wtd-die wtd-die-type">
                        <div className="wtd-die-label">① Weapon Type</div>
                        <div className="wtd-die-face wtd-die-face--d8">d8</div>
                        <div className="wtd-die-caption">
                            A static <strong>d8</strong> for every weapon. The roll picks a unique outcome that
                            <em> adds to</em> or <em>retracts from</em> the attack — and an 8 triggers that
                            weapon's signature tactical move.
                        </div>
                    </div>
                    <div className="wtd-plus">+</div>
                    <div className="wtd-die wtd-die-damage">
                        <div className="wtd-die-label">② Weapon Damage</div>
                        <div className="wtd-die-face wtd-die-face--varies">{damageDie}</div>
                        <div className="wtd-die-caption">
                            Varies by weapon (<strong>d4</strong>–<strong>d12</strong>). A 1 is a miss; the max
                            explodes into a crit.
                        </div>
                    </div>
                    <div className="wtd-equals">=</div>
                    <div className="wtd-result">
                        <div className="wtd-result-title">The Strike</div>
                        <div className="wtd-result-body">
                            Resolve the type outcome, then apply the damage die. The type die exists to make
                            every swing feel different — it's not just "you deal X damage."
                        </div>
                    </div>
                </div>

                {/* The d8 scale legend (standard mode only) */}
                {isSimple && (
                    <div className="scroll-section">
                        <h5><i className="fas fa-layer-group"></i> The d8 Outcome Scale</h5>
                        <p>One curve, every weapon. Learn these eight tiers and any weapon is intuitive — a d8 (rather than a d6) keeps the strongest signature effects rare enough to stay special. The flavour text is what makes each weapon feel unique.</p>
                        <div className="weapons-tier-grid">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                const tier = WEAPON_TYPE_TIERS[n];
                                return (
                                    <div key={n} className={`weapons-tier-chip tone-${tier.tone}`}>
                                        <span className="weapons-tier-num">{n}</span>
                                        <span className="weapons-tier-name">{tier.name}</span>
                                        <span className="weapons-tier-delta">{tier.delta}</span>
                                        <span className="weapons-tier-blurb">{tier.blurb}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Advanced mode intro */}
                {!isSimple && (
                    <div className="scroll-section">
                        <h5><i className="fas fa-cogs"></i> How Advanced Weapons Work</h5>
                        <p>
                            Advanced Rules layer the <strong>Weapon Mastery</strong> quest ladder on top of the same d8
                            outcomes. Mastery advances through ranks (Untrained → Master), and high primary/secondary
                            attributes can step the mastery die down. Rolling the damage die's max still explodes into a
                            crit.
                        </p>
                        <p style={{ fontSize: '0.88rem', color: '#6d4c41' }}>
                            <i className="fas fa-info-circle"></i> Full quest ladders and rank progression live under the
                            <strong> Skills</strong> section (Combat Mastery → Weapon Mastery).
                        </p>
                    </div>
                )}

                {/* Weapon type outcome browser */}
                <div className="scroll-section">
                    <h5>
                        <i className="fas fa-eye"></i>
                        {' Browse Weapon Outcomes (d8)'}
                    </h5>
                    <p className="weapons-browser-help">
                        {isSimple
                            ? 'Pick a weapon to see its unique d8 outcomes — face 8 is its signature tactical move. Weapons without a dedicated table use a fitting archetype (shown beside the name).'
                            : 'Pick a weapon to see its full d8 mastery outcomes.'}
                    </p>

                    <div className="weapon-type-categories compact-grid">
                        {WEAPON_CATEGORIES.map(category => (
                            <div key={`wrd-${category.key}`} className="weapon-category-group">
                                <div className="weapon-category-header">
                                    <i className={category.icon}></i>
                                    <span>{category.label}</span>
                                </div>
                                <div className="weapon-category-grid">
                                    {category.weapons.map(wKey => {
                                        const wMeta = WEAPON_TYPE_META[wKey];
                                        if (!wMeta) return null;
                                        return (
                                            <div
                                                key={`wrd-${wKey}`}
                                                className={`weapon-type-option compact-option ${selectedWeaponType === wKey ? 'selected' : ''}`}
                                                onClick={() => setSelectedWeaponType(wKey)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedWeaponType(wKey)}
                                                title={`${wMeta.label}: ${wMeta.hint}`}
                                            >
                                                <img src={wMeta.icon} alt={wMeta.label} className="damage-type-icon weapon-type-icon compact-icon" />
                                                <div className="weapon-type-name">{wMeta.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected weapon outcome panel */}
                <div className="weapons-outcome-panel">
                    <div className="weapons-outcome-header">
                        <img src={meta.icon} alt={meta.label} className="weapons-outcome-icon" />
                        <div className="weapons-outcome-titles">
                            <h4>{meta.label}</h4>
                            <p>{meta.hint} · Damage <strong>{damageDie}</strong></p>
                        </div>
                        <div className="weapons-outcome-meta">
                            <span className="weapons-die-badge weapons-die-badge--type">
                                Type <strong>d8</strong>
                            </span>
                            <span className="weapons-die-badge weapons-die-badge--dmg">
                                Dmg <strong>{damageDie}</strong>
                            </span>
                            {usesArchetype && (
                                <span className="weapons-archetype-note">
                                    uses {archetypeLabel} table
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="weapons-outcome-list">
                        {isSimple
                            ? [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                const tier = WEAPON_TYPE_TIERS[n];
                                return (
                                    <div key={n} className={`weapons-outcome-row tone-${tier.tone}`}>
                                        <div className="weapons-roll-pip">{n}</div>
                                        <div className="weapons-roll-body">
                                            <span className={`weapons-roll-tier tone-${tier.tone}`}>{tier.name}</span>
                                            <span className="weapons-roll-delta">{tier.delta}</span>
                                            <span className="weapons-roll-text">{simpleTable[n]}</span>
                                        </div>
                                    </div>
                                );
                            })
                            : Object.entries(advancedTable).map(([roll, text]) => {
                                const n = Number(roll);
                                const tone = n === 1 ? 'bad' : n === 8 ? 'crit' : n === 2 ? 'weak' : n === 3 ? 'base' : n <= 5 ? 'good' : 'great';
                                return (
                                    <div key={roll} className={`weapons-outcome-row tone-${tone}`}>
                                        <div className="weapons-roll-pip">{roll}</div>
                                        <div className="weapons-roll-body">
                                            <span className={`weapons-roll-tier tone-${tone}`}>
                                                {n === 1 ? 'Fumble' : n === 8 ? 'Signature' : TONE_LABEL[tone] || `Face ${n}`}
                                            </span>
                                            <span className="weapons-roll-text">{text}</span>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                {/* Damage die reference */}
                <div className="scroll-section">
                    <h5><i className="fas fa-dice-d20"></i> Weapon Damage Dice</h5>
                    <p>Every weapon's base damage die. The Weapon Type d8 is rolled alongside it to add flavor and tactical effects.</p>
                    <div className="dc-reference-grid weapons-damage-ref">
                        {WEAPON_CATEGORIES.map(cat => (
                            <div key={`dmg-${cat.key}`} className="weapons-damage-cat">
                                <div className="weapons-damage-cat-title">
                                    <i className={cat.icon}></i> {cat.label}
                                </div>
                                {cat.weapons.map(wKey => {
                                    const wMeta = WEAPON_TYPE_META[wKey];
                                    if (!wMeta) return null;
                                    return (
                                        <div key={`dmg-${wKey}`} className="dc-row">
                                            <span>{wMeta.label}</span>
                                            <strong>{DAMAGE_DICE[wKey] || 'd6'}</strong>
                                            <span>{wMeta.hint}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Durability note */}
                <div className="scroll-section weapons-durability-note">
                    <h5><i className="fas fa-shield-alt"></i> Gear &amp; Durability (no flat DR)</h5>
                    <p>
                        Mythrill does <strong>not</strong> use flat Damage Reduction. Every weapon and piece of armor
                        carries a <strong>durability die</strong> (d4–d12). Fumbles chip the weapon's durability, and
                        rolling a <strong>1 or 2</strong> on an armor soak degrades it one die step. Where a weapon
                        outcome "cracks guard," it threatens the target's gear durability instead of bypassing a DR
                        number — and crits skip the soak entirely. See <strong>Durability &amp; Repair</strong> for the
                        full ladder.
                    </p>
                </div>
            </div>
        </div>
    );
}
