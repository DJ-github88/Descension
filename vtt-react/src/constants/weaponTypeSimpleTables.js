/**
 * Weapon Type — Standard d8 Flavor Tables
 * ---------------------------------------
 * Standard Rules ("simple" mode): every attack rolls TWO dice at once.
 *   1. Weapon Type die  — a static d8 for ALL weapons. The result picks a
 *      unique, flavor-forward outcome for the equipped weapon that ADDS to or
 *      RETRACTS from the attack. A d8 (not a d6) keeps the strongest signature
 *      effects rare enough to stay special.
 *   2. Weapon Damage die — varies by weapon (d4 .. d12, see the damage table).
 *
 * The d8 uses one consistent 8-tier scale across ALL weapons so players learn
 * the curve once; the flavour text is unique per weapon archetype so each
 * weapon feels distinct and carries its own tactical identity (face 8 = the
 * weapon's signature move: a Bow double-crits, a Mace stuns, a Maul shoves,
 * and so on).
 *
 * Mythrill uses a durability system for gear, NOT flat Damage Reduction, so
 * these outcomes never "ignore armor DR" — where a weapon would crack guard it
 * instead threatens the target's gear durability.
 *
 * Advanced Rules ("advanced" mode) layer the Weapon Mastery quest ladder and
 * rank-gated tables on top of the same d8 outcomes (see WEAPON_FACE_TEXT in
 * Skills.jsx).
 */

/**
 * The shared d8 tier scale.
 * `delta` is a compact human label shown on the die card / outcome rows.
 * `tone` drives the colour treatment.
 */
export const WEAPON_TYPE_TIERS = {
    1:  { name: 'Critical Fumble', delta: 'mishap',     tone: 'bad',   rankReq: 'UNTRAINED', dieReq: 4,  blurb: 'Major mishap — drop weapon, weapon lodges, or lose 2 AP.' },
    2:  { name: 'Miss & Overextend', delta: 'miss',      tone: 'bad',   rankReq: 'UNTRAINED', dieReq: 4,  blurb: 'Complete miss — overextended, lose 1 AP.' },
    3:  { name: 'Glancing Graze', delta: '½ dmg',     tone: 'weak',  rankReq: 'UNTRAINED', dieReq: 4,  blurb: 'Deflected off guard — deals half damage only.' },
    4:  { name: 'Clean Hit',      delta: '+0',        tone: 'base',  rankReq: 'UNTRAINED', dieReq: 4,  blurb: 'A clean, standard hit dealing normal weapon damage.' },
    5:  { name: 'Solid Strike',   delta: '+1 dmg',    tone: 'ok',    rankReq: 'NOVICE',    dieReq: 6,  blurb: 'Firm strike dealing +1 damage.' },
    6:  { name: 'Skilled Move',   delta: '+1 & tech', tone: 'good',  rankReq: 'NOVICE',    dieReq: 6,  blurb: 'Practiced strike dealing +1 damage with a minor tactical edge.' },
    7:  { name: 'Tactical Edge',  delta: '+2 dmg',    tone: 'great', rankReq: 'TRAINED',   dieReq: 8,  blurb: 'Masterful blow dealing +2 damage and applying tactical pressure.' },
    8:  { name: 'Signature Move', delta: '+2 & stunt',tone: 'crit',   rankReq: 'TRAINED',   dieReq: 8,  blurb: 'The weapon’s defining maneuver dealing +2 damage and a signature effect.' },
    9:  { name: 'Empowered Strike', delta: '+3 dmg',  tone: 'great', rankReq: 'APPRENTICE',dieReq: 10, blurb: 'Empowered strike dealing +3 damage with positioning control.' },
    10: { name: 'Grand Flourish', delta: '+3 & cleave', tone: 'crit', rankReq: 'APPRENTICE', dieReq: 10, blurb: 'Sweeping strike dealing +3 damage and affecting nearby enemies.' },
    11: { name: 'Heroic Sunder',  delta: '+4 dmg',    tone: 'great', rankReq: 'ADEPT',     dieReq: 12, blurb: 'Decisive blow dealing +4 damage and sundering armor durability.' },
    12: { name: 'Supreme Climax', delta: '+4 & action', tone: 'crit', rankReq: 'ADEPT',   dieReq: 12, blurb: 'Masterful finish dealing +4 damage with bonus action recovery.' },
    13: { name: 'Master Precision', delta: '+5 dmg',  tone: 'great', rankReq: 'EXPERT',    dieReq: 20, blurb: 'Flawless precision dealing +5 damage and bypassing light cover.' },
    14: { name: 'Master Cleave',  delta: '+5 & aoe',  tone: 'crit',  rankReq: 'EXPERT',    dieReq: 20, blurb: 'Overwhelming cleave dealing +5 damage and secondary target damage.' },
    15: { name: 'Battlefield Dominion', delta: '+6 dmg', tone: 'crit', rankReq: 'EXPERT', dieReq: 20, blurb: 'Heavy impact dealing +6 damage and knocking the target prone.' },
    16: { name: 'Apex Stride',    delta: '+6 & step', tone: 'crit',  rankReq: 'MASTER',    dieReq: 20, blurb: 'Relentless strike dealing +6 damage and granting free movement.' },
    17: { name: 'Sundering Blow', delta: '+7 dmg',    tone: 'crit',  rankReq: 'MASTER',    dieReq: 20, blurb: 'Devastating force dealing +7 damage and stripping armor.' },
    18: { name: 'Stunning Critical', delta: '+7 & stun', tone: 'crit', rankReq: 'MASTER', dieReq: 20, blurb: 'Concussive critical dealing +7 damage and stunning target for 1 turn.' },
    19: { name: 'Peerless Flurry', delta: '+8 dmg',   tone: 'crit',  rankReq: 'MASTER',    dieReq: 20, blurb: 'Legendary execution dealing +8 damage with a free follow-up.' },
    20: { name: 'Apotheosis Critical', delta: '+8 & break', tone: 'crit', rankReq: 'MASTER', dieReq: 20, blurb: 'Peak martial perfection — +8 damage, guard shattered, target knocked prone.' }
};

