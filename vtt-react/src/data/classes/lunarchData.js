/**
 * Lunarch Class Data
 *
 * The Vessel of the Lunar Parasite. An ancient, unfeeling celestial entity has
 * burrowed into the Lunarch's nervous system. The moon is not their ally -- it
 * is a cold, parasitic predator that feeds on memory, sensation, sanity, and
 * vitality in exchange for devastating cosmic power.
 */

export const LUNARCH_DATA = {
  id : "lunarch",
  name: "Lunarch",
  icon: "fas fa-moon",
  role: "Control/Support",
  damageTypes: ["radiant", "necrotic", "psychic"],

  // Overview section
  overview: {
    originStory: `Selene, a sister of the forgotten House Viridane, bargained with the wildwood fae in the moonlit groves of the Frostwood, seeking the light of the dead moon to guide her family's escape from the northern vigil keeps. She bound a lunar parasite to her bones, letting its starlight veins wrap around her marrow.

The fae granted the light, but they took the warmth from her blood. The Lunarch carries a permanent chill in her marrow, unable to feel heat even when standing in forge-fire. Her power fluctuates erratically with the lunar cycles, leaving her weak during the new moon, her skin glowing with a pale silver aura.

Shine in the dark. The moon's light is cold, but it is the only guide left in a frozen world. Guide them before the shadows close in.`,
    title: "The Lunarch",
    subtitle: "Vessel of the Lunar Parasite",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You did not choose this. An ancient celestial parasite has fused with your nervous system. Every three rounds it FORCEFULLY REWRITES your physiology -- dealing 2d6 necrotic damage as it feeds on a different aspect of your humanity. You are its host. Its hunger is your power.

**Core Mechanic**: Parasitic Phase Cycle -- New Moon (Memory Eater: +3 Armor, immune to charm/fear, but -2 attacks, lose 1d4 mana/turn) â†’ Waxing Moon (Sensation Harvest: +1d6 damage, +10ft speed, but take 1d4 necrotic/turn, no healing) â†’ Full Moon (Sanity Erosion: +2d8 radiant, crit 19-20, ignores 50% armor, but Delirium rolls each turn, -5 max HP/round) â†’ Waning Moon (Vitality Drain: -3 mana costs, vampiric 25%, but -2 Armor, -10 max HP)

**Resource**: Mana + Flesh. Every natural cycle shift deals 2d6 necrotic. Manual shifts cost 8 mana + 1d8+2 necrotic. Roll on the Transition Shock Table (1d6) every time.

**Fatal Flaw -- Celestial Rejection**: +25% vulnerability to Bludgeoning damage. Standard magical healing deals psychic damage to you instead of healing (the parasite devours foreign magic). Only your own phase-specific restoration works.

**Unique Utility -- Battlefield Cycle Manipulation**: The only class that can distort the passage of rounds, impose phase-specific vulnerabilities across the entire battlefield, and force enemies to sync with your volatile internal clock.

**Best For**: Players who want to play a tragic, self-destructive tactical mastermind who turns their own suffering into a weapon that warps reality`,
    },

    description: `The Lunarch is not a priest. The Lunarch is a host -- a walking crime scene where an ancient, unfeeling celestial parasite has burrowed into the nervous system and refused to leave. The moon is not a symbol of hope or guidance; it is a cold, alien predator that has been feeding on the light of dying stars since before flesh existed. When it chose the Lunarch, it did not ask permission. It seeped into their spine through the soft tissue at the base of the skull, threaded tendrils of starlight through their nerve clusters, and began to feed.

The Lunar Cycle is not a tool. It is the parasite's feeding schedule. Every three rounds, it rewrites the host's physiology to extract a different nutrient: memory during the New Moon, physical sensation during the Waxing, sanity during the Full, and raw vitality during the Waning. Each shift tears flesh along invisible seams where starlight has replaced connective tissue. The Lunarch cannot stop it. They can only direct it -- choosing which horror to embrace, weaponizing the parasite's hunger against their enemies, and hoping their body holds together long enough to matter.

No other class can manipulate the passage of rounds on the battlefield. No other class can impose a cosmic feeding cycle on their enemies, spreading phase-corresponding afflictions across an entire fight. But the cost is absolute: the Lunarch is immune to standard magical healing, their parasite-interlaced organs rupture catastrophically under bludgeoning trauma, and every phase shift is a gamble with the Transition Shock Table. The Lunarch does not win fights through strength. They win by making the battlefield as hostile to existence as their own body has become.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The lunarch's crescent aura was born in the moonlit groves of the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>. A sister of House Viridane named **Selene** fled the noble armies and bargained with the wildwood fae to capture the moon's light. The price of this celestial aura was a permanent chill in her bones. Selene could never feel warmth again, even next to volcanic vents, her flesh glowing with a pale, sympathetic silver.

**CITIES & CIVIL RECEPTION**
Lunarchs are celebrated as spiritual leaders among the Briaran, but they are hunted as heretics by the noble houses of the north.

**RACES & CULTURAL AFFILIATION**
The class is exclusively practiced by the <LoreLink termId="briaran">Briaran</LoreLink> descendants of House Viridane.

**NOTABLE FIGURES**
* **Selene of House Viridane**: The founding sister of the Lunarch order who led her house's escape from the north.
* **Eldrin the Moon-Touched**: A Briaran elder who established the first moonlit sanctuaries in the Frostwood Reach.`
    },

    signatureQuote: {
      text: '"The parasite does not hate me. It loves me. That is the horror of it. It loves me so completely that it has rewritten every cell of my body to match its idea of perfection."',
      speaker: 'Selene of House Viridane',
      context: 'Her testimony to the Briaran elders, explaining why she cannot remove the lunar entity'
    },

    philosophy: {
      coreTenet: 'The moon is dead, but its ghost still orbits. The light it casts is not illumination — it is memory, a recording of a celestial body that no longer exists. The Lunarch does not draw power from the moon; they draw power from the absence of the moon, the hollow space where it used to be, the ache of something beautiful that has ended.',
      relationship: 'The lunar parasite is not a symbiont — it is a predator that has learned to keep its host alive. It feeds on specific human experiences: the New Moon feeds on hope, the Waxing on anticipation, the Full on ecstasy, the Waning on memory. It cycles through these phases relentlessly, consuming whatever emotional energy the host is producing at that moment. The host is not in control. The parasite decides when to hunt, and the host is left to pick up the pieces of their own psyche afterward.',
      paradox: 'The Lunarch is at their most powerful when the parasite is at its most active — the Full Moon phase brings devastating power, but it consumes the host\'s most precious memories. A Lunarch who cycles through too many Full Moons will forget their own name, their family, their reason for fighting. The parasite remembers for them, but the parasite does not care. It will cheerfully trade a moment of transcendent power for a decade of the host\'s most cherished experiences.'
    },

    currentCrisis: `The dead moon is calling its children home. For centuries, the lunar parasite that binds to Lunarchs was believed to be a singular entity — a fragment of the long-dead moon that persisted in orbit. The Briaran elders have discovered otherwise: the moon was not a celestial body. It was an egg, and its children are the parasites.

The elder parasites — those bonded to the first Lunarchs — are beginning to communicate with each other across their hosts. They are planning something. Selene of House Viridane has been silent for three weeks, staring at the sky, occasionally whispering in a language that no living person speaks. The Briaran shamans have placed her in isolation, but they cannot stop the parasite from cycling through its phases. When the next Full Moon comes, they do not know if Selene will still be Selene — or if she will be something the egg has been waiting for.`,

    meaningfulTradeoffs: `A Lunarch cannot control when they change, what they feel, or what they remember. The parasite cycles through its phases on a fixed schedule, and the host is along for the ride. A Lunarch in the Waning phase will lose memories regardless of whether they are in combat or sitting peacefully by a fire. They can be mid-conversation when the parasite decides it is time to feed, and they will suddenly forget the person they are talking to. Relationships are nearly impossible — partners learn to read the phase-cycle and avoid the host during certain times. The Lunarch lives at the mercy of a creature that does not negotiate.`,

    classSpecificLocations: [
      {
        name: 'The Moonlit Sanctuaries',
        locationId: 'ironwood-heart',
        description: 'Hidden clearings deep in the Ironwood Heart where the Briaran elders established safe houses for Lunarchs to cycle through their phases without endangering others. Each sanctuary is a circle of standing stones positioned to catch the light of the dead moon at specific angles, minimizing the parasite\'s feeding efficiency and giving the host a few precious hours of lucidity.',
        purpose: 'Safe cycling grounds for Lunarchs in crisis',
        status: 'Active — Selene occupies the central sanctuary, and no one can approach'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Battlefield cycle manipulator and phase-contagion spreader with adaptive damage potential

**What You Bring That No One Else Can**:
- Distort the passage of rounds -- add or remove rounds from active effects on the battlefield
- Impose phase-specific vulnerabilities on enemies across the entire battlefield
- Force enemies to "sync" with your current phase, applying phase-corresponding debuffs (memory loss, pain amplification, radiant vulnerability, life drain)
- The only class that can weaponize a feeding cycle as a battlefield-wide control mechanism

**Combat Strengths**:
- Unmatched battlefield control through phase contagion and round manipulation
- Devastating burst damage during Full Moon (Sanity Erosion) -- +2d8 radiant, crit 19-20, ignores 50% armor
- Vampiric sustain during Waning Moon (Vitality Drain) -- 25% of damage dealt returns as healing
- Extreme survivability during New Moon (Memory Eater) -- +3 Armor, immune to charm/fear
- Every phase shift creates a reality pulse that can be weaponized against nearby enemies

**Combat Weaknesses (The Fatal Flaw)**:
- **Celestial Rejection**: +25% vulnerability to Bludgeoning damage (your starlight-infused organs rupture under blunt trauma)
- **Healing Immunity**: Standard magical healing deals psychic damage to you equal to 50% of the heal amount -- the parasite devours foreign magic and converts it to psychic feedback
- **Transition Shock**: Every phase shift (natural or manual) forces a roll on the Transition Shock Table (1d6) -- you may take extra damage, lose mana, lose AP, or go blind
- **Self-Destructive Economy**: Natural cycle shifts deal 2d6 necrotic damage every 3 rounds. Manual shifts cost 8 mana + 1d8+2 necrotic. You are always bleeding.
- **Full Moon Delirium**: During Sanity Erosion, you must roll on the Delirium Table each turn -- you may attack allies, lose AP, or take psychic damage

**Optimal Positioning**:
Medium range (30-60 feet), close enough to spread phase contagion to enemies but far enough to avoid the bludgeoning attacks that will rupture your organs. Position near allies during Waxing Moon so they benefit from your redirected parasite-feeding (Sanguine Warden). Stay far from allies during Full Moon -- the Delirium Table may force you to attack them.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Phase Management (Choose Your Suffering)**:
The Lunarch does not choose whether to suffer -- only HOW. Each phase is a different flavor of horror:

- **New Moon (Memory Eater)**: The parasite feeds on cognition. +3 Armor, immune to charm/fear, but -2 to attacks and lose 1d4 mana/turn. Use this when you're being targeted and need to survive. You are a passenger in your own body -- the parasite drives, and it has excellent reflexes but terrible aim.
- **Waxing Moon (Sensation Harvest)**: The parasite feeds on nerve endings. +1d6 damage, +10ft speed, advantage on perception, but take 1d4 necrotic/turn and CANNOT be healed by any means. Use this for aggressive repositioning and damage bursts when you're healthy enough to absorb the feeding.
- **Full Moon (Sanity Erosion)**: The parasite floods your brain with cosmic signal. +2d8 radiant, crit 19-20, ignores 50% armor, but roll Delirium each turn and lose 5 max HP/round. This is your nuclear option -- devastating but self-destructive. Never stay here longer than you must.
- **Waning Moon (Vitality Drain)**: The parasite drinks your life force. -3 mana costs, +10ft spell range, debuffs last +1 round, 25% vampiric healing, but -2 Armor, -10ft speed, -10 max HP. Use this to recover through vampirism while controlling the field.

**The Transition Shock Table**:
Every shift (natural or manual), roll 1d6:
| d6 | Effect |
|---|---|
| 1 | Tissue Rupture -- Take 2d6 necrotic as flesh tears along starlight seams |
| 2 | Synaptic Flash -- Blinded for 1 round as the parasite reroutes your optic nerves |
| 3 | Mana Hemorrhage -- Lose 2d4 mana as the parasite drains arcane reserves |
| 4 | Temporal Dissonance -- Lose 1 AP on your next turn as time stutters |
| 5 | Psychic Whiplash -- Take 1d6 psychic damage, disadvantage on next save |
| 6 | Parasitic Mercy -- Only 1 necrotic damage. The parasite is sated... for now |

**The Healing Problem**:
You CANNOT be healed by standard magical means. A cleric casting healing spells on you deals psychic damage instead. Your only recovery options are: Waning Moon vampirism (25% of damage dealt), Sanguine Warden blood-rites (cost your own HP), and specific self-damage spells that convert parasite-feeding into temporary sustenance. Plan accordingly.

**Round Manipulation**:
Your unique utility. Key abilities let you add or remove rounds from effects, extend debuffs on enemies, compress buff durations on allies, and force enemies to "sync" with your current phase. This makes you the only class that can accelerate or decelerate the entire battlefield's tempo.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Ranged Support/Control with adaptive damage potential

**Combat Strengths**:
- Exceptional versatility through phase shifting
- Strong ranged damage during Full Moon phase
- Excellent healing and support during Waxing Moon phase
- Superior mana efficiency and control during Waning Moon phase
- Enhanced survivability during New Moon phase

**Combat Weaknesses**:
- Requires careful phase management and timing
- Less effective when caught in wrong phase for situation
- Cannot self-heal (all healing is ally-targeted only)
- No teleport abilities (Moon Glide provides speed, not instant repositioning)
- Phase Lock: taking damage while shifting phases cancels the shift and costs the mana
- Eclipse Vulnerability: During the round you shift phases, the celestial transition leaves you exposed. Roll 1d4 on the Transition Shock table each time you shift:
| d4 | Effect |
|---|---|
| 1 | Celestial Burn - Take 1d8 radiant damage as the phase tears through you. |
| 2 | Lunar Dizziness - You have disadvantage on your next attack roll this turn. |
| 3 | Mana Drain - Lose 1d4 mana as the shift consumes energy. |
| 4 | Exposed - You take double damage from the next attack that hits you this round. |
- Mana-dependent for both spells and phase shifting
- Vulnerable in melee range

**Optimal Positioning**:
Lunarchs excel at medium to long range (30-60 feet), where they can safely cast spells and loose arrows while maintaining awareness of the battlefield. They should position to maximize phase benefitsâ€”staying near allies during support phases, maintaining distance during offensive phases.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Phase Management**:
The key to mastering the Lunarch is understanding when to shift phases and when to let them cycle naturally. Each phase offers distinct advantages:

- **New Moon**: Use for recovery, mana regeneration, and defensive positioning. Ideal when you need to reset or prepare for the next engagement.
- **Waxing Moon**: Perfect for supporting allies with enhanced healing and buffs. Shift here when your team needs sustain.
- **Full Moon**: Your damage phase. Unleash devastating attacks and maximize offensive spell power.
- **Waning Moon**: Control and efficiency phase. Extend debuffs, reduce mana costs, and maintain battlefield control.

**Resource Economy**:
Manual phase shifting costs 8 mana, so balance between natural cycling (every 3 rounds) and tactical shifts. Don't waste mana shifting unnecessarilyâ€”plan ahead and anticipate combat flow.

**Spell Selection**:
Choose spells that synergize with your preferred phases. Moonlight Sentinels focus on damage spells enhanced by Full Moon, Starfall Invokers leverage AoE during all phases, and Moonwell Guardians maximize Waxing Moon healing.

**Team Dynamics**:
- Coordinate with tanks to know when you'll need defensive phases
- Communicate with healers about when you'll shift to Waxing Moon for support
- Time Full Moon phases with your team's burst damage windows
- Use Waning Moon to extend crowd control effects from allies`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Parasite Feeds",
      content: `**The Setup**: You are a Level 4 Lunarch (Hollow Sentinel). Your nervous system hosts a celestial parasite that rewrites your flesh every 3 rounds. You are fighting 3 Corpse-Weavers (undead, bludgeoning attacks -- your worst nightmare) and 1 Corpse-Weaver Matriarch. Starting Phase: New Moon. Starting Mana: 50/60. HP: 55/65. Your Phylactery... you don't have one. You just have scars that glow in the dark.

**Starting State**: Phase: New Moon (Memory Eater) | Mana: 50/60 | HP: 55/65 | Round: 1

**NEW MOON -- THE MEMORY EATER (Rounds 1-3)**

**Turn 1 -- The Parasite Takes the Reins (Phase: New Moon, Round 1/3)**

*The Corpse-Weavers emerge from the darkness, their limbs clicking. You feel the parasite stir at the base of your skull -- cold, hungry, patient. New Moon. It is feeding on your memories. Your mother's face is already blurry.*

**New Moon (Memory Eater) Active**:
- +3 Armor (parasite controls motor function -- your body dodges before you think)
- Immune to Charm and Fear
- -2 to all attack rolls (you can barely remember how to aim)
- Lose 1d4 mana at start of turn (the parasite eats thought)

**Mana Drain**: -1d4 → [3] = -3 mana
**Mana**: 50 - 3 = 47/60

*Your hands move without your permission. The parasite knows where the enemies are even if you're starting to forget why you're here.*

**Your Action**: Cast "Parasitic Bolt" at Corpse-Weaver #1 (4 mana)
**Attack Roll**: d20+6, but -2 from Memory Eater → [12] = Hit!
**Base Damage**: 1d8 radiant → [6] = 6 radiant
**New Moon Phase Bonus**: Target loses 1d4 mana or takes 1d4 extra necrotic → [3] necrotic
**Total Damage**: **6 radiant + 3 necrotic = 9 damage**
**Self-Damage from Parasitic Bolt**: 1d4 necrotic → [2] = 2 necrotic to you

**HP**: 55 - 2 = 53/65
**Mana**: 47 - 4 = 43/60

*The bolt punches through the Weaver's carapace. Cold white light bleeds from the wound. You feel a distant kinship with the thing -- something alien lives in both of you.*

**Corpse-Weaver #2's Turn**: Attacks you with bludgeoning slam!
**Attack Roll**: d20+5 → [15] = Hit!
**Damage**: 1d8+3 bludgeoning → [7] + 3 = 10 bludgeoning
**CELESTIAL REJECTION (Fatal Flaw)**: +25% vulnerability to Bludgeoning → 10 × 1.25 = **12 bludgeoning damage**

*The slam connects with your ribs. You feel something SHIFT inside -- not bone breaking, but the parasite's tendrils being jostled. Starlight bleeds from the impact site. Pain is distant. The Memory Eater is consuming the part of you that processes agony.*

**HP**: 53 - 12 = 41/65

**Current State**: Phase: New Moon (Round 1/3) | Mana: 43/60 | HP: 41/65

**Turn 2 -- Paying in Flesh (Phase: New Moon, Round 2/3)**

**Mana Drain**: -1d4 → [2] = -2 mana. *Your memory of last night's campfire fades.*
**Mana**: 43 - 2 = 41/60

**Your Action**: Cast "Phase Tear" -- Force shift to FULL MOON (8 mana + 1d8+2 necrotic self-damage)
*You cannot endure another round of being a punching bag. You reach into the parasite's cycle and TEAR yourself toward Full Moon. Your flesh screams.*

**Phase Shift Cost**: 8 mana + 1d8+2 necrotic → [6] + 2 = 8 necrotic to you
**Transition Shock Table (1d6)**: [4] = **Temporal Dissonance** -- lose 1 AP on your next turn

*Your skin splits along the starlight seams. Cold white light pours from the cracks. Your perception SHATTERS -- for a moment, you see through the moon's eyes. Everything is so small. Everything is so breakable.*

**Mana**: 41 - 8 = 33/60
**HP**: 41 - 8 = 33/65

**FULL MOON -- THE SANITY EROSION (Rounds 2-4)**

**Full Moon Active**:
- +2d8 radiant damage on all attacks
- Critical hits on 19-20
- Attacks ignore 50% of Armor
- DELIRIUM: Roll on Delirium Table at start of each turn
- -5 max HP per round in this phase

**Max HP Reduction**: 65 - 5 = 60 (temporary)
**HP**: 33/60 (still 33 HP, but ceiling drops)

**Delirium Roll (1d4)**: [3] = Take 1d6 psychic damage
**Psychic Damage**: [4] = 4 psychic. *The cosmos whisper a name. It might be yours. It might be the name of the star that will die last.*

**HP**: 33 - 4 = 29/60

**Your Action**: Cast "Parasitic Bolt" at Corpse-Weaver #1 (4 mana, Full Moon bonus)
**Attack Roll**: d20+6 → [19] = **CRITICAL HIT!** (19-20 crit range)
**Base Damage**: 1d8 radiant → [8] = 8, doubled = 16 radiant
**Full Moon Bonus**: +2d8 radiant → [7, 6] = 13, doubled = 26 radiant
**Total Critical Damage**: **42 radiant damage**
**Self-Damage**: 1d4 necrotic → [3] = 3

*The bolt doesn't just hit the Weaver. It UNRAVELS it. Cold starlight erupts from every joint, every orifice, every crack in its carapace. The thing doesn't die -- it stops. Mid-motion. Frozen in a moment of cosmic horror. Then it collapses into a pile of light-bleached chitin.*

**Corpse-Weaver #1**: OBLITERATED

**HP**: 29 - 3 = 26/60
**Mana**: 33 - 4 = 29/60

**Current State**: Phase: Full Moon (Round 1/3) | Mana: 29/60 | HP: 26/60 (max reduced)

**Turn 3 -- The Matriarch (Phase: Full Moon, Round 2/3)**

**Max HP Reduction**: 60 - 5 = 55 (cumulative)
**Delirium Roll**: [1] = **Attack nearest creature.** *The parasite doesn't care about tactics. It is hungry and the Matriarch is too far.*

**Your Action (FORCED)**: Attack nearest target -- Corpse-Weaver #3 (adjacent)
**Attack Roll**: d20+6 → [17] = Hit!
**Damage**: 1d8 + 2d8 radiant (Full Moon) → [7] + [5, 8] = 20 radiant
**Self-Damage**: 1d4 → [1] = 1

**Corpse-Weaver #3**: Severely wounded
**HP**: 26 - 1 = 25/55
**Mana**: 29 (no mana spent -- forced basic attack)

**Matriarch's Turn**: Slams you with bludgeoning attack!
**Damage**: 2d8+5 bludgeoning → [8, 6] + 5 = 19 → ×1.25 (Celestial Rejection) = **23 bludgeoning**

*The Matriarch's massive limb catches you square in the chest. You HEAR your own ribs crack -- not bone, but the starlight seams rupturing. White light sprays from your mouth. You taste cold vacuum.*

**HP**: 25 - 23 = 2/55

**Your Party's Healer**: "I'll heal you!"
**You**: "DON'T. Your healing will KILL me. The parasite eats foreign magic and feeds it back as psychic damage. I need to shift to Waning and vampiric drain."

**Your Party's Tank**: Interposes, blocking the Matriarch's next attack.

**Current State**: Phase: Full Moon (Round 2/3) | Mana: 29/60 | HP: 2/55 (max reduced)

**Turn 4 -- Survival Through Parasitism (Manual Shift to Waning Moon)**

*You are dying. The Full Moon is eating you from the inside. You reach into the cycle and RIP yourself toward Waning. The parasite protests -- it was enjoying the Sanity Erosion. Your flesh tears again.*

**Phase Shift**: Full Moon → Waning Moon (8 mana + 1d8+2 necrotic)
**Shift Cost**: 1d8+2 → [5] + 2 = 7 necrotic
**Transition Shock**: [6] = **Parasitic Mercy** -- only 1 necrotic. *The parasite is briefly sated from the Sanity Erosion feeding. It almost feels... grateful.*

**Total Self-Damage from Shift**: 7 + 1 = 8 necrotic
**HP**: 2 - 8 = ... **-6 HP**

*You collapse. Starlight bleeds from your eyes, your mouth, the seams in your skin. The parasite SCREAMS inside your skull -- not in fear, but in fury. Its host is dying and it has not finished feeding.*

**Your Party's Tank**: "THE LUNARCH IS DOWN!"

*...but then your body TWITCHES. The Waning Moon takes hold. The parasite, desperate to preserve its host, inverts its feeding -- drinking from the ambient life force of everything around you rather than from your own fading body.*

**WANING MOON -- THE VITALITY DRAIN Active**:
- -3 mana costs
- 25% vampiric healing on all damage dealt
- -2 Armor, -10 max HP
- But you're at NEGATIVE HP. The vampirism kicks in as a death-sustaining reflex.

**Your Action**: Cast "Void Rend" at Matriarch and nearby Weavers (reduced cost: 8-3 = 5 mana)
**Damage**: 3d6 radiant → [5, 6, 4] = 15 radiant (AoE, hits all 3 enemies)
**Vampiric Healing**: 25% of 15 × 3 targets hit = 25% of 45 = 11 HP healed!

**HP**: -6 + 11 = 5/45 (max HP reduced by 10 from Waning + accumulated Full Moon penalties)
**Mana**: 29 - 8 + 3 = 24/60 (Waning cost reduction applied)

*You drag yourself upright. Blood-tinged moonlight drips from your fingertips. Your veins are black. Your skin is gray. But you are ALIVE, and the parasite is HUNGRY, and the Matriarch is looking at you with something it has never felt before: fear.*

**Combat Continues...**

**The Lesson**: Playing a Lunarch is about:
1. **Choosing Your Suffering**: New Moon for survivability at the cost of offense. Full Moon for devastation at the cost of sanity and HP. Waning for vampiric sustain at the cost of defense.
2. **The Flesh Economy**: Every shift costs blood. The Transition Shock Table is always looming. You cannot be healed normally. Your HP is a countdown timer, not a health bar.
3. **Celestial Rejection is Real**: That Bludgeoning vulnerability is not theoretical. Two hits took you from 55 HP to death's door. Avoid blunt weapons at all costs.
4. **Phase Weaponization**: You don't just cycle phases for yourself -- you spread them to enemies, manipulate round counts, and force the entire battlefield to sync with your parasite's feeding schedule.
5. **The Delirium Gamble**: Full Moon's damage is unmatched, but the Delirium Table can force you to attack allies or lose your turn. Never stay in Sanity Erosion longer than absolutely necessary.
6. **Vampiric Emergency**: Waning Moon's 25% vampirism is your only reliable self-heal. When you're dying, shifting to Waning and dealing AoE damage can pull you back from the brink -- but it requires enemies to be nearby and mana to be available.`,
    },
  },

  resourceSystem: {
    title: "The Lunar Parasite Economy",
    subtitle: "Flesh Is the Currency of the Cosmos",

    description: `The Lunar Cycle is not a tool. It is a feeding schedule imposed by an alien parasite fused to the Lunarch's nervous system. Every three rounds, the parasite FORCEFULLY REWRITES the host's physiology to extract a different nutrient -- memory, sensation, sanity, or vitality. This is not optional. This is not free. Every natural cycle shift deals 2d6 irreducible necrotic damage as the Lunarch's flesh tears along invisible seams where starlight has replaced connective tissue. The Lunarch cannot stop the feeding. They can only direct it -- choosing which horror to embrace at the cost of their own blood, and praying the parasite's hunger can be weaponized against their enemies before it consumes them entirely.`,

    cards: [
      {
        title: "New Moon -- The Memory Eater",
        stats: "+3 Armor | Immune: Charm/Fear | -2 Attacks | -1d4 Mana/turn",
        details:
          "The parasite feeds on cognition. You lose memories, tactical awareness, and fine motor control. In exchange, the parasite drives your body autonomously -- reacting to threats faster than conscious thought. You are a passenger in your own flesh. You start every combat here.",
      },
      {
        title: "Waxing Moon -- The Sensation Harvest",
        stats: "+1d6 Damage | +10ft Speed | Adv Perception | 1d4 Necrotic/turn | No Healing",
        details:
          "The parasite feeds on nerve endings. Every sensation is amplified into agony. Pain becomes power -- channeled into destructive force and hyper-awareness. But you CANNOT be healed by any means during this phase. The parasite intercepts all restoration and converts it into more sensation to feed on.",
      },
      {
        title: "Full Moon -- The Sanity Erosion",
        stats: "+2d8 Radiant | Crit 19-20 | Ignores 50% Armor | Delirium Roll/turn | -5 Max HP/round",
        details:
          "The parasite floods your brain with cosmic signal. Reality fractures. Your attacks become terrifying -- raw stellar radiation channeled through a breaking mind. But each turn you must roll on the Delirium Table: attack an ally, lose AP, take psychic damage, or -- rarely -- nothing. Your max HP erodes every round you remain.",
      },
      {
        title: "Waning Moon -- The Vitality Drain",
        stats: "-3 Mana Costs | 25% Vampiric | +10ft Range | +1 Rnd Debuffs | -2 Armor | -10 Max HP",
        details:
          "The parasite drinks raw life force. Your body withers -- skin grays, veins blacken, breath shallows. But the siphoned vitality is converted into arcane efficiency and vampiric healing. This is your only reliable self-sustain. The 25% vampirism on all damage dealt is how you survive.",
      },
    ],

    generationTable: {
      headers: ["Action", "Cost", "Effect"],
      rows: [
        [
          "Natural Cycle",
          "2d6 Necrotic (irreducible)",
          "Auto-advances to next phase every 3 rounds. The parasite feeds. You bleed.",
        ],
        [
          "Manual Phase Shift",
          "8 Mana + 1d8+2 Necrotic",
          "Choose your horror. Resets 3-round timer. Roll Transition Shock (1d6).",
        ],
        [
          "Total Eclipse (Lv6)",
          "15 Mana + 3d6 Necrotic",
          "Gain TWO phases simultaneously for 2 rounds. Both drawbacks. Both boons. Roll Transition Shock twice.",
        ],
      ],
    },

    usage: {
      momentum:
        "Full Moon (Sanity Erosion) is your nuclear option. +2d8 radiant, crit 19-20, ignores half armor -- but the Delirium Table can force you to attack allies and your max HP bleeds away every round. Never stay longer than you must. Get in, unleash hell, get out.",
      flourish:
        "Waning Moon (Vitality Drain) is your survival phase. The 25% vampirism is your ONLY reliable self-heal. When you're dying -- and you will be dying often -- shift to Waning and deal AoE damage to pull yourself back from the brink. The -2 Armor hurts, but being dead hurts more.",
    },

    overheatRules: {
      title: "The Transition Shock Table",
      content: `Every time a phase shift occurs -- natural cycle OR manual -- the Lunarch's flesh tears along the starlight seams where the parasite has replaced connective tissue. Roll 1d6:

| d6 | Name | Effect |
|---|---|---|
| 1 | Tissue Rupture | Take 2d6 necrotic damage as flesh splits along starlight seams |
| 2 | Synaptic Flash | Blinded for 1 round as the parasite reroutes optic nerves |
| 3 | Mana Hemorrhage | Lose 2d4 mana as the parasite drains arcane reserves to fuel transition |
| 4 | Temporal Dissonance | Lose 1 AP on your next turn as your perception of time stutters |
| 5 | Psychic Whiplash | Take 1d6 psychic damage and disadvantage on your next saving throw |
| 6 | Parasitic Mercy | Only 1 necrotic damage. The parasite is briefly sated. It almost feels... grateful. |

**The Delirium Table (Full Moon Only)**:
At the START of each turn during Full Moon (Sanity Erosion), roll 1d4:

| d4 | Effect |
|---|---|
| 1 | Cosmic Hallucination -- You MUST attack the nearest creature (ally or enemy) with your next action |
| 2 | Temporal Seizure -- Lose 1 AP this turn as your body convulses with starlight |
| 3 | Psychic Bleed -- Take 1d6 psychic damage as the cosmos whisper the names of dead stars |
| 4 | Moment of Clarity -- No drawback this turn. The parasite blinks. Make it count. |`,
    },

    strategicConsiderations: {
      title: "The Flesh Economist",
      content: `**The 3-Round Death Clock**: Every 3 rounds, the parasite forces a natural cycle shift. This deals 2d6 necrotic damage AND forces a Transition Shock roll. You cannot opt out. You cannot reduce the damage. You can only choose WHICH phase you bleed into by shifting manually (which costs MORE blood). Every combat is a countdown -- how many cycles can your body survive before the parasite consumes more than you can replenish?

**The Healing Problem**: You CANNOT be healed by standard magical means. The parasite devours foreign magic and converts it to psychic feedback. A cleric's healing spell deals psychic damage to you equal to 50% of the heal amount. Your ONLY recovery options are:
- Waning Moon vampirism (25% of all damage dealt returns as HP)
- Sanguine Warden blood-rites (heal allies by damaging yourself, then leech life back through Waning)
- Specific self-damaging spells that convert the parasite's feeding into temporary sustenance
- Natural HP recovery during short/long rests (the parasite sleeps too)

**The Bludgeoning Death Sentence**: Your starlight-infused organs are fragile. +25% vulnerability to Bludgeoning damage means a single critical hit from a mace, hammer, or slam attack can rupture your internal seams. Avoid. Blunt. Weapons. At. All. Costs.

**Phase Triage (Choose Your Suffering)**:
- Being focused by enemies? New Moon. The +3 Armor and charm/fear immunity might keep you alive. You'll hit like a toddler, but you'll be alive.
- Healthy and need damage? Waxing Moon. +1d6 damage and +10ft speed. You'll take 1d4 necrotic/turn and can't be healed, but if you're healthy that's manageable.
- Something needs to DIE right now? Full Moon. +2d8 radiant, crit 19-20, ignores half armor. You may hallucinate and stab your healer. Your max HP drops every round. Get in, kill, get out.
- Dying and need sustain? Waning Moon. -3 mana costs and 25% vampirism. Your body withers but you steal life from everything you damage. This is your emergency room.

**Round Manipulation (Your Unique Edge)**:
No other class can manipulate the passage of rounds. Key applications:
- Extend debuffs on enemies by adding rounds
- Compress buff durations on allies by removing wasted rounds
- Force enemies to "sync" with your current phase via Phase Contagion
- Accelerate or decelerate the battlefield's entire tempo to match your parasite's feeding cycle`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Wound Tracker",
      content: `Tracking a 4-phase cycle that damages you every 3 rounds requires physical props. The Lunarch bleeds. Make it visible.

**Required Materials**:
- **Phase Dial** -- A disc marked with 4 phases. Use a red clothespin to mark the current phase. The red reminds everyone you are suffering.
- **Damage d6** -- Roll this EVERY cycle shift. Natural or manual. No exceptions. The table should hear it.
- **Self-Damage Tracker** -- A row of d6s or tokens showing accumulated self-damage this combat. When it gets scary, the table feels it.

**The Physical Hack**:
- **The Bleeding Token**: Start with 10 red glass beads. Every time you take self-damage from a phase shift, remove one. When you're out of beads, your character is in critical danger. The whole table can see your countdown.
- **The Seam Lines**: Draw thin white lines on your character sheet with a gel pen. When you shift phases, trace one with your finger. These are the seams where the parasite has replaced your connective tissue with starlight. They glow faintly under UV light.
- **The Moon Coin**: A large coin, silver on one side (Full/Waxing), black on the other (New/Waning). Flip it on shifts. When it lands silver-side-up during Full Moon, everyone at the table tenses.

**Quick Reference**:
\`\`\`
CYCLE:  New Moon (Memory Eater) → Waxing (Sensation) → Full Moon (Sanity) → Waning (Vitality)
TIMER:  3 Rounds per Phase (FORCED, costs 2d6 necrotic)
SHIFT:  8 Mana + 1d8+2 Necrotic (Choose phase, roll Transition Shock 1d6)
HEAL:   Cannot be healed by magic. Waning vampirism only.
WEAK:   +25% Bludgeoning vulnerability. Avoid hammers.
\`\`\`

**Tactile Tip**: When you "Shift" manually, physically press your hand against the base of your skull where the parasite fused. Flinch slightly. The other players should feel uncomfortable watching you decide which part of yourself to sacrifice next.`,
    },
  },

  // Specializations
  specializations: {
    title: "Lunarch Specializations",
    subtitle: "Three Expressions of the Parasite's Hunger",

    description: `The parasite has fused with your nervous system, but HOW it manifests depends on which part of your anatomy it has colonized most aggressively. Every Lunarch develops one dominant expression of the infection -- a specialization that determines how the parasite's feeding is weaponized. These are not choices made at a temple or academy. They are biological mutations. The parasite reshapes you according to its own unknowable criteria, and you discover your specialization the first time you survive a phase shift that should have killed you.`,

    sharedPassive: {
      name: "Parasitic Bond",
      icon: "Arcane/Star Trail Path",
      description:
        "The parasite grants you darkvision up to 60 feet -- your eyes have been partially replaced with photosensitive starlight receptors. You are immune to magical charm and fear effects during Full Moon (Sanity Erosion) because there is nothing left of your 'self' for those effects to target. You can see the seams in reality where the parasite has touched the world.",
    },

    specs: [
      { id : "hollow-sentinel",
        name: "Hollow Sentinel",
        icon: "Nature/Owl",
        color: "#A0A0A0",
        theme: "Precision Killer",

        description: `The parasite has hollowed out the Lunarch's eyes, replacing the vitreous humor with condensed starlight. They do not see the world as others do -- they perceive it through the parasite's alien geometry, a lattice of angles and trajectories where every living thing is a target and every gap in armor is a screaming invitation. The Hollow Sentinel is a precision killer, and the parasite aims through them like a weapon. During Full Moon, their strikes bypass armor entirely -- the starlight in their eyes can see through solid matter, finding the soft tissue beneath.`,

        playstyle:
          "Precision ranged assassin who must carefully manage Full Moon (Sanity Erosion) to land devastating armor-ignoring critical strikes while surviving the Delirium Table",

        strengths: [
          "Ranged attacks ignore 25% of Armor (the parasite calculates weak points)",
          "Critical hits during Full Moon deal additional 2d6 psychic damage -- the target glimpses the cosmos through the wound",
          "Can mark targets, making them visible through walls and immune to concealment",
          "Devastating single-target elimination potential",
        ],

        weaknesses: [
          "No AoE capability -- every shot is a single, surgical incision",
          "Full Moon Delirium can force you to attack allies instead of your marked target",
          "Extremely vulnerable when caught in melee (no close-range tools)",
          "Overwhelming dependence on Full Moon for peak performance",
        ],

        passiveAbilities: [
          {
            name: "Parasitic Bond",
            tier: "Path Passive",
            description:
              "The parasite grants you darkvision up to 60 feet and immunity to charm/fear during Full Moon. Your eyes contain starlight receptors that see through the parasite's alien geometry.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Starlight Sockets",
            tier: "Specialization Passive",
            icon: "Piercing/On the Mark",
            description:
              "Your ranged attacks ignore 25% of the target's Armor. The starlight in your eyes perceives structural weak points in any defense. During Full Moon (Sanity Erosion), critical hits deal an additional 2d6 psychic damage as the wound channels a glimpse of the cosmos directly into the target's mind.",
            uniqueTo: "Hollow Sentinel",
          },
          {
            name: "Hollow Mark",
            tier: "Specialization Ability",
            icon: "Piercing/Targeted Strike",
            description:
              "When you hit a creature with a ranged attack, you can mark them until the end of your next turn. Marked creatures are visible to you through walls and concealment. Your next spell against a marked creature deals +1d6 radiant damage as the parasite focuses its hunger.",
            uniqueTo: "Hollow Sentinel",
          },
        ],

        recommendedSpells: [
          "Parasitic Bolt - Your primary ranged attack, damages you as it damages them",
          "Hollow Sight - Mark priority targets for armor-piercing elimination",
          "Hollow Volley - Multi-target execution during Full Moon",
          "Phase Tear - Force-shift to Full Moon when a target must die NOW",
        ],
      },
      { id : "void-caller",
        name: "Void Caller",
        icon: "Arcane/Missile",
        color: "#2A0040",
        theme: "Reality Warper",

        description: `The parasite has opened a channel to the void between stars -- the cold, hateful space where light goes to die. The Void Caller does not 'call down stars' or 'invoke celestial energy.' They tear holes in reality through which cold, predatory starlight bleeds. These rifts contaminate everything they touch, spreading cosmic sickness that disadvantages enemies and corrodes their ability to fight. The Void Caller is a battlefield controller who warps the geometry of combat, and their AoE abilities apply 'Star-Sickness' -- a lingering contamination that represents the parasite spreading its influence through the wounds it creates.`,

        playstyle:
          "Battlefield controller who tears reality apart, spreading cosmic contamination and phase contagion across entire enemy formations",

        strengths: [
          "AoE spells apply Star-Sickness: disadvantage on next attack roll, 1d4 radiant damage at start of turn for 2 rounds",
          "During Waxing Moon, AoE radius increases by 5 ft (the parasite's tendrils reach further when feeding on sensation)",
          "Can spread the current phase's effects to enemies via Phase Contagion",
          "Round manipulation -- add or remove rounds from active battlefield effects",
        ],

        weaknesses: [
          "Lower single-target damage than Hollow Sentinel",
          "Self-damage from AoE spells is higher (the parasite feeds more aggressively when reality tears)",
          "Requires precise positioning to avoid hitting allies with contamination",
          "Mana-intensive -- most abilities cost 2+ more mana than equivalent Hollow Sentinel spells",
        ],

        passiveAbilities: [
          {
            name: "Parasitic Bond",
            tier: "Path Passive",
            description:
              "The parasite grants you darkvision up to 60 feet and immunity to charm/fear during Full Moon. Your eyes contain starlight receptors that see through the parasite's alien geometry.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Void Aperture",
            tier: "Specialization Passive",
            icon: "Arcane/Star Trail Path",
            description:
              "Your AoE spells during Full Moon apply Star-Sickness to all enemies hit: disadvantage on their next attack roll and 1d4 radiant damage at the start of their next turn for 2 rounds. During Waxing Moon, all AoE spell radii increase by 5 feet as the parasite's tendrils extend through the tears in reality.",
            uniqueTo: "Void Caller",
          },
          {
            name: "Phase Contagion",
            tier: "Specialization Passive",
            icon: "Arcane/Magical Sword",
            description:
              "When you deal damage with an AoE spell, you can choose to spread your current phase's horror to one enemy hit. New Moon: target loses 1d4 mana or takes 1d4 psychic damage. Waxing: target takes 1d4 extra necrotic. Full Moon: target has disadvantage on next save. Waning: target loses 5 ft speed for 1 round.",
            uniqueTo: "Void Caller",
          },
        ],

        recommendedSpells: [
          "Void Rend - Your signature AoE, tears reality and spreads Star-Sickness",
          "Void Beam - Line attack that leaves a trail of cosmic contamination",
          "Void Collapse - Massive AoE with phase contagion",
          "Total Eclipse - Ultimate reality distortion, gain two phases at double the cost",
        ],
      },
      { id : "sanguine-warden",
        name: "Sanguine Warden",
        icon: "Nature/Ethereal Bird",
        color: "#8B0000",
        theme: "Self-Mutilating Healer",

        description: `The Sanguine Warden has learned to redirect the parasite's feeding outward -- siphoning vitality from the moon's gravitational pull and channeling it through their own bleeding flesh to mend allies. This is not holy healing. This is not divine intervention. The Sanguine Warden literally bleeds moonlight, tearing open the starlight seams in their own body to create conduits through which stolen life force can flow into wounded companions. During Waxing Moon, their healing is increased by 50% because the parasite's sensation-feeding creates more tears to channel through -- but each heal costs the Warden 1d4 necrotic damage as they rip themselves open further. During Waning Moon, a vampiric feedback loop allows them to recover 25% of the healing they deal to others. The Sanguine Warden is the only Lunarch who can semi-reliably sustain themselves, and they do it by making their own suffering into medicine.`,

        playstyle:
          "Self-mutilating healer who bleeds moonlight to keep allies alive, sustaining themselves through vampiric feedback loops during Waning Moon",

        strengths: [
          "Only Lunarch spec with reliable self-sustain (Waning Moon vampiric feedback)",
          "Healing is increased by 50% during Waxing Moon (more flesh-tears to channel through)",
          "Can create persistent healing zones that pulse with stolen life force",
          "Allies healed by the Sanguine Warden gain temporary HP from the parasite's residue",
        ],

        weaknesses: [
          "Every heal costs the Warden HP -- you are literally bleeding yourself dry to keep others alive",
          "Lowest damage output of all Lunarch specs",
          "Must stay in Waning Moon as long as possible to recover from Waxing Moon healing binges",
          "Cannot benefit from OTHER healers (Celestial Rejection applies to all magical healing)",
        ],

        passiveAbilities: [
          {
            name: "Parasitic Bond",
            tier: "Path Passive",
            description:
              "The parasite grants you darkvision up to 60 feet and immunity to charm/fear during Full Moon. Your eyes contain starlight receptors that see through the parasite's alien geometry.",
            sharedBy: "All Lunarch",
          },
          {
            name: "Blood Rite",
            tier: "Specialization Passive",
            icon: "Radiant/Radiant Golden Shield",
            description:
              "Your healing spells during Waxing Moon deal 1d4 necrotic damage to you but heal for 50% more. During Waning Moon, you recover 25% of all healing you deal to others as self-healing (vampiric feedback). This is the only reliable way a Lunarch can sustain themselves.",
            uniqueTo: "Sanguine Warden",
          },
          {
            name: "Parasitic Sanctuary",
            tier: "Specialization Passive",
            icon: "Healing/Prayer",
            description:
              "During New Moon (Memory Eater), all allies within 15 feet gain +1 Armor as the parasite's defensive reflexes extend to protect nearby life signatures. During Waning Moon, allies healed by you also gain 1d6 temporary HP from the parasite's residue -- starlight-scabbed wounds that harden into protective barriers.",
            uniqueTo: "Sanguine Warden",
          },
        ],

        recommendedSpells: [
          "Sanguine Transfer - Heal an ally at the cost of your own HP",
          "Sanguine Rites - Major heal during Waxing Moon for massive recovery",
          "Sanguine Deluge - AoE heal at massive self-cost during critical moments",
          "Phase Tear - Shift to Waning Moon to recover via vampiric feedback",
        ],
      },
    ],
  },

  // Example Spells - showcasing Phase Shift mechanics
  exampleSpells: [
    // MOONLIGHT SENTINEL - Precision Archery → HOLLOW SENTINEL - Precision Killer
    { id : "lunarch_parasitic_bolt",
      name: "Parasitic Bolt",
      description:
        "Channel a sliver of the parasite's hunger into a bolt of condensed starlight that burrows into the target. The casting tears a seam in your palm -- you bleed, they bleed, the parasite feeds on both.",
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Tear open palm, channel starlight through the wound",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["radiant"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Damage type becomes necrotic. Target loses 1d4 mana or takes 1d4 extra necrotic if no mana.",
          waxingMoon: "Add +1d4 radiant damage. Take 1 necrotic damage.",
          fullMoon: "Add +1d8 radiant damage and increase crit range by 2.",
          waningMoon: "Heal for 25% of damage dealt. Costs 1 less mana (minimum 1).",
        },
        selfDamage: "Take 1d4 necrotic damage when you cast this spell",
        phaseAdvancement: 1,
      },

      tags: ["radiant", "damage", "ranged", "phase dependent", "self damage"],
    },

    { id : "lunarch_phase_tear",
      name: "Phase Tear",
      description:
        "Gouge your own flesh to fuel a violent phase shift, releasing a shockwave of stellar energy that damages nearby enemies based on which horror you drag yourself into.",
      spellType: "ACTION",
      icon: "Force/Explosion Burst",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage", "utility"],

      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Drive fingers into the starlight seams and tear",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d6",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 13,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Enemies within 10 ft lose 1d4 mana or take 1d4 psychic. Gain +1 Armor until next turn.",
          waxingMoon: "Enemies within 10 ft take 1d4 extra radiant. Gain +10 ft speed until next turn.",
          fullMoon: "Enemies within 15 ft take 2d6 radiant. Gain +1d6 radiant on next attack.",
          waningMoon: "Enemies within 10 ft slowed 1 round (save negates). Heal 1d4 HP.",
        },
        shiftEffect: "Force manual phase shift. Deals 1d8+2 necrotic and triggers Transition Shock.",
      },

      tags: ["utility", "phase shift", "damage", "universal", "self damage"],
    },

    { id : "lunarch_moon_touched_wound",
      name: "Moon-Touched Wound",
      description:
        "Strike a target in melee with a hand seething with parasitic starlight. The wound glows with cold light and inflicts a phase-dependent affliction.",
      spellType: "ACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      level: 1,
      specialization: "universal",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 10,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 3 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Drive starlight-infused fingers into flesh",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "1d6 + intelligence/4",
        damageTypes: ["radiant"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness_minor",
            name: "Star-Sick Wound",
            description: "Wound glows with cold starlight. Phase-dependent debuff.",
            statusType: "weakened",
            level: "minor",
            mechanicsText: "Effect varies by current phase",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Target has disadvantage on next attack roll.",
          waxingMoon: "Target takes 1d4 necrotic per round for 2 rounds.",
          fullMoon: "Target has disadvantage on all saves for 2 rounds.",
          waningMoon: "Target loses 5 ft speed for 2 rounds.",
        },
      },

      tags: ["radiant", "damage", "debuff", "melee", "phase dependent", "universal"],
    },

    { id : "lunarch_crescent_blade",
      name: "Crescent Blade",
      description:
        "Sweep a blade of crystallized parasite-secretion in a horizontal arc. It cuts cleanly but feeds on your nerve endings with each swing.",
      spellType: "ACTION",
      icon: "Arcane/Magical Cross Emblem 2",
      level: 2,
      specialization: "universal",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "cone",
        rangeType: "melee",
        rangeDistance: 15,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Sweep arm, excrete crystallized parasite membrane",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "2d8",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Damage type becomes necrotic. Targets have disadvantage on next attack.",
          waxingMoon: "Add +1d4 radiant. Take 1d4 necrotic yourself.",
          fullMoon: "Add +1d8 radiant, increase crit range by 1.",
          waningMoon: "Heal for 25% of total damage dealt. Costs 1 less mana.",
        },
      },

      tags: ["radiant", "damage", "cone", "phase dependent", "universal"],
    },

    { id : "lunarch_parasitic_stride",
      name: "Parasitic Stride",
      description:
        "The parasite partially phases your body, allowing you to glide through space trailing starlight contamination. You do not run -- you are pulled by the parasite's gravitational will.",
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      level: 2,
      specialization: "universal",
      effectTypes: ["utility"],

      typeConfig: {
        school: "arcane",
        icon: "Nature/Ethereal Bird",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Let the parasite pull, body phases partially",
      },

      resolution: "AUTOMATIC",

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "parasitic_stride",
            name: "Parasitic Stride",
            distance: 30,
            needsLineOfSight: false,
            isSpeedBoost: true,
            grantsOpportunityAttackImmunity: true,
          },
        ],
        duration: 0,
        durationUnit: "instant",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      specialMechanics: {
        trailDamage: "Leave a 5 ft trail of starlight. Enemies entering take 1d4 radiant. Duration: 1 round.",
        phaseInteraction: {
          newMoon: "Speed 45 ft. Trail deals necrotic. Invisible until end of turn.",
          waxingMoon: "Gain +1d4 damage on next attack this turn.",
          fullMoon: "Gain advantage on next attack. Trail deals 1d6 radiant.",
          waningMoon: "Heal 25% of trail damage. Mana cost reduced by 1.",
        },
      },

      tags: ["utility", "movement", "trail damage", "phase dependent", "universal"],
    },

    { id : "lunarch_celestial_rejection",
      name: "Celestial Rejection",
      description:
        "PASSIVE: +25% Bludgeoning vulnerability (starlight-infused organs rupture under blunt trauma). Immune to standard magical healing -- the parasite devours foreign magic, dealing psychic damage equal to 50% of heal amount instead. Only your own phase-specific restoration works.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        tags: ["passive", "lunarch", "fatal flaw"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        effects: [
          { id : "bludgeoning_vulnerability",
            name: "Organ Rupture",
            description: "+25% Bludgeoning damage taken. Starlight-infused organs rupture under blunt force.",
            statusType: "vulnerability",
            level: "major",
            mechanicsText: "+25% Bludgeoning damage taken",
          },
          { id : "healing_rejection",
            name: "Magic Devourer",
            description: "Magical healing deals psychic damage equal to 50% of heal amount. The parasite devours foreign magic.",
            statusType: "cursed",
            level: "major",
            mechanicsText: "Magical healing deals 50% psychic damage instead",
          },
        ],
      },
      tags: ["passive", "lunarch", "fatal flaw", "vulnerability"],
    },

    { id : "lunarch_phase_lock",
      name: "Phase Lock",
      description:
        "PASSIVE: Taking damage during a manual phase shift interrupts it. Mana and necrotic cost are still paid but the shift fails.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Arcane/Spiral Vortex",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Spiral Vortex",
        tags: ["passive", "lunarch", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "lunarch", "weakness"],
    },

    { id : "lunarch_transition_shock",
      name: "Transition Shock",
      description:
        "PASSIVE: Every phase shift forces a 1d6 Transition Shock roll. 1=Tissue Rupture (2d6 necrotic), 2=Synaptic Flash (blinded 1 rnd), 3=Mana Hemorrhage (lose 2d4 mana), 4=Temporal Dissonance (lose 1 AP next turn), 5=Psychic Whiplash (1d6 psychic + disadv next save), 6=Parasitic Mercy (1 necrotic only).",
      level: 1,
      spellType: "PASSIVE",
      icon: "Force/Explosion Burst",
      effectTypes: ["passive"],
      typeConfig: {
        school: "arcane",
        icon: "Force/Explosion Burst",
        tags: ["passive", "lunarch", "transition shock"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "lunarch", "transition shock"],
    },

    // STARFALL INVOKER → VOID CALLER
    { id : "lunarch_void_rend",
      name: "Void Rend",
      description:
        "Tear a hole in reality. Cold, hateful starlight bleeds through the rift, scorching enemies and contaminating them with cosmic sickness.",
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      level: 2,
      specialization: "void-caller",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaType: "circle",
        areaSize: 15,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A word that sounds like glass breaking in a vacuum",
        somaticText: "Claw at the air until it bleeds light",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d6",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness",
            name: "Star-Sickness",
            description: "Contaminated by cosmic rift-energy. Disadvantage on next attack, 1d4 radiant at start of turn.",
            statusType: "sickened",
            level: "moderate",
            mechanicsText: "Disadvantage on next attack and 1d4 radiant/turn for 2 rounds",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: "Radius increases to 20 ft. Star-Sickness deals 1d6 radiant/turn.",
          waxingMoon: "Radius increases by 5 ft (Void Aperture passive).",
          waningMoon: "Heal for 25% of damage dealt to all targets.",
        },
      },

      tags: ["radiant", "damage", "aoe", "debuff", "star-sickness", "void caller"],
    },

    { id : "lunarch_sanguine_transfer",
      name: "Sanguine Transfer",
      description:
        "Tear open a seam in your flesh and channel stolen life force through the wound into an ally. Blood-tinged moonlight seals their wounds. You lose HP. They gain HP.",
      spellType: "ACTION",
      icon: "Healing/Prayer",
      level: 2,
      specialization: "sanguine-warden",
      effectTypes: ["healing"],

      typeConfig: {
        school: "radiant",
        icon: "Healing/Prayer",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Tear open a starlight seam in your forearm",
      },

      resolution: "DICE",

      healingConfig: {
        formula: "2d8 + spirit",
        healingType: "direct",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      specialMechanics: {
        selfDamage: "Take 1d6 necrotic when cast. During Waxing: take 1d4 extra but healing +50%.",
        phaseAdvancement: 1,
        phaseInteraction: {
          waxingMoon: "Healing +50%. Take 1d4 extra necrotic. Target gains 1d6 temp HP.",
          fullMoon: "Also cleanses one poison or disease from target.",
          waningMoon: "Recover 25% of healing dealt as self-healing (vampiric feedback).",
          newMoon: "Target also gains +1 Armor for 1 round.",
        },
      },

      tags: ["healing", "self damage", "sanguine warden"],
    },

    { id : "lunarch_hollow_sight",
      name: "Hollow Sight",
      description:
        "Focus the parasite's alien perception through your starlight sockets, searing a sigil into a target that only you can see. The sigil burns through armor, through walls, through flesh.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 3,
      specialization: "hollow-sentinel",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Piercing/Targeted Strike",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 80,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Focus starlight through hollowed eyes",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "3d6",
        damageTypes: ["radiant"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "hollow_mark",
            name: "Hollow Mark",
            description: "Marked by the parasite. Ignore 25% armor. +1d6 from next spell.",
            statusType: "marked",
            level: "moderate",
            mechanicsText: "Ignore 25% armor, +1d6 next spell, 2 rounds",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: "Mark lasts 3 rounds. Bonus damage 1d8. Advantage on next attack vs target below half HP.",
          waxingMoon: "Mark also deals 1d4 necrotic/round.",
          waningMoon: "Duration +1 round. Heal 25% of damage to marked target.",
        },
      },

      tags: ["radiant", "damage", "debuff", "mark", "hollow sentinel"],
    },

    { id : "lunarch_void_beam",
      name: "Void Beam",
      description:
        "Open a rift along a line and pour the void's hatred through it. Enemies are scorched by cold starlight and contaminated with cosmic sickness.",
      spellType: "ACTION",
      icon: "Arcane/Missile",
      level: 3,
      specialization: "void-caller",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Missile",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 60,
        lineLength: 30,
        lineWidth: 5,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 9 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A sound like a star dying",
        somaticText: "Extend both arms, claw a rift through the air",
      },

      resolution: "SAVE",

      damageConfig: {
        formula: "4d6",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness_beam",
            name: "Star-Sickness",
            description: "Contaminated by void beam. Disadvantage on next attack, 1d4 radiant at start of turn.",
            statusType: "sickened",
            level: "moderate",
            mechanicsText: "Disadvantage on next attack and 1d4 radiant/turn for 1 round",
          },
        ],
      },

      specialMechanics: {
        phaseInteraction: {
          fullMoon: "Star-Sickness 2 rounds. +1d6 damage. Line width 10 ft.",
          waxingMoon: "Line length 40 ft. +5 ft radius (Void Aperture).",
          waningMoon: "Heal 25% of total damage. Mana cost reduced by 2.",
        },
      },

      tags: ["radiant", "damage", "line", "debuff", "star-sickness", "void caller"],
    },

    { id : "lunarch_binding_horror",
      name: "Binding Horror",
      description:
        "Project parasitic tendrils from the seams in your arms that wrap around a target, constricting and feeding. The tendrils are alive -- extensions of the parasite.",
      spellType: "ACTION",
      icon: "Frost/Confused",
      level: 3,
      specialization: "universal",
      effectTypes: ["control"],

      typeConfig: {
        school: "radiant",
        icon: "Frost/Confused",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A command in a language that predates speech",
        somaticText: "Extend arms, let tendrils extrude from the seams",
      },

      resolution: "SAVE",

      controlConfig: {
        controlType: "restraint",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          { id : "parasitic_bind",
            name: "Parasitic Bind",
            description: "Restrained by living tendrils. Cannot move. 1d4 necrotic/turn as tendrils feed.",
            config: {
              restraintType: "parasitic_bind",
              saveType: "strength",
              saveDC: 15,
              duration: 3,
              durationUnit: "rounds",
              immobilize: true,
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        phaseInteraction: {
          newMoon: "Target loses 1d4 mana/round or takes 1d4 psychic.",
          waxingMoon: "Disadvantage on initial save.",
          fullMoon: "Tendrils deal 1d6 radiant/round. Duration 4 rounds.",
          waningMoon: "Heal 25% of tendril damage. Mana cost reduced by 2.",
        },
      },

      tags: ["control", "restrain", "parasitic", "universal"],
    },

    // MOONWELL GUARDIAN → SANGUINE WARDEN
    { id : "lunarch_fractured_timeline",
      name: "Fractured Timeline",
      description:
        "Violently cycle through all four phases in rapid succession, each shift tearing a different piece of your physiology. You gain one brief benefit from each horror but pay in cumulative flesh damage.",
      spellType: "ACTION",
      icon: "Arcane/Magical Sword",
      level: 4,
      specialization: "universal",
      effectTypes: ["buff", "utility"],

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Magical Sword",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "QUATTUOR FAMIS!",
        somaticText: "Convulse as the parasite tears through all four feedings",
      },

      resolution: "AUTOMATIC",

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        rapidCycle: {
          description: "Gain one benefit from each phase simultaneously until consumed or 1 minute:",
          sequence: [
            "New Moon: Restore 1d4 mana, reduce next incoming attack by 1d4",
            "Waxing: Next spell deals +1d4 damage or next heal is +1d6",
            "Full Moon: Next attack deals +1d6 damage with +2 crit range",
            "Waning: Next spell costs 2 less mana",
          ],
          selfDamage: "Take 4d4 necrotic damage (cumulative tissue damage from four rapid shifts). Roll Transition Shock once.",
          phaseAdvancement: 1,
        },
      },

      tags: ["utility", "buff", "multi phase", "universal", "self damage"],
    },

    { id : "lunarch_sanguine_rites",
      name: "Sanguine Rites",
      description:
        "Open every seam in your arms simultaneously, flooding an ally with concentrated stolen life force. The price is written in your own blood.",
      spellType: "ACTION",
      icon: "Radiant/Radiant Golden Shield",
      level: 5,
      specialization: "sanguine-warden",
      effectTypes: ["healing"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Golden Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Tear open every seam in both arms, channel the flood",
      },

      resolution: "DICE",

      healingConfig: {
        formula: "4d8 + spirit",
        healingType: "direct",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        selfDamage: "Take 2d6 necrotic when cast. During Waxing: healing +50% but take 1d6 extra necrotic.",
        phaseAdvancement: 1,
        phaseInteraction: {
          waxingMoon: "Healing increases to 4d8+spirit+2d6. Target gains 2d6 temp HP. Take 1d6 extra necrotic.",
          fullMoon: "Can cleanse two conditions (poison, disease, curse).",
          waningMoon: "Recover 25% of healing as self-healing. Mana cost reduced by 2.",
        },
      },

      tags: ["healing", "cleanse", "self damage", "sanguine warden"],
    },

    { id : "lunarch_total_eclipse",
      name: "Total Eclipse",
      description:
        "Force the parasite into a catastrophic overfeed, simultaneously drawing from New Moon and Full Moon. Your body becomes a warzone of competing cosmic energies at double the flesh cost. Roll Transition Shock twice.",
      spellType: "ACTION",
      icon: "Healing/Cure Within",
      level: 6,
      specialization: "universal",
      effectTypes: ["buff", "damage"],

      typeConfig: {
        school: "radiant",
        icon: "Healing/Cure Within",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 15 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "CONCURRIS!",
        somaticText: "Cross arms over chest, spread wide as body cracks with starlight",
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "dual_phase",
        effects: [
          { id : "new_moon_eclipse",
            name: "Memory Eater Eclipse",
            description: "+2 Armor. Immune to charm and fear. -1 to attack rolls.",
            mechanicsText: "+2 Armor, charm/fear immune, -1 attacks",
          },
          { id : "full_moon_eclipse",
            name: "Sanity Erosion Eclipse",
            description: "+1d8 radiant on all attacks. Crit range +2. Roll Delirium each turn.",
            mechanicsText: "+1d8 radiant, +2 crit range, Delirium each turn",
          },
          { id : "stellar_aura",
            name: "Contagion Aura",
            description: "1d6 radiant to enemies within 10 ft each turn. Applies Star-Sickness.",
            mechanicsText: "1d6 radiant to enemies within 10 ft/turn, applies Star-Sickness",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      specialMechanics: {
        dualPhase: {
          selfDamage: "Take 3d6 necrotic when cast. Roll Transition Shock twice.",
          phaseAdvancement: 1,
          phaseLock: "Phase does not cycle during Eclipse.",
          afterEffect: "After Eclipse ends, shift to Waning Moon (no additional cost).",
          delirium: "Still roll Delirium each turn (Full Moon drawback persists).",
        },
      },

      tags: ["buff", "self", "dual phase", "universal", "self damage"],
    },

    // LEVEL 7-10 SPELLS

    // LEVEL 7 SPELLS
    { id : "lunarch_hollow_volley",
      name: "Hollow Volley",
      description:
        "Loose a volley of parasitic bolts that seek out multiple targets. Each bolt carries a sliver of the parasite's hunger, and each one tears a seam in your flesh as it leaves.",
      level: 7,
      spellType: "ACTION",
      icon: "Piercing/Rapid Arrows",
      specialization: "hollow-sentinel",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Piercing/Rapid Arrows",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 120,
        maxTargets: 4,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Rip seams in both arms, let bolts seek through starlight sockets",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "6d6 + agility",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 17,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        selfDamage: "Take 2d4 necrotic damage per target hit (parasite feeds on each bolt).",
        phaseAdvancement: 1,
        phaseInteraction: {
          fullMoon: "Can target 6 enemies. Each bolt deals +1d8 radiant. Ignore 25% armor (Starlight Sockets).",
          waningMoon: "Heal 25% of total damage dealt. Mana cost reduced by 3.",
        },
      },

      tags: ["damage", "multi target", "radiant", "hollow sentinel"],
    },

    { id : "lunarch_void_supernova",
      name: "Void Supernova",
      description:
        "Detonate a rift-core above your enemies. The explosion is not fire -- it is the void remembering what light used to be, and hating it. Enemies are scorched and contaminated with mass delirium.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Radiant Glow",
      specialization: "void-caller",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Glow",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        areaType: "circle",
        areaSize: 25,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 35 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A syllable that sounds like a star collapsing",
        somaticText: "Pull a rift-core from your own chest and hurl it skyward",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "7d10 + intelligence",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "mass_delirium",
            name: "Cosmic Delirium",
            description: "Mind shattered by void supernova. Disadvantage on all rolls for 2 rounds.",
            statusType: "confused",
            level: "strong",
            mechanicsText: "Disadvantage on all rolls for 2 rounds (Con save DC 17 to negate)",
          },
        ],
      },

      specialMechanics: {
        selfDamage: "Take 3d6 necrotic (tearing the rift-core from your chest).",
        phaseAdvancement: 1,
        phaseInteraction: {
          fullMoon: "Radius 30 ft. Delirium 3 rounds. +2d10 radiant.",
          waningMoon: "Heal 25% of damage. Delirium duration +1 round.",
        },
      },

      tags: ["damage", "control", "debuff", "radiant", "void caller"],
    },

    { id : "lunarch_sanguine_deluge",
      name: "Sanguine Deluge",
      description:
        "Burst every seam in your body simultaneously. A deluge of blood-tinged moonlight erupts outward, healing allies caught in the flood while you collapse from catastrophic blood loss. This is the Sanguine Warden's final gift -- you give everything.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Bright Explosion",
      specialization: "sanguine-warden",
      effectTypes: ["healing", "purification"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Bright Explosion",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaType: "circle",
        areaSize: 30,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Burst every seam. Let the blood-moonlight flood.",
      },

      resolution: "DICE",

      healingConfig: {
        formula: "6d8 + spirit",
        healingType: "direct",
        resolution: "DICE",
        hotConfig: {
          enabled: true,
          healingPerTick: "2d6",
          tickFrequency: "round",
          duration: 3,
        },
      },

      purificationConfig: {
        purificationType: "cleanse",
        targetType: "area",
        power: "major",
        duration: "instant",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        selfDamage: "Take 4d6 necrotic damage. This damage cannot reduce you below 1 HP (the parasite will not let you die before it finishes feeding).",
        phaseAdvancement: 1,
        phaseInteraction: {
          waxingMoon: "Direct healing +2d6. HOT +1d6. Allies gain 2d6 temp HP.",
          newMoon: "All healed allies gain +2 Armor for 1 round.",
          waningMoon: "Recover 25% of total healing dealt as self-healing.",
        },
      },

      tags: ["healing", "purification", "aoe", "self damage", "sanguine warden"],
    },

    // LEVEL 8 SPELLS
    { id : "lunarch_hollow_annihilation",
      name: "Hollow Annihilation",
      description:
        "Focus the entirety of the parasite's hunger into a single bolt that phases through all obstacles. It ignores armor, ignores cover, ignores the boundaries between spaces. Everything in its path ceases to exist as a concept.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Quick Step",
      specialization: "hollow-sentinel",
      effectTypes: ["damage"],

      typeConfig: {
        school: "force",
        icon: "Arcane/Quick Step",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 200,
        lineLength: 200,
        lineWidth: 5,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 45 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Drive both hands into your chest, extract the bolt from your own parasite-touched heart",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "10d8 + agility * 2",
        damageTypes: ["force"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critRange: [19, 20],
          critMultiplier: 2,
          critBonusDamage: "3d8",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      specialMechanics: {
        selfDamage: "Take 4d6 necrotic damage. The bolt is forged from your own vital essence.",
        phaseAdvancement: 1,
        phaseInteraction: {
          fullMoon: "Damage +3d8 radiant. Crit range 18-20. Ignore 50% armor.",
          waningMoon: "Heal 25% of total damage. Mana cost reduced by 5.",
        },
      },

      tags: ["damage", "line", "force", "hollow sentinel"],
    },

    { id : "lunarch_void_constellation",
      name: "Void Constellation",
      description:
        "Summon a constellation of rift-wounds across the battlefield, each one firing a beam of cold void-light at a different enemy. The constellation persists for moments -- long enough to scar reality and everything caught in its geometry.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Magical Sword",
      specialization: "void-caller",
      effectTypes: ["damage", "debuff"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Magical Sword",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 90,
        maxTargets: 6,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 42 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "The names of six dead stars, spoken in sequence",
        somaticText: "Draw the constellation in the air with bleeding fingers",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "6d8 + intelligence",
        damageTypes: ["radiant"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "star_sickness_constellation",
            name: "Star-Sickness",
            description: "Contaminated by void constellation. Disadvantage on attacks, 1d4 radiant/turn.",
            statusType: "sickened",
            level: "strong",
            mechanicsText: "Disadvantage on attacks and 1d4 radiant/turn for 2 rounds",
          },
        ],
      },

      specialMechanics: {
        selfDamage: "Take 3d6 necrotic. Each rift-wound bleeds you as it fires.",
        phaseAdvancement: 1,
        phaseInteraction: {
          fullMoon: "8 targets. +1d8 radiant each. Star-Sickness deals 1d6/turn.",
          waningMoon: "Heal 25% of total damage. Mana cost reduced by 4.",
        },
      },

      tags: ["damage", "multi target", "debuff", "radiant", "void caller"],
    },

    { id : "lunarch_parasitic_bulwark",
      name: "Parasitic Bulwark",
      description:
        "The parasite erupts from your body in a defensive web of crystallized tendrils, forming a living barrier that absorbs attacks and reflects the damage through the starlight seams. Allies behind the bulwark are shielded. Enemies who strike it are burned.",
      level: 8,
      spellType: "REACTION",
      icon: "Force/Force Field",
      specialization: "sanguine-warden",
      effectTypes: ["buff"],

      typeConfig: {
        school: "radiant",
        icon: "Force/Force Field",
        castTime: 1,
        castTimeType: "REACTION",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        areaType: "circle",
        areaSize: 20,
        targetRestrictions: ["ally"],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 0,
        components: ["verbal"],
        verbalText: "SURGE!",
      },

      resolution: "AUTOMATIC",

      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "parasitic_bulwark",
            name: "Parasitic Bulwark",
            description: "Absorbs 50 damage. Reflects 50% of absorbed damage to attackers. Take 2d6 necrotic when cast.",
            mechanicsText: "Absorbs 50 damage, reflects 50% to attackers, 2 round duration",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        selfDamage: "Take 2d6 necrotic when cast (the tendrils erupt violently from your flesh).",
        phaseAdvancement: 1,
        phaseInteraction: {
          newMoon: "Absorption increases to 75. Allies within gain +2 Armor.",
          fullMoon: "Reflected damage increases to 75%. Bulwark deals 1d6 radiant to attackers.",
          waningMoon: "Duration 3 rounds. You heal for 25% of all reflected damage.",
        },
      },

      tags: ["buff", "shield", "reflect", "reaction", "sanguine warden"],
    },

    // LEVEL 9 SPELLS
    { id : "lunarch_skyhole",
      name: "Skyhole",
      description:
        "Tear open the sky above a battlefield. Raw, predatory starlight pours through the wound in reality, scorching everything below. The tear persists -- a gaping hole where the sky used to be, raining cosmic radiation each round.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Star Trail Path",
      specialization: "void-caller",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Arcane/Star Trail Path",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        areaType: "circle",
        areaSize: 40,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 60 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "The sound of the sky being ripped open like cloth",
        somaticText: "Reach upward and PULL the firmament apart",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "12d8 + intelligence * 2",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        selfDamage: "Take 5d6 necrotic (the tear opens through your own body first).",
        phaseAdvancement: 1,
        zoneConfig: {
          persistentDamage: "3d8 radiant per round for 3 rounds.",
          phaseInteraction: {
            fullMoon: "Persistent 5d8 radiant. Radius 50 ft.",
            waningMoon: "Duration 5 rounds. You heal 25% of persistent damage each round.",
          },
        },
      },

      tags: ["damage", "aoe", "zone", "radiant", "void caller"],
    },

    { id : "lunarch_host_ascension",
      name: "Host Ascension",
      description:
        "Surrender completely to the parasite. For 3 rounds, you are not the pilot -- you are the vehicle. The parasite takes full control, turning your body into a weapon of cosmic horror. Your mind watches from behind starlight-barred windows, screaming.",
      level: 9,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      specialization: "universal",
      effectTypes: ["transformation"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 55 },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "Nothing. The parasite speaks through your mouth in a voice that is not yours.",
      },

      resolution: "NONE",

      transformationConfig: {
        transformationType: "parasitic",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Ascended Host",
        description: "The parasite assumes direct control. Your body moves with alien precision.",
        grantedAbilities: [
          { id : "parasitic_stats",
            name: "Alien Physiology",
            description: "+4 to all attributes, +5 Armor, immune to charm/fear/stun",
          },
          { id : "parasitic_damage",
            name: "Cosmic Weapon",
            description: "+3d8 radiant on all attacks. Attacks ignore 50% armor.",
          },
          { id : "parasitic_immunity",
            name: "Starlight Form",
            description: "Immune to radiant and necrotic damage. Half damage from all other sources.",
          },
          { id : "parasitic_flight",
            name: "Void Step",
            description: "60 ft fly speed. Can phase through solid objects.",
          },
          { id : "parasitic_contagion",
            name: "Passive Contagion",
            description: "All enemies within 15 ft have disadvantage on attack rolls (cosmic aura).",
          },
          { id : "parasitic_toll",
            name: "The Price of Surrender",
            description: "When transformation ends: take 4d10 necrotic, gain 2 exhaustion, shift to New Moon. No saving throw.",
          },
        ],
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseLock: "Phase does not cycle during Ascension. All phase benefits and drawbacks are suspended.",
        delirium: "No Delirium rolls during Ascension -- the parasite IS the delirium.",
      },

      tags: ["transformation", "ultimate", "parasitic ascension", "universal"],
    },

    // LEVEL 10 SPELLS
    { id : "lunarch_vessel_of_the_parasite",
      name: "Vessel of the Parasite",
      description:
        "Become the moon. Not a vessel -- the moon itself, made flesh. Your body dissolves into condensed starlight and reforms as a walking eclipse. The parasite does not ride you anymore. You ARE the parasite. For 4 rounds, you are a cosmic horror walking among mortals. When it ends, you will not remember being human.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      specialization: "universal",
      effectTypes: ["transformation"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 80 },
        actionPoints: 3,
        components: ["verbal"],
        verbalText: "A sound that makes nearby creatures weep without knowing why",
      },

      resolution: "NONE",

      transformationConfig: {
        transformationType: "celestial",
        targetType: "self",
        duration: 4,
        durationUnit: "rounds",
        power: "major",
        newForm: "The Lunar Horror",
        description: "Your body dissolves into living starlight. You are no longer entirely mortal.",
        grantedAbilities: [
          { id : "lunar_stats",
            name: "Cosmic Form",
            description: "+6 to all attributes, +8 Armor",
          },
          { id : "lunar_damage",
            name: "Moonlight Incarnate",
            description: "+5d8 radiant on all attacks. Critical hits on 18-20.",
          },
          { id : "lunar_immunity",
            name: "Eclipse Body",
            description: "Immune to radiant, necrotic, and psychic damage. Half damage from all other sources.",
          },
          { id : "lunar_phasing",
            name: "Phase Walk",
            description: "Phase through solid objects. Immune to opportunity attacks. 60 ft fly speed.",
          },
          { id : "lunar_aura",
            name: "The Feeding Zone",
            description: "All enemies within 30 ft take 2d6 radiant damage at start of each turn. You heal for 100% of this damage (the parasite feeds on a cosmic scale).",
          },
          { id : "lunar_exhaustion",
            name: "The Reversion (On End)",
            description: "When transformation ends: take 6d10 necrotic, gain 3 exhaustion, forget the last hour (narrative). Shift to New Moon. No save.",
          },
        ],
        concentrationRequired: false,
        canBeDispelled: false,
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        phaseLock: "Phase does not cycle during transformation. All phase mechanics suspended.",
        permanentConsequence: "The 3 exhaustion levels are real and cumulative across uses. The narrative memory loss is at GM discretion but should be enforced.",
      },

      tags: ["transformation", "ultimate", "level 10", "cosmic horror"],
    },

    { id : "lunarch_hollowpoint",
      name: "Hollowpoint",
      description:
        "Forge a single bolt from the concentrated essence of the parasite itself -- a projectile of pure cosmic hunger that annihilates everything in its path. The bolt is forged by reaching into your own chest and pulling out the part of the parasite that screams the loudest.",
      level: 10,
      spellType: "ACTION",
      icon: "Radiant/Divine Blessing",
      specialization: "hollow-sentinel",
      effectTypes: ["damage"],

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Blessing",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "line",
        rangeType: "ranged",
        rangeDistance: 500,
        lineLength: 500,
        lineWidth: 10,
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 80 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Reach into your chest, extract the screaming core, and loose it",
      },

      resolution: "DICE",

      damageConfig: {
        formula: "20d6 + agility",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrow: {
          ability: "agility",
          difficultyClass: 22,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critRange: [18, 19, 20],
          critMultiplier: 2,
          critBonusDamage: "4d6",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        selfDamage: "Take 6d6 necrotic damage. Your maximum HP is reduced by 10 until your next long rest (the parasite takes time to regenerate the portion of itself you fired).",
        phaseAdvancement: 1,
        specialRules: "Ignores resistance to radiant damage. Destroys unattended objects in path.",
        phaseInteraction: {
          fullMoon: "Damage +4d6 radiant. Crit range 17-20.",
          waningMoon: "Heal 25% of total damage. Mana cost reduced by 10.",
        },
      },

      tags: ["damage", "line", "radiant", "ultimate", "hollow sentinel"],
    },

    { id : "lunarch_sanguine_eternity",
      name: "Sanguine Eternity",
      description:
        "Burst every seam in your body and create a permanent zone of blood-tinged moonlight that persists for the rest of combat. The zone is fed by your agony -- allies within are continuously healed, enemies are continuously drained. You become the living heart of a parasitic ecosystem.",
      level: 10,
      spellType: "ACTION",
      icon: "Healing/Heart Ripple",
      specialization: "sanguine-warden",
      effectTypes: ["healing", "damage"],

      typeConfig: {
        school: "radiant",
        icon: "Healing/Heart Ripple",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        areaType: "circle",
        areaSize: 30,
      },

      effectTargeting: {
        healing: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          areaType: "circle",
          areaSize: 30,
          targetRestrictions: ["ally"],
          description: "All allies in the zone are healed each round",
        },
        damage: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          areaType: "circle",
          areaSize: 30,
          targetRestrictions: ["enemy"],
          description: "All enemies in the zone take radiant damage each round",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 80 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "The oldest prayer, spoken in a language that died with the first moon",
        somaticText: "Burst every seam. Become the heart.",
      },

      resolution: "DICE",

      healingConfig: {
        formula: "4d8 + spirit",
        healingType: "hot",
        resolution: "DICE",
        hotConfig: {
          enabled: true,
          healingPerTick: "4d8",
          tickFrequency: "round",
          duration: 0,
        },
      },

      damageConfig: {
        formula: "3d8",
        damageTypes: ["radiant"],
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        selfDamage: "Take 5d6 necrotic when cast. At the start of each subsequent turn, take 1d6 necrotic while the zone persists (your body is the pump).",
        phaseAdvancement: 1,
        zoneConfig: {
          duration: "rest of combat",
          movable: false,
        },
        phaseInteraction: {
          fullMoon: "Enemy damage 5d8 radiant. Radius 40 ft.",
          waxingMoon: "Healing +2d6. Cleanses one condition per round.",
          newMoon: "Allies gain +2 Armor while in zone.",
          waningMoon: "Enemy damage applies 1-round slow. You heal 25% of ALL damage dealt by the zone.",
        },
      },

      tags: ["zone", "healing", "damage", "ultimate", "sanguine warden"],
    },

      {
        "id": "lunarch_moonlit_path",
        "name": "Moonlit Path",
        "description": "Call down a soft, narrow beam of pale starlight from the heavens. The light cuts through natural darkness, highlighting hidden beast tracks, secret compartments, and granting low-light vision to all allies.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Radiant/Moonlight Beam",
        "typeConfig": {
          "school": "radiant",
          "icon": "Radiant/Moonlight Beam",
          "tags": [
            "utility",
            "roleplay",
            "lunarch"
          ],
          "castTime": 1,
          "castTimeType": "IMMEDIATE"
        },
        "targetingConfig": {
          "targetingType": "self",
          "rangeType": "self"
        },
        "resourceCost": {
          "actionPoints": 1,
          "resourceTypes": [
            "mana"
          ],
          "resourceValues": {
            "mana": 4
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Ondina, ostende viam.",
          "somaticText": "Reach both hands high, tracing the silver crescent moon in the open sky"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "perception",
          "selectedEffects": [
            {
              "id": "moonlit_path_effect",
              "name": "Moonlit Trails",
              "description": "Highlights all hidden tracks, secret doors, and traps within a 30-foot beam of moonlight. Grants allies low-light vision in the beam."
            }
          ],
          "duration": 10,
          "durationUnit": "minutes",
          "concentration": true,
          "power": "minor"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "lunarch"
        ]
      },
  ],
};
