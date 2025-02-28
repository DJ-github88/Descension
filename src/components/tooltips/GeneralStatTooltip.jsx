import React from 'react';

const getStatDescription = (stat) => {
    const descriptions = {
        // Spell Damage Types
        'Cold Damage': {
            title: 'Cold Damage',
            color: '#3CE7FF',
            effects: [
                'Freezing damage that can slow targets',
                'Common spells: Cone of Cold, Ice Storm',
                'Can extinguish flames and freeze liquids',
                'Effective in cold environments'
            ]
        },
        'Fire Damage': {
            title: 'Fire Damage',
            color: '#FF4400',
            effects: [
                'Burning damage that ignites objects',
                'Common spells: Fireball, Fire Bolt',
                'Can light torches and melt ice',
                'Extra effective in dry environments'
            ]
        },
        'Lightning Damage': {
            title: 'Lightning Damage',
            color: '#FFE93B',
            effects: [
                'Electrical damage that arcs between targets',
                'Common spells: Lightning Bolt, Chain Lightning',
                'Can short out electrical devices',
                'Extra effective against metal armor'
            ]
        },
        'Acid Damage': {
            title: 'Acid Damage',
            color: '#A5FF91',
            effects: [
                'Corrosive damage that melts materials',
                'Common spells: Acid Splash, Vitriolic Sphere',
                'Can destroy objects and equipment',
                'Effective against armored targets'
            ]
        },
        'Force Damage': {
            title: 'Force Damage',
            color: '#FF8AFF',
            effects: [
                'Pure magical energy damage',
                'Common spells: Magic Missile, Spiritual Weapon',
                'Affects incorporeal creatures normally',
                'Very few creatures resist this damage'
            ]
        },
        'Necrotic Damage': {
            title: 'Necrotic Damage',
            color: '#8C48FF',
            effects: [
                'Death energy that withers matter',
                'Common spells: Chill Touch, Circle of Death',
                'Can prevent healing',
                'Extra effective against living creatures'
            ]
        },
        'Radiant Damage': {
            title: 'Radiant Damage',
            color: '#FFE680',
            effects: [
                'Divine light that sears undead',
                'Common spells: Sacred Flame, Sunbeam',
                'Can dispel darkness',
                'Extra effective against undead and fiends'
            ]
        },
        'Poison Damage': {
            title: 'Poison Damage',
            color: '#A5FF91',
            effects: [
                'Toxic damage that sickens targets',
                'Common spells: Poison Spray, Cloudkill',
                'Can cause the poisoned condition',
                'Many creatures have resistance'
            ]
        },
        'Psychic Damage': {
            title: 'Psychic Damage',
            color: '#FF8AFF',
            effects: [
                'Mental damage that assaults the mind',
                'Common spells: Vicious Mockery, Mind Sliver',
                'Bypasses physical defenses',
                'Constructs often immune'
            ]
        },
        'Thunder Damage': {
            title: 'Thunder Damage',
            color: '#C0C0C0',
            effects: [
                'Concussive damage from sound waves',
                'Common spells: Thunderwave, Shatter',
                'Can be heard from far away',
                'Extra effective against brittle objects'
            ]
        },
        // Physical Damage Types
        'Piercing Damage': {
            title: 'Piercing Damage',
            color: '#FF4D4D',
            effects: [
                'Damage from piercing weapons',
                'Effective against lightly armored targets',
                'Common weapons: daggers, rapiers, arrows'
            ]
        },
        'Bludgeoning Damage': {
            title: 'Bludgeoning Damage',
            color: '#FF4D4D',
            effects: [
                'Damage from blunt weapons',
                'Effective against skeletons and constructs',
                'Common weapons: maces, hammers, clubs'
            ]
        },
        'Slashing Damage': {
            title: 'Slashing Damage',
            color: '#FF4D4D',
            effects: [
                'Damage from edged weapons',
                'Effective against unarmored targets',
                'Common weapons: swords, axes, scimitars'
            ]
        },
        'Hit Chance': {
            title: 'Hit Chance',
            color: '#FFB81A',
            effects: [
                'Adds bonus to attack rolls',
                '+1: Adds 1 to your d20 attack roll',
                '+2: Adds 2 to your d20 attack roll',
                '+3: Adds 3 to your d20 attack roll (significant advantage)'
            ]
        },
        // Other Stats
        'Crit Chance': {
            title: 'Critical Strike',
            color: '#FFB81A',
            effects: [
                'Increases critical hit range on d20',
                '5%: Critical on natural 19-20',
                '10%: Critical on natural 18-20',
                '15%: Critical on natural 17-20'
            ]
        },
        'Spell Power': {
            title: 'Spell Power',
            color: '#69CCF0',
            effects: [
                'Increases magical damage and healing',
                'Adds to spell damage rolls',
                'Different schools gain additional bonuses'
            ]
        },
        'Melee Power': {
            title: 'Melee Power',
            color: '#FF4D4D',
            effects: [
                'Increases physical damage with melee weapons',
                'Adds to melee attack rolls',
                'Improves combat maneuvers'
            ]
        },
        'Ranged Power': {
            title: 'Ranged Power',
            color: '#AAD372',
            effects: [
                'Increases physical damage with ranged weapons',
                'Adds to ranged attack rolls',
                'Improves shot accuracy'
            ]
        },
        'Initiative': {
            title: 'Initiative',
            color: '#AAD372',
            effects: [
                'Determines turn order in combat',
                'Adds to initiative rolls',
                'Higher values act earlier in combat'
            ]
        },
        'Movement Speed': {
            title: 'Movement Speed',
            color: '#AAD372',
            effects: [
                'Base movement per turn',
                'Affected by armor and encumbrance',
                'Modified by terrain and conditions'
            ]
        },
        'Vision Range': {
            title: 'Vision Range',
            color: '#AAD372',
            effects: [
                'How far you can see in the dark.',
                'Without vision, you must spend extra movement to see.'
            ]
        },
        'Swim Speed': {
            title: 'Swim Speed',
            color: '#AAD372',
            effects: [
                'How fast you can swim through water.',
                'Without swim speed, you must spend extra movement to swim.'
            ]
        },
        'Armor Class': {
            title: 'Armor Class',
            color: '#FFF',
            effects: [
                'Determines difficulty to be hit',
                'Enemy must roll higher than AC to hit',
                'Some attacks may target different defenses'
            ]
        },
        'Max Health': {
            title: 'Maximum Health',
            color: '#FF7D0A',
            effects: [
                'Your total health pool',
                'Increased by Constitution modifier',
                'Death saves at 0 HP'
            ]
        },
        'Max Mana': {
            title: 'Maximum Mana',
            color: '#69CCF0',
            effects: [
                'Your total mana pool',
                'Increased by Intelligence modifier',
                'Required for casting spells'
            ]
        },
        'Health Regeneration': {
            title: 'Health Regeneration',
            color: '#FF7D0A',
            effects: [
                'Health restored each round',
                'Active in and out of combat',
                'Doubled during short rests'
            ]
        },
        'Mana Regeneration': {
            title: 'Mana Regeneration',
            color: '#69CCF0',
            effects: [
                'Mana restored each round',
                'Increased during short rests',
                'Affected by Spirit modifier'
            ]
        },
        'Healing Received': {
            title: 'Healing Received',
            color: '#FFFFFF',
            effects: [
                'Bonus to healing received',
                'Applies to all healing sources',
                'Stacks with healing modifiers'
            ]
        },
        'Healing Power': {
            title: 'Healing Power',
            color: '#FFFFFF',
            effects: [
                'Increases healing done by spells',
                'Adds to healing spell rolls',
                'Affected by Spirit modifier'
            ]
        },
        'Carrying Capacity': {
            title: 'Carrying Capacity',
            color: '#FF4D4D',
            effects: [
                'Base: 5x5 inventory grid',
                'Encumbered: -10ft movement',
                'Heavily Encumbered: -20ft, disadvantage on checks'
            ]
        },
        'Resistances': {
            title: 'Resistances',
            color: '#69CCF0',
            effects: [
                'Reduces incoming damage from specific damage types',
                'Higher resistances mean better survival against elemental threats',
                'Can be improved through gear and special abilities'
            ]
        },
    };

    return descriptions[stat];
};

const GeneralStatTooltip = ({ stat }) => {
    const info = getStatDescription(stat);
    if (!info) return null;

    return (
        <>
            <div className="tooltip-header" style={{ color: info.color }}>
                {info.title}
            </div>
            <div className="tooltip-effects">
                {info.effects.map((effect, index) => (
                    <div key={index} className="tooltip-effect">
                        {effect}
                    </div>
                ))}
            </div>
        </>
    );
};

export default GeneralStatTooltip;