/**
 * Balanced, grounded outcome text per weapon archetype (1–20 scale).
 * - 1-3: Failures (fumble, miss, glance)
 * - 4: Clean standard hit (normal damage)
 * - 5-8: Natural die successes (minor bonuses + signature moves)
 * - 9-20: Enhanced modifier & mastery progression (+3 to +8 dmg, sundering, cleaving, positioning)
 */
export const WEAPON_TYPE_SIMPLE_TABLES = {
    sword: {
        1: 'Overextended Fumble: You swing too wide and your blade lodges into the terrain. You drop your guard and lose 2 Action Points (AP) to recover balance.',
        2: 'Wide Miss: Your strike misses the enemy cleanly. You are left off-balance and overextended, losing 1 Action Point (AP).',
        3: 'Glancing Deflection: Your blade is partially deflected by the enemy’s armor or shield. Deal half normal weapon damage with no extra effects.',
        4: 'Clean Strike: A direct, solid hit. Deal full normal weapon damage.',
        5: 'Quick Slash & Step: Deal +1 bonus damage. You may immediately take a free 1-tile tactical step after hitting.',
        6: 'Pommel Strike: Deal +1 bonus damage and strike the enemy with your hilt, staggering them so their movement speed is reduced by 1 tile on their next turn.',
        7: 'Riposte Stance: Deal +2 bonus damage. If this enemy attacks you in melee before your next turn, you immediately counter-attack as a free reaction (rolling with a −1 penalty).',
        8: 'Dancing Steel: Deal +2 bonus damage and immediately make a free secondary slash against the target for half damage without spending extra Action Points (AP).',
        9: 'Disarming Strike: Deal +3 bonus damage and knock the enemy’s off-hand weapon or shield out of their grip, dropping it to the ground.',
        10: 'Sweeping Blade Tempest: Deal +3 bonus damage to the target, and momentum carries your blade to cleave an adjacent enemy for 2 damage.',
        11: 'Master Defensive Parry: Deal +4 bonus damage and adopt an impenetrable guard, gaining +1 Armor Class (AC) until your next turn.',
        12: 'Blademaster Finale: Deal +4 bonus damage, shatter 1 durability point off the enemy’s armor, and immediately regain 1 Action Point (AP).',
        13: 'Piercing Thrust: Deal +5 bonus damage and ignore any light physical cover the target has.',
        14: 'Dual Sweeping Arc: Deal +5 bonus damage to the primary target and strike an adjacent foe for 3 damage.',
        15: 'Dominion Knockdown: Deal +6 bonus damage and slam the enemy with enough force to knock them Prone on the ground.',
        16: 'Sword Saint Stride: Deal +6 bonus damage and reposition up to 2 tiles freely without triggering opportunity attacks.',
        17: 'Armor-Severing Laceration: Deal +7 bonus damage and permanently reduce the target’s armor durability by 1.',
        18: 'Dazing Hilt Impact: Deal +7 bonus damage and heavily daze the enemy, causing them to lose 1 Action Point (AP) on their next turn.',
        19: 'Relentless Flurry: Deal +8 bonus damage and immediately make a free secondary attack at −2 to hit.',
        20: 'Apotheosis Critical: Deal +8 maximum critical damage, completely shatter the enemy’s defensive stance, and knock them Prone.'
    },
    axe: {
        1: 'Lodged Axe Head: Your axe head bites deep into the stone or ground. You must spend 2 Action Points (AP) to wrench it free.',
        2: 'Overhand Miss: You swing a heavy chop that misses entirely. You stagger from the momentum and lose 1 Action Point (AP).',
        3: 'Deflected Chop: The axe skids across the enemy’s shield or armor plating. Deal half normal weapon damage.',
        4: 'Clean Chop: A solid, chopping strike that bites cleanly into the foe. Deal full normal weapon damage.',
        5: 'Wide Cleaving Arc: Deal +1 bonus damage and shove the enemy 1 tile backward.',
        6: 'Shield-Hacking Blow: Deal +1 bonus damage (or +2 bonus damage if the target is blocking with a shield or hiding behind wooden cover).',
        7: 'Beard Hook & Yank: Deal +2 bonus damage, catch the enemy with the lower hook of your axe blade, and pull them 1 tile toward you.',
        8: 'Sundering Chop: Deal +2 bonus damage and crack 1 point of durability off the enemy’s shield or armor.',
        9: 'Cleaving Onslaught: Deal +3 bonus damage to the main target and cleave an adjacent foe for 2 damage.',
        10: 'Mountain Splitter: Deal +3 bonus damage, push the target 2 tiles backward, and knock them off-balance.',
        11: 'Armor-Cracking Hew: Deal +4 bonus damage and shatter 1 durability point on the target’s armor.',
        12: 'Warlord’s Momentum: Deal +4 bonus damage and regain 1 Action Point (AP) from the momentum of the strike.',
        13: 'Heavy Sunder: Deal +5 bonus damage and ignore the Armor Class (AC) bonus granted by the enemy’s shield.',
        14: 'Sweeping Cleave: Deal +5 bonus damage to your target and deal 2 damage to two adjacent foes.',
        15: 'Earth-Shattering Slam: Deal +6 bonus damage and knock the target Prone on the ground.',
        16: 'Berserker Stride: Deal +6 bonus damage and advance 2 tiles forward freely without provoking opportunity attacks.',
        17: 'Spine-Splitter: Deal +7 bonus damage and reduce the target’s armor durability by 1.',
        18: 'Staggering Impact: Deal +7 bonus damage and heavily daze the enemy (they lose 1 Action Point on their next turn).',
        19: 'Furious Execution: Deal +8 bonus damage and immediately make a free secondary chop at −2 to hit.',
        20: 'Apotheosis Cleave: Deal +8 maximum critical damage, completely destroy the enemy’s shield, and knock them Prone.'
    },
    mace: {
        1: 'Vibrational Shock: The mace bounces off a hard surface and reverberates up your arm. You lose 2 Action Points (AP) from numbed hands.',
        2: 'Heavy Miss: You swing off-line and miss the target completely. You lose 1 Action Point (AP) recovering your stance.',
        3: 'Glancing Blow: The mace crown grazes off the enemy’s helmet or shoulder. Deal half normal weapon damage.',
        4: 'Bruising Strike: A solid, crushing hit that bruises through padding. Deal full normal weapon damage.',
        5: 'Ringing Blow: Deal +1 bonus damage and rattle the enemy’s senses, giving them a −1 penalty to their next attack roll.',
        6: 'Limb-Crusher: Deal +1 bonus damage and strike the enemy’s arm or leg, reducing their movement speed by 1 tile until their next turn.',
        7: 'Concussive Impact: Deal +2 bonus damage and knock the enemy off-balance, causing them to lose 1 Action Point (AP) on their next turn.',
        8: 'Skull-Rattler: Deal +2 bonus damage and heavily stun the enemy for 1 full round (they cannot take reactions).',
        9: 'Armor Pulverizer: Deal +3 bonus damage and permanently dent/degrade 1 point of the target’s armor durability.',
        10: 'Shockwave Impact: Deal +3 bonus damage and knock the target 2 tiles backward.',
        11: 'Bone-Cracking Strike: Deal +4 bonus damage and prevent the target from taking reactions until your next turn.',
        12: 'Titan’s Bell: Deal +4 bonus damage, daze the enemy, and fortify your stance to gain +1 Defense/AC until your next turn.',
        13: 'Cratering Smash: Deal +5 bonus damage and ignore any physical armor damage reduction the enemy possesses.',
        14: 'Sweeping Flail: Deal +5 bonus damage to the target and push an adjacent enemy 1 tile backward.',
        15: 'Ironclad Dominion: Deal +6 bonus damage and slam the target Prone on the ground.',
        16: 'Juggernaut Advance: Deal +6 bonus damage and step 2 tiles forward freely into the enemy’s space.',
        17: 'Fortress Breaker: Deal +7 bonus damage and destroy 1 durability point of the target’s armor.',
        18: 'Stunning Concussion: Deal +7 bonus damage and Stun the enemy for 1 full round (they lose all actions).',
        19: 'Relentless Pummel: Deal +8 bonus damage and immediately make a free follow-up strike at −2 to hit.',
        20: 'Apotheosis Annihilation: Deal +8 maximum critical damage, pulverize enemy defenses, and knock them Prone.'
    },
    dagger: {
        1: 'Fumbled Grip: Your grip slips on the dagger handle. You drop your balance and nick yourself for 1 damage.',
        2: 'Overextended Thrust: You thrust forward and miss. You lose 1 Action Point (AP) pulling back into guard.',
        3: 'Glancing Nick: The blade catches thick clothing or leather without biting deep. Deal half normal weapon damage.',
        4: 'Clean Puncture: A sharp, precise stab into a vulnerable opening. Deal full normal weapon damage.',
        5: 'Gut Jab & Fade: Deal +1 bonus damage and immediately slip 1 tile into nearby cover without provoking opportunity attacks.',
        6: 'Hamstring Slice: Deal +1 bonus damage to the enemy’s leg tendon, reducing their movement speed by 1 tile for 1 round.',
        7: 'Quickhand Strike: Deal +2 bonus damage and immediately make a rapid second dagger jab at −2 to hit.',
        8: 'Assassin’s Flick: Deal +2 bonus damage, step 1 tile freely into the enemy’s flank, and gain combat advantage.',
        9: 'Throat Check: Deal +3 bonus damage (or +4 bonus damage if attacking from stealth or flanking the target).',
        10: 'Dance of Knives: Deal +3 bonus damage to your target and strike a second adjacent enemy for 2 damage.',
        11: 'Arterial Bleed: Deal +4 bonus damage and inflict deep bleeding (the target takes 1 ongoing damage each turn until treated).',
        12: 'Phantom Slip: Deal +4 bonus damage and step up to 2 tiles through shadows without provoking enemy reactions.',
        13: 'Shadow Pierce: Deal +5 bonus damage, completely bypassing light armor and padding.',
        14: 'Twin Fang Flurry: Deal +5 bonus damage to the primary target and deal 2 damage to an ally’s engaged target.',
        15: 'Kidney Strike: Deal +6 bonus damage and heavily stagger the enemy, causing them to lose 1 Action Point (AP) next turn.',
        16: 'Shade Stride: Deal +6 bonus damage and immediately melt into stealth (+2 bonus to stealth checks).',
        17: 'Armor Puncture: Deal +7 bonus damage and strip 1 durability point off the target’s armor.',
        18: 'Nerve Sever: Deal +7 bonus damage and paralyze the enemy’s weapon arm for 1 round (they cannot attack with it).',
        19: 'Thousandfold Prick: Deal +8 bonus damage and immediately make a free follow-up dagger strike.',
        20: 'Master Assassin Strike: Deal +8 maximum critical damage with lethal precision from the shadows.'
    },
    greatsword: {
        1: 'Overbalanced Swing: The massive blade pulls you off-center. You fall Prone unless you spend 2 Action Points (AP) to steady yourself.',
        2: 'Wide Dragging Miss: You swing a wide arc that misses completely. You lose 1 Action Point (AP) recovering the heavy blade.',
        3: 'Deflected Great-Blade: The blade glances off heavy armor plating. Deal half normal weapon damage.',
        4: 'Driving Cut: A heavy, balanced cut with both hands. Deal full normal weapon damage.',
        5: 'Wide Sweeping Arc: Deal +1 bonus damage and push the target 1 tile backward.',
        6: 'Batter Through Guard: Deal +1 bonus damage and ignore any light physical cover the target is using.',
        7: 'Cleaving Stride: Deal +2 bonus damage, step 1 tile forward, and strike an adjacent enemy for 2 damage.',
        8: 'Heaving Execution: Deal +2 bonus damage and slam the heavy blade downward with enough force to knock the target Prone.',
        9: 'Colossus Arc: Deal +3 bonus damage and shove up to 2 enemies in front of you 1 tile backward.',
        10: 'Guard-Breaker: Deal +3 bonus damage and break through the enemy’s defensive parry stance.',
        11: 'Whirlwind Hew: Deal +4 bonus damage and cleave an adjacent foe for 2 damage.',
        12: 'Titan’s Stance: Deal +4 bonus damage, regain 1 Action Point (AP), and gain +1 Armor Class (AC) until next turn.',
        13: 'Avalanche Slash: Deal +5 bonus damage and knock the target 2 tiles backward.',
        14: 'Great Cleave: Deal +5 bonus damage to the main target and strike a secondary enemy for 3 damage.',
        15: 'Ground-Slam Cut: Deal +6 bonus damage and slam the target flat onto the ground (Prone).',
        16: 'Warmaster Stride: Deal +6 bonus damage and advance 2 tiles forward freely without provoking reactions.',
        17: 'Fortress Splitter: Deal +7 bonus damage and shatter 1 durability point on the target’s armor.',
        18: 'Reckoning Impact: Deal +7 bonus damage and stagger the enemy so they lose 1 Action Point (AP) next turn.',
        19: 'Endless Edge: Deal +8 bonus damage and make a free secondary slash at −2 to hit.',
        20: 'God-Cleaver Finale: Deal +8 maximum critical damage, shatter enemy guard, and knock them Prone.'
    },
    greataxe: {
        1: 'Buried Axe Head: The enormous axe head lodges deep into the ground. Spend 2 Action Points (AP) to yank it free.',
        2: 'Wild Chop Miss: An overhand swing crashes into empty space. You lose 1 Action Point (AP) regaining your stance.',
        3: 'Glancing Chop: The heavy axe skids across the target’s armor. Deal half normal weapon damage.',
        4: 'Hefted Cleave: A clean, brutal chop with the weight of the axe. Deal full normal weapon damage.',
        5: 'Raking Arc: Deal +1 bonus damage across the target’s chest.',
        6: 'Armor Split: Deal +1 bonus damage and crack 1 durability point on wooden shields or light armor.',
        7: 'Bonebreaker: Deal +2 bonus damage and halve the enemy’s movement speed on their next turn.',
        8: 'Executioner’s Arc: Deal +2 bonus damage and severely rattle the enemy (they lose 1 Action Point on their next turn).',
        9: 'Blood-Hew: Deal +3 bonus damage and inflict deep lacerations (the enemy takes 2 bleeding damage on their next turn).',
        10: 'Rending Whirl: Deal +3 bonus damage to the main target and cleave an adjacent foe for 2 damage.',
        11: 'Skull-Splitter: Deal +4 bonus damage and daze the target for 1 full round (they cannot take reactions).',
        12: 'Beast-Feller: Deal +4 bonus damage (or +6 bonus damage against large/monstrous creatures).',
        13: 'Carnage Arc: Deal +5 bonus damage, completely ignoring the Armor Class bonus of enemy shields.',
        14: 'Wide Cleave: Deal +5 bonus damage to your target and deal 3 damage to an adjacent enemy.',
        15: 'Earth-Cleaver: Deal +6 bonus damage and slam the enemy Prone on the ground.',
        16: 'Rampage Stride: Deal +6 bonus damage and advance 2 tiles forward freely.',
        17: 'Spine-Breaker: Deal +7 bonus damage and reduce the enemy’s armor durability by 1.',
        18: 'Headsman Impact: Deal +7 bonus damage and Stun the enemy for 1 full round.',
        19: 'Furious Flurry: Deal +8 bonus damage and immediately make a free secondary chop at −2 to hit.',
        20: 'Apex Execution: Deal +8 maximum critical damage, shatter the enemy’s shield, and knock them Prone.'
    },
    maul: {
        1: 'Ground Impact Vibration: The heavy warhammer slams into stone and vibrates violently. You lose 2 Action Points (AP) to recover.',
        2: 'Slow Swing Miss: The slow hammer swings wide. You lose 1 Action Point (AP) pulling it back.',
        3: 'Glancing Strike: The hammer head drags across armor plate without crushing. Deal half normal weapon damage.',
        4: 'Thudding Hit: A solid, crushing impact that dents armor. Deal full normal weapon damage.',
        5: 'Cratering Blow: Deal +1 bonus damage with crushing force.',
        6: 'Ring Their Bell: Deal +1 bonus damage and knock the enemy off-balance (they lose 1 Action Point on their next turn).',
        7: 'Stunning Smash: Deal +2 bonus damage and daze the enemy for 1 full round.',
        8: 'Pulverize: Deal +2 bonus damage, knock the enemy Prone on the ground, and push them 1 tile backward.',
        9: 'Earthquake Tap: Deal +3 bonus damage and knock the target 2 tiles backward.',
        10: 'Anvil of Ruin: Deal +3 bonus damage and crack 1 durability point off the enemy’s armor.',
        11: 'Colossus Hammer: Deal +4 bonus damage and prevent the target from taking reactions until your next turn.',
        12: 'Shatter-Spine: Deal +4 bonus damage and reduce the target’s movement speed by 2 tiles for 1 round.',
        13: 'Tectonic Strike: Deal +5 bonus damage, ignoring light physical armor resistance.',
        14: 'Sweeping Hammer: Deal +5 bonus damage and push an adjacent enemy 1 tile backward.',
        15: 'Iron Golem Slam: Deal +6 bonus damage and slam the target flat onto the ground (Prone).',
        16: 'Titan Stride: Deal +6 bonus damage and advance 2 tiles freely into the enemy’s space.',
        17: 'Fortress Breaker: Deal +7 bonus damage and destroy 1 durability point of the target’s armor.',
        18: 'Seismic Concussion: Deal +7 bonus damage and Stun the target for 1 full round (they lose all actions).',
        19: 'Double Sledge: Deal +8 bonus damage and make a free follow-up hammer strike at −2 to hit.',
        20: 'World-Crusher Critical: Deal +8 maximum critical damage, completely shatter enemy armor, and knock them Prone.'
    },
    polearm: {
        1: 'Entangled Spearhead: The spearhead catches on terrain or clothing. Spend 2 Action Points (AP) to disentangle it.',
        2: 'Overreaching Thrust: You thrust too far and miss. You lose 1 Action Point (AP) pulling back into guard.',
        3: 'Glancing Shaft: The spear point skids off a shield boss. Deal half normal weapon damage.',
        4: 'Set vs Advance: A clean, piercing thrust. Deal full normal weapon damage (+1 if the target moved toward you this turn).',
        5: 'Lever Pull / Push: Deal +1 bonus damage and either push or pull the target 1 tile.',
        6: 'Trip Arc: Deal +1 bonus damage and hook the enemy’s leg, knocking them off-balance.',
        7: 'Pin and Post: Deal +2 bonus damage and pin the enemy’s armor, reducing their movement speed by 2 tiles next turn.',
        8: 'Crow’s Beak Reposition: Deal +2 bonus damage, hook the target to reposition them 2 tiles, and step 1 tile into their space.',
        9: 'Vaulting Thrust: Deal +3 bonus damage and vault 1 tile behind the target to flank them.',
        10: 'Phalanx Sweep: Deal +3 bonus damage and push all enemies within your reach 1 tile backward.',
        11: 'Impaling Pierce: Deal +4 bonus damage and pin the target against a wall or obstacle for 1 round.',
        12: 'Dragon Piercer: Deal +4 bonus damage (+6 bonus damage against flying or mounted enemies).',
        13: 'Spearmaster Thrust: Deal +5 bonus damage, ignoring reach penalties against close targets.',
        14: 'Whirlwind Haft: Deal +5 bonus damage to your target and strike an adjacent foe with the shaft for 2 damage.',
        15: 'Zone of Denial: Deal +6 bonus damage and knock the target Prone on the ground.',
        16: 'Vanguard Stride: Deal +6 bonus damage and reposition 2 tiles freely along your reach.',
        17: 'Armor-Piercing Spike: Deal +7 bonus damage and degrade 1 point of the target’s armor durability.',
        18: 'Stunning Impale: Deal +7 bonus damage and heavily daze the target (they lose 1 Action Point next turn).',
        19: 'Twin Spear Thrust: Deal +8 bonus damage and make a free second thrust at −2 to hit.',
        20: 'Gungnir Precision: Deal +8 maximum critical damage — unstoppable piercing strike that shatters guard.'
    },
    staff: {
        1: 'Slipped Stance: The staff foot slips on the ground. You fall Prone unless you spend 2 Action Points (AP) to catch yourself.',
        2: 'Sweeping Miss: You sweep wide and miss the enemy. You lose 1 Action Point (AP) recovering your center of gravity.',
        3: 'Glancing Parry: The staff is parried by the enemy’s weapon. Deal half normal weapon damage.',
        4: 'Quick Rap: A clean, swift strike with the tip or haft of the staff. Deal full normal weapon damage.',
        5: 'Low Sweep: Deal +1 bonus damage and sweep at the enemy’s feet, giving them a −1 penalty to their next attack roll.',
        6: 'Disarm Flick: Deal +1 bonus damage and flick the staff tip to knock a held small item or weapon from the enemy’s hand.',
        7: 'Trip & Step: Deal +2 bonus damage, knock the enemy Prone on the ground, and take a free 1-tile tactical step.',
        8: 'Whirling Stave: Deal +2 bonus damage, strike a second adjacent enemy with the opposite end for half damage, and step 1 tile.',
        9: 'Channeling Strike: Deal +3 bonus damage and channel ambient energy through the stave to restore 1 Mana/Charge.',
        10: 'Staff of Winds: Deal +3 bonus damage and spin the staff defensively, gaining +1 Armor Class (AC) until your next turn.',
        11: 'Arcane Resonator: Deal +4 bonus damage and push the target 2 tiles backward with kinetic vibration.',
        12: 'Monk’s Flurry: Deal +4 bonus damage across two rapid staves, dazing the enemy so they cannot take reactions.',
        13: 'Mystic Vortex: Deal +5 bonus damage and use the stave’s draft to pull the target 1 tile closer.',
        14: 'Sweeping Cadence: Deal +5 bonus damage to your target and strike an adjacent foe for 2 damage.',
        15: 'Grandmaster Sweep: Deal +6 bonus damage and slam the target flat onto the ground (Prone).',
        16: 'Aether Stride: Deal +6 bonus damage and move up to 2 tiles freely without provoking opportunity attacks.',
        17: 'Spiritual Impact: Deal +7 bonus damage and crack 1 point of the enemy’s armor durability.',
        18: 'Stunning Rap: Deal +7 bonus damage and Stun the enemy for 1 full round (they lose all actions).',
        19: 'Endless Staves: Deal +8 bonus damage and immediately make a free follow-up strike at −2 to hit.',
        20: 'Staff Apotheosis: Deal +8 maximum critical damage — pure martial balance knocks the target Prone and breaks guard.'
    },
    bow: {
        1: 'Frayed Bowstring: The bowstring snags or frays. You must spend 2 Action Points (AP) to clear and ready your next shot.',
        2: 'Wind Drift Miss: The arrow is blown off course and misses completely. You lose 1 Action Point (AP).',
        3: 'Grazing Arrow: The arrow grazes off the enemy’s armor or shield boss. Deal half normal weapon damage.',
        4: 'Clean Arced Shot: A solid arrow strike directly to the target’s torso. Deal full normal weapon damage.',
        5: 'Pinning Arrow: Deal +1 bonus damage and pin the enemy’s cloak or foot, reducing their movement speed by 1 tile next turn.',
        6: 'Seam Seeker: Deal +1 bonus damage and ignore any light physical cover the target is hiding behind.',
        7: 'Marked Target: Deal +2 bonus damage and mark the enemy, granting the next ally who attacks them a +1 bonus to hit.',
        8: 'Twin Release: Deal +2 bonus damage and fire a second arrow simultaneously at the same target for half damage.',
        9: 'Heartseeker: Deal +3 bonus damage and cause bleeding (the enemy takes 1 ongoing damage on their next turn).',
        10: 'Rain of Arrows: Deal +3 bonus damage to the primary target and splash 2 damage onto an enemy standing next to them.',
        11: 'Armor-Piercer Bodkin: Deal +4 bonus damage and bypass 1 point of the enemy’s armor durability.',
        12: 'Windlord Volley: Deal +4 bonus damage, take a free 1-tile tactical step, and ready your next arrow for free (saving 1 AP).',
        13: 'Eagle Eye Snipe: Deal +5 bonus damage and shoot with full accuracy regardless of long range penalties.',
        14: 'Split Shot: Deal +5 bonus damage to the main target and hit a secondary target within line of sight for 2 damage.',
        15: 'Pinning Barrage: Deal +6 bonus damage and pin the target firmly to the floor (their movement speed is 0 for 1 round).',
        16: 'Skirmisher Stride: Deal +6 bonus damage and reposition up to 2 tiles freely away from enemies.',
        17: 'Heavy Bodkin: Deal +7 bonus damage and reduce the enemy’s armor durability by 1.',
        18: 'Crippling Arrow: Deal +7 bonus damage and strike a nerve cluster, causing the target to lose 1 Action Point (AP) next turn.',
        19: 'Triple Volley: Deal +8 bonus damage and immediately fire a free follow-up arrow at −2 to hit.',
        20: 'Apollo’s Precision: Deal +8 maximum critical damage — an unerring fatal shot that pierces all enemy defenses.'
    },
    crossbow: {
        1: 'Jammed Latch: The crossbow mechanism jams upon release. You must spend 2 Action Points (AP) to clear and reset the crank.',
        2: 'Bolt Skitters Wide: The bolt skitters off a surface and misses. You lose 1 Action Point (AP) resetting your stance.',
        3: 'Deflected Bolt: The bolt bounces off heavy armor plate. Deal half normal weapon damage.',
        4: 'Solid Bolt: A direct, heavy bolt impact. Deal full normal weapon damage.',
        5: 'Pinned Limb: Deal +1 bonus damage and pin the enemy’s arm, giving them a −1 penalty to their next action.',
        6: 'Punch-Through: Deal +1 bonus damage and penetrate straight through light physical cover.',
        7: 'Rattling Impact: Deal +2 bonus damage and rattle the target’s frame, causing them to lose 1 Action Point (AP) on their next turn.',
        8: 'Snap Recoil Reload: Deal +2 bonus damage, reload your crossbow immediately for free (saving 1 AP), and gain +1 damage on your next shot.',
        9: 'Heavy Penetrator: Deal +3 bonus damage and knock the target 1 tile backward.',
        10: 'Double Quarrel: Deal +3 bonus damage to the main target and pierce through to hit an enemy directly behind them for 2 damage.',
        11: 'Arbalest Siege Bolt: Deal +4 bonus damage and crack 1 point of durability off the enemy’s shield or armor.',
        12: 'Sniper Mark: Deal +4 bonus damage (or +6 bonus damage if firing from an elevated high-ground position).',
        13: 'Steel Harpoon: Deal +5 bonus damage and anchor the target to the terrain (movement speed is 0 for 1 round).',
        14: 'Repeater Burst: Deal +5 bonus damage split across two separate targets within line of sight.',
        15: 'Concussive Bolt: Deal +6 bonus damage and slam the target flat onto the ground (Prone).',
        16: 'Mechanist Stride: Deal +6 bonus damage, step 1 tile freely, and reload your crossbow without spending AP.',
        17: 'Armor-Buster Quarrel: Deal +7 bonus damage and strip 1 durability point from the target’s armor.',
        18: 'Paralyzing Quarry: Deal +7 bonus damage and Stun the target for 1 full round.',
        19: 'Rapid Arbalest: Deal +8 bonus damage and fire a free secondary bolt at −2 to hit.',
        20: 'Master Siege Bolt: Deal +8 maximum critical damage — mechanical devastation that pierces all armor and knocks target Prone.'
    },
    thrown: {
        1: 'Fumbled Release: The weapon slips awkwardly from your fingers and drops at your feet. You lose 2 Action Points (AP).',
        2: 'Wild Throw Miss: The thrown weapon sails wide over the target. You lose 1 Action Point (AP).',
        3: 'Grazing Toss: The weapon grazes the edge of a shield without sticking. Deal half normal weapon damage.',
        4: 'Solid Throw: A clean, direct hit from a thrown blade, axe, or javelin. Deal full normal weapon damage.',
        5: 'Pin Cloak: Deal +1 bonus damage and pin the enemy’s cloak to the ground, reducing their movement speed by 1 tile next turn.',
        6: 'Gouging Strike: Deal +1 bonus damage and distract the enemy, giving them a −1 penalty to their next attack roll.',
        7: 'Crippling Toss: Deal +2 bonus damage and cause bleeding (the enemy takes 1 ongoing damage on their next turn).',
        8: 'Bullseye & Retrieve: Deal +2 bonus damage and immediately retrieve your thrown weapon from the enemy as part of the action.',
        9: 'Blade Return: Deal +3 bonus damage and catch your weapon as it rebounds directly back into your hand.',
        10: 'Chain Ricochet: Deal +3 bonus damage to the primary target and ricochet the weapon into a nearby secondary foe for 2 damage.',
        11: 'Puncturing Toss: Deal +4 bonus damage and penetrate straight through light physical cover.',
        12: 'Fan of Blades: Deal +4 bonus damage split across two adjacent enemies.',
        13: 'Shadow Boomerang: Deal +5 bonus damage and cleanly catch the weapon on its return path.',
        14: 'Double Toss: Deal +5 bonus damage hitting two separate targets within range.',
        15: 'Impact Toss: Deal +6 bonus damage with heavy kinetic impact, knocking the target Prone.',
        16: 'Blink Toss: Deal +6 bonus damage and step up to 2 tiles closer to the target without provoking opportunity attacks.',
        17: 'Armor-Spike Toss: Deal +7 bonus damage and degrade 1 point of the enemy’s armor durability.',
        18: 'Stunning Strike: Deal +7 bonus damage and heavily daze the target (they lose 1 Action Point next turn).',
        19: 'Rapid Flurry: Deal +8 bonus damage and immediately make a free second throw at −2 to hit.',
        20: 'Apex Bullseye: Deal +8 maximum critical damage — weapon returns to your hand with deadly pinpoint accuracy.'
    },
    wand: {
        1: 'Mana Sputter: The wand backfires with harmless smoke. You lose 1 Mana/Charge and 2 Action Points (AP) resetting your focus.',
        2: 'Fizzling Spark: An arcane spark flies wide and fizzles out. You lose 1 Action Point (AP).',
        3: 'Deflected Dart: The magic missile is deflected by the enemy’s armor or wards. Deal half normal weapon damage.',
        4: 'Arcane Dart: A clean, focused bolt of magic energy. Deal full normal weapon damage.',
        5: 'Channel Mana: Deal +1 bonus damage, or choose to deal normal damage and restore 1 Mana/Charge to yourself.',
        6: 'Spell Lash: Deal +1 bonus damage and disrupt the enemy’s concentration, giving them a −1 penalty to their next attack or spell roll.',
        7: 'Force Pulse: Deal +2 bonus damage and push the target 1 tile backward with kinetic force.',
        8: 'Overchannel: Deal +2 bonus damage and choose either to push the target 2 tiles backward or restore 1 Mana/Charge.',
        9: 'Arcane Vortex: Deal +3 bonus damage, restore 1 Mana to yourself, and pull the target 1 tile closer.',
        10: 'Supernova Ray: Deal +3 bonus damage and blind the enemy with radiant flash (−1 penalty to their attack rolls for 1 round).',
        11: 'Cataclysmic Surge: Deal +4 bonus damage and push the target 2 tiles backward.',
        12: 'Archmage Beam: Deal +4 bonus damage, restore 1 Mana, and silence the target so they cannot cast verbal spells for 1 round.',
        13: 'Mana Singularity: Deal +5 bonus damage and restore 1 Mana to an ally within 3 tiles of you.',
        14: 'Prismatic Burst: Deal +5 bonus damage to the main target and splash 2 arcane damage onto an adjacent foe.',
        15: 'Force Wave: Deal +6 bonus damage and knock the target flat onto the ground (Prone).',
        16: 'Aether Blink: Deal +6 bonus damage and teleport up to 2 tiles freely into an unoccupied space.',
        17: 'Starfire Beam: Deal +7 bonus damage and melt 1 durability point off the enemy’s armor.',
        18: 'Mana Shock: Deal +7 bonus damage and shock the enemy’s mind, causing them to lose 1 Action Point (AP) next turn.',
        19: 'Archon Flurry: Deal +8 bonus damage and immediately cast a free cantrip or basic magic attack at −2 to hit.',
        20: 'Genesis Arcana: Deal +8 maximum critical damage — restores 2 Mana to caster, shatters guard, and knocks target Prone.'
    },
    unarmed: {
        1: 'Overextended Swing: You overextend on a wild punch. You lose 2 Action Points (AP) pulling back into guard.',
        2: 'Punch Misses Wide: Your fist swings through empty air. You lose 1 Action Point (AP) recovering your stance.',
        3: 'Glancing Strike: Your strike glances off the enemy’s raised forearm or armor padding. Deal half normal weapon damage.',
        4: 'Solid Hit: A crisp, well-placed punch or palm strike. Deal full normal weapon damage.',
        5: 'Counter Palm: Deal +1 bonus damage and shove the target 1 tile backward with a palm thrust.',
        6: 'Elbow Check: Deal +1 bonus damage and drive an elbow into the enemy, giving them a −1 penalty to their next attack roll.',
        7: 'Leg Sweep: Deal +2 bonus damage, sweep the enemy’s footing, and knock them flat onto the ground (Prone).',
        8: 'Open-Hand Finale: Deal +2 bonus damage and take a free 1-tile tactical step into a flanking position.',
        9: 'Pressure Point: Deal +3 bonus damage and strike a nerve cluster, paralyzing the target’s limb for 1 round.',
        10: 'Dragon Kick: Deal +3 bonus damage and send the target flying 2 tiles backward.',
        11: 'Iron Body Counter: Deal +4 bonus damage and brace your stance, gaining +1 Armor Class (AC) until your next turn.',
        12: 'Fist Flurry: Deal +4 bonus damage across two lightning strikes, dazing the enemy so they cannot take reactions.',
        13: 'Ki Blast: Deal +5 bonus damage with an explosive wave of kinetic energy across a 2-tile line.',
        14: 'Double Palm: Deal +5 bonus damage to your target and strike an adjacent foe for 2 damage.',
        15: 'Earth Stomp: Deal +6 bonus damage and stomp the floor with enough force to knock all adjacent enemies Prone.',
        16: 'Tiger Stride: Deal +6 bonus damage and reposition up to 2 tiles freely without provoking opportunity attacks.',
        17: 'Dim Mak Strike: Deal +7 bonus damage and degrade 1 point of the enemy’s armor durability.',
        18: 'Stunning Palm: Deal +7 bonus damage and Stun the enemy for 1 full round (they lose all actions).',
        19: 'Hundred Fists: Deal +8 bonus damage and immediately make a free follow-up strike at −2 to hit.',
        20: 'God-Hand Apotheosis: Deal +8 maximum critical damage — pure martial mastery shatters enemy guard and knocks them Prone.'
    }
};

