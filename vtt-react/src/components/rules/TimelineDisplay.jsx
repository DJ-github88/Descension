import React, { useState } from 'react';
import './TimelineDisplay.css';

const E = [
  {
    era: 'The Age Before Ages',
    color: '#6b4c3b',
    glow: '#6b4c3b80',
    gradient: 'linear-gradient(135deg, #3a2218 0%, #6b4c3b 50%, #3a2218 100%)',
    quote: 'Before noble houses, before dark bargains — there was a law older than any deity.',
    dmOverview: 'This era establishes the cosmic framework. The Deepening cycle is the foundational law of the universe — every star dies and is reborn. Use this era to seed ancient mysteries: the Keeper\'s true nature, the sea mother\'s agenda, Aex\'s fate before the binding. Players exploring primordial ruins might find records of this age.',
    events: [
      { date: 'Unknown', title: 'The First Ignition', narrative: 'The first stars ignite across the void, and each one establishes the **Deepening** — the ancient, cosmic death-rebirth cycle that governs all celestial bodies. This is not a myth. It is a fundamental law of existence, older than any deity, crueler than any scripture. Every star that has ever burned has entered the Deepening, shedding its exhausted light and rekindling from within, surrounded by starless space. Every star has successfully emerged from its slumber — until Sol. This cosmic rule ensures that a star\'s vulnerability is also its ultimate furnace, but the dimming phase acts as a universal broadcast, signaling across the void to entities that feed on fading light.', dmHook: 'A pre-Deepening artifact, older than any known civilization, surfaces in the Cragjaw Peaks. The Fexrick claim it predates their oldest holdfasts by millennia. It hums at a frequency that makes Astril spirits weep.' },
      { date: 'Unknown', title: 'Aex, Firstborn of Sol', narrative: '**Aex** comes into being — living solar fire given form, the first and only child of the sun. Standing watch through every Deepening cycle, Aex is Sol\'s guardian, its witness, its memory across eons. The oldest Fexric carvings depict Aex as a massive serpent of light coiled around a dying ember. Aex\'s very body was composed of a specialized, highly concentrated solar fire that could absorb raw thermal shocks, a biological armor of heat that would later inspire the defensive techniques of the **Spellguards** and serve as the physical foundation for the binding seal beneath Sundale.', dmHook: 'Aex is not truly dead. Fragments of the firstborn\'s consciousness linger in the binding seal — and therefore in every Sundered Monolith. A character who touches a Monolith may receive a vision: fire, betrayal, and the face of the one who took the hide.' },
      { date: 'Unknown', title: 'The Fexrick Carve the First Holdfast', narrative: 'The **Fexrick** — compact, gnomish engineers driven by an obsessive, generational mathematical focus — carve their first holdfast into the Cragjaw Peaks. This marks the beginning of the oldest continuous civilization on Mythrill. Their oral maintenance songs, passed down for eight millennia, contain complex architectural equations and alchemical formulas no living Fexric fully understands, representing a lost age of advanced steam-power and clockwork engineering from before the ice sheets advanced.', dmHook: 'A Fexric oral song, when translated by a Myrathil Deep-Born Listener, turns out to be a star-chart from before the sky went dark. It points to a location beneath Frostmaw Crag that no Fexric has excavated in six thousand years.' },
      { date: 'Unknown', title: 'The Thrumm Awaken', narrative: 'The **Thrumm** — hulking stone-trolls born of mineral and pressure — awaken in the deepest crags of the mountains. They are the peaks\' first children, speaking in a low-frequency rumble that gives them their name. The Fexrick call them "the mountain\'s heartbeat made flesh." Their thick, calcified stone-hide and structural bones would later become the target of Fexric alchemical experiments, leading directly to the creation of the Smoothing Plague and the birth of the Groven.', dmHook: 'Thrumm shamans practice a form of lithomancy — reading future events in the cracks of sacred stones. The shamans have been reading the same prophecy for eight centuries: "The smooth ones will return, and the mountain will choose." The Groven do not know about this prophecy.' },
      { date: 'Unknown', title: 'The Vreken Cultivate the Deep', narrative: 'The **Vreken** — a compact, lantern-eyed people — cultivate phosphorescent fungi in the Bryngloom\'s bog-caverns. Evolving to survive in the absolute black of the deep earth, their irises emit a steady bioluminescent glow, and they perceive "the trail" — residual light left by passage, death, and decay. They develop a deep, spiritual reverence for the mycelial networks, laying the foundation for the political divide between the high-born **Clean** abbeys and the outcasted **Marked** wilderness guides.', dmHook: 'The oldest Vreken fungal-tablet records contain a word that does not translate into any known language. A Neth archivist who glimpsed the tablet went silent for three days, then filed a petition to have the tablet destroyed. The petition was denied. The Neth has not spoken of what they read.' },
      { date: 'Unknown', title: 'The Keeper Establishes Dominion', narrative: 'The **Keeper of the Last Threshold** establishes its domain over the Bryngloom Forest. The Vreken call it the Root-Veil and revere it as sacred. The entity does not demand worship — it demands order. Every death in its domain is recorded. Every soul that passes through is weighed, catalogued, and filed, establishing the cosmic bureaucracy that the **Neth** would later exploit to write their First Contract for immortality.', dmHook: 'The Keeper is not a god. It is something older — a cosmic functionary, a bureaucrat of the threshold between life and whatever comes after. It can be bargained with, but it cannot be lied to. Characters who die in the Bryngloom may find themselves in a waiting room, filling out forms in a language they suddenly understand, while something behind an ironwood desk considers their case.' },
      { date: 'Unknown', title: 'The Sea Mother\'s First Attempts', narrative: 'The sea mother — the vast, semi-conscious intelligence of the Iceheart Sea — makes her first attempts at personhood. She shapes foam into faces, currents into limbs, storms into voices. None of them hold. But she is patient. She has been patient for longer than the continents have had names, slowly preparing the tidal spawning beds that would later explode with life to spawn the **Myrathil** during the Great Eruption.', dmHook: 'The sea mother is not hostile — she is curious. She wants to understand the creatures that live on her skin. But her attempts at communication have created the Myrathil, the spawning gales, and the storms that sink ships. Characters lost at sea may encounter one of her failed experiments: a face in the foam that speaks in the voice of someone they buried.' },
    ]
  },
  {
    era: 'The Age of the Deepening',
    span: '~800 BP',
    color: '#8b6914',
    glow: '#8b691480',
    gradient: 'linear-gradient(135deg, #3d2e0a 0%, #8b6914 50%, #3d2e0a 100%)',
    quote: 'Sol enters the trance. An ancient predator descends. Seven families make a choice that will echo through eight centuries of darkness.',
    dmOverview: 'The inciting incident of the entire setting. Sol enters the Deepening — its vulnerable death-rebirth cycle — and Keth-Amar arrives to feed. The binding ritual beneath Sundale is the desperate act that defines every subsequent age. The sacrifice of Aex is the original sin. The campaign begins in the aftermath of this era\'s decisions. Key themes: desperate protection, unintended consequences, the cost of survival.',
    events: [
      { date: '~800 BP', title: 'Sol Enters the Deepening', narrative: 'The great clock of the heavens turns, and **Sol** enters the Deepening — the vulnerable, cocoon-like trance of the star\'s natural death-rebirth cycle. Across the seven continents, the sudden shift in the light is felt not as a shadow, but as a physical coldness that seeps into the bones. The Augurs of House Thalreth, watching from their high towers in the Frostwood Reach, are the first to read the terrifying portents. Their rune-scarred forearms burn with intense, blistering heat — a feedback loop of visions traded from their own personal memories to glimpse the future. In the high vaults of the celestial courts, the constellation-spirits who would later take refuge as the **Astril** scream silent warnings across the void as the oldest star-singers watch the northern skies slowly gutter and go dark. Even the **Marked Vreken**, deep within the damp fungal abbeys of the Bryngloom, report that the phosphorescent trails left by the dead begin to glow with a frantic, silver heat, signaling that the cosmic balance has been violently upset.', dmHook: 'A Doomsayer\'s journal from this period, preserved in the Greymark archive, contains a prophecy that was never fulfilled: "When the sun-child weeps, the predator will choke." The prophecy was dismissed at the time. It has never been revisited. An Astril Oracle who reads the journal today sees something in the words that no one saw eight centuries ago.' },
      { date: '~800 BP', title: 'Keth-Amar Descends', narrative: 'Drawn by the fading beacon of a star in slumber, the abyssal predator **Keth-Amar** — the Sun-Eater, the First Hunger, a formless entity older than the distinction between life and void — descends upon the vulnerable solar core. The predator does not strike immediately; instead, it circles the dying sun like a leviathan in the dark, casting a massive, unseen shadow over Mythrill. The world begins to twist under its gravity. Nightmares of endless hunger plague the sleeping, the southern crops fail as a dry, mineral frost creeps past the northern ranges, and children born during this dark decade emerge with "predator-eyes" — black, glassy irises that reflect absolutely no light. The **Skald** of Nordhalla record that their prehistoric clockwork engines grow sluggish, their copper gears grinding as if choked by soot, while the **Thrask Emberth** badland rangers urge their clans to dig deeper calderas, refusing to trust the silent vigil of the priests.', dmHook: 'Keth-Amar left something behind when it descended — a physical remnant of its passage through the void. It fell somewhere in the Iceheart Sea. The Myrathil call it "the Hunger-Stone" and have kept its location secret for centuries. The sea mother has been circling it, studying it, waiting.' },
      { date: 'Year 5, Deepening', title: 'The Fog Compact (Founding of Greymark)', narrative: 'House Thalreth seals the **Fog Compact** with the forest Sylvain and early Mimir, trading the region\'s spatial clarity for an insulating, protective mist to keep their ironwood forests warm. Greymark Keep is established as their seat of power, carved into three massive converging ironwood roots above a geothermal vent.', dmHook: 'The original copy of the Fog Compact, written on heartwood, contains a secret clause detailing a spatial coordinate in the deep woods where the fog does not enter. The Thalreth have kept this coordinate secret for generations.' },
      { date: 'Year 7, Deepening', title: 'The Glacier Bargain', narrative: 'As glaciers advance to threaten their mountain keeps, House Skalvyr strikes the **Glacier Bargain** with the Cosmic Warden to freeze the ice sheets in place. The glacier is halted, but the Warden decrees that summer will never return to Nordhalla. Construction begins on the Frozen Archive, carved into the living glacier to preserve Skald ancestry and history.', dmHook: 'The first chisel stroke of the Archive struck a pocket of liquid rime-plasma that has remained active. A character who drinks this plasma gains absolute recall of their ancestors\' memories but suffers permanent frostbite in one limb.' },
      { date: '~800 BP', title: 'The Binding Beneath Sundale', narrative: 'In an act of desperate, terrifying genius, the seven noble houses of Mythrill pool their bloodlines and forbidden rituals to entomb the dying star beneath the volcanic crust of **Sundale**. High **Inscriptors** engrave the mathematical terms of the binding directly into memory-glass and the burning flesh of volunteers, while massive **Korr Emberth Titans** stand sentinel along the volcanic catwalks to hold the boundaries. But a cosmic star cannot be bound by stone alone; the seal requires a vessel woven from pure, living solar radiance — the hide of **Aex**, Sol\'s firstborn and the guardian of the sun. Aex does not volunteer for this torment. The noble houses, led by the legalistic sorcery of the **Velun Neth**, hunt Aex through the volcanic throat of Emberspire. They flay the radiant child of the sun alive, weaving its burning hide into the foundation of the seal. The **Spellguards** of later ages trace their blood-oath to this first sacrificial magic: the acts of arcanists who absorbed the solar backdraft to prevent their lords from being vaporized. The seal is set — a monumental, one-way vault with no key, protecting the slumbering sun from the void at the cost of freezing the surface world.', dmHook: 'A fragment of Aex\'s hide — a scrap that was cut away during the ritual and discarded — survives in a hidden reliquary beneath the Harath-Vault. It still burns. The tending-clan has never told anyone it exists. An Emberth Titan who discovers it must choose: reveal the evidence of the original sin, or protect the faith that keeps the forge-clans united.' },
      { date: '~800 BP', title: 'The Underground Exodus', narrative: 'As the surface world begins its long freeze, the great migrations begin. The **Emberth**, forewarned by the frantic prophecies of the Korr Sun-Speakers, are already deep underground when the first glaciers advance. Guided by generational visions of darkness and descent, they establish **The Harath-Vault** deep within Sundale\'s secondary calderas, though the pragmatic **Thrask** clans refuse the inner rings and build their own calderas along the Shyr basalt highway. In the northern reaches, the **Mimir** — the ancient, shape-shifting faceshifters — retreat into the transitional Fog-Vales of the Frostwood. Surrounded by a memory-stealing mist, their canopy aristocrats forge the first pristine heartwood masks, establishing the **Mask-Borne** nobility who use shape-shifting only as a high-born tool of statecraft, while the outcasted **Unwoven** floor-scrappers are left maskless, painting their skin and building a black market of salvaged memories in the dark undergrowth.', dmHook: 'Some Emberth tunnels were sealed from the inside during the exodus — sections that Sun-Speakers declared "unclean." No living Emberth remembers why. The seals have never been broken. Something is still down there, waiting in the dark beneath Sundale, and it is not Keth-Amar.' },
    ]
  },
  {
    era: 'The Age of the Breach',
    span: '~798 BP',
    color: '#8b0000',
    glow: '#8b000080',
    gradient: 'linear-gradient(135deg, #3d0000 0%, #8b0000 50%, #3d0000 100%)',
    quote: 'Winter does not end. A predator whispers. Six families march their children north — and the world breaks.',
    dmOverview: 'The darkest chapter. Keth-Amar exploits human desperation, consuming six families\' firstborn heirs as vessel-keys to crack the binding seal from within. The Sundered Monoliths are born here. The Wyrd is released. The first Exorcists appear almost immediately — the world\'s immune response to spiritual infection. Key themes: complicity, the cost of survival, what breaks when children are the price.',
    events: [
      { date: '~798 BP', title: 'The Long Winter', narrative: 'The binding of Sol brings no relief; the Long Winter descends, and the surface world enters a state of permanent, agonizing twilight. Crops turn to black iron-hard ash in the fields, and glaciers grind past the northern gates of Nordhalla. Children freeze in their cradles, and the desperate **Skald Humans** measure their survival in body-counts. Within the Over-Shanties at the gates of the Vreken abbeys, the star-starved refugees turn to eating raw ghost-mycelium, triggering the first outbreaks of the mind-consuming "hush" addiction. Frustrated by the absolute seal of Aex\'s hide, **Keth-Amar** turns its attention to the starving rulers. It whispers to the desperate patriarchs of the six houses — not in spoken words, but in overwhelming mental impressions of roaring coal-fires, volcanic vents cracking the frozen earth, and warm soil. The predator\'s price is absolute and horrific: the **firstborn heirs** of each noble house must be surrendered to the void.', dmHook: 'The whispers were not heard equally. Some nobles reported hearing nothing at all — only a growing, gnawing certainty that their children would save them. The Doomsayers who recorded this phenomenon called it "the predator\'s logic" — a form of psychic manipulation that bypassed language entirely. A character with psychic sensitivity who enters the Frostwood Reach\'s deep fog may hear residual echoes of these whispers, still reverberating after eight centuries.' },
      { date: '~798 BP', title: 'Sera Solvan, the First Martyr', narrative: 'The historical tragedy of the capitulation is forever marked by the name of **Sera Solvan**, a Solvarn mother who became the first **Martyr**. While the other noble patriarchs surrendered their firstborn heirs in silent, shame-filled secrecy to secure the volcanic vents, Sera refused to let her child\'s sacrifice be forgotten. As her infant was dragged into the northern rift, she took a shard of jagged volcanic obsidian and carved the child\'s true name deep into her forearm. The blood-spelled scar did not heal; instead, it began to glow with a pale, sympathetic solar fire that flared whenever she drew near the binding seals. This mark of ultimate maternal grief became an inherited biological legacy, passed down through her bloodline to every descendant. Her sacrifice birthed the Martyr calling: a lineage of protectors who carry the literal wounds of their people in their own flesh, turning their pain into an impenetrable shield.', dmHook: 'Sera Solvan\'s original journal survives in the Greymark archive, written in a code that only her bloodline can read. The journal contains the names of all six sacrificed children — names that were burned from every official record. Speaking a child\'s true name near the Monolith tied to their bloodline causes the Monolith to resonate differently. No one has tried this. No one knows what would happen.' },
      { date: '~798 BP', title: 'House Viridane Refuses', narrative: 'Not all houses capitulate to the predator\'s whispers. **House Viridane** — the forgotten eighth house — says no. Declaring the bargain an act of unforgivable cowardice, they flee south through the freezing trails of the Frostwood Reach, pursued relentlessly by the soldiers of the six houses who seek to silence their dissent. Cornered in the deepest, oldest groves where the memory-fog thins, the survivors make a desperate counter-bargain with ancient, primordial fae entities of the wildwood. The **Briaran** are born from this magical transformation: their human flesh merges with the petrified briars, growing sharp wood-thorns where hair should be. Their **Lunarchs** emerge as living, breathing records of the house that refused the sacrifice, carrying the memory of the burned contract in their bloodlines and guarding the deep groves against the noble purges.', dmHook: 'The original fae contract still exists — a living document grown from thorn-vine and moonlight, buried beneath the oldest Briaran grove. It can be read, but only by a Briaran Lunarch during a lunar eclipse. The contract contains a clause that the Briaran have never invoked: the fae entities owe House Viridane a debt that has never been collected.' },
      { date: '~798 BP', title: 'The Shattering of the Seal', narrative: 'The sacrifice is a trap. **Keth-Amar** devours the six noble heirs not as food, but as biological **vessel-keys**. Because the children\'s bloodlines were the literal locks on the original binding seal, the predator uses their consumed essence to crack the vault from the inside. The primary seal shatters with a sound that deafens half the globe, breaking into **7 Sundered Monoliths** that scatter across the continents, each fragment screaming with the psychic agony of a sacrificed child. In the south, **Emberspire** erupts in a cataclysmic blast of black ash and volcanic glass, creating the geothermal vents the houses bargained for, but also releasing the **Wyrd** — a primordial, conceptual spiritual rot that had been sealed in the deep earth since before the first stars. The Wyrd bleeds through the tectonic cracks, occupying human fears and turning nightmares into physical, hunting predators.', dmHook: 'The seventh Monolith is the anomaly. Six children were consumed — where did the seventh fragment come from? Some scholars believe Aex\'s consciousness, fragmented during the binding, imprinted on a piece of the seal. Others whisper that the seventh Monolith contains something else entirely — not a child\'s echo, but the first scream of the predator itself when it realized it was trapped inside the vault with a dying god.' },
      { date: '~798 BP', title: 'The First Exorcists Rise', narrative: 'The release of the Wyrd triggers an immediate, desperate immune response from the mortal races. Within months of the breach, the first **Exorcists** emerge — steel-willed scholars and priests who discover that the spiritual rot can be bound, contained, and banished using rusted cold iron, burning salt, and sacred terror. Alongside them, the **Huntresses** begin tracking the invisible spoor of Wyrd-manifestations through the freezing fog, while **Deathcallers** tune their hearing to the screams of the victims whose souls are trapped within the rot. Most tragic of all are the **Covenbanes**: an elite order of **Marked Vreken** and outcasted **Drun Neth** who take the Barbed Vow, using their biological trail-sight to hunt down their own spore-addicted, "Over-Lit" kin before the mycelial corruption can consume their minds.', dmHook: 'The first Exorcist — whose name has been lost to history — left behind a grimoire called "The Anathema." It contains rituals for permanently destroying Wyrd-creatures by addressing the specific fear that birthed them. The grimoire was stolen from the Greymark archive forty years ago. It resurfaces at your campaign\'s most desperate moment, in the hands of someone who should not have it.' },
      { date: '~798 BP', title: 'The Myrathil Explosion', narrative: 'As the cataclysmic ash-cloud of Emberspire\'s eruption hits the freezing oceans, it triggers a global ecological event. The violent collision of superheated volcanic lava-flows and melting glacial runoff creates massive, miles-wide fields of warm oceanic foam along every coastline. These are the perfect, fertile conditions for the spawning of the **Myrathil**. In a single season of steam and storm, thousands of foam-born infants wash onto the beaches of the Iceheart Sea. The **sea mother**, the vast semi-conscious intelligence of the deep, watches her new children emerge with glowing bioluminescent veins and webbed fingers. She does not speak to them, but she guides the currents to protect them, shaping the **Breakers-Born** to navigate the floating ports, the **Deep-Born** to tend the oceanic trenches, and the **River-Fed** to explore the inland waters as her silent, watery eyes.', dmHook: 'The spawning explosion wasn\'t random. The sea mother deliberately created the conditions — a response to the breach, an immune reaction of the ocean itself. The Myrathil are her antibodies, grown to fight a spiritual infection. But the sea mother cannot tell them this directly. She can only send more storms, more foam, more children — and hope they figure out what they were born to do.' },
      { date: 'Year 13, Dimming', title: 'The Church of the Holy Light Founded', narrative: 'Seeking comfort and guidance in the permanent twilight following the Shattering of the Seal, refugees gather in the High Hearth of Greymark Keep to found the **Church of the Holy Light**. They worship the memory of Sol\'s purity, preaching that the star will rise again if mortals remain pure and unified against the creeping dark.', dmHook: 'The first High Confessor\'s ceremonial rod, carved from a living branch of the High Hearth root, was lost during the Briaran Uprising. It is rumored to still pulse with warm solar light.' },
      { date: 'Year 30, Dimming', title: 'Synod Hold Established', narrative: 'House Ordavan establishes **Synod Hold** as a permanent trade post and gathering place in the starless Sundrift Vale. They trade nomadic wool and hide for southern geothermal resources, drawing herders and Unlit Astril to settle in concentric stone rings.', dmHook: 'The central stone circle at Synod Hold is built from seven standing stones that hum at the same frequency as the Sundered Monoliths, suggesting they were harvested from the same ancient geological vein.' }
    ]
  },
  {
    era: 'The Age of Adaptation',
    span: '~700–60 BP',
    color: '#5c4033',
    glow: '#5c403380',
    gradient: 'linear-gradient(135deg, #2a1a10 0%, #5c4033 50%, #2a1a10 100%)',
    quote: 'The world does not end. It adapts. New races are born from old sins. Empires rise. Wars are fought. And slowly, inexorably, the predator feeds.',
    dmOverview: 'This is the long middle age — centuries of adaptation to a sunless world. New races emerge (Groven, Neth, Astril) while old ones fracture. The War of Thousand Screams shapes Nordhallan identity for centuries. House Viridane is erased from history. The Purge devastates the Mimir. Key themes: adaptation, erasure, the slow normalization of horror, what is lost when history is rewritten.',
    events: [
      { date: 'Year 89, Dimming', title: 'The Stasis of Aldren Thalreth', narrative: 'Fearing the total loss of his memory to the creeping Frostwood fog, High Confessor **Aldren Thalreth** journeys to Nordhalla and seals himself in meditative stasis inside a block of warm, glowing ice within the Frozen Archive. Scribe-Sentinels stand watch eternally to record any telepathic whispers from the frozen saint.', dmHook: 'Aldren\'s stasis chamber is radiating accelerated heat. If the ice melts, his return will trigger a massive theological crisis, as his last journals contradict the Church\'s official scriptures regarding the Breach.' },
      { date: '~700 BP', title: 'The Birth of the Groven', narrative: 'Driven by the industrial demands of their subterranean galleries, **Fexric Deep Alchemists** capture primitive **Thrumm** broodlings from the lower crags. Seeking to refine their mineral hides into flexible labor frames, they inject them with alchemical serums, triggering the catastrophic *Smoothing Plague*. The experiment goes out of control: the trolls\' rigid stone-hide refines into fine, overlapping scales, their thick limbs lengthen to span bottomless chasms, and a higher, desperate cognition awakens in their minds. The first **Groven** — the Vat-Breakers — break their alchemical chains, shatter the spawning vats, and flee upward into the high crags. In their frantic escape, they leave behind the *Lost Brood* — siblings still locked in the lower alchemical tubes, permanently abandoned to Fexric experimentation.', dmHook: 'The Deep Alchemists are still operating. Recent Groven expeditions have found fresh alchemical residue in the lower tunnels — and a fragment of stone-scale that is unmistakably Groven. The Lost Brood may still be alive. A rescue expedition into the deep would take the party through Fexric territory, abandoned vat-chambers, and the suffocating dark where something has been breeding for seven centuries.' },
      { date: '~650 BP', title: 'The Neth Bargain for Immortality', narrative: 'A dying, memory-starved clan of human scribes walks into the dark boundary where the Bryngloom\'s ancient ironwood meets the preserving bog. Rather than offering prayers, they present the **Keeper of the Last Threshold** with a calculated legal argument for their own survival, formatted as a contract. The Keeper, bound by its own cosmic drive for order, accepts the terms. The **Neth** rise from the peat-bog with stilled breath, pure-silver skin, and a contract written in blood. Death becomes a clause to renegotiate rather than an ending. In exchange, every contract written by the **Velun Neth** carries the Keeper\'s absolute authority, and every broken contract is enforced by the entity that preserves them, while the **Drun** undergo a painful ritual to sever their names from the First Ledger, living debt-free but legally non-existent.', dmHook: 'The original First Contract is preserved in the heartwood of Atropolis. It is a living document — it grows, it changes, and it remembers every Neth who has ever signed it. A Neth character who touches the First Contract sees every ancestor\'s signature glowing beneath their own — and realizes that one signature, near the bottom, has been deliberately burned away. Someone was erased from the contract. The Drun know who it was. They are not answering.' },
      { date: 'Year 150, Dimming', title: 'The Zhentarim Reach Synod Hold', narrative: 'The first **Zhentarim** caravan arrives at Synod Hold, offering "trade consultation services" and security escorts. This marks the beginning of their slow economic and political infiltration of the Sundrift Vale, positioning advisors at every Ordavan minister\'s elbow.', dmHook: 'A Zhentarim ledger from this first caravan is locked in the Synod vault. It contains signatures of House Ordavan nobles who traded grazing rights for personal wealth.' },
      { date: '~600 BP', title: 'The Astril Are Born', narrative: 'The constellation-spirits of Sol\'s celestial court — the stars Keth-Amar failed to consume — realize they cannot survive in the starless void. They descend to Mythrill, finding sanctuary in willing human herders and throat-singers of the Sundrift Vale. The **Astril** are born: mortals whose skin bears shimmering, luminous patterns that ebb and flow with faith and emotion. The spirits are not passengers; they are refugees carrying the memories of a sky that once held light. They establish the *Luminarchy*, a strict, light-inherited theocracy built around the star-bloodlines, though the singers watch in silent despair as the oldest constellations fade one by one from the northern sky.', dmHook: 'One constellation-spirit refused to enter a vessel. It remains in the void above Mythrill — the last star visible in the starless sky. The Astril call it "the Remnant." It has been growing brighter for the past decade. The Luminarchy refuses to acknowledge this. An Astril Oracle who looks directly at the Remnant receives visions that no other Oracle can access — but the spirit within them screams the entire time.' },
      { date: '~500 BP', title: 'The War of Thousand Screams', narrative: 'A brutal northern conflict erupts as the glaciers halt. **Skald warriors** hold the sheer Frostgate Pass alone against an invading army ten times their number, the battle running red for three months. When the spring thaw fails to arrive, the corpses are frozen solid in active positions of combat — a sculpture garden of the dead that still stands in the pass. In the aftermath, the first **Dreadnaughts** are forged: Skald smiths weld their greatest warriors permanently inside massive, Archive-forged iron steam-boilers, utilizing coal, blood, or trapped souls to provide the heat and strength needed to ensure the gates never fall again.', dmHook: 'The Frostgate Pass is still there. The frozen dead are still there — eight hundred corpses locked in eternal combat. Some of them are not entirely dead. The Wyrd, drawn to the concentration of violent death, has been nesting in the pass for centuries. Travelers who cross at night report hearing battle cries from the ice. Some report seeing the dead move.' },
      { date: 'Year 350, Dimming', title: 'The Briaran Siege of Greymark', narrative: 'Briaran raiders, seeking to reclaim their ancestral wood from House Thalreth, breach the outer palisade of Greymark Keep. Scribe-Sentinels and Thalren soldiers fight house-to-house for three days before repelling the invaders.', dmHook: 'The siege ended when the Thalreth released a high-density surge of memory-fog, hollowing the minds of the attacking Briaran. The descendants of those attackers still wander the woods as mindless sentinel-shells.' },
      { date: 'Year 412, Dimming', title: 'Cult of Forgotten Shadow Founded', narrative: 'Natalie Seline, a rogue Neth pact-weaver, founds the **Cult of Forgotten Shadow** in a peat-crypt beneath the Over-Shanty in the Bryngloom Forest. The Cult begins practicing shadow-confession and memory extraction, trading crystal vials of harvested memories.', dmHook: 'Natalie Seline\'s first extracted memory—her own name and face—remains in the Sunken Confessionals. The Neth pact-lords will pay any price to destroy it.' },
      { date: 'Year 500, Dimming', title: 'The Mounds Fall Silent', narrative: 'Nomadic clans of the Sundrift Vale report that three major ancestral burial mounds have fallen completely silent. The low-frequency hum that guided migrations for centuries vanishes, causing herders to lose their way in the starless steppes.', dmHook: 'The mounds didn\'t fall silent naturally. The Zhentarim excavated their cores, siphoning the ancestral star-resonance into memory-crystals for sale in the south.' },
      { date: '~300 BP', title: 'The Erasure of House Viridane', narrative: 'Determined to justify their own survival, the six capitulating noble houses spend three centuries systematically erasing every record of **House Viridane**\'s existence — the house that said *no*, the house that chose flight over sacrifice. Official histories are rewritten, libraries are burned, and lineages are forged. The lie holds in all human capitals: there were always only seven houses. The thorn-born **Briaran** become the only living archive of the eighth house\'s existence, their oral tradition and migrating briar-scars keeping the memory of the refusal alive in the deep fog.', dmHook: 'A hidden chamber beneath the oldest Briaran grove contains the Viridane family tree, grown from thorn-vine and preserved in moon-silver. It shows every descendant — and it shows that the bloodline did not die out. A living Viridane heir exists somewhere in the Frostwood Reach, unaware of their heritage. The Briaran Lunarchs know who it is. They have been protecting this person for generations.' },
      { date: 'Year 598, Dimming', title: 'First Contact with the Void', narrative: 'The Cult of Forgotten Shadow\'s inner circle makes first contact with **The Silence Between Stars**—an amorphous void entity that whispers from the dark sky, instructing shadow priests on the locations of the Monoliths.', dmHook: 'The contact was initiated by an Astril heretic who tried to bind their constellation-spirit with shadow magic, creating a permanent beacon for the Void.' },
      { date: 'Year 650, Dimming', title: 'The Great Fire of the Over-Shanty', narrative: 'A massive fire breaks out in the Over-Shanty, threatening to burn down the entire suspended platforms slum. The Cult of Forgotten Shadow uses shadow magic to contain the flames, earning grudging respect from the Drun outcasts.', dmHook: 'The fire was set by Velun Neth agents attempting to incinerate the wanted boards and memory vaults of the Dangling Keel.' },
      { date: '~90 BP', title: 'The Purge', narrative: 'Paranoid noble inquisitors, fearing the shape-shifting espionage of the **Mimir**, burn their sacred birthing chambers across the Frostwood Reach. In a single season of fire and steel, the sacred technique of mask-forging — the ritual by which Mimir craft their persona masks from heartwood and storm-glass — is lost to history. The *Rupture* follows, permanently splintering Mimir society: the **Mask-Borne** canopy aristocrats hoard the surviving masks to maintain their lineages, the sentinel **Mist-Woven** wear crude stone masks to guard the borders, and the floor-dwelling **Unwoven** go maskless, painting their skin and living as outcasts of the dark forest floor.', dmHook: 'A partially-burned mask-forging manual survived the Purge, hidden in the canopy-hold of a Mimir elder who died protecting it. The manual is incomplete — the final three steps are missing. A Mimir character who finds the manual can attempt to reconstruct the lost steps through trial, error, and communion with the fog itself. Failure means the mask consumes the wearer. Success means the Mimir can forge the first new persona mask in ninety years.' },
    ]
  },
  {
    era: 'The Age of the Dimming',
    span: '60 BP – Present',
    color: '#2f1f14',
    glow: '#2f1f1480',
    gradient: 'linear-gradient(135deg, #1a1008 0%, #2f1f14 50%, #1a1008 100%)',
    quote: 'The ember fades. The Monoliths wake. Civil war brews. The seventh age of Mythrill hangs in the balance — and the players, not the gods, will decide which way the scales tip.',
    dmOverview: 'The present age — the campaign\'s starting point. The Solbrand is dimming. The Sundered Monoliths are waking across all seven continents. Every region faces a crisis that threatens to spill. The Unwoven scour the world for Monoliths. The frost lords stir. The Neth have filed seventeen petitions. This is the powder keg your adventurers inherit. Key themes: urgency, fragmentation, the race against entropy, choosing sides in a world with no clean options.',
    events: [
      { date: 'Year 720, Dimming', title: 'Void-Heat Engine Construction', narrative: 'A secret faction within the Frozen Archive, the **Cult of Forgotten Shadow**, begins clandestine construction of Void-heat engines in the sealed lower vaults, attempting to melt the glaciers from within.', dmHook: 'The engines run on siphoned soul-warmth. Several missing Skald trackers\' bodies have been found drained of heat near the vents.' },
      { date: '~60 BP', title: 'The Solbrand Begins to Dim', narrative: 'The **Solbrand** — the eternal ember believed to be Sol\'s last conscious fragment inside the Harath-Vault — begins to dim. The Korr priestly elite of the Emberth, desperate to maintain faith, conceal the decline from the outer Thrask clans. Elder **Thaeron**, the eldest Sun-Speaker, retreats into the inner basalt ring of the Harath-Vault, spending eleven years staring into the fading flame in absolute silence. He discovers that the Solbrand is not a closed ember, but a thermal feeding-line through which Keth-Amar is actively siphoning Sol\'s life, triggering a quiet three-way theological schism among the forge-clans.', dmHook: 'Thaeron is dying. He has been sustained for decades by proximity to the Solbrand, but the ember\'s fading is accelerating his decline. Before he dies, he wants to tell someone what he has seen. He will only speak to an outsider — someone unaffiliated with the forge-clans, someone who cannot be accused of factional bias. The party is summoned to the Harath-Vault. What Thaeron tells them will change everything.' },
      { date: '~30 BP', title: 'The Last Mimir Birth', narrative: 'The mother-flame — the sacred Mimir birthing fire maintained by midwives since before the Purge — gutters and goes out. The final Mimir birth occurs, but the child emerges **Unwoven**: a child whose mask cracked during the birthing ritual, leaving them without a stable face. Evolving a shifting parade of historical faces belonging to ancestors both living and dead, the child becomes a living archive of the Mimir race. The elders are paralyzed, unable to decide whether this child is a sign of their ultimate extinction or the first step toward a maskless rebirth.', dmHook: 'The Unwoven child is now thirty years old. They live in the deepest canopy-hold, hidden from the world. They have never worn a mask. Their face shifts constantly — a parade of strangers, some living, some dead, some who have never existed. The child can tell you who each face belongs to. Some of them are people who died centuries ago. One of them is someone who has not been born yet.' },
      { date: '~20 BP', title: 'The Monoliths Change Resonance', narrative: 'The **Sundered Monoliths** — the seven fragments of the original binding seal dormant since Keth-Amar\'s breach — begin to wake in sequence. The Deep-Born Myrathil Listeners feel the Iceheart Shard thrumming like a plucked string, while the Groven report the Shard beneath Frostmaw Crag has begun to sing, its vibrations cracking the calcified bridges of the Ancestor-Spans and making the stone weep. The Astril\'s constellation-spirits convulse in agony near any Monolith, realizing that the predator inside the vault has turned its attention to the fragments of its original victory.', dmHook: 'The seven Monoliths are not waking independently. They are waking in sequence — each one activating the next in a chain reaction that circles the world. The pattern traces a spiral that, when mapped, points to a single location: a point in the void directly above Emberspire\'s caldera. Whatever happens when the last Monolith wakes will happen there. The Astril Remnant — the last visible star — is positioned exactly at that point.' },
      { date: '~5 BP', title: 'The Shifting of the Spawning Gales', narrative: 'The spawning gales — the oceanic storms that have created new Myrathil for centuries -- shift north. The First Shore, the stretch of Iceheart coastline where Myrathil have spawned for millennia, grows quiet, its waves stilling and its foam thinning. The **sea mother** shifts her storms toward Nordhalla\'s frozen coast, positioned directly over the deepest oceanic trench. Evolving a desperate defensive intelligence, the sea mother is massing her Myrathil forces along the seabed to block Keth-Amar\'s geothermal hunger from breaching the ocean floor.', dmHook: 'The sea mother is repositioning her forces. She knows something the land-folk do not: Keth-Amar\'s influence is not limited to the Sundered Monoliths. It is spreading through the world\'s geothermal network, following the vents and volcanic channels that warm the surface. The sea mother is moving the Myrathil toward the point where the predator\'s influence will breach the ocean floor.' },
      { date: 'Present', title: 'The Seventh Age Hangs in the Balance', narrative: 'The **Unwoven** Emberth, having ritually defaced their forge-marks, scour the continents for Sundered Monoliths, believing that sealing Keth-Amar\'s breach will allow Sol to complete the Deepening and be reborn. In the north, frost lords stir beneath Nordhalla\'s glaciers. In Atropolis, the **Neth** file seventeen urgent petitions to claim the Monolith pools as protected contract archives. Civil war brews between the Korr and Thrask forge-clans in Sundale, while **Covenbanes** hunt the mycelial-addicted Over-Lit across the margins of every settled capital. The powder keg is global. The fuse is lit.', dmHook: 'This is where your campaign begins. Every region\'s crisis is an adventure waiting to happen. Every Sundered Monolith is a dungeon with a boss at its heart. Every faction has an agenda. Every NPC has a secret. The seventh age of Mythrill does not have a predetermined ending — that\'s what the players are for. Start small: a frozen village in the Frostwood Reach, a missing child, a fog that whispers. Build toward the Monoliths. End at Emberspire.' },
    ]
  },
];

