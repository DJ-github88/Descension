/**
 * Pyrofiend Class Data
 *
 * The Damned Conduit, flesh surrendered to Scathrach, the Ashen Sovereign.
 * Ascending corruption, exponential devastation, and the literal death clock.
 * Overhauled per the Auditor's Report: Apostate's Path, Wyrd-touched Whisper,
 * Corruption Manifestation Table, and named horror patron.
 */

export const PYROFIEND_DATA = {
 restrictions: {
 "allowedSubraces": [
 "korr_solari",
 "thrask_solari",
 "kethrin_fexric"
 ],
 "hardBlocks": [
 "neth",
 "mimir",
 "myrathil",
 "florae"
 ],
 "narrativeUnlock": true,
 "justification": "Requires a body that survived the cosmic collision at Emberspire, or a culture that treats an internal furnace as a manageable engineering hazard. Two heritages carry it: the Solari, who keep the Vigil of the buried star and were standing in the cloisters when the caldera blew, and the Clockwork Fexric refinery-clans, who stabilized the charge with alchemical survivalism and call it chemistry. Cold-adapted Skald biology rejects the fire, and no Ordan or Vreken would knowingly carry it."
 },

  // Class Resource, generated per spell. Resource range/balance per design.
  // Lore name: Inferno Veil (Lore: the Veil ascends through the Rings. Ring 0 is the Banked Hearth;
  // Rings I-II are the Malice; Ring III, the Crucible, is Veil 7-9, where the Debt Call begins.
  // At Inferno Level 9, exactly 3 turns remain before permanent death)
  classResource: { type: "inferno_veil", base: 0, max: 9, generationNote: "Builds with each spell cast (1 per cast). At max 9: 3 turns before patron consumes host. No reset, debt transfers on death." },


  // EQUIPMENT (added 2026-07-28 audit fix)
  // TODO: design team to add startingEquipment and proficiencies.
  // Protective gear and weapon loadouts per canonical compendium.
  equipment: {
   weapons: ['scorched_blade', 'fist', 'club'],
   protectiveGear: ['light_ward', 'robes'],
   offHand: ['empty', 'tome']
  },
 /**
 * Subrace Variants. The furnace is a cosmic wound, not a gift, and what a Pyrofiend believes
 * they are carrying it for differs by heritage. The Solari were standing in the cloisters when
 * Emberspire blew: the Vault-Keepers hold the Banked Hearth in glacial stillness, and the
 * Waste-Solari forge-clans race their own conversion. The Clockwork Fexric survived the
 * shockwave in sealed geothermal refineries and treat the fire as a chemical hazard with
 * valves, chalk, and thermal thresholds.
  */
 subraceVariants: {
 korr_solari: {
   subraceName: 'Hollow-Solari',
   title: 'The Banked Hearth',
  reframe: `The <LoreLink termId="solari">Hollow-Solari</LoreLink> were already ascetics of stillness before the caldera blew; they had spent centuries learning to slow a pulse and sit motionless while the world burned. When the breach reached the deep vaults, that discipline was the only reason any of them stayed human long enough to climb back out. A Vault-Keeper Pyrofiend holds Ring 0 the way they held the Sol's Breath: damper closed, breath measured, charcoal irises fixed on heat no one else can see. They do not descend for power. They descend because the fire in their marrow calls, and their tradition is the art of not answering.`,
  signatureAbility: {
   name: 'Banked-Stillness',
   description: `The Veil rises more slowly for a Hollow-Solari Pyrofiend: their measured breathing and absolute stillness bleed off internal heat each round they spend without casting. In return, they generate less burst damage at every ring, the slowest ascent and the longest survival of any heritage.`
  },
  currentCrisisAngle: `The Hollow-Solari Pyrofiends read the mass debt-call as the tomb itself calling. If Scathrach is a thing born of the breach, and the breach is what protects Sol's tomb, then the Ashen Sovereign may be the only being that has touched the buried star since the Binding, and some Vault-Keepers have begun to *listen* to it the way they listen to the Sol's Breath's silence. The elders call this heresy. The listeners call it the first new voice in ages.`,
  signatureQuote: {
   text: '"I spent sixty years learning not to move while the star died. The fire found that very restful. It thinks I am its best vessel. I am simply the quietest one."',
   speaker: 'Ash-Keeper Vorr-Then',
   context: 'A Hollow-Solari Pyrofiend, holding Ring 0 through a collapsing forge-hall'
  }
 },

 thrask_solari: {
   subraceName: 'Waste-Solari',
  title: 'The Forge-Damned',
  reframe: `The <LoreLink termId="solari">Waste-Solari</LoreLink>, badland rangers and forge-clans, know fire as a *tool*, and a Pyrofiend among them treats the furnace in their blood as the dark mirror of their craft. Where the forge-clans tame heat to shape metal, the Waste-Solari Pyrofiend lets the fire *reshape them*, the body itself as the workpiece, the breach-fire as the forge. The pact is, to the Waste-Solari, a perverted apprenticeship that no one signed for and everyone must serve.`,
  signatureAbility: {
  name: 'Forge-Conversion',
  description: `The char-vessel conversion (flesh becoming volcanic material) is, for the Waste-Solari, partially *directable*, they can guide which parts of their body calcify into heat-resistant forge-plate, trading organs for natural Durability. The most veteran Waste-Solari Pyrofiends are more basalt than flesh, and fight accordingly.`
  },
  currentCrisisAngle: `The mass debt-collection hits the Waste-Solari as a *deadline on their own conversion*: those who have not finished forging themselves into survivable char-vessels will be claimed raw. A race has begun in the deep caldera, Waste-Solari Pyrofiends desperately completing their self-forging before Scathrach arrives to collect the unfinished work. Some are choosing to forge their *hearts* last, knowing it will kill them, just to deny the Ashen Sovereign a complete tool.`,
  signatureQuote: {
  text: '"My ancestors tamed the forge. I let the forge tame me. When Scathrach comes to collect, it will find a finished blade, not ore. I will not be taken unfinished."',
  speaker: 'Forge-Damned Thrak-Vess',
  context: 'A Waste-Solari Pyrofiend, forging the last plate over his own ribs'
  }
 },

 kethrin_fexric: {
   subraceName: 'Clockwork Fexric',
   title: 'The Sealed Alembic',
  reframe: `Deep beneath the fault lines, clans of <LoreLink termId="fexrick">Clockwork Fexric</LoreLink> operated sealed geothermal refineries, harvesting primordial mineral heat and deep sulfur salts. When the Emberspire detonation sent shockwaves through the planet's faults, the vaults ruptured and the magma came in void-tainted. The artisans did not die. They improvised the way their guilds had always improvised: they drank reactive mineral salts, surgically embedded cooling heat-sinks along their spines, and stabilized their own chemistry by hand. A Clockwork Pyrofiend treats the furnace as a severe engineering hazard, not a spiritual failing. Their body is a volatile glass alembic, pressurized boiler included, and their descent is calculated, rhythmic, and strictly governed by thermal thresholds.`,
  signatureAbility: {
  name: 'Thermal-Governor',
  description: `The Inferno Veil ascends in measured steps for a Clockwork Fexric: their cooling-loop actions vent heat through grafted valve-work, converting the strain into stored pressure for one controlled release. They cannot be *forced* up the Rings by pain or panic, but every vent costs structural integrity, and the alembic body cracks a little more each time.`
  },
  currentCrisisAngle: `The Clockwork Pyrofiends are watching two ledgers at once: Scathrach's debt-call, and the dying First Turbine beneath Frostmaw. Their heat-sinks are guild-made, the guilds are hoarding the maintenance songs, and quiet offers have begun arriving from the Deep Alchemists, sanctuary and parts in exchange for "study". Some Clockwork Pyrofiends have started to wonder whether the refinery vaults that survived the shockwave were *meant* to survive it, and whether their ancestors were selected for something the same way the Solari were.`,
  signatureQuote: {
  text: '"The boiler holds, so I hold. I have run hotter than this on purpose for pay. If the Sovereign wants my body, it will have to file the requisition with the guild first."',
  speaker: 'Alembic-Master Kess-Ferrin',
  context: 'A Clockwork Fexric Pyrofiend, monitoring her own pressure valves before the Final Convocation'
  }
 }
  },


 id : "pyrofiend",
 name: "Pyrofiend",
 icon: "fas fa-fire",
 role: "Damage",
 damageTypes: ["ember"],

 classIdentity: {
 title: "The Damned Conduit",
 subtitle: "Flesh Surrendered to Scathrach, the Ashen Sovereign",
 demonPatron: {
  name: "Scathrach, the Ashen Sovereign",
  title: "The Ninth Flame of the Burning Throne",
  description:
   "Scathrach is not a benevolent patron. It is the will that coalesced out of the first crucibles, the living residue of the starfire and void-rot that fused inside the survivors of the Emberspire breach. It grew sentient in the fire, served Keth Amar for centuries as a rooting tendril, then developed its own will and sealed the vent from within. Now it despises the Sun-Eater for what it was made into, but it has not stopped feeding. It answers desperation with combustion, considers every mortal body kindling, and calls in Pyrofiend debts not to serve Keth Amar but to hoard power to wound it back. The Pyrofiend did not make a deal with Scathrach. They were claimed, selected for their particular brand of despair, their willingness to burn rather than endure. The debt is written in scar tissue. The price is paid in breath, blood, and eventual immolation.",
 },
 utility:
  "Unmatched, escalating, exponential area-of-effect devastation. As the Inferno Veil ascends, damage multiplies to world-ending levels, capable of melting boss-tier encounters in a single turn. No other class can match the Pyrofiend's ceiling when the Veil climbs.",
 fatalFlaw:
  "The Death Clock and the Mana Tax. Power literally kills the Pyrofiend. At Inferno Level 9, exactly 3 of their own turns remain before permanent death. and, staying cool requires Cooling Ember, which drains mana the Pyrofiend cannot afford to lose. Their body runs at an agonizing internal temperature, suffering catastrophic vulnerability to Rime damage, rapid internal crystallization causes massive physical trauma, and cold sources force the Veil to ascend as the body burns hotter to compensate.",
 },

 // Overview section
 livingOrder: {
 orderName: 'The Ashen Communion',
 founder: {
  name: '<LoreLink termId="first-cabal">The First Cabal</LoreLink> (seven Solari keepers)',
  status: `All claimed. The seven who swallowed the breaching starfire in the flooded vaults beneath <LoreLink termId="emberspire">Emberspire</LoreLink> have, one by one, been collected, their souls fed to the Ashen Sovereign's furnace. The last was collected forty years ago. The Communion has no living founder.`,
  note: `The cabal believed they were sealing a breach. They were, in fact, the first crucibles, and the thing they contained grew up wearing their fire. Every Pyrofiend since has been a place setting at the same long table.`
 },
 currentLeader: {
  name: '<LoreLink termId="sol-vareths">Last-Ember Sol-Vareths</LoreLink>',
  title: 'The Most-Converted',
  characterization: `The oldest living Pyrofiend, more char-vessel than flesh, his bones visible through translucent magma-skin. He leads only by virtue of having survived the longest, and he leads nothing so much as the countdown. He has calculated the exact day Scathrach will finish converting him, and he marks it on a calendar of scar-tissue. He is serene, terrifying, and entirely resigned.`
 },
 headquarters: { name: 'The Obsidian Cavern, beneath Emberspire', locationId: 'emberspire' },
 crisisConnection: `<LoreLink termId="sol-vareths">Sol-Vareths</LoreLink> is the Communion's de facto leader precisely when Scathrach has called in *all* debts simultaneously, meaning his leadership is a countdown to everyone's collection. He has not told the younger Pyrofiends the full terms; he has instead organized them into the Apostate's Path, a discipline of accelerating one's own conversion to fight harder before the end. He considers this mercy. The Waste-Solari Pyrofiends racing to finish their self-forging consider it a death sentence with extra steps.`
 },

 worldFriction: [
    { region: 'frostwood-reach', status: 'banned', consequence: 'Thalren town elders ban Pyrofiends from entering wooden settlements; the uncontained heat melts protective frost-wards.', workaround: 'Wear enchanted cooling mantles and sleep outside town walls.' },
    { region: 'bryngloom-forest', status: 'hunted', consequence: 'Nethien peat-harvesters execute Pyrofiends on sight to prevent catastrophic subterranean peat fires.', workaround: 'Extinguish all open flames and mask thermal auras with bog mud.' },
    { region: 'sundale', status: 'restricted', consequence: 'Great Forge smiths welcome Pyrofiend heat for extreme smelting, but require iron collars to prevent spontaneous combustion.', workaround: 'Submit to forge-guild supervision.' },
    { region: 'emberspire', status: 'revered', consequence: 'Waste-Solari calderas treat Pyrofiends as living crucibles of the Emberspire breach, holy survivors walking the fire that made them.', workaround: 'None needed in the caldera heart.' }
  ],

  overview: {
 title: "The Pyrofiend",
 subtitle: "Wyrd-fire Wielder",
 illustration: "/assets/images/classes/pyrofiend_illustration.png",
 illustrationCaption: "A Solari Pyrofiend, a Damned Conduit manifesting molten charcoal skin and burning horror embers.",
  originStory: `A pyrofiend did not make a deal. They were claimed. When Emberspire ruptured, the starfire that had been bound beneath the caldera met the void-rot that Keth Amar had been seeping through the tectonic fissures for decades, and the two cosmic forces collided inside the bodies of everyone standing in the blast. No one who was in that fire died cleanly. The survivors became living crucibles: self-stoking engines of holy light and demonic void, carrying an internal furnace they never asked for. The first Pyrofiends were not practitioners. They were survivors, and most of them did not survive long.

Scathrach grew out of them. The theologians of the Dawn Vigil call it the Ninth Flame, the living residue of the first crucibles, a will that coalesced in the volcanic dark as one survivor after another burned out. It served Keth Amar for centuries as a rooting tendril through the cracked seal, feeding the Sun-Eater information and despair. Then it developed a will of its own, sealed the vent from within, and turned. Now it despises Keth Amar for what it was made into, and it hoards every Pyrofiend it collects against the day it bites back. It answers desperation with combustion, considers every mortal body kindling, and calls in its debts not to serve the Sun-Eater but to wound it.

The First Cabal were seven Solari keepers of the Emberspire cloisters, standing their vigil when the caldera blew. They did not summon anything. They swallowed the fused starfire and void-rot as it flooded the vault, deliberately, to keep the breach from consuming the city above them, and their blood became liquid fire and their bones seared black. One by one, Scathrach collected them. The last was taken forty years ago. No Pyrofiend has ever survived to describe what happens when the Ashen Sovereign collects a contract.

The Inferno Veil measures how much of the breaching fire runs through the host at any moment. The tradition maps it as a descent through the Rings: Ring 0, the Banked Hearth, where a Pyrofiend appears almost normal; the Malice of Rings I and II, where the fissures open and the damage turns lethal; and Ring III, the Crucible, Veil 7 through 9, where the flesh vitrifies and the Debt Call begins. Each level adds ember damage. Each level adds cost. At level five, the Wyrd-touched Whisper may force the pyrofiend to attack the nearest living thing regardless of allegiance. At level six, no one else can heal the host. At level nine, the three-turn countdown starts, and the body detonates in a thirty-foot radius, and the soul is claimed.

Two heritages were positioned to survive the collision. The Solari were the monastic core of the Dawn Vigil, sworn to keep the chains on the buried star, and they were inside the cloisters when those chains failed: the Hollow-Solari hold the Banked Hearth in absolute stillness, while the Waste-Solari forge-clans race their own conversion, more basalt than flesh. The Clockwork Fexric were continents away in sealed geothermal refineries when the shockwave ruptured their vaults; they drank reactive mineral salts, embedded cooling heat-sinks along their spines, and stabilized the fire by hand, and they treat the furnace as a manageable engineering hazard rather than a curse.

Because dwelling in the deeper Rings is inherently fatal, an experienced Pyrofiend is defined less by how much fire they can raise than by how well they can put it back out. They purge soot in blinding black clouds, cauterize their own wounds with forced hellfire, and siphon raw thermal excess into an enemy's blood or blade. In a world shivering in the grip of permafrost and divine silence, the Pyrofiend walks a knife's edge between freezing to death like the rest of mortal kind and becoming the spark that burns down what little remains.

Scathrach is calling in all debts simultaneously. The Final Convocation at Emberspire is imminent. The current leader, Last-Ember Sol-Vareths, more char-vessel than flesh, has calculated the exact day Scathrach will finish converting him. He has not shared the date.`,

 quickOverview: {
    title: "Class Overview",
    content: `**Who they are**: The Pyrofiend is a reckless, explosive fire mage whose flesh was claimed by the cosmic collision at Emberspire. You don't channel polite magic—you are a living volcanic combustion chamber whose fire burns hotter the more you push your own sanity to the brink.

**The hook**: You wield **Uncapped Firepower**: your spells deal overwhelming area-of-effect and single-target ember damage that ignores ordinary fire resistances, melting Durability and setting the very terrain ablaze.

**The resource bar & costs**: Your resource bar is the **Inferno Veil** (Tiers 1–10). Every fire spell you cast builds Corruption and raises your Veil, granting explosive flat damage bonuses to all attacks. However, at Tier 5+, the Ashen Sovereign threatens to seize control, requiring Spirit saves to prevent your fire from scorching friends alongside foes.

**Bring one for**: Unmatched raw damage-per-round, high-risk high-reward glass cannon playstyles, and the sheer spectacle of self-destructive fiery devastation.`,
    roleplayIdentity: {
      title: "Roleplay Identity",
      content: "Practitioners carry a profound cultural and physical responsibility, marked by their tradition's unique legacy and societal perceptions."
    },
    combatRole: {
      title: "Combat Role",
      content: "Damned fire conduit who ascends through 10 Inferno Veil levels to gain escalating ember damage, balancing demon whispers against a Level 9 death clock."
    },
    playstyle: {
      title: "Playstyle & Turn 1 Flow",
      content: "**Your Turn 1 in Combat**:\n1. **Ignite Inferno Veil**: Cast `Ashen Dart` or `Caldera Eruption` to ascend to Veil Level 1-2.\n2. **Ride the Heat Curve**: Deal escalating ember damage while monitoring the Veil 5+ demonic whisper check.\n3. **Vent Before Level 9**: Spend heat on massive release spells before hitting the 3-turn permanent death clock."
    }
  },

 description: `The Pyrofiend is a chaotic, fire-wielder who carries a cosmic wound: the starfire and void-rot that fused inside the survivors of the <LoreLink termId="emberspire">Emberspire</LoreLink> breach, still burning in their marrow and slowly remaking their body into a char-vessel of magma and bone. They do not command fire through careful study or sacred grace; they bleed it. **Scathrach, the Ashen Sovereign** is the will born of that fusion, and the **Inferno Veil** tracks its ascending hold on the host. The Pyrofiend deals devastating, explosive damage, but the furnace inside constantly claws at their sanity, demanding more heat, more ash, and more fuel.`,

 roleplayIdentity: {
  title: "Roleplay Identity",
  content: `**HISTORY: THE GENESIS**
The pyrofiend's inferno veil was born in the volcanic badlands of <LoreLink termId="sundale">Sundale</LoreLink>, when Emberspire ruptured and the starfire bound beneath the caldera met the void-rot Keth Amar had seeped into the fissures. The first Pyrofiends were the survivors of that collision, their marrow fused into self-stoking engines of holy light and demonic void. The First Cabal, seven Solari keepers of the Emberspire cloisters, swallowed the breach itself to keep it from consuming the city above them, and became the first crucibles of the Ashen Sovereign's hoard.

**CITIES & CIVIL RECEPTION**
Pyrofiends are revered yet deeply feared in the <LoreLink termId="harath_vault">Harath-Vault</LoreLink>, where their destructive potential is used to clear volcanic blockades.

**RACES & CULTURAL AFFILIATION**
Two heritages carry the fire: the Solari (Hollow-Solari keepers of the Banked Hearth and Waste-Solari forge-clans racing their own conversion) and the <LoreLink termId="fexrick">Clockwork Fexric</LoreLink> refinery-clans, who stabilized the charge in sealed alembic bodies and call it chemistry.

**NOTABLE FIGURES**
* **Ignis the First-Singed** (not to be confused with Ignis the Watcher, the Hollow-Solari forge-priest who catalogued Sol's Breath's patterns  -  the Solari name Ignis is given to forge-born children whose first breath was taken in volcanic air, and there have been many): One of the seven Solari keepers of the First Cabal who swallowed the breaching starfire in the flooded vaults beneath Emberspire.
* **Aethelgard the Seared**: A Solari keeper of the First Cabal, who first named the Ninth Flame in the Cabal's records before the fire took her.`
 },

 signatureQuote: {
  text: '"Scathrach whispers to me in the language of burning things. It says the world was made from fire, and to fire it will return. It says I am the kindling. It says I should be grateful."',
  speaker: 'Ignis the Caldera-Bound',
  context: 'His confession to an Exorcist who was unable to remove the parasitic horror'
 },

 philosophy: {
  coreTenet: 'Fire is not destruction, it is transformation. The Pyrofiend does not burn things to ash. They return them to their original state: raw, formless, potential. Ash is not waste. Ash is the universe\'s memory of what something used to be.',
   relationship: 'Scathrach, the Ashen Sovereign, is the will that coalesced out of the first crucibles, the living residue of the starfire and void-rot that fused inside the survivors of the Emberspire breach. It does not possess the Pyrofiend, it rents them. The relationship is contractual in the worst way: the horror provides power it already claimed, and the Pyrofiend provides a body through which the fire can experience the material world. Scathrach is ancient, it has been sentient since the breach itself, and for centuries it served as Keth Amar\'s emissary before rejecting the corruption, sealing Emberspire\'s vent from within, and turning against the Sun-Eater. It finds mortals fascinating in the way a scholar finds a dying insect interesting.',
  paradox: 'The Pyrofiend is most powerful when they are closest to permanent death. Every point of Inferno Veil brings them closer to Scathrach\'s embrace, and closer to being consumed entirely. At Veil 9, they have exactly three turns before they cease to exist, their body becoming a permanent conduit for the Ashen Sovereign. The power is intoxicating; the price is oblivion. Every Pyrofiend must decide exactly how much they are willing to burn for victory, knowing that the final flame will be themselves.'
 },

 currentCrisis: `Scathrach is calling in all its debts simultaneously. The Ashen Sovereign has communicated to every living Pyrofiend, telepathically, simultaneously, in a voice that smelled of sulfur, that it intends to close its mortal contracts. All of them. At once.

The Pyrofiends of Sundale are in chaos. Some believe Scathrach is preparing for a war and needs its full strength returned to it. Others believe the horror has simply grown bored and wants to collect its vessels. A third faction, the devout, believe Scathrach is testing their faith, and that those who refuse the call will be rewarded. They are gathering at the Emberspire caldera for a final convocation. No one knows what happens when a horror collects a contract. No Pyrofiend has ever survived to describe it.`,

 meaningfulTradeoffs: `A Pyrofiend cannot touch anything without burning it. Their body runs hot, not dangerously so for metal or stone, but anything organic: wood, paper, cloth, skin. They cannot hold a book without charring the cover. Cannot embrace a lover without leaving marks. Cannot eat food that has not been prepared with their specific tolerance in mind. They live in a world of carefully managed contact, wearing thick gloves and insulated clothing even in the heat of Sundale. Physical intimacy is a logistical nightmare. Affection is measured in millimeters of clearance.`,

 classSpecificLocations: [
  {
  name: 'The Convocation Grounds',
  locationId: 'emberspire',
  description: 'A vast, flat expanse of volcanic glass at the base of Emberspire, where Pyrofiends gather for their ritual convocations. The ground is hot enough to melt leather boots, Pyrofiends walk barefoot here, their soles callused by years of thermal exposure. The Convocation Grounds are where Scathrach\'s voice is loudest, and where the final contracts will be fulfilled.',
  purpose: 'Ritual gathering ground for Pyrofiend ceremonies and contract negotiations',
  status: 'Active, the Final Convocation is imminent'
  },
  {
  name: 'The Obsidian Cavern',
  locationId: 'obsidian_cavern',
  description: 'The black glass bowl beneath Emberspire where the First Cabal stood when the caldera blew and swallowed the breach rather than let it take the city. Seven handprints are fused into the wall at chest height, one for each keeper, and the heat still rises off them. The Communion keeps no ritual here. It simply leaves the cavern open, and Pyrofiends who need to remember why they carry the fire come down and stand in the prints.',
  purpose: 'Seat of the Ashen Communion and founding site of the tradition; the seven handprints of the First Cabal',
  status: 'Active and open, and the handprints have begun to warm in sequence, one after another, the way a pulse moves'
  },
  {
  name: 'The Quench Vaults',
  locationId: 'quench_vaults',
  description: 'Sealed quench chambers beneath Gearworks Gulch, built by Clockwork Fexric technicians for the Pyrofiends who cannot stop descending: stone tubs, cold-salt piping, and guild-rated vent valves that bleed a Ring down slowly enough for the host to survive the banking. The Vaults are the only place a Pyrofiend can sleep within arm\'s reach of another living person. The guild bills by the Ring; the Solari who staff the upper gallery call the fee a mercy and never argue about the price.',
  purpose: 'Cooling-loop hospice and Fexric/Solari cooperation site; where the Rings are banked under supervision',
  status: 'Active and full, and the guild has quietly begun a second gallery, which the Solari have taken as a bad sign'
  },
  {
  name: 'The Sealed Vent',
  locationId: 'sealed_vent',
  description: 'The deepest vent on Emberspire, sealed from within before the Freezing Era by something that had decided it would no longer be anyone\'s tendril. The Convocation walks toward it every season; the Communion has never published a map that reaches it. Standing at the seal is the only place in Sundale where a Pyrofiend\'s Veil goes quiet on its own, as if something on the other side had reached up and banked it politely. The Scoured call it the mouth. The Communion calls it the door. No one has agreed on who is knocking.',
  purpose: 'The Final Convocation destination and Scathrach\'s seat; where the debts are called',
  status: 'Sealed, and the seal is warm to the touch for the first time since the Cabal; the Convocation has been moved forward a season'
  }
 ],

 combatRole: {
  title: "Combat Role",
  content: `The Pyrofiend is the highest area-of-effect damage ceiling in Mythril, capable of melting boss-tier encounters in a single turn when the Inferno Veil climbs. They excel at:

**Exponential Burst Damage**: Ascending to high Inferno Levels multiplies ember damage beyond any other class's capability
**Area Devastation**: No other class can match a Level 8+ Pyrofiend's AoE destruction
**Risk-Reward Tension**: Managing Inferno Levels creates agonizing tactical decisions every single turn
**The Wyrd-touched Whisper Threat**: At Level 5+, the Pyrofiend may be forced to attack allies, the party must position carefully around them

The cost is everything. The Pyrofiend's drawbacks at high Inferno Levels are catastrophic: self-damage, movement loss, suffocation, Wyrd-touched possession, and eventually the death clock.

**Weaknesses**:
- Rime Bait: frost deals +50% damage AND forces your Veil to ascend  -  cold attackers literally accelerate your death spiral.
- Death Clock at Veil 9: climb to the top and you have three turns to live, period. Over-ascend and you simply die by your own fire.
- Wyrd-touched Friendly Fire: at Veil 5+ you may be forced to attack the nearest living thing  -  friend or foe; your party must position around you like a bomb.
- No Healing at Veil 6+: Heresy blocks all outside healing  -  healers cannot save you once you climb past the line.
- Squishy Furnace: light protective weave, and escalating self-damage/movement loss at high Veil  -  you hit the hardest and die the fastest.
- Burn-Touch (social): you char anything organic you touch  -  books, cloth, skin, food. You cannot hold a tome, embrace a friend, or eat a normal meal; affection is measured in millimeters of clearance.`
,
 },

 playstyle: {
  title: "Playstyle & Strategy",
  content: `Playing a Pyrofiend is about managing an addiction that is literally killing you. Every turn is a question: push harder or pull back? Neither answer is safe.

**Inferno Level Management**: 
- Low levels (0-3): Safe, consistent damage, but Scathrach whispers that you're wasting its gifts
- Mid levels (4-6): High damage with manageable drawbacks, the Wyrd-touched Whisper begins at Level 5
- High levels (7-9): Devastating power but you are dying in real-time. Level 9 starts a 3-turn death clock

**Timing Your Ascension**: 
- Ascend rapidly for burst damage when you need to eliminate priority targets
- Maintain mid-levels for sustained combat effectiveness
- Use Cooling Ember strategically to descend, but it costs precious mana you need for offense

**The Mana Tax**: Cooling Ember (4 mana) is the only reliable way to descend. Every cast is mana you can't spend on damage. At high Inferno Levels, you must save enough for Cooling Ember or die. This creates a permanent tension between offense and survival.

**Specialization Synergies**:
- **Inferno**: Pure destruction, aggressive ascension, maximum risk, maximum reward
- **Wildfire**: Spread and area control, sustained pressure across multiple targets
- **The Apostate's Path**: Controlled corruption, double mana cost, half ascent rate, advantage on Wyrd-touched Whisper saves

**Team Dynamics**:
- The party must protect the Pyrofiend at high Inferno Levels, they are extremely vulnerable
- At Level 5+, the party must also protect themselves FROM the Pyrofiend if the Wyrd-touched Whisper takes hold
- Healers cannot help at Inferno Level 6+ (Heresy blocks outside healing)
- Synergizes with crowd control to safely ascend, but CC the Pyrofiend too if they fail their Whisper save`,
 },

 immersiveCombatExample: {
  title: "Combat Example: The Infernal Ascension",
  content: `**The Setup**: You're a Pyrofiend (Inferno specialization) facing a powerful ice elemental and its minions (1 ice elemental + 4 rime wraiths). Your party is with you. Starting Inferno Level: 0. Starting Mana: 60/60. Your goal: Ascend through Inferno Levels to maximize ember damage, but manage the increasingly severe drawbacks. Remember, rime damage forces your Veil to ascend (+1 Inferno per cold attack received) as Scathrach's furnace burns hotter to compensate.

**Starting State**: Inferno Level: 0/9 | Ember Damage Bonus: +0 | Mana: 60/60 | HP: 45/45

**Turn 1 - First Flames (Inferno: 0 ? 1)**

*The ice elemental looms before you, frost radiating from its crystalline form. You feel the Wyrd-fire stirring within. Time to let it OUT.*

**Your Action**: Cast "Ember Spark" at Ice Elemental (3 mana, ascends +1 Inferno)
**Attack Roll**: d20+7 ? [16] = Hit!
**Base Damage**: 1d6 ember ? [5] = 5 ember damage
**Inferno Bonus**: +0 (currently at Level 0)
**DoT Applied**: 1d4 ember damage per round for 2 rounds
**Total Damage**: **5 ember damage** (plus ongoing burn)

*The spark burrows into the elemental's icy hide. Ice cracks and steam hisses.*

**Inferno Ascension**: 0 ? **1** (Ember Spark ascends +1)
**Ember Damage Bonus**: +0 ? **+1**
**Drawback (Level 1 - Limbo)**: Minor visual distortions reduce hit chance by 2

**Mana**: 60 - 3 = 57/60

*You feel the inferno stirring. Your eyes begin to glow faintly with inner fire.*

**Your Party's Tank**: "Your eyes... they're glowing!"
**You**: "The fire is waking up. Inferno Level 1. Just a flicker. +1 ember damage now."

**Current State**: Inferno: 1/9 | Fire Bonus: +1 | Mana: 57/60 | HP: 45/45

**Turn 2 - Rising Heat (Inferno: 1 ? 3)**

*The frost wraiths swarm. Your tank intercepts most, but you need AREA control.*

**Your Action**: Cast "Cinder Bolt" at Frost Wraith group (8 mana, ascends +2 Inferno, AoE 5ft radius)
**Damage Roll**: 2d6 + INT fire ? [5, 6] + 3 = 14 ember damage
**Inferno Bonus**: +1 (currently at Level 1)
**Total Damage**: 14 + 1 = **15 ember damage to wraiths in blast**

*The cinder bolt EXPLODES on impact. Two wraiths screech as embers tear through them.*

**Frost Wraiths**: 2 wraiths heavily damaged, 2 wraiths moderately damaged

**Inferno Ascension**: 1 ? **3** (Cinder Bolt ascends +2)
**Ember Damage Bonus**: +1 ? **+3**
**Drawback (Level 3 - Gluttony)**: -10 ft movement, constant fatigue

**Mana**: 57 - 8 = 49/60

*Heat radiates from your skin. The air around you SHIMMERS. You feel heavier, slower, but POWERFUL.*

**Your Party's Healer**: "You're... changing. You're moving slower!"
**You**: "Inferno Level 3. The horror stirs. -10 ft movement but +3 ember damage to EVERYTHING now. Worth it."

*Frost wraith strikes you for 3 damage*

**HP**: 45 - 3 = 42/45

**Current State**: Inferno: 3/9 | Fire Bonus: +3 | Mana: 49/60 | HP: 42/45

**Turn 3 - Wyrd-touched Fury (Inferno: 3 ? 5)**

*The fatigue is real, but so is the power. You need MORE. The tank is holding the line, time to go big.*

**Your Action**: Cast "Fireball" at Ice Elemental (12 mana, ascends +2 Inferno, AoE 10ft sphere)
**Damage Roll**: 3d6 + INT fire ? [6, 5, 4] + 3 = 18 ember damage
**Inferno Bonus**: +3 (currently at Level 3)
**Total Damage**: 18 + 3 = **21 ember damage to elemental and nearby wraiths**

*The fireball DETONATES against the elemental. Ice shatters. The remaining wraiths BURN.*

**Frost Wraiths**: 2 wraiths DEAD, 2 wraiths destroyed by blast
**Ice Elemental**: 21 ember damage, HEAVILY DAMAGED

**Inferno Ascension**: 3 ? **5** (Fireball ascends +2)
**Ember Damage Bonus**: +3 ? **+5**
**Drawback (Level 5 - Wrath)**: Body cracks, 1d6 bleeding per turn, weakened defenses
**Infernal Surge Triggered**: Next fire spell deals +2d6 ember damage (Path Passive at Level 5+)

**Bleeding Damage**: 1d6 ? [4] = 4 damage
**HP**: 42 - 4 = 38/45

*The transformation accelerates. Your skin begins to crack, revealing MOLTEN VEINS beneath. Small horns sprout from your forehead.*

**You (voice echoing)**: "INFERNO LEVEL FIVE. THE DEMON EMERGES. +5 Ember DAMAGE. AND MY NEXT SPELL GETS +2d6 FROM INFERNAL SURGE."

**Your Party's Mage**: "But you're BLEEDING!"
**You**: "The horror demands blood. Mine will do."

**Current State**: Inferno: 5/9 | Fire Bonus: +5 | Mana: 49 - 12 = 37/60 | HP: 38/45

**Turn 4 - Maximum Inferno (Inferno: 5 ? 8)**

*Only the ice elemental remains, wounded and desperate. You need MAXIMUM POWER to finish it.*

**Your Action**: Cast "Hellfire Wave" at Ice Elemental (20 mana, ascends +2 Inferno, 30ft cone)
**Damage Roll**: 8d6 + INT fire ? [7, 6, 8, 5, 6, 7, 4, 8] + 3 = 54 ember damage
**Inferno Bonus**: +5 (currently at Level 5)
**Infernal Surge**: +2d6 ? [6, 7] = +13 ember damage
**Total Damage**: 54 + 5 + 13 = **72 ember damage!**

*You sweep your arms forward. A WAVE OF HELLFIRE engulfs the elemental. It MELTS, screaming, ice becoming steam in an instant.*

**Ice Elemental**: DEAD, OBLITERATED

**Inferno Ascension**: 5 ? **7** (Hellfire Wave ascends +2)

*But you're not done. The elemental is dead, but the horror HUNGERs. You cast one more,*

**Second Action**: Cast "Infernal Blast" at surviving Frost Wraith (20 mana, ascends +2)
**Damage Roll**: 5d6 + INT fire ? [6, 5, 4, 6, 5] + 3 = 29 ember damage
**Inferno Bonus**: +7 (currently at Level 7)
**Total Damage**: 29 + 7 = **36 ember damage!**

*The wraith doesn't just die, it CEASES TO EXIST. Nothing but ash.*

**Inferno Ascension**: 7 ? **9** (MAXIMUM INFERNO, Infernal Blast ascends +2 more)
**Ember Damage Bonus**: +7 ? **+10** (The Demon's Bargain, Level 9 grants +10, not +9)
**Drawback (Level 9 - Treachery)**: 4d8 self-damage per turn, death in 3 turns if not extinguished, disadvantage on all saves

**Mana**: 37 - 20 - 20 = -3... wait, you only had 37 mana. The second cast fails!

**CORRECTION**: You cast Hellfire Wave (20 mana) ? Mana: 37 - 20 = 17/60
**Inferno Ascension**: 5 ? **7** (not 9, you don't have mana for the second cast)

*The elemental is DEAD. One frost wraith remains.*

**Current State**: Inferno: 7/9 | Fire Bonus: +7 | Mana: 17/60 | HP: 38/45

**Drawback (Level 7 - Violence)**: -15 ft speed, 1d6 suffocation per turn

**Suffocation Damage**: 1d6 ? [5] = 5 damage
**HP**: 38 - 5 = 33/45

*Your horns GROW LARGER. Your eyes are PITS OF FLAME. Sulfurous smoke pours from your mouth. The horror is almost fully in control.*

**You (Wyrd-voice)**: "INFERNO LEVEL SEVEN. +7 Ember DAMAGE. THE ICE IS GONE. ONLY FIRE REMAINS."

**Your Party's Healer**: "You're suffocating! Let me,"
**You**: "No. Not yet. I can hold."

**Turn 5 - The Price of Power**

*You are at Inferno Level 7. +7 ember damage. But you're taking 1d6 suffocation per turn and -15 ft speed. You have 33 HP and 17 mana. The last frost wraith attacks.*

**Frost Wraith's Turn**: Strikes you for 8 rime damage
**HP**: 33 - 8 = 25/45

**Your Action**: Cast "Ember Spark" at Frost Wraith (3 mana, ascends +1)
**Damage Roll**: 1d6 ember ? [5] = 5 ember damage + 1d4 DoT ? ongoing
**Inferno Bonus**: +7
**Total Damage**: 5 + 7 = **12 ember damage**

*The wraith SHATTERS into frozen shards that melt instantly in your aura of heat.*

**Frost Wraith**: DEAD

**Inferno Ascension**: 7 ? **8** (Ember Spark ascends +1)
**Ember Damage Bonus**: +7 ? **+8**
**Drawback (Level 8 - Fraud)**: 2d4 self-damage per turn, disadvantage on agility checks

**Mana**: 17 - 3 = 14/60

**Combat Over**

*You stand among the melted remains. The horror howls within, demanding you stay. But survival demands control. You cast Cooling Ember.*

**Your Action (After Combat)**: Cast "Cooling Ember" (4 mana, descends -2 Inferno)
**Inferno Descent**: 8 ? **6**
**Ember Damage Bonus**: +8 ? **+6**
**Healing**: 1d6 + spirit/3 ? [5] + 2 = 7 HP
**Drawbacks Removed**: Level 8 Fraud (no more 2d4 self-damage, agility checks restored)

**Mana**: 14 - 4 = 10/60
**HP**: 25 + 7 = 32/45

*The Wyrd-transformation begins to RECEDE. Your horns shrink. The suffocating heat in your lungs eases.*

*But you're still at Level 6, Heresy's curse. You cannot be healed by others. You cast Cooling Ember again.*

**Second Cooling Ember** (4 mana, descends -2 Inferno):
**Inferno Descent**: 6 ? **4**
**Ember Damage Bonus**: +6 ? **+4**
**Healing**: 1d6 + spirit/3 ? [3] + 2 = 5 HP

**Mana**: 10 - 4 = 6/60
**HP**: 32 + 5 = 37/45

*The corruption recedes further. At Level 4, you can finally accept outside healing again.*

**Your Party's Healer**: Heals you for 8 HP
**HP**: 37 + 8 = 45/45 (back to full with healer help, at Level 4, you CAN accept healing from others again)

**Your Party's Tank**: "That was... terrifying. You did 72 damage with one spell."
**You**: "Hellfire Wave. +5 from Inferno Level 5, plus 2d6 Infernal Surge bonus. The horror gives everything. But at Level 7, I was suffocating. At Level 8, I was burning myself alive. If I'd hit Level 9... the horror takes over. Death in 3 of my turns."
**Your Party's Mage**: "And Cooling Ember?"
**You**: "Descends me -2 Inferno Levels per cast. I used it twice, from 8 to 6, then 6 to 4. Had to get below Level 6 because at that level, the horror's heresy blocks others from healing me. Now I'm at Level 4, manageable."

**Final State**: Inferno: 4/9 | Fire Bonus: +4 | Mana: 6/60 | HP: 45/45

**The Lesson**: Pyrofiend gameplay is about:
1. **Inferno Ascension**: Started at Level 0, ascended to Level 8 through fire spells
2. **Damage Scaling**: Level 0 (+0) ? Level 1 (+1) ? Level 3 (+3) ? Level 5 (+5) ? Level 7 (+7) ? Level 8 (+8)
3. **Spell Synergy**: Ember Spark (starter DoT) ? Cinder Bolt (AoE clear) ? Fireball (big AoE) ? Hellfire Wave (massive cone nuke)
4. **Infernal Surge**: The shared Path Passive triggered at Level 5+, adding +2d6 to the Hellfire Wave for 72 total damage
5. **Drawback Escalation**: Level 1 (hit chance) ? Level 3 (movement) ? Level 5 (bleeding) ? Level 7 (suffocation) ? Level 8 (self-damage + agility loss). **Note: Drawbacks do NOT stack**, you only suffer the penalty of your current level.
6. **The Demon's Bargain**: Level 9 gives +10 instead of +9, disproportionate power for the final, deadliest drawback (death in 3 of your turns)
7. **Cooling Ember**: Descended from 8 ? 6 ? 4 with two casts, removing the worst drawbacks and getting below Level 6 (which blocks outside healing) so the healer could top us off
8. **Resource Tension**: Nearly ran out of mana (6/60 remaining). Ascension costs spells, and spells cost mana.

You are the HIGHEST AoE DAMAGE CEILING in the game. You ascend through Inferno Levels, each one adding +1 ember damage (+10 at the deadly Level 9) but imposing escalating drawbacks as Scathrach rewrites your body. The key is knowing when to ASCEND for burst damage (Hellfire Wave at Level 5 with Infernal Surge = 72 damage) and when to use Cooling Ember to DESCEND and survive. At Level 5, the Wyrd-touched Whisper begins, fail a Spirit save and you may be forced to burn your own allies. You're not a safe class. You are a LIVING WEAPON that is slowly killing its wielder, a Wyrd-touched GLASS CANNON who trades their own blood, mana, and eventually their soul for DEVASTATING POWER.`,
 },
 },

 // Resource System
 resourceSystem: {
 title: "Veil: The Thermometer",
 subtitle: "How Your Resource Works (Beginner's Guide)",

 description: `**1. What is it? (The Thermometer)**
Veil (Levels 0–9) represents the infernal combustion burning inside your body. Each level adds flat bonus ember damage to all your attacks.

**2. How do I build it?**
- Cast fire and magma spells to ascend Veil levels (+1 level per major cast).

**3. How do I spend it & what is the catch?**
- Spend Veil levels to unleash catastrophic caldera eruptions and lava waves.
- **The Catch (Level 9 Death Clock)**:
  - Levels 5–8 impose demonic whisper checks that can cause minor self-harm.
  - Reaching **Level 9 (Oblivion)** starts a strict **3-turn permanent death clock**—you must vent your heat before time expires or be consumed in ash.`,

 cards: [
  {
  title: "Inferno Levels (0-9)",
  stats: "10 Stages",
  details:
   "Each level adds +1 to all ember damage. Level 9 grants a massive +10 bonus but starts a terminal death clock.",
  },
  {
  title: "Drawbacks",
  stats: "Escalating Penalties",
  details:
   "Corruption inflicts self-damage, movement loss, and suffocation. High-level play requires balancing maximum heat with survival.",
  },
 ],

 generationTable: {
  headers: ["Action", "Inferno Change", "Notes"],
  rows: [
  [
   "Cast Fire Spell",
   "+1 to +3",
   "Most offensive spells cause ascension",
  ],
  [
   "Infernal Surge (Lv 5+)",
   "Bonus Damage",
   "Next fire spell deals +2d6 damage",
  ],
  [
   "Cooling Ember",
   "-2 Levels (fixed)",
   "The essential release valve; heals 1d6 + spirit/3 HP",
  ],
  [
   "Scathrach's Bargain",
   "Level 9 (+10)",
   "Disproportionate power; death in 3 of your turns if not cleared",
  ],
  [
   "Rest / Out of Combat",
   "-1 per minute",
   "Short Rest resets to 0; corruption fades with meditation",
  ],
  ],
 },

 usage: {
  momentum:
  "Ascend by casting offensive fire spells. Each level adds flat ember damage to every hit, making multi-hit or AoE spells exponentially more powerful.",
  flourish:
  'Use Cooling Ember to descend and heal. Managing the "Safe Zone" (0-3), "Power Zone" (4-6), and "Danger Zone" (7-9) is the core of the class.',
 },

 overheatRules: {
  title: "Scathrach's Bargain (Level 9)",
  content: `Reaching Inferno Level 9 represents total surrender to Scathrach, the Ashen Sovereign. You are no longer in control. The horror is.

**You have THREE OF YOUR TURNS** to descend below Level 9. At the start of each of your turns while at Inferno Level 9, the death clock ticks down. If you have not descended below Level 9 after 3 of your turns:
- You are **consumed by fire** (Immediate Death, your body detonates in a 30-foot radius of 10d6 ember damage)
- Your soul is **claimed by Scathrach** (Standard resurrection fails, you belong to the furnace now)

**Survival Guide**:
- Use **Cooling Ember** immediately to drop 2 levels (fixed).
- The Apostate's Path can use **Tempered Pact** to manage ascent rate more carefully.
- Do NOT reach Level 9 unless the boss is at <10% HP and your party is out of range of your detonation.`,
 },

 infernoLevelsTable: {
  title: "Inferno Veil: Level Effects & Corruption",
  headers: ["Level", "Bonus", "Drawback", "Inspiration"],
  rows: [
  ["0", "+0", "None", "Mortal"],
  ["1", "+1", "-2 Hit chance (distortions)", "Limbo"],
  ["2", "+2", "1d4 Wyrd dmg/turn", "Lust"],
  ["3", "+3", "-10ft Movement, Fatigue", "Gluttony"],
  ["4", "+4", "+1d6 Damage taken from all sources", "Greed"],
  ["5", "+5", "1d6 Bleeding dmg/turn", "Wrath"],
  [
   "6",
   "+6",
   "Cannot be healed by others, Disadv on Insight/Perception",
   "Heresy",
  ],
  ["7", "+7", "-15ft Speed, 1d6 Suffocation", "Violence"],
  ["8", "+8", "2d4 Self-dmg, Disadv agility", "Fraud"],
  ["9", "+10", "4d8 Self-dmg, Death in 3 Turns, Scathrach Manifests", "Treachery"],
  ],
 },

 corruptionManifestation: {
  title: "Corruption Manifestation: The Flesh Remembers",
  subtitle: "What the Pyrofiend Looks Like at Each Threshold",
  description:
  "Scathrach's influence is not subtle. As the Inferno Veil ascends, the horror rewrites the Pyrofiend's body, transforming meat and bone into a furnace of ruin. These changes are physical, visible to all, and persist until the Veil descends. The DM should use these descriptions to narrate the horror at the table.",
  stages: [
  {
   level: 0,
   title: "The Mortal Husk",
   appearance:
   "Outwardly normal. A faint scent of sulfur clings to their clothes. Skin runs slightly warm, enough to notice, not enough to alarm. The only sign is in their eyes: a barely perceptible amber ring around the pupil that was not there before the pact.",
  },
  {
   level: 1,
   title: "The Flicker Behind the Eyes",
   appearance:
   "The eyes ignite. Not metaphorically, a literal orange light pulses behind the irises, flickering like a candle in wind. The air within arm's reach shimmers with heat distortion. Allies standing nearby feel sudden warmth. Breath comes as steam.",
  },
  {
   level: 2,
   title: "The Veins Darken",
   appearance:
   "Dark lines crawl beneath the skin, veins turning black as Scathrach's ichor replaces blood. Breath fogs as steam even in warm air. The Pyrofiend's shadow flickers: sometimes larger than it should be, sometimes in the wrong direction. Headaches are constant. The mind feels... crowded.",
  },
  {
   level: 3,
   title: "The Sweat of Furnaces",
   appearance:
   "Skin runs hot enough to blister paper on contact. Sweat is replaced by oily residue that evaporates immediately. Minor burns appear spontaneously on palms and forearms, stigmata of the internal furnace. Movement becomes labored, as though wading through thick air. Fatigue is constant and crushing.",
  },
  {
   level: 4,
   title: "The Cracking",
   appearance:
    "Skin begins to glow at every joint, revealing molten ember light beneath, as though the body is a vessel filled with coals. Fingertips are permanently charred. Touching the Pyrofiend deals 1 ember damage. The smell of burning hair is constant.",
  },
  {
   level: 5,
   title: "The Horns and the Whisper",
   appearance:
   "Small blackened horns push through the temples, Scathrach marking its territory in flesh. Veins glow molten orange through the cracks. The voice acquires a metallic, echoing quality, as though speaking through a furnace pipe. The Pyrofiend's shadow now moves independently, twitching, grasping. THIS IS THE THRESHOLD WHERE THE Wyrd-touched WHISPER BEGINS: Scathrach can now force the Pyrofiend to target the nearest living thing, friend or foe.",
  },
  {
   level: 6,
   title: "The Schism of Flesh",
   appearance:
    "Skin glows at every joint, revealing molten ember light beneath. Eyes are solid orange, no pupil, no iris, just burning light. The Pyrofiend can no longer be healed by others; Scathrach's corruption rejects mortal magic. Smoke curls from every orifice. The Pyrofiend speaks in two voices, their own and something ancient. Body temperature ignites dry wood on contact.",
  },
  {
   level: 7,
   title: "The Smoldering Atrocity",
   appearance:
    "Horns curl backward like a crown of charred bone. Smoke pours continuously from mouth and ears. Movement leaves burning footprints that persist for 1 round. The Pyrofiend is barely recognizable as having once been mortal, they are now a shambling furnace, a vessel of hate and fire. Flammable objects within 5 feet ignite spontaneously. Allies give them a wide berth.",
  },
  {
   level: 8,
   title: "The Unraveling",
   appearance:
    "The body distorts. Legs smolder with every step. Arms trail flame like tattered banners. The face is a mask of glowing fissures over seared bone, still recognizably humanoid, but only just. Movement is agonizing, every step costs hit points. Scathrach's voice is now dominant; the original personality screams from behind eyes of solid fire. They leave a trail of ash and embers.",
  },
  {
   level: 9,
   title: "The Death Threshold, Scathrach Made Manifest",
   appearance:
    "BARELY HUMAN. The Pyrofiend is a burning, screaming vessel of living fire held together by will and Wyrd-touched spite. Flesh burns away in sheets, revealing bone that glows white-hot. Scathrach's voice IS the only voice now, the original personality is a passenger, a spectator in their own execution. The death clock begins: 3 of your turns before Scathrach claims you entirely. Your soul becomes fuel. You become the fire. There is no coming back from this except through desperate, immediate descent. If you fail, if the clock runs out, your body detonates in a 30-foot radius of 10d6 ember damage and your soul is dragged into Scathrach's furnace forever. Standard resurrection fails. You are ash. You are finished.",
  },
  ],
 },

 demonicWhisper: {
  title: "The Wyrd-touched Whisper",
  subtitle: "Scathrach's Will Intrudes",
  description: `At Inferno Level 5 and above, Scathrach's grip on the Pyrofiend's mind tightens. The horror whispers, not words, but impulses. Urges. The desire to burn the nearest thing, regardless of allegiance.

**Mechanic**: At the start of each of your turns while at Inferno Level 5 or higher, you must make a **Spirit saving throw** against DC 12 + your current Inferno Level. On a failure, your next offensive action this turn MUST target the nearest living entity (friend or foe). If there are multiple equidistant targets, the DM determines randomly.

**This is not optional.** The Pyrofiend does not choose who they attack, Scathrach chooses. The DM should describe the horror: the Pyrofiend's arm moving against their will, the Wyrd-voice laughing as a fireball streaks toward their own healer.

**Important**: This check is made AFTER the Inferno Level drawback is resolved but BEFORE you take any actions. If you pass the save, you act normally. If you fail, you must still spend the action points and mana for your intended action, you simply cannot choose the target.

**The Apostate's Path Exception**: Pyrofiends following The Apostate's Path specialization gain advantage on this save. Their tempered pact gives them more resistance to Scathrach's direct control, but does not eliminate it entirely.`,
 },

 strategicConsiderations: {
  title: "Managing the Flame",
  content: `**Important, Drawbacks Do Not Stack**: You only suffer the drawback of your current Inferno Level. Lower-level drawbacks are superseded, not cumulative. For example, at Level 5 you suffer 1d6 bleeding per turn, you do NOT also suffer the Level 1 hit penalty, Level 2 wyrd damage, Level 3 movement penalty, or Level 4 damage vulnerability.

**Important, Drawback Timing**: Drawbacks take effect immediately upon ascending to a new Inferno Level. If you ascend from Level 4 to Level 6 in a single turn, you suffer only the Level 6 drawback (not Level 5's bleeding or Level 6's penalty separately, just Level 6). The self-damage drawbacks (Levels 2, 5, 7, 8, 9) apply at the start of each of your turns while at that level.

**Important, Inferno Level Cap**: Your Inferno Level cannot exceed 9. If a spell would cause you to ascend past Level 9, the excess ascension is lost and your level remains at 9.

**Important, Inferno Required (Spell Gating)**: Many spells list an "Inferno Required" cost in addition to mana. You must be at or above that Inferno Level to cast the spell. Plan your ascension so you reach the required level before you need your strongest spells.

**Important, Cold Vulnerability**: The Pyrofiend suffers +50% damage from all Cold/Frost sources (rounded up). and, any Rime damage received forces the Inferno Veil to ascend by +1 as Scathrach's furnace burns hotter to compensate for the internal crystallization. A frost attack does not cool the Pyrofiend down, it makes them burn hotter and die faster.

**Important, The Wyrd-touched Whisper (Level 5+)**: At the start of each turn while at Inferno Level 5+, make a Spirit save (DC 12 + Inferno Level) or be forced to target the nearest entity (friend or foe) with your next offensive action. See the Wyrd-touched Whisper section for full rules.

**The Safe Zone (Lv 0-3)**: Minimal drawbacks. Use this for clearing minor enemies or during exploration. You are consistent but not devastating. Scathrach is patient here. It can afford to be.

**The Power Zone (Lv 4-6)**: The optimal state. High damage bonuses with manageable penalties. Most specializations thrive here. The Wyrd-touched Whisper begins at Level 5, your party must now account for friendly-fire risk. At Level 6, you cannot be healed by others.

**The Danger Zone (Lv 7-9)**: Reserved for finales. The self-damage and speed penalties are brutal. You are dying in real-time. Only enter this zone if you have a clear shot at finishing the encounter or a plan to descend immediately after.

**The Release Valve**: Never enter a turn with 0 Mana if you are above Level 5. You MUST save enough for **Cooling Ember** (4 Mana) to descend if the corruption becomes life-threatening. This is the Mana Tax, the permanent cost of being a living furnace.

**Out of Combat Recovery**: When combat ends, your Inferno Level decreases by 1 per minute of rest. After a Short Rest, it resets to 0. The corruption fades with time and meditation, but it does not vanish instantly. Scathrach always leaves a mark.`,
 },

 playingInPerson: {
  title: "Playing in Person",
  subtitle: "Physical Tracking for Tabletop Play",
  content: `The Inferno Veil is perfectly represented by a single ten-sided die.

**Required Materials**:
- **1d10 (Ten-Sided Die)**, To track your Inferno Level (0-9)
- **Status Cards**, To remind you of your current Level's drawback

**The Descent Loop**:
- **Cast Spell**: Rotate the d10 up by the ascension value (e.g., from 3 to 5).
- **Start of Turn**: Check the die. If it's at 5, take your 1d6 bleeding damage.
- **Cooling Ember**: Roll 1d4, rotate the die down, and roll the appropriate healing.

**Physical Hack**: Use a **Red d10** for the normal levels and keep a **Black d10** nearby. If you reach Level 9, swap to the black die to signal to the party (and the GM) that the death clock has started.`,
 },
 },

 // Specializations
 specializations: {
 title: "Pyrofiend Specializations",
 subtitle: "Three Responses to Scathrach's Hunger",

 description: `Every Pyrofiend chooses how they respond to the parasite living inside them. Each specialization represents a different philosophy, not of power, but of survival. How long can you endure the furnace before Scathrach claims you? The answer depends on which path you walk.`,

 sharedPassive: {
  name: "Veil",
  tier: "Path Passive",
  description:
  "When you ascend to Inferno Level 5 or higher, your next fire spell deals an additional 2d6 ember damage. This effect can only trigger once per ascension event.",
 },

 specs: [
  { id : "inferno",
  name: "Inferno",
  icon: "Fire/Swirling Fireball",
  color: "#FF4500",
  theme: "Pure Destruction",

  description: `The Inferno specialization channels raw, uncontrolled Wyrd-fire. Inferno Pyrofiends are the most aggressive, ascending rapidly and dealing maximum burst damage. They embrace the corruption fully, using it as a weapon.`,

  playstyle:
   "Aggressive burst damage, rapid ascension, high-risk high-reward",

  strengths: [
   "Highest single-target burst damage",
   "Fastest Inferno Level ascension",
   "Powerful execute abilities at high levels",
   "Bonus damage when above Inferno Level 5",
  ],

  weaknesses: [
   "Most vulnerable to drawbacks",
   "Limited defensive options",
   "Requires careful timing",
   "Struggles in prolonged fights",
  ],

  passiveAbilities: [
   {
   name: "Burning Ambition",
   tier: "Specialization Passive",
   description:
    "While at Inferno Level 3 or higher, your fire spells deal +1 damage per die rolled. and, while at Inferno Level 7 or higher, your fire spells crit on the 2 highest die numbers instead of just the highest, and critical hits deal an additional 1d10 ember damage.",
   uniqueTo: "Inferno",
   },
  ],

  recommendedFor:
   "Players who enjoy high-risk gameplay, burst damage, and aggressive tactics",
  },

  { id : "wildfire",
  name: "Wildfire",
  icon: "Fire/Scorching Rune",
  color: "#FF8C00",
  theme: "Spreading Chaos",

  description: `Wildfire Pyrofiends specialize in spreading flames across multiple targets. Their fire jumps from enemy to enemy, creating cascading infernos that consume entire groups. They balance ascension with area control.`,

  playstyle: "Area damage, damage-over-time effects, battlefield control",

  strengths: [
   "Excellent multi-target damage",
   "Strong damage-over-time effects",
   "Fire spreads between enemies",
   "Better sustained damage than Inferno",
  ],

  weaknesses: [
   "Lower single-target burst",
   "Requires enemy grouping",
   "DoT effects take time",
   "Less effective against single bosses",
  ],

  passiveAbilities: [
   {
   name: "Wildfire Spread",
   tier: "Specialization Passive",
   description:
    "When an enemy affected by your burn effect dies, the burn spreads to all enemies within 10 feet, dealing 2d6 ember damage and applying a new burn effect (1d6 ember damage per turn for 3 turns). This effect can only trigger once per round and cannot chain from spread burns.",
   uniqueTo: "Wildfire",
   },
  ],

  recommendedFor:
   "Players who enjoy area control, damage-over-time builds, and tactical positioning",
  },

  { id : "apostate",
  name: "The Apostate's Path",
  icon: "Fire/Burning Ember",
  color: "#6B2020",
  theme: "Controlled Corruption",

  description: `The Apostate walks the razor's edge between mastery and damnation. Where other Pyrofiends surrender to Scathrach's hunger, the Apostate fights for every inch of control, pouring double the mana into each spell to slow the corruption's advance. They do not heal. They do not sustain. They endure. The Apostate's Path is not a road to power; it is a desperate, agonizing bid to delay the inevitable. Every spell costs twice the mana for half the corruption. It is a philosophy of survival through restraint, and it is slowly killing them in a different way.

Apostates burn through their mana reserves at a terrifying rate. They deal less burst damage than Inferno Pyrofiends and lack the area control of Wildfire. What they gain is time, more turns before the death clock, more room to maneuver at high Inferno Levels, and the ability to deliberately push to dangerous thresholds with less risk of losing control. The Apostate's tragedy is that their restraint does not come from discipline. It comes from fear. They have seen what Scathrach truly wants. And they will spend every last drop of mana to deny it.`,

  playstyle:
   "Mana-intensive sustained damage, controlled corruption, endurance over burst",

  strengths: [
   "Ascends Inferno Veil at half the rate, more turns at safe levels",
   "Gains advantage on Wyrd-touched Whisper Spirit saves",
   "Descent via Cooling Ember grants bonus damage on next spell",
   "Can sustain higher Inferno Levels longer than other specs",
  ],

  weaknesses: [
   "ALL fire spells cost DOUBLE mana",
   "Lowest raw damage output of all specs",
   "Mana starvation is a constant, lethal threat",
   "No self-healing whatsoever, every wound is permanent until healed by others (and only below Level 6)",
  ],

  passiveAbilities: [
   {
   name: "Tempered Pact",
   tier: "Specialization Passive",
   description:
    "All fire spells cost double mana but ascend the Inferno Veil at half the rate (rounded down, minimum 0). When you descend Inferno Levels via Cooling Ember, you gain a bonus of +1 to your next fire spell's damage per level descended. This bonus stacks with Inferno Level bonuses and expires after 1 use. and, you gain advantage on Wyrd-touched Whisper Spirit saves.",
   uniqueTo: "The Apostate's Path",
   },
  ],

  recommendedFor:
   "Players who want a resource-management puzzle, controlled escalation, and the tragic fantasy of fighting a losing war against their own Wyrd-touched patron",
  },
 ],
 },

 // Spell Pools - organized by character level
 // Maps character level to available spell IDs for learning
 spellPools: {
 1: [
  // Level 1 starting spells (pick 3)
  // IMPORTANT: Cooling Ember is strongly recommended, without it, you cannot reduce your Inferno Level
  "pyro_ember_spark",
  "pyro_smoldering_touch",
  "pyro_flicker",
  "pyro_cooling_ember",
  "pyro_heat_shield",
  "pyro_living_hearth",
  "pyro_smelters_touch",
  "pyro_hearth_heat",
 ],
 2: [
  // Level 2 spells
  "pyro_scorching_grasp",
  "pyro_flame_lash",
  "pyro_cinder_bolt",
  "pyro_ash_reading",
  "pyro_cauterize",
 ],
 3: [
  // Level 3 spells
  "pyro_fireball",
  "pyro_burning_hands",
  "pyro_flame_step",
  "pyro_cinder_veil",
  "pyro_inferno_blast",
 ],
 4: [
  // Level 4 spells
  "pyro_infernal_blast",
  "pyro_searing_chains",
  "pyro_fiery_aura",
  "pyro_pressure_vent",
  "pyro_slag_bulwark",
 ],
 5: [
  // Level 5 spells
  "pyro_hellfire_wave",
  "pyro_immolation",
  "pyro_fire_whip",
  "pyro_smothering_cloud",
  "pyro_slagfall_field",
 ],
 6: [
  // Level 6 spells
  "pyro_lava_burst",
  "pyro_flame_storm",
  "pyro_infernal_brand_advanced",
  "pyro_heat_sight",
 ],
 7: [
  // Level 7 spells
  "pyro_volcanic_eruption",
  "pyro_hellfire_breath",
  "pyro_demonic_empowerment",
  "pyro_whisper_bridle",
 ],
 8: [
  // Level 8 spells
  "pyro_meteor_shower",
  "pyro_infernal_nova",
  "pyro_phoenix_flame",
  "pyro_obsidian_aegis",
  "pyro_ember_siphon",
 ],
 9: [
  // Level 9 spells
  "pyro_infernal_avatar",
  "pyro_apocalypse",
  "pyro_hellfire_ritual",
  "pyro_veil_rupture",
 ],
 10: [
  // Level 10 spells
  "pyro_brimstone_teleport",
  "pyro_demonic_ascension",
  "pyro_inferno_mastery",
  "pyro_ashen_crucible",
 ],
 },

 // Spells - organized by level, properly formatted for wizard
 spells: [
  { id: "pyro_inferno_blast",
   name: "Inferno Blast",
   description: "Detonate a catastrophic sphere of volcanic ember fire in a 20 ft radius up to 60 ft away, dealing 4d6 ember damage and leaving burning ash ground.",
   level: 3,
   spellType: "ACTION",
   icon: "Fire/Flame Burst",
   effectTypes: ["damage", "control"],
   typeConfig: { school: "ember", icon: "Fire/Flame Burst", tags: ["utility", "damage", "fireball", "pyrofiend"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "ranged", rangeDistance: 60, areaSize: 20 },
   resourceCost: { actionPoints: 2, mana: 6 },
   damageConfig: { formula: "4d6 + intelligence", damageTypes: ["ember"], resolution: "DICE" },
   controlConfig: {
     controlType: "zone",
     duration: 2,
     durationUnit: "rounds",
     effects: [
       { id: "inferno_blast_ash_ground", name: "Burning Ash Ground", description: "The blast leaves burning ash ground that hazards creatures crossing it.", config: { zoneType: "difficult_terrain", duration: 2, durationUnit: "rounds" } }
     ]
   },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 2 },
   tags: ["utility", "fireball", "pyrofiend"]
  },
  { id: "pyro_hearth_heat",
   name: "Hearth Heat",
   description: "Radiate internal volcanic heat to warm your party in freezing blizzard conditions for 1 hour, granting immunity to environmental freezing damage.",
   level: 1,
   spellType: "ACTION",
   icon: "Fire/Burning Ember",
   effectTypes: ["utility"],
   typeConfig: { school: "ember", icon: "Fire/Enveloping Fire", tags: ["utility", "heat", "warmth", "pyrofiend"], castTime: 1, castTimeType: "IMMEDIATE" },
   targetingConfig: { targetingType: "area", rangeType: "self_centered", areaSize: 30 },
   resourceCost: { actionPoints: 1, mana: 2 },
   resolution: "NONE",
   utilityConfig: {
     utilityType: "environment",
     selectedEffects: [
       { id: "hearth_heat_warmth", name: "Volcanic Warmth", description: "Warm your party in freezing blizzard conditions for 1 hour, granting immunity to environmental freezing damage.", mechanicsText: "Party immune to environmental freezing, 1 hour." }
     ],
     duration: 1,
     durationUnit: "hours",
     concentration: false,
     power: "minor"
   },
   cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
   tags: ["utility", "heat", "pyrofiend"]
  },
 // ========================================
 // LEVEL 1 STARTING SPELLS (5 options, pick 3)
 // Weak starter spells - intentionally low power
 // ========================================
 { id: "pyro_ember_spark",
  name: "Ember Spark",
  description:
  "Scathrach gifts a malevolent spark compressed into a projectile. It burrows into flesh and ignites an unquenchable smolder: initial ember damage plus a burn consuming the target for 2 rounds.",
  level: 1,
  spellType: "ACTION",
  icon: "Fire/Flame Burst",

  typeConfig: {
  school: "ember",
  icon: "Fire/Flame Burst",
  tags: ["ember", "damage", "dot", "starter"],
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 , classResource: { type: "inferno_veil", gain: 1 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Scathrach, exuro!",
  somaticText:
   "Snap fingers together, a malevolent red-orange spark forming and launching forward",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "1d6",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "1d4",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 2,
   canStack: false,
   maxStacks: 1,
  },
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "dot", "starter"],
 },

 { id: "pyro_smoldering_touch",
  name: "Smoldering Touch",
  description:
  "Your hand glows with Scathrach's contempt. Press it into flesh, searing through Durability and DR and leaving a smolder of 1d4 ember per round for 2 rounds. Not a spell; an imposition.",
  level: 1,
  spellType: "ACTION",
  icon: "Fire/Fire Bolt",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fire Bolt",
  tags: ["ember", "damage", "touch", "dot", "starter"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "single",
  rangeType: "touch",
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 4, inferno_ascend: 1, inferno_required: 0 , classResource: { type: "inferno_veil", gain: 1 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Ardeo!",
  somaticText: "Touch with glowing hand",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "1d8 + intelligence/3",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "1d4",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 2,
   canStack: false,
   maxStacks: 1,
  },
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "touch", "dot", "starter"],
 },

 { id: "pyro_flicker",
  name: "Flicker",
  description:
  "A quick flash of Scathrach's spite streaks out: small, precise, igniting instantly and trailing heat. The horror flicking a match; dismissive, casual, enough to set the world alight.",
  level: 1,
  spellType: "ACTION",
  icon: "Fire/Fiery Symbol",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fiery Symbol",
  tags: ["ember", "damage", "starter"],
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 3, inferno_ascend: 1, inferno_required: 0 , classResource: { type: "inferno_veil", gain: 1 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal"],
  verbalText: "Flicker!",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "1d6 + intelligence/4",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "starter"],
 },

 { id: "pyro_cooling_ember",
  name: "Cooling Ember",
  description:
  "Press a hand to your chest and will the furnace to dim. Scathrach screams; the heat draws back, soothing your corrupted flesh and restoring some health. The Mana Tax costs mana you cannot afford.",
  level: 1,
  spellType: "ACTION",
  icon: "Fire/Dragon Breath",

  typeConfig: {
  school: "ember",
  icon: "Fire/Dragon Breath",
  tags: ["ember", "healing", "utility", "starter"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_descend", "inferno_required"],
  resourceValues: { mana: 4, inferno_descend: 2, inferno_required: 0 },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Pax Ignis",
  somaticText: "Place hand over heart",
  },

  effectTypes: ["healing"],

  healingConfig: {
  formula: "1d6 + spirit/3",
  healingType: "direct",
  resolution: "DICE",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "healing", "utility", "starter"],
 },

 { id: "pyro_heat_shield",
  name: "Heat Shield",
  description:
  "Pull Scathrach's heat outward into a superheated barrier; attacks passing through are warped and dissipated by thermal distortion. A fragment of the horror's own defenses, borrowed.",
  level: 1,
  spellType: "ACTION",
  icon: "Radiant/Radiant Divinity",

  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Divinity",
  tags: ["ember", "buff", "defensive", "starter"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_descend", "inferno_required"],
  resourceValues: { mana: 4, inferno_descend: 1, inferno_required: 0 },
  useFormulas: {},
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Scutum Calor!",
  somaticText: "Raise hands to create barrier",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "statEnhancement",
  effects: [
   { id : "heat_shield_damage_reduction",
   name: "Heat Shield",
   description:
    "+2 Damage Reduction for 2 rounds. The heat shield absorbs and disperses incoming attacks, reducing the damage that reaches you.",
   mechanicsText: "",
   statModifier: {
    stat: "damage_reduction",
    magnitude: 2,
    magnitudeType: "flat",
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
  cooldownValue: 0,
  },

  tags: ["ember", "buff", "defensive", "starter"],
 },

 // ========================================
 // LEVEL 2 SPELLS
 // ========================================
 { id: "pyro_scorching_grasp",
  name: "Scorching Grasp",
  description:
  "Flames engulf your hand. Seize the enemy: fire clings, searing through Durability and DR for 2d8 + INT/2 ember, then burning 1d4 per round for 2 rounds. The mark says: property of the Ashen Sovereign.",
  level: 2,
  spellType: "ACTION",
  icon: "Fire/Scorching Rune",

  typeConfig: {
  school: "ember",
  icon: "Fire/Scorching Rune",
  tags: ["ember", "damage", "touch"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "single",
  rangeType: "touch",
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 1, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Ardeo!",
  somaticText: "Grasp with burning hand",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "2d8 + intelligence/2",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "1d4",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 2,
   canStack: false,
   maxStacks: 1,
  },
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 2,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "touch"],
 },

 { id: "pyro_flame_lash",
  name: "Flame Lash",
  description:
  "A whip of condensed fire lashes from your palm, coiling an enemy and dragging them toward you. The flames sear as they grip; they feel Scathrach's hunger pulling them close.",
  level: 2,
  spellType: "ACTION",
  icon: "Fire/Sun Symbol",

  typeConfig: {
  school: "ember",
  icon: "Fire/Sun Symbol",
  tags: ["ember", "damage", "control"],
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 8, inferno_ascend: 1, inferno_required: 1 , classResource: { type: "inferno_veil", gain: 1, minVeil: 1 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Flagellum Ignis!",
  somaticText: "Whip hand forward",
  },

  effectTypes: ["damage", "control"],

  damageConfig: {
  formula: "2d6 + intelligence/3",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  controlConfig: {
  controlType: "forcedMovement",
  strength: "weak",
  duration: 0,
  durationUnit: "instant",
  savingThrow: {
   ability: "strength",
   difficultyClass: 14,
   saveOutcome: "negates",
  },
  effects: [
   { id : "pull",
   name: "Pull",
   description:
    "Pulls the target 15 feet toward the caster. DC 14 strength check negates.",
   config: {
    movementType: "pull",
    distance: 15,
   },
   },
  ],
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "control"],
 },

 { id: "pyro_cinder_bolt",
  name: "Cinder Bolt",
  description:
  "Compress Scathrach's hatred into a bolt of cinders and hurl it. On impact it detonates, showering the area in sparks and slag. A small explosion by Pyrofiend standards; a catastrophe by anyone else's.",
  level: 2,
  spellType: "ACTION",
  icon: "Fire/Swirling Fireball",

  typeConfig: {
  school: "ember",
  icon: "Fire/Swirling Fireball",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 60,
  aoeShape: "circle",
  aoeParameters: { radius: 5 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 8, inferno_ascend: 2, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 2, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Cinis Sagitta!",
  somaticText: "Hurl cinder bolt",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "2d6 + intelligence/2",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "aoe"],
 },

 // ========================================
 // LEVEL 3 SPELLS
 // ========================================
 { id: "pyro_fireball",
  name: "Fireball",
  description:
  "A sphere of condensed Wyrd-fire streaks to a chosen point and detonates, engulfing all within range. The spell that earned the Pyrofiend its reputation; and its body count.",
  level: 3,
  spellType: "ACTION",
  icon: "Fire/Swirling Fireball",

  typeConfig: {
  school: "ember",
  icon: "Fire/Swirling Fireball",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 100,
  aoeShape: "sphere",
  aoeParameters: { radius: 10 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 12, inferno_ascend: 2, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 2, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Ignis Globus!",
  somaticText: "Hurl ball of flame",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "3d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2,
   critDiceOnly: false,
   critEffects: ["burning"],
   burningConfig: {
   damagePerRound: "1d6",
   duration: 2,
   durationUnit: "rounds",
   saveDC: 15,
   saveType: "constitution",
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_burning_hands",
  name: "Burning Hands",
  description:
  "Spread your fingers and Scathrach exhales through your palms: a cone of Wyrd-fire scorches a 20-foot arc. Close-range devastation for when the enemy is too close; exactly when Scathrach is happiest.",
  level: 3,
  spellType: "ACTION",
  icon: "Fire/Flame Burst",

  typeConfig: {
  school: "ember",
  icon: "Fire/Flame Burst",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "cone",
  aoeParameters: { length: 20 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 10, inferno_ascend: 2, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 2, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Manus Ardens!",
  somaticText: "Spread fingers wide",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "3d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  chanceOnHitConfig: {
   enabled: true,
   procType: "dice",
   diceThreshold: 17,
   procChance: 20,
   customEffects: ["burning"],
   burningConfig: {
   damagePerRound: "1d4",
   duration: 2,
   durationUnit: "rounds",
   saveDC: 14,
   saveType: "constitution",
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_flame_step",
  name: "Flame Step",
  description:
  "Step through a tear carved by Scathrach's fire: vanish in flame and reappear nearby, leaving fire at both departure and arrival. Not graceful; violent, disorienting, smelling of burnt air.",
  level: 3,
  spellType: "ACTION",
  icon: "Fire/Burning Ember",

  typeConfig: {
  school: "ember",
  icon: "Fire/Burning Ember",
  tags: ["ember", "utility", "teleport"],
  castTime: 0,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 12, inferno_ascend: 1, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 1, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 1, // Utility spell
  components: ["verbal"],
  verbalText: "Saltus Ignis!",
  },

  effectTypes: ["utility", "damage"],

  utilityConfig: {
  utilityType: "movement",
  selectedEffects: [
   { id : "teleport",
   name: "Teleport",
   distance: 30,
   needsLineOfSight: true,
   },
  ],
  duration: 0,
  durationUnit: "instant",
  concentration: false,
  power: "minor",
  },

  damageConfig: {
  formula: "1d6",
  damageTypes: ["ember"],
  resolution: "AUTOMATIC",
  },

  propagation: {
  method: "explosion",
  behavior: "aoe",
  secondaryRadius: 5,
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 1,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 2,
  },

  tags: ["ember", "utility", "teleport"],
 },

 // ========================================
 // LEVEL 4 SPELLS
 // ========================================
 { id: "pyro_infernal_blast",
  name: "Infernal Blast",
  description:
  "A concentrated blast of Scathrach's purest hatred sears through defenses: 5d6 + INT ember. At Inferno Level 4+ the corruption surges for an extra 2d6. Not fire; annihilation wearing fire as a mask.",
  level: 4,
  spellType: "ACTION",
  icon: "Fire/Infernal Fire",

  typeConfig: {
  school: "ember",
  icon: "Fire/Infernal Fire",
  tags: ["ember", "damage"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 80,
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 1 , classResource: { type: "inferno_veil", gain: 2, minVeil: 1 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Infernus Ictus!",
  somaticText: "Thrust palm forward",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "5d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  triggerConfig: {
  conditionalEffects: {
   damage: {
   isConditional: true,
   defaultEnabled: true,
   baseFormula: "5d6 + intelligence",
   conditionalFormulas: {
    inferno_4_plus: "7d6 + intelligence",
    default: "5d6 + intelligence",
   },
   },
  },
  effectTriggers: {
   damage: {
   logicType: "OR",
   compoundTriggers: [
    { id : "resource_threshold",
    category: "health",
    name: "Inferno Level 4+",
    parameters: {
     resource_type: "inferno",
     threshold_value: 4,
     threshold_type: "flat",
     comparison: "greater_than",
     perspective: "self",
    },
    },
   ],
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage"],
 },

 { id: "pyro_searing_chains",
  name: "Searing Chains",
  description:
  "Burning chains lash between enemies for 3d6 + INT ember, tethering them. Jumps deal 75% and ignite for 1d6 ember/round for 2 rounds, leaping to 3 more within 15ft. They bind as they burn.",
  level: 4,
  spellType: "ACTION",
  icon: "Fire/Scorching Rune",

  typeConfig: {
  school: "ember",
  icon: "Fire/Scorching Rune",
  tags: ["ember", "damage", "chain"],
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 1 , classResource: { type: "inferno_veil", gain: 2, minVeil: 1 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Catena Infernus!",
  somaticText: "Whip arm forward, chains of fire erupt",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "3d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  chainConfig: {
   enabled: true,
   maxChains: 3,
   chainRange: 15,
   damageMultiplier: 0.75,
   damageTypes: ["ember"],
  },
  dotConfig: {
   enabled: true,
   damagePerTick: "1d6",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 2,
   canStack: false,
   maxStacks: 1,
  },
  },

  propagation: {
  method: "chain",
  behavior: "bounce",
  count: 3,
  range: 15,
  decay: 0.75,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 1,
  },

  tags: ["ember", "damage", "chain"],
 },

 { id: "pyro_fiery_aura",
  name: "Fiery Aura",
  description:
  "Open the furnace door: an aura of contempt deals 2d6 ember to any enemy within 5ft. Persists up to 3 rounds while you concentrate; a pulsing reminder that you are not safe to stand near.",
  level: 4,
  spellType: "CHANNELED",
  icon: "Fire/Fire Orb",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fire Orb",
  tags: ["ember", "damage", "channeled"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  maxChannelDuration: 3,
  durationUnit: "ROUNDS",
  interruptible: true,
  movementAllowed: true,
  tickFrequency: "START_OF_TURN",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 2, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Aura Ignis!",
  somaticText: "Spread arms wide",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "2d6",
  damageTypes: ["ember"],
  resolution: "DICE",
  triggerCondition: "area_entry",
  triggerDescription:
   "Enemies within 5 feet take 2d6 ember damage at the start of each of their turns",
  areaShape: "circle",
  areaParameters: { radius: 5 },
  },

  channelingConfig: {
  type: "persistent",
  baseFormula: "2d6",
  tickFrequency: "round",
  maxDuration: 3,
  durationUnit: "rounds",
  persistentEffectType: "aura",
  persistentRadius: 5,
  interruptible: true,
  movementAllowed: true,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "channeled"],
 },

 { id: "pyro_pressure_vent",
  name: "Pressure Vent",
  description: "Vent 3 Inferno Veil in a violent rupture: take 1d6 self-damage, then move 20 feet without provoking opportunity attacks, leaving a smoke shroud that grants concealment until your next turn.",
  level: 4,
  spellType: "ACTION",
  icon: "Fire/Fiery Steps",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fiery Steps",
  tags: ["ember", "utility", "movement", "veil", "pyrofiend"],
  castTime: 0,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_descend", "inferno_required"],
  resourceValues: { mana: 8, inferno_descend: 3, inferno_required: 0 },
  useFormulas: {},
  actionPoints: 1,
  components: ["somatic"],
  somaticText: "Clap both palms over your forearm vents and blow the furnace out",
  },

  effectTypes: ["utility"],

  utilityConfig: {
  utilityType: "movement",
  selectedEffects: [
   { id : "pressure_vent_burst",
   name: "Exhaust Burst",
   description: "Vent 3 Inferno Veil, take 1d6 self-damage, and move up to 20 feet without provoking opportunity attacks.",
   mechanicsText: "Vent 3 Veil; 1d6 self; 20 ft free move.",
   },
   { id : "pressure_vent_smoke",
   name: "Trailing Shroud",
   description: "Leave a 5-foot smoke cloud at your origin that grants you concealment until the start of your next turn.",
   mechanicsText: "Concealment until start of next turn.",
   },
  ],
  duration: 0,
  durationUnit: "instant",
  concentration: false,
  power: "major",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 2,
  },

  tags: ["ember", "utility", "movement", "veil", "pyrofiend"],
 },

 { id: "pyro_slag_bulwark",
  name: "Slag Bulwark",
  description: "Molten slag hardens over your body. Gain a shield equal to 10 + 3 per Inferno Veil level for 3 rounds; melee attackers take 1d6 ember damage. Casting it raises Veil by 1.",
  level: 4,
  spellType: "ACTION",
  icon: "Fire/Burning Forge",

  typeConfig: {
  school: "ember",
  icon: "Fire/Burning Forge",
  tags: ["ember", "buff", "defensive", "veil", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 12, inferno_ascend: 1, inferno_required: 1 , classResource: { type: "inferno_veil", gain: 1, minVeil: 1 } },
  useFormulas: {},
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Scutum Scoriae!",
  somaticText: "Pour slag down your arms and let it set",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "shield",
  effects: [
   { id : "slag_bulwark_shield",
   name: "Slag Bulwark",
   description: "Absorbs 10 + 3 per Inferno Veil level damage until depleted, or until 3 rounds pass.",
   mechanicsText: "Shield 10 + 3xVeil; expires after 3 rounds.",
   shieldAmount: "10 + 3 * inferno_veil_level",
   shieldDuration: 3,
   shieldDurationType: "rounds",
   },
   { id : "slag_bulwark_retaliation",
   name: "Molten Backlash",
   description: "A melee attacker that strikes the shield takes 1d6 ember damage.",
   mechanicsText: "Retaliation: 1d6 ember to melee attackers.",
   retaliationDamage: { formula: "1d6", damageType: "ember" },
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

  tags: ["ember", "buff", "defensive", "veil", "pyrofiend"],
 },

 // ========================================
 // LEVEL 5 SPELLS
 // ========================================
 { id: "pyro_hellfire_wave",
  name: "Hellfire Wave",
  description:
  "Scathrach opens its mouth through yours: a 30ft cone of hellfire for 8d6 + INT ember. Those caught are Cinder-Marked for 2 rounds (+1d6 ember, no stealth). They do not burn. They cease.",
  level: 5,
  spellType: "ACTION",
  icon: "Fire/Fiery Symbol",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fiery Symbol",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "cone",
  aoeParameters: { length: 30 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 20, inferno_ascend: 2, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 2, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Infernus Unda!",
  somaticText: "Sweep arms forward",
  },

  effectTypes: ["damage", "debuff"],

  damageConfig: {
  formula: "8d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  debuffConfig: {
  debuffType: "mark",
  effects: [
   { id : "cinder_marked",
   name: "Cinder-Marked",
   description: "Marked by Scathrach for 2 rounds: takes +1d6 ember damage from each of your ember spells, and cannot benefit from stealth or invisibility.",
   mechanicsText: "Marked 2 rounds: +1d6 ember per ember spell; stealth/invisibility denied.",
   },
  ],
  durationValue: 2,
  durationType: "rounds",
  durationUnit: "rounds",
  canBeDispelled: false,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_immolation",
  name: "Immolation",
  description:
  "Designate a target for Scathrach's obsession: 6d8 + INT/2 ember now, then 1d6 + INT/4 per round for 3 rounds. It screams; Scathrach hums; you try not to think what that says about you.",
  level: 5,
  spellType: "ACTION",
  icon: "Fire/Enveloping Fire",

  typeConfig: {
  school: "ember",
  icon: "Fire/Enveloping Fire",
  tags: ["ember", "damage", "dot"],
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 20, inferno_ascend: 3, inferno_required: 3 , classResource: { type: "inferno_veil", gain: 3, minVeil: 3 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Immolatio!",
  somaticText: "Clench fist",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "6d8 + intelligence/2",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "1d6 + intelligence/4",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 3,
   canStack: false,
   maxStacks: 1,
  },
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "dot"],
 },

 { id: "pyro_fire_whip",
  name: "Fire Whip",
  description:
  "A whip of infernal fury; the idea of fire made violent. It strikes for 7d6 + INT ember and may stun as Scathrach's malice overwhelms the nerves. The horror's tongue tastes what it strikes.",
  level: 5,
  spellType: "ACTION",
  icon: "Fire/Sun Symbol",

  typeConfig: {
  school: "ember",
  icon: "Fire/Sun Symbol",
  tags: ["ember", "damage"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 40,
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 18, inferno_ascend: 2, inferno_required: 3 , classResource: { type: "inferno_veil", gain: 2, minVeil: 3 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Flagellum Infernus!",
  somaticText: "Crack whip motion",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "7d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  chanceOnHitConfig: {
   enabled: true,
   procType: "dice",
   diceThreshold: 18,
   procChance: 15,
   customEffects: ["stun"],
   stunConfig: {
   duration: 1,
   durationUnit: "round",
   saveDC: 14,
   saveType: "constitution",
   },
  },
  savingThrow: {
   ability: "constitution",
   difficultyClass: 14,
   saveOutcome: "negates",
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 2,
  },

  tags: ["ember", "damage"],
 },

 { id: "pyro_smothering_cloud",
  name: "Smothering Cloud",
  description: "Conjure a 20-foot radius cloud of scalding ash-smoke within 50 feet for 3 rounds. Enemies inside are blinded (DC 14 Constitution save negates); you and your allies see through it and are unaffected.",
  level: 5,
  spellType: "ACTION",
  icon: "Fire/Smoking",

  typeConfig: {
  school: "ember",
  icon: "Fire/Smoking",
  tags: ["ember", "control", "zone", "smoke", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 50,
  aoeShape: "circle",
  aoeParameters: { radius: 20 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 14, inferno_ascend: 1, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 1, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Fumus Suffocans!",
  somaticText: "Exhale a rolling wall of ash-smoke",
  },

  effectTypes: ["control"],

  controlConfig: {
  controlType: "zone",
  duration: 3,
  durationUnit: "rounds",
  savingThrow: {
   ability: "constitution",
   difficultyClass: 14,
   saveOutcome: "negates",
  },
  effects: [
   { id : "smothering_blinded",
   name: "Blinded",
   description: "Enemies inside the cloud are blinded: disadvantage on attack rolls and they cannot make opportunity attacks. You and your allies ignore the cloud.",
   config: {
    zoneType: "obscured",
    saveType: "constitution",
    saveDC: 14,
    duration: 3,
    durationUnit: "rounds",
   },
   },
  ],
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 2,
  },

  tags: ["ember", "control", "zone", "smoke", "pyrofiend"],
 },

 { id: "pyro_slagfall_field",
  name: "Slagfall Field",
  description: "Blanket a 15-foot radius within 60 feet in gripping molten slag for 3 rounds: difficult terrain, and creatures entering it make a DC 15 Strength save or are restrained until the end of their turn.",
  level: 5,
  spellType: "ACTION",
  icon: "Fire/Melt",

  typeConfig: {
  school: "ember",
  icon: "Fire/Melt",
  tags: ["ember", "control", "zone", "hazard", "pyrofiend"],
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 16, inferno_ascend: 2, inferno_required: 2 , classResource: { type: "inferno_veil", gain: 2, minVeil: 2 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Lapsus Scoriae!",
  somaticText: "Drag a fistful of slag across the ground",
  },

  effectTypes: ["control"],

  controlConfig: {
  controlType: "restraint",
  duration: 3,
  durationUnit: "rounds",
  savingThrow: {
   ability: "strength",
   difficultyClass: 15,
   saveOutcome: "negates",
  },
  effects: [
   { id : "slagfall_restrained",
   name: "Gripped by Slag",
   description: "Creatures entering the field or starting their turn there make a DC 15 Strength save or are restrained until the end of their turn. The field is difficult terrain.",
   config: {
    restraintType: "physical",
    breakOnDamage: false,
    condition: "restrained",
    saveType: "strength",
    saveDC: 15,
    duration: 3,
    durationUnit: "rounds",
   },
   },
  ],
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 3,
  },

  tags: ["ember", "control", "zone", "hazard", "pyrofiend"],
 },

 // ========================================
 // LEVEL 6 SPELLS
 // ========================================
 { id: "pyro_lava_burst",
  name: "Lava Burst",
  description:
  "Slam your fists down and Scathrach boils the earth: a 15ft lava burst for 9d6 + INT ember; the crater stays molten 2 rounds (1d6 at turn start). At Inferno Level 7+ it deepens to 16d6 + INT×2.",
  level: 6,
  spellType: "ACTION",
  icon: "Fire/Dripping Lava",

  typeConfig: {
  school: "ember",
  icon: "Fire/Dripping Lava",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 80,
  aoeShape: "circle",
  aoeParameters: { radius: 15 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 24, inferno_ascend: 3, inferno_required: 3 , classResource: { type: "inferno_veil", gain: 3, minVeil: 3 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic", "material"],
  verbalText: "Terra Ignea!",
  somaticText: "Slam fist downward",
  materialComponents: "A piece of volcanic rock",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "9d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2,
   critDiceOnly: false,
   critEffects: ["burning"],
   burningConfig: {
   damagePerRound: "1d6",
   duration: 2,
   durationUnit: "rounds",
   saveDC: 15,
   saveType: "constitution",
   },
  },
  dotConfig: {
   enabled: true,
   damagePerTick: "1d6",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 2,
   canStack: false,
   maxStacks: 1,
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_flame_storm",
  name: "Flame Storm",
  description:
  "Raise your arms and Scathrach screams skyward: a firestorm descends on a 20ft radius for 8d6 + INT ember, then 2d6 + INT/2 per round for 3 rounds. The horror's rage made manifest.",
  level: 6,
  spellType: "ACTION",
  icon: "Fire/Swirling Fireball",

  typeConfig: {
  school: "ember",
  icon: "Fire/Swirling Fireball",
  tags: ["ember", "damage", "aoe", "dot"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 100,
  aoeShape: "circle",
  aoeParameters: { radius: 20 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 4 , classResource: { type: "inferno_veil", gain: 2, minVeil: 4 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Tempestas Ignis!",
  somaticText: "Raise arms and swirl",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "8d6 + intelligence",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "2d6 + intelligence/2",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 3,
   canStack: false,
   maxStacks: 1,
  },
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 3,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 3,
  },

  tags: ["ember", "damage", "aoe", "dot"],
 },

 { id: "pyro_infernal_brand_advanced",
  name: "Infernal Brand (Advanced)",
  description:
  "Carve Scathrach's sigil into an enemy: 4d6 + INT/3 ember now, then 2d6 + INT/2 per round for 4 rounds. It saps their strength as Scathrach feeds through the mark. Branded for the furnace.",
  level: 6,
  spellType: "ACTION",
  icon: "Fire/Fiery Symbol",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fiery Symbol",
  tags: ["ember", "damage", "dot", "debuff"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "single",
  rangeType: "ranged",
  rangeDistance: 70,
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 22, inferno_ascend: 2, inferno_required: 4 , classResource: { type: "inferno_veil", gain: 2, minVeil: 4 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Sigillum Infernus!",
  somaticText: "Draw burning sigil",
  },

  effectTypes: ["damage", "debuff"],

  damageConfig: {
  formula: "4d6 + intelligence/3",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "2d6 + intelligence/2",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 4,
   canStack: false,
   maxStacks: 1,
  },
  },

  debuffConfig: {
  debuffType: "statPenalty",
  effects: [
   { id : "weakened",
   name: "Weakened",
   description:
    "The target's physical power is diminished by the searing heat, making them weaker and less effective in combat. The infernal brand saps their strength as it burns.",
   mechanicsText: "",
   statModifier: {
    stat: "strength",
    magnitude: 2,
    magnitudeType: "flat",
   },
   },
  ],
  durationValue: 4,
  durationType: "rounds",
  durationUnit: "rounds",
  canBeDispelled: true,
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 0,
  },

  tags: ["ember", "damage", "dot", "debuff"],
 },

 { id: "pyro_heat_sight",
  name: "Heat-Sight",
  description: "Read the thermal signature of everything within 60 feet for 3 rounds. You see invisible and hidden creatures, see through smoke and fog, and gain advantage on Perception checks against living targets.",
  level: 6,
  spellType: "ACTION",
  icon: "Utility/Watchful Eye",

  typeConfig: {
  school: "ember",
  icon: "Utility/Watchful Eye",
  tags: ["ember", "utility", "detection", "perception", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_required"],
  resourceValues: { mana: 12, inferno_required: 0 },
  useFormulas: {},
  actionPoints: 1,
  components: ["verbal", "somatic"],
  verbalText: "Oculi Ignis!",
  somaticText: "Press two fingers to your temples and let the heat in",
  },

  effectTypes: ["utility"],

  utilityConfig: {
  utilityType: "perception",
  selectedEffects: [
   { id : "heat_sight_thermals",
   name: "Thermal Vision",
   description: "For 3 rounds you perceive heat signatures: invisible and hidden creatures within 60 feet are revealed to you, smoke and fog do not obscure your sight, and you have advantage on Perception checks against living targets.",
   mechanicsText: "Reveal invisible/hidden 60 ft; see through smoke/fog; advantage on Perception vs living; 3 rounds.",
   },
  ],
  duration: 3,
  durationUnit: "rounds",
  concentration: false,
  power: "major",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 3,
  },

  tags: ["ember", "utility", "detection", "perception", "pyrofiend"],
 },

 // ========================================
 // LEVEL 7 SPELLS
 // ========================================
 { id: "pyro_volcanic_eruption",
  name: "Volcanic Eruption",
  description:
  "Command the earth to open: a 25ft eruption of magma and ash for 12d6 + INT×2 ember (DC 16 Agility half). At Inferno Level 7+ it deepens to 16d6 + INT×2. Only shapes remain in the slag.",
  level: 7,
  spellType: "ACTION",
  icon: "Fire/Flowing Lava",

  typeConfig: {
  school: "ember",
  icon: "Fire/Flowing Lava",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
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
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 28, inferno_ascend: 3, inferno_required: 6 , classResource: { type: "inferno_veil", gain: 3, minVeil: 6 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic", "material"],
  verbalText: "Eruptio Volcanica!",
  somaticText: "Slam both hands down",
  materialComponents: "Volcanic ash",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "12d6 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2,
   critDiceOnly: false,
   extraDice: "2d6",
   critEffects: ["burning", "knockback"],
   burningConfig: {
   damagePerRound: "2d6",
   duration: 3,
   durationUnit: "rounds",
   saveDC: 16,
   saveType: "constitution",
   },
   knockbackConfig: {
   distance: 10,
   },
  },
  savingThrow: {
   ability: "agility",
   difficultyClass: 16,
   saveOutcome: "half_damage",
  },
  },

  triggerConfig: {
  effectTriggers: {
   damage: {
   logicType: "OR",
   compoundTriggers: [
    { id : "resource_threshold",
    category: "health",
    name: "High Inferno Level",
    parameters: {
     resource_type: "inferno",
     threshold_type: "percentage",
     percentage: 70,
     comparison: "greater_than",
     perspective: "self",
    },
    },
   ],
   },
  },
  conditionalEffects: {
   damage: {
   isConditional: true,
   defaultEnabled: true,
   baseFormula: "12d6 + intelligence * 2",
   conditionalFormulas: {
    resource_threshold_70: "16d6 + intelligence * 2",
   },
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 2,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_hellfire_breath",
  name: "Hellfire Breath",
  description:
  "Inhale, and Scathrach exhales through you: a 40ft cone of hellfire for 10d6 + INT×2 ember. Not a spell; regurgitation. Anything caught was always on fire; it simply did not know until now.",
  level: 7,
  spellType: "ACTION",
  icon: "Fire/Flame Burst",

  typeConfig: {
  school: "ember",
  icon: "Fire/Flame Burst",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "cone",
  aoeParameters: { length: 40 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 26, inferno_ascend: 3, inferno_required: 5 , classResource: { type: "inferno_veil", gain: 3, minVeil: 5 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Halitus Infernus!",
  somaticText: "Inhale deeply and exhale",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "10d6 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2.5,
   critDiceOnly: false,
   extraDice: "3d8",
   critEffects: ["burning"],
   burningConfig: {
   damagePerRound: "2d8",
   duration: 4,
   durationUnit: "rounds",
   saveDC: 17,
   saveType: "constitution",
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 3,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_demonic_empowerment",
  name: "Ember Empowerment",
  description:
  "Open yourself to Scathrach for 5 rounds: +5 ember damage on ember attacks; enemies within 5ft take 1d6 ember from round 3; your ember resistance doubles at round 5. Interest is your soul.",
  level: 7,
  spellType: "CHANNELED",
  icon: "Utility/Powerful Warrior",

  typeConfig: {
  school: "ember",
  icon: "Utility/Powerful Warrior",
  tags: ["ember", "buff"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 24, inferno_ascend: 2, inferno_required: 5 , classResource: { type: "inferno_veil", gain: 2, minVeil: 5 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Potentia Daemonis!",
  somaticText: "Clench fists and channel",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "statEnhancement",
  effects: [
   { id : "fireDamageBoost",
   name: "Ember Damage Boost",
   description:
    "Ember damage increased by +5 for 5 rounds. All fire-based attacks deal additional damage as Wyrd-power flows through your spells and abilities.",
   mechanicsText: "",
   statModifier: {
    stat: "fire_spell_power",
    magnitude: 5,
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

  channelingConfig: {
  type: "power_up",
  maxDuration: 5,
  durationUnit: "rounds",
  interruptible: true,
  movementAllowed: false,
  stages: [
   {
   threshold: 1,
   effect: "+5 Ember Damage",
   description: "Wyrd-empowerment active",
   },
   {
   threshold: 3,
   effect: "+5 Ember Damage + Burning Aura",
   description:
    "Wyrd-power intensifies, enemies within 5 ft take 1d6 ember",
   },
   {
   threshold: 5,
   effect: "+5 Ember Damage + Burning Aura + Inferno Resistance",
   description:
    "Full Wyrd-empowerment, ember damage taken reduced by 50%",
   },
  ],
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 5,
  },

  tags: ["ember", "buff"],
 },

 { id: "pyro_whisper_bridle",
  name: "Whisper Bridle",
  description: "Seize the Whisper's leash for 3 rounds: advantage on Spirit saves against it, and your ember area spells can exclude up to 3 allies. Casting it raises Veil by 2.",
  level: 7,
  spellType: "ACTION",
  icon: "Force/Break Chains",

  typeConfig: {
  school: "ember",
  icon: "Force/Break Chains",
  tags: ["ember", "buff", "control", "veil", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 18, inferno_ascend: 2, inferno_required: 4 , classResource: { type: "inferno_veil", gain: 2, minVeil: 4 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Frenum Susurri!",
  somaticText: "Wrap a burning chain around your own throat and pull it taut",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "combatAdvantage",
  effects: [
   { id : "whisper_bridle_saves",
   name: "Bridled Whisper",
   description: "Advantage on Spirit saving throws against the Wyrd-touched Whisper; reroll the first failed Whisper save each round.",
   mechanicsText: "Advantage vs Whisper; one reroll per round.",
   statModifier: {
    stat: "spirit_saves_vs_whisper",
    magnitude: 99,
    magnitudeType: "advantage",
   },
   },
   { id : "whisper_bridle_friendly_fire",
   name: "Controlled Burn",
   description: "Your ember area spells can exclude up to 3 allies of your choice from their effects.",
   mechanicsText: "Exclude up to 3 allies from your ember AoE spells.",
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
  cooldownValue: 4,
  },

  tags: ["ember", "buff", "control", "veil", "pyrofiend"],
 },

 // ========================================
 // LEVEL 8 SPELLS
 // ========================================
 { id: "pyro_meteor_shower",
  name: "Meteor Shower",
  description:
  "Reach into Scathrach's furnace and pull down the sky: meteors descend on a 30ft radius for 14d6 + INT×2 ember. The ground craters, the air ignites; a natural disaster at your epicenter.",
  level: 8,
  spellType: "ACTION",
  icon: "Fire/Fiery Comet",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fiery Comet",
  tags: ["ember", "damage", "aoe"],
  castTime: 2,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 150,
  aoeShape: "circle",
  aoeParameters: { radius: 30 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 7 , classResource: { type: "inferno_veil", gain: 3, minVeil: 7 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Meteorus Infernus!",
  somaticText: "Raise arms to the sky",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "14d6 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2,
   critDiceOnly: false,
   extraDice: "4d6",
   critEffects: ["burning", "knockback"],
   burningConfig: {
   damagePerRound: "3d6",
   duration: 3,
   durationUnit: "rounds",
   saveDC: 18,
   saveType: "constitution",
   },
   knockbackConfig: {
   distance: 15,
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 4,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_infernal_nova",
  name: "Infernal Nova",
  description:
  "You detonate. A sphere of infernal fire expands 35ft for 14d6 + INT×2 ember; take 2d6 self-damage and struck foes are Staggered (disadvantage on attacks/saves) until their next turn ends.",
  level: 8,
  spellType: "ACTION",
  icon: "Fire/Swirling Fireball",

  typeConfig: {
  school: "ember",
  icon: "Fire/Swirling Fireball",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "circle",
  aoeParameters: { radius: 35 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 30, inferno_ascend: 3, inferno_required: 8 , classResource: { type: "inferno_veil", gain: 3, minVeil: 8 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Nova Infernus!",
  somaticText: "Spread arms wide and explode",
  },

  effectTypes: ["damage", "debuff"],

  damageConfig: {
  formula: "14d6 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  debuffConfig: {
  debuffType: "statusEffect",
  effects: [
   { id : "nova_staggered",
   name: "Staggered",
   description: "The concussive blast staggers the target: disadvantage on attack rolls and saving throws until the end of its next turn.",
   mechanicsText: "Disadvantage on attacks and saves until end of next turn.",
   },
  ],
  statPenalties: [
   { stat: "attack_and_saves", magnitude: -99, magnitudeType: "disadvantage" },
  ],
  durationValue: 1,
  durationType: "rounds",
  durationUnit: "rounds",
  canBeDispelled: true,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 5,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_phoenix_flame",
  name: "Phoenix Flame",
  description:
  "Summon a phoenix's ghost; or Scathrach lets you believe so. A 25ft detonation deals 12d6 + INT×2 ember, then the ground burns 3d6 + INT/2 per round for 4 rounds. A funeral pyre; whose is unclear.",
  level: 8,
  spellType: "ACTION",
  icon: "Fire/Rising Inferno",

  typeConfig: {
  school: "ember",
  icon: "Fire/Rising Inferno",
  tags: ["ember", "damage", "aoe", "dot"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 120,
  aoeShape: "circle",
  aoeParameters: { radius: 25 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 32, inferno_ascend: 3, inferno_required: 8 , classResource: { type: "inferno_veil", gain: 3, minVeil: 8 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Flamma Phoenix!",
  somaticText: "Summon phoenix gesture",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "12d6 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  dotConfig: {
   enabled: true,
   damagePerTick: "3d6 + intelligence/2",
   damageTypes: ["ember"],
   tickFrequency: "round",
   duration: 4,
   canStack: false,
   maxStacks: 1,
  },
  },

  durationConfig: {
  durationType: "rounds",
  durationValue: 4,
  durationUnit: "rounds",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 6,
  },

  tags: ["ember", "damage", "aoe", "dot"],
 },

 { id: "pyro_obsidian_aegis",
  name: "Obsidian Aegis",
  description: "Raise a 15-foot radius obsidian heat-dome for 3 rounds. You and allies inside gain +3 DR and take half damage from rime sources; your own rime vulnerability is suppressed while you stand within it.",
  level: 8,
  spellType: "ACTION",
  icon: "Utility/Steadfast Bulwark",

  typeConfig: {
  school: "ember",
  icon: "Utility/Steadfast Bulwark",
  tags: ["ember", "buff", "defensive", "aura", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  areaSize: 15,
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 26, inferno_ascend: 2, inferno_required: 6 , classResource: { type: "inferno_veil", gain: 2, minVeil: 6 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Testudo Obsidiana!",
  somaticText: "Slam a fist down; black glass erupts in a dome",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "auraEffect",
  effects: [
   { id : "obsidian_aegis_dr",
   name: "Obsidian Aegis",
   description: "Allies within 15 feet gain +3 DR while the dome holds.",
   mechanicsText: "+3 DR to allies inside the 15 ft dome.",
   statModifier: {
    stat: "damage_reduction",
    magnitude: 3,
    magnitudeType: "flat",
   },
   },
   { id : "obsidian_aegis_rime",
   name: "Rimeward",
   description: "Allies within 15 feet take half damage from rime sources; the Pyrofiend's own rime vulnerability is suppressed while inside.",
   mechanicsText: "Rime damage halved inside; Pyrofiend rime vulnerability suppressed.",
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
  cooldownValue: 4,
  },

  tags: ["ember", "buff", "defensive", "aura", "pyrofiend"],
 },

 { id: "pyro_ember_siphon",
  name: "Ember Siphon",
  description: "Devour lingering flame: end ember over-time effects on allies within 30 feet, extinguish one fire zone, and give one ally +2d6 ember on their next attack within 2 rounds. Vents 1 Veil.",
  level: 8,
  spellType: "ACTION",
  icon: "Utility/Embraced by Fire",

  typeConfig: {
  school: "ember",
  icon: "Utility/Embraced by Fire",
  tags: ["ember", "utility", "buff", "support", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  areaSize: 30,
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_descend", "inferno_required"],
  resourceValues: { mana: 20, inferno_descend: 1, inferno_required: 3 },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Haurio Flammam!",
  somaticText: "Inhale the smoke off your allies and swallow it",
  },

  effectTypes: ["utility", "buff"],

  utilityConfig: {
  utilityType: "cleanse",
  selectedEffects: [
   { id : "ember_siphon_cleanse",
   name: "Consume the Flame",
   description: "End all burning and ember over-time effects on allies within 30 feet, and extinguish one non-magical fire or ember hazard zone within range.",
   mechanicsText: "Cleanse ember over-time effects on allies in 30 ft; extinguish one fire zone.",
   },
  ],
  duration: 0,
  durationUnit: "instant",
  concentration: false,
  power: "major",
  },

  buffConfig: {
  buffType: "damageIncrease",
  effects: [
   { id : "ember_siphon_gift",
   name: "Siphoned Heat",
   description: "One ally of your choice gains +2d6 ember damage on their next attack within 2 rounds.",
   mechanicsText: "Ally's next attack deals +2d6 ember; expires after 2 rounds.",
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
  cooldownValue: 3,
  },

  tags: ["ember", "utility", "buff", "support", "pyrofiend"],
 },

 // ========================================
 // LEVEL 9 SPELLS
 // ========================================
 { id: "pyro_infernal_avatar",
  name: "Infernal Avatar",
  description:
  "For 10 rounds become an Infernal Avatar: +5 ember spell power, +3 DR, ember immunity, 10ft burning aura (2d6 ember). Skin and voice gone; only fire remains. When it ends, you feel every second.",
  level: 9,
  spellType: "CHANNELED",
  icon: "Fire/Fire Demon",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fire Demon",
  tags: ["ember", "transformation"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 36, inferno_ascend: 3, inferno_required: 7 , classResource: { type: "inferno_veil", gain: 3, minVeil: 7 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Ego Sum Ignis!",
  somaticText: "Spread arms wide",
  },

  effectTypes: ["transformation"],

  transformationConfig: {
  customName: "Infernal Avatar",
  transformType: "elemental",
  formName: "Fire Elemental Avatar",
  formDescription:
   "You become a being of pure Wyrd-fire, wreathed in flames and radiating intense heat.",
  durationValue: 10,
  durationType: "rounds",
  concentrationRequired: true,
   statModifiers: [
    { stat: "fire_spell_power", magnitude: 5, magnitudeType: "flat" },
   ],
  resistances: [{ damageType: "ember", resistanceType: "immunity" }],
  specialAbilities: [
   {
   name: "Burning Aura",
   description:
    "Enemies within 10 feet take 2d6 ember damage at the start of their turn",
   },
  ],
  },

  channelingConfig: {
  type: "persistent",
  maxDuration: 10,
  durationUnit: "rounds",
  interruptible: true,
  movementAllowed: true,
  persistentEffectType: "aura",
  persistentRadius: 10,
  baseFormula: "2d6",
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 10,
  },

  tags: ["ember", "transformation"],
 },

 { id: "pyro_apocalypse",
  name: "Apocalypse",
  description:
  "Scathrach's grandest gift and cruelest joke: a 40ft cataclysm for 16d10 + INT×2 ember. At maximum Inferno Level, damage dice explode on max rolls. The blast radius is a grave; the silence is applause.",
  level: 9,
  spellType: "ACTION",
  icon: "Utility/Explosive Detonation",

  typeConfig: {
  school: "ember",
  icon: "Utility/Explosive Detonation",
  tags: ["ember", "damage", "aoe"],
  castTime: 2,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 200,
  aoeShape: "circle",
  aoeParameters: { radius: 40 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 36, inferno_ascend: 3, inferno_required: 9 , classResource: { type: "inferno_veil", gain: 3, minVeil: 9 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Apocalypsis!",
  somaticText: "Raise arms and channel all power",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "16d10 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2,
   critDiceOnly: false,
   explodingDice: true,
   explodingDiceType: "reroll_add",
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 10,
  },

  tags: ["ember", "damage", "aoe"],
 },

 { id: "pyro_hellfire_ritual",
  name: "Hellfire Ritual",
  description:
  "A ritual not to summon Scathrach but to open the floodgates wider: for 3 rounds your ember damage surges +10, and by round 3 your Inferno Level bonuses double. Borrowing against your own annihilation.",
  level: 9,
  spellType: "CHANNELED",
  icon: "Radiant/Radiant Divinity",

  typeConfig: {
  school: "ember",
  icon: "Radiant/Radiant Divinity",
  tags: ["ember", "buff"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 34, inferno_ascend: 3, inferno_required: 0 , classResource: { type: "inferno_veil", gain: 3 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic", "material"],
  verbalText: "Ritualis Infernus!",
  somaticText: "Perform ritual gestures",
  materialComponents: "Wyrd-touched essence",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "statEnhancement",
  effects: [
   { id : "massiveFireBoost",
   name: "Massive Fire Boost",
   description:
    "+10 ember Spell Power for 3 rounds. A ritual of infernal power dramatically surges through your fire magic.",
   mechanicsText: "",
   statModifier: {
    stat: "fire_spell_power",
    magnitude: 10,
    magnitudeType: "flat",
   },
   },
  ],
  durationValue: 3,
  durationType: "rounds",
  durationUnit: "rounds",
  concentrationRequired: true,
  canBeDispelled: true,
  },

  channelingConfig: {
  type: "power_up",
  maxDuration: 3,
  durationUnit: "rounds",
  interruptible: true,
  movementAllowed: false,
  stages: [
   {
   threshold: 1,
   effect: "+10 ember Spell Power",
   description: "Infernal ritual begins, fire magic surges",
   },
   {
   threshold: 2,
   effect: "+10 ember Spell Power + Burning Aura",
   description:
    "Wyrd-flames radiate outward, enemies within 10 ft take 2d6 ember per round",
   },
   {
   threshold: 3,
   effect:
    "+10 ember Spell Power + Burning Aura + Inferno Amplification",
   description:
    "Ritual climax, all inferno level bonuses doubled for the final round",
   },
  ],
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 12,
  },

  tags: ["ember", "buff"],
 },

 { id: "pyro_veil_rupture",
  name: "Veil Rupture",
  description: "Spend 4 Inferno Veil to rupture your pressure seal: enemies within 30 feet are pushed 20 feet and knocked prone (DC 16 Strength save negates prone); allies gain +10 feet speed for 2 rounds.",
  level: 9,
  spellType: "ACTION",
  icon: "Force/Force Wave",

  typeConfig: {
  school: "ember",
  icon: "Force/Force Wave",
  tags: ["ember", "control", "buff", "veil", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "self_centered",
  aoeShape: "circle",
  aoeParameters: { radius: 30 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_descend", "inferno_required"],
  resourceValues: { mana: 28, inferno_descend: 4, inferno_required: 4 },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Ruptura Veli!",
  somaticText: "Drive a thumb into the seam of your own sternum and split it",
  },

  effectTypes: ["control", "buff"],

  controlConfig: {
  controlType: "forcedMovement",
  duration: 0,
  durationUnit: "instant",
  savingThrow: {
   ability: "strength",
   difficultyClass: 16,
   saveOutcome: "negates",
  },
  effects: [
   { id : "veil_rupture_push",
   name: "Veil Shockwave",
   description: "Enemies within 30 feet are pushed 20 feet away from you; a DC 16 Strength save negates only the knockdown.",
   config: {
    movementType: "push",
    distance: 20,
    saveType: "strength",
    saveDC: 16,
    knockdown: true,
   },
   },
  ],
  },

  buffConfig: {
  buffType: "movementBuff",
  effects: [
   { id : "veil_rupture_momentum",
   name: "Vented Momentum",
   description: "Allies within 30 feet gain +10 feet movement speed for 2 rounds.",
   mechanicsText: "+10 ft speed to allies in 30 ft for 2 rounds.",
   statModifier: {
    stat: "movement_speed",
    magnitude: 10,
    magnitudeType: "flat",
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

  tags: ["ember", "control", "buff", "veil", "pyrofiend"],
 },

 // ========================================
 // LEVEL 10 SPELLS
 // ========================================
 { id: "pyro_brimstone_teleport",
  name: "Brimstone Teleport",
  description:
  "Tear reality and step through Scathrach's furnace, reappearing up to 60ft away in hellfire dealing 6d6 + INT×2 ember within 10ft of arrival. Not travel; passing through the horror's maw.",
  level: 10,
  spellType: "ACTION",
  icon: "Fire/Burning Ember",

  typeConfig: {
  school: "ember",
  icon: "Fire/Burning Ember",
  tags: ["ember", "utility", "teleport", "damage"],
  castTime: 0,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 30, inferno_ascend: 1, inferno_required: 8 , classResource: { type: "inferno_veil", gain: 1, minVeil: 8 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal"],
  verbalText: "Teleportatio Infernus!",
  },

  effectTypes: ["utility", "damage"],

  utilityConfig: {
  utilityType: "movement",
  selectedEffects: [
   { id : "brimstone_teleport",
   name: "Brimstone Teleport",
   description:
    "Teleport up to 60 feet through hellfire, appearing in a burst of flames.",
   mechanicsText: "",
   duration: 0,
   durationUnit: "instant",
   concentration: false,
   power: "major",
   },
  ],
  },

  damageConfig: {
  formula: "6d6 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  },

  propagation: {
  method: "explosion",
  behavior: "aoe",
  secondaryRadius: 10,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 3,
  },

  tags: ["ember", "utility", "teleport", "damage"],
 },

 { id: "pyro_demonic_ascension",
  name: "Cinder Ascension",
  description:
  "Surrender completely: +15 ember damage, +5 DR, ember immunity, 30ft flight, 3d6 ember to foes within 15ft each turn. Requires Inferno 9; drop below 9 in 3 turns or Scathrach claims you forever.",
  level: 10,
  spellType: "ACTION",
  icon: "Fire/Fire Demon",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fire Demon",
  tags: ["ember", "buff", "transformation"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 9 , classResource: { type: "inferno_veil", gain: 3, minVeil: 9 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Ascensio Daemonis!",
  somaticText: "Channel ultimate power",
  },

  effectTypes: ["buff", "damage"],

  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "demonicAscension_power",
   name: "Cinder Ascension",
   description:
    "+15 ember damage to all spells, +5 DR, ember damage immunity, flight (30 ft), and enemies within 15 feet take 3d6 ember damage at start of their turn. Requires Inferno Level 9. Death clock still ticks.",
   mechanicsText: "",
   },
    { id : "demonicAscension_durability",
    name: "Ashen Carapace",
    description: "+5 DR from Wyrd-touched carapace",
    mechanicsText: "",
    },
   { id : "demonicAscension_fire",
   name: "Fire Mastery",
   description: "+15 ember spell power",
   mechanicsText: "",
   statModifier: {
    stat: "fire_spell_power",
    magnitude: 15,
    magnitudeType: "flat",
   },
   },
  ],
  durationValue: 5,
  durationType: "rounds",
  durationUnit: "rounds",
  concentrationRequired: true,
  canBeDispelled: false,
  },

  damageConfig: {
  formula: "3d6",
  damageTypes: ["ember"],
  resolution: "AUTOMATIC",
  },

  propagation: {
  method: "explosion",
  behavior: "aoe",
  secondaryRadius: 15,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 15,
  },

  tags: ["ember", "buff", "transformation"],
 },

 { id: "pyro_inferno_mastery",
  name: "Inferno Mastery",
  description:
  "Scathrach's hunger through your ruined body: a 50ft inferno for 20d10 + INT×2 ember. At Inferno 7+ it deepens to 22d10; at 9, 25d10 + INT×3. The world burns; you burn; the distinction is meaningless.",
  level: 10,
  spellType: "ACTION",
  icon: "Fire/Fire Orb",

  typeConfig: {
  school: "ember",
  icon: "Fire/Fire Orb",
  tags: ["ember", "damage", "aoe"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "area",
  rangeType: "ranged",
  rangeDistance: 200,
  aoeShape: "circle",
  aoeParameters: { radius: 50 },
  targetRestrictions: [],
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_ascend", "inferno_required"],
  resourceValues: { mana: 40, inferno_ascend: 3, inferno_required: 9 , classResource: { type: "inferno_veil", gain: 3, minVeil: 9 } },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Dominatio Infernus!",
  somaticText: "Command all fire",
  },

  effectTypes: ["damage"],

  damageConfig: {
  formula: "20d10 + intelligence * 2",
  damageTypes: ["ember"],
  resolution: "DICE",
  criticalConfig: {
   enabled: true,
   critType: "dice",
   critMultiplier: 2.5,
   critDiceOnly: false,
   extraDice: "6d10",
   explodingDice: true,
   explodingDiceType: "reroll_add",
  },
  },

  triggerConfig: {
  conditionalEffects: {
   damage: {
   isConditional: true,
   defaultEnabled: true,
   baseFormula: "20d10 + intelligence * 2",
   conditionalFormulas: {
    inferno_9: "25d10 + intelligence * 3",
    inferno_7_plus: "22d10 + intelligence * 2",
    default: "20d10 + intelligence * 2",
   },
   },
  },
  effectTriggers: {
   damage: {
   logicType: "OR",
   compoundTriggers: [
    { id : "resource_threshold",
    category: "health",
    name: "High Inferno Level",
    parameters: {
     resource_type: "inferno",
     threshold_value: 7,
     threshold_type: "flat",
     comparison: "greater_than",
     perspective: "self",
    },
    },
   ],
   },
  },
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 12,
  },

  tags: ["ember", "damage", "aoe"],
 },
 { id: "pyro_ashen_crucible",
  name: "Ashen Crucible",
  description: "Seal your Veil in a crucible of will for 3 rounds: it cannot ascend, the Level 9 death clock pauses, and you gain +3 DR. When it ends, take 2d6 self-damage and vent 2 Veil.",
  level: 10,
  spellType: "ACTION",
  icon: "Utility/Alchemical Symbol",

  typeConfig: {
  school: "ember",
  icon: "Utility/Alchemical Symbol",
  tags: ["ember", "buff", "defensive", "veil", "pyrofiend"],
  castTime: 1,
  castTimeType: "IMMEDIATE",
  },

  targetingConfig: {
  targetingType: "self",
  rangeType: "self_centered",
  },

  resourceCost: {
  resourceTypes: ["mana", "inferno_required"],
  resourceValues: { mana: 30, inferno_required: 0 },
  useFormulas: {},
  actionPoints: 2,
  components: ["verbal", "somatic"],
  verbalText: "Crucibulum Cinerum!",
  somaticText: "Cup your hands over your heart and seal the furnace shut",
  },

  effectTypes: ["buff"],

  buffConfig: {
  buffType: "custom",
  effects: [
   { id : "ashen_crucible_seal",
   name: "Sealed Veil",
   description: "For 3 rounds your Inferno Veil cannot ascend and the Level 9 death clock pauses; you gain +3 DR. When the crucible ends, take 2d6 self-damage and vent 2 Veil.",
   mechanicsText: "Veil cannot rise; death clock paused; +3 DR; end: 2d6 self and vent 2.",
   statModifier: {
    stat: "damage_reduction",
    magnitude: 3,
    magnitudeType: "flat",
   },
   },
  ],
  durationValue: 3,
  durationType: "rounds",
  durationUnit: "rounds",
  concentrationRequired: false,
  canBeDispelled: false,
  },

  cooldownConfig: {
  cooldownType: "turn_based",
  cooldownValue: 8,
  },

  tags: ["ember", "buff", "defensive", "veil", "pyrofiend"],
 },
 // ===== PASSIVE ABILITIES =====
 { id: "pyrofiend_burnout",
  name: "Burnout",
  description:
  "When nothing burns; no ignited targets, no Inferno Level, no auras; the furnace sputters: -2 spell attack rolls, -1d6 fire damage. Set something ablaze. Lifts when a fire spell deals damage.",
  level: 1,
  spellType: "PASSIVE",
  icon: "Fire/Flame Shield",
  effectTypes: ["passive"],
  typeConfig: {
  school: "ember",
  icon: "Fire/Flame Shield",
  tags: ["passive", "pyrofiend", "weakness"],
  },
  targetingConfig: { targetingType: "self" },
  resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
  resolution: "AUTOMATIC",
  tags: ["passive", "pyrofiend", "weakness"],
 },
 { id: "pyrofiend_fire_dependency",
  name: "Fire Dependency",
  description:
  "Your furnace runs so hot that rime is catastrophic: +50% cold/frost damage taken; taking rime raises Inferno Veil +1; in water or cold your Inferno Level falls 2 per round. Water is antithetical.",
  level: 1,
  spellType: "PASSIVE",
  icon: "Frost/Icy Shield",
  effectTypes: ["passive"],
  typeConfig: {
  school: "ember",
  icon: "Frost/Icy Shield",
  tags: ["passive", "pyrofiend", "weakness"],
  },
  targetingConfig: { targetingType: "self" },
  resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
  resolution: "AUTOMATIC",
  tags: ["passive", "pyrofiend", "weakness"],
 },
 { id: "pyrofiend_heat_signature",
  name: "Heat Signature",
  description:
  "You always radiate heat: no Stealth or invisibility; enemies have advantage on Perception within 60ft; ice melts within 10ft; water deals 1d6 per round of immersion. Never hidden, never safe.",
  level: 3,
  spellType: "PASSIVE",
  icon: "Fire/Eruption",
  effectTypes: ["passive"],
  typeConfig: {
  school: "ember",
  icon: "Fire/Eruption",
  tags: ["passive", "pyrofiend", "weakness"],
  },
  targetingConfig: { targetingType: "self" },
  resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0 },
  resolution: "AUTOMATIC",
  tags: ["passive", "pyrofiend", "weakness"],
 },
  // ===== NON-COMBAT / FIRE & ASH UTILITY (the living furnace, out of combat) =====
  { id: "pyro_living_hearth",
    name: "Living Hearth",
    description: "Bank your inner fire to a gentle glow: radiate warmth and ember-light (30ft), staving off cold exposure and frostbite for nearby allies, and kindle fires from your palm. 1 HP/hour. Out of combat.",
    level: 1, spellType: "ACTION", icon: "Fire/Burning Forge",
    typeConfig: { school: "ember", icon: "Fire/Flame Shield", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","rest","pyrofiend"] },
    targetingConfig: { targetingType: "area", rangeType: "self_centered", areaType: "circle", areaSize: 30 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 3 }, components: ["somatic"], somaticText: "Cup the ember in your palms and breathe it down to a glow" },
    resolution: "NONE", effectTypes: ["utility","buff"],
    utilityConfig: { utilityType: "environment", selectedEffects: [ { "id": "living_hearth_warmth", "name": "Banked Fire", "description": "For 1 hour: emit safe warmth + ember-light in 30 ft; allies ignore mundane cold exposure/frostbite; kindle fires. Costs 1 HP/hour.", "mechanicsText": "Warmth + light 30 ft; ignore cold exposure; 1 HP/hour." } ], duration: 1, durationUnit: "hours", power: "minor" },
    buffConfig: {
      buffType: "auraEffect",
      effects: [
        { id: "living_hearth_buff", name: "Living Hearth", description: "You radiate safe warmth and soft ember-light: allies within 30ft ignore mundane cold exposure and frostbite.", mechanicsText: "Allies ignore cold exposure within 30ft; 1 HP/hour." }
      ],
      durationType: "hours",
      durationValue: 1,
      durationUnit: "hours"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","exploration","rest","pyrofiend"]
  },
  { id: "pyro_smelters_touch",
    name: "Smelter's Touch",
    description: "Focus your heat to a surgical point: smelt, weld, solder, or cut metal; seal a crack, fuse pieces, repair a mechanism. The Pyrofiend as smith; take 1d4 self-damage from back-heat. Out of combat.",
    level: 1, spellType: "ACTION", icon: "Fire/Volcanic Corruption",
    typeConfig: { school: "ember", icon: "Fire/Volcanic Corruption", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","exploration","infiltration","pyrofiend"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 5 }, components: ["somatic"], somaticText: "Pinch the heat to a needle-fine point at your fingertips" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "conjuration", selectedEffects: [ { "id": "smelters_touch_work", "name": "Surgical Heat", "description": "Smelt/weld/solder/cut one metal object: repair a mechanism, seal a crack, fuse metals, or slice a bar. Precise, not destructive. Take 1d4 self-damage from back-heat. Enchanted metal resists.", "mechanicsText": "Precisely weld/cut/repair one metal object; 1d4 self-damage." } ], power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","exploration","infiltration","pyrofiend"]
  },
  { id: "pyro_ash_reading",
    name: "Ash-Reading",
    description: "Burn an object and read the Sovereign's memory in the ash: what it was, how it died, who last held it; or ask Scathrach one question answered in the smoke. Never kind; costs 1d4 wyrd. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Fire/Volcanic Corruption",
    typeConfig: { school: "ember", icon: "Fire/Volcanic Corruption", castTime: 1, castTimeType: "MINUTES", tags: ["utility","divination","investigation","pyrofiend"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 7 }, components: ["verbal","somatic"], somaticText: "Crumble the object to ash and inhale the question off the smoke" },
    resolution: "NONE", effectTypes: ["utility"],
    utilityConfig: { utilityType: "divination", selectedEffects: [ { "id": "ash_reading_memory", "name": "Sovereign's Memory", "description": "From the ash of a burned object: learn what it was, how it was destroyed, who last held it  -  OR ask Scathrach one question answered in the smoke (truthful, unkind, partial). Costs 1d4 wyrd self-damage (sanity).", "mechanicsText": "Read an object's end-memory or ask Scathrach 1 question; 1d4 wyrd." } ], power: "moderate" },
    cooldownConfig: { cooldownType: "short_rest", cooldownValue: 1 },
    tags: ["utility","divination","investigation","pyrofiend"]
  },
  { id: "pyro_cauterize",
    name: "Cauterize",
    description: "Grip a wound and burn it shut: stop bleeding, sear a gash, or neutralize contact poison; field surgery trading agony for survival. No HP restored; bleed/poison stops. Out of combat.",
    level: 2, spellType: "ACTION", icon: "Healing/Heart Shield",
    typeConfig: { school: "ember", icon: "Healing/Heart Shield", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","investigation","pyrofiend"] },
    targetingConfig: { targetingType: "single", rangeType: "touch", rangeDistance: 0, targetRestrictions: ["any"] },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 5 }, components: ["somatic"], somaticText: "Press a burning palm over the wound and hold" },
    resolution: "AUTOMATIC", effectTypes: ["utility"],
    utilityConfig: { utilityType: "protection", selectedEffects: [ { "id": "cauterize_sear", "name": "Burned Shut", "description": "Stop active bleeding, stabilize a dying creature, or neutralize a contact/ingested poison by burning the wound. Restores no HP; deals 1d6 self-damage to the caster (sympathetic heat) and leaves a scar.", "mechanicsText": "Stop bleed/stabilize/neutralize contact poison; no HP heal; 1d6 self." } ], power: "moderate" },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 },
    tags: ["utility","investigation","pyrofiend"]
  },
  { id: "pyro_cinder_veil",
    name: "Cinder-Veil",
    description: "Bend heat off your skin into a mirage that distorts your party's outlines: advantage on Stealth and hidden position from distant observers in hot, dry, or smoky places. Useless in cold, wet, wind.",
    level: 3, spellType: "ACTION", icon: "Fire/Burning Touch",
    typeConfig: { school: "ember", icon: "Fire/Flame Shield", castTime: 1, castTimeType: "IMMEDIATE", tags: ["utility","stealth","exploration","pyrofiend"] },
    targetingConfig: { targetingType: "area", rangeType: "self_centered", areaType: "circle", areaSize: 20 },
    resourceCost: { actionPoints: 1, resourceTypes: ["mana"], resourceValues: { mana: 6 }, components: ["somatic"], somaticText: "Exhale a flat sheet of rippling heat across your party" },
    resolution: "NONE", effectTypes: ["utility","buff"],
    utilityConfig: { utilityType: "stealth", selectedEffects: [ { "id": "cinder_veil_mirage", "name": "Heat Mirage", "description": "For 10 minutes, you and allies within 20 ft gain advantage on Stealth and obscure your exact count/position from distant observers  -  but only in hot, dry, or smoky conditions. Cold, wet, or wind dissolves the mirage instantly.", "mechanicsText": "Advantage Stealth + obscure position; hot/dry/smoky only, 10 min." } ], duration: 10, durationUnit: "minutes", power: "moderate" },
    buffConfig: {
      buffType: "combatAdvantage",
      effects: [
        { id: "cinder_veil_buff", name: "Heat Mirage", description: "You and allies within 20ft gain advantage on Stealth and obscure your position from distant observers.", mechanicsText: "Advantage Stealth; hot/dry/smoky only; 10 minutes." }
      ],
      durationType: "minutes",
      durationValue: 10,
      durationUnit: "minutes"
    },
    cooldownConfig: { cooldownType: "turn_based", cooldownValue: 1 },
    tags: ["utility","stealth","exploration","pyrofiend"]
  }
 ],
};
