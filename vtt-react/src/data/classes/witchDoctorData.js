/**
 * WITCH DOCTOR CLASS DATA
 *
 * Voodoo practitioner who invokes powerful loa (voodoo gods) through Voodoo Essence
 * Resource System: Voodoo Essence - generated through curses, rituals, totems, and poisons
 * Specializations: Bokor, Mambo, Houngan
 *
 * DESIGNER NOTES (v2.0 Audit):
 * - Specs renamed from Shadow Priest/Spirit Healer/War Priest to Bokor/Mambo/Houngan
 *   (authentic voodoo terms that lock class identity)
 * - Precursors simplified from 2/loa to 1/loa (battlefield-state, not spell-specific)
 * - exampleSpells array removed; single unified spell list
 * - Spell pools filled for all 10 levels (30 spells total)
 * - Loa invocation costs streamlined: Simbi(5), Papa Legba(6), Erzulie(7), Ogoun(8), Baron Samedi(10)
 */

export const WITCH_DOCTOR_DATA = {
  id: "witch-doctor",
  name: "Witch Doctor",
  icon: "fas fa-skull",
  role: "Support/Control",
  damageTypes: ["necrotic", "nature", "poison"],

  overview: {
    title: "The Witch Doctor",
    subtitle: "Voodoo Invoker & Loa Channeler",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The Witch Doctor channels ancient voodoo loa (gods) by accumulating Voodoo Essence through curses, totems, poisons, and rituals — then spends it to invoke devastating divine interventions when battlefield conditions align.

**Core Mechanic**: Cast curses, place totems, apply poisons, perform rituals → Build Voodoo Essence (0-15) → Meet one precursor condition per loa → Invoke powerful loa for game-changing effects

**Resource**: Voodoo Essence (0-15) spent to invoke loa; each loa requires one battlefield-state precursor

**Playstyle**: Strategic resource planner with setup-and-payoff divine invocations

**Best For**: Players who enjoy methodical preparation, reading the battlefield, and unleashing dramatic divine interventions at the perfect moment`,
    },

    description: `The Witch Doctor is a mystical practitioner of voodoo magic who channels the power of ancient loa (voodoo gods) through accumulated Voodoo Essence. By performing rituals, casting curses, placing totems, and applying poisons, the Witch Doctor gathers spiritual energy that can be spent to invoke powerful deities. Each loa requires a single precursor condition — a battlefield state that must be true — rewarding strategic planning and careful resource management.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Witch Doctors are spiritual intermediaries between the mortal world and the realm of the loa. Whether through ancestral tradition, desperate bargaining, or scholarly pursuit of forbidden knowledge, they have learned to commune with powerful voodoo spirits and channel their divine power.

**The Witch Doctor's Philosophy**: The loa are neither good nor evil — they are forces of nature, ancient spirits with their own agendas. To invoke them is to make a pact, to offer respect and tribute in exchange for their devastating power. Every curse cast, every ritual performed, every totem placed is an offering to the spirits.

**Common Witch Doctor Archetypes**:
- **The Tribal Shaman**: Keeper of ancestral traditions, protector of their people through ancient rites
- **The Desperate Bargainer**: Made a pact with the loa in a moment of need, now bound to their service
- **The Dark Scholar**: Studied forbidden voodoo texts, seeking power through understanding the spirits
- **The Cursed Bloodline**: Born with the loa's mark, destined to serve as their mortal vessel`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The Witch Doctor is a versatile support/control caster who excels at debuffing enemies, supporting allies, and unleashing devastating divine invocations. They build power gradually through curses and rituals, then spend it on game-changing loa invocations.

**Damage Output**: Moderate sustained damage through curses and poisons. High burst potential through loa invocations.

**Survivability**: Moderate. Relies on totems for protection and healing, with some defensive rituals available.

**Utility**: Exceptional. Provides curses, healing, resurrection, teleportation, and powerful buffs through loa invocations.

**Complexity**: Moderate-High. Requires tracking Voodoo Essence and one precursor per loa, but the system is designed to be intuitive — each precursor is a simple battlefield condition.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Core Gameplay Loop**:
1. **Build Voodoo Essence** through curses, poisons, totems, and rituals
2. **Read the Battlefield** — check which loa's precursor condition is met
3. **Invoke Loa** when essence and precursor align for maximum impact
4. **Control the Battlefield** with strategic totem placement and curse application

**Voodoo Essence Management**:
- **Low Essence (0-5)**: Focus on building through curses and totems, conservative play
- **Medium Essence (6-9)**: Can invoke minor loa (Simbi, Papa Legba), maintain curse coverage
- **High Essence (10+)**: Ready for major invocations (Baron Samedi, Ogoun), game-changing moments

**Precursor Planning (Simplified)**:
- Baron Samedi: Keep 3+ enemies cursed → check at invocation time
- Erzulie: Group with allies (2+ within 15ft) → positioning matters
- Papa Legba: Generate 5+ Essence this combat → happens naturally
- Simbi: Wait for an ally to drop below half HP → reactive timing
- Ogoun: Keep poison active on a target → apply early and maintain

**Strategic Considerations**:
- Curse high-priority targets early — each curse is +1 Essence AND counts toward Baron Samedi
- Place Totem of Healing when allies are grouped to build toward Erzulie
- Apply poison early to enable Ogoun when needed
- Save Ritual of Death for critical moments when multiple enemies are grouped`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Loa's Chosen",
      content: `**The Setup**: You're a Level 8 Witch Doctor (Bokor specialization) facing a group of undead (6 zombies + 1 necromancer). Your party is with you. Starting Voodoo Essence: 0. Starting Mana: 55/60. Your goal: Build Voodoo Essence through curses and spells, then invoke Baron Samedi (loa of death) to devastate the undead.

**Starting State**: Voodoo Essence: 0/15 | Mana: 55/60 | HP: 45/45 | Cursed Enemies: 0

**Turn 1 - Cursing the Priority Target (Essence: 0 → 2)**

*Six zombies shamble toward you, led by a necromancer. You begin the ritual. The loa are watching.*

**Your Action**: Cast "Withering Hex" on Necromancer (5 mana, 1 AP)
**Effect**: Target takes 1d6+spirit necrotic damage per round for 3 rounds

*You gesture at the necromancer. Dark voodoo energy WRAPS around him like chains.*

**Voodoo Essence Generated**: +1 (curse cast) = **1/15**
**Cursed Enemies**: 1 (Necromancer)

**Mana**: 55 - 5 = 50/60

**Your Action (remaining AP)**: Cast "Grave Bane" on Zombie #1 (8 mana, 1 AP)
**Effect**: 2d6+spirit necrotic damage, -2 Agility for 3 rounds

*You hurl grave dirt at the lead zombie. It staggers, its movements slowing.*

**Voodoo Essence Generated**: +1 (curse cast) = **2/15**
**Cursed Enemies**: 2 (Necromancer, Zombie #1)

**Mana**: 50 - 8 = 42/60

**Current State**: Essence: 2/15 | Mana: 42/60 | Cursed: 2

**Turn 2 - Cursed Enemy Down (Essence: 2 → 6)**

*The zombies attack. Your party's rogue flanks Zombie #1.*

**Necromancer**: Takes 1d6+spirit → [4+3] = 7 necrotic damage from Withering Hex

**Your Party's Rogue**: Attacks Zombie #1 (cursed) → 18 damage → **DEAD**

**Cursed Enemy Defeated**: Zombie #1 was cursed and defeated!
**Voodoo Essence Generated**: +3 (defeating cursed enemy) = **5/15**

*The cursed zombie collapses. Spirits feed on its cursed soul, flooding you with essence.*

**Your Action**: Cast "Withering Hex" on Zombie #2 (5 mana, 1 AP)

*You spread another curse. More chains of voodoo energy.*

**Voodoo Essence Generated**: +1 (curse cast) = **6/15**
**Cursed Enemies**: 2 (Necromancer, Zombie #2)

**Mana**: 42 - 5 = 37/60

**Current State**: Essence: 6/15 | Mana: 37/60 | Cursed: 2

**Turn 3 - AoE Pressure & Curse Stacking (Essence: 6 → 8)**

**Your Action**: Cast "Bone Shrapnel" (12 mana, 2 AP)
**Effect**: 3d6+spirit necrotic to all enemies in 15 ft

*You conjure a burst of sharpened bone fragments that SHRED the clustered undead.*

**Zombies #3, #4**: Each take [4+5+3+3] = 15 necrotic → #4 **DEAD**
**Necromancer**: Takes 15 necrotic → HEAVILY DAMAGED

**Mana**: 37 - 12 = 25/60

**Your Action**: Cast "Grave Bane" on Zombie #5 (8 mana, 1 AP)

**Voodoo Essence Generated**: +1 (curse cast) = **7/15**
**Cursed Enemies**: 3 (Necromancer, Zombie #2, Zombie #5)

**Mana**: 25 - 8 = 17/60

**Current State**: Essence: 7/15 | Mana: 17/60 | Cursed: 3

**Turn 4 - Essence Cascade (Essence: 7 → 10)**

**Your Party's Tank**: Attacks Necromancer (cursed) → 20 damage → **DEAD**

**Cursed Enemy Defeated**: Necromancer was cursed and defeated!
**Voodoo Essence Generated**: +3 (defeating cursed enemy) = **10/15**

*The necromancer crumbles. Your essence SURGES. You feel Baron Samedi stirring.*

**Your Action**: Cast "Withering Hex" on Zombie #3 (5 mana, 1 AP)

**Voodoo Essence Generated**: +1 (curse cast) = **11/15**
**Cursed Enemies**: 3 (Zombie #2, Zombie #5, Zombie #3)

**Mana**: 17 - 5 = 12/60

**Current State**: Essence: 11/15 | Mana: 12/60 | Cursed: 3

**Turn 5 - INVOKE BARON SAMEDI (Essence: 11 → 3)**

*You have 11 Voodoo Essence. Baron Samedi's precursor: 3+ cursed enemies. You have EXACTLY 3. The stars align.*

*And you're a BOKOR — Baron Samedi costs only 8 Essence instead of 10.*

**Baron Samedi Requirements**:
- **Essence Cost**: 10 Voodoo Essence (Bokor: 8)
- **Precursor**: 3+ cursed enemies on the field ✓ (Zombie #2, #3, #5 all cursed)

**Your Action**: "INVOKE BARON SAMEDI" (8 Voodoo Essence as Bokor, 32 mana, 3 AP)

*You raise your staff to the sky. You CHANT the invocation. The air grows COLD. A spectral figure appears — BARON SAMEDI, loa of death, wearing a top hat and skull face paint, smoking a cigar.*

**Voodoo Essence**: 11 - 8 = **3/15**

**Baron Samedi**: "You called, child? Let me show you DEATH."

**Damage**: 14d6+spirit*3 necrotic hits all enemies within 40 ft. Cursed enemies take TRIPLE damage.

*Roll 14d6: [6+4+5+3+2+6+4+5+3+6+4+5+2+3] = 58. + spirit(3)*3 = +9. Total base: 67 necrotic to all enemies.*

**Zombie #2 (cursed)**: 67 × 3 = 201 necrotic → **OBLITERATED**
**Zombie #3 (cursed)**: 67 × 3 = 201 necrotic → **OBLITERATED**
**Zombie #5 (cursed)**: 67 × 3 = 201 necrotic → **OBLITERATED**
**Zombie #6 (uncursed)**: 67 necrotic → **DESTROYED**

*Every zombie disintegrates. Baron Samedi tips his hat to you, then fades into the spirit realm.*

**Baron Samedi**: "Well done, child. Call me again when you need DEATH."

**Combat Over**

**Essence Generation Breakdown**:
- Withering Hex (Necromancer): +1 Essence
- Grave Bane (Zombie #1): +1 Essence
- Zombie #1 defeated (cursed): +3 Essence
- Withering Hex (Zombie #2): +1 Essence
- Grave Bane (Zombie #5): +1 Essence
- Necromancer defeated (cursed): +3 Essence
- Withering Hex (Zombie #3): +1 Essence
- **Total Generated**: 12 Essence
- **Spent on Baron Samedi (Bokor discount)**: -8 Essence
- **Remaining**: 3 Essence (carried into next fight)

**The Lesson**: Witch Doctor gameplay is about:
1. **Curse Early, Curse Often** — every curse is +1 Essence now and +3 when the enemy dies
2. **Curse Management** — each curse counts toward Baron Samedi's precursor (3+ enemies)
3. **Precursor Awareness** — Baron Samedi needs cursed enemies ALIVE when you invoke
4. **Loa Invocation** — the payoff moment where a god descends and rewrites the fight
5. **Essence Carry-Over** — remaining Essence carries to the next fight, giving you a head start

You're a VOODOO PRACTITIONER who channels the power of ancient loa. You build Voodoo Essence through curses, totems, poisons, and rituals. When you have enough Essence and the battlefield conditions are right, you INVOKE THE LOA. Each loa is a DIVINE INTERVENTION that changes the course of battle. You don't just cast spells — you COMMUNE WITH GODS.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Voodoo Essence & Loa Invocation",
    subtitle: "Spiritual Energy & Divine Channeling",

    description: `The Witch Doctor's power stems from Voodoo Essence, a spiritual resource generated through voodoo practices. This essence is spent to invoke powerful loa (voodoo gods), each requiring a single battlefield condition to be met. Mastering the balance between essence generation, precursor awareness, and strategic invocation timing is the key to becoming a powerful Witch Doctor.`,

    cards: [
      {
        title: "Voodoo Essence",
        stats: "0-15 Scale",
        details:
          "Generated by cursing, poisoning, placing totems, completing rituals, and defeating cursed enemies. Spent to invoke loa for devastating effects. Maximum 15.",
      },
      {
        title: "Loa Invocations",
        stats: "5-10 Essence + 1 Precursor",
        details:
          "Each loa requires a specific battlefield condition (precursor) to be met before invocation. Meet the condition, spend the essence, and unleash divine power.",
      },
      {
        title: "Curse Stacking",
        stats: "Multiple Enemies",
        details:
          "Curses are your foundation. Every cursed enemy generates +1 Essence when defeated and counts toward Baron Samedi's precursor. More curses = more power.",
      },
    ],

    usage: {
      momentum:
        "Curse everything you can. Each curse is an investment — +1 Essence on application and +3 when the enemy dies. Place totems for area control and passive essence generation. The faster you generate Essence, the sooner you can invoke a loa.",
      flourish:
        "Loa invocations are your win conditions. Baron Samedi ending a fight with 14d6+spirit damage to all cursed enemies is devastating. Coordinate with your party — tell them you are building toward a specific loa so they can set up the precursor conditions.",
    },

    overheatRules: {
      title: "Essence Overflow & Loa Exhaustion",
      content: `The Witch Doctor's power has two critical thresholds that shape every combat.

**Essence Cap (15 Maximum)**:
Any Essence generated beyond 15 is wasted. If you are at 14 Essence and defeat a cursed enemy (+3), you only gain 1. This means you should plan your loa invocations to avoid waste — if you are near 15, either invoke a loa or switch to non-essence actions.

**Essence Generation Cap (5 per Action)**:
No single action can generate more than 5 Voodoo Essence. This prevents Mass Curse on a Bokor with full Cursed Essence talents from generating 15 Essence in one cast. Base generation + spec bonus + talent bonuses are all combined, but the total per action is capped at 5. The exception is defeating cursed enemies (+3 each) — this is per enemy, not per action.

**Loa Exhaustion (Post-Invocation)**:
After invoking a loa, your Essence drops significantly (5-10 points). You return to the early game of building Essence back up. This creates a natural combat arc: build, invoke, rebuild. Plan for the post-invocation window — you will have limited resources while recovering.

**The Precursor Trap**:
Each loa has exactly ONE precursor condition. If the condition is not met, you cannot invoke — no matter how much Essence you have. 14 Essence means nothing if fewer than 3 enemies are cursed for Baron Samedi. This is the class's greatest frustration and greatest strategic depth.

**Managing the Dual Pressure**:
You must balance two things simultaneously: generating enough Essence AND ensuring the precursor is met. A Witch Doctor who has 12 Essence but no allies below half HP cannot invoke Simbi. You may need to delay your invocation and spend turns enabling the precursor (letting allies take damage, applying more curses, generating more Essence) rather than invoking immediately.

**Recovery Between Fights**:
Essence carries between encounters (no reset on short rest). If you finish a fight at 12 Essence, you start the next fight halfway to Baron Samedi. Plan your rest strategy — if you are low on Essence, a short rest to regain resources and reposition may be better than pressing forward.`,
    },

    essenceGenerationTable: {
      title: "Voodoo Essence Generation",
      headers: ["Action", "Essence Gained", "Notes"],
      rows: [
        [
          "Cast Curse",
          "1",
          "Any curse spell applied to enemy (Withering Hex, Grave Bane, Hex, Mass Curse)",
        ],
        [
          "Apply Poison",
          "1",
          "Weapon poison spell (Venomous Sting, Venomous Weapon)",
        ],
        [
          "Place Totem",
          "1",
          "Any totem spell (Totem of Warding, Totem of Healing)",
        ],
        [
          "Perform Ritual",
          "2",
          "Ritual must complete successfully (Ritual of Death)",
        ],
        [
          "Defeat Cursed Enemy",
          "3",
          "Enemy must have your curse active when defeated",
        ],
        [
          "Per-Action Cap",
          "5 max",
          "No single action generates more than 5 Essence (cursed enemy defeats are per-enemy, not per-action)",
        ],
      ],
    },

    loaInvocationTable: {
      title: "Loa Invocations",
      headers: ["Loa", "Essence Cost", "Precursor", "Effect Summary"],
      rows: [
        [
          "Simbi",
          "5",
          "1+ ally below half HP",
          "Healing rain: 4d8 HP, cure diseases/poisons in 30ft",
        ],
        [
          "Papa Legba",
          "6",
          "5+ Essence generated this combat",
          "Telepathy for 1hr + teleport 5 allies within 1 mile",
        ],
        [
          "Ogoun",
          "8",
          "Poison active on any target",
          "+2 attack, physical resistance, +2d6 fire damage for 1min",
        ],
        [
          "Baron Samedi",
          "10",
          "3+ enemies currently cursed",
          "14d6+spirit*3 necrotic to all enemies, triple damage to cursed",
        ],
      ],
    },

    loaTrackingNote: {
      title: "Tracking Loa Precursors",
      content: `**Papa Legba's Precursor**: "5+ Essence generated this combat" tracks your TOTAL Essence generated across the entire fight — not your current Essence. This is a running total that never decreases, even when you spend Essence. Keep a separate counter or tally mark for each Essence point generated.

**Baron Samedi's Precursor**: "3+ enemies currently cursed" counts only living enemies on the battlefield who have your curse active RIGHT NOW. Cursed enemies who die no longer count. Plan your curses to ensure enough remain alive when you invoke.

**Simbi's Precursor**: "1+ ally below half HP" is checked at the time of invocation. If all allies heal above half before you invoke, the precursor is no longer met.

**Erzulie's Precursor**: "2+ allies within 15ft of you" is based on physical positioning. Communicate with your party to cluster before invoking.

**Ogoun's Precursor**: "Poison active on any target" means your poison buff is currently applied to your weapon or a poison debuff is active on any enemy. Venomous Sting (Level 1) and Venomous Weapon (Level 5) both satisfy this.`,
    },

    strategicConsiderations: {
      title: "The Ritual — Combat Phase Tactics",
      content: `**Phase 1: The Foundation (Rounds 1-3)**:
Curse high-priority targets immediately. Each curse is a dual investment: +1 Essence on application and +3 when the enemy dies. Place a totem for area control. Apply weapon poison to enable Ogoun's precursor. Your goal is to reach 5+ Essence while establishing curses on 2+ enemies.

**Phase 2: Precursor Building (Rounds 4-6)**:
Start checking which loa you can invoke. Scan the battlefield for precursor conditions:
- **Simbi (5 Essence)**: Is any ally below half HP? If not, you may need to let damage happen — resist the urge to heal preemptively.
- **Erzulie (7 Essence)**: Are 2+ allies near you? Communicate positioning with your party.
- **Papa Legba (6 Essence)**: Have you generated 5+ Essence this fight? This one tracks itself — you either have it or you don't.
- **Ogoun (8 Essence)**: Is poison active on any target? Apply weapon poison early to enable this.
- **Baron Samedi (10 Essence)**: Are 3+ enemies cursed? This is your ultimate — requires the most setup.

**Phase 3: The Invocation (Rounds 7+)**:
Invoke the highest-impact loa available. Baron Samedi with 3+ cursed enemies is game-ending (14d6+spirit to all cursed). Ogoun turns you into a damage powerhouse. Erzulie can save the party from a wipe with mass healing and armor. Time your invocation for maximum impact — don't waste Baron Samedi on a single remaining enemy.

**The Curse-First Philosophy**:
Curses are your highest-priority action in round 1. A cursed enemy is worth +1 Essence now and +3 Essence later (6 Essence total from one enemy). This means 2-3 cursed enemies dying = 12-18 Essence, which is enough for any loa. Curse broadly, then focus fire on cursed targets to trigger the essence cascade.

**Loa Choice Priority**:
1. **Baron Samedi** (10): If 3+ enemies are cursed and you have the Essence, this is almost always the right call. The AoE devastation ends fights.
2. **Erzulie** (7): If the party is taking heavy damage and allies are clustered, the mass heal + armor + fear immunity is a clutch save.
3. **Ogoun** (8): If you need single-target damage and poison is active, the attack buff + fire damage + physical resistance makes you a frontline threat.
4. **Simbi** (5): If a single ally is critical, the targeted heal is efficient. Cheap and reliable.
5. **Papa Legba** (6): The teleport is situational but powerful for repositioning the entire party.

**The Spec Factor**:
Specializations reduce loa costs and relax precursors. A Bokor with Baron Samedi at 8 Essence and only 2 cursed enemies needed can invoke much earlier than a base Witch Doctor. Factor your spec discounts into your planning.

**Worked Example (Round 5, 8 Essence, 2 Enemies Cursed)**:
- **Option A** — Simbi (5 Essence, ally below half HP): Reliable heal, drops you to 3 Essence. Safe but small.
- **Option B** — Erzulie (7 Essence, allies grouped): Mass heal + armor. Drops you to 1 Essence. Party-saving but leaves you empty.
- **Option C** — Curse a third enemy, wait for Baron Samedi: Higher risk but massive payout. If the fight will last 3+ more rounds, this is often the best play.
- **Best default**: If the party is healthy, Option C. If someone is critical, Option B.`,
    },

    playingInPerson: {
      title: "Playing Witch Doctor In Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `The Witch Doctor is the most atmospheric class at the table. Skull beads, curse markers, totem miniatures, and the dramatic token dump when invoking a loa create a deeply immersive voodoo experience that the whole table will feel.

**Required Materials**:
- **15 Purple Tokens or Skull Beads** — Voodoo Essence. Add as you generate, remove when invoking.
- **Curse Markers** — Small skull tokens to place on cursed enemy miniatures.
- **Totem Miniatures** — Small tokens or minis to mark placed totems on the grid.
- **Loa Reference Card** — Printed card showing all 5 loa: cost, precursor condition, and effect summary.
- **Voodoo Doll Prop** (Optional) — A small figure placed on the table for flavor.

**Tracking Essence (Token Bowl Method)**:
Keep purple tokens in a small bowl or pouch. Add one for each Essence gained. When you invoke a loa, physically remove the tokens from the bowl and place them in a "spent" pile. The sound of tokens hitting the bowl builds anticipation. The dramatic moment of dumping 10 tokens for Baron Samedi creates a table-wide moment.

**Tracking Curses**:
Place a small skull token on each cursed enemy's miniature. At a glance, you and the DM can count how many enemies are cursed — this is critical for Baron Samedi's precursor (3+ cursed). When a cursed enemy dies, remove the skull and add 3 Essence tokens.

**Quick Reference**:
\`\`\`
ESSENCE GENERATION (Max 15):
  Cast Curse: +1    | Apply Poison: +1    | Place Totem: +1
  Apply Poison: +1 | Place Totem: +1
  Complete Ritual: +2 | Defeat Cursed Enemy: +3
  (Per-action cap: 5 Essence max, except cursed enemy defeats)

LOA INVOCATIONS (Cost + Precursor):
  Simbi (5):         1+ ally below half HP
  Papa Legba (6):    5+ Essence generated this combat
  Erzulie (7):       2+ allies within 15ft of you
  Ogoun (8):         Poison active on any target
  Baron Samedi (10): 3+ enemies currently cursed

SPEC DISCOUNTS:
  Bokor: Baron 8 (2 cursed) | Mambo: Erzulie 5, Simbi 3
  Houngan: Ogoun 6, Legba 4
\`\`\`

**The Physical Hacks**:
- **The Curse Spread**: When you curse a new enemy, physically walk your curse token to their mini and place it. The movement draws table attention and makes the DM aware.
- **Totem Placement**: Use a distinct mini or token for each totem type. Place it physically on the grid square so everyone knows the area of effect.
- **Loa Invocation Ritual**: When you invoke a loa, stand up, announce the loa's name, and remove the Essence tokens one by one while counting down. Make it ceremonial — the table will remember it.
- **Voodoo Doll**: Keep a small doll or figure near your character sheet. Point to it when describing loa effects for flavor.

**Pro Tips**:
- Communicate your precursor status to the party: "I have 8 Essence and poison is active — I can invoke Ogoun next turn if we need damage." This lets the party plan around your invocation timing.
- Curse broadly early, then focus fire. The curse-first philosophy means your early turns are about spreading debuffs, not maximizing damage. Your damage comes later when Essence pays off.
- Track which enemies are cursed on your character sheet too. If a skull token gets knocked off an enemy mini, your sheet backup prevents arguments.
- If you are Mambo spec, tell the party when you invoke Erzulie (now only 5 Essence). "Erzulie is up — everyone group near me for the heal." The cheaper cost means you can invoke more often, changing your role from occasional nuker to frequent support.`,
    },
  },

  // Specializations
  specializations: {
    title: "Voodoo Specializations",
    subtitle: "Three Paths of the Loa",

    description: `Witch Doctors specialize in different aspects of voodoo practice, each focusing on specific loa and spiritual techniques. Choose your specialization to determine which divine powers you master.`,

    passiveAbility: {
      name: "Loa's Favor",
      description:
        "All Witch Doctors can invoke any of the five loa, but your specialization determines which invocations are enhanced and cost less essence.",
    },

    specs: [
      {
        id: "bokor",
        name: "Bokor",
        icon: "Necrotic/Arise",
        color: "#8B008B",
        theme: "Death Magic & Curses",

        description: `Bokors specialize in the darker aspects of voodoo, focusing on Baron Samedi and the manipulation of life and death. They excel at cursing enemies, raising the dead, and wielding necrotic power. The Bokor is the voodoo sorcerer who walks between the living and the dead.`,

        playstyle: "Aggressive cursing, necrotic damage, death manipulation",

        strengths: [
          "Baron Samedi invocation costs 2 less essence (8 instead of 10)",
          "Baron Samedi requires only 2 cursed enemies (instead of 3)",
          "Curses generate +1 additional Voodoo Essence",
          "Enhanced necrotic damage on cursed targets",
        ],

        weaknesses: [
          "Limited healing compared to other specs",
          "Requires curse management for peak performance",
          "Less effective against undead/constructs immune to curses",
        ],

        specPassive: {
          name: "Shadow's Embrace",
          description:
            "Baron Samedi invocations cost 2 less essence and require only 2 cursed enemies. Curses generate +1 additional Voodoo Essence.",
        },

        keyAbilities: [
          "Withering Hex: Your foundational curse that deals necrotic damage over time",
          "Bone Shrapnel: AoE necrotic burst that shreds grouped enemies",
          "Invoke Baron Samedi: Resurrect ally and devastate all cursed enemies",
        ],
      },

      {
        id: "mambo",
        name: "Mambo",
        icon: "Healing/Heal Wound",
        color: "#20B2AA",
        theme: "Healing & Spirit Protection",

        description: `Mambos channel Erzulie and Simbi, focusing on protective magic, healing, and support. They excel at keeping allies alive through totems, healing rituals, and divine protection. The Mambo is the voodoo priestess who communes with healing spirits.`,

        playstyle: "Support-focused, totem placement, healing optimization",

        strengths: [
          "Erzulie invocation costs 2 less (5 instead of 7)",
          "Simbi invocation costs 2 less (3 instead of 5)",
          "Totems generate +1 additional Voodoo Essence",
          "Healing spells restore 50% more HP",
        ],

        weaknesses: [
          "Lower damage output",
          "Requires ally positioning awareness",
          "Totem placement can be disrupted",
          "Less effective when solo",
        ],

        specPassive: {
          name: "Spirit's Grace",
          description:
            "Erzulie and Simbi invocations cost 2 less essence. Totems generate +1 additional essence. Healing spells restore 50% more HP.",
        },

        keyAbilities: [
          "Totem of Healing: Healing totem that restores HP to nearby allies each turn",
          "Mending Wax: Direct healing spell with spiritual mending",
          "Invoke Erzulie: Divine protection granting armor, fear immunity, and party healing",
        ],
      },

      {
        id: "houngan",
        name: "Houngan",
        icon: "General/Rage",
        color: "#DC143C",
        theme: "Combat Enhancement & Poison",

        description: `Houngans follow Ogoun and Papa Legba, focusing on combat enhancement, poison warfare, and spiritual communication. They excel at empowering allies and devastating enemies with enhanced weapons. The Houngan is the voodoo warrior who channels war spirits into mortal combat.`,

        playstyle: "Aggressive support, poison application, combat buffs",

        strengths: [
          "Ogoun invocation costs 2 less (6 instead of 8)",
          "Papa Legba invocation costs 2 less (4 instead of 6)",
          "Poisons generate +1 additional Voodoo Essence",
          "Enhanced weapon damage (+2d4 on poisoned weapons)",
        ],

        weaknesses: [
          "Limited direct healing",
          "Poison-resistant enemies reduce effectiveness",
          "Requires melee proximity for some abilities",
        ],

        specPassive: {
          name: "Warrior's Spirit",
          description:
            "Ogoun and Papa Legba invocations cost 2 less essence. Poisons generate +1 additional essence. Weapon attacks deal +2d4 additional damage while poison is active.",
        },

        keyAbilities: [
          "Venomous Sting: Apply voodoo venom to your weapon, dealing poison damage and generating Essence",
          "Venomous Weapon: Apply a potent poison adding damage to your attacks for an extended duration",
          "Invoke Ogoun: Empower all allies with combat prowess and fire damage",
        ],
      },
    ],
  },

  // =============================================
  // UNIFIED SPELL LIST (30 spells, 3 per level)
  // =============================================
  spells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: "witch_doctor_withering_hex",
      name: "Withering Hex",
      description:
        "Afflict an enemy with a necrotic hex that deals 1d6 + spirit necrotic damage immediately, then withers them for 1d6 + spirit necrotic damage per round for 3 rounds. Counts as a curse toward Baron Samedi's precursor.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ritual",
        tags: ["attack", "damage", "hex", "necrotic", "curse", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "1d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: "round",
          dotFormula: "1d6 + spirit",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence when cast",
        },
        curse: { type: "withering", countsTowardBaronSamedi: true },
      },
      tags: ["attack", "damage", "curse", "necrotic", "witch doctor"],
    },

    {
      id: "witch_doctor_venomous_sting",
      name: "Venomous Sting",
      description:
        "Coat your weapon with a mild voodoo toxin. Your next attack deals additional poison damage and weakens the target.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Poison/Poison Fang",
        tags: ["buff", "poison", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "venomous_sting",
            name: "Venomous Sting",
            description:
              "Next weapon attack deals +1d4 poison damage and reduces target Strength by 1 for 2 rounds",
            customDescription:
              "Your weapon drips with voodoo venom. Your next strike will poison your foe.",
            mechanicsText:
              "Next weapon attack deals +1d4 poison damage. Target gets -1 Strength for 2 rounds.",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
        charges: 1,
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        rangeDistance: 0,
        targetRestrictions: ["self"],
        maxTargets: 1,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      resolution: "AUTOMATIC",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (poison applied)",
        },
        precursor: {
          enables: "ogoun",
          description: "Poison active contributes toward Ogoun precursor",
        },
      },
      tags: ["buff", "poison", "witch doctor"],
    },

    {
      id: "witch_doctor_spirit_link",
      name: "Spirit Link",
      description:
        "Link yourself to an ally, sharing damage 50/50 between you for 3 rounds.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Ethereal Bear Spirit",
        tags: ["buff", "support", "spirit", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "spirit_link",
            name: "Spirit Link",
            description:
              "Damage taken is split 50/50 between linked allies for 3 rounds",
            customDescription:
              "You are spiritually linked. When either of you takes damage, both of you share that damage equally.",
            mechanicsText:
              "Damage taken is split 50/50 between linked allies for 3 rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: ["buff", "support", "spirit", "witch doctor"],
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: "witch_doctor_grave_bane",
      name: "Grave Bane",
      description:
        "Hurl a fistful of grave dirt that clings to your enemy, sapping their vitality and dulling their reflexes.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: [
          "attack",
          "damage",
          "debuff",
          "necrotic",
          "curse",
          "witch doctor",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "2d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "grave_bane_slow",
            name: "Grave Bane",
            description: "Agility reduced by 2 for 3 rounds",
            statModifier: {
              stat: "agility",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (curse)",
        },
        curse: { type: "grave_bane", countsTowardBaronSamedi: true },
      },
      tags: ["attack", "damage", "debuff", "necrotic", "curse", "witch doctor"],
    },

    {
      id: "witch_doctor_totem_of_warding",
      name: "Totem of Warding",
      description: "Place a small totem that shields nearby allies from harm.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["buff", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Natural",
        tags: ["buff", "totem", "support", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "totem_warding",
            name: "Totem of Warding",
            description:
              "Allies within 10 ft gain +1 to saving throws for 5 rounds",
            customDescription:
              "A carved totem pulses with protective energy, shielding nearby allies from harmful magic.",
            mechanicsText:
              "Allies within 10 ft gain +1 to saving throws for 5 rounds",
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      summoningConfig: {
        creatureType: "totem",
        creatures: [
          {
            id: "warding_totem",
            name: "Warding Totem",
            description:
              "A small totem that grants +1 to saving throws for allies within 10 ft. Can be destroyed (8 HP, 8 Armor).",
            size: "Small",
            type: "construct",
            hp: 8,
            ac: 8,
          },
        ],
        duration: 5,
        durationUnit: "rounds",
        maxSummons: 1,
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 20,
        aoeType: "circle",
        aoeSize: 10,
        targetRestrictions: ["ally"],
        maxTargets: 4,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Carved wooden totem",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "AUTOMATIC",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (totem placed)",
        },
      },
      tags: ["buff", "totem", "support", "witch doctor"],
    },

    {
      id: "witch_doctor_mending_wax",
      name: "Mending Wax",
      description:
        "Apply a mystical wax salve to an ally, restoring 2d8 + spirit HP with the help of ancestral spirits.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["healing"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heal Wound",
        tags: ["healing", "support", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "2d8 + spirit",
        healingType: "instant",
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally", "self"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 7 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: ["healing", "support", "witch doctor"],
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: "witch_doctor_bone_shrapnel",
      name: "Bone Shrapnel",
      description:
        "Conjure a burst of sharpened bone fragments that explode outward, dealing 3d6 + spirit necrotic damage to all enemies within 15 feet.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Bone Shards",
        tags: ["attack", "damage", "aoe", "necrotic", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "3d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "circle",
        aoeSize: 15,
        targetRestrictions: ["enemies"],
        maxTargets: 4,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: ["attack", "damage", "aoe", "necrotic", "witch doctor"],
    },

    {
      id: "witch_doctor_witch_brew",
      name: "Witch Brew",
      description:
        "Rapidly distill a volatile elixir from bone dust and herbs. The brew grants +3 Agility and +2 Initiative for 3 rounds.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Natural",
        tags: ["buff", "support", "potion", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "witch_brew_agility",
            name: "Witch Brew",
            description: "Gain +3 to Agility for 3 rounds",
            statModifier: {
              stat: "agility",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
          {
            id: "witch_brew_initiative",
            name: "Witch Brew",
            description: "Gain +2 to Initiative for 3 rounds",
            statModifier: {
              stat: "initiative",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 20,
        targetRestrictions: ["ally", "self"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: ["buff", "support", "potion", "witch doctor"],
    },

    {
      id: "witch_doctor_soul_siphon",
      name: "Soul Siphon",
      description:
        "Reach into the spirit of a wounded enemy and drain their life force, transferring it to yourself or an ally.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: [
          "attack",
          "damage",
          "healing",
          "lifesteal",
          "necrotic",
          "witch doctor",
        ],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 25,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
        targetingMode: "effect",
      },
      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "ranged",
          rangeDistance: 25,
          targetRestrictions: ["enemies"],
          maxTargets: 1,
        },
        healing: {
          targetingType: "self",
        },
      },
      damageConfig: {
        formula: "2d8 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      healingConfig: {
        formula: "2d8 + spirit/2",
        healingType: "instant",
        resolution: "DICE",
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 11 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (life drain)",
        },
      },
      tags: [
        "attack",
        "damage",
        "healing",
        "lifesteal",
        "necrotic",
        "witch doctor",
      ],
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: "witch_doctor_mass_curse",
      name: "Mass Curse",
      description:
        "Curse multiple enemies at once, dealing 2d6 + spirit necrotic damage immediately and 2d6 + spirit necrotic damage per round for 4 rounds to all targets. Each target counts as a cursed enemy toward Baron Samedi's precursor.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Death",
        tags: ["attack", "damage", "curse", "aoe", "necrotic", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "2d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        hasDotEffect: true,
        dotConfig: {
          duration: 4,
          tickFrequency: "round",
          dotFormula: "2d6 + spirit",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "multi",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemies"],
        maxTargets: 3,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", gain: 3 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 3,
          description: "Generates 1 Voodoo Essence per target cursed (up to 3)",
        },
        curse: {
          type: "mass_curse",
          countsTowardBaronSamedi: true,
          perTarget: true,
        },
      },
      tags: ["attack", "damage", "curse", "aoe", "necrotic", "witch doctor"],
    },

    {
      id: "witch_doctor_voodoo_doll",
      name: "Voodoo Doll",
      description:
        "Create a voodoo doll of your enemy and deal 4d6 + spirit necrotic damage. For 3 rounds (concentration), damaging the doll deals the same damage to the linked enemy.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "utility", "voodoo", "witch doctor"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "4d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          {
            id: "voodoo_doll",
            name: "Voodoo Doll",
            description:
              "Creates a voodoo doll linked to target for 3 rounds (requires concentration). Damage the doll to hurt the target.",
          },
        ],
        duration: 3,
        durationUnit: "rounds",
        concentration: true,
        power: "moderate",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        materialComponents: "A cloth doll and a strand of target hair",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence",
        },
      },
      tags: ["damage", "utility", "voodoo", "witch doctor"],
    },

    {
      id: "witch_doctor_invoke_simbi",
      name: "Invoke Simbi",
      description:
        "Invoke Simbi, the loa of water and magic. Heals 4d8 + spirit HP instantly, then 1d8 + spirit/2 HP per round for 3 rounds. Target also gains +2 to spirit-based saves for 3 rounds. Costs 5 Voodoo Essence (3 for Mambo). Requires 1 ally below half HP.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["healing", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heart Ripple",
        tags: ["healing", "buff", "loa", "support", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "4d8 + spirit",
        healingType: "instant",
        hasHotEffect: true,
        hotFormula: "1d8 + spirit/2",
        hotDuration: 3,
        hotTickType: "round",
        isProgressiveHot: false,
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "simbi_blessing",
            name: "Simbi's Blessing",
            description: "Gain +2 to spirit-based saves for 3 rounds",
            statModifier: {
              stat: "saving_throws",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["ally", "self"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", cost: 5 },
      },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          cost: 5,
          specialization_discount: 2,
          description: "Costs 5 Voodoo Essence (3 for Mambo)",
        },
        precursors: {
          required: ["1_ally_below_half_hp"],
          description: "Requires 1 ally below half HP",
        },
        invocation: {
          type: "loa",
          deity: "Simbi",
          cooldown: "once_per_short_rest",
        },
      },
      tags: ["healing", "buff", "loa", "support", "witch doctor"],
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: "witch_doctor_hex",
      name: "Hex",
      description:
        "Place a powerful hex on your enemy that amplifies all damage they take by 25% for 4 rounds. Spirit save DC 15 negates. Counts as a curse toward Baron Samedi's precursor.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Utility/All Seeing Eye",
        tags: ["debuff", "curse", "hex", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      debuffConfig: {
        debuffType: "custom",
        effects: [
          {
            id: "hex",
            name: "Hex",
            description:
              "Target takes 25% more damage from all sources for 4 rounds",
            customDescription:
              "You are hexed. All damage you take is increased by 25% for 4 rounds.",
            statPenalty: {
              stat: "damage_taken",
              value: 25,
              magnitudeType: "percentage_increase",
            },
            mechanicsText: "25% increased damage from all sources for 4 rounds",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (curse)",
        },
        curse: { type: "hex", countsTowardBaronSamedi: true },
      },
      tags: ["debuff", "curse", "hex", "witch doctor"],
    },

    {
      id: "witch_doctor_zombie_swarm",
      name: "Zombie Swarm",
      description:
        "Summon 4 zombies to fight for you for 5 rounds. The zombies follow your mental commands within 60 feet.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Arise",
        tags: ["summoning", "undead", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      summoningConfig: {
        creatures: [
          {
            id: "zombie",
            name: "Zombie",
            description: "Shambling undead minion",
            size: "Medium",
            type: "undead",
            tokenIcon: "spell_shadow_raisedead",
            stats: {
              maxHp: 25,
              armor: 11,
              maxMana: 0,
            },
            config: {
              quantity: 4,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 60,
            },
          },
        ],
        duration: 5,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        controlRange: 60,
        controlType: "mental",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Four corpses or grave dirt",
        classResource: { type: "voodoo_essence", gain: 2 },
      },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: "Generates 2 Voodoo Essence (ritual/summoning)",
        },
      },
      tags: ["summoning", "undead", "witch doctor"],
    },

    {
      id: "witch_doctor_venomous_weapon",
      name: "Venomous Weapon",
      description:
        "Apply a potent poison to your weapon, adding 2d4 poison damage to your attacks for 1 hour. Satisfies Ogoun's precursor condition.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Slashing/Dual Blades",
        tags: ["buff", "poison", "weapon", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "venomous_weapon",
            name: "Venomous Weapon",
            description: "Weapon deals additional 2d4 poison damage for 1 hour",
            customDescription:
              "Your weapon drips with voodoo venom, dealing extra poison damage on each strike.",
            mechanicsText: "Weapon deals +2d4 poison damage for 1 hour",
          },
        ],
        durationValue: 60,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"],
        maxTargets: 1,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Poison extract",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      resolution: "AUTOMATIC",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (poison applied)",
        },
        precursor: {
          enables: "ogoun",
          description: "Poison active enables Ogoun invocation",
        },
      },
      tags: ["buff", "poison", "weapon", "witch doctor"],
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: "witch_doctor_death_ward",
      name: "Death Ward",
      description:
        "Protect an ally from death. When they would be reduced to 0 HP within 5 rounds, they are instead reduced to 1 HP. Triggers once.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Necrotic/Necrotic Death",
        tags: ["buff", "defense", "protection", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "death_ward",
            name: "Death Ward",
            description:
              "When you would be reduced to 0 HP, instead be reduced to 1 HP. Triggers once, lasts 5 rounds.",
            customDescription:
              "You are protected by a death ward. The next time you would be reduced to 0 HP within 5 rounds, you are instead reduced to 1 HP. This effect then ends.",
            mechanicsText:
              "When reduced to 0 HP, instead reduced to 1 HP. Triggers once, lasts 5 rounds.",
            charges: 1,
            duration: 5,
            durationUnit: "rounds",
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally", "self"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: ["buff", "defense", "protection", "witch doctor"],
    },

    {
      id: "witch_doctor_invoke_papa_legba",
      name: "Invoke Papa Legba",
      description:
        "Invoke Papa Legba, the loa of crossroads and gateways. Grant telepathy to all allies and teleport up to 5 allies within 1 mile.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["utility"],
      typeConfig: {
        school: "arcane",
        icon: "Arcane/Portal Archway",
        tags: ["utility", "loa", "teleport", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          {
            id: "papa_legba_telepathy",
            name: "Papa Legba's Telepathy",
            description: "All allies can communicate telepathically for 1 hour",
          },
          {
            id: "papa_legba_teleport",
            name: "Crossroads Passage",
            description:
              "Teleport up to 5 allies to any previously seen location within 1 mile",
          },
        ],
        duration: 60,
        durationUnit: "rounds",
        concentration: false,
        power: "major",
      },
      targetingConfig: {
        targetingType: "smart",
        rangeType: "special",
        rangeDistance: 5280,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", cost: 6 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "AUTOMATIC",
      specialMechanics: {
        voodooEssence: {
          cost: 6,
          specialization_discount: 2,
          description: "Costs 6 Voodoo Essence (4 for Houngan)",
        },
        precursors: {
          required: ["5_essence_generated_this_combat"],
          description: "Requires 5+ Essence generated this combat",
        },
        invocation: {
          type: "loa",
          deity: "Papa Legba",
          cooldown: "once_per_long_rest",
        },
      },
      tags: ["utility", "loa", "teleport", "witch doctor"],
    },

    {
      id: "witch_doctor_totem_of_healing",
      name: "Totem of Healing",
      description:
        "Place a healing totem that restores hit points to all allies within 10 feet each turn for 10 rounds.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["healing", "summoning"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heal Wound",
        tags: ["healing", "totem", "support", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "2d4",
        healingType: "aoe_allies",
        hasHotEffect: true,
        hotFormula: "2d4",
        hotDuration: 10,
        hotTickType: "turn",
        isProgressiveHot: false,
        resolution: "AUTOMATIC",
      },
      summoningConfig: {
        creatureType: "totem",
        creatures: [
          {
            id: "healing_totem",
            name: "Healing Totem",
            description:
              "Totem that heals allies within 10 feet each turn. Can be destroyed (10 HP, 10 Armor).",
            size: "Small",
            type: "construct",
            hp: 10,
            ac: 10,
          },
        ],
        duration: 10,
        durationUnit: "rounds",
        maxSummons: 1,
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "circle",
        aoeSize: 10,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Carved wooden totem",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "AUTOMATIC",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (totem placed)",
        },
      },
      tags: ["healing", "totem", "support", "witch doctor"],
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: "witch_doctor_invoke_ogoun",
      name: "Invoke Ogoun",
      description:
        "Invoke Ogoun, the loa of war and iron. Deals 8d8 + spirit×2 slashing damage to all enemies within 20 feet. All allies gain +3 to attack rolls and +2d6 fire damage on attacks for 4 rounds. Costs 8 Voodoo Essence (6 for Houngan). Requires poison active on any target.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage", "buff"],
      typeConfig: {
        school: "slashing",
        secondaryElement: "fire",
        icon: "Utility/Powerful Warrior",
        tags: ["damage", "buff", "loa", "war", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "8d8 + spirit * 2",
        elementType: "slashing",
        damageTypes: ["slashing"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["ogoun_fury_stun"],
        },
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "ogoun_fury",
            name: "Ogoun's Fury",
            description:
              "All allies gain +3 to attack rolls and +2d6 fire damage on attacks for 4 rounds",
            statModifier: {
              stat: "attack_rolls",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
          {
            id: "ogoun_fire",
            name: "Ogoun's Fire",
            description: "+2d6 fire damage on all attacks for 4 rounds",
            mechanicsText: "+2d6 fire damage on attacks for 4 rounds",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        aoeType: "circle",
        aoeSize: 20,
        targetRestrictions: ["any"],
        maxTargets: 10,
        targetSelectionMethod: "auto",
        requiresLineOfSight: false,
        targetingMode: "effect",
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          targetRestrictions: ["enemies"],
          maxTargets: 20,
        },
        buff: {
          targetingType: "area",
          rangeType: "self_centered",
          targetRestrictions: ["ally", "self"],
          maxTargets: 10,
        },
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
        classResource: { type: "voodoo_essence", cost: 8 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          cost: 8,
          specialization_discount: 2,
          description: "Costs 8 Voodoo Essence (6 for Houngan)",
        },
        precursors: {
          required: ["poison_active"],
          description: "Requires poison active on any target",
        },
        invocation: {
          type: "loa",
          deity: "Ogoun",
          cooldown: "once_per_long_rest",
        },
      },
      tags: ["damage", "buff", "loa", "war", "witch doctor"],
    },

    {
      id: "witch_doctor_invoke_erzulie",
      name: "Invoke Erzulie",
      description:
        "Invoke Erzulie, the loa of love and beauty. Heals all allies within 30 feet for 3d8 + spirit HP instantly and 3d8 + spirit HP per round for 5 rounds. All allies gain +2 armor and fear immunity for 5 rounds. Costs 7 Voodoo Essence (5 for Mambo). Requires 2+ allies within 15 feet.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["buff", "healing"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Reaching Hand",
        tags: ["buff", "healing", "loa", "support", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "3d8 + spirit",
        healingType: "aoe_allies",
        hasHotEffect: true,
        hotFormula: "3d8 + spirit",
        hotDuration: 5,
        hotTickType: "round",
        isProgressiveHot: false,
        resolution: "AUTOMATIC",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "erzulie_blessing",
            name: "Erzulie's Protection",
            description:
              "Protected by Erzulie. +2 armor and immune to fear for 5 rounds.",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
            immunities: ["fear"],
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["ally", "self"],
        maxTargets: 10,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Perfume, jewelry, and flowers",
        classResource: { type: "voodoo_essence", cost: 7 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "AUTOMATIC",
      specialMechanics: {
        voodooEssence: {
          cost: 7,
          specialization_discount: 2,
          description: "Costs 7 Voodoo Essence (5 for Mambo)",
        },
        precursors: {
          required: ["2_allies_within_15ft"],
          description: "Requires 2+ allies within 15 feet of you",
        },
        invocation: {
          type: "loa",
          deity: "Erzulie",
          cooldown: "once_per_long_rest",
        },
      },
      tags: ["buff", "healing", "loa", "support", "witch doctor"],
    },

    {
      id: "witch_doctor_ritual_of_death",
      name: "Ritual of Death",
      description:
        "Perform a dark ritual that deals 3d6 + spirit necrotic damage to all enemies in a 15-foot area, plus 3d6 necrotic damage per round for 3 rounds. Enemies must make a Spirit save DC 15 or become frightened for 3 rounds. Generates 2 Voodoo Essence.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ritual",
        tags: ["damage", "ritual", "aoe", "fear", "witch doctor"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "3d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "3d6",
          duration: 3,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "fear",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "frightened",
            name: "Frightened",
            description:
              "Frightened by dark ritual. Disadvantage on ability checks and attack rolls.",
            statusType: "frightened",
            level: "moderate",
            duration: 3,
            durationUnit: "rounds",
          },
        ],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "circle",
        aoeSize: 15,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Graveyard dirt and bone dust",
        classResource: { type: "voodoo_essence", gain: 2 },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: "Generates 2 Voodoo Essence (ritual completion)",
        },
      },
      tags: ["damage", "ritual", "aoe", "fear", "witch doctor"],
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: "witch_doctor_invoke_baron_samedi",
      name: "Invoke Baron Samedi",
      description:
        "Invoke Baron Samedi, the loa of death. Deals 14d6 + spirit×3 necrotic damage to all enemies within 40 feet. Cursed enemies take TRIPLE damage. Costs 10 Voodoo Essence (8 for Bokor). Requires 3+ cursed enemies on the field (2 for Bokor).",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Death Mark",
        tags: ["damage", "loa", "death", "epic", "witch doctor"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "14d6 + spirit * 3",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            conditionalFormulas: {
              cursed_target: "14d6 + spirit * 3 × 3",
              uncursed_target: "14d6 + spirit * 3",
              default: "14d6 + spirit * 3",
            },
          },
        },
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        aoeType: "circle",
        aoeSize: 40,
        targetRestrictions: ["enemies"],
        maxTargets: 15,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Rum, cigars, and grave dirt",
        classResource: { type: "voodoo_essence", cost: 10 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          cost: 10,
          specialization_discount: 2,
          description: "Costs 10 Voodoo Essence (8 for Bokor)",
        },
        precursors: {
          required: ["3_cursed_enemies"],
          specialization_reduction: "2_for_bokor",
          description: "Requires 3 cursed enemies (2 for Bokor)",
        },
        invocation: {
          type: "loa",
          deity: "Baron Samedi",
          cooldown: "once_per_long_rest",
        },
      },
      tags: ["damage", "loa", "death", "epic", "witch doctor"],
    },

    {
      id: "witch_doctor_mass_resurrection",
      name: "Mass Resurrection",
      description:
        "Invoke the spirits to resurrect all dead allies within 30 feet at half HP (6d8 + spirit healing). Casting time: 3 actions.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["healing", "restoration"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Prayer",
        tags: ["healing", "resurrection", "spirit", "epic", "witch doctor"],
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "6d8 + spirit",
        healingType: "instant",
        resolution: "DICE",
      },
      restorationConfig: {
        restorationType: "resurrection",
        resourceType: "health",
        resolution: "DICE",
        formula: "6d8 + spirit",
        restoredHealth: "50%",
        restoredMana: 0,
        removesConditions: ["dead"],
        castingTime: 3,
        castingTimeUnit: "actions",
        timeLimit: 5,
        timeLimitUnit: "minutes",
        penaltyOnRevive: null,
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeType: "circle",
        aoeSize: 30,
        targetRestrictions: ["ally"],
        maxTargets: 10,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Ancestral bones and offerings",
        classResource: { type: "voodoo_essence", gain: 2 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 2,
          description: "Generates 2 Voodoo Essence (ritual)",
        },
      },
      tags: ["healing", "resurrection", "spirit", "epic", "witch doctor"],
    },

    {
      id: "witch_doctor_plague_storm",
      name: "Plague Storm",
      description:
        "Summon a storm of disease and decay that deals 12d6 + spirit necrotic damage to all enemies in a 35-foot area. Affected enemies have movement speed reduced by 20 feet and healing received reduced by 50% for 5 rounds.",
      level: 8,
      spellType: "STATE",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        tags: [
          "damage",
          "debuff",
          "disease",
          "aoe",
          "zone",
          "epic",
          "witch doctor",
        ],
        zoneDuration: 5,
        zoneDurationUnit: "rounds",
        leaveTrail: false,
      },
      damageConfig: {
        formula: "12d6 + spirit",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          {
            id: "diseased_speed",
            name: "Plague Slowed",
            description: "Movement speed reduced by 20 feet for 5 rounds",
            mechanicsText: "-20 ft movement speed for 5 rounds",
            statPenalty: {
              stat: "movement_speed",
              magnitude: -20,
              magnitudeType: "flat",
            },
          },
          {
            id: "diseased_healing",
            name: "Plague Weakened",
            description: "Healing received reduced by 50% for 5 rounds",
            mechanicsText: "-50% healing received for 5 rounds",
            statPenalty: {
              stat: "healing_received",
              magnitude: -50,
              magnitudeType: "percentage",
            },
          },
        ],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 80,
        aoeType: "circle",
        aoeSize: 35,
        targetRestrictions: ["enemies"],
        maxTargets: 20,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 30 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Diseased flesh or plague rat",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: [
        "damage",
        "debuff",
        "disease",
        "aoe",
        "zone",
        "epic",
        "witch doctor",
      ],
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: "witch_doctor_voodoo_apocalypse",
      name: "Voodoo Apocalypse",
      description:
        "Unleash a devastating voodoo apocalypse that deals 18d6 + spirit×3 necrotic damage to all enemies in sight. Constitution save DC 19 for half damage. Affected enemies suffer 3d8 necrotic damage per round and disadvantage on all rolls for 5 rounds.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Twist Pain",
        tags: ["damage", "debuff", "curse", "aoe", "legendary", "witch doctor"],
        castTime: 4,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "18d6 + spirit * 3",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "reduced_duration",
        },
        effects: [
          {
            id: "voodoo_curse_dot",
            name: "Voodoo Curse",
            description: "3d8 necrotic damage per round for 5 rounds",
            mechanicsText: "3d8 necrotic/round for 5 rounds",
          },
          {
            id: "voodoo_curse_disadvantage",
            name: "Voodoo Curse",
            description: "Disadvantage on all rolls for 5 rounds",
            mechanicsText: "Disadvantage on all rolls for 5 rounds",
            statPenalty: {
              stat: "all_rolls",
              magnitude: -99,
              magnitudeType: "disadvantage",
            },
          },
        ],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        aoeType: "circle",
        aoeSize: 80,
        targetRestrictions: ["enemies"],
        maxTargets: 30,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "The skull of a powerful enemy, worth 50,000 gold",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Does not generate Voodoo Essence",
        },
      },
      tags: ["damage", "debuff", "curse", "aoe", "legendary", "witch doctor"],
    },

    {
      id: "witch_doctor_spirit_ascension",
      name: "Spirit Ascension",
      description:
        "Ascend to become a pure spirit for 5 rounds. Gain +5 to all stats, physical damage resistance, 50% magic damage reduction, and generate +3 Voodoo Essence per round. All voodoo spells cost 50% less mana.",
      level: 9,
      spellType: "STATE",
      effectTypes: ["transformation", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Teleport",
        tags: ["transformation", "buff", "spirit", "legendary", "witch doctor"],
        stateVisibility: "visible",
        cooldownAfterTrigger: 0,
        cooldownUnit: "seconds",
        maxTriggers: 1,
      },
      transformationConfig: {
        transformationType: "spectral",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Spirit Form",
        description:
          "Become one with the spirit world, transcending physical limitations.",
        grantedAbilities: [
          {
            id: "spirit_resistance",
            name: "Spirit Resistance",
            description: "Resistance to physical damage",
          },
          {
            id: "voodoo_discount",
            name: "Voodoo Efficiency",
            description: "All voodoo spells cost 50% less mana",
          },
          {
            id: "essence_gen",
            name: "Essence Generation",
            description: "Generate +3 Voodoo Essence per round",
          },
          {
            id: "spirit_stats",
            name: "+5 All Stats",
            description: "+5 to all attributes",
          },
        ],
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "spirit_form_power",
            name: "Spirit Stats",
            description: "+5 to all stats",
            statModifier: {
              stat: "all_stats",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
          {
            id: "spirit_form_defense",
            name: "Spirit Form Defense",
            description:
              "Gain resistance to physical damage and 50% magical damage reduction for 5 rounds",
            statModifier: {
              stat: "damage_reduction",
              magnitude: 50,
              magnitudeType: "percentage",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description:
            "Does not generate Voodoo Essence (but form generates +3/round)",
        },
      },
      tags: ["transformation", "buff", "spirit", "legendary", "witch doctor"],
    },

    {
      id: "witch_doctor_invoke_erzulie_legendary",
      name: "Invoke Erzulie (Supreme)",
      description:
        "Invoke Erzulie in her supreme aspect. Heals all allies within 60 feet for 10d8 + spirit×2 HP instantly and 3d8 + spirit HP per round for 5 rounds. All allies gain +4 to all stats for 5 rounds. Costs 7 Voodoo Essence (5 for Mambo). Requires 2+ allies within 15 feet.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["buff", "healing"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Reaching Hand",
        tags: [
          "buff",
          "healing",
          "loa",
          "support",
          "legendary",
          "witch doctor",
        ],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "10d8 + spirit * 2",
        healingType: "instant",
        hasHotEffect: true,
        hotFormula: "3d8 + spirit",
        hotDuration: 5,
        hotTickType: "round",
        isProgressiveHot: false,
        resolution: "DICE",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "erzulie_blessing_legendary",
            name: "Erzulie's Supreme Blessing",
            description:
              "All allies gain +4 to all stats and +50% healing received for 5 rounds",
            statModifier: {
              stat: "all_stats",
              magnitude: 4,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeType: "circle",
        aoeSize: 60,
        targetRestrictions: ["ally", "self"],
        maxTargets: 20,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Perfume, jewelry, and flowers",
        classResource: { type: "voodoo_essence", cost: 7 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          cost: 7,
          specialization_discount: 2,
          description: "Costs 7 Voodoo Essence (5 for Mambo)",
        },
        precursors: {
          required: ["2_allies_within_15ft"],
          description: "Requires 2+ allies within 15 feet of you",
        },
        invocation: {
          type: "loa",
          deity: "Erzulie",
          cooldown: "once_per_long_rest",
          isSupreme: true,
        },
      },
      tags: ["buff", "healing", "loa", "support", "legendary", "witch doctor"],
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: "witch_doctor_eternal_voodoo",
      name: "Eternal Voodoo",
      description: "Become one with the loa, gaining permanent voodoo mastery.",
      level: 10,
      spellType: "PASSIVE",
      effectTypes: ["buff"],
      typeConfig: {
        school: "nature",
        icon: "Radiant/Golden Ring",
        tags: [
          "buff",
          "passive",
          "loa",
          "legendary",
          "witch doctor",
          "toggleable",
        ],
        toggleable: true,
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "eternal_voodoo",
            name: "Eternal Voodoo",
            description:
              "Generate 3 Voodoo Essence per round automatically. All loa invocations cost 3 less essence (minimum 4). Immune to curses.",
            customDescription:
              "You have achieved eternal voodoo mastery. You generate 3 Voodoo Essence per round automatically. All loa invocations cost 3 less essence (minimum 4). You are immune to all curses.",
            mechanicsText:
              "Generate 3 Voodoo Essence/round, loa cost -3 (min 4), immune to curses",
            damageImmunity: ["curse"],
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
        concentrationRequired: false,
        canBeDispelled: false,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        useFormulas: {},
        actionPoints: 0,
        components: ["ritual"],
        materialComponents:
          "The blessing of all the loa, 100,000 gold worth of offerings",
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 0,
          description: "Passive: generates 3 Voodoo Essence per round",
        },
      },
      tags: [
        "buff",
        "passive",
        "loa",
        "legendary",
        "witch doctor",
        "toggleable",
      ],
    },

    {
      id: "witch_doctor_invoke_papa_legba_supreme",
      name: "Invoke Papa Legba (Supreme)",
      description:
        "Invoke Papa Legba in his supreme aspect. Opens crossroads portals across the entire battlefield — allies can teleport freely between them for 10 rounds. Enemies who enter portals are trapped for 1 round and take 6d10 necrotic damage (Dexterity save DC 17 negates). Costs 6 Voodoo Essence (4 for Houngan). Requires 5+ Essence generated this combat.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["damage", "utility", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Nature/Root Network",
        tags: [
          "damage",
          "utility",
          "control",
          "loa",
          "teleport",
          "legendary",
          "witch doctor",
        ],
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "6d10",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        savingThrow: {
          ability: "dexterity",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "special",
        selectedEffects: [
          {
            id: "papa_legba_supreme",
            name: "Crossroads Portal Network",
            description:
              "Opens portals across the battlefield. Allies can teleport freely between them for 10 rounds.",
          },
        ],
        duration: 10,
        durationUnit: "rounds",
        concentration: false,
        power: "major",
      },
      controlConfig: {
        controlType: "restriction",
        strength: "strong",
        duration: 10,
        durationUnit: "rounds",
        savingThrow: {
          ability: "dexterity",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "portal_trap",
            name: "Portal Trap",
            description:
              "Enemies who enter portals are trapped for 1 round and take 6d10 necrotic damage",
            duration: 1,
            durationUnit: "rounds",
          },
        ],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        aoeType: "circle",
        aoeSize: 100,
        targetRestrictions: ["any"],
        maxTargets: 0,
        targetSelectionMethod: "manual",
        requiresLineOfSight: false,
        targetingMode: "effect",
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "sight",
          targetRestrictions: ["enemies"],
          maxTargets: 20,
        },
        utility: {
          targetingType: "area",
          rangeType: "sight",
          targetRestrictions: ["ally", "self"],
          maxTargets: 20,
        },
        control: {
          targetingType: "area",
          rangeType: "sight",
          targetRestrictions: ["enemies"],
          maxTargets: 20,
        },
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Keys, crossroads dirt, and rum",
        classResource: { type: "voodoo_essence", cost: 6 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          cost: 6,
          specialization_discount: 2,
          description: "Costs 6 Voodoo Essence (4 for Houngan)",
        },
        precursors: {
          required: ["5_essence_generated_this_combat"],
          description: "Requires 5+ Essence generated this combat",
        },
        invocation: {
          type: "loa",
          deity: "Papa Legba",
          cooldown: "once_per_long_rest",
          isSupreme: true,
        },
      },
      tags: [
        "utility",
        "control",
        "loa",
        "teleport",
        "legendary",
        "witch doctor",
      ],
    },

    {
      id: "witch_doctor_ultimate_curse",
      name: "Ultimate Curse",
      description:
        "Place the ultimate voodoo curse on an enemy. Deals 22d6 + spirit×4 necrotic damage. If they survive, they are doomed to die in 3 rounds unless the curse is removed by legendary magic. Constitution save DC 20 reduces the curse level. Counts as a curse toward Baron Samedi's precursor.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Screaming Skull",
        tags: [
          "damage",
          "debuff",
          "curse",
          "death",
          "legendary",
          "witch doctor",
        ],
        castTime: 5,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "22d6 + spirit * 4",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "custom",
        effects: [
          {
            id: "doom_curse",
            name: "Doom Curse",
            description:
              "Doomed to die in 3 rounds unless removed by powerful magic",
            customDescription:
              "You are cursed with the ultimate doom. If you are still alive after 3 rounds, you die instantly. This curse can only be removed by legendary magic or intervention of the gods.",
            mechanicsText:
              "Doomed to die in 3 rounds unless removed by powerful magic",
            duration: 3,
            durationUnit: "rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 20,
          saveOutcome: "reduced_duration",
        },
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 100,
        targetRestrictions: ["enemies"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents:
          "A piece of the target's soul, worth immeasurable value",
        classResource: { type: "voodoo_essence", gain: 1 },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      specialMechanics: {
        voodooEssence: {
          generates: 1,
          description: "Generates 1 Voodoo Essence (curse)",
        },
        curse: { type: "ultimate_doom", countsTowardBaronSamedi: true },
      },
      tags: ["damage", "debuff", "curse", "death", "legendary", "witch doctor"],
    },
  ],

  // Spell Pools by Level (30 spells, 3 per level)
  spellPools: {
    1: [
      "witch_doctor_withering_hex",
      "witch_doctor_venomous_sting",
      "witch_doctor_spirit_link",
    ],
    2: [
      "witch_doctor_grave_bane",
      "witch_doctor_totem_of_warding",
      "witch_doctor_mending_wax",
    ],
    3: [
      "witch_doctor_bone_shrapnel",
      "witch_doctor_witch_brew",
      "witch_doctor_soul_siphon",
    ],
    4: [
      "witch_doctor_mass_curse",
      "witch_doctor_voodoo_doll",
      "witch_doctor_invoke_simbi",
    ],
    5: [
      "witch_doctor_hex",
      "witch_doctor_zombie_swarm",
      "witch_doctor_venomous_weapon",
    ],
    6: [
      "witch_doctor_death_ward",
      "witch_doctor_invoke_papa_legba",
      "witch_doctor_totem_of_healing",
    ],
    7: [
      "witch_doctor_invoke_ogoun",
      "witch_doctor_invoke_erzulie",
      "witch_doctor_ritual_of_death",
    ],
    8: [
      "witch_doctor_invoke_baron_samedi",
      "witch_doctor_mass_resurrection",
      "witch_doctor_plague_storm",
    ],
    9: [
      "witch_doctor_voodoo_apocalypse",
      "witch_doctor_spirit_ascension",
      "witch_doctor_invoke_erzulie_legendary",
    ],
    10: [
      "witch_doctor_eternal_voodoo",
      "witch_doctor_invoke_papa_legba_supreme",
      "witch_doctor_ultimate_curse",
    ],
  },
};
