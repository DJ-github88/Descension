/**
 * Formbender Class Data
 * 
 * Complete class information for the Formbender - a shapeshifter who harnesses
 * primal forms through the Wild Instinct resource system.
 */

export const FORMBENDER_DATA = {
  id: 'formbender',
  name: 'Formbender',
  icon: 'fas fa-paw',
  role: 'Hybrid (Tank/Damage/Support)',
  damageTypes: ['nature', 'bludgeoning'],

  // Overview section
  overview: {
    title: 'The Formbender',
    subtitle: 'Master of Wild Instinct and Primal Transformation',
    
    quickOverview: {
      title: 'Quick Overview',
      content: `**TL;DR**: The Formbender is a shapeshifting combatant who switches between four animal forms to adapt to any situation. Wild Instinct (0-15) fuels your transformations and abilities. First transform is free; every switch after costs 1 WI. Forms last until you switch, get knocked out, or choose to revert.

**What You Need to Know**: The Formbender channels primal energy through four distinct animal forms—Nightstalker (stealth/burst), Ironhide (tank/durability), Skyhunter (mobility/aerial), and Frostfang (pack tactics)—gathering Wild Instinct (0-15) through form-specific actions. Switch forms mid-combat to adapt to any situation, spending Wild Instinct on devastating abilities or transformation costs. Your first transformation is free; everything after has a price.

**Core Mechanic**: Choose opening form (free) → Perform form-specific actions to generate Wild Instinct → Spend on abilities or form switches (1 WI each) → Chain forms together to adapt to the fight

**Resource**: Wild Instinct (0-15 scale, generated through form-aligned combat actions). Organized in three bands:
- **Instinct (1-5 WI)**: Form abilities and basic spells
- **Surge (6-10 WI)**: Powerful class spells
- **Apex (11-15 WI)**: Ultimate spells

**Form-Matched Discount**: Casting a spell that matches your current form's theme reduces its Wild Instinct cost by 1 (min 1). This is your core efficiency loop—stay in the form that matches the spells you want to cast.

**Playstyle**: Adaptive shapeshifter with fluid role-switching mid-combat

**Best For**: Players who enjoy tactical flexibility, mastering multiple combat styles, and the satisfaction of transforming to perfectly counter any battlefield situation`
    },
    
    description: `A versatile shapeshifter channeling primal energy through four wild forms—Nightstalker, Ironhide, Skyhunter, and Frostfang—gathering Wild Instinct to unleash devastating adaptive abilities.`,
    
    roleplayIdentity: {
      title: 'Roleplay Identity',
      content: `**TL;DR**: You are not a person who turns into animals—you are an animal who learned to wear a human shape. Every transformation strips away another layer of civilization.

**Primal Identity**: Formbenders don't just channel nature; they *become* it. The question every Formbender faces: when you run with the wolf pack, do you remember you were ever human? Your connection to the wild is not learned—it is remembered.

**Adaptive Warriors**: Unlike traditional spellcasters, Formbenders are physical combatants who shift their form to match the needs of battle. They are scouts, guardians, hunters, and pack leaders—all in one.

**Nature's Champions**: Formbenders serve as protectors of the wild, defending natural places from corruption and civilization's encroachment. Their connection to primal forces makes them formidable allies and terrifying enemies.`
    },
    
    combatRole: {
      title: 'Combat Role',
      content: `**TL;DR**: Your role changes based on your form. Nightstalker = stealth/burst. Ironhide = tank. Skyhunter = mobile/aerial. Frostfang = pack tactics. Switch forms to match the fight.

**Adaptive Hybrid**: The Formbender's role changes based on their active form. Nightstalker excels at stealth and burst damage, Ironhide serves as a durable tank, Skyhunter provides mobility and aerial control, and Frostfang offers pack tactics and sustained damage.

**Resource Management**: Success as a Formbender requires careful Wild Instinct management—knowing when to gather, when to spend, and when to switch forms. Each form generates Wild Instinct differently, rewarding players who embrace each form's unique playstyle.

**Form Synergy**: Skilled Formbenders chain forms together, using one form to generate Wild Instinct and another to spend it. This creates dynamic combat patterns where no two fights play out the same way.`
    },
    
    playstyle: {
      title: 'Playstyle',
      content: `**TL;DR**: Pick your opening form for free. Generate WI through form actions. Switch forms for 1 WI to adapt. All spells work in all forms, but matching your spell to your form saves 1 WI.

**Fluid Transformation**: Combat begins with choosing your opening form for free, then adapting as the battle evolves. Switching forms costs 1 Wild Instinct, so planning your transformations is crucial.

**Form-Specific Actions**: Each form has unique ways to generate Wild Instinct:
- **Nightstalker**: Stealth, ambushes, and precision strikes
- **Ironhide**: Taunting, tanking damage, and protecting allies
- **Skyhunter**: Scouting, aerial attacks, and enhanced perception
- **Frostfang**: Tracking, pack tactics, and coordinated strikes

**Escalating Power**: Wild Instinct abilities scale across three bands—Instinct (1-5 WI), Surge (6-10 WI), and Apex (11-15 WI)—allowing you to choose between frequent small boosts or saving for devastating ultimate abilities.`
    },

    immersiveCombatExample: {
      title: 'Combat Example: The Shapeshifter\'s Dance',
      content: `**TL;DR**: Nightstalker ambush (free) → Ironhide tank (1 WI switch) → Roaring Assault (5 WI spend) → Skyhunter pursuit (1 WI switch). Generate WI in each form, spend on abilities. The lesson: switch forms to match the moment, and always bank WI for emergencies.

**The Setup**: You're a Formbender ambushing a group of bandits (3 bandits + 1 bandit leader) in a forest. Your party's fighter and mage are with you. Starting Wild Instinct: 4 (banked from a previous encounter, halved between fights). Your goal: Protect your mage, eliminate threats, and adapt to the changing battle.

**Starting State**: Wild Instinct: 4/15 | HP: 75/75 | Form: Human (not transformed)

---

**Turn 1 - Opening Ambush (WI: 4 → 6, Form: Human → Nightstalker)**

*You crouch in the shadows, watching the bandits make camp. Time to strike.*

**Free (0 AP)**: Transform into Nightstalker form (FREE - first transformation of combat)
**Effect**: Your body shrinks, muscles coiling like a panther. Black fur ripples across your skin. Your eyes glow yellow. You gain advantage on stealth checks and ambush attacks.

**Your Action**: Ambush Strike on Bandit #1 (spend 3 WI for Tier 3: 3d6 damage + Stun)
**Attack Roll**: d20+6 (advantage from stealth) → [14] = Hit!
**Damage**: 3d6 → [5, 4, 6] = 15 damage + target Stunned for 1 round
**WI Spent**: 3 WI
**Result**: Bandit #1 STUNNED at 0 HP (bandits have 15 HP each)

*You leap from the shadows, claws extended. The bandit crumples, stunned. The primal energy surges through you.*

**Wild Instinct**: 4 - 3 = **1 WI**
**Current Form**: Nightstalker (stealth, burst damage)

**Bandit #2's Turn**: Attacks your fighter → 8 damage
**Bandit #3's Turn**: Attacks your fighter → 6 damage
**Bandit Leader's Turn**: Attacks your fighter → 12 damage

---

**Turn 2 - Mistake & Recovery (WI: 1 → 1, Form: Nightstalker → Ironhide)**

*The bandits are focused on your fighter. Your mage is exposed. Time to tank—but you're almost out of WI. You'll need to generate more in Ironhide form.*

**Your Action**: Transform into Ironhide form (costs 1 WI)
**Wild Instinct**: 1 - 1 = **0 WI** ⚠️
**Ironhide Passive**: +20 max HP (75 → 95). Your current HP heals to 95.

*Your body EXPLODES in size. Fur becomes thick hide. You're a BEAR now. You roar, positioning yourself between the bandits and your mage.*

**WI at 0**: You're now at 0 WI in a transformed state. If you hit 0 WI again while transformed, you'll suffer Primal Exhaustion. You need to generate WI this turn.

**Your Action**: Taunt all enemies toward you (form-specific action)
**Effect**: All bandits must attack you instead of allies
**WI Generated**: +1 WI per enemy that attacks you this round

**Bandit #1's Turn**: Still stunned—skips turn
**Bandit #2's Turn**: Attacks you → Hit! 2d6+3 → 10 damage (reduced to 8 by 25% physical resistance). +1 WI from being attacked.
**Bandit #3's Turn**: Attacks you → Hit! 2d6+3 → 8 damage (reduced to 6). +1 WI from being attacked.
**Bandit Leader's Turn**: Attacks you → Hit! 3d6+4 → 16 damage (reduced to 12). +1 WI from being attacked.

**Total Damage Taken**: 8 + 6 + 12 = 26 damage
**Your HP**: 95 - 26 = **69/95**

**Wild Instinct**: 0 + 3 = **3 WI** (generated from 3 enemies attacking you)

*The bandits' weapons bounce off your thick hide. You barely feel it. This is what Ironhide form is FOR.*

**Current State**: WI: 3/15 | HP: 69/95 | Form: Ironhide

---

**Turn 3 - Spending Wild Instinct (WI: 3 → 0, Form: Ironhide)**

*You're at 3 WI—not enough for a Tier 5 Roaring Assault (5 WI). You need to spend a lower tier or wait. The bandit leader is still dangerous. You choose Tier 3.*

**Your Action**: Roaring Assault, Tier 3 (spend 3 WI: 3d8 force damage + knock back 10 ft)
**Saving Throw**: Bandits make Con save DC 14
- Bandit #1: Fails → takes full 3d8 = 16 damage. DEAD (was at 0 HP, stunned).
- Bandit #2: Fails → takes 16 damage, knocked back 10 ft. DEAD (was at ~1 HP).
- Bandit #3: Succeeds → takes half = 8 damage. Knocked back 10 ft. Surviving.
- Bandit Leader: Succeeds → takes half = 8 damage. Knocked back 10 ft.

**Wild Instinct**: 3 - 3 = **0 WI** ⚠️ (again—but you generated 3 WI from attacks last turn, so no Exhaustion triggers from spending)

*You rear up and SLAM the ground. The shockwave sends two bandits flying. The leader staggers but stays standing.*

**Current State**: WI: 0/15 | HP: 69/95 | Form: Ironhide

**Bandit #3's Turn**: Charges back → Attacks you → 7 damage (reduced to 5). +1 WI.
**Bandit Leader's Turn**: Charges back → Attacks you → 14 damage (reduced to 11). +1 WI.

**End of Turn**: +2 WI from being attacked.
**Wild Instinct**: 0 + 2 = **2 WI**

---

**Turn 4 - Aerial Pursuit (WI: 2 → 3, Form: Ironhide → Skyhunter)**

*The leader is wounded and trying to flee. Bandit #3 is nearly dead. Time to finish this.*

**Your Action**: Transform into Skyhunter form (costs 1 WI)
**Wild Instinct**: 2 - 1 = **1 WI**
**Ironhide Exit**: Your max HP drops from 95 to 75. Your current HP is adjusted to 69 - 20 = 49/75.

*Your massive bear form SHRINKS. Wings erupt from your back. You're an EAGLE now—a massive raptor with razor talons. You take flight.*

**Your Action**: Talon Dive on Bandit Leader (spend 1 WI for Tier 1: 1d6 damage)
**Attack Roll**: d20+6 (advantage from dive) → [17] = Hit!
**Damage**: 1d6 → [5] = 5 slashing damage
**WI Generated**: +2 WI (Dive Attack - form-specific action, generated on hit)
**Wild Instinct**: 1 - 1 + 2 = **2 WI**

*You dive from 50 feet up, talons extended. Your talons pierce his shoulder. He falls.*

**Bandit Leader**: ~30 HP - 5 damage = 25 HP remaining. Not dead—the Tier 1 Dive wasn't enough.

*You curse yourself. You should have saved more WI for a bigger dive. But the form switch was the right call for mobility.*

**Current State**: WI: 2/15 | HP: 49/75 | Form: Skyhunter

---

**Turn 5 - The Finish (WI: 2 → 4, Form: Skyhunter)**

*The leader is running. Bandit #3 is crawling away. Your fighter finishes off Bandit #3. You focus on the leader.*

**Your Action**: Talon Dive on Bandit Leader again (spend 2 WI for Tier 2: 2d6 damage + Grapple)
**Attack Roll**: d20+6 → [13] = Hit!
**Damage**: 2d6 → [4, 5] = 9 slashing damage + Grappled
**WI Generated**: +2 WI (Dive Attack, generated on hit)
**Wild Instinct**: 2 - 2 + 2 = **2 WI**

*You dive again, this time grabbing him with your talons. He's grappled—can't move, can't flee.*

**Your fighter's Turn**: Attacks the grappled leader → 18 damage. DEAD.

**Combat Over**

*You land gracefully, wings folding. Your party stares at you—you've been three different animals in five turns. You shift back to human form, breathing heavily.*

**Your Party's Fighter**: "That was... incredible. You were a panther, then a bear, then an eagle."
**You**: "Formbender. I'm whatever the situation needs me to be."
**Your Party's Mage**: "Thanks for tanking those hits. I would've died."
**You**: "That's what Ironhide form is for. Nightstalker for ambush, Ironhide for tanking, Skyhunter for mobility. Each form has a purpose."

**Final State**: WI: 2/15 (halves to 1 between fights) | HP: 49/75

---

**The Lesson**: Formbender gameplay is about:
1. **Free First Transform**: Started combat with free Nightstalker transformation (no WI cost)
2. **Resource Tension**: Dropped to 0 WI on Turn 2—a dangerous position. Had to rely on Ironhide's taunt generation to recover.
3. **Form-Specific Generation**: Generated WI by being attacked in Ironhide (+1 per enemy), and by hitting Dive Attacks in Skyhunter (+2 per hit)
4. **Mistakes Are Costly**: Spent too much WI on Turn 1 (3 WI on Ambush Strike Tier 3), leaving only 1 WI for the Ironhide switch. A Tier 1 or 2 Ambush (1-2 WI) would have left more cushion.
5. **Adaptation Over Perfection**: The Skyhunter Dive on Turn 4 only dealt 5 damage because only 1 WI was available. But the mobility was worth it—staying in Ironhide would have let the leader escape.
6. **WI Banking**: Start fights with as much WI as possible. Ended this fight with only 2 WI (1 after decay). The next fight will start with less resources.
7. **The Golden Rule**: Generate WI in one form, spend it in another. Ironhide generates through tanking. Skyhunter generates through diving. Nightstalker generates through ambushing. Pick the form that matches what the fight needs.`
    }
  },

  // Resource System
  resourceSystem: {
    title: 'Wild Instinct (WI)',
    subtitle: 'The Rhythm of the Shapeshifter',

    description: `The Formbender is a master of adaptation, channeling primal energy through four animal forms. Your core resource is **Wild Instinct** (0-15), which fuels your transformations and form-specific maneuvers. Unlike static casters, you are a fluid duelist—generating energy in one form to spend it in another.`,

    cards: [
      {
        title: 'Wild Instinct (WI)',
        stats: '0-15 Capacity',
        details: 'Fuels transformations and abilities. Halves (rounded down) between combats as your bloodlust cools.'
      },
      {
        title: 'The Four Forms',
        stats: 'Night, Iron, Sky, Frost',
        details: 'Each form has unique passives and generation methods. Your first transformation in combat is always free.'
      },
      {
        title: 'Form-Matched Spells',
        stats: '-1 WI Cost',
        details: 'Casting a spell that matches your current form reduces its Wild Instinct cost by 1 (min 1).'
      }
    ],

    generationTable: {
      headers: ['Action', 'Form Required', 'WI Change', 'Notes'],
      rows: [
        ['Opening Shift', 'Human', 'FREE', 'First transform of combat only. If you start a fight already transformed, no free shift.'],
        ['Standard Shift', 'Any', '-1 WI', 'Switching from one form to another'],
        ['Ambush from Stealth', 'Nightstalker', '+2 WI', 'Must attack from stealth or surprise. Generates WI on hit.'],
        ['Taunt/Tanking', 'Ironhide', '+1 WI per enemy', 'Each enemy that attacks you this round generates +1 WI (max +3 per round).'],
        ['Protecting an Ally', 'Ironhide', '+2 WI', 'Take an attack meant for an adjacent ally (reaction).'],
        ['Dive Attack', 'Skyhunter', '+2 WI', 'Attack from above while flying. Generates WI on hit.'],
        ['Scout/Recon', 'Skyhunter', '+1 WI', 'Spend an action to survey the battlefield from above.'],
        ['Pack Tactics Attack', 'Frostfang', '+2 WI', 'Attack the same target as an ally. Generates WI on hit.'],
        ['Tracking', 'Frostfang', '+1 WI', 'Spend an action to track a creature or detect hidden enemies.'],
        ['Savage Rend', 'Any Form', '+1 WI', 'Basic melee attack that tears with claws/fangs. Generates WI on hit.']
      ]
    },

    usage: {
      momentum: 'Each form is a tool. Start in Nightstalker for an ambush (+2 WI), then switch to Ironhide (-1 WI) to tank the counter-attack, generating more WI as you are hit.',
      flourish: '⚠️ Revert Clause: If you are knocked to 0 HP, you auto-revert to human form and lose all current WI. Stay in Ironhide (+20 max HP) if you are close to death.'
    },

    overheatRules: {
      title: 'Primal Exhaustion',
      content: `Shapeshifting puts extreme strain on the mortal frame.

**The Trigger**: If you hit 0 WI while in a transformation, OR if you are reduced to 0 HP (which auto-reverts you to Human form and empties your WI to 0).

**The Effect**: You suffer **Primal Exhaustion**. You are Stunned for 1 turn and cannot transform again until you spend a full Action "Centering" yourself.

**Stacking**: If you are reduced to 0 HP while already at 0 WI, you suffer Primal Exhaustion as normal—there is no double penalty, but the recovery requirements remain the same.

**The Guardrail**: Always keep at least 1 WI banked to ensure you can safely shift or revert without exhausting your spirit.`
    },

    strategicConsiderations: {
      title: 'Chaining the Wild',
      content: `**Metamorph Spec**: You can merge two forms (e.g., Nightstalker + Skyhunter). This costs 2 WI but allows you to generate WI from *both* forms simultaneously.

**Persistence**: Since WI halves between fights, try to end a combat at 10-12 WI. This ensures you start the next fight with 5-6 WI, allowing for immediate high-tier maneuvers.`
    },

    playingInPerson: {
      title: 'Playing in Person',
      subtitle: 'The Transformation Cards',
      content: `Shapeshifting should feel physical. Use these hacks to track your forms:

**Required Materials**:
- **15 Green Tokens**: (Representing Wild Instinct).
- **4 Form Cards**: Large index cards with form art and stats.
- **4 Distinct Minis**: (Cat, Bear, Bird, Wolf).

**The Physical Hack (Friction Points)**:
- **The Active Card**: Place your current Form Card on top of your character sheet. When you transform, physically swap the card and the miniature. This clarifies your active passives for the whole table.
- **The Instinct Pile**: Use a small bowl for WI tokens. When you "Ambush" or "Taunt," pull the tokens from the bowl. The size of your "Primal Pile" shows everyone how much "Apex" power you are holding.
- **The Decay Check**: At the end of combat, simply put half your tokens back in the bowl. No math needed—just grab half the pile and drop it.

**Pro Tip**: Use different colored dice for your attacks in each form. Brown dice for Ironhide, Purple for Nightstalker. It helps you remember which bonuses are currently active.`
    }
  },
  
  // Specializations
  specializations: {
    title: 'Formbender Specializations',
    subtitle: 'Three Paths of Transformation Mastery',

    description: `**TL;DR**: Metamorph merges two forms into hybrids. Form Thief steals shapes from slain enemies. Primordial replaces animal forms with elemental ones. Each changes how you shapeshift entirely.

Formbenders can specialize in radically different transformation philosophies. Metamorphs create chimeric hybrid forms, Form Thieves steal and mimic the forms of their enemies, and Primordials channel ancient elemental transformations. Each path offers a completely unique approach to shapeshifting.`,

    passiveAbility: {
      name: 'Primal Attunement',
      description: 'All Formbenders can transform into their four base forms (Nightstalker, Ironhide, Skyhunter, Frostfang) and generate Wild Instinct through form-specific actions. The first transformation each combat is free.'
    },

    specs: [
      {
        id: 'metamorph',
        name: 'Metamorph',
        icon: 'Nature/Ethereal Bird',
        color: '#9932CC',
        theme: 'Chimeric Hybrid Forms & Adaptive Evolution',

        description: `Metamorphs transcend single forms, creating chimeric hybrids that merge traits from multiple creatures. Their mastery lies in boundless adaptation and versatility.`,

        playstyle: 'Hybrid form creation, multi-trait combinations, adaptive combat',

        strengths: [
          'Can combine two base forms simultaneously for hybrid abilities',
          'Access to unique chimeric transformations unavailable to other specs',
          'Hybrid forms inherit strengths from both parent forms',
          'Unmatched versatility in adapting to any situation'
        ],

        weaknesses: [
          'Hybrid forms cost more Wild Instinct to maintain',
          'Cannot access pure form ultimate abilities',
          'Transformation complexity requires careful planning',
          'Jack-of-all-trades means less specialization'
        ],

        specPassive: {
          name: 'Chimeric Fusion',
          description: 'Merge two base forms into a hybrid with combined traits (costs 2 WI). You can also manifest partial transformations (wings, claws, gills) without fully shapeshifting.'
        },

        keyAbilities: [
          'Chimeric Merge: Combine two forms (e.g., Nightstalker + Skyhunter = Shadow Raptor with stealth and flight)',
          'Adaptive Evolution: Spend 3 WI to temporarily gain resistance to the last damage type you received',
          'Partial Shift: Manifest specific traits (claws, wings, gills, enhanced senses) without full transformation (1 WI each)'
        ],

        recommendedFor: 'Players who love creative problem-solving and want maximum transformation flexibility'
      },

      {
        id: 'form-thief',
        name: 'Form Thief',
        icon: 'Psychic/Mind Control',
        color: '#8B0000',
        theme: 'Form Theft & Enemy Mimicry',

        description: `Form Thieves steal the shapes of slain enemies, perfectly mimicking any creature they've killed. They build a growing repertoire of forms, becoming master infiltrators.`,

        playstyle: 'Form collection, enemy mimicry, infiltration, stolen abilities',

        strengths: [
          'Can steal and permanently learn forms from defeated enemies',
          'Perfect mimicry allows infiltration and deception',
          'Access to enemy racial abilities and traits',
          'Form library grows stronger with each victory'
        ],

        weaknesses: [
          'Must defeat enemies to gain their forms',
          'Can only maintain 10 stolen forms at a time',
          'Stolen forms may have unfamiliar abilities',
          'Requires kills to expand transformation options'
        ],

        specPassive: {
          name: 'Harvest Form',
          description: 'When you reduce a creature to 0 HP, spend 3 WI to steal its form (stats, racial abilities, appearance). Store up to 10 stolen forms. Transforming into a stolen form costs 2 WI (vs. 1 WI for base forms).'
        },

        keyAbilities: [
          'Perfect Mimicry: While in a stolen form, you are indistinguishable from the original creature (even to magic)',
          'Stolen Power: Use one ability from your current stolen form (costs vary by ability power)',
          'Form Vault: Spend 10 minutes to swap out stored forms, replacing old ones with new acquisitions'
        ],

        recommendedFor: 'Players who enjoy collecting abilities and using enemy powers against them'
      },

      {
        id: 'primordial',
        name: 'Primordial',
        icon: 'Fire/Eruption',
        color: '#FF4500',
        theme: 'Ancient Elemental Transformations',

        description: `Primordials channel elemental planes, transforming into primal beings of fire, water, earth, and air. **This specialization replaces your four base animal forms with four elemental forms.** More powerful than standard forms but with elemental vulnerabilities.`,

        playstyle: 'Elemental transformations, environmental manipulation, high-risk high-reward',

        strengths: [
          'Elemental forms deal massive elemental damage',
          'Can manipulate terrain and environment while transformed',
          'Immunity to their element while in elemental form',
          'Elemental forms have devastating ultimate abilities'
        ],

        weaknesses: [
          'Vulnerable to opposing elements (Fire weak to Water, etc.)',
          'Elemental forms cost 3 WI to activate (vs. 1 WI for base forms)',
          'Replaces all four base animal forms—you cannot use Nightstalker, Ironhide, Skyhunter, or Frostfang',
          'Environmental dependence (harder to use Fire form underwater)'
        ],

        specPassive: {
          name: 'Elemental Ascension',
          description: '**Replaces base forms.** Your four animal forms become elemental forms (Inferno, Tsunami, Avalanche, Tempest). Each grants its element\'s immunity, opposite vulnerability, and 30 ft element manipulation. Elemental forms cost 3 WI to activate instead of 1 WI.'
        },

        keyAbilities: [
          'Inferno Form: Become living fire, dealing 1d6 fire damage to adjacent enemies each round, immune to fire, vulnerable to frost',
          'Tsunami Form: Become living water, gain swim speed 60ft, breathe underwater, create water walls, vulnerable to lightning',
          'Avalanche Form: Become living stone, gain +5 Armor, tremorsense 30ft, reshape earth, vulnerable to lightning',
          'Tempest Form: Become living wind, gain fly speed 60ft, create wind barriers, vulnerable to being grounded'
        ],

        recommendedFor: 'Players who want powerful elemental magic and don\'t mind tactical vulnerabilities'
      }
    ]
  },

  // Example Spells - organized by form and specialization
  exampleSpells: [
    // ===== NIGHTSTALKER FORM (CAT) =====
    {
      id: 'fb_ambush_strike',
      name: 'Ambush Strike',
      description: 'Strike from the shadows with devastating precision. Damage and effects scale with Wild Instinct spent (1-5 WI). Must be used from stealth for full effect.',
      spellType: 'ACTION',
      icon: 'Piercing/Backstab',
      school: 'Physical',
      level: 3,
      form: 'nightstalker',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['physical', 'stealth', 'burst damage', 'nightstalker', 'feral shifter']
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'melee',
        rangeDistance: 5,
        requiresLineOfSight: true,
        targetRestrictions: ['enemy']
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Strike from stealth with deadly precision'
      },

      resolution: 'DICE',
      effectTypes: ['damage', 'debuff', 'control'],

      damageConfig: {
        formula: '1d6 per Wild Instinct spent',
        elementType: 'slashing',
        damageTypes: ['direct'],
        description: 'Tier 1: 1d6, Tier 2: 2d6 + Bleeding, Tier 3: 3d6 + Stun, Tier 4: 4d6 + Slow, Tier 5: 5d6 + Paralyze',
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false
        },
          resolution: 'DICE',
      },

      debuffConfig: {
        debuffType: 'statusEffect',
        effects: [{
          id: 'bleeding',
          name: 'Bleeding',
          description: '1d4 damage per round for 3 rounds (Tier 2+)',
          dotFormula: '1d4',
          dotDamageType: 'physical',
          damagePerTurn: '1d4',
          duration: 3,
          durationUnit: 'rounds'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      },

      controlConfig: {
        controlType: 'incapacitation',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        effects: [{
          id: 'stun',
          name: 'Stun',
          description: 'Target is stunned for 1 round (Tier 3: Stun, Tier 5: Paralyze)',
          config: {
            durationType: 'rounds',
            recoveryMethod: 'automatic',
            saveType: 'constitution',
            saveDC: 14,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },

      wildInstinctScaling: {
        minCost: 1,
        maxCost: 5,
        tiers: [
          { cost: 1, damage: '1d6', effect: 'None' },
          { cost: 2, damage: '2d6', effect: 'Apply Bleeding (1d4 damage per round for 3 rounds)' },
          { cost: 3, damage: '3d6', effect: 'Stun target for 1 round' },
          { cost: 4, damage: '4d6', effect: 'Reduce target movement speed by 50% for 2 rounds' },
          { cost: 5, damage: '5d6', effect: 'Paralyze target for 1 round' }
        ]
      },

      specialMechanics: {
        stealthRequirement: {
          description: 'Must be used from stealth for full effect',
          bonus: 'Advantage on attack roll if attacking from stealth'
        }
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      tags: ['physical', 'stealth', 'burst damage', 'nightstalker', 'feral shifter'],
      flavorText: 'From the shadows, death strikes without warning.'
    },

    {
      id: 'fb_shadowmeld',
      name: 'Shadowmeld',
      description: 'Blend into the shadows, becoming invisible and creating illusionary duplicates at higher tiers. Broken by attacking or taking damage.',
      spellType: 'ACTION',
      icon: 'Psychic/Mind Control',
      school: 'Illusion',
      level: 2,
      form: 'nightstalker',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['stealth', 'invisibility', 'illusion', 'nightstalker', 'utility']
      },

      targetingConfig: {
        targetingType: 'self',
        rangeType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Fade into the shadows'
      },

      resolution: 'AUTOMATIC',
      effectTypes: ['buff', 'utility'],

      buffConfig: {
        buffType: 'statusEffect',
        effects: [{
          id: 'invisibility',
          name: 'Shadow Invisibility',
          description: 'Become invisible for 1 minute or until you attack or take damage',
          mechanicsText: 'Invisible for 1 minute or until you attack or take damage'
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      utilityConfig: {
        utilityType: 'illusion',
        selectedEffects: [{
          id: 'illusionary_duplicates',
          name: 'Illusionary Duplicates',
          description: 'At higher Wild Instinct tiers, create 1-2 illusionary duplicates that confuse enemies'
        }],
        duration: 1,
        durationUnit: 'minutes',
        concentration: false,
        power: 'moderate'
      },

      wildInstinctScaling: {
        minCost: 1,
        maxCost: 5,
        tiers: [
          { cost: 1, effect: 'Advantage on Stealth checks for 1 minute' },
          { cost: 2, effect: 'Become invisible for 1 minute or until you attack' },
          { cost: 3, effect: 'Teleport to darkness within 30 feet and become invisible' },
          { cost: 4, effect: 'Create 1 illusionary duplicate for 1 minute' },
          { cost: 5, effect: 'Become invisible and create 2 illusionary duplicates' }
        ]
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false,
        breakCondition: 'Attacking or taking damage'
      },

      specialMechanics: {
        shadowTeleport: {
          description: 'At tier 3+, can teleport to any area of dim light or darkness',
          range: 30
        },
        illusions: {
          description: 'Duplicates mimic your movements and confuse enemies',
          duration: '1 minute'
        }
      },

      tags: ['stealth', 'invisibility', 'illusion', 'nightstalker', 'utility'],
      flavorText: 'The shadows embrace those who walk in darkness.'
    },

    // ===== IRONHIDE FORM (BEAR) =====
    {
      id: 'fb_roaring_assault',
      name: 'Roaring Assault',
      description: 'Unleash a devastating roar that damages and controls enemies. Effects scale with Wild Instinct.',
      spellType: 'ACTION',
      icon: 'Nature/Roar',
      school: 'Physical',
      level: 4,
      form: 'ironhide',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['aoe', 'force', 'crowd control', 'ironhide', 'feral shifter']
      },

      targetingConfig: {
        type: 'AOE',
        range: 10,
        rangeUnit: 'feet',
        aoeType: 'RADIUS',
        aoeSize: 10,
        requiresLineOfSight: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating AoE effects'
        }
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'constitution',
        dc: 14,
        onSuccess: 'Half damage',
        onFailure: 'Full damage and additional effects'
      },

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 8,
          damageTypes: ['force'],
          scaling: 'per_wi_spent'
        },
          resolution: 'DICE',
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d8',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d8',
          effect: 'Cause fear in enemies within 10 feet for 1 round'
        },
        tier3: {
          wiCost: 3,
          damage: '3d8',
          effect: 'Knock back enemies 10 feet'
        },
        tier4: {
          wiCost: 4,
          damage: '4d8',
          effect: 'Stun enemies within 10 feet for 1 round'
        },
        tier5: {
          wiCost: 5,
          damage: '5d8',
          effect: 'Knock enemies prone within 10 feet'
        }
      },

      specialMechanics: {
        fearEffect: {
          description: 'Frightened enemies have disadvantage on attack rolls',
          duration: '1 round'
        },
        knockback: {
          description: 'Enemies are pushed away from you',
          distance: 10
        }
      },

      tags: ['aoe', 'force', 'crowd control', 'ironhide', 'feral shifter'],
      flavorText: 'The bear\'s roar shakes the very earth.'
    },

    {
      id: 'fb_fortress_of_fur',
      name: 'Fortress of Fur',
      description: 'Harden your hide to absorb damage and gain defensive bonuses. Ultimate tier grants temporary invulnerability.',
      spellType: 'ACTION',
      icon: 'Nature/Roots',
      school: 'Abjuration',
      level: 3,
      form: 'ironhide',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['defense', 'temporary hp', 'resistance', 'ironhide', 'restoration shifter']
      },

      targetingConfig: {
        type: 'SELF',
        range: 0,
        rangeUnit: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating defensive effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Gain 1d6 temporary HP'
        },
        tier2: {
          wiCost: 2,
          effect: 'Gain 2d6 temporary HP and resistance to physical damage'
        },
        tier3: {
          wiCost: 3,
          effect: 'Gain 3d6 temporary HP and resistance to physical damage'
        },
        tier4: {
          wiCost: 4,
          effect: 'Gain 4d6 temporary HP and reflect 25% of melee damage taken'
        },
        tier5: {
          wiCost: 5,
          effect: 'Gain 5d6 temporary HP and resistance to all damage types for 1 minute'
        }
      },

      specialMechanics: {
        damageReflection: {
          description: 'At tier 4+, reflect melee damage back to attackers',
          percentage: 25
        },
        temporaryInvulnerability: {
          description: 'Tier 5 grants resistance to all damage types for 1 minute',
          duration: '1 minute'
        }
      },

      tags: ['defense', 'temporary hp', 'resistance', 'ironhide', 'restoration shifter'],
      flavorText: 'The bear\'s hide becomes as hard as stone.'
    },

    // ===== SKYHUNTER FORM (HAWK) =====
    {
      id: 'fb_talon_dive',
      name: 'Talon Dive',
      description: 'Dive from above with razor-sharp talons, grappling and stunning enemies.',
      spellType: 'ACTION',
      icon: 'Nature/Ethereal Bird',
      school: 'Physical',
      level: 3,
      form: 'skyhunter',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['physical', 'aerial', 'grapple', 'skyhunter', 'feral shifter']
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating dive effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageTypes: ['slashing'],
          scaling: 'per_wi_spent'
        },
          resolution: 'DICE',
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6',
          effect: 'Apply Grappled condition'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6',
          effect: 'Stun target for 1 round'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6',
          effect: 'Reduce target attack rolls by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        aerialAdvantage: {
          description: 'Gain advantage on attack roll if you have flight active',
          bonus: 'Advantage on attack'
        },
        grapple: {
          description: 'Grappled targets cannot move and have disadvantage on attacks',
          duration: 'Until escape (Athletics/Acrobatics check)'
        }
      },

      tags: ['physical', 'aerial', 'grapple', 'skyhunter', 'feral shifter'],
      flavorText: 'From the skies, the hunter descends.'
    },

    {
      id: 'fb_winds_grace',
      name: 'Wind\'s Grace',
      description: 'Harness the power of wind for enhanced perception, flight, and devastating wind attacks.',
      spellType: 'ACTION',
      icon: 'Nature/Tornado Vortex',
      school: 'Evocation',
      level: 4,
      form: 'skyhunter',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['utility', 'flight', 'wind', 'aoe', 'skyhunter', 'balance shifter']
      },

      targetingConfig: {
        type: 'VARIES',
        range: 30,
        rangeUnit: 'feet'
      },

      durationConfig: {
        type: 'varies',
        value: 1,
        unit: 'minutes'
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating wind effects'
        }
      },

      resolution: 'VARIES',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on Perception checks for 1 hour'
        },
        tier2: {
          wiCost: 2,
          effect: 'Gain flight speed equal to walking speed for 1 minute'
        },
        tier3: {
          wiCost: 3,
          effect: 'Summon gust pushing enemies back 10 feet (Str save DC 14)'
        },
        tier4: {
          wiCost: 4,
          effect: 'Gain flight and wind barrier granting +2 Armor for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Summon tornado dealing 3d6 damage and throwing enemies 20 feet'
        }
      },

      specialMechanics: {
        flightMobility: {
          description: 'Flight allows you to ignore difficult terrain and avoid ground hazards',
          speed: 'Equal to walking speed'
        },
        tornado: {
          description: 'Tier 5 creates a devastating tornado in a 15-foot radius',
          damage: '3d6',
          knockback: 20
        }
      },

      tags: ['utility', 'flight', 'wind', 'aoe', 'skyhunter', 'balance shifter'],
      flavorText: 'The winds obey those who soar among them.'
    },

    // ===== FROSTFANG FORM (WOLF) =====
    {
      id: 'fb_frostbite_strike',
      name: 'Frostbite Strike',
      description: 'Bite with frost-infused fangs, dealing frost damage and applying slowing effects.',
      spellType: 'ACTION',
      icon: 'Frost/Ice Orb',
      school: 'Evocation',
      level: 3,
      form: 'frostfang',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['frost', 'physical', 'crowd control', 'frostfang', 'feral shifter']
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 5,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating frost effects'
        }
      },

      resolution: 'ATTACK_ROLL',

      damageConfig: {
        baseDamage: {
          diceCount: 1,
          diceType: 6,
          damageTypes: ['frost'],
          scaling: 'per_wi_spent'
        },
          resolution: 'DICE',
      },

      effects: {
        tier1: {
          wiCost: 1,
          damage: '1d6 cold',
          effect: 'None'
        },
        tier2: {
          wiCost: 2,
          damage: '2d6 cold',
          effect: 'Apply Slowed (movement speed reduced by 50%)'
        },
        tier3: {
          wiCost: 3,
          damage: '3d6 cold',
          effect: 'Freeze target for 1 round (cannot move or act)'
        },
        tier4: {
          wiCost: 4,
          damage: '4d6 cold',
          effect: 'Reduce target attack rolls by 50% for 2 rounds'
        },
        tier5: {
          wiCost: 5,
          damage: '5d6 cold',
          effect: 'Paralyze target for 1 round'
        }
      },

      specialMechanics: {
        frostEffect: {
          description: 'Cold damage slows enemies and reduces their effectiveness',
          duration: 'Varies by tier'
        },
        freeze: {
          description: 'Frozen targets are incapacitated and vulnerable to shattering',
          vulnerability: 'Bludgeoning damage'
        }
      },

      tags: ['frost', 'physical', 'crowd control', 'frostfang', 'feral shifter'],
      flavorText: 'The wolf\'s bite carries the chill of winter.'
    },

    {
      id: 'fb_pack_leaders_call',
      name: 'Pack Leader\'s Call',
      description: 'Summon spectral wolves to fight alongside you and empower your allies.',
      spellType: 'ACTION',
      icon: 'Nature/Wolf Dash',
      school: 'Conjuration',
      level: 4,
      form: 'frostfang',
      specialization: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['summoning', 'pack tactics', 'support', 'frostfang', 'restoration shifter']
      },

      targetingConfig: {
        type: 'VARIES',
        range: 30,
        rangeUnit: 'feet'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        wildInstinct: {
          min: 1,
          max: 5,
          description: 'Spend 1-5 Wild Instinct for escalating pack effects'
        }
      },

      resolution: 'AUTOMATIC',

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Advantage on tracking checks for 1 hour'
        },
        tier2: {
          wiCost: 2,
          effect: 'Summon 1 spectral wolf (Armor 13, HP 15, Attack +5 for 1d6+2 damage)'
        },
        tier3: {
          wiCost: 3,
          effect: 'Summon 2 spectral wolves'
        },
        tier4: {
          wiCost: 4,
          effect: 'Summon wolf pack granting allies advantage on attacks for 1 minute'
        },
        tier5: {
          wiCost: 5,
          effect: 'Summon alpha wolf (Armor 15, HP 30, Attack +7 for 2d8+3, grants +2 Armor to allies)'
        }
      },

      specialMechanics: {
        spectralWolves: {
          description: 'Summoned wolves act on your turn and follow your commands',
          duration: '1 minute'
        },
        packTactics: {
          description: 'Wolves and allies gain advantage when attacking the same target',
          bonus: 'Advantage on attack rolls'
        },
        alphaWolf: {
          description: 'Tier 5 alpha wolf is a powerful summon with enhanced stats',
          stats: 'Armor 15, HP 30, +7 to hit, 2d8+3 damage'
        }
      },

      tags: ['summoning', 'pack tactics', 'support', 'frostfang', 'restoration shifter'],
      flavorText: 'The pack answers the call of their leader.'
    },

    // ===== UNIVERSAL SPELLS (ALL FORMS) =====
    {
      id: 'fb_natures_grasp',
      name: 'Nature\'s Grasp',
      description: 'Vines erupt from the ground to restrain a target.',
      spellType: 'ACTION',
      icon: 'Nature/Thorny Entanglement',
      school: 'Conjuration',
      level: 1,
      form: null,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['crowd control', 'nature', 'universal', 'all specs']
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: false
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Command vines to erupt from the ground'
      },

      resolution: 'SAVING_THROW',
      savingThrow: {
        ability: 'strength',
        dc: 13,
        onSuccess: 'No effect',
        onFailure: 'Restrained'
      },

      specialMechanics: {
        restrainedCondition: {
          description: 'Restrained creatures have speed 0 and disadvantage on Dex saves',
          escape: 'Strength or Acrobatics check DC 13'
        }
      },

      tags: ['crowd control', 'nature', 'universal', 'all specs'],
      flavorText: 'Nature itself reaches out to bind your foes.'
    },

    {
      id: 'fb_healing_touch',
      name: 'Healing Touch',
      description: 'Channel nature\'s healing energy to restore an ally\'s health.',
      spellType: 'ACTION',
      icon: 'Healing/Heal Wound',
      school: 'Evocation',
      level: 2,
      form: null,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['healing', 'support', 'universal', 'all specs']
      },

      targetingConfig: {
        type: 'SINGLE',
        range: 30,
        rangeUnit: 'feet',
        requiresLineOfSight: true,
        allowFriendly: true,
        allowSelf: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Channel healing energy through your touch'
      },

      resolution: 'AUTOMATIC',

      healingConfig: {
        baseHealing: {
          diceCount: 1,
          diceType: 6,
          flatBonus: 0
        }
      },

      specialMechanics: {
        formBonus: {
          description: 'Form-matched bonus: Costs 0 WI if cast in any form (normally 1 WI)',
          note: 'Universal spell - no form match bonus applies'
        }
      },

      tags: ['healing', 'support', 'universal', 'all specs', 'restoration shifter'],
      flavorText: 'Life flows through your touch, mending wounds.'
    },

    {
      id: 'fb_beast_aspect',
      name: 'Beast Aspect',
      description: 'Transform part of your body into an animal feature. Choose one: claws (climbing speed), wings (glide 60ft), gills (breathe underwater), or enhanced senses (advantage on Perception). At higher WI, manifest multiple traits.',
      spellType: 'ACTION',
      icon: 'Nature/Beast Mark',
      school: 'Transmutation',
      level: 2,
      form: null,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['transformation', 'utility', 'universal', 'all specs']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      durationConfig: {
        type: 'timed',
        value: 1,
        unit: 'minutes',
        concentration: false
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Manifest a partial animal transformation'
      },

      resolution: 'AUTOMATIC',
      effectTypes: ['buff', 'utility'],

      effects: {
        tier1: {
          wiCost: 1,
          effect: 'Choose one: claws (climbing speed = walking speed), wings (glide 60ft when falling), gills (breathe underwater 1 min), or enhanced senses (advantage on Perception 1 min)'
        },
        tier2: {
          wiCost: 2,
          effect: 'Choose two traits simultaneously'
        },
        tier3: {
          wiCost: 3,
          effect: 'Choose three traits simultaneously'
        }
      },

      specialMechanics: {
        partialTransformation: {
          description: 'Unlike full forms, partial transformations don\'t prevent spellcasting or ability use',
          note: 'Can be used alongside active forms for additional utility'
        }
      },

      tags: ['transformation', 'utility', 'universal', 'all specs'],
      flavorText: 'The wild flows through you, reshaping your form.'
    }
  ],

  // Comprehensive Spell List (Levels 1-10, 3 spells each, following template)
  spells: [
    // ===== LEVEL 1 SPELLS (Already has 1, need 2 more) =====
    {
      id: 'formbender_primal_strike',
      name: 'Primal Strike',
      description: 'Channel primal energy into a devastating melee attack.',
      level: 1,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Claw Marks',
        tags: ['attack', 'damage', 'physical', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '2d8 + strength',
        elementType: 'bludgeoning',
        damageTypes: ['direct'],
        criticalConfig: {
          enabled: true,
          critType: 'dice',
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: '1d8',
          critEffects: ['wild_instinct_gain'],
          wildInstinctGainConfig: {
            amount: 1
          }
        },
          resolution: 'DICE',
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'physical', 'formbender']
    },

    {
      id: 'formbender_wild_regeneration',
      name: 'Wild Regeneration',
      description: 'Channel primal healing energy to restore your vitality.',
      level: 1,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['healing'],
      typeConfig: {
        school: 'nature',
        icon: 'Healing/Renewal',
        tags: ['healing', 'support', 'nature', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        formula: '2d6 + constitution',
        healingType: 'instant',
        hasHotEffect: true,
        hotFormula: '1d6',
        hotDuration: 2,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },
      resolution: 'DICE',
      tags: ['healing', 'support', 'nature', 'formbender']
    },

    // ===== LEVEL 2 SPELLS (Already has 3, complete) =====

    // ===== LEVEL 3 SPELLS (Already has 4, complete) =====

    // ===== LEVEL 4 SPELLS (Already has 3, complete) =====

    // ===== LEVEL 2 SPELLS =====
    {
      id: 'formbender_beast_claws',
      name: 'Beast Claws',
      description: 'Grow razor-sharp claws that enhance your natural attacks.',
      spellType: 'ACTION',
      icon: 'Nature/Claw Marks',
      school: 'Physical',
      level: 2,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['physical', 'buff', 'damage', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Grow razor-sharp claws'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'beast_claws',
          name: 'Beast Claws',
          description: 'Your unarmed attacks deal slashing damage and gain +2d6 damage for 1 minute',
          statModifier: {
            stat: 'damage',
            magnitude: '2d6',
            magnitudeType: 'dice'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      tags: ['physical', 'buff', 'damage', 'formbender']
    },

    {
      id: 'formbender_primal_senses',
      name: 'Primal Senses',
      description: 'Heighten your senses to detect hidden threats and track prey.',
      spellType: 'ACTION',
      icon: 'Piercing/Backstab',
      school: 'Physical',
      level: 2,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'senses', 'utility', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Heighten your senses'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'primal_senses',
          name: 'Primal Senses',
          description: 'Gain advantage on Perception checks and can detect invisible creatures for 1 hour',
          statModifier: {
            stat: 'perception',
            magnitude: 'advantage',
            magnitudeType: 'advantage'
          }
        }],
        durationValue: 1,
        durationType: 'hours',
        durationUnit: 'hours',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      tags: ['buff', 'senses', 'utility', 'formbender']
    },

    {
      id: 'formbender_wild_leap',
      name: 'Wild Leap',
      description: 'Leap incredible distances, using primal strength to cover ground quickly.',
      spellType: 'ACTION',
      icon: 'Utility/Dash',
      school: 'Physical',
      level: 2,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['utility', 'movement', 'mobility', 'formbender']
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        targetRestrictions: [],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: false
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Leap incredible distances'
      },

      resolution: 'DICE',
      effectTypes: ['utility'],

      utilityConfig: {
        utilityType: 'movement',
        selectedEffects: [{
          id: 'wild_leap',
          name: 'Wild Leap',
          description: 'Leap up to 60 feet in any direction, ignoring difficult terrain'
        }],
        duration: 1,
        durationUnit: 'rounds',
        concentration: false,
        power: 'moderate'
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },

      tags: ['utility', 'movement', 'mobility', 'formbender']
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: 'formbender_feral_rage',
      name: 'Feral Rage',
      description: 'Tap into primal fury, gaining temporary strength and ferocity.',
      spellType: 'ACTION',
      icon: 'Nature/Roaring Bear',
      school: 'Physical',
      level: 3,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'damage', 'rage', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Tap into primal fury'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'feral_rage',
          name: 'Feral Rage',
          description: 'Gain +2 Strength and advantage on attack rolls for 1 minute',
          statModifier: {
            stat: 'strength',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 1,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: true,
        canBeDispelled: true
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },

      tags: ['buff', 'damage', 'rage', 'formbender']
    },

    {
      id: 'formbender_natures_armor',
      name: 'Nature\'s Armor',
      description: 'Grow thick natural armor granting +3 Armor and 50% resistance to physical damage for 10 minutes.',
      spellType: 'ACTION',
      icon: 'Nature/Earth Shield',
      school: 'Physical',
      level: 3,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'defense', 'armor', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Grow thick natural armor'
      },

      resolution: 'DICE',
      effectTypes: ['buff'],

      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'natures_armor',
          name: 'Nature\'s Armor',
          description: 'Gain +3 armor and resistance to physical damage for 10 minutes',
          statModifier: {
            stat: 'armor',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 10,
        durationType: 'minutes',
        durationUnit: 'minutes',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 0
       },

      tags: ['buff', 'defense', 'armor', 'formbender']
    },

    {
      id: 'formbender_hunt_call',
      name: 'Hunt Call',
      description: 'Call forth spectral hunters to aid you in tracking and pursuing prey.',
      spellType: 'ACTION',
      icon: 'Nature/Spawn',
      school: 'Physical',
      level: 3,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['summoning', 'utility', 'tracking', 'formbender']
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['verbal'],
        verbalText: 'Call forth spectral hunters'
      },

      resolution: 'DICE',
      effectTypes: ['summoning'],

      summonConfig: {
        creatures: [{
          id: 'spectral_hunter',
          name: 'Spectral Hunter',
          description: 'A ghostly wolf that aids in tracking and hunting',
          size: 'Medium',
          type: 'spirit',
          tokenIcon: 'ability_hunter_pet_wolf',
          stats: {
            maxHp: 20,
            armor: 12,
            maxMana: 0
          },
          config: {
            quantity: 2,
            duration: 1,
            durationUnit: 'hours',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            controlRange: 30
          }
        }],
        duration: 1,
        durationUnit: 'hours',
        hasDuration: true,
        concentration: false,
        controlRange: 30,
        controlType: 'mental'
      },

      cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1
       },

      tags: ['summoning', 'utility', 'tracking', 'formbender']
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: 'formbender_savage_charge',
      name: 'Savage Charge',
      description: 'Charge forward with primal fury, dealing massive damage. Targets must succeed on a Strength save or be knocked prone.',
      spellType: 'ACTION',
      icon: 'Utility/Dash',
      school: 'Physical',
      level: 4,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['attack', 'damage', 'control', 'charge', 'formbender']
      },

      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'line',
        aoeParameters: { length: 40, width: 5 },
        targetRestrictions: ['enemy'],
        maxTargets: 5,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic'],
        somaticText: 'Charge forward with primal fury'
      },

      resolution: 'SAVE',
      effectTypes: ['damage', 'control'],

      damageConfig: {
        formula: '5d6 + strength',
        elementType: 'bludgeoning',
        damageTypes: ['direct'],
        description: 'Charge attack that knocks down enemies in your path',
          resolution: 'DICE',
      },

      controlConfig: {
        controlType: 'knockdown',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 15,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'knockdown',
          name: 'Knocked Down',
          description: 'Target is knocked prone for 1 round',
          config: {
            saveType: 'strength',
            saveDC: 14,
            knockdown: true,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },

      tags: ['attack', 'damage', 'control', 'charge', 'formbender']
    },

    {
      id: 'formbender_primal_healing',
      name: 'Primal Healing',
      description: 'Channel the restorative power of nature to heal wounds and remove afflictions.',
      spellType: 'ACTION',
      icon: 'Healing/Heart Ripple',
      school: 'Physical',
      level: 4,
      specialization: 'universal',
      form: null,

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['healing', 'support', 'restoration', 'formbender']
      },

      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Channel restorative nature energy'
      },

      resolution: 'DICE',
      effectTypes: ['healing'],

      healingConfig: {
        formula: '3d8 + spirit',
        healingType: 'instant',
        hasHotEffect: true,
        hotFormula: '1d8',
        hotDuration: 3,
        hotTickType: 'round',
        isProgressiveHot: false,
        description: 'Heal a target and remove one disease or poison effect'
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 2
       },

      tags: ['healing', 'support', 'restoration', 'formbender']
    },

    {
      id: 'formbender_primal_surge',
      name: 'Primal Surge',
      description: 'Channel a burst of primal energy that amplifies your current form. Gain double your form\'s passive bonus for 2 rounds and generate +2 Wild Instinct.',
      spellType: 'ACTION',
      icon: 'Nature/Nature Primal',
      school: 'Physical',
      level: 4,
      form: null,
      specialization: 'universal',

      typeConfig: {
        castTime: 1,
        castTimeType: 'IMMEDIATE',
        tags: ['buff', 'enhancement', 'form-amp', 'formbender']
      },

      targetingConfig: {
        targetingType: 'self'
      },

      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic'],
        somaticText: 'Channel a primal surge through your current form'
      },

      resolution: 'AUTOMATIC',
      effectTypes: ['buff', 'utility'],

      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'primal_surge',
          name: 'Primal Surge',
          description: 'Double your current form\'s passive bonus for 2 rounds and generate +2 Wild Instinct',
          customDescription: 'Your current form is amplified. Nightstalker: double stealth bonus and sneak attack. Ironhide: +20 additional HP and double resistance. Skyhunter: +30ft fly speed. Frostfang: double pack tactics range.',
          mechanicsText: 'Double form passive bonuses for 2 rounds, gain +2 WI',
          duration: 2,
          durationUnit: 'rounds'
        }],
        durationValue: 2,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },

      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },

      tags: ['buff', 'enhancement', 'form-amp', 'formbender']
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: 'formbender_pack_leader',
      name: 'Pack Leader',
      description: 'Summon 3 spectral wolves to fight alongside you for 5 rounds, empowering your pack tactics. You and the wolves gain +2 to attack rolls when adjacent to each other.',
      level: 5,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['summoning', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Wolf Dash',
        tags: ['summoning', 'buff', 'pack', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [{
          id: 'spectral_wolf',
          name: 'Spectral Wolf',
          description: 'A ghostly wolf made of primal energy',
          size: 'Medium',
          type: 'spirit',
          tokenIcon: 'ability_hunter_pet_wolf',
          stats: {
            maxHp: 35,
            armor: 13,
            maxMana: 0
          },
          config: {
            quantity: 3,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'mental',
            controlRange: 60
          }
        }],
        duration: 5,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 60,
        controlType: 'mental'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'pack_tactics',
          name: 'Pack Tactics',
          description: 'You and summoned wolves gain +2 to attack rolls when adjacent to each other for 5 rounds',
          statModifier: {
            stat: 'attack_rolls',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['summoning', 'buff', 'pack', 'formbender']
    },

    {
      id: 'formbender_primal_rage',
      name: 'Primal Rage',
      description: 'Channel wild fury into a devastating multi-attack.',
      level: 5,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Claw Marks',
        tags: ['attack', 'damage', 'physical', 'multi hit', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d8 + strength',
        elementType: 'slashing',
        damageTypes: ['direct'],
        description: 'Make 3 rapid claw attacks at the target',
          resolution: 'DICE',
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['enemy'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'physical', 'multi hit', 'formbender']
    },

    {
      id: 'formbender_adaptive_form',
      name: 'Adaptive Form',
      description: 'Shift between forms instantly without Wild Instinct cost for 3 rounds.',
      level: 5,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['buff', 'utility'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Cat Face',
        tags: ['buff', 'utility', 'transformation', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'adaptive_form',
          name: 'Adaptive Form',
          description: 'Form transformations are free (cost 0 Wild Instinct) for 3 rounds',
          customDescription: 'You can shift between all forms freely without paying the normal 1 Wild Instinct cost. This allows rapid adaptation to combat situations.',
          mechanicsText: 'Form transformations cost 0 Wild Instinct for 3 rounds',
          duration: 3,
          durationUnit: 'rounds'
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['buff', 'utility', 'transformation', 'formbender']
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: 'formbender_titan_form',
      name: 'Titan Form',
      description: 'Transform into a massive titan, gaining incredible size and strength.',
      level: 6,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'Necrotic/Resurrect',
        tags: ['transformation', 'buff', 'size', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      transformationConfig: {
        transformationType: 'physical',
        targetType: 'self',
        duration: 4,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Titan Form',
        description: 'Your body swells to massive proportions.',
        concentration: true,
        grantedAbilities: [
          { id: 'huge_size', name: 'Huge Size', description: 'Size becomes Huge, reach increases to 15 feet' },
          { id: 'titan_strength', name: '+4 Strength', description: 'Gain +4 to Strength attribute' },
          { id: 'titan_armor', name: '+3 Armor', description: 'Gain +3 armor from thickened hide' },
          { id: 'titan_hp', name: '+50 Temp HP', description: 'Gain 50 temporary hit points' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'size', 'formbender']
    },

    {
      id: 'formbender_primal_fury_leap',
      name: 'Primal Fury Leap',
      description: 'Leap high into the air and crash down, dealing massive AoE damage.',
      level: 6,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Cat Face',
        tags: ['attack', 'damage', 'control', 'aoe', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '6d8 + strength + agility',
        elementType: 'bludgeoning',
        damageTypes: ['direct'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'agility',
          difficultyClass: 16,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
          resolution: 'DICE',
      },
      controlConfig: {
        controlType: 'knockdown',
        strength: 'moderate',
        duration: 1,
        durationUnit: 'rounds',
        saveDC: 16,
        saveType: 'agility',
        savingThrow: true,
        effects: [{
          id: 'stagger',
          name: 'Staggered',
          description: 'Target is knocked prone and must use movement to stand',
          config: {
            saveType: 'strength',
            saveDC: 15,
            knockdown: true,
            duration: 1,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 40,
        aoeShape: 'circle',
        aoeParameters: { radius: 20 },
        targetRestrictions: ['enemy'],
        maxTargets: 10,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4
       },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'formbender']
    },

    {
      id: 'formbender_natures_gift',
      name: "Nature's Gift",
      description: 'Heal yourself or an ally with the regenerative power of nature.',
      level: 6,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['healing'],
      typeConfig: {
        school: 'nature',
        icon: 'Healing/Heal Wound',
        tags: ['healing', 'support', 'nature', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      healingConfig: {
        formula: '5d8 + spirit',
        healingType: 'instant',
        hasHotEffect: true,
        hotFormula: '2d6',
        hotDuration: 3,
        hotTickType: 'round',
        isProgressiveHot: false
      },
      targetingConfig: {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['ally', 'self'],
        maxTargets: 1,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 3
       },
      resolution: 'DICE',
      tags: ['healing', 'support', 'nature', 'formbender']
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: 'formbender_primal_avatar',
      name: 'Primal Avatar',
      description: 'Transform into a primal avatar, embodying all forms simultaneously.',
      level: 7,
      form: null,
      spellType: 'STATE',
      effectTypes: ['transformation', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Nature Primal',
        tags: ['transformation', 'buff', 'primal', 'formbender'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Primal Avatar',
        description: 'Channel the essence of all primal forms simultaneously.',
        grantedAbilities: [
          { id: 'all_form_benefits', name: 'All Form Benefits', description: 'Gain all four primal form passives at once: Feral Shifter stealth, Stormbringer elemental damage, Earthwarden defense, and Flamecaller fire. This ultimate form unites every primal aspect.' },
          { id: 'free_switching', name: 'Free Switching', description: 'Form transitions cost 0 Wild Instinct' },
          { id: 'avatar_instinct', name: '+2 Wild Instinct/Round', description: 'Generate +2 Wild Instinct each round' },
          { id: 'avatar_stats', name: '+3 All Stats', description: 'Gain +3 to all attributes' }
        ]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'primal_avatar_power',
          name: 'Primal Avatar Stats',
          description: '+3 to all stats',
          statModifier: {
            stat: 'all_stats',
            magnitude: 3,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'primal', 'formbender']
    },

    {
      id: 'formbender_savage_roar',
      name: 'Savage Roar',
      description: 'Unleash a roar that terrifies all enemies and empowers allies.',
      level: 7,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['control', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Roar',
        tags: ['control', 'buff', 'fear', 'aoe', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      controlConfig: {
        controlType: 'mind_control',
        strength: 'strong',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 17,
        saveType: 'spirit',
        savingThrow: true,
        effects: [{
          id: 'fear',
          name: 'Terrified',
          description: 'Enemies are frightened and must move away from you for 3 rounds',
          config: {
            fearStrength: 'strong',
            saveType: 'charisma',
            saveDC: 16,
            duration: 3,
            durationUnit: 'rounds'
          }
        }]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'roar_empowerment',
          name: 'Empowered by Roar',
          description: 'All allies gain +2 to damage rolls for 3 rounds',
          statModifier: {
            stat: 'damage_rolls',
            magnitude: 2,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 3,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 30 },
        targetRestrictions: [],
        maxTargets: 20,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 4
       },
      resolution: 'DICE',
      tags: ['control', 'buff', 'fear', 'aoe', 'formbender']
    },

    {
      id: 'formbender_apex_predator',
      name: 'Apex Predator',
      description: 'Become the ultimate predator, gaining enhanced senses and lethal strikes.',
      level: 7,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['buff', 'damage'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Claw Marks',
        tags: ['buff', 'damage', 'predator', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'apex_predator',
          name: 'Apex Predator',
          description: 'Gain advantage on all attacks, +3d6 damage, and +10 movement speed for 4 rounds',
          statModifier: {
            stat: 'damage',
            magnitude: 3,
            magnitudeType: 'dice'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'turn_based', cooldownValue: 5
       },
      resolution: 'DICE',
      tags: ['buff', 'damage', 'predator', 'formbender']
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: 'formbender_savage_maelstrom',
      name: 'Savage Maelstrom',
      description: 'Transform into all forms rapidly, creating a whirlwind of savage attacks.',
      level: 8,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['damage'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Tornado Vortex',
        tags: ['attack', 'damage', 'aoe', 'transformation', 'epic', 'formbender'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '12d8 + strength * 2 + agility * 2',
        elementType: 'slashing',
        secondaryElementType: 'bludgeoning',
        damageTypes: ['direct'],
        description: 'Shift through all forms rapidly, attacking all nearby enemies',
          resolution: 'DICE',
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'self_centered',
        aoeShape: 'circle',
        aoeParameters: { radius: 25 },
        targetRestrictions: ['enemy'],
        maxTargets: 15,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'aoe', 'transformation', 'epic', 'formbender']
    },

    {
      id: 'formbender_natures_champion',
      name: "Nature's Champion",
      description: 'Become an avatar of nature, gaining incredible resilience and power.',
      level: 8,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Nature Natural',
        tags: ['buff', 'transformation', 'defense', 'epic', 'formbender'],
        castTime: 1,
        castTimeType: 'IMMEDIATE'
      },
      transformationConfig: {
        transformationType: 'elemental',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: "Nature's Champion",
        description: 'Become one with primal nature, gaining its protection and power.',
        grantedAbilities: [
          { id: 'physical_resistance', name: 'Physical Resistance', description: 'Resistance to bludgeoning, slashing, and piercing damage' },
          { id: 'nature_regen', name: 'Primal Regeneration', description: 'Regenerate 3d10 HP at the start of each turn' },
          { id: 'reduced_costs', name: 'Primal Efficiency', description: 'All Wild Instinct costs reduced by 1' },
          { id: 'champion_stats', name: '+4 All Stats', description: 'Gain +4 to all attributes' }
        ]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [
          {
            id: 'natures_champion_power',
            name: "Champion Stats",
            description: '+4 to all stats',
            statModifier: {
              stat: 'all_stats',
              magnitude: 4,
              magnitudeType: 'flat'
            }
          },
          {
            id: 'natures_champion_defense',
            name: 'Champion Defense',
            description: 'Gain 50% damage reduction for 5 rounds',
            statModifier: {
              stat: 'damage_reduction',
              magnitude: 50,
              magnitudeType: 'percentage'
            }
          }
        ],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['buff', 'transformation', 'defense', 'epic', 'formbender']
    },

    {
      id: 'formbender_wild_hunt',
      name: 'Wild Hunt',
      description: 'Summon the spirits of the wild hunt to chase down and destroy all enemies.',
      level: 8,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['summoning', 'damage'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Ethereal Bird',
        tags: ['summoning', 'damage', 'spirit', 'epic', 'formbender'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [{
          id: 'wild_hunt_spirit',
          name: 'Wild Hunt Spirit',
          description: 'Spectral hunters that chase and destroy enemies',
          size: 'Large',
          type: 'spirit',
          tokenIcon: 'ability_hunter_pet_dragonhawk',
          stats: {
            maxHp: 60,
            armor: 16,
            maxMana: 0
          },
          config: {
            quantity: 5,
            duration: 5,
            durationUnit: 'rounds',
            hasDuration: true,
            concentration: false,
            controlType: 'autonomous',
            controlRange: 0
          }
        }],
        duration: 5,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 0,
        controlType: 'autonomous'
      },
      damageConfig: {
        formula: '12d6 + spirit',
        elementType: 'force',
        damageTypes: ['direct'],
        description: 'Wild Hunt spirits deal this damage to enemies they catch',
          resolution: 'DICE',
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 60,
        aoeShape: 'circle',
        aoeParameters: { radius: 40 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['summoning', 'damage', 'spirit', 'epic', 'formbender']
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: 'formbender_primordial_form',
      name: 'Primordial Form',
      description: 'Transform into a primordial beast of legend, gaining godlike power.',
      level: 9,
      form: null,
      spellType: 'STATE',
      effectTypes: ['transformation', 'buff'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Nature Wild 1',
        tags: ['transformation', 'buff', 'primordial', 'legendary', 'formbender'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 4,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Primordial Form',
        description: 'Take the form of an ancient primordial beast.',
        grantedAbilities: [
          { id: 'gargantuan_size', name: 'Gargantuan Size', description: 'Size becomes Gargantuan, reach 15 feet' },
          { id: 'primordial_resistance', name: 'Primordial Resistance', description: 'Resistance to all damage types' },
          { id: 'free_instinct', name: 'Primal Flow', description: 'All Wild Instinct abilities cost 1 less' },
          { id: 'instinct_gen', name: '+3 Wild Instinct/Round', description: 'Generate +3 Wild Instinct per round' },
          { id: 'primordial_stats', name: '+5 All Stats', description: 'Gain +5 to all attributes' }
        ]
      },
      buffConfig: {
        buffType: 'statEnhancement',
        effects: [{
          id: 'primordial_power',
          name: 'Primordial Stats',
          description: '+5 to all stats',
          statModifier: {
            stat: 'all_stats',
            magnitude: 5,
            magnitudeType: 'flat'
          }
        }],
        durationValue: 4,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: false
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 8 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'primordial', 'legendary', 'formbender']
    },

    {
      id: 'formbender_natures_apocalypse',
      name: "Nature's Apocalypse",
      description: 'Unleash the fury of nature itself, devastating all enemies on the battlefield.',
      level: 9,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['damage', 'control'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Earth Shatter',
        tags: ['attack', 'damage', 'control', 'aoe', 'legendary', 'formbender'],
        castTime: 4,
        castTimeType: 'IMMEDIATE'
      },
      damageConfig: {
        formula: '18d6 + strength + spirit',
        elementType: 'force',
        damageTypes: ['direct'],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: 'constitution',
          difficultyClass: 19,
          saveOutcome: 'halves',
          partialEffect: true,
          partialEffectFormula: 'damage/2'
        },
          resolution: 'DICE',
      },
      controlConfig: {
        controlType: 'knockdown',
        strength: 'extreme',
        duration: 3,
        durationUnit: 'rounds',
        saveDC: 19,
        saveType: 'strength',
        savingThrow: true,
        effects: [{
          id: 'stagger',
          name: 'Devastated',
          description: 'Target is knocked prone and stunned for 3 rounds',
          config: {
            saveType: 'constitution',
            saveDC: 18,
            knockdown: true,
            stun: true,
            duration: 3,
            durationUnit: 'rounds'
          }
        }]
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'sight',
        aoeShape: 'circle',
        aoeParameters: { radius: 100 },
        targetRestrictions: ['enemy'],
        maxTargets: 50,
        targetSelectionMethod: 'automatic',
        requiresLineOfSight: false
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 10 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The fang of a primordial beast, worth 50,000 gold'
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['attack', 'damage', 'control', 'aoe', 'legendary', 'formbender']
    },

    {
      id: 'formbender_eternal_wild',
      name: 'Eternal Wild',
      description: 'Merge permanently with the wild, gaining limitless transformations.',
      level: 9,
      form: null,
      spellType: 'STATE',
      effectTypes: ['buff', 'transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'Healing/Heart Ripple',
        tags: ['buff', 'transformation', 'primal', 'legendary', 'formbender'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Eternal Wild',
        description: 'Become one with the wild for a brief time.',
        grantedAbilities: [
          { id: 'wild_flow', name: 'Primal Flow', description: 'Form transitions cost 0 Wild Instinct' },
          { id: 'wild_instinct_gen', name: '+3 Wild Instinct/Round', description: 'Generate +3 Wild Instinct each round' },
          { id: 'wild_regen', name: 'Primal Regeneration', description: 'Regenerate 2d8 HP per round in any form' }
        ]
      },
      buffConfig: {
        buffType: 'custom',
        effects: [{
          id: 'eternal_wild',
          name: 'Eternal Wild',
          description: 'Wild Instinct maximum increased to 30 for the duration. Form transitions are free. Regenerate 2d8 HP per round.',
          customDescription: 'You have become one with the wild for a brief time. Your Wild Instinct maximum increases to 30. All form transformations are instant and free. You regenerate 2d8 HP per round in any form.',
          mechanicsText: 'WI cap 30, free transformations, regenerate 2d8 HP/round, duration 5 rounds',
          dotFormula: '2d8',
          dotDamageType: 'healing'
        }],
        durationValue: 5,
        durationType: 'rounds',
        durationUnit: 'rounds',
        concentrationRequired: false,
        canBeDispelled: true
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 8 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['buff', 'transformation', 'primal', 'legendary', 'formbender']
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: 'formbender_world_beast',
      name: 'World Beast',
      description: 'Transform into a legendary beast of immense power. The transformation is overwhelming and leaves you exhausted when it ends.',
      level: 10,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'Utility/Resistance',
        tags: ['transformation', 'buff', 'legendary', 'formbender'],
        castTime: 2,
        castTimeType: 'IMMEDIATE'
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 3,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'World Beast',
        description: 'Become a colossal primal creature of legend.',
        grantedAbilities: [
          { id: 'colossal_size', name: 'Colossal Size', description: 'Size becomes Colossal, reach 20 feet' },
          { id: 'world_beast_stats', name: '+6 All Stats', description: 'Gain +6 to all attributes' },
          { id: 'damage_resistance', name: 'Damage Resistance', description: 'Resistance to all damage types (half damage)' },
          { id: 'world_beast_attacks', name: 'Devastating Attacks', description: 'All attacks deal +4d10 extra damage' },
          { id: 'world_beast_regen', name: 'Primal Regeneration', description: 'Regenerate 3d10 HP at start of each turn' },
          { id: 'world_beast_exhaustion', name: 'Exhaustion (On End)', description: 'Gain 3 levels of exhaustion when transformation ends' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 15 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'The heart of the World Beast, priceless artifact'
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['transformation', 'buff', 'legendary', 'formbender']
    },

    {
      id: 'formbender_genesis_storm',
      name: 'Genesis Storm',
      description: 'Summon a storm of creation that births countless primal creatures.',
      level: 10,
      form: null,
      spellType: 'ACTION',
      effectTypes: ['summoning'],
      typeConfig: {
        school: 'nature',
        icon: 'Arcane/Star Trail Path',
        tags: ['summoning', 'legendary', 'formbender'],
        castTime: 5,
        castTimeType: 'IMMEDIATE'
      },
      summonConfig: {
        creatures: [
          {
            id: 'primal_beast_pack',
            name: 'Primal Beast',
            description: 'Savage beasts of pure primal energy',
            size: 'Large',
            type: 'beast',
            tokenIcon: 'ability_druid_catform',
            stats: { maxHp: 80, armor: 15, maxMana: 0 },
            config: {
              quantity: 10,
              duration: 10,
              durationUnit: 'rounds',
              hasDuration: true,
              concentration: false,
              controlType: 'mental',
              controlRange: 100
            }
          },
          {
            id: 'elemental_guardians',
            name: 'Elemental Guardian',
            description: 'Powerful elemental protectors',
            size: 'Huge',
            type: 'elemental',
            tokenIcon: 'spell_nature_strengthofearth',
            stats: { maxHp: 120, armor: 18, maxMana: 0 },
            config: {
              quantity: 5,
              duration: 10,
              durationUnit: 'rounds',
              hasDuration: true,
              concentration: false,
              controlType: 'mental',
              controlRange: 100
            }
          }
        ],
        duration: 10,
        durationUnit: 'rounds',
        hasDuration: true,
        concentration: false,
        controlRange: 100,
        controlType: 'mental'
      },
      targetingConfig: {
        targetingType: 'area',
        rangeType: 'ranged',
        rangeDistance: 80,
        aoeShape: 'circle',
        aoeParameters: { radius: 60 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: 'manual',
        requiresLineOfSight: true
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 12 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic', 'material'],
        materialComponents: 'Seeds of creation, worth 80,000 gold'
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'DICE',
      tags: ['summoning', 'legendary', 'formbender']
    },

    {
      id: 'formbender_perfect_evolution',
      name: 'Perfect Evolution',
      description: 'Master the art of shapeshifting to seamlessly blend form benefits for a limited time.',
      level: 10,
      form: null,
      spellType: 'STATE',
      effectTypes: ['transformation'],
      typeConfig: {
        school: 'nature',
        icon: 'Nature/Growth',
        tags: ['transformation', 'mastery', 'formbender'],
        stateVisibility: 'visible',
        cooldownAfterTrigger: 0,
        cooldownUnit: 'seconds',
        maxTriggers: 1
      },
      transformationConfig: {
        transformationType: 'primal',
        targetType: 'self',
        duration: 5,
        durationUnit: 'rounds',
        power: 'major',
        newForm: 'Evolved Form',
        description: 'Transcend normal shapeshifting limitations for a brief time.',
        grantedAbilities: [
          { id: 'hybrid_forms', name: 'Hybrid Forms', description: 'Maintain benefits of 2 forms simultaneously' },
          { id: 'instant_shift', name: 'Instant Shift', description: 'Form transitions cost 0 Wild Instinct' },
          { id: 'evolved_instinct', name: 'Evolved Instinct', description: 'Generate +2 Wild Instinct per round' },
          { id: 'ability_discount', name: 'Primal Efficiency', description: 'All Wild Instinct costs reduced by 1 (minimum 1)' }
        ]
      },
      targetingConfig: {
        targetingType: 'self'
      },
      resourceCost: {
        resourceTypes: ['wild_instinct'],
        resourceValues: { wild_instinct: 10 },
        useFormulas: {},
        actionPoints: 3,
        components: ['verbal', 'somatic']
      },
      cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1
       },
      resolution: 'NONE',
      tags: ['transformation', 'mastery', 'formbender']
    }
  ],

  // Spell Pools by Level
  spellPools: {
    1: [
      'formbender_primal_strike',
      'formbender_wild_regeneration'
    ],
    2: [
      'formbender_beast_claws',
      'formbender_primal_senses',
      'formbender_wild_leap'
    ],
    3: [
      'formbender_feral_rage',
      'formbender_natures_armor',
      'formbender_hunt_call'
    ],
    4: [
      'formbender_savage_charge',
      'formbender_primal_healing',
      'formbender_primal_surge'
    ],
    5: [
      'formbender_pack_leader',
      'formbender_primal_rage',
      'formbender_adaptive_form'
    ],
    6: [
      'formbender_titan_form',
      'formbender_primal_fury_leap',
      'formbender_natures_gift'
    ],
    7: [
      'formbender_primal_avatar',
      'formbender_savage_roar',
      'formbender_apex_predator'
    ],
    8: [
      'formbender_savage_maelstrom',
      'formbender_natures_champion',
      'formbender_wild_hunt'
    ],
    9: [
      'formbender_primordial_form',
      'formbender_natures_apocalypse',
      'formbender_eternal_wild'
    ],
    10: [
      'formbender_world_beast',
      'formbender_genesis_storm',
      'formbender_perfect_evolution'
    ]
  }
};


