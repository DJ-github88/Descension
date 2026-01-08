// Rollable Tables for Skills - Unlocked through quest completion
// Each table provides different outcomes based on skill usage

import { LEADERSHIP_TABLES } from './socialSkillTables.js';
import { INSIGHT_TABLES } from './insightTables.js';
import { INTIMIDATION_TABLES } from './intimidationTables.js';
import { PERFORMANCE_TABLES } from './performanceTables.js';
import { SLEIGHT_OF_HAND_TABLES } from './sleightOfHandTables.js';
import { SURVIVAL_TABLES } from './survivalTables.js';
import { INVESTIGATION_TABLES } from './investigationTables.js';
import { ATHLETICS_TABLES } from './athleticsTables.js';
import { ACROBATICS_TABLES } from './acrobaticsTables.js';
import { ANIMAL_HANDLING_TABLES } from './animalHandlingTables.js';
import { NATURE_TABLES } from './natureTables.js';
import { PERCEPTION_TABLES } from './perceptionTables.js';
// Defensive Techniques removed
// Weapon Mastery tables defined inline below to match new weapon-specific flow
import { TACTICAL_COMBAT_TABLES } from './tacticalCombatTables.js';
import { ALCHEMY_TABLES } from './alchemyTables.js';
import { MEDICINE_TABLES } from './medicineTables.js';
import { STEALTH_TABLES } from './stealthTables.js';
import { ARCANE_KNOWLEDGE_TABLES } from './arcaneKnowledgeTables.js';
import { RITUAL_MAGIC_TABLES } from './ritualMagicTables.js';
import { ARCANA_TABLES } from './arcanaTables.js';
import { HISTORY_TABLES } from './historyTables.js';
import { RELIGION_TABLES } from './religionTables.js';

// Inline Weapon Mastery tables (d8 only, per proficiency) — tuned to scale cleanly per rank
const WEAPON_MASTERY_TABLES = {
    weaponmastery_untrained_d8: {
        name: 'Untrained Weapon Mastery (d8)',
        description: 'Rough strikes with big swings—could wobble, could wobble into luck.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Catastrophic slip: weapon flies from your grasp, you fall prone and lose 1 AP.', type: 'total-failure' },
            { roll: [2, 2], result: 'Bruised grip: next attack roll is -1.', type: 'failure' },
            { roll: [3, 3], result: 'Off balance: target gains +1 to hit you once.', type: 'failure' },
            { roll: [4, 4], result: 'Glancing hit: half damage.', type: 'normal' },
            { roll: [5, 5], result: 'Solid hit: normal damage.', type: 'normal' },
            { roll: [6, 6], result: 'Clean edge: +1 damage.', type: 'success' },
            { roll: [7, 7], result: 'Follow feet: +1 damage and step 1.', type: 'success' },
            { roll: [8, 8], result: 'Lucky draw: reroll the weapon die, keep the better.', type: 'success' }
        ]
    },
    weaponmastery_novice_d8: {
        name: 'Novice Weapon Mastery (d8)',
        description: 'Basic control—fewer fumbles, small payoffs.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Telegraph: this attack is -1.', type: 'failure' },
            { roll: [2, 2], result: 'Skate the edge: half damage.', type: 'failure' },
            { roll: [3, 3], result: 'Wide show: target gains +1 vs you once.', type: 'failure' },
            { roll: [4, 4], result: 'Solid swing: normal damage.', type: 'normal' },
            { roll: [5, 5], result: 'Shoulder behind it: +1 damage.', type: 'normal' },
            { roll: [6, 6], result: 'Reset grip: reroll one attack die.', type: 'success' },
            { roll: [7, 7], result: 'Make space: step 1 or give ally +1 to hit this target.', type: 'success' },
            { roll: [8, 8], result: 'Sweet line: crit range expands by 1 for this attack.', type: 'success' }
        ]
    },
    weaponmastery_trained_d8: {
        name: 'Trained Weapon Mastery (d8)',
        description: 'Reliable swings with tactical edges.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Bad beat: next defense is -1.', type: 'failure' },
            { roll: [2, 2], result: 'Overdraw: lose 1 AP after this attack.', type: 'failure' },
            { roll: [3, 3], result: 'Rooted swing: cannot step this turn.', type: 'normal' },
            { roll: [4, 4], result: 'Firm hit: +1 damage.', type: 'normal' },
            { roll: [5, 5], result: 'Hook and tug: slide target 1 on hit.', type: 'success' },
            { roll: [6, 6], result: 'Sightline: ignore light cover on this attack.', type: 'success' },
            { roll: [7, 7], result: 'Read them: roll the attack twice, keep better.', type: 'success' },
            { roll: [8, 8], result: 'Cleaving follow: on hit, roll weapon die again and add half.', type: 'success' }
        ]
    },
    weaponmastery_apprentice_d8: {
        name: 'Apprentice Weapon Mastery (d8)',
        description: 'Confident strikes that start to dictate the exchange.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Trip yourself: this attack -1 and no step.', type: 'failure' },
            { roll: [2, 2], result: 'Misdirect: half damage.', type: 'failure' },
            { roll: [3, 3], result: 'Telegraph: target gains +1 vs your next action.', type: 'failure' },
            { roll: [4, 4], result: 'Solid blow: normal damage.', type: 'normal' },
            { roll: [5, 5], result: 'Deep cut: +2 damage.', type: 'normal' },
            { roll: [6, 6], result: 'Trip or pin: target is -1 to next attack.', type: 'success' },
            { roll: [7, 7], result: 'Flow step: slide target 1 and step 1.', type: 'success' },
            { roll: [8, 8], result: 'Chain strike: on hit, free basic attack at -2.', type: 'success' }
        ]
    },
    weaponmastery_adept_d8: {
        name: 'Adept Weapon Mastery (d8)',
        description: 'Controlled aggression that shapes the field.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Overreach: foes gain +1 to hit you this round.', type: 'failure' },
            { roll: [2, 2], result: 'Set in stone: provoke reactions as normal.', type: 'failure' },
            { roll: [3, 3], result: 'Guard shred: ignore cover on this attack.', type: 'normal' },
            { roll: [4, 4], result: 'Anchor stance: foes take -2 to hit you until target’s next turn.', type: 'normal' },
            { roll: [5, 5], result: 'Soft spot: crit range +1 and +2 damage on hit.', type: 'success' },
            { roll: [6, 6], result: 'Commanding blow: nearest ally gains +1 to hit this target once.', type: 'success' },
            { roll: [7, 7], result: 'Relentless: on hit, refresh 1 AP.', type: 'success' },
            { roll: [8, 8], result: 'Clinical strike: on hit, roll weapon die again and add full.', type: 'success' }
        ]
    },
    weaponmastery_expert_d8: {
        name: 'Expert Weapon Mastery (d8)',
        description: 'Reads, punishes, and repositions with intent.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Strain: lose 1 AP after this attack.', type: 'failure' },
            { roll: [2, 2], result: 'Overstride: speed -1 until end of next turn.', type: 'failure' },
            { roll: [3, 3], result: 'Exploit: +2 to hit and +2 damage.', type: 'normal' },
            { roll: [4, 4], result: 'Snap recover: if you miss, regain the AP spent (min 1).', type: 'normal' },
            { roll: [5, 5], result: 'Line up: may target a second adjacent foe at -2.', type: 'success' },
            { roll: [6, 6], result: 'Wrench: disarm/sunder on hit; else +3 damage.', type: 'success' },
            { roll: [7, 7], result: 'Pinpoint: ignore resistances/vulnerabilities this hit.', type: 'success' },
            { roll: [8, 8], result: 'Masterful arc: on hit, add weapon die again and shift 1.', type: 'success' }
        ]
    },
    weaponmastery_master_d8: {
        name: 'Master Weapon Mastery (d8)',
        description: 'Signature blows—decisive, mobile, oppressive.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Hubris: this attack is -2.', type: 'failure' },
            { roll: [2, 2], result: 'Backfire: lose 1 AP after this attack.', type: 'failure' },
            { roll: [3, 3], result: 'Debilitate: on hit, target is -2 to next action roll.', type: 'normal' },
            { roll: [4, 4], result: 'Flow state: foes -2 to hit you; you +2 to hit until next turn.', type: 'normal' },
            { roll: [5, 5], result: 'Crushing intent: add weapon die again, keep better.', type: 'success' },
            { roll: [6, 6], result: 'Command the field: step 2 before/after this attack.', type: 'success' },
            { roll: [7, 7], result: 'Overwhelm: on hit, choose target loses 1 AP next turn or take +4 damage.', type: 'success' },
            { roll: [8, 8], result: 'Signature strike: on hit choose two: +4 damage, push/pull 2, refresh 1 AP, silence reactions vs you.', type: 'critical' }
        ]
    }
};

