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
          combat: 'CR 2. Flees if attacked (40 HP, AC 13). Its masks can be thrown as distractions (Charm Person, single target, DC 12). Overturning its cart releases 2d6 trapped faces that fly back to their original owners — who may not want them back.',
          depth: 'The Gref was once a Mimir who lost its own face in the fog and could not remember what it looked like. The Wyrd gave it a purpose: collect every face it could not have. It is not malicious — it is incomplete. Some say if you offer it a truly kind memory, it will return a face for free.',
          hooks: [
            'A noble\'s son bought a face and can no longer remove it. The party must find the Gref and negotiate the return — but the son has forgotten who he was without the mask.',
            'The Gref knows the location of every soul lost in the fog. A grieving widow wants to know if her husband still lives. The Gref will trade — for a face of equal value.',
            'A village has been found empty, every inhabitant wearing identical masks. The Gref visited three nights ago. The party must find which villager started the trade.'
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
          combat: 'CR 7. 100 HP, AC 16. Her vines create difficult terrain in a 30-ft radius (DC 14 STR or grappled). She can teleport between any two thorn-vines within 60 ft. Her blood-briar strike deals 2d8+4 piercing and forces the target to confess one secret (DC 15 WIS or stunned for 1 round with shame).',
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
          combat: 'CR 15. The court functions as a single entity with 250 HP. Legendary actions (3). The Mist-Hounds (6, CR 5 each) are extensions of the Revel\'s will. The Revel\'s dance aura (60 ft) forces a DC 16 WIS save or the target must dance — spending their action to move toward the Revel. If all four hounds are killed, the Revel dissipates until the next moonless night.',
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
          combat: 'CR 1. 25 HP, AC 12. Can cling to any surface and siphons heat from living creatures within 10 ft (1 cold damage per round + target loses sense of temperature). Fears open flame — will flee if cornered with a torch. Its nest contains 1d4 small warm objects (heirloom rings, heated stones, preserved coals).',
          depth: 'Every home has one. It only manifests when the family has stopped valuing their warmth. The Hrym say it is a test: if your hearth is true, the Rimor never leaves the walls. Some families leave a small dedicated hearth for the Rimor — an unspoken truce. In return, the Rimor keeps worse things from nesting in the same walls.',
          hooks: [
            'A family was found frozen in their own home, fire still burning. The party must track the Rimor to its nest — it has grown bold because the family neglected the old traditions.',
            'The Hrym know that Rimor-spoor can be smoked out using dried skaldfire moss, which only grows on the cliffs of the eastern fjords — a dangerous climb.',
            'Offer the Rimor a dedicated hearth of its own. If the family maintains it, the Rimor becomes a guardian against worse Wyrd-creatures — a permanent but uneasy arrangement.'
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
          combat: 'CR 9. 140 HP, AC 16. Resistance to all physical damage except fire. Generates a 60-ft radius of extreme cold (DC 14 CON each round or 1d6 cold and slowed). Melee slam (3d6+5 bludgeoning + 2d6 cold). Can release a blast of ancient air in a 30-ft cone (DC 16 CON, 6d8 cold, frozen solid if failed by 5+).',
          depth: 'The Stel is not malicious — it is homesick. It remembers a world before the bargain, when the ice moved freely. The Skald leave offerings of rimesteel at its known crossings, not to appease it but to thank it for shaping the land they now inhabit. Some Stel have been migrating in circles for centuries, unable to find the path they lost.',
          hooks: [
            'A Stel is approaching a settlement. Redirect it using mirrors and sustained heat-sources to melt its leading edge — but this requires a coordinated effort and a source of fuel.',
            'The Hrym know a ritual that can communicate with the Stel\'s ice-core. It may answer questions about the time before the bargain — including the location of things buried by the original glaciers.',
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
          combat: 'CR 18. Cannot move. The jawbone itself has 300 HP and is immune to all damage except radiant. Each round it can target one creature with a question (DC 18 WIS or take 4d10 psychic damage as the answer is forced into the mind). Frozen guardians (6, CR 4 each) defend the approach. If the Jawl is destroyed, it releases a shockwave of ancient memory (10d10 psychic, half on DC 20 WIS save).',
          depth: 'The Jawl does not want to hurt anyone. It simply does not understand that mortals are fragile. It has been answering questions for millennia and has never once considered the cost to those who ask. Some say it was once something beautiful — a guardian of a different kind — twisted by its death into this hunger for connection.',
          hooks: [
            'The party needs ancient knowledge to locate the region\'s shard. The Jawl knows where it is. Who will pay the price in years?',
            'The Jawl respects creatures that outwit it. A game of riddles with stakes — each wrong riddle costs a memory, each correct answer reveals a truth.',
            'The Hrym believe the jawbone belongs to a larger skeleton. Find the rest of it and lay the bones together — the Jawl may finally be silenced, or it may wake completely and walk.'
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
          combat: 'CR 1/2. 15 HP, cannot be harmed by fire. If attacked, it releases a burst of ash (1 round, obscured in 10-ft radius) and flees. It can be captured in an obsidian jar — it becomes a permanent light source that never extinguishes but always points toward the nearest danger.',
          depth: 'The Emberth call it the Lost Lamb. They leave small offerings of ash-cakes at its known paths, hoping one day it will find its way home. It cannot. It has been following the same circuit for centuries, always leading the living toward death, never understanding why they do not thank her.',
          hooks: [
            'Follow it to find a lost caravan. It led them to a geothermal vent — they died of dehydration a mile from water, their last expressions peaceful.',
            'Capture it in a jar of obsidian and volcanic glass. It becomes a compass that always points toward the nearest warm thing — including hidden vents, lava flows, and the dying.',
            'The Emberth know a ritual to unmake it: return it to Solbrand-touched ground. The party must carry it to the heart of Emberspire, where the Cinder may finally be released — or rejoin the Solbrand.'
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
          combat: 'CR 8. 90 HP, AC 15. Immune to fire and poison. Each round she weaves 1d4 threads that can be thrown as psychic projectiles (2d6 psychic). Her croon requires a DC 14 CON save each round or the target is hypnotized, moving toward her. Taking a tapestry without payment triggers her wrath: she animates 2 obsidian shard golems (CR 3 each) from the cooling glass around her.',
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
          combat: 'CR 16. 220 HP, AC 18. Aura of Entropy: all creatures within 120 ft take 1d6 cold per round and cannot regain HP. Melee slam (3d10+6 bludgeoning plus 2d10 necrotic). Can release a pulse of absorbed heat (recharge 5-6, 60-ft radius, 8d8 fire damage, DC 18 DEX half). Resistances: cold, fire, necrotic. Vulnerable: radiant.',
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
          combat: 'CR 1. 30 HP, immobile. Cannot attack. If destroyed, each polyp releases a scream in a different voice (2d6 psychic, DC 12 WIS half, and the party hears the final moments of every drowning victim at once).',
          depth: 'The Spume is not a creature — it is a library. The sea has no written language, so it stores its records in living memory. The Myrathill treat it as sacred, visiting it after storms to hear the voices of those lost at sea. They say the Spume never forgets a voice, but it never understands a word.',
          hooks: [
            'Find a sailor\'s final message to their family. The Spume has their voice. Trade a story for the secret — the story does not have to be true, but it must be told with conviction.',
            'Learn the location of a shipwreck. The Spume absorbed the navigator\'s voice and remembers the last course plotted.',
            'Feed the Spume a fictional story. It will believe it and carry it into the sea, where the Myrathill will hear it as truth. A way to spread information across the ocean without leaving a trace.'
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
          combat: 'CR 10. The ship has 160 HP and is crewed by 8 skeletal sailors (CR 2 each). The captain casts fear and control water at will. The ship can submerge for 1d4 rounds and reappear 500 ft away. Killing the captain disperses the ship until the next storm — he reforms with the rain.',
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
          combat: 'CR 19. 350 HP, AC 20. Legendary actions (3). Tentacle strikes (3d10+7 bludgeoning, reach 80 ft). Can capsize ships (DC 22 STR check on a grapple). At half HP, it invokes an emergency clause: it calls 2d4 lesser leviathans as reinforcements. Its contract explicitly forbids it from attacking ships that have paid — it will not break this rule.',
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
          combat: 'CR 2. 50 HP, AC 17 (metal hide). Can swallow a metal object (DC 13 STR save or weapon is eaten, dealing 2d6 to the Scrab). A Scrab that has consumed too much precious metal becomes dangerously magnetic — creatures wearing metal within 20 ft must make a DC 12 STR save or be pulled toward it.',
          depth: 'The Scrab is the Wyrd\'s answer to Fexric greed — a thing that consumes what they value most. But the Fexric have learned to farm them, herding Scrabs through ore veins to extract metal faster than any pickaxe. A trained Scrab is worth more than a year of mining. A wild one can collapse a shaft.',
          hooks: [
            'A mine has collapsed — a wild Scrab ate the support beams. The party must clear the rubble and drive it out before the mine can be worked again.',
            'A Fexric master crafter will pay handsomely for a trained Scrab. But training one requires feeding it progressively more valuable metals — a costly investment.',
            'A Scrab\'s stomach contains rare undigested alloys. Track one that has been feeding in a rich vein, kill it, and extract the metal — but the vein it found belongs to whoever claims the tunnel.'
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
          combat: 'CR 8. The Yawn itself is terrain, not a creature. It has 120 HP and can be attacked. Each round, 1d4 bone-hands emerge from the span and attempt to grab creatures (DC 14 DEX or grappled, dragged into the bridge structure — 2d6 bludgeoning per round). The bridge-keeper\'s ghost manifests at the midpoint and must be passed to cross safely.',
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
          combat: 'CR 17. The Thrum cannot be killed — it is a phenomenon. Each round it asks a question through tectonic vibration (DC 18 Insight/Religion to interpret). Wrong answers cause a cave-in (6d6 bludgeoning, DC 16 DEX half). Right answers calm it. After 3 right answers, the path to the Subterranean Vault opens. If the party fails 3 questions in a row, the chamber collapses entirely.',
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
          combat: 'CR 1/2. 10 HP, AC 12. Cannot directly harm. Its pollen causes the target to forget one specific memory of their choice — or one the DM chooses (DC 12 CON save). Swarms of 10+ Liens can drain a person\'s entire history in one night.',
          depth: 'The Lien is not a predator — it is a receipt. The Wyrd created it as a way for the steppe to track debt across generations. Ordan folklore says a Lien that consumes enough debt becomes a Ledger-Keeper. They are not hunted; they are observed. A nomad who sees one knows their account is unsettled.',
          hooks: [
            'A merchant is being drained by a swarm — someone in their bloodline owes a debt from three generations ago. The party must find the original debtor (long dead) and settle the account.',
            'Follow a single Lien across the steppe. It will lead you to whoever carries the largest unpaid debt in the region — a debtor who has been running for years.',
            'The Astril believe the Liens follow the same paths as the constellation-spirits. Follow the moths, and you may find the spirits — or what is left of them.'
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
          combat: 'CR 7. 80 HP, AC 14. Can animate grass in a 60-ft radius (DC 15 STR or restrained). The Lorn itself does not attack — it cries, and each cry forces a DC 14 WIS save or the target must move toward it. If killed, it dissolves into grass seed and regenerates in 1d4 days unless the seeds are gathered and burned.',
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
          combat: 'CR 15. 200 HP, AC 18. Legendary actions. Spear of Unfinished Business (2d10+5 piercing, target cannot regain HP until the Sere\'s next turn). Raises forgotten dead from the steppe (2d4 CR 3 riders each round). At half HP, calls a Wind-Hungry swarm (20-ft radius, 3d6 cold per round). His horse can phase through solid matter.',
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
          combat: 'CR 1. Immobile. 50 HP, AC 10. Cannot attack. If threatened, it screams every secret it has ever heard in a deafening chorus (DC 14 WIS or stunned for 1 round by psychic overload — the secrets are that terrible). After screaming, it forgets everything and starts over.',
          depth: 'The Neth consider the Wist property. The Vreken consider it sacred — a living oracle of the forest\'s truth. No one has asked the Wist what it thinks. It has been listening for so long that it no longer knows if it has a voice of its own, or if it is only the sum of what it has overheard.',
          hooks: [
            'The party needs a secret only the Wist knows. It will trade — one secret for another, always of equal weight. It does not negotiate; it balances.',
            'The Neth use the Wist as a contract witness. Ask it whether a deal was broken. It remembers every word spoken within a mile of its grove — including the fine print.',
            'Seal its bark with wax and the Wist sleeps, unable to hear or speak. Destroy it, and every secret it holds scatters into the wind, audible to anyone within a mile.'
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
          combat: 'CR 8. The host has 80 HP. The Canker\'s true body is a mycelial network in the host\'s brain. Killing the host releases a spore burst (30-ft cone, DC 14 CON or infected). Infected targets progress through four stages over 7 days: cough, spore-lung, fungal bloom, death. At each stage they can be cured with a DC 16 Medicine check using Vreken anti-fungal poultice.',
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
          combat: 'CR 21. 400 HP, AC 22. Legendary actions (4). Damage immunity: non-magical weapons. Ironwood fists (4d12+8 bludgeoning). Each round, it invokes one contract clause: Null and Void (dispel magic on one target), Breach of Terms (force a reroll), In Perpetuity (restrain one target with spectral moss until terms are met). Cannot be tricked, bargained with, or deceived while active.',
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
