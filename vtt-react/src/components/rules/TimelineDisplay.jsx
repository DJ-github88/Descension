import React, { useState } from 'react';

const E = [
  {
    era: 'The Age Before Ages',
    color: '#6b4c3b',
    glow: '#6b4c3b80',
    gradient: 'linear-gradient(135deg, #3a2218 0%, #6b4c3b 50%, #3a2218 100%)',
    quote: 'Before noble houses, before dark bargains — there was a law older than any deity.',
    dmOverview: 'This era establishes the cosmic framework. The Deepening cycle is the foundational law of the universe — every star dies and is reborn. Use this era to seed ancient mysteries: the Keeper\'s true nature, the sea mother\'s agenda, Aex\'s fate before the binding. Players exploring primordial ruins might find records of this age.',
    events: [
      { date: 'Unknown', title: 'The First Ignition', narrative: 'The first stars ignite across the void. Each one establishes the **Deepening** — the ancient death-rebirth cycle that governs all celestial bodies. This is not a myth. It is a law of existence, older than any deity, crueler than any scripture. Every star that has ever burned has entered the Deepening. Every star has emerged — until Sol.', dmHook: 'A pre-Deepening artifact, older than any known civilization, surfaces in the Cragjaw Peaks. The Fexrick claim it predates their oldest holdfasts by millennia. It hums at a frequency that makes Astril spirits weep.' },
      { date: 'Unknown', title: 'Aex, Firstborn of Sol', narrative: '**Aex** comes into being — living solar fire given form, the first and only child of the sun. Standing watch through every Deepening cycle, Aex is Sol\'s guardian, its witness, its memory across eons. The oldest Fexric carvings depict Aex as a serpent of light coiled around a dying ember.', dmHook: 'Aex is not truly dead. Fragments of the firstborn\'s consciousness linger in the binding seal — and therefore in every Sundered Monolith. A character who touches a Monolith may receive a vision: fire, betrayal, and the face of the one who took the hide.' },
      { date: 'Unknown', title: 'The Fexrick Carve the First Holdfast', narrative: 'The **Fexrick** — compact, gnomish engineers — carve their first holdfast into the Cragjaw Peaks. This marks the beginning of the oldest continuous civilization on Mythrill. Their oral maintenance songs, passed down for eight millennia, contain knowledge no living Fexric fully understands.', dmHook: 'A Fexric oral song, when translated by a Myrathil Deep-Born Listener, turns out to be a star-chart from before the sky went dark. It points to a location beneath Frostmaw Crag that no Fexric has excavated in six thousand years.' },
      { date: 'Unknown', title: 'The Thrumm Awaken', narrative: 'The **Thrumm** — hulking stone-trolls — inhabit the deepest crags. They are the mountain\'s first children, born of mineral and pressure, speaking in the low-frequency rumble that gives them their name. The Fexrick call them "the mountain\'s heartbeat made flesh."', dmHook: 'Thrumm shamans practice a form of lithomancy — reading future events in the cracks of sacred stones. The shamans have been reading the same prophecy for eight centuries: "The smooth ones will return, and the mountain will choose." The Groven do not know about this prophecy.' },
      { date: 'Unknown', title: 'The Vreken Cultivate the Deep', narrative: 'The **Vreken** — a compact, lantern-eyed people — cultivate phosphorescent fungi in the Bryngloom\'s bog-caves. Their irises emit a steady bioluminescent glow, and they perceive "the trail" — residual light left by passage, death, and decay. They are the forest\'s oldest inhabitants.', dmHook: 'The oldest Vreken fungal-tablet records contain a word that does not translate into any known language. A Neth archivist who glimpsed the tablet went silent for three days, then filed a petition to have the tablet destroyed. The petition was denied. The Neth has not spoken of what they read.' },
      { date: 'Unknown', title: 'The Keeper Establishes Dominion', narrative: 'The **Keeper of the Last Threshold** establishes its domain over the Bryngloom Forest. The Vreken call it the Root-Veil and revere it as sacred. The entity does not demand worship — it demands order. Every death in its domain is recorded. Every soul that passes through is weighed, catalogued, and filed.', dmHook: 'The Keeper is not a god. It is something older — a cosmic functionary, a bureaucrat of the threshold between life and whatever comes after. It can be bargained with, but it cannot be lied to. Characters who die in the Bryngloom may find themselves in a waiting room, filling out forms in a language they suddenly understand, while something behind an ironwood desk considers their case.' },
      { date: 'Unknown', title: 'The Sea Mother\'s First Attempts', narrative: 'The sea mother — the vast, semi-conscious intelligence of the Iceheart Sea — makes her first attempts at personhood. She shapes foam into faces, currents into limbs, storms into voices. None of them hold. But she is patient. She has been patient for longer than the continents have had names.', dmHook: 'The sea mother is not hostile — she is curious. She wants to understand the creatures that live on her skin. But her attempts at communication have created the Myrathil, the spawning gales, and the storms that sink ships. Characters lost at sea may encounter one of her failed experiments: a face in the foam that speaks in the voice of someone they buried.' },
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
      { date: '~800 BP', title: 'Sol Enters the Deepening', narrative: '**Sol** enters the Deepening — the vulnerable trance-state of the death-rebirth cycle. The Augurs of House Thalreth are the first to read the signs in the cooling light. Their rune-scarred forearms burn with visions traded from personal memory. The Oracles of Sol\'s celestial court — constellation-spirits among the Astril — scream warnings across the void. The Doomsayers begin recording what they believe will be the last days of warmth.', dmHook: 'A Doomsayer\'s journal from this period, preserved in the Greymark archive, contains a prophecy that was never fulfilled: "When the sun-child weeps, the predator will choke." The prophecy was dismissed at the time. It has never been revisited. An Astril Oracle who reads the journal today sees something in the words that no one saw eight centuries ago.' },
      { date: '~800 BP', title: 'Keth-Amar Descends', narrative: 'An abyssal entity called **Keth-Amar** — the Sun-Eater, the First Hunger — arrives. Drawn by the dimming light of Sol\'s Deepening, it circles the dying star like a shark scenting blood. The world begins to feel its presence: nightmares worsen, frost creeps south, and children born during this decade emerge with eyes that reflect no light.', dmHook: 'Keth-Amar left something behind when it descended — a physical remnant of its passage through the void. It fell somewhere in the Iceheart Sea. The Myrathil call it "the Hunger-Stone" and have kept its location secret for centuries. The sea mother has been circling it, studying it, waiting.' },
      { date: '~800 BP', title: 'The Binding Beneath Sundale', narrative: 'Seven noble families pool their bloodlines to entomb the dying star beneath **Sundale**. Inscriptors encode the binding terms into burn-scar and memory-glass. Titans of the Emberth Korr stand sentinel. Wardens guard the approaches. The ritual requires a vessel woven from living radiance — the hide of **Aex**, Sol\'s firstborn. Aex does not volunteer. Aex is taken — the first being to eat fire so others would not burn. The Spellguards trace their origin to this moment: the first magic-users to absorb harm meant for another.', dmHook: 'A fragment of Aex\'s hide — a scrap that was cut away during the ritual and discarded — survives in a hidden reliquary beneath the Harath-Vault. It still burns. The tending-clan has never told anyone it exists. An Emberth Titan who discovers it must choose: reveal the evidence of the original sin, or protect the faith that keeps the forge-clans united.' },
      { date: '~800 BP', title: 'The Underground Exodus', narrative: 'The **Emberth**, forewarned by Sun-Speaker prophecy, are already underground when the surface freezes. They excavated vast tunnel networks beneath Sundale, guided by visions of darkness and descent that their prophets received decades before the binding. The **Mimir** — mask-bound faceshifters — retreat into the Fog-Vales of the Frostwood Reach, where the permanent fog becomes their greatest ally and their deepest prison.', dmHook: 'Some Emberth tunnels were sealed from the inside during the exodus — sections that Sun-Speakers declared "unclean." No living Emberth remembers why. The seals have never been broken. Something is still down there, waiting in the dark beneath Sundale, and it is not Keth-Amar.' },
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
      { date: '~798 BP', title: 'The Long Winter', narrative: 'Winter does not end. The surface world begins to die. Frost creeps past the northern mountain ranges. Crops fail in fields that have fed civilizations for millennia. Children freeze in their cradles. Every people digs into the earth for residual warmth. Keth-Amar, denied its prey by the binding ritual, turns to the starving. It whispers to the desperate nobles — not in words, but in impressions: *warmth, vents cracking frozen earth.* The price: **firstborn heirs.**', dmHook: 'The whispers were not heard equally. Some nobles reported hearing nothing at all — only a growing, gnawing certainty that their children would save them. The Doomsayers who recorded this phenomenon called it "the predator\'s logic" — a form of psychic manipulation that bypassed language entirely. A character with psychic sensitivity who enters the Frostwood Reach\'s deep fog may hear residual echoes of these whispers, still reverberating after eight centuries.' },
      { date: '~798 BP', title: 'Sera Solvan, the First Martyr', narrative: 'The first **Martyr** was a Solvarn mother named **Sera Solvan**, who carved her sacrificed child\'s name into her forearm. The scar still glows — eight centuries later — in the presence of a Sundered Monolith. Her descendants carry the same scar, passed through bloodline rather than blade. Her act created the Martyr class: mortals who take wounds into their own flesh so others don\'t have to.', dmHook: 'Sera Solvan\'s original journal survives in the Greymark archive, written in a code that only her bloodline can read. The journal contains the names of all six sacrificed children — names that were burned from every official record. Speaking a child\'s true name near the Monolith tied to their bloodline causes the Monolith to resonate differently. No one has tried this. No one knows what would happen.' },
      { date: '~798 BP', title: 'House Viridane Refuses', narrative: '**House Viridane** — the eighth house — refuses. They flee south through the Frostwood Reach, pursued by the six houses that capitulated. They make a counter-bargain with fae entities in the deepest woods. The **Briaran** are born from this refusal: thorns growing where hair should be, carrying the memory of the burned contract in their blood. Their Lunarchs are living records of the house that said *no*.', dmHook: 'The original fae contract still exists — a living document grown from thorn-vine and moonlight, buried beneath the oldest Briaran grove. It can be read, but only by a Briaran Lunarch during a lunar eclipse. The contract contains a clause that the Briaran have never invoked: the fae entities owe House Viridane a debt that has never been collected.' },
      { date: '~798 BP', title: 'The Shattering of the Seal', narrative: 'Keth-Amar consumes the six sacrificed heirs as **vessel-keys** — the children\'s bloodlines were the locks on the binding seal, and by devouring them, the predator cracks the vault from within. The seal shatters into **7 Sundered Monoliths** — massive fragments of the original binding, each screaming with the echo of a sacrificed heir. **Emberspire** erupts. The **Wyrd** — a formless, primordial spiritual rot sealed since before human memory — bleeds through the cracks into the surface air.', dmHook: 'The seventh Monolith is the anomaly. Six children were consumed — where did the seventh fragment come from? Some scholars believe Aex\'s consciousness, fragmented during the binding, imprinted on a piece of the seal. Others whisper that the seventh Monolith contains something else entirely — not a child\'s echo, but the first scream of the predator itself when it realized it was trapped inside the vault with a dying god.' },
      { date: '~798 BP', title: 'The First Exorcists Rise', narrative: 'The first **Exorcists** are active within months of the breach — mortals who discover they can perceive, bind, and banish Wyrd-manifestations. **Huntresses** begin tracking Wyrd-sign through every biome, reading the spiritual spoor left by creatures born of collective fear. **Deathcallers** discover the Wyrd\'s victims are not silent — they scream, and someone with the right ear can hear them. **Covenbanes** are written in that first bleeding of spiritual rot — hunters of the Over-Lit, the Wyrd-corrupted, the things that were once people.', dmHook: 'The first Exorcist — whose name has been lost to history — left behind a grimoire called "The Anathema." It contains rituals for permanently destroying Wyrd-creatures by addressing the specific fear that birthed them. The grimoire was stolen from the Greymark archive forty years ago. It resurfaces at your campaign\'s most desperate moment, in the hands of someone who should not have it.' },
      { date: '~798 BP', title: 'The Myrathil Explosion', narrative: 'The **Myrathil** population explodes. The violent clash of volcanic heat from Emberspire\'s eruption and melting glacial ice sheet runoff creates a massive explosion of oceanic foam — the precise conditions for Myrathil spawning. Thousands are born along every coastline. The sea mother, watching from the deep, does not intervene. She is still learning what they are.', dmHook: 'The spawning explosion wasn\'t random. The sea mother deliberately created the conditions — a response to the breach, an immune reaction of the ocean itself. The Myrathil are her antibodies, grown to fight a spiritual infection. But the sea mother cannot tell them this directly. She can only send more storms, more foam, more children — and hope they figure out what they were born to do.' },
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
      { date: '~700 BP', title: 'The Birth of the Groven', narrative: 'Fexric Deep Alchemists capture Thrumm broodlings and inject them with alchemical serums — the Smoothing Plague. Stone-hide refines into fine scales. Limbs lengthen for spanning chasms. Higher cognition awakens. The first **Groven** — the Vat-Breakers — shatter their vats, free their kin, and flee upward into the high crags. They leave behind the Lost Brood: broodlings still in the vats, never rescued.', dmHook: 'The Deep Alchemists are still operating. Recent Groven expeditions have found fresh alchemical residue in the lower tunnels — and a fragment of stone-scale that is unmistakably Groven. The Lost Brood may still be alive. A rescue expedition into the deep would take the party through Fexric territory, abandoned vat-chambers, and the suffocating dark where something has been breeding for seven centuries.' },
      { date: '~650 BP', title: 'The Neth Bargain for Immortality', narrative: 'A dying clan of scribes walks into the boundary where the Bryngloom\'s ancient woods meet the preserving bog. They present the **Keeper of the Last Threshold** with a legal argument for their own survival — not a prayer, but a contract. The Keeper accepts. The **Neth** rise from the bog with stilled breath, mother-of-pearl skin, and a pact written in blood: death would be a clause to renegotiate, not an ending. In exchange, every Neth contract carries the Keeper\'s cosmic authority, and every broken contract is enforced by the entity that preserves them.', dmHook: 'The original First Contract is preserved in the heartwood of Atropolis. It is a living document — it grows, it changes, and it remembers every Neth who has ever signed it. A Neth character who touches the First Contract sees every ancestor\'s signature glowing beneath their own — and realizes that one signature, near the bottom, has been deliberately burned away. Someone was erased from the contract. The Drun know who it was. They are not answering.' },
      { date: '~600 BP', title: 'The Astril Are Born', narrative: 'The constellation-spirits of Sol\'s celestial court — the ones Keth-Amar failed to consume — find sanctuary in willing mortal vessels. The **Astril** are born: herders and throat-singers whose skin bears luminous patterns that ebb with faith and emotion. The Luminarchy begins — a theocracy built around the hierarchy of inherited light. The spirits are not passengers. They are refugees, carrying the memory of everything that was lost when the sky went dark.', dmHook: 'One constellation-spirit refused to enter a vessel. It remains in the void above Mythrill — the last star visible in the starless sky. The Astril call it "the Remnant." It has been growing brighter for the past decade. The Luminarchy refuses to acknowledge this. An Astril Oracle who looks directly at the Remnant receives visions that no other Oracle can access — but the spirit within them screams the entire time.' },
      { date: '~500 BP', title: 'The War of Thousand Screams', narrative: 'A brutal northern conflict. Hrym Berserkers hold the Frostgate Pass alone against an army ten times their number. The pass runs red for three months. When the thaw comes, the bodies are frozen in positions of combat — a sculpture garden of the dead that still stands. The first **Dreadnaughts** are forged in the aftermath: Hrym warriors who seal themselves in Archive-forged iron, trading their mortality for the strength to ensure the Frostgate never falls again.', dmHook: 'The Frostgate Pass is still there. The frozen dead are still there — eight hundred corpses locked in eternal combat. Some of them are not entirely dead. The Wyrd, drawn to the concentration of violent death, has been nesting in the pass for centuries. Travelers who cross at night report hearing battle cries from the ice. Some report seeing the dead move.' },
      { date: '~300 BP', title: 'The Erasure of House Viridane', narrative: 'The six capitulating houses spend three centuries erasing every record of House Viridane\'s existence — the house that refused, the house that said *no*. Official histories are rewritten. Bloodline records are burned. The lie holds in most human territories: there were always seven houses. The **Briaran** — the thorn-born descendants of Viridane — become the only living archive of the eighth house\'s existence, their oral tradition the sole record of a people who chose extinction over complicity.', dmHook: 'A hidden chamber beneath the oldest Briaran grove contains the Viridane family tree, grown from thorn-vine and preserved in moon-silver. It shows every descendant — and it shows that the bloodline did not die out. A living Viridane heir exists somewhere in the Frostwood Reach, unaware of their heritage. The Briaran Lunarchs know who it is. They have been protecting this person for generations.' },
      { date: '~90 BP', title: 'The Purge', narrative: 'Inquisitors burn Mimir birthing chambers across the Frostwood Reach. The art of mask-forging — the sacred technique by which Mimir craft their persona masks — is lost in a single season of fire. The **Rupture** follows: a splintering of Mimir society into those who cling to the old ways without the means to practice them, and those who abandon their heritage entirely. The last Mimir who knew the full mask-forging ritual died forty years ago, taking the secret into the fog.', dmHook: 'A partially-burned mask-forging manual survived the Purge, hidden in the canopy-hold of a Mimir elder who died protecting it. The manual is incomplete — the final three steps are missing. A Mimir character who finds the manual can attempt to reconstruct the lost steps through trial, error, and communion with the fog itself. Failure means the mask consumes the wearer. Success means the Mimir can forge the first new persona mask in ninety years.' },
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
      { date: '~60 BP', title: 'The Solbrand Begins to Dim', narrative: 'The **Solbrand** — the eternal ember believed to be Sol\'s last conscious fragment — begins to dim. The tending-clan of the Emberth has known for three generations and concealed it from the other forge-clans. Elder **Thaeron**, the eldest Sun-Speaker, has not left the inner ring of the Harath-Vault in eleven years, staring into a dying ember. He has seen something in the light that does not match any faction\'s theology. He has told no one what he believes.', dmHook: 'Thaeron is dying. He has been sustained for decades by proximity to the Solbrand, but the ember\'s fading is accelerating his decline. Before he dies, he wants to tell someone what he has seen. He will only speak to an outsider — someone unaffiliated with the forge-clans, someone who cannot be accused of factional bias. The party is summoned to the Harath-Vault. What Thaeron tells them will change everything.' },
      { date: '~30 BP', title: 'The Last Mimir Birth', narrative: 'The last **Mimir** birth occurs. The mother-flame — the sacred birthing fire maintained by Mimir midwives since before the Purge — still burns, but its fuel is running out. The child is born **Unwoven**: a Mimir whose mask cracked during the birthing ritual, leaving them unable to hold a stable face. They are neither Mimir nor human — they are something new, something the world has never seen. The Mimir elders do not know whether the child is a miracle or an omen.', dmHook: 'The Unwoven child is now thirty years old. They live in the deepest canopy-hold, hidden from the world. They have never worn a mask. Their face shifts constantly — a parade of strangers, some living, some dead, some who have never existed. The child can tell you who each face belongs to. Some of them are people who died centuries ago. One of them is someone who has not been born yet.' },
      { date: '~20 BP', title: 'The Monoliths Change Resonance', narrative: 'The **Sundered Monoliths** — dormant for centuries — begin to wake. Deep-Born Myrathil Listeners feel the Iceheart Monolith thrumming like a plucked string. The Groven report the Monolith beneath Frostmaw Crag has begun to sing — vibrations cracking older Ancestor-Spans, a frequency that makes bridge-stone weep. The Astril\'s constellation-spirits writhe and recoil near any Monolith. Keth-Amar, growing stronger inside the vault, has turned its attention to the fragments of its original victory.', dmHook: 'The seven Monoliths are not waking independently. They are waking in sequence — each one activating the next in a chain reaction that circles the world. The pattern traces a spiral that, when mapped, points to a single location: a point in the void directly above Emberspire\'s caldera. Whatever happens when the last Monolith wakes will happen there. The Astril Remnant — the last visible star — is positioned exactly at that point.' },
      { date: '~5 BP', title: 'The Shifting of the Spawning Gales', narrative: 'The spawning gales — the oceanic storms that create new Myrathil — shift north. The First Shore, the stretch of Iceheart coastline where Myrathil have spawned for millennia, grows quieter, its waves stilling, its foam thinning. The sea mother moves her storms toward Nordhalla\'s frozen coast — and toward the deepest trench in the known ocean, where something old and patient has been waiting.', dmHook: 'The sea mother is repositioning her forces. She knows something the land-folk do not: Keth-Amar\'s influence is not limited to the Sundered Monoliths. It is spreading through the world\'s geothermal network, following the vents and volcanic channels that warm the surface. The sea mother is moving the Myrathil toward the point where the predator\'s influence will breach the ocean floor.' },
      { date: 'Present', title: 'The Seventh Age Hangs in the Balance', narrative: 'The **Unwoven** — Emberth who have ritually defaced their forge-marks — scour the world for Sundered Monoliths, believing that sealing Keth-Amar\'s breach may allow Sol to finally complete the Deepening and be reborn. Frost lords stir beneath Nordhalla\'s glaciers. The **Neth** have filed seventeen petitions to declare the Bryngloom Monolith pool a protected archive site — the Keeper has not ruled on any of them. Civil war brews among the Emberth forge-clans. **Covenbanes** hunt the Over-Lit across every continent, stretched to their breaking point. The powder keg is global. The fuse is lit.', dmHook: 'This is where your campaign begins. Every region\'s crisis is an adventure waiting to happen. Every Sundered Monolith is a dungeon with a boss at its heart. Every faction has an agenda. Every NPC has a secret. The seventh age of Mythrill does not have a predetermined ending — that\'s what the players are for. Start small: a frozen village in the Frostwood Reach, a missing child, a fog that whispers. Build toward the Monoliths. End at Emberspire.' },
    ]
  },
];

