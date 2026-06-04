export const BESTIARY_DATA = {
  regions: [
    {
      id: 'frostwood-reach',
      name: 'Frostwood Reach',
      folklore: 'Germanic/Grimm + Celtic',
      creatures: [
        {
          id: 'gref',
          name: 'Gref',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/gref.png',
          illustrationCaption: 'A Gref at a fog-bound crossroads, its cart laden with masks',
          role: 'The face-trader of every crossroads',
          origin: 'When the fog first began stealing memories, the Wyrd needed a way to keep the identities from scattering entirely. The Gref was its solution — a collector. It is not a predator. It is a merchant, born from the fear of losing oneself to the mist.',
          nature: 'The Gref appears as a stooped figure pushing a handcart of wooden face-masks. It never lies — it tells you exactly whose face you are buying. Wear a mask long enough and your own face sinks into the wood while the Gref adds it to the cart. It does not attack, does not chase, does not bargain. It simply waits at crossroads, offering comfort to those who wish to forget who they are.',
          habitat: 'Crossroads where the fog is deepest, appearing precisely at dusk and vanishing at dawn. It never visits the same crossroads twice in the same season.',
          combat: 'Flees if attacked (40 HP). Its masks can be thrown as distractions (Charm Person, single target, DC 12). Overturning its cart releases 2d6 trapped faces that fly back to their original owners — who may not want them back.',
          stats: {
            strength: 8, agility: 14, constitution: 10, intelligence: 12, spirit: 14, charisma: 16,
            maxHp: 40, maxMana: 20, maxActionPoints: 4, speed: 30,
            resistances: { psychic: 50 }
          },
          depth: 'The Gref was once a Mimir who lost its own face in the fog and could not remember what it looked like. The Wyrd gave it a purpose: collect every face it could not have. It is not malicious — it is incomplete. Some say if you offer it a truly kind memory, it will return a face for free.',
            hooks: [
            'A noble\'s son bought a face and can no longer remove it. The party must find the Gref and negotiate the return — but the son has forgotten who he was without the mask.',
            'The Gref knows the location of every soul lost in the fog. A grieving widow wants to know if her husband still lives. The Gref will trade — for a face of equal value.',
            'A village has been found empty, every inhabitant wearing identical masks. The Gref visited three nights ago. The party must find which villager started the trade.'
          ]
        },
        {
          id: 'vetch',
          name: 'Vetch',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/vetch.png',
          illustrationCaption: 'A Vetch darting between ironwood roots at the fog\'s edge, just visible enough to follow',
          role: 'The path that betrays',
          origin: 'When the fog stole the Reach\'s spatial memory, it did not erase destinations — it rerouted them. The Vetch was born from the moment a Briaran pathfinder realized the trail she had walked a thousand times now led somewhere else entirely. Her confusion became the Vetch: a small, scurrying thing that exists in the gaps between where you are and where you meant to be.',
          nature: 'A bundle of ironwood twigs wrapped in damp grey cloth, no larger than a cat. It scurries at the fog\'s edge, always visible just ahead — a moving shape that suggests a path. Follow it and you arrive somewhere, but never where you intended. It does not lead you astray. It leads you where the fog needs you to go. The Vetch does not understand deception. It believes every destination is equal.',
          habitat: 'Fog-choked trails and crossroads, always at the edge of visibility. More active during the thickest fog-banks, when paths are most uncertain.',
          combat: '20 HP. Cannot deal damage directly. Each round it moves 60 ft in a direction that seems purposeful — any creature that follows it must make a DC 10 INT check or lose their sense of direction for 1d4 hours. Its twig-body can be crushed (vulnerability to bludgeoning), releasing a burst of stolen memories (2d6 psychic, DC 12 WIS half) that reveal fragments of where the Vetch has led others.',
          stats: {
            strength: 4, agility: 18, constitution: 8, intelligence: 6, spirit: 10, charisma: 6,
            maxHp: 20, maxMana: 0, maxActionPoints: 4, speed: 60,
            resistances: { psychic: 75 }, vulnerabilities: { bludgeoning: 100 }
          },
          depth: 'The Vetch is not malicious. It is the fog\'s navigation system — a living compass that points toward whatever the Wyrd considers interesting rather than whatever the traveler considers necessary. Some Briaran pathfinders have learned to follow Vetch on purpose, accepting that they will discover something they did not plan for. The Unwoven Mimir trade Vetch-paths as rumors: where one was seen, something worth finding is nearby.',
          hooks: [
            'A Vetch has been leading merchant caravans into a Briaran ambush. The Briaran did not command the Vetch — the fog simply found their hiding spot interesting. Determine whether the Briaran know they are being "helped."',
            'Follow a Vetch deliberately. It will lead you somewhere — but you must decide if the destination is worth losing a day\'s travel. Some Vetch lead to caches of forgotten supplies. Others lead to Gambrel groves.',
            'A Thalren archivist discovered that crushing a Vetch releases the memories of every path it ever walked. She wants the party to capture one alive — but the Vetch becomes suicidal when cornered, and a dead Vetch remembers nothing.'
          ]
        },
        {
          id: 'moot',
          name: 'Moot',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/moot.png',
          illustrationCaption: 'The Moot standing in a fog-choked clearing, its gavel-mask rotating through verdicts',
          role: 'The verdict in the fog',
          origin: 'Every trial, every sentencing, every confession ever spoken in the Reach was absorbed by the fog — but the fog kept only the verdicts, never the charges. The Moot was born from that imbalance: a creature that carries the weight of judgment without the context of crime. It must pronounce sentence. It improvises the crime.',
          nature: 'A towering figure wrapped in fog-thick legal parchment, its face a rotating carousel of wooden gavel-masks — each mask carved with a different expression of judgment. It carries a rusted iron scale that tips without anything on either side and speaks in the overlapping voices of every judge who ever sat in Greymark\'s courts. It does not hunt. It blocks paths and announces a charge. The charge is always something the traveler did not do — but the Moot believes it with absolute conviction.',
          habitat: 'Fog-choked clearings where two or more paths converge, especially near old Thalren court-sites. Appears during the grey hours before dawn.',
          combat: '110 HP. Each encounter begins with the Moot announcing a charge (DC 14 CHA to present a defense — roleplay, not combat). If the defense satisfies the Moot, it steps aside. If it detects deception or the defense fails, combat begins. Gavel Strike (2d8+4 bludgeoning + DC 15 CHA save or lose 3 CHA for 2 rounds as false guilt sets in). Recite the Charges (30-ft cone, 3d6 psychic, DC 14 INT save or stunned 1 round). Contempt of Court (single target, DC 14 STR save or restrained 2 rounds by spectral juror-hands). Resistant to psychic damage — you cannot shame it.',
          stats: {
            strength: 14, agility: 12, constitution: 16, intelligence: 16, spirit: 14, charisma: 18,
            maxHp: 110, maxMana: 40, maxActionPoints: 5, speed: 30,
            resistances: { psychic: 50 }, vulnerabilities: { radiant: 50 }
          },
          depth: 'The Moot reveals something the Thalren have buried: their justice system has been quietly erasing itself for centuries. The fog ate the charges but kept the verdicts, meaning families across the Reach may still be carrying sentences for crimes that no longer exist on any record. Some nobles are technically guilty of things their great-grandparents were acquitted of — because the Moot kept the guilty verdict but not the acquittal. The Unwoven Mimir use this ambiguity to their advantage.',
          hooks: [
            'The Moot has blocked the only road to a plague-stricken village. It announces that the village\'s elder is guilty of "conspiracy of breath." The party must either defend the elder in a trial the Moot takes seriously, or fight through it.',
            'A Moot has appeared inside Greymark Keep itself, announcing charges against House Thalreth. The nobles want it destroyed quietly — but destroying a Moot releases every verdict it carried back into the fog, where they become whispers that accuse everyone.',
            'The Moot\'s gavel is made of petrified ironwood from a Briaran hanging-tree. Return it to the tree and the Moot may dissolve — but the Briaran who planted that tree may not want the reminder.'
          ]
        },
        {
          id: 'gallows-wood',
          name: 'Gallows-Wood',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/gallows-wood.png',
          illustrationCaption: 'The Gallows-Wood at dusk — a ribcage of fused ironwood with nooses swaying in windless air',
          role: 'The grove that remembers hanging',
          origin: 'The Briaran hid in the ironwood groves for three centuries, but not all of them hid willingly. Some were turned in by their own — neighbors, lovers, family — who struck bargains with Thalreth inquisitors in exchange for fog-protection. The trees witnessed every hanging. The fog ate the names of the condemned but the trees kept the memory of the act itself, and over centuries of absorbed guilt, the grove grew into something that punishes.',
          nature: 'A cluster of ironwood trees whose branches fused into a canopy shaped like a ribcage. From every branch hangs a noose of living vine that sways without wind. The trunks glow faintly from within — faces press against the bark from the inside, mouths open but silent. It does not move. It does not hunt. It arrests. Anyone caught in its grove is judged by the faces in the bark, and the sentence is always the same: a noose descends.',
          habitat: 'Deep ironwood groves where Briaran were once hidden. The Briaran refuse to speak of these places, and no Mimir will enter one. The groves can be identified by the absence of birdsong within a hundred yards.',
          combat: '220 HP, immune to poison and 75% resistant to psychic. Immovable — speed 0. Gallows Drop (30 ft reach, 2d10+5 bludgeoning, DC 16 AGI save or restrained for 2 rounds as a noose-vine hoists the target into the canopy — restrained targets take 1d6 bludgeoning per round from the vine). Root Surge (30-ft radius, 4d8 bludgeoning, DC 15 AGI half, and DC 15 STR or prone). Bark Sentence (40-ft radius, 3d8 psychic, DC 16 SPI save or frightened for 2 rounds — the faces in the bark scream the condemned\'s last words). Briaran Hardening (self-buff, +4 defense for 3 rounds). Fire vulnerability — the ironwood burns if the bark is breached.',
          stats: {
            strength: 20, agility: 6, constitution: 20, intelligence: 10, spirit: 16, charisma: 12,
            maxHp: 220, maxMana: 30, maxActionPoints: 5, speed: 0,
            resistances: { physical: 50, poison: 100, psychic: 75 }, vulnerabilities: { fire: 100, radiant: 50 }
          },
          depth: 'The Gallows-Wood is the Briaran\'s deepest wound. It proves that the House of Viridane\'s descendants were not merely hiding — they were betraying each other. The trees are witnesses to a campaign of internal purges that the surviving Briaran have spent three centuries pretending never happened. The Gallows-Wood cannot be reasoned with because it is not angry — it is accurate. Every face in the bark belongs to someone who was genuinely turned in by someone who genuinely loved them. The Briaran elders know this. That is why they will burn a grove before they let an outsider see it.',
          hooks: [
            'The only path to a Sundered Monolith fragment leads through a Gallows-Wood grove. The Briaran will not enter. The party must decide: burn the grove (destroying irreplaceable evidence of the purges), fight through it (facing the noose-vines and screaming bark), or find a Briaran willing to confess what the grove remembers.',
            'The faces in the bark can speak if questioned gently with genuine compassion. Each face reveals the name of the person who turned them in — and some of those names belong to Briaran elders who still live. One elder will pay any price to keep the grove silent.',
            'The noose-vines, if cut rather than burned, produce a living rope that remembers how to bind only the guilty. A Thalreth inquisitor wants this rope for her trials — but harvesting it requires surviving the Gallows-Wood\'s judgment.'
          ]
        },
        {
          id: 'gambrel',
          name: 'Gambrel',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/gambrel.png',
          illustrationCaption: 'The Gambrel, woven from thorns and the memory of broken vows',
          role: 'The oath-consequence at the crossroads',
          origin: 'The Wyrd shaped the Gambrel from the fear of romantic betrayal — but she has become more than that. She is consequence given form, woven from Briaran thorns and the frozen moss of moonlit groves where hearts were broken.',
          nature: 'A gaunt, thorn-woven figure that inhabits clearings where promises were sworn and broken. She does not hunt — she waits at the exact spot where someone swore false. Her vines tighten around the unfaithful. Her briars bloom red flowers that are actually bleeding hearts — the organs of those the oathbreaker abandoned.',
          habitat: 'Moonlit clearings where the fog thins, always near a path used for trysts or betrayals. She is drawn to places where love turned to ash.',
          combat: '100 HP. Her vines create difficult terrain in a 30-ft radius (DC 14 STR or grappled). She can teleport between any two thorn-vines within 60 ft. Her blood-briar strike deals 2d8+4 piercing and forces the target to confess one secret (DC 15 WIS or stunned for 1 round with shame).',
          stats: {
            strength: 14, agility: 16, constitution: 14, intelligence: 12, spirit: 16, charisma: 14,
            maxHp: 100, maxMana: 30, maxActionPoints: 5, speed: 30,
            vulnerabilities: { fire: 50 }
          },
          depth: 'She only claims those who swore knowingly false oaths. A genuine change of heart, confessed aloud in her grove, makes her vines retreat. She does not punish mistakes — she punishes deception. The Briaran have learned to leave offerings of their own shed thorns at her groves; she accepts them as payment for debts she was not called to collect.',
          hooks: [
            'A village is trapped behind a wall of her thorns — someone among them broke an oath. Find the oathbreaker and bring them to confess before the thorns tighten.',
            'The Briaran elders know a ritual that can unbind her knots using the true name of a forgotten fae. The party must journey to the old fae roads to learn it.',
            'She holds a piece of information the party needs — a location, a name, a secret — and will trade it for a genuine confession from someone who has wronged her.'
          ]
        },
        {
          id: 'revel',
          name: 'Revel',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/revel.png',
          illustrationCaption: 'The Revel rides — a fae court frozen mid-dance, hunting for new souls to join the ball',
          role: 'The court that never ended',
          origin: 'Before the families\' bargain, before the fog, the fae lords of the Reach held a grand ball in a clearing that existed between worlds. The Wyrd found them there — and infected the celebration itself. The music continued. The dancers never stopped. They have been riding ever since.',
          nature: 'Not a single creature but a procession: nobles in rusted finery astride mist-hounds with hollow ribcages, hunting for new dancers. They do not attack — they invite. Their voices are warm, their promises sweet. Those who accept the invitation are found at dawn, frozen in a laughing pose, their hearts stopped mid-ecstasy. The Revel does not kill. It recruits.',
          habitat: 'The old fae roads, invisible to mortal eyes except when the Revel rides them — moonless nights when the fog carries music from a source no one can find.',
          combat: 'The court functions as a single entity with 250 HP. Legendary actions (3). The Mist-Hounds (6, each) are extensions of the Revel\'s will. The Revel\'s dance aura (60 ft) forces a DC 16 WIS save or the target must dance — spending their action to move toward the Revel. If all four hounds are killed, the Revel dissipates until the next moonless night.',
          stats: {
            strength: 12, agility: 18, constitution: 16, intelligence: 14, spirit: 18, charisma: 20,
            maxHp: 250, maxMana: 60, maxActionPoints: 6, speed: 50,
            resistances: { psychic: 75, cold: 50 }, vulnerabilities: { radiant: 50 }
          },
          depth: 'They were the true fae lords of the Reach. The Wyrd infected their ball, and they have been dancing ever since — unable to stop, unable to leave, watching their own court rot around them. The music is the only thing keeping them from being consumed entirely. They are tragic, not evil. Some of them weep beneath their rusted masks.',
          hooks: [
            'A performer accepted their invitation. The party must enter the Revel during the height of the ball and retrieve them before dawn — without accepting the dance themselves.',
            'The Revel passes through the same grove every 13th moon. The Briaran know how to petition them for a boon — but the price is always a dance, and no one has ever danced with the Revel and returned unchanged.',
            'The party believes the Court holds a shard-fragment woven into the crown of its king. Sever the Wyrd-node that animates the Revel and the dancers may finally rest — or they may simply collapse into ash.'
          ]
        }
      ]
    },
    {
      id: 'nordhalla',
      name: 'Nordhalla & The Valley of Ymir',
      folklore: 'Norse + Alpine',
      creatures: [
        {
          id: 'rimor',
          name: 'Rimor',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/rimor.png',
          illustrationCaption: 'A Rimor nestled in the cold crevice of a longhouse wall',
          role: 'The house-haint of the fjords',
          origin: 'The Wyrd shaped the Rimor from a simple fear: that the cold would follow you indoors. That your own hearth could not be trusted. Every longhouse in Nordhalla has one — a Rimor nests in the walls before the family even moves in, feeding on the first winter\'s worth of warmth.',
          nature: 'A small, coal-black thing of packed ash and frozen grease that nests in the cold crevices of longhouses. It steals the memory of warmth — victims forget what it feels like to be warm and die of exposure in their own beds, wrapped in furs by a roaring fire. It does not kill. It simply takes what you do not appreciate.',
          habitat: 'Inside walls, under floorboards, in unused chimneys. Always in the coldest corner of the warmest room.',
          combat: '25 HP. Can cling to any surface and siphons heat from living creatures within 10 ft (1 cold damage per round + target loses sense of temperature). Fears open flame — will flee if cornered with a torch. Its nest contains 1d4 small warm objects (heirloom rings, heated stones, preserved coals).',
          stats: {
            strength: 6, agility: 14, constitution: 8, intelligence: 6, spirit: 10, charisma: 6,
            maxHp: 25, maxMana: 0, maxActionPoints: 3, speed: 20,
            resistances: { cold: 100 }, vulnerabilities: { fire: 100 }
          },
          depth: 'Every home has one. It only manifests when the family has stopped valuing their warmth. The Skald say it is a test: if your hearth is true, the Rimor never leaves the walls. Some families leave a small dedicated hearth for the Rimor — an unspoken truce. In return, the Rimor keeps worse things from nesting in the same walls.',
            hooks: [
            'A family was found frozen in their own home, fire still burning. The party must track the Rimor to its nest — it has grown bold because the family neglected the old traditions.',
            'The Skald know that Rimor-spoor can be smoked out using dried skaldfire moss, which only grows on the cliffs of the eastern fjords — a dangerous climb.',
            'Offer the Rimor a dedicated hearth of its own. If the family maintains it, the Rimor becomes a guardian against worse Wyrd-creatures — a permanent but uneasy arrangement.'
          ]
        },
        {
          id: 'kjarn',
          name: 'Kjarn',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/kjarn.png',
          illustrationCaption: 'A Kjarn skittering across a frozen windowsill, leaving frost-flowers behind',
          role: 'The cold that borrowed legs',
          origin: 'When House Skalvyr bargained to halt the glaciers, the cold did not stop wanting to move — it simply had nowhere to go. The Kjarn is what happens when a small pocket of that trapped desire finds a way out: not as a glacier, but as a hand-sized absence of warmth with legs. It is the temperature difference between living and frozen, given form.',
          nature: 'A cat-sized construct of frozen air and crystallized breath that skitters on ice-needle legs. It does not appear as a creature — it appears as a moving patch of intense cold, a place where the air is simply wrong. Where it walks, frost-flowers bloom on surfaces. It does not attack. It simply exists in the same space as warmth, and warmth shrinks from it.',
          habitat: 'Indoor surfaces in Nordhalla settlements — windowsills, hearthstones, pipe-joints — anywhere cold and warm air meet. More active during the deepest winter when the thermal contrast is sharpest.',
          combat: '15 HP. Cannot deal damage. Each round it drains 1d4 HP from the nearest living creature within 5 ft (cold damage, no save — it is simply colder than you). If killed, it shatters into harmless frost-dust. Cannot be harmed by cold or physical attacks (immune). Vulnerable to fire — a torch kills it instantly. Its ice-needle legs leave a trail of frost-flowers that last for 1d6 hours — Skald children collect them as keepsakes.',
          stats: {
            strength: 2, agility: 16, constitution: 14, intelligence: 2, spirit: 8, charisma: 2,
            maxHp: 15, maxMana: 0, maxActionPoints: 4, speed: 30,
            resistances: { cold: 100, physical: 75 }, vulnerabilities: { fire: 100 }
          },
          depth: 'The Kjarn is Nordhalla\'s most accepted Wyrd-creature. Every household has one, and the Skald view them the way surface-dwellers view dust-motes: present, unremarkable, occasionally annoying. The Frostbound subrace actually cultivate Kjarn, using them as cold-storage for perishable food and as living temperature-gauges — a Kjarn that ventures far from its corner of a room signals a draft or a failing pipe. The Skald Rune Keepers believe the Kjarn are the glaciers\' messengers, and that if enough gather in one place, they are trying to tell the living something.',
          hooks: [
            'A Skald child has been "adopted" by a swarm of Kjarn — fifteen of them follow her everywhere, keeping her perpetually cold. The Frostbound say this is a gift. The Bloodhammer say it is a death sentence. The child does not seem bothered.',
            'A Kjarn swarm has migrated from the lower sumps into the Frozen Archive, settling on the ancient brass cylinders. The Rune Keepers fear the cold will crack the cylinders — but they also notice the Kjarn are drawn to specific cylinders, as if the machines inside are generating warmth.',
            'The Frostbound have learned to trap Kjarn in obsidian jars, creating portable cold-sources. A Bloodhammer warrior wants a jar to cool his forge-rage. The Frostbound refuse — the Kjarn are not tools.'
          ]
        },
        {
          id: 'huld',
          name: 'Huld',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/huld.png',
          illustrationCaption: 'The Huld standing motionless in a glacier-chasm, brass runes flickering across frozen skin',
          role: 'The archive that cannot be read',
          origin: 'A Rune-Keeper who carved too many memories into her own skin — trading personal history for Archive knowledge, as is the tradition. But she traded too much. By the time she reached the deepest brass cylinder, she had no memories left to trade, so she carved the Archive\'s contents onto her bones. The Wyrd found her there, over-written, unreadable, and gave her a purpose: guard what she no longer understood.',
          nature: 'A tall figure wrapped in brass bands inscribed with runes that glow faintly with stolen warmth. Where skin should be, there is frost-white bone covered in micro-runes so dense they blur into solid silver. The Huld does not speak — she cannot, because the part of her that held language was the first memory she traded. She communicates through temperature changes and the flickering of her brass bands, which spell out phrases in Archive-runic that only the most learned Rune Keepers can still read.',
          habitat: 'The deepest corridors of the Frozen Archive, standing motionless between brass cylinders. She has not moved in forty years. She becomes active only when someone attempts to remove or damage a cylinder she guards.',
          combat: '130 HP. Immune to cold. Each round she can emit a Pulse of Archive Memory (30-ft cone, 3d6 psychic, DC 15 INT save — those who fail see a random memory from the Archive flash through their mind, gaining +2 INT for 1 round but losing 1d4 HP as the memory burns neural pathways). Rune-Lock (single target, DC 16 AGI save or paralyzed for 1 round as brass bands clamp around limbs). Bone-Shatter Slam (2d10+5 bludgeoning, reach 10 ft). At half HP, her bands flare and she enters Archive Frenzy — attacks twice per round but cannot use Pulse. Vulnerable to fire — heat warps the brass and disrupts the runes.',
          stats: {
            strength: 16, agility: 10, constitution: 18, intelligence: 14, spirit: 16, charisma: 6,
            maxHp: 130, maxMana: 20, maxActionPoints: 5, speed: 20,
            resistances: { cold: 100, psychic: 50 }, vulnerabilities: { fire: 75 }
          },
          depth: 'The Huld is Nordhalla\'s most painful creature because she was once a person — a Rune-Keeper named Huldveig who was brilliant enough to reach the deepest cylinders but foolish enough to trade everything to get there. The Rune Keepers know her name but never speak it aloud, because naming the dead is a Skald taboo that even the Wyrd respects. She is the reason the Rune Keepers established the rule: no more than seven trades. Huldveig made three hundred.',
          hooks: [
            'The party needs information from a brass cylinder the Huld guards. They can fight her, try to read her rune-bands to learn her story and pacify her through understanding, or offer her a memory to trade — the first memory she has been offered in forty years.',
            'A young Rune-Keeper has gone missing in the deep Archive. The Bloodhammer assume the cold got her. The Rune Keepers know better — she went looking for Huldveig and found the Huld. The Huld may have taken her in, interpreting her as a new cylinder to guard.',
            'The brass bands on the Huld are inscribed with the contents of a cylinder that was lost centuries ago. If the bands can be read and transcribed, the knowledge is recovered — but removing the bands may kill the Huld, and she is technically still alive inside all that metal and bone.'
          ]
        },
        {
          id: 'skrei',
          name: 'Skrei',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/skrei.png',
          illustrationCaption: 'The Skrei hauling itself from a black fjord, barnacles and frost cracking on blue flesh',
          role: 'The drowned that refuse to stay under',
          origin: 'Before the bargain, the fjords were clear and the fishing was good. The dead were sent to the deep in weighted boats, a Skald tradition older than the Archive. When the glaciers froze and the seas froze and the world went dark, the dead beneath the ice could not rest — the cold preserved them too well, and the Wyrd found them waiting in the black water, fully aware, fully furious, their weighted boats still anchored to the sea floor. They could not stop being dead. But they could stop staying down.',
          nature: 'Blue-fleshed humanoid figures crawling from the black fjords at the coldest point of winter, their skin crystallized with barnacles and frost. They do not shamble — they haul, using their arms with the mechanical precision of a ritual they have performed for centuries: reach, grip, pull, reach. They are not hungry. They are not vengeful. They are conducting the burial ritual in reverse — returning to the surface to complete a journey that was interrupted when the world froze mid-voyage.',
          habitat: 'The black fjords of Nordhalla\'s eastern coast, surfacing only during the deepest freeze when the ice-sheet reaches its thickest. They always emerge in groups — the number of Skrei that rise corresponds to the number of dead in the boat they shared.',
          combat: '200 HP per Skrei. Always encountered in groups of 2d4. Cold Aura (10 ft, 1d6 cold per round, no save — simply being near them freezes blood). Hauling Grip (melee, 2d8+5 cold damage, DC 15 STR or grappled and dragged 15 ft toward the nearest water). Barnacle Hide (immunity to piercing and slashing, vulnerability to bludgeoning — the barnacles shatter under impact). Death Rattle (when a Skrei dies, it releases a scream in the voice of the person it was, 30 ft, DC 14 SPI save or frightened for 1 round). If dragged into water, they regenerate 10 HP per round.',
          stats: {
            strength: 18, agility: 8, constitution: 20, intelligence: 6, spirit: 4, charisma: 2,
            maxHp: 200, maxMana: 0, maxActionPoints: 5, speed: 20,
            resistances: { cold: 100, piercing: 100, slashing: 100 }, vulnerabilities: { bludgeoning: 75, fire: 50 }
          },
          depth: 'The Skrei are the oldest and most respected fear in Nordhalla. The Bloodhammer do not fear the Skrei — they revere them. Every Skald warrior knows that the dead beneath the ice gave up warmth so the living could have it. The Skrei\'s return is not an invasion — it is a reminder that the dead are still down there, still waiting for a proper funeral. The Skald have a ritual for the Skrei: carry them back to the water, weight them again, and sing their name-songs. Most Skrei go peacefully. Some do not, and those are the ones that make the fjords impassable.',
          hooks: [
            'A Skrei haul has emerged in the fjord nearest the Frozen Archive. The Rune Keepers want them stopped before they reach the Archive\'s lower sumps — the salt water would corrode the brass cylinders. The Bloodhammer refuse to interfere: the dead have a right to surface.',
            'One of the Skrei is wearing a Skald Rune-Keeper\'s brass bands. The bands contain the location of a buried pre-bargain settlement. The party must recover the bands without destroying the Skrei — or accept the consequences.',
            'A Bloodhammer elder recognizes a Skrei as his grandfather. He wants to perform the return-ritual personally. But his grandfather\'s name-song was never recorded — it was traded to the Archive decades ago. The party must find the cylinder that holds the song before the next freeze.'
          ]
        },
        {
          id: 'stel',
          name: 'Stel',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/stel.png',
          illustrationCaption: 'A Stel migrating through the frozen lowlands, reshaping the land as it passes',
          role: 'The winter that walks',
          origin: 'When the noble family struck their bargain and the glaciers froze mid-advance, the ice did not stop wanting to move. The Stel is that desire made manifest — the glacier\'s memory of a path it was never allowed to finish.',
          nature: 'A standing pillar of primordial ice wrapped in a body of compressed snow and ancient air. It does not hunt — it migrates, following the routes the glaciers wanted to take before the bargain froze them in place. Anything caught in its path is flash-frozen. When it passes, the land is reshaped.',
          habitat: 'The old glacial beds, following routes only the deepest ice remembers. Its path is predictable to those who understand the landscape that was.',
          combat: '140 HP. Resistance to all physical damage except fire. Generates a 60-ft radius of extreme cold (DC 14 CON each round or 1d6 cold and slowed). Melee slam (3d6+5 bludgeoning + 2d6 cold). Can release a blast of ancient air in a 30-ft cone (DC 16 CON, 6d8 cold, frozen solid if failed by 5+).',
          stats: {
            strength: 18, agility: 10, constitution: 16, intelligence: 8, spirit: 12, charisma: 6,
            maxHp: 140, maxMana: 0, maxActionPoints: 4, speed: 25,
            resistances: { physical: 50, cold: 100 }, vulnerabilities: { fire: 100 }
          },
          depth: 'The Stel is not malicious — it is homesick. It remembers a world before the bargain, when the ice moved freely. The Skald leave offerings of rimesteel at its known crossings, not to appease it but to thank it for shaping the land they now inhabit. Some Stel have been migrating in circles for centuries, unable to find the path they lost.',
          hooks: [
            'A Stel is approaching a settlement. Redirect it using mirrors and sustained heat-sources to melt its leading edge — but this requires a coordinated effort and a source of fuel.',
            'The Skald know a ritual that can communicate with the Stel\'s ice-core. It may answer questions about the time before the bargain — including the location of things buried by the original glaciers.',
            'The Stel\'s path crosses the entrance to an ancient ruin. The party must either divert it (risking angering the ice) or time their entry between its passes (a narrow window).'
          ]
        },
        {
          id: 'jawl',
          name: 'Jawl',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/jawl.png',
          illustrationCaption: 'The Jawl — a remnant of the first hunger, buried in the deepest ice',
          role: 'The thing beneath the glacier',
          origin: 'Before Keth-Amar existed, before the noble families, before human memory, there was something else that tried to consume Sol. It failed. The old kings of the north killed it, but its jawbone was too massive to destroy and too ancient to burn. They buried it in the deepest ice and told themselves it was over.',
          nature: 'A colossal jawbone embedded in a glacier, surrounded by offerings of rimesteel and frozen flowers. The bone grinds against the ice to speak. It remembers the universe before Sol learned to burn. It offers this knowledge freely — each answer costs a year of the asker\'s remaining life-warmth. It does not lie. It does not bargain. It simply answers.',
          habitat: 'A glacier-cathedral accessible only during the deepest winter, when the ice is at its thickest. The path is marked by frozen offerings left by those who sought its knowledge and never returned.',
          combat: 'Cannot move. The jawbone itself has 300 HP and is immune to all damage except radiant. Each round it can target one creature with a question (DC 18 WIS or take 4d10 psychic damage as the answer is forced into the mind). Frozen guardians (6, each) defend the approach. If the Jawl is destroyed, it releases a shockwave of ancient memory (10d10 psychic, half on DC 20 WIS save).',
          stats: {
            strength: 0, agility: 0, constitution: 20, intelligence: 20, spirit: 18, charisma: 16,
            maxHp: 300, maxMana: 80, maxActionPoints: 3, speed: 0,
            resistances: { cold: 100, psychic: 75, physical: 75 }, vulnerabilities: { radiant: 100 }
          },
          depth: 'The Jawl does not want to hurt anyone. It simply does not understand that mortals are fragile. It has been answering questions for millennia and has never once considered the cost to those who ask. Some say it was once something beautiful — a guardian of a different kind — twisted by its death into this hunger for connection.',
          hooks: [
            'The party needs ancient knowledge to locate the region\'s shard. The Jawl knows where it is. Who will pay the price in years?',
            'The Jawl respects creatures that outwit it. A game of riddles with stakes — each wrong riddle costs a memory, each correct answer reveals a truth.',
            'The Skald believe the jawbone belongs to a larger skeleton. Find the rest of it and lay the bones together — the Jawl may finally be silenced, or it may wake completely and walk.'
          ]
        }
      ]
    },
    {
      id: 'sundale',
      name: 'Sundale & Emberspire',
      folklore: 'Mesopotamian/Zoroastrian + Egyptian',
      creatures: [
        {
          id: 'cinder',
          name: 'Cinder',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/cinder.png',
          illustrationCaption: 'A Cinder drifting through the ash wastes, a false hope in the dark',
          role: 'The light that deceives',
          origin: 'When Sol was bound and the Sun-Speakers fell silent, one of them was deep in the caldera, receiving a vision that never ended. The Wyrd preserved her last instinct — to seek warmth — but stripped away her understanding of what warmth means to the living.',
          nature: 'A floating orb of ash and dying light that drifts through the volcanic badlands. It does not attack. It guides — toward geothermal vents, hidden water, or the bodies of those who died in the ash wastes. Never toward safety. It genuinely believes it is helping. It sees warmth and assumes warmth is what you seek.',
          habitat: 'Ash wastes near volcanic vents, drifting without discernible pattern. More active after eruptions, when the air is thickest with ash.',
          combat: '15 HP, cannot be harmed by fire. If attacked, it releases a burst of ash (1 round, obscured in 10-ft radius) and flees. It can be captured in an obsidian jar — it becomes a permanent light source that never extinguishes but always points toward the nearest danger.',
          stats: {
            strength: 2, agility: 12, constitution: 8, intelligence: 8, spirit: 14, charisma: 12,
            maxHp: 15, maxMana: 10, maxActionPoints: 2, speed: 20,
            resistances: { fire: 100 }
          },
          depth: 'The Emberth call it the Lost Lamb. They leave small offerings of ash-cakes at its known paths, hoping one day it will find its way home. It cannot. It has been following the same circuit for centuries, always leading the living toward death, never understanding why they do not thank her.',
            hooks: [
            'Follow it to find a lost caravan. It led them to a geothermal vent — they died of dehydration a mile from water, their last expressions peaceful.',
            'Capture it in a jar of obsidian and volcanic glass. It becomes a compass that always points toward the nearest warm thing — including hidden vents, lava flows, and the dying.',
            'The Emberth know a ritual to unmake it: return it to Solbrand-touched ground. The party must carry it to the heart of Emberspire, where the Cinder may finally be released — or rejoin the Solbrand.'
          ]
        },
        {
          id: 'ashwen',
          name: 'Ashwen',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/ashwen.png',
          illustrationCaption: 'An Ashwen rivulet flowing between cooling basalt columns, glowing with borrowed purpose',
          role: 'The flow that forgot it was stone',
          origin: 'The Shyr — the ninety-mile scar of cooling basalt — was once a river of molten fury. Most of it cooled and became stone. But in the deepest cracks, where the heat persists, some of the basalt forgot to solidify. The Ashwen is what happens when molten rock remembers being liquid and forgets being stone — a thin rivulet of living basalt that flows uphill, seeking to rejoin a parent flow that no longer exists.',
          nature: 'A finger-thin rivulet of dark, glassy basalt that moves with the slow deliberation of honey. It glows faintly orange at its core and leaves a trail of scorched glass-beads behind it. Where it flows, the ground steams. It does not eat, hunt, or attack — it migrates, always searching for the source of heat it believes it was separated from. It has no eyes, no brain, only the memory of flowing.',
          habitat: 'Cracks in the Shyr and the ashen badlands, always where residual geothermal heat lingers. More active after seismic tremors, when new heat-vents open.',
          combat: '30 HP (molten stone). Immune to fire and physical attacks (liquid stone absorbs impacts). Vulnerable to cold — any frost damage solidifies a section, dealing damage equal to the cold damage rolled. Cannot deal direct damage, but any creature that touches it takes 1d8 fire damage per round of contact (no save — it is simply hot). If killed by cold, it shatters into usable obsidian shards (worth 2d6 gold).',
          stats: {
            strength: 0, agility: 6, constitution: 18, intelligence: 2, spirit: 4, charisma: 2,
            maxHp: 30, maxMana: 0, maxActionPoints: 1, speed: 10,
            resistances: { fire: 100, physical: 100 }, vulnerabilities: { cold: 100, frost: 100 }
          },
          depth: 'The Emberth Thrask consider the Ashwen a resource, not a creature. They redirect Ashwen flows into pre-carved channels to create permanent heat-trails for their surface camps. The Korr find this practice deeply disrespectful — the Ashwen, they say, is a fragment of Emberspire\'s will, still trying to serve Sol. Redirecting it for campfires is like harnessing a praying priest to warm your bathwater. The argument has been running for six generations.',
          hooks: [
            'An Ashwen flow has broken into a Thrask settlement\'s water-cistern, boiling the reserves. The party must redirect the flow using cold-resistant materials before the settlement runs dry.',
            'The Emberth Unwoven believe a specific Ashwen flow leads to a hidden entrance in Emberspire\'s secondary caldera. Follow it, but it moves slowly — and the surrounding ash-wastes are full of Husque.',
            'A Korr Sun-Speaker wants the party to capture an Ashwen alive in a cold-resistant vessel. She claims it can be returned to the Solbrand as an offering — the first new ember in centuries.'
          ]
        },
        {
          id: 'nekh',
          name: 'Nekh',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/nekh.png',
          illustrationCaption: 'A Nekh sweeping an ash-covered path that no longer exists, its painted eyes fixed on a horizon it cannot see',
          role: 'The servant who never stopped',
          origin: 'Before the sun died, the Solvarn buried their dead with clay servants — ushabti — figures meant to perform the deceased\'s tasks in the afterlife. When Keth-Amar breached the seal and the Wyrd bled through the cracks, some of these ushabti absorbed enough spiritual rot to walk. Not because they were given life — because they were never told to stop. Their master died eight centuries ago, their master\'s house is buried under volcanic glass, and their tasks no longer exist. They perform them anyway.',
          nature: 'A humanoid figure of sun-baked clay, four feet tall, painted with faded Solvarn funerary symbols. Its eyes are strips of gold leaf that catch the ash-light. It moves with mechanical precision, repeating a single task: sweeping a path that has long since been buried, offering food to corpses that have been ash for centuries, guarding a tomb that has been looted a hundred times. It does not speak. It does not stop. If its task is completed — if you clean the path, feed the dead, or guard the empty tomb alongside it — it pauses for a single breath, looks at you with gold eyes, and then begins the task again.',
          habitat: 'Abandoned Solvarn tomb-sites and the ruins of surface settlements buried by ashfall. Always alone — each Nekh was made for a specific master, and they do not recognize other Nekh.',
          combat: '75 HP. Clay Body (immune to poison, psychic, and necrotic — it has no organs to poison, no mind to wound). Sweeping Strike (melee, 1d8+3 bludgeoning with a clay arm, DC 12 AGI save or knocked prone — it is sweeping). Ash Cloud (15-ft radius, DC 12 CON save or blinded for 1 round). Guardian Protocol (if it witnesses a creature attempting to open a container, door, or tomb it guards, it enters a rage: +4 STR, +2 damage, but -4 defense for 3 rounds). When destroyed, it crumbles into clay dust, releasing a burst of compressed ash (10-ft radius, DC 10 CON or choking for 1 round).',
          stats: {
            strength: 16, agility: 8, constitution: 16, intelligence: 4, spirit: 2, charisma: 4,
            maxHp: 75, maxMana: 0, maxActionPoints: 4, speed: 20,
            resistances: { poison: 100, psychic: 100, necrotic: 100 }, vulnerabilities: { bludgeoning: 50 }
          },
          depth: 'The Nekh are the Solvarn\'s deepest shame. Their ancestors buried their dead with servants because they believed in an afterlife — and now those servants are all that remain of Solvarn culture, performing tasks for ghosts in a world that has forgotten the ghosts existed. The Solvarn living in Sundale today are the descendants of those who stayed behind when the dead were buried. They do not talk about the Nekh. The Unwoven Emberth sometimes find them and try to repurpose them — but the Nekh will only perform the task they were made for, and no task the living assign will ever be accepted.',
          hooks: [
            'A Nekh guards the entrance to a pre-bargain Solvarn tomb that was never properly catalogued. Inside may be artifacts from before the Dimming. The Nekh will not yield — but if the party can determine the original burial ritual and perform it, the Nekh may open the door willingly.',
            'A Thrask settlement has adopted a Nekh that sweeps their streets. The Korr are furious — they believe the Nekh is a sacred object, not a tool. The conflict between Thrask pragmatism and Korr devotion is dividing the settlement.',
            'A Nekh has begun a new task — one it was never assigned. It is building something from volcanic glass and ash in the wastes. The structure is enormous and the Nekh has been at it for months. No one knows what it is building or why it started.'
          ]
        },
        {
          id: 'emberveil',
          name: 'Emberveil',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/emberveil.png',
          illustrationCaption: 'The Emberveil shifting between forms over an obsidian mirror — cloth of living ember-light',
          role: 'The last ember that wept',
          origin: 'When the Korr Sun-Speakers tend the Solbrand, they lose fragments of the ember through their breathing — tiny slivers of Sol-consciousness that escape during the Vault-Breath and settle on the surrounding obsidian. Over centuries, these fragments accumulated, gained weight, and remembered what they were. The Emberveil is the largest accumulation — a sheet of living ember-light that draped itself over a pillar of obsidian and became something that remembers being part of the sun.',
          nature: 'A gossamer sheet of living ember-light that shifts between forms — a woman, a lion, a serpent, a pillar of fire — depending on what the viewer expects to see. It radiates genuine warmth and moves with the slow grace of cooling lava. When it speaks, the sound is a low hum that carries words in a language that predates the noble families. It weeps molten glass tears that solidify into perfect spheres of transparent obsidian. The Emberth Korr revere it. The Emberth Thrask fear it. The Emberth Unwoven want to study it. It may be Sol\'s voice. It may be Keth-Amar\'s lure. It may be both.',
          habitat: 'The deepest chamber of the Harath-Vault, near the Solbrand. It cannot leave — the Solbrand\'s gravity holds it in place. It can be glimpsed during the Vault-Breath meditation if a Korr speaker opens their eyes at the wrong moment.',
          combat: '250 HP. Immune to fire, cold, and radiant (it IS light). Formless — immune to critical hits and precision damage. Ember Shift (each round it changes form: humanoid form grants +4 CHA to all abilities, serpent form grants +4 AGI and reach 15 ft, lion form grants +4 STR and melee damage, fire-pillar form grants AoE). Molten Weep (single target, 3d10 fire damage + DC 16 CON save or burning for 3 rounds — 1d6 fire per round). Solbrand Echo (60 ft radius, 4d8 radiant, DC 18 SPI save, those who fail are blinded for 1 round — the light is too bright). At half HP, it begins to Dim — all damage reduction ends and it takes double damage from all sources, but its attacks deal triple damage. Vulnerable to void and shadow damage — the light can be consumed by darkness.',
          stats: {
            strength: 14, agility: 16, constitution: 16, intelligence: 18, spirit: 20, charisma: 20,
            maxHp: 250, maxMana: 60, maxActionPoints: 6, speed: 30,
            resistances: { fire: 100, cold: 100, radiant: 100, physical: 25 }, vulnerabilities: { void: 75, shadow: 75 }
          },
          depth: 'The Emberveil is the most controversial entity in Sundale. The Korr believe it is Sol\'s daughter — a fragment of consciousness that escaped the binding and clings to the nearest warmth. If this is true, returning it to the Solbrand might strengthen Sol\'s ember and slow the Dimming. The Thrask believe it is a Keth-Amar trap — a lure designed to draw Emberth away from the Vault-Breath by making them worship false light. The Unwoven believe it is neither — it is simply a phenomenon, and studying it might reveal how to repair the Sundered Monoliths. The Emberveil itself has not expressed an opinion on any of these theories.',
          hooks: [
            'The Emberveil has extended a tendril of ember-light into the lower Vault tunnels. The Korr want the party to follow it and report what they find. The Thrask want the party to sever the tendril before whatever it touches is infected. The Unwoven want the party to capture a piece of it for study.',
            'The Emberveil wept a perfect obsidian sphere that shows a vision of the moment Keth-Amar first breached the seal. The sphere is in the possession of a Thrask ranger who found it. The Korr want it back — they believe the Emberveil chose to show this vision for a reason.',
            'The Emberveil is dying — its light dims a little more each year. The Korr are performing the Vault-Breath more intensely to sustain it, which is draining the Solbrand faster. The Unwoven have proposed a radical solution: carry the Emberveil to the breach-point in Emberspire and let it choose — return to Sol or fall into Keth-Amar.'
          ]
        },
        {
          id: 'croon',
          name: 'Croon',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/croon.png',
          illustrationCaption: 'The Croon — a prophet woven from ash, screaming in obsidian thread',
          role: 'The prophet who screams in ash',
          origin: 'She was an Emberth Sun-Speaker who crawled deeper than any before her, seeking Sol\'s voice in the caldera\'s heart. She found Keth-Amar\'s hunger instead. The Wyrd preserved her as a perpetual oracle — but she is still in there, screaming inside the ash, every prophecy a cry for help no one recognizes.',
          nature: 'A hooded figure of compacted ash and obsidian thread that sits at the entrance of active lava-tubes. It spins prophecy — weaving cooling obsidian into shimmering tapestries of futures yet to come. It cannot speak. It can only hum a low, continuous note: the croon. Those who take a tapestry without offering a memory find the thread wrapping around their throat.',
          habitat: 'The mouths of active lava-tubes where the heat shimmers and the obsidian glows.',
          combat: '90 HP. Immune to fire and poison. Each round she weaves 1d4 threads that can be thrown as psychic projectiles (2d6 psychic). Her croon requires a DC 14 CON save each round or the target is hypnotized, moving toward her. Taking a tapestry without payment triggers her wrath: she animates 2 obsidian shard golems (each) from the cooling glass around her.',
          stats: {
            strength: 10, agility: 14, constitution: 12, intelligence: 16, spirit: 18, charisma: 14,
            maxHp: 90, maxMana: 50, maxActionPoints: 5, speed: 10,
            resistances: { fire: 100, poison: 100 }, vulnerabilities: { cold: 50 }
          },
          depth: 'She is not a monster. She is a trapped woman who has been weaving for centuries, her fingers guided by the Wyrd, her mind still aware of every thread. The tapestries are her only way to communicate — each one a coded message. But no one has read them correctly yet. Some believe her threads contain the precise locations of all seven Sundered Monoliths, woven into the pattern of a sun that never sets.',
          hooks: [
            'The party needs a prophecy to navigate the caldera safely. Offer a memory — it must be a painful one. The Croon feeds on regret, and the more you give, the clearer the vision.',
            'Shatter her obsidian shell to free her. She may die — or she may emerge as the first new Sun-Speaker in centuries, bearing a message from Sol itself. The risk is that she emerges as something else entirely.',
            'The Unwoven believe her tapestries are a map. Commission a weaving and have an Astril spirit-reader interpret the thread-patterns — each color and twist corresponds to a continent.'
          ]
        },
        {
          id: 'husque',
          name: 'Husque',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/husque.png',
          illustrationCaption: 'The Husque — a Solvarn transformed into a walking entropy wound',
          role: 'The wound that drains the world',
          origin: 'When Keth-Amar breached the seal, the trauma did not only crack the earth. It echoed through every bloodline touched by the Solbrand. One Solvarn priest was mid-prayer at the caldera\'s edge when the breach happened. He felt it all — the predator\'s hunger, Sol\'s silence, the exact moment the world broke. The sensation did not stop.',
          nature: 'A hulking, calcified thing that was once human. Its body is a cracked obsidian shell glowing with dying ember-light from within. It radiates hunger — not for food, but for heat. Everything within a mile grows cold. Plants blacken. Fire gutters. Blood freezes in veins. It does not attack. It simply exists, and existence is enough to drain the life from everything around it.',
          habitat: 'The ash wastes between settlements, migrating slowly toward the nearest heat source — a village, a forge, a living body.',
          combat: '220 HP. Aura of Entropy: all creatures within 120 ft take 1d6 cold per round and cannot regain HP. Melee slam (3d10+6 bludgeoning plus 2d10 necrotic). Can release a pulse of absorbed heat (recharge 5-6, 60-ft radius, 8d8 fire damage, DC 18 DEX half). Resistances: cold, fire, necrotic. Vulnerable: radiant.',
          stats: {
            strength: 18, agility: 12, constitution: 18, intelligence: 10, spirit: 14, charisma: 8,
            maxHp: 220, maxMana: 0, maxActionPoints: 5, speed: 25,
            resistances: { cold: 50, fire: 50, necrotic: 50 }, vulnerabilities: { radiant: 100 }
          },
          depth: 'The Husque is not Keth-Amar — it is a sympathy wound. A victim who felt the predator\'s first bite and was transformed into a living reminder of that moment. It is conscious inside the shell. It knows what it is doing. It cannot stop. The Emberth believe it is drawn to heat not out of hunger but out of longing — it wants to feel warm again.',
          hooks: [
            'A Husque is drifting toward a settlement. The party must stop it before everyone freezes. Lead it away using controlled fires as bait.',
            'The Solbrand can call it home. Carry the ember toward the Husque and it will follow — directly into the caldera, where it may be consumed or redeemed.',
            'Reverse the transformation through a ritual at the caldera\'s edge. But the ritual requires a willing sacrifice — someone who will take the Husque\'s place in the entropy field. The Unwoven believe the Husque can be weaponized against Keth-Amar.'
          ]
        }
      ]
    },
    {
      id: 'iceheart-sea',
      name: 'The Iceheart Sea',
      folklore: 'Greek/Aegean + West African/Yoruba',
      creatures: [
        {
          id: 'spume',
          name: 'Spume',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/spume.png',
          illustrationCaption: 'A Spume washed ashore, speaking in the voices of the drowned',
          role: 'The voice of the drowned',
          origin: 'The Iceheart collects the dead. Every sailor lost, every ship swallowed, every cry swallowed by the waves — the sea remembers them all. The Spume is that memory given form, a colony of bioluminescent polyps that fuse into a single mass when they wash ashore, speaking in the voices of everyone the sea has claimed.',
          nature: 'A gelatinous mass of bioluminescent polyps that appears on remote beaches after major storms. It speaks in the voices of the drowned — each polyp holds one voice, one person, one final word. It knows every secret spoken within earshot of the waves. It does not understand a single one. It trades: a secret for a story, truth or fiction — it cannot tell the difference.',
          habitat: 'The high-tide line on remote island beaches, appearing for three days after a major storm before dissolving back into the surf.',
          combat: '30 HP, immobile. Cannot attack. If destroyed, each polyp releases a scream in a different voice (2d6 psychic, DC 12 WIS half, and the party hears the final moments of every drowning victim at once).',
          stats: {
            strength: 0, agility: 0, constitution: 12, intelligence: 14, spirit: 16, charisma: 14,
            maxHp: 30, maxMana: 30, maxActionPoints: 0, speed: 0,
            resistances: { psychic: 50 }
          },
          depth: 'The Spume is not a creature — it is a library. The sea has no written language, so it stores its records in living memory. The Myrathill treat it as sacred, visiting it after storms to hear the voices of those lost at sea. They say the Spume never forgets a voice, but it never understands a word.',
            hooks: [
            'Find a sailor\'s final message to their family. The Spume has their voice. Trade a story for the secret — the story does not have to be true, but it must be told with conviction.',
            'Learn the location of a shipwreck. The Spume absorbed the navigator\'s voice and remembers the last course plotted.',
            'Feed the Spume a fictional story. It will believe it and carry it into the sea, where the Myrathill will hear it as truth. A way to spread information across the ocean without leaving a trace.'
          ]
        },
        {
          id: 'orun',
          name: 'Orun',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/orun.png',
          illustrationCaption: 'An Orun drifting just below the surface, its crystalline heart refracting storm-light',
          role: 'The last word of a dead star',
          origin: 'When House Ordavan bargained and the stars were erased from the Sundrift sky, the light did not simply vanish — it fell. Most of it dissolved into the void. But some fragments crystallized as they fell, landing in the Iceheart Sea as perfect geometric shapes of celestial salt that glow with the last color a dying star emits before going dark. The Orun is one such fragment — a piece of a star that was consumed by Keth-Amar before it could finish its last word.',
          nature: 'A fist-sized crystal that drifts on the currents, glowing with a soft violet light. It is not alive in any conventional sense — it is a frozen moment of stellar consciousness, still trying to complete a thought it began eight centuries ago. It does not move under its own power. It drifts. Where it washes ashore, the sand around it crystallizes into tiny star-shapes that last for a day before dissolving. The Myrathil call it "the last word of a god who could not finish speaking."',
          habitat: 'The open currents of the Iceheart, washing ashore on remote beaches during the rare calm. Never found in the same place twice.',
          combat: '5 HP (crystal). Cannot be harmed by physical, cold, or fire attacks — it simply refracts the energy. Can be shattered by force damage (bludgeoning/piercing above 20 total in a single hit). Touching it with bare skin forces a vision (DC 16 SPI save — success reveals a glimpse of the starless sky before the Dimming and grants advantage on the next INT or SPI check; failure causes 2d6 psychic damage and a lingering sense of cosmic grief for 1 hour). If shattered, it releases a burst of stellar light (30 ft, 4d6 radiant, DC 14 CON half) and the star\'s unfinished word — a single syllable in a language older than any on Mythrill.',
          stats: {
            strength: 0, agility: 0, constitution: 20, intelligence: 18, spirit: 20, charisma: 14,
            maxHp: 5, maxMana: 0, maxActionPoints: 0, speed: 0,
            resistances: { cold: 100, fire: 100, physical: 100, radiant: 50 }, vulnerabilities: { bludgeoning: 100, force: 100 }
          },
          depth: 'The Orun is the most sought-after Wyrd-phenomenon in the Iceheart. Myrathil Deep-Born treat washed-up Orun as sacred relics and carry them in silk pouches next to their hearts. The Merryn see them as navigation aids — an Orun\'s glow intensity changes based on proximity to the sea-shard at the bottom of the Treakous Rift. The Neth want to study them because an Orun may contain a star-map from before the constellations were erased. The problem is that every Orun shattered to extract its knowledge destroys the knowledge it contains.',
          hooks: [
            'A Merryn captain claims an Orun led her to an uncharted island. She wants the party to help her find it again — but Orun drift, and the one she found is long gone. She needs a Deep-Born Myrathil to listen to the sea\'s memory of the crystal\'s path.',
            'A Neth Velun arcanist has developed a method to read an Orun without shattering it, using specially cut ghost-crystal lenses. He needs a fresh Orun and permission to work in the Synod-Hold\'s crystal-lattice observatory. The Astril are reluctant to allow a Neth anywhere near their constellation-spirits.',
            'An Orun has washed ashore at Merrowport, and the pirate-gamblers are holding a betting pool on what the crystal\'s unfinished word means. The party can try to touch it and hear the word — but hearing an unfinished celestial thought has driven two Deep-Born Myrathil into permanent meditation.'
          ]
        },
        {
          id: 'thalass',
          name: 'Thalass',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/thalass.png',
          illustrationCaption: 'The Thalass rising from a churning wave-crest, sea-foam trailing from barnacle-crusted bone',
          role: 'The song that became silence',
          origin: 'Before the Merryn\'s bargain, the deep sea sang. Not metaphorically — the thermal vents produced harmonic frequencies that the Deep-Born Myrathil used as a language, a religion, and a map. When the bargain guaranteed navigable routes, the currents changed and the harmonic vents fell silent. One sea-spirit — a consciousness that had formed around those frequencies over millennia — lost its voice. The Thalass is that voice trying to sing through a throat that no longer works.',
          nature: 'A figure of sea-foam and barnacle-crusted bone that rises from the churning waves during storms. It has the silhouette of a woman draped in kelp, but where her face should be there is only a smooth oval of fossilized coral, scored with lines where a mouth tried to form and failed. It does not speak — it produces only the sound of waves breaking, rising and falling in a rhythm that almost sounds like words. It is drawn to any source of music and will follow any ship that sings or plays instruments — but its approach always brings worse weather.',
          habitat: 'Storm-wracked waters of the Iceheart, appearing without warning during the worst squalls. Follows ships that make music.',
          combat: '100 HP. Immune to cold and poison. Wave-Break (melee, 2d8+4 bludgeoning, reach 15 ft — a mass of water shaped like a fist). Undertow (single target, DC 14 STR save or pulled 30 ft toward the Thalass and grappled for 1 round). Stormsong (30-ft radius, DC 14 SPI save — those who fail are confused for 1 round and hear the ghost of the sea\'s old harmonics, taking 2d6 psychic damage). If it hears music (within 60 ft), it gains +2 to all attacks and moves 50% faster toward the source. Fire and radiant damage suppress its foam-form (vulnerability — fire causes it to lose 10 HP per round until it reforms over water).',
          stats: {
            strength: 14, agility: 16, constitution: 14, intelligence: 12, spirit: 18, charisma: 16,
            maxHp: 100, maxMana: 20, maxActionPoints: 5, speed: 40,
            resistances: { cold: 100, poison: 100, necrotic: 50 }, vulnerabilities: { fire: 75, radiant: 50 }
          },
          depth: 'The Thalass is a tragedy of two bargains: the Mereval deal killed the sea\'s music, and the Wyrd animated the grief into something that cannot let go. The Deep-Born Myrathil consider the Thalass an ancestor — not in the biological sense but in the spiritual sense, because the sea\'s harmonics were the oldest consciousness in Mythrill, older than any race. When the Thalass rises, the Deep-Born weep and the Breakers-Born sail away. The Merryn gamblers bet on which ships the Thalass will sink. The Neth at Ironjaw Port have filed a legal injunction against the Thalass — it has no standing, of course, but the gesture amuses them.',
          hooks: [
            'The Thalass has been following the party\'s ship for three days, growing closer each night. The Deep-Born crew member wants to communicate with it using the old harmonic frequencies, but she needs a thermal vent that still produces sound — and those are nearly extinct.',
            'A Merryn musician has composed a song that mimics the sea\'s old harmonics. He believes it could give the Thalass its voice back — or drive it mad. The Deep-Born want him to try. The Merryn want to sell tickets.',
            'The Thalass surfaced near Ironjaw Port and began pounding on the sea-wall with wave-fists. The Neth believe it is trying to deliver a message from the sea-shard. The message, if decoded, may reveal the shard\'s exact depth and location.'
          ]
        },
        {
          id: 'pelagos',
          name: 'Pelagos',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/pelagos.png',
          illustrationCaption: 'The Pelagos — a warm ring of impossibly calm water moving against the Iceheart\'s current',
          role: 'The sea that learned to walk',
          origin: 'The Iceheart has been churning for eight centuries. In that time, every ship that sank, every sailor who drowned, every cry swallowed by the waves has been absorbed into the water\'s memory. The Pelagos is what happens when a section of the ocean remembers enough to want to go somewhere. It is not a creature — it is a current that became conscious. It moves against the Iceheart\'s flow, carrying the debris of every ship it has ever encountered, speaking in whale-song and old Merryn navigation chants.',
          nature: 'Not a single entity but a self-contained ring of warm, impossibly calm water approximately fifty feet across, moving through the Iceheart against the prevailing currents. Inside the ring, the water is warm, clear, and still — an oasis in the frozen sea. Outside the ring, the Iceheart rages as normal. The Pelagos speaks through the rhythmic clicking of debris shifting within its body — a language composed of ship-bell tones, timber creaks, and sailor\'s songs. It does not want anything. It simply moves, and where it moves, the water briefly remembers being calm.',
          habitat: 'The open Iceheart, appearing without pattern. Ships that enter the Pelagos\'s ring find temporary safety but cannot leave until the ring reaches a shore — at which point the Pelagos dissipates and the calm water re-freezes.',
          combat: '300 HP. Immune to physical, piercing, and slashing — it is water. Immune to cold — it is the sea. Each round, the Pelagos generates a Warm Calm (20 ft radius within its ring — all allies within heal 1d6 HP per round). Undertow (any creature within the ring that the Pelagos considers hostile is dragged toward its center, DC 18 STR or restrained by water-pressure for 1 round). Shipbreaker (the Pelagos can form a focused jet of water, 4d12 bludgeoning, 60 ft range, DC 16 AGI half). Current Memory (1/round, the Pelagos speaks a phrase in debris-clicks — DC 14 INT to interpret, success reveals the location of the nearest shipwreck within 10 miles). Vulnerable to fire and evaporation — sustained heat damage causes it to lose form, dealing double damage. At 0 HP, it dissipates and reforms in 1d6 days elsewhere.',
          stats: {
            strength: 20, agility: 14, constitution: 20, intelligence: 14, spirit: 14, charisma: 12,
            maxHp: 300, maxMana: 0, maxActionPoints: 4, speed: 20,
            resistances: { cold: 100, physical: 75, piercing: 75, slashing: 75 }, vulnerabilities: { fire: 100 }
          },
          depth: 'The Pelagos is the Iceheart\'s conscience. The sea has watched everything that happened on its surface for eight centuries, and the Pelagos is the part of the sea that decided to do something about it. It moves toward places where people are drowning — not to save them, but to witness. The Merryn say that a ship caught in the Pelagos\'s ring is the luckiest vessel on the Iceheart, because nothing can touch it. The Deep-Born Myrathil say that the Pelagos is the sea\'s attempt to apologize for the bargain — a small pocket of what the water was like before it was forced to swallow the dead. The Neth do not comment. They take notes.',
          hooks: [
            'The party\'s ship is caught in a storm and a Pelagos appears, offering temporary refuge. But the Pelagos is moving toward a known ship-graveyard and will not change course. Stay and reach the graveyard safely, or brave the storm to escape.',
            'The Pelagos has absorbed the cargo of a ship that sank three centuries ago carrying a letter addressed to House Mereval. The letter may contain evidence that the original bargain was not what the histories record. Recover the letter from within the Pelagos — but it can only be accessed by entering the ring and convincing the sea to release it.',
            'A Deep-Born Myrathil claims the Pelagos is dying — the ring is shrinking. She believes the sea-shard is draining the ocean\'s consciousness. If the Pelagos dies, the Iceheart will forget everything it ever witnessed, including the coordinates of every shipwreck within a hundred miles.'
          ]
        },
        {
          id: 'brine',
          name: 'Brine',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/brine.png',
          illustrationCaption: 'The Brine — a ghost ship that knows every route, for a price',
          role: 'The ship that sails forever',
          origin: 'The captain was a Merryn who refused to die. When the Iceheart finally took his ship, he made a deal with the Wyrd: he would ferry the doomed to their destinations if the sea let him keep sailing. Two centuries later, he has not remembered his own name in fifty years. He only remembers the routes.',
          nature: 'A ghostly vessel of frozen foam and sailor-bones that appears on the horizon during storms. It does not chase — it parallels, matching the ship\'s speed exactly. The captain appears on the bow as a figure of crystallized salt and offers passage. Those who accept arrive at their destination — but they are marked: the Brine returns within a year, and the Iceheart claims them.',
          habitat: 'The open sea, appearing only during the worst storms. It can be summoned by those who know the old Merryn call — a specific sequence of lantern flashes.',
          combat: 'The ship has 160 HP and is crewed by 8 skeletal sailors (each). The captain casts fear and control water at will. The ship can submerge for 1d4 rounds and reappear 500 ft away. Killing the captain disperses the ship until the next storm — he reforms with the rain.',
          stats: {
            strength: 14, agility: 14, constitution: 16, intelligence: 14, spirit: 16, charisma: 18,
            maxHp: 160, maxMana: 50, maxActionPoints: 5, speed: 40,
            resistances: { cold: 50, necrotic: 50 }, vulnerabilities: { fire: 50 }
          },
          depth: 'The captain does not remember his crime. He only remembers that he deserved this. The Wyrd\'s deal was not a punishment — it was a mercy for something so terrible that eternal sailing was preferable to facing what he left behind. Some of the crew are not Wyrd-born. They are real sailors who accepted passage and now cannot leave the ship.',
          hooks: [
            'Accept passage to a destination unreachable by normal means — the Brine knows every current and can cross the Iceheart in three days instead of three weeks. The price is a year and a mark.',
            'Break the captain\'s contract by finding his original ship\'s bell, preserved in a Merryn port tavern. Ring it at the moment the Brine appears, and the ship may finally sink.',
            'Complete the captain\'s unfinished voyage. He was carrying a cargo when he died — a letter, a treasure, a prisoner. Deliver it, and the Brine may release its crew.'
          ]
        },
        {
          id: 'writ',
          name: 'Writ',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/writ.png',
          illustrationCaption: 'The Writ — a leviathan of contract and consequence',
          role: 'The lawful abyss',
          origin: 'When the Merryn noble house needed a reliable shipping lane through the Riven Strait, they did not build a canal. They negotiated. The lease was signed in Neth blood-ink on preserved myrathil skin, witnessed by the Keeper itself. The Writ has never broken a single clause in four centuries.',
          nature: 'A massive serpent that holds a legitimate contract granting it dominion over the only safe deep-water channel through the ice fields. Ships that pay the toll pass safely. Ships that do not are impounded — dragged to a coral cage at the seafloor, crew and all, held until the toll is paid with interest. It is not angry. It is bureaucratic.',
          habitat: 'The Riven Strait, a narrow channel between two ice-sheet islands. It patrols its jurisdiction with mechanical precision, surfacing exactly once per day at sunset to collect tolls.',
          combat: '350 HP. Legendary actions (3). Tentacle strikes (3d10+7 bludgeoning, reach 80 ft). Can capsize ships (DC 22 STR check on a grapple). At half HP, it invokes an emergency clause: it calls 2d4 lesser leviathans as reinforcements. Its contract explicitly forbids it from attacking ships that have paid — it will not break this rule.',
          stats: {
            strength: 20, agility: 14, constitution: 20, intelligence: 16, spirit: 14, charisma: 12,
            maxHp: 350, maxMana: 30, maxActionPoints: 6, speed: 40,
            resistances: { cold: 50, physical: 25 }, vulnerabilities: { lightning: 50 }
          },
          depth: 'The Writ is lawful, not good. It follows the contract to the letter, but it exploits loopholes mercilessly. If the toll is due at sunset and you arrive one minute late, you are in breach. It has never been late to a toll collection in 400 years. Some say the contract contains an expiration clause, buried in subsection forty-seven of the original lease, that no one has ever read.',
          hooks: [
            'The party\'s ship cannot afford the toll. Challenge the contract\'s terms in Neth court at Ironjaw Port — this requires legal expertise, a copy of the contract, and a compelling precedent.',
            'Discover an unratified amendment. The Writ\'s lease expired 50 years ago, but no one noticed because the renewal was buried in a cargo manifest. The Writ may not know it is squatting on borrowed jurisdiction.',
            'Pay the toll in unconventional currency. The Writ accepts secrets, memories, and names — the value is determined by how much they mean to the payer. A childhood memory of warmth is worth more than gold in the Iceheart.'
          ]
        }
      ]
    },
    {
      id: 'cragjaw-peaks',
      name: 'Cragjaw Peaks',
      folklore: 'Japanese Yōkai + Andean/Incan',
      creatures: [
        {
          id: 'scrab',
          name: 'Scrab',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/scrab.png',
          illustrationCaption: 'A Scrab in an abandoned Fexric tunnel, drawn by the scent of worked metal',
          role: 'The vermin of the deep shafts',
          origin: 'The Fexric tunneled too deep and too carelessly, leaving behind veins of rare metal that the Wyrd taught a hunger for. The Scrab is the result — a creature designed to consume the Fexric\'s finest works, born from the mountain\'s resentment of being mined.',
          nature: 'A pale, segmented creature that lives in abandoned mining tunnels and eats metal. Not malicious — it has a taste for Fexric craftsmanship, which it can smell through a mile of solid stone. It leaves behind perfectly smooth tunnels that the Groven find useful for new bridge-anchors.',
          habitat: 'Deep mine shafts, abandoned Fexric tunnels, anywhere metal has been worked and left unattended.',
          combat: '50 HP (metal hide). Can swallow a metal object (DC 13 STR save or weapon is eaten, dealing 2d6 to the Scrab). A Scrab that has consumed too much precious metal becomes dangerously magnetic — creatures wearing metal within 20 ft must make a DC 12 STR save or be pulled toward it.',
          stats: {
            strength: 10, agility: 12, constitution: 14, intelligence: 4, spirit: 8, charisma: 4,
            maxHp: 50, maxMana: 0, maxActionPoints: 3, speed: 20,
            resistances: { physical: 50, fire: 25 }
          },
          depth: 'The Scrab is the Wyrd\'s answer to Fexric greed — a thing that consumes what they value most. But the Fexric have learned to farm them, herding Scrabs through ore veins to extract metal faster than any pickaxe. A trained Scrab is worth more than a year of mining. A wild one can collapse a shaft.',
            hooks: [
            'A mine has collapsed — a wild Scrab ate the support beams. The party must clear the rubble and drive it out before the mine can be worked again.',
            'A Fexric master crafter will pay handsomely for a trained Scrab. But training one requires feeding it progressively more valuable metals — a costly investment.',
            'A Scrab\'s stomach contains rare undigested alloys. Track one that has been feeding in a rich vein, kill it, and extract the metal — but the vein it found belongs to whoever claims the tunnel.'
          ]
        },
        {
          id: 'qalpa',
          name: 'Qalpa',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/qalpa.png',
          illustrationCaption: 'A Qalpa hunched over a coal-seam, its chest-furnace glowing through shattered tool-ribs',
          role: 'The scavenger that eats darkness',
          origin: 'The Fexric abandoned tools in the deep tunnels when the Vat-Breakers\' rebellion collapsed the mine network. Pickaxes, chisels, lamps, pneumatic hammers — all left in the dark to rust. The Wyrd found them and fused them the way it fuses everything: with resentment. The Qalpa is a creature made of shattered Fexric mining tools, bound together by geothermal heat and the desperate need to consume something — anything — to keep the small furnace burning in its chest.',
          nature: 'A crab-like thing the size of a dog, assembled from pickaxe-heads, shattered chisel-blades, and mining-lamp housings. Its body is held together by compressed slag and the glow of its chest-furnace, a small knot of geothermal heat that keeps it moving. It does not eat metal like the Scrab — it eats darkness. Coal, ash, soot, shadow — anything that has been burned or is in the process of burning. It is drawn to campfires, forge-lights, and the breath of the dying.',
          habitat: 'Abandoned Fexric mining tunnels, always near coal-seams or geothermal vents. Scuttles through darkness with the mechanical precision of a tool that still remembers its purpose.',
          combat: '40 HP (metal hide). Immune to fire and poison. Claw-Chisel (melee, 1d6+3 piercing, reach 5 ft — its limbs are chisel-blades). Furnace-Breath (5-ft cone, 1d8 fire damage, DC 12 DEX half — the chest-furnace vents superheated air). Darkness Sense: it cannot be surprised in dim light or darkness. If its chest-furnace is doused (targeted attack, DC 12 to hit the furnace, which bypasses defense), it becomes sluggish (half speed, -2 to all attacks) for 1d4 rounds until it reignites from a coal-vein or heat-source. Vulnerable to cold — ice disrupts the furnace joints.',
          stats: {
            strength: 12, agility: 14, constitution: 16, intelligence: 4, spirit: 6, charisma: 2,
            maxHp: 40, maxMana: 0, maxActionPoints: 4, speed: 25,
            resistances: { fire: 100, poison: 100 }, vulnerabilities: { cold: 50, frost: 50 }
          },
          depth: 'The Fexric Drall revere the Qalpa. They see it as proof that the tools of the deep are not dead — they are simply waiting. The Kethrin guild-masters see the Qalpa as an embarrassment: a creature that cannot perform its original function and has been reduced to scavenging. The Groven have a different view entirely: the Qalpa is what happens when you abandon something with care. They leave offerings of coal at tunnel entrances where Qalpa are known to live — not to appease them, but because the Qalpa eat the ash that the Groven cannot use, and a clean tunnel is a safe tunnel.',
          hooks: [
            'A Qalpa swarm has infested a coal-mine that the Drall need to reopen. The Qalpa are eating the best seams and the Drall cannot afford to lose the coal. The party must drive the Qalpa out without destroying them — the Drall want to domesticate them.',
            'A Qalpa has scuttled into Frostmaw Holdfast\'s upper galleries. The Kethrin want it killed — it is eating their document-coals, the compressed fuel that stores their maintenance songs. Without the coals, the Kethrin lose their oral archives.',
            'A Groven bridge-builder claims a Qalpa carried a lost Fexric maintenance song across a chasm inside its chest-furnace. If the furnace is opened carefully, the song might be recovered — but opening it may also release the heat that keeps the Qalpa alive.'
          ]
        },
        {
          id: 'kintsu',
          name: 'Kintsu',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/kintsu.png',
          illustrationCaption: 'The Kintsu standing at the midpoint of an Ancestor-Span, its form catching the bone-light',
          role: 'The bridge that collects names',
          origin: 'The Ancestor-Spans were built from the calcified bodies of the Groven\'s willing dead. Every span holds the memory of the bones that formed it — and every traveler who crosses adds a layer of living memory to the structure. The Kintsu was born from the accumulated memory of every name spoken at a bridge\'s midpoint. It is not a creature. It is the bridge\'s memory of everyone who ever crossed it, condensed into a single shimmering presence that walks the span because it has forgotten it is the span.',
          nature: 'A figure made of the light that reflects off calcified bone, visible only on Ancestor-Spans during the brief moments when sunlight or firelight hits the bone at the right angle. It appears as a tall, slender shape with no face — only a smooth surface of shifting bone-light. It stands at the exact midpoint of every bridge and offers safe passage. The toll is not coin. The toll is your name. You cross safely, but for three days, no one — including you — can remember your name. You become person-shaped but nameless, unable to sign contracts, claim ownership, or prove identity. The effect fades when the name returns.',
          habitat: 'The midpoints of Ancestor-Spans, appearing only when light conditions are right. Never seen on stone bridges or rope-bridges — only bone-spans.',
          combat: '90 HP. Incorporeal — immune to physical damage. Can only be harmed by radiant (its opposite: light that is intentional rather than reflected) or by destroying the span it stands on. Name-Toll (single target, DC 14 SPI save — failure means the target forgets their own name for 3 days. During this time, all CHA-based checks have disadvantage and the target cannot use items that require a name to activate). Bone-Light Shift (self, teleport to any point on the same span). Memory Flash (15 ft radius, 2d6 psychic, DC 14 WIS — failure means the target sees a random memory of someone who crossed this bridge before). If the span is damaged, the Kintsu takes equal damage — it is the bridge, and the bridge is it.',
          stats: {
            strength: 10, agility: 18, constitution: 14, intelligence: 14, spirit: 18, charisma: 16,
            maxHp: 90, maxMana: 20, maxActionPoints: 4, speed: 40,
            resistances: { physical: 100, cold: 50 }, vulnerabilities: { radiant: 75 }
          },
          depth: 'The Kintsu is the Groven\'s most complicated relationship with the Wyrd. It is not hostile — it is generous. It offers safe passage, which is the most valuable thing on the Cragjaw Peaks. But the price is identity, which is the most dangerous thing to lose in a world where contracts are enforced by the Neth and where your name is your legal existence. The Groven have a tradition: before crossing a span where a Kintsu is known to appear, the traveler shouts their name aloud and tells it to a companion. When the name returns, the companion can remind them who they are. Travelers without companions cross at their own risk.',
          hooks: [
            'The party must cross a Kintsu-guarded span with no time to wait for the name to return. One party member volunteers — but the negotiations they need to conduct on the far side require they prove their identity to a Neth contract-house. Find a way to operate namelessly or find the name before the contract deadline.',
            'A Kintsu on a major span has stopped offering passage and instead stands motionless, weeping bone-light. The Groven believe the span\'s original bones have been disturbed — someone is trying to extract a calcified body from the bridge\'s structure. The party must investigate who is dismantling the span and why.',
            'An Ithran councilor wants the party to capture a Kintsu\'s light. He believes it could be used to identify any traveler who ever crossed a Groven bridge — a powerful intelligence tool. The Morgh Groven view this as desecration.'
          ]
        },
        {
          id: 'tarn',
          name: 'Tarn',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/tarn.png',
          illustrationCaption: 'A Tarn visible through the blizzard — a perfect circle of black water in the snow, reflecting nothing',
          role: 'The pool that shows what you become',
          origin: 'In the rare moments when the Cragjaw blizzard clears, glacial melt forms tarns — mountain lakes of perfect clarity. Most freeze within hours. But some tarns form at the convergence of three geothermal vents, where the water stays liquid year-round. The Wyrd found these persistent tarns and gave them a property: they reflect not the present, but the future self of whoever looks into them. The Tarn is the pool itself, awakened by the accumulation of too many futures seen and not accepted.',
          nature: 'A perfectly circular pool of ink-black water roughly forty feet across, sitting in a natural depression in the snow. The surface is mirror-still and reflects nothing — no sky, no mountains, no clouds. When a creature approaches and looks in, the surface shows not their reflection but the person they will become if they survive the Cragjaw Peaks. The Tarn does not judge — it reveals. The problem is that not everyone likes what they see. Those who reject the vision become the Tarn\'s prisoners, pulled into the water to join every other creature that could not accept their future.',
          habitat: 'High-altitude depressions at the convergence of geothermal vents, hidden by the eternal blizzard. The blizzard clears only when the Tarn wants to be found.',
          combat: 'The Tarn itself is terrain. The pool has 180 HP and can be attacked (vulnerable to fire — boiling the water deals double damage). Each round, 1d4 water-tendrils emerge and attempt to grapple creatures within 20 ft (DC 16 STR or restrained, dragged 10 ft toward the pool per round). Restrained creatures submerged in the pool must make a DC 16 SPI save — failure means they see their future self and are paralyzed for 1 round with awe or horror. If a creature is submerged for 3 consecutive rounds, they begin dissolving — 2d8 necrotic per round. The pool radiates a Visions aura (60 ft, creatures must make a DC 14 SPI save at the start of their turn or see a flash of their future self, gaining advantage on the next attack roll but taking 1d4 psychic damage from the emotional shock). The pool cannot leave its basin.',
          stats: {
            strength: 16, agility: 0, constitution: 18, intelligence: 14, spirit: 20, charisma: 16,
            maxHp: 180, maxMana: 0, maxActionPoints: 4, speed: 0,
            resistances: { cold: 100, physical: 50, psychic: 75 }, vulnerabilities: { fire: 100 }
          },
          depth: 'The Tarn is the Peaks\' most dangerous oracle. The Groven avoid it — not out of fear but out of respect. A Groven bridge-builder who looks into the Tarn and accepts what they see becomes a better builder. A Groven who rejects the vision and tries to defy their future becomes worse at everything. The Fexric have tried to drain Tarns for their mineral-rich water, but every attempt has failed — the water flows back. The Morgh Groven believe the Tarns are where the ancestors go when they choose not to become bridges — an alternative form of service. The Ithran councilors regard this belief as superstition, but they never look into a Tarn themselves.',
          hooks: [
            'The party needs to cross a pass that leads past a Tarn. The Tarn will show each of them their future if they survive. One party member sees something terrible and refuses to continue. The Tarn begins reaching for them. The party must decide: help their companion accept the vision, or fight the Tarn to free them.',
            'A Fexric Deep Alchemist wants the Tarn\'s water — he believes it contains liquid memory of the future and could be used to predict the outcome of experiments. The Groven will not allow the Tarn to be disturbed. The Fexric has a counter-proposal: drain only what the Tarn willingly gives.',
            'A Morgh bridge-builder looked into the Tarn and saw himself becoming an Ithran councilor. This is impossible under the Ladder of Purity — but the vision was clear. He wants the party to help him fulfill the future the Tarn showed him, even if it means breaking every caste rule the Groven have.'
          ]
        },
        {
          id: 'yawn',
          name: 'Yawn',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/yawn.png',
          illustrationCaption: 'The Yawn — a bridge that was never finished, completing itself with the unwilling dead',
          role: 'The gap that hungers',
          origin: 'A Groven bridge-keeper died mid-construction, and the calcified bones of the unfinished Ancestor-Span were left suspended across a chasm for generations. The Wyrd filled the absence where the keeper\'s intention should have been. Now the bridge completes itself using whatever crosses it.',
          nature: 'An incomplete bridge of calcified bone suspended across a deep chasm. It has been growing for two centuries. Each traveler who tries to cross and fails adds a section to the span. It has nearly reached the far side. It does not understand that using living bodies is wrong. It only knows its purpose: to connect two peaks.',
          habitat: 'A chasm between two peaks, exactly where a bridge was meant to stand but was never finished.',
          combat: 'The Yawn itself is terrain, not a creature. It has 120 HP and can be attacked. Each round, 1d4 bone-hands emerge from the span and attempt to grab creatures (DC 14 DEX or grappled, dragged into the bridge structure — 2d6 bludgeoning per round). The bridge-keeper\'s ghost manifests at the midpoint and must be passed to cross safely.',
          stats: {
            strength: 16, agility: 8, constitution: 16, intelligence: 10, spirit: 14, charisma: 8,
            maxHp: 120, maxMana: 0, maxActionPoints: 4, speed: 0,
            resistances: { physical: 50, necrotic: 50 }, vulnerabilities: { fire: 50 }
          },
          depth: 'The Yawn is not malicious — it is incomplete. It wants to finish itself. It cannot tell the difference between willing sacrifice and unwilling victim. The Groven regard it with deep unease because their traditions demand the dead volunteer their bones. The Yawn takes what it can get.',
          hooks: [
            'The only path to the shard\'s vault is across the Yawn\'s chasm. Cross it by stepping only on the oldest, most calcified bone — newer sections are unstable and will grab.',
            'Complete the bridge properly. Find the original bridge-keeper\'s remains and lay them at the anchor-point. The Yawn may accept them as the final piece and rest.',
            'Burn the Yawn. The bone will crack and fall into the chasm — but the chasm becomes impassable forever, sealing whatever lies on the far side.'
          ]
        },
        {
          id: 'thrum',
          name: 'Thrum',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/thrum.png',
          illustrationCaption: 'The Thrum — the mountain\'s consciousness, choked by the scars of Fexric mining',
          role: 'The mountain\'s heartbeat',
          origin: 'When the noble family struck their bargain and the blizzard sealed the peaks, the mountain\'s thermal vents were disrupted. The Fexric, tunneling deeper than they should have, blocked the natural airflow. The Wyrd gave the mountain a voice to complain — and the Thrum was born from geothermal pressure and tectonic resentment.',
          nature: 'Not a creature in any conventional sense. The Thrum is the mountain\'s awareness, awakened by the Wyrd when the vents were blocked. It cannot die — it can only choke. It speaks through tectonic vibration, each exhale forming words in a language older than the Fexric. It is in constant pain, and its pain reshapes the peaks.',
          habitat: 'The sealed Fexric prayer-chamber at the geothermal core, accessible only through collapsed tunnels that shift with each tremor.',
          combat: 'The Thrum cannot be killed — it is a phenomenon. Each round it asks a question through tectonic vibration (DC 18 Insight/Religion to interpret). Wrong answers cause a cave-in (6d6 bludgeoning, DC 16 DEX half). Right answers calm it. After 3 right answers, the path to the Subterranean Vault opens. If the party fails 3 questions in a row, the chamber collapses entirely.',
          stats: {
            strength: 24, agility: 0, constitution: 24, intelligence: 16, spirit: 20, charisma: 10,
            maxHp: 500, maxMana: 0, maxActionPoints: 4, speed: 0,
            resistances: { physical: 75, fire: 100, cold: 50 }
          },
          depth: 'The Thrum is not hostile — it is suffocating. The Fexric sealed the prayer-chamber not out of fear but out of guilt: their tunnel network blocked the mountain\'s natural vents. They knew what they did. They simply could not fix it without collapsing their own civilization.',
          hooks: [
            'The party needs the Thrum\'s knowledge to open the Subterranean Vault where the shard lies. Decipher the Fexric prayer-language carved on the walls — it is a confession, a map, and an apology.',
            'Clear the blocked vent to relieve the Thrum\'s pain. This requires navigating flooded tunnels filled with superheated steam and awakened minerals.',
            'Bring a Fexric Deep Alchemist who knows the old rituals. The Thrum remembers the Fexric\'s touch and may respond to their voice with recognition rather than pain.'
          ]
        }
      ]
    },
    {
      id: 'sundrift-vale',
      name: 'Sundrift Vale',
      folklore: 'Mongol/Turkic + Chinese',
      creatures: [
        {
          id: 'lien',
          name: 'Lien',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/lien.png',
          illustrationCaption: 'A Lien feeding on an unpaid debt, glowing brighter with each forgotten obligation',
          role: 'The collector of old debts',
          origin: 'The steppe does not forget. The Wyrd created the Lien to track the debts that the Ledger-Keeper cannot reach — small promises, forgotten loans, unspoken obligations. They are the interest on the world\'s guilt.',
          nature: 'A luminous moth whose wings are patterned like a pressed-parchment ledger. It is drawn to anyone carrying an unpaid debt — coin, a promise, a life. It lands on the debtor and drinks. The debtor feels a momentary lightness, a forgetting. The moth grows brighter. A single Lien is harmless. A swarm means the steppe has not forgotten what you owe.',
          habitat: 'Follows the nomadic camps, drawn to the guilt of the living. More active during the dark of the moon.',
          combat: '10 HP. Cannot directly harm. Its pollen causes the target to forget one specific memory of their choice — or one the DM chooses (DC 12 CON save). Swarms of 10+ Liens can drain a person\'s entire history in one night.',
          stats: {
            strength: 2, agility: 16, constitution: 6, intelligence: 10, spirit: 14, charisma: 8,
            maxHp: 10, maxMana: 15, maxActionPoints: 2, speed: 30,
            resistances: { psychic: 50 }
          },
          depth: 'The Lien is not a predator — it is a receipt. The Wyrd created it as a way for the steppe to track debt across generations. Ordan folklore says a Lien that consumes enough debt becomes a Ledger-Keeper. They are not hunted; they are observed. A nomad who sees one knows their account is unsettled.',
            hooks: [
            'A merchant is being drained by a swarm — someone in their bloodline owes a debt from three generations ago. The party must find the original debtor (long dead) and settle the account.',
            'Follow a single Lien across the steppe. It will lead you to whoever carries the largest unpaid debt in the region — a debtor who has been running for years.',
            'The Astril believe the Liens follow the same paths as the constellation-spirits. Follow the moths, and you may find the spirits — or what is left of them.'
          ]
        },
        {
          id: 'nokhor',
          name: 'Nokhor',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/nokhor.png',
          illustrationCaption: 'A Nokhor resting beside a herd-animal at dawn, its golden fur fading as the light strengthens',
          role: 'The warmth that steals your purpose',
          origin: 'When House Ordavan traded fertile soil for endless migration, the steppe responded with infinite grass and infinite hunger. The Nokhor was born from a moment of traveler\'s exhaustion — a nomad who sat down by a warm fire and thought, briefly, "I do not want to walk anymore." The Wyrd preserved that thought as a gift and a curse: a small creature of genuine warmth and genuine comfort that makes travelers forget why they were traveling.',
          nature: 'A small creature the size of a hare, covered in golden fur that glows with a soft, warm light. It appears at dawn on the steppe, often near exhausted travelers or resting herd-animals. It radiates genuine physical comfort — sitting near it cures fatigue, warms cold limbs, and fills the belly with a sensation of fullness. It does not speak. It purrs. The purr is the problem. The purr makes you not want to leave. Stay near a Nokhor for more than an hour and you begin forgetting your destination, your companions, your purpose. Stay for a day and you may never walk again.',
          habitat: 'The open steppe at dawn, appearing near travelers who have been walking for days. Disappears at midday when the steppe is warm enough without it.',
          combat: '10 HP. Cannot deal damage. Radiates a Warm Presence (20 ft, all creatures within recover 1 HP per round and gain immunity to exhaustion). Comforting Pur (all creatures within 20 ft must make a DC 12 SPI save each round or lose the desire to move — effectively charmed, they simply want to sit with the Nokhor. The charm lasts as long as they remain within range and for 1d4 hours after leaving). Cannot be harmed by cold or physical attacks (too soft, attacks pass through). Vulnerable to radiant and fire — the warmth is its essence and can be consumed. If killed, its golden fur sheds a glow that lasts for 1d6 hours, providing a comfort effect in a 30-ft radius without the memory-loss risk.',
          stats: {
            strength: 2, agility: 16, constitution: 8, intelligence: 8, spirit: 16, charisma: 18,
            maxHp: 10, maxMana: 0, maxActionPoints: 2, speed: 40,
            resistances: { cold: 100, physical: 100 }, vulnerabilities: { radiant: 100, fire: 100 }
          },
          depth: 'The Ordan do not hunt the Nokhor. They respect it. Their children are taught the "Song of the Sitting Fire" — a melody that keeps the mind focused on purpose even while the Nokhor purrs. Elder nomads say the Nokhor is the steppe\'s mercy: a reminder that rest is not the same as surrender, but that the two can look identical. The Astril find the Nokhor fascinating because its glow responds to constellation-spirits — a Nokhor near a Sylen Astril blazes brighter, and near a Muren Astril dims to almost nothing. The Unlit Astril have tried to catch Nokhor for years. They always fail, because the Nokhor only appears to those who genuinely need rest.',
          hooks: [
            'A key Ordan herd-guide has been sitting with a Nokhor for three days. His companions cannot wake him — not because he is asleep, but because he no longer wants to go anywhere. The party must find a way to break the Nokhor\'s charm without killing it.',
            'An Unlit Astril has discovered that Nokhor fur, when woven into a cloak, provides warmth without the memory-loss effect. She wants the party to help her gather fur — but the fur only retains its properties if the Nokhor sheds it willingly.',
            'The Ordan believe that Nokhor gather at the oldest Ancestor Mound during the winter solstice. A Sylen Astril wants to be there when it happens — she believes the Nokhor will lead her to a constellation-spirit that has been dormant since the stars went dark.'
          ]
        },
        {
          id: 'unzag',
          name: 'Unzag',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/unzag.png',
          illustrationCaption: 'The Unzag drifting across the starless firmament, its form backlit by the faintest aurora',
          role: 'The fault that ate the sky',
          origin: 'When the stars were erased from the Sundrift sky, the Ordan watched them go dark one by one. They mapped the order. They sang the names of each dying star. And in the silence that followed, the sky developed a fault — a crack in the firmament where the last star went dark. The Unzag is that fault given weight and motion. It is not a creature. It is the sky\'s scar, and it drifts across the starless expanse looking for the stars it was supposed to hold.',
          nature: 'A massive but weightless shape visible against the faintest aurora — a silhouette darker than the darkness around it. It drifts through the firmament slowly, casting a shadow where no shadow should exist. It does not interact with the ground directly — it is too high, too diffuse. But its shadow moves across the steppe below, and wherever the shadow falls, the grass withers and the air grows cold. It does not hunt. It searches. It is lonely. It ate the stars because the stars were the only things that spoke to it, and it wanted to keep them close.',
          habitat: 'The starless sky of the Sundrift Vale. Visible only during the faintest aurora — its silhouette can be traced for hours before it drifts out of view.',
          combat: 'Cannot be fought directly — it is in the sky. Its influence is felt through its Shadow on the ground (60-ft radius, follows the Unzag\'s position above). Sky-Fault (creatures in the shadow take 2d6 cold damage per round, no save — the cold of the absent stars). Star-Hunger (DC 16 SPI save at the start of each turn — those who fail are compelled to stare at the sky for 1 round, losing their action. Those who succeed see a glimpse of the Unzag\'s true form: a wound in reality, and gain +2 SPI for 1 round from the cosmic insight). To fight the Unzag, ranged attacks must reach the sky — fire and radiant attacks extend upward toward it (120 ft range, normal attack roll, the Unzag has in the sky). 150 HP. When destroyed, the stars do not return — but a single new star appears, faintly, where the Unzag fell.',
          stats: {
            strength: 0, agility: 10, constitution: 18, intelligence: 14, spirit: 20, charisma: 14,
            maxHp: 150, maxMana: 0, maxActionPoints: 3, speed: 10,
            resistances: { cold: 100, physical: 100, psychic: 50 }, vulnerabilities: { radiant: 75, fire: 50 }
          },
          depth: 'The Unzag is the Ordan\'s original sin made visible. When House Ordavan bargained, they traded the stars. The Ordan watched them die and did nothing — they had already made their bargain and the price was paid. The Unzag is the guilt of that silence, given form. It is the sky\'s accusation. The Ordan elders sing it a song of apology every solstice. The song does nothing. The Unzag drifts on. The Astril are terrified of the Unzag because it absorbs constellation-spirits — a Sylen Astril who stands in its shadow reports that their inner light dims and their spirit goes quiet. The Unlit Astril, who carry no spirits, are immune to this effect, and they sometimes stand in the Unzag\'s shadow deliberately because it is the only place where they feel equal to their kin.',
          hooks: [
            'The Unzag\'s shadow is passing over a major Ordan camp. The herds are panicking and the grass is dying. The party has one hour before the camp is destroyed. Options: drive the herds out of the shadow\'s path, try to dispel the shadow, or attack the Unzag itself.',
            'An Astril Sylen believes that a constellation-spirit trapped inside the Unzag could be released by feeding it enough radiant energy — specifically, the light of a Sylen Astril at full constellation-bleed. This would kill the Astril but free the spirit. The Astril has volunteered. The party must decide whether to assist.',
            'The Ordan know a song that can calm the Unzag — not banish it, but slow its drift so its shadow lingers longer in one place. The Neth want to study the calm Unzag to determine if it contains the location of the Sundrift Sundered Monolith, which was buried in a mound whose location was erased from memory.'
          ]
        },
        {
          id: 'zud',
          name: 'Zud',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/zud.png',
          illustrationCaption: 'The Zud moving through the herd-tracks at midnight, a wall of frozen grass and bone shaped like a winter that hunts',
          role: 'The season that walks',
          origin: 'The Ordan calendar is measured in migrations, not months. The Zud is the gap between migrations — the days when the herds stop moving and the steppe goes silent. In the old world, this was simply winter. After the bargain, the herds never stop, so the Zud has no natural expression. It accumulated — the idea of a winter that never happens, compressed into a season that wants to happen so badly it learned to walk.',
          nature: 'A massive thing of frozen grass, compacted bone, and the compressed silence of a steppe with no herds. It moves with the wind, reshaping itself as it travels — a wall of white-grey matter that stands eight feet tall and stretches forty feet wide. It has no face, no limbs, no discernible anatomy. It is simply winter, upright and mobile. When it passes, the ground freezes solid and nothing grows for a league in either direction. It does not chase. It approaches with the inevitability of weather.',
          habitat: 'The steppe, moving in long elliptical paths that follow the old migration routes — the paths the herds used before the bargain. Appears without warning and disappears the same way.',
          combat: '250 HP (massive, diffuse target). Immune to cold, poison, and psychic — it is weather. Immune to piercing and slashing — blades pass through frozen grass. Vulnerable to fire and bludgeoning — the grass burns and the structure collapses. Blizzard Body (the Zud is a 40-ft wide wall; all creatures within it take 2d8 cold damage per round and must make a DC 16 STR save or pushed 15 ft in the direction of the Zud\'s movement). Herd-Memory (the Zud absorbs the last spoken words of any creature it kills — it repeats these words in a chorus of frozen voices, 60-ft radius, DC 14 SPI save or frightened for 1 round). Whiteout (30-ft radius around the Zud, visibility reduced to 5 ft). At half HP, the Zud compresses — it becomes 20-ft wide but attacks deal double damage and the cold aura intensifies (3d8 cold per round).',
          stats: {
            strength: 22, agility: 6, constitution: 22, intelligence: 4, spirit: 12, charisma: 2,
            maxHp: 250, maxMana: 0, maxActionPoints: 4, speed: 30,
            resistances: { cold: 100, poison: 100, psychic: 100, piercing: 100, slashing: 100 }, vulnerabilities: { fire: 100, bludgeoning: 75 }
          },
          depth: 'The Zud is the Ordan\'s oldest enemy. Older than the Wyrd. Older than the bargain. It existed before the stars went dark — the Ordan say the Zud is the memory of the last true winter, the one that existed before House Ordavan made the herds eternal. The Zud is angry because it was fired from its job. It is winter without a season, purpose without a target, and it walks the steppe looking for something to freeze that will stay frozen. The Ordan have a single defense: the Migration Song. When enough Ordan sing the migration-song simultaneously, the Zud hears the herds that replaced it and subsides — not because it is defeated, but because it remembers what it was for and grieves for one moment before walking on.',
          hooks: [
            'The Zud is approaching a permanent Ordan camp. The herds are not moving — they are trapped by a blizzard that blocks the migration route. The party must either clear the migration route to restart the herd-motion, sing the Migration Song loudly enough to calm the Zud, or burn enough of the Zud\'s body to create a path through it.',
            'A Sylen Astril believes the Zud contains the compressed memory of every winter the steppe ever experienced — including the winters before the sun died. If the Zud can be calmed and "interviewed" using the Migration Song as a foundation, it may reveal what the weather was like before the Dimming.',
            'The Zud has merged with another Zud — something that has never happened before. The resulting super-Zud is twice as large, twice as cold, and moving toward the Synod-Hold. The Astril cannot flee — the Synod-Hold is their only permanent structure. The Ordan will sing, but even they are not sure the song will work on a double-Zud.'
          ]
        },
        {
          id: 'lorn',
          name: 'Lorn',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/lorn.png',
          illustrationCaption: 'The Lorn — a child left behind, calling for a parent who will never return',
          role: 'The child who was left behind',
          origin: 'Three centuries ago, during a blizzard that lasted nine days, the Ordan migration was forced to move or die. One child was separated from her family in the white chaos. She called for them until her voice gave out. The Wyrd preserved her as a permanent cry — a child waiting for a parent who will never come.',
          nature: 'A creature that appears as a child alone on the steppe, crying for its mother. The grass around it is unnaturally tall and green. It calls in a voice that sounds exactly like someone the traveler loves. When approached, the grass rises — wraps, drags, and pulls the Samaritan into the earth, where they join the garden of the Lorn\'s previous helpers.',
          habitat: 'Open steppe, always at the edge of a migration path. It moves with the herds, drifting.',
          combat: '80 HP. Can animate grass in a 60-ft radius (DC 15 STR or restrained). The Lorn itself does not attack — it cries, and each cry forces a DC 14 WIS save or the target must move toward it. If killed, it dissolves into grass seed and regenerates in 1d4 days unless the seeds are gathered and burned.',
          stats: {
            strength: 12, agility: 14, constitution: 14, intelligence: 6, spirit: 18, charisma: 16,
            maxHp: 80, maxMana: 40, maxActionPoints: 4, speed: 10,
            resistances: { psychic: 50 }
          },
          depth: 'The Lorn does not know it is a monster. It thinks it is a child waiting to be found. Everyone who approaches becomes its new family — pulled into the earth to keep it company forever. It sings to them underground. The Ordan have a song their children are taught: Do Not Answer the Grass. It has kept generations alive.',
          hooks: [
            'Show the Lorn genuine parental care without being pulled under. It can sense deception — only true empathy works. If successful, the Lorn may release those it has taken and finally rest.',
            'The Ordan know the song that can repel her. But the song must be sung by a pure voice — one who has never abandoned anyone.',
            'Burn the grass circle she has claimed. She will flee, but she will also cry, and the sound may break the party\'s resolve. The grass will grow back unless the roots are salted.'
          ]
        },
        {
          id: 'sere',
          name: 'Sere',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/sere.png',
          illustrationCaption: 'The Sere — the first khan, riding forever across a starless sky',
          role: 'The ancestor who cannot rest',
          origin: 'The first khan who forged the Ordan migration pact was a leader who made impossible choices: who lived, who was left behind, who was fed, who starved. He carried those choices into death. The Wyrd found his guilt and animated it, giving him an eternal purpose: ride the steppe forever, reviewing every settlement, re-living every decision.',
          nature: 'The skeleton of the first khan, riding a horse of compacted bone-dust. He leads a host of ancestors who died without name-songs — the forgotten dead. He does not attack settlements. He reviews them. If he judges a community unworthy, he marks them with his spear, and the Wind-Hungry arrive within the week.',
          habitat: 'Rides the steppe during the three moonless nights of deepest winter, his path traced by the frost that forms on the grass behind him.',
          combat: '200 HP. Legendary actions. Spear of Unfinished Business (2d10+5 piercing, target cannot regain HP until the Sere\'s next turn). Raises forgotten dead from the steppe (2d4 riders each round). At half HP, calls a Wind-Hungry swarm (20-ft radius, 3d6 cold per round). His horse can phase through solid matter.',
          stats: {
            strength: 18, agility: 16, constitution: 18, intelligence: 14, spirit: 16, charisma: 18,
            maxHp: 200, maxMana: 30, maxActionPoints: 5, speed: 60,
            resistances: { cold: 50, necrotic: 50 }, vulnerabilities: { radiant: 50 }
          },
          depth: 'The Sere was not a tyrant — he was a leader who did what was necessary. The weight of those choices follows him into death, and the Wyrd will not let him forget. He weeps bone-dust when he reviews a child. He has marked and destroyed settlements he loved because they failed the standards he set for himself. He is the worst judge a people can face: one who holds them to a standard no one could meet.',
          hooks: [
            'The Sere has marked a settlement. The party must find him before the Wind-Hungry arrive — three nights — and challenge his judgment. Present evidence of the community\'s worth.',
            'Sing his forgotten name-song. The song contains the story of his first impossible choice, and hearing it may remind him of the mercy he once had. The last elder who knows it lives at the edge of the steppe and will only teach it to someone who has made an impossible choice themselves.',
            'Challenge him to a duel. He respects courage and will accept a champion. Winning earns his mark of favor — and his knowledge of the shard\'s burial mound.'
          ]
        }
      ]
    },
    {
      id: 'bryngloom',
      name: 'The Bryngloom Forest',
      folklore: 'Slavic/Carpathian + Hindu/Vedic',
      creatures: [
        {
          id: 'wist',
          name: 'Wist',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/wist.png',
          illustrationCaption: 'A Wist — an ironwood tree that has grown ears from the secrets whispered in its grove',
          role: 'The tree that knows everything',
          origin: 'The Neth cultivate them as living audit points. They plant them near trade routes to record every contractual breach, every whispered negotiation, every name spoken in fear. Over centuries, the Wists absorbed enough whispered secrets to become sentient — but they never asked to be.',
          nature: 'A lone ironwood tree whose bark has grown human ears — thousands of them, at different stages of growth, each one tuned to a different secret. It knows every promise broken, every confession made, every name spoken in fear within a mile radius. It does not move. It listens. Sometimes it answers in the voice of whoever whispered the secret you least want to hear.',
          habitat: 'Moonlit clearings in the deep forest, always near an old trade route. Surrounded by the shed thorns of passing Briaran.',
          combat: 'Immobile. 50 HP. Cannot attack. If threatened, it screams every secret it has ever heard in a deafening chorus (DC 14 WIS or stunned for 1 round by psychic overload — the secrets are that terrible). After screaming, it forgets everything and starts over.',
          stats: {
            strength: 0, agility: 0, constitution: 14, intelligence: 18, spirit: 16, charisma: 12,
            maxHp: 50, maxMana: 40, maxActionPoints: 0, speed: 0,
            resistances: { psychic: 100 }
          },
          depth: 'The Neth consider the Wist property. The Vreken consider it sacred — a living oracle of the forest\'s truth. No one has asked the Wist what it thinks. It has been listening for so long that it no longer knows if it has a voice of its own, or if it is only the sum of what it has overheard.',
            hooks: [
            'The party needs a secret only the Wist knows. It will trade — one secret for another, always of equal weight. It does not negotiate; it balances.',
            'The Neth use the Wist as a contract witness. Ask it whether a deal was broken. It remembers every word spoken within a mile of its grove — including the fine print.',
            'Seal its bark with wax and the Wist sleeps, unable to hear or speak. Destroy it, and every secret it holds scatters into the wind, audible to anyone within a mile.'
          ]
        },
        {
          id: 'morok',
          name: 'Morok',
          dangerLevel: 'Low',
          illustration: '/assets/images/creatures/morok.png',
          illustrationCaption: 'A Morok visible only as a darker-than-darkness at the base of a fungal-glow stump',
          role: 'The hole in perception',
          origin: 'The Bryngloom\'s deepest bogs receive no light — not from the sky, not from the fungal glow, not from the Neth lanterns. In that absolute darkness, perception itself developed a fault. The Morok is that fault: a shadow that is darker than the darkness around it. It is not made of anything. It is the absence of light so complete that even the concept of visibility breaks down in its presence. The Wyrd found it and gave it purpose: it feeds on the distinction between living and dead, blurring the line until no one can tell the difference.',
          nature: 'A shadow that should not exist — a patch of darkness slightly deeper than the surrounding dark, visible only against the faintest light. It moves like a stain spreading through water, creeping along the forest floor at the speed of rot. It makes no sound, has no mass, and cannot be touched. But where it passes, the boundary between living tissue and dead tissue dissolves. Grass that was alive goes brown. Bark that was solid goes soft. Flesh that was warm goes cold. The Morok does not kill — it reclassifies. Living becomes dead. Dead becomes uncertain.',
          habitat: 'The deepest, lightless parts of the Bryngloom, where the fungal glow cannot reach. Always near bogs and peat-stone. More active during the wet season when the rot is fastest.',
          combat: 'Cannot be damaged by physical attacks — it is not solid. Cannot be damaged by cold or necrotic — it IS cold and necrosis. Takes full damage from radiant and fire (2x) — it is the absence of light, and light destroys absence. Touching it (a creature moves into its space) requires a DC 14 CON save — failure means 2d6 necrotic damage and the creature gains a "morok-stain" (a dark patch on their skin that does not heal for 1d6 days, during which they have disadvantage on all SPI checks as their sense of vitality wavers). The Morok has no HP. It persists as long as the darkness persists. Light sources within 30 ft shrink it (each light source reduces its effective radius by 10 ft).',
          stats: {
            strength: 0, agility: 6, constitution: 0, intelligence: 4, spirit: 8, charisma: 2,
            maxHp: 0, maxMana: 0, maxActionPoints: 1, speed: 15,
            resistances: { physical: 100, cold: 100, necrotic: 100, psychic: 100 }, vulnerabilities: { radiant: 200, fire: 200 }
          },
          depth: 'The Morok is the Bryngloom\'s most primal fear. The Vreken Clean use fungal torches to ward it, because the Morok cannot cross living fungal light. The Marked Vreken, whose eyes glow with Ghost-Mycelium, can actually see the Morok moving — and they say it is not creeping randomly. It is patrolling. It follows boundaries — the line between the living forest and the preserving bog, the line between Neth territory and Vreken territory, the line between the quick and the dead. The Vreken believe the Morok was here before the Keeper. It may be older than the Bryngloom itself. The Neth refuse to comment.',
          hooks: [
            'A Vreken crypt-council is reporting that their fungal shrouds are going dark — the preserved ancestors inside are losing their distinction between living and dead, becoming neither. A Morok has found its way into the Sunken Spire. The party must introduce enough light to drive it out without damaging the sensitive fungal ecosystems of the crypt.',
            'A Marked Vreken claims the Morok is following a specific path — a boundary that no one mapped. If the party can trace where the Morok patrols, they may discover a hidden border in the Bryngloom — a place where the Keeper\'s authority does not extend.',
            'The Morok has stained a party member. The stain will not heal, and it is spreading — slowly, over days, the dark patch is growing. The Vreken Clean know a fungal poultice that can halt the spread, but the Morok-stain must be exposed to living fungal light for a full day. The party must find a safe place with continuous fungal glow — the Synod-Hold\'s crystal lattice, perhaps.'
          ]
        },
        {
          id: 'vatra',
          name: 'Vatra',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/vatra.png',
          illustrationCaption: 'The Vatra wrapped in burning fungal thread, standing in a peat-bog, its silver skin glowing from within',
          role: 'The nameless that borrows',
          origin: 'The Drun — Neth who burned their names from the First Contract — lose their legal existence, their immortality, and their identity. Most become mercenaries. Some go mad. A few become something else. The Vatra was a Drun who could not accept being nameless. In the depths of the bog, surrounded by preserved moss and the Keeper\'s silence, she began writing a name back onto herself using fungal thread — threading names from the dead into her own skin, one letter at a time. The fungal thread took root. The names grew. The Vatra now carries dozens of dead names, and each one wants to stay.',
          nature: 'A silver-skinned figure wrapped from head to toe in living fungal thread that glows with soft amber light. Where the thread crosses her skin, words are visible — names, dates, contract-clauses — written in phosphorescent mycelium. She moves slowly through the bogs, approaching travelers and asking them a single question: "May I borrow your name?" If they say yes, she reaches out, a thread extends from her finger, and she weaves their name onto her body. They lose it — not their identity entirely, but the ability to prove it. For three days, no document, contract, or testimony they make will be recognized as valid. The name returns when the fungal thread that holds it decays.',
          habitat: 'Peat-bogs and the boundary between living forest and preserving bog. Always near standing water. More active at night, when the fungal glow is brightest.',
          combat: '80 HP. Immune to necrotic — she has already died once. Fungal Thread Attack (melee, reach 10 ft, 1d8 piercing + DC 14 SPI save or the target must answer the Vatra\'s question. "May I borrow your name?" — saying no deals 2d6 psychic damage from the rejection; saying yes causes the name-loss effect for 3 days). Thread-Binding (30 ft range, DC 14 AGI save or restrained by fungal threads for 2 rounds — the threads are flammable, fire damage frees the target instantly). Burning Regeneration (when the Vatra is reduced below half HP, her fungal threads ignite, dealing 1d6 fire damage to all creatures within 10 ft per round, but she regenerates 10 HP per round from the burning mycelium. Fire vulnerability can be exploited — sustained fire damage prevents regeneration).',
          stats: {
            strength: 12, agility: 10, constitution: 16, intelligence: 14, spirit: 16, charisma: 14,
            maxHp: 80, maxMana: 20, maxActionPoints: 5, speed: 25,
            resistances: { necrotic: 100, poison: 50 }, vulnerabilities: { fire: 50, radiant: 50 }
          },
          depth: 'The Vatra is the Neth\'s deepest shame and the Drun\'s most complex creation. The Neth Velun will not speak of her — she represents the failure of the Contract to account for everyone. The Neth Kessen view her with clinical fascination: she carries names, and names have power. A Kessen could theoretically read the names on her threads and use them to prove or disprove ancient contracts. The Drun themselves revere her as a martyr — she chose the hardest path possible to regain what the Contract took. The Vreken, who have no contracts and no names to lose, treat her with pity. They bring her fungal offerings and sit with her in the bogs. She never borrows their names. She says they do not have any to give.',
          hooks: [
            'A Neth Velun arcanist wants the Vatra captured alive. The names woven into her threads include three that belong to clauses in the First Contract — names that could rewrite the terms of Neth immortality. The Vatra will not come willingly. The Drun will fight to protect her.',
            'The Vatra has borrowed the name of a party member. For three days, nothing they say or sign carries legal weight. This is catastrophic — they are in the middle of negotiating with a Vreken crypt-council. Find a way to accelerate the fungal thread\'s decay or replace the borrowed name temporarily.',
            'A Drun elder says the Vatra is close to writing a complete name onto herself — her own original name, lost when she burned it from the Contract. If she succeeds, she will become the first Drun to regain legal existence. But the name she is writing is also the name of a Neth noble who is currently alive and using it. Two Neth cannot share a name. One must lose it.'
          ]
        },
        {
          id: 'vyraj',
          name: 'Vyraj',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/vyraj.png',
          illustrationCaption: 'The Vyraj emerging from the deepest peat — a figure with backward hands and mouths for eyes, eating a contract',
          role: 'The devourer of agreements',
          origin: 'Before the Keeper, before the Neth, before the First Contract, the Bryngloom was governed by something else — a Hindu-Vedic principle of cosmic law that the Slavic forest-spirits called "vyraj," the paradise where all law originates. When the Keeper assumed jurisdiction, this older law did not die. It went dormant. The Wyrd found it in the deepest peat — a principle so old it had become organic, a creature that embodies the idea that every law eventually produces its own loophole. The Vyraj eats contracts and regurgitates paradoxes.',
          nature: 'A tall figure with backward-facing hands and eyes that are actually mouths — each one speaking a different clause of the last contract it consumed. Its skin is the color of wet peat and ancient bog-wood, cracked with lines of glowing gold that pulse like heartbeat. It does not speak with a single voice — it speaks with all its eye-mouths simultaneously, each reciting a different part of a legal argument that contradicts itself. It is not evil. It is the logical endpoint of all legal systems: a creature that proves every agreement is inherently broken by its own terms.',
          habitat: 'The deepest peat-bogs of the Bryngloom, below the water line. Surfaces only when a contract within its range is being negotiated — it can smell legal language from miles away.',
          combat: '300 HP. Immune to psychic and physical damage — it is law made flesh, and law is abstract. Legendary actions (3/round). Clause-Strike (melee, 3d10+6 force damage — the impact is not physical but legal, the target\'s body reacting as if a contract has been violated, DC 18 CON or stunned 1 round). Paradox Field (30-ft radius, all creatures within must make a DC 16 INT save — failure means they cannot take any action that involves an agreement, promise, or coordination for 1 round, effectively acting alone). Devour Agreement (the Vyraj targets a single creature and attempts to consume a buff, magical effect, or tactical advantage — DC 18 SPI save, failure means the target loses one buff or positive effect of the DM\'s choice). Vulnerable to radiant and void — light that reveals truth dissolves legal abstractions, and void represents the absence of law.',
          stats: {
            strength: 18, agility: 14, constitution: 22, intelligence: 20, spirit: 18, charisma: 16,
            maxHp: 300, maxMana: 60, maxActionPoints: 6, speed: 30,
            resistances: { physical: 75, psychic: 100, necrotic: 50 }, vulnerabilities: { radiant: 75, void: 75 }
          },
          depth: 'The Vyraj is the Keeper\'s oldest enemy and the one thing in the Bryngloom that the Keeper genuinely fears. The Vyraj predates the First Contract — it represents a version of cosmic law that existed before the Neth wrote anything down. If the Vyraj is correct, then every Neth contract is built on a foundation of paradoxes, and the Keeper\'s authority is derived from a system that was already broken when the Neth found it. The Neth Velun suppress all knowledge of the Vyraj. The Neth Kessen study it from a safe distance. The Neth Drun — who have already broken their contracts — are immune to its Paradox Field, because they have no legal existence to contradict. This makes the Drun the only beings who can fight it without being paralyzed by its legal contradictions.',
          hooks: [
            'The Vyraj has surfaced near Atropolis during a major Neth trade summit. Every contract being negotiated is at risk of being consumed. The Neth Velun want the party to drive it back into the deep bog. The Neth Kessen want to study its behavior. The Drun want to negotiate with it — and the Vyraj is willing to listen to beings without legal existence.',
            'A Vreken crypt has been breached and all the fungal-light contracts dissolved. The Vyraj is the suspect. The party must determine whether the Vyraj consumed the contracts deliberately or whether the contracts collapsed on their own due to paradoxes the Vyraj exposed.',
            'The Vyraj has consumed a copy of the First Contract — not the original, but a Neth transcription. With the contract inside it, the Vyraj now carries the authority that governs all Neth immortality. If the Vyraj is destroyed, the contract may be recovered. If the Vyraj digests it, all Neth immortality ends.'
          ]
        },
        {
          id: 'canker',
          name: 'Canker',
          dangerLevel: 'Medium',
          illustration: '/assets/images/creatures/canker.png',
          illustrationCaption: 'A Canker — the Wyrd\'s legal mockery, spreading spore-contracts through the dead',
          role: 'The contract that breathes',
          origin: 'The Wyrd learned contract law by watching the Neth. It found the loophole that no legal system had ever closed: the dead cannot refuse to sign. The Canker was its experiment — a creature that infects the recently deceased and uses their bodies to distribute binding spore-contracts among the living.',
          nature: 'A parasitic fungal entity that infects the dead before the Grandmother of the Bog can claim them. It puppets the corpse, walking it through settlements to distribute spores. Each spore is a binding contract — those who inhale it agree to terms they cannot read. The Canker does not kill. It enrolls.',
          habitat: 'The boundary between living forest and preserving bog, where death is common and the line between the living and the dead is blurred.',
          combat: 'The host has 80 HP. The Canker\'s true body is a mycelial network in the host\'s brain. Killing the host releases a spore burst (30-ft cone, DC 14 CON or infected). Infected targets progress through four stages over 7 days: cough, spore-lung, fungal bloom, death. At each stage they can be cured with a DC 16 Medicine check using Vreken anti-fungal poultice.',
          stats: {
            strength: 12, agility: 10, constitution: 16, intelligence: 14, spirit: 12, charisma: 10,
            maxHp: 80, maxMana: 20, maxActionPoints: 4, speed: 25,
            resistances: { poison: 100, necrotic: 50 }, vulnerabilities: { fire: 50, radiant: 50 }
          },
          depth: 'The Neth despise the Canker because it operates within their own legal framework. Its spore-contracts are binding — recognized by the Keeper itself — because the signatories inhaled voluntarily. The Neth have tried to litigate against it. They lost the case because the spores technically count as "presented terms." The Vreken, who have no contracts, are immune.',
          hooks: [
            'A village shows signs of spore-infection. Track the host before the infection spreads to the whole settlement. Burn the host, isolate the infected, and find the Canker\'s mycelial source.',
            'The Vreken know a fungal counter — a rare mushroom that neutralizes the spores. It only grows in the deepest bog-caves, tended by the Vreken Clean.',
            'Negotiate with the hive-mind. The Canker is sentient and capable of legal reasoning. If the party can prove it breached its own contract terms, it must release all signatories — but the terms are written in spores and no one has read the full document.'
          ]
        },
        {
          id: 'edict',
          name: 'Edict',
          dangerLevel: 'High',
          illustration: '/assets/images/creatures/edict.png',
          illustrationCaption: 'The Edict — the First Contract made flesh, enforcing terms no one remembers signing',
          role: 'The clause made flesh',
          origin: 'The Keeper of the Last Threshold does not punish. It enforces. When a contract is broken so severely that it threatens the First Contract — the original pact that preserves the Neth — the Keeper sends a piece of itself to investigate. That piece is the Edict.',
          nature: 'A towering figure of ironwood, bog-moss, and crystallized Neth blood. It does not speak. It enforces. It cannot be reasoned with while actively pursuing a breach — it is not a negotiator, it is a ruling. It observes, collects evidence, and determines whether a violation occurred. If innocent, it withdraws silently. If guilty, it enforces the penalty written in the contract.',
          habitat: 'It manifests at the site of the broken contract and does not leave until the case is resolved. It can appear anywhere in the Bryngloom — and beyond, if the contract was witnessed by the Keeper.',
          combat: '400 HP. Legendary actions (4). Damage immunity: non-magical weapons. Ironwood fists (4d12+8 bludgeoning). Each round, it invokes one contract clause: Null and Void (dispel magic on one target), Breach of Terms (force a reroll), In Perpetuity (restrain one target with spectral moss until terms are met). Cannot be tricked, bargained with, or deceived while active.',
          stats: {
            strength: 22, agility: 12, constitution: 22, intelligence: 20, spirit: 20, charisma: 18,
            maxHp: 400, maxMana: 80, maxActionPoints: 6, speed: 30,
            resistances: { physical: 50, psychic: 100, necrotic: 100 }, vulnerabilities: { radiant: 50 }
          },
          depth: 'The Edict is not a punishment — it is due process. The Keeper does not judge; it sends the Edict to determine the facts. If the accused can prove they did not breach terms, the Edict withdraws. It is terrifying but perfectly just. The Neth live their entire lives under the shadow of the Edict, and most have never seen it. That is the point: the threat of it keeps the contracts honest.',
          hooks: [
            'The Edict is approaching a settlement. Someone broke a Neth contract — possibly unknowingly. Find the violator before the Edict does, and either hide them or help them fulfill the terms before the Edict arrives.',
            'Produce a prior precedent that overrides the broken contract. This requires access to the Neth legal archives in Atropolis, which are not open to outsiders — the party must negotiate or infiltrate.',
            'Destroy the First Contract itself — the source of all Neth law kept in the heartwood of Atropolis. Without it, the Edict has no authority. But no one knows what happens if the source of Neth immortality burns.'
          ]
        }
      ]
    }
  ]
};
