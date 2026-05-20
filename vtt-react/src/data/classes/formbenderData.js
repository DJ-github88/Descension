/**
 * Formbender Class Data
 *
 * Complete class information for the Formbender - a shapeshifter who harnesses
 * primal forms through the Wild Instinct resource system.
 */

export const FORMBENDER_DATA = {
  id: "formbender",
  name: "Formbender",
  icon: "fas fa-paw",
  role: "Hybrid (Tank/Damage/Support)",
  damageTypes: ["nature", "bludgeoning"],

  overview: {
    title: "The Formbender",
    subtitle: "The Animal Behind the Mask",

    quickOverview: {
      title: "Quick Overview",
      content: `**TL;DR**: You are not a person who turns into animals. You are an animal that learned to wear a human shape. Every transformation is a mutilation â€” bones snap, skin splits, and something *hungry* grins out from behind your eyes. Wild Instinct (0-15) fuels your forms. Humanity Erosion (0-10) tracks how much of *you* survives each shift.

**What You Need to Know**: The Formbender doesn't channel nature â€” they *violate* it. Your body is a lie you tell the world, and four stolen forms (Nightstalker, Ironhide, Skyhunter, Frostfang) are the truth bleeding through. Wild Instinct (0-15) grows through form-specific violence. Each transformation costs 1 WI and adds +1 Erosion to your Humanity tracker.

**Core Mechanic**: Choose opening form (free WI, but still +1 Erosion) â†’ Generate WI through form-aligned carnage â†’ Spend on abilities or form switches â†’ Watch your Humanity erode as the animal takes over

**Resources**:
- **Wild Instinct (0-15)**: Generated through form-specific combat actions. Halves between fights. Three bands: Instinct (1-5 WI), Surge (6-10 WI), Apex (11-15 WI).
- **Humanity Erosion (0-10)**: Every form shift adds +1 Erosion. At 3+: lose speech. At 5+: can't use items. At 7+: attack allies. At 10: the GM plays your character.

**Fatal Flaw**: You permanently take +50% Psychic damage. The human mind is a wound that never closes.

**Why Bring Me?**: You are the only class that can completely rewrite your physical stats, movement types, and damage resistances mid-combat. Need to fly? Grow wings. Need to breathe water? Grow gills. Need to be immune to fire? Steal a salamander's form. Infinite biological problem-solving.

**Playstyle**: High-risk adaptive horror â€” fluid role-switching that costs your humanity

**Best For**: Players who want tactical omniplicity and are willing to pay for it in flesh, sanity, and the slow death of their human self`,
    },

    description: `Something that was born in the dark places between flesh and fur, wearing a human face like a mask that doesn't quite fit. Four stolen shapes â€” Nightstalker, Ironhide, Skyhunter, Frostfang â€” tear free when the mask slips. Every transformation is a small death. Every reversion is a resurrection nobody asked for.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**TL;DR**: You are not a person who turns into animals â€” you are an animal who learned to wear a human shape. Every transformation peels back the disguise. The question isn't whether you'll lose yourself. The question is whether there was ever a "you" to lose.

**The Lie of Humanity**: Formbenders do not *become* animals. They *cease pretending* to be human. Your human body is a prison you built from meat and manners, and every transformation is a jailbreak written in blood and snapping cartilage. You don't commune with nature â€” you *are* the part of nature that civilization walled out and forgot to feed.

**The Erosion**: With every shift, the animal mind grows stronger. You lose the ability to speak. You forget your allies' names. You stop seeing friends and start seeing *pack* and *prey*. The human consciousness fights a losing war against instincts older than language. Psychic attacks don't just hurt you â€” they unmask you.

**The Horror**: Other shapeshifters talk about "harmony with the wild." You know the truth. There is no harmony. There is only the animal, wearing your skin, waiting for you to slip. The wolf doesn't serve you. *You serve the wolf.* And one day, you'll stop serving and start *being*.`,
    },

    combatRole: {
      title: "Combat Role",
      content: `**TL;DR**: Your role is whatever the fight needs. Nightstalker = predator's ambush. Ironhide = meat shield built from rage and scar tissue. Skyhunter = aerial horror. Frostfang = pack mentality. Switch forms to match the threat â€” but every switch costs a piece of your humanity.

**Infinite Adaptation**: The Formbender's singular utility is total biological flexibility. No other class can rewrite their own physical stats, movement types, damage resistances, and sensory capabilities on the fly. You are the answer to every problem â€” but the answer always has teeth.

**Resource Tension**: Wild Instinct fuels your transformations and abilities. Humanity Erosion is the toll. You must balance raw tactical power against the creeping loss of your human mind. A Formbender who shifts too freely becomes a liability â€” attacking allies, unable to speak, unable to stop.

**The Fatal Flaw**: You are permanently vulnerable to Psychic damage (+50%). Your human consciousness is a bleeding wound the animal keeps biting. Mind-affecting effects bypass your transformed resilience entirely â€” the armor protects the flesh, not the mind wearing it.`,
    },

    playstyle: {
      title: "Playstyle",
      content: `**TL;DR**: Shift forms (free first, 1 WI after). Generate WI through form-specific violence. Watch Erosion climb. At 3 Erosion, you can't speak. At 5, you can't use items. At 7, you attack your friends. Choose wisely.

**The Transformation Economy**:
- **Opening Shift**: Free WI cost (but +1 Erosion). Choose your predator.
- **Standard Shift**: -1 WI, +1 Erosion. The bone-snap tax.
- **Forced Reversion**: +2 Erosion. The body rejects the lie.

**Form-Specific WI Generation**:
- **Nightstalker**: Ambush from stealth â†’ +2 WI on hit
- **Ironhide**: Each enemy that attacks you â†’ +1 WI (max 3/round)
- **Skyhunter**: Dive attack from above â†’ +2 WI on hit
- **Frostfang**: Attack same target as ally â†’ +2 WI on hit

**Humanity Erosion Thresholds**:
- **0-2 Erosion**: "The Mask Holds." You are functional. Barely.
- **3-4 Erosion**: "Fading." Cannot speak or understand Common. Disadvantage on Intelligence checks.
- **5-6 Erosion**: "Slipping." Cannot use items. Must pass Wisdom save DC 13 to revert voluntarily.
- **7-9 Erosion**: "Feral." Each round, Wisdom save DC 14 or attack nearest creature (ally or enemy).
- **10 Erosion**: "Lost." GM controls your character until combat ends. You are the animal now.

**Recovery**: Erosion decreases by 3 after a Short Rest. Resets to 0 after a Long Rest.`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Mask Slips",
      content: `**TL;DR**: Nightstalker ambush (free, Erosion +1) â†’ Ironhide tank (1 WI, Erosion 2) â†’ Skyhunter pursuit (1 WI, Erosion 3 â†’ CAN'T SPEAK) â†’ The party watches something wearing their friend's face try to remember how to be human. The lesson: every shift has a cost beyond WI.

**The Setup**: You're a Formbender ambushing bandits in a forest clearing. 3 bandits + 1 bandit leader. Your party's fighter and mage are with you. Starting WI: 4 (halved from last fight). Erosion: 0.

**Starting State**: WI: 4/15 | HP: 75/75 | Erosion: 0/10 | Form: Human

---

**Turn 1 - The First Mask (WI: 4 â†’ 2, Erosion: 0 â†’ 1, Form: Human â†’ Nightstalker)**

*You crouch in the treeline. Your spine crackles as vertebrae rearrange. Fur erupts through splitting skin. Your jaw elongates with a wet crunch. Something that was purring replaces the thing that was breathing.*

**Free Shift**: Transform into Nightstalker (0 WI, but +1 Erosion â†’ 1)
*Effect*: Black fur, yellow eyes, advantage on stealth. The mask has slipped once.

**Your Action**: Ambush Strike on Bandit #1 (spend 2 WI, Tier 2: 2d6 slashing + Bleeding)
**Attack Roll**: d20+6 (advantage from stealth) â†’ [15] = Hit!
**Damage**: 2d6 â†’ [5, 4] = 9 slashing. Bandit #1 crumples, bleeding.
**WI Generated**: +2 WI (Ambush from Stealth)

*You land on the bandit's chest. Your claws are inside his ribcage. The taste of iron floods your elongated snout. Something in the back of your skull â€” the human part â€” is screaming. The rest of you is purring.*

**Wild Instinct**: 4 - 2 + 2 = **4 WI** | **Erosion: 1**

**Bandit #2's Turn**: Attacks your fighter â†’ 8 damage
**Bandit #3's Turn**: Attacks your fighter â†’ 6 damage
**Bandit Leader's Turn**: Sees you. Goes pale. Attacks your fighter â†’ 12 damage.

---

**Turn 2 - The Second Face (WI: 4 â†’ 3, Erosion: 1 â†’ 2, Form: Nightstalker â†’ Ironhide)**

*The bandits are swarming your fighter. Your mage is exposed. You need to be bigger. You need to be *more*. Your Nightstalker form convulses â€” the fur falls out in clumps as your skeleton detonates outward.*

**Shift**: Transform into Ironhide (-1 WI, +1 Erosion â†’ 2)
**Ironhide Passive**: +20 max HP (75 â†’ 95). Current HP heals to 95.

*Your skin splits along the spine. Thick, calloused hide rolls out like a carpet of scar tissue. Your hands become something that shouldn't exist â€” heavy, splayed, built for crushing. A sound comes out of your throat that has no name in any human language.*

**Your Action**: Taunt all enemies toward you (Ironhide form action)
**Effect**: All bandits must attack you. +1 WI per enemy that does.

**Bandit #1's Turn**: Bleeding out. Skips turn.
**Bandit #2's Turn**: Attacks you â†’ 10 damage (reduced to 8). +1 WI.
**Bandit #3's Turn**: Attacks you â†’ 8 damage (reduced to 6). +1 WI.
**Bandit Leader's Turn**: Attacks you â†’ 16 damage (reduced to 12). +1 WI.

**Wild Instinct**: 4 - 1 + 3 = **6 WI** | **Erosion: 2** | HP: 95 - 26 = **69/95**

*Three weapons bounce off your hide. You barely feel it. The human part of you is getting quieter. That's fine. You don't need it right now.*

---

**Turn 3 - The Breaking Point (WI: 6 â†’ 3, Erosion: 2 â†’ 3, Form: Ironhide â†’ Skyhunter)**

*The leader is wounded. Trying to run. You need to fly. Your massive form begins to collapse inward â€” ribs cracking, shoulders dislocating, wings tearing through shoulder blades in gouts of dark fluid.*

**Shift**: Transform into Skyhunter (-1 WI, +1 Erosion â†’ **3**)
âš ï¸ **EROSION 3 â€” "FADING": You can no longer speak or understand Common.**

*Your beak opens and a word tries to come out. It doesn't. The sounds that emerge are clicks, shrieks, the language of things that nest in carrion trees. Your fighter is shouting something at you. You hear only noise.*

**Wild Instinct**: 6 - 1 = **5 WI** | **Erosion: 3** | HP: 49/75

**Your Action**: Talon Dive on Bandit Leader (1 WI, Tier 1: 1d6 + grapple)
**Attack Roll**: d20+6 â†’ [17] = Hit!
**Damage**: 1d6 â†’ [5] = 5 slashing + Grappled
**WI Generated**: +2 WI (Dive Attack on hit)

**Wild Instinct**: 5 - 1 + 2 = **6 WI** | **Erosion: 3**

*You plummet from fifty feet. Your talons â€” they're not talons, they're *your fingers*, you tell yourself, except they're not â€” pierce his shoulder. He screams. You don't understand screaming anymore.*

---

**Turn 4 - The Kill (WI: 6 â†’ 4, Erosion: 3 â†’ 3, Form: Skyhunter)**

*The leader is grappled. Your fighter closes in.*

**Your Action**: Talon Dive again (spend 2 WI, Tier 2: 2d6)
**Attack Roll**: d20+6 â†’ [13] = Hit!
**Damage**: 2d6 â†’ [4, 5] = 9 slashing.
**WI Generated**: +2 WI (Dive Attack on hit)

**Your fighter's Turn**: Attacks the grappled leader â†’ 18 damage. **DEAD.**

**Combat Over**

---

**The Aftermath**

*You land in the clearing. Blood on your beak. Your wings fold â€” wrong, they fold wrong, joints bending in directions human arms shouldn't. Your party stares at you.*

*Your fighter says your name. You tilt your head. The sound means nothing. You try to say his name back, but what comes out is a shriek that makes the mage flinch.*

*You shift back to human form. The reversion is worse than the transformation â€” everything crams back into a shape that doesn't fit, bones grinding into sockets that are too small, organs settling into places they don't remember. You open your mouth to speak and for a long, terrible moment, nothing happens.*

*Then, quietly: "...I'm fine."*

*Nobody believes you.*

**Final State**: WI: 6/15 (halves to 3 between fights) | HP: 49/75 | **Erosion: 3** (Fading â€” can't speak Common until Short Rest reduces Erosion by 3)

---

**The Lesson**:
1. **Erosion Is The Real Cost**: You shifted 3 times. That's 3 Erosion. You lost the ability to speak to your own party. Next fight, if you shift 2 more times, you hit Erosion 5 and can't use items.
2. **The Fatal Flaw Is Permanent**: If that bandit leader had dealt psychic damage instead of physical, you'd have taken +50%. Your human mind is always exposed.
3. **Adaptation Has A Price**: The Skyhunter shift was tactically correct â€” you stopped the leader from escaping. But it cost you your voice. Your party had to watch something wearing your face forget how to speak.
4. **Resource Tension**: WI is the *immediate* resource. Erosion is the *strategic* resource. Managing both is the core of the class.
5. **The Horror Is The Point**: You are not a druid. You are not a guardian. You are the thing in the forest that the wolves are afraid of.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Wild Instinct & Humanity Erosion",
    subtitle: "The Fuel and the Toll",

    description: `The Formbender does not *cast* â€” they *rupture*. Wild Instinct (0-15) is the biological fury that powers your stolen forms, generated through form-specific violence. But every transformation is a tax on your human mind, tracked by **Humanity Erosion** (0-10). WI is the fuel. Erosion is the price. Manage both, or become the animal permanently.`,

    cards: [
      {
        title: "Wild Instinct (WI)",
        stats: "0-15 Capacity",
        details:
          "Biological fury that fuels transformations and abilities. Halves (rounded down) between combats as the bloodlust cools.",
      },
      {
        title: "Humanity Erosion",
        stats: "0-10 Tracker",
        details:
          "Every form shift adds +1 Erosion (+2 if forced reversion). At 3+: lose speech. At 5+: can't use items. At 7+: attack allies. At 10: GM controls your character.",
      },
      {
        title: "The Four Forms",
        stats: "Night, Iron, Sky, Frost",
        details:
          "Each form has unique passives and generation methods. Your first transformation in combat is free (WI), but still costs +1 Erosion.",
      },
      {
        title: "Form-Matched Spells",
        stats: "-1 WI Cost",
        details:
          "Casting a spell that matches your current form reduces its Wild Instinct cost by 1 (min 1).",
      },
    ],

    generationTable: {
      headers: ["Action", "Form Required", "WI Change", "Erosion", "Notes"],
      rows: [
        [
          "Opening Shift",
          "Human",
          "FREE",
          "+1",
          "First transform of combat. Free WI, but still erodes humanity.",
        ],
        [
          "Standard Shift",
          "Any",
          "-1 WI",
          "+1",
          "Every bone-snap costs a piece of your soul.",
        ],
        [
          "Forced Reversion",
          "Any",
          "WI â†’ 0",
          "+2",
          "Dispelled, knocked out, or forcibly ended. Double erosion.",
        ],
        [
          "Ambush from Stealth",
          "Nightstalker",
          "+2 WI",
          "â€”",
          "Must attack from stealth. Generated on hit.",
        ],
        [
          "Taunt/Tanking",
          "Ironhide",
          "+1 WI/enemy",
          "â€”",
          "Each enemy attacking you generates +1 WI (max +3/round).",
        ],
        [
          "Protecting an Ally",
          "Ironhide",
          "+2 WI",
          "â€”",
          "Take an attack meant for an adjacent ally (reaction).",
        ],
        [
          "Dive Attack",
          "Skyhunter",
          "+2 WI",
          "â€”",
          "Attack from above while flying. Generated on hit.",
        ],
        [
          "Scout/Recon",
          "Skyhunter",
          "+1 WI",
          "â€”",
          "Spend an action to survey from above.",
        ],
        [
          "Pack Tactics Attack",
          "Frostfang",
          "+2 WI",
          "â€”",
          "Attack the same target as an ally. Generated on hit.",
        ],
        [
          "Tracking",
          "Frostfang",
          "+1 WI",
          "â€”",
          "Spend an action to track or detect hidden enemies.",
        ],
        [
          "Savage Rend",
          "Any Form",
          "+1 WI",
          "â€”",
          "Basic melee with claws/fangs. Generated on hit.",
        ],
      ],
    },

    usage: {
      momentum:
        "Each form is a weapon. Open in Nightstalker for an ambush (+2 WI), then switch to Ironhide (-1 WI, +1 Erosion) to absorb the counter-attack. The animal gives you power. The erosion takes your humanity.",
      flourish:
        "âš ï¸ Revert Clause: If knocked to 0 HP, you auto-revert to human form, lose all WI, and suffer +2 Erosion. The body rejects the lie violently.",
    },

    overheatRules: {
      title: "Primal Exhaustion",
      content: `Shapeshifting puts extreme strain on the mortal frame.

**The Trigger**: If you hit 0 WI while transformed, OR reduced to 0 HP (auto-revert, WI â†’ 0, +2 Erosion).

**The Effect**: **Primal Exhaustion**. Stunned for 1 turn. Cannot transform again until you spend a full Action "Centering" yourself (a painful process of shoving the animal back into its cage).

**The Guardrail**: Always keep at least 1 WI banked. Not for efficiency â€” for survival.`,
    },

    humanityErosionRules: {
      title: "Humanity Erosion Tracker",
      content: `The animal mind grows stronger with every transformation. Track your Erosion (0-10). Recovery: -3 after Short Rest, reset to 0 after Long Rest.

**Erosion Thresholds**:
- **0-2 ("The Mask Holds")**: You pass. Mostly. Disadvantage on Charisma (Persuasion) checks â€” something in your eyes isn't quite right.
- **3-4 ("Fading")**: Cannot speak or understand Common. Disadvantage on Intelligence checks. You make sounds, but they're not words.
- **5-6 ("Slipping")**: Cannot use items (weapons, potions, tools). Must pass Wisdom save DC 13 to revert voluntarily. Your hands don't work the way they used to.
- **7-9 ("Feral")**: Each round, Wisdom save DC 14 or attack nearest creature (ally or enemy). You cannot tell friend from prey.
- **10 ("Lost")**: GM controls your character until combat ends. You are the animal. There is no human left to argue.

**The Permanent Wound**: You permanently take +50% Psychic damage. This is not tracked by Erosion â€” it is always active. The human consciousness is a wound that never closes, and every psychic attack tears it wider.`,
    },

    strategicConsiderations: {
      title: "The Cost of Adaptation",
      content: `**Metamorph Spec**: Merging two forms costs 2 WI and +2 Erosion (both forms are breaking through at once). Devastating but accelerates your loss of humanity.

**Erosion Management**: A typical combat involves 2-3 shifts (Erosion 2-3). You'll hit "Fading" most fights. If you push to 5+ shifts, you lose items. If you hit 7, you become a danger to your party. The optimal Formbender knows when to stop adapting and start surviving.

**Form Thief Spec**: Stolen forms cost 0 WI to absorb on kill (instinctive). But they only last the current combat. To permanently learn a stolen form, you must rest for 10 minutes and pass a Constitution save (DC 10 + creature's CR). Failure: take 2d6 necrotic rejection damage and the form is lost.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Erosion Tokens",
      content: `Shapeshifting should feel like a loss of control. Use these hacks:

**Required Materials**:
- **15 Green Tokens**: Wild Instinct (the fuel).
- **10 Red Tokens**: Erosion (the toll).
- **4 Form Cards**: Large index cards with form art and stats.
- **4 Distinct Minis**: Cat, Bear, Bird, Wolf.

**The Physical Hack**:
- **The Active Card**: Place your current Form Card on top of your character sheet. When you transform, physically swap the card and miniature.
- **The Instinct Pile**: Green tokens in a bowl. The pile shows your available power.
- **The Erosion Track**: Red tokens in a LINE on the table. Everyone can see how close you are to losing control. When you hit 3, the GM announces: "You can't speak." When you hit 7, the table goes quiet.
- **The Decay Check**: End of combat â€” half the green tokens go back. The red tokens stay until you rest.

**Pro Tip**: When you hit Erosion 3+, stop using your normal voice. Click, growl, or just point. Your party will understand what you've lost.`,
    },
  },

  // Specializations
  specializations: {
    title: "Formbender Specializations",
    subtitle: "Three Paths of Biological Horror",

    description: `**TL;DR**: Metamorph builds chimeric abominations from two forms at once. Form Thief steals the shapes of the dead â€” free on kill, but must pass a Constitution save during rest to keep them permanently. Primordial replaces animal flesh with elemental nightmare. Each path accelerates your erosion in different ways.

The Formbender's specializations are not schools of thought â€” they are different severities of the same disease. Metamorphs let too many animals in at once. Form Thieves steal what was never theirs. Primordials burn away the flesh entirely and replace it with something older. All three end in the same place: the human mind, devoured.`,

    passiveAbility: {
      name: "Primal Attunement",
      description:
        "All Formbenders can transform into four base forms (Nightstalker, Ironhide, Skyhunter, Frostfang) and generate Wild Instinct through form-specific actions. First transformation each combat is free (WI). Every transformation adds +1 Humanity Erosion. You permanently take +50% Psychic damage.",
    },

    specs: [
      {
        id: "metamorph",
        name: "Metamorph",
        icon: "Nature/Ethereal Bird",
        color: "#9932CC",
        theme: "Chimeric Abominations & Flesh Fusion",

        description: `Metamorphs don't just shift between forms â€” they merge them. Two animals clawing through the same skin at the same time, a screaming fusion of predator and prey built from refusal to choose. The result is an abomination that shouldn't exist. It's the most powerful path. It's also the fastest way to lose yourself.`,

        playstyle:
          "Hybrid abomination creation, multi-trait fusion, maximum versatility at maximum erosion cost",

        strengths: [
          "Combine two base forms simultaneously for chimeric abilities (costs 2 WI, +2 Erosion)",
          "Access to unique chimeric transformations that no single form provides",
          "Hybrid forms inherit strengths from both parent forms",
          "Can manifest partial horrors (wings, claws, gills) without full transformation",
        ],

        weaknesses: [
          "Merging forms costs +2 Erosion per merge (double the erosion of a standard shift)",
          "Cannot access pure form ultimate abilities",
          "The chimera mind is louder â€” at Erosion 5+, Wisdom saves to revert increase to DC 16",
          "Party members must pass Spirit saves to look at you without flinching",
        ],

        specPassive: {
          name: "Chimeric Fusion",
          description:
            "Merge two base forms into a hybrid abomination with combined traits (2 WI, +2 Erosion). You can also manifest partial horrors â€” wings erupting from shoulder blades, claws splitting through fingernails, gills carving open your neck â€” without full transformation (1 WI, +1 Erosion each).",
        },

        keyAbilities: [
          "Chimeric Merge: Combine two forms (e.g., Nightstalker + Skyhunter = Shadow Raptor with stealth and flight). Costs 2 WI and +2 Erosion.",
          "Adaptive Mutation: Spend 3 WI to temporarily gain resistance to the last damage type that wounded you. Your flesh remembers what hurt it and grows armor accordingly.",
          "Partial Horror: Manifest specific traits (wings, claws, gills, enhanced senses) without full transformation (1 WI, +1 Erosion each). The human body screams. The animal doesn't care.",
        ],

        recommendedFor:
          "Players who want maximum creative flexibility and are willing to pay for it in humanity. The Metamorph erodes fastest but adapts to anything.",
      },

      {
        id: "form-thief",
        name: "Form Thief",
        icon: "Psychic/Mind Control",
        color: "#8B0000",
        theme: "Stolen Shapes & Necrotic Rejection",

        description: `Form Thieves don't just borrow nature's designs â€” they steal them. When something dies in front of you, its shape is absorbed instinctively, bone memory etched into your mutating DNA. But stolen biology is rejected tissue. To keep a form permanently, you must force your body to accept the foreign anatomy during rest â€” and the rejection damage when you fail is catastrophic.`,

        playstyle:
          "Form collection from the slain, enemy mimicry, biological theft with necrotic consequences",

        strengths: [
          "Absorb forms from slain enemies at 0 WI cost (instinctive â€” the kill triggers absorption)",
          "Perfect mimicry allows infiltration and deception",
          "Access to enemy racial abilities and traits from stolen forms",
          "Form library grows stronger with each victory â€” up to 10 permanent stolen forms",
        ],

        weaknesses: [
          "Stolen forms only last the current combat unless permanently learned",
          "To permanently learn: rest 10 minutes + Constitution save DC 10 + creature's CR",
          "Failed Constitution save: take 2d6 necrotic rejection damage + creature's CR, form is LOST",
          "Can only store 10 permanent stolen forms â€” must choose which horrors to keep",
        ],

        specPassive: {
          name: "Harvest Form",
          description:
            "When you reduce a creature to 0 HP, you may instinctively absorb its form at **0 WI cost**. The stolen form lasts only for the **current combat**. To permanently learn it, you must rest for 10 minutes and pass a **Constitution save (DC 10 + creature's CR)**. On failure, take **2d6 + creature's CR necrotic rejection damage** and the form is lost. You can retry on your next rest. Store up to 10 permanent stolen forms. Transforming into a stolen form costs 2 WI (vs. 1 WI for base forms).",
        },

        keyAbilities: [
          "Perfect Mimicry: While in a stolen form, you are biologically indistinguishable from the original creature â€” even to magic. You wear their skin like a suit.",
          "Stolen Power: Use one ability from your current stolen form. The cost varies by the ability's power â€” your body pays whatever the original creature's biology demands.",
          "Necrotic Archive: Spend 10 minutes to swap stored forms, surgically excising old acquisitions and grafting new ones. Each swap deals 1d4 necrotic damage to you as tissue is rejected and regrown.",
        ],

        recommendedFor:
          "Players who want a growing collection of stolen abilities and enjoy the tension of rolling Constitution saves to keep their prizes. The Form Thief is a biological kleptomaniac paying for theft in flesh.",
      },

      {
        id: "primordial",
        name: "Primordial",
        icon: "Fire/Eruption",
        color: "#FF4500",
        theme: "Elemental Excision & Flesh to Force",

        description: `Primordials don't wear animal skins â€” they burn them away entirely. Your four animal forms are replaced by elemental catastrophes: living fire, crushing water, screaming stone, and hungry wind. **This specialization replaces your four base animal forms with four elemental forms.** More powerful than standard forms, but elemental biology rejects human consciousness even faster. The erosion is worse. The power is worse. Everything is worse, and that's the point.`,

        playstyle:
          "Elemental body horror, environmental manipulation, maximum power at maximum cost",

        strengths: [
          "Elemental forms deal massive elemental damage to everything around them",
          "Complete immunity to your element while in elemental form",
          "Can reshape terrain and environment while transformed",
          "Elemental forms have devastating ultimate abilities",
        ],

        weaknesses: [
          "Vulnerable to opposing elements (Fire â†” Frost, Lightning â†” Earth)",
          "Elemental forms cost 3 WI to activate (vs. 1 WI for base forms)",
          "Replaces ALL four base animal forms â€” you cannot use Nightstalker, Ironhide, Skyhunter, or Frostfang",
          "Each elemental shift adds +2 Erosion instead of +1 â€” the elements burn away humanity faster",
        ],

        specPassive: {
          name: "Elemental Excision",
          description:
            "**Replaces base forms.** Your four animal forms become elemental catastrophes (Inferno, Tsunami, Avalanche, Tempest). Each grants its element's immunity, opposing element vulnerability, and 30 ft environmental manipulation. Elemental forms cost 3 WI to activate and add +2 Erosion per shift (instead of +1). The human mind cannot process being made of fire.",
        },

        keyAbilities: [
          "Inferno Form: Your flesh ignites. You are a screaming pillar of fire. Deal 1d6 fire damage to adjacent enemies each round. Immune to fire. Vulnerable to frost. You cannot scream because you have no throat â€” but the fire screams for you.",
          "Tsunami Form: Your body dissolves into crushing water. Swim speed 60ft, breathe underwater, create water walls. Vulnerable to lightning. Drown your enemies in what used to be your circulatory system.",
          "Avalanche Form: Your skeleton calcifies into living stone. +5 Armor, tremorsense 30ft, reshape earth. Vulnerable to lightning. Your heartbeat sounds like mountains grinding.",
          "Tempest Form: Your lungs become wind chambers. Fly speed 60ft, create wind barriers. Vulnerable to being grounded. Your voice is the sound of a hurricane trying to remember words.",
        ],

        recommendedFor:
          "Players who want the most destructive transformations and don't mind eroding twice as fast. The Primordial is the nuclear option â€” maximum devastation, minimum humanity.",
      },
    ],
  },

  // Example Spells - organized by form and specialization
  exampleSpells: [
    // ===== NIGHTSTALKER FORM (CAT) =====
    {
      id: "fb_ambush_strike",
      name: "Ambush Strike",
      description:
        "Strike from the shadows with devastating precision, dealing 1d6 slashing damage per Wild Instinct spent (1-5 WI). Tier 2+ applies Bleeding. Tier 3+ stuns. Must be used from stealth for full effect.",
      spellType: "ACTION",
      icon: "Piercing/Backstab",
      level: 3,
      form: "nightstalker",
      specialization: null,

      typeConfig: {
        school: "slashing",
        icon: "Piercing/Backstab",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "physical",
          "stealth",
          "burst damage",
          "nightstalker",
          "feral shifter",
        ],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        requiresLineOfSight: true,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff", "control"],

      damageConfig: {
        formula: "1d6 per Wild Instinct spent",
        damageTypes: ["slashing"],
        resolution: "DICE",
        hasDotEffect: true,
        dotConfig: {
          enabled: true,
          damagePerTick: "1d4",
          damageType: "slashing",
          tickFrequency: "round",
          duration: 3,
          canStack: false,
          maxStacks: 1,
        },
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "bleeding",
            name: "Bleeding",
            description: "1d4 slashing damage per round for 3 rounds (Tier 2+)",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },

      controlConfig: {
        controlType: "incapacitation",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          {
            id: "stun",
            name: "Stun",
            description:
              "Target is stunned for 1 round (Tier 3: Stun, Tier 5: Paralyze)",
            config: {
              durationType: "rounds",
              recoveryMethod: "automatic",
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
      },

      wildInstinctScaling: {
        minCost: 1,
        maxCost: 5,
        tiers: [
          { cost: 1, damage: "1d6", effect: "None" },
          {
            cost: 2,
            damage: "2d6",
            effect: "Apply Bleeding (1d4 damage per round for 3 rounds)",
          },
          { cost: 3, damage: "3d6", effect: "Stun target for 1 round" },
          {
            cost: 4,
            damage: "4d6",
            effect: "Reduce target movement speed by 50% for 2 rounds",
          },
          { cost: 5, damage: "5d6", effect: "Paralyze target for 1 round" },
        ],
      },

      specialMechanics: {
        stealthRequirement: {
          description: "Must be used from stealth for full effect",
          bonus: "Advantage on attack roll if attacking from stealth",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "physical",
        "stealth",
        "burst damage",
        "nightstalker",
        "feral shifter",
      ],
      flavorText: "From the shadows, death strikes. Your fingernails were the warning. Nobody listened.",
    },

    {
      id: "fb_shadowmeld",
      name: "Shadowmeld",
      description:
        "Blend into the shadows, becoming invisible for 1 minute. Broken by attacking or taking damage. Higher Wild Instinct tiers grant teleportation and illusionary duplicates.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 2,
      form: "nightstalker",
      specialization: null,

      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Mind Control",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "stealth",
          "invisibility",
          "illusion",
          "nightstalker",
          "utility",
        ],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff", "utility"],

      buffConfig: {
        buffType: "statusEffect",
        effects: [
          {
            id: "invisibility",
            name: "Shadow Invisibility",
            description:
              "Become invisible for 1 minute or until you attack or take damage",
            mechanicsText: "",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      utilityConfig: {
        utilityType: "enhancement",
        selectedEffects: [
          {
            id: "illusionary_duplicates",
            name: "Illusionary Duplicates",
            description:
              "At higher Wild Instinct tiers, create 1-2 illusionary duplicates that confuse enemies",
          },
        ],
        duration: 1,
        durationUnit: "minutes",
        concentration: false,
      },

      wildInstinctScaling: {
        minCost: 1,
        maxCost: 5,
        tiers: [
          { cost: 1, effect: "Advantage on Stealth checks for 1 minute" },
          {
            cost: 2,
            effect: "Become invisible for 1 minute or until you attack",
          },
          {
            cost: 3,
            effect: "Teleport to darkness within 30 feet and become invisible",
          },
          { cost: 4, effect: "Create 1 illusionary duplicate for 1 minute" },
          {
            cost: 5,
            effect: "Become invisible and create 2 illusionary duplicates",
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentration: false,
      },

      specialMechanics: {
        shadowTeleport: {
          description:
            "At tier 3+, can teleport to any area of dim light or darkness",
          range: 30,
        },
        illusions: {
          description: "Duplicates mimic your movements and confuse enemies",
          duration: "1 minute",
        },
      },

      tags: ["stealth", "invisibility", "illusion", "nightstalker", "utility"],
      flavorText: "The shadows don't embrace you. You were always half-shadow to begin with.",
    },

    // ===== IRONHIDE FORM (BEAR) =====
    {
      id: "fb_roaring_assault",
      name: "Roaring Assault",
      description:
        "Unleash a devastating roar dealing 1d8 force damage per Wild Instinct spent in a 10-foot radius. Constitution save DC 14. Tier 2+ causes fear, Tier 3+ knocks back 10 ft, Tier 4+ stuns, Tier 5+ knocks prone.",
      spellType: "ACTION",
      icon: "Nature/Roar",
      level: 4,
      form: "ironhide",
      specialization: null,

      typeConfig: {
        school: "force",
        icon: "Nature/Roar",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["aoe", "force", "crowd control", "ironhide", "feral shifter"],
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        rangeDistance: 10,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["enemy"],
        requiresLineOfSight: false,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "1d8 per Wild Instinct spent",
        damageTypes: ["force"],
        resolution: "DICE",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "incapacitation",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          {
            id: "knockback",
            name: "Knocked Back",
            description: "Enemies are pushed 10 feet away (Tier 3+)",
            config: {
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: ["aoe", "force", "crowd control", "ironhide", "feral shifter"],
      flavorText: "Your throat tears wider than any human mouth should. The sound that comes out is not a roar — it is the death rattle of everything soft you ever were.",
    },

    {
      id: "fb_fortress_of_fur",
      name: "Fortress of Fur",
      description:
        "Harden your hide to absorb damage. Gain temporary HP and defensive bonuses scaling with Wild Instinct spent (1-5 WI). Tier 2+: physical resistance. Tier 4+: reflect 25% melee damage. Tier 5: resistance to all damage.",
      spellType: "ACTION",
      icon: "Nature/Roots",
      level: 3,
      form: "ironhide",
      specialization: null,

      typeConfig: {
        school: "nature",
        icon: "Nature/Roots",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "defense",
          "temporary hp",
          "resistance",
          "ironhide",
          "restoration shifter",
        ],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentration: false,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff"],

      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          {
            id: "fortress_hp",
            name: "Fortress Temporary HP",
            description:
              "Gain 1d6 temporary HP per Wild Instinct spent (Tier 1: 1d6, Tier 5: 5d6)",
            mechanicsText: "",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "defense",
        "temporary hp",
        "resistance",
        "ironhide",
        "restoration shifter",
      ],
      flavorText: "They call it fur. It is not fur. It is hide grown thick enough to forget that beneath it, something still bleeds.",
    },

    // ===== SKYHUNTER FORM (HAWK) =====
    {
      id: "fb_talon_dive",
      name: "Talon Dive",
      description:
        "Dive from above with razor-sharp talons, dealing 1d6 slashing damage per Wild Instinct spent (1-5 WI). Tier 2+: grapple target. Tier 3+: stun for 1 round. Advantage if you have flight active.",
      spellType: "ACTION",
      icon: "Nature/Ethereal Bird",
      level: 3,
      form: "skyhunter",
      specialization: null,

      typeConfig: {
        school: "slashing",
        icon: "Nature/Ethereal Bird",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["physical", "aerial", "grapple", "skyhunter", "feral shifter"],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        requiresLineOfSight: true,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "1d6 per Wild Instinct spent",
        damageTypes: ["slashing"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "restraint",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          {
            id: "grapple",
            name: "Grappled",
            description:
              "Target is grappled (Tier 2+). Cannot move. Escape with Athletics/Acrobatics check.",
            config: {
              restraintType: "grapple",
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["physical", "aerial", "grapple", "skyhunter", "feral shifter"],
      flavorText: "Your arms fold backward at the elbow and your fingers stretch into something between wing and claw. Gravity stops being a law and becomes a suggestion you chose to ignore.",
    },

    {
      id: "fb_winds_grace",
      name: "Wind's Grace",
      description:
        "Harness the power of wind for enhanced perception, flight, and devastating wind attacks. Effects scale with Wild Instinct spent (1-5 WI). Tier 2: flight. Tier 3: wind gust push. Tier 5: 3d6 tornado.",
      spellType: "ACTION",
      icon: "Nature/Tornado Vortex",
      level: 4,
      form: "skyhunter",
      specialization: null,

      typeConfig: {
        school: "nature",
        icon: "Nature/Tornado Vortex",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "utility",
          "flight",
          "wind",
          "aoe",
          "skyhunter",
          "balance shifter",
        ],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff", "utility"],

      buffConfig: {
        buffType: "movementBuff",
        effects: [
          {
            id: "wind_flight",
            name: "Wind Flight",
            description:
              "Gain flight speed equal to walking speed for 1 minute (Tier 2+)",
            mechanicsText: "",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      utilityConfig: {
        utilityType: "enhancement",
        selectedEffects: [
          {
            id: "wind_control",
            name: "Wind Control",
            description: "Summon gusts and tornadoes at higher tiers",
          },
        ],
        duration: 1,
        durationUnit: "minutes",
        concentration: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },

      tags: [
        "utility",
        "flight",
        "wind",
        "aoe",
        "skyhunter",
        "balance shifter",
      ],
      flavorText: "The wind does not carry you. You swallowed the sky and it is trying to escape through your shoulder blades.",
    },

    // ===== FROSTFANG FORM (WOLF) =====
    {
      id: "fb_frostbite_strike",
      name: "Frostbite Strike",
      description:
        "Bite with frost-infused fangs, dealing 1d6 frost damage per Wild Instinct spent (1-5 WI). Tier 2+: Slowed 50%. Tier 3+: Freeze 1 round. Tier 5: Paralyze 1 round.",
      spellType: "ACTION",
      icon: "Frost/Ice Orb",
      level: 3,
      form: "frostfang",
      specialization: null,

      typeConfig: {
        school: "frost",
        icon: "Frost/Ice Orb",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "frost",
          "physical",
          "crowd control",
          "frostfang",
          "feral shifter",
        ],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        requiresLineOfSight: true,
        targetRestrictions: ["enemy"],
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "1d6 per Wild Instinct spent",
        damageTypes: ["frost"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "movementImpairment",
        effects: [
          {
            id: "frostbite_slow",
            name: "Frostbitten",
            description:
              "Movement speed reduced by 50% for 2 rounds (Tier 2+). Frozen at Tier 3.",
            mechanicsText: "",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "frost",
        "physical",
        "crowd control",
        "frostfang",
        "feral shifter",
      ],
      flavorText: "Your jaw unhinges to accommodate fangs that should not fit. The cold is not magic — it is the absence of mercy, crystallized in enamel.",
    },

    {
      id: "fb_pack_leaders_call",
      name: "Pack Leader's Call",
      description:
        "Summon spectral wolves to fight alongside you. Tier 2: 1 wolf (15 HP, 1d6+2 dmg). Tier 3: 2 wolves. Tier 4: pack buff for allies. Tier 5: alpha wolf (30 HP, 2d8+3 dmg). Lasts 1 minute.",
      spellType: "ACTION",
      icon: "Nature/Wolf Dash",
      level: 4,
      form: "frostfang",
      specialization: null,

      typeConfig: {
        school: "nature",
        icon: "Nature/Wolf Dash",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: [
          "summoning",
          "pack tactics",
          "support",
          "frostfang",
          "restoration shifter",
        ],
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
        targetRestrictions: [],
        requiresLineOfSight: true,
      },

      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentration: false,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["summoning"],

      summoningConfig: {
        creatures: [
          {
            id: "spectral_wolf",
            name: "Spectral Wolf",
            description: "A ghostly wolf made of primal energy",
            size: "Medium",
            type: "spirit",
            config: {
              quantity: 1,
              duration: 1,
              durationUnit: "minutes",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 30,
            },
          },
        ],
        duration: 1,
        durationUnit: "minutes",
        hasDuration: true,
        concentration: false,
        controlRange: 30,
        controlType: "mental",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      tags: [
        "summoning",
        "pack tactics",
        "support",
        "frostfang",
        "restoration shifter",
      ],
      flavorText: "You do not summon wolves. You scream until your hunger takes shape. What answers is not loyal — it is starving.",
    },

    // ===== UNIVERSAL SPELLS (ALL FORMS) =====
    {
      id: "fb_natures_grasp",
      name: "Nature's Grasp",
      description:
        "Vines erupt from the ground to restrain a target within 30 feet. Strength save DC 13. Restrained creatures have speed 0 and disadvantage on Dex saves. Escape with Strength or Acrobatics DC 13.",
      spellType: "ACTION",
      icon: "Nature/Thorny Entanglement",
      level: 1,
      form: null,
      specialization: "universal",

      typeConfig: {
        school: "nature",
        icon: "Nature/Thorny Entanglement",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["crowd control", "nature", "universal", "all specs"],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        requiresLineOfSight: true,
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentration: true,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 2 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "DICE",
      effectTypes: ["control"],

      controlConfig: {
        controlType: "restraint",
        strength: "moderate",
        duration: 1,
        durationUnit: "minutes",
        savingThrow: {
          ability: "strength",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "restrained",
            name: "Restrained",
            description:
              "Speed 0, disadvantage on Dex saves. Escape with Str/Acrobatics DC 13.",
            config: {
              restraintType: "vines",
              duration: 1,
              durationUnit: "minutes",
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["crowd control", "nature", "universal", "all specs"],
      flavorText: "The vines grow from your open wounds, not from the earth. Your blood remembers what it was like to have roots.",
    },

    {
      id: "fb_healing_touch",
      name: "Healing Touch",
      description:
        "Channel nature's healing energy to restore 1d6 + Spirit HP to an ally within 30 feet. You cannot use this on yourself -- the power flows outward only.",
      spellType: "ACTION",
      icon: "Healing/Heal Wound",
      level: 2,
      form: null,
      specialization: "universal",

      typeConfig: {
        school: "nature",
        icon: "Healing/Heal Wound",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["healing", "support", "universal", "all specs"],
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        requiresLineOfSight: true,
        targetRestrictions: ["ally"],
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "DICE",
      effectTypes: ["healing"],

      healingConfig: {
        formula: "1d6 + spirit",
        healingType: "direct",
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: [
        "healing",
        "support",
        "universal",
        "all specs",
        "restoration shifter",
      ],
      flavorText: "You press your palm against their wound and your flesh flows — not gently, not kindly, but with the desperate urgency of a body that knows what it is to be broken.",
    },

    {
      id: "fb_beast_aspect",
      name: "Beast Aspect",
      description:
        "Transform part of your body into an animal feature for 1 minute. Choose: claws (climbing speed), wings (glide 60ft), gills (breathe underwater), or enhanced senses (advantage on Perception). Higher WI: manifest multiple traits.",
      spellType: "ACTION",
      icon: "Nature/Beast Mark",
      level: 2,
      form: null,
      specialization: "universal",

      typeConfig: {
        school: "nature",
        icon: "Nature/Beast Mark",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["transformation", "utility", "universal", "all specs"],
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },

      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentration: false,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff", "utility"],

      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "beast_aspect",
            name: "Beast Aspect",
            description:
              "Choose one: claws (climbing speed), wings (glide 60ft), gills (water breathing), or enhanced senses (Perception advantage)",
            mechanicsText: "",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      utilityConfig: {
        utilityType: "enhancement",
        selectedEffects: [
          {
            id: "partial_transform",
            name: "Partial Transformation",
            description:
              "Manifest specific animal traits without full shapeshift",
          },
        ],
        duration: 1,
        durationUnit: "minutes",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      tags: ["transformation", "utility", "universal", "all specs"],
      flavorText: "You do not choose the animal. The animal chooses the part of you it wants. Your body complies. It always complies.",
    },
  ],

  // Comprehensive Spell List (Levels 1-10, 3 spells each, following template)
  spells: [
    // ===== LEVEL 1 SPELLS =====
    {
      id: "formbender_flesh_rip",
      name: "Flesh Rip",
      description:
        "Your fingernails split and elongate into hooked talons mid-swing, tearing through meat and sinew with the enthusiasm of something that forgot it used to have hands. Deal 2d8 + Strength slashing damage. Critical hits generate +1 Wild Instinct as the taste of blood triggers something old.",
      level: 1,
      form: null,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "slashing",
        icon: "Nature/Claw Marks",
        tags: ["attack", "damage", "physical", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "2d8 + strength",
        damageTypes: ["slashing"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critType: "dice",
          critMultiplier: 2,
          critDiceOnly: false,
          extraDice: "1d8",
          critEffects: ["wild_instinct_gain"],
          wildInstinctGainConfig: {
            amount: 1,
          },
        },
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["attack", "damage", "physical", "formbender"],
    },

    {
      id: "formbender_stolen_mending",
      name: "Stolen Mending",
      description:
        "Your stolen flesh knits itself with terrifying speed â€” organs repositioning, wounds suturing from the inside, bone fragments crawling back into alignment like insects returning to a nest. Restore 2d6 + Constitution HP instantly, plus 1d6 HP per round for 2 rounds. Only usable while transformed â€” your human body doesn't remember how to heal.",
      level: 1,
      form: null,
      spellType: "ACTION",
      effectTypes: ["healing"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Renewal",
        tags: ["healing", "support", "nature", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "2d6 + constitution",
        healingType: "direct",
        resolution: "DICE",
        hasHotEffect: true,
        hotFormula: "1d6",
        hotDuration: 2,
        hotTickType: "round",
        isProgressiveHot: false,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["healing", "support", "nature", "formbender"],
    },

    {
      id: "formbender_scent_of_prey",
      name: "Scent of Prey",
      description:
        "Your nasal cavity ruptures and fills with a second set of turbinal bones. The world becomes a tapestry of terror-sweat, adrenaline, and the copper sweetness of wounds yet to be opened. Mark a target within 30 feet â€” you generate +1 Wild Instinct immediately, and +1 WI each time you hit the marked target for 3 rounds.",
      level: 1,
      form: null,
      spellType: "ACTION",
      effectTypes: ["debuff", "utility"],
      typeConfig: {
        school: "nature",
        icon: "Piercing/Backstab",
        tags: ["debuff", "utility", "tracking", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
      },
      resolution: "AUTOMATIC",
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "marked_prey",
            name: "Marked Prey",
            description:
              "Target is marked. Formbender generates +1 WI on each hit against this target for 3 rounds.",
            mechanicsText: "",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
      },
      utilityConfig: {
        utilityType: "enhancement",
        selectedEffects: [
          {
            id: "predator_scent",
            name: "Predator's Scent",
            description:
              "Generate +1 WI immediately, and +1 WI each time you hit the marked target for 3 rounds.",
          },
        ],
        duration: 3,
        durationUnit: "rounds",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentration: false,
      },
      specialMechanics: {
        wildInstinctGeneration: {
          immediateGain: 1,
          onHitGain: 1,
          duration: 3,
        },
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["debuff", "utility", "tracking", "formbender"],
    },

    // ===== LEVEL 2 SPELLS =====
    {
      id: "formbender_visceral_talons",
      name: "Visceral Talons",
      description:
        "Your fingers dislocate one by one, each joint popping as keratin claws erupt from the nail beds. Your unarmed attacks now deal slashing damage and gain +2d6 damage for 1 minute. The transformation is not gentle. The claws do not ask permission.",
      spellType: "ACTION",
      icon: "Nature/Claw Marks",
      level: 2,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "slashing",
        icon: "Nature/Claw Marks",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["physical", "buff", "damage", "formbender"],
      },

      targetingConfig: {
        targetingType: "self",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "visceral_talons",
            name: "Visceral Talons",
            description:
              "Unarmed attacks deal slashing damage and gain +2d6 damage for 1 minute",
            statModifier: {
              stat: "damage",
              magnitude: "2d6",
              magnitudeType: "dice",
            },
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["physical", "buff", "damage", "formbender"],
    },

    {
      id: "formbender_predators_sight",
      name: "Predator's Sight",
      description:
        "Something ancient stirs behind your eyes. Your pupils dilate until no color remains â€” twin voids that see in spectrums humans were never meant to perceive. Gain advantage on Perception checks and detect invisible creatures for 1 hour. The world becomes too sharp. You will never see it softly again.",
      spellType: "ACTION",
      icon: "Piercing/Backstab",
      level: 2,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "nature",
        icon: "Piercing/Backstab",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "senses", "utility", "formbender"],
      },

      targetingConfig: {
        targetingType: "self",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "predators_sight",
            name: "Predator's Sight",
            description:
              "Advantage on Perception checks, detect invisible creatures, for 1 hour",
            statModifier: {
              stat: "perception",
              magnitude: "advantage",
              magnitudeType: "advantage",
            },
          },
        ],
        durationValue: 1,
        durationType: "hours",
        durationUnit: "hours",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["buff", "senses", "utility", "formbender"],
    },

    {
      id: "formbender_feral_bound",
      name: "Feral Bound",
      description:
        "Your spine elongates with a wet crunch, coiling like a spring before launching your body through the air. Leap up to 60 feet, ignoring difficult terrain. Your bones will complain later. Right now, they're too busy being weapons.",
      spellType: "ACTION",
      icon: "Utility/Dash",
      level: 2,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "nature",
        icon: "Utility/Dash",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["utility", "movement", "mobility", "formbender"],
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: [],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: false,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 1 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          {
            id: "feral_bound",
            name: "Feral Bound",
            description:
              "Leap up to 60 feet in any direction, ignoring difficult terrain",
          },
        ],
        duration: 1,
        durationUnit: "rounds",
        concentration: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["utility", "movement", "mobility", "formbender"],
    },

    // ===== LEVEL 3 SPELLS =====
    {
      id: "formbender_feral_fury",
      name: "Feral Fury",
      description:
        "Something inside your skull cracks open. Not bone â€” restraint. The human part of your brain that says 'wait' and 'think' goes dark. Gain +2 Strength and advantage on attack rolls for 1 minute. The fury is not yours. It was waiting for permission.",
      spellType: "ACTION",
      icon: "Nature/Roaring Bear",
      level: 3,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "nature",
        icon: "Nature/Roaring Bear",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "damage", "rage", "formbender"],
      },

      targetingConfig: {
        targetingType: "self",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "feral_fury",
            name: "Feral Fury",
            description:
              "+2 Strength and advantage on attack rolls for 1 minute. The animal is driving.",
            statModifier: {
              stat: "strength",
              magnitude: 2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["buff", "damage", "rage", "formbender"],
    },

    {
      id: "formbender_bone_carapace",
      name: "Bone Carapace",
      description:
        "Your ribs crack and spread, pushing through skin to form overlapping plates of calcified nightmare. The plates grow, fuse, and interlock until your torso is a cage of bone armor that shouldn't exist outside a charnel pit. Gain +3 Armor and 50% resistance to physical damage for 10 minutes.",
      spellType: "ACTION",
      icon: "Nature/Earth Shield",
      level: 3,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "defense", "armor", "formbender"],
      },

      targetingConfig: {
        targetingType: "self",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["buff"],

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "bone_carapace",
            name: "Bone Carapace",
            description:
              "+3 Armor and 50% physical damage resistance for 10 minutes. Your ribs are on the outside now.",
            statModifier: {
              stat: "armor",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 10,
        durationType: "minutes",
        durationUnit: "minutes",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["buff", "defense", "armor", "formbender"],
    },

    {
      id: "formbender_spectral_hunters",
      name: "Spectral Hunters",
      description:
        "You tear a piece of your hunger loose and give it legs. Two spectral wolves materialize from the space between your ribs â€” ghostly predators made of primal memory and stolen instinct. They exist to track. They exist to kill. They do not exist to come back.",
      spellType: "ACTION",
      icon: "Nature/Spawn",
      level: 3,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "nature",
        icon: "Nature/Spawn",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["summoning", "utility", "tracking", "formbender"],
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["verbal"],
      },

      effectTypes: ["summoning"],

      summoningConfig: {
        creatures: [
          {
            id: "spectral_hunter",
            name: "Spectral Hunter",
            description:
              "A ghostly wolf born from the Formbender's hunger, not from nature",
            size: "Medium",
            type: "spirit",
            tokenIcon: "ability_hunter_pet_wolf",
            stats: {
              maxHp: 20,
              armor: 12,
              maxMana: 0,
            },
            config: {
              quantity: 2,
              duration: 1,
              durationUnit: "hours",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 30,
            },
          },
        ],
        duration: 1,
        durationUnit: "hours",
        hasDuration: true,
        concentration: false,
        controlRange: 30,
        controlType: "mental",
      },

      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      tags: ["summoning", "utility", "tracking", "formbender"],
    },

    // ===== LEVEL 4 SPELLS =====
    {
      id: "formbender_savage_charge",
      name: "Savage Charge",
      description:
        "Your legs reconstruct themselves for a single devastating purpose â€” to close the distance between your teeth and their throat. Charge forward in a 40-foot line, dealing 5d6 + Strength bludgeoning damage. Targets must succeed on a Strength save or be knocked prone. You do not slow down. You do not apologize.",
      spellType: "ACTION",
      icon: "Utility/Dash",
      level: 4,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "bludgeoning",
        icon: "Utility/Dash",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["attack", "damage", "control", "charge", "formbender"],
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "line",
        aoeParameters: { length: 40, width: 5 },
        targetRestrictions: ["enemy"],
        maxTargets: 5,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: true,
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["somatic"],
      },

      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "5d6 + strength",
        damageTypes: ["bludgeoning"],
        resolution: "DICE",
        savingThrow: {
          ability: "strength",
          difficultyClass: 14,
          saveOutcome: "half_damage",
        },
      },

      controlConfig: {
        controlType: "knockdown",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 14,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "knockdown",
            name: "Knocked Down",
            description: "Target is knocked prone for 1 round",
            config: {
              saveType: "strength",
              saveDC: 14,
              knockdown: true,
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["attack", "damage", "control", "charge", "formbender"],
    },

    {
      id: "formbender_flesh_donation",
      name: "Flesh Donation",
      description:
        "You reach into your own torso and pull out a piece of something that used to be an organ â€” it regrows as you offer it, bloodied and pulsing, knitting itself into your ally's wounds. Heal an ally for 3d8 + Spirit HP and remove one affliction. You cannot use this on yourself. The flesh only moves outward.",
      spellType: "ACTION",
      icon: "Healing/Heart Ripple",
      level: 4,
      specialization: "universal",
      form: null,

      typeConfig: {
        school: "nature",
        icon: "Healing/Heart Ripple",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["healing", "support", "restoration", "formbender"],
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
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["healing"],

      healingConfig: {
        formula: "3d8 + spirit",
        healingType: "direct",
        resolution: "DICE",
        hasHotEffect: true,
        hotFormula: "1d8",
        hotDuration: 3,
        hotTickType: "round",
        isProgressiveHot: false,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["healing", "support", "restoration", "formbender"],
    },

    {
      id: "formbender_primal_surge",
      name: "Primal Surge",
      description:
        "The animal inside you stops asking permission. Your current form is amplified â€” every passive doubled, every instinct sharpened â€” for 2 agonizing rounds. Generate +2 Wild Instinct as the surge feeds back into your biology. The power is borrowed. The pain is yours to keep.",
      spellType: "ACTION",
      icon: "Nature/Nature Primal",
      level: 4,
      form: null,
      specialization: "universal",

      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Primal",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["buff", "enhancement", "form-amp", "formbender"],
      },

      targetingConfig: {
        targetingType: "self",
      },

      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },

      effectTypes: ["buff", "utility"],

      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "primal_surge",
            name: "Primal Surge",
            description:
              "Double your current form's passive bonus for 2 rounds and generate +2 Wild Instinct",
            customDescription:
              "Your current form is violently amplified. Nightstalker: double stealth bonus and sneak attack. Ironhide: +20 additional HP and double resistance. Skyhunter: +30ft fly speed. Frostfang: double pack tactics range. The animal does not give back what it takes.",
            mechanicsText: "Double form passive bonuses for 2 rounds, gain +2 WI",
            duration: 2,
            durationUnit: "rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["buff", "enhancement", "form-amp", "formbender"],
    },

    // ===== LEVEL 5 SPELLS =====
    {
      id: "formbender_pack_of_abominations",
      name: "Pack of Abominations",
      description:
        "You split your hunger three ways. Three spectral wolves tear themselves free from the space between your ribs â€” not animals, but fragments of predatory instinct given teeth and purpose. They and you gain +2 to attack rolls when adjacent to each other for 5 rounds. The pack does not protect. The pack hunts.",
      level: 5,
      form: null,
      spellType: "ACTION",
      effectTypes: ["summoning", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Wolf Dash",
        tags: ["summoning", "buff", "pack", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      summoningConfig: {
        creatures: [
          {
            id: "spectral_wolf",
            name: "Spectral Wolf",
            description: "A fragment of predatory instinct, not a creature of nature",
            size: "Medium",
            type: "spirit",
            tokenIcon: "ability_hunter_pet_wolf",
            stats: {
              maxHp: 35,
              armor: 13,
              maxMana: 0,
            },
            config: {
              quantity: 3,
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
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "pack_tactics",
            name: "Pack Tactics",
            description:
              "You and summoned wolves gain +2 to attack rolls when adjacent to each other for 5 rounds",
            statModifier: {
              stat: "attack_rolls",
              magnitude: 2,
              magnitudeType: "flat",
            },
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
        rangeType: "ranged",
        rangeDistance: 40,
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      tags: ["summoning", "buff", "pack", "formbender"],
    },

    {
      id: "formbender_rending_frenzy",
      name: "Rending Frenzy",
      description:
        "Your arms multiply. Your jaw unhinges. What follows is not a technique â€” it is three seconds of concentrated violence that would make a wolverine look away. Deal 6d8 + Strength slashing damage in a blur of claws and teeth. The aftermath is not something your party should examine closely.",
      level: 5,
      form: null,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "slashing",
        icon: "Nature/Claw Marks",
        tags: ["attack", "damage", "physical", "multi hit", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "6d8 + strength",
        damageTypes: ["slashing"],
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        targetRestrictions: ["enemy"],
        maxTargets: 1,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 2,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["attack", "damage", "physical", "multi hit", "formbender"],
    },

    {
      id: "formbender_adaptive_horror",
      name: "Adaptive Horror",
      description:
        "For 3 rounds, the animal inside you stops asking and starts taking. Form transformations cost 0 Wild Instinct â€” the WI economy collapses as your body shifts freely between shapes, each one bleeding into the next. You adapt to everything. You remember nothing.",
      level: 5,
      form: null,
      spellType: "ACTION",
      effectTypes: ["buff", "utility"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Cat Face",
        tags: ["buff", "utility", "transformation", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "adaptive_horror",
            name: "Adaptive Horror",
            description:
              "Form transformations cost 0 Wild Instinct for 3 rounds. Erosion still accumulates normally.",
            customDescription:
              "Your body shifts freely between forms without WI cost. But every shift still costs +1 Erosion. The animal is not being generous â€” it is consuming you faster.",
            mechanicsText:
              "Form transformations cost 0 WI for 3 rounds. Erosion unchanged.",
            duration: 3,
            durationUnit: "rounds",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 2 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      tags: ["buff", "utility", "transformation", "formbender"],
    },

    // ===== LEVEL 6 SPELLS =====
    {
      id: "formbender_titan_abomination",
      name: "Titan Abomination",
      description:
        "Your skeleton detonates. Bones crack, multiply, and fuse into something Huge â€” a towering mass of calcified rage wrapped in hide thick enough to turn sword blows. Gain Huge size, +4 Strength, +3 Armor, and 50 temporary HP for 4 rounds. When it ends, you will remember what it felt like to be small. You will not forgive yourself for going back.",
      level: 6,
      form: null,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      typeConfig: {
        school: "nature",
        icon: "Necrotic/Resurrect",
        tags: ["transformation", "buff", "size", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      transformationConfig: {
        transformationType: "physical",
        targetType: "self",
        duration: 4,
        durationUnit: "rounds",
        power: "major",
        newForm: "Titan Abomination",
        description: "Your skeleton detonates outward into a towering horror of bone and rage.",
        concentration: true,
        grantedAbilities: [
          {
            id: "huge_size",
            name: "Huge Size",
            description: "Size becomes Huge, reach increases to 15 feet",
          },
          {
            id: "titan_strength",
            name: "+4 Strength",
            description: "Gain +4 to Strength attribute",
          },
          {
            id: "titan_armor",
            name: "+3 Armor",
            description: "Gain +3 armor from overlapping bone plates",
          },
          {
            id: "titan_hp",
            name: "+50 Temp HP",
            description: "Gain 50 temporary hit points from expanded mass",
          },
        ],
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["transformation", "buff", "size", "formbender"],
    },

    {
      id: "formbender_crushing_descent",
      name: "Crushing Descent",
      description:
        "You leap â€” not as a person, but as gravity's preferred weapon. Your body becomes a falling mass of meat and malice that hits the ground like a burial. Deal 6d8 + Strength + Agility bludgeoning damage in a 20-foot radius. Agility save DC 16 for half damage. Everything standing is knocked prone. The crater is yours to explain.",
      level: 6,
      form: null,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "bludgeoning",
        icon: "Nature/Cat Face",
        tags: ["attack", "damage", "control", "aoe", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "6d8 + strength + agility",
        damageTypes: ["bludgeoning"],
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "knockdown",
        strength: "moderate",
        duration: 1,
        durationUnit: "rounds",
        savingThrow: {
          ability: "agility",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "stagger",
            name: "Staggered",
            description: "Target is knocked prone and must use movement to stand",
            config: {
              saveType: "agility",
              saveDC: 16,
              knockdown: true,
              duration: 1,
              durationUnit: "rounds",
            },
          },
        ],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 40,
        aoeShape: "circle",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemy"],
        maxTargets: 10,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["attack", "damage", "control", "aoe", "formbender"],
    },

    {
      id: "formbender_parasitic_mending",
      name: "Parasitic Mending",
      description:
        "You vomit a stream of living tissue â€” half parasite, half prayer â€” that worms its way into your ally's wounds and sutures them from the inside. Heal an ally for 5d8 + Spirit HP, plus 2d6 HP per round for 3 rounds as the living bandage continues to work. You cannot use this on yourself. The gift only moves outward.",
      level: 6,
      form: null,
      spellType: "ACTION",
      effectTypes: ["healing"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heal Wound",
        tags: ["healing", "support", "nature", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      healingConfig: {
        formula: "5d8 + spirit",
        healingType: "direct",
        resolution: "DICE",
        hasHotEffect: true,
        hotFormula: "2d6",
        hotDuration: 3,
        hotTickType: "round",
        isProgressiveHot: false,
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
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 3 },
        useFormulas: {},
        actionPoints: 1,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["healing", "support", "nature", "formbender"],
    },

    // ===== LEVEL 7 SPELLS =====
    {
      id: "formbender_chimera_ascendant",
      name: "Chimera Ascendant",
      description:
        "All four forms tear through your skin at once. You are not one animal â€” you are every animal, a screaming fusion of predator and prey that has no name in any language. Gain +3 to all stats, all form passives simultaneously, free form switching, and +2 Wild Instinct per round for 5 rounds. The human part of you is not dead. It is simply... elsewhere.",
      level: 7,
      form: null,
      spellType: "STATE",
      effectTypes: ["transformation", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Primal",
        tags: ["transformation", "buff", "primal", "formbender"],
        stateVisibility: "visible",
        cooldownAfterTrigger: 0,
        cooldownUnit: "seconds",
        maxTriggers: 1,
      },
      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Chimera Ascendant",
        description: "All four forms erupt simultaneously. You are everything. You are nothing human.",
        grantedAbilities: [
          {
            id: "all_form_benefits",
            name: "All Form Benefits",
            description:
              "Gain all four form passives at once. The chimera does not choose. The chimera takes.",
          },
          {
            id: "free_switching",
            name: "Free Switching",
            description: "Form transitions cost 0 Wild Instinct. Erosion still accumulates.",
          },
          {
            id: "avatar_instinct",
            name: "+2 Wild Instinct/Round",
            description: "Generate +2 Wild Instinct each round from the chimeric feedback",
          },
          {
            id: "avatar_stats",
            name: "+3 All Stats",
            description: "Gain +3 to all attributes",
          },
        ],
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "chimera_stats",
            name: "Chimera Stats",
            description: "+3 to all stats",
            statModifier: {
              stat: "all_stats",
              magnitude: 3,
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
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["transformation", "buff", "primal", "formbender"],
    },

    {
      id: "formbender_horror_shriek",
      name: "Horror Shriek",
      description:
        "The sound that comes out of your throat is not a roar. It is the collective death-rattle of everything you've ever killed, compressed into a single frequency that makes bones vibrate and minds fold. All enemies within 30 feet must make a Spirit save DC 17 or be Terrified for 3 rounds. Allies in range are empowered with +2 damage. The shriek does not discriminate. It just hurts.",
      level: 7,
      form: null,
      spellType: "ACTION",
      effectTypes: ["control", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Roar",
        tags: ["control", "buff", "fear", "aoe", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      controlConfig: {
        controlType: "mind_control",
        strength: "strong",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "fear",
            name: "Terrified",
            description:
              "Enemies are frozen in primal terror and must flee from you for 3 rounds",
            config: {
              fearStrength: "strong",
              saveType: "spirit",
              saveDC: 17,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "shriek_empowerment",
            name: "Empowered by Horror",
            description: "All allies gain +2 to damage rolls for 3 rounds",
            statModifier: {
              stat: "damage_rolls",
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
        targetingType: "area",
        rangeType: "self_centered",
        targetingMode: "effect",
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
        targetRestrictions: [],
        maxTargets: 20,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      effectTargeting: {
        control: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["enemy"],
        },
        buff: {
          targetingType: "area",
          rangeType: "self_centered",
          aoeShape: "circle",
          aoeParameters: { radius: 30 },
          targetRestrictions: ["ally"],
        },
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["control", "buff", "fear", "aoe", "formbender"],
    },

    {
      id: "formbender_apex_horror",
      name: "Apex Horror",
      description:
        "The food chain has a new top. For 4 rounds, you become the thing that everything else runs from â€” advantage on all attacks, +3d6 damage, and +10 movement speed. Your pupils are black holes. Your teeth are geometry problems. You are what happens when the predator stops pretending it has manners.",
      level: 7,
      form: null,
      spellType: "ACTION",
      effectTypes: ["buff", "damage"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Claw Marks",
        tags: ["buff", "damage", "predator", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "apex_horror",
            name: "Apex Horror",
            description:
              "Advantage on all attacks, +3d6 damage, +10 movement speed for 4 rounds. The predator has arrived.",
            statModifier: {
              stat: "damage",
              magnitude: 3,
              magnitudeType: "dice",
            },
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 4 },
        useFormulas: {},
        actionPoints: 2,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["buff", "damage", "predator", "formbender"],
    },

    // ===== LEVEL 8 SPELLS =====
    {
      id: "formbender_flesh_maelstrom",
      name: "Flesh Maelstrom",
      description:
        "You become a blender of screaming biology â€” cycling through all four forms in rapid succession, each one tearing free for a fraction of a second before the next erupts. Deal 12d8 + Strength x2 + Agility x2 slashing and bludgeoning damage to everything within 25 feet. There is no dodging. There is only being close enough to hear the wet sounds.",
      level: 8,
      form: null,
      spellType: "ACTION",
      effectTypes: ["damage"],
      typeConfig: {
        school: "slashing",
        secondaryElement: "bludgeoning",
        icon: "Nature/Tornado Vortex",
        tags: ["attack", "damage", "aoe", "transformation", "epic", "formbender"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "12d8 + strength * 2 + agility * 2",
        damageTypes: ["slashing", "bludgeoning"],
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
        maxTargets: 15,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ["somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["attack", "damage", "aoe", "transformation", "epic", "formbender"],
    },

    {
      id: "formbender_natures_terror",
      name: "Nature's Terror",
      description:
        "For 5 rounds, you are not an animal wearing a human shape â€” you are the shape itself, and it has decided to be everything at once. Gain +4 to all stats, physical damage resistance, 3d10 HP regeneration per turn, and -1 WI cost on all abilities. The human part of you is gone. It will come back. It always comes back. It never forgives you.",
      level: 8,
      form: null,
      spellType: "ACTION",
      effectTypes: ["buff", "transformation"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Natural",
        tags: ["buff", "transformation", "defense", "epic", "formbender"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },
      transformationConfig: {
        transformationType: "elemental",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Nature's Terror",
        description:
          "Become the shape itself â€” biology without a passenger.",
        grantedAbilities: [
          {
            id: "physical_resistance",
            name: "Physical Resistance",
            description:
              "Resistance to bludgeoning, slashing, and piercing damage",
          },
          {
            id: "nature_regen",
            name: "Biological Regeneration",
            description: "Regenerate 3d10 HP at the start of each turn",
          },
          {
            id: "reduced_costs",
            name: "Predatory Efficiency",
            description: "All Wild Instinct costs reduced by 1",
          },
          {
            id: "terror_stats",
            name: "+4 All Stats",
            description: "Gain +4 to all attributes",
          },
        ],
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "terror_stats",
            name: "Terror Stats",
            description: "+4 to all stats",
            statModifier: {
              stat: "all_stats",
              magnitude: 4,
              magnitudeType: "flat",
            },
          },
          {
            id: "terror_defense",
            name: "Terror Defense",
            description: "50% damage reduction for 5 rounds",
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
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["buff", "transformation", "defense", "epic", "formbender"],
    },

    {
      id: "formbender_unending_hunt",
      name: "Unending Hunt",
      description:
        "You split your hunger five ways and give each piece legs. Five spectral hunters materialize â€” not wolves, not spirits, but the pure abstract concept of *chase* given fangs and malice. They pursue all enemies within 40 feet for 5 rounds, dealing 12d6 + Spirit nature damage. The hunt does not end until everything is dead or you run out of things to be hungry about.",
      level: 8,
      form: null,
      spellType: "ACTION",
      effectTypes: ["summoning", "damage"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Ethereal Bird",
        tags: ["summoning", "damage", "spirit", "epic", "formbender"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },
      summoningConfig: {
        creatures: [
          {
            id: "hunt_spirit",
            name: "Hunt Spirit",
            description: "The abstract concept of pursuit, weaponized",
            size: "Large",
            type: "spirit",
            tokenIcon: "ability_hunter_pet_dragonhawk",
            stats: {
              maxHp: 60,
              armor: 16,
              maxMana: 0,
            },
            config: {
              quantity: 5,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              controlRange: 0,
            },
          },
        ],
        duration: 5,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        controlRange: 0,
        controlType: "autonomous",
      },
      damageConfig: {
        formula: "12d6 + spirit",
        damageTypes: ["nature"],
        resolution: "DICE",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 5 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["summoning", "damage", "spirit", "epic", "formbender"],
    },

    // ===== LEVEL 9 SPELLS =====
    {
      id: "formbender_primordial_abomination",
      name: "Primordial Abomination",
      description:
        "You do not transform into a beast of legend. You *become* the legend â€” a Gargantuan horror that exists in the space between nightmare and biology. Gain Gargantuan size, +5 all stats, resistance to all damage, -1 WI costs, and +3 WI per round for 4 rounds. When it ends, you will need a moment to remember that you were ever small.",
      level: 9,
      form: null,
      spellType: "STATE",
      effectTypes: ["transformation", "buff"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Wild 1",
        tags: ["transformation", "buff", "primordial", "legendary", "formbender"],
        stateVisibility: "visible",
        cooldownAfterTrigger: 0,
        cooldownUnit: "seconds",
        maxTriggers: 1,
      },
      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        duration: 4,
        durationUnit: "rounds",
        power: "major",
        newForm: "Primordial Abomination",
        description: "Become the nightmare that ancient things whisper about.",
        grantedAbilities: [
          {
            id: "gargantuan_size",
            name: "Gargantuan Size",
            description: "Size becomes Gargantuan, reach 15 feet",
          },
          {
            id: "primordial_resistance",
            name: "Primordial Resistance",
            description: "Resistance to all damage types",
          },
          {
            id: "free_instinct",
            name: "Primal Flow",
            description: "All Wild Instinct abilities cost 1 less",
          },
          {
            id: "instinct_gen",
            name: "+3 Wild Instinct/Round",
            description: "Generate +3 Wild Instinct per round",
          },
          {
            id: "primordial_stats",
            name: "+5 All Stats",
            description: "Gain +5 to all attributes",
          },
        ],
      },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          {
            id: "primordial_power",
            name: "Primordial Stats",
            description: "+5 to all stats",
            statModifier: {
              stat: "all_stats",
              magnitude: 5,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: false,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 8 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["transformation", "buff", "primordial", "legendary", "formbender"],
    },

    {
      id: "formbender_apocalypse_of_flesh",
      name: "Apocalypse of Flesh",
      description:
        "Your body reaches critical mass and detonates â€” not into pieces, but into a 100-foot radius of biological catastrophe. Deal 18d6 + Strength + Spirit nature damage to all enemies in sight (Con save DC 19 for half). Targets are knocked prone and stunned for 3 rounds. Afterward, your body reconstitutes from the carnage. It takes a while. The screaming from your allies does not help.",
      level: 9,
      form: null,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Earth Shatter",
        tags: ["attack", "damage", "control", "aoe", "legendary", "formbender"],
        castTime: 4,
        castTimeType: "IMMEDIATE",
      },
      damageConfig: {
        formula: "18d6 + strength + spirit",
        damageTypes: ["nature"],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "half_damage",
        },
        resolution: "DICE",
      },
      controlConfig: {
        controlType: "knockdown",
        strength: "extreme",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 19,
          saveOutcome: "negates",
        },
        effects: [
          {
            id: "devastated",
            name: "Devastated",
            description: "Target is knocked prone and stunned for 3 rounds",
            config: {
              saveType: "constitution",
              saveDC: 19,
              knockdown: true,
              stun: true,
              duration: 3,
              durationUnit: "rounds",
            },
          },
        ],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "sight",
        aoeShape: "circle",
        aoeParameters: { radius: 100 },
        targetRestrictions: ["enemy"],
        maxTargets: 50,
        targetSelectionMethod: "automatic",
        requiresLineOfSight: false,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 10 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "The fang of a primordial beast, worth 50,000 gold",
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["attack", "damage", "control", "aoe", "legendary", "formbender"],
    },

    {
      id: "formbender_eternal_hunger",
      name: "Eternal Hunger",
      description:
        "For 5 rounds, you merge with the hunger itself. Wild Instinct maximum increases to 30. Form transitions are free. You regenerate 2d8 HP per round in any form. The hunger does not ask. The hunger does not stop. The hunger is all that is left of whoever you used to be.",
      level: 9,
      form: null,
      spellType: "STATE",
      effectTypes: ["buff", "transformation"],
      typeConfig: {
        school: "nature",
        icon: "Healing/Heart Ripple",
        tags: ["buff", "transformation", "primal", "legendary", "formbender"],
        stateVisibility: "visible",
        cooldownAfterTrigger: 0,
        cooldownUnit: "seconds",
        maxTriggers: 1,
      },
      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Eternal Hunger",
        description: "Become the hunger. There is nothing left but appetite.",
        grantedAbilities: [
          {
            id: "wild_flow",
            name: "Hunger Unleashed",
            description: "Form transitions cost 0 Wild Instinct",
          },
          {
            id: "wild_instinct_gen",
            name: "+3 Wild Instinct/Round",
            description: "Generate +3 Wild Instinct each round",
          },
          {
            id: "wild_regen",
            name: "Biological Regeneration",
            description: "Regenerate 2d8 HP per round in any form",
          },
        ],
      },
      buffConfig: {
        buffType: "custom",
        effects: [
          {
            id: "eternal_hunger",
            name: "Eternal Hunger",
            description:
              "WI cap increased to 30. Form transitions are free. Regenerate 2d8 HP per round.",
            customDescription:
              "You have become the hunger. Your Wild Instinct maximum increases to 30. All form transformations are instant and free. You regenerate 2d8 HP per round. There is no human left to object.",
            mechanicsText:
              "WI cap 30, free transformations, regenerate 2d8 HP/round, duration 5 rounds",
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        concentrationRequired: false,
        canBeDispelled: true,
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 8 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["buff", "transformation", "primal", "legendary", "formbender"],
    },

    // ===== LEVEL 10 SPELLS =====
    {
      id: "formbender_world_devourer",
      name: "World Devourer",
      description:
        "You become a Colossal abomination â€” a biological catastrophe that exists at the scale of geography. +6 all stats. Resistance to all damage. +4d10 extra attack damage. 3d10 HP regeneration per turn. When it ends, you suffer 3 exhaustion levels as your body tries to remember what 'small' means. The world will remember what you looked like. It will not forgive you.",
      level: 10,
      form: null,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      typeConfig: {
        school: "nature",
        icon: "Utility/Resistance",
        tags: ["transformation", "buff", "legendary", "formbender"],
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },
      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "World Devourer",
        description: "Become a Colossal biological catastrophe. Geography recoils.",
        grantedAbilities: [
          {
            id: "colossal_size",
            name: "Colossal Size",
            description: "Size becomes Colossal, reach 20 feet",
          },
          {
            id: "devourer_stats",
            name: "+6 All Stats",
            description: "Gain +6 to all attributes",
          },
          {
            id: "damage_resistance",
            name: "Damage Resistance",
            description: "Resistance to all damage types (half damage)",
          },
          {
            id: "devourer_attacks",
            name: "Devastating Attacks",
            description: "All attacks deal +4d10 extra damage",
          },
          {
            id: "devourer_regen",
            name: "Biological Regeneration",
            description: "Regenerate 3d10 HP at start of each turn",
          },
          {
            id: "devourer_exhaustion",
            name: "Exhaustion (On End)",
            description: "Gain 3 levels of exhaustion when transformation ends",
          },
        ],
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 15 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "The heart of the World Beast, priceless artifact",
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["transformation", "buff", "legendary", "formbender"],
    },

    {
      id: "formbender_genesis_of_horror",
      name: "Genesis of Horror",
      description:
        "You split your hunger fifteen ways. Ten primal beasts and five elemental guardians tear themselves free from your biomass â€” not summoned from elsewhere, but *born* from you, screaming and hungry. They fight for 10 rounds. The umbilical connection is visible. Your party will not look at you the same way.",
      level: 10,
      form: null,
      spellType: "ACTION",
      effectTypes: ["summoning"],
      typeConfig: {
        school: "nature",
        icon: "Arcane/Star Trail Path",
        tags: ["summoning", "legendary", "formbender"],
        castTime: 5,
        castTimeType: "IMMEDIATE",
      },
      summoningConfig: {
        creatures: [
          {
            id: "horror_beast",
            name: "Horror Beast",
            description: "Savage beasts born from the Formbender's biomass",
            size: "Large",
            type: "beast",
            tokenIcon: "ability_druid_catform",
            stats: { maxHp: 80, armor: 15, maxMana: 0 },
            config: {
              quantity: 10,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 100,
            },
          },
          {
            id: "elemental_guardian",
            name: "Elemental Guardian",
            description: "Elemental horrors torn from the Formbender's chemical makeup",
            size: "Huge",
            type: "elemental",
            tokenIcon: "spell_nature_strengthofearth",
            stats: { maxHp: 120, armor: 18, maxMana: 0 },
            config: {
              quantity: 5,
              duration: 10,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              controlRange: 100,
            },
          },
        ],
        duration: 10,
        durationUnit: "rounds",
        hasDuration: true,
        concentration: false,
        controlRange: 100,
        controlType: "mental",
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 80,
        aoeShape: "circle",
        aoeParameters: { radius: 60 },
        targetRestrictions: [],
        maxTargets: 0,
        targetSelectionMethod: "manual",
        requiresLineOfSight: true,
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 12 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic", "material"],
        materialComponents: "Seeds of creation, worth 80,000 gold",
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["summoning", "legendary", "formbender"],
    },

    {
      id: "formbender_perfect_abomination",
      name: "Perfect Abomination",
      description:
        "For 5 rounds, you transcend the limits of biological horror. Maintain 2 forms simultaneously. Form transitions are free. Generate +2 WI per round. All WI costs reduced by 1. You are not one animal. You are not many animals. You are the *idea* of animal, and it has decided to wear your skin forever.",
      level: 10,
      form: null,
      spellType: "STATE",
      effectTypes: ["transformation"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Growth",
        tags: ["transformation", "mastery", "formbender"],
        stateVisibility: "visible",
        cooldownAfterTrigger: 0,
        cooldownUnit: "seconds",
        maxTriggers: 1,
      },
      transformationConfig: {
        transformationType: "primal",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Perfect Abomination",
        description:
          "Transcend biological limits. Become the idea of animal.",
        grantedAbilities: [
          {
            id: "hybrid_forms",
            name: "Hybrid Abominations",
            description: "Maintain benefits of 2 forms simultaneously",
          },
          {
            id: "instant_shift",
            name: "Instant Shift",
            description: "Form transitions cost 0 Wild Instinct",
          },
          {
            id: "evolved_instinct",
            name: "Evolved Instinct",
            description: "Generate +2 Wild Instinct per round",
          },
          {
            id: "ability_discount",
            name: "Predatory Efficiency",
            description: "All Wild Instinct costs reduced by 1 (minimum 1)",
          },
        ],
      },
      targetingConfig: {
        targetingType: "self",
      },
      resourceCost: {
        resourceTypes: ["wild_instinct"],
        resourceValues: { wild_instinct: 10 },
        useFormulas: {},
        actionPoints: 3,
        components: ["verbal", "somatic"],
      },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      tags: ["transformation", "mastery", "formbender"],
    },
    // ===== PASSIVE ABILITIES =====
    {
      id: "formbender_human_fragility",
      name: "Human Fragility",
      description:
        "Your body has adapted to stolen forms, making your human shape feel like a cage that doesn't fit. While in human form (no active transformation), you suffer -2 to all saving throws. This penalty vanishes the instant you assume any animal or elemental form â€” the mask is fragile, but the face behind it is not.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["passive"],
      typeConfig: {
        school: "nature",
        icon: "Necrotic/Necrotic Wither",
        tags: ["passive", "formbender", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      tags: ["passive", "formbender", "weakness"],
    },

    {
      id: "formbender_humanity_erosion",
      name: "Humanity Erosion",
      description:
        "Every transformation erodes your grip on the human mind. Track Erosion (0-10, starts at 0). Each standard form shift: +1 Erosion. Forced reversion (dispelled, KO'd): +2 Erosion. Thresholds: 3+ = Cannot speak Common, disadvantage on Intelligence checks. 5+ = Cannot use items, Wisdom save DC 13 to revert. 7+ = Each round, Wisdom save DC 14 or attack nearest creature. 10 = GM controls your character until combat ends. Recovery: -3 Erosion after Short Rest, reset to 0 after Long Rest.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Psychic/Mind Control",
      effectTypes: ["passive"],
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["passive", "formbender", "erosion", "humanity"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      tags: ["passive", "formbender", "erosion", "humanity"],
    },

    {
      id: "formbender_psychic_vulnerability",
      name: "Psychic Vulnerability",
      description:
        "The human consciousness inside you is a wound that never closes. You permanently take +50% Psychic damage from all sources. This is your Fatal Flaw â€” the animal body is resilient, but the mind wearing it is always bleeding. Mind-affecting effects bypass your transformed resilience entirely. The armor protects the flesh, not the passenger.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Psychic/Mind Control",
      effectTypes: ["passive"],
      typeConfig: {
        school: "psychic",
        icon: "Psychic/Mind Control",
        tags: ["passive", "formbender", "weakness", "fatal flaw"],
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          {
            id: "psychic_vulnerability",
            name: "Psychic Vulnerability",
            description:
              "Permanently take +50% damage from all Psychic sources. Mind-affecting effects bypass form resistance.",
            mechanicsText: "",
          },
        ],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      tags: ["passive", "formbender", "weakness", "fatal flaw"],
    },

    {
      id: "formbender_primal_collapse",
      name: "Primal Collapse",
      description:
        "Reverting from a transformation to human form is traumatic â€” your body cramming back into a shape it has outgrown. When a form expires or you willingly revert, take 1d4 psychic damage per round spent in that form (maximum 5d4). If the form was dispelled or forcibly ended by an enemy, increase to 1d6 per round. The shock of re-adjustment is the human mind's punishment for leaving.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Nature/Thorny Entanglement",
      effectTypes: ["passive"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Thorny Entanglement",
        tags: ["passive", "formbender", "weakness"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      tags: ["passive", "formbender", "weakness"],
    },

    {
      id: "formbender_primal_metabolism",
      name: "Primal Metabolism",
      description:
        "Your healing magic is parasitic â€” it only works when something else is wearing your skin. Stolen Mending, Flesh Donation, and Parasitic Mending cannot target yourself. You have no access to self-healing through class abilities in human form. Your only regeneration comes from the resilience of your stolen shapes. The gift moves outward. It never comes back.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Nature/Nature Natural",
      effectTypes: ["passive"],
      typeConfig: {
        school: "nature",
        icon: "Nature/Nature Natural",
        tags: ["passive", "formbender", "restriction"],
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      tags: ["passive", "formbender", "restriction"],
    },
  ],

  // Spell Pools by Level
  spellPools: {
    1: ["formbender_flesh_rip", "formbender_stolen_mending", "formbender_scent_of_prey"],
    2: [
      "formbender_visceral_talons",
      "formbender_predators_sight",
      "formbender_feral_bound",
    ],
    3: [
      "formbender_feral_fury",
      "formbender_bone_carapace",
      "formbender_spectral_hunters",
    ],
    4: [
      "formbender_savage_charge",
      "formbender_flesh_donation",
      "formbender_primal_surge",
    ],
    5: [
      "formbender_pack_of_abominations",
      "formbender_rending_frenzy",
      "formbender_adaptive_horror",
    ],
    6: [
      "formbender_titan_abomination",
      "formbender_crushing_descent",
      "formbender_parasitic_mending",
    ],
    7: [
      "formbender_chimera_ascendant",
      "formbender_horror_shriek",
      "formbender_apex_horror",
    ],
    8: [
      "formbender_flesh_maelstrom",
      "formbender_natures_terror",
      "formbender_unending_hunt",
    ],
    9: [
      "formbender_primordial_abomination",
      "formbender_apocalypse_of_flesh",
      "formbender_eternal_hunger",
    ],
    10: [
      "formbender_world_devourer",
      "formbender_genesis_of_horror",
      "formbender_perfect_abomination",
    ],
  },
};

