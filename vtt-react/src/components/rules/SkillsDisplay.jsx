import React, { useState } from 'react';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, SKILL_RANKS } from '../../constants/skillDefinitions';
import { SKILL_QUESTS } from '../../constants/skillQuests';
import { WEAPON_TYPE_QUEST_DATA } from '../../constants/weaponTypeQuests';
import { WEAPON_TYPE_META } from '../../constants/weaponTypeMeta';
import { ROLLABLE_TABLES } from '../../constants/rollableTables';
import { getIconUrl } from '../../utils/assetManager';
import './BackgroundSelector.css';

const SkillsDisplay = () => {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDie, setSelectedDie] = useState('d20'); // Default to d20 (hardest)
    const [selectedProficiency, setSelectedProficiency] = useState('UNTRAINED'); // Default to UNTRAINED
    const [selectedWeaponType, setSelectedWeaponType] = useState('sword'); // Default weapon profile

    // Remove any leading weapon-type label from a string
    const stripWeaponPrefix = (text) => text.replace(/^(sword|axe|mace|dagger|greatsword|greataxe|maul|polearm|staff|bow|crossbow|thrown|thrown weapon|wand|rapier|katana|saber|sickle|flail|halberd|scythe|blowgun|sling|boomerang|chakram|shuriken|dart|harp|lute|flute|drum|horn|violin|guitar|fist weapon|jousting spear|double sided sword|parrying dagger|off hand blade|war mace|unarmed)\s*:\s*/i, '').trim();

    const PROFICIENCY_ORDER = ['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT', 'EXPERT', 'MASTER'];

    const WEAPON_FLAVOR = {
        // One-Handed
        sword:  { weapon: 'sword', part: 'edge', verb: 'swing' },
        axe:    { weapon: 'axe', part: 'bit', verb: 'hew' },
        mace:   { weapon: 'mace', part: 'head', verb: 'crush' },
        dagger: { weapon: 'dagger', part: 'point', verb: 'stab' },
        rapier: { weapon: 'rapier', part: 'point', verb: 'thrust' },
        katana: { weapon: 'katana', part: 'edge', verb: 'slice' },
        saber:  { weapon: 'saber', part: 'edge', verb: 'cut' },
        sickle: { weapon: 'sickle', part: 'hook', verb: 'hook' },
        flail:  { weapon: 'flail', part: 'head', verb: 'whip' },
        'fist weapon': { weapon: 'fist weapon', part: 'claw', verb: 'rake' },
        'parrying dagger': { weapon: 'parrying dagger', part: 'guard', verb: 'parry' },
        'off hand blade': { weapon: 'off-hand blade', part: 'edge', verb: 'slash' },
        'war mace': { weapon: 'war mace', part: 'head', verb: 'crush' },
        // Two-Handed
        greatsword: { weapon: 'greatsword', part: 'edge', verb: 'cleave' },
        greataxe:  { weapon: 'greataxe', part: 'beard', verb: 'heave' },
        maul:   { weapon: 'maul', part: 'face', verb: 'slam' },
        polearm:{ weapon: 'polearm', part: 'hook', verb: 'thrust' },
        staff:  { weapon: 'staff', part: 'end', verb: 'strike' },
        halberd: { weapon: 'halberd', part: 'axe-head', verb: 'chop' },
        scythe: { weapon: 'scythe', part: 'blade', verb: 'reap' },
        'jousting spear': { weapon: 'jousting spear', part: 'point', verb: 'lance' },
        'double sided sword': { weapon: 'double-sided sword', part: 'blade', verb: 'whirl' },
        // Ranged
        bow:    { weapon: 'bow', part: 'string', verb: 'loose' },
        crossbow:{ weapon: 'crossbow', part: 'latch', verb: 'squeeze' },
        thrown: { weapon: 'thrown weapon', part: 'grip', verb: 'hurl' },
        wand:   { weapon: 'wand', part: 'focus', verb: 'channel' },
        blowgun: { weapon: 'blowgun', part: 'tube', verb: 'blow' },
        sling:  { weapon: 'sling', part: 'pouch', verb: 'sling' },
        boomerang: { weapon: 'boomerang', part: 'wing', verb: 'throw' },
        chakram: { weapon: 'chakram', part: 'rim', verb: 'spin' },
        shuriken: { weapon: 'shuriken', part: 'point', verb: 'flick' },
        dart:   { weapon: 'dart', part: 'point', verb: 'throw' },
        // Instruments
        harp:   { weapon: 'harp', part: 'string', verb: 'strum' },
        lute:   { weapon: 'lute', part: 'string', verb: 'pluck' },
        flute:  { weapon: 'flute', part: 'mouthpiece', verb: 'play' },
        drum:   { weapon: 'drum', part: 'head', verb: 'beat' },
        horn:   { weapon: 'horn', part: 'bell', verb: 'blow' },
        violin: { weapon: 'violin', part: 'bow', verb: 'bow' },
        guitar: { weapon: 'guitar', part: 'string', verb: 'strum' },
        // Special
        unarmed: { weapon: 'fist', part: 'knuckle', verb: 'strike' }
    };


    // Weapon-specific faces (1-8) override the generic template to add rich, RP-friendly outcomes
    const WEAPON_FACE_TEXT = {
        sword: {
            1: 'Blade overextends; lose 1 AP and you cannot riposte this round.',
            2: 'Edge scrapes; shallow cut only.',
            3: 'Measured cut; steady but simple.',
            4: 'Quick slash; you may step 1 after the hit.',
            5: 'Pommel check; on hit, target reels and loses 1 space of movement.',
            6: 'Cross-cut; on hit, roll weapon die again and add half.',
            7: 'Riposte set; if target attacks you before your next turn, make a free counter at -2.',
            8: 'Dancing steel; make a free follow-up slash at half damage.'
        },
        axe: {
            1: 'Head bites and lodges; spend 1 AP to wrench it free.',
            2: 'Heavy chop skids; half damage.',
            3: 'Wide arc forces them back 1 space on hit.',
            4: 'Hack through; +2 damage versus shields or hard cover.',
            5: 'Cleave; on hit, deal 2 damage to an adjacent foe.',
            6: 'Hook and yank; pull target 1 space on hit.',
            7: 'Rending blow; on hit, target suffers a bleeding nick (GM: minor ongoing).',
            8: 'Sundering chop; on hit, crack armor or deal +4 damage.'
        },
        mace: {
            1: 'Shock up the arm; you drop 1 AP after this swing.',
            2: 'Glancing crown; half damage.',
            3: 'Bruising tap; normal damage.',
            4: 'Ringing strike; on hit, target’s next action is -1.',
            5: 'Shatter guard; ignore hardness/armor for this hit.',
            6: 'Crush limb; on hit, target’s move is -1 until end of next turn.',
            7: 'Concussive blow; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
            8: 'Skull-rattler; on hit, target is stunned for a turn or takes +5 damage.'
        },
        dagger: {
            1: 'Slip; nick yourself for 1 damage.',
            2: 'Short slash; half damage.',
            3: 'Close stab; normal damage.',
            4: 'Gut jab; +1 damage and you may hide weapon-side (gain slight concealment if applicable).',
            5: 'Hamstring; on hit, target’s speed -1 until it recovers.',
            6: 'Quickhand; on hit, make a second dagger jab at -3 to hit.',
            7: 'Bleed line; on hit, target suffers minor ongoing bleed (GM adjudicates).',
            8: 'Assassin’s flick; on hit, add weapon die again and step 1 for free.'
        },
        greatsword: {
            1: 'Mass overbalances; fall prone unless you spend 1 AP to steady.',
            2: 'Draggy swing; half damage.',
            3: 'Wide arc; push target 1 on hit.',
            4: 'Driving cut; +2 damage.',
            5: 'Mighty sweep; on hit, also deal 2 damage to an adjacent foe.',
            6: 'Batter through; ignore heavy cover for this attack.',
            7: 'Cleaving stride; on hit, shift 1 and strike a second adjacent foe at -2 to hit.',
            8: 'Heaving execution; on hit, add weapon die again and force target prone or take +5 damage.'
        },
        greataxe: {
            1: 'Head bites stone; you must spend 1 AP to free it.',
            2: 'Wild chop; half damage and you stagger 1 space.',
            3: 'Raking cut; normal damage.',
            4: 'Hefted cleave; +2 damage.',
            5: 'Armor split; on hit, ignore armor/hardness for this strike.',
            6: 'Sweeping murder; cleave an adjacent foe for half damage.',
            7: 'Bonebreaker; on hit, target’s next move is halved; if it can’t move, +3 damage.',
            8: 'Executioner’s arc; on hit, add weapon die again and the target is rattled (loses 1 AP).'
        },
        maul: {
            1: 'Recoil numbs arms; lose 1 AP after this attack.',
            2: 'Head drags; half damage.',
            3: 'Thudding hit; normal damage.',
            4: 'Cratering blow; +2 damage.',
            5: 'Ring their bell; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
            6: 'Ground-shake; on hit, target is knocked prone.',
            7: 'Stunning smash; on hit, target is stunned for a turn.',
            8: 'Pulverize; on hit, add weapon die again and shove target 2 spaces.'
        },
        polearm: {
            1: 'Hook catches; you cannot shift this turn.',
            2: 'Overreach; half damage.',
            3: 'Set vs advance; if target moves toward you, it takes +2 damage on hit.',
            4: 'Lever pull; on hit, pull target 2 or push 2.',
            5: 'Trip arc; on hit, target is knocked prone.',
            6: 'Pin and post; target’s move is -2 until end of next turn.',
            7: 'Crow’s beak; ignore armor and add +3 damage.',
            8: 'Whirl hook; on hit, you may reposition the target 3 and follow into its space.'
        },
        staff: {
            1: 'Misstep; you fall prone unless you spend 1 AP to steady.',
            2: 'Glance; half damage.',
            3: 'Quick rap; normal damage.',
            4: 'Low sweep; on hit, target must steady—its next attack roll is -1.',
            5: 'Disarm flick; on hit, target drops a held item or takes +2 damage.',
            6: 'Trip and follow; on hit, target goes prone and you may step 1.',
            7: 'Sweeping arc; on hit, target is knocked prone or stunned for a turn.',
            8: 'Whirling stave; on hit, strike a second adjacent foe for half damage and shift 1.'
        },
        bow: {
            1: 'String frays; next shot costs +1 AP to ready.',
            2: 'Wind catches; half damage.',
            3: 'Arced shot; normal damage.',
            4: 'Pinning arrow; on hit, target’s next move is -2.',
            5: 'Seam seeker; ignore cover on this shot.',
            6: 'Marked; on hit, next ally to shoot this target gains +2 to hit.',
            7: 'Whistling arc; on hit, add +2 range to your next shot and deal +2 damage now.',
            8: 'Twin release; fire a second arrow at the same target for half damage.'
        },
        crossbow: {
            1: 'Latch jams; spend 1 AP to clear before next shot.',
            2: 'Bolt skitters; half damage.',
            3: 'Solid bolt; normal damage.',
            4: 'Pinned limb; on hit, target’s next action is -1.',
            5: 'Crank and fire; ignore cover on this shot.',
            6: 'Punch-through; on hit, add +3 damage.',
            7: 'Rattling hit; on hit, target loses 1 AP next turn.',
            8: 'Snap reload; after this hit, reload for free and gain +1 damage on the next shot.'
        },
        thrown: {
            1: 'Slip; weapon drops at your feet.',
            2: 'Off-line; half damage.',
            3: 'Solid throw; normal damage.',
            4: 'Pin cloak; on hit, target’s speed -2.',
            5: 'Gouging strike; on hit, target is dazzled—its next attack roll is -1.',
            6: 'Ricochet; on hit, choose a second nearby target for 2 damage.',
            7: 'Crippling toss; on hit, target’s next action is -1 and it bleeds (GM adjudicates).',
            8: 'Bullseye; on hit, add weapon die again and you may immediately retrieve the weapon.'
        },
        wand: {
            1: 'Mana sputter; lose 1 mana/charge.',
            2: 'Wild spark; half damage, minor harmless sparks.',
            3: 'Arcane dart; normal damage.',
            4: 'Channel; on hit, regain 1 mana/charge.',
            5: 'Spell lash; on hit, target\'s next action is -1.',
            6: 'Force pulse; on hit, push target 2.',
            7: 'Focused surge; on hit, regain 2 mana/charges.',
            8: 'Overchannel; on hit, add weapon die again and choose: regain 2 mana/charges or deal +4 damage.'
        },
        rapier: {
            1: 'Point overextends; lose 1 AP and cannot riposte.',
            2: 'Shallow thrust; half damage.',
            3: 'Precise lunge; normal damage.',
            4: 'Fleche; on hit, step 1 for free.',
            5: 'Disengage; on hit, step 1 away without provoking.',
            6: 'Foil parry; on hit, target\'s next attack is -1.',
            7: 'Perfect thrust; on hit, add weapon die again.',
            8: 'Fencing master; on hit, make a free riposte if target attacks before your next turn.'
        },
        katana: {
            1: 'Overcommit; lose 1 AP after this attack.',
            2: 'Glancing slice; half damage.',
            3: 'Clean cut; normal damage.',
            4: 'Iaido draw; +1 damage and step 1.',
            5: 'Battou-jutsu; on hit, target is staggered (loses 1 space movement).',
            6: 'Flowing cut; on hit, roll weapon die again and add half.',
            7: 'Perfect form; on hit, ignore armor and add +2 damage.',
            8: 'Iaijutsu master; on hit, add weapon die again and target is rattled (loses 1 AP).'
        },
        halberd: {
            1: 'Head catches; spend 1 AP to free it.',
            2: 'Awkward swing; half damage.',
            3: 'Controlled strike; normal damage.',
            4: 'Hook and pull; on hit, pull target 1 space.',
            5: 'Axe-head chop; on hit, ignore light armor.',
            6: 'Spear point thrust; on hit, add +2 damage.',
            7: 'Combined attack; on hit, choose: pull 2 spaces or +3 damage.',
            8: 'Masterful halberd; on hit, pull target 2, then strike again at -2 to hit.'
        },
        scythe: {
            1: 'Blade catches; lose 1 AP to free it.',
            2: 'Wide miss; half damage.',
            3: 'Sweeping cut; normal damage.',
            4: 'Reaping arc; on hit, target is pulled 1 space.',
            5: 'Deep cut; on hit, target suffers minor bleed (GM adjudicates).',
            6: 'Harvest strike; on hit, add +2 damage.',
            7: 'Grim reaper; on hit, target is rattled (loses 1 AP) or takes +3 damage.',
            8: 'Death scythe; on hit, add weapon die again and target is staggered (speed -1).'
        },
        flail: {
            1: 'Chain tangles; spend 1 AP to untangle.',
            2: 'Wild swing; half damage.',
            3: 'Controlled whip; normal damage.',
            4: 'Wrap around; on hit, target\'s next action is -1.',
            5: 'Chain strike; on hit, ignore shield bonuses.',
            6: 'Double strike; on hit, make a second attack at -2 to hit.',
            7: 'Entangle; on hit, target is restrained (cannot move) until end of next turn.',
            8: 'Masterful flail; on hit, add weapon die again and target is disarmed or takes +4 damage.'
        },
        sickle: {
            1: 'Hook misses; lose 1 AP.',
            2: 'Shallow hook; half damage.',
            3: 'Curved cut; normal damage.',
            4: 'Hooking strike; on hit, pull target 1 space.',
            5: 'Disarm hook; on hit, target drops a held item or takes +2 damage.',
            6: 'Trip and cut; on hit, target is knocked prone.',
            7: 'Reaping hook; on hit, target is staggered (speed -1) or takes +3 damage.',
            8: 'Harvest master; on hit, add weapon die again and pull target 2 spaces.'
        },
        blowgun: {
            1: 'Dart fumbles; next shot costs +1 AP.',
            2: 'Weak blow; half damage.',
            3: 'Steady shot; normal damage.',
            4: 'Precise dart; on hit, target\'s next action is -1.',
            5: 'Poisoned tip; on hit, target suffers minor poison (GM adjudicates).',
            6: 'Double dart; fire a second dart at -2 to hit.',
            7: 'Silent kill; on hit, target cannot call for help this turn.',
            8: 'Master shot; on hit, add weapon die again and target is dazed (loses 1 AP).'
        },
        sling: {
            1: 'Stone drops; next shot costs +1 AP.',
            2: 'Wild throw; half damage.',
            3: 'Accurate shot; normal damage.',
            4: 'Stunning stone; on hit, target is dazed (loses 1 AP).',
            5: 'Ricochet; on hit, choose a second nearby target for 2 damage.',
            6: 'Precise aim; ignore cover on this shot.',
            7: 'Rapid fire; fire a second stone at -2 to hit.',
            8: 'Master slinger; on hit, add weapon die again and target is knocked prone.'
        },
        boomerang: {
            1: 'Boomerang doesn\'t return; spend 1 AP to retrieve.',
            2: 'Off-target; half damage.',
            3: 'Returning throw; normal damage.',
            4: 'Curved path; ignore cover on this shot.',
            5: 'Double hit; on hit, boomerang returns and you may strike again at -2.',
            6: 'Wide arc; on hit, also deal 2 damage to an adjacent foe.',
            7: 'Perfect return; on hit, add +2 damage and retrieve for free.',
            8: 'Master throw; on hit, add weapon die again and boomerang returns to hand immediately.'
        },
        chakram: {
            1: 'Chakram bounces away; spend 1 AP to retrieve.',
            2: 'Glancing spin; half damage.',
            3: 'Spinning cut; normal damage.',
            4: 'Wide arc; on hit, also deal 2 damage to an adjacent foe.',
            5: 'Returning throw; on hit, chakram returns to hand.',
            6: 'Precise spin; ignore cover on this attack.',
            7: 'Double chakram; throw a second chakram at -2 to hit.',
            8: 'Master spin; on hit, add weapon die again and chakram returns immediately.'
        },
        shuriken: {
            1: 'Shuriken slips; next throw costs +1 AP.',
            2: 'Weak throw; half damage.',
            3: 'Accurate throw; normal damage.',
            4: 'Multiple shuriken; on hit, also deal 1 damage to an adjacent foe.',
            5: 'Precise aim; ignore cover on this attack.',
            6: 'Fan of blades; throw 2 more shuriken at -2 each.',
            7: 'Poisoned edge; on hit, target suffers minor poison (GM adjudicates).',
            8: 'Master throw; on hit, add weapon die again and throw 2 more shuriken at -1 each.'
        },
        dart: {
            1: 'Dart fumbles; next throw costs +1 AP.',
            2: 'Weak throw; half damage.',
            3: 'Accurate dart; normal damage.',
            4: 'Precise aim; on hit, target\'s next action is -1.',
            5: 'Poisoned tip; on hit, target suffers minor poison (GM adjudicates).',
            6: 'Rapid throw; throw a second dart at -2 to hit.',
            7: 'Critical point; on hit, add +2 damage and target is dazed (loses 1 AP).',
            8: 'Master throw; on hit, add weapon die again and throw 2 more darts at -1 each.'
        },
        harp: {
            1: 'String breaks; lose 1 AP to restring.',
            2: 'Off-key note; half damage, minor discord.',
            3: 'Harmonious chord; normal damage.',
            4: 'Enchanting melody; on hit, regain 1 mana/charge.',
            5: 'Bardic inspiration; nearest ally gains +1 to next attack roll.',
            6: 'Resonant strike; on hit, add +2 damage.',
            7: 'Masterful performance; on hit, all allies gain +1 to attack rolls this round.',
            8: 'Epic ballad; on hit, add weapon die again and choose: regain 2 mana/charges or all allies gain +2 to attack rolls.'
        },
        lute: {
            1: 'String snaps; lose 1 AP to restring.',
            2: 'Discordant strum; half damage.',
            3: 'Melodic pluck; normal damage.',
            4: 'Bardic tune; on hit, regain 1 mana/charge.',
            5: 'Inspiring song; nearest ally gains +1 to next attack roll.',
            6: 'Rhythmic strike; on hit, add +2 damage.',
            7: 'Enchanting melody; on hit, target is charmed (next action is -1) or takes +3 damage.',
            8: 'Master performance; on hit, add weapon die again and all allies gain +1 to attack rolls this round.'
        },
        flute: {
            1: 'Breath falters; lose 1 AP.',
            2: 'Off-key note; half damage.',
            3: 'Clear tone; normal damage.',
            4: 'Enchanting melody; on hit, regain 1 mana/charge.',
            5: 'Soothing tune; on hit, target\'s next action is -1.',
            6: 'Piercing note; on hit, add +2 damage.',
            7: 'Hypnotic melody; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
            8: 'Masterful performance; on hit, add weapon die again and choose: regain 2 mana/charges or target is stunned for a turn.'
        },
        drum: {
            1: 'Drumhead tears; lose 1 AP to repair.',
            2: 'Weak beat; half damage.',
            3: 'Steady rhythm; normal damage.',
            4: 'War drum; nearest ally gains +1 to next attack roll.',
            5: 'Thunderous beat; on hit, add +2 damage.',
            6: 'Rallying rhythm; all allies gain +1 to attack rolls this round.',
            7: 'Deafening boom; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
            8: 'Masterful rhythm; on hit, add weapon die again and all allies gain +2 to attack rolls this round.'
        },
        horn: {
            1: 'Horn fails; lose 1 AP.',
            2: 'Weak blast; half damage.',
            3: 'Clear call; normal damage.',
            4: 'Rallying horn; nearest ally gains +1 to next attack roll.',
            5: 'Deafening blast; on hit, target\'s next action is -1.',
            6: 'War horn; all allies gain +1 to attack rolls this round.',
            7: 'Thunderous call; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
            8: 'Masterful blast; on hit, add weapon die again and all allies gain +2 to attack rolls this round.'
        },
        violin: {
            1: 'String breaks; lose 1 AP to restring.',
            2: 'Screeching note; half damage.',
            3: 'Melodic bow; normal damage.',
            4: 'Enchanting melody; on hit, regain 1 mana/charge.',
            5: 'Hypnotic tune; on hit, target\'s next action is -1.',
            6: 'Resonant strike; on hit, add +2 damage.',
            7: 'Masterful performance; on hit, target is charmed (next action is -1) or takes +3 damage.',
            8: 'Epic concerto; on hit, add weapon die again and all allies gain +1 to attack rolls this round.'
        },
        guitar: {
            1: 'String snaps; lose 1 AP to restring.',
            2: 'Discordant strum; half damage.',
            3: 'Rocking chord; normal damage.',
            4: 'Bardic riff; on hit, regain 1 mana/charge.',
            5: 'Inspiring solo; nearest ally gains +1 to next attack roll.',
            6: 'Power chord; on hit, add +2 damage.',
            7: 'Epic performance; on hit, all allies gain +1 to attack rolls this round.',
            8: 'Masterful rock; on hit, add weapon die again and choose: regain 2 mana/charges or all allies gain +2 to attack rolls.'
        },
        'fist weapon': {
            1: 'Claw catches; lose 1 AP to free it.',
            2: 'Weak rake; half damage.',
            3: 'Sharp strike; normal damage.',
            4: 'Raking claws; on hit, target suffers minor bleed (GM adjudicates).',
            5: 'Tearing strike; on hit, add +2 damage.',
            6: 'Dual strike; on hit, make a second attack at -2 to hit.',
            7: 'Frenzied claws; on hit, add weapon die again.',
            8: 'Masterful rake; on hit, add weapon die again and target is staggered (speed -1).'
        },
        'jousting spear': {
            1: 'Lance breaks; lose 1 AP.',
            2: 'Glancing strike; half damage.',
            3: 'Solid impact; normal damage.',
            4: 'Charging strike; on hit, push target 2 spaces.',
            5: 'Unhorse; on hit, target is knocked prone.',
            6: 'Piercing lance; on hit, ignore armor and add +2 damage.',
            7: 'Perfect charge; on hit, add weapon die again and push target 3 spaces.',
            8: 'Masterful joust; on hit, add weapon die again, target is knocked prone, and you may continue moving.'
        },
        'double sided sword': {
            1: 'Blades tangle; lose 1 AP to untangle.',
            2: 'Awkward spin; half damage.',
            3: 'Controlled whirl; normal damage.',
            4: 'Dual strike; on hit, make a second attack at -2 to hit.',
            5: 'Spinning defense; foes take -1 to hit you until your next turn.',
            6: 'Whirling blades; on hit, also deal 2 damage to an adjacent foe.',
            7: 'Masterful spin; on hit, add weapon die again and strike a second target at -1.',
            8: 'Perfect whirlwind; on hit, add weapon die again and strike all adjacent foes for half damage.'
        },
        'parrying dagger': {
            1: 'Parry fails; lose 1 AP.',
            2: 'Weak block; half damage.',
            3: 'Defensive strike; normal damage.',
            4: 'Riposte; if target attacks you before your next turn, make a free counter at -1.',
            5: 'Disarm attempt; on hit, target drops a held item or takes +2 damage.',
            6: 'Perfect parry; on hit, target\'s next attack is -2.',
            7: 'Masterful defense; on hit, you gain +2 to defense until your next turn.',
            8: 'Ultimate parry; on hit, add weapon die again and target is disarmed.'
        },
        'off hand blade': {
            1: 'Blade slips; lose 1 AP.',
            2: 'Weak slash; half damage.',
            3: 'Quick strike; normal damage.',
            4: 'Dual strike; on hit, make a second attack with main hand at -2.',
            5: 'Off-hand feint; on hit, target\'s next attack is -1.',
            6: 'Flurry; on hit, make 2 more attacks at -2 each.',
            7: 'Masterful dual-wield; on hit, add weapon die again and make a free main-hand attack.',
            8: 'Perfect flurry; on hit, add weapon die again and make 2 free attacks at -1 each.'
        },
        'war mace': {
            1: 'Heavy swing exhausts; lose 1 AP after this attack.',
            2: 'Glancing blow; half damage.',
            3: 'Solid strike; normal damage.',
            4: 'Crushing blow; on hit, ignore light armor.',
            5: 'Armor shatter; on hit, ignore armor/hardness for this strike.',
            6: 'Concussive strike; on hit, target is dazed (loses 1 AP) or takes +3 damage.',
            7: 'Skull-crusher; on hit, target is stunned for a turn or takes +5 damage.',
            8: 'Masterful war mace; on hit, add weapon die again and target is stunned for a turn.'
        },
        unarmed: {
            1: 'Punch overextends; lose 1 AP and next attack is -1.',
            2: 'Weak strike; half damage.',
            3: 'Solid punch; normal damage.',
            4: 'Jab and step; on hit, step 1 for free.',
            5: 'Uppercut; on hit, target is staggered (speed -1).',
            6: 'Combo strike; on hit, make a second unarmed attack at -2 to hit.',
            7: 'Perfect form; on hit, add unarmed die again.',
            8: 'Masterful strike; on hit, add unarmed die again and target is knocked prone.'
        }
    };

    // Creative effects per proficiency (7) and d8 faces (1-8)
    const WEAPON_MASTERY_EFFECTS = [
        // UNTRAINED
        [
            'Fumble: {weapon} slips; spend 1 AP and your next attack roll is -1.',
            'Awkward motion strains the shoulder; your next attack roll is -1.',
            'Glancing hit; deal half damage but learn the angle: your next attack roll is +1.',
            'Off-balance; the next attack against you is +1 as you reset your stance.',
            'Find footing; gain +1 damage on your next hit.',
            'Tag a weak spot; your next attack ignores 1 point of cover/guard.',
            'Flow improves; step 1 space for free after this attack.',
            'Lucky break; roll your weapon die again and take the better result.'
        ],
        // NOVICE
        [
            'Mistimed strike; your next attack roll is -1 and you cannot shift after this attack.',
            'Follow-through; +1 damage if this attack hits.',
            'Feint opens them; next ally to attack the target gains +1 to their attack roll.',
            'Snap draw; gain +1 to this attack roll.',
            'Edge alignment; upgrade this hit to a minor wound (GM discretion) or +2 damage.',
            'Shoulder in; push the target 1 space on a hit.',
            'Hands sure; you may reroll 1 die on this attack (take the new result).',
            'Clean angle; crit range expands by 1 for this attack only.'
        ],
        // TRAINED
        [
            'Slip-up; foes gain +1 to hit you until your next turn.',
            'Tempo steal; if this hits, target suffers -1 to its next attack roll.',
            'Set your stance; next attack you make this turn costs 1 less AP (min 1).',
            'Solid contact; add +2 damage on hit.',
            'Hook or twist; displace target 1 space on hit; if impossible, +1 damage.',
            'Read footing; roll this attack twice and pick the better result.',
            'Drive-through; ignore light cover for this attack.',
            'Perfect release; on hit, roll weapon die again and add half (round down).'
        ],
        // APPRENTICE
        [
            'Stumble; this attack roll is -1 and you cannot shift this turn.',
            'Pressure; on hit, target is easier to hit by +1 until your next turn.',
            'Exploit; if you miss, gain +2 to your immediate follow-up attack roll.',
            'Shoulder roll; you gain resistance to the next 2 damage you would take.',
            'Edge bites; on hit, inflict a lingering minor bleed (or +2 damage).',
            'Trip/Pin; on hit, target takes -1 on its next attack roll.',
            'Fluid strike; you may shift the target 1 space and follow into it.',
            'Surge; if you hit, immediately make a free basic strike at -2 to the attack roll.'
        ],
        // ADEPT
        [
            'Overreach; foes gain +1 to hit you and you provoke reactions as normal.',
            'Aimed flex; choose: +3 damage or push/pull 2 spaces on hit.',
            'Guard shred; treat the target as if it has no cover this round.',
            'Anchor; foes take -2 to hit you until the target’s next turn.',
            'Soft spot; crit range expands by 1 and +2 damage on hit.',
            'Commanding blow; nearest ally gains +1 to their next attack roll this round.',
            'Relentless; if this hits, refresh 1 AP.',
            'Clinical strike; on hit, roll weapon die again and add full result.'
        ],
        // EXPERT
        [
            'Strain; lose 1 AP after this attack (minimum 0).',
            'Stagger; on hit, target’s speed -1 until end of its next turn.',
            'Exploit rhythm; add +2 to the attack roll and +2 damage on hit.',
            'Snap recover; if you miss, regain the AP spent on this attack (min 1).',
            'Line-up; you may target a second adjacent foe at -2 to the attack roll (same roll).',
            'Wrench; on hit, disarm or sunder a held item (GM discretion); else +3 damage.',
            'Pinpoint; ignore resistances/vulnerabilities; treat as normal damage.',
            'Masterful arc; on hit, add weapon die again and shift 1 space for free.'
        ],
        // MASTER
        [
            'Hubris; this attack roll is -2 as you attempt a flourish.',
            'Deadly calm; crit range expands by 2 for this attack.',
            'Debilitating hit; on hit, target takes -2 to its next action roll.',
            'Flow state; foes take -2 to hit you and you gain +2 to attack rolls until your next turn.',
            'Crushing intent; add weapon die again and apply the better result.',
            'Command the field; step 2 for free before or after this attack.',
            'Overwhelm; on hit, target is rattled (loses 1 AP next turn) or +4 damage.',
            'Signature strike; on hit, choose two: +4 damage, push/pull 2, refresh 1 AP, or silence reactions until your next turn.'
        ]
    ];

    // For Weapon Mastery we ignore damage-type prefixes entirely and replace outcomes
    // with creative, proficiency-scaled d8 results flavored per weapon.
    const filterWeaponTypeResult = (resultText, rollFace = 1) => {
        if (!resultText) return '';
        const profIndex = Math.max(0, PROFICIENCY_ORDER.indexOf(selectedProficiency));
        const clampedRoll = Math.min(8, Math.max(1, rollFace));
        const template = WEAPON_MASTERY_EFFECTS[profIndex]?.[clampedRoll - 1];
        const flavor = WEAPON_FLAVOR[selectedWeaponType] || { weapon: 'weapon', part: 'grip', verb: 'strike' };
        const flavorize = (text) =>
            text
                .replace(/{weapon}/gi, flavor.weapon)
                .replace(/{part}/gi, flavor.part)
                .replace(/{verb}/gi, flavor.verb);
        const override = WEAPON_FACE_TEXT[selectedWeaponType]?.[clampedRoll];
        const base = override ? override : flavorize(template || resultText);
        return base.trim();
    };

    const hexToRgba = (hex, alpha = 1) => {
        if (!hex || typeof hex !== 'string') {
            return `rgba(0, 0, 0, ${alpha})`;
        }
        const sanitized = hex.replace('#', '');
        const normalized = sanitized.length === 3
            ? sanitized.split('').map(part => part + part).join('')
            : sanitized;
        if (normalized.length !== 6) {
            return `rgba(0, 0, 0, ${alpha})`;
        }
        const intVal = parseInt(normalized, 16);
        if (Number.isNaN(intVal)) {
            return `rgba(0, 0, 0, ${alpha})`;
        }
        const r = (intVal >> 16) & 255;
        const g = (intVal >> 8) & 255;
        const b = intVal & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const buildWeaponRankStyles = (color) => {
        const fallback = '#c6a02d';
        const base = color || fallback;

        return {
            '--weapon-rank-color': base,
            '--weapon-rank-color-soft': hexToRgba(base, 0.16),
            '--weapon-rank-color-strong': hexToRgba(base, 0.32)
        };
    };

    const weaponRankForDisplay = SKILL_RANKS[selectedProficiency] || SKILL_RANKS.UNTRAINED;

    const renderWeaponTypeGrid = (contextKey = 'weapon-grid', { compact = false, showRankChip = true } = {}) => {
        const weaponRankStyleVars = buildWeaponRankStyles(weaponRankForDisplay.color);

        return (
            <div className={`damage-type-grid weapon-type-grid ${compact ? 'compact-grid' : ''}`}>
                {Object.entries(WEAPON_TYPE_META).map(([weaponKey, meta]) => (
                    <div
                        key={`${contextKey}-${weaponKey}`}
                        className={`damage-type-option weapon-type-option ${compact ? 'compact-option' : ''} ${selectedWeaponType === weaponKey ? 'selected' : ''}`}
                        onClick={() => setSelectedWeaponType(weaponKey)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedWeaponType(weaponKey)}
                        title={`${meta.label} — ${meta.hint}`}
                        style={weaponRankStyleVars}
                    >
                        {(showRankChip || (compact && selectedWeaponType === weaponKey)) && (
                            <span className="weapon-rank-chip">{weaponRankForDisplay.name}</span>
                        )}
                        <img
                            src={meta.icon}
                            alt={meta.label}
                            className={`damage-type-icon weapon-type-icon ${compact ? 'compact-icon' : ''}`}
                        />
                        <div className="weapon-type-name">{meta.label}</div>
                        <div className="weapon-type-hint">{meta.hint}</div>
                    </div>
                ))}
            </div>
        );
    };

    // Group skills by category
    const skillsByCategory = Object.entries(SKILL_DEFINITIONS).reduce((acc, [skillId, skillData]) => {
        const category = skillData.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ id: skillId, ...skillData });
        return acc;
    }, {});

    // Get category data
    const getCategoryData = (categoryName) => {
        return Object.values(SKILL_CATEGORIES).find(cat => cat.name === categoryName);
    };

    const handleSkillClick = (skill) => {
        setSelectedSkill(skill);
        setSelectedCategory(null);
        // Reset proficiency to UNTRAINED when selecting a new skill
        setSelectedProficiency('UNTRAINED');
    };

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setSelectedSkill(null);
    };

    const handleBackClick = () => {
        if (selectedSkill) {
            setSelectedSkill(null);
        } else if (selectedCategory) {
            setSelectedCategory(null);
        }
    };

    // Step 1: Show all categories
    if (!selectedCategory && !selectedSkill) {
        return (
            <div className="background-selector">
                <div className="skill-categories-view">
                    <div className="skill-categories-simple">
                        {Object.entries(skillsByCategory).map(([categoryName, skills]) => {
                            const categoryData = getCategoryData(categoryName);
                            return (
                                <div
                                    key={categoryName}
                                    className="skill-category-simple-card"
                                    onClick={() => handleCategoryClick(categoryName)}
                                >
                                    <div className="skill-category-simple-header">
                                        <h3>{categoryName}</h3>
                                        <span className="skill-count-badge">{skills.length} skills</span>
                                    </div>
                                    <p className="skill-category-simple-desc">
                                        {categoryData?.description || 'Skills in this category'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Show skills in selected category
    if (selectedCategory && !selectedSkill) {
        const categorySkills = skillsByCategory[selectedCategory];
        const categoryData = getCategoryData(selectedCategory);

        return (
            <div className="background-selector">
                <div className="skill-list-view">
                    <button className="back-button" onClick={handleBackClick}>
                        <i className="fas fa-arrow-left"></i> Back to Categories
                    </button>

                    <div className="category-header-compact">
                        <h2>{selectedCategory}</h2>
                        <p>{categoryData?.description || 'Skills in this category'}</p>
                    </div>

                    <div className="skills-compact-grid">
                        {categorySkills.map((skill) => (
                            <div
                                key={skill.id}
                                className="skill-compact-card"
                                onClick={() => handleSkillClick(skill)}
                            >
                                <div className="skill-compact-header">
                                    <h4>{skill.name}</h4>
                                    <div className="skill-compact-stats">
                                        <span className="stat-badge primary" title="Primary Stat">
                                            <i className="fas fa-star"></i> {skill.primaryStat?.toUpperCase() || 'N/A'}
                                        </span>
                                        {skill.secondaryStat && (
                                            <span className="stat-badge secondary" title="Secondary Stat">
                                                <i className="fas fa-plus"></i> {skill.secondaryStat.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="skill-compact-description">{skill.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Step 3: Show selected skill details
    if (selectedSkill) {
        // Get quests for this skill
        const skillQuests = (() => {
            if (selectedSkill.id !== 'weaponMastery') {
                return SKILL_QUESTS[selectedSkill.id] || [];
            }
            // Only show quests for the selected weapon type; fallback to default if none
            return WEAPON_TYPE_QUEST_DATA[selectedWeaponType] || WEAPON_TYPE_QUEST_DATA.default || [];
        })();
        const startingQuests = skillQuests.filter(q => q.rank === 'NOVICE' || q.rank === 'APPRENTICE').slice(0, 3);

        // Check if this skill has rollableTables with multiple proficiency levels
        const hasMultipleProficiencyLevels = selectedSkill.rollableTables && 
            Object.keys(selectedSkill.rollableTables).length > 0;

        // Get the rank tables for the selected proficiency level
        const rankTables = selectedSkill.rollableTables?.[selectedProficiency] || 
                          selectedSkill.rollableTables?.UNTRAINED || 
                          selectedSkill.rollableTables?.NOVICE;
        
        const isWeaponMastery = selectedSkill.id === 'weaponMastery';

        // Check if this skill uses the new multi-dimensional table structure
        const hasMultiDieTables = rankTables && typeof rankTables === 'object' && (
            rankTables.d4 || rankTables.d6 || rankTables.d8 || rankTables.d10 || rankTables.d12 || rankTables.d20
        );

        // Get rollable table for this skill
        const masteryDieKey = 'd8'; // Weapon mastery uses a fixed d8 for effects

        let rollableTableKey;
        if (hasMultiDieTables) {
            if (isWeaponMastery) {
                // Weapon mastery: always pull the d8 track (fallback to nearest available)
                rollableTableKey =
                    rankTables[masteryDieKey] ||
                    rankTables.d8 ||
                    rankTables.d6 ||
                    rankTables.d10 ||
                    rankTables.d4 ||
                    rankTables.d12 ||
                    rankTables.d20;
            } else {
                // Other skills: respect the selected difficulty die
                rollableTableKey =
                    rankTables[selectedDie] ||
                    rankTables.d8 ||
                    rankTables.d6 ||
                    rankTables.d10 ||
                    rankTables.d4 ||
                    rankTables.d12 ||
                    rankTables.d20;
            }
        } else {
            // Old structure: just use the rank table
            rollableTableKey = rankTables || selectedSkill.rollableTable;
        }
        const rollableTable = rollableTableKey ? ROLLABLE_TABLES[rollableTableKey] : null;

        return (
            <div className="background-selector">
                <button className="back-button" onClick={handleBackClick}>
                    <i className="fas fa-arrow-left"></i> Back to {selectedCategory}
                </button>

                <div className="skill-detail-view">
                    {/* Simple Clean Header */}
                    <div className="skill-simple-header">
                        <div className="skill-name-line">
                            <h2>{selectedSkill.name}</h2>
                            <span className="skill-category-label">{selectedSkill.category}</span>
                        </div>
                        <p className="skill-desc-line">{selectedSkill.description}</p>
                        <div className="skill-stats-line">
                            <span className="stat-label">
                                <i className="fas fa-star"></i> Primary: <strong>{selectedSkill.primaryStat?.toUpperCase() || 'N/A'}</strong>
                            </span>
                            {selectedSkill.secondaryStat && (
                                <span className="stat-label">
                                    <i className="fas fa-plus"></i> Secondary: <strong>{selectedSkill.secondaryStat.toUpperCase()}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Rollable Table Examples */}
                    {rollableTable && (
                        <div className="benefits-section">
                            <h4><i className="fas fa-dice-d20"></i> Example Roll Outcomes: {rollableTable.name}</h4>
                            <p style={{ marginBottom: '14px', color: '#2c1810', fontSize: '15px', fontWeight: '500', lineHeight: '1.6' }}>
                                {rollableTable.description}
                            </p>

                            {/* Color Legend for Roll Outcomes */}
                            <div className="roll-outcome-legend" style={{ 
                                marginBottom: '18px', 
                                padding: '14px 16px', 
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 245, 240, 0.7) 100%)',
                                border: '2px solid #d4af37',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <h5 style={{ 
                                    margin: '0 0 8px 0', 
                                    fontSize: '13px', 
                                    fontWeight: '700', 
                                    color: '#5a1e12',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.8px',
                                    fontFamily: "'Cinzel', serif"
                                }}>
                                    <i className="fas fa-palette" style={{ marginRight: '6px' }}></i>
                                    Roll Outcome Colors (Colorblind-Friendly)
                                </h5>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                    gap: '8px',
                                    fontSize: '13px'
                                }}>
                                    <div className="table-preview-entry total-failure" style={{ margin: 0, padding: '8px 12px', pointerEvents: 'none' }}>
                                        <span style={{ fontWeight: '600', color: '#8B0000' }}>⚠ Total Failure</span>
                                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5a1e12' }}>Catastrophic with complications</span>
                                    </div>
                                    <div className="table-preview-entry failure" style={{ margin: 0, padding: '8px 12px', pointerEvents: 'none' }}>
                                        <span style={{ fontWeight: '600', color: '#D84315' }}>✗ Failure</span>
                                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5a1e12' }}>Attempt fails</span>
                                    </div>
                                    <div className="table-preview-entry normal" style={{ margin: 0, padding: '8px 12px', pointerEvents: 'none' }}>
                                        <span style={{ fontWeight: '600', color: '#F57C00' }}>➡ Partial Success</span>
                                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5a1e12' }}>Mixed results</span>
                                    </div>
                                    <div className="table-preview-entry success" style={{ margin: 0, padding: '8px 12px', pointerEvents: 'none' }}>
                                        <span style={{ fontWeight: '600', color: '#00897B' }}>✓ Success</span>
                                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5a1e12' }}>Succeeds as intended</span>
                                    </div>
                                    <div className="table-preview-entry critical" style={{ margin: 0, padding: '8px 12px', pointerEvents: 'none' }}>
                                        <span style={{ fontWeight: '600', color: '#1976D2' }}>★ Critical Success</span>
                                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#5a1e12' }}>Exceptional with bonuses</span>
                                    </div>
                                </div>
                            </div>

                            {/* Proficiency Level Selector */}
                            {hasMultipleProficiencyLevels && (
                                <div className="proficiency-selector-section">
                                    <h4>Proficiency Level</h4>
                                    <div className="proficiency-selector-strip">
                                        {Object.entries(SKILL_RANKS).map(([rankKey, rankData]) => {
                                            const hasTablesForRank = selectedSkill.rollableTables?.[rankKey];
                                            return (
                                                <div
                                                    key={rankKey}
                                                    className={`proficiency-selector-icon ${selectedProficiency === rankKey ? 'selected' : ''} ${!hasTablesForRank ? 'disabled' : ''}`}
                                                    onClick={() => hasTablesForRank && setSelectedProficiency(rankKey)}
                                                    style={{
                                                        borderColor: rankData.color,
                                                        opacity: hasTablesForRank ? 1 : 0.4
                                                    }}
                                                    title={`${rankData.name}${!hasTablesForRank ? ' (No tables available)' : ''}`}
                                                >
                                                    <span className="proficiency-name">{rankData.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Die Selector for multi-die skills (all non-weapon mastery skills) */}
                            {hasMultiDieTables && selectedSkill.id !== 'weaponMastery' && (
                                <div className="die-selector-section">
                                    <h4>Difficulty (Die Type)</h4>
                                    <div className="die-selector-strip">
                                        {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map(die => (
                                            <div
                                                key={die}
                                                className={`die-selector-icon ${selectedDie === die ? 'selected' : ''}`}
                                                onClick={() => setSelectedDie(die)}
                                                title={`${die.toUpperCase()} - ${
                                                    die === 'd4' ? 'Very Easy' :
                                                    die === 'd6' ? 'Easy' :
                                                    die === 'd8' ? 'Moderate' :
                                                    die === 'd10' ? 'Challenging' :
                                                    die === 'd12' ? 'Difficult' :
                                                    'Very Difficult'
                                                }`}
                                            >
                                                <span className="die-number">{die.substring(1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Weapon type selector (only for Weapon Mastery; mastery die is fixed d8) */}
                            {selectedSkill.id === 'weaponMastery' && (
                                <div className="damage-type-section">
                                    <h4>Weapon Type (Mastery Die: d8)</h4>
                                    {renderWeaponTypeGrid('mastery-grid')}
                                </div>
                            )}

                            <div className="table-preview-entries">
                                        {rollableTable.table.map((entry, index) => {
                                            const rollFace = Array.isArray(entry.roll) ? entry.roll[0] : entry.roll || 1;
                                            const filteredResult = isWeaponMastery
                                                ? filterWeaponTypeResult(entry.result, rollFace)
                                                : entry.result;
                                            return (
                                                <div key={index} className={`table-preview-entry ${entry.type}`}>
                                                    <span className="roll-range">
                                                        {entry.roll[0] === entry.roll[1]
                                                            ? entry.roll[0]
                                                            : `${entry.roll[0]}-${entry.roll[1]}`}
                                                    </span>
                                                    <span className="roll-result">{filteredResult}</span>
                                                </div>
                                            );
                                        })}
                            </div>
                        </div>
                    )}

                    {/* Starting Quests */}
                    {startingQuests.length > 0 && (
                        <div className="benefits-section">
                            <h4><i className="fas fa-tasks"></i> Example Starting Quests</h4>
                            <p style={{ marginBottom: '14px', color: '#2c1810', fontSize: '15px', fontWeight: '500', lineHeight: '1.6' }}>
                                Complete quests during gameplay to unlock higher skill ranks and better outcomes!
                            </p>
                            {selectedSkill.id === 'weaponMastery' && (
                                <div className="damage-type-section" style={{ marginBottom: '14px' }}>
                                    <h4>Weapon Type (for quest progress & rolls)</h4>
                                    {renderWeaponTypeGrid('quest-grid', { compact: true, showRankChip: false })}
                                </div>
                            )}
                            <div className="quest-preview-list">
                                {startingQuests.map(quest => (
                                    <div key={quest.id} className="quest-preview-item">
                                        <img src={quest.icon} alt={quest.name} className="quest-preview-icon" />
                                        <div className="quest-preview-info">
                                            <strong>{quest.name}</strong>
                                            <p>{quest.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Usage Examples */}
                    <div className="benefits-section">
                        <h4>Common Uses</h4>
                        <ul className="equipment-items">
                            <li><i className="fas fa-check"></i> Make skill checks when attempting tasks related to this skill</li>
                            <li><i className="fas fa-check"></i> Your proficiency rank determines which rollable table outcomes are available</li>
                            <li><i className="fas fa-check"></i> Primary and secondary stats affect your ability to reduce die size with +5 modifiers</li>
                            <li><i className="fas fa-check"></i> Higher proficiency ranks unlock better outcomes on rollable tables</li>
                        </ul>
                    </div>

                    {/* How to Gain Proficiency */}
                    <div className="benefits-section">
                        <h4>Gaining Proficiency</h4>
                        <ul className="equipment-items">
                            <li><i className="fas fa-check"></i> Choose during character creation (2 skills from your class list)</li>
                            <li><i className="fas fa-check"></i> Gain from your background (automatically granted)</li>
                            <li><i className="fas fa-check"></i> Gain from your path/specialization (automatically granted)</li>
                            <li><i className="fas fa-check"></i> Gain from racial traits (some races grant specific skills)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SkillsDisplay;

