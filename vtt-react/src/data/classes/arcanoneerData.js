/**
 * Arcanoneer Class Data
 *
 * Complete class information for the Arcanoneer - a master of elemental sphere combination
 * inspired by Magicka's dynamic spell crafting system.
 */

export const ARCANONEER_DATA = {
  id: "arcanoneer",
  name: "Arcanoneer",
  icon: "fas fa-atom",
  imageIcon: "/assets/icons/classes/arcanoneer.png",
  role: "Magi-ballistic Mutilator (Damage/Utility -- Zero Healing)",
  damageTypes: [
    "arcane",
    "radiant",
    "necrotic",
    "fire",
    "frost",
    "nature",
    "chaos",
    "force",
    "lightning",
  ],

  // Overview section
  overview: {
    title: "The Arcanoneer",
    subtitle: "The Magi-ballistic Mutilator",

    quickOverview: {
      title: "Quick Overview",
      content: `**What You Need to Know**: You are a Magi-ballistic Mutilator. A massive, super-heated cylinder of pig-iron is grafted directly to your forearm, the skin scorched and bonded to the metal. Every turn, you gouge out your own crystallized blood and soul-shards — rolling 4d8 to generate volatile ballistic spheres (Arcane, Radiant, Necrotic, Fire, Frost, Nature, Chaos). You slam two of these essences into the cylinder to chamber a volatile shell. Fire + Frost shatters from the barrel as a flesh-scorching steam vent, while Fire + Fire kicks back with a rib-shattering inferno blast.

**Recoil and Pain**: Firing this weapon shatters your own ribs and tears your flesh. You do not cast safe spells; you trigger explosive detonations that demand a toll in blood and bone. This constant self-mutilation is mechanically mandatory across all firing profiles.

**The Recoil Anchor**: The sheer kinetic force of discharging your forearm sleeve reduces your movement speed to 0 for the turn whenever you fire a spell. You must anchor yourself to fire.

**The Chamber Flush**: Should your forearm chambers jam with catastrophic elemental RNG, you can execute a "Chamber Flush" action, costing Mana and AP, to gouge out alternate crystallized blood-shards from your arm, discarding all rolled spheres and rerolling your 4d8 grid.

**Core Loop**: Roll 4d8 to forge crystallized blood-shards → Chamber spheres into your iron cylinder → Choose a firing profile Action (Mutilate, Shield, Infuse, Rupt, or Snare) → Combine two essences to chamber a shell → If you've learned a Recipe, fire it instead for devastating, rib-cracking power.

**Resource**: Elemental Spheres (random each turn, forged from your own blood, bankable during combat, lost when combat ends) + Mana + Your Own Health (Recoil).`,
    },

    description: `The Arcanoneer doesn't cast elegant spells. They pull the trigger on a massive, skin-searing iron chassis bolted directly to their skeletal frame. Each shell is loaded with raw, crystallized blood and soul-shards. They chamber the volatile spheres and ignite them, shattering their own ribs with the recoil to mutilate their targets.

Every Arcanoneer carries an instinctive knowledge of the **Combination Matrix** — the 36 fundamental ballistic reactions that occur when two elemental spheres are chambered together. Fire + Frost = Steam Vent. Necrotic + Nature = Grisly Veil. Radiant + Radiant = Radiance. These combinations are predictable, repeatable, and always available. The clinical "Healing" sphere is entirely gone; in its place is "Nature" — raw compressed flesh, bone grafts, and blood sutures used to knit tissue at a painful biological tax.

But raw combination is only the beginning. Through study and practice, Arcanoneers learn **Recipes** — refined formulas that supercharge specific combinations. A novice combining Fire + Frost gets basic Steam: some damage, some mist. A master who has learned the *Steam Burst* recipe gets a pressurized cone of superheated vapor that blinds and scorches everything in its path.

The Arcanoneer's true power emerges at higher levels, when they unlock **3-sphere and 4-sphere Recipes** — complex combinations that produce effects no two-sphere reaction can match. These require patience, banking spheres across multiple turns, and careful planning. But when the moment arrives and you unleash *Elemental Maelstrom* with four banked spheres... the battlefield reshapes itself around your will.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `Arcanoneers are Magi-ballistic Mutilators — soot-stained, iron-grafted survivors who have surrendered their own bodies to the recoil of pure iron. They do not carry books; they carry heavy wrenches to tighten the iron straps on their shoulders, and their skin is covered in circular chemical burns where crystallized blood-shards have been gouged out to forge ammunition.

In roleplay, Arcanoneers carry heavy canisters filled with black powder and raw, blood-slicked crystal fragments, and they argue with other spellcasters about whether Fire + Necrotic should be called "Hellfire" or "Umbral Ignition" (it's Hellfire, and they will die on this hill).

Common Arcanoneer archetypes:
- **The Pig-Iron Grafted**: Bolted directly to their massive cannon, their flesh is permanently scarred and scorched.
- **The Blood-Shard Forger**: Gouges out their own crystallized blood to create highly volatile ammunition.
- **The Bone-Shatterer**: Embraces the bone-cracking recoil of high-sphere recipes, considering the pain a fair price for ultimate power.
- **The Ballistic Alchemist**: Obsessed with combining the most violent elements to see what kind of kinetic carnage they can unleash.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Visceral, high-recoil, adaptive damage dealer

**Why Bring Me? (The Arcanoneer's Promise)**: You are the ultimate cover-shattering, screen-clearing siege master. Your pig-iron sleeve can fire any combination of raw elements, giving you unparalleled versatility to obliterate enemy defenses, destroy defensive cover, and clear groups from extreme range.

**How You Fight**:
1. **Roll your spheres** (4d8, or 5d8 for Entropy Weavers) to extract volatile blood-shards.
2. **Read your hand** — What ammo is loaded? What recipes can you chamber?
3. **Decide**: Pull the trigger now with what you have, or bank spheres to chamber a larger shell?
4. **Execute** — Fire the cannon, pay the mana, accept the mandatory recoil self-damage, and reduce your movement speed to 0.

**Strengths**:
- Unmatched versatility: can produce ANY damage type to exploit enemy weaknesses.
- Dual damage types on mixed combos (Fire+Frost hits both fire-weak AND frost-weak enemies).
- Powerful cover-shattering siege detonations.
- Nature combos provide defensive and support utility (Nature+Nature for gristle blockades, Nature+Radiant for slag-sutures).
- Chaos combos provide wild swing potential (high risk, high reward).

**Weaknesses**:
- RNG-dependent — bad rolls mean suboptimal ammunition.
- Recoil Anchor — firing any spell reduces your movement speed to 0 for the turn.
- Mandatory Recoil Tax — standard firing profiles and recipes drain your own HP, while high-sphere recipes erode your max HP.
- Zero clinical healing -- you manipulate flesh and gristle at a health cost, but you cannot restore HP without a dark biological toll.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `**The Moment-to-Moment**:

Every turn begins with the sound of bones grinding as you roll 4d8 and watch your crystallized blood-shards appear.

**Turn 1 — The Hand You're Dealt**

You roll: Fire, Fire, Frost, Nature. Your mind races through the matrix:
- Fire + Fire = *Combustion Shell* (single target fire damage)
- Fire + Frost = *Steam Vent* (cone of mixed damage + blind)
- Fire + Nature = *Cauterizing Slag* (burn away one debuff, deals fire damage to ally)
- Frost + Nature = *Rime-Frozen Graft* (+3 Armor for 3 rounds)

Do you have Recipes for any of these? If you've learned *Steam Burst*, then Fire + Frost suddenly adds a blinding cone effect. If you've learned *Firestorm*, then Fire + Fire adds a massive AoE burning vortex.

**Turn 2 — Banking for Power**

You banked all 4 spheres from Turn 1. Now you roll Arcane, Necrotic, Nature, Chaos. You have 8 spheres total. Suddenly you can:
- Cast a 2-sphere combo AND still have 6 spheres left
- Start building toward a 3-sphere Recipe (need 1 more turn of banking)
- Cast multiple 2-sphere combos if you have the action points

**The Core Tension**: Spend now for immediate impact and pay the immediate recoil tax, or bank for devastating multi-sphere Recipes later that will crack your bones and erode your max HP? There is no wrong answer — only the answer that wins this particular fight.

**Where Mastery Lives**:
- Knowing the 36 matrix combos by heart (or at least the ones relevant to your spec)
- Recognizing when your rolled spheres match a Recipe you've learned
- Managing your sphere bank like a hand of cards — planning two turns ahead
- Managing your remaining health pool against the devastating recoil of your own arm.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Ambush at Grimhollow Bridge",
      content: `**The Setup**: Your party is crossing a stone bridge over a ravine when three bandits drop from the trees. A fourth — their leader — stands at the far end, chanting. Your fighter charges. Your cleric holds the line. You stand at the center, your pig-iron forearm grafting hissing with heat, ready to fire.

**You are a Level 4 Arcanoneer** with 34 mana. You regenerate 4 mana per turn. You've learned Abyssal Maw and carry three Level 1-2 Recipes: Marrow-Piercing Slug, Rime-Iron Clasp, and Superheated Steam Vent.

**Turn 1 — The Opening Discharge** *(2 AP available, 34 mana)*

*You dig your fingers into your forearm, gouging out four crystallized blood-shards...*

**Roll 4d8**: [4, 4, 5, 7] → Fire, Fire, Frost, Nature

*Two jagged, red-glowing shards of flame feed into the first chamber. A shard of freezing rime goes into the second, and a rusted crimson sphere of nature waits in the reserve. The iron cylinder hums, its surface searing.*

**Your Mind Races**: Three bandits, clustered together. You have the Recipe: **Superheated Steam Vent** (Fire + Frost). Using the **Area** action (7 mana + 1d6 HP recoil), you vent a 20ft cone of flesh-scorching steam.

*You slam the fire and ice shards into the main chamber. The pig-iron cylinder roars as the opposing forces react. A pressurized column of superheated steam erupts from the barrel, boiling the bandits' skin. The kinetic back-blast punches your shoulder, cracking your ribs (1d6 recoil damage) and anchoring you to the stone bridge (movement speed reduced to 0).*

**Result**: Cast **Superheated Steam Vent** via Area action. 1d8 + INT/4 fire+frost damage to all three bandits + Blinded. **Cost: 7 mana, 1d6 HP. Remaining: 27 mana, 1 AP. Movement: 0.** You bank the Fire and Nature spheres.

**Turn 2 — Chambering the Shell** *(2 AP available, 31 mana after regen)*

*The bandit leader finishes his chant. Dark energy swirls around his blade. The fighter is engaged — he can't reach the caster in time. It's down to you.*

**Roll 4d8**: [1, 3, 6, 8] → Arcane, Necrotic, Nature, Chaos

*Four more shards erupt: a violet sliver of force, a writhing necrotic shadow, a crackling nature spike, and a volatile chaos core.*

**Your Banked Spheres**: Fire, Nature (from Turn 1)
**Total Available**: Fire, Nature, Arcane, Necrotic, Nature, Chaos — 6 spheres

**The Decision**: You need to stop the leader, but your rolled elements are scattered and you want a massive payload. You bank all spheres into the reserve chambers, letting the iron cool slightly while preparing a massive blast. Since you didn't fire, you take no recoil damage and your movement is unaffected.

**Result**: No cast. **Cost: 0 mana, 0 HP. Remaining: 31 mana. AP: 2 unused (wasted).**

**Turn 3 — The Heavy Recipe Unleashed** *(2 AP available, 35 mana after regen)*

*The leader's blade glows with dark power. You raise your pig-iron arm, bracing your shoulder as the bones grind.*

**Roll 4d8**: [3, 3, 5, 2] → Necrotic, Necrotic, Frost, Radiant

*Two dark necrotic shards emerge. Perfect. You load them directly.*

**Your Total Spheres**: Fire, Nature, Arcane, Necrotic, Nature, Chaos, Necrotic, Necrotic, Frost, Radiant — 10 spheres.

*You select Necrotic + Necrotic. You unleash the Recipe: **Abyssal Maw**.*

*"Umbra Clausura!"*

*The pig-iron chassis shudders violently. Firing it sends a sickening crack through your collarbone (1d6 HP recoil damage) and anchoring you (movement speed 0). Skeletal jaws of living shadow erupt from the barrel, chewing through the leader's flesh and draining his strength.*

**Result**: Cast **Abyssal Maw** (Recipe-enhanced Necrotic + Necrotic). 2d8 + INT/3 necrotic + 1d6 necrotic DoT + target STR reduced by 2. **Cost: 14 mana, 1d6 HP. Remaining: 21 mana, 1 AP. Movement: 0.**

*The bandit leader staggers. Your fighter finishes him with a clean strike.*

With 1 AP remaining, you fire Arcane + Frost = **Crystal Shard** on a wounded bandit for extra damage.

**Result**: Cast **Crystal Shard** (1d8 + INT/4 force+frost, armor-piercing). **Cost: 5 mana, 1d4 HP. Remaining: 16 mana. AP: 0. Movement: 0.**

**Turn 4 — Back-Blast and Recovery** *(2 AP available, 20 mana after regen)*

*Only one bandit remains, wounded and cornered. Time to finish this. But you roll all Nature spheres!*

**Roll 4d8**: [7, 7, 7, 7] → Nature, Nature, Nature, Nature

*Four soft crimson spheres of marrow energy emerge. You are not helpless, but you need to support your fighter. You cast Grissle Blockade (Nature + Nature) via Buff action on the fighter, stitching together their wounds with compressed tissue and bone plates.*

**Result**: Fighter gained gristle armor. **Cost: 4 mana, 1d4 HP. Remaining: 12 mana.**

**The Lesson**: Being a Magi-ballistic Mutilator is not about having an elegant solution; it is about managing the kinetic chaos, bracing your bones against the recoil, knowing which volatile combinations to chamber, and paying the price in pain to erase your enemies. The master knows when to vent and when to discharge.`,
    },
  },

  primaryStat: "intelligence",
  secondaryStat: "spirit",

  // Character Creation
  characterCreation: {
    title: "Creating Your Arcanoneer",
    subtitle: "The Elemental Chemist",
    description: `The Arcanoneer is a class that rewards preparation and pattern recognition. You don't memorize spell lists — you learn a matrix of elemental combinations and collect Recipes that enhance specific pairings. Your power comes from reading what the dice give you and making the most of it.`,
    steps: [
      {
        step: 1,
        title: "Prioritize Intelligence",
        content:
          "Intelligence drives your combo damage (1d8 + INT/4 at base). Spirit drives your defensive combo potency. Decide: do you want to be a damage-focused combo caster, or a hybrid with shields and utility? Most Arcanoneers prioritize INT and treat defensive combos as a situational tool.",
      },
      {
        step: 2,
        title: "Choose Your Specialization",
        content:
          "Your specialization defines HOW you interact with spheres. **Prism Mage** for consistent, focused damage. **Entropy Weaver** for chaotic high-risk/high-reward swings. **Sphere Architect** for precise control and planning. This choice affects your entire playstyle.",
      },
      {
        step: 3,
        title: "Pick Your First 3 Recipes",
        content:
          "Choose from 5 Level 1 spells: Spark Bolt (arcane damage, pierces armor), Frost Touch (frost damage + slow + fragile), Spark Shield (arcane absorb shield), Arcane Missile (force damage, cannot miss), Nature Vine (nature damage + restraint). Recommend: 2 damage, 1 defensive.",
      },
      {
        step: 4,
        title: "Learn the d8 Element Table",
        content:
          "You will roll 4d8 every single turn. Memorize or screenshot the sphere generation table (1=Arcane, 2=Radiant, 3=Necrotic, 4=Fire, 5=Frost, 6=Nature, 7=Healing, 8=Chaos). Speed of recognition is your most important skill.",
      },
      {
        step: 5,
        title: "Understand the 5 Actions",
        content:
          "Every 2-sphere combo must be cast through one of 5 Actions: Attack (single target), Defend (barrier), Buff (weapon enchant), Area (AoE), or Trap (placed zone). Each has a different mana cost (4-7) and effect shape. The Action determines HOW your combo delivers its effect.",
      },
    ],
    startingEquipment: {
      weapon: "Arcane Focus (dagger, orb, or staff — your choice)",
      armor: "Light armor (no spell failure chance)",
      items: [
        "Spell notebook with Combination Matrix printed on the inside cover",
        "Set of 4d8 dice (one set in each of 4 colors for easy reading)",
        "8 colored glass tokens (one per element) for tracking banked spheres",
        "Pencil and eraser for noting learned Recipes",
        "Traveler's kit (bedroll, rations, rope, torches)",
      ],
      gold: 15,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Sphere Generation & Elemental Combination",
    subtitle: "Dynamic Spell Crafting System",
resourceSystem: {
    title: "The Forearm Graft & Shard Chambers",
    description: `The Arcanoneer uses a specialized resource system centered around a massive iron sleeve grafted directly to the arm, loaded with crystallized shards of the caster's own blood.

**Visual Representation**:
- **Arcane Spheres**: Purple orbs of pure, humming force
- **Radiant Spheres**: Golden orbs of searing, white-hot light
- **Necrotic Spheres**: Pitch-black orbs of writhing, necrotic darkness
- **Fire Spheres**: Red-orange orbs of sputtering, explosive heat
- **Frost Spheres**: Pale blue orbs of jagged rime and frost crystals
- **Nature Spheres**: Green orbs crackling with thunderous ozone static
- **Chaos Spheres**: Iridescent, shifting orbs of unstable, morphing energy

**How It Changes Each Turn**:
- **Turn Start**: 4 new spheres appear (from your 4d8 roll)
- **When Casting**: Spent spheres disappear from the cylinder
- **When Banking**: Unused spheres remain visible, accumulating over turns (max **12 banked**)
- **Overflow**: If rolling would exceed 12, you choose which new spheres to keep. Excess are lost.
- **Combat End**: All spheres vanish — the graft vents and cools down
- **The Recoil Anchor**: Discharging the heavy cannon is so violent that your movement speed is reduced to 0 for the turn whenever you cast a spell.

**Reading the Bar at a Glance**: The cylinder bar represents your active ammunition. A cylinder full of Fire spheres indicates pure explosive potential. A diverse mix suggests high utility. You must constantly analyze what matrix combos and Recipes your current bank can feed. With 36 combinations and learned Recipes, managing your bank becomes a deadly calculus.`,
    },

    mechanics: {
      title: "How It Works",
      sections: [
        {
          type: "step",
          stepNumber: 1,
          title: "Roll Spheres",
          subtitle: "Start of Turn",
          content: `Roll **4d8** (5d8 for Entropy Weavers). Each die produces one elemental crystallized blood-shard.`,
        },
        {
          type: "step",
          stepNumber: 2,
          title: "Bank or Spend",
          subtitle: "Your Choice",
          content: `Spheres persist until spent or combat ends (max **12 banked**). Bank for later or spend now.`,
        },
        {
          type: "step",
          stepNumber: 3,
          title: "Pick Action + Elements",
          subtitle: "Combine & Cast",
          content: `Choose an **action** (what shape) and your **spheres** (what elements). Cast and pay both mana and mandatory HP recoil. Firing anchors you, reducing movement speed to 0.`,
        },
      ],
      actionTable: {
        title: "Your 5 Firing Profiles",
        subtitle:
          "Pick one. Firing standard profiles deals mandatory recoil damage to you. Firing reduces your movement speed to 0 for the turn. Defensive actions bypass recoil.",
        actions: [
          {
            name: "Attack",
            icon: "crosshairs",
            spheres: "2",
            mana: "5",
            range: "30ft",
            target: "One enemy",
            damage: "1d8 + INT/4",
            note: "Recoil: 1d4 HP. Standard single-target ballistic blast.",
          },
          {
            name: "Defend",
            icon: "shield-alt",
            spheres: "2",
            mana: "6",
            range: "Self/Ally 30ft",
            target: "One creature",
            damage: "Absorbs level HP",
            note: "Recoil: 0 HP. The defensive shield absorbs the recoil shockwave completely.",
          },
          {
            name: "Buff",
            icon: "magic",
            spheres: "2",
            mana: "4",
            range: "Touch",
            target: "One weapon",
            damage: "+1d6 next hit",
            note: "Recoil: 1d4 HP. Infuses a weapon with the combo's elements.",
          },
          {
            name: "Area",
            icon: "burst",
            spheres: "2",
            mana: "7",
            range: "30ft center",
            target: "10ft radius",
            damage: "1d6 + INT/4 each",
            note: "Recoil: 1d6 HP. Vents the explosion in a wider area, shaking your frame.",
          },
          {
            name: "Trap",
            icon: "draw-polygon",
            spheres: "2",
            mana: "6",
            range: "30ft surface",
            target: "5ft zone",
            damage: "1d8 + INT/4",
            note: "Recoil: 1d6 HP. Seeds a mine of raw magical energy that lasts 1 minute.",
          },
        ],
      },
      chaosEffectsTable: {
        title: "Chaos Effects Table (Player Rolls d20)",
        subtitle:
          "The default resolution for Chaos combos. When a specific Chaos combo has its own random effect table (marked with ★ in the Combination Matrix), use that table instead of rolling here. If a Chaos combo has no specific table, roll on this d20 table.",
        headers: ["d20", "Effect"],
        rows: [
          ["1", "Fizzle — spell fails. Spheres spent, nothing happens."],
          [
            "2-3",
            "Minor Backlash — you take 1d4 chaos damage. Spell still resolves.",
          ],
          [
            "4-5",
            "Redirect — hits a random target within range (ally or enemy).",
          ],
          [
            "6-7",
            "Elemental Surge — +1d4 damage of a random element (roll d8).",
          ],
          ["8-9", "Lingering — minor effect lasts 1 extra round."],
          ["10-11", "Normal — resolves as expected. No bonus, no penalty."],
          [
            "12-13",
            "Double Effect — minor effect triggers twice (two saves, two pushes, etc.)",
          ],
          ["14-15", "Mana Feedback — recover 1d4 mana after resolving."],
          [
            "16-17",
            "Bouncing — Attack bounces to 1 extra target for half. Area gains +5ft radius.",
          ],
          [
            "18-19",
            "Empowered — damage dice explode (reroll and add max-value dice).",
          ],
          ["20", "Chaos Perfection — choose ANY effect from this table."],
        ],
      },
      singleSphereFallbacks: {
        title: "Single-Sphere Fallbacks & Emergency Venting",
        subtitle: "Leftover spheres or catastrophic RNG? Gouge your flesh or vent your chambers.",
        abilities: [
          {
            name: "Chamber Flush",
            cost: "3 Mana + 1 AP + 1d4 HP",
            type: "Utility / Emergency",
            description: "Gouge out alternate crystallized blood-shards from your forearm to discard all currently rolled spheres and reroll your 4d8 grid (5d8 if Entropy Weaver).",
          },
          {
            name: "Fling",
            cost: "1 Sphere + 2 Mana + 1 HP",
            type: "Attack",
            description: "1d4 damage of that element. 30ft. A minor shrapnel launch.",
          },
          {
            name: "Ward",
            cost: "1 Sphere + 3 Mana",
            type: "Reaction",
            description: "Grant resistance to that element for 1 round. (Absorbs recoil completely).",
          },
          {
            name: "Siphon",
            cost: "1 Sphere",
            type: "Resource",
            description: "Destroy sphere, recover 2 mana. Siphons minor blood-heat.",
          },
          {
            name: "Purge",
            cost: "2 Any + 4 Mana + 1d4 HP",
            type: "Utility",
            description: "Remove 1 debuff from self/ally. Touch range. Burns away curses by searing tissue.",
          },
        ],
      },
      baseVsRecipes: {
        title: "Why Learn Recipes?",
        subtitle: "Base combos are cantrips. Recipes are real spells.",
        baselineCan: [
          "Deal 1d8 + INT/4 per combo (only INT scales — die never grows)",
          "Apply minor 1-round effects (blind, slow, push)",
          "Choose any action type for any combo",
          "Cover every damage type",
        ],
        baselineCannot: [
          "DoT, stat reduction, persistent buffs, teleportation",
          "Scale beyond 1d8 + INT/4",
          "Anything lasting more than 1 round",
        ],
        recipeExamples: [
          {
            level: "Lv 1",
            name: "Chamber Flush",
            upgrade: "Emergency venting → Discard and reroll all active spheres",
          },
          {
            level: "Lv 2",
            name: "Superheated Steam Vent",
            upgrade: "Fire+Frost → 20ft cone (base Attack is single-target)",
          },
          {
            level: "Lv 3",
            name: "Marrow-Shatter Concussion",
            upgrade: "Arcane+Arcane → 10ft AoE + disorient (2d8 + INT/3)",
          },
          {
            level: "Lv 4",
            name: "Incinerating Slag-Shower",
            upgrade:
              "Fire+Fire → 15ft AoE + 1d6 fire DoT 2 rounds (2d8 + INT/3)",
          },
          {
            level: "Lv 5",
            name: "Thermobaric Burst",
            upgrade: "Fire+Frost → 10ft AoE (3d8 + INT/2)",
          },
          {
            level: "Lv 6",
            name: "Glacial Blessing",
            upgrade: "Frost+Nature+Radiant → +4 Armor + fire resist (Rime-Frozen Graft / no clinical healing)",
          },
          {
            level: "Lv 9",
            name: "Primal Cataclysm",
            upgrade: "All 8 elements → 18d6 damage (base Attack is 1d8)",
          },
        ],
      },
      comboTiers: {
        title: "Combination Tiers",
        tiers: [
          {
            name: "2-Sphere Matrix",
            sphereCost: "2",
            manaCost: "4-7",
            available: "Always",
            description:
              "Your cantrips. Pick an action, pick your elements, done. If you've learned a Recipe for that combo, spend its mana cost instead for the upgraded version.",
            highlight: true,
          },
          {
            name: "3-Sphere Recipe",
            sphereCost: "3",
            manaCost: "20-25",
            available: "Level 6+",
            description:
              "Recipe-only. Heavy ordnance — scaling dice, persistent effects, unique mechanics. Deals severe self-damage and erodes max HP.",
          },
          {
            name: "4-Sphere Recipe",
            sphereCost: "4",
            manaCost: "25-36",
            available: "Level 8+",
            description:
              "The big guns. Bank across turns. Battlefield-shaping power. Punishes your skeleton, dealing heavy self-damage and eroding max HP.",
          },
        ],
      },
      manaWarning:
        "Spheres + Mana. You need **both**. A full bank is useless without mana.",
      manaRegeneration: {
        title: "Mana Regeneration",
        content: `You have a **Mana Pool** equal to 10 + (Intelligence × 2). At the start of each turn, you regenerate mana equal to 2 + (Intelligence / 4, rounded down). Mana does NOT regenerate outside combat. Between fights, you must rest (short rest = 50% mana restored, long rest = full mana). The Siphon fallback (destroy 1 sphere → recover 2 mana) exists specifically for mana-starved turns.`,
      },
      actionPointsRule: {
        title: "Action Points",
        content: `You gain **2 Action Points (AP)** per turn. Most 2-sphere combos cost 1 AP. 3-sphere Recipes cost 1-2 AP. 4-sphere Recipes cost 2-3 AP. If you have the AP and the spheres, you can cast multiple combos in one turn.`,
      },
      fortuneRollRule: {
        title: "Fortune Rolls",
        content: `Some talents reference a **Fortune Roll** — roll 1d6. Odd (1, 3, 5) = **Red** (beneficial trigger). Even (2, 4, 6) = **Black** (no effect). Fortune rolls are free and do not cost an action.`,
      },
    },

    manaCostTable: {
      title: "Quick Cost Reference",
      headers: ["Action", "Spheres", "Mana"],
      rows: [
        ["Attack", "2", "5"],
        ["Defend", "2", "6"],
        ["Buff", "2", "4"],
        ["Area", "2", "7"],
        ["Trap", "2", "6"],
        ["Chamber Flush", "0", "3 (costs 1d4 HP + 1 AP)"],
        ["Fling (1 sphere)", "1", "2"],
        ["Ward (1 sphere)", "1", "3"],
        ["Purge", "2 any", "4"],
        ["Siphon", "1", "0 (gain 2)"],
        ["Recipe (2-sphere, Lv 1-2)", "2", "4-7"],
        ["Recipe (2-sphere, Lv 3-4)", "2", "10-14"],
        ["Recipe (2-sphere, Lv 5)", "2", "18"],
        ["Recipe (3-sphere)", "3", "20-25"],
        ["Recipe (4-sphere)", "4", "25-36"],
      ],
      footnote:
        "Max 12 banked spheres. All spheres lost when combat ends. You gain 2 Action Points per turn.",
    },

    sphereGenerationTable: {
      title: "Sphere Generation (Roll 4d8)",
      headers: ["d8 Roll", "Element", "Theme", "Primary Effects"],
      rows: [
        [
          "1",
          "Arcane",
          "Raw Magic",
          "Force damage, disorientation, magical effects",
        ],
        [
          "2",
          "Radiant",
          "Divine Light",
          "Radiant damage, blinding, stunning, protection",
        ],
        [
          "3",
          "Necrotic",
          "Darkness/Necrotic",
          "Necrotic damage, curses, life drain, debuffs",
        ],
        ["4", "Fire", "Flames", "Fire damage, burning, ignition, explosions"],
        ["5", "Frost", "Frost", "Frost damage, freezing, slowing, disorientation"],
        [
          "6",
          "Nature",
          "Storm & Growth",
          "Nature damage, lightning, vines, restraint, poison",
        ],
        [
          "7",
          "Flesh",
          "Compressed Flesh",
          "Suture flesh, create gristle barriers, cauterize, and manipulate biological tissue. Grimdark, visceral, and dark fantasy.",
        ],
        [
          "8",
          "Chaos",
          "Unpredictability",
          "Random effects, wild magic, variable damage",
        ],
      ],
    },

    strategicConsiderations: {
      title: "Strategic Considerations",
      content: `**When to Bank Spheres**:
- You rolled elements that don't match any Recipe you've learned
- You're 1-2 turns away from a powerful 3-sphere or 4-sphere Recipe
- Combat is stable enough to invest in a future power spike
- You're fishing for specific elements to complete a combination
- Overflow rule: If rolling would push you over your max, choose which new spheres to keep. Excess are lost.

**When to Spend Immediately**:
- Your rolled spheres match a Recipe you've learned — use the upgrade!
- The tactical situation demands action NOW (enemy is casting, group needs support)
- You're low on mana and can only afford cheap matrix combos
- You have more spheres than you need — spend the excess, bank the rest

**Reading Your Options**:
- **Pure combos** (Fire+Fire, Frost+Frost): Focused single-target damage. Reliable.
- **Opposing combos** (Fire+Frost, Radiant+Necrotic): Unique mixed effects. Steam, Twilight — these are the "chemistry" combos.
- **Nature combos** (Nature+Nature, Nature+X): Defensive and utility effects -- gristle blockades, rime-frozen grafts, sinew-spark leaps, slag-sutures.
- **Chaos combos** (Chaos+X): Wild swings. Use them when you're desperate or when the Entropy Weaver in you wants to gamble.

**The Multi-Cast Trick**: If you have the action points, you can cast TWO 2-sphere combos in one turn. Fire+Frost for Steam on the front line, then Nature+Nature for a Grissle Blockade on your flank. One turn, two spells, total battlefield control. This costs 10 mana and 2 AP — expensive, but devastating when it works.

**Advanced: The Banking Mathematics**:
- You generate 4 spheres per turn (5 for Entropy Weavers)
- Your bank holds a maximum of **12 spheres** (15 for Sphere Architects)
- A 3-sphere Recipe needs 3 specific spheres — might take 2-3 turns of banking
- A 4-sphere Recipe needs 4 specific spheres — might take 3-4 turns
- **Critical insight**: While banking, you can still cast with your OTHER spheres. Bank what you need, spend what you don't.
- **Overflow rule**: If rolling would push you over your max, choose which new spheres to keep. Excess are lost.`,
    },

    practicalExample: {
      title: "Practical Decision-Making Example",
      content: `**Scenario**: You're fighting a fire elemental (resistant to fire, weak to frost) and two goblin archers.

**Turn 1 Roll**: [4, 4, 5, 7] → Fire, Fire, Frost, Nature

**Rookie Mistake**: "Fire + Fire = Flame Burst! Maximum fire damage!"
- Result: Wasted spheres on a fire-resistant enemy. Your base matrix damage (1d8 + INT/4) barely tickles it.

**Smart Play**: "Frost + Nature = **Rime-Frozen Graft** on our tank. Give them +3 Armor for 3 rounds. Then bank the two Fire spheres — the goblins aren't fire-resistant."
- Result: Tank gets a grotesque, protective gristle graft. Fire spheres banked for next turn.

**Turn 2 Roll**: [1, 3, 6, 8] → Arcane, Necrotic, Nature, Chaos

**Your Bank**: Fire, Fire (from Turn 1)
**Total Available**: Fire, Fire, Arcane, Necrotic, Nature, Chaos (6 spheres)

**Decision Point**:
- **Option A**: Fire + Fire = **Flame Burst** on the goblins. Cheap (5 mana), decent damage, uses banked spheres effectively.
- **Option B**: Bank everything. Next turn, you might have the spheres for a 3-sphere Recipe.
- **Option C**: Arcane + Necrotic = **Void Bolt** on the fire elemental. Force + necrotic bypasses fire resistance.

**The Right Call**: Option A on the goblins (they're the immediate threat), then Option C on the fire elemental if you have the AP and mana. You can multi-cast — spend 4 spheres, 2 spells, one turn.

**The Lesson**: Don't just cast the biggest spell. Cast the RIGHT spell for the situation. Use the matrix to exploit enemy weaknesses. Use your Recipes when they match. And never waste spheres on resistant enemies.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `The Arcanoneer's sphere system translates beautifully to physical tabletop play. Here's everything you need.

**Required Materials**:
- **4d8 dice** (for sphere generation)
- **Colored tokens or glass beads** (8 colors, at least 4 of each)
- **A reference card** with the d8-to-element chart (see below)
- **A printed Combination Matrix** (see the 8×8 table below)

**Recommended Token Colors**:
- Arcane (1): Purple
- Radiant (2): Gold/Yellow
- Necrotic (3): Black
- Fire (4): Red
- Frost (5): Blue
- Nature (6): Green
- Chaos (8): Rainbow/Iridescent

**Turn-by-Turn Process**:
1. Roll 4d8
2. Take colored tokens matching each die result, place in your "Sphere Bank"
3. Check: do your tokens match any matrix combo? Any learned Recipe?
4. Remove spent tokens, pay mana and recoil, resolve the spell
5. Unused tokens stay banked for next turn

---

**THE COMBINATION MATRIX (Print This)**

All 36 two-sphere base combos. Cost varies by Firing Profile type (4-7 mana; see Action Table). Fixed damage: 1d8 + INT/4. Firing standard profiles inflicts recoil damage. Firing reduces your movement speed to 0.

| | Arcane | Radiant | Necrotic | Fire | Frost | Nature | Flesh | Chaos |
|---|---|---|---|---|---|---|---|---|
| **Arcane** | Arcane Pulse | Divine Bolt | Void Bolt | Arcane Flame | Crystal Shard | Thunderstrike | Visceral Cocoon | Wild Magic ★ |
| **Radiant** | → | Radiance | Twilight | Solar Flare | Aurora | Verdant Light | Crucible of Sinew | Chaos Light ★ |
| **Necrotic** | → | → | Dark Bolt | Hellfire | Frostbite | Blight | Grisly Veil | Entropy ★ |
| **Fire** | → | → | → | Flame Burst | Steam † | Wildfire | Cauterizing Slag | Chaos Flame ★ |
| **Frost** | → | → | → | → | Frost Spike | Hailstorm | Rime-Frozen Graft | Glitch Frost ★ |
| **Nature** | → | → | → | → | → | Storm Surge | Sinew-Spark Leap | Primal Chaos ★ |
| **Flesh** | → | → | → | → | → | → | Grissle Blockade | Amorphous Gristle Ward ★ |
| **Chaos** | → | → | → | → | → | → | → | Chaos Bolt ★ |

★ = Chaos combo — each has its own specific random effect table. If no specific table applies, roll on the general Chaos Effects d20 table instead.
† = Steam is a 20ft cone (only non-single-target base combo)

**Matrix Reading Guide** (use the upper-right triangle):
- Same row + column = pure pair (e.g., Fire row + Fire column = Flame Burst)
- Mixed = cross-reference (e.g., Fire row + Frost column = Steam)
- Arrow (→) = see the mirror entry (Fire+Frost and Frost+Fire are both Steam)

**Quick Effect Reference**:

| Combo | Damage Types | Key Effect |
|---|---|---|
| Arcane Pulse | Force | Single target damage |
| Radiance | Radiant | Single target + blind |
| Dark Bolt | Necrotic | Single target damage |
| Flame Burst | Fire | Single target damage |
| Frost Spike | Frost | Single target + slow |
| Storm Surge | Nature | Single target damage |
| Grissle Blockade | Force | Grotesque bone-gristle barrier, blocks movement 2 rounds |
| Chaos Bolt | Chaos | ★ Random effect |
| Divine Bolt | Force, Radiant | Cannot miss |
| Void Bolt | Force, Necrotic | Barrier-piercing |
| Arcane Flame | Force, Fire | Barrier-piercing fire |
| Crystal Shard | Force, Frost | Armor-piercing |
| Thunderstrike | Force, Nature | Lightning bolt |
| Visceral Cocoon | Force | Flesh-knit absorb shield (4d8) |
| Wild Magic | Chaos | ★ Random effect |
| Twilight | Radiant, Necrotic | Dual damage |
| Solar Flare | Radiant, Fire | Heavy burn |
| Aurora | Radiant, Frost | Damage + slow |
| Verdant Light | Radiant, Nature | Burning vines |
| Crucible of Sinew | Radiant | Remove all debuffs + 1d6 radiant/debuff |
| Chaos Light | Chaos | ★ Random effect |
| Hellfire | Necrotic, Fire | Necrotic flames |
| Frostbite | Necrotic, Frost | Rot + slow |
| Blight | Necrotic, Nature | Poison thorns |
| Grisly Veil | Necrotic | Absorb spell + reflect 50% necrotic |
| Entropy | Chaos | ★ Random effect |
| Steam | Fire, Frost | 20ft cone + blind |
| Wildfire | Fire, Nature | Burning vines |
| Cauterizing Slag | Fire | Remove 1 debuff + 2d6 fire damage to ally |
| Chaos Flame | Chaos | ★ Random effect |
| Hailstorm | Frost, Nature | 10ft AoE |
| Rime-Frozen Graft | Frost | +3 Armor for 3 rounds |
| Glitch Frost | Chaos | ★ Random effect |
| Sinew-Spark Leap | Nature | Teleport 15ft |
| Primal Chaos | Chaos | ★ Random effect |
| Amorphous Gristle Ward | Chaos | ★ Roll 1d4 defensive flesh effect |

---

**Quick Reference Card**:

\`\`\`
ARCANONEER — SPHERE GENERATION & RECOIL
Roll 4d8 each turn:
1 = Arcane (Purple)    5 = Frost (Blue)
2 = Radiant (Gold)     6 = Nature (Green)
3 = Necrotic (Black)   7 = Flesh (Crimson)
4 = Fire (Red)         8 = Chaos (Rainbow)

CORE MECHANIC: Firing reduce movement speed to 0.
RECOIL HP COST: Attack/Buff (1d4), Area/Trap (1d6).
Defend has 0 Recoil.
BASE COMBO COST: 5 mana
BASE COMBO DAMAGE: 1d8 + INT/4
RECIPE SCALING: Lv3-4 → 2d8+INT/3 | Lv5 → 3d8+INT/2
★ CHAOS COMBOS: Roll for random effect
MAX BANKED SPHERES: 12
\`\`\`

**Budget-Friendly Alternatives**:
- **No tokens?** Use different colored d6 dice as markers
- **No colored items?** Write tally marks on paper under each element name
- **Minimalist approach**: Just remember your banked spheres — the matrix becomes second nature after a few sessions

**Pro Tip for Physical Play**: Laminate the matrix table and use a dry-erase marker to circle your available combos each turn. This dramatically speeds up decision-making and helps new players learn the combinations faster.`,
    },
  },

  // Specializations
  specializations: {
    title: "Arcanoneer Specializations",
    subtitle: "Three Paths of Elemental Mastery",

    description: `Every Arcanoneer chooses one of three specializations that define how they approach the Combination Matrix. Each spec changes how you interact with your spheres, your matrix combos, and your Recipes — creating three dramatically different playstyles from the same 36-combo foundation.`,

    specs: [
      {
        id: "prism_mage",
        name: "Prism Mage",
        icon: "Fire/Fiery Bolt",
        color: "#FF4500",
        theme: "Pure Element Mastery",

        description: `Prism Mages obsess over elemental purity. While other Arcanoneers mix and match, Prism Mages perfect the art of the pure combo — Fire+Fire, Frost+Frost, Arcane+Arcane. They can reroll unwanted spheres to fish for their preferred element, and their pure-element matrix combos hit significantly harder. If you want consistency and the satisfaction of a perfectly focused build, this is your path.`,

        playstyle:
          "Pure element focus, rerolling spheres, elemental specialization, consistent damage",

        strengths: [
          "Can reroll spheres to get desired elements",
          "Pure element combos (Fire+Fire, Frost+Frost, etc.) deal +50% damage",
          "Gain resistance to your most-used element type",
          "More consistent and predictable than other specs",
          "Excellent against enemies weak to specific elements",
        ],

        weaknesses: [
          "Less versatile than other specs",
          "Struggles against enemies resistant to your favored elements",
          "Cannot leverage chaos and mixed-element synergies as well",
          "Rerolls cost 1 mana per sphere rerolled (unlimited uses)",
          "Limited by element availability",
        ],

        passiveAbilities: [
          {
            name: "Sphere Resonance",
            tier: "Path Passive",
            description:
              "When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.",
            sharedBy: "All Arcanoneers",
          },
          {
            name: "Elemental Purity",
            tier: "Specialization Passive",
            description:
              "You can reroll spheres to get desired elements (costs 1 mana per reroll). Pure element matrix combos (same element twice) deal 50% bonus damage. You gain resistance to the element type you've used most this combat. Your focus is narrow but devastating.",
            uniqueTo: "Prism Mage",
          },
        ],

        recommendedFor:
          "Players who want consistency, elemental specialization, and predictable power",
      },

      {
        id: "entropy_weaver",
        name: "Entropy Weaver",
        icon: "Void/Corrupted Eye",
        color: "#9400D3",
        theme: "Embrace Randomness",

        description: `Entropy Weavers don't fight the chaos — they weaponize it. They roll 5d8 instead of 4d8 (one extra sphere per turn), and every Chaos combo hits twice as hard. Where other Arcanoneers see Chaos spheres as a liability, Entropy Weavers see opportunity. If you want to be the most unpredictable, volatile, and potentially devastating Arcanoneer on the field, this is your path. Just... don't stand too close to your allies.`,

        playstyle:
          "High variance, chaos magic, wild magic surges, explosive unpredictability",

        strengths: [
          "Roll 5d8 for spheres instead of 4d8 (one extra sphere per turn)",
          "All Chaos combinations deal double damage",
          "Chaos sphere combos trigger Wild Magic Surge (roll on table)",
          "Can turn any sphere into Chaos (once per turn, costs 2 mana)",
          "Highest damage potential of all specs",
        ],

        weaknesses: [
          "Extremely unpredictable and unreliable",
          "Wild Magic Surges can backfire",
          "Cannot reroll or manipulate spheres",
          "Difficult to plan multi-turn strategies",
          "High risk, high reward playstyle",
        ],

        passiveAbilities: [
          {
            name: "Sphere Resonance",
            tier: "Path Passive",
            description:
              "When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.",
            sharedBy: "All Arcanoneers",
          },
          {
            name: "Chaos Mastery",
            tier: "Specialization Passive",
            description:
              "Roll 5d8 for sphere generation (instead of 4d8). All Chaos matrix combos deal double damage. When you use a Chaos sphere in any combination, roll on the Wild Magic Surge table for an additional random effect. Once per turn, you can convert any sphere to Chaos (costs 2 mana). Chaos is your weapon.",
            uniqueTo: "Entropy Weaver",
          },
        ],

        recommendedFor:
          "Players who enjoy high-risk gameplay, randomness, and explosive unpredictable power",
      },

      {
        id: "sphere_architect",
        name: "Sphere Architect",
        icon: "Arcane/Angular Rune",
        color: "#4169E1",
        theme: "Precise Control & Manipulation",

        description: `Sphere Architects treat the Combination Matrix like an engineering problem. They swap sphere types to guarantee the combos they want, lock spheres between turns for guaranteed elements, and reduce the cost of multi-sphere Recipes. Where Prism Mages chase purity and Entropy Weavers embrace randomness, Sphere Architects impose *control* over the chaos. If you want to always have the right combo for the right moment, this is your path.`,

        playstyle:
          "Sphere manipulation, precise control, efficient banking, tactical mastery",

        strengths: [
          "Can swap any 2 spheres for different elements (once per turn, costs 3 mana)",
          "Can store up to 15 spheres (instead of the standard 12 cap)",
          "Reduce mana cost of 3-sphere Recipes by 3 (e.g., 20→17 mana)",
          'Can "lock" 1 sphere type to guarantee it next turn',
          "Most consistent and controllable spec",
        ],

        weaknesses: [
          "No damage bonuses (pure utility/control)",
          "Sphere manipulation is expensive (mana costs)",
          "Requires extensive planning and foresight",
          "Less explosive than other specs",
          "Complexity can be overwhelming",
        ],

        passiveAbilities: [
          {
            name: "Sphere Resonance",
            tier: "Path Passive",
            description:
              "When you generate 3 or more spheres of the same element in one turn, gain 1d4 temporary mana.",
            sharedBy: "All Arcanoneers",
          },
          {
            name: "Runic Precision",
            tier: "Specialization Passive",
            description:
              'Once per turn, swap any 2 spheres for different element types (costs 3 mana total). 3-sphere Recipes cost 3 less mana (e.g., 20→17). You can "lock" 1 sphere type at end of turn to guarantee that element in your next roll — spend 1 banked sphere of that type; one of your next 4d8 results is automatically replaced with that element. Your sphere bank capacity is 15 instead of 12. Control the matrix, don\'t let it control you.',
            uniqueTo: "Sphere Architect",
          },
        ],

        recommendedFor:
          "Players who want precise control, tactical planning, and sphere manipulation mastery",
      },
    ],
  },

  // Elemental Combination Matrix
  // The 36 base two-sphere combinations available to ALL Arcanoneers
  combinationMatrix: {
    title: "Elemental Combination Matrix",
    subtitle: "The 36 Base Combinations",
    description: `Every Arcanoneer inherently knows all 36 two-sphere combinations. No memorization required — combine any two elemental spheres and you produce a predictable magical effect. This is your foundation, your fallback, your Swiss Army knife. Learned recipes enhance specific combinations with additional effects, but the base matrix ensures you are NEVER powerless.`,
    baseManaCost: 5,
    baseDamageFormula: "1d8 + intelligence/4",
    baseRange: 60,

    entries: [
      // ========================================
      // PURE PAIRS (Same Element ×2) — 8 combos
      // Focused, reliable, elementally pure
      // ========================================
      {
        id: "arcane_arcane",
        name: "Arcane Pulse",
        elements: ["arcane", "arcane"],
        damageTypes: ["force"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A concentrated bolt of pure arcane force strikes a single target.",
        flavorText:
          "Raw magic condenses between your palms — a sphere of crackling violet energy that hums with barely contained power. You release it with a sharp gesture, and it streaks toward your target like a purple comet.",
      },
      {
        id: "holy_holy",
        name: "Radiance",
        elements: ["radiant", "radiant"],
        damageTypes: ["radiant"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        secondaryEffect: "blind",
        effectDescription:
          "A beam of concentrated divine light burns a single target and briefly blinds them.",
        flavorText:
          "Two golden spheres merge into a searing point of light. You direct the beam like a lance of pure sunlight, and it burns through the air with a sound like a choir hitting a single, piercing note.",
      },
      {
        id: "shadow_shadow",
        name: "Dark Bolt",
        elements: ["necrotic", "necrotic"],
        damageTypes: ["necrotic"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A sphere of concentrated darkness drains life force from a single target.",
        flavorText:
          "The shadows around you thicken and writhe, drawn to your hands like moths to flame. You compress them into a writhing orb of pure darkness and hurl it — wherever it strikes, the light itself seems to die.",
      },
      {
        id: "fire_fire",
        name: "Flame Burst",
        elements: ["fire", "fire"],
        damageTypes: ["fire"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A concentrated ball of flame detonates against a single target.",
        flavorText:
          "Fire answers fire. The two spheres spiral into each other like dueling serpents, then collapse into a single roaring sphere of flame. You hurl it with a shout, and it detonates on impact with a satisfying WHUMP.",
      },
      {
        id: "ice_ice",
        name: "Frost Spike",
        elements: ["frost", "frost"],
        damageTypes: ["frost"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        secondaryEffect: "slow",
        effectDescription:
          "A jagged spike of enchanted ice pierces a single target, leaving behind numbing cold.",
        flavorText:
          "Frost crystals bloom across your knuckles, growing and sharpening into a crystalline spike. The air cracks as you launch it — a shard of frozen fury that leaves frost trails in its wake.",
      },
      {
        id: "nature_nature",
        name: "Storm Surge",
        elements: ["nature", "nature"],
        damageTypes: ["nature"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A surge of nature energy — crackling lightning wrapped in grasping thorns — strikes a single target.",
        flavorText:
          "The spheres crackle and spark, lightning arcing between them as thorny vines coil around your wrist. You release the surge with a thunderclap, and the target is wreathed in storm and thorn.",
      },
      {
        id: "healing_healing",
        name: "Grissle Blockade",
        elements: ["healing", "healing"],
        damageTypes: ["force"],
        targetType: "area",
        range: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        primaryEffect: "control",
        secondaryEffect: "barrier",
        effectDescription:
          "Create a barrier of knit compressed flesh and bone shards that blocks movement. All creatures within 10 feet cannot move beyond the barrier for 2 rounds.",
        flavorText:
          "The two viscera spheres fuse, knitting into a pulsating, grotesque wall of compressed flesh and jagged bone shards. Nothing crosses the boundary. The flesh holds, and the bone does not yield.",
      },
      {
        id: "chaos_chaos",
        name: "Chaos Bolt",
        elements: ["chaos", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "A wildly unstable bolt of chaos energy. Roll on this combo's specific effect table below (overrides the general Chaos d20 table).",
        flavorText:
          "Reality hiccups. The two chaos spheres don't merge so much as they argue — a swirling mass of conflicting energies that can't decide what it wants to be. You shrug and throw it anyway.",
        randomEffects: [
          {
            name: "Chaos Nova",
            description:
              "The bolt detonates in a 15-foot radius, dealing chaos damage to all nearby enemies.",
            damageTypes: ["chaos"],
            targetType: "aoe",
            aoeRadius: 15,
          },
          {
            name: "Polymorphic Blast",
            description:
              "The bolt transforms mid-flight, dealing a random damage type to a single target.",
            damageTypes: ["random"],
            targetType: "single",
          },
          {
            name: "Entropy Drain",
            description:
              "The bolt siphons vitality from the target, dealing chaos damage and granting you temporary HP equal to the damage dealt. ⚠️ NOT healing — you gain a TEMP HP buffer that decays at the end of combat. The Arcanoneer CANNOT heal. This is absorption, not restoration.",
            damageTypes: ["chaos"],
            targetType: "single",
            selfHeal: false,
            tempHP: true,
            tempHPDecay: "end_of_combat",
          },
          {
            name: "Wild Surge",
            description:
              "The bolt fizzles harmlessly — then all your remaining banked spheres transform into random elements.",
            damageTypes: [],
            targetType: "self",
            reshuffleSpheres: true,
          },
        ],
      },

      // ========================================
      // ARCANE MIXED (7 combos)
      // Raw magic amplified by other elements
      // ========================================
      {
        id: "arcane_holy",
        name: "Divine Bolt",
        elements: ["arcane", "radiant"],
        damageTypes: ["force", "radiant"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A bolt of arcane-infused divine energy that cannot be dodged or blocked.",
        flavorText:
          "Arcane force and holy light intertwine into a spiraling lance of white and violet. It seeks its target with unerring precision — no shield can deflect it, no armor can turn it aside.",
      },
      {
        id: "arcane_shadow",
        name: "Void Bolt",
        elements: ["arcane", "necrotic"],
        damageTypes: ["force", "necrotic"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A bolt of void energy that punches through magical barriers.",
        flavorText:
          "Where arcane force meets shadow, the void is born. The spheres collapse into a point of absolute blackness ringed by purple static. It tears through the air, leaving a faint afterimage of nothing.",
      },
      {
        id: "arcane_fire",
        name: "Arcane Flame",
        elements: ["arcane", "fire"],
        damageTypes: ["force", "fire"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A spiraling bolt of arcane fire that pierces through barriers.",
        flavorText:
          "Arcane energy wraps around fire like a fist around a torch. The result burns hotter and strikes harder — a spiraling comet of force and flame that punches through obstacles.",
      },
      {
        id: "arcane_ice",
        name: "Crystal Shard",
        elements: ["arcane", "frost"],
        damageTypes: ["force", "frost"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A razor-sharp shard of enchanted crystal that pierces armor.",
        flavorText:
          "Arcane energy crystallizes the frost into a prism of unnatural sharpness — harder than steel, colder than death. It whistles through the air and shatters on impact into a spray of stinging fragments.",
      },
      {
        id: "arcane_nature",
        name: "Thunderstrike",
        elements: ["arcane", "nature"],
        damageTypes: ["force", "nature"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A bolt of concentrated storm energy — arcane lightning that cracks with thunder.",
        flavorText:
          "The arcane sphere becomes a lightning rod, drawing the nature sphere's storm energy into a single crackling bolt. You point, thunder peals, and a fork of white-hot lightning arcs toward your target.",
      },
      {
        id: "arcane_healing",
        name: "Visceral Cocoon",
        elements: ["arcane", "healing"],
        damageTypes: ["force"],
        targetType: "single_ally",
        range: 30,
        primaryEffect: "barrier",
        secondaryEffect: "shield",
        effectDescription:
          "Conjure a protective cocoon of raw tissue and arcane force around your target. Absorbs damage equal to 4d8.",
        flavorText:
          "Arcane energy wraps around the viscera sphere, causing raw sinew to stretch and harden into a violet-crimson cocoon. It hovers around the target, absorbing incoming harm.",
      },
      {
        id: "arcane_chaos",
        name: "Wild Magic",
        elements: ["arcane", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "Arcane structure meets chaos unpredictability — the result is anyone's guess.",
        flavorText:
          "You try to impose order on chaos. Chaos laughs at you. The result is... educational.",
        randomEffects: [
          {
            name: "Spellmirror",
            description:
              "A shimmering arcane shield reflects the next spell cast at you back at the caster.",
            damageTypes: [],
            targetType: "self",
            reflectSpell: true,
          },
          {
            name: "Manaburst",
            description:
              "A cascade of raw arcane energy deals chaos damage and restores 1d4 mana to you.",
            damageTypes: ["chaos"],
            targetType: "single",
            manaRestore: "1d4",
          },
          {
            name: "Dimensional Flicker",
            description: "You teleport 15 feet in a random direction.",
            damageTypes: [],
            targetType: "self",
            teleport: 15,
          },
          {
            name: "Arcane Storm",
            description:
              "Lightning arcs from you to 1d4 random targets within 30 feet, dealing force damage.",
            damageTypes: ["force"],
            targetType: "random_aoe",
            maxTargets: "1d4",
          },
        ],
      },

      // ========================================
      // HOLY MIXED (6 combos)
      // Divine power fused with mortal elements
      // ========================================
      {
        id: "holy_shadow",
        name: "Twilight",
        elements: ["radiant", "necrotic"],
        damageTypes: ["radiant", "necrotic"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "Light and darkness collide, creating a bolt of twilight energy that burns with opposing forces.",
        flavorText:
          "Radiant gold meets necrotic black, and where they clash, twilight is born — a strange, shimmering grey that burns and chills in equal measure. It should not exist. It does anyway.",
      },
      {
        id: "holy_fire",
        name: "Solar Flare",
        elements: ["radiant", "fire"],
        damageTypes: ["radiant", "fire"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "A searing burst of divine fire that burns body and soul alike.",
        flavorText:
          "The holy sphere ignites the fire sphere like sunlight through a magnifying glass. What emerges is not merely fire — it is judgment given form, a lance of white-hot righteousness.",
      },
      {
        id: "holy_ice",
        name: "Aurora",
        elements: ["radiant", "frost"],
        damageTypes: ["radiant", "frost"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        secondaryEffect: "slow",
        effectDescription:
          "A shimmering curtain of aurora light that freezes and dazzles.",
        flavorText:
          "The spheres dance together like the northern lights given physical form — ribbons of gold and blue that ripple through the air, beautiful and terrible. They wash over the target in a cascade of frozen light.",
      },
      {
        id: "holy_nature",
        name: "Verdant Light",
        elements: ["radiant", "nature"],
        damageTypes: ["radiant", "nature"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "Divine light channels through nature, creating a beam of living radiance wrapped in thorny vines.",
        flavorText:
          "Light becomes life becomes weapon. Golden vines erupt from the holy sphere, wrapped in crackling nature energy. They lash forward like a living whip, burning and binding.",
      },
      {
        id: "holy_healing",
        name: "Crucible of Sinew",
        elements: ["radiant", "healing"],
        damageTypes: ["radiant"],
        targetType: "single_ally",
        range: 60,
        primaryEffect: "cleanse",
        secondaryEffect: "damage",
        effectDescription:
          "A scourging burst of divine marrow-light. Removes all debuffs from the target but deals 1d6 radiant damage per debuff removed as tissue is forcefully cauterized.",
        flavorText:
          "Searing holy fire collides with the viscera sphere, causing a blinding, agonizing flash. The target's skin melts and knits together instantly, purging toxins and curses. Your ally screams in agony, but stands entirely cleansed.",
      },
      {
        id: "holy_chaos",
        name: "Chaos Light",
        elements: ["radiant", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "Divine light refracted through chaos — the result ranges from miraculous to catastrophic.",
        flavorText:
          "You try to channel chaos through the lens of divinity. The result is... enlightening. Possibly literally.",
        randomEffects: [
          {
            name: "Beacon of Chaos",
            description:
              "A pillar of prismatic light erupts from the ground, dealing radiant damage to enemies and healing allies within 10 feet.",
            damageTypes: ["radiant"],
            targetType: "aoe",
            aoeRadius: 10,
          },
          {
            name: "Purify",
            description: "All debuffs are removed from a random ally.",
            damageTypes: [],
            targetType: "random_ally",
            cleanseAll: true,
          },
          {
            name: "Blinding Revelation",
            description:
              "A flash of chaos light blinds all creatures within 20 feet for 1 round.",
            damageTypes: [],
            targetType: "aoe",
            aoeRadius: 20,
            blind: true,
          },
          {
            name: "Divine Favor",
            description:
              "A random ally gains +2 to their next attack roll or saving throw.",
            damageTypes: [],
            targetType: "random_ally",
            buff: true,
          },
        ],
      },

      // ========================================
      // SHADOW MIXED (5 combos)
      // Darkness that corrupts, drains, and decays
      // ========================================
      {
        id: "shadow_fire",
        name: "Hellfire",
        elements: ["necrotic", "fire"],
        damageTypes: ["necrotic", "fire"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "Dark flames that burn the flesh and consume the soul.",
        flavorText:
          "Necrotic feeds fire, and fire gives necrotic form. The result is something that should not burn but does — black flames that cast no light and leave frost-bitten char wherever they touch.",
      },
      {
        id: "shadow_ice",
        name: "Frostbite",
        elements: ["necrotic", "frost"],
        damageTypes: ["necrotic", "frost"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        secondaryEffect: "slow",
        effectDescription:
          "A wave of unnatural cold that rots flesh while it freezes.",
        flavorText:
          "Not the clean cold of winter, but the deep chill of the grave. The shadow infects the ice with something malevolent — frost that spreads like disease, blackening skin as it creeps.",
      },
      {
        id: "shadow_nature",
        name: "Blight",
        elements: ["necrotic", "nature"],
        damageTypes: ["necrotic", "nature"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        secondaryEffect: "poison",
        effectDescription:
          "Thorny shadows inject necrotic poison into the target.",
        flavorText:
          "Nature twisted by shadow — black thorns that grow from darkness itself, dripping with poison that rots from within. They wrap around the target and squeeze, each thorn injecting decay.",
      },
      {
        id: "shadow_healing",
        name: "Grisly Veil",
        elements: ["necrotic", "healing"],
        damageTypes: ["necrotic"],
        targetType: "self",
        range: 0,
        primaryEffect: "barrier",
        secondaryEffect: "reflect",
        effectDescription:
          "Encase yourself in a shifting barrier of flayed skin and shadow that absorbs the next incoming spell. Reflect 50% of the absorbed spell's damage back at the caster as necrotic feedback.",
        flavorText:
          "Necrotic shadows wrap around the viscera sphere, weaving a grotesque shield of pulsating skin and absolute darkness around you. The next spell that strikes is absorbed by the fleshy matrix and violently deflected.",
      },
      {
        id: "shadow_chaos",
        name: "Entropy",
        elements: ["necrotic", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "Necrotic and chaos combine into pure entropic force — decay made unpredictable.",
        flavorText:
          "Entropy. The death of order. The spheres don't combine so much as unravel each other, producing a flickering mass of shadow and static that even you find unsettling.",
        randomEffects: [
          {
            name: "Wither",
            description:
              "A wave of decay reduces the target's armor by 2 for 2 rounds.",
            damageTypes: ["necrotic"],
            targetType: "single",
            armorReduction: 2,
          },
          {
            name: "Soul Rend",
            description:
              "Deals necrotic damage and applies a random debuff to the target.",
            damageTypes: ["necrotic"],
            targetType: "single",
            randomDebuff: true,
          },
          {
            name: "Necrotic Step",
            description:
              "You dissolve into shadow and reappear behind the target.",
            damageTypes: [],
            targetType: "self",
            teleport: true,
          },
          {
            name: "Dark Nova",
            description:
              "Necrotic energy erupts from you in a 10-foot radius, dealing necrotic damage to all nearby creatures (including allies).",
            damageTypes: ["necrotic"],
            targetType: "aoe",
            aoeRadius: 10,
            friendlyFire: true,
          },
        ],
      },

      // ========================================
      // FIRE MIXED (4 combos)
      // Flame fused with other forces
      // ========================================
      {
        id: "fire_ice",
        name: "Steam",
        elements: ["fire", "frost"],
        damageTypes: ["fire", "frost"],
        targetType: "cone",
        range: 30,
        aoeShape: "cone",
        aoeParameters: { length: 20 },
        primaryEffect: "damage",
        secondaryEffect: "blind",
        effectDescription:
          "A hissing cone of superheated steam that burns, freezes, and blinds.",
        flavorText:
          "Fire and ice should cancel. They don't — they argue. The result is a screaming column of pressurized steam that hisses and spits, scouring everything in its path with alternating blasts of scalding heat and flash-freezing condensation.",
      },
      {
        id: "fire_nature",
        name: "Wildfire",
        elements: ["fire", "nature"],
        damageTypes: ["fire", "nature"],
        targetType: "single",
        range: 60,
        primaryEffect: "damage",
        effectDescription:
          "Living flame wrapped in thorny vines — burns and constricts simultaneously.",
        flavorText:
          "Fire and nature have an ancient pact: nature provides the fuel, fire provides the transformation. Vines of living flame lash outward, burning as they bind.",
      },
      {
        id: "fire_healing",
        name: "Cauterizing Slag",
        elements: ["fire", "healing"],
        damageTypes: ["fire"],
        targetType: "single_ally",
        range: 30,
        primaryEffect: "cleanse",
        secondaryEffect: "damage",
        effectDescription:
          "Burn away afflictions with molten slag. Deals 2d6 fire damage to the ally and removes ONE debuff or condition by violently searing the tissue.",
        flavorText:
          "Fire does not heal — it purges. The forearm graft vents a jet of boiling magma that is smeared directly onto the ally's wounds. They scream as their flesh melts, but the heat instantly burns away any poison, disease, or curse, leaving permanent molten scars.",
      },
      {
        id: "fire_chaos",
        name: "Chaos Flame",
        elements: ["fire", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "Unstable fire infused with chaos — it might explode, spread, or backfire.",
        flavorText:
          "Fire is already unpredictable. Adding chaos makes it... enthusiastic.",
        randomEffects: [
          {
            name: "Infernal Burst",
            description:
              "The chaos flame detonates in a 15-foot radius, dealing fire damage to all nearby enemies.",
            damageTypes: ["fire"],
            targetType: "aoe",
            aoeRadius: 15,
          },
          {
            name: "Chain Fire",
            description:
              "The bolt bounces to 1d4 additional targets within 20 feet, dealing fire damage to each.",
            damageTypes: ["fire"],
            targetType: "chain",
            maxTargets: "1d4",
          },
          {
            name: "Fire Shield",
            description:
              "Flames wrap around you, granting fire resistance and dealing 1d4 fire damage to melee attackers for 2 rounds.",
            damageTypes: ["fire"],
            targetType: "self",
            selfBuff: true,
          },
          {
            name: "Backfire",
            description:
              "The flame sputters and backfires, dealing fire damage to you instead.",
            damageTypes: ["fire"],
            targetType: "self",
            selfDamage: true,
          },
        ],
      },

      // ========================================
      // ICE MIXED (3 combos)
      // Frost tempered by other forces
      // ========================================
      {
        id: "ice_nature",
        name: "Hailstorm",
        elements: ["frost", "nature"],
        damageTypes: ["frost", "nature"],
        targetType: "aoe",
        range: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        primaryEffect: "damage",
        effectDescription:
          "A localized storm of ice, lightning, and thorny hailstones pummels a small area.",
        flavorText:
          "Frost and nature conspire to create the worst weather imaginable — frozen thorns driven by howling wind, crackling with lightning. It's localized, at least. Small mercies.",
      },
      {
        id: "ice_healing",
        name: "Rime-Frozen Graft",
        elements: ["frost", "healing"],
        damageTypes: ["frost"],
        targetType: "single_ally",
        range: 30,
        primaryEffect: "buff",
        secondaryEffect: "armor_buff",
        effectDescription:
          "Encase the target in a grotesque layer of frozen bone and gristle, granting +3 Armor for 3 rounds.",
        flavorText:
          "The viscera and ice elements lock in a grotesque reaction. Instead of smooth armor, jagged plates of frozen bone, sinew, and grey ice snap onto your ally's limbs. It is freezing and agonizing, but highly protective.",
      },
      {
        id: "ice_chaos",
        name: "Glitch Frost",
        elements: ["frost", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "Frost that doesn't obey the rules — it might freeze, shatter, spread, or do something physics never intended.",
        flavorText:
          "Frost + chaos = the temperature equivalent of a rounding error. Reality's thermostat breaks.",
        randomEffects: [
          {
            name: "Flash Freeze",
            description:
              "A 10-foot radius of ground becomes slippery ice. All creatures in the area must save or fall prone.",
            damageTypes: ["frost"],
            targetType: "aoe",
            aoeRadius: 10,
            knockdown: true,
          },
          {
            name: "Frost Lance",
            description:
              "A single-target ice attack that deals double base damage and ignores armor.",
            damageTypes: ["frost"],
            targetType: "single",
            doubleDamage: true,
          },
          {
            name: "Frost Armor",
            description: "You gain +2 armor and frost resistance for 2 rounds.",
            damageTypes: [],
            targetType: "self",
            armorBuff: 2,
          },
          {
            name: "Shatterstorm",
            description:
              "Frost shards explode outward in a 15-foot radius, dealing frost damage to all creatures.",
            damageTypes: ["frost"],
            targetType: "aoe",
            aoeRadius: 15,
          },
        ],
      },

      // ========================================
      // NATURE MIXED (2 combos)
      // Storm & growth fused with other forces
      // ========================================
      {
        id: "nature_healing",
        name: "Sinew-Spark Leap",
        elements: ["nature", "healing"],
        damageTypes: ["nature"],
        targetType: "self",
        range: 0,
        primaryEffect: "utility",
        secondaryEffect: "teleport",
        effectDescription:
          "Rupture your own muscle fibers with a high-voltage lightning surge, teleporting up to 15 feet to an unoccupied space.",
        flavorText:
          "You detonate the nature and viscera spheres within your own muscle tissues. The shock of lightning contracts your leg muscles with bone-breaking force, launching you instantly into a teleportation arc. You trail ozone, smoke, and droplets of vaporized blood.",
      },
      {
        id: "nature_chaos",
        name: "Primal Chaos",
        elements: ["nature", "chaos"],
        damageTypes: ["chaos"],
        targetType: "random",
        range: 60,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "Nature's order disrupted by chaos — the wild becomes unpredictable, dangerous, and wilder.",
        flavorText:
          "Nature has rules. Chaos breaks them. The result is a feral, unpredictable surge of life energy that does whatever it wants.",
        randomEffects: [
          {
            name: "Thornquake",
            description:
              "Thorny vines erupt from the ground in a 15-foot radius, dealing nature damage and rooting enemies.",
            damageTypes: ["nature"],
            targetType: "aoe",
            aoeRadius: 15,
            root: true,
          },
          {
            name: "Chain Lightning",
            description:
              "A bolt of lightning arcs from you to 1d4 targets within 30 feet, dealing nature damage.",
            damageTypes: ["nature"],
            targetType: "chain",
            maxTargets: "1d4",
          },
          {
            name: "Poison Cloud",
            description:
              "A cloud of noxious spores fills a 10-foot radius, dealing nature damage over 2 rounds.",
            damageTypes: ["nature"],
            targetType: "aoe_dot",
            aoeRadius: 10,
          },
          {
            name: "Overgrowth",
            description:
              "Thick vines entangle a single target, restraining them for 1 round.",
            damageTypes: [],
            targetType: "single",
            restraint: true,
          },
        ],
      },

      // ========================================
      // HEALING MIXED (1 combo)
      // Life energy warped into defensive chaos
      // ========================================
      {
        id: "healing_chaos",
        name: "Amorphous Gristle Ward",
        elements: ["healing", "chaos"],
        damageTypes: ["chaos"],
        targetType: "self",
        range: 0,
        primaryEffect: "random",
        isChaosCombo: true,
        effectDescription:
          "An unstable ward of shifting flesh and bone. Roll 1d4 on the random effects table: 1=+2 Armor for 2 rounds, 2=absorb next spell, 3=reflect next attack, 4=flesh collapses (no effect).",
        flavorText:
          "You fuse viscera and chaos in your chambers. Grotesque limbs, teeth, and skin bubble around your forearm graft, ready to absorb incoming strikes. Will it hold, or will the tissue melt away into useless slurry?",
        randomEffects: [
          {
            name: "Gristle Shield",
            description:
              "The flesh solidifies into a wall of fused bone. Gain +2 Armor for 2 rounds.",
            damageTypes: [],
            targetType: "self",
            armorBuff: 2,
            durationValue: 2,
            durationType: "rounds",
            durationUnit: "rounds",
          },
          {
            name: "Flesh Eater",
            description:
              "A gaping mouth forms on the graft and devours the next spell cast at you.",
            damageTypes: [],
            targetType: "self",
            absorbSpell: true,
          },
          {
            name: "Bone Retaliation",
            description:
              "Jagged bones erupt to deflect and reflect the next attack back at the attacker.",
            damageTypes: [],
            targetType: "self",
            reflectAttack: true,
          },
          {
            name: "Flesh Slurry",
            description:
              "The tissue fails to form and liquefies into a harmless mess. Nothing happens.",
            damageTypes: [],
            targetType: "self",
            noEffect: true,
          },
        ],
      },
    ],
  },

  // Spell Pools - organized by character level
  // Maps character level to available spell IDs for learning
  spellPools: {
    1: [
      // Level 1 starting spells (pick 3)
      "arc_spark_bolt",
      "arc_frost_touch",
      "arc_healing_light",
      "arc_arcane_missile",
      "arc_nature_vine",
    ],
    2: [
      // Level 2 spells
      "arc_steam_burst",
      "arc_shadow_bolt",
      "arc_celestial_ray",
    ],
    3: [
      // Level 3 spells
      "arc_fire_bolt",
      "arc_ice_shard",
      "arc_arcane_detonation",
    ],
    4: [
      // Level 4 spells
      "arc_firestorm",
      "arc_frost_nova",
      "arc_shadow_embrace",
    ],
    5: [
      // Level 5 spells
      "arc_elemental_blast",
      "arc_divine_healing",
      "arc_chaos_bolt",
    ],
    6: [
      // Level 6 spells (3-sphere combinations)
      "arc_glacial_blessing",
      "arc_prismatic_ward",
      "arc_verdant_rejuvenation",
    ],
    7: [
      // Level 7 spells (3-4 sphere combinations)
      "arc_phase_shift",
      "arc_elemental_barrage",
      "arc_celestial_storm",
    ],
    8: [
      // Level 8 spells (4-sphere ultimates)
      "arc_harmonic_convergence",
      "arc_elemental_maelstrom",
      "arc_chaos_storm",
    ],
    9: [
      // Level 9 spells (powerful with tradeoffs)
      "arc_primal_cataclysm",
      "arc_chaos_vortex",
      "arc_arcane_synthesis",
    ],
    10: [
      // Level 10 spells (capstones)
      "arc_elemental_convergence",
      "arc_dimensional_rift",
      "arc_elemental_apotheosis",
    ],
  },

  // Spells - organized by level, properly formatted for wizard
  spells: [
    // ========================================
    // LEVEL 1 STARTING SPELLS (5 options, pick 3)
    // Basic 2-sphere combinations - weak starter spells
    // ========================================
    {
      id: "arc_spark_bolt",
      name: "Marrow-Piercing Slug",
      description:
        "Chambers a crystallized soul-shard of pure force, discharging a bone-shattering slug that ignites as it exits the pig-iron barrel. Ignores 2 points of enemy armor.",
      level: 1,
      enhancesCombo: "arcane_arcane",
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Ebon Blaze",
        tags: ["arcane", "damage", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "arcane_sphere"],
        resourceValues: { mana: 4, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Marrow Ignis!",
        somaticText:
          "Your pig-iron sleeve superheats as a violet blood-shard feeds into the chamber. Firing it sends a sharp vibration through your forearm bones.",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["arcane"],
        resolution: "DICE",
        armorPiercing: 2,
        description:
          "The bolt strikes with precise arcane force, dealing direct force damage.",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["arcane", "damage", "starter"],
    },

    {
      id: "arc_frost_touch",
      name: "Rime-Iron Clasp",
      description:
        "Grafts freezing rime directly onto your iron cylinder, gripping the target to flash-freeze tissue. Frozen targets take +1d4 bonus damage from the next physical attack against them.",
      level: 1,
      enhancesCombo: "ice_ice",
      spellType: "ACTION",
      icon: "Frost/Frost Touch",

      typeConfig: {
        school: "frost",
        icon: "Frost/Frost Touch",
        tags: ["frost", "damage", "debuff", "touch", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "ice_sphere"],
        resourceValues: { mana: 4, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Gelu Clavis!",
        somaticText:
          "Freezing rime spreads from the pig-iron chassis across your hand as you clasp the target's neck.",
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["frost"],
        resolution: "DICE",
        description:
          "Flash-freezes tissue at the point of contact, causing frost damage.",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "slowed",
            name: "Frozen Limbs",
            description:
              "Movement speed reduced by 10 feet for 1 round as muscles stiffen from the cold.",
            statusType: "slow",
            level: "minor",
            statPenalty: { stat: "movement_speed", value: -10 },
            movementPenalty: -10,
            mechanicsText: "Movement speed reduced by 10 feet for 1 round",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 12,
        saveType: "constitution",
        saveOutcome: "negates",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      triggerConfig: {
        conditionalEffects: [
          {
            id: "frost_shatter",
            condition: "next_physical_attack_against_target",
            effect: "+1d4 bonus damage from the next physical attack against the frozen target",
            mechanicsText: "Frozen targets take +1d4 bonus damage from the next physical attack",
          },
        ],
      },

      tags: ["frost", "damage", "debuff", "touch", "starter"],
    },

    {
      id: "arc_healing_light",
      name: "Back-Blast Spark Shield",
      description:
        "Discharges a localized back-blast of arcane sparks that coalesce into a shimmering, crackling ward around an ally, absorbing 2d8 damage.",
      level: 1,
      enhancesCombo: "arcane_arcane",
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Ebon Blaze",
        tags: ["arcane", "defensive", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: ["mana", "arcane_sphere"],
        resourceValues: { mana: 4, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Retro Scutum!",
        somaticText:
          "Direct the cannon's exhaust vents toward an ally, showering them in protective, crackling violet sparks.",
      },

      effectTypes: ["defensive"],

      defensiveConfig: {
        shieldType: "absorb",
        formula: "2d8",
        resolution: "DICE",
        description:
          "A crackling barrier of arcane sparks absorbs incoming damage until depleted.",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["arcane", "defensive", "starter"],
    },

    {
      id: "arc_arcane_missile",
      name: "Blood-Shard Barrage",
      description:
        "Loads holy and arcane blood-shards into the chamber, firing an unerring burst of pressurized force that cannot be dodged or blocked.",
      level: 1,
      enhancesCombo: "arcane_holy",
      spellType: "ACTION",
      icon: "Arcane/Missile",

      typeConfig: {
        school: "force",
        icon: "Arcane/Missile",
        tags: ["arcane", "damage", "starter"],
        castTime: 0,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "arcane_sphere", "holy_sphere"],
        resourceValues: { mana: 4, arcane_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Sanguis Barrage!",
        somaticText:
          "Brace your arm as three crystallized marrow slugs feed into the breech, venting red and violet steam with each discharge",
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["force"],
        resolution: "DICE",
        autoHit: true,
        description:
          "An unerring missile strikes with pinpoint accuracy, delivering a concentrated burst of force.",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["arcane", "damage", "starter"],
    },

    {
      id: "arc_nature_vine",
      name: "Barbed Overgrowth",
      description:
        "Fires a heavy green-flecked iron spike into the earth, causing thorny, blood-slicked vines to erupt from the ground and entangle the target.",
      level: 1,
      enhancesCombo: "nature_nature",
      spellType: "ACTION",
      icon: "Nature/Vines",

      typeConfig: {
        school: "nature",
        icon: "Nature/Vines",
        tags: ["nature", "damage", "control", "starter"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "nature_sphere", "nature_sphere"],
        resourceValues: { mana: 4, nature_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Vinea Mutilatio!",
        somaticText:
          "Slam the breech lever forward, venting hot gas as a heavy iron harpoon-spike plunges into the ground",
        spheres: ["Nature", "Nature"],
      },

      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["nature"],
        resolution: "DICE",
        description:
          "Thorny vines dig into the target, dealing nature damage from thorns and constriction.",
      },

      controlConfig: {
        controlType: "restraint",
        strength: "weak",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 13,
        saveType: "strength",
        savingThrow: {
          ability: "strength",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "snare",
            name: "Entangled by Vines",
            description:
              "Thorny vines wrap around your legs, immobilizing you. A Strength save breaks free.",
            config: {
              restraintType: "physical",
              saveType: "strength",
              saveDC: 13,
              condition: "restrained",
              breakOnDamage: true,
              durationValue: 1,
              durationType: "rounds",
              durationUnit: "rounds",
            },
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["nature", "damage", "control", "starter"],
    },

    // ========================================
    // LEVEL 2 SPELLS
    // ========================================
    {
      id: "arc_steam_burst",
      name: "Superheated Steam Vent",
      description:
        "Vents the pig-iron cylinder's thermal chambers, unleashing a pressurized cone of blinding, flesh-scorching steam.",
      level: 2,
      enhancesCombo: "fire_ice",
      spellType: "ACTION",
      icon: "Frost/Frost Touch",

      typeConfig: {
        school: "frost",
        secondaryElement: "fire",
        icon: "Frost/Frost Touch",
        tags: ["fire", "frost", "damage", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "cone",
        aoeParameters: { length: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "fire_sphere", "ice_sphere"],
        resourceValues: { mana: 7, fire_sphere: 1, ice_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Calidus Ventus!",
        somaticText:
          "Force open the cooling bypass valves on the forearm sleeve, spraying superheated white mist in a wide arc",
        spheres: ["Fire", "Frost"],
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["frost", "fire"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "disoriented",
            name: "Blinded by Steam",
            description:
              "Thick steam clouds your vision completely. You automatically fail sight-based checks and attack with disadvantage for 1 round.",
            statusType: "blinded",
            level: "minor",
            statPenalty: {
              stat: "attack",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "Disadvantage on all attack rolls for 1 round",
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 13,
        saveType: "constitution",
        saveOutcome: "negates",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "frost", "damage", "debuff"],
    },

    {
      id: "arc_shadow_bolt",
      name: "Vampiric Slug",
      description:
        "Fires a heavy shell forged from crystallized necrotic marrow. The bullet drains the target's life force on impact, siphoning their vitality back into your own bloodstream.",
      level: 2,
      enhancesCombo: "shadow_shadow",
      spellType: "ACTION",
      icon: "Void/Red Energy Burst",

      typeConfig: {
        school: "necrotic",
        icon: "Void/Red Energy Burst",
        tags: ["necrotic", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "shadow_sphere", "shadow_sphere"],
        resourceValues: { mana: 7, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Sanguis Haurire!",
        somaticText:
          "Chamber a black, pulsing blood-crystal slug, taking a small amount of skin-searing heat as it discharges",
        spheres: ["Necrotic", "Necrotic"],
      },

      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        description:
          "The shadow bolt strikes with necrotic force, actively draining life energy from the target. They feel their vitality being siphoned away, experiencing a deep cold that seems to come from within their very soul. The wound left behind appears blackened and necrotic, as if the flesh itself has died.",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          {
            id: "soul_drain",
            name: "Soul Drain",
            description: "The target's vitality is siphoned away, reducing their resilience. -1 to all saving throws.",
            mechanicsText: "-1 to all saving throws for 2 rounds",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["necrotic", "damage", "healing"],
    },

    {
      id: "arc_celestial_ray",
      name: "Aetheric Lance",
      description:
        "Overcharges the cylinder with holy and arcane essences, projecting a continuous beam of blinding celestial energy that scorches enemies while sealing the wounds of allies in its path.",
      level: 2,
      enhancesCombo: "arcane_holy",
      spellType: "ACTION",
      icon: "Radiant/Radiant Bolt",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Bolt",
        tags: ["radiant", "arcane", "damage", "healing"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "line",
        aoeParameters: { length: 60 },
        targetRestrictions: [],
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "line",
          aoeParameters: { length: 60 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "line",
          aoeParameters: { length: 60 },
          targetRestrictions: ["ally"],
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "arcane_sphere", "holy_sphere"],
        resourceValues: { mana: 7, arcane_sphere: 1, holy_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Lux Lanceta!",
        somaticText:
          "Open all combustion chambers at once, letting a blinding white-hot beam of force erupt directly from the barrel",
        spheres: ["Arcane", "Radiant"],
      },

      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "1d8 + intelligence/4",
        damageTypes: ["radiant"],
        resolution: "DICE",
        description:
          "The celestial ray burns enemies with searing radiant energy, as if they've been exposed to concentrated sunlight. Their flesh smokes and chars where the light touches, and they feel an intense burning sensation that seems to come from within their very soul.",
      },

      buffConfig: {
        buffType: "statEnhancement",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          {
            id: "radiant_exposure",
            name: "Radiant Exposure",
            description: "Target's defenses are weakened by searing light, granting attackers +1 to hit them.",
            mechanicsText: "+1 to attack rolls against target for 2 rounds",
            statModifier: {
              stat: "armor",
              magnitude: -1,
              magnitudeType: "flat",
            },
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["radiant", "arcane", "damage", "healing"],
    },

    // ========================================
    // LEVEL 3 SPELLS
    // ========================================
    {
      id: "arc_fire_bolt",
      name: "Flame Burst Shell",
      description:
        "Chambers a high-grain fire core, detonating on impact to spray molten white slag over a 10-foot radius. The massive kickback rattles your forearm bones.",
      level: 3,
      enhancesCombo: "fire_fire",
      spellType: "ACTION",
      icon: "Fire/Fiery Bolt",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fiery Bolt",
        tags: ["fire", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 90,
        targetRestrictions: [],
      },

      propagation: {
        method: "explosion",
        behavior: "aoe",
        parameters: {
          secondaryRadius: 10,
        },
      },

      resourceCost: {
        resourceTypes: ["mana", "fire_sphere", "fire_sphere"],
        resourceValues: { mana: 10, fire_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Ignis Eruptio!",
        somaticText: "Chamber two searing fire-shards, locking the breech with a metallic clang before a deafening blast releases the shell",
        spheres: ["Fire", "Fire"],
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d8 + intelligence/3",
        damageTypes: ["fire"],
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage"],
    },

    {
      id: "arc_ice_shard",
      name: "Shatter-Frost Dart",
      description:
        "Launches a jagged shard of jagged, crystallized frost that tears through flesh and embeds deep into bone, freezing tissue and numbing limbs.",
      level: 3,
      enhancesCombo: "ice_ice",
      spellType: "ACTION",
      icon: "Frost/Frost Touch",

      typeConfig: {
        school: "frost",
        icon: "Frost/Frost Touch",
        tags: ["frost", "damage", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 90,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "ice_sphere", "ice_sphere"],
        resourceValues: { mana: 10, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Glacies Lancet!",
        somaticText: "Insert a dual rime-core into the barrel, firing a pressurized spike of solid ice that shatters on impact",
        spheres: ["Frost", "Frost"],
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d8 + intelligence/3",
        damageTypes: ["frost"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 13,
        saveType: "constitution",
        saveOutcome: "negates",
        effects: [
          {
            id: "slow",
            name: "Slow",
            description: "Movement speed reduced by 10 feet",
            statusType: "slow",
            level: "minor",
            statPenalty: { stat: "movement_speed", value: -10 },
            movementPenalty: -10,
            mechanicsText: "Movement speed reduced by 10 feet for 2 rounds",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["frost", "damage", "debuff"],
    },

    {
      id: "arc_arcane_detonation",
      name: "Marrow-Shatter Concussion",
      description:
        "Forces volatile force-shards together in a closed chamber, releasing a concussive shockwave that shatters the ribs of enemies and leaves them bleeding from the ears.",
      level: 3,
      enhancesCombo: "arcane_arcane",
      spellType: "ACTION",
      icon: "Arcane/Spiral Vortex",

      typeConfig: {
        school: "force",
        icon: "Arcane/Spiral Vortex",
        tags: ["arcane", "damage", "debuff", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "arcane_sphere", "arcane_sphere"],
        resourceValues: { mana: 10, arcane_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Detonare!",
        somaticText:
          "Manually override the barrel exhaust vents, letting concussive force blast forward in a deafening shockwave that bruises your collarbone",
        spheres: ["Arcane", "Arcane"],
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d8 + intelligence/3",
        damageTypes: ["force"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
        description:
          "The arcane detonation strikes with pure force energy, hitting targets like an invisible battering ram. The shockwave causes internal trauma as organs are compressed and bones are rattled by the concussive blast. Those who manage to dive for cover still feel the force ripple through their bodies, though with reduced intensity.",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 14,
        saveType: "constitution",
        saveOutcome: "negates",
        effects: [
          {
            id: "disoriented",
            name: "Arcane Disorientation",
            description:
              "Arcane energy overwhelms the senses. Suffer -2 to attack rolls and saving throws for 1 round.",
            statusType: "dazed",
            level: "moderate",
            statPenalty: [
              { stat: "attack", value: -2 },
              { stat: "saving_throws", value: -2 },
            ],
            mechanicsText: "-2 to attack rolls and saving throws for 1 round",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["arcane", "damage", "debuff", "aoe"],
    },

    // ========================================
    // LEVEL 4 SPELLS
    // ========================================
    {
      id: "arc_firestorm",
      name: "Incinerating Slag-Shower",
      description:
        "Superheats the cylinder until the iron drips molten slag, venting a spinning cyclone of hellfire that incinerates all flesh in a 15-foot radius.",
      level: 4,
      enhancesCombo: "fire_fire",
      spellType: "ACTION",
      icon: "Fire/Fire Storm",

      typeConfig: {
        school: "fire",
        icon: "Fire/Fire Storm",
        tags: ["fire", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "fire_sphere"],
        resourceValues: { mana: 14, fire_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Tempestas Ignis!",
        somaticText:
          "Brace your shoulder against a rock face as your graft glows white-hot, releasing a roaring torrent of fire that peels the skin from your arm",
        spheres: ["Fire", "Fire"],
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "2d8 + intelligence/3",
        damageTypes: ["fire"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageTypes: ["fire"],
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1,
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "damage", "aoe"],
    },

    {
      id: "arc_frost_nova",
      name: "Bone-Chilling Vent",
      description:
        "Purges the cooling lines of your cylinder, unleashing a pressurized shockwave of absolute zero that flash-freezes joints and muscles in a 15-foot blast.",
      level: 4,
      enhancesCombo: "ice_ice",
      spellType: "ACTION",
      icon: "Frost/Ice Orb",

      typeConfig: {
        school: "frost",
        icon: "Frost/Ice Orb",
        tags: ["frost", "damage", "debuff", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "ice_sphere", "ice_sphere"],
        resourceValues: { mana: 14, ice_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Nova Glacies!",
        somaticText:
          "Slam your iron graft into the soil, venting frost energy directly into the bedrock to freeze everything in a circle",
        spheres: ["Frost", "Frost"],
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d8 + intelligence/3",
        damageTypes: ["frost"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 14,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
        description:
          "The frost nova strikes with bone-chilling cold, causing immediate tissue damage as cells freeze and rupture. The cold penetrates deep, making targets feel as if their very blood is turning to ice. Those with strong constitutions can resist some of the damage, but even they feel the numbing effects of the magical cold.",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 14,
        saveType: "constitution",
        saveOutcome: "negates",
        effects: [
          {
            id: "slow",
            name: "Frozen Solid",
            description:
              "Movement speed reduced by half for 2 rounds as deep cold stiffens muscles and joints.",
            statusType: "slow",
            level: "moderate",
            statPenalty: {
              stat: "movement_speed",
              value: -50,
              magnitudeType: "percentage",
            },
            movementPenalty: -50,
            mechanicsText: "Movement speed halved for 2 rounds",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["frost", "damage", "debuff", "aoe"],
    },

    {
      id: "arc_shadow_embrace",
      name: "Abyssal Maw",
      description:
        "Discharges a shell of pure crystallized dark marrow that unfolds on impact into skeletal jaws of shadows, chewing through flesh and draining muscle strength.",
      level: 4,
      enhancesCombo: "shadow_shadow",
      spellType: "ACTION",
      icon: "Void/Maw Gripping Fear",

      typeConfig: {
        school: "necrotic",
        icon: "Void/Maw Gripping Fear",
        tags: ["necrotic", "damage", "debuff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "shadow_sphere", "shadow_sphere"],
        resourceValues: { mana: 14, shadow_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Umbra Clausura!",
        somaticText: "Feed a dual-necrotic core into the breech, letting the shadows coil out of the barrel like writhing snakes",
        spheres: ["Necrotic", "Necrotic"],
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d8 + intelligence/3",
        damageTypes: ["necrotic"],
        resolution: "DICE",
        dotConfig: {
          enabled: true,
          damagePerTick: "1d6",
          damageTypes: ["necrotic"],
          tickFrequency: "round",
          duration: 2,
          canStack: false,
          maxStacks: 1,
        },
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "weakened",
            name: "Weakened",
            description:
              "Strength reduced by 2 for 2 rounds. The target's physical power is diminished, making them weaker and less effective in combat.",
            mechanicsText: "-2 Strength for 2 rounds",
            statModifier: {
              stat: "strength",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 14,
        saveType: "constitution",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["necrotic", "damage", "debuff"],
    },

    // ========================================
    // LEVEL 5 SPELLS
    // ========================================
    {
      id: "arc_elemental_blast",
      name: "Thermobaric Burst",
      description:
        "Ignites fire and ice blood-shards in rapid succession, venting a synchronized thermal shockwave that splits armor and boils blood.",
      level: 5,
      enhancesCombo: "fire_ice",
      spellType: "ACTION",
      icon: "Fire/Swirling Fireball",

      typeConfig: {
        school: "fire",
        secondaryElement: "frost",
        icon: "Fire/Swirling Fireball",
        tags: ["fire", "frost", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "fire_sphere", "ice_sphere"],
        resourceValues: { mana: 18, fire_sphere: 1, ice_sphere: 1 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Thermobarica!",
        somaticText: "Hammer the dual combustion lever, forcing high-pressure elements into a thermal collapse at the muzzle",
        spheres: ["Fire", "Frost"],
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d8 + intelligence/2",
        damageTypes: ["fire", "frost"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 15,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["fire", "frost", "damage", "aoe"],
    },

    {
      id: "arc_divine_healing",
      name: "Radiant Ward",
      description:
        "Create a permanent-seeming ward of holy light around a target. The next time they would take damage, reduce it by half.",
      level: 5,
      enhancesCombo: "holy_healing",
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        tags: ["radiant", "defensive", "support"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: ["mana", "holy_sphere", "healing_sphere"],
        resourceValues: { mana: 18, holy_sphere: 1, healing_sphere: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Sanctus Scutum!",
        somaticText:
          "Trace a radiant sigil in the air that settles over the target as a glowing ward",
        spheres: ["Radiant", "Healing"],
      },

      effectTypes: ["defensive"],

      defensiveConfig: {
        shieldType: "damage_reduction",
        reductionPercent: 50,
        triggers: 1,
        duration: "until_triggered",
        resolution: "FLAT",
        description:
          "A golden sigil hovers over the target. The next time they take damage, it is reduced by half. The ward then fades.",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["radiant", "defensive", "support"],
    },

    {
      id: "arc_chaos_bolt",
      name: "Chaos Bolt",
      description:
        "A bolt of unpredictable chaos energy that deals random elemental damage.",
      level: 5,
      enhancesCombo: "chaos_chaos",
      spellType: "ACTION",
      icon: "Void/Corrupted Eye",

      typeConfig: {
        school: "chaos",
        icon: "Void/Corrupted Eye",
        tags: ["chaos", "damage"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 90,
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "chaos_sphere", "chaos_sphere"],
        resourceValues: { mana: 18, chaos_sphere: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Chaos Sagitta!",
        somaticText: "Hurl chaotic energy",
        spheres: ["Chaos", "Chaos"],
      },

      effectTypes: ["damage"],

      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Chaos Bolt",
          description: "Roll 1d4 to determine which chaotic effect this bolt unleashes.",
          diceFormula: "1d4",
          resolutionType: "DICE",
          resolutionConfig: { diceType: "d4" },
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Chaos Nova",
              effect: "15ft radius, 3d8+INT/2 chaos damage to all enemies",
            },
            {
              range: { min: 2, max: 2 },
              customName: "Entropy Drain",
              effect: "3d8+INT/2 chaos damage to target, random side effect on 1d4",
            },
            {
              range: { min: 3, max: 3 },
              customName: "Polymorphic Blast",
              effect: "4d8+INT/2 damage of a random element, target must save or be stunned 1 round",
            },
            {
              range: { min: 4, max: 4 },
              customName: "Arcane Feedback",
              effect: "3d8+INT/2 force damage chains to 1d4 random targets within 30ft",
            },
          ],
        },
      },

      damageConfig: {
        formula: "3d8 + intelligence/2",
        damageTypes: ["chaos"],
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["chaos", "damage"],
    },

    // ========================================
    // LEVEL 6 SPELLS (3-Sphere Combinations)
    // ========================================
    {
      id: "arc_glacial_blessing",
      name: "Glacial Blessing",
      description:
        "Weave ice and holy spheres into crystalline armor. Target gains +4 Armor and resistance to fire damage for 3 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Frost/Frozen in Ice",

      typeConfig: {
        school: "frost",
        icon: "Frost/Frozen in Ice",
        tags: ["frost", "radiant", "buff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: ["mana", "ice_sphere", "healing_sphere", "holy_sphere"],
        resourceValues: {
          mana: 20,
          ice_sphere: 1,
          healing_sphere: 1,
          holy_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Glacies Benedicere!",
        somaticText:
          "Weave the three spheres into a crystalline lattice and press it gently onto the target",
        spheres: ["Frost", "Healing", "Radiant"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "glacial_armor",
            name: "Glacial Armor",
            description:
              "Gain +4 Armor and resistance to fire damage for 3 rounds. Crystalline armor of ice and holy light deflects blows and absorbs heat.",
            mechanicsText: "+4 armor and fire resistance for 3 rounds",
            statModifier: {
              stat: "armor",
              magnitude: 4,
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

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 0,
      },

      tags: ["frost", "radiant", "buff"],
    },

    {
      id: "arc_prismatic_ward",
      name: "Prismatic Ward",
      description:
        "Fuse arcane, holy, and nature spheres into a prismatic dome. Cleansing light washes over allies, removing harmful effects and shielding them from incoming damage.",
      level: 6,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",

      typeConfig: {
        school: "arcane",
        icon: "Radiant/Radiant Divinity",
        tags: ["arcane", "radiant", "nature", "buff", "purification"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "holy_sphere",
          "nature_sphere",
        ],
        resourceValues: {
          mana: 20,
          arcane_sphere: 1,
          holy_sphere: 1,
          nature_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Prisma Custodia!",
        somaticText:
          "Hold the three spheres above your head, letting them merge into a prismatic dome that expands outward",
        spheres: ["Arcane", "Radiant", "Nature"],
      },

      effectTypes: ["buff", "purification"],

      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "prismatic_shield",
            name: "Prismatic Shield",
            description:
              "Absorbs up to 15 damage over 3 rounds. The shimmering ward deflects incoming attacks with flashes of multicolored light.",
            mechanicsText: "Absorbs 15 damage over 3 rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      purificationConfig: {
        purificationType: "cleanse",
        effects: [
          {
            id: "prismatic_cleanse",
            name: "Prismatic Cleanse",
            description:
              "Removes one debuff or negative status effect from each ally in the area.",
            mechanicsText: "Removes 1 debuff per ally in area",
          },
        ],
        strength: "moderate",
        targetEffects: ["debuff", "statusEffect"],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 3,
      },

      tags: ["arcane", "radiant", "nature", "buff", "purification"],
    },

    {
      id: "arc_verdant_rejuvenation",
      name: "Verdant Arsenal",
      description:
        "Nature and holy spheres bloom into weapons of living wood and golden light. Target gains +2d6 damage on their next 3 attacks and +10ft movement speed.",
      level: 6,
      spellType: "ACTION",
      icon: "Nature/Growth",

      typeConfig: {
        school: "nature",
        icon: "Nature/Growth",
        tags: ["nature", "radiant", "buff"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "nature_sphere",
          "healing_sphere",
          "holy_sphere",
        ],
        resourceValues: {
          mana: 20,
          nature_sphere: 1,
          healing_sphere: 1,
          holy_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Floreo Bellum!",
        somaticText:
          "Shape the merged spheres into weapons of living wood and golden light, pressing them into the target's hands",
        spheres: ["Nature", "Healing", "Radiant"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "verdant_weapons",
            name: "Verdant Weapons",
            description:
              "Gain +2d6 damage on the next 3 attacks. Living wood and golden light wreath your weapon.",
            mechanicsText: "+2d6 damage on next 3 attacks",
            statModifier: {
              stat: "bonus_damage",
              formula: "2d6",
              triggers: 3,
            },
          },
          {
            id: "verdant_swiftness",
            name: "Verdant Swiftness",
            description:
              "Gain +10ft movement speed for 3 rounds. Nature energy quickens your steps.",
            mechanicsText: "+10ft movement speed for 3 rounds",
            statModifier: {
              stat: "movement_speed",
              magnitude: 10,
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

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["nature", "radiant", "buff"],
    },

    // ========================================
    // LEVEL 7 SPELLS (3-4 Sphere Combinations)
    // ========================================
    {
      id: "arc_phase_shift",
      name: "Phase Shift",
      description:
        "Weaves arcane, shadow, and chaos into a dimensional step that teleports you up to 40 feet, leaving behind a damaging void afterimage.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Quick Step",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Quick Step",
        tags: ["arcane", "necrotic", "chaos", "utility", "teleport", "damage"],
        castTime: 0,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "shadow_sphere",
          "chaos_sphere",
        ],
        resourceValues: {
          mana: 25,
          arcane_sphere: 1,
          shadow_sphere: 1,
          chaos_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Transitum Umbrae!",
        somaticText:
          "Press the three spheres together and step through the dimensional tear they create",
        spheres: ["Arcane", "Necrotic", "Chaos"],
      },

      effectTypes: ["utility", "damage"],

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          {
            id: "phase_shift_teleport",
            name: "Phase Shift",
            description:
              "Teleport up to 40 feet to an unoccupied space you can see.",
            mechanicsText: "Teleport up to 40 feet to unoccupied space (line of sight required)",
            distance: 40,
            needsLineOfSight: true,
          },
        ],
        durationValue: 0,
        durationType: "instant",
        durationUnit: "instant",
        concentration: false,
        power: "moderate",
      },

      damageConfig: {
        formula: "6d6 + intelligence",
        damageTypes: ["force"],
        triggerCondition: "area_entry",
        triggerDescription:
          "Enemies within 10 feet of your departure point take force damage from the void afterimage",
        areaShape: "circle",
        areaParameters: { radius: 10 },
        resolution: "DICE",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["arcane", "necrotic", "chaos", "utility", "teleport", "damage"],
    },

    {
      id: "arc_elemental_barrage",
      name: "Elemental Barrage",
      description:
        "Launches fire, ice, nature, and holy spheres simultaneously at a target area, creating a devastating prismatic explosion.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Rapid Fire Projectiles",

      typeConfig: {
        school: "fire",
        secondaryElement: "frost",
        icon: "Fire/Rapid Fire Projectiles",
        tags: ["fire", "frost", "nature", "radiant", "damage", "aoe"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 15 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "fire_sphere",
          "ice_sphere",
          "nature_sphere",
          "holy_sphere",
        ],
        resourceValues: {
          mana: 25,
          fire_sphere: 1,
          ice_sphere: 1,
          nature_sphere: 1,
          holy_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Elementum Procella!",
        somaticText:
          "Launch all four elemental spheres simultaneously at the target area",
        spheres: ["Fire", "Frost", "Nature", "Radiant"],
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "12d6 + intelligence",
        damageTypes: ["fire", "frost", "lightning", "radiant"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1,
      },

      tags: ["fire", "frost", "nature", "radiant", "damage", "aoe"],
    },

    {
      id: "arc_celestial_storm",
      name: "Celestial Storm",
      description:
        "Combines holy, healing, and arcane spheres into a radiant tempest that damages enemies and heals allies in the area.",
      level: 7,
      spellType: "ACTION",
      icon: "Radiant/Radiant Divinity",

      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Divinity",
        tags: ["radiant", "healing", "arcane", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingMode: "effect",
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },
      effectTargeting: {
        damage: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          targetRestrictions: ["enemy"],
        },
        healing: {
          targetingType: "area",
          rangeType: "ranged",
          rangeDistance: 60,
          aoeShape: "circle",
          aoeParameters: { radius: 20 },
          targetRestrictions: ["ally"],
        },
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "holy_sphere",
          "healing_sphere",
          "arcane_sphere",
        ],
        resourceValues: {
          mana: 25,
          holy_sphere: 1,
          healing_sphere: 1,
          arcane_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Tempestas Caelestis!",
        somaticText:
          "Raise all three spheres skyward, causing a radiant storm to descend upon the area",
        spheres: ["Radiant", "Healing", "Arcane"],
      },

      effectTypes: ["damage", "healing"],

      damageConfig: {
        formula: "10d6 + intelligence",
        damageTypes: ["radiant"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          {
            id: "celestial_blinding",
            name: "Celestial Blindness",
            description: "Targets caught in the celestial storm are blinded by searing radiance.",
            mechanicsText: "-2 to attack rolls for 2 rounds",
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 1,
      },

      tags: ["radiant", "healing", "arcane", "damage", "aoe"],
    },

    // ========================================
    // LEVEL 8 SPELLS (4-Sphere Ultimates)
    // ========================================
    {
      id: "arc_harmonic_convergence",
      name: "Harmonic Convergence",
      description:
        "Weaves holy, shadow, healing, and chaos into a prismatic pulse that heals allies and grants temporary damage resistance.",
      level: 8,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",

      typeConfig: {
        school: "radiant",
        icon: "Healing/Golden Heart",
        tags: ["radiant", "necrotic", "healing", "chaos", "buff", "aoe"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "holy_sphere",
          "shadow_sphere",
          "healing_sphere",
          "chaos_sphere",
        ],
        resourceValues: {
          mana: 28,
          holy_sphere: 1,
          shadow_sphere: 1,
          healing_sphere: 1,
          chaos_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Harmonia Convergentia!",
        somaticText:
          "Hold all four spheres at arm's length, letting them orbit and merge into a single chord of resonant energy",
        spheres: ["Radiant", "Necrotic", "Healing", "Chaos"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "harmonic_attunement_saves",
            name: "Harmonic Attunement: Warded",
            description:
              "All allies within range gain +2 to all saving throws and resistance to all damage types (half damage) for 2 rounds.",
            mechanicsText: "+2 to saving throws and resistance to all damage for 2 rounds",
            statModifier: {
              stat: "saving_throws",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
          {
            id: "harmonic_attunement_damage",
            name: "Harmonic Attunement: Empowered",
            description: "All allies within range gain +1d8 damage on their next spell or attack.",
            mechanicsText: "+1d8 damage on next attack or spell",
            statModifier: {
              stat: "bonus_damage",
              formula: "1d8",
              triggers: 1,
            },
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 4,
      },

      tags: ["radiant", "necrotic", "healing", "chaos", "buff", "aoe"],
    },

    {
      id: "arc_elemental_maelstrom",
      name: "Elemental Maelstrom",
      description:
        "Forces arcane, fire, ice, and nature into a volatile fusion that creates a raging elemental storm, damaging and disorienting all within.",
      level: 8,
      spellType: "ACTION",
      icon: "Fire/Rapid Fire Projectiles",

      typeConfig: {
        school: "force",
        secondaryElement: "fire",
        icon: "Fire/Rapid Fire Projectiles",
        tags: ["arcane", "fire", "frost", "nature", "damage", "control", "aoe"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "fire_sphere",
          "ice_sphere",
          "nature_sphere",
        ],
        resourceValues: {
          mana: 28,
          arcane_sphere: 1,
          fire_sphere: 1,
          ice_sphere: 1,
          nature_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Maelstrom Elementum!",
        somaticText:
          "Compress the four conflicting spheres into one unstable mass and hurl it at the target area",
        spheres: ["Arcane", "Fire", "Frost", "Nature"],
      },

      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "14d6 + intelligence",
        damageTypes: ["fire", "frost", "lightning", "force"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "incapacitation",
        strength: "moderate",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "constitution",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "elemental_disorientation",
            name: "Elemental Disorientation",
            description:
              "The chaotic elemental barrage has overwhelmed your senses. Movement speed halved, -2 to attack rolls for 1 round.",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              saveType: "constitution",
              saveDC: 17,
              durationValue: 1,
              durationUnit: "rounds",
              movementPenalty: -50,
              accuracyPenalty: -2,
            },
          },
        ],
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["arcane", "fire", "frost", "nature", "damage", "control", "aoe"],
    },

    {
      id: "arc_chaos_storm",
      name: "Chaos Storm",
      description:
        "Concentrates chaos energy with two other elemental spheres into a whirlwind of random elemental forces that deals unpredictable damage over a wide area.",
      level: 8,
      spellType: "ACTION",
      icon: "Void/Corrupted Eye",

      typeConfig: {
        school: "chaos",
        icon: "Void/Corrupted Eye",
        tags: ["chaos", "damage", "aoe"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "chaos_sphere"],
        resourceValues: { mana: 28, chaos_sphere: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Tempestas Chaos!",
        somaticText:
          "Compress two chaos spheres into a single unstable point and release it",
        spheres: ["Chaos", "Chaos", "Chaos"],
      },

      effectTypes: ["damage"],

      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Chaos Storm",
          description: "Roll 1d4 to determine the type of chaotic elemental destruction.",
          diceFormula: "1d4",
          resolutionType: "DICE",
          resolutionConfig: { diceType: "d4" },
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Elemental Cascade",
              effect: "15ft radius, 14d6+INT chaos damage, all enemies",
            },
            {
              range: { min: 2, max: 2 },
              customName: "Gravity Well",
              effect: "20ft radius, 10d6+INT chaos damage, all enemies pulled to center",
            },
            {
              range: { min: 3, max: 3 },
              customName: "Bifurcation",
              effect: "Two 8d6+INT chaos bolts hitting separate targets",
            },
            {
              range: { min: 4, max: 4 },
              customName: "Feedback Loop",
              effect: "12d6+INT chaos damage to enemies, all allies in 20ft radius gain +2 Armor for 3 rounds",
            },
          ],
        },
      },

      damageConfig: {
        formula: "12d6 + intelligence",
        damageTypes: ["chaos"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 16,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 2,
      },

      tags: ["chaos", "damage", "aoe"],
    },

    // ========================================
    // LEVEL 9 SPELLS (Powerful w/ real tradeoffs)
    // ========================================
    {
      id: "arc_primal_cataclysm",
      name: "Primal Cataclysm",
      description:
        "Channels all eight elemental spheres into a prismatic shockwave that deals massive damage of every element type. Causes painful backlash to the caster.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",

      typeConfig: {
        school: "force",
        secondaryElement: "chaos",
        icon: "Arcane/Ebon Blaze",
        tags: ["ultimate", "damage", "aoe", "all elements", "self damage"],
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 80,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "holy_sphere",
          "shadow_sphere",
          "fire_sphere",
          "ice_sphere",
          "nature_sphere",
          "healing_sphere",
          "chaos_sphere",
        ],
        resourceValues: {
          mana: 32,
          arcane_sphere: 1,
          holy_sphere: 1,
          shadow_sphere: 1,
          fire_sphere: 1,
          ice_sphere: 1,
          nature_sphere: 1,
          healing_sphere: 1,
          chaos_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Elementum Cataclysmos!",
        somaticText:
          "Force all eight spheres into a single volatile point of prismatic energy",
        spheres: [
          "Arcane",
          "Radiant",
          "Necrotic",
          "Fire",
          "Frost",
          "Nature",
          "Healing",
          "Chaos",
        ],
      },

      effectTypes: ["damage"],

      damageConfig: {
        formula: "18d6 + intelligence",
        damageTypes: [
          "fire",
          "frost",
          "lightning",
          "radiant",
          "necrotic",
          "force",
          "chaos",
        ],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      selfDamageConfig: {
        formula: "2d6",
        damageTypes: ["force"],
        description: "Elemental backlash from combining opposing elements",
      },

      cooldownConfig: {
        cooldownType: "encounter",
        cooldownValue: 1,
        description: "Once per combat",
      },

      tags: ["ultimate", "damage", "aoe", "all elements", "self damage"],
    },

    {
      id: "arc_chaos_vortex",
      name: "Chaos Vortex",
      description:
        "Concentrates four chaos spheres into a swirling vortex of unpredictable destruction that deals random elemental damage and causes chaotic feedback.",
      level: 9,
      spellType: "ACTION",
      icon: "Void/Corrupted Eye",

      typeConfig: {
        school: "chaos",
        icon: "Void/Corrupted Eye",
        tags: ["chaos", "damage", "aoe", "ultimate", "self damage"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: ["mana", "chaos_sphere"],
        resourceValues: { mana: 32, chaos_sphere: 4 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Chaos Vorticem!",
        somaticText:
          "Spiral hands to concentrate chaos energy into an unstable vortex",
        spheres: ["Chaos", "Chaos", "Chaos", "Chaos"],
      },

      effectTypes: ["damage"],

      mechanicsConfig: {
        rollableTable: {
          enabled: true,
          tableName: "Chaos Vortex",
          description: "Roll 1d6 to determine the vortex's chaotic manifestation.",
          diceFormula: "1d6",
          resolutionType: "DICE",
          resolutionConfig: { diceType: "d6" },
          entries: [
            {
              range: { min: 1, max: 1 },
              customName: "Annihilation",
              effect: "20d6+INT chaos damage in 25ft radius, all creatures (including allies)",
            },
            {
              range: { min: 2, max: 2 },
              customName: "Siphon Storm",
              effect: "14d6+INT chaos damage, all allies in radius gain +2d6 damage on next attack for 3 rounds",
            },
            {
              range: { min: 3, max: 3 },
              customName: "Gravity Collapse",
              effect: "12d6+INT chaos damage, all enemies pulled to center and restrained 1 round",
            },
            {
              range: { min: 4, max: 4 },
              customName: "Elemental Barrage",
              effect: "16d6+INT damage split evenly across 4 random elements (fire, frost, lightning, radiant)",
            },
            {
              range: { min: 5, max: 5 },
              customName: "Time Warp",
              effect: "10d6+INT chaos damage, all enemies in area lose their next turn",
            },
            {
              range: { min: 6, max: 6 },
              customName: "Chaos Perfection",
              effect: "Choose any of the above effects",
            },
          ],
        },
      },

      damageConfig: {
        formula: "16d6 + intelligence",
        damageTypes: ["chaos"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 17,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      selfDamageConfig: {
        formula: "1d8",
        damageTypes: ["chaos"],
        description: "Chaotic energy feedback from concentrated entropy",
      },

      cooldownConfig: {
        cooldownType: "encounter",
        cooldownValue: 1,
        description: "Once per combat",
      },

      tags: ["chaos", "damage", "aoe", "ultimate", "self damage"],
    },

    {
      id: "arc_arcane_synthesis",
      name: "Arcane Synthesis",
      description:
        "Harmonizes four opposing elements to enhance allies' combat capabilities with boosted attacks, spell damage, and regeneration. Leaves the caster briefly drained.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Missile",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Missile",
        tags: ["arcane", "radiant", "necrotic", "fire", "buff", "healing", "aoe"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["ally", "self"],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "holy_sphere",
          "shadow_sphere",
          "fire_sphere",
        ],
        resourceValues: {
          mana: 32,
          arcane_sphere: 1,
          holy_sphere: 1,
          shadow_sphere: 1,
          fire_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Synthesis Elementum!",
        somaticText:
          "Weave four opposing elements into a state of perfect harmony, releasing the balanced energy outward",
        spheres: ["Arcane", "Radiant", "Necrotic", "Fire"],
      },

      effectTypes: ["buff", "healing", "debuff"],

      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "elemental_synthesis",
            name: "Elemental Synthesis",
            description:
              "All allies gain +3 to attack rolls, +2 to spell damage, and regenerate 1d4 HP at the start of each turn for 3 rounds.",
            mechanicsText: "+3 attack, +2 spell damage, 1d4 regen/turn for 3 rounds",
          },
          {
            id: "synthesis_overflow",
            name: "Synthesis Overflow",
            description: "The elemental fusion instantly restores 4 random spheres to your bank.",
            mechanicsText: "Restore 4 random spheres to your bank",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "synthesis_drain",
            name: "Synthesis Drain",
            description:
              "The caster has -2 to spell attack rolls for 1 round from the strain of balancing opposing elements.",
            mechanicsText: "-2 to spell attack rolls for 1 round (self)",
            isSelfDebuff: true,
            statPenalty: { stat: "spell_attack", value: -2 },
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "turn_based",
        cooldownValue: 5,
      },

      tags: ["arcane", "radiant", "necrotic", "fire", "buff", "healing", "aoe"],
    },

    // ========================================
    // LEVEL 10 SPELLS (Capstones)
    // ========================================
    {
      id: "arc_elemental_convergence",
      name: "Elemental Convergence",
      description:
        "Forces seven elemental spheres into a single convergence point that detonates in cascading elemental destruction. Leaves the caster exhausted and takes self damage.",
      level: 10,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",

      typeConfig: {
        school: "force",
        secondaryElement: "fire",
        icon: "Arcane/Ebon Blaze",
        tags: [
          "ultimate",
          "damage",
          "aoe",
          "mastery",
          "self damage",
          "exhaustion",
        ],
        castTime: 3,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "holy_sphere",
          "shadow_sphere",
          "fire_sphere",
          "ice_sphere",
          "nature_sphere",
          "healing_sphere",
        ],
        resourceValues: {
          mana: 36,
          arcane_sphere: 1,
          holy_sphere: 1,
          shadow_sphere: 1,
          fire_sphere: 1,
          ice_sphere: 1,
          nature_sphere: 1,
          healing_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Convergentia Elementum!",
        somaticText:
          "Force all seven spheres into a single convergence point above your head, then release the cascading detonation",
        spheres: [
          "Arcane",
          "Radiant",
          "Necrotic",
          "Fire",
          "Frost",
          "Nature",
          "Healing",
        ],
      },

      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "20d6 + intelligence",
        damageTypes: [
          "fire",
          "frost",
          "lightning",
          "radiant",
          "necrotic",
          "force",
        ],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 18,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      selfDamageConfig: {
        formula: "3d6",
        damageTypes: ["force"],
        description: "Severe elemental backlash from convergence strain",
      },

      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id: "convergence_exhaustion",
            name: "Convergence Exhaustion",
            description:
              "The caster cannot cast spells requiring 3+ spheres until end of next turn. The immense strain of convergence leaves your body trembling.",
            mechanicsText:
              "Cannot cast spells requiring 3+ spheres until end of next turn",
            isSelfDebuff: true,
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      cooldownConfig: {
        cooldownType: "encounter",
        cooldownValue: 1,
        description: "Once per combat",
      },

      tags: [
        "ultimate",
        "damage",
        "aoe",
        "mastery",
        "self damage",
        "exhaustion",
      ],
    },

    {
      id: "arc_dimensional_rift",
      name: "Dimensional Rift",
      description:
        "Tears open a rift between dimensions using arcane, shadow, and chaos spheres. Bombards nearby enemies with void energy and causes dimensional disorientation. Causes void feedback to the caster.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Shadowy Blaze",

      typeConfig: {
        school: "force",
        secondaryElement: "necrotic",
        icon: "Fire/Shadowy Blaze",
        tags: ["ultimate", "damage", "control", "aoe", "void", "self damage"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: [],
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "arcane_sphere",
          "shadow_sphere",
          "chaos_sphere",
        ],
        resourceValues: {
          mana: 36,
          arcane_sphere: 1,
          shadow_sphere: 1,
          chaos_sphere: 2,
        },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
        verbalText: "Rima Dimensio!",
        somaticText:
          "Tear reality apart with a sharp pulling motion, opening a swirling void portal",
        spheres: ["Arcane", "Necrotic", "Chaos", "Chaos"],
      },

      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "18d6 + intelligence",
        damageTypes: ["force", "necrotic"],
        resolution: "DICE",
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 18,
          partialEffect: true,
          partialEffectFormula: "damage/2",
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "incapacitation",
        strength: "strong",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 18,
        saveType: "constitution",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 18,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "void_disorientation",
            name: "Void Disorientation",
            description:
              "Reality warps around you. Disadvantage on attacks, cannot take reactions, movement speed halved for 1 round.",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              saveType: "constitution",
              saveDC: 18,
              durationValue: 1,
              durationUnit: "rounds",
              movementPenalty: -50,
              accuracyPenalty: -99,
              loseReactions: true,
            },
          },
        ],
      },

      selfDamageConfig: {
        formula: "2d6",
        damageTypes: ["necrotic"],
        description: "Void energy feedback from unstable rift",
      },

      cooldownConfig: {
        cooldownType: "encounter",
        cooldownValue: 1,
        description: "Once per combat",
      },

      tags: ["ultimate", "damage", "control", "aoe", "void", "self damage"],
    },

    {
      id: "arc_elemental_apotheosis",
      name: "Elemental Apotheosis",
      description:
        "Absorbs six elemental spheres into your body, becoming a living conduit of elemental force with boosted damage, armor, and resistance for a brief time.",
      level: 10,
      spellType: "ACTION",
      icon: "Fire/Volcanic Erupt",

      typeConfig: {
        school: "arcane",
        icon: "Fire/Volcanic Erupt",
        tags: ["ultimate", "buff", "transformation", "mastery"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self_centered",
      },

      resourceCost: {
        resourceTypes: [
          "mana",
          "fire_sphere",
          "ice_sphere",
          "nature_sphere",
          "holy_sphere",
          "shadow_sphere",
          "arcane_sphere",
        ],
        resourceValues: {
          mana: 36,
          fire_sphere: 1,
          ice_sphere: 1,
          nature_sphere: 1,
          holy_sphere: 1,
          shadow_sphere: 1,
          arcane_sphere: 1,
        },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Apotheosis Elementum!",
        somaticText:
          "Press all six spheres against your chest, absorbing them into your body in a prismatic flash",
        spheres: ["Fire", "Frost", "Nature", "Radiant", "Necrotic", "Arcane"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "elemental_apotheosis",
            name: "Elemental Apotheosis",
            description:
              "4 rounds: +4 spell damage, +3 armor, fire/frost/lightning resistance, 2-sphere spells cost half mana (rounded down). Your body radiates prismatic elemental energy as a living conduit of force.",
            mechanicsText: "+4 spell damage, +3 armor, elemental resistance, half mana on 2-sphere spells for 4 rounds",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: false,
      },

      cooldownConfig: {
        cooldownType: "encounter",
        cooldownValue: 1,
        description: "Once per combat",
      },

      tags: ["ultimate", "buff", "transformation", "mastery"],
    },

    {
      id: "arc_sphere_exhaustion",
      name: "Sphere Exhaustion",
      description:
        "If you end your turn with 0 spheres banked, you take -1 to all spell damage on your next turn. Going all-out has a cost -- conserve or suffer.",
      level: 1,
      spellType: "PASSIVE",
      effectTypes: ["debuff"],
      typeConfig: {
        school: "arcane",
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: [],
        resourceValues: {},
        actionPoints: 0,
      },
      resolution: "PASSIVE",
      tags: ["passive", "arcane", "debuff", "mechanic"],
    },
  ],
};
