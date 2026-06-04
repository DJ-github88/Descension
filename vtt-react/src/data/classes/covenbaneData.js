export const COVENBANE_DATA = {
  id : "covenbane",
  name: "Covenbane",
  icon: "fas fa-crosshairs",
  color: "#8B4513",
  role: "Anti-Magic Hunter",
  damageTypes: ["radiant", "force", "slashing"],

  // Overview section
  overview: {
    title: "The Covenbane",
    subtitle: "A Mutilated Instrument of Divine Negation",
    originStory: `The Bryngloom Forest is a landscape of moss and peat-bogs where the line between life and death is a legal clause written in silver and heartwood. The Vreken, native to these crepuscular caves, carry the Ghost-Mycelium in their blood, granting them the trail-sight to track the residual light of the dead. But the volatile fungus is a double-edged sword, carrying the highly addictive, euphoric "hush" that leads to the Over-Lit epidemic.

In the fifth century, a beloved Marked Veil-Speaker named Aedris succumbed to the hush, her eyes burning with a blinding silver light that bleached the peat-stone. Blinded by her own glow, she began draining the lifeforce of her acolytes. Her brother, Orven the Still-Handed, refused to let the crypt-council debate. He forged a blade of cold bog-iron, wrapped his hands in salted leather, and tracked his sister into the deepest bogs. He ended her suffering and swore the Barbed Vow: to execute any kinsman lost to the mycelial hush.

Orven's sacrifice birthed the order of the Covenbane. To carry the cold iron and alchemical null-salts is to become a sterile void for magic. The silver deposits in their marrow make their bones brittle, and their tracking seals isolate them from the very Spire they protect. The Clean Vreken crypt-councils tolerate them at the margins, relying on their blades but banning them from the high archives.

You are the Covenbane. The trail-sight shows you every kinsman who has fallen to the hush. You hunt them because no one else can. You hunt them alone because no one else should have to.`,

    quickOverview: {
      title: "The Agony of the Hunt",
      content: `**A Crown of Ash and Lead**: The Covenbane is a tragic negation of the natural order -- a mortal who has poisoned their own flesh with alchemical silver salts and black thall-dust to become a walking grave for the arcane. You build Hexbreaker Charges (0-6) exclusively through the agonizing friction of magical confrontation: absorbing, witnessing, and shattering reality-warping spells. Against simple beasts or mundane bandits, you generate NOTHING. Your silver-poisoned veins only sing when reality is torn by magic.

**Core Mechanic**: Consume active magic → Forge Hexbreaker Charges from anti-magic friction (intercepting curses, breaking wards, shattering enchantments) → Spend charges on horrifying rituals of negation → Bonus atrocities against evil magic users

**Resource**: Hexbreaker Charges (0-6 scale, decaying rapidly when the battlefield falls silent)

**Passive**: Witch Hunter's Precision — Every 3rd strike against a spellcaster unleashes a white-hot spike of alchemical silver that bypasses all resistance

**Playstyle**: Relentless anti-magic striker — carrying alchemical fragility, hunting down reality-warping corruption

**Best For**: Players who crave systematic oppression of spellcasters, tactile resource systems, and heavy, high-stakes trade-offs`,
    },

    description: `The Covenbane is the silent, shadow-cloaked stalker of the deep marshes — an anti-magic executioner wreathed in cold iron, silent seals, and a heavy, tragic purpose. They do not seek glory, nor do they offer comfort. Armed with specialized anti-magic seals and rusted executioner's irons, they track their prey through the dark and purge magical corruption with absolute, mechanical precision. Their signature resource — **Anti-Magic Seals** — allows them to disrupt spellcasting, nullify wards, and dismantle supernatural entities from within. Yet, the price of this power is absolute social isolation: to carry the cold iron is to be cast out from the very community you bleed to protect.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The covenbane's specialized tracking was born in the deep, damp bogs of the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink>. A Vreken hunter named <LoreLink termId="orven">Orven</LoreLink>, whose sister had succumbed to the mycelial spore-hush, swore the Barbed Vow to track and execute his own corrupted kinsmen.

The price of this tracking efficiency was complete social isolation. By training his trail-sight to detect the fungal-hush, Orven permanently scarred his mental pathways, leaving him blind to warmth and locked in a sterile, silent hunt.

**CITIES & CIVIL RECEPTION**
Covenbanes are feared, respected, and deeply isolated. They are tolerated at the margins of <LoreLink termId="sunken_spire">The Sunken Spire</LoreLink> and Atropolis, but they never find a permanent home within the civilian sectors.

**RACES & CULTURAL AFFILIATION**
The class is exclusively practiced by the <LoreLink termId="vreken">Marked Vreken</LoreLink> who carry the volatile Ghost-Mycelium strain.

**NOTABLE FIGURES**
* **Orven the Still-Handed**: The founder of the Barbed Vow who tracked his own sister into the sinking bogs.
* **Aedris the Blind**: A Marked Vreken hunter who tracked heretics through the bogs using only the thrum of the mycelium.`
    },

    signatureQuote: {
      text: '"She was my sister before she was their priestess. I loved her before I killed her. That is the Barbed Vow. Love first. Execution second. Always in that order."',
      speaker: 'Orven the Still-Handed',
      context: 'Testimony before the Vreken Crypt-Council after executing his sister Aedris'
    },

    philosophy: {
      coreTenet: 'Magic is a disease, and those who wield it irresponsibly are vectors. The Covenbane does not hunt witches because they are evil — they hunt them because unchecked magic attracts worse things. The Wyrd bleeds through the cracks that careless spellcasters create. Covenbanes are the ones who seal the cracks by removing the caster.',
      relationship: 'Covenbanes draw power from cold iron, null-salt, and the absolute conviction that their work is necessary. They do not cast spells — they shatter them. Their anti-magic aura is not a gift; it is a curse they have learned to weaponize. A Covenbane cannot be healed by magic, cannot be enchanted, cannot be blessed. They exist in a permanent state of magical isolation.',
      paradox: 'The Covenbane exists to kill the thing they love best. Orven killed his sister. Every Covenbane since has trained to kill their own kin — because the most dangerous magic always comes from someone close enough to trust. The Barbed Vow demands that a Covenbane be willing to execute anyone, and the only way to prove that willingness is to start with family. They are the loneliest warriors in Mythrill.'
    },

    currentCrisis: `The Bryngloom mycelial network is developing a response to Covenbane activity. The hive-mind of the bog — the Root-Veil — has begun marking Covenbanes with a distinctive fungal rash that glows in the dark. The rash makes stealth impossible and alerts mycelial creatures to the Covenbane\'s presence from miles away.

Worse: the rash is spreading to non-Covenbanes who associate with them. Families of Covenbanes are developing the same luminous rash, making them targets. For the first time in centuries, recruits are refusing the Barbed Vow. They will hunt witches. They will not sacrifice their families to do it. The existing Covenbanes are divided: some argue the rash is a sign that their work is more important than ever, while others believe the Root-Veil is sending a clear message to stop.`,

    meaningfulTradeoffs: `To be a Covenbane is to accept total isolation. The anti-magic aura that allows them to hunt witches also prevents them from receiving magical healing, blessing, or comfort. A Covenbane with a broken leg must wait for it to heal naturally — no priest can speed the process. A Covenbane dying of disease must fight it with their own immune system. They cannot be detected by divination, which means search parties cannot find them if they are lost. They are, permanently and irrevocably, alone in a world full of magic.`,

    classSpecificLocations: [
      {
        name: 'The Hall of Barbed Vows',
        locationId: 'sunken-spire',
        description: 'A deep chamber beneath the Sunken Spire where Covenbanes undergo their initiation. The walls are hung with the cold-iron blades of every Covenbane who has taken the Vow — rows upon rows of identical swords, each one representing a life dedicated to magical extermination. The newest blade still bears traces of its owner\'s blood.',
        purpose: 'Initiation hall, armory, and memorial',
        status: 'Active — but the newest blades are being hung by people whose families now glow in the dark'
      }
    ],

    combatRole: {
      title: "The Silent Shroud",
      content: `The Covenbane is an oppressive anti-magic predator that excels at:

**Arcane Desecration**: Shattering active enchantments, silencing spoken incantations, and turning mana to boiling poison in the caster's throat
**Relentless Pursuit**: Scenting the ripple of magic and closing the gap with terrifying, singleminded speed
**Dead-Magic Zones**: Forcing reality back to its inert state, creating boundaries where spellcasters choke on their own power
**Radiant Rupture**: Channeling white-hot alchemical silver to disintegrate evil and demonic flesh

**The Strength of the Void**:
- Systematically strips casters of their safety, shutting down their spells completely
- Every spell cast at you is fuel -- their arrogance builds your negation
- Absolute execution thresholds against spell-wielding targets
- Protective dead-magic fields shield your allies from ruinous spells
- Deals devastating, raw radiant damage that burns away magical wards
- Your strikes bypass resistances of those who have warped their souls

**The Agonizing Toll (Your Fatal Flaws)**:
- **Rejection of all Magic**: Because your body is a sterile void, you cannot receive beneficial magical buffs or healing from allies without suffering 1d10 psychic damage from the agonizing friction
- **Brittle Skeleton**: The silver deposits in your marrow make you fragile. You suffer a permanent 50% vulnerability to physical bludgeoning and slashing damage
- **Rapid Decay**: Your Hexbreaker Charges decay by -1 per round when the battlefield falls silent
- **Mundane Famine**: In encounters without spellcasters, you have no resource, no spells, and no miracles. You are a slow, fragile mortal carrying heavy iron
- **The Hunger**: You crave magic. Without its presence, the silver in your veins stagnates, slowly poisoning your mind`,
    },

    playstyle: {
      title: "The Dirge of Battle",
      content: `Playing a Covenbane is to manage a decaying resource of pure spite. Your engine runs on the desecration of the arcane:

**Feeding the Embers** (Hexbreaker Charges):
- **Targeted by a Spell**: +1 Charge. You let their curse sink into your skin, converting the agony into cold resolve
- **Ally Targeted Nearby**: +1 Charge. The ripple in reality makes your silvered teeth ache
- **Dispelling or Countering**: +2 Charges. Physically tearing a spell apart is the ultimate alchemical relief
- **Witnessing Spell Failure**: +1 Charge. The void laughs when their magic sputters
- **Striking a Spellcaster**: +1 Charge. Tearing the silver blade through active mana
- **Executing a Caster**: +3 Charges. A momentary silence in the screaming void
- **Mundane Combat**: NO CHARGES GENERATED. Bandit blades and beast teeth yield no magic to devour
- **Quiet Rounds**: -1 Charge per round. The decay of your ash-bound soul

⚠️ **The Silver Starvation**: Against mundane threats, you are slow, heavy, and extremely vulnerable. You must rely on physical positioning while your allies shield your fragile bones.

**Witch Hunter's Precision** (Level 2 Passive):
- Every 3rd weapon strike against an active caster unleashes alchemical fire, bypassing all defenses

**Hexbreaker Charge Strategy**:
- **1-2 Charges**: Fueling small, agonizing self-buffs and minor anti-magic disruptions
- **3-4 Charges**: Creating persistent dead-magic fields and silencing major circles
- **5-6 Charges**: Unleashing terminal executions and absolute reality-purging strikes

**Specialization Paths**:
- **Shadowbane**: Striking from absolute darkness, silencing the target before they can speak the first rune
- **Spellbreaker**: The ultimate bulwark, turning the enemy's spells into their own physical graves
- **Demonhunter**: A fanatical executioner who marks demons and heretics, chasing them into the mouth of hell

**Absolute Specialization**: All your spells deal full damage to any target, but the agonizing debuffs and instant-kill executions only trigger when the victim carries the stench of the arcane.

**Tactical Martyrdom**:
- Position yourself in the trajectory of the spell. Your flesh is the shield
- Maintain your silver coating or watch your DC fail as alchemical decay sets in
- Coordinate with your party: they must protect you from physical steel while you devour the witch
- Never let a spellcaster breathe. Run them down, choke their words, and burn their bones.`,
    },

    combatExampleVsEvil: {
      title: "Combat Example: The Witch Hunt",
      content: `**The Setup**: You stand in a ruined chantry. Rain like cold nails. A coven of dark witches chants around a pulsing brand. You (Spellbreaker specialization) mark the lead witch, sensing her corrupt pulse. Starting Hexbreaker Charges: 0.

**Starting State**: HP: 85/85 | Hexbreaker Charges: 0 | Spells Ready: Scent of Ash, Null-Salts Strike, Silver Bolt

**Round 1 — Scent the Blood**

*The witch screams as her fingers trace the air, molding a curse.*

**Your Action**: Unleash Scent of Ash (1 AP) → Brand the witch's soul
**Effect**: Advantage on d20 attack rolls against her, +1d4 radiant per hit as the silver burns

*Hexbreaker Charges: 0 → 1*

**Your Attack**: Strike with Null-Salts Strike active → Hit! +1d8 necrotic (evil caster)

*Hexbreaker Charges: 1 → 2*

**Round 2 — The Fire and the Silver**

*The witch hurls a crackling firestorm to burn you to cinders.*

**Your Action**: Close the distance and strike (advantage from Scent of Ash)
**Effect**: Weapon damage + Scent of Ash radiant. This is your 3rd attack against the spellcaster — Witch Hunter's Precision triggers! +1d6 radiant damage that bypasses all resistance.

*Hexbreaker Charges: 2 → 3*

**Round 3 — The Inevitable Silence**

*The witch desperately gathers mana for a terminal spell.*

**Your Action**: Erect Anti-Magic Barrier (costs 2 charges, 1 AP)
**Effect**: A 10ft dome of dead magic. Her spell sputters and implodes, scorching her skin.

*Hexbreaker Charges: 3 → 1*

**Round 4 — Terminal Execution**

*The witch lies bleeding, her magic broken. She cannot escape.*

**Your Action**: Unleash Terminal Execution (costs 3 charges, 2 AP)
**Effect**: 6d10 radiant damage. The silver in her veins erupts into white-hot spikes, leaving only ash.

*Hexbreaker Charges: 0 → 3 (defeating evil magic user = +3 charges)*

**Victory**: The witch is ash. The void falls silent. You carry 3 charges to the next hunt.`,
    },

    combatExampleMixed: {
      title: "Combat Example: The Forest Ambush",
      content: `**The Setup**: A gang of highwaymen ambushes your wagon on the forest road. No spellcasters. No curses. Only mundane muscle and cold steel. Starting Hexbreaker Charges: 2.

**Key Insight**: Your alchemist's salt still deals raw damage, but you have no magic to feed on. You are just a fragile mortal carrying a crushing weight.

**Round 1 — Cold Iron**

*Three bandits rush from the brush, swords raised.*

**Your Action**: Activate Null-Salts Strike (1 AP) → Strike the closest bandit
**Effect**: Deals +1d6 necrotic damage (not +1d8, they carry no active magic). Generate no charges.

*Hexbreaker Charges: 2 → 1 (decay due to no magic present)*

**Round 2 — Desperate Agility**

*The bandit chief sweeps a heavy axe toward your chest.*

**Your Action**: Cast Dark Pursuit (costs 1 charge, 1 AP) → Dash 30ft, advantage on next strike
**Effect**: Slide under the blade and position yourself behind him.

*Hexbreaker Charges: 1 → 0*

**Round 3 — The Silver Bolt**

*A bandit archer aims at your allies.*

**Your Action**: Cast Silver Bolt (1 AP) at the archer
**Effect**: 2d8 radiant damage. The projectile flies straight (doesn't curve, as he has no magical scent). It clips his shoulder, dropping him.

*Hexbreaker Charges: 0 → 0*

**Takeaway**: Against mundane threats, you can still fight, but your alchemical fragility makes you vulnerable. You are a dying ember, waiting for the witch to light the fire.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Hexbreaker Charges",
    subtitle: "Anti-Magic Power Through Confrontation",

    description: `The Covenbane is the ultimate answer to the corruption of dark magic. You build Hexbreaker Charges exclusively through anti-magic events — being targeted by spells, dispelling enchantments, witnessing spell failure, and destroying evil magic users. Mundane combat generates NOTHING. You are a weapon forged to break casters, and without magical opposition, your power wanes. Charges decay by -1 per round when no magical event occurs. This is the price of absolute specialization.`,

    cards: [
      {
        title: "Hexbreaker Charges (0-6)",
        stats: "Built Through Anti-Magic Events Only",
        details:
          "Your stored anti-magic potential. Charges are generated ONLY when magic is used against you, near you, or by enemies you fight. Mundane combat yields no charges. Charges decay -1/round when no magical event occurs.",
      },
      {
        title: "Witch Hunter's Precision",
        stats: "Level 2 Passive",
        details:
          "Every 3rd weapon attack against an evil magic user deals 1d6 Radiant damage. This damage bypasses all resistance and immunity.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Charges", "Notes"],
      rows: [
        [
          "Enemy casts a spell targeting you",
          "+1",
          "Their magic is your fuel — absorb it",
        ],
        [
          "Enemy casts a spell targeting an ally within 30ft",
          "+1",
          "You sense the magic and it feeds you",
        ],
        [
          "Successfully dispel or counterspell",
          "+2",
          "Unraveling magic is the richest feast",
        ],
        [
          "Witness enemy spell fail, fizzle, or be resisted",
          "+1",
          "The void answers failed magic",
        ],
        [
          "Cast Covenbane spell at a magic-using target",
          "+1",
          "Anti-magic begets anti-magic",
        ],
        [
          "Defeat Evil Magic User",
          "+3",
          "The ultimate reward for a successful hunt",
        ],
        [
          "Weapon Attack (Mundane Target)",
          "+0",
          "NO CHARGE — you need WITCHES, not bandits",
        ],
        [
          "Defeat Mundane Enemy",
          "+0",
          "NO CHARGE — a hollow victory",
        ],
        [
          "No magical event this round",
          "-1",
          "The Hunter's Curse — charges decay without magic",
        ],
      ],
    },

    usage: {
      momentum:
        "Spend 3-6 charges to trigger Execution effects or massive Anti-Magic Zones. Against evil casters, these abilities often include instant-kill thresholds or silence effects.",
      flourish:
        "⚠️ Precision Marking: Always open with 'Shadow Hunt'. It grants advantage and double-charges your attacks, allowing you to reach your 6-charge ultimate in half the time.",
    },

    overheatRules: {
      title: "Anti-Magic Superiority & The Hunter's Curse",
      content: `Your efficiency depends entirely on the **presence of magic** on the battlefield. This is not optional — it is your lifeblood.

**Mundane Encounters (NO magic users present)**:
- Your spells deal full damage.
- You lose all "Bane" effects (dispel, silence, or bonus damage).
- You CANNOT generate Hexbreaker Charges. They decay -1/round.
- You are a competent fighter with no access to your defining abilities.
- ⚠️ This is your crippling weakness. Accept it.

**Magical Encounters (Spellcasters present)**:
- Every spell cast at you or near you feeds your charges.
- Your abilities are supercharged against evil magic users.
- Spells like "Silver Bolt" curve around cover, and "Hexbreaker Execution" can instantly destroy targets at low health.

**The Sense**:
- You can detect evil magic within 60 feet. Use this to prioritize targets before they even begin casting.
- The moment you sense magic, the hunt begins — and your charges start building.`,
    },

    strategicConsiderations: {
      title: "The Hunt: Targeting & Resource Management",
      content: `**Phase 1: Bait the Magic (0-1 Charges)**: You NEED the enemy to cast spells at you. Position aggressively — make yourself a target. Each spell aimed at you is +1 charge. Cast 'Shadow Hunt' to mark the primary caster, marking them for the pack.

**Phase 2: Feast on Disruption (2-3 Charges)**: Use 'Spellbreaker' or 'Curse Eater' to dispel enemy buffs. Each successful dispel = +2 charges. You are building power by UNRAVELING their magic.

**Phase 3: Judgment (5-6 Charges)**: Unleash 'Hexbreaker Execution'. Against an evil caster, this is your "I Win" button, dealing massive damage and bypassing protections.

**The Starvation Risk**: In encounters with no spellcasters, your charges decay to 0. You cannot bank charges between mundane fights. Plan accordingly — ask your party to bait out enemy magic if possible.

**Team Protection**: Stand near your allies. Your anti-magic zones can negate the fireballs and curses that would otherwise wipe your party — and each spell they cast at your allies feeds YOU.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Silver Coins",
      content: `Use a tray of 6 Silver Coins or Metal Washers to track your power.

**Required Materials**:
- **6 Silver Coins** (Hexbreaker Charges)
- **1 Spare d6** (Precision Tally)
- **Silver Ring or Marker** (Bane Aura)

**The Resource Loop**:
- **Generate**: Flip a coin to the "Silver" side for each charge built.
- **Spend**: Slide coins toward the DM when you unleash your hunt.

**The Physical Hack (Friction Points)**:
- **Precision Tally**: Keep the d6 next to your dice. Each time you attack an evil caster, turn it: 1 → 2 → 3. On 3, you trigger **Witch Hunter's Precision**, then reset the die. Never miss your bonus radiant damage again.
- **The Bane Marker**: When you sense evil magic in an enemy (60ft), place a silver ring or marker around their mini. This reminds the entire team that your "Silver Bolt" and "Execution" bonuses are active against them.

**Pro Tips**: 
- Keep a specific "Shadow Hunt" token to place next to your marked prey — it reminds you to take your bonus charge on every hit.
- **Radiant Dice**: Use a distinct color (like white or gold) for your radiant bonus damage so you can roll it alongside your main weapon damage.`,
    },
  },

  // Class Features
  features: [
    { id : "witch_hunter_training",
      name: "Witch Hunter Training",
      description:
        "You gain proficiency with light armor, medium armor, shields, simple weapons, martial weapons, and alchemist's supplies.",
      level: 1,
    },
    
    { id : "hexbreaker_charges",
      name: "Hexbreaker Charges",
      description:
        "You build Hexbreaker charges exclusively through anti-magic events — being targeted by spells, dispelling enchantments, witnessing spell failure, and destroying evil magic users. Mundane combat generates no charges. Charges decay -1/round without magical opposition.",
      level: 1,
    },
    
    { id : "covenbane_magic",
      name: "Covenbane Magic",
      description:
        "You know the cantrips Light and Sacred Flame. At 2nd level you learn the spell Detect Magic.",
      level: 1,
    },
    
    { id : "witch_hunters_precision",
      name: "Witch Hunter's Precision",
      description:
        "Every 3rd weapon attack against an evil magic user deals 1d6 radiant damage that bypasses resistance and immunity. This damage cannot be reduced by any means.",
      level: 2,
    },
  ],

  // Talent Trees
  talentTrees: [
    { id : "shadowbane",
      name: "Shadowbane - Stealth & Assassination",
      description:
        "Masters of darkness and surprise, striking from the shadows to eliminate evil magic users.",
      icon: "Utility/Hide",
      color: "#2F2F4F",
      talents: [],
    },
    
    { id : "spellbreaker",
      name: "Spellbreaker - Anti-Magic Mastery",
      description:
        "Specialists in disrupting and destroying magical effects and spellcasters.",
      icon: "Arcane/Magical Cross Emblem 2",
      color: "#4F2F2F",
      talents: [],
    },
    
    { id : "demonhunter",
      name: "Demonhunter - Relentless Pursuit",
      description:
        "Fanatical hunters who mark and relentlessly pursue evil creatures across any distance.",
      icon: "Piercing/Targeted Strike",
      color: "#4F4F2F",
      talents: [],
    },
  ],

  // ═══════════════════════════════════════════════════════════════════
  // COVENBANE SPELLS BY LEVEL
  // ═════════════════════════════════════════════════════════════════
  exampleSpells: [
    // ===== LEVEL 1 SPELLS — Fundamentals (0 charges) =====

    { id : "cov_shadow_hunt",
      name: "Scent of Ash",
      description:
        "Mark a creature within 60 feet with a spectral brand of ash, sensing its presence and direction. Attacks against the marked target gain advantage and deal +1d4 radiant damage for 10 minutes.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Piercing/Targeted Strike",
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Targeted Strike",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["tracking", "marking", "utility"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Hunter's Mark",
            description:
              "Advantage on attack rolls against marked target. Sense direction and distance within 10 miles.",
            mechanicsText: "",
            statModifier: {
              stat: "attack",
              magnitude: "advantage",
              magnitudeType: "special",
            },
          },
          { id : "mark_radiant_bonus",
            name: "Mark Weakness",
            description:
              "+1d4 radiant damage on weapon attacks against the marked target",
            mechanicsText: "1d4 radiant",
          },
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["tracking", "marking", "utility", "shadowbane"],
    },

    { id : "cov_hex_strike",
      name: "Null-Salts Strike",
      description:
        "Imbue your weapon with flesh-burning null-salts. Your next melee attack deals +1d6 necrotic damage and generates 1 Hexbreaker Charge on hit. Against evil magic users, the damage increases to +1d8.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Necrotic/Necrotic Skull",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Skull",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["damage", "weapon", "charge generation"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "hexbreaker", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Hex-Imbued Weapon",
            description:
              "Next melee attack deals +1d6 necrotic damage (+1d8 vs evil magic users). Generates 1 Hexbreaker Charge on hit against any target.",
            mechanicsText: "1d6 necrotic",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "1d8 necrotic bonus damage",
              default: "1d6 necrotic bonus damage",
            },
          },
        },
      },
      tags: ["damage", "weapon", "charge generation"],
    },

    { id : "cov_silver_blade",
      name: "Agonizing Silver Binding",
      description:
        "Coat your blade in liquid silver for 1 minute. Each attack deals +1d4 radiant damage. Against evil creatures, attacks also bypass magical resistance.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Radiant/Radiant Beam",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Beam",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["weapon", "anti magic", "resistance piercing"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 0 },
        actionPoints: 1,
        components: ["verbal", "material"],
      },
      classResource: { type: "hexbreaker", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Blessed Silver Coating",
            description:
              "Weapon attacks deal +1d4 radiant damage. Against evil creatures, attacks also bypass magical resistance and immunity.",
            mechanicsText: "1d4 radiant vs evil",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+1d4 radiant + bypass magical resistance",
              default: "+1d4 radiant",
            },
          },
        },
      },
      tags: ["weapon", "anti magic", "resistance piercing", "demonhunter"],
    },

    { id : "cov_dark_pursuit",
      name: "Ash Step",
      description:
        "Dash 30 feet on a wave of living ash, ignoring difficult terrain and opportunity attacks. Gain advantage on your next melee attack.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["utility", "buff"],
      icon: "Utility/Speed Boot",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Speed Boot",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["mobility", "speed", "utility"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      utilityConfig: {
        utilityType: "movement",
        utilitySubtype: "speed",
        selectedEffects: [
          { id : "shadow_dash",
            name: "Shadow Dash",
            description:
              "Dash 30 feet without provoking opportunity attacks. Ignore difficult terrain until end of turn.",
            movementBonus: 30,
            duration: 1,
            durationUnit: "rounds",
            mechanicsText: "30 feet",
          },
        ],
        power: "moderate",
      },
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          { id : "pursuit_advantage",
            name: "Relentless Strike",
            description: "Advantage on next melee attack this turn",
            mechanicsText: "",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Dash 30ft + advantage + ignore difficult terrain",
              default: "Dash 30ft + advantage",
            },
          },
        },
      },
      tags: ["mobility", "speed", "utility", "shadowbane"],
    },

    { id : "cov_hex_weakness",
      name: "Sigil of Rotting Mana",
      description:
        "Afflict a target with a sigil unraveling their magic for 1 minute. Spell attacks suffer -2 penalty and spell save DC drops by 1. Evil casters have disadvantage on concentration checks when taking damage.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      icon: "Necrotic/Necrotic Decay 1",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Decay 1",
        castTime: 1,
        castTimeType: "ACTION",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["debuff", "curse", "anti magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "weakened_magic",
            name: "Weakened Magic",
            description:
              "Spell attack rolls reduced by 2, spell save DC reduced by 1",
            statPenalty: [
              { stat: "spell_attack", value: -2 },
              { stat: "spell_dc", value: -1 },
            ],
            mechanicsText: "-2 Spell Attack, -1 Spell DC",
          },
          { id : "concentration_disruption",
            name: "Concentration Disruption",
            description:
              "Evil magic users have disadvantage on concentration checks when taking damage",
            statPenalty: {
              stat: "concentration",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "Disadvantage on Con checks (evil only)",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "moderate",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          debuff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "-2 Spell Attack, -1 Spell DC, disadvantage on concentration",
              default: "-2 Spell Attack, -1 Spell DC",
            },
          },
        },
      },
      tags: ["debuff", "curse", "anti magic", "spellbreaker"],
    },

    { id : "cov_silver_bolt",
      name: "Silver Bolt",
      description:
        "Launch a guided bolt of hardened silver light at a target within 60 feet. Deals 2d8 radiant damage. Against evil creatures, the bolt curves around cover and cannot be intercepted.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["damage"],
      icon: "Radiant/Radiant Bolt",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Bolt",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["damage", "ranged", "anti magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "2d8",
        damageType: "direct",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "2d8 + 2d4",
              default: "2d8",
            },
          },
        },
      },
      tags: ["damage", "ranged", "anti magic", "demonhunter"],
    },

    // ===== LEVEL 3 SPELLS — Mid-Tier Tools (1-2 charges) =====

    { id : "cov_curse_eater",
      name: "Curse Eater",
      description:
        "Tear a curse, hex, or magical affliction from a creature you touch, healing them for 2d8 and gaining 1 Hexbreaker Charge if the affliction was evil magic.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["purification", "healing"],
      icon: "Necrotic/Devour",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Devour",
        castTime: 1,
        castTimeType: "ACTION",
        range: "touch",
        rangeType: "touch",
        tags: ["dispel", "anti magic", "healing"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
        targetRestrictions: ["allies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1, gainOnEvilMagic: 1 },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      purificationConfig: {
        purificationType: "remove_curse",
        targetEffects: ["curse", "hex", "magical_affliction"],
        strength: "full",
        checkRequired: false,
        healAmount: "2d8",
      },
      healingConfig: {
        formula: "2d8",
        healingType: "direct",
        resolution: "DICE",
        hasHotEffect: false,
        hasShieldEffect: false,
      },
      tags: ["dispel", "anti magic", "healing", "spellbreaker"],
    },

    { id : "cov_shadow_ambush",
      name: "Shadow Ambush",
      description:
        "Dissolve into living shadow, becoming invisible for up to 1 minute. Your first melee attack from this state deals +2d6 necrotic damage with advantage and frightens evil magic users.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Utility/Hide",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Hide",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["stealth", "utility", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "hexbreaker", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          { id : "shadow_veil",
            name: "Shadow Veil",
            description:
              "Invisible to all creatures. Next melee attack deals +2d6 necrotic with advantage. Frightens evil magic users on hit.",
            mechanicsText: "2d6 necrotic",
          },
        ],
        statusEffects: [{ id : "invisible", level: 1 }],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "2d6 necrotic + frighten target",
              default: "2d6 necrotic",
            },
          },
        },
      },
      tags: ["stealth", "utility", "shadowbane"],
    },

    { id : "cov_anti_magic_barrier",
      name: "Anti-Magic Barrier",
      description:
        "Project a 10-foot dome of anti-magic light for 3 rounds. Enemy spellcasters inside must Con save DC 14 or their spells fail. Allies inside gain +2 to saves against magic.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff", "utility"],
      icon: "Arcane/Magical Cross Emblem 2",
      typeConfig: {
        school: "necrotic",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["protection", "anti magic", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 10 },
        targetRestrictions: ["allies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id : "spell_disruption_zone",
            name: "Spell Disruption Zone",
            description:
              "Enemy spellcasters in zone must Con save DC 14 or spell fails. Allies gain +2 to saves vs magic.",
            duration: 5,
            durationUnit: "rounds",
            saveDC: 14,
            saveType: "constitution",
            mechanicsText: "10ft radius, 3 rounds",
          },
        ],
        power: "moderate",
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          { id : "magic_resistance_aura",
            name: "Magic Resistance Aura",
            description:
              "+2 to all saving throws against spells and magical effects while inside the barrier",
            mechanicsText: "+2 save vs magic",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["protection", "anti magic", "spellbreaker"],
    },

    // ===== LEVEL 4 SPELLS — Strong Effects (2-3 charges) =====

    { id : "cov_silver_hex",
      name: "Silver Hex",
      description:
        "Brand a creature with a silver sigil that makes them vulnerable to radiant damage — all radiant damage from all sources is doubled. Evil magic users also suffer disadvantage on concentration checks when taking damage.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      icon: "Radiant/Radiant Beam",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Beam",
        castTime: 1,
        castTimeType: "ACTION",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["debuff", "curse", "anti magic"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          { id : "radiant_vulnerability",
            name: "Radiant Vulnerability",
            description:
              "Vulnerable to radiant damage from all sources — radiant damage taken is doubled",
            statPenalty: {
              stat: "radiant_vulnerability",
              value: 100,
              magnitudeType: "percentage",
            },
            mechanicsText: "Radiant damage doubled",
          },
          { id : "silver_concentration_break",
            name: "Silver Disruption",
            description:
              "Evil magic users have disadvantage on concentration checks when taking damage",
            statPenalty: {
              stat: "concentration",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "Disadvantage on Con checks (evil only)",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "hard",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          debuff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Radiant damage doubled + disadvantage on concentration",
              default: "Radiant damage doubled",
            },
          },
        },
      },
      tags: ["debuff", "curse", "anti magic", "demonhunter"],
    },

    { id : "cov_spirit_shackle",
      name: "Spirit Shackle",
      description:
        "Pin a target's shadow to the ground with anti-magic chains. ⚠️ REQUIRES 3+ HEXBREAKER CHARGES. The target is restrained for up to 1 minute (Spirit save DC 15 at end of each turn ends the effect). Attacks against the restrained target have advantage. Against evil magic users, the target is also silenced. This is the Covenbane's ONLY hard CC — it demands heavy resource investment and is useless without charges built up from absorbing enemy magic.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["control"],
      icon: "Necrotic/Corruption",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Corruption",
        castTime: 1,
        castTimeType: "ACTION",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["crowd control", "root", "silence", "control", "resource_gated"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        minimumChargesRequired: 3,
        description: "Requires 3 Hexbreaker Charges (gained only from anti-magic events). This ability is IMPOSSIBLE without first being targeted by or witnessing enemy spellcasting.",
      },
      classResource: { type: "hexbreaker", cost: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      controlConfig: {
        controlType: "restrained",
        strength: "strong",
        duration: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 15,
          saveOutcome: "negates",
        },
        effects: [
          { id : "spirit_bind",
            name: "Spirit Bind",
            description:
              "Restrained. Speed reduced to 0. Attacks against target have advantage. Spirit save at end of each turn to break free. Silenced against evil magic users.",
            saveType: "spirit",
            saveDC: 15,
            condition: "restrained",
            duration: 3,
            durationUnit: "rounds",
            immobilize: true,
            silence: true,
            mechanicsText: "Speed 0, no verbal spells",
          },
        ],
        concentrationRequired: true,
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          control: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Restrained + silenced, speed 0",
              default: "Restrained, speed 0",
            },
          },
        },
      },
      tags: ["crowd control", "root", "silence", "control", "shadowbane"],
    },

    { id : "cov_hexbreaker_precision",
      name: "Hexbreaker Precision",
      description:
        "Enter a state of magical perception for 1 minute. Gain +3 to attack rolls and +1d6 radiant damage on weapon attacks. Against evil magic users, your critical hit range expands to 19-20.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Piercing/Focused Arrow Shot",
      typeConfig: {
        school: "necrotic",
        icon: "Piercing/Focused Arrow Shot",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["buff", "accuracy", "anti magic"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 2 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "precision_focus",
            name: "Hexbreaker Precision",
            description:
              "+3 to attack rolls, +1d6 radiant damage on weapon attacks. Expanded crit range vs evil magic users (19-20).",
            mechanicsText: "+3 Attack Rolls",
            statModifier: {
              stat: "attack",
              magnitude: 3,
              magnitudeType: "flat",
            },
          },
          { id : "precision_damage",
            name: "Radiant Strikes",
            description: "+1d6 radiant damage on all weapon attacks",
            mechanicsText: "1d6 radiant",
          },
          { id : "precision_crit",
            name: "Weakness Sight",
            description:
              "Critical hit range expanded by 1 against evil magic users",
            mechanicsText: "",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+3 attack, +1d6 radiant, crit 19-20",
              default: "+3 attack, +1d6 radiant",
            },
          },
        },
      },
      tags: ["buff", "accuracy", "anti magic", "demonhunter"],
    },

    { id : "cov_silver_storm",
      name: "Silver Storm",
      description:
        "Fill a 20ft radius with whirling silver shards. Deals 5d6 radiant (Agility save DC 15 halves). Marks survivors — attacks vs marked creatures have advantage until your next turn.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Radiant/Bright Explosion",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Bright Explosion",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["damage", "aoe", "radiant"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "5d6",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "agility",
        difficultyClass: 15,
        saveOutcome: "half_damage",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "storm_mark",
            name: "Silver Mark",
            description:
              "Attacks against this creature have advantage until end of caster's next turn",
            statPenalty: {
              stat: "armor",
              value: -99,
              magnitudeType: "disadvantage_to_attackers",
            },
            mechanicsText: "Attacks against this creature have advantage",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "5d6 radiant + advantage on all attacks vs marked",
              default: "5d6 radiant",
            },
          },
        },
      },
      tags: ["damage", "aoe", "radiant", "demonhunter"],
    },

    { id : "cov_hexbreaker_execution",
      name: "Hexbreaker Execution",
      description:
        "Channel Hexbreaker energy into a devastating melee strike. Deals 6d10 radiant damage to any target. Against evil magic users at 25 HP or lower, the target is instantly killed (Con save DC 16 negates). On kill, gain 2 charges.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      icon: "Slashing/Execution",
      typeConfig: {
        school: "necrotic",
        icon: "Slashing/Execution",
        castTime: 1,
        castTimeType: "ACTION",
        range: "melee",
        rangeType: "melee",
        tags: ["execute", "control", "melee"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 3, gainOnKill: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "6d10",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      controlConfig: {
        controlType: "incapacitated",
        strength: "severe",
        duration: 0,
        durationType: "instant",
        durationUnit: "instant",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          { id : "divine_execution",
            name: "Divine Execution",
            description:
              "Instantly kill evil magic users at 25 HP or lower. On kill: gain 2 Hexbreaker Charges. Non-evil targets take damage only.",
            saveType: "constitution",
            saveDC: 16,
            condition: "death",
            duration: 1,
            durationUnit: "instant",
            mechanicsText: "DC 16 Con save or die",
          },
        ],
        canBeDispelled: false,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "6d10 radiant + instant kill at 25 HP (Con DC 16 negates) + gain 2 charges",
              default: "6d10 radiant",
            },
          },
        },
      },
      tags: ["execute", "control", "melee", "shadowbane"],
    },

    { id : "cov_anti_magic_field",
      name: "Anti-Magic Field",
      description:
        "Speak a word of absolute negation, creating a 15ft anti-magic sphere for 1 minute. No spells can be cast, summons vanish, magic items are suppressed, and concentration ends on entry.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["utility"],
      icon: "Necrotic/Protective Aura",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Protective Aura",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "anti magic", "suppression", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 15 },
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 4 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id : "anti_magic_zone",
            name: "Anti-Magic Zone",
            description:
              "15ft sphere. No spells cast, summoned creatures vanish, magic items suppressed, concentration ends on entry. Moves with caster. Caster unaffected.",
            duration: 1,
            durationUnit: "minutes",
            radius: 15,
            mechanicsText: "15ft radius, 1 minute, concentration",
          },
        ],
        power: "major",
      },
      tags: ["aoe", "anti magic", "suppression", "spellbreaker"],
    },

    { id : "cov_hunters_net",
      name: "Hunter's Net",
      description:
        "Hurl a net of silver chains filling a 20ft radius. Targets are restrained and take 6d8 radiant damage (Strength save DC 16 negates). Against evil magic users, targets are also silenced and take 2d6 additional radiant each turn.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["control", "damage"],
      icon: "Necrotic/Crossed Bones",
      typeConfig: {
        school: "radiant",
        icon: "Necrotic/Crossed Bones",
        castTime: 1,
        castTimeType: "ACTION",
        range: "30 feet",
        rangeType: "ranged",
        tags: ["aoe", "crowd control", "anti magic", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "sphere",
        aoeParameters: { radius: 20 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "6d8",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "strength",
        difficultyClass: 16,
        saveOutcome: "negates",
      },
      controlConfig: {
        controlType: "restrained",
        strength: "strong",
        duration: 1,
        durationType: "minutes",
        durationUnit: "minutes",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          { id : "silver_net",
            name: "Silver Chains",
            description:
              "Restrained, silenced, speed reduced to 5ft. Takes 2d6 radiant damage at start of each turn. Str save at end of each turn to break free.",
            saveType: "strength",
            saveDC: 15,
            condition: "restrained",
            duration: 3,
            durationUnit: "rounds",
            silence: true,
            dotFormula: "2d6",
            dotDamageType: "radiant",
            mechanicsText: "2d6 radiant/turn",
          },
        ],
        concentrationRequired: true,
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "6d8 radiant + restrained + silenced + 2d6 radiant/turn",
              default: "6d8 radiant + restrained",
            },
          },
        },
      },
      tags: ["aoe", "crowd control", "anti magic", "demonhunter"],
    },

    // ===== LEVEL 6 SPELLS — Devastating (4-5 charges) =====

    { id : "cov_hexbreaker_fury",
      name: "Hexbreaker Fury",
      description:
        "Unleash a devastating shockwave of shadow and light in a 25-foot radius. Deals 8d6 necrotic damage (Con save DC 17 halves) and stuns targets for 1 round.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      icon: "Poison/Poison Plague",
      typeConfig: {
        school: "necrotic",
        icon: "Poison/Poison Plague",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "stun", "ultimate"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 5 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "8d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "constitution",
        difficultyClass: 17,
        saveOutcome: "half_damage",
      },
      controlConfig: {
        controlType: "stunned",
        strength: "severe",
        duration: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          { id : "anti_magic_burst",
            name: "Anti-Magic Burst",
            description:
              "Stunned for 1 round on failed save. Half damage on successful save.",
            saveType: "constitution",
            saveDC: 17,
            condition: "stunned",
            duration: 1,
            durationUnit: "rounds",
            mechanicsText: "8d6 necrotic",
          },
        ],
        canBeDispelled: true,
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "8d6 necrotic + stun + dispel enchantments",
              default: "8d6 necrotic + stun",
            },
          },
        },
      },
      tags: ["aoe", "damage", "stun", "ultimate", "spellbreaker"],
    },

    { id : "cov_shadow_eruption",
      name: "Shadow Eruption",
      description:
        "Erupt shadows upward in a 15-foot cone. Deals 8d6 necrotic damage (Agility save DC 17 halves) and blinds targets for 2 rounds, causing them to move randomly.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Consumed by Void",
      typeConfig: {
        school: "necrotic",
        icon: "Void/Consumed by Void",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "debuff", "vision", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "cone",
        aoeParameters: { radius: 15 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 4 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "8d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "agility",
        difficultyClass: 17,
        saveOutcome: "half_damage",
      },
      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "shadow_blindness",
            name: "Shadow Blindness",
            description:
              "Blinded for 2 rounds. Cannot see, automatically fails sight-based checks, disadvantage on attack rolls. Moves in a random direction at start of each turn.",
            statPenalty: {
              stat: "attack",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText:
              "Disadvantage on attack rolls for 2 rounds. Moves randomly.",
            statusType: "blinded",
            level: "moderate",
          },
        ],
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds",
        canBeDispelled: true,
        savingThrow: {
          ability: "agility",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "8d6 necrotic + blind + silence 1 round",
              default: "8d6 necrotic + blind",
            },
          },
        },
      },
      tags: ["aoe", "damage", "debuff", "vision", "shadowbane"],
    },

    { id : "cov_spell_nullification",
      name: "Spell Nullification",
      description:
        "Seal one of the target's known spells for 1 hour, making it completely inaccessible. Deals 3d8 psychic damage to evil magic users (Spirit save DC 17 negates).",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["control", "damage"],
      icon: "Radiant/Golden Ring",
      typeConfig: {
        school: "necrotic",
        icon: "Radiant/Golden Ring",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["anti magic", "seal", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "hours",
        durationValue: 1,
        durationUnit: "hours",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 4 },
        actionPoints: 2,
        components: ["verbal"],
      },
      classResource: { type: "hexbreaker", cost: 4 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "3d8",
        elementType: "psychic",
        damageTypes: ["psychic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "spirit",
        difficultyClass: 17,
        saveOutcome: "negates",
      },
      controlConfig: {
        controlType: "silenced",
        strength: "severe",
        duration: 1,
        durationType: "hours",
        durationUnit: "hours",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 17,
          saveOutcome: "negates",
        },
        effects: [
          { id : "spell_seal",
            name: "Spell Seal",
            description:
              "One known spell becomes completely inaccessible for 1 hour. The sealed spell cannot be cast, prepared, or recalled. 3d8 psychic damage to evil magic users.",
            saveType: "spirit",
            saveDC: 17,
            condition: "silenced",
            duration: 1,
            durationUnit: "hours",
            mechanicsText: "DC 17 Spirit save",
          },
        ],
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Seal spell + 3d8 psychic damage",
              default: "Seal spell only",
            },
          },
        },
      },
      tags: ["anti magic", "seal", "spellbreaker"],
    },

    // ===== LEVEL 7 SPELLS — Near-Ultimate (5-6 charges) =====

    { id : "cov_hexbreaker_storm",
      name: "Hexbreaker Storm",
      description:
        "Summon a persistent anti-magic storm in a 30-foot radius for 1 minute. Deals 3d8 radiant damage per round, imposes disadvantage on spellcasting, and prevents mana recovery.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Black Hole",
      typeConfig: {
        school: "radiant",
        icon: "Void/Black Hole",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage over time", "anti magic", "concentration"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 30 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 5 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 5 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "3d8",
        elementType: "radiant",
        damageTypes: ["radiant"],
        hasDotEffect: true,
        dotConfig: {
          enabled: true,
          damagePerTick: "3d8",
          damageType: "radiant",
          duration: 3,
          tickFrequency: "round",
        },
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      debuffConfig: {
        debuffType: "abilityDisable",
        effects: [
          { id : "anti_magic_weakening",
            name: "Anti-Magic Weakening",
            description:
              "Spellcasting at disadvantage. Cannot regain mana or class resources. 3d8 radiant damage per round.",
            statPenalty: {
              stat: "spell_attack",
              value: -99,
              magnitudeType: "disadvantage",
            },
            mechanicsText: "3d8 radiant/round",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      tags: [
        "aoe",
        "damage over time",
        "anti magic",
        "concentration",
        "spellbreaker",
      ],
    },

    { id : "cov_apex_predator",
      name: "Apex Predator",
      description:
        "Transform into a Void Hunter for 5 rounds, existing partially in the void. Immune to non-magical damage, teleport to attack visible creatures for free, and ignore Armor from physical armor and magic shields.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Void/Shadowy Potion",
      typeConfig: {
        school: "necrotic",
        icon: "Void/Shadowy Potion",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["transformation", "mobility", "damage", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "spectral",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Void Hunter",
        description:
          "Exist partially in the void, striking from impossible angles for 5 rounds.",
        grantedAbilities: [
          { id : "void_existence",
            name: "Void Existence",
            description: "Immune to all non-magical damage",
          },
          { id : "teleport_strike",
            name: "Teleport Strike",
            description:
              "Teleport to any visible creature as part of a melee attack (no action cost)",
          },
          { id : "ignore_defenses",
            name: "Ignore Defenses",
            description:
              "Attacks ignore Armor bonuses from physical armor and magical shields",
          },
        ],
      },
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+4d10 radiant vs evil, auto-detect alignment",
              default: "Melee reach 30ft, ignore armor",
            },
          },
        },
      },
      tags: ["transformation", "mobility", "damage", "shadowbane"],
    },

    { id : "cov_final_hour",
      name: "Final Hour",
      description:
        "When death nears, righteous fury takes hold for 3 rounds. Regain 50% HP, deal +3d8 radiant damage per attack, become immune to fear and charm, and cannot drop below 1 HP.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["buff", "healing"],
      icon: "Radiant/Divine Beam",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Beam",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["buff", "damage", "last stand", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          { id : "dying_fury",
            name: "Dying Fury",
            description:
              "Regain 50% of max HP. Attacks deal +3d8 radiant damage. Immune to fear and charm. Cannot be reduced below 1 HP by damage.",
            mechanicsText: "+3d8 radiant",
            statModifier: {
              stat: "damage_bonus",
              magnitude: "3d8",
              magnitudeType: "flat",
            },
          },
        ],
        statusEffects: [
          { id : "fear_immune", level: 1 },
          { id : "charm_immune", level: 1 },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      healingConfig: {
        formula: "50%",
        healingType: "percentage",
        resolution: "AUTOMATIC",
      },
      triggerConfig: {
        conditionalEffects: {
          buff: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+3d8 radiant vs evil, immune fear/charm, cannot die",
              default: "+3d8 radiant, immune fear/charm, cannot die",
            },
          },
        },
      },
      tags: ["buff", "healing", "last stand", "demonhunter"],
    },

    // ===== LEVEL 8 SPELLS — Ultimate-Tier (6 charges) =====

    { id : "cov_judgment_day",
      name: "Judgment Day",
      description:
        "Call down pillars of divine fire in a 40-foot radius. Deals 10d10 radiant damage (Charisma save DC 19 halves) against evil creatures.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage"],
      icon: "Radiant/Divine Blessing",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Divine Blessing",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage", "judgment", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "10d10",
        elementType: "radiant",
        damageTypes: ["radiant"],
        canCrit: false,
        criticalConfig: {
          critType: "effect",
          critEffects: ["holy_ignition", "fear_aura"],
        },
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "charisma",
        difficultyClass: 19,
        saveOutcome: "half_damage",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "10d10 radiant + holy ignition + fear aura",
              default: "10d10 radiant",
            },
          },
        },
      },
      tags: ["aoe", "damage", "judgment", "demonhunter"],
    },

    { id : "cov_shadow_ascendant",
      name: "Shadow Ascendant",
      description:
        "Ascend to shadow form for 4 rounds. Melee reaches 30ft, bonus 2d6 necrotic strike vs different target, swap positions with any creature within 60ft.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Void/Consumed by Void",
      typeConfig: {
        school: "necrotic",
        icon: "Void/Consumed by Void",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["transformation", "stealth", "damage", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "shadow",
        targetType: "self",
        duration: 4,
        durationUnit: "rounds",
        power: "major",
        newForm: "Shadow Ascendant",
        description: "Ascend to pure shadow form for 4 rounds.",
        grantedAbilities: [
          { id : "shadow_reach",
            name: "Shadow Reach",
            description: "Melee attack range extends to 30ft",
          },
          { id : "shadow_echo",
            name: "Shadow Echo",
            description:
              "After each attack, make a second attack dealing 2d6 necrotic damage against a different target within 15ft",
            damageFormula: "2d6",
          },
          { id : "shadow_step",
            name: "Shadow Step",
            description:
              "Swap positions with any creature within 60ft for 1 AP, becoming invisible until start of next turn",
          },
        ],
      },
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "30ft reach + 2d6 necrotic echo + teleport + invisible on swap",
              default: "30ft reach + 2d6 necrotic echo + teleport",
            },
          },
        },
      },
      tags: ["transformation", "stealth", "damage", "shadowbane"],
    },

    { id : "cov_anti_magic_storm",
      name: "Anti-Magic Storm",
      description:
        "Summon a storm of anti-magic negation in a 35-foot radius for 3 rounds. Deals 10d6 necrotic damage, spells cast inside require 2 extra mana or fail, and magic items lose their enchantments.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Black Hole",
      typeConfig: {
        school: "necrotic",
        icon: "Void/Black Hole",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage", "dispel", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "sphere",
        aoeParameters: { radius: 35 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "10d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      debuffConfig: {
        debuffType: "abilityDisable",
        effects: [
          { id : "magic_suppression_field",
            name: "Magic Suppression",
            description:
              "All spells cast in area require 2 additional mana or fail. Magic items lose all enchantment bonuses.",
            statPenalty: [
              {
                stat: "spell_slots",
                value: 2,
                magnitudeType: "additional_cost",
              },
            ],
            mechanicsText: "+2 mana cost",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "10d6 necrotic + spells cost +2 slots + items suppressed",
              default: "10d6 necrotic + spells cost +2 slots",
            },
          },
        },
      },
      tags: ["aoe", "damage", "dispel", "spellbreaker"],
    },

    // ===== LEVEL 9 SPELLS — Near-Pinnacle (6 charges) =====

    { id : "cov_hexbreaker_apocalypse",
      name: "Hexbreaker Apocalypse",
      description:
        "Unleash absolute negation in a 60-foot radius. Deals 12d10 necrotic damage (Charisma save DC 20 halves), destroys all magical effects and summons, and renders magic items inert for 1 hour.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Necrotic/Necrotic Death",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Necrotic Death",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "permanent", "spellbreaker"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 60 },
        targetRestrictions: ["enemies"],
      },
      durationConfig: {
        durationType: "instant",
        durationValue: 0,
        durationUnit: "instant",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "12d10",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        criticalConfig: {
          critType: "effect",
          critEffects: ["magic_annihilation", "silence_aura"],
        },
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "charisma",
        difficultyClass: 20,
        saveOutcome: "half_damage",
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id : "apocalypse_field",
            name: "Apocalypse Field",
            description:
              "60ft sphere. All magical effects, enchantments, and summons destroyed. Magic items rendered inert for 1 hour. Spellcasters silenced for 1d4 rounds. The area counts as difficult terrain for 10 minutes.",
            duration: 1,
            durationUnit: "hours",
            radius: 60,
            mechanicsText: "60ft radius, all magic destroyed",
          },
        ],
        power: "major",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "12d10 necrotic + destroy all magic + silence 1d4 rounds + silence aura",
              default: "12d10 necrotic + destroy all magic",
            },
          },
        },
      },
      tags: ["aoe", "damage", "permanent", "spellbreaker"],
    },

    { id : "cov_void_hunter",
      name: "Void Hunter",
      description:
        "Phase into the void between worlds for 3 rounds. Become intangible and undetectable, deal 4d10 necrotic damage per melee attack bypassing all defenses, and teleport up to 120ft as a free action.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Psychic/Psionic Boom",
      typeConfig: {
        school: "necrotic",
        icon: "Psychic/Psionic Boom",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "4d10 necrotic bypass all defenses + intangible + 120ft teleport",
              default: "4d10 necrotic bypass all defenses + intangible + 120ft teleport",
            },
          },
        },
      },
      tags: ["transformation", "stealth", "assassination", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "shadow",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Void Hunter",
        description: "Phase into the void between worlds for 3 rounds.",
        grantedAbilities: [
          { id : "void_phase",
            name: "Void Phase",
            description:
              "Intangible — immune to all damage and effects. Cannot be detected by any means.",
          },
          { id : "void_strike",
            name: "Void Strike",
            description:
              "Melee attacks from the void deal 4d10 necrotic damage and bypass all armor and resistances",
            damageFormula: "4d10",
          },
          { id : "void_teleport",
            name: "Void Teleport",
            description:
              "Teleport to any unoccupied space within 120ft as a free action",
          },
        ],
      },
      tags: ["transformation", "stealth", "assassination", "shadowbane"],
    },

    { id : "cov_divine_executioner",
      name: "Divine Executioner",
      description:
        "Become an instrument of divine justice for 5 rounds. Instantly read all creatures' alignments, deal +4d10 radiant damage against evil with weapon attacks, and gain complete immunity to evil-sourced damage and effects.",
      level: 9,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Radiant/Radiant Warrior",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Warrior",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["transformation", "damage", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 5,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "divine",
        targetType: "self",
        duration: 5,
        durationUnit: "rounds",
        power: "major",
        newForm: "Divine Executioner",
        description: "Become an instrument of divine justice for 5 rounds.",
        grantedAbilities: [
          { id : "divine_judge",
            name: "Divine Judge",
            description:
              "Instantly know the true alignment of every creature you can see",
          },
          { id : "execution_strike",
            name: "Execution Strike",
            description:
              "Weapon attacks deal +4d10 radiant damage against evil creatures",
            damageFormula: "4d10",
          },
          { id : "evil_immunity",
            name: "Evil Immunity",
            description:
              "Immune to all damage and effects from evil-aligned creatures and sources",
          },
        ],
      },
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "+4d10 radiant vs evil + immune evil damage + detect alignment",
              default: "+4d10 radiant + detect alignment",
            },
          },
        },
      },
      tags: ["transformation", "damage", "demonhunter"],
    },

    // ===== LEVEL 10 SPELLS — Ultimate (6 charges) =====

    { id : "cov_hexbreaker_armageddon",
      name: "Hexbreaker Armageddon",
      description:
        "Erase all magic in a 100ft radius permanently. Deals 18d6 necrotic damage (Cha save DC 20 negates), all spells and enchantments destroyed, and evil casters who fail lose spellcasting permanently.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Necrotic/Ritual",
      typeConfig: {
        school: "necrotic",
        icon: "Necrotic/Ritual",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "damage", "permanent", "anti magic"],
      },
      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "sphere",
        aoeParameters: { radius: 100 },
      },
      durationConfig: {
        durationType: "permanent",
        durationValue: 0,
        durationUnit: "permanent",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "18d6",
        elementType: "necrotic",
        damageTypes: ["necrotic"],
        canCrit: false,
        criticalConfig: {
          critType: "effect",
          critEffects: ["magic_annihilation", "reality_break"],
        },
        resolution: "DICE",
      },
      resolution: "SAVE",
      savingThrow: {
        ability: "charisma",
        difficultyClass: 20,
        saveOutcome: "negates",
      },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          { id : "permanent_magic_ending",
            name: "Permanent Magic Death",
            description:
              "100ft sphere. All magic permanently destroyed. Spells fail, enchantments end, magic items become inert. Magic cannot function here again. Cha save or permanently lose spellcasting.",
            radius: 100,
            mechanicsText: "100ft radius, permanent",
          },
        ],
        power: "major",
      },
      triggerConfig: {
        conditionalEffects: {
          damage: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "18d6 necrotic + permanently lose spellcasting on fail",
              default: "18d6 necrotic + magic destroyed",
            },
          },
        },
      },
      tags: ["aoe", "damage", "permanent", "anti magic", "spellbreaker"],
    },

    { id : "cov_shadow_god",
      name: "Shadow God",
      description:
        "Ascend to shadow godhood for 3 rounds. Immune to all damage except radiant, teleport freely within 120ft, and attacks against evil auto-crit. Gain 2 exhaustion levels when it ends.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Utility/Summon Minion",
      typeConfig: {
        school: "necrotic",
        icon: "Utility/Summon Minion",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "Auto-crit vs evil + immune all but radiant + 120ft teleport",
              default: "Immune all but radiant + 120ft teleport",
            },
          },
        },
      },
      tags: ["transformation", "ultimate", "shadowbane"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "shadow",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Shadow God",
        description: "Ascend to the pinnacle of shadow mastery for 3 rounds.",
        grantedAbilities: [
          { id : "shadow_immunity",
            name: "Shadow Immunity",
            description: "Immune to all damage except radiant",
          },
          { id : "instant_teleport",
            name: "Instant Teleport",
            description:
              "Teleport anywhere within 120ft as a free action (no action points)",
          },
          { id : "auto_crit_evil",
            name: "Auto-Crit Evil",
            description:
              "All attacks against evil creatures automatically critical hit",
          },
          { id : "shadow_exhaustion",
            name: "Shadow Exhaustion",
            description: "Gain 2 levels of exhaustion when transformation ends",
          },
        ],
      },
      tags: ["transformation", "ultimate", "shadowbane"],
    },

    { id : "cov_divine_incarnation",
      name: "Divine Incarnation",
      description:
        "Become an avatar of divine judgment for 3 rounds. Evil creatures within 30ft take 3d8 radiant damage per round, you're immune to evil-sourced damage, and once per round instantly kill an evil creature at 50 HP or below. Gain 2 exhaustion levels when it ends.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["transformation"],
      icon: "Radiant/Winged Angel",
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Winged Angel",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
      triggerConfig: {
        conditionalEffects: {
          transformation: {
            isConditional: true,
            defaultEnabled: false,
            conditionalFormulas: {
              evil_magic_user: "3d8 radiant/round aura + instant kill 50 HP evil + immune evil",
              default: "Immune evil damage + divine aura",
            },
          },
        },
      },
      tags: ["transformation", "ultimate", "demonhunter"],
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["hexbreakerCharges"],
        resourceValues: { hexbreakerCharges: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "hexbreaker", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      transformationConfig: {
        transformationType: "divine",
        targetType: "self",
        duration: 3,
        durationUnit: "rounds",
        power: "major",
        newForm: "Divine Incarnation",
        description: "Become an avatar of divine justice for 3 rounds.",
        grantedAbilities: [
          { id : "divine_aura",
            name: "Divine Aura",
            description:
              "Evil creatures within 30ft take 3d8 radiant damage per round and are frightened",
            damageFormula: "3d8",
          },
          { id : "evil_immunity_full",
            name: "Complete Evil Immunity",
            description:
              "Immune to all damage and effects from evil creatures and sources",
          },
          { id : "execution_blow",
            name: "Execution Blow",
            description:
              "Once per round, instantly kill any evil creature within 30ft that has 50 HP or fewer",
          },
          { id : "divine_exhaustion",
            name: "Divine Exhaustion",
            description: "Gain 2 levels of exhaustion when transformation ends",
          },
        ],
      },
      tags: ["transformation", "ultimate", "demonhunter"],
    },    {
      id : "cov_silver_dependency",
      name: "Silver Dependency",
      description:
        "Your anti-magic weapons must be coated in silver. You begin each encounter with 5 Silver Coatings. Each anti-magic or anti-spell ability costs 1 Silver Coating. At 0 coatings, anti-magic abilities have their duration halved and their save DC reduced by 2.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Slashing/Glowing Scimitar",
      effectTypes: ["passive"],
      typeConfig: {
        school: "physical",
        icon: "Slashing/Glowing Scimitar",
        tags: ["passive", "resource", "silver", "anti-magic dependency", "covenbane"],
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
      resolution: "AUTOMATIC",
      tags: ["passive", "resource", "silver", "anti-magic dependency", "covenbane"],
    },
    { id : "cov_righteous_fury",
      name: "Righteous Fury",
      description:
        "You cannot attack allies, even if they are mind-controlled, charmed, or possessed. You must find another way to break the effect. Your oath forbids harming the innocent -- even when they wear an enemy's face.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Radiant/Radiant Golden Shield",
      effectTypes: ["passive"],
      typeConfig: {
        school: "radiant",
        icon: "Radiant/Radiant Golden Shield",
        tags: ["passive", "restriction", "no friendly fire", "oath", "covenbane"],
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
      resolution: "AUTOMATIC",
      tags: ["passive", "restriction", "no friendly fire", "oath", "covenbane"],
    },

      {
        "id": "cov_inquisitors_flare",
        "name": "Inquisitor's Flare",
        "description": "Exert intense mental control over your senses. Your eyes ignite with a cold, pale ice-blue flame. You can instantly perceive the hum of active magical incantations, curses, or hidden sorcerous warded traps within your presence.",
        "level": 2,
        "spellType": "ACTION",
        "icon": "Utility/Glow",
        "typeConfig": {
          "school": "physical",
          "icon": "Utility/Glow",
          "tags": [
            "utility",
            "roleplay",
            "covenbane"
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
          "verbalText": "Magica detexi!",
          "somaticText": "Force a sharp breath, popping the joints in your neck to lock your concentration"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "perception",
          "selectedEffects": [
            {
              "id": "inquisitors_flare_effect",
              "name": "Witch-Scent Sight",
              "description": "Detect the location and magical school of any active spell, curse, or enchanted object within 30 feet."
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
          "covenbane"
        ]
      },
  ],

  // ═════════════════════════════════════════════════════════════════
  // SPELL POOLS BY LEVEL
  // ═════════════════════════════════════════════════════════════════
  spellPools: {
    1: ["cov_shadow_hunt", "cov_hex_strike", "cov_silver_blade"],
    2: ["cov_dark_pursuit", "cov_hex_weakness", "cov_silver_bolt",
      "cov_inquisitors_flare"],
    3: ["cov_curse_eater", "cov_shadow_ambush", "cov_anti_magic_barrier"],
    4: [
      "cov_spirit_shackle",
      "cov_hexbreaker_precision",
      "cov_silver_storm",
      "cov_silver_hex",
    ],
    5: ["cov_hexbreaker_execution", "cov_anti_magic_field", "cov_hunters_net"],
    6: [
      "cov_hexbreaker_fury",
      "cov_shadow_eruption",
      "cov_spell_nullification",
    ],
    7: ["cov_hexbreaker_storm", "cov_apex_predator", "cov_final_hour"],
    8: ["cov_judgment_day", "cov_shadow_ascendant", "cov_anti_magic_storm"],
    9: [
      "cov_hexbreaker_apocalypse",
      "cov_void_hunter",
      "cov_divine_executioner",
    ],
    10: [
      "cov_hexbreaker_armageddon",
      "cov_shadow_god",
      "cov_divine_incarnation",
    ],
  },
};
