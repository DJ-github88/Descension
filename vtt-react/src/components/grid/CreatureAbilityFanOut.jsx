import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getAbilityIconUrl, getCustomIconUrl, getIconUrl } from '../../utils/assetManager';
import { resolveCreatureAbilityIcon, transformAbilityToSpell } from '../../utils/creatureAbilityUtils';
import { normalizeDamageType } from '../spellcrafting-wizard/core/data/damageTypes';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import '../spellcrafting-wizard/styles/pathfinder/main.css';
import '../ui/ActionFanOutMenu.css';
import './CreatureAbilityFanOut.css';

const MAX_FAN_BUBBLES = 8;

// Fallback icons per ability type (matches assets used elsewhere in the app)
const ABILITY_TYPE_FALLBACK_ICONS = {
    melee: () => getIconUrl('Armor/Neck/magical-sword-pendant', 'items'),
    ranged: () => getIconUrl('Weapons/Bows/bow-simple-brown-tan-grip', 'items'),
    spell: () => getCustomIconUrl('Arcane/Abstract Rune', 'abilities'),
    special: () => getCustomIconUrl('Utility/Ornate Symbol', 'abilities')
};

/**
 * Rolls a simple XdY+Z dice formula.
 * Returns { total, rolls, mod } or null if the formula can't be parsed.
 */
export const rollDiceFormula = (formula) => {
    if (!formula || typeof formula !== 'string') return null;
    const match = formula.replace(/\s+/g, '').match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (!match) return null;
    const count = Math.min(Math.max(parseInt(match[1] || '1', 10) || 1, 1), 50);
    const sides = parseInt(match[2], 10);
    const mod = match[3] ? parseInt(match[3], 10) : 0;
    if (!sides || sides < 1) return null;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((sum, r) => sum + r, 0) + mod;
    return { total, rolls, mod };
};

/**
 * Normalizes a creature ability (legacy creature-wizard format or
 * spell-wizard format) into the shape used by the fan-out bubbles.
 */
export const mapCreatureAbility = (ability, index) => {
    if (!ability) return null;

    const legacyDamage = ability.damage && typeof ability.damage === 'object' && ability.damage.diceCount
        ? `${ability.damage.diceCount}d${ability.damage.diceType || 6}${ability.damage.bonus ? `+${ability.damage.bonus}` : ''}`
        : (typeof ability.damage === 'string' ? ability.damage : null);

    const formula = ability.damageConfig?.formula
        || ability.healingConfig?.formula
        || legacyDamage
        || null;

    return {
        id: ability.id || `ability-${index}`,
        name: ability.name || ability.title || 'Ability',
        type: ability.type || 'special',
        description: ability.description || ability.desc || '',
        // Resolved display icon: explicit icon, damage theme, or name-hashed
        // pick — never a shared placeholder, so abilities stay distinguishable
        icon: resolveCreatureAbilityIcon(ability, index),
        apCost: ability.resourceCost?.actionPoints
            ?? ability.castingConfig?.actionPointCost
            ?? ability.actionPointCost
            ?? ability.apCost
            ?? 0,
        manaCost: ability.resourceCost?.mana ?? ability.manaCost ?? 0,
        range: typeof ability.range === 'number'
            ? ability.range
            : (ability.targetingConfig?.rangeDistance ?? null),
        cooldown: ability.cooldown ?? ability.cooldownConfig?.value ?? 0,
        damageType: normalizeDamageType(
            ability.damage?.damageType
            || ability.damageConfig?.elementType
            || ability.damageType
        ) || null,
        formula
    };
};

// Resolve the display icon for a mapped ability
const resolveAbilityIcon = (mapped) => {
    const iconId = mapped.icon;
    if (iconId && typeof iconId === 'string') {
        if (iconId.startsWith('http')) {
            const match = iconId.match(/(?:spell_|ability_|inv_|achievement_)([^/]+)\.jpg/);
            if (match) return getAbilityIconUrl(match[0].replace('.jpg', ''));
            return iconId;
        }
        if (iconId.startsWith('/assets/')) return iconId;
        if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
            return getAbilityIconUrl(iconId);
        }
        if (iconId.includes('/')) return getAbilityIconUrl(iconId);
    }
    return (ABILITY_TYPE_FALLBACK_ICONS[mapped.type] || ABILITY_TYPE_FALLBACK_ICONS.special)();
};

// Evenly spread angles (degrees) across an upward arc, matching the
// off-hand fan spacing for <= 5 actions and tightening beyond that.
export const computeFanAngles = (count) => {
    if (count <= 1) return [0];
    const step = count <= 5 ? 28 : Math.min(28, 160 / (count - 1));
    const start = -((count - 1) * step) / 2;
    return Array.from({ length: count }, (_, i) => Math.round(start + i * step));
};