export const ROLLABLE_TABLES = {
    // Import all multi-dimensional skill tables
    ...LEADERSHIP_TABLES,
    ...INSIGHT_TABLES,
    ...INTIMIDATION_TABLES,
    ...PERFORMANCE_TABLES,
    ...SLEIGHT_OF_HAND_TABLES,
    ...SURVIVAL_TABLES,
    ...INVESTIGATION_TABLES,
    ...ATHLETICS_TABLES,
    ...ACROBATICS_TABLES,
    ...ANIMAL_HANDLING_TABLES,
    ...NATURE_TABLES,
    ...PERCEPTION_TABLES,
    ...WEAPON_MASTERY_TABLES,
    ...TACTICAL_COMBAT_TABLES,
    ...ALCHEMY_TABLES,
    ...MEDICINE_TABLES,
    ...STEALTH_TABLES,
    ...ARCANE_KNOWLEDGE_TABLES,
    ...RITUAL_MAGIC_TABLES,
    ...RELIGION_TABLES,
    ...ARCANA_TABLES,
    ...HISTORY_TABLES,

    // Persuasion Tables - Multi-dimensional (7 proficiency levels × 6 dice types)
    // UNTRAINED - d4 (Very Easy Task)
    persuasion_untrained_d4: {
        name: 'Untrained Persuasion (d4)',
        description: 'Untrained persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You stumble over your words, target is slightly annoyed', type: 'failure' },
            { roll: [2, 2], result: 'Your argument is clumsy but target listens', type: 'normal' },
            { roll: [3, 3], result: 'You make a decent point, target becomes friendly', type: 'success' },
            { roll: [4, 4], result: 'You express yourself clearly, target is impressed', type: 'success' }
        ]
    },
    persuasion_untrained_d6: {
        name: 'Untrained Persuasion (d6)',
        description: 'Untrained persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You offend the target with your clumsy approach', type: 'failure' },
            { roll: [3, 4], result: 'Your words come out wrong, target is skeptical', type: 'failure' },
            { roll: [5, 5], result: 'You struggle to make your point, target listens', type: 'normal' },
            { roll: [6, 6], result: 'You manage a weak argument, target becomes friendly', type: 'success' }
        ]
    },
    persuasion_untrained_d8: {
        name: 'Untrained Persuasion (d8)',
        description: 'Untrained persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You badly misread the situation, target becomes hostile', type: 'failure' },
            { roll: [3, 4], result: 'Your inexperience shows, target is offended', type: 'failure' },
            { roll: [5, 6], result: 'You fumble your words, target dismisses you', type: 'failure' },
            { roll: [7, 7], result: 'You struggle but target listens', type: 'normal' },
            { roll: [8, 8], result: 'Through luck, your point lands, target becomes friendly', type: 'success' }
        ]
    },
    persuasion_untrained_d10: {
        name: 'Untrained Persuasion (d10)',
        description: 'Untrained persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'You say exactly the wrong thing, target becomes hostile', type: 'failure' },
            { roll: [4, 6], result: 'Your clumsy words offend the target', type: 'failure' },
            { roll: [7, 8], result: 'Target sees through your inexperience, dismisses you', type: 'failure' },
            { roll: [9, 9], result: 'You struggle but target listens', type: 'normal' },
            { roll: [10, 10], result: 'Through luck, your argument lands, target becomes friendly', type: 'success' }
        ]
    },
    persuasion_untrained_d12: {
        name: 'Untrained Persuasion (d12)',
        description: 'Untrained persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You catastrophically misread the situation, target becomes hostile', type: 'total-failure' },
            { roll: [3, 4], result: 'Your words are taken as an insult, target is offended', type: 'failure' },
            { roll: [5, 6], result: 'You fumble badly, target refuses to hear more', type: 'failure' },
            { roll: [7, 8], result: 'Your inexperience shows, target becomes impatient', type: 'failure' },
            { roll: [9, 9], result: 'Target is unimpressed and annoyed', type: 'failure' },
            { roll: [10, 10], result: 'You barely avoid making things worse, target remains neutral', type: 'normal' },
            { roll: [11, 11], result: 'Through sheer luck, you make a valid point, target becomes friendly', type: 'success' },
            { roll: [12, 12], result: 'Miraculously, your words resonate, target becomes helpful', type: 'success' }
        ]
    },
    persuasion_untrained_d20: {
        name: 'Untrained Persuasion (d20)',
        description: 'Untrained persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You catastrophically insult the target, they become permanently hostile and call guards', type: 'total-failure' },
            { roll: [3, 4], result: 'You completely misunderstand the situation, target becomes hostile and refuses all future interaction', type: 'total-failure' },
            { roll: [5, 6], result: 'Your words anger the target, they refuse to negotiate and spread word of your incompetence', type: 'total-failure' },
            { roll: [7, 8], result: 'You say something deeply offensive without realizing it, target is enraged', type: 'failure' },
            { roll: [9, 10], result: 'Your argument is laughably weak, target mocks you publicly', type: 'failure' },
            { roll: [11, 12], result: 'Target sees you as completely incompetent, loses all respect', type: 'failure' },
            { roll: [13, 14], result: 'You annoy the target with your persistence, they dismiss you', type: 'failure' },
            { roll: [15, 16], result: 'Target politely but firmly dismisses you', type: 'normal' },
            { roll: [17, 17], result: 'Through sheer luck, you avoid making things worse, target remains neutral', type: 'normal' },
            { roll: [18, 18], result: 'Miraculously, you stumble onto a good argument, target becomes friendly', type: 'success' },
            { roll: [19, 19], result: 'Against all odds, your words resonate, target becomes helpful', type: 'success' },
            { roll: [20, 20], result: 'Impossibly, your words strike a perfect chord, target pledges support', type: 'critical' }
        ]
    },

    // NOVICE - d4 (Very Easy Task)
    persuasion_novice_d4: {
        name: 'Novice Persuasion (d4)',
        description: 'Novice persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You make a good point, target becomes friendly', type: 'success' },
            { roll: [3, 3], result: 'Your words resonate, target becomes helpful', type: 'success' },
            { roll: [4, 4], result: 'Target is impressed, offers minor assistance', type: 'success' }
        ]
    },
    persuasion_novice_d6: {
        name: 'Novice Persuasion (d6)',
        description: 'Novice persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the approach, target is annoyed', type: 'failure' },
            { roll: [2, 2], result: 'Your argument is weak, target is skeptical', type: 'failure' },
            { roll: [3, 3], result: 'Target is unmoved by your words', type: 'normal' },
            { roll: [4, 4], result: 'You make a decent case, target considers it', type: 'normal' },
            { roll: [5, 5], result: 'Your reasoning is sound, target becomes friendly', type: 'success' },
            { roll: [6, 6], result: 'Target is convinced, becomes helpful', type: 'success' }
        ]
    },
    persuasion_novice_d8: {
        name: 'Novice Persuasion (d8)',
        description: 'Novice persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You accidentally offend the target, they become hostile', type: 'failure' },
            { roll: [2, 2], result: 'Your words backfire, target becomes defensive', type: 'failure' },
            { roll: [3, 3], result: 'Target finds your argument unconvincing', type: 'failure' },
            { roll: [4, 4], result: 'You fail to make an impression', type: 'normal' },
            { roll: [5, 5], result: 'Target listens with mild interest', type: 'normal' },
            { roll: [6, 6], result: 'You make a valid point, target becomes friendly', type: 'success' },
            { roll: [7, 7], result: 'Your argument is persuasive, target becomes helpful', type: 'success' },
            { roll: [8, 8], result: 'Target is swayed by your words, offers assistance', type: 'success' }
        ]
    },
    persuasion_novice_d10: {
        name: 'Novice Persuasion (d10)',
        description: 'Novice persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread the situation badly, target becomes hostile', type: 'failure' },
            { roll: [2, 3], result: 'Your approach is too aggressive, target is offended', type: 'failure' },
            { roll: [4, 5], result: 'You fail to connect with the target', type: 'failure' },
            { roll: [6, 6], result: 'Target is unimpressed', type: 'normal' },
            { roll: [7, 7], result: 'You make a reasonable argument', type: 'normal' },
            { roll: [8, 8], result: 'Target finds your words convincing, becomes friendly', type: 'success' },
            { roll: [9, 9], result: 'Your reasoning is solid, target becomes helpful', type: 'success' },
            { roll: [10, 10], result: 'Target is persuaded, offers to assist you', type: 'success' }
        ]
    },
    persuasion_novice_d12: {
        name: 'Novice Persuasion (d12)',
        description: 'Novice persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You say the wrong thing, target becomes hostile', type: 'failure' },
            { roll: [3, 4], result: 'Your argument falls apart, target is annoyed', type: 'failure' },
            { roll: [5, 6], result: 'Target sees through your inexperience', type: 'failure' },
            { roll: [7, 8], result: 'You fail to make a compelling case', type: 'normal' },
            { roll: [9, 9], result: 'Target considers your words', type: 'normal' },
            { roll: [10, 10], result: 'You make a decent argument, target becomes friendly', type: 'success' },
            { roll: [11, 11], result: 'Your words are persuasive, target becomes helpful', type: 'success' },
            { roll: [12, 12], result: 'Target is convinced by your reasoning', type: 'success' }
        ]
    },
    persuasion_novice_d20: {
        name: 'Novice Persuasion (d20)',
        description: 'Novice persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You completely misjudge the approach, target becomes hostile and spreads negative word', type: 'total-failure' },
            { roll: [3, 4], result: 'Your words deeply offend the target, they refuse all future interaction', type: 'total-failure' },
            { roll: [5, 6], result: 'You fail catastrophically to make any headway, target mocks you publicly', type: 'failure' },
            { roll: [7, 8], result: 'Target is completely unmoved by your argument', type: 'failure' },
            { roll: [9, 10], result: 'You struggle badly to find the right words', type: 'failure' },
            { roll: [11, 12], result: 'Target listens but remains deeply skeptical', type: 'normal' },
            { roll: [13, 14], result: 'You make a valid point, target becomes friendly', type: 'normal' },
            { roll: [15, 16], result: 'Your argument is convincing, target becomes helpful', type: 'success' },
            { roll: [17, 18], result: 'You persuade effectively, target offers assistance', type: 'success' },
            { roll: [19, 19], result: 'Against the odds, you persuade the target completely', type: 'success' },
            { roll: [20, 20], result: 'Masterful persuasion, target pledges support', type: 'critical' }
        ]
    },

    // TRAINED - d4 (Very Easy Task)
    persuasion_trained_d4: {
        name: 'Trained Persuasion (d4)',
        description: 'Trained persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Small misstep, attempt fails', type: 'failure' },
            { roll: [2, 2], result: 'You expertly address their concerns, target becomes helpful', type: 'success' },
            { roll: [3, 3], result: 'Your words inspire trust, target becomes devoted ally', type: 'critical' },
            { roll: [4, 4], result: 'Target is thoroughly convinced, offers significant aid', type: 'critical' }
        ]
    },
    persuasion_trained_d6: {
        name: 'Trained Persuasion (d6)',
        description: 'Trained persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You make a good case, target becomes friendly', type: 'success' },
            { roll: [3, 3], result: 'Your reasoning is sound, target becomes helpful', type: 'success' },
            { roll: [4, 4], result: 'Target is impressed by your argument', type: 'success' },
            { roll: [5, 5], result: 'You skillfully persuade them, target becomes devoted ally', type: 'success' },
            { roll: [6, 6], result: 'Your words resonate deeply, target offers assistance', type: 'critical' }
        ]
    },
    persuasion_trained_d8: {
        name: 'Trained Persuasion (d8)',
        description: 'Trained persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misjudge their position, target is skeptical', type: 'failure' },
            { roll: [2, 2], result: 'Your approach is slightly off, target is wary', type: 'failure' },
            { roll: [3, 3], result: 'You make a decent argument, target becomes friendly', type: 'normal' },
            { roll: [4, 4], result: 'Your training shows, target is receptive', type: 'normal' },
            { roll: [5, 5], result: 'You present a compelling case, target becomes helpful', type: 'success' },
            { roll: [6, 6], result: 'Your words are persuasive, target is convinced', type: 'success' },
            { roll: [7, 7], result: 'Target is swayed by your expertise, becomes devoted ally', type: 'success' },
            { roll: [8, 8], result: 'You masterfully address all concerns, target offers aid', type: 'critical' }
        ]
    },
    persuasion_trained_d10: {
        name: 'Trained Persuasion (d10)',
        description: 'Trained persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misread their motivations, target is skeptical', type: 'failure' },
            { roll: [2, 2], result: 'Your argument has a flaw they notice', type: 'failure' },
            { roll: [3, 3], result: 'Target is unconvinced but not hostile', type: 'failure' },
            { roll: [4, 4], result: 'You make some progress, target becomes friendly', type: 'normal' },
            { roll: [5, 5], result: 'Your training helps you find common ground', type: 'normal' },
            { roll: [6, 7], result: 'You present a strong case, target becomes helpful', type: 'success' },
            { roll: [8, 8], result: 'Your expertise shines through, target is convinced', type: 'success' },
            { roll: [9, 9], result: 'Target is impressed, becomes devoted ally', type: 'success' },
            { roll: [10, 10], result: 'You skillfully address all objections, target offers aid', type: 'critical' }
        ]
    },
    persuasion_trained_d12: {
        name: 'Trained Persuasion (d12)',
        description: 'Trained persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You fail to connect, target is skeptical', type: 'failure' },
            { roll: [3, 4], result: 'Your approach is too direct, target is wary', type: 'failure' },
            { roll: [5, 6], result: 'You make a reasonable case, target becomes friendly', type: 'normal' },
            { roll: [7, 7], result: 'Your training helps you navigate the conversation', type: 'normal' },
            { roll: [8, 9], result: 'You present compelling arguments, target becomes helpful', type: 'success' },
            { roll: [10, 10], result: 'Target is persuaded by your reasoning', type: 'success' },
            { roll: [11, 11], result: 'Your expertise wins them over, target becomes devoted ally', type: 'success' },
            { roll: [12, 12], result: 'You masterfully convince them, target offers significant aid', type: 'critical' }
        ]
    },
    persuasion_trained_d20: {
        name: 'Trained Persuasion (d20)',
        description: 'Trained persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You struggle to find the right approach, target is skeptical', type: 'failure' },
            { roll: [4, 6], result: 'Your argument is insufficient for this challenge', type: 'failure' },
            { roll: [7, 7], result: 'You barely make any headway', type: 'failure' },
            { roll: [8, 9], result: 'You make some progress, target becomes friendly', type: 'normal' },
            { roll: [10, 11], result: 'Your training helps you navigate the difficulty', type: 'normal' },
            { roll: [12, 14], result: 'You present a solid case, target becomes helpful', type: 'success' },
            { roll: [15, 16], result: 'Your expertise shows, target is convinced', type: 'success' },
            { roll: [17, 18], result: 'You skillfully persuade them, target becomes devoted ally', type: 'success' },
            { roll: [19, 19], result: 'Target is thoroughly convinced, becomes loyal follower', type: 'critical' },
            { roll: [20, 20], result: 'You masterfully overcome all obstacles, target is inspired', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 (Very Easy Task)
    persuasion_apprentice_d4: {
        name: 'Apprentice Persuasion (d4)',
        description: 'Apprentice persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Small misstep, attempt fails', type: 'failure' },
            { roll: [2, 2], result: 'You expertly build rapport, target becomes devoted ally', type: 'success' },
            { roll: [3, 3], result: 'Your mastery is evident, target becomes loyal follower', type: 'critical' },
            { roll: [4, 4], result: 'Target is deeply moved, pledges unwavering support', type: 'critical' }
        ]
    },
    persuasion_apprentice_d6: {
        name: 'Apprentice Persuasion (d6)',
        description: 'Apprentice persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your skill is apparent, target becomes helpful', type: 'success' },
            { roll: [3, 3], result: 'You build strong trust, target becomes devoted ally', type: 'success' },
            { roll: [4, 4], result: 'Target is thoroughly convinced', type: 'success' },
            { roll: [5, 5], result: 'Your expertise shines, target becomes loyal follower', type: 'critical' },
            { roll: [6, 6], result: 'Target is inspired by your words, offers full support', type: 'critical' }
        ]
    },
    persuasion_apprentice_d8: {
        name: 'Apprentice Persuasion (d8)',
        description: 'Apprentice persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Target remains neutral despite your skill', type: 'failure' },
            { roll: [2, 2], result: 'You make headway, target becomes friendly', type: 'normal' },
            { roll: [3, 3], result: 'Your approach is effective, target warms to you', type: 'normal' },
            { roll: [4, 4], result: 'You present a strong case, target becomes helpful', type: 'success' },
            { roll: [5, 5], result: 'Your skill is evident, target is convinced', type: 'success' },
            { roll: [6, 6], result: 'You build deep trust, target becomes devoted ally', type: 'success' },
            { roll: [7, 7], result: 'Target is thoroughly persuaded, becomes loyal follower', type: 'critical' },
            { roll: [8, 8], result: 'Your mastery wins them completely, target pledges support', type: 'critical' }
        ]
    },
    persuasion_apprentice_d10: {
        name: 'Apprentice Persuasion (d10)',
        description: 'Apprentice persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Even your skill cannot overcome this obstacle', type: 'failure' },
            { roll: [2, 2], result: 'You struggle to find the right approach', type: 'failure' },
            { roll: [3, 3], result: 'You make some progress, target becomes friendly', type: 'normal' },
            { roll: [4, 4], result: 'Your training helps you navigate the challenge', type: 'normal' },
            { roll: [5, 6], result: 'You present compelling arguments, target becomes helpful', type: 'success' },
            { roll: [7, 8], result: 'Your expertise is convincing, target is swayed', type: 'success' },
            { roll: [9, 9], result: 'You skillfully win them over, target becomes devoted ally', type: 'success' },
            { roll: [10, 10], result: 'Your mastery overcomes the difficulty, target becomes loyal follower', type: 'critical' }
        ]
    },
    persuasion_apprentice_d12: {
        name: 'Apprentice Persuasion (d12)',
        description: 'Apprentice persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'The challenge is too great, target remains neutral', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your training', type: 'failure' },
            { roll: [4, 5], result: 'You make gradual progress, target becomes friendly', type: 'normal' },
            { roll: [6, 7], result: 'Your skill helps you advance, target becomes helpful', type: 'success' },
            { roll: [8, 9], result: 'You present a strong case, target is convinced', type: 'success' },
            { roll: [10, 11], result: 'Your expertise shines through, target becomes devoted ally', type: 'success' },
            { roll: [12, 12], result: 'You masterfully overcome all obstacles, target becomes loyal follower', type: 'critical' }
        ]
    },
    persuasion_apprentice_d20: {
        name: 'Apprentice Persuasion (d20)',
        description: 'Apprentice persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'The task is beyond your current ability', type: 'failure' },
            { roll: [4, 5], result: 'You struggle to make any headway', type: 'failure' },
            { roll: [6, 8], result: 'You make minimal progress, target becomes friendly', type: 'normal' },
            { roll: [9, 10], result: 'Your training helps you persevere', type: 'normal' },
            { roll: [11, 13], result: 'You present solid arguments, target becomes helpful', type: 'success' },
            { roll: [14, 16], result: 'Your skill is evident, target is persuaded', type: 'success' },
            { roll: [17, 18], result: 'You expertly navigate the difficulty, target becomes devoted ally', type: 'success' },
            { roll: [19, 19], result: 'Your mastery overcomes the challenge, target becomes loyal follower', type: 'critical' },
            { roll: [20, 20], result: 'Against all odds, you achieve a breakthrough, target pledges full support', type: 'critical' }
        ]
    },

    // ADEPT - d4 (Very Easy Task)
    persuasion_adept_d4: {
        name: 'Adept Persuasion (d4)',
        description: 'Adept persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Small misstep, attempt fails', type: 'failure' },
            { roll: [2, 2], result: 'You effortlessly build deep trust, target becomes loyal follower', type: 'critical' },
            { roll: [3, 3], result: 'Target is thoroughly convinced, offers significant aid', type: 'critical' },
            { roll: [4, 4], result: 'Your mastery inspires them, target pledges resources and support', type: 'critical' }
        ]
    },
    persuasion_adept_d6: {
        name: 'Adept Persuasion (d6)',
        description: 'Adept persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your expertise is clear, target becomes devoted ally', type: 'success' },
            { roll: [3, 3], result: 'You build profound trust, target becomes loyal follower', type: 'success' },
            { roll: [4, 4], result: 'Target is deeply persuaded, offers significant aid', type: 'success' },
            { roll: [5, 5], result: 'Your mastery shines, target commits fully to your cause', type: 'critical' },
            { roll: [6, 6], result: 'Target is inspired, brings their allies to support you', type: 'critical' }
        ]
    },
    persuasion_adept_d8: {
        name: 'Adept Persuasion (d8)',
        description: 'Adept persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Target is friendly but not fully convinced', type: 'failure' },
            { roll: [2, 2], result: 'You make good headway, target becomes helpful', type: 'normal' },
            { roll: [3, 3], result: 'Your skill is evident, target warms considerably', type: 'normal' },
            { roll: [4, 4], result: 'You present masterful arguments, target becomes devoted ally', type: 'success' },
            { roll: [5, 5], result: 'Your expertise convinces them, target becomes loyal follower', type: 'success' },
            { roll: [6, 6], result: 'Target is thoroughly persuaded, offers significant aid', type: 'success' },
            { roll: [7, 7], result: 'Your mastery overcomes all doubts, target commits fully', type: 'critical' },
            { roll: [8, 8], result: 'Target is inspired by your words, brings allies to your cause', type: 'critical' }
        ]
    },
    persuasion_adept_d10: {
        name: 'Adept Persuasion (d10)',
        description: 'Adept persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The challenge tests even your skill, target is friendly but uncommitted', type: 'failure' },
            { roll: [2, 2], result: 'You make progress but not a breakthrough', type: 'failure' },
            { roll: [3, 3], result: 'Your expertise helps you advance, target becomes helpful', type: 'normal' },
            { roll: [4, 4], result: 'You navigate the difficulty well', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery shows, target becomes devoted ally', type: 'success' },
            { roll: [7, 8], result: 'You expertly overcome obstacles, target becomes loyal follower', type: 'success' },
            { roll: [9, 9], result: 'Target is thoroughly convinced, offers significant aid', type: 'success' },
            { roll: [10, 10], result: 'Your skill triumphs, target brings allies to your cause', type: 'critical' }
        ]
    },
    persuasion_adept_d12: {
        name: 'Adept Persuasion (d12)',
        description: 'Adept persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'The difficulty is substantial, target is friendly but hesitant', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your mastery', type: 'failure' },
            { roll: [4, 5], result: 'Your expertise helps you make headway, target becomes helpful', type: 'normal' },
            { roll: [6, 7], result: 'You skillfully navigate the challenge, target becomes devoted ally', type: 'success' },
            { roll: [8, 9], result: 'Your mastery overcomes the difficulty, target becomes loyal follower', type: 'success' },
            { roll: [10, 11], result: 'Target is thoroughly persuaded, offers significant aid', type: 'success' },
            { roll: [12, 12], result: 'You achieve a masterful victory, target brings allies to support you', type: 'critical' }
        ]
    },
    persuasion_adept_d20: {
        name: 'Adept Persuasion (d20)',
        description: 'Adept persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles with this challenge', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress despite your skill', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance slowly, target becomes helpful', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your mastery', type: 'normal' },
            { roll: [11, 13], result: 'Your skill overcomes obstacles, target becomes devoted ally', type: 'success' },
            { roll: [14, 16], result: 'You expertly navigate the difficulty, target becomes loyal follower', type: 'success' },
            { roll: [17, 18], result: 'Your mastery triumphs, target offers significant aid', type: 'success' },
            { roll: [19, 19], result: 'You achieve a remarkable victory, target brings allies to your cause', type: 'critical' },
            { roll: [20, 20], result: 'Your legendary skill overcomes all odds, target becomes your champion', type: 'critical' }
        ]
    },

    // EXPERT - d4 (Very Easy Task)
    persuasion_expert_d4: {
        name: 'Expert Persuasion (d4)',
        description: 'Expert persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor mistake, brief setback', type: 'failure' },
            { roll: [2, 2], result: 'You inspire complete trust, target offers significant aid', type: 'critical' },
            { roll: [3, 3], result: 'Target is moved to action, converts their allies to your cause', type: 'critical' },
            { roll: [4, 4], result: 'Your mastery creates a devoted champion, target pledges everything', type: 'critical' }
        ]
    },
    persuasion_expert_d6: {
        name: 'Expert Persuasion (d6)',
        description: 'Expert persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'Your expertise creates deep loyalty, target becomes loyal follower', type: 'success' },
            { roll: [3, 3], result: 'Target is thoroughly convinced, offers significant aid', type: 'success' },
            { roll: [4, 4], result: 'You inspire them completely, target brings allies to your cause', type: 'success' },
            { roll: [5, 5], result: 'Your legendary skill creates a champion, target pledges resources', type: 'critical' },
            { roll: [6, 6], result: 'Target is transformed by your words, becomes your devoted advocate', type: 'critical' }
        ]
    },
    persuasion_expert_d8: {
        name: 'Expert Persuasion (d8)',
        description: 'Expert persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Target is helpful but not fully committed', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, target becomes devoted ally', type: 'normal' },
            { roll: [3, 3], result: 'Your expertise is undeniable, target is impressed', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate the challenge, target becomes loyal follower', type: 'success' },
            { roll: [5, 5], result: 'Your mastery overcomes all doubts, target offers significant aid', type: 'success' },
            { roll: [6, 6], result: 'Target is thoroughly persuaded, brings allies to your cause', type: 'success' },
            { roll: [7, 7], result: 'Your legendary skill inspires them, target becomes your champion', type: 'critical' },
            { roll: [8, 8], result: 'You achieve a masterwork of persuasion, target pledges everything', type: 'critical' }
        ]
    },
    persuasion_expert_d10: {
        name: 'Expert Persuasion (d10)',
        description: 'Expert persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, target is helpful but uncommitted', type: 'failure' },
            { roll: [2, 2], result: 'You make good progress with your expertise', type: 'failure' },
            { roll: [3, 3], result: 'Your legendary skill helps you advance, target becomes devoted ally', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate the difficulty', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery overcomes obstacles, target becomes loyal follower', type: 'success' },
            { roll: [7, 8], result: 'You skillfully persuade them, target offers significant aid', type: 'success' },
            { roll: [9, 9], result: 'Target is thoroughly convinced, brings allies to your cause', type: 'success' },
            { roll: [10, 10], result: 'Your legendary expertise triumphs, target becomes your champion', type: 'critical' }
        ]
    },
    persuasion_expert_d12: {
        name: 'Expert Persuasion (d12)',
        description: 'Expert persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'The difficulty is substantial, target is helpful but hesitant', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your legendary skill', type: 'failure' },
            { roll: [4, 5], result: 'Your expertise helps you make headway, target becomes devoted ally', type: 'normal' },
            { roll: [6, 7], result: 'You masterfully navigate the challenge, target becomes loyal follower', type: 'success' },
            { roll: [8, 9], result: 'Your legendary skill overcomes the difficulty, target offers significant aid', type: 'success' },
            { roll: [10, 11], result: 'Target is thoroughly persuaded, brings allies to your cause', type: 'success' },
            { roll: [12, 12], result: 'You achieve a legendary victory, target becomes your devoted champion', type: 'critical' }
        ]
    },
    persuasion_expert_d20: {
        name: 'Expert Persuasion (d20)',
        description: 'Expert persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary skill is tested by this challenge', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress despite your mastery', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance, target becomes devoted ally', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your legendary skill', type: 'normal' },
            { roll: [11, 13], result: 'Your mastery overcomes obstacles, target becomes loyal follower', type: 'success' },
            { roll: [14, 16], result: 'You expertly navigate the difficulty, target offers significant aid', type: 'success' },
            { roll: [17, 18], result: 'Your legendary skill triumphs, target brings allies to your cause', type: 'success' },
            { roll: [19, 19], result: 'You achieve a remarkable victory, target becomes your champion', type: 'critical' },
            { roll: [20, 20], result: 'Your mastery creates a miracle, target pledges everything and inspires others', type: 'critical' }
        ]
    },

    // MASTER - d4 (Very Easy Task)
    persuasion_master_d4: {
        name: 'Master Persuasion (d4)',
        description: 'Master persuasion on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Minor failure, brief complication', type: 'failure' },
            { roll: [2, 2], result: 'You inspire a movement, target converts their allies to your cause', type: 'critical' },
            { roll: [3, 3], result: 'Target abandons all previous loyalties, pledges to your vision', type: 'critical' },
            { roll: [4, 4], result: 'Your words create a devoted disciple, target becomes your prophet', type: 'critical' }
        ]
    },
    persuasion_master_d6: {
        name: 'Master Persuasion (d6)',
        description: 'Master persuasion on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'Your mastery is absolute, target offers significant aid', type: 'success' },
            { roll: [3, 3], result: 'You inspire them completely, target converts their allies to your cause', type: 'success' },
            { roll: [4, 4], result: 'Target abandons previous loyalties for your vision', type: 'success' },
            { roll: [5, 5], result: 'Your legendary words create a champion, target becomes your devoted advocate', type: 'critical' },
            { roll: [6, 6], result: 'You inspire a transformation, target spreads your message to others', type: 'critical' }
        ]
    },
    persuasion_master_d8: {
        name: 'Master Persuasion (d8)',
        description: 'Master persuasion on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Target is devoted and grants a major favor', type: 'failure' },
            { roll: [2, 2], result: 'You create deep loyalty, target becomes loyal follower', type: 'normal' },
            { roll: [3, 3], result: 'Your unparalleled skill is evident, target is moved', type: 'normal' },
            { roll: [4, 4], result: 'You masterfully persuade them, target offers significant aid', type: 'success' },
            { roll: [5, 5], result: 'Your legendary expertise inspires action, target converts their allies', type: 'success' },
            { roll: [6, 6], result: 'Target abandons previous loyalties for your cause', type: 'success' },
            { roll: [7, 7], result: 'You create a devoted champion, target becomes your advocate', type: 'critical' },
            { roll: [8, 8], result: 'Your words inspire a movement, target spreads your message', type: 'critical' }
        ]
    },
    persuasion_master_d10: {
        name: 'Master Persuasion (d10)',
        description: 'Master persuasion on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, target is devoted and grants a major favor', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress with your mastery', type: 'failure' },
            { roll: [3, 3], result: 'Your unparalleled skill helps you advance, target becomes loyal follower', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate the difficulty', type: 'normal' },
            { roll: [5, 6], result: 'Your legendary mastery overcomes obstacles, target offers significant aid', type: 'success' },
            { roll: [7, 8], result: 'You inspire them completely, target converts their allies to your cause', type: 'success' },
            { roll: [9, 9], result: 'Target abandons previous loyalties for your vision', type: 'success' },
            { roll: [10, 10], result: 'Your unparalleled expertise creates a devoted champion', type: 'critical' }
        ]
    },
    persuasion_master_d12: {
        name: 'Master Persuasion (d12)',
        description: 'Master persuasion on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'The difficulty is substantial, target is devoted and grants a major favor', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your legendary mastery', type: 'failure' },
            { roll: [4, 5], result: 'Your unparalleled skill helps you make headway, target becomes loyal follower', type: 'normal' },
            { roll: [6, 7], result: 'You masterfully navigate the challenge, target offers significant aid', type: 'success' },
            { roll: [8, 9], result: 'Your legendary expertise overcomes the difficulty, target converts their allies', type: 'success' },
            { roll: [10, 11], result: 'Target abandons previous loyalties for your cause', type: 'success' },
            { roll: [12, 12], result: 'You achieve a legendary victory, target becomes your devoted prophet', type: 'critical' }
        ]
    },
    persuasion_master_d20: {
        name: 'Master Persuasion (d20)',
        description: 'Master persuasion on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, target is devoted and grants a major favor', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress despite your unparalleled skill', type: 'failure' },
            { roll: [6, 8], result: 'Your legendary expertise helps you advance, target becomes loyal follower', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your unparalleled mastery', type: 'normal' },
            { roll: [11, 13], result: 'Your legendary skill overcomes obstacles, target offers significant aid', type: 'success' },
            { roll: [14, 16], result: 'You expertly navigate the difficulty, target converts their allies to your cause', type: 'success' },
            { roll: [17, 18], result: 'Your mastery triumphs, target abandons previous loyalties for your vision', type: 'success' },
            { roll: [19, 19], result: 'You achieve a miraculous victory, target becomes your devoted champion', type: 'critical' },
            { roll: [20, 20], result: 'Your legendary words create a movement, target becomes your prophet and inspires others', type: 'critical' }
        ]
    },

    // Deception Tables - Multi-dimensional (7 proficiency levels × 6 dice types)
    // UNTRAINED - d4 (Very Easy Task)
    deception_untrained_d4: {
        name: 'Untrained Deception (d4)',
        description: 'Untrained deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your lie is clumsy, target is mildly suspicious', type: 'failure' },
            { roll: [2, 2], result: 'Your deception is transparent but target is uncertain', type: 'normal' },
            { roll: [3, 3], result: 'You manage a believable lie, target believes you', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you deceive them, target trusts you', type: 'success' }
        ]
    },
    deception_untrained_d6: {
        name: 'Untrained Deception (d6)',
        description: 'Untrained deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your lie is obvious, target becomes suspicious', type: 'failure' },
            { roll: [2, 2], result: 'You contradict yourself, target doubts you', type: 'failure' },
            { roll: [3, 3], result: 'Your story is weak but target is uncertain', type: 'normal' },
            { roll: [4, 4], result: 'Target is unconvinced but willing to listen', type: 'normal' },
            { roll: [5, 5], result: 'You manage a passable lie, target believes you', type: 'success' },
            { roll: [6, 6], result: 'Despite inexperience, your deception works, target trusts you', type: 'success' }
        ]
    },
    deception_untrained_d8: {
        name: 'Untrained Deception (d8)',
        description: 'Untrained deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You badly misread the situation, target catches your lie', type: 'failure' },
            { roll: [2, 2], result: 'Your inexperience shows, target is offended by the attempt', type: 'failure' },
            { roll: [3, 3], result: 'You fumble your words, target is suspicious', type: 'failure' },
            { roll: [4, 4], result: 'Your lie is transparent, target dismisses you', type: 'failure' },
            { roll: [5, 5], result: 'You struggle but target remains uncertain', type: 'normal' },
            { roll: [6, 6], result: 'Target is unconvinced but listens', type: 'normal' },
            { roll: [7, 7], result: 'You manage a basic deception, target believes you', type: 'success' },
            { roll: [8, 8], result: 'Through luck, your lie is believed, target trusts you', type: 'success' }
        ]
    },
    deception_untrained_d10: {
        name: 'Untrained Deception (d10)',
        description: 'Untrained deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You say exactly the wrong thing, target catches you in the lie', type: 'failure' },
            { roll: [2, 3], result: 'Your clumsy deception offends the target', type: 'failure' },
            { roll: [4, 5], result: 'Target sees through your inexperience, is suspicious', type: 'failure' },
            { roll: [6, 6], result: 'You ramble unconvincingly, target loses patience', type: 'failure' },
            { roll: [7, 7], result: 'Your lie is poorly constructed but target listens', type: 'normal' },
            { roll: [8, 8], result: 'You manage to avoid disaster, target remains uncertain', type: 'normal' },
            { roll: [9, 9], result: 'Through luck, your deception lands, target is fooled', type: 'success' },
            { roll: [10, 10], result: 'Against the odds, you deceive them, target trusts you', type: 'success' }
        ]
    },
    deception_untrained_d12: {
        name: 'Untrained Deception (d12)',
        description: 'Untrained deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You catastrophically misread the situation, target catches you', type: 'total-failure' },
            { roll: [3, 4], result: 'Your words are taken as an insult, target is offended', type: 'failure' },
            { roll: [5, 6], result: 'You fumble badly, target refuses to believe you', type: 'failure' },
            { roll: [7, 8], result: 'Your inexperience shows, target becomes impatient', type: 'failure' },
            { roll: [9, 9], result: 'Target is unimpressed and suspicious', type: 'failure' },
            { roll: [10, 10], result: 'You barely avoid making things worse, target remains uncertain', type: 'normal' },
            { roll: [11, 11], result: 'Through sheer luck, your lie works, target is fooled', type: 'success' },
            { roll: [12, 12], result: 'Miraculously, your deception succeeds, target trusts you', type: 'success' }
        ]
    },
    deception_untrained_d20: {
        name: 'Untrained Deception (d20)',
        description: 'Untrained deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You catastrophically misread the situation, target catches you immediately and exposes your deception publicly, you are marked as a liar', type: 'total-failure' },
            { roll: [2, 3], result: 'You completely fail to deceive, target sees through everything and becomes permanently hostile', type: 'total-failure' },
            { roll: [4, 5], result: 'Your words anger the target deeply, they refuse to listen and call guards', type: 'total-failure' },
            { roll: [6, 7], result: 'You say something deeply offensive without realizing it, target is enraged', type: 'failure' },
            { roll: [8, 9], result: 'Your lie is laughably transparent, target mocks you publicly', type: 'failure' },
            { roll: [10, 11], result: 'Target sees you as completely incompetent, loses all respect', type: 'failure' },
            { roll: [12, 13], result: 'You annoy the target with your poor attempt, they dismiss you', type: 'failure' },
            { roll: [14, 15], result: 'Target politely but firmly dismisses your lie', type: 'normal' },
            { roll: [16, 17], result: 'Through sheer luck, you avoid making things worse, target remains uncertain', type: 'normal' },
            { roll: [18, 18], result: 'Miraculously, you stumble onto a believable lie, target is fooled', type: 'success' },
            { roll: [19, 19], result: 'Against all odds, your deception works, target trusts you', type: 'success' },
            { roll: [20, 20], result: 'Impossibly, your deception succeeds perfectly, target trusts you completely', type: 'critical' }
        ]
    },

    // NOVICE - d4 (Very Easy Task)
    deception_novice_d4: {
        name: 'Novice Deception (d4)',
        description: 'Novice deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You tell a convincing lie, target is fooled', type: 'success' },
            { roll: [3, 3], result: 'Your deception works well, target trusts you', type: 'success' },
            { roll: [4, 4], result: 'Target is impressed, believes you completely', type: 'success' }
        ]
    },
    deception_novice_d6: {
        name: 'Novice Deception (d6)',
        description: 'Novice deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the approach, target is suspicious', type: 'failure' },
            { roll: [2, 2], result: 'Your lie is weak, target is skeptical', type: 'failure' },
            { roll: [3, 3], result: 'Target is unmoved by your deception', type: 'normal' },
            { roll: [4, 4], result: 'You make a decent attempt, target considers it', type: 'normal' },
            { roll: [5, 5], result: 'Your lie is believable, target is fooled', type: 'success' },
            { roll: [6, 6], result: 'Target is convinced, trusts you', type: 'success' }
        ]
    },
    deception_novice_d8: {
        name: 'Novice Deception (d8)',
        description: 'Novice deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You accidentally reveal the truth, target catches you', type: 'failure' },
            { roll: [2, 2], result: 'Your words backfire, target becomes defensive', type: 'failure' },
            { roll: [3, 3], result: 'Target finds your lie unconvincing', type: 'failure' },
            { roll: [4, 4], result: 'You fail to make an impression', type: 'normal' },
            { roll: [5, 5], result: 'Target listens with mild interest', type: 'normal' },
            { roll: [6, 6], result: 'You tell a valid lie, target is fooled', type: 'success' },
            { roll: [7, 7], result: 'Your deception is persuasive, target trusts you', type: 'success' },
            { roll: [8, 8], result: 'Target is swayed by your lie, believes you completely', type: 'success' }
        ]
    },
    deception_novice_d10: {
        name: 'Novice Deception (d10)',
        description: 'Novice deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misread the situation badly, target catches you', type: 'failure' },
            { roll: [2, 3], result: 'Your approach is too obvious, target is offended', type: 'failure' },
            { roll: [4, 5], result: 'You fail to connect with the target', type: 'failure' },
            { roll: [6, 6], result: 'Target is unimpressed', type: 'normal' },
            { roll: [7, 7], result: 'You make a reasonable attempt', type: 'normal' },
            { roll: [8, 8], result: 'Target finds your lie convincing, is fooled', type: 'success' },
            { roll: [9, 9], result: 'Your deception is solid, target trusts you', type: 'success' },
            { roll: [10, 10], result: 'Target is deceived, believes you completely', type: 'success' }
        ]
    },
    deception_novice_d12: {
        name: 'Novice Deception (d12)',
        description: 'Novice deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You say the wrong thing, target catches you', type: 'failure' },
            { roll: [3, 4], result: 'Your lie falls apart, target is suspicious', type: 'failure' },
            { roll: [5, 6], result: 'Target sees through your inexperience', type: 'failure' },
            { roll: [7, 8], result: 'You fail to make a compelling deception', type: 'normal' },
            { roll: [9, 9], result: 'Target considers your words', type: 'normal' },
            { roll: [10, 10], result: 'You make a decent lie, target is fooled', type: 'success' },
            { roll: [11, 11], result: 'Your deception is persuasive, target trusts you', type: 'success' },
            { roll: [12, 12], result: 'Target is convinced by your lie', type: 'success' }
        ]
    },
    deception_novice_d20: {
        name: 'Novice Deception (d20)',
        description: 'Novice deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'You completely misjudge the approach, target catches you', type: 'total-failure' },
            { roll: [4, 6], result: 'Your words offend the target', type: 'failure' },
            { roll: [7, 9], result: 'You fail to make any headway', type: 'failure' },
            { roll: [10, 11], result: 'Target is unmoved by your lie', type: 'failure' },
            { roll: [12, 13], result: 'You struggle to find the right words', type: 'normal' },
            { roll: [14, 15], result: 'Target listens but remains skeptical', type: 'normal' },
            { roll: [16, 17], result: 'You make a valid deception, target is fooled', type: 'success' },
            { roll: [18, 19], result: 'Your lie is convincing, target trusts you', type: 'success' },
            { roll: [20, 20], result: 'Against the odds, you deceive the target completely', type: 'critical' }
        ]
    },

    // TRAINED - d4 (Very Easy Task)
    deception_trained_d4: {
        name: 'Trained Deception (d4)',
        description: 'Trained deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You expertly craft your lie, target trusts you', type: 'success' },
            { roll: [3, 3], result: 'Your deception inspires belief, target becomes unwitting ally', type: 'critical' },
            { roll: [4, 4], result: 'Target is thoroughly deceived, spreads your lie to others', type: 'critical' }
        ]
    },
    deception_trained_d6: {
        name: 'Trained Deception (d6)',
        description: 'Trained deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You make a good deception, target is fooled', type: 'success' },
            { roll: [3, 3], result: 'Your lie is sound, target trusts you', type: 'success' },
            { roll: [4, 4], result: 'Target is impressed by your story', type: 'success' },
            { roll: [5, 5], result: 'You skillfully deceive them, target becomes unwitting ally', type: 'success' },
            { roll: [6, 6], result: 'Your deception resonates deeply, target vouches for you', type: 'critical' }
        ]
    },
    deception_trained_d8: {
        name: 'Trained Deception (d8)',
        description: 'Trained deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misjudge their position, target is skeptical', type: 'failure' },
            { roll: [2, 2], result: 'Your approach is slightly off, target is wary', type: 'failure' },
            { roll: [3, 3], result: 'You make a decent lie, target is uncertain', type: 'normal' },
            { roll: [4, 4], result: 'Your training shows, target is receptive', type: 'normal' },
            { roll: [5, 5], result: 'You present a compelling deception, target trusts you', type: 'success' },
            { roll: [6, 6], result: 'Your lie is persuasive, target is convinced', type: 'success' },
            { roll: [7, 7], result: 'Target is swayed by your expertise, becomes unwitting ally', type: 'success' },
            { roll: [8, 8], result: 'You masterfully deceive them, target vouches for you', type: 'critical' }
        ]
    },
    deception_trained_d10: {
        name: 'Trained Deception (d10)',
        description: 'Trained deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 1], result: 'You misread their motivations, target is skeptical', type: 'failure' },
            { roll: [2, 2], result: 'Your lie has a flaw they notice', type: 'failure' },
            { roll: [3, 3], result: 'Target is unconvinced but not hostile', type: 'failure' },
            { roll: [4, 4], result: 'You make some progress, target is uncertain', type: 'normal' },
            { roll: [5, 5], result: 'Your training helps you find common ground', type: 'normal' },
            { roll: [6, 7], result: 'You present a strong deception, target trusts you', type: 'success' },
            { roll: [8, 8], result: 'Your expertise shines through, target is convinced', type: 'success' },
            { roll: [9, 9], result: 'Target is impressed, becomes unwitting ally', type: 'success' },
            { roll: [10, 10], result: 'You skillfully deceive them, target vouches for you', type: 'critical' }
        ]
    },
    deception_trained_d12: {
        name: 'Trained Deception (d12)',
        description: 'Trained deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'You fail to connect, target is skeptical', type: 'failure' },
            { roll: [3, 4], result: 'Your approach is too direct, target is wary', type: 'failure' },
            { roll: [5, 6], result: 'You make a reasonable deception, target is uncertain', type: 'normal' },
            { roll: [7, 7], result: 'Your training helps you navigate the conversation', type: 'normal' },
            { roll: [8, 9], result: 'You present compelling lies, target trusts you', type: 'success' },
            { roll: [10, 10], result: 'Target is deceived by your story', type: 'success' },
            { roll: [11, 11], result: 'Your expertise wins them over, target becomes unwitting ally', type: 'success' },
            { roll: [12, 12], result: 'You masterfully deceive them, target spreads your lie', type: 'critical' }
        ]
    },
    deception_trained_d20: {
        name: 'Trained Deception (d20)',
        description: 'Trained deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'You struggle to find the right approach, target is skeptical', type: 'failure' },
            { roll: [4, 6], result: 'Your lie is insufficient for this challenge', type: 'failure' },
            { roll: [7, 7], result: 'You barely make any headway', type: 'failure' },
            { roll: [8, 9], result: 'You make some progress, target is uncertain', type: 'normal' },
            { roll: [10, 11], result: 'Your training helps you navigate the difficulty', type: 'normal' },
            { roll: [12, 14], result: 'You present a solid deception, target trusts you', type: 'success' },
            { roll: [15, 16], result: 'Your expertise shows, target is convinced', type: 'success' },
            { roll: [17, 18], result: 'You skillfully deceive them, target becomes unwitting ally', type: 'success' },
            { roll: [19, 19], result: 'Target is thoroughly deceived, becomes loyal to your lie', type: 'critical' },
            { roll: [20, 20], result: 'You masterfully overcome all obstacles, target is inspired by your story', type: 'critical' }
        ]
    },

    // APPRENTICE - d4 (Very Easy Task)
    deception_apprentice_d4: {
        name: 'Apprentice Deception (d4)',
        description: 'Apprentice deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You expertly build false trust, target becomes unwitting ally', type: 'success' },
            { roll: [3, 3], result: 'Your mastery is evident, target becomes loyal to your lie', type: 'critical' },
            { roll: [4, 4], result: 'Target is deeply deceived, pledges unwavering belief', type: 'critical' }
        ]
    },
    deception_apprentice_d6: {
        name: 'Apprentice Deception (d6)',
        description: 'Apprentice deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'Your skill is apparent, target trusts you', type: 'success' },
            { roll: [3, 3], result: 'You build strong false trust, target becomes unwitting ally', type: 'success' },
            { roll: [4, 4], result: 'Target is thoroughly deceived', type: 'success' },
            { roll: [5, 5], result: 'Your expertise shines, target becomes loyal to your lie', type: 'critical' },
            { roll: [6, 6], result: 'Target is inspired by your story, spreads your lie', type: 'critical' }
        ]
    },
    deception_apprentice_d8: {
        name: 'Apprentice Deception (d8)',
        description: 'Apprentice deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Target remains uncertain despite your skill', type: 'failure' },
            { roll: [2, 2], result: 'You make headway, target is uncertain', type: 'normal' },
            { roll: [3, 3], result: 'Your approach is effective, target warms to you', type: 'normal' },
            { roll: [4, 4], result: 'You present a strong deception, target trusts you', type: 'success' },
            { roll: [5, 5], result: 'Your skill is evident, target is convinced', type: 'success' },
            { roll: [6, 6], result: 'You build deep false trust, target becomes unwitting ally', type: 'success' },
            { roll: [7, 7], result: 'Target is thoroughly deceived, becomes loyal to your lie', type: 'critical' },
            { roll: [8, 8], result: 'Your mastery wins them completely, target pledges belief', type: 'critical' }
        ]
    },
    deception_apprentice_d10: {
        name: 'Apprentice Deception (d10)',
        description: 'Apprentice deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Even your skill cannot overcome this obstacle', type: 'failure' },
            { roll: [2, 2], result: 'You struggle to find the right approach', type: 'failure' },
            { roll: [3, 3], result: 'You make some progress, target is uncertain', type: 'normal' },
            { roll: [4, 4], result: 'Your training helps you navigate the challenge', type: 'normal' },
            { roll: [5, 6], result: 'You present compelling deceptions, target trusts you', type: 'success' },
            { roll: [7, 8], result: 'Your expertise is convincing, target is swayed', type: 'success' },
            { roll: [9, 9], result: 'You skillfully deceive them, target becomes unwitting ally', type: 'success' },
            { roll: [10, 10], result: 'Your mastery overcomes the difficulty, target becomes loyal to your lie', type: 'critical' }
        ]
    },
    deception_apprentice_d12: {
        name: 'Apprentice Deception (d12)',
        description: 'Apprentice deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'The challenge is too great, target remains uncertain', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your training', type: 'failure' },
            { roll: [4, 5], result: 'You make gradual progress, target is uncertain', type: 'normal' },
            { roll: [6, 7], result: 'Your skill helps you advance, target trusts you', type: 'success' },
            { roll: [8, 9], result: 'You present a strong deception, target is convinced', type: 'success' },
            { roll: [10, 11], result: 'Your expertise shines through, target becomes unwitting ally', type: 'success' },
            { roll: [12, 12], result: 'You masterfully overcome all obstacles, target becomes loyal to your lie', type: 'critical' }
        ]
    },
    deception_apprentice_d20: {
        name: 'Apprentice Deception (d20)',
        description: 'Apprentice deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'The task is beyond your current ability', type: 'failure' },
            { roll: [4, 5], result: 'You struggle to make any headway', type: 'failure' },
            { roll: [6, 8], result: 'You make minimal progress, target is uncertain', type: 'normal' },
            { roll: [9, 10], result: 'Your training helps you persevere', type: 'normal' },
            { roll: [11, 13], result: 'You present solid deceptions, target trusts you', type: 'success' },
            { roll: [14, 16], result: 'Your skill is evident, target is deceived', type: 'success' },
            { roll: [17, 18], result: 'You expertly navigate the difficulty, target becomes unwitting ally', type: 'success' },
            { roll: [19, 19], result: 'Your mastery overcomes the challenge, target becomes loyal to your lie', type: 'critical' },
            { roll: [20, 20], result: 'Against all odds, you achieve a breakthrough, target pledges full belief', type: 'critical' }
        ]
    },

    // ADEPT - d4 (Very Easy Task)
    deception_adept_d4: {
        name: 'Adept Deception (d4)',
        description: 'Adept deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You effortlessly build deep false trust, target becomes loyal to your lie', type: 'critical' },
            { roll: [3, 3], result: 'Target is thoroughly deceived, spreads your lie to others', type: 'critical' },
            { roll: [4, 4], result: 'Your mastery inspires them, target pledges resources based on your lie', type: 'critical' }
        ]
    },
    deception_adept_d6: {
        name: 'Adept Deception (d6)',
        description: 'Adept deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'Your expertise is clear, target becomes unwitting ally', type: 'success' },
            { roll: [3, 3], result: 'You build profound false trust, target becomes loyal to your lie', type: 'success' },
            { roll: [4, 4], result: 'Target is deeply deceived, spreads your lie to others', type: 'success' },
            { roll: [5, 5], result: 'Your mastery shines, target commits fully to your false narrative', type: 'critical' },
            { roll: [6, 6], result: 'Target is inspired, brings their allies to believe your lie', type: 'critical' }
        ]
    },
    deception_adept_d8: {
        name: 'Adept Deception (d8)',
        description: 'Adept deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Target is uncertain but not fully convinced', type: 'failure' },
            { roll: [2, 2], result: 'You make good headway, target trusts you', type: 'normal' },
            { roll: [3, 3], result: 'Your skill is evident, target warms considerably', type: 'normal' },
            { roll: [4, 4], result: 'You present masterful deceptions, target becomes unwitting ally', type: 'success' },
            { roll: [5, 5], result: 'Your expertise convinces them, target becomes loyal to your lie', type: 'success' },
            { roll: [6, 6], result: 'Target is thoroughly deceived, spreads your lie to others', type: 'success' },
            { roll: [7, 7], result: 'Your mastery overcomes all doubts, target commits fully', type: 'critical' },
            { roll: [8, 8], result: 'Target is inspired by your story, brings allies to believe your lie', type: 'critical' }
        ]
    },
    deception_adept_d10: {
        name: 'Adept Deception (d10)',
        description: 'Adept deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'The challenge tests even your skill, target is uncertain but uncommitted', type: 'failure' },
            { roll: [2, 2], result: 'You make progress but not a breakthrough', type: 'failure' },
            { roll: [3, 3], result: 'Your expertise helps you advance, target trusts you', type: 'normal' },
            { roll: [4, 4], result: 'You navigate the difficulty well', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery shows, target becomes unwitting ally', type: 'success' },
            { roll: [7, 8], result: 'You expertly overcome obstacles, target becomes loyal to your lie', type: 'success' },
            { roll: [9, 9], result: 'Target is thoroughly deceived, spreads your lie to others', type: 'success' },
            { roll: [10, 10], result: 'Your skill triumphs, target brings allies to believe your lie', type: 'critical' }
        ]
    },
    deception_adept_d12: {
        name: 'Adept Deception (d12)',
        description: 'Adept deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'The difficulty is substantial, target is uncertain but hesitant', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your mastery', type: 'failure' },
            { roll: [4, 5], result: 'Your expertise helps you make headway, target trusts you', type: 'normal' },
            { roll: [6, 7], result: 'You skillfully navigate the challenge, target becomes unwitting ally', type: 'success' },
            { roll: [8, 9], result: 'Your mastery overcomes the difficulty, target becomes loyal to your lie', type: 'success' },
            { roll: [10, 11], result: 'Target is thoroughly deceived, spreads your lie to others', type: 'success' },
            { roll: [12, 12], result: 'You achieve a masterful victory, target brings allies to believe your lie', type: 'critical' }
        ]
    },
    deception_adept_d20: {
        name: 'Adept Deception (d20)',
        description: 'Adept deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Even your mastery struggles with this challenge', type: 'failure' },
            { roll: [4, 5], result: 'You make minimal progress despite your skill', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance slowly, target trusts you', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your mastery', type: 'normal' },
            { roll: [11, 13], result: 'Your skill overcomes obstacles, target becomes unwitting ally', type: 'success' },
            { roll: [14, 16], result: 'You expertly navigate the difficulty, target becomes loyal to your lie', type: 'success' },
            { roll: [17, 18], result: 'Your mastery triumphs, target spreads your lie to others', type: 'success' },
            { roll: [19, 19], result: 'You achieve a remarkable victory, target brings allies to believe your lie', type: 'critical' },
            { roll: [20, 20], result: 'Your legendary skill overcomes all odds, target becomes your champion of deception', type: 'critical' }
        ]
    },

    // EXPERT - d4 (Very Easy Task)
    deception_expert_d4: {
        name: 'Expert Deception (d4)',
        description: 'Expert deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You inspire complete false trust, target spreads your lie to others', type: 'critical' },
            { roll: [3, 3], result: 'Target is moved to action, converts their allies to believe your lie', type: 'critical' },
            { roll: [4, 4], result: 'Your mastery creates a devoted believer, target pledges everything to your false narrative', type: 'critical' }
        ]
    },
    deception_expert_d6: {
        name: 'Expert Deception (d6)',
        description: 'Expert deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'Your expertise creates deep false trust, target becomes loyal to your lie', type: 'success' },
            { roll: [3, 3], result: 'Target is thoroughly deceived, spreads your lie to others', type: 'success' },
            { roll: [4, 4], result: 'You inspire them completely, target brings allies to believe your lie', type: 'success' },
            { roll: [5, 5], result: 'Your legendary skill creates a champion, target pledges resources to your false cause', type: 'critical' },
            { roll: [6, 6], result: 'Target is transformed by your deception, becomes your devoted advocate', type: 'critical' }
        ]
    },
    deception_expert_d8: {
        name: 'Expert Deception (d8)',
        description: 'Expert deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Target trusts you but not fully committed', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress, target becomes unwitting ally', type: 'normal' },
            { roll: [3, 3], result: 'Your expertise is undeniable, target is impressed', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate the challenge, target becomes loyal to your lie', type: 'success' },
            { roll: [5, 5], result: 'Your mastery overcomes all doubts, target spreads your lie to others', type: 'success' },
            { roll: [6, 6], result: 'Target is thoroughly deceived, brings allies to believe your lie', type: 'success' },
            { roll: [7, 7], result: 'Your legendary skill inspires them, target becomes your champion of deception', type: 'critical' },
            { roll: [8, 8], result: 'You achieve a masterwork of deception, target pledges everything to your false narrative', type: 'critical' }
        ]
    },
    deception_expert_d10: {
        name: 'Expert Deception (d10)',
        description: 'Expert deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, target trusts you but uncommitted', type: 'failure' },
            { roll: [2, 2], result: 'You make good progress with your expertise', type: 'failure' },
            { roll: [3, 3], result: 'Your legendary skill helps you advance, target becomes unwitting ally', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate the difficulty', type: 'normal' },
            { roll: [5, 6], result: 'Your mastery overcomes obstacles, target becomes loyal to your lie', type: 'success' },
            { roll: [7, 8], result: 'You skillfully deceive them, target spreads your lie to others', type: 'success' },
            { roll: [9, 9], result: 'Target is thoroughly convinced, brings allies to believe your lie', type: 'success' },
            { roll: [10, 10], result: 'Your legendary expertise triumphs, target becomes your champion of deception', type: 'critical' }
        ]
    },
    deception_expert_d12: {
        name: 'Expert Deception (d12)',
        description: 'Expert deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'The difficulty is substantial, target trusts you but hesitant', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your legendary skill', type: 'failure' },
            { roll: [4, 5], result: 'Your expertise helps you make headway, target becomes unwitting ally', type: 'normal' },
            { roll: [6, 7], result: 'You masterfully navigate the challenge, target becomes loyal to your lie', type: 'success' },
            { roll: [8, 9], result: 'Your legendary skill overcomes the difficulty, target spreads your lie to others', type: 'success' },
            { roll: [10, 11], result: 'Target is thoroughly deceived, brings allies to believe your lie', type: 'success' },
            { roll: [12, 12], result: 'You achieve a legendary victory, target becomes your devoted champion of deception', type: 'critical' }
        ]
    },
    deception_expert_d20: {
        name: 'Expert Deception (d20)',
        description: 'Expert deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 3], result: 'Even your legendary skill is tested by this challenge', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress despite your mastery', type: 'failure' },
            { roll: [6, 8], result: 'Your expertise helps you advance, target becomes unwitting ally', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your legendary skill', type: 'normal' },
            { roll: [11, 13], result: 'Your mastery overcomes obstacles, target becomes loyal to your lie', type: 'success' },
            { roll: [14, 16], result: 'You expertly navigate the difficulty, target spreads your lie to others', type: 'success' },
            { roll: [17, 18], result: 'Your legendary skill triumphs, target brings allies to believe your lie', type: 'success' },
            { roll: [19, 19], result: 'You achieve a remarkable victory, target becomes your champion of deception', type: 'critical' },
            { roll: [20, 20], result: 'Your mastery creates a miracle, target pledges everything and inspires others to believe your lie', type: 'critical' }
        ]
    },

    // MASTER - d4 (Very Easy Task)
    deception_master_d4: {
        name: 'Master Deception (d4)',
        description: 'Master deception on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You inspire a movement based on your lie, target converts their allies', type: 'critical' },
            { roll: [3, 3], result: 'Target abandons all previous beliefs, pledges to your false vision', type: 'critical' },
            { roll: [4, 4], result: 'Your deception creates a devoted disciple, target becomes your prophet of lies', type: 'critical' }
        ]
    },
    deception_master_d6: {
        name: 'Master Deception (d6)',
        description: 'Master deception on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'Your mastery is absolute, target spreads your lie to others', type: 'success' },
            { roll: [3, 3], result: 'You inspire them completely, target converts their allies to believe your lie', type: 'success' },
            { roll: [4, 4], result: 'Target abandons previous beliefs for your false vision', type: 'success' },
            { roll: [5, 5], result: 'Your legendary deception creates a champion, target becomes your devoted advocate', type: 'critical' },
            { roll: [6, 6], result: 'You inspire a transformation, target spreads your false message to others', type: 'critical' }
        ]
    },
    deception_master_d8: {
        name: 'Master Deception (d8)',
        description: 'Master deception on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Target is devoted to your lie and grants a major favor', type: 'failure' },
            { roll: [2, 2], result: 'You create deep false loyalty, target becomes loyal to your lie', type: 'normal' },
            { roll: [3, 3], result: 'Your unparalleled skill is evident, target is moved', type: 'normal' },
            { roll: [4, 4], result: 'You masterfully deceive them, target spreads your lie to others', type: 'success' },
            { roll: [5, 5], result: 'Your legendary expertise inspires action, target converts their allies', type: 'success' },
            { roll: [6, 6], result: 'Target abandons previous beliefs for your false cause', type: 'success' },
            { roll: [7, 7], result: 'You create a devoted champion, target becomes your advocate of deception', type: 'critical' },
            { roll: [8, 8], result: 'Your deception inspires a movement, target spreads your false message', type: 'critical' }
        ]
    },
    deception_master_d10: {
        name: 'Master Deception (d10)',
        description: 'Master deception on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'The challenge is formidable, target is devoted to your lie and grants a major favor', type: 'failure' },
            { roll: [2, 2], result: 'You make excellent progress with your mastery', type: 'failure' },
            { roll: [3, 3], result: 'Your unparalleled skill helps you advance, target becomes loyal to your lie', type: 'normal' },
            { roll: [4, 4], result: 'You expertly navigate the difficulty', type: 'normal' },
            { roll: [5, 6], result: 'Your legendary mastery overcomes obstacles, target spreads your lie to others', type: 'success' },
            { roll: [7, 8], result: 'You inspire them completely, target converts their allies to believe your lie', type: 'success' },
            { roll: [9, 9], result: 'Target abandons previous beliefs for your false vision', type: 'success' },
            { roll: [10, 10], result: 'Your unparalleled expertise creates a devoted champion of deception', type: 'critical' }
        ]
    },
    deception_master_d12: {
        name: 'Master Deception (d12)',
        description: 'Master deception on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'The difficulty is substantial, target is devoted to your lie and grants a major favor', type: 'failure' },
            { roll: [3, 3], result: 'You struggle despite your legendary mastery', type: 'failure' },
            { roll: [4, 5], result: 'Your unparalleled skill helps you make headway, target becomes loyal to your lie', type: 'normal' },
            { roll: [6, 7], result: 'You masterfully navigate the challenge, target spreads your lie to others', type: 'success' },
            { roll: [8, 9], result: 'Your legendary expertise overcomes the difficulty, target converts their allies', type: 'success' },
            { roll: [10, 11], result: 'Target abandons previous beliefs for your false cause', type: 'success' },
            { roll: [12, 12], result: 'You achieve a legendary victory, target becomes your devoted prophet of lies', type: 'critical' }
        ]
    },
    deception_master_d20: {
        name: 'Master Deception (d20)',
        description: 'Master deception on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 3], result: 'Even your legendary mastery is tested, target is devoted to your lie and grants a major favor', type: 'failure' },
            { roll: [4, 5], result: 'You make slow progress despite your unparalleled skill', type: 'failure' },
            { roll: [6, 8], result: 'Your legendary expertise helps you advance, target becomes loyal to your lie', type: 'normal' },
            { roll: [9, 10], result: 'You persevere with your unparalleled mastery', type: 'normal' },
            { roll: [11, 13], result: 'Your legendary skill overcomes obstacles, target spreads your lie to others', type: 'success' },
            { roll: [14, 16], result: 'You expertly navigate the difficulty, target converts their allies to believe your lie', type: 'success' },
            { roll: [17, 18], result: 'Your mastery triumphs, target abandons previous beliefs for your false vision', type: 'success' },
            { roll: [19, 19], result: 'You achieve a miraculous victory, target becomes your devoted champion of deception', type: 'critical' },
            { roll: [20, 20], result: 'Your legendary deception creates a movement, target becomes your prophet and inspires others to believe your lies', type: 'critical' }
        ]
    },

    // Leadership Tables - Multi-dimensional (7 proficiency levels × 6 dice types)
    // UNTRAINED - d4 (Very Easy Task)
    leadership_untrained_d4: {
        name: 'Untrained Leadership (d4)',
        description: 'Untrained leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your words confuse followers, they hesitate', type: 'failure' },
            { roll: [2, 2], result: 'Followers are uncertain but maintain morale', type: 'normal' },
            { roll: [3, 3], result: 'You inspire basic confidence, followers gain +1 to actions', type: 'success' },
            { roll: [4, 4], result: 'Despite inexperience, you rally them, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d6: {
        name: 'Untrained Leadership (d6)',
        description: 'Untrained leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'Your command is weak, followers lose morale', type: 'failure' },
            { roll: [2, 2], result: 'You contradict yourself, followers are confused', type: 'failure' },
            { roll: [3, 3], result: 'Your words are clumsy but followers listen', type: 'normal' },
            { roll: [4, 4], result: 'Followers are unmoved but willing to try', type: 'normal' },
            { roll: [5, 5], result: 'You manage to inspire them, followers gain +1 to actions', type: 'success' },
            { roll: [6, 6], result: 'Your passion shows through, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d8: {
        name: 'Untrained Leadership (d8)',
        description: 'Untrained leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You panic, followers flee or rebel', type: 'failure' },
            { roll: [2, 2], result: 'Your fear is obvious, followers lose confidence', type: 'failure' },
            { roll: [3, 3], result: 'You stumble over words, followers are demoralized', type: 'failure' },
            { roll: [4, 4], result: 'Your inexperience shows, no effect', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain order, followers hesitate', type: 'normal' },
            { roll: [6, 6], result: 'Followers remain uncertain but listen', type: 'normal' },
            { roll: [7, 7], result: 'You find the right words, followers gain +1 to actions', type: 'success' },
            { roll: [8, 8], result: 'Lucky inspiration, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d10: {
        name: 'Untrained Leadership (d10)',
        description: 'Untrained leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 1], result: 'You say exactly the wrong thing, followers panic and flee', type: 'failure' },
            { roll: [2, 3], result: 'Your clumsy command angers followers', type: 'failure' },
            { roll: [4, 5], result: 'Followers see through your inexperience, lose morale', type: 'failure' },
            { roll: [6, 6], result: 'You ramble unconvincingly, followers ignore you', type: 'failure' },
            { roll: [7, 7], result: 'Your words are poorly chosen but followers try', type: 'normal' },
            { roll: [8, 8], result: 'Followers remain skeptical but willing', type: 'normal' },
            { roll: [9, 9], result: 'You stumble into inspiration, followers gain +1 to actions', type: 'success' },
            { roll: [10, 10], result: 'Surprising rally, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d12: {
        name: 'Untrained Leadership (d12)',
        description: 'Untrained leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You completely fail to inspire, followers abandon you', type: 'failure' },
            { roll: [3, 4], result: 'Your words cause panic, followers flee', type: 'failure' },
            { roll: [5, 6], result: 'You anger followers with poor leadership', type: 'failure' },
            { roll: [7, 8], result: 'Followers see you as incompetent, lose respect', type: 'failure' },
            { roll: [9, 9], result: 'Your inexperience is obvious, no effect', type: 'failure' },
            { roll: [10, 10], result: 'Followers barely tolerate your command', type: 'normal' },
            { roll: [11, 11], result: 'You manage minimal inspiration, followers gain +1 to actions', type: 'success' },
            { roll: [12, 12], result: 'Against odds, you rally them, followers gain +2 to actions', type: 'success' }
        ]
    },
    leadership_untrained_d20: {
        name: 'Untrained Leadership (d20)',
        description: 'Untrained leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 2], result: 'You completely misunderstand the situation, followers mutiny and abandon you permanently', type: 'total-failure' },
            { roll: [3, 4], result: 'Your words cause catastrophic mass panic, followers flee in terror and spread word of your failure', type: 'total-failure' },
            { roll: [5, 6], result: 'You say something deeply offensive, followers turn against you and refuse to follow', type: 'total-failure' },
            { roll: [7, 8], result: 'Your leadership is catastrophically bad, followers mock you publicly', type: 'failure' },
            { roll: [9, 10], result: 'Followers see you as completely incompetent, refuse to follow orders', type: 'failure' },
            { roll: [11, 12], result: 'Your inexperience causes chaos, no positive effect', type: 'failure' },
            { roll: [13, 14], result: 'You barely maintain order through sheer luck', type: 'normal' },
            { roll: [15, 16], result: 'Miraculous inspiration, followers gain +1 to actions', type: 'normal' },
            { roll: [17, 18], result: 'Against all odds, you rally them, followers gain +1 to actions', type: 'success' },
            { roll: [19, 19], result: 'Impossible rally, followers gain +2 to actions', type: 'success' },
            { roll: [20, 20], result: 'Legendary leadership moment, followers gain +2 to actions and become devoted', type: 'critical' }
        ]
    },

    // NOVICE - d4 (Very Easy Task)
    leadership_novice_d4: {
        name: 'Novice Leadership (d4)',
        description: 'Novice leadership on a very easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Failure, attempt unsuccessful', type: 'failure' },
            { roll: [2, 2], result: 'You inspire confidence, followers gain +2 to actions', type: 'success' },
            { roll: [3, 3], result: 'Your command is clear, followers gain +3 to actions', type: 'success' },
            { roll: [4, 4], result: 'Followers are impressed, gain +3 to actions + extra action', type: 'success' }
        ]
    },
    leadership_novice_d6: {
        name: 'Novice Leadership (d6)',
        description: 'Novice leadership on an easy task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'You misjudge the approach, followers lose morale', type: 'failure' },
            { roll: [2, 2], result: 'Your command is weak, followers are skeptical', type: 'failure' },
            { roll: [3, 3], result: 'Followers are unmoved by your words', type: 'normal' },
            { roll: [4, 4], result: 'You make a decent attempt, followers gain +1 to actions', type: 'normal' },
            { roll: [5, 5], result: 'Your leadership is solid, followers gain +2 to actions', type: 'success' },
            { roll: [6, 6], result: 'Followers are inspired, gain +3 to actions', type: 'success' }
        ]
    },
    leadership_novice_d8: {
        name: 'Novice Leadership (d8)',
        description: 'Novice leadership on a moderate task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'Your inexperience shows, followers hesitate', type: 'failure' },
            { roll: [2, 2], result: 'You struggle to inspire, no effect', type: 'failure' },
            { roll: [3, 3], result: 'Followers remain uncertain', type: 'normal' },
            { roll: [4, 4], result: 'Your training helps, followers listen', type: 'normal' },
            { roll: [5, 5], result: 'You rally them adequately, followers gain +1 to actions', type: 'normal' },
            { roll: [6, 6], result: 'Solid leadership, followers gain +2 to actions', type: 'success' },
            { roll: [7, 7], result: 'You inspire confidence, followers gain +3 to actions', type: 'success' },
            { roll: [8, 8], result: 'Excellent command, followers gain +3 to actions + extra action', type: 'critical' }
        ]
    },
    leadership_novice_d10: {
        name: 'Novice Leadership (d10)',
        description: 'Novice leadership on a challenging task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 1], result: 'The challenge overwhelms you, followers panic', type: 'failure' },
            { roll: [2, 2], result: 'You fail to inspire, followers lose morale', type: 'failure' },
            { roll: [3, 3], result: 'Your words fall flat, no effect', type: 'failure' },
            { roll: [4, 4], result: 'Followers remain doubtful', type: 'failure' },
            { roll: [5, 5], result: 'You barely maintain order', type: 'normal' },
            { roll: [6, 6], result: 'Your training shows, followers listen', type: 'normal' },
            { roll: [7, 7], result: 'You rally them, followers gain +1 to actions', type: 'success' },
            { roll: [8, 8], result: 'Good leadership, followers gain +2 to actions', type: 'success' },
            { roll: [9, 9], result: 'You inspire them, followers gain +3 to actions', type: 'success' },
            { roll: [10, 10], result: 'Exceptional command, followers gain +3 to actions + extra action', type: 'critical' }
        ]
    },
    leadership_novice_d12: {
        name: 'Novice Leadership (d12)',
        description: 'Novice leadership on a difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'The task is beyond your ability, followers flee', type: 'failure' },
            { roll: [3, 4], result: 'You fail to inspire, followers lose confidence', type: 'failure' },
            { roll: [5, 6], result: 'Your command is ineffective, no effect', type: 'failure' },
            { roll: [7, 7], result: 'Followers remain skeptical', type: 'failure' },
            { roll: [8, 8], result: 'You barely hold them together', type: 'normal' },
            { roll: [9, 9], result: 'Your training helps you persevere', type: 'normal' },
            { roll: [10, 10], result: 'You rally them, followers gain +1 to actions', type: 'success' },
            { roll: [11, 11], result: 'Solid leadership, followers gain +2 to actions', type: 'success' },
            { roll: [12, 12], result: 'You inspire them, followers gain +3 to actions', type: 'critical' }
        ]
    },
    leadership_novice_d20: {
        name: 'Novice Leadership (d20)',
        description: 'Novice leadership on a very difficult task',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'You completely fail to lead, followers mutiny and abandon you', type: 'total-failure' },
            { roll: [3, 4], result: 'Your words cause catastrophic panic, followers flee in terror', type: 'total-failure' },
            { roll: [5, 6], result: 'You anger followers with terrible decisions, they turn against you', type: 'failure' },
            { roll: [7, 8], result: 'Your leadership fails completely, followers lose all respect', type: 'failure' },
            { roll: [9, 10], result: 'Followers see your severe limits, refuse to follow orders', type: 'failure' },
            { roll: [11, 12], result: 'You barely maintain control through luck', type: 'normal' },
            { roll: [13, 14], result: 'Your training helps you hold them together', type: 'normal' },
            { roll: [15, 16], result: 'You rally them effectively, followers gain +1 to actions', type: 'success' },
            { roll: [17, 18], result: 'Impressive leadership, followers gain +2 to actions', type: 'success' },
            { roll: [19, 19], result: 'Miraculous command, followers gain +2 to actions', type: 'success' },
            { roll: [20, 20], result: 'Legendary leadership moment, followers gain +3 to actions and become devoted', type: 'critical' }
        ]
    },


    // Insight Tables - Evolving by rank
    insightBasic: {
        name: 'Basic Insight',
        description: 'Untrained intention reading',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Completely misread, believe opposite of truth', type: 'total-failure' },
            { roll: [9, 14], result: 'No reading, completely confused', type: 'failure' },
            { roll: [15, 18], result: 'Uncertain reading, can\'t tell truth from lies', type: 'normal' },
            { roll: [19, 20], result: 'Accurately read basic intentions', type: 'success' }
        ]
    },
    insightReading: {
        name: 'Insight Reading',
        description: 'Results of reading intentions and detecting lies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Completely misread intentions, believe lies', type: 'total-failure' },
            { roll: [4, 8], result: 'Uncertain reading, can\'t tell truth from lies', type: 'normal' },
            { roll: [9, 14], result: 'Accurately read basic intentions', type: 'success' },
            { roll: [15, 18], result: 'Detect lies and understand motivations', type: 'success' },
            { roll: [19, 20], result: 'See through all deception, know their deepest desires', type: 'critical' }
        ]
    },
    insightAdvanced: {
        name: 'Advanced Insight',
        description: 'Trained intention reading',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Partial reading, some doubts remain', type: 'failure' },
            { roll: [3, 7], result: 'Accurately read basic intentions', type: 'normal' },
            { roll: [8, 13], result: 'Detect lies and understand motivations', type: 'success' },
            { roll: [14, 17], result: 'See through all deception, know their deepest desires', type: 'success' },
            { roll: [18, 19], result: 'Perfect reading, know their past and fears', type: 'critical' },
            { roll: [20, 20], result: 'Absolute insight, read their soul + predict actions', type: 'critical' }
        ]
    },
    insightExpert: {
        name: 'Expert Insight',
        description: 'Apprentice-level insight mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good reading, basic motivations clear', type: 'failure' },
            { roll: [2, 6], result: 'Detect lies and understand motivations', type: 'normal' },
            { roll: [7, 12], result: 'See through all deception, know their deepest desires', type: 'success' },
            { roll: [13, 16], result: 'Perfect reading, know their past and fears', type: 'success' },
            { roll: [17, 19], result: 'Absolute insight, read their soul + predict actions', type: 'critical' },
            { roll: [20, 20], result: 'Legendary empathy, experience their memories', type: 'critical' }
        ]
    },
    insightMaster: {
        name: 'Master Insight',
        description: 'Adept-level supreme insight',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Clear reading, all lies detected', type: 'failure' },
            { roll: [2, 5], result: 'See through all deception, know their deepest desires', type: 'normal' },
            { roll: [6, 11], result: 'Perfect reading, know their past and fears', type: 'success' },
            { roll: [12, 15], result: 'Absolute insight, read their soul + predict actions', type: 'success' },
            { roll: [16, 18], result: 'Legendary empathy, experience their memories', type: 'critical' },
            { roll: [19, 20], result: 'Mythic understanding, know their destiny + alter it', type: 'critical' }
        ]
    },
    insightGrandmaster: {
        name: 'Grandmaster Insight',
        description: 'Expert-level legendary insight',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Perfect reading, past and fears known', type: 'failure' },
            { roll: [2, 4], result: 'Perfect reading, know their past and fears', type: 'normal' },
            { roll: [5, 9], result: 'Absolute insight, read their soul + predict actions', type: 'success' },
            { roll: [10, 14], result: 'Legendary empathy, experience their memories', type: 'success' },
            { roll: [15, 17], result: 'Mythic understanding, know their destiny + alter it', type: 'critical' },
            { roll: [18, 20], result: 'Divine perception, read multiple souls + influence thoughts', type: 'critical' }
        ]
    },
    insightLegendary: {
        name: 'Legendary Insight',
        description: 'Master-level ultimate insight',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Absolute insight, soul fully read', type: 'failure' },
            { roll: [2, 3], result: 'Absolute insight, read their soul + predict actions', type: 'normal' },
            { roll: [4, 8], result: 'Legendary empathy, experience their memories', type: 'success' },
            { roll: [9, 13], result: 'Mythic understanding, know their destiny + alter it', type: 'success' },
            { roll: [14, 16], result: 'Divine perception, read multiple souls + influence thoughts', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic awareness, know all minds nearby + control emotions', type: 'critical' },
            { roll: [20, 20], result: 'Absolute empathy, merge with all consciousness + omniscient understanding', type: 'critical' }
        ]
    },

    // Intimidation Tables - Evolving by rank
    intimidationBasic: {
        name: 'Crude Intimidation',
        description: 'Untrained intimidation attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Target enraged, attacks immediately', type: 'failure' },
            { roll: [9, 14], result: 'Target laughs, becomes more confident', type: 'failure' },
            { roll: [15, 18], result: 'Target is unmoved by threats', type: 'normal' },
            { roll: [19, 20], result: 'Target complies reluctantly', type: 'success' }
        ]
    },
    intimidationEffects: {
        name: 'Intimidation Effects',
        description: 'Results of intimidating others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Target becomes defiant and hostile', type: 'failure' },
            { roll: [4, 8], result: 'Target is unmoved by threats', type: 'normal' },
            { roll: [9, 14], result: 'Target complies reluctantly', type: 'success' },
            { roll: [15, 18], result: 'Target is frightened and cooperative', type: 'success' },
            { roll: [19, 20], result: 'Target is terrified, will do anything you ask', type: 'critical' }
        ]
    },
    intimidationAdvanced: {
        name: 'Advanced Intimidation',
        description: 'Trained intimidation techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Target resists, no effect', type: 'failure' },
            { roll: [3, 7], result: 'Target complies reluctantly', type: 'normal' },
            { roll: [8, 13], result: 'Target is frightened and cooperative', type: 'success' },
            { roll: [14, 17], result: 'Target is terrified, will do anything you ask', type: 'success' },
            { roll: [18, 19], result: 'Target paralyzed with fear, becomes servant', type: 'critical' },
            { roll: [20, 20], result: 'Target broken, permanent loyalty through fear', type: 'critical' }
        ]
    },
    intimidationExpert: {
        name: 'Expert Intimidation',
        description: 'Apprentice-level intimidation mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Target nervous but complies', type: 'failure' },
            { roll: [2, 6], result: 'Target is frightened and cooperative', type: 'normal' },
            { roll: [7, 12], result: 'Target is terrified, will do anything you ask', type: 'success' },
            { roll: [13, 16], result: 'Target paralyzed with fear, becomes servant', type: 'success' },
            { roll: [17, 19], result: 'Target broken, permanent loyalty through fear', type: 'critical' },
            { roll: [20, 20], result: 'Target\'s will shattered, mindless obedience', type: 'critical' }
        ]
    },
    intimidationMaster: {
        name: 'Master Intimidation',
        description: 'Adept-level supreme intimidation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Target frightened, fully cooperative', type: 'failure' },
            { roll: [2, 5], result: 'Target is terrified, will do anything you ask', type: 'normal' },
            { roll: [6, 11], result: 'Target paralyzed with fear, becomes servant', type: 'success' },
            { roll: [12, 15], result: 'Target broken, permanent loyalty through fear', type: 'success' },
            { roll: [16, 18], result: 'Target\'s will shattered, mindless obedience', type: 'critical' },
            { roll: [19, 20], result: 'Target\'s soul crushed, spreads fear to others nearby', type: 'critical' }
        ]
    },
    intimidationGrandmaster: {
        name: 'Grandmaster Intimidation',
        description: 'Expert-level legendary intimidation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Target terrified, complete obedience', type: 'failure' },
            { roll: [2, 4], result: 'Target paralyzed with fear, becomes servant', type: 'normal' },
            { roll: [5, 9], result: 'Target broken, permanent loyalty through fear', type: 'success' },
            { roll: [10, 14], result: 'Target\'s will shattered, mindless obedience', type: 'success' },
            { roll: [15, 17], result: 'Target\'s soul crushed, spreads fear to others nearby', type: 'critical' },
            { roll: [18, 20], result: 'Legendary terror, entire group submits + reputation spreads', type: 'critical' }
        ]
    },
    intimidationLegendary: {
        name: 'Legendary Intimidation',
        description: 'Master-level ultimate intimidation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Target paralyzed, servant status', type: 'failure' },
            { roll: [2, 3], result: 'Target broken, permanent loyalty through fear', type: 'normal' },
            { roll: [4, 8], result: 'Target\'s will shattered, mindless obedience', type: 'success' },
            { roll: [9, 13], result: 'Target\'s soul crushed, spreads fear to others nearby', type: 'success' },
            { roll: [14, 16], result: 'Legendary terror, entire group submits + reputation spreads', type: 'critical' },
            { roll: [17, 19], result: 'Mythic fear, enemies flee on sight + allies empowered', type: 'critical' },
            { roll: [20, 20], result: 'Absolute terror, your name becomes curse + instant submission from all', type: 'critical' }
        ]
    }
};