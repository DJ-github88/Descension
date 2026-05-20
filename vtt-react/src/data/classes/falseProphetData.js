/**
 * False Prophet Class Data
 *
 * ECOSYSTEM AUTOPSY — FALSE PROPHET MASTER OVERHAUL
 *
 * • Why Bring Me?: Empathetic Link — active from Level 1 via Stitch of Suffering.
 *   The False Prophet stitches a parasitic bond between ally and enemy, redirecting a
 *   percentage of incoming damage straight into the linked foe. No other class can
 *   weaponize party suffering onto a target of their choosing from the very first turn.
 *   This is now their singular, terrifying utility — immediate and undeniable.
 *
 * • Fatal Flaw: The Isolation Penalty — without a living congregation (allies or
 *   enslaved entities) within a strict 30-foot radius, all mana costs inflate brutally.
 *   They are mouths that cannot sing if there are no lambs close by to devour.
 *   Extreme radiant vulnerability (+25% from all sources). Physically the frailest caster.
 *
 * • Level 1 Link Integration: Stitch of Suffering costs Mana, generates exactly 1
 *   Madness point, and threads an empathetic bond that redirects 30% of an ally's
 *   incoming damage to a linked enemy as psychic damage. The core utility loop is
 *   now operational from Turn 1. All Madness generation uses normalized random dice
 *   increments (1d4/1d6/1d8). Visual degradation tracker embedded in resourceSystem
 *   at thresholds 5/10/15/19 for VTT tracking. Apocalyptic Revelation convulsion
 *   backlash now scales catastrophically with accumulated Madness.
 */