/**
 * CreatureAbilityFanOut
 * Fans a creature's ability icons out above its token when the GM hovers it,
 * mirroring the equipment-slot action fan (ActionFanOutMenu). Hovering a
 * bubble shows the full spell card (UnifiedSpellCard) for that ability —
 * the same card layout used in the creature inspect view.
 */
const CARD_SPACE_NEEDED = 404; // card width (380) + gap + viewport margin
const CARD_NATURAL_WIDTH = 380;
const CARD_MIN_WIDTH = 280;

/**
 * Compute hover-card geometry so the whole card stays inside the viewport.
 * Pure function (unit-tested).
 *
 * @param {{left:number,right:number,cy:number}} bubble - bubble screen rect
 * @param {{w:number,h:number}} card - measured card size (0s = not measured yet)
 * @param {{vw:number,vh:number}} viewport - viewport size
 * @param {'left'|'right'} preferredSide - natural side from the fan arc
 * @returns {{side:'left'|'right', dy:number, fitW:number}}
 */
export const computeCardGeometry = (bubble, card, viewport, preferredSide) => {
    const avail = Math.max(viewport.vw - bubble.right, bubble.left) - 24;
    const fitW = Math.round(Math.min(CARD_NATURAL_WIDTH, Math.max(CARD_MIN_WIDTH, avail)));

    const need = Math.min(card.w || CARD_NATURAL_WIDTH, fitW) + 24;
    const spaceRight = viewport.vw - bubble.right;
    const spaceLeft = bubble.left;
    const fitsRight = spaceRight >= need;
    const fitsLeft = spaceLeft >= need;
    let side;
    if (fitsRight && fitsLeft) side = preferredSide;
    else if (fitsRight) side = 'right';
    else if (fitsLeft) side = 'left';
    else side = spaceRight >= spaceLeft ? 'right' : 'left';

    let dy = 0;
    if (card.h > 0) {
        const top = bubble.cy - card.h / 2; // card top when dy = 0
        const lo = 8 - top; // min dy so the top edge clears the viewport top
        const hi = (viewport.vh - 8 - card.h) - top; // max dy for the bottom edge
        dy = lo > hi ? lo : Math.min(Math.max(0, lo), hi);
    }
    return { side, dy, fitW };
};