const EVENT_ART_MAP = {
  'The First Ignition': 'watercolor_tome.png',
  'Aex, Firstborn': 'watercolor_dragon.png',
  'Fexrick Carve': 'watercolor_anvil.png',
  'Thrumm Awaken': 'watercolor_tree.png',
  'Vreken Cultivate': 'watercolor_candle.png',
  'Keeper Establishes': 'watercolor_sigil.png',
  'Sea Mother': 'watercolor_map.png',
  'Sol Enters the Deepening': 'watercolor_hourglass.png',
  'Keth-Amar Descends': 'watercolor_void.png',
  'Binding Beneath Sundale': 'watercolor_breastplate.png',
  'Underground Exodus': 'watercolor_backpack.png',
  'Long Winter': 'watercolor_campfire.png',
  'Sera Solvan': 'watercolor_skull.png',
  'House Viridane Refuses': 'watercolor_seal.png',
  'Shattering of the Seal': 'watercolor_shackles.png',
  'First Exorcists': 'watercolor_staff.png',
  'Myrathil Explosion': 'watercolor_compass.png',
  'Birth of the Groven': 'watercolor_flask.png',
  'Neth Bargain': 'watercolor_scroll.png',
  'Astril Are Born': 'watercolor_crystal.png',
  'War of Thousand Screams': 'watercolor_shield.png',
  'Erasure of House Viridane': 'watercolor_seal.png',
  'The Purge': 'watercolor_quill.png',
  'Solbrand Begins to Dim': 'watercolor_candle.png',
  'Last Mimir Birth': 'watercolor_sigil.png',
  'Monoliths Change Resonance': 'watercolor_d20.png',
  'Shifting of the Spawning': 'watercolor_compass.png',
  'Seventh Age': 'watercolor_scales.png'
};

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

                            {/* GM Hook */}
                            {showDMNotes && ev.dmHook && (
                              <div style={{
                                marginTop: '12px', padding: '10px 14px',
                                background: 'rgba(138, 26, 16, 0.03)',
                                borderLeft: '3px solid #8a1a10',
                                borderRadius: '0 4px 4px 0',
                              }}>
                                <span style={{
                                  fontSize: '9px', color: '#8a1a10', fontFamily: '"Cinzel", serif',
                                  letterSpacing: '1.5px', display: 'block', marginBottom: '4px',
                                  fontWeight: 700
                                }}>
                                  CAMPAIGN HOOK
                                </span>
                                <p style={{
                                  margin: 0, color: '#6d4021', fontSize: '0.96rem',
                                  lineHeight: '1.5', fontStyle: 'italic',
                                }}>
                                  {ev.dmHook}
                                </p>
                              </div>
                            )}
                          </div>
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
