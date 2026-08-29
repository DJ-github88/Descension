import { UTILITY_SPELLS } from '../spells/utilitySpells';
/**
 * Toxicologist Class Data
 *
 * Complete class information for the Toxicologist - a master of poisons, concoctions,
 * and minor contraptions who controls the battlefield through alchemy and tactical deployment.
 */

export const TOXICOLOGIST_DATA = {
  restrictions: {
      "allowedSubraces": [
           "thalren_human",
           "tethered_mimir",
           "viridian_florae",
           "shorn_florae",
           "drun_neth"
       ],
      "hardBlocks": [
          "solari",
          "fexrick"
      ],
      "narrativeUnlock": false,
      "justification": "Requires deep knowledge of fungal/pharmacological reagents unique to the Frostwood. Tethered Mimir brew floor-toxins. Vreken know the bog's chemistry. Other regions lack the specific reagents."
  },

  /**
   * Subrace Variants, the Toxicologist crafts poison, and the source of the reagents
   * defines the craft. The Thalren distill the fog-predators. The Tethered Mimir brew
   * the canopy floor. The Vreken know the bog. The Florae carry the deep grove's
   * thorn-venom, and the Shorn brew it in secret, among neighbors who would
   * kill them for it.
   */

  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // TODO: review weapon/armor lists for class accuracy per lore compendium.
  equipment: {
   weapons: ['dagger', 'blowgun', 'short_sword'],
   armor: ['light_armor', 'robes'],
   offHand: ['vial', 'empty']
  },

  subraceVariants: {
    thalren_human: {
      subraceName: 'Thalren',
      title: 'The Fog-Distiller',
      reframe: `This is Varis's original tradition. The <LoreLink termId="skald">Thalren</LoreLink> extract raw venom from the fog-predators of the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>, the Gref, the Gambrel, the things that hunt the mist, and distill it into area-denial poisons suited to the dense undergrowth. Years in the ironwood canopies left Varis with chronic tremors and stained fingers; every Thalren Toxicologist inherits both the craft and the cost.`,
      signatureAbility: {
        name: 'Fog-Venom',
        description: `Toxins are distilled from fog-predator biology and optimized for *area-denial*, slow-acting, persistent, deployed as a perimeter rather than a strike. The Thalren are the tradition's strategists: a poison laid today that blooms in a week.`
      },
      currentCrisisAngle: `The fog is changing the Frostwood's chemistry (the foundational crisis), and the fog-predator venoms the Thalren rely on are degrading in weeks rather than years. The Thalren Toxicologists are watching their entire pharmacopoeia spoil, and some have begun, in desperation, to distill *the changing fog itself*, a reagent no one has ever weaponized, because no one knows what it does yet.`,
      signatureQuote: {
        text: '"I have distilled the same venom for forty years. This year it spoils before it cures. The fog is rewriting my craft, and I am old enough to resent the revision."',
        speaker: 'Varis the Trembling',
        context: 'The founder, pouring a degraded batch into the peat'
      }
    },

    tethered_mimir: {
      subraceName: 'Tethered Mimir',
      title: 'The Floor-Brewer',
      reframe: `The <LoreLink termId="mimir">Tethered Mimir</LoreLink> renegades brew toxins from the canopy's undergrowth, the fungal mats and acidic secretions of the forest floor they inhabit. Where the Thalren distill predators, the Tethered distill *decay*, the slow chemistry of decomposition, weaponized by the people who live closest to it.`,
      signatureAbility: {
        name: 'Floor-Decay',
        description: `Toxins are cultivated from decomposing undergrowth and optimized for *persistence*, once deployed, they linger in the environment for weeks. The Tethered's floor-toxins are the tradition's longest-lasting agents.`
      },
      currentCrisisAngle: `The changing fog is altering the undergrowth's decomposition chemistry, and the floor-toxins are mutating.`,
      signatureQuote: {
        text: '"I brew what the floor gives me. The floor is giving me something new. It does not stay where I pour it. I am afraid I have poisoned the only home I had."',
        speaker: 'Tethered Mir-Naeth',
        context: 'A Tethered Toxicologist, abandoning her floor-dwelling to a spreading bloom of her own toxin'
      }
    },

    viridian_florae: {
      subraceName: 'Viridian Florae (The Thorn-Venom)',
      title: 'The Thorn-Venom',
      reframe: `The <LoreLink termId="florae">Viridian Florae</LoreLink>, thorn-barbed traditionalists of the deep groves, carry the most *personal* toxicology in the tradition: the thorn-blood itself. The fae-contract that scrawls shifting raven-markings across the deep ironwood also infuses the Florae's thorns, and a Viridian Toxicologist distills *their own blood*, the fae-venom that grows from their forearms.`,
      signatureAbility: {
        name: 'Thorn-Blood',
        description: `Toxins are distilled from the Toxicologist's own fae-touched thorn-blood, a deeply personal reagent that makes every Viridian Toxicologist's poisons *unique* to their bloodline. The poisons are potent and uncounterable by anyone who has not studied the specific Florae's blood, but each distillation costs the Toxicologist real HP.`
      },
      currentCrisisAngle: `The changing fog has reached the deep groves, and the fae-touched thorn-blood is responding, the thorns growing *faster*, the venom more virulent, the Viridian Toxicologists *bleeding spontaneously*. Several elders read this as the fae-contract *collecting*, the same interest-compounding the Lunarchs describe, and fear the Viridian are being bled dry by their own patrons.`,
      signatureQuote: {
        text: '"I distill my own arm to poison my enemies. The arm grows back. The venom grows stronger. Lately the arm bleeds whether I ask it to or not. The fae are collecting, and I am the harvest."',
        speaker: 'Thorn-Venom Bri-Vess',
        context: 'A Viridian Toxicologist, bandaging a spontaneous thorn-bleed'
      }
    },

    florae_unified: {
      subraceName: 'Oken Florae (The Timber-Venom)',
      title: 'The Hidden-Cuil',
      reframe: `The <LoreLink termId="florae">Oken Florae</LoreLink> pass as woodcraft travelers among the Thalren edge-settlements, and a Toxicologist among them brews in *absolute secret*, distilling thorn-venom in basements, hiding the reagents from neighbors who would report them. The Oken are the tradition's *spies*: their craft is optimized for concealment, for toxins that kill without trace, for a poisoner who cannot afford to be caught.`,
      signatureAbility: {
        name: 'Veiled-Cuil',
        description: `Toxins are engineered for *untraceability*, delayed onset, undetectable residue, symptoms that mimic natural illness. The Oken are the tradition's assassins, and their poisons are designed to leave no evidence that a Toxicologist was ever present. The cost: the weakest direct-combat toxins in the tradition.`
      },
      currentCrisisAngle: `The spontaneous thorn-bleeding affects the Oken too, and it is exposing them, an Oken Toxicologist who bleeds thorn-blood in a Thalren market is no longer passing as human.`,
      signatureQuote: {
        text: '"I brewed in secret for twenty years and the Thalren never knew. Now my timber-arm bleeds in their market and they are looking at me the way I always feared. My craft has unmasked me."',
        speaker: 'Vael the Timber-Carver',
        context: 'An Oken Toxicologist, the morning after bleeding at a checkpoint'
      }
    },

    drun_neth: {
      subraceName: 'Grave Neth',
      title: 'The Silence-Distiller',
      reframe: `The <LoreLink termId="neth">Grave Neth</LoreLink>, the leaden-grey outcasts who severed their names from the First Contract, are the Toxicologist tradition's most paradoxical practitioners. The Drun were exposed to the craft through Vreken bog-chemists who sought refuge in the Deep-Quarter after the Keeper's Sanction came down on ichor-thieves. A Vreken Toxicologist named Mor-Velk the Wet taught the first Drun the principles of bog-reading as payment for sanctuary, and the Drun adapted the craft to their own condition: where the Vreken read the bog, the Drun read decay itself. Their own severed flesh, no longer preserved by Morvane's contract, hosts decomposition chemistry that no other subrace can safely study. A Drun Toxicologist distills from their own slow dissolution, and their poisons carry the Silence  -  a null-chemistry that leaves no trace in the Ledger, no signature Morvane can audit. The Neth consider Drun Toxicologists a legal impossibility: they practice a taxable craft without existing as taxable entities.`,
      signatureAbility: {
        name: 'Null-Distillate',
        description: `Toxins are distilled from the Toxicologist's own decaying flesh, carrying the Silence that voids Morvane's contractual detection. Drun poisons are legally untraceable  -  the Ledger simply cannot register them as existing  -  and they bypass magical wards that key off First Contract signatures. The cost: each distillation accelerates the Drun's dissolution, spending their remaining half-life as reagent.`
      },
      currentCrisisAngle: `The changing fog does not reach the Deep-Quarter directly, but the fog-predators the Thalren distill are migrating deeper into the Frostwood to escape it, and their shifting biology is producing venoms the Drun cannot predict. Worse: the Silence that shields Drun chemistry from the Ledger is *deepening*  -  null-distillates are becoming too aggressive, eating through containment vessels, dissolving the very glass that holds them. Several Drun Toxicologists in the Deep-Quarter have lost their workshops to runaway null-spills that consumed everything including the floorboards. The Drun suspect the fog's changing chemistry and the deepening Silence are the same phenomenon  -  the world's contracts unraveling from both the natural and the supernatural ends  -  and they fear their craft is accelerating the dissolution faster than the fog ever could.`,
      signatureQuote: {
        text: '"I distill from flesh that is legally not flesh. The poison I pour does not exist on Morvane\'s ledger. My craft is a crime with no criminal, a transaction with no payer. I am the loophole the First Contract forgot to close."',
        speaker: 'Drun Vel-Hassik',
        context: 'A Drun Toxicologist, explaining her null-distillate to a horrified Neth auditor who cannot file the evidence'
      }
    }
  },

  id: "toxicologist",
  name: "Toxicologist",
  icon: "fas fa-flask",
  role: "Damage/Support",
  damageTypes: ["blight"],

  // Overview Section
  livingOrder: {
    orderName: 'The Distillery',
    founder: {
      name: '<LoreLink termId="varis">Varis</LoreLink>',
      status: `Alive, old, trembling, and still working. The <LoreLink termId="frostwood-reach">Thalren</LoreLink> alchemist who extracted raw venom from fog-predators to defend against face-stealing horrors. Years in the ironwood canopies left him with chronic tremors, burned-away taste, and permanently stained fingers. The venoms that destroyed his nerves and stole his taste also froze his aging  -  a side effect he discovered too late to benefit from and too early to die from. He has been old for four hundred years. He cannot sign his own name legibly. He can still pour a lethal dose without spilling.`,
      note: `<LoreLink termId="varis">Varis</LoreLink> built the Distillery on patience: a poison laid today that blooms in a week. The changing fog is rewriting his pharmacopoeia in real time, and the most premeditative tradition in Mythril is being forced to improvise, the one thing it was never built to do.`
    },
    currentLeader: {
      name: '<LoreLink termId="varis">Venom-Master Varis the Trembling</LoreLink>',
      title: 'Keeper of the Slow Cup',
      characterization: `<LoreLink termId="varis">Varis</LoreLink> still leads, though his tremors make the work dangerous and his junior distillers flank every pour. He is stubborn, brilliant, and furious at the fog in a way only a four-century practitioner can be, the resentment of a master watching his medium rewrite itself without his consent. He considers the changing fog a personal insult.`
    },
    headquarters: { name: 'The Distillery  -  Canopy-Laboratory, the Shallows (Frostwood Reach)', locationId: 'frostwood-reach' },
    foundingEvent: {
      eventName: 'The Third Harvest of the Gref-Veil',
      location: 'The Shallows, Frostwood Reach  -  Thornwood patrol route',
      year: 'Mid-Diming, c. 400 years before present',
      summary: `In the mid-Freeze decades, the fog-predators known as the Gref grew bolder. Unlike the Gambrel (which hunted the mist alone), the Gref had learned to coordinate  -  a hunting-pack behavior no Thalren naturalist had ever documented. During what the survivors called the Third Harvest, a Gref-pack cornered a Thalren scout patrol of six at Thornwood, a shallow-ironwood grove three leagues east of the Shallows, and *peeled* four of them before the remaining two escaped. The Gref did not kill them. They stole their faces, their voices, their memories, and for three weeks the four dead scouts *walked back into the settlements* wearing their killers' stolen identities. The Shallows executed seventeen people  -  some of them the Gref-wearing husks, some of them innocent neighbors indistinguishable from the predators  -  before the infestation was purged. Watching his patrolmates return as hollow mimics broke something in Varis. He declared that he would find a weapon the Gref could not steal, could not wear, could not turn back upon his people. He spent the next decade isolating the venom-glands of captured Gref specimens in a canopy-laboratory suspended above the Thornwood grove where his patrol died, and the Toxicologist tradition was born not from curiosity but from vengeance.` },
    culturalSpread: {
      title: 'The Spread of the Slow Cup',
      description: `The Toxicologist craft did not remain confined to the Thalren. Over four centuries, the tradition spread across Mythril through a chain of desperate transmissions  -  refugees, exiles, spies, and debtors each carrying the craft to a new people who needed it for their own reasons.`,
      vectors: [
        {
          from: 'Thalren',
          to: 'Tethered Mimir',
          vector: `The Tethered Mimir share the Frostwood with the Thalren, dwelling on the forest floor beneath the same canopies. When the Thalren began deploying fog-venom perimeters against the Gref, the Tethered observed the results from below  -  predators that survived the canopy traps fell dying into the floor-dwellings. The first Tethered Toxicologists did not learn from Varis directly; they learned by *reverse-engineering the corpses* that rained down on their settlements. A Tethered elder named Mir-Haeth collected dying Gref, studied the venoms still active in their wounds, and cultivated the first floor-toxin from the fungal mats that flourished where the poisoned corpses decomposed. The Tethered call this transmission "the Falling Lesson." They never asked the Thalren for permission, and the Thalren never offered it.`
        },
        {
          from: 'Thalren',
          to: 'Vreken',
          vector: `The Bryngloom is far from the Frostwood, but the Neth contract-economy draws resources from every corner of Mythril. Thalren distillers who fell into debt to the Neth (which most eventually did, given the cost of fog-predator-hunting equipment) were indentured to work the Bryngloom peat-fields alongside Vreken families serving their own generational debt. A Thalren debt-worker named Hael the Split-Hand, sentenced to twenty years of peat-cutting, began teaching the Vreken the principles of venom-distillation during the long nights in the bog-worker dormitories  -  not out of generosity, but because the Vreken knew the bog's alchemical moss better than any Thalren ever could, and Hael saw a way to pay off his contract faster by producing saleable distillates. The Vreken adapted Thalren techniques to bog-chemistry within a generation, producing toxins the Thalren had never imagined. Hael died in the bog before his debt was cleared. The Vreken remember his name.`
        },
        {
          from: 'Thalren',
          to: 'Trueborn Florae',
          vector: `The Trueborn Florae learned toxicology through a transaction that both sides now regret. A Trueborn elder named Bri-Aethren, observing the Thalren's chemical defenses against the Gref, offered a Thornwood Accord: in exchange for Thalren distillation techniques, the Trueborn would teach the Thalren how to read the fae-signs that predict fog-predator movements. The Thalren accepted. What they did not anticipate was that the Trueborn would adapt human alchemy to their own biology  -  distilling from thorn-blood rather than predator venom, creating a fae-alchemical hybrid that neither the Thalren nor the fae-contracts had anticipated. The Trueborn now possess the tradition's most personal and most dangerous poisons, and the Thalren distillers who made the original trade consider it the worst bargain of their lives. Bri-Aethren has since disappeared into the deep groves and no longer answers to anyone.`
        },
        {
          from: 'Vreken',
          to: 'Drun Neth',
          vector: `The Drun Neth learned the craft from Vreken bog-chemists fleeing the Keeper's Sanction. When Mor-Velk the Wet began intercepting ichor shipments meant for Neth contract-rituals, she knew the Ledger would eventually trace the theft. She sought refuge in the Deep-Quarter, where the Drun  -  legally non-existent, untraceable by contract-enforcement  -  offered her sanctuary. In exchange for protection, Mor-Velk taught the Drun everything she knew about bog-reading and alchemical distillation. The Drun adapted the craft to their own condition: their half-decayed flesh, no longer preserved by Morvane's contract, hosts decomposition chemistry that no living Toxicologist can replicate. The resulting null-distillates are the only poisons in Mythril that cannot be registered on the First Contract, making the Drun Toxicologists the most dangerous chemists Morvane has never heard of.`
        }
      ]
    },
    ranks: {
      title: 'The Hierarchy of the Slow Cup',
      ranks: [
        { rank: 'Keeper of the Slow Cup', count: 1, holder: 'Varis the Trembling', description: 'The founder and master of the Distillery. The rank is named for Varis\'s belief that the best poison is the one you pour today and let bloom tomorrow. No successor has been named; Varis refuses to discuss succession.' },
        { rank: 'Venom-Pourer', count: 12, holders: 'Senior distillers including Lyra the Poison-Weaver (Tethered), Mor-Velk the Wet (Vreken, in absentia), Bri-Vess the Thorn-Venom (Trueborn, in absentia)', description: 'Master distillers who have produced at least one original toxin formulation ratified by the Keeper. Each Venom-Pourer oversees a satellite distillery in their home region and is authorized to teach the craft. Three of the twelve are currently in absentia  -  fugitives from their respective regional authorities who maintain contact through encrypted formula-letters.' },
        { rank: 'Glass-Hand', count: '~40', description: 'Journeyman distillers who have completed their apprenticeship and maintain their own small laboratories. Glass-Hands are permitted to sell low-grade poisons to scouts, hunters, and fog-predator-control. They handle the Distillery\'s day-to-day operations and are the rank most likely to interact with outsiders.' },
        { rank: 'Shaker', count: '~80', description: 'Apprentices, named for the tremors they have not yet learned to control. Shakers spend their first five years doing nothing but cleaning glassware, recording formula variations, and learning to pour without spilling. Most Shakers wash out within two years  -  the chronic toxin exposure is too much. Those who stay develop the stains, the tremors, and the burned-out tastebuds that mark a true Toxicologist.' },
        { rank: 'Tongue-Burned (Unofficial)', count: 'Unknown', description: 'A grim colloquialism for Toxicologists whose sense of taste has been completely destroyed by toxin exposure  -  a common milestone that the Distillery treats as an informal rank. Tongue-Burned distillers can no longer taste-test their own work and must rely entirely on chemical indicators and junior tasters. Varis has been Tongue-Burned for over four centuries.' }
      ],
      note: 'The Distillery is not a formal guild with charters, dues, or legal recognition. It is an oral tradition organized around a particular set of techniques, maintained by a man who cannot write legibly and enforced by the mutual reliance of poisoners who have no one else to trust.'
    },
    rival: {
      name: 'Nerath the Soft-Voiced',
      title: 'Former Venom-Pourer, now Keeper of the Clean Hand',
      status: 'Exiled from the Distillery, operating independently from an unmarked laboratory in the Ironwood Deeps',
      conflict: `Nerath was Varis's most brilliant Venom-Pourer  -  the only Toxicologist in the tradition's history to produce six original toxin formulations before the age of forty. When the fog began changing and the pharmacopoeia began to spoil, Nerath argued that Varis should abandon the old formula entirely: stop distilling fog-predator venom, stop trying to preserve the old pharmacopoeia, and start fresh with synthetic chemistry independent of the Frostwood's native rot. "The fog is rewriting the rules," Nerath told the assembled Venom-Pourers at the Conclave of Spoiling, held in the Canopy-Laboratory three years ago. "We should be writing new ones, not preserving the old ones in brine." Varis accused him of cowardice. Nerath accused Varis of senility  -  of being too old and too stubborn to see that his life's work was already dead, that the fog-predator venoms were not salvageable, that every vial Varis poured from the old pharmacopoeia was a waste of time that could go into finding alternatives. The argument ended with Nerath breaking a vial of his own formulation  -  a synthetic neurotoxin he had developed without predator-venom  -  against the laboratory floor and walking out. Half the Glass-Hands agreed with Nerath privately. None followed him publicly. Nerath now operates alone in the Ironwood Deeps, developing synthetic toxins from mineral chemistry rather than biological extraction. His poisons work  -  they are stable, reproducible, and unaffected by the changing fog  -  but they lack the potency of predator-derived venoms, and they have a signature that anyone with chemical training can identify. Varis calls Nerath's work "factory poison  -  a blunt instrument for a blunt mind." Nerath calls Varis's work "a museum devoted to a dead world." Neither has spoken to the other in three years. The junior distillers whisper that if the fog doesn't kill the Distillery, the schism between Varis and Nerath will.`,
      significance: `Nerath's break from the Distillery represents the tradition's deepest philosophical fracture: whether to adapt or preserve. If Varis dies before the fog crisis is resolved, Nerath is the only person with the knowledge, the formulations, and the institutional memory to run the Distillery  -  and he has already made it clear that he would dismantle the old pharmacopoeia entirely. The Venom-Pourers are terrified that the Distillery will die with its founder, split between a dead man's stubbornness and a traitor's ambition.`
    },
    crisisConnection: `<LoreLink termId="varis">Varis</LoreLink> is presiding over the spoilage of his life's work: fog-predator venoms degrading in weeks rather than years, the entire Distillery pharmacopoeia turning unstable. His desperation project, distilling the *changing fog itself*, has produced reagents no one can characterize, and two of his apprentices  -  a young Thalren Shaker named Kellan Soft-Hand and a veteran Glass-Hand named Torven the Steady, killed three months apart testing uncharacterized fog-distillates on themselves  -  have died for his obsession. Varis refuses to stop. He has spent four centuries mastering the Frostwood's chemistry, and he will master the new chemistry or die in the attempt. The Distillery's junior members are no longer certain which outcome they are rooting for.`
  },

  worldFriction: [
    { region: 'sundale', status: 'outlawed', consequence: 'The Dawn Vigil enforces total prohibition on alchemical toxins, declaring them tools of cowards and heretics who refuse the cleansing furnace. Possession of a toxin-vial is punished by branding and forced labor in the Emberspire caldera.', workaround: 'Toxicologists operate as "soot-purifiers" or "forge-apothecaries," selling alchemical catalysts under the pretext of cleaning sulfur-buildups in the smelting ovens.' },
    { region: 'frostwood-reach', status: 'tolerated', consequence: 'The Frostwood is the one region where Toxicologists operate in the open, the Wyrd-predators make chemical defense a civic necessity, and Greymark Keep quietly employs them as fog-predator-control. The Distillery is an open secret.' },
    { region: 'bryngloom-forest', status: 'persecuted', consequence: 'The Neth Board of Trade outlaws unregistered alchemical distillates to protect the Moss-Wax monopoly. Any Toxicologist caught distributing un-taxed acids or poisons faces arrest and the conscription of their laboratory reagents.', workaround: 'Distill reagents in the peat-crypts beneath Over-Shanty, selling alchemical solvent to peat-cutters seeking to dissolve ironwood roots for fuel.' }
  ],

  overview: {
    originStory: `A toxicologist is a self-poisoned surgeon whose veins run thick with weaponized toxin. They set traps before initiative, craft poisons mid-combat from their own saturated flesh, and stack layered debuffs that no one else can apply. The body rejects restoration. Every poison costs blood. Every antidote is for someone else.

The first was Varis the Trembling, a Thalren alchemist who systematized venom extraction from Frostwood fog-predators before the Star-Fall. His scout patrols had been cornered by face-stealing horrors, and he was the only survivor. He spent the next decade above the massacre site at Thornwood Grove, three leagues east of the Shallows, developing fog-venom, a toxin derived from the same predators that had killed his team. Years in the ironwood canopies distilling toxic moss and acidic secretions left him with chronic tremors, burned-away taste, and permanently stained fingers. The same preservative toxins that ruined his body also froze his aging. He has been old for four hundred years. He considers the changing fog a personal insult.

Each subrace distills from different sources. The Thalren draw venom from fog-predators, optimized for slow-acting area-denial, a poison laid today that blooms in a week. The Tethered Mimir brew from undergrowth decay, the slow chemistry of decomposition producing the longest-lasting agents in the tradition. The Vreken draw from the Bryngloom's richest pharmacological treasury, the bog's peat-acids and contract-preserving ichor. The Trueborn Florae distill their own fae-touched thorn-blood, every bloodline's poison unique and uncounterable without specific study. The Shorn Florae brew in absolute secret among Thalren neighbors who would kill them, their toxins engineered for untraceability, delayed onset that mimics natural illness. The Drun Neth operate outside Neth jurisdiction entirely, their names burned from the First Contract, brewing with materials no registered alchemist would touch. Every brew is an act of rebellion, and Morvane, though it cannot see them, can sometimes feel what they are doing to its forest.

The fog is changing chemistry. Compounds that remained viable for years now degrade in weeks. Predator venoms are spoiling. The entire pharmacopoeia is turning unstable. Two apprentices have died testing Varis's desperation project: distilling the changing fog itself.`,
    title: "The Toxicologist",
    subtitle: "The Self-Poisoned Surgeon — Every Cure Is for Someone Else",
    illustration: "/assets/images/classes/toxicologist_illustration.png",
    illustrationCaption: "A Mimir Toxicologist, a mysterious alchemist wearing a carved storm-glass mask with beastlike curves and a tattered bark-hide cloak.",

    quickOverview: {
    title: "Class Overview",
    content: `**Who they are**: The Toxicologist is a master alchemical prep-specialist and poison surgeon whose veins run thick with weaponized reagents. You are the only preparation-based alchemist in Mythrill—rigging choke points with chemical traps and brewing lethal compounds mid-fight from your own saturated blood.

**The hook**: You prepare for battle through **Chemical Traps & Dynamic Brewing**: before initiative is rolled, you can seed the battlefield with vapor mines and spike traps. In combat, you bleed Vials to craft custom poisons tailored to enemy weaknesses.

**The resource bar & costs**: Your resource bar is **Vials** (bled from your own vitality) and **Contraption Parts**. You spend Vials to apply debilitating debuffs—weakening enemy attacks, slowing movement, shredding armor, and causing internal hemorrhaging.

**Bring one for**: Tactical pre-fight preparation, debuffing enemies into helplessness, and playing a cunning alchemical mastermind who dismantles bosses before they take an action.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: "Practitioners carry a profound cultural and physical responsibility, marked by their tradition's unique legacy and societal perceptions."
    },
    combatRole: {
      title: "Combat Role",
      content: "Self-poisoned apothecary and preparation specialist who distills weapon toxins, deploys aerosol mines, and layers debilitating debuffs."
    },
    playstyle: {
      title: "Playstyle & Turn 1 Flow",
      content: "**Your Turn 1 in Combat**:\n1. **Deploy Pre-Combat Traps**: Trigger placed aerosol mines or toss `Acid Spring Traps` to control terrain.\n2. **Coat Weapons in Toxin**: Apply multi-stage neurotoxins or paralytics to your weapons or ally ammo.\n3. **Layer Afflictions**: Bleed Vials from your saturated flesh to amplify DoT ticks on enemies."
    }
  },

    description: `A toxicologist is a self-poisoned surgeon whose veins run thick with weaponized toxin. The body rejects restoration. Every poison costs blood. Every antidote is for someone else.`,

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The toxicologist's chemical catalysts were born at Thornwood, three leagues east of the Shallows in the Frostwood Reach, where a Gref-pack killed four of six Thalren scouts during the Third Harvest and wore their faces back into the settlements. An alchemist named **Varis**, the sole surviving officer of that patrol, spent the next decade suspended in a canopy-laboratory above the massacre site, isolating fog-predator venom until he had a weapon the Gref could not steal. The price of this alchemical synthesis was chronic tremors  -  and, unexpectedly, frozen aging. The same preservative compounds that keep predator venom viable for decades arrested Varis's cellular decay entirely. A Thalren lives sixty to ninety years; Varis has been old for over four centuries, trapped in a ruined body that will not let him die until his work is finished.

**THE DISTILLERY**
The Toxicologist's order, known as The Distillery, operates from the Canopy-Laboratory in the Shallows of the Frostwood Reach. It is not a formal guild  -  it is an oral tradition maintained by a man who cannot write legibly, organized around techniques passed from hand to shaking hand. The Distillery's hierarchy runs from Shakers (apprentices learning to pour without spilling) to Glass-Hands (journeymen operating small laboratories) to Venom-Pourers (master distillers authorized to teach). Varis holds the sole rank of Keeper of the Slow Cup. He has named no successor, and a schism between Varis and his former Venom-Pourer **Nerath the Soft-Voiced**  -  who advocates abandoning the old pharmacopoeia for synthetic chemistry  -  threatens to split the tradition in half.

**CITIES & CIVIL RECEPTION**
Toxicologists are viewed with extreme caution in <LoreLink termId="greymark_keep">Greymark Keep</LoreLink>, but their services are highly valued by scouts and hunters in the Reach. In the Bryngloom, Vreken Toxicologists operate illegally from the Peat-Crypts beneath Over-Shanty, hiding their distillates from Neth revenue officers. In the Deep-Quarter, Drun Toxicologists produce null-distillates that the First Contract cannot register  -  a crime with no criminal, a transaction Morvane cannot audit.

**RACES & CULTURAL AFFILIATION**
The class is practiced by the Thalren humans, the <LoreLink termId="mimir">Tethered Mimir</LoreLink> (who learned by reverse-engineering the poisoned corpses that fell from Thalren canopy-traps), the Vreken of the Bryngloom (who adapted Thalren techniques to bog-chemistry after a debt-worker named Hael the Split-Hand taught them in exchange for alchemical moss), the Trueborn and Shorn Florae (who distill from their own thorn-blood), and the Drun Neth (who learned from Vreken fugitives seeking sanctuary in the Deep-Quarter and adapted the craft to their own decaying flesh).

**NOTABLE FIGURES**
* **Varis the Trembling**: Founder and Keeper of the Slow Cup. The chemist whose hands shook but whose poison cleared the Shallows of Gref. Alive, old, furious at the changing fog, and still working.
* **Nerath the Soft-Voiced**: Former Venom-Pourer and now Keeper of the Clean Hand. Varis's most brilliant student, exiled for arguing the old pharmacopoeia is dead and must be replaced with synthetic chemistry. Operates alone from an unmarked laboratory in the Ironwood Deeps.
* **Lyra the Poison-Weaver**: A Tethered Mimir Venom-Pourer who synthesized the first combat catalysts used in the Shallows black markets and currently oversees the Distillery's relations with the Tethered outposts.
* **Mor-Velk the Wet**: A Vreken Venom-Pourer (in absentia) who taught the Drun the craft in exchange for sanctuary after the Keeper's Sanction came down on her ichor-thefts. She died in the Deep-Quarter three years ago; the Drun still maintain her laboratory.
* **Kellan Soft-Hand and Torven the Steady**: Two of Varis's apprentices who died testing uncharacterized fog-distillates  -  the cost of the Keeper's desperation project, and the reason the junior distillers are losing faith.`
    },

    signatureQuote: {
      text: '"The Gref wanted my face. I gave it my venom instead. It could not steal a face that was melting. Problem solved."',
      speaker: 'Varis the Alchemist',
      context: 'Explaining his tactical philosophy to a young apprentice'
    },

    philosophy: {
      coreTenet: 'The difference between poison and medicine is dosage. Everything in the world is toxic if you consume enough of it. The Toxicologist simply understands the thresholds better than anyone else. They do not create poisons, they identify which naturally occurring toxins will produce the desired effect.',
      relationship: 'A Toxicologist\'s body is a chemical processing plant. They have deliberately microdosed themselves with so many toxins that their body has developed a complex tolerance network. New toxins must be administered carefully, the body needs time to learn to process them. The relationship is alchemical: the Toxicologist is both the chemist and the laboratory. Every new resistance they develop changes the internal chemistry, and some changes are irreversible.',
      paradox: 'The Toxicologist heals more slowly because their body is too busy processing toxins to repair itself. Any magical healing they receive is halved, their internal chemistry rejects outside interference. They are the most self-sufficient alchemists in the world, but they cannot accept help from anyone. A Toxicologist who pushes too hard will find themselves unable to recover, their body too overwhelmed by toxins to heal even the simplest wound.'
    },

    currentCrisis: `The fog is changing the chemistry of the Frostwood Reach. The airborne toxins that Toxicologists have relied on for generations, distilled from fog-predator venom, ironwood sap, and Gref residue, are becoming unstable. Compounds that once remained viable for years are now degrading in weeks.

The cause is not random. The changing fog is one expression of a broader unraveling that scholars across Mythril are documenting under different names: the Root-Veil's rejection of the Marked, the Monoliths' deepening resonance, the Wyrd's increased activity at the world's edges. The Frostwood's fog has always been more than weather  -  it is the breath of the deep forest, an exhalation of the same ancient biology that sustains the Root-Veil and the mycelial networks beneath. As the Root-Veil recoils from the Plaguebringer crisis and the Monoliths pulse with renewed activity, the fog's chemistry is shifting in response  -  becoming more aggressive, more unpredictable, more *alive*. It is not simply a change in composition; it is a change in behavior. The fog is reacting to something.

Toxicologists have documented the degradation pattern: fog-predator venoms spoil from the inside out, as if the fog that once sustained the predators' biology is now rejecting it. Ironwood sap distillates crystallize unpredictably, shattering their containment vessels. Gref-residue compounds that once required decades to decay now sour within a month. The Silent contamination theory  -  that the Bryngloom's silence is leaching into the global atmosphere  -  has gained currency among the Distillery's senior ranks, but Varis himself rejects it. He believes the fog is not being contaminated by outside forces; he believes the fog is *waking up*, that something has disturbed the deep-forest ecology on a scale no one understands, and the fog is no longer a passive medium but an active agent rewriting the chemistry of everything it touches.

Whatever the cause, the Toxicologists are losing their arsenal. Their most powerful poisons are turning inert, and they are being forced to develop new formulations from scratch  -  some from the changing fog itself, a reagent no one has characterized and that has already killed two of Varis's apprentices. The Gref continue to attack. The fog continues to change. And the Toxicologists are running out of time to decide whether they are preserving a dying craft or midwifing a new one.`,

    meaningfulTradeoffs: `To be a Toxicologist is to shake constantly. The chronic tremors caused by years of toxin exposure make fine motor control difficult. A Toxicologist cannot thread a needle, cannot sign their name legibly, cannot hold a cup of tea without sloshing. Their hands are in constant motion, a visible reminder of the price they pay. The tremors are worse when they are stressed, which makes combat particularly challenging, and particularly dangerous for anyone standing next to them when they are trying to pour a precise dose of poison into a vial.`,

    classSpecificLocations: [
      {
        name: 'The Distillery  -  Canopy-Laboratory',
        locationId: 'the-shallows',
        description: 'A suspended platform high in the ironwood canopy above Thornwood grove where Varis the Alchemist conducted his original research into fog-predator venom. Built on the exact site where his four patrolmates fell to the Gref during the Third Harvest. The laboratory is still maintained  -  glass vials line the walls, each containing a different toxin sample collected over four centuries. The oldest vials date to the mid-Diming and their contents are still viable, though degrading fast. The newest vials are labeled with question marks: fog-distillates no one has been able to characterize. The Distillery holds its Conclave of Spoiling here annually.',
        purpose: 'Headquarters, research laboratory, and toxin archive of the Distillery',
        status: 'Active  -  Varis still works here daily, flanked by junior distillers who monitor his tremors during pours'
      },
      {
        name: 'Thornwood Grove',
        locationId: 'frostwood-reach',
        description: 'A shallow-ironwood grove three leagues east of the Shallows where the Third Harvest occurred  -  the Gref ambush that killed four of six Thalren scouts and prompted Varis to systematize venom extraction. The grove is now considered a memorial site by the Distillery, though it is not marked or consecrated (Varis refuses to sentimentalize a massacre). Apprentice Shakers are brought here during their first year of training to understand what they are preparing to fight. The ironwood trees still bear claw-marks from the Gref-pack.',
        purpose: 'Memorial and training site',
        status: 'Unmarked; visited by the Distillery for initiations and vigils'
      },
      {
        name: 'The Peat-Crypts beneath Over-Shanty',
        locationId: 'bryngloom-forest',
        description: 'A network of submerged peat-vaults beneath the Vreken settlement of Over-Shanty where bog-chemists distill unlicensed reagents away from Neth auditors. The crypts are flooded knee-deep in bog-water, the walls weeping alchemical moss, and the Vreken Toxicologists brew by lantern-light, listening for the footsteps of Neth revenue officers above. Mor-Velk the Wet maintained her primary laboratory here until she fled to the Deep-Quarter. The crypts contain the oldest Vreken toxin archives outside of Varis\'s collection  -  four centuries of bog-chemistry recorded on treated moss-sheets that the Neth have never found.',
        purpose: 'Illegal Vreken distillery and toxin archive',
        status: 'Active, though increasingly dangerous  -  Neth patrols have doubled since the ichor-thefts began'
      },
      {
        name: 'The Deep-Quarter Null-Laboratory',
        locationId: 'frostwood-reach',
        description: 'A converted peat-hold in the Drun Neth enclave of the Deep-Quarter, established by Mor-Velk the Wet as payment for sanctuary. The laboratory is the only facility in Mythril capable of stabilizing null-distillates  -  Drun poisons that carry the Silence and register as non-existent on the First Contract. The walls are lined with lead-sheathed iron (a desperate attempt to contain null-spills), and the floor has been replaced twice after runaway distillates consumed the original ironwood. Drun Vel-Hassik now oversees the laboratory after Mor-Velk\'s death.',
        purpose: 'Drun distillery and null-distillate research facility',
        status: 'Active, but losing containment  -  the deepening Silence is eating through the lead-sheathing'
      },
      {
        name: 'Nerath\'s Ironwood Deep Laboratory',
        locationId: 'frostwood-reach',
        description: 'An unmarked, single-room laboratory drilled into the exposed root-system of a dead ironwood in the forest\'s deepest reaches. Nerath the Soft-Voiced operates here alone, developing synthetic toxins from mineral chemistry rather than biological extraction. The laboratory is austere  -  no trophy vials, no formula archives, no memorial to the tradition. Just glassware, mineral samples, and a single chair. Nerath believes sentiment is what is killing the Distillery. The laboratory\'s location is known to perhaps six people, none of whom will admit to knowing it.',
        purpose: 'Rival distillery and synthetic toxin research facility',
        status: 'Active  -  Nerath works here alone, producing stable but low-potency synthetic poisons for clients who have lost faith in Varis'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Why Bring Me?** Because no other class can prepare the battlefield before initiative is rolled. You are the ONLY preparation-based alchemist. You set traps at choke points, craft poisons mid-combat, and stack debilitating debuffs — weakened, slowed, bleeding, armor-shredded — that no other class can apply. By the time the real fight starts, your enemies are already dying and don't know it yet.

**Fatal Flaw**: You CANNOT heal yourself. All healing you receive from any source is reduced by 50% — your blood rejects medicine like it rejects purity. Fire and ember damage causes your active poisons to detonate INSIDE you. You are your own worst hazard zone. Without preparation time, you are a basic combatant carrying a body full of toxins with nowhere to spend them.

**Poison Application**: Apply various poisons to weapons for DoT, debuffs, and burst damage
**Battlefield Control**: Deploy contraptions to control enemy movement and create tactical advantages
**Mid-Combat Crafting**: Craft concoctions for 1 AP to adapt to changing situations
**Debuff Mastery**: Weaken enemies through stacking poison effects and contraption synergies
**Strategic Utility**: Provide antidotes for others, explosives, and tactical support

**Strengths**:
- Exceptional battlefield control through contraption placement
- Versatile damage output with 8 different poison types
- High adaptability through mid-combat concoction crafting
- Strong debuff capabilities that weaken entire enemy teams
- Unique utility through antidotes and explosive concoctions
- Rewards strategic planning and tactical positioning

**Weaknesses**:
- Slow to Boot Up: contraptions and brewed concoctions cost actions to deploy  -  a fast ambush before you're set leaves you a basic combatant with a body full of toxins and nowhere to spend them.
- Two-Resource Bind: Vials and Contraption Parts are separate pools that don't substitute  -  running one dry guts half your kit, and a foe who burns your prep time starves both.
- Chronic Tremors (social): your hands shake from years of toxin exposure, worse under stress (combat, a lie, interrogation); fine work, steady pours, signed names, and Sleight of Hand all suffer, and your stained fingers mark you plainly as a poisoner.
- Less effective against poison-immune enemies
- 50% healing reduction makes you dangerously fragile
- Fire/ember damage triggers internal poison detonation
- Vulnerable when caught without prepared resources

The Toxicologist shines in tactical combats where they can prepare the battlefield with contraptions, apply poisons strategically, and adapt their concoctions to counter enemy tactics. But every battle is a gamble — the wrong flame spell turns your own blood into a weapon against you.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `Playing a Toxicologist is about preparation, adaptation, and tactical resource management. Key strategic considerations:

**Resource Management**:
- **Vials**: INT mod + 3 (min 4), regain 1d4 per short rest
- **Contraption Parts**: Max 5, recovered after combat (reclaimed); destroyed contraptions recover 1 part per short rest
- **Weapon Poisons**: 1 vial each, quick-apply to weapon for 3 attacks
- **Brewed Concoctions**: 1-3 vials, more powerful crafted items
- **Part Costs**: 1-2 per contraption
- **Strategy**: Balance poison crafting with contraption deployment

**Weapon Poisons** (1 vial each, applied to weapon, lasts 3 attacks):
- **Neurotoxin**: +1d8 blight damage, -2 to attack rolls for 2 rounds
- **Hemotoxin**: +1d6 blight damage/round for 3 rounds (bleeding DoT)
- **Cytotoxin**: +2d6 blight damage, -1d4 max HP (temporary)
- **Myotoxin**: +1d6 blight damage, -10ft movement, disadvantage on STR checks
- **Cardiotoxin**: +2d8 blight damage, stunned 1 round on failed CON save (DC 16)

**Contraption Deployment** (Uses Contraption Parts, deployed as an action):
- **Poison Gas Trap** (1 part): 2d6 blight damage, -10ft movement, triggered when enemy enters 5ft radius
- **Spike Trap** (1 part): 3d6 smashing damage, immobilized 1 round (DC 14 agility check)
- **Healing Mist Dispenser** (2 parts): Heal 1d8 HP, remove 1 poison/disease when ally enters
- **Smoke Grenade Launcher** (1 part): 15ft smoke cloud, obscures vision for 3 rounds
- **Acid Sprayer** (2 parts): 2d8 blight damage, -3 armor for 3 rounds
- **Alarm Bell** (1 part): Alert allies, +2 initiative for allies within 30ft

**Concoction Crafting** (Mid-Combat, 1 AP each):
- **Antidote** (1 vial): Cure poison/disease, +2 CON saves vs poison for 1 hour
- **Explosive Concoction** (3 vials): 3d8 ember damage in 10ft radius (agility check DC 14)
- **Smoke Bomb** (1 vial): 15ft smoke cloud, obscures vision for 3 rounds
- **Healing Mist** (2 vials): Heal 2d6 HP to all allies in 10ft radius

**Specialization Synergies**:
- **Venomancer**: +1d6 blight damage on all effects, poison duration +2 rounds
- **Gadgeteer**: Deploy contraptions for 1 AP instead of an action, +1 contraption part max, contraptions deal +1d6 damage
- **Saboteur**: Debuffs last +2 rounds, enemies affected by your poisons/contraptions have -2 to all saves

**Combat Flow**:
- **Pre-Combat**: Deploy contraptions at choke points and key locations
- **Opening**: Apply poison to weapon, throw explosive concoction at grouped enemies
- **Mid-Combat**: Switch poisons based on enemy type, craft concoctions as needed
- **Defensive**: Use smoke bombs and caltrops to create escape routes
- **Finishing**: Stack multiple poisons on priority targets for devastating DoT

**Team Dynamics**:
- Works well with tanks who can protect while setting up contraptions
- Synergizes with crowd control that groups enemies for AoE poisons
- Benefits from scouts who can identify enemy weaknesses
- Provides utility through antidotes and defensive contraptions
- Can zone enemies away from vulnerable allies with poison clouds`,
    },

    immersiveCombatExample: {
      title: "Combat Example: The Alchemist's Laboratory",
      content: `The bandit leader laughs when you kneel to set up your apparatus. Good. Let him laugh. He does not know that the glass vials at your belt hold compounds refined from fog-predator venom, that the contraptions unfolding at your feet have killed things much larger than him, that his bloodstream is about to become your laboratory.

**The Setup**: You're a Toxicologist (Venomancer specialization) facing a group of bandits (5 bandits + 1 bandit leader). Your party is with you. Starting Resources: Vials: 7/7, Contraption Parts: 5/5. Starting Mana: 40/50. Your goal: Deploy contraptions to control the battlefield, apply poisons to your weapon, and craft concoctions mid-combat to adapt to the situation.

*This example assumes you have 1 minute of pre-combat preparation to deploy contraptions before initiative is rolled.*

**Starting State**: Vials: 7/7 | Contraption Parts: 5/5 | Mana: 40/50 | HP: 50/50 | Weapon Poison: None

**Pre-Combat - Setting the Trap (Parts: 5 â†’ 3)**

*Five bandits and their leader approach. You smile. They're walking into YOUR laboratory.*

**Action**: Deploy "Spike Trap" at the choke point (1 contraption part)
**Effect**: 3d6 smashing damage when triggered, target immobilized 1 round (DC 14 agility check)

*You place a concealed spike trap at the choke point where enemies must pass through.*

**Contraption Parts**: 5 - 1 = **4/5**

**Action**: Deploy "Poison Gas Trap" behind the spikes (2 contraption parts)
**Effect**: When triggered, releases poison cloud (5ft radius, 2d6 blight damage, -10ft movement for 2 rounds)

*You place a small device on the ground. When an enemy steps on it, it will release a devastating poison cloud.*

**Contraption Parts**: 4 - 2 = **2/5**

**Your Party's Tank**: "What are all these... devices?"
**You**: "Contraptions. A spike trap at the choke point. A poison gas trap behind it. Once combat starts, I'll coat my blade with Neurotoxin. Let them come."

**Current State**: Vials: 7/7 | Parts: 2/5 | Mana: 40/50 | Weapon: None

**Turn 1 - Opening Strike (Vials: 7 â†’ 3)**

*Roll initiative. The bandits charge. Two of them trigger the spike trap. One stumbles into the poison gas trap.*

**Bandits #1, #2**: Trigger Spike Trap
**Damage**: 3d6 â†’ [4, 5, 3] = 12 smashing damage each
**Save**: DC 14 agility â†’ Bandit #1 fails (immobilized 1 round), Bandit #2 succeeds (half damage = 6)

**Bandit #3**: Triggers Poison Gas Trap
**Effect**: Poison cloud erupts (5ft radius)
**Damage**: 2d6 â†’ [5, 4] = 9 blight damage
**Effect**: -10ft movement for 2 rounds

**Bandits #3, #4** (adjacent): Caught in poison cloud, take 9 blight damage each

*The poison cloud ERUPTS. The bandits caught inside CHOKE and GASP.*

**Action (1 AP)**: Apply "Neurotoxin" to weapon (1 toxin vial)
**Effect**: Weapon attacks deal +1d8 blight damage, target has -2 to attack rolls for 2 rounds

*You coat your blade with a viscous green poison. It GLISTENS with toxicity.*

**Vials**: 7 - 1 = **6/7**

**Action**: Melee attack Bandit #1 (immobilized, has Neurotoxin on weapon)
**Attack Roll**: d20+5 â†’ [16] = Hit!
**Base Damage**: 2d6+3 â†’ [5, 4] + 3 = 12 smashing damage
**Neurotoxin**: +1d8 poison â†’ [6] = +6 blight damage
**Total Damage**: 12 + 6 = **18 damage**
**Effect**: Bandit #1 has -2 to attack rolls for 2 rounds

**Bandit #1**: Takes 18 damage â†’ HEAVILY DAMAGED

**Action (1 AP)**: Craft "Explosive Concoction" (3 toxin vials)
**Effect**: Throwable explosive, 3d8 ember damage in 10ft radius (agility check DC 14 for half)

*You quickly mix chemicals from your vials. The concoction BUBBLES and SMOKES.*

**Vials**: 6 - 3 = **3/7**

**Your Party's Mage**: "You're crafting explosives MID-COMBAT?!"
**You**: "Explosive Concoction. Costs 3 toxin vials. I'll throw it next turn."

**Current State**: Vials: 3/7 | Parts: 2/5 | Mana: 40/50 | Weapon: Neurotoxin | Explosive ready

**Turn 2 - The Explosion (Vials: 3 â†’ 2)**

*The poison cloud continues. Bandits #3 and #4 take another 9 blight damage.*

**Poison Cloud** (Turn 2 of 2): Bandits #3, #4 take 9 blight damage each
**Poison Cloud**: Expires after this turn

**Action**: Throw "Explosive Concoction" at grouped bandits (no additional cost, already crafted)
**Targets**: Bandits #2, #3, #4 (grouped together)
**Damage**: 3d8 fire â†’ [7, 5, 6] = **18 ember damage each**
**Save**: Bandit #2 succeeds (9 damage), Bandit #3 fails (18 damage), Bandit #4 fails (18 damage)

*You hurl the concoction. It EXPLODES in a massive fireball.*

**Bandit #2**: Takes 9 ember damage (saved) + 6 from spike trap earlier = DAMAGED
**Bandit #3**: Takes 18 ember damage + 18 from poison cloud (2 turns) = **DEAD**
**Bandit #4**: Takes 18 ember damage + 18 from poison cloud (2 turns) = **DEAD**

**Your Party's Rogue**: "Two bandits down with ONE explosive and the gas trap!"
**You**: "Explosive Concoction plus Poison Gas Trap synergy. They were grouped perfectly."

**Action (1 AP)**: Apply "Cytotoxin" to weapon (1 toxin vial)
**Effect**: Weapon attacks deal +2d6 blight damage, -1d4 max HP (temporary)

*You coat your blade with a BLACK poison that seems to absorb light.*

**Vials**: 3 - 1 = **2/7**

**Current State**: Vials: 2/7 | Parts: 2/5 | Mana: 40/50 | Weapon: Cytotoxin

**Turn 3 - Finishing Touches (Vials: 2 â†’ 0)**

*Only Bandit #1, #2, #5, and the Leader remain.*

**Action**: Melee attack Bandit #1 (has Cytotoxin on weapon)
**Attack Roll**: d20+5 â†’ [17] = Hit!
**Base Damage**: 2d6+3 â†’ [6, 5] + 3 = 14 smashing damage
**Cytotoxin**: +2d6 necrotic â†’ [5, 4] = +9 blight damage
**Total Damage**: 14 + 9 = **23 damage**
**Effect**: Bandit #1's max HP reduced by 4 (1d4 â†’ [4])

**Bandit #1**: Takes 23 damage â†’ **DEAD**

**Action (1 AP)**: Craft "Antidote" (1 toxin vial)
**Effect**: Cure poison/disease on ally, +2 CON saves vs poison for 1 hour

*You mix a healing concoction, just in case your Tank got hit by residual gas.*

**Vials**: 2 - 1 = **1/7**

**Your Party's Healer**: "You're almost out of vials!"
**You**: "I still have 1 vial left, and I'll regain 1d4 on a short rest. Plus my contraption parts come back after combat."

**Current State**: Vials: 1/7 | Parts: 2/5 | Mana: 40/50

**Turn 4 - Cleanup**

*Bandit #2, #5, and the Leader remain, all damaged from various sources.*

**Your Party's Tank**: Attacks Bandit #2 â†’ DEAD
**Your Party's Mage**: Casts Magic Missile at Leader â†’ HEAVILY DAMAGED
**Your Party's Rogue**: Attacks Bandit #5 â†’ DEAD

**Action**: Melee attack Leader (still has Cytotoxin on weapon)
**Attack Roll**: d20+5 â†’ [14] = Hit!
**Base Damage**: 2d6+3 â†’ [4, 3] + 3 = 10 smashing damage
**Cytotoxin**: +2d6 necrotic â†’ [6, 2] = +8 blight damage
**Total Damage**: 10 + 8 = **18 damage**

**Leader**: Takes 18 damage â†’ **DEAD**

**Combat Over**

*You collect your contraption parts from the spike trap and poison gas trap (reusable — parts are recovered after combat).*

**Contraption Parts**: 2 + 3 (recovered) = **5/5** (back to max)

**Your Party's Rogue**: "You killed two bandits with the explosive + gas combo, poisoned the leader to death, and your weapon poisons dealt massive damage."
**You**: "Toxicologist gameplay. I deployed 2 contraptions before combat (1 part on spike trap, 2 parts on gas trap). I applied Neurotoxin (1 vial) and Cytotoxin (1 vial) to my weapon. I crafted an Explosive Concoction (3 vials) and an Antidote (1 vial). 6 vials spent, 1 remaining, and I recover all contraption parts after combat."

**Final State**: Vials: 1/7 (will regain 1d4 on short rest) | Parts: 5/5 (recovered) | Mana: 40/50 | HP: 50/50

**Damage Breakdown**:
- Neurotoxin (weapon): 6 blight damage to Bandit #1
- Cytotoxin (weapon): 9 + 8 = 17 blight damage
- Explosive Concoction: ~15 average ember damage Ã— 3 bandits = ~45 total ember damage
- Poison Gas Trap: 9 blight damage/turn Ã— 2 turns Ã— 2 bandits = 36 total blight damage
- Spike Trap: ~9 average smashing damage Ã— 2 bandits = ~18 total smashing damage
- **Grand Total**: ~122 damage from poisons, contraptions, and concoctions

**The Lesson**: Toxicologist gameplay is about:
1. **Pre-Combat Setup**: Deploy contraptions at choke points BEFORE initiative (spike trap, gas trap)
2. **Weapon Poison Application**: Switch between Neurotoxin (attack debuff) and Cytotoxin (max HP reduction) based on target
3. **Mid-Combat Crafting**: Craft Explosive Concoction (3 vials) and Antidote (1 vial) for 1 AP each
4. **Resource Management**: Spent 6 of 7 vials, recovered all contraption parts after combat
5. **Contraption Synergy**: Spike trap immobilized one bandit, gas trap dealt ongoing poison to grouped enemies
6. **Explosive + Gas Combo**: Explosive Concoction killed enemies already weakened by the gas trap

You're an ALCHEMIST WARRIOR who controls the battlefield through preparation and adaptation. You deploy contraptions (spike traps, gas traps) to control enemy movement BEFORE combat starts. You apply poisons to your weapon (Neurotoxin, Cytotoxin) for enhanced attacks. You craft concoctions MID-COMBAT (explosives, antidotes) to adapt to the situation. You're not a simple damage dealer—you're a TACTICAL ALCHEMIST who turns the battlefield into your laboratory.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Vials: The Alchemist's Belt",
    subtitle: "How Your Resource Works (Beginner's Guide)",

    description: `**1. What is it? (The Alchemist's Belt)**
Vials (0–10) represent distilled alchemical compounds and chemical reagents carried in your belt to coat weapons and arm traps.

**2. How do I build it?**
- Brew and prep vials during short rests or before combat.
- Bleed small amounts of chemical reagents from your saturated veins during combat (+2 Vials).

**3. How do I spend it & what is the catch?**
- Spend Vials to apply multi-stage neurotoxins to weapons or deploy aerosol spring mines.
- **The Catch (Prep-Heavy & Supply Depletion)**: If you run out of prepared Vials mid-combat, you must take physical self-damage to synthesize emergency toxins on the fly.`,
    cards: [
      {
        title: "Vials",
        stats: "INT mod + 3 (min 4)",
        details:
          "Spent to craft poisons, concoctions, and antidotes mid-combat. Crafting costs 1 AP. Recover 1d4 per short rest, full on long rest.",
      },
      {
        title: "Contraption Parts",
        stats: "Max 5",
        details:
          "Deployed as battlefield traps and devices. Each contraption takes 1 action to place. Parts are recovered after combat when you reclaim your devices. Destroyed contraptions recover 1 part per short rest, all per long rest.",
      },
      {
        title: "Poison Stacking",
        stats: "Multiple Active",
        details:
          "Different poisons can stack on the same target. A poisoned, bleeding, weakened, and armor-shredded enemy is your masterpiece.",
      },
    ],

    usage: {
      momentum:
        "Open fights with an Explosive Concoction (3 vials) into grouped enemies, then apply weapon poison and start stacking debuffs. Pre-deployed contraptions at chokepoints mean the fight starts in your favor before initiative is rolled.",
      flourish:
        "Craft reactively based on what the encounter demands. Healing Mist to save a dying ally, Smoke Bomb to break line of sight, or Antidote to counter an enemy poisoner. The best Toxicologists adapt their recipes to each fight rather than following a fixed script.",
    },

    overheatRules: {
      title: "Vial Exhaustion & Contraption Burnout",
      content: `The Toxicologist's resources are finite within each rest cycle. Running dry at the wrong moment is the class's greatest vulnerability.

**Vial Exhaustion (0 Vials)**:
When you run out of vials, you lose your most powerful tool — mid-combat crafting. You can still attack with a poisoned weapon (if applied before running dry), but you cannot craft new concoctions or apply fresh poisons. You become a basic combatant with deployed contraptions as your only edge.

**Contraption Burnout (0 Parts)**:
No parts means no new traps. Existing contraptions remain active, but you cannot layer the battlefield further. In extended encounters, this severely limits your control options.

**Managing the Dual Drain**:
Both resources compete for your limited rest economy. Spending 3 vials on an Explosive Concoction AND 2 parts on a Spike Trap in the same fight can leave you depleted for the next encounter. The key is knowing when to go all-in and when to hold back.

**Recovery Planning**:
- **After Combat**: Reclaim undestroyed contraptions to recover their parts immediately.
- **Short Rest**: Recover 1d4 vials + 1 contraption part (for destroyed contraptions). Plan short rests when you are low on both resources.
- **Long Rest**: Full recovery. If you burned through everything in a boss fight, the long rest afterward resets you completely.
- **Pacing Rule of Thumb**: Spend no more than half your vials in any single non-boss encounter. Save the heavy recipes for fights that matter.`,
    },

    // Vial Recipes Table
    toxinVialRecipesTable: {
      title: "Vial Recipes",
      description:
        "Concoctions and poisons that can be crafted using Vials. Crafting takes 1 AP.",
      headers: ["Recipe", "Vial Cost", "Effect", "Duration", "Notes"],
      rows: [
        [
          "Paralysis Poison",
          "2 vials",
          "Target must save (DC 14 CON) or be Nauseated for 1 round (disadvantage on attacks and checks, halved movement)",
          "3 attacks",
          "Applied to weapon or dart",
        ],
        [
          "Weakening Toxin",
          "1 vial",
          "-2 to attack rolls and -1d4 damage",
          "3 attacks",
          "Stacks with other debuffs",
        ],
        [
          "Corrosive Acid",
          "2 vials",
          "2d6 blight damage, -2 armor for 2 rounds",
          "3 attacks",
          "Eats through armor",
        ],
        [
          "Bleeding Venom",
          "2 vials",
          "1d6 blight damage per round for 4 rounds",
          "3 attacks",
          "DoT effect, stacks",
        ],
        [
          "Antidote",
          "1 vial",
          "Cure poison/disease, +2 CON saves for 1 hour",
          "Instant",
          "Can be used on allies",
        ],
        [
          "Explosive Concoction",
          "3 vials",
          "3d8 ember damage in 10ft radius",
          "Instant",
          "Thrown as action, agility check DC 14",
        ],
        [
          "Smoke Bomb",
          "1 vial",
          "Create 15ft radius smoke cloud, obscures vision",
          "3 rounds",
          "Thrown for 1 AP",
        ],
        [
          "Healing Mist",
          "2 vials",
          "Heal 2d6 HP to all allies in 10ft radius",
          "Instant",
          "Rare utility option",
        ],
      ],
    },

    // Contraption Types Table
    contraptionTypesTable: {
      title: "Contraption Types",
      description:
        "Minor devices that can be deployed on the battlefield. Deployment requires an action.",
      headers: ["Contraption", "Parts Cost", "Trigger", "Effect", "Duration"],
      rows: [
        [
          "Poison Gas Trap",
          "1 part",
          "Enemy enters 5ft radius",
          "2d6 blight damage, -10ft movement for 2 rounds",
          "Until triggered or 10 minutes",
        ],
        [
          "Spike Trap",
          "1 part",
          "Enemy enters 5ft square",
          "3d6 smashing damage, immobilized for 1 round (DC 14 agility check)",
          "Until triggered or 10 minutes",
        ],
        [
          "Healing Mist Dispenser",
          "2 parts",
          "Ally enters 5ft radius",
          "Heal 1d8 HP, remove 1 poison/disease",
          "Until triggered or 10 minutes",
        ],
        [
          "Smoke Grenade Launcher",
          "1 part",
          "Enemy enters 10ft radius",
          "Create 15ft smoke cloud, obscures vision for 3 rounds",
          "Until triggered or 10 minutes",
        ],
        [
          "Acid Sprayer",
          "2 parts",
          "Enemy enters 5ft cone",
          "2d8 blight damage, -3 armor for 3 rounds",
          "Until triggered or 10 minutes",
        ],
        [
          "Alarm Bell",
          "1 part",
          "Enemy enters 10ft radius",
          "Alert allies, +2 initiative for allies within 30ft",
          "Until triggered or 1 hour",
        ],
      ],
    },

    // Poison Weapon Effects Table
    poisonWeaponEffectsTable: {
      title: "Weapon Poison Effects",
      description:
        "Poisons applied to weapons. Each poison lasts for 3 attacks or until end of combat.",
      headers: [
        "Poison Type",
        "Damage/Effect",
        "Secondary Effect",
        "Save DC",
        "Specialization Bonus",
      ],
      rows: [
        [
          "Neurotoxin",
          "1d8 blight damage",
          "Target -2 to attack rolls for 2 rounds",
          "DC 14 CON",
          "Venomancer: +1d6 damage",
        ],
        [
          "Hemotoxin",
          "1d6 blight damage/round for 3 rounds",
          "Bleeding effect, stacks",
          "DC 13 CON",
          "Venomancer: Duration +2 rounds",
        ],
        [
          "Cytotoxin",
          "2d6 blight damage",
          "-1d4 max HP (temporary)",
          "DC 15 CON",
          "Gadgeteer: Also -1 DR",
        ],
        [
          "Myotoxin",
          "1d6 blight damage",
          "-10ft movement, disadvantage on STR checks",
          "DC 14 CON",
          "Saboteur: Also -2 to saves",
        ],
        [
          "Cardiotoxin",
          "2d8 blight damage",
          "Nauseated for 1 round on failed save (disadvantage on attacks, can still move)",
          "DC 16 CON",
          "Venomancer: Nauseated duration +1 round"
        ],
      ],
    },

    strategicConsiderations: {
      title: "Alchemical Warfare Tactics",
      content: `**Pre-Combat Preparation (Before Initiative)**:
Deploy contraptions at chokepoints and high-traffic areas before the fight begins. A Poison Gas Trap at a doorway and a Spike Trap behind cover can carry an entire encounter. You are the only class that gets stronger before initiative is even rolled — use every second.

**Opening Round (Establish the Debuff Web)**:
Apply weapon poison (1 AP) and throw an Explosive Concoction or Smoke Bomb at grouped enemies. Your goal in the first round is to get as many debuffs active as possible. Weakening Toxin + Corrosive Acid on the same target means they hit less often AND take more damage — the multiplicative effect is devastating.

**Mid-Combat (Reactive Crafting)**:
Craft concoctions reactively based on what the fight demands. Ally goes down? Healing Mist. Enemy caster is annoying? Smoke Bomb to obscure their line of sight. Getting swarmed? Acid Sprayer trap at your feet. Keep 1-2 vials in reserve at all times — the fight can always go sideways.

**Stack & Finish (The Kill Combo)**:
Stack Bleeding Venom + Weakening Toxin on priority targets for sustained damage and reduced accuracy. Against tanks, stack Corrosive Acid + Neurotoxin for armor shredding + attack debuff. Against bosses, lead with Cardiotoxin (stun on failed save) then follow up with your highest-damage poison while they can't fight back.

**Contraption Layering**:
Place traps in sequence — Poison Gas Trap first (slows movement), then Spike Trap behind it (immobilizes slowed targets). Enemies trigger the gas, try to retreat, and hit the spikes. This combo alone can remove a minion from the fight for 2+ rounds.

**Vial Economy**:
You have limited vials. Explosive Concoctions (3 vials) are powerful but expensive. Early in a dungeon, lean on cheap 1-vial recipes (Weakening Toxin, Smoke Bomb). Save your vial-heavy plays for bosses. A short rest restores 1d4 vials — plan your rests around your vial count, not just your HP.`,
    },

    playingInPerson: {
      title: "Playing Toxicologist In Person",
      subtitle: "Physical Tracking for Tabletop Play",
      content: `The Toxicologist is the most tactile class at the table. Vials, traps, poison tokens, and recipe cards make your turn a hands-on alchemy experience that everyone can see and track.

**Required Materials**:
- **Green Beads/Tokens** — Vials (INT mod + 3, min 4). Remove one each time you craft.
- **Gray Tokens** — Contraption Parts (max 5). Remove when deploying.
- **Colored Skull Tokens** — One per poison type to mark affected enemies (e.g., red = neurotoxin, blue = hemotoxin, purple = cytotoxin).
- **Inagility Cards** — Pre-write your top 5 recipes for fast reference during combat.
- **Miniature Markers** — Small dice or tokens to place on the grid where contraptions are deployed.

**Tracking Vials**:
- **Bead Method**: Keep green beads in a small pouch. Pull one out for each vial spent. Visual and tactile — the pouch getting lighter is a great tension builder.
- **d10 Method**: Use a d10 die showing your current vial count. Rotate after each craft. Fast and takes minimal table space.

**Tracking Contraptions**:
Place a d6 or small token on the grid square where each contraption is deployed. Write the contraption type on a sticky note and stick it next to the die so everyone knows what the trap does. When triggered, remove both the die and the note.

**Tracking Active Poisons on Enemies**:
Place colored tokens on enemy miniatures to show active poisons:
- **Red bead** = Neurotoxin (attack penalty)
- **Blue bead** = Hemotoxin (bleeding)
- **Purple bead** = Cytotoxin (armor reduction)
- **Green bead** = Myotoxin (movement penalty)
- **Black bead** = Cardiotoxin (stun risk)

Multiple beads on one mini = that enemy is suffering your full alchemical wrath.

**Quick Reference**:
\`\`\`
TOXICOLOGIST RESOURCES:
  Vials: INT mod + 3 (min 4) | Recover 1d4/short rest, full/long rest
  Parts: Max 5              | Recover 1/short rest, full/long rest
  Crafting: 1 AP per recipe

CHEAP RECIPES (1 vial): Weakening Toxin, Smoke Bomb, Antidote
MID RECIPES (2 vials): Corrosive Acid, Bleeding Venom, Healing Mist
EXPENSIVE (3 vials): Explosive Concoction

CHEAP CONTRAPTIONS (1 part): Gas Trap, Spike Trap, Smoke Grenade, Alarm Bell
HEAVY CONTRAPTIONS (2 parts): Healing Mist Dispenser, Acid Sprayer
\`\`\`

**The Physical Hacks**:
- **Recipe Deck**: Write each recipe on a small card. When you craft, physically discard the card into a "used" pile. At rest, shuffle them back in. Makes resource spending feel real.
- **The Poison Board**: Keep a small section of your character sheet dedicated to tracking which enemies have which poisons. Use checkboxes or a mini grid.
- **Contraption Map**: Before combat, physically place trap markers on the grid where you plan to deploy. This speeds up your turn and makes your battlefield control visible to allies.

**Pro Tips**:
- Tell your party what you're applying to which enemy. "I'm stacking neurotoxin and corrosive acid on the boss — he's at -2 to hit and -2 armor." This helps everyone play around your debuffs.
- Pre-write your "panic recipes" — the 1-vial concoctions you'd craft in an emergency (Antidote, Smoke Bomb). Keep them on a separate card for instant reference when things go wrong.
- Coordinate with your party's melee fighters. They benefit most from weapon poisons applied to their weapons — a Fighter with Corrosive Acid on their greatsword shreds boss armor.`,
    },
  },

  // Specializations
  specializations: {
    title: "Toxicologist Specializations",
    subtitle: "Three Paths of Self-Destruction",

    description: "Three ways to weaponize your own decay. Each path deepens your corruption in a different direction — Venomancers become the poison itself, Gadgeteers build killing machines from refuse, and Saboteurs turn the enemy's own body against them. Choose how you suffer.",
    passiveAbility: {
      name: "Vials",
      description:
        "All Toxicologists can craft poisons and concoctions for 1 AP, and deploy contraptions as an action. Gain immunity to your own poisons and resistance to all blight damage.",
    },

    specs: [
      {
        name: "Venomancer",
        icon: "fas fa-skull-crossbones",
        description:
          "Poisoners who have made their own blood a reservoir of death. Venomancers don't just apply toxins — they embody them, brewing concentrations so lethal that even their sweat is hazardous. Their poisons don't kill quickly. They linger, they worsen, they make the victim beg for the end.",
        passiveAbility: {
          name: "Potent Toxins",
          description:
            "All blight damage you deal is increased by +1d6. Poison effects you apply last 2 additional rounds. You have advantage on rolls to craft poisons.",
        },

        keyAbilities: [
          {
            name: "Concentrated Venom",
            cost: "2 Vials",
            effect:
              "Apply a super-concentrated poison to your weapon. Next attack deals 4d8 blight damage and target is poisoned for 1 minute (DC 17 CON save to halve damage and negate poisoned condition).",
          },
          {
            name: "Toxic Cloud",
            cost: "3 Vials",
            effect:
              "Create a 20ft radius poison cloud. All enemies in area take 3d6 blight damage per round and have -2 to all rolls. Lasts 4 rounds. DC 16 CON save for half damage.",
          },
          {
            name: "Lethal Injection",
            cost: "4 Vials",
            effect:
              "Inject target with lethal toxin. Target takes 6d10 blight damage immediately and 2d10 blight damage per round for 5 rounds. DC 18 CON save to halve initial damage and reduce DoT to 1d10.",
          },
        ],
      },
      {
        name: "Gadgeteer",
        icon: "fas fa-cog",
        description:
          "Engineers of suffering who build instruments of pain from battlefield salvage. Gadgeteers cobble together death from scrap and spite — spike traps from shattered shields, gas dispensers from condemned alchemy vials. Their contraptions are graves waiting for someone to step in.",
        passiveAbility: {
          name: "Improved Contraptions",
          description:
            "You can deploy contraptions for 1 AP instead of an action. Your contraptions deal +1d6 damage and have +5ft trigger radius. You can have up to 4 active contraptions at once (instead of 3).",
        },

        keyAbilities: [
          {
            name: "Rapid Deployment",
            cost: "2 Contraption Parts",
            effect:
              "Deploy 2 contraptions simultaneously for 1 AP. Both contraptions are placed within 30ft of you and activate immediately.",
          },
          {
            name: "Overcharged Trap",
            cost: "3 Contraption Parts",
            effect:
              "Deploy a supercharged contraption. When triggered, it deals 5d8 damage (type based on contraption), affects 15ft radius, and applies additional debuff for 3 rounds.",
          },
          {
            name: "Contraption Network",
            cost: "4 Contraption Parts",
            effect:
              "Link all your active contraptions. When one triggers, all others activate simultaneously. Enemies caught in multiple effects take full damage from each and have disadvantage on all saves.",
          },
        ],
      },
      {
        name: "Saboteur",
        icon: "fas fa-user-secret",
        description:
          "Masters of sabotage and systemic decay. Saboteurs don't just poison the body — they poison the plan. Every trap is a betrayal, every debuff a slow unraveling of an enemy's will to fight. Where others see a battlefield, the Saboteur sees a patient already dying.",
        passiveAbility: {
          name: "Debilitating Expertise",
          description:
            "All debuffs you apply last 2 additional rounds and require a DC 16 Spirit save to dispel (dispel attempts use the higher of caster's spell DC or DC 16). Enemies affected by your poisons or contraptions have -2 to all saves and skill checks.",
        },

        keyAbilities: [
          {
            name: "Crippling Toxin",
            cost: "2 Vials",
            effect:
              "Apply a debilitating poison. Target has -4 to attack rolls, -2 armor, -10ft movement, and disadvantage on all saves for 5 rounds. DC 16 CON save to reduce penalties by half.",
          },
          {
            name: "Chaos Grenade",
            cost: "3 Vials + 1 Contraption Part",
            effect:
              "Throw a grenade that combines poison and mechanical chaos. 20ft radius: 2d8 poison + 2d8 ember damage, enemies are confused (attack random target) for 2 rounds. DC 17 INT save to negate confusion.",
          },
          {
            name: "Total Shutdown",
            cost: "4 Vials + 2 Contraption Parts",
            effect:
              "Target enemy is severely debilitated. They cannot take actions for 1 round (reactions only), have -3 armor, and have disadvantage on all saves. DC 19 CON save to reduce to: no action penalty, -1 armor, and disadvantage on saves for 1 round only.",
          },
        ],
      },
    ],
  },

  // Example Spells - organized by specialization
  exampleSpells: [
    ...UTILITY_SPELLS,
    // SIGNATURE UTILITY SPELLS (CLASSIC WOW UTILITY NICHE)
    { id: "tox_acid_unlocking",
      name: "Acid Unlocking",
      description: "Apply a drop of corrosive Florae acid to quietly dissolve metal lock tumblers or mechanical trap gears over 10 seconds without making sound.",
      level: 1,
      spellType: "ACTION",
      icon: "Poison/Acid Drip",
      specialization: "universal",
      typeConfig: { school: "blight", icon: "Poison/Corrosive Acid", tags: ["utility", "lockpick", "acid", "toxicologist"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 5 },
      resourceCost: { actionPoints: 1, mana: 0 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility", "lockpick", "acid", "toxicologist"]
    },
    { id: "tox_false_death",
      name: "False Death",
      description: "Ingest a micro-vial of numbing peat-extract, dropping pulse and body temperature to zero. Enemies believe you are dead and ignore you for up to 10 minutes.",
      level: 3,
      spellType: "REACTION",
      icon: "Poison/Deadly Poison",
      specialization: "universal",
      typeConfig: { school: "blight", icon: "Poison/Poison Vial", tags: ["utility", "feign_death", "stasis", "toxicologist"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, mana: 0 },
      cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
      tags: ["utility", "feign_death", "toxicologist"]
    },
    // ===== VENOMANCER SPECIALIZATION =====
    { id : "tox_venom_strike",
      name: "Venom Strike",
      description:
        "Drive a poisoned blade into the target, injecting a toxin that deals 2d6 blight damage and leaves 1d6 blight seeping through their veins each round for 4 rounds.",
      spellType: "ACTION",
      icon: "Poison/Poison Concoction",
      level: 2,
      specialization: "venomancer",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        toxinVials: 2,
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Strike with poisoned blade",
      },

      resolution: "ATTACK_ROLL",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d6 + agility",
        elementType: "blight",
        damageTypes: ["blight"],
        bonusDamage: {
          condition: "venomancer_passive",
          amount: "+1d6",
          description: "Venomancer passive adds +1d6 blight damage",
        },
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "1d6",
          duration: 4,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "poisoned",
            name: "Poisoned",
            description:
              "Disadvantage on attack rolls and ability checks for 4 rounds",
            statusType: "poisoned",
            level: "moderate",
            statPenalty: [
              { stat: "attack", value: -99, magnitudeType: "disadvantage" },
              {
                stat: "ability_checks",
                value: -99,
                magnitudeType: "disadvantage",
              },
            ],
            mechanicsText:
              "Disadvantage on attack rolls and ability checks for 4 rounds",
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      specialMechanics: {
        venomancerBonus: {
          enabled: true,
          effect:
            "Venomancers add +1d6 to all blight damage and extend DoT duration by 2 rounds",
        },
        weaponPoison: {
          description:
            "This poison is applied to your weapon and affects the next attack",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["melee", "blight", "damage", "dot", "venomancer"],
    },

    { id : "tox_toxic_cloud",
      name: "Toxic Cloud",
      description:
        "Hurl a vial that bursts into a 20-foot cloud of choking blight, dealing 5d6 blight damage and leaving 2d6 blight searing their lungs each round for 4 rounds (Constitution DC 16 for half).",
      spellType: "ACTION",
      icon: "Poison/Acid Spray",
      level: 4,
      specialization: "venomancer",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "sphere",
        aoeSize: 20,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 4,
        durationUnit: "rounds",
      },

      resourceCost: {
        mana: 12,
        toxinVials: 3,
        actionPoints: 1,
        components: ["somatic", "material"],
        somaticText: "Throw vial at target location",
        materialText: "Concentrated toxin vial",
      },

      savingThrow: {
        enabled: true,
        attribute: "constitution",
        difficulty: 16,
        onSuccess: "half_damage",
        onFailure: "full_effect",
      },

      resolution: "SAVING_THROW",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "5d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        attackType: "spell_save",
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "2d6",
          duration: 4,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 16,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statReduction",
        effects: [
          { id : "weakened",
            name: "Weakened",
            description:
              "-2 to attack rolls, saves, and ability checks for 4 rounds",
            mechanicsText:
              "-2 to attack rolls, saves, and ability checks for 4 rounds",
            statModifier: {
              stat: "all_rolls",
              magnitude: -2,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "constitution",
        saveOutcome: "halves",
        canBeDispelled: true,
      },

      specialMechanics: {
        venomancerBonus: {
          enabled: true,
          effect:
            "Venomancers add +1d6 damage per round and extend duration by 2 rounds (total 6 rounds)",
        },
        persistentCloud: {
          description:
            "Cloud remains in place, affecting all creatures who enter or remain in the area",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["aoe", "blight", "damage", "debuff", "dot", "venomancer"],
    },

    // ===== GADGETEER SPECIALIZATION =====
    { id : "tox_poison_trap",
      name: "Poison Gas Trap",
      description:
        "Rig a contraption of salvaged glass and blight that bursts when a foe steps within 5 feet, dealing 2d6 blight damage and slowing them by 10 feet for 2 rounds.",
      spellType: "ACTION",
      icon: "Utility/Utility Tool",
      level: 2,
      specialization: "gadgeteer",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "sphere",
        aoeSize: 5,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 10,
        durationUnit: "minutes",
      },

      resourceCost: {
        contraptionParts: 1,
        classResource: { type: "contraption_parts", cost: 1 },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Deploy contraption on ground",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "2d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "slowed",
            name: "Slowed",
            description: "Movement speed reduced by 10 feet for 2 rounds",
            mechanicsText: "Movement speed reduced by 10 feet for 2 rounds",
            statusType: "slowed",
            level: "moderate",
            statPenalty: { stat: "movement_speed", value: -10 },
            movementPenalty: -10,
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect:
            "Gadgeteers add +1d6 damage, +5ft trigger radius (total 10ft), and can deploy for 1 AP",
        },
        contraptionPersistence: {
          description: "Trap remains active until triggered or 10 minutes pass",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["trap", "blight", "damage", "debuff", "gadgeteer"],
    },

    { id : "tox_contraption_network",
      name: "Contraption Network",
      description:
        "Link all your active contraptions. When one triggers, all activate simultaneously for devastating combos.",
      spellType: "ACTION",
      icon: "Utility/Utility Tool",
      level: 5,
      specialization: "gadgeteer",

      typeConfig: {
        school: "smashing",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        rangeDistance: 0,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
        durationUnit: "minutes",
      },

      resourceCost: {
        mana: 15,
        contraptionParts: 4,
        actionPoints: 2,
        components: ["somatic", "verbal"],
        verbalText: "Activate network protocol!",
        somaticText: "Link contraptions with arcane energy",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["utility"],

      utilityConfig: {
        utilityType: "trap",
        selectedEffects: [
          { id: "contraption_network", name: "Contraption Network", description: "Link all active contraptions. When one triggers, all activate simultaneously. Enemies caught in multiple effects take full damage from each and have disadvantage on all saves." },
        ],
        duration: 5,
        durationUnit: "minutes",
        concentration: false,
        power: "major",
      },

      effects: {
        network: {
          description:
            "All active contraptions are linked. When one triggers, all others activate simultaneously.",
          maxContraptions: 4,
          duration: "5 minutes",
        },
        chainReaction: {
          description:
            "Enemies caught in multiple contraption effects take full damage from each and have disadvantage on all saves",
        },
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect:
            "Gadgeteers can link up to 5 contraptions (instead of 4) and network lasts 10 minutes",
        },
        tacticalSynergy: {
          description:
            "Combine different contraption types for varied effects (poison + spike + acid = devastating combo)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["utility", "contraption", "combo", "gadgeteer"],
    },

    { id : "tox_overcharged_trap",
      name: "Overcharged Trap",
      description:
        "Deploy a supercharged contraption that erupts in a 15-foot blast of ember, dealing 8d6 ember damage, corroding 3 armor, and leaving 1d6 ember burning per round for 3 rounds (Agility DC 17 for half).",
      spellType: "ACTION",
      icon: "Utility/Utility Tool",
      level: 6,
      specialization: "gadgeteer",

      typeConfig: {
        school: "ember",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "sphere",
        aoeSize: 15,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 10,
        durationUnit: "minutes",
      },

      resourceCost: {
        mana: 18,
        contraptionParts: 3,
        actionPoints: 2,
        components: ["somatic", "material"],
        somaticText: "Deploy overcharged contraption",
        materialText: "Enhanced contraption parts",
      },

      savingThrow: {
        enabled: true,
        attribute: "agility",
        difficulty: 17,
        onSuccess: "half_damage",
        onFailure: "full_effect",
      },

      resolution: "SAVING_THROW",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "8d6 + intelligence",
        elementType: "ember",
        damageTypes: ["ember"],
        attackType: "spell_save",
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "1d6",
          duration: 3,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 17,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statReduction",
        effects: [
           { id : "burned",
             name: "Burned",
             description:
               "DR reduced by 3 and takes 1d6 ember damage per round for 3 rounds.",
             mechanicsText:
               "-3 DR and 1d6 ember damage per round for 3 rounds",
           },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      specialMechanics: {
        gadgeteerBonus: {
          enabled: true,
          effect: "Gadgeteers add +2d8 damage and +5ft radius (total 20ft)",
        },
        explosiveForce: {
          description: "Enemies are knocked prone on a failed save.",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["trap", "ember", "damage", "debuff", "aoe", "gadgeteer"],
    },

    // ===== SABOTEUR SPECIALIZATION =====
    { id : "tox_crippling_toxin",
      name: "Crippling Toxin",
      description:
        "Apply a debilitating poison that deals 3d6 blight damage and withers the target for 5 rounds: -4 to attack, -2 armor, -10 feet of movement, and disadvantage on saves (Constitution DC 16 for reduced penalties).",
      spellType: "ACTION",
      icon: "Utility/Hide",
      level: 3,
      specialization: "saboteur",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 5,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        toxinVials: 2,
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Apply crippling poison to weapon",
      },

      savingThrow: {
        enabled: true,
        attribute: "constitution",
        difficulty: 16,
        onSuccess: "half_penalties",
        onFailure: "full_effect",
      },

      resolution: "ATTACK_ROLL",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "3d6 + agility",
        elementType: "blight",
        damageTypes: ["blight"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statReduction",
        effects: [
          { id : "crippled",
            name: "Crippled",
            description:
              "-4 attack rolls, -2 armor, -10ft movement, disadvantage on saves for 5 rounds.",
            mechanicsText:
              "-4 attack rolls, -2 armor, -10ft movement, disadvantage on saves for 5 rounds",
            statModifier: {
              stat: "attack_rolls",
              magnitude: -4,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 16,
        saveType: "constitution",
        saveOutcome: "halves",
        canBeDispelled: true,
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect:
            "Saboteurs extend duration by 2 rounds (total 7 rounds) and debuffs require coin flip (heads) to dispel",
        },
        stackingDebuffs: {
          description:
            "Can stack with other debuff effects for devastating combinations",
        },
      },

      tags: ["melee", "blight", "debuff", "saboteur"],
    },

    { id : "tox_chaos_grenade",
      name: "Chaos Grenade",
      description:
        "Throw a grenade of mingled blight and ember that deals 5d6 blight plus 3d8 ember damage in a 20-foot burst, leaving survivors confused and attacking at random for 2 rounds (Intelligence DC 17 negates confusion).",
      spellType: "ACTION",
      icon: "Utility/Orange Bomb",
      level: 5,
      specialization: "saboteur",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "sphere",
        aoeSize: 20,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        mana: 15,
        toxinVials: 3,
        contraptionParts: 1,
        actionPoints: 2,
        components: ["somatic", "material"],
        somaticText: "Throw chaos grenade",
        materialText: "Alchemical explosive",
      },

      savingThrow: {
        enabled: true,
        attribute: "intelligence",
        difficulty: 17,
        onSuccess: "damage_only",
        onFailure: "full_effect",
      },

      resolution: "SAVING_THROW",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "5d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        additionalDamage: {
          formula: "3d8",
          elementType: "ember",
        },
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 17,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "mind_control",
        duration: 2,
        durationUnit: "rounds",
        saveDC: 17,
        saveType: "constitution",
        savingThrow: true,
        effects: [
          { id : "confused",
            name: "Confused",
            description: "Attack random target (ally or enemy) for 2 rounds",
            mechanicsText:
              "Confused targets attack random targets for 2 rounds, INT save DC 17 to negate",
            config: {
              confusionType: "random_target",
              saveType: "constitution",
              saveDC: 14,
              duration: 2,
              durationUnit: "rounds",
            },
          },
        ],
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect:
            "Saboteurs extend confusion duration by 1 round and add -2 to all saves for affected enemies",
        },
        randomTargeting: {
          description:
            "Confused enemies roll 1d8 to determine attack target (1-4 = ally, 5-8 = enemy)",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["aoe", "blight", "ember", "damage", "confusion", "saboteur"],
    },

    { id : "tox_total_shutdown",
      name: "Total Shutdown",
      description:
        "Flood the target with a rare neurotoxin that shuts down their body for 1 round - they can only react, lose 3 armor, and suffer disadvantage on all saves (Constitution DC 19 for a reduced effect).",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 7,
      specialization: "saboteur",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "rounds",
      },

      resourceCost: {
        mana: 21,
        toxinVials: 4,
        contraptionParts: 2,
        actionPoints: 2,
        components: ["verbal", "somatic", "material"],
        verbalText: "Total system failure!",
        somaticText: "Inject shutdown toxin",
        materialText: "Rare neurotoxin compound",
      },

      savingThrow: {
        enabled: true,
        attribute: "constitution",
        difficulty: 19,
        onSuccess: "reduced_duration",
        onFailure: "full_effect",
      },

      resolution: "SAVING_THROW",
      effectTypes: ["control"],

      controlConfig: {
        controlType: "incapacitation",
        duration: 1,
        durationUnit: "rounds",
        saveDC: 19,
        saveType: "constitution",
        savingThrow: true,
        effects: [
          { id : "total_shutdown",
            name: "Total Shutdown",
            description:
              "Severely poisoned: -3 armor, disadvantage on all saves and attack rolls, halved movement for 1 round. Target can still act but is greatly impaired.",
            mechanicsText:
              "No actions (reactions only), -3 armor, disadvantage on all saves for 1 round, CON save DC 19",
            statusType: "severely_poisoned",
            saveType: "constitution",
            saveDC: 19,
            duration: 1,
            durationUnit: "rounds",
            stun: false,
          },
        ],
      },

      specialMechanics: {
        saboteurBonus: {
          enabled: true,
          effect:
            "Saboteurs increase save DC by +2 (total DC 21) and target takes 2d8 blight damage per round while incapacitated",
        },
        ultimateDebuff: {
          description:
            "This is the ultimate debuff ability - use strategically on high-priority targets",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["single target", "debuff", "incapacitate", "ultimate", "saboteur"],
    },

    // ===== UNIVERSAL ABILITIES =====
    { id : "tox_apply_poison",
      name: "Apply Weapon Poison",
      description:
        "Apply a poison to your weapon for 1 AP. The poison lasts for 3 attacks or until end of combat.",
      spellType: "ACTION",
      icon: "Utility/Strange Brew",
      level: 1,
      specialization: "universal",

      typeConfig: {
        school: "blight",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        rangeDistance: 0,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
        durationUnit: "attacks",
      },

      resourceCost: {
        toxinVials: 1,
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Apply poison to weapon",
      },

      resolution: "AUTOMATIC",

      effects: {
        weaponEnhancement: {
          duration: "3 attacks or end of combat",
          poisonTypes: [
            "Neurotoxin (+1d8 poison, -2 attack)",
            "Hemotoxin (1d6/round for 3 rounds)",
            "Cytotoxin (2d6 necrotic, -1d4 max HP)",
            "Myotoxin (1d6 poison, -10ft movement)",
            "Cardiotoxin (2d8 poison, stun on failed save)",
          ],
          description: "Choose one poison type when applying",
        },
      },

      specialMechanics: {
        quickCrafting: {
          description:
            "Can be used for 1 AP, allowing you to apply poison and attack in the same turn",
        },
        poisonChoice: {
          description:
            "Choose from 5 different poison types based on tactical needs",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility", "blight", "weapon enhancement", "universal"],
    },

    { id : "tox_antidote",
      name: "Antidote",
      description:
        "Quickly craft and administer an antidote to cure poison or disease.",
      spellType: "ACTION",
      icon: "Poison/Poison Flask",
      level: 1,
      specialization: "universal",

      typeConfig: {
        school: "primal",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        toxinVials: 1,
        actionPoints: 1,
        components: ["somatic", "material"],
        somaticText: "Administer antidote",
        materialText: "Purifying reagents",
      },

      resolution: "AUTOMATIC",
      effectTypes: ["buff", "utility"],

      utilityConfig: {
        utilityType: "cure",
        cures: ["blight", "disease"],
        description: "Cure all poison and disease effects",
        charges: 1,
        mechanicsText: "Cure all poison and disease effects",
      },

      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "poison_resistance",
            name: "Poison Resistance",
            description: "+2 to Constitution saves vs poison for 1 hour",
            statModifier: {
              stat: "constitution_saves",
              magnitude: 2,
              magnitudeType: "flat",
              condition: "vs_poison",
            },
          },
        ],
        durationValue: 1,
        durationType: "hours",
        durationUnit: "hours",
        canBeDispelled: false,
      },

      specialMechanics: {
        emergencyHealing: {
          description:
            "Can be used on self or allies for 1 AP for quick emergency response",
        },
        preventative: {
          description:
            "Grants temporary poison resistance even if target is not currently poisoned",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility", "healing", "cure", "universal"],
    },

    { id : "tox_explosive_concoction",
      name: "Explosive Concoction",
      description:
        "Mix and hurl a volatile concoction that detonates in a 10-foot blast for 3d6 ember damage (Agility DC 15 for half).",
      spellType: "ACTION",
      icon: "Utility/Bomb",
      level: 3,
      specialization: "universal",

      typeConfig: {
        school: "ember",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeType: "sphere",
        aoeSize: 10,
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        toxinVials: 3,
        actionPoints: 1,
        components: ["somatic", "material"],
        somaticText: "Throw explosive vial",
        materialText: "Volatile alchemical mixture",
      },

      savingThrow: {
        enabled: true,
        attribute: "agility",
        difficulty: 15,
        onSuccess: "half_damage",
        onFailure: "full_damage",
      },

      resolution: "SAVING_THROW",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "3d6 + intelligence",
        elementType: "ember",
        damageTypes: ["ember"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "agility",
          difficultyClass: 15,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        resolution: "DICE",
      },

      specialMechanics: {
        versatileUse: {
          description:
            "Can be used for damage, destroying obstacles, or creating environmental hazards",
        },
        craftingSpeed: {
          description: "Crafted and thrown as a single action",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["aoe", "ember", "damage", "explosive", "universal"],
    },

    { id : "tox_smoke_bomb",
      name: "Smoke Bomb",
      description:
        "Deploy a smoke bomb that obscures vision and provides cover.",
      spellType: "ACTION",
      icon: "Utility/Hide",
      level: 2,
      specialization: "universal",

      typeConfig: {
        school: "smashing",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 20,
        aoeType: "sphere",
        aoeSize: 15,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        toxinVials: 1,
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Throw smoke bomb",
      },

      resolution: "AUTOMATIC",

      effects: {
        obscurement: {
          type: "heavy_obscurement",
          radius: 15,
          duration: "3 rounds",
          description: "Area is heavily obscured, blocking vision",
        },
        tactical: {
          effects: [
            { id : "smoke_disadvantage",
              name: "Smoke Disadvantage",
              description: "Attacks through smoke have disadvantage",
              mechanicsText: "Attacks through smoke have disadvantage",
            },
            { id : "smoke_cover",
              name: "Smoke Cover",
              description: "Can use to escape or reposition",
              mechanicsText: "Provides cover for escape and repositioning",
            },
            { id : "smoke_ally_cover",
              name: "Ally Cover",
              description: "Provides cover for allies",
              mechanicsText: "Allies in smoke area have cover",
            },
          ],
          description:
            "Disrupts enemy vision and positioning for tactical advantage.",
        },
      },

      specialMechanics: {
        quickDeployment: {
          description:
            "Deployed for 1 AP, allowing you to create cover and take other actions",
        },
        versatileUtility: {
          description:
            "Use for escape, repositioning, protecting allies, or disrupting enemy vision",
        },
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility", "obscurement", "tactical", "universal"],
    },

    // ========================================
    // LEVEL 8 SPELLS
    // ========================================
    { id : "tox_pandemic",
      name: "Pandemic",
      description:
        "Uncork a plague that deals 12d6 blight damage, then spreads to any enemy within 10 feet at the start of their turn, dealing 3d6 blight per round and draining 4 Constitution for 5 rounds (Constitution DC 18 for half).",
      level: 8,
      spellType: "ACTION",
      icon: "Poison/Poison Plague",
      specialization: "venomancer",

      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Plague",
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
        durationType: "rounds",
        duration: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: { mana: 24, toxinVials: 3 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Release plague vial",
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "12d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        spreadMechanic:
          "Spreads to enemies within 10 feet at start of their turn",
        criticalConfig: {
          critType: "effect",
          critEffects: ["pandemic_spread"],
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "disease",
        effects: [
          { id : "pandemic_plague",
            name: "Pandemic Plague",
            description:
              "Takes blight damage at start of turn. Spreads to nearby enemies. -4 to Constitution.",
            mechanicsText:
              "3d6 blight damage per turn, spreads to enemies within 10ft, -4 Constitution for 5 rounds",
            damageFormula: "3d6",
            dotFormula: "3d6",
            dotDamageType: "blight",
            damagePerTurn: "3d6",
            statPenalty: { stat: "constitution", value: -4 },
          },
        ],
        durationValue: 5,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 18,
        saveType: "constitution",
        saveOutcome: "halves_damage",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: [
        "damage",
        "debuff",
        "spreading",
        "blight",
        "level 8",
        "toxicologist",
      ],
    },

    { id : "tox_mechanical_monstrosity",
      name: "Mechanical Monstrosity",
      description:
        "Salvage and animate a Large mechanical monstrosity (80 HP, 18 armor) that fights at your command for 5 rounds, smashing foes for 4d10 or loosing missiles for 3d8 in a 15-foot spread.",
      level: 8,
      spellType: "ACTION",
      icon: "Utility/Utility Tool",
      specialization: "gadgeteer",

      typeConfig: {
        school: "arcane",
        icon: "Utility/Utility Tool",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Activate construct",
      },

      resolution: "NONE",
      effectTypes: ["summoning"],

      summoningConfig: {
        creatures: [
          { id : "mechanical_monstrosity",
            name: "Mechanical Monstrosity",
            description: "A large mechanical construct armed with weapons",
            size: "Large",
            type: "construct",
            stats: {
              maxHp: 80,
              armor: 18,
              maxMana: 0,
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              abilities:
                "Can attack for 4d10 damage or launch missiles for 3d8 damage in 15ft radius",
            },
          },
        ],
        duration: 5,
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      tags: ["summoning", "construct", "level 8", "toxicologist"],
    },

    { id : "tox_sabotage_supreme",
      name: "Sabotage Supreme",
      description:
        "Trigger synchronized sabotage across a 25-foot radius: every enemy deals half damage, suffers -5 to hit, and feels their own gear turn against them for 3 rounds (Agility DC 18 halves the duration).",
      level: 8,
      spellType: "ACTION",
      icon: "Piercing/Dagger Whirl",
      specialization: "saboteur",

      typeConfig: {
        school: "wyrd",
        icon: "Piercing/Dagger Whirl",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 25 },
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 32 },
        actionPoints: 2,
        components: ["somatic"],
        somaticText: "Trigger sabotage devices",
      },

      resolution: "NONE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "sabotage",
        effects: [
          { id : "supreme_sabotage",
            name: "Supreme Sabotage",
            description:
              "Enemies deal half damage, have -5 to hit, and all their gear malfunctions",
            statPenalty: [
              { stat: "damage", value: -50, magnitudeType: "percentage" },
              { stat: "attack", value: -5 },
            ],
            mechanicsText: "Half damage, -5 to hit, gear malfunctions",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 18,
        saveType: "agility",
        saveOutcome: "halves_duration",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },

      tags: ["debuff", "aoe", "sabotage", "level 8", "toxicologist"],
    },

    // ========================================
    // LEVEL 9 SPELLS
    // ========================================
    { id : "tox_extinction_toxin",
      name: "Extinction Toxin",
      description:
        "Inject the ultimate blight - a toxin so concentrated it ignores poison immunity entirely, dealing 18d6 blight damage (Constitution DC 20 for half).",
      level: 9,
      spellType: "ACTION",
      icon: "Necrotic/Death Mark",
      specialization: "venomancer",

      typeConfig: {
        school: "blight",
        icon: "Necrotic/Death Mark",
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
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: { mana: 27, toxinVials: 5 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Inject extinction toxin",
      },

      resolution: "DICE",
      effectTypes: ["damage"],

      damageConfig: {
        formula: "18d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 20,
          saveOutcome: "halves",
        },
        specialRules:
          "Ignores poison immunity. Creatures with poison resistance take full damage.",
        criticalConfig: {
          critType: "effect",
          critEffects: ["instant_death", "poison_immunity_break"],
        },
        resolution: "DICE",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "blight", "ultimate", "level 9", "toxicologist"],
    },

    { id : "tox_war_machine",
      name: "War Machine",
      description:
        "Deploy a Huge war machine (150 HP, 22 armor) bristling with weapons for 5 rounds - it crushes for 6d10, lobs artillery for 8d8 in a 30-foot radius, or projects shields granting allies +5 DR.",
      level: 9,
      spellType: "ACTION",
      icon: "Utility/Utility Tool",
      specialization: "gadgeteer",

      typeConfig: {
        school: "arcane",
        icon: "Utility/Utility Tool",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Deploy war machine",
      },

      resolution: "NONE",
      effectTypes: ["summoning"],

      summoningConfig: {
        creatures: [
          { id : "war_machine",
            name: "War Machine",
            description: "A massive war machine bristling with weapons",
            size: "Huge",
            type: "construct",
            stats: {
              maxHp: 150,
              armor: 22,
              maxMana: 0,
            },
            config: {
              quantity: 1,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "mental",
              abilities:
                "Can attack for 6d10 damage, launch artillery for 8d8 in 30ft radius, or deploy shields for +5 DR to allies",
            },
          },
        ],
        duration: 5,
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["summoning", "construct", "ultimate", "level 9", "toxicologist"],
    },

    { id : "tox_total_system_failure",
      name: "Total System Failure",
      description:
        "Trigger total system failure across a 40-foot radius - magic items fall inert, buffs unravel, foes cannot cast for 1 round, and all suffer -10 DR for 3 rounds (Spirit DC 19 halves the duration).",
      level: 9,
      spellType: "ACTION",
      icon: "Social/Careful Blunder",
      specialization: "saboteur",

      typeConfig: {
        school: "wyrd",
        icon: "Social/Careful Blunder",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 90,
        aoeShape: "circle",
        aoeParameters: { radius: 40 },
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "rounds",
        duration: 3,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 36 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Trigger total failure",
      },

      resolution: "NONE",
      effectTypes: ["debuff"],

      debuffConfig: {
        debuffType: "system_failure",
        effects: [
          { id : "total_system_failure",
            name: "Total System Failure",
            description:
              "All enemy magical items stop working. All buffs are removed. Cannot cast spells for 1 round. -10 DR.",
            statPenalty: [
              { stat: "spellcasting", value: -99, magnitudeType: "blocked" },
            ],
            mechanicsText:
              "All magic items stop working, buffs removed, no spells for 1 round, -10 DR",
          },
        ],
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        saveDC: 19,
        saveType: "spirit",
        saveOutcome: "halves_duration",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["debuff", "aoe", "dispel", "ultimate", "level 9", "toxicologist"],
    },

    // ========================================
    // LEVEL 10 SPELLS
    // ========================================
    { id : "tox_apocalypse_plague",
      name: "Apocalypse Plague",
      description:
        "Unleash a plague of apocalyptic virulence across a 100-foot radius, dealing 22d6 blight damage and leaving 4d10 blight seeping from every vein each round as it spreads without end (Constitution DC 22 for half).",
      level: 10,
      spellType: "ACTION",
      icon: "Poison/Poison Plague",
      specialization: "universal",

      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Plague",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "self_centered",
        aoeShape: "circle",
        aoeParameters: { radius: 100 },
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "minutes",
        duration: 1,
        durationUnit: "minutes",
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: { mana: 30, toxinVials: "all" },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Release the apocalypse plague",
      },

      resolution: "DICE",
      effectTypes: ["damage", "debuff"],

      damageConfig: {
        formula: "22d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 22,
          saveOutcome: "halves",
        },
        criticalConfig: {
          critType: "effect",
          critEffects: ["apocalypse_stun", "plague_worldwide"],
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "plague",
        effects: [
          { id : "apocalypse_plague",
            name: "Apocalypse Plague",
            description:
              "All enemies are poisoned, weakened, and take ongoing damage. Spreads infinitely between enemies.",
            dotFormula: "4d10",
            dotDamageType: "blight",
            damagePerTurn: "4d10",
            statPenalty: { stat: "all_stats", value: -4 },
            mechanicsText:
              "Poisoned, weakened, ongoing damage, spreads infinitely",
          },
        ],
        durationValue: 1,
        durationType: "minutes",
        durationUnit: "minutes",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: ["damage", "debuff", "aoe", "ultimate", "level 10", "toxicologist"],
    },

    { id : "tox_mechanical_army",
      name: "Mechanical Army",
      description:
        "Raise an army of eight mechanical soldiers (40 HP, 16 armor each) across a 30-foot radius, each striking for 2d10 damage over 5 rounds of relentless advance.",
      level: 10,
      spellType: "ACTION",
      icon: "Utility/Strange Brew",
      specialization: "gadgeteer",

      typeConfig: {
        school: "arcane",
        icon: "Utility/Strange Brew",
        castTime: 2,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "circle",
        aoeParameters: { radius: 30 },
      },

      durationConfig: {
        durationType: "rounds",
        duration: 5,
        durationUnit: "rounds",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Activate mechanical army",
      },

      resolution: "NONE",
      effectTypes: ["summoning"],

      summoningConfig: {
        creatures: [
          { id : "mechanical_soldier",
            name: "Mechanical Soldier",
            description: "A combat-ready mechanical soldier",
            size: "Medium",
            type: "construct",
            stats: {
              maxHp: 40,
              armor: 16,
              maxMana: 0,
            },
            config: {
              quantity: 8,
              duration: 5,
              durationUnit: "rounds",
              hasDuration: true,
              concentration: false,
              controlType: "autonomous",
              abilities: "Attacks for 2d10 damage each",
            },
          },
        ],
        duration: 5,
        durationUnit: "rounds",
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: [
        "summoning",
        "army",
        "construct",
        "ultimate",
        "level 10",
        "toxicologist",
      ],
    },

    { id : "tox_reality_bomb",
      name: "Reality Bomb",
      description:
        "Detonate the ultimate sabotage device - a 50-foot blast dealing 22d6 storm damage that tears reality apart, leaving survivors disoriented for 1 round and suppressing all magic in the area for 1 minute (Constitution DC 22 for half).",
      level: 10,
      spellType: "ACTION",
      icon: "Poison/Poison Contagion",
      specialization: "saboteur",

      typeConfig: {
        school: "arcane",
        icon: "Poison/Poison Contagion",
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 120,
        aoeShape: "circle",
        aoeParameters: { radius: 50 },
      },

      durationConfig: {
        durationType: "instant",
      },

      resourceCost: {
        resourceTypes: ["mana"],
        resourceValues: { mana: 40 },
        actionPoints: 3,
        components: ["somatic"],
        somaticText: "Detonate reality bomb",
      },

      resolution: "DICE",
      effectTypes: ["damage", "control"],

      damageConfig: {
        formula: "22d6 + intelligence",
        elementType: "storm",
        damageTypes: ["storm"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 22,
          saveOutcome: "halves",
        },
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "disoriented",
        duration: 1,
        durationUnit: "rounds",
        effects: [
          { id: "reality_disorientation", name: "Reality Disorientation", description: "Disadvantage on all rolls for 1 round. All magic in the area is suppressed for 1 minute and terrain becomes unstable." },
        ],
        savingThrow: {
          ability: "constitution",
          difficultyClass: 22,
          saveOutcome: "negates",
        },
      },

      specialMechanics: {
        realityBomb: {
          description:
            "All magic in the area is suppressed for 1 minute. All creatures are disoriented (disadvantage on all rolls for 1 round). Terrain becomes unstable.",
          antiMagic: true,
          duration: "1 minute",
        },
      },

      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },

      tags: [
        "damage",
        "control",
        "anti magic",
        "ultimate",
        "level 10",
        "toxicologist",
      ],
    },

    // ADDITIONAL LEVEL 1 SPELLS
    { id : "tox_poison_dart",
      name: "Poison Dart",
      description:
        "Fire a poison dart that deals 1d6 blight damage plus your Intelligence modifier and weakens the target (-1 to attack for 1 round).",
      level: 1,
      spellType: "ACTION",
      icon: "Piercing/Thrown Dagger",
      effectTypes: ["damage", "debuff"],
      specialization: "universal",

      typeConfig: {
        school: "arcane",
        icon: "Piercing/Thrown Dagger",
        tags: ["damage", "blight", "dart", "universal"],
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

      durationConfig: {
        durationType: "instant",
      },

      damageConfig: {
        formula: "1d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statReduction",
        effects: [
          { id : "weakened_dart",
            name: "Weakened",
            description: "-1 to attack rolls for 1 round",
            mechanicsText: "-1 to attack rolls for 1 round",
            statModifier: {
              stat: "attack_rolls",
              magnitude: -1,
              magnitudeType: "flat",
            },
          },
        ],
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 2,
          toxinVials: 1,
        },
        actionPoints: 1,
        components: ["somatic"],
        somaticText: "Fire poison dart from wrist launcher",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",
      tags: ["damage", "blight", "dart", "universal"],
    },

    { id : "tox_noxious_fumes",
      name: "Noxious Fumes",
      description:
        "Create a small toxic cloud that deals 1d6 blight damage to enemies in a 10-foot radius, then lingers for 2 rounds dealing 1d4 blight each round.",
      level: 1,
      spellType: "ACTION",
      icon: "Poison/Poison Plague",
      effectTypes: ["damage"],
      specialization: "universal",

      typeConfig: {
        school: "arcane",
        icon: "Poison/Poison Plague",
        tags: ["damage", "blight", "zone", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 30,
        aoeShape: "circle",
        aoeParameters: { radius: 10 },
      },

      durationConfig: {
        durationType: "rounds",
        duration: 2,
        durationUnit: "rounds",
      },

      damageConfig: {
        formula: "1d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "1d4",
          duration: 2,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 2,
          toxinVials: 1,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Exhale the wasting breath",
        somaticText: "Crush noxious reagents between palms",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "DICE",
      tags: ["damage", "blight", "zone", "universal"],
    },

    { id : "tox_purifying_antidote",
      name: "Purifying Antidote",
      description:
        "Create an antidote that removes all poison effects from an ally.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Cure Within",
      effectTypes: ["purification"],
      specialization: "universal",

      typeConfig: {
        school: "primal",
        icon: "Healing/Cure Within",
        tags: ["purification", "healing", "antidote", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "single",
        rangeType: "touch",
        rangeDistance: 5,
        targetRestrictions: ["ally"],
        maxTargets: 1,
      },

      durationConfig: {
        durationType: "instant",
      },

      purificationConfig: {
        purificationType: "cleanse",
        cleansesTypes: ["blight"],
        dispelStrength: "moderate",
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 2,
          toxinVials: 1,
        },
        actionPoints: 1,
        components: ["verbal", "somatic", "material"],
        verbalText: "Drink deep the cup of clearing",
        somaticText: "Press purifying compound to ally's lips",
        materialText: "Purifying reagents and clean water",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },

      resolution: "DICE",
      tags: ["purification", "healing", "antidote", "universal"],
    },

    // ADDITIONAL LEVEL 3 SPELLS
    { id : "tox_venom_blast",
      name: "Venom Blast",
      description:
        "Strike with concentrated venom for 4d6 blight damage that eats through the target's armor, corroding it by 2 for 2 rounds.",
      level: 3,
      spellType: "ACTION",
      icon: "Poison/Deadly Poison",
      effectTypes: ["damage", "debuff"],
      specialization: "universal",

      typeConfig: {
        school: "blight",
        icon: "Poison/Deadly Poison",
        tags: ["damage", "blight", "venom", "universal"],
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

      durationConfig: {
        durationType: "instant",
      },

      damageConfig: {
        formula: "4d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statReduction",
        effects: [
          { id : "venom_blast_armor",
            name: "DR Corrosion",
            description: "-2 armor for 2 rounds",
            mechanicsText: "-2 armor for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 8,
          toxinVials: 1,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Corrode and consume!",
        somaticText: "Hurl concentrated venom at target",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },

      resolution: "DICE",
      tags: ["damage", "blight", "venom", "universal"],
    },

    { id : "tox_toxic_shock",
      name: "Toxic Shock",
      description:
        "Shock an enemy with concentrated toxins for 3d6 blight damage, leaving them nauseated - disadvantage on attacks and checks, halved movement - for 1 round (Constitution DC 16 to resist).",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Screaming Skull",
      effectTypes: ["damage", "control"],
      specialization: "universal",

      typeConfig: {
        school: "blight",
        icon: "Necrotic/Screaming Skull",
        tags: ["damage", "blight", "control", "stun", "universal"],
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

      durationConfig: {
        durationType: "rounds",
        duration: 1,
        durationUnit: "rounds",
      },

      damageConfig: {
        formula: "3d6",
        elementType: "blight",
        damageTypes: ["blight"],
        resolution: "DICE",
      },

      controlConfig: {
        controlType: "incapacitation",
        duration: 1,
        durationUnit: "rounds",
        saveDC: 15,
        saveType: "constitution",
        savingThrow: true,
        effects: [
          { id : "toxic_shock",
            name: "Toxic Shock",
            mechanicsText: "Nauseated for 1 round (disadvantage on attacks/checks, halved movement), CON save DC 16 to resist",
            config: {
              effectType: "nauseated",
              saveType: "constitution",
              saveDC: 16,
              duration: 1,
              durationUnit: "rounds",
            },
            },
        ],
      },
      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 8,
          toxinVials: 2,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Grip and wrench the gut!",
        somaticText: "Channel concentrated toxin through gesture",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "DICE",
      tags: ["damage", "blight", "control", "stun", "universal"],
    },

    // ADDITIONAL LEVEL 4 SPELL
    { id : "tox_poison_bomb",
      name: "Poison Bomb",
      description:
        "Throw a poison bomb that bursts in a 20-foot radius for 5d6 blight damage and corrodes 1 armor from every enemy caught in the cloud for 2 rounds (Constitution DC 16 for half).",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Orb Manipulation",
      effectTypes: ["damage", "debuff"],
      specialization: "universal",

      typeConfig: {
        school: "arcane",
        icon: "Arcane/Orb Manipulation",
        tags: ["damage", "blight", "aoe", "bomb", "universal"],
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

      durationConfig: {
        durationType: "instant",
      },

      damageConfig: {
        formula: "5d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        savingThrowConfig: {
          enabled: true,
          savingThrowType: "constitution",
          difficultyClass: 16,
          saveOutcome: "halves",
          partialEffect: true,
          partialEffectFormula: "damage/2",
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statReduction",
        effects: [
          { id : "poison_bomb_corrosion",
            name: "Corroded",
            description: "-1 armor for 2 rounds",
            mechanicsText: "-1 armor for 2 rounds",
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 10,
          toxinVials: 2,
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Shatter and spread!",
        somaticText: "Lob poison bomb at target location",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },

      resolution: "DICE",
      tags: ["damage", "blight", "aoe", "bomb", "universal"],
    },

    // ADDITIONAL LEVEL 5 SPELL
    { id : "tox_deadly_toxin",
      name: "Deadly Toxin",
      description: "Apply a deadly toxin that deals 6d8 blight damage, then 1d8 blight each round for 5 rounds as the victim's blood thins to water.",
      level: 5,
      spellType: "ACTION",
      icon: "Poison/Poison Venom",
      effectTypes: ["damage"],
      specialization: "universal",

      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Venom",
        tags: ["damage", "blight", "dot", "deadly", "universal"],
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

      durationConfig: {
        durationType: "rounds",
        duration: 5,
        durationUnit: "rounds",
      },

      damageConfig: {
        formula: "6d8",
        elementType: "blight",
        damageTypes: ["blight"],
        hasDotEffect: true,
        dotConfig: {
          dotFormula: "1d8",
          duration: 5,
          tickFrequency: "turn",
          isProgressiveDot: false,
        },
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 12,
          toxinVials: 2,
        },
        actionPoints: 1,
        components: ["verbal", "somatic"],
        verbalText: "Thin the blood to water",
        somaticText: "Apply deadly toxin to weapon or projectile",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resolution: "DICE",
      tags: ["damage", "blight", "dot", "deadly", "universal"],
    },

    // ADDITIONAL LEVEL 6 SPELL
    { id : "tox_toxic_wave",
      name: "Toxic Wave",
      description:
        "Send a 60-foot wave of toxic blight dealing 7d6 damage and slowing every enemy caught in its path by 10 feet for 2 rounds.",
      level: 6,
      spellType: "ACTION",
      icon: "Poison/Acid Splash",
      effectTypes: ["damage", "debuff"],
      specialization: "universal",

      typeConfig: {
        school: "blight",
        icon: "Poison/Acid Splash",
        tags: ["damage", "blight", "line", "wave", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "area",
        rangeType: "ranged",
        rangeDistance: 60,
        aoeShape: "line",
        aoeParameters: { length: 60, width: 10 },
        targetRestrictions: ["enemy"],
      },

      durationConfig: {
        durationType: "instant",
      },

      damageConfig: {
        formula: "7d6 + intelligence",
        elementType: "blight",
        damageTypes: ["blight"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["poison_burn"],
        },
        resolution: "DICE",
      },

      debuffConfig: {
        debuffType: "statusEffect",
        effects: [
          { id : "toxic_wave_slow",
            name: "Slowed",
            description: "Movement speed reduced by 10 feet for 2 rounds",
            mechanicsText: "Movement speed reduced by 10 feet for 2 rounds",
            statusType: "slowed",
            level: "minor",
            statPenalty: { stat: "movement_speed", value: -10 },
            movementPenalty: -10,
          },
        ],
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        canBeDispelled: true,
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 14,
          toxinVials: 2,
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Rise and overwhelm!",
        somaticText: "Sweep both arms forward, releasing the wave",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },

      resolution: "DICE",
      tags: ["damage", "blight", "line", "wave", "universal"],
    },

    // ADDITIONAL LEVEL 7 SPELL
    { id : "tox_virulent_plague",
      name: "Virulent Plague",
      description:
        "Release a virulent plague that leaps between up to six enemies within 20 feet of each other, dealing 10d6 blight damage as it jumps.",
      level: 7,
      spellType: "ACTION",
      icon: "Poison/Poison Contagion",
      effectTypes: ["damage"],
      specialization: "universal",

      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Contagion",
        tags: ["damage", "blight", "spreading", "plague", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE",
      },

      targetingConfig: {
        targetingType: "chain",
        rangeType: "ranged",
        rangeDistance: 50,
        targetRestrictions: ["enemy"],
        maxTargets: 6,
        chainDistance: 20,
      },

      durationConfig: {
        durationType: "instant",
      },

      damageConfig: {
        formula: "10d6",
        elementType: "blight",
        damageTypes: ["blight"],
        criticalConfig: {
          critType: "effect",
          critEffects: ["plague_spread"],
        },
        resolution: "DICE",
      },

      resourceCost: {
        resourceTypes: ["mana", "toxinVials"],
        resourceValues: {
          mana: 16,
          toxinVials: 3,
        },
        actionPoints: 2,
        components: ["verbal", "somatic"],
        verbalText: "Spread, leap, consume!",
        somaticText: "Release plague vial and direct its leap",
      },

      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },

      resolution: "DICE",
      tags: ["damage", "blight", "spreading", "plague", "universal"],
    },

    {
      id : "tox_vial_dependency",
      name: "Vial Dependency",
      description:
        "Your poisons require physical reagents. You begin each encounter with 5 Vials. Each poison spell costs 1 Vial. At 0 Vials, poison spells have a 50% chance to fail (the poison is too diluted). You regain 1 Vial per enemy killed within 30 feet.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Poison/Poison Flask",
      effectTypes: ["passive"],
      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Flask",
        tags: ["passive", "resource", "vials", "poison dependency", "toxicologist"],
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
      tags: ["passive", "resource", "vials", "poison dependency", "toxicologist"],
    },
    { id : "tox_concoction_instability",
      name: "Concoction Instability",
      description:
        "When you take fire or ember damage, one random poison effect you have active on an enemy prematurely detonates — dealing its remaining damage to YOU instead of the target. Your concoctions are volatile and react poorly to heat and light.",
      level: 3,
      spellType: "PASSIVE",
      icon: "Fire/Burning Status",
      effectTypes: ["passive"],
      typeConfig: {
        school: "blight",
        icon: "Fire/Burning Status",
        tags: ["passive", "weakness", "fire vulnerability", "backlash", "toxicologist"],
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
      tags: ["passive", "weakness", "fire vulnerability", "backlash", "toxicologist"],
    },
    { id : "tox_no_hard_cc",
      name: "Poison, Not Paralysis",
      description: "The Toxicologist does not Stun, Paralyze, or Freeze. Your poisons NAUSEATE: disadvantage on attack rolls and ability checks, halved movement speed. Targets can still move, act, and react - they just do it badly. Hard CC belongs to the Lichborne (freeze), Warden (cage), and Chronarch (time-stop). You weaken. You do not lock down.",
      level: 1,
      spellType: "PASSIVE",
      icon: "Poison/Poison Flask",
      effectTypes: ["passive"],
      typeConfig: {
        school: "blight",
        icon: "Poison/Poison Flask",
        tags: ["passive", "restriction", "no hard cc", "nauseated", "toxicologist"],
        castTime: 0,
        castTimeType: "PASSIVE",
      },
      targetingConfig: { targetingType: "self" },
      resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
      resolution: "AUTOMATIC",
      tags: ["passive", "restriction", "no hard cc", "nauseated", "toxicologist"],
    },
    // ===== NON-COMBAT / ALCHEMY & GADGET UTILITY (the poisoner-craftsman, out of combat) =====
    {
      id: "tox_chemical_analysis",
      name: "Chemical Analysis",
      description: "Taste, smell, or test a powder, liquid, residue, or food/drink and read its chemistry  -  what it is, its components, any toxins/poisons/contaminants, and what it does (and the antidote, if you know one). Your dead tastebuds are the instrument. Out of combat.",
      level: 1, spellType: "ACTION", icon: "Poison/Poison Flask",
      typeConfig: { school: "blight", icon: "Poison/Poison Flask", castTime: 1, castTimeType: "MINUTES", tags: ["utility","investigation","toxicologist"] },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 3 }, components: ["somatic"], somaticText: "Touch the sample to tongue or waft it to nose; the dead tastebuds read what living ones cannot" },
      resolution: "NONE", effectTypes: ["utility"],
      utilityConfig: { utilityType: "divination", selectedEffects: [ { "id": "chemical_analysis_read", "name": "Reagent Reading", "description": "Identify a substance's composition, any toxins/contaminants, its effect, and a known antidote if one exists. Engineered or magical compounds may read partially.", "mechanicsText": "Identify a substance + toxins + effect + antidote." } ], power: "minor" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility","investigation","toxicologist"]
    },
    {
      id: "tox_caustic_flask",
      name: "Caustic Flask",
      description: "Brew and apply a precise corrosive: dissolve a lock's pins, eat through a hinge, etch a hole in thin metal, scissor a rope, or destroy a document/parchment. Quiet fuming acid, not an explosion. You take 1 blight self-damage from the back-splash. Out of combat.",
      level: 1, spellType: "ACTION", icon: "Poison/Poison Flask",
      typeConfig: { school: "blight", icon: "Poison/Poison Flask", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","infiltration","toxicologist"] },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 4 }, components: ["somatic"], classResource: { type: "vials", cost: 1 }, somaticText: "Decant just enough acid to do the work and no more  -  hands shaking" },
      resolution: "AUTOMATIC", effectTypes: ["utility"],
      utilityConfig: { utilityType: "demolition", selectedEffects: [ { "id": "caustic_flask_etch", "name": "Precision Corrosive", "description": "Dissolve a lock, hinge, thin metal, rope, or document; or etch a small hole. Costs 1 Vial; 1 blight back-splash to you. Reinforced/magical materials resist.", "mechanicsText": "Acid-open a lock/hinge/metal/rope; costs 1 vial, 1 blight self." } ], power: "moderate" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility","exploration","infiltration","toxicologist"]
    },
    {
      id: "tox_smoke_screen",
      name: "Smoke Screen",
      description: "Throw down a billowing chemical smoke that fills the area, blocks vision, lays a pungent reagent-stink that defeats scent tracking, and irritates the lungs of pursuers (they cough and slow). Excellent for retreats, break-ins, or masking your party's exact count. Out of combat.",
      level: 2, spellType: "ACTION", icon: "Nature/Wind Gust",
      typeConfig: { school: "blight", icon: "Nature/Wind Gust", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","infiltration","toxicologist"] },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, areaType: "circle", areaSize: 20 },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 5 }, components: ["somatic"], classResource: { type: "vials", cost: 1 }, somaticText: "Crush the pellet and let the chemical fog boil out" },
      resolution: "NONE", effectTypes: ["utility"],
      utilityConfig: { utilityType: "stealth", selectedEffects: [ { "id": "smoke_screen_cloud", "name": "Reagent Fog", "description": "A 20 ft smoke cloud blocks vision, defeats scent tracking, and irritates lungs (pursuers cough, -10 ft speed) for 1 minute. Masks your party's numbers and retreat.", "mechanicsText": "20 ft smoke: blocks vision/scent, slows coughing pursuers, 1 min." } ], duration: 1, durationUnit: "minutes", power: "moderate" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility","exploration","infiltration","toxicologist"]
    },
    {
      id: "tox_brew_antidote",
      name: "Brew Antidote",
      description: "From your own saturated blood and carried reagents, quickly culture an antidote to any poison, venom, or disease you have diagnosed in an ally  -  they made the cure for everyone but themselves. You suffer a brief toxic flush (1 blight) to brew it. Out of combat.",
      level: 2, spellType: "ACTION", icon: "Healing/Golden Heart",
      typeConfig: { school: "blight", icon: "Healing/Golden Heart", castTime: 10, castTimeType: "MINUTES", tags: ["utility","investigation","exploration","toxicologist"] },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0, targetRestrictions: ["any"] },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 6 }, components: ["somatic"], classResource: { type: "vials", cost: 1 }, somaticText: "Draw a little of your own toxic blood to seed the counter-agent" },
      resolution: "AUTOMATIC", effectTypes: ["utility"],
      utilityConfig: { utilityType: "protection", selectedEffects: [ { "id": "brew_antidote_cure", "name": "Cultured Antidote", "description": "Neutralize one diagnosed poison/venom/disease in another creature. Cannot self-administer (your blood rejects it). Costs 1 Vial and 1 blight to brew.", "mechanicsText": "Cure one diagnosed poison/venom/disease in another; no self-cure." } ], power: "major" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["utility","investigation","exploration","toxicologist"]
    },
    {
      id: "tox_slow_taint",
      name: "Slow Taint",
      description: "Slip a slow, untraceable reagent into a target's food or drink  -  no immediate effect, but hours later the victim is gripped by cramping sickness, weakness, or a deep sleep with no obvious cause. The poisoner's quiet art. A wary target may taste it; a paranoia-check saves them. Out of combat.",
      level: 3, spellType: "ACTION", icon: "Poison/Poison Flask",
      typeConfig: { school: "blight", icon: "Poison/Poison Flask", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","social","infiltration","toxicologist"] },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
      resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 8 }, components: ["somatic"], classResource: { type: "vials", cost: 2 }, somaticText: "Decant the colorless, tasteless reagent into the cup with a steady(ish) hand" },
      resolution: "AUTOMATIC", effectTypes: ["utility"],
      utilityConfig: { utilityType: "social", selectedEffects: [ { "id": "slow_taint_dose", "name": "Delayed Dose", "description": "Taint one food/drink; 1d4 hours later the drinker suffers cramping sickness (disadvantage on all checks for a day), weakness, or deep sleep  -  no obvious cause. A paranoid taster (DC 13) detects it first. Costs 2 Vials.", "mechanicsText": "Slip a delayed sickness/sleep poison into food/drink; DC 13 to detect." } ], power: "major" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility","social","infiltration","toxicologist"]
    }
  ],
};

TOXICOLOGIST_DATA.spells = TOXICOLOGIST_DATA.exampleSpells;

export default TOXICOLOGIST_DATA;
