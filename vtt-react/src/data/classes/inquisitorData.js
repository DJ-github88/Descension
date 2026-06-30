export const INQUISITOR_DATA = {
  restrictions: {
      "allowedSubraces": [
          "marked_vreken",
          "clean_vreken",
          "thalren_human",
          "morren_human"
      ],
      "hardBlocks": [
          "emberth",
          "fexrick",
          "myrathil",
          "skald_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires either the Ghost-Mycelium (Vreken) or a lifetime of anti-Wyrd training. Thalren face Wyrd-horrors born from human fear. Morren dismantled Neth contracts through inquisitorial practice. Other races lack the supernatural exposure density. Emberth too hot for stealth hunts. Fexrick too mechanical. Myrathil too distant from surface Wyrd. Unwoven Mimir lack the specialized anti-Wyrd training — their expertise is floor-toxins and survival, not supernatural investigation."
  },

  id : "inquisitor",
  name: "Inquisitor",
  icon: "fas fa-gavel",
  color: "#8B0000",
  role: "Occult Arbiter / Demon Handler",
  damageTypes: ["ember", "storm", "blight"],

  equipment: {
    title: "Starting Equipment",
    choices: [
      {
        name: "Witch Hammer's Rig",
        icon: "Radiant/Radiant Divinity",
        items: [
          "Rusted Iron Brand (1d8 radiant, melee touch, ignites salt on supernatural targets)",
          "Null-Salt Coating Kit (10 applications for weapon alchemical enhancement)",
          "Pouch of Coarse Rock Salt and Bone Ash",
          "Iron Stakes (4, for ward circles and binding anchors)"
        ],
        description: "Maximum anti-magic frontline assault combining the Covenbane cold iron tradition with Exorcist binding tools. The iron brand deals devastating ember damage and burns through supernatural defenses."
      },
      {
        name: "Sin-Eater's Binding Kit",
        icon: "Necrotic/Spectral Summoning",
        items: [
          "Spectral Chain Whip (1d6 radiant, reach 15 ft, applies Dominance pressure on hit)",
          "Reinforced Leather Vest (DR 1, no agility penalty)",
          "Vial of Purified Brine (3 applications for enhanced binding rituals)",
          "Chalk and Iron Dust (for rapid ritual circles in the field)"
        ],
        description: "Optimized for ranged command, rapid ritual deployment, and demon binding. The chain whip maintains Dominance from a safe distance while the binding kit reduces ritual setup time."
      }
    ],
    standardGear: [
      "Traveler's backpack with sulfur-blackened wraps",
      "Rations (7 days, salt-cured)",
      "Ritual components pouch (iron filings, bone ash, blessed charcoal)",
      "Lantern with black iron cage",
      "1d10 x 5 tarnished copper pieces"
    ],
    notes: "Inquisitors cannot wield enchanted or arcane weapons. Their iron and salt nullifies foreign enchantments on contact. All weapons must be mundane materials (iron, steel, salt crystal). Bows and crossbows are forbidden; the Inquisitor's work requires the press of iron against flesh or the projection of pure will through chains."
  },

  overview: {
    title: "The Inquisitor",
    subtitle: "Cold Iron, Burning Salt, and the Barbed Leash of the Damned",
    originStory: `Two traditions of occult warfare, born in parallel from the same wound in the world. In the deep bogs of the Bryngloom Forest, the Vreken hunter Orven the Still-Handed forged the first cold-iron blade and swore the Barbed Vow to hunt his own corrupted kinsmen. In the fog-shrouded groves of the Frostwood Reach, the healer Elias the Salt-Scarred opened his own veins to draw the Wyrd's face-stealing horrors into living flesh.

Both traditions understood the same truth: the Wyrd bleeds through every crack that magic carves in reality. One tradition learned to seal the cracks by destroying the caster. The other learned to trap what seeped through, binding it in chains of salt and will. When the Sundered Monoliths began cracking wider and the incursion rate tripled, the two orders recognized that their separate wars were the same war.

The Inquisition was forged in that recognition. Cold iron meets bound demon. Anti-magic negation meets purifying ritual. The Barbed Vow and the salt-scar are one oath now.

You are the Inquisitor. You hunt the caster, bind the entity, purge the corruption, and pay for every victory with your own blood. The iron in your bones makes you brittle. The demons in your veins make you less than human. But between your two traditions, nothing supernatural escapes.`,

    quickOverview: {
      title: "The Weight of Authority",
      content: `**A Crown of Ash and Chains**: The Inquisitor is a dual-purpose occult warrior who combines anti-magic negation with demonic binding and purification. You build Righteous Authority (0-8) through both anti-magic friction (absorbing spells, breaking wards, shattering enchantments) and binding rituals (commanding bound entities, executing the supernatural). Against mundane threats, you generate nothing, and both the silver in your marrow and the demons in your blood leave you catastrophically vulnerable to ordinary steel.

**Core Mechanic**: Absorb and negate enemy magic + Bind and command supernatural entities + Purge corruption from allies at physical cost -> Spend Authority on anti-magic effects, binding commands, and terminal executions

**Resource**: Righteous Authority (0-8, unified resource combining Hexbreaker Charges and Divine Dominance, decaying when no supernatural contact, rebellion risk at 0)

**Passive**: Arbiter's Precision -- Every 3rd strike against a supernatural target unleashes a white-hot spike of alchemical silver that bypasses all resistance

**Playstyle**: High-tension anti-magic striker and demon commander carrying alchemical fragility, self-inflicted wounds, and total social isolation

**Best For**: Players who crave systematic oppression of spellcasters, volatile pet micromanagement, and heavy, high-stakes trade-offs`,
    },

    description: `For those who stand on the bleeding edge between divine authority and absolute heresy, the Inquisitor is the ultimate arbiter of the occult. Born from the fusion of two parallel traditions, the cold-iron Covenbane and the demon-binding Exorcist, they wield both anti-magic negation and demonic binding as a single devastating doctrine. Their signature resource, Righteous Authority, is fueled by the friction of magical confrontation and the command of bound entities, allowing them to shatter spells, bind demons, and purge corruption. Yet the price of this power is absolute: silver-poisoned bones, whispered demons in the blood, self-inflicted wounds to maintain control, and total isolation from the very communities they protect.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The Inquisition was born from the convergence of two traditions: the Vreken Barbed Vow forged by <LoreLink termId="orven">Orven the Still-Handed</LoreLink> in the <LoreLink termId="bryngloom-forest">Bryngloom Forest</LoreLink>, and the salt-scarred binding rites developed by <LoreLink termId="elias">Elias the Salt-Scarred</LoreLink> in the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>. When the incursion rate tripled and both orders began failing independently, the two grandmasters met beneath the Sunken Spire and merged their oaths into a single doctrine: the Inquisition.

**CITIES & CIVIL RECEPTION**
Inquisitors are feared, respected, and deeply isolated. They are tolerated at the margins of <LoreLink termId="sunken_spire">The Sunken Spire</LoreLink> and Atropolis, welcomed in frontier settlements of the Reach, but never fully trusted. Their skin crawls with contained horrors, their voices carry undertones that are not their own, and the cold iron they carry interferes with divination and healing.

**RACES & CULTURAL AFFILIATION**
The class is primarily practiced by the <LoreLink termId="vreken">Marked Vreken</LoreLink> who carry the Ghost-Mycelium, and the Thalren humans and <LoreLink termId="mimir">Unwoven Mimir</LoreLink> of the Frostwood Reach.

**NOTABLE FIGURES**
* **Orven the Still-Handed**: Vreken founder of the Barbed Vow who tracked his own sister into the sinking bogs.
* **Elias the Salt-Scarred**: Human healer who first drew the Gref face-traders into his own blood.
* **Vaelen the Sin-Eater**: An Unwoven Mimir who trapped a face-stealing horror under <LoreLink termId="greymark_keep">Greymark Keep</LoreLink> and carried fourteen demons in his blood.
* **Aedris the Blind**: A Vreken hunter who tracked heretics through the bogs using only the thrum of the mycelium.`,
    },

    signatureQuote: {
      text: '"She was my sister before she was their priestess. I loved her before I killed her. That is the Barbed Vow. Now I carry her ghost in my blood and her chains in my hands. Love first. Execution second. Always in that order."',
      speaker: 'Orven the Still-Handed',
      context: 'Testimony before the joint Vreken-Reach council after the founding of the Inquisition'
    },

    philosophy: {
      coreTenet: 'Magic is a disease, and those who wield it irresponsibly are vectors. The supernatural cannot be destroyed, only contained. The Inquisitor does not hunt witches because they are evil; they hunt them because unchecked magic attracts worse things. Every spell broken, every demon bound, every curse purged is a crack sealed in reality.',
      relationship: 'Inquisitors draw power from cold iron, null-salt, and the absolute conviction that their work is necessary. They do not cast spells; they shatter them. They do not banish demons; they chain them. Their anti-magic aura is not a gift; it is a curse they have learned to weaponize. An Inquisitor cannot be healed by magic, cannot be enchanted, cannot be blessed. They exist in a permanent state of magical isolation, while the bound entities in their veins whisper heresy to their marrow.',
      paradox: 'The Inquisitor exists to kill the thing they love and cage the thing they fear. Orven killed his sister. Elias opened his veins to the thing that should have destroyed him. Every Inquisitor since has trained to execute their own kin and chain the darkness inside their own flesh. They protect humanity by becoming something less than human. They are the loneliest warriors in Mythrill.',
    },

    currentCrisis: `The Wyrd is bleeding faster, and both traditions are reaching their breaking point. The Bryngloom mycelial network has developed a response to Inquisitor activity, marking them with a distinctive fungal rash that glows in the dark, making stealth impossible. The rash spreads to families of Inquisitors, making them targets. Simultaneously, the Frostwood Reach incursion rate has tripled. New entities that neither tradition has names for or rituals against are manifesting in the deep ironwood groves.

There are only forty-seven active Inquisitors left. Each can contain at most a dozen entities before their body fails, and the rash is accelerating the breakdown. For the first time in centuries, recruits are refusing the oath. The existing Inquisitors are divided: some argue the crisis proves the work is more important than ever, while others believe the world is sending a clear message to stop.`,

    meaningfulTradeoffs: `To be an Inquisitor is to accept total isolation and constant agony. The anti-magic aura that allows them to hunt witches prevents them from receiving magical healing or blessing. The silver deposits in their marrow make their bones brittle and vulnerable to physical blows. The bound demons in their blood never sleep, whispering, screaming, and bargaining. Partners report waking to find the Inquisitor's skin moving independently. The Inquisitor's body is not their own; it is a tenement for the horrors they have chained, and the inmates are always trying to escape. Every spell broken costs silver sanity. Every demon commanded costs blood. Every purge costs an ally's flesh.`,
    classSpecificLocations: [
      {
        name: 'The Hall of Barbed Vows',
        locationId: 'sunken-spire',
        description: 'A deep chamber beneath the Sunken Spire where Inquisitors undergo their initiation. The walls are hung with the cold-iron blades of every Inquisitor who has taken the oath, and the floor is carved with containment circles for binding rituals.',
        purpose: 'Initiation hall, armory, ritual space, and memorial',
        status: 'Active -- but the newest blades are being hung by people whose families now glow in the dark'
      },
      {
        name: 'The Salt-Pans of Greymark',
        locationId: 'greymark-keep',
        description: 'A ritual space beneath Greymark Keep where Inquisitors prepare null-salt mixtures and forge binding chains. Containment circles carved into the stone floor hold bound entities in stasis.',
        purpose: 'Ritual preparation, entity containment, and training',
        status: 'Active -- operating at capacity'
      }
    ],

    combatRole: {
      title: "The Twin Doctrine",
      content: `The Inquisitor is an oppressive anti-magic predator and volatile demon commander that excels at:

**Arcane Desecration**: Shattering active enchantments, silencing spoken incantations, and turning mana to boiling poison in the caster's throat
**Demonic Binding**: Commanding bound fiends through barbed chains of radiant will, using their supernatural violence to shred enemies
**Relentless Purge**: Ripping curses, possessions, and crowd control from allies, though the process deals physical damage to the ally
**Radiant Rupture**: Channeling white-hot alchemical silver to disintegrate evil and demonic flesh

**The Strength of the Twin Doctrine**:
- Systematically strips casters of their safety while binding their summoned creatures against them
- Every spell cast at you fuels your Authority -- their arrogance builds your negation
- Protective dead-magic fields shield allies from ruinous spells
- Devastating ember damage that burns away magical wards
- Bound demons provide raw physical force and supernatural damage

**The Agonizing Toll (Your Fatal Flaws)**:
- **Rejection of All Magic**: Your body is a sterile void. You cannot receive beneficial magical buffs or healing without suffering 1d10 wyrd damage from the agonizing friction
- **Brittle Skeleton**: Silver deposits in your marrow make you fragile. You suffer a permanent 50% vulnerability to physical bludgeoning and physical damage
- **The Hollow**: Authority decays by -1 per round when no supernatural contact occurs. At 0 Authority, bound entities make rebellion checks
- **Mundane Famine**: Against non-supernatural enemies, you have no resource generation, no demon benefit, and no magic to devour. You are a slow, fragile mortal carrying heavy iron
- **The Screaming Blood**: The entities in your veins never sleep, extracting a steady psychic toll on your sanity`,
    },

    playstyle: {
      title: "The Dirge of Judgment",
      content: `Playing an Inquisitor is to manage a decaying resource of pure conviction, fueled by two engines:

**Feeding the Authority** (Righteous Authority 0-8):
- **Enemy casts a spell targeting you**: +1 Authority
- **Ally targeted by spell within 30ft**: +1 Authority
- **Dispelling or Countering**: +2 Authority
- **Witnessing spell failure**: +1 Authority
- **Striking a supernatural target**: +1 Authority
- **Defeating supernatural enemy**: +2 Authority
- **Commanding bound entity successfully**: +0 (costs 0 instead of draining)
- **Purging curse from ally**: +1 Authority
- **Mundane combat**: NO AUTHORITY GENERATED
- **Quiet rounds**: -1 Authority per round

**Arbiter's Precision** (Level 2 Passive):
- Every 3rd weapon strike against a supernatural target unleashes alchemical fire, bypassing all defenses

**Authority Strategy**:
- **1-2 Authority**: Small anti-magic disruptions, basic binding commands, minor purges
- **3-4 Authority**: Dead-magic fields, advanced binding commands, demon enhancement
- **5-6 Authority**: Terminal executions, mass discipline, silence effects
- **7-8 Authority**: Anti-magic storms, apex transformations, absolute negation

**Specialization Paths**:
- **Witch Hammer**: Stealth assassination with demon swarm support
- **Iron Verdict**: Anti-magic bulwark with single powerful demon
- **Hollow Saint**: Relentless pursuit with internal demon channeling

**Tactical Doctrine**:
- Position yourself in the trajectory of enemy spells to fuel your Authority
- Maintain your silver coating or watch your anti-magic efficiency fail
- Coordinate with your party: they protect you from physical steel, you devour the witches and demons
- Keep your bound demons on a short leash -- every command costs Authority, and at 0 they rebel`,
    },

    combatExampleVsEvil: {
      title: "Combat Example: The Twin Doctrine",
      content: `**The Setup**: You stand in a ruined chantry. A coven of dark witches chants around a pulsing brand while a bound wraith guards the entrance. Your Shadow Hound sits at d8 Dominance. Starting Authority: 0.

**Starting State**: HP: 85/85 | Authority: 0/8 | Shadow Hound DD: d8

**Round 1 -- Scent the Blood and Loose the Hound**

*The witch screams, fingers tracing fire in the air.*

**Your Action**: Unleash Scent of Ash (1 AP) -> Mark the lead witch's soul
**Effect**: Advantage on d20 attack rolls against her, +1d4 radiant per hit

*Authority: 0 -> 1 (spell cast near you)*

**Bonus Action**: Command Shadow Hound to attack the wraith (0 Authority cost with Authority 1+)
**Effect**: 3d6 + 4 ember damage to wraith

*Authority: 1 -> 2 (striking supernatural + hound hits supernatural)*

**Round 2 -- The Breaking**

*The witch hurls a crackling firestorm at you.*

**Your Action**: Close distance and strike (advantage from Scent of Ash). This is your 3rd attack vs supernatural target. Arbiter's Precision triggers!
**Effect**: Weapon damage + Scent of Ash radiant + 1d6 radiant (Precision, bypasses all resistance)

*Authority: 2 -> 3 (hit supernatural + spell absorbed)*

*The hound attacks again. DD degrades: d8 -> d6. The chains strain.*

**Round 3 -- Iron Verdict**

*The witch desperately gathers mana for a terminal spell. The hound snaps at the air.*

**Your Action**: Erect Anti-Magic Ward (costs 2 Authority, 1 AP)
**Effect**: 10ft dome of dead magic. Her spell implodes.

*Authority: 3 -> 1*

**Quick Action**: Scourge of Submission on hound (1 AP, 1d4 self damage)
**Effect**: Hound DD restored: d6 -> d8. The chains flare with blinding light.

*Authority: 1 -> 2 (purge action on bound entity)*

**Round 4 -- Terminal Execution**

*The witch lies bleeding, magic broken. The wraith is ash.*

**Your Action**: Unleash Inquisitor's Judgment (costs 3 Authority, 2 AP)
**Effect**: 6d10 ember damage. Silver erupts from her veins. She is ash.

*Authority: 2 -> 0 -> 2 (cost 3, then +2 for defeating supernatural enemy)*

**Victory**: The coven is ash. The hound sits at d8. Authority at 2 carries to the next encounter.`,
    },

    combatExampleMixed: {
      title: "Combat Example: The Mundane Famine",
      content: `**The Setup**: A gang of highwaymen ambushes your wagon. No spellcasters. No curses. Only mundane muscle and cold steel. Starting Authority: 2. Shadow Hound at d10.

**Key Insight**: You have no magic to feed on. Your Authority decays. Your bones are brittle. But your hound does not care about magic.

**Round 1 -- Cold Iron and Chain**

*Three bandits rush from the brush, swords raised.*

**Your Action**: Activate Null-Salts Strike (1 AP) -> Strike the closest bandit
**Effect**: +1d6 blight damage (reduced -- they carry no active magic)

*Authority: 2 -> 1 (decay, no supernatural contact)*

**Quick Action**: Command hound to attack bandit chief (0 Authority cost)
**Effect**: 3d6 + 4 ember damage. The chief staggers.

*Authority: 1 -> 0 (hound hits mundane, but hound itself is supernatural, so +1)*

**Round 2 -- The Hollow**

*The bandit chief sweeps a heavy axe toward your chest.*

**Your Action**: Ash Step (costs 1 Authority, 1 AP) -> Dash 30ft, advantage on next strike
*Cannot afford -- Authority is at 0. Demon rebellion check triggered.*

**The Crisis**: At 0 Authority, your Shadow Hound's DD drops to d6 automatically. Rebellion Save: Spirit DC 12. Rolls... 8. The hound snarls but holds. For now.

**Your Action**: Basic attack with advantage (from previous mark)
**Effect**: Weapon damage. Generate no Authority (mundane target).

**Takeaway**: Against mundane threats, rely on your bound demon's raw physical force. Your own body is glass. Protect the hound, because at 0 Authority, it becomes your enemy.`,
    },
  },

  specializations: {
    title: "Tragic Specializations",
    subtitle: "Three Paths of Barbed Dominion",

    description: `Every Inquisitor wields cold iron and bound entities, but how they weld that authority defines their path. Three specializations offer radically different relationships with the darkness they command.`,

    specs: [
      { id : "witch_hammer",
        name: "Witch Hammer",
        icon: "Necrotic/Necrotic Skull",
        color: "#2F2F4F",
        theme: "Stealth Assassination + Demon Swarm",
        description: "Witch Hammers are shadow-stalking demon generals who combine the Covenbane Shadowbane tradition of stealth assassination with the Exorcist Demonologist's talent for commanding multiple bound entities. They dissolve into darkness, mark their prey, and unleash a pack of chained horrors from the void. Their legion of demons compensates for their fragile bodies, turning the battlefield into a coordinated hunt where nothing supernatural escapes.",
        playstyle: "Stealth assassin with demon swarm support -- mark targets from shadow, loose demons to shred, execute from invisibility",
        strengths: [
          "Can bind up to 4 demons simultaneously (Demonologist legacy)",
          "Stealth attacks gain +2d6 blight damage and automatically crit at 3+ Authority",
          "Shadow ambush causes fear in supernatural targets",
          "Swarm bonus damage when multiple demons attack the same target",
        ],
        weaknesses: [
          "Individual demons are weaker",
          "Cannot bind Tier 4 (Greater) demons",
          "Managing 4 demons simultaneously is demanding",
          "Maximum Authority cost from maintaining the swarm",
        ],
        specPassive: {
          name: "Shadow Legion",
          description: "You can bind up to 4 demons simultaneously. While you have 3+ Authority and are invisible or hidden, stealth attacks automatically crit. When 3+ bound demons attack the same target, each deals +1d4 ember damage. Authority decays 50% slower while at least one demon is bound."
        }
      },
      { id : "iron_verdict",
        name: "Iron Verdict",
        icon: "Arcane/Magical Cross Emblem 2",
        color: "#4F2F2F",
        theme: "Anti-Magic Bulwark + Single Powerful Demon",
        description: "Iron Verdicts are the ultimate anti-magic fortresses, combining the Covenbane Spellbreaker's mastery of magical negation with the Exorcist Demon Lord's covenant of mutual destruction with a single devastating demon. They create dead-magic zones, counter every spell, and empower their singular bound beast into an apocalyptic force. When the demon attacks, reality cracks. When it falters, the Inquisitor bleeds to restore the chain.",
        playstyle: "Anti-magic tank with one devastating demon -- create dead zones, counter spells, empower single demon to annihilate",
        strengths: [
          "Can bind Tier 4 Greater Demons (most powerful)",
          "Bound demon has +2 to all stats, DD degrades every 2 actions",
          "Anti-magic zones deal damage to spellcasters inside",
          "Demon deals +2d8 bonus damage at d6 DD or lower",
        ],
        weaknesses: [
          "Can only bind 1 demon at a time",
          "All eggs in one basket -- no backup if demon escapes or dies",
          "Greater Demons start at d6 DD (hardest to control)",
          "Less mobile than other specs",
        ],
        specPassive: {
          name: "Covenant of Iron",
          description: "Your single bound demon's DD only degrades every 2 actions instead of every action. Your demon gains +2 to all stats. When your demon is at d6 DD or lower, it enters a Frenzied state dealing +2d8 ember damage on all attacks. Anti-magic zones you create also deal 2d6 storm damage per round to spellcasters inside."
        }
      },
      { id : "hollow_saint",
        name: "Hollow Saint",
        icon: "Piercing/Targeted Strike",
        color: "#4F4F2F",
        theme: "Relentless Pursuit + Internal Demon Channeling",
        description: "Hollow Saints are relentless executioners who combine the Covenbane Demonhunter's unstoppable pursuit with the Exorcist Possessed's internal channeling of demonic essence. They do not bind demons externally; they invite them into their own flesh, gaining supernatural physical power at the cost of constant internal warfare. They track supernatural targets by scent, cannot be stopped, and when their internal demon seizes control, it becomes an apocalyptic force directed at their enemies.",
        playstyle: "Relentless pursuer with self-buffs and internal demon -- track, chase, channel demon power, risk losing control for devastation",
        strengths: [
          "Gain +2 Strength, +2 Constitution, +10 speed from internal channeling",
          "Melee attacks deal additional 1d8 blight damage",
          "Cannot be slowed or rooted while 3+ Authority",
          "Movement speed increases by +5ft per Authority",
        ],
        weaknesses: [
          "Cannot summon external demons at all",
          "Internal DD failure = demon takes control for 1 turn",
          "Self-harm risk: 3d6 wyrd damage when Internal DD hits 0",
          "The demon's turn may damage allies if not controlled",
        ],
        specPassive: {
          name: "The Hollow Pursuit",
          description: "Gain +2 Strength, +2 Constitution, and +10 movement speed permanently. All melee attacks deal +1d8 blight damage. While you have 3+ Authority, you cannot be slowed or rooted and gain +5ft movement per Authority. Track supernatural targets by scent within 60ft. You track an Internal Dominance Die (starts at d10) that degrades when you channel abilities or take damage."
        }
      },
    ],
  },

  resourceSystem: {
    title: "Righteous Authority",
    subtitle: "The Unified Barbed Leash of Cold Iron and Sacred Terror",

    description: `The Inquisitor's power is a fusion of two ancient doctrines: the Vreken art of anti-magic negation and the Reach tradition of demonic binding. Both traditions require the same thing: proximity to the supernatural. Righteous Authority (0-8) is the unified measure of your grip on the occult, built through absorbing spells, breaking enchantments, commanding bound entities, and executing the supernatural. It decays when the battlefield falls silent, and at zero, your bound entities begin to slip their chains.`,

    cards: [
      {
        title: "Righteous Authority (0-8)",
        stats: "Built Through Supernatural Contact Only",
        details:
          "Your unified grip on the occult. Authority is generated when magic is used against you or near you, when you strike supernatural targets, when you purge corruption, and when you defeat supernatural enemies. Mundane combat yields no Authority. Authority decays -1/round without supernatural contact.",
      },
      {
        title: "Arbiter's Precision",
        stats: "Level 2 Passive",
        details:
          "Every 3rd weapon attack against a supernatural target deals 1d6 Ember damage that bypasses all resistance and immunity.",
      },
      {
        title: "Bound Entity Rebellions",
        stats: "Triggered at 0 Authority",
        details:
          "At 0 Authority, all bound entities immediately make Rebellion Saves. Failure means the entity turns hostile or flees.",
      },
    ],

    generationTable: {
      headers: ["Trigger", "Authority", "Notes"],
      rows: [
        ["Enemy casts a spell targeting you", "+1", "Their magic is your fuel"],
        ["Enemy casts a spell targeting ally within 30ft", "+1", "You sense the magic and it feeds you"],
        ["Successfully dispel or counterspell", "+2", "Unraveling magic is the richest feast"],
        ["Witness enemy spell fail, fizzle, or be resisted", "+1", "The void answers failed magic"],
        ["Strike a supernatural target", "+1", "Anti-magic begets anti-magic"],
        ["Defeat supernatural enemy", "+2", "The ultimate reward for a successful hunt"],
        ["Purge curse/CC from ally", "+1", "Cleansing the corruption"],
        ["Weapon Attack (Mundane Target)", "+0", "NO AUTHORITY -- you need the supernatural"],
        ["Defeat Mundane Enemy", "+0", "NO AUTHORITY -- a hollow victory"],
        ["No supernatural event this round", "-1", "The Hollow -- authority decays"],
        ["Command bound entity", "+0", "Commands are free above 0 Authority; risky at 0"],
      ],
    },

    usage: {
      momentum:
        "Spend 5-8 Authority to trigger Execution effects, Anti-Magic Storms, or Apex Transformations. Against supernatural casters, these include instant-kill thresholds, silence effects, and zone-wide magic suppression.",
      flourish:
        "Open with Scent of Ash to mark the primary caster. Command your demon to engage their summon while you close distance. Maintain Authority above 3 to keep your demon obedient.",
    },

    overheatRules: {
      title: "The Hollow & The Rebellion",
      content: `**The Hollow (0 Authority)**:
When your Righteous Authority reaches 0, you are powerless. Your anti-magic effects fail. Your bound entities sense the weakening chains.

**Rebellion Saves**:
Each bound entity makes a Rebellion Save (DC varies by entity type):
- **Success**: Entity remains bound but stays at 0 Authority. Shaken but contained.
- **Failure**: Entity breaks free. Roll 1d6:
  - **1-2**: Flees the battlefield.
  - **3-4**: Attacks you once, then flees.
  - **5-6**: Turns fully hostile, attacking you and allies until destroyed.

**Mundane Encounters (NO supernatural)**:
- Spells deal full damage but lose bonus anti-magic effects.
- You cannot generate Authority. It decays -1/round.
- You are a competent fighter with no access to defining abilities.
- Your bound demon still fights, but at increasing risk of rebellion.

**Supernatural Encounters**:
- Every spell cast near you feeds your Authority.
- Abilities are supercharged against supernatural targets.
- Bound demons are devastating against supernatural enemies.`,
    },

    strategicConsiderations: {
      title: "The Twin Doctrine: Targeting & Resource Management",
      content: `**Phase 1: Bait the Occult (0-2 Authority)**: Position aggressively, make yourself a target for spells. Each spell aimed at you is +1 Authority. Mark the primary caster with Scent of Ash and command your demon to engage their summon.

**Phase 2: Feast on Negation (3-4 Authority)**: Use anti-magic effects to dispel enemy buffs. Each dispel = +2 Authority. Your demon should be actively shredding supernatural threats while you build toward devastating effects.

**Phase 3: Judgment (5-8 Authority)**: Unleash terminal executions, anti-magic storms, or apex transformations. Against supernatural casters, these are fight-ending abilities.

**The Hollow Risk**: Keep Authority above 1 at all times. At 0, your demon rebels. Plan an escape route for your demon if Authority is dropping -- dismiss is better than rebellion.`,
    },

    playingInPerson: {
      title: "Playing in Person",
      subtitle: "The Authority Coins",
      content: `Use a tray of 8 tokens to track Authority. Different colors represent different sources:
- **Silver Coins**: Authority from anti-magic events
- **Iron Tokens**: Authority from combat/execution
- **Chain Links**: Authority from demon commands/purges

**The Precision Tally**: Keep a d6 next to your dice. Each attack against a supernatural target turns it: 1 -> 2 -> 3. On 3, trigger Arbiter's Precision, then reset.

**The Demon Tracker**: Place a die next to each bound demon's card showing their current DD. Physically swap the die size when you command them (d12 -> d10).
`,
    },
  },

  features: [
    { id : "inquisitor_training",
      name: "Inquisitor Training",
      description:
        "You gain proficiency with light armor, medium armor, shields, simple weapons, martial weapons, and alchemist's supplies.",
      level: 1,
    },
    { id : "righteous_authority",
      name: "Righteous Authority",
      description:
        "You build Righteous Authority (0-8) through supernatural contact: absorbing spells, breaking enchantments, striking supernatural targets, purging corruption, and defeating supernatural enemies. Mundane combat generates no Authority. Authority decays -1/round without supernatural contact. At 0 Authority, bound entities make Rebellion Saves.",
      level: 1,
    },
    { id : "inquisitor_magic",
      name: "Inquisitor Magic",
      description:
        "You know the cantrips Light and Sacred Flame. At 2nd level you learn the spell Detect Magic.",
      level: 1,
    },
    { id : "arbiters_precision",
      name: "Arbiter's Precision",
      description:
        "Every 3rd weapon attack against a supernatural target deals 1d6 ember damage that bypasses resistance and immunity. This damage cannot be reduced by any means.",
      level: 2,
    },
  ],

  talentTrees: [
    { id : "witch_hammer",
      name: "Witch Hammer - Shadow Swarm",
      description:
        "Masters of darkness and demon swarm tactics, striking from shadows while loosing packs of chained horrors.",
      icon: "Utility/Hide",
      color: "#2F2F4F",
      talents: [],
    },
    { id : "iron_verdict",
      name: "Iron Verdict - Anti-Magic Bulwark",
      description:
        "Specialists in disrupting magic and commanding a single apocalyptic demon through iron resolve.",
      icon: "Arcane/Magical Cross Emblem 2",
      color: "#4F2F2F",
      talents: [],
    },
    { id : "hollow_saint",
      name: "Hollow Saint - Relentless Channeler",
      description:
        "Fanatical pursuers who channel demonic essence internally, becoming unstoppable engines of pursuit and execution.",
      icon: "Piercing/Targeted Strike",
      color: "#4F4F2F",
      talents: [],
    },
  ],

  exampleSpells: [
    // ===== LEVEL 1 SPELLS =====
    { id : "inq_scent_of_ash",
      name: "Scent of Ash",
      description:
        "Mark a creature within 60 feet with a spectral brand of ash. Attacks against the marked target gain advantage and deal +1d4 ember damage for 10 minutes.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Piercing/Targeted Strike",
      typeConfig: {
        school: "ember",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 0 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "righteousAuthority", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Hunter's Mark",
            description:
              "Advantage on attack rolls against marked target. Sense direction and distance within 10 miles.",
            statModifier: {
              stat: "attack",
              magnitude: "advantage",
              magnitudeType: "special",
            },
          },
          { id : "mark_radiant_bonus",
            name: "Mark Weakness",
            description:
              "+1d4 ember damage on weapon attacks against the marked target",
          },
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes",
        concentrationRequired: true,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["tracking", "marking", "utility"],
    },

    { id : "inq_null_salts_strike",
      name: "Null-Salts Strike",
      description:
        "Imbue your weapon with flesh-burning null-salts. Your next melee attack deals +1d6 blight damage and generates 1 Authority on hit. Against supernatural targets, the damage increases to +1d8.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Necrotic/Necrotic Skull",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["damage", "weapon", "authority generation"],
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 0 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "righteousAuthority", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Hex-Imbued Weapon",
            description:
              "Next melee attack deals +1d6 blight damage (+1d8 vs supernatural). Generates 1 Authority on hit.",
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
              supernatural_target: "1d8 necrotic bonus damage",
              default: "1d6 necrotic bonus damage",
            },
          },
        },
      },
      tags: ["damage", "weapon", "authority generation"],
    },

    { id : "inq_purge_the_defiled",
      name: "Purge the Defiled",
      description:
        "Press raw rock salt into your ally's flesh to violently rip foreign magic from their nervous system. Removes all curses, possessions, and mental crowd control. Deals 1d8 physical damage to the ally. Gains 1 Authority if the affliction was supernatural.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Radiant/Radiant Golden Shield",
      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Golden Shield",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["purification", "dispel", "utility"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
        targetRestrictions: ["allies"],
      },
      resourceCost: {
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 0 },
        actionPoints: 1,
        mana: 6,
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: {
        formula: "1d8",
        damageTypes: ["physical"],
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "protection",
        selectedEffects: [
          {
            id : "purge_debuffs",
            name: "Violent Purge",
            description: "Instantly removes all Curses, Possessions, and mental Crowd Control (paralyzed, stunned, feared) from the target ally.",
          },
        ],
      },
      classResource: { type: "righteousAuthority", gainOnSupernatural: 1 },
      resolution: "DICE",
      tags: ["purification", "dispel", "utility"],
    },

    { id : "inq_silver_blade",
      name: "Agonizing Silver Binding",
      description:
        "Coat your blade in liquid silver for 1 minute. Each attack deals +1d4 ember damage. Against supernatural creatures, attacks also bypass magical resistance.",
      level: 1,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Radiant/Radiant Beam",
      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Beam",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["weapon", "anti magic", "resistance piercing"],
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 0 },
        actionPoints: 1,
        components: ["verbal", "material"],
      },
      classResource: { type: "righteousAuthority", gain: 1 },
      buffConfig: {
        buffType: "statModifier",
        effects: [
          {
            name: "Blessed Silver Coating",
            description:
              "Weapon attacks deal +1d4 ember damage. Against supernatural creatures, attacks bypass magical resistance and immunity.",
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
              supernatural_target: "+1d4 radiant + bypass magical resistance",
              default: "+1d4 radiant",
            },
          },
        },
      },
      tags: ["weapon", "anti magic", "resistance piercing"],
    },

    // ===== LEVEL 2 SPELLS =====
    { id : "inq_ash_step",
      name: "Ash Step",
      description:
        "Dash 30 feet on a wave of living ash, ignoring difficult terrain and opportunity attacks. Gain advantage on your next melee attack.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["utility", "buff"],
      icon: "Utility/Speed Boot",
      typeConfig: {
        school: "blight",
        icon: "Utility/Speed Boot",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["mobility", "speed", "utility"],
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        requiresConcentration: false,
      },
      resourceCost: {
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 1 },
      utilityConfig: {
        utilityType: "movement",
        utilitySubtype: "speed",
        selectedEffects: [
          {
            id : "shadow_dash",
            name: "Shadow Dash",
            description: "Dash 30 feet without provoking opportunity attacks. Ignore difficult terrain until end of turn.",
            movementBonus: 30,
            duration: 1,
            durationUnit: "rounds",
          },
        ],
        power: "moderate",
      },
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          {
            id : "pursuit_advantage",
            name: "Relentless Strike",
            description: "Advantage on next melee attack this turn",
          },
        ],
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["mobility", "speed", "utility"],
    },

    { id : "inq_sigil_of_rotting_mana",
      name: "Sigil of Rotting Mana",
      description:
        "Afflict a target with a sigil unraveling their magic for 1 minute. Spell attacks suffer -2 penalty and spell save DC drops by 1. Supernatural casters have disadvantage on concentration checks when taking damage.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      icon: "Necrotic/Necrotic Decay 1",
      typeConfig: {
        school: "blight",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 1 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id : "weakened_magic",
            name: "Weakened Magic",
            description: "Spell attack rolls reduced by 2, spell save DC reduced by 1",
            statPenalty: [
              { stat: "spell_attack", value: -2 },
              { stat: "spell_dc", value: -1 },
            ],
          },
          {
            id : "concentration_disruption",
            name: "Concentration Disruption",
            description: "Supernatural casters have disadvantage on concentration checks when taking damage",
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        savingThrow: {
          ability: "spirit",
          difficultyClass: 13,
          saveOutcome: "negates",
        },
      },
      tags: ["debuff", "curse", "anti magic"],
    },

    { id : "inq_scourge_of_submission",
      name: "Scourge of Submission",
      description:
        "Whip your bound entity with spectral radiant barbed wire, restoring its Dominance Die by 1 step. Costs 1d4 of your own HP as the chains bite into your palms.",
      level: 2,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Radiant/Radiant Divinity",
      typeConfig: {
        school: "ember",
        icon: "Radiant/Radiant Divinity",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["dominance", "restoration", "discipline"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["bound_demon_or_self"],
      },
      resourceCost: {
        actionPoints: 1,
        mana: 3,
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 3, hp: "1d4" },
        dominanceDiceGain: 1,
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "1d6",
        damageTypes: ["ember"],
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "restore_dd_1",
            name: "Dominance Restored",
            description: "Restores the target demon's Dominance Die by 1 step.",
          },
        ],
      },
      resolution: "DICE",
      tags: ["dominance", "restoration", "discipline"],
    },

    // ===== LEVEL 3 SPELLS =====
    { id : "inq_curse_eater",
      name: "Curse Eater",
      description:
        "Tear a curse, hex, or magical affliction from a creature you touch, healing them for 2d8 and gaining 1 Authority if the affliction was supernatural magic.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["purification", "healing"],
      icon: "Necrotic/Devour",
      typeConfig: {
        school: "ember",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 1 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 1, gainOnSupernatural: 1 },
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
      },
      tags: ["dispel", "anti magic", "healing"],
    },

    { id : "inq_shadow_ambush",
      name: "Shadow Ambush",
      description:
        "Dissolve into living shadow, becoming invisible for up to 1 minute. Your first melee attack from this state deals +2d6 blight damage with advantage and frightens supernatural targets.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff"],
      icon: "Utility/Hide",
      typeConfig: {
        school: "blight",
        icon: "Utility/Hide",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        range: "self",
        rangeType: "self",
        tags: ["stealth", "utility"],
      },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      durationConfig: {
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        requiresConcentration: true,
      },
      resourceCost: {
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 1 },
        actionPoints: 1,
        components: ["somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 1 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: {
        buffType: "statusEffectBuff",
        effects: [
          {
            id : "shadow_veil",
            name: "Shadow Veil",
            description:
              "Invisible to all creatures. Next melee attack deals +2d6 necrotic with advantage. Frightens supernatural targets on hit.",
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
      tags: ["stealth", "utility"],
    },

    { id : "inq_anti_magic_barrier",
      name: "Anti-Magic Ward",
      description:
        "Project a 10-foot dome of anti-magic light for 3 rounds. Enemy spellcasters inside must Con save DC 14 or their spells fail. Allies inside gain +2 to saves against magic.",
      level: 3,
      spellType: "ACTION",
      effectTypes: ["buff", "utility"],
      icon: "Arcane/Magical Cross Emblem 2",
      typeConfig: {
        school: "ember",
        icon: "Arcane/Magical Cross Emblem 2",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["protection", "anti magic"],
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 2 },
        actionPoints: 1,
        components: ["verbal"],
      },
      classResource: { type: "righteousAuthority", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id : "spell_disruption_zone",
            name: "Spell Disruption Zone",
            description:
              "Enemy spellcasters in zone must Con save DC 14 or spell fails. Allies gain +2 to saves vs magic.",
            duration: 5,
            durationUnit: "rounds",
            saveDC: 14,
            saveType: "constitution",
          },
        ],
        power: "moderate",
      },
      buffConfig: {
        buffType: "damageMitigation",
        effects: [
          {
            id : "magic_resistance_aura",
            name: "Magic Resistance Aura",
            description:
              "+2 to all saving throws against spells and magical effects while inside the ward",
          },
        ],
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds",
        concentrationRequired: false,
        stackingRule: "replace",
        maxStacks: 1,
      },
      tags: ["protection", "anti magic"],
    },

    // ===== LEVEL 4 SPELLS =====
    { id : "inq_silver_hex",
      name: "Silver Hex",
      description:
        "Brand a creature with a silver sigil that makes them vulnerable to ember damage. All ember damage from all sources is doubled. Supernatural targets also suffer disadvantage on concentration checks when taking damage.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["debuff"],
      icon: "Radiant/Radiant Beam",
      typeConfig: {
        school: "ember",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 2 },
        actionPoints: 1,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      debuffConfig: {
        debuffType: "statPenalty",
        effects: [
          {
            id : "radiant_vulnerability",
            name: "Radiant Vulnerability",
            description: "Vulnerable to ember damage from all sources -- ember damage taken is doubled",
            statPenalty: {
              stat: "radiant_vulnerability",
              value: 100,
              magnitudeType: "percentage",
            },
          },
          {
            id : "silver_concentration_break",
            name: "Silver Disruption",
            description: "Supernatural casters have disadvantage on concentration checks when taking damage",
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
      tags: ["debuff", "curse", "anti magic"],
    },

    { id : "inq_shackles_of_searing_iron",
      name: "Shackles of Searing Iron",
      description:
        "Pull an agonizing chain of rusted iron and salt out of your own veins, wrapping it around a bound demon. Restores its Dominance Die by 2 steps. The backlash cuts deep: 1d6 HP to yourself.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Radiant/Divine Halo",
      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Halo",
        castTime: 1,
        castTimeType: "IMMEDIATE",
        tags: ["dominance", "restoration", "shackles"],
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 60,
        targetRestrictions: ["bound_demon_or_self"],
      },
      resourceCost: {
        actionPoints: 1,
        mana: 5,
        resourceTypes: ["mana", "health"],
        resourceValues: { mana: 5, hp: "1d6" },
        dominanceDiceGain: 2,
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: {
        formula: "2d6",
        damageTypes: ["ember"],
        resolution: "DICE",
      },
      utilityConfig: {
        utilityType: "fate_manipulation",
        selectedEffects: [
          {
            id : "restore_dd_2",
            name: "Dominance Restored",
            description: "Restores target demon's Dominance Die by 2 steps.",
          },
        ],
      },
      resolution: "DICE",
      tags: ["dominance", "restoration", "shackles"],
    },

    { id : "inq_spirit_shackle",
      name: "Spirit Shackle",
      description:
        "Pin a target's shadow to the ground with anti-magic chains. Requires 3+ Authority. The target is restrained for 1 minute (Spirit save DC 15 at end of each turn ends the effect). Attacks against the restrained target have advantage. Supernatural targets are also silenced.",
      level: 4,
      spellType: "ACTION",
      effectTypes: ["control"],
      icon: "Necrotic/Corruption",
      typeConfig: {
        school: "blight",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        minimumAuthorityRequired: 3,
      },
      classResource: { type: "righteousAuthority", cost: 3 },
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
          {
            id : "spirit_bind",
            name: "Spirit Bind",
            description: "Restrained. Speed reduced to 0. Attacks have advantage. Silenced against supernatural targets.",
          },
        ],
        concentrationRequired: true,
        canBeDispelled: true,
      },
      tags: ["crowd control", "root", "silence", "control"],
    },

    // ===== LEVEL 5 SPELLS =====
    { id : "inq_inquisitors_judgment",
      name: "Inquisitor's Judgment",
      description:
        "Channel Authority into a devastating melee strike. Deals 6d10 ember damage to any target. Against supernatural targets at 25 HP or lower, the target is instantly killed (Con save DC 16 negates). On kill, gain 2 Authority.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      icon: "Slashing/Execution",
      typeConfig: {
        school: "blight",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 3 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 3, gainOnKill: 2 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: {
        formula: "6d10",
        elementType: "ember",
        damageTypes: ["ember"],
        canCrit: true,
        critMultiplier: 2,
        critDiceOnly: false,
        resolution: "DICE",
      },
      resolution: "DICE",
      controlConfig: {
        controlType: "incapacitated",
        strength: "severe",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 16,
          saveOutcome: "negates",
        },
        effects: [
          {
            id : "divine_execution",
            name: "Divine Execution",
            description: "Instantly kill supernatural targets at 25 HP or lower. On kill: gain 2 Authority.",
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
              supernatural_target: "6d10 radiant + instant kill at 25 HP (Con DC 16 negates) + gain 2 Authority",
              default: "6d10 radiant",
            },
          },
        },
      },
      tags: ["execute", "control", "melee"],
    },

    { id : "inq_anti_magic_field",
      name: "Anti-Magic Field",
      description:
        "Create a 15ft anti-magic sphere for 1 minute. No spells can be cast, summons vanish, magic items are suppressed, and concentration ends on entry.",
      level: 5,
      spellType: "ACTION",
      effectTypes: ["utility"],
      icon: "Necrotic/Protective Aura",
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Protective Aura",
        castTime: 1,
        castTimeType: "ACTION",
        range: "self",
        rangeType: "self",
        tags: ["aoe", "anti magic", "suppression"],
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 4 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 4 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      utilityConfig: {
        utilityType: "environment",
        selectedEffects: [
          {
            id : "anti_magic_zone",
            name: "Anti-Magic Zone",
            description:
              "15ft sphere. No spells cast, summoned creatures vanish, magic items suppressed. Moves with caster. Caster unaffected.",
            duration: 1,
            durationUnit: "minutes",
            radius: 15,
          },
        ],
        power: "major",
      },
      tags: ["aoe", "anti magic", "suppression"],
    },

    // ===== LEVEL 6 SPELLS =====
    { id : "inq_inquisitors_storm",
      name: "Inquisitor's Storm",
      description:
        "Unleash a devastating shockwave of shadow and light in a 25-foot radius. Deals 8d6 blight damage (Con save DC 17 halves) and stuns targets for 1 round. Supernatural targets also have all enchantments dispelled.",
      level: 6,
      spellType: "ACTION",
      effectTypes: ["damage", "control"],
      icon: "Poison/Poison Plague",
      typeConfig: {
        school: "blight",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 5 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 5 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "8d6",
        elementType: "blight",
        damageTypes: ["blight"],
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
          {
            id : "anti_magic_burst",
            name: "Anti-Magic Burst",
            description: "Stunned for 1 round on failed save. Supernatural targets also have all enchantments dispelled.",
          },
        ],
        canBeDispelled: true,
      },
      tags: ["aoe", "damage", "stun", "ultimate"],
    },

    // ===== LEVEL 7 SPELLS =====
    { id : "inq_righteous_storm",
      name: "Righteous Storm",
      description:
        "Summon a persistent anti-magic storm in a 30-foot radius for 1 minute. Deals 3d8 ember damage per round, imposes disadvantage on spellcasting, and prevents mana recovery. Bound demons inside gain +1d6 ember damage on attacks.",
      level: 7,
      spellType: "ACTION",
      effectTypes: ["damage", "debuff"],
      icon: "Void/Black Hole",
      typeConfig: {
        school: "ember",
        icon: "Void/Black Hole",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage over time", "anti magic"],
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 5 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 5 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "3d8",
        elementType: "ember",
        damageTypes: ["ember"],
        hasDotEffect: true,
        dotConfig: {
          enabled: true,
          damagePerTick: "3d8",
          damageType: "ember",
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
          {
            id : "anti_magic_weakening",
            name: "Anti-Magic Weakening",
            description: "Spellcasting at disadvantage. Cannot regain mana. 3d8 ember damage per round.",
            statPenalty: {
              stat: "spell_attack",
              value: -99,
              magnitudeType: "disadvantage",
            },
          },
        ],
        durationType: "minutes",
        durationValue: 1,
        durationUnit: "minutes",
        concentrationRequired: true,
        canBeDispelled: true,
        dispelDifficulty: "very_hard",
      },
      tags: ["aoe", "damage over time", "anti magic"],
    },

    // ===== LEVEL 8 SPELLS =====
    { id : "inq_judgment_day",
      name: "Judgment Day",
      description:
        "Call down pillars of divine fire in a 40-foot radius. Deals 10d10 ember damage (Charisma save DC 19 halves) against supernatural creatures.",
      level: 8,
      spellType: "ACTION",
      effectTypes: ["damage"],
      icon: "Radiant/Divine Blessing",
      typeConfig: {
        school: "ember",
        icon: "Radiant/Divine Blessing",
        castTime: 1,
        castTimeType: "ACTION",
        range: "60 feet",
        rangeType: "ranged",
        tags: ["aoe", "damage", "judgment"],
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 6 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 6 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "10d10",
        elementType: "ember",
        damageTypes: ["ember"],
        canCrit: false,
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
              supernatural_target: "10d10 radiant + holy ignition + fear aura",
              default: "10d10 radiant",
            },
          },
        },
      },
      tags: ["aoe", "damage", "judgment"],
    },

    // ===== LEVEL 10 SPELLS =====
    { id : "inq_hexbreaker_armageddon",
      name: "Armageddon Edict",
      description:
        "Erase all magic in a 100ft radius permanently. Deals 18d6 blight damage (Cha save DC 20 negates), all spells and enchantments destroyed, and supernatural casters who fail lose spellcasting permanently. All bound entities are simultaneously set to maximum Dominance Die for 3 rounds.",
      level: 10,
      spellType: "ACTION",
      effectTypes: ["damage", "utility"],
      icon: "Necrotic/Ritual",
      typeConfig: {
        school: "blight",
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
        resourceTypes: ["righteousAuthority"],
        resourceValues: { righteousAuthority: 8 },
        actionPoints: 2,
        components: ["verbal", "somatic"],
      },
      classResource: { type: "righteousAuthority", cost: 8 },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      damageConfig: {
        formula: "18d6",
        elementType: "blight",
        damageTypes: ["blight"],
        canCrit: false,
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
          {
            id : "permanent_magic_ending",
            name: "Permanent Magic Death",
            description:
              "100ft sphere. All magic permanently destroyed. Spells fail, enchantments end. All bound entities set to max DD for 3 rounds.",
            radius: 100,
          },
        ],
        power: "major",
      },
      tags: ["aoe", "damage", "permanent", "anti magic"],
    },
  ],
};
