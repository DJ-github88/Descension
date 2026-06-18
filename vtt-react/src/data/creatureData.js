export const BESTIARY_DATA = {
  "regions": [
    {
      "id": "frostwood-reach",
      "name": "Frostwood Reach",
      "folklore": "Germanic/Grimm + Celtic",
      "creatures": [
        {
          "id": "gref",
          "name": "Gref",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/gref.png",
          "illustrationCaption": "Gref pushing its crude cart of forgotten memories through the twilight fog",
          "role": "The memory-merchant goblin",
          "origin": "In the world of Mythrill, the Frostwood Reach was once the heartland of the Seelie Accord, a pact between ancient human settlers and the Fair Folk who wandered the twilight borders between waking and dream. When the Wyrd corruption seeped through the world's fractures, it twisted the memory-keeping traditions of the Seelie into something bittersweet. Gref is one of the many 'twilight merchants' born from this corruption—spirits that once guided lost travelers to safety, now cursed to collect fragments of mortal memory to sustain their own fading existence. In Frostwood Reach, where the sun rarely pierces the perpetual mist, the locals leave small offerings of copper and old keys at crossroads, hoping to appease the memory-merchants rather than face the empty silence of forgetting.",
          "nature": "A small, stooped goblin-like creature no taller than a child, dressed in tattered canvas that was once a shepherd's cloak. Its skin is the color of dried birch bark, and its eyes are milky white with no visible pupils—yet it sees perfectly well in the twilight gloom. Gref pushes a squeaking wooden barrow filled with rusted keys, old letters sealed with wax, and iron trinkets that once belonged to forgotten travelers. It speaks in a soft, whispering sigh that sounds like wind through autumn leaves, and it avoids physical conflict entirely, preferring to vanish into the mist when threatened.",
          "habitat": "Gref roams the misty crossroads and forest paths of the Frostwood Reach at twilight, especially near the ancient trade routes that connect the small villages of Drunhold and the Grimmwood. It is drawn to places where strong emotions have been felt—graveyards, abandoned campsites, and the thresholds of homes where someone has recently departed. The locals know that if Gref appears at your door, it means someone in the household has forgotten something important, and the spirit has come to trade it back.",
          "combat": "75 HP. Flees if attacked. Memory Trade (requires a DC 13 SPI save or target loses one small memory, granting Gref full evasion for 3 rounds). Release Faces (if its barrow is overturned, releases trapped memories that dazzle and confuse all targets in a 15-ft radius for 1 round).",
          "stats": {
            "strength": 8,
            "agility": 14,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 75,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "wyrd": 50
            }
          },
          "depth": "Gref is entirely peaceful, but its existence is a tragic one. It only seeks to return lost objects to those who can recall their significance, feeding on the emotional energy of the recalled memory. Without these memories, Gref and its kind would fade into the mist forever, becoming nothing more than the whispers that travelers sometimes hear on the wind. The memory-merchants are a reminder that in the Frostwood, even forgetting has a price, and the Wyrd corruption has turned something once beautiful into a cycle of gentle exploitation.",
          "hooks": [
            "A merchant's son traded his name to Gref for a brass locket. The party must locate Gref and trade a memory of equal weight to recover the boy's identity.",
            "Gref knows the exact location of a path that disappeared from the woods. To buy the memory of this path, the party must trade a memory of their greatest regret."
          ],
          "heritage": "Formed as a coping mechanism for early settlers dealing with the slow tragedy of dementia, Gref's lore originally rationalized why elders forgot their family histories, imagining their memories were collected by a quiet twilight merchant. When the Wyrd seeped into Frostwood Reach, it reacted to the collective grief of families watching their loved ones fade, physically manifesting this memory-merchant to wander the crossroads and literally trade in lost thoughts."
        },
        {
          "id": "oillipheist",
          "name": "Oilliphéist",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/oillipheist.png",
          "illustrationCaption": "An Oilliphéist coiled in a dark peat-pool, its mossy skin glistening under the cold stars",
          "role": "The silt-leech serpent",
          "origin": "The Oillipheist is a creature born from the fusion of ancient Irish water-dragon myths and the cold reality of the Frostwood Reach's peat-bogs. In the Age of the First Fae, the great serpents of the Oillipheist kind were guardians of sacred rivers, their scales gleaming with the light of the setting sun. When the Wyrd broke the world's boundaries, the Frostwood's endless cold and darkness twisted these noble guardians into blind, segmented eels that lurk in the stagnant pools, their once-magnificent forms reduced to something primal and hungering. The Drun fishermen speak of the 'silt-serpents' as cursed spirits of those who drowned in the bogs during the Long Winter, their bodies fused with the peat and moss to become something that is neither living nor dead.",
          "nature": "A blind, segmented eel-serpent approximately six feet long, its body composed of river-silt, rotting green moss, and the fossilized remains of ancient bog-plants. It lacks eyes entirely, navigating by sensing vibrations and blood-heat through the water with specialized sensory organs along its flanks. Its mouth is a circular maw ringed with tiny, needle-like teeth that can grip with the strength of a spring-trap. When submerged, it is nearly invisible, its silt-colored body blending perfectly with the dark peat-water. The creature emits a low, thrumming vibration that can be felt through the soles of boots before it strikes.",
          "habitat": "The Oillipheist haunts the stagnant peat-pools and boggy rivers of the Frostwood Reach, particularly in the Siltmire Flats where the ancient peat has turned the water into a thick, black soup. It prefers pools where the water is deep enough to hide its full length but shallow enough to trap prey. During the rare warm months, the serpents become sluggish and retreat to the deepest pools, but in the winter they grow aggressive, driven by the need to store fat for the long cold.",
          "combat": "380 HP. Silt Grasp (melee, +5 to hit, DC 13 AGI save or grappled and pulled into difficult swamp water). Blood Drain (deals 1d8+3 physical damage to a grappled target each round and heals the serpent for the same amount). Blind-sense (immune to blindness effects). Vulnerable to ember.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 14,
            "intelligence": 4,
            "spirit": 12,
            "charisma": 4,
            "maxHp": 380,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "rime": 50
            }
          },
          "depth": "They are simple, instinct-driven predators that keep the swamp waters free of bloated carcasses, feeding on anything that disturbs their pool. The Wyrd's corruption did not grant them malice, only hunger. Some scholars believe that the Oillipheist's blindness is a mercy—that if they could see the world they now inhabit, they would die of sorrow. The silt that makes up their bodies is the same silt that preserves the bodies of ancient warriors in the bogs, and there are tales of serpents that have swallowed bones whole, carrying the memories of the dead in their bellies.",
          "hooks": [
            "A local fisher went to harvest bog-iron and never returned; his empty rowboat is floating in an Oilliphéist's pool.",
            "Drun alchemists need the vibration-sensitive hide of an Oilliphéist to craft dowsing tools that can locate pure underground water."
          ],
          "heritage": "Born from the primal fear of drowning, the Oilliphéist began as a strict parental warning to terrify children away from playing near the deep, deceptive peat-pools of the Siltmire Flats. The Wyrd anomaly consolidated centuries of parental anxiety and the human dread of the dark, suffocating depths, pulling this blind, silt-leech serpent straight out of the warning stories and into the bog waters."
        },
        {
          "id": "grimmstalk",
          "name": "Grimmstalk",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/grimmstalk.png",
          "illustrationCaption": "A Grimmstalk dryad standing silently on a gnarled branch, its hollow skull-head baring hollow eyes",
          "role": "The feather-skull dryad",
          "origin": "The Grimmstalks are the forest's grief given form. In the deep history of the Frostwood Reach, before the first human axe touched the ironwood trees, the forest was home to a race of dryads who sang to the trees and kept them healthy through the long winters. When the Wyrd descended, the forest's pain at the loss of so many trees to logging and the relentless cold coalesced into the Grimmstalks—dark, wood-plated guardians who carry the skulls of the birds that once nested in the highest branches. They are not the dryads of old, but something born from the forest's desire for vengeance and protection. The loggers of Frostwood call them 'the hollow watchers' and know that to cut a tree marked with a Grimmstalk's sigil is to invite death from above.",
          "nature": "A tall, wood-plated humanoid sprite standing nearly seven feet tall, its bark-like plates fitting together like natural armor. Its head is a hollow bird-skull, inside which beats a mass of dark, rustling black feathers that create a sound like dry leaves in a windstorm. The plates of its body are made of ironwood bark, harder than steel and etched with the natural runes of the forest. It moves silently through the high canopy, its long limbs allowing it to swing between branches with the grace of an ape. When it speaks, the sound is a hollow, wind-like whistling made by forcing air through its skull-head, a warning to woodcutters before it attacks.",
          "habitat": "The Grimmstalks dwell exclusively in the highest branches of the oldest ironwood and pine trees in the Frostwood Reach, particularly in the Grimmwood Proper where the trees have stood for ten thousand years. They never touch the ground if they can avoid it, and their territory is marked by small piles of bird bones at the base of the trees they guard. They are most active during the spring, when the sap runs and the trees are most vulnerable to cutting, and during the autumn, when the falling leaves make the forest floor noisy enough to mask their approach.",
          "combat": "250 HP. Skull Stare (ranged, DC 14 SPI save or paralyzed with terror for 1 round). Feather Slash (melee, 2d8+5 slashing, reach 10 ft). Canopy Jump (teleports 40 ft between trees for 1 AP, avoiding opportunity attacks). Vulnerable to ember.",
          "stats": {
            "strength": 16,
            "agility": 18,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 250,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 35,
            "resistances": {
              "physical": 50
            }
          },
          "depth": "A strict and reclusive forest protector, the Grimmstalk is not evil but uncompromising. It communicates with the forest through the roots of the trees, feeling the pain of every cut and the joy of every new growth. The black feathers inside its skull are said to be the spirits of the birds that once sang in the forest's canopy, and when a Grimmstalk dies, the feathers scatter to the wind, carrying the forest's song to new trees. The Wyrd's corruption gave the forest a voice of anger, but the Grimmstalks remember the songs of joy, and some say that if the forest is ever healed, they will sing again.",
          "hooks": [
            "A logging crew is trapped inside their cabin because a Grimmstalk has claimed the surrounding trees, killing anyone who steps outside with their axe.",
            "The black feathers inside a Grimmstalk's skull are highly prized by wizards; they can be woven into a cloak that grants absolute silence."
          ],
          "heritage": "Coalesced from the heavy guilt of early human builders who cleared ancient groves, the Grimmstalk was a forest myth created to warn woodcutters of nature's vengeance. The Wyrd anomaly crystallized the local loggers' quiet shame of environmental destruction and the fear of getting lost in the silent Grimmwood, shaping their anxiety into a physical, feather-skulled dryad that actively guards the ironwood canopy."
        },
        {
          "id": "pooka",
          "name": "Pooka",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/pooka.png",
          "illustrationCaption": "A sleek charcoal Pooka sitting quietly in the brambles, its human-like eyes glinting",
          "role": "The shape-shifting fey trickster",
          "origin": "The Pooka is a creature as old as the paths of the Frostwood Reach itself. In the time before the Wyrd, when the Fair Folk walked openly among mortals, the Pooka were the guardians of the hedgerows and wild places, spirits of the untamed land that delighted in playing harmless pranks on travelers. The corruption of the Wyrd did not change their nature, but it did sharpen their sense of irony—now, the Pooka's tricks often carry a lesson, a warning, or a test of character. The farmers of the Frostwood know that a Pooka in the field means the harvest will be unpredictable, and they leave bowls of milk at the field's edge to ensure the spirit's goodwill. The Pooka is a reminder that even in a world of corruption, some things remain playful and free.",
          "nature": "A sleek, charcoal-grey fey creature resembling a large hare with long, deer-like ears that can rotate independently to catch sounds from any direction. Its eyes are human-like, gleaming with intelligence and a hint of mischief, and its legs end in tiny hooves that make a soft clicking sound on stone. It can shift into a small wild pony at will, a form it uses to offer rides to travelers before bolting wildly and dropping them in peat-pools or briar patches. Its fur is always slightly damp, even in the driest weather, and it smells of crushed clover and rain.",
          "habitat": "Pookas inhabit the brambles, forest paths, and country lane hedges of the Frostwood Reach, particularly in the borderlands between the cultivated fields and the wild forest. They are drawn to places where the wild and the tame meet—abandoned orchards, overgrown hedgerows, and the edges of villages where the cobblestones give way to dirt. They are most active during the twilight hours and on moonless nights, when their dark fur makes them nearly invisible.",
          "combat": "130 HP. Shift Form (1 AP, shapeshifts into a small pony to double its speed). Distract (ranged, DC 13 SPI save or target is distracted by sudden shifts, giving Pooka evasion). Hoof Kick (2d6+2 physical damage). Vulnerable to iron.",
          "stats": {
            "strength": 10,
            "agility": 18,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 45,
            "resistances": {
              "wyrd": 50
            }
          },
          "depth": "Pookas are not inherently malicious, but they love causing confusion. They often offer rides to travelers, only to run wildly and drop them in peat-pools, teaching the lesson that one should not trust every friendly offer. The Pooka's tricks are never fatal, but they are always humiliating. Some sages believe that the Pooka is testing the character of mortals, separating the humble from the proud, and that those who laugh at their misfortune are blessed with good luck for the rest of their journey.",
          "hooks": [
            "A traveler's mount has been stolen and replaced by a Pooka that refuses to leave. The party must trick the spirit into revealing its true form.",
            "A local farmer's crop was ruined overnight; the villagers blame a Pooka and ask the party to bargain with it for better fortune."
          ],
          "heritage": "Originally a moral test of character, the Pooka was spun from travelers' campfire tales of shape-shifting spirits that punished the proud and rewarded the humble. When the Wyrd infested the borderlands of Frostwood Reach, it reacted directly to the shared anxieties of local farmers, giving physical form to a mischievous fey trickster that plays pranks to humiliate travelers in the briar patches."
        },
        {
          "id": "wolpertinger",
          "name": "Wolpertinger",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/wolpertinger.png",
          "illustrationCaption": "A small Wolpertinger fey hare with antlers and wings, sitting on a mossy log",
          "role": "The horned fey hare",
          "origin": "The Wolpertinger is a creature of the Alpine highlands, born from the mingling of fey magic and the harsh reality of mountain life. In the Frostwood Reach, where the alpine forests meet the perpetual mist, the Wolpertingers are the spirits of the forest's lost children—creatures that are too small to be predators and too magical to be prey. The old hunters of the Reach tell stories of the Wolpertinger as a messenger of the mountain gods, a creature that appears to those who are lost in the fog to guide them back to the path. The Wyrd's corruption has made them shy and elusive, but it has not dimmed their curiosity. A Wolpertinger that visits a camp is considered a sign of good fortune, though the creature will almost certainly steal something small as a souvenir.",
          "nature": "A small fey creature resembling a golden-furred hare, but possessing tiny roe deer antlers on its forehead and colorful pheasant wings on its back. Its fur is the color of autumn leaves, and its eyes are large and amber, reflecting light like a cat's. Highly elusive and mischievous, it uses its wings for short gliding leaps to escape predators, and its antlers contain traces of fey mana that can be used in alchemical preparations. It is known to steal small items from campfires—buttons, coins, and pieces of string—taking them back to its nest in the high pine branches.",
          "habitat": "The Wolpertinger lives in the alpine pine forests and misty mossy logs of the Frostwood Reach, particularly in the high elevations where the air is thin and the fog never clears. It builds its nests in the hollows of ancient pines, lining them with stolen trinkets and the soft needles of the forest floor. It is most active during the early morning, when the mist is thickest and the forest is quiet, and it can often be seen sitting on a mossy log, preening its wings with its tiny paws.",
          "combat": "45 HP. Cannot deal direct damage. Antler Prod (+4 to hit, 1d4 physical). Gliding Leap (can fly/glide up to 30 ft for 1 AP, avoiding opportunity attacks). Camouflage (+5 to stealth in forest foliage). Vulnerable to iron.",
          "stats": {
            "strength": 4,
            "agility": 18,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 12,
            "maxHp": 45,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 40,
            "resistances": {
              "wyrd": 25
            }
          },
          "depth": "Shy and generally harmless, but highly prized by alchemists for their antlers, which contain traces of fey mana. The Wolpertinger's nests are said to be treasure troves of lost items, and some hunters seek them out not to kill the creature, but to trade with it. The Wyrd's corruption has made the Wolpertinger more cautious, but it has also given the creature a strange wisdom—some say that if you can catch a Wolpertinger and hold it gently, it will whisper a secret of the forest in your ear.",
          "hooks": [
            "A Wolpertinger stole a wizard's spell component pouch. Retrieve the pouch from its nest in the high pine branches.",
            "An alchemist wants to study the antlers of a live Wolpertinger to craft a potion of flight."
          ],
          "heritage": "Spun from alpine hunters' stories of magical woodland guides, the Wolpertinger was created to explain how lost travelers sometimes found their way home in the thick fog. The Wyrd anomaly synthesized this hopeful superstition and the hunters' desire for good fortune, materializing the horned fey hare as a real, magic-attuned creature nesting in the high pine branches."
        },
        {
          "id": "schratling",
          "name": "Schratling",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/schratling.png",
          "illustrationCaption": "A small Schratling coated in forest moss, holding stolen journal pages",
          "role": "Schrat",
          "origin": "Rooted in the ancient Germanic folklore of the Schrat—a reclusive, moss-clad tree-dweller—and the Celtic traditions of the helpful yet temperamental Brownie or Urisk, this sprite has found a strange sanctuary in the fog-choked woods of Frostwood Reach. While its folklore ancestors moved household items or worked in secret for a bowl of cream, this spirit is drawn to the written word, manifesting as a bizarre helper that haunts the margins of mortal records.",
          "nature": "Standing no taller than a child's knee, this hunched sprite is wrapped head-to-toe in living ironwood moss, its mottled grey-green skin resembling weathered bark with tiny mushrooms sprouting from its shoulders. It wears a makeshift loincloth stitched from stolen journal pages, whose memory-records are gradually weathered into illegibility. Its oversized, calloused hands are stained permanently with dark peat-ink, and its squashed, lichen-draped face is dominated by warm, amber eyes like old tallow candles that blink perpetually.",
          "habitat": "These elusive sprites make their homes in the damp, moss-draped hollows of the ironwood forests, occasionally wandering into the drafty cellars and quiet corners of Greymark's settlements.",
          "combat": "75 HP. Compulsive Scribe (passive: cannot read, but compulsively rewrites any text within 10 ft, DC 12 SPI to resist). Peat-Ink Spit (ranged, +3 to hit, 1d4 psychic, target loses 1 trivial memory). Moss-Camouflage (+4 to stealth in forest). Vulnerable to fire.",
          "stats": {
            "strength": 8,
            "agility": 14,
            "constitution": 10,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 12,
            "maxHp": 75,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "Driven by a strange, compulsive obsession, Schratlings sneak into Greymark homes at night to organize and rewrite journal entries in messy peat-ink scribbles; though they cannot read, they compulsively alter the family lineage-logs. In the deep woods, they weave shredded memory-glass into their hollow nests, creating pocket sanctuaries where the memory-draining fog cannot penetrate, drawing the desperate Unwoven Mimir who seek these nests to recall their lost lives. Adventurers often venture into the misty hollows following rumors of these creatures, hoping to recover their memory-glass nests or gather components for powerful wards.",
          "hooks": [
            "A town scribe woke to find a Schratling had rewritten the village land registry. Find the sprite's hollow to reclaim the correct records.",
            "An old Mimir seeks the peat-nest of a Schratling to recover a specific childhood memory sealed within."
          ],
          "description": "A knee-high forest sprite coated in moss and stained with peat-ink, obsessed with the physical act of writing.",
          "heritage": "Born from the scribes' and record-keepers' dread of losing historical logs, the Schratling was a household myth created to explain misplaced documents and ink stains. When the Wyrd anomaly seeped into Greymark, it reacted to the families' anxiety over preserving their lineage-logs, physically manifesting this mossy, peat-ink-stained sprite to sneak into cellars and obsessively rewrite records."
        },
        {
          "id": "alraune",
          "name": "Alraune",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/alraune.png",
          "illustrationCaption": "A hand-drawn bestiary sketch of the Alraune, its cracked porcelain face weeping ink",
          "role": "The screaming root-child",
          "origin": "Formed from a Wyrd-corrupted fusion of the Celtic Changeling (the fairy double left in place of a stolen human child) and the Germanic Mandrake (the screaming root born from the blood of the hanged). It resides in the dark bogs of the Frostwood Reach.",
          "nature": "A life-sized wooden child's doll with a cracked, expressionless porcelain face. Gnarled mandrake roots sprout from its head like hair, and its hollow chest contains a pale blue wisp of light. It crawls on jointed limbs, weeping black ink from its empty eye sockets and mimicking the desperate cries of a human infant.",
          "habitat": "Damp bogs, hollow trees, and muddy crossroads in the Frostwood Reach.",
          "combat": "220 HP. Sorrow-Cry (AoE 30 ft, DC 14 SPI save or targets are dazed by grief and must move toward the doll for 1 AP). Root-Grip (+6 to hit, 2d8+4 physical, DC 14 CON save or grappled by roots). Ink-Spray (ranged 30 ft, DC 14 AGI save or blinded by black ink for 1 round). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 16,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 14,
            "maxHp": 220,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 50,
              "poison": 100
            }
          },
          "depth": "The Alraune mimics baby cries to lure parents and travelers. Mechanical quirk: it is terrified of raw salt. If a traveler scatters salt around themselves, the Changeling cannot approach within 10 feet. If fed a memory of deep grief, it becomes docile for 24 hours.",
          "hooks": [
            "A local mother claims her child was swapped with a wooden doll that weeps ink.",
            "A traveler seeks someone to retrieve their childhood memories from a Changeling's root-hair."
          ],
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Alraune originally served as a way for the community to rationalize the forces described in local tales: \"Formed from a Wyrd-corrupted fusion of the Celtic Changeling (the fairy double left in place of a stolen human child) and the Germanic Mandrake (the screaming root born from the blood of the hanged).\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It resides in the dark bogs of the Frostwood Reach."
        },
        {
          "id": "drudehaunt",
          "name": "Drudehaunt",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/drudehaunt.png",
          "illustrationCaption": "A Drudehaunt draped in fog-shrouds, holding her washbasin of dark memory-water",
          "role": "Drude/Alp",
          "origin": "Born from the Germanic legends of the Drude, a nightmare spirit that paralyzes the sleeping, and the Celtic Bean Nighe, the ghostly washerwoman of death, the Drudehaunt embodies the tragic fate of bitter souls lost to the fog. In the setting of Frostwood Reach, they manifest as spectral omens who wash away the identities of the living.",
          "nature": "Appearing as a gaunt, hovering female silhouette, the Drudehaunt is wrapped in a shifting shawl of woven grey fog that continuously re-forms from the ambient mist, leaving her outlines blurred. She carries a translucent washbasin containing dark, memory-infused water, and her hollow-cheeked face features storm-filled grey eyes, with her mouth tightly sewn shut using spider-silk and bookbinder's thread.",
          "habitat": "These spirits hover near mist-shrouded river crossings and damp forest hollows by day, slipping into settlements and tents under the cover of night.",
          "combat": "380 HP. Fog-Shroud (passive: continuously blurred, ranged attacks against her have disadvantage). Nightmare-Seal (targets a sleeping creature, DC 14 SPI save or paralyzed in nightmare; loses 3 memories on waking, dealing 2d8 psychic). Washbasin-Stare (AoE 15 ft, DC 13 SPI save or frightened for 3 rounds). Omen-Sight (passive: any creature that sees her washing loses a significant memory within 3 days). Vulnerable to radiant.",
          "stats": {
            "strength": 8,
            "agility": 14,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 380,
            "maxMana": 50,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "At night, a Drudehaunt will rest heavily on the chests of sleeping scribes to consume their dreams, forcing them to relive every memory they have lost before draining new ones from their minds. By day, they wash the garments of the doomed in their ink-black basins; witnessing this act serves as a dire omen, ensuring the viewer will lose a precious memory within three days. Rumors of these spirits send waves of dread through Greymark, and adventurers are often tasked with banishing them or recovering their memory-water basins.",
          "hooks": [
            "A town leader has fallen into a deep coma, visited nightly by a Drudehaunt. Enter the leader's dream to sever the entity's thread.",
            "A Drudehaunt has been spotted washing a bloody coat at the river crossing. The villagers fear it belongs to the missing high priest."
          ],
          "description": "A spectral woman floating in the fog, bringing suffocating nightmares by night and washing away memories at river crossings by day.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Drudehaunt originally served as a way for the community to rationalize the forces described in local tales: \"Born from the Germanic legends of the Drude, a nightmare spirit that paralyzes the sleeping, and the Celtic Bean Nighe, the ghostly washerwoman of death, the Drudehaunt embodies the tragic fate of bitter souls lost to the fog.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: In the setting of Frostwood Reach, they manifest as spectral omens who wash away the identities of the living."
        },
        {
          "id": "koboldknock",
          "name": "Koboldknock",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/koboldknock.png",
          "illustrationCaption": "A Koboldknock standing on a root, holding its double-headed wooden mallet",
          "role": "Kobold",
          "origin": "A creature born of the German Kobold and the Celtic Tommyknocker, this subterranean guardian dwells in the deep root-tunnels of the Frostwood. Representing the spirit of the earth, it rewards respectful miners and punishes those who dare mock its work.",
          "nature": "This two-foot-tall, barrel-chested humanoid possesses dark skin resembling polished ironwood heartwood, complete with dense grain rings. It carries a small mallet carved from a petrified wood knot, and its elongated fingers end in chisel-like nails that click rhythmically against the stone. Its craggy, bearded face has wide, yellow eyes that glow in the dark, and its grin reveals flat, stone teeth.",
          "habitat": "It dwells within the ironwood root-caverns and deep mine shafts beneath the Frostwood, far below the reach of the sun.",
          "combat": "130 HP. Coded-Tap (passive: taps walls in coded patterns; GM reveals nearby mineral veins or structural hazards). Rivet-Hammer (melee, +4 to hit, 1d6+2 bludgeoning). Fog-Seal (1 AP: hammers a crack shut, blocking fog from entering a 10-ft corridor for 1 hour). Toll-Demand (demands a copper rivet; if refused, DC 12 SPI save or one item goes missing overnight). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 130,
            "maxMana": 15,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "physical": 50
            }
          },
          "depth": "Koboldknocks tap coded messages through the stone walls, guiding clever miners to rich veins of ironwood-heart, provided they leave a copper rivet as an offering at the vein's mouth. They also serve as vital wardens against the memory-fog, sensing its encroachment and hammering the cave walls to warn miners and seal off cracks before the mist can seep inside. When rumors of these spirits surface, miners seek to protect their territory, while others hire adventurers to gather their petrified mallets for their stabilizing properties.",
          "hooks": [
            "A mine was abandoned because the miners offended a Koboldknock, who responded by hammering shut the main shafts and hiding the tools.",
            "Miners seek a Koboldknock to guide them through a collapsing root-tunnel to rescue a trapped team."
          ],
          "description": "A barrel-chested mine sprite with skin like ironwood, guiding miners with rhythmic taps and guarding tunnels against the memory-fog.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Koboldknock originally served as a way for the community to rationalize the forces described in local tales: \"A creature born of the German Kobold and the Celtic Tommyknocker, this subterranean guardian dwells in the deep root-tunnels of the Frostwood.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the shared anxieties of the region's miners. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: Representing the spirit of the earth, it rewards respectful miners and punishes those who dare mock its work."
        },
        {
          "id": "erlkings_hound",
          "name": "Erlking's Hound",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/erlkings_hound.png",
          "illustrationCaption": "An Erlking's Hound standing alert, green fire burning in its eye sockets",
          "role": "Erlking/Erlkönig",
          "origin": "Steeped in the Germanic ballads of the Erlking's spectral hunt and the Celtic legends of the Cu Sith, this phantom hound is a harbinger of doom. It runs at the vanguard of the Elven King's wild procession, seeking out those whose minds have been unraveled by the deep woods.",
          "nature": "This wolf-sized hound possesses a body formed from compressed autumn leaves, ironwood bark, and dark, rolling mist. It moves with a skittering, spider-like gait on elongated legs, its leaf-coat shifting and falling only to be reabsorbed, while a collar of thorn-vines clings tightly to its neck. Its fleshless muzzle is made of dark wood with green flames burning in its hollow eyes, and its jaw can unhinge to release a bark like a splitting tree.",
          "habitat": "It stalks the thickest fog-banks and deepest, untamed reaches of the ironwood forests, running where the memory-fog is dense.",
          "combat": "145 HP. Leaf-Shift (passive: coat constantly regenerates; heals 5 HP per round in forest). Triple-Bark (3 barks over 3 rounds: Bark 1 = DC 12 SPI or frozen with terror 1 round; Bark 2 = DC 13 SPI or forget current location; Bark 3 = target voluntarily walks into deepest fog). Bark-Shriek (AoE cone 15 ft, 2d6 sonic, DC 13 CON or deafened 1 round). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 12,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 145,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "cold": 50,
              "physical": 25
            }
          },
          "depth": "Targeting the scent of failing minds, these hounds run in packs to herd disoriented travelers deeper into the mist where they can be claimed by the Erlking's hunt. When a hound marks a target with three thunderous barks, their fate is sealed unless a Briaran ranger can bribe the beast with a memory sealed inside a glass vial. Local settlements frequently post bounties for these creatures, seeking their thorn-vines and glowing wood to forge protective charms.",
          "hooks": [
            "A pack of hounds is circling the outskirts of a village, barking into the mist. The village elder's memory is fading rapidly.",
            "A Briaran ranger wants to capture a hound's green eye-fire to craft a lantern that guides travelers through the memory-fog."
          ],
          "description": "A spectral, wolf-sized hound of wood and mist that herds forgetful travelers into the depths of the forest.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Erlking's Hound originally served as a way for the community to rationalize the forces described in local tales: \"Steeped in the Germanic ballads of the Erlking's spectral hunt and the Celtic legends of the Cu Sith, this phantom hound is a harbinger of doom.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It runs at the vanguard of the Elven King's wild procession, seeking out those whose minds have been unraveled by the deep woods."
        },
        {
          "id": "nuckelmist",
          "name": "Nuckelmist",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/nuckelmist.png",
          "illustrationCaption": "A towering Nuckelmist centaur rising from the peat, yellow fog coiling around its muscles",
          "role": "Nuckelavee",
          "origin": "A horrific combination of the Celtic Nuckelavee, the skinless horse-rider fiend, and the Germanic Nebelgeist, a spirit of the blinding fog, the Nuckelmist is the ultimate dread of the Frostwood. Born of peat and decay, it represents the absolute dissolution of structure and direction.",
          "nature": "This towering centaur-like horror features a raw, muscled humanoid torso fused directly to a massive horse's back, both entirely devoid of skin so that glistening red muscle and black sinew are exposed. Veins of black peat-water pulse under its wet flesh, and its horse-half drags heavy hooves that leave trails of steaming, diseased soil, with yellow fog trailing where its mane and tail should be. The humanoid torso has a single, large head on an elongated neck, with one massive, bloodshot eye weeping black ink made of dissolved memories.",
          "habitat": "It appears only in the deepest fog-banks during heavy whiteouts, wandering the borders where the forest gives way to peat-bogs.",
          "combat": "685 HP. Path-Erasure (passive: any road or trail it walks is physically erased from the forest behind it—the spatial memory of the path is consumed). Blight-Aura (passive: 50-ft radius, all organic material rots; journal pages dissolve, wood blackens). Trample (melee, +7 to hit, 2d10+5 bludgeoning + target is knocked prone). Ink-Weep (ranged 30 ft, 3d6 psychic + DC 15 SPI save or lose one major memory). Disease-Breath (AoE cone 20 ft, DC 15 CON save or diseased: -2 to all checks for 24 hours). Vulnerable to radiant.",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 18,
            "intelligence": 6,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 685,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 40,
            "resistances": {
              "cold": 100,
              "physical": 50,
              "poison": 100
            }
          },
          "depth": "The Nuckelmist is a blight upon the land; its presence rots wood, peels ironwood bark, and dissolves the pages of journals from fifty paces away. Rather than hunting creatures for flesh, it walks along established roads and absorbs their spatial memory, causing the paths to physically vanish into the overgrown wilderness. Scribes and merchants live in terror of this entity, often recruiting powerful adventurers to hunt the beast and harvest its ink-like tears for research.",
          "hooks": [
            "The main trade route between two major towns has vanished, replaced by tangled roots. Track the Nuckelmist responsible before the towns starve.",
            "A Nuckelmist is approaching the Grand Archive. The scribes need help erecting a cold-iron barrier to protect their libraries."
          ],
          "description": "A skinless centaur-like horror of muscle and peat-water that rots journals and physically erases paths from the forest.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Nuckelmist originally served as a way for the community to rationalize the forces described in local tales: \"A horrific combination of the Celtic Nuckelavee, the skinless horse-rider fiend, and the Germanic Nebelgeist, a spirit of the blinding fog, the Nuckelmist is the ultimate dread of the Frostwood.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: Born of peat and decay, it represents the absolute dissolution of structure and direction."
        },
        {
          "id": "mossmaiden",
          "name": "Mossmaiden",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/mossmaiden.png",
          "illustrationCaption": "A Mossmaiden tending an elk herd, her green moss coat blending with the foliage",
          "role": "Moosfräulein/MossMaiden",
          "origin": "Drawing from the Moosfräulein of Germanic woodland lore and the Celtic Glaistig, the Mossmaiden is a dual-natured protector of the wild. She serves as both a gentle guide to lost travelers and a strict warden of the deep forest, balancing the preservation of nature with a thirst for mortal devotion.",
          "nature": "Lithe and graceful from the waist up, her upper body is covered in fine, velvet-soft moss that shifts from dark emerald in the wet seasons to a frosty white in the cold. Below, she possesses the muscular legs and cloven hooves of a grey-furred mountain goat. Her face is exceptionally beautiful, with birch-bark skin, high cheekbones, and pine-sap amber eyes with horizontal goat-pupils that glow in the dim mist beneath a crown of blooming ironwood flowers.",
          "habitat": "She resides in hidden, mist-draped groves and high meadows within the ironwood forests, following the seasonal movements of wild herds.",
          "combat": "155 HP. Goat-Kick (melee, +5 to hit, 2d6+3 bludgeoning, DC 13 AGI or knocked back 10 ft). Blood-Milk Bargain (special: offers a wooden cup; DC 14 SPI to resist drinking; drinker is bound to her grove for 7 years but gains +4 CON). Seasonal-Camouflage (passive: moss-skin changes color with temperature, +6 stealth in forest). Herd-Ward (passive: nearby elk/moose are alerted to danger within 100 ft). Vulnerable to fire.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 155,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "As a herd warden, the Mossmaiden protects wild elk and moose from memory-fog pockets, ensuring they retain their migration routes. She occasionally approaches lonely woodsmen at twilight to offer them a cup of sweet milk, which grants incredible physical vitality but binds them to serve in her grove for seven forgotten years. Travelers seek her out for guidance, and adventurers are sometimes hired to obtain the rare ironwood flowers from her crown.",
          "hooks": [
            "A local hunter has been missing for three years; his family spotted him tending an elk herd alongside a Mossmaiden. Free him from the bargain.",
            "A plague is affecting the forest elk. A Mossmaiden seeks the party's help to find a cure, offering a draft of her sacred milk."
          ],
          "description": "A half-woman, half-goat guardian of the forest herds, offering vitality in exchange for years of forgotten service.",
          "heritage": "Rooted in stories of lost children, the Mossmaiden myth served as a comforting explanation for infant mortality and children vanishing into the deep woods. The Wyrd anomaly acted upon this deep parental grief and the community's sorrow, synthesizing these tragic losses into gentle, moss-clad spirits that wander the forest floor tending to wounded life."
        },
        {
          "id": "fachanwatch",
          "name": "Fachanwatch",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/fachanwatch.png",
          "illustrationCaption": "A Fachanwatch giant standing motionless in a pass, holding an ironwood club",
          "role": "Fachan/Faw",
          "origin": "Inspired by the grotesque, single-limbed Fachan of Celtic myth and the mountain-guarding spirit Rübezahl of Germanic folklore, the Fachanwatch is a stoic arbiter of the high passes. It judges the character and honesty of those who walk the high roads, acting as a living boundary.",
          "nature": "This squat, eight-foot-tall giant possesses a deformed torso with exactly one single colossal arm growing directly from the center of its chest, balanced on two sturdy, elephantine legs. Its skin is a rough, granite-grey stone studded with ironwood splinters, and its central arm swings a petrified ironwood trunk as a club. Its face features one large agate-like eye centered above the arm, a curled leaf-like ear, and half a mouth with three stone teeth, from which it speaks in a resonant baritone.",
          "habitat": "It stands sentinel in the narrow, rocky passes and high mountain trails that wind through the Frostwood peaks.",
          "combat": "220 HP. Ironwood-Club (melee, reach 10 ft, +6 to hit, 2d8+5 bludgeoning, DC 14 CON or stunned 1 round). Truth-Demand (special: blocks a mountain pass; each traveler must speak one genuine personal truth; liars are hurled into the ravine, DC 15 AGI to survive the fall). Fog-Anchor (passive: spatial memory is stabilized in 100-ft radius; fog cannot erase paths while it lives). Balanced-stance (immune to knockback, prone, and shove effects). Vulnerable to psychic.",
          "stats": {
            "strength": 18,
            "agility": 10,
            "constitution": 18,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "physical": 50
            }
          },
          "depth": "The Fachanwatch guards mountain passes, remaining motionless for decades and demanding a deep, personal truth from travelers before granting passage; those who lie are cast into the abyss. Its very presence acts as a spatial anchor that prevents the memory-fog from erasing trails, making them highly valued by road-builders who leave carved truth-stones to court their favor. Guilds often hire adventurers to negotiate with these giants or acquire fragments of their petrified clubs to stabilize trade paths.",
          "hooks": [
            "A caravan is stuck at the high pass because the Fachanwatch has deemed their leader's truths to be lies. Mediate the dispute.",
            "A Fachanwatch was injured by a shadow beast, causing the surrounding pass to dissolve into the fog. Cleanse the beast and heal the giant."
          ],
          "description": "A two-legged, one-armed stone giant guarding mountain passes, demanding absolute truths to anchor the paths against the fog.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Fachanwatch originally served as a way for the community to rationalize the forces described in local tales: \"Inspired by the grotesque, single-limbed Fachan of Celtic myth and the mountain-guarding spirit Rübezahl of Germanic folklore, the Fachanwatch is a stoic arbiter of the high passes.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It judges the character and honesty of those who walk the high roads, acting as a living boundary."
        },
        {
          "id": "knockbrew",
          "name": "Knockbrew",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/knockbrew.png",
          "illustrationCaption": "A pot-bellied Knockbrew tending a mead cask in a tavern cellar",
          "role": "Weinschrat/WineSprite",
          "origin": "Born from the Germanic Weinschrat, a mischievous sprite of the vineyards, and the Celtic Clurichaun, the surly defender of wine cellars, the Knockbrew has adapted to the cold taverns of Frostwood Reach. It acts as both a protector of brewers and a distiller of the region's lost thoughts.",
          "nature": "This two-foot-tall, pot-bellied sprite features a flushed, cheerful face with rosy cheeks and bloodshot eyes that gleam with intelligence, and its grin reveals iron teeth filed to look like corks. It wears a leather apron stained with pine-tar and berry-juice, carries a cooper's hammer on its belt, and walks in curly-toed boots made from shaved journal-covers. A swollen, purple-veined nose dominates its face, and it is rarely seen without its tiny, self-filling metal cup.",
          "habitat": "It infests the damp, dark cellars of Greymark taverns and the deep fermentation chambers of frost-mead brewers.",
          "combat": "45 HP. Cork-Tooth Bite (melee, +3 to hit, 1d4 bludgeoning). Forget-Mead (special: offers a cup; drinker loses memory of the last hour per sip, or a full day per cup; DC 12 SPI to resist). Cask-Tending (passive: any alcohol it tends never spoils or freezes). Vulnerable to iron.",
          "stats": {
            "strength": 6,
            "agility": 14,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 14,
            "maxHp": 45,
            "maxMana": 5,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "Knockbrews tend tavern cellars, keeping casks of pine-oil and frost-mead from spoiling or freezing in the brutal cold. They also gather the damp, fog-dissolved memories that settle in dark corners and ferment them into a potent, cloudy liquor known as forget-mead, which can erase hours of memory with a single sip. This brew is highly valued as an anesthetic by Unwoven Mimir, who frequently employ adventurers to track down elusive Knockbrews for their unique fermenting tools.",
          "hooks": [
            "A tavern owner's supply of mead is disappearing. The resident Knockbrew is unhappy because they stopped leaving him a thimble of cream.",
            "An alchemist wants to retrieve a cask of 'forget-mead' from a wild Knockbrew colony to create a draft of total oblivion."
          ],
          "description": "A pot-bellied cellar sprite that ferments lost memories into forget-mead and prevents tavern casks from freezing.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Knockbrew originally served as a way for the community to rationalize the forces described in local tales: \"Born from the Germanic Weinschrat, a mischievous sprite of the vineyards, and the Celtic Clurichaun, the surly defender of wine cellars, the Knockbrew has adapted to the cold taverns of Frostwood Reach.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It acts as both a protector of brewers and a distiller of the region's lost thoughts."
        },
        {
          "id": "moorboggle",
          "name": "Moorboggle",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/moorboggle.png",
          "illustrationCaption": "A Moorboggle sliding through peat mud, its yellow eyes glowing in the dark",
          "role": "Boggart",
          "origin": "Drawing from the Germanic Boggart, a stubborn household pest, and the darker bog-dwelling Celtic Púca, the Moorboggle is a parasitic spirit of the marshy borders. It attaches itself to mortal dwellings, thriving on the decay of family heritage and domestic peace.",
          "nature": "This dog-sized, amorphous mass of compressed peat and dark mist has no fixed shape, shifting easily between humanoid, beastly, and shadowy forms. It emits a strong sulfurous smell, and bits of swallowed debris like keys and journal-scraps float in its dark body, which features no face except for two yellow pinpoint eyes that can move anywhere. When speaking, a mouth opens like a wound in its surface, showing a throat filled with thick bog-mud.",
          "habitat": "It lives in the soggy bogs and peat-mires of the Frostwood, frequently creeping into nearby villages to infest human homes.",
          "combat": "105 HP. Amorphous (passive: immune to grapple, prone, and critical hits; can squeeze through any gap). Eye-Shift (1 AP: moves its two yellow eyes anywhere on its body; cannot be flanked). Memory-Drain (passive: 10-ft radius, DC 13 SPI each round or lose one minor memory; a household infested loses 3 generations of history per winter). Sinkhole (special: opens a temporary bog-sinkhole, DC 14 AGI or swallowed into a subterranean bog-pocket; escape requires DC 15 STR). Vulnerable to cold iron (iron weapons deal double damage).",
          "stats": {
            "strength": 14,
            "agility": 12,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 105,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "physical": 50,
              "cold": 25
            }
          },
          "depth": "Moorboggles act as household parasites, draining memory-energy from the inhabitants and causing their family journals to dissolve rapidly over the winter. If cornered, they can open sinkholes in the peat to drag their pursuers into subterranean bog-pockets where they are easily drowned. Homeowners hang cold-iron horseshoes above their doors to disrupt the creature's memory-draining abilities, and often hire adventurers to purge these persistent pests from their cellars.",
          "hooks": [
            "A manor house's lineage-tapestry has completely blanked out. The family suspects a Moorboggle is nesting in the cellar peat.",
            "Traversing the Siltmire requires crossing a Moorboggle breeding ground. Secure enough cold-iron rods to ward them off."
          ],
          "description": "An amorphous, dog-sized parasite of peat and fog that infests homes to drain family history and drags enemies into sinkholes.",
          "heritage": "Spun from the dread of damp rot and decaying homesteads, the Moorboggle was a domestic myth to explain the slow crumbling of old family estates. The Wyrd anomaly reacted to the inhabitants' fear of losing their family heritage and domestic peace, physically manifesting this parasitic marsh spirit to hasten the decay of structural timber and family ties."
        },
        {
          "id": "banshrond",
          "name": "Banshrond",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/banshrond.png",
          "illustrationCaption": "A Banshrond standing in the mist, her银hair trailing like coiling fog",
          "role": "Banshee/Bean SÃ­dhe",
          "origin": "Born from the Celtic Banshee, whose wail foretells physical death, and the Germanic Hollergeist, which mimics familiar voices to lead travelers to their doom, the Banshrond is a phantom of mental dissolution. She wanders the margins of the forest, mourning the death of lineage and recollection.",
          "nature": "This impossibly tall, slender spirit appears draped in tattered fog-shrouds woven from the ghost-pages of dissolved journals, with faint, shifting text visible in the cloth. She stands at the forest edges, combing her ankle-length silver hair with a comb carved from a rib-bone as tears of liquid memory-glass fall and shatter at her feet. Her pale, drawn face features deep hollows around the eyes and a mouth frozen in a silent, screaming circle.",
          "habitat": "She haunts the quiet borders of fog-clearings and the outskirts of Greymark settlements.",
          "combat": "240 HP. Memory-Keen (AoE 60 ft, DC 14 SPI or 3d6 psychic + one party member loses a significant memory). Tear-Glass (ranged 30 ft, 2d6 psychic + target is slowed for 2 rounds). Comb-Bargain (special: trades her bone-comb for a genuine childhood memory; the comb parts fog in a 30-ft corridor for 1 hour). Shroud-Weave (passive: ghost-pages swirl around her; ranged attacks have 50% miss chance). Vulnerable to radiant.",
          "stats": {
            "strength": 8,
            "agility": 14,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 240,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "The Banshrond's wail foretells the complete erasure of an elder's memory within seven days, prompting families to desperately transcribe their lineage before all is lost. She carries a bone-comb that can part the memory-fog, which she will trade only for a genuine childhood memory to weave into her shroud. Scribes often employ adventurers to seek out these spirits to bargain for the comb or to prevent the memory-death of a vital elder.",
          "hooks": [
            "A Banshrond has started keening outside the castle walls. The duke's memories are fading rapidly, threatening the succession.",
            "To save a group of travelers lost in the lantern-fog, the party must seek the Banshrond and trade a memory for her bone-comb."
          ],
          "description": "A tall spectral woman in shrouds of dissolved journals whose wail heralds the total erasure of an elder's memory.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Banshrond originally served as a way for the community to rationalize the forces described in local tales: \"Born from the Celtic Banshee, whose wail foretells physical death, and the Germanic Hollergeist, which mimics familiar voices to lead travelers to their doom, the Banshrond is a phantom of mental dissolution.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the shared anxieties of the region's travelers. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: She wanders the margins of the forest, mourning the death of lineage and recollection."
        },
        {
          "id": "sluagh",
          "name": "Sluagh",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/sluagh.png",
          "illustrationCaption": "A hand-drawn field sketch of a Sluagh of shadow-crows near a gibbet",
          "role": "The memory-eating phantom swarm",
          "origin": "Formed from the collective regrets and final memories of those executed at the Frostwood Reach crossroads. It represents the ultimate terror of losing one's identity to the Gallow-Wyrd.",
          "nature": "A swirling vortex of spectral ravens with glowing emerald eyes. Their wings sound like rustling parchment and clashing iron chains, and they drip dark, ink-like shadow vapor as they hunt.",
          "habitat": "Ancient crossroads, execution hills, and misty ravines in Frostwood Reach.",
          "combat": "220 HP. Swarm (passive: immune to grapple, prone, and single-target physical attacks; can occupy another creature's space). Memory Peck (melee, +5 to hit, 2d6 psychic damage + DC 13 SPI save or target forgets their name, becoming dazed for 1 AP). Ash Veil (passive: creatures starting their turn in the swarm's space are blinded by ash and soot). Vulnerable to fire.",
          "stats": {
            "strength": 6,
            "agility": 16,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 220,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 35,
            "resistances": {
              "wyrd": 50
            }
          },
          "depth": "The Sluagh circles gibbets and crossroads. It speaks in a chorus of whispered last confessions. Narrative quirk: it acts as a gatekeeper of secrets. If a traveler tells the swarm a dark secret they have never told anyone else, the swarm guides them safely through the fog. If they lie, the ravens descend to steal their tongue.",
          "hooks": [
            "A thief seeks to recover the location of hidden gold by whispering a confession to a Sluagh.",
            "A village is terrorized by a swarm that whispers the villagers' secrets at night."
          ],
          "heritage": "Rooted in the fear of dying alone and forgotten, the Sluagh originally rationalized the howling winter winds as a host of restless spirits seeking companionship. The Wyrd anomaly materialized this collective dread of lonely deaths, shaping the rumors of the restless dead into a tangible, flying host that sweeps through the forest canopy to claim fading souls."
        },
        {
          "id": "wildejagd",
          "name": "Sluagh",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/wildejagd.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Sluagh",
          "role": "Sluagh",
          "origin": "Descending from the Celtic Sluagh, the host of the restless dead, and the Germanic Wild Hunt or Wütende Heer, this phantom ridership is a collective manifestation of the forgotten. It represents the ultimate terror of historical erasure, riding through the sky to claim the names of the living.",
          "nature": "This entity is a massive, undulating cloud composed of dozens of twisted, wraith-like riders fused together, moving in sudden, coordinated formations like a flock of starlings. It trails shreds of paper and ink droplets that fall like black snow, accompanied by the spectral sound of horse hooves echoing like slamming doors. Dozens of pale, screaming mouths open and close across its surface, each whispering the names of forgotten ancestors whose records were eaten by the fog.",
          "habitat": "It rides through the night skies during dense fog-storms, circling high above archive towers and fading settlements.",
          "combat": "390 HP. Archive-Storm (AoE 40 ft, DC 15 SPI or 3d6 psychic + lose one lineage-level memory). Page-Rain (ranged, 2d6 slashing + DC 14 AGI or restrained by paper 1 round). Name-Whisper (passive: whispers forgotten ancestor names; DC 14 SPI or charmed, walking toward the entity). Absorb-Identity (special: when a target loses their last memory to fog within 30 ft, the Sluagh absorbs them, gaining +20 HP). Vulnerable to radiant.",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 390,
            "maxMana": 50,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "The Sluagh raids Greymark's archive towers, tearing down lineage-tapestries to consume the recorded history of entire bloodlines. They also circle those on the verge of total memory-collapse, waiting for their last thoughts to fade so they can absorb the empty shell of identity and add a new rider to their host. Scribes organize desperate hunts to protect their archives, hiring brave parties to retrieve the lost pages and components left in the ride's wake.",
          "hooks": [
            "A rumor spreads of a Sluagh spotted near the area.",
            "Adventurers need a component from a Sluagh to complete their quest."
          ],
          "description": "A spectral cloud of fused, wraith-like riders that raids archive towers to devour recorded histories and absorb fading minds.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Sluagh originally served as a way for the community to rationalize the forces described in local tales: \"Descending from the Celtic Sluagh, the host of the restless dead, and the Germanic Wild Hunt or Wütende Heer, this phantom ridership is a collective manifestation of the forgotten.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It represents the ultimate terror of historical erasure, riding through the sky to claim the names of the living."
        },
        {
          "id": "fuath",
          "name": "Fuath",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/fuath.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Fuath",
          "role": "Fuath",
          "origin": "Tracing its lineage to the Scottish Celtic Fuath and the Germanic Nixie, this water spirit is a personification of the deceptive depths. It feeds on the desperation of the forgetful, using their own lost identities as bait to lure them into the dark waters.",
          "nature": "This pale, slender figure appears to stand waist-deep in dark peat-pools, its body entirely translucent so that murky water and floating algae are visible through its skin. It is wrapped in a shimmering film of surface tension that reflects fog-light like oil on water, with long, kelp-like hair extending in all directions. While it seems beautiful from a distance, its features are fluid and constantly shifting, and its eyes are bottomless pools of dark water.",
          "habitat": "It waits in the stagnant peat-pools and boggy lakes that dot the lowlands of Frostwood Reach.",
          "combat": "90 HP. Pool-Song (AoE 30 ft, DC 13 SPI or compelled to walk toward the pool). Memory-Restore (special: temporarily restores one precious memory to lure the target; this is the bait). Dissolve (1 AP: becomes indistinguishable from pool-water, gaining full concealment). Kelp-Grasp (melee, +4 to hit, DC 13 AGI or grappled and pulled underwater). Vulnerable to lightning.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 90,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "The Fuath sings a resonant hum that echoes through the fog, bringing to mind the listener's most cherished, forgotten memories to draw them into the water. Once a victim wades in, the spirit dissolves into the pool, drowning the traveler and sinking their memories into the sediment where they compact into peat over centuries. Communities hire adventurers to search for these spirits to recover lost relatives or harvest their memory-infused water.",
          "hooks": [
            "A rumor spreads of a Fuath spotted near the area.",
            "Adventurers need a component from a Fuath to complete their quest."
          ],
          "description": "A translucent water spirit that lures travelers into peat pools by singing songs that recall their most precious memories.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Fuath originally served as a way for the community to rationalize the forces described in local tales: \"Tracing its lineage to the Scottish Celtic Fuath and the Germanic Nixie, this water spirit is a personification of the deceptive depths.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It feeds on the desperation of the forgetful, using their own lost identities as bait to lure them into the dark waters."
        },
        {
          "id": "grogoch",
          "name": "Grogoch",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/grogoch.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Grogoch",
          "role": "Grogoch/Grogochan",
          "origin": "Derived from the Celtic Grogoch, a helpful yet reclusive hedge-spirit, and the Germanic Erdmännlein, the industrious little men of the earth, this creature is a master of the soil. It works in the dark beneath the forest floor, maintaining a hidden agricultural network that sustains the region's inhabitants.",
          "nature": "This three-foot-tall biped resembles a walking haystack, covered in dreadlocks of ironwood-moss and matted animal fur. Two short, muscular arms extend from its bulk, holding a small spade made from a sharpened elk shoulder-blade. Its face is almost entirely obscured by hair, showing only a broad nose and beady, black eyes, and its wide mouth is filled with flat, stone teeth.",
          "habitat": "It lives in clean, root-lined burrow systems dug beneath the ironwood forests, ventilated by small, hidden air vents.",
          "combat": "75 HP. Spade-Strike (melee, +4 to hit, 1d6+2 slashing). Tunnel-Network (passive: knows and can navigate all underground tunnels within 1 mile). Secret-Toll (special: demands one personal secret for passage through a tunnel; refuses to repeat or use the secret). Root-Tender (passive: nearby edible root-plants grow at double rate). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 12,
            "constitution": 14,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 75,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "Grogochs cultivate vast gardens of edible ironwood-roots and frost-tubers, which serve as a crucial food supply for local villages. They also maintain a network of subterranean tunnels that allow travelers to bypass the memory-fog entirely, demanding a secret as payment for using these safe passages. Villages often hire adventurers to trade with them or protect their burrows from surface predators.",
          "hooks": [
            "A rumor spreads of a Grogoch spotted near the area.",
            "Adventurers need a component from a Grogoch to complete their quest."
          ],
          "description": "A hairy, haystack-like earth sprite that tends root gardens and guides travelers through safe tunnels in exchange for secrets.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Grogoch originally served as a way for the community to rationalize the forces described in local tales: \"Derived from the Celtic Grogoch, a helpful yet reclusive hedge-spirit, and the Germanic Erdmännlein, the industrious little men of the earth, this creature is a master of the soil.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It works in the dark beneath the forest floor, maintaining a hidden agricultural network that sustains the region's inhabitants."
        },
        {
          "id": "cailleach",
          "name": "Cailleach",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/cailleach.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Cailleach",
          "role": "Perchta/Frau Holda",
          "origin": "A manifestation of winter's severity and judgment, this entity is born from the Germanic winter goddess Perchta and the Gaelic winter hag Cailleach. In the Frostwood, she is the architect of the protective mist, enforcing the strict social contracts of House Thalreth.",
          "nature": "This twelve-foot-tall crone presents a shifting appearance: she seems a regal woman in a gown of frost-crystals and ironwood-silk to the diligent, but appears as a skeletal horror in peat-moss rags to the lazy. She carries an ironwood distaff to spin emotion-colored memory yarn, and her face features one piercing blue eye and one hollow, fog-filled socket, with a mouth that freezes the air when she smiles.",
          "habitat": "She wanders the highest, coldest ridges of the Frostwood during winter, descending into the valleys when the fog is thickest.",
          "combat": "390 HP. Fog-Spinning (passive: generates memory-fog in a 60-ft radius; creatures inside must DC 14 SPI each round or lose one minor memory). Judgment-Gaze (special: perceives each creature's diligence; the hardworking see a radiant queen, the slothful see a skeletal horror). Distaff-Strike (melee, reach 15 ft, +6 to hit, 2d8+4 bludgeoning). Straw-Judgment (special: if she deems a household negligent, she fills their bellies with straw — DC 15 CON save or incapacitated for 24 hours with a stomach full of straw; not lethal but deeply disturbing). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 20,
            "charisma": 18,
            "maxHp": 390,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 35,
            "resistances": {
              "cold": 100,
              "psychic": 50
            }
          },
          "depth": "Cailleachs spin the memory-fog from raw Wyrd-energy to defend the forest, encoding each strand of mist with a dissolved memory. During the deep winter, they visit Greymark homes to inspect family journals, rewarding diligent scribes with spools of memory-yarn that can restore lost thoughts, while stuffing the bellies of the negligent with straw as a stern warning. Scribes often send adventurers to locate her to seek her favor or harvest her shimmering memory-yarn.",
          "hooks": [
            "A rumor spreads of a Cailleach spotted near the area.",
            "Adventurers need a component from a Cailleach to complete their quest."
          ],
          "description": "A towering winter crone who spins the memory-fog and judges the diligence of mortal record-keepers.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Cailleach originally served as a way for the community to rationalize the forces described in local tales: \"A manifestation of winter's severity and judgment, this entity is born from the Germanic winter goddess Perchta and the Gaelic winter hag Cailleach.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: In the Frostwood, she is the architect of the protective mist, enforcing the strict social contracts of House Thalreth."
        },
        {
          "id": "dullahan",
          "name": "Dullahan",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/dullahan.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Dullahan",
          "role": "Dullahan",
          "origin": "Rooted in the Celtic myth of the Dullahan, the headless harbinger of death, and the Germanic legend of the kopflose Reiter who punishes broken oaths, the Dullahan is a relentless executioner. In the setting of Frostwood Reach, it enforces the sanctity of written vows and the preservation of identity.",
          "nature": "This tall, armored figure clad in blackened ironwood-plate rides a horse composed of compressed fog with a skull-like head. The rider is headless, with memory-mist escaping from its raw neck stump, and it carries its severed head—featuring a featureless, polished ironwood mask that reflects the observer's deepest fears—under one arm. A whip crafted from braided journal-cords hangs at its belt.",
          "habitat": "It haunts the ancient, fog-drowned crossroads and trade routes of the Frostwood at midnight.",
          "combat": "380 HP. Fear-Mirror (passive: its ironwood mask-face reflects the viewer's deepest fear; DC 14 SPI or frightened for 3 rounds). Name-Call (special: speaks one name into the fog; that person's defining memory begins dissolving within 24 hours). Spine-Whip (melee, reach 15 ft, +6 to hit, 2d6+4 slashing + DC 14 AGI or pulled 10 ft toward the rider). Fog-Mount (passive: its horse is made of fog; immune to physical damage, takes double radiant). Vulnerable to radiant.",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 18,
            "charisma": 12,
            "maxHp": 380,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 45,
            "resistances": {
              "cold": 100,
              "physical": 50
            }
          },
          "depth": "The Dullahan rides to crossroads to whisper a traveler's name, causing their defining memory to dissolve within a day, and actively hunts those who break written oaths recorded in Greymark's ledgers. It is particularly drawn to maskless Mimir, collecting their abandoned identities to fuel its own hollow existence. Local authorities post massive rewards for adventurers who can destroy the rider or retrieve its mirror-like ironwood mask.",
          "hooks": [
            "A rumor spreads of a Dullahan spotted near the area.",
            "Adventurers need a component from a Dullahan to complete their quest."
          ],
          "description": "A headless armored rider on a fog-steed that dissolves the identities of named targets and hunts oath-breakers.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Dullahan originally served as a way for the community to rationalize the forces described in local tales: \"Rooted in the Celtic myth of the Dullahan, the headless harbinger of death, and the Germanic legend of the kopflose Reiter who punishes broken oaths, the Dullahan is a relentless executioner.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: In the setting of Frostwood Reach, it enforces the sanctity of written vows and the preservation of identity."
        },
        {
          "id": "cusith",
          "name": "Cu-Sith",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/cusith.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Cu-Sith",
          "role": "Cu Sith",
          "origin": "Combining the spectral Celtic Cu Sith, whose barks signal doom, and the Germanic Schrättel, a clever forest predator, the Cu-Sith is a terror of the twilight hours. It tracks its prey through the mist, feeding not on physical flesh but on the raw emotions of its victims.",
          "nature": "This massive hound stands shoulder-high to a mounted rider, its impossibly thin frame covered in dark green fur composed of living ironwood moss, with its rib-cage clearly visible. Its paws leave no trace on the forest floor, and a green glow leaks from its claws and teeth, while its long tail ends in a bioluminescent moss tuft. Its narrow muzzle unhinges to reveal backward-curving green bones for teeth, and its eyes are solid, pupilless emerald wells.",
          "habitat": "It hunts in packs throughout the deep, fog-veiled valleys and dark woods of the Frostwood.",
          "combat": "220 HP. Three-Bark-Hunt (3 rounds of escalating barks: Round 1, DC 13 SPI or frozen 1 round; Round 2, DC 14 SPI or forget current location; Round 3, target walks willingly into deepest fog — no save, DC 15 SPI to resist at the threshold). Fear-Drain (passive: feeds on the memory of fear; targets within 30 ft who have been frightened lose the emotional memory of fear permanently, becoming eerily calm). Moss-Touch (melee, +5 to hit, 2d6+3 cold damage). Green-Phosphor (passive: emits green bioluminescence, illuminating 20 ft). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 14,
            "intelligence": 8,
            "spirit": 16,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 45,
            "resistances": {
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "The Cu-Sith hunts at dusk, using three distinct barks: the first paralyzes a traveler, the second erases their location memory, and the third compels them to walk into the fog's heart. Rather than killing, the hound feeds on the memory of fear, leaving its prey dazed but completely devoid of terror, which allows Briaran rangers to track the packs by locating these unnaturally fearless survivors. Adventurers are often sent to hunt these beasts to harvest their glowing moss or save lost travelers.",
          "hooks": [
            "A rumor spreads of a Cu-Sith spotted near the area.",
            "Adventurers need a component from a Cu-Sith to complete their quest."
          ],
          "description": "A massive green-furred hound that hunts in the fog, using its barks to paralyze prey and feed on their fear.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Cu-Sith originally served as a way for the community to rationalize the forces described in local tales: \"Combining the spectral Celtic Cu Sith, whose barks signal doom, and the Germanic Schrättel, a clever forest predator, the Cu-Sith is a terror of the twilight hours.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the inhabitants of Frostwood Reach. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: It tracks its prey through the mist, feeding not on physical flesh but on the raw emotions of its victims."
        },
        {
          "id": "pixie",
          "name": "Pixie",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/pixie.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Pixie",
          "role": "Piskie/Pixie",
          "origin": "A blend of the Celtic Pixie, which leads travelers astray or assists them for small offerings, and the Germanic Irrlicht, the deceptive Will-o'-the-Wisp of the peat-bogs, this glowing sprite is a constant companion of the fog. It represents both hope and deception, shifting its behavior on a whim.",
          "nature": "This hand-sized sprite is made of semi-transparent condensed fog-light and shaped like a tiny humanoid with delicate moth-wings. It pulses with a warm honey-colored glow and leaves a trail of phosphorescent spores that hang in the air, changing color from gold to blue or red depending on its mood. Its tiny, mouthless face is dominated by large, solid eyes of warm light through which it communicates.",
          "habitat": "It hovers over the damp marshes, peat-bogs, and low-lying paths of the Frostwood where the mist is thickest.",
          "combat": "75 HP. Spore-Trail (passive: leaves a colored trail — gold = guides to safety, blue = leads in circles, red = leads to danger; player rolls DC 12 INT to determine color before following). Spore-Burst (AoE 5 ft, DC 12 CON or blinded 1 round). Glow-Pulse (1 AP: doubles light output, illuminating 40 ft). Vulnerable to cold.",
          "stats": {
            "strength": 4,
            "agility": 18,
            "constitution": 8,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 75,
            "maxMana": 15,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "Pixies guide lost travelers through the fog, leaving gold trails that lead to safety, blue trails that run in circles, or red trails that plunge into bogs or over cliffs. They reproduce by seeding spores into the memory-fog, where they grow by absorbing dissolved emotional memories, occasionally creating dense lantern-fogs that travelers can navigate if they understand the colors. Adventurers often seek them to collect their glow-spores for light-sources or mapping reagents.",
          "hooks": [
            "A rumor spreads of a Pixie spotted near the area.",
            "Adventurers need a component from a Pixie to complete their quest."
          ],
          "description": "A hand-sized light sprite with moth wings, leading travelers through the fog with shifting colored paths.",
          "heritage": "Spun from the mystery of marsh gas and will-o'-the-wisps, the Pixie was a folklore explanation for why travelers lost their way in the deep fog. The Wyrd anomaly reacted to the spatial disorientation and fear of the misty Siltmire bogs, materializing these glowing sprites to actively lead travelers astray."
        },
        {
          "id": "waldschrat",
          "name": "Waldschrat",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/waldschrat.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Waldschrat",
          "role": "Waldschrat",
          "origin": "The Waldschrat represents a merger of the Germanic Waldschrat, a hairy riddle-loving forest spirit, and the Celtic Far Darrig, the red-capped prankster. In the Frostwood, it is a playful yet dangerous manifestation of the forest's tangled history, testing the wit and courage of travelers.",
          "nature": "This three-foot-tall, wiry creature is formed of twisted ironwood-roots and bark, its body dominated by a bright crimson peaked cap of peat-moss. Its highly flexible limbs bend in impossible directions, and it carries a gnarled root-staff that rattles, releasing tiny red sparks when it is pleased. Its leathery, wrinkled face features a wide, lipless grin and mismatched red and green eyes that look in separate directions.",
          "habitat": "It makes its home along the narrow, overgrown paths and dense thickets of the ironwood forests.",
          "combat": "45 HP. Red-Cap-Spark (ranged, +4 to hit, 1d4 fire). Root-Rattle (AoE 10 ft, DC 12 CON or deafened 1 round). Impossible-Flexibility (immune to grapple and restrain). Fear-Feed (passive: gains +2 to all rolls for each frightened creature within 30 ft). Vulnerable to cold.",
          "stats": {
            "strength": 6,
            "agility": 18,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 45,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 35,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "Waldschrats block pathways and demand that travelers solve riddles based on forgotten history, which require pure intuition to answer since the memories themselves have vanished. They also entertain themselves by playing frightening pranks, mimicking the voices of lost scribes, and feeding on the adrenaline of terrified travelers to power their glowing caps. Scribes and rangers frequently seek them out to solve historical mysteries or hire adventurers to drive them away from trade routes.",
          "hooks": [
            "A rumor spreads of a Waldschrat spotted near the area.",
            "Adventurers need a component from a Waldschrat to complete their quest."
          ],
          "description": "A wiry wood sprite with a crimson moss cap that blocks forest paths with historical riddles and feeds on fear.",
          "heritage": "Rooted in Germanic/Grimm + Celtic folklore, the myth of Waldschrat originally served as a way for the community to rationalize the forces described in local tales: \"The Waldschrat represents a merger of the Germanic Waldschrat, a hairy riddle-loving forest spirit, and the Celtic Far Darrig, the red-capped prankster.\". When the Wyrd anomaly seeped into Frostwood Reach amidst the relentless logging of sacred ironwood forests by Drunhold woodcutters, it reacted directly to the shared anxieties of the region's travelers. By twisting these underlying folklore patterns, the Wyrd synthesized these collective fears and tales into a tangible, living presence: In the Frostwood, it is a playful yet dangerous manifestation of the forest's tangled history, testing the wit and courage of travelers."
        }
      ]
    },
    {
      "id": "nordhalla",
      "name": "Nordhalla",
      "folklore": "Norse + Alpine",
      "creatures": [
        {
          "id": "skerry",
          "name": "Skerry",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/skerry.png",
          "illustrationCaption": "A Skerry clinging to a frozen dock piling, its eyes gleaming with the reflection of stolen gold",
          "role": "The drowned-greed shipwright",
          "origin": "The Skerry is a creature born from the greed of the sea and the cold of the Nordhalla fjords. In the Age of the Norse Kings, the water dwarves were the guardians of sunken treasure, spirits who ensured that the wealth of the sea was distributed according to the will of the gods. When the Wyrd broke the world, the Skerries were twisted into creatures of insatiable greed, their natural love of beauty and craftsmanship turned into an obsession with hoarding salvaged metal and gold. The sailors of Nordhalla have learned to respect the Skerries, leaving copper coins at the water's edge as a tax for safe passage, but they also fear them, for a Skerry cheated of its due will sink a ship as easily as it will repair one.",
          "nature": "A stout, broad water-sprite with waterlogged blue-grey skin that looks like wet oak. It wears a coat of salvaged sailcloth and copper sheeting, its seams stitched with kelp-fiber. Its webbed fingers end in chisel-like claws of copper, and its eyes are the color of deep water, always scanning for the glint of metal. The Skerry is highly skilled in shipbuilding, able to listen to the stresses in a ship's hull and identify the exact point of weakness. It demands silver or gold for its repairs, and if cheated, it will actively sabotage the vessel, loosening rivets and rotting timber from the inside.",
          "habitat": "The Skerry inhabits the frozen bays, ice-locked docks, and sunken shipwrecks of Nordhalla, particularly in the Sunken Fjord where the wreck of the ancient fleet lies beneath the ice. It is most active during the spring thaw, when the ice breaks and the wrecks are exposed, and during the winter storms, when ships are most likely to need repairs. The Skerries have a complex social structure based on hoard size, and the Skerry with the largest hoard is considered the king of the local waters.",
          "combat": "265 HP. Rivet Hammer (melee, 2d8+4 bludgeoning, ignores 4 points of physical damage reduction). Pry Timber (damages ships or structural defenses, deals double damage to wooden objects). Gild-Grip (target's movement speed is reduced by 10 ft for each piece of metal equipment or coin purse they carry, DC 13 CON negates). Vulnerable to ember.",
          "stats": {
            "strength": 16,
            "agility": 12,
            "constitution": 16,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 265,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "rime": 100,
              "physical": 25
            }
          },
          "depth": "Sailors and shipwrights in Nordhalla keep respect the Skerries. They throw copper coins into the icy water before docking, as the cost of a clean repair is far cheaper than a sudden hull breach in the freezing open sea. The Skerry's greed is not natural—it is a curse of the Wyrd, a corruption of the water dwarf's natural love of beauty into an obsession with possession. Some sailors say that the Skerries are trying to build something from the salvaged metal, something that will allow them to return to the sea's depths and escape the cold forever.",
          "hooks": [
            "A wealthy trading cog sank just outside the harbor. The local Skerries have blockaded the wreck, claiming the cargo as their sovereign hoard and dragging salvage divers down.",
            "A Skerry was cheated of its pay by a corrupt harbormaster. In revenge, it has begun systematically loosening the hull rivets of every boat in the harbor."
          ],
          "heritage": "Born from maritime greed along the freezing Nordhalla fjords, the Skerry folklore originally served as a warning to miners and sailors against hoarders who hid precious gems in remote rime-clefts. The Wyrd anomaly acted upon this societal paranoia and the deep gold-lust, manifesting this shipwright horror to guard mineral hoards and punish those who trespass in deep coastal caves."
        },
        {
          "id": "nachtkrapp",
          "name": "Nachtkrapp",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/nachtkrapp.png",
          "illustrationCaption": "A Nachtkrapp soot-raven perched on a chimney stone, its bone-head stark against its black feathers",
          "role": "The soot-raven",
          "origin": "The Nachtkrapp is a creature of the dark and the cold, born from the soot and smoke of the Nordhalla longhouses. In the Age of the Skalds, the Nachtkrapp was a bird of warning, a spirit that appeared before the fires to carry away the bad luck of the household. The Wyrd's corruption did not change its nature, but it did make it larger and more desperate, for the creature now feeds on heat itself, stealing burning coals and oil lamps to keep its nests warm. The Skalds believe that the Nachtkrapp still carries away bad luck, but that it now demands payment in the form of heat, and that a household that cannot keep its fires burning will be cursed with misfortune.",
          "nature": "A massive, pitch-black raven with a wingspan of eight feet, its wings perpetually covered in coal-dust and soot. Its head is a solid white bone skull, the eye sockets glowing with a faint, ember-like light. The creature behaves like a magpie, but instead of shiny metal, it steals burning coals, oil lamps, and warm ash. It is a domestic pest in northern keeps, but it is also a creature of habit, and it will return to the same chimney night after night, building its nest in the warm soot until the chimney is blocked and the longhouse fills with smoke.",
          "habitat": "The Nachtkrapp nests in the high chimney stacks, volcanic vents, and longhouse roof peaks of Nordhalla, particularly in the capital city of Skaldheim where the longhouses burn day and night. It is most active during the winter, when the fires are burning the brightest and the heat is most needed, and during the volcanic eruptions that occasionally shake the northern peaks. The Nachtkrapp's nest is a massive structure of soot and cinders, warm enough to hatch eggs even in the deepest winter.",
          "combat": "220 HP. Ash Cloud (vents a cloud of hot soot from its wings, 15-ft radius, DC 13 CON save or blinded and coughing for 1 round). Coal Snatch (melee, attempts to steal a light source or burning item, DC 13 AGI to prevent). Wing Slash (2d6+3 physical damage). Vulnerable to rime.",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 15,
            "resistances": {
              "ember": 50
            }
          },
          "depth": "A domestic pest in northern keeps. While they steal precious fuel, Skalds believe they carry away domestic bad luck with the soot they scavenge, and leave small trays of tallow outside to pacify them. The Nachtkrapp's skull-head is a mystery to scholars—some say it is the skull of the first Nachtkrapp, worn by every generation as a reminder of the creature's origin. Others say that the skull is a mask, and that beneath it, the Nachtkrapp is a creature of pure fire, its true form too bright for mortal eyes to see.",
          "hooks": [
            "A Nachtkrapp has stolen a sacred hearth-coal containing the family line's runic fire. Retrieve the coal before the nest burns down or the fire goes cold.",
            "A giant flock of Nachtkrapps has gathered over the keep's main chimney, blocking the smoke and causing the longhouse to fill with suffocating draft-smoke."
          ],
          "heritage": "Spun from the soot and smoke of longhouse hearths, the Nachtkrapp was a child-discipline myth told by parents to keep children from playing near drafty chimneys and fires at night. The Wyrd anomaly reacted to generations of bedtime fear and smoky winter nights, materializing this giant soot-raven to snatch away disobedient children who stay awake past dusk."
        },
        {
          "id": "glacier_gremlin",
          "name": "Glacier Gremlin",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/glacier_gremlin.png",
          "illustrationCaption": "A small Glacier Gremlin licking a frozen runic stone near the crevasses",
          "role": "The ice-licking imp",
          "origin": "The Glacier Gremlin is a creature of the ice and the runes, born from the intersection of Alpine legends and the cold magic of Nordhalla. In the Age of the Rune-Singers, the ice was alive with spirits, small creatures that absorbed the magic of the runic stones and used it to sustain themselves. The Wyrd's corruption did not change their nature, but it did make them more desperate, for the runic stones are now few and the competition for their mana is fierce. The Glacier Gremlins are the scavengers of the ice, small creatures that lick the frozen stones to feed on the last traces of magic. The Skalds consider them pests, but they also know that the gremlins are drawn to the most powerful runes, and that their presence is a sign of ancient magic.",
          "nature": "A small, hunched gremlin about a foot tall, with skin made of cracked, translucent blue ice that shows the faint glow of the mana it has absorbed. It is blind and mouthless, using a long, icy tongue to lick the cold runic stones and absorb their power. The creature's body is constantly cold, and it leaves a trail of frost wherever it goes. They are harmless individually, but they are highly annoying, freezing boots to the ice and jamming sled runners with their cold touch. When threatened, they emit a high-pitched whistle that can shatter ice crystals.",
          "habitat": "The Glacier Gremlin inhabits the glacial cols, runic ruins, and ice sheets of Nordhalla, particularly in the Rune-Cleft Glacier where the ancient rune-singers carved their spells into the ice. It is drawn to high concentrations of runic magic, and it is most active during the dark winter months, when the aurora borealis charges the runic stones with additional power. The gremlins are territorial, and fights between rival bands over the best stones are common.",
          "combat": "45 HP. Frost Lick (melee tongue attack, DC 12 CON save or target's movement speed is halved for 2 rounds as ice creeps up their leg). Runic Absorb (drains 10 mana from a target on a successful hit). Vulnerable to ember (shatters instantly if it takes 10+ ember damage in one hit).",
          "stats": {
            "strength": 8,
            "agility": 14,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 45,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "rime": 100
            }
          },
          "depth": "They are simple elemental pests that are drawn to high concentrations of runic magic. Hunters clear them out of sled paths using torches, but the Skald scholars study them, believing that their icy tongues hold the secret to preserving the runic stones from the decay of time. The Glacier Gremlin's blindness is a blessing, for the runic stones are often too bright for mortal eyes to look upon, and the creature's ice-skin is a natural shield against the stones' radiation.",
          "hooks": [
            "A Glacier Gremlin has frozen itself to a crucial runic lever in the mines. Melting it requires heat, but too much heat will detonate the gas pocket nearby.",
            "Skald scholars want three gremlins captured alive; their icy tongues can be used to preserve fragile scrolls without freezing them."
          ],
          "heritage": "Created by Nordhalla miners to explain why iron-drills cracked and alchemical pipes froze, the Glacier Gremlin was a scapegoat myth for industrial failures in the extreme cold. The Wyrd anomaly gave physical life to the miners' frustration and fear of resource loss, spawning this ice-licking imp that actively sabotages clockwork gear systems."
        },
        {
          "id": "nokk_stallion",
          "name": "Nokk Stallion",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/nokk_stallion.png",
          "illustrationCaption": "A ghostly Nokk Stallion formed of river-mist and cold water, its eyes like pale lanterns",
          "role": "The mist-horse water spirit",
          "origin": "The Nokk Stallion is a creature of the water and the mist, born from the ancient Norse legends of the Bäckahästen, the water spirit that lures the unwary to their doom. In Nordhalla, where the rivers are cold and the waterfalls are tall, the Nokk Stallions are the guardians of the waterways, spirits that protect the rivers from pollution and overfishing. The Wyrd's corruption has twisted their protective nature into something predatory, and they now lure travelers into the water not to save the river, but to feed their own hunger for the warmth of living bodies. The Nordhalla fishermen know the signs of a Nokk's presence—a mist that rises from the water even on a clear day, and the sound of hooves on stone where no horse should be.",
          "nature": "A ghostly stallion composed entirely of swirling grey river-mist, cold water droplets, and floating river-kelp. Its eyes glow like pale swamp lanterns, and its hooves make no sound on the stones, though they leave a trail of frost wherever they touch. The creature stands near deep pools and waterfalls, offering rides to travelers with a gentle whinny and a bow of its head. When a rider mounts, the Nokk's body becomes solid and cold, and it carries the victim into the deepest part of the water, where it dissolves back into mist, leaving the rider to drown.",
          "habitat": "The Nokk Stallion haunts the deep rivers, cold waterfalls, and misty lakes of Nordhalla, particularly in the Veilwater Falls where the river drops three hundred feet into a pool that is said to be bottomless. It is most active during the early morning, when the mist is thickest and the water is coldest, and during the autumn rains, when the rivers are swollen and the currents are strong. The Nokk is territorial, and each stretch of river is guarded by a single stallion that will fight to the death to protect its domain.",
          "combat": "160 HP. Water Dash (moves up to 50 ft for 1 AP, leaving a freezing trail). Mist Lure (DC 13 SPI save or target is charmed and compelled to move toward the Nokk). Drown (melee, +5 to hit, DC 13 AGI save or grappled and pulled under the water). Vulnerable to ember.",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 14,
            "maxHp": 160,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 45,
            "resistances": {
              "rime": 100
            }
          },
          "depth": "Territorial and deceptive spirits. While dangerous, they can be pacified by playing a stringed instrument or offering a clean silver coin to the water. The Nokk's mist-body is a mystery to scholars—some say it is the spirit of a horse that drowned in the river, others that it is a manifestation of the water itself, given form by the Wyrd's corruption. The silver coin is said to remind the Nokk of the sun, which it has not seen since it was bound to the water.",
          "hooks": [
            "A local skald went missing near the waterfall; his silver harp was found on the shore, where a Nokk has been spotted.",
            "A merchant cog refuses to cross the river because a Nokk Stallion is standing in the shallows, blocking the ferry path."
          ],
          "heritage": "Spun from Norse water-spirit legends of the Bäckahästen, the Nokk Stallion was a cautionary tale to warn travelers against mounting stray horses near freezing lakes. The Wyrd anomaly consolidated the terror of the icy Nordhalla waters, transforming these warnings into a physical, mist-draped horse that drowns anyone who dares to ride it."
        },
        {
          "id": "huldra",
          "name": "Huldra",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/huldra.png",
          "illustrationCaption": "A Huldra forest nymph standing in a sunbeam, her cow tail hidden in the grass",
          "role": "The hollow-back nymph",
          "origin": "The Huldra is a creature of the deep forest and the lonely heart, born from the Scandinavian legends of the forest spirits that seduce the unwary. In Nordhalla, where the pine forests are ancient and the winters are long, the Huldras are the spirits of the trees that have been cut, the forest's grief given form. The Wyrd's corruption has twisted their protective nature into something predatory, and they now lure woodcutters and miners into the forest not to protect them, but to bind them to the forest's will. The Nordhalla woodcutters know the signs of a Huldra's presence—a beautiful song on the wind, and the smell of pine needles where no pine trees grow.",
          "nature": "A beautiful woodland spirit that appears as a young maiden with long golden hair and eyes the color of forest pools. She hides a cow's tail beneath her skirts, and her back is completely hollow like a rotting tree, a feature that is only visible when she turns away. She moves with the grace of a dancer, and her voice is a soft, melodic song that can charm the most hardened warrior. She is drawn to lonely woodcutters and miners, offering them comfort and warmth in the cold forest, but her embrace is a trap, and those who succumb to her are never seen again.",
          "habitat": "The Huldra inhabits the ancient pine groves, forest springs, and mining paths of Nordhalla, particularly in the Deepwood where the trees have stood for ten thousand years. She is most active during the winter, when the cold drives travelers to seek warmth, and during the spring, when the sap runs and the forest is most alive. The Huldra's territory is marked by small shrines of stones and pine cones, offerings left by those who have escaped her embrace.",
          "combat": "160 HP. Seductive Song (DC 13 SPI save or target is charmed and must move toward the Huldra). Wood-Slam (+5 to hit, 2d8+3 physical, she possesses supernatural strength). Tree Meld (can teleport up to 40 ft between pine trees). Vulnerable to cold iron.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 18,
            "maxHp": 160,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "Reclusive spirits of the deep forest. They are generally peaceful if their trees are respected but will curse woodcutters who cut ancient sacred groves. The Huldra's hollow back is a symbol of her nature—she is empty inside, a vessel for the forest's grief, and those who fill her with their love are consumed by it. Some scholars believe that the Huldra was once a mortal woman who loved the forest so deeply that she became one with it, and that her curse is to seek that love forever, never finding it.",
          "hooks": [
            "A miner has gone missing; his boots were found near a deep forest pool where a beautiful maiden has been seen singing.",
            "A Huldra has cursed a village logging camp, causing their axes to break on the wood, because they cut a sacred rowan tree."
          ],
          "heritage": "Born from Scandinavian legends of forest nymphs, the Huldra was a warning myth told to young men to prevent them from wandering alone into deep woods in search of romance. The Wyrd anomaly crystallized the isolation and lonely hearts of Nordhalla's hunters, materializing this hollow-backed maiden who seduces and ruins travelers who step off the path."
        },
        {
          "id": "fossegrim_ice",
          "name": "Fossegrim",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/fossegrim_ice.png",
          "illustrationCaption": "A Fossegrim frozen beneath a blue waterfall, playing a fiddle of ram skull",
          "role": "Fossegrim",
          "origin": "The Fossegrim traces its origins to the legendary water-spirits of Norse folklore, who lured mortals to waterfalls with the promise of sublime musical mastery, mingled with the Alpine legends of the Barbegazi, the snowshoe-footed ice-dwarves who whistle warnings of cascading snow. In the frozen expanse of Nordhalla, this spirit has become a creature of absolute winter, bound to the silent cascades where the elements hold sway.",
          "nature": "Entombed within the blue ice of frozen waterfalls, the creature appears as a slender, translucent silhouette holding a fiddle carved from the bleached, frozen skull of a ram. Its body is composed of layered, cross-sectioned sheets of ice that transition through every shade of azure, terminating in massive, snowshoe-like feet that grant it the uncanny ability to glide over the thinnest drifts without fracturing the crust. Its face is a masterpiece of inhuman symmetry, carved with flawless precision, featuring eyes of solid, pale blue ice that look through frozen barriers as if they were nothing more than clear glass.",
          "habitat": "These glacial spirits reside amidst the frozen waterfalls, icy ravines, and sub-zero crevices that scar the stark terrain of Nordhalla.",
          "combat": "130 HP. Ice-Fiddle (special: plays music that thaws brass mechanisms in the Frozen Archive; in combat, DC 14 SPI or charmed and compelled to dance for 3 rounds). Skate-Walk (can move across ice without penalty or breaking through). Ram-Skull-Bash (melee, +5 to hit, 2d6+3 bludgeoning). Goat-Bargain (special: teaches ice-fiddle for a goat sacrifice; if no goat available, the price increases to a memory). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 130,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 100
            }
          },
          "depth": "The Fossegrim plays a resonant, otherworldly music on its ram-skull fiddle, a specific frequency audible only to the Rime-Born Rune Keepers that temporarily thaws the intricate brass mechanisms of the Frozen Archive to prevent them from seizing forever. Once every century, the spirit offers to teach its art to a single mortal in exchange for a goat sacrificed at the foot of its waterfall; however, with Nordhalla's goats nearly extinct, this bargain often demands a memory instead. Disturbed concerts are met with swift violence, as the fierce Bloodhammer warriors guard these frozen musicians with religious fervor, viewing their songs as sacred, untouchable rites.",
          "hooks": [
            "The central heating clock in the Frozen Archive has frozen. The party must convince a Fossegrim to play its fiddle to thaw it.",
            "A skald wants to learn the fiddle-tunes of the Fossegrim to perform at the winter assembly, but has no goat to trade."
          ],
          "description": "A hauntingly beautiful water-spirit entombed in blue ice, whose frozen fiddle thaws the gears of ancient history while demanding a steep and scarce price from its desperate pupils.",
          "heritage": "Rooted in Norse tales of musical water-spirits, the Fossegrim was a myth used by aspiring skalds to explain why some achieved sudden, unnatural musical genius at waterfalls. The Wyrd anomaly reacted to the desire for artistic fame and the local fears of the sub-zero Nordhalla cascades, manifesting this glacial spirit who demands cold bargains in exchange for musical mastery."
        },
        {
          "id": "marepress",
          "name": "Marepress",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/marepress.png",
          "illustrationCaption": "A Marepress squatting in the shadows, frost coiling around its dark mass",
          "role": "Mare/Mara",
          "origin": "Born from the dark roots of the Norse Mara and the Alpine Alp or Trud, the Marepress is the literal weight of terror made manifest. It is a creature of nocturnal paralysis that rides the chests of the unwary, transforming the warmth of sleep into a freezing, suffocating prison of dreams.",
          "nature": "Appearing as a heavy, squat shape of compressed shadow and frost, this creature is about the size of a large dog yet carries the dense, crushing weight of stone. It moves as a concentrated pocket of absolute cold, crystallizing the air into fractal, branching frost patterns and leaving hoofprints of dark black ice wherever its heavy feet tread. It possesses no true face, only two pale, starlike eyes of freezing light that burn within the gloom, appearing in the nightmares of its victims as two distant stars in an infinite, crushing abyss.",
          "habitat": "The Marepress hunts in the dark corners of Nordhalla, lurking in drafts, cold bedchambers, and abandoned vaults.",
          "combat": "155 HP. Nightmare-Crush (special: settles on a sleeping target's chest; DC 14 SPI or paralyzed in a nightmare, taking 2d6 psychic per round; the victim's dreams feed the Marepress, healing it for the same amount). Frost-Aura (passive: 10-ft radius, all non-cold-resistant creatures take 1d6 cold per round; frost patterns form on surfaces). Black-Ice-Hoofprint (passive: leaves black-ice hoofprints that cause DC 13 AGI or slip and fall prone). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 14,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 155,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "physical": 25
            }
          },
          "depth": "The Marepress feeds on the raw, emotional energy of terrors, showing a dangerous affinity for the vivid, blood-soaked dreams of sleeping Bloodhammer warriors whose ancestral rage fuels its appetite. Within the Frozen Archive, Rune Keepers have learned to harness this freezing presence, sealing the creatures inside heavy brass vessels to act as perpetual refrigeration units for fragile light-scrolls. Yet, this is a precarious containment; should one of these brass vessels fracture, the creature's nightmare-aura will flood the halls, plunging the keepers into madness and freezing their hearts.",
          "hooks": [
            "A Bloodhammer champion is wasting away, unable to wake from a Marepress's grip. Break into the champion's vault and destroy the shadow.",
            "A storage vessel in the Archive has cracked, and the escaping Marepress has frozen the entire level."
          ],
          "description": "A dense, canine-sized shadow of absolute cold that settles upon the chests of sleepers, feeding on their violent nightmares and leaving trails of black ice.",
          "heritage": "Spun from Norse Mara legends, the Marepress served as a somatic explanation for sleep paralysis and terrifying nightmares where victims felt a physical weight suffocating them. The Wyrd anomaly coalesced this raw sleep-helplessness, spawning a shadowy, heavy entity that physically sits on the chests of sleeping longhouse residents."
        },
        {
          "id": "krampuskin",
          "name": "Krampuskin",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/krampuskin.png",
          "illustrationCaption": "A Krampuskin giant swinging its birch-whip, chains clattering around its hooves",
          "role": "Krampus",
          "origin": "The Krampuskin is born of Alpine winter folklore, drawing from the legendary Krampus, the horned punisher of the wicked, and the Jötunn of Norse mythology, the primordial frost-giants who embody the merciless, unyielding cold. In the lands of Nordhalla, this creature has become the ultimate enforcer of honor, tracking down those who have broken their sacred vows.",
          "nature": "Standing ten feet tall, this monstrous humanoid is covered in matted, frost-white fur over a massive body of blue-black ice. It drags a heavy chain of frozen iron links that rattle like fracturing glaciers, carrying a bundle of frozen birch branches in its clawed hands and a frost-stiffened burlap sack that writhes and whispers with the voices of its victims. Its face is a terrifying, bestial muzzle with teeth of yellowed ice, a long black tongue, and eyes that burn with a low, menacing orange flame.",
          "habitat": "This terrifying hunter roams the snowy tundra, mountain passes, and deep glacial crevasses of Nordhalla.",
          "combat": "420 HP. Chain-Rattle (passive: the sound of its chains carries for miles; any creature who hears it and feels guilt takes -2 to all saves). Birch-Whip (melee, reach 15 ft, +6 to hit, 2d6+4 slashing + DC 14 CON or bleeding 1d6/round for 3 rounds). Sack-Capture (special: grappled target is stuffed into the frozen sack and sealed in a glacier-crevasse, preserved eternally; the victim is not dead but cannot escape without external rescue). Horn-Gore (melee, +7 to hit, 2d8+5 piercing). Vulnerable to fire.",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 18,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 10,
            "maxHp": 420,
            "maxMana": 20,
            "maxActionPoints": 5,
            "speed": 35,
            "resistances": {
              "cold": 100,
              "physical": 50
            }
          },
          "depth": "Driven by an instinct to punish, the Krampuskin hunts those who have broken blood-oaths or deserted the shield-walls of Nordhalla, tracking its prey by the guilt in their hearts. Those caught are stuffed into its frozen sack and sealed alive inside deep glacier crevasses, preserved forever by ice that refuses to melt; Skald rangers occasionally discover the screaming, perfectly preserved faces of ancient traitors locked deep within mountain walls. The sound of its chains dragging through the snow serves as a grim warning to all who harbor secrets.",
          "hooks": [
            "A warrior who fled the battle is being hunted by a Krampuskin. Protect the village from the giant's chains or offer the warrior up.",
            "A frozen sack was discovered in a melting glacier, containing an ancient chieftain who is still alive. Defeat the Krampuskin guardian."
          ],
          "description": "A towering frost-giant punisher who hunts down oath-breakers with heavy chains, stuffing the wicked into a frost-stiffened sack to be frozen forever in mountain crevasses.",
          "heritage": "Originating as a seasonal warning to enforce winter discipline, the Krampuskin was a folklore tool to terrify children into good behavior before the winter solstice. The Wyrd anomaly reacted to this intense childhood fear and moral pressure, materializing this horned, birch-wielding punisher to hunt down wrongdoers in the snow."
        },
        {
          "id": "klabatskerry",
          "name": "Klabatskerry",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/klabatskerry.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Klabatskerry",
          "role": "Klabautermann",
          "origin": "The Klabatskerry arises from maritime superstitions, blending the Norse and Alpine ship-sprite, the Klabautermann, who protects vessels but weeps on the deck of a doomed ship, with the tragic folklore of the Strandvasker—the unburied drowned whose remnants wash ashore. Born from the wreckage of lost vessels, these creatures are bound to the vessels of the freezing northern seas.",
          "nature": "This small figure is cobbled together from driftwood, frayed sail-cloth, and frozen sea-foam, with every component salvaged from a different doomed ship. Its hands are caulking mallets permanently fused to its wooden wrists, its red cap is stiffened by frost and stained with whale-oil, and a tarnished ship's bell is embedded in its chest, chiming softly at the approach of danger. Its face is carved like a miniature ship's figurehead with an exaggerated nose and wide grin, featuring eyes made of warm amber that flare with light when a storm draws near.",
          "habitat": "These wooden sprites inhabit the ice-choked docks, shipyards, and decks of seafaring vessels throughout Nordhalla.",
          "combat": "130 HP. Weeping-Omen (special: if it appears on deck and weeps, the ship has 7 hours before the ice cracks; this is always accurate). Caulk-Seal (1 AP: seals hull-cracks with frost-sealant stronger than tar; a ship it tends never sinks from ice-damage). Bell-Chest (passive: bell in chest rings softly when danger approaches; functions as an early-warning system within 100 ft). Mallet-Strike (melee, +4 to hit, 1d6+2 bludgeoning). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "Lives in ship hulls. If given a bowl of sea-salt butter every Sunday, it hammers the wood to warn of structural leaks or oncoming storms. If neglected, it steals iron nails from the hull, causing the ship to slowly sink, and rings its chest-bell to attract sirens.",
          "hooks": [
            "A captain suspects a neglected Klabatskerry is sabotaging his ship.",
            "A ship's bell is heard ringing from a completely empty vessel in the bay."
          ],
          "description": "A small maritime sprite constructed from shipwrecks and frozen foam, compulsively repairing hulls while crying out warnings of impending icy doom.",
          "heritage": "Spun from old maritime superstitions of the Klabautermann, the Klabatskerry was a ship-sprite myth invented to explain sudden creaks and good fortunes aboard vessels. The Wyrd anomaly materialized the sailors' anxiety over survival on the storm-tossed seas, shaping their hope into a physical ship-sprite that weeps on vessels destined to sink."
        },
        {
          "id": "perchtar",
          "name": "Perchtar",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/perchtar.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Perchtar",
          "role": "Perchten",
          "origin": "The Perchtar draws its essence from the Alpine winter parade of the Perchten during the Rauhnächte, who drive out evil spirits while spreading terror, and the Norse Åsgårdsreia, or the Wild Hunt, which portends death and war as it storms across the dark sky. In Nordhalla, they manifest as a marching host that judges the moral fortitude of isolated settlements.",
          "nature": "This entity is a synchronized procession of dozens of masked figures moving in perfect, haunting lockstep. Each member carries a unique implement—bells, chains, brooms, pitchforks, or birch rods—and wears a mask of glacier-ice carved into either a beautiful countenance, the Schönperchten, or a hideous grin, the Schiachperchten. The masks themselves serve as their only faces, leaving trails of bell-prints and scorched snow behind them; the beautiful masks emit a soft warmth, while the hideous ones radiate a lethal cold, and any mask that cracks causes the spirit beneath to dissolve instantly into snow.",
          "habitat": "The procession moves along the valleys, frozen plains, and mountain passes of Nordhalla, particularly the Valley of Ymir.",
          "combat": "760 HP (collective). Procession-Sweep (AoE 100 ft, the entire procession passes through an area; all Wyrd-creatures are driven out for 1 month; all creatures in the area take 4d6 cold and must DC 16 SPI or flee in terror for 1 minute). Mask-Judgment (special: stops before each settlement; if the village has maintained hearth-fires and honored the dead, Schönperchten leave gifts; if not, Schiachperchten attack — no one sleeps until they leave, DC 15 CON each hour or take 1d6 exhaustion damage). Mask-Crack (reaction: if a Percht's mask is cracked, that Percht dissolves into snow, reducing the procession's HP by 10). Vulnerable to fire (masks take double fire damage).",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 18,
            "intelligence": 10,
            "spirit": 20,
            "charisma": 12,
            "maxHp": 760,
            "maxMana": 80,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "physical": 50,
              "psychic": 50
            }
          },
          "depth": "This winter sentinel stands outside cabins during blizzards. If the players have a warm fire, tidy beds, and have left a portion of bread on the window sill, the Perchtar taps the glass and leaves a piece of raw silver in their boots. If they are lazy, it rings its iron bells to cause nightmares.",
          "hooks": [
            "A lazy village is plunged into a nightmare-sleep by a Perchtar.",
            "A silver coin is found in a boot, signaling a winter spirit's approval."
          ],
          "description": "A mysterious, lockstep procession of masked winter spirits whose frozen faces judge the settlements they pass, cleansing the lands of corruption while rewarding the dutiful and terrorizing the negligent.",
          "heritage": "Derived from winter parades designed to drive out evil spirits, the Perchtar was a folklore ritual to cleanse settlements during the dark Rauhnächte. The Wyrd anomaly consolidated the community's terror of the dark and their wild winter dances, physically manifesting these masked, clawed figures to roam the snowy streets of Nordhalla."
        },
        {
          "id": "helhest",
          "name": "Helhest",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/helhest.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Helhest",
          "role": "Helhest",
          "origin": "The Helhest stems from the Norse Helhest, the three-legged steed of the underworld whose sighting portends plague, and the Alpine Schimmelreiter, the ghostly rider of winter storms who appears before catastrophic floods. Bound to the frozen valleys, it represents both a plague-bearing omen and a vital anchor to the landscape.",
          "nature": "This emaciated, spectral horse stands on three legs—two slender forelegs and a single massive hind leg fused from two. Its body is a bone-white mass of sun-bleached glacier-ice that shimmers with cold-fire, carrying a frozen leather saddle and featuring a mane of rigid, clattering icicles. Its head is a bare skull of yellowed ice with eye-sockets that burn with the pale, sickly green of an aurora filtered through heavy fog, and its single hind hoof strikes the ground with the hollow, heavy sound of a closing coffin-lid.",
          "habitat": "It thunders across the frozen fjords, windswept glacier faces, and ice-fields of Nordhalla.",
          "combat": "380 HP. Three-Legged-Charge (melee, +7 to hit, 2d8+5 bludgeoning + DC 15 AGI or trampled). Plague-Aura (passive: 50-ft radius; the eldest and youngest in any settlement visited will die within the week, DC 15 CON to resist). Coffin-Hoof (passive: single hind-hoof sounds like a coffin-lid closing; creatures who hear it DC 14 SPI or frightened for 1 hour). Glacier-Anchor (passive: each Helhest anchors a section of the halted glaciers; if slain, that glacier begins to advance — the catastrophe House Skalvyr bargained to prevent). Vulnerable to radiant.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 50,
            "resistances": {
              "cold": 100,
              "physical": 25
            }
          },
          "depth": "This three-legged ice horse only allows those who are 'halfway to death' (e.g., at less than 50% HP or carrying an undead curse) to mount it. If a healthy player rides it, they take cold damage each round. If paid a toll of a dead friend's fingerbone, the horse can run across ice and air, skipping hazardous terrain.",
          "hooks": [
            "A cursed warrior seeks a Helhest to ride to the Underworld.",
            "A frozen pass can only be crossed by mounting a three-legged spectral horse."
          ],
          "description": "A three-legged spectral steed of bone-white ice whose midnight gallop heralds death, yet whose life holds the glaciers of Nordhalla in place.",
          "heritage": "Rooted in Norse myths of three-legged plague steeds, the Helhest was a cautionary legend used to explain the sudden onset of devastating crop blight and contagious sickness. The Wyrd anomaly reacted directly to the terror of disease in Nordhalla's remote settlements, manifesting this skeletal, three-legged horse as a physical harbinger of pestilence."
        },
        {
          "id": "myling",
          "name": "Myling",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/myling.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Myling",
          "role": "Myling/Utburd",
          "origin": "The Myling originates from the Scandinavian Myling or Utburd, the vengeful spirit of an abandoned, unbaptized child that clings to travelers, and the Alpine Wechselbalg or changeling, which replaces a stolen child and becomes increasingly inhuman. It is born of grief and abandonment in the frozen wastes of Nordhalla, wandering as a freezing manifestation of unexpressed sorrow.",
          "nature": "Floating an inch above the snow, the creature appears as a tiny, withered infant encased in blue-white ice that, despite its small size, weighs hundreds of pounds. The outer shell is carved with scratched, glowing runes—a single name written repeatedly by a mother who could not name the child she left behind. Its face is locked in a frozen, silent cry with eyes squeezed shut and mouth wide open, though the eyes occasionally open to reveal an adult intelligence and a bottomless, ancient sorrow.",
          "habitat": "It wanders the snowy wilderness, the outskirts of isolated settlements, and the vicinity of nurseries during hard winters in Nordhalla.",
          "combat": "80 HP. Weight-Bearing (special: latches onto a traveler's back; starts at 20 lbs and increases by 20 lbs each round; if the carrier's STR check fails, they are crushed into the snow). Rune-Glow (passive: scratched name-runes glow, revealing the Myling's identity). Hearth-Release (special: if carried to a hearth-fire, the ice melts and the spirit is freed — resolving the encounter peacefully). Vulnerable to fire.",
          "stats": {
            "strength": 4,
            "agility": 10,
            "constitution": 10,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 80,
            "maxMana": 20,
            "maxActionPoints": 2,
            "speed": 0,
            "resistances": {
              "cold": 100
            }
          },
          "depth": "A child ghost that jumps onto a traveler's back and begs to be carried to a graveyard. As the traveler walks, the Myling becomes heavier and heavier (doubling in weight every 100 feet) until it crushes them, unless they can name the child or speak a holy prayer.",
          "hooks": [
            "A ranger was found crushed under no apparent weight on a forest road.",
            "A ghost child asks a traveler to carry it to the churchyard."
          ],
          "description": "A heavy, floating infant spirit frozen in runic ice that clings to travelers, growing exponentially heavier until it is either melted by a warm hearth or crushes its victim.",
          "heritage": "A heartbreaking folklore coping strategy, the Myling arose to explain infant mortality, child abandonment, and the agonizing guilt of families unable to support children in harsh winters. The Wyrd anomaly materialized this collective grief and generational trauma, creating a heavy, weeping child-spirit that clings to travelers' backs until they collapse."
        },
        {
          "id": "jutul",
          "name": "Jutul",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/jutul.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Jutul",
          "role": "Troll",
          "origin": "The Jutul is rooted in the Norse legends of trolls, who turn to stone when exposed to sunlight, and the Alpine Berggeist, the mountain-spirit who guides or misleads travelers in the heights. In the sunless, dimmed skies of Nordhalla, these creatures are no longer petrified by daylight, remaining active and alert.",
          "nature": "This creature resembles a massive boulder of grey granite shaped like a seated humanoid, completely indistinguishable from a normal glacial erratic when inert except for a faint warmth radiating from its core. When it stirs, joint-like cracks open across its rocky surface, and moss and lichen align in runic patterns. Its face has barely discernible features—a heavy brow-ridge, a broken nose, and a grim mouth—with its eyes appearing as deep depressions that burn with the warm glow of deep-earth amber.",
          "habitat": "They are found along high mountain passes, rocky valleys, and boulder-strewn slopes of Nordhalla.",
          "combat": "215 HP. Boulder-Sleep (passive: indistinguishable from a natural boulder when inert; +10 to stealth). Toll-Demand (special: blocks mountain passes, demanding raw iron ore; if paid, absorbs the ore and moves aside; if refused, animates and attacks). Stone-Regeneration (heals 10 HP per round; can only be truly damaged by concentrated runic light). Roll-Attack (melee, +6 to hit, 2d10+4 bludgeoning, DC 15 AGI or pinned). Vulnerable to radiant (runic light temporarily re-petrifies it for 1d4 rounds).",
          "stats": {
            "strength": 20,
            "agility": 8,
            "constitution": 20,
            "intelligence": 6,
            "spirit": 8,
            "charisma": 6,
            "maxHp": 215,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "physical": 75,
              "cold": 50
            }
          },
          "depth": "Jutuls sit motionless on trade routes for decades, only to animate and roll across paths when valuable caravans approach, demanding a toll of raw iron ore to absorb into their granite bodies. Because the dimmed sun no longer petrifies them, they pose a constant hazard to travelers, forcing Rune Keepers to utilize concentrated runic light to temporarily freeze the creatures back into inert stone and buy passage for convoys.",
          "hooks": [
            "A rumor spreads of a Jutul spotted near the area.",
            "Adventurers need a component from a Jutul to complete their quest."
          ],
          "description": "A sentient boulder of warm granite that blocks mountain passes, demanding tolls of raw iron to fuel its stony mass.",
          "heritage": "Rooted in Norse legends of trolls that turn to stone in sunlight, the Jutul was a myth to explain massive, humanoid-shaped boulder formations in the mountains. The Wyrd anomaly crystallized the travelers' fear of rockslides and the unknown terrors of high peaks, shaping these stone anxieties into massive, slow-moving trolls."
        },
        {
          "id": "lindwyrm",
          "name": "Lindwyrm",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/lindwyrm.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Lindwyrm",
          "role": "Lindworm/Linnorm",
          "origin": "The Lindwyrm descends from the Norse Lindworm, the wingless, two-legged serpentine dragon that guards burial mounds, and the Alpine Tatzelwurm, a half-feline, half-serpentine cryptid of the high forests. In Nordhalla, it is a creature that tunnels through the ice, drawn to the ancient power of the dead.",
          "nature": "It possesses a fifteen-foot serpentine body covered in overlapping, translucent ice-scales that refract light into shifting rainbows along its flanks. It moves on two muscular, cat-like forelegs tipped with pickaxe-claws of dense black ice, leaving glassy, trackless tunnels that refreeze instantly in its wake. Its face is a fusion of a feline skull and serpentine features, complete with horizontal-slit pupils, a dislocating jaw, and two backward-sweeping horns of spun frost-silk.",
          "habitat": "It makes its home in the permafrost, sub-glacial tunnels, and ancient burial mounds of Nordhalla.",
          "combat": "390 HP. Ice-Bore (passive: tunnels through permafrost, leaving glassy tunnels that refreeze instantly; cannot be tracked normally). Cat-Claw-Strike (melee, +6 to hit, 2d6+4 slashing + 1d6 cold). Rune-Devour (special: eats carved rune-stones; each rune consumed heals the Lindwyrm 15 HP and permanently destroys the runic inscription). Frost-Breath (AoE cone 20 ft, 3d6 cold, DC 15 CON or frozen 1 round). Tomb-Guard (passive: coiled around buried dead, consuming the preserving cold; a Lindwyrm-infested tomb actually begins to thaw). Vulnerable to fire.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 16,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 390,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 100,
              "physical": 25
            }
          },
          "depth": "These beasts coil around the dead in glacier-tombs, paradoxically thawing the graves because they feed on the surrounding cold itself. They are also drawn to runic inscriptions, devouring carved rune-stones to absorb the bound mana within them; this makes them a critical threat to the Frozen Archive, where a single breaching Lindwyrm could consume centuries of recorded knowledge in a single feeding.",
          "hooks": [
            "A rumor spreads of a Lindwyrm spotted near the area.",
            "Adventurers need a component from a Lindwyrm to complete their quest."
          ],
          "description": "A serpentine predator with cat-like forelegs that tunnels through glaciers, devouring runic magic and thawing the ancient tombs it guards.",
          "heritage": "Spun from legends of wingless dragons guarding burial mounds, the Lindwyrm was a cautionary myth to deter grave robbers and trespassers from sacred ruins. The Wyrd anomaly consolidated the fear of ancestral curses and subterranean collapses, manifesting this serpentine beast to guard the deep, frozen chambers of Nordhalla."
        },
        {
          "id": "nidhoggr",
          "name": "Níðhöggr",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/nidhoggr.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Níðhöggr",
          "role": "NÃ­Ã°höggr",
          "origin": "The Níðhöggr is inspired by the Norse Níðhöggr, the dragon that gnaws the roots of the World Tree, and the Alpine Schrat-Root, a subterranean spirit that undermines buildings. In Nordhalla, it is a blind, burrowing menace that feasts on foundations and magical pacts alike.",
          "nature": "This creature appears as a tangle of black, rope-thick coils that resemble petrified roots, covered in matte black scales that are warm to the touch. It has no distinct head, instead terminating in a circular, lamprey-like maw lined with rotating rings of translucent amber teeth that act as a boring machine. Each tooth is a fragment of a consumed rune, and the tunnels it leaves behind are filled with fine black ash that smells of burnt magical energy.",
          "habitat": "It tunnels deep beneath the frozen bedrock, keep foundations, and glacial vaults of Nordhalla.",
          "combat": "380 HP. Foundation-Gnaw (special: gnaws at bedrock beneath structures; a keep with Nidhoggr infestation develops cracks within months, collapses within years — this is a campaign-level siege weapon). Oath-Corrupt (passive: consumes runic energy of blood-oaths; Bloodhammer warriors whose ancestral runes are eaten permanently lose their supernatural rage). Lamprey-Maw (melee, reach 10 ft, +6 to hit, 2d8+4 piercing + DC 14 CON or bleeding 1d8/round). Ash-Trail (passive: tunnels filled with fine black ash smelling of decayed runic energy — reveals its presence). Vulnerable to radiant.",
          "stats": {
            "strength": 18,
            "agility": 12,
            "constitution": 18,
            "intelligence": 6,
            "spirit": 8,
            "charisma": 6,
            "maxHp": 380,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "physical": 50,
              "cold": 50
            }
          },
          "depth": "The Níðhöggr gnaws at the bedrock beneath keeps and the Frozen Archive, causing heavy stone walls to crack and eventually collapse. It is drawn to the magical energy of buried blood-oaths, devouring the runes of sworn vows and permanently stripping Bloodhammer warriors of the ancestral rage that defines their lineage.",
          "hooks": [
            "A rumor spreads of a Níðhöggr spotted near the area.",
            "Adventurers need a component from a Níðhöggr to complete their quest."
          ],
          "description": "A warm, root-like serpentine worm that burrows under fortifications, gnawing away both stone foundations and the sacred runic vows of the clans.",
          "heritage": "Inspired by Norse mythological dragons chewing Yggdrasil's roots, the Níðhöggr was a myth to explain why deep tunnel structures collapsed and why crops withered. The Wyrd anomaly reacted to the miners' fear of structural collapse under the mountains, shaping these fears into a physical, root-gnawing dragon that destabilizes the earth."
        },
        {
          "id": "strandvasker",
          "name": "Strandvasker",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/strandvasker.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Strandvasker",
          "role": "Strandvasker",
          "origin": "The Strandvasker draws from the Norse Strandvasker, the spirit of a drowned sailor washed ashore seeking burial, and the Alpine Wassermann or Nix, a water-spirit that lures the living to drown. It represents the maritime tragedies of Nordhalla's icy waters.",
          "nature": "This creature appears as a swollen, blue-grey humanoid draped in frozen, salt-crusted rags, with barnacles clinging to its stiff joints and frozen seaweed hanging like brittle curtains. Salt-crystals form a rough armor over its torso, and its hands permanently clutch a frozen length of hemp rope. Its face is distorted by seawater and ice, and when it wails, its jaw dislocates to reveal a throat packed with black ice and glittering fish-bones.",
          "habitat": "It haunts the icy tidelines, rocky shorelines, and frozen fjords of Nordhalla.",
          "combat": "145 HP. Shore-Call (AoE 60 ft, mimics lost crewmates' voices; DC 13 SPI or compelled toward the ice-edge). Salt-Armor (passive: salt-crystals across torso provide +3 to AC). Rope-Grasp (melee, +5 to hit, 2d6+3 bludgeoning + DC 13 AGI or pulled toward the water). Burial-Debt (special: can only be laid to rest through a burning ship sent into the fjord; otherwise wails for centuries). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 12,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 145,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "cold": 100,
              "poison": 100
            }
          },
          "depth": "At dawn and dusk, the Strandvasker stands at the ice-edge, emitting a deep, foghorn-like call that mimics the voices of lost crewmates to lure the living to their doom. The only way to silence the wail is to grant the creature a proper sea-burial on a burning ship, a ritual so costly that many of these spirits are left to haunt the shores for centuries.",
          "hooks": [
            "A rumor spreads of a Strandvasker spotted near the area.",
            "Adventurers need a component from a Strandvasker to complete their quest."
          ],
          "description": "A swollen, barnacle-encrusted drowned corpse that wails along the shoreline, mimicking lost loved ones to lure sailors into the freezing water.",
          "heritage": "Born from the fear of unburied corpses cursed to wander, the Strandvasker was a maritime myth emphasizing the importance of proper burials for drowned sailors. The Wyrd anomaly consolidated the sailors' dread of cold, watery graves, manifesting these bloated, ice-encrusted corpses to crawl ashore seeking a physical resting place."
        },
        {
          "id": "landvaettir",
          "name": "Landvættir",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/landvaettir.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Landvættir",
          "role": "LandvÃ¦ttir",
          "origin": "The Landvættir-Peak stems from the Norse Landvættir, protective spirits of the land who could be offended by hostiles, and the Alpine Salvanel, the wild guardians of mountain passes. In the high ridges of Nordhalla, these giants are the living embodiment of the mountains themselves.",
          "nature": "Standing fifteen to twenty feet tall, this humanoid is composed entirely of the mountain it inhabits, featuring granite skin, snow-white hair, and clothing made of living lichen. Its texture matches the local geology so perfectly that it is invisible when still, with bird-nests in its stone shoulders and mountain goats sheltered at its feet under a ring of clear sky. Its face is an ancient cliff-face with a brow like an overhang, a nose like a broken spire, and slow-blinking eyes of glacier-blue.",
          "habitat": "It resides on the high mountain peaks, cliff faces, and alpine passes of Nordhalla.",
          "combat": "450 HP. Mountain-Meld (passive: invisible against its home mountain; +12 to stealth in terrain). Wyrd-Ward (passive: 200-ft radius; no Wyrd-creature has ever breached a slope protected by a LandvÃ¦ttir). Boulder-Hurl (ranged 60 ft, +6 to hit, 3d6+5 bludgeoning). Dragon-Prohibition (special: any dragon-image, dragon-prow, or draconic rune within 100 ft triggers instant burial in a snowslide — DC 16 AGI or buried alive). Vulnerable to acid.",
          "stats": {
            "strength": 20,
            "agility": 10,
            "constitution": 20,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 450,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "physical": 75,
              "cold": 100
            }
          },
          "depth": "The Landvættir-Peak acts as a regional barrier against Wyrd-corruption, keeping its mountain slopes completely free of anomalies and allowing Rune Keepers to map safe paths. However, they harbor a deep hatred for draconic symbols, triggering instant avalanches at the sight of dragon-prows or runes, an ancient prohibition that has banned dragon motifs from all Skald heraldry.",
          "hooks": [
            "A rumor spreads of a Landvættir spotted near the area.",
            "Adventurers need a component from a Landvættir to complete their quest."
          ],
          "description": "A colossal mountain guardian composed of living granite and snow, protecting its peaks from corruption but triggering avalanches at the sight of any dragon imagery.",
          "heritage": "Rooted in Norse beliefs in protective land spirits, the Landvættir myth was a social tool to enforce respect for local hunting and logging boundaries. The Wyrd anomaly materialized the settlers' fear of offending nature, shaping these anxieties into physical mountain guardians that lash out when local boundaries are violated."
        },
        {
          "id": "vettir",
          "name": "Frostvettir",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/vettir.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Frostvettir",
          "role": "Vettir",
          "origin": "Derived from the Norse Vettir, wind-spirits that whisper through the cracks of longhouses, and the Alpine Windgeister or Föhn spirits that ride warm mountain winds, the Frostvettir is the living soul of the storm. It represents the fickle nature of the northern winds, shifting from quiet whispers to freezing gales.",
          "nature": "Completely invisible, this creature is felt only through its physical effects: sudden drops in temperature, swirling snow forming fleeting humanoid shapes, and whispered words carried on the wind. Its arrival is heralded by an eerie, total silence, and it leaves behind intricate runic spirals in the snow that vanish in seconds. On rare occasions, the storm-front itself coalesces into a massive face of snow, shifting from a screaming giant to a serene elder, or mirroring the face of the watcher.",
          "habitat": "It hunts the open tundra, high peaks, and windswept valleys of Nordhalla.",
          "combat": "130 HP. Invisible (passive: has no physical body; perceived only through effects — swirling snow, whispered words, temperature shifts). Storm-Herd (special: directs snowfall and Föhn-wind; can create a clear corridor 30 ft wide for 1 mile, or intensify a blizzard to whiteout conditions). Whisper-Carry (passive: carries voices across impossible distances; 50% chance of adding cryptic commentary to any message). Spiral-Rune (passive: snow forms complex spiral runic patterns lasting seconds — a communication method Rune Keepers can read). Vulnerable to none (cannot be attacked physically; only dispelled by prolonged calm wind).",
          "stats": {
            "strength": 4,
            "agility": 20,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 10,
            "maxHp": 130,
            "maxMana": 50,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "physical": 100,
              "cold": 100
            }
          },
          "depth": "The Frostvettir herds storms across the landscape, controlling the paths of blizzards and Föhn winds. Rune Keepers leave offerings of mead and dried cod at high wind-shrines to secure safe passage through their territory; while Skald commanders sometimes use the wind to whisper messages across great distances, the spirits are prone to mischief, altering the words or adding cryptic riddles.",
          "hooks": [
            "A rumor spreads of a Frostvettir spotted near the area.",
            "Adventurers need a component from a Frostvettir to complete their quest."
          ],
          "description": "An invisible storm-spirit that shapes the howling winter winds, capable of carrying messages across the tundra or burying travelers in sudden blizzards.",
          "heritage": "Derived from Norse wind-spirit myths, the Frostvettir was a personification of the howling winter winds that seeped through longhouse floorboards. The Wyrd anomaly captured the extreme survival panic of villagers facing lethal blizzards, shaping these cold anxieties into physical wind-spirits that freeze travelers in their tracks."
        },
        {
          "id": "bergthrall",
          "name": "Bergthrall",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/bergthrall.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Bergthrall",
          "role": "Bergfolk",
          "origin": "The Bergthrall is born of the Alpine Bergfolk, the gem-keeping mountain-dwellers, and the Norse Dvergr, the subterranean master-smiths who forged legendary treasures and feared the sunlight. In Nordhalla, they are the silent keepers of deep crystal veins, surviving in the absolute dark of the earth.",
          "nature": "This stocky, four-foot humanoid has skin of solid granite and a beard composed of braided copper wire and frozen quartz crystals. It wears a frost-stiffened leather apron with pockets overflowing with raw, flawlessly cut blue gemstones harvested from glacial veins. Its face is flat and craggy, with a massive nose, a tight mouth set in a permanent expression of professional assessment, and glowing copper-colored eyes that can see in total darkness.",
          "habitat": "They dwell in the deep crystal caverns and subterranean mines beneath the mountains of Nordhalla.",
          "combat": "80 HP. Crystal-Cut (passive: working in absolute darkness, cuts glacier-crystals that Rune Keepers use for light-scroll storage; without Bergthrall-cut crystals, the Archive's system would collapse). Gem-Throw (ranged 30 ft, +5 to hit, 1d8+2 bludgeoning — uses raw gemstones as ammunition). Stone-Absorb (special: cheaters are absorbed into the mountain, becoming new mineral veins — no save, instant, permanent). Chisel-Hands (melee, +4 to hit, 1d6+2 piercing). Vulnerable to fire.",
          "stats": {
            "strength": 12,
            "agility": 10,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 80,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "physical": 50,
              "cold": 50
            }
          },
          "depth": "The Bergthralls carve the unique glacier-crystals used by Rune Keepers to store fragile light-scrolls in the Frozen Archive, a technique that cannot be replicated. They refuse gold, trading these crystals only for refined iron and whale-blubber; their bargains are absolute, and any who attempt to cheat them are absorbed directly into the stone, transformed into new mineral veins.",
          "hooks": [
            "A rumor spreads of a Bergthrall spotted near the area.",
            "Adventurers need a component from a Bergthrall to complete their quest."
          ],
          "description": "A stone-skinned dwarven craftsman of the deep caverns who cuts flawless glacier-crystals, trading them for iron and blubber under the threat of petrifaction.",
          "heritage": "Spun from Norse myths of subterranean dwarf-smiths, the Bergthrall was a legend to explain how miraculous, rune-etched iron tools and weapons were forged. The Wyrd anomaly reacted to the smiths' desire for crafting perfection and their isolation in deep caverns, manifesting these stony humanoids to forge weapons and guard ancient holds."
        },
        {
          "id": "fenris",
          "name": "Fenris",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/fenris.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Fenris",
          "role": "Fenrir/FenrisÃºlfr",
          "origin": "The Fenris is a juvenile manifestation of the Norse Fenrir, the apocalyptic wolf bound by the gods until Ragnarök, mixed with the Alpine Barbegazi who navigate deep snow with ease. It embodies the restless, bound fury of the end times, hunting the frozen wastes of Nordhalla.",
          "nature": "Though only a pup, this creature is the size of a pony, with fur that shifts between frost-white and shadow-black and giant, shield-wide paws that glide over snow drifts. It wears a collar of braided silk ribbon that glows with the golden magic of Gleipnir, and its thick tail leaves a distinct drag-mark behind it. Its face displays a puppy's oversized ears and lolling tongue, but its eyes can suddenly flash with an ancient, predatory intelligence, turning from warm brown to molten gold when it senses an oath-breaker.",
          "habitat": "It hunts across the windswept tundra and frozen plains of Nordhalla.",
          "combat": "220 HP. Bound-Hunter (passive: hunts oath-breakers; can track any creature who has broken a sworn vow within 100 miles). Gleipnir-Collar (passive: collar of braided silk prevents growth to full size; if removed (requires god-level strength), the pup immediately grows to full Fenrir — a continent-ending catastrophe). Puppy-Bite (melee, +6 to hit, 2d6+4 piercing). Eye-Shift (passive: eyes shift from puppy-brown to molten gold near oath-breakers, marking targets). Snowshoe-Paws (can run across deep snow without sinking). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 18,
            "constitution": 14,
            "intelligence": 8,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 220,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 50,
            "resistances": {
              "cold": 50,
              "physical": 25
            }
          },
          "depth": "Driven by Fenrir's bound energy, the Fenris relentlessly tracks down those who break blood-oaths across the tundra; they cannot be slain, only temporarily appeased or distracted with fresh meat. The golden collar around its neck is a fragment of the legendary fetter Gleipnir, keeping it from growing to its full, world-ending size. Rune Keepers watch these creatures closely, for the removal of a collar would trigger a catastrophic growth that could tear Nordhalla apart.",
          "hooks": [
            "A rumor spreads of a Fenris spotted near the area.",
            "Adventurers need a component from a Fenris to complete their quest."
          ],
          "description": "A pony-sized wolf cub bound by a magical collar that hunts down oath-breakers, representing a fragment of the apocalyptic Fenrir.",
          "heritage": "A manifestation of apocalyptic wolf myths, the Fenris was a folklore representation of the wild, untamable hunger of winter predators. The Wyrd anomaly consolidated the shepherds' terror of winter wolf packs and the fear of the end times, shaping these anxieties into massive, fast-growing wolf pups that hunt the snowy crags."
        },
        {
          "id": "disir",
          "name": "Disir Wraith",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/disir.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Disir Wraith",
          "role": "DÃ­sir",
          "origin": "The Disir Wraith represents the Norse Dísir, female ancestral guardians honored during the Dísablót who bless or curse their descendants, and the Alpine Perchta's Retinue, who punish sloth and household neglect. They manifest during the deep winter to ensure ancestral traditions are upheld.",
          "nature": "This entity appears as a procession of tall, pale women in flowing white gowns who glide over the snow without leaving footprints. Each figure carries a ritual object—a distaff, a bloody spindle, a sheaf of wheat, or an iron knife—and holds a tallow candle that burns with a constant, unmeltable blue flame. They share identical, sorrowful faces with solid white, unblinking eyes, their mouths slightly parted to emit a continuous, low hum.",
          "habitat": "They travel between the longhouses and settlements of Nordhalla during the winter solstice.",
          "combat": "160 HP. Ancestral-Judge (special: visits longhouses during winter dÃ­sablót; families honoring female dead receive blessings of warmth and fertility — +4 to CON for 1 month). Spindle-Curse (special: negligent families find spindles filled with frozen blood; every woman in the household becomes barren until offerings resume — DC 15 SPI to resist). Blue-Candle (passive: each carries a tallow candle burning blue; the candles never melt or shorten). Hair-Grasp (melee, reach 10 ft, +5 to hit, 2d6+3 cold). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 160,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "psychic": 50
            }
          },
          "depth": "Visiting every longhouse during the winter celebrations, the wraiths bless families who honor their female ancestors with warmth and fertility. However, households that neglect their duties are struck by the Spindle-Curse, finding their yarn replaced with human hair and their spindles soaked in frozen blood, rendering the women of the house barren. Bloodhammer matriarchs view this curse as a threat far greater than any raiding army, going to extreme lengths to ensure their offerings are immaculate.",
          "hooks": [
            "A rumor spreads of a Disir Wraith spotted near the area.",
            "Adventurers need a component from a Disir Wraith to complete their quest."
          ],
          "description": "A procession of silent, pale spectral matriarchs who judge households during winter, rewarding ancestral devotion and cursing the negligent with barrenness.",
          "heritage": "Rooted in ancestral guardian worship, the Disir Wraith was a folklore mechanism to honor family bloodlines and explain why some families were blessed while others were cursed. The Wyrd anomaly reacted to the descendants' fear of family extinction and genetic blight, manifesting these spectral female guardians to watch over or purge their lineage."
        },
        {
          "id": "skogsra",
          "name": "Skogsrå",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/skogsra.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Skogsrå",
          "role": "Skogsrå",
          "origin": "The Skogsrå is born of the Norse Skogsrå, a seductive, hollow-backed forest-spirit who grants fortune but punishes betrayal, and the Alpine Waldmännlein, who defend old-growth forests from the woodsman's axe. She is the wild soul of the ancient pines, guarding the deep woods of Nordhalla.",
          "nature": "From the front, she appears as a stunning woman with skin of textured birch bark, hair of silver moss, and a gown of living pine needles that shifts from green in the warmth to grey-blue in the biting cold. From behind, however, she is a hollowed-out pine trunk filled with nesting forest birds and decaying wood, with a fox tail peeking out from the hem of her gown. Her face is heart-shaped and beautiful, dominated by large, dark eyes full of forest-knowing and a smile that is both warm and unsettling.",
          "habitat": "She dwells within the ancient pine forests and old-growth timberlands of Nordhalla, particularly the Valley of Ymir.",
          "combat": "155 HP. Hollow-Back (passive: from the front, stunningly beautiful; from behind, a hollow tree-cavity — if seen, DC 14 SPI or shaken for 1 round). Hunter's-Gift (special: grants impossible accuracy to lone hunters; price: never turn your back, never reveal her — break either rule and walk in circles until you freeze). Fox-Tail (passive: a fox tail peeks from beneath her gown; visible only when she moves quickly). Ice-Axe-Curse (special: turns axes to ice that shatters on first stroke). Vulnerable to cold iron.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 18,
            "maxHp": 155,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "The Skogsrå frequently offers her favor to lone Skald hunters, granting them supernatural accuracy on the condition that they never look at her back and never speak of her; those who break this covenant are cursed to wander in circles until they freeze. She also acts as a fierce warden of the trees, turning the axes of woodcutters into brittle ice that shatters on impact. The oldest pines in the Valley of Ymir are so heavily guarded by her presence that even the Rune Keepers refuse to harvest them.",
          "hooks": [
            "A rumor spreads of a Skogsrå spotted near the area.",
            "Adventurers need a component from a Skogsrå to complete their quest."
          ],
          "description": "A seductive forest guardian who appears as a beautiful woman from the front but is a hollow, rotting tree from behind, rewarding respectful hunters while cursing loggers.",
          "heritage": "Born from forest-guardian myths, the Skogsrå was a warning story to enforce strict moral codes among woodcutters, warning that greed would lead to starvation. The Wyrd anomaly materialized this forest guilt and the fear of losing resources, manifesting this seductive forest keeper who grants luck to the respectful and death to the greedy."
        },
        {
          "id": "kraken",
          "name": "Kraken",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/kraken.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kraken",
          "role": "Kraken",
          "origin": "The Kraken arises from the Norse Kraken, the legendary leviathan of the deep seas whose size rivaled islands, and the Alpine Seeschlange, the giant serpents reported to dwell in deep mountain lakes. It embodies the hidden horrors of the frozen northern waters, waiting beneath the thick sheets of ice.",
          "nature": "This creature manifests as enormous, semi-transparent tentacles as thick as longship masts, covered in barbed ice-suckers capable of crushing stone. Its skin reveals dark sub-glacial water pulsing through visible veins, highlighted by bioluminescent organs that glow in slow, rhythmic pulses. Its actual face is rarely seen, resting in deep fjord trenches, but when it surfaces, it reveals a massive parrot-like beak of black ice flanked by glowing indigo eyes the size of shields.",
          "habitat": "It lives in the deep fjord trenches, ice-covered seas, and coastal waters of Nordhalla.",
          "combat": "450 HP. Tentacle-Slam (melee, reach 30 ft, +7 to hit, 2d10+5 bludgeoning + DC 15 AGI or grappled). Ice-Breaker (special: shatters ice beneath a vessel, plunging it into freezing water; the ship sinks in 2 rounds). Island-Trick (passive: when dormant, its back pushes against fjord-ice, creating a dome resembling an island; test by driving iron spikes through the surface — if dark water bleeds, it's the Kraken). Bioluminescent-Pulse (passive: organs pulse along tentacles in slow rhythms, visible through ice). Beak-Crush (melee, only against grappled targets, 3d8+5 piercing). Vulnerable to lightning.",
          "stats": {
            "strength": 22,
            "agility": 10,
            "constitution": 20,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 450,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 10,
            "resistances": {
              "cold": 100,
              "physical": 50,
              "piercing": 50
            }
          },
          "depth": "The Kraken is a dread destroyer of ships, attacking by shattering the thick surface ice from below and dragging vessels into the freezing waters before the crew can escape. When dormant, its massive back presses against the ice to form a dome that resembles a natural island; experienced Skald captains test these ice-islands by driving iron spikes deep into the frost, fleeing immediately if the wound bleeds dark water.",
          "hooks": [
            "A rumor spreads of a Kraken spotted near the area.",
            "Adventurers need a component from a Kraken to complete their quest."
          ],
          "description": "A colossal sub-glacial leviathan whose massive tentacles shatter ice sheets to drag entire fleets into the freezing depths.",
          "heritage": "Spun from the ultimate dread of the open ocean, the Kraken myth was a maritime caution to explain how entire fleets vanished without a trace in the deep. The Wyrd anomaly consolidated the sailors' survival panic and the absolute terror of the unknown waters, manifesting this legendary, ship-crushing leviathan in the sub-zero bays."
        },
        {
          "id": "marmennill",
          "name": "Marmennill",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/marmennill.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Marmennill",
          "role": "Marmennill",
          "origin": "The Marmennill stems from the Norse Marmennill, a prophetic merman captured by fishermen who answered questions in riddles, and the Norse and Alpine Nix or Näkki, water-spirits that lure victims to the deep with enchanted music. It represents the mystery and allure of the frozen northern fjords.",
          "nature": "This three-foot-tall humanoid has a fish-like lower body covered in iridescent, ice-blue scales and a lean, grey-skinned upper torso with webbed hands and a broad throat-sac. It wears a crooked crown of pale volcanic coral and carries a tiny harp made of fish-bone and strings of sea-ice, its scales casting a soft blue bioluminescence in the dark. Its face features wide, frog-like eyes of different blue shades that blink independently, a nose reduced to sealing slits, and an enormous, jointless grin packed with tiny, sharp teeth.",
          "habitat": "It dwells in the ice-locked fjords, coastal pools, and deep waters of Nordhalla.",
          "combat": "130 HP. Oracle-Answer (special: if caught with a runic-bait line, answers 3 questions about the future in riddles so dense that interpretation takes years; after the third answer, dissolves into sea-water — the creature dies to share its knowledge). Harp-Song (AoE 40 ft, DC 13 SPI or dream-state, compelled toward the fjord-edge; whale-blubber earplugs negate). Bone-Harp-Bash (melee, +4 to hit, 1d4 bludgeoning — it is not a combat creature). Slippery (advantage on all escape/grapple checks). Vulnerable to lightning.",
          "stats": {
            "strength": 6,
            "agility": 16,
            "constitution": 10,
            "intelligence": 16,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "Fishermen can capture the Marmennill using lines baited with runic inscriptions, forcing it to answer three questions about the future; however, its replies are always framed in riddles so complex that Rune Keepers spend decades deciphering them before the creature dissolves back into sea-water. When free, they sit on submerged rocks and play bone-harps, creating melodies that induce a dreamlike state and draw listeners into the freezing waters, forcing Skald sentries to plug their ears with whale-blubber during the creature's mating season.",
          "hooks": [
            "A rumor spreads of a Marmennill spotted near the area.",
            "Adventurers need a component from a Marmennill to complete their quest."
          ],
          "description": "A small, glowing merman who plays enchanting melodies on a bone-harp, offering cryptic prophecies when captured with runic bait.",
          "heritage": "Born from Norse legends of prophetic mermen caught in nets, the Marmennill was a fisherman's myth to explain how some predicted storms and massive fish runs. The Wyrd anomaly reacted to the desire for safe passage and full nets, materializing this aquatic seer who answers riddles for silver but curses those who pollute."
        },
        {
          "id": "havgammel",
          "name": "Havgammel",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/havgammel.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Havgammel",
          "role": "Havfrue/Havmand",
          "origin": "The Havgammel is derived from the Norse Havfrue and Havmand, merfolk who grant prophecies or ruin fishing catches, and the Alpine Tatzelwurm-Ice variants, elemental beasts adapted to sub-zero temperatures. It is a creature of dual natures, reflecting the shifting and unpredictable dangers of the frozen ocean.",
          "nature": "This creature shifts instantaneously between two distinct forms depending on the observer's intent: a beautiful, pale woman with a seal-like lower body covered in deep blue-black scales, and a monstrous, serpentine beast with a cat-like head and a body of compressed frost and clicking, translucent ice-plates. In both forms, it wears a necklace of scrimshaw bone depicting scenes of drowning. Its face changes from a delicate, sea-green eyed porcelain beauty to a fanged, angular visage with pupilless white eyes that radiate absolute cold.",
          "habitat": "It resides in the deepest fjords, frozen bays, and ice-floe fields of Nordhalla.",
          "combat": "135 HP. Form-Shift (1 AP: shifts between mermaid-form (guide ships to safety, bless catches) and serpent-form (create ice-floes that trap ships); the shift depends on observer intent — malicious intent triggers serpent-form). Scrimshaw-Necklace (passive: depicts drowning scenes; studying it reveals the location of sunken wrecks). Coin-Bargain (special: a silver coin tossed before casting nets yields overflowing harvests; pollution yields nets of carved bones). Vulnerable to lightning.",
          "stats": {
            "strength": 12,
            "agility": 14,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 135,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100
            }
          },
          "depth": "The Havgammel can bless fishermen with bountiful catches in exchange for a silver coin, but she will curse those who pollute or waste life, returning only nets of carved bones and solid ice. Her dual nature makes her an unpredictable force for sailors; in her mermaid guise, she guides lost vessels to safety, but in her serpentine form, she creates the very ice-floes that trap and crush them, leaving Skald captains to gamble their lives with every encounter.",
          "hooks": [
            "A rumor spreads of a Havgammel spotted near the area.",
            "Adventurers need a component from a Havgammel to complete their quest."
          ],
          "description": "A shifting marine entity that oscillates between a beautiful mermaid and a terrifying frost serpent, blessing or cursing catches while guiding ships to safety or crushing them in ice.",
          "heritage": "Derived from merfolk legends, the Havgammel was a maritime warning story used to explain why fishing catches suddenly turned to stone and why anchors snagged. The Wyrd anomaly materialized the coastal villagers' fear of ocean anger, shaping their anxieties into an ancient, shape-shifting seal-spirit that dictates the fate of catches."
        }
      ]
    },
    {
      "id": "sundale",
      "name": "Sundale & Emberspire",
      "folklore": "Mesopotamian/Zoroastrian + Egyptian",
      "creatures": [
        {
          "id": "sirrush",
          "name": "Sirrush",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/sirrush.png",
          "illustrationCaption": "A Sirrush dragon standing alert on a basalt ridge, its long scaled neck arched",
          "role": "The horned dragon-serpent",
          "origin": "The Sirrush is a creature of the ancient world, born from the Babylonian myths of the Mušḫuššu, the dragon-serpent that guarded the gates of the gods. In Sundale, where the desert sands cover the ruins of ten thousand years, the Sirrush is a rare and sacred beast, a guardian of the ancient temples and the secrets they hold. The Wyrd's corruption did not change the Sirrush's nature, but it did make it more solitary, for the creature now sees all mortals as potential thieves, and it guards its treasures with a ferocity that is legendary. The nomads of Sundale believe that the Sirrush is the reincarnation of the ancient kings, and that to kill one is to bring a curse upon ten generations.",
          "nature": "A slender, quadrupedal dragon with feline front paws, eagle-claw hind legs, and a long scaled neck ending in a horned, serpentine head. Its scales are a dusty ochre-yellow that matches the desert sands, and it has a single, straight crown-horn that glows with a faint, golden light. The Sirrush moves with the grace of a lion and the speed of a falcon, and its eyes are the color of ancient bronze, wise and wary. It is intelligent enough to recognize peaceful intentions, but it will aggressively hunt those who desecrate ancient structures.",
          "habitat": "The Sirrush dwells in the desert ruins, basalt arches, and sandy dunes of Sundale, particularly in the Valley of the Forgotten Kings where the ancient temples lie buried beneath the sand. It is most active during the dawn and dusk, when the heat is bearable and the light is golden, and during the rare rainstorms that turn the desert into a brief, blooming paradise. The Sirrush's lair is always near a source of water, for the creature is a symbol of life in the desert, and it guards the water as fiercely as it guards the ruins.",
          "combat": "200 HP. Tail Whip (+5 to hit, 2d6+3 physical, DC 13 AGI save or knocked back 10 ft). Crown Strike (+5 to hit, 2d8+3 physical, ignores 3 points of physical armor). Sand Veil (can teleport 30 ft in a swirl of dust for 1 AP). Vulnerable to rime.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 200,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 45,
            "resistances": {
              "ember": 50
            }
          },
          "depth": "Regarded as sacred guardians by local nomads. They are intelligent enough to recognize peaceful intentions but will aggressively hunt those who desecrate ancient structures. The Sirrush's crown-horn is said to be the key to the greatest temple in Sundale, a place where the gods once walked among mortals, and many have died seeking to take it. The nomads believe that the Sirrush is the last of the old guardians, and that when it dies, the desert will swallow the last of the ancient world.",
          "hooks": [
            "A Sirrush is guarding the entrance to a forgotten tomb. The party must solve a riddle or present a token of respect to pass without combat.",
            "Poachers are hunting the Sirrush for its rare scales and obsidian horn. Protect the beast and locate the poachers' camp."
          ],
          "heritage": "Rooted in Mesopotamian myth, the Sirrush was a legendary dragon-serpent that guarded the gates of the gods, serving to deter mortals from entering holy structures. When the Wyrd anomaly seeped into Sundale, it reacted directly to the priests' obsession with protection, physically manifesting this horned sentinel to guard the volcanic vaults of Emberspire."
        },
        {
          "id": "aswad",
          "name": "Aswad",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/aswad.png",
          "illustrationCaption": "An Aswad wisp peeking out of its soot-blackened clay jar, its ember-eye glowing",
          "role": "The clay-pot wisp",
          "origin": "The Aswad is a creature of the hearth and the fire, born from the Mesopotamian myths of the furnace-demons and the Zoroastrian preservation of fire. In Sundale, where the desert is cold at night and the fires burn day and night, the Aswads are the spirits of the hearth, small creatures that live in the embers and keep the fires burning. The Wyrd's corruption did not change their nature, but it did make them more protective, for the creature now sees all water as a threat, and it will attack anyone who tries to extinguish its fire. The shepherds and miners of Sundale carry embers in clay jars, and when the embers wake, they know that the Aswad has chosen to protect them.",
          "nature": "A tiny wisp residing inside a soot-blackened, cracked earthenware jar. Inside is a single, large glowing charcoal ember that acts as its eye, and it walks on small, twig-like clay legs that stick out of the bottom of the pot. The creature eats ash and soot to sustain its fire, and it emits a soft, crackling sound that is comforting to those who know it. It is harmless and cute, but it will aggressively spit embers if its jar is struck or water is thrown on it, and its rage is a terrible thing to behold.",
          "habitat": "The Aswad lives in the kitchen stoves, basalt furnaces, and ash heaps of Sundale, particularly in the nomad camps where the fires burn day and night. It is drawn to places where the fire is strong and the ash is plentiful, and it is most active during the cold desert nights, when the fire is most needed. The Aswad's jar is its home and its body, and it will defend it with its life, for without the jar, the creature is just a wisp of smoke.",
          "combat": "130 HP. Ember Spit (ranged, +4 to hit, 1d6 ember damage). Soot Shield (vents smoke from its jar, DC 12 AGI to hit it with ranged attacks). Ember Resist (immune to ember). Vulnerable to water (extinguishes the wisp instantly).",
          "stats": {
            "strength": 4,
            "agility": 14,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 130,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "ember": 100
            }
          },
          "depth": "A harmless and cute hearth-companion. They keep stoves hot and chimneys clear, but will aggressively spit embers if their jar is struck or water is thrown on them. The Aswad's ember-eye is said to see the true nature of those who look into it, and some sages use the creatures to test the character of strangers. The Wyrd's corruption has made the Aswad more protective, but it has not dimmed its warmth, and a home with an Aswad is a home that is never cold.",
          "hooks": [
            "An Aswad has nested inside a tavern's brewing oven, making it so hot that the casks are bursting. Move it safely without using water, which would kill it.",
            "A scholar needs a piece of the soot-bark that Aswads use to line their jars, believing it can insulate alchemical flasks against extreme cold."
          ],
          "heritage": "Spun from Mesopotamian hearth-demon lore and the Zoroastrian devotion to fire, the Aswad originally rationalized the erratic jumping of furnace sparks and the fear of losing fire in winter. The Wyrd anomaly reacted to the foundries of Emberspire, materializing these clay-pot wisps to actively siphoning thermal energy to fuel their flame."
        },
        {
          "id": "serpopard",
          "name": "Serpopard",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/serpopard.png",
          "illustrationCaption": "A Serpopard crouching in the shadow of a basalt arch, its long serpentine neck coiled to strike",
          "role": "The serpentine leopard",
          "origin": "The Serpopard is a creature of the desert shadows, born from the ancient Egyptian and Mesopotamian art that depicted feline beasts with serpentine necks. In Sundale, where the basalt canyons are deep and the sun is merciless, the Serpopards are the apex predators of the rocky wastes, creatures that have evolved to hunt in the narrow spaces between the cliffs. The Wyrd's corruption did not change their nature, but it did make them more cunning, for the creature now understands the value of ambush, and it will wait for days for the perfect moment to strike. The desert traders know the signs of a Serpopard's territory—scratches on the canyon walls, and the bones of its prey arranged in patterns that are almost artistic.",
          "nature": "A sleek, spotted desert leopard with a neck as long and flexible as a python, its head an elegant blend of feline grace and reptilian features. The creature's scales are the color of the desert rocks, and its eyes are vertical slits that glow with a faint, golden light. It moves with a silent, undulating sway, coiling its long neck before lunging from the shadows with the speed of a striking snake. The Serpopard is a solitary hunter, and it is fiercely territorial, marking its domain with the bones of its prey.",
          "habitat": "The Serpopard inhabits the basalt canyons, rocky ravines, and volcanic cliffs of Sundale, particularly in the Serpent's Spine where the canyons are narrow and the shadows are deep. It is most active during the dawn and dusk, when the light is low and the prey is active, and during the rare sandstorms that reduce visibility to zero. The Serpopard's lair is always in the highest, most inaccessible part of the canyon, and it is said to be a nest of bones and treasure, the remains of a thousand years of hunting.",
          "combat": "285 HP. Serpentine Lunge (melee, reach 15 ft, +6 to hit, 2d8+4 physical, DC 14 AGI save or grappled). Constrict (deals 2d6+4 crushing damage to a grappled target). Hypnotic Sway (DC 13 SPI save or target has disadvantage on attack rolls for 2 rounds). Vulnerable to rime.",
          "stats": {
            "strength": 16,
            "agility": 16,
            "constitution": 14,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 285,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 40,
            "resistances": {
              "ember": 50
            }
          },
          "depth": "Lethal, solitary predators. They hunt by coiling around high basalt arches and lunging down on travelers, wrapping their long necks around the prey to crush them. The Serpopard's serpentine neck is a marvel of evolution, a combination of the leopard's strength and the snake's flexibility, and it is said that the creature can squeeze with enough force to crush stone. The Wyrd's corruption has made the Serpopard more cunning, but it has not changed its essential nature—it is a hunter, and the desert is its kingdom.",
          "hooks": [
            "A merchant caravan was ambushed in the canyon by a mated pair of Serpopards. The survivors are trapped on a cliff ledge.",
            "A wealthy noble wants a winter cloak made of Serpopard fur, offering a hefty reward for a clean hide."
          ],
          "heritage": "Originally created to explain the silent stealth of desert predators that stalked livestock in the night, the Serpopard was a warning myth to keep herders close to their campfires. The Wyrd anomaly consolidated the fear of the shifting desert shadows, manifesting this long-necked feline to hunt the ash dunes of Sundale."
        },
        {
          "id": "lamassu",
          "name": "Lamassu",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/lamassu.png",
          "illustrationCaption": "A stone-carved Lamassu with a crowned human face and winged bull body, standing guard",
          "role": "The winged bull sentinel",
          "origin": "The Lamassu is a creature of the ancient world, born from the Mesopotamian mythology of the protective deities that guarded the gates of the gods. In Sundale, where the temples are ancient and the seals are strong, the Lamassus are the last guardians of the old world, creatures that have stood watch for ten thousand years. The Wyrd's corruption did not change their nature, but it did make them more suspicious, for the creature now sees all who approach as potential thieves, and it will not open the gate until it is satisfied that the visitor is worthy. The scholars of Sundale study the Lamassus, trying to learn the secrets of their construction, for the creatures are made of a stone that is harder than any known material, and their runes are written in a language that has been dead for millennia.",
          "nature": "A majestic sentinel carved from volcanic basalt, featuring the body of a bull, massive eagle wings, and a crowned, bearded human face. Runic gold mortar glows in its stone joints, and its eyes are carved from a gemstone that shines with a faint, golden light. The creature stands silent at tomb doors, speaking in a low, resonant rumble that can be felt in the bones of those who hear it. It is bound to a specific location, and it cannot move more than a hundred feet from the gate it guards. The Lamassu is a creature of law and order, and it will negotiate with travelers who show knowledge of the old ways, but it will destroy any who try to force the gate.",
          "habitat": "The Lamassu stands at the ancient stone entrances, basalt temples, and sacred vaults of Sundale, particularly in the Temple of the Forgotten Gods where the greatest treasures of the old world are hidden. It is active at all times, for the creature does not sleep, and it is most dangerous during the full moon, when the runes on its body glow with a light that is blinding to mortal eyes. The Lamassu's presence is a sign that the temple is still sealed, and that the treasures within are still safe.",
          "combat": "420 HP. Runic Stomp (+6 to hit, 2d8+5 physical, DC 14 CON save or stunned for 1 round). Sunburst Wing (AoE, DC 14 SPI save or blinded by radiant light for 1 round). Stone Ward (takes 5 less damage from all physical attacks). Vulnerable to blight.",
          "stats": {
            "strength": 18,
            "agility": 10,
            "constitution": 16,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 420,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "physical": 50,
              "ember": 50
            }
          },
          "depth": "Sacred, lawful constructs bound to protect the seals of ancient tombs. They will negotiate with travelers who show deep knowledge of historical runes or carry a royal seal. The Lamassu's gold mortar is a mystery to alchemists, for it is harder than any known metal and it glows with a light that is not fire. Some scholars believe that the mortar is made of the same material as the sun, and that the Lamassu is a piece of the sky, brought down to guard the earth.",
          "hooks": [
            "An excavation team is trapped inside a tomb because the Lamassu sentinel at the door woke up and sealed the exit, demanding a runic riddle's answer.",
            "A corrupt collector wants to chisel the runic gold gold-mortar out of a sleeping Lamassu, risking waking the beast."
          ],
          "heritage": "Rooted in ancient sentinel mythology, the Lamassu served as a protective deity to guard royal palaces and ward off evil forces. The Wyrd anomaly acted upon the miners' and scholars' deep desire for sanctuary amidst the ash desert, materializing these winged bulls to stand as physical guardians at the gates of Emberspire."
        },
        {
          "id": "ushabti",
          "name": "Ushabti",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/ushabti.png",
          "illustrationCaption": "An Ushabti construct carrying a clay sickle-sword, decorated in blue lapis lazuli",
          "role": "The clay servant sentinel",
          "origin": "The Ushabti is a creature of the afterlife and the earth, born from the ancient Egyptian funerary practices of the Ushabti, the servant figurines that were placed in tombs to serve the dead in the next world. In Sundale, where the tombs are ancient and the dead are powerful, the Ushabtis are the last servants of the old kings, creatures that have been waiting for ten thousand years to fulfill their purpose. The Wyrd's corruption did not change their nature, but it did make them more vigilant, for the creature now sees all who enter the tomb as potential thieves, and it will attack any who disturb the sleep of the dead. The tomb robbers of Sundale fear the Ushabtis, for they are relentless, and they cannot be bribed or reasoned with.",
          "nature": "A life-sized terracotta construct painted with patterns of blue lapis lazuli and gold leaf, its body stiff and its movements grinding like stone on stone. It carries a heavy clay sickle-sword (khopesh) and moves with the precision of a clockwork mechanism, its eyes painted with a glaze that seems to follow the viewer. The creature is bound to a specific tomb chamber, and it stands motionless until the seal is broken, at which point it activates and begins its patrol. The Ushabti is a mindless construct, but it is also a thing of terrible beauty, and some scholars study the creatures to learn the secrets of the old art.",
          "habitat": "The Ushabti stands in the tomb vaults, basalt corridors, and treasure chambers of Sundale, particularly in the Pyramid of the Eternal Sun where the greatest of the old kings are buried. It is active only when the tomb is disturbed, and it is most dangerous during the new moon, when the darkness is deepest and the dead are closest to the world of the living. The Ushabti's presence is a sign that the tomb is still sealed, and that the treasures within are still guarded.",
          "combat": "180 HP. Sickle Slash (+5 to hit, 2d6+3 physical, DC 13 CON save or target bleeds for 1d6 damage per round). Clay Shield (takes 3 less damage from physical attacks). Shatter (if destroyed, explodes in a shower of sharp clay shards, dealing 2d6 physical to all nearby). Vulnerable to physical.",
          "stats": {
            "strength": 14,
            "agility": 10,
            "constitution": 16,
            "intelligence": 4,
            "spirit": 10,
            "charisma": 4,
            "maxHp": 180,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "physical": 50,
              "ember": 100
            }
          },
          "depth": "Mindless construct servants built to protect and maintain the tomb. They follow simple verbal commands left by their creators thousands of years ago. The Ushabti's lapis lazuli paint is a mystery to alchemists, for it is brighter than any modern pigment and it does not fade. Some scholars believe that the paint is made of the same material as the sky, and that the Ushabti is a piece of the heavens, brought down to serve the earth.",
          "hooks": [
            "A group of archaeologists woke a squad of Ushabtis, who are now methodically clearing the campsite outside the tomb.",
            "A collector wants the golden headpiece of an Ushabti to study the ancient gold-leaf bonding technique."
          ],
          "heritage": "Derived from ancient Egyptian funerary practices, the Ushabti originally served as a symbolic servant to perform tasks for the deceased in the afterlife. The Wyrd anomaly reacted to the heavy toil and exhaustion of Sundale's builders, animating these clay servant homunculi to perform endless labor in the hot foundries."
        },
        {
          "id": "pazuzu",
          "name": "Pazuzu",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/pazuzu.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Pazuzu",
          "role": "Pazuzu",
          "origin": "The Pazuzu is a creature born of ancient chaos and volcanic fury, tracing its mythic lineage to the legendary wind-demons of Mesopotamian lore, whose king was a malevolent force that paradoxically protected humanity against plagues. Combined with this dual nature is the shadow of Sutekh, the Egyptian god of storms and desert storms, whose enigmatic Set Animal—characterized by its square ears and curved snout—manifests in the creature's hybrid form, anchoring its role as a chaotic warden of Sundale's scorched wastes.",
          "nature": "Standing eight feet tall, the Pazuzu is a terrifying sight, its winged, humanoid form crafted from the porous volcanic basalt of the Sundale plains, hot to the touch and black as soot. Four massive eagle-wings of compressed ash and superheated wind fold across its back, constantly shedding glowing embers as it moves. Its forearms terminate in fearsome lion-claws, its taloned feet grip the stone, and a segmented scorpion-tail curves menacingly from its spine, while a heavy amulet of hammered bronze hangs about its neck. Its face is a monstrous amalgamation of the Set Animal's long, narrow snout and a wide, grinning maw, crowned by erect, square ears and lit by the furious red glow of its eyes.",
          "habitat": "These wind-demons dwell within the thermal updrafts and jagged basalt cliffs of Sundale and the Emberspire terrain. They build their nests high on the precipices of volcanic calderas, riding the searing heat waves that rise from the boiling earth below.",
          "combat": "380 HP. Ash-Storm (AoE 40 ft, 3d6 slashing from ash + DC 15 CON or blinded 2 rounds). Lion-Claw (melee, +7 to hit, 2d8+5 slashing). Plague-Ward (passive: presence drives away disease-carrying Wyrd-creatures within 200 ft; Thrask deliberately build outposts near nesting-cliffs). Thermal-Rider (can fly indefinitely on volcanic updrafts). Scorpion-Sting (melee, reach 10 ft, DC 15 CON or poisoned: 2d6 poison/round for 3 rounds). Vulnerable to cold.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 16,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 380,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 25
            }
          },
          "depth": "This four-winged gale-spirit refuses to fight anyone who speaks its true name backwards. It is obsessed with collecting coins from dead empires; it will exchange ancient secrets or redirect a sandstorm if paid in gold from a dynasty that no longer exists.",
          "hooks": [
            "A scholar needs a coin from a dead empire to bargain with a Pazuzu.",
            "A sandstorm threatens a town unless a storm-spirit's name is spoken backward."
          ],
          "description": "A towering wind-demon of basalt and compressed ash, bearing the monstrous visage of ancient storm gods. It sweeps through the volcanic reaches of Sundale, scouring the land with ash-storms while paradoxically warding off corrupting plagues.",
          "heritage": "Spun from Mesopotamian wind-demon myths, the Pazuzu was feared as a bringer of locusts and dry, blistering windstorms that ruined crops. The Wyrd anomaly consolidated the farmers' and miners' fear of famine and toxic sulfur fumes, physically manifesting this winged fiend to control the hot volcanic drafts of Sundale."
        },
        {
          "id": "tiamat_scale",
          "name": "Scale of Tiamat",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/tiamat_scale.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Scale of Tiamat",
          "role": "Tiamat",
          "origin": "In the blistering depths of the Sundale caldera, the Scale of Tiamat embodies the ancient mythic forces of primordial creation and destruction. Its lineage is tied to Tiamat, the Babylonian dragon-goddess of the salt sea and mother of monsters, and Apep, the Egyptian chaos-serpent that sought to devour the sun each night. Twisted by the reality-warping influence of the Wyrd, this beast serves as an eternal enemy of cosmic order, seeking to consume light and heat wherever it can find them.",
          "nature": "The Scale of Tiamat is a massive, multi-headed serpent whose obsidian scales are shot through with veins of glowing, molten orange, creating a shifting crust of cooling magma. Each of its serpentine heads branches from a central, muscular trunk, terminating in a unique jaw shape—some needle-toothed and narrow, others broad and crushing—all flanking a perpetually dripping, lamprey-like mouth. The creature's belly glows with the fierce heat of a forge, and as it slithers, it sheds scales that cool into fields of razor-sharp glass. Its heads are crowned with single, iris-less eyes like burning white coals, which spin and track independently to grant the beast a complete three-hundred-and-sixty-degree view of its surroundings.",
          "habitat": "These massive glass serpents make their home in the slow-flowing lava rivers and molten channels that radiate from Emberspire. They swim effortlessly through the superheated rock, completely at home in the deepest, most volcanic crevices of the region.",
          "combat": "560 HP. Multi-Head-Strike (attacks with all heads each round; each head targets independently). Lava-Swim (can move through molten rock at full speed; immune to fire). Obsidian-Shed (passive: sheds scales that create fields of razor-sharp obsidian; difficult terrain that deals 1d6 slashing per square entered). Sun-Devour-Coil (special: coils around sources of concentrated sun-heat, draining them; if it reaches the Solbrand, it could extinguish the sun-god's last ember). Magma-Breath (AoE cone 30 ft, 4d6 fire, DC 16 CON or continue burning for 2d6/round). Vulnerable to cold (cold damage slows it, reducing AP by 1 per cold attack landed).",
          "stats": {
            "strength": 22,
            "agility": 14,
            "constitution": 20,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 560,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 75
            }
          },
          "depth": "Swimming through the subterranean magma currents, the Scale of Tiamat feeds on rare minerals and gold-trace veins, putting them in direct competition with the smiths of the Emberth clans. The Wyrd has amplified their mythic hunger, drawing them to the warmth of the Solbrand, which they will coil around and drain if left unchecked. Because of this, the Korr Emberth maintain a sleepless, heavily armed vigil at the Harath-Chamber to repel Scale of Tiamat incursions, though bold adventurers are often lured by rumors of these beasts to harvest their glass scales or the precious metals concentrated within their gullets.",
          "hooks": [
            "A rumor spreads of a Scale of Tiamat spotted near the area.",
            "Adventurers need a component from a Scale of Tiamat to complete their quest."
          ],
          "description": "A multi-headed serpent of black glass and molten orange, swimming through the lava rivers of Emberspire. It seeks out heat and precious minerals, draining the warmth of the sun and leaving fields of razor-sharp obsidian in its wake.",
          "heritage": "Rooted in Babylonian legends of the chaos-mother Tiamat, the Scale of Tiamat represented the fear of volcanic eruptions and the breaking of cosmic order. The Wyrd anomaly reacted to the deep anxieties of miners siphoning lava channels, materializing these draconic elements as physical beasts that embody volcanic destruction."
        },
        {
          "id": "anzu",
          "name": "Anzu",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/anzu.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Anzu",
          "role": "Anzu/Zu",
          "origin": "The Anzu is a legendary avian entity that combines the theft of cosmic order with the eternal cycle of creation. It draws its heritage from Anzu, the Mesopotamian storm-bird that stole the Tablet of Destinies, and the Bennu, the sacred Egyptian heron of Heliopolis who heralded rebirth and the renewal of the sun. In the ash-choked skies of Sundale, this great raptor represents both a thief of mortal legacy and an avatar of eternal return.",
          "nature": "With a wingspan stretching thirty feet, the Anzu is a majestic hybrid that blends the raw power of a hunting eagle with the slender grace of a heron. Its plumage is composed of ash-grey feathers that shimmer with heat-haze, their primary edges glowing with the orange light of a cooling lava flow. Its crown is adorned with a crest of golden, sun-bright feathers, and its legs terminate in razor-sharp obsidian talons that ignite dry tinder upon contact. Its face features a sharp, curved beak of yellowed bone and golden, hypnotic eyes that spin with a mesmerizing spiral, radiating a furnace-like heat to all who dare look upon them.",
          "habitat": "The Anzu builds its high, scorched nests upon the volcanic peaks and smoking crags of the Sundale and Emberspire terrain. These roosts are situated far above the ash clouds, where the birds can survey the volcanic wastes.",
          "combat": "310 HP. Tablet-Thief (special: steals inscribed objects — clay tablets, runic carvings, forge-marks; a Thrask ranger whose clan-mark is stolen cannot prove their lineage). Talon-Dive (melee from air, +7 to hit, 2d8+5 slashing + target is knocked prone). Obsidian-Talon-Ignite (passive: talons are hot enough to ignite dry material on contact; melee attacks deal +1d6 fire). Rebirth-Cycle (passive: every 7 years, immolates itself in Emberspire's caldera and is reborn from ashes; during the 24-hour rebirth window, it is helpless). Golden-Crest-Flash (AoE 20 ft, DC 14 CON or blinded 1 round by the crest's radiance). Vulnerable to cold.",
          "stats": {
            "strength": 16,
            "agility": 20,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 310,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 20,
            "resistances": {
              "fire": 100,
              "physical": 25
            }
          },
          "depth": "A giant lion-headed storm bird that eats thunderbolts. If players use lightning magic near it, the Anzu flies down to inhale the spell, gaining health and speed. It can be distracted by throwing highly conductive copper rods away from the party.",
          "hooks": [
            "A wizard's lightning spells are being absorbed by a giant bird nesting on the peak.",
            "A nest of Anzu is surrounded by copper rods to harvest lightning."
          ],
          "description": "A colossal storm-bird of ash-grey feathers and razor-sharp obsidian talons, obsessed with stealing runic inscriptions. It is a creature of cyclic rebirth that immolates itself in Emberspire's caldera to rise renewed.",
          "heritage": "Derived from Mesopotamian storm-bird legends, the Anzu was a myth about a giant raptor that stole the Tablet of Destinies, representing the threat of cosmic chaos. The Wyrd anomaly consolidated the local leaders' fear of losing authority and structural order, materializing this massive sun-bird to rule the ash-choked skies."
        },
        {
          "id": "girtablilu",
          "name": "Girtablilu",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/girtablilu.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Girtablilu",
          "role": "Girtablilu / ScorpionMan",
          "origin": "The Girtablilu traces its origins to the legendary Mesopotamian scorpion-men who guarded the gates of the sun-god Shamash, whose terrifying gaze struck awe into mortals. Blended with this guardian aspect is the influence of Serket, the Egyptian scorpion-goddess of healing, whose priesthoods were renowned for neutralizing venoms. In Sundale, they stand as the sleepless sentinels of ancient vaults, holding the secrets of the sun.",
          "nature": "The Girtablilu possesses the powerful, bronzed torso of a human seamlessly joined to the segmented, multi-legged body of a desert scorpion. Its human upper body is bare and marked by ceremonial burn-scars, while the scorpion lower half is armored in overlapping plates of basalt and colored with the ochre hue of Sundale's dunes, ending in a massive black stinger the size of a tower-shield. Its face is noble and strongly defined, set with pupil-less eyes of solid gold that project an aura of divine, unyielding authority.",
          "habitat": "These ancient scorpion-folk reside in the dry, sun-scorched dunes and rocky thresholds of the Sundale and Emberspire regions. They are typically found standing motionless at the entrances of volcanic temples, caves, and ancient sanctuaries.",
          "combat": "380 HP. Gate-Challenge (special: guards volcanic temple entrances; demands the traveler answer one question about the Solbrand or the Dimming's history — it knows every answer, and lying is impossible in its presence). Pincer-Crush (melee, +6 to hit, 2d8+5 bludgeoning + DC 15 STR or grappled). Stinger-Venom (melee, reach 15 ft, DC 16 CON — paradoxically, in small doses this venom CURES Wyrd-sickness; in large doses, it kills). Vigilance-Stare (passive: its golden eyes radiate divine authority; DC 14 SPI or intimidated, unable to attack for 1 round). Vulnerable to cold.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 18,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 380,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "fire": 75,
              "physical": 50
            }
          },
          "depth": "Servants of eternal vigilance, the Girtablilus guard the thresholds of Korr sanctuaries, refusing passage to anyone who cannot answer their intricate riddles concerning the Solbrand or the history of the Dimming. Though their appearance is intimidating, their stinger contains a paradoxical venom that, in small doses, acts as the only known cure for the Wyrd-sickness that afflicts those exposed to the Emberspire breach. The Sun-Speakers of the Korr Emberth frequently trade rare, fragrant incenses with the Girtablilus to obtain this life-saving substance, while adventurers are often hired to negotiate with them or retrieve a sample of their venom from the wild.",
          "hooks": [
            "A rumor spreads of a Girtablilu spotted near the area.",
            "Adventurers need a component from a Girtablilu to complete their quest."
          ],
          "description": "A half-human, half-scorpion centauroid guardian with skin of hardened basalt and eyes of solid gold. It stands watch over ancient volcanic gates, testing travelers with riddles and offering a venom that can cure Wyrd-sickness.",
          "heritage": "Rooted in Mesopotamian lore of Shamash's gatekeepers, the Girtablilu was a myth created to explain why mortals who sought the secrets of the sun never returned. The Wyrd anomaly materialized this fear of forbidden knowledge, shaping the scorpion-men into physical guardians that execute intruders near the ancient ruins."
        },
        {
          "id": "ammit",
          "name": "Ammit",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/ammit.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ammit",
          "role": "Ammit",
          "origin": "The Ammit is a terrifying composite beast whose origins lie in the dual myths of Egyptian and Mesopotamian judgment. It draws its nature from Ammit the Devourer, who ate the hearts of the unworthy in the Hall of Ma'at, and Humbaba, the monstrous guardian of the Cedar Forest whose face of entrails struck terror into the hearts of gods and men. In the volcanic depths of Sundale, it serves as the ultimate arbiter of truth and oath-keeping.",
          "nature": "Standing fifteen feet tall at the shoulder, the Ammit is a living furnace that constantly smolders and trails dark smoke from its patchwork hide. It has the muscular forequarters of a lion, the bulky hindquarters of a hippopotamus, and the scaled back of a crocodile covered in obsidian plates that clink together like chains. Its lion-mane is composed of low, flickering flames that burn without fuel, while its thick, grey hippopotamus hide is pocked with volcanic cysts. The creature's oversized crocodilian head features a jaw that opens to a ninety-degree angle, revealing three terrifying rows of teeth: lion-fangs, hippo-tusks, and crocodile-needles, all beneath two glowing, pure white eyes that look out with cold, absolute judgment.",
          "habitat": "The Ammit patrols the scorched approaches, narrow volcanic bridges, and inner chambers surrounding the Emberspire. It is never found far from these sacred gateways.",
          "combat": "340 HP. Heart-Weigh (passive: can sense the moral \"weight\" of any creature within 100 ft; those burdened by Wyrd-corruption or broken oaths are detected and prioritized). Crocodile-Bite (melee, +7 to hit, 2d10+5 piercing). Smolder-Hide (passive: body literally smolders; melee attackers take 1d6 fire damage on contact). Erasure-Devour (special: consumed creatures have their NAMES erased from volcanic stone-records — this is the only force that can undo Emberth burn-mark inscriptions; the victim's identity is permanently destroyed). Lion-Charge (melee, +6 to hit, 2d6+4 bludgeoning + DC 15 AGI or knocked prone and pinned). Vulnerable to cold.",
          "stats": {
            "strength": 20,
            "agility": 12,
            "constitution": 20,
            "intelligence": 8,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 340,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 50
            }
          },
          "depth": "Acting as a living barrier to the inner sanctums of Emberspire, the Ammit senses the moral weight of anyone who approaches, ignoring the pure of heart while savagely devouring those burdened by broken oaths or Wyrd-corruption. Those who fall to the beast suffer a fate worse than death; their souls are erased from existence, and their names vanish from the volcanic stone-records of the Emberth, undoing even the most permanent burn-mark inscriptions. This terrifying power makes them a symbol of ultimate dishonor among the Solvarn, and adventurers are warned to maintain impeccable honor when rumors speak of an Ammit blocking their path.",
          "hooks": [
            "A rumor spreads of a Ammit spotted near the area.",
            "Adventurers need a component from a Ammit to complete their quest."
          ],
          "description": "A massive, smoldering hybrid of lion, hippopotamus, and crocodile that judges the souls of those who approach Emberspire. It devours the corrupt, erasing their very names and memory from the sacred stones.",
          "heritage": "Derived from Egyptian judgment mythology, the Ammit was a composite monster created to enforce moral laws, warning that the hearts of the wicked would be devoured. The Wyrd anomaly reacted to the collective guilt of wrongdoers in Sundale, materializing this crocodile-lion-hippopotamus hybrid to physically execute those judged unworthy."
        },
        {
          "id": "lamashtu_wail",
          "name": "Lamashtu",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/lamashtu_wail.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Lamashtu",
          "role": "Lamashtu",
          "origin": "The Lamashtu is a malevolent manifestation born from the dark, distorted myths of Mesopotamian and Egyptian folklore. It combines Lamashtu, the baby-snatching demoness who caused miscarriages and infant deaths, with Taweret, the fierce hippopotamus-goddess of childbirth who served as a protective but terrifying maternal force. The resulting aberration is a tragic, twisted predator that hunts the young of Sundale.",
          "nature": "Towering nine feet tall, this creature has the swollen, pregnant torso of a hippopotamus-woman, the powerful paws of a lioness, and the skull-like head of a donkey, with a ridge of crocodile-hide running down its spine. Its heavy, pendulous breasts leak molten copper that burns and pocks the basalt floor as it walks, and it clutches a rusted bronze comb and a clay whistle in its claws. Its distended belly is in constant, disturbing motion, and from within, the muffled screams of its victims can be heard. Its face is a bare donkey-skull with glowing, lamp-like eyes that weep liquid fire, containing a secondary human mouth inside its jaw that constantly speaks in a weeping, apologetic woman's voice.",
          "habitat": "The Lamashtu haunts the fringes of Solvarn settlements, volcanic ruins, and the ash-choked borderlands of the Sundale region. It moves under the cover of night, drawn by the sounds of domestic life.",
          "combat": "390 HP. Child-Steal (special: absorbs children into her distended belly; the stolen are preserved in eternal torment, not digested — rescue is theoretically possible but requires breaching the belly). Copper-Weep (passive: breasts leak molten copper that pocks basalt; creates hazardous terrain dealing 1d6 fire per square). Donkey-Shriek (AoE 30 ft, DC 15 SPI or stunned 1 round). Pazuzu-Ward (passive: will not approach within 100 ft of a Pazuzu image carved on a door or worn as an amulet — this is a hard counter, not a save). Claw-Rake (melee, +6 to hit, 2d6+4 slashing). Vulnerable to cold.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 18,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 390,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 25
            }
          },
          "depth": "Driven by a twisted maternal instinct, the Lamashtu steals infants from their cradles and absorbs them into its hollow, swollen belly, where the children are kept alive in eternal, screaming torment. The only protection against this terror is the image of Pazuzu, which the demoness fears above all else; consequently, the Pazuzu is her natural enemy. Thrask parents carefully camp in the neutral zones between the territories of these two beasts, using the presence of the Pazuzu as a shield while hiring brave adventurers to hunt down local Lamashtus and free the trapped children before they are lost forever.",
          "hooks": [
            "A rumor spreads of a Lamashtu spotted near the area.",
            "Adventurers need a component from a Lamashtu to complete their quest."
          ],
          "description": "A horrific hippopotamus-demoness that prowls the edges of settlements to steal children, trapping them in her swollen belly. She is feared for her agonizing cries, yet she flees from the image of the Pazuzu.",
          "heritage": "A tragic folklore mechanism to process infant mortality and miscarriage, the Lamashtu myth rationalized sudden crib deaths as the work of a baby-stealing demon. The Wyrd anomaly consolidated this deep parental grief and terror of losing children, materializing this bird-taloned demon to haunt the nursery chambers of volcanic worker blocks."
        },
        {
          "id": "bes_brick",
          "name": "Bes",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/bes_brick.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Bes",
          "role": "Bes",
          "origin": "Crafted by the skilled hands of Emberth artisans, the Bes is a protective homunculus inspired by ancient protective spirits. Its form draws from Bes, the Egyptian dwarf-god of households who warded off evil with knives and music, and Ugallu, the Mesopotamian lion-headed 'Big Weather-Beast' who championed cosmic order. Together, these legends are fused into a loyal clay defender of the home.",
          "nature": "Standing only four feet tall, the Bes is a squat, muscular construct made of fired terracotta clay reinforced with basalt fibers. It wears a stylized crown of tall ostrich feathers and brandishes a curved khopesh-sword in one hand and a small bronze tambourine in the other. Its clay skin is painted with intricate sigils of blue lapis-lazuli that glow with a brilliant light when danger is near. Its face is a wide, comical lion's head with crossed eyes and a protruding tongue, designed to startle and amuse in equal measure.",
          "habitat": "These homunculi are stationed inside the stone hearths, door-lintels, and residential nurseries of Emberth strongholds and fortified outposts within Sundale. They remain motionless until activated.",
          "combat": "130 HP. Tambourine-Bang (AoE 20 ft, DC 13 SPI or Wyrd-creatures are frightened and must flee; laughing breaks enchantments — the sound itself is the weapon). Khopesh-Slash (melee, +5 to hit, 1d8+3 slashing). Sigil-Glow (passive: lapis-lazuli sigils glow when Wyrd-energy approaches within 50 ft, functioning as an alarm). Shatter-Sacrifice (special: when destroyed, explodes into protective clay-shards that embed Wyrd-warding sigils into nearby walls, creating a permanent 20-ft safe zone). Vulnerable to cold (clay becomes brittle).",
          "stats": {
            "strength": 12,
            "agility": 14,
            "constitution": 14,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "fire": 100,
              "physical": 50
            }
          },
          "depth": "Bess serve as the ultimate line of defense for Emberth families, springing to life at the first sign of Wyrd-corruption or malevolent spirits. When activated, they create a chaotic din, beating their tambourines and swinging their khopesh swords, using their bizarre grimaces and laughter-inducing appearance to break hostile enchantments. If a nursery is breached, a Bes will fight until it is completely shattered, scattering protective, sigil-carved clay shards that ward the room against corruption. The Thrask and Korr Emberth hold these shattered fragments in high honor, often hiring adventurers to retrieve rare lapis-lazuli or basalt fibers to construct new guardians for their growing settlements.",
          "hooks": [
            "A rumor spreads of a Bes spotted near the area.",
            "Adventurers need a component from a Bes to complete their quest."
          ],
          "description": "A stout, clay-and-basalt homunculus with a roaring lion's face, created by Emberth smiths to guard nurseries. It wards off evil through mock grimaces, loud tambourines, and protective lapis-lazuli sigils.",
          "heritage": "Derived from Egyptian protector deity beliefs, the Bes originally served as a household amulet to guard pregnant mothers and ward off snakes and nightmares. The Wyrd anomaly reacted to the Emberth artisans' desire for domestic safety, animating this small, dwarf-like homunculus to guard homes and absorb domestic curses."
        },
        {
          "id": "ifrit",
          "name": "Ifrit",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/ifrit.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ifrit",
          "role": "Ifrit/Afreets",
          "origin": "The Ifrit is a majestic and terrifying elemental spirit born from the deep furnace of the world. Its origins are tied to the Ifrit of Mesopotamian and Islamic folklore—powerful jinn of smokeless fire who built underground cities—and Wadjet, the Egyptian cobra-goddess whose fiery eye could incinerate the enemies of cosmic order. In the volcanic heart of Emberspire, they are revered as living extensions of the sun's primordial will.",
          "nature": "Standing ten feet tall, the Ifrit is a winged giant composed entirely of white-hot charcoal and crackling, shifting flames. Its body is unstable, constantly shedding embers and pieces of blackened carbon to reveal the liquid, molten fire burning within. Its wings are fans of superheated, rippling air that distort the surrounding light, and its head is crowned by a wide, cobra-shaped hood of flame that flares outward in anger. Its face is a mask of hardened charcoal with shifting, serpentine features, dominated by two blinding white points of light that represent the destructive eye of Wadjet.",
          "habitat": "These fiery elementals live in the deepest volcanic chambers, active magma vents, and sacred smithies of the Emberspire terrain. They are rarely seen outside these superheated zones.",
          "combat": "420 HP. Cobra-Glare (special: gaze ignites flammable material within 50 ft; any creature meeting its gaze DC 15 AGI or takes 3d6 fire and is set ablaze). Magma-Shape (1 AP: shapes molten rock with bare hands, creating barriers, weapons, or tools no mortal smith can replicate). Flame-Body (passive: melee attackers take 2d6 fire damage on contact). Coal-Hurl (ranged 40 ft, +6 to hit, 2d8 fire). Uraeus-Flare (the cobra-hood of flame flares wide when aggressive, illuminating 60 ft and blinding creatures in front — DC 14 CON or blinded 1 round). Vulnerable to cold (cold damage reduces its body temperature, lowering damage output by 25% per cold hit until it reheats).",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 18,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 420,
            "maxMana": 50,
            "maxActionPoints": 5,
            "speed": 35,
            "resistances": {
              "fire": 100,
              "physical": 50
            }
          },
          "depth": "The Ifrits are powerful allies to the Korr Emberth, using their bare hands to shape molten rock into forge-components that no mortal tools could hope to replicate. They guard their smithies with absolute ferocity, using a deadly gaze that can instantly ignite any flammable object within fifty paces. Thrask rangers learn to identify their territories by the wide rings of scorched, vitrified earth that surround their volcanic nests, and they often advise adventurers to tread carefully when seeking these elementals, whether to petition them for forge-work or to harvest their white-hot coal cores for legendary weapons.",
          "hooks": [
            "A rumor spreads of a Ifrit spotted near the area.",
            "Adventurers need a component from a Ifrit to complete their quest."
          ],
          "description": "A towering giant of white-hot coal and shifting flame, crowned with a cobra-like hood of fire. It works alongside Emberth smiths to shape molten stone, igniting intruders with a single, burning glare.",
          "heritage": "Spun from Mesopotamian and Arabic elemental fire lore, the Ifrit was a personification of the lethal heat and blazing wildfires that destroyed arid settlements. The Wyrd anomaly captured the fear of thermal destruction in the foundries, materializing these giant, horned fire-spirits that command lava streams."
        },
        {
          "id": "ghul_cinder",
          "name": "Cinder Ghul",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/ghul_cinder.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Cinder Ghul",
          "role": "Ghul",
          "origin": "The Cinder Ghul is a sinister spirit of the volcanic wastes, drawing its mythic origins from the ghuls of Mesopotamian folklore—undead shape-shifters that consumed the dead in ruined places—and Medjed, the mysterious, sheeted deity of the Egyptian Book of the Dead who smote enemies with unseen fire. Fused together by the static of the Wyrd, the Cinder Ghul acts as a silent, invisible sentinel of the dead.",
          "nature": "This creature appears as a four-foot-tall, conical cylinder of grey ash-dust fabric that resembles a shroud, with only two glowing, round green eyes visible beneath the hem. The fabric of the shroud is composed of compacted ash and pulverized bone held together by static electricity, and it leaves scorched footprints wherever its stubby feet step. It has no discernible face, but when it attacks, the ash-fabric splits vertically from top to bottom, revealing a roaring, white-hot furnace of fire within its hollow body.",
          "habitat": "Cinder Ghuls make their homes in the ash-choked tombs, ancient graveyards, and crumbling volcanic ruins that litter the outskirts of Emberspire and Sundale.",
          "combat": "380 HP. Invisible-Shift (1 AP: becomes completely invisible; only detectable by the faint smell of charred bone and the two floating green eyes — DC 14 INT (Perception) to spot the eyes). Fire-Bolt (ranged 30 ft, +5 to hit, 2d6 fire). Heat-Drain (passive: consumes residual warmth from ancient stone; infested ruins are cold to the touch, all thermal energy drained). Bone-Cloak-Split (special: when it opens its \"mouth,\" the fabric splits vertically, revealing a furnace — cone 15 ft, 3d6 fire, DC 14 CON or continue burning). Vulnerable to cold.",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 50
            }
          },
          "depth": "Rather than feeding on flesh, Cinder Ghuls consume the residual warmth trapped within ancient structures, draining the thermal memory of long-lost civilizations until the stones are ice-cold to the touch. They possess the ability to turn completely invisible, leaving only the faint scent of burnt bone as a warning, and they launch devastating bolts of fire at intruders while hidden. To defeat them, adventurers must look for the single feature they cannot hide—their glowing, pale green eyes—making them a dangerous threat to those exploring the ruins, though their ash-dust shrouds are highly prized by alchemists for their fire-binding properties.",
          "hooks": [
            "A rumor spreads of a Cinder Ghul spotted near the area.",
            "Adventurers need a component from a Cinder Ghul to complete their quest."
          ],
          "description": "A mysterious, conical figure of compacted ash and bone, sporting two glowing green eyes. It haunts volcanic ruins, draining the heat-memory from the stone and smiting intruders with invisible fire.",
          "heritage": "Rooted in undead shape-shifter folklore, the Cinder Ghul was a desert myth created to explain missing travelers and warn against wandering into volcanic ash wastes. The Wyrd anomaly consolidated the terror of starvation and decay in the desert, materializing these skeletal ghouls to feed on volcanic ash and organic waste."
        },
        {
          "id": "gugalanna",
          "name": "Gugalanna",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/gugalanna.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Gugalanna",
          "role": "Gugalanna / Bull of Heaven",
          "origin": "The Gugalanna is a sacred beast of titanic proportions, reflecting the mythic union of Mesopotamian and Egyptian bull deities. It is named after the Gugalanna, the Sumerian Bull of Heaven whose breath dried rivers and cracked the earth, and Apis, the sacred Egyptian bull of Memphis who was worshipped as a living incarnation of Ptah. In the ash-deserts of Sundale, it represents both a destructive force of nature and a divine source of purification.",
          "nature": "Standing seven feet tall at the shoulder, the Gugalanna is a massive bull made of cooling magma, its dark, rocky crust cracking with every step to reveal the bright, molten orange beneath. Its horns curve forward like a pharaoh's crown, their tips glowing with white-hot heat, and its tail is a whipping cord of molten metal. A distinct, white triangle of cooled stone is visible on its forehead, and beneath its tongue sits a polished, scarab-shaped growth of black obsidian.",
          "habitat": "This volcanic bull roams the Shyr, the ninety-mile basalt scar of Sundale, and the jagged, shifting lava-fields surrounding Emberspire. It travels constantly, never staying in one place for long.",
          "combat": "180 HP. Ground-Breaker (passive: its hooves crack cooling lava into fracture-patterns that are actually navigation-maps — following Gugalanna tracks leads to stable ground). Magma-Charge (melee charge, +6 to hit, 2d8+5 bludgeoning + 1d6 fire, DC 15 AGI or trampled). Steam-Breath (AoE cone 15 ft, 2d6 fire/steam, DC 14 CON or blinded 1 round). Scarab-Purify (special: the scarab-shaped obsidian growth beneath its tongue can purify contaminated water — a single scarab cleanses an entire cistern of Wyrd-taint; killing the Gugalanna for it is considered sacrilege). Vulnerable to cold.",
          "stats": {
            "strength": 20,
            "agility": 12,
            "constitution": 18,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 180,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "fire": 100,
              "physical": 50
            }
          },
          "depth": "The Gugalanna charges across the volcanic wasteland, its heavy hooves fracturing the cooling lava-roads and mapping out the safest paths through the shifting terrain. Thrask rangers track these herds to find stable passage through the lava-fields, utilizing the bull's instincts to survive. The obsidian scarab beneath the Gugalanna's tongue is highly sought after by alchemists and the Unwoven because it can instantly purify an entire cistern of Wyrd-tainted water, though the Korr Emberth view the slaughter of these bulls as a terrible sacrilege. Adventurers are often caught in the middle of these conflicting factions, hired either to protect the bulls or to harvest a scarab-mark to save a poisoned settlement.",
          "hooks": [
            "A rumor spreads of a Gugalanna spotted near the area.",
            "Adventurers need a component from a Gugalanna to complete their quest."
          ],
          "description": "A colossal bull of cooling magma and obsidian, bearing a sacred white triangle on its forehead. It carves safe paths through the lava fields of the Shyr, its tongue concealing a scarab-mark that can purify poisoned waters.",
          "heritage": "Inspired by the Sumerian Bull of Heaven, the Gugalanna was a myth representing the destructive earthquakes and droughts sent by gods to punish mortal hubris. The Wyrd anomaly reacted to the miners' dread of tectonic collapse and crop failures, materializing this colossal bull to shake the foundations of the mountains."
        },
        {
          "id": "peri_moth",
          "name": "Peri",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/peri_moth.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Peri",
          "role": "Peri",
          "origin": "The Peri is a delicate spirit of light and renewal, drawing its essence from Persian and Egyptian mythologies. It is inspired by the Peri, the beautiful, winged fallen angels of Zoroastrian lore who seek repentance, and Khepri, the scarab-god of the rising sun who rolls the sun across the sky. In the volcanic gloom of Sundale, these moths are viewed as fragments of the sun-god Sol's own consciousness, striving to bring warmth back to the world.",
          "nature": "No larger than a human hand, the Peri is a creature of striking beauty, its opalescent wings shimmering with shifting, oil-like colors. Its body glows with the warm, golden light of a miniature sun, and its antennae are curved like the horns of a scarab beetle. The edges of its wings are inscribed with tiny Zoroastrian prayers written in glittering gold-dust, and when it rests, it curls its wings into a tight, glowing sphere. Its delicate face features two large, faceted eyes that reflect the observer's face as a youthful, idealized vision, and its mouth is a glass-like proboscis.",
          "habitat": "These radiant moths congregate in glowing clouds around the Solbrand and within the warm, protected chambers of Emberspire's temples.",
          "combat": "130 HP. Wing-Roll (passive: at dawn, rolls its wings into a ball, collecting thermal energy; compresses it into golden \"sun-seeds\" — plantable in cold hearthstones to produce fire for a year). Golden-Glow (passive: emits warm golden light; creatures within 10 ft feel comforted, +2 to SPI saves). Runic-Prayer-Wings (passive: wings edged with Zoroastrian prayers in gold-dust; reading them grants temporary +4 to SPI for 1 hour). Proboscis-Touch (melee, +3 to hit, 1d4 radiant — heals 1d4 instead if target is allied). Vulnerable to cold.",
          "stats": {
            "strength": 2,
            "agility": 16,
            "constitution": 8,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 10,
            "resistances": {
              "fire": 50,
              "radiant": 100
            }
          },
          "depth": "Peris are drawn to sources of intense heat, particularly the sacred bowl of the Solbrand, where they are carefully tended by the Sun-Speakers of the Korr. Imitating the scarab Khepri, the moths roll their wing-balls along the ground at sunrise, absorbing the ambient heat and compressing it into small, golden pearls known as sun-seeds. These pearls are highly valued by the Emberth, who plant them in cold hearthstones to generate a steady, smokeless flame that burns for an entire year. Adventurers are often hired to protect these delicate creatures from predators or to collect wild sun-seeds from the volcanic valleys.",
          "hooks": [
            "A rumor spreads of a Peri spotted near the area.",
            "Adventurers need a component from a Peri to complete their quest."
          ],
          "description": "A beautiful, hand-sized moth with opalescent wings and a golden, sun-like body. It rolls its wings into balls to compress thermal energy, creating eternal embers used by the Emberth.",
          "heritage": "Spun from Persian legends of winged spirits seeking purification, the Peri was a myth of hope representing the return of rain and fresh spring water. The Wyrd anomaly reacted to the miners' and farmers' desperation for water in the ash deserts, materializing these delicate winged moths to bring purification to polluted streams."
        },
        {
          "id": "daeva_shade",
          "name": "Daeva",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/daeva_shade.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Daeva",
          "role": "Daeva",
          "origin": "The Daeva is a malevolent entity born from the absolute negation of light and truth. Its lineage is tied to the Daevas of Zoroastrian mythology, the false gods of chaos and destruction who serve Angra Mainyu, and the Set Animal of Egypt, the mysterious beast representing chaos, discord, and the foreign desert. It exists as a living lie, manifesting in Sundale to corrupt the land.",
          "nature": "The Daeva has the lean, jackal-like body of a hunting canine, but its form is constructed of three-dimensional shadow that absorbs all light. Where light hits its body, it simply vanishes, leaving a silhouette with physical mass. Its tail is forked into two wispy tendrils of darkness, and its long, curved snout resembles a scimitar. Its face is dominated by inverted eyes—solid black whites and pupil-less, blinding white pupils—and a permanent, malicious grin that reveals rows of teeth shaped like tiny skulls.",
          "habitat": "These shadow beasts lurk in the dark volcanic caves, ruined temples, and ash-choked canyons of Sundale and the Emberspire region.",
          "combat": "380 HP. Truth-Eater (passive: feeds on spoken truth — every honest word within 50 ft weakens the speaker (-1 to all rolls per truthful statement) and strengthens the shade (+5 HP per truth consumed). In markets, where merchants lie, it starves). Light-Absorb (passive: its body is a three-dimensional hole in the world; all light that hits it simply ceases — it is visible only as a moving silhouette). Chaos-Beacon (passive: its presence attracts Wyrd-manifestations; within months of nesting, reality-breaches open nearby). Inverted-Gaze (passive: its eyes are inverted — bright pupils, dark whites; meeting its gaze DC 14 SPI or the creature learns your deepest secret). Chaos-Bite (melee, +6 to hit, 2d6+4 necrotic). Vulnerable to radiant (radiant damage is the only type that affects it normally; all other damage is reduced 75%).",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 14,
            "intelligence": 14,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "physical": 75,
              "cold": 50,
              "fire": 50
            }
          },
          "depth": "The Daeva feeds upon spoken truth; every honest word spoken in its vicinity drains the speaker's vitality while strengthening the shade's physical form. Because the Korr Emberth practice the Vault-Breath—a discipline of sacred silence—the Daevas are starved near the temples but grow bloated and aggressive around the busy marketplaces. Their presence acts as a beacon for the Wyrd, tearing open reality-breaches and accelerating corruption, which prompts the Thrask rangers to hunt them down relentlessly. Adventurers are frequently employed to locate and destroy these beasts before their nests can trigger a catastrophic breach.",
          "hooks": [
            "A rumor spreads of a Daeva spotted near the area.",
            "Adventurers need a component from a Daeva to complete their quest."
          ],
          "description": "A shadow-born jackal with a curved snout and inverted eyes, representing the dark lies of Angra Mainyu. It feeds on spoken truth and accelerates the corruption of the Wyrd wherever it nests.",
          "heritage": "Rooted in Zoroastrian mythology of chaos-demons, the Daeva represented the absolute negation of light, truth, and cosmic order. The Wyrd anomaly consolidated the settlers' fear of moral corruption and betrayals in the dark, materializing these multi-eyed, horned shadows to spread discord and deceit."
        },
        {
          "id": "simurgh_ash",
          "name": "Simurgh",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/simurgh_ash.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Simurgh",
          "role": "Simurgh",
          "origin": "The Simurgh is an ancient and benevolent protector, drawing its heritage from Persian and Egyptian mythic guardians. It represents the Simurgh, the legendary bird of wisdom that witnessed the destruction of three worlds and possessed infinite healing knowledge, and the Akhekhu, the Egyptian underworld griffon that guarded hidden thresholds. It stands as a sapient witness to the world before the Dimming, carrying the memory of lost ages.",
          "nature": "With a massive fifty-foot wingspan, the Simurgh combines the powerful body and hind-legs of a lion with the head, wings, and fore-talons of an eagle. Its plumage is a soft, volcanic ash-grey, with each feather bordered by a faint, glowing blue line. Its mane is made of fine copper-colored feathers that chime like bells in the wind, and the underside of its wings is inscribed with golden Zoroastrian fire-prayers that glow when it performs acts of healing. Its face is that of a noble eagle, with warm, bronze-colored beak and eyes containing concentric rings of gold, orange, and amber.",
          "habitat": "These giant griffons nest exclusively on the high, smoking rim of the Emberspire caldera, building massive structures out of woven ash and volcanic glass.",
          "combat": "405 HP. Feather-Heal (special: a single feather laid on a wound heals broken bones and closes gashes within hours — 3d8+5 healing per use; the Simurgh is sapient and chooses who receives feathers). Ash-Nest-Stabilize (passive: areas near Simurgh nests have measurably fewer eruptions; its presence is a volcanic stabilizer). Ancient-Knowledge (passive: remembers the world before the Dimming; can share pre-sundering knowledge fragments with those it deems worthy — GM fiat). Wing-Buffet (AoE 30 ft, DC 15 AGI or knocked back 20 ft and prone). Talon-Strike (melee, +7 to hit, 2d8+5 slashing). Copper-Chime (passive: mane of copper-wire feathers chimes in wind; the sound is identifiable for miles, marking territory). Vulnerable to cold.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 18,
            "intelligence": 16,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 405,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 50,
              "psychic": 50
            }
          },
          "depth": "The Simurgh is a sapient creature of immense wisdom, occasionally sharing ancient secrets of the pre-sundered world with those it deems worthy. Its feathers possess unparalleled healing properties, capable of sealing deep wounds and mending bones within hours of contact. Furthermore, the presence of these birds helps stabilize geothermal activity, reducing eruptions near their nesting sites. Because of this, Emberth law decrees that harming a Simurgh is a capital offense punishable by live immolation, and adventurers are often sent to the caldera rim to seek their counsel or plead for a single feather to save a dying leader.",
          "hooks": [
            "A rumor spreads of a Simurgh spotted near the area.",
            "Adventurers need a component from a Simurgh to complete their quest."
          ],
          "description": "A colossal, wise hybrid of eagle and lion with ash-grey feathers and copper-wire mane. It nests on the rim of Emberspire, using its healing feathers to close wounds and its presence to calm the volcano.",
          "heritage": "Derived from Persian myths of the bird of wisdom, the Simurgh was a myth representing the memory of lost ages and the hope of healing. The Wyrd anomaly reacted to the scholars' desire to recover pre-Dimming history, materializing this legendary avian protector to watch over hidden libraries and heal sick travelers."
        },
        {
          "id": "azi",
          "name": "Azi",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/azi.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Azi",
          "role": "Azi Dahaka",
          "origin": "The Azi is a terrifying apex predator of the lava streams, representing the destructive aspects of storm and river. It draws its origins from Azi Dahaka, the three-headed dragon-demon of Persian myth who was imprisoned beneath Mount Damavand, and Sobek, the Egyptian crocodile-god of the Nile who commanded both fertility and raw military might. It is the ultimate embodiment of volcanic terror in Sundale.",
          "nature": "Measuring twenty feet in length, the Azi is a colossal crocodile whose body is armored in thick, green-black obsidian scales that overlap like chainmail. Three distinct heads emerge from its single neck, and its tail is flattened and lined with razor-sharp obsidian blades. Liquid lava constantly drips from its teeth, and its belly scales glow with intense geothermal heat. Each of its three heads has a different eye color—red on the left, blue in the center, and green on the right—representing the unique elements they control.",
          "habitat": "These multi-headed beasts inhabit the deep, slow-moving lava channels and molten rivers that flow throughout Sundale and the Emberspire terrain.",
          "combat": "475 HP. Triple-Strike (each head attacks independently: left head +6 fire-breath, center +6 lightning-bite, right +6 acid-spit — all three can target different creatures). Lava-Submerge (1 AP: dives into molten rock, gaining full cover; surfaces next round with a surprise attack). Obsidian-Hide (passive: dinner-plate-sized obsidian scales; non-magical weapons cannot pierce). Three-Venom-System (left = fire that burns through metal, center = lightning that paralyzes, right = acid that dissolves flesh; each venom persists for 3 rounds). Tail-Whip (melee, reach 15 ft, 2d6+4 bludgeoning + DC 15 AGI or knocked prone). Vulnerable to cold (cold damage hardens one head's scales, reducing that head's AP by 1).",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 20,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 475,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 75,
              "lightning": 50,
              "acid": 50
            }
          },
          "depth": "The Azi is the undisputed king of the lava rivers, hunting by submerging in the molten stone and launching surprise attacks with all three heads. Each head produces a different lethal substance—the left head spews fire that melts armor, the middle spits acid that dissolves flesh, and the right secretes a paralytic poison that freezes the nervous system. The scales of the beast are impervious to normal weapons, making them nearly impossible to kill, though alchemists will pay small fortunes to adventurers who manage to harvest the rare venoms from a specimen.",
          "hooks": [
            "A rumor spreads of a Azi spotted near the area.",
            "Adventurers need a component from a Azi to complete their quest."
          ],
          "description": "A massive, three-headed crocodile of green-black obsidian that rules the lava rivers of Sundale. Each of its heads produces a distinct, lethal venom of fire, acid, or paralysis.",
          "heritage": "Rooted in storm-serpent myths of Azi Dahaka, the Azi represented the terror of flash floods and lava overflows that swept away communities in narrow ravines. The Wyrd anomaly materialized this fear of uncontrollable fluid destruction, shaping these three-headed serpents to hunt near lava cascades."
        },
        {
          "id": "edimmu_whisper",
          "name": "Edimmu",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/edimmu_whisper.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Edimmu",
          "role": "Edimmu/Ekimmu",
          "origin": "The Edimmu is a tragic and vengeful phantom born from improper burials and sudden deaths. It is inspired by the Edimmu of Mesopotamian myth, the wind-borne ghosts of those who died violently and haunted the living with illness, and the Ka of Egyptian belief, the spiritual double of a person that required food and drink to remain at peace. It remains anchored to the mortal realm, seeking the offerings it was denied.",
          "nature": "Appearing as a translucent, featureless humanoid shape, the Edimmu resembles a heat-mirage that flickers in and out of the corner of the eye. It smells faintly of sulfur and dust, and the air around it shimmers with heat. In the volcanic glare of Sundale, it casts a shadow that does not match its visible form, and its featureless face occasionally flashes the screaming, burning visage of its former living self.",
          "habitat": "These phantoms haunt the ancient volcanic forges, abandoned mines, and ash-strewn ruins where people have met violent ends in Sundale and Emberspire.",
          "combat": "380 HP. Attachment-Bond (special: bonds to a creature who passes near its death-site; bonded target suffers increasing fatigue (-1 to all rolls per day), nightmares of fire, and eventually spontaneous combustion on day 7 — at which point the Edimmu detaches and seeks a new host). Heat-Mirage (passive: visible only in peripheral vision; DC 14 INT (Perception) to track its position). Shadow-Shift (passive: its shadow is always a different shape than its visible form). Sulfur-Aura (passive: smells of sulfur and ancient dust; reveals its presence within 30 ft). Offering-Pacify (special: can be pacified with funerary offerings of the tools the person used in life — burns the bond if the offering is genuine). Vulnerable to cold.",
          "stats": {
            "strength": 6,
            "agility": 14,
            "constitution": 10,
            "intelligence": 6,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "physical": 50,
              "fire": 50
            }
          },
          "depth": "The Edimmu attaches itself to unsuspecting travelers who cross its death-site, slowly draining their life force to sustain its own presence. The victim suffers from terrible nightmares of fire and progressive fatigue, eventually culminating in spontaneous combustion. To prevent this, Emberth law dictates that any worker who dies in the forges must be buried with a burned piece of forge-equipment as an offering, which pacifies the spirit. Adventurers are often hired to lay these spirits to rest by delivering the proper items to their final resting places.",
          "hooks": [
            "A rumor spreads of a Edimmu spotted near the area.",
            "Adventurers need a component from a Edimmu to complete their quest."
          ],
          "description": "A wavering, translucent afterimage of a deceased soul that bonds to travelers, draining their energy. It causes nightmares and eventual combustion unless pacified with funerary offerings.",
          "heritage": "Born from the fear of unburied ghosts, the Edimmu was a Mesopotamian myth emphasizing the absolute necessity of funeral rites to prevent restless spirits from spreading sickness. The Wyrd anomaly consolidated the guilt of families unable to retrieve bodies from collapsed mines, manifesting these phantoms to haunt drafty corridors."
        },
        {
          "id": "asag",
          "name": "Asag",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/asag.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Asag",
          "role": "Asag",
          "origin": "The Asag is a massive elemental construct that embodies the boiling power of the earth. Its mythic roots lie in the Sumerian demon Asag, whose hideousness was so great that it boiled fish alive in rivers, and Geb, the Egyptian earth-god whose laughter shook the world. It is the living representation of Sundale's geological instability.",
          "nature": "Standing eight feet tall, the Asag is a hunched, humanoid mass of living volcanic rock composed of jagged obsidian and porous pumice. It constantly weeps molten lava from its joints and supports a tiny ecosystem of extremophile lichens in its stone crevices. Its face is a crude, geometric pattern of vents that glow with magma for eyes and a jagged crack that releases superheated gas for a mouth, changing expressions with geological slowness.",
          "habitat": "These stone behemoths are found in the active volcanic vents, geothermal valleys, and unstable rock formations of Sundale and Emberspire.",
          "combat": "390 HP. Boiling-Presence (passive: water within 30 ft literally boils; creates a zone of scalding terrain that deals 2d6 fire to any creature entering). Earth-Laugh (special: when agitated, its body vibrates, causing localized earthquakes; communicates through tremors — low rhythmic tremors = contentment, sharp irregular quakes = aggression; a magnitude-5 quake deals 3d6 bludgeoning to all creatures within 50 ft, DC 15 AGI to stay standing). Obsidian-Fist (melee, +6 to hit, 2d8+5 bludgeoning + 1d6 fire). Living-Rock (passive: extremophile lichens and heat-resistant mosses grow on its hide, camouflaging it as a natural volcanic formation; +8 to stealth in volcanic terrain). Vulnerable to cold.",
          "stats": {
            "strength": 20,
            "agility": 8,
            "constitution": 22,
            "intelligence": 6,
            "spirit": 8,
            "charisma": 6,
            "maxHp": 390,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "fire": 100,
              "physical": 75,
              "piercing": 50
            }
          },
          "depth": "The Asag radiates such extreme heat that any water source within thirty feet of it begins to boil, turning peaceful streams into scalding geysers. When threatened or agitated, the creature vibrates its massive body to generate localized earthquakes, communicating through these ground-shaking tremors. Emberth geologists have decoded parts of this seismic language, finding that rhythmic tremors indicate peace while sharp quakes signal aggression, and they often hire adventurers to redirect or soothe these giants when they wander too close to vital settlements.",
          "hooks": [
            "A rumor spreads of a Asag spotted near the area.",
            "Adventurers need a component from a Asag to complete their quest."
          ],
          "description": "A massive, eight-foot boulder of living pumice and obsidian that continuously weeps lava. Its intense heat boils nearby water sources, and it communicates through seismic tremors.",
          "heritage": "Rooted in Sumerian demon legends, the Asag was a myth representing the boiling heat and tectonic instability of the volcanic regions. The Wyrd anomaly reacted to the miners' constant fear of geysers and lava ruptures, materializing this massive rock-hided elemental to guard volcanic vents."
        },
        {
          "id": "nisroch_falcon",
          "name": "Nisroch",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/nisroch_falcon.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nisroch",
          "role": "Nisroch",
          "origin": "The Nisroch is a divine protector of the sky, combining agricultural abundance with protective kingship. Its heritage traces to Nisroch, the Mesopotamian eagle-headed deity associated with the sacred tree of life, and Horus, the Egyptian falcon-god whose all-seeing eye represented cosmic order and healing. It serves as the primary aerial defense against the encroaching darkness.",
          "nature": "The Nisroch is a large bird of prey with feathers of golden-bronze that resemble polished sun-metal, and a sharply hooked beak of bronze. Its right eye is that of a normal, sharp-sighted falcon, while its left eye is the glowing, blue-lit Wedjat—the Eye of Horus. It wears a small crown of lapis-lazuli beads on its head, and its gaze carries an unmistakable air of human-like intelligence and authority.",
          "habitat": "These sacred falcons patrol the high atmosphere and volcanic crags above the Emberspire caldera and the surrounding reaches of Sundale.",
          "combat": "145 HP. Wedjat-Beam (ranged 40 ft, the left eye fires a beam of concentrated light that burns Wyrd-essence — 2d6 radiant + Wyrd-creatures take double damage and must DC 14 CON or flee). Sky-Patrol (passive: patrols the skies above Emberspire scanning for Wyrd-manifestations; acts as an early-warning system). Foil-Message-Delivery (special: carries messages inscribed on golden foil between Korr Sun-Speakers and Thrask rangers; messages are only readable via the Wedjat-eye). Bronze-Talon (melee from dive, +6 to hit, 2d6+3 slashing). Vulnerable to cold.",
          "stats": {
            "strength": 10,
            "agility": 20,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 145,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 10,
            "resistances": {
              "fire": 50,
              "radiant": 100
            }
          },
          "depth": "Nisrochs scan the volcanic wastes for signs of Wyrd-corruption, using their Wedjat eyes to fire concentrated beams of light that burn away raw Wyrd-essence. They also serve as vital messengers between the Korr Sun-Speakers and the Thrask rangers, carrying gold-foil messages that only their divine eyes can read. Because of their sacred status, killing a Nisroch is a capital offense under Emberth law, and adventurers are often tasked with protecting their nests or rescuing injured falcons from the wild.",
          "hooks": [
            "A rumor spreads of a Nisroch spotted near the area.",
            "Adventurers need a component from a Nisroch to complete their quest."
          ],
          "description": "A noble, golden-bronze falcon with one human-like eye and one glowing Wedjat eye. It patrols the skies above Emberspire, using beams of light to destroy Wyrd-essence.",
          "heritage": "Derived from Assyrian falcon-deity myths, the Nisroch served as a symbol of agricultural abundance and divine kingship, protecting fields from pests. The Wyrd anomaly reacted to the farmers' hope for successful crop cycles in the ash-laden soil, materializing these falcon-headed sentinels to watch over Sundale's sky lines."
        },
        {
          "id": "abzu",
          "name": "Abzu",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/abzu.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Abzu",
          "role": "Abzu/Apsu",
          "origin": "The Abzu is a mysterious anomaly of freshwater and ancient magic, combining the primal water myths of Mesopotamia and Egypt. It represents the Abzu, the Sumerian underground freshwater ocean that was the source of all magic, and Nun, the Egyptian personification of the primordial waters of creation. It exists as a pocket of ancient, wise water in the middle of a dry desert.",
          "nature": "The Abzu has no physical, solid form; it is a perfectly circular pool of clear water, fifteen feet wide, that glows with a soft, bioluminescent blue-white light. Inside the water, ancient cuneiform and hieroglyphic glyphs swim like fish, holding the secrets of the past. When it wishes to speak, it shapes a serene, water-formed face on its surface, featuring eyes of vertigo-inducing depth.",
          "habitat": "This sentient pool is located within the deep, cavernous chambers and cooling tunnels beneath the Harath-Vault in the Emberspire region.",
          "combat": "220 HP. Wisdom-Well (special: those who drink from the pool receive one piece of forgotten pre-Dimming knowledge; the pool takes a drop of blood in exchange, adding it to its eternal archive — this is a knowledge-for-blood bargain with no save). Volcanic-Coolant (passive: its underground spring feeds the cooling-channels beneath the Harath-Vault; without it, the forges overheat and the Solbrand boils dry). Glyph-Drift (passive: cuneiform and hieroglyphic glyphs drift through the water like fish; reading them requires DC 14 INT and grants +2 to one Knowledge skill for 24 hours). Water-Form (immune to physical damage; takes normal damage from cold (freezes it temporarily) and acid). Vulnerable to cold (freezes for 1d4 rounds).",
          "stats": {
            "strength": 4,
            "agility": 10,
            "constitution": 20,
            "intelligence": 20,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 220,
            "maxMana": 80,
            "maxActionPoints": 3,
            "speed": 0,
            "resistances": {
              "physical": 100,
              "fire": 100,
              "poison": 100
            }
          },
          "depth": "The Abzu serves as a crucial repository of pre-Dimming knowledge, offering travelers forgotten secrets in exchange for a drop of their blood, which is added to its liquid archives. It also plays a vital physical role by cooling the geothermal channels beneath the Harath-Vault, preventing the volcanic forges from overheating. Korr engineers maintain these channels with religious devotion, and adventurers are sometimes sent to protect the pool's source or retrieve rare tablets to feed its thirst for knowledge.",
          "hooks": [
            "A rumor spreads of a Abzu spotted near the area.",
            "Adventurers need a component from a Abzu to complete their quest."
          ],
          "description": "A sentient, circular pool of glowing water that contains ancient cuneiform and hieroglyphic glyphs. It acts as a cooling system for the volcanic vaults, trading forgotten secrets for blood.",
          "heritage": "Spun from Mesopotamian water myths of the sacred freshwater abyss, the Abzu represented the hope of finding clean, life-giving water under the desert. The Wyrd anomaly reacted to the extreme thirst and resource anxiety of Sundale's inhabitants, materializing these water-dragons to guard geothermal reservoirs."
        },
        {
          "id": "kur_pit",
          "name": "Kur",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/kur_pit.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kur",
          "role": "Kur / Kurnugia",
          "origin": "The Kur is a breach in reality where the realms of the dead bleed into the land of the living. Its name is derived from Kur, the Sumerian underworld of no return, and Duat, the Egyptian labyrinthine realm of trials through which the sun traveled each night. It represents a physical manifestation of the dark, subterranean afterlife.",
          "nature": "The Kur is a perfectly circular, ten-foot-wide abyss that opens in the earth, its smooth walls covered in spiraling hieroglyphic and cuneiform warnings that glow with a dull red light. A constant, echoing murmur of dead voices rises from its depths, and the air above it shimmers with both heat and cold. It has no physical face, but from certain angles, the opening resembles a screaming mouth, with the glyphs acting as lips and the bottomless black as its throat.",
          "habitat": "These abyssal openings appear without warning in the volcanic fields and historical battlefields of Sundale and the Emberspire terrain.",
          "combat": "760 HP. Underworld-Mouth (passive: a perfectly circular pit, 10 ft across, that opens without warning; those who fall in are trapped in the labyrinth between Kur and Duat — a solo-adventure zone that may take centuries to navigate). Glyph-Warn (passive: walls are covered in spiraling hieroglyphic and cuneiform warnings that glow faintly red; DC 16 INT to read fast enough to stop a companion from falling in). Murmur-of-Dead (passive: continuous sound of countless voices in dead languages; DC 14 SPI or shaken, -2 to all checks within 50 ft). Sun-Path-Reveal (special: during Emberspire's annual vent-calm, the Solbrand's light momentarily illuminates the nearest Kur, revealing a path that may connect to Sol's prison — no one who has entered has returned). Abyssal-Grip (passive: creatures within 10 ft of the edge feel a gravitational pull toward the pit; DC 13 AGI each round or slide 5 ft closer). Vulnerable to none (it is a geography feature; only sealing it with a major ritual can close it).",
          "stats": {
            "strength": 0,
            "agility": 0,
            "constitution": 0,
            "intelligence": 16,
            "spirit": 20,
            "charisma": 10,
            "maxHp": 760,
            "maxMana": 100,
            "maxActionPoints": 0,
            "speed": 0,
            "resistances": {
              "all": 100
            }
          },
          "depth": "Kurs open spontaneously near areas of great tragedy, trapping the souls of those who fall within the labyrinth of the underworld. During the annual vent-calm of Emberspire, the light of the Solbrand shines down the pit, momentarily revealing the path to the buried sun-god Sol. Scholars believe that navigating this dangerous path may be the only way to free Sol, but since no one has ever returned from a Kur, the theory remains untested, and adventurers are warned to avoid these areas unless they possess the courage to brave the land of no return.",
          "hooks": [
            "A rumor spreads of a Kur spotted near the area.",
            "Adventurers need a component from a Kur to complete their quest."
          ],
          "description": "A circular, bottomless fissure covered in glowing red runes that murmurs with the voices of the dead. It is a portal to the underworld, briefly illuminated by the Solbrand during the annual vent-calm.",
          "heritage": "Rooted in Sumerian underworld legends, the Kur represented the spatial dread of the abyss where the dead wander and the earth swallows the living. The Wyrd anomaly materialized the miners' fear of being buried alive, shaping these spatial anomalies as dark fissures where tectonic structures warp."
        },
        {
          "id": "mushuss_child",
          "name": "Mušḫuššu",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/mushuss_child.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Mušḫuššu",
          "role": "Mushhushshu",
          "origin": "The Mušḫuššu is a rare and gentle juvenile beast representing new life and creation. Its mythic origins combine the Mushhushshu, the Babylonian dragon-serpent of the Ishtar Gate, and Heket, the Egyptian frog-goddess of fertility and childbirth who breathed life into newborns. In the harsh, barren landscape of Sundale, it is welcomed as a harbinger of hope and fertility.",
          "nature": "The size of a large dog, the Mušḫuššu has the long, scaled body of a serpent-dragon, with pale, translucent white scales that reveal its veins beneath. It walks on stubby lion paws in the front and small, underdeveloped eagle talons in the back, and its tail ends in a soft, wobbly stinger. Its face is a cute, rounded version of the adult Sirrush, with a small nub for a horn and large, curious gold eyes, and it communicates through soft, frog-like croaks.",
          "habitat": "These young dragons are found in the warm nesting grounds, rocky crevices, and agricultural borders of Sundale and Emberspire.",
          "combat": "380 HP. Imprint-Follow (special: imprints on the first kind creature it encounters, following them like a duckling; the bond encourages the adult Sirrush to guard the child's village). Life-Breath (passive: breath accelerates plant growth; a garden visited by a Mušḫuššu produces double yields — invaluable in ash-choked soil). Croak-Communicate (communicates via frog-like croaks; endearing but limited). Nub-Horn-Bonk (melee, +3 to hit, 1d4 bludgeoning — it is a baby). Scamper (can move through difficult terrain without penalty). Vulnerable to cold.",
          "stats": {
            "strength": 6,
            "agility": 16,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 14,
            "maxHp": 380,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 35,
            "resistances": {
              "fire": 50
            }
          },
          "depth": "Unlike their territorial parents, Mušḫuššuren are highly affectionate and will imprint on the first friendly creature they meet, following them like a pet. They possess a magical breath that doubles the agricultural yield of any soil they visit, making them incredibly valuable to Thrask farmers who leave bowls of milk to attract them. The Korr tolerate their presence near settlements because the bond helps ensure that adult Sirrush will guard the villages, and adventurers are often hired to protect these juveniles or locate lost ones in the wild.",
          "hooks": [
            "A rumor spreads of a Mušḫuššu spotted near the area.",
            "Adventurers need a component from a Mušḫuššu to complete their quest."
          ],
          "description": "A dog-sized, pale serpent-dragon with lion paws and eagle talons. It imprints on friendly creatures, using its fertility-blessed breath to double crop yields in ash-choked soil.",
          "heritage": "Derived from Babylonian dragon myths of divine companions, the Mušḫuššu represented the hope of new creation and the taming of wild elements. The Wyrd anomaly reacted to the settlers' desire to establish order and peace in the harsh foundries, materializing these gentle, horned dragons to guide young travelers."
        }
      ]
    },
    {
      "id": "iceheart-sea",
      "name": "The Iceheart Sea",
      "folklore": "Greek/Aegean + West African/Yoruba",
      "creatures": [
        {
          "id": "pelagos",
          "name": "Pelagos",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/pelagos.png",
          "illustrationCaption": "A Pelagos bounding through the icy spray, its bioluminescent whiskers twitching",
          "role": "The spume-hound pack hunter",
          "origin": "The Pelagos is a creature of the sea and the sky, born from the fusion of Yoruba maritime tales and the Greek legends of the Hippocampus. In the Iceheart Sea, where the waters are cold and the reefs are treacherous, the Pelagos are the guardians of the deep, creatures that were created to protect the treasures of the sea from those who would steal them. The Wyrd's corruption did not change their nature, but it did make them more fierce, for the creature now sees all who enter the water as potential thieves, and it will attack any who disturb the peace of the deep. The coastal fishers of the Iceheart Sea have learned to respect the Pelagos, and they will not fish in the waters where the creatures are known to hunt.",
          "nature": "A sleek hound resembling a greyhound but covered in smooth, rubbery shark skin with deep indigo and sea-foam green countershading. It has webbed paws, a dolphin-like dorsal fin, and a powerful shark tail that propels it through the water with incredible speed. Its chin features soft, glowing sensory whiskers that detect movement under freezing waters, and its eyes emit a soft green bioluminescence that can be seen from a hundred feet away. The Pelagos is intelligent enough to be trained, and it is fiercely loyal to those who earn its trust.",
          "habitat": "The Pelagos inhabits the coastal reefs, ice shelves, and kelp forests of the Iceheart Sea, particularly in the Myrathil Reef where the waters are warmest and the fish are most plentiful. It is most active during the dawn and dusk, when the light is low and the prey is active, and during the spring migration, when the whales pass through the Iceheart Sea and the Pelagos follows them. The creature's den is always near a source of fresh water, for the Pelagos is a creature of both sea and land, and it needs to drink as well as swim.",
          "combat": "155 HP. Spume Bite (melee, 2d6+4 piercing, plus DC 12 CON save or bleeds for 1d6 physical damage per round for 3 rounds). Bioluminescent Flash (emits a sharp flash of light from its eyes, 30 ft range, DC 13 AGI save or blinded for 1 round). Slipstream (moves 50 ft, ignoring difficult terrain in water). Immune to rime, resistant to physical.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 12,
            "maxHp": 155,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "rime": 100,
              "physical": 50
            }
          },
          "depth": "Highly intelligent and trainable companions. Coastal fishers and Deep-Born divers domesticate them to guide ships through rocky shoals, retrieve dropped anchors, and alert crews to low-frequency underwater vibrations. The Pelagos' bioluminescence is a mystery to scholars, for it is not the cold light of the deep, but the warm light of the surface, and some believe that the creature is a bridge between the two worlds, a creature that belongs to neither and both.",
          "hooks": [
            "A pack of feral Pelagos has begun harrying fishing boats near the reefs. The local fishers want them driven off, but a Deep-Born elder claims they are fleeing a far larger predator waking in the trench.",
            "An albino Pelagos, sacred to Olokun, was captured by a Neth merchant for sale. The Myrathil reef-keepers hire the party to break into the merchant's warehouse and rescue it before it is shipped off."
          ],
          "heritage": "Spun from Yoruba maritime tales and Greek legends of the Hippocampus, the Pelagos pack hunters originally served as warning stories to keep divers from venturing far from the shore. The Wyrd anomaly reacted directly to the harbor dredging and shipping expansions of Merrowport, materializing these spume-hounds to stalk coastal shipping lanes."
        },
        {
          "id": "egbere",
          "name": "Egbere",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/egbere.png",
          "illustrationCaption": "An Egbere weeping on a coastal rock, its small seaweed-mat head shield catching the spray",
          "role": "The crying reef-sprite",
          "origin": "The Egbere is a creature of the sea and the sorrow, born from the Yoruba legends of the small, crying spirits that carry magical mats. In the Iceheart Sea, where the waves are cold and the rocks are sharp, the Egbere are the spirits of the drowned, creatures that were once children who perished in the sea and were transformed by the Wyrd into something that is both pitiful and dangerous. The Wyrd's corruption did not change their nature, but it did make them more desperate, for the creature now cries not for itself, but for the living, and its tears are a lure that draws the unwary to their doom. The sailors of the Iceheart Sea know the sound of the Egbere's cry, and they will cover their ears when they hear it, for the creature's voice is a siren song that cannot be resisted.",
          "nature": "A small, amphibious humanoid with skin covered in wet scales and seaweed, sitting on coastal rocks or in dark caves, holding a small woven kelp mat on its head. It emits a loud, mournful crying sound that sounds like a lost child, and its eyes are large and black, reflecting the light of the moon. If a sailor attempts to rescue it, the Egbere attempts to steal their iron tools, using a blinding wave of salt water to escape. The creature is not evil, but it is hungry, and it will do whatever it takes to survive.",
          "habitat": "The Egbere inhabits the sea caves, rocky shoals, and reef borders of the Iceheart Sea, particularly in the Weeping Rocks where the waves crash against the shore with a sound like crying. It is most active during the stormy season, when the waves are high and the ships are most likely to be wrecked, and during the full moon, when the light is bright and the creature's eyes are most visible. The Egbere's cave is always near a source of fresh water, for the creature is a creature of both sea and land, and it needs to drink as well as swim.",
          "combat": "130 HP. Crying Call (AoE, 60 ft range, DC 13 SPI save or target is charmed, compelled to move toward the Egbere). Mat Shield (+4 defense while holding its woven mat). Salt Wave (30-ft cone, DC 13 AGI save or blinded by salt for 1 round). Vulnerable to ember.",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "rime": 50,
              "physical": 25
            }
          },
          "depth": "They are greedy beach-scavengers. The woven mat they carry is magically water-resistant; if stolen, it can be sold for a high price to shipwrights. The Egbere's mat is a mystery to scholars, for it is woven from a seaweed that does not exist in any known catalog, and some believe that the creature weaves the mats from its own hair, a process that takes a hundred years and is the creature's only purpose in life.",
          "hooks": [
            "A trading boat was lured onto a reef by a crying Egbere, and the crew is now stranded on a rocky islet. Rescue them before the tide rises.",
            "A Myrathil scholar wants the party to steal an Egbere's mat without killing the sprite. The mat holds the secret to weaving water-resistant sails."
          ],
          "heritage": "Rooted in Yoruba legends of crying reef-sprites, the Egbere originally served to explain the mournful, high-pitched whistling of wind through the hollows of coastal rocks, warning travelers against stealing items washed ashore. The Wyrd anomaly reacted to the sailors' sorrow and lost goods, materializing this weeping sprite to guard its magical mat on the reefs."
        },
        {
          "id": "scylla_crab",
          "name": "Scylla",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/scylla_crab.png",
          "illustrationCaption": "A Scylla standing on an ice floe, its volcanic glass shell glinting in the pale light",
          "role": "The ice-flow crab",
          "origin": "The Scylla is a creature of the deep and the dark, born from the maritime myths of Scylla and the northern tales of giant crustaceans. In the Iceheart Sea, where the waters are cold and the volcanic vents are hot, the Scyllas are the guardians of the deep, creatures that have evolved to survive in the most extreme environments. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as a threat, and it will attack any who come near its ice sheet. The fishermen of the Iceheart Sea know the signs of a Scylla's presence—a field of ice that is too smooth, and the absence of any other life.",
          "nature": "A giant crustacean with a shell made of dark, jagged volcanic glass (obsidian) and frozen sea-spray, its body the size of a small boat. It has massive, asymmetrical claws capable of cutting wooden hulls or crushing ice sheets, and its eyes line the rim of its shell like small, glowing blue beads. The creature moves with a slow, deliberate pace, but it can strike with incredible speed, and its claws are sharp enough to cut through steel. The Scylla is a creature of instinct, and it will defend its territory to the death.",
          "habitat": "The Scylla inhabits the ice sheets, glacier walls, and volcanic vents of the Iceheart Sea, particularly in the Obsidian Flats where the volcanic vents are most active and the ice is thickest. It is most active during the winter, when the ice is thickest and the creature's territory is most secure, and during the volcanic eruptions, when the vents are active and the water is warm. The Scylla's lair is always near a source of heat, for the creature is a creature of both fire and ice, and it needs the warmth to survive.",
          "combat": "390 HP. Obsidian Claw (+6 to hit, 2d8+5 physical, ignores 3 points of armor). Ice Cutter (+6 to hit, DC 14 AGI save or target's leg is pinned, halving their speed). Volcanic Steam (AoE, vents hot steam from its shell, 15-ft cone, 2d6 ember damage). Vulnerable to storm.",
          "stats": {
            "strength": 18,
            "agility": 12,
            "constitution": 18,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 4,
            "maxHp": 390,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "rime": 100,
              "ember": 50
            }
          },
          "depth": "Highly aggressive, territorial predators. They defend their ice sheets fiercely, striking instantly at any vessel or explorer that draws near. The Scylla's obsidian shell is a mystery to alchemists, for it is harder than any known material and it does not melt. Some scholars believe that the shell is made of the same material as the volcanic vents, and that the creature is a piece of the earth's fire, brought up to guard the ice.",
          "hooks": [
            "A giant Scylla has crawled onto a village's fishing ice sheet, making it impossible for the villagers to harvest fish.",
            "Craftsmen want to harvest the volcanic glass shell of a Scylla to forge shield plates that resist both extreme cold and heat."
          ],
          "heritage": "Spun from Greek maritime myths of Scylla, the multi-headed cliff monster, this giant crustacean originally rationalized why ships collided with submerged rocks in narrow channels. The Wyrd anomaly consolidated the sailors' panic during reef blasting, shaping their fear into a massive, ice-plate-hided crab that traps vessels in freezing bays."
        },
        {
          "id": "draugr_helmsman",
          "name": "Draugr Helmsman",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/draugr_helmsman.png",
          "illustrationCaption": "A sea-drenched Draugr Helmsman fused to a rotting ship wheel, seaweed coiling around its skull",
          "role": "The frozen mariner",
          "origin": "The Draugr Helmsman is a creature of the sea and the dead, born from the Norse maritime tales of the undead sailors who guard their sunken ships. In the Iceheart Sea, where the waters are cold and the wrecks are many, the Draugr Helmsmans are the spirits of the drowned, creatures that have been bound to their ships by the force of their own greed. The Wyrd's corruption did not change their nature, but it did make them more vengeful, for the creature now sees all who approach its wreck as thieves, and it will attack any who try to salvage its cargo. The divers of the Iceheart Sea know the signs of a Draugr's presence—a ship that is too well preserved, and the sound of a helmsman's whistle in the depths.",
          "nature": "A sea-drenched, blue-skinned undead sailor whose hands are fused to the rotting wood of a ship's helm wheel, its body draped in frozen blue kelp, barnacles, and rotting ropes. Its eyes glow with a chilling frost-light, and it speaks in a hollow, wind-swept whistle that can be heard through the water. The creature is bound to its ship, and it cannot move more than a hundred feet from the wreck. It is a creature of tragedy, and its rage is a thing of terrible beauty, for it is the rage of a man who died for his cargo and will not rest until it is safe.",
          "habitat": "The Draugr Helmsman haunts the shipwrecks, frozen bays, and ice floes of the Iceheart Sea, particularly in the Graveyard of the North where the wrecks of a thousand ships lie beneath the ice. It is most active during the winter, when the ice is thickest and the wrecks are most accessible, and during the storms, when the waves are high and the ships are most likely to sink. The Draugr's presence is a sign that the wreck is still sealed, and that the cargo within is still guarded.",
          "combat": "200 HP. Rotting Anchor (+5 to hit, 2d8+3 bludgeoning, reach 10 ft). Sea-Salt Curse (DC 13 SPI save or target's lungs fill with salt water, choking and dealing 1d8 damage per round). Frost Bind (ranged, DC 13 CON save or target is frozen in place). Vulnerable to ember.",
          "stats": {
            "strength": 16,
            "agility": 12,
            "constitution": 16,
            "intelligence": 8,
            "spirit": 14,
            "charisma": 6,
            "maxHp": 200,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "rime": 100,
              "blight": 100
            }
          },
          "depth": "Tragic, vengeful spirits bound to their sunken ships. They protect the cargo they died carrying, dragging salvage divers down into the freezing deep. The Draugr's frost-light is a mystery to scholars, for it is not the cold light of the dead, but the warm light of the living, and some believe that the creature is not truly dead, but suspended between life and death, a guardian that will never rest.",
          "hooks": [
            "A salvager cog is trapped in a frozen bay because a Draugr Helmsman has anchored their chain to his sunken ship.",
            "A scholar wants the helmsman's runic compass, believed to be able to navigate through the thickest sea fogs."
          ],
          "heritage": "Born from Norse maritime tales of undead sailors guarding their wrecks, the Draugr Helmsman was a warning to prevent looting of sunken ships. The Wyrd anomaly reacted to the guilt of Merrowport wreck-salvagers who abandoned drowning crews, materializing these frozen mariners to steer ghostly wrecks and seek vengeance on the living."
        },
        {
          "id": "qalupalik",
          "name": "Qalupalik",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/qalupalik.png",
          "illustrationCaption": "A scaly Qalupalik emerging from an ice crack, its long claws reaching out",
          "role": "The ice-well child-snatcher",
          "origin": "The Qalupalik is a creature of the ice and the dark, born from the Inuit mythology of the humanoid sea creatures that carry away children. In the Iceheart Sea, where the ice is thick and the water is cold, the Qalupaliks are the spirits of the frozen, creatures that have been twisted by the Wyrd into something that is both pitiful and terrifying. The Wyrd's corruption did not change their nature, but it did make them more predatory, for the creature now sees all who approach the ice as prey, and it will drag any who come near into the water. The parents of the Iceheart Sea know the signs of a Qalupalik's presence—a humming song on the wind, and the absence of any children.",
          "nature": "An amphibious, scaly humanoid sprite with dark green skin and long, slimy hair that smells of sulfur. It wears a large seal-skin parka with an oversized hood (amautik) on its back, and it hides beneath ice cracks, waiting to grab travelers and drag them down. The creature is stealthy and patient, and it can wait for hours beneath the ice, its only movement the slow rise and fall of its breathing. The Qalupalik is a creature of the dark, and it is most active during the long winter nights, when the ice is thickest and the children are most likely to wander.",
          "habitat": "The Qalupalik inhabits the frozen ocean shores, glacier fissures, and ice wells of the Iceheart Sea, particularly in the Child's End where the ice is thin and the water is deep. It is most active during the winter, when the ice is thickest and the children are most likely to wander, and during the spring thaw, when the ice cracks and the creature can reach through. The Qalupalik's lair is always beneath the ice, in a cave that is warm and dry, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "155 HP. Amautik Snatch (+5 to hit, DC 13 AGI save or pulled into the Qalupalik's hood and restrained). Ice Dive (can submerge into freezing water for 1 AP, avoiding attacks). Claw Strike (2d6+3 physical). Vulnerable to ember.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 6,
            "maxHp": 155,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "rime": 100
            }
          },
          "depth": "Stealthy, solitary hunters. They use a low, humming song to lure unwary children and travelers close to the ice cracks, dragging them down to live in their sub-glacial caves. The Qalupalik's amautik is a mystery to scholars, for it is made of a seal-skin that does not exist in any known catalog, and some believe that the creature skinned the seals itself, a process that takes a hundred years and is the creature's only purpose in life.",
          "hooks": [
            "A child was snatched from the shore ice by a Qalupalik. The party must venture down into the ice caves under the bay to rescue her.",
            "Hunters want to study the insulated seal-skin hood of a Qalupalik, believing it holds a secret to surviving extreme freezing wind."
          ],
          "heritage": "Rooted in Inuit mythology of humanoid child-snatchers, the Qalupalik was a cautionary tale to keep children from playing near cracking ice-sheets and freezing water edges. The Wyrd anomaly consolidated centuries of parental anxiety and the terror of losing children in the freezing depths, materializing this clawed horror to drag travelers into ice-wells."
        },
        {
          "id": "mamiri",
          "name": "Mamiri",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/mamiri.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Mamiri",
          "role": "Siren",
          "origin": "The legend of the Mamiri echoes the ancient myths of Greece, where avian or piscine maidens sang from shores of bone to wreck passing vessels, blended with the West African Yoruba traditions of Mami Wata. In the freezing expanses of the Iceheart Sea, she manifests as a powerful, seductive water-spirit associated with immense wealth, fertility, and highly dangerous bargains. She demands absolute devotion from those who dare seek her favor, punishing any hint of betrayal with watery graves.",
          "nature": "Standing upon the jagged, frozen reefs, she appears from the waist up as a heartbreakingly beautiful woman with skin the deep indigo of abyssal waters and eyes the warm, horizontal-pupiled green of shallow sea-shallows. Instead of a fish's tail, her lower half dissolves into a churning column of sea-foam and dark kelp, which reaches out like grasping hands toward the shore. She wears a crown of sharp coral and cowrie shells, and around her neck hangs a jangling collar of gold coins harvested from the pockets of drowned sailors. Her long, black hair moves of its own accord, swaying through the spray as she sings with full lips that never cease their deadly, hypnotic melody.",
          "habitat": "These creatures reside in the freezing, iceberg-strewn waters of the Iceheart Sea, where they perch on semi-submerged rocks and jagged reef formations.",
          "combat": "160 HP. Song-Lure (AoE 120 ft, DC 14 SPI save or overwhelming compulsion to move toward the Siren; ice-sheets amplify the song, extending range). Cowrie-Crown-Bargain (special: offers deals — wealth, safe passage, prime fishing-grounds — in exchange for a personal treasure, secret, or years of life; deals are binding if sealed with a cowrie shell). Kelp-Hair-Grasp (melee, reach 10 ft, +5 to hit, 1d8+3 bludgeoning + DC 13 AGI or grappled). Vulnerable to lightning.",
          "stats": {
            "strength": 12,
            "agility": 14,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 160,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 20,
            "resistances": {
              "cold": 50,
              "psychic": 25
            }
          },
          "depth": "She sits on freezing reefs and sings. She doesn't want gold; she demands 'warm memories.' To pass her reef safely, a player must let her touch their forehead and draw out one happy memory (e.g., their first kiss, a childhood birthday), which they then forget forever.",
          "hooks": [
            "A sailor survived a shipwreck but forgot his wife's name after meeting a Mamiri.",
            "A reef can only be bypassed by giving up a happy memory."
          ],
          "description": "A creature of tragic and terrifying beauty, this sea-spirit lures sailors to their doom with an irresistible song.",
          "heritage": "Derived from Greek Siren myths, the Mamiri originally rationalized the tragic lure of beautiful, auditory hallucinations that led exhausted sailors to wreck their ships on bone-strewn shores. The Wyrd anomaly reacted to the sailors' fatigue and disorientation, materializing these avian-piscine maidens to sing death-songs that draw crews into the deep."
        },
        {
          "id": "charybdis",
          "name": "Charybdis",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/charybdis.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Charybdis",
          "role": "Charybdis",
          "origin": "The Charybdis is born of the Greek myth of the primordial whirlpool monster Charybdis, who swallowed the seas three times a day to drag ships to the deep, merged with the West African Congo legend of the Dingonek, a scaly, leopard-spotted water-beast. In the Iceheart Sea, she is a colossal, elemental force of destruction, a natural counterpart to other coastal terrors.",
          "nature": "This creature presents as a rotating mass of dark water and fragmented ice forty feet wide, hiding the shifting, massive form of a leopard-spotted serpentine body that is never visible as a whole. Shield-sized spotted scales flash momentarily at the vortex's edge before being dragged back down into the depths. The water within the maw is hot and stinks of sulfur and rotting fish, roaring like thunder as it feeds. At the deepest point of the whirlpool lies a circular, terrifying mouth lined with rotating rings of serrated, spotted scales like a lamprey's throat scaled to architectural proportions.",
          "habitat": "This creature anchors itself in the narrow shipping channels and treacherous straits between the ice-fields of the Iceheart Sea.",
          "combat": "505 HP. Whirlpool-Vortex (passive: anchors in narrow shipping channels; any vessel within 100 ft is pulled 20 ft closer each round, DC 16 STR or AGI to resist). Swallow-Cycle (special: swallows water and debris, then expels in a geyser — expels cargo of consumed ships as treasure-currents; Deep-Born follow these to salvage). Leopard-Scale-Flash (passive: spotted scales flash at the vortex edge; the pattern disorients, DC 13 SPI or confused 1 round). Lamprey-Throat (melee, +7 to hit, 2d10+5 piercing + DC 15 STR or swallowed; swallowed targets take 4d6 acid per round). Vulnerable to lightning.",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 20,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 505,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 0,
            "resistances": {
              "cold": 100,
              "physical": 50
            }
          },
          "depth": "A massive circular maw that swallows entire ships. Its gullet is a treasure trove of shipwrecked gold and ancient weapons. Players can cast a rope into its mouth to fish for loot, but if they pull too hard, they might be dragged in.",
          "hooks": [
            "A legendary sword is believed to be sitting inside the gullet of a Charybdis.",
            "A vessel was swallowed whole, and survivors might be alive in its air-pocket stomach."
          ],
          "description": "A terrifying vortex of dark water and spotted scales, this living whirlpool devours entire ships in narrow shipping lanes.",
          "heritage": "Rooted in the Greek myth of the primordial whirlpool monster, the Charybdis was a myth to explain lethal, sudden ocean vortexes that swallowed vessels. The Wyrd anomaly acted upon the sailors' terror of Merrowport's deep shipping lanes, materializing this titanic, mawed whirlpool that swallows whole bays."
        },
        {
          "id": "ketos",
          "name": "Ketos",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/ketos.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ketos",
          "role": "Ketos/Cetus",
          "origin": "The Ketos draws its mythic lineage from the Greek Cetus, the colossal sea-monster sent to ravage Troy and slain by Heracles, combined with the South African legend of the Grootslang, a mistake of the gods that possessed the intellect of an elephant and the body of a serpent. In the setting, it exists as a titanic relic of creation that inhabits the darkest trenches.",
          "nature": "Spanning over two hundred feet in length, this leviathan combines the serpentine body of an ancient sea-dragon with the massive, tusked head of an elephant. Overlapping, whale-grey plates cover its immense body, which is underscored by bioluminescent organs pulsing with a deep blue light. Two thirty-foot tusks of yellowed ivory curve from its upper jaw, framing rowboat-sized eyes that are milky with cataracts. Its massive jaw hinges like a serpent's, and its colossal face bears an expression of ancient, bored contemplation.",
          "habitat": "This leviathan dwells in the dark, pressurized depths of the Treakous Oceanic Rift, coiling near the fragments of the Sundered Monolith.",
          "combat": "700 HP. Trench-Coil (passive: coils around the Sundered Monolith fragment; its movements cause the Monolith's resonance to fluctuate). Elephant-Tusk-Ram (melee, reach 20 ft, +8 to hit, 3d8+6 bludgeoning; ships struck take structural damage equal to half the damage). Bioluminescent-Pulse (passive: slow deep-pulse blue light along its underside; visible from miles in the dark ocean). Swallow-Whole (special: mouth large enough to swallow a small ship; DC 18 STR or vessel and crew are swallowed, taking 5d6 acid per round). God's-Mistake-Intellect (passive: enormous, intelligent brain; it may try to communicate through telepathic dreams rather than fight). Vulnerable to psychic (its own intelligence makes it vulnerable to mental assault — psychic damage ignores 50% of its resistances).",
          "stats": {
            "strength": 24,
            "agility": 8,
            "constitution": 22,
            "intelligence": 18,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 700,
            "maxMana": 80,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "physical": 75,
              "psychic": 25
            }
          },
          "depth": "So massive that its back gathers ice and soil, looking like a small harbor island. It only submerges if it hears a whale's song; bards can play a whale-song on a shell flute to soothe it back to sleep, allowing ships to escape its wake.",
          "hooks": [
            "A group of fishers anchored on what they thought was an island, but it began to breathe.",
            "A leviathan is blockading a port, and bards are searching for a whale-song flute."
          ],
          "description": "A primordial sea-monster of colossal scale, this tusked serpent guards the deepest rifts of the ocean floor.",
          "heritage": "Derived from the Greek Cetus, the colossal sea-monster sent by gods, the Ketos represented the fear of coastal devastation and massive tsunamis. The Wyrd anomaly reacted to the coastal villagers' dread of deep-sea dredging and harbor expansions, materializing this leviathan to crush docks and swallow fleets."
        },
        {
          "id": "harpy_squall",
          "name": "Harpy",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/harpy_squall.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Harpy",
          "role": "Harpy",
          "origin": "The Harpy traces its folklore roots to the Greek Harpy, the wind-spirit of divine punishment that stole souls and food, and the Ashanti Asanbosam, a forest-canopy vampire with iron teeth and hooked feet. In the Iceheart Sea, these creatures act as agents of localized tempests and scavengers of the masts.",
          "nature": "Having the wings, talons, and feathered torso of an oil-dark vulture, this creature possesses the gaunt, gray-skinned chest and face of a hag. Its feet are not talons but curved iron hooks that resemble grappling irons, dripping with freezing sea-water. The creature smells strongly of rotting fish, and its waterlogged feathers make its flight noisy and labored. Its hollow-cheeked face is dominated by furious, lightning-colored eyes and a wide mouth filled with filed iron teeth.",
          "habitat": "These creatures nest in the eyes of perpetual cyclones and perch in the sails, rigging, and masts of ships sailing the Iceheart Sea.",
          "combat": "135 HP. Mast-Snatcher (special: perched in rigging, snatches crew from decks; +6 to hit, 2d6+3 slashing + DC 14 AGI or grappled and lifted 20 ft). Iron-Hook-Feet (passive: feet are curved iron hooks; cannot be dislodged from masts without dealing 20 damage to the Harpy or breaking the mast). Storm-Rider (passive: nests in the eye of perpetual storms; navigates cyclones perfectly; seeing one means a storm exit-corridor exists nearby — Navigation check DC 13 to follow it safely). Feather-Slash (melee, +5 to hit, 1d8+3 slashing). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 18,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 14,
            "charisma": 6,
            "maxHp": 135,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 15,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "Harpys attack ships by perching in the rigging, dangling upside-down to snatch crew members from the decks with their iron hook-feet. Once they grip a mast, they cannot be dislodged without breaking the wood or killing the creature outright. Sailors fear them as death-omens, yet also use them as navigation aids since they always fly toward the calmest exit-corridors of cyclones. A recent squall has left a merchant fleet stranded, and the crew is hiring mercenaries to clear the harpies from their masts.",
          "hooks": [
            "A rumor spreads of a Harpy spotted near the area.",
            "Adventurers need a component from a Harpy to complete their quest."
          ],
          "description": "A storm-riding terror with iron hook-feet and vulture wings, this avian hag snatches sailors from the rigging.",
          "heritage": "Spun from Greek Harpy legends of divine thieves, this wind-spirit originally rationalized sudden, violent squalls that swept away crops, sails, and drying fish. The Wyrd anomaly consolidated the coastal merchants' fear of lost cargo during sudden ocean storms, materializing these taloned bird-women to steal food and rip sails."
        },
        {
          "id": "hippocampus_tide",
          "name": "Hippocampus",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/hippocampus_tide.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Hippocampus",
          "role": "Hippocampus",
          "origin": "The Hippocampus is inspired by the Greek sea-horse that drew Poseidon's chariot, combined with the West African Sawa tradition of the Jengu, a water-spirit associated with healing, prophecy, and coastal boundaries. In this setting, they serve as the loyal mounts of the Myrathil.",
          "nature": "Appearing from the chest up as a powerful horse with an arched neck, intelligent eyes, and a flowing mane of kelp, the creature's lower body transitions into a serpentine, fish-scaled tail that coils through the water. Its coat matches the blue-green of coastal waters, countershaded pale underneath. The kelp mane is bioluminescent, glowing green in the deep, while its hooves are modified into steering fins. Its noble face features liquid eyes that change from calm blue to storm green or moonlit silver.",
          "habitat": "These creatures reside in the brackish estuaries, coastal harbors, and shallow shoreline waters of the Iceheart Sea.",
          "combat": "130 HP. Rideable (special: can be tamed and ridden by Myrathil divers; land speed 30, swim speed 60; saddle naturally forms from kelp). Wave-Crest (passive: can calm or raise waves in a 30-ft radius, granting allies +10 swim speed and making water difficult for enemies). Estuary-Purify (passive: presence purifies Wyrd-tainted water; creatures drinking from Hippocampus-tended water are immune to water-borne disease for 24 hours). Kelp-Mane-Glow (passive: bioluminescent mane provides light in 20-ft radius). Hoof-Fin-Steer (melee, +4 to hit, 1d6+2 bludgeoning). Vulnerable to poison.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "cold": 100
            }
          },
          "depth": "Capable of outpacing storm-currents, Hippocampuss are tamed by Myrathil divers to patrol the harbors of Merrowport. Their presence naturally purifies Wyrd-taint from coastal waters, protecting nearby settlements from water-borne diseases and plagues. They are drawn to the boundaries where fresh rivers meet the sea. A local keeper has reported that a wild Hippocampus has been spotted nearby, and the local temple is looking for adventurers to help guide it safely to a contaminated estuary.",
          "hooks": [
            "A rumor spreads of a Hippocampus spotted near the area.",
            "Adventurers need a component from a Hippocampus to complete their quest."
          ],
          "description": "A noble creature combining horse and serpent, this gentle elemental purifies waters and serves as a swift steed.",
          "heritage": "Derived from Greek sea-horse myths and West African water-spirit beliefs, the Hippocampus represented the hope of finding safe passage and calm winds on open water. The Wyrd anomaly reacted to the sailors' desperate prayers for fair tides, materializing these half-horse, half-fish creatures to guide ships or drown greedy captains."
        },
        {
          "id": "gorgon_depth",
          "name": "Gorgon",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/gorgon_depth.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Gorgon",
          "role": "Gorgon",
          "origin": "This creature combines the Greek Gorgon, whose hair of snakes and terrible face turned onlookers to stone, with the West African Ewe myth of the Adze, a vampiric firefly-spirit that drinks blood and shifts between insect and humanoid forms. In the deep sea, she is a dread entity of the trenches.",
          "nature": "She appears as a serpentine humanoid woman with skin the deep violet of the abyss and a lower body composed of coiling sea-serpents. Her hair is a writhing mass of tiny, glowing, bioluminescent eels that pulse in hypnotic, rhythmic patterns. Translucent scales cover her torso, revealing dark veins. Her face is frozen in an expression of eternal rage, dominated by solid, glowing green eyes that cause the blood of onlookers to crystallize with calcium. She carries a mirror of polished abalone.",
          "habitat": "This creature makes its home in the dark, freezing waters of the abyssal trenches within the Iceheart Sea.",
          "combat": "380 HP. Stone-Gaze (ranged 30 ft, DC 15 SPI or progressive petrification begins — round 1: -10 speed; round 2: restrained; round 3: petrified; gaze must be maintained). Eel-Hair-Hypnosis (passive: bioluminescent eel-hair pulses hypnotically; DC 13 SPI or entranced, can be pulled toward her without resistance). Firefly-Shift (1 AP: compresses into a single tiny bioluminescent eel, becoming nearly invisible — DC 16 INT (Perception) to spot; in this form she drinks blood from fish). Abyssal-Mirror (special: polished abalone mirror reflects gaze attacks back at attackers; once per round as a reaction). Vulnerable to radiant.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 380,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "The petrifying gaze of the Gorgon leaves living statues of terror on the sea-floor, which are often animated by the Wyrd to plague shipping lanes. She can compress her body into a single, tiny bioluminescent eel to slip through fishing-nets and drain the blood of captured catches. To prevent this, sailors must inspect their catch with silver mirrors, which expose her disguise. Adventurers are being recruited to venture into the abyss to recover a petrified crew and destroy the Gorgon nesting near the trench.",
          "hooks": [
            "A rumor spreads of a Gorgon spotted near the area.",
            "Adventurers need a component from a Gorgon to complete their quest."
          ],
          "description": "An abyssal humanoid whose gaze crystallizes blood into stone, this creature shifts into a bioluminescent eel to hunt.",
          "heritage": "Born from Greek Gorgon myths, this creature originally rationalized the sudden paralysis and absolute terror that froze travelers when cornered by unseen forest predators. The Wyrd anomaly consolidated this fight-or-flight shock and the fear of the dark undergrowth, materializing this snake-haired hybrid whose gaze induces fossilizing paralysis."
        },
        {
          "id": "tokoloshe_tide",
          "name": "Tokoloshe",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/tokoloshe_tide.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Tokoloshe",
          "role": "Tokoloshe/Tikoloshe",
          "origin": "The Tokoloshe is born of the Zulu legend of the Tokoloshe, a hairy, mischievous sprite that becomes invisible by swallowing a pebble and attacks sleeping children, merged with the Greek Nereids, though this creature is far more troublesome than its nymph cousins. In the Iceheart, it is a persistent shipboard nuisance.",
          "nature": "Standing only two feet tall, this gremlin-like creature possesses a hairy, wizened humanoid upper body and the lower half of an octopus. Its mottled green-and-brown skin blends perfectly with kelp and wet rock. Its face is a grotesque goblin mask with an elongated snout, large ears, and an enormous mouth stretching from ear to ear. Bright, beady eyes gleam with malicious glee as it carries a smooth, black pebble in its cheek to remain completely invisible.",
          "habitat": "These pests infest the dark cargo holds, wet bilges, and coastal kelp forests of the Iceheart Sea.",
          "combat": "45 HP. Pebble-Swallow-Invisibility (special: swallows a black pebble to become invisible; DC 14 INT (Perception) to locate by the sound of its breathing). Bilge-Pest (passive: infests ship bilges; tangles rigging, sabotages navigation tools — all Navigation checks DC +5 while it remains). Child-Sit (special: sits on sleeping children's chests, whispering nightmares; child loses 1 SPI per night until a Myrathil shaman performs a copper-bell banishment). Long-Arm-Grab (melee, +4 to hit, 1d4 bludgeoning + item theft). Vulnerable to radiant.",
          "stats": {
            "strength": 6,
            "agility": 18,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 45,
            "maxMana": 15,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "cold": 25
            }
          },
          "depth": "Infesting ship bilges, Tokoloshes tangle rigging and sabotage compasses, causing navigation checks to fail unless banished by a Myrathil shaman using salt-water barriers and copper bells. At night, they creep into cabins to sit on sleeping children's chests and whisper nightmares, slowly draining their spirit. Raising beds with bricks keeps them out of reach. Recently, a merchant captain has reported a severe bilge infestation, and is looking for adventurers to perform the banishment ritual.",
          "hooks": [
            "A rumor spreads of a Tokoloshe spotted near the area.",
            "Adventurers need a component from a Tokoloshe to complete their quest."
          ],
          "description": "A small, mischievous water-sprite with the lower body of an octopus, this bilge-pest turns invisible by holding a pebble.",
          "heritage": "Spun from Zulu legends of hairy, mischievous sprites, the Tokoloshe was a warning myth to enforce domestic respect and explain sudden night accidents in sleeping quarters. The Wyrd anomaly reacted to the cramped, tense cabins of Merrowport's harbor workers, materializing this invisible sprite to attack sleeping sailors."
        },
        {
          "id": "lamia_shoal",
          "name": "Lamia",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/lamia_shoal.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Lamia",
          "role": "Lamia",
          "origin": "The Lamia is derived from the Greek myth of Lamia, a grieving queen turned serpent-woman who devoured children, and the Ashanti Sasabonsam, a canopy-dwelling monster with long arms and iron claws. In the Iceheart Sea, she is a tragic creature warped by the Wyrd.",
          "nature": "She has the upper body of a beautiful, pale, and mourning woman, emerging from a massive serpentine tail covered in razor-sharp coral. Her arms are abnormally long, stretching twelve feet and ending in iron-hard, six-fingered claws. Her skin is covered in sucker-scars, and she weeps constant tears of pearl that dissolve into the ocean. Her grieving face features full lips that hide three rows of needle-like predator teeth.",
          "habitat": "These creatures stalk the shallow reef-channels, rocky sandbars, and narrow harbors of the Iceheart Sea.",
          "combat": "170 HP. Impossible-Reach (passive: arms are 12 ft long; can attack and grapple at reach 15 ft). Reef-Grasp (melee, +6 to hit, 2d6+4 slashing + DC 14 AGI or grappled and pulled from deck). Grief-Lure (special: sings a lullaby that sounds like a grieving mother; listeners who have lost children DC 15 SPI or lean over the rail into her reach). Pearl-Tear (passive: tears dissolve into the sea, leaving pearl-trails that attract predators). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 170,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 20,
            "resistances": {
              "cold": 50
            }
          },
          "depth": "Positioning herself in narrow channels, the Lamia uses her long arms to pluck sailors—especially the young—from low decks. She sings a mournful lullaby that mimics a grieving mother, drawing those who have lost children to lean over the rails. The Myrathil pity her as a victim of the Wyrd's cruelty, leaving offerings of coral to buy safe passage. A rumor of a Lamia blocking a vital trade route has prompted local authorities to seek adventurers to either appease or slay her.",
          "hooks": [
            "A rumor spreads of a Lamia spotted near the area.",
            "Adventurers need a component from a Lamia to complete their quest."
          ],
          "description": "A mourning reef-dweller with impossibly long arms, this creature sings to lure sailors into her coral-plated coils.",
          "heritage": "Derived from Greek myths of Lamia, the grieving queen turned monster, this serpent-woman originally served to explain the sudden, tragic disappearance of young children from coastal villages. The Wyrd anomaly consolidated this deep maternal grief and the fear of predatory strangers, materializing this half-serpent horror to hunt the shoals."
        },
        {
          "id": "empusa_ice",
          "name": "Empusa",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/empusa_ice.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Empusa",
          "role": "Empusa",
          "origin": "This creature derives from the Greek Empusa, a shape-shifting daughter of Hecate with one brass leg who seduced and drained sleeping men, and the Xhosa Impundulu, a vampiric lightning bird associated with storms. In the setting, she represents a storm-born curse.",
          "nature": "She appears as a beautiful woman in storm-grey robes, walking with an asymmetric click-thud due to her right leg of polished brass and her left leg of donkey-fur ending in a split hoof. She carries a staff topped with the skull of a hammer-headed heron, and lightning crackles from her fingers. While her left profile is stunningly beautiful, her right profile is a bare bird-skull wreathed in static discharge, shifting instantly depending on her mood.",
          "habitat": "These entities wander the storm-swept decks, rocky coasts, and frozen floes of the Iceheart Sea.",
          "combat": "240 HP. Storm-Seduction (special: approaches lone watch-keepers; DC 14 SPI or charmed and drawn to her; she drains 2d6+3 vitality per round while speaking). Asymmetric-Walk (passive: brass leg clicks, donkey-hoof thuds; the sound causes DC 12 SPI or disorientation, -2 to attacks against her). Brass-Leg-Chill (passive: brass leg is always cold; touching it deals 1d6 cold per round). Lightning-Inheritance (passive: when destroyed, essence transfers to a new host within 100 miles — the host is always a woman who has lost a child to the sea; permanent destruction requires bargaining with, not killing, her). Hammer-Skull-Staff (melee, +6 to hit, 2d6+3 bludgeoning + 1d6 lightning). Vulnerable to fire.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 240,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 50,
              "lightning": 50
            }
          },
          "depth": "The Empusa targets lone watch-keepers on night shift, using static-laced seduction to drain their vitality until they are desiccated husks. She is immortal; when slain, her essence transfers to a new host—always a grieving mother who lost a child to the sea. The only way to stop her is to strike a bargain rather than kill her. A local outpost has reported the mysterious deaths of several watch-keepers, and is seeking adventurers to investigate the clicks and thuds heard in the wind.",
          "hooks": [
            "A rumor spreads of a Empusa spotted near the area.",
            "Adventurers need a component from a Empusa to complete their quest."
          ],
          "description": "A shape-shifting elemental with a brass prosthetic leg, this creature drains the life of watch-keepers during storms.",
          "heritage": "Rooted in Greek myths of Empusa, the shape-shifting daughter of Hecate, this creature originally served to warn young men against the temptations of predatory strangers along lonely roads. The Wyrd anomaly consolidated the fear of succumbing to moral weakness and freezing winter nights, materializing this brass-legged predator to drain sleeping victims."
        },
        {
          "id": "telkhine_frost",
          "name": "Telkhine",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/telkhine_frost.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Telkhine",
          "role": "Telkhines",
          "origin": "The Telkhine is inspired by the Greek Telkhines, dog-headed, flipper-handed metalworkers cast into the sea for destructive magic, and the Congo River cryptid Mokèlé-mbèmbé. In the Iceheart Sea, they are covetous artisans of the cold.",
          "nature": "Weighing as much as a walrus, this squat four-foot humanoid has the dense slate-grey fur and head of a seal, but the webbed, calloused hands of a blacksmith. It carries a forge-hammer of whale-bone and ice that emits sparks of frost when struck. Its face features a coarse beard of steel-wool wire, and its red, forge-lit eyes are always calculating the value of nearby metals. It speaks in deep, guttural barks.",
          "habitat": "These elemental smiths reside in submerged caverns, volcanic vents, and icy shores of the Iceheart Sea.",
          "combat": "220 HP. Ice-Smith (special: can forge weapons from deep-sea ice that never melt; creates Telkhine-Ice weapons — +1d6 cold damage, permanent until shattered). Whale-Bone-Hammer (melee, +6 to hit, 2d6+4 bludgeoning + DC 13 STR or stunned 1 round). Boat-Roll (special: overturns small boats, stripping all metal fittings — nails, rivets, hinges — leaving only wood; no attack roll, DC 14 STR to hold onto the boat). Metal-Obsession (passive: attacks the creature carrying the most metal). Seal-Bark (AoE 20 ft, DC 12 SPI or confused 1 round). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 20,
            "resistances": {
              "cold": 100,
              "physical": 25
            }
          },
          "depth": "The Telkhine is the only creature capable of crafting weapons from deep-sea ice that never melt, demanding copper and whale-bone rather than gold as payment. They are obsessed with collecting rare alloys, often overturning small boats not to eat the crew, but to strip the nails, rivets, and hinges from the wood. A merchant guild is currently recruiting adventurers to negotiate with a Telkhine for a shipment of ice-blades, warning them to secure all metal fittings on their vessel.",
          "hooks": [
            "A rumor spreads of a Telkhine spotted near the area.",
            "Adventurers need a component from a Telkhine to complete their quest."
          ],
          "description": "A seal-headed blacksmith of walrus-like bulk, this elemental forges weapons from deep-sea ice that never melt.",
          "heritage": "Spun from Greek legends of dog-headed metalworkers cast into the sea for practicing dark magic, the Telkhine originally rationalized sudden, unexplained failures of ship machinery and anchor chains. The Wyrd anomaly reacted to the sailors' fear of deep-sea magic, materializing these flipper-handed smiths to corrode hulls and trigger freezing storms."
        },
        {
          "id": "stymphalian_flock",
          "name": "Stymphalian Bird",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/stymphalian_flock.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Stymphalian Bird",
          "role": "Stymphalian Birds",
          "origin": "The Stymphalian Bird is based on the Greek Stymphalian birds with bronze feathers, driven away by Heracles with rattles, and the Central African Kongamato, a pterosaur-like boat-overturner. In the Iceheart, they are aerial pests of the shipping lanes.",
          "nature": "This flock consists of eagle-sized predatory birds with bodies covered in metallic, razor-edged feathers of bronze and copper. Their underbellies are reddish-leathery, and their long, sharp beaks are made of actual bronze. Their pterosaur-like heads feature compound eyes that reflect light like hammered copper, maintaining a completely expressionless, hungry gaze.",
          "habitat": "These birds nest on the high rocky crags, frozen cliffs, and open skies above the Iceheart Sea.",
          "combat": "145 HP (per flock; treat as swarm). Feather-Arrow (ranged 40 ft, +5 to hit, 2d6+3 piercing — feathers regrow within hours). Bronze-Rattle-Vulnerability (special: loud bronze rattles cause the flock to DC 13 SPI or flee; this is the classic Heracles counter). Boat-Overturner (special: attacks from above, driving crew into water to scoop fish; incidental damage to sailors is 1d6/round while flock is overhead). Metallic-Clatter (passive: wings beat with a distinctive metallic sound, giving away position within 200 ft but also causing DC 12 SPI or distracted, -2 to concentration). Vulnerable to thunder.",
          "stats": {
            "strength": 8,
            "agility": 18,
            "constitution": 10,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 145,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 10,
            "resistances": {
              "physical": 50
            }
          },
          "depth": "The flock attacks by flying in tight formations and shedding their metallic, barbed feathers like a rain of daggers capable of piercing armor. They overturn small boats to drive crew members into the water, allowing them to easily scoop up the fish that rise to the surface. Neth ships carry bronze rattles to simulate Heracles' ancient method of driving them off. A flock has recently nested near a vital strait, and local sailors are seeking adventurers equipped with loud instruments to clear the passage.",
          "hooks": [
            "A rumor spreads of a Stymphalian Bird spotted near the area.",
            "Adventurers need a component from a Stymphalian Bird to complete their quest."
          ],
          "description": "A swarm of metallic-feathered birds that rain razor-sharp bronze plumage like daggers upon vessels.",
          "heritage": "Based on Greek myths of birds with bronze feathers, this flock originally represented the fear of flying swarms that devoured grain fields and mutilated livestock. The Wyrd anomaly reacted to the local farmers' anxiety over crop loss and toxic ash falls, materializing these metal-feathered birds to slash travelers with razor plumage."
        },
        {
          "id": "nereid_deep",
          "name": "Nereid",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/nereid_deep.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nereid",
          "role": "Nereid",
          "origin": "The Nereid is drawn from the Greek Nereids, benevolent sea-nymphs who aided sailors in distress, and Olokun’s Attendants in Yoruba mythology, who guard the treasures of the deep ocean. In the Iceheart, they are the rare saviors of the freezing waters.",
          "nature": "She appears as a luminous, translucent woman of serene, ageless beauty, composed of compressed water and light that glows blue-green. She rides a massive dolphin of the same luminous material, and a crown of phosphorescent pearls floats above her head. Her skin ripples with tidal patterns, and her large, glowing eyes contain the entire spectrum of ocean colors.",
          "habitat": "These spirits dwell in the deepest, darkest waters, abyssal rifts, and shipwrecks of the Iceheart Sea.",
          "combat": "130 HP. Drowning-Savior (special: seeks out drowning sailors and carries them to the surface; heals target for 2d8+4 and restores water-breathing for 1 minute; costs the Nereid 10 HP). Breath-Withdraw (special: as a defensive measure, withdraws the breath of the sea from trespassers in her territory — DC 14 CON or begin drowning). Treasure-Guard (passive: guards abyssal debris-fields of sunken ships; Deep-Born treat her as sacred). Luminous-Form (passive: emits soft blue-green light in 30-ft radius; +6 to Persuasion). Vulnerable to necrotic.",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 130,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "cold": 100,
              "psychic": 50
            }
          },
          "depth": "The Nereid rescues drowning sailors, carrying them to the surface at the cost of her own energy, which forces her to rest for years afterward. She guards the abyssal debris-fields of sunken ships, and while the Deep-Born Myrathil treat her as sacred, she will withdraw the breath of the sea from any who disrespect her boundaries. Recently, a famous explorer's ship sank in her territory, and the family is seeking adventurers to politely request her aid in salvaging the ship's logbook.",
          "hooks": [
            "A rumor spreads of a Nereid spotted near the area.",
            "Adventurers need a component from a Nereid to complete their quest."
          ],
          "description": "A benevolent spirit of compressed water and light, this fey rescues drowning sailors in the dark depths.",
          "heritage": "Spun from Greek sea-nymph legends, the Nereid originally served as a comforting myth of divine salvation, explaining how some shipwrecked sailors miraculously survived drowning. The Wyrd anomaly reacted to the sailors' hope for survival on the treacherous seas, materializing these glowing water spirits to rescue drowning crews."
        },
        {
          "id": "graeae_oracle",
          "name": "Graeae",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/graeae_oracle.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Graeae",
          "role": "Graeae / Grey Sisters",
          "origin": "The Graeae originates from the Greek Graeae or Grey Sisters, who shared a single eye and tooth, and the Yoruba Ifá divination system read by Babalawos. In the Iceheart Sea, they are keepers of fate and cosmological patterns.",
          "nature": "These three frost-covered, ancient crones huddle together in tattered, ink-stained robes, passing a polished obsidian sphere between them. The crone holding the eye has a living, youth-shifting face, while the other two have empty, frozen sockets that weep frost. They carry divining chains made of copper and bone, and their forms shift to reflect the timelines they view.",
          "habitat": "These ancient sisters sit on the most remote and desolate icebergs in the far reaches of the Iceheart Sea.",
          "combat": "145 HP. Shared-Obsidian-Eye (special: three crones share one obsidian eye that shows possible futures; pass the eye to grant one prophetic answer per round; those who refuse to pay a tooth receive a false prophecy that leads to destruction). Tooth-Price (special: answer costs one tooth; extraction deals 1d4 damage but ensures the prophecy is true). Ifá-Bone-Pattern (special: casts seal-bones on ice, revealing cosmological patterns — DC 15 INT to interpret; each pattern corresponds to a specific future event). Frost-Robe (passive: robes are frost-covered; melee attackers take 1d6 cold). Vulnerable to radiant.",
          "stats": {
            "strength": 6,
            "agility": 10,
            "constitution": 12,
            "intelligence": 18,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 145,
            "maxMana": 50,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "cold": 100,
              "psychic": 50
            }
          },
          "depth": "The sisters offer to answer questions about the future by casting seal-bones on the ice to read Ifá patterns. However, they demand a tooth from the questioner as payment; those who refuse are given a false prophecy that leads to their destruction. Neth merchants often seek them out to predict market trends, paying in valuable whale-teeth. A lost captain has reported seeing their iceberg, and scholars are looking for adventurers to consult the oracle about a looming storm.",
          "hooks": [
            "A rumor spreads of a Graeae spotted near the area.",
            "Adventurers need a component from a Graeae to complete their quest."
          ],
          "description": "Three ancient crones sharing a single obsidian eye, these sisters offer true prophecies in exchange for a tooth.",
          "heritage": "Rooted in Greek legends of the Grey Sisters who shared a single eye, this oracle originally served to warn travelers against seeking forbidden secrets of the future. The Wyrd anomaly consolidated the scholars' fear of losing knowledge during the Dimming, materializing these three sisters to trade cryptic prophecies for memories."
        },
        {
          "id": "triton_conch",
          "name": "Triton",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/triton_conch.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Triton",
          "role": "Triton",
          "origin": "The Triton draws from the Greek Triton, son of Poseidon who blew a conch to calm or raise the waves, and Olokun, the Yoruba deity of the deepest ocean. In this setting, he acts as a cosmic peacekeeper and ruler of the tides.",
          "nature": "A powerful merman with a muscular upper body and a coiled, deep-blue scaled tail, he carries a massive conch shell carved with geometric patterns that pulse with light. His skin is oceanic blue, and his hair consists of prehensile, bioluminescent tentacles. His angular face features horizontal, goat-like pupils that glow with deep indigo, carrying an expression of absolute sovereign authority.",
          "habitat": "These sovereigns patrol the open waters, tidal reefs, and deep trenches of the Iceheart Sea.",
          "combat": "270 HP. Wave-Control (special: horn-call calms or raises waves within 1 mile; in combat, creates a 40-ft wall of water dealing 3d6 bludgeoning, DC 16 STR or AGI or pushed back 30 ft). Monolith-Dampen (passive: when the Sundered Monolith's resonance grows too intense, his horn dampens the frequency, preventing deep-sea stampedes — this makes him a cosmic peacekeeper). Trident-Strike (melee, +7 to hit, 2d8+5 piercing). Depth-Sovereign (passive: serves as mediator between surface-dwellers and abyssal entities; his presence prevents lesser sea-monsters from attacking within 100 ft). Vulnerable to poison.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 18,
            "intelligence": 16,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 270,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "lightning": 50
            }
          },
          "depth": "The Triton's horn-call can alter the waves for a mile, which he uses to clear storm-swept shipping lanes in exchange for amber and copper offerings. He serves as a mediator between surface-dwellers and abyssal leviathans, using his horn to dampen the Sundered Monolith's resonance and prevent stampedes. The Deep-Born Myrathil revere him as the voice of Olokun. A trade guild is looking for adventurers to deliver a tribute of rare copper to his reef to secure safe passage for their fleet.",
          "hooks": [
            "A rumor spreads of a Triton spotted near the area.",
            "Adventurers need a component from a Triton to complete their quest."
          ],
          "description": "A sovereign merman with a prehensile tentacle mane, this elemental controls the waves with a vibrating conch.",
          "heritage": "Derived from Greek Triton myths, this creature originally represented the personification of the roaring waves and the hope of calming storms with sacred horn blasts. The Wyrd anomaly reacted to the sailors' dread of open-ocean tempests, materializing this conch-blowing water deity to calm the waters or drown arrogant captains."
        },
        {
          "id": "nandi_swell",
          "name": "Nandi",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/nandi_swell.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nandi",
          "role": "Nandi Bear",
          "origin": "The Nandi is based on the East African Nandi Bear, a shaggy, brain-eating cryptid, and the Greek Ketos or sea-beast category of unnamed coast-terrorizing monsters. In the Iceheart Sea, it is a brutal predator of the ice.",
          "nature": "A massive, hyena-like beast adapted for the ocean, its sloping body is covered in a dense, oily, water-repellent hide. Its front flippers retain massive, raking claws, and a ruff of stiff, greasy bristles surrounds its neck to trap air. Its face features a broad muzzle with an immense bite-force, small eyes burning with predatory intelligence, and flattened, seal-like ears.",
          "habitat": "These beasts hunt along the drifting ice-floes, frozen coastlines, and open channels of the Iceheart Sea.",
          "combat": "275 HP. Skull-Crush (melee, +6 to hit, 2d8+5 bludgeoning + target DC 15 CON or stunned 1 round; specifically targets the head). Ice-Floe-Ambush (passive: hides on ice-floes, +8 to stealth on ice; first attack has advantage). Migration-Parasite (passive: follows whale migrations; a pod of Nandis can strip a whale carcass to the skeleton in hours). Bristle-Float (passive: ruff of greasy bristles traps air for buoyancy; cannot be drowned). Vulnerable to fire.",
          "stats": {
            "strength": 20,
            "agility": 12,
            "constitution": 18,
            "intelligence": 6,
            "spirit": 8,
            "charisma": 6,
            "maxHp": 275,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "physical": 25
            }
          },
          "depth": "Nandis hunt on ice-floes, stalking ice-fishing camps and using their claws to tear open shelters. They target the heads of their prey to consume the fat-rich brains, and they frequently follow whale migrations to scavenge carcasses. Whalers view them as a sign of nearby whales but must defend their catches from them. A local village has reported a pack of Nandis nesting nearby, and is hiring hunters to clear them before the winter freeze.",
          "hooks": [
            "A rumor spreads of a Nandi spotted near the area.",
            "Adventurers need a component from a Nandi to complete their quest."
          ],
          "description": "A ferocious, hyena-like sea-beast that hunts on ice-floes and crushes the skulls of its prey.",
          "heritage": "Spun from East African cryptid legends and Greek sea-monster tales, the Nandi originally served to warn hunters and herders against venturing into remote, shaggy coastal caves alone. The Wyrd anomaly materialized the survival panic of settlers facing massive land predators, shaping their fears into a shaggy, brain-eating beast."
        },
        {
          "id": "popobawa_night",
          "name": "Popobawa",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/popobawa_night.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Popobawa",
          "role": "Popobawa",
          "origin": "The Popobawa is inspired by the Zanzibar Popobawa, a bat-winged, one-eyed spirit that attacks victims in their homes, and the Greek Empusa's shape-shifting, fear-exploiting nature. In the setting, it is a plague of ship cabins.",
          "nature": "Its form shifts constantly between a hunched dwarf, a bat-winged specter, and a formless shadow, leaving a trail of sulfur-smelling phosphorescent slime. Its only stable feature is a single bruised eye in the center of its mass. This eye gazes with a mocking intelligence, while the rest of its shifting body dissolves into black smoke before congealing into new shapes.",
          "habitat": "These spirits infiltrate the dark, cramped cabins and crew quarters of ships sailing the Iceheart Sea.",
          "combat": "380 HP. Form-Cycle (passive: each round, shifts between hunched dwarf, bat-winged specter, and formless shadow — attacks of opportunity cannot target it). Single-Eye (passive: the one stable feature; DC 14 INT (Perception) to track; if stared at for 3 rounds, DC 15 SPI or frightened for 1 minute). Cabin-Terror (special: infiltrates sleeping-quarters; target wakes with night-terrors, gaining 1 level of exhaustion per night). Shame-Silence (passive: victims are psychically compelled not to speak of the attack; the Popobawa returns each night until a victim names it publicly to another person, breaking the hold). Sulfurous-Slime (passive: leaves phosphorescent slime; can be tracked, but touching it causes DC 13 CON or nauseated 1 round). Vulnerable to radiant.",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "physical": 50,
              "psychic": 50
            }
          },
          "depth": "The Popobawa slips into cabins to inflict severe night-terrors that exhaust sailors and cause them to collapse on watch. The creature psychically silences its victims, and it will return nightly until the victim publicly names it to another person. Captains enforce policies where crew members must describe their dreams at breakfast to break this silence. A vessel has recently arrived in port with a completely exhausted crew, and investigators are looking for adventurers to root out the spirit.",
          "hooks": [
            "A rumor spreads of a Popobawa spotted near the area.",
            "Adventurers need a component from a Popobawa to complete their quest."
          ],
          "description": "A shape-shifting shadow with a single bruised eye, this spirit inflicts night-terrors on sleeping crews.",
          "heritage": "Inspired by Zanzibar legends of bat-winged night demons, the Popobawa served as a somatic explanation for violent sleep paralysis and night terrors that could not be explained. The Wyrd anomaly consolidated the nightly vulnerability of coastal residents, materializing this one-eyed predator to terrorize sleeping sailors in their hammocks."
        },
        {
          "id": "abada",
          "name": "Abada",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/abada.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Abada",
          "role": "Abada",
          "origin": "The Abada is based on the Central African Abada, a small unicorn-antelope whose horn serves as an antidote, and the Monoceros of Greek bestiaries, whose horn neutralizes toxins. In the Iceheart, it is a sacred purifier.",
          "nature": "A small, antelope-sized creature resembling a baby narwhal, its sleek body is covered in pearl-white fur, and its hooves are modified into webbed flippers. A single spiraling horn of pearlescent ivory juts from its forehead, glowing with warm, opalescent light. Its fawn-like face features oversized, rotating ears and enormous liquid eyes that project absolute innocence.",
          "habitat": "These gentle beasts reside in the shallow coral reefs, lagoons, and freshwater estuaries of the Iceheart Sea.",
          "combat": "130 HP. Horn-Purify (special: touching a poisoned water-source with its horn instantly purifies it; a single horn can purify a ship's water supply for a year, but harvesting it is sacrilege). Reef-Garden (passive: uses its spiral horn to carve channels that direct nutrient currents; an Abada-tended reef grows twice as fast and is immune to Wyrd-decay). Playful-Bound (passive: moves with bouncing, playful grace; +6 to escape and evasion). Narwhal-Bonk (melee, +4 to hit, 1d6+2 piercing). Vulnerable to cold.",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 10,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 40,
            "resistances": {
              "poison": 100,
              "radiant": 50
            }
          },
          "depth": "The Abada's horn purifies any water or toxin it touches, making it a vital cure in Wyrd-taint-infested seas. They tend coral gardens, using their horns to carve channels that direct nutrients and keep reefs immune to decay. Although harvesting the horn is an act of ultimate sacrilege, it can purify a ship's water for a year. A group of poachers is rumored to be tracking an Abada, and local druids are seeking protectors to stop them.",
          "hooks": [
            "A rumor spreads of a Abada spotted near the area.",
            "Adventurers need a component from a Abada to complete their quest."
          ],
          "description": "A shy, antelope-like narwhal with a glowing horn that neutralizes all poisons and purifies water.",
          "heritage": "Derived from Central African unicorn-antelope myths, the Abada originally served as a symbol of purification, explaining how poison was neutralized in remote watering holes. The Wyrd anomaly reacted to the alchemists' and trackers' hope for survival in toxic marshes, materializing this horned antelope to purify waters with its horn."
        },
        {
          "id": "graia_swirl",
          "name": "Graia",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/graia_swirl.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Graia",
          "role": "Graia/Grey Sea",
          "origin": "The Graia is inspired by the Greek Graia or Grey Sea, a featureless mythical expanse sailed by the Argonauts, and Mami Wata's Whirlpool, a portal to the spirit world. In the setting, it is a localized temporal anomaly.",
          "nature": "This thirty-foot circular eddy rotates with mathematical precision, ringed by a halo of displaced foam. The water within the swirl is perfectly colorless and transparent, keeping fallen objects suspended without sinking. The air above remains unnaturally still. Staring into its depths reveals a face forming in the water—the observer's own face, aged and mouthing a silent question.",
          "habitat": "These stable eddies form in the open, desolate stretches of the Iceheart Sea.",
          "combat": "215 HP (structural). Future-Face (special: anyone staring into the swirl for 3 rounds sees their own older face; DC 16 SPI or compelled to answer the whispered question: What will you pay?). Spirit-Portal (special: offerings dropped into the swirl are received by deep-spirits; bargains struck through the swirl are binding — a Neth contract-mage's dream). Grey-Passage (special: ships sailing through the center are transported in time, not space; emerge minutes later having aged weeks, or vice versa; the swirl takes what it takes — GM determines the cost). Still-Surface (passive: air above the eddy is unnaturally still even during storms; creates a zone of calm in 60-ft radius). Suspension (passive: objects that fall in remain suspended at a specific depth, rotating with the water). Vulnerable to none (only major sea-magic can disrupt it).",
          "stats": {
            "strength": 0,
            "agility": 0,
            "constitution": 0,
            "intelligence": 18,
            "spirit": 22,
            "charisma": 18,
            "maxHp": 215,
            "maxMana": 100,
            "maxActionPoints": 0,
            "speed": 0,
            "resistances": {
              "all": 100
            }
          },
          "depth": "The swirl acts as a stable portal to the spirit-realm where binding bargains are struck with deep-spirits, making them highly prized by Neth contract-mages. Ships sailing through its center are transported through time rather than space, emerging aged by weeks or younger, as the swirl takes what it wants. A Neth mage is currently hiring a crew to navigate close to a known swirl to conduct a ritual, offering high rewards for the risk.",
          "hooks": [
            "A rumor spreads of a Graia spotted near the area.",
            "Adventurers need a component from a Graia to complete their quest."
          ],
          "description": "A colorless, mathematical whirlpool that serves as a portal to the spirit-realm and distorts time.",
          "heritage": "Spun from Greek myths of the featureless Grey Sea, the Graia originally represented the psychological dread of getting lost in a vast, endless ocean whiteout without wind or land. The Wyrd anomaly materialized this deep spatial panic of sailors, shaping their fears into a shifting grey whirlpool that drags vessels into abyssal rifts."
        },
        {
          "id": "ichthya_centaur",
          "name": "Ichthyocentaur",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/ichthya_centaur.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ichthyocentaur",
          "role": "Ichthyocentaur",
          "origin": "The Ichthyocentaur is based on the Greek Ichthyocentaur, a wise sea-centaur, and Ogun's Forge-Beneath-Waves from Yoruba tradition. In the setting, they are volcanic artisans who keep the rhythm of the ocean.",
          "nature": "This creature has a muscular human torso, the scaled chest and forelegs of a draft-horse, and a powerful fish tail. It carries a massive iron trident marked by forge hammers and glowing red-hot at the tips. Its horse-section is bay-brown, and spark-scales line its flanks. Its weather-lined face has a salt-bleached beard and eyes that glow like wind-fanned coals.",
          "habitat": "These creatures make their homes around submarine volcanic vents, hot springs, and reef-slopes of the Iceheart Sea.",
          "combat": "200 HP. Wave-Forge (special: forges weapons beneath the waves using submarine volcanic vents; creates tridents/harpoons/hooks that never rust, never break, and always strike true — gifts only, never sold). Trident-Strike (melee, +6 to hit, 2d8+4 piercing + 1d6 fire from the red-hot tips). Rhythm-Keep (passive: listens to ocean wave-patterns; can predict Monolith instability 1 hour before it happens, warning nearby Myrathil). Horse-Uppercut (melee, +5 to hit, 2d6+3 bludgeoning). Vulnerable to poison.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 200,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "fire": 50
            }
          },
          "depth": "Using volcanic vents as hearths, the Ichthyocentaur forge tridents and harpoons that never rust or break, gifting them only to worthy captains. By listening to wave-patterns, they can predict Sundered Monolith instability an hour before it happens, warning the Myrathil. Their agitation is a sure sign of danger. A Myrathil settlement has noticed their local forge-keeper growing restless, and is seeking adventurers to investigate the volcanic vents.",
          "hooks": [
            "A rumor spreads of a Ichthyocentaur spotted near the area.",
            "Adventurers need a component from a Ichthyocentaur to complete their quest."
          ],
          "description": "A scaled sea-centaur with a glowing trident, this volcanic blacksmith warns of Monolith instability.",
          "heritage": "Rooted in Greek sea-centaur myths, the Ichthyocentaur originally represented the hope of finding hidden undersea foundries and forging mystical alloys. The Wyrd anomaly reacted to the shipwrights' and metalworkers' desire to forge storm-resistant hulls, materializing these wise aquatic smiths to teach metallurgical secrets."
        },
        {
          "id": "brine_lantern",
          "name": "Brine Lantern",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/brine_lantern.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Brine Lantern",
          "role": "Lampeia / Sacred Fire of the Sea",
          "origin": "The Brine Lantern is inspired by the Greek Lampeia, mysterious ocean-lights guiding or misleading sailors, and the Yoruba Osu, ancestor-lights representing the souls of the dead. In the setting, they are guiding spirits.",
          "nature": "A floating golden orb about the size of a human head, it hovers six inches above the water and rotates slowly, dropping glowing gold motes. The sphere is composed of compressed liquid gold, and viewing it closely reveals dozens of tiny, smiling, translucent faces pressed against the inner surface. Its warmth provides comfort in the freezing night.",
          "habitat": "These spirits hover near the coastal cliffs, harbor mouths, and open waters of the Iceheart Sea.",
          "combat": "45 HP. Safe-Harbor-Glow (special: appears over safe anchorages during worst storms; following it always leads to safety — the faces inside are calm and smiling). False-Lantern (special: Wyrd-corrupted Brine Lanterns look identical but lead ships onto rocks; the faces inside are screaming and terrified — DC 13 INT to distinguish with a silver mirror). Golden-Trail (passive: leaves a luminous trail across the water that persists for 1 hour, marking a safe route). Soul-Light (passive: light is warm and comforting; creatures within 20 ft gain +2 to SPI saves). Vulnerable to cold.",
          "stats": {
            "strength": 4,
            "agility": 16,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 45,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 0,
            "resistances": {
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "True Brine Lanterns are the souls of sailors who died heroically, appearing during storms to guide lost ships to safe coves. However, Wyrd-corrupted false lanterns exist, leading ships onto rocks; these can be identified by the screaming, terrified faces within, visible through silver mirrors. A local captain is planning a voyage through a storm-swept passage and is seeking adventurers to guide his ship using a true lantern.",
          "hooks": [
            "A rumor spreads of a Brine Lantern spotted near the area.",
            "Adventurers need a component from a Brine Lantern to complete their quest."
          ],
          "description": "A floating orb of warm gold light containing smiling faces, this spirit guides ships to safety during storms.",
          "heritage": "Spun from Greek tales of mysterious ocean-lights, the Brine Lantern originally served to explain the bioluminescent glow of the sea and warn against following false lights. The Wyrd anomaly reacted to the sailors' dread of losing direction during dark nights, materializing these glowing lanterns to guide ships or lead them onto jagged reefs."
        }
      ]
    },
    {
      "id": "cragjaw-peaks",
      "name": "Cragjaw Peaks",
      "folklore": "Japanese Yokai + Incan/Andean",
      "creatures": [
        {
          "id": "gaki",
          "name": "Gaki",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/gaki.png",
          "illustrationCaption": "A Gaki ghoul crouching on a coal ledge, its glowing gold veins illuminating the darkness",
          "role": "The coal-scavenger mountain ghoul",
          "origin": "The Gaki is a creature of the earth and the greed, born from the fusion of Incan and Japanese mythology, the spirits of the hungry dead who were cursed to roam the earth in search of sustenance. In the Cragjaw Peaks, where the mines are deep and the gold is plentiful, the Gakis are the spirits of the miners who died in the darkness, their greed turning them into something that is both human and monster. The Wyrd's corruption did not change their nature, but it did make them more terrible, for the creature now sees all who enter its territory as prey, and it will attack any who come near its hoard. The miners of the Cragjaw Peaks know the signs of a Gaki's presence—a mine that is too quiet, and the smell of sulfur in the air.",
          "nature": "A coal-black bipedal humanoid sprite with a third arm growing from its chest and skin patterned by glowing yellow veins of mineral gold. It has long, pick-like stone claws and a stone jaw for crushing ore, and it haunts the dark mines, aggressively hunting miners to steal their jewelry, coins, and mineral-rich blood. The creature is a thing of terrible beauty, and its glowing veins are a sign of the gold that flows through its body. The Gaki is a creature of hunger, and it will eat anything that contains gold, including the flesh of its prey.",
          "habitat": "The Gaki inhabits the deep mine shafts, sulfur caverns, and volcanic veins of the Cragjaw Peaks, particularly in the Gold-Cleft Mine where the veins are thickest and the miners are most numerous. It is most active during the night, when the mines are dark and the workers are few, and during the volcanic eruptions, when the sulfur is thick and the air is poison. The Gaki's lair is always near the richest vein, and it is said to be a nest of gold and bones, the remains of a thousand years of mining.",
          "combat": "270 HP. Gold Drain (melee, +6 to hit, DC 14 SPI save or target loses 1 point of strength for 2 rounds; drains more if target carries gold). Pick Claw (2d8+5 slashing, ignores 2 points of physical defense). Gold Scream (AoE, DC 14 SPI save or targets are stunned for 1 round by resonant vibrations).",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 16,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 6,
            "maxHp": 270,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "physical": 50,
              "ember": 50
            }
          },
          "depth": "Territorial and cruel miners' nightmares. Miners mark boundaries with runic warding stakes to prevent them from entering active mine layers. The Gaki's gold veins are a mystery to alchemists, for they are made of a gold that is purer than any known metal, and some believe that the creature's body is a natural smelter, a living furnace that turns ore into gold.",
          "hooks": [
            "A Gaki has nested in a newly discovered vein of gold, killing three miners. Clear the shaft before the vein can be worked.",
            "An alchemist believes the gold-veined hide of a Gaki can be processed into a potion of mineral detection. Hunt one and deliver its hide."
          ],
          "heritage": "Rooted in Shinto and Incan beliefs of the hungry dead, the Gaki originally served as a stern warning to miners against greed and hoarding gold in the dark. The Wyrd anomaly reacted directly to the miners' specific encounters in the Gold-Cleft Mine, materializing these coal-scavenging ghouls to stalk geothermal shafts and guard their mineral hoards."
        },
        {
          "id": "kamaitachi",
          "name": "Kamaitachi",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/kamaitachi.png",
          "illustrationCaption": "A Kamaitachi weasel riding a blast of icy wind, its blade-tail slicing the air",
          "role": "The blade-tailed wind weasel",
          "origin": "The Kamaitachi is a creature of the wind and the blade, born from the Japanese legends of the sickle-cut wind weasel. In the Cragjaw Peaks, where the wind is strong and the mountains are tall, the Kamaitachis are the spirits of the storm, creatures that have been twisted by the Wyrd into something that is both beautiful and deadly. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as prey, and it will attack any who come near its nest. The miners of the Cragjaw Peaks know the signs of a Kamaitachi's presence—a wind that cuts like a knife, and the sound of weasel-like laughter in the air.",
          "nature": "A sleek, long-bodied weasel about three feet long, with fur that mimics the grey color of cold slate. Its front claws and long tail are flat, sharp, copper-like blades, and it moves with blinding speed, riding mountain drafts and pipeline updrafts, slicing travelers before they even notice its presence. The creature is a thing of terrible grace, and its blades are sharper than any known metal. The Kamaitachi is a creature of the wind, and it is most active during the stormy season, when the winds are strong and the air is charged with electricity.",
          "habitat": "The Kamaitachi inhabits the vertical mines, pipeline rifts, and high girders of the Cragjaw Peaks, particularly in the Wind-Cleft Pass where the drafts are strongest and the updrafts are most reliable. It is most active during the stormy season, when the winds are strong and the air is charged with electricity, and during the spring, when the snow melts and the air is warm. The Kamaitachi's nest is always near a source of wind, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "145 HP. Sickle Cut (melee, 2d6+4 physical damage). Wind Gale (creates a blast of mountain wind, DC 13 AGI save or knocked prone and pushed 15 ft). Blade Dance (moves up to 20 ft between attacks without opportunity attacks). Vulnerable to ember.",
          "stats": {
            "strength": 8,
            "agility": 18,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 145,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 45,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "They hunt birds and smaller rodents along vertical shafts. Miners listen for their sharp whistling calls, which signal high winds and impending cuts. The Kamaitachi's copper blades are a mystery to alchemists, for they are made of a copper that is harder than any known metal, and some believe that the creature's blades are a natural alloy, a living forge that turns copper into steel.",
          "hooks": [
            "A Kamaitachi has nested inside a pipeline ventilation fan, slicing anyone trying to fix it. Drive it out safely.",
            "A wealthy merchant wants to capture a Kamaitachi alive to train as a high-speed courier or guard beast."
          ],
          "heritage": "Spun from sickle-cut wind weasel legends, the Kamaitachi originally served to explain sudden, unexplained cuts that travelers suffered when crossing narrow mountain passes during windstorms. The Wyrd anomaly captured the fear of the cutting wind-girders and pipeline rifts, materializing this blade-tailed weasel to slice trespassers with absolute precision."
        },
        {
          "id": "kcoa",
          "name": "Kcoa",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/kcoa.png",
          "illustrationCaption": "A Kcoa storm-cat spirit floating near a storm cloud, its eyes crackling with lightning",
          "role": "The storm-cat spirit",
          "origin": "The Kcoa is a creature of the storm and the sky, born from the Incan mythology of the cat-like weather spirits that dwell in the clouds. In the Cragjaw Peaks, where the mountains are tall and the storms are fierce, the Kcoas are the spirits of the weather, creatures that have been twisted by the Wyrd into something that is both beautiful and dangerous. The Wyrd's corruption did not change their nature, but it did make them more unpredictable, for the creature now sees all who enter its territory as a threat, and it will attack any who come near its cloud. The mountain guides of the Cragjaw Peaks know the signs of a Kcoa's presence—a storm that appears from nowhere, and the sound of a cat's scream in the thunder.",
          "nature": "A large wildcat-like spirit with wings made of grey storm clouds and rain, its fur dark grey and constantly dripping water. Its eyes flash with bright yellow lightning, and it can release hail from its ears when enraged. The creature is a thing of terrible beauty, and its cloud-wings are a sign of the storm that follows it. The Kcoa is a creature of the sky, and it is most active during the stormy season, when the clouds are thick and the air is charged with electricity.",
          "habitat": "The Kcoa inhabits the highest peaks, storm clouds, and volcanic vents of the Cragjaw Peaks, particularly in the Storm-Crown Peak where the clouds are thickest and the lightning is most frequent. It is most active during the stormy season, when the clouds are thick and the air is charged with electricity, and during the volcanic eruptions, when the ash is thick and the air is poison. The Kcoa's nest is always in the clouds, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "170 HP. Lightning Scratch (melee, +5 to hit, 1d8+3 physical + 1d8 storm). Hail Rain (ranged AoE, 15-ft radius, DC 13 AGI save or 2d6 rime/physical damage). Storm Flight (immune to fall damage, can hover). Vulnerable to ember.",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 170,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "storm": 100,
              "rime": 50
            }
          },
          "depth": "Weather spirits that represent the volatile climate of the peaks. Mountain guides make food offerings to Kcoa spirits before crossing high passes to ensure clear weather. The Kcoa's cloud-wings are a mystery to scholars, for they are made of a cloud that does not exist in any known catalog, and some believe that the creature's wings are a natural storm, a living cloud that follows the creature wherever it goes.",
          "hooks": [
            "A sudden, unnatural hail storm has locked down a mining camp. The miners believe a Kcoa has been angered by their deep excavations.",
            "A shaman needs a cloud-feather from a Kcoa to brew a potion that grants lightning immunity."
          ],
          "heritage": "Derived from Incan weather-cat myths, the Kcoa was a personification of the sudden, devastating lightning storms that struck the high peaks. The Wyrd anomaly acted upon the mountain guides' fear of sudden blizzards and geothermal vents, materializing these storm-cats to summon lightning and toxic ash clouds near Storm-Crown Peak."
        },
        {
          "id": "tengu_scout",
          "name": "Tengu Scout",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/tengu_scout.png",
          "illustrationCaption": "A Tengu Scout perched on a pipeline girder, its wings folded and beak sharp",
          "role": "The peak-dwelling scout",
          "origin": "The Tengu Scout is a creature of the mountain and the wind, born from the Japanese legends of the winged mountain protectors. In the Cragjaw Peaks, where the pipelines are tall and the bridges are narrow, the Tengu Scouts are the guardians of the heights, creatures that have been twisted by the Wyrd into something that is both protective and territorial. The Wyrd's corruption did not change their nature, but it did make them more suspicious, for the creature now sees all who enter its territory as a threat, and it will attack any who come near its nest. The Fexric engineers of the Cragjaw Peaks know the signs of a Tengu's presence—a wind that blows from nowhere, and the sound of a bird's cry in the air.",
          "nature": "A small, raven-winged humanoid sprite with a long bird-beak and glossy eyes like mountain obsidian. It is highly agile, leaping between pipelines and girders, carrying a wind-copper staff that hums with the energy of the mountain. It is defensive and gathers copper and shiny minerals, and it will attack any who come near its nest. The Tengu Scout is a creature of the wind, and it is most active during the stormy season, when the winds are strong and the air is charged with electricity.",
          "habitat": "The Tengu Scout inhabits the pipeline scaffolds, high mountain bridges, and mine entries of the Cragjaw Peaks, particularly in the Fexric Pipeline where the scaffolds are tallest and the bridges are narrowest. It is most active during the stormy season, when the winds are strong and the air is charged with electricity, and during the spring, when the snow melts and the air is warm. The Tengu's nest is always near a source of wind, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "130 HP. Wind-Copper strike (melee, 1d8+4 physical, plus DC 12 AGI save or slowed by copper resonance). Gale Jump (as a reaction, can jump 20 ft to avoid an attack, DC 12 AGI to hit). Flight (can fly up to 45 ft). Vulnerable to rime.",
          "stats": {
            "strength": 8,
            "agility": 18,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "Highly defensive scouts. They keep watch over pipeline corridors, alerting mine holds of any invaders by letting out a sharp, bird-like cry. The Tengu's wind-copper staff is a mystery to alchemists, for it is made of a copper that is harder than any known metal, and some believe that the creature's staff is a natural alloy, a living forge that turns copper into steel.",
          "hooks": [
            "A Tengu Scout has blockaded a pipeline bridge, claiming it is private peak territory. The party must bargain with it using shiny copper ores.",
            "A Fexric engineer wants to retrieve the obsidian eyes of a Tengu Scout, believing they can be used to craft lenses of wind-sight."
          ],
          "heritage": "Born from Japanese winged mountain-protector legends, the Tengu Scout myth was created to enforce respect for territorial borders in the high passes. The Wyrd anomaly reacted to the Fexric engineers' fear of losing cargo along the pipeline scaffolds, materializing these winged sentinels to aggressively guard the bridges."
        },
        {
          "id": "yuki_onna",
          "name": "Yuki-Onna",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/yuki_onna.png",
          "illustrationCaption": "A pale Yuki-Onna frost spirit floating in a snowstorm, her white kimono blending into the snow",
          "role": "The frost-breath specter",
          "origin": "The Yuki-Onna is a creature of the snow and the cold, born from the Japanese legends of the snow woman who appears in blizzards to freeze travelers. In the Cragjaw Peaks, where the snow is deep and the wind is fierce, the Yuki-Onnas are the spirits of the winter, creatures that have been twisted by the Wyrd into something that is both beautiful and deadly. The Wyrd's corruption did not change their nature, but it did make them more cruel, for the creature now sees all who enter its territory as prey, and it will freeze any who come near its storm. The mountain guides of the Cragjaw Peaks know the signs of a Yuki-Onna's presence—a snowstorm that appears from nowhere, and the sound of a woman's voice in the wind.",
          "nature": "A beautiful, ethereal woman with pale blue skin, long black hair, and eyes like frozen stars. She wears a long white kimono that leaves no footprints in the snow, and she floats slightly above the drifts, accompanied by a freezing wind. The creature is a thing of terrible beauty, and her frost-breath is cold enough to freeze a man in seconds. The Yuki-Onna is a creature of the snow, and she is most active during the winter, when the snow is deepest and the wind is strongest.",
          "habitat": "The Yuki-Onna inhabits the snowy peaks, glacier cols, and high passes of the Cragjaw Peaks, particularly in the Frost-Crown Pass where the snow is deepest and the wind is strongest. She is most active during the winter, when the snow is deepest and the wind is strongest, and during the spring, when the snow melts and the air is warm. The Yuki-Onna's lair is always in the snow, and it is said to be a place of terrible beauty, filled with the frozen bodies of her prey.",
          "combat": "200 HP. Frost Breath (15-ft cone, DC 14 CON save or take 2d8 rime damage and be frozen/restrained for 1 round). Chilling Touch (+6 to hit, 2d6 rime damage + drains 5 mana). Snow Cloak (gains full concealment inside snowstorms). Vulnerable to ember.",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 16,
            "maxHp": 200,
            "maxMana": 60,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "rime": 100
            }
          },
          "depth": "Volatile winter spirits. They represent the beautiful but deadly nature of high mountain blizzards. They will sometimes spare travelers who display great courage or tell a beautiful story. The Yuki-Onna's frost-breath is a mystery to scholars, for it is colder than any known substance, and some believe that her breath is made of the same material as the stars, a living cold that freezes the soul as well as the body.",
          "hooks": [
            "A high mountain pass is permanently frozen by a Yuki-Onna, blocking the trade route. Find a way to pacify her or defeat her.",
            "A hunter claims a Yuki-Onna spared his life in exchange for a promise he has now broken, and she is hunting him."
          ],
          "heritage": "Spun from snow woman legends, the Yuki-Onna originally served as a cautionary tale warning travelers against crossing alpine passes during whiteouts, explaining how people froze to death. The Wyrd anomaly crystallized the mountain guides' survival panic during freezing blizzards, materializing this frost-breath specter to freeze trespassers."
        },
        {
          "id": "kappa_crag",
          "name": "Kappa",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/kappa_crag.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kappa",
          "role": "Kappa",
          "origin": "The Kappa traces its lineage to the ancient water-sprites of old folklore, which were said to carry a shallow bowl of life-giving water upon their crowns and possessed an eccentric obsession with cucumbers, politeness, and the extraction of mythical soul-organs. In the frozen peaks of this land, these roots intermingle with tales of the Yacuruna, the seductive and powerful water-people who dwell in the depths of rivers and lakes, occasionally drawing mortal mates down into their sub-aquatic realms to never return. Here, they have become geothermal sentinels, bound to the steaming waters that keep the freezing wilderness at bay.",
          "nature": "Standing roughly three feet tall, this humanoid creature possesses a rough, dark shell of volcanic basalt pitted with mineral deposits, suggesting a form birthed from both stone and water. Its crown bears a shallow depression filled with glowing blue water and ringed by tough mountain reeds, while its deceptively long, webbed limbs echo the anatomy of a frog. Its beaked, turtle-like face features round, obsidian-black eyes that blink with slow deliberation, and its mouth curves downward in a perpetual, judgmental frown as it clutches a pouch of smooth geothermal river-stones gathered from the holdfasts.",
          "habitat": "These stone-shelled sprites are found exclusively within the geothermal pools and steamy thermal corridors of the Cragjaw Peaks, where they cluster around volcanic vents.",
          "combat": "130 HP. Bow-Debt (passive: if you bow to a Kappa, it MUST bow back, spilling the water from its head-bowl and losing all power until it refills from a geothermal vent; exploit by bowing then sprinting past). Geothermal-Guard (passive: guards geothermal pools that heat Frostmaw Holdfast; a pool it guards never freezes and never runs dry). Beak-Snap (melee, +5 to hit, 1d6+3 piercing + DC 13 AGI or grappled, pulled into pool). River-Stone-Hurl (ranged 30 ft, +5 to hit, 1d6+2 bludgeoning). Cucumber-Lure (special: can be bribed with cucumber; any cucumber offering DC 13 CHA to persuade it to move aside). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "lightning": 50
            }
          },
          "depth": "Bound by an absolute code of etiquette known as the bow-debt, the Kappa is compulsively polite; if a traveler bows deeply to it, the creature is forced to return the gesture, spilling its head-water and temporarily losing its power, a quirk Fexric engineers frequently exploit to slip past them along pipeline corridors. They guard the hot thermal pools of Frostmaw Holdfast with fierce devotion, ensuring the waters never freeze or run dry, which prompts the Kethrin guilds to leave costly offerings of imported cucumbers at pool-side shrines to appease them. Lately, rumors of a rogue Kappa spotted near key geothermal conduits have spread, prompting guild-masters to hire daring adventurers to retrieve rare components from the creature to secure the holdfast's heating systems.",
          "hooks": [
            "A rumor spreads of a Kappa spotted near the area.",
            "Adventurers need a component from a Kappa to complete their quest."
          ],
          "description": "A stone-shelled, turtle-like humanoid that guards geothermal pools, carrying a bowl of glowing water on its head and bound by an unbreakable code of politeness.",
          "heritage": "Derived from water-sprite myths carrying life-giving water in their crowns, the Kappa was a warning to keep children from playing near deep, slippery geothermal pools. The Wyrd anomaly reacted to the travelers' encounters in volcanic thermal springs, materializing this turtle-shelled sprite to drag victims beneath the boiling waters."
        },
        {
          "id": "kitsune",
          "name": "Kitsune",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/kitsune.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kitsune",
          "role": "Kitsune",
          "origin": "The Kitsune draws its lineage from the ancient shape-shifting fox-spirits of folklore, creatures of immense intellect that grow additional tails as they age and hold sway over illusions and human possession. In this mountain realm, their myth is laced with the legend of the Chullachaqui, a deceptive forest spirit that assumes the likeness of a familiar companion to lure unsuspecting travelers into the trackless wilds, betrayed only by a single deformed foot. They are guardians and tricksters in equal measure, haunting the high Spans and mining shafts of the peaks.",
          "nature": "The creature appears as a magnificent fox of mountain-snow white, its fur shot through with veins of mineral-blue and fanning out into multiple tails that glow with a faint, phosphorescent light. Its paws leave an erratic trail that alternates between vulpine prints, human steps, and the sharp hooves of a goat, though one hind paw always faces backward in a strange anatomical distortion. Its face possesses a heart-breaking beauty, with vast, crystalline eyes that reflect a viewer's deepest desires and an expression of infinite patience, though its human shape-shifted forms always carry the telltale backward foot.",
          "habitat": "They roam the high elevations and abandoned mining shafts of the Cragjaw Peaks, making their dens near the ancient stone bridges.",
          "combat": "220 HP. Nine-Tail-Illusions (passive: each of its nine tails contains a stored illusion; it can deploy one illusion per round — a phantom enemy, a false path, a clone of an ally). Fox-Fire (AoE 20 ft, +5 to hit, 1d8 fire + DC 13 SPI or charmed for 1 round). Shape-Shift (1 AP: takes the form of any person or animal; +6 to Deception checks). Chullachaqui-Tell (passive: one hind paw always faces backward — a tell that betrays its true nature). Illusion-Wall (special: can create a convincing illusionary wall that lasts 1 hour; creatures must DC 15 INT to disbelieve). Vulnerable to iron.",
          "stats": {
            "strength": 10,
            "agility": 18,
            "constitution": 12,
            "intelligence": 16,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 220,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "Because of its backward-facing hind paw, any prints it leaves in the snow point in the opposite direction of its actual travel. It leads trackers into dead-ends. It is obsessed with riddles of direction and space, and will let travelers pass if they walk backward while speaking to it.",
          "hooks": [
            "A tracker has been walking in circles following tracks that point the wrong way.",
            "A Kitsune blocks a pass, demanding a riddle of direction."
          ],
          "description": "A multi-tailed white fox of heart-breaking beauty that conjures deadly illusions and takes the shape of familiar faces to lead travelers astray.",
          "heritage": "Rooted in Shinto shape-shifting fox legends, the Kitsune was a forest myth explaining how travelers were led astray by illusions in deep pine groves. The Wyrd anomaly reacted to the logging of high alpine slopes for steam-engine boilers, materializing these multi-tailed foxes to guard hidden paths and test travelers' intellect."
        },
        {
          "id": "tsuchinoko",
          "name": "Tsuchinoko",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/tsuchinoko.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Tsuchinoko",
          "role": "Tsuchinoko",
          "origin": "The Tsuchinoko is born from the convergence of the legendary short, fat, jumping serpents of eastern folklore and the Amaru, the double-headed, winged dragon-serpents of Incan cosmology associated with deep waters and underground wisdom. In the high frozen mountains, this combination manifests as a stout, winged serpent that possesses a slurred, booming human voice and an insatiable craving for strong alcohol.",
          "nature": "Roughly five feet long but nearly two feet thick at its center, this stout serpent tapers sharply at both ends, covered in scales of glacier-ice blue with warm, copper-streaked belly-scales. A pair of small, bat-like wings sprouts from behind its neckless head, buzzing with the speed of a hummingbird's wings to lift its heavy body into the air. Its face is dominated by an absurdly wide, frog-like mouth with large cheeks for storing food or stolen liquor, and its half-lidded golden eyes look out with lazy amusement. It has a forked tongue like a snake.",
          "habitat": "This creature makes its home on the narrowest knife-edge ridges and high cliffs of the Cragjaw Peaks.",
          "combat": "310 HP. Club-Smash (melee, +7 to hit, 2d8+5 bludgeoning + DC 15 CON or stunned 1 round). Aurora-Club (passive: club is made of compressed aurora-light; on critical hits, releases a flash that deals 2d8 radiant to all creatures in 20-ft radius). Blizzard-Rage (passive: gains +2 STR for each round of combat; the longer the fight, the stronger it gets). Iron-Maul (melee, +6 to hit, 2d6+4 bludgeoning, ignores 4 points of physical armor). Mountain-Toss (ranged 40 ft, +6 to hit, 3d6+5 bludgeoning — throws boulders). Vulnerable to fire.",
          "stats": {
            "strength": 20,
            "agility": 12,
            "constitution": 18,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 310,
            "maxMana": 20,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "physical": 50
            }
          },
          "depth": "A fat snake that rolls like a hoop by biting its own tail. It is a severe alcoholic: it can smell liquor from miles away and will bypass combat entirely to drink any alcohol the players carry, falling asleep and becoming a harmless, squishy pillow.",
          "hooks": [
            "A tavern's wine cellar is raided by a rolling snake.",
            "A party must cross a chasm blocked by a Tsuchinoko by using their finest dwarven ale as a bribe."
          ],
          "description": "A fat, winged serpent of glacier-blue that leaps across high chasms, speaks in a slurred voice, and trades mountain secrets for strong liquor.",
          "heritage": "Derived from jumping serpent legends and Incan Amaru weather dragons, the Tsuchinoko originally served to warn mountain travelers against hidden crevices where poisonous reptiles nested. The Wyrd anomaly consolidated the fear of landslides and volcanic fumes, materializing this double-headed snake to strike from rocky ledges."
        },
        {
          "id": "nopperabo",
          "name": "Nopperabo",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/nopperabo.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nopperabo",
          "role": "NopperabÅ",
          "origin": "The Nopperabo represents a chilling synthesis of the faceless spirits of Yokai lore, which terrify travelers by turning to reveal blank, featureless visages, and the Pishtaco, the pale-skinned bogeyman of Andean legend who drains the fat from human bodies. In the high bridges of this cold world, they embody a quiet, transactional horror, rendering the flesh of travelers into a commodity to preserve the setting's ancient structures.",
          "nature": "Appearing from behind as a normal traveler wrapped in a pale, hooded cloak, the creature reveals a smooth, featureless oval of pale skin with no eyes, nose, or mouth when it turns to face its prey. From beneath its heavy sleeves, it extends long, surgeon-precise fingers tipped with thin, hollow needles designed for extracting body fat without leaving a visible wound. A calm, measured, and chillingly reasonable voice projects directly from the flat plane of its blank face.",
          "habitat": "These faceless figures haunt the narrowest corridors and drafty Spans of the Cragjaw Peaks, standing like silent sentinels in the wind.",
          "combat": "",
          "stats": {
            "strength": 10,
            "agility": 10,
            "constitution": 10,
            "intelligence": 10,
            "spirit": 10,
            "charisma": 10,
            "maxHp": 75,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {}
          },
          "depth": "Appears as an NPC players know. When it turns around, its face slides off like wet clay. It steals the faces of sleeping travelers; a player whose face is stolen cannot speak or cast verbal spells, and must track down the Nopperabo to retrieve their face.",
          "hooks": [
            "A merchant was found with a completely smooth, faceless head, unable to speak.",
            "A Nopperabo is collecting faces in a mountain tavern, masquerading as the innkeeper."
          ],
          "description": "A faceless, cloaked figure that stands on mountain bridges, extracting body fat with needle-like fingers to seal the cracks in the bone Spans.",
          "heritage": "Born from faceless Yokai myths, the Nopperabo was a chilling campfire tale explaining the disorienting fear of meeting strangers in high windouts. The Wyrd anomaly reacted to the travelers' spatial anxiety on the drafty Spans, materializing these faceless figures to erase their features and mimic silent stone sentinels."
        },
        {
          "id": "supayoni",
          "name": "Supayoni",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/supayoni.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Supayoni",
          "role": "Oni",
          "origin": "The Supayoni is born of the ancient ogre-demons of Yokai lore, who carry iron clubs to bring ruin and disaster, merged with Supay, the Incan lord of the underworld who rules the deep earth and the mineral veins beneath the mountains. They are massive, imposing figures of the peaks, representing both the violent fury of the elements and a stern, subterranean justice.",
          "nature": "Standing twelve feet tall, this massively muscled humanoid possesses skin the color of deep glacier-ice and two sharp, crystalline horns that sweep upward from its temples, emitting a low, subsonic hum of terror when it prepares to strike. It carries a heavy iron club, or kanabo, made of petrified ice harder than steel, and its broad, feral face features a fanged grin, crystalline teeth, and two glowing red eyes, supplemented by a third eye on its forehead that pierces absolute darkness.",
          "habitat": "They claim the deep, dark mine-shafts and ancient volcanic chambers beneath the Cragjaw Peaks as their personal domains.",
          "combat": "",
          "stats": {
            "strength": 10,
            "agility": 10,
            "constitution": 10,
            "intelligence": 10,
            "spirit": 10,
            "charisma": 10,
            "maxHp": 220,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {}
          },
          "depth": "Acts as an arbiter in deep mines. It will allow miners and adventurers to harvest ore, but it demands an 'ore-tax' (10% of all gathered metal). If anyone tries to smuggle ore past it, its third eye glows and it uses its frozen club to shatter their metal armor into ice.",
          "hooks": [
            "Miners are trapped in a shaft because they tried to smuggle gold past a Supayoni.",
            "An ice-ogre demands a tribute of copper ore to allow passage through a mine."
          ],
          "description": "A twelve-foot-tall ogre of blue glacier-ice that rules the deep mines, wielding a club of petrified ice and demanding tributes of raw ore.",
          "heritage": "Derived from Japanese Oni legends and Incan underworld spirits, the Supayoni represented the threat of volcanic eruptions and mining collapses. The Wyrd anomaly acted upon the miners' dread of geothermal foundries collapsing, materializing these club-wielding, iron-clad ogres to bring devastation to the deep shafts."
        },
        {
          "id": "jorogumo_span",
          "name": "Jorōgumo",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/jorogumo_span.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Jorōgumo",
          "role": "JorÅgumo",
          "origin": "The Jorōgumo represents the blending of the binding bride spider-spirits of folklore, who lure unsuspecting victims with their beauty, and Urcaguary, the Incan guardian of metals and jewels who watches over the earth's hidden treasures. This fusion yields a creature of deceptive grace and metallic corruption, guarding the richest veins in the mountains with webs of precious metal.",
          "nature": "From the front, the creature appears as a beautiful woman in a shimmering bridal gown of semi-transparent silk standing on the Spans, but from behind, she reveals the massive, metallic-chitin abdomen of a spider anchored by thick golden cables. Her gown is actually a sensory web containing trace amounts of gold and silver, and her exquisite human face conceals compound eyes and rows of needle-sharp spider fangs that are exposed only when she smiles.",
          "habitat": "She makes her home on the narrowest Ancestor-Spans and rich mineral chasms of the Cragjaw Peaks.",
          "combat": "650 HP. Web-Bridge (passive: she IS the bridge you are crossing; the Ancestor-Span is woven from her own body — the party walks on her). Spider-Silk-Cable (passive: cables contain gold and silver drawn from the mountain's veins; cutting the silk triggers DC 16 STR or the party falls into the chasm). Gold-Silk-Gown (passive: gown woven from gold-silk; +8 to all social checks). Silk-Corruption (special: cutting her silk corrodes tools with metallic poison — DC 14 CON or poisoned for 1d4 rounds). Web-Trap (1 AP: re-weaves a section into sticky web; DC 15 AGI or restrained). Needle-Fang (melee, +6 to hit, 2d6+4 piercing + 2d6 poison). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 18,
            "constitution": 14,
            "intelligence": 16,
            "spirit": 14,
            "charisma": 18,
            "maxHp": 650,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "poison": 100
            }
          },
          "depth": "She lures travelers by posing as a stranded maiden on the bridges, only to bind them in metallic-silk cables and hang them beneath the spans to drain their mineral-rich blood over several weeks. Because her webs are blessed by Urcaguary, they are laced with a corrosive poison that ruins excavation tools, forcing Fexric engineers to offer her precious gems in exchange for passage or access to the veins. Adventurers must tread carefully when searching for missing travelers, often facing the choice of fighting the creature or bargaining with precious jewels to free her captives.",
          "hooks": [
            "A rumor spreads of a Jorōgumo spotted near the area.",
            "Adventurers need a component from a Jorōgumo to complete their quest."
          ],
          "description": "A spider-woman clad in webs of gold and silver who lures travelers on the mountain bridges to drain their mineral-rich blood.",
          "heritage": "Spun from spider-bride legends, the Jorōgumo was a warning myth to warn young miners against being lured into remote mineral chasms by beautiful illusions. The Wyrd anomaly reacted to the miners' isolation and the deep mountain drafts, materializing this spider-woman to spin webs across the Ancestor-Spans and trap her prey."
        },
        {
          "id": "kodama",
          "name": "Kodama",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/kodama.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kodama",
          "role": "Kodama",
          "origin": "The Kodama is born of the ancient tree-spirits who dwell in old-growth forests and speak in repeating whispers, combined with the Apus, the sacred mountain-spirits of Andean tradition that watch over valleys and receive offerings from those below. In the high peaks, they have become the animate voice of the mountain itself, bound to the stone and snow.",
          "nature": "Standing only a foot tall, this small humanoid figure appears sculpted from the mountain itself, with skin of grey granite, hair of white snow, and eyes of sparkling quartz. It leaves no footprints when it traverses the snowy crags and communicates solely by bouncing sound off the stone walls with impossible precision. Its face is a simple, child-like carving with quartz-bead eyes and an open, O-shaped mouth, conveying a warm but ancient sadness.",
          "habitat": "They dwell on the high wind-swept slopes and rocky ledges of the Cragjaw Peaks, where they blend seamlessly into the stone.",
          "combat": "130 HP. Echo-Voice (passive: repeats everything it hears with exactly a 7-second delay, creating a layered chorus across the peaks). Communication-Network (special: the Groven use clusters of Kodamaes as a communication-system — shout a message toward a cluster, it bounces the sound across entire valleys; 100% reliable, no interception possible). Peak-Warden (passive: bound to a specific mountain-Apu; when the mountain is damaged, the Kodama wails — DC 14 SPI or all who hear it are driven to tears for 1 round). Quartz-Eyes (passive: sparkles in even dimmest light, revealing its position). Vulnerable to physical damage (if hit, it dissolves into a puff of snow and reappears 10 ft away after 1 round).",
          "stats": {
            "strength": 4,
            "agility": 18,
            "constitution": 8,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "psychic": 100,
              "cold": 50
            }
          },
          "depth": "These spirits repeat everything they hear after a delay of exactly one mountain-breath, creating a layered chorus that the Groven use as a natural communication network to bounce messages across wide valleys. They are deeply bound to the spirits of the peaks, wailing in mournful tones that drive listeners to tears whenever mining or Wyrd-corruption damages the stone. Engineers monitor their cries as a warning system for structural collapse, and adventurers are often sent to investigate when a Kodama's weeping signals a disaster deep in the mountains.",
          "hooks": [
            "A rumor spreads of a Kodama spotted near the area.",
            "Adventurers need a component from a Kodama to complete their quest."
          ],
          "description": "A tiny spirit of stone and snow that echoes the voices of travelers and wails in sorrow when the mountain is damaged.",
          "heritage": "Rooted in Shinto tree-spirit and Incan Apu mountain-spirit beliefs, the Kodama originally served as a projection of human guilt over environmental damage, specifically the scarring geothermal strip-mining, deep gold excavations, and Fexric pipeline construction. When the Wyrd anomaly seeped into Cragjaw Peaks, it materialized around the local rumors spreading through Apus and crystallized the loggers' and travelers' shame of environmental destruction and the fear of woodland isolation, spinning these specific regional crises and tales into a physical, living creature."
        },
        {
          "id": "nurikabe_drift",
          "name": "Nurikabe",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/nurikabe_drift.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nurikabe",
          "role": "Nurikabe",
          "origin": "The Nurikabe combines the wall-spirits of Yokai folklore, which block paths with insurmountable, invisible barriers, and the ancient Tiwanaku stone-spirits said to rearrange massive monoliths under the cover of night. In the cold mountain passes, they manifest as living rock faces that shift and slide, altering the geography of the heights to baffle travelers.",
          "nature": "Appearing as a solid section of striated, snow-dusted cliff-face that has detached and positioned itself across a path, this creature matches the local geology perfectly. Only a tiny, quarter-inch gap between the bottom of the rock and the frozen ground betrays its floating, living nature, and it moves with slow, geological silence. It lacks a face, but a deep, slow breathing resonates from the cold stone if a traveler presses an ear against its surface.",
          "habitat": "They reside in the narrow mountain passes, paths, and canyon floors of the Cragjaw Peaks.",
          "combat": "220 HP. Living-Wall (passive: looks identical to surrounding rock — grey, striated, snow-dusted; only its edges give it away: a faint gap where it meets the ground). Path-Blocker (special: cannot be climbed (the top extends as you climb), cannot be gone around (it extends sideways), cannot be broken (it regenerates instantly); the only way past is a copper-tipped staff tapped at the base). Night-Architect (passive: rearranges mountain geography overnight; paths clear yesterday are blocked today, dead-ends open into new corridors). Breathing-Stone (passive: pressing ear to surface reveals breathing — deep, slow, ancient). Vulnerable to copper (copper-tipped staff disrupts its magnetic anchoring, causing it to step aside for 1 minute).",
          "stats": {
            "strength": 18,
            "agility": 8,
            "constitution": 20,
            "intelligence": 6,
            "spirit": 8,
            "charisma": 6,
            "maxHp": 220,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 0,
            "resistances": {
              "physical": 100,
              "cold": 50
            }
          },
          "depth": "These wall-spirits block mountain paths overnight, extending upwards and outwards if travelers attempt to climb or bypass them, leaving them completely impassable unless the base is tapped with a copper-tipped staff to disrupt their magnetic hold. During the night, they rearrange the geography of the peaks, turning familiar routes into dead ends and opening new passages, which makes Groven guides essential for safe travel. Adventurers are often hired to clear blocked trade routes by finding ways to coax these stubborn stone-spirits to step aside.",
          "hooks": [
            "A rumor spreads of a Nurikabe spotted near the area.",
            "Adventurers need a component from a Nurikabe to complete their quest."
          ],
          "description": "A living block of cliff-face that floats just above the ground, blocking and rearranging mountain paths overnight unless disrupted by copper.",
          "heritage": "Born from Yokai wall-spirit myths, the Nurikabe was a road legend explaining how travelers became disoriented and hit dead ends in narrow passes. The Wyrd anomaly reacted to the Fexric engineers' fear of collapsing mines and blocked corridors, materializing this stone-hided wall spirit to block routes and redirect search parties."
        },
        {
          "id": "nue_cloud",
          "name": "Nue",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/nue_cloud.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nue",
          "role": "Nue",
          "origin": "The Nue arises from the chimeric nightmare-monsters of Yokai legend, which bring sickness and dark dreams within a black mist, combined with Pachamama, the Incan earth-mother who nurtures and devours in equal measure. In the high peaks, the creature represents the earth's furious immune response, a living tempest sent to punish those who defile the stone.",
          "nature": "The creature manifests as a dense, churning storm-cloud of black-grey snow that moves against the wind, warm enough to melt the snow within it and create a pocket of humid, tropical air in the frozen mountains. Inside the churning mass, one can catch fleeting glimpses of monkey-jaws, tiger-claws, and serpentine coils, accompanied by a cacophony of animal cries. The cloud constantly projects angry, shifting animal faces that dissolve back into the dark mist.",
          "habitat": "This living storm drifts across the high peaks and valleys of the Cragjaw Peaks, drawn to sites of excavation and industrial mining.",
          "combat": "380 HP. Nightmare-Cloud (AoE 40 ft, DC 15 SPI or shared nightmares for 1d4 rounds — targets experience overlapping visions of their greatest fears simultaneously). Earth-Wound (passive: drawn to places where the mountain has been wounded — collapsed shafts, blasted entrances; it is Pachamama's immune response). Warm-Pocket (passive: cloud is warm and humid — snow melts within it, creating a pocket of tropical air; those inside feel comforted until the nightmares begin). Shape-Shift (passive: within the cloud, shifting shapes of monkey-jaws, tiger-claws, and serpentine coils appear and vanish). Black-Snow (passive: where the cloud touches ground, snow turns black and corrupted). Vulnerable to radiant (radiant damage disperses the cloud for 1d4 rounds).",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 380,
            "maxMana": 50,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "cold": 100,
              "fire": 50,
              "physical": 75
            }
          },
          "depth": "Enveloping mountain camps in its warm, humid darkness, the Nue inflicts shared, terrifying nightmares upon those trapped inside, leaving them exhausted and hallucinating for days. It is drawn to collapsed mines, excavation sites, and areas of heavy Wyrd-corruption, acting as Pachamama's wrath against the intrusive digging of the Kethrin guilds. When a Nue descends, miners flee, and adventurers are often contracted to clear the mist or find the deep-earth wounds that summoned it.",
          "hooks": [
            "A rumor spreads of a Nue spotted near the area.",
            "Adventurers need a component from a Nue to complete their quest."
          ],
          "description": "A churning black storm-cloud that brings humid heat, animal cries, and terrifying nightmares to punish those who mine too deep.",
          "heritage": "Derived from chimera nightmare legends, the Nue represented the fear of sudden, devastating sicknesses brought by toxic volcanic mists. The Wyrd anomaly consolidated the forge-workers' fear of steam-scald sickness and sulfur fumes, materializing this black-mist-shrouded beast to bring dark dreams to mountain camps."
        },
        {
          "id": "kasha_snow",
          "name": "Kasha",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/kasha_snow.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kasha",
          "role": "Kasha",
          "origin": "The Kasha is born of the fiery corpse-stealing cats of Buddhist folklore, who descend during funerals to claim the bodies of the wicked, and Ekeko, the Andean god of abundance and fortune who brings prosperity through miniature offerings. In the cold mountain holdfasts, they are ambivalent judges, carrying the keys to both spiritual unrest and material wealth.",
          "nature": "This creature resembles a large, lynx-sized cat composed of living, blue-white flame that vaporizes snow into steam without producing smoke or ash. It wears a tiny harness on its back loaded with a bundle of miniature tools, weapons, and food items, all carved with meticulous detail. Its feline face displays a calculating intelligence, with sharp, golden-molten eyes that evaluate the worth of those it encounters.",
          "habitat": "They stalk the high ridges and snowy cemetery niches of the Cragjaw Peaks, often descending toward mortal settlements.",
          "combat": "220 HP. Corpse-Thief (special: during funeral-processions, descends from peaks to steal the body; if stolen, the spirit becomes a restless bridge-ghost, doomed to walk the Spans forever). Flame-Fur (passive: fur is pale blue-white extremely hot fire; snow sublimates to steam on contact; melee attackers take 1d6 fire on contact). Fortune-Miniatures (passive: bundles of tiny tools, weapons, food-items; if it deems a family worthy, it leaves a miniature version of what they need — transforms into the real thing within 7 days if treated with reverence). Calculating-Gaze (passive: evaluates, measures, judges — it can assess a creature's worth in 1 round). Claw-Pounce (melee, +5 to hit, 2d6+3 slashing + 1d6 fire). Vulnerable to cold.",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 220,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "fire": 100,
              "cold": 25
            }
          },
          "depth": "Descending during Groven funeral processions, the Kasha attempts to steal the deceased from their bridge niches, leaving their spirits to wander as restless ghosts if the body is taken. However, drawing from Ekeko, the creature also leaves miniature representations of desperately needed items for households it deems worthy, which transform into real tools, food, or coal within seven days. Adventurers are often hired to guard funeral processions from their fiery raids or to seek out the nests of these fire-cats to retrieve the magical miniatures they carry.",
          "hooks": [
            "A rumor spreads of a Kasha spotted near the area.",
            "Adventurers need a component from a Kasha to complete their quest."
          ],
          "description": "A lynx-sized cat of blue-white flame that steals corpses from funerals but leaves magical miniatures that bring prosperity to the worthy.",
          "heritage": "Born from fiery corpse-stealing cat myths, the Kasha was a moral warning to deter desecration of graves and theft of ancestral relics. The Wyrd anomaly reacted to the Fexric engineers' excavations of ancient holdfasts, materializing this fiery cat-spirit to descend during blizzards and claim the bodies of tomb robbers."
        },
        {
          "id": "tanuki_toll",
          "name": "Tanuki",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/tanuki_toll.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Tanuki",
          "role": "Tanuki",
          "origin": "The Tanuki is born of the shape-shifting, sake-loving raccoon-dog spirits of folklore, famed for their magical, shape-shifting pouches and sense of humor, merged with the Illas of Andean tradition—small stone or metal figurines that carry abundance energy to ensure rich finds in the mines. They are jovial tricksters of the spans, bringing good fortune to those who tolerate their games.",
          "nature": "It appears as a squat, round-bodied raccoon-dog with a belly that drags through the snow, wearing a cone-shaped hat of dried mountain-grass and carrying a flask of sake that never runs dry. It carries a magical, shape-shifting pouch that can produce any object, most often creating small stone illas that it arranges in patterns. Its wide, friendly face is marked by dark-rimmed eyes and a permanent, wide grin of pure mischief.",
          "habitat": "They frequent the Ancestor-Spans and main travel corridors of the Cragjaw Peaks, setting up camp on the busiest bridges.",
          "combat": "130 HP. Toll-Trickster (special: positions at Ancestor-Span crossings, disguised as a Groven toll-collector; demands payment — but always something absurd: a riddle, a song, a drink of sake, a funny story). Illa-Stone-Gift (passive: those who comply find their packs heavier — a Tanuki-produced illa-stone that brings good fortune, enriching mineral finds for 1 week). Leaf-Transform (passive: those who refuse have their gear transformed into leaves). Sake-Flask (passive: flask never empties; drinking from it DC 12 CON or intoxicated, -2 to all checks for 1 hour). Leaf-Hat (1 AP: gains invisibility for 1 round; cannot attack while invisible). Vulnerable to fire.",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 12,
            "charisma": 16,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "psychic": 25
            }
          },
          "depth": "Disguised as Groven toll-collectors, they demand bizarre payments like riddles, songs, or drinks of sake, rewarding cooperative travelers with stone illas that bring good fortune and make their packs heavier, while turning the gear of the uncooperative into dry leaves. The Groven welcome their presence on the spans as a sign of favor, and miners actively seek them out to acquire the illas, which guide them to richer mineral veins. Adventurers may find themselves playing games of chance with a Tanuki to secure passage or retrieve a stolen piece of equipment transformed by its magic.",
          "hooks": [
            "A rumor spreads of a Tanuki spotted near the area.",
            "Adventurers need a component from a Tanuki to complete their quest."
          ],
          "description": "A round, mischievous raccoon-dog trickster that demands songs and sake as toll, rewarding the friendly with fortune-bringing stone carvings.",
          "heritage": "Spun from shape-shifting raccoon-dog legends, the Tanuki was a lighthearted myth explaining missing goods, unpaid tavern tabs, and strange laughter in the valleys. The Wyrd anomaly reacted to the local merchants' anxiety over Fexric taxes and lost inventories, materializing this trickster to play pranks and trade fake coins."
        },
        {
          "id": "ushi_oni_crag",
          "name": "Ushi-Oni",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/ushi_oni_crag.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ushi-Oni",
          "role": "UshiOni",
          "origin": "The Ushi-Oni is born of the spider-bodied, bull-headed ox-demons of eastern folklore, which trap prey in webs and breathe poison, combined with the Cherufe, the magma-monsters of Mapuche myth that demand sacrifices to prevent volcanic eruptions. They are terrifying forces of geothermal heat, occupying the deepest volcanic vents and holding nearby settlements hostage.",
          "nature": "This massive monster combines the body of a six-legged spider plated in rough volcanic stone with the head of a demonic bull bearing curved obsidian horns. Its breath is a yellow cloud of toxic sulfur gas, its cloven hooves leave deep impressions in stone, and its body radiates such intense heat that snow melts in a ten-foot circle around it. Deep obsidian sockets hold glowing red eyes, and steam vents constantly from its nostrils, framing a mouth filled with writhing, worm-like tendrils.",
          "habitat": "They make their lairs inside the active volcanic vents and deep geothermal chambers of the Cragjaw Peaks.",
          "combat": "405 HP. Sulfur-Breath (AoE cone 20 ft, 3d6 poison + DC 15 CON or poisoned for 3 rounds; the gas is toxic enough to suffocate webbed prey). Obsidian-Web (special: webs volcanic-glass silk that is invisible in steam; strong enough to hold a mammoth; DC 15 AGI to break free, or 20 slashing damage to cut). Volcanic-Heat (passive: body radiates intense heat; snow melts in 10 ft radius). Bull-Head-Slam (melee, +6 to hit, 2d8+5 bludgeoning + DC 14 AGI or knocked prone). Sacrifice-Taker (passive: demands monthly offering of refined ore from Fexric holdfasts; if refused, physically blocks hot-water pipes, freezing entire sections of Frostmaw Holdfast within hours). Vulnerable to cold (cold damage halves its regeneration for 3 rounds).",
          "stats": {
            "strength": 20,
            "agility": 12,
            "constitution": 18,
            "intelligence": 8,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 405,
            "maxMana": 20,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "physical": 50,
              "poison": 50
            }
          },
          "depth": "Spinning webs of volcanic-glass silk across geothermal vents, the Ushi-Oni traps unwary prey in the steam, suffocating them with its yellow sulfur breath before devouring them. It demands monthly tributes of refined ore from Fexric holdfasts, and if denied, it will physically block the geothermal pipes, freezing entire sections of Frostmaw Holdfast within hours. Holdfast leaders frequently hire seasoned adventurers to clear these pipe-blocking beasts or to harvest their valuable volcanic-glass silk.",
          "hooks": [
            "A rumor spreads of a Ushi-Oni spotted near the area.",
            "Adventurers need a component from a Ushi-Oni to complete their quest."
          ],
          "description": "A massive, volcanic-plated spider with a demonic bull's head that webs geothermal vents and demands tribute to prevent freezing.",
          "heritage": "Derived from spider-bodied, bull-headed ox-demons, the Ushi-Oni represented the terror of toxic volcanic pools and cave collapses. The Wyrd anomaly acted upon the miners' fear of steam eruptions in the foundries, materializing this bull-headed beast to trap prey in toxic webs and breathe acid near the vents."
        },
        {
          "id": "baku_dream",
          "name": "Baku",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/baku_dream.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Baku",
          "role": "Baku",
          "origin": "The Baku is born of the chimera-like dream-devourers of folklore, which possess elephantine trunks and tiger legs to consume the nightmares of mortals, merged with the concept of the Huaca, the sacred objects and beings of Incan tradition that contain extraordinary spiritual power. In the high peaks, they are treated as living sanctuaries, bringing peace and protection to the cold holdfasts.",
          "nature": "This creature is a bizarre composite, featuring an elephantine trunk, the thick grey skin folds of a rhinoceros, a cow-like tail, and short, sturdy tiger legs on a body the size of a large bear. Its hide glows with a soft, warm, golden luminescence that radiates an aura of absolute safety and calm, and its prehensile trunk constantly sniffs the air. Its large, soulful brown eyes convey ancient wisdom, and its trunk is delicate enough to pull abstract fears from the minds of sleepers.",
          "habitat": "They wander the residential corridors, workshops, and warm sleeping quarters of Frostmaw Holdfast in the Cragjaw Peaks.",
          "combat": "130 HP. Nightmare-Eater (special: inserts trunk into a sleeper's dreamscape and literally consumes the nightmare; target wakes refreshed, no memory of bad dreams). Sacred-Huaca (passive: makes its claimed area sacred ground — no violence, no Wyrd-corruption, no supernatural threat can enter the space it claims). Aura-of-Calm (passive: 20-ft radius, all creatures gain +4 to SPI saves and are immune to fear). Trunk-Sniff (passive: tracks psychic residue of fear and nightmares; can identify which creature caused a nightmare by sniffing the dreamer). Gentle-Nudge (melee, +3 to hit, 1d4 bludgeoning — it is a peaceful creature). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 10,
            "constitution": 16,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "psychic": 100,
              "cold": 25
            }
          },
          "depth": "Prowling the sleeping quarters of the holdfast, the Baku uses its delicate trunk to extract and consume the nightmares of the inhabitants, leaving them to wake refreshed with no memory of their terrors. A section of the holdfast that plays host to a Baku becomes a sacred huaca, protected from Wyrd-corruption, violence, and supernatural threats, which leads Kethrin engineers to compete fiercely to house the creatures near their workshops. Adventurers are often tasked with protecting these sacred beasts from poachers or guiding a wild Baku into a nightmare-plagued community.",
          "hooks": [
            "A rumor spreads of a Baku spotted near the area.",
            "Adventurers need a component from a Baku to complete their quest."
          ],
          "description": "A bear-sized chimera with an elephant's trunk and a glowing hide that devours nightmares and turns its home into a sacred sanctuary.",
          "heritage": "Born from dream-devouring chimera legends, the Baku was a comforting myth told to children to absorb nightmares and bring peaceful sleep. The Wyrd anomaly reacted to the settlers' collective dread of night terrors and volcanic eruptions, materializing this elephant-trunked chimera to physically eat bad dreams."
        },
        {
          "id": "nekomata_spur",
          "name": "Nekomata",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/nekomata_spur.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nekomata",
          "role": "Nekomata",
          "origin": "The Nekomata arises from the two-tailed cat-demons of Yokai lore, which raise the dead and control them like puppets, combined with the Kcoa, the powerful storm-cat spirits of Andean belief. In the freezing heights, this creature represents a dark storm-necromancer, using the static energy of the blizzards to animate the frozen dead.",
          "nature": "This large wildcat possesses a dark storm-grey coat and a tail that has split into two separate appendages, which crackle with static electricity and arc with lightning when the creature is agitated. Its eyes glow with a phosphorescent green corpse-light, and it wears a necklace of carved bone-charms taken from the bodies it has claimed. Its feline face has vertical slit pupils, and its mouth glows from within like a green necromantic furnace when opened.",
          "habitat": "It haunts the wind-swept ridges, high bluffs, and frozen crevasse fields of the Cragjaw Peaks.",
          "combat": "220 HP. Corpse-Puppeteer (special: raises frozen dead of the Peaks; the corpses walk in jerky, puppet-like fashion, movements synchronized to the flicking of its twin tails). Twin-Tail-Lightning (passive: lightning arcs between tail-tips; each tail flick can trigger a corpse-animation if a storm is present). Storm-Raise (passive: can raise the dead ONLY during storms — lightning provides the energy; a sufficiently large storm animates dozens simultaneously). Corpse-Green-Eyes (passive: eyes glow with eerie phosphorescent green, revealing its position in blizzard). Bone-Charm-Necklace (passive: each charm is from a different animated corpse; destroying a charm dismisses that specific corpse). Tail-Slash (melee, +5 to hit, 1d8+3 slashing + DC 13 CON or stunned 1 round). Vulnerable to fire.",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "lightning": 100,
              "cold": 50
            }
          },
          "depth": "Operating during the worst mountain storms, the Nekomata uses the lightning's static charge to animate the frozen corpses of those lost in the blizzard, controlling their movements through the flicking of its twin tails. It sends these puppet-like dead marching toward mountain camps in eerie, lightning-lit processions, forcing the Groven to burn their dead to prevent them from being used as thralls. Adventurers are frequently hired to hunt these storm-cats down before a blizzard allows them to raise a small army of the frozen dead.",
          "hooks": [
            "A rumor spreads of a Nekomata spotted near the area.",
            "Adventurers need a component from a Nekomata to complete their quest."
          ],
          "description": "A storm-grey wildcat with two tails that crackle with lightning, using the static of blizzards to animate and control the frozen dead.",
          "heritage": "Spun from two-tailed cat-demon legends, the Nekomata was a warning to prevent desecration of those frozen in the mountains. The Wyrd anomaly consolidated the travelers' terror of blizzards and the fear of losing their dead, materializing this twin-tailed cat to control frozen corpses like puppets."
        },
        {
          "id": "futakuchi_ration",
          "name": "Futakuchi-onna",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/futakuchi_ration.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Futakuchi-onna",
          "role": "Futakuchionna",
          "origin": "The Futakuchi-onna is born of the two-mouthed women of folklore, whose hidden, greedy secondary mouths consume massive amounts of food, combined with the Aiai-Maneco, the Andean spirits of insatiable hunger that leave entire communities destitute. In the survival-strained holdfasts, they represent the terrifying manifestation of greed and the dread of starvation.",
          "nature": "Appearing as a tall, gaunt woman with stringy, matted black hair and sunken eyes, she looks permanently malnourished, her hands shaped as if cradling an empty bowl. Hidden beneath the hair at the back of her skull is a second, lipless mouth filled with jagged teeth and a writhing tongue, which demands food in a guttural, independent voice. From the front, her face is haunted and full of shame, but the rear mouth grins and drools with predatory hunger.",
          "habitat": "They hide in the storage larders, food-vaults, and kitchens of Frostmaw Holdfast and other settlements in the Cragjaw Peaks.",
          "combat": "145 HP. Ration-Devour (passive: infests food-stores; consumes three times the rations of a normal person while appearing to eat almost nothing). Second-Mouth (passive: hidden beneath hair at back of skull; has its own independent tongue and voice — deeper, guttural, always demanding food). Guilt-Mouth (passive: the second mouth speaks the hunger of the mountain itself; Kethrin guild-masters who encounter it are said to have taken more than their share). Hair-Whip (melee, reach 10 ft, +5 to hit, 1d8+3 slashing — the second mouth's hair strikes independently). Vulnerable to fire.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 145,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "physical": 25,
              "cold": 25
            }
          },
          "depth": "Infiltrating food stores under the guise of an ordinary worker, the Futakuchi-onna consumes three times the rations of a normal person, using its hidden mouth at night to empty vaults of dried moss-bread, ram-meat, and whiteout-distillate. The second mouth is said to speak the insatiable hunger of the mountains, punishing greedy Kethrin guild-masters who extract too much wealth by leaving their larders bare. Adventurers are often brought in to quietly investigate disappearing food supplies and deal with the hidden consumer before the holdfast starves.",
          "hooks": [
            "A rumor spreads of a Futakuchi-onna spotted near the area.",
            "Adventurers need a component from a Futakuchi-onna to complete their quest."
          ],
          "description": "A gaunt woman with a hidden, ravenous mouth at the back of her head that secretly devours larders and embodies the hunger of the peaks.",
          "heritage": "Derived from two-mouthed women myths, the Futakuchi-onna was a moral warning against hoarding rations and neglecting family members in lean winters. The Wyrd anomaly reacted to the Fexric engineers' strict rationing during pipeline construction, materializing this two-mouthed spirit to consume massive amounts of food."
        },
        {
          "id": "wanyudo_pass",
          "name": "Wanyūdō",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/wanyudo_pass.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Wanyūdō",
          "role": "WanyÅ«dÅ",
          "origin": "The Wanyūdō is born of the flaming souls-wheels of folklore that roll through mountain passes to steal the spirits of onlookers, merged with the ceremonial sun-wheels of the Inti-Raymi festival. In the cold, sunless world, these sacred festival-wheels have been twisted by Wyrd-corruption, turning them into cold-burning engines of eternal torment.",
          "nature": "From a distance, the creature resembles a traveler's cart rolling through the blizzard with swaying lanterns, but up close, it reveals itself as a single, enormous wheel of blue-white flame and screaming, translucent faces. The wheel's rim is bound in cold-iron, and the fire it emits produces no heat, only a freezing cold that crystallizes the mountain air. The wheel is comprised of dozens of rotating, tormented faces, each crying out in silent agony as they cycle through the flames.",
          "habitat": "They roll through the high, wind-swept passes, switchbacks, and Span-corridors of the Cragjaw Peaks during blizzards.",
          "combat": "380 HP. Soul-Wheel (passive: from a distance, appears as a merchant's cart; up close, it is a single enormous wheel of compressed flame and screaming faces, rolling upright with no cart, no ox, no driver). Soul-Extraction (melee range 5 ft, targets who look directly at the wheel DC 15 SPI or their souls are extracted and added to the wheel's collection — their bodies remain, frozen, eyes wide, faces fixed in horrified recognition). Cold-Fire (passive: blue-white fire that gives no heat, only cold; melee attackers take 2d6 cold). Face-Rotation (passive: the faces in the wheel are translucent — trapped souls of dead travelers; each screams silently, mouths open in eternal agony). Pass-Collector (passive: most active during the old Inti-Raymi festival period — a corrupted version of the sun-festival's ceremonial wheel). Vulnerable to radiant.",
          "stats": {
            "strength": 16,
            "agility": 18,
            "constitution": 16,
            "intelligence": 8,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 380,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 45,
            "resistances": {
              "fire": 100,
              "cold": 100,
              "physical": 50
            }
          },
          "depth": "Cruising through the mountain passes during the worst winter storms, the Wanyūdō targets freezing travelers, extracting the souls of anyone who looks directly at it to add to its burning rim while leaving behind frozen, wide-eyed corpses. It is particularly active during the season of the lost sun-festival, seeking warmth and light by consuming the vital essence of mortals. Adventurers are hired to clear passes haunted by these wheels, or to recover the cold-iron rim of a destroyed Wanyudo to forge cold-resistant artifacts.",
          "hooks": [
            "A rumor spreads of a Wanyūdō spotted near the area.",
            "Adventurers need a component from a Wanyūdō to complete their quest."
          ],
          "description": "A massive, rolling wheel of blue-white fire and screaming faces that collects the souls of freezing travelers in mountain passes.",
          "heritage": "Born from flaming soul-wheels rolling through passes, the Wanyūdō was a road myth warned against looking out of windows during dark, volcanic storms. The Wyrd anomaly consolidated the travelers' fear of volcanic debris and flash fires, materializing this flaming wheel to drag souls to the underworld."
        },
        {
          "id": "tsuchigumo_burrow",
          "name": "Tsuchigumo",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/tsuchigumo_burrow.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Tsuchigumo",
          "role": "Tsuchigumo",
          "origin": "The Tsuchigumo represents the convergence of the ancient, illusion-weaving earth-spiders of Yokai lore, historically associated with rebellious mountain clans, and the metallic-serpent guardians of Urcaguary who protect the earth's treasures. Birthed from stone and precious ores, these massive arachnids guard the deepest veins of the mountains with webs of solid gold and illusions of wealth.",
          "nature": "This draft-horse-sized spider possesses a body of compressed granite, striated stone, and rich mineral veins, with jointed stone legs and an exposed geode carapace lined with sparkling crystals. It has eight gemstone eyes—ruby, emerald, sapphire, diamond, opal, topaz, amethyst, and garnet—that glow with internal fire, and its obsidian mandibles drip with metallic venom. It spins webs of shimmering, molten gold, silver, and copper threads that glow in the dark depths.",
          "habitat": "They dig their nests in the deepest mine shafts, underground caverns, and gem-rich fissures of the Cragjaw Peaks.",
          "combat": "380 HP. Golden-Web (passive: webs mineral-veins with gold-silk stronger than steel cable; touching the silk DC 15 CON or blood slowly crystallizes into metallic compounds). Illusion-Vein (passive: projects illusions of rich, unguarded mineral veins, luring miners into its web-tunnels; any vein that appears 'too good to be true' is a Tsuchigumo trap). Geode-Body (passive: body is a geode — cracked open, revealing hollow interior lined with crystal formations). Gemstone-Eyes (passive: eight eyes, each a different gemstone; each emits a different-colored beam that can be used as a ranged attack: +6 to hit, 1d6+2 of the gem's elemental type — ruby=fire, emerald=nature, sapphire=cold, diamond=psychic, opal=ice, topaz=lightning, amethyst=shadow, garnet=poison). Mandible-Clash (melee, +6 to hit, 2d6+4 slashing + metallic venom that slows). Vulnerable to fire.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 18,
            "intelligence": 12,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "physical": 50,
              "fire": 25,
              "cold": 50
            }
          },
          "depth": "Guarding the richest mineral veins with gold-silk webs, the Tsuchigumo secretes a metallic venom that crystallizes the blood of miners into mineral compounds if they touch the threads. It projects illusions of unguarded, glittering veins to lure miners into its webbed chambers, forcing Fexric holdfasts to flag suspicious veins as hazardous. Daring salvage-teams and adventurers risk their lives to hunt the creature or harvest its golden webs, which can fetch a fortune if extracted without triggering its stone-shattering wrath.",
          "hooks": [
            "A rumor spreads of a Tsuchigumo spotted near the area.",
            "Adventurers need a component from a Tsuchigumo to complete their quest."
          ],
          "description": "A draft-horse-sized spider of solid stone and gems that spins webs of molten gold and uses illusions of wealth to trap miners.",
          "heritage": "Spun from illusion-weaving earth-spider legends, the Tsuchigumo was historically associated with rebellious mountain clans hiding in caves. The Wyrd anomaly reacted to the miners' fear of cave-ins and hidden tunnels, materializing this massive spider to weave illusions and trap travelers in subterranean burrows."
        },
        {
          "id": "akaname",
          "name": "Akaname",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/akaname.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Akaname",
          "role": "Akaname",
          "origin": "The Akaname is born from the filth-licking sprites of folklore, which clean neglected spaces with their long tongues, and the Tunche, the shape-shifting spirits of the wilderness that enforce sacred taboos and punish the disrespectful. In the highly industrial holdfasts, they are vital pipeline cleaners that double as strict enforcers of hygiene and respect for resources.",
          "nature": "Standing three feet tall, this red-skinned humanoid has a body the color of polished copper, which is warm to the touch, and a three-foot-long, cat-like tongue that it uses to scrape surfaces. It carries a neatly maintained collection of brushes, scrapers, and sponges, and its pointed face is dominated by large yellow eyes that scan every surface for dirt. It moves with wiry agility, slithering through narrow pipes and crevices with ease.",
          "habitat": "They reside within the industrial pipelines, steam vents, and workshops of Frostmaw Holdfast and the Cragjaw Peaks.",
          "combat": "75 HP. Pipeline-Cleaner (passive: infests pipeline-networks; licks accumulated mineral-scale from interior walls; a pipeline with an Akaname flows three times more efficiently). Tongue-Lash (melee, reach 10 ft, +5 to hit, 1d4+2 slashing — the tongue is three feet long, prehensile, rough like a cat's). Taboo-Enforcer (passive: enforces cleanliness rules; a workshop that neglects hygiene loses its Akaname, and within a month its pipes clog, tools corrode, machines fail). Cleaning-Tool-Armament (melee, +4 to hit, 1d6+1 slashing — uses brushes, scrapers, sponges as weapons). Vulnerable to fire.",
          "stats": {
            "strength": 8,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 75,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 35,
            "resistances": {
              "poison": 50
            }
          },
          "depth": "Infesting the pipeline network, the Akaname cleans mineral scaling from the pipes, tripling the flow efficiency and prompting Kethrin engineers to design special access ports for them. However, drawing from the Tunche, they enforce strict taboos of cleanliness; if a workshop becomes too dirty or neglected, the spirits will abandon it, which is considered a catastrophic omen that precedes clogged pipes and machinery failures. Adventurers are often hired to locate and relocate these cleaning-sprites when a workshop suffers from their sudden, ominous departure.",
          "hooks": [
            "A rumor spreads of a Akaname spotted near the area.",
            "Adventurers need a component from a Akaname to complete their quest."
          ],
          "description": "A copper-skinned sprite with a long tongue that cleans geothermal pipelines but deserts workshops that violate the laws of cleanliness.",
          "heritage": "Rooted in filth-licking sprite myths, the Akaname was a household tale to enforce cleanliness and warning against neglecting waste disposal. The Wyrd anomaly reacted to the miners' dirty geothermal worker quarters, materializing this long-tongued sprite to lick volcanic grime and absorb disease."
        },
        {
          "id": "inugami_chain",
          "name": "Inugami",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/inugami_chain.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Inugami",
          "role": "Inugami",
          "origin": "The Inugami is born of the dog-spirits bound to mortal families through ancient, dark blood-rituals to act as loyal guardians and instruments of revenge, combined with the sacred afterlife-guide dogs of pre-Columbian tradition. In the Span-settlements, they are revered and feared spectral protectors, representing a bond that transcends life and strengthens the very foundations of their homes.",
          "nature": "This spectral hound appears as a shifting, translucent outline of cold-blue light, wearing a collar of braided human hair locks taken from members of the family it guards. It is always slightly out of focus, like a heat-mirage, and its paws leave no tracks, often flickering and teleporting short distances rather than walking. Its dog-face is highly intelligent and sorrowful, and it can project its image onto reflective surfaces to watch over its family from afar.",
          "habitat": "They dwell on the Ancestor-Spans and within the homes of the Groven families they protect in the Cragjaw Peaks.",
          "combat": "220 HP. Family-Bound (passive: bound to specific Groven families through ancient blood-rituals; serves as invisible guardian, protecting the family's home on the Ancestor-Spans). Ghost-Movement (passive: flickers — appearing to teleport short distances rather than walking; +8 to evasion). Face-Project (passive: can project its face onto any reflective surface, allowing it to watch over multiple locations simultaneously). Loyalty-Fang (melee, +5 to hit, 2d6+3 cold damage — spectral bite). Afterlife-Guide (passive: when a bound family-member dies, the Inugami guides their soul through the dangerous mountain-passes of the spirit-world). Ancestor-Span-Death (passive: when the Inugami itself finally fades, its essence is absorbed into the family's Ancestor-Span, strengthening the bone-bridge's structure permanently). Vulnerable to iron.",
          "stats": {
            "strength": 10,
            "agility": 18,
            "constitution": 12,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 220,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 50,
              "physical": 50,
              "psychic": 50
            }
          },
          "depth": "Bound to Groven families, the Inugami acts as an invisible sentinel, warning of threats on the Ancestor-Spans and hunting down anyone who harms its charges with ruthless efficiency. When a family member dies, the hound guides their soul through the dangerous spirit-paths of the peaks, and when the hound itself fades, its essence absorbs into the bones of the Span to strengthen the bridge. Adventurers must deal with these spectral guardians when attempting to settle disputes with bound Groven families or when trying to retrieve lost souls from the mountain passes.",
          "hooks": [
            "A rumor spreads of a Inugami spotted near the area.",
            "Adventurers need a component from a Inugami to complete their quest."
          ],
          "description": "A spectral, blue-lit hound bound to a family by a collar of human hair, serving as a fierce guardian and a guide to the afterlife.",
          "heritage": "Born from dog-spirits bound through dark blood-rituals, the Inugami represented the fear of family feuds and instruments of vengeance between clans. The Wyrd anomaly reacted to the miners' and engineers' clan rivalries over gold claims, materializing this loyal spirit to protect claims and execute targets."
        },
        {
          "id": "ittan_banner",
          "name": "Ittan-momen",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/ittan_banner.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ittan-momen",
          "role": "IttanMomen",
          "origin": "The Ittan-momen is born of the flying cotton-cloth Yokai of folklore that wrap around the faces of travelers, combined with the sacred textile-spirits and living quipu documents of Andean tradition, which weave the spiritual essence of their makers into physical form. In the high bridges, they are living, flying records and guardians, acting as peaceful messengers and protectors of the vulnerable.",
          "nature": "This creature is a thirty-foot-long, two-foot-wide strip of white, slightly yellowed cotton cloth with frayed edges that floats through the air like a ribbon in water. The fabric is warm, smelling of llama-wool and mountain-herbs, and is embroidered with geometric Andean patterns and quipu-knots that shift when unobserved. It has no face, but the embroidery rearranges itself into readable words, warnings, or names that respond to the observer's deepest concerns.",
          "habitat": "They fly through the open skies, chasms, and Ancestor-Spans of the Cragjaw Peaks, nesting in high bridge arches.",
          "combat": "75 HP. Message-Bearer (special: Groven elder whispers a message into one end; words travel the length of fabric, emerging from the other end at destination; messages cannot be intercepted or forged). Smother-Sleep (special: wraps around attacker's face, putting them in deep, dreamless sleep for exactly 1 day). Heart-Read (passive: embroidered patterns rearrange into readable messages — a name, a question, or a warning; changes based on the observer's deepest concern). Warm-Cloth (passive: warm to the touch, smells of llama-wool and mountain-herbs; +2 to survival checks while within 10 ft). Vulnerable to fire.",
          "stats": {
            "strength": 4,
            "agility": 16,
            "constitution": 10,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 75,
            "maxMana": 20,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "psychic": 25
            }
          },
          "depth": "Serving as living messengers, Ittan-momens carry spoken words whispered into their fabric across the chasms of the peaks, delivering secure and unforgeable communication between Groven communities. When threatened, the banner wraps around an attacker's face, putting them into a peaceful, day-long sleep, and it will wrap around exposed children to protect them from the deadly cold of the blizzards. Adventurers are sometimes sent to recover an Ittan-momen carrying a vital historical message, or to seek their help in surviving a winter crossing.",
          "hooks": [
            "A rumor spreads of a Ittan-momen spotted near the area.",
            "Adventurers need a component from a Ittan-momen to complete their quest."
          ],
          "description": "A thirty-foot strip of living embroidered cloth that carries messages across mountain chasms and wraps around travelers to protect them from the cold.",
          "heritage": "Derived from flying cotton-cloth Yokai, the Ittan-momen originally served to warn travelers against suffocating blizzards and strong winds in narrow passes. The Wyrd anomaly reacted to the mountain guides' fear of sudden windstorms, materializing this flying textile spirit to wrap around faces and drag victims over cliffs."
        }
      ]
    },
    {
      "id": "sundrift-vale",
      "name": "Sundrift Vale",
      "folklore": "Mongol/Turkic + Chinese",
      "creatures": [
        {
          "id": "mogwai",
          "name": "Mogwai",
          "dangerLevel": "Trivial",
          "illustration": "/assets/images/creatures/mogwai.png",
          "illustrationCaption": "A Mogwai peering through the tall grass, a horse-hair braid in its hand",
          "role": "The horse-braiding grass sprite",
          "origin": "The Mogwai is a creature of the grass and the rain, born from the Chinese legends of the mischievous rain sprites and the nomadic steppe tales. In Sundrift Vale, where the grass is tall and the horses are many, the Mogwais are the spirits of the grass, creatures that have been twisted by the Wyrd into something that is both playful and dangerous. The Wyrd's corruption did not change their nature, but it did make them more mischievous, for the creature now sees all who enter its territory as a source of amusement, and it will play pranks on any who come near its nest. The nomads of Sundrift Vale know the signs of a Mogwai's presence—a horse that is spooked for no reason, and the sound of pebbles clicking in the grass.",
          "nature": "A small, fuzzy, cat-sized grass sprite with a round face, tufted wildcat ears, and a bushy tail made of woven steppe grass. Its pale, dead-grass yellow fur camouflages it perfectly in the open plains, and it is highly mischievous, clicking pebbles to startle horses and stealing horse-hair to braid into its necklaces. The creature is a thing of terrible cuteness, and its pranks are harmless but annoying. The Mogwai is a creature of the grass, and it is most active during the spring, when the grass is tallest and the horses are most active.",
          "habitat": "The Mogwai inhabits the open steppe and grasslands of Sundrift Vale, particularly in the Horse-Plain where the grass is tallest and the horses are most numerous. It is most active during the spring, when the grass is tallest and the horses are most active, and during the summer, when the sun is warm and the air is filled with the sound of insects. The Mogwai's nest is always in the grass, and it is said to be a place of terrible beauty, filled with the braids of a thousand horses.",
          "combat": "45 HP. Scurry (moves 40 ft without opportunity attacks). Startle Herd (claps its hands, 30 ft range, DC 12 SPI save or target's mount bolts 20 ft). Grass Camouflage (gains total concealment in tall grass). Tangle-Snare (ranged, 30 ft, DC 12 AGI save or speed is halved for 2 rounds). Vulnerable to ember.",
          "stats": {
            "strength": 6,
            "agility": 16,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 12,
            "maxHp": 45,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 40,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "They are grassland tricksters that feed on steppe rodents. While mostly harmless, they are a nuisance to the nomadic clans because their pebble-clicking can cause whole horse herds to stampede in the dark. The Mogwai's braids are a mystery to scholars, for they are woven from a grass that does not exist in any known catalog, and some believe that the creature's braids are a natural art, a living tapestry that tells the story of the steppe.",
          "hooks": [
            "A nomadic clan's prize warhorse was spooked by a Mogwai and ran into a rift. The party must locate the horse before the Wind-Hungry find it.",
            "A Mogwai has braided the hair of an Astril clan-elder, weaving a key star-rune into her braids that prevents her from reciting the daily light-prayer. Untangle the braids without angering the sprite."
          ],
          "heritage": "Rooted in Chinese rain-sprite myths, the Mogwai originally served to explain sudden summer rains and minor crop disruptions, warning farmers against leaving crops uncovered. The Wyrd anomaly reacted to the travelers' encounters near the steppe trade caravans, materializing these horse-braiding grass sprites to play tricks during dry dust storms."
        },
        {
          "id": "olgoi_khorkhoi",
          "name": "Olgoi-Khorkhoi",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/olgoi_khorkhoi.png",
          "illustrationCaption": "An Olgoi-Khorkhoi death worm coiled in the sands, its maw open to spit acid",
          "role": "The steppe death worm",
          "origin": "The Olgoi-Khorkhoi is a creature of the sand and the death, born from the Mongolian legends of the giant sand worm that kills from a distance. In Sundrift Vale, where the sand is deep and the sun is merciless, the Olgoi-Khorkhois are the apex predators of the desert, creatures that have been twisted by the Wyrd into something that is both terrifying and unstoppable. The Wyrd's corruption did not change their nature, but it did make them more cunning, for the creature now sees all who enter its territory as prey, and it will wait for days for the perfect moment to strike. The nomads of Sundrift Vale know the signs of an Olgoi-Khorkhoi's presence—a patch of sand that is too smooth, and the absence of any other life.",
          "nature": "A thick, sausage-like crimson worm, about five feet long, covered in smooth, blood-red skin with no visible head or tail, only a circular, tooth-lined maw that opens at one end. The creature moves by burrowing through the steppe sands, popping up to attack with a speed that is terrifying. The Olgoi-Khorkhoi is a thing of terrible hunger, and its maw is large enough to swallow a man whole. The creature is a creature of the sand, and it is most active during the summer, when the sand is hot and the prey is thirsty.",
          "habitat": "The Olgoi-Khorkhoi inhabits the sandy dunes, dry grasslands, and rocky valleys of Sundrift Vale, particularly in the Red-Sand Desert where the sand is deepest and the sun is hottest. It is most active during the summer, when the sand is hot and the prey is thirsty, and during the spring, when the sand is warm and the air is filled with the sound of insects. The Olgoi-Khorkhoi's lair is always beneath the sand, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "380 HP. Acid Spit (ranged, +5 to hit, 2d6 blight damage + DC 13 CON save or target's armor is corroded). Electrical Discharge (AoE, 10-ft radius, DC 13 AGI save or 2d8 storm damage). Sand Burrow (can submerge into sand for 1 AP, gaining full cover). Vulnerable to rime.",
          "stats": {
            "strength": 14,
            "agility": 14,
            "constitution": 16,
            "intelligence": 4,
            "spirit": 14,
            "charisma": 4,
            "maxHp": 380,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "storm": 50,
              "blight": 50
            }
          },
          "depth": "Terrifying, subterranean predators that hunt by sensing vibrations. Nomads avoid dry sand patches where the worms are known to nest. The Olgoi-Khorkhoi's blood-red skin is a mystery to alchemists, for it is made of a substance that is harder than any known material, and some believe that the creature's skin is a natural armor, a living shield that protects it from the heat of the sand.",
          "hooks": [
            "A nomadic tribe's herd of sheep was decimated overnight; the tracks show circular sand collapse holes from a Death Worm.",
            "An alchemist wants to retrieve the acidic gland of an Olgoi-Khorkhoi to brew an acid that can dissolve solid iron."
          ],
          "heritage": "Born from Mongolian legends of the giant steppe death worm, this creature originally warned travelers against entering remote, scorching sand dunes. The Wyrd anomaly reacted to the destructive excavations for ancient Fexric technology, materializing this massive sand worm to execute anyone who disturbs its subterranean home."
        },
        {
          "id": "yalbagan",
          "name": "Yalbagan",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/yalbagan.png",
          "illustrationCaption": "A Yalbagan coiled in the dry steppe grass, all three heads swaying in unison",
          "role": "The three-headed steppe snake",
          "origin": "The Yalbagan is a creature of the grass and the venom, born from the Siberian and Turkic mythology of the multi-headed dragon-serpent. In Sundrift Vale, where the grass is tall and the snakes are many, the Yalbagans are the apex predators of the steppe, creatures that have been twisted by the Wyrd into something that is both terrifying and cunning. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as prey, and it will attack any who come near its nest. The nomads of Sundrift Vale know the signs of a Yalbagan's presence—a waterhole that is too quiet, and the sound of scales rustling in the grass.",
          "nature": "A long, green-and-yellow scaled serpent about ten feet long, with three distinct heads that sway in unison. The creature lies coiled in the tall dead grass of the steppe, mimicking grass movement to lure rodents and mounts. The three heads strike independently and coordinate their attacks with absolute precision. The Yalbagan is a thing of terrible hunger, and its venom is strong enough to kill a horse in seconds. The creature is a creature of the grass, and it is most active during the summer, when the grass is tallest and the prey is most active.",
          "habitat": "The Yalbagan inhabits the open steppe, tall grass beds, and waterholes of Sundrift Vale, particularly in the Three-Head Pass where the grass is tallest and the waterholes are most plentiful. It is most active during the summer, when the grass is tallest and the prey is most active, and during the spring, when the grass is green and the air is filled with the sound of insects. The Yalbagan's nest is always near a waterhole, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "650 HP. Triple Strike (attacks three times in a single action, once with each head). Poison Bite (1d10+4 physical + DC 13 CON save or poisoned for 3 rounds). Grass Mimic (gains +6 to stealth checks while in tall grass). Vulnerable to ember.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 6,
            "maxHp": 650,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 35,
            "resistances": {
              "rime": 50
            }
          },
          "depth": "A dangerous apex predator of the steppe. The Ordan nomads travel in tight groups and keep fires burning at night to prevent them from slipping into their corrals. The Yalbagan's three heads are a mystery to scholars, for they are controlled by a single brain, and some believe that the creature's heads are a natural adaptation, a living weapon that allows it to attack from multiple directions at once.",
          "hooks": [
            "A Yal-Bagan has claimed a waterhole, preventing three clans' herds from drinking. Kill it or redirect the herds before a clash over resources occurs.",
            "A hunter wants to retrieve the venom from all three heads of a Yal-Bagan to brew a potent counter-toxin for a poisoned clan chief."
          ],
          "heritage": "Derived from Siberian and Turkic multi-headed dragon-serpent myths, the Yalbagan represented the fear of sudden plague and toxic swamp water in the valleys. The Wyrd anomaly consolidated the travelers' survival panic during heavy resource mining, materializing this three-headed snake to defend remote oases."
        },
        {
          "id": "qilin",
          "name": "Qilin",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/qilin.png",
          "illustrationCaption": "A Qilin walking through the steppe, its single starry horn glowing warmly",
          "role": "The sacred steppe protector",
          "origin": "The Qilin is a creature of the stars and the steppe, born from the Chinese and Siberian legends of the sacred deer that protects the innocent. In Sundrift Vale, where the stars are bright and the grass is endless, the Qilins are the guardians of the steppe, creatures that have been blessed by the Wyrd with a power that is both beautiful and terrible. The Wyrd's corruption did not change their nature, but it did make them more elusive, for the creature now sees all who approach as a potential threat, and it will only appear to those of pure spirit. The nomads of Sundrift Vale know the signs of a Qilin's presence—a star that falls from the sky, and the sound of a deer's call in the night.",
          "nature": "A slender deer-like fey creature covered in iridescent blue scales, with a single, warm-glowing horn on its forehead and a tufted wildcat tail. The creature walks silently, its hooves leaving glowing trail footprints in the tall grass, and it only appears to those of pure spirit. The Qilin is a thing of terrible beauty, and its horn is said to be the key to the gates of heaven. The creature is a creature of the stars, and it is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos.",
          "habitat": "The Qilin inhabits the deep steppe, starry valleys, and ancient mounds of Sundrift Vale, particularly in the Star-Field where the grass is tallest and the stars are brightest. It is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos, and during the spring, when the grass is green and the air is filled with the sound of insects. The Qilin's nest is always in the stars, and it is said to be a place of terrible beauty, filled with the light of a thousand suns.",
          "combat": "380 HP. Starry Path (creates a 20-ft lane of glowing starlight, granting allies +10 speed and advantage on saves). Solar Horn (ranged, 30 ft, 2d8 ember damage). Evasion (ignores opportunity attacks). Resistant to wyrd and ember.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 14,
            "intelligence": 14,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 380,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "wyrd": 100,
              "ember": 100
            }
          },
          "depth": "Highly intelligent and peaceful guardians. They protect migration routes and ancestor mounds, actively fleeing or neutralizing hunters who threaten the herds. The Qilin's starry horn is a mystery to scholars, for it is made of a substance that does not exist in any known catalog, and some believe that the creature's horn is a natural star, a living light that guides the innocent to safety.",
          "hooks": [
            "A Qilin has appeared near a clan's camp, signaling an impending Wyrd storm. The party must interpret its starry horn signals to guide the clan to safety.",
            "A corrupt merchant has hired hunters to capture a Qilin's horn. The party must defend the sacred deer and banish the hunters."
          ],
          "heritage": "Rooted in Chinese and Siberian legends of the sacred deer, the Qilin originally served as a symbol of cosmic justice, defending the innocent and warning rulers against hubris. The Wyrd anomaly reacted to the heavy excavations in the valleys, materializing this horned guardian to watch over the steppe and protect lost travelers."
        },
        {
          "id": "bixie",
          "name": "Bixie",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/bixie.png",
          "illustrationCaption": "A winged Bixie chimera standing guard on a grassy hill, its stone-like scales glinting",
          "role": "The winged chimera guardian",
          "origin": "The Bixie is a creature of the sky and the stone, born from the Chinese legends of the winged celestial chimera that wards off evil spirits. In Sundrift Vale, where the steppe is wide and the sky is endless, the Bixies are the guardians of the ancient mounds, creatures that have been blessed by the Wyrd with a power that is both beautiful and terrible. The Wyrd's corruption did not change their nature, but it did make them more protective, for the creature now sees all who approach the mounds as a potential threat, and it will attack any who come near the graves. The nomads of Sundrift Vale know the signs of a Bixie's presence—a wind that blows from nowhere, and the sound of a lion's roar in the night.",
          "nature": "A winged, lion-like celestial beast covered in jade-green, stone-like scales, with two curved horns on its forehead and bird-like wings. The creature is a protective spirit that guards nomadic burial mounds and ruins from corruption, and it is a thing of terrible beauty. The Bixie is a creature of the sky, and it is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos. The creature's scales are harder than any known metal, and its wings are said to be able to create a wind that can blow away evil spirits.",
          "habitat": "The Bixie inhabits the steppe mounds, ancient stone ruins, and sacred hills of Sundrift Vale, particularly in the Jade-Hill Mound where the grass is tallest and the mounds are oldest. It is most active during the night, when the stars are brightest and the air is filled with the sound of the cosmos, and during the spring, when the grass is green and the air is filled with the sound of insects. The Bixie's nest is always in the mounds, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "255 HP. Ward Roar (AoE, DC 13 SPI save or target is frightened and has disadvantage on spells). Jade Claw (+5 to hit, 2d6+4 physical). Wing Sweep (melee, DC 13 AGI save or knocked back 15 ft). Vulnerable to blight.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 255,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "wyrd": 100
            }
          },
          "depth": "Benevolent and noble guardians. They will actively protect peaceful travelers and nomads from undead or shadow spirits, but will attack grave-robbers instantly. The Bixie's jade scales are a mystery to alchemists, for they are made of a substance that does not exist in any known catalog, and some believe that the creature's scales are a natural armor, a living shield that protects it from the evil spirits that it guards against.",
          "hooks": [
            "A clan's ancestral burial mound is being looted by tomb raiders, and the guardian Bixie has gone wild, attacking anyone nearby.",
            "Nomads want the party to perform a ritual of cleansing at a defiled shrine to calm the resident Bixie spirit."
          ],
          "heritage": "Derived from Chinese myths of the winged chimera guardian, the Bixie served as a stone amulet to ward off malevolent spirits and guard imperial tombs. The Wyrd anomaly reacted to the miners' and excavators' fear of ancestral curses in ancient ruins, materializing these winged stone beasts to stand watch at excavation gates."
        },
        {
          "id": "almas",
          "name": "Almas",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/almas.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Almas",
          "role": "Almas/Almasty",
          "origin": "The Almas is born of the high mountain gaps and windswept steppe, drawing its lineage from the legendary Almasty wildmen of the Caucasus and the quiet Xing-Xing of ancient bestiaries. Rather than the aggressive wildmen of western folklore, this creature represents a silent, observant lineage of tree-spirits that have taken ape-like shape. In the setting of the Sundrift Vale, they exist as quiet watchers, remnants of an older world who carry the burden of speech they choose never to utter.",
          "nature": "Standing seven feet tall, the Almas is a lean and wiry biped covered in dense, reddish-brown hair matted with dried steppe-grass and mud, perfectly adapted for running across open, unforgiving terrain. Its face exists in the space between ape and human, defined by a broad, flat nose, deep-set amber eyes under a brooding brow-ridge, and a mouth that seems perpetually on the verge of articulation. Enormous, snowshoe-like feet allow it to traverse soft steppe-soil without sinking, while a necklace of carved ancestor-bones and a gnarled root-club hint at a deep, primitive spirituality.",
          "habitat": "These brooding watchers reside in the windswept grasslands and rocky ridges of the Sundrift Vale, shifting their territory in parallel with the nomadic migrations.",
          "combat": "160 HP. Silent-Witness (passive: remembers the steppe's history going back centuries; can identify any creature or historical event on the steppe with a DC 14 History check if the GM allows a roleplay interaction). Root-Club (melee, +5 to hit, 2d6+3 bludgeoning). Bone-Necklace (passive: wears carved ancestor-bones suggesting a religious role; +4 to Spirit checks when negotiating with Ordan shamans). Silent-Gift (passive: occasionally leaves helpful gifts — dead predators, dry firewood, hidden water-source cairns). Snowshoe-Feet (can cross soft steppe-soil without sinking). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 14,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 160,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "The Almas acts as the living memory of the Sundrift Vale, remembering centuries of clan migrations, ancestor-mound rituals, and the gradual, tragic erasure of the stars by House Ordavan. They watch the nomadic clans from the safety of the ridges, never directly interfering but occasionally leaving silent gifts—such as a slain predator, dry firewood, or a cairn marking a hidden water-source. The Astril believe these creatures preserve the very constellation-patterns that were traded away, making them prime targets for those seeking lost celestial knowledge or those tracking rumors of their rare presence.",
          "hooks": [
            "A rumor spreads of a Almas spotted near the area.",
            "Adventurers need a component from a Almas to complete their quest."
          ],
          "description": "A towering, shaggy hominid that silently watches the steppe migrations from distant ridges, preserving the lost memories of the sky.",
          "heritage": "Born from Almasty wildmen legends of the high Caucasus, the Almas originally served to explain the mysterious, human-like shadows that stalked remote mountain passes. The Wyrd anomaly crystallized the travelers' fear of isolation and cold winds, materializing these shaggy wildmen to stalk the windswept steppe."
        },
        {
          "id": "tulpar",
          "name": "Tulpar",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/tulpar.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Tulpar",
          "role": "Tulpar",
          "origin": "The Tulpar descends from the winged steeds of Turkic myth and the celestial Longma, the dragon-horse that rose from sacred waters carrying the cosmic patterns on its back. In the Sundrift Vale, these creatures are physical manifestations of divine favor and the lost heavens, embodying the untamable spirit of the steppe.",
          "nature": "This magnificent, powerfully built steed is covered in iridescent scales that shift color with the winds, transitioning from pale gold under clouds to deep blue at night. A single spiraling horn of crystal projects from its forehead, and its folded, feathered wings glow with the light of forgotten stars, leaving trails of stardust when unfurled. Its noble face features large, intelligent eyes that mirror the lost night sky, and its hooves strike tiny, star-like sparks from the frozen ground as it runs.",
          "habitat": "The Tulpar roams the open plains and high plateaus of the Sundrift Vale, moving wherever the wild horse herds migrate.",
          "combat": "220 HP. Sky-Memory (passive: its scale-patterns reproduce the exact constellation-map that was erased from the sky; Astril can read these patterns by pressing crystalline skin against the horse's flank, absorbing celestial knowledge). Wing-Dust (passive: trails of stardust when wings are extended; +2 to Navigation checks). Starry-Cantrip (ranged, +5 to hit, 1d8 radiant). Spark-Hooves (passive: hooves strike sparks from frozen ground — each spark a tiny falling star; illuminates 10 ft). Impossible-Capture (passive: dissolves into starlight when touched by a bridle — cannot be tamed). Immune to fall damage. Vulnerable to psychic.",
          "stats": {
            "strength": 12,
            "agility": 20,
            "constitution": 14,
            "intelligence": 14,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 220,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 50,
            "resistances": {
              "psychic": 100,
              "radiant": 100
            }
          },
          "depth": "A celestial horse of starlight. It will run alongside travelers and defend them from wolves, but if anyone attempts to touch it with a rope or bridle, it instantly dissolves into stardust and teleports 10 miles away. It can only be ridden bareback while in mid-air.",
          "hooks": [
            "A wild winged horse of starlight is spotted running alongside caravans.",
            "An elf seeks a brave rider who can mount a Tulpar in mid-air."
          ],
          "description": "A celestial, scaled horse whose wings and hide glow with the patterns of lost constellations, leading wild herds across the darkened steppe.",
          "heritage": "Derived from winged steeds of Turkic mythology, the Tulpar represented the hope of finding a loyal, swift mount that could carry travelers across the vast grasslands. The Wyrd anomaly reacted to the horse-breeders' devotion and the need for safe travel, materializing these winged dragon-horses to guide caravans."
        },
        {
          "id": "erlik",
          "name": "Erlik",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/erlik.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Erlik",
          "role": "Erlik",
          "origin": "The Erlik draws its terrifying authority from Erlik, the first man to die and ruler of the Turkic underworld, combined with Yanluo Wang, the bureaucratic judge of the Chinese courts of Diyu. In the Sundrift Vale, this entity represents the finality of mortal law, enforcing the cosmic balance of debts and oaths that bind the clans together.",
          "nature": "Seated upon a throne formed from the interwoven, resonant bones of the interred dead, this nine-foot-tall figure is divided down the middle: one half is warm, weathered human flesh, while the other is a bare, cold skeleton etched with glowing runes of judgment. It holds a set of scales containing a single feather of steppe-grass on one side and a heavy stone tablet on the other. Its face is similarly split, showing the stern, wise visage of an ancient khan beside a bare skull with an amber-glowing eye socket, speaking in a dual voice of living justice and skeletal finality.",
          "habitat": "It dwells deep within the central chambers of the largest Ancestor-Mounds scattered across the Sundrift Vale.",
          "combat": "450 HP. Soul-Judgment (passive: presides over the Ancestor-Mounds; the recently dead are left for 7 days — if the body is gone, the soul was judged worthy; if the body remains, the soul was found wanting and becomes a Hungry Child). Debt-Weigh (special: weighs not just sin but debt — every unfulfilled promise, broken oath, unpaid obligation; Ordan petition it for specific verdicts). Bone-Throne (passive: throne grown from actual bones of the dead — the Mound's interred ancestors woven into a living chair). Half-Alive (passive: half-flesh, half-skeleton; the flesh-side is warm and weathered, the skeleton-side inscribed with judgment-runes). Dual-Voice (passive: speaks from both halves simultaneously — living and dead, judgment and mercy). Bone-Strike (melee, +7 to hit, 2d8+5 bludgeoning + DC 15 SPI or the target feels the weight of their unfulfilled debts, taking 2d6 psychic per round for 3 rounds). Vulnerable to radiant.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 18,
            "intelligence": 16,
            "spirit": 20,
            "charisma": 14,
            "maxHp": 450,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "cold": 50,
              "physical": 50,
              "psychic": 50
            }
          },
          "depth": "Seated on its bone throne, it judges souls. It refuses to let anyone pass unless their group can balance its scales: they must place an item of sentimental value on one side that weighs exactly the same as their collective sins (measured by Erlik's magic).",
          "hooks": [
            "The party must justify their past deeds before the Underworld Judge.",
            "A merchant's soul is held by Erlik, and the party must trade a memory of equal weight."
          ],
          "description": "A nine-foot-tall arbiter of the dead, half-flesh and half-bone, who sits upon a throne of ancestral remains to weigh the debts of the living and the departed.",
          "heritage": "Rooted in Turkic underworld myths, the Erlik represented the fear of death and the bureaucratic accounting of souls in the afterlife. The Wyrd anomaly reacted to the excavators' anxiety over cave collapses in ancient holdfasts, materializing this horned king to rule the dark under-galleries of Sundrift Vale."
        },
        {
          "id": "burkhan_wind",
          "name": "Burkhan",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/burkhan_wind.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Burkhan",
          "role": "Burkhan",
          "origin": "The Burkhan embodies the sacred mountain and river spirits of Mongolian shamanism combined with Feng Bo, the Chinese Earl of Wind who rides the gales. It represents the breathing pulse of the land, an elemental guardian that demands respect and offering rather than worship, maintaining the fragile equilibrium of the steppe's ecosystems.",
          "nature": "This entity is a presence rather than a physical body, first noticed as a circular clearing where the grass rhythmically bends inward and outward as if breathing, surrounding a shimmering column of air. At the center of this disturbance stands a sacred pole draped in blue silk khadag-scarves that never decay and mysteriously multiply. When it chooses to manifest, the wind gathers into the shifting, translucent shape of an old man riding a stag, his face a serene, continuously blurring swirl of moving air.",
          "habitat": "It is bound to specific sacred sites, ancient trees, and pure springs across the Sundrift Vale.",
          "combat": "130 HP. Sacred-Circle (passive: bound to a specific sacred-site — a hill, a spring, a stretch of grass; its presence makes the surrounding area fertile: grass grows taller, herds are healthier, water-sources remain pure). Khadag-Multiplication (passive: a single offering-scarf becomes three within a month — a sign of favor). Wind-Petition (special: can be petitioned for favorable weather by throat-singing at the sacred pole; if the offering is accepted, the scarf multiplies; if rejected, it disintegrates — a warning that the clan must change migration-route). Wind-Column (manifests as a column of compressed air shaped like an old man riding a stag — features shift and blur continuously). Fragrance-of-Sacred (passive: smells of fermented mare's milk and burning juniper). Vulnerable to none (it is a sacred-presence; attacking it invites cosmic retribution — any creature that damages a Burkhan must DC 18 SPI or suffer a curse of bad luck for 1 year).",
          "stats": {
            "strength": 8,
            "agility": 16,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "all": 50
            }
          },
          "depth": "The presence of a Burkhan fertilizes the surrounding soil, sweetens the water, and keeps the local herds healthy, prompting Ordan nomads to adjust their migrations to pass through these blessed circles. Shamans petition the wind for favorable weather and safe passage through the fog by tying new silk scarves to the pole and throat-singing sacred melodies. If the offering is accepted, the silks multiply, but if the spirit is offended or foresees doom, the scarves disintegrate, signaling to the clan that they must alter their path immediately.",
          "hooks": [
            "A rumor spreads of a Burkhan spotted near the area.",
            "Adventurers need a component from a Burkhan to complete their quest."
          ],
          "description": "A sacred localized spirit of wind and fertility, visible only as a rhythmic breathing in the steppe-grass and a shimmering in the air.",
          "heritage": "Derived from Mongolian shamanic wind-spirit beliefs, the Burkhan represented the personification of the violent steppe gales that destroyed camps. The Wyrd anomaly captured the fear of elemental storms during heavy resource extraction, materializing this wind-riding spirit to control the winds and blow travelers off paths."
        },
        {
          "id": "nian",
          "name": "Nian",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/nian.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Nian",
          "role": "Nian",
          "origin": "The Nian is born of the terrors of winter and the underworld, drawing its lineage from the crop-devouring Nian of Chinese legend and the iron-horned monstrosities that compose Erlik's underworld herds. It represents the raw, destructive hunger of the cold months, when resources are scarce and survival hangs by a thread.",
          "nature": "Standing six feet at the shoulder, this massive, boar-like beast is covered in coarse, blood-red fur, sporting a heavy mane braided with discordant, rusted bells and a single curved horn of oxidized iron. Its eyes burn with a furnace-red glow, and its cloven hooves leave smoldering prints in the earth. Its face is a terrifying hybrid of tusked boar and roaring lion, with a maw that stretches impossibly wide to reveal a throat filled with flickering embers.",
          "habitat": "These ravenous beasts roam the windswept grasslands of the Sundrift Vale, appearing primarily during the darkest, coldest periods of the year.",
          "combat": "380 HP (per herd member; treat as a pack). Horn-Gore (melee, +6 to hit, 2d8+5 piercing + DC 14 CON or burned, 1d6 fire per round for 3 rounds). Stampede-Charge (passive: travels in herds of 5-10; each member charges in a line, dealing 3d6 bludgeoning to all in its path, DC 15 AGI or trampled). Red-Terror (passive: repelled by loud noise (throat-singing at maximum volume), the color red (attracts then repels — they charge red objects but cannot touch them), and fire (causes them to stampede away)). Bell-Rattle (passive: mane braided with rusted bells that ring discordantly — DC 13 SPI or frightened 1 round). Ember-Trail (passive: hoofprints are warm to the touch; the ground smolders where it has passed). Vulnerable to cold.",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 8,
            "maxHp": 380,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 45,
            "resistances": {
              "fire": 100,
              "cold": 25
            }
          },
          "depth": "Travelling in destructive herds, Nians target nomadic settlements, trampling yurts, scattering livestock, and devouring leather, winter food stores, and sacred ancestor-bone ornaments. The Ordan combat these terrors with loud noise, loud throat-singing, and bonfires, painting their sacred poles red to create a warding barrier that the beasts charge but cannot cross. Brave hunters sometimes track these herds to harvest their valuable iron horns or recover stolen clan relics from their bellies.",
          "hooks": [
            "A rumor spreads of a Nian spotted near the area.",
            "Adventurers need a component from a Nian to complete their quest."
          ],
          "description": "A roaring, iron-horned beast of rust and red fur that stampedes in packs during the dark season, consuming everything in its path.",
          "heritage": "Originating as a seasonal warning, the Nian was a Chinese myth representing the absolute terror of winter starvation and crop destruction. The Wyrd anomaly reacted to the settlers' survival panic during freezing winter nights in the valley, materializing this crop-devouring monster to hunt down livestock."
        },
        {
          "id": "jiangshi",
          "name": "Jiangshi",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/jiangshi.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Jiangshi",
          "role": "Jiangshi",
          "origin": "The Jiangshi combines the Chinese hopping corpse that drains life-energy with the Ubagan, the restless subterranean spirit of Turkic lore. They are born when a nomad dies far from home, leaving their spirit unable to rest in the ancestor mounds until their final duties are fulfilled.",
          "nature": "This creature is a desiccated corpse frozen in a rigid, forward-reaching posture, moving across the steppe in mechanical five-foot hops. It wears its weathered funerary riding clothes, leather boots, and a fur hat, with its grey-black skin stretched tightly over bone. Its face is locked in a silent scream, with milky eyes containing a trapped, desperate intelligence, while a yellowed ritual paper talisman flutters continuously over its forehead.",
          "habitat": "They wander the open plains and migration routes of the Sundrift Vale, originating from ancient Ancestor-Mounds.",
          "combat": "220 HP. Hopping-Dead (passive: moves by hopping — both feet leaving ground simultaneously, 5 ft per hop, mechanical precision; never deviates from a straight line). Qi-Drain (melee, +5 to hit, 2d6+3 necrotic — drains life-force through touch; targets DC 13 CON or lose 1d4 CON for 24 hours). Talisman-Control (special: paper talisman on forehead controls it; if removed, the Jiangshi collapses and is freed from undeath; if replaced with a new talisman inscribed with the correct ancestor-name, the Jiangshi is redirected toward a new task). Rigor-Freeze (passive: frozen stiff in rigid posture; immune to grapple, prone, and knockback). Ancestor-Drive (passive: pursues unfinished business with single-minded determination — an unfulfilled migration-route, an undelivered message). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 14,
            "intelligence": 4,
            "spirit": 10,
            "charisma": 4,
            "maxHp": 220,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "cold": 50,
              "physical": 50,
              "poison": 100
            }
          },
          "depth": "This hopping corpse is completely blind and deaf but detects the breath of living creatures. If players hold their breath (requiring a Constitution check each round), the Jiangshi will hop right past them. If they breathe, it immediately attacks.",
          "hooks": [
            "A tomb is guarded by hopping corpses that hunt by sensing breath.",
            "A village must remain absolutely silent and hold their breath as a Jiangshi hops through."
          ],
          "description": "A frozen, hopping corpse draped in traditional riding gear, driven by a paper talisman to resolve unfinished ancestral business.",
          "heritage": "Spun from Chinese hopping corpse legends, the Jiangshi served as a warning to ensure proper funeral rites and prevent corpses from being left in remote soil. The Wyrd anomaly consolidated the fear of ancestral anger and desecration in the mines, materializing these stiff-limbed undead to drain the life-energy of travelers."
        },
        {
          "id": "taotie_gorge",
          "name": "Taotie",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/taotie_gorge.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Taotie",
          "role": "Taotie",
          "origin": "The Taotie is the physical manifestation of insatiable greed and limitless consumption, blending the Chinese bronze-mask fiend Taotie with the Boq, the monstrous pack-hunting wolf-spirit of Turkic legend. It represents the terror of sudden, absolute erasure beneath the grass.",
          "nature": "This fifteen-foot creature is essentially a massive, walking maw supported by stubby, powerful legs, completely lacking a distinct head or tail. Its hide is the dull yellow of dried steppe-grass, rendering it invisible in the high plains. Within its yawning mouth are concentric, spiraling rings of needle-sharp teeth, and its vestigial, red-glowing eyes are buried deep within the gullet, expressing nothing but a permanent, ravenous hunger.",
          "habitat": "It hides within the tall grasses and narrow gorges of the Sundrift Vale.",
          "combat": "685 HP. All-Mouth (passive: body is 80% jaw; its mouth spans the entire front). Pit-Trap (passive: buries itself in tall steppe-grass, opening its massive mouth to create pit-traps; the Ordan herds walk across solid ground — and plunge into the maw). Spiral-Teeth (melee, +7 to hit, 3d8+5 piercing — concentric rings of teeth designed to strip flesh from bone with maximum efficiency). Boq-Pack (passive: hunts cooperatively — three or four arrange themselves in a line across a migration-route, creating a wall of hidden pit-traps). No-Eyes (passive: hunts by smell and vibration; invisible to scrying and cannot be flanked). Camouflage (passive: hide is the same dead-yellow as steppe-grass; +10 to stealth in tall grass). Vulnerable to fire (fire reveals the buried mouths by burning away the grass — the Ordan's primary anti-Taotie tactic).",
          "stats": {
            "strength": 22,
            "agility": 12,
            "constitution": 20,
            "intelligence": 4,
            "spirit": 8,
            "charisma": 6,
            "maxHp": 685,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 25,
            "resistances": {
              "physical": 75,
              "cold": 25,
              "psychic": 25
            }
          },
          "depth": "Taoties bury themselves in the soil and open their mouths to form natural-looking pit-traps, swallowing entire sections of migrating Ordan herds. They hunt cooperatively in packs, lining up to create barriers of hidden maws, then emerging to run down the survivors with surprising speed. Nomads must set fire to the steppe-grass to reveal the buried mouths before the herd arrives. They frequently hire scouts to clear out the beasts before their herds pass through.",
          "hooks": [
            "A rumor spreads of a Taotie spotted near the area.",
            "Adventurers need a component from a Taotie to complete their quest."
          ],
          "description": "An insatiable, fifteen-foot monstrosity that is almost entirely jaws, blending into the high grass to act as a living pit-trap for migrating herds.",
          "heritage": "Rooted in Chinese bronze-mask myths, the Taotie represented the ultimate warning against gluttony, greed, and the selfish hoarding of community resources. The Wyrd anomaly reacted to the heavy excavations and strip-mining of Sundrift Vale, materializing this mawed fiend to physically devour everything in its path."
        },
        {
          "id": "baize",
          "name": "Baize",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/baize.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Baize",
          "role": "Bai Ze / Hakutaku",
          "origin": "The Baize is derived from the Chinese Bai Ze, who detailed the nature of all spirits to the Yellow Emperor, and the Ayaas, the speaking wise-beasts of Mongolian folklore. It serves as a guardian of knowledge, keeping the ledger of the world's supernatural fauna.",
          "nature": "Resembling a large, yak-sized bovine with a coat of luminous, snow-white fur, this creature bears a crown of six crystalline horns and nine multi-colored eyes scattered across its flanks and head. Its face is remarkably human, featuring a gentle, knowing smile and deep brown eyes filled with compassion. As it walks, its hooves leave glowing prints that outline safe paths, while its nine eyes glow softly to cast a prismatic halo around its body.",
          "habitat": "It wanders the remote ridges and sacred valleys of the Sundrift Vale.",
          "combat": "220 HP. Living-Bestiary (passive: knows every creature in the Vale, their habits, weaknesses, and significance; DC 14 Nature to ask it one creature-related question — it always answers accurately). Omen-Appear (passive: appears only before major events; the specific position of its nine eyes encodes the event's nature and severity). Nine-Eye-Gaze (ranged, each eye emits a different colored beam; +5 to hit, 1d6 of the eye's element). Safe-Passage-Prints (passive: hooves leave prints that glow faintly, marking safe-passage routes through dangerous terrain). Human-Face (passive: serene, knowing expression; +4 to Charisma checks). Vulnerable to psychic.",
          "stats": {
            "strength": 14,
            "agility": 12,
            "constitution": 14,
            "intelligence": 18,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 220,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "psychic": 100,
              "radiant": 50
            }
          },
          "depth": "The Baize acts as a living bestiary, speaking in a calm, measured voice to share its absolute knowledge of the Vale's creatures and their weaknesses. Its appearance is a rare omen that precedes major events like Wyrd-storms or shifts in the migration, with the alignment and colors of its blinking eyes serving as a complex divination system that shamans study. Nomads and scholars seek it out to decipher future trials or to obtain its guidance in navigating the dangerous ecosystem.",
          "hooks": [
            "A rumor spreads of a Baize spotted near the area.",
            "Adventurers need a component from a Baize to complete their quest."
          ],
          "description": "A wise, nine-eyed bovine oracle with a human face and a crown of horns, appearing as a herald of major shifts in the world.",
          "heritage": "Derived from the Chinese Bai Ze, the speaking wise-beast that detailed the nature of all spirits, this creature represented the hope of finding guidance. The Wyrd anomaly reacted to the scholars' desire to map the Wyrd-infested land, materializing this white-furred wise beast to share prophecies and map pathways."
        },
        {
          "id": "zilant_wing",
          "name": "Zilant",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/zilant_wing.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Zilant",
          "role": "Zilant",
          "origin": "The Zilant traces its ancestry to the winged serpent Zilant of Tatar lore, a guardian of cities, and the Teng dragon of Chinese myth that rides the clouds. In the Vale, it represents the protective aspect of the skies, patrolling the boundary between the living and the ancestral dead.",
          "nature": "This thirty-foot serpentine dragon is covered in golden-brown scales and propelled by forty-foot, leathery wings whose veins mimic Ordan throat-singing notation. It possesses a rooster-like head crowned with a crimson comb and wattles, with a sharp beak lined with bony plates instead of teeth. Its golden, round eyes burn with a predatory, avian focus tempered by a cold, reptilian intelligence.",
          "habitat": "It spends its life riding the high winds of the Sundrift Vale, nesting on the summits of the Ancestor-Mounds.",
          "combat": "170 HP. Wing-Song (passive: wind through wing-veins produces a resonant singing tone; unique pitch per territory allows navigation by ear even under the starless sky). Rooster-Crest (passive: deep crimson crest; +2 to Intimidation checks). Beak-Slam (melee, +5 to hit, 2d6+3 piercing). Forked-Tongue (passive: forked tongue tastes the air for 200 ft; can detect all creatures within range). Thermal-Ride (can ride thermal currents above the steppe, never landing except to nest in Ancestor-Mounds). Vulnerable to cold.",
          "stats": {
            "strength": 16,
            "agility": 18,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 170,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 20,
            "resistances": {
              "fire": 50
            }
          },
          "depth": "As the Zilant glides on thermal currents, the wind rushing through its wings generates a unique, singing pitch that Ordan nomads use to navigate the darkened plains. They are revered as guardians of the Ancestor-Mounds, keeping grave-robbers and Wyrd-rot at bay and ensuring that no dead rise as Jiangshi. A Zilant nesting on a clan's mound is seen as the ultimate sign of ancestral favor, and their presence serves as a deterrent to rival raiders and predatory Qiongqi.",
          "hooks": [
            "A rumor spreads of a Zilant spotted near the area.",
            "Adventurers need a component from a Zilant to complete their quest."
          ],
          "description": "A massive, winged serpent-dragon with a rooster's head, whose wings hum with a musical resonance that guides travelers through the starless nights.",
          "heritage": "Spun from Zilant winged serpent myths, this creature was a protective city guardian representing the sky's dominance over the land. The Wyrd anomaly consolidated the settlers' desire for security around excavation sites, materializing these winged serpents to guard the high valleys."
        },
        {
          "id": "susulu_spring",
          "name": "Susulu",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/susulu_spring.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Susulu",
          "role": "Su Iyeleri / WaterSpirits",
          "origin": "The Susulu is born of the Su Iyeleri, the protective female water-spirits of Turkic folklore, and Longmu, the Chinese mother of dragons. She represents the nurturing and defensive aspects of water, guarding the lifeblood of the arid steppe.",
          "nature": "Appearing as a seven-foot-tall woman composed of semi-transparent, blue-green water, she wears a gown of woven river-weeds and duck feathers. Her hair flows outward like a continuous fountain, and tiny, golden-green dragon-shapes swim through her fluid limbs. Her face is usually a portrait of motherly warmth, with sandy-colored eyes and round cheeks, though it hardens into the slate-grey of a flash flood when her waters are threatened.",
          "habitat": "She is bound to the oases, deep wells, and freshwater springs of the Sundrift Vale.",
          "combat": "145 HP. Bull-Horn (melee, +5 to hit, 2d6+4 piercing). Own-Voice (passive: speaks in the target's own voice, revealing secrets the target knows — DC 14 SPI or charmed for 1 round). Shadow-Stalk (passive: cannot be detected by conventional means — only a creature speaking its true name can force it to manifest). Vulnerable to radiant.",
          "stats": {
            "strength": 14,
            "agility": 14,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 145,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "physical": 50,
              "cold": 50
            }
          },
          "depth": "A Susulu ensures the purity and abundance of her water source, raising tiny dragons that swim through the aquifers to filter out toxins. The Ordan nomads bring their sick to her waters for healing, exchanging milk and silk for the life-extending liquid she guards. Harming her spring or polluting its waters invites a devastating curse of drought and disease, making the preservation of these sites a vital duty for travelers.",
          "hooks": [
            "A rumor spreads of a Susulu spotted near the area.",
            "Adventurers need a component from a Susulu to complete their quest."
          ],
          "description": "A translucent, seven-foot-tall water spirit who guards the rare springs of the steppe and fosters tiny, purifying river-dragons.",
          "heritage": "Born from Turkic water-spirit legends of the Su Iyeleri, the Susulu represented the hope of finding pure, life-giving springs in the arid steppe. The Wyrd anomaly reacted to the excavators' resource anxiety and extreme thirst, materializing these aquatic dragon-women to guard geothermal springs."
        },
        {
          "id": "dijiang_chaos",
          "name": "Dijiang",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/dijiang_chaos.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Dijiang",
          "role": "Dijiang",
          "origin": "The Dijiang represents the primordial state of creation, drawing from the faceless, singing bag-spirit Dijiang of Chinese myth and the Bura, the wild, chaotic force of the Turkic steppes. It is a creature of raw, ungoverned natural law that exists outside conventional anatomy.",
          "nature": "This entity is a six-foot-wide crimson sac of warm, smooth tissue resembling exposed muscle, with six stubby legs and four membranous wings that beat in a steady hum. It has no head, face, or sensory organs, yet it is fully aware and communicative, dancing in complex mathematical patterns that leave geometric trails in the steppe-grass. Its lack of features is its most alien aspect, yet it projects a peaceful, throat-singing resonance.",
          "habitat": "It wanders the windswept plains and valleys of the Sundrift Vale, seeking areas recently scarred by storms or violence.",
          "combat": "265 HP. Lightning-Serpent (special: mounts a horseback cavalry charge; each rider carries a bolt of compressed lightning). Chain-Serpent (melee, +6 to hit, 2d8+4 lightning). Cavalry-Charge (passive: moves as a unit; each rider has a 30-ft charge bonus). Steppe-Storm (AoE 30 ft, DC 14 CON or 2d6 lightning + stunned 1 round). Vulnerable to cold.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 16,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 265,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 40,
            "resistances": {
              "lightning": 100,
              "fire": 25
            }
          },
          "depth": "Drawn to sites of recent chaos—such as ruined camps or Wyrd-shattered lands—the Dijiang feeds on the residual energy of disorder before dancing to weave stabilizing runes into the ground. Its multi-tonal, harmonious song induces ego-dissolution in listeners, connecting them to the deep ecology of the steppe. Ordan shamans seek out these creatures to sit in their presence for spiritual visions, though their strange nature makes them a source of both wonder and alarm for travelers.",
          "hooks": [
            "A rumor spreads of a Dijiang spotted near the area.",
            "Adventurers need a component from a Dijiang to complete their quest."
          ],
          "description": "A faceless, crimson sac with six legs and four wings that sings in beautiful harmonies, feeding on chaos to restore order to the land.",
          "heritage": "Derived from Chinese myths of the faceless, singing bag-spirit Dijiang, this creature represented the primordial chaos before creation. The Wyrd anomaly reacted to the miners' and travelers' spatial disorientation inside ancient ruins, materializing this faceless bag-spirit to distort sounds and paths."
        },
        {
          "id": "fenghuang_migrate",
          "name": "Fenghuang",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/fenghuang_migrate.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Fenghuang",
          "role": "Fenghuang",
          "origin": "The Fenghuang merges the virtues of the Chinese phoenix Fenghuang, which heralds cosmic harmony, with the Mongolian Khongorzul sun-bird that flies ahead of the changing seasons. It serves as a living standard of moral and environmental balance, appearing only when the world is in alignment.",
          "nature": "This magnificent bird boasts a twenty-foot wingspan covered in elemental, color-banded feathers and a twelve-foot cascade of iridescent tail plumage. Its crest is a crown of cold, golden flame, and its noble face features a jade beak and prismatic, multi-colored eyes that project absolute serenity. When it takes flight, the air around it is perfumed with the scent of fresh rain, pine resin, and sweet steppe-grass.",
          "habitat": "It nests on the highest mountain peaks and flies across the skies of the Sundrift Vale.",
          "combat": "160 HP. Coin-Swarm (special: skeletal army summoned from ancient coins; each coin animates a small bone-soldier). Bone-Rattle (AoE 20 ft, DC 13 SPI or frightened 1 round). Coin-Treasure (passive: coins used to summon the army are scattered when the Gu-Hon is defeated — a small fortune). Vulnerable to radiant.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 160,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "physical": 50,
              "cold": 50
            }
          },
          "depth": "The Fenghuang is an infallible harbinger of seasonal change, guiding the Ordan nomads' migrations as it travels. It only lands in settlements where perfect harmony and respect for elders are maintained, validating the clan's leadership and shedding a single feather capable of purifying water, curing illness, and warding off Wyrd-rot. Because these feathers are of immense spiritual and practical value, they are fiercely guarded, occasionally sparking conflicts between clans desperate for their blessing.",
          "hooks": [
            "A rumor spreads of a Fenghuang spotted near the area.",
            "Adventurers need a component from a Fenghuang to complete their quest."
          ],
          "description": "A legendary, twenty-foot bird of elemental plumage whose arrival dictates the migration calendar and blesses harmonious communities.",
          "heritage": "Derived from Chinese phoenix legends, the Fenghuang was a symbol of cosmic harmony and the hope of the land's eventual healing. The Wyrd anomaly reacted to the settlers' prayers for the end of the Dimming, materializing this radiant sun-bird to guide migrations and warm the cold nights."
        },
        {
          "id": "qiongqi_scourge",
          "name": "Qiongqi",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/qiongqi_scourge.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Qiongqi",
          "role": "Qiongqi",
          "origin": "The Qiongqi combines the Chinese fiend Qiongqi, which inverts human justice, with the Dalan-Turul, a horse-devouring raptor of Turkic creation myth. It represents the cruel caprice of the sky and the spiritual corruption that targets the innocent.",
          "nature": "This lion-sized beast is a grotesque fusion of tiger and eagle, featuring tattered, leathery wings and coarse fur the color of dried blood. Its body is covered in stripes that are actually thick battle scars, and a rattle of human finger-bones hangs around its neck. Its face is a malicious caricature of a tiger, split by a massive mouth, narrowed sulfur-yellow eyes, and curved, yellowed tusks that frame its flat snout.",
          "habitat": "It stalks the skies and rugged crags of the Sundrift Vale.",
          "combat": "75 HP. Bone-Vulture (passive: monitors steppe justice; if a killing is unjust, it descends). Vigilante-Peck (melee, +4 to hit, 1d6+2 piercing). Fearful-Sight (passive: its presence indicates a wrong has been committed; DC 12 SPI or guilt-shaken for 1 round). Vulnerable to fire.",
          "stats": {
            "strength": 8,
            "agility": 18,
            "constitution": 10,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 8,
            "maxHp": 75,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 10,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "Drawn to the moral state of mortals, the Qiongqi actively harasses honest, industrious camps while leaving raiders and oath-breakers unmolested, forcing the Ordan to feign dishonesty for survival. It swoops down from the clouds to carry off prize stallions, devastating the nomads' herds. The only reliable defense against its cruelty is the territorial presence of a Zilant, which will drive the beast away, though adventurers are often contracted to hunt it down to save a targeted community.",
          "hooks": [
            "A rumor spreads of a Qiongqi spotted near the area.",
            "Adventurers need a component from a Qiongqi to complete their quest."
          ],
          "description": "A tattered, blood-furred winged tiger with boar tusks that preys upon the virtuous while protecting the wicked.",
          "heritage": "Rooted in Chinese myths of the fiend that inverts justice, the Qiongqi was a moral warning against betraying friends and rewarding evil. The Wyrd anomaly reacted to the clan rivalries and greed of gold-seekers in Sundrift Vale, materializing this horse-devouring beast to execute local leaders."
        },
        {
          "id": "zhenniao_toxin",
          "name": "Zhenniao",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/zhenniao_toxin.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Zhenniao",
          "role": "Zhenniao",
          "origin": "The Zhenniao derives from the legendary Chinese poison-bird Zhenniao, whose very bathwaters brought death, and Umai, the Turkic death-spirit associated with silent, wind-borne venom. It embodies the invisible, creeping death that haunts the steppe.",
          "nature": "This vulture-like bird has an eight-foot wingspan of iridescent, purple-black feathers coated in a glistening, toxic oil that creates a dim purple haze in the air. Its massive, hooked beak drips a corrosive fluid that hisses upon contact with stone, and its talons burn scorch marks into rock. Its nightmarish face is dominated by spiny feathers and solid, featureless black eyes that constantly weep a thick purple venom.",
          "habitat": "It nests in isolated rocky spires and crags across the Sundrift Vale.",
          "combat": "135 HP. Shape-Shift (1 AP: shifts between stallion, old man, and pure wind). Wind-Ride (passive: can carry one willing creature across the steppe at double speed for 1 hour). Breath-Steal (melee, +5 to hit, 2d6+3 psychic — steals a breath, DC 14 CON or suffocating for 1 round). Vulnerable to cold.",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 135,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "physical": 50,
              "cold": 25
            }
          },
          "depth": "The nesting sites of the Zhenniao are marked by withered, purple-tinged grass and poisoned soil where no animal can drink or graze. Nomads harvest the bird's toxic tears and feathers using heavy leather protective suits, distilling them into lethal poisons that serve as both deterrents and tools in inter-clan blood feuds. While they are an ecological blight, the value of their venom makes them a lucrative, if incredibly hazardous, target for daring trackers.",
          "hooks": [
            "A rumor spreads of a Zhenniao spotted near the area.",
            "Adventurers need a component from a Zhenniao to complete their quest."
          ],
          "description": "A toxic vulture-like bird whose oil-slick feathers and acidic tears rot the land, creating sterile dead-zones wherever it nests.",
          "heritage": "Born from Chinese poison-bird legends, the Zhenniao represented the fear of hidden poisons and contaminated drinking wells. The Wyrd anomaly consolidated the settlers' panic over water safety near geothermal siphons, materializing this toxic bird to pollute the springs and guard its nest."
        },
        {
          "id": "ubagan_crystal",
          "name": "Ubagan",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/ubagan_crystal.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ubagan",
          "role": "Ubagan",
          "origin": "The Ubagan draws its roots from the Ubagan subterranean spirits of Turkic lore and Wuzhiqi, the stone-headed water demon of Chinese legend. It represents the ancient geological secrets and the raw tectonic power hidden beneath the grass.",
          "nature": "This ten-foot-tall, four-armed ape-like creature is formed entirely of translucent crystal, exposing pulsing, mineral-rich veins within its core. Its body refracts light into brilliant rainbow spectrums, while its small, stone-like head resembles a carved gem. Its face features twin points of glowing Astril-light for eyes and a narrow seam that serves as a mouth, while its four hands end in chisel-like fingers capable of molding stone.",
          "habitat": "It resides in deep cave systems and subterranean fissures beneath the Sundrift Vale.",
          "combat": "160 HP. Mud-Burrow (can submerge into mud for 1 AP, gaining full cover). Water-Breaker (special: can break underground water-channels, redirecting entire aquifers; an angry Ubagan can destroy a clan's water-supply). Crystal-Vibration (special: shamans negotiate with Ubagan through crystal-vibration rituals, trading rare minerals for water-access guarantees). Mud-Grasp (melee, +5 to hit, 2d6+3 bludgeoning + DC 13 AGI or grappled). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 12,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 6,
            "maxHp": 160,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "cold": 50,
              "physical": 25
            }
          },
          "depth": "Drawn to the surface by the Monolith's resonance and the constellation-light of the Astril, the Ubagan is capable of rearranging underground water-channels, which can either secure a clan's water supply or dry up their wells overnight. Nomads use crystal-vibration rituals to communicate with them, offering rare gems to ensure the safety of their springs. Adventurers are often hired to negotiate with these tectonic giants or retrieve shards of their bodies to study their geological magic.",
          "hooks": [
            "A rumor spreads of a Ubagan spotted near the area.",
            "Adventurers need a component from a Ubagan to complete their quest."
          ],
          "description": "A towering, four-armed ape of living crystal that emerges from subterranean fissures, capable of shifting aquifers and refracting brilliant spectrums of light.",
          "heritage": "Spun from Turkic subterranean water-demon myths, the Ubagan represented the fear of volcanic boiling mud and subterranean collapses. The Wyrd anomaly reacted to the miners' fear of steam geysers in deep quarries, materializing this stone-headed water demon to guard volcanic crystals."
        },
        {
          "id": "qoraigarash",
          "name": "Qoraigarash",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/qoraigarash.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Qoraigarash",
          "role": "Khyargas SeaMonster",
          "origin": "The Qoraigarash traces its origin to the Khyargas sea-monster of Mongolian folklore and the storm-generating Jiaolong water-dragon of China. It embodies the deep, unpredictable treasures and dangers of the steppe's subterranean water networks.",
          "nature": "This forty-foot serpentine dragon is covered in interlocking scales of jade, agate, carnelian, and turquoise, reflecting even the faintest light in a shimmering, rainbow pattern. It has a liquid crystal mane, antlers of polished white jade, and massive eyes like polished jade spheres that pierce the dark. Its elegant, ancient face and beard of thin crystalline filaments carry the quiet majesty of a creature that has witnessed millennia of history.",
          "habitat": "It dwells in the bottomless lakes and flooded cavern systems of the Sundrift Vale.",
          "combat": "390 HP. Gemstone-Scales (passive: covered in semi-precious stones — jade, agate, carnelian, turquoise; shed annually, collecting on lake-beds in glittering deposits). Copper-Mirror-Fascination (special: fascinated by polished copper mirrors; lowers its HP by 20 for each round it stares at a mirror; this is the only known bargaining technique). Storm-Raise (special: coils through lake, creating whirlpools that drain marshland and generate localized storms; can flood an entire valley or drain a lake in hours). Dragon-Bite (melee, +6 to hit, 2d8+5 piercing). Liquid-Crystal-Mane (passive: flows like fiber-optic cable, refracting light into rainbows). Vulnerable to cold.",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 18,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 390,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "fire": 50,
              "cold": 50,
              "lightning": 50
            }
          },
          "depth": "The Qoraigarash sheds its precious gemstone-scales annually, prompting desperate Ordan divers to search the freezing lake beds to collect them for trade. When disturbed, it coils through the waters to create massive whirlpools that can drain surrounding marshes or trigger localized flash floods and storms. Nomads lower polished copper mirrors into the depths as offerings to soothe the dragon, while hunters seek them out for their legendary treasures or to avert aquatic disasters.",
          "hooks": [
            "A rumor spreads of a Qoraigarash spotted near the area.",
            "Adventurers need a component from a Qoraigarash to complete their quest."
          ],
          "description": "A forty-foot aquatic dragon covered in semi-precious stones, guarding the bottomless lakes and rising to summon fierce storms.",
          "heritage": "Derived from Mongolian sea-monster legends, the Qoraigarash represented the fear of treacherous underwater predators in deep salt lakes. The Wyrd anomaly reacted to the fishers' survival panic during sudden storms, materializing this water-dragon to crush boats and swallow catches."
        },
        {
          "id": "ajina",
          "name": "Ajina",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/ajina.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Ajina",
          "role": "Ajina / Albasti",
          "origin": "The Ajina is born of the hairy, traveler-hunting Albasti demon of Central Asian folklore combined with Hundun, the faceless Chinese embodiment of primordial chaos. She represents the terror of the dark, formless void that waits beyond the boundary of the campfire.",
          "nature": "This eight-foot-tall, towering figure is composed of light-absorbing darkness that seems perpetually on the verge of dissolution. Long shadow-appendages resembling pendulous breasts drape down, whispering in multiple soft voices, while her hair is a spreading pool of living darkness that decays the grass it touches. Her face shifts constantly between a beautiful woman, a bare skull, and an empty void, anchored only by twin eyes of absolute, gravity-like darkness.",
          "habitat": "She haunts the deepest, tallest grass fields and unlit hollows of the Sundrift Vale.",
          "combat": "380 HP. Shadow-Stalker (passive: perpetually half-dissolved into shadow; absorbs light rather than reflecting it; invisible in darkness). Independent-Mouths (passive: long, pendulous breasts trail to her knees, each ending in a mouth-like orifice that whispers independently — DC 13 SPI or confused 1 round). Living-Shadow (passive: her hair spreads across the ground as living shadow, darkening the grass it touches). Entropy-Wounds (melee, +6 to hit, 2d6+3 necrotic — wounds fester with entropy, dealing 1d6 necrotic per round for 3 rounds). Astril-Immunity (passive: cannot harm the Astril Unlit — those born without constellation-light; the Ajina cannot steal light they do not carry). Vulnerable to radiant (radiant damage forces her to fully materialize, losing her shadow-form for 1 round).",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 380,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "physical": 75,
              "cold": 50,
              "psychic": 50
            }
          },
          "depth": "Stalking the high steppe-grass, the Ajina strikes from the darkness with entropic claws that leave slow-festering wounds, dissolving back into shadow before she can be targeted. Survivors of her attacks are cursed with permanent, sanity-draining nightmares of the pre-cosmic void, though the Astril Unlit remain immune due to their lack of light. Travelers must take great care when traversing the high grasses, often hiring guides who know how to detect her whispering approach.",
          "hooks": [
            "A rumor spreads of a Ajina spotted near the area.",
            "Adventurers need a component from a Ajina to complete their quest."
          ],
          "description": "A towering entity of living shadow and absolute darkness that stalks the high steppe-grass, sowing nightmares and rot.",
          "heritage": "Spun from Central Asian Albasti demon myths, the Ajina was a warning story to keep travelers close to caravan routes and avoid night journeys. The Wyrd anomaly consolidated the fear of spatial isolation and faceless ghosts, materializing this hairy traveler-hunter to stalk caravans."
        },
        {
          "id": "lu_wu_mountain",
          "name": "Lu Wu",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/lu_wu_mountain.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Lu Wu",
          "role": "Lu Wu",
          "origin": "The Lu Wu combines the Chinese mountain-guardian Lu Wu of the Kunlun range with Kerey-Khan, the sovereign mountain spirit-lord of Mongolian myth. It represents the absolute authority of the peaks and the delicate balance of the seasons.",
          "nature": "This mammoth-sized beast features the amber-striped body of a great tiger, a thick serpent tail covered in chiming crystalline scales, and nine human heads clustered along its neck. Each head displays a distinct expression of human emotion—ranging from serene to furious, weeping to silent—symbolizing the nine aspects of mountain awareness. The primary central head is that of a white-bearded elder whose eyes burn with the light of molten gold.",
          "habitat": "It dwells in the highest, snow-draped peaks and rocky valleys of the Sundrift Vale.",
          "combat": "835 HP. Nine-Heads (passive: each head has a different expression — serene, angry, laughing, weeping, sleeping, watching, speaking, listening, silent — representing nine aspects of mountain-consciousness). Season-Controller (passive: by turning a specific head toward a region, it can bring rain, drought, wind, calm, snow, heat, frost, growth, or decay; each head controls one micro-season). Tiger-Claw (melee, +8 to hit, 3d8+6 bludgeoning). Serpent-Tail (melee, reach 15 ft, +6 to hit, 2d6+4 bludgeoning + DC 15 CON or poisoned 3 rounds). Game-Lord (passive: controls steppe animal-populations; if angered, turns a destructive head toward the offending clan, causing herds to bypass their territory — a death sentence by starvation). Multiple-Faces (passive: different ages, genders, expressions; all share the same bone-structure — nine aspects of a single entity). Vulnerable to radiant (radiant damage affects one head at a time; each head must be individually targeted to defeat the creature).",
          "stats": {
            "strength": 22,
            "agility": 10,
            "constitution": 22,
            "intelligence": 18,
            "spirit": 20,
            "charisma": 14,
            "maxHp": 835,
            "maxMana": 80,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "physical": 75,
              "cold": 100,
              "fire": 50
            }
          },
          "depth": "By turning its various heads toward the valleys, the Lu Wu governs the micro-seasons of the Vale, dictating patterns of rain, wind, heat, or frost. It also holds dominion over the migrations of the great woolly herds, steering them away from clans that offend the land or overhunt. The Ordan appease this mighty arbiter through complex throat-sung hymns, and they will go to great lengths to prevent hunters from provoking the beast's wrath.",
          "hooks": [
            "A rumor spreads of a Lu Wu spotted near the area.",
            "Adventurers need a component from a Lu Wu to complete their quest."
          ],
          "description": "A mammoth-sized tiger with nine human heads and a serpent's tail, governing the seasons and the migrations of the steppe.",
          "heritage": "Derived from Chinese mountain-guardian myths of the Kunlun range, the Lu Wu represented the sovereign authority of the high peaks. The Wyrd anomaly reacted to the miners' fear of tectonic shifts and avalanches, materializing this tiger-bodied guardian to watch over the excavation bridges."
        },
        {
          "id": "bura_stormkin",
          "name": "Bura",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/bura_stormkin.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Bura",
          "role": "Bura / SteppeWind",
          "origin": "The Bura is the physical embodiment of the flesh-stripping steppe-winds of Turkic folklore and Feng Bo, the Chinese wind deity who delivers heavenly retribution. Twisted by the Wyrd, it serves as a relentless enforcer of mortal integrity and natural fury.",
          "nature": "Standing seven feet tall, this humanoid presence is composed entirely of compressed, spinning air and windswept debris like dead grass and pebbles. Its only solid part is a central, electric-blue heart of compressed air. Its face forms and dissolves constantly within the dust, hardening into the hollow-cheeked visage of an old man with eyes that are screaming circles of rushing air when it targets its prey.",
          "habitat": "It manifests during the fierce storms that sweep across the Sundrift Vale.",
          "combat": "145 HP. Wind-Warrior (passive: manifests during violent wind-storms, riding gales like cavalry). Shelter-Disassembly (special: targets structures — yurts, poles, shelters — dismantling them with surgical precision; can disassemble a yurt in 30 seconds). Oath-Enforcer (passive: drawn to broken promises; follows the oath-breaker across the steppe, dismantling every shelter they build until the oath is fulfilled or the oath-breaker dies). Wind-Body (passive: no solid body — it is a living tornado, vaguely humanoid; immune to piercing and slashing). Dust-Face (passive: face forms from wind and dust; when focused on a target, dust compresses into a recognizable face: an old man with screaming O-eyes). Core-Sphere (passive: at its core, a single pulsing sphere of compressed air glows with electric-blue light; this is its heart — destroy the sphere and the storm dies). Vulnerable to radiant.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 14,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 145,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "physical": 100,
              "cold": 50,
              "lightning": 50
            }
          },
          "depth": "Bura ride the steppe gales, dismantling yurts and shelters with surgical precision to leave victims exposed to the elements. They are drawn to the spiritual rot of broken promises, relentlessly pursuing oath-breakers across the plains until their word is fulfilled or they perish of exposure. Nomads must dig underground shelters to escape their wrath, and they will hire adventurers to appease or defeat these spirits when an oath-breaking crisis threatens the community.",
          "hooks": [
            "A rumor spreads of a Bura spotted near the area.",
            "Adventurers need a component from a Bura to complete their quest."
          ],
          "description": "A seven-foot-tall spirit of swirling dust and wind, drawn to broken oaths and capable of tearing down shelters with terrifying speed.",
          "heritage": "Derived from Turkic wind-spirit myths, the Bura represented the personification of the violent, flesh-stripping windstorms that swept the steppe. The Wyrd anomaly captured the extreme survival panic of travelers facing sandstorms, materializing this storm spirit to blow caravans off paths."
        },
        {
          "id": "tengri_spark",
          "name": "Tengri",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/tengri_spark.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Tengri",
          "role": "Tengri / Eternal Sky",
          "origin": "The Tengri is a physical shard of the supreme Mongolian sky-god Tengri, combined with the fate-weaving authority of Dou Mu, the Chinese Mother of the Dipper. It represents the last remaining light of a sky that has been bargained away.",
          "nature": "This tiny, six-inch humanoid figure is composed of pure starlight, glowing with a warm, golden-white brilliance that can be seen across the dark steppe. Its body is formed from nine interlocking rings of light representing the stars of the Big Dipper, trailing a fine, silk-like thread from its back. Its featureless, glowing face is locked in a serene expression of absolute compassion and peace.",
          "habitat": "It wanders the vast, dark grasslands of the Sundrift Vale, appearing unpredictably.",
          "combat": "130 HP. Star-Light (passive: glows with warm golden-white luminescence visible from across the steppe — the only reliable source of light in the starless sky). Hope-Restore (special: those bathed in its glow recover their will to survive, their determination, and their sense of cosmic purpose; DC 12 SPI or gain +2 to all saves and 10 temporary HP for 24 hours). Fate-Thread (passive: a faint silk-thread trails from its back, connecting it to the absent stars; by following the thread's direction (which changes based on the observer's fate), a shaman can determine which constellation the thread connects to, and from that, divine the observer's destiny). Nine-Ring-Body (passive: body composed of nine interlocking rings of light, each corresponding to one of the nine stars of the Big Dipper). Meditative-Presence (passive: its face is serene, eyes closed; radiates cosmic peace and authority). Vulnerable to necrotic (necrotic damage dims its light temporarily, reducing all its effects by 50% for 1 round per damage dealt).",
          "stats": {
            "strength": 2,
            "agility": 20,
            "constitution": 6,
            "intelligence": 16,
            "spirit": 22,
            "charisma": 20,
            "maxHp": 130,
            "maxMana": 60,
            "maxActionPoints": 3,
            "speed": 10,
            "resistances": {
              "radiant": 100,
              "psychic": 100,
              "fire": 50
            }
          },
          "depth": "As a living fragment of the lost heavens, the Tengri appears to travelers in moments of utter despair, its light restoring hope and the will to live. The trailing thread connects it directly to the constellations that House Ordavan traded away, allowing shamans to read the alignment of the thread to divine destinies. The Astril hold these sparks in absolute reverence, defending them from any who would capture them or seek to exploit their celestial connection.",
          "hooks": [
            "A rumor spreads of a Tengri spotted near the area.",
            "Adventurers need a component from a Tengri to complete their quest."
          ],
          "description": "A tiny, six-inch guide of pure starlight, trailing a thread of fate that connects the world below to the lost stars.",
          "heritage": "Rooted in Mongolian sky-god beliefs, the Tengri was a symbol of cosmic destiny and the supreme authority of the sky. The Wyrd anomaly reacted to the shamans' and leaders' prayers for safe passage under the dark skies, materializing these glowing shards of fate to guide the caravans."
        }
      ]
    },
    {
      "id": "bryngloom",
      "name": "The Bryngloom Forest",
      "folklore": "Slavic/Carpathian + Hindu/Vedic",
      "creatures": [
        {
          "id": "vila",
          "name": "Vila",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/vila.png",
          "illustrationCaption": "A Vila wind-nymph dancing in a fairy ring under the moon, her hair trailing like mist",
          "role": "The wind-dancing nymph",
          "origin": "The Vila is a creature of the wind and the forest, born from the Slavic legends of the forest and mountain nymphs that dance in rings and control storm-winds. In the Bryngloom Forest, where the trees are ancient and the wind is strong, the Vilas are the guardians of the old growth, creatures that have been blessed by the Wyrd with a power that is both beautiful and terrible. The Wyrd's corruption did not change their nature, but it did make them more fierce, for the creature now sees all who enter its forest as a potential threat, and it will attack any who come near its trees. The woodcutters of the Bryngloom Forest know the signs of a Vila's presence—a wind that blows from nowhere, and the sound of a woman's song in the trees.",
          "nature": "An ethereal, beautiful humanoid sprite with long, floating pale-green hair and a dress of woven willow leaves. She moves by floating above the ground and is often surrounded by a swirling draft of autumn leaves. She is generally peaceful but fierce if her forest is harmed. The Vila is a creature of the wind, and she is most active during the spring, when the leaves are new and the air is filled with the sound of birds. The creature's hair is said to be made of the same material as the wind, and her dress is a living thing that changes with the seasons.",
          "habitat": "The Vila inhabits the fairy rings, ancient willow groves, and misty clearings of the Bryngloom Forest, particularly in the Willow-Ring Grove where the trees are oldest and the wind is strongest. She is most active during the spring, when the leaves are new and the air is filled with the sound of birds, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Vila's nest is always in the trees, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "155 HP. Whirlwind (ranged, DC 13 AGI save or knocked back 20 ft and taking 2d6 physical damage). Falcon Shift (1 AP, turns into a falcon to gain fly speed 50). Sleep Song (AoE, DC 13 SPI save or sleep for 1 round). Vulnerable to iron.",
          "stats": {
            "strength": 8,
            "agility": 18,
            "constitution": 10,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 155,
            "maxMana": 50,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "wyrd": 50
            }
          },
          "depth": "Ethereal guardians of the old growth. They will aid lost travelers who speak respectfully but will curse those who hunt for sport or cut healthy timber. The Vila's willow-leaf dress is a mystery to scholars, for it is made of a material that does not exist in any known catalog, and some believe that the creature's dress is a natural adaptation, a living camouflage that allows her to blend in with the forest.",
          "hooks": [
            "A group of travelers wandered into a Vila's dancing circle and fell into a deep sleep. Find a way to wake them before the Vila returns.",
            "A Vila's sacred willow tree has been poisoned by runoff from a Neth mining camp. Find a cure to pacify her wrath."
          ],
          "heritage": "Rooted in Slavic legends of forest and mountain nymphs, the Vila originally served to explain sudden, violent storms and whirlwinds, warning travelers against entering remote circles in the woods. The Wyrd anomaly reacted to the local rangers' encounters in Bryngloom, materializing these wind-dancing spirits to control the forest gales."
        },
        {
          "id": "vodyan",
          "name": "Vodyan",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/vodyan.png",
          "illustrationCaption": "A Vodyan pool-sprite lurking in stagnant peat-water, only its green eyes visible",
          "role": "The swamp-pool sprite",
          "origin": "The Vodyan is a creature of the water and the mud, born from the Slavic legends of the grumpy swamp and pool water spirits. In the Bryngloom Forest, where the water is stagnant and the mud is deep, the Vodyans are the guardians of the pools, creatures that have been twisted by the Wyrd into something that is both grumpy and territorial. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its pool as a potential threat, and it will attack any who come near its water. The villagers of the Bryngloom Forest know the signs of a Vodyan's presence—a pool that is too still, and the smell of sulfur in the air.",
          "nature": "A hunched, green-skinned pool sprite made of wet peat-mud and gnarled wood, wearing a cloak of hanging moss and weeds. It has bulbous eyes and webbed hands, and it speaks in a wet, bubbling gurgle that is difficult to understand. The creature is grumpy and territorial, but it possesses deep knowledge of swamp remedies and will trade with travelers who show respect. The Vodyan is a creature of the water, and it is most active during the spring, when the rain is heavy and the pools are full.",
          "habitat": "The Vodyan inhabits the stagnant peat-pools, deep bogs, and mossy swamp wells of the Bryngloom Forest, particularly in the Mud-Deep Bog where the water is darkest and the mud is deepest. It is most active during the spring, when the rain is heavy and the pools are full, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Vodyan's nest is always beneath the water, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "220 HP. Bog Curse (ranged, DC 13 SPI save or target's speed is halved and they take 1d6 rime damage per round for 3 rounds). Moss Remedy (heals self or ally for 2d8+4 HP). Swamp Fog (creates a 20-ft radius of thick mist, obscuring all targets). Vulnerable to primal.",
          "stats": {
            "strength": 10,
            "agility": 12,
            "constitution": 14,
            "intelligence": 16,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "blight": 100
            }
          },
          "depth": "Reclusive and territorial, but will trade remedies with travelers who show respect and present rare mosses or swamp secrets. The Vodyan's moss-cloak is a mystery to scholars, for it is made of a moss that does not exist in any known catalog, and some believe that the creature's cloak is a natural adaptation, a living camouflage that allows it to blend in with the swamp.",
          "hooks": [
            "A Vodyan has captured a Neth miner who tried to harvest peat-stone from its pool. The Neth want him rescued, but the Vodyan demands a contract-secret as ransom.",
            "The party needs a specific moss remedy that only grows in a Vodyan's pool to cure a local swamp-rot sickness. Trade a secret to earn it."
          ],
          "heritage": "Born from Slavic legends of grumpy water-spirits, the Vodyan was a warning myth to explain drownings and warn villagers against swimming in swampy ponds at night. The Wyrd anomaly reacted to the peat-marsh drainage and mud excavations, materializing this grumpy, mud-hided sprite to drag trespassers under."
        },
        {
          "id": "bukavac",
          "name": "Bukavac",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/bukavac.png",
          "illustrationCaption": "A Bukavac swamp screamer rising from the mud, its six clawed limbs extended",
          "role": "The six-legged swamp screamer",
          "origin": "The Bukavac is a creature of the swamp and the scream, born from the Slavic legends of the horned swamp monsters that strangle people and animals. In the Bryngloom Forest, where the water is stagnant and the mud is deep, the Bukavacs are the apex predators of the swamp, creatures that have been twisted by the Wyrd into something that is both terrifying and cunning. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its swamp as prey, and it will attack any who come near its lair. The villagers of the Bryngloom Forest know the signs of a Bukavac's presence—a scream that echoes through the swamp, and the absence of any other life.",
          "nature": "A large, six-legged reptilian beast with a body covered in slime-glistening black scales, long curved horns, and webbed claws. The creature remains submerged in mud, and rises to emit a deafening scream that disorients prey before dragging them down. The Bukavac is a thing of terrible hunger, and its scream is loud enough to shatter eardrums. The creature is a creature of the swamp, and it is most active during the night, when the water is dark and the prey is sleeping.",
          "habitat": "The Bukavac inhabits the peat-pools, swamp channels, and stagnant marshlands of the Bryngloom Forest, particularly in the Scream-Deep Marsh where the water is darkest and the mud is deepest. It is most active during the night, when the water is dark and the prey is sleeping, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Bukavac's lair is always beneath the mud, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "420 HP. Deafening Screech (AoE, DC 14 SPI save or deafened and stunned for 1 round). Six-Claw Grasp (melee, +6 to hit, DC 14 AGI save or grappled and restrained). Mud Drag (moves at full speed in mud, pulling grappled targets down). Vulnerable to ember.",
          "stats": {
            "strength": 18,
            "agility": 12,
            "constitution": 16,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 4,
            "maxHp": 420,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 25,
            "resistances": {
              "rime": 50,
              "blight": 50
            }
          },
          "depth": "Savage, ambush predators of the deep bogs. They hide beneath the stagnant peat-water, emitting a scream that sounds like a drowning child to lure prey close. The Bukavac's scream is a mystery to scholars, for it is louder than any known animal, and some believe that the creature's scream is a natural weapon, a living sound that can stun prey from a distance.",
          "hooks": [
            "A Bukavac has made its lair under the only wooden bridge crossing the peat-river, completely cutting off trade.",
            "Drun warriors want to hunt a Bukavac to test their strength, but they need the party's help tracking it in the treacherous swamp."
          ],
          "heritage": "Spun from Slavic tales of six-legged swamp monsters, the Bukavac originally served as a cautionary tale to keep cattle and children away from the dark mud banks. The Wyrd anomaly consolidated the settlers' dread of swamp-ague and nocturnal screaming, materializing this horned monster to strangle prey near the swamps."
        },
        {
          "id": "hut_ling",
          "name": "Hutling",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/hut_ling.png",
          "illustrationCaption": "A Hutling chicken-legged chest standing alert in a swamp clearing",
          "role": "The chicken-legged chest",
          "origin": "The Hutling is a creature of the forest and the witch, born from the Slavic tales of the animated treasure chests that protect the witch's hoard. In the Bryngloom Forest, where the witches are many and the treasure is hidden, the Hutlings are the guardians of the witch's hoard, creatures that have been created by the Wyrd to serve as the witch's eyes and ears. The Wyrd's corruption did not change their nature, but it did make them more protective, for the creature now sees all who approach its treasure as a potential thief, and it will attack any who come near its chest. The treasure hunters of the Bryngloom Forest know the signs of a Hutling's presence—a chest that walks on chicken legs, and the sound of a witch's laughter in the air.",
          "nature": "An animated treasure chest made of dark swamp-oak, held together by runic iron bands, walking on two massive, scaly bird-like legs. The creature is highly protective of its contents and will run away or kick aggressively if approached. The Hutling is a thing of terrible cuteness, and its chicken legs are fast enough to outrun a horse. The creature is a creature of the witch, and it is most active during the night, when the witch is sleeping and the treasure is unguarded.",
          "habitat": "The Hutling inhabits the deep marshes, forest clearings, and ruins of the Bryngloom Forest, particularly in the Witch's Hollow where the witches are most numerous and the treasure is most hidden. It is most active during the night, when the witch is sleeping and the treasure is unguarded, and during the spring, when the grass is green and the air is filled with the sound of insects. The Hutling's nest is always near the witch's lair, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "170 HP. Talon Kick (melee, +5 to hit, 2d6+3 physical, DC 13 AGI save or knocked prone). Runic Lock (if a creature attempts to open the chest, they take 2d6 storm damage, DC 13 AGI to avoid). Dash (can move 60 ft for 1 AP). Vulnerable to ember.",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 14,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 6,
            "maxHp": 170,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "physical": 25
            }
          },
          "depth": "Comical yet dangerous constructs. They are bound to a master (usually a forest witch) and will only allow their master to open them without detonating the runic lock. The Hutling's runic lock is a mystery to scholars, for it is made of a rune that does not exist in any known catalog, and some believe that the creature's lock is a natural adaptation, a living defense that protects the witch's treasure from thieves.",
          "hooks": [
            "A Hutling was spotted running through the forest carrying a noble's family sigil. The party must track it and catch it.",
            "A forest hag has died, and her Hutling is wandering aimlessly, kicking anyone who gets near its treasure."
          ],
          "heritage": "Derived from Slavic folklore of Baba Yaga's animated treasure chests, the Hutling originally served to warn travelers against seeking the hoard of powerful witches. The Wyrd anomaly reacted to the miners' greed during bog-iron harvesting, materializing these chest-like constructs to walk on chicken legs and guard old ruins."
        },
        {
          "id": "likho",
          "name": "Likho",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/likho.png",
          "illustrationCaption": "A gaunt Likho hag with a single large eye in the center of her forehead, lurking in the shadows",
          "role": "The one-eyed misfortune",
          "origin": "The Likho is a creature of the misfortune and the curse, born from the Slavic legends of the personification of evil fate and bad luck. In the Bryngloom Forest, where the shadows are deep and the luck is bad, the Likhos are the spirits of misfortune, creatures that have been twisted by the Wyrd into something that is both pitiful and terrifying. The Wyrd's corruption did not change their nature, but it did make them more aggressive, for the creature now sees all who enter its territory as a source of bad luck, and it will cling to any who come near its lair. The villagers of the Bryngloom Forest know the signs of a Likho's presence—a series of terrible accidents, and the feeling of a heavy weight on their back.",
          "nature": "A tall, gaunt, skeletal hag with pale, grey skin and a single, large bloodshot eye in the center of her forehead. She wears tattered black rags and moves silently through the dark undergrowth, her presence marked by a sudden chill and the smell of rotting leaves. The creature represents bad luck, cursing those she encounters with a series of terrible accidents that can lead to death. The Likho is a creature of the shadow, and she is most active during the night, when the darkness is deepest and the luck is at its worst.",
          "habitat": "The Likho inhabits the damp caves, deep forest hollows, and abandoned cabins of the Bryngloom Forest, particularly in the Misfortune Hollow where the shadows are deepest and the luck is at its worst. She is most active during the night, when the darkness is deepest and the luck is at its worst, and during the autumn, when the leaves are falling and the air is filled with the smell of decay. The Likho's lair is always in the dark, and it is said to be a place of terrible beauty, filled with the bones of the creature's prey.",
          "combat": "235 HP. Gaze of Misfortune (ranged, DC 14 SPI save or target has disadvantage on all checks and attack rolls for 3 rounds). Clinging Curse (+6 to hit, DC 14 AGI save or she climbs onto the target's back, dealing 2d6 wyrd damage per round). Sharp Claws (2d8+3 physical). Vulnerable to ember.",
          "stats": {
            "strength": 12,
            "agility": 14,
            "constitution": 16,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 4,
            "maxHp": 235,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "wyrd": 50
            }
          },
          "depth": "A physical embodiment of bad luck. Once she targets a victim, she clings to their back, draining their hope and bringing constant misfortune until she is driven off with hot iron. The Likho's single eye is a mystery to scholars, for it is said to see the future, and some believe that the creature's eye is a natural adaptation, a living oracle that allows her to see the bad luck that she brings.",
          "hooks": [
            "A local woodcutter has been struck by a sequence of terrible accidents; the villagers believe a Likho hag has crawled onto his back.",
            "To lift a curse from a town's chief, the party must locate the Likho's lair in the dark undergrowth and destroy her iron cooking pot."
          ],
          "heritage": "Rooted in Slavic beliefs of evil fate and bad luck, the Likho was a personification of misfortune, used to rationalize a series of sudden accidents, illnesses, or deaths. The Wyrd anomaly consolidated this collective despair and bad luck, materializing this one-eyed hag to physically cling to travelers' backs."
        },
        {
          "id": "leshara",
          "name": "Leshara",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/leshara.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Leshara",
          "role": "Leshy",
          "origin": "The Leshara shares the heritage of Slavic woodland lords who shift in size and lead travelers astray, combined with the intelligent, devoted Vanara of Vedic myth who once moved mountains and built bridges. In the setting of Mythrill, this ancient creature serves as both a loyal warden of the wild and a mischievous trickster, guarding the secrets of the deep forests from those who would exploit them.",
          "nature": "Standing twelve feet tall, this towering figure has a body composed of living wood, moss, and bark, with its left side coated in blue-green lichen and its right in red-tinged fungi. From its spine extends a long, prehensile tail ending in a cluster of roots, while its skin consists of bark that continuously grows and sheds, scattering leaves and flakes along its path. A beard woven of moss and peat-vine frames a wood-carved face with bushy eyebrows, piercing green eyes that reflect the entire forest ecosystem, a grin of polished stone teeth, and a third eye of amber pine-resin blinking slowly from its forehead, all while it carries a staff of living branch-wood that sprouts roots wherever it strikes.",
          "habitat": "This grand woodland entity resides in the deep, primeval reaches of the Bryngloom Forest terrain.",
          "combat": "330 HP. Storm-Body (passive: storms follow it naturally — its wingbeats create wind-currents that shape weather patterns across a 100-mile radius). Stone-Fling (ranged, +7 to hit, 3d8+5 bludgeoning — hurls blocks of quarried stone from the ground as siege weapons). Divine-Theft (passive: carries the Tablets of Destiny, which were stolen from the gods; as long as it possesses them, it can issue decrees that reality obeys). Thunderbolt-Fury (ranged, +6 to hit, 2d6+4 lightning, DC 14 AGI or knocked prone). Wing-Lightning (passive: each wingbeat generates static discharge; lightning strikes random targets within 30 ft each round). Divine-Resistance (passive: immune to mortal weapon-damage — only god-touched weapons can harm it; all normal attacks deal minimum damage). Vulnerable to radiant.",
          "stats": {
            "strength": 20,
            "agility": 16,
            "constitution": 18,
            "intelligence": 16,
            "spirit": 20,
            "charisma": 12,
            "maxHp": 330,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 20,
            "resistances": {
              "physical": 75,
              "lightning": 100,
              "fire": 50
            }
          },
          "depth": "Shifts trees and roots to make travelers walk in circles. The only way to break its illusion is to wear your coat inside-out and walk backward; this amuses the Leshara, who will laugh (sounding like rustling leaves) and reveal the true path.",
          "hooks": [
            "A party is lost in a circular trail that keeps returning to the same mossy stump.",
            "An ancient grove guardian demands a display of foolishness to let travelers pass."
          ],
          "description": "A towering guardian of the wood, the Leshara stands twelve feet tall, a living monument of bark, moss, and fungi bound with simian grace.",
          "heritage": "Born from Slavic Leshy myths, this creature originally served as a symbol of the forest's absolute ownership, warning loggers against clearing sacred groves. The Wyrd anomaly crystallized the woodcutters' guilt and the disorientation of the deep woods, materializing this size-shifting Lord of the Wild to lead travelers astray."
        },
        {
          "id": "rusalka",
          "name": "Rusalka",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/rusalka.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Rusalka",
          "role": "Rusalka",
          "origin": "The Rusalka is born of the sorrow of drowned women in Slavic folklore, dangerous temptresses who lured men to watery graves, merged with the shape-shifting, divine Apsaras of Vedic myth who danced in celestial waters. In the misty Bryngloom Forest, they embody both the tragedy of untimely death and the mystical allure of watery transformation.",
          "nature": "Standing waist-deep in bog-pools, this six-foot-tall woman has skin the pale green of submerged moss and impossibly long duckweed-colored hair that floats in a perfect circle on the water. Her form is semi-translucent below the surface, revealing ancient bones, roots, and peat-layers underneath, while water drops fall continuously from her fingertips, each capturing a miniature image of drowning. Her heartbreakingly beautiful face is marked by high cheekbones, a melancholy smile, and large, bog-water eyes with vertical, reptilian pupils that contract when she spots her prey.",
          "habitat": "This mournful spirit dwells in the swampy pools of the Bryngloom Forest terrain.",
          "combat": "130 HP. Lament-Weave (passive: weaves shroud-fabric from grief itself; each thread is a mortal sorrow). Sorrow-Aura (passive: creatures within 30 ft feel a deep, nameless sadness; DC 13 SPI or disadvantage on all actions for 1 round). Shroud-Wrap (melee, +5 to hit, 1d6+3 necrotic + DC 14 CON or paralyzed, wrapped in shroud). Veil-Bridal (passive: wears a veil of black gauze, through which the dead can be glimpsed; anyone who lifts the veil sees their own death, DC 15 SPI or frightened for 1 hour). Underworld-Mistress (passive: commands the undead of the underworld; any undead within 60 ft obeys her commands). Vulnerable to radiant.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 130,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "cold": 50,
              "necrotic": 100,
              "psychic": 25
            }
          },
          "depth": "During the dry season, the Rusalka leaves her pool to dance in peat-clearings, casting a hypnotic lure that forces anyone who watches to join until their hearts burst, a compulsion that can only be broken by wearing one's clothes inside-out. Those who seek her out often do so for her bone-comb, which can untangle any physical or metaphorical knot, offering Neth contract-mages a way to resolve impossible legal disputes at the cost of a year of their memories. Adventurers may be hired to retrieve these memories or to hunt the creature down when reports of her deadly dances surface near local settlements.",
          "hooks": [
            "A rumor spreads of a Rusalka spotted near the area.",
            "Adventurers need a component from a Rusalka to complete their quest."
          ],
          "description": "A mesmerizing water-nymph of the bogs, the Rusalka lures the unwary with a melancholy smile and a comb carved of bone.",
          "heritage": "Spun from Slavic legends of drowned women, the Rusalka originally served to rationalize the tragic, sudden drownings of young men lured into deep lakes by beautiful illusions. The Wyrd anomaly reacted to the community's grief and the dark waters, materializing these seductive spirits to drown travelers."
        },
        {
          "id": "strigoi_canopy",
          "name": "Strigoi",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/strigoi_canopy.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Strigoi",
          "role": "Strigoi",
          "origin": "The Strigoi arises from the Romanian Strigoi, a reanimated vampire and former sorcerer, combined with the Vetala of Hindu lore, which inhabited corpses and hung upside-down from trees to torment travelers with riddles. In the heights of Mythrill, this creature haunts the upper canopy, combining physical terror with ancient, dark intelligence.",
          "nature": "This desiccated humanoid hangs upside-down by its feet from branches, its skin the grey-white of birch-bark stretched over skeletal bone. Enormous, leathery wings fold against its arms, while its hands and feet end in elongated prehensile digits with hook-like claws. A faint green phosphorescence glows from its empty eye-sockets, and its jaw is dislocated to hide a long, uncoiling proboscis-like tongue, set in a face frozen in a grin of yellowed, crowded fangs.",
          "habitat": "This winged undead threat makes its home in the high branches of the Bryngloom Forest terrain.",
          "combat": "395 HP. Sacred-Guardian (passive: bound to the Cedar Forest; the forest's health is directly tied to its vitality — if it weakens, the forest withers). Intestine-Spiral (passive: exposed intestines form spiraling patterns on its chest; these are sacred geometry — the patterns encode the Cedar Forest's location, its boundaries, its vulnerabilities). Terrifying-Face (passive: its face is a mass of writhing, coiling guts; DC 14 SPI or Frightened for 1d4 rounds). Cedar-Regeneration (passive: regenerates 10 HP per round while in the Cedar Forest; outside the forest, no regeneration). Tree-Strike (melee, +7 to hit, 2d8+6 bludgeoning — strikes with the force of a falling cedar). Forest-Command (passive: commands all trees within 100 ft; can make them grow, shift, or attack). Vulnerable to fire (fire destroys the regeneration and deals double damage).",
          "stats": {
            "strength": 22,
            "agility": 10,
            "constitution": 22,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 8,
            "maxHp": 395,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "physical": 75,
              "cold": 50,
              "necrotic": 50
            }
          },
          "depth": "Dwelling in colonies high in the ironwoods, the Strigoi drops onto travelers to drain their vitality, leaving victims as listless husks. If captured, this cunning spirit will answer questions of the past and future but only through riddle-stories; failure to solve them summons its pack, though Neth Kessen weavers often brave these encounters using probability-sight to unlock the Strigoi's dark knowledge. Adventurers may be hired to clear these canopy pests or retrieve components from their wings.",
          "hooks": [
            "A rumor spreads of a Strigoi spotted near the area.",
            "Adventurers need a component from a Strigoi to complete their quest."
          ],
          "description": "Hanging silently from the highest branches, the Strigoi is a winged corpse-spirit that feeds on the life force of travelers.",
          "heritage": "Derived from Romanian Strigoi and Hindu Vetala legends, this reanimated vampire originally served to warn against the practice of dark magic and improper burials. The Wyrd anomaly consolidated the fear of unseen contagion and grave desecration, materializing these corpse-dwelling ghouls to hunt in the high forest canopy."
        },
        {
          "id": "domovoi",
          "name": "Domovoi",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/domovoi.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Domovoi",
          "role": "Domovoi",
          "origin": "The Domovoi is descended from the Slavic domestic spirit that guarded homes in exchange for offerings, merged with the Ganas of Vedic myth, Shiva's dwarfish, bureaucrat attendants who guarded sacred thresholds. In the Bryngloom, they watch over the dwellings of Mythrill, acting as cosmic auditors of those under their roof.",
          "nature": "Standing only two feet tall, this densely hairy humanoid looks like a living wool coat, with thick grey-brown fur covering its body except for its reptilian-scaled face, hands, and feet. It wears a tiny apron of Neth silver-thread and carries a miniature ledger of contract-tablets. Its face is that of a wrinkled old man on a child's body, complete with a magnificent mustache and bushy eyebrows that frame beady, watchful black eyes.",
          "habitat": "This protective house-spirit resides near Neth, Morren, and Vreken dwellings throughout the Bryngloom Forest terrain.",
          "combat": "350 HP. Winged-Protector (passive: divine guardian of cities, temples, and sacred gates; its presence makes the area impervious to natural disaster for 1 year). Gate-Vigil (passive: watches over a specific gate or entrance; no creature of evil intent can pass through the gate while the Lamassu is present). Bull-Body (passive: combines human intelligence with bull strength; can wield weapons in its human hands). Celestial-Flight (fly 80 ft; can carry one passenger). Divine-Commandment (passive: speaks divine law; all creatures within 100 ft must obey or suffer a curse of 1d4 CON damage). Vulnerable to none (divine guardian; attacking it invites divine wrath — any creature that damages a Lamassu must DC 18 SPI or suffer a curse of perpetual misfortune).",
          "stats": {
            "strength": 20,
            "agility": 12,
            "constitution": 20,
            "intelligence": 18,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 350,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "physical": 50,
              "lightning": 50,
              "radiant": 50
            }
          },
          "depth": "A tiny household protector living under floorboards. If players stay in a house guarded by a Domovoi, they must follow its 'house rules' (e.g., no boots indoors, don't sweep after sunset). If they break a rule, the Domovoi hides their boots or spoils their rations. If respected, it polishes their weapons.",
          "hooks": [
            "A household is plagued by minor thefts because they swept after sunset.",
            "A Domovoi offers to guide players through a haunted mansion if they keep their boots clean."
          ],
          "description": "A two-foot-tall hairy guardian of the hearth, the Domovoi keeps careful watch over households and records the deeds of their inhabitants.",
          "heritage": "Born from Slavic domestic spirit beliefs, the Domovoi served to protect the household hearth in exchange for offerings, warning against domestic laziness. The Wyrd anomaly reacted to the settlers' desire for safety in their damp cabins, materializing this dwarf-like spirit to assist with chores or throw tantrums when neglected."
        },
        {
          "id": "kikimora",
          "name": "Kikimora",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/kikimora.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Kikimora",
          "role": "Kikimora",
          "origin": "The Kikimora combines the Slavic Kikimora, a household spinner who nested behind stoves to tangle yarn and make mischief, with the Vedic concept of Jyotisha-Maya, the cosmic web of illusion that hides the unity of reality. In Mythrill's damp forests, she spins these illusions into physical threads that wrap around the minds and documents of mortals.",
          "nature": "Standing five feet tall, this gaunt woman has mottled bark-like skin and twelve-fingered hands tipped with spinning-hooks. She is surrounded by a web of near-invisible silk that only sparkles when catching moisture, and she wears a dress of woven spider-silk that shifts color with her mood. Her narrow, pinched face features a hooked nose, thin lips, and large, multi-faceted spider-like eyes, accompanied by a continuous tuneless humming that brings on deep drowsiness.",
          "habitat": "This elusive spinner makes her home in dark corners and households across the Bryngloom Forest terrain.",
          "combat": "155 HP. Chariot-Wheel (passive: the front half of a lion, the back half of a scorpion; mounted on a stone-wheel that rolls without being pushed). Gate-Patrol (passive: circles the Cedar Forest gates, its wheel-turning producing a rhythmic grinding — a warning to intruders). Venom-Spray (ranged, +5 to hit, 2d6+3 poison, DC 14 CON or paralyzed 3 rounds). Lion-Roar (AoE 30 ft, DC 13 SPI or Frightened 1 round). Scorpion-Tail (melee, +5 to hit, 1d8+3 piercing + DC 14 CON or poisoned 1 round). Vulnerable to fire.",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 14,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 155,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "poison": 75,
              "cold": 25
            }
          },
          "depth": "She spins dust and cobwebs into beautiful garments. If a player wears one of her garments, they gain charisma but see the world through a shifting illusion, making friendly NPCs look like monsters. She will exchange these garments for a handful of silver needles.",
          "hooks": [
            "A noble wears a beautiful cobweb dress and now claims everyone is an assassin.",
            "A Kikimora demands a set of silver needles to finish a magical robe."
          ],
          "description": "A gaunt, multi-fingered spirit who spins webs of illusion, the Kikimora tangles truth and contracts alike under the cover of night.",
          "heritage": "Derived from Slavic hearth-spinner legends, the Kikimora was a warning myth to explain tangled yarn and spoiled food, enforcing rules of cleanliness and domestic work. The Wyrd anomaly reacted to the small frictions of daily life in forest cabins, materializing this stove-dwelling sprite to play pranks and cause mischief."
        },
        {
          "id": "zmey_bog",
          "name": "Zmey",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/zmey_bog.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Zmey",
          "role": "Zmey Gorynych",
          "origin": "The Zmey merges the legendary three-headed, fire-breathing Slavic dragon Zmey Gorynych with the Makara, a composite Hindu sea-monster representing Varuna's watery domain. Anchored in the deep peat-marshes of Mythrill, this creature acts as an ancient guardian of sunken secrets and lost documents.",
          "nature": "This thirty-foot serpentine dragon features a body of mud-caked crocodile hide and fish scales, ending in a peacock-like tail capable of fanning poison-gas and iron claws forged of actual metal on its feet. Its three heads are colored red, green, and blue, breathing fire, poison, and water respectively. Each head has a unique disposition—feral, sly, and serene—yet all three share the same ancient golden eyes that remember everything with merciless clarity.",
          "habitat": "This swamp-dwelling beast hides in the deepest, muddiest pools of the Bryngloom Forest terrain.",
          "combat": "130 HP. Fever-Touch (melee, +5 to hit, 1d6+3 necrotic + DC 14 CON or gain 1 level of exhaustion — the target feels the fever of its own death). Disease-Spreader (passive: any creature that takes necrotic damage from the Utukku must DC 14 CON or contract a random disease — fever, blindness, paralysis, or wasting). Grave-Reflection (passive: appears as the target's own face, distorted in agony; DC 13 SPI or Frightened 1 round). Spirit-Drain (melee, +5 to hit, 2d6+3 psychic — drains willpower, DC 14 CON or fatigued for 8 hours). Vulnerable to radiant.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 130,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "necrotic": 50,
              "cold": 50,
              "psychic": 25
            }
          },
          "depth": "The Zmey hoards stolen legal documents, including Neth First Contract fragments and Vreken burial charters, in its inaccessible bog-pools. To prevent the dragon from tearing down the branch-walkways of Atropolis, the Neth are forced to pay a tribute of one contract-scroll per decade, presenting a rich target for adventurers hired to recover lost archives or defend the canopy city from the beast's wrath.",
          "hooks": [
            "A rumor spreads of a Zmey spotted near the area.",
            "Adventurers need a component from a Zmey to complete their quest."
          ],
          "description": "A massive three-headed dragon of the swamp, the Zmey hoards lost contracts and demands legal tribute from the canopy-dwellers.",
          "heritage": "Spun from the three-headed dragon Zmey Gorynych, this monster represented the terror of massive forest fires and the destructive elemental anger of the skies. The Wyrd anomaly reacted to the settlers' fear of storms during crop-clearing, materializing this fire-breathing beast to burn settlements and guard remote swamps."
        },
        {
          "id": "zharptitsa_glow",
          "name": "Zhar-ptitsa",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/zharptitsa_glow.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Zhar-ptitsa",
          "role": "Zharptitsa / Firebird",
          "origin": "The Zhar-ptitsa draws its heritage from the Slavic Firebird, whose dazzling, glowing feathers illuminated the dark in classic fairy tales, and Garuda, the divine sun-bird of Vedic myth who served as Vishnu's mount and the eternal enemy of serpents. In Mythrill, it stands as a majestic beacon of warmth and light in the high branches.",
          "nature": "With a massive thirty-foot wingspan, this bird has plumage of gold, amber, and deep crimson that pulses with a warm, golden luminescence matching its heartbeat. Each of its feathers remains permanently luminescent for decades after being shed, and its body radiates comforting heat in a twenty-foot radius to cut through the damp cold of the forest. Its face is an eagle's of overwhelming majesty, featuring a hooked beak of polished gold and intense, star-like eyes that project a mixture of fierce authority and divine compassion.",
          "habitat": "This solar avian makes its nests in the high canopy of the Bryngloom Forest terrain.",
          "combat": "180 HP. Puppy-Play (passive: playful, curious, destructive; its tail-wags knock down trees). Chain-Breaker (passive: can shatter any chain, rope, or binding with a single bite; DC 14 STR or the binding breaks automatically). Growing-Energy (passive: gains +1 to all stats each round it remains in combat, representing its growth from puppy to adult; maximum +5 bonus). Bite-Force (melee, +6 to hit, 2d8+5 piercing — jaw strength exceeds its size). Moon-Phase (passive: power tied to lunar cycle; strongest at the new moon, weakest at the full moon). Vulnerable to cold (ironically, its own breath of frost deals reduced damage to it — it has partial cold immunity).",
          "stats": {
            "strength": 16,
            "agility": 16,
            "constitution": 16,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 180,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 50,
              "physical": 25
            }
          },
          "depth": "Serving as the primary source of light in the dark under-canopy, the Zhar-ptitsa has its feathers harvested by the Vreken to illuminate their spires and crypts. The bird also acts as a natural Serpent-Slayer, repelling creatures like the Zmey and the Naga, which leads the Neth to encourage their nesting near archives; however, the creature demands absolute silence, and any sound louder than a whisper will cause it to flee and shed its valuable feathers in panic, sparking high-stakes retrieval missions for adventurers.",
          "hooks": [
            "A rumor spreads of a Zhar-ptitsa spotted near the area.",
            "Adventurers need a component from a Zhar-ptitsa to complete their quest."
          ],
          "description": "A grand, luminescent sun-bird of the canopy, the Zhar-ptitsa radiates warmth and a golden light that repels serpents.",
          "heritage": "Derived from Slavic Firebird legends, the Zhar-ptitsa originally represented the hope of finding a beacon of warmth and light in the dark winter. The Wyrd anomaly reacted to the settlers' fear of the long, dark nights and freezing cold, materializing this radiant bird to illuminate the high pine branches."
        },
        {
          "id": "naga_root",
          "name": "Naga",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/naga_root.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Naga",
          "role": "Naga",
          "origin": "The Naga is inspired by the divine serpent-beings of Vedic mythology who guarded waters and subterranean treasures, combined with the deep earth-dwelling aspect of the Slavic dragon Zmey Gorynych. In Mythrill's depths, it acts as a primordial manager of the forest's hydrology and a keeper of buried secrets.",
          "nature": "This forty-foot-long serpent features a powerful humanoid torso and arms emerging from its coiled, scale-covered lower body, with scales the deep green of wet ironwood leaves. A cobra-like hood spreads permanently around its head like an elaborate headdress, topped by a crown of root-fiber and bog-iron, while its eight-digited hands are built for burrowing. Its face is a mix of human and serpent, marked by molten-gold eyes with vertical pupils and a jaw that unhinges to reveal fangs, set in a calm, regal expression.",
          "habitat": "This subterranean ruler crawls through the deepest root-systems of the Bryngloom Forest terrain.",
          "combat": "440 HP. World-Circle (passive: coils around the entire world; its head and tail nearly touch beneath the sea). Ocean-Maw (melee, +8 to hit, 3d8+6 piercing — a single bite can swallow ships). Venom-Drip (passive: venom drips from its fangs into the ocean, poisoning sea-water for miles; DC 14 CON or poisoned 3 rounds). Tidal-Wave (passive: when it moves, it creates tsunamis; all creatures within 1 mile must DC 15 AGI or swept away). Regeneration (regenerates 15 HP per round; only radiant or lightning damage stops regeneration). Vulnerable to radiant.",
          "stats": {
            "strength": 24,
            "agility": 12,
            "constitution": 24,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 6,
            "maxHp": 440,
            "maxMana": 50,
            "maxActionPoints": 5,
            "speed": 15,
            "resistances": {
              "physical": 75,
              "cold": 100,
              "lightning": 50
            }
          },
          "depth": "Ruling the underground as the Root-Lord, the Naga dictates the flow of water through the forest's root-network, deciding which ironwood trees flourish and which wither. He is also the Water-Guardian of the subterranean rivers, requiring the Vreken to petition him with ancient relics and crypt treasures for water rights, judging them with a fair but merciless hand that adventurers might need to influence, bypass, or challenge if water conflicts arise.",
          "hooks": [
            "A rumor spreads of a Naga spotted near the area.",
            "Adventurers need a component from a Naga to complete their quest."
          ],
          "description": "A massive half-human, half-serpent lord of the deep earth, the Naga controls the life-giving waters that feed the roots of the forest.",
          "heritage": "Rooted in Vedic serpent myths, the Naga represented the fear of underground water hazards and the absolute necessity of respecting hidden water sources. The Wyrd anomaly reacted to the drainage of peat-marshes and excavations of ancient ruins, materializing these serpent-beings to guard deep underground tunnels."
        },
        {
          "id": "preta_hollow",
          "name": "Preta",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/preta_hollow.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Preta",
          "role": "Preta / Hungry Ghost",
          "origin": "Cursed by the insatiable hunger of the Vedic Preta, who paid for their greed in life with bloated bellies and tiny mouths, and the restless Slavic Nav, souls trapped between life and death by violent endings, the Preta represents the ultimate cost of unfulfilled obligations. In the setting of Mythrill, they are the tragic remnants of those who died in unresolved debt to the Neth.",
          "nature": "This skeletal humanoid is characterized by an enormously distended belly of translucent skin that holds nothing but absolute darkness, balanced on an impossibly thin neck that supports an oversized head. Its hands are skeletal with grasping fingers, and its body carries the dry, acidic scent of starvation. Its paper-thin skull-face is dominated by hollow eye-sockets burning with grey fire, and its tiny pinhole mouth twitches and gasps continuously in an expression of desperate, pathetic sadness.",
          "habitat": "These tragic spirits wander the misty clearings of the Bryngloom Forest terrain.",
          "combat": "375 HP. Root-Gnawer (passive: continuously chews the roots of the World-Tree; its saliva contains an acid that dissolves divine wood). Bone-Cruncher (melee, +7 to hit, 3d8+5 piercing — crushes bones as easily as dry twigs). Corpse-Feast (passive: devours the corpses of the dishonored dead; each corpse consumed restores 20 HP). Under-Earth-Network (passive: tunnels beneath the roots of the World-Tree, connecting the underworld to the surface; its tunnel-network spans the entire world). Venom-Spit (ranged, +6 to hit, 2d6+4 poison, DC 15 CON or paralyzed 3 rounds). Vulnerable to radiant.",
          "stats": {
            "strength": 22,
            "agility": 14,
            "constitution": 20,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 6,
            "maxHp": 375,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 25,
            "resistances": {
              "physical": 50,
              "cold": 50,
              "necrotic": 100
            }
          },
          "depth": "Known as the Insatiable-Dead, Pretas are the spirits of debtors whose contracts were called by the Keeper of the Last Threshold before they could pay. Their presence acts as a Hunger-Inducer, inflicting painful, unsatisfiable hunger on anyone within twenty feet, rendering food useless. The only release for these spirits is for a living soul to pay off their contract-debts, a transaction that Neth Kessen weavers are willing to facilitate for a steep fee, providing a moral and financial dilemma for adventurers who encounter them or seek to retrieve components from their hollow forms.",
          "hooks": [
            "A rumor spreads of a Preta spotted near the area.",
            "Adventurers need a component from a Preta to complete their quest."
          ],
          "description": "A skeletal, tragic specter of insatiable greed, the Preta wanders the peat-clearings with a ballooning belly and a pinhole mouth.",
          "heritage": "Spun from Vedic Preta hungry ghost beliefs, this spirit was a moral warning against greed, gluttony, and the failure of sharing community resources during lean winters. The Wyrd anomaly consolidated the fear of starvation and community selfishness, materializing these bloated, narrow-throated phantoms to suffer from insatiable hunger."
        },
        {
          "id": "gamayun_seer",
          "name": "Gamayun",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/gamayun_seer.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Gamayun",
          "role": "Gamayun",
          "origin": "The Gamayun stems from the prophetic bird of Slavic folklore who held absolute knowledge of past and future, combined with the Kinnara of Vedic mythology, celestial bird-bodied musicians who served as divine messengers. In Mythrill, she flies through the dark canopy, spinning fate into song.",
          "nature": "Having a fifteen-foot wingspan, this large bird possesses the head and upper torso of a beautiful woman, with blue-black twilight plumage that shimmers with bioluminescent fungal-light. She holds a small lute in her talons, playing melodies that can sway ironwood trees and still the waters, while her feathers are structure-bound memory-glass fragments containing visions of the future. Her sorrowful face features dark, time-spanning eyes and full lips that continuously shape prophecy under a heavily lined brow.",
          "habitat": "She roosts high in the branches of the Bryngloom Forest terrain.",
          "combat": "285 HP. Gate-Watcher (passive: guards the entrance to the underworld; no creature can pass without its permission). Blood-Face (passive: its face is perpetually drenched in blood from chewing its own breast-binds). Chains-of-Garmr (melee, +6 to hit, 2d8+4 piercing — each bite tears flesh and bone). Underworld-Sense (passive: knows when any creature crosses the threshold between life and death; can detect the recently deceased within 100 miles). Hell-Hound-Eyes (passive: eyes burn with the light of the underworld; DC 14 SPI or Frightened 1 round). Vulnerable to radiant.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 18,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 285,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 35,
            "resistances": {
              "physical": 50,
              "cold": 50,
              "necrotic": 75
            }
          },
          "depth": "Serving as the Oracle-Bird, she sings complex, allegorical poems detailing the future from the high branches, which Neth Velun arcanists study extensively. Her shed feathers are harvested for their memory-glass prophecies and sold by the Vreken to Neth contract-mages to guide their decisions, though these fortunes always manifest in unexpected and devastating ways, creating opportunities for adventurers hired to retrieve a feather or decipher a riddle of fate.",
          "hooks": [
            "A rumor spreads of a Gamayun spotted near the area.",
            "Adventurers need a component from a Gamayun to complete their quest."
          ],
          "description": "An oracle of twilight wings and a sorrowful voice, the Gamayun sings prophecies of the future that are as accurate as they are devastating.",
          "heritage": "Derived from Slavic legends of the prophetic bird, the Gamayun originally represented the hope of receiving warnings about impending historical disasters. The Wyrd anomaly reacted to the scholars' anxiety over losing pre-Dimming knowledge, materializing this human-headed bird to share cryptic warnings and historical truths."
        },
        {
          "id": "chort_thorn",
          "name": "Chort",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/chort_thorn.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Chort",
          "role": "Chort",
          "origin": "The Chort is born from the Slavic Chort, a goat-like devil associated with crossroads and ironic bargains, and the shape-shifting Rakshasas of Vedic lore, demons who disrupted rituals and took the forms of relatives. In Mythrill's Bryngloom, this entity delights in tempting mortals and complicating their laws.",
          "nature": "Standing seven feet tall, this lean humanoid features goat-legs, curved black horns, and bark-like armor-plating studded with sharp thorns. Living, reaching thorn-vines wrap its body, and a lashing forked tail carries a barbed thorn at each tip, accompanied by the smell of rotting flowers and burnt offerings. Its face combines goat and demonic features, possessing a narrow muzzle, flat teeth, a beard of twisted vine, and solid red eyes that track multiple targets at once.",
          "habitat": "This devious trickster is found lurking at paths and crossroads within the Bryngloom Forest terrain.",
          "combat": "200 HP. Eight-Legged (passive: eight legs give it impossible speed and stability; cannot be knocked prone). Underworld-Rider (passive: can carry passengers between the mortal world and the underworld; requires a specific invitation from a dying mortal to make the crossing). Spirit-Stamp (passive: its hooves leave marks that glow faintly — the marks of the dead). Ghost-Steed (passive: immune to all physical damage; only magical attacks can harm it). Dimensional-Gallop (passive: can gallop between planes — mortal world, underworld, spirit world — in a single stride). Vulnerable to radiant (radiant damage disrupts the dimensional gateway, forcing it to remain in one plane for 1 round).",
          "stats": {
            "strength": 16,
            "agility": 22,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 200,
            "maxMana": 50,
            "maxActionPoints": 4,
            "speed": 20,
            "resistances": {
              "physical": 100,
              "necrotic": 50,
              "cold": 50
            }
          },
          "depth": "Acting as the Bargain-Devil, the Chort offers deals that are technically fulfilled but always turn out ironically disastrous, making bargains with him a sign of desperation, especially for the pathologically honest Neth. He is also a Shape-Stealer who impersonates others to sow chaos, though he always retains a single physical tell like horns or goat-eyes, which Vreken guards are trained to detect. Adventurers might be hired when rumors spread of a Chort in the area, or if they need to harvest a component from one.",
          "hooks": [
            "A rumor spreads of a Chort spotted near the area.",
            "Adventurers need a component from a Chort to complete their quest."
          ],
          "description": "A horned, goat-legged trickster of the crossroads, the Chort offers deceptive bargains and steals the likenesses of loved ones.",
          "heritage": "Born from Slavic Chort devil myths, this creature was a warning against making quick, ironic bargains at crossroads that compromised moral values. The Wyrd anomaly consolidated the settlers' fear of moral weakness and greed in the remote woods, materializing this goat-like devil to offer dangerous pacts."
        },
        {
          "id": "drekavac_wail",
          "name": "Drekavac",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/drekavac_wail.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Drekavac",
          "role": "Drekavac",
          "origin": "The Drekavac descends from the Slavic Drekavac, a screaming nocturnal horror born from the souls of the unbaptized, and the restless Vedic Bhut, ghosts trapped on earth by their unfulfilled desires. In the marshes of Mythrill, they represent the ultimate despair of unfinished business and broken contracts.",
          "nature": "Defying a stable description, this shape-shifting horror is witnessed as a gaunt humanoid with long limbs, a bird with tattered wings, or a multi-jointed beast. Its body appears as a semi-transparent, shimmering distortion of the air, defined by an enormous, screaming mouth that serves as its entire face—a black void ringed with teeth that look like fangs, feathers, or fingers, reflecting the viewer's death in its depths.",
          "habitat": "This screaming phantom wanders the dark, misty spaces of the Bryngloom Forest terrain.",
          "combat": "160 HP. Golden-Boar (passive: mane and bristles glow with golden light; illuminates 30 ft). Sun-Force (passive: charges with the strength of the sun; +2 to attack rolls in daylight). Divine-Breed (passive: one of the divine boars bred by the gods; immune to disease and poison). Tusk-Gore (melee, +5 to hit, 2d6+4 piercing). Sun-Brilliance (passive: bristles shine so brightly in direct sunlight that nearby creatures must DC 13 CON or be blinded for 1 round). Vulnerable to cold (cold extinguishes its golden glow, reducing its stats by 2).",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 16,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 160,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "fire": 75,
              "poison": 100,
              "cold": 25
            }
          },
          "depth": "As the Night-Screamer, it fills the dark hours with a piercing wail that causes physical pain and heart failure in those who hear it, though the sleepless Neth are immune to its madness. These spirits are the Unfulfilled-Dead, Neth who faded without completing their contract unraveling, their cries expressing the agony of minds trapped between life and non-existence, which only a brave Kessen weaver can quiet by resolving the contract's final clauses. Adventurers may be drawn to investigate when rumors of a wailing spirit spread, or they may need to seek out the Drekavac to extract a rare component from its remains.",
          "hooks": [
            "A rumor spreads of a Drekavac spotted near the area.",
            "Adventurers need a component from a Drekavac to complete their quest."
          ],
          "description": "A shifting, screaming spirit of the unfulfilled dead, the Drekavac haunts the night with a voice that causes physical agony.",
          "heritage": "A heartbreaking warning story, the Drekavac arose from the souls of unbaptized infants to explain sudden, terrifying wails heard in the woods at night. The Wyrd anomaly reacted to the deep grief of child loss and the fear of the dark outside the village, materializing this screaming horror to guide travelers to doom."
        },
        {
          "id": "bannik_vent",
          "name": "Bannik",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/bannik_vent.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Bannik",
          "role": "Bannik",
          "origin": "The Bannik traces its lineage to the Slavic Bannik, the bathhouse-spirit who resided behind the sauna stove to pinch bathers and predict the future, combined with the dual creative and destructive aspects of Agni, the Vedic god of fire and divine messenger. In the elevated cities of Mythrill, they are industrial elementals bound to keep the frost at bay.",
          "nature": "Standing four feet tall, this squat, steam-wreathed figure is composed of compressed steam, peat-smoke, and heat-haze. Its hands leave scorch-marks on everything they touch, and it vents superheated steam from its nostrils while carrying a bundle of glowing peat-stones. Its broad, ruddy face is flushed with heat, featuring coal-colored eyes and a wide mouth, carrying the irritable expression of a creature that has been hot for too long.",
          "habitat": "This construct resides within the ventilation shafts of the heating systems in the Bryngloom Forest terrain.",
          "combat": "145 HP. Dwarf-Form (passive: appears as a wizened dwarf with golden skin; +4 to Intimidation). Gold-Ring (passive: wears a single gold ring — the Andvaranaut — that amplifies all magical effects within 10 ft by 50%). Curse-of-Gold (passive: any creature that takes gold from an Andvari's hoard is cursed; DC 14 SPI or lose 1d4 CHA per day until the gold is returned). Gold-Touch (melee, +5 to hit, 1d6+3 bludgeoning + DC 14 CON or petrified into gold for 1 round). Treasure-Knowledge (passive: knows the location and exact value of all gold within 1 mile). Vulnerable to fire.",
          "stats": {
            "strength": 12,
            "agility": 12,
            "constitution": 14,
            "intelligence": 18,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 145,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 25,
            "resistances": {
              "psychic": 50,
              "cold": 25
            }
          },
          "depth": "Living as a Vent-Dweller, the Bannik is critical to the survival of Atropolis, regulating the Neth's peat-fired heating network to prevent explosions or freezing. He is also a Stone-Diviner, throwing hot peat-stones to predict volcanic and geothermal activity for the Neth's builders, meaning an abandoned vent is a dire omen that adventurers may be recruited to investigate before the system fails, especially if they need a rare elemental component from the creature.",
          "hooks": [
            "A rumor spreads of a Bannik spotted near the area.",
            "Adventurers need a component from a Bannik to complete their quest."
          ],
          "description": "A squat, steam-wreathed elemental of the heating shafts, the Bannik maintains the heat of the canopy and divines thermal shifts.",
          "heritage": "Derived from Slavic bathhouse-spirit legends, the Bannik was a warning myth to explain accidents in the hot, steam-filled saunas and enforce rules of cleanliness. The Wyrd anomaly reacted to the settlers' specific encounters inside their saunas, materializing this stove-dwelling sprite to pinch bathers and predict futures."
        },
        {
          "id": "psoglav_bone",
          "name": "Psoglav",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/psoglav_bone.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Psoglav",
          "role": "Psoglav",
          "origin": "The Psoglav originates from the Slavic Psoglav, a dog-headed monster with iron teeth and a single eye that devoured travelers, merged with the Sharabha of Vedic myth, Shiva's eight-legged lion-bird avatar powerful enough to subdue demigods. In Mythrill, this beast is a terrifying, heavy-footed predator that bridges the gap between flesh and metal.",
          "nature": "This bull-sized, eight-legged beast combines a lion's body and feathered wings with a dog's head, featuring fangs made of actual corroded iron that grind together with a metallic shriek. Its eight limbs move in complex, spider-like patterns, and its face resembles a dog's skull dominated by a single, enormous forehead eye that glows with cold, blue-white light, set in a merciless grin of protruding iron fangs.",
          "habitat": "This bone-crunching predator hunts across the marshy ground of the Bryngloom Forest terrain.",
          "combat": "75 HP. Chatter-Split (passive: when it speaks, its words split — one set aimed at the roots (Yggdrasil), one at the canopy (the eagle); it carries messages between them). Root-Runner (passive: scurries along the roots of the World-Tree, delivering insults and gossip). Skull-Message (passive: hides a message inside its own skull, visible only to those who crush its head). Speed-of-Thought (passive: moves with impossible speed along the World-Tree; +10 to all Dexterity checks). Insult-Generator (passive: its screeching insults are perfectly tailored to offend both parties simultaneously). Vulnerable to none.",
          "stats": {
            "strength": 4,
            "agility": 20,
            "constitution": 4,
            "intelligence": 12,
            "spirit": 8,
            "charisma": 4,
            "maxHp": 75,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {}
          },
          "depth": "Known as the Bone-Eater, the Psoglav consumes skeletons to metabolize calcium into its iron fangs, leaving infested bogs entirely clear of bones. Its spider-like weight distribution makes it an Eight-Legged-Hunter capable of sprinting across soft peat-bogs where horses would sink, leaving behind telltale tracks of eight aligned prints marked with iron scrapings, presenting a tracking challenge for adventurers who are hired when reports of a sighting spread or when they need to harvest a component from the beast's skeletal form.",
          "hooks": [
            "A rumor spreads of a Psoglav spotted near the area.",
            "Adventurers need a component from a Psoglav to complete their quest."
          ],
          "description": "An eight-legged predator with iron teeth and a single eye, the Psoglav stalks the bogs to feed on bone-calcium.",
          "heritage": "Spun from dog-headed monster legends, the Psoglav was a warning story to keep children and herders from wandering alone into remote, bone-strewn cavern systems. The Wyrd anomaly consolidated the fear of predatory wolves and the stealth of cave monsters, materializing this single-eyed horror to hunt travelers."
        },
        {
          "id": "vourdalak_debt",
          "name": "Vourdalak",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/vourdalak_debt.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Vourdalak",
          "role": "Vourdalak",
          "origin": "Cursed by the tragic fate of the Slavic Vourdalak, a vampire that targeted its own grieving family, and the madness-inducing Vedic Pishacha, a dark demon of the cremation grounds, the Vourdalak represents the horror of unresolved obligations. In Mythrill, they are the restless dead driven to sustain their false lives through the vitality of their kin.",
          "nature": "This figure appears almost exactly as it did in life but with too-pale skin, stiff movements, and a smile that is too wide, dressed in peat-stained burial clothes. Peat-black liquid flows through its visible, translucent veins, and it carries the cracked contract-tablet that recorded its debts in life. Its face is frozen in its final moment of terror or fading, though its eyes remain fully aware and screaming at the horror of its state.",
          "habitat": "This tragic revenant wanders the damp settlements within the Bryngloom Forest terrain.",
          "combat": "285 HP. Death-Eater (passive: feeds on the bodies of the dishonored dead; each corpse consumed restores 20 HP). Corpse-Plague (passive: where it feeds, disease spreads; any creature that eats food or drinks water from an area where the Rat-Father has fed must DC 14 CON or contract a disease). Death-Whisper (passive: can detect the exact moment of death for any creature within 100 miles). Rat-Swarm (passive: commands all rats within 1 mile; can summon them as a swarm dealing 2d6 piercing per round). Regeneration (regenerates 10 HP per round while corpses are present). Vulnerable to radiant (radiant damage stops regeneration and deals double damage).",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 16,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 6,
            "maxHp": 285,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "necrotic": 100,
              "cold": 50,
              "physical": 25
            }
          },
          "depth": "Known as the Debt-Revenant, the Vourdalak is returned to a half-life by the Keeper of the Last Threshold to complete its broken Neth or Morren contract, draining its family's life force to do so. It also acts as a Madness-Speaker, possessing blood relatives to speak secrets of contract loopholes and buried artifacts, making these encounters a desperate search for Neth weavers and adventurers seeking to free the family from the spirit's parasitic bond or to retrieve a component from it.",
          "hooks": [
            "A rumor spreads of a Vourdalak spotted near the area.",
            "Adventurers need a component from a Vourdalak to complete their quest."
          ],
          "description": "A tragic revenant returned to its family, the Vourdalak drains the life of its loved ones to sustain its broken contract.",
          "heritage": "Rooted in vampire legends that target their own families, the Vourdalak represented the ultimate fear of domestic decay, wasting sickness, and family betrayal. The Wyrd anomaly reacted to the tragic spread of swamp-ague through close-knit cabins, materializing these ghouls to feed on their own kin."
        },
        {
          "id": "mavka_willow",
          "name": "Mavka",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/mavka_willow.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Mavka",
          "role": "Mavka / Navka",
          "origin": "The Mavka draws from the Slavic Mavka, a forest spirit of a woman who died unnaturally, beautiful from the front but hollow-backed with visible organs, combined with the Hindu Yakshini, tree-spirits bound to sacred growth who could bless or curse travelers. In the woodlands of Mythrill, they represent the alluring, deceptive beauty of the wilderness.",
          "nature": "From the front, this spirit appears as a stunningly beautiful woman with pale-green leaf-like skin, willow-bark hair, and bare feet merging with the roots, wearing a dress of leaves sewn with spider-silk and smelling of willow-sap. From behind, she has no back or spine, but rather a hollow cavity filled with rustling leaves and wooden organs. Her exquisite face is marked by spring-green eyes and parted lips, carrying a heartbreakingly innocent expression.",
          "habitat": "This tree-bound nymph lives at the roots of ancient trees in the Bryngloom Forest terrain.",
          "combat": "130 HP. Night-Kiss (melee, +5 to hit, 1d6+3 psychic — a kiss from Nott inflicts vivid nightmares on the target; DC 14 SPI or gain 1 level of exhaustion). Dark-Veil (passive: where she passes, darkness follows; all creatures within 30 ft have disadvantage on Perception checks). Shadow-Ride (passive: rides across the sky in a chariot drawn by black horses; each hoofbeat dims the light for 100 ft). Dream-Seal (passive: can seal a creature's dreams, preventing divination and prophetic dreams for 24 hours). Vulnerable to radiant (radiant damage dispels the darkness aura).",
          "stats": {
            "strength": 10,
            "agility": 16,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 130,
            "maxMana": 40,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "psychic": 75,
              "necrotic": 50
            }
          },
          "depth": "Acting as a Tree-Bride, each Mavka is bound to a specific willow whose growth reflects her mood, which the Neth monitor as a living archive since the tree's rings store her memories. Her dangerous Hollow-Back Secret draws onlookers to walk around her, only to be driven mad by the sight of her hollow interior, though the Vreken have learned a funeral chant to force her to turn away. Adventurers might be hired to protect Neth researchers or to harvest components from the Mavka's sacred tree.",
          "hooks": [
            "A rumor spreads of a Mavka spotted near the area.",
            "Adventurers need a component from a Mavka to complete their quest."
          ],
          "description": "A beautiful, leaf-clad dryad of the willows, the Mavka hides a hollow back and a mind-shattering secret.",
          "heritage": "Born from legends of women who died unnaturally, the Mavka served as a comforting explanation for untimely deaths, imagining them as beautiful forest spirits. The Wyrd anomaly reacted to this deep grief and the clearing of sacred willow groves, materializing these hollow-backed spirits to seductively lure men to their deaths."
        },
        {
          "id": "alkonost",
          "name": "Alkonost",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/alkonost.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Alkonost",
          "role": "Alkonost",
          "origin": "The Alkonost is derived from the Slavic Alkonost, a bird of paradise whose song brought total joy and oblivious peace, merged with the Hindu Gandharvas, celestial musicians who guarded sacred soma and inspired involuntary devotion. In Mythrill's damp canopy, she plays a divine melody that captures the light of dawn.",
          "nature": "Boasting a twenty-foot wingspan, this bird has the head, arms, and torso of a beautiful woman, with shifting rose, gold, violet, and blue plumage. She plays a divine lute that vibrates with the resonance of creation, weaving ribbons of golden light through the canopy while causing flowers to bloom on dead wood. Her face has perfect symmetry and glowing skin, with eyes holding the colors of the dawn and a beatific smile that has never known pain.",
          "habitat": "This celestial musician makes her home in the high branches of the Bryngloom Forest terrain.",
          "combat": "130 HP. Lying-Voice (passive: speaks in the voice of the target's most trusted person; DC 14 SPI or charmed for 1 round). Truth-Reversal (special: reverses the meaning of spoken words — a vow of protection becomes a vow of destruction, a curse becomes a blessing; DC 15 SPI or the reversal takes effect). Silver-Tongue (passive: words are silver; its lies sound more convincing than the truth; +4 to Deception). Mind-Maze (passive: creates false scenarios in the target's mind — DC 13 SPI or confused for 1d4 rounds). Vulnerable to radiant.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 16,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 130,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 30,
            "resistances": {
              "psychic": 50,
              "necrotic": 25
            }
          },
          "depth": "Known as the Joy-Singer, her song induces a state of euphoric oblivion, making it tempting to the contract-laden Neth. However, she is also a Memory-Thief, as every minute spent listening erases a year of the listener's past; these erased memories are stored in her dawn-colored feathers, which Vreken crypt-scholars seek to harvest for their secrets, offering a lucrative but highly dangerous task for adventurers who are hired when sightings are reported or when a specific component is needed.",
          "hooks": [
            "A rumor spreads of a Alkonost spotted near the area.",
            "Adventurers need a component from a Alkonost to complete their quest."
          ],
          "description": "A beautiful bird of paradise whose heavenly song brings total joy at the cost of the listener's memories.",
          "heritage": "Derived from paradise bird myths whose song brought oblivious joy, the Alkonost represented the hope of finding peaceful escape from the harsh cold of the forest. The Wyrd anomaly reacted to the settlers' desperation for relief from the Dimming, materializing this bird to sing melodies that induce peaceful slumber."
        },
        {
          "id": "dziwozona_wild",
          "name": "Dziwożona",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/dziwozona_wild.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Dziwożona",
          "role": "Dziwozona / Mamuna",
          "origin": "The Dziwożona stems from the Polish Dziwozona, a wild, green-haired swamp-nymph who drowned men and swapped infants, and Putana, the Vedic demoness who posed as a wet-nurse to poison the baby Krishna. In Mythrill's wetlands, she represents the cruel archetype of the false-mother who preys on grief.",
          "nature": "Standing seven feet tall, this massive, barrel-chested woman has wild green hair dripping with bog-water and large breasts that leak a luminescent fluid. Her skin resembles waterlogged grey-green wood, with webbed hands and feet, and she carries a swaddled bundle of stolen memories wrapped in Neth silk. Her face is flat and frog-like, featuring nose-holes, a wide mouth, and small pig-like eyes, though she can project an illusion of beauty that can fool even Neth truth-sense.",
          "habitat": "This deceptive swamp-dweller resides in the pools and rivers of the Bryngloom Forest terrain.",
          "combat": "75 HP. Thought-Mirror (passive: reflects the target's deepest fear as a mental image; DC 14 SPI or Frightened 1 round). Memory-Feast (passive: devours memories; each memory consumed restores 5 HP). Shadow-Eye (passive: flies ahead of its master, scouting; can communicate with its master telepathically up to 10 miles). Truth-Eye (passive: sees through all illusions and lies; +10 to Insight checks). Vulnerable to radiant.",
          "stats": {
            "strength": 6,
            "agility": 18,
            "constitution": 8,
            "intelligence": 18,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 75,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 10,
            "resistances": {
              "psychic": 75,
              "necrotic": 25
            }
          },
          "depth": "Acting as the False-Mother, she offers poisoned milk to grieving parents to put them into a permanent sleep before leaving a changeling of woven bog-grass in their place. Her actual amphibious offspring, the Substitute-Children, are left in human cradles and grow rapidly while devouring contract-paper, forcing Neth households to hunt these creatures down and retrieve their stolen kin before their archives are destroyed, providing a desperate hook for adventurers.",
          "hooks": [
            "A rumor spreads of a Dziwożona spotted near the area.",
            "Adventurers need a component from a Dziwożona to complete their quest."
          ],
          "description": "A grotesque water-woman who projects illusions of beauty, the Dziwożona targets families to swap children for ravenous changelings.",
          "heritage": "Rooted in Polish swamp-nymph myths, the Dziwożona was a warning story explaining infant changelings and why newborns sometimes fell sick. The Wyrd anomaly consolidated the parental fear of child theft and high infant mortality, materializing these green-haired spirits to swap infants and drown men."
        },
        {
          "id": "upir_root",
          "name": "Upir",
          "dangerLevel": "Extreme",
          "illustration": "/assets/images/creatures/upir_root.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Upir",
          "role": "Upir / Upyr",
          "origin": "The Upir draws from the ancient Slavic Upir, a blood-drinking vampire blamed for blighted fields and agricultural ruin, combined with the parasitic Vedic Bhuta, a restless spirit that anchored itself to the soil to drain the vitality of the living. In Mythrill's depths, it manifests as a literal blight upon the forest's hydrology.",
          "nature": "This creature appears as a skeletal, underground network of dark tendrils that spread from a central burial point, mimicking ironwood roots but pulsing with a slow heartbeat. Where they touch living roots, they leech nutrients to wither the tree above. At the center of the network, buried six feet deep, lies the original peat-preserved corpse with its eyes open, its mouth stretched in a silent scream, and root-tendrils sprouting from its mouth, eyes, and fingertips.",
          "habitat": "This parasitic entity spreads beneath the soil of the Bryngloom Forest terrain.",
          "combat": "650 HP. Blood-Root (passive: feeds on the blood of the living; its body is a network of blood-vessels that extend into the ground like roots). Life-Force-Drain (melee, +6 to hit, 2d6+4 necrotic + DC 14 CON or lose 1d4 CON permanently). Blood-Control (special: can control any creature that has drunk its blood; the controlled creature must DC 16 SPI or obey the Upir's commands for 1 hour). Regeneration (regenerates 15 HP per round; only radiant damage stops regeneration). Blood-Scry (passive: can see through any creature that has its blood in its veins — an entire spy-network). Sunlight-Weakness (passive: takes 2d6 radiant damage per round in direct sunlight). Vulnerable to radiant.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 18,
            "intelligence": 16,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 650,
            "maxMana": 50,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "necrotic": 100,
              "cold": 50,
              "physical": 25
            }
          },
          "depth": "Operating as a Root-Parasite, the Upir drains the life force of everything within a fifty-foot radius, causing trees to yellow and inducing severe fatigue in Neth travelers walking above. As the primary Blight-Cause in the forest, these infestations are targeted by the Neth Velun using contract-rituals to legally release the spirit's attachments, though adventurers are often needed to locate the buried center of the network or protect the ritualists from the spirit's defensive tendrils, especially if a component from the core is required.",
          "hooks": [
            "A rumor spreads of a Upir spotted near the area.",
            "Adventurers need a component from a Upir to complete their quest."
          ],
          "description": "An underground network of pulsing, parasitic tendrils, the Upir drains the life of the forest and travelers above it.",
          "heritage": "Derived from ancient Slavic vampire beliefs blamed for agricultural ruin and blighted crops, the Upir represented the fear of invisible soil blights. The Wyrd anomaly reacted to the drainage of peat-marshes and the rot of sacred willow roots, materializing this blood-drinking parasite to drain the life of the forest."
        },
        {
          "id": "sirin_song",
          "name": "Sirin",
          "dangerLevel": "Very High",
          "illustration": "/assets/images/creatures/sirin_song.png",
          "illustrationCaption": "A hand-drawn field sketch of the legendary Sirin",
          "role": "Sirin",
          "origin": "The Sirin represents the dark Slavic Sirin, whose beautiful but sorrowful song led listeners to willingly cease living, combined with the Hindu Navagraha, the nine cosmic forces that dictate the path of destiny. In Mythrill's deepest forest, she acts as a tragic weaver of fate and a harbinger of the end.",
          "nature": "Having a twenty-foot wingspan, this bird-like entity has the head and upper torso of a gorgeous woman, with dark twilight plumage of indigo, violet, and black shot with silver threads. Her song projects ribbons of shadow that dim all light and drop the temperature, while she holds nine silver threads representing the aspects of fate. Her face is the most beautiful in the realm, permanently still with eyes closed to hide the overwhelming sight of all time, her lips constantly moving to hum her terrible, perfect song.",
          "habitat": "This mournful singer resides at the convergence of the bog and forest in the Bryngloom Forest terrain.",
          "combat": "380 HP. Soul-Song (passive: its song contains the final words of every dead person — the last thing they said before dying; the song changes continuously as new people die). Sorrow-Aura (passive: creatures within 30 ft must DC 14 SPI or gain 1 level of exhaustion from overwhelming grief). Death-Prophecy (passive: its song foretells the manner of death for everyone within hearing range; the prophecy is always accurate). Song-of-Death (passive: those who hear the full song die of heartbreak within 24 hours — only those with strong willpower (SPI 16+) can resist). Healing-Tears (passive: weeps tears of light that can heal wounds and cure diseases; 2d6 radiant healing to one creature per round). Vulnerable to necrotic.",
          "stats": {
            "strength": 6,
            "agility": 16,
            "constitution": 10,
            "intelligence": 16,
            "spirit": 22,
            "charisma": 18,
            "maxHp": 380,
            "maxMana": 60,
            "maxActionPoints": 3,
            "speed": 10,
            "resistances": {
              "radiant": 100,
              "psychic": 100,
              "necrotic": 25
            }
          },
          "depth": "Performing the Death-Song at the forest's deepest core, her voice is the sound of the Keeper of the Last Threshold, driving listeners to sit down and peacefully surrender to the swamp. As the Fate-Weaver, she manipulates nine threads representing elements like birth, contract, and dissolution to shape destinies, prompting the Neth to avoid her at all costs and providing a legendary challenge for any adventurers who dare seek her tears or seek to alter a predetermined doom, or if a sighting prompts a high-stakes investigation.",
          "hooks": [
            "A rumor spreads of a Sirin spotted near the area.",
            "Adventurers need a component from a Sirin to complete their quest."
          ],
          "description": "A dark bird of twilight with a heart-breaking face, the Sirin sings a melody of absolute melancholy that pulls listeners toward their final rest.",
          "heritage": "Rooted in dark bird-of-paradise legends, the Sirin represented the personification of deep, overwhelming sorrow that drove listeners to surrender their lifelines. The Wyrd anomaly consolidated the raw wails of grief from mourning households, materializing this bird-like entity to sing perfect, heart-breaking songs of mortality."
        }
      ]
    }
  ]
};
