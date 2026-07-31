import { UTILITY_SPELLS } from '../spells/utilitySpells';
export const ANIMIST_DATA = {
  restrictions: {
      "allowedSubraces": [
          "ordan_human",
          "skald_human",
          "vashir_astril",
          "silath_astril",
          "morgh_groven",
          "thrask_solari",
          "florae_unified"
      ],
      "hardBlocks": [
          "solari",
          "fexrick",
          "myrathil",
          "tessen_human"
      ],
      "narrativeUnlock": true,
      "justification": "Requires ancestral spirit-channeling. Solari commune with volcanic entities (different tradition). Fexric see spirits as machine-failure states. Tessen isolation prevents access. Myrathil have no land spirit tradition."
  },

  /**
   * Subrace Variants  —  the Animist is a single ancestral discovery that spread
   * across the continent through trade, war, and desperation. Each culture adapted
   * the root technique (the dead remember what the living need) to its own medium:
   * voice, rune, spore, contract, heritage, or archive. The ancestral language
   * they all share is fracturing now, for reasons no one understands.
   */

  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // TODO: review weapon/armor lists for class accuracy per lore compendium.
  equipment: {
   weapons: ['staff', 'totem', 'spear'],
   armor: ['light_armor', 'robes'],
   offHand: ['totem', 'tome', 'empty']
  },
  subraceVariants: {
    ordan_human: {
      subraceName: 'Ordan',
      title: 'The Steppe-Throat',
      reframe: `The <LoreLink termId="skald">Ordan</LoreLink> Animist is the root tradition from which all others descended. When the stars went dark, the Ordan throat-singers turned their overtones from star-names to ancestor-names and discovered the dead remember what the living need. The Ordan Animist does not carve runes or inhale spores. They sing. The ancestor lives in the overtone, the second voice the throat produces above the fundamental, woven into the mane-hair of the migration-horse and carried fifteen miles across the <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink>. An Ordan Animist who loses their voice loses their entire lineage in a single silence.`,
      signatureAbility: {
        name: 'Overtone-Channel',
        description: `A practitioner of ancestor-communion through physical transformation. Bone erupts from flesh as totems. Glowing sigils burn across skin. The voices of ancestors speak through the practitioner's own throat, and the price of carrying them is Spirit Erosion, a slow consumption of the self by the spirits that were invited in.`,

      },
      currentCrisisAngle: `The Ordan's throat-sung dialect was never written down, it lives only in muscle-memory. As the ancestral language fragments, the Ordan hear the disharmony first and loudest, and cannot cross-reference it against the runic or spore traditions because they have no text to compare. They are screaming about a fracture no one else can verify.`,
      signatureQuote: {
        text: '"The ancestor is the second voice. Kill the first, and I will still answer you with the one that matters."',
        speaker: 'Bayar Wind-Throat',
        context: 'A stepse Animist who survived losing his speaking voice to a Wyrd-strike'
      }
    },

    vashir_astril: {
      subraceName: 'Earthen Astril - Astril',
      title: 'The Heritage-Conduit',
      reframe: `The <LoreLink termId="astril">Earthen Astril</LoreLink> seek total symbiosis with the Lumia heritage nesting in their crystalline skin. Learned from Ordan throat-singers during centuries of steppe cohabitation: the Astril adapted the ancestor-compass concept to their own blood-memory, channeling the echo of a dead world rather than discrete ancestors. An Astril Animist does not summon a separate ancestor, they commune with the fragment of a dead world's biosphere carried in their own blood. The heritage is not external. It is the host. They channel the trapped memory of a dead world through skin that hums with the resonance of what was lost.`,
      signatureAbility: {
        name: 'Star-Communion',
      description: `Spirit-power scales with the depth of the host's symbiosis; a fully-symbiotic Earthen Astril Animist channels the heritage as self, not as other. Power is strongest in absolute darkness, where the trapped light of the dead world in their skin is the only light left.`
      },
      currentCrisisAngle: `The Lumia heritage in Earthen Astril blood predates the Animist tradition, it is the loudest "ancestors" of any tradition. When the dialect fractured, the Earthen Astril's heritage began screaming contradictory prophecies through crystalline skin. Young Earthen Astril Animists are going mad, unable to silence a chorus that predates the language meant to speak to it.`,
      signatureQuote: {
        text: '"You call them ancestors. I call them the memory of a dead world, and they live in my forearm. Do not ask me to be quiet about it."',
        speaker: 'Lirien Bright-Veined',
        context: 'A Earthen Astril Animist, declining to join a cross-cultural ancestral communion at the Sundrift Wind-Shrine'
      }
    },

    clean_vreken: {
      subraceName: 'Clean Vreken',
      title: 'The Spore-Inhaler',
       reframe: `Among the Vreken, the Wyrd wears one local mask: it is inhaled as bioluminescent spores, a regional manifestation of Keth-Amar's corruption rather than a separate origin. The <LoreLink termId="vreken">Clean Vreken</LoreLink> inhale the Wyrd through these spores, letting the ancestral dead ride fungal particles into the lungs and speak through shifting glow-patterns on the skin. Learned from Ordan throat-singers during Bryngloom border trade: a Clean Vreken walked into the bog after trading with Ordan herders, inhaled spores with deliberate intent, and discovered the Wyrd answered through mycelium. The dead speak through fungus, and the Clean Vreken have been breathing the dead ever since.`,
      signatureAbility: {
        name: 'Spore-Inhalation',
        description: `The Wyrd � Keth-Amar's spiritual corruption bleeding through the Breach � saturates the fungal strains native to the deep <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink>. The Clean Vreken inhale these spores as a conduit, letting the ancestral dead ride bioluminescent particles into the lungs; bonds form there and express as bioluminescent skin-text. The spores are not the Wyrd itself, but a biological medium that carries its resonance. The deep-glow makes spirit-dialogue legible at a distance, but broadcasts every emotion to every Vreken nearby.`
      },
      currentCrisisAngle: `The fungal substrate is the Clean Vreken's dialect, and that substrate is one with the <LoreLink termId="root_veil">Root-Veil</LoreLink>. When the Root-Veil shifts, the Clean Vreken hear it as a scream. The dialect-fracture feels, to them, like the forest itself is being strangled, and they are the only tradition that feels it as physical pain.`,
      signatureQuote: {
        text: '"You carve your dead into stone. You sing them into wind. I breathe mine, and when the forest coughs, I taste blood."',
        speaker: 'Mother Ysen',
        context: 'A Clean Vreken spore-elder, explaining why she will not travel south'
      }
    },

    morren_human: {
      subraceName: 'Vreken',
      title: 'The Debt-Bound',
      reframe: `The <LoreLink termId="house_morrath">Vreken</LoreLink> are debtors to the Neth, and a Vreken Animist channels no glorious ancestor, they summon the specific forebear whose unpaid contract still accrues interest against their family. Adapted from the Ordan ancestor-compass technique through Neth contract-culture: the Vreken took the concept of the dead remembering obligations and applied it legally. The ancestor is not honored. The ancestor is *owed*. Every Vreken family recites their contract at mealtimes; the Animist makes that recitation literal.`,
      signatureAbility: {
        name: 'Contract-Invocation',
        description: `The spirit summoned is the family's debt-ancestor; it bargains for service rather than aiding freely, each invocation incrementally renegotiating an inherited obligation. Power, for a Vreken Animist, is also a form of payment, and the interest compounds.`
      },
      currentCrisisAngle: `The Vreken are the only tradition whose ancestors are *legally* bound. When the dialect fractured, the debt-ancestors began refusing to acknowledge renegotiations, demanding the original terms, in the original language, which the living no longer speak correctly. Families are being called to account for debts they cannot even recite, and Morvane's Sanction looms.`,
      signatureQuote: {
        text: '"My grandmother borrowed her survival and left me the bill. Now she will not leave until I have read it back to her, correctly, in a language neither of us remembers."',
        speaker: 'Petr Debt-Son',
        context: 'A Vreken Animist, the night before his family\'s contract-review'
      }
    },

    skald_human: {
      subraceName: 'Skald',
      title: 'The Rune-Keeper',
      reframe: `Where the Ordan sing and the Vreken inhale, the <LoreLink termId="skald">Skald</LoreLink> inscribe. Learned from Ordan throat-singers during Groven span-crossings along the Hunger Road: a Skald trader heard the ancestor-songs, recognized that the Ordan were carrying voices, and carved the first ancestor-rune into his own skin to make the record permanent. They carve their ancestors' names into their own skin, the rune IS the ancestor, and the scar-tissue is its house. A Skald Animist covered in runic scars carries a permanent retinue of the dead, each anchored to a specific wound that never fully closes.`,
      signatureAbility: {
        name: 'Skin-Rune Anchoring',
        description: `Spirits are bound to carved runes on the Animist's own body; the more runes, the more ancestors on call, but each rune is a permanent open wound that re-opens and bleeds during invocation. A Skald Animist's power is written, visibly, in their scars.`
      },
      currentCrisisAngle: `The Skald's runic dialect is the most rigid, carved in flesh, it cannot adapt. When the ancestral language shifted, the runes did not shift with it. Carved ancestors are now speaking a dialect no living practitioner matches, and the runes, cut in good faith twenty-five generations ago, are beginning to itch, warm, and, some swear, migrate.`,
      signatureQuote: {
        text: '"My great-grandmother carved this name into her own arm so it would outlast the glacier. It has. She has not been so cooperative."',
        speaker: 'Hakon Scar-List',
        context: 'A Rune-Keeper of the Frozen Archive, counting his open wounds'
      }
    },

    velun_neth: {
      subraceName: 'Velun Neth',
      title: 'The Ledger-Summoner',
      reframe: `The <LoreLink termId="neth">Velun Neth</LoreLink> carry Morvane's authority in every word they speak, and Morvane does not forget. Adapted from the Ordan ancestor-compass technique through archival synthesis: the Velun Neth took the concept of summoning the dead and made it legally binding. A Velun Neth Animist does not commune with the dead; they *file a request*. The ancestor is a recorded entry in the great archive of <LoreLink termId="atropolis">Atropolis</LoreLink>, summoned through proper citation, offer, and acknowledgment of outstanding obligation.`,
      signatureAbility: {
        name: 'Ledger-Citation',
        description: `Spirits are summoned by referencing their exact entry in the archive; the more precise the citation (full name, dates, contract history), the stronger the bond. A mis-citation summons the wrong ancestor, and the Velun Neth cannot legally dismiss what they have invoked.`
      },
      currentCrisisAngle: `The Velun Neth are the tradition most committed to a unified ancestral language, it is their filing system. The dialect-fracture is, to them, a corruption of the archive itself. Some senior Ledger-Summoners suspect the <LoreLink termId="morvane">Morvane</LoreLink> is permitting it, that the death-threshold guardian is, for reasons of its own, redacting the dead.`,
      signatureQuote: {
        text: '"You speak to your ancestors. I file a motion to hear mine. The difference is that mine always answer, and the answer is always admissible."',
        speaker: 'Clerk Vel-Ossaren',
        context: 'A senior Ledger-Summoner, declining an invitation to a spirit-communion'
      }
    },

    silath_astril: {
      subraceName: 'Stellar Astril - Astril',
      title: 'The Star-Communer',
      reframe: `The Animist tradition arrived to the <LoreLink termId="astril">Stellar Astril</LoreLink> not through bone or spore or rune, but through ritual \u2014 the same nightly rite that keeps the Selunis-awakening alive. Learned from Ordan throat-singers during centuries of steppe cohabitation: the Stellar Astril adapted the ancestor-compass through Lumia heritage, channeling the consciousness of the dead star itself rather than discrete ancestors. A Stellar Astril Animist channels Lumia's consciousness rather than a discrete ancestor. The \u201cancestor\u201d is the dead star itself, and the channel is the moon-courtyard where the ritual has been performed for centuries. Resonance builds fastest at night beneath the moon. The communion is silent, internal, invisible \u2014 no bone eruption, no runic scarring, no spore-inhalation. Just a Stellar Astril standing still in the courtyard, eyes closed, while the dead star speaks through their crystalline markings.`,
      signatureAbility: {
        name: 'Moon-Court Communion',
        description: `Power-scaling is tied to the nightly rite in the moon-courtyard, resonance builds fastest at night beneath the open moon. The communion is silent, internal, and invisible, channeling the dead star's consciousness rather than a discrete ancestor. Power is strongest when the Stellar Astril is motionless, the crystalline markings on their skin pulsing with stolen starlight.`
      },
      currentCrisisAngle: `The dialect-fracture has reached the Stellar Astril in a way the other traditions cannot comprehend. The dead star they commune with is not part of the ancestral language at all \u2014 it predates the Animist traditions entirely. When the Stellar Astril's star-communion began returning contradictory echoes, the elders could not tell whether the star itself had fractured or whether the echoes were from a timeline the star had already witnessed and lost. The moon-courtyards have gone silent for the first time in centuries, and the younger Stellar Astril Animists are beginning to wonder if the star has stopped speaking because there is nothing left to say.`,
      signatureQuote: {
        text: '"You carve, you sing, you breathe your dead. I stand still and let the dead star do all the talking. It has been talking for eight centuries. Tonight it went silent. I am very afraid."',
        speaker: 'Selenis Night-Still',
        context: 'A Stellar Astril Animist, the first night the moon-courtyard returned silence'
      }
    }
  },

  id: "animist",
  name: "Animist",
  icon: "fas fa-seedling",
  role: "Support / Control / Terrain",
  damageTypes: ["primal", "blight", "storm", "smashing", "stabbing", "slicing", "ember"],
  implemented: true,
  

  classIdentity: {
    title: "The Ancestral Conduit",
    subtitle: "Blood-Bound Voice of the Wild and the Written Word",
    utility: "Channel ancestral power through the three adapted forms of a single root technique: bone totems erupted from the body (the Ordan throat-singer's physical legacy), curse-driven spirit invocations (the Vreken spore-inhaler's Wyrd resonance), and permanent runic networks carved into earth and flesh (the Skald trader's flesh-record). Terraform the battlefield, summon specters, and inscribe sacred sigils, paying for every manifestation through the mounting toll of Spirit Erosion.",
    fatalFlaw: "Triple catastrophic flaw from fused traditions. Spirit Erosion at 15+ Ancestral Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters active runic networks dealing backlash, and the spirits demand service with 1d6 wyrd/turn if you hoard resonance without invoking. The Animist walks three tightropes simultaneously, and falling from any one is devastating."
  },

  livingOrder: {
    orderName: 'The Silent Throat',
    founder: {
      name: 'Kael the Herd-Runner',
      status: `Dead. The first of the three named Animist founders, an Ordan throat-singer who sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. The practice predates writing  —  it was navigation, not philosophy. The Ordan do not know who first sang the dead into the wind, only that when the stars went dark, Kael began singing ancestor-names and the herds still found their way.`,
      note: `Kael is canonically one of three co-founders of the Animist tradition (alongside Nyssa the Herbalist and Theron the Skald Scholar). The Ordan throat-singing tradition lives entirely in muscle-memory, teacher to student, voice to voice, and Kael is the root of that lineage. Later traditions (Skald, Vreken, Astril, Velun Neth) all trace their root technique to Kael's work.`
    },
    currentLeader: {
      name: 'Bayar Wind-Throat',
      title: 'Last Singer of the Old Route',
      characterization: `An Ordan elder who still sings the migration-routes in the pre-Deepening tongue  —  the language that predates the dialect-fracture. Bayar has not spoken a word aloud in forty years; he communicates only through throat-sung overtones, the way the First Singer did. His vocal cords are calcified from decades of channeling ancestors who died before the stars went out. He is the living archive of the oldest form, and he watches the younger traditions drift further from the root with every generation  —  not with anger, but with the patience of someone who knows the dead will correct them eventually.`
    },
    headquarters: { name: 'The Sundrift Wind-Shrine (moving camp)', locationId: 'sundrift-vale' },
    crisisConnection: `Bayar Wind-Throat is the only living Animist who still sings the pre-fracture language. The dialect-fracture is a problem of the dead themselves  —  the oldest dead (those who died before the <LoreLink termId="sundered_monoliths">Monoliths</LoreLink> woke) speak clearly. The newer dead are confused, their voices layered with static no throat-singer can parse. Bayar suspects something is wrong with the threshold of death itself, and the Monoliths' awakening is not a cause but a symptom. He cannot prove this, because the evidence is in a language no one else remembers how to hear.`
  },

  worldFriction: [
    { region: 'nordhalla', status: 'persecuted', consequence: 'The Cleansing of the Hearth, House Skalvyr religious purge, explicitly targets tribal Animists and Sky-Readers. Practitioners caught throat-singing or skin-carving are arrested; the Runic Academies denounce ancestral communion as heresy.', workaround: 'The Skald Rune-Keeper variant survives by framing its practice as genealogy rather than magic, the runes read as record-keeping to inquisitors who do not look too closely.' },
    { region: 'sundrift-vale', status: 'persecuted', consequence: 'House Ordavan systematically purges Sky-Singers under the state-enforced ancestor worship. Ordan throat-sung Animists are the most hunted; their overtones carry for miles and cannot be hidden.' },
    { region: 'bryngloom-forest', location: 'atropolis', status: 'tolerated', consequence: 'The Velun Neth Ledger-Summoners are legally protected as archival practice; the Vreken spore-elders are tolerated as a forest-floor fixture. Bryngloom is the safest region for an Animist, provided they do not disturb the Root-Veil.' }
  ],

  overview: {
        originStory: `A practitioner of ancestor-communion through physical transformation. Bone erupts from flesh as totems. Glowing sigils burn across skin. The voices of ancestors speak through the practitioner's own throat, and the price of carrying them is Spirit Erosion, a slow consumption of the self by the spirits that were invited in.

The tradition began in the Sundrift Vale during the early centuries of the Dimming, when House Ordavan traded fertile soil for the endless migration and the sky went starless. The Ordan had navigated by star-maps for centuries. Suddenly they had nothing. The herds still moved, the steppe was still featureless, the wind still blew, but no one knew where they were going.

The throat-singers adapted first, though not by design. They had always encoded migration routes in overtone harmonies, the old names of stars carried in the second voice the throat produces. When the stars went dark, the songs lost their referents. The overtones were still there, but they mapped to nothing. Throat-singers tried replacing the star-names with landmarks, wind-patterns, and the seasonal rhythms of the herds. All of these failed, the steppe shifts, the wind lies, and the herds follow paths the living no longer remembered.

It was an elder named Hearth-Singer, whose name has been lost but whose title the tradition still carries, who first tried the dead. She was dying anyway, too old to keep pace with the migration, left at a mound-camp to wait for the end. She spent her final weeks singing. Not the migration songs, she had forgotten those. She sang the names of her ancestors instead, one after another, working backward through memory. On the third night, something answered. Not the ancestor she was singing to. Something older, further back, a voice that had been carried in the bloodline since before the sky went dark. It knew the route. It had walked it before the stars were mapped. It had been waiting, the Hearth-Singer realized, for someone to listen.

She followed the voice south. She found the herd. She died three days later. But she had proven that the dead could navigate where the stars could not.

The practice spread along the Hunger Road. Skald caravans crossing the Groven Ancestor-Spans heard Ordan throat-singers and recognized the technique: they were carrying voices. The Skald, whose culture already preserved their dead in glacier-ice panels at Skalvyrhold, began carrying their own, carving ancestor-names directly into skin, making the flesh a permanent record. A Skald covered in runic scars carries a retinue of the dead, each anchored to a wound that never fully closes.

The Earthen Astril adapted the practice through their Lumia heritage, the fragment of a dead world's biosphere living in every Astril bloodline. A Earthen Astril does not summon a separate ancestor. The heritage itself is the ancestor, channeled through crystalline skin that hums with lost starlight. The Earthen Astril variant is strongest in absolute darkness, where the trapped light in their markings is the only light left. The Stellar Astril practice a quieter version, communion through ritual stillness under the moon, where the dead world's consciousness speaks through crystalline markings rather than erupted bone.

The Morgh Groven carry the most literal version of the art. The Still-Claiming already turns Groven dead into calcified stone, the ancestors literally become the bridges their descendants walk. A Morgh channels the dead not as spirits but as mineral memory, drawing on the same alchemical residues the Deep Alchemists used to reshape the Groven from Thrumm stock. The race that was sculpted against its will now sculpts itself.

The Waste-Solari adapted the art through forge-memory. The volcanic forges of Sundale have been burning since before humans walked the world, and the Waste-Solari believe that every hammer-strike carries the echo of every smith who struck that anvil before. A Waste-Solari does not sing ancestors or carve them into skin. They work the forge. The dead are in the metal, answering through the ring of hot iron, the oldest continuous craft tradition on Mythril preserved in the muscle memory of hands that learned from hands.

The Trueborn Florae adapted the tradition through their fae-touched blood. The bloodline carries the memory of House Viridane's refusal, the one house that said no to the dark bargains, that fled south into the moonlit groves. A Trueborn channels not individual ancestors but the collective memory of that refusal, the thorn-scars on their skin blooming into living records of every Florae who died before their debt was paid.

The ancestral language that all practitioners share is fading. The older dead, those who died before the Dimming, still speak clearly. The newer dead are increasingly confused. Something is wrong with death itself. The Monoliths' awakening is accelerating the erosion, and the youngest practitioners, those who attempt to carry too many voices, are suffering complete sensory collapse. The current leader, Bayar Wind-Throat, is one of the last who can still sing the pre-fracture tongue. She operates from the Sundrift Wind-Shrine, a moving camp that follows the migration routes her ancestors mapped before the stars went out.`,

    title: "The Animist",
    subtitle: "Ancestral Conduit and the Triple Toll of Communion",
    quickOverview: {
      title: "Quick Overview",
      content: `**Who they are**: A walking archive of three dead ancestral traditions  —  totemic bone, spirit curse, and runic inscription  —  fused into a single devastating conduit. They speak three languages simultaneously, and pay for every word in flesh.

**The hook**: Build Ancestral Resonance by erupting bone totems from your body, carving permanent runic networks into the earth, and spreading spirit curses. Weave all three traditions at once to reshape the entire battlefield  —  then spend your accumulated resonance on devastating invocations and network detonations.

**The cost**: At 15+ Resonance, the ancestors turn on you. Fire damage doubles against you. Party healing bounces off. Forced movement detonates your entire runic network in your face. And the spirits demand service  —  hoard power without spending and they claw wyrd damage into you every turn.

**Bring one for**: Unrivaled battlefield terraforming through three simultaneous control systems  —  bone walls, spirit specters, and permanent runic zones that turn any ground into an ancestral kill-box.`,
    },
    description: `A walking archive of three dead traditions, written in scars, bone spurs, and spiritual static. The Animist does not cast magic; they undergo intense physical transformation. Bone erupts from flesh as totems. Glowing sigils ignite across stone. The voices of ancestral spirits whisper through hallucinations that cannot be silenced. Every word of ancestral power risks Spirit Erosion � the more resonance you hoard, the more the ancestors consume you.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: ONE DISCOVERY, MANY VOICES**
The Animist was born not from three founders but from a single crisis. When the stars went dark over the <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink>, the Ordan throat-singers discovered that the dead remember what the living forget: the migration routes, the old paths, the names of places no living Ordan had seen. They turned their overtones from star-names to ancestor-names, and this single technique  —  the dead as compass  —  spread along the Hunger Road through trade, through the Bryngloom border through contact, through Neth contract-culture through legal adaptation, through Astril symbiosis through blood-memory, and through Velun Neth archives through citation.

There were no three founders. There was one lost Ordan throat-singer whose name was never recorded, a Skald trader who heard the songs at a Groven span-crossing and carved the first ancestor-rune into his own skin, and a Clean Vreken who walked into the bog after trading with Ordan herders and inhaled the first spore with intent. This is how knowledge spreads: through contact, not coincidence.

**CITIES & CIVIL RECEPTION**
Animists are viewed with a mixture of deep respect and visceral fear. Their bone spurs, glowing inscriptions, and spirit-static hallucinations make them unmistakable. They are essential in wilderness expeditions and siege defense, but unsettling in settled communities.

**RACES & CULTURAL AFFILIATION**
The root technique originated among the <LoreLink termId="house_ordavan">Ordan</LoreLink> humans of the Sundrift Vale. It spread to the <LoreLink termId="skald">Skald</LoreLink> via the Hunger Road, to the Clean <LoreLink termId="vreken">Vreken</LoreLink> through Bryngloom border trade, to the <LoreLink termId="house_morrath">Vreken</LoreLink> through Neth contract-culture adapting the concept of ancestor-summoning as debt-recitation, to the Earthen Astril and Stellar Astril <LoreLink termId="astril">Astril</LoreLink> through steppe cohabitation and Lumia heritage, and to the Velun <LoreLink termId="neth">Neth</LoreLink> through archival synthesis and legal citation. Each culture adapted the same root discovery to its own medium.

**NOTABLE FIGURES**
* **Kael the Herd-Runner**: The Ordan throat-singer who first sang ancestor-names instead of star-names when the sky went dark. Sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. Navigation, not worship.
* **Theron the Skald Scholar**: The Skald chronicler who heard Ordan songs at a span-crossing and became the first to carve an ancestor-rune into living flesh. Carved mathematical formulas of ancient clockwork songs into his own skin.
* **Nyssa the Herbalist**: The Clean Vreken who walked into the bog after trading with Ordan herders and inhaled the first spore with deliberate intent. Bargained with the ancient Wyrd.
* **Bayar Wind-Throat**: The Ordan elder who still sings the pre-fracture tongue and watches the younger traditions drift.`
    },
    signatureQuote: {
      text: '"The stars went dark. The herds still moved. The wind still blew. But no one knew where we were going. So I asked the dead. They remembered. They always remember."',
      speaker: 'Kael the Herd-Runner, attributed',
      context: 'Ordan oral tradition, passed throat-to-throat for generations; first written down by a Skald trader at a Groven span-crossing'
    },

    philosophy: {
      coreTenet: 'The world is not governed by laws or the Wyrd alone. It is governed by ancestors. Every creature that has ever lived has left an imprint on the world, and the Animist can read those imprints, invoke those spirits, and carve those truths into permanence. The bone is the body\'s memory. The spirit is the soul\'s memory. The rune is the mind\'s memory. An Animist reads all three.',
      relationship: 'The Animist stands at the intersection of three ancestral traditions. Totemic power erupts from their flesh as physical bone and root. Spirit invocation accumulates as a debt the Wyrd honor. Runic inscription carves permanent truth into reality. Each tradition reinforces the others: totems provide anchor points for runic networks, spirits can be bound to runes, and runic amplification intensifies totem effects.',
      paradox: 'The Animist gains power by losing themselves across three dimensions. Physical self (totem eruption leaves permanent bone spurs), mental self (spirit channeling erases memories and causes hallucinations), and spiritual self (runic inscription trades lifespan for permanent records). The greatest Animists are covered in bone spurs, covered in runic scars, and accompanied by spirits only they can see. They have given everything to become everything.'
    },

    currentCrisis: `The ancestral language is fragmenting  —  but not because the traditions have drifted apart. Something is wrong with death itself.

The oldest dead  —  those who died before the <LoreLink termId="sundered_monoliths">Monoliths</LoreLink> woke  —  still speak clearly. Their voices come through bone, rune, spore, and contract with perfect fidelity, across every cultural dialect. Bayar Wind-Throat can still sing their overtones without static. The Skald runes carved for pre-Deepening ancestors still glow steady. The Vreken spores carrying pre-Bog ancestors still bloom in clean patterns.

The newer dead are... confused. Their voices layer with static no throat-singer can parse. Runes carved for ancestors who died within the last two centuries flicker, migrate, or go cold. Spores carrying recently-deceased memory produce bioluminescence that spells words in languages no living culture recognizes. Vreken debt-ancestors who died after the Monoliths woke are refusing to acknowledge renegotiations  —  demanding original terms in a language the living no longer speak, and in some cases, a language that never existed.

The Animists call this the Fading. The dead are not fragmenting because the traditions divided. The traditions are dividing because the dead are fragmenting  —  and every Animist, regardless of culture, is trying to hold a conversation with ancestors who increasingly do not speak the same language as each other.

Some senior practitioners  —  Bayar Wind-Throat among them  —  suspect the Monoliths are not the cause but a symptom. Whatever is wrong with death began when the Monoliths woke, but it predates them. The threshold between life and death has been... thinning. Or thickening. No one can agree which. But the dead who cross it now are not the same as the dead who crossed it before, and the ancestral language  —  the single root tongue that connects every Animist tradition back to that first Ordan throat-singer  —  is eroding from the far end.`,

    meaningfulTradeoffs: `To be an Animist is to never be comfortable in any environment. Buildings feel wrong to the totemic tradition (earth blocked). Cities feel overwhelming to the spirit tradition (too many spiritual echoes). Libraries feel dangerous to the runic tradition (the ink competes with blood-inscriptions). The Animist needs the wilderness for totems, the spiritual liminal spaces for invocations, and solid stone for runic carving. Finding all three in one place is nearly impossible, so they are perpetually homesick for a place that may not exist.`,

    combatRole: {
      title: "The Ancestral Architect",
      content: `**Triple Battlefield Control**: Your role is to reshape the entire battlefield through three simultaneous systems. Bone totems create physical anchor points and healing zones. Curse-driven spirit invocations provide burst damage and spirit intervention. Runic networks create permanent zones of denial and amplification.

**Three-Tradition Conduit**: You do not pay in blood � you pay in attention. Every turn you choose where to invest resonance: a totem for zone control, a curse for resonance generation, or a rune for a permanent network. The skill is weaving all three without hoarding enough resonance to trigger Spirit Erosion.

**Weaknesses**:
- Ember Glasshouse: at 15+ Resonance you take double fire damage � a single torch or ember spell can drop you in one hit.
- Beyond Healing: at 15+ Resonance no ally's healing touches you; you survive only on your own totems and stolen souls.
- Shove-Bait: any forced movement detonates every active rune for 1d10 force each � smart enemies weaponize knockback and teleports against you.
- Rooted to Cast: totems and runes demand you stay planted; mobile foes simply walk out of your setup before it pays off.
- Resonance Treadmill: you must keep casting to stay useful � stop generating/spending and you neither build power nor control the field; a silenced or CC-locked Animist stalls out completely.
- Hoarder's Wrath: sit on high Resonance without spending and the spirits claw 1d6 wyrd damage into you every turn.`
    },
    playstyle: {
      title: "The Triple Toll",
      content: `**Three Systems, One Resource**: Ancestral Resonance fuels all three traditions. Choose whether to invest resonance into totem eruption, spirit invocation, or runic inscription. The most powerful Animist weaves all three simultaneously, but this accelerates Spirit Erosion.

**Spirit Erosion**: The triple toll activates at 15+ resonance. Fire burns you at double strength. Party healers cannot touch you. If an enemy shoves you, your runic network explodes in backlash. And the spirits claw at your mind if you hoard without spending.`
    },
  },

  resourceSystem: {
    title: "Ancestral Resonance & Spirit Erosion",
    subtitle: "The Triple Toll of Bone, Spirit, and Script",
    description: "**The whole class in one line:** build Ancestral Resonance (0 to 20) with cheap totems, curses, and runes � then spend it on devastating invocations and detonations. But cross 15 and the ancestors turn on you.\n\n**Your one job each turn:** *Build* resonance with cheap spells (the ones that say \"Generates\"), then *Spend* it on big invocations and detonations (the ones that say \"Spends\"). Ride the line near 15 for peak power, then dump it before the toll bites.\n\nThe Animist's power feeds three ancestral traditions at once � totemic bone, spirit curse, and runic inscription. Every spell either feeds this resonance or drinks from it. There is no HP cost to casting � your tension is the resonance gauge itself: hoard it for power and Spirit Erosion punishes you; spend it freely and you stay safe but lean.",
    cards: [
      {
        title: "Ancestral Resonance",
        stats: "0-20 Resonance",
        details: "Generated by totem summoning (Primalist tradition), curse casting and ritual completion (Witch Doctor tradition), and rune carving plus stationary stance (Inscriptor tradition). Spent on totem powers, spirit invocations, and runic network activations."
      },
      {
        title: "Spirit Erosion",
        stats: "Triple Catastrophic Flaw (15+ Resonance)",
        details: "100% ember vulnerability. Cannot receive party healing. Forced movement shatters runic networks (1d10 force per active rune). Spirits demand service: 1d6 wyrd/turn if 15+ resonance and no invocation/spend this turn."
      },
      {
        title: "Resonance Economy",
        stats: "Build vs. Spend",
        details: "Cheap 'Generates' spells bank resonance; big 'Spends' spells (invocations, network detonations) drink it. No HP cost to cast � the danger is hoarding resonance, not bleeding for it."
      }
    ],
    generationTable: {
      headers: ["Action", "Resonance", "Tradition"],
      rows: [
        ["Summon/Upgrade Totem", "+3 Resonance", "Primalist"],
        ["Cast Curse", "+1 Resonance", "Spirit"],
        ["Apply Poison", "+1 Resonance", "Spirit"],
        ["Place Healing Totem", "+1 Resonance", "Primalist + Spirit"],
        ["Complete Ritual", "+2 Resonance", "Spirit"],
        ["Carve Level 1-2 Rune", "+1 Resonance", "Inscriptor"],
        ["Carve Level 3+ Rune", "+2 Resonance", "Inscriptor"],
        ["Remain Stationary (Turn Start)", "+1 Resonance", "Inscriptor"],
        ["Defeat Cursed Enemy", "+3 Resonance", "Spirit"],
        ["Invoke Wyrd Spirit", "Spends 5-10 Resonance", "Spirit"],
        ["Activate Runic Network", "Spends 3-8 Resonance", "Inscriptor"],
        ["Totem Cataclysm", "Spends 10+ Resonance", "Primalist"]
      ]
    },
    usage: {
      momentum: "Erupt totems for area control and healing, carve runes to secure choke points, and spread curses to build resonance fast. Weave all three traditions for maximum battlefield dominance.",
      flourish: "When resonance hits 15+, you are at peak power but triple toll is active. Spend resonance aggressively on invocations and network detonations. The spirits will punish hesitation."
    },
    overheatRules: {
      title: "Spirit Erosion (The Triple Toll)",
      content: "At 15+ Ancestral Resonance, three catastrophic flaws activate simultaneously:\n1. **Flammable Being**: All ember damage is increased by 100%. No resistance bypass.\n2. **Ancestral Isolation**: Cannot benefit from healing spells cast by others. Your own totem healing still works on allies but not on you.\n3. **Runic Shatter**: If you are forcibly moved, all active runes shatter. Take 1d10 force damage per active rune and become vulnerable to all damage until end of next turn.\n4. **Spirit Demand**: If you end your turn at 15+ resonance without spending any, take 1d6 wyrd damage from the demanding spirits."
    },
    strategicConsiderations: {
      title: "Weaving Three Traditions",
      content: "The key to Animist mastery is knowing when to weave all three traditions and when to focus. Early combat: place a totem (anchor point), carve a rune near it (runic network node), and curse an enemy (resonance builder). Mid combat: connect your runes through your totem, creating amplified zones. Late combat: spend high resonance on devastating invocations or network detonations."
    }
  },

  specializations: {
    title: "Animist Specializations",
    subtitle: "Three Paths of Ancestral Communion",
    description: "The Animist chooses how to balance the three ancestral traditions. Each specialization emphasizes a different fusion of totemic power, spirit invocation, and runic inscription.",
    passiveAbility: {
      name: "Spirit Erosion",
      description: "At 15+ Ancestral Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters runic networks (1d10 force/active rune), and 1d6 wyrd/turn if hoarding without spending."
    },
    specs: [
      {
        id: "thornwarden",
        name: "Thornwarden",
        icon: "Nature/Acorns On Mounds",
        color: "#8B4513",
        theme: "Bone Cages, Runic Walls, Apex Isolation",
        description: "Fuses the Primalist's Root-Weaver bone-barrier lockdown with the Inscriptor's Runebinder zone terraforming. The Thornwarden is an immovable zone controller who erects massive barriers of calcified bone and permanent runic walls, isolating high-value targets behind impenetrable defenses.",
        playstyle: "Defensive zone mastery, apex isolation, choke point lockdown, terrain manipulation.",
        strengths: [
          "Bone totems and runic walls combine to create impenetrable battlefield partitions",
          "Calcified passive grants +3 DR and physical resistance near own totems",
          "Runic zones are permanent and cannot be dispelled",
          "Can connect up to 5 runes into a single massive defensive network"
        ],
        weaknesses: [
          "Extremely slow; highest HP sacrifice costs for bone-weaving abilities",
          "Zero mobility; voluntary movement breaks runic connection",
          "Highly dependent on active totems and rune placement for survival",
          "Cannot heal self from own totems"
        ],
        specPassive: {
          name: "Scarred Earth Domain",
          description: "Gain +3 DR. When a totem you placed is within 10ft of you, gain resistance to all smashing damage types. Your runic zones are permanent and cannot be dispelled. Enemies within your active network have magical resistances reduced by 25%."
        },
      },
      {
        id: "spirit_binder",
        name: "Spirit Binder",
        icon: "Psychic/Ghostly being",
        color: "#8B008B",
        theme: "Beast Specters, Death Curses, Wyrd Invocation",
        description: "Fuses the Primalist's Bone-Stalker summoning with the Witch Doctor's Bokor death magic. The Spirit Binder is a summon-and-slay specialist who stitches the souls of dead beasts to their own nervous system, invokes death Wyrd for devastating AoE, and curses enemies to feed the ancestral hunger.",
        playstyle: "Summoning specters, blight devastation, curse spreading, death invocation.",
        strengths: [
          "Summon multiple beast specters that share and amplify curse damage",
          "Baron Samedi invocation costs 2 less resonance and needs only 2 cursed enemies",
          "Curses generate +1 additional Ancestral Resonance",
          "Drains enemy vitality to replenish sacrificed HP through soul-siphon"
        ],
        weaknesses: [
          "Summons share your HP pool; ember damage to specters causes feedback damage",
          "Limited direct healing; must drain enemies to survive",
          "Weakest defensive positioning; no barriers or walls",
          "Cannot benefit from party healing at high resonance"
        ],
        specPassive: {
          name: "Shadow's Embrace",
          description: "Baron Samedi invocations cost 2 less resonance and require only 2 cursed enemies. Curses generate +1 additional Ancestral Resonance. Your beast summons deal +2 damage to bleeding or trapped targets."
        },
      },
      {
        id: "stormscribe",
        name: "Stormscribe",
        icon: "Lightning/Lightning Bolt",
        color: "#4682B4",
        theme: "Lightning Fury, Healing Totems, Inscribed Ally Buffs",
        description: "Fuses the Primalist's Stormbringer lightning attacks with the Witch Doctor's Mambo healing and the Inscriptor's Enchanter ally buffs. The Stormscribe is the most versatile Animist, supporting allies through inscribed weapon buffs, healing totems, and devastating elemental fury.",
        playstyle: "Aggressive support, elemental damage, ally buff inscription, healing totems.",
        strengths: [
          "Inscribe ally weapons with +2 attack/saves and lifesteal siphoning",
          "Healing totems generate +1 additional resonance and heal 50% more",
          "Lightning damage +1d6 when standing near Storm Totem",
          "Simbi invocation costs 2 less; Erzulie costs 2 less for clutch healing"
        ],
        weaknesses: [
          "Allies take minor blight damage from branded weapons",
          "Lower personal shields; must rely on allies for defense",
          "Resonance generation depends on buffed allies dealing/taking damage",
          "Triple toll hits hardest due to aggressive playstyle"
        ],
        specPassive: {
          name: "Stormbrand Inscription",
          description: "When you carve an inscription onto an ally, the ally gains +2 to attacks and saves for 5 rounds. Their weapon siphons life, healing 20% of damage dealt. Your spells deal +1d6 lightning damage near a Storm Totem. Simbi and Erzulie invocations cost 2 less resonance."
        },
      }
    ]
  },

    spells: [
    {
      id: "animist_spirit_voice",
      name: "Spirit Voice",
      description: "Commune with the spirits of dead ancestors or a corpse to ask 3 questions about their death or local threats.",
      level: 1,
      spellType: "ACTION",
      icon: "General/Commune",
      typeConfig: { school: "primal", icon: "Utility/Utility", tags: ["utility", "divination", "speak_with_dead", "animist"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 5 },
      resourceCost: { actionPoints: 1, mana: 3 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility", "divination", "animist"]
    },
    {
      id: "animist_spirit_hawk",
      name: "Spirit Hawk",
      description: "Project your sight into an ancestral falcon or raven up to 1 mile away for 10 minutes.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Beast Mark",
      typeConfig: { school: "primal", icon: "Utility/Utility", tags: ["utility", "scout", "beast_sense", "animist"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, mana: 4 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility", "scout", "animist"]
    },
    { id : "animist_earth_bolt",
      name: "Earthen Splinter",
      description: "Hurl a sharp splinter of ancestral stone at a foe. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["melee","damage","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 3, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      damageConfig: { formula: "1d8 + spirit", damageTypes: ["primal"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","starter","primal"]
    ,

  somaticText: "Plant your feet and let the triple toll resonate � bone, blood, and script answering at once.",
  verbalText: "A single syllable of the ancestral language, spoken aloud.",
},
    { id : "animist_healing_totem",
      name: "Bone Sprout Totem",
      description: "Erupt a bone totem that heals nearby allies at the start of your turn. Generates 3 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["summon","healing","totem","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      healingConfig: { formula: "1d6 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","summon","totem","starter"]
    ,

  somaticText: "Drive your off-hand into the soil and wrench a bone spur from your wrist, forcing the totem to tear free of your flesh.",
  verbalText: "A low, grinding chant thrums in your chest as the ancestor answers.",
},
    { id : "animist_mojo_whisper",
      name: "Mojo Whisper",
      description: "Whisper a curse of spiritual static to leave a target vulnerable to blight damage. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["debuff"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["debuff","curse","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 2, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      debuffConfig: { debuffType: "statusEffect", effects: [{ id : "animist_mojo_vulnerability", name: "Spirit Static", description: "Target takes +2 blight damage from all spells.", mechanicsText: "+2 Blight damage taken." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["debuff","curse","starter","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_crimson_brand",
      name: "Crimson Brand",
      description: "Carve a bloody brand onto an ally's weapon, adding force damage to strikes. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      effectTypes: ["buff"],
      typeConfig: { school: "smashing", icon: "Slashing/Bloody Slash", tags: ["buff","brand","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_brand_force", name: "Crimson Brand", description: "Weapon strikes deal +1d4 force damage.", mechanicsText: "+1d4 force damage on hit." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","brand","starter","physical"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_rune_of_shielding",
      name: "Rune of Shielding",
      description: "Carve a protective rune on the floor. Allies standing on it gain a shield. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Healing/Heart Shield",
      effectTypes: ["buff"],
      typeConfig: { school: "smashing", icon: "Healing/Heart Shield", tags: ["buff","rune","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_rune_shield_buff", name: "Runic Ward", description: "Gain +15 temporary HP while inside the rune.", mechanicsText: "+15 Temp HP." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","rune","starter","physical"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_gale_totem",
      name: "Storm-Howl Totem",
      description: "Erupt a lightning totem that shocks and repels enemies. Generates 3 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage","control"],
      typeConfig: { school: "storm", icon: "Lightning/Thunderstorm", tags: ["summon","damage","totem"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "2d6 + spirit", damageTypes: ["storm"], resolution: "DICE" },
      controlConfig: { controlType: "forcedMovement", effects: [{ id : "animist_gale_push", name: "Storm Gust", description: "Pushes targets 10 feet away from the totem.", config: {"distance":10,"movementType":"push"} }] },
      resolution: "DICE",
      tags: ["damage","control","totem","storm"]
    ,

  somaticText: "Drive your off-hand into the soil and wrench a bone spur from your wrist, forcing the totem to tear free of your flesh.",
  verbalText: "A low, grinding chant thrums in your chest as the ancestor answers.",
},
    { id : "animist_spirit_link",
      name: "Spirit Link",
      description: "Forge a link between two targets, sharing healing or damage. Generates 1 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["buff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["buff","link"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "chain", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: { buffType: "custom", effects: [{ id : "animist_linked_state", name: "Linked Souls", description: "Linked targets share 50% of damage or healing received.", mechanicsText: "Shares 50% damage/healing." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","link","wyrd"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_rune_of_celerity",
      name: "Rune of Celerity",
      description: "Carve a rune on the ground that grants speed to allies. Generates 1 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Speed Boot",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Utility/Speed Boot", tags: ["buff","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: { buffType: "movementBuff", effects: [{ id : "animist_celerity_buff", name: "Quickened Steps", description: "Gain +15 feet of movement speed.", mechanicsText: "+15ft speed." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","rune","primal"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_calcified_spire",
      name: "Calcified Spire",
      description: "Erupt a wall of bone spires to block passage. Generates 2 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Bludgeoning/Hammer Crush",
      effectTypes: ["control"],
      typeConfig: { school: "smashing", icon: "Bludgeoning/Hammer Crush", tags: ["control","terrain"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "line", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: -2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      controlConfig: { controlType: "zone", effects: [{ id : "animist_bone_wall", name: "Impassable Bone", description: "Bones block movement and grant full cover.", config: {"zoneType":"impassable_terrain"} }] },
      resolution: "AUTOMATIC",
      tags: ["control","terrain","physical"]
    ,

  somaticText: "Plant your feet and let the triple toll resonate � bone, blood, and script answering at once.",
  verbalText: "A single syllable of the ancestral language, spoken aloud.",
},
    { id : "animist_thorn_barrier",
      name: "Thorn Barrier",
      description: "Summon a dense barrier of sharp thorns. Deals damage to enemies who cross it. Generates 2 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage","control"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["control","damage","hazard"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "line", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "2d6", damageTypes: ["primal"], resolution: "DICE" },
      controlConfig: { controlType: "zone", effects: [{ id : "animist_thorn_slow", name: "Thorn Thicket", description: "Difficult terrain. Deals primal damage to trespassers.", config: {"zoneType":"difficult_terrain"} }] },
      resolution: "DICE",
      tags: ["control","damage","hazard","primal"]
    ,

  somaticText: "Plant your feet and let the triple toll resonate � bone, blood, and script answering at once.",
  verbalText: "A single syllable of the ancestral language, spoken aloud.",
},
    { id : "animist_spirit_wolves",
      name: "Wendigo Specters",
      description: "Summon two spectral wolves from your shadow to attack enemies. Generates 3 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["summon","damage"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: -3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "2d8", damageTypes: ["blight"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["summon","damage","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_rune_of_destruction",
      name: "Rune of Destruction",
      description: "Carve a volatile rune on the floor. Detonates in a fire blast when an enemy steps on it. Spends 3 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Fire/Volcanic Corruption",
      effectTypes: ["damage"],
      typeConfig: { school: "ember", icon: "Fire/Volcanic Corruption", tags: ["damage","rune","trap"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: 3 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "4d6", damageTypes: ["ember"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","rune","trap","ember"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_siphon_hex",
      name: "Soul-Dredge Hex",
      description: "Afflict target with a curse that drains HP to heal you each round. Generates 1 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","healing"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["damage","healing","curse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      damageConfig: { formula: "1d8", damageTypes: ["blight"], resolution: "DICE", dotConfig: { dotFormula: "1d8", duration: 3, tickFrequency: "turn", isProgressiveDot: false } },
      healingConfig: { formula: "1d8", healingType: "target", resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","healing","curse","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_earthen_grasp",
      name: "Gaean Grasp",
      description: "Burl stone hands out of the earth to restrain all enemies in the area. Spends 4 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["control"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["control","area"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      controlConfig: { controlType: "restraint", effects: [{ id : "animist_stone_restraint", name: "Gaean Hold", description: "Restrained by stone. Cannot move. DC 14 strength check to break.", config: {"restraintType":"physical","breakOnDamage":false,"condition":"restrained"} }] },
      resolution: "AUTOMATIC",
      tags: ["control","area","primal"]
    ,

  somaticText: "Plant your feet and let the triple toll resonate � bone, blood, and script answering at once.",
  verbalText: "A single syllable of the ancestral language, spoken aloud.",
},
    { id : "animist_invoke_simbi",
      name: "Invoke Simbi",
      description: "Wyrd invocation: Call a restorative rain that heals and cleanses allies. Spends 6 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["healing","invocation","cleanse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 20 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 6 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      healingConfig: { formula: "3d8 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","invocation","cleanse","primal"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_scribe_warding",
      name: "Glyph of Warding",
      description: "Carve a glowing brand onto an ally's armor, granting +2 DR. Generates 1 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["buff"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["buff","brand"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 6, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_warding_dr", name: "Runic Safeguard", description: "Gain +2 DR.", mechanicsText: "+2 DR." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","brand","arcane"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_totemic_storm",
      name: "Totemic Overload",
      description: "Arc lightning between all active totems, shocking enemies in between. Spends 5 Resonance.",
      level: 5,
      spellType: "CHANNELED",
      icon: "Lightning/Thunderstorm",
      effectTypes: ["damage"],
      typeConfig: { school: "storm", icon: "Lightning/Thunderstorm", tags: ["damage","storm","totem","combo"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 40 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 12, classResource: { type: "resonance", cost: 5 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      damageConfig: { formula: "5d6 + spirit", damageTypes: ["storm"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","storm","totem","combo"]
    ,

  somaticText: "Drive your off-hand into the soil and wrench a bone spur from your wrist, forcing the totem to tear free of your flesh.",
  verbalText: "A low, grinding chant thrums in your chest as the ancestor answers.",
},
    { id : "animist_ritual_of_the_bog",
      name: "Swamp Consecration",
      description: "Consecrate the ground into a rotting marsh that slows and poisons enemies. Spends 4 Resonance.",
      level: 5,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","debuff"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["hazard","area","blight"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 20 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 10, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "2d6", damageTypes: ["blight"], resolution: "DICE", dotConfig: { dotFormula: "1d6", duration: 4, tickFrequency: "turn", isProgressiveDot: false } },
      debuffConfig: { debuffType: "movementImpairment", effects: [{ id : "animist_swamp_slow", name: "Mire Slow", description: "Movement speed is halved in the marsh.", mechanicsText: "Movement speed halved." }], durationType: "rounds", durationValue: 4, durationUnit: "rounds", canBeDispelled: false },
      resolution: "DICE",
      tags: ["hazard","area","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_brand_of_spellguard",
      name: "Spellbrand",
      description: "Inscribe a runic shield onto an ally's weapon, granting magic resistance. Generates 1 Resonance.",
      level: 5,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["buff"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["buff","brand"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_spell_resistance", name: "Spellward Brand", description: "Gain +25% magic resistance.", mechanicsText: "+25% Magic Resistance." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","brand","arcane"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_invoke_papa_legba",
      name: "Invoke Papa Legba",
      description: "Wyrd invocation: Summon Papa Legba to immediately cleanse CC and grant +1 AP. Spends 7 Resonance.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["buff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["buff","invocation","cleanse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["allies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 10, classResource: { type: "resonance", cost: 7 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statusEffectBuff", effects: [{ id : "animist_legba_cleanse", name: "Legba's Key", description: "CC cleansed and gain +1 Action Point next turn.", mechanicsText: "CC cleansed, +1 AP next turn." }], durationType: "rounds", durationValue: 1, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["buff","invocation","cleanse","wyrd"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_grave_sight",
      name: "Mortis Glare",
      description: "Lock eyes with a foe and force the full, crushing weight of death behind them. The target suffers disadvantage on saves and +50% Wyrd vulnerability. Spends 4 Resonance.",
      level: 6,
      spellType: "CHANNELED",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["debuff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["debuff","channel"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["enemies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 10, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      debuffConfig: { debuffType: "statusEffect", effects: [{ id : "animist_grave_sight_debuff", name: "Wyrd-touched Terror", description: "Target has disadvantage on saves and takes +50% wyrd damage.", mechanicsText: "Disadvantage on saves, +50% Wyrd damage." }], durationType: "rounds", durationValue: 2, durationUnit: "rounds", canBeDispelled: true },
      resolution: "AUTOMATIC",
      tags: ["debuff","channel","wyrd"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_rune_of_vitality",
      name: "Rune of Vitality",
      description: "Carve a rune that heals allies when they walk over it. Spends 4 Resonance.",
      level: 6,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["healing","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 10 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 4 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      healingConfig: { formula: "3d6 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","rune","primal"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_inscribed_fortress",
      name: "Runic Fortress",
      description: "Inscribe a massive fortress zone that shields allies and blocks enemies. Spends 8 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["buff","control"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["buff","control","zone"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["any"], areaShape: "circle", areaSize: 20 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 15, classResource: { type: "resonance", cost: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_fortress_defense", name: "Fortress Ward", description: "Allies inside gain +3 DR and advantage on physical saving throws.", mechanicsText: "+3 DR, advantage on physical saves." }], durationType: "rounds", durationValue: 3, durationUnit: "rounds", canBeDispelled: false },
      controlConfig: { controlType: "zone", effects: [{ id : "animist_fortress_border", name: "Runic Barrier", description: "Enemies cannot cross the zone boundary.", config: {"zoneType":"impassable_terrain"} }] },
      resolution: "AUTOMATIC",
      tags: ["buff","control","zone","arcane"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_invoke_erzulie",
      name: "Invoke Erzulie",
      description: "Wyrd invocation: Call Erzulie for a massive healing burst to all allies. Spends 8 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing"],
      typeConfig: { school: "sacred", icon: "Healing/Golden Heart", tags: ["healing","invocation"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 14, classResource: { type: "resonance", cost: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      healingConfig: { formula: "6d6 + spirit", healingType: "zone", resolution: "DICE" },
      resolution: "DICE",
      tags: ["healing","invocation","sacred"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_spirit_dredge",
      name: "Spirit Dredge",
      description: "Siphon HP from all cursed enemies to heal your own flesh. Spends 5 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","healing"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["damage","healing","combo"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 45 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 12, classResource: { type: "resonance", cost: 5 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      damageConfig: { formula: "3d8", damageTypes: ["blight"], resolution: "DICE" },
      healingConfig: { formula: "3d8", healingType: "target", resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","healing","combo","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_invoke_baron_samedi",
      name: "Invoke Baron Samedi",
      description: "Wyrd invocation: Strike all cursed enemies with devastating shadow rot. Spends 10 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["damage","invocation","ultimate"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 60 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 20, classResource: { type: "resonance", cost: 10 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      damageConfig: { formula: "8d6 + spirit", damageTypes: ["blight"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","invocation","ultimate","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_primeval_totem",
      name: "Primal Beast Totem",
      description: "Erupt the ultimate totem that boosts ally attack rolls and DR. Spends 8 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["summon","buff","totem"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 16, classResource: { type: "resonance", cost: 8 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_primeval_rage", name: "Beast Totem Rage", description: "+2 to attack rolls and +2 DR.", mechanicsText: "+2 attack, +2 DR." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: false },
      resolution: "AUTOMATIC",
      tags: ["summon","buff","totem","primal"]
    ,

  somaticText: "Drive your off-hand into the soil and wrench a bone spur from your wrist, forcing the totem to tear free of your flesh.",
  verbalText: "A low, grinding chant thrums in your chest as the ancestor answers.",
},
    { id : "animist_rune_of_binding",
      name: "Rune of Binding",
      description: "Carve a rune on the floor that chains and tethers all enemies in the area. Spends 6 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["control"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["control","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 15 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 12, classResource: { type: "resonance", cost: 6 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      controlConfig: { controlType: "restraint", effects: [{ id : "animist_rune_bind", name: "Chaining Rune", description: "Restrained by spectral chains. Cannot move.", config: {"restraintType":"physical","breakOnDamage":true,"condition":"restrained"} }] },
      resolution: "AUTOMATIC",
      tags: ["control","rune","arcane"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_worldscribe",
      name: "Worldscribe",
      description: "Inscribe permanent planar glyphs that continuously pulse healing and shield allies. Spends 12 Resonance.",
      level: 9,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["healing","buff"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["healing","buff","ultimate"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 25, classResource: { type: "resonance", cost: 12 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      healingConfig: { formula: "4d6 + spirit", healingType: "zone", resolution: "DICE" },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_worldscribe_dr", name: "Worldscribe Aegis", description: "Gain +4 DR.", mechanicsText: "+4 DR." }], durationType: "permanent", durationValue: 0, durationUnit: "rounds", canBeDispelled: false },
      resolution: "DICE",
      tags: ["healing","buff","ultimate","arcane"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_cataclysmic_eruption",
      name: "Totem Cataclysm",
      description: "Detonate all active totems in a catastrophic blast of fire and stone. Spends 12 Resonance.",
      level: 9,
      spellType: "ACTION",
      icon: "Fire/Volcanic Corruption",
      effectTypes: ["damage"],
      typeConfig: { school: "ember", icon: "Fire/Volcanic Corruption", tags: ["damage","ultimate","totem"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", rangeDistance: undefined, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 50 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 24, classResource: { type: "resonance", cost: 12 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      damageConfig: { formula: "8d8 + spirit", damageTypes: ["ember"], resolution: "DICE" },
      resolution: "DICE",
      tags: ["damage","ultimate","totem","ember"]
    ,

  somaticText: "Drive your off-hand into the soil and wrench a bone spur from your wrist, forcing the totem to tear free of your flesh.",
  verbalText: "A low, grinding chant thrums in your chest as the ancestor answers.",
},
    { id : "animist_triune_ascension",
      name: "Triune Ascension",
      description: "Enter a state of supreme ancestral alignment, unleashing totems, Wyrd, and runes simultaneously. Spends 15 Resonance.",
      level: 10,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["buff","ultimate"], castTime: 3, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self", rangeDistance: undefined, targetRestrictions: ["self"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 3, mana: 30, classResource: { type: "resonance", cost: 15 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      buffConfig: { buffType: "triggeredEffect", effects: [{ id : "animist_triune_buff", name: "Triune Avatar", description: "+5 to attacks, +5 DR, +2 AP, and double healing.", mechanicsText: "+5 attacks, +5 DR, +2 AP, double healing." }], durationType: "rounds", durationValue: 6, durationUnit: "rounds", canBeDispelled: false },
      resolution: "AUTOMATIC",
      tags: ["buff","ultimate","primal"]
    ,

  somaticText: "Carve the sigil into your own palm, letting welling blood ink the pattern onto the world.",
  verbalText: "Speak the binding word, lips shaping the old script.",
},
    { id : "animist_spectral_guardian",
      name: "Ancestral Colossus",
      description: "Summon a massive spectral colossus of bone and spirit to smash enemies. Spends 15 Resonance.",
      level: 10,
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Wither",
      effectTypes: ["damage","control"],
      typeConfig: { school: "blight", icon: "Necrotic/Necrotic Wither", tags: ["summon","damage","control"], castTime: 3, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemies"], areaShape: "circle", areaSize: 25 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 3, mana: 30, classResource: { type: "resonance", cost: 15 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      damageConfig: { formula: "10d10", damageTypes: ["blight"], resolution: "DICE" },
      controlConfig: { controlType: "knockdown", effects: [{ id : "animist_colossus_knockdown", name: "Tremor Slam", description: "Knocked prone.", config: {"saveType":"strength","saveDC":18} }] },
      resolution: "DICE",
      tags: ["summon","damage","control","blight"]
    ,

  somaticText: "Trace the target's silhouette in the air with a bloodied fingertip, anchoring the spirit to your will.",
  verbalText: "Whisper the target's true name in the fractured ancestor-tongue.",
},
    { id : "animist_ancestral_whisper",
      name: "Ancestral Whisper",
      description: "Kneel beside a corpse, a bone, or a lingering shade and breathe a thread of the ancestor-tongue into it. The dead answer three questions about their life, their death, or what they last witnessed. Out of combat. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["utility"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["utility","divination","social","spirit","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 3, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: { utilityType: "divination", selectedEffects: [ { id : "animist_whisper_commune", name: "Commune with the Dead", description: "Ask a corpse or spirit up to 3 questions. Answers are truthful from the spirit's own memory, but may be incomplete, biased, or in the fractured ancestor-tongue.", mechanicsText: "3 questions to a corpse/spirit; truthful but possibly incomplete." } ], duration: 1, durationUnit: "minutes" },
      resolution: "NONE",
      tags: ["utility","divination","social","spirit","starter"]
    ,

  somaticText: "Lay a bloodied palm on the remains and let the ancestor's voice rise through your throat.",
  verbalText: "A question, shaped in the old tongue � the same word for 'remember' and 'answer.'",
},
    { id : "animist_bone_reading",
      name: "Bone-Reading",
      description: "Press bone to stone and read the ancestral memory printed on a place or held object � a flash of the last creature to die there, a spoken word, or a violent echo. Reveals the recent history of a touched location. Out of combat. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["utility"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["utility","divination","exploration","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 3, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      utilityConfig: { utilityType: "divination", selectedEffects: [ { id : "animist_bone_reading_echo", name: "Memory Echo", description: "Glimpse the strongest emotional or violent echo imprinted on a touched place/object within the last day per level.", mechanicsText: "Read recent history of a touched location/object." } ], duration: 1, durationUnit: "rounds" },
      resolution: "NONE",
      tags: ["utility","divination","exploration","primal","starter"]
    ,

  somaticText: "Set a knuckle-bone against the surface and hum until the stone answers in pictures.",
  verbalText: "A single sustained note � the overtones do the reading, not the words.",
},
    { id : "animist_spirit_walk",
      name: "Spirit-Walk",
      description: "Dislodge your spirit (or lend it to a summoned specter) and send it roaming as an invisible scout. You see and hear through it for the duration while your body stands blind and defenseless. Spends 2 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["utility"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["utility","scout","exploration","spirit"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self", rangeDistance: undefined, targetRestrictions: ["self"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: 2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      utilityConfig: { utilityType: "scout", selectedEffects: [ { id : "animist_spirit_walk_eye", name: "Wandering Eye", description: "Project an invisible spirit scout up to 60 ft per level. You see and hear through it; your body is blind, deaf, and helpless. Ends if the body takes damage.", mechanicsText: "Invisible spirit scout; senses shared; body helpless." } ], duration: 10, durationUnit: "minutes" },
      resolution: "NONE",
      tags: ["utility","scout","exploration","spirit"]
    ,

  somaticText: "Press thumb to sternum and push the self outward, leaving the bone-cage empty.",
  verbalText: "A farewell word to your own body, promising to return.",
},
    { id : "animist_scribes_insight",
      name: "Scribe's Insight",
      description: "Inscribe a translating rune over any text. For one hour you read any written language, decipher codes, and surface hidden or illusion-veiled script. The rune can be shared with one ally. Generates 1 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Arcane/Ebon Blaze",
      effectTypes: ["utility"],
      typeConfig: { school: "arcane", icon: "Arcane/Ebon Blaze", tags: ["utility","translation","exploration","social","rune"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: { utilityType: "translation", selectedEffects: [ { id : "animist_scribes_insight_read", name: "Open Script", description: "Read any language, decipher codes, and reveal hidden/magical text for 1 hour. Shareable with one touched ally.", mechanicsText: "Comprehend all writing + reveal hidden text, 1 hour." } ], duration: 1, durationUnit: "hours" },
      resolution: "NONE",
      tags: ["utility","translation","exploration","social","rune"]
    ,

  somaticText: "Carve the open-eye sigil over the page; the rune drinks the ink and gives back meaning.",
  verbalText: "Speak the word for 'listen' applied to letters � the script begins to speak.",
},
    { id : "animist_threshold_ward",
      name: "Threshold Ward Totem",
      description: "Erupt a small bone totem at a doorway or camp perimeter. It sounds a spirit-knell in your mind when any creature or restless shade crosses uninvited, and allies resting within its radius recover with advantage. Generates 2 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["utility","buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["utility","totem","exploration","rest"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: { utilityType: "ward", selectedEffects: [ { id : "animist_threshold_ward_alert", name: "Threshold Knell", description: "Alerts you (no perceptible sound) to any creature crossing the warded boundary. Spirits and incorporeal undead are barred unless invited.", mechanicsText: "Silent intrusion alarm; bars uninvited spirits." }, { id : "animist_threshold_ward_rest", name: "Ancestral Vigil", description: "Allies who complete a rest inside the ward recover HP and resources with advantage.", mechanicsText: "Advantage on rest recovery within the ward." } ], duration: 8, durationUnit: "hours" },
      resolution: "NONE",
      tags: ["utility","totem","exploration","rest","primal"]
    ,

  somaticText: "Plant a finger-bone in the threshold and let it drink a drop of your spit to know the house.",
  verbalText: "Name every ally aloud so the totem knows who belongs.",
},
    { id : "animist_mourners_pact",
      name: "Mourner's Pact",
      description: "Offer a drop of blood and a true name to soothe hostile spirits, ghosts, or the freshly bereaved. Restless dead grow calm enough to parley; the grieving instinctively trust you. Grants advantage on social checks with the spirit-touched or the mourning. Generates 1 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["utility","buff"],
      typeConfig: { school: "wyrd", icon: "Healing/Golden Heart", tags: ["utility","social","spirit","exploration"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: { utilityType: "social", selectedEffects: [ { id : "animist_mourners_pact_calm", name: "Mourner's Pact", description: "Calm hostile ghosts/spirits to neutral and open to dialogue, and grant yourself advantage on social checks with the spirit-touched, the bereaved, or the dead for 10 minutes.", mechanicsText: "Calm spirits; advantage on social checks with the mourning/spirit-touched." } ], duration: 10, durationUnit: "minutes" },
      resolution: "NONE",
      tags: ["utility","social","spirit","exploration"]
    ,

  somaticText: "Smear a thumbprint of blood on the target's brow (or the air before a shade) and breathe slow.",
  verbalText: "Recite the true name and the kin-name � the words the dead answer to.",
}
  ],

  spellPools: {
  "1": [
    "animist_earth_bolt",
    "animist_healing_totem",
    "animist_mojo_whisper",
    "animist_crimson_brand",
    "animist_rune_of_shielding",
    "animist_ancestral_whisper",
    "animist_bone_reading"
  ],
  "2": [
    "animist_gale_totem",
    "animist_spirit_link",
    "animist_rune_of_celerity",
    "animist_calcified_spire",
    "animist_spirit_walk",
    "animist_scribes_insight",
    "animist_threshold_ward"
  ],
  "3": [
    "animist_thorn_barrier",
    "animist_spirit_wolves",
    "animist_rune_of_destruction",
    "animist_siphon_hex",
    "animist_mourners_pact"
  ],
  "4": [
    "animist_earthen_grasp",
    "animist_invoke_simbi",
    "animist_scribe_warding"
  ],
  "5": [
    "animist_totemic_storm",
    "animist_ritual_of_the_bog",
    "animist_brand_of_spellguard"
  ],
  "6": [
    "animist_invoke_papa_legba",
    "animist_grave_sight",
    "animist_rune_of_vitality"
  ],
  "7": [
    "animist_inscribed_fortress",
    "animist_invoke_erzulie",
    "animist_spirit_dredge"
  ],
  "8": [
    "animist_invoke_baron_samedi",
    "animist_primeval_totem",
    "animist_rune_of_binding"
  ],
  "9": [
    "animist_worldscribe",
    "animist_cataclysmic_eruption"
  ],
  "10": [
    "animist_triune_ascension",
    "animist_spectral_guardian"
  ]
}
};
