/**
 * Deathcaller Class Data
 *
 * Complete class information for the Deathcaller - a dark necromancer
 * who harnesses forbidden blood magic and Necrotic Ascension paths.
 */

export const DEATHCALLER_DATA = {
  id : "deathcaller",
  name: "Deathcaller",
  icon: "Necrotic/Necrotic Skull",
  role: "Damage/Support",
  damageTypes: ["necrotic", "psychic"],

  // Overview section
  overview: {
    originStory: `Kora, the first human debtor to the Neth, could not bear the silence of the peat-bogs. She walked into the marsh-depths of the Bryngloom and bargained with the Root-Veil, offering her own life force to keep the ancestral lights of thirty generations burning.

The price of this necrotic link was absolute. Kora was cursed to hear the overlapping, non-stop screams of the deceased, reducing her spoken voice to a dry, raspy whisper. Every necrotic thread she spins drains her own blood, slowly decaying her skin to a waxy, pale frost.

Walk between life and the peat. The ancestors demand a voice, and you are the channel. Call them down before they call you home.`,
    title: "The Deathcaller",
    subtitle: "The Price Was Always Your Blood",
    illustration: "/assets/images/classes/deathcaller_illustration.png",
    illustrationCaption: "A Briaran Deathcaller commanding the natural cycle of decay with delicate leaves in their hair.",

    quickOverview: {
      title: "Quick Overview",
      content: `*You cut your palm and the blood ignites. Your vision darkens, your veins turn black, and the air fills with the stench of copper and burning meat. There is no going back. There never was.*

**The Deathcaller** does not cast spells. They sacrifice their own life force for power. Every spell costs mana AND health — you quite literally pay for magic in vitality. That sacrifice generates **Blood Tokens**: condensed necrotic energy that orbits your body like vultures. They supercharge your next spell... but they are not safe. They were never safe. If you don't spend them within 10 minutes, they detonate inside you.

**Core Loop**: Sacrifice HP → Cast Spell → Generate Blood Tokens → Spend tokens for devastation (or let them burst and eat you alive)

**Ascension Paths** (optional, permanent): Seven irreversible bargains carved into your soul. Each grants immense power at a permanent cost that can never be undone. The first — Shrouded Veil — adds +2d6 to every spell but amputates 10% of your max HP. Forever. Activate none, some, or all. Each scar is yours to keep until you die.

**Resources**: Health (primary fuel — your own body), Mana (secondary), Blood Tokens (0-20, volatile, always ticking), Ascension Paths (7 sequential, permanent scars)

**Best For**: Players who want to ride the razor's edge between annihilation and godhood, who understand that the real enemy is the timer in their own veins`,
    },

    description: `Something died in you long before you cast your first spell. A hope, maybe. A name. What remains is a hollow vessel filled with old blood and older promises. The Deathcaller did not choose this path — they were dragged onto it by circumstance, by desperation, by the simple arithmetic of survival in a world that devours the weak. Every spell is a wound reopened. Every Ascension Path is a piece of flesh surrendered to the dark. There is no cure. There is no redemption. There is only the next battle, the next sacrifice, and the faint hope that when the blood finally stops, it was worth what it cost. These paths are not gifts. They are scars that learned to bleed on command.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The deathcaller's vocal resonance was born in the sunken cathedrals of the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink>. A Vreken Veil-Speaker named **Kora** sought to maintain the light of thirty generations of ancestors and began singing the names of the dead with absolute vocal volume.

The price of this spiritual connection was hearing the continuous, overlapping screams of the deceased. The necrotic feedback permanently scarred her vocal cords, forcing her to speak in tattered whispers and spit blood when shouting her dirges.

**CITIES & CIVIL RECEPTION**
Deathcallers are respected as vital spiritual caretakers within the catacombs of the <LoreLink termId="sunken_spire">Sunken Spire</LoreLink>, but their presence in surface cities is viewed as a dark omen.

**RACES & CULTURAL AFFILIATION**
The class is heavily practiced by the <LoreLink termId="vreken">Clean Vreken</LoreLink> and the foam-born Myrathil who listen to the ocean rifts.

**NOTABLE FIGURES**
* **Kora the Veil-Speaker**: The first caller whose voice turned to tattered whispers to keep the crypt-lights burning.
* **Neth-Veil Valerius**: A Neth pact-lord who established the necrotic covenant linking bog-graves to Atropolis.`
    },

    signatureQuote: {
      text: '"I hear thirty generations of the dead. Every day, they ask me when it will be my turn. I tell them: when the last Neth is safely buried, and not a moment before."',
      speaker: 'Kora the Veil-Speaker',
      context: 'Her first words after emerging from the peat-bogs, Year 401 of the Dimming'
    },

    philosophy: {
      coreTenet: 'Death is not the end — it is the beginning of a debt. The dead owe their stories to the living, and the Deathcaller is the collector. Every ancestor has something to teach, and every Deathcaller is the conduit. Life force is the currency, and the dead are generous lenders.',
      relationship: 'Deathcallers do not raise the dead as servants — they petition them as ancestors. The dead choose whether to answer. This relationship is built on mutual obligation: the Deathcaller feeds the ancestors with their own life force (HP), and in return, the dead lend their power. If the Deathcaller stops paying, the dead stop answering — or worse, they start asking questions the Deathcaller does not want to answer.',
      paradox: 'The Deathcaller keeps the ancestors alive by feeding them their own health. Every spell costs blood. The most powerful rituals require so much life force that the Deathcaller must be on the verge of death to complete them. They are essentially a living blood bank for the dead, slowly draining themselves to keep the voices of the past audible. The question every Deathcaller eventually faces: how much of yourself are you willing to spend to keep the voices going?'
    },

    currentCrisis: `The bog-graves are waking up on their own. For centuries, the peat-bogs of the Bryngloom have held the dead in perfect preservation — bodies intact, memories accessible. Deathcallers have always decided when to call. Now, the dead are calling themselves.

In the past year, twelve Deathcallers have been found dead in their ritual chambers, their bodies drained of blood but showing no wounds. The bog-graves nearest them were empty — the occupants simply gone. The ancestors are not waiting for permission anymore. They are leaving their bogs and walking. No one knows where they are going, but the tracks all lead toward the Sundered Monoliths. The Deathcallers have lost control of their ancestral covenant, and the dead are marching toward something only they can see.`,

    meaningfulTradeoffs: `To hear the dead is to lose the living. Deathcallers exist in a state of constant aural overload — the voices of ancestors overlay the voices of the people in front of them. They develop the habit of staring past people, responding to voices no one else hears, and forgetting conversations that happened minutes ago because a more urgent ancestor interrupted. Relationships are nearly impossible — partners eventually realize they are competing with a chorus of dead relatives for the Deathcaller\'s attention. They always lose.`,

    classSpecificLocations: [
      {
        name: 'The Bog-Graves of Kora',
        locationId: 'peat-bog-sinks',
        description: 'The oldest consecrated burial ground in the Bryngloom, where Kora the Veil-Speaker performed the first necrotic covenant. The graves are marked by pale, bioluminescent fungi that pulse in sequence — a slow, rhythmic heartbeat of light that the Deathcallers believe is the ancestors breathing.',
        purpose: 'Primary necrotic anchor — the first and most powerful covenant site',
        status: 'Compromised — twelve graves are empty and the fungi pulses erratically'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: The only class that converts its own HP into explosive burst damage. A self-sustaining engine of annihilation.

**Why Bring a Deathcaller?**: No other class rides this razor's edge. The Deathcaller pays for power in flesh -- every spell costs health AND mana -- and generates Blood Tokens that supercharge the next cast. At 16+ tokens, a single spell becomes a walking nuclear detonation. They drain life back from enemies, making them a self-sustaining engine of destruction. When the party needs something dead that shouldn't be possible to kill, the Deathcaller opens a vein and solves the problem permanently.

**Damage Profile**:
- Sustained necrotic damage through health sacrifice
- Burst damage via Blood Token consumption
- Area denial through auras and spectral allies

**Support Capabilities**:
- Spectral summons that tank damage
- Life Link to protect allies
- Debuffs that cripple enemy effectiveness

**Fatal Flaw**: Blood Tokens are VOLATILE. They are not safe storage -- they are boiling blood orbiting your body. At 6+ tokens they sear your flesh for damage each turn. At 11+ tokens you cannot be healed by others. At 16+ tokens you are one death save away from detonating and taking your entire party with you. The timer is always ticking. If tokens aren't spent within 10 minutes, they burst for catastrophic self-damage. The Lichborne toggles modes. The Deathcaller rides a nuclear stockpile with no off switch.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `**Core Mechanic**: Health as a resource. Every powerful spell requires blood sacrifice, creating a high-risk, high-reward playstyle.

**Decision Points**:
- When to activate Ascension Paths (permanent consequences)
- How much health to sacrifice for power
- When to drain life back vs. dealing maximum damage
- Which spectral allies to summon and when

**Skill Expression**:
- Managing health pool as a resource
- Timing Blood Token usage before they burst
- Positioning to maximize aura effects
- Balancing aggression with self-preservation

**Team Dynamics**:
- Requires healers to offset self-damage
- Benefits from tanks who can protect while vulnerable
- Synergizes with crowd control to safely drain life
- Can protect allies through Life Link and spectral summons`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Price of Power",
      content: `**The Setup**: Your party faces a powerful undead knight and three skeletal archers. You're a Deathcaller with 3 Ascension Paths active (Shrouded Veil, Crimson Pact, Spectral Command). You have 60/72 HP, 40/50 mana, and 0 Blood Tokens.

**Active Ascension Paths**:
- **Shrouded Veil**: +2d6 necrotic damage to all spells, advantage on Stealth, -10% max HP (max HP is 72, not 80)
- **Crimson Pact**: Blood Tokens last 15 min (not 10), each token adds +1d6 damage (instead of +1d4)
- **Spectral Command**: Spectral allies deal +1d6 necrotic damage, specters drain 1d4 HP/turn from you each

**Starting State**: HP: 60/72 | Mana: 40/50 | Blood Tokens: 0 | Specters: 0

**Turn 1 - Blood Sacrifice (HP: 60 â†’ 52, Tokens: 0 â†’ 8)**

*The undead knight charges. You raise your hand, and dark energy crackles around your fingers. This will hurt.*

**Action**: Cast "Necrotic Bolt" (4 mana, costs 1d6 HP)
**Health Cost Roll**: 1d6 â†’ [4] = 4 HP sacrificed
**Blood Tokens**: +4 (now at 4 tokens)
**HP**: 60 - 4 = 56 HP

*You feel your life force drain into the spell. Four Blood Tokens materialize around you, pulsing with crimson energy.*

**Spell Damage**: 3d8 (base) + 2d6 (Shrouded Veil) â†’ [7, 6, 5] + [5, 4] = 27 necrotic damage

*The bolt strikes the undead knight, necrotic energy searing its armor.*

**Action (1 AP)**: Summon Spectral Allies (10 mana, costs 1d4 HP)
**Health Cost Roll**: 1d4 â†’ [3] = 3 HP sacrificed
**Blood Tokens**: +3 (now at 7 tokens)
**HP**: 56 - 3 = 53 HP
**Mana**: 40 - 4 - 10 = 26 mana

*Two ghostly specters rise from the ground (Spectral Command boon). They hover beside you, cold and hungry.*

**Specters Summoned**: 2 (they will drain 1d4 HP from you each turn)

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 â†’ [2] + [3] = 5 HP drained
**HP**: 53 - 5 = 48 HP

*The specters feed on your life force. You feel weaker, but they grow stronger.*

**Current State**: HP: 48/72 | Mana: 26/50 | Blood Tokens: 7 | Specters: 2

**Turn 2 - Blood Token Burst Damage (HP: 48 â†’ 42, Tokens: 7 â†’ 0)**

*The undead knight is wounded but still dangerous. The skeletal archers are firing at your tank. You have 7 Blood Tokensâ€”time to unleash them.*

**Action**: Cast "Death's Embrace" (10 mana, costs 2d8 HP, AoE necrotic damage)
**Health Cost Roll**: 2d8 â†’ [6, 5] = 11 HP sacrificed
**Blood Tokens**: +11 (now at 18 tokens)
**HP**: 48 - 11 = 37 HP
**Mana**: 26 - 10 = 16 mana

*You scream, and blood pours from your hands. Eighteen Blood Tokens swirl around you, a crimson storm.*

**Decision**: Spend ALL 18 Blood Tokens to enhance the spell (+18d6 necrotic damage!)

**Spell Damage**: 4d6 (base) + 2d6 (Shrouded Veil) + **18d6 (Blood Tokens)** â†’ [8, 9, 7, 6] + [5, 4] + [6, 5, 4, 6, 5, 3, 4, 5, 6, 4, 3, 5, 6, 4, 5, 3, 4, 5] = 30 + 9 + 81 = **120 necrotic damage to ALL enemies!**

*The explosion of necrotic energy obliterates the skeletal archers instantly. The undead knight staggers, its armor cracking.*

**Results**:
- Skeletal Archers: DEAD (overkilled)
- Undead Knight: 150 HP - 120 = 30 HP remaining

**Blood Tokens**: 18 - 18 = 0 (all spent)

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 â†’ [3] + [2] = 5 HP drained
**HP**: 37 - 5 = 32 HP

*You're at 32/72 HP. You've sacrificed nearly half your health, but the battlefield is yours.*

**Current State**: HP: 32/72 | Mana: 16/50 | Blood Tokens: 0 | Specters: 2

**Turn 3 - Life Drain Recovery (HP: 32 â†’ 45)**

*You're dangerously low on health. The undead knight is nearly dead. Time to drain life back.*

**Action**: Cast "Life Leech" (14 mana, costs 2d6 HP, drains HP from enemy)
**Health Cost Roll**: 2d6 â†’ [2] = 2 HP sacrificed
**Blood Tokens**: +2 (now at 2 tokens)
**HP**: 32 - 2 = 30 HP
**Mana**: 16 - 14 = 2 mana

**Spell Effect**: Drain 5d6 HP from undead knight
**Drain Roll**: 5d6 â†’ [7, 6, 8, 5, 4] = 30 HP drained
**Undead Knight**: 30 - 30 = DEAD
**Your HP**: 30 + 30 = 60 HP (healed!)

*The undead knight's life force flows into you. You feel strength returning.*

**End of Turn Drain**: Specters drain life
**Drain Roll**: 1d4 + 1d4 â†’ [4] + [1] = 5 HP drained
**HP**: 60 - 5 = 55 HP

**Current State**: HP: 55/72 | Mana: 2/50 | Blood Tokens: 2 | Specters: 2

**Turn 4 - Mopping Up (HP: 55 â†’ 50)**

*The undead knight is dead. The specters finish off the remaining skeletal archers.*

**Specters' Turn**: Both attack skeletal archers

**Blood Token Burst**: You have 2 Blood Tokens unused. They've been active for 3 turns (not 10 minutes yet), so they don't burst.

**End of Combat Drain**: Specters dissipate (no more drain)

**Final State**: HP: 55/72 | Mana: 2/50 | Blood Tokens: 2 (will burst in 7 minutes if not used)

**Post-Combat**:
*You stand among the corpses, blood dripping from your hands. The battle is over. Your specters fade, their hunger sated.*

**The 2 Blood Tokens pulse around you. In 7 minutes, they'll burst for 2d10 damage if you don't use them. You'll need to cast another spell soon, or suffer the consequences.**

**The Lesson**: Deathcaller gameplay is about:
1. **Health as Resource**: You sacrificed 20 HP across 4 spellsâ€”health is your primary resource
2. **Blood Token Management**: Generated 18 tokens, spent all 18 for MASSIVE damage (120 total)
3. **Burst Timing**: Blood Tokens burst after 10 minutes (15 with Crimson Pact)â€”use them or lose HP
4. **Life Drain Recovery**: Life Leech healed 21 HP, offsetting self-damage
5. **Ascension Costs**: Specters drained 15 HP total (Spectral Command curse)
6. **Risk-Reward**: You dealt 147 damage total (27 + 120) but sacrificed significant health

You're not a mage who casts spells with manaâ€”you're a BLOOD MAGE who pays in life itself. Every spell is a gamble. Every Blood Token is a ticking time bomb. Master the balance, or die trying.`,
    },
  },

  // Equipment
  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Crimson Blade Path",
        icon: "Slashing/Bloody Slash",
        items: [
          "Ritual Dagger (1d6 slashing, necrotic resonance — HP sacrificed with this weapon generates +1 Blood Token per strike)",
          "Bloodstained Leather Armor (No agility penalty)",
          "Copper Chalice (ritual focus — reduces HP cost of first spell each combat by 1)",
        ],
        description:
          "The close-quarters path. Your dagger is both weapon and conduit — every cut feeds the Blood Bank. Best for Blood Reavers who plan to drain at melee range.",
      },
      {
        name: "Obsidian Staff Path",
        icon: "Necrotic/Necrotic Skull",
        items: [
          "Obsidian Staff (1d8 bludgeoning, +5 ft reach on necrotic spells)",
          "Tattered Robes (+1 necrotic damage to all spells)",
          "Vial of Congealed Blood (consumable — restore 2d6 HP, once per long rest)",
        ],
        description:
          "The ranged caster path. The staff extends your reach and amplifies spell potency. Best for Void Callers and Spectral Masters who prefer to keep distance while sacrificing health.",
      },
    ],
    standardGear: [
      "Backpack, 5 days iron rations (taste of copper is free)",
      "Waterskin filled with brackish water",
      "Flint and steel",
      "Length of black silk cord (10 ft)",
      "Iron pendant etched with a closed eye (focus for Ascension rites)",
      "1d6 × 4 tarnished silver pieces",
    ],
    notes:
      "Deathcallers cannot wield holy symbols or consecrated weapons — the necrotic resonance in their blood causes such items to crack and dull. You may use any melee weapon, but daggers and staves benefit most from your blood magic conduits.",
  },

  // Resource System
  resourceSystem: {
    title: "Necrotic Ascension",
    subtitle: "Seven Paths of Dark Power",

    description: `You are the fuel and the fire. Every spell you cast is an act of metabolic sacrifice dressed in the language of sorcery -- your health bar is a ledger of debts that compound with every cast. The Blood Tokens that result are not a resource to be managed. They are concentrated necrotic energy, orbiting your body like carrion flies around a dying star. They sear. They hiss. They want to burst.

**Blood Token Volatility**: Tokens are NOT safe storage. They are LITERALLY boiling blood orbiting your body.
- **1-5 Tokens**: Stable. No side effects. The blood simmers but does not boil over.
- **6-10 Tokens**: Unstable. You take 1 necrotic damage at the start of each turn as the tokens sear your flesh. Enemies within 5ft take 1 necrotic damage per token (passive aura of agony). Your skin blisters. The smell is unforgettable.
- **11-15 Tokens**: Volatile. You take 1d4 necrotic damage per token at the start of each turn. All your spell saves are at -2 (the blood is interfering with your casting). You cannot be healed by others -- the tokens consume healing as fuel instead. Your veins have turned against you.
- **16-20 Tokens**: CRITICAL MASS. You take 1d6 necrotic damage per token per turn. You have advantage on death saves (the blood refuses to let you die) but disadvantage on all other saves. If you reach 0 HP with 16+ tokens, ALL tokens detonate -- 1d10 necrotic damage per token to EVERYTHING within 30ft (including allies). You are a bomb that learned to walk. Your party knows it. They can smell it on you.

**Differentiation**: Unlike the Lichborne (who burns HP intentionally in Aura Mode for controlled damage) or False Prophet (who draws on faith), the Deathcaller's resource is VOLATILE by nature. Blood Tokens are not a battery -- they are a chain reaction waiting to happen. The Lichborne toggles modes; the Deathcaller rides a nuclear stockpile.`,

    cards: [
      {
        title: "Health Fuel",
        stats: "HP as Mana",
        details:
          "Every spell costs both Mana and a dice roll of HP. Your life bar is your battery; spend it to gain power, drain it back to survive.",
      },
      {
        title: "Blood Tokens (0-20+)",
        stats: "1 Token per 1 HP Lost",
        details:
          "Sacrificing HP generates tokens. Spend them for +1d6 damage per token. âš ï¸ VOLATILE: 6+ tokens = self-damage per turn, 11+ = can't be healed, 16+ = nuclear detonation on death. If not spent within 10-15 mins, they burst for 1d10 self-damage each.",
      },
      {
        title: "Necrotic Ascension",
        stats: "7 Permanent Paths",
        details:
          "Sequential upgrades that grant massive boons but permanent, stacking curses. Once a path is activated, it can never be reversed.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Change", "Notes"],
      rows: [
        [
          "Sacrifice HP (Spell Cost)",
          "+1 Token per 1 HP",
          "Generated automatically on every cast",
        ],
        [
          "Spend for Power",
          "-Variable Tokens",
          "Adds +1d6 Necrotic damage per token spent",
        ],
        [
          "Burst (Timer Expires)",
          "Reset to 0",
          "âš ï¸ Take 1d10 damage per token!",
        ],
        [
          "Life Leech / Drain",
          "Restore HP",
          "Essential for offsetting the cost of power",
        ],
      ],
    },

    usage: {
      momentum:
        'Spend tokens to add +1d6 damage each to any spell. You must pay the "Blood Price" (HP) first to generate them, creating a building momentum of lethality.',
      flourish:
        "âš ï¸ The Ticking Bomb: Tokens burst after 10 minutes (15 with Crimson Pact). If you hoard 20 tokens and the timer hits zero, you take 20d10 damage instantly.",
    },

    overheatRules: {
      title: "Permanent Ascension",
      content: `Unlike other classes, the Deathcaller has no "Overheat" to recover from. Instead, you face the **Sequential Descent**.

**The Price of Power**:
- **Bargains**: You can activate any of your 7 unlocked Ascension Paths at any time.
- **The Catch**: These are permanent character changes. You cannot "deactivate" a curse once the boon is accepted.
- **Cumulative Curses**: Penalties like -10% Max HP, fire vulnerability, and perception loss stack.

**Strategy**: High-level Deathcallers often stop at Path 3 or 4 to maintain survivability, only descending into the Deep Void (Path 7) when they are ready to become a glass cannon of pure necrotic devastation.`,
    },

    ascensionPathsTable: {
      title: "Necrotic Ascension Paths",
      headers: ["Path", "Boon", "Curse", "Unlock Level"],
      rows: [
        [
          "Shrouded Veil",
          "+2d6 necrotic damage to all spells + advantage on Stealth",
          "-10% max HP (perpetual shadow drain)",
          "1",
        ],
        [
          "Crimson Pact",
          "Blood Tokens last 15 min (not 10), each token adds +1d6 damage (instead of +1d4)",
          "Unused tokens burst after 10 min (1d10 per token)",
          "3",
        ],
        [
          "Spectral Command",
          "Spectral allies deal +1d6 necrotic damage",
          "Specters drain 1d4 HP from you per turn each",
          "5",
        ],
        [
          "Frostwalker",
          "Aura: 15ft radius, -10ft enemy speed, 1d4 frost/turn",
          "+50% fire damage taken (vulnerability)",
          "7",
        ],
        [
          "Silent Shroud",
          "Advantage on Stealth and silent movement",
          "-2 Perception (muffled senses)",
          "9",
        ],
        [
          "Life Leech",
          "Melee attacks restore 1d6 HP",
          "-5% max HP (unquenchable thirst)",
          "11",
        ],
        [
          "Deep Void",
          "1/long rest: Negate any spell targeting you",
          "2d6 psychic damage when used (void consumption)",
          "13",
        ],
      ],
    },

    bloodTokenTable: {
      title: "Blood Token Mechanics",
      headers: ["Mechanic", "Effect", "Notes"],
      rows: [
        [
          "Generation",
          "1 HP sacrificed = 1 Blood Token",
          "Blood Tokens are a core mechanic from level 1",
        ],
        [
          "Enhancement",
          "Spend tokens to add 1d6 necrotic damage per token",
          "Can spend multiple tokens on one spell",
        ],
        [
          "Burst Timer",
          "Tokens expire after 10 minutes",
          "Timer resets when new tokens are generated",
        ],
        [
          "Burst Damage",
          "1d10 necrotic damage per unused token",
          "Cannot be prevented or reduced",
        ],
        [
          "Maximum Tokens",
          "No hard limit, but risk increases",
          "Strategic decision: power vs. safety",
        ],
      ],
    },

    strategicConsiderations: {
      title: "The Razor's Edge: Risk & Recovery",
      content: `**Phase 1: The Sacrifice (0â€“10 Tokens)**: Early combat is about building your bank. Don't be afraid of the HP costâ€”every point lost is a point of potential burst damage later.

**Phase 2: The Crimson Storm (11â€“20 Tokens)**: You are at peak lethality. One well-placed 'Death's Embrace' can wipe a room, but a burst now would deal ~110 self-damage. Check your timer!

**Phase 3: Drain & Reset**: When your HP hits 30%, prioritize recovery. Use 'Life Leech' or 'Soul Rend' to steal back the vitality you spent. A smart Deathcaller ends the fight with more health than they started with.

**Advanced Tactic: The Intentional Burst**: If you have 1-2 tokens left and plenty of HP, you can let them burst to clear the timer before a long rest, though it is always better to spend them on a cantrip.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Tracking the Forbidden",
      content: `Playing a Deathcaller at the table is all about managing the physical tension of the "Blood Bank" and the "Ticking Clock."

**Required Materials**:
- **A Bowl of Red Beads**: 20â€“30 red glass beads or tokens to represent Blood Tokens.
- **A Physical Timer**: An egg timer or a phone countdown set to 10:00.
- **Permanent Marker**: For your laminated Ascension Card.

**The Physical Hack (Friction Points)**:
- **The Ticking Clock**: The moment you generate your first Blood Token, start your 10-minute timer. If it dings, you must roll 1d10 for every bead in your bowl and take that damage. Reset it only when you generate *new* tokens.
- **The Ascension Card**: Keep a separate reference card with the 7 Paths. Once you activate one, check the box with a marker. It serves as a visual reminder of your permanent curses (like "Take +50% Fire Damage").
- **The Blood Price**: Use a purple or black d6 to track your HP sacrifice separately from enemy damage. It makes it easier to tell if you're dying to the boss or to your own hubris.

**Pro Tips**:
- Keep your "Life Leech" dice (white/green) ready. You'll be using them often to refill the "tank."
- **Slam the Beads**: When you spend 10 tokens for a massive strike, physically dump the 10 beads back into the supply bowl. The sound of the beads hitting the glass should emphasize the power of the strike.`,
    },
  },

  specializations: {
    title: "Specializations",
    subtitle: "Three Paths of Necromantic Mastery",

    specs: [
      { id : "blood-reaver",
        name: "Blood Reaver",
        icon: "Necrotic/Drain Soul",
        color: "#8B0000",
        theme: "Aggressive Life Drain",

        description: `Blood Reavers stopped running from the hunger and let it consume them from within. They wade into melee range with their life essence pouring freely, draining the vitality from everything they touch to fill the void that their own sacrifice carved. The Crimson Pact and Life Leech paths are their preferred scars -- permanent concessions that turn every enemy into a transfusion. They do not heal. They take. And what they take is never enough to fill what they've lost.`,

        playstyle:
          "Melee-range life drain, aggressive health sacrifice, high sustain through draining",

        strengths: [
          "Excellent sustain through life drain",
          "Can function as off-tank with proper support",
          "High burst damage through Blood Token consumption",
          "Strong in prolonged fights",
        ],

        weaknesses: [
          "Vulnerable to burst damage",
          "Requires melee range for optimal play",
          "Dependent on having enemies to drain",
          "Struggles against undead/constructs",
        ],

        specPassive: {
          name: "Sanguine Hunger",
          icon: "Necrotic/Drain Soul",
          description:
            "Your life drain effects are 25% more effective. Additionally, when you drop below 25% health, your next life drain spell is cast instantly and costs no mana.",
        },

        keyAbilities: [
          "Blood Leech - Drain health from a target, restoring 25% per HP sacrificed (8 mana, 1d4 HP cost)",
          "Crimson Shield - Absorb 10x damage sacrificed, converting damage taken into healing (5 mana, 1d10 HP cost)",
          "Eternal Agony - Inflict escalating psychic pain based on Health Sacrificed (15 mana, 1d10 HP cost)",
        ],
      },

      { id : "spectral-master",
        name: "Spectral Master",
        icon: "Necrotic/Arise",
        color: "#4B0082",
        theme: "Summoning and Control",

        description: `Spectral Masters tear the veil between the living and the dead and force corpses to serve. Every minion they raise is paid for in their own blood -- a wound that never closes, a debt to the dead that compounds with each summoning. The legions they command are not soldiers; they are echoes of people who once had names, bound to the Deathcaller's heartbeat and feeding on it. The more they summon, the less of themselves remains.`,

        playstyle:
          "Summoner playstyle, area control, sustained damage through minions",

        strengths: [
          "Excellent area control with multiple summons",
          "Can tank damage through spectral allies",
          "Strong sustained damage output",
          "Effective in battles with corpses available",
        ],

        weaknesses: [
          "Severely reduced mobility with multiple summons",
          "Vulnerable without corpses to raise",
          "Summons require health sacrifice",
          "Weak in clean environments (no corpses)",
        ],

        specPassive: {
          name: "Spectral Dominion",
          icon: "Necrotic/Arise",
          description:
            "Your spectral allies have +25% health and deal additional necrotic damage equal to your proficiency modifier. Specter HP drain from Spectral Command is reduced by 1 per turn (minimum 0).",
          damageFormula: "1d4",
        },

        keyAbilities: [
          "Soul Chain - Summon spectral ally with HP equal to Health Sacrificed (0 mana, 2d8 HP cost)",
          "Dance of the Damned - Summon two skeletal archers dealing 2d6 each (0 mana, 3d6 HP cost)",
          "Spectral Vanguard - Summon a powerful spectral knight to protect allies (10 mana, 4d8 HP cost)",
        ],
      },

      { id : "void-caller",
        name: "Void Caller",
        icon: "Psychic/Mind Strike",
        color: "#1C1C1C",
        theme: "Psychic Devastation",

        description: `Void Callers stared into the abyss and the abyss stared back with a thousand dead eyes. They channel psychic devastation -- not the clean magic of scholars, but the screaming inheritance of things that should have stayed buried. The Deep Void path is their preferred scar: a permanent hole in their soul through which madness pours like groundwater through a grave. Their magic is the most destructive in the Deathcaller's arsenal. It is also the most likely to kill the one wielding it.`,

        playstyle:
          "Ranged psychic damage, debuffs, high-risk ultimate abilities",

        strengths: [
          "Highest burst damage potential",
          "Powerful crowd control through fear/despair",
          "Can negate incoming spells with Deep Void",
          "Excellent against high-armor targets (psychic damage)",
        ],

        weaknesses: [
          "Extremely fragile",
          "Ultimate abilities have permanent HP costs",
          "Limited sustain options",
          "Psychic damage can be resisted by some enemies",
        ],

        specPassive: {
          name: "Void Touched",
          icon: "Psychic/Mind Strike",
          description:
            "Your psychic damage spells ignore resistance. When you negate a spell using Deep Void, you gain 1 Void Power stack (max 3). Each stack adds +1d6 psychic damage to your next psychic spell. Stacks are consumed when you cast a psychic spell.",
          damageFormula: "2d6",
        },

        keyAbilities: [
          "Mind Shatter - Psychic damage scaling with Health Sacrificed, rounded up (25 mana, 2d6 HP cost)",
          "Despair's Grasp - Mass debuff causing disadvantage and halved movement (15 mana, DC 15 Wisdom)",
          "Void Rift - Ultimate ability pulling enemies and dealing massive damage (45 mana, 4d10 HP + 1d6 permanent HP)",
        ],
      },
    ],
  },

  // Deathcaller Spells by Level - Ground-up overhaul
  // All spells: HP sacrifice generates Blood Tokens equal to HP lost.
  // Blood Tokens can be spent to enhance any spell (+1d6 necrotic per token).
  // Volatility thresholds: 6+ unstable, 11+ can't be healed, 16+ nuclear detonation on death.

  exampleSpells: [
    // LEVEL 1 SPELLS (3)

    { id : "dc_necrotic_bolt",
      name: "Necrotic Bolt",
      description:
        "You channel your life force into a lance of blackened energy that burrows into the target's vitality and gnaws. Their own life force turns traitor - every swing of their weapon carries the memory of your rot.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "ranged", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A low, rattling hiss — like air escaping a collapsed lung.",
        somaticText: "Press your palm outward, dark veins flaring as necrotic energy condenses into a bolt.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      triggerConfig: {
        triggers: [
          { id : "blood_sacrifice_bolt",
            name: "Blood Sacrifice",
            triggerType: "on_cast",
            action: "Sacrifice 1d6 HP. Generate Blood Tokens equal to HP lost.",
          },
        ],
      },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "necrotic_weakness",
            name: "Necrotic Weakness",
            description: "Damage dealt reduced by 3 for 1 round.",
            mechanicsText: "Target deals -3 damage for 1 round",
          },
        ],
        statPenalties: [
          { stat: "damage", magnitude: -3, magnitudeType: "flat" },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      tags: ["damage", "debuff", "ranged", "blood magic"],
    },

    { id : "dc_corpse_walk",
      name: "Corpse Walk",
      description:
        "The Deathcaller does not flee. They follow the corpses. You dissolve into a cloud of necrotic ash and reform where death has already walked. If nothing has died here, this spell is a closed door - there is nowhere to walk.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Death Mark",
      effectTypes: ["utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Death Mark",
        tags: ["teleport", "mobility", "necrotic", "corpse_dependent"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["location"],
        maxTargets: 1,
        requiresLineOfSight: false,
        restriction:
          "Target location must be a space where a creature has died during this combat. If no creature has died, this spell cannot be cast.",
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A whispered name — the last word spoken by the dead.",
        somaticText: "Drag your fingers through the air as if parting a curtain of ash, then step through.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "corpse_teleport",
            name: "Corpse Walk",
            description:
              "Teleport to a location where a creature died this combat. Leaves a trail of necrotic residue.",
            distance: 60,
            duration: 0,
            durationUnit: "instant",
          },
        ],
        power: "minor",
      },
      tags: ["teleport", "mobility", "necrotic", "blood magic", "corpse_dependent"],
    },

    { id : "dc_crimson_aegis",
      name: "Crimson Aegis",
      description:
        "Your blood hardens into a carapace of scab and shadow. It will hold. It will hurt. The wound you inflict on yourself becomes armor - every drop shed buys a wall of congealed agony.",
      level: 1,
      spellType: "REACTION",
      icon: "Necrotic/Protective Aura",
      effectTypes: ["buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Protective Aura",
        tags: ["protection", "ward", "reaction", "blood magic"],
        castTime: 1,
        castTimeType: "REACTION",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
        resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 4 },
        actionPoints: 0,
        components: ["verbal", "somatic"],
        verbalText: "A sharp gasp of exertion, teeth clenched against the strain.",
        somaticText: "Clench your fist and pull — your life force crystallizes into a shimmering crimson shell.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d8" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      triggerConfig: {
        triggers: [
          { id : "aegis_absorption",
            name: "Crimson Absorption",
            triggerType: "on_hit",
            action: "When struck, absorb damage up to 2× HP sacrificed. Ward crumbles when depleted.",
          },
        ],
      },
      buffConfig: {
        effects: [
          { id : "crimson_ward",
            name: "Crimson Aegis",
            description:
              "Absorbs damage equal to 2x HP sacrificed (1d8). The ward crumbles as it drinks the blows meant for you.",
            mechanicsText: "Absorb 2× HP sacrificed as a damage ward (lasts 3 rounds)",
            statModifier: {
              stat: "damage_absorption",
              magnitude: "2x_health_sacrificed",
              magnitudeType: "formula",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      tags: ["protection", "ward", "reaction", "blood magic"],
    },

    // LEVEL 2 SPELLS (2)

    { id : "dc_blood_leech",
      name: "Blood Leech",
      description:
        "You extend a tendril of coagulated hate. Their life becomes yours - a crude, screaming transfusion. The stolen warmth is never enough. It never will be.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["damage", "healing", "life drain", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingMode: "effect",
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      effectTargeting: {
        damage: {
          targetingType: "single",
          rangeType: "ranged",
          rangeDistance: 30,
          targetRestrictions: ["enemy"],
          maxTargets: 1,
        },
        healing: {
          targetingType: "self",
        },
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 7 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A guttural growl — hunger given voice.",
        somaticText: "Extend your arm, fingers splayed, as a tendril of dark energy arcs toward the target.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d4" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      triggerConfig: {
        triggers: [
          { id : "vampiric_leech",
            name: "Vampiric Drain",
            triggerType: "on_hit",
            action: "On hit, drain HP equal to damage dealt. Restore that amount to caster.",
          },
        ],
      },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      healingConfig: {
        formula: "2d6",
        healingType: "vampiric",
        resolution: "DICE",
      },
      tags: ["damage", "healing", "life drain", "blood magic"],
    },

    { id : "dc_grave_whisper",
      name: "Grave Whisper",
      description:
        "You speak the name of a thing that should not be remembered. The target's flesh remembers how to rot. Their skin forgets it was ever alive.",
      level: 2,
      spellType: "ACTION",
      icon: "Necrotic/Corruption",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Corruption",
        tags: ["debuff", "vulnerability", "ranged", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 8 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A single word — the syllable of decay. It tastes of copper and grave soil.",
        somaticText: "Draw a slow circle in the air with one finger, leaving a trail of dark mist.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "necrotic_vulnerability",
            name: "Grave Whisper",
            description: "+50% necrotic damage taken for 3 rounds. The flesh remembers how to rot.",
            mechanicsText: "+50% necrotic vulnerability for 3 rounds (Con save negates)",
            statusEffect: {
              vulnerabilityType: "necrotic",
              vulnerabilityPercent: 50,
            },
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      tags: ["debuff", "vulnerability", "ranged", "blood magic"],
    },

    // LEVEL 3 SPELLS (2)

    { id : "dc_blood_pact",
      name: "Blood Pact",
      description:
        "You press your bleeding palm against theirs. The pact is sealed in agony. Your heartbeats synchronize. Their pain is yours. Your ruin is theirs. When one of you breaks, the other bleeds to keep them standing.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Ritual of Blood",
      effectTypes: ["utility", "buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ritual of Blood",
        tags: ["support", "protection", "pact", "blood"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana", "bloodTokens"],
        resourceValues: { mana: 10, bloodTokens: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A binding oath — two names spoken as one, sealed in blood.",
        somaticText: "Press your bleeding palm against theirs, crimson threads weaving between you.",
      },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      resolution: "DICE",
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          { id : "blood_pact_link",
            name: "Blood Pact",
            description:
              "When either linked creature drops below 25% HP, the other takes 2d6 necrotic and the wounded party heals for the same. Triggers once.",
            mechanicsText: "On trigger: partner takes 2d6 necrotic, wounded heals 2d6 (once per pact)",
          },
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          { id : "blood_pact_trigger",
            name: "Symbiotic Wound",
            description:
              "On trigger: 2d6 necrotic to partner, 2d6 healing to wounded. Max 1 trigger.",
          },
        ],
        power: "major",
      },
      tags: ["support", "protection", "pact", "blood"],
    },

    { id : "dc_soul_rend",
      name: "Soul Rend",
      description:
        "You reach across the void and close your grip around their life essence. Something screams. You pull. If they are already dying, you pull harder. There is always more to take.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Ebon Death",
      effectTypes: ["damage"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ebon Death",
        tags: ["damage", "melee", "execute", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 12 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A ragged scream — effort torn from the throat.",
        somaticText: "Lunge forward and close your grip, tearing at the target's life force with invisible claws.",
        useFormulas: { health: true },
        resourceFormulas: { health: "2d8" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "4d6 + 2d6",
        damageTypes: ["necrotic", "psychic"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              health_below_25: "8d6 + 4d6",
              default: "4d6 + 2d6",
            },
          },
        },
        effectTriggers: {
          damage: {
            logicType: "AND",
            compoundTriggers: [
              { id : "health_threshold",
                category: "health",
                name: "Target Below 25% HP",
                parameters: {
                  percentage: 25,
                  comparison: "below",
                  perspective: "target",
                },
              },
            ],
          },
        },
      },
      tags: ["damage", "melee", "execute", "blood magic"],
    },

    // LEVEL 4 SPELLS (2)

    { id : "dc_crimson_tether",
      name: "Crimson Tether",
      description:
        "A whip of coagulated malice lashes out and embeds itself in living meat. You are bound now. Neither of you leaves until one of you stops screaming. They can run - but every step costs them, and you can always drag them back.",
      level: 4,
      spellType: "ACTION",
      icon: "Piercing/Bleeding Arrow",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Bleeding Arrow",
        tags: ["damage", "control", "tether", "dot"],
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
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 12 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "A sharp chant — binding syllables that lock two fates together.",
        somaticText: "Whip your arm forward, a lash of crimson energy coiling around the target.",
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: {
        formula: "1d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d6",
          damageType: "necrotic",
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },
      controlConfig: {
        controlType: "forcedMovement",
        effects: [
          { id : "crimson_tether_slow",
            name: "Crimson Tether",
            description:
              "Movement speed reduced by 15 feet. Tethered to Deathcaller. Caster may spend 1 Blood Token to pull target 15 feet closer.",
            config: {
              speedReduction: 15,
              maxRange: 40,
              pullCost: { resource: "blood_tokens", amount: 1 },
              pullDistance: 15,
              duration: 3,
            },
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
        duration: 3,
        durationUnit: "rounds",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },
      tags: ["damage", "control", "tether", "dot"],
    },

    { id : "dc_spectral_horde",
      name: "Spectral Horde",
      description:
        "You tear the veil. The dead do not rest - they serve. Two wraiths claw their way into existence, bound to your will and your heartbeat. They feed on you. This is the arrangement. If corpses litter the ground, the cost is lighter. If not, you pay in full.",
      level: 4,
      spellType: "ACTION",
      icon: "Necrotic/Arise",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Arise",
        tags: ["summoning", "spectral", "minions", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 0,
        targetRestrictions: ["self"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 14 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A rising invocation — names of the dead, spoken in sequence.",
        somaticText: "Spread both arms wide, tearing the veil as wraiths claw into existence at your command.",
        useFormulas: { health: true },
        resourceFormulas: { health: "3d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      summoningConfig: {
        creatures: [
          {
            quantity: 2,
            hp: 15,
            damagePerTurn: "1d6",
            damageType: "necrotic",
            specialRules: [
              "Each wraith drains 1d4 HP from the caster at the start of each turn.",
              "If a corpse exists within 10ft at time of casting, reduce HP cost by 1d6 per corpse (max 2 corpses).",
            ],
          },
        ],
        duration: 10,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        quantity: 2,
        maxQuantity: 2,
        controlRange: 60,
        controlType: "verbal",
        difficultyLevel: "easy",
      },
      tags: ["summoning", "spectral", "minions", "blood magic"],
    },

    // LEVEL 5 SPELLS (2)

    { id : "dc_deaths_sentence",
      name: "Death's Sentence",
      description:
        "You lean in close. You whisper the hour of their death. You have seen it in the marrow of their bones. The sentence is already written in blood. Some organisms are too broken to argue with the verdict.",
      level: 5,
      spellType: "ACTION",
      icon: "Slashing/Execution",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Slashing/Execution",
        tags: ["execute", "control", "melee", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
      },
        resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 18 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A cold declaration — the sentence read aloud from a ledger only you can see.",
        somaticText: "Reach forward and press two fingers to the target's forehead, marking them for death.",
        useFormulas: { health: true },
        resourceFormulas: { health: "3d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "6d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id : "instant_death",
            name: "Death's Sentence",
            description:
              "If target is below 30% HP: Constitution save DC 16 or die instantly. On successful save, take 6d6 necrotic damage instead.",
            config: {
              executeThreshold: 30,
              executeThresholdType: "percentage",
              instantKill: true,
            },
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        duration: 0,
        durationUnit: "instant",
      },
      tags: ["execute", "control", "melee", "blood magic"],
    },

    { id : "dc_life_link",
      name: "Life Link",
      description:
        "You weave your veins into theirs. A bridge of blood. When the blade finds them, it finds you first. This is the gift. This is the wound. Every point of their suffering that you absorb becomes fuel for the fire you carry inside.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Protective Aura",
      effectTypes: ["utility", "buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Protective Aura",
        tags: ["support", "protection", "link", "damage_sharing"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["ally"],
        maxTargets: 1,
      },
      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 18 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A solemn oath — your heartbeat and theirs synchronized in a single rhythm.",
        somaticText: "Extend your bloodied palm toward an ally, threads of crimson light bridging the gap.",
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "life_link_armor",
            name: "Linked Resolve",
            description: "+2 DR to both linked creatures while the link persists.",
            mechanicsText: "+2 DR to both linked creatures (10 rounds)",
            statModifier: {
              stat: "armor",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          { id : "life_link_redirect",
            name: "Life Link",
            description:
              "50% of damage the ally takes is redirected to you. Redirected damage generates Blood Tokens equal to damage absorbed.",
            duration: 10,
            durationUnit: "rounds",
          },
        ],
        power: "major",
      },
      tags: ["support", "protection", "link", "damage_sharing"],
    },

    // LEVEL 6 SPELLS (3)

    { id : "dc_blood_cataclysm",
      name: "Blood Cataclysm",
      description:
        "Every drop of hoarded agony detonates at once. The air becomes red glass. The screaming is not metaphorical. You are the bomb. You always were. Spend everything. Leave nothing. This is what they brought you for.",
      level: 6,
      spellType: "ACTION",
      icon: "Poison/Poison Plague",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        tags: ["aoe", "damage", "blood_tokens", "ultimate"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },
        resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 22, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A roar of release — every held-back scream let loose at once.",
        somaticText: "Throw both arms wide and detonate — the Blood Tokens shatter outward in a crimson shockwave.",
        useFormulas: { health: true },
        resourceFormulas: { health: "4d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "8d6 + blood_tokens_spent x 1d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "half_damage",
        },
      },
      controlConfig: {
        controlType: "incapacitation",
        effects: [
          { id : "cataclysm_stun",
            name: "Cataclysm Shockwave",
            description:
              "If 10+ Blood Tokens were spent, all enemies in area are Stunned for 1 round.",
            config: {
              thresholdBloodTokens: 10,
              stunDuration: 1,
            },
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        duration: 1,
        durationUnit: "rounds",
      },
      tags: ["aoe", "damage", "blood_tokens", "ultimate"],
    },

    { id : "dc_agony",
      name: "Agony",
      description:
        "You open a wound in the world. Not a portal - a wound. Everything within it feels what you feel. Every heartbeat is a hammer. Every breath is a razor. Move if you want. Act if you dare. The choice is theirs. The consequence is not.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Twist Pain",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Twist Pain",
        tags: ["aoe", "choice_based", "control", "necrotic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemy"],
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A keening wail — the sound of nerves pushed past their limit.",
        somaticText: "Claw at the air as if ripping open reality, dark energy pulsing outward from the wound.",
        useFormulas: { health: true },
        resourceFormulas: { health: "3d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "agony_penalty",
            name: "Agony",
            description:
              "Each time the target moves, attacks, or casts a spell, they take 2d6 additional necrotic damage. They may do nothing to avoid extra damage. Choice-based penalty - not binary lockdown.",
            mechanicsText: "2d6 necrotic damage each time target moves, attacks, or casts (3 rounds)",
          },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      tags: ["aoe", "choice_based", "control", "necrotic"],
    },

    { id : "dc_eternal_agony",
      name: "Eternal Agony",
      description:
        "You plant a seed of psychic ruin behind their eyes. It germinates. It blooms. It rots. By the third dawn they will beg for the silence that comes after. Your own nose bleeds from the effort of holding their skull open.",
      level: 6,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      effectTypes: ["damage"],
      typeConfig: {
        school: "psychic",
        icon: "Necrotic/Necrotic Skull",
        tags: ["damage", "psychic", "dot", "escalating", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 22 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A whispered countdown — three, two, one — each number heavier than the last.",
        somaticText: "Press your thumb to the target's brow, planting the seed of psychic ruin.",
        useFormulas: { health: true },
        resourceFormulas: { health: "1d10" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "1d6",
        damageTypes: ["psychic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "round_number x 1d6",
          damageType: "psychic",
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "reduced_duration",
        },
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: true,
            conditionalFormulas: {
              round_1: "1d6",
              round_2: "2d6",
              round_3: "3d6",
              default: "1d6",
            },
          },
        },
      },
      tags: ["damage", "psychic", "dot", "escalating", "blood magic"],
    },

    // LEVEL 7 SPELLS (2)

    { id : "dc_necrotic_storm",
      name: "Necrotic Storm",
      description:
        "You become the eye of a hurricane of rot. The storm does not ask permission. It does not negotiate. It consumes, and you are its gateway. The longer you hold it open, the more of you it eats. This is a door that only closes from the outside.",
      level: 7,
      spellType: "CHANNELED",
      icon: "Void/Black Hole",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["aoe", "channeled", "dot", "debuff"],
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
      resourceCost: {
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 25 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A sustained, shuddering moan — the sound of a body pushed past endurance.",
        somaticText: "Raise both arms overhead, dark energy spiraling outward as a hurricane of rot.",
        useFormulas: { health: true },
        resourceFormulas: { health: "5d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      channelingConfig: {
        type: "power_up",
        maxDuration: 3,
        durationUnit: "rounds",
        interruptible: true,
        movementAllowed: false,
        costValue: 1,
        costType: "health",
        costTrigger: "per_turn",
        perRoundFormulas: {
          dot_damage: [
            { round: 1, formula: "4d6", description: "4d6 necrotic to all enemies in area" },
            { round: 2, formula: "6d6", description: "6d6 necrotic to all enemies in area" },
            { round: 3, formula: "8d6", description: "8d6 necrotic to all enemies in area" },
          ],
        },
      },
      damageConfig: {
        formula: "4d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "4d6",
          damageType: "necrotic",
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "storm_weakening",
            name: "Necrotic Storm",
            description: "-2 to all saving throws while within the storm area.",
            mechanicsText: "-2 to all saving throws while in the storm area (3 rounds)",
          },
        ],
        statPenalties: [
          { stat: "all_saving_throws", magnitude: -2, magnitudeType: "flat" },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
      },
      tags: ["aoe", "channeled", "dot", "debuff"],
    },

    { id : "dc_apex_predator",
      name: "Apex Predator",
      description:
        "You shed your skin and wear the darkness instead. Something ancient and hungry moves through your limbs. You can see in the dark because the dark is inside you now. The predator does not serve you. You are its host. It feeds on your blood even as it hunts through your hands.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Ghostly Menace",
      effectTypes: ["transformation", "buff", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ghostly Menace",
        tags: ["transformation", "stealth", "buff", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"],
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 25, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A predator's hiss — inhuman, instinctive, hungry.",
        somaticText: "Draw your arms across your body, shedding your form as darkness pours in to replace it.",
        useFormulas: { health: true },
        resourceFormulas: { health: "4d8" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      triggerConfig: {
        triggers: [
          { id : "predator_drain",
            name: "Predator's Toll",
            triggerType: "start_of_turn",
            action: "Lose 5 HP at the start of each turn. The form feeds on your life force.",
          },
          { id : "predator_blood_sacrifice",
            name: "Blood Sacrifice",
            triggerType: "on_cast",
            action: "Sacrifice 4d8 HP and 6 Blood Tokens. Generate Blood Tokens equal to HP lost.",
          },
        ],
      },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 10,
        durationUnit: "minutes",
        power: "major",
        newForm: "Apex Predator",
        description: "Become a predator of shadow. Invisible, fast, lethal - but the form drinks your blood.",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "predator_stealth",
            name: "Shadow Mantle",
            description: "+3 Stealth, +10 Movement Speed, Invisibility to enemies.",
            mechanicsText: "+3 Stealth, +10 ft speed, invisible to enemies (10 minutes)",
            statModifier: {
              stat: "movement_speed",
              magnitude: 10,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        canBeDispelled: false,
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "predator_hunger",
            name: "Predator's Hunger",
            description: "Lose 5 HP at the start of each turn. The form feeds on you.",
            mechanicsText: "Lose 5 HP at the start of each turn (10 minutes)",
          },
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        canBeDispelled: false,
      },
      tags: ["transformation", "stealth", "buff", "blood magic"],
    },

    // LEVEL 8 SPELLS (3)

    { id : "dc_judgment_day",
      name: "Judgment Day",
      description:
        "The sky cracks open like a scab. A rain of black fire descends on everything within reach. Their life force boils upward and funnels into your open mouth. You drink the battlefield dry and still you are thirsty. This is not a spell. It is a verdict.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Ebon Death",
      effectTypes: ["damage", "healing"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ebon Death",
        tags: ["aoe", "damage", "vampiric", "blood magic"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 40 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "self",
        },
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 28, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A verdict spoken in a voice not your own — ancient, hollow, absolute.",
        somaticText: "Throw your head back and spread your arms as black fire rains from above, life force streaming into you.",
        useFormulas: { health: true },
        resourceFormulas: { health: "6d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "12d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 18,
          saveOutcome: "half_damage",
        },
      },
      healingConfig: {
        formula: "12d6",
        healingType: "vampiric",
        resolution: "DICE",
      },
      tags: ["aoe", "damage", "vampiric", "blood magic"],
    },

    { id : "dc_shadow_ascendant",
      name: "Shadow Ascendant",
      description:
        "You dissolve. Not into mist - into absence. Your body becomes a wound in reality. You are less than a ghost. You are the shadow that the ghost casts. Nothing can reach you because nothing wants to. Nothing can heal you because there is nothing left to mend.",
      level: 8,
      spellType: "ACTION",
      icon: "Void/Consumed by Void",
      effectTypes: ["transformation", "buff", "utility", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "defensive", "mobility", "curse"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 28, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Nothing — complete silence. Your voice has left the air.",
        somaticText: "Fold inward, your form dissolving into absence, leaving only a dark stain where you stood.",
        useFormulas: { health: true },
        resourceFormulas: { health: "6d8" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      triggerConfig: {
        triggers: [
          { id : "shadow_healing_block",
            name: "Shadow Isolation",
            triggerType: "passive",
            action: "Cannot be healed by any source while transformed. You exist beyond flesh.",
          },
          { id : "shadow_blood_sacrifice",
            name: "Blood Sacrifice",
            triggerType: "on_cast",
            action: "Sacrifice 6d8 HP and 6 Blood Tokens. Generate Blood Tokens equal to HP lost.",
          },
        ],
      },
      transformationConfig: {
        transformationType: "elemental",
        targetType: "self",
        duration: 1,
        durationUnit: "minutes",
        power: "major",
        newForm: "Shadow Ascendant",
        description: "Become an entity of pure shadow. Physically reduced, immaterial, unhealable.",
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "shadow_reduction",
            name: "Shadow Form",
            description: "Physical damage taken reduced by 50%. Gain 30ft Shadow Step (no line of sight required).",
            mechanicsText: "50% physical damage reduction + 30 ft Shadow Step (no LoS)",
            statModifier: {
              stat: "physical_damage_taken",
              magnitude: -50,
              magnitudeType: "percentage",
            },
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        canBeDispelled: true,
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "shadow_step",
            name: "Shadow Step",
            distance: 30,
            needsLineOfSight: false,
            description: "Teleport up to 30 feet through shadows.",
          },
          { id : "wall_phasing",
            name: "Wall Phasing",
            description: "Pass through non-magical barriers.",
          },
        ],
        duration: 1,
        durationUnit: "minutes",
        power: "major",
      },
      debuffConfig: {
        debuffType: "curse",
        effects: [
          { id : "shadow_curse",
            name: "Shadow Curse",
            description: "Cannot be healed by any source while transformed. You are beyond flesh.",
            mechanicsText: "Cannot be healed by any source while transformed (1 minute)",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        canBeDispelled: false,
      },
      tags: ["transformation", "defensive", "mobility", "curse"],
    },

    { id : "dc_blood_frenzy",
      name: "Blood Frenzy",
      description:
        "You stop feeling pain because pain has become the point. Your blood sings. Every nerve is a furnace. You are not berserk - you are precisely, surgically insane. The frenzy does not end because you want it to. It ends when your body gives out. There is no off switch. There is only the next heartbeat and the one after that.",
      level: 8,
      spellType: "STATE",
      icon: "Necrotic/Drain Soul",
      effectTypes: ["buff", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Drain Soul",
        tags: ["state", "buff", "self_harm", "frenzy"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 28, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "A howl of abandon — reason burned away, only hunger remains.",
        somaticText: "Clutch your chest and tear outward, the frenzy igniting like a furnace in your veins.",
        useFormulas: { health: true },
        resourceFormulas: { health: "7d6" },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      triggerConfig: {
        triggers: [
          { id : "frenzy_hp_drain",
            name: "Frenzy Drain",
            triggerType: "start_of_turn",
            action: "Lose 2d6 HP at the start of each turn. Cannot end voluntarily.",
          },
          { id : "frenzy_blood_sacrifice",
            name: "Blood Sacrifice",
            triggerType: "on_cast",
            action: "Sacrifice 7d6 HP and 6 Blood Tokens. Generate double Blood Tokens while Frenzy is active.",
          },
        ],
      },
      buffConfig: {
        buffType: "damageIncrease",
        effects: [
          { id : "frenzy_damage",
            name: "Blood Frenzy",
            description:
              "+3d6 necrotic damage to all spells. Double Blood Token generation rate. You are a furnace that burns its own walls.",
            mechanicsText: "+3d6 necrotic to all spells, double Blood Token generation",
            statModifier: {
              stat: "bonus_damage",
              magnitude: "3d6",
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "frenzy_drain",
            name: "Frenzy Drain",
            description:
              "Lose 2d6 HP at the start of each turn. Cannot end voluntarily - only ends when combat ends or you reach 0 HP.",
            mechanicsText: "2d6 HP drain per turn; cannot end until combat ends or HP reaches 0",
          },
        ],
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds",
        canBeDispelled: false,
      },
      tags: ["state", "buff", "self_harm", "frenzy"],
    },

    // LEVEL 9 SPELLS (2)

    { id : "dc_necrotic_apocalypse",
      name: "Necrotic Apocalypse",
      description:
        "You crack the world open like an egg. What pours out is not magic - it is the opposite of magic. It is the memory of death before life existed. Everything it touches remembers how to stop. The land will not recover. Neither will you.",
      level: 9,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["aoe", "damage", "dot", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "bloodTokens"],
        resourceValues: { mana: 32, bloodTokens: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "The end spoken as a fact — not a threat, not a promise, a certainty.",
        somaticText: "Drive both fists into the ground, necrotic energy erupting outward in a widening cataclysm.",
        useFormulas: { health: true },
        resourceFormulas: { health: "8d6" },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      triggerConfig: {
        triggers: [
          { id : "apocalypse_dot",
            name: "Necrotic Fallout",
            triggerType: "start_of_turn",
            action: "All enemies in area take 6d6 necrotic damage per round for 3 rounds.",
          },
          { id : "apocalypse_blood_sacrifice",
            name: "Blood Sacrifice",
            triggerType: "on_cast",
            action: "Sacrifice 8d6 HP and 6 Blood Tokens. Generate Blood Tokens equal to HP lost.",
          },
        ],
      },
      damageConfig: {
        formula: "15d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "6d6",
          damageType: "necrotic",
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
      },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "apocalyptic_weakening",
            name: "Apocalyptic Weakening",
            description: "-5 to all resistances for 1 minute. The rot is thorough.",
            mechanicsText: "-5 to all resistances for 10 rounds (Con save negates)",
          },
        ],
        statPenalties: [
          { stat: "all_resistances", magnitude: -5, magnitudeType: "flat" },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "negates",
        },
        durationType: "rounds",
        durationValue: 10,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      tags: ["aoe", "damage", "dot", "debuff"],
    },

    { id : "dc_void_hunter",
      name: "Void Hunter",
      description:
        "You offer the void a piece of yourself - not temporarily. Forever. The void accepts. It always accepts. You move through the world like a blade through silk. The walls do not stop you because you are no longer entirely real. The HP you lost is the price. The void does not give change.",
      level: 9,
      spellType: "ACTION",
      icon: "Void/Consumed by Void",
      effectTypes: ["transformation", "buff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "mobility", "permanent_cost"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "bloodTokens"],
        resourceValues: { mana: 32, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "A syllable that does not belong to any language — the void's true name.",
        somaticText: "Step sideways through nothing, reality peeling away as you pass through it.",
        useFormulas: { health: true, permanentHealth: true },
        resourceFormulas: { health: "8d8", permanentHealth: "2d10" },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "phaseshift",
        targetType: "self",
        duration: 10,
        durationUnit: "minutes",
        power: "major",
        newForm: "Void Hunter",
        description:
          "Phase through walls. +20 movement. +5 attack. The permanent HP cost is real and irreversible.",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "void_speed",
            name: "Void Speed",
            description: "+20 Movement Speed. Phase through non-magical walls.",
            mechanicsText: "+20 ft movement, phase through non-magical walls (10 minutes)",
            statModifier: {
              stat: "movement_speed",
              magnitude: 20,
              magnitudeType: "flat",
            },
          },
          { id : "void_precision",
            name: "Void Precision",
            description: "+5 to all attack rolls.",
            mechanicsText: "+5 to all attack rolls (10 minutes)",
            statModifier: {
              stat: "attack",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        canBeDispelled: false,
      },
      tags: ["transformation", "mobility", "permanent_cost"],
    },

    // LEVEL 10 SPELLS (2)

    { id : "dc_necrotic_armageddon",
      name: "Necrotic Armageddon",
      description:
        "This is not a spell. This is an amputation. You cut the world's connection to magic itself. The wound is permanent. Everything within a hundred feet - allies, enemies, the ground beneath your feet - feels the severance. Reality screams. You scream louder. Some doors only open outward.",
      level: 10,
      spellType: "ACTION",
      icon: "Void/Black Hole",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        tags: ["aoe", "damage", "anti_magic", "permanent_cost"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 100 },
        targetRestrictions: ["enemy"],
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "bloodTokens"],
        resourceValues: { mana: 36, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "The last word ever spoken — final, absolute, severing.",
        somaticText: "Bring your palms together and crack them apart, splitting the air like a fractured mirror.",
        useFormulas: { health: true, permanentHealth: true },
        resourceFormulas: { health: "10d6", permanentHealth: "2d10" },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "18d6",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        savingThrow: {
          ability: "charisma",
          difficultyClass: 20,
          saveOutcome: "negates",
        },
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id : "magic_severance",
            name: "Magic Severance",
            description:
              "All magic is suppressed in the area for 1 hour. Reality rejects the arcane. Spells cannot be cast. Enchantments wane.",
            duration: 1,
            durationUnit: "hours",
          },
        ],
        power: "major",
      },
      tags: ["aoe", "damage", "anti_magic", "permanent_cost"],
    },

    { id : "dc_blood_god_incarnate",
      name: "Blood God Incarnate",
      description:
        "You stop being a person who uses blood magic and become blood magic itself. Your veins are necrotic rivers. Your heartbeat is a curse. Your allies cannot heal you because there is nothing left to heal - you are a force of nature given form. This is not transformation. This is apotheosis. The max HP you sacrifice is gone forever. You will not get it back. What you gain in return is the ability to make everything else in the room share your condition.",
      level: 10,
      spellType: "ACTION",
      icon: "Void/Consumed by Void",
      effectTypes: ["transformation", "buff", "debuff"],
      typeConfig: {
        school: "necrotic",
        icon: "Void/Consumed by Void",
        tags: ["transformation", "permanent", "buff", "curse"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      resourceCost: {
        resourceTypes: ["mana", "health", "permanentHealth", "bloodTokens"],
        resourceValues: { mana: 36, bloodTokens: 6 },
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "No words — just a pulse. A heartbeat that the room feels.",
        somaticText: "Open your arms and let the transformation consume you, blood magic replacing flesh with purpose.",
        useFormulas: { health: true, permanentHealth: true },
        resourceFormulas: { health: "10d10", permanentHealth: "3d8" },
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 0,
        durationUnit: "permanent",
        power: "major",
        newForm: "Blood God Incarnate",
        description:
          "Permanent transformation. You are blood magic incarnate. Immune to necrotic. All spells enhanced. Cannot be healed by others. Forever.",
      },
      buffConfig: {
        buffType: "damageIncrease",
        effects: [
          { id : "blood_god_power",
            name: "Blood God's Wrath",
            description: "+3d6 necrotic damage to all spells. Double Blood Token generation. Immune to necrotic damage.",
            mechanicsText: "+3d6 necrotic to all spells, 2× Blood Token generation, necrotic immunity (permanent)",
            statModifier: {
              stat: "bonus_damage",
              magnitude: "3d6",
              magnitudeType: "flat",
            },
          },
        ],
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent",
        canBeDispelled: false,
      },
      debuffConfig: {
        debuffType: "curse",
        effects: [
          { id : "blood_god_curse",
            name: "Blood God's Isolation",
            description:
              "Cannot be healed by any source other than your own life drain effects. You are beyond the reach of clerics, potions, and mercy. This is permanent.",
            mechanicsText: "Cannot be healed except by own life drain (permanent)",
          },
        ],
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent",
        canBeDispelled: false,
      },
      tags: ["transformation", "permanent", "buff", "curse"],
    },

      {
        "id": "dc_ethereal_gossip",
        "name": "Ethereal Gossip",
        "description": "Summon a tiny, harmless wisp of glowing green soulfire. The spirit cannot fight, but it whispers local rumors, the names of those buried nearby, or the lingering emotional residues left in the soil.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Necrotic/Spirit",
        "typeConfig": {
          "school": "shadow",
          "icon": "Necrotic/Spirit",
          "tags": [
            "utility",
            "roleplay",
            "deathcaller"
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
            "mana": 5
          },
          "components": [
            "verbal",
            "somatic"
          ],
          "verbalText": "Audite, umbrae locales...",
          "somaticText": "Rub bone dust between your palms, letting the heat of your hands ignite a pale green spark"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "perception",
          "selectedEffects": [
            {
              "id": "ethereal_gossip_effect",
              "name": "Wisp Whispers",
              "description": "A floating soulfire wisp reveals general historical facts, names, or rumors about the local graveyard or ruins."
            }
          ],
          "duration": 10,
          "durationUnit": "minutes",
          "concentration": false,
          "power": "minor"
        },
        "cooldownConfig": {
          "cooldownType": "turn_based",
          "cooldownValue": 0
        },
        "tags": [
          "utility",
          "roleplay",
          "deathcaller"
        ]
      },
  ],
};

export default DEATHCALLER_DATA;