const CreatureAbilityFanOut = ({
    abilities = [],
    isOpen = true,
    radius = 110,
    onUseAbility
}) => {
    // Hovered bubble + precomputed card placement ({ id, side, cy, left, right })
    const [hover, setHover] = useState(null);
    const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
    const [cardFitW, setCardFitW] = useState(CARD_NATURAL_WIDTH);
    const cardRef = useRef(null);

    const items = useMemo(
        () => abilities
            .map((raw, index) => ({ raw, mapped: mapCreatureAbility(raw, index) }))
            .filter(entry => entry.mapped),
        [abilities]
    );

    const visible = useMemo(() => {
        if (items.length <= MAX_FAN_BUBBLES) {
            return { items, hiddenCount: 0 };
        }
        const shown = MAX_FAN_BUBBLES - 1;
        return {
            items: items.slice(0, shown),
            hiddenCount: items.length - shown
        };
    }, [items]);

    // Measure the open card pre-paint (no flicker): shrink it to fit narrow
    // viewports and re-flip the side / nudge vertically so the whole card
    // stays on screen. All hooks stay above the early return below.
    useLayoutEffect(() => {
        if (hover && cardRef.current) {
            const w = cardRef.current.offsetWidth;
            const h = cardRef.current.offsetHeight;
            setCardSize(prev => (prev.w === w && prev.h === h ? prev : { w, h }));

            const geom = computeCardGeometry(
                { left: hover.left, right: hover.right, cy: hover.cy },
                { w, h },
                { vw: window.innerWidth, vh: window.innerHeight },
                hover.side
            );
            if (geom.fitW !== cardFitW) {
                setCardFitW(geom.fitW);
            }
            if (geom.side !== hover.side) {
                setHover(prev => (prev && prev.id === hover.id ? { ...prev, side: geom.side } : prev));
            }
        } else if (!hover && (cardSize.w !== 0 || cardSize.h !== 0)) {
            setCardSize({ w: 0, h: 0 });
            setCardFitW(CARD_NATURAL_WIDTH);
        }
    }, [hover, cardSize, cardFitW]);

    // Vertical nudge (px, bubble-relative) keeping the card inside the viewport
    const cardDy = useMemo(() => {
        if (!hover || !cardSize.h) return 0;
        const geom = computeCardGeometry(
            { left: hover.left, right: hover.right, cy: hover.cy },
            { w: cardSize.w, h: cardSize.h },
            { vw: window.innerWidth, vh: window.innerHeight },
            hover.side
        );
        return geom.dy;
    }, [hover, cardSize]);

    if (!isOpen || visible.items.length === 0) return null;

    const angles = computeFanAngles(visible.items.length + (visible.hiddenCount > 0 ? 1 : 0));

    const handleBubbleEnter = (e, ability, fanX) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;
        const naturalSide = fanX >= 0 ? 'right' : 'left';
        const fitsRight = spaceRight >= CARD_SPACE_NEEDED;
        const fitsLeft = spaceLeft >= CARD_SPACE_NEEDED;
        let side;
        if (fitsRight && fitsLeft) side = naturalSide;
        else if (fitsRight) side = 'right';
        else if (fitsLeft) side = 'left';
        else side = spaceRight >= spaceLeft ? 'right' : 'left';
        setHover({ id: ability.id, side, cy: rect.top + rect.height / 2, left: rect.left, right: rect.right });
    };

    const handleBubbleClick = (e, ability) => {
        e.stopPropagation();
        e.preventDefault();
        if (!onUseAbility) return;

        let rollText = null;
        if (ability.formula) {
            const roll = rollDiceFormula(ability.formula);
            if (roll) {
                const typeLabel = ability.damageType ? ` ${ability.damageType}` : '';
                rollText = `🎲 ${ability.formula} → ${roll.total}${typeLabel}`;
            }
        }
        onUseAbility(ability, rollText);
    };

    return (
        <div className="creature-ability-fanout" onClick={(e) => e.stopPropagation()}>
            {visible.items.map(({ raw, mapped: ability }, index) => {
                const angleDeg = angles[index] || 0;
                const angleRad = (angleDeg * Math.PI) / 180;
                const x = Math.round(Math.sin(angleRad) * radius);
                const y = Math.round(-Math.cos(angleRad) * radius);

                const isSpecial = ability.apCost >= 2 || ability.type === 'spell';

                return (
                    <div
                        key={ability.id}
                        className={`action-fan-bubble creature-ability-bubble ${isSpecial ? 'special-action' : 'baseline-action'}`}
                        style={{
                            '--tx': `${x}px`,
                            '--ty': `${y}px`,
                            animationDelay: `${index * 35}ms`
                        }}
                        onClick={(e) => handleBubbleClick(e, ability)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseEnter={(e) => handleBubbleEnter(e, ability, x)}
                        onMouseLeave={() => setHover(null)}
                    >
                        <div className="fan-bubble-icon-wrap">
                            <img
                                src={resolveAbilityIcon(ability)}
                                alt={ability.name}
                                draggable={false}
                                onError={(e) => {
                                    e.target.src = (ABILITY_TYPE_FALLBACK_ICONS[ability.type] || ABILITY_TYPE_FALLBACK_ICONS.special)();
                                }}
                            />
                        </div>

                        <div className={`fan-bubble-ap-pill ${isSpecial ? 'special-cost' : ''}`}>
                            {ability.apCost} AP
                        </div>

                        {isSpecial && <div className="special-flourish-ring" />}

                        {/* Full spell card for the hovered ability (same card as the inspect view) */}
                        {hover?.id === ability.id && (
                            <div
                                ref={cardRef}
                                className={`fan-ability-card ${hover.side === 'right' ? 'fan-card-right' : 'fan-card-left'}`}
                                style={{ top: `calc(50% + ${cardDy}px)`, maxWidth: cardFitW }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <UnifiedSpellCard
                                    spell={transformAbilityToSpell({ ...raw, icon: ability.icon })}
                                    variant="wizard"
                                    showActions={false}
                                    showDescription={true}
                                    showStats={true}
                                    showTags={false}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Overflow indicator when the creature has many abilities */}
            {visible.hiddenCount > 0 && (
                <div
                    className="action-fan-bubble fan-more-bubble"
                    style={{
                        '--tx': `${Math.round(Math.sin((angles[angles.length - 1] * Math.PI) / 180) * radius)}px`,
                        '--ty': `${Math.round(-Math.cos((angles[angles.length - 1] * Math.PI) / 180) * radius)}px`,
                        animationDelay: `${visible.items.length * 35}ms`
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <span className="fan-more-label">+{visible.hiddenCount}</span>
                </div>
            )}
        </div>
    );
};

CreatureAbilityFanOut.propTypes = {
    abilities: PropTypes.array,
    isOpen: PropTypes.bool,
    radius: PropTypes.number,
    onUseAbility: PropTypes.func
};

export default CreatureAbilityFanOut;
