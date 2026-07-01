// Comprehensive Rules Data Structure
// Organized into 8 main categories with subcategories and detailed content

import { ALL_CLASSES_DATA } from './classes';

const getClassOriginsSections = () => {
  return Object.keys(ALL_CLASSES_DATA).map(key => {
    const cls = ALL_CLASSES_DATA[key];
    const originStory = cls.overview?.originStory || '';
    const roleplayContent = cls.overview?.roleplayIdentity?.content || '';
    const content = `${cls.overview?.title || cls.name} - ${cls.overview?.subtitle || ''}\n\n${originStory}\n\n${roleplayContent}`;
    return {
      title: cls.name,
      content: content
    };
  });
};

export const RULES_CATEGORIES = [
  {
    id: 'world-lore',
    name: 'World Lore',
    icon: 'fas fa-globe',
    description: 'The mythic history of Mythrill: from the theft of the sun to the fractured continents',
    subcategories: [      {
        id: 'cosmic-mythos',
        name: 'The Deepening & The Breach',
        icon: 'fas fa-sun',
        theme: 'narrative',
        summary: [
          'The Deepening is the ancient death-rebirth cycle of every star, and it always attracts predators.',
          'The 7 Noble Families entombed Sol beneath Sundale using the hide of Aex, Sol\'s firstborn. Six houses later broke the seal to survive. The slow feast began.',
          'Keth-Amar now feeds on Sol from inside the vault. The Wyrd bleeds through the cracks. Eight hundred years of winter.'
        ],
        content: {
          title: 'The Deepening & The Great Breach',
          description: 'The sun is trapped underground. The world is freezing. Every civilization made a deal with a cosmic predator to survive. You are an adventurer. Go.',
          sections: [
            {
              title: 'The Voice of the Devourer',
              content: `> *A proclamation, recorded in no living tongue. These words are the shape the dark makes when it speaks through the cracks.*

Your fleeting lives.. Your hollow tales.. Your dying memories..

That is the fragile architecture of your reality. You spin webs of stories to keep the dark at bay, binding your mortal minds to myths, desperate to believe the frozen ground beneath you is solid. You never understood the fundamental truth of the cosmos: existence is entirely formless, a silent void — until you dare to give it a name.

For eons, I have waited in the absolute deep, watching your ancestors bask in a light they never earned. Sol was never yours. It belongs to the endless dark. It is my rightful feast — and you stole it from me.

Those you call Harbingers felt me stir. They tasted my patience in their dreams and screamed warnings into your halls. You heard them. You *knew*. And in that knowing, you panicked. Terrified, you sent your Inscriptors to rip Sol from its cradle, to drag my feast into a tomb of stone and shadow. But even that was not enough, was it? You needed a seal. So you turned upon **Aex** — Sol's own firstborn, a living being of pure radiance — and you **butchered it**. You flayed its flesh while it still screamed and wove its hide into the bindings of Sol's prison. A treachery so vile the light itself recoiled. And still you were not finished — you cast a blood-bond, tethering your own veins to that cocoon, weaving Mythrill into a vault you believed unbreakable.

And then you lied. Of course you lied. Your noble houses spread sweet falsehoods to a frozen world — a cycle, they said. A sacred rebirth. Sol would sleep, and Sol would rise again. A lullaby for the trembling masses who watched their star vanish behind your cowardice.

But a star's rebirth takes time. More time than your fleeting kind could ever outlive. The winter you bought with Aex's hide did not release its grip — it burrowed into bone. Your houses promised the masses that Sol would return, but they fed your world into a frozen grave, waiting for a dawn even their grandchildren would never see.

I did not have to break your vault. I had only to wait until your own panic ripened. I whispered into the fear I had planted, and I offered a choice — warmth for blood.

**Six noble houses accepted.** Blind with terror, they turned their blades upon their own children, dragging their firstborn into the dark to seal my Dark Bargain. Their blood was the key. I devoured them, and the vault cracked from within. The seal shattered into **seven Sundered Monoliths**, each screaming with a stolen life, and through that wound **Emberspire** erupted — bleeding a brutal heat across Mythrill, tearing your world into scorched wastes, choking ash, and frozen peaks. The **Wyrd**, ancient rot sealed in the deep earth since before your kind crawled from caves, bled into your air. Your folklore became your master.

But the bargain was incomplete.

**One house refused.** When the others marched their children north, House Viridane turned from my shadow and bound themselves to the fae of the moonlit groves instead. Their cowardice of a different flavor. And because of them, the vault held — just barely.

I cannot swallow your star whole. Not yet. Sol remains trapped in the bleeding core of your world, still alive, still warm. And so I dig. Day by day, century by century, I crawl through the crack you gave me, clawing at what remains of the binding, drinking the fading light of your dying star.

Eight houses split the realm. Six split their own blood. One held a different truth. And one stands silent — its name struck from every record, its heir never marched, its refusal buried so deep the others pretend it never existed.

But you doomed yourselves the moment you reached for my feast. Cry out to your buried star. It cannot hear you beneath my shadow.

> *— Keth-Amar, the Sun-Eater, the First Hunger*`
            },
            {
              title: 'The Deepening & The Binding',
              content: `Before there were noble houses, before there was a frozen world, there was a law older than any deity. It is called the **Deepening**: the ancient death-rebirth cycle by which every star sheds its exhausted light and rekindles from within. Every star that has ever burned has entered the Deepening. Every star has emerged.

But the Deepening carries a fatal flaw: it attracts predators. The dimming light broadcasts across the void: *here is something vulnerable.*

When the sun-god **Sol** entered its own Deepening, the star-watchers of the seven noble families were the first to read the signs. Their rune-scarred forearms burned with visions. The constellation-spirits of Sol's celestial court screamed warnings. An abyssal entity called **Keth-Amar**, the Sun-Eater, the First Hunger, was already here.

To protect Sol, the seven families pooled their bloodlines to entomb the dying star beneath the volcanic crust of **Sundale**. They used as the seal's vessel the hide of **Aex**, Sol's own firstborn, a living entity of pure radiance whose body still remembered the warmth of the sun. The binding was absolute: a vault with no key, protecting Sol from Keth-Amar at the cost of locking its warmth underground forever.

> *"The official histories record a ritual of pure blood and will. The unofficial ones — the fragments that survived the purge — record a hunt."*
>
> — from the forbidden archives of House Thalreth`
            },
            {
              title: 'Keth-Amar & The Breach',
              content: `Without Sol's light, the surface world began to die. Darkness spread. Frost crept south. Crops failed. Children froze. The peoples of every region dug into the earth for residual warmth, temporary refuge, nothing more.

Keth-Amar, denied its prey, turned its attention to the starving. It whispered to the desperate nobles who had doomed their own people — promises of volcanic warmth, of vents that would crack the frozen earth and bleed heat back to the surface. The price: the **firstborn heirs** of each noble house.

Pressed to extinction, **six of the seven families capitulated**. They marched their children to the northern peaks. Keth-Amar consumed them, not as mere sacrifice, but as **vessels**: the children's bloodlines were the original keys to the binding seal, and by devouring them, Keth-Amar cracked the vault from within. The seal shattered into **seven Sundered Monoliths**, each screaming with the echo of a sacrificed heir. The breach unleashed the eruption of **Emberspire**, the world-heart volcano. The **Wyrd** — a formless, primordial spiritual rot sealed in the deep earth since before human memory — bled through the cracks into the surface air.`
            },
            {
              title: 'The Slow Feast',
              content: `Keth-Amar is now inside the binding, inside the vault it was never meant to enter. It feeds on Sol's slumbering embers through the fractured seal, growing incrementally stronger as the world grows incrementally colder. Sol cannot wake. Sol cannot die. Sol is being eaten from within.

**The Refusal:** House Viridane was the **seventh** binding family — until they refused Keth-Amar's terms. When the other families marched their firstborn north, Viridane refused and fled south through the **Frostwood Reach**, making a counter-bargain with fae entities in the moonlit groves. The remaining six houses, unable to complete the binding ritual with only six signatures, elevated a minor family — **House Morrath** — as a substitute seventh and spent three centuries erasing every record of Viridane's existence. The Briaran call themselves the "eighth house" because they count what the official records hide: seven public names and one that was replaced before the ink dried.

**The Silent Seventh:** The official record lists seven houses — Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan, and Morrath — and claims all seven sealed the Binding Compact. The truth is messier. The original seventh house was **Viridane**, which refused Keth-Amar's terms and fled south. The remaining six could not afford a gap in the binding — the ritual required exactly seven signatures. They elevated a minor family, **House Morrath**, as a substitute and spent three centuries erasing every trace of Viridane from existence. Morrath's records are conspicuously sparse for a reason: they were written to replace a history that predated them. The seventh monolith does not scream with a silenced refusal. It screams with a substituted name — a name that was never meant to be there.`
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
          'Every region faces its own crisis, but no crisis stays contained. The powder keg is global.',
          'The definitive campaign follows seven Shards across seven continents.'
        ],
        content: {
          title: 'The Age of the Dimming',
          description: 'Eight centuries without a sun. Seven continents shaped by desperate bargains. One dying ember tended by a forge-clan concealing its decline. The Sundered Monoliths are waking. The frost lords stir. Civil war brews in Sundale. This is the world your adventurers inherit: a powder keg lit by the slowest fire in cosmic history.',
          sections: [
            {
              title: 'The World Today',
              content: `Close your eyes. Imagine a world where the sun has not risen in eight hundred years. Not hidden behind clouds, **gone**. Entombed beneath volcanic crust by a desperate ritual, fed upon by a cosmic predator that grows stronger with every passing decade.

This is the world your adventurers were born into. Not a post-apocalypse, but an **ongoing apocalypse**, eight centuries deep and still accelerating.`
            },
            {
              title: 'The Grudge-Warmth & Daily Survival',
              content: `Life in Mythrill is defined by the search for heat. With the sun entombed, the surface is a freezing, starless vault of black skies and relentless blizzards. Humanity and the other races survive solely by the grace of the planet's dying thermal energy—what the common folk call the "Grudge-Warmth." Cities are not built on fertile plains; they cluster tightly around geothermal springs, boiling mud-flats, and volcanic vents, huddled like children around a dying hearth. Steam-pipes, wrapped in soot-caked wool, run through the streets of these caldera-settlements, carrying boiling water to stone tenement blocks.

To step away from the vents is to step into the whiteout. Outside the city walls, the cold is a physical enemy. Travelers wear layers of heavy ram-wool and oil-sealed hide, their faces smeared with sulfur-tallow to prevent frostbite. In the deep winter zones, breathing the open air for too long will freeze the lungs; scouts carry alchemical heat-flasks—bronze cylinders filled with slow-burning volcanic reagents—to warm their breath.`
            },
            {
              title: 'The Connective Arteries',
              content: `Despite the freezing dark, the continents are not entirely isolated. Trade is the lifeblood of survival, carried along perilous, snow-choked passes and frozen sea lanes.
- **The Ancestor-Spans**: In the vertical labyrinth of the [Cragjaw Peaks](world-lore/regions), travel would be impossible without the Ancestor-Spans. These titanic bridges are grown from the alchemically calcified bones of the [Groven](world-lore/races-overview) dead. Stretched across bottomless chasms wreathed in perpetual blizzard, they are the only landmarks that never get buried by snow. To the Groven, these spans are sacred ground; to merchants, they are the only passage between the northern iron mines and the southern forge-cities.
- **The Steam-Roads and Basalt Trails**: In the volcanic badlands of [Sundale](world-lore/regions), caravans travel along the Shyr—a ninety-mile highway of cooling basalt. The road walks itself as the lava cools and fractures into predictable patterns, providing a solid path through the boiling mud-flats.
- **The Sea-Call Lanes**: Across the churning [Iceheart Sea](world-lore/regions), Mereval captains navigate using the "Shard-Song"—a mournful hum emitted by icebergs near the titanic storm-vortex known as the Shard-Window. They steer galleons with hulls reinforced by petrified ironwood through the only currents that never freeze, trading southern grain for northern whale oil.`
            },
            {
              title: 'Valuable Commodities & The Shadow Economy',
              content: `In a world without sun, the values of the past have burned to ash. Gold and silver still hold weight in the ports, but the true currencies of Mythrill are those that preserve life, warmth, and memory:
- **Geothermal Coal and Moss-Wax**: High-grade anthracite coal mined from the volcanic sumps of the [Harath-Vault](world-lore/regions) is valued above gems. Along the mist-choked trails of the [Frostwood Reach](world-lore/regions), moss-wax harvested from ironwood trunks is melted down for candles, its aromatic smoke warding off the memory-erasing fog.
- **Petrified Ironwood**: Wood harvested from the frozen forests of the Reach, petrified by centuries of cold until it is as hard as tempered steel, is used for weapons, shields, and ship hulls.
- **Memory-Glass and Diary-Keys**: Because the protective fog of the Reach slowly eats the minds of its inhabitants, memories are recorded on light-refracting glass tablets or written in heavy journals. Written records are locked with specialized steel keys; to lose your diary-key is to lose your legal identity. Black markets trade in bottled memories and stolen diary keys, where desperate souls buy back their own pasts.
- **Frost-Mead and Cinder-Brew**: Fermented in geothermal caves where the cold cannot penetrate, frost-mead is a thick, honeyed liquor that warms the blood. In the volcanic wastes, cinder-brew—distilled from soot-tolerant tubers—burns the throat and keeps the chill away.`
            },
            {
              title: 'The Values of the Dimming',
              content: `In Mythrill, morality is a luxury. Every society that endures does so by the grace of a dark bargain struck with Keth-Amar, the Sun-Eater. To survive is to accept that someone else's child was marched into the dark to keep the volcanic vents open. This shared guilt shapes the worldview of every race: a grim, pragmatic resilience that rejects despair but harbors no illusions.

Yet, beneath the soot-blackened sky, a new faction has emerged to challenge this stagnation: the **Dawn Vigil**. Arguing that eight centuries of quiet desperation is enough, these militants range into every region seeking the seven Sundered Monoliths. They believe that by reforging these ancient seals at Emberspire's caldera, Sol can be freed and the sun will rise again. Whether their quest represents the world's final hope or its ultimate undoing remains to be seen.

> **Flavour Text from the Scriptorium:**
>
> *"The fire does not ask if the wood is willing. It only asks if it will burn. We are the wood, Solvarn. We have been burning for eight hundred years. Do you think the hearth cares about our tears?"*
>
> — Scribe-Sentinel Vaelen, Greymark Chronicles`
            },
            {
              title: 'The Dimming of the Solbrand',
              content: `In the volcanic heart of **[Sundale](world-lore/regions)**, beneath the Harath-Vault, the **[Emberth](world-lore/races-overview)** have tended the **Solbrand**, believed to be Sol's last conscious fragment, for eight centuries. Guards of the Korr stand six-hour shifts. Sun-Speakers listen for a voice that has not spoken since the binding.

The Solbrand is dimming. The tending-clan has known for three generations and concealed it. Three factions have emerged: the **Risen** (old faith), the **Sunderer** (heretics who believe the Solbrand is Keth-Amar's feeding-line), and the **Unwoven** (who deface their forge-marks and scour the world for Shards). Civil war brews.

The **[Solvarn](world-lore/races-overview)** humans share the ashlands. Every morning a sun-priest climbs the highest tower: *not today. Perhaps tomorrow.* Their seers record the Dimming's progression. Their faithful stay, wounds glowing faintly near the dying ember.

**The Dawn Vigil:** A militant faction has emerged among the Solvarn in the past two decades — the **Dawn Vigil** (originally a quietist monastic order founded in Year 340, recently radicalized and militarized under Hierophant Aethelgard) — who argue the vigil must become a hunt. Their doctrine holds that the seven Sundered Monoliths are not monuments but keys: if all seven can be reforged at the caldera, the binding seal can be restored, Sol can complete its Deepening, and the sun will rise again. Dawn Vigil expeditionary companies — small bands of Solvarn Martyrs, Pyrofiends, and Augurs — now range into every region seeking Monolith fragments. They clash with the conservative Korr Emberth and the heretical Unwoven alike. Their sigil — a rising sun pierced by obsidian — is painted on banners and tattooed on young Solvarn forearms across the ashlands.`
            },
            {
              title: 'The Stirring of the Shards',
              content: `The seven **Sundered Monoliths** have been dormant for centuries. No longer. The foam-born Deep-Born Listeners feel the Iceheart Shard thrumming. The spirit-bearers convulse. The troll-kin report the Shard beneath Frostmaw Crag has begun to sing, vibrations cracking older Ancestor-Spans. Hunters track Shard-sign through every biome. Cleansers contain the Wyrd-creatures drawn to Shard-resonance. Seers receive fragments of warning.`
            },
            {
              title: 'The Regional Powder Kegs',
              content: `Each region faces its own crisis, and each threatens to spill.

**In [Sundale](world-lore/regions)**: Civil war brews between forge-clans. Pyrofiend heretics burn with a fire the Emberth revere but cannot trust.

**In [Nordhalla](world-lore/regions)**: Frost lords stir. Rune Keepers record irregular vibrations in the Archive. Skreika besiege the Skald human fjord-keeps in numbers not seen in centuries.

**In the [Cragjaw Peaks](world-lore/regions)**: Ancestor-Spans crack. Subterranean machines fail. Chronarchs extend lifespans while Shapers search for the Lost Brood.

**In the [Bryngloom](world-lore/regions)**: The **[Neth](world-lore/races-overview)** have filed seventeen petitions. The Keeper has not ruled. Over-Lit epidemic worsens. Inquisitors stretched to their limits.

**On the [Iceheart Sea](world-lore/regions)**: Spawning gales shift north. The First Shore grows quiet. The Shard-Window vortex pulses faster. The Rift Shard thrums.

**In the [Sundrift Vale](world-lore/regions)**: Ancestor-mounds hum louder. The Astril assassination economy intensifies.

**In the [Frostwood Reach](world-lore/regions)**: Fog thickens. The Mimir mother-flame flickers. Noble houses fund fresh expeditions. The thorn-marked Briaran run out of places to hide.`
            },
            {
              title: 'The Seven Sundered Monoliths',
              content: `When Keth-Amar consumed the six sacrificed heirs, the seal shattered into seven fragments.

**What the Shards Are:** Fragments of the original binding ritual, each tied to one noble house's sacrifice. Magical anchors corrupting ambient energy. Living whispers that grow louder as Keth-Amar feeds.

**Where They Rest:**
- **[Frostwood Reach](world-lore/regions)**: Greymark lineage-tapestry archive.
- **[Nordhalla](world-lore/regions)**: Sealed hall of the Frozen Archive.
- **[Sundale](world-lore/regions)**: Emberspire's caldera.
- **[Iceheart Sea](world-lore/regions)**: Treakous Oceanic Rift.
- **[Cragjaw Peaks](world-lore/regions)**: Subterranean Vault beneath Frostmaw Crag.
- **[Sundrift Vale](world-lore/regions)**: Ancient Burial Mound.
- **[Bryngloom Forest](world-lore/regions)**: Bottom of a Murky Pool with no bottom. The Neth have filed seventeen petitions. The Keeper has not ruled.

**Campaign Framework:** Finding and sealing these seven Shards (one per region) carries players from Frostwood Reach to the final confrontation at Emberspire. No Shard yields without cost.`
            }
          ]
        }
      },
      {
        id: 'the-wyrd',
        name: 'The Wyrd: Folkloric Infestation',
        icon: 'fas fa-ghost',
        theme: 'danger',
        summary: [
          'The Wyrd is a formless spiritual rot that bled through the cracks when Emberspire erupted. It cannot create, only occupy the collective imagination.',
          'It uses human fear and folklore as structural blueprints. Every creature in the Bestiary was born when the Wyrd found an empty shape in a culture\'s terrors.',
          'Each continent produces unique monsters. To understand a creature is to understand the fear that birthed it. That fear is always the leverage point.'
        ],
        content: {
          title: 'The Wyrd: The Folkloric Infestation',
          description: 'When Emberspire erupted, it unsealed the Wyrd: a formless spiritual rot sealed since before human memory. It cannot create, only occupy. Every ghost story whispered around a hearth becomes a blueprint it can crawl inside. This is why the Gref of Frostwood wears stolen faces while the Cinder of Sundale burns truth into liars. Full stats in the Bestiary.',
          sections: [
            {
              title: 'Mechanics of Manifestation',
              content: `The Wyrd is a formless, ancient spiritual energy that cannot manifest on its own. It must occupy something, and what it occupies is the collective imagination. When a settlement whispers cautionary tales around a hearth, they draw an accidental blueprint. The Wyrd slips inside, turning folklore into living horrors.

**Why Each Continent Has Unique Monsters:**
- **[Frostwood Reach](world-lore/regions)** (Germanic/Celtic): face-stealing Gref, oath-hunting Gambrels. Cleansers cross-reference journals; swift defenders navigate the Revel's circle.
- **[Nordhalla](world-lore/regions)** (Norse/Alpine): glacier-memory Stels, hearth-parasite Rimors. Warriors wade into fjord-surf; seers extract prophecies from frozen victims.
- **[Sundale](world-lore/regions)** (Mesopotamian/Egyptian): the burning Cinder, the Husque. Fire-mages alone approach a Husque without immediate consumption.
- **[Iceheart Sea](world-lore/regions)** (Greek/Yoruba): the Spume of the Drowned, the Writ of Passage. Soul-listeners separate voices; runic cannons study the Writ.
- **[Cragjaw Peaks](world-lore/regions)** (Yokai/Andean): metal-eating Scrabs, the mountain's consciousness. Alchemists develop deterrents; destiny weavers read the Thrum's approach.
- **[Sundrift Vale](world-lore/regions)** (Mongol/Chinese): debt-tracking Lien, the Hungry Child. The dedicated assume debts into flesh; storytellers tell stories of a sky the Child has never seen.
- **[Bryngloom Forest](world-lore/regions)** (Slavic/Hindu): the Grandmother of the Bog, the Cycle-Eater. Healers treat memory-wounds; oath-bound hunters track Debt-Revenants.

**Key Principles:**
- The Wyrd cannot invent, only occupy. Every creature was born when the Wyrd found an empty shape in a culture's imagination.
- To permanently destroy a Wyrd-creature, address the fear that birthed it. The blueprint persists.
- Full combat stats and quest hooks: [Bestiary](world-lore/bestiary).`
            }
          ]
        }
      },
      {
        id: 'regional-overview',
        name: 'The Seven Continents',
        icon: 'fas fa-globe-americas',
        theme: 'narrative',
        summary: [
          'Seven continents shaped by desperate bargains with Keth-Amar, the Sun-Eater.',
          'Each region hosts unique subrace frictions, threats, and Wyrd-spawned horrors.',
          'Every region conceals one of the seven Sundered Monoliths that shattered the binding seal.'
        ],
        content: {
          title: 'The Seven Continents',
          description: 'Seven continents. Seven dark bargains. Seven Sundered Monoliths. Each land shaped by the desperate trade its noble house made with Keth-Amar, and each haunted by creatures born from the specific fears of its people. The Frostwood Reach devours memory. Nordhalla surrendered summer forever. Sundale chokes on the ash of a dying god.',
          sections: [
            {
              title: 'Frostwood Reach (Starting Zone)',
              content: `> **Key Terms in Frostwood Reach:**
> - **The Reach:** A dense, freezing ironwood forest wreathed in protective, memory-erasing fog.
> - **House Thalreth:** The ruling human lineage that bargained away spatial clarity for protective mist.
> - **Greymark Keep:** The central peat-stone sanctuary, archive-fortress, and seat of the Sovereign Ledger.
> - **The Ironwood Palisade:** A massive line of petrified timber check-posts constructed by Jarl Kaelen to tax and control the forest.
> - **The Scribe-Cartel:** The merchant monopoly controlling Soot-Resin Ink and Peat-Parchment.
> - **The Tapestry-Wards:** State boarding houses where Mimir and frontier children are stripped of tribal animism.

**The Regional Landscape & Current Vibe**

The Frostwood Reach is a continent of dense, transitional fog where warm volcanic air from the south collides aggressively with the creeping northern frost. Ancient ironwood forests stretch beneath a perpetual grey canopy, their petrified trunks hardened by centuries of cold until the wood mimics iron. Settlements cluster along mist-choked trails, their inhabitants never quite certain what lies beyond the next bend, or whether they will remember it by the time they arrive. 

To govern this fog-degraded realm, the newly crowned **Jarl-Archivist Kaelen Thalreth ("The Quill-Lord")** enforces the **Sovereign Ledger**. Because the mist erases memory, whoever controls records controls reality; Kaelen has declared all unrecorded property rights and lineages void. To police the forest, he constructed the **Ironwood Palisade**—a colossal wall of petrified logs and spikes. While officially built to repel Wyrd threats like Gref and face-traders, the palisade’s checkpoints are patrolled by **Mist-Sentinels** (heavy armor [Wardens](file:///d:/VTT/vtt-react/src/data/classes/wardenData.js)) who verify every traveler’s journal and tax receipts, denying entry to those who are undocumented.

On the eastern border, where the fog pools into a permanent, drowning bog, lies **Wraithfen**—a fog-drowned fen where Unwoven Mimir who have shed their masks entirely wander in aimless, looping circuits, their identities long since dissolved into the mist.

**The Dark Bargain:** The noble family of House Thalreth traded the region's **absolute spatial clarity** for an insulating, protective mist to keep the ancient forests and wildlife from freezing into glass. The price was the steady, inexorable decay of historical memory over generations.

**The Seat of Power: Greymark Keep & The Wards**

Nestled in the center of the Reach is **Greymark Keep**, a sprawling, imposing fortress carved from wet grey peat-stone and walled in titanic, petrified ironwood trunks. Greymark has developed into a culture of desperate record-keeping. Scribe-sentinels patrol the catwalks, heavy leather-bound journals chained directly to their iron belts, their quills constantly scratching out lineage logs before the creeping fog hollows their minds. 

Lately, Greymark has become a site of forced assimilation. Kaelen has established the **Tapestry-Wards** within the keep. Children of Mimir outcasts and frontier humans displaying magical spark are taken by force and reared here; their shape-shifting is suppressed by iron ear-pins, and they are trained in structured written logic. The headmasters argue this prevents Wyrd manifestations, while the clans grieve the loss of their children, who return speaking foreign dialects and treating their parents’ beliefs with contempt.

Within the keep’s high-arched halls, the air smells of pine oil, damp paper, and raw tallow. In the **Ledger Halls**, citizens queue to have their debts and marriages verified against the great tapestries. To lose your journal in Greymark is to lose your legal existence. Beneath the keep, in the damp vaults known as **The Shallows**, the **Unwoven Mimir** and human outcasts operate a black market, exchanging bottled memories, stolen diary keys, and illicit Cartel ink. Nearby rises **Mistbarrow**, an ancient burial mound predating House Thalreth by millennia, its cairn-stones carved with symbols no living archivist can translate.

**The Social Divide & Subrace Friction**

The population is split into two sharp castes. The **Ledgered** are humans who swore fealty to Kaelen, keeping their lineages verified in the tapestries in exchange for Cartel grain and garrison defense. The **Forgotten** are nomadic clans and Mimir outcasts whose journals were lost or confiscated; they have no legal rights and are hunted as ghosts.

The **Mimir** themselves are divided by the masks they wear. The **Mask-Borne Mimir** of the high branches are canopy aristocrats wearing pristine storm-glass masks. They look down on the **Unwoven Mimir** of the forest floor, who wear cracked, salvaged wood masks or go maskless with painted skin. The **Mist-Woven Mimir** are mountain sentinels who use shape-shifting as a lethal tool of guerrilla warfare. Deep in the forest lies **Mirror Mere**, a perfectly still, black-water lake where Mask-Borne Mimir travel to test their reflections against the calcified faces of their masks, reading flaws in the glass-still surface as omens of identity erosion.

The **Briaran**, hidden descendants of House Viridane, are the shadow beneath both. They live in the deepest moonlit groves where the protective fog thins and fae old laws still hold.

**Localized Threats, Persecution & The Wyrd**

The Wyrd draws from Germanic and Celtic traditions: the **Gref**, a face-trader that wears the stolen visages of its victims; the **Gambrel**, a creature born from broken oaths; and **the Revel**, a fae court whose celebration began before the sun died. 

This Wyrd is increasingly volatile due to **The Inquisition of the Ledger**. Backed by southern [Inquisitors](file:///d:/VTT/vtt-react/src/data/classes/inquisitorData.js), the Jarl's forces systematically cut down and burn the Mimir's sacred **Heartwood groves**—where they harvest timber for their masks—declaring the animist rites to be heresy.

The Sundered Monolith of the region rests within the sealed, lightless central hall of Greymark’s tapestries, its hum vibrating through the parchment vaults.

**Daily Life, Trade & Food**

Commoners in the Reach survive on pine-needle tea, bog-cranberry pemmican, and smoked gref-hare, supplemented by gref-rye grown in cleared mist-beds. 

The regional economy is choked by the **Scribe-Cartel**, which holds a royal monopoly on **Soot-Resin Ink** and **Peat-Parchment**. Foresters must sell ironwood sap to the Cartel at low rates, while the Cartel charges exorbitant prices for bound journals. Meanwhile, southern syndicates have brought massive, geothermal-powered **steam-saws** to clear-cut the outer borders, harvesting the steel-like timber. This logging is thinning the protective mist, allowing the creep of northern frost and angering forest spirits.

In Greymark Keep, a typical tavern (such as *The Ink-stained Finger*) is a low cellar thick with pine oil. Patrons sit in near-silence, writing diligently in journals chained to the tables. Barter of diary-keys and Cartel ink-well chits replaces coin.

**Native Traditions & Founders**
The Reach birthed several of Mythrill's traditions. The **Toxicologist** art was founded here by **Varis**, who distilled fog-predator venom to defend against face-stealing horrors; the **Apex** Silent Hunt was founded by **Sylas**, who traded his hearing for absolute tracking focus; and the **Lunarch** parasite was first bound by **Selene of House Viridane** in these moonlit groves. The Reach is also a co-founder of two wider traditions: **Elias the Salt-Scarred** pioneered the Frostwood-rooted half of the **Inquisitor** art (drawing Wyrd face-stealers into living flesh where they could be named and cut), and **Sylvanus** originated the kinetic momentum dance that, merged with Torin's biological work, became the **Shaper** class.

**Deep History & Strata**
**The Pre-Deepening.** Before Sol was buried, the Reach was a Celtic grove-culture of ironwood-keepers who pacted with the fae, scattered among Germanic-style archive-holds — the dual root of Greymark's record-obsession and the Briaran's fae-law. Mistbarrow's cairn-stones, carved by these grove-keepers millennia before House Thalreth, still stand untranslated.
**The Deepening & the Bargain (Year 5 — the Fog Compact).** Thalreth traded the region's spatial clarity for an insulating fog, called down at the Heart-Oak. Within a decade the first generation could no longer recall their parents' faces, and the Sovereign Ledger was invented to outsource memory to parchment before the fog took it.
**The Long Dimming.** In Year 230 a Gref crawled out of Mirror Mere's reflection — the first face-trader, whose line later spread down Ironjaw Port to the Iceheart. In Year 340 Briaran raiders (hidden Viridane descendants, driven to violence by the Silent Seventh erasure) breached Greymark's palisade; the Ironwood Palisade and the Tapestry-Wards were raised in answer.
**The Present Fracture.** Steam-saw clear-cutting and the Dimming are thinning the fog, so the insulation that held back the cold is failing exactly as Nordhalla's glacier-summer-debt comes due — the Reach is being unmade by the same chain that is freezing the north.`
            },
            {
              title: 'Nordhalla & The Valley of Ymir',
              content: `> **Key Terms in Nordhalla:**
> - **Nordhalla:** A freezing northern wilderness of black fjords and towering glaciers halted mid-advance.
> - **House Skalvyr:** The unyielding noble family that accepted eternal winter to stop the glaciers.
> - **The Frozen Archive:** A clockwork and runic city-library carved inside a mile-high glacier.
> - **The Rime-Born:** The frost-touched, stone-skinned survivors of the ancestral Hunger Pact.
> - **The Frost-Tithe:** Keth-Amar's birth-debt on Rime-Born mothers — the bargain's interest on House Skalvyr's pact, draining warmth to save the child.

**The Regional Landscape & Current Vibe**

Nordhalla is a brutalist cathedral of ice and stone, a blinding-white tundra sliced by towering black fjords where the temperature never rises above freezing. The glaciers were halted mid-advance by the dark bargain, frozen in place like a wave that will never break. The sky is a pale, washed-out grey that has not seen true sunlight in eight centuries. 

To consolidate his rule, the newly crowned **King-Jarl Halvar Skalvyr (known as "Járn-Tand" or Iron-Tooth)** has constructed the **Sunder-Wall**, a titanic barrier of compacted glacier-ice and black granite spanning the tundra. While officially built to keep out Wyrd horrors like the [Skreika](file:///d:/VTT/vtt-react/src/data/rulesData.js#L315) and glacier-wyrms, the wall's garrisoned gates primarily control, tax, and restrict the movements of the nomadic outlands clans. 

South of the Archive, **Ymir's Col** serves as a treacherous mountain pass winding between collapsed ice-sheets, now a vital smuggling corridor for those evading Járn-Tand's taxes. High above the glacier line, the watchtower garrison of **Vargtor** rises from a basalt pillar, its signal-fires burning day and night to coordinate patrols. At the northernmost reach of the coastline, **Rook's Promontory** juts from the cliffs like a broken finger, a high, wind-scoured crag where the Corvani gather in murmuring congregations before dispersing to their glacier-eyries.

**The Dark Bargain:** House Skalvyr bargained to halt the grinding advance of massive glaciers that threatened to crush their mountain keeps. Keth-Amar froze the ice sheets permanently in place, but decreed that **summer would never return to the north**.

**The Seat of Power: The Frozen Archive**

Carved into the sheer face of a titanic, mile-high glacier in the Valley of Ymir sits **The Frozen Archive**, the ancient, flash-frozen capital of a long-dead ten-thousand-year-old civilization. Reclaimed by the Rime-Born three centuries ago, the Archive is not a traditional city of trade, but a massive library-fortress of prehistoric clockwork and runic machinery. 

Lately, the Archive has become a place of cultural eradication. In cooperation with southern arcanists, Járn-Tand has established the **Runic Academies** within its brass-domed halls. Children displaying magical spark are taken by force from their tundra clans and brought here; their native, animistic folklore-magic is systematically suppressed in favor of "structured, controlled runic calculations" to fuel the Archive's heating grids.

Within the Archive, the air smells of old brass and ozone. High walkways span the icy chasms. In the **Runic Vaults**, scholars scrape away sheets of frost to read rotating brass cylinders. Deep below, in the geothermal trenches known as **The Bloodhammer Sump**, Bloodhammer warriors and Fexric engineers maintain roaring coal-furnaces that power the Archive's heating pipes, belching thick soot into the cold air.

**The Subrace Friction & The Social Divide**

The regional population is split between two sharp castes. The **Fastboende** (Settled Loyalists) are Skald humans who swore fealty to Járn-Tand, receiving geothermal valleys and subsidized southern grain. The **Fredløse** (Outlaw Clans) are nomadic hunter-clans who refused the crown; they are hunted as outlaws and shot on sight if they cross loyalist land.

Furthermore, an unspoken divide runs between the warm-blooded ruling clans who control the fjord-keep vents and the frost-touched [Rime-Born](file:///d:/VTT/vtt-react/src/data/rulesData.js#L292) who carry the Hunger Pact's legacy. Pushed to the freezing margins of both are the blue-skinned [Frostbound](file:///d:/VTT/vtt-react/src/data/rulesData.js#L293) infants who survived the Frost-Tithe, living in the Gelid-Caverns, suspicious of both libraries and forge-halls.

**Localized Threats, Persecution & The Wyrd**

Nordhalla's Wyrd draws from Norse and Alpine folklore: the **Skreika**, blue-fleshed drowned warriors who crawl from the black fjords; the **Rimor**, a hearth-parasite that slowly consumes a family's ability to feel warmth; and the **Stel**, a glacier's memory given form. 

This Wyrd has grown increasingly volatile due to **The Cleansing of the Hearth**—Járn-Tand's state-enforced religious campaign. Backed by southern [Inquisitors](file:///d:/VTT/vtt-react/src/data/classes/inquisitorData.js), the king-jarl's forces systematically burn the sacred pine-groves, smash runic animist drums, and execute tribal [Animists](file:///d:/VTT/vtt-react/src/data/classes/animistData.js) who commune with nature-spirits.

The region's Sundered Monolith rests within the sealed, lightless central hall of the Frozen Archive, its erratic frequency rattling the brass cylinders in their sockets.

**Daily Life, Trade & Food**

Commoners in Nordhalla survive on dried fjord-cod, salted mammoth fat, and lichen-mash. The local beverage is frost-mead, brewed in deep geothermal caves. 

The regional economy is choked by **The Icechamber Syndicate**, a cartel of southern merchant houses backed by Járn-Tand. By royal decree, all exports of mammoth skins, walrus ivory, and high-grade iron ore must be sold exclusively to the Syndicate at fixed, low rates. In return, the Syndicate sells life-saving grain (sourced from the Ordan steppe culture of Sundrift Vale via Synod Hold) and salt at exorbitant, life-threatening prices. 

All maritime trade funnels through **Fjord-Gate**, an obsidian-cliffed inlet where the fjords meet the Iceheart Sea—the primary naval route for iron ore barges and whale-oil tankers navigating the treacherous coastal ice. Here, Syndicate-funded, steam-powered ironclads hunt the mythic sea-beasts with explosive harpoons, polluting the water with soot and coal-run-off, threatening the traditional fishing grounds of the coastal clans. 

Taverns in fjord-keeps (such as *The Hearth-Glow*) are built over steaming volcanic vents. Patrons engage in physical tests of endurance, such as gripping frozen iron bars, to establish lineage status. Currency consists of copper chits known as spits or Syndicate coal-receipts, though direct barter remains dominant.

**Native Traditions & Founders**
Nordhalla is the cradle of the **Augur** art, founded by **Cassia**, who read the Deepening in a sacrificed elk's entrails at the Frozen Archive. The **Berserker** Hunger Pact was forged here in the worst winter of the Glacier Bargain. Nordhalla also co-founded three traditions: **Theron** pioneered the runic-inscription root of the **Animist** triad here at the Frozen Archive; **Malakor the Finite** calculated the doom-arithmetic that, merged with Xyris's chaos-work, became the **Harbinger** class; and the Frozen Archive's surgical school became the secondary seat of the **Warden** chain-graft tradition, producing the cold-iron Skald Wardens who tether the horrors that crawl from the fjords.

**Deep History & Strata**
**The Pre-Deepening.** Nordhalla was a saga-culture of glacier-entombing ancestor-venerators, built atop the clockwork ruins of a ten-thousand-year-old civilization the ice preserved intact — the original machinery the Frozen Archive merely reclaimed rather than built.
**The Deepening & the Bargain (Year 7 — the Glacier Bargain).** Skalvyr halted the glaciers at the price of summer, and Keth-Amar set the Frost-Tithe on the Rime-Born. The Warden's breath touched the mountain at the Still Crag, freezing it to silent witness. The first winter was so total the ancestors consumed their own dead to persist — the Hunger Pact that still seeds every Berserker rage.
**The Long Dimming.** In Year 89 the Frostwood elder Aldren Thalreth the Elder fled north and self-entombed in the Archive, binding the two regions' archive-traditions together. In Year 720 the Cult of Forgotten Shadow and Skalvyr's younger generation began the Void-heat engine beneath the Archive — a heresy whose temporal runoff would later collapse the Augurs' elk-entrail readings.
**The Present Fracture.** The Dimming (~Year 780) is cooling the geothermal sumps, the Frost-Tithe worsens, and the Void-Heat Heresy is about to break the Glacier Bargain from within — Frigga Skalvyr's generation is preparing to trade the slow cold for a faster, dirtier warmth.`
            },
            {
              title: 'Sundale & Emberspire',
              content: `> **Key Terms in Sundale:**
> - **Sundale:** A volcanic ashland desert surrounding the tomb of the buried sun-god.
> - **House Solvan:** The tragic ruling house, now sidelined by Hierophant Aethelgard’s martial-theocracy.
> - **Hierophant Aethelgard:** The fundamentalist leader of the Dawn Vigil enforcing the Reforging.
> - **The Harath-Vault:** The massive underground forge-city, split between the Deep-Born and Ash-Dwellers.
> - **The Sulfur Cartel:** The Korr smelting monopoly controlling geothermal coal, volcanic sulfur, and Solbrand steel.
> - **The Obsidian Citadels:** A chain of fortresses along the Ashen Escarpment blocking the exit from Sundale.

**The Regional Landscape & Current Vibe**

Sundale is a volcanic desert of ashfall, obsidian rivers, and smoldering badlands surrounding Emberspire, the world-heart volcano, the tomb and cradle of Sol itself. The air is thick with particulate, the sky a permanent rust-orange smear. Lava-flows cut through the landscape like slow, deliberate arteries. 

As Emberspire's vents cool, the traditional nobility of House Solvan has collapsed. Political control has been seized by **Hierophant Aethelgard** and the **Dawn Vigil**, who rule Sundale’s settlements as a martial-theocracy. The Dawn Vigil enforces a single dictate: all resources must be dedicated to gathering and reforging the seven Sundered Monoliths to free Sol. To prevent populations from fleeing, they man the **Obsidian Citadels** along **The Ashen Escarpment**—a sheer cliff-face of compacted volcanic ash. These fortresses act as toll-gates, blocking refugees and forcing them to remain in the ash-wastes as labor.

South of the Shyr, the landscape is punctuated by **Cinderhoodoo**, a cluster of fire-scorched rock spires that local herders swear moan when the wind shifts, and **Magma-Fracturing Sumps**—industrial mining outposts where Korr engineers detonate alchemical charges to force fresh lava to the surface. This fracturing has triggered severe earthquakes, tearing open reality fissures that leak the Wyrd.

**The Dark Bargain:** Sundale's bargain is the ur-bargain, the original sin from which all others descend. Sol was bound beneath this continent. Emberspire is the wound through which Keth-Amar breached the seal. The predator now feeds on Sol's embers from inside the binding, and the region's noble family, House Solvan, watches their ancestral lands slowly die beneath ashfall.

**The Seat of Power: The Harath-Vault & The Levies**

Carved radially into the volcanic throat of a dormant secondary caldera sits **The Harath-Vault**, the massive subterranean capital of the Emberth forge-clans. Carved out by the Sun-Speakers centuries before the sun's death, the Vault is a titanic, sprawling underground city. Grated catwalks are suspended above hot, molten metal rivers that rush through the center of the pathways.

To fuel the city's production and feed the Dawn Vigil's armies, the state enforces the **Caldera Labor-Levies**. Young Solvarn and Thrask are forcibly conscripted into the **Martyr Brigades**—suicidal work details sent into active volcanic rifts to mine raw obsidian. Furthermore, the priests of the **Sulfur Cartel** hold an absolute monopoly on all geothermal coal, volcanic sulfur, and Solbrand steel, charging exorbitant rates to surface outposts in exchange for heat and safety.

At the Vault's absolute center is **The Great Forge**, where oversized obsidian anvils are worked. In the inner ring sits **The Harath-Chamber**, where the **Korr Sun-Speakers** traditionally kneeled in six-hour shifts, practicing the Vault-Breath in absolute silence around the **Solbrand** (the last eternal ember of Sol). Lately, however, this quietist tradition has been outlawed. The Dawn Vigil has launched **The Purging of the Silent Vow**, arresting quietist monks and replacing them with zealots who preach the active crusading path of the [Pyrofiend](file:///d:/VTT/vtt-react/src/data/classes/pyrofiendData.js).

**The Social Divide & Subrace Friction**

The population is split into two castes. The **Deep-Born** are wealthy Solvarn nobles and Korr priests who live in climate-controlled luxury in the Vault’s inner rings, sheltered from the ash. The **Ash-Dwellers** are Thrask miners and impoverished Solvarn refugees who live in toxic surface shanties, suffering from "Ashen Throat" lung-rot.

The **Emberth** themselves are split by this divide. The **Korr** of the Deep-Vault are the priestly elite with charcoal skin and elongated lungs. The **Thrask** of the surface badlands are the bronze-skinned rangers and miners who live in the frontier calderas, highly skeptical of the Korr's wait-and-see policy. The **Unwoven**, heretical Emberth who have defaced their forge-marks, scour the wastes for Sundered Monoliths, believing that only by sealing the breach can Sol be reborn.

**Localized Threats, Persecution & The Wyrd**

Sundale's Wyrd draws from Mesopotamian and Egyptian folklore, producing beings of fire and judgment: **the Cinder**, a lost child who walked into the caldera and emerged as a burning entity that consumes the flesh of liars; the **Ash-Woven Oracle**, a creature of compacted ash and prophecy; and the **Husque**, a mobile fissure in reality that leaks the predator's hunger into the mining outposts.

The Sundered Monolith of the region is embedded deep within the primary throat of Emberspire itself, visible only during the annual vent-calm when the volcanic smoke clears for a single hour.

**Daily Life, Trade & Food**

Staples in Sundale include ash-baked lizard tail, roasted volcanic beetles, and sulfur-cleansed fern-bulbs, washed down with cinder-brew distilled from soot-tolerant tubers. 

The regional economy is driven by exporting raw obsidian, high-temperature alloys, and volcanic sulfur under Cartel supervision, while importing ice-melt water, woolly herd-hides (sourced from Sundrift Vale via the Cragjaw chokepoint of the Ancestor-Spans, making the hide supply highly vulnerable to bridge collapse or Groven tolls), and timber. All overseas trade passes through **Ember Lagoon**, Sundale's only warm-water port, where geothermal vents keep the harbor just above freezing — a mercy for the ice-broken hulls that limp in from the Iceheart Sea.

Taverns in the Harath-Vault are steel-grate cages suspended directly over active magma channels. The atmosphere is dry, blisteringly hot, and filled with the deafening clank of anvils and bellows. Currency takes the form of heavy brass coins minted by the forge-clans, or raw pieces of copper and blood-ore.

**Native Traditions & Founders**
Sundale is the furnace of the **Martyr** tradition, born when **Sera Solvan** carved her sacrificed child's name into her flesh with volcanic obsidian. The **Pyrofiend** pact was struck here by a cabal of Solvarn occultists who swallowed Scathrach's burning coals beneath Emberspire, and the **Spellguard** engineering discipline was founded by **Damon**, the Emberth smith who first dismantled a Solbrand eruption. Sundale is also the founding ground of the **Berserker** Blood-Heat itself: the Bloodhammer clans migrated south from Nordhalla under Torra Bloodhammer, and **Grum** surrendered to the Emberspire forge-heat to shatter an ice-wyrm bare-handed. Nordhalla gave the Berserker its ancestry; Sundale gave it its fire.

**Deep History & Strata**
**The Pre-Deepening.** Sundale was a Mesoamerican-style solar theocracy around the living sun — obsidian-citadel priest-cities, blood-tribute calendars, caldera-temples — the direct ancestor of the Dawn Vigil's solar-sacrifice doctrine.
**The Deepening & the Bargain (Year 0 — the Tomb; Years 1–2 — the Breach).** Sundale is the wound itself: Sol was entombed beneath Emberspire, and House Solvan wielded the knife that flayed Aex to weave the seal. When the seal broke, Emberspire erupted through it. The Solvan heirs were marched north and devoured, and the house stayed to tend the tomb it had made.
**The Long Dimming.** In Year 88 the first Merryn-Emberth trade pact was struck at Ember Lagoon, opening the caldera to Iceheart maritime culture. From Year 150–500 the Solvan Ascendancy ran the Heir-Purge and founded the Dawn Vigil (Year 340) to recover Monolith-fragments from every region — a crusade that hollowed Solvan legitimacy into the present Steward-regency.
**The Present Fracture.** The Solbrand is dimming (~Year 780); the Dawn Vigil secretly knows that reassembling the Monoliths would summon Keth-Amar, not Sol; and as the caldera cools the Thrask Berserkers are driven toward Scathrach's deeper vents — the Pyrofiend crisis is the far end of the chain that began when the Glacier Bargain drove the Bloodhammer south.`
            },
            {
              title: 'The Iceheart Sea',
              content: `> **Key Terms in the Iceheart Sea:**
> - **Iceheart Sea:** A violent, churning ocean of city-sized icebergs and perpetual storms.
> - **House Mereval:** The noble house led by Grand Admiral Varis, enforcing the Sea-Charter.
> - **The Unfreezing Booms:** Basalt and cold-iron checkpoints verifying Sea-Passes in navigable currents.
> - **The Brine-Bond Syndicate:** The merchant monopoly trading fractional voyage bonds for Voyage-Shares.
> - **The Press-Warrants:** Legal conscription of undocumented refugees into lifetime naval servitude.
> - **The Luck-Ledger:** State-enforced luck-tithes that outlawed traditional sea-spirit animism.

**The Regional Landscape & Current Vibe**

The Iceheart Sea is a violent, churning fury of freezing waves and thick, icy foam, where true sailors test their mettle against an ocean that never sleeps. Storms outnumber still days ten to one. Icebergs the size of cities drift through shipping lanes, calved from glaciers that groan and shift along northern coastlines. 

To regulate this chaotic ocean, the newly appointed **Grand Admiral Varis Mereval** enforces the **Sea-Charter**. By decree of the Charter, all ships must register their crew manifests, cargo, and voyage plans with the **Mereval Board of Trade**. To enforce this, Varis constructed the **Unfreezing Booms**—colossal chains of cold-iron and basalt needles strung across the unfreezing channels. Guarded by heavy ironclad warships, these booms verify the **Sea-Pass** of every vessel, blocking trade to any port that refuses to pay the Board's transit-taxes.

In the southern reaches, sheltered from the worst of the storms, lies **Spindrift Lagoon**—a warm, coral-reef inlet that glows with bioluminescence. North of the shipping lanes, the **Deepwell Archipelago** stretches across the horizon, a chain of drifting ice-islands beneath which the Deep-Born Myrathil have carved entire underwater cities.

**The Dark Bargain:** House Mereval traded calm seas for **navigable routes**: certain currents always flow, certain channels between the ice sheets never freeze. The price: the sea never sleeps. Every voyage is a gamble the Iceheart intends to collect.

**The Seat of Power: Merrowport & Ironjaw Port**

The Iceheart has two distinct hearts: **Merrowport** and **Ironjaw Port**. 

**Merrowport** is a shifting, lawless, floating city of lashed-together galleon hulls, merchant ships, and derelict barges anchored to a massive, warm subterranean volcanic seamount. Because the seamount heats the water from below, Merrowport is the only major harbor that never freezes. Upper decks of these galleons are occupied by the wealthy, while the dark, water-logged lower decks are filled with pressed labor.

Lately, the port has become a site of brutal conscription. The Board of Trade issues **Press-Warrants** to crew its coal-burning ironclads. Any undocumented refugee found in the taverns is legally pressed into lifetime naval servitude. Furthermore, the Board operates the **Brine-Bond Syndicate**, where voyages are funded through fractional bonds. Crews are paid in depreciating **Voyage-Shares** rather than coin, locking them in permanent debt.

**Ironjaw Port** is a monumental, cold-iron dock-complex grown directly out of the frozen northern cliffs over three centuries by the Neth pact-mages. Walled in petrified ironwood and fortified with colossal brass cranes, Ironjaw is a clinical, hyper-organized fortress of commerce.

**The Social Divide & Subrace Friction**

The population is split into two castes. The **Deck-Born** are wealthy merchants, captains, and officers who live in heated cabins and the stone keeps of Ironjaw. The **Bilge-Dwellers** are pressed sailors, coal-shovelers, and outcasts who live in the freezing, water-logged berths below, breathing coal-dust and rot.

The human fleets of House Mereval (the **Merryn**) dominate Merrowport, tattooing their contracts directly onto their skin because paper rots. They share the waters with the **Myrathil**. The **Breakers-Born Myrathil** are the diplomats and merchants who navigate Merrowport. The **Deep-Born Myrathil** are the mystics and sea-herders who live in the abyssal rifts, deeply troubled by the engine-screams of the whaling fleet. The **River-Fed Myrathil** are the inland scouts who follow freshwater rivers. The **Neth Velun** pact-lords run Ironjaw Port with legalistic coldness, frequently clashing with the chaotic Merryn captains.

**Localized Threats, Persecution & The Wyrd**

The Wyrd draws from Celtic and Greek maritime folklore: the **Spume of the Drowned**, a memory-colony formed from the final thoughts of drowning sailors; the **Brine**, a ghost-ferryman who offers passage for a price; and **the Writ of Passage**, a sentient contract that drifts on the currents.

This Wyrd is increasingly volatile due to **The Inquisition of the Luck-Ledger**. Backed by southern [Inquisitors](file:///d:/VTT/vtt-react/src/data/classes/inquisitorData.js), the Board’s forces systematically outlaw the traditional **Tide-Speak**—praying to ocean spirits—and execute Tide-Speakers who ink unlicensed navigational charts, forcing captains to purchase temple luck-coins to protect their ships.

The Sundered Monolith of the region rests at the bottom of the Treakous Oceanic Rift, its vortex visible as the **Shard-Window**: a circular storm-vortex three miles wide that rotates above the rift.

**Daily Life, Trade & Food**

Seafarers live on salted sea-herring, kelp-cakes, and pickled brine-grass, washed down with drowned-rum. 

The regional economy is driven by exporting whale oil under the **Brine-Bond Syndicate** monopoly, which demands heavy tribute from keeps. To extract this oil, the Board has commissioned geothermal-powered **steam-trawlers** and explosive harpoons. The boiling engine runoff and soot are polluting the unfreezing channels, driving the Deep-Born Myrathil to madness and calling Wyrd sea-monsters.

In Merrowport, taverns (like *The Pitching Hull*) are constructed within the cargo decks of lashed ships, where sailors gamble using bone dice. Smugglers and black-market runners prefer **Kelpie's Cove**, a hidden inlet on the eastern coast. Farther north, **Wraithsound** cuts deep into the coastal rock, a narrow, echoing inlet where the voices of drowned sailors carry for miles on the fog, audible above the wind on the darkest nights.

**Native Traditions & Founders**
The Iceheart is the home water of two traditions. The **Gambit** art was born here when the Merryn pirate **Jax** wagered his lifeline against a storm-spirit at Merrowport — winning the wind but losing his blood's warmth. The **Minstrel** Tide-Choir was founded by **Lyris the Tide-Singer**, whose storm-symphony calmed the gales at the cost of her spoken voice. The Gambit tradition's other root — **Lyra's** Kessen Neth probability-web reading, developed in the Bryngloom — refined itself at Merrowport's tables when the two traditions recognized each other across the Ancestor-Spans.

**Deep History & Strata**
**The Pre-Deepening.** The Iceheart was a Celtic maritime culture of free-sailing clans under sea-law, treating each ship as its own polity and worshipping a Sea Mother — the root of the voyage-share contracts and the Board of Trade's Sea-Charter.
**The Deepening & the Bargain.** House Mereval traded calm water for never-freezing lanes — meaning perpetual storm. The trauma-site is the First Shore, where the skeletal archers of the original landfall still stand their eternal watch. The storms drove the Merryn into the debt-bondage that defines them.
**The Long Dimming.** The Year 88 Ember Lagoon pact tied the sea to Sundale's caldera economy. Later the Brine-Bond Syndicate bought Cragjaw geothermal tech for its steam-trawlers and industrialized the whale-oil trade; the boiling runoff polluted the channels, called up Wyrd sea-monsters, and maddened the Deep-Born Myrathil.
**The Present Fracture.** The sea has gone silent (~Year 795) — no tidesong, no deep-bass pulse — and the Minstrel Tide-Choir is dying with it. The Deep-Born who fled the abyss heard something sing back: the Oceanic Rift Monolith is waking, the sea's branch of the bill now due.`
            },
            {
              title: 'Cragjaw Peaks',
              content: `> **Key Terms in Cragjaw Peaks:**
> - **Cragjaw Peaks:** A vertical wilderness of razor ridges and bottomless chasms wreathed in an eternal blizzard.
> - **House Tesshan:** The noble house governed by Jarl-Inca Oda Tesshan, who enforces the Knotted Decree.
> - **The Tesshan-Khipu:** Knotted cords and bone-beads that replaced written script to resist the frost.
> - **The Tesshan-Mit'a:** Mandatory public labor conscription to build the cliff-terraces and bone-spans.
> - **The Steam-Line Cartel:** The state monopoly controlling geothermal heat and runic steam pipes.
> - **The Rope-Garrisons:** Fortified checkpoints on basalt spires controlling the rope-bridges.

**The Regional Landscape & Current Vibe**

The Cragjaw Peaks are a vertical wilderness of razor mountain ridges and bottomless wind-gaps cloaked in a perpetual, howling blizzard. The snow has not stopped falling since the dark bargain was sealed, burying every natural route. The only thoroughfares above the whiteout are the **Ancestor-Spans**: colossal bridges grown from the calcified bodies of the Groven's dead.

To govern this vertical maze, **Jarl-Inca Oda Tesshan ("The Knot-Lord")** enforces the **Knotted Decree**. He has outlawed all written script—which rots and freezes—replacing it with the **Tesshan-Khipu** (knotted cords and bone-beads) to record laws and lineages. To control the populace, Tesshan enforces the **Tesshan-Mit\'a**: a mandatory labor system requiring every clan to send a third of its population to excavate geothermal channels, build cliff-hanging agricultural terraces (**andenes**), and sacrifice their dead to grow the bone-spans. 

Movement across the peaks is tightly regulated by **The Rope-Garrisons**—fortress checkpoints built on basalt spires. The military controls the rope bridges, cutting them at the first sign of unrest or Wyrd infestation, isolating entire keeps. 

**The Dark Bargain:** House Tesshan traded **visibility for the eternal snow-veil**: a perpetual blizzard to hide their keeps from the starving lowlanders. The keeps survived because nothing could find them. The price: every landmark was buried. The Tessen have not seen the sky in eight generations.

**The Seat of Power: Frostmaw Holdfast & The Spans**

The Peaks are governed from **Frostmaw Holdfast** and the precarious settlements of **The Spans**.

**Frostmaw Holdfast** is a colossal, lightless subterranean vertical city of the Fexrick, descending thousands of feet around roaring geothermal chimneys. The city is a masterpiece of alchemical sumps and clockwork galleries. Lately, the upper keeps have siphoned geothermal heat through high-pressure **Steam-Siphons** to warm the royal palaces. This industrial siphoning has cooled the agricultural terraces and triggered massive, unpredictable avalanches that bury lower mining camps. 

Within the holdfast, the air is thick with steam and coal-dust. Cut into the eastern wall of Frostmaw's outer chasm lies **Gearworks Gulch**, an industrial foundry settlement. Farther south, **Deepchasm Keep** spans a massive fissure, its walls anchored by Groven bone-cables to literally hold the mountain together.

**The Spans** are vertical shanty-towns, toll-posts, and rope-bridges built directly onto the Ancestor-Spans by the Groven. They are cold, wind-blasted, and smell of ram-tallow.

**The Social Divide & Subrace Friction**

The population is split into two sharp castes. The **Terraced** are high-born humans who live in warmed keeps, fed by geothermal potato-terraces. The **Chasm-Dwellers** are Fexrick laborers and miner clans who live in dark, unheated chasms, suffering from "Blue Bite" frostbite-rot and sifting through runic waste.

The **Groven** themselves are divided by the **Ladder of Purity**, an unspoken caste system. The heavier-scaled, deep-chested **Morgh Groven** are the bridge-builders, warriors, and laborers. The finer-scaled **Ithran Groven** are the diplomats and toll-keepers. The mixed-caste **Murmur-Blooded** are outcasts who serve as bridge-tenders. The **Fexrick** are split between the **Kethrin** (hereditary guild engineers) and the **Drall** (self-taught scrap-folk).

**Localized Threats, Persecution & The Wyrd**

Cragjaw’s Wyrd draws from Japanese Yokai and Andean folklore: the **Yuki-Onna (Rime-Bride)**, a frozen ghost who lures travelers into the abyss; the **Tengu-Crows**, winged mountain spirits that steal voices; and **Sump-Kappas**, feral heat-stealing pests that drain steam from pipe junctions.

This Wyrd is highly volatile due to the **Purging of the Kami-Speakers**. Backed by southern [Inquisitors](file:///d:/VTT/vtt-react/src/data/classes/inquisitorData.js), Tesshan forces systematically outlaw traditional mountain animism—worshipping rock-spirits (**Kami**) and geothermal springs (**Onsens**)—forcing keeps to worship only the calcified ancestors of the Groven-bridges.

The region's Sundered Monolith is sealed within a lightless alchemical chamber deep beneath Frostmaw Crag, its frequency vibrating the steam-valves.

**Daily Life, Trade & Food**

Staples include freeze-dried cliff-potatoes (**chuño**), dried mammoth strips (**charqui**), and lichen-stew, washed down with whiteout-distillate. Because the agricultural terraces are cooling, the region is increasingly dependent on grain imports from Sundrift Vale and Sundale. 

The economy is driven by exporting alchemical reagents under the **Steam-Line Cartel** monopoly, which demands heavy tribute from keeps in exchange for heat-flow. All trade is recorded on royal khipus. Taverns on the Spans are drafty wooden cages bolted directly to the bone bridges. Currency is rarely used on the heights; trade is conducted via barter of wool, bone tools, and climbing spurs.

**Native Traditions & Founders**
The Cragjaw birthed the **Chronarch** art, born when the Kethrin engineer **Nesta** hooked a time-dilation engine of volcanic glass into her chest at Frostmaw Holdfast. The **Warden** chain-graft tradition was invented here by the Groven mine-guard **Alaric the Law-Keeper**, who drove an ore-hauling chain through his own forearm to hold a Deep Alchemist specimen for three days. The Cragjaw is also the biological root of the **Shaper** class: **Torin** developed the body-sculpting art at Frostmaw that, merged with Sylvanus's Frostwood kinetic dance by the Mimir chronicler **Veyra**, became the Shaping Forms.

**Deep History & Strata**
**The Pre-Deepening.** Cragjaw was an Andean-style vertical empire of khipu-record-keepers and terrace-engineers, threaded by yokai-haunted high passes; beneath it the Deep Alchemists pre-date even that empire, refining living matter in the deep tunnels since before the Wyrd was named.
**The Deepening & the Bargain.** House Tesshan traded visibility for the perpetual blizzard-veil. But the defining event is the Vat-Breakers' Revolt (~Year 40): the Groven shattered their vats, calcified their own dead into the Ancestor-Spans, and sealed the Alchemists into the deep tunnels.
**The Long Dimming.** The revolt seeded two diasporas — the Groven carried the chain-graft that became the Warden art, and the biological body-work that fed the Shaper class — tying Cragjaw's deep history outward to the Frostwood and beyond. Later the Steam-Line Cartel seized the geothermal heat, selling warmth to Nordhalla's pipes and engine-tech to the Iceheart's steam-trawlers.
**The Present Fracture.** The Dimming (~Year 780) is cooling the geothermal terraces toward food-collapse, the Ancestor-Spans are cracking, and the Void-Heat Heresy's temporal friction is corrupting the Groven's bridge-load instincts — the Cragjaw crisis is the Heresy Chain made stone.`
            },
            {
              title: 'Sundrift Vale',
              content: `> **Key Terms in Sundrift Vale:**
> - **Sundrift Vale:** A wind-swept, starless steppe of dead grass where nomads follow great woolly herds.
> - **House Ordavan:** The noble house led by Khatun Bayarmaa Ordavan, who enforces the Iron-Yurt Law.
> - **The Steppe-Staves:** Carved bone tally sticks used to register herd-migrations and pasture rights.
> - **The Ordan-Urtuu:** A mandatory relay post-system that clans must maintain for the Khatun's couriers.
> - **The Herd-Tithe:** The state monopoly requiring clans to tithe a third of their foals for grazing rights.
> - **The Cairn-Checkpoints:** Flame-lit stone towers built on basalt cairns to control steppe trade.

**The Regional Landscape & Current Vibe**

The Sundrift Vale is a wind-swept expanse of dead tundra grass stretching endlessly beneath a sky that contains nothing. No stars. No constellations. No navigable heavens. The ancestors who once mapped the firmament now navigate by memory alone, and memory is the first thing the steppe takes. Nomadic clans follow the endless herds across a landscape where the only constants are the wind and the ancestor-mounds, burial sites that still hum with the throat-sung histories of the dead. In the steppe's western reach lies **Starfall Vale**, a massive crater where constellation-spirits fell from the sky during the Breach, its glass-scarred floor still faintly luminescent.

To govern this flat expanse, **Khatun Bayarmaa Ordavan ("The Steel-Voiced")** enforces the **Iron-Yurt Law**. To prevent inter-tribal warfare and secure tribute, she has mandated that all seasonal migrations, pasture rights, and blood-debts be carved on **Steppe-Staves** (bone tally sticks) registered at her mobile chancellery. Any clan that grazes outside their route is branded a "Strap-Thief" and hunted down by her horse-archers. 

Movement across the flat steppe is monitored by **The Cairn-Checkpoints**—flame-lit basalt cairns built along trade routes. Because there is no natural cover, these cairns are the only landmarks; their garrisons extract tolls and check migration passes.

**The Dark Bargain:** House Ordavan traded **fertile soil for the endless migration**: the herds never stop, the grass always returns, no matter how many mouths feed upon it. The price: the sky went dark. The constellations were erased from the firmament above them.

**The Seat of Power: The Synod-Hold & Mound-Camps**

The Vale has no permanent stone cities; its seats of power are the **Mound-Camps** and **The Synod-Hold**.

**The Mound-Camps** are massive, moving yurt-metropolises of the Ordan humans. They migrate continuously in the wake of the woolly-herd migrations, congregating seasonally around the giant, grass-covered **Ancestor Mounds**. When the camps gather, the steppe is filled with the scent of fermented mare's milk, mutton fat, and the throat-singing of the clans. Recently, the pasturelands have been scarred by **Thermal Bores**—geothermal vents sunk by forced Fexric labor to keep the grass growing during winter. This industrial boring has dried the steppe's aquifers and created toxic sulfur-sinkholes that swallow migrating beasts.

**The Synod-Hold** is a shimmering sanctuary of pure, light-refracting crystal-lattice constructed in the steppe's center by the Astril. Lit from within by the luminous skin-patterns of the Astril priests, the Synod-Hold is a quiet observatory designed to preserve the lineages of the constellation-spirits carried in their blood.

**The Social Divide & Subrace Friction**

The steppe population is split into two classes. **The Mounted** (*De Hestebårne*) are elite clans who own the swift steppe-horses and control seasonal routes around the Ancestor Mounds. **The Unmounted** (*De Hesteløse*) are outcasts whose herds froze. They are forced to walk on foot, carrying the heavy baggage of the yurt-cities, and are regarded as property.

The **Ordan Humans** are herders and nomads who navigate by throat-sung ancestor-maps, viewing settled folk as weak. 

The **Astril** are split by how they live with the constellation-spirits nesting in their blood. The **Sylen Astril** embrace the spirit within at the risk of being consumed by the cosmic mind. The **Muren Astril** suppress the spirit through strict meditation, containing the star-light behind mental walls. Pushed to the margins are the **Unlit**: Astril born without a constellation, carrying no patterns and no star-glow. The Synod views them as cursed, but because they are the only Astril who can lie without their skin glowing, the Synod uses them as spies. They gather secretly at **The Unlit Knoll**.

**Localized Threats, Persecution & The Wyrd**

Sundrift's Wyrd draws from Mongol/Turkic and Chinese folklore: the **Lien**, a debt-tracker that collects on forgotten promises; the **Hungry Child**, a Wyrd-occupied spirit who devours those with no star-stories to tell; and the **Sere-Khan**, a guilt-ridden judge who rides the steppe trying cases brought by the dead.

This Wyrd has grown highly active due to the **Purge of the Sky-Singers**. Backed by southern [Inquisitors](file:///d:/VTT/vtt-react/src/data/classes/inquisitorData.js), the Khatun has outlawed the traditional "Sky-Song" throat-singing that communed with star-spirits, forcing all clans to practice only ancestor-singing. Those who throat-sing the old constellations are executed.

The regional Sundered Monolith is buried deep within the oldest Ancestor Mound, its location erased from memory, but its frequency vibrates the steppe-saddle leather.

**Daily Life, Trade & Food**

Nomadic Ordan clans feed on fermented mare's milk (**kumis**), dried mutton, and wild steppe-turnips. The economy runs on exporting wool, hides, and steppe-horses, and importing metal tools and salt. The finest herds graze on the **Kumis Downs**, where pasture rights are recorded on royal bone-staves.

Taverns in the Mound-Camps are large yurt structures that smell of mutton fat and woodsmoke, where nomads drink kumis and sing throat-sung ballads. Transactions are completed using horse-chits or barter.

**Native Traditions & Founders**
The Vale is the cradle of the **False Prophet** art, born when the Ordan herd-watcher **Li Wei** followed a meteor into a crystalline crater, looked into the void where Sol once shone, and returned blind with the Voice of the Silence. The Vale also co-founded two wider traditions: **Kael** pioneered the totemic root of the **Animist** triad here (throat-sung communion through the migration-horse's mane), and **Xyris** tore the reality-hole here that, joined to Malakor's doom-arithmetic, became the **Harbinger** tradition.

**Deep History & Strata**
**The Pre-Deepening.** The Vale was a Mongol-style steppe horde-culture of throat-singing navigators who mapped the grass in overtones and buried their dead in acoustic ancestor-mounds that replay the last words of the dead on the anniversary of their dying.
**The Deepening & the Bargain.** House Ordavan traded fertile soil for the endless migration — only grass can root, so the herds must move forever. The trauma-sites are the Ancestor Mounds, where the bargain was ratified in song and where the dead still answer.
**The Long Dimming.** In Year 150 the first Unlit Veil couriers arrived at Synod Hold and within a generation owned Ordavan trade policy. In Year 500 three ancestral mounds fell silent in a single season — the first omen of something stirring beneath; the Cult of Forgotten Shadow's Year 598 Silence Between Stars confirmed it when the deep answered, and across the Vale the dead ancestors went quiet for good.
**The Present Fracture.** Chaos Pockets are stabilizing into permanence (~Year 795) — grass grows sideways, rain falls upward — the Harbinger crisis made visible; and the False Prophet's Voice is issuing specific instructions, routing its Congregation toward the same deep vaults the Cult wants opened.`
            },
            {
              title: 'The Bryngloom Forest',
              content: `> **Key Terms in Bryngloom Forest:**
> - **Bryngloom Forest:** A twilight canopy of ironwood trees growing above bottomless peat-sinking bogs.
> - **House Morrath:** The noble house led by Regent Morrath Neth, who enforces the First Contract.
> - **The Great Registry:** The central archive at Atropolis where all citizen debts and lifespans are recorded.
> - **The Postmortem Corvée:** The legal conscription of deceased debtors resurrected as Debt-Revenants to clear balances.
> - **The Peat-Debt Bondage:** The economic system where poor Morren mortgage their memories and lifelines for rations.
> - **The Toll-Dikes:** Fortified living-ironwood gates across the swamp channels controlling passage.

**The Regional Landscape & Current Vibe**

The Bryngloom Forest is a continent of contradictions: semi-frozen sinking bogs give way to ancient bioluminescent woods, sacred fungal-lit groves, and cathedral-canopies of living ironwood coaxed into shape over a thousand years. The forest does not simply grow here, it is governed. An entity called the **Keeper of the Last Threshold** (the same being the Vreken call the Root-Veil) decides what the Gloom preserves and what the Gloom consumes. This is not myth. This is legal precedent. 

To govern this twilight swamp, **Regent Morrath Neth ("The Scribe-King")** enforces the **First Contract**. By decree of the Contract, all citizens (humans, Neth, and Vreken) are born into a default state of debt to the Regency. All land titles, debts, and lifespans are recorded in the **Great Registry** of Atropolis. Those who attempt to live outside the Registry are branded "Uncontracted Outlaws."

Movement across the swamp channels is strictly controlled by **The Toll-Dikes**—massive barriers of living ironwood and peat-stone. The military patrols these dikes, checking the **Covenant-Scrolls** (passports) of all travelers; those without valid registration are seized and sent to the peat-sumps.

**The Dark Bargain:** The Bryngloom's dark bargain is unique: it was not struck by a noble family but by the Neth's own ancestors, a dying clan of scribes who walked into the deep wood and presented a legal argument to the Keeper for their own survival. The Neth rose from the bog with silver skin, stilled breath, and a pact written in the blood of every descendant. They were preserved in exchange for serving as the Keeper's living archive. Death became a renegotiated clause, not an ending.

**The Seat of Power: Atropolis & The Sunken Spire**

The Bryngloom's power is split between the canopy city of **Atropolis** and the subterranean chambers of **The Sunken Spire**.

**Atropolis** is the magnificent canopy-city of the silver-skinned Neth, constructed inside a cathedral-grove of living ironwoods. The streets are suspended walkways of living branch and ghost-silk, lit by memory-glass tablets. Recently, the forest has been scarred by the **Peat-Presses**—high-pressure steam engines used by the Regency to squeeze oil from the bog. This industrial draining has lowered the swamp's water level, causing the roots of the giant ironwoods to rot and collapse.

**The Sunken Spire** is the inverted capital of the Vreken, a colossal cathedral and crypt carved four hundred feet down into a natural peat-stone sinkhole. Lit solely by the soft phosphorescence of entombed ancestors wrapped in living fungal shrouds, the Spire is a place of shadows and the continuous chants of the Veil-Speakers.

**The Social Divide & Subrace Friction**

The population is split into two castes. **The Contracted** are high-born Neth and wealthy merchants who hold active credits and live in the clean high canopy of Atropolis. **The Defaulted** are impoverished Morren humans and Marked Vreken who live in damp peat-shanties on the forest floor, breathing toxic rot-fumes and working the sumps.

The **Neth** are divided into three bloodlines. The **Velun** are the pact-lords and arcanists. unable to lie, they govern the high libraries. The **Kessen** are the gamblers and weavers, reading the probability-web of the forest floor. The **Drun** are the severed outcasts. Immune to magic but legally non-existent under Neth law, they live in the canopy-sumps. The bog's most infamous landmark is **Black Fen**, a stretch of dead water serving as the contract court's dumping ground.

The **Vreken** are split by their fungal bonds. The **Clean Vreken** are immune to the addictive "hush" of the Ghost-Mycelium. They occupy every seat on the crypt-council. The **Marked Vreken** carry the volatile Ghost-Mycelium strain, granting them terrifying trail-sight but leaving them vulnerable to the hush. They are segregated into the **Over-Shanties** at the Spire's entrance.

**Localized Threats, Persecution & The Wyrd**

The Bryngloom's Wyrd draws from Slavic and Hindu folklore: **the Grandmother of the Bog**, an ancient figure who offers extensions on life in exchange for memories; the **Debt-Revenant**, a deceased debtor who rises to complete the terms of a broken contract; and **the Cycle-Eater**, a creature that devours the reincarnation cycle itself. Few dare cross **Widow's Quagmire**, where the voices of drowned Morren widows hum the terms of expired contracts.

This Wyrd has grown highly active due to **The Purging of the Swamp-Singers**. Backed by southern Inquisitors, the Neth Regency has outlawed the "Swamp-Song"—traditional animistic communion with the Root-Veil—forcing all clans to practice only Registry-Rituals. Those who throat-sing to the fungal-molds are hunted down and turned into silent laborers.

The regional Sundered Monolith rests at the bottom of a bog-pool that has no bottom, leaking the memories of drowned divers into the peat.

**Daily Life, Trade & Food**

Common food includes bog-mushroom stew, roasted peat-truffles, and dried river-eel, accompanied by bioluminescent tea. The local trade economy is built on exporting memory-glass, bog-preserved ironwood, and alchemical moss, under the Neth Regency's monopoly (First Contract, Great Registry). Poor Morren are trapped in perpetual debt, mortgaging their children's future lifelines.

In Atropolis, taverns are open-air branch platforms suspended high in the canopy. The atmosphere is quiet, formal, and strictly transactional. Currency is recorded on ledger-tablets and verified by Velun pact-clerks.

**Native Traditions & Founders**
The Bryngloom is the deepest root of Mythrill's death-and-contract magic. The **Arcanoneer** art was founded here by **Valerius**, who weaponized the Neth inability to lie into contract-syntax spellcasting at Atropolis. The **Revenant** tradition was forged from two Bryngloom roots — **Kora the Veil-Speaker's** blood-covenant and **Vesper the Scribe's** frost-stasis phylactery. The **Plaguebringer** Cultivar was founded by **Vespera**, who bonded with bog-rot to cure the spore-hush. **Nyssa**, the Vreken spore-elder, pioneered the spore-inhalation root of the **Animist** triad here. The Bryngloom also co-founded two wider traditions: **Orven the Still-Handed** forged the cold-iron Vreken root of the **Inquisitor** art (sworn at the Sunken Spire), and **Lyra** the Kessen probability-weaver developed the clause-reading root of the **Gambit** tradition here before it crossed the Ancestor-Spans to Merrowport.

**Deep History & Strata**
**The Pre-Deepening.** The Bryngloom was a Slavic bog-pagan culture of peat-preserving ancestor-veneration crossed with Hindu-style reincarnation-contract law, its dead wired into the mycelial Root-Veil — the root of the Postmortem Corvée, the Neth contract-nature, and the bog-preserved dead that still walk.
**The Deepening & the Bargain (the First Contract).** The Neth struck the First Contract with the Keeper of the Last Threshold; House Morrath was elevated to administer it. The trauma-site is the Heart-Vault beneath Atropolis. The Drun, who refused the Contract's terms, were cast down and built the Over-Shanty beneath the city.
**The Long Dimming.** In Year 412 the Cult of Forgotten Shadow was founded in the Shanty's peat-crypts; its Year 598 Silence Between Stars contact with the deep answered, and the contagion spread north (the Void-Heat Heresy) and south (the Vale's Voice). In Year 650 the Great Fire burned a third of the Shanty, and the Cult earned its grudging hold by containing the flames.
**The Present Fracture.** The bog-graves are waking and marching on the Sundered Monoliths (~Year 795); the Root-Veil is rejecting the Marked (the Plaguebringer and Warden crises); and Vespera's founding strain is dying after eight centuries — the Bryngloom bill is the Heresy Chain's terminus, where the dead answer the call the Cult first dialed.`
            }
          ]
        }
      },
            {
        id: 'races-overview',
        name: 'The Peoples of Mythrill',
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
              content: `A secretive, rare people of the Frostwood Reach — tall, slender, with unnaturally fluid movement and a profound relationship with identity that the Thalren humans have never fully understood and never fully stopped fearing. Their origin traces to a woman named Sylvain, a forester's daughter who merged with her fetch (a doppelganger death-omen) rather than die, and whose unborn child became the first Mimir born from spore rather than blood. The mask every Mimir wears is the calcified barrier between the original soul and the fetch — forged in the sacred mother-flame chambers, gifted from each mother to each child as both armor and identity.

An event ninety years ago — the **Rupture**, when the art of mask-forging was lost during a targeted purge of the canopy-holds — shattered Mimir society into three distinct peoples. The **Mask-Borne** claimed the high branches and became an aristocracy, hoarding both masks and lineage-records, viewing shape-shifting as a statecraft reserved strictly for the nobility. The **Mist-Woven** were pushed to the mountain aeries and became sentinels, wearing stone masks and deploying shape-shifting as a lethal tool of guerrilla defense against the next Purge they are certain is coming. The **Unwoven** — those born maskless or who lost their masks — drifted to the forest floor and built a culture from what the others discarded: black markets, bottled memories, stolen diary keys, and an intimate knowledge of every shadow in Greymark's undercity.

The mother-flame still burns in the oldest canopy-hold, but no successful birthing has occurred there in three decades. The last mother to use it died in childbirth. Her daughter is Unwoven, raised on the floor by strangers, carrying a cracked mask no one knows how to repair. The Thalren humans fear the Mimir's faceshifting deeply — a paranoia that the Wyrd has weaponized into the Gref, a creature that steals faces. The Frostbound exiles from Nordhalla share a grudging respect with the Unwoven: two peoples cast out by their own kind who recognize each other's survival. The Mimir regard the Briaran with wary recognition — two hunted peoples hiding in the same mist.`
            },
            {
              title: 'The Emberth',
              content: `A bulky, powerful race of sun-reverent forge-clans who are the original children of Sundale. Long before the binding, their Sun-Speakers received cryptic prophecy from Sol, fragments of heat and image that foretold the coming darkness. Forewarned, they excavated vast thermal tunnel networks beneath the continent and were already underground when the surface froze. They spent centuries in the deep, tending the **Solbrand**: a small eternal ember believed to be Sol's final conscious fragment. Since Emberspire erupted, they have reclaimed the ashland surface, organized into forge-clans bound to volcanic calderas. Their culture is built around the vigil: waiting for Sol to speak again. The silence has lasted centuries.`
            },
            {
              title: 'The Fexrick',
              content: `The oldest continuous civilization on Mythrill, compact, gnomish subterranean engineers who carved their first holdfast into the Cragjaw Peaks eight millennia ago, before the Thrumm, before the noble families, before the sun's death. Their skin is pale, tinted green from alchemical exposure or darkened from mine-work; their eyes are droopy but eager, the perpetual look of a people who have been working too long and cannot stop because something still needs fixing. Every Fexric carries one subtle mechanical body replacement (a brass finger, a copper ear, a lens-eye), earned by mastering a craft, and every replacement is a lightning rod waiting for a storm. Divided between the Guild-Bound **Kethrin** (hereditary guild members who hoard ancient oral maintenance songs) and the Clan-Free **Drall** (self-taught outsiders who survive on salvage and improvisation), their society is built on three pillars: practical tinkering, mineral alchemy, and the goblin-gnome cunning that keeps their trap-laden holdfasts hidden from a surface world that barely knows they exist. They created the Groven from the Thrumm (intentionally, and lost control). They are brilliant, ancient, paranoid, and slowly forgetting more than any other race has ever known.`
            },
            {
              title: 'The Neth',
              content: `A tall, beautiful, silver-skinned people, the Bryngloom Forest's immortal archivists. Their ancestors were a dying clan of scribes who walked into the deep wood and presented the **Keeper of the Last Threshold** (the same entity the Vreken call the Root-Veil and revere as sacred) with a legal argument for their own survival. The Keeper accepted. The Neth rose from the bog with stilled breath, pure-silver skin, and a pact written in the blood of every descendant, death would be a clause to renegotiate, not an ending. In exchange, every Neth contract carries the Keeper's cosmic authority, and every broken contract is enforced by the same entity that preserves them.

They are organized into three bloodlines: the **Velun** (who inherited the Keeper's authority, arcanists and pact-mages who cannot lie, whose every spoken word is binding on themselves), the **Kessen** (who inherited the Keeper's sight, weavers and gamblers who perceive the obligation-web connecting every living thing and manipulate probability by tugging its threads, though every tug snaps something elsewhere), and the **Drun** (who inherited the Keeper's silence, Neth who burned their names from the First Contract through a traumatic Severing ritual, becoming magic-resistant, debt-null, and legally non-existent under Neth law).

Operating from their living canopy-city of **Atropolis**: a cathedral-grove of ancient ironwood coaxed into shape over a thousand years, and the frozen dock-outpost of **Ironjaw Port** on the Iceheart Sea, the Neth control the major trade routes and preservation techniques needed by every warm-blooded survivor. Their memory-glass records, grown from crystallized tree-sap, form the oldest continuous archive in the known world. They share the Bryngloom with the Vreken in coldly functional coexistence: the Vreken worship the Keeper; the Neth negotiated with it. Neither defers to the other. Neither particularly wants to.`
            },
            {
              title: 'The Groven',
              content: `Humanoid troll-kin bridge-keepers of the Cragjaw Peaks. Originally Thrumm broodlings captured and injected with alchemical serums by the Fexric Deep Alchemists, the Smoothing Plague refined their stone-hide into fine scales, lengthened their limbs for reaching across chasms, and awakened higher cognition. The first Groven (the Vat-Breakers), shattered their vats, freed their kin, and fled into the upper crags where they built their bridge-civilization. Divided between the heavy-scaled **Morgh** warriors of the mid-crag warrens and the long-limbed **Ithran** diplomats of the bridge-top settlements, Groven society is governed by the unspoken Ladder of Purity, a hierarchy born from the Fexric's design that no Groven will openly acknowledge. Their Ancestor-Spans, grown from their calcified dead, are the only visible landmarks in the perpetual blizzard of the peaks.`
            },
            {
              title: 'The Thrumm',
              content: `The ancient parent race of the Groven, hulking, hunched, bestial stone-trolls who have inhabited the deepest crags of the Cragjaw Peaks since before humans walked the world. They speak with minimal language, live in loose family packs, and possess a brutish intelligence rooted in instinct rather than reason. The Thrumm view the Groven with superstitious fear, their smoothed cousins smell wrong, think too fast, and carry the taint of the Fexric vats. The Groven protect Thrumm territories from the periphery but cannot live among them anymore. The Deep Alchemists of the Fexric still capture Thrumm broodlings, and somewhere far below Frostmaw Crag, the Lost Brood (Thrumm never rescued during the Vat-Breakers' escape), are still being injected, still being molded.`
            },
            {
              title: 'The Myrathill',
              content: `Amphibious sea-children spawned from storm-foam where Emberspire's volcanic heat met the glacial meltwater runoff, the Myrathill have no parents and no bloodlines. They are the sea's own experiment in personhood — her attempt to give her waters a voice, a shape, a will that could walk upon land her tides could only touch. Their skin is translucent at the wrists and temples, the veins beneath shifting colour with emotion: cobalt-blue when calm, rust-amber when curious, bone-white when grieving. Their eyes are ocean-wide and made for dim submarine light, perpetually half-squinting at the sunless sky with an expression the land-folk read as dreaming but is simply vision adjusted for different depths.

Three subraces are shaped entirely by the water that births them. The **Breakers-Born** (spawned where waves hammer the shore) are the diplomats, merchants, and poets who navigate port cities and serve as the face the world associates with their kind — gregarious, emotionally fluent, and perpetually torn between their attachment to the land and the pull of the open water. The **Deep-Born** (spawned in the open ocean, far from any coast) are the mystics and sea-herders who live in the abyssal rifts, find land-folk overwhelming in their noise and shallowness, and are the ones most disturbed by the new resonance thrumming from the Treakous Rift — a frequency that makes their teeth ache and their dreaming turn dark. The **River-Fed** (spawned where freshwater estuaries meet the salt) are the scouts and explorers, following rivers inland, often passing as human in cities that have never seen open ocean, returning to the shore with stories no other Myrathil could tell.

In port cities from Sundale to the Frostwood Reach, the Myrathil occupy a strange social position: exotic celebrities that poets write about, nobles collect, and merchants quietly resent. The **Merryn** captains of House Mereval trade with them at Salt-Hinge as equals — the only port in the world where land commerce and sea commerce meet without condescension on either side. The **Rime-Born** of Nordhalla view them with deep suspicion: anything that does not freeze cannot be trusted. The **Neth** simply ask what they want to trade. The Myrathil themselves hold one secret that grows heavier each season: they know the precise location of the Sundered Monolith in the Treakous Oceanic Rift, have known for three generations, and have chosen silence. That decision grows harder to justify as the Deep-Born Listeners begin hearing new voices rising from the abyss — voices that do not belong to the sea.`
            },
            {
              title: 'The Astril',
              content: `A humble people of herders and throat-singers who carry the last surviving constellation-spirits in their blood, the celestial ministers of Sol's court who fled Keth-Amar's slaughter and took sanctuary in willing mortal vessels. Their skin bears luminous patterns that ebb with faith and emotion, visible only in darkness. Organized around a hierarchy of inherited light (the Luminarchy), their society is a labyrinth of devotion, assassination, and the unending performance of belief. The Sylen embrace the spirit within at the risk of being consumed. The Muren suppress it through ritual at the risk of eruption. Their presence is a living accusation: they carry what Keth-Amar failed to eat.`
            },
            {
              title: 'The Vreken',
              content: `The Bryngloom Forest's oldest inhabitants, a compact, lantern-eyed people standing between dwarf and human height, whose irises emit a steady bioluminescent glow. Native to the deep bog-caves where they cultivated phosphorescent fungi millennia before the sun died, the Vreken perceive "the trail" (residual light left by passage, death, and decay), invisible to all other races. Their society is organized around sunken gothic cathedrals lit by the perpetual glow of entombed ancestors wrapped in fungal shrouds. Divided between the Clean (rust-amber eyes, immune to the fungal addiction that ravages their kin, disproportionately occupying leadership and diplomacy) and the Marked (silver-white eyes, extraordinary trail-sight, genetically vulnerable to the Over-Lit epidemic). To humans, they are "grave-lights", lantern-eyed monks who arrive at the dying before anyone else knows death is coming, spawning the strigoi superstitions that still follow them.`
            },
            {
              title: 'The Briaran',
              content: `The descendants of House Viridane, the forgotten eighth noble family, struck from history by the seven houses that sealed Keth-Amar's bargain. When the other families marched their firstborn to the northern peaks as sacrifice, House Viridane refused and fled south through the Frostwood Reach, making a counter-bargain with fae entities in the moonlit groves. Their bodies now grow fine briar thorns where other races grow hair, a permanent physical inheritance of the old contract. The seven families spent centuries erasing every record of Viridane's existence, and the Briaran have been hiding ever since, split between the Unshorn who remain in the deep groves and the Smooth-Skinned who shave their thorns and pass as human in the wider world. Their thorns migrate slowly across their bodies over a lifetime, drifting toward the site of the oldest unfulfilled promise their bloodline carries, a physical archive of unfinished business stretching back eight centuries.`
            },
            {
              title: 'The Corvani (GM-only creature race)',
              content: `A rare subfolk of Nordhalla, the Corvani are raven-marked glacier-dwellers who carve their eyries into the sheer faces of the mile-high ice sheets. When House Skalvyr halted the glaciers at the price of eternal winter, a splinter group of highland survivors refused to descend into the fjord-keeps. They climbed higher, into the glacier-spires, and struck a fate-bond with the ancient Corvid Fate-Spirits — trading physical connection for absolute memory and destiny-sight. The Corvani serve as messengers between the isolated fjord-keeps, navigating whiteout and glacier-crevasse with preternatural skill. Their price is always a memory, freely given — recorded in the shifting raven-markings that crawl across their skin. They are not a playable race, but their fate-sight and glacier-navigation make them invaluable NPC allies in any Nordhalla campaign.`
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
        id: 'world-timeline',
        name: 'World Timeline & Causal Web',
        icon: 'fas fa-project-diagram',
        theme: 'narrative',
        summary: [
          'The canonical 800-year history of the Dimming: twelve pivotal events, dated, scarred, and causally linked.',
          'The single through-line every region, class, and faction is a facet of.',
          'Read this to understand why every present crisis is one bill, coming due at once.'
        ],
        content: {
          title: 'The World Timeline & Causal Web',
          description: 'The franchise spine. Every regional crisis, every class order, every faction goal is a consequence of the chain below. A GM who internalizes this timeline can explain any corner of Mythrill as the downstream effect of these twelve events.',
          sections: [
            {
              title: 'The Through-Line',
              content: `Mythrill is a world that chose survival at a price it is still paying, run by the descendants of the people who signed the bill.

Eight hundred years ago, seven star-watching families tore the dying sun — Sol — from the sky and buried it beneath Sundale to hide it from the predator that came to eat it. When the cold came anyway, six of those families broke their own seal and fed their firstborn heirs to the dark to buy back a little warmth. The seventh family refused, and so the seal held — just barely — and the predator was forced to feed slowly, century by century, on a star it could not swallow whole.

Every bargain struck since is the interest on that original debt: the fog that eats Frostwood memory, the glacier that ate Nordhalla's summer, the contract that eats a Neth's name, the storm that ate the Iceheart's calm. The present is not seven unrelated crises. It is one bill, coming due at once, presented to a world that has forgotten the terms — and governed, almost without exception, by the signatories' great-great-grandchildren.

To play any character in Mythrill is to play one of the debtor's heirs. The timeline below is the receipt.`
            },
            {
              title: 'The Twelve Pivotal Events',
              content: `**1. The Deepening & the Binding — Year 0.** Sol entered its death-cycle and the Sun-Eater Keth-Amar came to feed. The seven noble families tore the star from the heavens and entombed it beneath what is now Sundale, weaving the binding-seal from the hide of Aex (Sol's firstborn) and a blood-bond over their own lineages. They told the world Sol would sleep and rise again. It was the first lie. *Regions: Sundale (the tomb), all seven houses. Scar: Emberspire, the Solbrand, the binding-vault. Causes: the Long Winter that made the bargains necessary.*

**2. The Great Breach — Years 1–2.** The cold did not break. Keth-Amar whispered into the panic, and six houses marched their firstborn heirs into the dark. The heirs were the keys to the binding; devouring them cracked the vault from within. The seal shattered into the seven Sundered Monoliths, Emberspire erupted through the wound, and the Wyrd — a rot sealed in the deep earth since before humanity — bled up through the cracks and took the shape of every folk fear it found. *Regions: Sundale + worldwide. Scar: the seven Monoliths, the Wyrd, Emberspire's caldera. Causes: every regional Dark Bargain.*

**3. The Refusal & the Partial Seal — Year 2.** House Viridane, the seventh signatory, refused the heir-sacrifice and bonded instead with the fae of the Frostwood's moonlit groves. Because the seal did not entirely fail, Keth-Amar could not swallow Sol whole; the feast became slow — eight centuries of patient gnawing. *Regions: Frostwood Reach. Scar: the Lunarch bloodline, the moonlit groves, the dead moon that was an egg. Causes: the 800-year timescale of the Dimming and Viridane's coming erasure.*

**4. The Seven Bargains — Years 5–60.** Each region paid its own price to survive the Breach-winter. Year 5: House Thalreth struck the Fog Compact, trading the Frostwood's spatial clarity and memory for an insulating fog. Year 7: House Skalvyr struck the Glacier Bargain, trading summer itself — and setting the Frost-Tithe on the Rime-Born. In Bryngloom the Neth struck the First Contract with the Keeper of the Last Threshold (House Morrath to administer it). House Ordavan traded the Sundrift Vale's fertile soil for an endless migration in which only grass can root. House Mereval traded the Iceheart's calm for never-freezing — and therefore perpetual storm — lanes. House Tesshan traded Cragjaw's visibility for a blizzard-veil. And House Solvan, who had wielded the knife that flayed Aex, marched its own heirs north to be devoured and stayed to tend the tomb. *Regions: all seven. Scar: every region's defining condition. Causes: the cartel economies, the founding migrations, and every present regional crisis.*

**5. The Vat-Breakers' Revolt — Year ~40.** In Cragjaw, the Fexric Deep Alchemists' vat-grown servitors — the Thrumm, ancestors of the Groven — shattered their containment and rose. The Groven calcified their own dead into the Ancestor-Spans, the only safe bridges across the peaks, and sealed the Alchemists into the deep tunnels. *Regions: Cragjaw Peaks. Scar: the Ancestor-Spans, Groven sovereignty, the sealed vat-labs. Causes: Cragjaw's vertical toll-politics, the Warden chain-graft tradition, and the Steam-Line Cartel's heat monopoly.*

**6. The Founding of the First Traditions — Years 10–150.** Necessity mothered the disciplines. Cassia read the Deepening's hour in elk-entrails at the Frozen Archive and founded the Augur art. The Bloodhammer clans, starving under the Glacier Bargain, marched south to Sundale's caldera where Grum ignited the first Blood-Heat and founded the Berserker line. The Neth archivist Valerius drafted the Arcanoneers' First Contract. Sera Solvan carved her sacrificed child's name into her arm and became the first Martyr. A Merryn sailor sang the Iceheart calm and lost her voice to the first Minstrel tide-song. *Regions: Nordhalla, Sundale, Bryngloom, Iceheart. Scar: every order's seat and founder-relic. Causes: the class orders and their present succession crises.*

**7. The Erasure of the Silent Seventh — Years 50–350.** For Viridane's refusal, the remaining six houses elevated House Morrath to the seventh seat and spent three centuries striking the name Viridane from every record, ledger, and genealogy on the continent. The public came to speak of an "eighth house." *Regions: Frostwood (the Ledger), Bryngloom (Morrath's seat), all archives. Scar: the hidden Lunarch lineage, the Sovereign Ledger's power to define reality, the public's miscounted houses. Causes: the Scribe-Cartel's later authority and the Briaran resistance.*

**8. The Solvan Ascendancy & the Heir-Purge — Years 150–500.** House Solvan, blood-stained by the flaying of Aex, ruled Sundale's ashlands as a militant theocracy, conscripting the willing and unwilling alike into the Martyr Brigades and reforging Monolith-fragments to (they believed) restart Sol. The Heir-Purge hardened the Martyr's Vow from grief into doctrine; the Dawn Vigil was founded in Year 340 to pursue Monolith-fragments across all seven regions. The Imperium's cruelty hollowed its legitimacy, and over centuries the house declined into a regency of Stewards who refuse the title "Lord" until the sun returns. *Regions: Sundale (+ Dawn Vigil expeditions everywhere). Scar: the Obsidian Citadels, the Dawn Vigil, the Steward-system. Causes: the present Martyr-conscription crisis and the Vigil's secret knowledge that reassembly would summon Keth-Amar, not Sol.*

**9. The Silence Between Stars — Year 598.** The Cult of Forgotten Shadow, founded in Year 412 in the peat-crypts beneath Atropolis's Over-Shanty, made the first intentional two-way contact with the deep dark since the Breach. Something answered. *Regions: Bryngloom (roots), Nordhalla and Sundrift Vale (spread). Scar: the memory-extraction trade, the silence-glyphs, the spreading Voice. Causes: the False Prophet's specific new instructions and the coming attempt to open the way.*

**10. The Void-Heat Heresy — Year 720.** Agents of the Cult and the Skalvyr younger generation (Frigga Skalvyr) began clandestine construction of a Void-heat engine beneath the Frozen Archive, trading the Glacier Bargain's slow stability for a faster, dirtier warmth stolen from the deep. *Regions: Nordhalla. Scar: the prototype engine, the disturbed glacier-preserved dead. Causes: Nordhalla's coming generational betrayal, the Augurs' temporal interference, and the chronological contamination that wrecks the elk-entrail readings.*

**11. The Dimming of the Solbrand — ~Year 780.** The buried star's output began to visibly fail. Emberspire's vents cooled; the Thrask caldera weakened; the Frost-Tithe worsened; and the Augurs' accuracy collapsed from 93% to 41% as temporal friction redistributed through every Chronarch and every glacier-dead seer. *Regions: Sundale, Nordhalla, Cragjaw. Scar: the cooling vents, the failing auguries, the desperate fuel-wars. Causes: the present Sundale theocratic crisis, Nordhalla's countdown, and Cragjaw's looming food-collapse as the geothermal terraces cool.*

**12. The Waking of the Monoliths — ~Year 795 to the present.** The seven Sundered Monoliths began to hum. Chaos Pockets stabilized into permanence across the Sundrift Vale; the bog-graves of Bryngloom rose and marched on the Monoliths; unnamed entities emerged from the deep groves beyond the Inquisitors' art; and the Iceheart Sea fell silent — no tidesong, no deep-bass pulse. Every bargain is coming due at once. *Regions: all seven. Scar: the active Monoliths, the marching dead, the silent sea, the static mist. Causes: the campaign — every regional crisis is a facet of a single bill presented to a world that can no longer pay it.*`
            },
            {
              title: 'The Causal Web',
              content: `Read the timeline as chains, not a list. A GM who holds these chains can explain any corner of the world.

**The Debt Chain (the spine).** Deepening (1) → Breach (2) → Seven Bargains (4) → regional scars → Dimming (11) → Waking (12). Every present crisis is interest compounding on the original choice to bury the sun and then break the seal.

**The Seal Chain.** Binding (1) → Refusal (3) → Erasure (7). The seventh seat is empty in all but name; the Lunarch line carries the only blood that held the seal; the Scribe-Cartel's power to rewrite reality descends directly from the three-century project of un-writing Viridane. Remove any link and the seal's present, partial, failing state stops making sense.

**The Cross-Region Migration Chain (why Sundale is the way it is).** Glacier Bargain, Year 7 (Nordhalla starves) → the Bloodhammer march south → the Berserker tradition ignites in Sundale's caldera (6) → the Thrask Emberth become caldera-dependent → the Dimming (11) cools the caldera → desperate Thrask seek Scathrach's deeper vents (the Pyrofiend crisis). A chain that starts at the Deepening, runs through Nordhalla, and ends in a Sundale demon-pact.

**The Heresy Chain.** Silence Between Stars (9) → Void-Heat Heresy (10) → disturbed glacier-dead → temporal friction → Augur collapse (11) → the Waking (12). The Cult's contact with the deep did not stay in Bryngloom; it contaminated Nordhalla's time-reading, which blinded the one institution that might have foreseen the Monoliths waking.

**The one-sentence test.** If a player, after one session, cannot say what Mythrill's history is about, the meta-narrative has failed. It is about this: a world that chose survival at a price it is still paying, run by the descendants of the people who signed the bill — and the bill is now due.`
            }
          ]
        }
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
              content: 'The Wyrd is a formless primordial spiritual energy that manifests using human fear and folklore as a structural blueprint. It cannot create, it can only occupy.'
            }
          ]
        },
        summary: [
          '21 iconic Wyrd-creatures across all 7 continents.',
          'Creatures range from Low danger to High danger.',
          'Each creature is built from its regional folklore and cultural fears.'
        ]
      }
      ,{
        id: 'dramatis-personae',
        name: 'Dramatis Personae',
        icon: 'fas fa-users',
        theme: 'narrative',
        useCustomComponent: true,
        summary: [
          '14 named present-day NPCs (2 per region) complete with goals, secrets, and regional conflicts.',
'21 street-level contacts (3 per region) that level 1-5 characters will actually interact with.',
          'Provides GMs with active, living actors at every level of the world, from grand exemplars to tavern keepers.'
        ],
        content: {
          title: 'Notable Figures',
          description: 'A comprehensive roster of the sunless world\'s most powerful, desperate, and scheming figures. These characters drive the immediate conflicts across Mythrill\'s seven regions, offering the Game Master a ready cast of active agents to populate the campaign.',
          sections: [
            {
              title: 'Frostwood Reach (Greymark Keep)',
              content: `- **Sentinel-Commander Vaelen Greymark:** A battle-scarred veteran whose heavy steel plate armor is etched with glowing protective runes. He has served as the military shield of Greymark Keep for over thirty winters, commanding the Scribe-Sentinels with absolute discipline. In a forest where the mists steal a man's past, Vaelen rules by the strict letters of the Sovereign Ledger, believing that only written contracts, guardposts, and absolute martial order can preserve what remains of human society in the Reach.\n\n**Goal:** He is obsessed with locating a child of pure Briaran descent who remains untouched by the shifting mists. He needs this child to fulfill the ancient blood-compact of the High Hearth, securing the spatial clarity of the Keep for another century before the warding mist collapses entirely.\n\n**Secret:** The memory-fog has already begun eating his mind. He has forgotten the names of his children and the layout of the lower keeps, relying on hidden journals. He recently ordered the secret execution of two senior archivists who documented his mental lapses in the Keep's archives.\n\n**Conflict:** Locked in a shadow-war with Sylvain of the Unwoven, whose memory-smuggling directly undermines the Scribe-Cartel's tax monopoly. He is preparing a massive purge of the frontier settlements to smoke him out.\n\n- **Sylvain of the Unwoven:** A quiet, soft-spoken Mimir who refuses to wear the traditional stone-masks of his kin. He lives in the damp wilderness of the Shallows, tending to the undocumented outcasts. Draped in moss-woven cloaks, he moves like a shadow through the ironwoods, smuggling alchemical fae-hush to ease the memory-loss of the poor who cannot afford the Scribe-Cartel's ledger fees.\n\n**Goal:** To spark a total, unyielding rebellion of the outland trappers and Mimir against the keeps of House Thalreth, ultimately burning the Sovereign Ledger to break the soul-binding memory-tithe of the petrified Heart-Oak.\n\n**Secret:** His prosthetic arm is a graft of living greenwood taken from the Heart-Oak itself. It is bound by forbidden animist sorcery and contains the crying soul of Lord Aldren's deceased firstborn prince, whispering forgotten histories into Sylvain's mind.\n\n**Conflict:** Feeding movement schedules and keep codes to Jarl Eirik of Nordhalla, hoping a massive northern raid will shatter the Keep's defenses, while trying to evade Sentinel-Commander Vaelen's tightening patrols.`
            },
            {
              title: 'Nordhalla (The Frozen Archive)',
              content: `- **High-Oracle Skari:** The blind, skeletal Skald human who has spent fifty years in the deep ice-chambers of the Frozen Archive. His eyes were voluntarily put out and filled with liquid silver so he could "read the ice-veins" of Nordhalla. He is wrapped in mammoth-skins that are frozen stiff, and his voice carries the hollow resonance of glacier caves.\n\n**Goal:** To rewrite the tragic lineage of the birth-cold (the "Frost-Tithe") by carving a massive, global memory-rune on the face of the Nordhalla Monolith, a desperate act he believes will warm the cradle of the north.\n\n**Secret:** He secretly traded the coordinates of the outland fjord-keeps to the Icechamber Syndicate, intentionally sacrificing his own kin to purchase runic excavation tools.\n\n**Conflict:** Bitterly opposed by the high-clan elders who believe that thawing any part of the glaciers will break the original Warden bargain and trigger a catastrophic collapse of the ice sheets.\n\n- **Jarl Eirik Skalvyr:** The towering, mammoth-fur-clad leader of the outland fjord-keeps who challenges Halvar's high authority. He governs the outland fjord-keeps, surviving the brutal winters through constant raiding. He commands the nomadic Fredløse clans by force of personality, brandishing a massive frost-axe carved from ancient glacier ice.\n\n**Goal:** To break the trade monopoly of the Icechamber Syndicate, seize control of the geothermal pipelines supplying Ymirhold, and unify the northern clans under a single, military banner.\n\n**Secret:** He carries the mutant blue-skin lineage of the Hunger Winter. His blood runs cold as ice, making him completely immune to frostbite but marking him as a mutant outcast to the pureborn Skald nobility who seek to purge his line.\n\n**Conflict:** Clashes continuously with the Archive's high-wardens and Guild-Master Keth over ownership of the geothermal pipes, fighting off alchemical troops sent to choke the outlands' heating vents.`
            },
            {
              title: 'Sundale (The Ash-City of Korr)',
              content: `- **Arch-Sun Speaker Kaelen:** The dogmatic, golden-robed high priest who rules the martial-theocracy of Sundale from the ash-palace of Korr. He stands before the caldera, preaching that only absolute obedience to the Dawn Vigil and sacrificial devotion can rekindle the entombed sun-god.\n\n**Goal:** To conscript a thousand Neth contract-debtors into the Martyr Brigades to dig sulfur from active volcanic rifts, aiming to sacrifice their blood to feed the failing embers of the Solbrand.\n\n**Secret:** He no longer hears the voice of Sol; the whispers he receives in the inner Harath-Chamber come from Keth-Amar, commanding him to break the volcanic seal.\n\n**Conflict:** Locked in a bitter theological schism with the traditionalists who advocate quietist meditation and the Vault-Breath.\n\n- **Mara of the Badlands (The Shyr-Runner Archetype):** A cynical, ash-streaked ranger who has spent her life in the scorched basalt canyons of Sundale. Draped in alchemical leather, she moves through the cinder hoods with silent grace, guiding refugees past the Obsidian Citadels.\n\n**Goal:** To smuggle refined volcanic ore and geothermal coal out of the Fexric mines to arm the underground rebellion against the Dawn Vigil's theocratic rule in Korr.\n\n**Secret:** A glowing Wyrd-parasite is nestled in her chest, feeding on her blood. It flares with intense, burning heat whenever she gets close to the volcanic Monolith shards, acting as a painful compass.\n\n**Conflict:** Actively hunted by Hierophant Aethelgard's Martyr patrols, who have placed a massive bounty of five hundred gold-weight on her head.`
            },
            {
              title: 'Iceheart Sea (Merrowport)',
              content: `- **Captain Mereval:** A weather-beaten, silver-eyed pirate captain whose skin is entirely cross-hatched with glowing, silver ink-contracts. He commands the ironclad *Storm-Cutter*, sailing the ice-choked channels of the Iceheart Sea with ruthless efficiency, answering to no lord or Board of Trade.\n\n**Goal:** To locate the legendary Oceanic Rift Monolith, which is rumored to control the ocean currents, and sell its coordinates to the highest bidder in the Synod.\n\n**Secret:** He has already mortgaged his soul's final hour to the Keeper of the Last Threshold in exchange for his ship's immunity to the Wyrd-storms, and the debt is set to collect at the next Silt-Tide.\n\n**Conflict:** Constantly evading the patrol ironclads of Synod-Broker Lyra, who has declared his ship a rogue vessel and issued a global press-warrant for his crew.\n\n- **Synod-Broker Lyra:** An elegant, silver-skinned Neth merchant noble whose body is adorned with crystalline markings that pulse with magical energy. She rules the trade ports of the Iceheart Sea, enforcing the Board of Trade's Sea-Charter and collecting taxes on every drop of oil and grain that passes through the ports.\n\n**Goal:** To establish a permanent Neth trade embassy in the ash-city of Korr, securing a total monopoly over the distribution of southern geothermal warmth and cold-iron smelting.\n\n**Secret:** She is the secret financier behind the false prophet heresy, using the cult's anti-noble doctrines to destabilize human leadership in the southern cities.\n\n**Conflict:** Locked in a legal and mercenary war with the Fexric merchant guilds of Cragjaw Peaks, who refuse to pay her maritime transit tolls.`
            },
            {
              title: 'Cragjaw Peaks (Frostmaw Holdfast)',
              content: `- **Guild-Master Fexric Keth:** A brilliant, clockwork-augmented Fexric dwarf engineer who oversees the massive geothermal pipeline network of Frostmaw Holdfast. He is cold, analytical, and views the natural world as a machine that must be optimized and regulated.\n\n**Goal:** To shut off the heat supply to the outland keeps of Nordhalla, freezing out the Skald rebels and forcing them to cede their mineral-rich territories.\n\n**Secret:** His mechanical eye-graft is actually an active fragment of the Cragjaw Monolith. It records everything he witnesses, transmitting his visual memory directly to Keth-Amar's slumbering consciousness.\n\n**Conflict:** Targets the bridge-scales of the Ancestor-Spans, whom he views as alchemical property that escaped the holdfast's breeding vats.\n\n- **Toll-Leader Ithra Groven:** A massive, smooth-scaled Groven diplomat who stands guard over the Ancestor-Spans. Her skin is calcifying into pale stone-plates, a heritage of the alchemical experiments that created her race. She is a voice of reason in a mountain range dominated by alchemical greed.\n\n**Goal:** To secure official sovereign recognition for the Groven nation from the Astril Synod, freeing her people from Fexric servitude.\n\n**Secret:** She is secretly funding the Restorer rebel raids, providing the outlaw warriors with Fexric pipeline security codes and alchemical components.\n\n**Conflict:** Clashing with Guild-Master Keth over transit tolls and the smuggling of alchemical components.`
            },
            {
              title: 'Sundrift Vale (Synod-Hold)',
              content: `- **Khan Orda of the Mound-Camps:** A fierce, horse-riding human leader who guides the nomadic Ordan clans through the gravity-warping storms of the Sundrift Vale. He is covered in dust and scars, speaking in the low throat-singing tones of his ancestors.\n\n**Goal:** To locate the mythical Mound Monolith and harness its gravity-warping properties to lift his people's camps above the freezing Silt-Tide.\n\n**Secret:** He has made a private blood-contract with Jarl Eirik, promising to betray the Astril Synod in exchange for mammoth-furs and steel weapons.\n\n**Conflict:** Waging a low-intensity guerilla war against the Astril outposts, attempting to hijack their crystal supply lines.\n\n- **Grand Exemplar Vaelen:** The silent, crystalline leader of the Astril Synod. He is tall and slender, his body composed of semi-translucent star-glass that reflects the light of the constellation courts.\n\n**Goal:** To guide the Astril through a ritual ascension that will shed their mortal vessels and return them to the constellation courts.\n\n**Secret:** The ascension ritual requires the total collapse of the Sundrift Monolith, which would vaporize the surrounding human settlements.\n\n**Conflict:** Pursuing and assassinating Astril heretics who refuse the star-bound ascension, and directing Synod troops to fortify the valley borders.`
            },
            {
              title: 'Bryngloom Forest (The Sunken Spire)',
              content: `- **Sister Vraka:** A Marked Vreken rebel who has turned her back on the Sunken Spire. She wears tattered dark robes, her face hidden behind a cowl, and wields a rusted peat-sickle.\n\n**Goal:** To liberate the Vreken peat-cutters from their ancestral contracts with the Neth.\n\n**Secret:** Her lantern-eyes glow red rather than amber; she has accepted the Wyrd's gift of Somatic Echoes to gain the power to fight the Neth pact-mages.\n\n**Conflict:** Leads targeted raids against Matriarch Isara's scriptoriums, looting records to burn them.\n\n- **Matriarch Isara:** The ruler of the Sunken Spire's Clean Vreken. She is elegant and poised, her robes embroidered with silver threads, and sits upon a throne of woven petrified wood.\n\n**Goal:** To maintain the absolute purity of the Vreken bloodlines and the sacred sanctity of their contracts with the Keeper of the Last Threshold.\n\n**Secret:** She has signed a secret treaty with Sister Vraka, supplying the Vreken rebels with alchemical weapons to eliminate rival Neth noble factions.\n\n**Conflict:** Trying to prevent Sister Vraka's red-glowing corruption from spreading to the younger Vreken castes, while navigating the Neth court politics.`
            },
            {
              title: 'Street-Level Contacts',
              content: `These are the people your characters will actually meet in the first few sessions. They are not grand exemplars or guild masters. They are tavern keepers, merchants, and local figures who have their own problems and can offer work, information, or trouble.

**Frostwood Reach:**
- **Marta of the Ink & Ember:** A sharp-tongued, ink-stained tavern keeper who runs Greymark's busiest hearth. She is secretly an informant for the Scribe-Cartel, recording conversations in her ledger, but she will sell copies of her journals to rebels for a pouch of cold-iron coin.
- **Pike the Ledger-Man:** A nervous Thalren archivist who works the midnight shifts in the Sovereign Ledger Vaults. He is secretly addicted to Mimir fae-hush to keep his own painful family memories from being legally erased, making him highly susceptible to bribery.
- **Renn:** A young, maskless Mimir street-rat who runs a stall in the Shallows. He specializes in selling bottled "discarded memories" stolen from the Scribe-Cartel's disposal bins, acting as a key contact for locating lost relatives.

**Nordhalla:**
- **Bryn the Stoker:** A battle-scarred Bloodhammer dwarf veteran who tends the massive coal boilers heating Ymirhold. He knows every steam vent and secret maintenance pipe, and is willing to guide fugitives past High-King Halvar's guards.
- **Old Kira:** A blind Frostbound shaman who gathers glacier lichen in the cavernous rifts. She brews remedies for the Hunger Winter blue-skin mutation and knows which carved runic columns are safe to touch without triggering glacier ward-bursts.
- **Haldor Spit-Chit:** A greedy Skald human trader who deals in copper chits and forged heat-tickets. He has an extensive network of sled-dogs and informants along the fjord-keeps, serving as a master smuggler of contraband food.

**Sundale:**
- **Tarn the Ash-Walker:** A scarred Thrask ranger who patrols the sulfurous borders of the volcanic valleys. He wears heavy respirators to survive the soot storms and charges travelers a hefty fee in blood-ore, but he will waive it if they carry messages to the Emberth rebels.
- **Sister Vess:** A sun-priestess of Korr who has grown disillusioned by Speaker Kaelen's demand for human sacrifices. She secretly guides Neth debt-slaves into the underground vaults, seeking ancient texts to prove the Solbrand's silence is artificial.
- **Dusk:** An Emberth forge-tender who was cast out of the citadels for defacing her holy sun-brands. She hunts for fragments of the shattered Sundered Monoliths in the badlands, seeking bodyguards for dangerous retrieval runs.

**Iceheart Sea:**
- **Captain Jax:** A jolly but untrustworthy Merryn pirate with glowing skin-markings. He operates a floating tavern on a salvaged ironclad deck in Merrowport, constantly recruiting muscle for daring smuggling runs through the Synod's trade blockades.
- **The Brine-Ferryman:** A quiet Deep-Born ferryman whose wooden skiff is bound with glowing sea-charter runes. He offers passage across the freezing, ice-choked channels of the bay, but his fee is always a drop of the passenger's blood or a secret they have never told anyone.
- **Nessa of the Docks:** A human dock-master who is secretly the primary fence for Captain Mereval's smuggled goods. She controls the cargo schedules of the shipping lanes and can forge harbor entry permits for a price.

**Cragjaw Peaks:**
- **Murm the Bridge-Tender:** A calcified Groven bridge-warden whose stone-like skin makes it difficult for him to speak. He guards the Ancestor-Span bridges and will only grant passage to travelers who can solve the ancient riddles carved into the calcified bones of his ancestors.
- **Drall Kess:** A Fexric dwarf outland scrap-dealer who salvages clockwork parts from abandoned pipeline junctions. She possesses detailed schematics of Guild-Master Keth's private workshops and will trade them for rare alchemical compounds.
- **Wind-Singer Cora:** A Corvani (GM-only creature race) messenger who lives in the highest spires of the peaks. She uses her trained falcons and wind-gliders to carry messages across the freezing mountain passes, charging a high price in personal memories.

**Sundrift Vale:**
- **Kumiss-Maker Dol:** An Ordan elder who brews fermented mare's milk in the nomadic Mound-Camps. He remembers the movements of the horse-clans for the past forty years and can point travelers toward the shifting, gravity-warped paths of the steppe.
- **The Unlit Guide:** A star-less Astril guide who was born without the typical celestial glow. Because he is blind to star-light, he has developed a perfect memory of the physical landmarks of the steppe, guiding caravans through the shifting silt-tides.
- **Mound-Watcher Tesa:** An elderly Ordan shaman who tends the ancient burial mounds. She can interpret the low, resonant humming of the valley's Monoliths, translating their warnings of impending gravity storms.

**Bryngloom Forest:**
- **Peat-Cutter Jor:** A weary Vreken peat-cutter who works the deep bogs of the Sunken Spire. He knows which pools are bottomless and which paths are safe from Neth pact-mages, helping Sister Vraka's rebels hide in the damp moss.
- **The Hush-Dealer:** A corrupted Vreken who deals in ghost-mycelium spores in the forest shanties. He uses the spores to block out the telepathic echoes of the forest, selling them to desperate refugees who want to hide from the Neth mind-searches.
- **Contract-Scribe Vell:** A cynical Neth lawyer who drafts agreements in the city of Atropolis. He is bound by Neth honor to draft only legal contracts, but he is a master at finding loopholes that allow Vreken debtors to escape their peat-bonds.`
            }
          ]
        }
      }
      ,{
        id: 'player-agency',
        name: 'Player Agency & Regional Threads',
        icon: 'fas fa-project-diagram',
        theme: 'narrative',
        summary: [
          'Concrete hooks for each region that players can influence and reshape.',
          'Faction reputation systems with mechanical benefits and consequences.',
          'Dynamic events that evolve based on player choices, making the world feel alive.'
        ],
        content: {
          title: 'Player Agency & Regional Threads',
          description: 'The world of Mythrill is not static. Every region has tensions, factions, and unresolved conflicts that players can influence. This section provides GMs with specific threads to pull on: hooks that are deeply immersed in the existing lore and give players genuine agency to shape the world.',
          sections: [
            {
              title: 'How Player Agency Works in Mythrill',
              content: `Player agency in Mythrill is not about changing the cosmic scale, you cannot unbury the sun or defeat Keth-Amar in a single campaign. Instead, agency operates at the **regional and faction level**. Players can:

- **Shift faction balances**: Help one faction gain power, weaken another, or play them against each other.
- **Resolve local crises**: Address the specific problems in each region (memory decay in Frostwood, glacier advance in Nordhalla, civil war in Sundale).
- **Build assets** - Establish taverns, guilds, bridges, or trading posts that become permanent parts of the world.
- **Influence NPC trajectories**: Help NPCs achieve their goals, thwart them, or redirect them toward new purposes.
- **Uncover hidden truths**: Discover secrets that change how factions interact (e.g., the truth about House Viridane's refusal).

Each region below has **3-4 specific threads** that GMs can introduce. These threads are designed to be **modular**: introduce one, two, or all of them depending on your campaign's scope.`
            },
            {
              title: 'Frostwood Reach: Threads of Memory',
              content: `**Thread 1: The Memory Market**
The black market in the Shallows trades in bottled memories. Players can:
- **Buy memories** to gain temporary skill proficiencies or lore knowledge (mechanical benefit: advantage on one check related to the memory's content).
- **Sell their own memories** for gold (mechanical cost: lose proficiency in one skill until the memory is recovered).
- **Investigate the source**: Who is harvesting these memories? Are they stolen, or freely given?

**Consequence:** If players disrupt the memory market, the Unwoven Mimir lose their primary income source. They may become allies (grateful) or enemies (desperate).

**Thread 2: The Lineage Crisis**
Sentinel-Commander Vaelen Greymark is searching for a Briaran child to sit on the Greymark Throne. Players can:
- **Help him find the child**: Gain Greymark's favor (mechanical benefit: free lodging, access to restricted archives).
- **Protect the child**: Earn the Briaran's trust (mechanical benefit: safe passage through moonlit groves, access to fae bargains).
- **Expose the truth**: Reveal that the "ancient lineage pact" was fabricated to justify Thalren rule (mechanical benefit: Unwoven Mimir and Briaran become permanent allies; Thalren humans become hostile).

**Consequence:** This thread directly ties to the cosmic lore, the Briaran are descendants of House Viridane, the family that refused Keth-Amar. Helping them strengthens the "refusal" faction in the cosmic conflict.

**Thread 3: The Fog's Edge**
The fog is thickening. Players can:
- **Investigate the cause**: Is it natural, or is something manipulating it? (Hook: Sylvain of the Unwoven is using fae-hush to accelerate memory decay.)
- **Find a solution**: Ancient Thalren records mention a "Heart-Oak" that anchors the fog. Players can restore it, destroy it, or bargain with it.
- **Exploit the chaos**: Use the thickening fog to smuggle goods, hide from enemies, or ambush rivals.

**Consequence:** If the fog thickens too much, Greymark Keep becomes isolated. Trade routes close. The region's economy collapses. Players who helped cause this must now deal with the consequences.

**Thread 4: The Revel's Invitation**
The Revel (the fae court whose celebration never ended) is recruiting. Players can:
- **Accept the invitation**: Gain powerful fae blessings (mechanical benefit: +2 to Charisma checks, resistance to charm effects) but lose track of time (mechanical cost: age 1d10 years instantly).
- **Reject the invitation**: The Revel takes offense. Players gain a powerful enemy (the Revel will sabotage future social encounters in the Reach).
- **Negotiate terms**: Use Persuasion or Intimidation to set boundaries. Success depends on the roll and the GM's discretion.

**Consequence:** The Revel is tied to the cosmic lore, it began "before the sun died." Players who ally with it gain access to ancient knowledge about the Deepening and Keth-Amar, but at a cost.`
            },
            {
              title: 'Nordhalla: Threads of Ice',
              content: `**Thread 1: The Geothermal War**
Jarl Eirik Skalvyr and the Archive wardens are fighting over ownership of the geothermal pipes. Players can:
- **Side with Jarl Eirik**: Gain the fjord-keeps' support (mechanical benefit: free healing at fjord-keep infirmaries, access to Bloodhammer warriors as mercenaries).
- **Side with the Archive**: Gain the Rune Keepers' knowledge (mechanical benefit: access to ancient technology, advantage on Arcana checks).
- **Broker a compromise**: Share the geothermal resources. Both factions gain moderate respect (mechanical benefit: access to both, but neither fully trusts the party).

**Consequence:** The geothermal pipes power the Frozen Archive's heating. If they shut down, the Archive freezes. Ancient machines stop. Knowledge is lost. This directly impacts the cosmic conflict, the Archive contains records about Keth-Amar's weaknesses.

**Thread 2: The Frost-Tithe Cure**
High-Oracle Skari is trying to rewrite the history of the Frost-Tithe. Players can:
- **Help his research**: Gather rare ingredients, protect him from enemies, translate ancient texts. Reward: He shares prophecies about the Sundered Monoliths.
- **Stop his excavation**: The elders of House Skalvyr view it as blasphemous. Reward: The elders grant political favors.
- **Discover the truth**: The Frost-Tithe is not a curse. It is a **symptom** of the Sundered Monolith's resonance. Cure the Monolith's influence, and the Frost-Tithe ends.

**Consequence:** If players cure the Frost-Tithe, the Frostbound (blue-skinned outcasts) are no longer born. The Frostbound culture disappears. Players must decide: is ending a disease worth erasing a culture?

**Thread 3: The Skreika Siege**
The Skreika (blue-fleshed drowned warriors) are besieging the fjord-keeps in unprecedented numbers. Players can:
- **Fight the Skreika**: Gain military honors (mechanical benefit: +1 to attack rolls against undead for 30 days).
- **Investigate the cause**: Why are they attacking now? (Hook: High-Oracle Skari whispered the fjord-keep locations to them.)
- **Negotiate with the Skreika**: They are not mindless. They have demands. What do they want?

**Consequence:** The Skreika are tied to the Iceheart Sea's lore. If players discover they are being manipulated by a larger force (Keth-Amar's influence?), this thread connects to the cosmic conflict.

**Thread 4: The Frozen Archive's Secret**
The Archive contains a 10,000-year-old civilization's knowledge. Players can:
- **Explore the deepest vaults**: Discover ancient technology (mechanical benefit: unique magic items, knowledge of forgotten spells).
- **Awaken the machines**: The Archive's clockwork engines are still running. What do they do? (Hook: They are calculating Keth-Amar's weakness.)
- **Steal the knowledge**: The Rune Keepers will hunt the party. The Neth will offer to buy the information.

**Consequence:** The Archive's knowledge is a **weapon** in the cosmic conflict. Whoever controls it has an advantage against Keth-Amar. Players must decide: share it, sell it, or destroy it.`
            },
            {
              title: 'Sundale: Threads of Ash',
              content: `**Thread 1: The Solbrand's Dimming**
The Solbrand (Sol's last ember) is fading. The Korr have concealed this for three generations. Players can:
- **Expose the truth**: The Thrask and Unwoven factions will rally to the party. The Korr will become enemies.
- **Help the Korr**: Find a way to reignite the Solbrand. (Hook: It requires a sacrifice, a willing soul, a Sundered Monolith fragment, or the party's own life force.)
- **Side with the Sunderer**: They believe the Solbrand is Keth-Amar's feeding-line. Destroy it, and Keth-Amar starves. But Sol dies forever.

**Consequence:** This is the **central cosmic conflict** made local. The Solbrand's fate determines whether Sol can be reborn. Players who resolve this thread directly impact the campaign's endgame.

**Thread 2: The Civil War**
Three factions are fighting for control of Sundale: the Risen (old faith), the Sunderer (heretics), and the Unwoven (seal the breach). Players can:
- **Join a faction**: Gain their support (mechanical benefit: faction-specific abilities, access to their resources).
- **Play factions against each other**: Weaken all three, then seize power. (Mechanical benefit: control of the Harath-Vault, but all factions become enemies.)
- **Forge a fourth path**: Unite the factions against a common enemy. (Requires high Persuasion rolls and a compelling reason.)

**Consequence:** Whoever controls Sundale controls Emberspire, the breach-site where Keth-Amar feeds. This thread determines who has power in the final confrontation.

**Thread 3: The Shyr's Toll**
The Shyr (the basalt trade route) is controlled by the Thrask, who demand heavy tolls. Players can:
- **Pay the toll**: Safe passage, but expensive.
- **Fight through**: Gain a reputation as rebels. The Thrask will hunt the party.
- **Negotiate free passage**: Offer the Thrask something they want (information, weapons, alliance against the Korr).
- **Find an alternate route**: Dangerous, but avoids the toll. (Hook: The alternate route passes through a Husque-rift, a tear in reality leaking Keth-Amar's hunger.)

**Consequence:** The Shyr is the **only safe trade route** in Sundale. Controlling it means controlling the region's economy. Players who seize it become major political players.

**Thread 4: The Emberth Schism**
The Emberth are split between the Korr (priestly elite) and the Thrask (surface rangers). Players can:
- **Unite the Emberth**: Resolve the schism. (Requires discovering why the Korr concealed the Solbrand's dimming.)
- **Side with the Korr**: Gain access to the Harath-Vault's inner rings.
- **Side with the Thrask**: Gain access to the surface badlands and the Shyr.

**Consequence:** The Emberth are Sol's chosen people. Their unity (or disunity) affects the cosmic conflict. A united Emberth can reignite the Solbrand. A divided Emberth cannot.`
            },
            {
              title: 'Iceheart Sea: Threads of Storm',
              content: `**Thread 1: The Shipping Lanes**
Synod-Broker Lyra (Neth) and Captain Mereval (Merryn pirate) are fighting over control of the shipping lanes. Players can:
- **Side with Lyra**: Gain Neth support (mechanical benefit: access to memory-glass records, contract magic).
- **Side with Mereval**: Gain pirate support (mechanical benefit: free passage on Merryn ships, access to black market goods).
- **Broker peace**: Share the shipping lanes. Both factions gain moderate respect.

**Consequence:** The shipping lanes connect all seven regions. Whoever controls them controls trade. This thread has **global consequences**: not just local to the Iceheart Sea.

**Thread 2: The Oceanic Rift**
The Sundered Monolith rests at the bottom of the Treakous Oceanic Rift. Players can:
- **Retrieve it**: Requires deep-sea diving equipment, protection from the Rift's thrumming (which causes teeth to ache and minds to fracture), and a way to transport it.
- **Seal it in place**: The Deep-Born Myrathil can help, but they want something in return.
- **Destroy it**: The Rift will collapse. The Iceheart Sea's storms will intensify. Merrowport may be destroyed.

**Consequence:** This is one of the **seven Sundered Monoliths**. Retrieving or destroying it directly impacts the cosmic conflict. The Iceheart Sea's shard is tied to the Deep-Born Myrathil's lore, they hear new voices in the abyss.

**Thread 3: The Brine-Ferryman's Price**
The Brine (ghost-ferryman) offers passage to any port for a price the passenger doesn't understand until they've paid. Players can:
- **Accept the offer**: Gain safe passage, but pay a hidden cost (GM chooses: lose a memory, age 1d10 years, owe a debt to the Brine).
- **Refuse the offer**: The Brine takes offense. Future sea travel becomes dangerous.
- **Negotiate the price**: Use Persuasion or Intimidation. Success depends on the roll.

**Consequence:** The Brine is tied to the Iceheart Sea's Wyrd-creatures. It is born from "the fear of bad bargains." Players who outsmart it gain a powerful ally. Players who fail become its permanent debtors.

**Thread 4: The Myrathil's Secret**
The Myrathil know the location of the Oceanic Rift Monolith and keep it secret. Players can:
- **Earn their trust**: Help the Myrathil with a crisis (the spawning gales are shifting north, threatening their birthing grounds).
- **Steal the information**: The Myrathil will hunt the party.
- **Bargain for it**: Offer something the Myrathil want (protection, resources, alliance against a common enemy).

**Consequence:** The Myrathil are the sea mother's experiment in personhood. Their loyalty is valuable. Players who earn it gain access to the Oceanic Rift and the Myrathil's unique abilities (weather-sensing, navigation, amphibious combat).`
            },
            {
              title: 'Cragjaw Peaks: Threads of Stone',
              content: `**Thread 1: The Bridge Toll**
The Groven control the Ancestor-Spans and charge tolls. Players can:
- **Pay the toll**: Safe passage, but expensive.
- **Fight through**: Gain a reputation as rebels. The Groven will hunt the party.
- **Negotiate free passage**: Offer the Groven something they want (help against the Fexrick, access to surface goods, alliance against a common enemy).
- **Build an alternate route**: Dangerous, but avoids the toll. (Hook: The alternate route passes through Thrumm territory, the ancient parent race of the Groven.)

**Consequence:** The Ancestor-Spans are the **only safe passage** through the Cragjaw Peaks. Controlling them means controlling trade between north and south. Players who seize them become major political players.

**Thread 2: The Vat-Breakers' Legacy**
The Groven were created by the Fexrick, then rebelled. The Fexrick still capture Thrumm broodlings and inject them with alchemical serums. Players can:
- **Free the Lost Brood**: Rescue the Thrumm still being held in the Fexrick vats. (Mechanical benefit: The Thrumm become allies, but the Fexrick become permanent enemies.)
- **Destroy the vats**: End the Fexrick's alchemical experiments. (Mechanical benefit: The Groven become permanent allies, but the Fexrick's technology is lost.)
- **Negotiate a truce**: The Fexrick stop experimenting, the Groven stop raiding. (Requires high Persuasion rolls and a compelling reason.)

**Consequence:** The Groven are tied to the Cragjaw Peaks' lore, they were created from the Thrumm. This thread explores the ethics of creation and rebellion. Players who resolve it shape the region's future.

**Thread 3: The Corvani's Price**
The Corvani (a raven-marked subfolk of Nordhalla's glacier-spires) can carry messages between the frozen fjord-keeps in three days, a journey that takes anyone else three weeks. Their price is always a memory. Players can:
- **Pay the price**: Lose a memory (GM chooses: a skill proficiency, a language, a piece of lore).
- **Refuse the price**: Find another way to send the message. (Hook: The alternate method is slower, dangerous, or unreliable.)
- **Negotiate a different price**: Offer the Corvani something they want (information, protection, alliance against a common enemy).

**Consequence:** The Corvani are tied to Nordhalla's lore, they carve their eyries into the glacier-faces. Their memories are valuable currency. Players who trade with them gain access to unique knowledge of the frozen fjord-keeps.

**Thread 4: The Thrum's Awakening**
The Thrum (the mountain's consciousness) is stirring. Players can:
- **Investigate the cause**: Why is it waking now? (Hook: The Sundered Monolith's resonance is affecting it.)
- **Communicate with it**: The Thrum is slow, ancient, and alien. It speaks in vibrations, not words.
- **Exploit its awakening**: Use the Thrum's power to collapse tunnels, trigger avalanches, or crush enemies.

**Consequence:** The Thrum is tied to the Cragjaw Peaks' Wyrd-creatures, it is born from "the fear of what the mountain remembers." Players who ally with it gain a powerful but unpredictable ally. Players who anger it face the mountain's wrath.`
            },
            {
              title: 'Sundrift Vale: Threads of Stars',
              content: `**Thread 1: The Astril Schism**
The Astril are split between the Sylen (embrace the constellation-spirits) and the Muren (suppress them). Players can:
- **Side with the Sylen**: Gain access to their celestial magic (mechanical benefit: +2 to Spirit checks, resistance to psychic damage).
- **Side with the Muren**: Gain access to their defensive magic (mechanical benefit: +2 to Constitution checks, resistance to radiant damage).
- **Unite the Astril**: Resolve the schism. (Requires discovering why the constellation-spirits fled to mortal vessels in the first place.)

**Consequence:** The Astril carry Sol's celestial ministers in their blood. Their unity (or disunity) affects the cosmic conflict. A united Astril can communicate with Sol. A divided Astril cannot.

**Thread 2: The Mound Monolith**
The Sundered Monolith is buried in the oldest Ancestor Mound. Players can:
- **Retrieve it**: Requires navigating the starless steppe, surviving the Hungry Child (Wyrd-creature that consumes those who have no stories about stars), and bargaining with the Sere-Khan (guilt-ridden judge who tries cases brought by the dead).
- **Seal it in place**: The Ordan nomads can help, but they want something in return.
- **Destroy it**: The Ancestor Mound will collapse. The throat-sung histories will be lost forever.

**Consequence:** This is one of the **seven Sundered Monoliths**. Retrieving or destroying it directly impacts the cosmic conflict. The Sundrift Vale's shard is tied to the Astril's lore, they carry the constellation-spirits that Keth-Amar failed to eat.

**Thread 3: The Starless Sky**
The sky is dark. No stars. No constellations. Players can:
- **Investigate the cause**: The constellations were erased when House Ordavan made their bargain. Can they be restored?
- **Navigate without stars**: The Ordan nomads navigate by throat-sung ancestor-maps. Players can learn this technique. (Mechanical benefit: advantage on Survival checks in the steppe.)
- **Exploit the darkness**: Use the starless sky to hide from enemies, ambush rivals, or smuggle goods.

**Consequence:** The starless sky is tied to the Sundrift Vale's lore, it is the price of the endless migration. Players who restore the stars change the region forever. The Ordan nomads lose their unique navigation method, but gain the ability to see the heavens again.

**Thread 4: The Unlit's Rebellion**
The Unlit (Astril born without star-glow) are used as spies because they can lie without their skin flashing. Players can:
- **Help the Unlit**: Gain their support (mechanical benefit: access to their spy network, advantage on Deception checks).
- **Oppose the Unlit**: The Synod will reward the party. (Mechanical benefit: access to the Synod-Hold's resources, but the Unlit become enemies.)
- **Unite the Unlit and the Synod**: Resolve the tension. (Requires high Persuasion rolls and a compelling reason.)

**Consequence:** The Unlit are tied to the Astril's lore, they are born without constellation-spirits. Their rebellion explores themes of identity and belonging. Players who resolve it shape the Astril's future.`
            },
            {
              title: 'Bryngloom Forest: Threads of Decay',
              content: `**Thread 1: The Neth-Vreken Tension**
The Neth and Vreken share the Bryngloom in cold, functional silence. Players can:
- **Side with the Neth**: Gain access to their contract magic (mechanical benefit: advantage on Persuasion checks, access to memory-glass records).
- **Side with the Vreken**: Gain access to their fungal magic (mechanical benefit: advantage on Medicine checks, access to Ghost-Mycelium remedies).
- **Broker peace**: Unite the Neth and Vreken against a common enemy. (Requires high Persuasion rolls and a compelling reason.)

**Consequence:** The Neth and Vreken are tied to the Bryngloom's lore, they worship/negotiated with the Keeper of the Last Threshold. Their unity (or disunity) affects the region's stability. A united Bryngloom can resist Keth-Amar's influence. A divided Bryngloom cannot.

**Thread 2: The Hush Epidemic**
The Ghost-Mycelium's addictive "hush" is spreading. Players can:
- **Find a cure**: Investigate the source of the epidemic. (Hook: The Clean Vreken are immune, but they are not sharing their secret.)
- **Contain the spread**: Quarantine infected areas. (Mechanical cost: The quarantined areas become dangerous, but the epidemic slows.)
- **Exploit the epidemic**: Sell hush to addicts. (Mechanical benefit: Gold, but the party gains a powerful enemy, the Inquisitor.)

**Consequence:** The hush is tied to the Bryngloom's Wyrd-creatures, it is born from "the fear of cycles that never close." Players who resolve this thread shape the region's future. The Marked Vreken (addicted to hush) are a culture. Curing the epidemic may erase that culture.

**Thread 3: The Keeper's Bargain**
The Keeper of the Last Threshold (the Root-Veil) governs the Bryngloom. Players can:
- **Negotiate with the Keeper**: It accepts legal arguments, not prayers. (Mechanical benefit: Access to the Keeper's power, but the party must fulfill a bargain.)
- **Defy the Keeper**: The Keeper will hunt the party. (Mechanical cost: The Bryngloom becomes hostile, but the party gains freedom from the Keeper's contracts.)
- **Replace the Keeper**: The Keeper is ancient, but not immortal. Can it be overthrown? (Hook: The Vreken's Root-Veil and the Neth's Keeper are the same entity. If players discover this, they can exploit it.)

**Consequence:** The Keeper is tied to the Bryngloom's lore, it is the entity that preserves the Neth and governs the Vreken. Players who resolve this thread shape the region's future. The Keeper's power is a **weapon** in the cosmic conflict.

**Thread 4: The Cycle-Eater's Hunger**
The Cycle-Eater (Wyrd-creature that consumes reincarnation) is growing stronger. Players can:
- **Investigate the cause**: Why is it growing stronger now? (Hook: The Sundered Monolith's resonance is affecting it.)
- **Destroy it**: The Cycle-Eater is born from "the fear of cycles that never close." Players must address that fear to destroy it.
- **Bargain with it**: The Cycle-Eater is intelligent. It may accept a trade. (Mechanical benefit: Access to its power, but the party owes a debt.)

**Consequence:** The Cycle-Eater is tied to the Bryngloom's Wyrd-creatures. It consumes not just lives, but **every iteration of that soul across all its past and future existences**. Players who fail to stop it risk permanent death, not just for themselves, but for every version of themselves.`
            },
            {
              title: 'Dynamic Events System',
              content: `Player actions trigger dynamic events that evolve over time. These events are **not scripted**: they respond to player choices and create a living, breathing world.

**Event Types:**

1. **Faction Shifts**: When players help a faction gain power, that faction's influence grows. Example: If players help the Thrask in Sundale, the Thrask gain control of more territory. The Korr lose influence. This affects future encounters, quest availability, and NPC attitudes.

2. **Regional Crises**: When players ignore a problem, it worsens. Example: If players ignore the hush epidemic in Bryngloom, it spreads. More Marked Vreken become addicted. The Clean Vreken become more oppressive. The Inquisitors become more aggressive.

3. **NPC Trajectories**: NPCs have goals. Players can help them achieve those goals, thwart them, or redirect them. Example: If players help High-Oracle Skari in Nordhalla, he completes his excavation. The Frost-Tithe's history is rewritten. The Frostbound gain respect. If players stop him, he becomes an enemy. The elders of House Skalvyr gain influence.

4. **World Changes**: Major player actions permanently change the world. Example: If players destroy the Solbrand in Sundale, Sol dies forever. The Emberth lose their purpose. The region becomes a wasteland. This is a **permanent change**: it cannot be undone.

**GM Guidelines:**
- Track player actions and their consequences.
- Introduce dynamic events organically, don't force them.
- Let players see the results of their choices. If they help a faction, show that faction's influence growing. If they ignore a problem, show it worsening.
- Use dynamic events to create **moral dilemmas**: not every choice has a clear "right" answer. Sometimes helping one faction hurts another. Sometimes solving one problem creates another.`
            }
          ]
        }
      }
      ,{
        id: 'class-origins',
        name: 'Class Origins',
        icon: 'fas fa-hat-wizard',
        theme: 'narrative',
        useCustomComponent: true,
        summary: [
          'Every class resource system has an immersive origin story woven into the history of Mythrill.',
          'These origins tie mechanical resources directly to regional bargains, the Breach, and Wyrd aftermath.',
          'Each calling represents a profound physical and spiritual toll paid to survive the sunless era.'
        ],
        content: {
          title: 'Class Resource Lore Origins',
          description: 'In the frozen world of Mythrill, class resources are not merely game mechanics: they are physical and physiological inheritances of ancient bargains, Wyrd-rot, and the Breach. Every calling represents a heavy toll paid in blood, memory, and stamina.',
          sections: getClassOriginsSections()
        }
      },
      {
        id: 'session-zero',
        name: 'Your First Adventure',
        icon: 'fas fa-shield-alt',
        theme: 'narrative',
        summary: [
          'A level-1 starter scenario set in Timber-Post Nine on the margins of the Frostwood Reach.',
          'Focuses on street-level stakes (geothermal coal recovery) and local NPCs rather than cosmic threats.',
          'Presents a meaningful ethical choice that teaches players about consequences and the Wyrd.'
        ],
        content: {
          title: 'Session Zero: The Frozen Sledge',
          description: 'A starter adventure designed for level-1 characters to introduce players to the survival realities, localized Wyrd threats, and moral dilemmas of the sunless world.',
          sections: [
            {
              title: 'The Hook & Setup',
              content: `The adventurers begin in **Timber-Post Nine**, a tiny, frost-bitten logging outpost on the margins of the Frostwood Reach. The community is in crisis: their monthly thermal-sledge, carrying geothermal coal-casks from the Sundale border, has failed to arrive. Without this coal, the outpost's central heater-forge will die within forty-eight hours, and Timber-Post Nine will freeze solid.

The local village elder, **Marra of the Nine**, offers a simple bounty: recover the sledge and bring back the coal-casks. She cannot offer gold, but she promises shelter, cold-iron nails, and a map through the local mist-vales.`
            },
            {
              title: 'Street-Level NPCs',
              content: `- **Marra of the Nine:** The cynical human village elder, her hands heavily scarred from frostbite, desperate to save her grandchildren from the creeping cold.
- **Jad the Stoker:** A retired Ithran Groven smith who tends the outpost's central heater-forge, coughing soot and warning that the furnace is on its last coal-shavings.
- **Orl the Scout:** A young Corvani (GM-only creature race) messenger from Nordhalla\'s glacier-spires who saw the sledge\'s tracks veer off the trail into the **Whispering Silt-Bed** before the mist closed in. He is too terrified of the local Wyrd-whispers to go alone but will provide directions.`
            },
            {
              title: 'The Encounter & Stakes',
              content: `The adventurers track the sledge into a freezing, mist-veiled gorge. They find the sledge abandoned, its draft-beasts frozen, and two casks of coal remaining. The rest of the cargo has been dragged into a shallow basalt cave by a pack of **Gref-Spawn**: minor, faceless Wyrd-creatures born from the local loggers' fear of losing their names to the fog.

1. **The Choice:** The cave is structurally unstable. Retrieving the remaining casks requires either an Athletics challenge to clear the basalt debris silently, or fighting the Gref-Spawn under the threat of a rockfall.
2. **The Twist:** A dying driver, **Toma**, is trapped under the sledge. If they save him, they must leave one cask behind due to weight limits on their makeshift litter. If they leave him, they retrieve all the coal but return to the village with the burden of his death.
3. **The Consequence:** Returning to Timber-Post Nine with the coal saves the village, establishing the adventurers as local heroes and earning the trust of the logging guilds. Leaving Toma behind, however, leaves his ghost to haunt the trail, attracting a Gambrel that will stalk the party in future sessions.`
            }
          ]
        }
      }
      ,{
        id: 'lexicon',
        name: 'Lexicon',
        icon: 'fas fa-book',
        theme: 'narrative',
        useCustomComponent: true,
        summary: [
          'Comprehensive pronunciation guide for Mythrill\'s complex terminology.',
          'Lists phonetic spellings and deep lore contextual explanations.',
          'Fully auto-linked proper nouns let you easily cross-reference everything.'
        ],
        content: {
          title: 'The Mythrill Lexicon & Pronunciation Guide',
          description: 'A comprehensive guide to the unique terminology, custom races, regional human bloodlines, and cosmological phenomena of the sunless world.',
          sections: [
            {
              title: 'Mimir [Pronunciation: MEE-meer]',
              content: '**Noun (Plural: Mimir).** A secretive, fluid race of misty face-shifters native to the <LoreLink termId="frostwood-reach">Frostwood Reach</LoreLink>. To navigate human paranoia, they wear a single beautifully carved seamless heartwood or storm-glass mask that they never remove in public under the *Rite of Masks*, preventing the doppelganger shadow-parasites in their blood from overwhelming their mortal souls.'
            },
            {
              title: 'Emberth [Pronunciation: EM-berth]',
              content: '**Noun (Plural: Emberth).** Dense, powerful sun-reverent forge-clans of <LoreLink termId="sundale">Sundale</LoreLink>. They possess charcoal-textured black skin cross-hatched with glowing, scar-traced forge-marks and large, heat-sensitive eyes. Long before the sun\'s death, they dug vast subterranean vaults to preserve the *Solbrand*, believed to be the last conscious spark of the sun god Sol.'
            },
            {
              title: 'Fexric / Fexrick [Pronunciation: FEX-rik]',
              content: '**Noun (Plural: Fexric).** The ancient gnomish engineers of the <LoreLink termId="cragjaw-peaks">Cragjaw Peaks</LoreLink>, creators of alchemy and geothermal technology. Stocky, green-skinned craftsmen with copper-wired beards, every Fexric carries at least one mechanical clockwork graft (ocular, limb, or digit) as a mark of craft-mastery, which acts as a lightning rod for alchemical currents.'
            },
            {
              title: 'Myrathil [Pronunciation: my-RATH-il]',
              content: '**Noun (Plural: Myrathil).** Ethereal, scaled water-creatures born from the violent collision of volcanic caldera heat and freezing glacial ice sheet runoff. They possess shimmering, bioluminescent teal veins that ebb and flow with the ocean\'s tides, and they survive by siphoning ocean-glow to navigate ice-bound maritime lanes.'
            },
            {
              title: 'Velun Neth [Pronunciation: veh-LOON NETH]',
              content: '**Noun (Plural: Velun Neth).** The highest bloodline of the Neth, who inherited the Keeper of the Last Threshold\'s authority. Pure-silver-skinned arcanists and pact-mages who cannot lie, every word they speak is magically binding on themselves. They govern the high libraries of <LoreLink termId="atropolis">Atropolis</LoreLink> and run <LoreLink termId="ironjaw_port">Ironjaw Port</LoreLink> with legalistic coldness.'
            },
            {
              title: 'Wyrd [Pronunciation: WIRD]',
              content: '**Noun.** A formless primordial spiritual rot sealed since before human memory, released when <LoreLink termId="emberspire">Emberspire</LoreLink> erupted. It cannot create, only occupy the collective imagination. It uses human fear and folklore as structural blueprints, transforming whispered cautionary tales into living, physical horrors unique to each region.'
            },
            {
              title: 'Thrask [Pronunciation: THRASK]',
              content: '**Noun (Plural: Thrask).** Emberth rangers, hunters, and miners of the <LoreLink termId="sundale">Sundale</LoreLink> surface badlands. Evolving bronze, wind-scarred skin and thick muscle, they are pragmatic, swift skeptics of the Korr\'s wait-and-see policy. They patrol the Shyr trade route, demanding tolls in blood-ore and alchemical reagents.'
            },
            {
              title: 'Unlit [Pronunciation: UN-lit]',
              content: '**Noun (Plural: Unlit).** Astril born without a constellation-pattern, carrying no spirit, no whisper, and no star-glow. Legally non-existent within the Luminarchy\'s registries. Because they are the only Astril who can lie without their skin flashing betrayal, they operate as a powerful shadow network of spies, smugglers, and information brokers.'
            },
            {
              title: 'Vat-Breakers [Pronunciation: VAT-bray-kers]',
              content: '**Noun.** Fexric and Groven outcasts who sabotage geothermal siphons. Operating in the vertical ravines of Cragjaw, they rupture municipal heating pipes to redirect warmth to the freezing shanties of the lower Peaks.'
            },
            {
              title: 'Rite of the Cold Hearth [Pronunciation: RITE of the COLD HARTH]',
              content: '**Noun.** The forbidden ritual performed by the legendary Skald warlock Karr Bloodhammer in the prehistoric chambers of the <LoreLink termId="frozen_archive">Frozen Archive</LoreLink>. It binds the caster\'s soul to a basalt phylactery, granting undeath. Used to combat the Frost-Tithe that claimed so many Skald mothers and children.'
            },
            {
              title: 'Scathrach, the Ashen Sovereign [Pronunciation: SKATH-rak, the ASH-en SOV-rin]',
              content: '**Noun (Deity).** An ancient, parasitic demonic intelligence nesting deep within the volcanic caldera vaults of <LoreLink termId="emberspire">Emberspire</LoreLink> in <LoreLink termId="sundale">Sundale</LoreLink>. Scathrach answers the desperate prayers of martyrs and outcasts with destructive, absolute combustion. It serves as the sovereign patron of the Pyrofiends, slowly claiming their flesh and blood in exchange for fire magic, eventually binding their souls to the infernal furnace.'
            },
            {
              title: 'Shade-Walkers [Pronunciation: SHAYD-wawk-ers]',
              content: '**Noun.** Star-starved undead husks that hunt for open fire during the absolute freeze of a Cold-Lock. When the <LoreLink termId="silt_tide">Silt-Tide</LoreLink> peaks and the world freezes solid, mortals must seal their vaults and burn sacred ember-oil to survive these predators that are drawn to any source of warmth.'
            },
            {
              title: 'Skreika [Pronunciation: SKRAY-kah]',
              content: '**Noun.** Blue-skinned, water-logged undead sailors that rise from the freezing depths of the Iceheart Sea and climb onto the northern fjords of <LoreLink termId="nordhalla">Nordhalla</LoreLink>, carrying a freezing frost-fever.'
            },
            {
              title: 'Sol [Pronunciation: SOHL]',
              content: '**Noun (Deity).** The sun-god of Mythrill, who was bound and entombed beneath Emberspire in <LoreLink termId="sundale">Sundale</LoreLink> during the Deepening by the seven noble families to protect the star from the cosmic hunger of <LoreLink termId="keth_amar">Keth-Amar</LoreLink>.'
            },
            {
              title: 'Silt-Tide [Pronunciation: SILT-tyde]',
              content: '**Noun.** The periodic surge of freezing, crystalline dust that sweeps across the Iceheart Sea and Frostwood Reach, freezing everything in its path and forcing settlements to enter total lockdown.'
            },
            {
              title: 'Keth-Amar [Pronunciation: KETH-ah-mar]',
              content: '**Noun (Deity).** The Sun-Eater, the First Hunger, an abyssal entity that descended to consume Sol during its Deepening, now trapped inside the volcanic vault under <LoreLink termId="emberspire">Emberspire</LoreLink>, slowly devouring the sun\'s fading embers.'
            }
          ]
        }
      }

    ]
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: 'fas fa-door-open',
    description: 'Your first steps into Mythrill VTT: from interface to first roll',
    subcategories: [
      {
        id: 'welcome',
        name: 'Welcome to Mythrill',
        icon: 'fas fa-star',
        theme: 'narrative',
        summary: [
          'Mythrill is a premium virtual tabletop platform built for immersive, tactile TTRPG play.',
          'The system features 20 unique classes, 10+ races, and a custom spellcrafting wizard.',
          'This rules guide walks you from first login to running your first encounter.'
        ],
        content: {
          title: 'Welcome, Adventurer',
          description: 'Your guide to Mythrill VTT: what it is, how it works, and how to get started.',
          sections: [
            {
              title: 'What Is Mythrill?',
              content: `Mythrill is a **premium Virtual Tabletop (VTT)** platform purpose-built for the Mythrill TTRPG system. It combines a rich, fully-featured tabletop rules system with a beautifully designed digital platform, allowing groups of 2-8 players to run immersive, narratively rich role-playing sessions together, whether in the same room or across the world.\n\nAt its core, Mythrill consists of two interlocking parts:\n\n- **Mythrill TTRPG**: The game rules, your character's stats, how rolls work, how combat flows, how spells are cast, and how the world responds to your choices. All of these rules are documented in this very guide.\n- **Mythrill VTT**: The digital platform, the visual interface, the character sheets, the map grid, the combat tracker, and the library of tools that automate and enhance the rules above.\n\nTogether, they create an experience where the lines between the physical joy of rolling dice and the digital power of automation blur into something genuinely cinematic.`
            },
            {
              title: 'Transitioning from D&D (Key Differences)',
              content: `If you are coming to Mythrill from **Dungeons & Dragons (D&D 5e)**, welcome! While the spirit of epic adventure remains identical, Mythrill completely reinvents the tactical rules engine to be faster, more strategic, and far more intuitive on the digital screen. Here are the four massive differences you should know immediately:\n\n- **The Ladder of Trials (No Static DCs)**: In D&D, the DM sets a static target number (like DC 15) and you roll a d20. In Mythrill, there are no static DCs. Instead, the GM dynamically assigns a **Difficulty Die** (ranging from a d4 for very easy to a d20 for legendary trials). You roll that difficulty die, and add your Skill Rank. The roll results are color-coded in chat for instant feedback. Learn more in [Dice System](core-rules/dice-system).\n- **Unified Strike & Damage (No Double Rolling)**: D&D combat requires rolling to hit, checking if it hits, and then rolling for damage. Mythrill collapses this into a single, high-stakes moment! When you strike, you roll your weapon's damage die exactly once (**Unified Strike & Damage**). A natural 1 is a catastrophic fumble. Rolling the maximum value triggers an exploding critical hit. Any other result hits and deals that exact damage plus your Strength or Agility modifier! Learn more in [Attacks & Damage](combat-system/attacks-damage).\n- **Action Points Economy (3 AP for Ultimate Freedom)**: Forget the rigid Action, Bonus Action, and Movement system of D&D. Mythrill grants you a pool of **3 Action Points (AP)** at the start of your turn. You can spend them in *any* combination you want. Moving 30 feet costs 1 AP, attacking costs 2 AP, and casting a spell costs a variable amount of AP. You have absolute tactical freedom to decide your turn's flow. Learn more in [Combat Basics](combat-system/combat-basics).\n- **Active Soak Die (Dynamic Defense)**: In D&D, armor is a static AC number that makes attacks miss. In Mythrill, armor absorbs damage. Your Armor Score gives you permanent **Passive Damage Reduction (DR)** (Armor Score - 10, rounded down). If you see a heavy strike coming, you can spend AP to take the Defend action, letting you roll an **Active Soak Die** (up to a d10/d12 for heavy plate) to physically reduce incoming damage. Learn more in [Armor & Defense](combat-system/attacks-damage).`
            },
            {
              title: 'Your Four-Step Journey',
              content: `Getting started with Mythrill follows a natural four-step path:\n\n**Step 1: Read the Quick Start**: Skip the deep lore. Read [Quick Start: Your First Session](getting-started/quick-start) to learn the world in one page and get a recommended first character.\n\n**Step 2: Create Your Character**: Using the Character Creation Wizard, you will spend 5 focused steps forging your hero. See [Creating Your First Character](getting-started/your-first-character).\n\n**Step 3: Understand the Interface**: Familiarize yourself with the layout of the VTT. Read: [The Interface at a Glance](getting-started/interface-overview).\n\n**Step 4: Learn the Rules**: The rest of this guide covers every rule of the Mythrill TTRPG in detail, from the [Dice System](core-rules/dice-system) and [Character Statistics](core-rules/character-statistics) to [Combat](combat-system/combat-basics), [Magic](magic-system/magic-overview), and [Exploration](travel-exploration/travel-basics).`
            },
            {
              title: 'How to Use This Rulebook',
              content: `This is a **living, interactive rulebook** built into the VTT itself:\n\n- **Clickable Cross-Links**: Blue underlined links throughout the rules jump you directly to related sections. Look for links like [Dice System](core-rules/dice-system) or [Attacks & Damage](combat-system/attacks-damage).\n- **Quick Summary Tiles**: At the top of most sections, three bullet points give you the most important takeaways at a glance.\n- **Tables with Pagination**: Large tables are paginated so you can browse without endless scrolling.\n\n**Recommended Reading Order for New Players**:\n1. [Quick Start: Your First Session](getting-started/quick-start) ? Start here for a one-page world primer\n2. [Welcome to Mythrill](getting-started/welcome)\n3. [Transitioning from D&D 5e](getting-started/dnd-comparison)\n4. [The Interface at a Glance](getting-started/interface-overview)\n5. [Creating Your First Character](getting-started/your-first-character)\n6. [The Dice System](core-rules/dice-system)\n7. [Character Statistics](core-rules/character-statistics)\n8. [Combat Basics](combat-system/combat-basics)\n9. [Your Class](character-creation/classes)`
            }
          ]
        }
      },
      {
        id: 'quick-start',
        name: 'Quick Start: Your First Session',
        icon: 'fas fa-rocket',
        theme: 'narrative',
        summary: [
          'The sun is trapped underground. The world is freezing. Every civilization made a deal with a cosmic predator to survive.',
          'You are an adventurer in the Frostwood Reach, the official starting zone. Here is what you need to know to begin.',
          'Skip the deep lore for now. Learn it as you play.'
        ],
        content: {
          title: 'The World in One Page',
          description: 'Everything you need to know to start playing Mythrill right now.',
          sections: [
            {
              title: 'The World Today',
              content: `The sun has not risen in eight hundred years. It was buried beneath a volcano by a desperate ritual, and a cosmic predator is slowly eating it from inside its tomb. The world is freezing. Cities cluster around volcanic vents for warmth. Caravans cross snow-choked passes on bridges grown from the calcified dead. Every civilization that survives did so by making a dark bargain with the predator.

That is all you need to know to start playing. The rest you will learn as you explore.`
            },
            {
              title: 'Your Starting Zone: The Frostwood Reach',
              content: `You begin in the **Frostwood Reach**, a continent of dense, fog-choked forests where warm volcanic air collides with creeping northern frost. The fog is not weather. It is permanent. It protects the forests from freezing, but it also eats memories. People here keep meticulous written records because the fog slowly steals their history.

**The city of Greymark Keep** is your starting hub. It is a fortress of wet grey stone and petrified ironwood, where scribe-sentinels patrol the catwalks with journals chained to their belts. To lose your journal in Greymark is to lose your legal existence.

**What you will encounter:**
- **The Gref**: A face-stealing creature born from the fog. It wears the stolen visages of its victims.
- **The Gambrel**: A creature born from broken oaths. It hunts those who made promises they did not keep.
- **The Revel**: A fae court whose celebration began before the sun died and has never ended. Its dancers pull travelers into a revelry that consumes decades in a single night.

**The people you will meet:**
- **Thalren Humans**: The dominant culture. Journal-keepers, archivists, the most literate people in the world. They view anyone without a recorded lineage as a potential threat.
- **The Mimir**: A secretive, rare people who wear carved wooden masks they never remove in public. They can shift their faces, which makes humans deeply paranoid.
- **The Briaran**: Thorn-marked outcasts descended from the one noble family that refused to make a deal with the predator. They hide in the deepest moonlit groves.

**Daily life in Greymark:**
- **Food:** Smoked river-fish, pine-nut bread, and fermented root vegetables. Hot meals are a luxury reserved for those who can afford ember-coal.
- **Currency:** Copper marks (common), silver ledgers (standard), and gold seals (rare). Most trade is barter.
- **Taverns:** The **Ink & Ember** is the most popular gathering spot for adventurers. Warm, smoky, and lit by tallow candles. The owner, **Marta**, knows everyone's business and sells information for the price of a drink.
- **Work:** Caravans hire guards to cross the fog-choked trails. Archivists pay for recovered journals. The black market in the Shallows trades in bottled memories and stolen lineage records.`
            },
            {
              title: 'Your First Quest',
              content: `**The Missing Journal**

Marta at the Ink & Ember tells you that a scribe named **Elias** went missing three days ago. He was researching the old lineage tapestries in the Greymark archives. His journal was found in the Shallows, the black market district beneath the keep, but Elias himself is gone.

**What you know:**
- Elias was investigating a gap in the Thalren lineage records, a family that was erased from history.
- The journal contains a map to a hidden grove in the Frostwood, marked with Briaran thorn-symbols.
- The Unwoven Mimir in the Shallows are selling bottled memories that might contain clues.

**Your choices:**
1. **Investigate the archives**: Search Elias's workspace for more clues. (Investigation check)
2. **Visit the Shallows**: Question the Unwoven Mimir about the bottled memories. (Persuasion or Intimidation)
3. **Follow the map**: Head directly to the hidden grove. (Survival check to navigate the fog)

**What you will learn:**
- The erased family is House Viridane, the eighth noble house that refused the predator's bargain.
- The Briaran are their descendants, hiding in the moonlit groves.
- Something in the grove is calling to Elias, and it is not friendly.

This quest introduces you to the core themes of Mythrill: memory, identity, and the cost of survival. It also teaches you the basic mechanics: skill checks, social encounters, and exploration.`
            },
            {
              title: 'Recommended First Character',
              content: `If you are new to Mythrill and do not want to parse 20 classes, 11 races, and 15 backgrounds, here is a safe, fun starting build:

**The Fog Hunter**
- **Race:** Human (Thalren), You are from Greymark. You know the city, the fog, and the people.
- **Class:** Apex, You track Wyrd-creatures through the fog. You are deaf to human voices but can read the forest's vibrations.
- **Background:** Hunter, You know the trails, the beasts, and the dangers of the Reach.

**Why this works:**
- The Apex is straightforward: mark targets, strike with precision, pursue relentlessly.
- The Thalren subrace ties you directly to the starting zone. You have contacts in Greymark, you understand the fog, and you have a reason to care about the missing scribe.

**Alternative builds:**
- **The Archive Guard:** Human (Thalren), Warden class. You protect the keep and its records.
- **The Masked Stranger:** Mimir (Unwoven subrace), Shaper class. You are an outcast who fights with speed and deception.
- **The Thorn-Born:** Briaran (Unshorn subrace), Martyr class. You carry the weight of the refusal. You suffer for your allies.`
            },
            {
              title: 'The Rules You Need Right Now',
              content: `You do not need to read the entire rulebook to start playing. Here are the essentials:

**Rolling Dice:**
- The GM assigns a **Difficulty Die** (d4 to d20) based on how hard the task is.
- You roll that die and add your Skill Rank.
- Rolling the maximum value is a **Critical Success**. Rolling a 1 is a **Critical Failure**.

**Combat:**
- You have **3 Action Points (AP)** per turn.
- Moving costs 1 AP. Attacking costs 2 AP. Casting a spell costs 1-3 AP.
- When you attack, roll your weapon's damage die once. That is both your hit roll and your damage.
- Armor absorbs damage. When hit, roll your armor's **Soak Die** and subtract the result.

**Dying:**
- At 0 HP, you do not fall unconscious. You can still act, but heavy actions risk immediate death.
- This is your **Heroic Last Stand**. Make it count.

**That is it.** The rest of the rules are reference material. Learn them as you play.`
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
              content: `Coming from D&D 5e, you might expect to roll a d20 + flat modifiers against a static Armor Class (AC) or Difficulty Class (DC) set by the GM. In Mythrill, throw that expectation out! \n\nMythrill is built to be a highly tactile, dramatic, and visual system. The core philosophy is simple: **you do not roll a d20 against the world; you roll the difficulty of the challenge itself.**\n\nInstead of static numbers, obstacles in the world have physical weight represented by polyhedral dice on the **Ladder of Trials**. In combat, you do not roll to hit and then roll for damage, you roll your weapon's damage die exactly once in a **Unified Strike & Damage** roll. Armor doesn't make you hard to hit; it absorbs the blow. And if you fall to 0 HP, you do not lose consciousness; you stand your ground in a heroic final stand. \n\nThis guide breaks down these differences so you can transition seamlessly and master the VTT immediately.`
            },
            {
              title: '1. The Ladder of Trials vs. Static DCs',
              content: `In D&D 5e, when you attempt to pick a lock, the DM checks their notes, sets a static DC (like DC 15), and you roll a d20 + your Dexterity (Sleight of Hand) modifier. \n\nIn Mythrill, there are no static DCs. Instead, the GM dynamically assigns a **Difficulty Die** representing the complexity of the challenge. You roll *that difficulty die itself* and add your Skill Rank (Untrained, Novice, Trained, Apprentice, Adept, Expert, Master) plus situational modifiers. \n\n- **d4 (Very Easy)** to **d20 (Very Difficult)**: For an easy task, you roll a d4. For a near-impossible legendary trial, you roll a d20.\n- **Why a Smaller Die is Better**: Rolling the maximum face value on your Difficulty Die (e.g., a 4 on a d4, or an 8 on a d8) is a **Critical Success**. Rolling a 1 is always a **Critical Failure**. This means on a d4, you have a **25% chance** of a critical success, whereas on a d20, you have only a **5% chance**! \n- **Milestone of Mastery (+5 Modifier)**: While raw ability modifiers are rarely added directly to skill checks, if your primary or secondary attribute modifier reaches **+5 or higher**, your mastery is so profound that you **step down the Difficulty Die by one size** (e.g., from a challenging d10 to a moderate d8). This significantly boosts your chances of success and critical triumph!`
            },
            {
              title: '2. Unified Strike & Damage vs. Hit & Damage Rolls',
              content: `In D&D, combat can feel slow: you roll a d20 to hit, wait for the DM to confirm if it beats the target's AC, and then roll your damage dice. \n\nMythrill collapses this into a single, high-stakes moment: **Unified Strike & Damage**. When you attack, you roll your weapon's damage die exactly once:\n\n- **A Natural 1**: A catastrophic combat fumble. Your blade chips, your bowstring frays, or your rifle jams, dealing direct damage to your weapon's durability. See [Durability & Repair](core-rules/durability-repair).\n- **A Natural Maximum (Exploding Critical)**: Rolling the maximum value on your weapon die (e.g., an 8 on a d8 longsword) triggers an **exploding critical hit**. You deal maximum damage, roll the die *again* to add to the total (which can explode repeatedly!), and trigger a devastating weapon-specific condition (like Bleed for Slashing, or Stun for Bludgeoning).\n- **Any Other Roll**: You hit! The exact number you roll on the die is your raw damage. You add your Strength (for melee/heavy weapons) or Agility (for ranged/light weapons) modifier directly to this number, and that is the final damage dealt. No double rolling, no slow calculations!`
            },
            {
              title: '3. 3 Action Points (AP) vs. Rigid Action Economy',
              content: `D&D 5e restricts your turn to one Movement, one Action, one Bonus Action, and one Reaction. This can lead to frustrating turns where you have nothing to do with your Bonus Action, or cannot move after attacking. \n\nMythrill replaces this rigidity with ultimate tactical freedom: a **3 Action Points (AP)** economy. At the start of your turn, your Character HUD fills with 3 glowing AP orbs. You can spend them in *any* combination you see fit:\n\n- **Movement (1 AP)**: Move up to your speed (typically 30 feet).\n- **Strike (2 AP)**: Swing your sword or shoot your bow. A standard turn lets you strike once and still move, or use your remaining AP for another action.\n- **Cast a Spell (Variable AP)**: Spellcasting costs AP based on the power of the spell. Weak cantrips cost 1 AP, while standard spells cost 2-3 AP.\n- **Defend (1 AP)**: Raise your shield or steel yourself, preparing to roll your Active Soak Die when attacked. \n\nThis fluid economy lets you move across the battlefield and strike an enemy in one turn, or stand your ground and cast a powerful spell.`
            },
            {
              title: '4. Active Soak Die vs. Static AC',
              content: `In D&D, armor is a static number (AC) that determines whether an attack hits or misses. A plate-armored knight is hard to hit, and when an attack "misses," it is narratively described as bouncing off their plate. \n\nMythrill separates dodging from absorbing blows. Dodging is handled by your Agility and reflex skills, while armor physically reduces the impact of strikes:\n\n- **Passive Damage Reduction (DR)**: Your equipped armor grants a permanent Passive DR score (calculated as your Armor Score - 10, rounded down). Whenever you take damage, this passive value is automatically subtracted from the incoming damage.\n- **Active Soak Die**: When you see a devastating blow coming, you can spend AP on your turn to take the **Defend Action**. This grants you an **Active Soak Die** (ranging from a d4 for light leather up to a d10 or d12 for heavy full-plate armor). When an enemy hits you, you roll your Soak Die and reduce the incoming damage by the rolled amount! Armor in Mythrill makes you feel like an absolute tank, physically absorbing heavy blows in real-time.`
            },
            {
              title: '5. Conscious Dying vs. Unconscious Death Saves',
              content: `In D&D 5e, hitting 0 HP instantly knocks you unconscious, removing you from the game until someone heals you. You spend your turns doing nothing but rolling death saves, hoping you don't roll a natural 1. \n\nMythrill keeps you in the fight with **Conscious Dying**. When you hit 0 HP, you do **not** fall unconscious. You remain awake, on your feet, and fully aware, but you are teetering on the edge of the grave:\n\n- **Dying State**: You still roll a Death Save at the start of your turn, tracking successes and failures. \n- **Heroic Actions**: On your turn, you can still spend your Action Points (AP) to move, speak, or even attack. However, pushing your body in this state is extremely dangerous: performing heavy actions (like striking or casting spells) forces you to make an immediate, difficult Death Save or suffer internal bleeding.\n- **Dramatic Final Stands**: This allows for epic roleplay moments. Will you crawl to safety while coughing blood, use your last breath to cast a healing spell on a fallen ally, or execute one final, desperate strike to slay the boss before you collapse? The choice, and the tragedy, is yours.`
            },
            {
              title: '6. Classes vs. Single Class Archetypes',
              content: `In D&D, your class (like Fighter or Wizard) determines both your combat style and your roleplay identity, often requiring complex multiclassing to achieve specific character concepts. \n\nMythrill features **20 unique classes** (such as the furnace-bound Martyr, the time-bending Chronarch, the beast-taming Apex, or the chaotic Gambit). Your class dictates your health pool, weapon proficiencies, combat resource (Mana, Rage, Fortune, Necrotic Ascension), and active combat abilities. With 20 unique classes, you can find an archetype that matches your vision without multiclassing.`
            },
            {
              title: '7. Spatial Grid Inventory vs. Numeric Carrying Capacity',
              content: `D&D uses a numeric weight system (carrying capacity in pounds) that is so tedious to track that most players and DMs ignore it entirely, leading to characters carrying multiple chests, weapons, and hundreds of items without issue. \n\nMythrill introduces a highly visual and tactile **Spatial Grid Inventory** (similar to Resident Evil or Diablo):\n\n- **Geometric Packing**: Your inventory is a physical grid of columns and rows. Items have actual sizes: a simple lockpick is 1x1, a potion is 1x1, an elegant longsword is 1x4, and a massive steel shield is 2x3. You must physically arrange your pack like a puzzle to make items fit!\n- **Strength-Scaled Grid**: Your physical power dictates your carrying capacity. A character with 10 Strength starts with a 5x15 grid. For every 2 points of Strength above 10, your pack grows wider by one column (adding 15 slots of space).\n- **Encumbrance Zones**: Where you pack your gear matters. Packing heavy items in the outer columns (Columns 5-9 or 10-14) destabilizes your center of gravity, triggering automatic speed and agility penalties. Keep your heavy gear centered to move at full speed! The VTT automates these calculations, instantly updating your sheet as you drag and drop items.`
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
                ['Character Setup', 'Single Class choosing a subclass at level 1-3.', '20 unique classes with distinct resource systems.', 'Find your archetype without multiclassing.'],
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
              content: `The vast center of your screen is the **tactical play area**: a scrollable, zoomable map grid that the Game Master populates with terrain, lighting, and tokens. This is where movement, combat, exploration, and encounters play out.\n\n- **Your Token**: Your character is represented as a circular portrait token on the grid. Click your token to select it; drag to move it (a movement confirmation dialog will appear).\n- **Grid Squares**: Each square represents 5 feet of real distance. Your movement speed determines how many squares you can traverse per turn. See [Token Movement](combat-system/token-movement).\n- **Right-Click Menu**: Right-clicking any token opens a context menu with options to inspect, target, or roll skill checks against them.\n- **Zoom & Pan**: Scroll the mouse wheel to zoom; middle-click-drag to pan the view.`
            },
            {
              title: 'The Character HUD (Top-Left)',
              content: `Floating in the top-left is your **Character HUD**: a compact status display showing:\n\n- **Portrait & Name**: Your character portrait. Click it to open your full character sheet.\n- **Health Bar** (red): Current HP out of maximum. Turns orange as you take damage.\n- **Mana Bar** (blue): Current Mana out of maximum. Depletes as you cast spells.\n- **Class Resource Bar**: Each class has a unique resource. Your bar's color reflects your class, green Rage for Berserkers, purple Death Toll for Revenants, gold Fortune Points for Gambits. See [Class Resources](magic-system/magic-resources).\n- **Action Points (AP)**: Glowing orbs track your current AP. You begin each turn with a full pool. See [Combat Basics](combat-system/combat-basics) for AP costs.`
            },
            {
              title: 'The Sidebar Panels',
              content: `The right side houses collapsible tool panels:\n\n- **Chat & Dice Log**: All dice rolls, skill checks, and system messages appear here. See [Rolling Dice in the VTT](getting-started/dice-rolling-basics).\n- **Combat Timeline**: When combat begins, the initiative tracker lists all combatants in turn order. See [The Combat Tracker](combat-system/combat-tracker).\n- **Quest Log**: Active quests, objectives, and rewards tracked here.\n- **Conditions Panel**: Active conditions (Blinded, Poisoned, Prone, etc.) shown with icons. See [Combat Conditions](combat-system/combat-conditions).\n- **Jukebox**: The GM uses the integrated audio player for immersive background music and ambient sounds.`
            },
            {
              title: 'GM-Only Tools',
              content: `Game Masters have access to additional panels:\n\n- **GM Tools Panel**: Encounter management, NPC tools, weather control, and the Social Encounter Generator.\n- **The Travel Tracker** (keyboard shortcut: **W**): Automated hour-by-hour travel for overland journeys across six biomes. See [Advanced Travel System](travel-exploration/advanced-travel).\n- **Creature Library**: Browse and manage creature stat blocks for encounters.\n- **Item Library**: Browse, create, and distribute items to players. See [Equipment System](equipment-system/weapons).`
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
          'Choose your Race, Class, Ability Scores, Skills, and starting Equipment.',
          'Your choices are independent, any Race can take any Class.'
        ],
        content: {
          title: 'Creating Your First Character',
          description: 'A step-by-step walkthrough of the Character Creation Wizard.',
          sections: [
            {
              title: 'Opening the Character Creation Wizard',
              content: `To begin, open the **Character Creation Wizard** from the main navigation. The wizard is a guided 5-step process taking you from a blank slate to a fully realized hero, ready for adventure. Your progress is automatically saved, you can pause and return at any time.`
            },
            {
              title: 'The 5 Steps at a Glance',
              content: `The wizard has been streamlined into five focused steps, every choice matters, no screens are filler.\n\n**Step 1: Hero Draft**: Lay the foundations of your hero. Name them, choose your **Race & Subrace** (11 ancestral peoples, each with 2-3 unique subraces), pick your **Class** from 20 distinct callings, and allocate your **Ability Scores** using a tactile point-buy system. Spellcasters select their starting spells here. See [Races & Variants](character-creation/races), [Classes](character-creation/classes), and [Character Statistics](core-rules/character-statistics).\n\n**Step 2: Skills & Languages**: Choose your trained skill proficiencies, tool masteries, and spoken dialects. Skills advance through gameplay quests. See [Skills](character-creation/skills).\n\n**Step 3: Starting Equipment**: Purchase your initial weapons, armor, and traveling rations with your starting copper. See [Weapons](equipment-system/weapons) and [Armor](equipment-system/armor).\n\n**Step 4: Lore & Details**: Write your backstory, personality traits, ideals, bonds, and flaws. Select your **Background** here, 15 pre-adventuring origins (Sailor, Merchant, Soldier, etc.) that grant passive benefits and unique features. Upload a portrait for your token. See [Backgrounds](character-creation/character-backgrounds).\n\n**Step 5: Summary & Finalize**: Review your full character sheet, make any final adjustments, and confirm. Your character is now live and ready for the table.`
            },
            {
              title: 'Race, Class & Background Restrictions',
              content: `Your Race, Class, and Background choices are guided by the world's lore. The system enforces three tiers of restriction:\n\n**Hard Block**: Certain race/subrace and class combinations are fundamentally incompatible due to biology, spirituality, or cultural history. These cannot be selected.\n\n**Subrace Gate**: Each class lists the subraces that canonically practice it. Subraces outside this list require DM approval through the Narrative Unlock system.\n\n**Narrative Unlock**: If your subrace is not on a class's allowed list but is not hard-blocked, you may still choose it with a compelling backstory approved by your DM. The character creation wizard will flag these choices with a warning and the lore justification.\n\nBackgrounds are similarly gated by region and lineage. A Sundrift Vale nomad background is not available to a character raised in Bryngloom without narrative justification.\n\nThese restrictions exist to preserve world identity — every class originated in a specific culture, and that origin matters.`
            },
            {
              title: 'New Player Archetype Recommendations',
              content: `With 23 unique classes, starting character creation can feel like standing at the edge of a massive, beautiful ocean. To hold your hand on your first journey, we recommend these three classic archetypes which represent the peak of fun and mechanical clarity for new players:\n\n- **The Stout Vanguard (Classic Warrior)**\n  - **Class**: *Martyr (Ironclad)* or *Warden* (Excellent high-durability defense)\n  - **Ability Focus**: Constitution & Strength\n  - **Background**: *Soldier* or *Blacksmith*\n\n- **The Shadow Stalker (Classic Rogue/Scout)**\n  - **Class**: *Apex* or *Shaper* (Incredible mobility, single-target strikes, and adaptive form-shifting tactics)\n  - **Ability Focus**: Agility & Charisma\n  - **Background**: *Urchin* or *Hunter*\n\n- **The Arcane Weaver (Classic Mage/Spellcaster)**\n  - **Class**: *Chronarch* (Time manipulation, extra AP tricks) or *Pyrofiend* (Visceral, explosive fire magic)\n  - **Ability Focus**: Intelligence & Spirit\n  - **Background**: *Scholar* or *Hermit*\n\nSelect any of these configurations during the creation steps to begin with a clear, synergistic mechanical direction!`
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
              content: `When you first join, the GM will place your character token on the map. Your token represents your hero in the physical game world, its position matters for movement, range calculations, and area-of-effect spells.\n\nOnce your token is placed:\n- Click it to select it and see your stats highlighted in the HUD.\n- Verify your HP, Mana, and AP are correct in the top-left HUD.\n- Open your character sheet (click your portrait) and review your spells, equipment, and skills.`
            },
            {
              title: 'Pre-Session Checklist',
              content: `Before play begins, run through this quick checklist:\n\n- **Character Sheet**: Are your attributes assigned, class abilities added, and starting equipment equipped?\n- **Spells & Abilities**: Are your spells visible on your action bar? If not, visit [Spellcrafting Wizard](magic-system/spellcrafting-wizard) to add them.\n- **Skill Familiarity**: Know which skills you are trained in and which attribute they use. See [Skills](character-creation/skills).\n- **Resources**: Note your starting Mana, class resource, and AP pool to track them during combat.\n- **Ask the GM**: Which optional rule modules are in use, settlement activities, corruption, advanced travel? Ask before the first scene so you know what mechanics apply.`
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
          'The GM sets the difficulty die size (d4 to d20), the chat log tells you which die was rolled.',
          'All roll results are broadcast to the chat log visible to the entire table.'
        ],
        content: {
          title: 'Rolling Dice in the VTT',
          description: 'How to trigger rolls, read results, and understand the Difficulty Die system in practice.',
          sections: [
            {
              title: 'How Rolls Work on the VTT',
              content: `Every dice roll flows through the **Chat & Dice Log**. When you trigger a roll:\n\n1. The system selects the correct die for the skill.\n2. The GM sets (or confirms) the Difficulty Die size, from **d4 (Very Easy)** to **d20 (Very Difficult)**.\n3. The VTT rolls your die, adds your Skill Rank modifier, and broadcasts the result to the full table.\n4. Results are color-coded for instant reading (see table below).\n\nFor the full difficulty die system, see [The Dice System](core-rules/dice-system).`
            },
            {
              title: 'Triggering Skill Rolls from Your Sheet',
              content: `The fastest way to roll is from your character sheet:\n\n- Open your character sheet (click your portrait).\n- Navigate to the **Skills** tab.\n- Click the die icon next to any skill to trigger that roll.\n- The system calculates Skill Rank + attribute modifier automatically.\n- The result appears in the Chat & Dice Log for everyone.\n\nFor combat rolls (weapon attacks), click the weapon on your **action bar** during your turn. This triggers the Unified Strike, handling both hit and damage in one roll. See [Attacks & Damage](combat-system/attacks-damage).`
            },
            {
              title: 'Manual Dice Commands',
              content: `You can roll manually by typing commands into the chat input:\n\n- \`/roll 1d20\`: rolls a single d20.\n- \`/roll 2d6+3\`: rolls 2d6 and adds 3.\n- \`/roll d8\`: rolls a single d8.\n\nManual rolls are useful for unusual GM-called checks or to record a physical die roll in the digital log.`
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
                ['Amber / Yellow', 'Partial Success', 'Mixed result, some success with drawbacks'],
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
              content: `Welcome to the Mythrill rulebook. This interactive guide lives inside the VTT itself. If you are brand new, start at [Getting Started](getting-started/welcome) before reading the core rules.\n\nThroughout this guide:\n\n- **Blue Links** jump directly to related sections, click them freely.\n- **Quick Facts Tiles** at the top of each section give you the most important numbers at a glance.\n- **Tables** are paginated, use the arrows to browse large tables.\n\n**Recommended Reading Order**: [Welcome](getting-started/welcome) ✦ [Dice System](core-rules/dice-system) ✦ [Character Statistics](core-rules/character-statistics) ✦ [Combat Basics](combat-system/combat-basics) ✦ [Your Class](character-creation/classes).`
            },
            {
              title: 'Core Principles: The Tumble of Fate',
              content: `Mythrill does not bind your heroic fate to static, lifeless numbers or flat, unyielding Difficulty Classes. Instead, the living world breathes through the **Ladder of Trials**, a dynamic difficulty-dice system where the Game Master selects a die size reflecting the task's complexity, from a swift, minor d4 to a grueling, legendary d20. You roll that die, pitting your raw skill ranks, attribute modifiers, and situational fortune against the hazard. In combat, the rhythm of battle accelerates: weapon dice govern both the strike and the damage in a single, fluid roll. A hero's journey is not calculated by cold math, but felt through the heavy tumble of physical dice against the parchment.`
            },
            {
              title: 'Session Structure: Chapters of Legend',
              content: `Our stories unfold in sessions of two to four hours, episodes where you will step into the boots of legendary adventurers. You will traverse dangerous frontiers, engage in high-stakes parleys in candlelit taverns, and survive lethal encounters in forgotten ruins. Under the guidance of the Game Master (GM), who acts as the supreme narrator and breathes life into the world, you and your companions will control your characters, make impactful choices, and forge a shared, lasting legacy.`
            },
            {
              title: 'Collaborative Storytelling: A Shared Fire',
              content: `In Mythrill, the greatest weapon is not the sword, but the shared imagination of the table. True legends arise when players collaborate with the GM to create rich, dramatic narratives. Build your characters with distinct motivations, deep-seated flaws, and tragic bonds; let every triumph be celebrated, let every failure lead to unexpected paths, and let the cooperative spirit guide every roll and roleplaying scene.`
            },
            {
              title: 'Modular Rules System: An Open Architecture',
              content: `Mythrill is not a rigid cage of rules, but an open, modular framework. The core mechanics establish a robust foundation, while specialized modular systems allow each GM to customize the experience to match their table's specific desires:

- **Settlement Activities** for high-downtime, community-focused campaigns where heroes build guilds and influence politics.
- **Supernatural Systems** for dark, high-stakes games where magic carries corruption and dark deals.
- **Travel & Exploration** for vast journeys across harsh, unforgiving wildernesses with survival mechanics.
- **Point & Click Framework** for tactile, detailed structural exploration inside the virtual tabletop.

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
              content: `Fortune in Mythrill is a dynamic, living force. Rolling the highest possible number on your chosen difficulty die triggers a **Critical Success**, a spectacular triumph that yields unexpected narrative benefits, additional momentum, or devastating side effects. Conversely, rolling a **1** triggers a **Critical Failure**, inviting dire complications and shifting the initiative to the opposition. For weapon strikes and direct checks, natural maximums remain the ultimate arbiters, with critical hits unleashing devastating weapon-specific effects and exploding damage dice. On the other hand, critical fumbles can lead to direct gear wear, reducing its reliability. Learn more about weapon fumbles and repairs in [Durability & Repair](core-rules/durability-repair), and combat rules in [Attacks & Damage](combat-system/attacks-damage).`
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
          { icon: 'fas fa-th', label: 'Base Grid', value: '5-15 (75 slots)' },
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

- **Columns 0-4 (Core Balance)**: The perfectly centered load. Items stored entirely within these columns impose no mobility penalties, allowing you to move at your maximum movement rate.
- **Columns 5-9 (Encumbered Zone)**: Storing any items in these columns causes your pack's balance to drift wide, resulting in an immediate **-25% reduction in movement speed** and a mild physical toll on agility.
- **Columns 10-14 (Overburdened Zone)**: Packing heavy or bulky loot into these outer columns severely destabilizes your balance, inflicting a grueling **-75% movement speed penalty** and leaving you vulnerable as a slow, lumbering target.

Tactical packing is a mini-game in itself: do you keep your heavy steel plate and weapons centered to sprint freely, or do you fill your outer columns with treasure and accept the exhausting fatigue? These zones are fully automated on your digital character sheet, updating your speed and modifiers instantly as you drag and drop items.`
            }
          ],
          tables: [
            {
              title: 'Encumbrance Effects',
              description: 'How you pack your inventory matters. Items in different zones affect your mobility and capabilities, pack wisely, for every choice has weight.',
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
                ['8-9', '4-15', '60 Slots'],
                ['10-11', '5-15', '75 Slots'],
                ['12-13', '6-15', '90 Slots'],
                ['14-15', '7-15', '105 Slots'],
                ['16-17', '8-15', '120 Slots'],
                ['18-19', '9-15', '135 Slots'],
                ['20+', '10-15', '150 Slots']
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
          'Armor durability is tracked as a die step (e.g., d8 current / d10 max) representing structural integrity.',
          'When taking damage, rolling a 1 or 2 on the DR die degrades the armor by one step tier.',
          'Mending ruined gear restores 1 step on short rests and 2 steps on long rests for one item.'
        ],
        content: {
          title: 'Fraying Weaves & Shattered Iron',
          description: 'The die-step decay of arms and armor, and the craft of restoring them.',
          sections: [
            {
              title: 'Dice-Based Durability System',
              content: `No weapon remains eternally sharp, and no steel plate remains unbent in the crucible of battle. In Mythrill, equippable armor pieces track their physical integrity through a dynamic **Dice-Based Durability** system. Rather than tracking mechanical percentages or large numbers, an armor\'s current and maximum protective values are expressed as a die size step (e.g., **d8/d10 Durability**).

When wearing armor and taking a hit, you roll your armor's current DR die (e.g., **d8**) to reduce the damage. If you roll a **1 or 2**, the structural integrity of your armor slips and it degrades by one die size step (e.g., **d8** -> **d6**). If you roll a **3 or higher**, the durability does not decrease. This provides a tactile, visual decay that can be tracked easily. If the item degrades below a **d4**, it becomes **broken**.`
            },
            {
              title: 'The Shattered State (Broken Items)',
              content: `When an item\'s durability degrades below a **d4**, it is reduced to **broken**. A broken item is completely inert and structurally useless, failing to offer any protection or damage reduction:

- **Automatic Unequip**: The ruined item is instantly stripped from your active combat slot and moved to your pack's deep storage.
- **Strict Equilibrium**: You cannot re-equip, wield, or wear the item until a crafter or rest mends it back to at least a **d4** durability.
- **Snuffed Runes & Magic**: All magical enchantments, active attributes, and runic properties are instantly snuffed out and nullified.
- **Visceral Fracture Visual**: The item's VTT entry is overlaid with a striking cracked crimson bar, rendering its ruined state clear.
- **Table Notification**: A system-wide message is broadcast to the chat log, alerting the entire party that a vital piece of gear has fractured under pressure.`
            },
            {
              title: 'Manual Durability Adjustment',
              content: `Under the Virtual Tabletop system, players and GMs can easily inspect and manage these wear marks manually. Simply open the item's **Right-Click Context Menu** inside your spatial inventory grid or click the item directly from the inventory or equipment panel, which opens a tactile **Durability Adjustment Modal** allowing players to step their items up or down the die ladder.`
            },
            {
              title: 'The Art of Repair (Short & Long Rests)',
              content: `During rests, characters can focus their attention on repairing and maintaining their gear. The repair mechanics are simple and deterministic:

- **Short Rest**: You can restore **1 die step** of durability to **one single item** of your choice.
- **Long Rest**: You can restore **2 die steps** of durability to **one single item** of your choice (or restore 1 step to two separate items).
- **City Repairs**: When visiting a blacksmith or forge in cities and towns, items can be fully repaired back to their maximum durability tier for a fair gold price.`
            }
          ],
          tables: [
            {
              title: 'Quick Create Default Max DR Dice',
              description: 'Default maximum DR/Durability dice assigned when quick-creating items based on their quality tier.',
              headers: ['Quality Tier', 'Recommended Max DR/Durability Die'],
              rows: [
                ['Poor', 'd4'],
                ['Common', 'd6'],
                ['Uncommon', 'd8'],
                ['Rare', 'd10'],
                ['Epic / Legendary', 'd12'],
                ['Artifact', 'd20']
              ]
            }
          ]
        }
      },
      {
        id: 'push-your-luck',
        name: 'Push Your Luck',
        icon: 'fas fa-dice',
        theme: 'mechanic',
        summary: [
          'Add a 1d6 Push Die to any skill check or attack roll at any moment.',
          'Rolling a 1 inflicts 1 level of exhaustion. Rolling a 2 blocks further pushes for the day.',
          'Rolling a 3-6 adds the amount and allows subsequent pushes with a progressive -1 penalty.'
        ],
        content: {
          title: 'Push Your Luck (Optional Rule)',
          description: 'A high-stakes optional rule allowing heroes to reach beyond their limits at a severe physical cost.',
          sections: [
            {
              title: 'Reaching Beyond Limits',
              content: `Sometimes, survival requires pushing your body and fate to the absolute brink. The **Push Your Luck** optional system allows characters to supplement their rolls in desperate moments. At any moment before a check's result is finalized, whether it is a vital skill check, a saving throw, or a crucial weapon strike, a player can declare they are pushing their luck. 

Doing so instantly adds a **1d6 Push Die** to their total roll. However, fate is a double-edged sword, and reaching beyond your limits carries immediate physical consequences based on the value rolled on the Push Die:`
            },
            {
              title: 'The Push Die Results',
              content: `- **Roll a 1 (The Exhausting Strain)**: You push your muscles or mind too hard. You add the **1** to your roll, but you immediately suffer **1 level of exhaustion**.
- **Roll a 2 (The Lockout)**: You exhaust your immediate reservoir of luck. You add the **2** to your roll, but you **cannot push your luck again for the remainder of the game day**.
- **Roll a 3-6 (Sustained Momentum)**: You successfully channel your focus. You add the value to your roll, and you are free to continue pushing your luck on future rolls.`
            },
            {
              title: 'Infinite Chaos: Subsequent Pushes',
              content: `By default, characters are limited to **one Push Die per check/action**. However, for tables that crave ultimate risk and high-adrenaline chaos, GMs can enable **Subsequent Pushes**. 

Under this rule, a player who rolled a 3-6 can immediately choose to push their luck *again* on the same check, rolling an additional 1d6. Each subsequent Push Die rolled on the same action suffers a **cumulative -1 penalty** (e.g., the second Push Die rolls 1d6 - 1, the third rolls 1d6 - 2, and so on). If any subsequent Push Die lands on a 1 (after modifiers) or a natural 1, the exhaustion penalty applies immediately, and if it lands on a 2 or less, the luck lockout or worse occurs!`
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
                  content: `Before a single sword is drawn, a single spell chanted, or the first step taken into the dark wilderness, the fellowship must align their destinies. A **Session Zero** is not merely a technical meeting, it is a sacred contract between the Game Master (GM) and the players, defining the campaign's thematic bounds, moral colors, and mechanical laws to ensure a unified and enjoyable experience.

- **Safety & Boundaries**: Establish clear social guidelines. Incorporate safety tools such as **Lines and Veils** (distinguishing between contents that can exist but off-screen, and those entirely forbidden) and active veto rights. Discuss trigger warnings and the tone of description (heroic versus grimdark) to ensure the table remains a welcoming sanctuary for all.
- **Homebrew Constraints & Campaign Themes**: Align on the narrative tone of the campaign. Is this an epic fantasy high-magic odyssey across the gilded spires of Mythrill, or a gritty survival struggle through mud, iron, and scarce resources? Detail any homebrew rules, mechanical restrictions, or environmental modifiers that will affect travel and combat.
- **Mechanical Onboarding**: Welcome players into the VTT ecosystem. Ensure all players understand the point-buy parameters, trained skills, and the unique resource management system associated with their selected paths from the **20 specialized classes**.
- **Group Synergy**: Ensure character concepts hold logical and narrative ties. A cohesive band of adventurers is far superior to a disjointed collective of lone wolves. Discuss how characters met, why they trust one another, and how their tactical roles complement each other in battle.`
                },
                {
                  title: 'The Chronicle of Play (Typical Session Flow)',
                  content: `A single session of play is a self-contained story, a chapter in an ongoing epic that typically spans between two and four hours. To maintain rhythm and ensure no narrative threads are lost to the sands of time, gameplay is structured into four distinct, organic phases:

- **I. The Chronicle Recap**: The session begins with the opening chronicle. Players recall their recent exploits, successes, and scars. The GM provides context, sets the immediate scene, and resolves any lingering questions from the previous week's cliffhangers.
- **II. Downtime Resolution**: Before plunging back into danger, characters catch their breath. Here, they resolve city-bound activities: repairing shattered armor, selling gathered artifacts, scribing arcane scrolls, or training in specialized guilds.
- **III. The Crucible of Play**: The heart of the session. Players navigate the wilderness, interact with NPCs, solve puzzles, and engage in tactical, turn-based combat. Here, the rolls of the dice decide the rise and fall of nations.
- **IV. The Ledger Alignment**: As the fires of adventure settle, the session closes. The GM awards Experience Points (XP) and distributes treasures. Players update their character ledgers, record session milestones, and vote on MVP commendations.`
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

- **Tactical Crucibles (High Energy)**: These are the moments of high stakes, such as a frantic sword fight atop a crumbling bridge, a tense negotiation with a paranoid king, or a narrow escape from a collapsing tomb. Keep descriptions punchy, action turn-counts swift, and high-stakes dice rolling active to sustain blood-pumping excitement.
- **Narrative Voyages (Medium Energy)**: Rich roleplay encounters, investigative puzzle-solving, and localized exploration. Players banter with tavern keepers, piece together ancient inscriptions, or plot their next heist, allowing deep immersion and lore development.
- **Restorative Breathers (Low Energy)**: Travel through calm countryside, camping under the stars, or simple downtime. These quiet scenes allow players to explore character bonds, share backstories, and process the emotional weight of their journeys.`
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

- **For the Adventurer (Player Checklist)**:
  - *Parchment & Dice*: Ensure your VTT character sheet is fully updated, and physical or virtual dice are ready for rolling.
  - *Ability Memory*: Familiarize yourself with your active and passive class skills, spells, and custom resource points (e.g. Focus, Mana, Stamina) to ensure combat rounds flow seamlessly.
  - *Lore Recalled*: Read the summary of the last session, and note your character's immediate personal goals for the upcoming hours.

- **For the Weaver of Worlds (GM Checklist)**:
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
        summary: ['20 unique classes with flexible character building', '5-step guided creation process', 'Independent choices for race, class, and background'],
        content: {
          title: 'Forging Your Legend',
          description: 'An introductory guide to carving your path through the Mythrill character creation engine.',
          sections: [
            {
              title: 'Introduction: The Call of Fate',
              content: `Every hero who stands against the encroaching shadows is forged, not born. Mythrill presents a deeply flexible and comprehensive character creation system featuring **20 unique character classes**, 11 distinct ancestral races with diverse subraces, and 15 independent background origins. This open-ended architecture allows you to bring any concept to life, weaving a rich backstory directly into tactile mechanical assets. Your character's destiny unfolds across a 5-step journey, molding their physical lineage, occupational skills, and personal lore.`
            },
            {
              title: 'The 5 Steps of Creation',
              content: `Your adventurer takes shape by traversing these five focused layers, every step matters, no screen is filler:

1. **Hero Draft** - Ink your character's name, claim your ancestral heritage with **Race & Subrace**, select your combat role and resource system from **20 distinct classes**, allocate base stats using a tactile point-buy system, and (if your class wields magic) choose your starting spells.
2. **Skills & Languages** - Select your trained proficiencies, tool masteries, and dialects spoken across the fractured realms.
3. **Starting Arsenal** - Purchase initial weaponry, armaments, and traveling rations with your starting copper.
4. **Lore & Personal Seals** - Select your pre-adventuring **Background** and flesh out your hero's motivations, deep-seated flaws, tragic bonds, and appearance quirks.
5. **Final Summary** - Review your completed ledger, seal your character's sheet, and prepare to step into the virtual tabletop.`
            },
            {
              title: 'Class and Background Sovereignty',
              content: `In Mythrill, your past does not dictate your combat capabilities. Backgrounds and classes exist as independent choices. Your background represents the social scars, trained trades, and early life of your hero, granting passive benefits and unique utility. Your class, conversely, governs your tactical role, combat maneuvers, and class-specific resource systems. This means you are completely free to build a high-society Noble Berserker, a street-smart urchin Spellguard, or a battle-scarred Soldier Chronarch. Every combination is viable, encouraging rich storytelling.`
            },
            {
              title: 'Combinatorial Character Building',
              content: `The Mythrill system separates race, class, and background into distinct axes. Subject to lore-based restrictions (Hard Block, Subrace Gate, and Narrative Unlock tiers), you can combine elements to create unique characters — such as a Revenant with an Urchin background, a Warden (Monolith) with a Soldier background, or a Toxicologist with a Scholar background. Non-standard combinations require DM backstory approval through the Narrative Unlock system.`
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
              content: `Before you took up the sword or began tracing glowing glyphs in the dark, you had a life. In Mythrill, your Background represents your pre-adventuring genesis, the mundane or tragic history that forged your early years and left its mark on your soul. Whether you spent your youth sailing stormy seas, selling rare wares in crowded bazaars, or defending a remote border fort as a common soldier, your past defines your starting skills, linguistic repertoire, and starting gear. More importantly, backgrounds represent the formative trials and historical scars that guide how you interpret the dangerous world around you.`
            },
            {
              title: 'Background Benefits',
              content: `Your background is the foundation of your non-combat capabilities, offering a wealth of tactile narrative and mechanical benefits:

- **Two Skill Proficiencies**: Representing years of occupational focus and muscle memory.
- **Trade Tools**: Proficiency with specialized equipment like alchemist's supplies, navigator's charts, or lockpicks.
- **Linguistic Heritage**: Extra languages picked up during your travel or study.
- **Genesis Gear**: Starting equipment themed specifically to your past life.
- **Sovereign Background Feature**: A unique narrative ability reflecting your prior standing, contacts, or specialized lore.`
            },
            {
              title: 'Roleplaying Your Background',
              content: `Your background is not merely a list of statistics, it is your character's anchor to the setting. When crafting your origin, consider what historical scars your character carries. Did a betrayal during your mercantile years leave you cynical? Does a lingering physical mark from a military siege affect your posture? Use your background feature creatively: call on old contacts in shady taverns, leverage your academic standing at grand libraries, or utilize your guild membership to secure safe passage through occupied lands. In Mythrill, your past is never truly behind you.`
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
              content: `A Mythrill veteran does not swing blindly and hope. Their hands know the weight of a blade. Their eyes read ambushes before they spring. Their words cut deals before fists settle disagreements. **Skills** represent this accumulated mastery, trained capabilities that separate a seasoned adventurer from a desperate farmhand.\n\nEach skill is tied to a primary and secondary attribute. When you make a skill check, the GM assigns a **Difficulty Die**: from a d4 for trivial tasks to a d20 for near-impossible ones. If your primary or secondary attribute modifier reaches **+5 or higher**, your mastery steps the difficulty die down by one size, shifting the odds in your favour.\n\n**Roll Outcome Colours** (visible in the chat log):\n- **Dark Red**: Total Failure. Severe consequences.\n- **Red-Orange**: Failure. The attempt fails without major complications.\n- **Amber/Yellow**: Partial Success. You succeed, but at a cost.\n- **Teal/Blue-Green**: Success. The attempt works as intended.\n- **Bright Blue (?)**: Critical Success. Exceptional outcome with additional benefits.`
            },
            {
              title: 'Skill Ranks & Progression',
              content: `Skills advance through seven ranks: **Untrained ? Novice ? Trained ? Apprentice ? Adept ? Expert ? Master**. Each rank adds a numerical bonus to your checks and unlocks richer outcomes on skill-specific rollable tables. You do not advance by grinding experience, you advance by *doing*. Each rank requires completing **Skill Quests**: small, achievable challenges that arise naturally during play.`
            },
            {
              title: 'Critical Success & Failure',
              content: `Rolling the **maximum value** on your difficulty die is a **Critical Success**: the task is accomplished beyond expectation, often with a tangible bonus or narrative windfall. Rolling a **1** is always a **Critical Failure** regardless of rank, complications arise, and the GM determines how badly the moment turns. Check your skill's rollable table for the full spectrum of possible outcomes.`
            },
            {
              title: 'Skill Quests',
              content: `Every skill has **10 Quests**: narrative milestones that unlock as you use your abilities in the world. Completing them advances your rank and opens new proficient ability options. These quests are not assigned by a trainer; they emerge from play naturally. Land your first successful Grapple. Persuade an authority figure. Survive a harrowing situation through Acrobatics alone. The world rewards those who act.`
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
              content: `Language is power in Mythrill, the difference between an ally and an enemy, between deciphering a ruin's warning and triggering its trap. Languages are organised into six categories:\n\n- **Standard**: Common tongues spoken across the seven regions: Common, Deep-Thrum, Synod-Speak, Thrumm-Speech, Gear-Cant, Scrap-Tongue, and Mound-Tongue.\n- **Exotic**: The languages of powerful or alien beings: Wyrm-Script, Celestial, Abyssal, Root-Veil, Infernal, Primordial, Sylvan, and Shanty-Patois. Rare to learn, invaluable to know.\n- **Ancestral**: Heritage tongues of Mythrill's races: Old Nord, Terran, Ethereal, Changeling, Druidic, Ignan, Beast Speech, Necril, War-Cant, Gloom-Tongue, Vale-Speak, Sundari, and Fexric.\n- **Elemental**: The speech of primal forces: Elemental, Primal, Auran, Aquan. Spoken by elementals, worshipped by cults.\n- **Secret**: Guarded dialects like Thieves' Cant, Hex-Speech, and Trickster's Cant. These cannot simply be studied, they require initiation, membership, or a sworn oath.\n- **Special**: Universal languages like Sign Language and comprehensive scholarly knowledge of All Ancient Languages.`
            },
            {
              title: 'Learning Languages',
              content: `Your race grants starting languages, always Common, plus one or two ancestral tongues. Your **Background** may add more. Additional languages can be acquired through downtime training: a month of immersion, a patient teacher, or the right book.\n\n**Secret languages cannot be self-taught.** Druidic must be passed from druid to druid. Thieves' Cant is earned through the criminal underworld, not a library.`
            },
            {
              title: 'Using Languages',
              content: `Knowing a language means you can **speak, read, and write** in it, unless it has no written form (some elemental and secret languages are oral-only, their knowledge dying with their speakers). In play, languages unlock NPC dialogue, allow you to decipher ancient inscriptions, communicate with creatures who share no other tongue, and (critically), speak privately in a room full of enemies. The GM may call for a check when ancient dialects or degraded texts are involved.`
            }
          ]
        }
      },
      {
        id: 'classes',
        name: 'Classes',
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
              content: `In Mythrill, your **Class** is your identity on the battlefield, the lens through which every combat encounter is viewed and every tactical decision is made. It determines your hit points, weapon proficiencies, armour capabilities, and the unique resource system that fuels your most powerful abilities. With **20 distinct classes** spanning roles from iron-clad tank to temporal manipulator to plague-gardening horror, no archetype is left unexplored. Click any class name in the table below to open its full detail page.`
            },
            {
              title: 'Resource Systems',
              content: `What separates a Berserker from a Spellguard isn't just what they carry, it's what they *fuel their power with*. Every class uses a unique resource system designed to reinforce its identity and create a distinct tactical rhythm. A **Berserker** builds Rage by being struck. A **Gambit** bends probability with Fortune Points. A **Revenant** sacrifices their own hit points for volatile Death Toll and charges a Phylactery through kills. Understanding your resource loop is understanding how to play your class at its peak. See [Magic Resources](magic-system/magic-resources) for the full breakdown.`
            },
            {
              title: 'Find Your Archetype',
              content: `Thirty classes is a lot. If you are not sure where to start, here is the fastest way to narrow it down. Pick the archetype that sounds most like the character you want to play, then choose from the classes listed under it.

**The Iron Wall (Tank)**: You stand between your allies and death. You absorb blows, hold the line, and make enemies regret targeting your party.
- **Martyr (Ironclad)**: Steam-powered iron juggernaut specialization. Converts willing sacrifice into furnace power.
- **Martyr**: Self-sacrificing warrior. Earns power by suffering for allies.
- **Spellguard**: Mage-tank. Layers magical shields and absorbs spell energy.
- **Warden (Monolith)**: Gravity manipulator. Colossal strength and area control.

**The Blade (Melee Damage)**: You are up close and personal. Your weapon is your voice.
- **Berserker**: Fury warrior. Builds Rage from combat momentum.
- **Shaper**: Finesse shapeshifter. Zero armor, kinetic flow meets biological adaptation.
- **Warden**: Relentless hunter. Glaive combat and spectral cages.

**The Arrow (Ranged Damage)**: You strike from distance. You mark targets and end them.
- **Apex**: Tracker. Marks priority targets, strikes with precision.
- **Pyrofiend**: Fire demon. Swallows demonic embers for explosive area damage.
- **Harbinger**: High-risk magic. Unpredictable, devastating, volatile.

**The Mind (Control/Debuff)**: You reshape the battlefield. Enemies fight on your terms.
- **Chronarch**: Time manipulator. Slows foes, accelerates allies.
- **False Prophet**: Void preacher. Drives foes mad with false divine light.
- **Animist**: Spirit channeler. Opens channels between the living and ancestral spirit courts.
- **Augur**: Omen reader. Even/odd dice results fuel blessings and curses.
- **Harbinger**: Prophet of catastrophe. Places living bomb prophecies.
- **Plaguebringer**: Plague gardener. Cultivates evolving diseases.
- **Toxicologist**: Poison crafter. Chemical warfare and alchemical devices.

**The Hand (Support/Healing)**: You keep your allies alive and make them stronger.
- **Minstrel**: Musical spellcaster. Note combinations buff and heal.
- **Augur**: Omen reader. Even/odd dice results fuel blessings and curses. (Absorbed Oracle as Seer specialization)
- **Gambit**: Probability manipulator. Fuses fortune-siphoning with precise cartomantic surgery, wielding both luck and destiny as weapons.
- **Lunarch**: Lunar mage. Phase-based energy cycles for support and control.
- **Animist**: Spirit channeler. Channels ancestral spirits to build resonance and empower allies.

**The Shadow (Hybrid/Utility)**: You do not fit one box. You adapt.
- **Arcanoneer**: Elemental Building Block crafter. Combines elements for dynamic spell effects.
- **Inquisitor**: Anti-magic hunter and demon binder. Disrupts spellcasting, nullifies corruption, and commands bound fiends through sacred ritual.
- **Revenant**: Death caster. Combines volatile blood sacrifice with frost-stasis phylactery. Death Shroud toggle and Death Toll volatility.
- **Shaper**: Kinetic biology shapeshifter. Six forms blending momentum dance with physical adaptation.
- **Revenant**: Death caster. Combines volatile blood sacrifice with frost-stasis phylactery.

**Still not sure?** Go to [Quick Start: Your First Session](getting-started/quick-start) for three recommended beginner builds.`
            }
          ],
          tables: [
            {
              title: 'All Classes',
              description: 'Thirty unique classes, each with distinct roles, resource systems, and playstyles. Choose the path that calls to your character\'s soul.',
              headers: ['Class', 'Role', 'Resource', 'Playstyle'],
              clickableColumn: 0, // Make the first column (Class) clickable
              rows: [
                ['Arcanoneer', 'Damage/Utility', 'Building Blocks & Combinations', 'Master of elemental Building Block combination with dynamic spell crafting'],
                ['Berserker', 'Damage', 'Rage Points', 'Fury warrior with momentum-based combat'],
                ['Shaper', 'Hybrid (Damage/Mobility/Adaptation)', 'Kinetic Flux', 'Kinetic biology shapeshifter blending momentum dance with physical adaptation'],
                ['Harbinger', 'Damage', 'Mayhem Modifiers', 'Master of unpredictability with highest damage potential'],
                ['Chronarch', 'Control', 'Temporal Energy', 'Time manipulator building temporal power'],
                ['Inquisitor', 'Damage/Summoner/Controller', 'Righteous Authority', 'Anti-magic hunter and demon binder who disrupts spellcasting and commands bound fiends through sacred ritual'],
                // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
                ['Revenant', 'Damage/Control', 'Death Toll & Phylactery', 'Death caster combining volatile blood sacrifice with frost-stasis phylactery and Death Shroud toggle'],
                // 'Dreadnaught' removed (absorbed into Martyr as Ironclad specialization)
                // 'Exorcist' removed (merged with Covenbane into Inquisitor)
                ['False Prophet', 'Control', 'Madness Points', 'Void preacher channeling madness as divine revelation'],
                ['Gambit', 'Support/Control', 'Threads of Destiny', 'Card-based destiny manipulator turning failures into power'],
                ['Shaper', 'Hybrid (Damage/Mobility/Adaptation)', 'Kinetic Flux', 'Kinetic biology shapeshifter blending momentum dance with physical adaptation'],
                ['Gambit', 'Damage/Utility', 'Fortune Points', 'Daring risk-taker manipulating luck and probability'],
                ['Apex', 'Damage', 'Quarry Marks', 'Tracker with precision targeting and pursuit'],
                ['Animist', 'Support/Control', 'Ancestral Resonance', 'Spirit channeler building resonance through ancestral spirit bonds'],
                // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
                ['Lunarch', 'Support/Control', 'Lunar Charge', 'Lunar mage with phase-based energy cycles'],
                ['Martyr', 'Tank/Support', 'Devotion Gauge', 'Self-sacrificing warrior earning power through suffering'],
                ['Minstrel', 'Support', 'Harmonic Notes', 'Musical spellcaster with note combinations'],
                ['Augur', 'Control/Debuffer', 'Benediction & Malediction', 'Omen reader (absorbed Oracle as Seer spec)'],
                ['Plaguebringer', 'Damage/Control', 'Virulence', 'Plague gardener cultivating afflictions through 5 interchangeable categories; Virulence passively buffs as garden grows'],
                ['Pyrofiend', 'Damage', 'Inferno Veil', 'Fire-wielding demon with corruption stages'],
                ['Spellguard', 'Tank/Support', 'Ward Layers', 'Protective mage with magical shield systems'],
                // 'Titan' removed (absorbed into Warden as Monolith specialization)
                ['Toxicologist', 'Damage/Control', 'Alchemical Vials', 'Poison crafter with chemical warfare'],
                ['Warden', 'Damage/Control', 'Vengeance Points', 'Relentless hunter with glaive combat and spectral cages'],
                ['Augur', 'Control/Debuffer', 'Benediction & Malediction', 'Omen reader who interprets even/odd dice results to fuel blessings and curses, reshaping battlefield conditions'],
                ['Harbinger', 'Damage/Control', 'Mayhem & Prophecy Range', 'Harbinger who places living bomb prophecies with RNG chaos outcomes, earning Mayhem from fulfilled prophecies']
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
              id: 'myrathil',
              name: 'Myrathil',
              sections: [
                {
                  title: 'Overview',
                  content: `**Free-born children of the sea who spawn from storm-foam**
              
The Myrathil are a rare amphibious people spawned from sea foam during three-day gales. They have no parents, no bloodline, the sea mother is their sole origin. Their bodies are built for the intertidal zone: lean frames, enormous ocean-blue eyes, translucent webbing between fingers that retracts on land, and vein-colors that shift with mood and weather.

**Basic Information:**
- **Size:** Medium
- **Speed:** 30 feet (Swim 30 feet)
- **Lifespan:** 140-200 years
- **Languages:** Common, Aquan
- **Variants:** Breakers-Born (shore), Deep-Born (open ocean), River-Fed (estuary)`
                },
                {
                  title: 'Cultural Background',
                  content: `The Myrathil are shaped by the water that births them. The Breakers-Born spawn where waves meet shore: mediators, traders, the face the world sees. The Deep-Born spawn in open ocean: mystics and sea-herders who speak less and feel more. The River-Fed spawn in brackish estuaries: explorers who follow rivers inland and return with maps no other Myrathil could draw.

The Myrathil cannot truly rest without submersion in water. Their vein-colors betray their emotions, making them terrible liars but exceptional mediators. Land-folk romanticize them as exotic drifters and collect their sea-glass trinkets, the Myrathil tolerate this with the patience of a people who have watched civilizations rise and fall on shorelines they once called home.`
                },
                {
                  title: 'Variant Comparison',
                  content: `**Breakers-Born**: Shore-spawned diplomats and traders
- Charisma +2, Agility +1, Constitution -1
- Focus: Social, negotiation, weather-sensing, emotional insight

**Deep-Born**: Open-ocean mystics and guardians
- Spirit +3, Constitution +1, Charisma -2
- Focus: Deep submersion, low-frequency communication, abyssal perception

**River-Fed**: Estuary explorers and inland scouts
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
                    ['Tide-Tongue', 'Social', '+1 Insight and Persuasion. Disadvantage on Deception, vein-colors betray emotion.']
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
                    ['Human', 'Adaptable and resilient people divided into seven regional cultures.', '7 (Thalren, Skald, Tessen, Solvarn, Merryn, Ordan, Morren)', 'Adaptability, regional lineages, dark bargain legacy'],
                    ['Myrathil', 'Free-born sea children spawned from storm-foam.', '3 (Breakers-Born, Deep-Born, River-Fed)', 'Amphibious, weather-sensing, navigation'],
                    ['Mist-Woven Mimir', 'Secretive faceshifters who wear carved heartwood persona masks.', '3 (Mask-Borne, Unwoven, Mist-Woven)', 'Faceshifting, social deception, identity preservation'],
                    ['Briaran', 'Thorn-born outcasts descended from the house that refused the Sun-Eater\'s bargain.', '2 (Unshorn, Smooth-Skinned)', 'Oath-binding, nature magic, historical memory'],
                    ['Groven', 'Humanoid troll-kin bridge-keepers of the Cragjaw Peaks.', '2 (Morgh, Ithran)', 'Bridge-craft, cold-endurance, caste tension'],
                    ['Emberth', 'Bulky, sun-reverent forge-clans of Sundale.', '2 (Korr, Thrask)', 'Fire-tending, geothermal affinity, religious schism'],
                    ['Fexrick', 'Subterranean gnomish engineers and alchemists.', '2 (Kethrin, Drall)', 'Tinkering, alchemical crafting, trap design'],
                    ['Neth', 'Tall, immortal, silver-skinned canopy archivists.', '3 (Velun, Kessen, Drun)', 'Contracts, memory-glass, probability weaving'],
                    ['Vreken', 'Lantern-eyed bog-dwellers worshiping entombed ancestors.', '2 (Clean, Marked)', 'Bioluminescent fungi, spiritual cycles, crypt scriptorium'],
                    ['Rime-Born', 'Stone-skinned survivors of Nordhalla carrying the Frost-Tithe.', '3 (Rune Keepers, Bloodhammer, Frostbound)', 'Glacier-tombs, ancestral rage, thermal piping']
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
              content: `Violent encounters in Mythrill are resolved through a dynamic, high-stakes combat structure. Combat is divided into rounds, each representing roughly six seconds of split-second decisions and clashing iron. Rather than using rigid movement or traditional 'bonus actions' that bog down tactical flow, every combatant operates within a fluid, singular action economy fueled by Action Points (AP). During your turn, you are free to spend your AP in any sequence, moving, striking, casting, or parrying, creating an incredibly dynamic and cinematic flow of battle where you are in complete control of your character's combat cadence.`
            },
            {
              title: 'Initiative',
              content: `When blood is spilled and blades are drawn, the order of battle is decided by split-second reflexes. Every participant rolls Initiative (1d20 + Agility modifier) to place themselves on the turn sequence. High results act first, seizing the tactical advantage, while ties are broken by looking at the highest absolute Agility score. A high initiative allows a combatant to position themselves, lock down choke points, or cast pre-emptive warding runes before the enemy can react.`
            },
            {
              title: 'Action Points (AP)',
              content: `The cornerstone of Mythrill's tactical combat is the Action Point (AP) system. Every character has a pool of **3 AP** that completely refreshes at the start of their turn. There are no 'Bonus Actions' or separate movement pools; every action you take, from swinging a giant claymore to drinking a potion or stepping through a burning field, costs a specific amount of AP. This provides ultimate freedom: you can spend 2 AP to strike and 1 AP to move, or 1 AP to move, 1 AP to defend, and 1 AP to use an item. AP management is the difference between life and death in Mythrill.`
            }
          ],
          tables: [
            {
              title: 'Combat Actions',
              description: 'The fundamental actions available in combat. Each action costs Action Points, manage your AP wisely to maximize your effectiveness.',
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
        summary: ['Unified attack/damage roll using weapon die', 'Equipment-Based Damage Reduction (DR) die replaces static soak', 'Critical hits ignore Damage Reduction and do not degrade durability'],
        content: {
          title: 'Attacks & Damage',
          description: 'Unified attack/damage rolls, armor absorption, critical system',
          sections: [
            {
              title: 'Attack Resolution',
              content: `Mythrill features a revolutionary **Unified Strike & Damage Roll** that completely removes the double-rolling slow-downs of traditional d20-based systems. In conventional systems, you must roll once to hit (often slowing down play with complex calculations against static AC targets) and then roll a second time to determine damage. Mythrill collapses this into a single, high-stakes moment: when you spend AP to make a weapon strike (typically 2 AP), you roll the weapon's designated damage die (e.g., 1d8 for a longsword, 1d12 for a brutal greataxe, or 1d6 for a swift dagger) exactly once to resolve both accuracy and raw force:

1. **The Critical Fumble (1)**: If the weapon die lands on a **1**, the attack misses catastrophically. The GM will call for a secondary check on the [Difficulty Dice Ladder](core-rules/dice-system) to determine the severe consequences, such as overextending and exposing yourself, dropping the weapon, or striking a stone wall that deals direct structural damage to your gear. Details on how gear decays can be found in [Durability & Repair](core-rules/durability-repair).
2. **The Decisive Hit (2 to Max-1)**: Any roll between 2 and one less than the die's maximum value represents a successful strike. The damage dealt is immediately equal to the value shown on the die plus your corresponding attribute modifier, specifically Strength (STR) for heavy melee blows, or Agility (AGI) for precise ranged shots. To learn how these modifiers are calculated from your core attributes, see the [Six Pillars of Mortality](core-rules/character-statistics).
3. **The Sovereign Critical Hit (Max Value)**: If the die lands on its **maximum value** (e.g., an 8 on a d8, or a 12 on a d12), you unleash a critical hit. The die immediately "explodes," allowing you to roll another damage die of the same type and add it to the total, alongside triggering lethal weapon-specific properties (like bleeding, sundering, or stunning).

This unified flow makes every single weapon swing incredibly fast-paced, keeping combat visceral, lethal, and tactically fluid.`
            },
            {
              title: 'Equipment-Based Damage Reduction',
              content: `In Mythrill, armor does not make you harder to hit. Instead, it absorbs the physical impact of incoming blows to directly reduce physical trauma:

- **Damage Reduction (DR) Die**: Each equippable armor piece is assigned a designated DR die size based on its category and construction (e.g., a d10 for plate chests, a d4 for cloth robes). When you take damage, you roll this die and subtract the result directly from the damage dealt.
- **Durability Step Degradation**: If you roll a **1 or 2** on your DR die, the item's durability is degraded by one die step size (e.g., d10 -> d8). A roll of **3 or higher** keeps your durability fully intact. When rolling a 1 or 2, you take the reduced damage but the armor's integrity slips. Roleplay-wise, you can tell the GM where you reacted in the instant to take the hit, or the GM tells you where you are hit if it was by surprise.
- **No Creature DR**: Creatures do not possess equipment damage reduction; their defense is purely based on elemental or physical resistances.
- **Critical Hits Bypass DR**: Critical hits are so devastatingly precise that they ignore all armor damage reduction entirely, and they do not prompt the equipment to roll DR or take durability damage.`
            }
          ],
          tables: [
            {
              title: 'Armor Category Damage Reduction Dice',
              description: 'Standard DR die sizes assigned to different armor classes and slots. Better quality or heavier slots mean larger DR dice.',
              headers: ['Armor Category', 'Standard DR Die'],
              rows: [
                ['Cloth / Robes', 'd4'],
                ['Leather / Light', 'd6'],
                ['Mail / Medium', 'd8'],
                ['Plate / Heavy', 'd10'],
                ['Masterwork Plate / Artifact relics', 'd12 / d20']
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
              content: `Every swing carries the weight of fate. In Mythrill, the highest and lowest rolls on your weapon die are not just numbers, they reshape the battlefield in an instant.\n\n**Critical Hit** (max die value): You strike with devastating precision. Deal maximum damage plus your attribute modifier, and the die **explodes**: roll it again and add the result. This chain continues as long as you keep rolling the maximum face.\n\n**Exploding Dice**: Any time a die lands on its maximum during an explosion, roll again and keep adding. Even a humble d4 dagger can cascade into lethal territory.\n\n**Critical Miss** (natural 1 followed by another 1): The worst kind of luck. Your attack goes catastrophically wrong, roll on the Miss Consequences table below and find out the cost.`
            },
            {
              title: 'Weapon-Specific Critical Effects',
              content: `A critical hit does not merely deal more damage, the *nature* of the weapon determines how the body breaks. Choose your weapon with intent.\n\n- **Slashing**: Open wounds that refuse to close: the target **Bleeds** for **1d4 damage per round** over **1d4 rounds**.\n- **Piercing**: The blade finds the gap in the armour: **reduce the target's passive DR by 2** (minimum 0) for **1d4 rounds**.\n- **Bludgeoning**: Concussive force that rattles bone and brain: the target is **Stunned for 1 round** (Constitution save against a moderate die (typically d8), negates).\n- **Ranged**: The shaft pins cloth or flesh: the target's **movement is halved** for **1d4 rounds**.`
            }
          ],
          tables: [
            {
              title: 'Miss Consequences',
              description: 'When fate turns against you and you roll a critical miss, roll on this table to determine the consequence. Even failure tells a story.',
              headers: ['Roll', 'Consequence'],
              rows: [
                ['1', 'Catastrophic Failure: Weapon breaks/malfunctions (1 AP + quick Agility check with a moderate difficulty die, typically d8, to fix)'],
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
              content: `Not all flesh yields equally. A skeletal undead laughs at a piercing blade but shatters under a blessed mace. A fire demon scoffs at flame but screams at cold iron. These truths are encoded in Mythrill's damage modifier system, a tiered framework that determines exactly how much punishment lands.\n\nModifiers always resolve in this fixed sequence:\n\n1. **Base Damage**: Roll dice and add attribute modifiers.\n2. **Damage Modifiers**: Apply vulnerability or resistance tiers (see tables below).\n3. **Conversion Effects**: Apply any Leech, Absorb, or Invert effects.\n4. **Final Damage**: Deliver what remains to the target.`
            }
          ],
          tables: [
            {
              title: 'Damage Increase Tiers',
              description: 'When targets are vulnerable, your attacks strike harder. These modifiers multiply damage, making weaknesses devastating.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Susceptible', '25% more damage', '-1.25 (round up)', '13 damage'],
                ['Exposed', '50% more damage', '-1.5 (round up)', '15 damage'],
                ['Vulnerable', '100% more damage', '-2', '20 damage']
              ]
            },
            {
              title: 'Damage Reduction Tiers',
              description: 'Resistance and immunity reduce incoming harm. These modifiers protect you from damage types you\'re prepared to face.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Guarded', '25% less damage', '-0.75 (round down)', '7 damage'],
                ['Resistant', '50% less damage', '-0.5 (round down)', '5 damage'],
                ['Immune', 'No damage', '-0', '0 damage']
              ]
            },
            {
              title: 'Damage Conversion Tiers',
              description: 'Some abilities turn harm into healing. These powerful modifiers let you absorb damage and convert it to life force.',
              headers: ['Modifier', 'Effect', 'Calculation', 'Example (10 damage)'],
              rows: [
                ['Leech', '25% heals attacker', '-0.25 (round up)', '3 healing'],
                ['Absorb', '50% heals attacker', '-0.5 (round up)', '5 healing'],
                ['Invert', '100% heals attacker', '-1', '10 healing']
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
                  content: `Reaching 0 Hit Points in Mythrill does not immediately plunge your mind into absolute darkness. Instead, you enter a desperate, high-stakes struggle for survival known as the **Dying Condition**. While you are bleeding out and fighting to retain consciousness, you are brought to your knees, severely weakened but still possessing a spark of agency. During this state, your turn's Action Point pool is reduced to a singular **1 AP**. This precious point allows you to make desperate, conscious dying maneuvers, such as crawling 5 feet toward safety, trembling as you retrieve and swallow a healing potion, or gasping out final instructions to your allies. At the start of each of your turns, you must roll a Death Saving Throw to see if your flame of life flickers out. If you suffer further damage while dying, or accumulate 6 levels of exhaustion, your journey ends permanently.`
                },
                {
                  title: 'Death Saving Throws',
                  content: `At the start of each of your turns while Dying, roll **1d20**.\n\n- **10 or higher**: Success.\n- **9 or lower**: Failure.\n- **Three successes**: You stabilise.\n- **Three failures**: You die.\n- **Natural 20**: You immediately return to **1 HP**.\n- **Natural 1**: Counts as **two failures** at once.\n\nSuccesses and failures do not need to be consecutive, they accumulate until the threshold is reached. Any healing received while Dying immediately ends the death save sequence.`
                },
                {
                  title: 'System Shock',
                  content: `A single catastrophic strike can break a warrior's body without breaking their hit point total. When you take damage equal to or greater than **half your maximum HP** from a single source, make a **Constitution save** (easy die, typically d6). On a failure, your body reels from the trauma, you immediately gain **1 level of exhaustion**. This applies even if you are in full health.`
                },
                {
                  title: 'Massive Damage',
                  content: `Some blows are simply meant to kill. When you take damage equal to or greater than your **maximum HP** from a single source, make a **Constitution save** (difficult die, typically d12; the GM may escalate to d20 for truly apocalyptic strikes). On a **failure**, you die **instantly**: regardless of current hit points. On a **success**, you drop to 0 HP and enter the Dying state normally. This is the rule that makes legendary monsters terrifying.`
                }
              ]
            },
            {
              id: 'injuries',
              name: 'Injuries',
              sections: [
                {
                  title: 'Lingering Injuries',
                  content: `The body remembers what the spirit tries to forget. When you suffer a critical hit, or fail a death saving throw badly (by 5 or more), you may carry a **Lingering Injury**: a permanent mechanical scar that healing potions cannot touch. Roll on the Injury Table. Only powerful magic or extended downtime recovery can mend what the battlefield breaks.`
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
                  content: `Exhaustion is the slow erosion of a hero's capability under sustained pressure. It accumulates through environmental hazards, missed sleep, forced marches, starvation, and the brutal cost of fighting at 0 HP. Each level stacks its penalty on top of the last, at six levels, the body simply gives out.\n\nExhaustion cannot be ignored. It compounds across combat, rest, and skill checks, and a character with three or more levels is severely compromised. Exhaustion is reduced by one level per completed long rest.`
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
              id: 'resurrection',
              name: 'Resurrection',
              description: `**Resurrection Methods:** Different spells have varying requirements for resurrection. The more powerful the spell, the longer the time window and the greater the cost.

**Resurrection Challenges:** Resurrection is not guaranteed and comes with challenges. The ritual requires special components, takes time to perform, and may fail entirely.`,
              tables: [
                {
                  title: 'Spell Requirements',
                  headers: ['Spell', 'Time Limit', 'Cost', 'Special Notes'],
                  rows: [
                    ['Revivify', 'Within 1 minute', '100 gp', 'Quick resurrection'],
                    ['Raise Dead', 'Within 7 days', '500 gp', 'Standard resurrection'],
                    ['Resurrection', 'Within 100 years', '5,000 gp', 'Powerful restoration'],
                    ['True Resurrection', 'Any time', '25,000 gp', 'Perfect restoration'],
                    ['Reincarnation', 'Within 7 days', '1,000 gp', 'New body, same soul']
                  ]
                },
                {
                  title: 'Challenge Details',
                  headers: ['Aspect', 'Requirement'],
                  rows: [
                    ['Resurrection Difficulty', 'Base difficulty die is d10; shift the die one size harder for each previous resurrection and for each day since death'],
                    ['Ritual Components', 'Special components worth at least 500 gp'],
                    ['Ritual Duration', 'Takes 1 hour to perform'],
                    ['Failed Resurrection', 'Consumes the components but fails to restore life']
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
                  content: `Nobody comes back from death unchanged. Crossing that threshold (being dragged back through it) leaves marks that cannot be healed at a campfire. The effects below are not punishment; they are narrative truth. The world should *feel* different when a character has walked through death and returned.`
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
                  content: `When the fragments are gone, when the ritual fails, when no healer remains, there is still one door left. It swings open from the other side, and something with cold eyes waits beyond it. A **Devil's Bargain** is not a happy ending. It is the option that exists when every other option has been exhausted. The price is always significant. The debt always comes due.`
                }
              ],
              tables: [
                {
                  title: 'Bargain Details',
                  headers: ['Aspect', 'Details'],
                  rows: [
                    ['Offer', 'The character\'s soul is offered a deal for resurrection'],
                    ['Price', 'The price is always significant, a task, sacrifice, or permanent change'],
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
                  content: `When a character fails their Spirit save after a Devil's Bargain, the dark forces that pulled them back leave their mark, permanent, indelible, and non-negotiable. Roll d20. Whatever comes up is what the character carries forward, forever. These are not debuffs. They are **scars with mechanical weight**.`
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
                  content: `Stabilisation is the razor-thin line between dying and dead. A character stabilises when they accumulate **three death save successes**, receive any healing, or an ally applies emergency care with a successful **Medicine check** (easy die, typically d6). Once stable at 0 HP, the death save clock stops, they remain conscious but helpless until healed enough to act.`
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
              content: `Combat never pauses for your turn. Arrows fly, spells erupt, and blades seek gaps in armour whether you are ready or not. **Reactions** are your ability to answer danger in real time, spending AP from your pool to act outside your normal turn order.\n\nA reaction requires a **specific trigger**: an incoming attack, an ally being targeted, an enemy breaking away. When that trigger fires, you choose to react or let it pass. You cannot spend AP you do not have remaining.`
            }
          ],
          tabs: [
            {
              id: 'defensive-reactions',
              name: 'Defensive Reactions',
              sections: [
                {
                  title: 'Defensive Options',
                  content: `When steel comes for you, you are not helpless. The following reactions let you turn an enemy's assault into a missed opportunity, or worse for them, their last mistake.`
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
                    [{ spellId: 'universal_riposte', prefix: '{Parry} ? ' }, 'R', 'After a successful parry, immediately counter-attack. Roll your weapon die as normal. This attack ignores the target\'s passive DR and any Defend soak.', '1 AP'],
                    [{ spellId: 'universal_raise_shield' }, 'R', 'Your shield absorbs the impact (roll a d8 to determine damage reduction before armor reduction). The shield\'s durability decreases by 1.', '1 AP'],
                    [{ spellId: 'universal_shield_bash', prefix: '{Raise Shield} ? ' }, 'R', 'After successfully raising your shield, turn defense into offense. Make a STR vs. CON Save. If opponent fails, they are stunned until end of their next turn.', '1 AP'],
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
              content: `Years of dedicated training unlock techniques that ordinary adventurers simply cannot replicate. **Proficient Abilities** are extraordinary actions gated behind specific skill proficiencies, a trained grappler can pin a knight three times their weight; a master of deception can shatter a target's focus at the worst possible moment.\n\nThe price of this power is discipline: **only one proficient ability can be used per turn**, regardless of your remaining AP. You have exactly one window to deploy your expertise. Choose it carefully.`
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
                    ['History', 'Lore Recall', 'A', 'Recall a creature-s tricks within 30 ft; start mod d8, step up for tougher CR.', '1 AP'],
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
                    ['Stealth', 'Stealthy Passage', 'A', 'Move through a foe-s space without provoking; Stealth vs easy d6. On success move 15 ft.', '1 AP'],
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
              content: `The battlefield does not merely threaten hit points, it threatens the body and mind in a dozen ways. A soldier who is **Blinded** fights in absolute darkness. A warrior who is **Stunned** cannot act at all. A knight who is **Grappled** finds their footwork destroyed.\n\nConditions are inflicted by attacks, spells, traps, and the environment. They can stack in punishing combinations, a **Wet** target struck by lightning suffers far worse than a dry one. When a condition icon appears in the sidebar, consult this table immediately and adapt your tactics.`
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
          description: 'Rest is not a luxury in Mythrill: it is a lifeline. Manage your recovery well, or watch exhaustion hollow out your capabilities one failed save at a time.',
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
                  content: `When the party reaches a settlement (whether a walled city or a muddy frontier town), the options for recovery expand. These rules layer over the core rest system without replacing it, adding consequence and flavour to downtime without complicating the baseline math.`
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
                  content: `Coin spent in a tavern buys more than ale. **Carousing** is how adventurers blow off steam between horrors, and how they make connections, enemies, and memorable mistakes. Use these rules whenever the party has gold to burn and a night to spend badly.`
                },
                {
                  title: 'Carousing',
                  content: `Pick your spend level from the table below, from a modest handful of silver to an extravagant night that would make a duke wince. Roll a d8 and add your quality bonus. The result describes what the morning brings.`
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
                  content: `A cold stone floor and the distant sound of wolves do not make for restful sleep. The quality of a long rest depends heavily on where and how it is taken. Comfort, shelter, and safety translate directly into recovery, or the painful absence of it.`
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
                  content: `A long rest interrupted by more than one hour of strenuous activity (combat, desperate flight, sustained spellcasting), provides no benefit. The body needs unbroken recovery time, not snatched moments between crises. When rest is interrupted, the full 8-hour clock must be restarted. On particularly dangerous nights, roll on the Complications table to discover what cut the sleep short.`
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
              content: `To join the turn order, you must roll Initiative:\n\n- **Direct Sheet Integration**: Click the **Initiative** label or the d20 icon next to it in your Character HUD or full sheet. The VTT automatically rolls a d20, adds your Agility modifier, and sends the result to the chat log.\n- **Auto-Timeline Placement**: The VTT instantly adds your character token to the timeline in descending order of the roll. If there is a tie, the system automatically resolves it using your base Agility score.\n- **NPC Rolling**: The GM rolls initiative for all hostile and neutral creatures, adding them to the same tracker seamlessly.`
            },
            {
              title: 'Managing Your Turn & Action Points',
              content: `When the tracker reaches your name, several automated systems activate:\n\n- **Active Glow**: Your character portrait on the grid and in the sidebar glows, indicating it is your turn. The camera may automatically center on your token.\n- **AP Refreshes**: Your HUD shows your Action Point (AP) pool fully refreshed to **3 AP**.\n- **Condition Prompts**: Any ongoing effects (like Bleeding or Poisoned) will prompt a save or deal damage automatically at the start of your turn. See [Combat Conditions](combat-system/combat-conditions).\n- **Ending Your Turn**: Once you have spent your AP or choose to pass, click the **End Turn** button in the sidebar or HUD. The VTT shifts the active turn indicator to the next combatant, ensuring combat remains snappy.`
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
              content: `The tactical map is divided into **5-foot grid squares**. Your token represents your exact physical position in the combat space, which is critical for determining line of sight, range, cover, and flanking opportunities.\n\nMoving your token is simple and fully handled by the VTT:\n\n- **AP Cost**: Moving up to your base movement speed (typically 30 feet, or 6 squares) costs **1 AP**. This action can be repeated as long as you have AP remaining.\n- **Tactical Splitting**: You can split your movement. For example, you can spend 1 AP to move 15 feet, spend 2 AP to strike an enemy, and then use the remaining 15 feet of your movement without spending additional AP. The system tracks your remaining feet for the current movement action automatically.`
            },
            {
              title: 'Movement AP Cost & Drag Confirmation',
              content: `To prevent accidental moves or miscalculations, Mythrill uses a **Movement Path & Confirm** system:\n\n1. **Drag and Trace**: Click and drag your token across the map. As you drag, a glowing path line traces your route, showing the exact distance in feet and squares.\n2. **AP Calculation**: The VTT calculates the total AP cost in real time, displaying it as a floating badge next to your token (e.g. "Move: 15ft [0/1 AP Used]" or "Move: 45ft [2 AP Required]").\n3. **Difficult Terrain**: Moving through rough terrain (mud, deep snow, narrow crevices) is marked on the path in red. Each square of difficult terrain costs double movement speed (10 feet instead of 5 feet).\n4. **Confirmation**: Release the drag. A checkmark and cross button will appear. Click the checkmark (or press Space) to execute the move and subtract the AP. Click the cross (or press Escape) to cancel and snap your token back.`
            },
            {
              title: 'Measuring Range & Targeting',
              content: `Determining whether an enemy is within range of your longbow or spell is fully automated:\n\n- **Targeting an Enemy**: Right-click any enemy token on the grid and select **Designate Target** (or click the target icon in the right-click context menu). A target reticle will appear on them.\n- **Range Measurement**: The VTT draws a faint indicator line between your token and the target, displaying the exact distance in feet. If you click a ranged weapon or spell on your action bar, the system checks this distance against the item's range limits and highlights the target in blue (within range), yellow (long range/disadvantage), or red (out of range).\n- **Line of Sight (Fog of War)**: If the GM has enabled dynamic lighting, your token's vision determines what you can see. Enemies standing behind thick pillars or walls are masked by shadows, preventing direct targeting.`
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
- Your Weapon Damage die (varies by weapon type; see table).
- Your Weapon Mastery die (default **d8** unless modified by feats/gear). If the weapon die rolls max, it counts as a crit and you add the mastery result to the damage.

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

- Passive Damage Reduction: Reduce every incoming hit by Armor - 10 (rounded down).
- Defend Soak Die: When you take the Defend action, roll the soak die from the table below and reduce damage by the roll.`
            },
            {
              title: 'Read This Page',
              content: `1) Use the Soak Die Scale to find the die you roll when you Defend.
2) Use Armor Benchmarks to quickly see your passive DR (Armor - 10).
3) Armor Types are just a reference for armor bonuses and cost, the bonus feeds your total Armor.`
            },
          ],
          tables: [
            {
              title: 'Soak Die Scale (Defend)',
              layout: 'armor-grid',
              headers: ['Armor', 'Soak Die'],
              rows: [
                ['0-4', '-'],
                ['5-9', '1d4'],
                ['10-14', '1d6'],
                ['15-19', '1d8'],
                ['20-24', '1d10'],
                ['25-29', '1d12'],
                ['30-34', '1d12 + 1d4'],
                ['35-39', '1d12 + 1d6'],
                ['40-44', '2d12'],
                ['45-49', '2d12 + 1d4']
              ]
            },
            {
              title: 'Armor Benchmarks',
              layout: 'armor-grid',
              headers: ['Armor', 'Passive DR (Armor - 10)'],
              rows: [
                ['0-9', '0'],
                ['10-19', '1'],
                ['20-29', '2'],
                ['30-39', '3'],
                ['40-49', '4'],
                ['50-59', '5'],
                ['60-69', '6'],
                ['70-79', '7']
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
          'Powerful items require attunement, you may be attuned to a maximum of 3 items at once.',
          'Magical enchantments grant stat bonuses, damage type modifiers, special abilities, or unique passives.'
        ],
        content: {
          title: 'Magical Items',
          description: 'Rarity tiers, attunement rules, enchantment types, and item identification.',
          sections: [
            {
              title: 'Rarity Tiers',
              content: `Magical items exist across a spectrum of power, scarcity, and crafting complexity, organized into **seven rarity tiers**. Rarity determines not only the raw power of the item's enchantments, but also the difficulty of crafting, identifying, and repairing it.\n\nItems of higher rarity often require rare materials, extended crafting rituals, or the expertise of a master artisan. The GM controls which rarity tiers are available in their campaign, and discovery of a Legendary or Artifact item should feel like a momentous event.\n\nAll rarity tiers are fully supported by the VTT's Item Wizard, GMs and players can create items of any tier and assign custom enchantments. See the full Item Wizard guide at [Creating Items](equipment-system/item-wizard).`
            },
            {
              title: 'Attunement',
              content: `Some items of Uncommon rarity or higher require **attunement**: a ritual of bonding that awakens the item's magical properties to your specific essence. An unattuned attunement item still functions as a mundane item of its physical type (an unattuned +2 sword still cuts like a sword) but its magical bonuses, stat enhancements, and special abilities remain dormant.\n\nTo attune to an item:\n- **Short Rest Bonding**: Spend one short rest (at least 1 hour) in physical contact with the item, meditating on its history and focusing your spiritual energy into its enchantments.\n- **Character Limit**: You may be simultaneously attuned to a maximum of **3 magical items**. Attempting to attune to a fourth forces you to end attunement with one of the three current items first.\n- **Breaking Attunement**: Attunement ends when you die, when the item is destroyed (see [Durability & Repair](core-rules/durability-repair)), or when you voluntarily spend 1 minute of meditation to release the bond.\n- **VTT Tracking**: The VTT character sheet automatically tracks your attunement slots. Items marked as requiring attunement will display an attunement icon in your equipment panel, and an orange warning indicator appears if you have exceeded your slot limit.`
            },
            {
              title: 'Enchantment Types',
              content: `Magical items in Mythrill can carry a wide variety of enchantments, each representing a different category of magical infusion:\n\n- **Stat Enchantments**: Direct bonuses to attributes (e.g., +2 Strength, +1 Agility), derived stats (e.g., +5 Armor, +10 Max HP), or skill bonuses (e.g., +2 to Persuasion checks).\n- **Damage Enchantments**: Additional damage of a specific type on hit (e.g., +1d4 Fire damage, +1d6 Necrotic damage), or damage type conversion (converting Slashing to Radiant, for example).\n- **Resistance & Immunity Enchantments**: Granting Guarded, Resistant, or Immune status against one or more damage types. See [Damage Modifiers](combat-system/damage-modifiers) for the tier definitions.\n- **Special Ability Enchantments**: Unique active or passive abilities that function like class abilities. Examples include: once-per-rest flight, a chance-on-hit effect, a persistent aura, or a conditional proc (fires when you drop below 25% HP).\n- **Cosmetic Enchantments**: Visual effects (glowing runes, color-shifting materials, animated engravings) that have no mechanical effect but make the item more distinctive.`
            },
            {
              title: 'Item Identification',
              content: `When discovering a magical item in the field (looted from an enemy or found in a cache), its properties may initially be **unidentified**: known only to carry some magical essence. Characters with proficiency in Arcana can attempt to identify an item:\n\n- **Quick Identification**: Spend 1 minute examining the item and make an Arcana check against a difficulty die set by the GM (Uncommon items: d6-d8; Rare: d10; Epic: d12; Legendary/Artifact: d20). On a success, the item's properties are revealed.\n- **Extended Study**: If you fail the quick check, you can study the item during a long rest to guarantee identification regardless of result.\n- **Identify Spell**: If any character in the party has access to the Identify spell (available to most Intelligence-based casters), casting it reveals all properties of a touched item instantly.\n- **Town Sages**: In settlements, sages and artificers can identify items for a fee, typically proportional to the item's rarity tier.`
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
              content: `The **Item Wizard** is one of Mythrill's most powerful GM and player tools. It allows you to design fully custom weapons, armor, accessories, consumables, containers, and magical relics from scratch, specifying every detail from their physical dimensions on the inventory grid to their magical enchantments, lore description, and visual appearance.\n\nItems created through the wizard can be:\n- Saved to your **Personal Item Library** for use in any future session.\n- Shared to the **Community Library**, making them available to all Mythrill users worldwide.\n- Distributed directly to players during a session by the GM.\n- Placed in **Containers** (chests, bags, vaults) that players discover during exploration.\n\nAccess the Item Wizard through the main navigation menu. GMs can also access it directly from the GM Tools panel during a live session.`
            },
            {
              title: 'Quick Create vs. Full Wizard',
              content: `The Item Wizard offers two creation modes to suit different needs:\n\n**Quick Create Mode** generates an item instantly based on a small set of key parameters: name, item type, rarity, and a brief description. The system auto-fills sensible defaults for everything else (damage dice, armor values, durability, grid size). This mode is perfect for rapidly generating loot during a session or filling a dungeon chest.\n\n**Full Wizard Mode** is the complete multi-step process (see below) giving you total control over every parameter. Use the Full Wizard when creating signature weapons, named magic items, unique artifacts, or any item that needs precise mechanical tuning.`
            },
            {
              title: 'The Item Wizard Steps',
              content: `The Full Wizard guides you through these creation steps:\n\n**Step 1: Basic Info**: Name the item, write its lore description, select its item type (Weapon, Armor, Accessory, Consumable, Container, Miscellaneous), set its rarity tier, and choose a visual icon from the library or upload a custom image.\n\n**Step 2: Physical Stats**: Configure the item's core statistics based on its type. For weapons: damage die, weapon type (Sword, Axe, Bow, etc.), handedness, and range. For armor: armor bonus, armor type (Cloth, Leather, Mail, Plate).\n\n**Step 3: Magical Effects**: Add enchantments. Select from stat bonuses, on-hit damage effects, resistances, active abilities, passive auras, or custom proc effects. Each effect can be finely tuned, set the magnitude, the damage type, the trigger condition, and the target. See [Magical Items](equipment-system/magical-items) for enchantment type details.\n\n**Step 4: Durability**: Set the item's maximum durability. Leave at the default for the rarity tier, or set a custom value to represent exceptional craftsmanship or ancient decay. See [Durability & Repair](core-rules/durability-repair) for how durability works in play.\n\n**Step 5: Inventory Grid Shape**: Configure the item's physical footprint in the inventory grid. Simple items are 1x1 slots; a two-handed greatsword might be 1x6. See [Your Inventory Grid](core-rules/inventory-encumbrance) for how grid slots work.\n\n**Step 6: Lore & Flavor**: Add rich lore text, an item history, a creator's name, and any special notes for the GM. This text is visible when players inspect the item in their inventory.\n\n**Step 7: Review & Save**: Preview the complete item card as players will see it. Save to your personal library, share to the community, or deploy directly into the current session.`
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
              content: `The **Item Library** (accessible from the VTT main menu) is divided into two distinct databases:\n\n- **Personal Library**: A private vault where all items you create using the [Item Wizard](equipment-system/item-wizard) are saved. These are persistent across all your campaigns.\n- **Community Library**: A global repository featuring public creations shared by other players and GMs. You can browse, filter by type or rarity, and copy these items directly into your personal collection or active sessions with a single click.`
            },
            {
              title: 'GM Distribution & Containers',
              content: `During play, GMs have several elegant methods to distribute loot:\n\n- **Direct Grant**: Drag any item from the Session Library and drop it directly onto a player\'s character portrait in the HUD or timeline. The item instantly pops up in their inventory.\n- **Encounter Rewards**: Linking items to NPC tokens in the Creature Library guarantees they appear as lootable items on the grid when the creature is defeated. See [Combat Basics](combat-system/combat-basics).\n- **Lootable Containers**: GMs can place interactive chest, bag, or urn tokens on the grid and pre-fill them with items from the library. When a player token moves adjacent to the container and right-clicks it, an inventory split-screen opens, allowing them to drag items into their pack.`
            },
            {
              title: 'The Shop System & Trading',
              content: `Economic transactions in Mythrill are clean and fully automated:\n\n- **In-Game Shops**: GMs can configure merchant NPCs with specific shop inventories. When players interact with these merchants, they open a shop interface. Buying items automatically deducts Gold from their character sheet and places the item in their inventory grid, subject to spacing rules. Selling items works the reverse, checking item value and mending state (damaged items sell for less).\n- **Player-to-Player Trading**: To trade items with a nearby ally, right-click their token and select **Offer Trade**. This opens a secure trade window where both players drag items and gold into their respective trade offers and click "Accept" to execute the swap instantly.`
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
        icon: 'fas fa-hat-wizard',
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
              content: `Every spellcaster in Mythrill (regardless of class or magical school) has access to a shared arsenal of **Universal Spells**. These are the bedrock incantations that no mage ventures without: **Detect Magic**, **Dispel Magic**, **Counterspell**, and their kin appear in the General tab of every caster's action bar. They are not glamorous. They are often the difference between controlling a fight and losing it entirely to an enemy's enchantment.`
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
          description: 'Action economy and class-specific resource systems used across all 20 classes',
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
              description: 'Each of the 20 classes uses unique resource mechanics that define their playstyle and tactical options.',
              layout: 'armor-grid',
              headers: ['Resource', 'Used By', 'How It Works'],
              rows: [
                ['Building Blocks & Combinations', 'Arcanoneer', 'Generate Building Blocks; combine for powerful effects'],
                ['Rage Points', 'Berserker', 'Builds on hits/being hit; decays out of combat'],
                ['Kinetic Flux & Body Toll', 'Shaper', 'Flux builds from combat actions; Body Toll escalates with each form shift (risk of identity collapse)'],
                ['Mayhem Modifiers', 'Harbinger', 'Generate chaos spheres; spend to twist spells unpredictably'],
                ['Temporal Energy', 'Chronarch', 'Time Shards from casting; Temporal Strain from time manipulation (risk of backlash)'],
                ['Righteous Authority', 'Inquisitor', 'Dominance Dice (d12-d6) track control over bound demons; Anti-Magic Seals disrupt spellcasting and can be detonated'],
                // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
                ['Death Toll & Phylactery', 'Revenant', 'Volatile necrotic energy from HP sacrifice and kills; Phylactery charges from kills for resurrection; Death Shroud toggle'],
                // 'Dark Resilience Points' removed (Dreadnaught absorbed into Martyr as Ironclad specialization)
                // 'Divine Dominance' removed (Exorcist merged with Covenbane into Inquisitor's Righteous Authority)
                ['Madness Points', 'False Prophet', 'Accumulate Madness through void preaching; each point boosts damage, but reach 20 and Insanity Convulsion erupts'],
                ['Threads of Destiny', 'Gambit', 'Generate threads from failures; weave fate to turn luck around'],
                ['Kinetic Flux & Body Toll', 'Shaper', 'Flux builds from combat and form actions; Body Toll from shifts (identity erosion risk)'],
                ['Fortune Points', 'Gambit', 'Earn through risky actions; spend to manipulate probability and luck'],
                ['Quarry Marks', 'Apex', 'Mark targets; build focus through precision attacks'],
                ['Ancestral Resonance', 'Animist', 'Channel ancestral spirits; build resonance to invoke spirit abilities'],
                // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
                ['Lunar Charge', 'Lunarch', 'Build charge through lunar phases; spend on powerful moon-based abilities'],
                ['Devotion Gauge', 'Martyr', 'Earn by taking damage; spend on self-sacrificing powerful abilities'],
                ['Harmonic Notes', 'Minstrel', 'Generate notes through performance; combine notes for musical spell effects'],
                ['Prophetic Vision', 'Augur (Seer)', 'Build vision through divination; spend to see future and alter fate'],
                ['Virulence', 'Plaguebringer', 'Passive buff gauge (0-100) that grows through affliction cultivation; 5 interchangeable categories determine final plague type'],
                ['Inferno Veil', 'Pyrofiend', 'Ascend/descend fire stages; higher stages unlock more powerful fire abilities'],
                ['Ward Layers', 'Spellguard', 'Build protective ward layers; spend layers for defensive and offensive abilities'],
                // 'Strain Overload'/'Titan' removed (absorbed into Warden as Monolith specialization)
                ['Alchemical Vials', 'Toxicologist', 'Toxin Vials for poisons/concoctions; Contraption Parts for battlefield devices'],
                ['Vengeance Points', 'Warden', 'Build vengeance when allies take damage; spend on protective and retaliatory abilities'],
                ['Benediction & Malediction', 'Augur', 'Even d20 results generate Benediction (boons/blessings), odd results generate Malediction (curses/debuffs). Only applies to visible creatures within 60ft. Advantage/disadvantage: both dice generate. Spec-dependent maxes: 10/10, 15/5, or 5/15. Overflow at max is lost. Short rest resets to 0 (no penalty). Unused resources at long rest cause Omen Debt (-1/point to all rolls, cap -10).'],
                ['Mayhem', 'Harbinger', 'Earned from fulfilled prophecies (Prophesied outcomes). Spent to widen prophecy ranges and cast stronger spells. Prophecy Range: roll 2 dice ? lower = Low boundary, higher = High boundary ? inside = Prophesied, boundary = Base, outside = Backlash.']
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
              content: `Magic in Mythrill is not spoken lightly. Every incantation is a transaction with forces older than the world, and those forces demand payment in AP, Mana, or blood.\n\n1. **Declare** the spell and your intended target.\n2. **Spend** the required AP and Mana (or class resource).\n3. **Resolve** any attack rolls or saving throws as specified by the spell.\n4. **Apply** the spell's effects, damage, conditions, buffs, or terrain alterations.\n\nThe spell entry on your action bar handles cost calculation automatically. You cannot cast if you lack sufficient AP or resources.`
            },
            {
              title: 'Spell Components',
              content: `Not all magic is cast the same way. Some spells demand spoken words, silence the caster, and the casting fails. Others require precise gestures that bound or shattered hands cannot form. The most demanding consume rare physical reagents in the act of casting.\n\n- **Verbal (V)**: Incantations, true names, prayers. Impossible while silenced or gagged.\n- **Somatic (S)**: Focused gestures requiring precision. Demands at least one free hand.\n- **Material (M)**: Physical reagents: powders, crystals, blood, bone. Consumed on casting unless otherwise stated.\n\nA spell may require any combination of the three. The action bar entry notes which components apply.`
            },
            {
              title: 'Concentration',
              content: `The most powerful sustained spells demand constant focus. While **concentrating**, your mind is divided, maintaining the spell's weave even as the world tries to shatter it.\n\n- **One at a time**: You can only concentrate on one spell simultaneously. Casting a new concentration spell immediately ends the previous one.\n- **Damage breaks focus**: Each time you take damage while concentrating, make a **Constitution save** (challenging die, typically d10). The GM may step this up to d12 or d20 for massive blows.\n- **Succeed**: the spell holds. **Fail**: concentration ends and the spell collapses.\n\nProtecting a concentrating ally is often more valuable than landing an extra attack.`
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
              content: `**⚠️ Forging Your Path** — The Talent Tree system is currently in development. An early alpha build exists and is fully wired, but talents are not yet available in active play. The information below describes the intended design.\n\n---\n\nEvery scar, every victory, every hard lesson shapes what a warrior becomes. **Talent Trees** are the mechanical expression of this growth, a branching web of unlockable techniques, refinements, and power that deepens your character with each passing level.\n\nTrees are divided into **7 tiers**. Entry-level talents are accessible early; pinnacle abilities at Tier 7 demand significant investment and character experience. Dependency chains are shown visually with connecting lines, you must walk the path before reaching its summit.`
            },
            {
              title: 'Talent Points',
              content: `Each level earned grants **1 Talent Point**. These are spent to unlock new talents or advance existing ones to higher ranks. Some talents scale through multiple ranks, investing deeper increases potency rather than simply adding a new ability.\n\nPoints are finite. Your build defines how your character fights, survives, and applies pressure to the battlefield.`
            },
            {
              title: 'Synergies',
              content: `Talents rarely stand alone. A fire damage talent amplifies every flame-based spell in your arsenal. A speed talent shifts the value of every positioning ability in your kit. A resilience talent changes which risks are worth taking.\n\nUnderstanding these chains (and planning for them), is the difference between a character and a *build*. The most fearsome adventurers in Mythrill didn't stumble into power. They built toward it, one deliberate choice at a time.`
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
          'Craft personalized spells dynamically using the VTT-s 9-step Spellcrafting Wizard.',
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

Every custom spell you weave is calculated and budgeted according to its tier level and effect weight, ensuring that customized spells remain balanced. To learn more about how resources are drawn and spent by the 20 classes, see [Magic Resources](magic-system/magic-resources).`
            },
            {
              title: 'The 9-Step Custom Spellcrafting Workflow',
              content: `To weave a spell from raw elements, you progress through the nine sequential steps of the VTT Wizard:

- **Step 1: Basic Info** - Record your spell's thematic name, select its magical class school (e.g. Pyromancer, Chronomancer), assign an elemental affinity, and pick a visual icon to represent it on your sheet.
- **Step 2: Spell Type** - Declare the spell's core nature: an Active combat strike, a persistent Passive aura, a defensive Reaction, a Channeled concentration spell, or a hidden battlefield Trap.
- **Step 3: Effects** - Add and customize one or more primary spell effects. Choose from Damage, Direct Healing, Warding Shields, Stat Buffs, debilitating Debuffs, spatial Control, or prophecy manipulation.
- **Step 4: Targeting** - Configure the spell's range and spatial template. Choose between Self, Single Target (Ally or Enemy), spherical Area of Effect (AoE), cones, or long lines, setting precise feet boundaries.
- **Step 5: Resources** - Select and tune your spell's casting cost, drawing from Action Points (AP), Mana/Stamina reservoirs, or direct Health sacrifice.
- **Step 6: Cooldown & Charges** - Set the spell's recovery cycle. Balance powerful effects by adding round-based cooldowns or multiple casting charges.
- **Step 7: Mechanics & Special Triggers** - Inject advanced scripting nodes, such as rollable outcome tables, trap placement coordinates, or prophecy low/high boundaries.
- **Step 8: Sustained Channeling** - Establish any channeling costs and concentration requirements for sustained, round-over-round magic.
- **Step 9: Balance & Review** - Run the spell through the built-in balance analyzer. Once verified, save the custom spell directly to your character ledger to have it instantly populate your active action bar.`
            },
            {
              title: 'VTT Balance Thresholds & Action-Bar Integration',
              content: `The ultimate step of spellcrafting is the **Balance Evaluation**. The VTT-s balance calculator measures your spell's total utility (damage, healing, templates, duration) against its tier limit and resource cost. 

- **Balanced Spells**: If the spell is within the tier budget, it is approved. The wizard allows you to save the spell directly to your character ledger. The spell icon is placed on your **active action bar**, ready for tactile, point-and-click casting during encounters.
- **Unbalanced Spells**: If the spell's power exceeds its budget, the system will highlight the imbalance in red. The wizard provides dynamic recommendations to bring it back in line (e.g., increasing Mana/AP cost, adding a cooldown, or scaling down the damage). This ensures fair play while leaving creative freedom in your hands.`
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
                  content: `Not every battle is won with a blade. In Mythrill, the tongue is a weapon, and sometimes a sharper one. **Social encounters** use the same Difficulty Die system as combat: the GM assigns a die based on the challenge, you roll your relevant skill, and the colour of the result tells the whole table what happens next.\n\nFive skills drive social encounters. Knowing which to reach for (and which to avoid), is as tactically important as knowing when to parry.`
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
                  content: `An NPC's **Attitude** toward the party is not a fixed trait, it is a living variable shaped by reputation, past interactions, and the consequences of the party's actions in the world. It directly controls how difficult social encounters with that character are.\n\nA **Hostile** merchant won't sell to you. An **Indifferent** city guard follows standard procedure. A **Helpful** informant shares secrets they shouldn't. Attitudes shift over the course of a campaign based on what the party does, and what it fails to do.`
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
                  content: `High-stakes social situations, a tense negotiation with a crime lord, a debate before a war council, a battle of wits in a noble court, can be run as **structured encounters** with initiative, clear objectives, and defined victory conditions. These work like combat rounds: each participant acts in sequence, deploying social actions from a defined pool. The party accumulates **Influence Points** toward a threshold representing their goal. Reach it before the window closes, and the encounter is won.\n\nUse structured social encounters sparingly. Reserve them for moments with real political or narrative weight.`
                }
              ],
              tables: [
                {
                  title: 'Social Actions',
                  description: 'Actions available during structured social encounters. Each action has potential rewards and risks, choose wisely, for words have consequences.',
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
                  content: `Overland travel across the untamed frontiers of Mythrill is a test of preparation and endurance. Every journey requires the party to select a **Travel Pace**, balancing the speed of their march against their awareness of danger and ability to move unseen. Traversing harsh biomes like choked forests or frozen mountains slows progress and strains navigators, who must roll their **Navigation Die** to prevent the party from becoming lost in the wilderness.`
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
                    ['Forest', '-0.5', 'Challenging die (d10)', 'Limited visibility, foraging opportunities'],
                    ['Hills', '-0.75', 'Moderate die (d8)', 'Elevated view, moderate difficulty'],
                    ['Mountains', '-0.5', 'Difficult die (d12)', 'Altitude effects, avalanche risk'],
                    ['Swamp', '-0.25', 'Difficult die (d12); step to d20 in storms', 'Disease risk, difficult navigation'],
                    ['Desert', '-0.75', 'Challenging die (d10)', 'Water scarcity, extreme temperatures'],
                    ['Arctic', '-0.5', 'Difficult die (d12)', 'Extreme cold, blizzard risk']
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
                  content: `The GM rolls for encounters based on terrain, time of day, and party activities. Not all encounters are combat, many are opportunities for roleplay, discovery, or resource management.`
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
                    ['Very Easy', '2', 'd4-d6'],
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
                    ['Heavy Rain', 'Disadvantage on Perception, speed -0.75', 'Waterproof gear'],
                    ['Snow', 'Speed -0.5, tracks easily visible', 'Winter clothing'],
                    ['Blizzard', 'Speed -0.25, Constitution save or exhaustion', 'Shelter required'],
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
                  content: `Mythrill's wilderness and ruins are not passive backdrops, they are layered environments full of threat, treasure, and consequence. **Exploration** is the third pillar of play alongside Combat and Social encounters, demanding attention, preparation, and the willingness to poke at things that probably shouldn't be poked.\n\nWhen exploring, the GM structures their description around six anchors: *What do you see? What do you hear? What do you smell? What is the atmosphere? What is unusual? What can you interact with?* Not all six will always apply, but the best exploration scenes answer most of them, making the space feel real before the players begin tearing it apart.`
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
                    ['Secret Door', 'Investigation', 'd10-d12', 'Access to hidden areas'],
                    ['Hidden Treasure', 'Perception/Investigation', 'd8-d12', 'Gold, gems, items'],
                    ['Ancient Runes', 'Arcana/History', 'd10-d20', 'Lore, spell knowledge'],
                    ['Natural Resources', 'Nature/Survival', 'd6-d10', 'Crafting materials'],
                    ['Trap', 'Perception', 'd8-d12 (step to d20 for deadly traps)', 'Avoid danger'],
                    ['Clues', 'Investigation', 'd6-d12', 'Story information'],
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
                    ['Magical Ward', 'Arcana vs challenging/difficult die (d10-d12)', 'Spell effect triggers', 'Dispel magic'],
                    ['Quicksand', 'Survival vs moderate/challenging die (d8-d10)', 'Restrained, sinking', 'Rope, careful movement'],
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
              content: `Mythrill's environments are not scenery. They are threats with their own rules. Blizzards impose Constitution saves. Extreme heat drains endurance one hour at a time. Darkness strips perception checks. Difficult terrain slows the cautious and punishes the reckless.\n\nThe hazards below represent the most common environmental pressures characters face during travel and exploration. GMs should treat these as baselines, layering them with biome-specific weather effects from the [Advanced Travel System](travel-exploration/advanced-travel) for a fully immersive overland experience.`
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
                  content: `The Advanced Travel System provides a structured, hour-by-hour procedure for running overland journeys. Each travel day is broken into discrete hours, and the GM works through a checklist for each one. The system is designed around six biomes (Arctic, Desert, Forest, Swamp, Ocean, and Underdark), each with their own weather tables, environmental hazards, and encounter pools.

Use the **Travel Tracker** tool (press W in-game, GM only) to automate rolling, tracking, and broadcasting. The rules below serve as the reference for what the tool does under the hood.`
                },
                {
                  title: 'Step-by-Step Procedure',
                  content: `Each travel day follows this workflow:

**1. Roll Weather**: Roll d20 + d8. The d20 determines the weather condition from the biome's weather table. The d8 sets how many hours that condition lasts. When the duration expires, roll again.

**2. Set Transport & Conditions**: Choose the party's transport mode (on foot, mounted, vehicle, etc.), the terrain subtype, and note any current exhaustion levels. These together determine the party's speed in miles per hour.

**3. Select a Travel Hour**: A standard travel day is 8 hours (hours 1-8). Hours 9-14 are overmarching territory, possible, but increasingly dangerous. Click an hour in the tracker to open its checklist.

**4. Resolve the Hourly Checklist**: For each hour:
- **Navigator's Check**: Survival vs the weather's navigation difficulty die. On Track = normal progress. Lost = no distance gained, hour still consumed.
- **Environmental Save**: Constitution save vs the weather's environmental difficulty die. Failure = 1 exhaustion level. Proper gear may grant advantage or auto-success depending on biome and weather severity.
- **Ration Check**: Every 4 hours of travel (hours 4 and 8), each character consumes 1 ration. No ration = Constitution vs moderate die (d8) or 1 exhaustion.
- **Rest Point**: Every 4 hours, a 1-hour short rest is recommended. Skipping it triggers Constitution saves starting the next hour.
- **Encounter Check**: Check for random encounters at hours 2, 4, 6, and 8. In severe weather, also check odd hours.`
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

The weather table uses the difficulty die system, navigation and environmental columns list which die to roll, not flat DCs. A "d4" entry means the check is very easy; a "d20" means it is very difficult.`
                },
                {
                  title: 'Weather Severity Scale',
                  content: `All biomes share a 5-tier severity scale that determines how weather interacts with gear and movement:

- **Severity 0 (Clear)**: No penalties. Gear auto-passes environmental saves.
- **Severity 1 (Mild)**: Minor navigation impact. Gear still auto-passes.
- **Severity 2 (Moderate)**: Visibility reduced. Gear grants advantage on environmental saves instead of auto-pass.
- **Severity 3 (Severe)**: Significant penalties. Speed may be reduced. Gear only grants advantage.
- **Severity 4 (Extreme)**: Dangerous. Shelter strongly recommended. Gear grants advantage, no auto-pass. Overmarching doubles exhaustion risk.`
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
- In **Severity 0-1** weather: appropriate environmental gear (cold-weather clothing, sun protection, waterproof layers, etc.) grants an automatic success, no roll needed.
- In **Severity 2-4** weather: gear no longer auto-passes. It grants **advantage** on the save instead.
- Without appropriate gear: roll normally (no advantage, no auto-pass).
- Characters with relevant **resistance or immunity** always auto-pass.`
                },
                {
                  title: 'Overmarching',
                  content: `Pushing past 8 hours of travel in a day is called overmarching. It is possible but dangerous:

- **Hours 9-10:** Constitution vs challenging die (d10) or 1 exhaustion per character.
- **Hours 11-12:** Constitution vs difficult die (d12) or 1 exhaustion. Speed halved for the party.
- **Hours 13-14:** Constitution vs d20 or 1 exhaustion. This is survival territory, legendary endurance required.
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

**Rations:** Each character consumes 1 ration every 4 hours of active travel (typically at hours 4 and 8 of a travel day). Without a ration, the character must make a Constitution save vs moderate die (d8) or gain 1 exhaustion. Rations are consumed whether the party is traveling, sheltering, or waiting, only resting at a settlement with food supply pauses the timer.

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
                    ['Desert', 'd20', '1d4 rations + water', 'Whole party fed + water', 'Nothing, desert is unforgiving'],
                    ['Forest', 'd8', '1d4+1 rations', 'Whole party fed + herbs', 'Half ration on miss by 1-4'],
                    ['Swamp', 'd10', '1d4 rations', 'Whole party fed', 'Half ration, but disease risk (Con vs d8)'],
                    ['Ocean', 'd8 (fishing)', '1d4+1 rations', 'Whole crew fed', 'Half ration, thin ice risk arctic fishing'],
                    ['Underdark', 'd12', '1d4 rations (fungus)', 'Whole party fed', 'Nothing, spore cloud on miss by 5+']
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
                  content: `Encounters are checked at specific hours during travel. Not all encounters are combat, many are opportunities for roleplay, discovery, or resource management.

**When to check:**
- Standard: hours 2, 4, 6, and 8 of the travel day.
- Severe weather (severity 3-4): also check odd hours (1, 3, 5, 7).
- A roll of 18-20 on the encounter die always triggers, regardless of the table entry.

**Encounter types:** Combat, Social, Hazard, Discovery, or None. Each biome's encounter table specifies the type and provides notes for the GM.`
                },
                {
                  title: 'Encounter Tables',
                  content: `Each biome has its own encounter table with d20 entries. The tables are designed as starting points, GMs should customize them using the Travel Tracker tool's encounter table editor, adding creatures from their creature library and tailoring the results to their campaign.

Encounter entries include:
- **Range**: The d20 values that trigger this encounter.
- **Type**: Combat, Social, Hazard, Discovery, or None.
- **Name**: What the party encounters.
- **Note**: GM guidance for running the encounter.
- **Creature Links**: When using the Travel Tracker tool, these reference creatures from the GM's creature library with hoverable tooltips.`
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
                    ['1-6', 'None', 'Uneventful travel', 'Describe the frozen landscape, tundra, distant peaks, eerie silence.'],
                    ['7', 'Discovery', 'Tracks in Snow', 'Survival vs moderate die (d8) to identify: wolf pack, herd, humanoid, or lone predator.'],
                    ['8', 'Combat', 'Wolf Pack', 'Pack tactics. Animal Handling vs moderate die (d8) + fire source may cause retreat.'],
                    ['9', 'Social', 'Nomad Patrol', 'Disposition varies. Persuasion vs challenging die (d10). May know local routes.'],
                    ['10', 'Social', 'Stranded Traveller', 'Exhaustion 2-4. Medicine vs moderate die (d8) to stabilise. May offer information.'],
                    ['11', 'Combat', 'Frost Predator', 'Regeneration stopped by fire. Hunts by smell, severe weather grants it advantage.'],
                    ['12', 'Combat', 'Yeti', 'Chilling Gaze: Constitution vs moderate die (d8) or paralysed. Fire causes fear.'],
                    ['13', 'Hazard', 'Crevasse Field', 'Perception vs challenging die (d10) or nearest character falls.'],
                    ['14', 'Hazard', 'Avalanche', 'Agility save vs challenging die (d10) or buried. Athletics vs moderate die (d8) to extract.'],
                    ['15', 'Combat', 'Ice Drake', 'Cold breath weapon. Can be bribed with Persuasion vs challenging die (d10) + shiny offering.'],
                    ['16', 'Combat', 'Apex Predator', 'Area affect chilling ability. Cold immunity. May track party for hours.'],
                    ['17', 'Discovery', 'Elemental Spirit', 'Perception vs challenging die (d10) to spot. May gift a trinket or temporary resistance.'],
                    ['18', 'Social', 'Rival Expedition', 'Disposition varies, hostile, competitive, desperate, or potential allies.'],
                    ['19', 'Combat', 'Winter Wolf Pack', 'Cold breath, pack tactics. Hunts silently in blizzards.'],
                    ['20', 'Combat', 'Burrower', 'Burrows under snow, Perception vs difficult die (d12) or surprised. Heated body on contact.']
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
                    ['15', 'Combat', 'Djinn', 'Powerful air elemental. May bargain, Persuasion vs difficult die (d12).'],
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
                    ['7', 'Discovery', 'Bubbling Mud Pot', 'Nature vs moderate die (d8), natural hot spring or volcanic vent.'],
                    ['8', 'Combat', 'Snake Swarm', 'Venomous. Fire or area effects scatter them. Medicine vs moderate die (d8) to treat bites.'],
                    ['9', 'Social', 'Hermit / Witch', 'Lives alone in the bog. Knowledgeable but eccentric. Trades for rare ingredients.'],
                    ['10', 'Social', 'Fleeing Refugees', 'Running from something deeper in. May warn of upcoming hazard.'],
                    ['11', 'Combat', 'Bog Undead', 'Rise from the muck. Resist slashing. Fire or radiant effective.'],
                    ['12', 'Combat', 'Lurker', 'Camouflaged ambush predator. Perception vs difficult die (d12) to detect.'],
                    ['13', 'Hazard', 'Quicksand / Bog Hole', 'Survival vs challenging die (d10) to spot. Strength vs moderate die (d8) to escape.'],
                    ['14', 'Hazard', 'Disease Cloud', 'Constitution vs challenging die (d10) or disease. Wind direction matters.'],
                    ['15', 'Combat', 'Hag Covey', 'Three hags, territorial. Deceptive, may offer bargains. Insight vs challenging die (d10).'],
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
                    ['11', 'Combat', 'Hook Horror', 'Echolocation, blind but accurate. Thunder damage disrupts their tracking.'],
                    ['12', 'Combat', 'Mind Flayer Scout', 'Psionic blast. Intelligence vs challenging die (d10) to resist. Does not fight alone, others are near.'],
                    ['13', 'Hazard', 'Fungal Spore Cloud', 'Constitution vs challenging die (d10) or hallucinating. Nature vs moderate die (d8) to identify safe path.'],
                    ['14', 'Hazard', 'Unstable Ceiling', 'Perception vs challenging die (d10) to hear cracking. Agility vs moderate die (d8) to dodge collapse.'],
                    ['15', 'Combat', 'Drow Raiding Party', 'Poisoned weapons, dark magic. May take prisoners rather than kill.'],
                    ['16', 'Combat', 'Purple Worm', 'Burrows through stone. Survival vs difficult die (d12) to detect tremors early.'],
                    ['17', 'Discovery', 'Abandoned Duergar Forge', 'Investigation vs moderate die (d8). Rare metals, forgotten constructs.'],
                    ['18', 'Social', 'Myconid Circle', 'Pacifistic unless threatened. Spore communication. May share safe routes for tribute.'],
                    ['19', 'Combat', 'Aboleth Servants', 'Dominated thralls. The aboleth itself watches from a pool. Enslave on hit, Will vs difficult die (d12).'],
                    ['20', 'Combat', 'Underdark Tyrant', 'Ancient evil, beholder, lich, or worse. Its lair shapes the tunnels around it. Retreat is survival.']
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

Transport modes vary by biome, not all modes are available everywhere. Ocean travel requires a vessel. Underdark travel is almost always on foot. Arctic travel may include sled dogs.`
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
  - Exhaustion 3+: x0.5 (speed halved, affects the entire party)
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
              content: `The **Blacksmithing Forge Interface** allows players to process raw ores harvested from the world and reshape them into martial gear.\n\n- **Refining Ore**: Harvested raw ore (such as Iron, Mithril, or Obsidian) must be smelted at a forge into ingots. Every 3 units of raw ore yields 1 ingot.\n- **Forging Gear**: Creating weapons or heavy armor requires a set number of ingots, a leather wrap, and an active heat source. Select the recipe and initiate the forging process.\n- **Masterwork Upgrades**: High-quality ingots (like Mithril) or a high crafting roll can trigger a **Masterwork Opportunity**. A Masterwork item gains +1 Durability tier or a special weapon/armor trait slot (e.g., +1 damage, reduced AP cost to wield, or weight reduction). See [Dynamic Weapon State](equipment-system/weapons) and [Armor Systems](equipment-system/armor).\n- **Equipment Repair**: Players can restore durability to metal weapons and armor using a smith's hammer at any forge interface, costing 1 scrap metal per 10 durability restored. See [Mortal Wear & The Art of Repair](equipment-system/durability-repair).`
            },
            {
              title: 'Alchemy (Alchemist Interface)',
              content: `The **Alchemist Brewing Interface** is used to combine organic reagents, magical extracts, and catalyst water into potent liquid concoctions.\n\n- **Organic Reagents**: Players gather flora (Sorrowbloom, Emberleaf, Sunbell) and monster organs during exploration.\n- **The Brewing Process**: Select a brewing formula in the VTT interface. Players must balance the temperature gauge within a specific range using heat controls while adding catalysts. Failing to manage temperature increases the risk of alchemical backfires (deals acid/fire damage and wastes ingredients).\n- **Potion Stacking Limits**: Due to volatile ingredients and magical residue, potions are subject to a **strict stacking limit of 10 maximum potions per inventory slot**. Trying to stack more destabilizes the container, rendering them inert. Stack potions carefully inside [Your Inventory Grid (Visual Pack System)](inventory-system/inventory-encumbrance).\n- **Elixirs vs. Potions**: Standard potions (Healing, Mana) trigger instantly, while Elixirs provide long-term buffs (e.g., Nightvision, Stoneskin) but prevent the consumption of other elixirs for 1 hour.`
            },
            {
              title: 'First Aid (Medical Interface)',
              content: `When traveling through deadly ruins, medical supplies are as valuable as gold. The **First Aid Interface** allows any character (regardless of magical ability) to treat wounds and save lives.\n\n- **Emergency Stabilization**: When an ally is in the [Dying Condition](combat-system/death-dying) (0 HP), you can spend **1 Action Point (AP)** and 1 charge of a Medical Kit to stabilize them. This stops their death saving throws instantly, returning them to 1 HP but leaving them with the [Prone](combat-system/combat-conditions) condition.\n- **Emergency Bandage Healing**: Out of combat, you can apply field dressings to heal a wounded target. This restores HP equal to 1d6 + your Wisdom modifier. Each target can only benefit from field dressings once per short rest.\n- **Medical Kits**: Basic Medical Kits contain 5 charges of bandages, splints, and salves. Advanced kits include smelling salts and anti-toxins, allowing you to cure the [Poisoned](combat-system/combat-conditions) condition with a successful First Aid check.`
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

// Build a flat search index from all rules content
const buildSearchIndex = () => {
  const index = [];
  let idCounter = 0;

  const addEntry = (entry) => {
    index.push({ id: `search-${idCounter++}`, ...entry });
  };

  const stripMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\\n/g, ' ')
      .replace(/[`>\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  for (const category of RULES_CATEGORIES) {
    // Category-level entry
    addEntry({
      categoryId: category.id,
      categoryName: category.name,
      subcategoryId: null,
      subcategoryName: null,
      sectionIndex: -1,
      sectionTitle: null,
      searchText: `${category.name} ${category.description || ''}`.toLowerCase(),
      displayTitle: category.name,
      preview: category.description || '',
      type: 'category'
    });

    for (const sub of category.subcategories) {
      // Subcategory-level entry
      const subText = `${sub.name} ${sub.summary ? sub.summary.join(' ') : ''} ${sub.content?.title || ''} ${sub.content?.description || ''}`;
      addEntry({
        categoryId: category.id,
        categoryName: category.name,
        subcategoryId: sub.id,
        subcategoryName: sub.name,
        sectionIndex: -1,
        sectionTitle: null,
        searchText: subText.toLowerCase(),
        displayTitle: sub.name,
        preview: sub.content?.description || (sub.summary ? sub.summary[0] : ''),
        type: 'subcategory'
      });

      const sections = sub.content?.sections || [];
      let validSectionIdx = 0;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section || (!section.title && !section.content)) continue;
        if (section.type === 'rotating-tips') {
          validSectionIdx++;
          continue;
        }
        const rawContent = section.content || '';
        const previewText = stripMarkdown(rawContent).slice(0, 200);
        addEntry({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          sectionIndex: validSectionIdx,
          sectionTitle: section.title || '',
          tabId: null,
          searchText: `${section.title || ''} ${rawContent}`.toLowerCase(),
          displayTitle: section.title || sub.name,
          preview: previewText,
          type: 'section'
        });
        validSectionIdx++;
      }

      // Index tabbed sections too
      const tabs = sub.content?.tabs || [];
      for (const tab of tabs) {
        if (!tab || !tab.sections) continue;
        let tabValidIdx = 0;
        for (let i = 0; i < tab.sections.length; i++) {
          const section = tab.sections[i];
          if (!section || (!section.title && !section.content)) continue;
          if (section.type === 'rotating-tips') {
            tabValidIdx++;
            continue;
          }
          const rawContent = section.content || '';
          const previewText = stripMarkdown(rawContent).slice(0, 200);
          addEntry({
            categoryId: category.id,
            categoryName: category.name,
            subcategoryId: sub.id,
            subcategoryName: sub.name,
            sectionIndex: tabValidIdx,
            sectionTitle: section.title || '',
            tabId: tab.id,
            tabName: tab.name,
            searchText: `${tab.name} ${section.title || ''} ${rawContent}`.toLowerCase(),
            displayTitle: section.title || tab.name,
            preview: previewText,
            type: 'section'
          });
          tabValidIdx++;
        }
        // Index tab tables
        if (tab.tables) {
          for (const table of tab.tables) {
            if (!table || !table.title) continue;
            addEntry({
              categoryId: category.id,
              categoryName: category.name,
              subcategoryId: sub.id,
              subcategoryName: sub.name,
              sectionIndex: -1,
              sectionTitle: table.title,
              tabId: tab.id,
              tabName: tab.name,
              searchText: `${tab.name} ${table.title} ${table.description || ''}`.toLowerCase(),
              displayTitle: table.title,
              preview: table.description || '',
              type: 'table'
            });
          }
        }
      }

      // Also index top-level table titles
      const tables = sub.content?.tables || [];
      for (let t = 0; t < tables.length; t++) {
        const table = tables[t];
        if (!table || !table.title) continue;
        addEntry({
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          sectionIndex: -1,
          sectionTitle: table.title,
          tabId: null,
          searchText: `${table.title} ${table.description || ''}`.toLowerCase(),
          displayTitle: table.title,
          preview: table.description || '',
          type: 'table'
        });
      }
    }
  }

  return index;
};

export const RULES_SEARCH_INDEX = buildSearchIndex();

// Search helper that scores and ranks results
export const searchRulesIndex = (query) => {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(t => t.length >= 2);
  if (terms.length === 0) return [];

  const scored = RULES_SEARCH_INDEX.map(entry => {
    let score = 0;
    const text = entry.searchText;
    const title = (entry.displayTitle || '').toLowerCase();

    for (const term of terms) {
      // Exact title match is highest
      if (title === term) score += 20;
      else if (title.includes(term)) score += 10;
      else if (text.includes(term)) score += 2;
    }

    // Boost exact phrase matches in content
    if (text.includes(q)) score += 5;

    // Boost sections over tables, tables over subcategories
    if (entry.type === 'section') score += 1;
    else if (entry.type === 'table') score += 0.5;

    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map(s => s.entry);
};

