export const mimir = {
        id: 'mimir',
        name: 'Mimir',
        essence: 'The Mask-Bound',
        illustration: '/assets/images/races/mimir_illustration.png',
        illustrationCaption: 'A tall, slender Mimir in a bark-hide cloak, flat reflective mask catching fog-light, two glowing eye-beads burning through the mist like distant stars.',
        description: 'We have never shown you our faces. Not because we are hiding something monstrous — but because we stopped being certain what our faces look like eleven generations ago, and we have been wearing the answer ever since. The mask is not a disguise. The mask is the last thing our mothers gave us, pressed into newborn spore-flesh still wet from the birthing flame, and we have never taken it off. You think we are secretive. You are right. But we are secretive the way a person who has been hunted for their skin is secretive — not proud, not mysterious, just still alive.',
        icon: 'fas fa-mask',
        overview: 'The Mimir are what happens when a person sees their own death-omen and refuses to die. They are the descendants of those who merged with their fetches — doppelganger spirits that appear as omens of death — and survived the union. The mask is the calcified barrier between the original soul and the fetch, a gift from each mother to each child. Births are spore-based, secret, rare, conducted in sacred mother-flame chambers deep in the Fog-Vales. The Mimir do not show their true faces. They do not know what their true faces look like. They live in a thousand square miles of perpetual mist — old-growth canopies, cloud-shelf mountain aeries, and the deep floor where fog never lifts — hiding from a world that either refuses to believe they exist or pays fortunes for the masks off their dead.',
        culturalBackground: `Mimir society is built around masks, not bloodlines. Every Mimir receives their mask from their mother at birth — a sacred heirloom carved from heartwood, storm-glass, or salvaged fragments, depending on lineage. The mask is everything: face, name, identity, the only barrier between the Mimir's soul and the fetch that lives inside them. Without it, a Mimir is not merely exposed — they are dissolving.

The art of mask-forging was lost during the Purge, when inquisitors burned the birthing chambers and killed the last Mask-Mothers who knew the craft. Every mask in existence is a relic. This scarcity created the Rupture — when inheritance laws decreed that only first-born children could receive their mother's mask, the Mimir shattered into three subraces. The Mask-Borne claimed the canopy-holds and became aristocracy. The Mist-Woven were pushed to the mountain aeries and became sentinels. The Unwoven — those born without masks, or who lost them — drifted to the floor and became something else entirely.

Mimir are introverted by nature. Outside the Vales they wear borrowed forms — faces gathered from brief contact, glimpses, stolen moments — but they cannot maintain them for long. Prolonged time among outsiders drains them. They need the fog, the silence, the company of their own kind. And always, always, the small spore-companion orbiting their shoulder — the Fetch-Mote, their oldest friend, the keeper of everything they forget.`,
        variantDiversity: 'The Mimir are divided into three bloodlines shaped by the Rupture: The Mask-Borne hold the canopy — aristocrats, artisans, the inheritors. The Mist-Woven guard the borders from mountain aeries — sentinels, first-alert, the ones who see threats before they arrive. The Unwoven drift the deep floor — outcasts, survivors, the ones who made a home from what everyone else threw away.',
        integrationNotes: {
            actionPointSystem: 'Mimir abilities focus on perception, memory, identity protection, and environmental adaptation. Their traits emphasize survival in obscured terrain and social nuance.',
            backgroundSynergy: 'Mimir excel in backgrounds emphasizing stealth, perception, and survival. Their introverted nature and secretive culture create compelling roleplay tension with outsiders.',
            classCompatibility: 'Mask-Borne favor Inscriptor, Oracle, Augur, and Lunarch. Mist-Woven favor Huntress, Warden, Bladedancer, and Spellguard. The Unwoven favor Toxicologist, Plaguebringer, Witch Doctor, and Doomsayer.'
        },
        meaningfulTradeoffs: 'Mimir gain powerful identity protection and perception abilities through their masks and fetch-motes, but suffer severe consequences if their masks are forcibly removed or their motes destroyed. They are introverted outsiders who struggle outside the Fog-Vales and face hostility from poachers who hunt them for their mask-relics.',
        baseTraits: {
            languages: ['Common', 'Vale-Speak'],
            lifespan: '90-130 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'10" - 7\'0"',
            weight: '130-180 lbs',
            build: 'Tall, slender, unnaturally fluid movement'
        },
        epicHistory: `
The First Fetch happened before the Fog-Vales had a name. Sylvain was a woman who saw her own fetch standing at the foot of her bed — a perfect duplicate, featureless save for two glowing points where eyes should be. In the old stories, seeing your fetch means you will die within the year. Sylvain did not die. She reached out and touched it. The fetch did not recoil. It climbed inside her skin and made itself at home.

For three days Sylvain lay fevered, her body fighting the merger. When she rose, her face was smooth — not blank, but reflective, like polished water. The fetch had become her second soul, and the barrier between them had calcified into the first mask. She was not dead. She was not alive as she had been. She was the first Mimir.

Her children inherited the condition. Not through blood — through spore. Sylvain discovered that in deep fog, her body released microscopic spore-clouds that could germinate new life. The first Mimir births happened in secret, in chambers lit only by the mother-flame, a sacred fire that never goes out. The mask became tradition: each mother carved a mask for her child, passing down the barrier that kept the fetch contained.

For centuries, the Mimir thrived in the Fog-Vales. They learned to forge masks from heartwood and storm-glass, to build canopy-villages in the ancient forests, to read the fog like weather. The art of mask-forging was perfected. The birthing chambers multiplied. The Mimir population grew.

Then came the Purge. Inquisitors from the eastern kingdoms, armed with detection magic and silver weapons, swept through the Vales burning everything they found. They declared Mimir abominations — soulless fetch-creatures wearing stolen faces. The birthing chambers were destroyed. The mask-forgers were executed. The secret of creating new masks died with Ithra Mask-Mother, the last of the forge-masters, whose body was never found and whose own mask was never recovered.

The Rupture followed. With no new masks being made, every heirloom became priceless. The elders decreed that only first-born children could inherit. Second-born and later children were Maskless — and in a society built on masks, Maskless meant nothing. The Mask-Borne consolidated power in the canopy-holds. The Mist-Woven were pushed to the mountain borders, told to watch for the next Purge. The Maskless were given the floor — the deepest fog, the spore-thickets, the ground nobody else wanted — and told to survive if they could. They became the Unwoven.

The Mimir have been hiding ever since. But the world is not done with them. Hunters still probe the Vales. Masks still fetch fortunes on the black market. And the mother-flame still burns in the deepest chamber, waiting for someone who remembers how to use it.
        `,
        notableFigures: [
            {
                name: 'Sylvain of the First Fetch',
                title: 'The Original',
                portraitIcon: 'Armor/Head/head-golden-crown-helmet',
                backstory: `
She was a forester's daughter from a village whose name has been eaten by time. When her fetch appeared at the foot of her bed, she was twenty-two, unwed, and carrying a child that would never have a father — he had died in a hunting accident three weeks prior, and the fetch wore his face for the first three seconds before it smoothed into the mask-surface all Mimir now know.

Sylvain did not scream. She did not run. She asked the fetch what it wanted, and the fetch — which could not speak — touched her chest with fingers that passed through skin and pressed directly against her heart. She understood. It wanted to live, and it needed a living soul to anchor it. She made the bargain without words. The fetch entered her, and her unborn child became the first Mimir born from spore.

Sylvain lived to one hundred and seven. She taught three generations of Mimir how to carve masks, how to tend the mother-flame, how to commune with their fetches without losing themselves. Her own mask — the First Mask, the original calcified barrier — was never passed down. She asked to be buried in it. The Mimir honored her wish. Her grave is somewhere in the oldest part of the canopy, unmarked, because she said a marker would only tell the hunters where to dig.
                `
            },
            {
                name: 'Ithra Mask-Mother',
                title: 'The Last Forge-Master',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
No Mimir alive remembers how to make a new mask. The last person who did was Ithra, and she died in the Purge ninety years ago with the technique still in her hands.

Ithra was a Mask-Borne artisan of the highest order. She knew the heartwood trees by name, could identify storm-glass by its resonance when struck, and had memorized every carving-pattern from the First Fetch to her own generation. She trained seventeen apprentices. None of them finished their training before the inquisitors came.

When the Purge reached the birthing chambers, Ithra made a choice. Instead of fleeing, she sealed herself inside the central chamber with the mother-flame, a carving knife, and a block of raw heartwood. The inquisitors broke through the door ninety minutes later. The chamber was empty. The mother-flame still burned. On the floor, surrounded by a ring of scattered wood-shavings arranged in a pattern no one has ever been able to interpret, was a half-finished mask. Ithra's own mask was gone. Her body was never found.

Some Mimir believe she finished the mask and used it to become something else — something beyond fetch, beyond spore, beyond the need for either. Others believe the inquisitors took her and the mask was destroyed. The image on the half-finished mask was of a doorway with no door, threshold carved but frame incomplete. No one knows what it was supposed to open.
                `
            },
            {
                name: 'Kalev Rope-Caller',
                title: 'The One Who Held the Pass',
                portraitIcon: 'Armor/Head/head-hooded-helmet',
                backstory: `
The Mist-Woven do not build monuments. They build warnings. The highest spire in the eastern aerie range has a single rope dangling from its peak — not a bridge, not a ladder, just a line of fog-spider silk that Kalev climbed alone, in the dark, while a poacher company was working its way up the cliff below.

Kalev was sixteen. He had been posted to the easternmost watch-point, the one no one wanted because it was exposed and the wind never stopped. He saw the poachers before anyone else did — twelve of them, armed, carrying the specialized glass-cutters the hunters use to pry masks off dead Mimir. He had no way to alert the aerie. The fog was too thick for signal-fires. So he climbed.

He scaled the sheer face of the spire — three hundred feet of vertical stone, no rope, no gear, just the friction of his storm-glass fingertips against the rock — and when he reached the summit he tied off the longest rope-silk he had and swung down onto the poachers' climbing line. He cut it. Eight of them fell. The remaining four tried to fight him on the cliff face. He killed two. The last two fled. Kalev climbed back to his post, lit the signal-fire, and sat down. His hands were shredded. His mask was cracked across the left eye-bead. He had not slept in two days. When the relief watch arrived, he was still sitting there, staring into the fog, his fetch-mote curled in his lap like a cat that had seen everything and would never speak of it.
                `
            },
            {
                name: 'The Eyeless One',
                title: 'The Floor Remembers',
                portraitIcon: 'Armor/Head/head-blue-visor-helmet',
                backstory: `
Among the Unwoven, elders do not rule — they persist. The oldest living Unwoven has no name, or rather has had so many patchwork-names stitched together from mask fragments that no single one applies. Other Mimir call them the Eyeless One because both eye-beads in their composite mask are dark — extinguished decades ago, and yet they navigate the floor perfectly, reading spore-trails by touch and scent.

The Eyeless One's mask is a mosaic of over a hundred fragments — shards from dead Mask-Borne, slivers from fallen Mist-Woven, pieces of other Unwoven whose masks outlasted their bodies. When the Eyeless One speaks, their voice shifts mid-sentence, carrying the cadences of every Mimir whose fragment is currently dominant. They have forgotten their own birth. They remember everyone else's.

Young Unwoven seek the Eyeless One out for one purpose: to hear whether their lost siblings are still alive. The Eyeless One touches the seeker's mask, hums a single note, and then names every Mimir the seeker is related to — living or dead, present or distant — with the exact emotional signature of each. They are never wrong. When asked how they know, they touch the oldest fragment in their composite mask — a shard of heartwood that might be from Sylvain's original — and say: "I paid for this already. The memory lives in the shard. I am just the voice it borrows."
                `
            }
        ],
        majorLocations: [
            {
                name: 'The Canopy-Holds',
                description: `
The heartland of the Mask-Borne, suspended eighty feet above the forest floor in the oldest fog-woods of the Vales. The canopy here is so dense that the mist never penetrates fully — diffused green-gold light filters through layers of ironwood leaves, and the air smells of living bark and cultivated mycelium. Mask-Borne homes are grown, not built: platforms of woven branch and shelf-fungus, connected by living bridges that pulse faintly at night with bioluminescence only Mimir eye-beads can perceive.

The oldest family holds have stood for four centuries. Their heartwood supports have thickened into something like stone, their mask-galleries display ancestral masks going back eleven generations. Every Mask-Borne child learns their lineage by walking these galleries, touching the heartwood masks of their great-great-grandparents, feeling the faint warmth of eye-beads that have been dark for two hundred years but are not quite cold.

The Canopy-Holds are beautiful and they are paranoid. Trap-bridges collapse under non-Mimir weight. Guard-perches disguised as dead branches watch every approach. Mask-Borne elders debate endlessly in chambers hung with sound-dampening mycelium tapestries, because they know — they have always known — that the Purge could come again, and this time there will be no Ithra to seal the chambers behind her.
                `
            },
            {
                name: 'The Spire-Aeries',
                description: `
The border fortresses of the Mist-Woven, carved into the highest mountain cliffs where the Vales meet the peaks. From below, they are invisible — nothing but weathered stone and hanging moss. From above — impossible to see, because the cloud never clears. The Mist-Woven live in vertical settlements: chambers bored into cliff faces, connected by rope-bridges of fog-spider silk, every dwelling facing outward over the drop so nothing can approach unseen.

The Aeries are lit by storm-glass lanterns — captured fulgurite, the glass formed when lightning strikes mountain stone, that glows with a cold silver light when charged by static from passing clouds. Mist-Woven masks are made from this same material, lighter and more angular than Mask-Borne heartwood, built for weather rather than ceremony.

Every Aerie has a Watch-Bell — a bronze chime larger than a Mimir, suspended over the deepest drop, that rings only when the outer alarm lines have been tripped. The bell has rung four times in living memory. Each time, the Mist-Woven held the line. Each time, they lost someone. The names of the fallen are carved into the bell itself, and when the wind is right, the bell hums with their voices.
                `
            },
            {
                name: 'The Mother-Flame Chamber',
                description: `
The deepest secret of the Vales — a cavern beneath the oldest canopy-hold where the original birthing flame still burns. No outsider has ever seen it. Few Mimir have. The flame is a pale, heatless fire that consumes neither fuel nor oxygen, burning the same steady blue-white it burned when Sylvain first kindled it from her own spore and breath. It is the only place where new Mimir can be born. In its light, spore-clouds condense and combine. The mother who tends the flame during a birth pours her own spore into it. The child forms from the mingled mist.

The Chamber has been sealed since the Purge. The entrance is hidden behind a collapse the Mask-Borne deliberately caused to make it look like a dead end. Only the eldest Mask-Borne know the passage through. The mother-flame still burns. But no birth has occurred here in thirty years. The last mother to use it — a Mask-Borne named Velaine — died in childbirth, and her mask cracked during the delivery. Her child survived. The child's name is not spoken. The child is Unwoven, raised on the floor by strangers, carrying a cracked mask that no one knows how to repair.

The Elders debate reopening the Chamber. The Hunters are getting closer. Time may not wait for consensus.
                `
            },
            {
                name: 'The Deep Floor',
                description: `
Where the fog never lifts. The valley floor beneath the canopy is a world of permanent twilight — giant fungal blooms taller than houses, spore-thickets dense enough to walk on, and a silence so complete that Mimir raised here can hear a heartbeat at thirty paces. The Unwoven live here not because they chose to but because it is the only place they were allowed.

There are no permanent structures on the floor. The Unwoven drift with the spore-blooms and fungus cycles, building temporary shelters from cap-flesh that lasts a few weeks before decaying back into the soil. Their masks are composite — fragments of Mask-Borne heartwood, Mist-Woven storm-glass, and older pieces that predate even the Rupture, lashed together with spore-silk into something functional but visibly wrong.

The floor is dangerous. Fog-beasts hunt by vibration. Sinkholes open without warning into fungal caverns that may connect to something beneath the Vales entirely. But the Unwoven survive where Mask-Borne and Mist-Woven would die within days. They have learned to read the spore-trails left by everything that moves, to brew toxins from blooms that exist nowhere else, to navigate by senses the canopy-folk have forgotten they possess.

Mask-Borne call the floor "exile." The Unwoven call it home.
                `
            }
        ],
        currentCrisis: `
The masks are running out. Every year, more Mimir are born than masks are passed down. The Mask-Borne elders have known this for decades, but they have refused to acknowledge the mathematics because acknowledging it means admitting the Rupture was a mistake — that hoarding masks for first-borns while casting the rest to the floor has not preserved Mimir society. It has poisoned it.

Meanwhile, the Hunters grow bolder. A new cartel operating out of the eastern trade cities has begun systematic expeditions into the Vales, equipped with detection magic that can pierce even the thickest fog. They are not superstitious peasants with silver knives. They are professionals. They know what Mimir masks sell for. They know that a single intact Mask-Borne heartwood mask, with the eye-beads still glowing, is worth more than a mercenary company's annual contract.

The Mist-Woven have held the borders so far. But they are losing scouts faster than they can train replacements. The Watch-Bell has rung twice in the last year — more than in the previous decade combined. Some Mist-Woven whisper that the Aeries should be abandoned, that the Mimir should retreat deeper into the Vales and collapse the passes behind them. Others say retreat only delays extinction — that the Mimir must finally stop hiding and fight.

The Unwoven watch this crisis from the floor with the patience of people who have always known the reckoning was coming. They have something the Mask-Borne do not: numbers. For every Mask-Borne or Mist-Woven child that inherits a mask, two more are born Maskless and sent to the floor. The Unwoven have been growing, quietly, for three generations. They are no longer the minority. They are the majority, and they know it.

The Mask-Borne Elders have called a Conclave — the first since the Rupture — to discuss "consolidation." The Mist-Woven have been invited. The Unwoven have not. But the floor hears everything, and the Unwoven are already preparing their answer to an invitation that was never sent.
        `,
        culturalPractices: `
Before your first breath of surface air, your mother presses her mask to your unformed face. The mask is still warm from her — the eye-beads holding the last light she will ever give you directly. This is the Mask-Gifting, the only inheritance any Mimir receives. The mask adjusts to you over your first year, the heartwood or storm-glass softening and reshaping to fit features that are still deciding what they are. By your first birthday, the mask is yours. The mother who gave it to you will never wear one again. This is why Mimir mothers do not leave the birthing chambers. They have given away the only face they had.

Your Fetch-Mote appears within hours of your first mask-wearing — a small, tentative glow that orbits you like a shy moon. To outsiders it is invisible. To other Mimir it is the first proof that you are real. You learn to commune with it through eye contact: a silent language of images, emotions, sensory fragments. It holds what you forget. When you cannot remember your mother's face, the mote shows you — not her features (those were behind the mask, and no one remembers those), but the warmth of her presence, the rhythm of her breathing, the color of her eye-beads in the dark.

By your tenth year, you learn the Fog-Walk — the art of moving through the Vales without disturbing the spore. Every Mimir leaves a trail, microscopic and invisible to outsiders, but legible to their own kind. The trail carries your emotional residue. A Mimir walking past a spot you stood in an hour ago will feel an echo of what you felt. The Mask-Borne teach control — how to walk without leaving rage, how to pass without trailing grief. The Mist-Woven teach reading — how to know who passed and what they carried. The Unwoven teach survival — how to walk so nothing follows you, how to erase your trail entirely, how to become invisible even to other Mimir.

Disputes among Mask-Borne are settled by Lineage Witness: both parties present their mask to an elder, who reads the ancestral patterns carved into the heartwood and determines whose claim has older precedent. The elder's ruling is final because the mask does not lie. Disputes among Mist-Woven are settled by the Cliff-Duel: both parties fight on a rope-bridge with blunted weapons until one falls. The fall is never fatal — there is always a catch-net — but the loser must yield their watch-post for a season. Disputes among the Unwoven are settled by Fragment-Speech: both parties surrender a piece of their composite mask, and an elder presses the fragments together. The merged fragment whispers the truth of the dispute. Both parties accept the verdict because the fragment is now part of the elder's mask and to argue with it is to argue with a piece of yourself you can never get back.

Death rites are the same across all subraces: the dying Mimir removes their own mask — the only time it is ever willingly removed — and presses it into the hands of their chosen heir. The eye-beads hold their last light for exactly as long as the dying Mimir's fetch takes to leave the body. In that moment, the heir sees a final image: not the dying Mimir's face (no one ever sees that, not even at death), but their life's defining memory — the moment that made them who they were. Then the eye-beads dim to the new wearer's color, and the mask belongs to someone new. The body is returned to the fog. Within three days, it has dissolved into spore and rejoined the Vales.
        `,
        birthrightQuestions: {
            description: 'At character creation, choose one of the following RP prompts to define what you carry into the world. No mechanical effects — purely who you are and what haunts you.',
            prompts: [
                {
                    id: 'previous_wearer',
                    name: 'The Mask That Came Before',
                    question: 'Every Mimir mask is an heirloom. Yours was worn by someone before you — your mother, an exiled sibling, a stranger whose name you will never know. Who was the last person to wear your mask, and what is the one thing you know about them that no one else does?'
                },
                {
                    id: 'mote_memory',
                    name: "Your Mote's First Memory",
                    question: 'The Fetch-Mote orbits you like a shy moon, silent except for the memories it holds. When you first made eye contact long enough to connect, it shared one memory that did not belong to you — a fragment from the mask\'s previous life. What did you see, and why can\'t you stop thinking about it?'
                },
                {
                    id: 'witnessed_birth',
                    name: 'The One Who Felt You Born',
                    question: 'Mimir births are secret. Only your mother and the birthing flame witnessed your first breath. But someone else was close enough to feel your spore-signature ignite — another Mimir who sensed you come into being. They have never spoken of it. Who were they to you, and why do you think they have kept your secret?'
                },
                {
                    id: 'borrowed_face',
                    name: 'The Face You Borrow Most',
                    question: 'Outside the Vales, Mimir wear borrowed forms — faces gathered from brief contact, glimpses, stolen moments. Among the forms you have collected, one face you took yourself, deliberately, from someone who mattered. Who was it, how did you take it, and what do you feel every time you put it on?'
                }
            ]
        },
        sharedTraits: [
            {
                id: 'fetch_mote_mimir',
                name: 'Fetch-Mote',
                description: 'A fist-sized companion of condensed spore and fetch-residue orbits you like a shy moon. To outsiders it is invisible — a flicker at the edge of sight, a patch of warm air. To other Mimir, it is a faint, beloved glow. Through prolonged eye contact you commune with it silently, receiving impressions and fragments of the memories it holds. It is your oldest friend. You protect it at all costs.',
                level: 1,
                icon: 'spell_holy_divinespirit',
                spellType: 'PASSIVE',
                effectTypes: ['buff', 'utility', 'debuff'],
                typeConfig: {
                    school: 'spirit',
                    secondaryElement: 'psychic',
                    icon: 'spell_holy_divinespirit',
                    tags: ['companion', 'memory', 'fetch', 'passive', 'shared']
                },
                buffConfig: {
                    buffType: 'custom',
                    customDescription: 'Once per long rest, meditate with your mote for 10 minutes to recover one forgotten memory — gain advantage on one Intelligence check. Through 1 minute of eye contact, commune silently with the mote — it returns images, emotions, and sensory impressions.',
                    effects: [
                        {
                            id: 'mote_memory_recovery',
                            name: 'Recovered Memory',
                            description: 'Meditate with your Fetch-Mote for 10 minutes. Gain advantage on one Intelligence check of your choice. Once per long rest.',
                            statModifier: { stat: 'intelligence_checks', magnitude: 1, magnitudeType: 'flat', conditional: 'once_per_long_rest' }
                        },
                        {
                            id: 'mote_commune',
                            name: 'Silent Communion',
                            description: 'Through 1 minute of sustained eye contact, commune wordlessly with your mote — it returns images, emotions, and sensory impressions of what it has observed. It cannot speak, but it remembers what you forget.'
                        }
                    ],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                debuffConfig: {
                    debuffType: 'curse',
                    effects: [
                        {
                            id: 'mote_destruction',
                            name: 'Irreparable Loss',
                            description: 'If your Fetch-Mote is ever destroyed by silver weapons, Dispel Magic, or similar anti-arcane effects, permanently lose advantage from this trait. The mote reforms in 30 days. The memories it held do not. This loss cannot be reversed by any known magic.'
                        }
                    ],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                resourceCost: { actionPoints: 0, mana: 0, components: [] },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
            },
            {
                id: 'mask_bound_mimir',
                name: 'Mask-Bound',
                description: 'Your mask is not armor. It is your face, your name, your lineage, the calcified barrier between your soul and the fetch that would consume it. While worn, it anchors you against anything that would steal or read your identity. Removed by force, it briefly unmakes you.',
                level: 1,
                icon: 'spell_shadow_antimagicshell',
                spellType: 'PASSIVE',
                effectTypes: ['buff', 'debuff'],
                typeConfig: {
                    school: 'spirit',
                    secondaryElement: 'arcane',
                    icon: 'spell_shadow_antimagicshell',
                    tags: ['mask', 'identity', 'protection', 'passive', 'shared']
                },
                buffConfig: {
                    buffType: 'immunity',
                    effects: [
                        {
                            id: 'identity_anchor',
                            name: 'Identity Anchor',
                            description: 'While wearing your mask, advantage on saving throws against identity loss, mind-reading, scrying, and effects that would compel you to remove your mask. The fetch cannot be reached while the mask holds.',
                            statModifier: { stat: 'identity_saves', magnitude: 1, magnitudeType: 'advantage' }
                        }
                    ],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                debuffConfig: {
                    debuffType: 'statusEffect',
                    effects: [
                        {
                            id: 'mask_removed',
                            name: 'Forcibly Unmasked',
                            description: 'If your mask is forcibly removed by another creature, you are Stunned for 1 round and cannot use any Mimir racial traits until you recover and don the mask. If the mask is lost, you must spend 7 days in the Fog-Vales to grow a replacement from your own spore — a deeply shameful act that marks you as Maskless among your people.',
                            statusEffect: { level: 'severe', description: 'Stunned 1 round on forced unmasking. All racial traits disabled until mask recovered.' }
                        }
                    ],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                resourceCost: { actionPoints: 0, mana: 0, components: [] },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
            }
        ],
        subraces: {
            maskborne: {
                id: 'maskborne_mimir',
                name: 'Mask-Borne',
                description: 'The inheritors. Tall and poised, their heartwood masks carved with lineage patterns that record eleven generations of ancestry. Their eye-beads burn the steady amber of old flame. When they speak, their voices carry the weight of everyone who wore the mask before them — measured, deliberate, never hurried. Their bearing announces aristocracy before they enter a room. Their hands are the hands of artisans — callused from carving, stained from spore-resin, precise from centuries of inherited technique. They are the face the Mimir present to themselves: cultured, traditional, and slowly realizing their traditions are killing them.',
                culturalBackground: 'Mask-Borne society is built on lineage and craft. Every child is trained in mask-maintenance, history, and the art of reading ancestral patterns. They live in the Canopy-Holds, suspended above the fog in villages grown from living mycelium and ironwood. Their culture values permanence, tradition, and the careful preservation of knowledge. But preservation has calcified into hoarding — masks, birthing rights, political power — and the younger generation is beginning to ask what happens when the last heartwood mask cracks and no one alive remembers how to carve its replacement.',
                statModifiers: {
                    charisma: 2,
                    intelligence: 2,
                    agility: -1
                },
                traits: [
                    {
                        id: 'heartwood_lineage_maskborne',
                        name: 'Heartwood Lineage',
                        description: 'Your mask carries eleven generations of ancestral patterns legible to every Mask-Borne you meet. Among your own kind, you are known. Among the maskless, your privilege is a wall they learned to recognize before they learned to speak.',
                        level: 1,
                        icon: 'spell_holy_divinefavor',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'ancestral',
                            icon: 'spell_holy_divinefavor',
                            tags: ['social', 'lineage', 'aristocracy', 'passive']
                        },
                        buffConfig: {
                            buffType: 'combatAdvantage',
                            customDescription: '+2 to Persuasion and Insight checks with Mask-Borne NPCs. Your lineage is known and respected.',
                            effects: [
                                {
                                    id: 'lineage_persuasion',
                                    name: 'Recognized Lineage',
                                    description: '+2 to Persuasion checks with Mask-Borne NPCs. They know your ancestors.',
                                    statModifier: { stat: 'persuasion', magnitude: 2, magnitudeType: 'flat', conditions: { npcSubrace: 'maskborne' } }
                                },
                                {
                                    id: 'lineage_insight',
                                    name: 'Ancestral Insight',
                                    description: '+2 to Insight checks with Mask-Borne NPCs. You were raised reading the same social language.',
                                    statModifier: { stat: 'insight', magnitude: 2, magnitudeType: 'flat', conditions: { npcSubrace: 'maskborne' } }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'socialPenalty',
                            effects: [
                                {
                                    id: 'aristocratic_bearing',
                                    name: 'Aristocratic Bearing',
                                    description: 'Disadvantage on Deception and Stealth checks against Mist-Woven and Unwoven. Your bearing marks you before you speak.',
                                    statModifier: { stat: 'deception', magnitude: -99, magnitudeType: 'disadvantage', conditions: { npcSubrace: ['mistwoven', 'unwoven'] } }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'fog_piercing_sight_maskborne',
                        name: 'Fog-Piercing Sight',
                        description: 'Your eye-beads were calibrated for the high canopy where mist thins. You see through fog like glass. But the sun was never meant to reach your face directly, and it reminds you with every unfiltered hour.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'spirit',
                            icon: 'spell_holy_mindvision',
                            tags: ['vision', 'fog', 'darkvision', 'light-sensitivity', 'passive']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Darkvision 60ft. Can see through non-magical fog and mist without penalty. Perception checks in obscured terrain gain +2.',
                            effects: [
                                {
                                    id: 'fog_vision',
                                    name: 'Fog Sight',
                                    description: 'Darkvision 60ft. Non-magical fog and mist do not obscure your vision.',
                                    statusEffect: { level: 'moderate', description: 'See through all non-magical fog/mist. Darkvision 60ft.' }
                                },
                                {
                                    id: 'obscured_perception',
                                    name: 'Mist-Eyed',
                                    description: '+2 to Perception checks while in fog, mist, darkness, or similar obscured terrain.',
                                    statModifier: { stat: 'perception', magnitude: 2, magnitudeType: 'flat', conditions: { terrain: ['fog', 'mist', 'darkness'] } }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'light_sensitivity',
                                    name: 'Canopy-Calibrated',
                                    description: 'In bright sunlight or clear, unshaded daylight: disadvantage on sight-based Perception checks. Your eyes were never meant for this.',
                                    statusEffect: { level: 'moderate', description: 'Disadvantage on sight-based Perception in bright daylight.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'inscribed_memory_maskborne',
                        name: 'Inscribed Memory',
                        description: 'Touch your mask and let the ancestors lend you what they knew. For one hour, a skill you never learned surfaces from the carved patterns. But the ancestors do not lend without taking — when the hour ends, the memory recedes violently, taking more than it gave.',
                        level: 1,
                        icon: 'spell_arcane_arcanebrilliance',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'ancestral',
                            icon: 'spell_arcane_arcanebrilliance',
                            tags: ['ancestral', 'skill', 'memory', 'active']
                        },
                        buffConfig: {
                            buffType: 'proficiency',
                            customDescription: 'Gain proficiency in one skill of your choice for 1 hour. Once per long rest.',
                            effects: [
                                {
                                    id: 'borrowed_skill',
                                    name: 'Borrowed Proficiency',
                                    description: 'Touch your mask and consult the ancestral inscriptions. Choose one skill — gain proficiency in it for 1 hour. Once per long rest.',
                                    statusEffect: { level: 'moderate', description: 'Temporary proficiency in one chosen skill for 1 hour.' }
                                }
                            ],
                            durationValue: 1, durationType: 'hours', durationUnit: 'hours', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'curse',
                            effects: [
                                {
                                    id: 'memory_recession',
                                    name: 'Ancestral Withdrawal',
                                    description: 'After the hour ends, the borrowed knowledge recedes violently — you lose proficiency in the chosen skill and suffer disadvantage on it until you complete a long rest. The ancestors gave you a loan. Now they are collecting.',
                                    statusEffect: { level: 'severe', description: 'Disadvantage on the chosen skill until long rest.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'until_long_rest', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 1, mana: 0, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 }
                    }
                ],
                languages: ['Common', 'Vale-Speak'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 22,
                    mana: 30,
                    ap: 3,
                    passivePerception: 14,
                    swimSpeed: 10,
                    climbSpeed: 20,
                    visionRange: 60,
                    darkvision: 60,
                    initiative: 1
                },
                savingThrowModifiers: {
                    advantage: ['charm', 'identity_effects'],
                    disadvantage: ['poison']
                }
            },
            mistwoven: {
                id: 'mistwoven_mimir',
                name: 'Mist-Woven',
                description: 'The sentinels. Lean and weathered, their storm-glass masks lighter and more angular than the Mask-Borne\'s, catching static from passing clouds and glowing faintly silver. Their eye-beads burn cold blue, the color of lightning at a great distance. They move like people who have spent their lives on rope-bridges and cliff faces — balanced, economical, never a wasted motion. When they stand still, they disappear into rock. When they speak, their words are few and weighted. They are the first alert, the border guard, the ones who die so the canopy does not burn. The flaw they carry is vigilance turned inward: they see threats before they exist, and sometimes they strike before they should.',
                culturalBackground: 'Mist-Woven society is built around watchfulness and sacrifice. Every child is trained to read alarm-lines, to fight on vertical surfaces, to recognize the sound of a non-Mimir footstep on stone. Their homes are cliff-face aeries — vertical settlements where privacy comes from distance and trust comes from having fought beside someone on a rope-bridge. They value readiness, directness, and the cold clarity of a decision made before the crisis arrives. But readiness has a cost: Mist-Woven are jumpy, suspicious, and the older ones have a thousand-yard stare that unnerves even other Mimir.',
                statModifiers: {
                    agility: 2,
                    constitution: 1,
                    charisma: -1
                },
                traits: [
                    {
                        id: 'storm_glass_senses_mistwoven',
                        name: 'Storm-Glass Senses',
                        description: 'Your mask was forged from fulgurite — the glass that forms when lightning strikes mountain stone. Through it, you feel vibration through solid surfaces as if the world were a drum and you were the skin. But the same sensitivity that reads footfalls also reads thunder, and concussive force hits you like a blow to the skull.',
                        level: 1,
                        icon: 'spell_lightning_lightning',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'lightning',
                            secondaryElement: 'physical',
                            icon: 'spell_lightning_lightning',
                            tags: ['tremorsense', 'vibration', 'thunder', 'passive']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Tremorsense 30ft while touching stone, rope, or earth. You feel movement through solid surfaces.',
                            effects: [
                                {
                                    id: 'tremorsense',
                                    name: 'Tremorsense',
                                    description: 'Tremorsense 30ft while any part of your body touches stone, rope, or earth. You feel footsteps, movement, and impacts through solid surfaces.',
                                    statusEffect: { level: 'moderate', description: 'Tremorsense 30ft through stone, rope, and earth.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'thunder_shock',
                                    name: 'Sensory Overload',
                                    description: 'When you take thunder damage or are within 30ft of a loud concussive impact (explosion, avalanche, collapsing structure), you are Dazed for 1 round. Constitution save DC 14 negates. Your sensitivity cuts both ways.',
                                    statusEffect: { level: 'moderate', description: 'Dazed 1 round on thunder damage or concussion. DC 14 Constitution negates.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'rope_runner_mistwoven',
                        name: 'Rope-Runner',
                        description: 'You grew up on rope-bridges and cliff faces where a misstep is death. Your body expects the world to flex beneath you. When the ground is solid and unmoving, your balance — trained for sway and give — briefly betrays you.',
                        level: 1,
                        icon: 'ability_rogue_sprint',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'physical',
                            icon: 'ability_rogue_sprint',
                            tags: ['mobility', 'climbing', 'acrobatics', 'passive']
                        },
                        buffConfig: {
                            buffType: 'movementBuff',
                            customDescription: '+20ft climb speed. Advantage on Acrobatics checks for balance, narrow surfaces, and rope-work.',
                            effects: [
                                {
                                    id: 'climb_speed',
                                    name: 'Cliff-Trained',
                                    description: '+20ft climb speed. Advantage on Acrobatics checks involving balance, narrow surfaces, and rope-work.',
                                    statModifier: { stat: 'climb_speed', magnitude: 20, magnitudeType: 'flat' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'solid_ground_disorientation',
                                    name: 'Stone-Sick',
                                    description: 'The first round of any combat that begins while you stand on solid, flat ground (cobblestone, dungeon floor, solid earth): you are Off-Guard until the end of your first turn as your body recalibrates to surfaces that do not move.',
                                    statusEffect: { level: 'minor', description: 'Off-Guard for first round of combat on solid flat ground.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'first_alert_mistwoven',
                        name: 'First-Alert',
                        description: 'You were raised to see threats before they see you. In fog and shadow, nothing surprises you. But the instinct that keeps you alive does not have an off-switch — it cannot tell an ally\'s sudden movement from an enemy\'s lunge.',
                        level: 1,
                        icon: 'ability_rogue_findweakness',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'spirit',
                            icon: 'ability_rogue_findweakness',
                            tags: ['initiative', 'vigilance', 'friendly-fire', 'passive']
                        },
                        buffConfig: {
                            buffType: 'combatAdvantage',
                            customDescription: '+3 Initiative. Cannot be surprised while in fog, mist, darkness, or similar obscured terrain.',
                            effects: [
                                {
                                    id: 'alert_initiative',
                                    name: 'Sentinel Alertness',
                                    description: '+3 Initiative. Cannot be surprised while in fog, mist, darkness, or similar obscured terrain.',
                                    statModifier: { stat: 'initiative', magnitude: 3, magnitudeType: 'flat' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'jumpy_reflex',
                                    name: 'Jumpy',
                                    description: 'When an ally moves into or starts their turn within 5ft of you, make a DC 12 Spirit save. On failure, you must spend your reaction (if available) to make a single melee attack at disadvantage against that ally. You are not in control of this reflex. The GM decides when it triggers.',
                                    statusEffect: { level: 'moderate', description: 'May reflexively attack allies who move adjacent. Spirit DC 12 to suppress.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    }
                ],
                languages: ['Common', 'Vale-Speak'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 26,
                    mana: 20,
                    ap: 4,
                    passivePerception: 16,
                    swimSpeed: 10,
                    climbSpeed: 30,
                    visionRange: 60,
                    darkvision: 30,
                    initiative: 4
                },
                savingThrowModifiers: {
                    advantage: ['fear'],
                    disadvantage: ['thunder', 'charm']
                }
            },
            unwoven: {
                id: 'unwoven_mimir',
                name: 'The Unwoven',
                description: 'The floor-folk. Their masks are composite — fragments of heartwood, storm-glass, and older pieces that predate the Rupture, lashed together with spore-silk into something functional but visibly wrong. No two Unwoven masks look alike. Their eye-beads flicker between colors as borrowed fragments compete for dominance — amber one moment, cold blue the next, then a brief flash of a shade no living mask has worn in three hundred years. They move like people who have learned to navigate by senses other than sight. They smell of the deep floor: rich rot, old spore, the fungal sweetness of decay turning into something new. The flaw they carry is the weight of what they have absorbed — every fragment whispers, every stolen memory fights for airtime, and the Unwoven who has not learned to manage the voices is already on their way to becoming something else.',
                culturalBackground: 'Unwoven society is improvised and adaptive. They drift with spore-blooms and fungus cycles, building temporary shelters from cap-flesh that decay within weeks. Their culture is oral and shared — every Unwoven knows fragments of everyone else\'s history, because their composite masks absorb pieces of each other over time. They value survival, adaptability, and the knowledge that grows in the deep floor where no Mask-Borne or Mist-Woven would dare to walk. But adaptability has a dark side: the Unwoven are changing faster than the other subraces, absorbing more, becoming less Mimir and more something the Vales itself is inventing. The eldest Unwoven are barely recognizable as Mimir at all.',
                statModifiers: {
                    constitution: 2,
                    spirit: 1,
                    charisma: -2
                },
                traits: [
                    {
                        id: 'floor_touched_unwoven',
                        name: 'Floor-Touched',
                        description: 'The deep fog has saturated your spore. Your body treats poison like an old acquaintance and disease like a language it already speaks. But the floor clings to you — animals know what you carry, and they want no part of it.',
                        level: 1,
                        icon: 'spell_nature_poison',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'poison',
                            secondaryElement: 'nature',
                            icon: 'spell_nature_poison',
                            tags: ['poison', 'disease', 'scent', 'animals', 'passive']
                        },
                        buffConfig: {
                            buffType: 'immunity',
                            customDescription: 'Resistance to poison damage. Advantage on saving throws against disease and poison effects.',
                            effects: [
                                {
                                    id: 'poison_resistance',
                                    name: 'Poison Resistance',
                                    description: 'Resistance to poison damage.',
                                    statusEffect: { level: 'moderate', description: '50% poison damage resistance.' }
                                },
                                {
                                    id: 'disease_resistance',
                                    name: 'Floor-Hardened',
                                    description: 'Advantage on saving throws against disease and poison effects. The floor has already exposed you to worse.',
                                    statModifier: { stat: 'poison_disease_saves', magnitude: 1, magnitudeType: 'advantage' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'curse',
                            effects: [
                                {
                                    id: 'floor_scent',
                                    name: 'The Floor Clings',
                                    description: 'Animals become hostile or flee at the GM\'s discretion. Creatures with scent-based perception detect you at twice the normal range. You cannot mask your scent by normal means — the floor\'s rot is in your spore.',
                                    statusEffect: { level: 'moderate', description: 'Animals hostile. Scent detection range doubled against you.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'patchwork_mask_unwoven',
                        name: 'Patchwork Mask',
                        description: 'Your composite mask hungers for fragments. When you defeat someone, you can take a sliver of what they were. But every stolen fragment comes with a voice, and voices that do not belong to you do not stay quiet for long.',
                        level: 1,
                        icon: 'spell_shadow_deathcoil',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'psychic',
                            secondaryElement: 'necrotic',
                            icon: 'spell_shadow_deathcoil',
                            tags: ['harvest', 'skill', 'fragments', 'passive']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'After personally defeating a humanoid enemy, spend 10 minutes to harvest a fragment. Gain +1 to one skill that enemy was proficient in. One active fragment at a time. Fades on long rest.',
                            effects: [
                                {
                                    id: 'fragment_harvest',
                                    name: 'Fragment Harvest',
                                    description: 'When you defeat a humanoid enemy, spend 10 minutes to harvest a fragment of their identity into your mask. Gain +1 to one skill they were proficient in. One active fragment at a time.',
                                    statModifier: { stat: 'harvested_skill', magnitude: 1, magnitudeType: 'flat', conditional: 'one_fragment_active' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'until_long_rest', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'curse',
                            effects: [
                                {
                                    id: 'fragment_whispers',
                                    name: 'Fragment Whispers',
                                    description: 'After harvesting a fragment, suffer disadvantage on Spirit saving throws until your next long rest. The stolen voice competes with your own thoughts. It is not grateful. It is not quiet.',
                                    statusEffect: { level: 'moderate', description: 'Disadvantage on Spirit saves while a harvested fragment is active.' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                    },
                    {
                        id: 'spore_trail_reading_unwoven',
                        name: 'Spore-Trail Reading',
                        description: 'The floor records everything that passes. By touching the ground and concentrating, you can read what walked here before you — who, which direction, and what they were feeling. But the floor in crowded places is an ocean of overlapping voices, and trying to listen to all of them at once will drown you.',
                        level: 1,
                        icon: 'ability_rogue_track',
                        spellType: 'ACTION',
                        effectTypes: ['utility', 'debuff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'psychic',
                            icon: 'ability_rogue_track',
                            tags: ['tracking', 'spore', 'divination', 'active']
                        },
                        utilityConfig: {
                            utilityType: 'perception',
                            selectedEffects: [
                                {
                                    id: 'trail_read',
                                    name: 'Read the Spore',
                                    description: 'Concentrate for 1 minute on a patch of ground or surface. Learn the number of creatures that passed through within 24 hours, their direction of travel, and one dominant emotion each was feeling. Works on any surface that has been exposed to open air.'
                                }
                            ],
                            duration: 0, durationUnit: 'instant', power: 'moderate'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'trail_overwhelm',
                                    name: 'Crowd Drowning',
                                    description: 'Attempting to read spore-trails in a settlement or location with more than 50 inhabitants deals 1d6 psychic damage and yields only confused, useless fragments. The floor cannot distinguish individuals when too many have spoken over each other.',
                                    statusEffect: { level: 'moderate', description: 'Overwhelming in crowds — 1d6 psychic, no useful information.' }
                                }
                            ],
                            durationValue: 0, durationType: 'conditional', durationUnit: 'on_crowded_read', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 1, mana: 0, components: ['somatic'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                    }
                ],
                languages: ['Common', 'Vale-Speak'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 30,
                    mana: 18,
                    ap: 3,
                    passivePerception: 14,
                    swimSpeed: 10,
                    climbSpeed: 15,
                    visionRange: 50,
                    darkvision: 30,
                    initiative: 0
                },
                savingThrowModifiers: {
                    advantage: ['poison', 'disease'],
                    disadvantage: ['radiant']
                }
            }
        }
};