export const FALSE_PROPHET_DATA = {
  id: "false_prophet",
  name: "False Prophet",
  icon: "fas fa-eye",
  role: "Caster/Controller",
  damageTypes: ["psychic", "void", "necrotic"],

  // Overview section
  overview: {
    title: "The False Prophet",
    subtitle: "The Lie That Devours the Living",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: The False Prophet harvests Madness Points (0-20) by preaching the void as divine truth, with each stolen point granting +1 damage to all psychic, void, and necrotic spells. The temptation is a noose — pull toward 20 for godlike power, but cross the threshold and an Insanity Convulsion tears through you: catastrophic self-harm, uncontrolled teleportation, stunned helplessness, or worse. Your Madness resets to zero. You begin the harvest again. You always begin again. Your empathetic link is active from Level 1 — Stitch of Suffering threads a parasitic bond between ally and enemy on your very first turn.

**Core Mechanic**: Preach void sermons → Roll dice for random Madness gains → Damage scales with Madness (+1 per point to all spell damage types) → Stitch empathetic links from Level 1 to redirect ally suffering onto enemies → Unlock Temptation thresholds at 6, 9, 12 Madness → Reach 20 and trigger Insanity Convulsion → Reset to 0

**Resource**: Madness Points (0-20 scale, random generation and spending)

**Playstyle**: Parasite caster hollowing themselves out on the altar of their own stolen power

**Best For**: Players who understand that power is a disease and want to see how far the infection spreads before it kills the host`,
    },

    description: `The False Prophet does not worship — they hollow. They preach the void as divine truth, accumulating Madness Points through sermons and rituals that scalp reality from the bone. This madness is not inspiration; it is the calcified agony of every mind they have consumed, pressed into service as weaponized despair. Their spells grow monstrous with accumulated suffering, but the weight threatens to collapse the Prophet from within. They walk a corpse-bridge over an abyss, and every step forward is built from the bones of those who believed them.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `False Prophets are parasites in holy vestments. They do not serve a higher power—they hollow one. They siphon life and faith from those around them, twisting devotion into a blade they hide in the flock's own hands. Their "miracles" are blood magic dressed in candlelight: every healing hand hides a draining grip, every blessing carries a hidden cost paid in vitality, every sermon is a fishhook planted deep in the soft tissue of the listener's soul. They are not shepherds. They are mouths that learned to sing so the lambs would walk willingly into the teeth.

Their madness is not a curse—it is the weight of every mind they have devoured, stacked like cordwood behind their eyes. At low Madness, they appear composed, even beatific. Holy. At high Madness, the mask rots: veins darken to river-mud beneath translucent skin, eyes dilate until no white remains, and their voice fractures into a chorus of every soul they have swallowed. They are not vessels of the divine. They are mass graves that learned to speak.

Common False Prophet archetypes include:
- **The Parasitic Shepherd**: Genuinely believes their parasitism is sacred communion—"I take your pain and make it holy." They are wrong. The pain is not holy. The pain is dinner.
- **The False Messiah**: Exploits the desperate and dying, offering miracles harvested from the still-living. Every resurrection is a theft from someone else's grave
- **The Devourer of Congregations**: Wanders from village to village, leaving congregations of smiling husks—alive, breathing, and utterly emptied of everything that made them human
- **The Sympathetic Torturer**: Creates empathetic links to feel their victims' pain—and feeds on it the way the starving feed on bread. They are never full. They are never done.
- **The Hollow Oracle**: Divines truth by eating the minds of others, leaving behind only shells. The shells keep breathing. The shells keep tithing. The shells do not know they are empty.

False Prophets understand that faith is a currency, and they are the only ones who know the coin is counterfeit. They trade in desperation, buying loyalty with forged miracles and paying in stolen life force. The question is never whether they will betray you—it is whether you will realize it before your veins run dry and your children kneel at their altar, mouthing prayers to a god that was never there.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `The False Prophet is a parasite in the machinery of combat. They do not win fights—they redirect them, turning the battlefield's suffering into a weapon aimed at the enemy's throat. What they excel at is theft:

**Empathetic Links**: Stitching wounds shut on your allies by carving them open on your enemies—blood-bound sympathetic connections that make suffering a transferrable wound
**Blood Miracles**: "Healing" and buffing that is actually disguised necrotic siphoning—the patient improves, then worsens, then empties. Every cure is a slower disease.
**Mind Domination**: Pupating inside the enemy's skull, forcing them to attack their allies, severing their connection to healing—a congregation is a congregation, even if it is screaming
**Zealotry Fuel**: Accumulating Madness to scale damage, but every stolen point brings them closer to catastrophic Insanity Convulsion—the consumed minds are not quiet, and eventually they scream all at once

**Why Bring Me? (Unique Utility)**: You are the ONLY class that can redirect suffering — and your empathetic link is active from Level 1. **Stitch of Suffering** threads a parasitic bond between ally and enemy on your very first turn, redirecting 30% of the ally's incoming damage straight into the linked foe as psychic damage. Later, Empathetic Transfer wrenches debuffs from allies onto enemies, Parasitic Link mirrors 50% of your own damage, and Empathetic Agony mirrors 100%. The 40-point blow meant for your tank does not vanish — it travels down the empathetic link and buries itself in the boss's skull. Other classes mitigate pain. You weaponize it. You are the only healer whose medicine is murder, and the prescription is filled on Turn 1.

**Strengths**:
- Unique damage/debuff transfer through Empathetic Links (no other class can do this)
- Extremely high damage potential with accumulated Madness
- Can turn enemies into weapons against their own allies
- Powerful debuff application and isolation mechanics
- Scales dramatically as combat progresses (Madness ramp)

**Weaknesses**:
- Constant risk of Insanity Convulsion at 20 Madness
- **Physically the frailest caster**—lowest base HP of any caster class. You are tissue paper wrapped around a screaming mouth
- **Radiant Vulnerability**: Takes +25% damage from all radiant sources (holy classes hard-counter the False Prophet)
- **Isolation Penalty**: Without a congregation within 30ft — no allies, no enslaved enemies — ALL spells cost +2 additional mana. Without others to feed on, you starve. The chorus of consumed minds fractures your focus without living anchors nearby
- Requires careful Madness management—reckless casting is self-destruction, and the consumed minds do not die quietly
- Less effective against mindless or undead enemies (immune to mind control)
- Self-inflicting effects from Insanity Convulsions

The False Prophet thrives when surrounded by a "congregation"—allies to siphon from, enemies to enslave. Without a flock, they are a priest with no god, a mouth with no meal, a parasite with no host. Alone, they are nothing. The isolation is not merely tactical—it is existential.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a False Prophet is about dancing on the edge of madness. Key considerations:

**Building Madness**:
- Madness-generating spells roll dice (1d4, 1d6, 1d8) to determine points gained
- Each Madness Point increases your spell damage by +1
- Randomness means you can't predict exact Madness levels
- Some spells generate more Madness but have stronger effects

**Madness Level Strategy**:
- **0-5 Points (Safe Zone)**: Low damage bonus, build freely
- **6-11 Points (Temptation Zone)**: Access to Veil of Shadows (6), Eldritch Vision (9)
- **12-19 Points (Danger Zone)**: Apocalyptic Revelation available but high risk
- **20 Points (Insanity)**: Automatic Convulsion, roll on table for chaotic effect

**Temptation Abilities**:
- **6 Madness**: Veil of Shadows (invisibility) - adds 1d4 Madness
- **9 Madness**: Eldritch Vision (see through walls) - adds 1d6 Madness
- **12 Madness**: Apocalyptic Revelation (8d6 AoE) - adds 2d6 Madness
- Using these abilities risks pushing you into Insanity Convulsion

**Spending Madness**:
- Madness-spending spells consume rolled amounts (1d4, 1d6, 1d8)
- Use spending spells to stay below 20 Madness threshold
- Strategic spending can keep you in the 12-19 "sweet spot"
- Some spending spells provide healing, buffs, or powerful attacks

**Insanity Convulsion Management**:
- At 20 Madness, roll 1d6 on Insanity Convulsion Table
- Effects range from AoE damage to stuns to random teleportation
- All effects are self-inflicting or chaotic
- May trigger Short-Term Madness (1d4 rounds of impairment)
- After Convulsion, Madness resets to 0

**Specialization Synergies**:
- **Voidcaller**: Aggressive madness generation, maximum damage output
- **Deceiver**: Mind control focus, uses madness for manipulation
- **Cultist**: Balanced corruption, sustained DoT and curse effects

**Team Dynamics**:
- Warn allies when approaching high Madness (Convulsions can hit friendlies)
- Coordinate mind control with team to maximize controlled enemy damage
- Use chaos zones strategically to control battlefield
- Synergizes with classes that can protect fragile casters`,
    },

    immersiveCombatExample: {
      title: "Combat Example: Dancing on the Edge of Madness",
      content: `**The Setup**: You're a False Prophet (Voidcaller specialization) facing a group of bandits (4 bandits + 1 bandit captain). Your party is with you, but you're the primary damage dealer. Starting Madness: 0. Starting Mana: 40/50. Your goal: Build Madness for maximum damage, use Temptation abilities strategically, and DON'T hit 20 Madness unless you're ready for chaos.

**Starting State**: Madness: 0/20 | Shadow Damage Bonus: +0 | Mana: 40/50 | HP: 60/60

**Turn 1 - Building Madness (Madness: 0 ? 5)**

*The bandits charge. You raise your hands, void energy crackling between your fingers. Time to embrace the darkness.*

**Your Action**: Cast "Void Scripture" on Bandit #1 (6 mana, generates 1d6 Madness)
**Madness Roll**: 1d6 ? [5] ? +5 Madness Points
**Madness**: 0 + 5 = **5 Madness**
**Damage Bonus**: +5 to all spell damage
**Spell Damage**: 3d6 psychic + 5 (Madness bonus) ? [4, 5, 6] + 5 = 20 damage
**Result**: Bandit #1 takes 20 damage, frightened for 2 rounds

*Dark whispers fill the bandit's mind. He screams, clutching his head. You feel the madness building�a sweet, intoxicating power.*

**Mana**: 40 - 6 = 34/50
**Current State**: Madness: 5/20 | Shadow Damage Bonus: +5

**Turn 2 - Approaching the Threshold (Madness: 5 ? 11)**

*The bandits are wary now. The captain barks orders. You smile. They have no idea what's coming.*

**Your Action**: Cast "Profane Bolt" on Bandit #2 (5 mana, generates 1d6 Madness)
**Madness Roll**: 1d6 ? [6] ? +6 Madness Points
**Madness**: 5 + 6 = **11 Madness**
**Damage Bonus**: +11 to all spell damage
**Spell Damage**: 2d8 psychic + 11 (Madness bonus) ? [7, 6] + 11 = 24 damage!
**Result**: Bandit #2 takes 24 damage, DEAD (overkill)

*The bolt of void energy obliterates the bandit. Your vision swims. The world tilts. You're at 11 Madness�past the 9 threshold. Eldritch Vision is now available.*

**Mana**: 34 - 5 = 29/50
**Temptation Unlocked**: Eldritch Vision (9+ Madness) - See through walls, detect invisible, +1d6 Madness

**Current State**: Madness: 11/20 | Shadow Damage Bonus: +11 | Eldritch Vision Available

**Turn 3 - The Temptation (Madness: 11 ? 16)**

*The bandit captain ducks behind cover. You can't see him. But you COULD see him... if you used Eldritch Vision. It would cost 1d6 Madness. You're at 11. If you roll high, you could hit 17-18. Close to the edge. But the power...*

**Your Decision**: Use Eldritch Vision (adds 1d6 Madness)
**Madness Roll**: 1d6 ? [5] ? +5 Madness Points
**Madness**: 11 + 5 = **16 Madness**
**Damage Bonus**: +16 to all spell damage

*Your eyes turn black. The walls become transparent. You see EVERYTHING. The captain hiding behind the crate. The bandit sneaking up behind your ally. The rats in the walls. The worms in the earth. TOO MUCH. But you can use this.*

**Your Action**: Cast "Shadow Bolt" at bandit captain (behind cover, but you can see him!) (5 mana, no Madness generation)
**Spell Damage**: 3d6 psychic + 16 (Madness bonus) ? [5, 6, 4] + 16 = 31 damage!
**Result**: Bandit captain takes 31 damage, severely wounded (down to 15 HP)

*The captain screams as the bolt phases through the crate and strikes him. "How did you�?!" You don't answer. You're too busy fighting the voices in your head.*

**Mana**: 29 - 5 = 24/50
**Current State**: Madness: 16/20 | Shadow Damage Bonus: +16 | **DANGER ZONE**

**Turn 4 - The Decision Point (Madness: 16 ? 19)**

*You're at 16 Madness. Four points from Insanity Convulsion. You have two choices:*
*1. Spend Madness with a spending spell to drop back to safety*
*2. Keep building for maximum damage and risk hitting 20*

*You're a Voidcaller. You chose this path. MAXIMUM DAMAGE.*

**Your Action**: Cast "Preacher's Grasp" on remaining bandits (7 mana, generates 1d4 Madness)
**Madness Roll**: 1d4 ? [3] ? +3 Madness Points
**Madness**: 16 + 3 = **19 Madness**
**Damage Bonus**: +19 to all spell damage
**Spell Damage**: 4d6 necrotic + 19 (Madness bonus) ? [6, 5, 4, 6] + 19 = 40 damage to all bandits in 20ft radius!

*Tendrils of pure void energy erupt from the ground, wrapping around the bandits. They scream as the darkness consumes them.*

**Results**:
- Bandit #3: 40 damage ? DEAD
- Bandit #4: 40 damage ? DEAD
- Bandit Captain: 15 HP - 40 damage ? DEAD (overkill)

*All enemies dead. You're at 19 Madness. ONE POINT from Insanity Convulsion. Your hands shake. The voices are SCREAMING. Reality is fracturing at the edges.*

**Mana**: 24 - 7 = 17/50
**Current State**: Madness: 19/20 | Shadow Damage Bonus: +19 | **ONE POINT FROM CONVULSION**

**Turn 5 - The Comedown (Madness: 19 ? 13)**

*Combat is over. You need to spend Madness before you lose control. You have spending spells.*

**Your Action**: Cast "Siphon Sanity" (self-heal, spends 1d6 Madness)
**Madness Spent**: 1d6 ? [6] ? -6 Madness Points
**Madness**: 19 - 6 = **13 Madness**
**Healing**: 6 � 2 = 12 HP healed (you weren't damaged, but now you're at full)

*You breathe deeply. The voices quiet. The world solidifies. You're back to 13 Madness�still high, but safe. For now.*

**Your Party's Healer**: "Are you... okay? Your eyes were completely black."
**You**: "I'm fine. Better than fine. Did you see that damage?"
**Your Party's Tank**: "We saw. We also saw you almost lose your mind."
**You**: "Almost doesn't count."

*But you know the truth. You were one bad roll away from Insanity Convulsion. One 1d4 roll of [4] instead of [3] and you would have hit 20. The table would have rolled. Maybe Shadow Burst (5d6 damage to yourself and allies). Maybe Mind Shatter (stunned for 2 rounds). Maybe worse.*

*But you didn't. You danced on the edge and came back. That's what False Prophets do.*

**The Lesson**: False Prophet gameplay is about:
1. **Madness Generation**: Random dice rolls (1d4, 1d6, 1d8) mean you can't predict exact Madness levels
2. **Damage Scaling**: At 19 Madness, +19 damage turned 21 base damage into 40 damage (90% increase!)
3. **Temptation Abilities**: Eldritch Vision cost 1d6 Madness but provided crucial tactical advantage
4. **Risk Management**: Stayed at 19 Madness (one point from Convulsion) for maximum damage
5. **Spending Strategy**: Used Siphon Sanity after combat to drop from 19 ? 13, avoiding Convulsion
6. **Randomness**: If Void Tendrils had rolled 1d4 ? [4] instead of [3], would have hit 20 and triggered Convulsion
7. **Reward**: Dealt 115 total damage in 4 turns (20 + 24 + 31 + 40) with massive Madness scaling

You're not a safe, predictable caster. You're a chaos mage who gambles with sanity for power. Every spell is a dice roll. Every turn is a risk. And when you hit 19 Madness and unleash 40 damage AoE, it's all worth it. Until it isn't.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Madness Points",
    subtitle: "A Mind Is a Terrible Thing to Waste — on Someone Else",

    description: `Madness is not a curse the False Prophet bears — it is a collection. Every stolen mind, every fractured soul, every congregation member who knelt too long and left with empty eyes — their suffering accumulates inside the Prophet like sediment in a dead river. Your **Madness** grows as you harvest the sanity of others, their broken thoughts calcifying into power that amplifies your damage beyond what any sane caster could wield. This is borrowed anguish wearing the mask of divine authority. The higher it climbs, the louder the chorus of consumed minds becomes — until at 20, their screaming drowns your own thoughts entirely, and the Convulsion is not yours but theirs, erupting through you like blood from a wound that was never yours to begin with.

---

**VISUAL DEGRADATION TRACKER — THE CORPSE-BRIDGE DIARY**

The VTT must track the Prophet's physical decay as Madness mounts. Below is the authoritative degradation map. Each threshold is irreversible — the body does not heal, only accumulates.

| Madness Threshold | Physical Manifestation | Voice Alteration | Behavioral Sign |
|---|---|---|---|
| **0–4 (The Composed Mask)** | Skin is pale but intact. Veins faintly visible beneath translucent flesh. Eyes clear, pupils normal. The Prophet appears beatific — holy, even. The mask holds. | Normal speaking voice, measured and warm. Sermons sound genuine. Congregation members feel comforted. This is the lie at its most convincing. | Composed. Deliberate gestures. Eye contact is steady and warm. The parasite has not yet eaten through the disguise. |
| **5 — THE DARKENING** | Veins along the forearms and throat darken to river-mud black, visible beneath skin that grows increasingly translucent. The Prophet's hands tremble faintly — not from fear, but from the weight of the first consumed minds pressing against the inside of the skull. | Voice acquires a faint harmonic — a second tone beneath the primary, like two people speaking in almost-unison. Listeners describe it as "singing from the throat of someone else." | Micro-expressions begin to fracture: a smile that doesn't reach the eyes, a blink that lasts a fraction too long. The mask slips at the edges. |
| **10 — THE CHORUS BREACH** | Veins now blacken across the chest and face in branching, fractal patterns — like river tributaries drawn in ink beneath glass. Pupils dilate to twice normal size, dark enough that the iris barely registers. Skin takes on a waxy, necrotic pallor. Small objects near the Prophet may vibrate or shift — the psychic pressure is becoming physical. | The harmonic fractures into distinct voices — syllables arrive in staggered layers, as if three or four throats are speaking the same words at slightly different speeds. Each sermon now carries an undertone of someone else's scream, buried beneath the scripture. The congregation hears prayers in the voices of their dead. | The Prophet occasionally responds to questions no one asked, turning to address empty space with a patient expression. They blink in patterns that correspond to no visible stimulus. They are listening to the consumed. |
| **15 — THE HOLLOW ASCENSION** | The fractal black veins now cover the entire body and begin to glow faintly with a sick violet luminescence — the stolen faith of every mind devoured, leaking through the skin. Pupils are fully dilated — no white remains, only bottomless black. The Prophet's shadow no longer matches their form; it moves independently, gesturing, preaching to shadows of its own. Blood, when drawn, is dark as pitch and smells of incense and grave soil. | The voice is no longer singular. It is a chorus — five, ten, twenty distinct voices speaking in unison, each one belonging to a consumed mind. Words are sometimes delivered in the victim's native language. The Prophet can no longer whisper; every utterance carries the weight of the congregation of the dead. Listeners who hear the voice for more than a few seconds report hearing their own name woven into the sermon. | The Prophet does not react to physical pain. Wounds close slowly, sealed by the psychic pressure of the accumulated minds. They stare through people rather than at them. When they smile, it is always someone else's smile. The body is becoming a vessel — the question is whether anything of the original Prophet remains. |
| **19 — THE VERGE** | The Prophet is a walking mass grave given terrible animation. Black veins pulse with visible light beneath skin that is now almost entirely translucent — the skeleton is visible in places, wrapped in the luminescent circulatory system of stolen faith. The eyes are voids — not dark, but empty, as if the skull behind them opens into somewhere else entirely. The air within five feet of the Prophet warps: sounds distort, light bends, small objects drift. The congregation of the dead is so dense it has begun to manifest physically. | The voice is a catastrophe. Dozens of voices layer over each other in a rolling, discordant hymn — men, women, children, all speaking scripture in languages that may not exist. The Prophet's own voice is buried somewhere in the chorus, indistinguishable from the consumed. Speaking is no longer communication — it is exorcism. The walls bleed. The candles extinguish. The congregation kneels, and they do not know why. | The Prophet exists in two states simultaneously — their body moves with calm, deliberate purpose, while their shadow writhes and screams silently. They answer questions before they are asked. They weep black tears from eyes that no longer see the material world. One more mind, one more stolen point of Madness, and the dam breaks. The Convulsion is not a possibility at 19 — it is an inevitability delayed by seconds. |

The degradation is cumulative. A Prophet at Madness 15 still carries the darkened veins from Threshold 5, the fractured voice from Threshold 10, and the pupil dilation from both. The body does not heal between thresholds — it only accumulates. This is the cost of being a mass grave that learned to speak.`,

    cards: [
      {
        title: "Madness (0-20)",
        stats: "Escalating Damage",
        details:
          "Each point adds +1 to ALL psychic, void, and necrotic damage. At 19 Madness, you deal +19 damage per spell.",
      },
      {
        title: "Thresholds",
        stats: "6, 9, 12 Madness",
        details:
          'Higher madness levels unlock forbidden abilities like "Veil of Shadows" or "Apocalyptic Revelation."',
      },
      {
        title: "Insanity Convulsion",
        stats: "Triggered at 20",
        details:
          "Hitting 20 Madness triggers a chaotic explosion. You lose all Madness but suffer a random, often catastrophic, effect.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Madness Change", "Notes"],
      rows: [
        ["Stitch of Suffering", "+1 Madness", "Level 1 empathetic link (ally→enemy damage redirect)"],
        ["Blood Sermon", "+1d4 Madness", "Basic psychic strike"],
        ["Profane Bolt", "+1d6 Madness", "Higher power, higher risk"],
        ["Preacher's Grasp", "+1d8 Madness", "Maximum generation"],
        ["Veil of Shadows", "+1d4 Madness", "Temptation: Invisibility (Req 6)"],
        ["Eldritch Vision", "+1d6 Madness", "Temptation: True Sight (Req 9)"],
        ["Siphon Sanity", "-1d6 Madness", "Release the pressure (Spending)"],
        [
          "Dark Meditation",
          "-2d6 Madness",
          "Full reset of the mind (Spending)",
        ],
      ],
    },

    usage: {
      momentum:
        'Build Madness early to "ramp" your damage. The False Prophet is weakest at the start of a fight and becomes a god at the end.',
      flourish:
        "?? Madness Surfing: Try to hover between 15-19 Madness to keep your massive damage bonus active. Only trigger a Convulsion if the battlefield is so chaotic that a random explosion might actually help.",
    },

    overheatRules: {
      title: "Insanity Convulsion (20)",
      content: `At 20 Madness, your mind shatters. Roll 1d6 on the Convulsion Table:

1. **Shadow Burst**: 5d6 necrotic damage to yourself and everyone within 20ft.
2. **Mind Shatter**: You are Stunned for 2 rounds.
3. **Dark Whispers**: Disadvantage on all rolls for 3 rounds.
4. **Chaotic Pulse**: Teleport randomly (60ft), take 4d6 psychic damage.
5. **Psychic Scream**: Everyone in 30ft makes a Save or is Frightened.
6. **Nightmare Echoes**: Take 6d6 psychic damage + gain Long-Term Madness.

**APOCALYPTIC CONVULSION (Triggered by Apocalyptic Revelation)**: If the Convulsion is triggered specifically by casting Apocalyptic Revelation, the standard table is overridden. Instead:
- **Structural Spirit Drain**: -2 Spirit until long rest. The consumed minds have carved permanent channels through your psyche.
- **Psychic Shockwave**: All allies within 30ft take 4d6 psychic damage. The congregation of the dead detonates outward.
- **Extended Confusion**: You are Confused for 3 rounds. The chorus does not quiet — it riots.
This is the catastrophic endpoint of recursive temptation. The Prophet who reaches for godhood via Apocalyptic Revelation and seizes too much does not simply break — they shatter everyone around them.`,
    },

    strategicConsiderations: {
      title: "The Preacher's Path",
      content: `**Voidcaller Spec**: You generate Madness faster (+1 to all rolls). You reach the "Danger Zone" twice as fast as others, but your damage scaling is unrivaled.

**The Threshold Trap**: Using your most powerful abilities (like Apocalyptic Revelation) often *generates* the most Madness. If you cast your ultimate while at 15 Madness, you are almost guaranteed to Convulse immediately after.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Madness Gauge",
      content: `Tracking random increments of 1-8 points is hard to do with mental math. Use these physical hacks:

**Required Materials**:
- **20 Purple/Black Tokens**: (Glass beads or coins).
- **A Slider or Track**: (Numbered 0-20).
- **The "Convulsion" Die**: A distinct d6.

**The Physical Hack (Friction Points)**:
- **The Madness Pile**: Place 20 tokens in a bowl. When you gain Madness, move them to your character sheet. This creates a "rising pile" of darkness that everyone can see.
- **Threshold Markers**: Place small red flags on your track at numbers 6, 9, and 12. As your token passes them, flip your ability cards to the "Active" side.
- **The Spend Roll**: When spending Madness, roll your d6 and physically put that many tokens back in the bowl. The sound of tokens hitting the bowl is your "relief."

**Pro Tip**: When you hit 19 Madness, place your hand over the bowl of tokens. It signals to the DM and other players that the next roll could break reality.`,
    },
  },

  // Specializations
  specializations: {
    title: "False Prophet Specializations",
    subtitle: "Three Sermons of the Void",

    description: `Every False Prophet preaches the void as divine truth—but the style of their sermon defines the shape of the wound. Some thunder hellfire from makeshift pulpits until the congregation's ears bleed. Others whisper poison into willing ears and call it scripture. And some simply perform the old rites, patient and inevitable, burying the knife so slowly that the victim thanks them for it. Choose your sermon. Choose your sin.`,

    specs: [
      {
        id: "voidcaller",
        name: "Voidcaller",
        icon: "Void/Consumed by Void",
        color: "#9400D3",
        theme: "Fire-and-Brimstone Preaching",

        description: `Voidcallers are the loudest voice in the room—not because they have something to say, but because the silence is full of mouths that used to belong to other people. They channel stolen vitality through fiery, destructive sermons that crack the air like bone. Their preaching generates Madness faster than any other specialization, pushing them toward godlike power and catastrophic Convulsion in equal measure. They are the most aggressive False Prophets—they use empathetic links offensively, mirroring their own self-inflicted wounds onto enemies with devastating efficiency. When a Voidcaller bleeds, someone else's veins open. It is never their pain. It was never their pain.`,

        playstyle:
          "High-risk aggression, maximum damage output, rapid Madness generation through destructive sermons",

        strengths: [
          "Highest damage potential of all specs",
          "Generates Madness faster for quicker power scaling",
          "Bonus damage when at high Madness levels",
          "Powerful burst damage through sermon AoE",
        ],

        weaknesses: [
          "Most likely to trigger Insanity Convulsions",
          "Aggressive playstyle increases risk every turn",
          "Less control over Madness accumulation",
          "Vulnerable during Convulsion recovery",
        ],

        passiveAbilities: [
          {
            name: "Eldritch Empowerment",
            tier: "Path Passive",
            description:
              "When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.",
            sharedBy: "All False Prophets",
          },
          {
            name: "Void Surge",
            tier: "Specialization Passive",
            description:
              "Whenever you generate Madness Points, add +1 to the rolled amount. When you have 15 or more Madness Points, your spells deal an additional 1d8 damage.",
            uniqueTo: "Voidcaller",
          },
        ],

        recommendedFor:
          "Players who enjoy high-risk/high-reward gameplay, maximum damage output, and aggressive spellcasting",
      },

      {
        id: "deceiver",
        name: "Deceiver",
        icon: "Psychic/Mind Control",
        color: "#8B008B",
        theme: "Whispered Corruption",

        description: `Deceivers don't preach to crowds—they lean in close and whisper. They specialize in corrupting the faithful, planting doubt in devoted minds, and turning allies against each other with lies dressed in sacred cloth. Their empathetic links are surgical—they transfer specific debuffs and curses onto enemies with the precision of a finger pressing into a bruise. Their Madness fuels manipulation rather than destruction, bending wills and fracturing loyalties until the enemy butchers its own and calls it divine justice. They do not need to kill you. They need you to kill each other.`,

        playstyle:
          "Control-focused, mind manipulation, strategic Madness spending to corrupt and convert",

        strengths: [
          "Powerful mind control and charm effects",
          "Can turn enemies into temporary allies",
          "Extended duration on confusion and fear effects",
          "Excellent crowd control through corrupted faith",
        ],

        weaknesses: [
          "Lower direct damage than Voidcaller",
          "Less effective against mindless enemies",
          "Requires strategic target selection",
          "Control effects can be resisted",
        ],

        passiveAbilities: [
          {
            name: "Eldritch Empowerment",
            tier: "Path Passive",
            description:
              "When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.",
            sharedBy: "All False Prophets",
          },
          {
            name: "Master Manipulator",
            tier: "Specialization Passive",
            description:
              "Your mind control and charm spells have their duration increased by 50%. When you successfully control an enemy, you gain 1d4 Madness Points. Enemies have disadvantage on saves against your confusion effects.",
            uniqueTo: "Deceiver",
          },
        ],

        recommendedFor:
          "Players who enjoy control gameplay, manipulating enemies, and strategic battlefield control",
      },

      {
        id: "cultist",
        name: "Cultist",
        icon: "Necrotic/Death Mark",
        color: "#4B0082",
        theme: "Dark Ritual & Ceremony",

        description: `Cultists are the patient shepherds of a flock that does not know it is being led to slaughter. They perform methodical dark rituals—curses, sacrifices, ceremonies—that spread corruption the way rot spreads through a living tree: slowly, inevitably, until the trunk crumbles and the whole thing comes down. Their Madness is channeled into sustained destruction rather than burst, and their rites can empower allies through blood-siphoning as easily as they wither enemies into ash. Cultists are the masters of Empathetic Transfer—they move debuffs from allies to enemies with the calm precision of an undertaker arranging the dead, ensuring their congregation fights clean while the enemy rots from the inside. A Cultist's sermon is not loud. It is patient. And it always finishes. And when it does, the congregation applauds, because they do not yet understand that they are the sacrifice.`,

        playstyle:
          "Sustained damage through curses and DoT, balanced Madness management, ritual empowerment",

        strengths: [
          "Excellent sustained damage with DoT effects",
          "Better Madness management than other specs",
          "Can empower allies with dark rituals",
          "Strong in prolonged encounters",
        ],

        weaknesses: [
          "Lower burst damage than Voidcaller",
          "DoT effects take time to ramp up",
          "Less impactful in short fights",
          "Requires setup time for rituals",
        ],

        passiveAbilities: [
          {
            name: "Eldritch Empowerment",
            tier: "Path Passive",
            description:
              "When you reach 10 or more Madness Points, your next damage spell deals an additional 2d6 damage.",
            sharedBy: "All False Prophets",
          },
          {
            name: "Corrupting Presence",
            tier: "Specialization Passive",
            description:
              "Your damage-over-time effects last 2 additional rounds. When you spend Madness Points, heal yourself for 2 HP per point spent plus your proficiency bonus. Enemies affected by your curses take an additional 1d4 necrotic damage per round.",
            uniqueTo: "Cultist",
          },
        ],

        recommendedFor:
          "Players who enjoy DoT gameplay, sustained damage, and balanced resource management",
      },
    ],
  },

  exampleSpells: [
    {
      id: "fp_blood_sermon",
      name: "Blood Sermon",
      description:
        "Preach a sermon that rends the mind with stolen vitality. Deals 1d8 psychic damage and feeds on your own blood — sacrifice 3 HP to fuel the sermon. Generates 1d4 Madness Points as the congregation's anguish echoes in your skull.",
      level: 1,
      spellType: "ACTION",
      icon: "Arcane/Orb Manipulation",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Arcane/Orb Manipulation",
        tags: ["damage", "psychic", "madness", "self-harm", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 5 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      damageConfig: {
        formula: "1d8 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
      },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
        selfHarm: {
          enabled: true,
          damage: 3,
          description: "Sacrifice 3 HP to fuel the sermon. The blood cost is non-negotiable.",
        },
      },

      tags: ["damage", "psychic", "madness", "self-harm", "voidcaller"],
    },
    {
      id: "fp_hollow_blessing",
      name: "Hollow Blessing",
      description:
        "Extend a hand wreathed in false golden light. The target feels warmth — but it is the warmth of something feeding on them from within. Deals 1d4 psychic damage immediately and 1d4 psychic damage per turn for 3 turns. Generates 1d4 Madness Points.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Healing/Golden Heart",
        tags: ["damage", "psychic", "dot", "deception", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "1d4 + intelligence/2",
        damageTypes: ["psychic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageTypes: ["psychic"],
          tickFrequency: "turn",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "dot", "deception", "madness"],
    },
    {
      id: "fp_whispered_doubt",
      name: "Whispered Doubt",
      description:
        "Lean close and whisper a single, perfect lie into the target's ear — a doubt that unravels their conviction. Reduces Spirit by 2 for 3 rounds. DC 12 Spirit save negates. Generates 1 Madness Point as their faith crumbles.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["debuff"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["debuff", "spirit reduction", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "doubt_whispered",
            name: "Doubt Whispered",
            description:
              "Spirit reduced by 2 from whispered lies for 3 rounds. DC 12 Spirit save negates.",
            mechanicsText: "",
            statPenalty: {
              stat: "spirit",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 12,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates 1 Madness Point when cast",
        },
      },

      tags: ["debuff", "spirit reduction", "madness", "deceiver"],
    },
    {
      id: "fp_siphon_devotion",
      name: "Siphon Devotion",
      description:
        "Reach across the void and hook your fingers into a target's life force. Drain 1d6 necrotic damage from them, healing yourself for the same amount. The stolen vitality tastes like copper and regret. Generates 1 Madness Point.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["damage", "healing"],
      resolution: "DICE",

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["damage", "healing", "necrotic", "vampiric", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 35,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "1d6 + intelligence/2",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },

      healingConfig: {
        formula: "damage_dealt",
        healingType: "vampiric",
        resolution: "AUTOMATIC",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 6 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates 1 Madness Point when cast",
        },
        vampiricHealing: {
          enabled: true,
          description: "Heals caster for damage dealt by this spell",
        },
      },

      tags: ["damage", "healing", "necrotic", "vampiric", "madness"],
    },
    {
      id: "fp_zealots_mark",
      name: "Zealot's Mark",
      description:
        "Brand a target with a parasitic sigil that makes them vulnerable to your congregation's fervor. The next ally attack against the marked target deals +1d6 psychic damage. The mark burns like a confession they never made. Generates 1 Madness Point.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",
      effectTypes: ["debuff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Strike",
        tags: ["debuff", "mark", "vulnerability", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "zealot_mark",
            name: "Zealot's Mark",
            description:
              "Marked for the congregation. Next ally attack against this target deals +1d6 psychic damage. Mark is consumed on hit.",
            mechanicsText: "",
            statusEffects: [
              {
                id: "vulnerable",
                name: "Vulnerable to Congregation",
                option: "vulnerability",
                vulnerabilityType: "psychic",
                vulnerabilityPercent: 0,
                bonusDamage: "1d6",
                triggersOn: "ally_attack",
                consumed: true,
              },
            ],
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates 1 Madness Point when cast",
        },
      },

      tags: ["debuff", "mark", "vulnerability", "madness"],
    },
    {
      id: "fp_stitch_of_suffering",
      name: "Stitch of Suffering",
      description:
        "Thread a parasitic filament of stolen faith between an ally and an enemy — a suture made of screaming. For 3 rounds, 30% of all damage the linked ally receives is redirected to the bonded enemy as psychic damage. The enemy's veins bulge with anguish that was never theirs. The link feeds on proximity and misery. Generates exactly 1 Madness Point. This is why your congregation tolerates you: because you make their suffering someone else's problem.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Reaching Hand",
      effectTypes: ["buff", "debuff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Healing/Reaching Hand",
        tags: ["buff", "debuff", "empathetic link", "damage redirect", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          {
            id: "stitch_link_source",
            name: "Stitch of Suffering (Ally)",
            description:
              "Linked ally redirects 30% of incoming damage to the bonded enemy as psychic damage for 3 rounds.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
        stackingRule: "replace",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "stitch_link_target",
            name: "Stitch of Suffering (Enemy)",
            description:
              "Parasitically bonded. Receives 30% of all damage dealt to the linked ally as psychic damage for 3 rounds.",
            mechanicsText: "",
            statusEffects: [
              {
                id: "empathetic_redirection",
                name: "Suffering Redirect",
                option: "vulnerability",
                vulnerabilityType: "empathetic_link",
                vulnerabilityPercent: 30,
                redirectDamageType: "psychic",
                redirectPercent: 30,
                triggersOn: "ally_damage_taken",
                consumed: false,
              },
            ],
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1",
            description: "Generate exactly 1 Madness Point",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1",
          description: "Generates exactly 1 Madness Point when cast",
        },
        empatheticLink: {
          enabled: true,
          linkType: "damage_redirect",
          redirectPercent: 30,
          redirectDamageType: "psychic",
          requiresAllyProximity: true,
          proximityRange: 40,
          description:
            "30% of damage to linked ally is redirected to enemy as psychic. The suture holds for 3 rounds.",
        },
      },

      tags: ["buff", "debuff", "empathetic link", "damage redirect", "madness"],
    },
    {
      id: "fp_false_miracle",
      name: "False Miracle",
      description:
        "Perform a false miracle — the target sees golden light and feels warmth. But beneath the veneer, your blood-magic hooks into their flesh. Deals 1d4 psychic damage immediately and 1d4 psychic damage per turn for 3 turns. The miracle is a lie; the suffering is real. Generates 1d4 Madness Points.",
      level: 2,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Healing/Golden Heart",
        tags: ["damage", "psychic", "dot", "deception", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      damageConfig: {
        formula: "1d4 + intelligence/2",
        damageTypes: ["psychic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageTypes: ["psychic"],
          tickFrequency: "turn",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "dot", "deception", "madness"],
    },
    {
      id: "fp_parasitic_link",
      name: "Parasitic Link",
      description:
        "Thread an invisible blood-vessel between yourself and an enemy. For 2 rounds, 50% of all damage you receive is mirrored to the linked target as psychic damage. Their veins bulge with stolen anguish. Generates 1d4 Madness Points. The link feeds on suffering â€” yours and theirs.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Psionic Strike",
      effectTypes: ["buff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Psionic Strike",
        tags: ["buff", "empathetic link", "damage mirror", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          {
            id: "parasitic_link",
            name: "Parasitic Link",
            description:
              "50% of damage taken by caster is mirrored to linked enemy as psychic damage for 2 rounds.",
            mechanicsText: "",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
        stackingRule: "replace",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 10 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
        empatheticLink: {
          enabled: true,
          mirrorPercent: 50,
          mirrorDamageType: "psychic",
          description: "50% of caster damage taken mirrored to linked enemy as psychic",
        },
      },

      tags: ["buff", "empathetic link", "damage mirror", "madness"],
    },
    {
      id: "fp_blood_tithe",
      name: "Blood Tithe",
      description:
        "Demand a blood tithe from your congregation. All allies within 15 feet sacrifice 1d4 HP, gaining +2 to attack rolls for 2 rounds as stolen vigor courses through their veins. You also pay the tithe â€” sacrifice 1d4 HP yourself. The blood feeds your power. Generates 1d4 Madness Points.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Decay 1",
      effectTypes: ["buff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["buff", "sacrifice", "aoe", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["ally"],
      },

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "blood_tithe",
            name: "Blood Tithe",
            description:
              "+2 to attack rolls for 2 rounds. Cost: 1d4 HP sacrificed.",
            mechanicsText: "",
            statModifier: {
              stat: "attack",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
        stackingRule: "replace",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
        selfHarm: {
          enabled: true,
          damage: "1d4",
          description: "Caster also sacrifices 1d4 HP. All affected allies sacrifice 1d4 HP.",
        },
      },

      tags: ["buff", "sacrifice", "aoe", "madness", "cultist"],
    },
    {
      id: "fp_dark_benediction",
      name: "Dark Benediction",
      description:
        "Bestow a benediction drawn from the blood-pool of your own Madness. Spend 1d6 Madness Points to gain +2 to attack and damage rolls per Madness Point spent for 1d4 rounds. The benediction is a gilded cage â€” the more you spend, the stronger you become, and the closer to Convulsion when the spending stops.",
      level: 3,
      spellType: "ACTION",
      icon: "General/Increase Strength",
      effectTypes: ["buff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "General/Increase Strength",
        tags: ["buff", "madness", "self", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id: "dark_benediction",
            name: "Dark Benediction",
            description:
              "+2 to attack and damage rolls per Madness Point spent for 1d4 rounds",
            mechanicsText: "",
            statModifier: {
              stat: "attack_and_damage",
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
        stackingRule: "replace",
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
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description:
            "Spends 1d6 Madness Points when cast. Effect scales with amount spent.",
        },
      },

      tags: ["buff", "madness", "self", "voidcaller"],
    },
    {
      id: "fp_befoul",
      name: "Befoul",
      description:
        "Vomit a tide of corrupted blood that befouls a 20-foot area for 4 rounds. The ground becomes difficult terrain and creatures starting their turn there take 1d6 necrotic damage as the soil itself turns hostile. The land remembers what you did to it. Generates 1d4 Madness Points.",
      level: 3,
      spellType: "ACTION",
      icon: "Poison/Poison Plague",
      effectTypes: ["damage", "control"],
      resolution: "DICE",

      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        tags: ["damage", "necrotic", "zone", "terrain", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "1d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d6",
          damageTypes: ["necrotic"],
          tickFrequency: "round",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
      },

      controlConfig: {
        controlType: "zone",
        duration: 4,
        durationUnit: "rounds",
        effects: [
          {
            id: "difficult_terrain",
            name: "Befouled Ground",
            description: "Area becomes difficult terrain, movement halved",
            config: {
              zoneType: "difficult_terrain",
              duration: 4,
              durationUnit: "rounds",
            },
          },
        ],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "necrotic", "zone", "terrain", "madness", "cultist"],
    },
    {
      id: "fp_sever_connections",
      name: "Sever Connections",
      description:
        "Cut the invisible threads that bind a target to their allies â€” their healer's touch slides off, their comrade's shield covers nothing. The target cannot receive healing or beneficial effects from allies for 1d4 rounds. They are alone, as you once were. DC 14 Spirit save. Spends 1d4 Madness Points.",
      level: 3,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",
      effectTypes: ["debuff"],
      resolution: "SAVE",

      typeConfig: {
        school: "necrotic",
        icon: "Radiant/Radiant Divinity",
        tags: ["debuff", "isolation", "curse", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      debuffConfig: {
        debuffType: "curse",
        effects: [
          {
            id: "isolation",
            name: "Isolated",
            description:
              "Cannot receive healing or beneficial effects from allies for 1d4 rounds. DC 14 Spirit save.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
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
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d4",
          description: "Spends 1d4 Madness Points when cast",
        },
      },

      tags: ["debuff", "isolation", "curse", "madness", "deceiver"],
    },
    {
      id: "fp_empathetic_transfer",
      name: "Empathetic Transfer",
      description:
        "Reach across the battlefield and wrench every curse, poison, and debuff from an ally's flesh, then hurl them into an enemy's body. The ally is cleansed; the enemy inherits their suffering. DC 14 Spirit save per debuff transferred. Spends 1d6 Madness Points. This is why your congregation tolerates you.",
      level: 3,
      spellType: "ACTION",
      icon: "Healing/Reaching Hand",
      effectTypes: ["utility"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Healing/Reaching Hand",
        tags: ["utility", "empathetic link", "debuff transfer", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          {
            id: "debuff_transfer",
            name: "Debuff Transfer",
            description: "Transfer all debuffs from one ally to this enemy target",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description: "Spends 1d6 Madness Points when cast",
        },
        empatheticLink: {
          enabled: true,
          linkType: "debuff_transfer",
          description: "Transfer all debuffs from one ally to the target enemy.",
        },
      },

      tags: ["utility", "empathetic link", "debuff transfer", "madness"],
    },
    {
      id: "fp_shattered_faith",
      name: "Shattered Faith",
      description:
        "Condemn a target's deepest belief with a single, devastating revelation â€” spoken in a voice that is not your own. The target is confused for 3 rounds as everything they held true dissolves. DC 14 Spirit save. At 10+ Madness, confusion lasts 4 rounds. Generates 1d4 Madness Points.",
      level: 4,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["control", "confusion", "psychic", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "confused",
            name: "Confused",
            description:
              "Cannot distinguish friend from foe, acts erratically for 3 rounds. DC 14 Spirit save.",
            config: {
              confusionType: "complete",
              saveType: "spirit",
              saveDC: 14,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus: "Duration increases to 4 rounds",
              default: "3 rounds confusion",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["control", "confusion", "psychic", "madness"],
    },
    {
      id: "fp_visions_of_heresy",
      name: "Visions of Heresy",
      description:
        "Condemn a target to witness their own heresy â€” memories of every betrayal, broken oath, and lie they ever told. Deals 2d6 psychic damage and 2d6 psychic per turn for 4 turns as guilt eats them from within. At 10+ Madness, DoT increases to 3d6 per turn. Generates 1d4 Madness Points.",
      level: 4,
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Strike",
        tags: ["damage", "psychic", "dot", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "2d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6",
          damageTypes: ["psychic"],
          tickFrequency: "turn",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus:
                "2d6 + intelligence psychic, 3d6 psychic per turn",
              default: "2d6 + intelligence psychic, 2d6 psychic per turn",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description: "Generates 1d4 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "dot", "madness"],
    },
    {
      id: "fp_maddening_sermon",
      name: "Maddening Sermon",
      description:
        "Deliver a sermon carved directly into the minds of all enemies within 20 feet. Words that should not exist tear through their sanity. Confuses enemies for 2 rounds. DC 14 Spirit save. Generates 1d6 Madness Points.",
      level: 4,
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "General/Fiery Rage",
        tags: ["control", "confusion", "aoe", "psychic", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "confused",
            name: "Confused",
            description:
              "Confused by maddening sermon â€” acts erratically for 2 rounds. DC 14 Spirit save.",
            config: {
              confusionType: "complete",
              saveType: "spirit",
              saveDC: 14,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["control", "confusion", "aoe", "psychic", "madness"],
    },
    {
      id: "fp_communion_of_blood",
      name: "Communion of Blood",
      description:
        "Partake in communion with the congregation's life force. Spend 1d6 Madness â€” gain temporary HP equal to 2 x Madness spent for 3 rounds. At 15+ Madness, the blood turns on you: take 1d4 psychic damage per Madness spent instead. The blood is not your friend.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["buff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["temp_hp", "self", "madness", "voidcaller", "dangerous"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      healingConfig: {
        formula: "2 * madness_spent",
        healingType: "temporary_hp",
        resolution: "AUTOMATIC",
        duration: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description:
            "Spends Madness Points for temporary HP. At 15+ Madness, backfires.",
        },
        backfire: {
          enabled: true,
          threshold: 15,
          effect: "At 15+ Madness, take 1d4 psychic damage per Madness spent instead of temp HP",
        },
      },

      tags: ["temp_hp", "self", "madness", "voidcaller", "dangerous"],
    },
    {
      id: "fp_corrupt_the_faithful",
      name: "Corrupt the Faithful",
      description:
        "Preach corruption into a target's soul, turning their devotion against their allies for 1d4 rounds. DC 15 Spirit save. At 10+ Madness, target also deals 1d6 psychic to allies it attacks. Generates 1d8 Madness Points.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["control", "corruption", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "corrupted",
            name: "Corrupted",
            description:
              "Target attacks its allies for the duration. DC 15 Spirit save.",
            config: {
              controlType: "hostile_to_allies",
              saveType: "spirit",
              saveDC: 15,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d8",
            description: "Generate 1d8 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus:
                "Target also deals 1d6 psychic damage to allies it attacks",
              default: "Target attacks allies",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d8",
          description: "Generates 1d8 Madness Points when cast",
        },
      },

      tags: ["control", "corruption", "madness", "deceiver"],
    },
    {
      id: "fp_twisted_sermon",
      name: "Twisted Sermon",
      description:
        "Deliver a dark sermon in a 30-foot cone â€” words that peel back the skin of sanity. Deals 4d6 + Intelligence psychic damage and causes paranoia for 2 rounds. DC 15 Spirit save for half damage. Generates 1d6 Madness Points.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      effectTypes: ["damage", "control"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["damage", "psychic", "control", "paranoia", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "cone",
        rangeType: "self",
        aoeShape: "cone",
        aoeParameters: { length: 30 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "4d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "paranoid",
            name: "Paranoid",
            description: "Sees allies as enemies for 2 rounds on failed save.",
            config: {
              confusionType: "paranoia",
              saveType: "spirit",
              saveDC: 15,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "control", "paranoia", "madness", "deceiver"],
    },
    {
      id: "fp_wrath_of_void_god",
      name: "Wrath of the Void God",
      description:
        "Channel the wrath of something that should not be named, dealing 4d8 + Intelligence necrotic damage plus 2 damage per Madness Point spent. Spends 1d6 Madness Points.",
      level: 5,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["damage", "necrotic", "madness", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "4d8 + intelligence + (2 * madness_spent)",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 20 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d6",
          description:
            "Spends accumulated Madness Points. Each point adds +2 damage.",
        },
      },

      tags: ["damage", "necrotic", "madness", "voidcaller"],
    },
    {
      id: "fp_empathetic_agony",
      name: "Empathetic Agony",
      description:
        "Fuse your nervous system with an enemy's through a bridge of blood and screaming. For 2 rounds, 100% of ALL damage you take is mirrored to this enemy as psychic damage. Generates 1d6 Madness Points. COST: Sacrifice 2d6 HP to forge the link.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Psionic Strike",
      effectTypes: ["buff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Psionic Strike",
        tags: ["buff", "empathetic link", "damage mirror", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },

      buffConfig: {
        buffType: "triggeredEffect",
        effects: [
          {
            id: "agony_link",
            name: "Empathetic Agony",
            description:
              "100% of damage taken by caster is mirrored to linked enemy as psychic damage for 2 rounds.",
            mechanicsText: "",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
        stackingRule: "replace",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
        selfHarm: {
          enabled: true,
          damage: "2d6",
          description: "Sacrifice 2d6 HP to forge the empathetic link",
        },
        empatheticLink: {
          enabled: true,
          mirrorPercent: 100,
          mirrorDamageType: "psychic",
          description: "100% of caster damage mirrored to enemy as psychic",
        },
      },

      tags: ["buff", "empathetic link", "damage mirror", "madness"],
    },
    {
      id: "fp_veil_of_shadows",
      name: "Veil of Shadows",
      description:
        "Wrap yourself in a cloak of stolen shadows, becoming invisible for 1d4 rounds. Requires 6 Madness Points. Adds 1d4 Madness. Temptation ability.",
      level: 5,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["buff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Mind Control",
        tags: ["buff", "invisibility", "temptation", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id: "invisible",
            name: "Invisible",
            description:
              "Invisible for 1d4 rounds. Attacks break invisibility.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d4",
            description: "Generate 1d4 Madness Points (risk of Convulsion)",
          },
        ],
      },

      triggerConfig: {
        requiredConditions: {
          enabled: true,
          logicType: "AND",
          conditions: [
            {
              id: "resource_threshold",
              category: "health",
              name: "Madness Threshold",
              parameters: {
                resource_type: "madness",
                threshold_value: 6,
                threshold_type: "above",
                comparison: "greater_than",
              },
            },
          ],
        },
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 6,
          description: "Requires at least 6 Madness Points to cast",
        },
        madnessGeneration: {
          enabled: true,
          formula: "1d4",
          description:
            "Adds 1d4 Madness Points after casting (risk of Convulsion)",
        },
        temptationAbility: true,
      },

      tags: ["buff", "invisibility", "temptation", "madness"],
    },
    {
      id: "fp_heresy_of_flesh",
      name: "Heresy of the Flesh",
      description:
        "Condemn a target's flesh as heretical â€” their own body becomes an enemy. Deals 2d6 necrotic damage per round for 1d4 rounds. DC 14 Constitution save for half duration. Generates 1d6 Madness Points.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "necrotic", "dot", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "2d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "2d6",
          damageTypes: ["necrotic"],
          tickFrequency: "round",
          duration: 4,
          canStack: false,
          maxStacks: 1,
        },
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "reduced_duration",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 16 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["damage", "necrotic", "dot", "madness", "cultist"],
    },
    {
      id: "fp_black_oath",
      name: "Black Oath",
      description:
        "Swear a black oath that curses an enemy for 1d4 rounds, inflicting disadvantage on all attack rolls and saving throws. DC 14 Charisma save. Spends 1d4 Madness Points.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Decay 1",
      effectTypes: ["debuff"],
      resolution: "SAVE",

      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        tags: ["debuff", "curse", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      debuffConfig: {
        debuffType: "curse",
        effects: [
          {
            id: "black_oath",
            name: "Black Oath",
            description:
              "Disadvantage on all attack rolls and saving throws for 1d4 rounds. DC 14 Charisma save.",
            mechanicsText: "",
            statPenalty: {
              stat: "all_attacks_and_saves",
              magnitude: -1,
              magnitudeType: "disadvantage",
            },
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "charisma",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 14 },
        actionPoints: 1,
        components: ["verbal"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d4",
          description: "Spends 1d4 Madness Points when cast",
        },
      },

      tags: ["debuff", "curse", "madness", "cultist"],
    },
    {
      id: "fp_enslave",
      name: "Enslave",
      description:
        "Drive hooks of pure will into a target's mind. The target becomes your thrall for 1d4 rounds. DC 16 Spirit save negates. DC increases by +1 per Madness Point spent. Spends 1d8 Madness Points.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Psionic Strike",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Psionic Strike",
        tags: ["control", "domination", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "dominated",
            name: "Enslaved",
            description:
              "Target becomes your thrall for 1d4 rounds. DC 16 Spirit save.",
            config: {
              controlType: "full_control",
              saveType: "spirit",
              saveDC: 16,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description:
            "Spends 1d8 Madness Points. DC increases by +1 per point spent.",
        },
      },

      tags: ["control", "domination", "madness", "deceiver"],
    },
    {
      id: "fp_devouring_omen",
      name: "Devouring Omen",
      description:
        "Summon a terrifying apparition. All enemies within 15 feet are stricken with supernatural terror. Frightens enemies for 3 rounds. DC 15 Spirit save negates. Generates 1d8 Madness Points.",
      level: 6,
      spellType: "ACTION",
      icon: "Void/Consumed by Void",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "void",
        icon: "Void/Consumed by Void",
        tags: ["control", "fear", "void", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "fear",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "frightened",
            name: "Frightened",
            description:
              "Frightened â€” disadvantage on all rolls, must move away for 3 rounds. DC 15 Spirit save.",
            config: {
              fearType: "supernatural",
              saveType: "spirit",
              saveDC: 15,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 24 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d8",
            description: "Generate 1d8 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d8",
          description: "Generates 1d8 Madness Points when cast",
        },
      },

      tags: ["control", "fear", "void", "madness"],
    },
    {
      id: "fp_summon_congregation",
      name: "Summon the Congregation",
      description:
        "Call forth 1d4 abyssal servants â€” fragments of your stolen congregation given hideous form. They fight for you for 1d4 rounds. Generates 1d8 Madness Points.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Demonic Empowerment",
      effectTypes: ["summoning"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "void",
        icon: "Necrotic/Demonic Empowerment",
        tags: ["summoning", "void", "madness", "cultist"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["any"],
      },

      summoningConfig: {
        creatures: [
          {
            quantity: 1,
            duration: 4,
            durationUnit: "rounds",
            hasDuration: true,
            concentration: false,
            controlType: "verbal",
            controlRange: 30,
            attachedEffects: {},
          },
        ],
        duration: 4,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        quantity: 1,
        maxQuantity: 4,
        controlRange: 30,
        controlType: "verbal",
        difficultyLevel: "moderate",
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d8",
            description: "Generate 1d8 Madness Points",
          },
        ],
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d8",
          description: "Generates 1d8 Madness Points when cast",
        },
      },

      tags: ["summoning", "void", "madness", "cultist"],
    },
    {
      id: "fp_grand_deception",
      name: "Grand Deception",
      description:
        "Create a grand deception that confuses all enemies within 30 feet for 3 rounds. DC 16 Intelligence save. At 10+ Madness, confused enemies also attack allies. Generates 1d6 Madness Points.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["control", "confusion", "aoe", "deception", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          {
            id: "grand_confusion",
            name: "Grand Confusion",
            description:
              "All enemies confused for 3 rounds. DC 16 Intelligence save.",
            config: {
              confusionType: "complete",
              saveType: "intelligence",
              saveDC: 16,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "intelligence",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 26 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "1d6",
            description: "Generate 1d6 Madness Points",
          },
        ],
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_10_plus: "Confused enemies also attack allies each round",
              default: "Confused enemies act erratically",
            },
          },
        },
      },

      specialMechanics: {
        madnessGeneration: {
          enabled: true,
          formula: "1d6",
          description: "Generates 1d6 Madness Points when cast",
        },
      },

      tags: ["control", "confusion", "aoe", "deception", "madness", "deceiver"],
    },
    {
      id: "fp_reality_distortion",
      name: "Reality Distortion",
      description:
        "Twist reality in a 25-foot radius. Deals 8d8 + Intelligence psychic damage and disorients enemies for 2 rounds. DC 18 Spirit save for half damage. Spends 1d8 Madness Points.",
      level: 7,
      spellType: "ACTION",
      icon: "Void/Consumed by Void",
      effectTypes: ["damage", "debuff"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Void/Consumed by Void",
        tags: ["damage", "psychic", "debuff", "distortion", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 50,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "8d8 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [20],
          critBonusDamage: "4d8",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "disoriented",
            name: "Disoriented",
            description:
              "Disadvantage on all rolls for 2 rounds. DC 18 Spirit save negates.",
            mechanicsText: "",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 28 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description: "Spends 1d8 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "debuff", "distortion", "madness"],
    },
    {
      id: "fp_martyrs_shame",
      name: "Martyr's Shame",
      description:
        "Force an enemy to feel every wound your allies have suffered this combat â€” all at once. Deals psychic damage equal to half the total ally damage taken this encounter. Spends 1d8 Madness Points.",
      level: 7,
      spellType: "ACTION",
      icon: "Psychic/Agonizing Scream",
      effectTypes: ["damage"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["damage", "psychic", "empathetic link", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "total_ally_damage_taken / 2",
        damageTypes: ["psychic"],
        resolution: "AUTOMATIC",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 26 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description: "Spends 1d8 Madness Points when cast",
        },
        empatheticLink: {
          enabled: true,
          linkType: "damage_echo",
          description: "Deals psychic damage equal to half total ally damage taken this combat",
        },
      },

      tags: ["damage", "psychic", "empathetic link", "madness"],
    },
    {
      id: "fp_apocalyptic_revelation",
      name: "Apocalyptic Revelation",
      description:
        "Unleash 12d6 + Intelligence psychic energy in a 30-foot radius. DC 18 Spirit save for half damage. Requires 12 Madness. Adds 2d6 Madness (high Convulsion risk). Temptation ability. WARNING: If this spell triggers an Insanity Convulsion by pushing Madness to 20+, the backlash scales catastrophically — the Convulsion is no longer random. It becomes an Apocalyptic Convulsion: the Prophet suffers permanent Spirit drain (-2 Spirit until long rest), all allies within 30ft take 4d6 psychic damage from the psychic shockwave, and the Prophet is Confused for 3 rounds instead of the standard Convulsion duration. The consumed minds do not simply scream — they detonate.",
      level: 8,
      spellType: "ACTION",
      icon: "Psychic/Mind Strike",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Strike",
        tags: ["damage", "psychic", "aoe", "temptation", "madness", "voidcaller"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "12d6 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [20],
          critBonusDamage: "4d6",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      resourceGainConfig: {
        resources: [
          {
            type: "madness",
            formula: "2d6",
            description:
              "Generate 2d6 Madness Points (VERY high Convulsion risk)",
          },
        ],
      },

      triggerConfig: {
        requiredConditions: {
          enabled: true,
          logicType: "AND",
          conditions: [
            {
              id: "resource_threshold",
              category: "health",
              name: "Madness Threshold",
              parameters: {
                resource_type: "madness",
                threshold_value: 12,
                threshold_type: "above",
                comparison: "greater_than",
              },
            },
          ],
        },
      },

      specialMechanics: {
        madnessRequirement: {
          enabled: true,
          minimum: 12,
          description: "Requires at least 12 Madness Points to cast",
        },
        madnessGeneration: {
          enabled: true,
          formula: "2d6",
          description:
            "Adds 2d6 Madness Points after casting (VERY high Convulsion risk)",
        },
        temptationAbility: true,
        warning: "Extremely likely to trigger Insanity Convulsion",
        apocalypticConvulsion: {
          enabled: true,
          description:
            "If this spell triggers an Insanity Convulsion (Madness reaches 20+), the backlash scales catastrophically: Prophet suffers -2 Spirit until long rest (structural stat drain), all allies within 30ft take 4d6 psychic damage (psychic shockwave), and Prophet is Confused for 3 rounds. The consumed minds detonate rather than scream.",
          effects: [
            {
              id: "spirit_drain",
              name: "Structural Spirit Drain",
              description: "-2 Spirit until long rest",
              magnitude: -2,
              stat: "spirit",
              duration: "until_long_rest",
            },
            {
              id: "psychic_shockwave",
              name: "Psychic Shockwave",
              description: "4d6 psychic damage to all allies within 30ft",
              damageFormula: "4d6",
              damageType: "psychic",
              radius: 30,
            },
            {
              id: "apocalyptic_confusion",
              name: "Apocalyptic Confusion",
              description: "Confused for 3 rounds (extended from standard Convulsion)",
              duration: 3,
              durationUnit: "rounds",
            },
          ],
        },
      },

      tags: ["damage", "psychic", "aoe", "temptation", "madness", "voidcaller"],
    },
    {
      id: "fp_mass_manipulation",
      name: "Mass Manipulation",
      description:
        "Rewrite the loyalties of all enemies within 40 feet. Dominated enemies follow your commands for 2 rounds. DC 18 Spirit save negates. Spends 1d8 Madness Points. At 15+ Madness, dominated targets attack each other.",
      level: 8,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["control"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["control", "manipulation", "mind control", "mass", "madness", "deceiver"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"],
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        effects: [
          {
            id: "mass_control",
            name: "Mass Manipulation",
            description:
              "All enemies dominated for 2 rounds. DC 18 Spirit save.",
            config: {
              controlType: "full",
              saveType: "spirit",
              saveDC: 18,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "negates",
        },
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "1d8",
          description: "Spends 1d8 Madness Points when cast",
        },
      },

      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              madness_15_plus:
                "Dominated targets also attack each other each round",
              default: "Dominated targets follow your commands",
            },
          },
        },
      },

      tags: [
        "control",
        "manipulation",
        "mind control",
        "mass",
        "madness",
        "deceiver",
      ],
    },
    {
      id: "fp_ultimate_deception",
      name: "Ultimate Deception",
      description:
        "Create the ultimate deception â€” enemies believe they have won. Then reality floods in: 12d10 + Intelligence psychic damage. DC 19 Spirit save for half. Spends 2d6 Madness Points. The cruelest lie is hope.",
      level: 9,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["damage"],
      resolution: "DICE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["damage", "psychic", "ultimate", "deception", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"],
      },

      damageConfig: {
        formula: "12d10 + intelligence",
        damageTypes: ["psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [20],
          critBonusDamage: "6d10",
        },
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 38 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "2d6",
          description: "Spends 2d6 Madness Points when cast",
        },
      },

      tags: ["damage", "psychic", "ultimate", "deception", "madness"],
    },
    {
      id: "fp_prophet_of_lies",
      name: "Prophet of Lies",
      description:
        "Ascend to become the Prophet of Lies for 5 rounds. +6 INT/SPI/CHA, immune to charm/fear/confusion, charm or frighten enemies 30ft once, all deception spells auto-believed. On end: gain 3d10 Madness. Spends all current Madness.",
      level: 10,
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      effectTypes: ["transformation"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["transformation", "ultimate", "god form", "madness"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      transformationConfig: {
        transformType: "divine",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        concentration: true,
        maintainEquipment: true,
        grantedAbilities: [
          {
            id: "prophet_stats",
            name: "Eldritch Insight",
            description: "+6 Intelligence, +6 Spirit, +6 Charisma",
          },
          {
            id: "mass_manipulation",
            name: "Mass Manipulation",
            description:
              "Charm or frighten all enemies within 30ft (once per transformation)",
          },
          {
            id: "illusion_mastery",
            name: "Illusion Mastery",
            description: "All deception spells are automatically believed",
          },
          {
            id: "mind_shield",
            name: "Mind Shield",
            description: "Immune to charm, fear, and confusion effects",
          },
          {
            id: "prophet_madness",
            name: "Madness (On End)",
            description: "Gain 3d10 Madness Points when transformation ends",
          },
        ],
      },

      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 42 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      specialMechanics: {
        madnessSpending: {
          enabled: true,
          formula: "all",
          description: "Spends all current Madness Points when cast",
        },
      },

      tags: ["transformation", "ultimate", "god form", "madness"],
    },
    {
      id: "fp_void_whisper",
      name: "Void Whisper",
      description:
        "The void whispers secrets that erode your sanity. At the start of each turn, if you are not actively channeling or maintaining an effect, you take 1d4 psychic damage.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Psychic/Agonizing Scream",
      effectTypes: ["debuff"],
      resolution: "AUTOMATIC",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Agonizing Scream",
        tags: ["passive", "debuff", "self-damage", "madness", "false prophet"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },

      targetingConfig: {
        targetingType: "self",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "void_whisper",
            name: "Void Whisper",
            description:
              "Take 1d4 psychic damage at the start of each turn if not actively channeling.",
            mechanicsText: "",
          },
        ],
        durationValue: 0,
        durationType: "permanent",
        durationUnit: "permanent",
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["passive", "debuff", "self-damage", "madness", "false prophet"],
    },
    {
      id: "fp_fractured_reality",
      name: "Fractured Reality",
      description:
        "When an illusion or deception effect you created is dispelled or seen through, you are Confused for 1 round. DC 12 Spirit save to resist.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Psychic/Mental Dissaray",
      effectTypes: ["debuff"],
      resolution: "SAVE",

      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mental Dissaray",
        tags: ["passive", "debuff", "confusion", "illusion", "false prophet"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },

      targetingConfig: {
        targetingType: "self",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "fractured_confusion",
            name: "Fractured Reality",
            description:
              "When your illusion/deception is dispelled, become Confused for 1 round. DC 12 Spirit save.",
            mechanicsText: "",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 12,
          saveOutcome: "negates",
        },
      },

      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["passive", "debuff", "confusion", "illusion", "false prophet"],
    },
  ],
};