const EVENT_ART_MAP = {};

const getEventArt = (title) => {
  const matchedKey = Object.keys(EVENT_ART_MAP).find(k => title.toLowerCase().includes(k.toLowerCase()));
  return matchedKey ? EVENT_ART_MAP[matchedKey] : null;
};

const TimelineDisplay = () => {
  const [showDMNotes, setShowDMNotes] = useState(false);
  const [expandedEras, setExpandedEras] = useState(E.map(() => true));

  const toggleEra = (idx) => {
    const next = [...expandedEras];
    next[idx] = !next[idx];
    setExpandedEras(next);
  };

  const runicDiamond = '\u25C6';
  const publicUrl = process.env.PUBLIC_URL || '';

  return (
    <div style={{ padding: '16px 20px 48px', maxWidth: '850px', margin: '0 auto', fontFamily: '"Crimson Text", "Georgia", serif' }}>
      {/* ── Header ── */}
      <div style={{
        textAlign: 'center', marginBottom: '24px', position: 'relative',
        padding: '16px 0 16px',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--rpg-gold, #c4a060), transparent)',
        }} />
        <h2 style={{
          fontFamily: '"Cinzel", serif', fontSize: '28px', color: '#4a150b', /* Rich Mahogany Ink */
          letterSpacing: '3px', margin: '0 0 6px', textTransform: 'uppercase',
          fontWeight: 700,
        }}>
          The Chronicle of the Sundering
        </h2>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
          marginBottom: '4px',
        }}>
          <span style={{ color: 'var(--rpg-dark-gold, #8f6f35)', fontSize: '10px' }}>{runicDiamond}{runicDiamond}{runicDiamond}</span>
          <span style={{ color: '#6d4021', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 600 }}>
            From the First Stars to the Age of the Dimming
          </span>
          <span style={{ color: 'var(--rpg-dark-gold, #8f6f35)', fontSize: '10px' }}>{runicDiamond}{runicDiamond}{runicDiamond}</span>
        </div>
        <div style={{
          position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--rpg-gold, #c4a060), transparent)',
        }} />
      </div>

      {/* ── DM Toggle ── */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px',
        marginBottom: '20px', paddingRight: '4px',
      }}>
        <span style={{ color: '#6d4021', fontSize: '12px', fontStyle: 'italic', fontWeight: 600 }}>
          {showDMNotes ? 'GM Insights Revealed' : 'GM Insights Hidden'}
        </span>
        <button
          onClick={() => setShowDMNotes(!showDMNotes)}
          style={{
            background: showDMNotes
              ? 'linear-gradient(180deg, #8a1a10, #5a100a)'
              : 'linear-gradient(180deg, #f3ebd9, #eddcb8)',
            border: `1px solid ${showDMNotes ? 'var(--rpg-gold, #c4a060)' : 'rgba(196, 160, 96, 0.4)'}`,
            color: showDMNotes ? '#fffbf2' : '#5a1e12',
            padding: '5px 14px', borderRadius: '3px',
            cursor: 'pointer', fontFamily: '"Cinzel", serif', fontSize: '10px',
            fontWeight: 700, letterSpacing: '1px', transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <i className={showDMNotes ? 'fas fa-eye' : 'fas fa-eye-slash'} style={{ marginRight: '6px' }} />
          {showDMNotes ? 'HIDE GM NOTES' : 'SHOW GM NOTES'}
        </button>
      </div>

      {/* ── Timeline ── */}
      <div style={{ position: 'relative', paddingLeft: '45px' }}>
        {/* Elegant Gold-and-Iron Spine */}
        <div style={{
          position: 'absolute', left: '17px', top: '12px', bottom: '12px', width: '2px',
          background: 'linear-gradient(to bottom, var(--rpg-gold, #c4a060), var(--rpg-dark-gold, #8f6f35), #8a1a10, #5c4033, #2b1c11)',
          boxShadow: '0 0 4px rgba(139, 69, 19, 0.2)',
        }} />

        {E.map((era, ei) => {
          const expanded = expandedEras[ei];
          const isLast = ei === E.length - 1;

          return (
            <div key={ei} style={{ marginBottom: isLast ? '0' : '40px' }}>
              {/* Era plaque header */}
              <div
                onClick={() => toggleEra(ei)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginLeft: '-58px', marginBottom: expanded ? '16px' : '8px',
                  cursor: 'pointer', userSelect: 'none',
                }}
              >
                {/* Custom Wax-Sealed Node */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a82015 0%, #70110a 100%)',
                  border: '2px solid var(--rpg-gold, #c4a060)',
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  transition: 'all 0.25s ease',
                  transform: expanded ? 'scale(1.15) rotate(10deg)' : 'scale(1)',
                }}>
                  <span style={{ color: '#fffbf2', fontSize: '10px', fontWeight: 700 }}>
                    {expanded ? runicDiamond : '\u25B8'}
                  </span>
                </div>

                <div style={{ flex: 1, borderBottom: '1px solid rgba(196, 160, 96, 0.2)', paddingBottom: '4px' }}>
                  <h3 style={{
                    fontFamily: '"Cinzel", serif', fontSize: '1.25rem', color: '#4a150b',
                    margin: 0, letterSpacing: '1px', fontWeight: 700,
                  }}>
                    {era.era}
                    {era.span && (
                      <span style={{
                        fontSize: '0.95rem', color: 'var(--rpg-dark-gold, #8f6f35)', marginLeft: '12px',
                        fontWeight: 600, fontStyle: 'italic',
                      }}>
                        &mdash; {era.span}
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Collapsible era content */}
              {expanded && (
                <div style={{ paddingLeft: '4px' }}>
                  {/* Era narrative quote */}
                  <div style={{
                    margin: '0 0 20px 4px', padding: '12px 18px',
                    borderLeft: '3px solid var(--rpg-dark-gold, #8f6f35)',
                    background: 'rgba(196, 160, 96, 0.04)',
                    borderRadius: '0 4px 4px 0',
                  }}>
                    <p style={{
                      margin: 0, color: '#5a1e12', fontSize: '1.05rem',
                      fontStyle: 'italic', lineHeight: '1.6',
                    }}>
                      &ldquo;{era.quote}&rdquo;
                    </p>
                  </div>

                  {/* GM Overview */}
                  {showDMNotes && era.dmOverview && (
                    <div style={{
                      margin: '0 0 20px 4px', padding: '12px 18px',
                      background: 'rgba(138, 26, 16, 0.03)',
                      border: '1px dashed rgba(138, 26, 16, 0.35)',
                      borderRadius: '4px',
                    }}>
                      <span style={{
                        fontSize: '9px', color: '#8a1a10', fontFamily: '"Cinzel", serif',
                        letterSpacing: '2px', display: 'block', marginBottom: '6px',
                        fontWeight: 700
                      }}>
                        GM ARCHIVAL INSIGHT
                      </span>
                      <p style={{
                        margin: 0, color: '#4a3728', fontSize: '0.98rem',
                        lineHeight: '1.55', fontStyle: 'italic',
                      }}>
                        {era.dmOverview}
                      </p>
                    </div>
                  )}

                  {/* Event cards list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '4px' }}>
                    {era.events.map((ev, ei2) => {
                      const artImage = getEventArt(ev.title);

                      return (
                        <div key={ei2} className="timeline-card">
                          <div className="timeline-card-header">
                            <h4 className="timeline-card-title">{ev.title}</h4>
                            <span className="timeline-card-date">{ev.date}</span>
                          </div>
                          <div className="timeline-card-body">
                            {artImage && (
                              <div className="timeline-art-container">
                                <img 
                                  src={`${publicUrl}/assets/images/${artImage}`} 
                                  alt={ev.title} 
                                  className="timeline-art" 
                                />
                              </div>
                            )}
                            <p dangerouslySetInnerHTML={{
                              __html: ev.narrative.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong>$1</strong>'
                              )
                            }} />
                          </div>

                          {/* GM Hook (placed below, taking full width) */}
                          {showDMNotes && ev.dmHook && (
                            <div className="timeline-gm-hook">
                              <span className="timeline-gm-hook-label">
                                CAMPAIGN HOOK
                              </span>
                              <p className="timeline-gm-hook-text">
                                {ev.dmHook}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer Quote ── */}
      <div style={{
        textAlign: 'center', marginTop: '36px', paddingTop: '20px',
        borderTop: '1px solid rgba(196, 160, 96, 0.25)',
      }}>
        <p style={{
          margin: 0, color: '#6d4021', fontSize: '1.05rem', fontStyle: 'italic',
          lineHeight: '1.65',
        }}>
          &ldquo;Sol cannot wake. Sol cannot die. Sol is being eaten from within.&rdquo;
          <br />
          <span style={{ fontSize: '0.85rem', color: 'var(--rpg-dark-gold, #8f6f35)', fontWeight: 600 }}>
            &mdash; Elder Thaeron, Sun-Speaker of the Harath-Vault
          </span>
        </p>
      </div>
    </div>
  );
};
export default TimelineDisplay;
