import { getIconUrl } from '../utils/assetManager';

// Shared weapon type metadata used across SkillsDisplay and character sheet Skills component
export const WEAPON_TYPE_META = {
    // One-Handed Weapons
    sword:     { label: 'Sword', hint: 'Balanced slashes and thrusts', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt', 'items') },
    axe:       { label: 'Axe', hint: 'Heavier cleaving swings', primaryStat: 'strength', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Axe/axe-brown-handle-beige-blade', 'items') },
    mace:      { label: 'Mace', hint: 'Crushing blows to armor', primaryStat: 'strength', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Mace/mace-spiked-club-brown-tan-bands-metal-spikes', 'items') },
    dagger:    { label: 'Dagger', hint: 'Quick close stabs', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped', 'items') },
    rapier:    { label: 'Rapier', hint: 'Elegant thrusting sword', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged', 'items') },
    katana:    { label: 'Katana', hint: 'Curved blade mastery', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Swords/sword-basic-japanese-golden-guard-pommel', 'items') },
    saber:     { label: 'Saber', hint: 'Curved single-edged blade', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted', 'items') },
    sickle:    { label: 'Sickle', hint: 'Curved hooking blade', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple', 'items') },
    flail:     { label: 'Flail', hint: 'Chain weapon with weighted head', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Flail/flail-brown-handle-chain-spiked-balls', 'items') },
    'fist weapon': { label: 'Fist Weapon', hint: 'Hand-mounted combat claws', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Fist Weapon/fist-weapon-claw-brown-green-red-blades', 'items') },
    'parrying dagger': { label: 'Parrying Dagger', hint: 'Defensive off-hand blade', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel', 'items') },
    'off hand blade': { label: 'Off-Hand Blade', hint: 'Light dual-wield blade', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped', 'items') },
    'war mace': { label: 'War Mace', hint: 'Heavy main-hand mace', primaryStat: 'strength', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head', 'items') },
    // Two-Handed Weapons
    greatsword:{ label: 'Greatsword', hint: 'Two-handed sweeping arcs', primaryStat: 'strength', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Swords/sword-fire-glowing-red-blade-golden-guard', 'items') },
    greataxe:  { label: 'Greataxe', hint: 'Massive cleaving chops', primaryStat: 'strength', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Axe/double-bladed-axe-asymmetric-bronze', 'items') },
    maul:      { label: 'Maul', hint: 'Shattering two-handed strikes', primaryStat: 'strength', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator', 'items') },
    polearm:   { label: 'Polearm', hint: 'Reach control and hooks', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Polearm/polearm-spear-staff-brown-wrapped-light-tip', 'items') },
    staff:     { label: 'Staff', hint: 'Defensive sweeps and jabs', primaryStat: 'spirit', secondaryStat: 'strength', icon: getIconUrl('Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel', 'items') },
    halberd:   { label: 'Halberd', hint: 'Axe blade and spear point', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Halberd/halberd-axe-blade-spike-hammer-rear', 'items') },
    scythe:    { label: 'Scythe', hint: 'Long curved reaping blade', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured', 'items') },
    'jousting spear': { label: 'Jousting Spear', hint: 'Long lance for mounted combat', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Jousting Spear/jousting-spear-sword-brown-beige-golden-metallic', 'items') },
    'double sided sword': { label: 'Double-Sided Sword', hint: 'Blades on both ends', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Double-sided Swords/double-sided-sword-beige-blades-brown-shaft_1', 'items') },
    // Ranged Weapons
    bow:       { label: 'Bow', hint: 'Arced shots from range', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Bows/bow-simple-brown-tan-grip', 'items') },
    crossbow:  { label: 'Crossbow', hint: 'Precision bolts with load time', primaryStat: 'agility', secondaryStat: 'intelligence', icon: getIconUrl('Weapons/Crossbow/crossbow-reddish-brown-loaded', 'items') },
    thrown:    { label: 'Thrown', hint: 'Axes, knives, or javelins', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Weapons/Throwing Axe/throwing-axe-brown-handle-beige-blade-standard', 'items') },
    wand:      { label: 'Wand', hint: 'Channelled spell strikes', primaryStat: 'spirit', secondaryStat: 'intelligence', icon: getIconUrl('Weapons/Wand/wand-basic-bow-curved-light-beige-simple', 'items') },
    blowgun:   { label: 'Blowgun', hint: 'Breath-propelled darts', primaryStat: 'agility', secondaryStat: 'constitution', icon: getIconUrl('Weapons/Blowgun/blowgun-wooden-stick-simple', 'items') },
    sling:     { label: 'Sling', hint: 'Centrifugal force projectile', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped', 'items') },
    boomerang: { label: 'Boomerang', hint: 'Returning curved thrower', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Boomerang/boomerang-brown-tapered-tip', 'items') },
    chakram:   { label: 'Chakram', hint: 'Circular throwing blade', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Chakram/chakram-broken-open-spiky', 'items') },
    shuriken:  { label: 'Shuriken', hint: 'Small concealed throwing star', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Shuriken/shuriken-diamond-teal-red-orange-yellow-arrows-four-points', 'items') },
    dart:      { label: 'Dart', hint: 'Small projectile weapon', primaryStat: 'agility', secondaryStat: 'strength', icon: getIconUrl('Weapons/Dart/dart-broom-orange-yellow-bristles-brown-handle', 'items') },
    // Instruments
    harp:      { label: 'Harp', hint: 'Stringed instrument channeling magic', primaryStat: 'charisma', secondaryStat: 'spirit', icon: getIconUrl('Instruments/Harp/harp-brown-beige-strings', 'items') },
    lute:      { label: 'Lute', hint: 'Bard\'s favored stringed instrument', primaryStat: 'charisma', secondaryStat: 'agility', icon: getIconUrl('Instruments/Lute/lute-orange-golden-octagonal', 'items') },
    flute:     { label: 'Flute', hint: 'Wind instrument enhancing spells', primaryStat: 'charisma', secondaryStat: 'constitution', icon: getIconUrl('Instruments/Flute/flute-brown-orange-ends', 'items') },
    drum:      { label: 'Drum', hint: 'Percussion creating rhythmic effects', primaryStat: 'strength', secondaryStat: 'charisma', icon: getIconUrl('Instruments/Drum/drum-banded-stripes', 'items') },
    horn:      { label: 'Horn', hint: 'Brass instrument for signaling', primaryStat: 'constitution', secondaryStat: 'charisma', icon: getIconUrl('Instruments/Horn/horn-curved-segmented', 'items') },
    violin:    { label: 'Violin', hint: 'Stringed instrument with bow', primaryStat: 'agility', secondaryStat: 'charisma', icon: getIconUrl('Instruments/Violin/violin-brown-f-holes-bow', 'items') },
    guitar:    { label: 'Guitar', hint: 'Popular bardic stringed instrument', primaryStat: 'charisma', secondaryStat: 'agility', icon: getIconUrl('Instruments/Guitar/guitar-ukulele-beige-octagonal', 'items') },
    // Special
    unarmed:   { label: 'Unarmed', hint: 'Fists, elbows, knees', primaryStat: 'strength', secondaryStat: 'agility', icon: getIconUrl('Bludgeoning/Punch', 'abilities') }
};

