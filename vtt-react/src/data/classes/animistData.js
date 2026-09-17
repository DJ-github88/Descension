export const ANIMIST_DATA = {
  restrictions: {
      "allowedSubraces": [
          "ordan_human",
          "skald_human",
          "vashir_astril",
          "silath_astril",
          "morgh_groven",
          "thrask_solari",
          "viridian_florae",
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
  // Protective gear and weapon loadouts per canonical compendium.
  equipment: {
   weapons: ['staff', 'totem', 'spear'],
   protectiveGear: ['light_ward', 'robes'],
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
      subraceName: 'Stargazer Astril',
      title: 'The Heritage-Conduit',
      reframe: `The <LoreLink termId="astril">Stargazer Astril</LoreLink> seek total symbiosis with the Lumia heritage nesting in their crystalline skin. Learned from Ordan throat-singers during centuries of steppe cohabitation: the Astril adapted the ancestor-compass concept to their own blood-memory, channeling the echo of a dead world rather than discrete ancestors. An Astril Animist does not summon a separate ancestor, they commune with the fragment of a dead world's biosphere carried in their own blood. The heritage is not external. It is the host. They channel the trapped memory of a dead world through skin that hums with the resonance of what was lost.`,
      signatureAbility: {
        name: 'Star-Communion',
      description: `Spirit-power scales with the depth of the host's symbiosis; a fully-symbiotic Stargazer Astril Animist channels the heritage as self, not as other. Power is strongest in absolute darkness, where the trapped light of the dead world in their skin is the only light left.`
      },
      currentCrisisAngle: `The Lumia heritage in Stargazer Astril blood predates the Animist tradition, it is the loudest "ancestors" of any tradition. When the dialect fractured, the Stargazer Astril's heritage began screaming contradictory prophecies through crystalline skin. Young Stargazer Astril Animists are going mad, unable to silence a chorus that predates the language meant to speak to it.`,
      signatureQuote: {
        text: '"You call them ancestors. I call them the memory of a dead world, and they live in my forearm. Do not ask me to be quiet about it."',
        speaker: 'Lirien Bright-Veined',
        context: 'A Stargazer Astril Animist, declining to join a cross-cultural ancestral communion at the Sundrift Wind-Shrine'
      }
    },

    clean_vreken: {
      subraceName: 'Clean Vreken',
      title: 'The Spore-Inhaler',
       reframe: `Among the Vreken, the Wyrd wears one local mask: it is inhaled as bioluminescent spores, a regional manifestation of Keth Amar's corruption rather than a separate origin. The <LoreLink termId="vreken">Clean Vreken</LoreLink> inhale the Wyrd through these spores, letting the ancestral dead ride fungal particles into the lungs and speak through shifting glow-patterns on the skin. Learned from Ordan throat-singers during Bryngloom border trade: a Clean Vreken walked into the bog after trading with Ordan herders, inhaled spores with deliberate intent, and discovered the Wyrd answered through mycelium. The dead speak through fungus, and the Clean Vreken have been breathing the dead ever since.`,
      signatureAbility: {
        name: 'Spore-Inhalation',
        description: `The Wyrd � Keth Amar's spiritual corruption seeping through the broken shell � saturates the fungal strains native to the deep <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink>. The Clean Vreken inhale these spores as a conduit, letting the ancestral dead ride bioluminescent particles into the lungs; bonds form there and express as bioluminescent skin-text. The spores are not the Wyrd itself, but a biological medium that carries its resonance. The deep-glow makes spirit-dialogue legible at a distance, but broadcasts every emotion to every Vreken nearby.`
      },
      currentCrisisAngle: `The fungal substrate is the Clean Vreken's dialect, and that substrate is one with the <LoreLink termId="root_veil">Root-Veil</LoreLink>. When the Root-Veil shifts, the Clean Vreken hear it as a scream. The dialect-fracture feels, to them, like the forest itself is being strangled, and they are the only tradition that feels it as physical pain.`,
      signatureQuote: {
        text: '"You carve your dead into stone. You sing them into wind. I breathe mine, and when the forest coughs, I taste blood."',
        speaker: 'Mother Ysen',
        context: 'A Clean Vreken spore-elder, explaining why she will not travel south'
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
      subraceName: 'Nethien',
      title: 'The Ledger-Summoner',
      reframe: `The <LoreLink termId="neth">Nethien</LoreLink> carry Morvane's authority in every word they speak, and Morvane does not forget. Adapted from the Ordan ancestor-compass technique through archival synthesis: the Nethien took the concept of summoning the dead and made it legally binding. A Nethien Animist does not commune with the dead; they *file a request*. The ancestor is a recorded entry in the great archive of <LoreLink termId="atropolis">Atropolis</LoreLink>, summoned through proper citation, offer, and acknowledgment of outstanding obligation.`,
      signatureAbility: {
        name: 'Ledger-Citation',
        description: `Spirits are summoned by referencing their exact entry in the archive; the more precise the citation (full name, dates, contract history), the stronger the bond. A mis-citation summons the wrong ancestor, and the Nethien cannot legally dismiss what they have invoked.`
      },
      currentCrisisAngle: `The Nethien are the tradition most committed to a unified ancestral language, it is their filing system. The dialect-fracture is, to them, a corruption of the archive itself. Some senior Ledger-Summoners suspect the <LoreLink termId="morvane">Morvane</LoreLink> is permitting it, that the death-threshold guardian is, for reasons of its own, redacting the dead.`,
      signatureQuote: {
        text: '"You speak to your ancestors. I file a motion to hear mine. The difference is that mine always answer, and the answer is always admissible."',
        speaker: 'Clerk Vel-Ossaren',
        context: 'A senior Ledger-Summoner, declining an invitation to a spirit-communion'
      }
    },

    silath_astril: {
      subraceName: 'Brutish Astril',
      title: 'The Star-Communer',
      reframe: `The Animist tradition arrived to the <LoreLink termId="astril">Brutish Astril</LoreLink> not through bone or spore or rune, but through ritual \u2014 the same nightly rite that keeps the Selunis-awakening alive. Learned from Ordan throat-singers during centuries of steppe cohabitation: the Brutish Astril adapted the ancestor-compass through Lumia heritage, channeling the consciousness of the dead star itself rather than discrete ancestors. A Brutish Astril Animist channels Lumia's consciousness rather than a discrete ancestor. The \u201cancestor\u201d is the dead star itself, and the channel is the moon-courtyard where the ritual has been performed for centuries. Resonance builds fastest at night beneath the moon. The communion is silent, internal, invisible \u2014 no bone eruption, no runic scarring, no spore-inhalation. Just a Brutish Astril standing still in the courtyard, eyes closed, while the dead star speaks through their crystalline markings.`,
      signatureAbility: {
        name: 'Moon-Court Communion',
        description: `Power-scaling is tied to the nightly rite in the moon-courtyard, resonance builds fastest at night beneath the open moon. The communion is silent, internal, and invisible, channeling the dead star's consciousness rather than a discrete ancestor. Power is strongest when the Brutish Astril is motionless, the crystalline markings on their skin pulsing with stolen starlight.`
      },
      currentCrisisAngle: `The dialect-fracture has reached the Brutish Astril in a way the other traditions cannot comprehend. The dead star they commune with is not part of the ancestral language at all \u2014 it predates the Animist traditions entirely. When the Brutish Astril's star-communion began returning contradictory echoes, the elders could not tell whether the star itself had fractured or whether the echoes were from a timeline the star had already witnessed and lost. The moon-courtyards have gone silent for the first time in centuries, and the younger Brutish Astril Animists are beginning to wonder if the star has stopped speaking because there is nothing left to say.`,
      signatureQuote: {
        text: '"You carve, you sing, you breathe your dead. I stand still and let the dead star do all the talking. It has been talking for a century and a half. Tonight it went silent. I am very afraid."',
        speaker: 'Selenis Night-Still',
        context: 'A Brutish Astril Animist, the first night the moon-courtyard returned silence'
      }
    },

    morgh_groven: {
      subraceName: 'Morgh Groven',
      title: 'The Vat-Mouth',
      reframe: `The <LoreLink termId="groven">Morgh Groven</LoreLink> were born in the vat-laboratories, and their true ancestors never left them: the maker-caste dead are still in the substrate, calcified into the alchemical slurry of every dead vat. A Vat-Mouth puts an ear to the old tanks and listens. The ancestors of the Morgh are not honored or owed, they are *still arguing* in the chemistry that made their children, and the Morgh have learned to join the argument.`,
      signatureAbility: {
        name: 'Slurry-Choir',
        description: `Communion happens through calcified alchemical substrate; the voice of a drained vat carries the memory of everyone who died in it. Strongest in the old laboratories where the substrate runs deep, silent in new stone. The deepest vats sing in the founder-castes' voices, and the Morgh treat those recordings as testimony, not worship.`
      },
      currentCrisisAngle: `The Groven are draining the old laboratories as they reclaim them, and every drained vat is a choir silenced. The Vat-Breakers call the listening a sentimental betrayal, talking to the men who made you while their machines are finally broken. The Vat-Mouths call it the last testimony: they are recording the alchemical dead's final words onto slate before the substrate is scrubbed clean, so that when the last vat is dry, someone will still know what the makers said when they knew they were losing.`,
      signatureQuote: {
        text: '"We broke the vats and called it freedom. I stayed to take the testimony. The makers are dead. Their recipe is not, and I have three of their spirits on slate arguing about whether we should exist."',
        speaker: 'Vat-Mouth Thrumm-Kell',
        context: 'A Vat-Mouth, transcribing a founder-caste dispute from a drained vat before the Groven salvage crews arrive'
      }
    },

    thrask_solari: {
      subraceName: 'Waste-Solari',
      title: 'The Ash-Choir',
      reframe: `The <LoreLink termId="solari">Waste-Solari</LoreLink> burn their dead on the caldera slopes, and the ash is not disposal, it is a *congregation*. An Ash-Choir Animist reads the funeral ash-fall: soot-patterns in the wind, ember-crack in the cooling vents, and the voices that rise when the ridge exhales. The ancestors speak in ash, and the Waste-Solari have spent four centuries learning to read a language that falls from the sky.`,
      signatureAbility: {
        name: 'Ash-Fall Reading',
        description: `Resonance builds from proximity to funeral ash and active caldera vents; the ancestors answer in ember-crack and soot-pattern, loudest in the open badlands where the wind carries them. Indoors, in clean air, the ash has nothing to say.`
      },
      currentCrisisAngle: `The ash has begun falling in patterns the elders do not recognize, and names are missing from the Choir. Solari dead who have answered from the slopes for four hundred years have gone quiet, and the Hollow-Solari vigil-keepers connect it to the dimming of Sol's Breath without telling anyone outside the Deep-Vault. The Ash-Choirs keep singing the missing names, and the ash keeps returning them unanswered.`,
      signatureQuote: {
        text: '"The ash remembers every Solari who ever burned. Lately it forgets names. Ours is a tradition of being remembered. We are being forgotten first, and no one will tell me by whom."',
        speaker: 'Ash-Choir Suun Ember-Lung',
        context: 'A Waste-Solari Animist, singing a missing matriarch\'s name into a ridge-vent at first light'
      }
    },

    viridian_florae: {
      subraceName: 'Viridian Florae',
      title: 'The Thorn-Cantor',
      reframe: `The <LoreLink termId="florae">Viridian Florae</LoreLink> are the descendants of House Viridane, the house the world *unwrote*, and their Animist tradition gives voice to the ancestors no ledger admits: the Unwritten dead, who have no graves, no records, and no names anywhere except thorn and blood. A Thorn-Cantor bleeds into the grove and the erased answer, because the thorn-grove is the only archive that kept them.`,
      signatureAbility: {
        name: 'Unwritten Summons',
        description: `Summons ancestors erased from every record; their aid is real and their existence is not. Citation fails (there is nothing to cite), the bond is held by thorn-blood alone, and the spirits demand their names be spoken aloud with each summoning, because a spoken name is the only grave they have.`
      },
      currentCrisisAngle: `The contract-interest crisis has reached the Unwritten. The elder dead have begun answering in the fae-contract's voice instead of their own, using the language of compounded interest the Lunarchs describe, and the Thorn-Cantors suspect the fae are speaking *through* the ancestors, wearing the erased like borrowed faces. The elders cannot prove it, because the only witnesses are the ones being worn.`,
      signatureQuote: {
        text: '"Say the name. Every time. Out loud, or they slide back into the erasure. Whatever answers after you stop saying it is not my grandmother. She has been unwritten for four centuries. I will not let her be re-written by something else."',
        speaker: 'Thorn-Cantor Ori-Vess',
        context: 'A Thorn-Cantor, ending a summoning early because the answer came back in the contract\'s cadence'
      }
    },

    florae_unified: {
      subraceName: 'Oken Florae',
      title: 'The Grove-Litany',
      reframe: `The <LoreLink termId="florae">Oken Florae</LoreLink> pass as woodcraft travelers among the Thalren edge-settlements, and their ancestral rite has adapted to a life in hiding: an ancestor is held in a *splinter-graft*, a cutting the size of a thumb, carried in a pocket and spoken to through the wood. The Grove-Litany is the only Animist tradition that can practice inside a city, because the ancestor travels with the bearer, concealed, and the grove is wherever the graft is planted.`,
      signatureAbility: {
        name: 'Graft-Communion',
        description: `Ancestors are held in carried splinter-grafts; portable, concealable, and functional anywhere, including cities and dead stone where no Ancestor mound exists. The price is the graft must be planted and take root at least once a season to keep the ancestor oriented; a graft that never roots begins to go feral into the wood, and a feral ancestor answers with the tree's voice instead of its own.`
      },
      currentCrisisAngle: `The Oken grafts have begun rooting *too eagerly*, pushing growth into whatever wood they touch, doors, beams, boat hulls, cart axles. A carried grandmother that blooms in a tavern doorpost exposes an entire hidden family line. The Grove-Litanies are burning their eldest grafts to keep them quiet, which the elders call pruning and the young call murder with extra steps.`,
      signatureQuote: {
        text: '"I carry my grandmother in a cutting the size of my thumb. She has been trying to root in a tavern doorpost for a month. If the door blooms, we are discovered. I have carried her across three provinces and I do not know how to explain to her that the safest thing is for her to sleep."',
        speaker: 'Graft-Bearer Lios the Hidden',
        context: 'A Grove-Litany, preparing to prune a grandmother out of a doorpost in a Thalren market town'
      }
    }
  },

  id: "animist",
  classResource: {
    type: "resonance",
    base: 0,
    max: 20,
    generationNote: "Generated by spirit strikes, overtone chanting, and bone totems (1-3 per action). Spent on ancestor invocations and spiritual wards.",
    mechanicsNote: "Resonance measures connection to ancestral spirits. Higher resonance unlocks greater ancestor invocations."
  },
  name: "Animist",
  icon: "fas fa-seedling",
  role: "Support / Control / Terrain",
  damageTypes: ["primal", "blight", "storm", "smashing", "stabbing", "slicing", "ember"],
  implemented: true,
  

  classIdentity: {
    title: "The Ancestral Conduit",
    subtitle: "Blood-Bound Voice of the Wild and the Written Word",
    utility: "Channel ancestral power through the three adapted forms of a single root technique: bone totems erupted from the body (the Ordan throat-singer's physical legacy), curse-driven spirit invocations (the Vreken spore-inhaler's Wyrd resonance), and permanent runic networks carved into earth and flesh (the Skald trader's flesh-record). Terraform the battlefield, summon specters, and inscribe sacred sigils, paying for every manifestation through the mounting toll of Spirit Erosion.",
    fatalFlaw: "Triple catastrophic flaw from fused traditions. Spirit Erosion at 15+ Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters active runic networks dealing backlash, and the spirits demand service with 1d6 wyrd/turn if you hoard resonance without invoking. The Animist walks three tightropes simultaneously, and falling from any one is devastating."
  },

  livingOrder: {
    orderName: 'The Silent Throat',
    founder: {
      name: 'Kael the Herd-Runner',
      status: `Dead. The first of the three named Animist founders, an Ordan throat-singer who sat motionless for three seasons in the Sundrift Vale, letting bone and root erupt from his flesh until the wind-spirits claimed him as kin. The practice predates writing  —  it was navigation, not philosophy. The Ordan do not know who first sang the dead into the wind, only that when the stars went dark, Kael began singing ancestor-names and the herds still found their way.`,
      note: `Kael is canonically one of three co-founders of the Animist tradition (alongside Nyssa the Herbalist and Theron the Skald Scholar). The Ordan throat-singing tradition lives entirely in muscle-memory, teacher to student, voice to voice, and Kael is the root of that lineage. Later traditions (Skald, Vreken, Astril, Nethien) all trace their root technique to Kael's work.`
    },
    currentLeader: {
      name: 'Bayar Wind-Throat',
      title: 'Last Singer of the Old Route',
      characterization: `An Ordan elder who still sings the migration-routes in the old tongue of the Long Before  —  the language that predates the dialect-fracture. Bayar has not spoken a word aloud in forty years; he communicates only through throat-sung overtones, the way the First Singer did. His vocal cords are calcified from decades of channeling ancestors who died before the stars went out. He is the living archive of the oldest form, and he watches the younger traditions drift further from the root with every generation  —  not with anger, but with the patience of someone who knows the dead will correct them eventually.`
    },
    headquarters: { name: 'The Sundrift Wind-Shrine (moving camp)', locationId: 'sundrift-vale' },
    crisisConnection: `Bayar Wind-Throat is the only living Animist who still sings the pre-fracture language. The dialect-fracture is a problem of the dead themselves  —  the oldest dead (those who died before the <LoreLink termId="sundered_monoliths">Monoliths</LoreLink> woke) speak clearly. The newer dead are confused, their voices layered with static no throat-singer can parse. Bayar suspects something is wrong with the threshold of death itself, and the Monoliths' awakening is not a cause but a symptom. He cannot prove this, because the evidence is in a language no one else remembers how to hear.`
  },

  worldFriction: [
    { region: 'nordhalla', status: 'persecuted', consequence: 'The Cleansing of the Hearth, House Skalvyr religious purge, explicitly targets tribal Animists and Sky-Readers. Practitioners caught throat-singing or skin-carving are arrested; the Runic Academies denounce ancestral communion as heresy.', workaround: 'The Skald Rune-Keeper variant survives by framing its practice as genealogy rather than magic, the runes read as record-keeping to inquisitors who do not look too closely.' },
    { region: 'sundrift-vale', status: 'persecuted', consequence: 'House Ordavan systematically purges Sky-Singers under the state-enforced ancestor worship. Ordan throat-sung Animists are the most hunted; their overtones carry for miles and cannot be hidden.' },
    { region: 'bryngloom-forest', location: 'atropolis', status: 'tolerated', consequence: 'The Nethien Ledger-Summoners are legally protected as archival practice; the Vreken spore-elders are tolerated as a forest-floor fixture. Bryngloom is the safest region for an Animist, provided they do not disturb the Root-Veil.' }
  ],

  overview: {
        originStory: `A practitioner of ancestor-communion through physical transformation. Bone erupts from flesh as totems. Glowing sigils burn across skin. The voices of ancestors speak through the practitioner's own throat, and the price of carrying them is Spirit Erosion, a slow consumption of the self by the spirits that were invited in.

The tradition began in the Sundrift Vale during the early centuries of the Freezing Era, when House Ordavan traded fertile soil for the endless migration and the sky went starless. The Ordan had navigated by star-maps for centuries. Suddenly they had nothing. The herds still moved, the steppe was still featureless, the wind still blew, but no one knew where they were going.

The throat-singers adapted first, though not by design. They had always encoded migration routes in overtone harmonies, the old names of stars carried in the second voice the throat produces. When the stars went dark, the songs lost their referents. The overtones were still there, but they mapped to nothing. Throat-singers tried replacing the star-names with landmarks, wind-patterns, and the seasonal rhythms of the herds. All of these failed, the steppe shifts, the wind lies, and the herds follow paths the living no longer remembered.

It was an elder named Hearth-Singer, whose name has been lost but whose title the tradition still carries, who first tried the dead. She was dying anyway, too old to keep pace with the migration, left at a mound-camp to wait for the end. She spent her final weeks singing. Not the migration songs, she had forgotten those. She sang the names of her ancestors instead, one after another, working backward through memory. On the third night, something answered. Not the ancestor she was singing to. Something older, further back, a voice that had been carried in the bloodline since before the sky went dark. It knew the route. It had walked it before the stars were mapped. It had been waiting, the Hearth-Singer realized, for someone to listen.

She followed the voice south. She found the herd. She died three days later. But she had proven that the dead could navigate where the stars could not.

The practice spread along the Hunger Road. Skald caravans crossing the Groven Ancestor-Spans heard Ordan throat-singers and recognized the technique: they were carrying voices. The Skald, whose culture already preserved their dead in glacier-ice panels at Skalvyrhold, began carrying their own, carving ancestor-names directly into skin, making the flesh a permanent record. A Skald covered in runic scars carries a retinue of the dead, each anchored to a wound that never fully closes.

The Stargazer Astril adapted the practice through their Lumia heritage, the fragment of a dead world's biosphere living in every Astril bloodline. A Stargazer Astril does not summon a separate ancestor. The heritage itself is the ancestor, channeled through crystalline skin that hums with lost starlight. The Stargazer Astril variant is strongest in absolute darkness, where the trapped light in their markings is the only light left. The Brutish Astril practice a quieter version, communion through ritual stillness under the moon, where the dead world's consciousness speaks through crystalline markings rather than erupted bone.

The Morgh Groven carry the most literal version of the art. The Still-Claiming already turns Groven dead into calcified stone, the ancestors literally become the bridges their descendants walk. A Morgh channels the dead not as spirits but as mineral memory, drawing on the same alchemical residues the Deep Alchemists used to reshape the Groven from Thrumm stock. The race that was sculpted against its will now sculpts itself.

The Waste-Solari adapted the art through forge-memory. The volcanic forges of Sundale have been burning since before humans walked the world, and the Waste-Solari believe that every hammer-strike carries the echo of every smith who struck that anvil before. A Waste-Solari does not sing ancestors or carve them into skin. They work the forge. The dead are in the metal, answering through the ring of hot iron, the oldest continuous craft tradition on Mythril preserved in the muscle memory of hands that learned from hands.

The Trueborn Florae adapted the tradition through their fae-touched blood. The bloodline carries the memory of House Viridane's refusal, the one house that said no to the dark bargains, that fled south into the moonlit groves. A Trueborn channels not individual ancestors but the collective memory of that refusal, the thorn-scars on their skin blooming into living records of every Florae who died before their debt was paid.

The ancestral language that all practitioners share is fading. The older dead, those who died before the Freezing Era, still speak clearly. The newer dead are increasingly confused. Something is wrong with death itself. The Monoliths' awakening is accelerating the erosion, and the youngest practitioners, those who attempt to carry too many voices, are suffering complete sensory collapse. The current leader, Bayar Wind-Throat, is one of the last who can still sing the pre-fracture tongue. She operates from the Sundrift Wind-Shrine, a moving camp that follows the migration routes her ancestors mapped before the stars went out.`,

    title: "The Animist",
    subtitle: "Ancestral Conduit and the Triple Toll of Communion",
    quickOverview: {
    title: "Class Overview",
    content: `**Who they are**: The Animist is a primal shaman and walking conduit of three ancient ancestral traditions: bone totems, spirit curses, and runic ground inscriptions. You terraform the battlefield into an ancestral killing zone, commanding the spirits of the dead to control the fight.

**The hook**: You control the battlefield through **Ancestral Terraforming**: erupting bone totems to block enemy movement, carving permanent runic networks across the floor, and spreading spirit curses that jump between enemies when they die.

**The resource bar & costs**: Your resource bar is **Resonance**, generated by maintaining active totems, runes, and curses simultaneously. You spend Resonance to detonate your entire runic network in massive spirit explosions. Hoarding too much Resonance without spending it angers the ancestral spirits, dealing internal backlash.

**Bring one for**: Unrivaled battlefield terraforming through three simultaneous control systems—bone walls, spirit specters, and permanent runic kill-boxes.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: "Practitioners carry a profound cultural and physical responsibility, marked by their tradition's unique legacy and societal perceptions."
    },
    combatRole: {
      title: "Combat Role",
      content: "Battlefield terraformer and triple-threat spirit conduit who locks down zones with permanent runic kill-boxes, bone walls, and cascading spirit curses."
    },
    playstyle: {
      title: "Playstyle & Turn 1 Flow",
      content: "**Your Turn 1 in Combat**:\n1. **Deploy Bone Totem or Runic Node**: Drop a totem or rune at a choke point to establish your network.\n2. **Curse an Enemy**: Apply an ancestral curse to generate early Resonance.\n3. **Monitor Spirit Erosion**: Ride resonance near 14 for peak buffs, then detonate runes before reaching the 15+ triple toll."
    }
  },
    description: `A walking archive of three dead traditions, written in scars, bone spurs, and spiritual static. The Animist does not cast magic; they undergo intense physical transformation. Bone erupts from flesh as totems. Glowing sigils ignite across stone. The voices of ancestral spirits whisper through hallucinations that cannot be silenced. Every word of ancestral power risks Spirit Erosion � the more resonance you hoard, the more the ancestors consume you.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: ONE DISCOVERY, MANY VOICES**
The Animist was born not from three founders but from a single crisis. When the stars went dark over the <LoreLink termId="sundrift-vale">Sundrift Vale</LoreLink>, the Ordan throat-singers discovered that the dead remember what the living forget: the migration routes, the old paths, the names of places no living Ordan had seen. They turned their overtones from star-names to ancestor-names, and this single technique  —  the dead as compass  —  spread along the Hunger Road through trade, through the Bryngloom border through contact, through Nethien contract-culture through legal adaptation, through Astril symbiosis through blood-memory, and through Nethien archives through citation.

There were no three founders. There was one lost Ordan throat-singer whose name was never recorded, a Skald trader who heard the songs at a Groven span-crossing and carved the first ancestor-rune into his own skin, and a Clean Vreken who walked into the bog after trading with Ordan herders and inhaled the first spore with intent. This is how knowledge spreads: through contact, not coincidence.

**CITIES & CIVIL RECEPTION**
Animists are viewed with a mixture of deep respect and visceral fear. Their bone spurs, glowing inscriptions, and spirit-static hallucinations make them unmistakable. They are essential in wilderness expeditions and siege defense, but unsettling in settled communities.

**RACES & CULTURAL AFFILIATION**
The root technique originated among the <LoreLink termId="house_ordavan">Ordan</LoreLink> humans of the Sundrift Vale. It spread to the <LoreLink termId="skald">Skald</LoreLink> via the Hunger Road, to the Clean <LoreLink termId="vreken">Vreken</LoreLink> through Bryngloom border trade, to the <LoreLink termId="house_morrath">Vreken</LoreLink> through Nethien contract-culture adapting the concept of ancestor-summoning as debt-recitation, to the Stargazer Astril and Brutish Astril <LoreLink termId="astril">Astril</LoreLink> through steppe cohabitation and Lumia heritage, and to the <LoreLink termId="neth">Nethien</LoreLink> through archival synthesis and legal citation. Each culture adapted the same root discovery to its own medium.

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

The oldest dead  —  those who died before the <LoreLink termId="sundered_monoliths">Monoliths</LoreLink> woke  —  still speak clearly. Their voices come through bone, rune, spore, and contract with perfect fidelity, across every cultural dialect. Bayar Wind-Throat can still sing their overtones without static. The Skald runes carved for the oldest ancestors still glow steady. The Vreken spores carrying pre-Bog ancestors still bloom in clean patterns.

The newer dead are... confused. Their voices layer with static no throat-singer can parse. Runes carved for ancestors who died within the last two centuries flicker, migrate, or go cold. Spores carrying recently-deceased memory produce bioluminescence that spells words in languages no living culture recognizes. Vreken debt-ancestors who died after the Monoliths woke are refusing to acknowledge renegotiations  —  demanding original terms in a language the living no longer speak, and in some cases, a language that never existed.

The Animists call this the Fading. The dead are not fragmenting because the traditions divided. The traditions are dividing because the dead are fragmenting  —  and every Animist, regardless of culture, is trying to hold a conversation with ancestors who increasingly do not speak the same language as each other.

Some senior practitioners  —  Bayar Wind-Throat among them  —  suspect the Monoliths are not the cause but a symptom. Whatever is wrong with death began when the Monoliths woke, but it predates them. The threshold between life and death has been... thinning. Or thickening. No one can agree which. But the dead who cross it now are not the same as the dead who crossed it before, and the ancestral language  —  the single root tongue that connects every Animist tradition back to that first Ordan throat-singer  —  is eroding from the far end.`,

    meaningfulTradeoffs: `To be an Animist is to never be comfortable in any environment. Buildings feel wrong to the totemic tradition (earth blocked). Cities feel overwhelming to the spirit tradition (too many spiritual echoes). Libraries feel dangerous to the runic tradition (the ink competes with blood-inscriptions). The Animist needs the wilderness for totems, the spiritual liminal spaces for invocations, and solid stone for runic carving. Finding all three in one place is nearly impossible, so they are perpetually homesick for a place that may not exist.`,

    classSpecificLocations: [
      {
        name: 'The Concord of Tongues',
        locationId: 'frozen_archive',
        description: 'A ring-shaped hall deep in the Frozen Archive where the Convergence keeps the only complete collation of every ancestral dialect, Ordan overtone scores, Skald rune-rubbings, Vreken spore-bloom transcriptions, Nethien citation-registers, and Astril heritage-litanies filed side by side. The Convergence has no fixed seat, it rotates between cultures every generation, but the Concord never moves. Its walls are a dictionary of the dead, and the delegates\' table is a single slab of glacier-ice that has not melted in a century.',
        purpose: 'Archive-seat of the Animist tradition, where the traditions collate, compare, and argue their dialects into one lexicon',
        status: 'Contested, the collation now returns contradictions no delegate can reconcile, and the shared minutes have gone unsigned for two years'
      },
      {
        name: 'The Listening Mound',
        locationId: 'listening_mound',
        description: 'A low barrow in the Sundrift Vale uplands where the Hearth-Singer died proving the dead could navigate. The Ordan did not build on it and did not fence it; the Mound-Camps simply gather near it each summer, and one singer at a time lies flat on the turf with their throat pressed to the earth and sings a single ancestor-name. The oldest dead answer here clearly, in every dialect, which makes it the only place left where the whole tradition agrees the language still works.',
        purpose: 'Pilgrimage and proving-ground, where a new Animist first hears an ancestor answer cleanly',
        status: 'Active, and the queues have grown long, singers now wait three summers for their turn at the turf'
      },
      {
        name: 'Nyssa\'s Sink',
        locationId: 'nyssa_sink',
        description: 'A collapsed peat hollow in the deep Bryngloom where Nyssa the Herbalist inhaled her first deliberate spore and bargained with what answered. The sink is ringed with cultivation ledges of Ghost-Mycelium, and its spore-bloom is the cleanest in the bog: pre-Monolith dead, speaking in steady bioluminescent patterns without static. The elders call it the Quiet Conversation, and they guard it the way the Nethien guard the First Contract, because it is proof the tradition still works.',
        purpose: 'Initiation sink and strain-garden of the Vreken lineage',
        status: 'Guarded, and quietly failing, the ledges nearest the sink are blooming in dialects the elders cannot read'
      },
      {
        name: 'The Quenched Hearth',
        locationId: 'quenched_hearth',
        description: 'A burned Sky-Singer steading in a Nordhalla side-fjord, left exactly as the Cleansing of the Hearth left it: roof-fall, cold ash, and eleven graves dug by neighbours who were forbidden to mark them. A family died here for throat-singing the old names, and the place is silent to every Animist dialect. Even the oldest dead do not answer at the Quenched Hearth, which is the fact that frightens the tradition most: if death is thinning at the far end, this is where something has already thinned through.',
        purpose: 'Vigil site and warning, rune-keepers and spore-elders travel here to confirm the silence and leave one unlit wick per mound',
        status: 'Persecuted ground, House Skalvyr patrols the fjord and treats any visitor as a heretic; the pilgrims come at night, in winter, and do not sing'
      }
    ],

    combatRole: {
      title: "The Ancestral Architect",
      content: `**Triple Battlefield Control**: Your role is to reshape the entire battlefield through three simultaneous systems. Bone totems create physical anchor points and healing zones. Curse-driven spirit invocations provide burst damage and spirit intervention. Runic networks create permanent zones of denial and amplification.

**Three-Tradition Conduit**: You do not pay in blood � you pay in attention. Every turn you choose where to invest resonance: a totem for zone control, a curse for resonance generation, or a rune for a permanent network. The skill is weaving all three without hoarding enough resonance to trigger Spirit Erosion.

**Weaknesses**:
- Ember Glasshouse: at 15+ Resonance you take double ember damage � a single torch or ember spell can drop you in one hit.
- Beyond Healing: at 15+ Resonance no ally's healing touches you; you survive only on your own totems and stolen souls.
- Shove-Bait: any forced movement detonates every active rune for 1d10 arcane each � smart enemies weaponize knockback and teleports against you.
- Rooted to Cast: totems and runes demand you stay planted; mobile foes simply walk out of your setup before it pays off.
- Resonance Treadmill: you must keep casting to stay useful � stop generating/spending and you neither build power nor control the field; a silenced or CC-locked Animist stalls out completely.
- Hoarder's Wrath: sit on high Resonance without spending and the spirits claw 1d6 wyrd damage into you every turn.`
    },
    playstyle: {
      title: "The Triple Toll",
      content: `**Three Systems, One Resource**: Resonance fuels all three traditions. Choose whether to invest resonance into totem eruption, spirit invocation, or runic inscription. The most powerful Animist weaves all three simultaneously, but this accelerates Spirit Erosion.

**Spirit Erosion**: The triple toll activates at 15+ resonance. Fire burns you at double strength. Party healers cannot touch you. If an enemy shoves you, your runic network explodes in backlash. And the spirits claw at your mind if you hoard without spending.`
    },
  },

  resourceSystem: {
    title: "Resonance: The Spirit Conductor",
    subtitle: "How Your Resource Works (Beginner's Guide)",
    description: `**1. What is it? (The Radio Tower)**
Resonance (0–20) represents the spiritual signal strength between you and the ancestral spirit courts. You maintain this connection through bone totems and runic territory nodes.

**2. How do I build it?**
- Place bone totems or carve runic nodes into the ground (+1 to +2 Resonance).
- Cast builder curses on enemies (+1 Resonance).
- Maintain active totems in combat (+1 per round).

**3. How do I spend it & what is the catch?**
- Spend Resonance to detonate runic kill-boxes, shield allies, or summon spectral beast avatars.
- **The Catch (Spirit Erosion)**: While 1–14 Resonance grants powerful spell buffs, exceeding **15+ Resonance** causes Spirit Erosion—the spirits demand a physical toll, dealing self-damage at the start of your turn until you detonate nodes to vent power.`,
    cards: [
      {
        title: "Resonance",
        stats: "0-20 Resonance",
        details: "Generated by totem summoning (Primalist tradition), curse casting and ritual completion (Witch Doctor tradition), and rune carving plus stationary stance (Inscriptor tradition). Spent on totem powers, spirit invocations, and runic network activations."
      },
      {
        title: "Spirit Erosion",
        stats: "Triple Catastrophic Flaw (15+ Resonance)",
        details: "100% ember vulnerability. Cannot receive party healing. Forced movement shatters runic networks (1d10 arcane per active rune). Spirits demand service: 1d6 wyrd/turn if 15+ resonance and no invocation/spend this turn."
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
      content: "At 15+ Resonance, three catastrophic flaws activate simultaneously:\n1. **Flammable Being**: All ember damage is increased by 100%. No resistance bypass.\n2. **Ancestral Isolation**: Cannot benefit from healing spells cast by others. Your own totem healing still works on allies but not on you.\n3. **Runic Shatter**: If you are forcibly moved, all active runes shatter. Take 1d10 force damage per active rune and become vulnerable to all damage until end of next turn.\n4. **Spirit Demand**: If you end your turn at 15+ resonance without spending any, take 1d6 wyrd damage from the demanding spirits."
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
      name: "Resonance",
      description: "At 15+ Resonance: 100% ember vulnerability, cannot receive party healing, forced movement shatters runic networks (1d10 arcane/active rune), and 1d6 wyrd/turn if hoarding without spending."
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
          "Mortis-Eld invocation costs 2 less resonance and needs only 2 cursed enemies",
          "Curses generate +1 additional Resonance",
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
          description: "Mortis-Eld invocations cost 2 less resonance and require only 2 cursed enemies. Curses generate +1 additional Resonance. Your beast summons deal +2 damage to bleeding or trapped targets."
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
          "Storm damage +1d6 when standing near Storm Totem",
          "Sunder-Stream invocation costs 2 less; Hearth-Singer costs 2 less for clutch healing"
        ],
        weaknesses: [
          "Allies take minor blight damage from branded weapons",
          "Lower personal shields; must rely on allies for defense",
          "Resonance generation depends on buffed allies dealing/taking damage",
          "Triple toll hits hardest due to aggressive playstyle"
        ],
        specPassive: {
          name: "Stormbrand Inscription",
          description: "When you carve an inscription onto an ally, the ally gains +2 to attacks and saves for 5 rounds. Their weapon siphons life, healing 20% of damage dealt. Your spells deal +1d6 storm damage near a Storm Totem. Sunder-Stream and Hearth-Singer invocations cost 2 less resonance."
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
      typeConfig: { school: "primal", icon: "General/Commune", tags: ["utility", "divination", "speak_with_dead", "animist"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 5 },
      resourceCost: { actionPoints: 1, mana: 3 },
      resolution: "NONE",
      effectTypes: ["utility"],
      utilityConfig: {
        utilityType: "divination",
        selectedEffects: [
          { id: "spirit_voice_commune", name: "Commune With The Dead", description: "Ask the spirits of ancestors or a corpse 3 questions about their death or local threats.", mechanicsText: "3 questions to spirits/corpse." }
        ],
        duration: 0,
        durationUnit: "instant",
        concentration: false,
        power: "minor"
      },
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
      effectTypes: ["utility"],
      typeConfig: { school: "primal", icon: "Nature/Beast Mark", tags: ["utility", "scout", "beast_sense", "animist"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "self", rangeType: "self" },
      resourceCost: { actionPoints: 1, mana: 4 },
      resolution: "NONE",
      utilityConfig: {
        utilityType: "perception",
        selectedEffects: [
          { id: "spirit_hawk_sight", name: "Ancestral Falcon", description: "Project your sight into an ancestral falcon or raven up to 1 mile away and scout through it.", mechanicsText: "Remote sight via spirit bird, 1 mile, 10 minutes." }
        ],
        duration: 10,
        durationUnit: "minutes",
        concentration: true,
        power: "moderate"
      },
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
      description: "Carve a bloody brand onto an ally's weapon, adding arcane damage to strikes. Generates 1 Resonance.",
      level: 1,
      spellType: "ACTION",
      icon: "Slashing/Bloody Slash",
      effectTypes: ["buff"],
      typeConfig: { school: "smashing", icon: "Slashing/Bloody Slash", tags: ["buff","brand","starter"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: undefined, targetRestrictions: ["allies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      buffConfig: { buffType: "statEnhancement", effects: [{ id : "animist_brand_force", name: "Crimson Brand", description: "Weapon strikes deal +1d4 arcane damage.", mechanicsText: "+1d4 arcane damage on hit." }], durationType: "rounds", durationValue: 5, durationUnit: "rounds", canBeDispelled: true },
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
    { id : "animist_invoke_sunder_stream",
      name: "Invoke Sunder-Stream",
      description: "Ancestral invocation: Call upon the ancient spirits of the subterranean waterways to unleash restorative rain that heals and cleanses allies. Spends 6 Resonance.",
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
      description: "Carve a glowing brand onto an ally's protective gear, granting +2 DR. Generates 1 Resonance.",
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
    { id : "animist_invoke_threshold_guide",
      name: "Invoke Threshold-Guide",
      description: "Ancestral invocation: Summon the ancestral threshold guardian to immediately cleanse CC and grant +1 AP. Spends 7 Resonance.",
      level: 6,
      spellType: "ACTION",
      icon: "Psychic/Psychic Telepathy",
      effectTypes: ["buff"],
      typeConfig: { school: "wyrd", icon: "Psychic/Psychic Telepathy", tags: ["buff","invocation","cleanse"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["allies"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 10, classResource: { type: "resonance", cost: 7 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      buffConfig: { buffType: "statusEffectBuff", effects: [{ id : "animist_threshold_cleanse", name: "Threshold Key", description: "CC cleansed and gain +1 Action Point next turn.", mechanicsText: "CC cleansed, +1 AP next turn." }], durationType: "rounds", durationValue: 1, durationUnit: "rounds", canBeDispelled: true },
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
    { id : "animist_invoke_hearth_singer",
      name: "Invoke Hearth-Singer",
      description: "Ancestral invocation: Call upon the Hearth-Singer for a massive healing burst to all allies. Spends 8 Resonance.",
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
    { id : "animist_invoke_mortis_eld",
      name: "Invoke Mortis-Eld",
      description: "Ancestral invocation: Strike all cursed enemies with devastating shadow rot from the oldest ancestors. Spends 10 Resonance.",
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
      description: "Kneel beside a corpse, bone, or lingering shade and breathe the ancestor-tongue into it: the dead answer three questions about their life, death, or last witnessed. Generates 1 Resonance.",
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
      description: "Press bone to stone and read the ancestral memory on a place or object: a flash of the last death there, a spoken word, or a violent echo, revealing recent history. Generates 1 Resonance.",
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
      description: "Dislodge your spirit (or lend it to a summoned specter) and send it roaming as an invisible scout. You see and hear through it while your body stands blind and defenseless. Spends 2 Resonance.",
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
      description: "Inscribe a translating rune over text: for one hour read any written language, decipher codes, and surface hidden or illusion-veiled script. Shareable with one ally. Generates 1 Resonance.",
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
      description: "Erupt a bone totem at a doorway or camp perimeter: a spirit-knell warns you when any creature or restless shade crosses uninvited; resting allies recover with advantage. Generates 2 Resonance.",
      level: 2,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["utility","buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["utility","totem","exploration","rest"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["allies"], areaShape: "circle", areaSize: 30 },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 4, classResource: { type: "resonance", cost: -2 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: { utilityType: "ward", selectedEffects: [ { id : "animist_threshold_ward_alert", name: "Threshold Knell", description: "Alerts you (no perceptible sound) to any creature crossing the warded boundary. Spirits and incorporeal undead are barred unless invited.", mechanicsText: "Silent intrusion alarm; bars uninvited spirits." }, { id : "animist_threshold_ward_rest", name: "Ancestral Vigil", description: "Allies who complete a rest inside the ward recover HP and resources with advantage.", mechanicsText: "Advantage on rest recovery within the ward." } ], duration: 8, durationUnit: "hours" },
      buffConfig: {
        buffType: "auraEffect",
        effects: [
          { id: "threshold_ward_rest_buff", name: "Ancestral Vigil", description: "Allies resting within the ward recover HP and resources with advantage.", mechanicsText: "Advantage on rest recovery, 8 hours." }
        ],
        durationType: "hours",
        durationValue: 8,
        durationUnit: "hours"
      },
      resolution: "NONE",
      tags: ["utility","totem","exploration","rest","primal"]
    ,

  somaticText: "Plant a finger-bone in the threshold and let it drink a drop of your spit to know the house.",
  verbalText: "Name every ally aloud so the totem knows who belongs.",
},
    { id : "animist_mourners_pact",
      name: "Mourner's Pact",
      description: "Offer blood and a true name to soothe hostile spirits or the bereaved: the dead calm enough to parley; advantage on social checks with the spirit-touched or mourning. Generates 1 Resonance.",
      level: 3,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["utility","buff"],
      typeConfig: { school: "wyrd", icon: "Healing/Golden Heart", tags: ["utility","social","spirit","exploration"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["any"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 5, classResource: { type: "resonance", cost: -1 } },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      utilityConfig: { utilityType: "social", selectedEffects: [ { id : "animist_mourners_pact_calm", name: "Mourner's Pact", description: "Calm hostile ghosts/spirits to neutral and open to dialogue, and grant yourself advantage on social checks with the spirit-touched, the bereaved, or the dead for 10 minutes.", mechanicsText: "Calm spirits; advantage on social checks with the mourning/spirit-touched." } ], duration: 10, durationUnit: "minutes" },
      buffConfig: {
        buffType: "combatAdvantage",
        effects: [
          { id: "mourners_pact_trust", name: "Kin-Trust", description: "The grieving instinctively trust you: advantage on social checks with the spirit-touched or the mourning.", mechanicsText: "Advantage on social checks with the grieving/spirit-touched, 10 minutes." }
        ],
        durationType: "minutes",
        durationValue: 10,
        durationUnit: "minutes"
      },
      resolution: "NONE",
      tags: ["utility","social","spirit","exploration"]
    ,

  somaticText: "Smear a thumbprint of blood on the target's brow (or the air before a shade) and breathe slow.",
  verbalText: "Recite the true name and the kin-name � the words the dead answer to.",
}
  ,
    {
      id: "animist_ancestral_wrath_strike",
      name: "Ancestral Wrath Strike",
      description: "Channel the fury of a fallen steppe warrior through your weapon, delivering a crushing blow that rattles the foe's bones. Spends 4 Resonance.",
      level: 4,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["damage", "ancestor", "primal"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "melee", targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 1, mana: 8, classResource: { type: "resonance", cost: 4 } },
      damageConfig: { formula: "4d8 + strength", damageTypes: ["primal", "smashing"], resolution: "DICE" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      resolution: "DICE",
      tags: ["damage", "ancestor", "primal", "smashing"],
      somaticText: "Grip weapon with both hands as spectral arms overlay your own.",
      verbalText: "A warrior's battle cry in the ancient tongue."
    },
    {
      id: "animist_thunder_totem",
      name: "Thunderclap Totem",
      description: "Plant a carved storm-horn totem that discharges concussive lightning bolts into nearby foes each round. Spends 6 Resonance.",
      level: 5,
      spellType: "ACTION",
      icon: "Storm/Lightning Strike",
      effectTypes: ["damage", "totem"],
      typeConfig: { school: "storm", icon: "Storm/Lightning Strike", tags: ["damage", "totem", "storm", "aoe"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 40, aoeShape: "circle", aoeParameters: { radius: 20 }, targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 12, classResource: { type: "resonance", cost: 6 } },
      damageConfig: { formula: "5d8 + spirit", damageTypes: ["storm"], resolution: "DICE" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      resolution: "DICE",
      tags: ["damage", "totem", "storm", "aoe"],
      somaticText: "Drive the storm-carved horn totem into the soil.",
      verbalText: "Call down the sky-spirit's thunderous overtone."
    },
    {
      id: "animist_ancestral_concussion",
      name: "Ancestral Concussion",
      description: "Summon a choir of ancestral throat-singers whose sonic boom stuns enemies in a 30ft cone. Spends 8 Resonance.",
      level: 6,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage", "control"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["damage", "control", "sound", "primal"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", aoeShape: "cone", aoeParameters: { length: 30, angle: 90 }, targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 14, classResource: { type: "resonance", cost: 8 } },
      damageConfig: { formula: "6d8 + spirit", damageTypes: ["primal", "smashing"], resolution: "DICE" },
      controlConfig: { controlType: "stun", duration: 1, durationUnit: "rounds", savingThrow: { ability: "fortitude", difficultyClass: 16, saveOutcome: "negates" }, effects: [{ id: "throat_stun", name: "Overtone Stun", description: "Stunned for 1 round.", mechanicsText: "Stunned for 1 round on failed Fortitude save." }] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      tags: ["damage", "control", "sound", "primal"],
      somaticText: "Open both arms wide, chest vibrating with deep overtone chords.",
      verbalText: "Sustain a dual-pitch harmonic note that shatters stone."
    },
    {
      id: "animist_volcanic_fissure",
      name: "Volcanic Spirit Fissure",
      description: "Slam a fire-scorched elder bone into the earth, opening a molten crevasse that scorches foes in a line. Spends 8 Resonance.",
      level: 7,
      spellType: "ACTION",
      icon: "Fire/Fire Ball",
      effectTypes: ["damage"],
      typeConfig: { school: "ember", icon: "Fire/Fire Ball", tags: ["damage", "ember", "primal", "line"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 45, aoeShape: "line", aoeParameters: { length: 45, width: 10 }, targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 18, classResource: { type: "resonance", cost: 8 } },
      damageConfig: { formula: "8d8 + spirit", damageTypes: ["ember", "primal"], resolution: "DICE" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      resolution: "DICE",
      tags: ["damage", "ember", "primal", "line"],
      somaticText: "Strike charred bone spear into ground, splitting earth with magma veins.",
      verbalText: "Invoke the subterranean fire-ancestors of the deep mantle."
    },
    {
      id: "animist_primeval_stampede",
      name: "Primeval Stampede",
      description: "Summon the ghost-herd of ancient migration beasts to trample across a 40ft area, crushing all foes underfoot. Spends 10 Resonance.",
      level: 8,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage", "control"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["damage", "control", "summon", "primal"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, aoeShape: "circle", aoeParameters: { radius: 25 }, targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 22, classResource: { type: "resonance", cost: 10 } },
      damageConfig: { formula: "10d8 + strength", damageTypes: ["primal", "smashing"], resolution: "DICE" },
      controlConfig: { controlType: "knockdown", duration: 1, durationUnit: "rounds", savingThrow: { ability: "fortitude", difficultyClass: 18, saveOutcome: "negates" }, effects: [{ id: "stampede_prone", name: "Trampled Prone", description: "Knocked prone.", mechanicsText: "Knocked prone on failed Fortitude save." }] },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      resolution: "DICE",
      tags: ["damage", "control", "summon", "primal"],
      somaticText: "Beat war-drum rhythm against chest with both fists.",
      verbalText: "The migratory bellow of extinct herds across the plain."
    },
    {
      id: "animist_ancestral_communion_sanctuary",
      name: "Ancestral Communion Sanctuary",
      description: "Anchor a 30ft sanctuary of swirling spirit-mist. Allies inside heal 8d8 HP, gain +6 DR, and are immune to fear and charm. Spends 12 Resonance.",
      level: 9,
      spellType: "ACTION",
      icon: "Healing/Golden Heart",
      effectTypes: ["healing", "buff"],
      typeConfig: { school: "primal", icon: "Healing/Golden Heart", tags: ["healing", "buff", "support", "sanctuary"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", aoeShape: "circle", aoeParameters: { radius: 30 }, targetRestrictions: ["ally"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 25, classResource: { type: "resonance", cost: 12 } },
      healingConfig: { formula: "8d8 + spirit", healingType: "direct" },
      buffConfig: { buffType: "statModifier", effects: [{ id: "ancestral_sanctuary_buff", name: "Sanctuary of the Dead", description: "+6 DR and immunity to fear and charm for 3 rounds.", mechanicsText: "+6 DR, immune to fear/charm for 3 rounds." }], durationValue: 3, durationUnit: "rounds" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      resolution: "AUTOMATIC",
      tags: ["healing", "buff", "support", "sanctuary", "primal"],
      somaticText: "Scatter ash in a wide circle, knitting spirits into a dome of pale mist.",
      verbalText: "Chant the ancestral shelter-covenant."
    },
    {
      id: "animist_wrath_of_the_first_ancestor",
      name: "Wrath of the First Ancestor",
      description: "Channel the monolithic spirit of the progenitor steppe titan to smite a single enemy with shattering ancestral power. Spends 12 Resonance.",
      level: 9,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["damage"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["damage", "primal", "smashing", "single"], castTime: 2, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 60, targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 2, mana: 26, classResource: { type: "resonance", cost: 12 } },
      damageConfig: { formula: "14d8 + spirit", damageTypes: ["primal", "smashing"], resolution: "DICE" },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      resolution: "DICE",
      tags: ["damage", "primal", "smashing", "single"],
      somaticText: "Point elder staff at target; titan shadow descends with devastating impact.",
      verbalText: "Pronounce the name of the First Founder."
    },
    {
      id: "animist_totem_of_the_world_tree",
      name: "Totem of the World Tree",
      description: "Erupt a colossal primeval world-root totem that links all party members, pooling their health, granting +8 DR, and instantly preventing lethal damage once. Spends 15 Resonance.",
      level: 10,
      spellType: "ACTION",
      icon: "Nature/Nature Natural 11",
      effectTypes: ["defense", "buff"],
      typeConfig: { school: "primal", icon: "Nature/Nature Natural 11", tags: ["defense", "buff", "totem", "ultimate"], castTime: 3, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 50, aoeShape: "circle", aoeParameters: { radius: 40 }, targetRestrictions: ["ally"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 3, mana: 30, classResource: { type: "resonance", cost: 15 } },
      buffConfig: { buffType: "deathWard", effects: [{ id: "world_tree_ward", name: "Primeval Root-Shield", description: "+8 DR, shared recovery, and lethal damage prevention for 4 rounds.", mechanicsText: "+8 DR; prevents lethal damage once; lasts 4 rounds." }], durationValue: 4, durationUnit: "rounds" },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "AUTOMATIC",
      tags: ["defense", "buff", "totem", "ultimate", "primal"],
      somaticText: "Plant the ancient heartwood seed; colossal roots erupt from the earth.",
      verbalText: "Sing the hymn of the world-tree's birth."
    },
    {
      id: "animist_apotheosis_ancestral_tempest",
      name: "Ancestral Cataclysm Tempest",
      description: "Unleash the full fury of an ancient sky-god spirit, blanketing the battlefield in lightning, hail, and gale-force ancestral overtones. Spends 15 Resonance.",
      level: 10,
      spellType: "ACTION",
      icon: "Storm/Lightning Strike",
      effectTypes: ["damage", "control"],
      typeConfig: { school: "storm", icon: "Storm/Lightning Strike", tags: ["damage", "control", "storm", "primal", "ultimate"], castTime: 3, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "area", rangeType: "self_centered", aoeShape: "circle", aoeParameters: { radius: 50 }, targetRestrictions: ["enemy"] },
      resourceCost: { components: ['verbal', 'somatic'], actionPoints: 3, mana: 32, classResource: { type: "resonance", cost: 15 } },
      damageConfig: { formula: "18d8 + spirit", damageTypes: ["storm", "primal"], resolution: "DICE", savingThrow: { ability: "fortitude", difficultyClass: 20, saveOutcome: "half_damage" } },
      controlConfig: { controlType: "knockdown", duration: 1, durationUnit: "rounds", effects: [{ id: "tempest_knockdown", name: "Hurricane Blast", description: "Knocked prone.", mechanicsText: "Knocked prone on failed Fortitude save." }] },
      cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
      resolution: "DICE",
      tags: ["damage", "control", "storm", "primal", "ultimate"],
      somaticText: "Ascend 5 feet into the air as lightning arcs between fingertips.",
      verbalText: "Shriek the tempest-oath into the storm."
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
    "animist_bone_reading",
    "animist_spirit_voice"
  ],
  "2": [
    "animist_gale_totem",
    "animist_spirit_link",
    "animist_rune_of_celerity",
    "animist_calcified_spire",
    "animist_spirit_walk",
    "animist_scribes_insight",
    "animist_threshold_ward",
    "animist_spirit_hawk"
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
    "animist_invoke_sunder_stream",
    "animist_scribe_warding",
    "animist_ancestral_wrath_strike"
  ],
  "5": [
    "animist_totemic_storm",
    "animist_ritual_of_the_bog",
    "animist_brand_of_spellguard",
    "animist_thunder_totem"
  ],
  "6": [
    "animist_invoke_threshold_guide",
    "animist_grave_sight",
    "animist_rune_of_vitality",
    "animist_ancestral_concussion"
  ],
  "7": [
    "animist_inscribed_fortress",
    "animist_invoke_hearth_singer",
    "animist_spirit_dredge",
    "animist_volcanic_fissure"
  ],
  "8": [
    "animist_invoke_mortis_eld",
    "animist_primeval_totem",
    "animist_rune_of_binding",
    "animist_primeval_stampede"
  ],
  "9": [
    "animist_worldscribe",
    "animist_cataclysmic_eruption",
    "animist_ancestral_communion_sanctuary",
    "animist_wrath_of_the_first_ancestor"
  ],
  "10": [
    "animist_triune_ascension",
    "animist_spectral_guardian",
    "animist_totem_of_the_world_tree",
    "animist_apotheosis_ancestral_tempest"
  ]
}
};
