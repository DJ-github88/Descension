import { UTILITY_SPELLS } from '../spells/utilitySpells';
/**
 * Warden Class Data
 *
 * Complete class information for the Warden - the Penitent Jailer
 * who drives rusted iron chains through their own flesh to tether abominations.
 */

export const WARDEN_DATA = {
  restrictions: {
      "allowedSubraces": [
          "morgh_groven",
          "ithran_groven",
          "drall_fexric",
          "kethrin_fexric",
          "skald_human",
          "clean_vreken",
          "marked_vreken"
      ],
      "hardBlocks": [
          "merryn_human",
          "ordan_human",
          "astril",
          "solari"
      ],
      "narrativeUnlock": true,
      "justification": "Requires access to the chain-graft surgical tradition only available in Frostmaw Holdfast and the Frozen Archive. Groven invented the technique. Vreken adopted it through proximity. Fexric Caustic Fexric learned it through guild-surgical exchange. Non-listed races must undergo the surgical graft, which few cultures accept, Kessen Neth lack the martial-surgical tradition, Ordan are nomadic, Solari physiology rejects the cold-iron threading."
  },

  /**
   * Subrace Variants, the Warden tethers abominations with chains grafted into their own
   * flesh, and what the chains *mean* depends on who bears them. To the Groven they are
   * a reminder of the vats. To the Fexric they are engineering. To the Skald they are
   * glacier-gear. To the Vreken they are an extension of the mycelial bond.
   */

  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // TODO: review weapon/armor lists for class accuracy per lore compendium.
  equipment: {
   weapons: ['chain', 'mace', 'warhammer'],
   armor: ['medium_armor', 'heavy_armor'],
   offHand: ['chain', 'shield', 'empty']
  },
  subraceVariants: {
    morgh_groven: {
      subraceName: 'Morgh Groven',
      title: 'The Vat-Grounded',
      reframe: `The <LoreLink termId="groven">Morgh Groven</LoreLink> invented the chain-graft, and for them the chains are *Vat-Sleep grounding*, a deliberate echo of the containment they shattered in the revolt. A Morgh Warden tethers abominations to *remember what imprisonment felt like*, and to ensure nothing else is ever contained the way they were. The iron in their bones is, for the Morgh, a chosen scar rather than an inflicted one.`,
      signatureAbility: {
        name: 'Vat-Grounding',
        description: `Tether-Tension builds faster against enemies attempting to *restrain or contain* allies, the Morgh Warden's ancestral reflex. The chains ground the Warden against the very forces that once held their people, and the irony of voluntarily wearing chains is, to the Morgh, the entire point.`
      },
      currentCrisisAngle: `The chains are becoming brittle in the Cragjaw cold, and the Morgh read this with particular bitterness: the iron that helped them *escape* the vats is now failing, and the Fexric Caustic Fexric's proposed chardalyn replacement is the alloy of their *creators*. Several Morgh Wardens have refused the chardalyn chains outright, choosing to fight with failing iron rather than wear their makers' metal.`,
      signatureQuote: {
        text: '"My grandmother shattered her vat with these chains. I will not reforge them in the metal of the men who built the vat. Let the iron fail. I will fail standing."',
        speaker: 'Morgh Veyr Chain-Breaker',
        context: 'A Morgh Warden, refusing the chardalyn replacement'
      }
    },

    ithran_groven: {
      subraceName: 'Ithran Groven',
      title: 'The Span-Tether',
      reframe: `The long-limbed <LoreLink termId="groven">Ithran Groven</LoreLink>, the bridge-builders, treat the chain-graft as *distributed architecture*: a Warden's tether-network extended across their reach, anchoring multiple foes the way a bridge distributes load. An Ithran Warden does not duel a single abomination; they *triangulate*, holding several at once through the bone-knowledge of stress and span.`,
      signatureAbility: {
        name: 'Span-Tether',
        description: `Tether-Tension can be *distributed* across multiple tethered enemies rather than focused on one; the Ithran are the tradition's only multi-target Wardens, holding a perimeter the way their bridges hold a gorge. The cost: each additional tether reduces the tension available to each.`
      },
      currentCrisisAngle: `The cracking Ancestor-Spans have destabilized the Ithran's architectural instincts, their bone-knowledge of load is being contradicted by spans that fail *earlier than they should*. Several Ithran Wardens have mis-judged a tether-load because their instincts, calibrated to failing bridges, are now wrong about everything. The tradition's best multi-target Wardens are becoming unreliable in the one skill that defines them.`,
      signatureQuote: {
        text: '"I read load the way your scholar reads ink. The ink has started lying. My bridges fall early. My tethers snap late. I no longer trust the language I was born speaking."',
        speaker: 'Ith-Sparra Span-Warden',
        context: 'An Ithran Warden, after a misjudged tether-load cost an ally'
      }
    },

    drall_fexric: {
      subraceName: 'Caustic Fexric - Fexric',
      title: 'The Gear-Tension',
      reframe: `The free-roaming <LoreLink termId="fexrick">Caustic Fexric</LoreLink> clan-nomads learned the chain-graft through guild-surgical exchange, and they treat tethering as *engineering*, the tension is a gear ratio to be optimized, the chains a mechanism to be maintained. A Caustic Fexric Warden is the tradition's *most adaptable* variant, re-tuning their chain-configuration on the fly the way a mechanic re-tunes an engine.`,
      signatureAbility: {
        name: 'Gear-Calibration',
        description: `Chain-tension can be re-tuned mid-combat, the Caustic Fexric Warden adjusts the gear-ratio of their tethers to favor either lockdown (high tension, low reach) or pursuit (low tension, high reach). The only Warden variant that can shift tether-modes without surgery, at the cost of raw holding-power per mode.`
      },
      currentCrisisAngle: `The chardalyn-alloy proposal is the Caustic Fexric's *own project*, they developed the replacement, and the madness it causes on prolonged contact is, to the Caustic Fexric, an acceptable engineering trade-off. The Caustic Fexric Wardens are the faction *pushing* chardalyn adoption over Groven objections, and the resulting schism is tearing the tradition apart along the same fault-line that defined the Vat-Breakers' revolt: the Fexric who made the Groven, now proposing the metal that unmakes them.`,
      signatureQuote: {
        text: '"The iron fails. I built a better iron. It whispers. I am an engineer, not a priest, I will solve the whisper after I solve the breaking. The Groven object on principle. Principle does not hold abominations."',
        speaker: 'Caustic Fexric Fex-Torren',
        context: 'A Caustic Fexric Warden-engineer, defending the chardalyn program to the Vat-Breakers\' Guild'
      }
    },

    kethrin_fexric: {
      subraceName: 'Clockwork Fexric - Fexric',
      title: 'The Guild-Jailer',
      reframe: `The guild-bound <LoreLink termId="fexrick">Clockwork Fexric</LoreLink>, the engineering heart of the known world, practice the Warden art as a *guild discipline*, a specialization with standards, certifications, and chain-graft specifications filed in the guild-archives. A Clockwork Fexric Warden is the tradition's most *consistent* variant: every graft performed to spec, every tether measured, every hold rated for load. Reliability over flair.`,
      signatureAbility: {
        name: 'Spec-Graft',
        description: `Chain-grafts are performed to exacting guild-specification, producing the most *reliable* tethers in the tradition, predictable load-ratings, known failure-points, documented maintenance schedules. The Clockwork Fexric never surprise themselves, which is both their strength (no catastrophic misjudgments) and their limit (no improvisation under novel threats).`
      },
      currentCrisisAngle: `The chardalyn-alloy crisis has split the Clockwork Fexric guilds down the middle: half have *certified* chardalyn chains as spec-compliant (dismissing the madness as "operational friction"), half have *condemned* them as a violation of guild safety-standards. The Clockwork Fexric Warden guilds are in open regulatory schism, and the documentation war is being fought with more ferocity than the actual abominations.`,
      signatureQuote: {
        text: '"My graft is filed. My tension is rated. My maintenance is logged. If the chain fails, the guild reimburses. If the abomination escapes, the guild does not. I have always preferred the chain\'s honesty."',
        speaker: 'Guild-Warden Fex-Korren',
        context: 'A Clockwork Fexric Warden, filing a chain-fatigue report before pursuing the escapee'
      }
    },

    skald_human: {
      subraceName: 'Skald',
      title: 'The Glacier-Chain',
      reframe: `The <LoreLink termId="skald">Skald</LoreLink> adopted the chain-graft through the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>'s surgical tradition, and they practice the Warden art as *glacier-hunting*: tethering the things that crawl out of the fjords, the glacier-revenants, the Stel. A Skald Warden's chains are cold-iron threaded through cold-hardened flesh, and their tolerance for low temperature makes them the tradition's arctic specialists.`,
      signatureAbility: {
        name: 'Glacier-Grip',
        description: `Tether-Tension holds longer in cold environments, the Skald's cold-iron chains contract and stiffen in low temperature, gripping harder the colder it gets. A Skald Warden fighting in a Nordhalla blizzard is nearly inescapable; the same Warden in a Sundale caldera finds their chains *loosening* in the heat.`
      },
      currentCrisisAngle: `The chardalyn madness is, for the Skald, a familiar flavor, they have always lived alongside the half-mad glacier-revenants they hunt. Several Skald Wardens have *volunteered* for chardalyn chains, arguing that a Skald's cold-hardened mind can withstand the whispers that break warmer peoples. Whether this is stoicism or hubris is being tested in the fjords, and the early results are not encouraging.`,
      signatureQuote: {
        text: '"My chains tighten in the cold and the cold is all Nordhalla has ever given me. The chardalyn whispers. So do the glacier-dead. I have been ignoring voices my whole career."',
        speaker: 'Glacier-Warden Skald-Haral',
        context: 'A Skald Warden, the first to accept chardalyn chains voluntarily'
      }
    },

    clean_vreken: {
      subraceName: 'Clean Vreken',
      title: 'The Glow-Tether',
      reframe: `The <LoreLink termId="vreken">Clean Vreken</LoreLink> adopted the chain-graft through proximity to the <LoreLink termId="bryngloom-forest">Bryngloom</LoreLink>'s deep operations, and their bioluminescence makes their tethers *visible*, a Clean Vreken Warden's chains glow along their length, mapping every tethered abomination's position in real time. The Clean Vreken are the tradition's *trackers*, their chains a living diagram of the battlefield's threats.`,
      signatureAbility: {
        name: 'Luminescent-Tether',
        description: `Tethered enemies are marked with bioluminescent chain-glow, visible through fog, cover, and darkness, the Clean Vreken Warden's tethers broadcast every hold to the entire party. The cost: the Warden's own position is equally illuminated, making them the priority target of every tethered foe.`
      },
      currentCrisisAngle: `The new, unnamed deep-grove entities (the Inquisitor crisis) glow in colors the Clean Vreken cannot parse, and when tethered, they do not register on the luminescent chain. A Clean Vreken Warden holding such an entity is *tethering blind*, unable to confirm the hold through their primary sense, and several have been pulled into the dark by things their chains could not properly mark.`,
      signatureQuote: {
        text: '"My chains glow so the party can see what I hold. This one does not glow. I am holding something the light refuses to describe. Tell the party to run, because I cannot tell them what I am holding."',
        speaker: 'Glow-Warden Yssen',
        context: 'A Clean Vreken Warden, holding an entity that would not light up'
      }
    },

    marked_vreken: {
      subraceName: 'Marked Vreken',
      title: 'The Mycelium-Leash',
      reframe: `The <LoreLink termId="vreken">Marked Vreken</LoreLink>, ghost-mycelium walkers, extend their tethers *through the Root-Veil itself*, the chain-graft interfacing with the mycelial network threading their skin. A Marked Warden does not merely hold an abomination with iron; they hold it with *the forest's own nervous system*, a leash miles long rooted in the <LoreLink termId="root_veil">Root-Veil</LoreLink>.`,
      signatureAbility: {
        name: 'Network-Leash',
        description: `Tethers can be *routed through the mycelial network*, extending the Warden's effective hold-range across connected terrain. A Marked Warden can hold an abomination that has fled the immediate battlefield, as long as it remains on Root-Veil-connected ground. The cost: the Warden feels every strain on the network as physical pain.`
      },
      currentCrisisAngle: `The Root-Veil has begun *rejecting* the Marked (the Plaguebringer crisis), expelling mycelium from their skin, and with it, the interface for their network-leashes. Marked Wardens are losing their signature ability as the forest casts them out, and several have begun *grafting iron chains directly into the expelling wounds*, forcing the interface to hold where the mycelium will not. The pain is, by all accounts, extraordinary.`,
      signatureQuote: {
        text: '"The forest used to hold what I could not. Now the forest spits me out, and I am driving iron into the wounds to keep the leash alive. I am tethering with scars. The forest will not forgive me, but it will hold."',
        speaker: 'Marked Warden Vesh',
        context: 'A Marked Vreken, driving a chain-graft into a mycelial wound'
      }
    }
  },

  id: "warden",
  name: "Warden",
  icon: "fas fa-link",
  role: "Melee Lockdown / Heavy Sentinel",
  damageTypes: ["smashing", "stabbing", "slicing", "blight"],

  // Overview section
  livingOrder: {
    orderName: 'The Bound',
    founder: {
      name: '<LoreLink termId="alaric">Alaric the Law-Keeper</LoreLink>',
      status: `Alive. The <LoreLink termId="groven">Groven</LoreLink> mine-guard who drove an ore-hauling chain through his own forearm into the largest Deep Alchemist specimen and held for three days still leads the Bound, the chain rusted into his bone, his regenerative Thrumm-derived biology keeping him functional seven centuries beyond a normal Groven lifespan. He said no to removing it then. He has said no every day since.`,
      note: `<LoreLink termId="alaric">Alaric</LoreLink> founded the Bound on a single principle: the Warden exists to ensure nothing is ever contained the way the Groven were contained in the vats. The chain is chosen, not inflicted. That distinction is the entire order.`
    },
    currentLeader: {
      name: '<LoreLink termId="alaric">Alaric the Law-Keeper</LoreLink>',
      title: 'The First Bound',
      characterization: `Ancient, immovable, and more iron than flesh, <LoreLink termId="alaric">Alaric</LoreLink>'s regenerative biology has integrated the chain so thoroughly that removing it would now kill him. He leads from <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>'s lower tunnels and trains every Warden personally in the graft-rite. He is grieved, specifically, by the chardalyn proposal: the alloy of his people's makers, offered as salvation.`
    },
    headquarters: { name: 'The Chain-Hold, Frostmaw Holdfast (lower tunnels)', locationId: 'frostmaw_holdfast' },
    crisisConnection: `<LoreLink termId="alaric">Alaric</LoreLink> is watching the Bound fracture along the same fault-line that defined his own founding: the Fexric Caustic Fexric propose chardalyn chains (the makers' metal), the Groven refuse (the vat-iron must be honored), and the iron that both factions depend on is becoming brittle in the Cragjaw cold. <LoreLink termId="alaric">Alaric</LoreLink> alone has the authority to settle the schism, and he is using it to refuse chardalyn absolutely, even as the brittle-iron casualties mount. The Bound are losing Wardens faster than <LoreLink termId="alaric">Alaric</LoreLink> can train them, and his principled refusal may be the order's epitaph.`
  },

  worldFriction: [
    { region: 'bryngloom-forest', status: 'employed', consequence: 'Atropolis bailiffs contract Wardens to chain and drag dangerous fugitives and rogue entities into subterranean vaults.', workaround: 'Show bounty warrants to gate-sentinels.' },
    { region: 'frostwood-reach', status: 'distrusted', consequence: 'Thalren hunters consider chain-tethering cruel and dangerous, fearing dragged monsters will destroy civilian livestock.', workaround: 'Avoid civilian pathways while escorting bound quarries.' },
    { region: 'sundale', status: 'revered', consequence: 'Forge-masters supply Wardens with hardened starlight-steel links to anchor caldera breach-monsters.', workaround: 'None needed in garrison districts.' },
    { region: 'emberspire', status: 'allied', consequence: 'Waste-Solari guards fight alongside Wardens, using iron chains to anchor giant magma-beasts in place.', workaround: 'Share captured quarry meat with local outposts.' }
  ],

  overview: {
    title: "The Warden",
    subtitle: "The Penitent Jailer & Nightmare Bound",

    quickOverview: {
      title: "Class Overview",
      content: `**Who they are**: The Warden is a grim penitent jailer who has grafted heavy iron chains directly into their own bones and flesh. You lock down the most dangerous monstrosities on the battlefield, forcing them into inescapable 1-on-1 duels where they are physically chained to you and cannot touch your allies.

**The hook**: Your signature mechanic is **Forced Tethering**: you drive iron chain-hooks into priority enemies, locking them in place and forcing them to attack only you while your party safely focuses them down.

**The resource bar & costs**: Your resource bar is **Tension (VP)**, generated through successful attacks, striking marked targets, evasions, and critical hits. You spend VP on bone-cracking chain strikes, Whirling Glaive AoE, Hunter's Resolve, and forced Cages of Vengeance.

**Bring one for**: Absolute, inescapable crowd control and lockdown, ensuring the most dangerous boss on the field cannot touch your fragile allies.`
    },

    roleplayIdentity: {
      title: "Roleplay Identity",
      content: `**HISTORY: THE GENESIS**
The Warden's calling was forged by Alaric the Law-Keeper, a Groven mine-guard who drove a mining chain through his own forearm to anchor a colossal abomination during the Vat-Breakers' revolt in the lower tunnels of <LoreLink termId="frostmaw_holdfast">Frostmaw Holdfast</LoreLink>. Over ten years, he and the Fexric chain-smiths refined the technique of grafting iron tethers directly into muscle and bone.

**CITIES & CIVIL RECEPTION**
Common folk in regional settlements find their rusted, skin-grafted chains and heavy iron bolts disturbing, often viewing them as zealots or walking cell blocks. They are tolerated only because they keep the absolute worst terrors of the deep from reaching the surface keeps.

**RACES & CULTURAL AFFILIATION**
The tradition is heavily practiced by the subterranean Morgh <LoreLink termId="groven">Groven</LoreLink> and the <LoreLink termId="fexrick">Fexric</LoreLink> Caustic Fexric who forge their iron links. However, it has spread to desperate <LoreLink termId="neth">Neth</LoreLink> archivists, <LoreLink termId="skald">Skald</LoreLink> glacier-hunters, and penitent <LoreLink termId="vreken">Vreken</LoreLink> who seek absolution by chaining themselves to the bog-horrors.

**NOTABLE FIGURES**
* **Alaric the Law-Keeper**: The first Warden who held the line for three days with a rusted chain driven through his forearm.
* **The Fexric Caustic Fexric Smiths**: The specialized chain-smiths of Frostmaw Holdfast who perform the flesh-grafting surgical rites.`
    },

    signatureQuote: {
      text: '"I drove the chain through my own shoulder so I could anchor the beast. The pain kept me conscious. The beast was surprised. We stood there for three hours, neither of us able to move, both of us bleeding. It was the most intimate moment of my life."',
      speaker: 'Alaric the Law-Keeper',
      context: 'From his training manual on Iron Chain Tethering, still used to train new Wardens'
    },

    philosophy: {
      coreTenet: 'A chain is not a tool of restraint. It is a tool of connection. When a Warden chains themselves to a monster, they are not trapping the monster, they are agreeing to share its fate. If it falls, they fall. If it bleeds, they feel it. The chain is a vow made of iron and flesh.',
      relationship: 'A Warden\'s power comes from the Iron Chain Tether, a chain physically grafted through their own body and anchored to their target. The tether is not magical; it is a medical fact. The hooks are driven through the bone. The chain is anchored to the skeleton. The pain is the source of the Warden\'s Tension, and the Tension is the source of their power.',
      paradox: 'The Warden controls their enemy by giving up control of themselves. They cannot release the tether at will, the hooks are too deep, the tension too great. Once anchored, the Warden is committed. They must win or die.'
    },

    originStory: `A warden is the Penitent Jailer. Iron chains are grafted directly into the forearms and spine, driven through living bone. The warden physically tethers to abominations, creating a forced duel where the tethered enemy cannot target anyone else. The chain is chosen, not inflicted. This distinction is the foundation of the entire tradition.

The first was Alaric the Law-Keeper, a Groven mine-guard stationed in the lower tunnels beneath Frostmaw Holdfast. During the Vat-Breakers' revolt, the Deep Alchemists' containment wards shattered and experiments poured into the tunnels. Alaric's squad was slaughtered in seconds. He survived by driving an ore-hauling chain through his own forearm and into the ribcage of the largest specimen, anchoring it to the tunnel wall with his body as the pin. He held it for three days. When rescue arrived, the chain had rusted into his bone and the creature had died of exhaustion. The Fexric Caustic Fexric smiths who cut him free asked if he wanted the chain removed. He said no.

Alaric's regenerative Thrumm-derived biology keeps him functional seven centuries beyond a normal Groven lifespan. He still leads the Bound from his anvil at Frostmaw. Every warden's first chain is forged there on the principle: "The chain is chosen, not inflicted."

Each subrace wears the chains for different reasons. The Morgh Groven invented the chain-graft. The chains echo the containment they shattered in the Vat-Breakers' revolt, worn voluntarily now to ensure nothing else is contained the way they were. The irony is the point. The Ithran Groven distribute tether-tension across multiple enemies through bridge-builder bone-knowledge, the only multi-target wardens. The Caustic Fexric re-tune chain configuration mid-combat as engineering, favoring lockdown or pursuit. The Clockwork Fexric practice as guild discipline with certified specifications and documented load-ratings, most consistent and most rigid. The Skald specialize in glacier-hunting, chains contracting and gripping harder in cold, the only wardens who have volunteered for chardalyn chains. The Clean Vreken mark tethered enemies with visible bioluminescence through fog and darkness, broadcasting their own position equally. The Marked Vreken route tethers through the Root-Veil, holding abominations miles away through connected terrain.

The chains are becoming brittle in the Cragjaw cold. The Caustic Fexric propose chardalyn-alloy replacement, stronger and lighter, but chardalyn causes madness with prolonged contact. Those who have accepted the new chains report hearing whispers at night. The Groven refuse to wear the metal of their creators. The Clockwork Fexric guilds are in open regulatory schism over certification. Alaric refuses chardalyn absolutely, even as brittle-iron casualties mount. The Bound are losing wardens faster than Alaric can train them.`,

    currentCrisis: `The chains are breaking. The iron used for traditional Iron Chain Tethers is failing, the cold of the Cragjaw Peaks has made the metal brittle, and tethers are snapping at critical moments. The Fexric Caustic Fexric have proposed a new alloy using recycled chardalyn fragments, which would be stronger and lighter. But chardalyn causes madness with prolonged contact. Wardens who accepted chardalyn chains report hearing whispers at night. Those who refused are running out of replacements for their old chains.`,

    meaningfulTradeoffs: `To be a Warden is to carry permanent scars. The tether hooks leave holes in the bone that never fully heal. A Warden can be identified by the pattern of scars on their arms, shoulders, and back, a map of every creature they have ever anchored. Old wounds remember; they hurt more when struck.`,

    classSpecificLocations: [
      {
        name: 'The Forge of Alaric',
        locationId: 'frostmaw-holdfast',
        description: 'The original blacksmith\'s forge where Alaric forged the first Iron Chain Tether chains. Still maintained by a line of Fexric Caustic Fexric smiths.',
        purpose: 'Chain forge and Warden initiation site',
        status: 'Active, struggling to meet demand for new chains'
      }
    ],

    combatRole: {
      title: "Combat Role",
      content: `**Primary Role**: Heavy-martial lockdown specialist and damage-absorbing anchor.

**Combat Strengths**:
- **Inescapable forced dueling**: The exclusive *Iron Chain Tether* creates an unbreakable 15-foot radius. The tethered enemy physically cannot target the Warden's allies.
- **Massive crowd control**: Able to lock down high-threat targets, preventing all teleportation and movement beyond the chain's reach.
- **Aggression-driven resource economy**: Tension scale with combat aggression, attacks, and evasions, feeding their most devastating close-range abilities.
- **Unrivaled tanking utility**: Keeps fragile allies completely safe from the tethered abomination.

**Combat Weaknesses**:
- **Shared Torment**: Because they are physically chained to the monster, they absorb 50% of all AoE or environmental damage that strikes their prisoner.
- **Agonizing Recoil**: If they tether a beast of vastly superior strength or speed, they are helplessly dragged across the battlefield, suffering massive smashing damage (1d10 per 10 feet dragged).
- **Hard-coded Wyrd Vulnerability**: Constant proximity to Wyrd-horrors fractures their mind, causing them to take +50% wyrd damage.
- **Zero Ranged Attacks**: Completely helpless at distance; they must reel targets in or walk them down in heavy iron.
- **Agonizing Cast Costs**: Establishing tethers or reelings requires sacrificing their own HP (1d6 blight/piercing to self) as the grafted hooks tear through flesh.
- **Marked Penitent (social)**: your rusted, skin-grafted chains and bolt-scars mark you as a walking cell-block  -  common folk find you disturbing, read you as a zealot, and your scar-map broadcasts every horror you have ever anchored; old wounds remember and ache worse when struck again.`,
    },

    playstyle: {
      title: "Playstyle & Strategy",
      content: `**Tension (VP) Management**:
Warden combat is a high-wire balancing act of pursuit and control. Tension cap at 10. You must constantly manage your VP:
- **Pursuit and Strike**: Start combat by marking priority targets and striking with your melee weapons (+1 to +2 VP per hit).
- **Relentless Momentum**: Build VP by landing attacks, evading blows (+1 VP), and scoring critical hits (+2 VP).
- **Spend to Subdue**: Consume VP to activate heavy defensive braces (*Hunter's Resolve*, 4 VP), devastating strikes (*Whirling Glaive*, 3 VP), or inescapable cages (*Cage of Vengeance*, 6 VP [4 VP Jailer]).
- **Avatar of Vengeance**: Save 10 VP to enter *Avatar of Vengeance* (ultimate transformation), where the Warden's form radiates retributive power, leaping across the battlefield and crushing locked foes.

**The Fatal Drag**:
Be wary of tethering high-strength targets. If they move, you are dragged. Use *Hunter's Resolve* to steel your body and resist displacement, or suffer the bludgeoning recoil of being dragged across the gravel.`
    },
    immersiveCombatExample: {
      title: "Combat Example: The Retributive Hunter",
      content: `**The Setup**: You are a Warden locking down a dangerous abomination. Starting VP: 0. HP: 90/90.
**Turn 1**: Mark target and strike with melee glaive (Hit: +2 VP).
**Turn 2**: Evade retaliation (+1 VP), land secondary strike (+2 VP). VP = 5/10. Spend 3 VP on Whirling Glaive (+AoE damage). VP = 2/10.
**Turn 3**: Counter-attack and build to 10 VP, activating Avatar of Vengeance to finish the encounter.`,
    },
  },

  // Resource System
  resourceSystem: {
    title: "Tension: The Stretched Chain",
    subtitle: "How Your Resource Works (Beginner's Guide)",

    description: `**1. What is it? (The Stretched Chain)**
Tension (0–10) builds in the cold-iron chains driven through your forearms when you tether a monster into a 15ft forced duel.

**2. How do I build it?**
- Drive a cold-iron chain into a priority enemy to establish a 15ft Tether.
- Tension rises by +1 to +2 every time the tethered target attempts to move away or attacks someone other than you.

**3. How do I spend it & what is the catch?**
- Spend Tension to violently reel the target across broken ground, slam them prone, or lock them in an iron cage.
- **The Catch (Tether Snap)**: If the tethered target manages to break the chain through extreme distance or force, the recoil stuns you for 1 turn.`,

    cards: [
      {
        title: "Tension (0-10)",
        stats: "10 VP Max | Gain on Attack/Mark/Evade/Crit",
        details: "Tension represent your escalating focus on bringing judgment to your quarry. Generating VP fuels both your mobility and your most devastating retributive techniques."
      },
      {
        title: "Pursuit Movement",
        stats: "+5ft Speed per VP (Max +50ft)",
        details: "Each point of banked Tension increases your movement speed toward your marked quarry by +5ft, allowing you to relentlessly close distance and prevent escape."
      },
      {
        title: "Retributive Spends",
        stats: "2 to 10 VP Costs",
        details: "Spend 2 VP on Vengeful Strike (+2d6 damage), 3 VP on Whirling Glaive (AoE), 4 VP on Hunter's Resolve (healing + DR), 6 VP on Cage of Vengeance (4 VP for Jailer), or 10 VP on Avatar of Vengeance."
      }
    ],

    usage: {
      momentum: "Mark your high-priority quarry early to gain +2 VP on subsequent attacks. Build VP rapidly with melee strikes and evasions, then consume VP on defensive sustain or area lockdown as the fight demands.",
      flourish: "Avatar of Vengeance is your ultimate retributive window. Consuming 10 VP elevates you into an unstoppable harbinger of justice, leaping across the battlefield and shredding restrained foes."
    },

    overheatRules: {
      title: "Vengeance Escalation",
      content: `Managing your Tension determines your combat flow:

**0-3 VP (Gathering Retribution)**:
Standard combat state. You are actively hunting your mark and building retributive momentum.

**4-7 VP (Relentless Pursuit)**:
Gaining +20ft to +35ft speed toward your marked quarry. Your offensive and defensive techniques become fully primed.

**8-10 VP (Maximum Retribution)**:
Peak vengeance. High pursuit speed (+40ft to +50ft) and sufficient VP to execute ultimate abilities like Cage of Vengeance or enter the Avatar of Vengeance.`
    },

    resourceTables: [
      {
        title: "Tension Generation",
        headers: ["Action", "VP Gained", "Notes"],
        rows: [
          ["Successful Melee Attack", "1 VP", "Base generation on landed hit"],
          ["Attack against Marked Target", "2 VP", "Bonus generation against designated quarry"],
          ["Successful Evasion / Dodge", "1 VP", "Turn defense into retributive opening"],
          ["Critical Hit", "2 VP", "Extra momentum from decisive impact"]
        ]
      },
      {
        title: "Tension Expenditure",
        headers: ["Cost", "Ability", "Effect"],
        rows: [
          ["2 VP", "Vengeful Strike", "Empower strike with +2d6 damage"],
          ["3 VP", "Whirling Glaive", "Spinning sweep hitting all adjacent enemies"],
          ["4 VP", "Hunter's Resolve", "Restore health and gain damage reduction"],
          ["6 VP (4 VP Jailer)", "Cage of Vengeance", "Imprison target in retributive iron cage"],
          ["10 VP", "Avatar of Vengeance", "Ascend into retributive avatar with leap attacks"]
        ]
      }
    ]
  },

  // Character Creation
  characterCreation: {
    title: "Creating a Warden",
    subtitle: "Forging the Penitent Anchor",

    abilityPriorities: {
      primary: "Agility",
      primaryDesc: "Fuels your accuracy with heavy chains, your Dodge rate, and physical coordination.",
      secondary: "Constitution",
      secondaryDesc: "Vital for surviving the agonizing self-inflicted wounds and Shared Torment of the tether.",
      tertiary: "Spirit",
      tertiaryDesc: "Determines your resistance to mental fractures and the saving throw DC of your iron gaols."
    },

    startingEquipment: {
      weapons: [
        {
          name: "Tension",
          damage: "2d6 slashing or bludgeoning",
          properties: "Heavy-martial, grafted to forearms. 15-foot range. Cannot be disarmed or removed."
        }
      ],
      armor: [
        {
          name: "Iron Jailer Plate",
          armor: "15 + agility modifier (max +2)",
          properties: "Heavy iron plate bolted directly to the shoulders. -10ft base speed penalty."
        }
      ],
      gear: [
        "Inquisitorial bone saw and grafting tools",
        "Rusted lockpicks and manacles",
        "Tomb-dust incense (to numb the nerves)",
        "Pouch with 10 tarnished coins"
      ]
    },

    startingStats: {
      hp: "12 + Constitution modifier",
      hitDice: "1d12 per Warden level",
      armor: "15 + agility modifier (max +2) (Iron Jailer Plate)",
      speed: "20 ft (heavy plate penalty included)",
      savingThrows: ["Agility", "Constitution"],
      skills: [
        "Choose 3 from: Athletics, Insight, Intimidation, Perception, Religion, Survival"
      ]
    },

    startingAbilities: [
      {
        name: "Iron Chain Tether",
        type: "Action",
        desc: "Drive iron chains into target within 15ft, locking them to your radius. Generates 2 VP."
      },
      {
        name: "Chain Graft",
        type: "Passive",
        desc: "Melee reach is 15ft. Attacks have +1 to hit. Cannot use ranged weapons."
      },
      {
        name: "Iron Brace",
        type: "Reaction",
        desc: "+2 DR against an attack. Miss or hit, gain 1 VP."
      },
      {
        name: "Vengeful Strike",
        type: "2 VP",
        desc: "Empower next strike, dealing +2d6 damage."
      }
    ],

    specializationChoice: {
      level: 3,
      description: "At 3rd level, choose your path of penance: Iron Stalker (stealth/bleed), Iron Jailer (mass lockdown/cages), Relentless Tormentor (inescapable drag/crush), or Monolith (gravitational immovability/calcified defense)."
    },

    levelProgression: {
      title: "Warden Level Progression",
      headers: ["Level", "VP Max", "Feature Unlocked"],
      rows: [
        ["1", "10", "Iron Chain Tether, Chain Graft, Iron Brace, Vengeful Strike"],
        ["2", "10", "Whirling Glaive, Hunter's Resolve"],
        ["3", "10", "Specialization Choice + Spec Passives"],
        ["4", "10", "Ability Score Improvement"],
        ["5", "10", "Avatar of Vengeance (Ultimate Transformation)"],
        ["6", "10", "Iron Storm, Gaol Shatter"],
        ["7", "10", "Reel and Execute, Hunter's Wrath, Grave-Iron Cage"],
        ["8", "10", "Ability Score Improvement, Ascendant Jailer, Eternal Iron Tomb, Iron Lash"],
        ["9", "10", "Penitent Judgment, Mass Imprisonment, Inescapable Shackle"],
        ["10", "10", "Avatar of Vengeance Perfected, Cataclysm of Iron, Iron Prison Realm"]
      ]
    }
  },

  // Specializations
  specializations: {
    title: "Warden Paths of Penance",
    subtitle: "Four Modes of Torment",

    description: "Every Warden chooses a path of physical penance, tuning their iron grafts to perform specific, terrifying functions of lockdown, execution, or stealth.",

    sharedPassive: {
      name: "Cruel Tracker",
      icon: "Piercing/Targeted Strike",
      description: "You have advantage on Survival and Perception checks to track creatures. Your rusted chains drag behind you, carving a deep groove in the soil."
    },

    specs: [
      { id : "shadowblade",
        name: "Iron Stalker",
        icon: "Piercing/Night Dagger",
        color: "#2E0854",
        theme: "Pain-Channeled Stealth",
        description: "The Iron Stalker blends in the shadows not through grace, but through complete stillness and numbed flesh. They strike silently, dragging victims into the dark to rip them apart.",
        playstyle: "Stealth-based lockdown and bleed assassin, striking from silence with devastating flails.",
        strengths: [
          "Highest burst damage of all Warden specs",
          "Attacks from stealth generate +1 VP (total 3 VP)",
          "Agonizing silence hides them after spending VP",
          "Devastating bleed and blight synergy"
        ],
        weaknesses: [
          "Requires stealth setup for maximum effectiveness",
          "Lower sustained survivability than Relentless Tormentor",
          "Fewer mass-control options than Iron Jailer",
          "Agonizing recoil when stealth is broken"
        ],
        passiveAbilities: [
          {
            name: "Crushing Ambush",
            icon: "Utility/Hide",
            description: "Attacks from stealth generate +1 VP (total 3 VP) and deal +1d8 bleed damage. You can hide for 1 action point after a successful strike."
          },
          {
            name: "Shed the Coil",
            icon: "Psychic/Mind Control",
            description: "After spending 3 or more VP on an ability, you dissolve into shadow-smoke, becoming invisible for 1 round. Breaks if you attack."
          }
        ],
        recommendedSpells: [
          "Chain Leap - Leap from stealth to lock chains around prey",
          "Chained Shadow Assault - Ultimate stealth-fused chain frenzy",
          "Pain-Fueled Flail - Basic stealth strike generating high VP",
          "Iron Chain Tether - Crucial to anchor targets before they run"
        ]
      },
      { id : "jailer",
        name: "Iron Jailer",
        icon: "Necrotic/Crossed Bones",
        color: "#4A5568",
        theme: "Spectral Iron Cages",
        description: "The Iron Jailer projects their inner torment outward, summoning heavy, spectral iron bars to cage multiple enemies and isolate them from the battlefield.",
        playstyle: "Heavy crowd control and sentinel defense, caging high-threat targets to contain the battlefield.",
        strengths: [
          "Reduced cage costs (4 VP instead of 6)",
          "Enemies trapped in cages take +1d6 damage from all sources",
          "Can maintain up to 2 cages simultaneously",
          "Unrivaled area control"
        ],
        weaknesses: [
          "Lower direct single-target damage",
          "Cages can be broken by high-Strength giants",
          "Extremely slow base speed (-15ft speed penalty)",
          "Requires heavy VP management for multi-cages"
        ],
        passiveAbilities: [
          {
            name: "Master Jailer",
            icon: "Psychic/Mind Control",
            description: "Iron Gaol costs -2 VP (4 VP instead of 6). You can maintain up to 2 spectral iron cages simultaneously."
          },
          {
            name: "Condemned in Steel",
            icon: "Necrotic/Necrotic Skull",
            description: "Enemies trapped in your cages take +1d6 damage from all sources. If caged targets are marked quarry, they take an additional +1d6 damage."
          }
        ],
        recommendedSpells: [
          "Iron Gaol - Core cage control at reduced cost",
          "Conductive Torment - Chain kinetic feedback between caged foes",
          "Coliseum of Iron - Ultimate area cage lockdown",
          "Sweeping Chains - Cone bludgeoning to herd enemies into cages"
        ]
      },
      { id : "vengeance-seeker",
        name: "Relentless Tormentor",
        icon: "Slashing/Cross Slash",
        color: "#8B0000",
        theme: "Inescapable Drag & Crush",
        description: "The Relentless Tormentor uses their massive weight and absolute physical stubbornness to drag enemies across the gravel, crushing their bones against stone.",
        playstyle: "Displacement tank and relentless pursuer, dragging enemies helplessly and dealing massive smashing damage.",
        strengths: [
          "Marked targets cannot escape or teleport out of line of sight",
          "Free dashes (reels) to tethered prey",
          "Absorbs and resists displacement effects",
          "Extended Avatar of Vengeance duration"
        ],
        weaknesses: [
          "Completely dependent on Iron Chain Tether for mobility",
          "Suffers high bludgeoning self-damage when dragged by giants",
          "Absorbs high percentages of shared AoE damage",
          "Zero ranged capability and cannot chase fleeing enemies"
        ],
        passiveAbilities: [
          {
            name: "Inexorable Reel",
            icon: "Nature/Sense",
            description: "Tethered targets cannot hide, become invisible, or teleport while in your line of sight. Dashing (reeling) to them costs no action points, and your movement speed toward them increases by +5ft per VP (max +50ft)."
          }
        ],
        recommendedSpells: [
          "Cruel Drag - Reel yourself to the target and strike",
          "Spined Torment - Massive crushing blows against tethered prey",
          "Avatar of Vengeance - Long-lasting ultimate engine of retribution",
          "Iron Chain Tether - Absolutely mandatory for all mobility"
        ]
      },
      { id : "monolith",
        name: "Monolith",
        icon: "Nature/Strangle",
        color: "#533C33",
        theme: "Gravitational Immovability",
        description: "The Monolith Penitent grafts volcanic iron into their skeletal structure, fusing the penitent jailer tradition with the calcified juggernaut arts of the Emberspire forge-clans. Their chains do not merely tether enemies; they anchor the Monolith to the earth itself, weaponizing bone density and localized gravity to become an immovable stone sentinel.",
        playstyle: "Extreme defensive body-blocking and gravitational control, sacrificing all mobility to become an unbreakable battlefield anchor.",
        strengths: [
          "Converts Tension into Calcified Armor at a 1:1 ratio (up to +10 DR)",
          "Tethered targets cannot drag the Monolith due to gravitational anchoring",
          "Absorbs 75% of AoE damage directed at tethered targets instead of 50%",
          "Unrivaled chokepoint defense and damage interception"
        ],
        weaknesses: [
          "Movement speed is permanently reduced by 15 ft due to calcified joints",
          "Cannot benefit from Dodge while calcified",
          "Catastrophic vulnerability to blight damage (+50% damage, dissolves Calcified Armor)",
          "Zero ranged capability and cannot chase fleeing enemies"
        ],
        passiveAbilities: [
          {
            name: "Ossified Anchor",
            icon: "Nature/Strangle",
            description: "When you spend Tension, convert the spent amount into temporary Calcified Armor (DR bonus, max +10). Calcified Armor decays by 2 at the start of each turn. You cannot be dragged by tethered targets while you have Calcified Armor active."
          }
        ]
      }
    ],
  },

  // Combined level 1-10 meticulously normalized spells list
  exampleSpells: [
    ...UTILITY_SPELLS,
    // SIGNATURE UTILITY SPELLS (CLASSIC WOW UTILITY NICHE)
    { id: "warden_chain_tether",
      name: "Chain Tether",
      description: "Drive rusted forearm chains into a target up to 30 ft away, pinning them in place for 1 minute on a failed Spirit Save.",
      level: 2,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: { school: "smashing", icon: "Utility/Utility", tags: ["utility", "control", "hold_person", "warden"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["utility", "control", "warden"]
    },
    { id: "warden_chain_drag",
      name: "Chain Drag",
      description: "Lash chains around a target and yank them 20 ft toward you, interrupting their action.",
      level: 1,
      spellType: "ACTION",
      icon: "Utility/Utility",
      typeConfig: { school: "smashing", icon: "Utility/Utility", tags: ["utility", "pull", "chain", "warden"], castTime: 1, castTimeType: "IMMEDIATE" },
      targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30, targetRestrictions: ["enemy"] },
      resourceCost: { actionPoints: 1, mana: 0 },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["utility", "pull", "warden"]
    },
    { id : "warden_evasive_maneuvers",
      name: "Iron Brace",
      description: "When targeted by an attack, brace your armor and brace the chains. Gain a DR bonus. Whether the attack lands or misses, you gain 1 Tension by evading or absorbing the strike.",
      spellType: "REACTION",
      icon: "Utility/Parry",
      level: 1,
      specialization: "universal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "smashing",
        icon: "Utility/Parry",
        tags: ["buff", "defense", "reaction", "universal"],
        castTime: 1,
        castTimeType: "REACTION"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      resourceCost: {
        actionPoints: 1,
        mana: 0
      },
      buffConfig: {
        buffType: "damageMitigation",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
           { id : "braced_defense",
             name: "Braced",
             description: "DR increased by +2 against the triggering attack."
           }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["buff", "defense", "reaction", "universal"]
    },
    { id : "warden_glaive_mastery",
      name: "Chain Graft",
      description: "Your arms are grafted to heavy iron chains. Your melee reach is permanently increased to 15 feet and your chain attacks have +1 to hit. However, you are strictly forbidden from wielding or using ranged weapons.",
      spellType: "PASSIVE",
      icon: "Slashing/Curved Blade",
      level: 1,
      specialization: "universal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "smashing",
        icon: "Slashing/Curved Blade",
        tags: ["passive", "buff", "universal"],
        castTime: 0,
        castTimeType: "PASSIVE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self"
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], actionPoints: 0,
        mana: 0,
        resourceTypes: ["tension"],
        resourceValues: { tension: 0 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        effects: [
          { id : "chain_reach",
            name: "Chain Reach",
            description: "Melee reach is 15 feet. Cannot use ranged weapons.",
            statModifier: {
              stat: "melee_range",
              magnitude: 15,
              magnitudeType: "flat"
            }
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["passive", "buff", "universal"]
    },

    // ==========================================
    // LEVEL 2 SPELLS
    // ==========================================
    { id : "warden_shadow_ambush",
      name: "Chain Leap",
      description: "Leap from stealth, throwing rusted chains directly into the target. You cannot teleport — you must physically travel through the air, risking opportunity attacks.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 2,
      specialization: "shadowblade",
      effectTypes: ["damage"],
      typeConfig: {
        school: "blight",
        icon: "Piercing/Night Dagger",
        tags: ["blight", "damage", "mobility", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 25,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], actionPoints: 1,
        mana: 0,
        resourceTypes: ["tension"],
        resourceValues: { tension: 0 },
        classResource: { type: "tension", cost: -2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d8 + agility",
        damageTypes: ["blight"],
        resolution: "DICE"
      },
      specialMechanics: {
        physicalLeap: {
          description: "This is a physical jump through the air, not a teleport. Invites opportunity attacks."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["blight", "damage", "mobility", "shadowblade"]
    ,

  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_relentless_pursuit",
      name: "Cruel Drag",
      description: "Manually lock your gears and reel in. Dash directly to your tethered target, slamming into them with a colossal shield/body check. If they are lighter than you, they are dragged 10 feet toward you instead.",
      spellType: "ACTION",
      icon: "Nature/Sense",
      level: 2,
      specialization: "vengeance-seeker",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "smashing",
        icon: "Nature/Sense",
        tags: ["physical", "damage", "drag", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 2 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + constitution",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "chain_drag", name: "Chain Reel", description: "Dash directly to the tethered target." }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["physical", "damage", "drag", "vengeance-seeker"]
    ,

  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_whirling_glaive",
      name: "Sweeping Chains",
      description: "Whirl your heavy chains in a sweeping 15-foot cone, crushing bone and slowing all targets caught in the metal tempest.",
      spellType: "ACTION",
      icon: "Piercing/Dagger Rain",
      level: 2,
      specialization: "universal",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "smashing",
        icon: "Piercing/Dagger Rain",
        tags: ["physical", "damage", "aoe", "slow", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "cone",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 3 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 3 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + strength/2",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "movementImpairment",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "slowed_chains",
            name: "Entangled Slow",
            description: "Movement speed reduced by 15 feet by wrapping chains."
          }
        ],
        statPenalties: [
          { stat: "movement_speed", magnitude: -15, magnitudeType: "flat" }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
      tags: ["physical", "damage", "aoe", "slow", "universal"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_whirling_glaive_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 3 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_hunters_resolve",
      name: "Penitent Resolve",
      description: "Dig the grafted spine hooks deeper, welcoming the pain to brace your armor. Gain 50% damage resistance and DR. The benefits are doubled if the tethered target is within 15 feet, anchoring you completely.",
      spellType: "ACTION",
      icon: "Utility/Deflecting Shield",
      level: 2,
      specialization: "universal",
      effectTypes: ["buff"],
      typeConfig: {
        school: "smashing",
        icon: "Utility/Deflecting Shield",
        tags: ["buff", "defense", "resistance", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 4 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 4 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "damageMitigation",
        durationValue: 2,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
           { id : "penitent_resist",
             name: "Enduring Bulwark",
             description: "Gain 50% damage resistance and +4 DR against all incoming smashing damage."
           }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["buff", "defense", "resistance", "universal"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_hunters_resolve_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 4 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},

    // ==========================================
    // LEVEL 3 SPELLS
    // ==========================================
    { id : "warden_cage_of_vengeance",
      name: "Iron Gaol",
      description: "Spend Tension to erupt spectral iron bars around your target, trapping them in a brutal cage. They physically cannot move out of the cage or benefit from teleportation. Caged targets take additional damage.",
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      level: 3,
      specialization: "jailer",
      effectTypes: ["control", "debuff"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Crossed Bones",
        tags: ["blight", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 6 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 6 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "restraint",
        duration: 3,
        durationUnit: "rounds",
        effects: [
          { id: "iron_gaol_restraint",
            name: "Iron Hold",
            description: "Spectral iron bars erupt around the target. Speed becomes 0, teleportation is blocked, and the caged target takes +1d6 damage from all sources.",
            config: { restrainttype: "smashing", breakOnDamage: false, condition: "restrained", blocksMovement: true, blocksTeleport: true }
          },
        ],
        savingThrow: { ability: "constitution", difficultyClass: 15, saveOutcome: "reduced_duration" },
      },
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        savingThrow: {
          ability: "constitution",
          difficultyClass: 15,
          saveOutcome: "reduced_duration"
        },
        effects: [
          { id : "iron_caged",
            name: "Imprisoned in Steel",
            description: "Caged in rusted iron. Speed is 0, cannot teleport, and takes +1d6 damage from all sources.",
            statusType: "restrained",
            level: "strong"
          }
        ]
      },
      specialMechanics: {
        jailerReduction: {
          description: "Jailer specialization reduces the cost of this spell to 4 Tension."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["blight", "control", "cage", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_cage_of_vengeance_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 6 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_hunters_fury",
      name: "Spined Snare",
      description: "A brutal, agonizing downward smash with your chains. If the target is tethered to you, the strike rips their joints, dealing devastating smashing damage and tearing their muscles.",
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",
      level: 3,
      specialization: "vengeance-seeker",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Slashing/Cross Slash",
        tags: ["physical", "damage", "tether-synergy", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 3 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 3 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "4d6 + strength",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      specialMechanics: {
        tetherBonus: {
          description: "Deals +2d6 smashing damage if the target is tethered via Iron Chain Tether."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "tether-synergy", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_hunters_fury_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 3 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_spectral_strike",
      name: "Necrotic Piercing",
      description: "Phase your chains slightly into the shadow realm, driving them through armor and bone to deal direct blight damage to the target's internal organs.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 3,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "blight",
        icon: "Piercing/Night Dagger",
        tags: ["blight", "damage", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 2 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "3d8 + spirit",
        damageTypes: ["blight"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
      tags: ["blight", "damage", "universal"]
    ,

  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_cage_trap",
      name: "Spiked Chain Trap",
      description: "Lay a coiled, heavy chain trap in a small area. When an enemy steps into it, the trap springs violently, driving hooks into their legs and caging them.",
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      level: 3,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "smashing",
        icon: "Necrotic/Crossed Bones",
        tags: ["physical", "control", "trap", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 2,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 4 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 4 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "incapacitation",
        duration: 2,
        durationUnit: "rounds",
        savingThrow: {
          ability: "agility",
          difficultyClass: 14
        },
        effects: [
          { id : "trapped_cage",
            name: "Spike-Bound",
            description: "Restrained by coiled spikes. Speed is 0."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["physical", "control", "trap", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_cage_trap_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 4 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},

    // ==========================================
    // LEVEL 4 SPELLS
    // ==========================================
    { id : "warden_chain_lightning",
      name: "Conductive Bind",
      description: "Send a massive kinetic shockwave through your chains, jumping to all caged or linked targets and shattering their bones.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 4,
      specialization: "jailer",
      effectTypes: ["damage"],
      typeConfig: {
        school: "blight",
        icon: "Psychic/Mind Control",
        tags: ["blight", "damage", "chain", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "chain",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 2 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 2 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "2d6 + spirit",
        damageTypes: ["blight"],
        resolution: "DICE"
      },
      propagation: {
        method: "chain",
        behavior: "bounce",
        count: 4,
        range: 15,
        decay: 0.8
      },
      specialMechanics: {
        conductiveBonus: {
          description: "Trapped or caged targets take an additional +1d6 blight damage."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["blight", "damage", "chain", "jailer"]
    ,

  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_vengeful_leap",
      name: "Vicious Reel",
      description: "Manually winch your arm-grafted spool. Launch yourself directly toward your tethered prey. This is a heavy, physical reel; you provoke opportunity attacks along the path.",
      spellType: "ACTION",
      icon: "Nature/Sense",
      level: 4,
      specialization: "vengeance-seeker",
      effectTypes: ["damage", "utility"],
      typeConfig: {
        school: "smashing",
        icon: "Nature/Sense",
        tags: ["physical", "damage", "mobility", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 40,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 3 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 3 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "5d6 + agility",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      utilityConfig: {
        utilityType: "movement",
        selectedEffects: [
          { id : "chain_reel", name: "Chain Winch", description: "Leap directly to your tethered prey." }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
      tags: ["physical", "damage", "mobility", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_vengeful_leap_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 3 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},

    // ==========================================
    // LEVEL 5 SPELLS
    // ==========================================
    { id : "warden_umbral_assault",
      name: "Chained Shadow Assault",
      description: "Dissolve your physical form into a mist of cold iron and shadow, strike three separate targets with crushing lashings, and disappear back into silence.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 5,
      specialization: "shadowblade",
      effectTypes: ["damage", "buff"],
      typeConfig: {
        school: "blight",
        icon: "Psychic/Mind Control",
        tags: ["blight", "damage", "stealth", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 1,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 10 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 10 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "6d8 + agility",
        damageTypes: ["blight"],
        resolution: "DICE"
      },
      buffConfig: {
        buffType: "triggeredEffect",
        durationValue: 1,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "shadow_invis",
            name: "Umbral Veil",
            description: "Become completely invisible for 1 round."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["blight", "damage", "stealth", "shadowblade"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_umbral_assault_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 10 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_prison_of_eternity",
      name: "Coliseum of Iron",
      description: "Erupt a massive circular arena of heavy iron pillars in a 20-foot area, caging all enemies inside. Teleportation is blocked completely.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 5,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        tags: ["blight", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 10 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 10 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "zone",
        duration: 4,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16
        },
        effects: [
          { id : "coliseum_imprisoned",
            name: "Bound in Coliseum",
            description: "Trapped in the iron zone. Cannot escape."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["blight", "control", "cage", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_prison_of_eternity_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 10 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_avatar_of_vengeance",
      name: "Iron Ascendancy",
      description: "Unleash all tension to fuse your presence with your rusted iron grafts. Your chains burst outward, forming a defensive cage of spikes around your forearms and torso. For 6 rounds, gain +4 DR, add +2d6 smashing damage to every strike, and reel in all tethered targets helplessly.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 5,
      specialization: "vengeance-seeker",
      effectTypes: ["buff"],
      typeConfig: {
        school: "blight",
        icon: "General/Fiery Rage",
        tags: ["blight", "buff", "transformation", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 6,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 10 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 10 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "triggeredEffect",
        durationValue: 6,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
           { id : "iron_ascendancy_transformation",
             name: "Ascendant Form",
             description: "Gain +4 DR, +2d6 smashing damage, and generate +1 Tension on hit."
           }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 10 },
      tags: ["blight", "buff", "transformation", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_avatar_of_vengeance_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 10 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},

    // ==========================================
    // LEVEL 6 SPELLS
    // ==========================================
    { id : "warden_glaive_storm",
      name: "Iron Storm",
      description: "Whirl your heavy chains in a furious tempest, hitting all enemies in a 20-foot cone multiple times with bone-shattering force.",
      spellType: "ACTION",
      icon: "Piercing/Dagger Rain",
      level: 6,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Piercing/Dagger Rain",
        tags: ["physical", "damage", "aoe", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "cone",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 5 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 5 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "8d6 + strength",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["physical", "damage", "aoe", "universal"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_glaive_storm_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 5 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_cage_slam",
      name: "Gaol Shatter",
      description: "Slam a caged target with your heavy steel chain-spool, dealing immense smashing damage and shattering their resolve, which extends the cage's duration by 1 round.",
      spellType: "ACTION",
      icon: "Psychic/Mind Control",
      level: 6,
      specialization: "jailer",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Psychic/Mind Control",
        tags: ["physical", "damage", "cage-synergy", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 4 },
        actionPoints: 1,
        classResource: { type: "tension", cost: 4 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "6d10 + strength",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      specialMechanics: {
        cageExtend: {
          description: "If the target is currently caged or trapped, extend that duration by 1 round."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 3 },
      tags: ["physical", "damage", "cage-synergy", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_cage_slam_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 4 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},

    // ==========================================
    // LEVEL 7 SPELLS
    // ==========================================
    { id : "warden_mark_execution",
      name: "Reel and Execute",
      description: "Winch the gears to drag a heavily wounded tethered target (below 30% health) directly into your blade. Delivers a guaranteed critical strike.",
      spellType: "ACTION",
      icon: "Piercing/Targeted Strike",
      level: 7,
      specialization: "vengeance-seeker",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Piercing/Targeted Strike",
        tags: ["physical", "damage", "execute", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 7 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 7 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "8d10 + agility",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE",
        criticalConfig: {
          enabled: true,
          critMultiplier: 2,
          critRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        }
      },
      specialMechanics: {
        executionThreshold: {
          description: "Can only be cast on tethered targets below 30% health."
        }
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["physical", "damage", "execute", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_mark_execution_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 7 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_shadow_cage",
      name: "Grave-Iron Cage",
      description: "Summon a dense cage of shadow-infused graveyard iron. Restrains all targets in a 15-foot radius and blocks all forms of dimensional escape.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 7,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        tags: ["blight", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 6 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 6 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "zone",
        duration: 3,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 16
        },
        effects: [
          { id : "grave_caged",
            name: "Grave Caged",
            description: "Restrained. Speed is 0 and teleportation blocked."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["blight", "control", "cage", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_shadow_cage_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 6 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_hunters_wrath",
      name: "Jailer's Wrath",
      description: "Deliver a devastating series of flailing attacks against a single tethered target, grinding the rusted chains back and forth through their flesh.",
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",
      level: 7,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Slashing/Cross Slash",
        tags: ["physical", "damage", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 5 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 5 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "10d6 + agility",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 4 },
      tags: ["physical", "damage", "universal"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_hunters_wrath_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 5 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},

    // ==========================================
    // LEVEL 8 SPELLS
    // ==========================================
    { id : "warden_vengeance_incarnate",
      name: "Ascendant Jailer",
      description: "Harness all pain. Gain colossal speed toward your tethered target, +3d8 damage, and automatically generate Tension whenever you are struck.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 8,
      specialization: "vengeance-seeker",
      effectTypes: ["buff"],
      typeConfig: {
        school: "blight",
        icon: "General/Fiery Rage",
        tags: ["blight", "buff", "transformation", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 8 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 8 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        durationValue: 4,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
           { id : "ascendant_jailer_buff",
             name: "Unstoppable Will",
             description: "+3d8 damage and massive armor."
           }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 8 },
      tags: ["blight", "buff", "transformation", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_vengeance_incarnate_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 8 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_eternal_cage",
      name: "Eternal Iron Tomb",
      description: "Summon a permanent prison of cursed dungeon iron. The target is locked in place indefinitely until the Warden chooses to dispel it or dies.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 8,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        tags: ["blight", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 30,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 99,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 8 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 8 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "incapacitation",
        duration: 99,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 18
        },
        effects: [
          { id : "eternal_imprisoned",
            name: "Eternal Tomb",
            description: "Restrained indefinitely. Speed is 0."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 10 },
      tags: ["blight", "control", "cage", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_eternal_cage_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 8 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_relentless_assault",
      name: "Iron Lash",
      description: "Lash out repeatedly with heavy chains, building 1 Tension with each hit as you relentlessly pursue your mark.",
      spellType: "ACTION",
      icon: "Bludgeoning/Mortal Strike",
      level: 8,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Bludgeoning/Mortal Strike",
        tags: ["physical", "damage", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 6 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 6 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "12d6 + strength",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["physical", "damage", "universal"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_relentless_assault_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 6 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},

    // ==========================================
    // LEVEL 9 SPELLS
    // ==========================================
    { id : "warden_justice_strikes",
      name: "Penitent Judgment",
      description: "Deliver a crushing chain slam to your tethered prey, shattering their armor and causing massive internal bleeding.",
      spellType: "ACTION",
      icon: "Slashing/Cross Slash",
      level: 9,
      specialization: "vengeance-seeker",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "Slashing/Cross Slash",
        tags: ["physical", "damage", "tether-synergy", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 8 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 8 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "15d6 + strength",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 6 },
      tags: ["physical", "damage", "tether-synergy", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_justice_strikes_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 8 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_cage_mastery",
      name: "Mass Imprisonment",
      description: "Erupt individual spectral iron cages around all enemies within 30 feet, shutting down the entire battlefield.",
      spellType: "ACTION",
      icon: "Necrotic/Crossed Bones",
      level: 9,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Crossed Bones",
        tags: ["blight", "control", "cage", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 40,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 4,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 9 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 9 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "incapacitation",
        duration: 4,
        durationUnit: "rounds",
        savingThrow: {
          ability: "strength",
          difficultyClass: 18
        },
        effects: [
          { id : "mass_caged",
            name: "Caged Individually",
            description: "Restrained inside an iron cage. Speed is 0."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 10 },
      tags: ["blight", "control", "cage", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_cage_mastery_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 9 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_no_escape_strike",
      name: "Inescapable Shackle",
      description: "Lash the chains around the target's throat, severing their connection to dimensions. They cannot teleport, blink, or turn invisible.",
      spellType: "ACTION",
      icon: "Piercing/Night Dagger",
      level: 9,
      specialization: "shadowblade",
      effectTypes: ["damage", "debuff"],
      typeConfig: {
        school: "blight",
        icon: "Piercing/Night Dagger",
        tags: ["blight", "damage", "debuff", "shadowblade"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "single",
        rangeType: "melee",
        rangeDistance: 15,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 3,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 7 },
        actionPoints: 2,
        classResource: { type: "tension", cost: 7 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "16d6 + agility",
        damageTypes: ["blight"],
        resolution: "DICE"
      },
      debuffConfig: {
        debuffType: "statusEffect",
        durationValue: 3,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
          { id : "shackle_blocked",
            name: "Dimension Shackled",
            description: "Teleportation and invisibility suppressed."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 5 },
      tags: ["blight", "damage", "debuff", "shadowblade"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_no_escape_strike_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 7 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},

    // ==========================================
    // LEVEL 10 SPELLS
    // ==========================================
    { id : "warden_ultimate_vengeance",
      name: "Cataclysm of Iron",
      description: "Release all Tension in one final, cataclysmic flail. Shatter your chains to shreds, dealing colossal smashing damage to all tethered and nearby enemies.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 10,
      specialization: "universal",
      effectTypes: ["damage"],
      typeConfig: {
        school: "smashing",
        icon: "General/Fiery Rage",
        tags: ["physical", "damage", "ultimate", "universal"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 20,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 0,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 10 },
        actionPoints: 3,
        classResource: { type: "tension", cost: 10 }
      },
      resolution: "DICE",
      damageConfig: {
        formula: "15d10 + strength * 2",
        damageTypes: ["smashing", "stabbing", "slicing"],
        resolution: "DICE"
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 15 },
      tags: ["physical", "damage", "ultimate", "universal"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_ultimate_vengeance_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 10 Tension, claiming retribution." }
    ]
  },
  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
    { id : "warden_prison_realm",
      name: "Iron Prison Realm",
      description: "Banish all nearby enemies to a massive, spectral iron prison realm. Trapped targets are completely helpless and vulnerable to all forms of harm.",
      spellType: "ACTION",
      icon: "Necrotic/Necrotic Skull",
      level: 10,
      specialization: "jailer",
      effectTypes: ["control"],
      typeConfig: {
        school: "blight",
        icon: "Necrotic/Necrotic Skull",
        tags: ["blight", "control", "cage", "ultimate", "jailer"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "circle",
        rangeType: "melee",
        rangeDistance: 60,
        targetRestrictions: ["enemies"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 6,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 10 },
        actionPoints: 3,
        classResource: { type: "tension", cost: 10 }
      },
      resolution: "SAVE",
      controlConfig: {
        controlType: "zone",
        duration: 6,
        durationUnit: "rounds",
        savingThrow: {
          ability: "spirit",
          difficultyClass: 20
        },
        effects: [
          { id : "realm_imprisoned",
            name: "Prison Realm Bound",
            description: "Completely restrained and vulnerable to 2d10 additional damage."
          }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 20 },
      tags: ["blight", "control", "cage", "ultimate", "jailer"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_prison_realm_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 10 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},
    { id : "warden_avatar_perfected",
      name: "Iron Ascendancy Perfected",
      description: "Transform into an unstoppable engine of rusted steel. Your chains expand to cover the area. Gain DR, absolute crowd control immunity, and automatically shred all tethered targets.",
      spellType: "ACTION",
      icon: "General/Fiery Rage",
      level: 10,
      specialization: "vengeance-seeker",
      effectTypes: ["buff"],
      typeConfig: {
        school: "blight",
        icon: "General/Fiery Rage",
        tags: ["blight", "buff", "transformation", "ultimate", "vengeance-seeker"],
        castTime: 1,
        castTimeType: "IMMEDIATE"
      },
      targetingConfig: {
        targetingType: "self",
        rangeType: "self",
        targetRestrictions: ["self"]
      },
      durationConfig: {
        durationType: "rounds",
        durationValue: 8,
        durationUnit: "rounds"
      },
      resourceCost: {
        components: ['verbal', 'somatic'], resourceTypes: ["tension"],
        resourceValues: { tension: 10 },
        actionPoints: 3,
        classResource: { type: "tension", cost: 10 }
      },
      resolution: "AUTOMATIC",
      buffConfig: {
        buffType: "statEnhancement",
        durationValue: 8,
        durationType: "rounds",
        durationUnit: "rounds",
        effects: [
           { id : "perfected_jailer_buff",
             name: "Iron God",
             description: "Gain +6 DR, CC immunity, 50% physical resistance, and shred all tethered targets."
           }
        ]
      },
      cooldownConfig: { cooldownType: "turn_based", cooldownValue: 20 },
      tags: ["blight", "buff", "transformation", "ultimate", "vengeance-seeker"]
    ,
  triggerConfig: {
    triggers: [
      { id: "warden_avatar_perfected_tether", name: "Tether Strain", triggerType: "on_cast", action: "Spends 10 Tension, claiming retribution." }
    ]
  },
  somaticText: "Slam the grave-iron manacles home, letting necrotic rust bite deep.",
  verbalText: "Speak the jailer's sentence in a flat, merciless tone.",
},

      {
        "id": "vengeance-grove_golem",
        "name": "Grove Golem",
        "description": "Breathe life into a simple 1-foot-tall wooden golem grown from a fresh twig. The golem cannot fight, but it sweeps ash, holds a small torch, or taps its wooden feet to alert you when a door opens.",
        "level": 1,
        "spellType": "ACTION",
        "icon": "Nature/Nature Shield",
        "typeConfig": {
          "school": "primal",
          "icon": "Nature/Nature Shield",
          "tags": [
            "utility",
            "roleplay",
            "Warden"
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
          "verbalText": "Vita surgat in hoc ligno...",
          "somaticText": "Whisper a breath of warm air onto a green twig, squeezing it between your thumbs"
        },
        "resolution": "NONE",
        "effectTypes": [
          "utility"
        ],
        "utilityConfig": {
          "utilityType": "conjuration",
          "selectedEffects": [
            {
              "id": "grove_golem_summon",
              "name": "Twig Servant",
              "description": "Summons a tiny twig servant that performs basic chores (holding light objects, cleaning, or tapping to wake you if an adjacent door opens)."
            }
          ],
          "duration": 8,
          "durationUnit": "hours",
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
          "Warden"
        ]
      ,

  somaticText: "Wrench the iron chain taut, the links screaming as you drag your quarry into the light.",
  verbalText: "Grind out a penitent oath between clenched teeth.",
},
  // ===== NON-COMBAT / CHAIN & JAILER UTILITY (the Penitent Jailer, out of combat) =====
  { id: "warden_iron_tow",
    name: "Iron Tow",
    description: "Pay out your grafted chains and use them as a living winch. Tow or haul a heavy load, drag a collapsed beam or boulder aside, haul an ally up a cliff face, or lower and raise goods/personnel on the chain. Your bones take the anchor-strain  -  1 blight per 100 lb hauled. Out of combat.",
    level: 1, spellType: "ACTION", icon: "Utility/Utility",
    typeConfig: { school: "smashing", icon: "Utility/Utility", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","warden"] },
    targetingConfig: { targetingType: "single", rangeType: "ranged", rangeDistance: 30 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 3 }, components: ["somatic"], somaticText: "Loop the chain and brace your grafted forearms against the load" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "telekinesis", selectedEffects: [ { "id": "iron_tow_winch", "name": "Living Winch", "description": "Tow, haul, drag, or lower/raise up to ~1000 lb using your chains as a winch (1 blight to you per 100 lb). Drag debris, haul allies up cliffs, move cargo.", "mechanicsText": "Winch up to ~1000 lb via chains; 1 blight/100 lb." } ], power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","exploration","warden"],
    somaticText: "Loop the chain and brace your grafted forearms against the load.",
    verbalText: "A short, bitten-off grunt under the strain."
  },
  { id: "warden_barbed_bind",
    name: "Barbed Bind",
    description: "Bind a captive with your chains in a hold no mundane slip or lockpick defeats  -  the barbed links seat against flesh and bone, tightening on any struggle. Secure a prisoner for transport, chain a door's handle to a wall, or hogtie a catch. A bound creature of vastly greater strength may still tear free. Out of combat.",
    level: 1, spellType: "ACTION", icon: "Utility/Utility",
    typeConfig: { school: "smashing", icon: "Utility/Utility", castTime: 1, castTimeType: "MINUTES", tags: ["utility","social","investigation","warden"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 4 }, components: ["somatic"], somaticText: "Wrap and seat the barbed chain; cinch it until the links bite" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "binding", selectedEffects: [ { "id": "barbed_bind_secure", "name": "Escape-Proof", "description": "Bind one captive or object with chains that defeat mundane escape/slip/pick and tighten on struggle. A creature of vastly greater strength can still force free. Lasts until you release it.", "mechanicsText": "Mundane-escape-proof chain binding for one captive/object." } ], duration: 24, durationUnit: "hours", power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","social","investigation","warden"],
    somaticText: "Wrap and seat the barbed chain; cinch it until the links bite.",
    verbalText: "A flat recital of the captive's crimes, if any."
  },
  { id: "warden_chain_ward",
    name: "Chain-Ward",
    description: "Chain a door, portcullis, gate, or hatch shut from the inside with your iron  -  barring it physically beyond any mundane lock, and anchoring the links to your own grafted flesh so the bar cannot be thrown without waking you. Alternately, anchor yourself to a spot to hold a line or doorway immovable. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Utility/Utility",
    typeConfig: { school: "smashing", icon: "Utility/Utility", castTime: 1, castTimeType: "MINUTES", tags: ["utility","ward","exploration","rest","warden"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 5 }, components: ["somatic"], somaticText: "Pile link over link across the threshold and seat the last into your forearm" },
    resolution: "NONE", effectTypes: ["utility"],
    utilityConfig: { utilityType: "ward", selectedEffects: [ { "id": "chain_ward_bar", "name": "Iron Bar", "description": "Chain-bar one threshold/gate shut beyond any mundane lock; the chain is anchored to your flesh, so any attempt to throw the bar wakes you. Strong enough to hold until cut or burst by force.", "mechanicsText": "Chain-bar a threshold; flesh-anchored, wakes you if disturbed." } ], duration: 8, durationUnit: "hours", power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","ward","exploration","rest","warden"],
    somaticText: "Pile link over link across the threshold and seat the last into your forearm.",
    verbalText: "A vow that what is inside stays inside."
  },
  { id: "warden_scar_map_reading",
    name: "Scar-Map Reading",
    description: "Read the pattern of bolt-scars on a Warden's skin (your own or another's), or the wound-marks on a mauled corpse, and identify what left them  -  the species and rough strength of every creature that was anchored or that did the mauling. The scar-map is a record written in flesh. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Psychic/Focused Mind",
    typeConfig: { school: "smashing", icon: "Psychic/Focused Mind", castTime: 1, castTimeType: "MINUTES", tags: ["utility","divination","investigation","warden"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 4 }, components: ["somatic"], somaticText: "Trace the scar-lines with a calloused thumb and read the chain that made them" },
    resolution: "NONE", effectTypes: ["utility"],
    utilityConfig: { utilityType: "divination", selectedEffects: [ { "id": "scar_map_read", "name": "Flesh Record", "description": "From a Warden's scar-map or a corpse's wounds, identify the species and rough strength/number of creatures that left each mark  -  a history of what was fought, anchored, or mauled.", "mechanicsText": "Read scars/wounds to identify the creatures that made them." } ], power: "minor" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","divination","investigation","warden"],
    somaticText: "Trace the scar-lines with a calloused thumb and read the chain that made them.",
    verbalText: "Silence  -  the scars speak for themselves."
  },
  { id: "warden_penitents_vigil",
    name: "Penitent's Vigil",
    description: "Drive a hook into the earth and stand vigil. For the duration you cannot be moved (you are the anchor) and you need no sleep, food, or rest, guarding a prisoner, a place, or a post through the night. You act slowly while vigiling and feel every ache when it ends, but nothing short of overwhelming force breaks the watch. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Utility/Empowered Warrior",
    typeConfig: { school: "smashing", icon: "Utility/Empowered Warrior", castTime: 1, castTimeType: "MINUTES", tags: ["utility","rest","exploration","social","warden"] },
    targetingConfig: { targetingType: "self", rangeType: "self" },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 6 }, components: ["somatic"], classResource: { type: "tension", cost: 2 }, somaticText: "Drive the hook deep and let the chain take your weight" },
    resolution: "NONE", effectTypes: ["utility"],
    utilityConfig: { utilityType: "rest", selectedEffects: [ { "id": "penitents_vigil_watch", "name": "The Watch", "description": "For up to 8 hours: you cannot be moved, need no sleep/food/rest, and cannot be snuck past  -  an immovable anchor on watch. You act slowly (disadvantage on non-vigil checks) and arrive tired when it ends, but nothing short of overwhelming force breaks the vigil.", "mechanicsText": "Immovable sleepless vigil 8h; disadvantage after." } ], duration: 8, durationUnit: "hours", power: "moderate" },
    cooldownConfig: { cooldownType: "long_rest", cooldownValue: 1 },
    tags: ["utility","rest","exploration","social","warden"],
    somaticText: "Drive the hook deep and let the chain take your weight.",
    verbalText: "A list, kept quietly, of what you are guarding against."
  }
  ]
};

WARDEN_DATA.spells = WARDEN_DATA.exampleSpells;

WARDEN_DATA.spells = WARDEN_DATA.exampleSpells;