/**
 * Every weapon type in the game maps onto one of the archetypes above.
 * Instruments channel magic (→ wand) except the drum (→ mace).
 */
export const WEAPON_SIMPLE_TABLE_MAP = {
    // One-Handed
    sword: 'sword',
    rapier: 'sword',
    katana: 'sword',
    saber: 'sword',
    axe: 'axe',
    mace: 'mace',
    'war mace': 'mace',
    flail: 'mace',
    dagger: 'dagger',
    sickle: 'dagger',
    'parrying dagger': 'dagger',
    'off hand blade': 'dagger',
    shuriken: 'dagger',
    'fist weapon': 'unarmed',
    // Two-Handed
    greatsword: 'greatsword',
    'double sided sword': 'greatsword',
    greataxe: 'greataxe',
    maul: 'maul',
    polearm: 'polearm',
    halberd: 'polearm',
    scythe: 'polearm',
    'jousting spear': 'polearm',
    staff: 'staff',
    // Ranged
    bow: 'bow',
    crossbow: 'crossbow',
    thrown: 'thrown',
    dart: 'thrown',
    sling: 'thrown',
    boomerang: 'thrown',
    chakram: 'thrown',
    blowgun: 'thrown',
    wand: 'wand',
    // Instruments
    harp: 'wand',
    lute: 'wand',
    flute: 'wand',
    horn: 'wand',
    violin: 'wand',
    guitar: 'wand',
    drum: 'mace',
    // Special
    unarmed: 'unarmed'
};

/** Resolve the archetype key for any weapon type (falls back to 'sword'). */
export function getWeaponArchetype(weaponKey) {
    return WEAPON_SIMPLE_TABLE_MAP[weaponKey] || 'sword';
}

/** Resolve the d8 flavor table for a weapon type (Standard Rules). */
export function getWeaponSimpleTable(weaponKey) {
    return WEAPON_TYPE_SIMPLE_TABLES[getWeaponArchetype(weaponKey)] || WEAPON_TYPE_SIMPLE_TABLES.sword;
}
