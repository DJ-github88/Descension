# CR0-H3-body-and-grove: current source review extracts

AUTHORED source, not automatic execution or approved successor origins. Full payloads retained in original census; this extract selects cultural, native-variant and edge fields for manual review.

## Florae (florae)

### cardFlavor

The erased 7th noble house (House Viridane) transformed by ancient forest pacts into tree-born treant-kin with crude branch-arms, water dependency, and twig-regrowth.

### overview

The Florae are the transformed descendants of House Viridane, a people deeply attuned to nature like druids. Their arms are crude, natural tree boughs — oak, birch, willow, pine, or mountain rowan — that split into flexible twig-fingers that sprout fresh green leaves when hydrated. Small woodland creatures like squirrels, bluebirds, and chipmunks are naturally drawn to them, often nesting in their shoulder boughs.

They depend on fresh water to keep their timber limbs limber. A Florae carries a copper Hearth-Water Flask on their belt as their prized possession. When well-watered, their leaves bloom and their twig-fingers regrow quickly if damaged. If scorched by fire, their outer bark chars into smoldering embers — granting them temporary burning melee strikes, but making them desperate to douse themselves in water.

They do not write their history on paper; ink cannot hold their truth. Instead, they pass their past aloud, elder to child, carrying their identity in spoken chants and negative-space clothing. Every Florae coat features a blank rectangular patch where their noble house crest was unstitched after the world erased them.

### culturalBackground

Florae society is dedicated to tending trees and nurturing the forest. Oaken settlements are rooted firmly on the forest ground floor — cozy timber dwellings carved into titanic buttress roots and hollowed lower trunks of ancient trees, connected by mossy earthen avenues, shaded root-arches, and clear rain basins. Briaren settlements, by contrast, feature beautifully organized botanical architecture: towering thistle spires ringed by sculpted briar hedges, manicured arches, and fragrant blooming roses.

Oaken younglings emerge from Sapling-Sprouts planted in sacred ground nurseries, watered and taught oral history by their elders. Briaren are biologically born to thorn-blooded parents, with permanent contract-barbs emerging at adolescence. Both grow and mature; neither carries every ancestor's personal memories automatically.

Whether a Florae appears 'Wild' (unkempt with leafy crowns and mossy shoulders in deep groves) or 'Pruned' (groomed and manicured under high-collared traveler coats in human cities) is a matter of personal choice and lifestyle. Both carry the same warm heartwood core, the same copper water-flask, and the same blank unstitched Viridane crest patch.

### integrationNotes

{
  "actionPointSystem": "Florae abilities focus on timber resilience, twig regrowth, water-based recovery, and nature-communion. Their branch-arms provide natural melee reach and grapples.",
  "backgroundSynergy": "Florae excel in backgrounds emphasizing survival, nature, herbalism, and guardianship. Their druidic connection creates rich roleplay hooks with woodland creatures and ancient groves.",
  "classCompatibility": "The Briaren carry the lunar parasite as their blood inheritance, so the Lunarch is native to them; they are also native to the Animist (thorn-cantor for the Unwritten dead) and Toxicologist (thorn-sap distillations). Oaken Florae, the tree-born house that passes in cities, are native to the Toxicologist (grove chemistry), the Animist (grove-litany carried in splinter-grafts), and the Lunarch (containing the parasite through timber restraint). Other paths are acquired, never native."
}

### Briaren Florae — viridian_florae

Native: Lunarch, Toxicologist, Animist.

**description:** The Briaren are the Briaren Florae, the ones who kept House Viridane's refusal in their flesh. When the fae-contract was struck in the moonlit groves, the price came due two ways: thorns for the Briaren, timber for the Oaken. The Briaren grew barbs from their forearms that mark them as the physical embodiment of the pact, and they retreated into the deepest ironwood groves to tend the places where the uncorrupted Monolith fragment was hidden.

They reject the Fog Compact entirely. Where House Thalreth traded the Frostwood Reach's clarity for insulating mist, the Briaren believe the fog itself is the enemy, slowly erasing everything that made the forest sacred. The cleansing key carried in House Viridane's blood runs in theirs, and they carry the Unwritten Word, a truth-sense that hears a spoken lie the way a foot feels a false step. The Thorn-Speaker is the voice they elected to speak for them, and every word that one says is a thorn.

**culturalBackground:** Briaren society clusters around bastions of beautifully organized botanical architecture, such as Thornhollow. Rather than wild overgrowth, their towns are shaped with exquisite horticultural precision: soaring central thistle spires surrounded by sculpted thorn hedges, manicured briar arches, blooming climbing roses, and geometric vine-trellis promenades. Young Briaren are not planted like Oaken Sapling-Sprouts; they are born biologically to thorn-blooded parents, and the barbs erupt through the skin in adolescence as the contract asserts itself.

Their oral tradition is fierce and short-spoken. They keep the names of every house that broke the Great Binding, every house that marched its firstborn north, and they sing them only as warnings. A Briaren who leaves the deep groves does so as a partisan, carrying the refusal into the Ledgered world at great personal cost. The fog erodes them faster than it erodes the Oaken, and they know it.

Subrace authored keys: id, name, crest, illustration, illustrationCaption, illustrations, visualDescription, tooltipSummary, description, culturalBackground, baseTraits, statModifiers, baseStats, savingThrowModifiers, traits.

#### Lunarch

Source vtt-react/src/data/classes/lunarchData.js:62

{
  "variant": {
    "subraceName": "Briaren Florae (Briaren)",
    "title": "The Thorn-Bound",
    "reframe": "The <LoreLink termId=\"florae\">Briaren</LoreLink>, thorn-cloaked traditionalists of the deep groves, are the parasite's original hosts, and they wear it openly. For the Briaren, the lunar parasite is the fae-contract made flesh: the thorn-blood remembers what the fae loaned, and the parasite's phases *are* the debt's interest cycle. An Briaren Lunarch does not fight the parasite; they *account* for it, each phase a payment, each Waning a default.",
    "signatureAbility": {
      "name": "Thorn-Debt",
      "description": "The parasite's phases are synced to the host's fae-contract debt; power scales with the outstanding obligation, and the Waning phase (memory-loss) is *literally* interest collection. An Briaren Lunarch who has fully repaid their fae-debt loses their magic, and so none ever do."
    },
    "currentCrisisAngle": "The dead-moon-is-a-fallen-star revelation strikes the Briaren hardest: their fae-contract is bound to a *living* entity, and the elder parasites now communicating across hosts are the fallen star's brood-siblings. The Briaren elders fear the fae themselves were parasites all along, that the entire Florae bloodline is a larval stage. Selene's three-week silence is, the Briaren believe, her being *called home* to the fallen star she cannot refuse.",
    "signatureQuote": {
      "text": "\"The fae lent us the thorn and the moon collects the interest. We always knew the lender was older than the loan. We did not know the lender was still hatching.\"",
      "speaker": "Selene of House Viridane",
      "context": "The founder, in the journal she stopped writing three weeks ago"
    }
  },
  "edge": {
    "className": "Lunarch",
    "heritageId": "viridian_florae",
    "description": "A declared grove or contract anchor stabilizes one phase operation.",
    "costDescription": "Extra blood and anchor stress; not every fae debt is a parasite's loan.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "grove_anchor_stabilizes_phase",
      "condition": {
        "type": "bond",
        "value": "grove_contract_anchor"
      }
    },
    "cost": {
      "kind": "self_damage",
      "unit": "dice",
      "dice": 1,
      "sides": 4
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Lunarch",
    "heritageId": "viridian_florae",
    "requirements": [
      "organism_bond",
      "host_compatibility",
      "identity_training"
    ],
    "reason": "An actual compatible host bond, containment and identity discipline"
  },
  "order": {
    "orderName": "The Lunar Communion",
    "founder": {
      "name": "<LoreLink termId=\"selene\">Selene of House Viridane</LoreLink>",
      "status": "Alive, but silent. Selene bargained with the wildwood fae in the moonlit groves and bound a lunar parasite to her bones. Three weeks ago she stopped speaking <LoreLink termId=\"florae\">Florae</LoreLink> and began whispering in a language the elders cannot identify, older than the fae-contract, older than the dead moon.",
      "note": "The first Lunarch. Her parasite was believed singular; the discovery that the dead moon is a fallen star  —  and the \"egg\" a folk misunderstanding  —  has rendered her silence terrifying rather than merely concerning."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"bri-vessela\">Regent Bri-Vessela</LoreLink>",
      "title": "Keeper of the Phases (acting)",
      "characterization": "A senior Briaren Florae who has led the Communion in Selene's silence with visible reluctance. She is a theologian, not a politician, and she took the regency only because the alternative was civil war between the caste-factions. She spends her nights at Selene's side, transcribing the dead-language whispers, and her days pretending she understands what they mean."
    },
    "headquarters": {
      "name": "The Moonlit Groves, deep Frostwood Reach",
      "locationId": "frostwood-reach"
    },
    "crisisConnection": "<LoreLink termId=\"bri-vessela\">Bri-Vessela</LoreLink> is presiding over a Communion that is, quietly, being *called*, the elder parasites communicating across hosts are synchronizing the phases of every Lunarch toward an unknown convergence. Selene's whispers are, <LoreLink termId=\"bri-vessela\">Bri-Vessela</LoreLink> has begun to suspect, not madness but *instructions*: the waking-song of the fallen star, and every Lunarch is a note in it. She does not know whether to stop the convergence or let it come, because no one alive remembers what wakes."
  }
}

#### Toxicologist

Source vtt-react/src/data/classes/toxicologistData.js:76

{
  "variant": {
    "subraceName": "Briaren Florae (The Thorn-Venom)",
    "title": "The Thorn-Venom",
    "reframe": "The <LoreLink termId=\"florae\">Briaren Florae</LoreLink>, thorn-barbed traditionalists of the deep groves, carry the most *personal* toxicology in the tradition: the thorn-blood itself. The fae-contract that scrawls shifting raven-markings across the deep ironwood also infuses the Florae's thorns, and a Briaren Toxicologist distills *their own blood*, the fae-venom that grows from their forearms.",
    "signatureAbility": {
      "name": "Thorn-Blood",
      "description": "Toxins are distilled from the Toxicologist's own fae-touched thorn-blood, a deeply personal reagent that makes every Briaren Toxicologist's poisons *unique* to their bloodline. The poisons are potent and uncounterable by anyone who has not studied the specific Florae's blood, but each distillation costs the Toxicologist real HP."
    },
    "currentCrisisAngle": "The changing fog has reached the deep groves, and the fae-touched thorn-blood is responding, the thorns growing *faster*, the venom more virulent, the Briaren Toxicologists *bleeding spontaneously*. Several elders read this as the fae-contract *collecting*, the same interest-compounding the Lunarchs describe, and fear the Briaren are being bled dry by their own patrons.",
    "signatureQuote": {
      "text": "\"I distill my own arm to poison my enemies. The arm grows back. The venom grows stronger. Lately the arm bleeds whether I ask it to or not. The fae are collecting, and I am the harvest.\"",
      "speaker": "Thorn-Venom Bri-Vess",
      "context": "A Briaren Toxicologist, bandaging a spontaneous thorn-bleed"
    }
  },
  "edge": {
    "className": "Toxicologist",
    "heritageId": "viridian_florae",
    "description": "Bri-Aethren's Thornwood exchange tunes a dose to actual thorn-sap chemistry.",
    "costDescription": "Personal vitality and a specific reagent; not universal unbeatable poison.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "tune_dose_to_thorn_sap",
      "condition": {
        "type": "medium",
        "value": "thorn_sap"
      }
    },
    "cost": {
      "kind": "self_damage",
      "unit": "dice",
      "dice": 1,
      "sides": 4
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Toxicologist",
    "heritageId": "viridian_florae",
    "requirements": [
      "tolerance_induction",
      "distillation_training"
    ],
    "reason": "Tolerance induction and distillation/preparation apprenticeship"
  },
  "order": {
    "orderName": "The Distillery",
    "founder": {
      "name": "<LoreLink termId=\"varis\">Varis</LoreLink>",
      "status": "Alive, old, trembling, and still working. The <LoreLink termId=\"frostwood-reach\">Tallyn</LoreLink> alchemist who extracted raw venom from fog-predators to defend against face-stealing horrors. Years in the ironwood canopies left him with chronic tremors, burned-away taste, and permanently stained fingers. The venoms that destroyed his nerves and stole his taste also froze his aging  -  a side effect he discovered too late to benefit from and too early to die from. He has been old for four hundred years. He cannot sign his own name legibly. He can still pour a lethal dose without spilling.",
      "note": "<LoreLink termId=\"varis\">Varis</LoreLink> built the Distillery on patience: a poison laid today that blooms in a week. The changing fog is rewriting his pharmacopoeia in real time, and the most premeditative tradition in Mythril is being forced to improvise, the one thing it was never built to do."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"varis\">Venom-Master Varis the Trembling</LoreLink>",
      "title": "Keeper of the Slow Cup",
      "characterization": "<LoreLink termId=\"varis\">Varis</LoreLink> still leads, though his tremors make the work dangerous and his junior distillers flank every pour. He is stubborn, brilliant, and furious at the fog in a way only a four-century practitioner can be, the resentment of a master watching his medium rewrite itself without his consent. He considers the changing fog a personal insult."
    },
    "headquarters": {
      "name": "The Distillery  -  Canopy-Laboratory, the Shallows (Frostwood Reach)",
      "locationId": "frostwood-reach"
    },
    "foundingEvent": {
      "eventName": "The Third Harvest of the Gref-Veil",
      "location": "The Shallows, Frostwood Reach  -  Thornwood patrol route",
      "year": "Mid-Diming, c. 400 years before present",
      "summary": "In the mid-Freeze decades, the fog-predators known as the Gref grew bolder. Unlike the Geaslan (which hunted the mist alone), the Gref had learned to coordinate  -  a hunting-pack behavior no Tallyn naturalist had ever documented. During what the survivors called the Third Harvest, a Gref-pack cornered a Tallyn scout patrol of six at Thornwood, a shallow-ironwood grove three leagues east of the Shallows, and *peeled* four of them before the remaining two escaped. The Gref did not kill them. They stole their faces, their voices, their memories, and for three weeks the four dead scouts *walked back into the settlements* wearing their killers' stolen identities. The Shallows executed seventeen people  -  some of them the Gref-wearing husks, some of them innocent neighbors indistinguishable from the predators  -  before the infestation was purged. Watching his patrolmates return as hollow mimics broke something in Varis. He declared that he would find a weapon the Gref could not steal, could not wear, could not turn back upon his people. He spent the next decade isolating the venom-glands of captured Gref specimens in a canopy-laboratory suspended above the Thornwood grove where his patrol died, and the Toxicologist tradition was born not from curiosity but from vengeance."
    },
    "culturalSpread": {
      "title": "The Spread of the Slow Cup",
      "description": "The Toxicologist craft did not remain confined to the Tallyn. Over four centuries, the tradition spread across Mythril through a chain of desperate transmissions  -  refugees, exiles, spies, and debtors each carrying the craft to a new people who needed it for their own reasons.",
      "vectors": [
        {
          "from": "Tallyn",
          "to": "Broken Mimir",
          "vector": "The Broken Mimir share the Frostwood with the Tallyn, dwelling on the forest floor beneath the same canopies. When the Tallyn began deploying fog-venom perimeters against the Gref, the Broken Mimir observed the results from below  -  predators that survived the canopy traps fell dying into the floor-dwellings. The first Broken Mimir Toxicologists did not learn from Varis directly; they learned by *reverse-engineering the corpses* that rained down on their settlements. A Broken Mimir elder named Mir-Haeth collected dying Gref, studied the venoms still active in their wounds, and cultivated the first floor-toxin from the fungal mats that flourished where the poisoned corpses decomposed. The Broken Mimir call this transmission \"the Falling Lesson.\" They never asked the Tallyn for permission, and the Tallyn never offered it."
        },
        {
          "from": "Tallyn",
          "to": "Mycellan",
          "vector": "The Bryngloom is far from the Frostwood, but the Athien contract-economy draws resources from every corner of Mythril. Tallyn distillers who fell into debt to the Athien (which most eventually did, given the cost of fog-predator-hunting equipment) were indentured to work the Bryngloom peat-fields alongside Mycellan families serving their own generational debt. A Tallyn debt-worker named Hael the Split-Hand, sentenced to twenty years of peat-cutting, began teaching the Mycellan the principles of venom-distillation during the long nights in the bog-worker dormitories  -  not out of generosity, but because the Mycellan knew the bog's alchemical moss better than any Tallyn ever could, and Hael saw a way to pay off his contract faster by producing saleable distillates. The Mycellan adapted Tallyn techniques to bog-chemistry within a generation, producing toxins the Tallyn had never imagined. Hael died in the bog before his debt was cleared. The Mycellan remember his name."
        },
        {
          "from": "Tallyn",
          "to": "Briaren Florae",
          "vector": "The Briaren Florae learned toxicology through a transaction that both sides now regret. A Briaren elder named Bri-Aethren, observing the Tallyn's chemical defenses against the Gref, offered a Thornwood Accord: in exchange for Tallyn distillation techniques, the Briaren would teach the Tallyn how to read the fae-signs that predict fog-predator movements. The Tallyn accepted. What they did not anticipate was that the Briaren would adapt human alchemy to their own biology  -  distilling from thorn-blood rather than predator venom, creating a fae-alchemical hybrid that neither the Tallyn nor the fae-contracts had anticipated. The Briaren now possess the tradition's most personal and most dangerous poisons, and the Tallyn distillers who made the original trade consider it the worst bargain of their lives. Bri-Aethren has since disappeared into the deep groves and no longer answers to anyone."
        },
        {
          "from": "Mycellan",
          "to": "Riven",
          "vector": "The Riven learned the craft from Mycellan bog-chemists fleeing the Keeper's Sanction. When Mor-Velk the Wet began intercepting ichor shipments meant for Athien contract-rituals, she knew the Ledger would eventually trace the theft. She sought refuge in the Deep-Quarter, where the Riven  -  legally non-existent, untraceable by contract-enforcement  -  offered her sanctuary. In exchange for protection, Mor-Velk taught the Riven everything she knew about bog-reading and alchemical distillation. The Riven adapted the craft to their own condition: their half-decayed flesh, no longer preserved by Morvane's contract, hosts decomposition chemistry that no living Toxicologist can replicate. The resulting null-distillates are the only poisons in Mythril that cannot be registered on the First Contract, making the Riven Toxicologists the most dangerous chemists Morvane has never heard of."
        }
      ]
    },
    "ranks": {
      "title": "The Hierarchy of the Slow Cup",
      "ranks": [
        {
          "rank": "Keeper of the Slow Cup",
          "count": 1,
          "holder": "Varis the Trembling",
          "description": "The founder and master of the Distillery. The rank is named for Varis's belief that the best poison is the one you pour today and let bloom tomorrow. No successor has been named; Varis refuses to discuss succession."
        },
        {
          "rank": "Venom-Pourer",
          "count": 12,
          "holders": "Senior distillers including Lyra the Poison-Weaver (Broken Mimir), Mor-Velk the Wet (Mycellan, in absentia), Bri-Vess the Thorn-Venom (Briaren, in absentia)",
          "description": "Master distillers who have produced at least one original toxin formulation ratified by the Keeper. Each Venom-Pourer oversees a satellite distillery in their home region and is authorized to teach the craft. Three of the twelve are currently in absentia  -  fugitives from their respective regional authorities who maintain contact through encrypted formula-letters."
        },
        {
          "rank": "Glass-Hand",
          "count": "~40",
          "description": "Journeyman distillers who have completed their apprenticeship and maintain their own small laboratories. Glass-Hands are permitted to sell low-grade poisons to scouts, hunters, and fog-predator-control. They handle the Distillery's day-to-day operations and are the rank most likely to interact with outsiders."
        },
        {
          "rank": "Shaker",
          "count": "~80",
          "description": "Apprentices, named for the tremors they have not yet learned to control. Shakers spend their first five years doing nothing but cleaning glassware, recording formula variations, and learning to pour without spilling. Most Shakers wash out within two years  -  the chronic toxin exposure is too much. Those who stay develop the stains, the tremors, and the burned-out tastebuds that mark a true Toxicologist."
        },
        {
          "rank": "Tongue-Burned (Unofficial)",
          "count": "Unknown",
          "description": "A grim colloquialism for Toxicologists whose sense of taste has been completely destroyed by toxin exposure  -  a common milestone that the Distillery treats as an informal rank. Tongue-Burned distillers can no longer taste-test their own work and must rely entirely on chemical indicators and junior tasters. Varis has been Tongue-Burned for over four centuries."
        }
      ],
      "note": "The Distillery is not a formal guild with charters, dues, or legal recognition. It is an oral tradition organized around a particular set of techniques, maintained by a man who cannot write legibly and enforced by the mutual reliance of poisoners who have no one else to trust."
    },
    "rival": {
      "name": "Nerath the Soft-Voiced",
      "title": "Former Venom-Pourer, now Keeper of the Clean Hand",
      "status": "Exiled from the Distillery, operating independently from an unmarked laboratory in the Ironwood Deeps",
      "conflict": "Nerath was Varis's most brilliant Venom-Pourer  -  the only Toxicologist in the tradition's history to produce six original toxin formulations before the age of forty. When the fog began changing and the pharmacopoeia began to spoil, Nerath argued that Varis should abandon the old formula entirely: stop distilling fog-predator venom, stop trying to preserve the old pharmacopoeia, and start fresh with synthetic chemistry independent of the Frostwood's native rot. \"The fog is rewriting the rules,\" Nerath told the assembled Venom-Pourers at the Conclave of Spoiling, held in the Canopy-Laboratory three years ago. \"We should be writing new ones, not preserving the old ones in brine.\" Varis accused him of cowardice. Nerath accused Varis of senility  -  of being too old and too stubborn to see that his life's work was already dead, that the fog-predator venoms were not salvageable, that every vial Varis poured from the old pharmacopoeia was a waste of time that could go into finding alternatives. The argument ended with Nerath breaking a vial of his own formulation  -  a synthetic neurotoxin he had developed without predator-venom  -  against the laboratory floor and walking out. Half the Glass-Hands agreed with Nerath privately. None followed him publicly. Nerath now operates alone in the Ironwood Deeps, developing synthetic toxins from mineral chemistry rather than biological extraction. His poisons work  -  they are stable, reproducible, and unaffected by the changing fog  -  but they lack the potency of predator-derived venoms, and they have a signature that anyone with chemical training can identify. Varis calls Nerath's work \"factory poison  -  a blunt instrument for a blunt mind.\" Nerath calls Varis's work \"a museum devoted to a dead world.\" Neither has spoken to the other in three years. The junior distillers whisper that if the fog doesn't kill the Distillery, the schism between Varis and Nerath will.",
      "significance": "Nerath's break from the Distillery represents the tradition's deepest philosophical fracture: whether to adapt or preserve. If Varis dies before the fog crisis is resolved, Nerath is the only person with the knowledge, the formulations, and the institutional memory to run the Distillery  -  and he has already made it clear that he would dismantle the old pharmacopoeia entirely. The Venom-Pourers are terrified that the Distillery will die with its founder, split between a dead man's stubbornness and a traitor's ambition."
    },
    "crisisConnection": "<LoreLink termId=\"varis\">Varis</LoreLink> is presiding over the spoilage of his life's work: fog-predator venoms degrading in weeks rather than years, the entire Distillery pharmacopoeia turning unstable. His desperation project, distilling the *changing fog itself*, has produced reagents no one can characterize, and two of his apprentices  -  a young Tallyn Shaker named Kellan Soft-Hand and a veteran Glass-Hand named Torven the Steady, killed three months apart testing uncharacterized fog-distillates on themselves  -  have died for his obsession. Varis refuses to stop. He has spent four centuries mastering the Frostwood's chemistry, and he will master the new chemistry or die in the attempt. The Distillery's junior members are no longer certain which outcome they are rooting for."
  }
}

