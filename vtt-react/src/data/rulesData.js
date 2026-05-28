// Comprehensive Rules Data Structure
// Organized into 8 main categories with subcategories and detailed content

export const RULES_CATEGORIES = [
  {
    id: 'world-lore',
    name: 'World Lore',
    icon: 'fas fa-globe',
    description: 'The mythic history of Mythrill — from the theft of the sun to the fractured continents',
    subcategories: [
      {
        id: 'cosmic-mythos',
        name: 'The Deepening & The Breach',
        icon: 'fas fa-sun',
        theme: 'narrative',
        summary: [
          'The Deepening is the ancient death-rebirth cycle of every star — and it always attracts predators.',
          'The 7 Noble Families entombed Sol beneath Sundale using the hide of Aex, Sol\'s firstborn — a desperate act of protection soaked in sacrifice.',
          'Keth-Amar consumed six families\' sacrificed heirs as vessel-keys, shattering the seal into 7 Sundered Monoliths. The slow feast began.'
        ],
        content: {
          title: 'The Deepening & The Great Breach',
          description: 'Before noble houses, before dark bargains, there was a law older than any deity: the Deepening, the death-rebirth cycle of every star. When Sol entered this vulnerable trance, an ancient predator descended. The desperate acts that followed — a binding ritual soaked in sacrifice, a whispered bargain, a seal shattered by children — are the foundation of everything.',
          sections: [
            {
              title: 'The Deepening & The Binding',
              content: `Before there were noble houses, before there was a frozen world, there was a law older than any deity. It is called the **Deepening**: the ancient death-rebirth cycle by which every celestial body sheds its exhausted light and rekindles from within. Every star that has ever burned has entered the Deepening. Every star has emerged.

But the Deepening carries a fatal flaw: it attracts predators. The dimming light broadcasts across the void: *here is something vulnerable.*

When the sun-god **Sol** entered its own Deepening, the **[Augurs](world-lore/classes)** of the seven noble houses were the first to read the signs in the cooling light. Their rune-scarred forearms burned with visions traded from personal memory. The **[Oracles](world-lore/classes)** of Sol's celestial court — constellation-spirits who would later flee into willing vessels among the **[Astril](world-lore/races-overview)** — screamed warnings. The **[Doomsayers](world-lore/classes)** recorded the approaching darkness.

An abyssal entity called **Keth-Amar** — the Sun-Eater, the First Hunger — was already here.

To protect Sol, the seven families pooled their bloodlines to entomb the dying star beneath **[Sundale](world-lore/regions)**. **[Inscriptors](world-lore/classes)** encoded the binding terms into burn-scar and memory-glass. **[Titans](world-lore/classes)** of the **[Emberth](world-lore/races-overview)** Korr stood sentinel. **[Wardens](world-lore/classes)** guarded the approaches.

What the histories burned from every account is the seal's substance. Ritual alone cannot bind a star. The families needed a vessel woven from living radiance: a hide that remembered the warmth of the sun. The oldest name for such a vessel is **Aex** — the firstborn of Sol, a living entity of pure solar fire. The fragments that survived the purge record a hunt. Aex did not volunteer. Aex was taken — the first being to eat fire so others would not burn. The **[Spellguards](world-lore/classes)** of later ages trace their origin to this moment.

The result: a one-way seal, a vault with no key. The binding exhausted the families — and the world began to freeze.`
            },
            {
              title: 'Keth-Amar & The Breach',
              content: `Without Sol's light, the surface world began to die. Frost crept south. Crops failed. Children froze. Every people dug into the earth for residual warmth.

Keth-Amar, denied its prey, turned to the starving. It whispered to the desperate nobles — not in words but impressions: *warmth, vents cracking frozen earth.* The price: **firstborn heirs.**

Pressed to extinction — **[Doomsayers](world-lore/classes)** recording deaths that were no longer prophecy but arithmetic — six families capitulated. The first **[Martyr](world-lore/classes)** was a Solvarn mother named **Sera Solvan**, who carved her sacrificed child's name into her forearm. The scar still glows in the presence of Sundered Monoliths.

They marched their heirs north. Keth-Amar consumed them as **vessels** — the children's bloodlines were the keys to the seal. The seal shattered into **7 Sundered Monoliths.** **[Emberspire](world-lore/regions)** erupted. The **Wyrd** bled through the cracks. The first **[Exorcists](world-lore/classes)** were active within months. **[Huntresses](world-lore/classes)** began tracking Wyrd-sign. **[Deathcallers](world-lore/classes)** discovered the Wyrd's victims were not silent. **[Covenbanes](world-lore/classes)** were written in that first bleeding of spiritual rot.`
            },
            {
              title: 'The Slow Feast',
              content: `Keth-Amar is now inside the binding — inside the vault it was never meant to enter. It feeds on Sol's embers, growing stronger as the world grows colder. Sol cannot wake. Sol cannot die. Sol is being eaten — the slowest meal in cosmic history.

The **7 Sundered Monoliths** are the only way to close the breach. **[Huntresses](world-lore/classes)** track Shard-sign through every biome. **[Oracles](world-lore/classes)** receive warnings when a Shard wakes. **[Doomsayers](world-lore/classes)** record each awakening. (Full locations in [The Age of the Dimming](world-lore/world-state).)

But closing a wound is not the same as healing it.

**The Refusal:** There was an **eighth house** — House Viridane. They refused, fled south through the **[Frostwood Reach](world-lore/regions)**, and made a counter-bargain with fae entities. The **[Briaran](world-lore/races-overview)** carry that refusal — their **[Lunarchs](world-lore/classes)** are living memory of the burned contract, their **[Bladedancers](world-lore/classes)** are its sharp edge, their **[Martyrs](world-lore/classes)** carry the ancestral debt in thorn and flesh.`
            }
          ]
        }
      },
      {
        id: 'world-state',
        name: 'The Age of the Dimming',
        icon: 'fas fa-map',
        theme: 'narrative',
        summary: [
          'The Solbrand is dimming. The Sundered Monoliths are waking. Civil war brews in Sundale. The frost lords stir beneath Nordhalla\'s glaciers.',
          'Every region faces its own crisis — but no crisis stays contained. The powder keg is global.',
          'The definitive campaign follows seven Shards across seven continents.'
        ],
        content: {
          title: 'The Age of the Dimming',
          description: 'Eight centuries without a sun. Seven continents shaped by desperate bargains. One dying ember tended by a forge-clan concealing its decline. The Sundered Monoliths are waking. The frost lords stir. Civil war brews in Sundale. This is the world your adventurers inherit — a powder keg lit by the slowest fire in cosmic history.',
          sections: [
            {
              title: 'The World Today',
              content: `Close your eyes. Imagine a world where the sun has not risen in eight hundred years. Not hidden behind clouds — **gone**. Entombed beneath volcanic crust by a desperate ritual, fed upon by a cosmic predator that grows stronger with every passing decade. The only warmth comes from below: volcanic vents, geothermal springs, the grudging heat of a dying planet. Cities cluster around these vents like children around a dying hearth. Caravans cross snow-choked passes on bridges grown from the calcified dead.

This is the world your adventurers were born into. Not a post-apocalypse — an **ongoing apocalypse**, eight centuries deep and still accelerating.`
            },
            {
              title: 'The Dimming of the Solbrand',
              content: `In the volcanic heart of **[Sundale](world-lore/regions)**, beneath the Harath-Vault, the **[Emberth](world-lore/races-overview)** have tended the **Solbrand** — believed to be Sol's last conscious fragment — for eight centuries. **[Titans](world-lore/classes)** of the Korr stand six-hour sentinel shifts. **[Oracles](world-lore/classes)** listen for a voice that has not spoken since the binding.

The Solbrand is dimming. The tending-clan has known for three generations and concealed it. Three factions have emerged: the **Risen** (old faith), the **Sunderer** (heretics who believe the Solbrand is Keth-Amar's feeding-line), and the **Unwoven** (who deface their forge-marks and scour the world for Shards). Civil war brews.

The **[Solvarn](world-lore/races-overview)** humans share the ashlands. Every morning a sun-priest climbs the highest tower: *not today. Perhaps tomorrow.* Their **[Doomsayers](world-lore/classes)** record the Dimming's progression. Their **[Martyrs](world-lore/classes)** stay, wounds glowing faintly near the dying ember.`
            },
            {
              title: 'The Stirring of the Shards',
              content: `The seven **Sundered Monoliths** have been dormant for centuries. No longer. The **[Myrathil](world-lore/races-overview)** Deep-Born Listeners feel the Iceheart Shard thrumming. The **[Astril](world-lore/races-overview)** spirits convulse. The **[Groven](world-lore/races-overview)** report the Shard beneath Frostmaw Crag has begun to sing — vibrations cracking older Ancestor-Spans. **[Huntresses](world-lore/classes)** track Shard-sign through every biome. **[Exorcists](world-lore/classes)** contain the Wyrd-creatures drawn to Shard-resonance. **[Oracles](world-lore/classes)** receive fragments of warning.`
            },
            {
              title: 'The Regional Powder Kegs',
              content: `Each region faces its own crisis — and each threatens to spill.

**In [Sundale](world-lore/regions)** — Civil war brews between forge-clans. **[Pyrofiends](world-lore/classes)** burn with a fire the Emberth revere but cannot trust.

**In [Nordhalla](world-lore/regions)** — Frost lords stir. Rune Keeper **[Augurs](world-lore/classes)** record irregular vibrations in the Archive. Skreika besiege the **[Skald](world-lore/races-overview)** fjord-keeps in numbers not seen in centuries.

**In the [Cragjaw Peaks](world-lore/regions)** — Ancestor-Spans crack. **[Fexrick](world-lore/races-overview)** machines fail. **[Chronarchs](world-lore/classes)** extend lifespans while **[Formbenders](world-lore/classes)** search for the Lost Brood.

**In the [Bryngloom](world-lore/regions)** — The **[Neth](world-lore/races-overview)** have filed seventeen petitions. The Keeper has not ruled. Over-Lit epidemic worsens. **[Covenbanes](world-lore/classes)** stretched to their limits.

**On the [Iceheart Sea](world-lore/regions)** — Spawning gales shift north. The First Shore grows quiet. The Rift Shard thrums.

**In the [Sundrift Vale](world-lore/regions)** — Ancestor-mounds hum louder. The Astril assassination economy intensifies.

**In the [Frostwood Reach](world-lore/regions)** — Fog thickens. **[Mimir](world-lore/races-overview)** mother-flame flickers. Noble houses fund fresh expeditions. The **[Briaran](world-lore/races-overview)** run out of places to hide.`
            },
            {
              title: 'The Seven Sundered Monoliths',
              content: `When Keth-Amar consumed the six sacrificed heirs, the seal shattered into seven fragments.

**What the Shards Are:** Fragments of the original binding ritual, each tied to one noble house's sacrifice. Magical anchors corrupting ambient energy. Living whispers — as Keth-Amar feeds, they grow louder.

**Where They Rest:**
• **[Frostwood Reach](world-lore/regions)** — Greymark lineage-tapestry archive.
• **[Nordhalla](world-lore/regions)** — Sealed hall of the Frozen Archive.
• **[Sundale](world-lore/regions)** — Emberspire's caldera.
• **[Iceheart Sea](world-lore/regions)** — Treakous Oceanic Rift.
• **[Cragjaw Peaks](world-lore/regions)** — Subterranean Vault beneath Frostmaw Crag.
• **[Sundrift Vale](world-lore/regions)** — Ancient Burial Mound.
• **[Bryngloom Forest](world-lore/regions)** — Bottom of a Murky Pool with no bottom. The Neth have filed seventeen petitions. The Keeper has not ruled.

**Campaign Framework:** Finding and sealing these seven Shards — one per region — carries players from Frostwood Reach to the final confrontation at Emberspire. No Shard yields without cost.`
            }
          ]
        }
      },
      {
        id: 'the-wyrd',
        name: 'The Wyrd & Its Creatures',
        icon: 'fas fa-ghost',
        theme: 'danger',
        summary: [
          'The Wyrd is a formless spiritual rot that bled through the cracks when Emberspire erupted. It cannot create — only occupy the collective imagination.',
          'It uses human fear and folklore as structural blueprints. Every creature in the Bestiary was born when the Wyrd found an empty shape in a culture\'s terrors.',
          'Each continent produces unique monsters. To understand a creature is to understand the fear that birthed it. That fear is always the leverage point.'
        ],
        content: {
          title: 'The Wyrd — The Folkloric Infestation',
          description: 'When Emberspire erupted, it unsealed the Wyrd: a formless spiritual rot sealed since before human memory. It cannot create — only occupy. Every ghost story whispered around a hearth becomes a blueprint it can crawl inside. This is why the Gref of Frostwood wears stolen faces while the Cinder of Sundale burns truth into liars. Full stats in the Bestiary.',
          sections: [
            {
              title: 'Mechanics of Manifestation',
              content: `The Wyrd is a formless, ancient spiritual energy that cannot manifest on its own. It must occupy something — and what it occupies is the collective imagination. When a settlement whispers cautionary tales around a hearth, they draw an accidental blueprint. The Wyrd slips inside, turning folklore into living horrors.

**Why Each Continent Has Unique Monsters:**
• **[Frostwood Reach](world-lore/regions)** (Germanic/Celtic) — face-stealing Gref, oath-hunting Gambrels. Exorcists cross-reference journals; Bladedancers navigate the Revel's circle.
• **[Nordhalla](world-lore/regions)** (Norse/Alpine) — glacier-memory Stels, hearth-parasite Rimors. Berserkers wade into fjord-surf; Augurs extract prophecies from frozen victims.
• **[Sundale](world-lore/regions)** (Mesopotamian/Egyptian) — the burning Cinder, the Husque. Pyrofiends alone approach a Husque without immediate consumption.
• **[Iceheart Sea](world-lore/regions)** (Greek/Yoruba) — the Spume of the Drowned, the Writ of Passage. Deathcallers separate voices; Arcanoneers study the Writ.
• **[Cragjaw Peaks](world-lore/regions)** (Yokai/Andean) — metal-eating Scrabs, the mountain's consciousness. Formbenders develop deterrents; Fate Weavers read the Thrum's approach.
• **[Sundrift Vale](world-lore/regions)** (Mongol/Chinese) — debt-tracking Lien, the Hungry Child. Martyrs assume debts into flesh; Oracles tell stories of a sky the Child has never seen.
• **[Bryngloom Forest](world-lore/regions)** (Slavic/Hindu) — the Grandmother of the Bog, the Cycle-Eater. Witch Doctors treat memory-wounds; Covenbanes track Debt-Revenants.

**Key Principles:**
• The Wyrd cannot invent — only occupy. Every creature was born when the Wyrd found an empty shape in a culture's imagination.
• To permanently destroy a Wyrd-creature, address the fear that birthed it. The blueprint persists.
• Full combat stats and quest hooks: [Bestiary](world-lore/bestiary).`
            }
          ]
        }
      },
      {
        id: 'regions',
        name: 'The Continents',
        icon: 'fas fa-mountain',
        theme: 'narrative',
        summary: [
          'Each region blends two distinct real-world folklore traditions to produce unique Wyrd-creatures.',
          'The Frostwood Reach serves as the official starting zone for adventurers.',
          'Seven major regions detailed with their dark bargains, native races, folklore anchors, and Wyrd-creatures.'
        ],
        content: {
          title: 'The Seven Continents',
          description: 'Seven continents. Seven dark bargains. Seven Sundered Monoliths. Each land shaped by the desperate trade its noble house made with Keth-Amar, and each haunted by creatures born from the specific fears of its people. The Frostwood Reach devours memory. Nordhalla surrendered summer forever. Sundale chokes on the ash of a dying god.',
          sections: [
            {
              title: 'Frostwood Reach (Starting Zone)',
              content: `The air tastes of wet iron and old pine — a forest dying for eight centuries that refuses to finish. The fog is not weather. It is the permanent condition.

> *"The fog keeps the timber from shattering. It also eats what you remember — slowly, starting with the faces of the dead."*

**The Dark Bargain:** House Thalreth traded spatial clarity for protective fog. Price: memory decays.

**The Land & Its People:** The **[Thalren](world-lore/races-overview)** dominate from Greymark, a library of forty thousand names. The **[Mimir](world-lore/races-overview)** — mask-bound faceshifters — hide in canopy-holds; the art of mask-forging was lost ninety years ago. The **[Briaran](world-lore/races-overview)** — thorn-born descendants of House Viridane — live in moonlit groves. **[Exorcists](world-lore/classes)** cross-reference journals against Wyrd-manifestations. **[Huntresses](world-lore/classes)** read the fog. **[Bladedancers](world-lore/classes)** patrol with speed born of necessity. **[Lunarchs](world-lore/classes)** draw power from lunar cycles. **[Witch Doctors](world-lore/classes)** practice spore-based medicine.

**What Hunts Here:**
• The **Gref** — A face-trader. Huntresses track Gref-sign; Exorcists identify which face in the village no longer belongs.
• The **Gambrel** — Born from broken oaths. Lunarchs, whose thorns prickle at oathbreakers, sense them first.
• The **Revel** — A fae court whose celebration began before the sun died. Bladedancers navigate its circle.

**The Shard:** Sealed within the Greymark lineage-tapestry archive.`
            },
            {
              title: 'Nordhalla & The Valley of Ymir',
              content: `A brutal tundra sliced by black fjords. Beneath glacier walls, the flash-frozen dead of an unknown civilization stand in silent streets — the Frozen Archive, machines humming for ten thousand years.

> *"The south owes us blood-debts from the War of Thousand Screams that they have never paid."*

**The Dark Bargain:** House Skalvyr halted the glaciers. Price: summer never returned.

**The Land & Its People:** The **[Skald](world-lore/races-overview)** rule fjord-keeps, encasing dead in glacier-tombs. The **[Hrym](world-lore/races-overview)** — frost-born of the Hunger Pact — do not ask "Who is your mother?" (the Milk-Grief kills nearly half). Bloodhammer **[Berserkers](world-lore/classes)** channel ancestral fury. **[Dreadnaughts](world-lore/classes)** seal themselves in Archive-forged iron. Rune Keeper **[Augurs](world-lore/classes)** trade memories for prophecy. **[Spellguards](world-lore/classes)** absorb enemy magic into flesh. Frostbound **[Oracles](world-lore/classes)** listen to the ice.

**What Hunts Here:**
• The **Skreika** — Drowned warriors. Berserkers meet them in the surf.
• The **Rimor** — A hearth-parasite. Augurs detect it by frost-pattern absence.
• The **Stel** — A glacier's memory. Augurs extract prophecies from frozen victims.

**The Shard:** Deep within a sealed hall of the Frozen Archive. Rune Keepers hear it humming.`
            },
            {
              title: 'Sundale & Emberspire',
              content: `A volcanic desert of ashfall, obsidian rivers, and smoldering badlands surrounding the world-heart volcano — the tomb and cradle of Sol itself.\n\n**Folklore Blend:** Mesopotamian/Zoroastrian + Egyptian. Fire as dual-god — creator and consumer. The volcano is a dying pharaoh entombed in ash. Lava-djinn write prophecy in cooling stone. Death is passage through flame, and scribes of the underworld weigh hearts against obsidian.\n\n**The Dark Bargain:** Sol slumbers beneath Sundale's crust — not dead, not dying, but entombed within the Deepening trance by the seven noble families' binding ritual. Emberspire is the wound through which Keth-Amar breached the seal, using the sacrificed heirs of six noble houses as vessels to crack the vault from within. The predator now feeds on Sol's embers from inside the binding, growing stronger with each passing year as the world grows colder. The region's noble family — whose heirs were among those consumed — watches their ancestral lands slowly die beneath ashfall.\n\n**Culture & What They Cherish:** The Emberth were Sol's chosen — a sun-revering people whose Sun-Speakers received cryptic prophecy from the dying god centuries before the binding. Forewarned by visions of darkness and descent, they excavated vast tunnel networks beneath Sundale and were already underground when the surface froze. They emerged generations later, following Emberspire's eruption, to reclaim their ancestral ashlands. They cherish **the Solbrand** — the last eternal ember, believed to be Sol's final conscious fragment — and **thermal rights**, the legal ownership of a geothermal vent or lava-flow that forms the basis of all Sundale law. Warmth is property. Cold is poverty.\n\n**The Crafts:**\n• *Obsidian-Forging*: Volcanic glass shaped into blades sharper than steel but brittle, requiring constant ritual replacement — a blade is worn for a season and then shattered at the solstice fire.\n• *Ash-Glass*: Sand and ash fused at volcanic vents into pale grey panes used for greenhouses and thermal-capture architecture.\n\n**Native Races:** The sun-revering **Emberth**, the subterranean gear-engineers **Fexric** who maintain the deep thermal pipelines, and the undying merchant-lords **Neth** who operate trade-posts at the volcanic frontier.\n\n**Shard Location:** The Volcanic Caldera — one of the seven Sundered Monoliths is embedded in the throat of Emberspire itself, visible only during the annual vent-calm when the smoke clears for a single hour. The Emberth regard it with a mixture of reverence and terror: it is both Sol's cage and Keth-Amar's tooth.\n\n**Wyrd-Creatures:**\n• *The Ash-Scribe*: A figure of compacted ash and cooling obsidian that walks the badlands after eruptions, carving tally marks into stone. Each mark is a death — past, present, or impending. Following the Ash-Scribe leads to the dying. Stopping it requires offering a memory written in your own blood on obsidian.\n• *The Ember-Judge*: Appears at the mouth of lava-tubes on nights when the vents glow red. It wears the face of someone you wronged and asks one question: what do you owe? Those who answer truthfully are permitted to leave. Those who lie are found the next morning, turned to obsidian statues at the lava-tube's mouth, their face frozen in the act of speaking.`
            },
            {
              title: 'The Iceheart Sea',
              content: `Churning, freezing waves and heavy icy foam where true sailors test their mettle against the elements.\n\n**Folklore Blend:** Greek/Aegean + West African/Yoruba. Shipwreck-epic meets crossroads-spirit. Sea-foam births borrowed faces. The sirens are trickster-gods who offer passage at a price you don't understand until you've paid it. Ocean rifts are thresholds between worlds, and drum-language carries across the waves when the wind fails.\n\n**The Dark Bargain:** The noble family traded calm seas for navigable routes — certain currents always flow, certain channels between the ice sheets never freeze. The price: the sea never sleeps. Storms outnumber still days ten to one. Every voyage is a wager, and the Iceheart collects its toll in ships and sailors.\n\n**Culture & What They Cherish:** The human pirates who work these waters cherish **luck, boldness, and a good death**. They tattoo their contracts onto their skin — every deal, every debt, every oath — because paper rots at sea. The Myrathill, born of the churning foam, cherish **the song of the deep** — a frequency only they can hear, which guides them to the ocean rifts where their kind are born.\n\n**The Crafts:**\n• *Foam-Glass*: Hollow glass spheres blown from volcanic sand and sealed with whale-fat, used as flotation aids and message-buoys.\n• *Leviathan-Bone Shipcraft*: The ribs and spine of the ice-leviathans are carved into hull-reinforcements — ships with bone-keels are said to remember the way home.\n\n**Native Races:** The ethereal foam-born **Myrathill**, human pirate fleets of House Mereval (the Merryn — storm-chasers and luck-worshippers whose tattooed bodies are legal documents), and the **Neth** trade-network centered on **Ironjaw Port** — a living ironwood dock-complex coaxed from the frozen cliff-face over three centuries, the only structure that can withstand the Iceheart's perpetual storm-cycle.\n\n**Shard Location:** Treakous Oceanic Rift — a fissure in the seafloor that glows with pale blue light, visible from the surface only during the deepest winter when the ice thins.\n\n**Wyrd-Creatures:**\n• *The Eshu-of-the-Waves*: A trickster-spirit that appears on the bow of a ship during storms, offering the captain a deal — safe passage for something the captain does not yet know they possess. The price is always personal. The Eshu collects years later, walking into a portside tavern and asking for the captain's name — literally. Those who give it forget who they were.\n• *The Foam-Born Siren*: Not a singer but a mimic. It rises from the churning foam wearing the face of someone the sailor loved, calling in their voice. Those who dive in after it are found days later, floating, their skin pale as sea-foam, their eyes open and filled with salt. The Myrathill claim these are failed births — Wyrd-corrupted foam that tried to become Myrathill and became this instead.`
            },
            {
              title: 'Cragjaw Peaks',
              content: `Razor mountain ridges and deep mining shafts carved into living stone, cloaked in perpetual snow.\n\n**Folklore Blend:** Japanese Yōkai + Andean/Incan. Sacred thresholds and hungry peaks. Bridges are tsukumogami waiting to wake — the tools and cables abandoned for a century become hostile, grieving things. The yuki-onna breathes death in the high passes. The Apu demands blood for passage. The mountain is a living god, and every crossing is a negotiation. The Wyrd learned that peaks remember debt.\n\n**The Dark Bargain:** The local noble family bargained for the eternal snow to hide them — when the world froze and starving hordes swept across the lowlands seeking shelter, the Warden made the Cragjaw Peaks a permanent whiteout. Blizzards cloak the mountains, bury the passes, swallow sound and sight and direction. The keeps survived because nothing could find them. The price: every landmark was buried under centuries of drift. The only visible route through the crags is the web of Ancestor-Spans — living bridges grown from the calcified dead of the Groven.\n\n**Culture & What They Cherish:** The Groven control the passes and charge tolls for bridge-crossing — not out of greed, but because without the spans, crossing the Peaks is death by exposure. They cherish **bridge-craft, woven fiberwork, and the Still-Claimed dead** whose bodies became the spans they walk upon. The Fexric, dwelling in the deep tunnels, cherish **geothermal rights, gear-work, and mineral extraction** — a constant source of friction with the Groven, whose bridges they mine for rare crystallized bone.\n\n**The Crafts:**\n• *Span-Weaving*: Bridge-cables woven from stone-lichen fiber and cliff-ram wool, treated with ram-tallow against the frost, stronger than iron and older than any living Groven.\n• *Obsidian Scale-Mail*: Volcanic glass plates drilled and corded into armor that sheds blows by shattering one scale at a time.\n\n**Native Races:** The Groven — humanoid troll-kin bridge-keepers of the spans, the Fexric — goblinoid deep-engineers who first created the Groven and now share the peaks in cold tension, the Thrumm — the Groven's parent race, hulking bestial stone-trolls dwelling in the deepest crags, and the Ferrick — small quicksilver-blooded scrap-folk born from the Fexric's alchemical runoff, who scattered from the sumps into every corner of the known world.\n\n**Shard Location:** Subterranean Vault — a chamber deep beneath Frostmaw Crag where the snow does not fall and the original contract between the noble family and the Warden is written on walls that have never seen frost.\n\n**Wyrd-Creatures:**\n• *The Yuki-onna of the Pass*: A tall woman of living snow who drifts through the high passes during the worst blizzards. She does not attack — she stands at the edge of the bridge and breathes. Her breath freezes rope, cracks stone, and stills the heart. Those who survive say she asked them a question. None can remember what.\n• *The Tsukumogami Span*: A bridge-cable abandoned for more than a century, animated by the Wyrd into a hostile, grieving thing. It slithers like a snake and coils around ankles. A dropped chisel carves warning-runes into stone by itself. The Groven call them *the Unremembered* — things their ancestors made that the living forgot to honor.\n• *The Apu-Hungry*: A peak that demands blood — not coin, but living essence. Certain passes grow slick with frost no matter how often they're tended. The Wyrd has convinced the mountain that sacrifices are still owed, and anyone who crosses without bleeding on the stone receives a curse: their next bridge-crossing will fail.`
            },
            {
              title: 'Sundrift Vale',
              content: `Wind-swept steppe and dead tundra grass stretching endlessly beneath the starless sky.\n\n**Folklore Blend:** Mongol/Turkic + Chinese. The eternal horizon meets celestial bureaucracy. Wind-hungry ghosts ride with the herds. Ancestor mounds are audit-halls where the dead reconcile debts across generations. The starless sky is a ledger with pages torn out. Throat-singing wakes things that should sleep.\n\n**The Dark Bargain:** The noble family traded fertile soil for the endless migration — the herds never stop, the grass always returns, no matter how many mouths feed upon it. The price: the sky went dark. No stars. No constellations. No navigable heavens. The ancestors who navigated by stars that are no longer there are now navigating by memory alone, and memory is the first thing the steppe takes.\n\n**Culture & What They Cherish:** The nomadic human clans cherish **the migration route, the herd, and the ancestor-song** — throat-sung histories that map the steppe by sound rather than sight. The Astril, who carry the surviving constellation-spirits in their very blood, cherish **the spirits themselves** — the last living fragments of Sol's celestial court, preserved in mortal flesh.\n\n**The Crafts:**\n• *Wind-Leather*: Horsehide cured in the constant steppe wind until it becomes as hard as wood but light as cloth, used for armor, tents, and ancestor-scrolls.\n• *Spirit-Binding*: The Astril practice ritual scarification and throat-singing to soothe, bind, or commune with the constellation-spirits they carry — their bodies are living star-charts, their voices the language the spirits remember from before the sky was erased.\n\n**Native Races:** The nomadic human clans of House Ordavan (the Ordan — herders and throat-singers who follow the endless migration) and the spirit-inhabited **Astril** — farmers and herders who volunteered to carry the last fragments of Sol's celestial court in their blood.\n\n**Shard Location:** Ancient Burial Mound — the Sundered Monolith is interred with the first khan, whose name has been deliberately forgotten to keep the shard hidden.\n\n**Wyrd-Creatures:**\n• *The Wind-Hungry*: Ghosts of warriors who died without an heir to sing their name. They ride the steppe winds as screaming, semi-visible shapes, latching onto travelers who carry unresolved debts. They do not kill — they *follow*. The only way to banish one is to complete the dead warrior's unfinished business, which the ghost communicates through nightmares that grow more detailed each night.\n• *The Ledger-Keeper*: A figure of compacted dust and horsehair that sits at crossroads in the steppe, writing in a book of pressed grass. It records every debt, every broken oath, every unpaid toll across generations. If your ancestor owed something, the Ledger-Keeper knows — and it charges interest.\n• *The Empty Sky-Thing*: On certain windless nights, something vast and dark eclipses the already-empty sky. No one has seen its shape. Those caught beneath it report a crushing sense of being *accounted for* — as if something above was tallying their life and finding it insufficient. The Astren have theories. None of them are comforting.`
            },
            {
              title: 'The Bryngloom Forest',
              content: `Sinking, semi-frozen bogs and swamps — but also ancient bioluminescent woods, sacred fungal-lit groves, and cathedral-canopies of living ironwood — where the silver-skinned Neth and the lantern-eyed Vreken share the continent in cold, functional silence.\n\n**Folklore Blend:** Slavic/Carpathian + Hindu/Vedic. Corpse-debt meets cosmic cycle. Grandmother-witches trade in reincarnation — not rebirth, but re-use. The Neth conduct cold business with souls that have died eight times and are owed a ninth. The Vreken's lantern-eyes gave rise to the strigoi myth — the Romanian folkloric belief that glowing eyes in the dark are the risen dead returning to drain the living — a superstition that still follows them into regions that have never seen a Vreken but have heard the stories.\n\n**The Dark Bargain:** The Neth's ancestors — a dying clan of scribes, archivists, and merchant-brokers — made their own bargain separate from the noble families. They walked into the boundary where the ancient woods meet the preserving bog and presented a legal argument to the **Keeper of the Last Threshold** (the same entity the Vreken call the Root-Veil): *preserve us, and we will be your living archive — every contract we write carries your authority, every debt we record is a name you helped remember.* The Keeper accepted. The price: the pact must be honored in perpetuity through the physical **First Contract** preserved in Atropolis's heartwood. The Neth cannot stray far from copies of this document without beginning the **Fading** — a slow unraveling of mind and body that ends in a silver-skinned husk. Death became a renegotiated clause, not an ending. Every Neth remembers every near-death return. Every broken contract is enforced by the Keeper itself.\n\n**Culture & What They Cherish:** The Neth cherish **contracts, precedent, and the silence between terms**. They operate from their living canopy-city of **Atropolis** — a cathedral-grove of ancient ironwood coaxed into shape over a thousand years — and the frozen dock-outpost of **Ironjaw Port** on the Iceheart Sea. Their society is divided into three bloodlines: the **Velun** (arcanists and pact-mages, cannot lie), the **Kessen** (probability-weavers who read the obligation-web connecting every living thing), and the **Drun** (severed from the pact through a traumatic fire-ritual, magic-resistant but legally non-existent under Neth law). They view survival as a binding agreement — and they have been in contract for eight centuries.\n\n**The Crafts:**\n• *Memory-Glass* (Neth): Thin, translucent sheets of crystallized tree-sap that store information in refracted light patterns, releasing full sensory experience — the scribe\'s voice, the smell of the chamber, the temperature of that day — directly into the reader\'s mind. The oldest tablets in the Canopy-Ledger are two thousand years old and still legible.\n• *Ghost-Silk* (Neth): Pale, iridescent fiber harvested from domesticated silk-moths that feed on bioluminescent lichen. Woven into impossibly fine garments that float around the body like mist given form. The Velun wear layered robes inscribed with contract-clauses along the hems. The Kessen wear close-fitting garments marked with probability-glyphs only they can read.
• *Fungal-Weave* (Vreken): Luminescent fungal filaments woven into fabric — dark monastic cassocks with thread-embroidery marking bloodline and vocation, rust-amber for the Clean, silver-white for the Marked. The cloth glows faintly in darkness, just enough to find each other.
• *Crypt-Engraving* (Vreken): Records etched into compressed fungal-wood tablets using Ghost-Mycelium residue. The carved grooves retain a faint bioluminescence for centuries — the oldest tablets in the Hollow-Scriptorium are still legible after two thousand years.\n\n**Native Races:** The lantern-eyed **Vreken** — an ancient crepuscular people who cultivated phosphorescent fungi in the Bryngloom's deep bog-caves millennia before the sun died, organized around sunken gothic cathedrals lit by the perpetual glow of their entombed ancestors — the silver-skinned **Neth** (preserved by their pact with the Keeper of the Last Threshold, organized into three bloodlines: Velun arcanists, Kessen fate-weavers, and Drun covenant-severed), and frail human swamp-dwellers of House Morrath (the Morren — debtors who trade labor and memory to the Neth for protection) who trade their labor and their memories for Neth protection.\n\n**Shard Location:** Bottom of a Murky Pool — the Sundered Monolith rests in a bog-pool that has no bottom. Divers who descend come back up with water in their lungs and someone else's memories behind their eyes.\n\n**Wyrd-Creatures:**\n• *The Grandmother of the Bog*: An ancient, stooped figure of preserved moss and frozen peat who appears at the edge of dying settlements. She offers a trade — one life extended for one memory surrendered. The memory is never trivial. She deals in first loves, last words, the face of a child. The Wyrd has made her into a recurring thing — those who trade with her see her again at their death, collecting the rest.\n• *The Debt-Revenant*: When a Neth contract is broken by death, the debtor does not rest. They rise from the bog, preserved and aware, compelled to complete the terms of their agreement. They can speak, reason, and remember everything — but they cannot refuse the contract. Once the debt is fulfilled, they sink back into the bog. The Neth consider this a legitimate form of posthumous enforcement.\n• *The Cycle-Eater*: A creature that should not exist — a thing that hunts reincarnating souls. When it devours someone, that person does not return. Their thread in the cosmic cycle is severed. The Neth fear it above all things because the Neth have died many times and plan to die many more. A Cycle-Eater is the one thing their contracts cannot protect against.`
            }
          ]
        }
      },
      {
        id: 'races-overview',
        name: 'The Peoples',
        icon: 'fas fa-users',
        theme: 'social',
        summary: [
          'Humans comprise the largest overall population, split into distinct regional subraces.',
          'Eleven original fantasy races exist as highly specialized cultures interacting with the human majority.',
          'Each race carries a unique biological curse or adaptation born from the world\'s trauma.'
        ],
        content: {
          title: 'The Peoples of Mythrill',
          description: 'Humans comprise the largest overall population across the world, split into distinct regional subraces occupying feudal settlements, castles, and outposts. The original fantasy races exist as highly specialized cultures interacting with this human majority.',
          sections: [
            {
              title: 'The Mimir',
              content: `A secretive, rare race of faceshifters who live natively within the Frostwood Reach and its northern mountains. Because humans are terrified of losing their identities to the fog, the Mimir's shape-shifting abilities breed intense paranoia. To survive in human towns, they practice the **Rite of Masks** — wearing a single, beautifully carved wooden persona mask that they never remove in public.`
            },
            {
              title: 'The Emberth',
              content: `A bulky, powerful race of sun-reverent forge-clans who are the original children of Sundale. Long before the binding, their Sun-Speakers received cryptic prophecy from Sol — fragments of heat and image that foretold the coming darkness. Forewarned, they excavated vast thermal tunnel networks beneath the continent and were already underground when the surface froze. They spent centuries in the deep, tending the **Solbrand** — a small eternal ember believed to be Sol's final conscious fragment. Since Emberspire erupted, they have reclaimed the ashland surface, organized into forge-clans bound to volcanic calderas. Their culture is built around the vigil: waiting for Sol to speak again. The silence has lasted centuries.`
            },
            {
              title: 'The Fexrick',
              content: `The oldest continuous civilization on Mythrill — compact, gnomish subterranean engineers who carved their first holdfast into the Cragjaw Peaks eight millennia ago, before the Thrumm, before the noble families, before the sun's death. Their skin is pale, tinted green from alchemical exposure or darkened from mine-work; their eyes are droopy but eager, the perpetual look of a people who have been working too long and cannot stop because something still needs fixing. Every Fexric carries one subtle mechanical body replacement — a brass finger, a copper ear, a lens-eye — earned by mastering a craft, and every replacement is a lightning rod waiting for a storm. Divided between the Guild-Bound **Kethrin** (hereditary guild members who hoard ancient oral maintenance songs) and the Clan-Free **Drall** (self-taught outsiders who survive on salvage and improvisation), their society is built on three pillars: practical tinkering, mineral alchemy, and the goblin-gnome cunning that keeps their trap-laden holdfasts hidden from a surface world that barely knows they exist. They created the Groven (intentionally, and lost control) and the Fexrick (accidentally, and refuse to admit it). They are brilliant, ancient, paranoid, and slowly forgetting more than any other race has ever known.`
            },
            {
              title: 'The Neth',
              content: `A tall, beautiful, silver-skinned people — the Bryngloom Forest's immortal archivists. Their ancestors were a dying clan of scribes who walked into the deep wood and presented the **Keeper of the Last Threshold** (the same entity the Vreken call the Root-Veil and revere as sacred) with a legal argument for their own survival. The Keeper accepted. The Neth rose from the bog with stilled breath, mother-of-pearl skin, and a pact written in the blood of every descendant — death would be a clause to renegotiate, not an ending. In exchange, every Neth contract carries the Keeper's cosmic authority, and every broken contract is enforced by the same entity that preserves them.

They are organized into three bloodlines: the **Velun** (who inherited the Keeper's authority — arcanists and pact-mages who cannot lie, whose every spoken word is binding on themselves), the **Kessen** (who inherited the Keeper's sight — weavers and gamblers who perceive the obligation-web connecting every living thing and manipulate probability by tugging its threads, though every tug snaps something elsewhere), and the **Drun** (who inherited the Keeper's silence — Neth who burned their names from the First Contract through a traumatic Severing ritual, becoming magic-resistant, debt-null, and legally non-existent under Neth law).

Operating from their living canopy-city of **Atropolis** — a cathedral-grove of ancient ironwood coaxed into shape over a thousand years — and the frozen dock-outpost of **Ironjaw Port** on the Iceheart Sea, the Neth control the major trade routes and preservation techniques needed by every warm-blooded survivor. Their memory-glass records, grown from crystallized tree-sap, form the oldest continuous archive in the known world. They share the Bryngloom with the Vreken in coldly functional coexistence: the Vreken worship the Keeper; the Neth negotiated with it. Neither defers to the other. Neither particularly wants to.`
            },
            {
              title: 'The Groven',
              content: `Humanoid troll-kin bridge-keepers of the Cragjaw Peaks. Originally Thrumm broodlings captured and injected with alchemical serums by the Fexric Deep Alchemists, the Smoothing Plague refined their stone-hide into fine scales, lengthened their limbs for reaching across chasms, and awakened higher cognition. The first Groven — the Vat-Breakers — shattered their vats, freed their kin, and fled into the upper crags where they built their bridge-civilization. Divided between the heavy-scaled **Morgh** warriors of the mid-crag warrens and the long-limbed **Ithran** diplomats of the bridge-top settlements, Groven society is governed by the unspoken Ladder of Purity — a hierarchy born from the Fexric's design that no Groven will openly acknowledge. Their Ancestor-Spans, grown from their calcified dead, are the only visible landmarks in the perpetual blizzard of the peaks.`
            },
            {
              title: 'The Thrumm',
              content: `The ancient parent race of the Groven — hulking, hunched, bestial stone-trolls who have inhabited the deepest crags of the Cragjaw Peaks since before humans walked the world. They speak with minimal language, live in loose family packs, and possess a brutish intelligence rooted in instinct rather than reason. The Thrumm view the Groven with superstitious fear — their smoothed cousins smell wrong, think too fast, and carry the taint of the Fexric vats. The Groven protect Thrumm territories from the periphery but cannot live among them anymore. The Deep Alchemists of the Fexric still capture Thrumm broodlings, and somewhere far below Frostmaw Crag, the Lost Brood — Thrumm never rescued during the Vat-Breakers' escape — are still being injected, still being molded.`
            },
            {
              title: 'The Hrym',
              content: `The Frostborn — a formidable, stoic culture of cold-adapted vikings who thrive in the deep freeze of Nordhalla. They view the volcanic eruption of Emberspire not as a miracle, but as an ecological threat melting their sacred glaciers. Bred amidst the unforgiving glaciers, the Hrym possess an inherent resilience to the biting frost, their strikes carrying the weight of the northern gales.`
            },
            {
              title: 'The Myrathill',
              content: `Ethereal sea creatures formed entirely out of the freezing, churning ocean waves. Born under highly specific conditions near the coastlines, their true mother is the sea. The violent clash of volcanic heat and melting glacial ice sheet runoff created a massive explosion of oceanic foam, triggering an unprecedented demographic boom of Myrathill along every shoreline.`
            },
            {
              title: 'The Astril',
              content: `A humble people of herders and throat-singers who carry the last surviving constellation-spirits in their blood — the celestial ministers of Sol's court who fled Keth-Amar's slaughter and took sanctuary in willing mortal vessels. Their skin bears luminous patterns that ebb with faith and emotion, visible only in darkness. Organized around a hierarchy of inherited light — the Luminarchy — their society is a labyrinth of devotion, assassination, and the unending performance of belief. The Sylen embrace the spirit within at the risk of being consumed. The Muren suppress it through ritual at the risk of eruption. Their presence is a living accusation: they carry what Keth-Amar failed to eat.`
            },
            {
              title: 'The Vreken',
              content: `The Bryngloom Forest's oldest inhabitants — a compact, lantern-eyed people standing between dwarf and human height, whose irises emit a steady bioluminescent glow. Native to the deep bog-caves where they cultivated phosphorescent fungi millennia before the sun died, the Vreken perceive "the trail" — residual light left by passage, death, and decay — invisible to all other races. Their society is organized around sunken gothic cathedrals lit by the perpetual glow of entombed ancestors wrapped in fungal shrouds. Divided between the Clean (rust-amber eyes, immune to the fungal addiction that ravages their kin, disproportionately occupying leadership and diplomacy) and the Marked (silver-white eyes, extraordinary trail-sight, genetically vulnerable to the Over-Lit epidemic). To humans, they are "grave-lights" — lantern-eyed monks who arrive at the dying before anyone else knows death is coming, spawning the strigoi superstitions that still follow them.`
            },
            {
              title: 'The Briaran',
              content: `The descendants of House Viridane — the forgotten eighth noble family, struck from history by the seven houses that sealed the Warden's bargain. When the other families marched their firstborn to the northern peaks as sacrifice, House Viridane refused and fled south through the Frostwood Reach, making a counter-bargain with fae entities in the moonlit groves. Their bodies now grow fine briar thorns where other races grow hair — a permanent physical inheritance of the old contract. The seven families spent centuries erasing every record of Viridane's existence, and the Briaran have been hiding ever since, split between the Unshorn who remain in the deep groves and the Smooth-Skinned who shave their thorns and pass as human in the wider world. Their thorns migrate slowly across their bodies over a lifetime, drifting toward the site of the oldest unfulfilled promise their bloodline carries — a physical archive of unfinished business stretching back eight centuries.`
            }
          ]
        }
      }
    
      ,{
        id: 'timeline',
        name: 'Timeline',
        icon: 'fas fa-hourglass',
        useCustomComponent: true,
        theme: 'narrative',
        content: {
          title: 'Timeline of the World',
          description: 'A chronological journey from the first stars to the present day.',
          sections: []
        },
        summary: [
          'A chronological journey from the first stars to the present day.',
          'Every race, every class, every dark bargain traces back to moments on this timeline.',
          'From the Deepening of Sol to the waking of the Sundered Monoliths.'
        ]
      },
      {
        id: 'bestiary',
        name: 'Bestiary',
        icon: 'fas fa-dragon',
        useCustomComponent: true,
        theme: 'danger',
        content: {
          title: 'Bestiary',
          description: 'The Wyrd-born creatures that inhabit the frozen world.',
          sections: [
            {
              title: 'What Is the Wyrd?',
              content: 'The Wyrd is a formless primordial spiritual energy that manifests using human fear and folklore as a structural blueprint. It cannot create — it can only occupy.'
            }
          ]
        },
        summary: [
          '21 iconic Wyrd-creatures across all 7 continents.',
          'Creatures range from Low danger to High danger.',
          'Each creature is built from its regional folklore and cultural fears.'
        ]
      }
    ]
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: 'fas fa-door-open',
    description: 'Your first steps into Mythrill VTT — from interface to first roll',
    subcategories: [
      {
        id: 'welcome',
        name: 'Welcome to Mythrill',
        icon: 'fas fa-star',
        theme: 'narrative',
        summary: [
          'Mythrill is a premium virtual tabletop platform built for immersive, tactile TTRPG play.',
          'The system features 30 unique classes, 9 disciplines, 10+ races, and a custom spellcrafting wizard.',
          'This rules guide walks you from first login to running your first encounter.'
        ],
        content: {
          title: 'Welcome, Adventurer',
          description: 'Your guide to Mythrill VTT — what it is, how it works, and how to get started.',
          sections: [
            {
              title: 'What Is Mythrill?',
              content: `Mythrill is a **premium Virtual Tabletop (VTT)** platform purpose-built for the Mythrill TTRPG system. It combines a rich, fully-featured tabletop rules system with a beautifully designed digital platform — allowing groups of 2-8 players to run immersive, narratively rich role-playing sessions together, whether in the same room or across the world.\n\nAt its core, Mythrill consists of two interlocking parts:\n\n• **Mythrill TTRPG**: The game rules — your character's stats, how rolls work, how combat flows, how spells are cast, and how the world responds to your choices. All of these rules are documented in this very guide.\n• **Mythrill VTT**: The digital platform — the visual interface, the character sheets, the map grid, the combat tracker, and the library of tools that automate and enhance the rules above.\n\nTogether, they create an experience where the lines between the physical joy of rolling dice and the digital power of automation blur into something genuinely cinematic.`
            },
            {
              title: 'Transitioning from D&D (Key Differences)',
              content: `If you are coming to Mythrill from **Dungeons & Dragons (D&D 5e)**, welcome! While the spirit of epic adventure remains identical, Mythrill completely reinvents the tactical rules engine to be faster, more strategic, and far more intuitive on the digital screen. Here are the four massive differences you should know immediately:\n\n• **The Ladder of Trials (No Static DCs)**: In D&D, the DM sets a static target number (like DC 15) and you roll a d20. In Mythrill, there are no static DCs. Instead, the GM dynamically assigns a **Difficulty Die** (ranging from a d4 for very easy to a d20 for legendary trials). You roll that difficulty die, and add your Skill Rank. The roll results are color-coded in chat for instant feedback. Learn more in [Dice System](core-rules/dice-system).\n• **Unified Strike & Damage (No Double Rolling)**: D&D combat requires rolling to hit, checking if it hits, and then rolling for damage. Mythrill collapses this into a single, high-stakes moment! When you strike, you roll your weapon's damage die exactly once (**Unified Strike & Damage**). A natural 1 is a catastrophic fumble. Rolling the maximum value triggers an exploding critical hit. Any other result hits and deals that exact damage plus your Strength or Agility modifier! Learn more in [Attacks & Damage](combat-system/attacks-damage).\n• **Action Points Economy (3 AP for Ultimate Freedom)**: Forget the rigid Action, Bonus Action, and Movement system of D&D. Mythrill grants you a pool of **3 Action Points (AP)** at the start of your turn. You can spend them in *any* combination you want. Moving 30 feet costs 1 AP, attacking costs 2 AP, and casting a spell costs a variable amount of AP. You have absolute tactical freedom to decide your turn's flow. Learn more in [Combat Basics](combat-system/combat-basics).\n• **Active Soak Die (Dynamic Defense)**: In D&D, armor is a static AC number that makes attacks miss. In Mythrill, armor absorbs damage. Your Armor Score gives you permanent **Passive Damage Reduction (DR)** (Armor Score ÷ 10, rounded down). If you see a heavy strike coming, you can spend AP to take the Defend action, letting you roll an **Active Soak Die** (up to a d10/d12 for heavy plate) to physically reduce incoming damage. Learn more in [Armor & Defense](combat-system/attacks-damage).`
            },
            {
              title: 'Your Four-Step Journey',
              content: `Getting started with Mythrill follows a natural four-step path:\n\n**Step 1 — Create Your Character**: Using the Character Creation Wizard, you will spend 11 steps forging your hero. See [Creating Your First Character](getting-started/your-first-character).\n\n**Step 2 — Understand the Interface**: Familiarize yourself with the layout of the VTT. Read: [The Interface at a Glance](getting-started/interface-overview).\n\n**Step 3 — Join a Session**: Your Game Master (GM) will create a session room. Read: [Joining a Session](getting-started/joining-a-session).\n\n**Step 4 — Learn the Rules**: The rest of this guide covers every rule of the Mythrill TTRPG in detail — from the [Dice System](core-rules/dice-system) and [Character Statistics](core-rules/character-statistics) to [Combat](combat-system/combat-basics), [Magic](magic-system/magic-overview), and [Exploration](travel-exploration/travel-basics).`
            },
            {
              title: 'How to Use This Rulebook',
              content: `This is a **living, interactive rulebook** built into the VTT itself:\n\n• **Clickable Cross-Links**: Blue underlined links throughout the rules jump you directly to related sections. Look for links like [Dice System](core-rules/dice-system) or [Attacks & Damage](combat-system/attacks-damage).\n• **Quick Summary Tiles**: At the top of most sections, three bullet points give you the most important takeaways at a glance.\n• **Tables with Pagination**: Large tables are paginated so you can browse without endless scrolling.\n\n**Recommended Reading Order for New Players**:\n1. [Welcome to Mythrill](getting-started/welcome) ← You are here\n2. [Transitioning from D&D 5e](getting-started/dnd-comparison)\n3. [The Interface at a Glance](getting-started/interface-overview)\n4. [Creating Your First Character](getting-started/your-first-character)\n5. [The Dice System](core-rules/dice-system)\n6. [Character Statistics](core-rules/character-statistics)\n7. [Combat Basics](combat-system/combat-basics)\n8. [Your Class](character-creation/classes)`
            }
          ]
        }
      },
      {
        id: 'dnd-comparison',
        name: 'Transitioning from D&D 5e',
        icon: 'fas fa-exchange-alt',
        theme: 'narrative',
        summary: [
          'Mythrill completely reimagines tactical roleplay compared to D&D 5e.',
          'Learn the 7 major mechanical shifts, from the Ladder of Trials to conscious dying.',
          'Understand how the digital VTT automates and visualizes these tactile systems.'
        ],
        content: {
          title: 'Transitioning from D&D 5e',
          description: 'A comprehensive guide to understanding the mechanical shifts and mindset changes when moving from 5e to Mythrill.',
          sections: [
            {
              title: 'The Great Mindset Shift',
              content: `Coming from D&D 5e, you might expect to roll a d20 + flat modifiers against a static Armor Class (AC) or Difficulty Class (DC) set by the GM. In Mythrill, throw that expectation out! \n\nMythrill is built to be a highly tactile, dramatic, and visual system. The core philosophy is simple: **you do not roll a d20 against the world; you roll the difficulty of the challenge itself.**\n\nInstead of static numbers, obstacles in the world have physical weight represented by polyhedral dice on the **Ladder of Trials**. In combat, you do not roll to hit and then roll for damage—you roll your weapon's damage die exactly once in a **Unified Strike & Damage** roll. Armor doesn't make you hard to hit; it absorbs the blow. And if you fall to 0 HP, you do not lose consciousness; you stand your ground in a heroic final stand. \n\nThis guide breaks down these differences so you can transition seamlessly and master the VTT immediately.`
            },
            {
              title: '1. The Ladder of Trials vs. Static DCs',
              content: `In D&D 5e, when you attempt to pick a lock, the DM checks their notes, sets a static DC (like DC 15), and you roll a d20 + your Dexterity (Sleight of Hand) modifier. \n\nIn Mythrill, there are no static DCs. Instead, the GM dynamically assigns a **Difficulty Die** representing the complexity of the challenge. You roll *that difficulty die itself* and add your Skill Rank (Untrained, Novice, Trained, Apprentice, Adept, Expert, Master) plus situational modifiers. \n\n• **d4 (Very Easy)** to **d20 (Very Difficult)**: For an easy task, you roll a d4. For a near-impossible legendary trial, you roll a d20.\n• **Why a Smaller Die is Better**: Rolling the maximum face value on your Difficulty Die (e.g., a 4 on a d4, or an 8 on a d8) is a **Critical Success**. Rolling a 1 is always a **Critical Failure**. This means on a d4, you have a **25% chance** of a critical success, whereas on a d20, you have only a **5% chance**! \n• **Milestone of Mastery (+5 Modifier)**: While raw ability modifiers are rarely added directly to skill checks, if your primary or secondary attribute modifier reaches **+5 or higher**, your mastery is so profound that you **step down the Difficulty Die by one size** (e.g., from a challenging d10 to a moderate d8). This significantly boosts your chances of success and critical triumph!`
            },
            {
              title: '2. Unified Strike & Damage vs. Hit & Damage Rolls',
              content: `In D&D, combat can feel slow: you roll a d20 to hit, wait for the DM to confirm if it beats the target's AC, and then roll your damage dice. \n\nMythrill collapses this into a single, high-stakes moment: **Unified Strike & Damage**. When you attack, you roll your weapon's damage die exactly once:\n\n• **A Natural 1**: A catastrophic combat fumble. Your blade chips, your bowstring frays, or your rifle jams, dealing direct damage to your weapon's durability. See [Durability & Repair](core-rules/durability-repair).\n• **A Natural Maximum (Exploding Critical)**: Rolling the maximum value on your weapon die (e.g., an 8 on a d8 longsword) triggers an **exploding critical hit**. You deal maximum damage, roll the die *again* to add to the total (which can explode repeatedly!), and trigger a devastating weapon-specific condition (like Bleed for Slashing, or Stun for Bludgeoning).\n• **Any Other Roll**: You hit! The exact number you roll on the die is your raw damage. You add your Strength (for melee/heavy weapons) or Agility (for ranged/light weapons) modifier directly to this number, and that is the final damage dealt. No double rolling, no slow calculations!`
            },
            {
              title: '3. 3 Action Points (AP) vs. Rigid Action Economy',
              content: `D&D 5e restricts your turn to one Movement, one Action, one Bonus Action, and one Reaction. This can lead to frustrating turns where you have nothing to do with your Bonus Action, or cannot move after attacking. \n\nMythrill replaces this rigidity with ultimate tactical freedom: a **3 Action Points (AP)** economy. At the start of your turn, your Character HUD fills with 3 glowing AP orbs. You can spend them in *any* combination you see fit:\n\n• **Movement (1 AP)**: Move up to your speed (typically 30 feet).\n• **Strike (2 AP)**: Swing your sword or shoot your bow. A standard turn lets you strike once and still move, or use your remaining AP for another action.\n• **Cast a Spell (Variable AP)**: Spellcasting costs AP based on the power of the spell. Weak cantrips cost 1 AP, while standard spells cost 2-3 AP.\n• **Defend (1 AP)**: Raise your shield or steel yourself, preparing to roll your Active Soak Die when attacked. \n\nThis fluid economy lets you move across the battlefield and strike an enemy in one turn, or stand your ground and cast a powerful spell.`
            },
            {
              title: '4. Active Soak Die vs. Static AC',
              content: `In D&D, armor is a static number (AC) that determines whether an attack hits or misses. A plate-armored knight is hard to hit, and when an attack "misses," it is narratively described as bouncing off their plate. \n\nMythrill separates dodging from absorbing blows. Dodging is handled by your Agility and reflex skills, while armor physically reduces the impact of strikes:\n\n• **Passive Damage Reduction (DR)**: Your equipped armor grants a permanent Passive DR score (calculated as your Armor Score ÷ 10, rounded down). Whenever you take damage, this passive value is automatically subtracted from the incoming damage.\n• **Active Soak Die**: When you see a devastating blow coming, you can spend AP on your turn to take the **Defend Action**. This grants you an **Active Soak Die** (ranging from a d4 for light leather up to a d10 or d12 for heavy full-plate armor). When an enemy hits you, you roll your Soak Die and reduce the incoming damage by the rolled amount! Armor in Mythrill makes you feel like an absolute tank, physically absorbing heavy blows in real-time.`
            },
            {
              title: '5. Conscious Dying vs. Unconscious Death Saves',
              content: `In D&D 5e, hitting 0 HP instantly knocks you unconscious, removing you from the game until someone heals you. You spend your turns doing nothing but rolling death saves, hoping you don't roll a natural 1. \n\nMythrill keeps you in the fight with **Conscious Dying**. When you hit 0 HP, you do **not** fall unconscious. You remain awake, on your feet, and fully aware—but you are teetering on the edge of the grave:\n\n• **Dying State**: You still roll a Death Save at the start of your turn, tracking successes and failures. \n• **Heroic Actions**: On your turn, you can still spend your Action Points (AP) to move, speak, or even attack. However, pushing your body in this state is extremely dangerous: performing heavy actions (like striking or casting spells) forces you to make an immediate, difficult Death Save or suffer internal bleeding.\n• **Dramatic Final Stands**: This allows for epic roleplay moments. Will you crawl to safety while coughing blood, use your last breath to cast a healing spell on a fallen ally, or execute one final, desperate strike to slay the boss before you collapse? The choice—and the tragedy—is yours.`
            },
            {
              title: '6. Classes & Disciplines vs. Single Class Archetypes',
              content: `In D&D, your class (like Fighter or Wizard) determines both your combat style and your roleplay identity, often requiring complex multiclassing to achieve specific character concepts. \n\nMythrill uses a unique **Dual-Identity System** that splits your combat mechanics from your philosophical identity:\n\n• **Your Class (Combat Role)**: Mythrill features **30 unique classes** (such as the iron-clad Dreadnaught, the time-bending Chronarch, the beast-taming Huntress, or the chaotic Gambler). Your class dictates your health pool, weapon proficiencies, combat resource (Mana, Rage, Fortune, Necrotic Ascension), and active combat abilities.\n• **Your Discipline (Philosophical Focus)**: You also choose one of **9 Philosophical Disciplines** (Sentinel, Trickster, Arcanist, Mystic, Zealot, Harrow, Hexer, Reaver, Mercenary). Your Discipline represents your philosophy, granting passive auras, utility skills, and narrative traits.\n• **Complete Creative Freedom**: These choices are completely independent. You do not need to multiclass to play a "Holy Knight"—you can simply pair the *Warden* class with the *Zealot* discipline. Want to play a stealthy hunter? Pair the *Huntress* class with the *Arcanist* discipline. With 270 combinations, your character is unique from level 1.`
            },
            {
              title: '7. Spatial Grid Inventory vs. Numeric Carrying Capacity',
              content: `D&D uses a numeric weight system (carrying capacity in pounds) that is so tedious to track that most players and DMs ignore it entirely, leading to characters carrying multiple chests, weapons, and hundreds of items without issue. \n\nMythrill introduces a highly visual and tactile **Spatial Grid Inventory** (similar to Resident Evil or Diablo):\n\n• **Geometric Packing**: Your inventory is a physical grid of columns and rows. Items have actual sizes: a simple lockpick is 1x1, a potion is 1x1, an elegant longsword is 1x4, and a massive steel shield is 2x3. You must physically arrange your pack like a puzzle to make items fit!\n• **Strength-Scaled Grid**: Your physical power dictates your carrying capacity. A character with 10 Strength starts with a 5x15 grid. For every 2 points of Strength above 10, your pack grows wider by one column (adding 15 slots of space).\n• **Encumbrance Zones**: Where you pack your gear matters. Packing heavy items in the outer columns (Columns 5-9 or 10-14) destabilizes your center of gravity, triggering automatic speed and agility penalties. Keep your heavy gear centered to move at full speed! The VTT automates these calculations, instantly updating your sheet as you drag and drop items.`
            }
          ],
          tables: [
            {
              title: 'Quick Comparison: Mythrill vs. D&D 5e',
              description: 'A rapid reference comparison of the core rules and systems between D&D 5e and Mythrill.',
              headers: ['System / Mechanic', 'D&D 5e Approach', 'Mythrill Approach', 'Why It Matters'],
              rows: [
                ['Dice Resolution', 'Player rolls d20 + modifiers vs. static DC set by DM.', 'GM sets Difficulty Die (d4 to d20). Player rolls that die + Skill Rank.', 'Dynamic checks; smaller difficulty dice make Critical Successes much more common (25% on d4).'],
                ['Ability Bonuses', 'High attributes (+5) add flat bonuses to d20 rolls.', 'Milestone of Mastery (+5) steps down the Difficulty Die by one size.', 'Mastery physically changes the trial, making success highly thematic and satisfying.'],
                ['Combat Rolls', 'Two rolls: Roll d20 to hit, then roll damage dice on success.', 'One roll: Roll weapon damage die once (Unified Strike & Damage).', 'Combat is lightning fast; natural maximums trigger exploding damage and weapon conditions.'],
                ['Action Economy', 'Movement + Action + Bonus Action + Reaction.', '3 Action Points (AP) pool refreshed every turn.', 'Complete tactical freedom to move, strike, cast, or defend in any combination.'],
                ['Armor & Defense', 'Static AC. Attacks below AC miss entirely; attacks equal or higher hit.', 'Passive DR absorbs damage. Active Soak Die (d4 to d12) rolled via Defend action.', 'Defenders feel physically tanky; armor behaves realistically by absorbing force.'],
                ['Zero Hit Points', 'Unconscious. Incapacitated, rolling death saves in place.', 'Conscious Dying. Awake and able to act, but heavy actions risk immediate death saves.', 'Enables epic final stands, dramatic sacrifices, and high-tension roleplay.'],
                ['Character Setup', 'Single Class choosing a subclass at level 1-3.', 'Class (30 Combat Roles) + Discipline (9 Philosophical Focuses).', '270 unique archetypes at level 1 with zero complex multiclassing required.'],
                ['Inventory Track', 'Numeric weight in pounds (often ignored).', 'Tactile Spatial Grid (diablo-style) with center-of-gravity encumbrance.', 'Visual, interactive inventory puzzle that adds realistic, satisfying survival weight.']
              ]
            }
          ]
        }
      },
      {
        id: 'interface-overview',
        name: 'The Interface at a Glance',
        icon: 'fas fa-desktop',
        theme: 'mechanic',
        summary: [
          'The VTT is divided into a central grid (play area), sidebar panels, and a floating HUD.',
          'Your character sheet is always accessible via your portrait icon in the top-left HUD.',
          'The GM controls the session: maps, tokens, combat, music, weather, and atmosphere.'
        ],
        content: {
          title: 'The Mythrill VTT Interface',
          description: 'A complete guided tour of every major zone of the VTT screen.',
          sections: [
            {
              title: 'The Main Play Area (The Grid)',
              content: `The vast center of your screen is the **tactical play area** — a scrollable, zoomable map grid that the Game Master populates with terrain, lighting, and tokens. This is where movement, combat, exploration, and encounters play out.\n\n• **Your Token**: Your character is represented as a circular portrait token on the grid. Click your token to select it; drag to move it (a movement confirmation dialog will appear).\n• **Grid Squares**: Each square represents 5 feet of real distance. Your movement speed determines how many squares you can traverse per turn. See [Token Movement](combat-system/token-movement).\n• **Right-Click Menu**: Right-clicking any token opens a context menu with options to inspect, target, or roll skill checks against them.\n• **Zoom & Pan**: Scroll the mouse wheel to zoom; middle-click-drag to pan the view.`
            },
            {
              title: 'The Character HUD (Top-Left)',
              content: `Floating in the top-left is your **Character HUD** — a compact status display showing:\n\n• **Portrait & Name**: Your character portrait. Click it to open your full character sheet.\n• **Health Bar** (red): Current HP out of maximum. Turns orange as you take damage.\n• **Mana Bar** (blue): Current Mana out of maximum. Depletes as you cast spells.\n• **Class Resource Bar**: Each class has a unique resource. Your bar's color reflects your class — green Rage for Berserkers, purple Necrotic Ascension for Deathcallers, gold Fortune Points for Gamblers. See [Class Resources](magic-system/magic-resources).\n• **Action Points (AP)**: Glowing orbs track your current AP. You begin each turn with a full pool. See [Combat Basics](combat-system/combat-basics) for AP costs.`
            },
            {
              title: 'The Sidebar Panels',
              content: `The right side houses collapsible tool panels:\n\n• **Chat & Dice Log**: All dice rolls, skill checks, and system messages appear here. See [Rolling Dice in the VTT](getting-started/dice-rolling-basics).\n• **Combat Timeline**: When combat begins, the initiative tracker lists all combatants in turn order. See [The Combat Tracker](combat-system/combat-tracker).\n• **Quest Log**: Active quests, objectives, and rewards tracked here.\n• **Conditions Panel**: Active conditions (Blinded, Poisoned, Prone, etc.) shown with icons. See [Combat Conditions](combat-system/combat-conditions).\n• **Jukebox**: The GM uses the integrated audio player for immersive background music and ambient sounds.`
            },
            {
              title: 'GM-Only Tools',
              content: `Game Masters have access to additional panels:\n\n• **GM Tools Panel**: Encounter management, NPC tools, weather control, and the Social Encounter Generator.\n• **The Travel Tracker** (keyboard shortcut: **W**): Automated hour-by-hour travel for overland journeys across six biomes. See [Advanced Travel System](travel-exploration/advanced-travel).\n• **Creature Library**: Browse and manage creature stat blocks for encounters.\n• **Item Library**: Browse, create, and distribute items to players. See [Equipment System](equipment-system/weapons).`
            }
          ],
          tables: [
            {
              title: 'VTT Interface Quick Reference',
              description: 'A rapid-reference overview of every major UI zone and its primary use.',
              headers: ['UI Zone', 'Location', 'Primary Use'],
              rows: [
                ['Tactical Grid', 'Center of screen', 'Movement, combat, exploration'],
                ['Character HUD', 'Top-left overlay', 'Health, mana, AP, class resource'],
                ['Character Sheet', 'Open via portrait click', 'Stats, equipment, skills, spells'],
                ['Chat & Dice Log', 'Right sidebar', 'Communication and dice results'],
                ['Combat Timeline', 'Right sidebar (in combat)', 'Initiative and turn order'],
                ['Quest Log', 'Right sidebar', 'Active quests and objectives'],
                ['Conditions Panel', 'Right sidebar', 'Active status effects'],
                ['Jukebox', 'Right sidebar', 'Background audio (GM-controlled)'],
                ['GM Tools Panel', 'Right sidebar (GM only)', 'Encounter and NPC management'],
                ['Travel Tracker (W)', 'Keyboard shortcut (GM only)', 'Overland journey automation']
              ]
            }
          ]
        }
      },
      {
        id: 'your-first-character',
        name: 'Creating Your First Character',
        icon: 'fas fa-user-plus',
        theme: 'narrative',
        summary: [
          'The Character Creation Wizard guides you through 11 sequential steps.',
          'Choose your Race, Class, Discipline, Ability Scores, Skills, and starting Equipment.',
          'Your choices are independent — any Race can take any Class or Discipline.'
        ],
        content: {
          title: 'Creating Your First Character',
          description: 'A step-by-step walkthrough of the Character Creation Wizard.',
          sections: [
            {
              title: 'Opening the Character Creation Wizard',
              content: `To begin, open the **Character Creation Wizard** from the main navigation. The wizard is a guided 11-step process taking you from a blank slate to a fully realized hero, ready for adventure. Your progress is automatically saved — you can pause and return at any time.`
            },
            {
              title: 'The 11 Steps at a Glance',
              content: `**Step 1 — Basic Information**: Name your hero, describe their appearance, age, height, and weight.\n\n**Step 2 — Race & Subrace**: Choose from 10 ancestral races with 2-3 subraces each, offering distinct stat modifiers and racial abilities. See [Races & Variants](character-creation/races).\n\n**Step 3 — Class**: Select your combat role and resource system from **30 unique classes**. See all classes at [Classes](character-creation/classes).\n\n**Step 4 — Starting Spells**: If your class uses magic, select your initial spells or abilities here. Learn to craft custom spells later at [Spellcrafting Wizard](magic-system/spellcrafting-wizard).\n\n**Step 5 — Background**: Select your pre-adventuring origin from 15 backgrounds (Sailor, Merchant, Soldier, etc.). Backgrounds grant skill proficiencies, languages, tools, and a unique feature. See [Backgrounds](character-creation/character-backgrounds).\n\n**Step 6 — Discipline**: Choose one of 9 Philosophical Disciplines (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel). See [Disciplines](character-creation/disciplines).\n\n**Step 7 — Ability Scores**: Allocate points across the six core attributes using a point-buy system. See [Character Statistics](core-rules/character-statistics).\n\n**Step 8 — Skills & Languages**: Select trained skill proficiencies and languages. Skills advance through gameplay quests. See [Skills](character-creation/skills).\n\n**Step 9 — Lore & Personal Seals**: Write your backstory, personality traits, ideals, bonds, and flaws. Upload a portrait for your token.\n\n**Step 10 — Starting Arsenal**: Purchase initial weapons, armor, and supplies. See [Weapons](equipment-system/weapons) and [Armor](equipment-system/armor).\n\n**Step 11 — Review & Finalize**: Review your full character sheet, make adjustments, and confirm. Your character is now live.`
            },
            {
              title: 'Complete Creative Freedom',
              content: `Your Race, Class, Background, and Discipline are **entirely independent choices**. There are no restrictions. You can build:\n\n• A noble **Soldier** background with a **Witch Doctor** class and a **Harrow** Discipline.\n• A street-smart **Urchin** background with a **Chronarch** class and a **Mystic** Discipline.\n• A wandering **Sailor** background with a **Gambler** class and a **Trickster** Discipline.\n\nEvery combination is viable. Every combination tells a unique story.`
            },
            {
              title: 'New Player Archetype Recommendations',
              content: `With 30 unique classes and 9 disciplines, starting character creation can feel like standing at the edge of a massive, beautiful ocean. To hold your hand on your first journey, we recommend these three classic archetypes which represent the peak of fun and mechanical clarity for new players:\n\n• **The Stout Vanguard (Classic Warrior)**\n  - **Class**: *Dreadnaught* or *Warden* (Excellent high-durability defense)\n  - **Discipline**: *Sentinel* (Provides powerful defensive aura shields for your allies)\n  - **Ability Focus**: Constitution & Strength\n  - **Background**: *Soldier* or *Blacksmith*\n\n• **The Shadow Stalker (Classic Rogue/Scout)**\n  - **Class**: *Huntress* or *Bladedancer* (Incredible mobility, single-target strikes, and stealth tactics)\n  - **Discipline**: *Trickster* (Provides illusions, teleport triggers, and critical combat leverage)\n  - **Ability Focus**: Agility & Charisma\n  - **Background**: *Urchin* or *Hunter*\n\n• **The Arcane Weaver (Classic Mage/Spellcaster)**\n  - **Class**: *Chronarch* (Time manipulation, extra AP tricks) or *Pyrofiend* (Visceral, explosive fire magic)\n  - **Discipline**: *Arcanist* (Improves resource recovery, spell efficiency, and raw elemental potency)\n  - **Ability Focus**: Intelligence & Spirit\n  - **Background**: *Scholar* or *Hermit*\n\nSelect any of these configurations during the creation steps to begin with a clear, synergistic mechanical direction!`
            }
          ]
        }
      },
      {
        id: 'joining-a-session',
        name: 'Joining a Session',
        icon: 'fas fa-users',
        theme: 'narrative',
        summary: [
          'Sessions are created and hosted by the Game Master.',
          'Players join via a session link or room code shared by the GM.',
          'Place your token on the map and check your character sheet before play begins.'
        ],
        content: {
          title: 'Joining a Session',
          description: 'How to connect to a session room, set up your token, and prepare for play.',
          sections: [
            {
              title: 'Receiving the Session Link',
              content: `The Game Master creates a session room and shares a **room link or invite code** with their players. Click the link or enter the code in the Join Session panel on the home screen. The platform will connect you to the GM's session in real time.\n\nOnce connected, you will see the tactical map the GM has prepared. Depending on the GM's settings, you may see fog of war (darkness masking unexplored areas) or the full map.`
            },
            {
              title: 'Placing Your Token',
              content: `When you first join, the GM will place your character token on the map. Your token represents your hero in the physical game world — its position matters for movement, range calculations, and area-of-effect spells.\n\nOnce your token is placed:\n• Click it to select it and see your stats highlighted in the HUD.\n• Verify your HP, Mana, and AP are correct in the top-left HUD.\n• Open your character sheet (click your portrait) and review your spells, equipment, and skills.`
            },
            {
              title: 'Pre-Session Checklist',
              content: `Before play begins, run through this quick checklist:\n\n• **Character Sheet**: Are your attributes assigned, class abilities added, and starting equipment equipped?\n• **Spells & Abilities**: Are your spells visible on your action bar? If not, visit [Spellcrafting Wizard](magic-system/spellcrafting-wizard) to add them.\n• **Skill Familiarity**: Know which skills you are trained in and which attribute they use. See [Skills](character-creation/skills).\n• **Resources**: Note your starting Mana, class resource, and AP pool to track them during combat.\n• **Ask the GM**: Which optional rule modules are in use — settlement activities, corruption, advanced travel? Ask before the first scene so you know what mechanics apply.`
            }
          ]
        }
      },
      {
        id: 'dice-rolling-basics',
        name: 'Rolling Dice in the VTT',
        icon: 'fas fa-dice',
        theme: 'mechanic',
        summary: [
          'Skill checks trigger automatically when you click the relevant skill on your character sheet.',
          'The GM sets the difficulty die size (d4 to d20) — the chat log tells you which die was rolled.',
          'All roll results are broadcast to the chat log visible to the entire table.'
        ],
        content: {
          title: 'Rolling Dice in the VTT',
          description: 'How to trigger rolls, read results, and understand the Difficulty Die system in practice.',
          sections: [
            {
              title: 'How Rolls Work on the VTT',
              content: `Every dice roll flows through the **Chat & Dice Log**. When you trigger a roll:\n\n1. The system selects the correct die for the skill.\n2. The GM sets (or confirms) the Difficulty Die size — from **d4 (Very Easy)** to **d20 (Very Difficult)**.\n3. The VTT rolls your die, adds your Skill Rank modifier, and broadcasts the result to the full table.\n4. Results are color-coded for instant reading (see table below).\n\nFor the full difficulty die system, see [The Dice System](core-rules/dice-system).`
            },
            {
              title: 'Triggering Skill Rolls from Your Sheet',
              content: `The fastest way to roll is from your character sheet:\n\n• Open your character sheet (click your portrait).\n• Navigate to the **Skills** tab.\n• Click the die icon next to any skill to trigger that roll.\n• The system calculates Skill Rank + attribute modifier automatically.\n• The result appears in the Chat & Dice Log for everyone.\n\nFor combat rolls (weapon attacks), click the weapon on your **action bar** during your turn. This triggers the Unified Strike — handling both hit and damage in one roll. See [Attacks & Damage](combat-system/attacks-damage).`
            },
            {
              title: 'Manual Dice Commands',
              content: `You can roll manually by typing commands into the chat input:\n\n• \`/roll 1d20\` — rolls a single d20.\n• \`/roll 2d6+3\` — rolls 2d6 and adds 3.\n• \`/roll d8\` — rolls a single d8.\n\nManual rolls are useful for unusual GM-called checks or to record a physical die roll in the digital log.`
            }
          ],
          tables: [
            {
              title: 'Roll Result Colors at a Glance',
              description: 'Every roll is color-coded in the chat log for instant reading.',
              headers: ['Color', 'Outcome', 'Meaning'],
              rows: [
                ['Dark Red', 'Total Failure', 'Catastrophic failure with severe consequences'],
                ['Red-Orange', 'Failure', 'The attempt fails without major complications'],
                ['Amber / Yellow', 'Partial Success', 'Mixed result — some success with drawbacks'],
                ['Teal / Blue-Green', 'Success', 'The attempt succeeds as intended'],
                ['Bright Blue (star)', 'Critical Success', 'Exceptional success with additional benefits']
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'core-rules',
    name: 'Core Rules',
    icon: 'fas fa-book',
    description: 'Foundation mechanics that govern basic gameplay',
    subcategories: [
      {
        id: 'game-overview',
        name: 'Game Overview',
        icon: 'fas fa-info-circle',
        theme: 'narrative',
        summary: [
          'The Sacred Difficulty-Dice Ladder replaces static DCs, chosen dynamically by the Game Master.',
          'Combat is swift: weapon dice handle both the strike and the damage in a single, fluid roll.',
          'Modular frameworks let GMs tailor settlement downtime, magic corruption, and exploration to their table.'
        ],
        content: {
          title: 'Enter the Weave',
          description: 'An entry into the modular rules of Mythrill, where stories are woven by hands of flesh and rolls of bone.',
          sections: [
            {
              title: 'How to Navigate This Rulebook',
              content: `Welcome to the Mythrill rulebook. This interactive guide lives inside the VTT itself. If you are brand new, start at [Getting Started](getting-started/welcome) before reading the core rules.\n\nThroughout this guide:\n• **Blue Links** jump directly to related sections — click them freely.\n• **Quick Facts Tiles** at the top of each section give you the most important numbers at a glance.\n• **Tables** are paginated — use the arrows to browse large tables.\n\n**Recommended Reading Order**: [Welcome](getting-started/welcome) → [Dice System](core-rules/dice-system) → [Character Statistics](core-rules/character-statistics) → [Combat Basics](combat-system/combat-basics) → [Your Class](character-creation/classes).`
            },
            {
              title: 'Core Principles: The Tumble of Fate',
              content: `Mythrill does not bind your heroic fate to static, lifeless numbers or flat, unyielding Difficulty Classes. Instead, the living world breathes through the **Ladder of Trials**—a dynamic difficulty-dice system where the Game Master selects a die size reflecting the task's complexity, from a swift, minor d4 to a grueling, legendary d20. You roll that die, pitting your raw skill ranks, attribute modifiers, and situational fortune against the hazard. In combat, the rhythm of battle accelerates: weapon dice govern both the strike and the damage in a single, fluid roll. A hero's journey is not calculated by cold math, but felt through the heavy tumble of physical dice against the parchment.`
            },
            {
              title: 'Session Structure: Chapters of Legend',
              content: `Our stories unfold in sessions of two to four hours—episodes where you will step into the boots of legendary adventurers. You will traverse dangerous frontiers, engage in high-stakes parleys in candlelit taverns, and survive lethal encounters in forgotten ruins. Under the guidance of the Game Master (GM), who acts as the supreme narrator and breathes life into the world, you and your companions will control your characters, make impactful choices, and forge a shared, lasting legacy.`
            },
            {
              title: 'Collaborative Storytelling: A Shared Fire',
              content: `In Mythrill, the greatest weapon is not the sword, but the shared imagination of the table. True legends arise when players collaborate with the GM to create rich, dramatic narratives. Build your characters with distinct motivations, deep-seated flaws, and tragic bonds; let every triumph be celebrated, let every failure lead to unexpected paths, and let the cooperative spirit guide every roll and roleplaying scene.`
            },
            {
              title: 'Modular Rules System: An Open Architecture',
              content: `Mythrill is not a rigid cage of rules, but an open, modular framework. The core mechanics establish a robust foundation, while specialized modular systems allow each GM to customize the experience to match their table's specific desires:

• **Settlement Activities** for high-downtime, community-focused campaigns where heroes build guilds and influence politics.
• **Supernatural Systems** for dark, high-stakes games where magic carries corruption and dark deals.
• **Travel & Exploration** for vast journeys across harsh, unforgiving wildernesses with survival mechanics.
• **Point & Click Framework** for tactile, detailed structural exploration inside the virtual tabletop.

Mix and match these systems to craft the exact tone of your campaign.`
            }
          ]
        }
      },
      {
        id: 'dice-system',
        name: 'Dice System',
        icon: 'fas fa-dice-d20',
        theme: 'mechanic',
        quickFacts: [
          { icon: 'fas fa-dice-d4', label: 'd4', value: 'Very Easy' },
          { icon: 'fas fa-dice-d6', label: 'd6', value: 'Easy' },
          { icon: 'fas fa-dice-d8', label: 'd8', value: 'Moderate' },
          { icon: 'fas fa-dice-d10', label: 'd10', value: 'Challenging' },
          { icon: 'fas fa-dice-d12', label: 'd12', value: 'Difficult' },
          { icon: 'fas fa-dice-d20', label: 'd20', value: 'Very Difficult' }
        ],
        summary: [
          'Roll the difficulty die selected by the GM, adding your Skill Rank.',
          'Highest possible roll on the die yields Critical Success; a natural 1 is a Critical Failure.',
          'Exceptional primary or secondary attributes (+5 or higher) step the difficulty die down by one size.'
        ],
        content: {
          title: 'The Sacred Dice System',
          description: 'The Ladder of Trials, critical fortunes, and the shifting winds of advantage.',
          sections: [
            {
              title: 'The Ladder of Trials (Difficulty Dice)',
              content: `At the heart of every trial lies the **Ladder of Trials**. Instead of comparing your roll to a static, lifeless target number, the Game Master dynamically assigns a Difficulty Die that represents the obstacle's resistance. You must roll this die and add your Skill Rank plus situational modifiers to determine your success. While raw ability scores are rarely added directly to skill checks, exceptional physical or mental power changes your mathematical odds: if your primary or secondary attribute modifier reaches the Milestone of Mastery (**+5 or higher**), your absolute mastery allows you to step the difficulty die down by one size (e.g., from a d10 to a d8, or a d12 to a d10). To understand how these modifiers are calculated, see the [Six Pillars of Mortality](core-rules/character-statistics).`
            },
            {
              title: 'Critical Fortunes: The Fates Speak',
              content: `Fortune in Mythrill is a dynamic, living force. Rolling the highest possible number on your chosen difficulty die triggers a **Critical Success**—a spectacular triumph that yields unexpected narrative benefits, additional momentum, or devastating side effects. Conversely, rolling a **1** triggers a **Critical Failure**, inviting dire complications and shifting the initiative to the opposition. For weapon strikes and direct checks, natural maximums remain the ultimate arbiters, with critical hits unleashing devastating weapon-specific effects and exploding damage dice. On the other hand, critical fumbles can lead to direct gear wear, reducing its reliability. Learn more about weapon fumbles and repairs in [Durability & Repair](core-rules/durability-repair), and combat rules in [Attacks & Damage](combat-system/attacks-damage).`
            },
            {
              title: 'Advantage & Disadvantage',
              content: `When the fates smile upon you (Advantage), roll two of the chosen difficulty dice and keep the higher result. When the shadows lengthen or the footing is treacherous (Disadvantage), roll two and use the lower. If forces of light and dark clash equally, they cancel out, returning you to a standard roll. Advantage represent tactical position, spells, and preparation, making them crucial to seek out.`
            }
          ],
          tables: [
            {
              title: 'Difficulty Dice',
              description: 'The heart of our system: the GM selects a die size that matches the challenge. Roll that die, add your skill rank, and let fate decide.',
              headers: ['Die', 'Difficulty', 'Sacred Application'],
              rowsPerPage: 12,
              rows: [
                ['d4', 'Very Easy', 'Trivial or thoroughly prepared actions'],
                ['d6', 'Easy', 'Routine actions for a trained adventurer'],
                ['d8', 'Moderate', 'Standard challenges that bear minor risk'],
                ['d10', 'Challenging', 'Requires focus, tactical position, or effort'],
                ['d12', 'Difficult', 'Demands deep expertise or massive leverage'],
                ['d20', 'Very Difficult', 'High-stakes trials with no margin for error']
              ]
            }
          ]
        }
      },
      {
        id: 'character-statistics',
        name: 'Character Statistics',
        icon: 'fas fa-chart-bar',
        theme: 'mechanic',
        quickFacts: [
          { icon: 'fas fa-heart', label: 'CON', value: 'Health & Vigor' },
          { icon: 'fas fa-fist-raised', label: 'STR', value: 'Physical Might' },
          { icon: 'fas fa-running', label: 'AGI', value: 'Agility & Speed' },
          { icon: 'fas fa-brain', label: 'INT', value: 'Acuity & Lore' },
          { icon: 'fas fa-eye', label: 'SPI', value: 'Will & Insight' },
          { icon: 'fas fa-comments', label: 'CHA', value: 'Personality' }
        ],
        summary: [
          'Six core attributes measure your physical limits, mental acuity, and spiritual weight.',
          'Attributes translate directly into modifiers, spanning from a weak -5 to a legendary +10.',
          'Attributes of +5 or higher allow you to step down the difficulty die size on associated checks.'
        ],
        content: {
          title: 'Anchors of Flesh & Spirit',
          description: 'The six primary attributes that define your mortal vessel and immortal soul.',
          sections: [
            {
              title: 'The Six Pillars of Mortality',
              content: `Every hero, villain, and beast that walks the shattered lands of Mythrill is bound to six fundamental primary attributes. These six pillars represent the absolute limits of your physical vessel and the depths of your inner spirit. They define how you interact with the environment, endure hardship, wield ancient magic, and parley with kings or demons. Unlike modern systems that require complex calculations, Mythrill attributes translate directly into a clear modifier, scaling from a weak, fragile **-5** (representing severe impairment) to a legendary, godlike **+10** (representing the pinnacle of mortal capability).`
            },
            {
              title: 'The Milestone of Mastery (+5 Modifier)',
              content: `When an adventurer dedicatedly trains their body or mind to reach a modifier of **+5 or higher** in a primary attribute, they cross a threshold of supreme competence. This milestone of mastery forever alters how they face challenges. Whenever the GM calls for a skill check associated with that attribute, your legendary mastery allows you to step the GM's Difficulty Die down by one size (e.g., from a standard d10 down to a d8, or a grueling d12 down to a d10). This passive benefit represents a character whose movements have become instinctual, whose mind has attained perfect clarity, or whose spirit resonates with the raw elements.`
            },
            {
              title: 'Interaction & Sheet Mechanics',
              content: `On the virtual tabletop, your attribute scores are beautifully integrated into your character ledger. Clicking on any attribute modifier icon triggers an direct check, automatically rolling the corresponding difficulty die set by the GM and adding your modifier. If your character sheet detects an attribute score at 20 or higher (+5 modifier), it will automatically prompt you with the stepped-down difficulty option, streamlining gameplay and keeping the focus on the cinematic narrative.`
            }
          ],
          tables: [
            {
              title: 'Primary Attributes',
              description: 'Six pillars of capability that define every character. These attributes shape your strengths, weaknesses, and the paths available to you.',
              headers: ['Attribute', 'Abbr.', 'Flesh & Spirit Representative', 'Sovereign Applications'],
              rowsPerPage: 12,
              rows: [
                ['Constitution', 'CON', 'Vigor & Physical Fortitude', 'Hit Points, Fortitude Saves, Enduring Poison/Fatigue'],
                ['Strength', 'STR', 'Muscular Power & Might', 'Melee Strikes, Athletics, Carriage Capacity'],
                ['Agility', 'AGI', 'Dexterity & Swiftness', 'Ranged Strikes, Dodge, Armor, Reflex Saves, Stealth'],
                ['Intelligence', 'INT', 'Cognition & Memory', 'Arcane Spellcasting, Investigation, Ancient Lore'],
                ['Spirit', 'SPI', 'Willpower & Intuition', 'Divine Spellcasting, Perception, Will Saves, Insight'],
                ['Charisma', 'CHA', 'Force of Personality', 'Social Influence, Command, Performance, Deception']
              ]
            },
            {
              title: 'Attribute Modifiers',
              description: 'Your attribute scores translate into modifiers that affect rolls and calculations. Higher scores grant greater bonuses to your capabilities.',
              headers: ['Score', 'Modifier', 'Score', 'Modifier'],
              rowsPerPage: 16,
              rows: [
                ['1', '-5', '16-17', '+3'],
                ['2-3', '-4', '18-19', '+4'],
                ['4-5', '-3', '20-21', '+5'],
                ['6-7', '-2', '22-23', '+6'],
                ['8-9', '-1', '24-25', '+7'],
                ['10-11', '+0', '26-27', '+8'],
                ['12-13', '+1', '28-29', '+9'],
                ['14-15', '+2', '30', '+10']
              ]
            }
          ]
        }
      },
      {
        id: 'inventory-encumbrance',
        name: 'Inventory & Encumbrance',
        icon: 'fas fa-weight-hanging',
        theme: 'trade',
        quickFacts: [
          { icon: 'fas fa-th', label: 'Base Grid', value: '5×15 (75 slots)' },
          { icon: 'fas fa-weight-hanging', label: 'STR Bonus', value: '+1 row per 2 STR above 10' },
          { icon: 'fas fa-exclamation-triangle', label: 'Encumbered', value: 'Cols 5-9: -25% Speed' },
          { icon: 'fas fa-skull-crossbones', label: 'Overburdened', value: 'Cols 10-14: -75% Speed' }
        ],
        summary: [
          'Inventory is represented as a spatial grid; a base pack has 5 columns by 15 rows (75 slots).',
          'Every 2 points of Strength above 10 grants one additional row (5 slots) of precious space.',
          'Three vertical column zones govern encumbrance; packing too wide brings swift physical penalties.'
        ],
        content: {
          title: 'Tactile Pack & Steel Grid',
          description: 'The spatial puzzle of survival, where every item takes physical space and bears real weight.',
          sections: [
            {
              title: 'The Spatial Grid',
              content: `Survival in the untamed wilderness and deep, ruinous vaults of Mythrill demands more than steel and spells; it requires meticulous, physical organization. Carrying capacity in Mythrill is not represented by an abstract weight value or a passive numeric limit, but rather by a highly tactile and visual **Spatial Grid** within the player ledger. Every weapon, piece of armor, ration, and magical reagent occupies a specific geometric layout (e.g. 1x1 slots for iron spikes, 1x4 slots for an elegant longsword, or 2x3 slots for a heavy oak shield). 

A starting adventurer with a baseline Strength score of 10 carries a standard adventurer's pack featuring a base grid layout of **5 columns by 15 rows (75 slots)**. Your pack scales dynamically with your physical power: for every 2 points of Strength above 10, your grid width increases, adding **one additional vertical column (15 slots)** of precious cargo space (e.g. expanding to 6 columns at Strength 12-13, and up to 10 columns at Strength 20+). For details on allocating Strength and tracking your ability modifiers, consult the [Six Pillars of Mortality](core-rules/character-statistics).`
            },
            {
              title: 'Encumbrance Zones',
              content: `The physical balance of your pack dictates the swiftness of your stride, the height of your active defense, and the quickness of your actions. The Mythrill inventory grid is segregated into three distinct vertical column zones, representing how weight is distributed across your shoulders and center of gravity:

• **Columns 0-4 (Core Balance)**: The perfectly centered load. Items stored entirely within these columns impose no mobility penalties, allowing you to move at your maximum movement rate.
• **Columns 5-9 (Encumbered Zone)**: Storing any items in these columns causes your pack's balance to drift wide, resulting in an immediate **-25% reduction in movement speed** and a mild physical toll on agility.
• **Columns 10-14 (Overburdened Zone)**: Packing heavy or bulky loot into these outer columns severely destabilizes your balance, inflicting a grueling **-75% movement speed penalty** and leaving you vulnerable as a slow, lumbering target.

Tactical packing is a mini-game in itself: do you keep your heavy steel plate and weapons centered to sprint freely, or do you fill your outer columns with treasure and accept the exhausting fatigue? These zones are fully automated on your digital character sheet, updating your speed and modifiers instantly as you drag and drop items.`
            }
          ],
          tables: [
            {
              title: 'Encumbrance Effects',
              description: 'How you pack your inventory matters. Items in different zones affect your mobility and capabilities—pack wisely, for every choice has weight.',
              headers: ['Zone', 'Grid Columns', 'Physical Toll'],
              rows: [
                ['Normal', 'Columns 0-4', 'No penalties. The load is perfectly centered.'],
                ['Encumbered', 'Columns 5-9', '-25% Movement Speed. +5% STR/CON checks, but -5% to all other attributes due to fatigue.'],
                ['Overencumbered', 'Columns 10-14', '-75% Movement Speed. +15% STR/CON checks, but -15% to all other attributes. You are a lumbering wall.']
              ]
            },
            {
              title: 'Strength Bonus Rows',
              description: 'Greater strength means greater capacity. Each two points above 10 adds another row to your inventory grid, allowing you to carry more gear.',
              headers: ['Strength Score', 'Grid Dimensions', 'Total Pack Space'],
              rows: [
                ['8-9', '4×15', '60 Slots'],
                ['10-11', '5×15', '75 Slots'],
                ['12-13', '6×15', '90 Slots'],
                ['14-15', '7×15', '105 Slots'],
                ['16-17', '8×15', '120 Slots'],
                ['18-19', '9×15', '135 Slots'],
                ['20+', '10×15', '150 Slots']
              ]
            }
          ]
        }
      },
      {
        id: 'durability-repair',
        name: 'Durability & Repair',
        icon: 'fas fa-shield-alt',
        theme: 'trade',
        summary: [
          'Weapons, armor, and gear decay slowly in combat, tracked as a durability ratio.',
          'Items hitting 0 durability shatter completely, automatically unequipping and nullifying bonuses.',
          'Mending ruined gear is done during rests by rolling a d20 against a GM-set Difficulty Class.'
        ],
        content: {
          title: 'Fraying Weaves & Shattered Iron',
          description: 'The slow decay of arms and armor, and the craft of restoring them.',
          sections: [
            {
              title: 'Mortal Wear',
              content: `No weapon remains eternally sharp, and no steel plate remains unbent in the crucible of battle. In Mythrill, every piece of equippable gear—from heavy steel cuirasses and runic shields to fine silken robes and magic rings—carries a physical Durability rating representing its structural integrity. Expressed as a tactile ratio (e.g., **5/8 Durability**), this metric marks the slow, inevitable decline of your gear under the grinding toll of combat. The finest masterwork weapons will chip, leather straps will fray under strain, and magical bindings will leak their residual energy as the item's structural cohesion decays.`
            },
            {
              title: 'The Toll of Combat (Durability Damage)',
              content: `When an opponent lands a devastating critical strike or targets a specific Zone of Protection (such as your head, chest, or limbs), your protective gear or parrying weapon bears the brunt of the strike. Furthermore, when resolving a weapon swing via the [Unified Strike & Damage Combat Roll](combat-system/attacks-damage), rolling a Critical Fumble (natural 1) immediately risks chipping your blade or fracturing your shield, dealing direct durability damage. 

Under the Virtual Tabletop system, players and GMs can easily inspect and manage these wear marks manually. Simply open the item's **Right-Click Context Menu** inside your spatial inventory grid and select the **Durability** slider to adjust current values, simulating the realistic wear and tear of a long, gritty crawl or direct maintenance.`
            },
            {
              title: 'The Shattered State (Broken Items)',
              content: `When an item is reduced to **0 Durability**, it shatters with a sickening crack. A shattered item is completely inert and structurally useless, failing to offer any protection or offensive power. Upon breaking, the item immediately triggers the following VTT mechanics:

• **Automatic Unequip**: The ruined item is instantly stripped from your active combat slot and moved to your pack's deep storage.
• **Strict Equilibrium**: You cannot re-equip, wield, or wear the item until a crafter mends it back to at least 1 durability.
• **Snuffed Runes & Magic**: All magical enchantments, stat bonuses, and runic properties are instantly snuffed out and nullified.
• **Visceral Fracture Visual**: The item's VTT entry is overlaid with a striking cracked crimson bar, rendering its ruined state clear.
• **Table Notification**: A system-wide message is broadcast to the chat log, alerting the entire party that a vital piece of gear has fractured under pressure.`
            },
            {
              title: 'Visual Condition Marks',
              content: `The VTT color-codes durability status so you can track your gear at a glance:

• **Green**: Above 50% durability. Good, reliable condition.
• **Yellow**: 50% or lower. Showing wear and tear; consider repairing soon.
• **Red**: 25% or lower. Critical condition; one hard blow could break it.
• **Broken Overlay**: 0 durability. Completely broken.`
            },
            {
              title: 'The Art of Repair (Resting)',
              content: `During short or long rests, a character can attempt to mend their broken gear. The player rolls a d20 check against a difficulty set by the GM. This challenge is resolved against the [Ladder of Trials](core-rules/dice-system) (default DC 15). The GM sets the DC based on:

• The severity of the ruin (lower durability = harder repair DC)
• The rarity and material of the artifact
• Available tools (anvil, sewing kits, leather presses)
• The character's background or trade skills

**A successful roll** restores a portion of the item's durability based on narrative agreement. **A failed roll** wastes precious time and may consume raw materials without restoring any integrity. GMs may require scrap iron for plate, cured leather for jerkins, or residuum for magical items to perform repairs.`
            },
            {
              title: 'Forge Customization (Item Durability)',
              content: `When forging a new item via the Item Wizard, creators are free to set the Maximum Durability. There is no automated formula—GMs and creators decide what makes sense for the narrative:

• A rusted iron shiv might possess only **10 Durability**.
• A standard military-grade broadsword holds **50 Durability**.
• A masterwork heavy shield holds **150 Durability**.
• A legendary relic of old may hold **200+ Durability**.`
            }
          ],
          tables: [
            {
              title: 'Quick Create Default Durability',
              description: 'Default durability values assigned when quick-creating items. These are suggestions — the GM or creator can override them at any time.',
              headers: ['Quality Tier', 'Recommended Max Durability'],
              rows: [
                ['Poor', '30'],
                ['Common', '50'],
                ['Uncommon', '70'],
                ['Rare', '90'],
                ['Epic', '120'],
                ['Legendary', '160'],
                ['Artifact', '200']
              ]
            }
          ]
        }
      },
      {
        id: 'game-sessions',
        name: 'Game Sessions',
        icon: 'fas fa-calendar-alt',
        theme: 'narrative',
        summary: ['Sessions run 2-4 hours with organic narrative pacing', 'Session Zero forms the social and safety contract of play', 'Preparation checklists optimize player readiness and GM adaptability'],
        content: {
          title: 'Game Sessions',
          description: 'Comprehensive guidelines for managing session structure, pacing mechanics, and pre-game preparation protocols.',
          tabs: [
            {
              id: 'session-structure',
              name: 'Session Structure',
              sections: [
                {
                  title: 'Session Zero: The Accord of Beginnings',
                  content: `Before a single sword is drawn, a single spell chanted, or the first step taken into the dark wilderness, the fellowship must align their destinies. A **Session Zero** is not merely a technical meeting—it is a sacred contract between the Game Master (GM) and the players, defining the campaign's thematic bounds, moral colors, and mechanical laws to ensure a unified and enjoyable experience.

• **Safety & Boundaries**: Establish clear social guidelines. Incorporate safety tools such as **Lines and Veils** (distinguishing between contents that can exist but off-screen, and those entirely forbidden) and active veto rights. Discuss trigger warnings and the tone of description (heroic versus grimdark) to ensure the table remains a welcoming sanctuary for all.
• **Homebrew Constraints & Campaign Themes**: Align on the narrative tone of the campaign. Is this an epic fantasy high-magic odyssey across the gilded spires of Mythrill, or a gritty survival struggle through mud, iron, and scarce resources? Detail any homebrew rules, mechanical restrictions, or environmental modifiers that will affect travel and combat.
• **Mechanical Onboarding**: Welcome players into the VTT ecosystem. Ensure all players understand the point-buy parameters, trained skills, and the unique resource management system associated with their selected paths from the **30 specialized classes**.
• **Group Synergy**: Ensure character concepts hold logical and narrative ties. A cohesive band of adventurers is far superior to a disjointed collective of lone wolves. Discuss how characters met, why they trust one another, and how their tactical roles complement each other in battle.`
                },
                {
                  title: 'The Chronicle of Play (Typical Session Flow)',
                  content: `A single session of play is a self-contained story—a chapter in an ongoing epic that typically spans between two and four hours. To maintain rhythm and ensure no narrative threads are lost to the sands of time, gameplay is structured into four distinct, organic phases:

• **I. The Chronicle Recap**: The session begins with the opening chronicle. Players recall their recent exploits, successes, and scars. The GM provides context, sets the immediate scene, and resolves any lingering questions from the previous week's cliffhangers.
• **II. Downtime Resolution**: Before plunging back into danger, characters catch their breath. Here, they resolve city-bound activities: repairing shattered armor, selling gathered artifacts, scribing arcane scrolls, or training in specialized guilds.
• **III. The Crucible of Play**: The heart of the session. Players navigate the wilderness, interact with NPCs, solve puzzles, and engage in tactical, turn-based combat. Here, the rolls of the dice decide the rise and fall of nations.
• **IV. The Ledger Alignment**: As the fires of adventure settle, the session closes. The GM awards Experience Points (XP) and distributes treasures. Players update their character ledgers, record session milestones, and vote on MVP commendations.`
                }
              ],
              tables: [
                {
                  title: 'Session Timeline',
                  headers: ['Phase', 'Duration', 'Activities', 'Purpose'],
                  rows: [
                    ['Opening', '5-10 min', 'Recap, check-ins, housekeeping', 'Get everyone focused'],
                    ['Downtime', '10-15 min', 'Resolve between-session activities', 'Handle character maintenance'],
                    ['Main Content', '2-3 hours', 'Adventure scenes, encounters', 'Core gameplay'],
                    ['Breaks', '10-15 min', 'Rest, snacks, discussion', 'Maintain energy'],
                    ['Closing', '10-15 min', 'Wrap-up, XP, next session planning', 'Provide closure']
                  ]
                }
              ]
            },
            {
              id: 'pacing',
              name: 'Pacing',
              sections: [
                {
                  title: 'The Ebb and Flow of Drama (Energy Management)',
                  content: `A masterfully paced session is like a symphony, rising to thunderous climaxes and falling into quiet, contemplative movements. The GM and players collaboratively manage the table's energy, alternating between periods of intense focus and lighthearted, character-driven breathers:

• **Tactical Crucibles (High Energy)**: These are the moments of high stakes—such as a frantic sword fight atop a crumbling bridge, a tense negotiation with a paranoid king, or a narrow escape from a collapsing tomb. Keep descriptions punchy, action turn-counts swift, and high-stakes dice rolling active to sustain blood-pumping excitement.
• **Narrative Voyages (Medium Energy)**: Rich roleplay encounters, investigative puzzle-solving, and localized exploration. Players banter with tavern keepers, piece together ancient inscriptions, or plot their next heist, allowing deep immersion and lore development.
• **Restorative Breathers (Low Energy)**: Travel through calm countryside, camping under the stars, or simple downtime. These quiet scenes allow players to explore character bonds, share backstories, and process the emotional weight of their journeys.`
                }
              ],
              tables: [
                {
                  title: 'Scene Energy Levels',
                  headers: ['Energy Level', 'Scene Types', 'Duration', 'Purpose'],
                  rows: [
                    ['High', 'Combat, chases, dramatic reveals', '15-45 min', 'Excitement, tension'],
                    ['Medium', 'Social encounters, puzzles', '20-60 min', 'Engagement, problem-solving'],
                    ['Low', 'Exploration, travel, shopping', '10-30 min', 'Breathing room, character moments'],
                    ['Transition', 'Moving between locations', '5-15 min', 'Scene changes, setup']
                  ]
                }
              ]
            },
            {
              id: 'preparation',
              name: 'Preparation',
              sections: [
                {
                  title: 'The Ritual of Preparation',
                  content: `True legends are forged long before the dice are cast. Both GMs and players must undertake the sacred rituals of preparation to ensure the virtual tabletop operates like a well-oiled siege engine:

• **For the Adventurer (Player Checklist)**:
  - *Parchment & Dice*: Ensure your VTT character sheet is fully updated, and physical or virtual dice are ready for rolling.
  - *Ability Memory*: Familiarize yourself with your active and passive class skills, spells, and custom resource points (e.g. Focus, Mana, Stamina) to ensure combat rounds flow seamlessly.
  - *Lore Recalled*: Read the summary of the last session, and note your character's immediate personal goals for the upcoming hours.

• **For the Weaver of Worlds (GM Checklist)**:
  - *Environmental Spells (Visuals & Music)*: Pre-load the necessary maps, tokens, and thematic background audio.
  - *NPC & Encounter Ledger*: Keep stats for key adversaries, local monster behaviors, and important NPC motivations at your fingertips.
  - *Improvisational Adaptability*: Outline three potential paths forward, but remain fully prepared to toss the parchment aside when your players choose a completely unexpected fourth direction.`
                }
              ],
              tables: [
                {
                  title: 'GM Preparation Checklist',
                  headers: ['Category', 'Items to Prepare', 'Time Investment'],
                  rows: [
                    ['NPCs', 'Names, motivations, key stats', '15-30 min'],
                    ['Locations', 'Key features, maps, atmosphere', '10-20 min'],
                    ['Encounters', 'Combat stats, environmental hazards', '20-40 min'],
                    ['Plot Hooks', 'Multiple paths forward', '10-15 min'],
                    ['Random Tables', 'Names, events, complications', '5-10 min'],
                    ['Props', 'Handouts, visual aids, music', '15-30 min']
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'character-creation',
    name: 'Character Creation',
    icon: 'fas fa-user-plus',
    description: 'Step-by-step character building process',
    subcategories: [
      {
        id: 'creation-overview',
        name: 'Overview',
        icon: 'fas fa-list-check',
        theme: 'narrative',
        summary: ['30 unique classes with flexible character building', '11-step guided creation process', 'Independent choices for race, class, background, and discipline'],
        content: {
          title: 'Forging Your Legend',
          description: 'An introductory guide to carving your path through the Mythrill character creation engine.',
          sections: [
            {
              title: 'Introduction: The Call of Fate',
              content: `Every hero who stands against the encroaching shadows is forged, not born. Mythrill presents a deeply flexible and comprehensive character creation system featuring **30 unique character classes**, 10 distinct ancestral races with diverse subraces, and independent background matrices. This open-ended architecture allows you to bring any concept to life, weaving a rich backstory directly into tactile mechanical assets. Your character's destiny unfolds across an 11-step journey, molding their physical lineage, occupational skills, philosophical disciplines, and personal lore.`
            },
            {
              title: 'The 11 Steps of Creation',
              content: `Your adventurer takes shape by traversing these eleven sequential layers:

1. **Basic Information** - Ink your character's name, identify their lineage, and define their visual characteristics.
2. **Race & Subrace** - Claim your ancestral heritage, inheriting ancestral traits, passive resistance, and physical capacities.
3. **Class selection** - Select your combat role, mechanical specialization, and unique resource system from **30 distinct classes**.
4. **Starting Spells** - Call upon initial spells, incantations, or combat maneuvers (if your chosen class manipulates these forces).
5. **Background Scars** - Select your pre-adventuring genesis, representing your life before you picked up the sword or focus.
6. **Philosophical Discipline** - Choose your approach to power, struggle, and survival (Mystic, Zealot, Trickster, Harrow, etc.).
7. **Ability Scores** - Allocate base stats using a tactile point-buy system, representing raw talent and physical limits.
8. **Skills & Languages** - Select your trained proficiencies, tool masteries, and dialects spoken across the fractured realms.
9. **Lore & Personal Seals** - Fleshing out motivations, deep-seated flaws, tragic bonds, and appearance quirks.
10. **Starting Arsenal** - Purchase initial weaponry, armaments, and traveling rations with your starting copper.
11. **Final Summary** - Review your completed ledger, seal your character's sheet, and prepare to step into the virtual tabletop.`
            },
            {
              title: 'Class and Background Sovereignty',
              content: `In Mythrill, your past does not dictate your combat capabilities. Backgrounds and classes exist as independent choices. Your background represents the social scars, trained trades, and early life of your hero, granting passive benefits and unique utility. Your class, conversely, governs your tactical role, combat maneuvers, and class-specific resource systems. This means you are completely free to build a high-society Noble Berserker, a street-smart urchin Spellguard, or a battle-scarred Soldier Chronarch. Every combination is viable, encouraging rich storytelling.`
            },
            {
              title: 'Disciplines: Approaches to Power',
              content: `Disciplines represent the core philosophy and training method your hero employs to survive. The 9 central disciplines (Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel) grant starting stat modifiers, additional point-buy capacity, and special class-agnostic abilities. While your background represents your origins and your class dictates your weapons, your discipline defines your mental approach to danger and mastery. Each discipline also offers legendary specializations to further refine your style.`
            },
            {
              title: 'Sovereign Combinatorial Freedom',
              content: `The beauty of the Mythrill system lies in its limitless custom combinations. By separating race, class, background, and discipline, you can combine elements to create completely unique characters, such as a Trickster Lichborne, a Mystic Titan, or an Arcanist Toxicologist. These combinations are designed to feel distinct and provide exciting tactical and roleplaying opportunities at the table.`
            }
          ]
        }
      },
      {
        id: 'character-backgrounds',
        name: 'Backgrounds',
        icon: 'fas fa-book',
        useCustomComponent: true, // Flag to use BackgroundsDisplay component
        theme: 'narrative',
        content: {
          title: 'Character Backgrounds',
          description: '15 character backgrounds representing your history and origin (Sailor, Merchant, Soldier, etc.)',
          sections: [
            {
              title: 'What are Backgrounds?',
              content: `Before you took up the sword or began tracing glowing glyphs in the dark, you had a life. In Mythrill, your Background represents your pre-adventuring genesis—the mundane or tragic history that forged your early years and left its mark on your soul. Whether you spent your youth sailing stormy seas, selling rare wares in crowded bazaars, or defending a remote border fort as a common soldier, your past defines your starting skills, linguistic repertoire, and starting gear. More importantly, backgrounds represent the formative trials and historical scars that guide how you interpret the dangerous world around you.`
            },
            {
              title: 'Background Benefits',
              content: `Your background is the foundation of your non-combat capabilities, offering a wealth of tactile narrative and mechanical benefits:

• **Two Skill Proficiencies**: Representing years of occupational focus and muscle memory.
• **Trade Tools**: Proficiency with specialized equipment like alchemist's supplies, navigator's charts, or lockpicks.
• **Linguistic Heritage**: Extra languages picked up during your travel or study.
• **Genesis Gear**: Starting equipment themed specifically to your past life.
• **Sovereign Background Feature**: A unique narrative ability reflecting your prior standing, contacts, or specialized lore.`
            },
            {
              title: 'Roleplaying Your Background',
              content: `Your background is not merely a list of statistics—it is your character's anchor to the setting. When crafting your origin, consider what historical scars your character carries. Did a betrayal during your mercantile years leave you cynical? Does a lingering physical mark from a military siege affect your posture? Use your background feature creatively: call on old contacts in shady taverns, leverage your academic standing at grand libraries, or utilize your guild membership to secure safe passage through occupied lands. In Mythrill, your past is never truly behind you.`
            }
          ]
        }
      },
      {
        id: 'disciplines',
        name: 'Disciplines',
        icon: 'fas fa-book',
        useCustomComponent: true, // Flag to use BackgroundSelector component (shows disciplines)
        theme: 'arcane',
        content: {
          title: 'Character Disciplines & Sub-disciplines',
          description: '9 thematic disciplines (Mystic, Zealot, Trickster, etc.) with sub-disciplines, selectable abilities, and deep customization',
          sections: [
            {
              title: 'Discipline System Overview',
              content: `Your **Class** tells the battlefield who you are. Your **Discipline** tells the *world* who you are.\n\nA Discipline is your chosen philosophical approach to power, survival, and mastery — the framework through which your hero makes sense of violence, magic, and mortality. The nine Disciplines (**Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel**) each grant starting attribute adjustments, expanded point-buy capacity, and a set of class-agnostic abilities.\n\nUnlike your Background — which represents where you came from — and your Class — which defines your combat mechanics — your Discipline defines your **approach to danger**. It is the answer to the question: *when the moment turns desperate, what kind of person are you?*`
            },
            {
              title: 'Discipline Abilities',
              content: `Each Discipline grants a set of signature abilities formatted identically to class spells — effect types, AP costs, targeting, usage limits, and restrictions fully specified. These abilities are available regardless of your class, letting a Dreadnaught access the Trickster's cunning, or a Lunarch draw on the Zealot's divine fury.\n\nDiscipline abilities sit in your character sheet alongside your class spells. They do not require separate management. They are simply *more of what you can do*.`
            },
            {
              title: 'Ability Formatting',
              content: `All Discipline abilities follow the same formatting standard as spells from the Spellcrafting Wizard — effect type, targeting, AP cost, usage frequency, and any restrictions are always present, always in the same order. Once you know how to read a spell card, you know how to read a Discipline ability.`
            }
          ],
          tabs: [
            {
              id: 'mystic',
              name: 'Mystic',
              tables: [
                {
                  title: 'Mystic Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Elemental Attunement', 'Passive', '1/Day', 'Attune to an elemental type once per day, gaining resistance and bonus damage.'],
                    ['Mana Surge', 'Active', '1/Long Rest', 'Enter a Mana Surge state for 1 minute, reducing spell costs and casting one spell for free.'],
                    ['Arcane Insight', 'Passive', 'Always Active', 'Identify magical effects and gain advantage on saves against illusions.']
                  ]
                }
              ]
            },
            {
              id: 'arcanist',
              name: 'Arcanist',
              tables: [
                {
                  title: 'Arcanist Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Arcane Insight', 'Passive', 'Always Active', 'Cast Detect Magic at will and gain advantage on checks to identify spells and magical effects.'],
                    ['Spell Adaptation', 'Active', '1/Short Rest', 'Modify a spell by changing its damage type, range, targets, or duration.'],
                    ['Arcane Shield', 'Active', '1/Short Rest', 'Create a shield of arcane energy that can cause attacks to miss or reduce damage.']
                  ]
                }
              ]
            },
            {
              id: 'trickster',
              name: 'Trickster',
              tables: [
                {
                  title: 'Trickster Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Fortune\'s Favor', 'Active', '3/Long Rest', 'Force a reroll on any d20 roll made by you or an ally within 30 feet.'],
                    ['Chaos Surge', 'Active', '1/Combat', 'Roll on the Chaos Surge table for unpredictable effects on your first attack or ability.'],
                    ['Lucky Break', 'Passive', '1/Long Rest', 'Once per long rest, remain at 1 hit point instead of being reduced to 0.']
                  ]
                }
              ]
            },
            {
              id: 'zealot',
              name: 'Zealot',
              tables: [
                {
                  title: 'Zealot Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Divine Favor', 'Passive', '1/Long Rest', 'Gain resistance to radiant damage and advantage on one roll per long rest.'],
                    ['Smite the Unfaithful', 'Active', '1/Short Rest', 'Imbue your weapon with divine energy for bonus radiant damage on your next attack.'],
                    ['Zealous Presence', 'Active', '1/Long Rest', 'Inspire allies within 30 feet with a divine battle cry, granting temporary hit points and advantage.']
                  ]
                }
              ]
            },
            {
              id: 'harrow',
              name: 'Harrow',
              tables: [
                {
                  title: 'Harrow Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Touch of Death', 'Passive', 'Always Active', 'Gain temporary hit points when you reduce a creature to 0 hit points.'],
                    ['Spectral Sight', 'Active', 'At Will', 'See invisible creatures and into the Ethereal Plane for 1 minute.'],
                    ['Death\'s Whisper', 'Active', '1/Long Rest', 'Cast Speak with Dead once per long rest, and the target cannot lie to you.']
                  ]
                }
              ]
            },
            {
              id: 'hexer',
              name: 'Hexer',
              tables: [
                {
                  title: 'Hexer Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Primal Connection', 'Passive', 'Always Active', 'Communicate with beasts and plants, and gain advantage on Survival checks.'],
                    ['Wild Shape', 'Active', '1/Long Rest', 'Transform part of your body to gain bestial benefits for 10 minutes.'],
                    ['Nature\'s Wrath', 'Active', '1/Short Rest', 'Cause plants to sprout in a 20-foot radius, creating difficult terrain and potentially restraining enemies.']
                  ]
                }
              ]
            },
            {
              id: 'reaver',
              name: 'Reaver',
              tables: [
                {
                  title: 'Reaver Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Adrenaline Rush', 'Active', '1/Short Rest', 'Enter an adrenaline-fueled state for 1 minute, gaining temporary hit points and increased speed.'],
                    ['Unstoppable Force', 'Passive', 'Always Active', 'Count as one size larger for carrying capacity and resist being moved against your will.'],
                    ['Devastating Strike', 'Active', '1/Short Rest', 'Add your Strength modifier to damage again and potentially knock the target prone.']
                  ]
                }
              ]
            },
            {
              id: 'mercenary',
              name: 'Mercenary',
              tables: [
                {
                  title: 'Mercenary Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Combat Expertise', 'Passive', 'Always Active', 'Gain proficiency with three weapons of your choice or +1 to attack rolls with already proficient weapons.'],
                    ['Tactical Assessment', 'Active', 'At Will', 'Assess a creature to learn its Armor, hit point percentage, and one damage vulnerability, resistance, or immunity.'],
                    ['Dirty Fighting', 'Active', '1/Short Rest', 'Force a target to make a Constitution save or be blinded or immobilized until the end of your next turn.']
                  ]
                }
              ]
            },
            {
              id: 'sentinel',
              name: 'Sentinel',
              tables: [
                {
                  title: 'Sentinel Abilities',
                  headers: ['Ability', 'Type', 'Usage', 'Description'],
                  rows: [
                    ['Protective Aura', 'Passive', 'Always Active', 'Grant allies within 10 feet a +1 bonus to Armor and potentially increase it further as a reaction.'],
                    ['Planar Sense', 'Passive', 'Always Active', 'Sense portals or weak points between planes and resist planar displacement effects.'],
                    ['Ward of Protection', 'Active', '1/Long Rest', 'Create a 15-foot-radius ward that grants allies resistance to one damage type and damages enemies.']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'skills',
        name: 'Skills',
        icon: 'fas fa-cogs',
        useCustomComponent: true, // Flag to use SkillsDisplay component
        theme: 'mechanic',
        content: {
          title: 'Skills',
          description: 'Character skills with rank progression and quest-based advancement',
          sections: [
            {
              title: 'How Skills Work',
              content: `A Mythrill veteran does not swing blindly and hope. Their hands know the weight of a blade. Their eyes read ambushes before they spring. Their words cut deals before fists settle disagreements. **Skills** represent this accumulated mastery — trained capabilities that separate a seasoned adventurer from a desperate farmhand.\n\nEach skill is tied to a primary and secondary attribute. When you make a skill check, the GM assigns a **Difficulty Die** — from a d4 for trivial tasks to a d20 for near-impossible ones. If your primary or secondary attribute modifier reaches **+5 or higher**, your mastery steps the difficulty die down by one size, shifting the odds in your favour.\n\n**Roll Outcome Colours** (visible in the chat log):\n• **Dark Red** — Total Failure. Severe consequences.\n• **Red-Orange** — Failure. The attempt fails without major complications.\n• **Amber/Yellow** — Partial Success. You succeed, but at a cost.\n• **Teal/Blue-Green** — Success. The attempt works as intended.\n• **Bright Blue (★)** — Critical Success. Exceptional outcome with additional benefits.`
            },
            {
              title: 'Skill Ranks & Progression',
              content: `Skills advance through seven ranks: **Untrained → Novice → Trained → Apprentice → Adept → Expert → Master**. Each rank adds a numerical bonus to your checks and unlocks richer outcomes on skill-specific rollable tables. You do not advance by grinding experience — you advance by *doing*. Each rank requires completing **Skill Quests**: small, achievable challenges that arise naturally during play.`
            },
            {
              title: 'Critical Success & Failure',
              content: `Rolling the **maximum value** on your difficulty die is a **Critical Success** — the task is accomplished beyond expectation, often with a tangible bonus or narrative windfall. Rolling a **1** is always a **Critical Failure** regardless of rank — complications arise, and the GM determines how badly the moment turns. Check your skill's rollable table for the full spectrum of possible outcomes.`
            },
            {
              title: 'Skill Quests',
              content: `Every skill has **10 Quests** — narrative milestones that unlock as you use your abilities in the world. Completing them advances your rank and opens new proficient ability options. These quests are not assigned by a trainer; they emerge from play naturally. Land your first successful Grapple. Persuade an authority figure. Survive a harrowing situation through Acrobatics alone. The world rewards those who act.`
            }
          ]
        }
      },
      {
        id: 'languages',
        name: 'Languages',
        icon: 'fas fa-language',
        useCustomComponent: true, // Flag to use LanguagesDisplay component
        theme: 'social',
        content: {
          title: 'Languages',
          description: 'Standard, exotic, secret, and elemental languages',
          sections: [
            {
              title: 'Language Categories',
              content: `Language is power in Mythrill — the difference between an ally and an enemy, between deciphering a ruin's warning and triggering its trap. Languages are organised into four tiers of accessibility:\n\n• **Standard** — Common tongues spoken across most civilised regions: Common, Dwarvish, Elvish, and their kin.\n• **Exotic** — The languages of powerful or alien beings: Draconic, Celestial, Abyssal. Rare to learn, invaluable to know.\n• **Secret** — Guarded dialects like Druidic and Thieves' Cant. These cannot simply be studied — they require initiation, membership, or a sworn oath.\n• **Elemental** — The speech of primal forces: Aquan, Auran, Ignan, Terran. Spoken by elementals, worshipped by cults.`
            },
            {
              title: 'Learning Languages',
              content: `Your race grants starting languages — always Common, plus one or two ancestral tongues. Your **Background** and **Discipline** may add more. Additional languages can be acquired through downtime training: a month of immersion, a patient teacher, or the right book.\n\n**Secret languages cannot be self-taught.** Druidic must be passed from druid to druid. Thieves' Cant is earned through the criminal underworld, not a library.`
            },
            {
              title: 'Using Languages',
              content: `Knowing a language means you can **speak, read, and write** in it — unless it has no written form (some elemental and secret languages are oral-only, their knowledge dying with their speakers). In play, languages unlock NPC dialogue, allow you to decipher ancient inscriptions, communicate with creatures who share no other tongue, and — critically — speak privately in a room full of enemies. The GM may call for a check when ancient dialects or degraded texts are involved.`
            }
          ]
        }
      },
      {
        id: 'simplified-skills',
        name: 'Simplified Skills (Quick Play)',
        icon: 'fas fa-dice-four',
        theme: 'mechanic',
        summary: [
          'An alternative, streamlined skill system for fast-paced or tabletop play.',
          'Skills use a fixed die size (default d4) that upgrades through extraordinary actions.',
          'Low DCs, exploding dice, and manual rank switching give players full control.'
        ],
        content: {
          title: 'Simplified Skills — Quick Play & Tabletop Mode',
          description: 'For groups who prefer a fast, tangible skill system without deep mechanics. Perfect for new players, one-shots, or people playing around a physical table using the VTT as a lightweight companion.',
          sections: [
            {
              title: 'The Core Idea — Your Skill Die',
              content: `In the simplified system, every skill is represented by a single die size — written directly on your character sheet as a number: **4** for a d4, **6** for a d6, **8** for a d8, and so on.\n\n• **Default Die**: Every character starts with a d4 (written as "4") in all skills. This is your baseline — you can always attempt anything.\n• **Starting Upgrades**: Your race, background, and discipline choices during character creation may grant you a higher starting die in certain skills. A hardy Hrym might start with a d8 in Athletics. A silver-tongued Neth might begin with a d6 in Persuasion.\n• **Organic Advancement**: When you do something extraordinary that showcases genuine learning or creative application of a skill, the GM — or the table consensus — may award you a die upgrade. Your d8 Athletics might become a d10 after you successfully scale a sheer cliff in a blizzard to save a fallen ally.\n• **Manual Switching**: You can change your skill die at any time from your character sheet's Skills tab. The dropdown on each skill lets you set it from d4 through d20. This means advancement is a conversation, not a calculation.`
            },
            {
              title: 'Difficulty Classes (DCs) — Low & Friendly',
              content: `Unlike the full Mythrill Ladder of Trials (where the GM assigns a Difficulty Die you must beat), the simplified system uses fixed **Difficulty Classes** — simple target numbers you roll against.\n\n• **DC 2** — Trivial. Climbing a short ladder. Recalling a common historical fact. Lighting a campfire on dry kindling.\n• **DC 4** — Easy. Picking a rusty lock. Persuading a friendly NPC. Tracking a large creature through soft mud.\n• **DC 6** — Moderate. Climbing a rope with knots. Deceiving a suspicious guard. Identifying a rare herb.\n• **DC 8** — Challenging. Scaling a stone wall with handholds. Calming a frightened horse in a storm. Disarming a simple trap.\n• **DC 10** — Hard. Climbing a steep, icy mountainside. Convincing a hostile chieftain to parley. Performing surgery in the field.\n• **DC 12+** — Legendary. Tasks that border on the impossible — but not quite.\n\nDCs are deliberately low to encourage players to try things. The philosophy is simple: **failure should be dramatic, not punishing**. A character with a d4 (4) can still hit a DC 4 and a DC 6 with some luck — and exploding dice make even DC 10 reachable.`
            },
            {
              title: 'Exploding Dice — Rolling the Maximum',
              content: `**Rolling the maximum value on your die is NOT a critical success.** It is an **exploding roll** — you get to roll your die again and add the results together!\n\n• **Example**: You have a d8 (8) in Athletics and attempt to climb a steep mountain (DC 10). You roll an 8 — you roll again! Your second roll is a 5. Your total is **8 + 5 = 13**. Success!\n• **Exploding Stacks**: If your explosive roll is also the maximum, you keep exploding! A d4 that explodes three times (4 → 4 → 4 → 3) = 15. Even the humblest die can achieve legendary results.\n• **No Critical Failures on a 1**: Rolling a 1 simply means a 1. It is not a critical failure. The low DCs already make failure meaningful without adding punitive layers.\n• **No Critical Success on Max**: The explosion IS the reward — you get another roll. This keeps the tension alive: you never know if the explosion will be enough.`
            },
            {
              title: 'Success & Failure — GM Suggestions Only',
              content: `Every skill in the full Mythrill system includes **rollable tables** with colour-coded outcomes for each possible roll result. These are rich, narrative suggestions — but they are **suggestions only**.\n\nIn the simplified system, the rollable tables serve as inspiration:\n\n• **Bright Blue** — The GM might narrate an exceptional triumph with bonus effects.\n• **Teal/Green** — A clean success. You did the thing.\n• **Amber/Yellow** — Partial success. You succeed, but at a cost or with a complication.\n• **Red-Orange** — Failure. The attempt fails without catastrophic consequences.\n• **Dark Red** — Total failure. Something goes terribly wrong.\n\nThe GM always has final authority over what happens. The tables exist to spark ideas — ignore them freely when the story demands it.`
            },
            {
              title: 'Switching Between Systems',
              content: `The simplified and full skill systems coexist in the same VTT. Your skill rank (UNTRAINED through MASTER) still maps to a die size in the simplified view:\n\n• **UNTRAINED → d4 (4)**\n• **NOVICE → d6 (6)**\n• **TRAINED → d8 (8)**\n• **APPRENTICE → d10 (10)**\n• **ADEPT → d12 (12)**\n• **EXPERT → d20 (20)**\n• **MASTER → d20 (20)**\n\nYou can switch a skill's rank at any time from the Skills tab in your character sheet. This is stored in your character data and syncs with your party — so your GM always sees your current dice.\n\n**For Tabletop Players**: If you are using the VTT alongside a physical table, the simplified system is ideal. Your character sheet on screen shows your die sizes as plain numbers. The VTT chat log will show your rolls and results. You can use physical dice and type the results, or let the VTT handle everything digitally.`
            },
            {
              title: 'Quick Reference — Die Sizes & Probabilities',
              content: `To help you gauge your chances (with exploding dice factored in):\n\n• **d4 (4)**: Average ~3.3, 25% chance to explode. Can realistically hit DCs up to 6 with one explosion.\n• **d6 (6)**: Average ~4.2, 16.7% chance to explode. Can reliably handle DC 4-6.\n• **d8 (8)**: Average ~5.1, 12.5% chance to explode. Comfortable up to DC 8.\n• **d10 (10)**: Average ~6.1, 10% chance to explode. Handles DC 8-10 reliably.\n• **d12 (12)**: Average ~7.1, 8.3% chance to explode. Strong at DC 10.\n• **d20 (20)**: Average ~11.0, 5% chance to explode. Can tackle DC 12+.\n\nRemember: exploding dice mean even a d4 can theoretically reach any DC. The smaller dice actually explode *more often* — a d4 has a 25% chance to explode, while a d20 only has a 5% chance. This creates a beautiful tension: smaller dice are more volatile, larger dice are more consistent.`
            }
          ]
        }
      },
      {
        id: 'classes',
        name: 'Traditions of Power',
        icon: 'fas fa-hat-wizard',
        hasDetailPages: true,
        useCustomComponent: true,
        theme: 'combat',
        content: {
          title: 'Classes',
          description: '30 classes organized by thematic paths with unique resource systems. Click on a class name to view detailed information.',
          sections: [
            {
              title: 'Class System',
              content: `In Mythrill, your **Class** is your identity on the battlefield — the lens through which every combat encounter is viewed and every tactical decision is made. It determines your hit points, weapon proficiencies, armour capabilities, and the unique resource system that fuels your most powerful abilities. With **30 distinct classes** spanning roles from iron-clad tank to temporal manipulator to plague-gardening horror, no archetype is left unexplored. Click any class name in the table below to open its full detail page.`
            },
            {
              title: 'Resource Systems',
              content: `What separates a Berserker from a Spellguard isn't just what they carry — it's what they *fuel their power with*. Every class uses a unique resource system designed to reinforce its identity and create a distinct tactical rhythm. A **Berserker** builds Rage by being struck. A **Gambler** bends probability with Fortune Points. A **Deathcaller** sacrifices their own hit points for forbidden necrotic power. Understanding your resource loop is understanding how to play your class at its peak. See [Magic Resources](magic-system/magic-resources) for the full breakdown.`
            }
          ],
          tables: [
            {
              title: 'All Classes',
              description: 'Thirty unique classes, each with distinct roles, resource systems, and playstyles. Choose the path that calls to your character\'s soul.',
              headers: ['Class', 'Role', 'Resource', 'Playstyle'],
              clickableColumn: 0, // Make the first column (Class) clickable
              rows: [
                ['Arcanoneer', 'Damage/Utility', 'Sphere Generation & Combination', 'Master of elemental sphere combination with dynamic spell crafting'],
                ['Berserker', 'Damage', 'Rage Points', 'Fury warrior with momentum-based combat'],
                ['Bladedancer', 'Damage', 'Edge & Flourish', 'Finesse fighter with elegant combat techniques'],
                ['Chaos Weaver', 'Damage', 'Mayhem Modifiers', 'Master of unpredictability with highest damage potential'],
                ['Chronarch', 'Control', 'Temporal Energy', 'Time manipulator building temporal power'],
                ['Covenbane', 'Damage/Support', 'Anti-Magic Seals', 'Witch hunter with magic-disrupting abilities'],
                ['Deathcaller', 'Damage/Support', 'Necrotic Ascension', 'Blood mage sacrificing health for forbidden power'],
                ['Dreadnaught', 'Tank', 'Dark Resilience Points', 'Dark tank who converts damage taken into power'],
                ['Exorcist', 'Summoner/Controller', 'Divine Dominance', 'Divine agent binding demons through sacred ritual'],
                ['False Prophet', 'Control', 'Madness Points', 'Void preacher channeling madness as divine revelation'],
                ['Fate Weaver', 'Support/Control', 'Threads of Destiny', 'Card-based destiny manipulator turning failures into power'],
                ['Formbender', 'Hybrid (Tank/Damage/Support)', 'Wild Instinct', 'Shapeshifter mastering four primal forms with adaptive combat'],
                ['Gambler', 'Damage/Utility', 'Fortune Points', 'Daring risk-taker manipulating luck and probability'],
                ['Huntress', 'Damage', 'Quarry Marks', 'Tracker with precision targeting and pursuit'],
                ['Inscriptor', 'Control/Support', 'Runic Wrapping & Inscriptions', 'Tactical battlefield controller using runes and inscriptions'],
                ['Lichborne', 'Damage/Control', 'Eternal Frost Aura & Phylactery', 'Frost-wielding undead with life-draining aura and resurrection mechanics'],
                ['Lunarch', 'Support/Control', 'Lunar Charge', 'Lunar mage with phase-based energy cycles'],
                ['Martyr', 'Tank/Support', 'Devotion Gauge', 'Self-sacrificing warrior earning power through suffering'],
                ['Minstrel', 'Support', 'Harmonic Notes', 'Musical spellcaster with note combinations'],
                ['Oracle', 'Support/Control', 'Prophetic Vision', 'Seer with foresight and divination'],
                ['Plaguebringer', 'Damage/Control', 'Virulence', 'Plague gardener cultivating afflictions through 5 interchangeable categories; Virulence passively buffs as garden grows'],
                ['Primalist', 'Support/Control', 'Totemic Synergy', 'Totem master creating powerful synergies through sacred totems'],
                ['Pyrofiend', 'Damage', 'Inferno Veil', 'Fire-wielding demon with corruption stages'],
                ['Spellguard', 'Tank/Support', 'Ward Layers', 'Protective mage with magical shield systems'],
                ['Titan', 'Tank/Control', 'Strain Overload', 'Gravity manipulator with colossal strength'],
                ['Toxicologist', 'Damage/Control', 'Alchemical Vials', 'Poison crafter with chemical warfare'],
                ['Warden', 'Damage/Control', 'Vengeance Points', 'Relentless hunter with glaive combat and spectral cages'],
                ['Witch Doctor', 'Support/Control', 'Voodoo Essence & Loa Invocation', 'Voodoo practitioner invoking powerful gods through curses, rituals, and totems'],
                ['Augur', 'Control/Debuffer', 'Benediction & Malediction', 'Omen reader who interprets even/odd dice results to fuel blessings and curses, reshaping battlefield conditions'],
                ['Doomsayer', 'Damage/Control', 'Havoc & Prophecy Range', 'Prophet of catastrophe who places living bomb prophecies with RNG chaos outcomes, earning Havoc from fulfilled prophecies']
              ]
            }
          ]
        }
      },
      {
        id: 'races',
        name: 'Races',
        icon: 'fas fa-users',
        useCustomComponent: true, // Flag to use RaceSelector component
        theme: 'nature',
        content: {
          title: 'Races & Variants',
          description: 'Playable races with meaningful variants, cultural depth, and mechanical trade-offs',
          sections: [
            {
              title: 'Race System Overview',
              content: `Races represent your character's heritage and provide stat modifiers, racial traits, languages, and cultural background. Each race has multiple variants that offer different playstyles and mechanical options. All races are designed with meaningful trade-offs - powerful abilities come with significant drawbacks that create interesting tactical and roleplay decisions.`
            },
            {
              title: 'Choosing a Race',
              content: `When selecting a race, consider both the mechanical benefits and the cultural background. Each variant within a race offers different stat modifiers and abilities, allowing you to customize your character to fit your desired playstyle. Pay attention to the disadvantages as much as the advantages - they define your character as much as the strengths.`
            },
            {
              title: 'Variant Diversity',
              content: `Each race has 2-3 variants that represent different cultural groups, adaptations, or life paths within that race. Variants have distinct stat modifiers, racial traits, and sometimes different movement speeds or languages. Choose the variant that best fits your character concept and desired mechanical role.`
            },
            {
              title: 'Integration with Game Systems',
              content: `Racial traits interact with the Action Point system, background abilities, and class features. Many racial abilities cost AP to activate or provide tactical options during combat. Consider how your race's traits will synergize with your chosen background and class.`
            }
          ],
          tabs: [
            {
              id: 'hrym',
              name: 'Hrym',
              sections: [
                {
                  title: 'Overview',
                  content: `**Iron-willed descendants of the frozen northlands where winter never dies**

The Hrym are the hardy folk of the eternal winter lands, where the sun barely rises and survival depends on strength of arm and will. They are descended from ancient warrior-kings who carved kingdoms from ice and stone.

**Basic Information:**
- **Size:** Medium
- **Speed:** 30 feet
- **Lifespan:** 80-120 years
- **Languages:** Common, Old Nord, Runic
- **Variants:** 3 available (Berserker, Skald, Icewalker)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Hrym culture revolves around honor, strength, and the belief that a glorious death in battle ensures a place in the halls of their ancestors. They are natural warriors and leaders, though their pride and quick tempers often lead them into conflict with more diplomatic peoples.

Their society values:
- **Honor and Glory:** A warrior's reputation is everything
- **Strength of Will:** Mental fortitude is as important as physical power
- **Ancestral Traditions:** Ancient sagas and customs guide their lives
- **Battle Prowess:** Combat skill determines social standing`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Berserker Hrym** - Fierce warriors who embrace the fury of battle above all else
- Constitution +2, Strength +2, Agility -1, Intelligence -2, Spirit +1, Charisma -1
- Focus: Aggressive combat, rage mechanics, fearless warrior

**Skald Hrym** - Warrior-poets who preserve the ancient sagas and inspire others
- Constitution +1, Agility -1, Intelligence +1, Spirit +2, Charisma +1
- Focus: Support, inspiration, knowledge, balanced combat

**Icewalker Hrym** - Hardy survivors who have adapted to the harshest frozen wastes
- Constitution +3, Intelligence -1, Spirit +1, Charisma -2
- Focus: Extreme durability, cold mastery, environmental adaptation`
                },
                {
                  title: 'Integration with Game Systems',
                  content: `**Action Point System:** Many Hrym racial traits interact with the AP system, providing unique tactical options during combat and exploration. Berserker rage costs 1 AP, Skald inspiration costs 2 AP.

**Background Synergy:** Consider how your chosen variant's traits complement your background path. Berserkers pair well with Reaver backgrounds, Skalds with Mystic or Sentinel paths, and Icewalkers with survival-focused backgrounds.

**Class Compatibility:** While any variant can pursue any class, Berserkers excel as warriors, Skalds as support casters or bards, and Icewalkers as tanks. Choose your variant based on your intended build.

**Meaningful Trade-offs:** Each variant has both strengths and weaknesses. Berserkers gain incredible combat power but lose tactical flexibility. Skalds provide powerful support but can alert enemies. Icewalkers are nearly invincible in cold but vulnerable to heat.`
                }
              ],
              tables: [
                {
                  title: 'Berserker Hrym Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Frostborn', 'Environmental', 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. Can survive in arctic conditions without shelter, but breath creates visible frost making stealth difficult.'],
                    ['Battle Fury', 'Combat', 'When reduced to half hit points, enter berserker rage (1 AP). Gain +3 damage but take -3 to Armor and cannot cast spells for 1 minute. Once per long rest.'],
                    ['Reckless Courage', 'Combat', 'Immunity to fear effects, but retreating or avoiding a direct challenge requires a Spirit save using a challenging difficulty die (GM sets, usually d10). Bloodlust makes tactical withdrawal nearly impossible.']
                  ]
                },
                {
                  title: 'Skald Hrym Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Frostborn', 'Environmental', 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. Can survive in arctic conditions without shelter, but breath creates visible frost making stealth difficult.'],
                    ['Inspiring Saga', 'Support', 'Recite ancient sagas to inspire allies (2 AP). All allies within 30 feet gain advantage on their next attack or save. Once per short rest, but must speak loudly, potentially alerting enemies.'],
                    ['Ancestral Memory', 'Knowledge', 'Advantage on History checks and can recall ancient lore, but compelled to share stories at length, often at inappropriate times, giving disadvantage on stealth group checks.']
                  ]
                },
                {
                  title: 'Icewalker Hrym Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Deep Frost', 'Environmental', 'Immunity to cold damage and exhaustion from harsh weather. Can survive in arctic conditions indefinitely, but take vulnerability to fire damage and disadvantage on saves against heat effects.'],
                    ['Ice Walk', 'Mobility', 'Can walk on ice and snow without slipping and leave no tracks in frozen terrain. However, move at half speed on warm ground and take 1 damage per hour in temperatures above 70°F.'],
                    ['Frozen Heart', 'Mental', 'Advantage on saves against charm and emotion effects, but disadvantage on all Charisma-based social interactions due to cold, distant demeanor.']
                  ]
                }
              ]
            },
            {
              id: 'corvani',
              name: 'Corvani',
              sections: [
                {
                  title: 'Overview',
                  content: `**Raven-marked people from mist-shrouded highlands who walk between worlds**

The Corvani are a mysterious people marked by the raven, dwelling in the mist-shrouded highlands where the veil between worlds grows thin. They possess an uncanny connection to fate and the ethereal realm.

**Basic Information:**
- **Size:** Medium
- **Speed:** 30 feet (Scout: 35 feet)
- **Lifespan:** 90-110 years
- **Languages:** Common, Corvid
- **Variants:** 2 available (Oracle, Scout)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Corvani are born with raven-black markings that shift and change with their moods and destinies. They dwell in the mist-shrouded highlands where reality blurs and the future whispers through the fog. Their culture values prophecy, spirit, and the ability to navigate both the physical and spiritual worlds. They serve as messengers, seers, and guides between realms, though their gifts often come with a heavy price. The Corvani believe that fate is a tapestry they can glimpse but never fully control.`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Oracle Corvani** - Gifted seers who peer deep into fate's threads
- Strength -1, Agility +1, Intelligence +2, Spirit +3, Charisma +1
- Focus: Divination, prophecy, fate manipulation, support

**Scout Corvani** - Swift messengers navigating treacherous highland paths
- Constitution +1, Agility +3, Intelligence +1, Spirit +1
- Focus: Mobility, communication, mist walking, reconnaissance`
                }
              ],
              tables: [
                {
                  title: 'Oracle Corvani Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Prophetic Vision', 'Divination', 'Once per long rest, glimpse the future to reroll any d20 roll (yours or an ally\'s) within 60 feet.'],
                    ['Raven Sight', 'Perception', 'Can see through illusions and detect hidden creatures within 30 feet, but suffer -2 to Constitution saves against disease.'],
                    ['Fate\'s Warning', 'Protection', 'Allies within 30 feet gain +1 Armor against the first attack each round, but you take 1 psychic damage when they\'re hit.']
                  ]
                },
                {
                  title: 'Scout Corvani Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Highland Navigation', 'Movement', 'Cannot become lost in natural terrain and can move at full speed through difficult terrain.'],
                    ['Raven Messenger', 'Communication', 'Can send messages via ravens to any location you\'ve visited, but messages can be intercepted by those who speak Corvid.'],
                    ['Mist Walker', 'Defense', 'Can become partially incorporeal for 1 round (resistance to physical damage), but become vulnerable to radiant damage for 1 minute.']
                  ]
                }
              ]
            },
            {
              id: 'myrathil',
              name: 'Myrathil',
              sections: [
                {
                  title: 'Overview',
                  content: `**Free-born children of the sea who spawn from storm-foam**
              
The Myrathil are a rare amphibious people spawned from sea foam during three-day gales. They have no parents, no bloodline — the sea mother is their sole origin. Their bodies are built for the intertidal zone: lean frames, enormous ocean-blue eyes, translucent webbing between fingers that retracts on land, and vein-colors that shift with mood and weather.

**Basic Information:**
- **Size:** Medium
- **Speed:** 30 feet (Swim 30 feet)
- **Lifespan:** 140-200 years
- **Languages:** Common, Aquan
- **Variants:** Breakers-Born (shore), Deep-Born (open ocean), River-Fed (estuary)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Myrathil are shaped by the water that births them. The Breakers-Born spawn where waves meet shore — mediators, traders, the face the world sees. The Deep-Born spawn in open ocean — mystics and sea-herders who speak less and feel more. The River-Fed spawn in brackish estuaries — explorers who follow rivers inland and return with maps no other Myrathil could draw.

The Myrathil cannot truly rest without submersion in water. Their vein-colors betray their emotions, making them terrible liars but exceptional mediators. Land-folk romanticize them as exotic drifters and collect their sea-glass trinkets — the Myrathil tolerate this with the patience of a people who have watched civilizations rise and fall on shorelines they once called home.`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Breakers-Born** — Shore-spawned diplomats and traders
- Charisma +2, Agility +1, Constitution -1
- Focus: Social, negotiation, weather-sensing, emotional insight

**Deep-Born** — Open-ocean mystics and guardians
- Spirit +3, Constitution +1, Charisma -2
- Focus: Deep submersion, low-frequency communication, abyssal perception

**River-Fed** — Estuary explorers and inland scouts
- Agility +2, Intelligence +2, Spirit -1
- Focus: Freshwater adaptation, disguise, navigation, exploration`
                }
              ],
              tables: [
                {
                  title: 'Breakers-Born Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Born of Spindrift', 'Amphibious', 'Breathe air and water. Requires salt-water submersion for true rest. Swim 30ft.'],
                    ['Wake-Drawn', 'Utility', 'Advantage on Animal Handling with coastal/marine creatures. Shore animals are non-hostile.'],
                    ['Storm-Blooded', 'Detection', '+2 Initiative in storms. Sense weather 72 hours out. Always know direction to nearest major water.'],
                    ['Tide-Tongue', 'Social', '+1 Insight and Persuasion. Disadvantage on Deception — vein-colors betray emotion.']
                  ]
                },
                {
                  title: 'Deep-Born Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Born of Spindrift', 'Amphibious', 'Breathe air and water. Requires salt-water submersion for true rest. Swim 30ft.'],
                    ['Wake-Drawn', 'Utility', 'Advantage on Animal Handling with coastal/marine creatures. Shore animals are non-hostile.'],
                    ['Abyssal Adaptation', 'Defense', 'Darkvision 60ft underwater. 25% cold resistance submerged. Hold breath 30 minutes. -1 to checks per 12hrs on land.'],
                    ['The Deep Hum', 'Communication', 'Silent concept communication 120ft underwater. Active hum: allies +1 WIS/INT saves within 30ft.']
                  ]
                },
                {
                  title: 'River-Fed Traits',
                  headers: ['Trait', 'Type', 'Description'],
                  rows: [
                    ['Born of Spindrift', 'Amphibious', 'Breathe air and water. Rest in fresh OR salt water (unique among Myrathil). Swim 30ft.'],
                    ['Wake-Drawn', 'Utility', 'Advantage on Animal Handling with coastal/marine creatures. Shore animals are non-hostile.'],
                    ['Brackish Heritage', 'Adaptation', '25% poison resistance. +5ft movement along rivers. -1 Spirit when >50 miles from natural water.'],
                    ['Mask of the Estuary', 'Disguise', 'Suppress Myrathil features for 1hr (+2 Deception/Stealth to pass as non-Myrathil). Lose swim/water-breathing while active.']
                  ]
                }
              ]
            },
            {
              id: 'all-races',
              name: 'All Races',
              tables: [
                {
                  title: 'Complete Race List',
                  headers: ['Race', 'Description', 'Variants', 'Key Themes'],
                  rows: [
                    ['Hrym', 'Iron-willed descendants of frozen northlands', '3', 'Cold resistance, battle fury, honor'],
                    ['Corvani', 'Raven-marked people from mist-shrouded highlands', '2', 'Prophecy, perception, fate manipulation'],
                    ['Myrathil', 'Free-born sea children spawned from storm-foam', '3', 'Amphibious, weather-sensing, exploration, diplomacy'],
                    ['Veilborn', 'Pale folk from borderlands where reality grows thin', '2', 'Ethereal sight, spirit communication, planar travel'],
                    ['Mirrorkin', 'Shapeshifters who lost their original forms', '2', 'Shapeshifting, deception, identity crisis'],
                    ['Thornkin', 'Fae-touched beings bound by ancient pacts', '1', 'Fae bargains, nature magic, supernatural rules'],
                    ['Wildkin', 'Antlered forest dwellers bonded with wilderness', '1', 'Nature magic, grove bonds, primal power'],
                    ['Ashmark', 'Fire-touched people from volcanic wastelands', '3', 'Fire immunity, crafting, inner flames'],
                    ['Skinwalker', 'Cursed shamans wearing beast forms', '2', 'Transformation, tracking, beast nature'],
                    ['Graveworn', 'Undead warriors guarding ancient treasures', '2', 'Undead resilience, immortality, obsessive duty']
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'combat-system',
    name: 'Combat System',
    icon: 'fas fa-fist-raised',
    description: 'Tactical combat with AP management and streamlined mechanics',
    subcategories: [
      {
        id: 'combat-basics',
        name: 'Combat Basics',
        icon: 'fas fa-shield-alt',
        theme: 'combat',
        quickFacts: [{icon:'fas fa-bolt',label:'AP Per Turn',value:'3 AP'},{icon:'fas fa-sort-numeric-down',label:'Initiative',value:'1d20 + AGI mod'},{icon:'fas fa-fist-raised',label:'Attack',value:'2 AP'},{icon:'fas fa-walking',label:'Move',value:'1 AP'}],
        summary: ['3 AP per turn to spend on actions with ultimate strategic freedom', 'Initiative = 1d20 + Agility modifier to claim early position', 'No bonus actions: spend your AP pool exactly as you choose'],
        content: {
          title: 'Combat Basics',
          description: 'Rounds, turns, initiative, and Action Points',
          sections: [
            {
              title: 'Combat Structure',
              content: `Violent encounters in Mythrill are resolved through a dynamic, high-stakes combat structure. Combat is divided into rounds, each representing roughly six seconds of split-second decisions and clashing iron. Rather than using rigid movement or traditional 'bonus actions' that bog down tactical flow, every combatant operates within a fluid, singular action economy fueled by Action Points (AP). During your turn, you are free to spend your AP in any sequence—moving, striking, casting, or parrying—creating an incredibly dynamic and cinematic flow of battle where you are in complete control of your character's combat cadence.`
            },
            {
              title: 'Initiative',
              content: `When blood is spilled and blades are drawn, the order of battle is decided by split-second reflexes. Every participant rolls Initiative (1d20 + Agility modifier) to place themselves on the turn sequence. High results act first, seizing the tactical advantage, while ties are broken by looking at the highest absolute Agility score. A high initiative allows a combatant to position themselves, lock down choke points, or cast pre-emptive warding runes before the enemy can react.`
            },
            {
              title: 'Action Points (AP)',
              content: `The cornerstone of Mythrill's tactical combat is the Action Point (AP) system. Every character has a pool of **3 AP** that completely refreshes at the start of their turn. There are no 'Bonus Actions' or separate movement pools; every action you take—from swinging a giant claymore to drinking a potion or stepping through a burning field—costs a specific amount of AP. This provides ultimate freedom: you can spend 2 AP to strike and 1 AP to move, or 1 AP to move, 1 AP to defend, and 1 AP to use an item. AP management is the difference between life and death in Mythrill.`
            }
          ],
          tables: [
            {
              title: 'Combat Actions',
              description: 'The fundamental actions available in combat. Each action costs Action Points—manage your AP wisely to maximize your effectiveness.',
              headers: ['Action', 'Type', 'Description', 'Cost'],
              rows: [
                ['Attack (Unarmed)', 'A', 'Attack with your fists or improvised weapons. Damage and properties depend on your currently equipped weapon. Roll your weapon die - a 1 is a miss (roll again to check for critical miss), maximum value is a critical hit, any other result hits and deals damage equal to the roll plus your attribute modifier.', '2 AP'],
                [{ spellId: 'universal_move' }, 'A', 'Move up to your movement speed (typically 30 feet). This movement can be broken up between other actions.', '1 AP'],
                [{ spellId: 'universal_disengage' }, 'A', 'Move away from enemies without provoking opportunity attacks. You can move up to your full movement speed while maintaining your defensive stance.', '1 AP'],
                [{ spellId: 'universal_use_item' }, 'A', 'Draw, stow, or use an item in your inventory.', '1 AP'],
                [{ spellId: 'universal_hide' }, 'A', 'Make a Stealth check to hide from enemies.', '1 AP'],
                [{ spellId: 'universal_help' }, 'A', 'Assist an ally with a task, giving them advantage on their next check.', '1 AP'],
                [{ spellId: 'universal_ready_action' }, 'A', 'Prepare to take an action in response to a specific trigger.', '1 AP (+ action cost)']
              ]
            }
          ]
        }
      },
      {
        id: 'attacks-damage',
        name: 'Attacks & Damage',
        icon: 'fas fa-crosshairs',
        theme: 'combat',
        summary: ['Unified attack/damage roll using weapon die', 'Armor gives passive DR = Armor / 10', 'Defend action rolls a soak die for extra reduction'],
        content: {
          title: 'Attacks & Damage',
          description: 'Unified attack/damage rolls, armor absorption, critical system',
          sections: [
            {
              title: 'Attack Resolution',
              content: `Mythrill features a revolutionary **Unified Strike & Damage Roll** that completely removes the double-rolling slow-downs of traditional d20-based systems. In conventional systems, you must roll once to hit (often slowing down play with complex calculations against static AC targets) and then roll a second time to determine damage. Mythrill collapses this into a single, high-stakes moment: when you spend AP to make a weapon strike (typically 2 AP), you roll the weapon's designated damage die (e.g., 1d8 for a longsword, 1d12 for a brutal greataxe, or 1d6 for a swift dagger) exactly once to resolve both accuracy and raw force:

1. **The Critical Fumble (1)**: If the weapon die lands on a **1**, the attack misses catastrophically. The GM will call for a secondary check on the [Difficulty Dice Ladder](core-rules/dice-system) to determine the severe consequences—such as overextending and exposing yourself, dropping the weapon, or striking a stone wall that deals direct structural damage to your gear. Details on how gear decays can be found in [Durability & Repair](core-rules/durability-repair).
2. **The Decisive Hit (2 to Max-1)**: Any roll between 2 and one less than the die's maximum value represents a successful strike. The damage dealt is immediately equal to the value shown on the die plus your corresponding attribute modifier—specifically Strength (STR) for heavy melee blows, or Agility (AGI) for precise ranged shots. To learn how these modifiers are calculated from your core attributes, see the [Six Pillars of Mortality](core-rules/character-statistics).
3. **The Sovereign Critical Hit (Max Value)**: If the die lands on its **maximum value** (e.g., an 8 on a d8, or a 12 on a d12), you unleash a critical hit. The die immediately "explodes," allowing you to roll another damage die of the same type and add it to the total, alongside triggering lethal weapon-specific properties (like bleeding, sundering, or stunning).

This unified flow makes every single weapon swing incredibly fast-paced, keeping combat visceral, lethal, and tactically fluid.`
            },
            {
              title: 'Armor & Defense',
              content: `In Mythrill, defending yourself is not a static state. Armor protects you through two highly tactical layers:

• **Passive Damage Reduction (DR)**: Your armor constantly absorbs physical trauma without any manual bookkeeping. You receive passive damage reduction equal to your **Armor Score ÷ 10** (rounded down). For instance, a knight wearing thick plate with an Armor Score of 24 has a permanent Passive DR of 2, subtracting 2 damage from every single incoming attack.
• **Active Soak Die (Defending)**: If you anticipate a devastating blow, you can spend AP to take the **Defend** action. When doing so, you roll an active **Soak Die** determined by your armor class (ranging from a d4 for light leather up to a d10 or d12 for masterwork heavy plate). The result rolled on the soak die is immediately subtracted from the incoming damage alongside your Passive DR, allowing you to shrug off even giant-sized strikes.`
            }
          ],
          tables: [
            {
              title: 'Passive Damage Reduction Examples',
              description: 'Your armor provides constant protection, automatically reducing incoming damage. Higher armor means better passive defense.',
              headers: ['Armor', 'Passive DR (Armor ÷ 10, floor)'],
              rows: [
                ['7', '0'],
                ['14', '1'],
                ['22', '2'],
                ['38', '3'],
                ['77', '7']
              ]
            },
            {
              title: 'Soak Die Scale (Defend Action)',
              description: 'When you take the Defend action, roll a soak die based on your armor to reduce damage. Better armor means better defensive rolls.',
              headers: ['Armor', 'Soak Die'],
              rows: [
                ['0–4', '—'],
                ['5–9', '1d4'],
                ['10–14', '1d6'],
                ['15–19', '1d8'],
                ['20–24', '1d10'],
                ['25–29', '1d12'],
                ['30–34', '1d12 + 1d4'],
                ['35–39', '1d12 + 1d6'],
                ['40–44', '2d12'],
                ['45–49', '2d12 + 1d4']
              ]
            }
          ]
        }
      },
      {
        id: 'critical-hits',
        name: 'Critical Hits',
        icon: 'fas fa-burst',
        theme: 'combat',
        summary: ['Max die value = critical hit with weapon-specific effects', 'Rolling 1 then another 1 = critical miss', 'Slashing bleeds, Piercing pierces armor, Bludgeoning stuns'],
        content: {
          title: 'Critical Hits',
          description: 'Weapon-specific effects, exploding dice, and miss consequences',
          sections: [
            {
              title: 'Critical Hit System',
              content: `Every swing carries the weight of fate. In Mythrill, the highest and lowest rolls on your weapon die are not just numbers — they reshape the battlefield in an instant.\n\n**Critical Hit** (max die value): You strike with devastating precision. Deal maximum damage plus your attribute modifier, and the die **explodes** — roll it again and add the result. This chain continues as long as you keep rolling the maximum face.\n\n**Exploding Dice**: Any time a die lands on its maximum during an explosion, roll again and keep adding. Even a humble d4 dagger can cascade into lethal territory.\n\n**Critical Miss** (natural 1 followed by another 1): The worst kind of luck. Your attack goes catastrophically wrong — roll on the Miss Consequences table below and find out the cost.`
            },
            {
              title: 'Weapon-Specific Critical Effects',
              content: `A critical hit does not merely deal more damage — the *nature* of the weapon determines how the body breaks. Choose your weapon with intent.\n\n• **Slashing** — Open wounds that refuse to close: the target **Bleeds** for **1d4 damage per round** over **1d4 rounds**.\n• **Piercing** — The blade finds the gap in the armour: **reduce the target's passive DR by 2** (minimum 0) for **1d4 rounds**.\n• **Bludgeoning** — Concussive force that rattles bone and brain: the target is **Stunned for 1 round** (Constitution save against a moderate die — typically d8 — negates).\n• **Ranged** — The shaft pins cloth or flesh: the target's **movement is halved** for **1d4 rounds**.`
            }
          ],
          tables: [
            {
              title: 'Miss Consequences',
              description: 'When fate turns against you and you roll a critical miss, roll on this table to determine the consequence. Even failure tells a story.',
              headers: ['Roll', 'Consequence'],
              rows: [
                ['1', 'Catastrophic Failure: Weapon breaks/malfunctions (1 AP + quick Agility check with a moderate difficulty die—typically d8—to fix)'],
                ['2', 'Self-Inflicted Wound: Take 1d4 damage + Bleeding for 1d4 rounds'],
                ['3', 'Overextension: Fall prone, end movement for this turn'],
                ['4', 'Tactical Blunder: Next attack against you has advantage'],
                ['5', 'Fumble: Drop weapon at your feet'],
                ['6', 'Distraction: Lose 1 AP from your next turn'],
                ['7', 'Off-Balance: Movement speed halved on next turn'],
                ['8', 'Exposed: Passive DR reduced by 2 until next turn'],
                ['9', 'Demoralized: Disadvantage on next saving throw'],
                ['10', 'Simple Miss: No additional consequence']
              ]
            }
          ]
        }
      },
      {
        id: 'damage-modifiers',
        name: 'Damage Modifiers',
        icon: 'fas fa-fire',
        theme: 'combat',
        summary: ['Three tiers of increase: Susceptible, Exposed, Vulnerable', 'Three tiers of reduction: Guarded, Resistant, Immune', 'Three tiers of conversion: Leech, Absorb, Invert'],
        content: {
          title: 'Damage Modifiers',
          description: 'Standardized tiers for damage increase, reduction, and conversion',
          sections: [
            {
              title: 'Damage Modifier System',
              content: `Not all flesh yields equally. A skeletal undead laughs at a piercing blade but shatters under a blessed mace. A fire demon scoffs at flame but screams at cold iron. These truths are encoded in Mythrill's damage modifier system — a tiered framework that determines exactly how much punishment lands.\n\nModifiers always resolve in this fixed sequence:\n\n1. **Base Damage** — Roll dice and add attribute modifiers.\n2. **Armour Reduction** — Subtract passive DR (Armour ÷ 10) and any active Defend soak result.\n3. **Damage Modifiers** — Apply vulnerability or resistance tiers (see tables below).\n4. **Conversion Effects** — Apply any Leech, Absorb, or Invert effects.\n5. **Final Damage** — Deliver what remains to the target.`
            }
          ],
          tables: [
            {
              title: 'Damage Increase Tiers',
              description: 'When targets are vulnerable, your attacks strike harder. These modifiers multiply damage, making weaknesses devastating.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Susceptible', '25% more damage', '×1.25 (round up)', '13 damage'],
                ['Exposed', '50% more damage', '×1.5 (round up)', '15 damage'],
                ['Vulnerable', '100% more damage', '×2', '20 damage']
              ]
            },
            {
              title: 'Damage Reduction Tiers',
              description: 'Resistance and immunity reduce incoming harm. These modifiers protect you from damage types you\'re prepared to face.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Guarded', '25% less damage', '×0.75 (round down)', '7 damage'],
                ['Resistant', '50% less damage', '×0.5 (round down)', '5 damage'],
                ['Immune', 'No damage', '×0', '0 damage']
              ]
            },
            {
              title: 'Damage Conversion Tiers',
              description: 'Some abilities turn harm into healing. These powerful modifiers let you absorb damage and convert it to life force.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Leech', '25% heals attacker', '×0.25 (round up)', '3 healing'],
                ['Absorb', '50% heals attacker', '×0.5 (round up)', '5 healing'],
                ['Invert', '100% heals attacker', '×1', '10 healing']
              ]
            }
          ]
        }
      },
      {
        id: 'death-dying',
        name: 'Death & Dying',
        icon: 'fas fa-skull',
        theme: 'danger',
        summary: ['At 0 HP you enter the Dying state with a limited 1 AP pool', 'Dying characters can still make desperate crawling or potion actions', 'Three death save successes stabilize; three failures = death'],
        content: {
          title: 'Death & Dying',
          description: 'Dying condition with limited actions and exhaustion accumulation',
          tabs: [
            {
              id: 'dying-rules',
              name: 'Dying Rules',
              sections: [
                {
                  title: 'Dying Condition',
                  content: `Reaching 0 Hit Points in Mythrill does not immediately plunge your mind into absolute darkness. Instead, you enter a desperate, high-stakes struggle for survival known as the **Dying Condition**. While you are bleeding out and fighting to retain consciousness, you are brought to your knees, severely weakened but still possessing a spark of agency. During this state, your turn's Action Point pool is reduced to a singular **1 AP**. This precious point allows you to make desperate, conscious dying maneuvers—such as crawling 5 feet toward safety, trembling as you retrieve and swallow a healing potion, or gasping out final instructions to your allies. At the start of each of your turns, you must roll a Death Saving Throw to see if your flame of life flickers out. If you suffer further damage while dying, or accumulate 6 levels of exhaustion, your journey ends permanently.`
                },
                {
                  title: 'Death Saving Throws',
                  content: `At the start of each of your turns while Dying, roll **1d20**.\n\n• **10 or higher** — Success.\n• **9 or lower** — Failure.\n• **Three successes** — You stabilise.\n• **Three failures** — You die.\n• **Natural 20** — You immediately return to **1 HP**.\n• **Natural 1** — Counts as **two failures** at once.\n\nSuccesses and failures do not need to be consecutive — they accumulate until the threshold is reached. Any healing received while Dying immediately ends the death save sequence.`
                },
                {
                  title: 'System Shock',
                  content: `A single catastrophic strike can break a warrior's body without breaking their hit point total. When you take damage equal to or greater than **half your maximum HP** from a single source, make a **Constitution save** (easy die, typically d6). On a failure, your body reels from the trauma — you immediately gain **1 level of exhaustion**. This applies even if you are in full health.`
                },
                {
                  title: 'Massive Damage',
                  content: `Some blows are simply meant to kill. When you take damage equal to or greater than your **maximum HP** from a single source, make a **Constitution save** (difficult die, typically d12; the GM may escalate to d20 for truly apocalyptic strikes). On a **failure**, you die **instantly** — regardless of current hit points. On a **success**, you drop to 0 HP and enter the Dying state normally. This is the rule that makes legendary monsters terrifying.`
                }
              ]
            },
            {
              id: 'injuries',
              name: 'Injuries',
              sections: [
                {
                  title: 'Lingering Injuries',
                  content: `The body remembers what the spirit tries to forget. When you suffer a critical hit, or fail a death saving throw badly (by 5 or more), you may carry a **Lingering Injury** — a permanent mechanical scar that healing potions cannot touch. Roll on the Injury Table. Only powerful magic or extended downtime recovery can mend what the battlefield breaks.`
                }
              ],
              tables: [
                {
                  title: 'Injury Table',
                  headers: ['d20', 'Injury', 'Effect'],
                  rowsPerPage: 18,
                  rows: [
                    ['1', 'Lose an Eye', 'Disadvantage on Perception checks and ranged attacks'],
                    ['2-3', 'Lose an Arm/Hand', 'Can only hold one item, disadvantage on two-handed activities'],
                    ['4-5', 'Lose a Foot/Leg', 'Speed reduced by 5 feet, disadvantage on Athletics checks'],
                    ['6-7', 'Limp', 'Speed reduced by 5 feet'],
                    ['8-10', 'Internal Injury', 'Maximum hit points reduced by 1d4 until healed'],
                    ['11-13', 'Broken Ribs', 'Disadvantage on Constitution saving throws'],
                    ['14-16', 'Horrible Scar', 'Disadvantage on Persuasion checks, advantage on Intimidation'],
                    ['17-18', 'Festering Wound', 'Hit point maximum reduced by 1 each day until healed'],
                    ['19-20', 'Minor Scar', 'No mechanical effect, but a permanent reminder']
                  ]
                }
              ]
            },
            {
              id: 'exhaustion',
              name: 'Exhaustion',
              sections: [
                {
                  title: 'Exhaustion',
                  content: `Exhaustion is the slow erosion of a hero's capability under sustained pressure. It accumulates through environmental hazards, missed sleep, forced marches, starvation, and the brutal cost of fighting at 0 HP. Each level stacks its penalty on top of the last — at six levels, the body simply gives out.\n\nExhaustion cannot be ignored. It compounds across combat, rest, and skill checks, and a character with three or more levels is severely compromised. Exhaustion is reduced by one level per completed long rest.`
                }
              ],
              tables: [
                {
                  title: 'Exhaustion Levels',
                  rowsPerPage: 3,
                  headers: ['Level', 'Effect'],
                  rows: [
                    ['1', 'Disadvantage on ability checks'],
                    ['2', 'Speed halved'],
                    ['3', 'Disadvantage on attack rolls and saving throws'],
                    ['4', 'HP maximum halved'],
                    ['5', 'Speed reduced to 0'],
                    ['6', 'Death']
                  ]
                }
              ]
            },
            {
              id: 'soul-fragments',
              name: 'Soul Fragments & Soulmonger',
              sections: [
                {
                  title: 'When to Use',
                  content: `The Soulmonger system is a **GM-enabled module** for campaigns where death carries true cosmic weight. In worlds where dark powers trade in souls and resurrection is never guaranteed, this system transforms dying from a temporary setback into a genuine reckoning. Enable it when your table wants that weight — when death should mean something.`
                },
                {
                  title: 'Soul Fragments',
                  content: `Death in Mythrill does not guarantee a clean end. A soul does not simply ascend — it **shatters**. In the moments after a character falls, their essence fractures into fragments that bleed into the material plane. These fragments are finite, perishable, and essential for resurrection. Allies who want their companion back have exactly **one minute** to collect them before they scatter beyond reach. The clock starts the moment the body hits the ground.`
                }
              ],
              tabs: [
                {
                  id: 'soul-basics',
                  name: 'Soul Fragments',
                  tables: [
                    {
                      title: 'Soul Fragment Mechanics',
                      headers: ['Aspect', 'Details'],
                      rows: [
                        ['Creation', 'Death shatters the soul into 1d6+3 fragments'],
                        ['Collection', 'Must be collected within 1 minute of death'],
                        ['Viability', 'Fragments remain viable for 7 days'],
                        ['Degradation', '5% cumulative daily chance of fragment loss'],
                        ['Requirement', 'Minimum 3 fragments needed for resurrection']
                      ]
                    },
                    {
                      title: 'Soul Anchor Types',
                      headers: ['Type', 'Preservation Duration', 'Resurrection difficulty shift', 'Rarity'],
                      rows: [
                        ['Minor Anchor', '14 days', 'No change', 'Uncommon'],
                        ['Major Anchor', '30 days', '-2', 'Rare'],
                        ['Greater Anchor', 'Indefinite', '-5', 'Very Rare'],
                        ['Soul Phylactery', 'Indefinite', 'Automatic success', 'Legendary']
                      ]
                    }
                  ]
                },
                {
                  id: 'soulmonger-services',
                  name: 'Soulmonger Services',
                  sections: [
                    {
                      title: 'The Soulmonger',
                      content: `In Mythrill, a mysterious force known as the **Soulmonger** governs what happens to souls when they linger between death and resurrection. Soulmongers are entities — dealers, collectors, arbiters — who traffic in the raw material of existence. They offer services to those desperate or wealthy enough to pay.\n\n**Withered Essence** is the currency of this trade. Souls can be converted into Withered Essence at a rate of 1 Soul = 1,000 Essence. This Essence purchases services that range from removing exhaustion to buying a complete level — or resurrecting someone whose fragments are otherwise lost.\n\n**Warning**: Every transaction with a Soulmonger is a pact. The use of souls is irreversible, and the weight of that choice echoes forward through the campaign. These are not vendors — they are creditors.`
                    }
                  ],
                  tables: [
                    {
                      title: 'Soulmonger Services (1 Soul = 1,000 Withered Essence)',
                      headers: ['Service', 'Cost', 'Effect'],
                      rowsPerPage: 12,
                      rows: [
                        ['Level Up', 'Level × 1 Soul', 'Character gains one level'],
                        ['Minor Healing', 'Level × 150 Essence', 'Remove 1 level of exhaustion (1/day)'],
                        ['Major Healing', 'Level × 500 Essence', 'Remove 3 levels of exhaustion (1/day)'],
                        ['Full Healing', 'Level × 900 Essence', 'Remove 5 levels of exhaustion (1/day)'],
                        ['Enchantment', 'Level × 1 Soul', 'Add magical properties to equipment'],
                        ['Resurrection', 'Level × 10 Souls', 'Resurrect a character who failed normal resurrection']
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'resurrection',
              name: 'Resurrection',
              description: `**Resurrection Methods:** Different spells have varying requirements for resurrection. The more powerful the spell, the more soul fragments required and the longer the time window.

**Resurrection Challenges:** Resurrection is not guaranteed and comes with challenges. The ritual requires special components, takes time to perform, and may fail entirely.`,
              tables: [
                {
                  title: 'Spell Requirements',
                  headers: ['Spell', 'Time Limit', 'Fragments Required', 'Special Notes'],
                  rows: [
                    ['Revivify', 'Within 1 minute', '1 fragment', 'Quick resurrection'],
                    ['Raise Dead', 'Within 7 days', '3 fragments', 'Standard resurrection'],
                    ['Resurrection', 'Within 100 years', '5 fragments', 'Powerful restoration'],
                    ['True Resurrection', 'Any time', '7 fragments', 'Perfect restoration'],
                    ['Reincarnation', 'Within 7 days', '3 fragments', 'New body, same soul']
                  ]
                },
                {
                  title: 'Challenge Details',
                  headers: ['Aspect', 'Requirement'],
                  rows: [
                    ['Resurrection Difficulty', 'Base difficulty die is d10; shift the die one size harder for each previous resurrection and for each day since death'],
                    ['Ritual Components', 'Special components worth at least 500 gp'],
                    ['Ritual Duration', 'Takes 1 hour to perform'],
                    ['Failed Resurrection', 'Consumes the soul fragments but fails to restore life'],
                    ['Soul Anchors', 'Special items that can improve resurrection chances']
                  ]
                }
              ]
            },
            {
              id: 'resurrection-consequences',
              name: 'Resurrection Consequences',
              sections: [
                {
                  title: 'Post-Resurrection Effects',
                  content: `Nobody comes back from death unchanged. Crossing that threshold — being dragged back through it — leaves marks that cannot be healed at a campfire. The effects below are not punishment; they are narrative truth. The world should *feel* different when a character has walked through death and returned.`
                }
              ],
              tables: [
                {
                  title: 'Standard Resurrection Effects',
                  headers: ['Effect', 'Duration/Permanence'],
                  rows: [
                    ['Exhaustion: Return with 2 levels of exhaustion', 'Until rested'],
                    ['Mental Trauma: Suffer from nightmares or flashbacks for 1d6 days', 'Temporary'],
                    ['Death Memory: Retain fragmented memories of the afterlife', 'Permanent'],
                    ['Weakened Connection: Disadvantage on saves vs necromantic effects for 7 days', 'Temporary'],
                    ['Soul Scar: Each resurrection leaves a permanent mark on the soul', 'Permanent']
                  ]
                }
              ]
            },
            {
              id: 'devils-bargain',
              name: 'The Devil\'s Bargain',
              sections: [
                {
                  title: 'When Resurrection Fails',
                  content: `When the fragments are gone, when the ritual fails, when no healer remains — there is still one door left. It swings open from the other side, and something with cold eyes waits beyond it. A **Devil's Bargain** is not a happy ending. It is the option that exists when every other option has been exhausted. The price is always significant. The debt always comes due.`
                }
              ],
              tables: [
                {
                  title: 'Bargain Details',
                  headers: ['Aspect', 'Details'],
                  rows: [
                    ['Offer', 'The character\'s soul is offered a deal for resurrection'],
                    ['Price', 'The price is always significant—a task, sacrifice, or permanent change'],
                    ['Spirit Save', 'Upon resurrection, make a very hard Spirit save (use a difficult die such as d12, up to d20 for severe spiritual resistance)'],
                    ['Failure Consequence', 'On a failed save, roll on the "Resurrection Miracle" table'],
                    ['Soul Debt', 'The character now owes a debt that will come due at a critical moment']
                  ]
                }
              ]
            },
            {
              id: 'miracle-table',
              name: 'Resurrection Miracles',
              sections: [
                {
                  title: 'Resurrection Miracle Table',
                  content: `When a character fails their Spirit save after a Devil's Bargain, the dark forces that pulled them back leave their mark — permanent, indelible, and non-negotiable. Roll d20. Whatever comes up is what the character carries forward, forever. These are not debuffs. They are **scars with mechanical weight**.`
                }
              ],
              tables: [
                {
                  title: 'Resurrection Miracle Effects (d20)',
                  headers: ['Roll', 'Miracle Effect'],
                  rows: [
                    ['1', 'Empty. There is nothing left of you to be consumed. You, whatever that means, is gone now. You are a mindless thing. You must create a new character.'],
                    ['2', 'Decay\'s Caress. Your flesh begins to rot visibly, spreading a stench of death. Lose 3 from your CHA permanently.'],
                    ['3', 'Abyssal Clutch. Dark forces erode your essence, leeching away your vitality. Reduce two attributes of your choice by 3 each.'],
                    ['4', 'Death\'s Blessing. You have returned tougher, hardier. Add an extra +1d6 to your starting Base Position.'],
                    ['5', 'Tortured Bones. Your skeleton painfully reshapes itself, granting you a +2 Armor but reducing your Constitution by 2 due to constant pain.'],
                    ['6', 'Emptiness Within. Devoid of emotions and sensations, you traverse the world as a hollow shell, immune to fear and persuasion.'],
                    ['7', 'Ghastly Whispers. Unseen voices fill your head, distracting and terrifying. Suffer a -1 penalty to Spirit and have disadvantage on concentration checks.'],
                    ['8', 'Withering Strength. Your muscles deteriorate; permanently reduce your Strength by 2.'],
                    ['9', 'Numb Senses. You lose your sharp reflexes; reduce your Agility by 2.'],
                    ['10', 'Mind Erosion. Lose proficiency in one Intelligence-based skill of your choice as your intellect falters.'],
                    ['11', 'Bleak Existence. You find no comfort in food, drink, or rest. All recovery from rest is halved, and you cannot benefit from potions.'],
                    ['12', 'Echoes of the Void. You hear eerie, otherworldly sounds that distract and unsettle you, imposing disadvantage on Spirit checks.'],
                    ['13', 'Absent Minded. Your mind wanders, no longer able to focus on the things that you took joy in. Reduce your starting Intelligence score by -1.'],
                    ['14', 'Lingering Cold. Your body is unnaturally cold, causing pain and stiffness. Reduce your Speed by 10 feet and gain vulnerability to fire damage, but resistance to cold damage.'],
                    ['15', 'Spectral Chains. You feel as if invisible chains bind you, slowing your movements and sapping your strength. Reduce your Speed by 5 feet and your Strength score by 1.'],
                    ['16', 'Forgotten. Some memory, some fragile recollection of your past or current life has gone. Between you and the GM, decide what this memory is and what effect its loss has on you.'],
                    ['17', 'Gruesome Visage. Your appearance becomes horrifying to others, giving you advantage on Intimidation but disadvantage on all other Charisma checks.'],
                    ['18', 'Dulled Senses. You are slower to react to threats as they present themselves. Reduce your Initiative by -1.'],
                    ['19', 'Corrupted Blood. Your blood turns toxic, providing immunity to disease but causing you to take damage from healing spells and effects.'],
                    ['20', 'Miracle of the Grave. Perhaps you are less than you once were, but this time, upon returning to life, you feel alive. Gain +2 to any single attribute.']
                  ]
                }
              ]
            },
            {
              id: 'stabilization',
              name: 'Stabilization',
              sections: [
                {
                  title: 'Becoming Stable',
                  content: `Stabilisation is the razor-thin line between dying and dead. A character stabilises when they accumulate **three death save successes**, receive any healing, or an ally applies emergency care with a successful **Medicine check** (easy die, typically d6). Once stable at 0 HP, the death save clock stops — they remain conscious but helpless until healed enough to act.`
                }
              ]
            }
          ]
        }
      },
      {
        id: 'reactions',
        name: 'Reactions',
        icon: 'fas fa-bolt',
        theme: 'combat',
        summary: ['Reactions are special actions outside your turn', 'Cost AP and respond to specific triggers', 'Include dodge, parry, shield block, and more'],
        content: {
          title: 'Reactions',
          description: 'Special actions taken outside your turn in response to triggers',
          sections: [
            {
              title: 'Reaction Rules',
              content: `Combat never pauses for your turn. Arrows fly, spells erupt, and blades seek gaps in armour whether you are ready or not. **Reactions** are your ability to answer danger in real time — spending AP from your pool to act outside your normal turn order.\n\nA reaction requires a **specific trigger**: an incoming attack, an ally being targeted, an enemy breaking away. When that trigger fires, you choose to react or let it pass. You cannot spend AP you do not have remaining.`
            }
          ],
          tabs: [
            {
              id: 'defensive-reactions',
              name: 'Defensive Reactions',
              sections: [
                {
                  title: 'Defensive Options',
                  content: `When steel comes for you, you are not helpless. The following reactions let you turn an enemy's assault into a missed opportunity — or worse for them, their last mistake.`
                }
              ],
              tables: [
                {
                  title: 'Defensive Reactions',
                  headers: ['Action', 'Type', 'Description', 'Cost'],
                  rows: [
                    [{ spellId: 'universal_dodge' }, 'R', 'Makes it harder for attackers to hit you, increasing their miss chance (making rolls of 1-3 on a d8 miss, for example)', '2 AP'],
                    [{ spellId: 'universal_parry' }, 'R', 'Roll your weapon die vs. attacker\'s roll; if higher, negate the attack. Even smaller weapons can parry larger attacks through exploding dice', '1 AP'],
                    [{ spellId: 'universal_raise_shield' }, 'R', 'Roll a shield die (d8) to reduce additional damage before armor reduction is applied', '1 AP']
                  ]
                }
              ]
            },
            {
              id: 'standard-reactions',
              name: 'Standard Reactions',
              sections: [
                {
                  title: 'Available to All Characters',
                  content: `Every warrior, mage, and wanderer in Mythrill shares access to these battlefield responses. No class gate, no special training required. Mastering them separates survivors from casualties.`
                }
              ],
              tables: [
                {
                  title: 'Standard Reactions',
                  headers: ['Action', 'Type', 'Description & Roll', 'Cost'],
                  rows: [
                    [{ spellId: 'universal_help' }, 'R', 'Offer advice, gesture, or hint to grant ally 1d8 + to their next action. Applies if reasoning is accepted by the GM.', '1 AP'],
                    [{ spellId: 'universal_evade' }, 'R', 'Evade an attack, by rolling 5 ft. into a dodge. Has to be used when player is prompted by the GM. Performing this agile dodge roll, you also gain a better position (Current Level * 1)', '2 AP'],
                    [{ spellId: 'universal_opportunity_attack' }, 'R', 'React to enemy movement out of melee range with a quick strike. Roll your weapon die as normal, with a miss on 1 and crit on maximum value.', '1 AP'],
                    [{ spellId: 'universal_interpose' }, 'R', 'When an ally within 10 ft. is attacked, push them 5 ft. to safety and take the hit. Make a Strength save using an easy difficulty die (typically d6); on a miss the ally falls prone.', '1 AP (+1 AP for each 10 ft. added)'],
                    [{ spellId: 'universal_parry' }, 'R', 'Turn aside melee and ranged attacks. When attacked, roll your weapon die against the attacker\'s roll; if higher, negate the attack.', '1 AP'],
                    [{ spellId: 'universal_riposte', prefix: '{Parry} → ' }, 'R', 'After a successful parry, immediately counter-attack. Roll your weapon die as normal. This attack ignores the target\'s passive DR and any Defend soak.', '1 AP'],
                    [{ spellId: 'universal_raise_shield' }, 'R', 'Your shield absorbs the impact (roll a d8 to determine damage reduction before armor reduction). The shield\'s durability decreases by 1.', '1 AP'],
                    [{ spellId: 'universal_shield_bash', prefix: '{Raise Shield} → ' }, 'R', 'After successfully raising your shield, turn defense into offense. Make a STR vs. CON Save. If opponent fails, they are stunned until end of their next turn.', '1 AP'],
                    [{ spellId: 'universal_spell_reaction' }, 'R', 'Cast a reactive spell in response to an enemy action. Roll the spell\'s die as normal. Reactive spells often have special effects.', '2 AP']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'proficient-abilities',
        name: 'Proficient Abilities',
        icon: 'fas fa-star',
        theme: 'combat',
        summary: ['Only one proficient ability per turn regardless of AP', 'Powerful techniques tied to specific skill proficiencies', 'Range from grapples and counters to first aid and traps'],
        content: {
          title: 'Proficient Abilities',
          description: 'Special actions available to characters with specific skill proficiencies',
          sections: [
            {
              title: 'Usage Limitations',
              content: `Years of dedicated training unlock techniques that ordinary adventurers simply cannot replicate. **Proficient Abilities** are extraordinary actions gated behind specific skill proficiencies — a trained grappler can pin a knight three times their weight; a master of deception can shatter a target's focus at the worst possible moment.\n\nThe price of this power is discipline: **only one proficient ability can be used per turn**, regardless of your remaining AP. You have exactly one window to deploy your expertise. Choose it carefully.`
            }
          ],
          tables: [
            {
              title: 'Skill-Based Abilities',
              rowsPerPage: 6,
              headers: ['Skill', 'Unlocks', 'As', 'Note', 'Cost'],
              rows: [
                    ['Acrobatics', 'Charged Squat', 'A', 'Jump up to 10 ft. (Acrobatics vs mod die, fail = prone). Step the die up once to add 5 ft.', '1 AP'],
                    ['Animal Handling', 'Beast Command', 'A', 'Command your pet; start easy d6 and shift die based on pet Int/Spirit vs yours.', '?'],
                    ['Arcana', 'Arcane Counter', 'A', 'Hold a counterspell vs next hostile cast within 30 ft; Arcana vs mod die, step die per spell level.', '1 AP'],
                    ['Athletics', 'Grapple', 'A', 'Athletics vs target STR/AGI; on success they are restrained until your next turn.', '1 AP'],
                    ['Deception', 'Misdirect', 'A', 'Within 10 ft; opposed vs target Int-based die (easy d6 to hard d10). Fail = surprised (no reactions, disadv on attacks).', '1 AP'],
                    ['History', 'Lore Recall', 'A', 'Recall a creature’s tricks within 30 ft; start mod d8, step up for tougher CR.', '1 AP'],
                    ['Insight', 'Flow State', 'A', 'Reduce damage taken by 2 until your next turn; Insight vs mod d8.', '1 AP'],
                    ['Intimidation', 'Taunt', 'R', '15 ft; Intimidation vs Spirit save. Fail = must attack you until they pass.', '1 AP'],
                    ['Investigation', 'Deduct', 'A', 'Read a foe within 15 ft; Investigation vs mod d8, step up for higher CR.', '1 AP'],
                    ['Medicine', 'First Aid', 'A', '5 ft; easy d6. Stabilize to 1 HP (step die per exhaustion). Bandage once: heal 1d4 + Medicine mod.', '1 AP'],
                    ['Nature', 'Terrain Insight', 'A', 'Spot a terrain edge within 10 ft; Nature vs mod d8.', '1 AP'],
                    ['Perception', 'Heightened Senses', 'P', 'Gain +2 initiative.', '-'],
                    ['Performance', 'Mesmer', 'A', '15 ft; Performance vs Spirit save. Fail = lose next turn. Immune: eyeless, multiheaded, undead, celestials, fiends, fey, dragons, constructs. 1/use per combat.', '3 AP'],
                    ['Persuasion', 'Persuade', 'A', 'Persuasion vs Spirit save. Fail = confused (d10 table each turn; one save/turn).', '2 AP'],
                    ['Religion', 'Divine Favor', 'A', '15 ft; Religion vs Spirit/Int save. Roll d4 boon: temp HP, damage reduction, attack bonus, or save advantage. You always gain the boon; allies gain if they fail the save.', '2 AP'],
                    ['Sleight of Hand', 'Disarm', 'R', '5 ft; needs free hand. Sleight vs STR save to disarm and equip the weapon.', '1 AP'],
                    ['Stealth', 'Stealthy Passage', 'A', 'Move through a foe’s space without provoking; Stealth vs easy d6. On success move 15 ft.', '1 AP'],
                    ['Survival', 'Trapping', 'A', 'Set a trap in a 5-ft square within 5 ft; Survival starts d10 (step down with high INT). Pick: Pitfall (4 AP) 1d6/10 ft & restrains; Snare (3 AP) hoists, attacks adv; Tripwire (2 AP) prone, may drop items.', '1 AP']
              ]
            }
          ]
        }
      },
      {
        id: 'combat-conditions',
        name: 'Combat Conditions',
        icon: 'fas fa-exclamation-triangle',
        theme: 'combat',
        summary: ['Various states affecting characters in battle', 'Some conditions interact (e.g., Wet + Lightning)', 'Conditions can be inflicted by attacks, spells, or environment'],
        content: {
          title: 'Combat Conditions',
          description: 'Various states that can affect characters during battle',
          sections: [
            {
              title: 'Condition System',
              content: `The battlefield does not merely threaten hit points — it threatens the body and mind in a dozen ways. A soldier who is **Blinded** fights in absolute darkness. A warrior who is **Stunned** cannot act at all. A knight who is **Grappled** finds their footwork destroyed.\n\nConditions are inflicted by attacks, spells, traps, and the environment. They can stack in punishing combinations — a **Wet** target struck by lightning suffers far worse than a dry one. When a condition icon appears in the sidebar, consult this table immediately and adapt your tactics.`
            }
          ],
          tables: [
            {
              title: 'Common Conditions',
              headers: ['Condition', 'Effect'],
              rows: [
                ['Blinded', 'Cannot see, disadvantage on attacks, opponents have advantage against you'],
                ['Charmed', 'Cannot attack the charmer, charmer has advantage on social checks against you'],
                ['Deafened', 'Cannot hear, automatically fail checks requiring hearing'],
                ['Frightened', 'Disadvantage on ability checks and attacks while source of fear is visible, cannot willingly move closer to source'],
                ['Grappled', 'Speed becomes 0, condition ends if grappler is incapacitated or if target is forcibly moved away'],
                ['Incapacitated', 'Cannot take actions or reactions'],
                ['Invisible', 'Cannot be seen without special senses, advantage on attacks, attacks against you have disadvantage'],
                ['Paralyzed', 'Incapacitated, cannot move or speak, automatically fail STR and AGI saves, attacks against you have advantage and are critical hits if attacker is within 5 feet'],
                ['Petrified', 'Transformed into solid substance, incapacitated, unaware of surroundings, attacks against you have advantage, automatically fail STR and AGI saves, have resistance to all damage'],
                ['Poisoned', 'Disadvantage on attack rolls and ability checks'],
                ['Prone', 'Can only crawl, disadvantage on attack rolls, melee attacks against you have advantage, ranged attacks against you have disadvantage'],
                ['Restrained', 'Speed becomes 0, attacks against you have advantage, your attacks have disadvantage, disadvantage on Agility saves'],
                ['Stunned', 'Incapacitated, cannot move, automatically fail STR and AGI saves, attacks against you have advantage'],
                ['Unconscious', 'Incapacitated, cannot move or speak, unaware of surroundings, drop whatever you\'re holding, fall prone, automatically fail STR and AGI saves, attacks against you have advantage and are critical hits if attacker is within 5 feet']
              ]
            }
          ]
        }
      },
      {
        id: 'resting',
        name: 'Resting',
        icon: 'fas fa-bed',
        theme: 'narrative',
        summary: ['Short Rest (1 hour): spend Hit Dice or heal 1/4 max HP', 'Long Rest (8 hours): full HP, recover abilities', 'Optional settlement activities add downtime flavor'],
        content: {
          title: 'Rest & Recovery',
          description: 'Rest is not a luxury in Mythrill — it is a lifeline. Manage your recovery well, or watch exhaustion hollow out your capabilities one failed save at a time.',
          sections: [],
          tabs: [
            {
              id: 'core-rest',
              name: 'Core Rest & Recovery',
              sections: [
                {
                  title: 'The Solace of Rest',
                  content: `In the dark and dangerous world of Mythrill, survival is not merely a matter of clashing steel and swift casting; it requires knowing when to sheath the blade and stoke the campfire. Recovery is divided into two distinct disciplines: the swift, tactical **Short Rest** of one hour to bind wounds and catch one's breath, and the deep, restorative **Long Rest** of eight hours to heal fully, replenish magical reservoirs, and soothe the weary spirit. Without regular rest, characters face the slow, creeping doom of exhaustion, which steadily degrades their capabilities until they can no longer stand.`
                }
              ],
              tables: [
                {
                  title: 'Rest at a Glance',
                  description: 'Quick reference for the two core rest types.',
                  headers: ['Rest', 'Duration', 'Recovery', 'Resources', 'Exhaustion / Limit'],
                  rows: [
                    ['Short Rest', '1 hour (light activity)', 'Spend Hit Dice (die + CON) **or** heal 1/4 max HP', 'Some abilities; regain half mana/resources', 'No reduction / Multiple per day'],
                    ['Long Rest', '8 hours (6 sleep, 2 light)', 'Full HP; recover half Hit Dice (min 1)', 'Most abilities recharge', 'Reduce 1 level (needs food/water); 1 per 24h']
                  ]
                },
                {
                  title: 'Rest Risks',
                  description: 'When danger or interruptions apply.',
                  headers: ['Risk', 'Effect'],
                  rows: [
                    ['Interruption', 'If strenuous activity >1 hour (combat, casting, etc.), rest provides no benefit; restart.'],
                    ['Dangerous Areas', 'May require watches, have encounter chances, or be impossible without shelter.']
                  ]
                }
              ]
            },
            {
              id: 'settlement-activities',
              name: 'Settlement Activities',
              sections: [
                {
                  title: 'When to Use',
                  content: `When the party reaches a settlement — whether a walled city or a muddy frontier town — the options for recovery expand. These rules layer over the core rest system without replacing it, adding consequence and flavour to downtime without complicating the baseline math.`
                }
              ],
              tables: [
                {
                  title: 'Inn Quality Tiers',
                  description: 'Pick an inn quality, pay the rate, then roll recovery. Low tiers risk complications; lavish stays can grant boons. Use these tables when the group beds down in a settlement.',
                  headers: ['Inn Type', 'Cost', 'Recovery', 'Risk/Benefit'],
                  rows: [
                    ['Poor', '5cp/night', 'd4 recovery roll', 'Roll on Complications table on 1'],
                    ['Modest', '5sp/night', 'd8 recovery roll', 'Roll on Complications table on 1'],
                    ['Comfortable', '1gp/night', 'Reliable recovery', 'No complications'],
                    ['Lavish', '5gp/night', 'Roll on Boons table', 'Best recovery chance']
                  ]
                },
                {
                  title: 'Inn Complications',
                  description: 'If you roll a 1 on recovery at Poor/Modest/Comfortable, roll 2d6 here.',
                  headers: ['Roll', 'Result', 'Effect'],
                  rows: [
                    ['2', 'Major Theft', 'Lose all coins'],
                    ['3', 'Minor Theft', 'Lose half coins'],
                    ['4', 'Disease', 'Gain 1 level exhaustion'],
                    ['5', 'Pests', 'Replace supplies (1d20 gp)'],
                    ['6-8', 'Good Rest', 'No complications'],
                    ['9', 'Poor Sleep', 'No HP recovery'],
                    ['10', 'New Contact', 'Gain valuable contact'],
                    ['11', 'Information', 'Gain useful clue'],
                    ['12', 'Lucky', 'Gain temporary boon']
                  ]
                },
                {
                  title: 'Lavish Inn Boons',
                  description: 'At Lavish inns, after paying for the night, roll 1d6 on this table.',
                  headers: ['Roll', 'Boon', 'Effect'],
                  rows: [
                    ['1', 'Rejuvenation', 'Full HP recovery'],
                    ['2', 'Vitality', 'Temp HP equal to level'],
                    ['3', 'Refreshment', '+1 exhaustion recovery'],
                    ['4', 'Vigor', '+10 ft. movement today'],
                    ['5', 'Inspiration', 'Gain Inspiration'],
                    ['6', 'Restoration', '+2 exhaustion recovery']
                  ]
                }
              ]
            },
            {
              id: 'carousing-wassailing',
              name: 'Carousing & Wassailing',
              sections: [
                {
                  title: 'When to Use',
                  content: `Coin spent in a tavern buys more than ale. **Carousing** is how adventurers blow off steam between horrors — and how they make connections, enemies, and memorable mistakes. Use these rules whenever the party has gold to burn and a night to spend badly.`
                },
                {
                  title: 'Carousing',
                  content: `Pick your spend level from the table below — from a modest handful of silver to an extravagant night that would make a duke wince. Roll a d8 and add your quality bonus. The result describes what the morning brings.`
                }
              ],
              tables: [
                {
                  title: 'Carousing Costs',
                  description: 'Pick your spend level; apply its bonus to your d8 outcome roll.',
                  headers: ['Quality', 'Cost', 'Bonus to Roll'],
                  rows: [
                    ['Modest', '5 sp', '+0'],
                    ['Comfortable', '2 gp', '+1'],
                    ['Wealthy', '10 gp', '+2'],
                    ['Extravagant', '50 gp', '+3']
                  ]
                },
                {
                  title: 'Carousing Outcomes (Roll d8 + quality bonus)',
                  description: 'Roll after paying. Apply your quality bonus; higher spend pushes you up the table.',
                  headers: ['Roll', 'Outcome', 'Benefit', 'Complication'],
                  rows: [
                    ['1', 'Bar Fight', '+1 Intimidation for 1d4 days', 'Wake up in jail, pay 3d6 gp fine'],
                    ['2', 'Embarrassing Performance', 'Learn humorous local story', 'Disadvantage on social checks for 1d4 days'],
                    ['3', 'Gambling Loss', 'Make gambling contact', 'Lose additional 2d10 gp'],
                    ['4', 'Hangover', 'Overhear useful rumor', 'Disadvantage until next short rest'],
                    ['5', 'New Friend', 'Gain friendly NPC contact', 'They need 50 gp favor'],
                    ['6', 'Gambling Win', 'Win additional 2d10 gp', 'Sore loser holds grudge'],
                    ['7', 'Useful Information', 'Learn quest secret', 'Someone wants you silent'],
                    ['8-10', 'Memorable Night', 'Advantage on social checks for 1d4 days', 'Minor property damage (1d6 gp)'],
                    ['11+', 'Local Hero', '10% discount for 2d6 days', 'Rival becomes jealous']
                  ]
                },
                {
                  title: 'Wassailing Requirements & Benefits',
                  description: 'Seasonal house-to-house blessing; meet the requirements to gain these benefits.',
                  headers: ['Requirement/Benefit', 'Description'],
                  rows: [
                    ['Group Size', 'At least 3 participants'],
                    ['Preparation', 'Traditional song/blessing (Performance check)'],
                    ['Offering', 'Token gift (minimum 1 sp per location)'],
                    ['Visitations', 'At least 3 locations in one night'],
                    ['Community Favor', 'Advantage on social checks for 1d4 days'],
                    ['Seasonal Blessing', 'Cold resistance for 24 hours'],
                    ['Shared Prosperity', '1d6 sp per location visited'],
                    ['Ritual Magic', 'Increased yields for farms/orchards'],
                    ['Spirit Communion', 'Vision/message on nat 20 Performance']
                  ]
                }
              ]
            },
            {
              id: 'rest-quality',
              name: 'Rest Quality',
              sections: [
                {
                  title: 'Environmental Factors',
                  content: `A cold stone floor and the distant sound of wolves do not make for restful sleep. The quality of a long rest depends heavily on where and how it is taken. Comfort, shelter, and safety translate directly into recovery — or the painful absence of it.`
                }
              ],
              tables: [
                {
                  title: 'Rest Quality Modifiers',
                  headers: ['Condition', 'Effect on Rest'],
                  rows: [
                    ['Comfortable bed (inn)', '+1d4 temporary HP until next rest'],
                    ['Luxury accommodations', '+1d4 temporary HP, advantage on next saving throw'],
                    ['Bedroll in safe area', 'Normal rest'],
                    ['Sleeping on ground', '-1 to Hit Die healing'],
                    ['Extreme weather', 'Constitution save or gain exhaustion'],
                    ['Dangerous area', 'Interrupted rest on 1-2 on d6'],
                    ['No shelter in storm', 'No long rest benefit, gain exhaustion'],
                    ['Cursed location', 'No rest benefit, possible nightmares']
                  ]
                }
              ]
            },
            {
              id: 'rest-complications',
              name: 'Rest Complications',
              sections: [
                {
                  title: 'Interrupted Rest',
                  content: `A long rest interrupted by more than one hour of strenuous activity — combat, desperate flight, sustained spellcasting — provides no benefit. The body needs unbroken recovery time, not snatched moments between crises. When rest is interrupted, the full 8-hour clock must be restarted. On particularly dangerous nights, roll on the Complications table to discover what cut the sleep short.`
                }
              ],
              tables: [
                {
                  title: 'Rest Complications',
                  headers: ['d12', 'Complication', 'Effect'],
                  rows: [
                    ['1', 'Nightmares', 'No rest benefit, make Spirit save or gain exhaustion'],
                    ['2', 'Equipment stolen', 'Lose 1d4 non-magical items'],
                    ['3', 'Attacked by creatures', 'Combat encounter, rest interrupted'],
                    ['4', 'Bad weather', 'Constitution save or gain exhaustion'],
                    ['5', 'Illness', 'Constitution save or become poisoned for 24 hours'],
                    ['6', 'Disturbing discovery', 'Find something unsettling, Spirit save or be frightened'],
                    ['7', 'Lost', 'Navigation check required to continue journey'],
                    ['8', 'Equipment malfunction', 'One piece of equipment loses 1d4 durability'],
                    ['9', 'Restless sleep', 'Recover only half Hit Dice'],
                    ['10', 'Strange dreams', 'Gain cryptic information about future events'],
                    ['11', 'Peaceful rest', 'Gain inspiration'],
                    ['12', 'Prophetic vision', 'Gain advantage on next important decision']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'combat-tracker',
        name: 'The Combat Tracker (VTT)',
        icon: 'fas fa-list-ol',
        theme: 'combat',
        summary: [
          'The Combat Tracker automates turn order and initiative for players and creatures alike.',
          'Initiative is rolled directly from the character sheet and broadcasted to the VTT sidebar.',
          'Your Action Points (AP) and active status effects are tracked in real-time on your turn.'
        ],
        content: {
          title: 'The Combat Tracker',
          description: 'Understanding initiative, turn flow, and how the VTT sidebar manages active combat.',
          sections: [
            {
              title: 'Automating the Turn Sequence',
              content: `In the heat of battle, keeping track of who acts when, which spells are active, and how many rounds have passed can slow down the most exciting encounters. The **Combat Tracker** (located in the right-hand sidebar panel) completely automates this bookkeeping, letting the table focus on strategy and story.\n\nWhen a battle begins, the Game Master (GM) clicks the **Initiative Tracker** toggle to open the interface. The tracker displays a descending vertical list of all participants, clearly marking whose turn it is, who is next, and which round of combat is currently underway.`
            },
            {
              title: 'Rolling Initiative in the VTT',
              content: `To join the turn order, you must roll Initiative:\n\n• **Direct Sheet Integration**: Click the **Initiative** label or the d20 icon next to it in your Character HUD or full sheet. The VTT automatically rolls a d20, adds your Agility modifier, and sends the result to the chat log.\n• **Auto-Timeline Placement**: The VTT instantly adds your character token to the timeline in descending order of the roll. If there is a tie, the system automatically resolves it using your base Agility score.\n• **NPC Rolling**: The GM rolls initiative for all hostile and neutral creatures, adding them to the same tracker seamlessly.`
            },
            {
              title: 'Managing Your Turn & Action Points',
              content: `When the tracker reaches your name, several automated systems activate:\n\n• **Active Glow**: Your character portrait on the grid and in the sidebar glows, indicating it is your turn. The camera may automatically center on your token.\n• **AP Refreshes**: Your HUD shows your Action Point (AP) pool fully refreshed to **3 AP**.\n• **Condition Prompts**: Any ongoing effects (like Bleeding or Poisoned) will prompt a save or deal damage automatically at the start of your turn. See [Combat Conditions](combat-system/combat-conditions).\n• **Ending Your Turn**: Once you have spent your AP or choose to pass, click the **End Turn** button in the sidebar or HUD. The VTT shifts the active turn indicator to the next combatant, ensuring combat remains snappy.`
            }
          ],
          tables: [
            {
              title: 'Combat Tracker Quick Reference',
              description: 'VTT automation actions during combat.',
              headers: ['Action', 'How to Trigger', 'VTT Result'],
              rows: [
                ['Roll Initiative', 'Click Initiative on HUD / Sheet', 'Rolls 1d20 + AGI mod, places token on timeline'],
                ['Spend AP', 'Cast spell / Attack / Move token', 'HUD AP globes deplete in real time'],
                ['Check Status Effects', 'Hover over icons in sidebar', 'Shows condition duration and mechanical penalties'],
                ['End Turn', 'Click "End Turn" button in sidebar', 'Passes active turn to the next combatant on timeline'],
                ['Inspect Combatant', 'Right-click token in tracker', 'Inspects basic info / health (if visible to players)']
              ]
            }
          ]
        }
      },
      {
        id: 'token-movement',
        name: 'Token Movement & Grid Tactics',
        icon: 'fas fa-walking',
        theme: 'combat',
        summary: [
          'Movement on the tactical grid costs 1 AP per speed increment (typically 30 feet).',
          'Drag-and-drop movement includes an automated distance calculator and confirmation prompt.',
          'Ranged attacks and spells use the VTT\'s built-in target measurement tool for precise ranges.'
        ],
        content: {
          title: 'Grid Tactics & Token Movement',
          description: 'How to move your token, calculate AP costs, handle difficult terrain, and measure attack ranges.',
          sections: [
            {
              title: 'Tactical Movement on the Grid',
              content: `The tactical map is divided into **5-foot grid squares**. Your token represents your exact physical position in the combat space, which is critical for determining line of sight, range, cover, and flanking opportunities.\n\nMoving your token is simple and fully handled by the VTT:\n\n• **AP Cost**: Moving up to your base movement speed (typically 30 feet, or 6 squares) costs **1 AP**. This action can be repeated as long as you have AP remaining.\n• **Tactical Splitting**: You can split your movement. For example, you can spend 1 AP to move 15 feet, spend 2 AP to strike an enemy, and then use the remaining 15 feet of your movement without spending additional AP. The system tracks your remaining feet for the current movement action automatically.`
            },
            {
              title: 'Movement AP Cost & Drag Confirmation',
              content: `To prevent accidental moves or miscalculations, Mythrill uses a **Movement Path & Confirm** system:\n\n1. **Drag and Trace**: Click and drag your token across the map. As you drag, a glowing path line traces your route, showing the exact distance in feet and squares.\n2. **AP Calculation**: The VTT calculates the total AP cost in real time, displaying it as a floating badge next to your token (e.g. "Move: 15ft [0/1 AP Used]" or "Move: 45ft [2 AP Required]").\n3. **Difficult Terrain**: Moving through rough terrain (mud, deep snow, narrow crevices) is marked on the path in red. Each square of difficult terrain costs double movement speed (10 feet instead of 5 feet).\n4. **Confirmation**: Release the drag. A checkmark and cross button will appear. Click the checkmark (or press Space) to execute the move and subtract the AP. Click the cross (or press Escape) to cancel and snap your token back.`
            },
            {
              title: 'Measuring Range & Targeting',
              content: `Determining whether an enemy is within range of your longbow or spell is fully automated:\n\n• **Targeting an Enemy**: Right-click any enemy token on the grid and select **Designate Target** (or click the target icon in the right-click context menu). A target reticle will appear on them.\n• **Range Measurement**: The VTT draws a faint indicator line between your token and the target, displaying the exact distance in feet. If you click a ranged weapon or spell on your action bar, the system checks this distance against the item's range limits and highlights the target in blue (within range), yellow (long range/disadvantage), or red (out of range).\n• **Line of Sight (Fog of War)**: If the GM has enabled dynamic lighting, your token's vision determines what you can see. Enemies standing behind thick pillars or walls are masked by shadows, preventing direct targeting.`
            }
          ],
          tables: [
            {
              title: 'Movement and Terrain Costs',
              description: 'AP and speed conversions for grid movement.',
              headers: ['Terrain / Move Type', 'Speed Cost', 'AP Cost', 'Tactical Penalty'],
              rows: [
                ['Standard Movement', '5 feet per square', '1 AP per 30ft speed', 'None'],
                ['Difficult Terrain', '10 feet per square', '1 AP per 15ft speed', 'Doubles distance cost'],
                ['Squeezing through crevice', '20 feet per square', '1 AP per 5ft speed', 'Quadruples cost; disadvantage on physical checks'],
                ['Climbing / Swimming', '10 feet per square', '1 AP per 15ft speed', 'Requires Athletics / Athletics check unless speed exists'],
                ['Disengage Action', 'Up to full speed', '1 AP', 'Ignores opportunity attacks during move']
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'equipment-system',
    name: 'Equipment System',
    icon: 'fas fa-shield',
    description: 'Weapons, armor, and magical items with durability mechanics',
    subcategories: [
      {
        id: 'weapons',
        name: 'Weapons',
        icon: 'fas fa-axe',
        theme: 'trade',
        content: {
          title: 'Weapons',
          description: 'Attacks combine your base attack with weapon damage dice and a weapon mastery roll.',
          sections: [
            {
              title: 'Dynamic Weapon State',
              content: `Your active weapon card updates to whatever is equipped. Each weapon shows its base damage die and its type (Sword, Axe, Mace, etc.).`
            },
            {
              title: 'Two Dice, One Attack',
              content: `When you attack you roll:
• Your Weapon Damage die (varies by weapon type; see table).
• Your Weapon Mastery die (default **d8** unless modified by feats/gear). If the weapon die rolls max, it counts as a crit and you add the mastery result to the damage.

Both dice use the weapon type to pick the correct outcome text.`
            },
            {
              title: 'Weapon Mastery Skill',
              content: `Weapon attacks also trigger a Weapon Mastery skill check for the equipped weapon type. Mastery gates special outcomes (disarms, cleaves, rebound mishaps) and can reduce die size with bonuses.`
            },
            {
              title: 'How to Read Results',
              content: `Outcome lines are keyed by weapon type (e.g., "Sword:", "Greataxe:", "Bow:"). The UI filters to the equipped type so you only see relevant text.`
            }
          ],
          tables: [
            {
              title: 'Weapon Types & Dice',
              description: 'All weapon types available in the game, with their typical damage dice. All weapons use a d8 for Weapon Mastery checks.',
              headers: ['Weapon Type', 'Typical Damage Die', 'Notes'],
              rows: [
                // One-Handed Melee
                ['Sword', 'd6', 'Balanced slashes/thrusts, versatile one-handed'],
                ['Axe', 'd8', 'High burst damage, less control'],
                ['Mace', 'd6', 'Crush armor and bone, effective vs. heavy armor'],
                ['Dagger', 'd4', 'Quick crit-fishing stabs, fast attacks'],
                ['Sickle', 'd4', 'Curved blade weapon with agricultural origins'],
                ['Flail', 'd6', 'Chain weapon with weighted head'],
                ['Fist Weapon', 'd4', 'Weapon worn on the hand for unarmed combat'],
                // Main Hand Only
                ['Rapier', 'd6', 'Elegant thrusting sword, main hand only'],
                ['Katana', 'd6', 'Curved blade requiring main hand mastery'],
                ['Saber', 'd6', 'Curved single-edged blade for main hand'],
                ['War Mace', 'd8', 'Heavy mace designed for main hand wielding'],
                // Off-Hand Only
                ['Parrying Dagger', 'd4', 'Defensive blade for off-hand parrying'],
                ['Off-Hand Blade', 'd4', 'Light blade optimized for off-hand combat'],
                ['Buckler', 'd4', 'Small shield for off-hand defense'],
                // Two-Handed Melee
                ['Greatsword', '2d6', 'Two-handed sweeping arcs, high damage'],
                ['Greataxe', 'd12', 'Massive cleaving chops, highest single-die damage'],
                ['Maul', '2d6', 'Shattering two-handed blows, armor crushing'],
                ['Polearm', 'd10', 'Reach, pulls, and trips, extended range'],
                ['Halberd', 'd10', 'Versatile polearm with axe and spear features'],
                ['Scythe', 'd10', 'Curved blade on long pole, sweeping attacks'],
                ['Jousting Spear', 'd10', 'Long lance designed for mounted combat'],
                ['Double-Sided Sword', 'd8', 'Sword with blades on both ends'],
                ['Staff', 'd6', 'Deflective jabs and sweeps, favored by casters'],
                // Ranged Weapons
                ['Bow', 'd8', 'Arced ranged volleys, traditional archery'],
                ['Crossbow', 'd10', 'Precision bolts, requires reload'],
                ['Thrown Weapon', 'd6', 'Axes, knives, or javelins for ranged combat'],
                ['Wand', 'd6', 'Channeled spell strikes, magical focus'],
                ['Blowgun', 'd4', 'Tubular weapon propelling darts with breath'],
                ['Sling', 'd4', 'Simple ranged weapon using centrifugal force'],
                ['Boomerang', 'd6', 'Curved throwing weapon that returns'],
                ['Chakram', 'd6', 'Circular throwing weapon with sharpened edges'],
                ['Shuriken', 'd4', 'Small concealed throwing weapon'],
                ['Dart', 'd4', 'Light throwing projectile'],
                // Instruments
                ['Harp', 'd6', 'Musical instrument that can channel magic, two-handed'],
                ['Lute', 'd6', 'Stringed instrument favored by bards, one-handed'],
                ['Flute', 'd4', 'Wind instrument that can enhance spells, one-handed'],
                ['Drum', 'd6', 'Percussion instrument that can create rhythmic effects, two-handed'],
                ['Horn', 'd4', 'Brass instrument used for signaling and magic, one-handed'],
                ['Violin', 'd6', 'Stringed instrument with a bow, one-handed'],
                ['Guitar', 'd6', 'Stringed instrument popular with bards, one-handed'],
                // Special
                ['Unarmed', 'd4', 'Fists, knees, elbows, natural weapons']
              ]
            }
          ]
        }
      },
      {
        id: 'armor',
        name: 'Armor',
        icon: 'fas fa-vest',
        theme: 'trade',
        content: {
          title: 'Armor',
          description: 'Total Armor drives passive DR and the Defend soak die',
          sections: [
            {
              title: 'How Armor Works Now',
              content: `Armor is no longer a separate skill and no longer uses per-piece reduction dice. Your total Armor sets two things:

• Passive Damage Reduction: Reduce every incoming hit by Armor ÷ 10 (rounded down).
• Defend Soak Die: When you take the Defend action, roll the soak die from the table below and reduce damage by the roll.`
            },
            {
              title: 'Read This Page',
              content: `1) Use the Soak Die Scale to find the die you roll when you Defend.
2) Use Armor Benchmarks to quickly see your passive DR (Armor ÷ 10).
3) Armor Types are just a reference for armor bonuses and cost—the bonus feeds your total Armor.`
            },
          ],
          tables: [
            {
              title: 'Soak Die Scale (Defend)',
              layout: 'armor-grid',
              headers: ['Armor', 'Soak Die'],
              rows: [
                ['0–4', '—'],
                ['5–9', '1d4'],
                ['10–14', '1d6'],
                ['15–19', '1d8'],
                ['20–24', '1d10'],
                ['25–29', '1d12'],
                ['30–34', '1d12 + 1d4'],
                ['35–39', '1d12 + 1d6'],
                ['40–44', '2d12'],
                ['45–49', '2d12 + 1d4']
              ]
            },
            {
              title: 'Armor Benchmarks',
              layout: 'armor-grid',
              headers: ['Armor', 'Passive DR (Armor ÷ 10)'],
              rows: [
                ['0–9', '0'],
                ['10–19', '1'],
                ['20–29', '2'],
                ['30–39', '3'],
                ['40–49', '4'],
                ['50–59', '5'],
                ['60–69', '6'],
                ['70–79', '7']
              ]
            },
            {
              title: 'Armor Types (Reference)',
              layout: 'armor-grid',
              headers: ['Armor', 'Armor Bonus', 'Notes', 'Cost'],
              rows: [
                ['Cloth', 'Varies by item', 'Light; best for casters and mobility', 'See item library'],
                ['Leather', 'Varies by item', 'Light/medium; balanced defense and stealth', 'See item library'],
                ['Mail', 'Varies by item', 'Heavy; solid protection, some noise/weight', 'See item library'],
                ['Plate', 'Varies by item', 'Heavy; highest protection, hefty weight', 'See item library']
              ]
            }
          ]
        }
      },
      {
        id: 'magical-items',
        name: 'Magical Items',
        icon: 'fas fa-wand-sparkles',
        theme: 'arcane',
        summary: [
          'Magical items span 7 rarity tiers: Poor through Artifact, each with greater power and value.',
          'Powerful items require attunement — you may be attuned to a maximum of 3 items at once.',
          'Magical enchantments grant stat bonuses, damage type modifiers, special abilities, or unique passives.'
        ],
        content: {
          title: 'Magical Items',
          description: 'Rarity tiers, attunement rules, enchantment types, and item identification.',
          sections: [
            {
              title: 'Rarity Tiers',
              content: `Magical items exist across a spectrum of power, scarcity, and crafting complexity, organized into **seven rarity tiers**. Rarity determines not only the raw power of the item's enchantments, but also the difficulty of crafting, identifying, and repairing it.\n\nItems of higher rarity often require rare materials, extended crafting rituals, or the expertise of a master artisan. The GM controls which rarity tiers are available in their campaign, and discovery of a Legendary or Artifact item should feel like a momentous event.\n\nAll rarity tiers are fully supported by the VTT's Item Wizard — GMs and players can create items of any tier and assign custom enchantments. See the full Item Wizard guide at [Creating Items](equipment-system/item-wizard).`
            },
            {
              title: 'Attunement',
              content: `Some items of Uncommon rarity or higher require **attunement** — a ritual of bonding that awakens the item's magical properties to your specific essence. An unattuned attunement item still functions as a mundane item of its physical type (an unattuned +2 sword still cuts like a sword) but its magical bonuses, stat enhancements, and special abilities remain dormant.\n\nTo attune to an item:\n• **Short Rest Bonding**: Spend one short rest (at least 1 hour) in physical contact with the item, meditating on its history and focusing your spiritual energy into its enchantments.\n• **Character Limit**: You may be simultaneously attuned to a maximum of **3 magical items**. Attempting to attune to a fourth forces you to end attunement with one of the three current items first.\n• **Breaking Attunement**: Attunement ends when you die, when the item is destroyed (see [Durability & Repair](core-rules/durability-repair)), or when you voluntarily spend 1 minute of meditation to release the bond.\n• **VTT Tracking**: The VTT character sheet automatically tracks your attunement slots. Items marked as requiring attunement will display an attunement icon in your equipment panel, and an orange warning indicator appears if you have exceeded your slot limit.`
            },
            {
              title: 'Enchantment Types',
              content: `Magical items in Mythrill can carry a wide variety of enchantments, each representing a different category of magical infusion:\n\n• **Stat Enchantments**: Direct bonuses to attributes (e.g., +2 Strength, +1 Agility), derived stats (e.g., +5 Armor, +10 Max HP), or skill bonuses (e.g., +2 to Persuasion checks).\n• **Damage Enchantments**: Additional damage of a specific type on hit (e.g., +1d4 Fire damage, +1d6 Necrotic damage), or damage type conversion (converting Slashing to Radiant, for example).\n• **Resistance & Immunity Enchantments**: Granting Guarded, Resistant, or Immune status against one or more damage types. See [Damage Modifiers](combat-system/damage-modifiers) for the tier definitions.\n• **Special Ability Enchantments**: Unique active or passive abilities that function like class abilities. Examples include: once-per-rest flight, a chance-on-hit effect, a persistent aura, or a conditional proc (fires when you drop below 25% HP).\n• **Cosmetic Enchantments**: Visual effects (glowing runes, color-shifting materials, animated engravings) that have no mechanical effect but make the item more distinctive.`
            },
            {
              title: 'Item Identification',
              content: `When discovering a magical item in the field (looted from an enemy or found in a cache), its properties may initially be **unidentified** — known only to carry some magical essence. Characters with proficiency in Arcana can attempt to identify an item:\n\n• **Quick Identification**: Spend 1 minute examining the item and make an Arcana check against a difficulty die set by the GM (Uncommon items: d6-d8; Rare: d10; Epic: d12; Legendary/Artifact: d20). On a success, the item's properties are revealed.\n• **Extended Study**: If you fail the quick check, you can study the item during a long rest to guarantee identification regardless of result.\n• **Identify Spell**: If any character in the party has access to the Identify spell (available to most Intelligence-based casters), casting it reveals all properties of a touched item instantly.\n• **Town Sages**: In settlements, sages and artificers can identify items for a fee — typically proportional to the item's rarity tier.`
            }
          ],
          tables: [
            {
              title: 'Item Rarity Tiers',
              description: 'Seven tiers of magical power, from humble enchantments to artifacts of legend. Higher rarity means greater power, rarity, and crafting difficulty.',
              headers: ['Rarity', 'Color', 'Typical Power', 'Attunement Required?', 'Default Max Durability'],
              rows: [
                ['Poor', 'Gray', 'Minor enchantments, slight bonuses', 'Never', '30'],
                ['Common', 'White', 'Small stat bonuses or utility effects', 'Rarely', '50'],
                ['Uncommon', 'Green', 'Meaningful combat bonuses or useful abilities', 'Sometimes', '70'],
                ['Rare', 'Blue', 'Significant power, multiple enchantments', 'Usually', '90'],
                ['Epic', 'Purple', 'Exceptional abilities, class-defining effects', 'Always', '120'],
                ['Legendary', 'Orange', 'Reality-altering powers, unique effects', 'Always', '160'],
                ['Artifact', 'Red/Gold', 'World-shaking relics of unspeakable power', 'Always', '200+']
              ]
            },
            {
              title: 'Attunement Rules Summary',
              description: 'Quick reference for attunement mechanics.',
              headers: ['Rule', 'Details'],
              rows: [
                ['Maximum attunement slots', '3 items simultaneously'],
                ['Attunement ritual', 'Short rest (1 hour) in physical contact with the item'],
                ['Breaking attunement', '1 minute meditation, or automatically on death or item destruction'],
                ['Unattuned item behavior', 'Functions as a mundane item of its physical type (no magical bonuses)'],
                ['VTT tracking', 'Auto-tracked in character sheet; warning shown if over limit']
              ]
            }
          ]
        }
      },
      {
        id: 'item-wizard',
        name: 'Creating Items (Item Wizard)',
        icon: 'fas fa-hammer',
        theme: 'trade',
        summary: [
          'The Item Wizard is a GM and player tool for creating custom weapons, armor, and magical items.',
          'Items can be saved to the personal Item Library or shared with the Community Library.',
          'Quick Create mode generates items instantly; the Full Wizard allows detailed customization.'
        ],
        content: {
          title: 'Creating Items: The Item Wizard',
          description: 'A complete guide to creating custom items using the VTT Item Wizard.',
          sections: [
            {
              title: 'What Is the Item Wizard?',
              content: `The **Item Wizard** is one of Mythrill's most powerful GM and player tools. It allows you to design fully custom weapons, armor, accessories, consumables, containers, and magical relics from scratch — specifying every detail from their physical dimensions on the inventory grid to their magical enchantments, lore description, and visual appearance.\n\nItems created through the wizard can be:\n• Saved to your **Personal Item Library** for use in any future session.\n• Shared to the **Community Library**, making them available to all Mythrill users worldwide.\n• Distributed directly to players during a session by the GM.\n• Placed in **Containers** (chests, bags, vaults) that players discover during exploration.\n\nAccess the Item Wizard through the main navigation menu. GMs can also access it directly from the GM Tools panel during a live session.`
            },
            {
              title: 'Quick Create vs. Full Wizard',
              content: `The Item Wizard offers two creation modes to suit different needs:\n\n**Quick Create Mode** generates an item instantly based on a small set of key parameters: name, item type, rarity, and a brief description. The system auto-fills sensible defaults for everything else (damage dice, armor values, durability, grid size). This mode is perfect for rapidly generating loot during a session or filling a dungeon chest.\n\n**Full Wizard Mode** is the complete multi-step process (see below) giving you total control over every parameter. Use the Full Wizard when creating signature weapons, named magic items, unique artifacts, or any item that needs precise mechanical tuning.`
            },
            {
              title: 'The Item Wizard Steps',
              content: `The Full Wizard guides you through these creation steps:\n\n**Step 1 — Basic Info**: Name the item, write its lore description, select its item type (Weapon, Armor, Accessory, Consumable, Container, Miscellaneous), set its rarity tier, and choose a visual icon from the library or upload a custom image.\n\n**Step 2 — Physical Stats**: Configure the item's core statistics based on its type. For weapons: damage die, weapon type (Sword, Axe, Bow, etc.), handedness, and range. For armor: armor bonus, armor type (Cloth, Leather, Mail, Plate).\n\n**Step 3 — Magical Effects**: Add enchantments. Select from stat bonuses, on-hit damage effects, resistances, active abilities, passive auras, or custom proc effects. Each effect can be finely tuned — set the magnitude, the damage type, the trigger condition, and the target. See [Magical Items](equipment-system/magical-items) for enchantment type details.\n\n**Step 4 — Durability**: Set the item's maximum durability. Leave at the default for the rarity tier, or set a custom value to represent exceptional craftsmanship or ancient decay. See [Durability & Repair](core-rules/durability-repair) for how durability works in play.\n\n**Step 5 — Inventory Grid Shape**: Configure the item's physical footprint in the inventory grid. Simple items are 1x1 slots; a two-handed greatsword might be 1x6. See [Your Inventory Grid](core-rules/inventory-encumbrance) for how grid slots work.\n\n**Step 6 — Lore & Flavor**: Add rich lore text, an item history, a creator's name, and any special notes for the GM. This text is visible when players inspect the item in their inventory.\n\n**Step 7 — Review & Save**: Preview the complete item card as players will see it. Save to your personal library, share to the community, or deploy directly into the current session.`
            }
          ],
          tables: [
            {
              title: 'Item Types Supported',
              description: 'The Item Wizard supports creating any of these item categories.',
              headers: ['Item Type', 'Examples', 'Key Parameters'],
              rows: [
                ['Weapon', 'Swords, axes, bows, staves, wands', 'Damage die, weapon type, handedness, range'],
                ['Armor', 'Leather, plate, robes, shields', 'Armor bonus, armor type, soak die effect'],
                ['Accessory', 'Rings, amulets, cloaks, belts', 'Equipment slot, stat bonuses, attunement'],
                ['Consumable', 'Potions, scrolls, food, poisons', 'Effect on use, charges, stack size'],
                ['Container', 'Chests, bags, pouches, vaults', 'Internal grid dimensions, lock settings'],
                ['Miscellaneous', 'Quest items, crafting materials, gems', 'Weight, lore, stack behavior']
              ]
            }
          ]
        }
      },
      {
        id: 'item-library',
        name: 'The Item Library & Economy',
        icon: 'fas fa-book-bookmark',
        theme: 'trade',
        summary: [
          'The Item Library houses thousands of pre-made and user-generated weapons, armor, and gear.',
          'GMs can distribute items to players instantly, or place them in exploreable containers.',
          'Players browse public items to request gear, or purchase them directly from the Shop System.'
        ],
        content: {
          title: 'The Item Library & Session Economy',
          description: 'How to browse libraries, distribute equipment, and manage the in-game shop and player trading.',
          sections: [
            {
              title: 'Personal and Community Libraries',
              content: `The **Item Library** (accessible from the VTT main menu) is divided into two distinct databases:\n\n• **Personal Library**: A private vault where all items you create using the [Item Wizard](equipment-system/item-wizard) are saved. These are persistent across all your campaigns.\n• **Community Library**: A global repository featuring public creations shared by other players and GMs. You can browse, filter by type or rarity, and copy these items directly into your personal collection or active sessions with a single click.`
            },
            {
              title: 'GM Distribution & Containers',
              content: `During play, GMs have several elegant methods to distribute loot:\n\n• **Direct Grant**: Drag any item from the Session Library and drop it directly onto a player\'s character portrait in the HUD or timeline. The item instantly pops up in their inventory.\n• **Encounter Rewards**: Linking items to NPC tokens in the Creature Library guarantees they appear as lootable items on the grid when the creature is defeated. See [Combat Basics](combat-system/combat-basics).\n• **Lootable Containers**: GMs can place interactive chest, bag, or urn tokens on the grid and pre-fill them with items from the library. When a player token moves adjacent to the container and right-clicks it, an inventory split-screen opens, allowing them to drag items into their pack.`
            },
            {
              title: 'The Shop System & Trading',
              content: `Economic transactions in Mythrill are clean and fully automated:\n\n• **In-Game Shops**: GMs can configure merchant NPCs with specific shop inventories. When players interact with these merchants, they open a shop interface. Buying items automatically deducts Gold from their character sheet and places the item in their inventory grid, subject to spacing rules. Selling items works the reverse, checking item value and mending state (damaged items sell for less).\n• **Player-to-Player Trading**: To trade items with a nearby ally, right-click their token and select **Offer Trade**. This opens a secure trade window where both players drag items and gold into their respective trade offers and click "Accept" to execute the swap instantly.`
            }
          ]
        }
      }
    ]
  },
  {
    id: 'magic-system',
    name: 'Magic System',
    icon: 'fas fa-wand-magic',
    description: 'Talent-based magic with diverse resource systems',
    subcategories: [
      {
        id: 'magic-overview',
        name: 'System Overview',
        icon: 'fas fa-book-sparkles',
        theme: 'arcane',
        summary: ['Spellcasting uses mana as the primary resource', 'Spells are crafted through the spellcrafting system', 'Each class has unique magical abilities and resource mechanics'],
        content: {
          title: 'Magic System Overview',
          description: 'Talent trees instead of spell levels',
          sections: [
            {
              title: 'Talent-Based Magic',
              content: `Unlike traditional spell slot systems, this game uses talent trees. You invest talent points to unlock new spells and abilities. This allows for greater customization and specialization.`
            },
            {
              title: 'Spell Schools',
              content: `Each class has access to specific spell schools based on their theme. For example, Pyromancers focus on fire magic, while Chronomancers manipulate time.`
            },
            {
              title: 'Universal Spells',
              content: `Every spellcaster in Mythrill — regardless of class or magical school — has access to a shared arsenal of **Universal Spells**. These are the bedrock incantations that no mage ventures without: **Detect Magic**, **Dispel Magic**, **Counterspell**, and their kin appear in the General tab of every caster's action bar. They are not glamorous. They are often the difference between controlling a fight and losing it entirely to an enemy's enchantment.`
            },
            {
              title: 'The Void\'s Shadow (Arcane Corruption)',
              content: `Manipulating the fundamental laws of reality carries severe spiritual risk. Channeling raw spellpower or drawing deep from void elements can cause magical corruption, tearing at a caster's mortal form and soul. Adventurers must manage their spellcasting stress, for overflowing energy manifests as devastating environmental fallout or lasting physical scars. This cosmic risk is particularly present when using high-level custom incantations, which require precise balance parameters. Learn more about crafting and balancing these incantations in the [Custom Spellcrafting Wizard](magic-system/spellcrafting-wizard).`
            }
          ]
        }
      },
      {
        id: 'magic-resources',
        name: 'Resources',
        icon: 'fas fa-droplet',
        theme: 'arcane',
        content: {
          title: 'Magic Resources',
          description: 'Action economy and class-specific resource systems used across all 30 classes',
          tables: [
            {
              title: 'Core Resources',
              description: 'Universal resources available to all characters, forming the foundation of action economy and survival.',
              layout: 'armor-grid',
              headers: ['Resource', 'Used By', 'Regeneration / Notes'],
              rows: [
                ['Action Points', 'Everyone', 'Refills each turn (core action economy)'],
                ['Mana', 'Most casters', 'Slow in combat; full on long rest'],
                ['Health', 'Everyone', 'Heals via rests, potions, abilities']
              ]
            },
            {
              title: 'Class Resource Systems',
              description: 'Each of the 30 classes uses unique resource mechanics that define their playstyle and tactical options.',
              layout: 'armor-grid',
              headers: ['Resource', 'Used By', 'How It Works'],
              rows: [
                ['Sphere Generation & Combination', 'Arcanoneer', 'Generate elemental spheres; combine for powerful effects'],
                ['Rage Points', 'Berserker', 'Builds on hits/being hit; decays out of combat'],
                ['Edge & Flourish', 'Bladedancer', 'Momentum builds through combat flow; Flourish tokens earned from perfect execution'],
                ['Mayhem Modifiers', 'Chaos Weaver', 'Generate chaos spheres; spend to twist spells unpredictably'],
                ['Temporal Energy', 'Chronarch', 'Time Shards from casting; Temporal Strain from time manipulation (risk of backlash)'],
                ['Anti-Magic Seals', 'Covenbane', 'Place seals to disrupt magic; seals persist and can be detonated'],
                ['Necrotic Ascension', 'Deathcaller', 'Health as spell fuel; Blood Tokens from sacrifice (explode if unused)'],
                ['Dark Resilience Points', 'Dreadnaught', 'Convert damage taken into DRP (1 per 5 damage); spend on shields, strikes, or save to cheat death'],
                ['Divine Dominance', 'Exorcist', 'Dominance Dice (d12-d6) track control over bound demons; degrades with each command, risking escape at zero'],
                ['Madness Points', 'False Prophet', 'Accumulate Madness through void preaching; each point boosts damage, but reach 20 and Insanity Convulsion erupts'],
                ['Threads of Destiny', 'Fate Weaver', 'Generate threads from failures; weave fate to turn luck around'],
                ['Wild Instinct', 'Formbender', 'Generate through form-specific actions; spend to transform or use primal abilities'],
                ['Fortune Points', 'Gambler', 'Earn through risky actions; spend to manipulate probability and luck'],
                ['Quarry Marks', 'Huntress', 'Mark targets; build focus through precision attacks'],
                ['Runic Wrapping & Inscriptions', 'Inscriptor', 'Place runes on battlefield; inscribe equipment for persistent buffs'],
                ['Eternal Frost Aura & Phylactery', 'Lichborne', 'Build frost aura through cold damage; phylactery enables resurrection'],
                ['Lunar Charge', 'Lunarch', 'Build charge through lunar phases; spend on powerful moon-based abilities'],
                ['Devotion Gauge', 'Martyr', 'Earn by taking damage; spend on self-sacrificing powerful abilities'],
                ['Harmonic Notes', 'Minstrel', 'Generate notes through performance; combine notes for musical spell effects'],
                ['Prophetic Vision', 'Oracle', 'Build vision through divination; spend to see future and alter fate'],
                ['Virulence', 'Plaguebringer', 'Passive buff gauge (0-100) that grows through affliction cultivation; 5 interchangeable categories determine final plague type'],
                ['Totemic Synergy', 'Primalist', 'Place totems; build synergy when multiple totems are active'],
                ['Inferno Veil', 'Pyrofiend', 'Ascend/descend fire stages; higher stages unlock more powerful fire abilities'],
                ['Ward Layers', 'Spellguard', 'Build protective ward layers; spend layers for defensive and offensive abilities'],
                ['Strain Overload', 'Titan', 'Build strain through gravity manipulation; overload for massive area effects'],
                ['Alchemical Vials', 'Toxicologist', 'Toxin Vials for poisons/concoctions; Contraption Parts for battlefield devices'],
                ['Vengeance Points', 'Warden', 'Build vengeance when allies take damage; spend on protective and retaliatory abilities'],
                ['Voodoo Essence & Loa Invocation', 'Witch Doctor', 'Build essence through curses; invoke powerful Loa spirits'],
                ['Benediction & Malediction', 'Augur', 'Even d20 results generate Benediction (boons/blessings), odd results generate Malediction (curses/debuffs). Only applies to visible creatures within 60ft. Advantage/disadvantage: both dice generate. Spec-dependent maxes: 10/10, 15/5, or 5/15. Overflow at max is lost. Short rest resets to 0 (no penalty). Unused resources at long rest cause Omen Debt (-1/point to all rolls, cap -10).'],
                ['Havoc', 'Doomsayer', 'Earned from fulfilled prophecies (Prophesied outcomes). Spent to widen prophecy ranges and cast stronger spells. Prophecy Range: roll 2 dice → lower = Low boundary, higher = High boundary → inside = Prophesied, boundary = Base, outside = Backlash.']
              ]
            }
          ]
        }
      },
      {
        id: 'spellcasting',
        name: 'Spellcasting',
        icon: 'fas fa-hand-sparkles',
        theme: 'arcane',
        content: {
          title: 'Spellcasting',
          description: 'Casting process, components, and disruption',
          sections: [
            {
              title: 'Casting a Spell',
              content: `Magic in Mythrill is not spoken lightly. Every incantation is a transaction with forces older than the world — and those forces demand payment in AP, Mana, or blood.\n\n1. **Declare** the spell and your intended target.\n2. **Spend** the required AP and Mana (or class resource).\n3. **Resolve** any attack rolls or saving throws as specified by the spell.\n4. **Apply** the spell's effects — damage, conditions, buffs, or terrain alterations.\n\nThe spell entry on your action bar handles cost calculation automatically. You cannot cast if you lack sufficient AP or resources.`
            },
            {
              title: 'Spell Components',
              content: `Not all magic is cast the same way. Some spells demand spoken words — silence the caster, and the casting fails. Others require precise gestures that bound or shattered hands cannot form. The most demanding consume rare physical reagents in the act of casting.\n\n• **Verbal (V)** — Incantations, true names, prayers. Impossible while silenced or gagged.\n• **Somatic (S)** — Focused gestures requiring precision. Demands at least one free hand.\n• **Material (M)** — Physical reagents: powders, crystals, blood, bone. Consumed on casting unless otherwise stated.\n\nA spell may require any combination of the three. The action bar entry notes which components apply.`
            },
            {
              title: 'Concentration',
              content: `The most powerful sustained spells demand constant focus. While **concentrating**, your mind is divided — maintaining the spell's weave even as the world tries to shatter it.\n\n• **One at a time**: You can only concentrate on one spell simultaneously. Casting a new concentration spell immediately ends the previous one.\n• **Damage breaks focus**: Each time you take damage while concentrating, make a **Constitution save** (challenging die, typically d10). The GM may step this up to d12 or d20 for massive blows.\n• **Succeed** — the spell holds. **Fail** — concentration ends and the spell collapses.\n\nProtecting a concentrating ally is often more valuable than landing an extra attack.`
            }
          ]
        }
      },
      {
        id: 'talents',
        name: 'Talents',
        icon: 'fas fa-tree',
        theme: 'arcane',
        content: {
          title: 'Talents',
          description: 'Ability types, synergies, and tier progression',
          sections: [
            {
              title: 'Talent Trees',
              content: `Every scar, every victory, every hard lesson shapes what a warrior becomes. **Talent Trees** are the mechanical expression of this growth — a branching web of unlockable techniques, refinements, and power that deepens your character with each passing level.\n\nTrees are divided into **7 tiers**. Entry-level talents are accessible early; pinnacle abilities at Tier 7 demand significant investment and character experience. Dependency chains are shown visually with connecting lines — you must walk the path before reaching its summit.`
            },
            {
              title: 'Talent Points',
              content: `Each level earned grants **1 Talent Point**. These are spent to unlock new talents or advance existing ones to higher ranks. Some talents scale through multiple ranks — investing deeper increases potency rather than simply adding a new ability.\n\nPoints are finite. Your build defines how your character fights, survives, and applies pressure to the battlefield.`
            },
            {
              title: 'Synergies',
              content: `Talents rarely stand alone. A fire damage talent amplifies every flame-based spell in your arsenal. A speed talent shifts the value of every positioning ability in your kit. A resilience talent changes which risks are worth taking.\n\nUnderstanding these chains — and planning for them — is the difference between a character and a *build*. The most fearsome adventurers in Mythrill didn't stumble into power. They built toward it, one deliberate choice at a time.`
            }
          ]
        }
      },
      {
        id: 'spellcrafting-wizard',
        name: 'Spellcrafting Wizard',
        icon: 'fas fa-wand-magic-sparkles',
        theme: 'arcane',
        summary: [
          'Craft personalized spells dynamically using the VTT’s 9-step Spellcrafting Wizard.',
          'Balance spell tier limits, ranges, templates, and effects against resource budgets.',
          'Save custom spells directly to your character ledger and place them on your active action bar.'
        ],
        content: {
          title: 'Custom Spellcrafting Wizard',
          description: 'The complete guide to weaving custom magic, balancing elemental forces, and saving custom spells directly to your sheet.',
          sections: [
            {
              title: 'The Magic of Creation (Custom Spellcrafting)',
              content: `Magic in Mythrill is not a static list of predefined incantations copied from dusty spellbooks. Instead, spellcasters manipulate raw magical forces directly through our state-of-the-art **Custom Spellcrafting Wizard**. This interactive VTT engine allows you to step into the role of an arcane pioneer, combining customizable damage, direct healing, protective wards, and tactical utilities into personalized spells. 

Every custom spell you weave is calculated and budgeted according to its tier level and effect weight, ensuring that customized spells remain balanced. To learn more about how resources are drawn and spent by the 30 classes, see [Magic Resources](magic-system/magic-resources).`
            },
            {
              title: 'The 9-Step Custom Spellcrafting Workflow',
              content: `To weave a spell from raw elements, you progress through the nine sequential steps of the VTT Wizard:

• **Step 1: Basic Info** - Record your spell's thematic name, select its magical class school (e.g. Pyromancer, Chronomancer), assign an elemental affinity, and pick a visual icon to represent it on your sheet.
• **Step 2: Spell Type** - Declare the spell's core nature: an Active combat strike, a persistent Passive aura, a defensive Reaction, a Channeled concentration spell, or a hidden battlefield Trap.
• **Step 3: Effects** - Add and customize one or more primary spell effects. Choose from Damage, Direct Healing, Warding Shields, Stat Buffs, debilitating Debuffs, spatial Control, or prophecy manipulation.
• **Step 4: Targeting** - Configure the spell's range and spatial template. Choose between Self, Single Target (Ally or Enemy), spherical Area of Effect (AoE), cones, or long lines, setting precise feet boundaries.
• **Step 5: Resources** - Select and tune your spell's casting cost, drawing from Action Points (AP), Mana/Stamina reservoirs, or direct Health sacrifice.
• **Step 6: Cooldown & Charges** - Set the spell's recovery cycle. Balance powerful effects by adding round-based cooldowns or multiple casting charges.
• **Step 7: Mechanics & Special Triggers** - Inject advanced scripting nodes, such as rollable outcome tables, trap placement coordinates, or prophecy low/high boundaries.
• **Step 8: Sustained Channeling** - Establish any channeling costs and concentration requirements for sustained, round-over-round magic.
• **Step 9: Balance & Review** - Run the spell through the built-in balance analyzer. Once verified, save the custom spell directly to your character ledger to have it instantly populate your active action bar.`
            },
            {
              title: 'VTT Balance Thresholds & Action-Bar Integration',
              content: `The ultimate step of spellcrafting is the **Balance Evaluation**. The VTT’s balance calculator measures your spell's total utility (damage, healing, templates, duration) against its tier limit and resource cost. 

• **Balanced Spells**: If the spell is within the tier budget, it is approved. The wizard allows you to save the spell directly to your character ledger. The spell icon is placed on your **active action bar**, ready for tactile, point-and-click casting during encounters.
• **Unbalanced Spells**: If the spell's power exceeds its budget, the system will highlight the imbalance in red. The wizard provides dynamic recommendations to bring it back in line (e.g., increasing Mana/AP cost, adding a cooldown, or scaling down the damage). This ensures fair play while leaving creative freedom in your hands.`
            }
          ]
        }
      }
    ]
  },
  {
    id: 'social-mechanics',
    name: 'Social Mechanics',
    icon: 'fas fa-comments',
    description: 'Non-combat interactions and reputation systems',
    subcategories: [
      {
        id: 'social-basics',
        name: 'Social Basics',
        icon: 'fas fa-handshake',
        theme: 'social',
        summary: ['Social encounters use the same difficulty-dice system', 'NPC attitudes affect starting difficulty', 'Skills like Persuasion, Deception, and Intimidation drive interactions'],
        content: {
          title: 'Social Mechanics Basics',
          description: 'Comprehensive social interaction and influence systems',
          tabs: [
            {
              id: 'social-skills',
              name: 'Social Skills',
              sections: [
                {
                  title: 'Core Social Skills',
                  content: `Not every battle is won with a blade. In Mythrill, the tongue is a weapon — and sometimes a sharper one. **Social encounters** use the same Difficulty Die system as combat: the GM assigns a die based on the challenge, you roll your relevant skill, and the colour of the result tells the whole table what happens next.\n\nFive skills drive social encounters. Knowing which to reach for — and which to avoid — is as tactically important as knowing when to parry.`
                }
              ],
              tables: [
                {
                  title: 'Social Skills',
                  description: 'Five essential skills for navigating conversations, negotiations, and social encounters. Each skill has its purpose and can be countered by opposing skills.',
                  headers: ['Skill', 'Use', 'Example', 'Opposed By'],
                  rows: [
                    ['Persuasion', 'Convince through logic/emotion', 'Negotiate price, gain favor', 'Insight, Spirit'],
                    ['Deception', 'Mislead or lie', 'Bluff, disguise motives', 'Insight, Investigation'],
                    ['Intimidation', 'Threaten or coerce', 'Extract information, force compliance', 'Courage, Spirit'],
                    ['Insight', 'Read intentions/emotions', 'Detect lies, gauge mood', 'Deception, Performance'],
                    ['Performance', 'Entertain or distract', 'Tell stories, create diversion', 'Insight, Perception']
                  ]
                }
              ]
            },
            {
              id: 'npc-attitudes',
              name: 'NPC Attitudes',
              sections: [
                {
                  title: 'Disposition System',
                  content: `An NPC's **Attitude** toward the party is not a fixed trait — it is a living variable shaped by reputation, past interactions, and the consequences of the party's actions in the world. It directly controls how difficult social encounters with that character are.\n\nA **Hostile** merchant won't sell to you. An **Indifferent** city guard follows standard procedure. A **Helpful** informant shares secrets they shouldn't. Attitudes shift over the course of a campaign based on what the party does — and what it fails to do.`
                }
              ],
              tables: [
                {
                  title: 'NPC Attitudes',
                  description: 'How NPCs feel toward the party affects every social interaction. Attitudes shift based on actions, reputation, and the outcomes of social encounters.',
                  headers: ['Attitude', 'Description', 'Difficulty Shift', 'Behavior'],
                  rows: [
                    ['Hostile', 'Actively opposes party', '+2 die steps harder', 'Attacks, refuses aid, spreads rumors'],
                    ['Unfriendly', 'Dislikes party', '+1 die step harder', 'Unhelpful, suspicious, demands payment'],
                    ['Indifferent', 'No strong feelings', 'No change', 'Normal interactions, fair treatment'],
                    ['Friendly', 'Likes party', '-1 die step easier', 'Helpful, gives advice, small favors'],
                    ['Helpful', 'Strongly supports party', '-2 die steps easier', 'Goes out of way to assist, shares secrets']
                  ]
                }
              ]
            },
            {
              id: 'social-encounters',
              name: 'Social Encounters',
              sections: [
                {
                  title: 'Structured Social Encounters',
                  content: `High-stakes social situations — a tense negotiation with a crime lord, a debate before a war council, a battle of wits in a noble court — can be run as **structured encounters** with initiative, clear objectives, and defined victory conditions. These work like combat rounds: each participant acts in sequence, deploying social actions from a defined pool. The party accumulates **Influence Points** toward a threshold representing their goal. Reach it before the window closes, and the encounter is won.\n\nUse structured social encounters sparingly. Reserve them for moments with real political or narrative weight.`
                }
              ],
              tables: [
                {
                  title: 'Social Actions',
                  description: 'Actions available during structured social encounters. Each action has potential rewards and risks—choose wisely, for words have consequences.',
                  headers: ['Action', 'Skill', 'Effect', 'Risk'],
                  rows: [
                    ['Persuade', 'Persuasion', 'Improve attitude, gain favor', 'May seem pushy if failed'],
                    ['Deceive', 'Deception', 'Mislead target, hide truth', 'Hostile if discovered'],
                    ['Intimidate', 'Intimidation', 'Force compliance, extract info', 'May become enemy'],
                    ['Read Motives', 'Insight', 'Learn NPC goals, detect lies', 'Low risk'],
                    ['Entertain', 'Performance', 'Distract, improve mood', 'Embarrassment if failed'],
                    ['Gather Info', 'Investigation', 'Learn about topic/person', 'May alert targets'],
                    ['Make Impression', 'Charisma', 'Establish reputation', 'First impressions matter'],
                    ['Call in Favor', 'Special', 'Use existing relationship', 'Burns relationship']
                  ]
                }
              ]
            },
            {
              id: 'influence',
              name: 'Influence',
              sections: [
                {
                  title: 'Influence Points',
                  content: `For complex social encounters, track influence points. Characters gain influence through successful social actions. Reaching certain thresholds achieves objectives.`
                }
              ],
              tables: [
                {
                  title: 'Influence Thresholds',
                  description: 'The currency of social power. Build influence through successful interactions to unlock favors, information, and access.',
                  headers: ['Objective', 'Influence Required', 'Example'],
                  rows: [
                    ['Minor Favor', '3 points', 'Get directions, small discount'],
                    ['Moderate Favor', '6 points', 'Borrow equipment, gain introduction'],
                    ['Major Favor', '10 points', 'Significant help, risk reputation'],
                    ['Life-Changing', '15 points', 'Change allegiance, major sacrifice'],
                    ['Information', '2-8 points', 'Varies by sensitivity of information'],
                    ['Access', '4-12 points', 'Entry to restricted areas/groups'],
                    ['Protection', '8-15 points', 'Shelter from enemies/law'],
                    ['Resources', '5-20 points', 'Money, equipment, troops']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'reputation',
        name: 'Reputation',
        icon: 'fas fa-star',
        theme: 'social',
        content: {
          title: 'Reputation',
          description: 'Faction standing from -5 (Hated) to +5 (Revered)',
          tables: [
            {
              title: 'Reputation Levels',
              description: 'Your standing with factions shapes how the world treats you. Reputation ranges from hated enemy to revered ally, with tangible effects on services and opportunities.',
              headers: ['Level', 'Standing', 'Effects'],
              rows: [
                ['-5', 'Hated', 'Attacked on sight, no services available'],
                ['-3', 'Hostile', 'Refused service, prices doubled if available'],
                ['-1', 'Unfriendly', 'Poor service, prices increased 25%'],
                ['0', 'Neutral', 'Standard service and prices'],
                ['+1', 'Friendly', 'Good service, 10% discount'],
                ['+3', 'Honored', 'Excellent service, 25% discount, special quests'],
                ['+5', 'Revered', 'Best service, 50% discount, unique rewards']
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'travel-exploration',
    name: 'Travel & Exploration',
    icon: 'fas fa-map',
    description: 'Journey mechanics and exploration framework',
    subcategories: [
      {
        id: 'travel-basics',
        name: 'Travel Basics',
        icon: 'fas fa-route',
        theme: 'nature',
        content: {
          title: 'Travel Basics',
          description: 'Comprehensive travel mechanics, navigation, and journey structure',
          tabs: [
            {
              id: 'travel-pace',
              name: 'Travel Pace',
              sections: [
                {
                  title: 'The Open Road',
                  content: `Overland travel across the untamed frontiers of Mythrill is a test of preparation and endurance. Every journey requires the party to select a **Travel Pace**—balancing the speed of their march against their awareness of danger and ability to move unseen. Traversing harsh biomes like choked forests or frozen mountains slows progress and strains navigators, who must roll their **Navigation Die** to prevent the party from becoming lost in the wilderness.`
                }
              ],
              tables: [
                {
                  title: 'Travel Pace',
                  description: 'Pick a pace; it sets distance, stealth, and awareness tradeoffs.',
                  headers: ['Pace', 'Distance/Hour', 'Distance/Day', 'Effect'],
                  rows: [
                    ['Slow', '2 miles', '18 miles', 'Can use Stealth, +5 to Perception'],
                    ['Normal', '3 miles', '24 miles', 'No modifiers'],
                    ['Fast', '4 miles', '30 miles', '-5 to Perception, cannot use Stealth'],
                    ['Forced March', '5 miles', '40 miles', 'Constitution save each hour or gain exhaustion']
                  ]
                },
                {
                  title: 'Terrain Modifiers',
                  description: 'Apply terrain speed modifier and use the listed navigation die.',
                  headers: ['Terrain Type', 'Speed Modifier', 'Navigation Die', 'Special'],
                  rows: [
                    ['Road/Path', 'Normal', 'No check', 'Safe travel'],
                    ['Open Plains', 'Normal', 'Easy die (d6)', 'Easy to get lost without landmarks'],
                    ['Forest', '×0.5', 'Challenging die (d10)', 'Limited visibility, foraging opportunities'],
                    ['Hills', '×0.75', 'Moderate die (d8)', 'Elevated view, moderate difficulty'],
                    ['Mountains', '×0.5', 'Difficult die (d12)', 'Altitude effects, avalanche risk'],
                    ['Swamp', '×0.25', 'Difficult die (d12); step to d20 in storms', 'Disease risk, difficult navigation'],
                    ['Desert', '×0.75', 'Challenging die (d10)', 'Water scarcity, extreme temperatures'],
                    ['Arctic', '×0.5', 'Difficult die (d12)', 'Extreme cold, blizzard risk']
                  ]
                }
              ]
            },
            {
              id: 'navigation',
              name: 'Navigation',
              sections: [],
              tables: [
                {
                  title: 'Lost Consequences',
                  description: 'If navigation checks fail, apply these effects until the party recovers.',
                  headers: ['Severity', 'Effect', 'Recovery Check'],
                  rows: [
                    ['Slightly Lost', 'Travel time increased by 25%', 'Survival vs challenging die (d10)'],
                    ['Lost', 'Travel time increased by 50%, extra encounter', 'Survival vs difficult die (d12)'],
                    ['Hopelessly Lost', 'Travel time doubled, 2 extra encounters', 'Survival vs difficult die (d12); step to d20 in severe terrain or until a landmark is found']
                  ]
                }
              ]
            },
            {
              id: 'encounters',
              name: 'Encounters',
              sections: [
                {
                  title: 'Random Encounters',
                  content: `The GM rolls for encounters based on terrain, time of day, and party activities. Not all encounters are combat—many are opportunities for roleplay, discovery, or resource management.`
                }
              ],
              tables: [
                {
                  title: 'Encounter Frequency',
                  headers: ['Activity', 'Check Frequency', 'Encounter Chance'],
                  rows: [
                    ['Normal Travel', 'Every 4 hours', '1-2 on d6'],
                    ['Slow/Stealthy Travel', 'Every 6 hours', '1 on d6'],
                    ['Fast Travel', 'Every 3 hours', '1-3 on d6'],
                    ['Camping/Resting', 'Once per rest', '1 on d8'],
                    ['Lost', 'Every 2 hours', '1-3 on d6']
                  ]
                }
              ]
            },
            {
              id: 'travel-challenges',
              name: 'Travel Challenges',
              sections: [],
              tables: [
                {
                  title: 'Challenge Severity',
                  description: 'Set successes required and the difficulty die based on severity.',
                  headers: ['Severity', 'Successes Required', 'Difficulty Die'],
                  rows: [
                    ['Effortless', '1', 'd4'],
                    ['Very Easy', '2', 'd4–d6'],
                    ['Easy', '3', 'd6'],
                    ['Medium', '4', 'd8'],
                    ['Hard', '5', 'd10'],
                    ['Very Hard', '6', 'd12'],
                    ['Extreme', '6+', 'd20']
                  ]
                },
                {
                  title: 'Example Travel Challenges (Roll d20)',
                  description: 'Roll to pick a challenge; severity suggests the difficulty die.',
                  headers: ['Roll', 'Challenge', 'Severity', 'Suggested Skills'],
                  rows: [
                    ['1', 'Catastrophic storm', 'Extreme', 'Survival, Athletics, Nature'],
                    ['2-3', 'Hostile faction encounter', 'Very Hard', 'Persuasion, Stealth, Insight'],
                    ['4-5', 'Landslide blocks path', 'Hard', 'Athletics, Perception, Survival'],
                    ['6-8', 'River crossing', 'Medium', 'Athletics, Nature, Survival'],
                    ['9-12', 'Finding shelter', 'Easy', 'Survival, Perception, Nature'],
                    ['13-16', 'Foraging for food', 'Easy', 'Survival, Nature, Medicine'],
                    ['17-19', 'Clear weather day', 'Very Easy', 'Any skill'],
                    ['20', 'Perfect travel conditions', 'Effortless', 'Any skill']
                  ]
                }
              ]
            },
            {
              id: 'survival',
              name: 'Survival',
              sections: [],
              tables: [
                {
                  title: 'Weather Effects',
                  description: 'Apply these impacts; proper gear can mitigate saves or penalties.',
                  headers: ['Weather', 'Effect', 'Protection'],
                  rows: [
                    ['Clear', 'No effect', 'None needed'],
                    ['Light Rain', 'Disadvantage on Perception (sight)', 'None'],
                    ['Heavy Rain', 'Disadvantage on Perception, speed ×0.75', 'Waterproof gear'],
                    ['Snow', 'Speed ×0.5, tracks easily visible', 'Winter clothing'],
                    ['Blizzard', 'Speed ×0.25, Constitution save or exhaustion', 'Shelter required'],
                    ['Extreme Heat', 'Constitution save every hour or exhaustion', 'Shade, extra water'],
                    ['Extreme Cold', 'Constitution save every hour or exhaustion', 'Warm clothing, fire']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'exploration',
        name: 'Exploration',
        icon: 'fas fa-compass',
        theme: 'nature',
        content: {
          title: 'Exploration',
          description: 'Comprehensive exploration mechanics and discovery systems',
          tabs: [
            {
              id: 'exploration-basics',
              name: 'Exploration Basics',
              sections: [
                {
                  title: 'Exploration Framework',
                  content: `Mythrill's wilderness and ruins are not passive backdrops — they are layered environments full of threat, treasure, and consequence. **Exploration** is the third pillar of play alongside Combat and Social encounters, demanding attention, preparation, and the willingness to poke at things that probably shouldn't be poked.\n\nWhen exploring, the GM structures their description around six anchors: *What do you see? What do you hear? What do you smell? What is the atmosphere? What is unusual? What can you interact with?* Not all six will always apply — but the best exploration scenes answer most of them, making the space feel real before the players begin tearing it apart.`
                }
              ],
              tables: [
                {
                  title: 'Exploration Pace',
                  description: 'Pick a pace; it sets distance, stealth, and awareness tradeoffs.',
                  headers: ['Pace', 'Distance/Turn', 'Distance/Hour', 'Distance/Day', 'Effect'],
                  rows: [
                    ['Slow', '200 feet', '1,200 feet', '2 miles', 'Can use Stealth, +5 to Perception'],
                    ['Normal', '300 feet', '1,800 feet', '3 miles', 'No modifiers'],
                    ['Fast', '400 feet', '2,400 feet', '4 miles', '-5 to Perception, cannot use Stealth']
                  ]
                },
                {
                  title: 'Exploration Activities',
                  description: 'Players can perform various activities while exploring. Each activity takes time and may require skill checks. Some activities can be performed simultaneously, while others require full attention.',
                  headers: ['Activity', 'Time', 'Skill Check (Difficulty Die)', 'Effect'],
                  rows: [
                    ['Search Area', '10 minutes', 'Investigation vs challenging die (d10)', 'Find hidden objects, secret doors'],
                    ['Listen Carefully', '1 minute', 'Perception vs moderate die (d8)', 'Detect sounds, movement'],
                    ['Examine Object', '1 minute', 'Investigation vs easy die (d6)', 'Learn object properties, history'],
                    ['Track Creatures', '1 minute', 'Survival vs challenging die (d10)', 'Follow creature tracks'],
                    ['Identify Plants/Animals', '1 minute', 'Nature vs moderate die (d8)', 'Determine if safe, useful'],
                    ['Detect Magic', '1 action', 'Arcana vs challenging die (d10)', 'Sense magical auras'],
                    ['Map Area', '10 minutes', 'Cartographer tools vs moderate die (d8)', 'Create accurate map'],
                    ['Forage', '1 hour', 'Survival vs challenging die (d10)', 'Find food, water, materials']
                  ]
                }
              ]
            },
            {
              id: 'discovery',
              name: 'Discovery',
              sections: [
                {
                  title: 'Hidden Elements',
                  content: `The world is full of secrets waiting to be discovered. Hidden doors, treasure caches, ancient ruins, and mysterious phenomena reward thorough exploration.`
                }
              ],
              tables: [
                {
                  title: 'Discovery Types',
                  description: 'Various types of discoveries players can find during exploration, along with detection methods and typical rewards.',
                  headers: ['Discovery', 'Detection Method', 'Typical Difficulty Die', 'Reward'],
                  rows: [
                    ['Secret Door', 'Investigation', 'd10–d12', 'Access to hidden areas'],
                    ['Hidden Treasure', 'Perception/Investigation', 'd8–d12', 'Gold, gems, items'],
                    ['Ancient Runes', 'Arcana/History', 'd10–d20', 'Lore, spell knowledge'],
                    ['Natural Resources', 'Nature/Survival', 'd6–d10', 'Crafting materials'],
                    ['Trap', 'Perception', 'd8–d12 (step to d20 for deadly traps)', 'Avoid danger'],
                    ['Clues', 'Investigation', 'd6–d12', 'Story information'],
                    ['Shortcut', 'Survival', 'd10', 'Faster travel route'],
                    ['Safe Haven', 'Survival', 'd8', 'Secure rest location']
                  ]
                }
              ]
            },
            {
              id: 'hazards',
              name: 'Hazards',
              sections: [
                {
                  title: 'Environmental Dangers',
                  content: `Not all threats come from monsters. Environmental hazards can be just as deadly and often require creative solutions rather than combat prowess.`
                }
              ],
              tables: [
                {
                  title: 'Common Hazards',
                  description: 'Various environmental and constructed hazards that can be encountered during exploration, with detection methods and ways to avoid or disarm them.',
                  headers: ['Hazard', 'Detection Difficulty', 'Effect', 'Disarm/Avoid'],
                  rows: [
                    ['Pit Trap', 'Perception vs challenging die (d10)', '2d6 falling damage', 'Thieves\' tools vs challenging die (d10)'],
                    ['Poison Dart', 'Perception vs difficult die (d12)', '1d4 piercing + poison', 'Thieves\' tools vs difficult die (d12)'],
                    ['Unstable Floor', 'Investigation vs moderate die (d8)', 'Collapse, 3d6 damage', 'Move carefully'],
                    ['Toxic Gas', 'Perception vs challenging die (d10)', 'Constitution save or poisoned', 'Hold breath, ventilate'],
                    ['Magical Ward', 'Arcana vs challenging/difficult die (d10–d12)', 'Spell effect triggers', 'Dispel magic'],
                    ['Quicksand', 'Survival vs moderate/challenging die (d8–d10)', 'Restrained, sinking', 'Rope, careful movement'],
                    ['Rockslide', 'Perception vs challenging die (d10)', '4d6 bludgeoning', 'Agility save vs challenging die (d10) to dodge'],
                    ['Cursed Object', 'Arcana vs difficult die (d12)', 'Curse effect', 'Remove curse spell']
                  ]
                }
              ]
            },
            {
              id: 'point-click-framework',
              name: 'Point & Click Framework',
              sections: [
                {
                  title: 'GM Tool for Scene Design',
                  content: `The Point and Click Model provides a structured approach for Game Masters to create rich, interactive environments for players to explore. Use this checklist when designing exploration areas.`
                },
                {
                  title: 'Implementation Tips',
                  type: 'rotating-tips',
                  tips: [
                    { label: 'Prepare in Advance', description: 'Create a quick checklist for each area using the framework below' },
                    { label: 'Start Broad, Then Narrow', description: 'Begin with general atmosphere, then focus on specific details' },
                    { label: 'Reward Thorough Exploration', description: 'Place meaningful discoveries for players who investigate thoroughly' },
                    { label: 'Adapt to Player Interest', description: 'Expand on areas where players show curiosity' },
                    { label: 'Connect to Story', description: 'Ensure discoveries contribute to the overall narrative' },
                    { label: 'Use All Senses', description: 'Include details beyond just visual descriptions to create immersion' }
                  ]
                }
              ],
              tables: [
                {
                  title: 'Point & Click Scene Framework',
                  description: 'A structured checklist for GMs to design interactive exploration scenes with all necessary elements.',
                  headers: ['Question', 'Purpose', 'Example'],
                  rows: [
                    ['Setting & Atmosphere', 'Initial scene description', '"A gloomy Gothic study, walls lined with ancient books, air thick with mold and dust"'],
                    ['Sensory Details', 'Immersive details beyond sight', '"Old parchment scent, hint of pipe smoke, cold breeze, distant clock ticking"'],
                    ['Dynamic Elements', 'Movement and life in the scene', '"Curtains flutter aggressively, suggesting sudden gusts or something sinister"'],
                    ['Key Features', 'Landmarks players can interact with', '"Open window, cluttered oak desk, glass-panel bookshelf, ornate chandelier"'],
                    ['Hidden Elements', 'Secrets requiring investigation', '"Desk drawer seems stuck but has false bottom hiding ancient key"'],
                    ['Environmental Secrets', 'Clues integrated into setting', '"Dust pattern on bookshelf suggests books are frequently moved"'],
                    ['Triggered Encounters', 'Events based on player actions', '"Correct books open secret door; wrong ones trigger harmless trap"']
                  ]
                },
                {
                  title: 'Quick Scene Examples',
                  description: 'Example environments with key features and hidden elements to inspire scene design.',
                  headers: ['Environment', 'Key Features', 'Hidden Elements'],
                  rows: [
                    ['Ancient Temple', 'Central altar, ceremonial basin, hieroglyphic walls', 'Hidden pressure plates, secret passages'],
                    ['Merchant\'s Shop', 'Display cases, hanging tapestries, artifact collection', 'Secret ledger, disguised magic items'],
                    ['Forest Clearing', 'Stone circle, unusual flowers, animal tracks', 'Druidic symbols, hollow tree treasure'],
                    ['Abandoned Mine', 'Cart tracks, support beams, ore deposits', 'Clearable passages, hidden geode caverns']
                  ]
                }
              ]
            },
            {
              id: 'dungeon-exploration',
              name: 'Dungeon Exploration',
              sections: [
                {
                  title: 'Dungeon Procedures',
                  content: `Dungeons require systematic exploration. Parties should establish marching order, light sources, mapping responsibilities, and communication signals before entering.`
                }
              ],
              tables: [
                {
                  title: 'Dungeon Exploration Checklist',
                  description: 'A systematic approach to dungeon exploration to help parties stay organized and safe.',
                  headers: ['Step', 'Action', 'Considerations'],
                  rows: [
                    ['1', 'Establish marching order', 'Who leads, who guards rear, who carries light'],
                    ['2', 'Check for traps', 'Doors, floors, treasure chests'],
                    ['3', 'Listen at doors', 'Detect creatures or activity beyond'],
                    ['4', 'Map progress', 'Track rooms explored, note important features'],
                    ['5', 'Manage resources', 'Light sources, mana, hit points'],
                    ['6', 'Search thoroughly', 'Don\'t rush, check for secrets'],
                    ['7', 'Plan retreat route', 'Know how to escape if needed'],
                    ['8', 'Rest strategically', 'Find secure locations for short rests']
                  ]
                }
              ]
            }
          ]
        }
      },
      {
        id: 'environments',
        name: 'Environments',
        icon: 'fas fa-mountain',
        theme: 'nature',
        content: {
          title: 'Environments',
          description: 'Terrain types, hazards, and weather effects',
          sections: [
            {
              title: 'The World Is Trying to Kill You',
              content: `Mythrill's environments are not scenery. They are threats with their own rules. Blizzards impose Constitution saves. Extreme heat drains endurance one hour at a time. Darkness strips perception checks. Difficult terrain slows the cautious and punishes the reckless.\n\nThe hazards below represent the most common environmental pressures characters face during travel and exploration. GMs should treat these as baselines — layering them with biome-specific weather effects from the [Advanced Travel System](travel-exploration/advanced-travel) for a fully immersive overland experience.`
            }
          ],
          tables: [
            {
              title: 'Environmental Hazards',
              headers: ['Hazard', 'Effect'],
              rows: [
                ['Extreme Cold', 'CON save every hour or gain exhaustion'],
                ['Extreme Heat', 'CON save every hour or gain exhaustion'],
                ['Heavy Rain', 'Disadvantage on Perception (sight/hearing), ranged attacks'],
                ['Strong Wind', 'Disadvantage on ranged attacks, flying difficult'],
                ['Darkness', 'Heavily obscured, disadvantage on sight-based checks'],
                ['Difficult Terrain', 'Movement costs double']
              ]
            }
          ]
        }
      },
      {
        id: 'advanced-travel',
        name: 'Advanced Travel System',
        icon: 'fas fa-compass',
        useCustomComponent: true,
        theme: 'nature',
        content: {
          title: 'Advanced Travel System',
          description: 'Biome-based travel mechanics with weather, hourly checklists, encounters, and survival rules for immersive overland journeys',
          tabs: [
            {
              id: 'travel-workflow',
              name: 'Travel Workflow',
              sections: [
                {
                  title: 'Overview',
                  content: `The Advanced Travel System provides a structured, hour-by-hour procedure for running overland journeys. Each travel day is broken into discrete hours, and the GM works through a checklist for each one. The system is designed around six biomes — Arctic, Desert, Forest, Swamp, Ocean, and Underdark — each with their own weather tables, environmental hazards, and encounter pools.

Use the **Travel Tracker** tool (press W in-game, GM only) to automate rolling, tracking, and broadcasting. The rules below serve as the reference for what the tool does under the hood.`
                },
                {
                  title: 'Step-by-Step Procedure',
                  content: `Each travel day follows this workflow:

**1. Roll Weather** — Roll d20 + d8. The d20 determines the weather condition from the biome's weather table. The d8 sets how many hours that condition lasts. When the duration expires, roll again.

**2. Set Transport & Conditions** — Choose the party's transport mode (on foot, mounted, vehicle, etc.), the terrain subtype, and note any current exhaustion levels. These together determine the party's speed in miles per hour.

**3. Select a Travel Hour** — A standard travel day is 8 hours (hours 1-8). Hours 9-14 are overmarching territory — possible, but increasingly dangerous. Click an hour in the tracker to open its checklist.

**4. Resolve the Hourly Checklist** — For each hour:
- **Navigator's Check** — Survival vs the weather's navigation difficulty die. On Track = normal progress. Lost = no distance gained, hour still consumed.
- **Environmental Save** — Constitution save vs the weather's environmental difficulty die. Failure = 1 exhaustion level. Proper gear may grant advantage or auto-success depending on biome and weather severity.
- **Ration Check** — Every 4 hours of travel (hours 4 and 8), each character consumes 1 ration. No ration = Constitution vs moderate die (d8) or 1 exhaustion.
- **Rest Point** — Every 4 hours, a 1-hour short rest is recommended. Skipping it triggers Constitution saves starting the next hour.
- **Encounter Check** — Check for random encounters at hours 2, 4, 6, and 8. In severe weather, also check odd hours.`
                },
                {
                  title: 'The Travel Tracker Tool',
                  content: `The in-game Travel Tracker tool (keyboard shortcut **W**, GM-only) automates this entire workflow. It provides:

- A biome selector that changes the window's theme and loads the correct tables
- One-click weather rolling with automatic duration tracking
- Transport, terrain, and exhaustion controls that calculate speed in real-time
- An hour-by-hour checklist with navigation, environmental, ration, rest, and encounter sections
- A journey distance tracker with a progress bar
- Atmospheric description generation for each hour (broadcastable to players via the typewriter system)
- Configurable auto-broadcast toggles for atmosphere, weather changes, encounters, journey milestones, and exhaustion results

Players do not interact with the Travel Tracker directly. They experience travel through GM broadcasts and narrative description.`
                }
              ],
              tables: [
                {
                  title: 'Hourly Checklist Summary',
                  description: 'What to check at each hour of the travel day.',
                  headers: ['Hour', 'Encounter', 'Rations', 'Rest', 'Overmarching', 'Notes'],
                  rows: [
                    ['1', 'No', 'No', 'No', 'No', 'Confirm cold/weather gear. No encounter (just left settlement).'],
                    ['2', 'Yes', 'No', 'No', 'No', 'First encounter check.'],
                    ['3', 'No', 'No', 'No', 'No', 'Check if anyone at exhaustion level 2+ (speed halved).'],
                    ['4', 'Yes', 'Yes', 'Yes', 'No', 'First ration tick. Recommended short rest.'],
                    ['5', 'No', 'No', 'No', 'No', 'If rest was skipped at hour 4: Constitution vs moderate die (d8) or exhaustion.'],
                    ['6', 'Yes', 'No', 'No', 'No', 'Good moment for fatigue roleplay.'],
                    ['7', 'No', 'No', 'No', 'No', 'Decision point: push for hour 8 or make camp?'],
                    ['8', 'Yes', 'Yes', 'No', 'No', 'End of standard travel day. Second ration.'],
                    ['9+', 'Yes', 'No', 'No', 'Yes', 'Beyond safe travel. Constitution vs challenging die (d10) per 2-hour block, difficulty increases. Speed halved at hour 10+.']
                  ]
                }
              ]
            },
            {
              id: 'biome-weather',
              name: 'Biome Weather',
              sections: [
                {
                  title: 'Weather System',
                  content: `Each biome has its own weather table. Roll **d20** to determine the condition, then roll **d8** for how many hours it lasts. When the duration expires, roll again. Weather affects navigation difficulty, environmental saves, visibility, and movement speed.

The weather table uses the difficulty die system — navigation and environmental columns list which die to roll, not flat DCs. A "d4" entry means the check is very easy; a "d20" means it is very difficult.`
                },
                {
                  title: 'Weather Severity Scale',
                  content: `All biomes share a 5-tier severity scale that determines how weather interacts with gear and movement:

- **Severity 0 (Clear)** — No penalties. Gear auto-passes environmental saves.
- **Severity 1 (Mild)** — Minor navigation impact. Gear still auto-passes.
- **Severity 2 (Moderate)** — Visibility reduced. Gear grants advantage on environmental saves instead of auto-pass.
- **Severity 3 (Severe)** — Significant penalties. Speed may be reduced. Gear only grants advantage.
- **Severity 4 (Extreme)** — Dangerous. Shelter strongly recommended. Gear grants advantage, no auto-pass. Overmarching doubles exhaustion risk.`
                }
              ],
              tables: [
                {
                  title: 'Arctic Weather',
                  description: 'Frozen tundra, glaciers, and snowfields. Cold is the primary threat.',
                  headers: ['d20', 'Condition', 'Severity', 'Nav Die', 'Env Die', 'Gear Effect', 'Special'],
                  rows: [
                    ['1-4', 'Clear & Cold', '0', 'd6', 'd4', 'Auto-pass', 'Unlimited visibility'],
                    ['5-9', 'Overcast & Windy', '1', 'd8', 'd4', 'Auto-pass', 'Gusts extinguish torches'],
                    ['10-14', 'Light Blizzard', '2', 'd10', 'd4', 'Advantage only', 'Visibility 60 ft, difficult terrain'],
                    ['15-17', 'Heavy Blizzard', '3', 'd12', 'd8', 'Advantage only', 'Visibility 30 ft, speed halved'],
                    ['18-19', 'Whiteout', '4', 'd20', 'd10', 'Advantage only', 'Visibility 10 ft, shelter or exposure risk'],
                    ['20', 'Killing Cold', '4', 'd20', 'd12', 'Advantage only', 'Even on success, d4 roll of 1 = 1 exhaustion']
                  ]
                },
                {
                  title: 'Desert Weather',
                  description: 'Scorching sands, dust storms, and dehydration risk.',
                  headers: ['d20', 'Condition', 'Severity', 'Nav Die', 'Env Die', 'Gear Effect', 'Special'],
                  rows: [
                    ['1-4', 'Clear & Hot', '0', 'd4', 'd6', 'Auto-pass', 'Bright sun, easy navigation'],
                    ['5-9', 'Hazy & Windy', '1', 'd8', 'd6', 'Auto-pass', 'Dust in the air, reduced landmarks'],
                    ['10-14', 'Sandstorm (Light)', '2', 'd10', 'd8', 'Advantage only', 'Visibility 60 ft, stinging sand'],
                    ['15-17', 'Sandstorm (Heavy)', '3', 'd12', 'd10', 'Advantage only', 'Visibility 30 ft, speed halved'],
                    ['18-19', 'Haboon (Blackout)', '4', 'd20', 'd12', 'Advantage only', 'Visibility 0, burying sand, disorientation'],
                    ['20', 'Killing Heat', '4', 'd20', 'd20', 'Advantage only', 'Metal burns to touch, water consumption doubled']
                  ]
                },
                {
                  title: 'Forest Weather',
                  description: 'Dense canopy, mud, fog, and the risk of getting turned around.',
                  headers: ['d20', 'Condition', 'Severity', 'Nav Die', 'Env Die', 'Gear Effect', 'Special'],
                  rows: [
                    ['1-4', 'Clear Canopy', '0', 'd4', 'd4', 'Auto-pass', 'Dappled light, birdsong'],
                    ['5-9', 'Overcast & Damp', '1', 'd8', 'd4', 'Auto-pass', 'Mist between trees, muddy ground'],
                    ['10-14', 'Heavy Rain / Fog', '2', 'd10', 'd8', 'Advantage only', 'Visibility 60 ft, trails wash out'],
                    ['15-17', 'Thunderstorm', '3', 'd12', 'd10', 'Advantage only', 'Visibility 30 ft, lightning risk, speed halved'],
                    ['18-19', 'Dense Fog / Mist', '4', 'd20', 'd8', 'Advantage only', 'Visibility 10 ft, sounds muffled, easy to get lost'],
                    ['20', 'Ancient Storm', '4', 'd20', 'd12', 'Advantage only', 'Trees fall, flash flooding, magical overtones']
                  ]
                },
                {
                  title: 'Swamp Weather',
                  description: 'Fetid bogs, standing water, disease-carrying insects, and deceptive paths.',
                  headers: ['d20', 'Condition', 'Severity', 'Nav Die', 'Env Die', 'Gear Effect', 'Special'],
                  rows: [
                    ['1-4', 'Still & Humid', '0', 'd6', 'd4', 'Auto-pass', 'Oppressive heat, buzzing insects'],
                    ['5-9', 'Drizzle & Mist', '1', 'd8', 'd6', 'Auto-pass', 'Ground softens, visibility reduced'],
                    ['10-14', 'Heavy Rain', '2', 'd10', 'd8', 'Advantage only', 'Water rises, paths flood, leeches active'],
                    ['15-17', 'Monsoon', '3', 'd12', 'd10', 'Advantage only', 'Standing water knee-deep, speed halved'],
                    ['18-19', 'Toxic Miasma', '4', 'd20', 'd12', 'Advantage only', 'Poisonous gas, disease save each hour'],
                    ['20', 'Will-o-Wisp Night', '4', 'd20', 'd10', 'Advantage only', 'Deceptive lights, false paths, supernatural dread']
                  ]
                },
                {
                  title: 'Ocean Weather',
                  description: 'Open water, storms, becalming, and the relentless motion of the sea.',
                  headers: ['d20', 'Condition', 'Severity', 'Nav Die', 'Env Die', 'Gear Effect', 'Special'],
                  rows: [
                    ['1-4', 'Calm Seas', '0', 'd4', 'd4', 'Auto-pass', 'Following winds, clear horizons'],
                    ['5-9', 'Choppy & Breezy', '1', 'd8', 'd6', 'Auto-pass', 'Rolling waves, spray on deck'],
                    ['10-14', 'Rough Seas', '2', 'd10', 'd8', 'Advantage only', 'Large swells, difficult to hold course'],
                    ['15-17', 'Gale', '3', 'd12', 'd10', 'Advantage only', 'Ship pitches, speed halved, man overboard risk'],
                    ['18-19', 'Tempest', '4', 'd20', 'd12', 'Advantage only', 'Mountainous waves, structural damage risk'],
                    ['20', 'Maelstrom', '4', 'd20', 'd20', 'Advantage only', 'Whirlpool or hurricane, supernatural fury']
                  ]
                },
                {
                  title: 'Underdark Weather',
                  description: 'Subterranean caverns, fungal spores, cave-ins, and unnatural darkness.',
                  headers: ['d20', 'Condition', 'Severity', 'Nav Die', 'Env Die', 'Gear Effect', 'Special'],
                  rows: [
                    ['1-4', 'Stable Cavern', '0', 'd4', 'd4', 'Auto-pass', 'Even temperature, mapped passages'],
                    ['5-9', 'Dripping & Drafty', '1', 'd8', 'd6', 'Auto-pass', 'Water seepage, distant rumbling'],
                    ['10-14', 'Spore Cloud', '2', 'd10', 'd8', 'Advantage only', 'Fungal haze, visibility 60 ft, hallucination risk'],
                    ['15-17', 'Cave Tremor', '3', 'd12', 'd10', 'Advantage only', 'Falling debris, speed halved, new passages open'],
                    ['18-19', 'Gas Pocket', '4', 'd20', 'd12', 'Advantage only', 'Toxic atmosphere, no breathable air, dizziness'],
                    ['20', 'Underdark Collapse', '4', 'd20', 'd20', 'Advantage only', 'Tunnel cave-in, lava seep, or far realm incursion']
                  ]
                }
              ]
            },
            {
              id: 'exhaustion-survival',
              name: 'Exhaustion & Survival',
              sections: [
                {
                  title: 'Exhaustion Mechanics',
                  content: `Exhaustion is the primary threat during extended travel. Characters gain exhaustion levels from failing environmental saves, missing rations, skipping rest, overmarching, and biome-specific hazards (disease in swamps, altitude in mountains, etc.).

Exhaustion is cumulative and dangerous. At level 5 a character is severely compromised. At level 6, death occurs.

**Recovery:** 1 exhaustion level per long rest, provided the character has warmth (or shade in desert), food, and water. A long rest without these conditions does not remove exhaustion.`
                },
                {
                  title: 'Environmental Saves',
                  content: `Each hour of travel in severe weather requires every character to make a Constitution save against the weather's environmental difficulty die. The die varies by biome and weather severity (see Biome Weather tab).

**Gear interaction:**
- In **Severity 0-1** weather: appropriate environmental gear (cold-weather clothing, sun protection, waterproof layers, etc.) grants an automatic success — no roll needed.
- In **Severity 2-4** weather: gear no longer auto-passes. It grants **advantage** on the save instead.
- Without appropriate gear: roll normally (no advantage, no auto-pass).
- Characters with relevant **resistance or immunity** always auto-pass.`
                },
                {
                  title: 'Overmarching',
                  content: `Pushing past 8 hours of travel in a day is called overmarching. It is possible but dangerous:

- **Hours 9-10:** Constitution vs challenging die (d10) or 1 exhaustion per character.
- **Hours 11-12:** Constitution vs difficult die (d12) or 1 exhaustion. Speed halved for the party.
- **Hours 13-14:** Constitution vs d20 or 1 exhaustion. This is survival territory — legendary endurance required.
- Beyond hour 14 is not recommended. The risk of total incapacitation is extreme.

Overmarching exhaustion saves are in addition to any weather-related environmental saves.`
                }
              ],
              tables: [
                {
                  title: 'Exhaustion Levels',
                  description: 'Cumulative penalties from extreme exposure, lack of food, or pushing beyond safe travel limits.',
                  headers: ['Level', 'Penalty', 'Impact'],
                  rows: [
                    ['1', 'Speed -10 ft', 'Fatigued but functional'],
                    ['2', 'Disadvantage on ability checks', 'Skills and tools suffer'],
                    ['3', 'Speed halved', 'Severely slowed, affects whole party pace'],
                    ['4', 'Disadvantage on attacks and saves', 'Combat and resistance degraded'],
                    ['5', 'HP maximum halved', 'Critically weakened'],
                    ['6', 'Death', 'The body gives out']
                  ]
                },
                {
                  title: 'Exhaustion Sources',
                  description: 'All the ways a character can gain exhaustion during travel.',
                  headers: ['Source', 'Condition', 'Check'],
                  rows: [
                    ['Environmental save fail', 'Hourly in severe weather', 'Constitution vs weather env die'],
                    ['No rations', 'Every 4 hours without food', 'Constitution vs moderate die (d8)'],
                    ['No water', 'After day 1 without water', 'Constitution vs difficult die (d12)'],
                    ['No warmth overnight', 'Cold biome, no fire/shelter', 'Constitution vs moderate die (d8)'],
                    ['No shade overnight', 'Hot biome, no protection', 'Constitution vs moderate die (d8)'],
                    ['Skip rest point', 'After 4+ hours without rest', 'Constitution vs moderate die (d8), +1 die step per extra hour'],
                    ['Overmarching (hrs 9-10)', 'Past 8-hour travel day', 'Constitution vs challenging die (d10)'],
                    ['Overmarching (hrs 11-12)', 'Extended overmarching', 'Constitution vs difficult die (d12), speed halved'],
                    ['Overmarching (hrs 13-14)', 'Extreme overmarching', 'Constitution vs d20'],
                    ['Disease (swamp)', 'Failed disease save', 'Constitution vs difficult die (d12) each day until cured'],
                    ['Altitude (mountains)', 'Above 15,000 ft without acclimation', 'Constitution vs challenging die (d10) each hour']
                  ]
                },
                {
                  title: 'Exhaustion Recovery',
                  description: 'How to recover from exhaustion levels during travel.',
                  headers: ['Method', 'Recovery', 'Requirements'],
                  rows: [
                    ['Long rest with provisions', '1 level', 'Warmth/shade + rations + water + 8 hours'],
                    ['Long rest without provisions', '0 levels', 'Does not remove exhaustion'],
                    ['Lesser Restoration', '1 level', 'Spell or equivalent'],
                    ['Greater Restoration', 'All levels', 'Spell or equivalent'],
                    ['Healer\'s kit + Medicine', '1 level', 'Medicine vs moderate die (d8), consumes 2 uses']
                  ]
                }
              ]
            },
            {
              id: 'provisions-rest',
              name: 'Provisions & Rest',
              sections: [
                {
                  title: 'Rations & Water',
                  content: `Managing supplies is critical during extended travel. The party must track rations and water for each character.

**Rations:** Each character consumes 1 ration every 4 hours of active travel (typically at hours 4 and 8 of a travel day). Without a ration, the character must make a Constitution save vs moderate die (d8) or gain 1 exhaustion. Rations are consumed whether the party is traveling, sheltering, or waiting — only resting at a settlement with food supply pauses the timer.

**Water:** Characters need 1 water skin (or equivalent) per day in temperate biomes. In desert conditions, water consumption doubles. In arctic conditions, snow must be melted (10 minutes + fire source). After the first day without water, Constitution vs difficult die (d12) each day or 1 exhaustion.`
                },
                {
                  title: 'Foraging',
                  content: `A character can spend 1 hour foraging instead of traveling. That character does not contribute to navigation or distance progress for that hour. The forager makes a Survival check. The difficulty die varies by biome.`
                },
                {
                  title: 'Rest During Travel',
                  content: `The travel day includes built-in rest points:

- **Short Rest (1 hour):** Recommended at hours 4 and optionally hour 8. Characters can spend hit dice. No exhaustion recovery.
- **Long Rest (8 hours):** Typically done at camp after the travel day. Requires warmth/shade + rations + water. Recovers full HP, mana, and class resources, and removes 1 exhaustion level (if conditions met).
- **Shelter:** A Survival vs challenging die (d10) check, 1 hour. Grants advantage on overnight environmental saves. Essential in severity 3-4 weather.

**Skipping Rest:** If the party skips the short rest at hour 4, all characters must make Constitution vs moderate die (d8) starting at hour 5, with the die stepping up once per additional hour without rest (d8 at hour 5, d10 at hour 6, etc.).`
                },
                {
                  title: 'Camp & Night',
                  content: `At the end of the travel day, the party makes camp. This is when long rests occur, watches are set, and overnight encounters are checked.

- **Setting camp:** Choose a location. Sheltered areas grant advantage on environmental saves.
- **Watch order:** Set a rotation. Each watch is 2 hours. Perception checks during watch determine if the party is surprised by overnight encounters.
- **Overnight encounter:** Roll once per night (1 on d8 in most biomes, 1-2 in hostile territory).
- **Dawn:** Weather roll resets at dawn (or when the previous weather duration expires). Ration and rest timers reset.`
                }
              ],
              tables: [
                {
                  title: 'Foraging by Biome',
                  description: 'Difficulty die and yield for foraging in each biome. The forager skips navigation and distance progress for that hour.',
                  headers: ['Biome', 'Difficulty Die', 'Success', 'Beat by 5+', 'Failure'],
                  rows: [
                    ['Arctic', 'd12', '1d4 rations', 'Whole party fed', 'Half ration on miss by 1-4'],
                    ['Desert', 'd20', '1d4 rations + water', 'Whole party fed + water', 'Nothing — desert is unforgiving'],
                    ['Forest', 'd8', '1d4+1 rations', 'Whole party fed + herbs', 'Half ration on miss by 1-4'],
                    ['Swamp', 'd10', '1d4 rations', 'Whole party fed', 'Half ration, but disease risk (Con vs d8)'],
                    ['Ocean', 'd8 (fishing)', '1d4+1 rations', 'Whole crew fed', 'Half ration, thin ice risk arctic fishing'],
                    ['Underdark', 'd12', '1d4 rations (fungus)', 'Whole party fed', 'Nothing — spore cloud on miss by 5+']
                  ]
                },
                {
                  title: 'Water Requirements by Biome',
                  description: 'Daily water needs and sources by biome.',
                  headers: ['Biome', 'Daily Need', 'Source', 'Time to Procure'],
                  rows: [
                    ['Arctic', '1 skin', 'Melt snow', '10 min + fire'],
                    ['Desert', '2 skins', 'Oases (rare), foraging', '1 hour (if found)'],
                    ['Forest', '1 skin', 'Streams, dew, foraging', '30 min near water'],
                    ['Swamp', '1 skin (boiled)', 'Standing water (must boil)', '20 min + fire'],
                    ['Ocean', '1 skin (fresh)', 'Rain catchment, land stops', 'Variable'],
                    ['Underdark', '1 skin', 'Underground streams', '30 min if stream found']
                  ]
                },
                {
                  title: 'Rest Summary',
                  description: 'Types of rest available during travel and their effects.',
                  headers: ['Rest Type', 'Duration', 'Effect', 'Limitation'],
                  rows: [
                    ['Short Rest', '1 hour', 'Spend hit dice', 'No exhaustion recovery'],
                    ['Long Rest (with provisions)', '8 hours', 'Full HP, mana & resources, -1 exhaustion', 'Requires food, water, shelter'],
                    ['Long Rest (without provisions)', '8 hours', 'Full HP, mana & resources', 'No exhaustion recovery'],
                    ['Shelter Construction', '1 hour', 'Advantage on overnight env saves', 'Survival vs challenging die (d10)'],
                    ['Watch (overnight)', '2 hours each', 'Perception check to avoid surprise', 'No recovery for watcher']
                  ]
                }
              ]
            },
            {
              id: 'travel-encounters',
              name: 'Encounters',
              sections: [
                {
                  title: 'Encounter Checks',
                  content: `Encounters are checked at specific hours during travel. Not all encounters are combat — many are opportunities for roleplay, discovery, or resource management.

**When to check:**
- Standard: hours 2, 4, 6, and 8 of the travel day.
- Severe weather (severity 3-4): also check odd hours (1, 3, 5, 7).
- A roll of 18-20 on the encounter die always triggers, regardless of the table entry.

**Encounter types:** Combat, Social, Hazard, Discovery, or None. Each biome's encounter table specifies the type and provides notes for the GM.`
                },
                {
                  title: 'Encounter Tables',
                  content: `Each biome has its own encounter table with d20 entries. The tables are designed as starting points — GMs should customize them using the Travel Tracker tool's encounter table editor, adding creatures from their creature library and tailoring the results to their campaign.

Encounter entries include:
- **Range** — The d20 values that trigger this encounter.
- **Type** — Combat, Social, Hazard, Discovery, or None.
- **Name** — What the party encounters.
- **Note** — GM guidance for running the encounter.
- **Creature Links** — When using the Travel Tracker tool, these reference creatures from the GM's creature library with hoverable tooltips.`
                },
                {
                  title: 'Encounter Frequency by Activity',
                  content: `How often to check for encounters depends on what the party is doing:`
                }
              ],
              tables: [
                {
                  title: 'Encounter Frequency',
                  headers: ['Activity', 'Check Frequency', 'Chance'],
                  rows: [
                    ['Normal Travel', 'Every 4 hours (hrs 2, 4, 6, 8)', 'Roll d20 on encounter table'],
                    ['Severe Weather Travel', 'Every hour', 'Roll d20 on encounter table'],
                    ['Slow / Stealthy Travel', 'Every 6 hours', 'Roll d20, only 1-3 trigger'],
                    ['Fast Travel', 'Every 3 hours', 'Roll d20, 1-3 and 18-20 trigger'],
                    ['Camping / Resting', 'Once per rest', 'Roll d8, only 1 triggers'],
                    ['Lost', 'Every 2 hours', 'Roll d20 on encounter table']
                  ]
                },
                {
                  title: 'Arctic Encounters (d20)',
                  description: 'Sample encounter table for arctic travel. GMs should customize with creatures from their library.',
                  headers: ['d20', 'Type', 'Encounter', 'Note'],
                  rows: [
                    ['1-6', 'None', 'Uneventful travel', 'Describe the frozen landscape — tundra, distant peaks, eerie silence.'],
                    ['7', 'Discovery', 'Tracks in Snow', 'Survival vs moderate die (d8) to identify: wolf pack, herd, humanoid, or lone predator.'],
                    ['8', 'Combat', 'Wolf Pack', 'Pack tactics. Animal Handling vs moderate die (d8) + fire source may cause retreat.'],
                    ['9', 'Social', 'Nomad Patrol', 'Disposition varies. Persuasion vs challenging die (d10). May know local routes.'],
                    ['10', 'Social', 'Stranded Traveller', 'Exhaustion 2-4. Medicine vs moderate die (d8) to stabilise. May offer information.'],
                    ['11', 'Combat', 'Frost Predator', 'Regeneration stopped by fire. Hunts by smell — severe weather grants it advantage.'],
                    ['12', 'Combat', 'Yeti', 'Chilling Gaze: Constitution vs moderate die (d8) or paralysed. Fire causes fear.'],
                    ['13', 'Hazard', 'Crevasse Field', 'Perception vs challenging die (d10) or nearest character falls.'],
                    ['14', 'Hazard', 'Avalanche', 'Agility save vs challenging die (d10) or buried. Athletics vs moderate die (d8) to extract.'],
                    ['15', 'Combat', 'Ice Drake', 'Cold breath weapon. Can be bribed with Persuasion vs challenging die (d10) + shiny offering.'],
                    ['16', 'Combat', 'Apex Predator', 'Area affect chilling ability. Cold immunity. May track party for hours.'],
                    ['17', 'Discovery', 'Elemental Spirit', 'Perception vs challenging die (d10) to spot. May gift a trinket or temporary resistance.'],
                    ['18', 'Social', 'Rival Expedition', 'Disposition varies — hostile, competitive, desperate, or potential allies.'],
                    ['19', 'Combat', 'Winter Wolf Pack', 'Cold breath, pack tactics. Hunts silently in blizzards.'],
                    ['20', 'Combat', 'Burrower', 'Burrows under snow — Perception vs difficult die (d12) or surprised. Heated body on contact.']
                  ]
                },
                {
                  title: 'Desert Encounters (d20)',
                  description: 'Sample encounter table for desert travel. GMs should customize with creatures from their library.',
                  headers: ['d20', 'Type', 'Encounter', 'Note'],
                  rows: [
                    ['1-6', 'None', 'Uneventful travel', 'Endless dunes, shimmering heat, distant mirages.'],
                    ['7', 'Discovery', 'Ancient Tracks', 'Survival vs moderate die (d8) to identify: caravan, beast, or war party.'],
                    ['8', 'Combat', 'Scorpion Swarm', 'Poison stings. Fire or area effects disperse them.'],
                    ['9', 'Social', 'Nomad Traders', 'Will trade water and shade for goods. Persuasion vs moderate die (d8) for better prices.'],
                    ['10', 'Social', 'Lost Caravan', 'Dehydrated, desperate. Medicine vs moderate die (d8) to help. May share oasis location.'],
                    ['11', 'Combat', 'Sand Wurm', 'Tremorsense. Burrows beneath. Survival vs challenging die (d10) to detect early.'],
                    ['12', 'Combat', 'Mummy Patrol', 'Undead. Fire and radiant vulnerability. Does not stop pursuing.'],
                    ['13', 'Hazard', 'Quicksand', 'Survival vs challenging die (d10) to detect. Strength vs moderate die (d8) to escape.'],
                    ['14', 'Hazard', 'Flash Flood', 'Perception vs challenging die (d10) to hear coming. Agility vs challenging die (d10) to reach high ground.'],
                    ['15', 'Combat', 'Djinn', 'Powerful air elemental. May bargain — Persuasion vs difficult die (d12).'],
                    ['16', 'Combat', 'Desert Drake', 'Fire breath, sand camouflage. Hunts at midday when visibility is worst.'],
                    ['17', 'Discovery', 'Buried Ruin', 'Perception vs challenging die (d10) to spot exposed stone. Ancient treasures within.'],
                    ['18', 'Social', 'Rival Tribespeople', 'Water dispute. Intimidation or Persuasion vs challenging die (d10).'],
                    ['19', 'Combat', 'Giant Scorpion', 'Armoured carapace, venomous sting. Nest may contain eggs.'],
                    ['20', 'Combat', 'Sand Lord', 'Legendary desert predator. Controls sand itself. Retreat is wise.']
                  ]
                },
                {
                  title: 'Forest Encounters (d20)',
                  description: 'Sample encounter table for forest travel. GMs should customize with creatures from their library.',
                  headers: ['d20', 'Type', 'Encounter', 'Note'],
                  rows: [
                    ['1-6', 'None', 'Uneventful travel', 'Birdsong, dappled light, the creak of old growth.'],
                    ['7', 'Discovery', 'Animal Tracks', 'Survival vs easy die (d6) to identify: deer, boar, bear, or something larger.'],
                    ['8', 'Combat', 'Wolf Pack', 'Forest wolves are territorial. Pack tactics, howling summons reinforcements.'],
                    ['9', 'Social', 'Woodcutter / Ranger', 'Knows the local area. May share trail information for supplies.'],
                    ['10', 'Social', 'Lost Traveller', 'Disoriented, grateful. May know a shortcut or hidden danger.'],
                    ['11', 'Combat', 'Forest Predator', 'Ambush hunter. Stealth vs challenging die (d10) to detect.'],
                    ['12', 'Combat', 'Animated Trees', 'Guardians of old growth. Fire is effective. May negotiate with Nature vs moderate die (d8).'],
                    ['13', 'Hazard', 'Wasp Nest / Thorn Thicket', 'Perception vs moderate die (d8) to avoid. Constitution vs moderate die (d8) or poisoned.'],
                    ['14', 'Hazard', 'Root Trip / Sinkhole', 'Perception vs moderate die (d8) or fall. Investigation vs moderate die (d8) to assess stability.'],
                    ['15', 'Combat', 'Bandit Ambush', 'Stealth vs challenging die (d10). Demands toll. May flee if half their number fall.'],
                    ['16', 'Combat', 'Giant Spider', 'Web traps, venom. Survival vs moderate die (d8) to spot webs before walking in.'],
                    ['17', 'Discovery', 'Fairy Ring / Shrine', 'Arcana vs moderate die (d8) to understand. May grant boon or request.'],
                    ['18', 'Social', 'Druid Circle', 'Neutral unless provoked. Nature vs challenging die (d10) to gain safe passage.'],
                    ['19', 'Combat', 'Corrupted Beast', 'Diseased or magically warped. Unpredictable. Medicine vs challenging die (d10) to identify weakness.'],
                    ['20', 'Combat', 'Ancient Forest Guardian', 'Legendary protector of the deep woods. Tests the party\'s worthiness.']
                  ]
                },
                {
                  title: 'Swamp Encounters (d20)',
                  description: 'Sample encounter table for swamp travel. GMs should customize with creatures from their library.',
                  headers: ['d20', 'Type', 'Encounter', 'Note'],
                  rows: [
                    ['1-6', 'None', 'Uneventful travel', 'Standing water, cypress knees, the drone of insects.'],
                    ['7', 'Discovery', 'Bubbling Mud Pot', 'Nature vs moderate die (d8) — natural hot spring or volcanic vent.'],
                    ['8', 'Combat', 'Snake Swarm', 'Venomous. Fire or area effects scatter them. Medicine vs moderate die (d8) to treat bites.'],
                    ['9', 'Social', 'Hermit / Witch', 'Lives alone in the bog. Knowledgeable but eccentric. Trades for rare ingredients.'],
                    ['10', 'Social', 'Fleeing Refugees', 'Running from something deeper in. May warn of upcoming hazard.'],
                    ['11', 'Combat', 'Bog Undead', 'Rise from the muck. Resist slashing. Fire or radiant effective.'],
                    ['12', 'Combat', 'Lurker', 'Camouflaged ambush predator. Perception vs difficult die (d12) to detect.'],
                    ['13', 'Hazard', 'Quicksand / Bog Hole', 'Survival vs challenging die (d10) to spot. Strength vs moderate die (d8) to escape.'],
                    ['14', 'Hazard', 'Disease Cloud', 'Constitution vs challenging die (d10) or disease. Wind direction matters.'],
                    ['15', 'Combat', 'Hag Covey', 'Three hags, territorial. Deceptive — may offer bargains. Insight vs challenging die (d10).'],
                    ['16', 'Combat', 'Swamp Drake', 'Acid spit, amphibious. Retreats to water when wounded.'],
                    ['17', 'Discovery', 'Sunken Ruin', 'Perception vs challenging die (d10) to spot structure beneath water. Ancient artefacts.'],
                    ['18', 'Social', 'Lizardfolk Hunting Party', 'Cautious. Intimidation vs challenging die (d10) or they circle the party.'],
                    ['19', 'Combat', 'Will-o-Wisps', 'Lead the party into hazards. Immune to most damage. Nature vs difficult die (d12) to resist.'],
                    ['20', 'Combat', 'Swamp Ancient', 'Primordial bog guardian. Controls vines, water, and disease. Impossible to surprise.']
                  ]
                },
                {
                  title: 'Ocean Encounters (d20)',
                  description: 'Sample encounter table for ocean travel. GMs should customize with creatures from their library.',
                  headers: ['d20', 'Type', 'Encounter', 'Note'],
                  rows: [
                    ['1-6', 'None', 'Uneventful voyage', 'Rolling waves, salt spray, seabirds overhead.'],
                    ['7', 'Discovery', 'Flotsam / Wreckage', 'Perception vs moderate die (d8). May contain survivors, cargo, or clues.'],
                    ['8', 'Combat', 'Sahuagin Raiding Party', 'Board from below. Multiple attackers. Fire and thunder effective.'],
                    ['9', 'Social', 'Merchant Vessel', 'Will trade supplies. Persuasion vs moderate die (d8) for better rates.'],
                    ['10', 'Social', 'Castaway on Driftwood', 'Exhaustion 3+. Medicine vs moderate die (d8) to stabilise. Knows nearby island.'],
                    ['11', 'Combat', 'Sea Serpent', 'Constricting coils, crushing bite. Fire from ship\'s ballista effective.'],
                    ['12', 'Combat', 'Water Elemental', 'Whirlpool attack. Cannot be surprised in water. Flees if dispelled.'],
                    ['13', 'Hazard', 'Sargasso / Seaweed Tangle', 'Survival vs challenging die (d10) to navigate through. Entangled ships are sitting targets.'],
                    ['14', 'Hazard', 'Reef / Shallows', 'Perception vs challenging die (d10) to spot. Navigation vs moderate die (d8) to avoid grounding.'],
                    ['15', 'Combat', 'Pirate Vessel', 'Grappling hooks, boarding action. Intimidation vs challenging die (d10) to bluff.'],
                    ['16', 'Combat', 'Merfolk War Band', 'Territorial. May demand toll. Nature vs moderate die (d8) to parley.'],
                    ['17', 'Discovery', 'Uncharted Island', 'Nature vs moderate die (d8) to assess. May contain fresh water, fruit, or ruins.'],
                    ['18', 'Social', 'Smuggler\'s Cutter', 'Evasive. Intimidation vs challenging die (d10) to board. May have useful contraband.'],
                    ['19', 'Combat', 'Kraken Tentacles', 'Grapple and drag. Athletics vs difficult die (d12) to break free. The main body may surface.'],
                    ['20', 'Combat', 'Leviathan', 'Legendary sea creature. Controls currents and weather locally. Pray and run.']
                  ]
                },
                {
                  title: 'Underdark Encounters (d20)',
                  description: 'Sample encounter table for Underdark travel. GMs should customize with creatures from their library.',
                  headers: ['d20', 'Type', 'Encounter', 'Note'],
                  rows: [
                    ['1-6', 'None', 'Uneventful travel', 'Echoing drip of water, bioluminescent fungi, the weight of stone above.'],
                    ['7', 'Discovery', 'Crystal Formation', 'Arcana vs moderate die (d8). May have magical properties or resonance.'],
                    ['8', 'Combat', 'Underdark Vermin Swarm', 'Spider or insect swarm. Fire and area effects disperse.'],
                    ['9', 'Social', 'Deep Dwarf Patrol', 'Suspicious of outsiders. Persuasion vs challenging die (d10) to avoid conflict.'],
                    ['10', 'Social', 'Fugitive', 'Escaped slave or prisoner. Desperate, may bargain knowledge for protection.'],
                    ['11', 'Combat', 'Hook Horror', 'Echolocation — blind but accurate. Thunder damage disrupts their tracking.'],
                    ['12', 'Combat', 'Mind Flayer Scout', 'Psionic blast. Intelligence vs challenging die (d10) to resist. Does not fight alone — others are near.'],
                    ['13', 'Hazard', 'Fungal Spore Cloud', 'Constitution vs challenging die (d10) or hallucinating. Nature vs moderate die (d8) to identify safe path.'],
                    ['14', 'Hazard', 'Unstable Ceiling', 'Perception vs challenging die (d10) to hear cracking. Agility vs moderate die (d8) to dodge collapse.'],
                    ['15', 'Combat', 'Drow Raiding Party', 'Poisoned weapons, dark magic. May take prisoners rather than kill.'],
                    ['16', 'Combat', 'Purple Worm', 'Burrows through stone. Survival vs difficult die (d12) to detect tremors early.'],
                    ['17', 'Discovery', 'Abandoned Duergar Forge', 'Investigation vs moderate die (d8). Rare metals, forgotten constructs.'],
                    ['18', 'Social', 'Myconid Circle', 'Pacifistic unless threatened. Spore communication. May share safe routes for tribute.'],
                    ['19', 'Combat', 'Aboleth Servants', 'Dominated thralls. The aboleth itself watches from a pool. Enslave on hit — Will vs difficult die (d12).'],
                    ['20', 'Combat', 'Underdark Tyrant', 'Ancient evil — beholder, lich, or worse. Its lair shapes the tunnels around it. Retreat is survival.']
                  ]
                }
              ]
            },
            {
              id: 'transport-speed',
              name: 'Transport & Speed',
              sections: [
                {
                  title: 'Transport Modes',
                  content: `The party's speed depends on their transport mode, terrain, and exhaustion levels. The Travel Tracker tool calculates speed automatically based on these inputs.

Transport modes vary by biome — not all modes are available everywhere. Ocean travel requires a vessel. Underdark travel is almost always on foot. Arctic travel may include sled dogs.`
                },
                {
                  title: 'Speed Calculation',
                  content: `Effective speed = Base Speed x Terrain Modifier x Exhaustion Modifier

- **Base Speed** is set by the transport mode.
- **Terrain Modifier** is set by the terrain subtype within the biome.
- **Exhaustion Modifier** applies when party members have exhaustion levels:
  - No exhaustion: x1.0
  - Exhaustion 1: x1.0 (speed -10 ft, but travel pace unaffected)
  - Exhaustion 2: x1.0 (disadvantage on checks, pace unaffected)
  - Exhaustion 3+: x0.5 (speed halved — affects the entire party)
  - Exhaustion 5: x0 (character cannot travel)`
                }
              ],
              tables: [
                {
                  title: 'Transport Modes by Biome',
                  description: 'Available transport modes and their base speeds per biome.',
                  headers: ['Mode', 'Speed (mi/hr)', 'Available In', 'Rest Requirement', 'Notes'],
                  rows: [
                    ['On Foot', '1', 'All biomes', 'Every 4 hours', 'Standard pace. Affected by terrain.'],
                    ['Snowshoes', '1', 'Arctic', 'Every 4 hours', 'Negates deep snow penalty. Useless on ice.'],
                    ['Dog Sled', '2', 'Arctic', '1 hr rest every 4 hrs', 'Dogs must rest. Cannot cross steep terrain.'],
                    ['Horse', '4', 'Arctic, Desert, Forest, Swamp', '30 min every 2 hrs', 'Cannot navigate deep snow without barding. Leg injury risk on ice.'],
                    ['Camel', '3', 'Desert', '1 hr rest every 4 hrs', 'Water storage. Endures heat better than horse.'],
                    ['Canoe / Kayak', '2', 'Forest, Swamp, Ocean (coast)', 'Every 4 hours', 'River and coast only. Portage required for overland.'],
                    ['Sailing Ship', '3', 'Ocean', 'Crew rotates', 'Wind-dependent. Halved speed in calm. Doubled in gale (with risk).'],
                    ['Galley / Warship', '2', 'Ocean', 'Crew rotates', 'Oar-powered. Independent of wind. Faster in combat.'],
                    ['Mine Cart', '3', 'Underdark', 'Track only', 'Fixed routes only. No steering. Derailment hazard.'],
                    ['Cave Beast (Ridden)', '2', 'Underdark', 'Every 4 hours', 'Climbs walls. Darkvision. Requires Animal Handling vs moderate die (d8).']
                  ]
                },
                {
                  title: 'Terrain Speed Modifiers',
                  description: 'Speed multipliers applied based on the terrain subtype within each biome.',
                  headers: ['Biome', 'Terrain', 'Modifier', 'Special'],
                  rows: [
                    ['Arctic', 'Frozen Tundra', 'x1.0', 'Flat, open. Wind exposure.'],
                    ['Arctic', 'Deep Snow', 'x0.5', 'Snowshoes negate this penalty.'],
                    ['Arctic', 'Ice Sheet', 'x0.75', 'Agility vs easy die (d6) or prone. Crampons negate.'],
                    ['Desert', 'Hardpack / Dunes', 'x1.0', 'Firm sand, easy walking.'],
                    ['Desert', 'Soft Sand', 'x0.5', 'Exhausting. Every step sinks.'],
                    ['Desert', 'Rocky Badlands', 'x0.75', 'Scrambling, canyon navigation.'],
                    ['Forest', 'Open Woodland', 'x1.0', 'Spaced trees, clear trails.'],
                    ['Forest', 'Dense Undergrowth', 'x0.5', 'Bushwhacking, thorns, low visibility.'],
                    ['Forest', 'Rainforest Floor', 'x0.75', 'Roots, mud, canopy blocks light.'],
                    ['Swamp', 'Firm Ground', 'x1.0', 'Raised hummocks, boardwalks.'],
                    ['Swamp', 'Shallow Water', 'x0.5', 'Wading knee-to-waist deep.'],
                    ['Swamp', 'Deep Bog', 'x0.25', 'Swimming or boat required.'],
                    ['Ocean', 'Open Water', 'x1.0', 'Full sail speed.'],
                    ['Ocean', 'Coastal / Reef', 'x0.5', 'Navigation required. Grounding risk.'],
                    ['Ocean', 'Storm-tossed', 'x0.25', 'Bare steerage way. Survival priority.'],
                    ['Underdark', 'Carved Tunnel', 'x1.0', 'Stable, mapped passage.'],
                    ['Underdark', 'Rough Cavern', 'x0.75', 'Uneven floor, stalactites, narrow sections.'],
                    ['Underdark', 'Squeeze / Crevice', 'x0.25', 'Single file only. Cannot use large weapons.']
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'professions-advancement',
    name: 'Professions & Advancement',
    icon: 'fas fa-level-up',
    description: 'Character progression and crafting systems',
    subcategories: [
      {
        id: 'professions',
        name: 'Professions',
        icon: 'fas fa-hammer',
        theme: 'trade',
        summary: [
          'Master specialized professions to refine ores, brew potions, and craft legendary equipment.',
          'Succeed in complex brewing or forging minigames in the VTT interfaces to earn masterworks.',
          'Save fallen allies instantly in combat using First Aid and medical kits for 1 AP.'
        ],
        content: {
          title: 'Professions',
          description: 'Crafting and gathering skills with mastery levels',
          sections: [
            {
              title: 'Profession System',
              content: `Professions allow you to craft items, gather resources, or provide life-saving services. Every character can learn professions, advancing from Novice up to Grandmaster. As you perform crafting, gathering, or stabilization, you advance through five mastery ranks. Higher ranks lower the difficulty of your profession checks by shifting your Difficulty Die down, making critical success much more common. See the [Dice System](core-rules/dice-system) for details on Difficulty Die shifts.`
            },
            {
              title: 'Blacksmithing (Forge Interface)',
              content: `The **Blacksmithing Forge Interface** allows players to process raw ores harvested from the world and reshape them into martial gear.\n\n• **Refining Ore**: Harvested raw ore (such as Iron, Mithril, or Obsidian) must be smelted at a forge into ingots. Every 3 units of raw ore yields 1 ingot.\n• **Forging Gear**: Creating weapons or heavy armor requires a set number of ingots, a leather wrap, and an active heat source. Select the recipe and initiate the forging process.\n• **Masterwork Upgrades**: High-quality ingots (like Mithril) or a high crafting roll can trigger a **Masterwork Opportunity**. A Masterwork item gains +1 Durability tier or a special weapon/armor trait slot (e.g., +1 damage, reduced AP cost to wield, or weight reduction). See [Dynamic Weapon State](equipment-system/weapons) and [Armor Systems](equipment-system/armor).\n• **Equipment Repair**: Players can restore durability to metal weapons and armor using a smith's hammer at any forge interface, costing 1 scrap metal per 10 durability restored. See [Mortal Wear & The Art of Repair](equipment-system/durability-repair).`
            },
            {
              title: 'Alchemy (Alchemist Interface)',
              content: `The **Alchemist Brewing Interface** is used to combine organic reagents, magical extracts, and catalyst water into potent liquid concoctions.\n\n• **Organic Reagents**: Players gather flora (Sorrowbloom, Emberleaf, Sunbell) and monster organs during exploration.\n• **The Brewing Process**: Select a brewing formula in the VTT interface. Players must balance the temperature gauge within a specific range using heat controls while adding catalysts. Failing to manage temperature increases the risk of alchemical backfires (deals acid/fire damage and wastes ingredients).\n• **Potion Stacking Limits**: Due to volatile ingredients and magical residue, potions are subject to a **strict stacking limit of 10 maximum potions per inventory slot**. Trying to stack more destabilizes the container, rendering them inert. Stack potions carefully inside [Your Inventory Grid (Visual Pack System)](inventory-system/inventory-encumbrance).\n• **Elixirs vs. Potions**: Standard potions (Healing, Mana) trigger instantly, while Elixirs provide long-term buffs (e.g., Nightvision, Stoneskin) but prevent the consumption of other elixirs for 1 hour.`
            },
            {
              title: 'First Aid (Medical Interface)',
              content: `When traveling through deadly ruins, medical supplies are as valuable as gold. The **First Aid Interface** allows any character (regardless of magical ability) to treat wounds and save lives.\n\n• **Emergency Stabilization**: When an ally is in the [Dying Condition](combat-system/death-dying) (0 HP), you can spend **1 Action Point (AP)** and 1 charge of a Medical Kit to stabilize them. This stops their death saving throws instantly, returning them to 1 HP but leaving them with the [Prone](combat-system/combat-conditions) condition.\n• **Emergency Bandage Healing**: Out of combat, you can apply field dressings to heal a wounded target. This restores HP equal to 1d6 + your Wisdom modifier. Each target can only benefit from field dressings once per short rest.\n• **Medical Kits**: Basic Medical Kits contain 5 charges of bandages, splints, and salves. Advanced kits include smelling salts and anti-toxins, allowing you to cure the [Poisoned](combat-system/combat-conditions) condition with a successful First Aid check.`
            }
          ],
          tables: [
            {
              title: 'Crafting Mastery Ranks',
              headers: ['Rank', 'Difficulty Die Shift', 'Perk / Capability'],
              rows: [
                ['Novice', 'Standard Die (d8/d10/d12/d20)', 'Can craft common and uncommon recipes. Standard execution time.'],
                ['Apprentice', 'Shift Down by 1 Tier (e.g., d10 -> d8)', 'Can craft rare recipes. Wasted materials reduced by 25% on failure.'],
                ['Journeyman', 'Shift Down by 2 Tiers (e.g., d12 -> d8)', 'Unlock masterwork slot. Crafting speed increased by 50%.'],
                ['Master', 'Shift Down by 3 Tiers (e.g., d20 -> d10)', 'Can craft very rare recipes. 10% chance to duplicate brewed potions.'],
                ['Grandmaster', 'Minimum Die Cap (d4 / d6)', 'Unlock legendary recipes. Double masterwork slots. 25% chance to refund rarest reagent.']
              ]
            }
          ]
        }
      },
      {
        id: 'experience',
        name: 'Experience',
        icon: 'fas fa-trophy',
        theme: 'mechanic',
        content: {
          title: 'Experience & Leveling',
          description: 'XP sources and leveling requirements',
          sections: [
            {
              title: 'Gaining Experience',
              content: `You gain XP from defeating enemies, completing quests, overcoming challenges, and good roleplay. The GM awards XP at the end of each session.`
            },
            {
              title: 'Leveling Up',
              content: `When you gain enough XP, you level up. Leveling grants: +1 talent point, increased HP (1d8 + CON modifier), and at certain levels, attribute improvements or special features.`
            }
          ],
          tables: [
            {
              title: 'XP Requirements',
              headers: ['Level', 'XP Required', 'Total XP'],
              rows: [
                ['1', '0', '0'],
                ['2', '300', '300'],
                ['3', '600', '900'],
                ['4', '1,800', '2,700'],
                ['5', '3,800', '6,500'],
                ['6', '7,500', '14,000'],
                ['7', '9,000', '23,000'],
                ['8', '11,000', '34,000'],
                ['9', '14,000', '48,000'],
                ['10', '16,000', '64,000']
              ]
            }
          ]
        }
      },
      {
        id: 'attributes-advancement',
        name: 'Attribute Improvements',
        icon: 'fas fa-arrow-up',
        theme: 'mechanic',
        content: {
          title: 'Attribute Improvements',
          description: 'Improvement schedule and strategic choices',
          sections: [
            {
              title: 'Attribute Score Increases',
              content: `At levels 4, 8, 12, 16, and 20, you can increase one attribute by 2 points or two attributes by 1 point each. Alternatively, you can take a feat instead.`
            },
            {
              title: 'Strategic Planning',
              content: `Plan your attribute increases carefully. Reaching even-numbered scores grants better modifiers. Consider your class, playstyle, and multiclassing plans.`
            }
          ]
        }
      },
      {
        id: 'milestones',
        name: 'Milestones',
        icon: 'fas fa-flag-checkered',
        content: {
          title: 'Milestones',
          description: 'Special achievements with unique rewards',
          sections: [
            {
              title: 'Milestone System',
              content: `Milestones are special achievements beyond normal leveling. Examples include: defeating a legendary creature, completing a major story arc, or mastering a profession.`
            },
            {
              title: 'Milestone Rewards',
              content: `Milestone rewards include unique abilities, titles, special items, or permanent bonuses that aren't available through normal advancement.`
            }
          ]
        }
      }
    ]
  }
];

// Helper function to get all subcategories flattened
export const getAllSubcategories = () => {
  return RULES_CATEGORIES.flatMap(category =>
    category.subcategories.map(sub => ({
      ...sub,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
};

// Helper function to find content by IDs
export const getRuleContent = (categoryId, subcategoryId) => {
  const category = RULES_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;

  const subcategory = category.subcategories.find(s => s.id === subcategoryId);
  return subcategory?.content || null;
};

