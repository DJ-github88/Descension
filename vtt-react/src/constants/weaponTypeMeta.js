import { getIconUrl } from '../utils/assetManager';

// Shared weapon type metadata used across SkillsDisplay and character sheet Skills component
export const WEAPON_TYPE_META = {
    // One-Handed Weapons
    sword:     { label: 'Sword', hint: 'Balanced slashes and thrusts', icon: getIconUrl('Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt', 'items') },
    axe:       { label: 'Axe', hint: 'Heavier cleaving swings', icon: getIconUrl('Weapons/Axe/axe-brown-handle-beige-blade', 'items') },
    mace:      { label: 'Mace', hint: 'Crushing blows to armor', icon: getIconUrl('Weapons/Mace/mace-spiked-club-brown-tan-bands-metal-spikes', 'items') },
    dagger:    { label: 'Dagger', hint: 'Quick close stabs', icon: getIconUrl('Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped', 'items') },
    rapier:    { label: 'Rapier', hint: 'Elegant thrusting sword', icon: getIconUrl('Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged', 'items') },
    katana:    { label: 'Katana', hint: 'Curved blade mastery', icon: getIconUrl('Weapons/Swords/sword-basic-japanese-golden-guard-pommel', 'items') },
    saber:     { label: 'Saber', hint: 'Curved single-edged blade', icon: getIconUrl('Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted', 'items') },
    sickle:    { label: 'Sickle', hint: 'Curved hooking blade', icon: getIconUrl('Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple', 'items') },
    flail:     { label: 'Flail', hint: 'Chain weapon with weighted head', icon: getIconUrl('Weapons/Flail/flail-brown-handle-chain-spiked-balls', 'items') },
    'fist weapon': { label: 'Fist Weapon', hint: 'Hand-mounted combat claws', icon: getIconUrl('Weapons/Fist Weapon/fist-weapon-claw-brown-green-red-blades', 'items') },
    'parrying dagger': { label: 'Parrying Dagger', hint: 'Defensive off-hand blade', icon: getIconUrl('Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel', 'items') },
    'off hand blade': { label: 'Off-Hand Blade', hint: 'Light dual-wield blade', icon: getIconUrl('Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped', 'items') },
    'war mace': { label: 'War Mace', hint: 'Heavy main-hand mace', icon: getIconUrl('Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head', 'items') },
    // Two-Handed Weapons
    greatsword:{ label: 'Greatsword', hint: 'Two-handed sweeping arcs', icon: getIconUrl('Weapons/Swords/sword-fire-glowing-red-blade-golden-guard', 'items') },
    greataxe:  { label: 'Greataxe', hint: 'Massive cleaving chops', icon: getIconUrl('Weapons/Axe/double-bladed-axe-asymmetric-bronze', 'items') },
    maul:      { label: 'Maul', hint: 'Shattering two-handed strikes', icon: getIconUrl('Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator', 'items') },
    polearm:   { label: 'Polearm', hint: 'Reach control and hooks', icon: getIconUrl('Weapons/Polearm/polearm-spear-staff-brown-wrapped-light-tip', 'items') },
    staff:     { label: 'Staff', hint: 'Defensive sweeps and jabs', icon: getIconUrl('Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel', 'items') },
    halberd:   { label: 'Halberd', hint: 'Axe blade and spear point', icon: getIconUrl('Weapons/Halberd/halberd-axe-blade-spike-hammer-rear', 'items') },
    scythe:    { label: 'Scythe', hint: 'Long curved reaping blade', icon: getIconUrl('Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured', 'items') },
    'jousting spear': { label: 'Jousting Spear', hint: 'Long lance for mounted combat', icon: getIconUrl('Weapons/Jousting Spear/jousting-spear-sword-brown-beige-golden-metallic', 'items') },
    'double sided sword': { label: 'Double-Sided Sword', hint: 'Blades on both ends', icon: getIconUrl('Weapons/Double-sided Swords/double-sided-sword-beige-blades-brown-shaft_1', 'items') },
    // Ranged Weapons
    bow:       { label: 'Bow', hint: 'Arced shots from range', icon: getIconUrl('Weapons/Bows/bow-simple-brown-tan-grip', 'items') },
    crossbow:  { label: 'Crossbow', hint: 'Precision bolts with load time', icon: getIconUrl('Weapons/Crossbow/crossbow-reddish-brown-loaded', 'items') },
    thrown:    { label: 'Thrown', hint: 'Axes, knives, or javelins', icon: getIconUrl('Weapons/Throwing Axe/throwing-axe-brown-handle-beige-blade-standard', 'items') },
    wand:      { label: 'Wand', hint: 'Channelled spell strikes', icon: getIconUrl('Weapons/Wand/wand-basic-bow-curved-light-beige-simple', 'items') },
    blowgun:   { label: 'Blowgun', hint: 'Breath-propelled darts', icon: getIconUrl('Weapons/Blowgun/blowgun-wooden-stick-simple', 'items') },
    sling:     { label: 'Sling', hint: 'Centrifugal force projectile', icon: getIconUrl('Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped', 'items') },
    boomerang: { label: 'Boomerang', hint: 'Returning curved thrower', icon: getIconUrl('Weapons/Boomerang/boomerang-brown-tapered-tip', 'items') },
    chakram:   { label: 'Chakram', hint: 'Circular throwing blade', icon: getIconUrl('Weapons/Chakram/chakram-broken-open-spiky', 'items') },
    shuriken:  { label: 'Shuriken', hint: 'Small concealed throwing star', icon: getIconUrl('Weapons/Shuriken/shuriken-diamond-teal-red-orange-yellow-arrows-four-points', 'items') },
    dart:      { label: 'Dart', hint: 'Small projectile weapon', icon: getIconUrl('Weapons/Dart/dart-broom-orange-yellow-bristles-brown-handle', 'items') },
    // Instruments
    harp:      { label: 'Harp', hint: 'Stringed instrument channeling magic', icon: getIconUrl('Instruments/Harp/harp-brown-beige-strings', 'items') },
    lute:      { label: 'Lute', hint: 'Bard\'s favored stringed instrument', icon: getIconUrl('Instruments/Lute/lute-orange-golden-octagonal', 'items') },
    flute:     { label: 'Flute', hint: 'Wind instrument enhancing spells', icon: getIconUrl('Instruments/Flute/flute-brown-orange-ends', 'items') },
    drum:      { label: 'Drum', hint: 'Percussion creating rhythmic effects', icon: getIconUrl('Instruments/Drum/drum-banded-stripes', 'items') },
    horn:      { label: 'Horn', hint: 'Brass instrument for signaling', icon: getIconUrl('Instruments/Horn/horn-curved-segmented', 'items') },
    violin:    { label: 'Violin', hint: 'Stringed instrument with bow', icon: getIconUrl('Instruments/Violin/violin-brown-f-holes-bow', 'items') },
    guitar:    { label: 'Guitar', hint: 'Popular bardic stringed instrument', icon: getIconUrl('Instruments/Guitar/guitar-ukulele-beige-octagonal', 'items') },
    // Special
    unarmed:   { label: 'Unarmed', hint: 'Fists, elbows, knees', icon: getIconUrl('Bludgeoning/Punch', 'abilities') }
};