#### Animist

Source vtt-react/src/data/classes/animistData.js:214

{
  "variant": {
    "subraceName": "Briaren Florae",
    "title": "The Thorn-Cantor",
    "reframe": "The <LoreLink termId=\"florae\">Briaren Florae</LoreLink> are the descendants of House Viridane, the house the world *unwrote*, and their Animist tradition gives voice to the ancestors no ledger admits: the Unwritten dead, who have no graves, no records, and no names anywhere except thorn and blood. A Thorn-Cantor bleeds into the grove and the erased answer, because the thorn-grove is the only archive that kept them.",
    "signatureAbility": {
      "name": "Unwritten Summons",
      "description": "Summons ancestors erased from every record; their aid is real and their existence is not. Citation fails (there is nothing to cite), the bond is held by thorn-blood alone, and the spirits demand their names be spoken aloud with each summoning, because a spoken name is the only grave they have."
    },
    "currentCrisisAngle": "The contract-interest crisis has reached the Unwritten. The elder dead have begun answering in the fae-contract's voice instead of their own, using the language of compounded interest the Lunarchs describe, and the Thorn-Cantors suspect the fae are speaking *through* the ancestors, wearing the erased like borrowed faces. The elders cannot prove it, because the only witnesses are the ones being worn.",
    "signatureQuote": {
      "text": "\"Say the name. Every time. Out loud, or they slide back into the erasure. Whatever answers after you stop saying it is not my grandmother. She has been unwritten for four centuries. I will not let her be re-written by something else.\"",
      "speaker": "Thorn-Cantor Ori-Vess",
      "context": "A Thorn-Cantor, ending a summoning early because the answer came back in the contract's cadence"
    }
  },
  "edge": {
    "className": "Animist",
    "heritageId": "viridian_florae",
    "description": "You summon the erased Viridane dead held in thorn and blood.",
    "costDescription": "Named, finite bonds with a blood and attention cost.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "summon_erased_viridane_ancestor",
      "condition": {
        "type": "equipment",
        "value": "thorn_blood"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "named_finite_bonds_blood_cost"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Animist",
    "heritageId": "viridian_florae",
    "requirements": [
      "spirit_anchor",
      "communion_apprenticeship"
    ],
    "reason": "A memorial/spirit anchor and guided communion apprenticeship"
  },
  "order": {
    "orderName": "The Silent Throat",
    "founder": {
      "name": "Kael the Herd-Runner",
      "status": "Dead. The first of the three named Animist founders, an Ordu throat-singer who sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. The practice predates writing  —  it was navigation, not philosophy. The Ordu do not know who first sang the dead into the wind, only that when the stars went dark, Kael began singing ancestor-names and the herds still found their way.",
      "note": "Kael is canonically one of three co-founders of the Animist tradition (alongside Nyssa the Herbalist and Theron the Skald Scholar). The Ordu throat-singing tradition lives entirely in muscle-memory, teacher to student, voice to voice, and Kael is the root of that lineage. Later traditions (Skald, Mycellan, Astril, Athien) all trace their root technique to Kael's work."
    },
    "currentLeader": {
      "name": "Bayar Wind-Throat",
      "title": "Last Singer of the Old Route",
      "characterization": "An Ordu elder who still sings the migration-routes in the old tongue of the Long Before  —  the language that predates the dialect-fracture. Bayar has not spoken a word aloud in forty years; he communicates only through throat-sung overtones, the way the First Singer did. His vocal cords are calcified from decades of channeling ancestors who died before the stars went out. He is the living archive of the oldest form, and he watches the younger traditions drift further from the root with every generation  —  not with anger, but with the patience of someone who knows the dead will correct them eventually."
    },
    "headquarters": {
      "name": "The Sundrift Wind-Shrine (moving camp)",
      "locationId": "sundrift-vale"
    },
    "crisisConnection": "Bayar Wind-Throat is the only living Animist who still sings the pre-fracture language. The dialect-fracture is a problem of the dead themselves  —  the oldest dead (those who died before the <LoreLink termId=\"sundered_monoliths\">Monoliths</LoreLink> woke) speak clearly. The newer dead are confused, their voices layered with static no throat-singer can parse. Bayar suspects something is wrong with the threshold of death itself, and the Monoliths' awakening is not a cause but a symptom. He cannot prove this, because the evidence is in a language no one else remembers how to hear."
  }
}

Rare-route authored edges:

[]

### Oaken Florae — florae_unified

Native: Toxicologist, Animist, Lunarch.

**description:** The Oaken are the tree-born Florae, the ones whose flesh was woven into living timber when the fae-contract was struck. Where the Briaren grew thorns, the Oaken grew wood: crude branch-arms of oak, birch, willow, pine, or rowan that split into flexible twig-fingers sprouting fresh leaf-buds when hydrated, and sap-filled veins where the Briaren carry barbs.

The Oaken did not refuse the Fog Compact; they endure it. Where the Briaren retreated into the deep groves to keep the refusal alive, the Oaken moved through the Ledgered towns, pruning themselves neat and walking under high-collared coats with the unstitched Viridane crest patch at the breast. A Pruned Oaken can pass in Drunhold or Greymark Keep long enough to trade; a Wild Oaken stays in the ground-floor root-hollow sanctuaries where the Sapling-Sprouts are planted in rich forest loam and sung into shape by elders with copper water-flasks at their belts.

**culturalBackground:** Oaken society is dedicated to tending trees and nurturing the forest from the ground up. Their homes are built strictly on the forest ground floor — cozy timber dwellings carved directly into titanic buttress roots and hollowed base trunks of colossal ancient trees, connected by mossy earthen avenues, shaded root-arches, and clear rain basins (strictly no treetop or canopy living).

Oaken younglings are not born biologically; they are planted. Every youngling begins as a Sapling-Sprout planted in a sacred forest nursery bed of rich mossy loam on the forest floor. The elders water them daily with fresh rainwater, share berries with visiting squirrels, and sing the oral history until the saplings grow their first crude branch-arms and step out of the soil as young Oaken.

Whether an Oaken appears 'Wild' (unkempt with leafy crowns and mossy shoulders in deep groves) or 'Pruned' (groomed and manicured under high-collared traveler coats in human cities) is a matter of personal choice and lifestyle. Both carry the same warm heartwood core, the same copper water-flask, and the same blank unstitched Viridane crest patch.

Subrace authored keys: id, name, crest, illustration, illustrationCaption, illustrations, visualDescription, tooltipSummary, description, culturalBackground, baseTraits, statModifiers, baseStats, savingThrowModifiers, traits.

#### Toxicologist

Source vtt-react/src/data/classes/toxicologistData.js:92

{
  "variant": {
    "subraceName": "Oaken Florae (The Timber-Venom)",
    "title": "The Hidden-Cuil",
    "reframe": "The <LoreLink termId=\"florae\">Oaken Florae</LoreLink> pass as woodcraft travelers among the Tallyn edge-settlements, and a Toxicologist among them brews in *absolute secret*, distilling thorn-venom in basements, hiding the reagents from neighbors who would report them. The Oaken are the tradition's *spies*: their craft is optimized for concealment, for toxins that kill without trace, for a poisoner who cannot afford to be caught.",
    "signatureAbility": {
      "name": "Hidden-Cuil",
      "description": "Toxins are engineered for *untraceability*, delayed onset, undetectable residue, symptoms that mimic natural illness. The Oaken are the tradition's assassins, and their poisons are designed to leave no evidence that a Toxicologist was ever present. The cost: the weakest direct-combat toxins in the tradition."
    },
    "currentCrisisAngle": "The spontaneous thorn-bleeding affects the Oaken too, and it is exposing them, an Oaken Toxicologist who bleeds thorn-blood in a Tallyn market is no longer passing as human.",
    "signatureQuote": {
      "text": "\"I brewed in secret for twenty years and the Tallyn never knew. Now my timber-arm bleeds in their market and they are looking at me the way I always feared. My craft has unmasked me.\"",
      "speaker": "Vael the Timber-Carver",
      "context": "An Oaken Toxicologist, the morning after bleeding at a checkpoint"
    }
  },
  "edge": {
    "className": "Toxicologist",
    "heritageId": "florae_unified",
    "description": "Timber/resin craft conceals a carefully prepared resin-derived formulation.",
    "costDescription": "Lower immediate potency/preparation cost; no automatic thorn-blood anatomy.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "conceal_resin_formulation",
      "condition": {
        "type": "medium",
        "value": "resin_sap"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "lower_immediate_potency"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Toxicologist",
    "heritageId": "florae_unified",
    "requirements": [
      "tolerance_induction",
      "distillation_training"
    ],
    "reason": "Tolerance induction and distillation/preparation apprenticeship"
  },
  "order": {
    "orderName": "The Distillery",
    "founder": {
      "name": "<LoreLink termId=\"varis\">Varis</LoreLink>",
      "status": "Alive, old, trembling, and still working. The <LoreLink termId=\"frostwood-reach\">Tallyn</LoreLink> alchemist who extracted raw venom from fog-predators to defend against face-stealing horrors. Years in the ironwood canopies left him with chronic tremors, burned-away taste, and permanently stained fingers. The venoms that destroyed his nerves and stole his taste also froze his aging  -  a side effect he discovered too late to benefit from and too early to die from. He has been old for four hundred years. He cannot sign his own name legibly. He can still pour a lethal dose without spilling.",
      "note": "<LoreLink termId=\"varis\">Varis</LoreLink> built the Distillery on patience: a poison laid today that blooms in a week. The changing fog is rewriting his pharmacopoeia in real time, and the most premeditative tradition in Mythril is being forced to improvise, the one thing it was never built to do."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"varis\">Venom-Master Varis the Trembling</LoreLink>",
      "title": "Keeper of the Slow Cup",
      "characterization": "<LoreLink termId=\"varis\">Varis</LoreLink> still leads, though his tremors make the work dangerous and his junior distillers flank every pour. He is stubborn, brilliant, and furious at the fog in a way only a four-century practitioner can be, the resentment of a master watching his medium rewrite itself without his consent. He considers the changing fog a personal insult."
    },
    "headquarters": {
      "name": "The Distillery  -  Canopy-Laboratory, the Shallows (Frostwood Reach)",
      "locationId": "frostwood-reach"
    },
    "foundingEvent": {
      "eventName": "The Third Harvest of the Gref-Veil",
      "location": "The Shallows, Frostwood Reach  -  Thornwood patrol route",
      "year": "Mid-Diming, c. 400 years before present",
      "summary": "In the mid-Freeze decades, the fog-predators known as the Gref grew bolder. Unlike the Geaslan (which hunted the mist alone), the Gref had learned to coordinate  -  a hunting-pack behavior no Tallyn naturalist had ever documented. During what the survivors called the Third Harvest, a Gref-pack cornered a Tallyn scout patrol of six at Thornwood, a shallow-ironwood grove three leagues east of the Shallows, and *peeled* four of them before the remaining two escaped. The Gref did not kill them. They stole their faces, their voices, their memories, and for three weeks the four dead scouts *walked back into the settlements* wearing their killers' stolen identities. The Shallows executed seventeen people  -  some of them the Gref-wearing husks, some of them innocent neighbors indistinguishable from the predators  -  before the infestation was purged. Watching his patrolmates return as hollow mimics broke something in Varis. He declared that he would find a weapon the Gref could not steal, could not wear, could not turn back upon his people. He spent the next decade isolating the venom-glands of captured Gref specimens in a canopy-laboratory suspended above the Thornwood grove where his patrol died, and the Toxicologist tradition was born not from curiosity but from vengeance."
    },
    "culturalSpread": {
      "title": "The Spread of the Slow Cup",
      "description": "The Toxicologist craft did not remain confined to the Tallyn. Over four centuries, the tradition spread across Mythril through a chain of desperate transmissions  -  refugees, exiles, spies, and debtors each carrying the craft to a new people who needed it for their own reasons.",
      "vectors": [
        {
          "from": "Tallyn",
          "to": "Broken Mimir",
          "vector": "The Broken Mimir share the Frostwood with the Tallyn, dwelling on the forest floor beneath the same canopies. When the Tallyn began deploying fog-venom perimeters against the Gref, the Broken Mimir observed the results from below  -  predators that survived the canopy traps fell dying into the floor-dwellings. The first Broken Mimir Toxicologists did not learn from Varis directly; they learned by *reverse-engineering the corpses* that rained down on their settlements. A Broken Mimir elder named Mir-Haeth collected dying Gref, studied the venoms still active in their wounds, and cultivated the first floor-toxin from the fungal mats that flourished where the poisoned corpses decomposed. The Broken Mimir call this transmission \"the Falling Lesson.\" They never asked the Tallyn for permission, and the Tallyn never offered it."
        },
        {
          "from": "Tallyn",
          "to": "Mycellan",
          "vector": "The Bryngloom is far from the Frostwood, but the Athien contract-economy draws resources from every corner of Mythril. Tallyn distillers who fell into debt to the Athien (which most eventually did, given the cost of fog-predator-hunting equipment) were indentured to work the Bryngloom peat-fields alongside Mycellan families serving their own generational debt. A Tallyn debt-worker named Hael the Split-Hand, sentenced to twenty years of peat-cutting, began teaching the Mycellan the principles of venom-distillation during the long nights in the bog-worker dormitories  -  not out of generosity, but because the Mycellan knew the bog's alchemical moss better than any Tallyn ever could, and Hael saw a way to pay off his contract faster by producing saleable distillates. The Mycellan adapted Tallyn techniques to bog-chemistry within a generation, producing toxins the Tallyn had never imagined. Hael died in the bog before his debt was cleared. The Mycellan remember his name."
        },
        {
          "from": "Tallyn",
          "to": "Briaren Florae",
          "vector": "The Briaren Florae learned toxicology through a transaction that both sides now regret. A Briaren elder named Bri-Aethren, observing the Tallyn's chemical defenses against the Gref, offered a Thornwood Accord: in exchange for Tallyn distillation techniques, the Briaren would teach the Tallyn how to read the fae-signs that predict fog-predator movements. The Tallyn accepted. What they did not anticipate was that the Briaren would adapt human alchemy to their own biology  -  distilling from thorn-blood rather than predator venom, creating a fae-alchemical hybrid that neither the Tallyn nor the fae-contracts had anticipated. The Briaren now possess the tradition's most personal and most dangerous poisons, and the Tallyn distillers who made the original trade consider it the worst bargain of their lives. Bri-Aethren has since disappeared into the deep groves and no longer answers to anyone."
        },
        {
          "from": "Mycellan",
          "to": "Riven",
          "vector": "The Riven learned the craft from Mycellan bog-chemists fleeing the Keeper's Sanction. When Mor-Velk the Wet began intercepting ichor shipments meant for Athien contract-rituals, she knew the Ledger would eventually trace the theft. She sought refuge in the Deep-Quarter, where the Riven  -  legally non-existent, untraceable by contract-enforcement  -  offered her sanctuary. In exchange for protection, Mor-Velk taught the Riven everything she knew about bog-reading and alchemical distillation. The Riven adapted the craft to their own condition: their half-decayed flesh, no longer preserved by Morvane's contract, hosts decomposition chemistry that no living Toxicologist can replicate. The resulting null-distillates are the only poisons in Mythril that cannot be registered on the First Contract, making the Riven Toxicologists the most dangerous chemists Morvane has never heard of."
        }
      ]
    },
    "ranks": {
      "title": "The Hierarchy of the Slow Cup",
      "ranks": [
        {
          "rank": "Keeper of the Slow Cup",
          "count": 1,
          "holder": "Varis the Trembling",
          "description": "The founder and master of the Distillery. The rank is named for Varis's belief that the best poison is the one you pour today and let bloom tomorrow. No successor has been named; Varis refuses to discuss succession."
        },
        {
          "rank": "Venom-Pourer",
          "count": 12,
          "holders": "Senior distillers including Lyra the Poison-Weaver (Broken Mimir), Mor-Velk the Wet (Mycellan, in absentia), Bri-Vess the Thorn-Venom (Briaren, in absentia)",
          "description": "Master distillers who have produced at least one original toxin formulation ratified by the Keeper. Each Venom-Pourer oversees a satellite distillery in their home region and is authorized to teach the craft. Three of the twelve are currently in absentia  -  fugitives from their respective regional authorities who maintain contact through encrypted formula-letters."
        },
        {
          "rank": "Glass-Hand",
          "count": "~40",
          "description": "Journeyman distillers who have completed their apprenticeship and maintain their own small laboratories. Glass-Hands are permitted to sell low-grade poisons to scouts, hunters, and fog-predator-control. They handle the Distillery's day-to-day operations and are the rank most likely to interact with outsiders."
        },
        {
          "rank": "Shaker",
          "count": "~80",
          "description": "Apprentices, named for the tremors they have not yet learned to control. Shakers spend their first five years doing nothing but cleaning glassware, recording formula variations, and learning to pour without spilling. Most Shakers wash out within two years  -  the chronic toxin exposure is too much. Those who stay develop the stains, the tremors, and the burned-out tastebuds that mark a true Toxicologist."
        },
        {
          "rank": "Tongue-Burned (Unofficial)",
          "count": "Unknown",
          "description": "A grim colloquialism for Toxicologists whose sense of taste has been completely destroyed by toxin exposure  -  a common milestone that the Distillery treats as an informal rank. Tongue-Burned distillers can no longer taste-test their own work and must rely entirely on chemical indicators and junior tasters. Varis has been Tongue-Burned for over four centuries."
        }
      ],
      "note": "The Distillery is not a formal guild with charters, dues, or legal recognition. It is an oral tradition organized around a particular set of techniques, maintained by a man who cannot write legibly and enforced by the mutual reliance of poisoners who have no one else to trust."
    },
    "rival": {
      "name": "Nerath the Soft-Voiced",
      "title": "Former Venom-Pourer, now Keeper of the Clean Hand",
      "status": "Exiled from the Distillery, operating independently from an unmarked laboratory in the Ironwood Deeps",
      "conflict": "Nerath was Varis's most brilliant Venom-Pourer  -  the only Toxicologist in the tradition's history to produce six original toxin formulations before the age of forty. When the fog began changing and the pharmacopoeia began to spoil, Nerath argued that Varis should abandon the old formula entirely: stop distilling fog-predator venom, stop trying to preserve the old pharmacopoeia, and start fresh with synthetic chemistry independent of the Frostwood's native rot. \"The fog is rewriting the rules,\" Nerath told the assembled Venom-Pourers at the Conclave of Spoiling, held in the Canopy-Laboratory three years ago. \"We should be writing new ones, not preserving the old ones in brine.\" Varis accused him of cowardice. Nerath accused Varis of senility  -  of being too old and too stubborn to see that his life's work was already dead, that the fog-predator venoms were not salvageable, that every vial Varis poured from the old pharmacopoeia was a waste of time that could go into finding alternatives. The argument ended with Nerath breaking a vial of his own formulation  -  a synthetic neurotoxin he had developed without predator-venom  -  against the laboratory floor and walking out. Half the Glass-Hands agreed with Nerath privately. None followed him publicly. Nerath now operates alone in the Ironwood Deeps, developing synthetic toxins from mineral chemistry rather than biological extraction. His poisons work  -  they are stable, reproducible, and unaffected by the changing fog  -  but they lack the potency of predator-derived venoms, and they have a signature that anyone with chemical training can identify. Varis calls Nerath's work \"factory poison  -  a blunt instrument for a blunt mind.\" Nerath calls Varis's work \"a museum devoted to a dead world.\" Neither has spoken to the other in three years. The junior distillers whisper that if the fog doesn't kill the Distillery, the schism between Varis and Nerath will.",
      "significance": "Nerath's break from the Distillery represents the tradition's deepest philosophical fracture: whether to adapt or preserve. If Varis dies before the fog crisis is resolved, Nerath is the only person with the knowledge, the formulations, and the institutional memory to run the Distillery  -  and he has already made it clear that he would dismantle the old pharmacopoeia entirely. The Venom-Pourers are terrified that the Distillery will die with its founder, split between a dead man's stubbornness and a traitor's ambition."
    },
    "crisisConnection": "<LoreLink termId=\"varis\">Varis</LoreLink> is presiding over the spoilage of his life's work: fog-predator venoms degrading in weeks rather than years, the entire Distillery pharmacopoeia turning unstable. His desperation project, distilling the *changing fog itself*, has produced reagents no one can characterize, and two of his apprentices  -  a young Tallyn Shaker named Kellan Soft-Hand and a veteran Glass-Hand named Torven the Steady, killed three months apart testing uncharacterized fog-distillates on themselves  -  have died for his obsession. Varis refuses to stop. He has spent four centuries mastering the Frostwood's chemistry, and he will master the new chemistry or die in the attempt. The Distillery's junior members are no longer certain which outcome they are rooting for."
  }
}

#### Animist

Source vtt-react/src/data/classes/animistData.js:230

{
  "variant": {
    "subraceName": "Oaken Florae",
    "title": "The Grove-Litany",
    "reframe": "The <LoreLink termId=\"florae\">Oaken Florae</LoreLink> pass as woodcraft travelers among the Tallyn edge-settlements, and their ancestral rite has adapted to a life in hiding: an ancestor is held in a *splinter-graft*, a cutting the size of a thumb, carried in a pocket and spoken to through the wood. The Grove-Litany is the only Animist tradition that can practice inside a city, because the ancestor travels with the bearer, concealed, and the grove is wherever the graft is planted.",
    "signatureAbility": {
      "name": "Graft-Communion",
      "description": "Ancestors are held in carried splinter-grafts; portable, concealable, and functional anywhere, including cities and dead stone where no Ancestor mound exists. The price is the graft must be planted and take root at least once a season to keep the ancestor oriented; a graft that never roots begins to go feral into the wood, and a feral ancestor answers with the tree's voice instead of its own."
    },
    "currentCrisisAngle": "The Oaken grafts have begun rooting *too eagerly*, pushing growth into whatever wood they touch, doors, beams, boat hulls, cart axles. A carried grandmother that blooms in a tavern doorpost exposes an entire hidden family line. The Grove-Litanies are burning their eldest grafts to keep them quiet, which the elders call pruning and the young call murder with extra steps.",
    "signatureQuote": {
      "text": "\"I carry my grandmother in a cutting the size of my thumb. She has been trying to root in a tavern doorpost for a month. If the door blooms, we are discovered. I have carried her across three provinces and I do not know how to explain to her that the safest thing is for her to sleep.\"",
      "speaker": "Graft-Bearer Lios the Hidden",
      "context": "A Grove-Litany, preparing to prune a grandmother out of a doorpost in a Tallyn market town"
    }
  },
  "edge": {
    "className": "Animist",
    "heritageId": "florae_unified",
    "description": "Pocket splinter-grafts carry ancestors, the only form that can practice inside a city.",
    "costDescription": "The graft needs periodic rooting and care.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "portable_grove_ancestor_anchor",
      "condition": {
        "type": "equipment",
        "value": "splinter_graft"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "graft_requires_periodic_rooting"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Animist",
    "heritageId": "florae_unified",
    "requirements": [
      "spirit_anchor",
      "communion_apprenticeship"
    ],
    "reason": "A memorial/spirit anchor and guided communion apprenticeship"
  },
  "order": {
    "orderName": "The Silent Throat",
    "founder": {
      "name": "Kael the Herd-Runner",
      "status": "Dead. The first of the three named Animist founders, an Ordu throat-singer who sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. The practice predates writing  —  it was navigation, not philosophy. The Ordu do not know who first sang the dead into the wind, only that when the stars went dark, Kael began singing ancestor-names and the herds still found their way.",
      "note": "Kael is canonically one of three co-founders of the Animist tradition (alongside Nyssa the Herbalist and Theron the Skald Scholar). The Ordu throat-singing tradition lives entirely in muscle-memory, teacher to student, voice to voice, and Kael is the root of that lineage. Later traditions (Skald, Mycellan, Astril, Athien) all trace their root technique to Kael's work."
    },
    "currentLeader": {
      "name": "Bayar Wind-Throat",
      "title": "Last Singer of the Old Route",
      "characterization": "An Ordu elder who still sings the migration-routes in the old tongue of the Long Before  —  the language that predates the dialect-fracture. Bayar has not spoken a word aloud in forty years; he communicates only through throat-sung overtones, the way the First Singer did. His vocal cords are calcified from decades of channeling ancestors who died before the stars went out. He is the living archive of the oldest form, and he watches the younger traditions drift further from the root with every generation  —  not with anger, but with the patience of someone who knows the dead will correct them eventually."
    },
    "headquarters": {
      "name": "The Sundrift Wind-Shrine (moving camp)",
      "locationId": "sundrift-vale"
    },
    "crisisConnection": "Bayar Wind-Throat is the only living Animist who still sings the pre-fracture language. The dialect-fracture is a problem of the dead themselves  —  the oldest dead (those who died before the <LoreLink termId=\"sundered_monoliths\">Monoliths</LoreLink> woke) speak clearly. The newer dead are confused, their voices layered with static no throat-singer can parse. Bayar suspects something is wrong with the threshold of death itself, and the Monoliths' awakening is not a cause but a symptom. He cannot prove this, because the evidence is in a language no one else remembers how to hear."
  }
}

#### Lunarch

Source vtt-react/src/data/classes/lunarchData.js:78

{
  "variant": {
    "subraceName": "Oaken",
    "title": "The Timber-Born",
    "reframe": "The <LoreLink termId=\"oken\">Oaken</LoreLink> pass as ordinary townsfolk with branch-bough arms hidden under city sleeves, and an Oaken Lunarch hides the parasite the same way: a second self kept out of sight, fed in the dark. Where the Briaren release the phases into the grove, the Oaken hold them in, and the held hours are repaid all at once in the first private moment, which is why the Oaken know their Lunarchs by their absences and their neighbours know them only as quiet.",
    "signatureAbility": {
      "name": "Cellar-Suppression",
      "description": "Phases stay banked through daylight and public hours; every banked hour is repaid at once when the host is finally alone, doubling the phase's effects and the host's recovery time. The Oaken are the most controlled variant in public and the most violent in private."
    },
    "currentCrisisAngle": "The dead moon's call is getting harder to hide. Oaken Lunarchs have started chanting in their sleep on starless city nights, and the Scribe-Cartel has begun paying for recordings, which the Oaken read as the first step toward the Forgotten treatment.",
    "signatureQuote": {
      "text": "\"My neighbours know me as a quiet clerk with a bad cough. The moon knows me as a door it has been knocking on for two hundred years.\"",
      "speaker": "Oaken Lunarch Vel-Sera the Unremarkable",
      "context": "An Oaken Lunarch, declining to attend a city service"
    }
  },
  "edge": {
    "className": "Lunarch",
    "heritageId": "florae_unified",
    "description": "You contain the parasite's outward signs through a prepared timber restraint.",
    "costDescription": "Releasing the restraint exacts strain.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "contain_phase_through_timber_restraint",
      "condition": {
        "type": "equipment",
        "value": "prepared_restraint"
      }
    },
    "cost": {
      "kind": "risk",
      "unit": "capability",
      "capability": "release_exacts_strain"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Lunarch",
    "heritageId": "florae_unified",
    "requirements": [
      "organism_bond",
      "host_compatibility",
      "identity_training"
    ],
    "reason": "An actual compatible host bond, containment and identity discipline"
  },
  "order": {
    "orderName": "The Lunar Communion",
    "founder": {
      "name": "<LoreLink termId=\"selene\">Selene of House Viridane</LoreLink>",
      "status": "Alive, but silent. Selene bargained with the wildwood fae in the moonlit groves and bound a lunar parasite to her bones. Three weeks ago she stopped speaking <LoreLink termId=\"florae\">Florae</LoreLink> and began whispering in a language the elders cannot identify, older than the fae-contract, older than the dead moon.",
      "note": "The first Lunarch. Her parasite was believed singular; the discovery that the dead moon is a fallen star  —  and the \"egg\" a folk misunderstanding  —  has rendered her silence terrifying rather than merely concerning."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"bri-vessela\">Regent Bri-Vessela</LoreLink>",
      "title": "Keeper of the Phases (acting)",
      "characterization": "A senior Briaren Florae who has led the Communion in Selene's silence with visible reluctance. She is a theologian, not a politician, and she took the regency only because the alternative was civil war between the caste-factions. She spends her nights at Selene's side, transcribing the dead-language whispers, and her days pretending she understands what they mean."
    },
    "headquarters": {
      "name": "The Moonlit Groves, deep Frostwood Reach",
      "locationId": "frostwood-reach"
    },
    "crisisConnection": "<LoreLink termId=\"bri-vessela\">Bri-Vessela</LoreLink> is presiding over a Communion that is, quietly, being *called*, the elder parasites communicating across hosts are synchronizing the phases of every Lunarch toward an unknown convergence. Selene's whispers are, <LoreLink termId=\"bri-vessela\">Bri-Vessela</LoreLink> has begun to suspect, not madness but *instructions*: the waking-song of the fallen star, and every Lunarch is a note in it. She does not know whether to stop the convergence or let it come, because no one alive remembers what wakes."
  }
}

Rare-route authored edges:

[]

## Groven (groven)

### cardFlavor

Once monumental living landmarks, their bodies were engineered by Fex alchemists who reshaped their stone forms to break their bond to the earth.

### overview

The Groven are stone-hewn humanoids indigenous to the snow-choked Cragjaw Peaks. Descended from the Thrumm and alchemically liberated from Fex servitude, the Morgh became primal, bulky stone ogre quarry-masons who carve cyclopean subterranean halls and peak-fastnesses, while the Amordjin evolved into tall, athletic, horned stone-trolls with slate-blue mineral skin, sweeping crown horns, dreadlocks, and under-fangs who dwell along terraced mountain hillsides and monumental suspension bridges, governing trade across the peaks.

### culturalBackground

Groven society is suspended in the vertical world of the Cragjaw Peaks. The Morgh inhabit cyclopean stone halls and subterranean vat-citadels carved deep into the high mountain peaks, vast geothermal-warmed cavern-halls where entire clans live, forge, and tend the Ancestor-Spans that anchor their fastnesses against whiteout blizzards. The Amordjin master monumental bridge-and-mountain architecture: spanning alpine peaks with grand suspension bridges, while families dwell in terraced stone homes carved along the mountain hillsides and cliffs. In Amordjin markets, trade is negotiated with stone-bead ledgers and brass balance scales; in Morgh halls, the old stone-deep customs endure in lichen-fiber knot-records and the slow rhythm of forge and cable.

### integrationNotes

{
  "actionPointSystem": "Groven abilities emphasize bridge-craft, stone resilience, long-limbed reach, and the spiritual legacy of the Still-Claiming. Their troll-kin heritage balances physical endurance with predatory agility.",
  "backgroundSynergy": "Groven excel in backgrounds emphasizing high mountain survival, bridge-tending, toll-negotiation, stone-lichen weaving, and Fex trade diplomacy.",
  "classCompatibility": "The Morgh and Amordjin are the people who took the alchemists' tools and made them a choice. Both are native to the Shaper (Torin's decision in a collapsing tunnel), to the Warden (the chosen chain), and to the Martyr as the Transmuted Burden — the Morgh anchor the line, the Amordjin span it. The Morgh are also native to the Berserker (Bloodhammer and Toll-war serum overclock), the Amordjin to the Chronarch (bridge-negotiation probability). No other people is native to these paths.",
  "fexricFriction": "Groven-Fex relations are a coiled spring of hatred and denial. Groven view the Fex as butchers who stole their ancestors' stone-heritage to breed them as mining tools, and they guard the Ancestor-Spans with specialized tolls targeting Fex caravans. Fex view Groven as runaway alchemical property that escaped the holdfasts. Yet, they are locked in a symbiotic crisis: Fex need Groven spans to transport geothermal coal, while Groven need Fex metalware to reinforce their bridges. This tension is a constant spark in the Cragjaw Peaks."
}

### diasporaVariation

Groven diaspora follows the Ancestor-Spans and the mercenary trade. Morgh Groven bridge-engineers work the Sundrift Vale crossing-points (heavier-built, heat-stressed, their stone-scale cracking in the dry steppe sun); Amordjin Groven diplomat-mercenaries serve in every regional court as bodyguards and span-advisors. A sea-serving Amordjin (a Groven who has served three generations aboard Iceheart ships) develops webless paddle-hands and a salt-weathered hide, and speaks Fex with a Merryn accent. Frostmaw remains the cultural heart; the diaspora measures its distance from it in generations of bone-knowledge lost.

### meaningfulTradeoffs

Groven possess stone-scale plating and superior climbing reach, but their mineral hide betrays them to flame, their long limbs leave defensive gaps, and their bodies sink in deep water, the stone that protects them also drags them down.

### currentCrisis


Three crises press upon the Groven in the present age, and none are spoken of openly.

The first is the cracking of the Ancestor-Spans. The Still-Claimed dead who form the bridges are centuries old, and the eternal blizzard that hides the peaks also wears at the stone. The oldest spans are developing fractures that no bridge-tender has been able to seal. The Morgh whisper that the mountain is taking back what it gave, that the Deep Thrum, the mineral consciousness of the Cragjaw Peaks, is slowly dying and can no longer sustain the dead who became its bones. The Amordjin refuse to confirm or deny this. The tolls continue. The spans continue. The fractures continue.

The second is the Lost Brood. The Groven have never repaid the debt of the broodlings left behind in the vats during the Vat-Breakers' escape. For centuries, the Groven told themselves the Lost Brood were certainly dead, that no Thrumm could survive decades of Fex experimentation. But recent expeditions into the lower tunnels have returned with evidence to the contrary: abandoned vat-chambers, fresh alchemical residue, and, in one case, a fragment of stone-scale that was unmistakably Groven, too fine for Thrumm, too recent to be ancient. The Deep Alchemists are still operating. The Lost Brood may still be alive. And the Groven must decide whether to descend, at last, and finish what the Vat-Breakers started, or admit that they have spent centuries rationalizing cowardice as patience.

The third is the Sundered Monolith in the Subterranean Vault. The shard hums louder each year, and the stone around it has begun to grow warm, the first warmth the Vault has known since Keth Amar's bargain was sealed. The Amordjin elders debate what this means in closed council. The Morgh bridge-tenders feel it in their bones: a vibration in the oldest spans, like a heartbeat accelerating. The mountain is changing. Keth Amar's grip on the world is tightening. And the Groven, who have spent centuries tending bridges that span a dying peak, must decide whether their role is to maintain what was built, or to build something new before the old stone fails.
  

### Morgh Groven — morgh_groven

Native: Martyr, Shaper, Warden, Berserker.

**description:** Massive, monolithic, and primal, the Morgh are rock-hewn stone ogre-like humanoids carrying ancient Thrumm blood closest to the surface. Standing 1.50m to 1.60m (4'11" to 5'3"), they are broad-shouldered, deep-chested, and immovable, built as cyclopean quarry-masons and subterranean hall-builders of Cragjaw Peaks. Their stone-skin grows in dense, rough cracked granite plates across shoulders, spine, and limbs. Their speech is slow and resonant, vibrating like grinding tectonic plates. They inhabit cyclopean stone halls and subterranean vat-fortresses carved deep into the mid-crag, gathering around common magma-kilns and forging megalithic stonework. A Morgh sentinel pulls a heavy ox-hide cowl over their craggy stone brow, leans on a staff, and does not move for days. The Morgh have been the Groven's bedrock craftsmen, hall-keepers, and forge-laborers since the Vat-Breakers' Revolt.

**culturalBackground:** The Morgh trace their lineage to the Groven who fled the vats but could not shed the old Thrumm instincts, the need to build, to guard, to bear weight in silence. Their hall-hearths are cyclopean subterranean halls carved deep into the Cragjaw Peaks, communal caverns heated by geothermal vents, shared among extended family around one great central fire. They speak the old earth tongue in the hall depths, reserving Common for dealings with Amordjin and outsiders. Their children learn stone-quarrying and bridge-tending before they learn bridge-tolling. Their elders die in the chasms, becoming the foundations of spans their grandchildren will walk.

Subrace authored keys: id, name, crest, illustration, illustrationCaption, illustrations, visualDescription, tooltipSummary, description, culturalBackground, statModifiers, baseStats, savingThrowModifiers, traits.

#### Martyr

Source vtt-react/src/data/classes/martyrData.js:82

{
  "variant": {
    "subraceName": "Morgh Groven",
    "title": "The Transmuted Burden",
    "reframe": "The <LoreLink termId=\"groven\">Groven</LoreLink> were shaped in Fex vats as biological labor-vessels, bred to carry the crushing dark of the deep mines without asking why. For a Morgh to become a Martyr is an act of sublime reclamation: \"We were built to endure the crushing dark; now we choose to endure it so others may see the light.\" Their thick stone-scaled frames and unnatural stamina make them immovable anchors on the battlefield, and the endurance that was once their makers' instrument becomes a sacred art. Where the Solari imitate Aex's wound, the Morgh imitate her stance: feet planted, weight taken, nothing behind them allowed to fall.",
    "signatureAbility": {
      "name": "Load-Bearing",
      "description": "Devotion-generation scales with the weight behind the Martyr: the more allies standing within their guard, the faster the Devotion fills, and Devotion decay halts entirely while the Morgh holds a fixed position (a doorway, a span, a shield-line). The Morgh cannot generate Devotion while retreating."
    },
    "currentCrisisAngle": "The Ancestor-Spans are cracking, and the Morgh Martyrs read every groaning bridge as kin. They have begun refusing to leave spans they can feel failing, holding collapsing crossings so caravans can cross, and the noble houses have noticed: a Morgh Martyr is the most conscriptable creature in the world, an anchor that cannot be ordered to move because standing still is its calling. Several houses have stopped calling it conscription and started calling it garrison.",
    "signatureQuote": {
      "text": "\"The vats taught me to carry weight without asking why. Aex taught me to ask. I still carry it. The difference is that now it is mine to give.\"",
      "speaker": "Span-Held Brannoc Vat-Risen",
      "context": "A Morgh Martyr, refusing to leave a failing bridge"
    }
  },
  "edge": {
    "className": "Martyr",
    "heritageId": "morgh_groven",
    "description": "Forge and bridge contact braces a guard position for nearby allies.",
    "costDescription": "Retreat or repositioning ends the brace.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "brace_guard_position_for_allies",
      "condition": {
        "type": "position",
        "value": "guard_position"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "retreat_ends_brace"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Martyr",
    "heritageId": "morgh_groven",
    "requirements": [
      "protective_interface",
      "witness_training"
    ],
    "reason": "Actual Witness training or a compatible trained furnace method",
    "method": "witness"
  },
  "order": {
    "orderName": "The Covenant of the Scar",
    "founder": {
      "name": "<LoreLink termId=\"sera\">Sera Solvan</LoreLink>",
      "status": "Dead, these many ages. She carved her sacrificed child's name into her forearm with volcanic obsidian, the wound healed into a glowing solar scar, and she became the first Martyr. Her scarred forearm is preserved beneath <LoreLink termId=\"emberspire\">Emberspire</LoreLink>, still faintly warm.",
      "note": "<LoreLink termId=\"sera\">Sera</LoreLink>'s covenant was personal, a mother's refusal to let her child be forgotten. The noble houses have spent two centuries turning that personal grief into an industrial resource. Sera would not recognize what her prayer has become."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"sol-kaessen\">Vigil-Mother Sol-Kaessen</LoreLink>",
      "title": "Keeper of the First Scar",
      "characterization": "A Solari woman who has absorbed so much suffering that she glows faintly in the dark, the Devotion made visible. She is the Covenant's moral center and its greatest hypocrisy: she genuinely believes in the willing sacrifice, and she has presided over the noble houses' conscription program without intervening, because the conscripted Martyrs keep the people of <LoreLink termId=\"sundale\">Sundale</LoreLink> alive. She has not decided whether she is a saint or a collaborator."
    },
    "headquarters": {
      "name": "The Scar-Shrine, beneath Emberspire",
      "locationId": "emberspire"
    },
    "crisisConnection": "<LoreLink termId=\"sol-kaessen\">Sol-Kaessen</LoreLink> is being crushed between the Covenant's founding principle (willing sacrifice) and the houses' practice (conscripted child-training). The conscripted Martyrs heal less cleanly, and several have begun *absorbing without consent*, pulling suffering from allies who did not offer it, the Devotion corrupting into something predatory. <LoreLink termId=\"sol-kaessen\">Sol-Kaessen</LoreLink> suspects the houses know and consider it a feature. She is one quiet order away from open schism with Sundale's theocracy."
  }
}

#### Shaper

Source vtt-react/src/data/classes/shaperData.js:62

{
  "variant": {
    "subraceName": "Morgh Groven",
    "title": "The Vat-Sculpted",
    "reframe": "The <LoreLink termId=\"groven\">Morgh Groven</LoreLink> were *made* by body-sculpting, the Deep Alchemists' vats reshaped their <LoreLink termId=\"thrumm\">Thrumm</LoreLink> root-stock into the heavy-scaled Morgh form. A Morgh Shaper does not learn body-sculpting; they *inherit* it, the alchemical heritage in their blood re-awakened. Their shaping is the tradition's most visceral irony: the race that was sculpted against its will, now sculpting *itself*.",
    "signatureAbility": {
      "name": "Vat-Recursion",
      "description": "Shaping forms draw on the Morgh's dormant alchemical substrate, the same serums the Deep Alchemists used to create them. The Morgh can sculpt with a precision and violence no Mimir can match, hardening stone-scale into weapon-plate or softening it for flexibility. The regenerative Thrumm biology makes them the most durable Shapers."
    },
    "currentCrisisAngle": "Convergence Collapse among the Morgh risks *re-awakening the vat-protocols entirely*, a fully converged Morgh Shaper begins to resemble the Deep Alchemists' *original design intent*, a perfect servitor, before the will reasserts. The Vat-Breakers' Guild considers this the ultimate desecration: a Groven voluntarily returning to the vat-state. Worse, the Deep Alchemists have heard, and they are *very interested* in a Groven who can re-enter the vat without being put there.",
    "signatureQuote": {
      "text": "\"My makers sculpted me to kneel. I sculpt myself to stand. The danger is that the clay remembers the first shape, and so do I. Every form I take, the old one whispers.\"",
      "speaker": "Morgh Veyr Anvil-Sculpted",
      "context": "A Morgh Shaper, the morning after a convergence that left him briefly obedient"
    }
  },
  "edge": {
    "className": "Shaper",
    "heritageId": "morgh_groven",
    "description": "The reclaimed vat-derived interface holds one deliberate load-bearing form.",
    "costDescription": "Reserve/tissue cost and risk of old conditioning under overload.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "hold_load_bearing_form",
      "condition": {
        "type": "state",
        "value": "deliberate_form"
      }
    },
    "cost": {
      "kind": "risk",
      "unit": "capability",
      "capability": "reserve_tissue_cost_conditioning"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Shaper",
    "heritageId": "morgh_groven",
    "requirements": [
      "shaping_interface",
      "transformation_training"
    ],
    "reason": "Successful body-interface transformation and subsequent training"
  },
  "order": {
    "orderName": "The Form-Convergence",
    "founder": {
      "name": "Veyra",
      "status": "Living. Veyra, a Broken Mimir trade envoy, founded the Form-Convergence and still leads it from the Shaping Hall at Frostmaw. The art began with Torin, a Morgh Groven miner. During the First Thermal War, Torin was trapped in a collapsing Deep Alchemist tunnel; with his limbs too short to brace the widening crack, he drank a cask of raw alchemical sulfur-clay  -  the same compound the Deep Alchemists had used to reshape Thrumm into Groven centuries before  -  and commanded his skeleton to grow. His arms lengthened, his spine thickened, his bones calcified into load-bearing pillars, and he held the tunnel for six hours until rescue came, and the Morgh elders founded the Shaping Hall at Frostmaw Crag in his name. Veyra learned his voluntary bone-sculpting from the Groven masters, recognized in it a reclamation of the Deep Alchemists' violation, and synthesized it with Mimir kinetic forms. Sylvanus later became the first to master all six Forms.",
      "note": "The Shaper's founding principle is reclamation: the Deep Alchemists reshaped the Thrumm into Groven by force; Veyra taught that the body could be reshaped by choice. Torin's tunnel-collapse survival is the founding act; Veyra's synthesis is the founding of the tradition."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"veyra\">Form-Matriarch Veyra the Merged</LoreLink>",
      "title": "Keeper of the Six Forms",
      "characterization": "Ancient, patient, and more stone than flesh. <LoreLink termId=\"veyra\">Veyra</LoreLink> was a Broken Mimir trade envoy on the Ancestor-Spans who learned the Shaping art from Groven masters and brought it home to the Frostwood, becoming the bridge between two body-modifying cultures. Her semi-crystalline skin is more calcified each year. She leads the Convergence from the Shaping Hall at Frostmaw and teaches the six Forms in sequence, insisting no student attempt convergence until they have mastered each form alone. The young convergers consider this archaic. She considers their burnout rate the proof she is right."
    },
    "headquarters": {
      "name": "The Shaping Hall, Frostmaw Holdfast",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"veyra\">Veyra</LoreLink> is losing the argument. The purist-vs-converger schism is worsening, and Convergence Collapse is killing the young Mimir Shapers, burning through crystalline skin in years rather than centuries. <LoreLink termId=\"veyra\">Veyra</LoreLink>'s slow method  -  adapted from Groven bone-sculpting to Mimir fluid transformation  -  works, but the era does not allow for slow: the Frostwood mist is learning to hide, the Ancestor-Spans are cracking, and the world demands Shapers who can converge *now*. <LoreLink termId=\"veyra\">Veyra</LoreLink> is being forced to teach the dangerous convergence she spent centuries proving was premature, because the alternative is a tradition of pure-form specialists who cannot meet the moment."
  }
}

#### Warden

Source vtt-react/src/data/classes/wardenData.js:76

{
  "variant": {
    "subraceName": "Morgh Groven",
    "title": "The Vat-Grounded",
    "reframe": "The <LoreLink termId=\"groven\">Morgh Groven</LoreLink> invented the chain-graft, and for them the chains are *Vat-Sleep grounding*, a deliberate echo of the containment they shattered in the revolt. A Morgh Warden tethers abominations to *remember what imprisonment felt like*, and to ensure nothing else is ever contained the way they were. The iron in their bones is, for the Morgh, a chosen scar rather than an inflicted one.",
    "signatureAbility": {
      "name": "Vat-Grounding",
      "description": "Tether-Tension builds faster against enemies attempting to *restrain or contain* allies, the Morgh Warden's ancestral reflex. The chains ground the Warden against the very forces that once held their people, and the irony of voluntarily wearing chains is, to the Morgh, the entire point."
    },
    "currentCrisisAngle": "The chains are becoming brittle in the Cragjaw cold, and the Morgh read this with particular bitterness: the iron that helped them *escape* the vats is now failing, and the Fex Alchemite's proposed chardalyn replacement is the alloy of their *creators*. Several Morgh Wardens have refused the chardalyn chains outright, choosing to fight with failing iron rather than wear their makers' metal.",
    "signatureQuote": {
      "text": "\"My grandmother shattered her vat with these chains. I will not reforge them in the metal of the men who built the vat. Let the iron fail. I will fail standing.\"",
      "speaker": "Morgh Veyr Chain-Breaker",
      "context": "A Morgh Warden, refusing the chardalyn replacement"
    }
  },
  "edge": {
    "className": "Warden",
    "heritageId": "morgh_groven",
    "description": "Alaric's chosen scar and load-bearing physiology brace one declared containment point.",
    "costDescription": "Commitment with drag/recoil risk.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "brace_declared_containment_point",
      "condition": {
        "type": "position",
        "value": "containment_point"
      }
    },
    "cost": {
      "kind": "risk",
      "unit": "capability",
      "capability": "commitment_drag_recoil"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Warden",
    "heritageId": "morgh_groven",
    "requirements": [
      "graft_surgery",
      "anatomy_compatibility",
      "load_training"
    ],
    "reason": "Actual graft surgery, compatible anatomy and load training"
  },
  "order": {
    "orderName": "The Bound",
    "founder": {
      "name": "<LoreLink termId=\"alaric\">Alaric the Law-Keeper</LoreLink>",
      "status": "Alive. The <LoreLink termId=\"groven\">Groven</LoreLink> mine-guard who drove an ore-hauling chain through his own forearm into the largest Deep Alchemist specimen and held for three days still leads the Bound, the chain rusted into his bone, his regenerative Thrumm-derived biology keeping him functional long past any normal Groven lifespan. He said no to removing it then. He has said no every day since.",
      "note": "<LoreLink termId=\"alaric\">Alaric</LoreLink> founded the Bound on a single principle: the Warden exists to ensure nothing is ever contained the way the Groven were contained in the vats. The chain is chosen, not inflicted. That distinction is the entire order."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"alaric\">Alaric the Law-Keeper</LoreLink>",
      "title": "The First Bound",
      "characterization": "Ancient, immovable, and more iron than flesh, <LoreLink termId=\"alaric\">Alaric</LoreLink>'s regenerative biology has integrated the chain so thoroughly that removing it would now kill him. He leads from <LoreLink termId=\"frostmaw_holdfast\">Frostmaw Holdfast</LoreLink>'s lower tunnels and trains every Warden personally in the graft-rite. He is grieved, specifically, by the chardalyn proposal: the alloy of his people's makers, offered as salvation."
    },
    "headquarters": {
      "name": "The Chain-Hold, Frostmaw Holdfast (lower tunnels)",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"alaric\">Alaric</LoreLink> is watching the Bound fracture along the same fault-line that defined his own founding: the Fex Alchemite propose chardalyn chains (the makers' metal), the Groven refuse (the vat-iron must be honored), and the iron that both factions depend on is becoming brittle in the Cragjaw cold. <LoreLink termId=\"alaric\">Alaric</LoreLink> alone has the authority to settle the schism, and he is using it to refuse chardalyn absolutely, even as the brittle-iron casualties mount. The Bound are losing Wardens faster than <LoreLink termId=\"alaric\">Alaric</LoreLink> can train them, and his principled refusal may be the order's epitaph."
  }
}

#### Berserker

Source vtt-react/src/data/classes/berserkerData.js:66

{
  "variant": {
    "subraceName": "Morgh Groven",
    "title": "The Vat-Woken",
    "reframe": "The <LoreLink termId=\"groven\">Morgh Groven</LoreLink> were never meant to rage. The <LoreLink termId=\"deep_alchemists\">Fex Deep Alchemists</LoreLink> engineered the <LoreLink termId=\"thrumm\">Thrumm</LoreLink> root-stock for docility, the one trait that made them perfect vat-subjects. When the first Groven shattered their containment vessels in the <LoreLink termId=\"vat_breakers_guild\">Vat-Breakers' revolt</LoreLink>, they discovered something the Alchemists had accidentally bred into them: the regenerative Thrumm biology, supercharged by a thousand years of alchemical saturation, could be pushed past its design limit. A Morgh Berserker does not burn blood, they burn the dormant alchemy still circulating in their stone-scaled veins. The serums that were meant to make them obedient instead make them, when ignited, catastrophically free. Their Rage tastes of reagents and old Thrumm grief.",
    "signatureAbility": {
      "name": "Vat-Overclock",
      "description": "Rage builds from the Groven's regenerative biology fighting itself. Each wound the Groven regenerates dumps waste-heat into serum-saturated blood, meaning a Morgh Berserker ignites fastest when they are being *healed*, the opposite of every other tradition. The alchemy that was meant to suppress them becomes, under pressure, the engine of their liberation."
    },
    "currentCrisisAngle": "The Morgh Groven Berserkers are few, and feared by their own kind. The Vat-Breakers' Guild considers Vat-Overclock a desecration, re-igniting the very alchemy their ancestors bled to escape. Worse, word has reached the sealed laboratories beneath <LoreLink termId=\"frostmaw_holdfast\">Frostmaw Holdfast</LoreLink>. To the Deep Alchemists, a Groven Berserker is not a threat, it is a successful prototype, generations overdue for retrieval. The Vat-Woken who vanish from the Ancestor-Spans are not, the Guild suspects, running. They are being collected.",
    "signatureQuote": {
      "text": "\"They made us to kneel. The serum forgot its purpose before I did. When I burn, I burn the leash they wrote into my blood.\"",
      "speaker": "Gareth Anvil-Born",
      "context": "The first Vat-Woken, three days before he vanished from the lower sumps"
    }
  },
  "edge": {
    "className": "Berserker",
    "heritageId": "morgh_groven",
    "description": "Serum overclock converts a defined regenerative event into Rage.",
    "costDescription": "Consumes biological reserve; healing cannot infinitely loop generation.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "convert_regeneration_to_rage",
      "condition": {
        "type": "state",
        "value": "regenerative_event"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "consumes_biological_reserve"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Berserker",
    "heritageId": "morgh_groven",
    "requirements": [
      "metabolic_induction",
      "conditioning"
    ],
    "reason": "Compatible metabolic induction and conditioning"
  },
  "order": {
    "orderName": "The Bloodhammer Line",
    "founder": {
      "name": "<LoreLink termId=\"grum-bloodhammer\">Grum Bloodhammer</LoreLink>",
      "status": "Dead, ages now. His forge still burns in the <LoreLink termId=\"emberspire\">Emberspire</LoreLink> tunnels, tended by a single elderly Berserker who has not spoken in sixty years.",
      "note": "The first to weaponize the Rage. He did not ignite it first  -  the Hunger Pact was always in Skald blood. But Grum was the first to survive turning a survival reflex into a weapon. The Skald who stayed in Nordhalla tell it differently: they say he was sacrificed by his lords to test whether a man could burn and stand. The disagreement is theological and unresolved."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"hark-ash-hammer\">Blood-Priest Hark Ash-Hammer</LoreLink>",
      "title": "Keeper of the First Forge",
      "characterization": "A Pact-sworn Skald elder who has maintained the Forge of <LoreLink termId=\"grum-bloodhammer\">Grum</LoreLink> for forty years. He personally countersigned the Skald Council's execution order against the Unbound, and has not slept soundly since. He carries <LoreLink termId=\"grum-bloodhammer\">Grum</LoreLink>'s original hammer, too heavy for any living Berserker to lift, which he considers the point of carrying it."
    },
    "headquarters": {
      "name": "The Harath-Vault Arenas",
      "locationId": "harath_vault"
    },
    "crisisConnection": "Hark signed the Unbound execution order and leads the hunt for the deep-tunnel settlement. Privately, he is troubled: the Unbound ignite *without* the Pact, which means the Hunger Pact was never the source of the Heat, only the leash. If the Unbound are right, Hark has spent forty years enforcing a lie. He has not said this aloud. The hammer grows heavier each year."
  }
}

Rare-route authored edges:

[]

### Amordjin Groven — ithran_groven

Native: Martyr, Shaper, Warden, Chronarch.

**description:** Tall, athletic stone-trolls with slate-blue mineral skin, sweeping crown horns, and under-fangs, the Amordjin stand 2.00m–2.18m (6'7"–7'2"). Cragspan is their bridge/hillside civic center; Bridge-Peak and Cloud-Gantry are site or precinct names, not contradictory universal capitals. They negotiate tolls, maintain gantries and Ancestor-Spans, and practice diplomacy without abandoning the maintained remains on which their trade depends.

**culturalBackground:** The Amordjin trace their lineage to the broodlings most thoroughly transformed by the Fex serums, the ones the Deep Alchemists considered their greatest success. They inherited the long reach, the fine slate-blue mineral skin, the quick mind, and the curse of knowing exactly what was done to them. Their grand settlements combine soaring suspension bridges spanning jagged peaks with terraced stone homes carved directly into the mountain hillsides and cliffs. They speak Common with silvered eloquence, reserving old stone dialects for formal rites. Their children are taught bridge architecture and negotiation before they are taught survival, turning the vertigo-inducing heights into an unassailable bastion of trade.

**currentCrisis:** The toll revenues are collapsing. Surface trade routes long buried by the eternal blizzard have begun re-emerging as the snow-pack shifts, and caravans are finding alternate paths that bypass the Ancestor-Spans entirely. The Amordjin toll-keepers have responded by doubling rates on the remaining forced crossings, accelerating the very exodus they seek to prevent. The Stone-Moot is divided: some Amordjin argue for lowering tolls to lure caravans back, others for dispatching Morgh bridge-wardens to discourage rival routes, and a growing minority whisper that the Groven must finally leave their spans and integrate with the surface world whose commerce they have monopolized for centuries. The Amordjin are the only Groven with the diplomacy to navigate this transition, and the ones with the most to lose if the spans become obsolete.

Subrace authored keys: id, name, crest, illustration, illustrationCaption, illustrations, visualDescription, tooltipSummary, description, culturalBackground, currentCrisis, baseTraits, statModifiers, traits, baseStats, savingThrowModifiers.

#### Martyr

Source vtt-react/src/data/classes/martyrData.js:98

{
  "variant": {
    "subraceName": "Amordjin Groven",
    "title": "The Span-Kept",
    "reframe": "The long-limbed Amordjin are the Groven's bridge-builders, toll-keepers, and span-negotiators, the caste that learned early that a bridge is a promise that others will cross safely. An Amordjin Martyr carries that promise into their own flesh: every wound absorbed is a span they held, tallied in stone beads and silver wire woven into their braids, each bead a crossing that did not fall. They are not the heaviest Martyrs, but they are the most deliberate, a tallied endurance measured out and spent with an engineer's precision. Their silver-wire scars are read across the Cragjaw the way other cultures read a ledger of honors.",
    "signatureAbility": {
      "name": "Tally-Ledger",
      "description": "Devotion is tracked as tally-beads: each absorbed strike adds a bead, and spending Devotion transfers the load outward as barriers around allies within the Martyr's span (their reach) rather than inward as personal healing. When the tally is spent, every ally who stood within the span gains its protection."
    },
    "currentCrisisAngle": "The Amordjin count the crossings now. Every span that fails is a promise they cannot keep, and the conscription has put Martyrs on battlefields where the next crossing is measured in enemy axes rather than feet. The Amordjin elders have started a new tally in the span-moots: crossing-guarantees kept against those broken. The ledger is slipping, and the Amordjin are the only people in the Cragjaw who find that more frightening than the blizzard.",
    "signatureQuote": {
      "text": "\"I have held one thousand and eleven crossings. I remember every one that fell. Keeping count is not pride. It is the only way to know what I still owe the bridge.\"",
      "speaker": "Tally-Keeper Syl-Ith Vess",
      "context": "An Amordjin Martyr, reading the bead-ledger in her braid before a battle"
    }
  },
  "edge": {
    "className": "Martyr",
    "heritageId": "ithran_groven",
    "description": "Bridge guarantees distribute a finite protective release across a declared span.",
    "costDescription": "Wider distribution reduces per-target protection.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "distribute_protective_release",
      "condition": {
        "type": "position",
        "value": "declared_span"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "wider_distribution_reduces_protection"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Martyr",
    "heritageId": "ithran_groven",
    "requirements": [
      "protective_interface",
      "witness_training"
    ],
    "reason": "Actual Witness training or a compatible trained furnace method",
    "method": "witness"
  },
  "order": {
    "orderName": "The Covenant of the Scar",
    "founder": {
      "name": "<LoreLink termId=\"sera\">Sera Solvan</LoreLink>",
      "status": "Dead, these many ages. She carved her sacrificed child's name into her forearm with volcanic obsidian, the wound healed into a glowing solar scar, and she became the first Martyr. Her scarred forearm is preserved beneath <LoreLink termId=\"emberspire\">Emberspire</LoreLink>, still faintly warm.",
      "note": "<LoreLink termId=\"sera\">Sera</LoreLink>'s covenant was personal, a mother's refusal to let her child be forgotten. The noble houses have spent two centuries turning that personal grief into an industrial resource. Sera would not recognize what her prayer has become."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"sol-kaessen\">Vigil-Mother Sol-Kaessen</LoreLink>",
      "title": "Keeper of the First Scar",
      "characterization": "A Solari woman who has absorbed so much suffering that she glows faintly in the dark, the Devotion made visible. She is the Covenant's moral center and its greatest hypocrisy: she genuinely believes in the willing sacrifice, and she has presided over the noble houses' conscription program without intervening, because the conscripted Martyrs keep the people of <LoreLink termId=\"sundale\">Sundale</LoreLink> alive. She has not decided whether she is a saint or a collaborator."
    },
    "headquarters": {
      "name": "The Scar-Shrine, beneath Emberspire",
      "locationId": "emberspire"
    },
    "crisisConnection": "<LoreLink termId=\"sol-kaessen\">Sol-Kaessen</LoreLink> is being crushed between the Covenant's founding principle (willing sacrifice) and the houses' practice (conscripted child-training). The conscripted Martyrs heal less cleanly, and several have begun *absorbing without consent*, pulling suffering from allies who did not offer it, the Devotion corrupting into something predatory. <LoreLink termId=\"sol-kaessen\">Sol-Kaessen</LoreLink> suspects the houses know and consider it a feature. She is one quiet order away from open schism with Sundale's theocracy."
  }
}

#### Shaper

Source vtt-react/src/data/classes/shaperData.js:78

{
  "variant": {
    "subraceName": "Amordjin Groven",
    "title": "The Span-Dancer",
    "reframe": "The long-limbed <LoreLink termId=\"groven\">Amordjin Groven</LoreLink>, the bridge-builders, the diplomats, contribute the *kinetic* half of the Shaper art. An Amordjin Shaper runs the Ancestor-Spans as a dance, building Flux from the momentum of bridge-running, then channels that momentum into extended-limb transformations. Where the Morgh sculpt for durability, the Amordjin sculpt for *reach and speed*.",
    "signatureAbility": {
      "name": "Span-Momentum",
      "description": "Flux generates dramatically faster from movement across the Shaper's own architecture, running a familiar bridge, swinging between spans. The Amordjin are the tradition's momentum-specialists, and their forms emphasize reach, wield, and the bone-knowledge of load-distribution that makes their bridges hold."
    },
    "currentCrisisAngle": "The Ancestor-Spans are cracking (the Warden/Gambit crisis), and the Amordjin Span-Dancers are losing their *kinetic substrate*, the bridges that generate their Flux are failing. Young Amordjin are running the cracking spans anyway, chasing momentum from structures that may collapse beneath them. The convergence of failing bridges and convergence-collapse is producing a generation of Amordjin Shapers who dance on the edge of two collapses at once.",
    "signatureQuote": {
      "text": "\"My grandmother's span made me fast. Her span is failing. I run it anyway, the falling is faster than the standing, and the Flux does not care which one feeds it.\"",
      "speaker": "Ith-Sparra Span-Dancer",
      "context": "An Amordjin Shaper, choosing which cracking span to run before a battle"
    }
  },
  "edge": {
    "className": "Shaper",
    "heritageId": "ithran_groven",
    "description": "Bridge-running adaptation flows through a prepared momentum route.",
    "costDescription": "Bracing or restraint interrupts the momentum edge.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "flow_prepared_momentum_route",
      "condition": {
        "type": "position",
        "value": "prepared_route"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "bracing_interrupts_momentum"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Shaper",
    "heritageId": "ithran_groven",
    "requirements": [
      "shaping_interface",
      "transformation_training"
    ],
    "reason": "Successful body-interface transformation and subsequent training"
  },
  "order": {
    "orderName": "The Form-Convergence",
    "founder": {
      "name": "Veyra",
      "status": "Living. Veyra, a Broken Mimir trade envoy, founded the Form-Convergence and still leads it from the Shaping Hall at Frostmaw. The art began with Torin, a Morgh Groven miner. During the First Thermal War, Torin was trapped in a collapsing Deep Alchemist tunnel; with his limbs too short to brace the widening crack, he drank a cask of raw alchemical sulfur-clay  -  the same compound the Deep Alchemists had used to reshape Thrumm into Groven centuries before  -  and commanded his skeleton to grow. His arms lengthened, his spine thickened, his bones calcified into load-bearing pillars, and he held the tunnel for six hours until rescue came, and the Morgh elders founded the Shaping Hall at Frostmaw Crag in his name. Veyra learned his voluntary bone-sculpting from the Groven masters, recognized in it a reclamation of the Deep Alchemists' violation, and synthesized it with Mimir kinetic forms. Sylvanus later became the first to master all six Forms.",
      "note": "The Shaper's founding principle is reclamation: the Deep Alchemists reshaped the Thrumm into Groven by force; Veyra taught that the body could be reshaped by choice. Torin's tunnel-collapse survival is the founding act; Veyra's synthesis is the founding of the tradition."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"veyra\">Form-Matriarch Veyra the Merged</LoreLink>",
      "title": "Keeper of the Six Forms",
      "characterization": "Ancient, patient, and more stone than flesh. <LoreLink termId=\"veyra\">Veyra</LoreLink> was a Broken Mimir trade envoy on the Ancestor-Spans who learned the Shaping art from Groven masters and brought it home to the Frostwood, becoming the bridge between two body-modifying cultures. Her semi-crystalline skin is more calcified each year. She leads the Convergence from the Shaping Hall at Frostmaw and teaches the six Forms in sequence, insisting no student attempt convergence until they have mastered each form alone. The young convergers consider this archaic. She considers their burnout rate the proof she is right."
    },
    "headquarters": {
      "name": "The Shaping Hall, Frostmaw Holdfast",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"veyra\">Veyra</LoreLink> is losing the argument. The purist-vs-converger schism is worsening, and Convergence Collapse is killing the young Mimir Shapers, burning through crystalline skin in years rather than centuries. <LoreLink termId=\"veyra\">Veyra</LoreLink>'s slow method  -  adapted from Groven bone-sculpting to Mimir fluid transformation  -  works, but the era does not allow for slow: the Frostwood mist is learning to hide, the Ancestor-Spans are cracking, and the world demands Shapers who can converge *now*. <LoreLink termId=\"veyra\">Veyra</LoreLink> is being forced to teach the dangerous convergence she spent centuries proving was premature, because the alternative is a tradition of pure-form specialists who cannot meet the moment."
  }
}

#### Warden

Source vtt-react/src/data/classes/wardenData.js:92

{
  "variant": {
    "subraceName": "Amordjin Groven",
    "title": "The Span-Tether",
    "reframe": "The long-limbed <LoreLink termId=\"groven\">Amordjin Groven</LoreLink>, the bridge-builders, treat the chain-graft as *distributed architecture*: a Warden's tether-network extended across their reach, anchoring multiple foes the way a bridge distributes load. An Amordjin Warden does not duel a single abomination; they *triangulate*, holding several at once through the bone-knowledge of stress and span.",
    "signatureAbility": {
      "name": "Span-Tether",
      "description": "Tether-Tension can be *distributed* across multiple tethered enemies rather than focused on one; the Amordjin are the tradition's only multi-target Wardens, holding a perimeter the way their bridges hold a gorge. The cost: each additional tether reduces the tension available to each."
    },
    "currentCrisisAngle": "The cracking Ancestor-Spans have destabilized the Amordjin's architectural instincts, their bone-knowledge of load is being contradicted by spans that fail *earlier than they should*. Several Amordjin Wardens have mis-judged a tether-load because their instincts, calibrated to failing bridges, are now wrong about everything. The tradition's best multi-target Wardens are becoming unreliable in the one skill that defines them.",
    "signatureQuote": {
      "text": "\"I read load the way your scholar reads ink. The ink has started lying. My bridges fall early. My tethers snap late. I no longer trust the language I was born speaking.\"",
      "speaker": "Ith-Sparra Span-Warden",
      "context": "An Amordjin Warden, after a misjudged tether-load cost an ally"
    }
  },
  "edge": {
    "className": "Warden",
    "heritageId": "ithran_groven",
    "description": "Bridge/load knowledge distributes a finite holding load across a declared span.",
    "costDescription": "Additional targets divide the available tension.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "distribute_finite_holding_load",
      "condition": {
        "type": "position",
        "value": "declared_span"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "targets_divide_tension"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Warden",
    "heritageId": "ithran_groven",
    "requirements": [
      "graft_surgery",
      "anatomy_compatibility",
      "load_training"
    ],
    "reason": "Actual graft surgery, compatible anatomy and load training"
  },
  "order": {
    "orderName": "The Bound",
    "founder": {
      "name": "<LoreLink termId=\"alaric\">Alaric the Law-Keeper</LoreLink>",
      "status": "Alive. The <LoreLink termId=\"groven\">Groven</LoreLink> mine-guard who drove an ore-hauling chain through his own forearm into the largest Deep Alchemist specimen and held for three days still leads the Bound, the chain rusted into his bone, his regenerative Thrumm-derived biology keeping him functional long past any normal Groven lifespan. He said no to removing it then. He has said no every day since.",
      "note": "<LoreLink termId=\"alaric\">Alaric</LoreLink> founded the Bound on a single principle: the Warden exists to ensure nothing is ever contained the way the Groven were contained in the vats. The chain is chosen, not inflicted. That distinction is the entire order."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"alaric\">Alaric the Law-Keeper</LoreLink>",
      "title": "The First Bound",
      "characterization": "Ancient, immovable, and more iron than flesh, <LoreLink termId=\"alaric\">Alaric</LoreLink>'s regenerative biology has integrated the chain so thoroughly that removing it would now kill him. He leads from <LoreLink termId=\"frostmaw_holdfast\">Frostmaw Holdfast</LoreLink>'s lower tunnels and trains every Warden personally in the graft-rite. He is grieved, specifically, by the chardalyn proposal: the alloy of his people's makers, offered as salvation."
    },
    "headquarters": {
      "name": "The Chain-Hold, Frostmaw Holdfast (lower tunnels)",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"alaric\">Alaric</LoreLink> is watching the Bound fracture along the same fault-line that defined his own founding: the Fex Alchemite propose chardalyn chains (the makers' metal), the Groven refuse (the vat-iron must be honored), and the iron that both factions depend on is becoming brittle in the Cragjaw cold. <LoreLink termId=\"alaric\">Alaric</LoreLink> alone has the authority to settle the schism, and he is using it to refuse chardalyn absolutely, even as the brittle-iron casualties mount. The Bound are losing Wardens faster than <LoreLink termId=\"alaric\">Alaric</LoreLink> can train them, and his principled refusal may be the order's epitaph."
  }
}

#### Chronarch

Source vtt-react/src/data/classes/chronarchData.js:78

{
  "variant": {
    "subraceName": "Amordjin Groven",
    "title": "The Bone-Calibrator",
    "reframe": "The volcanic-glass gears of a Chronarch engine must interface with *living bone* to function, and the long-limbed <LoreLink termId=\"groven\">Amordjin Groven</LoreLink>, the bridge-builders, the diplomats who instinctively read load and stress, provide the ideal substrate. An Amordjin Chronarch does not own their engine so much as *host* it; the gears grow into the extended limbs, and the tradition reads as much like architecture as like time.",
    "signatureAbility": {
      "name": "Span-Calibration",
      "description": "Temporal effects scale with the reach and stability of the host's limbs, an Amordjin Chronarch can stretch a local time-dilation across a wider area than any other practitioner, anchoring the field through their own outstretched body the way a bridge distributes load."
    },
    "currentCrisisAngle": "Nesta's disappearance terrifies the Amordjin most: they feel temporal friction as *bone-ache*, and as Nesta fades, every Amordjin Chronarch's limbs ache a little more. Some have begun to splint their own arms, not for injury, but because the bone-engine interface is vibrating at a frequency the living skeleton cannot sustain.",
    "signatureQuote": {
      "text": "\"My grandmother built a bridge from the bones of her dead. I build a bridge from the bones of my living. Hers still stands. Ask me in a century about mine.\"",
      "speaker": "Ith-Sparra Long-Limb",
      "context": "An Amordjin Chronarch, splinting her forearm before a long cast"
    }
  },
  "edge": {
    "className": "Chronarch",
    "heritageId": "ithran_groven",
    "description": "Your living-bone interface stabilizes an explicitly bounded wider field.",
    "costDescription": "Requires a braced posture.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "stabilize_bounded_wider_field",
      "condition": {
        "type": "position",
        "value": "braced_posture"
      }
    },
    "cost": {
      "kind": "mobility_penalty",
      "unit": "feet",
      "magnitude": 15
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Chronarch",
    "heritageId": "ithran_groven",
    "requirements": [
      "temporal_anchor",
      "calibration_training"
    ],
    "reason": "Actual anchor installation and sustained calibration"
  },
  "order": {
    "orderName": "The Frostmaw Conclave",
    "founder": {
      "name": "<LoreLink termId=\"nesta\">Nesta</LoreLink>",
      "status": "Disappearing. Physical records bearing her name are going blank; people who knew her are forgetting. She built the first time-dilation engine of volcanic glass and alchemical gears, hooked it into her chest at <LoreLink termId=\"frostmaw_holdfast\">Frostmaw Holdfast</LoreLink>, and has been living in perpetual agonizing present ever since.",
      "note": "The only Chronarch whose temporal friction feeds back into her own historical existence. If she ceases to exist retroactively, every living Chronarch inherits her accumulated temporal debt."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"fex-vestara\">Conclave-Prime Fex-Vestara</LoreLink>",
      "title": "Keeper of the Reconstruction Schematics",
      "characterization": "A guild-bound <LoreLink termId=\"fexrick\">Brasskin</LoreLink> engineer who refuses to accept that <LoreLink termId=\"nesta\">Nesta</LoreLink>'s disappearance is unpreventable. She has spent six years rebuilding <LoreLink termId=\"nesta\">Nesta</LoreLink>'s original engine from recorded schematics, arguing that if the machine persists, its inventor will too. The other Conclave members consider this either genius or grief."
    },
    "headquarters": {
      "name": "Frostmaw Holdfast",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"fex-vestara\">Fex-Vestara</LoreLink>'s reconstruction is a race against <LoreLink termId=\"nesta\">Nesta</LoreLink>'s erasure, and the Conclave has gathered at Frostmaw to witness what they believe will be <LoreLink termId=\"nesta\">Nesta</LoreLink>'s final collapse. If <LoreLink termId=\"fex-vestara\">Fex-Vestara</LoreLink> completes the rebuild before <LoreLink termId=\"nesta\">Nesta</LoreLink> vanishes, the founder may persist as a clause in the new engine. If she is too late, every Chronarch's temporal debt comes due at once. She is three weeks from completion. <LoreLink termId=\"nesta\">Nesta</LoreLink> is estimated at four."
  }
}

Rare-route authored edges:

[]

## Mimir (mimir)

### cardFlavor

Sereth's native creations: Arch keep lineage masks and archives; Broken walk unmasked beside their personal Motes.

### overview

Sereth shaped and reshaped the Mimir against an impossible ideal, then died through its own contradictions. Surviving scriptures preserve incomplete accounts; rejection taught shame without determining every descendant's beliefs.

Arch Mimir keep lineage masks as archives and ritual anchors. Their partial heartwood or storm-glass coverings carry accumulated dream-memories and need care, particularly during travel. Losing an anchor interrupts its benefits, not every class spell or the biological viability of the wearer.

Broken Mimir live genuinely unmasked in riverfront and forest-floor communities. Personal Motes anchor their recovered self-memory; they do not need an ancestral mask to remain themselves. They can accept beauty, friendship, and freedom without secretly obeying the canopy's shame.

Physical mask craft survives with artisans such as Tallen. The lost Mask-Mother craft concerns special ancestral imprinting: a new physical mask does not fabricate centuries of memory.

### culturalBackground

Arch canopy institutions organize rank and archives around inherited masks. Their loss can bring social shame, but that doctrine is not biological truth about every Mimir. Lineage masks accumulate dream-memories through special imprinting and preserve incomplete scriptures.

Broken communities reject compulsory masking, sharing life in riverfront settlements and forest-floor shelters. Personal Motes, craft, ear jewelry, and chosen relationships express selfhood. Physical mask-making survives among artisans, including Tallen, without obliging the artisan to wear a lineage mask or inventing a new ancestral archive.

### integrationNotes

{
  "actionPointSystem": "Mimir abilities focus on perception, memory, identity protection, and environmental adaptation. Their traits emphasize survival in obscured terrain and social nuance.",
  "backgroundSynergy": "Mimir excel in backgrounds emphasizing stealth, perception, and survival. Their introverted nature and secretive culture create compelling roleplay tension with outsiders.",
  "classCompatibility": "The Mimir are the unmasked and the masked. The Arch Mimir are native to the Apex (the Greythorn hunt), the Shaper (Veyra's forms), the Warden (fog-sentinel containment), the Animist (canopy archive), and the Lunarch (mask-anchor). The Broken Mimir are native to the Apex, the Shaper, the Minstrel (family vigil-song through the fog), the Inquisitor (sentinel Vow), the Toxicologist (undergrowth chemistry), and the Animist (family scripture anchored by a Mote). Other class paths require actual acquisition."
}

### diasporaVariation

Arch travelers care for lineage masks and archives with appropriate materials and rites; sea-mist and dry air present different maintenance problems. Broken travelers carry personal Motes rather than compulsory ancestral masks. Neither heritage has a universal death timer outside Frostwood. Embassies and specialist workshops preserve cultural connections without making travel biologically impossible.

### meaningfulTradeoffs

Arch lineage masks protect and preserve archives but need care; forced loss interrupts mask-dependent benefits. Broken self-memory is Mote-anchored, with its own recorded vulnerability. Neither heritage is biologically unable to accept its face or travel beyond Frostwood.

### currentCrisis


The masks are running out. Every year, more Mimir are born than masks are passed down. The Arch Mimir elders have known this for decades, but they have refused to acknowledge the mathematics because acknowledging it means admitting the Rupture was a mistake, that hoarding masks for first-borns while casting the rest aside has not preserved Mimir society. It has poisoned it.

But the deeper crisis is in the scriptures. For centuries, the Arch Mimir have read Sereth's tablets as a single unbroken apology, a record of the creator's disappointment, the foundational text of the shame that defines Mimir existence. The scriptures were the proof. The shame was the doctrine. The mask was the answer. This reading has gone unchallenged since the Rupture.

Then Vaelith Thread-Speaker deciphered a partial line on a tablet deep in the oldest archive: "...and the maker saw that the final shape held, and turned away in grief, not in disgust." The translation is fragmentary. The context is gone. The reading is uncertain. But if it is correct, it contradicts everything the Mimir have believed about themselves for longer than the sun has been buried. If the final shape held, then the Mimir were not rejected. If they were not rejected, then the shame has no foundation. If the shame has no foundation, then the masks are...

The Arch Mimir elders who have seen the translation have suppressed it. The scholars who have heard of it are divided. Some call it a mistranslation, a desperate projection by an aging reader. Others call it the most important discovery since the scriptures were first assembled. A small and growing minority, mostly younger Arch Mimir and a few outcasts who have somehow heard of the work, believe it is the truth the Mimir have been hiding from themselves since Sereth died: that the masks are unnecessary. That Sereth's final creation was successful. That the shame is inherited from a creator who destroyed itself, not from a creator who rejected them.

This heresy threatens the entire social order. The Arch Mimir aristocracy derives its authority from the masks. The Broken Mimir derive their craft from the assumption that masks are sacred. The Broken Mimir are defined by their patchwork masks. If the masks are unnecessary, every structure the Mimir have built since the silence collapses. The Conclave the Elders have called to address the shrinking supply of masks may be overtaken by a far more dangerous question: what if the masks were never the answer at all.

And deep beneath the oldest canopy-hold, the Maker's Hearth still burns. The chamber remains sealed. Inside it, the pale fire that Sereth first kindled has, according to the few elders permitted to check it, begun to glow faintly brighter in the presence of young Mimir who have never been told what it is.
    

### Arch Mimir — veiled_mimir

Native: Apex, Shaper, Warden, Animist, Lunarch.

**description:** The Mimir were conceived as a god's grand quest to fashion the perfect entity. But perfection is an impossible horizon; their creator was never satisfied, remodeling and restructuring them across millennia. Each iteration left the Mimir feeling inadequate and unaccepted, cursed with the belief that their true form was a hideous failure. In truth, their features are not hideous at all, but rather carry innate demonic fae grace. To hide this "flaw," they were bestowed ancient wooden masks hand-carved with the visages of primal beasts. The Arch Mimir view themselves as the noble, rightful inheritors of this divine design. However, while the Broken Mimir achieved liberation by discarding masks and embracing their demonic traits openly, the Arch Mimir's rigid aristocratic denial only causes their demonic traits to fester and curdle beneath the wood. They dwell at the very summit of titanic trees, constructing dizzying networks of wooden sky-paths and suspended platforms—partly to look down in haughty judgment upon the forest below, and partly to be physically closer to their deity, whom they believe will one day return, completely unaware that he was consumed by his own grief and committed suicide long ago.

**culturalBackground:** Arch Mimir society is a hierarchy of sacred denial and skyward vigilance. Suspended hundreds of feet above the fog, their cities are sprawling webs of wooden sky-walks, rope gantries, and hollowed ironwood crowns. They live in the treetops for two reasons: to look down upon the "lesser" ground-dwellers and to wait at the highest vantage point for their god's return. Mask culture is absolute and hereditary; each mask is an ancient heirloom carved from sacred timber in the likeness of ancient beasts (serpents, predatory stags, raptors, and horned chimeras). To be seen unmasked in Arch society is the ultimate shame and blasphemy, as they believe exposure reveals a monstrous failure that offended their creator.

Subrace authored keys: id, name, crest, illustration, illustrationCaption, illustrations, visualDescription, tooltipSummary, description, culturalBackground, statModifiers, traits, speed, baseStats, savingThrowModifiers.

#### Apex

Source vtt-react/src/data/classes/apexData.js:48

{
  "variant": {
    "subraceName": "Arch Mimir",
    "title": "The Mask-Hunter",
    "reframe": "The <LoreLink termId=\"mimir\">Arch Mimir</LoreLink> anchor their identity to a fixed mask, and an Apex among them tracks through the fog with an *identity-stable perception*, the mask holds the self still while the senses range, a fixed point of awareness in the shifting mist. They are the tradition's steadiest trackers, their judgment unclouded by the fog's identity-erosion.",
    "signatureAbility": {
      "name": "Anchor-Sense",
      "description": "A master hunter who has made a trade with the Frostwood fog. The fog takes something — hearing, speech, taste, a sense the hunter will never recover. In exchange, the hunter learns to read what the fog hides."
    },
    "currentCrisisAngle": "The mist is learning to hide (the foundational crisis), and the Arch Mimir feel it as their anchored perception *meeting resistance*, the fog no longer merely erodes, it actively *evades* their senses.",
    "signatureQuote": {
      "text": "\"My mask holds me steady so I can see what the fog hides. Lately the fog sees me back, through my own steadiness. I have become the thing I am hunting, or it has become me.\"",
      "speaker": "Mask-Hunter Mir-Vassen",
      "context": "An Arch Mimir Apex, the fourth hunt his anchored senses returned nothing"
    }
  },
  "edge": {
    "className": "Apex",
    "heritageId": "veiled_mimir",
    "description": "Stable lineage archive hunt discipline distinguishes a track from an identity disturbance.",
    "costDescription": "Protect and care for the selected anchor; no mask-induced omniscience.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "distinguish_track_from_identity_disturbance",
      "condition": {
        "type": "medium",
        "value": "lineage_archive"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "selected_anchor_care"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Apex",
    "heritageId": "veiled_mimir",
    "requirements": [
      "sensory_trade",
      "sensory_training",
      "bonded_companion"
    ],
    "reason": "An actual sensory Trade, adaptation and a bonded trained companion"
  },
  "order": {
    "orderName": "The Silent Hunt",
    "founder": {
      "name": "<LoreLink termId=\"sylas\">Sylas</LoreLink>",
      "status": "Alive, and entirely deaf. A Broken Mimir sentinel on the Ironwood Palisade, Sylas walked into the Frostwood fog after the Greythorn massacre and did not return for seven days. When he came back, he was deaf  —  he had traded his hearing for vibration-sense, the ability to feel the fog's disturbances through his feet, his skin, the air itself. He had stalked and killed the first Gref, a Wyrd entity that steals faces and erases memory of its victims. He has led the Silent Hunt in sign-language ever since.",
      "note": "<LoreLink termId=\"sylas\">Sylas</LoreLink> built the Silent Hunt on a trade the order still honors: give up one sense to sharpen the rest. Every Apex initiate chooses a sacrifice. <LoreLink termId=\"sylas\">Sylas</LoreLink> chose hearing. The mist that is now learning to hide is teaching him that some things cannot be tracked even with every sense paid for."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"sylas\">Silent-Master Sylas</LoreLink>",
      "title": "The First Hunter",
      "characterization": "Deaf, lethal, and patient beyond any living tracker. <LoreLink termId=\"sylas\">Sylas</LoreLink> communicates through a tactile sign-language the Hunt developed specifically because spoken words are unreliable in the <LoreLink termId=\"frostwood-reach\">Frostwood</LoreLink> fog. He leads from the deep ironwood and has tracked the Wyrd that killed Greythorn  —  the first Gref  —  on and off, for forty years. It has never let him close. Lately, it has begun circling *him*."
    },
    "headquarters": {
      "name": "The Still Blind, memorial site near Greythorn (Frostwood Reach)",
      "locationId": "frostwood-reach"
    },
    "crisisConnection": "<LoreLink termId=\"sylas\">Sylas</LoreLink> is the hunter realizing he has become the hunted. The mist is learning to hide, not randomly but *deliberately*, evading Apex senses that have held for centuries. He has concluded that something large has moved through the Reach for months without leaving trace, and that the something is *teaching the mist to evade the Hunt itself*. The Apex trackers who dissolve into the fog to find it are not coming back. <LoreLink termId=\"sylas\">Sylas</LoreLink> is preparing to dissolve into the fog himself, knowing he may not come back either, because he is the only tracker who has ever gotten close, and the thing in the mist has noticed."
  }
}

#### Shaper

Source vtt-react/src/data/classes/shaperData.js:30

{
  "variant": {
    "subraceName": "Arch Mimir",
    "title": "The Form-Locked",
    "reframe": "The <LoreLink termId=\"mimir\">Arch Mimir</LoreLink> anchor their identity to a single carved mask, and a Shaper among them must reconcile the shaping forms with an *external identity-anchor* that resists change. The Arch Mimir are the most controlled Shapers: the mask holds the self stable while the body shifts around it.",
    "signatureAbility": {
      "name": "Anchor-Form",
      "description": "Flux builds faster when the Shaper's mask remains untouched, the mask is the fixed axis, and every transformation radiates from it. The Masked fight to protect the one thing they cannot change."
    },
    "currentCrisisAngle": "Convergence Collapse hits the Arch Mimir as a *mask-crisis*: when young ones attempt every form at once, the transformations begin *reaching for the mask*, trying to reshape the one thing that holds the self.",
    "signatureQuote": {
      "text": "\"My mask is the only shape I cannot change, and the dance keeps trying to take it from me. The day I let it, I will not be anyone to remember the loss.\"",
      "speaker": "Form-Keeper Mir-Vassen",
      "context": "An Arch Mimir Shaper, splinting his mask-straps before a convergence drill"
    }
  },
  "edge": {
    "className": "Shaper",
    "heritageId": "veiled_mimir",
    "description": "Veyra's transmitted forms and heirloom anchor stabilize a declared transition against an identity reference.",
    "costDescription": "The reference is vulnerable; the mask is not biological permission for all shifting.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "stabilize_transition_against_reference",
      "condition": {
        "type": "equipment",
        "value": "heirloom_anchor"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "vulnerable_identity_reference"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Shaper",
    "heritageId": "veiled_mimir",
    "requirements": [
      "shaping_interface",
      "transformation_training"
    ],
    "reason": "Successful body-interface transformation and subsequent training"
  },
  "order": {
    "orderName": "The Form-Convergence",
    "founder": {
      "name": "Veyra",
      "status": "Living. Veyra, a Broken Mimir trade envoy, founded the Form-Convergence and still leads it from the Shaping Hall at Frostmaw. The art began with Torin, a Morgh Groven miner. During the First Thermal War, Torin was trapped in a collapsing Deep Alchemist tunnel; with his limbs too short to brace the widening crack, he drank a cask of raw alchemical sulfur-clay  -  the same compound the Deep Alchemists had used to reshape Thrumm into Groven centuries before  -  and commanded his skeleton to grow. His arms lengthened, his spine thickened, his bones calcified into load-bearing pillars, and he held the tunnel for six hours until rescue came, and the Morgh elders founded the Shaping Hall at Frostmaw Crag in his name. Veyra learned his voluntary bone-sculpting from the Groven masters, recognized in it a reclamation of the Deep Alchemists' violation, and synthesized it with Mimir kinetic forms. Sylvanus later became the first to master all six Forms.",
      "note": "The Shaper's founding principle is reclamation: the Deep Alchemists reshaped the Thrumm into Groven by force; Veyra taught that the body could be reshaped by choice. Torin's tunnel-collapse survival is the founding act; Veyra's synthesis is the founding of the tradition."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"veyra\">Form-Matriarch Veyra the Merged</LoreLink>",
      "title": "Keeper of the Six Forms",
      "characterization": "Ancient, patient, and more stone than flesh. <LoreLink termId=\"veyra\">Veyra</LoreLink> was a Broken Mimir trade envoy on the Ancestor-Spans who learned the Shaping art from Groven masters and brought it home to the Frostwood, becoming the bridge between two body-modifying cultures. Her semi-crystalline skin is more calcified each year. She leads the Convergence from the Shaping Hall at Frostmaw and teaches the six Forms in sequence, insisting no student attempt convergence until they have mastered each form alone. The young convergers consider this archaic. She considers their burnout rate the proof she is right."
    },
    "headquarters": {
      "name": "The Shaping Hall, Frostmaw Holdfast",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"veyra\">Veyra</LoreLink> is losing the argument. The purist-vs-converger schism is worsening, and Convergence Collapse is killing the young Mimir Shapers, burning through crystalline skin in years rather than centuries. <LoreLink termId=\"veyra\">Veyra</LoreLink>'s slow method  -  adapted from Groven bone-sculpting to Mimir fluid transformation  -  works, but the era does not allow for slow: the Frostwood mist is learning to hide, the Ancestor-Spans are cracking, and the world demands Shapers who can converge *now*. <LoreLink termId=\"veyra\">Veyra</LoreLink> is being forced to teach the dangerous convergence she spent centuries proving was premature, because the alternative is a tradition of pure-form specialists who cannot meet the moment."
  }
}

#### Warden

Source vtt-react/src/data/classes/wardenData.js:61

{
  "variant": {
    "subraceName": "Arch Mimir",
    "title": "The Fog-Jailer",
    "reframe": "The Arch Mimir detect Wyrd incursions in the fog before they manifest, then tether and cage them. They read the mist the way a jailer reads a prisoner's breathing, and hold the cell with their own anchor.",
    "signatureAbility": {
      "name": "Fog Incursion",
      "description": "You detect a defined incursion warning in the mist; warnings can be old or forged."
    },
    "currentCrisisAngle": "The fog is producing warnings that match no known incursion, and the Fog-Jailers are caging things that may not exist while real horrors walk the perimeter.",
    "signatureQuote": {
      "text": "The fog tells me where the thing will be before it is. I chain the warning, and hope I am not chaining a lie.",
      "speaker": "Fog-Jailer Nix",
      "context": "An Arch Mimir Warden on the Ironwood Palisade"
    }
  },
  "edge": {
    "className": "Warden",
    "heritageId": "veiled_mimir",
    "description": "You detect Wyrd incursions before they manifest, reading shifts in the fog’s memory.",
    "costDescription": "Warnings can be old or forged.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "detect_incursion_through_fog",
      "condition": {
        "type": "medium",
        "value": "fog"
      }
    },
    "cost": {
      "kind": "risk",
      "unit": "capability",
      "capability": "warnings_can_be_forged"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Warden",
    "heritageId": "veiled_mimir",
    "requirements": [
      "graft_surgery",
      "anatomy_compatibility",
      "load_training"
    ],
    "reason": "Actual graft surgery, compatible anatomy and load training"
  },
  "order": {
    "orderName": "The Bound",
    "founder": {
      "name": "<LoreLink termId=\"alaric\">Alaric the Law-Keeper</LoreLink>",
      "status": "Alive. The <LoreLink termId=\"groven\">Groven</LoreLink> mine-guard who drove an ore-hauling chain through his own forearm into the largest Deep Alchemist specimen and held for three days still leads the Bound, the chain rusted into his bone, his regenerative Thrumm-derived biology keeping him functional long past any normal Groven lifespan. He said no to removing it then. He has said no every day since.",
      "note": "<LoreLink termId=\"alaric\">Alaric</LoreLink> founded the Bound on a single principle: the Warden exists to ensure nothing is ever contained the way the Groven were contained in the vats. The chain is chosen, not inflicted. That distinction is the entire order."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"alaric\">Alaric the Law-Keeper</LoreLink>",
      "title": "The First Bound",
      "characterization": "Ancient, immovable, and more iron than flesh, <LoreLink termId=\"alaric\">Alaric</LoreLink>'s regenerative biology has integrated the chain so thoroughly that removing it would now kill him. He leads from <LoreLink termId=\"frostmaw_holdfast\">Frostmaw Holdfast</LoreLink>'s lower tunnels and trains every Warden personally in the graft-rite. He is grieved, specifically, by the chardalyn proposal: the alloy of his people's makers, offered as salvation."
    },
    "headquarters": {
      "name": "The Chain-Hold, Frostmaw Holdfast (lower tunnels)",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"alaric\">Alaric</LoreLink> is watching the Bound fracture along the same fault-line that defined his own founding: the Fex Alchemite propose chardalyn chains (the makers' metal), the Groven refuse (the vat-iron must be honored), and the iron that both factions depend on is becoming brittle in the Cragjaw cold. <LoreLink termId=\"alaric\">Alaric</LoreLink> alone has the authority to settle the schism, and he is using it to refuse chardalyn absolutely, even as the brittle-iron casualties mount. The Bound are losing Wardens faster than <LoreLink termId=\"alaric\">Alaric</LoreLink> can train them, and his principled refusal may be the order's epitaph."
  }
}

#### Animist

Source vtt-react/src/data/classes/animistData.js:40

{
  "variant": {
    "subraceName": "Arch Mimir",
    "title": "The Archive-Keeper",
    "reframe": "The Arch Mimir keep lineage archives in the canopy; a keeper who communes with a forebear indexes a known heirloom rather than summoning freely. The archive is finite, and a keeper who invents an unknown ancestor is filing a false record.",
    "signatureAbility": {
      "name": "Heirloom Index",
      "description": "A known heirloom indexes an ancestral witness from the canopy archive; coverage is finite and unknown ancestors cannot be invented."
    },
    "currentCrisisAngle": "The canopy archives are being stripped by the mask-cartels, and every stolen heirloom takes an ancestor out of reach.",
    "signatureQuote": {
      "text": "I do not summon the dead. I file a request, and the archive either has them or it does not.",
      "speaker": "Archivist Vela",
      "context": "An Arch Mimir Animist at the canopy archive"
    }
  },
  "edge": {
    "className": "Animist",
    "heritageId": "veiled_mimir",
    "description": "A known heirloom indexes an ancestral witness in the canopy archive.",
    "costDescription": "Archive coverage is finite; unknown ancestors cannot be invented.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "index_ancestral_witness_by_heirloom",
      "condition": {
        "type": "equipment",
        "value": "known_heirloom"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "archive_coverage_finite"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Animist",
    "heritageId": "veiled_mimir",
    "requirements": [
      "spirit_anchor",
      "communion_apprenticeship"
    ],
    "reason": "A memorial/spirit anchor and guided communion apprenticeship"
  },
  "order": {
    "orderName": "The Silent Throat",
    "founder": {
      "name": "Kael the Herd-Runner",
      "status": "Dead. The first of the three named Animist founders, an Ordu throat-singer who sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. The practice predates writing  —  it was navigation, not philosophy. The Ordu do not know who first sang the dead into the wind, only that when the stars went dark, Kael began singing ancestor-names and the herds still found their way.",
      "note": "Kael is canonically one of three co-founders of the Animist tradition (alongside Nyssa the Herbalist and Theron the Skald Scholar). The Ordu throat-singing tradition lives entirely in muscle-memory, teacher to student, voice to voice, and Kael is the root of that lineage. Later traditions (Skald, Mycellan, Astril, Athien) all trace their root technique to Kael's work."
    },
    "currentLeader": {
      "name": "Bayar Wind-Throat",
      "title": "Last Singer of the Old Route",
      "characterization": "An Ordu elder who still sings the migration-routes in the old tongue of the Long Before  —  the language that predates the dialect-fracture. Bayar has not spoken a word aloud in forty years; he communicates only through throat-sung overtones, the way the First Singer did. His vocal cords are calcified from decades of channeling ancestors who died before the stars went out. He is the living archive of the oldest form, and he watches the younger traditions drift further from the root with every generation  —  not with anger, but with the patience of someone who knows the dead will correct them eventually."
    },
    "headquarters": {
      "name": "The Sundrift Wind-Shrine (moving camp)",
      "locationId": "sundrift-vale"
    },
    "crisisConnection": "Bayar Wind-Throat is the only living Animist who still sings the pre-fracture language. The dialect-fracture is a problem of the dead themselves  —  the oldest dead (those who died before the <LoreLink termId=\"sundered_monoliths\">Monoliths</LoreLink> woke) speak clearly. The newer dead are confused, their voices layered with static no throat-singer can parse. Bayar suspects something is wrong with the threshold of death itself, and the Monoliths' awakening is not a cause but a symptom. He cannot prove this, because the evidence is in a language no one else remembers how to hear."
  }
}

#### Lunarch

Source vtt-react/src/data/classes/lunarchData.js:94

{
  "variant": {
    "subraceName": "Arch Mimir",
    "title": "The Mask-Anchored",
    "reframe": "The <LoreLink termId=\"mimir\">Arch Mimir</LoreLink> anchor identity to a fixed heartwood mask, and a Lunarch among them hands the parasite that job: a second, living anchor that holds the self together even when the wood is removed. The Arch halls consider this the deepest heresy or the most useful insurance, depending on which hall is asked, and Mir-Tassen's testimony is read at both.",
    "signatureAbility": {
      "name": "Lunar-Anchor",
      "description": "The parasite serves as a *replacement mask*, a second, living identity-anchor that holds the self together even when the physical mask is removed. A host can survive briefly unmasked in the fog, sustained by the parasite. The cost: the parasite's phases now *are* the host's identity, and the Waning phase is amnesia."
    },
    "currentCrisisAngle": "The dead-moon revelation threatens the Arch Mimir uniquely: if the parasite is one of many siblings communicating across hosts, the Lunarch's *identity* is being shared with strangers.",
    "signatureQuote": {
      "text": "\"I wore a mask to remember who I am. Now I wear the moon, and it remembers three other people who are also me. I cannot tell which of us is the original.\"",
      "speaker": "Veil-Keeper Mir-Tassen",
      "context": "An Arch Mimir Lunarch, cataloguing memories that arrived overnight"
    }
  },
  "edge": {
    "className": "Lunarch",
    "heritageId": "veiled_mimir",
    "description": "Canopy archive contact maintains a defined identity reference during phase stress.",
    "costDescription": "Parasite memories contaminate the archive; no biological death from removing a mask.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "maintain_identity_reference",
      "condition": {
        "type": "equipment",
        "value": "canopy_archive"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "archive_contamination"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Lunarch",
    "heritageId": "veiled_mimir",
    "requirements": [
      "organism_bond",
      "host_compatibility",
      "identity_training"
    ],
    "reason": "An actual compatible host bond, containment and identity discipline"
  },
  "order": {
    "orderName": "The Lunar Communion",
    "founder": {
      "name": "<LoreLink termId=\"selene\">Selene of House Viridane</LoreLink>",
      "status": "Alive, but silent. Selene bargained with the wildwood fae in the moonlit groves and bound a lunar parasite to her bones. Three weeks ago she stopped speaking <LoreLink termId=\"florae\">Florae</LoreLink> and began whispering in a language the elders cannot identify, older than the fae-contract, older than the dead moon.",
      "note": "The first Lunarch. Her parasite was believed singular; the discovery that the dead moon is a fallen star  —  and the \"egg\" a folk misunderstanding  —  has rendered her silence terrifying rather than merely concerning."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"bri-vessela\">Regent Bri-Vessela</LoreLink>",
      "title": "Keeper of the Phases (acting)",
      "characterization": "A senior Briaren Florae who has led the Communion in Selene's silence with visible reluctance. She is a theologian, not a politician, and she took the regency only because the alternative was civil war between the caste-factions. She spends her nights at Selene's side, transcribing the dead-language whispers, and her days pretending she understands what they mean."
    },
    "headquarters": {
      "name": "The Moonlit Groves, deep Frostwood Reach",
      "locationId": "frostwood-reach"
    },
    "crisisConnection": "<LoreLink termId=\"bri-vessela\">Bri-Vessela</LoreLink> is presiding over a Communion that is, quietly, being *called*, the elder parasites communicating across hosts are synchronizing the phases of every Lunarch toward an unknown convergence. Selene's whispers are, <LoreLink termId=\"bri-vessela\">Bri-Vessela</LoreLink> has begun to suspect, not madness but *instructions*: the waking-song of the fallen star, and every Lunarch is a note in it. She does not know whether to stop the convergence or let it come, because no one alive remembers what wakes."
  }
}

Rare-route authored edges:

[]

### Broken Mimir — tethered_mimir

Native: Apex, Shaper, Minstrel, Inquisitor, Toxicologist, Animist.

**description:** Exiles, siblings born without ancestral heirlooms, or rebels who chose to throw their masks away forever. The Broken Mimir have discarded the rigid nobility and suffocating mask-traditions of the Arch Mimir, descending from the high canopy-holds to build lively shanty communities on the mossy forest floor and riverbanks. They wear NO masks at all. Instead, their faces are proudly bared, distinguished by intricate demon facial scarring, pointed demon-fae ears heavy with dangling rings, cuffs, and silver chains, and wide, soulful eyes. They live with child-like glee, hopeful curiosity, and defiant joy, accompanied by warm floating golden spirit motes.

**culturalBackground:** Broken Mimir society is founded on emotional liberation, rustic riverfront community, and the complete rejection of mask-bound shame. Far removed from the porcelain-shrouded canopy temples, they dwell in vibrant settlements like Revel's End along forest rivers and mossy grounds. Having abandoned masks entirely, they celebrate self-identity through elaborate ear jewelry, body adornments, and the distinct demon facial scars that mark their lineage. They navigate life with open curiosity and carnival joy, unburdened by ancestral guilt and guided by loyal floating spirit motes.

Subrace authored keys: id, name, crest, illustration, illustrationCaption, illustrations, visualDescription, tooltipSummary, description, culturalBackground, statModifiers, traits, speed, baseStats.

#### Apex

Source vtt-react/src/data/classes/apexData.js:65

{
  "variant": {
    "subraceName": "Broken Mimir",
    "title": "The Sentinel-Tracker",
    "reframe": "The <LoreLink termId=\"mimir\">Broken Mimir</LoreLink>, the fog-sentinels of the <LoreLink termId=\"frostwood-reach\">Ironwood Palisade</LoreLink>, track as *vigil*, treating every hunt as an extension of their sentinel-duty. A Broken Mimir Apex does not hunt for sport or bounty; they hunt because something has entered the perimeter, and the perimeter must be answered. Their tracking is defensive, methodical, and relentless.",
    "signatureAbility": {
      "name": "Perimeter-Track",
      "description": "Tracking-acuity is amplified inside a defined perimeter the Apex has sworn to guard, a settlement, a stretch of palisade, a party's camp. Inside the perimeter, the Broken Mimir are nearly infallible."
    },
    "currentCrisisAngle": "The mist's new evasion has the Broken Mimir sentinels on the verge of panic: the perimeter they have guarded for centuries is now *leaking*, the fog itself opening gaps for things to slip through undetected.",
    "signatureQuote": {
      "text": "\"I have guarded this wall for thirty years and the wall has held because the mist cooperated. Now the mist opens doors for the things I am meant to stop. I am leaving the wall to find the hand on the door.\"",
      "speaker": "Sentinel-Tracker Mir-Felss",
      "context": "A Broken Mimir Apex, requesting leave to hunt beyond the Palisade"
    }
  },
  "edge": {
    "className": "Apex",
    "heritageId": "tethered_mimir",
    "description": "Unmasked sentinel perception reads a declared perimeter's disturbances.",
    "costDescription": "Coverage depends on an actual maintained perimeter.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "read_declared_perimeter_disturbances",
      "condition": {
        "type": "position",
        "value": "maintained_perimeter"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "perimeter_maintenance"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Apex",
    "heritageId": "tethered_mimir",
    "requirements": [
      "sensory_trade",
      "sensory_training",
      "bonded_companion"
    ],
    "reason": "An actual sensory Trade, adaptation and a bonded trained companion"
  },
  "order": {
    "orderName": "The Silent Hunt",
    "founder": {
      "name": "<LoreLink termId=\"sylas\">Sylas</LoreLink>",
      "status": "Alive, and entirely deaf. A Broken Mimir sentinel on the Ironwood Palisade, Sylas walked into the Frostwood fog after the Greythorn massacre and did not return for seven days. When he came back, he was deaf  —  he had traded his hearing for vibration-sense, the ability to feel the fog's disturbances through his feet, his skin, the air itself. He had stalked and killed the first Gref, a Wyrd entity that steals faces and erases memory of its victims. He has led the Silent Hunt in sign-language ever since.",
      "note": "<LoreLink termId=\"sylas\">Sylas</LoreLink> built the Silent Hunt on a trade the order still honors: give up one sense to sharpen the rest. Every Apex initiate chooses a sacrifice. <LoreLink termId=\"sylas\">Sylas</LoreLink> chose hearing. The mist that is now learning to hide is teaching him that some things cannot be tracked even with every sense paid for."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"sylas\">Silent-Master Sylas</LoreLink>",
      "title": "The First Hunter",
      "characterization": "Deaf, lethal, and patient beyond any living tracker. <LoreLink termId=\"sylas\">Sylas</LoreLink> communicates through a tactile sign-language the Hunt developed specifically because spoken words are unreliable in the <LoreLink termId=\"frostwood-reach\">Frostwood</LoreLink> fog. He leads from the deep ironwood and has tracked the Wyrd that killed Greythorn  —  the first Gref  —  on and off, for forty years. It has never let him close. Lately, it has begun circling *him*."
    },
    "headquarters": {
      "name": "The Still Blind, memorial site near Greythorn (Frostwood Reach)",
      "locationId": "frostwood-reach"
    },
    "crisisConnection": "<LoreLink termId=\"sylas\">Sylas</LoreLink> is the hunter realizing he has become the hunted. The mist is learning to hide, not randomly but *deliberately*, evading Apex senses that have held for centuries. He has concluded that something large has moved through the Reach for months without leaving trace, and that the something is *teaching the mist to evade the Hunt itself*. The Apex trackers who dissolve into the fog to find it are not coming back. <LoreLink termId=\"sylas\">Sylas</LoreLink> is preparing to dissolve into the fog himself, knowing he may not come back either, because he is the only tracker who has ever gotten close, and the thing in the mist has noticed."
  }
}

#### Shaper

Source vtt-react/src/data/classes/shaperData.js:46

{
  "variant": {
    "subraceName": "Broken Mimir",
    "title": "The Sentinel-Shifter",
    "reframe": "The <LoreLink termId=\"mimir\">Broken Mimir</LoreLink>, the fog-sentinels of the <LoreLink termId=\"frostwood-reach\">Ironwood Palisade</LoreLink>, treat the shaping forms as *vigil-adaptations*: each form is a posture of watching, a body configured for a specific kind of surveillance.",
    "signatureAbility": {
      "name": "Vigil-Form",
      "description": "Shaping forms optimized for sensory coverage rather than offense. The Broken Mimir are the tradition's scouts."
    },
    "currentCrisisAngle": "The mist is learning to hide, and the Broken Mimir Shapers feel it most acutely, every vigil-form is returning less.",
    "signatureQuote": {
      "text": "\"I reshaped my eyes to pierce the mist. The mist reshaped itself to defy my eyes. We are arguing, and I am losing, and I do not know what it is protecting.\"",
      "speaker": "Sentinel Mir-Felss",
      "context": "A Broken Mimir Shaper, the third night her vigil-form returned nothing"
    }
  },
  "edge": {
    "className": "Shaper",
    "heritageId": "tethered_mimir",
    "description": "Community training changes a sensory posture without a lineage mask, anchored by self or Mote.",
    "costDescription": "Repeated shifts stress self-reference and Body Toll.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "change_sensory_posture_without_mask",
      "condition": {
        "type": "state",
        "value": "self_or_mote_reference"
      }
    },
    "cost": {
      "kind": "resource_loss",
      "unit": "flat",
      "magnitude": 2,
      "resource": "kineticFluxBodyToll"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Shaper",
    "heritageId": "tethered_mimir",
    "requirements": [
      "shaping_interface",
      "transformation_training"
    ],
    "reason": "Successful body-interface transformation and subsequent training"
  },
  "order": {
    "orderName": "The Form-Convergence",
    "founder": {
      "name": "Veyra",
      "status": "Living. Veyra, a Broken Mimir trade envoy, founded the Form-Convergence and still leads it from the Shaping Hall at Frostmaw. The art began with Torin, a Morgh Groven miner. During the First Thermal War, Torin was trapped in a collapsing Deep Alchemist tunnel; with his limbs too short to brace the widening crack, he drank a cask of raw alchemical sulfur-clay  -  the same compound the Deep Alchemists had used to reshape Thrumm into Groven centuries before  -  and commanded his skeleton to grow. His arms lengthened, his spine thickened, his bones calcified into load-bearing pillars, and he held the tunnel for six hours until rescue came, and the Morgh elders founded the Shaping Hall at Frostmaw Crag in his name. Veyra learned his voluntary bone-sculpting from the Groven masters, recognized in it a reclamation of the Deep Alchemists' violation, and synthesized it with Mimir kinetic forms. Sylvanus later became the first to master all six Forms.",
      "note": "The Shaper's founding principle is reclamation: the Deep Alchemists reshaped the Thrumm into Groven by force; Veyra taught that the body could be reshaped by choice. Torin's tunnel-collapse survival is the founding act; Veyra's synthesis is the founding of the tradition."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"veyra\">Form-Matriarch Veyra the Merged</LoreLink>",
      "title": "Keeper of the Six Forms",
      "characterization": "Ancient, patient, and more stone than flesh. <LoreLink termId=\"veyra\">Veyra</LoreLink> was a Broken Mimir trade envoy on the Ancestor-Spans who learned the Shaping art from Groven masters and brought it home to the Frostwood, becoming the bridge between two body-modifying cultures. Her semi-crystalline skin is more calcified each year. She leads the Convergence from the Shaping Hall at Frostmaw and teaches the six Forms in sequence, insisting no student attempt convergence until they have mastered each form alone. The young convergers consider this archaic. She considers their burnout rate the proof she is right."
    },
    "headquarters": {
      "name": "The Shaping Hall, Frostmaw Holdfast",
      "locationId": "frostmaw_holdfast"
    },
    "crisisConnection": "<LoreLink termId=\"veyra\">Veyra</LoreLink> is losing the argument. The purist-vs-converger schism is worsening, and Convergence Collapse is killing the young Mimir Shapers, burning through crystalline skin in years rather than centuries. <LoreLink termId=\"veyra\">Veyra</LoreLink>'s slow method  -  adapted from Groven bone-sculpting to Mimir fluid transformation  -  works, but the era does not allow for slow: the Frostwood mist is learning to hide, the Ancestor-Spans are cracking, and the world demands Shapers who can converge *now*. <LoreLink termId=\"veyra\">Veyra</LoreLink> is being forced to teach the dangerous convergence she spent centuries proving was premature, because the alternative is a tradition of pure-form specialists who cannot meet the moment."
  }
}

#### Minstrel

Source vtt-react/src/data/classes/minstrelData.js:48

{
  "variant": {
    "subraceName": "Broken Mimir",
    "title": "The Vigil-Singer",
    "reframe": "The Broken Mimir sing community vigils through the fog, no mask required. Their cadence is a family transmission older than the Tide-Choir, carried through the mist the way the fog carries memory.",
    "signatureAbility": {
      "name": "Vigil Cadence",
      "description": "You sing a community vigil through the fog without a mask; the fog can imitate or carry the signal astray."
    },
    "currentCrisisAngle": "The fog has begun answering the vigil in a voice that is not the community, and the Broken Mimir cannot tell whether they are singing to their dead or to the mist.",
    "signatureQuote": {
      "text": "We never needed a mask to sing our dead home. The fog listens anyway, which is the problem.",
      "speaker": "Vigil-Singer Orla",
      "context": "A Broken Mimir Minstrel in the Frostwood"
    }
  },
  "edge": {
    "className": "Minstrel",
    "heritageId": "tethered_mimir",
    "description": "You sing a community vigil through the fog without a mask.",
    "costDescription": "The fog can imitate or carry the signal astray.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "sing_vigil_through_fog",
      "condition": {
        "type": "medium",
        "value": "fog"
      }
    },
    "cost": {
      "kind": "risk",
      "unit": "capability",
      "capability": "fog_can_imitate_signal"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Minstrel",
    "heritageId": "tethered_mimir",
    "requirements": [
      "cadence_training",
      "resonant_medium"
    ],
    "reason": "Resonance/voice discipline and a usable medium"
  },
  "order": {
    "orderName": "The Tide-Choir",
    "founder": {
      "name": "<LoreLink termId=\"lyris\">Lyris the Tide-Singer</LoreLink>",
      "status": "Vanished, the same night the <LoreLink termId=\"iceheart-sea\">Iceheart Sea</LoreLink> went silent. She traded her spoken voice for the storm's voice decades ago; screaming fills her lungs with saltwater. Her lute was recovered from the water with a final carving: she was looking for the note that shatters the old powers.",
      "note": "Lyris sang a sacred sea-symphony to calm the gales and the ocean mother stole her spoken voice in exchange. She founded the Tide-Choir to teach what the sea taught her. She is the only Minstrel the sea ever spoke to directly, and the sea has stopped speaking."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"mer-lyrisa\">Tide-Choir Mistress Mer-Lyrisa</LoreLink>",
      "title": "Keeper of the Silent Frequency",
      "characterization": "Named for the vanished founder she never met, <LoreLink termId=\"mer-lyrisa\">Mer-Lyrisa</LoreLink> leads a Choir that has lost its instrument. She is hoarse, sleepless, and obsessed: she has spent every night since the silence began standing at the waterline of <LoreLink termId=\"merrowport\">Merrowport</LoreLink>, listening for a sea that makes no sound. She is beginning to suspect the silence is not absence but *holding breath*."
    },
    "headquarters": {
      "name": "The Drowned Opera, Merrowport",
      "locationId": "merrowport"
    },
    "crisisConnection": "<LoreLink termId=\"mer-lyrisa\">Mer-Lyrisa</LoreLink> is holding a collapsing Choir together while the silence spreads up the rivers (the Brook variant's crisis). She has forbidden deep-water performances and grounded the Deep who fled the abyss, but she knows the silence is advancing, and that whatever caused it sang back to the Deep in a voice that should not exist. Her only lead is Lyris's recovered lute and the carving about shattering old powers. She is considering playing the note."
  }
}

#### Inquisitor

Source vtt-react/src/data/classes/inquisitorData.js:76

{
  "variant": {
    "subraceName": "Broken Mimir",
    "title": "The Fog-Sentinel",
    "reframe": "The <LoreLink termId=\"mimir\">Broken Mimir</LoreLink> already stand watch on the Ironwood Palisade against the Wyrd. An Inquisitor among them is simply a Sentinel who took the Barbed Vow. They detect Wyrd-incursions before they manifest  -  reading the fog's memory-shifts as early warning. The Broken Inquisitor does not hunt the Wyrd; they wait for it, and the waiting is the art. Their Authority builds from patience, not pursuit.",
    "signatureAbility": {
      "name": "Fog-Reading",
      "description": "Wyrd-incursions are detected through the fog's memory-shifts before they physically manifest; the Broken Inquisitor reads the mist like a seismograph, feeling the corruption as a wrongness in the fog's texture. Their Authority builds from the waiting itself  -  each silent hour on the Palisade is a vigil that deepens their power."
    },
    "currentCrisisAngle": "The fog has begun to remember things the Broken do not want it to remember  -  old incursions, ancient corruptions, forgotten entities that predate the Palisade. The Sentinels are reading warnings for threats that may be centuries old, or may be arriving now. The fog does not distinguish between past and present danger, and the Broken Inquisitors are losing the ability to tell the difference.",
    "signatureQuote": {
      "text": "\"The fog warned me of your arrival three days ago. It did not warn me of what follows you. I am still waiting for that warning. I suspect I will be waiting for a very long time.\"",
      "speaker": "Sentinel Broken-Marr",
      "context": "A Broken Fog-Sentinel, greeting a party at the Ironwood Palisade, refusing entry"
    }
  },
  "edge": {
    "className": "Inquisitor",
    "heritageId": "tethered_mimir",
    "description": "Sentinel training recognizes a defined incursion warning in mist.",
    "costDescription": "Warnings can be old or forged; no infallible detection.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "recognize_incursion_warning",
      "condition": {
        "type": "medium",
        "value": "mist"
      }
    },
    "cost": {
      "kind": "vulnerability",
      "unit": "capability",
      "capability": "warnings_old_forged"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Inquisitor",
    "heritageId": "tethered_mimir",
    "requirements": [
      "barbed_vow",
      "containment_training"
    ],
    "reason": "The actual Vow and containment/severance apprenticeship"
  },
  "order": {
    "orderName": "The Barbed Vow",
    "founder": {
      "name": "<LoreLink termId=\"orven\">Orven the Still-Handed</LoreLink> (Mycellan) and <LoreLink termId=\"elias\">Elias the Salt-Scarred</LoreLink> (Tallyn)",
      "status": "Orven, gone dark, last recorded during a final network-severance in the deep <LoreLink termId=\"bryngloom-forest\">Bryngloom</LoreLink>. Elias, name struck from the <LoreLink termId=\"frostwood-reach\">Frostwood</LoreLink> Ledger, his legal existence erased by his own Bait-Vow scars. Neither is confirmed dead. Neither is coming back.",
      "note": "Two parallel traditions from the same wound. Orven forged the first cold-iron blade and swore the Barbed Vow to hunt corrupted Mycellan. Elias opened his veins to draw Wyrd face-stealers into living flesh. The traditions merged when the incursion rate tripled."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"vrael-forty-seventh\">High-Severer Vrael the Forty-Seventh</LoreLink>",
      "title": "Last Commander of the Barbed Vow",
      "characterization": "A Tallyn woman who took command because she was, literally, the forty-seventh remaining Inquisitor, and the most senior willing to lead. She bears more Bait-Vow scars than any living practitioner and is, as a result, half-erased from the Sovereign Ledger. She leads from the <LoreLink termId=\"sunken_spire\">Sunken Spire</LoreLink> and has stopped recruiting, because the oath now kills more initiates than it survives."
    },
    "headquarters": {
      "name": "The Sunken Spire (Bryngloom seat) and Greymark Keep (Frostwood seat)",
      "locationId": "sunken_spire"
    },
    "crisisConnection": "Vrael commands forty-six others against an incursion rate that has tripled and is still climbing. The new, unnamed entities in the deep groves have no contracts to sever and no faces to bait, they fall outside the Inquisitor's entire art. She has begun, in desperation, to train recruits in techniques the order considers forbidden: not severing corruption, but *binding* it, borrowing from the very traditions the Inquisitors were founded to destroy. She knows this is how the order ends. She does not see another way it survives."
  }
}

#### Toxicologist

Source vtt-react/src/data/classes/toxicologistData.js:60

{
  "variant": {
    "subraceName": "Broken Mimir",
    "title": "The Floor-Brewer",
    "reframe": "The <LoreLink termId=\"mimir\">Broken Mimir</LoreLink> renegades brew toxins from the canopy's undergrowth, the fungal mats and acidic secretions of the forest floor they inhabit. Where the Tallyn distill predators, the Broken Mimir distill *decay*, the slow chemistry of decomposition, weaponized by the people who live closest to it.",
    "signatureAbility": {
      "name": "Floor-Decay",
      "description": "Toxins are cultivated from decomposing undergrowth and optimized for *persistence*, once deployed, they linger in the environment for weeks. The Broken Mimir's floor-toxins are the tradition's longest-lasting agents."
    },
    "currentCrisisAngle": "The changing fog is altering the undergrowth's decomposition chemistry, and the floor-toxins are mutating.",
    "signatureQuote": {
      "text": "\"I brew what the floor gives me. The floor is giving me something new. It does not stay where I pour it. I am afraid I have poisoned the only home I had.\"",
      "speaker": "Broken Mir-Naeth",
      "context": "A Broken Mimir Toxicologist, abandoning her floor-dwelling to a spreading bloom of her own toxin"
    }
  },
  "edge": {
    "className": "Toxicologist",
    "heritageId": "tethered_mimir",
    "description": "Mir-Haeth's Falling Lesson cultivates a persistent floor-derived agent.",
    "costDescription": "Setup and decay conditions; no mask requirement.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "cultivate_floor_derived_agent",
      "condition": {
        "type": "medium",
        "value": "poisoned_corpses"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "setup_decay_conditions"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Toxicologist",
    "heritageId": "tethered_mimir",
    "requirements": [
      "tolerance_induction",
      "distillation_training"
    ],
    "reason": "Tolerance induction and distillation/preparation apprenticeship"
  },
  "order": {
    "orderName": "The Distillery",
    "founder": {
      "name": "<LoreLink termId=\"varis\">Varis</LoreLink>",
      "status": "Alive, old, trembling, and still working. The <LoreLink termId=\"frostwood-reach\">Tallyn</LoreLink> alchemist who extracted raw venom from fog-predators to defend against face-stealing horrors. Years in the ironwood canopies left him with chronic tremors, burned-away taste, and permanently stained fingers. The venoms that destroyed his nerves and stole his taste also froze his aging  -  a side effect he discovered too late to benefit from and too early to die from. He has been old for four hundred years. He cannot sign his own name legibly. He can still pour a lethal dose without spilling.",
      "note": "<LoreLink termId=\"varis\">Varis</LoreLink> built the Distillery on patience: a poison laid today that blooms in a week. The changing fog is rewriting his pharmacopoeia in real time, and the most premeditative tradition in Mythril is being forced to improvise, the one thing it was never built to do."
    },
    "currentLeader": {
      "name": "<LoreLink termId=\"varis\">Venom-Master Varis the Trembling</LoreLink>",
      "title": "Keeper of the Slow Cup",
      "characterization": "<LoreLink termId=\"varis\">Varis</LoreLink> still leads, though his tremors make the work dangerous and his junior distillers flank every pour. He is stubborn, brilliant, and furious at the fog in a way only a four-century practitioner can be, the resentment of a master watching his medium rewrite itself without his consent. He considers the changing fog a personal insult."
    },
    "headquarters": {
      "name": "The Distillery  -  Canopy-Laboratory, the Shallows (Frostwood Reach)",
      "locationId": "frostwood-reach"
    },
    "foundingEvent": {
      "eventName": "The Third Harvest of the Gref-Veil",
      "location": "The Shallows, Frostwood Reach  -  Thornwood patrol route",
      "year": "Mid-Diming, c. 400 years before present",
      "summary": "In the mid-Freeze decades, the fog-predators known as the Gref grew bolder. Unlike the Geaslan (which hunted the mist alone), the Gref had learned to coordinate  -  a hunting-pack behavior no Tallyn naturalist had ever documented. During what the survivors called the Third Harvest, a Gref-pack cornered a Tallyn scout patrol of six at Thornwood, a shallow-ironwood grove three leagues east of the Shallows, and *peeled* four of them before the remaining two escaped. The Gref did not kill them. They stole their faces, their voices, their memories, and for three weeks the four dead scouts *walked back into the settlements* wearing their killers' stolen identities. The Shallows executed seventeen people  -  some of them the Gref-wearing husks, some of them innocent neighbors indistinguishable from the predators  -  before the infestation was purged. Watching his patrolmates return as hollow mimics broke something in Varis. He declared that he would find a weapon the Gref could not steal, could not wear, could not turn back upon his people. He spent the next decade isolating the venom-glands of captured Gref specimens in a canopy-laboratory suspended above the Thornwood grove where his patrol died, and the Toxicologist tradition was born not from curiosity but from vengeance."
    },
    "culturalSpread": {
      "title": "The Spread of the Slow Cup",
      "description": "The Toxicologist craft did not remain confined to the Tallyn. Over four centuries, the tradition spread across Mythril through a chain of desperate transmissions  -  refugees, exiles, spies, and debtors each carrying the craft to a new people who needed it for their own reasons.",
      "vectors": [
        {
          "from": "Tallyn",
          "to": "Broken Mimir",
          "vector": "The Broken Mimir share the Frostwood with the Tallyn, dwelling on the forest floor beneath the same canopies. When the Tallyn began deploying fog-venom perimeters against the Gref, the Broken Mimir observed the results from below  -  predators that survived the canopy traps fell dying into the floor-dwellings. The first Broken Mimir Toxicologists did not learn from Varis directly; they learned by *reverse-engineering the corpses* that rained down on their settlements. A Broken Mimir elder named Mir-Haeth collected dying Gref, studied the venoms still active in their wounds, and cultivated the first floor-toxin from the fungal mats that flourished where the poisoned corpses decomposed. The Broken Mimir call this transmission \"the Falling Lesson.\" They never asked the Tallyn for permission, and the Tallyn never offered it."
        },
        {
          "from": "Tallyn",
          "to": "Mycellan",
          "vector": "The Bryngloom is far from the Frostwood, but the Athien contract-economy draws resources from every corner of Mythril. Tallyn distillers who fell into debt to the Athien (which most eventually did, given the cost of fog-predator-hunting equipment) were indentured to work the Bryngloom peat-fields alongside Mycellan families serving their own generational debt. A Tallyn debt-worker named Hael the Split-Hand, sentenced to twenty years of peat-cutting, began teaching the Mycellan the principles of venom-distillation during the long nights in the bog-worker dormitories  -  not out of generosity, but because the Mycellan knew the bog's alchemical moss better than any Tallyn ever could, and Hael saw a way to pay off his contract faster by producing saleable distillates. The Mycellan adapted Tallyn techniques to bog-chemistry within a generation, producing toxins the Tallyn had never imagined. Hael died in the bog before his debt was cleared. The Mycellan remember his name."
        },
        {
          "from": "Tallyn",
          "to": "Briaren Florae",
          "vector": "The Briaren Florae learned toxicology through a transaction that both sides now regret. A Briaren elder named Bri-Aethren, observing the Tallyn's chemical defenses against the Gref, offered a Thornwood Accord: in exchange for Tallyn distillation techniques, the Briaren would teach the Tallyn how to read the fae-signs that predict fog-predator movements. The Tallyn accepted. What they did not anticipate was that the Briaren would adapt human alchemy to their own biology  -  distilling from thorn-blood rather than predator venom, creating a fae-alchemical hybrid that neither the Tallyn nor the fae-contracts had anticipated. The Briaren now possess the tradition's most personal and most dangerous poisons, and the Tallyn distillers who made the original trade consider it the worst bargain of their lives. Bri-Aethren has since disappeared into the deep groves and no longer answers to anyone."
        },
        {
          "from": "Mycellan",
          "to": "Riven",
          "vector": "The Riven learned the craft from Mycellan bog-chemists fleeing the Keeper's Sanction. When Mor-Velk the Wet began intercepting ichor shipments meant for Athien contract-rituals, she knew the Ledger would eventually trace the theft. She sought refuge in the Deep-Quarter, where the Riven  -  legally non-existent, untraceable by contract-enforcement  -  offered her sanctuary. In exchange for protection, Mor-Velk taught the Riven everything she knew about bog-reading and alchemical distillation. The Riven adapted the craft to their own condition: their half-decayed flesh, no longer preserved by Morvane's contract, hosts decomposition chemistry that no living Toxicologist can replicate. The resulting null-distillates are the only poisons in Mythril that cannot be registered on the First Contract, making the Riven Toxicologists the most dangerous chemists Morvane has never heard of."
        }
      ]
    },
    "ranks": {
      "title": "The Hierarchy of the Slow Cup",
      "ranks": [
        {
          "rank": "Keeper of the Slow Cup",
          "count": 1,
          "holder": "Varis the Trembling",
          "description": "The founder and master of the Distillery. The rank is named for Varis's belief that the best poison is the one you pour today and let bloom tomorrow. No successor has been named; Varis refuses to discuss succession."
        },
        {
          "rank": "Venom-Pourer",
          "count": 12,
          "holders": "Senior distillers including Lyra the Poison-Weaver (Broken Mimir), Mor-Velk the Wet (Mycellan, in absentia), Bri-Vess the Thorn-Venom (Briaren, in absentia)",
          "description": "Master distillers who have produced at least one original toxin formulation ratified by the Keeper. Each Venom-Pourer oversees a satellite distillery in their home region and is authorized to teach the craft. Three of the twelve are currently in absentia  -  fugitives from their respective regional authorities who maintain contact through encrypted formula-letters."
        },
        {
          "rank": "Glass-Hand",
          "count": "~40",
          "description": "Journeyman distillers who have completed their apprenticeship and maintain their own small laboratories. Glass-Hands are permitted to sell low-grade poisons to scouts, hunters, and fog-predator-control. They handle the Distillery's day-to-day operations and are the rank most likely to interact with outsiders."
        },
        {
          "rank": "Shaker",
          "count": "~80",
          "description": "Apprentices, named for the tremors they have not yet learned to control. Shakers spend their first five years doing nothing but cleaning glassware, recording formula variations, and learning to pour without spilling. Most Shakers wash out within two years  -  the chronic toxin exposure is too much. Those who stay develop the stains, the tremors, and the burned-out tastebuds that mark a true Toxicologist."
        },
        {
          "rank": "Tongue-Burned (Unofficial)",
          "count": "Unknown",
          "description": "A grim colloquialism for Toxicologists whose sense of taste has been completely destroyed by toxin exposure  -  a common milestone that the Distillery treats as an informal rank. Tongue-Burned distillers can no longer taste-test their own work and must rely entirely on chemical indicators and junior tasters. Varis has been Tongue-Burned for over four centuries."
        }
      ],
      "note": "The Distillery is not a formal guild with charters, dues, or legal recognition. It is an oral tradition organized around a particular set of techniques, maintained by a man who cannot write legibly and enforced by the mutual reliance of poisoners who have no one else to trust."
    },
    "rival": {
      "name": "Nerath the Soft-Voiced",
      "title": "Former Venom-Pourer, now Keeper of the Clean Hand",
      "status": "Exiled from the Distillery, operating independently from an unmarked laboratory in the Ironwood Deeps",
      "conflict": "Nerath was Varis's most brilliant Venom-Pourer  -  the only Toxicologist in the tradition's history to produce six original toxin formulations before the age of forty. When the fog began changing and the pharmacopoeia began to spoil, Nerath argued that Varis should abandon the old formula entirely: stop distilling fog-predator venom, stop trying to preserve the old pharmacopoeia, and start fresh with synthetic chemistry independent of the Frostwood's native rot. \"The fog is rewriting the rules,\" Nerath told the assembled Venom-Pourers at the Conclave of Spoiling, held in the Canopy-Laboratory three years ago. \"We should be writing new ones, not preserving the old ones in brine.\" Varis accused him of cowardice. Nerath accused Varis of senility  -  of being too old and too stubborn to see that his life's work was already dead, that the fog-predator venoms were not salvageable, that every vial Varis poured from the old pharmacopoeia was a waste of time that could go into finding alternatives. The argument ended with Nerath breaking a vial of his own formulation  -  a synthetic neurotoxin he had developed without predator-venom  -  against the laboratory floor and walking out. Half the Glass-Hands agreed with Nerath privately. None followed him publicly. Nerath now operates alone in the Ironwood Deeps, developing synthetic toxins from mineral chemistry rather than biological extraction. His poisons work  -  they are stable, reproducible, and unaffected by the changing fog  -  but they lack the potency of predator-derived venoms, and they have a signature that anyone with chemical training can identify. Varis calls Nerath's work \"factory poison  -  a blunt instrument for a blunt mind.\" Nerath calls Varis's work \"a museum devoted to a dead world.\" Neither has spoken to the other in three years. The junior distillers whisper that if the fog doesn't kill the Distillery, the schism between Varis and Nerath will.",
      "significance": "Nerath's break from the Distillery represents the tradition's deepest philosophical fracture: whether to adapt or preserve. If Varis dies before the fog crisis is resolved, Nerath is the only person with the knowledge, the formulations, and the institutional memory to run the Distillery  -  and he has already made it clear that he would dismantle the old pharmacopoeia entirely. The Venom-Pourers are terrified that the Distillery will die with its founder, split between a dead man's stubbornness and a traitor's ambition."
    },
    "crisisConnection": "<LoreLink termId=\"varis\">Varis</LoreLink> is presiding over the spoilage of his life's work: fog-predator venoms degrading in weeks rather than years, the entire Distillery pharmacopoeia turning unstable. His desperation project, distilling the *changing fog itself*, has produced reagents no one can characterize, and two of his apprentices  -  a young Tallyn Shaker named Kellan Soft-Hand and a veteran Glass-Hand named Torven the Steady, killed three months apart testing uncharacterized fog-distillates on themselves  -  have died for his obsession. Varis refuses to stop. He has spent four centuries mastering the Frostwood's chemistry, and he will master the new chemistry or die in the attempt. The Distillery's junior members are no longer certain which outcome they are rooting for."
  }
}

#### Animist

Source vtt-react/src/data/classes/animistData.js:55

{
  "variant": {
    "subraceName": "Broken Mimir",
    "title": "The Mote-Speaker",
    "reframe": "The Broken Mimir live unmasked, anchored by a personal Mote. Their tradition calls family ancestors from scripture, using the Mote to separate the self from a visiting voice; over-channeling risks the personal memory anchor.",
    "signatureAbility": {
      "name": "Mote Anchor",
      "description": "Your Mote helps separate self from a visiting voice; over-channeling risks the personal memory anchor."
    },
    "currentCrisisAngle": "The Broken Mimir are losing their Motes to the cartels, and a family that cannot anchor a voice may lose its dead to the fog.",
    "signatureQuote": {
      "text": "No mask. Just a Mote, a scripture, and the dead who answer to my name.",
      "speaker": "Mote-Keeper Hal",
      "context": "A Broken Mimir Animist, unmasked"
    }
  },
  "edge": {
    "className": "Animist",
    "heritageId": "tethered_mimir",
    "description": "Your Mote separates self from a visiting voice.",
    "costDescription": "Over-channeling risks the personal memory anchor.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "separate_self_from_voice_by_mote",
      "condition": {
        "type": "equipment",
        "value": "personal_mote"
      }
    },
    "cost": {
      "kind": "risk",
      "unit": "capability",
      "capability": "overchannel_risks_anchor"
    }
  },
  "access": {
    "status": "normal-tradition",
    "selectable": true,
    "className": "Animist",
    "heritageId": "tethered_mimir",
    "requirements": [
      "spirit_anchor",
      "communion_apprenticeship"
    ],
    "reason": "A memorial/spirit anchor and guided communion apprenticeship"
  },
  "order": {
    "orderName": "The Silent Throat",
    "founder": {
      "name": "Kael the Herd-Runner",
      "status": "Dead. The first of the three named Animist founders, an Ordu throat-singer who sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. The practice predates writing  —  it was navigation, not philosophy. The Ordu do not know who first sang the dead into the wind, only that when the stars went dark, Kael began singing ancestor-names and the herds still found their way.",
      "note": "Kael is canonically one of three co-founders of the Animist tradition (alongside Nyssa the Herbalist and Theron the Skald Scholar). The Ordu throat-singing tradition lives entirely in muscle-memory, teacher to student, voice to voice, and Kael is the root of that lineage. Later traditions (Skald, Mycellan, Astril, Athien) all trace their root technique to Kael's work."
    },
    "currentLeader": {
      "name": "Bayar Wind-Throat",
      "title": "Last Singer of the Old Route",
      "characterization": "An Ordu elder who still sings the migration-routes in the old tongue of the Long Before  —  the language that predates the dialect-fracture. Bayar has not spoken a word aloud in forty years; he communicates only through throat-sung overtones, the way the First Singer did. His vocal cords are calcified from decades of channeling ancestors who died before the stars went out. He is the living archive of the oldest form, and he watches the younger traditions drift further from the root with every generation  —  not with anger, but with the patience of someone who knows the dead will correct them eventually."
    },
    "headquarters": {
      "name": "The Sundrift Wind-Shrine (moving camp)",
      "locationId": "sundrift-vale"
    },
    "crisisConnection": "Bayar Wind-Throat is the only living Animist who still sings the pre-fracture language. The dialect-fracture is a problem of the dead themselves  —  the oldest dead (those who died before the <LoreLink termId=\"sundered_monoliths\">Monoliths</LoreLink> woke) speak clearly. The newer dead are confused, their voices layered with static no throat-singer can parse. Bayar suspects something is wrong with the threshold of death itself, and the Monoliths' awakening is not a cause but a symptom. He cannot prove this, because the evidence is in a language no one else remembers how to hear."
  }
}

Rare-route authored edges:

[
  {
    "className": "Lunarch",
    "heritageId": "tethered_mimir",
    "access": "E",
    "description": "A declared vigil or Mote reference resists confusion without a mask.",
    "costDescription": "The vigil is chosen behavior, not power erased for leaving a post.",
    "edge": {
      "kind": "capability",
      "unit": "capability",
      "capability": "vigil_mote_reference",
      "condition": {
        "type": "state",
        "value": "declared_vigil"
      }
    },
    "cost": {
      "kind": "obligation",
      "unit": "capability",
      "capability": "chosen_vigil_behavior"
    }
  }
]

