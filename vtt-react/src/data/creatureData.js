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
          "illustrationCaption": "A sketch of Gref in its natural environment",
          "role": "The merchant of forgotten things",
          "origin": "A wandering spirit formed from the collective memory of items left behind in the fog. It does not steal; it collects and trades.",
          "nature": "A small, stooped humanoid pushing a wooden cart filled with lost keys, old letters, and rusty tools. It offers these lost items to travelers in exchange for memories.",
          "habitat": "Misty crossroads in the Frostwood Reach at twilight.",
          "combat": "Flees if attacked (40 HP). Its masks can be thrown as distractions (Charm Person, single target, DC 12). Overturning its cart releases 2d6 trapped faces that fly back to their original owners — who may not want them back.",
          "stats": {
            "strength": 8,
            "agility": 14,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 16,
            "maxHp": 40,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "It is peaceful and harmless. It simply wishes to return lost objects to those who can recall their significance.",
          "hooks": [
            "A noble's son bought a face and can no longer remove it. The party must find the Gref and negotiate the return — but the son has forgotten who he was without the mask.",
            "The Gref knows the location of every soul lost in the fog. A grieving widow wants to know if her husband still lives. The Gref will trade — for a face of equal value.",
            "A village has been found empty, every inhabitant wearing identical masks. The Gref visited three nights ago. The party must find which villager started the trade."
          ]
        },
        {
          "id": "vetch",
          "name": "Vetch",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/vetch.png",
          "illustrationCaption": "A sketch of Vetch in its natural environment",
          "role": "The path sprite",
          "origin": "A small woodland spirit shaped by the natural game trails of the Frostwood Reach.",
          "nature": "A quick, scurrying sprite made of twigs and dry leaves. It runs ahead of travelers, mimicking animal trails to guide them safely through the fog.",
          "habitat": "Thick undergrowth and mossy paths.",
          "combat": "20 HP. Cannot deal damage directly. Each round it moves 60 ft in a direction that seems purposeful — any creature that follows it must make a DC 10 INT check or lose their sense of direction for 1d4 hours. Its twig-body can be crushed (vulnerability to bludgeoning), releasing a burst of stolen memories (2d6 psychic, DC 12 WIS half) that reveal fragments of where the Vetch has led others.",
          "stats": {
            "strength": 4,
            "agility": 18,
            "constitution": 8,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 20,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 60,
            "resistances": {
              "psychic": 75
            },
            "vulnerabilities": {
              "bludgeoning": 100
            }
          },
          "depth": "Entirely benign and easily startled. It will flee if approached too quickly.",
          "hooks": [
            "A Vetch has been leading merchant caravans into a Briaran ambush. The Briaran did not command the Vetch — the fog simply found their hiding spot interesting. Determine whether the Briaran know they are being \"helped.\"",
            "Follow a Vetch deliberately. It will lead you somewhere — but you must decide if the destination is worth losing a day's travel. Some Vetch lead to caches of forgotten supplies. Others lead to Gambrel groves.",
            "A Thalren archivist discovered that crushing a Vetch releases the memories of every path it ever walked. She wants the party to capture one alive — but the Vetch becomes suicidal when cornered, and a dead Vetch remembers nothing."
          ]
        },
        {
          "id": "moot",
          "name": "Gloomwood Warden",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/moot.png",
          "illustrationCaption": "A sketch of Gloomwood Warden in its natural environment",
          "role": "Guardian of the forest boundaries",
          "origin": "Born from the ancient treaties sworn between the first human settlers and the forest spirits.",
          "nature": "A majestic, moss-draped elk whose antlers are hung with old stone tablets and copper keys. It stands at the edges of sacred groves, turning back intruders with a low warning call.",
          "habitat": "Ancient forest clearings and boundaries.",
          "combat": "110 HP. Each encounter begins with the Moot announcing a charge (DC 14 CHA to present a defense — roleplay, not combat). If the defense satisfies the Moot, it steps aside. If it detects deception or the defense fails, combat begins. Gavel Strike (2d8+4 bludgeoning + DC 15 CHA save or lose 3 CHA for 2 rounds as false guilt sets in). Recite the Charges (30-ft cone, 3d6 psychic, DC 14 INT save or stunned 1 round). Contempt of Court (single target, DC 14 STR save or restrained 2 rounds by spectral juror-hands). Resistant to psychic damage — you cannot shame it.",
          "stats": {
            "strength": 14,
            "agility": 12,
            "constitution": 16,
            "intelligence": 16,
            "spirit": 14,
            "charisma": 18,
            "maxHp": 110,
            "maxMana": 40,
            "maxActionPoints": 5,
            "speed": 30,
            "resistances": {
              "psychic": 50
            },
            "vulnerabilities": {
              "radiant": 50
            }
          },
          "depth": "It represents the preservation of bounds and only acts defensively if its grove is defiled.",
          "hooks": [
            "The Moot has blocked the only road to a plague-stricken village. It announces that the village's elder is guilty of \"conspiracy of breath.\" The party must either defend the elder in a trial the Moot takes seriously, or fight through it.",
            "A Moot has appeared inside Greymark Keep itself, announcing charges against House Thalreth. The nobles want it destroyed quietly — but destroying a Moot releases every verdict it carried back into the fog, where they become whispers that accuse everyone.",
            "The Moot's gavel is made of petrified ironwood from a Briaran hanging-tree. Return it to the tree and the Moot may dissolve — but the Briaran who planted that tree may not want the reminder."
          ]
        },
        {
          "id": "gallows-wood",
          "name": "Gloomwood Treant",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/gallows-wood.png",
          "illustrationCaption": "A sketch of Gloomwood Treant in its natural environment",
          "role": "The weeping ironwood",
          "origin": "An ancient ironwood tree that has absorbed the thick mist and mineral runoff of the mountains.",
          "nature": "A massive, gnarled tree with weeping, vine-like branches that hang low to the ground. It reacts defensively to loud noises and fire, sweeping its heavy vines to ensnare trespassers.",
          "habitat": "Deep ironwood groves.",
          "combat": "220 HP, immune to poison and 75% resistant to psychic. Immovable — speed 0. Gallows Drop (30 ft reach, 2d10+5 bludgeoning, DC 16 AGI save or restrained for 2 rounds as a noose-vine hoists the target into the canopy — restrained targets take 1d6 bludgeoning per round from the vine). Root Surge (30-ft radius, 4d8 bludgeoning, DC 15 AGI half, and DC 15 STR or prone). Bark Sentence (40-ft radius, 3d8 psychic, DC 16 SPI save or frightened for 2 rounds — the faces in the bark scream the condemned's last words). Briaran Hardening (self-buff, +4 defense for 3 rounds). Fire vulnerability — the ironwood burns if the bark is breached.",
          "stats": {
            "strength": 20,
            "agility": 6,
            "constitution": 20,
            "intelligence": 10,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 220,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 0,
            "resistances": {
              "physical": 50,
              "poison": 100,
              "psychic": 75
            },
            "vulnerabilities": {
              "fire": 100,
              "radiant": 50
            }
          },
          "depth": "It is a plant reacting to environmental threats rather than a malicious hunter.",
          "hooks": [
            "The only path to a Sundered Monolith fragment leads through a Gallows-Wood grove. The Briaran will not enter. The party must decide: burn the grove (destroying irreplaceable evidence of the purges), fight through it (facing the noose-vines and screaming bark), or find a Briaran willing to confess what the grove remembers.",
            "The faces in the bark can speak if questioned gently with genuine compassion. Each face reveals the name of the person who turned them in — and some of those names belong to Briaran elders who still live. One elder will pay any price to keep the grove silent.",
            "The noose-vines, if cut rather than burned, produce a living rope that remembers how to bind only the guilty. A Thalreth inquisitor wants this rope for her trials — but harvesting it requires surviving the Gallows-Wood's judgment."
          ]
        },
        {
          "id": "gambrel",
          "name": "Briar Stalker",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/gambrel.png",
          "illustrationCaption": "A sketch of Briar Stalker in its natural environment",
          "role": "Guardian of the thorns",
          "origin": "A bramble-woven elemental shape formed to protect and reclaim cleared forest land.",
          "nature": "A slender humanoid figure made of woven brambles and sharp thorns. It remains motionless in thickets, warning away woodcutters with dry rustling sounds.",
          "habitat": "Thorny thickets and crossroads.",
          "combat": "100 HP. Her vines create difficult terrain in a 30-ft radius (DC 14 STR or grappled). She can teleport between any two thorn-vines within 60 ft. Her blood-briar strike deals 2d8+4 piercing and forces the target to confess one secret (DC 15 WIS or stunned for 1 round with shame).",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 100,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 30,
            "vulnerabilities": {
              "fire": 50
            }
          },
          "depth": "It protects its nesting grounds and is peaceful if left unprovoked.",
          "hooks": [
            "A village is trapped behind a wall of her thorns — someone among them broke an oath. Find the oathbreaker and bring them to confess before the thorns tighten.",
            "The Briaran elders know a ritual that can unbind her knots using the true name of a forgotten fae. The party must journey to the old fae roads to learn it.",
            "She holds a piece of information the party needs — a location, a name, a secret — and will trade it for a genuine confession from someone who has wronged her."
          ]
        },
        {
          "id": "revel",
          "name": "Gloomwood Hounds",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Gloomwood Hounds",
          "role": "Ethereal mist wolves",
          "origin": "Steppe wolves that wandered into the deep fog and adapted to hunt as a coordinated pack.",
          "nature": "Ethereal wolves whose fur shifts like mist, blending perfectly into the whiteout. They hunt in packs, using coordinated flanking maneuvers.",
          "habitat": "Open woods and misty cols.",
          "combat": "The court functions as a single entity with 250 HP. Legendary actions (3). The Mist-Hounds (6, each) are extensions of the Revel's will. The Revel's dance aura (60 ft) forces a DC 16 WIS save or the target must dance — spending their action to move toward the Revel. If all four hounds are killed, the Revel dissipates until the next moonless night.",
          "stats": {
            "strength": 12,
            "agility": 18,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 18,
            "charisma": 20,
            "maxHp": 250,
            "maxMana": 60,
            "maxActionPoints": 6,
            "speed": 50,
            "resistances": {
              "psychic": 75,
              "cold": 50
            },
            "vulnerabilities": {
              "radiant": 50
            }
          },
          "depth": "They are natural predators, hunting for survival rather than malice.",
          "hooks": [
            "A performer accepted their invitation. The party must enter the Revel during the height of the ball and retrieve them before dawn — without accepting the dance themselves.",
            "The Revel passes through the same grove every 13th moon. The Briaran know how to petition them for a boon — but the price is always a dance, and no one has ever danced with the Revel and returned unchanged.",
            "The party believes the Court holds a shard-fragment woven into the crown of its king. Sever the Wyrd-node that animates the Revel and the dancers may finally rest — or they may simply collapse into ash."
          ]
        },
        {
          "id": "pooka",
          "name": "Pooka",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Pooka",
          "role": "The hedge sprite",
          "origin": "A wild fey creature of Celtic-Grimm folklore.",
          "nature": "A mischievous shapeshifting sprite that takes the form of a sleek black pony or a wild hare. It enjoys leading travelers on wild, fast chases through the woods but avoids causing direct harm.",
          "habitat": "Hedges and forest edges at twilight.",
          "combat": "80 HP. Cannot attack directly. Lure of the Briar (DC 13 WIS save or charmed, climbing on its back or following it into difficult terrain). Gallop of Panic (dashes 80 ft, carrying a grappled/charmed rider into brambles dealing 2d6 piercing damage). Fleeing form: when reduced to 0 HP, vanishes in a gust of dry leaves.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 14,
            "maxHp": 80,
            "maxMana": 30,
            "maxActionPoints": 4,
            "speed": 50,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "A mischievous but ultimately harmless trickster.",
          "hooks": [
            "A traveler's horse was replaced by a Pooka. The traveler has been missing for two days, last seen riding wildly into the deepest thornwoods.",
            "The Pooka knows the true path through the shifting briars of a Gambrel grove. To earn its guidance, the party must solve its riddle or trade a story of a broken promise.",
            "A child has befriended a Pooka in hare form, unaware of its nature. The party must intervene before the Pooka takes the child on a twilight run."
          ]
        }
      ]
    },
    {
      "id": "nordhalla",
      "name": "Nordhalla & The Valley of Ymir",
      "folklore": "Norse + Alpine",
      "creatures": [
        {
          "id": "rimor",
          "name": "Hearth Sprite",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/rimor.png",
          "illustrationCaption": "A sketch of Hearth Sprite in its natural environment",
          "role": "The ash imp",
          "origin": "A tiny elemental sprite born from fireplace ash and cold air.",
          "nature": "A small, soot-covered imp that nests in the chimneys of longhouses. It plays minor pranks, like blowing out candles or hiding tinder, but is easily chased away by a bright fire.",
          "habitat": "Chimneys, stoves, and hearth walls.",
          "combat": "25 HP. Can cling to any surface and siphons heat from living creatures within 10 ft (1 cold damage per round + target loses sense of temperature). Fears open flame — will flee if cornered with a torch. Its nest contains 1d4 small warm objects (heirloom rings, heated stones, preserved coals).",
          "stats": {
            "strength": 6,
            "agility": 14,
            "constitution": 8,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 6,
            "maxHp": 25,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "cold": 100
            },
            "vulnerabilities": {
              "fire": 100
            }
          },
          "depth": "A domestic nuisance that can be pacified with small offerings of firewood.",
          "hooks": [
            "A family was found frozen in their own home, fire still burning. The party must track the Rimor to its nest — it has grown bold because the family neglected the old traditions.",
            "The Skald know that Rimor-spoor can be smoked out using dried skaldfire moss, which only grows on the cliffs of the eastern fjords — a dangerous climb.",
            "Offer the Rimor a dedicated hearth of its own. If the family maintains it, the Rimor becomes a guardian against worse Wyrd-creatures — a permanent but uneasy arrangement."
          ]
        },
        {
          "id": "kjarn",
          "name": "Glacial Golem",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/kjarn.png",
          "illustrationCaption": "A sketch of Glacial Golem in its natural environment",
          "role": "Ice construct",
          "origin": "An ancient construct carved from glacial runic stone and packed ice.",
          "nature": "A massive elemental of stone and blue ice that patrols old ruins, acting as a tireless guardian.",
          "habitat": "Glacial cols and mountain peaks.",
          "combat": "15 HP. Cannot deal damage. Each round it drains 1d4 HP from the nearest living creature within 5 ft (cold damage, no save — it is simply colder than you). If killed, it shatters into harmless frost-dust. Cannot be harmed by cold or physical attacks (immune). Vulnerable to fire — a torch kills it instantly. Its ice-needle legs leave a trail of frost-flowers that last for 1d6 hours — Skald children collect them as keepsakes.",
          "stats": {
            "strength": 2,
            "agility": 16,
            "constitution": 14,
            "intelligence": 2,
            "spirit": 8,
            "charisma": 2,
            "maxHp": 15,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "physical": 75
            },
            "vulnerabilities": {
              "fire": 100
            }
          },
          "depth": "A mindless protector following its ancient runic commands.",
          "hooks": [
            "A Skald child has been \"adopted\" by a swarm of Kjarn — fifteen of them follow her everywhere, keeping her perpetually cold. The Frostbound say this is a gift. The Bloodhammer say it is a death sentence. The child does not seem bothered.",
            "A Kjarn swarm has migrated from the lower sumps into the Frozen Archive, settling on the ancient brass cylinders. The Rune Keepers fear the cold will crack the cylinders — but they also notice the Kjarn are drawn to specific cylinders, as if the machines inside are generating warmth.",
            "The Frostbound have learned to trap Kjarn in obsidian jars, creating portable cold-sources. A Bloodhammer warrior wants a jar to cool his forge-rage. The Frostbound refuse — the Kjarn are not tools."
          ]
        },
        {
          "id": "huld",
          "name": "Fjord Troll",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Fjord Troll",
          "role": "Mountain dweller",
          "origin": "A standard mountain troll species native to the northern peaks.",
          "nature": "A thick-skinned, mossy troll that blends into rocky hillsides. It is territorial but keeps to its caves unless provoked.",
          "habitat": "Fjord cliffs and rocky peaks.",
          "combat": "130 HP. Immune to cold. Each round she can emit a Pulse of Archive Memory (30-ft cone, 3d6 psychic, DC 15 INT save — those who fail see a random memory from the Archive flash through their mind, gaining +2 INT for 1 round but losing 1d4 HP as the memory burns neural pathways). Rune-Lock (single target, DC 16 AGI save or paralyzed for 1 round as brass bands clamp around limbs). Bone-Shatter Slam (2d10+5 bludgeoning, reach 10 ft). At half HP, her bands flare and she enters Archive Frenzy — attacks twice per round but cannot use Pulse. Vulnerable to fire — heat warps the brass and disrupts the runes.",
          "stats": {
            "strength": 16,
            "agility": 10,
            "constitution": 18,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 6,
            "maxHp": 130,
            "maxMana": 20,
            "maxActionPoints": 5,
            "speed": 20,
            "resistances": {
              "cold": 100,
              "psychic": 50
            },
            "vulnerabilities": {
              "fire": 75
            }
          },
          "depth": "Standard mountain beast that defends its territory.",
          "hooks": [
            "The party needs information from a brass cylinder the Huld guards. They can fight her, try to read her rune-bands to learn her story and pacify her through understanding, or offer her a memory to trade — the first memory she has been offered in forty years.",
            "A young Rune-Keeper has gone missing in the deep Archive. The Bloodhammer assume the cold got her. The Rune Keepers know better — she went looking for Huldveig and found the Huld. The Huld may have taken her in, interpreting her as a new cylinder to guard.",
            "The brass bands on the Huld are inscribed with the contents of a cylinder that was lost centuries ago. If the bands can be read and transcribed, the knowledge is recovered — but removing the bands may kill the Huld, and she is technically still alive inside all that metal and bone."
          ]
        },
        {
          "id": "skrei",
          "name": "Snow Eagle",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Snow Eagle",
          "role": "Glacial hunter",
          "origin": "A large, white-feathered eagle native to the high fjords.",
          "nature": "A majestic raptor that hunts mountain goats and small game, nesting high on sheer cliffs.",
          "habitat": "Glacial peaks and cliff edges.",
          "combat": "200 HP per Skrei. Always encountered in groups of 2d4. Cold Aura (10 ft, 1d6 cold per round, no save — simply being near them freezes blood). Hauling Grip (melee, 2d8+5 cold damage, DC 15 STR or grappled and dragged 15 ft toward the nearest water). Barnacle Hide (immunity to piercing and slashing, vulnerability to bludgeoning — the barnacles shatter under impact). Death Rattle (when a Skrei dies, it releases a scream in the voice of the person it was, 30 ft, DC 14 SPI save or frightened for 1 round). If dragged into water, they regenerate 10 HP per round.",
          "stats": {
            "strength": 18,
            "agility": 8,
            "constitution": 20,
            "intelligence": 6,
            "spirit": 4,
            "charisma": 2,
            "maxHp": 200,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 20,
            "resistances": {
              "cold": 100,
              "piercing": 100,
              "slashing": 100
            },
            "vulnerabilities": {
              "bludgeoning": 75,
              "fire": 50
            }
          },
          "depth": "A natural bird of prey.",
          "hooks": [
            "A Skrei haul has emerged in the fjord nearest the Frozen Archive. The Rune Keepers want them stopped before they reach the Archive's lower sumps — the salt water would corrode the brass cylinders. The Bloodhammer refuse to interfere: the dead have a right to surface.",
            "One of the Skrei is wearing a Skald Rune-Keeper's brass bands. The bands contain the location of a buried pre-bargain settlement. The party must recover the bands without destroying the Skrei — or accept the consequences.",
            "A Bloodhammer elder recognizes a Skrei as his grandfather. He wants to perform the return-ritual personally. But his grandfather's name-song was never recorded — it was traded to the Archive decades ago. The party must find the cylinder that holds the song before the next freeze."
          ]
        },
                {
          "id": "skerry",
          "name": "Skerry",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/skerry.png",
          "illustrationCaption": "A Skerry clinging to a frozen dock piling, its eyes gleaming with the reflection of stolen gold",
          "role": "The drowned-greed shipwright",
          "origin": "Born from Norse myths of Andvari—the treasure-hoarding water dwarf—and maritime tales of the Klabautermann. The Skerries are stout, dwarf-like sea sprites driven by an insatiable greed for salvaged metal and gold.",
          "nature": "A stout, broad water-sprite with waterlogged blue-grey skin like wet oak. It wears a coat of salvaged sailcloth and copper sheeting. Its webbed fingers end in chisel-like claws of copper. Highly skilled in shipbuilding, it listens to the stresses in ship hulls and demands silver or gold to make repairs; if cheated, it actively sabotages the vessel.",
          "habitat": "Frozen bays, ice-locked docks, and sunken shipwrecks in Nordhalla.",
          "combat": "120 HP. Rivet Hammer (melee, 2d8+4 bludgeoning, ignores 4 points of physical damage reduction). Pry Timber (damages ships or structural defenses, deals double damage to wooden objects). Gild-Grip (target's movement speed is reduced by 10 ft for each piece of metal equipment or coin purse they carry, DC 13 CON negates). Vulnerable to fire.",
          "stats": {
            "strength": 16,
            "agility": 12,
            "constitution": 16,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 120,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "cold": 100,
              "physical": 25
            },
            "vulnerabilities": {
              "fire": 50
            }
          },
          "depth": "Sailors and shipwrights in Nordhalla keeps respect the Skerries. They throw copper coins into the icy water before docking, as the cost of a clean repair is far cheaper than a sudden hull breach in the freezing open sea.",
          "hooks": [
            "A wealthy trading cog sank just outside the harbor. The local Skerries have blockaded the wreck, claiming the cargo as their sovereign hoard and dragging salvage divers down.",
            "A Skerry was cheated of its pay by a corrupt harbormaster. In revenge, it has begun systematically loosening the hull rivets of every boat in the harbor.",
            "An ancient, titanic Skerry has surfaced near the fjord mouth, dragging driftwood and sunken anchors to build a massive, gold-adorned shore-shrine that blockades the shipping lanes."
          ]
        },
        {
          "id": "jawl",
          "name": "Frost Serpent",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Frost Serpent",
          "role": "Subterranean hunter",
          "origin": "A large serpentine beast that burrows through the loose snow and shale of the mountains.",
          "nature": "A legless reptile that hunts by sensing vibrations through the rock.",
          "habitat": "Subterranean caves and snowbanks.",
          "combat": "Cannot move. The jawbone itself has 300 HP and is immune to all damage except radiant. Each round it can target one creature with a question (DC 18 WIS or take 4d10 psychic damage as the answer is forced into the mind). Frozen guardians (6, each) defend the approach. If the Jawl is destroyed, it releases a shockwave of ancient memory (10d10 psychic, half on DC 20 WIS save).",
          "stats": {
            "strength": 0,
            "agility": 0,
            "constitution": 20,
            "intelligence": 20,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 300,
            "maxMana": 80,
            "maxActionPoints": 3,
            "speed": 0,
            "resistances": {
              "cold": 100,
              "psychic": 75,
              "physical": 75
            },
            "vulnerabilities": {
              "radiant": 100
            }
          },
          "depth": "A natural predator of the deep cols.",
          "hooks": [
            "The party needs ancient knowledge to locate the region's shard. The Jawl knows where it is. Who will pay the price in years?",
            "The Jawl respects creatures that outwit it. A game of riddles with stakes — each wrong riddle costs a memory, each correct answer reveals a truth.",
            "The Skald believe the jawbone belongs to a larger skeleton. Find the rest of it and lay the bones together — the Jawl may finally be silenced, or it may wake completely and walk."
          ]
        },
        {
          "id": "tatzelwurm",
          "name": "Tatzelwurm",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Tatzelwurm",
          "role": "Alpine cleft drake",
          "origin": "A cat-headed serpentine drake inhabiting deep crevasses.",
          "nature": "A rare serpentine dragon that hunts alpine rodents. It is venomous but reclusive.",
          "habitat": "Glacial crevasses and rocky cols.",
          "combat": "90 HP. Poisonous Breath (15-ft cone, 2d6 cold + 1d6 poison, DC 13 CON half). Leap Strike (leaps up to 20 ft, dealing 2d8+3 slashing with claws, DC 12 AGI or knocked prone). Runic scales (resistant to cold and poison).",
          "stats": {
            "strength": 12,
            "agility": 16,
            "constitution": 14,
            "intelligence": 6,
            "spirit": 10,
            "charisma": 4,
            "maxHp": 90,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 35,
            "resistances": {
              "cold": 100,
              "poison": 50
            },
            "vulnerabilities": {
              "fire": 50
            }
          },
          "depth": "Reclusive dragon species.",
          "hooks": [
            "A pack of Tatzelwurms has nested in a critical pass, preventing the migration of a Skald caravan. Clear the pass before the next blizzard hits.",
            "An alchemist wants a live Tatzelwurm to study its cold-poison gland. Capturing one alive requires finding its den without collapsing the snow-bridge above.",
            "A Tatzelwurm has swallowed a runic brass cylinder from the Frozen Archive. Track it to its icy cave and recover the cylinder."
          ]
        }
      ]
    },
    {
      "id": "sundale",
      "name": "Sundale & Emberspire",
      "folklore": "Mesopotamian/Zoroastrian + Egyptian",
      "creatures": [
        {
          "id": "cinder",
          "name": "Cinder Sprite",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/cinder.png",
          "illustrationCaption": "A sketch of Cinder Sprite in its natural environment",
          "role": "Fire elemental",
          "origin": "A tiny flame spirit born from active volcanic vents.",
          "nature": "A floating, warm orb of ash and fire that drifts near hot springs.",
          "habitat": "Volcanic vents and hot springs.",
          "combat": "15 HP, cannot be harmed by fire. If attacked, it releases a burst of ash (1 round, obscured in 10-ft radius) and flees. It can be captured in an obsidian jar — it becomes a permanent light source that never extinguishes but always points toward the nearest danger.",
          "stats": {
            "strength": 2,
            "agility": 12,
            "constitution": 8,
            "intelligence": 8,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 15,
            "maxMana": 10,
            "maxActionPoints": 2,
            "speed": 20,
            "resistances": {
              "fire": 100
            }
          },
          "depth": "Completely harmless unless touched.",
          "hooks": [
            "Follow it to find a lost caravan. It led them to a geothermal vent — they died of dehydration a mile from water, their last expressions peaceful.",
            "Capture it in a jar of obsidian and volcanic glass. It becomes a compass that always points toward the nearest warm thing — including hidden vents, lava flows, and the dying.",
            "The Emberth know a ritual to unmake it: return it to Solbrand-touched ground. The party must carry it to the heart of Emberspire, where the Cinder may finally be released — or rejoin the Solbrand."
          ]
        },
        {
          "id": "ashwen",
          "name": "Ash Hound",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/ashwen.png",
          "illustrationCaption": "A sketch of Ash Hound in its natural environment",
          "role": "Volcanic beast",
          "origin": "A standard canine species native to the warm basalt flats.",
          "nature": "A quick, fire-resistant hound with smoldering fur that hunts in small packs.",
          "habitat": "Basalt flats and hot springs.",
          "combat": "30 HP (molten stone). Immune to fire and physical attacks (liquid stone absorbs impacts). Vulnerable to cold — any frost damage solidifies a section, dealing damage equal to the cold damage rolled. Cannot deal direct damage, but any creature that touches it takes 1d8 fire damage per round of contact (no save — it is simply hot). If killed by cold, it shatters into usable obsidian shards (worth 2d6 gold).",
          "stats": {
            "strength": 0,
            "agility": 6,
            "constitution": 18,
            "intelligence": 2,
            "spirit": 4,
            "charisma": 2,
            "maxHp": 30,
            "maxMana": 0,
            "maxActionPoints": 1,
            "speed": 10,
            "resistances": {
              "fire": 100,
              "physical": 100
            },
            "vulnerabilities": {
              "cold": 100,
              "frost": 100
            }
          },
          "depth": "A natural canine predator.",
          "hooks": [
            "An Ashwen flow has broken into a Thrask settlement's water-cistern, boiling the reserves. The party must redirect the flow using cold-resistant materials before the settlement runs dry.",
            "The Emberth Unwoven believe a specific Ashwen flow leads to a hidden entrance in Emberspire's secondary caldera. Follow it, but it moves slowly — and the surrounding ash-wastes are full of Husque.",
            "A Korr Sun-Speaker wants the party to capture an Ashwen alive in a cold-resistant vessel. She claims it can be returned to the Solbrand as an offering — the first new ember in centuries."
          ]
        },
        {
          "id": "nekh",
          "name": "Fire Beetle",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/nekh.png",
          "illustrationCaption": "A sketch of Fire Beetle in its natural environment",
          "role": "Volcanic insect",
          "origin": "A giant beetle species feeding on sulfuric minerals.",
          "nature": "A slow, heavily-armored insect with a glowing shell that lives near hot vents.",
          "habitat": "Sulfuric mines and hot tunnels.",
          "combat": "75 HP. Clay Body (immune to poison, psychic, and necrotic — it has no organs to poison, no mind to wound). Sweeping Strike (melee, 1d8+3 bludgeoning with a clay arm, DC 12 AGI save or knocked prone — it is sweeping). Ash Cloud (15-ft radius, DC 12 CON save or blinded for 1 round). Guardian Protocol (if it witnesses a creature attempting to open a container, door, or tomb it guards, it enters a rage: +4 STR, +2 damage, but -4 defense for 3 rounds). When destroyed, it crumbles into clay dust, releasing a burst of compressed ash (10-ft radius, DC 10 CON or choking for 1 round).",
          "stats": {
            "strength": 16,
            "agility": 8,
            "constitution": 16,
            "intelligence": 4,
            "spirit": 2,
            "charisma": 4,
            "maxHp": 75,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 20,
            "resistances": {
              "poison": 100,
              "psychic": 100,
              "necrotic": 100
            },
            "vulnerabilities": {
              "bludgeoning": 50
            }
          },
          "depth": "Harmless miner-insect.",
          "hooks": [
            "A Nekh guards the entrance to a pre-bargain Solvarn tomb that was never properly catalogued. Inside may be artifacts from before the Dimming. The Nekh will not yield — but if the party can determine the original burial ritual and perform it, the Nekh may open the door willingly.",
            "A Thrask settlement has adopted a Nekh that sweeps their streets. The Korr are furious — they believe the Nekh is a sacred object, not a tool. The conflict between Thrask pragmatism and Korr devotion is dividing the settlement.",
            "A Nekh has begun a new task — one it was never assigned. It is building something from volcanic glass and ash in the wastes. The structure is enormous and the Nekh has been at it for months. No one knows what it is building or why it started."
          ]
        },
        {
          "id": "emberveil",
          "name": "Magma Salamander",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/emberveil.png",
          "illustrationCaption": "A sketch of Magma Salamander in its natural environment",
          "role": "Fire reptile",
          "origin": "A large amphibian thriving in high geothermal heat.",
          "nature": "A thick-skinned lizard that swims through magma pools and feeds on basalt coal.",
          "habitat": "Lava flows and volcanic calderas.",
          "combat": "250 HP. Immune to fire, cold, and radiant (it IS light). Formless — immune to critical hits and precision damage. Ember Shift (each round it changes form: humanoid form grants +4 CHA to all abilities, serpent form grants +4 AGI and reach 15 ft, lion form grants +4 STR and melee damage, fire-pillar form grants AoE). Molten Weep (single target, 3d10 fire damage + DC 16 CON save or burning for 3 rounds — 1d6 fire per round). Solbrand Echo (60 ft radius, 4d8 radiant, DC 18 SPI save, those who fail are blinded for 1 round — the light is too bright). At half HP, it begins to Dim — all damage reduction ends and it takes double damage from all sources, but its attacks deal triple damage. Vulnerable to void and shadow damage — the light can be consumed by darkness.",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 16,
            "intelligence": 18,
            "spirit": 20,
            "charisma": 20,
            "maxHp": 250,
            "maxMana": 60,
            "maxActionPoints": 6,
            "speed": 30,
            "resistances": {
              "fire": 100,
              "cold": 100,
              "radiant": 100,
              "physical": 25
            },
            "vulnerabilities": {
              "void": 75,
              "shadow": 75
            }
          },
          "depth": "Peaceful if left unbothered.",
          "hooks": [
            "The Emberveil has extended a tendril of ember-light into the lower Vault tunnels. The Korr want the party to follow it and report what they find. The Thrask want the party to sever the tendril before whatever it touches is infected. The Unwoven want the party to capture a piece of it for study.",
            "The Emberveil wept a perfect obsidian sphere that shows a vision of the moment Keth-Amar first breached the seal. The sphere is in the possession of a Thrask ranger who found it. The Korr want it back — they believe the Emberveil chose to show this vision for a reason.",
            "The Emberveil is dying — its light dims a little more each year. The Korr are performing the Vault-Breath more intensely to sustain it, which is draining the Solbrand faster. The Unwoven have proposed a radical solution: carry the Emberveil to the breach-point in Emberspire and let it choose — return to Sol or fall into Keth-Amar."
          ]
        },
        {
          "id": "croon",
          "name": "Phoenix Sentinel",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/croon.png",
          "illustrationCaption": "A sketch of Phoenix Sentinel in its natural environment",
          "role": "Sun-altar guardian",
          "origin": "A rare fire-bird native to the ruins of old sun altars.",
          "nature": "A beautiful bird of crimson feathers and warm embers that watches over ancient ruins.",
          "habitat": "Ruined sun altars and high peaks.",
          "combat": "90 HP. Immune to fire and poison. Each round she weaves 1d4 threads that can be thrown as psychic projectiles (2d6 psychic). Her croon requires a DC 14 CON save each round or the target is hypnotized, moving toward her. Taking a tapestry without payment triggers her wrath: she animates 2 obsidian shard golems (each) from the cooling glass around her.",
          "stats": {
            "strength": 10,
            "agility": 14,
            "constitution": 12,
            "intelligence": 16,
            "spirit": 18,
            "charisma": 14,
            "maxHp": 90,
            "maxMana": 50,
            "maxActionPoints": 5,
            "speed": 10,
            "resistances": {
              "fire": 100,
              "poison": 100
            },
            "vulnerabilities": {
              "cold": 50
            }
          },
          "depth": "Revered as a symbol of renewal.",
          "hooks": [
            "The party needs a prophecy to navigate the caldera safely. Offer a memory — it must be a painful one. The Croon feeds on regret, and the more you give, the clearer the vision.",
            "Shatter her obsidian shell to free her. She may die — or she may emerge as the first new Sun-Speaker in centuries, bearing a message from Sol itself. The risk is that she emerges as something else entirely.",
            "The Unwoven believe her tapestries are a map. Commission a weaving and have an Astril spirit-reader interpret the thread-patterns — each color and twist corresponds to a continent."
          ]
        },
        {
          "id": "husque",
          "name": "Cinder Ghoul",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Cinder Ghoul",
          "role": "Volcanic skeleton",
          "origin": "Reanimated remains of miners trapped in geothermal vents.",
          "nature": "Smoldering skeletons animated by volcanic energy that patrol old mine shafts.",
          "habitat": "Abandoned mine shafts and steam tunnels.",
          "combat": "220 HP. Aura of Entropy: all creatures within 120 ft take 1d6 cold per round and cannot regain HP. Melee slam (3d10+6 bludgeoning plus 2d10 necrotic). Can release a pulse of absorbed heat (recharge 5-6, 60-ft radius, 8d8 fire damage, DC 18 DEX half). Resistances: cold, fire, necrotic. Vulnerable: radiant.",
          "stats": {
            "strength": 18,
            "agility": 12,
            "constitution": 18,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 220,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 25,
            "resistances": {
              "cold": 50,
              "fire": 50,
              "necrotic": 50
            },
            "vulnerabilities": {
              "radiant": 100
            }
          },
          "depth": "Blind guardians of the deep mines.",
          "hooks": [
            "A Husque is drifting toward a settlement. The party must stop it before everyone freezes. Lead it away using controlled fires as bait.",
            "The Solbrand can call it home. Carry the ember toward the Husque and it will follow — directly into the caldera, where it may be consumed or redeemed.",
            "Reverse the transformation through a ritual at the caldera's edge. But the ritual requires a willing sacrifice — someone who will take the Husque's place in the entropy field. The Unwoven believe the Husque can be weaponized against Keth-Amar."
          ]
        },
        {
          "id": "ba-spirit",
          "name": "Ba-Spirit",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Ba-Spirit",
          "role": "Sun-watcher of the tomb",
          "origin": "A traditional Egyptian/Mesopotamian bird-spirit watching over ruined sun altars.",
          "nature": "A bird with a human head that sits on ancient pillars, emitting warm light.",
          "habitat": "Ruined sun altars.",
          "combat": "30 HP. Cannot deal damage. Mournful Hymn (60-ft radius, DC 12 WIS save or filled with deep sorrow, disadvantage on attack rolls for 2 rounds). Fade to Ash (teleports up to 40 ft, leaving a cloud of gold ash that obscures vision). Immune to fire and necrotic.",
          "stats": {
            "strength": 4,
            "agility": 14,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 30,
            "maxMana": 30,
            "maxActionPoints": 3,
            "speed": 15,
            "resistances": {
              "fire": 100,
              "necrotic": 100
            }
          },
          "depth": "A peaceful guardian.",
          "hooks": [
            "A Ba-Spirit has flown into a Neth contract-house, and its mournful song is filling the clerks with such sorrow that no business can be done. The Neth want it removed without violence.",
            "Track a Ba-Spirit at night. The gold ash it weeps leaves a glowing trail that leads directly to a buried vault containing Solvarn artifacts.",
            "Reconstruct a sun-hymn. A scholar needs the party to record three different songs sung by Ba-Spirits at three separate ruins."
          ]
        },
        {
          "id": "udu",
          "name": "Udu",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/udu.png",
          "illustrationCaption": "An Udu perched on a warm basalt pipe, its long ears perked for shifting stones",
          "role": "The soot-sweeper hearth imp",
          "origin": "Formed from Mesopotamian myths of the Udug—spirits that slip through narrow cracks—and Zoroastrian beliefs in hearth-guardians. The Udu are small, soot-furred desert rodents that seek geothermal warmth in the cold, sunless valleys.",
          "nature": "A long-eared, large-eyed jerboa-like rodent covered in soft, charcoal-grey fur that sheds ash. It has a single basalt horn on its forehead for chipping minerals. Its tail ends in a smoldering, orange-glowing tuft that acts as a natural light source. Highly inquisitive and peaceful, but prone to stealing hot embers for its nest.",
          "habitat": "Geothermal crevices, longhouse ovens, and volcanic mine shafts in Sundale.",
          "combat": "25 HP. Cannot deal direct damage. Soot Cloud (AoE, 10-ft radius, DC 12 CON save or blinded for 1 round as it kicks up a cloud of ash). Spark Flash (emits a bright flash from its tail tuft, DC 10 AGI save or target has disadvantage on their next attack). Scurry (can leap 20 ft as a bonus action, avoiding opportunity attacks). Vulnerable to cold.",
          "stats": {
            "strength": 4,
            "agility": 16,
            "constitution": 10,
            "intelligence": 6,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 25,
            "maxMana": 10,
            "maxActionPoints": 3,
            "speed": 40,
            "resistances": {
              "fire": 50
            },
            "vulnerabilities": {
              "cold": 50
            }
          },
          "depth": "Emberth miners welcome the Udu because they consume dangerous soot deposits in chimneys and warn of cave-ins by sensing low-frequency vibrations with their large ears. However, their hoarding of hot coals makes them minor household pests.",
          "hooks": [
            "A colony of Udu has nested in the primary air shaft of a Neth furnace, choking it with their glowing coal hoard. Retrieve the coal and relocate the colony safely.",
            "An Udu has stolen a rare glowing ember-stone meant for a Solvarn ritual. Track its glowing tail trail to find its warm burrow.",
            "Miners report that the local Udu have all suddenly fled the lower levels of a mine, suggesting an imminent collapse or something far worse waking in the dark."
          ]
        }
      ]
    },
    {
      "id": "iceheart-sea",
      "name": "The Iceheart Sea",
      "folklore": "Greek/Aegean + West African/Yoruba",
      "creatures": [
        {
          "id": "spume",
          "name": "Water Elemental",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/spume.png",
          "illustrationCaption": "A sketch of Water Elemental in its natural environment",
          "role": "Tidal protector",
          "origin": "An elemental formed from the violent ocean waves and kelp.",
          "nature": "A shifting shape of water and sea foam that keeps beaches clean of debris.",
          "habitat": "Coastal waters and rocky shores.",
          "combat": "30 HP, immobile. Cannot attack. If destroyed, each polyp releases a scream in a different voice (2d6 psychic, DC 12 WIS half, and the party hears the final moments of every drowning victim at once).",
          "stats": {
            "strength": 0,
            "agility": 0,
            "constitution": 12,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 14,
            "maxHp": 30,
            "maxMana": 30,
            "maxActionPoints": 0,
            "speed": 0,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "Friendly to sailors.",
          "hooks": [
            "Find a sailor's final message to their family. The Spume has their voice. Trade a story for the secret — the story does not have to be true, but it must be told with conviction.",
            "Learn the location of a shipwreck. The Spume absorbed the navigator's voice and remembers the last course plotted.",
            "Feed the Spume a fictional story. It will believe it and carry it into the sea, where the Myrathill will hear it as truth. A way to spread information across the ocean without leaving a trace."
          ]
        },
        {
          "id": "orun",
          "name": "Deep Sea Jellyfish",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/orun.png",
          "illustrationCaption": "A sketch of Deep Sea Jellyfish in its natural environment",
          "role": "Bioluminescent drifter",
          "origin": "A large jellyfish native to the deep trenches.",
          "nature": "A floating, glowing jellyfish that drifts with the ocean currents.",
          "habitat": "Open ocean and deep rifts.",
          "combat": "5 HP (crystal). Cannot be harmed by physical, cold, or fire attacks — it simply refracts the energy. Can be shattered by force damage (bludgeoning/piercing above 20 total in a single hit). Touching it with bare skin forces a vision (DC 16 SPI save — success reveals a glimpse of the starless sky before the Dimming and grants advantage on the next INT or SPI check; failure causes 2d6 psychic damage and a lingering sense of cosmic grief for 1 hour). If shattered, it releases a burst of stellar light (30 ft, 4d6 radiant, DC 14 CON half) and the star's unfinished word — a single syllable in a language older than any on Mythrill.",
          "stats": {
            "strength": 0,
            "agility": 0,
            "constitution": 20,
            "intelligence": 18,
            "spirit": 20,
            "charisma": 14,
            "maxHp": 5,
            "maxMana": 0,
            "maxActionPoints": 0,
            "speed": 0,
            "resistances": {
              "cold": 100,
              "fire": 100,
              "physical": 100,
              "radiant": 50
            },
            "vulnerabilities": {
              "bludgeoning": 100,
              "force": 100
            }
          },
          "depth": "Luminous but harmless.",
          "hooks": [
            "A Merryn captain claims an Orun led her to an uncharted island. She wants the party to help her find it again — but Orun drift, and the one she found is long gone. She needs a Deep-Born Myrathil to listen to the sea's memory of the crystal's path.",
            "A Neth Velun arcanist has developed a method to read an Orun without shattering it, using specially cut ghost-crystal lenses. He needs a fresh Orun and permission to work in the Synod-Hold's crystal-lattice observatory. The Astril are reluctant to allow a Neth anywhere near their constellation-spirits.",
            "An Orun has washed ashore at Merrowport, and the pirate-gamblers are holding a betting pool on what the crystal's unfinished word means. The party can try to touch it and hear the word — but hearing an unfinished celestial thought has driven two Deep-Born Myrathil into permanent meditation."
          ]
        },
        {
          "id": "thalass",
          "name": "Sea Golem",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/thalass.png",
          "illustrationCaption": "A sketch of Sea Golem in its natural environment",
          "role": "Rift sentinel",
          "origin": "A massive stone construct built to guard deep sea portals.",
          "nature": "A stone guardian covered in coral and barnacles that patrols the ocean floor.",
          "habitat": "Deep ocean floor.",
          "combat": "100 HP. Immune to cold and poison. Wave-Break (melee, 2d8+4 bludgeoning, reach 15 ft — a mass of water shaped like a fist). Undertow (single target, DC 14 STR save or pulled 30 ft toward the Thalass and grappled for 1 round). Stormsong (30-ft radius, DC 14 SPI save — those who fail are confused for 1 round and hear the ghost of the sea's old harmonics, taking 2d6 psychic damage). If it hears music (within 60 ft), it gains +2 to all attacks and moves 50% faster toward the source. Fire and radiant damage suppress its foam-form (vulnerability — fire causes it to lose 10 HP per round until it reforms over water).",
          "stats": {
            "strength": 14,
            "agility": 16,
            "constitution": 14,
            "intelligence": 12,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 100,
            "maxMana": 20,
            "maxActionPoints": 5,
            "speed": 40,
            "resistances": {
              "cold": 100,
              "poison": 100,
              "necrotic": 50
            },
            "vulnerabilities": {
              "fire": 75,
              "radiant": 50
            }
          },
          "depth": "Mindless construct.",
          "hooks": [
            "The Thalass has been following the party's ship for three days, growing closer each night. The Deep-Born crew member wants to communicate with it using the old harmonic frequencies, but she needs a thermal vent that still produces sound — and those are nearly extinct.",
            "A Merryn musician has composed a song that mimics the sea's old harmonics. He believes it could give the Thalass its voice back — or drive it mad. The Deep-Born want him to try. The Merryn want to sell tickets.",
            "The Thalass surfaced near Ironjaw Port and began pounding on the sea-wall with wave-fists. The Neth believe it is trying to deliver a message from the sea-shard. The message, if decoded, may reveal the shard's exact depth and location."
          ]
        },
                {
          "id": "pelagos",
          "name": "Pelagos",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/pelagos.png",
          "illustrationCaption": "A Pelagos bounding through the icy spray, its bioluminescent whiskers twitching",
          "role": "The spume-hound pack hunter",
          "origin": "Inspired by Yoruba maritime tales of Olokun's Sea Dogs—guardians of deep waters—and the Greek Hippocampus. Fused by the Wyrd, the Pelagos are highly intelligent, amphibious pack hunters tracking deep currents.",
          "nature": "A sleek hound resembling a greyhound but covered in smooth, rubbery shark skin with deep indigo and sea-foam green countershading. It has webbed paws, a dolphin-like dorsal fin, and a powerful shark tail. Its chin features soft, glowing sensory whiskers that detect movement under freezing waters, and its eyes emit a soft green bioluminescence.",
          "habitat": "Coastal reefs, ice shelves, and kelp forests in the Iceheart Sea.",
          "combat": "85 HP. Spume Bite (melee, 2d6+4 piercing, plus DC 12 CON save or bleeds for 1d6 physical damage per round for 3 rounds). Bioluminescent Flash (emits a sharp flash of light from its eyes, 30 ft range, DC 13 AGI save or blinded for 1 round). Slipstream (moves 50 ft, ignoring difficult terrain in water). Immune to cold, resistant to piercing and slashing.",
          "stats": {
            "strength": 14,
            "agility": 18,
            "constitution": 12,
            "intelligence": 10,
            "spirit": 12,
            "charisma": 12,
            "maxHp": 85,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "cold": 100,
              "piercing": 50,
              "slashing": 50
            }
          },
          "depth": "Highly intelligent and trainable companions. Coastal fishers and Deep-Born divers domesticate them to guide ships through rocky shoals, retrieve dropped anchors, and alert crews to low-frequency underwater vibrations.",
          "hooks": [
            "A pack of feral Pelagos has begun harrying fishing boats near the reefs. The local fishers want them driven off, but a Deep-Born elder claims they are fleeing a far larger predator waking in the trench.",
            "An albino Pelagos, sacred to Olokun, was captured by a Neth merchant for sale. The Myrathil reef-keepers hire the party to break into the merchant's warehouse and rescue it before it is shipped off.",
            "A diver lost their copper navigational compass in a deep trench. The party must bribe a domesticated Pelagos with raw reef-crabs to dive down and track the metallic scent."
          ]
        },
        {
          "id": "brine",
          "name": "Sea Kelpie",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/brine.png",
          "illustrationCaption": "A sketch of Sea Kelpie in its natural environment",
          "role": "Spectral mount",
          "origin": "A fey water spirit resembling a horse made of mist and foam.",
          "nature": "It appears at the water's edge, offering rides to travelers but disappearing into foam if touched.",
          "habitat": "Sea caves and misty shores.",
          "combat": "The ship has 160 HP and is crewed by 8 skeletal sailors (each). The captain casts fear and control water at will. The ship can submerge for 1d4 rounds and reappear 500 ft away. Killing the captain disperses the ship until the next storm — he reforms with the rain.",
          "stats": {
            "strength": 14,
            "agility": 14,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 160,
            "maxMana": 50,
            "maxActionPoints": 5,
            "speed": 40,
            "resistances": {
              "cold": 50,
              "necrotic": 50
            },
            "vulnerabilities": {
              "fire": 50
            }
          },
          "depth": "Playful and elusive.",
          "hooks": [
            "Accept passage to a destination unreachable by normal means — the Brine knows every current and can cross the Iceheart in three days instead of three weeks. The price is a year and a mark.",
            "Break the captain's contract by finding his original ship's bell, preserved in a Merryn port tavern. Ring it at the moment the Brine appears, and the ship may finally sink.",
            "Complete the captain's unfinished voyage. He was carrying a cargo when he died — a letter, a treasure, a prisoner. Deliver it, and the Brine may release its crew."
          ]
        },
        {
          "id": "writ",
          "name": "Tidal Siren",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Tidal Siren",
          "role": "Aquatic hunter",
          "origin": "A humanoid aquatic species native to the Iceheart Sea.",
          "nature": "A webbed hunter that uses simple harpoons and water magic to fish in the deep currents.",
          "habitat": "Coastal caves and shipwrecks.",
          "combat": "350 HP. Legendary actions (3). Tentacle strikes (3d10+7 bludgeoning, reach 80 ft). Can capsize ships (DC 22 STR check on a grapple). At half HP, it invokes an emergency clause: it calls 2d4 lesser leviathans as reinforcements. Its contract explicitly forbids it from attacking ships that have paid — it will not break this rule.",
          "stats": {
            "strength": 20,
            "agility": 14,
            "constitution": 20,
            "intelligence": 16,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 350,
            "maxMana": 30,
            "maxActionPoints": 6,
            "speed": 40,
            "resistances": {
              "cold": 50,
              "physical": 25
            },
            "vulnerabilities": {
              "lightning": 50
            }
          },
          "depth": "Reclusive fisher-folk.",
          "hooks": [
            "The party's ship cannot afford the toll. Challenge the contract's terms in Neth court at Ironjaw Port — this requires legal expertise, a copy of the contract, and a compelling precedent.",
            "Discover an unratified amendment. The Writ's lease expired 50 years ago, but no one noticed because the renewal was buried in a cargo manifest. The Writ may not know it is squatting on borrowed jurisdiction.",
            "Pay the toll in unconventional currency. The Writ accepts secrets, memories, and names — the value is determined by how much they mean to the payer. A childhood memory of warmth is worth more than gold in the Iceheart."
          ]
        },
        {
          "id": "yemoja-sentinel",
          "name": "Yemoja Sentinel",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Yemoja Sentinel",
          "role": "Coral guardian",
          "origin": "A construct of sea shell and coral reefs embodying the protective spirit of the deep.",
          "nature": "A large shell-construct that protects coral beds from predators.",
          "habitat": "Coral reefs.",
          "combat": "160 HP. Coral Fist (melee, 2d10+6 bludgeoning + DC 14 CON save or bleed 1d6 piercing damage per round). Tidal Wave (30-ft cone, DC 15 STR save or knocked prone and pushed 15 ft). Shield of Shells (+4 defense for 2 rounds). Resistant to physical and cold damage. Vulnerable to thunder.",
          "stats": {
            "strength": 20,
            "agility": 10,
            "constitution": 18,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 10,
            "maxHp": 160,
            "maxMana": 20,
            "maxActionPoints": 5,
            "speed": 20,
            "resistances": {
              "physical": 50,
              "cold": 50
            },
            "vulnerabilities": {
              "thunder": 50
            }
          },
          "depth": "Protective sentinel.",
          "hooks": [
            "A merchant ship crashed on a reef, and a Sentinel is preventing any salvage operations, dragging divers under. Negotiate with the sea-dwellers to pacify the construct.",
            "A Sentinel's core gem has been stolen by a group of pirates. Without the gem, the Sentinel is slowly crumbling, and the surrounding reef is dying. Recover the gem from the pirate cove.",
            "The party needs a piece of calcified bone-coral from a Sentinel's body to craft a cure for a local plague. Harvest it without destroying the guardian."
          ]
        }
      ]
    },
    {
      "id": "cragjaw-peaks",
      "name": "Cragjaw Peaks",
      "folklore": "Japanese Yōkai + Andean/Incan",
      "creatures": [
        {
          "id": "scrab",
          "name": "Rust Beetle",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Rust Beetle",
          "role": "Scrap scrawler",
          "origin": "A small beetle adapted to feed on rusted metals.",
          "nature": "A hard-shelled beetle that eats scrap iron and copper.",
          "habitat": "Mountain mines and scrap piles.",
          "combat": "50 HP (metal hide). Can swallow a metal object (DC 13 STR save or weapon is eaten, dealing 2d6 to the Scrab). A Scrab that has consumed too much precious metal becomes dangerously magnetic — creatures wearing metal within 20 ft must make a DC 12 STR save or be pulled toward it.",
          "stats": {
            "strength": 10,
            "agility": 12,
            "constitution": 14,
            "intelligence": 4,
            "spirit": 8,
            "charisma": 4,
            "maxHp": 50,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 20,
            "resistances": {
              "physical": 50,
              "fire": 25
            }
          },
          "depth": "A minor nuisance in holds.",
          "hooks": [
            "A mine has collapsed — a wild Scrab ate the support beams. The party must clear the rubble and drive it out before the mine can be worked again.",
            "A Fexric master crafter will pay handsomely for a trained Scrab. But training one requires feeding it progressively more valuable metals — a costly investment.",
            "A Scrab's stomach contains rare undigested alloys. Track one that has been feeding in a rich vein, kill it, and extract the metal — but the vein it found belongs to whoever claims the tunnel."
          ]
        },
        {
          "id": "qalpa",
          "name": "Cliff Guardian",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Cliff Guardian",
          "role": "Stone guardian",
          "origin": "A stone gargoyle carved to guard mountain passages.",
          "nature": "A winged gargoyle that sits motionless on peaks, warning travelers of blizzards.",
          "habitat": "Mountain passes.",
          "combat": "40 HP (metal hide). Immune to fire and poison. Claw-Chisel (melee, 1d6+3 piercing, reach 5 ft — its limbs are chisel-blades). Furnace-Breath (5-ft cone, 1d8 fire damage, DC 12 DEX half — the chest-furnace vents superheated air). Darkness Sense: it cannot be surprised in dim light or darkness. If its chest-furnace is doused (targeted attack, DC 12 to hit the furnace, which bypasses defense), it becomes sluggish (half speed, -2 to all attacks) for 1d4 rounds until it reignites from a coal-vein or heat-source. Vulnerable to cold — ice disrupts the furnace joints.",
          "stats": {
            "strength": 12,
            "agility": 14,
            "constitution": 16,
            "intelligence": 4,
            "spirit": 6,
            "charisma": 2,
            "maxHp": 40,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "fire": 100,
              "poison": 100
            },
            "vulnerabilities": {
              "cold": 50,
              "frost": 50
            }
          },
          "depth": "Mindless stone sentinel.",
          "hooks": [
            "A Qalpa swarm has infested a coal-mine that the Drall need to reopen. The Qalpa are eating the best seams and the Drall cannot afford to lose the coal. The party must drive the Qalpa out without destroying them — the Drall want to domesticate them.",
            "A Qalpa has scuttled into Frostmaw Holdfast's upper galleries. The Kethrin want it killed — it is eating their document-coals, the compressed fuel that stores their maintenance songs. Without the coals, the Kethrin lose their oral archives.",
            "A Groven bridge-builder claims a Qalpa carried a lost Fexric maintenance song across a chasm inside its chest-furnace. If the furnace is opened carefully, the song might be recovered — but opening it may also release the heat that keeps the Qalpa alive."
          ]
        },
        {
          "id": "kintsu",
          "name": "Stone Gargoyle",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Stone Gargoyle",
          "role": "Peak eagle",
          "origin": "A massive stone bird guarding the high Cols.",
          "nature": "A bird construct that watches the valleys from above.",
          "habitat": "High peaks.",
          "combat": "90 HP. Incorporeal — immune to physical damage. Can only be harmed by radiant (its opposite: light that is intentional rather than reflected) or by destroying the span it stands on. Name-Toll (single target, DC 14 SPI save — failure means the target forgets their own name for 3 days. During this time, all CHA-based checks have disadvantage and the target cannot use items that require a name to activate). Bone-Light Shift (self, teleport to any point on the same span). Memory Flash (15 ft radius, 2d6 psychic, DC 14 WIS — failure means the target sees a random memory of someone who crossed this bridge before). If the span is damaged, the Kintsu takes equal damage — it is the bridge, and the bridge is it.",
          "stats": {
            "strength": 10,
            "agility": 18,
            "constitution": 14,
            "intelligence": 14,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 90,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "physical": 100,
              "cold": 50
            },
            "vulnerabilities": {
              "radiant": 75
            }
          },
          "depth": "Guardian of the sky.",
          "hooks": [
            "The party must cross a Kintsu-guarded span with no time to wait for the name to return. One party member volunteers — but the negotiations they need to conduct on the far side require they prove their identity to a Neth contract-house. Find a way to operate namelessly or find the name before the contract deadline.",
            "A Kintsu on a major span has stopped offering passage and instead stands motionless, weeping bone-light. The Groven believe the span's original bones have been disturbed — someone is trying to extract a calcified body from the bridge's structure. The party must investigate who is dismantling the span and why.",
            "An Ithran councilor wants the party to capture a Kintsu's light. He believes it could be used to identify any traveler who ever crossed a Groven bridge — a powerful intelligence tool. The Morgh Groven view this as desecration."
          ]
        },
        {
          "id": "tarn",
          "name": "Thunderbird",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Thunderbird",
          "role": "Storm hawk",
          "origin": "A large eagle that channels electrical storms through its wings.",
          "nature": "A majestic bird nesting on lightning-struck peaks.",
          "habitat": "Peak tops.",
          "combat": "The Tarn itself is terrain. The pool has 180 HP and can be attacked (vulnerable to fire — boiling the water deals double damage). Each round, 1d4 water-tendrils emerge and attempt to grapple creatures within 20 ft (DC 16 STR or restrained, dragged 10 ft toward the pool per round). Restrained creatures submerged in the pool must make a DC 16 SPI save — failure means they see their future self and are paralyzed for 1 round with awe or horror. If a creature is submerged for 3 consecutive rounds, they begin dissolving — 2d8 necrotic per round. The pool radiates a Visions aura (60 ft, creatures must make a DC 14 SPI save at the start of their turn or see a flash of their future self, gaining advantage on the next attack roll but taking 1d4 psychic damage from the emotional shock). The pool cannot leave its basin.",
          "stats": {
            "strength": 16,
            "agility": 0,
            "constitution": 18,
            "intelligence": 14,
            "spirit": 20,
            "charisma": 16,
            "maxHp": 180,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 0,
            "resistances": {
              "cold": 100,
              "physical": 50,
              "psychic": 75
            },
            "vulnerabilities": {
              "fire": 100
            }
          },
          "depth": "High-altitude hunter.",
          "hooks": [
            "The party needs to cross a pass that leads past a Tarn. The Tarn will show each of them their future if they survive. One party member sees something terrible and refuses to continue. The Tarn begins reaching for them. The party must decide: help their companion accept the vision, or fight the Tarn to free them.",
            "A Fexric Deep Alchemist wants the Tarn's water — he believes it contains liquid memory of the future and could be used to predict the outcome of experiments. The Groven will not allow the Tarn to be disturbed. The Fexric has a counter-proposal: drain only what the Tarn willingly gives.",
            "A Morgh bridge-builder looked into the Tarn and saw himself becoming an Ithran councilor. This is impossible under the Ladder of Purity — but the vision was clear. He wants the party to help him fulfill the future the Tarn showed him, even if it means breaking every caste rule the Groven have."
          ]
        },
        {
          "id": "yawn",
          "name": "Crag Yeti",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Crag Yeti",
          "role": "Cliff troll",
          "origin": "A large, white-furred troll native to the snowy crags.",
          "nature": "A thick-furred beast that climbs sheer cliffs with ease.",
          "habitat": "Sheer cliffs.",
          "combat": "The Yawn itself is terrain, not a creature. It has 120 HP and can be attacked. Each round, 1d4 bone-hands emerge from the span and attempt to grab creatures (DC 14 DEX or grappled, dragged into the bridge structure — 2d6 bludgeoning per round). The bridge-keeper's ghost manifests at the midpoint and must be passed to cross safely.",
          "stats": {
            "strength": 16,
            "agility": 8,
            "constitution": 16,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 120,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 0,
            "resistances": {
              "physical": 50,
              "necrotic": 50
            },
            "vulnerabilities": {
              "fire": 50
            }
          },
          "depth": "Reclusive climber.",
          "hooks": [
            "The only path to the shard's vault is across the Yawn's chasm. Cross it by stepping only on the oldest, most calcified bone — newer sections are unstable and will grab.",
            "Complete the bridge properly. Find the original bridge-keeper's remains and lay them at the anchor-point. The Yawn may accept them as the final piece and rest.",
            "Burn the Yawn. The bone will crack and fall into the chasm — but the chasm becomes impassable forever, sealing whatever lies on the far side."
          ]
        },
        {
          "id": "thrum",
          "name": "Earth Elemental",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Earth Elemental",
          "role": "Mountain mind",
          "origin": "An elemental manifestation of the mountain's stone.",
          "nature": "A slow-moving giant of granite and quartz.",
          "habitat": "Deep chasms.",
          "combat": "The Thrum cannot be killed — it is a phenomenon. Each round it asks a question through tectonic vibration (DC 18 Insight/Religion to interpret). Wrong answers cause a cave-in (6d6 bludgeoning, DC 16 DEX half). Right answers calm it. After 3 right answers, the path to the Subterranean Vault opens. If the party fails 3 questions in a row, the chamber collapses entirely.",
          "stats": {
            "strength": 24,
            "agility": 0,
            "constitution": 24,
            "intelligence": 16,
            "spirit": 20,
            "charisma": 10,
            "maxHp": 500,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 0,
            "resistances": {
              "physical": 75,
              "fire": 100,
              "cold": 50
            }
          },
          "depth": "Peaceful unless attacked.",
          "hooks": [
            "The party needs the Thrum's knowledge to open the Subterranean Vault where the shard lies. Decipher the Fexric prayer-language carved on the walls — it is a confession, a map, and an apology.",
            "Clear the blocked vent to relieve the Thrum's pain. This requires navigating flooded tunnels filled with superheated steam and awakened minerals.",
            "Bring a Fexric Deep Alchemist who knows the old rituals. The Thrum remembers the Fexric's touch and may respond to their voice with recognition rather than pain."
          ]
        },
        {
          "id": "kamaitachi",
          "name": "Kama-Itachi",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Kama-Itachi",
          "role": "Wind yokai weasel",
          "origin": "A fast, weasel-like yokai riding the glacial winds.",
          "nature": "A swift weasel with razor claws that slashes glacial drafts.",
          "habitat": "Glacial wind tunnels.",
          "combat": "100 HP. Wind Sliders (moves 60 ft without triggering opportunity attacks). Sickle Strike (2d8+4 slashing + DC 14 DEX save or bleed 1d8 damage per round for 3 rounds). Triple Cut (attacks three times in a single action, but has -2 to hit on each). Resistant to physical attacks while moving.",
          "stats": {
            "strength": 10,
            "agility": 20,
            "constitution": 12,
            "intelligence": 8,
            "spirit": 12,
            "charisma": 6,
            "maxHp": 100,
            "maxMana": 0,
            "maxActionPoints": 5,
            "speed": 50,
            "resistances": {
              "physical": 50
            }
          },
          "depth": "Trickster of the cold drafts.",
          "hooks": [
            "A bridge-building crew is trapped in a gorge because a pack of Kama-Itachi has claimed the wind-currents above. Drive them out or find a way to silence the winds.",
            "Gather copper claws from a slain Kama-Itachi to forge a wind-cutting blade for a local warrior.",
            "A Kama-Itachi has stolen a key wind-tome from an Ithran councilor. Track the wind-currents to locate its nest on a sheer cliff face."
          ]
        }
      ]
    },
    {
      "id": "sundrift-vale",
      "name": "Sundrift Vale",
      "folklore": "Mongol/Turkic + Chinese",
      "creatures": [
        {
          "id": "lien",
          "name": "Starlight Unicorn",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Starlight Unicorn",
          "role": "Moon hare",
          "origin": "A fey unicorn with glowing starlight horns.",
          "nature": "A beautiful unicorn that runs across the starless steppe, guiding lost children.",
          "habitat": "Open grasslands.",
          "combat": "10 HP. Cannot directly harm. Its pollen causes the target to forget one specific memory of their choice — or one the DM chooses (DC 12 CON save). Swarms of 10+ Liens can drain a person's entire history in one night.",
          "stats": {
            "strength": 2,
            "agility": 16,
            "constitution": 6,
            "intelligence": 10,
            "spirit": 14,
            "charisma": 8,
            "maxHp": 10,
            "maxMana": 15,
            "maxActionPoints": 2,
            "speed": 30,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "Peaceful guide.",
          "hooks": [
            "A merchant is being drained by a swarm — someone in their bloodline owes a debt from three generations ago. The party must find the original debtor (long dead) and settle the account.",
            "Follow a single Lien across the steppe. It will lead you to whoever carries the largest unpaid debt in the region — a debtor who has been running for years.",
            "The Astril believe the Liens follow the same paths as the constellation-spirits. Follow the moths, and you may find the spirits — or what is left of them."
          ]
        },
        {
          "id": "nokhor",
          "name": "Steppe Falcon",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Steppe Falcon",
          "role": "Hunting bird",
          "origin": "A trained falcon used by nomadic clans.",
          "nature": "A swift raptor hunting rodents in the steppe.",
          "habitat": "Nomadic camps.",
          "combat": "10 HP. Cannot deal damage. Radiates a Warm Presence (20 ft, all creatures within recover 1 HP per round and gain immunity to exhaustion). Comforting Pur (all creatures within 20 ft must make a DC 12 SPI save each round or lose the desire to move — effectively charmed, they simply want to sit with the Nokhor. The charm lasts as long as they remain within range and for 1d4 hours after leaving). Cannot be harmed by cold or physical attacks (too soft, attacks pass through). Vulnerable to radiant and fire — the warmth is its essence and can be consumed. If killed, its golden fur sheds a glow that lasts for 1d6 hours, providing a comfort effect in a 30-ft radius without the memory-loss risk.",
          "stats": {
            "strength": 2,
            "agility": 16,
            "constitution": 8,
            "intelligence": 8,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 10,
            "maxMana": 0,
            "maxActionPoints": 2,
            "speed": 40,
            "resistances": {
              "cold": 100,
              "physical": 100
            },
            "vulnerabilities": {
              "radiant": 100,
              "fire": 100
            }
          },
          "depth": "Trained companion.",
          "hooks": [
            "A key Ordan herd-guide has been sitting with a Nokhor for three days. His companions cannot wake him — not because he is asleep, but because he no longer wants to go anywhere. The party must find a way to break the Nokhor's charm without killing it.",
            "An Unlit Astril has discovered that Nokhor fur, when woven into a cloak, provides warmth without the memory-loss effect. She wants the party to help her gather fur — but the fur only retains its properties if the Nokhor sheds it willingly.",
            "The Ordan believe that Nokhor gather at the oldest Ancestor Mound during the winter solstice. A Sylen Astril wants to be there when it happens — she believes the Nokhor will lead her to a constellation-spirit that has been dormant since the stars went dark."
          ]
        },
        {
          "id": "unzag",
          "name": "Steppe Lynx",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Steppe Lynx",
          "role": "Grasslands hunter",
          "origin": "A large wildcat native to the open tundra.",
          "nature": "A quiet, spotted cat that hunts in the tall grass.",
          "habitat": "Tundra grass.",
          "combat": "Cannot be fought directly — it is in the sky. Its influence is felt through its Shadow on the ground (60-ft radius, follows the Unzag's position above). Sky-Fault (creatures in the shadow take 2d6 cold damage per round, no save — the cold of the absent stars). Star-Hunger (DC 16 SPI save at the start of each turn — those who fail are compelled to stare at the sky for 1 round, losing their action. Those who succeed see a glimpse of the Unzag's true form: a wound in reality, and gain +2 SPI for 1 round from the cosmic insight). To fight the Unzag, ranged attacks must reach the sky — fire and radiant attacks extend upward toward it (120 ft range, normal attack roll, the Unzag has in the sky). 150 HP. When destroyed, the stars do not return — but a single new star appears, faintly, where the Unzag fell.",
          "stats": {
            "strength": 0,
            "agility": 10,
            "constitution": 18,
            "intelligence": 14,
            "spirit": 20,
            "charisma": 14,
            "maxHp": 150,
            "maxMana": 0,
            "maxActionPoints": 3,
            "speed": 10,
            "resistances": {
              "cold": 100,
              "physical": 100,
              "psychic": 50
            },
            "vulnerabilities": {
              "radiant": 75,
              "fire": 50
            }
          },
          "depth": "Reclusive hunter.",
          "hooks": [
            "The Unzag's shadow is passing over a major Ordan camp. The herds are panicking and the grass is dying. The party has one hour before the camp is destroyed. Options: drive the herds out of the shadow's path, try to dispel the shadow, or attack the Unzag itself.",
            "An Astril Sylen believes that a constellation-spirit trapped inside the Unzag could be released by feeding it enough radiant energy — specifically, the light of a Sylen Astril at full constellation-bleed. This would kill the Astril but free the spirit. The Astril has volunteered. The party must decide whether to assist.",
            "The Ordan know a song that can calm the Unzag — not banish it, but slow its drift so its shadow lingers longer in one place. The Neth want to study the calm Unzag to determine if it contains the location of the Sundrift Sundered Monolith, which was buried in a mound whose location was erased from memory."
          ]
        },
        {
          "id": "zud",
          "name": "Steppe Mammoth",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Steppe Mammoth",
          "role": "Glacial yak",
          "origin": "A massive woolly mammoth migrating across the plains.",
          "nature": "A huge, peaceful herbivore with long tusks and thick fur.",
          "habitat": "Steppe paths.",
          "combat": "250 HP (massive, diffuse target). Immune to cold, poison, and psychic — it is weather. Immune to piercing and slashing — blades pass through frozen grass. Vulnerable to fire and bludgeoning — the grass burns and the structure collapses. Blizzard Body (the Zud is a 40-ft wide wall; all creatures within it take 2d8 cold damage per round and must make a DC 16 STR save or pushed 15 ft in the direction of the Zud's movement). Herd-Memory (the Zud absorbs the last spoken words of any creature it kills — it repeats these words in a chorus of frozen voices, 60-ft radius, DC 14 SPI save or frightened for 1 round). Whiteout (30-ft radius around the Zud, visibility reduced to 5 ft). At half HP, the Zud compresses — it becomes 20-ft wide but attacks deal double damage and the cold aura intensifies (3d8 cold per round).",
          "stats": {
            "strength": 22,
            "agility": 6,
            "constitution": 22,
            "intelligence": 4,
            "spirit": 12,
            "charisma": 2,
            "maxHp": 250,
            "maxMana": 0,
            "maxActionPoints": 4,
            "speed": 30,
            "resistances": {
              "cold": 100,
              "poison": 100,
              "psychic": 100,
              "piercing": 100,
              "slashing": 100
            },
            "vulnerabilities": {
              "fire": 100,
              "bludgeoning": 75
            }
          },
          "depth": "Highly peaceful.",
          "hooks": [
            "The Zud is approaching a permanent Ordan camp. The herds are not moving — they are trapped by a blizzard that blocks the migration route. The party must either clear the migration route to restart the herd-motion, sing the Migration Song loudly enough to calm the Zud, or burn enough of the Zud's body to create a path through it.",
            "A Sylen Astril believes the Zud contains the compressed memory of every winter the steppe ever experienced — including the winters before the sun died. If the Zud can be calmed and \"interviewed\" using the Migration Song as a foundation, it may reveal what the weather was like before the Dimming.",
            "The Zud has merged with another Zud — something that has never happened before. The resulting super-Zud is twice as large, twice as cold, and moving toward the Synod-Hold. The Astril cannot flee — the Synod-Hold is their only permanent structure. The Ordan will sing, but even they are not sure the song will work on a double-Zud."
          ]
        },
        {
          "id": "lorn",
          "name": "Celestial Stag",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Celestial Stag",
          "role": "Starry deer",
          "origin": "A deer with antlers reflecting the lost constellations.",
          "nature": "A quiet stag that walks the steppe, leaving glowing tracks.",
          "habitat": "Grasslands.",
          "combat": "80 HP. Can animate grass in a 60-ft radius (DC 15 STR or restrained). The Lorn itself does not attack — it cries, and each cry forces a DC 14 WIS save or the target must move toward it. If killed, it dissolves into grass seed and regenerates in 1d4 days unless the seeds are gathered and burned.",
          "stats": {
            "strength": 12,
            "agility": 14,
            "constitution": 14,
            "intelligence": 6,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 80,
            "maxMana": 40,
            "maxActionPoints": 4,
            "speed": 10,
            "resistances": {
              "psychic": 50
            }
          },
          "depth": "Sacred guide.",
          "hooks": [
            "Show the Lorn genuine parental care without being pulled under. It can sense deception — only true empathy works. If successful, the Lorn may release those it has taken and finally rest.",
            "The Ordan know the song that can repel her. But the song must be sung by a pure voice — one who has never abandoned anyone.",
            "Burn the grass circle she has claimed. She will flee, but she will also cry, and the sound may break the party's resolve. The grass will grow back unless the roots are salted."
          ]
        },
        {
          "id": "sere",
          "name": "Steppe Gryphon",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Steppe Gryphon",
          "role": "Sun eagle",
          "origin": "A creature with the head of an eagle and the body of a lion.",
          "nature": "A proud hunter nesting on open rock columns.",
          "habitat": "Steppe columns.",
          "combat": "200 HP. Legendary actions. Spear of Unfinished Business (2d10+5 piercing, target cannot regain HP until the Sere's next turn). Raises forgotten dead from the steppe (2d4 riders each round). At half HP, calls a Wind-Hungry swarm (20-ft radius, 3d6 cold per round). His horse can phase through solid matter.",
          "stats": {
            "strength": 18,
            "agility": 16,
            "constitution": 18,
            "intelligence": 14,
            "spirit": 16,
            "charisma": 18,
            "maxHp": 200,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 60,
            "resistances": {
              "cold": 50,
              "necrotic": 50
            },
            "vulnerabilities": {
              "radiant": 50
            }
          },
          "depth": "Native hunter.",
          "hooks": [
            "The Sere has marked a settlement. The party must find him before the Wind-Hungry arrive — three nights — and challenge his judgment. Present evidence of the community's worth.",
            "Sing his forgotten name-song. The song contains the story of his first impossible choice, and hearing it may remind him of the mercy he once had. The last elder who knows it lives at the edge of the steppe and will only teach it to someone who has made an impossible choice themselves.",
            "Challenge him to a duel. He respects courage and will accept a champion. Winning earns his mark of favor — and his knowledge of the shard's burial mound."
          ]
        },
        {
          "id": "qilin",
          "name": "Steppe Qilin",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Steppe Qilin",
          "role": "Starry scale deer",
          "origin": "A draconic deer covered in starry golden scales.",
          "nature": "A peaceful protector seen only during winter migrations.",
          "habitat": "Grasslands.",
          "combat": "180 HP. Starry Breath (30-ft cone, 4d8 radiant + DC 15 SPI save or blinded 1 round). Runic Horn (2d10+5 piercing + DC 15 STR save or knocked back 15 ft). Aura of Hope (all allies within 30 ft gain +2 to all saves and recover 5 HP per round). Immune to radiant and cold.",
          "stats": {
            "strength": 16,
            "agility": 18,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 20,
            "charisma": 18,
            "maxHp": 180,
            "maxMana": 60,
            "maxActionPoints": 5,
            "speed": 45,
            "resistances": {
              "radiant": 100,
              "cold": 100
            }
          },
          "depth": "Peaceful omen.",
          "hooks": [
            "A Steppe Qilin has appeared near a sundered monolith fragment, but it is surrounded by a swarm of Wind-Hungry. Help the Qilin defeat the swarm.",
            "An Unlit Astril believes she can cure her starlessness by touching a Qilin's horn. Help her find one and earn its trust without violence.",
            "A greedy merchant has hired hunters to capture a Qilin for its golden scales. Protect the sacred beast from the hunters."
          ]
        }
      ]
    },
    {
      "id": "bryngloom",
      "name": "The Bryngloom Forest",
      "folklore": "Slavic/Carpathian + Hindu/Vedic",
      "creatures": [
        {
          "id": "wist",
          "name": "Whispering Dryad",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Whispering Dryad",
          "role": "Gloomwood protector",
          "origin": "A dryad formed from the ancient ironwood roots.",
          "nature": "A woodland spirit that whispers forest secrets and news to travelers.",
          "habitat": "Forest clearings.",
          "combat": "Immobile. 50 HP. Cannot attack. If threatened, it screams every secret it has ever heard in a deafening chorus (DC 14 WIS or stunned for 1 round by psychic overload — the secrets are that terrible). After screaming, it forgets everything and starts over.",
          "stats": {
            "strength": 0,
            "agility": 0,
            "constitution": 14,
            "intelligence": 18,
            "spirit": 16,
            "charisma": 12,
            "maxHp": 50,
            "maxMana": 40,
            "maxActionPoints": 0,
            "speed": 0,
            "resistances": {
              "psychic": 100
            }
          },
          "depth": "Peaceful helper.",
          "hooks": [
            "The party needs a secret only the Wist knows. It will trade — one secret for another, always of equal weight. It does not negotiate; it balances.",
            "The Neth use the Wist as a contract witness. Ask it whether a deal was broken. It remembers every word spoken within a mile of its grove — including the fine print.",
            "Seal its bark with wax and the Wist sleeps, unable to hear or speak. Destroy it, and every secret it holds scatters into the wind, audible to anyone within a mile."
          ]
        },
        {
          "id": "morok",
          "name": "Bog Hag",
          "dangerLevel": "Low",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Bog Hag",
          "role": "Swamp dweller",
          "origin": "A reclusive hag living in the deep peat bogs.",
          "nature": "An old woman who brews moss remedies in the swamp.",
          "habitat": "Deep peat bogs.",
          "combat": "Cannot be damaged by physical attacks — it is not solid. Cannot be damaged by cold or necrotic — it IS cold and necrosis. Takes full damage from radiant and fire (2x) — it is the absence of light, and light destroys absence. Touching it (a creature moves into its space) requires a DC 14 CON save — failure means 2d6 necrotic damage and the creature gains a \"morok-stain\" (a dark patch on their skin that does not heal for 1d6 days, during which they have disadvantage on all SPI checks as their sense of vitality wavers). The Morok has no HP. It persists as long as the darkness persists. Light sources within 30 ft shrink it (each light source reduces its effective radius by 10 ft).",
          "stats": {
            "strength": 0,
            "agility": 6,
            "constitution": 0,
            "intelligence": 4,
            "spirit": 8,
            "charisma": 2,
            "maxHp": 0,
            "maxMana": 0,
            "maxActionPoints": 1,
            "speed": 15,
            "resistances": {
              "physical": 100,
              "cold": 100,
              "necrotic": 100,
              "psychic": 100
            },
            "vulnerabilities": {
              "radiant": 200,
              "fire": 200
            }
          },
          "depth": "Grumpy but trades remedies.",
          "hooks": [
            "A Vreken crypt-council is reporting that their fungal shrouds are going dark — the preserved ancestors inside are losing their distinction between living and dead, becoming neither. A Morok has found its way into the Sunken Spire. The party must introduce enough light to drive it out without damaging the sensitive fungal ecosystems of the crypt.",
            "A Marked Vreken claims the Morok is following a specific path — a boundary that no one mapped. If the party can trace where the Morok patrols, they may discover a hidden border in the Bryngloom — a place where the Keeper's authority does not extend.",
            "The Morok has stained a party member. The stain will not heal, and it is spreading — slowly, over days, the dark patch is growing. The Vreken Clean know a fungal poultice that can halt the spread, but the Morok-stain must be exposed to living fungal light for a full day. The party must find a safe place with continuous fungal glow — the Synod-Hold's crystal lattice, perhaps."
          ]
        },
                        {
          "id": "vatra",
          "name": "Vatra",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/vatra.png",
          "illustrationCaption": "A Vatra sprite scurrying inside a hollow tree, its mossy mane carrying a miniature swamp",
          "role": "The scurrying moss-sprite",
          "origin": "Formed from Slavic myths of the Leshachiks—tiny tree-dwelling helpers of the Leshy—and Carpathian tales of the warm Vatra-sap. These wood-sprites carry a highly prized, glowing hot resin in their veins, making them prey for alchemists seeking warmth in the sunless world.",
          "nature": "A tiny, cute bark-skinned sprite (about 1.5 feet tall) with long, spindly twig limbs that let it climb and scurry rapidly. Its head is crowned with a thick mane of damp moss, ferns, and mushrooms. When threatened, it crawls into hollow logs or tree knots, tucking in its limbs to disguise itself perfectly as a natural wooden burl. It speaks in a secretive clicking and rustling language.",
          "habitat": "Damp ironwood hollows and deep peat-bogs in the Bryngloom Forest.",
          "combat": "45 HP. Scurry (moves 50 ft as a bonus action, avoiding opportunity attacks). Needleshot (ranged, 30 ft range, 1d6+3 piercing + DC 12 CON save or poisoned for 2 rounds). Bark Disguise (as an action, blends into wood to gain total concealment). Warm Sap Leak (when reduced to 0 HP, its warm gold sap leaks out; any creature within 5 ft gains temporary fire resistance for 3 rounds). Vulnerable to fire.",
          "stats": {
            "strength": 6,
            "agility": 18,
            "constitution": 10,
            "intelligence": 12,
            "spirit": 14,
            "charisma": 12,
            "maxHp": 45,
            "maxMana": 10,
            "maxActionPoints": 4,
            "speed": 40,
            "resistances": {
              "poison": 50,
              "necrotic": 50
            },
            "vulnerabilities": {
              "fire": 50
            }
          },
          "depth": "They are clever undergrowth hunters, preying on insects and small frogs. They are relentlessly hunted by Drun and Neth alchemists for their glowing gold sap, which serves as a long-lasting, smokeless heat source for lanterns and hearths.",
          "hooks": [
            "A group of Neth alchemists has set up traps in a sacred grove to harvest Vatra sap. The local Drun want the party to dismantle the traps and drive the harvesters out before the forest's balance is broken.",
            "A Vatra has nested in the hollow leg of a noble's wooden desk, hiding from collectors. It has been stealing small items and documents to line its nest. Find the sprite and recover the items without harming it.",
            "The party needs high-grade warm sap to survive a passage through a freezing mountain pass. They must locate a colony of scurrying Vatras and convince them to trade their sap for a rare swamp-fly delicacy."
          ]
        },
        {
          "id": "vyraj",
          "name": "Swamp Hydra",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Swamp Hydra",
          "role": "Forest guardian",
          "origin": "A multi-headed marsh serpent guarding ancient ruins.",
          "nature": "A giant reptile that defends the deep peat gates.",
          "habitat": "Peat-stone gates.",
          "combat": "300 HP. Immune to psychic and physical damage — it is law made flesh, and law is abstract. Legendary actions (3/round). Clause-Strike (melee, 3d10+6 force damage — the impact is not physical but legal, the target's body reacting as if a contract has been violated, DC 18 CON or stunned 1 round). Paradox Field (30-ft radius, all creatures within must make a DC 16 INT save — failure means they cannot take any action that involves an agreement, promise, or coordination for 1 round, effectively acting alone). Devour Agreement (the Vyraj targets a single creature and attempts to consume a buff, magical effect, or tactical advantage — DC 18 SPI save, failure means the target loses one buff or positive effect of the DM's choice). Vulnerable to radiant and void — light that reveals truth dissolves legal abstractions, and void represents the absence of law.",
          "stats": {
            "strength": 18,
            "agility": 14,
            "constitution": 22,
            "intelligence": 20,
            "spirit": 18,
            "charisma": 16,
            "maxHp": 300,
            "maxMana": 60,
            "maxActionPoints": 6,
            "speed": 30,
            "resistances": {
              "physical": 75,
              "psychic": 100,
              "necrotic": 50
            },
            "vulnerabilities": {
              "radiant": 75,
              "void": 75
            }
          },
          "depth": "Territorial sentinel.",
          "hooks": [
            "The Vyraj has surfaced near Atropolis during a major Neth trade summit. Every contract being negotiated is at risk of being consumed. The Neth Velun want the party to drive it back into the deep bog. The Neth Kessen want to study its behavior. The Drun want to negotiate with it — and the Vyraj is willing to listen to beings without legal existence.",
            "A Vreken crypt has been breached and all the fungal-light contracts dissolved. The Vyraj is the suspect. The party must determine whether the Vyraj consumed the contracts deliberately or whether the contracts collapsed on their own due to paradoxes the Vyraj exposed.",
            "The Vyraj has consumed a copy of the First Contract — not the original, but a Neth transcription. With the contract inside it, the Vyraj now carries the authority that governs all Neth immortality. If the Vyraj is destroyed, the contract may be recovered. If the Vyraj digests it, all Neth immortality ends."
          ]
        },
        {
          "id": "canker",
          "name": "Fungal Husk",
          "dangerLevel": "Medium",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Fungal Husk",
          "role": "Spore zombie",
          "origin": "A corpse animated by parasitic forest spores.",
          "nature": "A slow-moving husk covered in orange mushrooms.",
          "habitat": "Swamp edges.",
          "combat": "The host has 80 HP. The Canker's true body is a mycelial network in the host's brain. Killing the host releases a spore burst (30-ft cone, DC 14 CON or infected). Infected targets progress through four stages over 7 days: cough, spore-lung, fungal bloom, death. At each stage they can be cured with a DC 16 Medicine check using Vreken anti-fungal poultice.",
          "stats": {
            "strength": 12,
            "agility": 10,
            "constitution": 16,
            "intelligence": 14,
            "spirit": 12,
            "charisma": 10,
            "maxHp": 80,
            "maxMana": 20,
            "maxActionPoints": 4,
            "speed": 25,
            "resistances": {
              "poison": 100,
              "necrotic": 50
            },
            "vulnerabilities": {
              "fire": 50,
              "radiant": 50
            }
          },
          "depth": "Mindless spore spreader.",
          "hooks": [
            "A village shows signs of spore-infection. Track the host before the infection spreads to the whole settlement. Burn the host, isolate the infected, and find the Canker's mycelial source.",
            "The Vreken know a fungal counter — a rare mushroom that neutralizes the spores. It only grows in the deepest bog-caves, tended by the Vreken Clean.",
            "Negotiate with the hive-mind. The Canker is sentient and capable of legal reasoning. If the party can prove it breached its own contract terms, it must release all signatories — but the terms are written in spores and no one has read the full document."
          ]
        },
        {
          "id": "edict",
          "name": "Peat Golem",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Peat Golem",
          "role": "Forest enforcer",
          "origin": "A golem made of packed peat-stone and ironwood.",
          "nature": "A heavy sentinel guarding the boundaries of Atropolis.",
          "habitat": "Atropolis borders.",
          "combat": "400 HP. Legendary actions (4). Damage immunity: non-magical weapons. Ironwood fists (4d12+8 bludgeoning). Each round, it invokes one contract clause: Null and Void (dispel magic on one target), Breach of Terms (force a reroll), In Perpetuity (restrain one target with spectral moss until terms are met). Cannot be tricked, bargained with, or deceived while active.",
          "stats": {
            "strength": 22,
            "agility": 12,
            "constitution": 22,
            "intelligence": 20,
            "spirit": 20,
            "charisma": 18,
            "maxHp": 400,
            "maxMana": 80,
            "maxActionPoints": 6,
            "speed": 30,
            "resistances": {
              "physical": 50,
              "psychic": 100,
              "necrotic": 100
            },
            "vulnerabilities": {
              "radiant": 50
            }
          },
          "depth": "Mindless boundary guard.",
          "hooks": [
            "The Edict is approaching a settlement. Someone broke a Neth contract — possibly unknowingly. Find the violator before the Edict does, and either hide them or help them fulfill the terms before the Edict arrives.",
            "Produce a prior precedent that overrides the broken contract. This requires access to the Neth legal archives in Atropolis, which are not open to outsiders — the party must negotiate or infiltrate.",
            "Destroy the First Contract itself — the source of all Neth law kept in the heartwood of Atropolis. Without it, the Edict has no authority. But no one knows what happens if the source of Neth immortality burns."
          ]
        },
        {
          "id": "leshy",
          "name": "Leshy Shepherd",
          "dangerLevel": "High",
          "illustration": "/assets/images/creatures/placeholder.png",
          "illustrationCaption": "Sketch pending for Leshy Shepherd",
          "role": "Slavic woodland warden",
          "origin": "A mossy forest warden keeping the balance of life.",
          "nature": "A large peat-wood guardian who shepherds the wild beasts.",
          "habitat": "Deep moss groves.",
          "combat": "200 HP. Peat-Wood Club (melee, 3d8+6 bludgeoning, reach 15 ft). Moss Strangler (30 ft range, DC 16 AGI save or restrained, taking 2d6 choking damage per round). Size Shift (self-buff, increases size to huge, gaining +4 STR and temporary HP). Vulnerable to fire.",
          "stats": {
            "strength": 20,
            "agility": 10,
            "constitution": 20,
            "intelligence": 12,
            "spirit": 16,
            "charisma": 10,
            "maxHp": 200,
            "maxMana": 30,
            "maxActionPoints": 5,
            "speed": 25,
            "resistances": {
              "physical": 50
            },
            "vulnerabilities": {
              "fire": 100
            }
          },
          "depth": "Reclusive warden.",
          "hooks": [
            "A Neth logging crew has gone missing in a grove guarded by a Leshy. Retrieve the survivors and negotiate a boundary line with the forest spirit.",
            "A Leshy is shepherding a pack of Cankers towards a local settlement, believing the infected are part of the forest's natural decay. Persuade the Leshy that the settlement must be protected.",
            "Harvest a rare glowing peat-flower that only grows on the Leshy's mossy shoulder while it is asleep."
          ]
        }
      ]
    }
  ]
};
