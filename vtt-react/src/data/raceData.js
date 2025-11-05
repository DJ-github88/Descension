/**
 * Race Data Module
 * 
 * Defines all playable races and their subraces with complete mechanical data
 * including stat modifiers, racial traits, languages, lifespans, and movement speeds.
 */

// Base race definitions with their subraces
export const RACE_DATA = {
    nordmark: {
        id: 'nordmark',
        name: 'Nordmark',
        description: 'Iron-willed descendants of the frozen northlands where winter never dies',
        icon: 'fas fa-mountain',
        overview: 'The Nordmark are battered survivors of endless winters, their skin cracked like old leather from the biting cold, their eyes carrying the weight of too many harsh seasons. They tell tales of ancient kings who made pacts with the frozen earth itself, but such stories are told in hushed tones around dying fires. The Nordmark don\'t conquer the wilds - they endure them, becoming as unyielding as the mountains they call home.',
        culturalBackground: `Nordmark culture is forged in the crucible of endless winter, where every breath carries the sting of frost and every shadow hides starvation. Their sagas speak of warrior-kings who bound themselves to the old gods of ice and storm, trading pieces of their souls for the strength to survive. Honor is a cold comfort when the winds howl through cracked huts, and glory means little when frostbite claims fingers and toes. Nordmark are born warriors not by choice, but necessity - the weak don't survive their first winter. Their pride is a brittle thing, quick to shatter into violence, for in the frozen north, mercy is a luxury few can afford. They speak of glorious deaths in battle, but most Nordmark die quietly in the dark, their bodies claimed by the very land they fought to tame.`,
        variantDiversity: 'The Nordmark have developed into distinct variants, each adapted to different circumstances and lifestyles: Berserker Nordmark embrace the fury of battle above all else, Skald Nordmark preserve ancient sagas and inspire others, and Icewalker Nordmark have adapted to the harshest frozen wastes.',
        integrationNotes: {
            actionPointSystem: 'Many racial traits interact with the AP system, providing unique tactical options during combat and exploration. Each variant offers different AP-based abilities.',
            backgroundSynergy: 'Consider how your chosen variant\'s traits complement your background path. Different variants may synergize better with specific backgrounds.',
            classCompatibility: 'While any variant can pursue any class, certain racial traits may enhance specific class features or playstyles. Choose your variant based on your intended build.'
        },
        meaningfulTradeoffs: 'Each variant has both strengths and weaknesses. Consider the disadvantages as much as the benefits when making your choice.',
        baseTraits: {
            languages: ['Common', 'Old Nord', 'Runic'],
            lifespan: '80-120 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            berserker: {
                id: 'berserker_nordmark',
                name: 'Bloodaxe',
                description: 'Named for axes stained with the blood of endless battles, these warriors channel the relentless fury of northern winters into combat prowess that borders on the supernatural.',
                culturalBackground: 'The storm-bringers of the frozen wastes, these warriors embody the raw fury of northern blizzards. They claim the bloodaxe calls to them during the aurora, when the sky bleeds like a wounded god. Bloodaxe warriors paint their axes with the blood of worthy foes, believing each stain binds a piece of the enemy\'s spirit to their weapon. They fight with berserk rage that borders on possession, their eyes glowing with unnatural light during battle. But this power exacts a terrible toll - many Bloodaxe become hollow shells after combat, haunted by the faces of the slain. They form the backbone of Nordmark warbands, feared for their unpredictability and unmatched ferocity in close combat.',
                statModifiers: {
                    constitution: 3,
                    strength: 3,
                    agility: -1,
                    intelligence: -2,
                    spirit: 1,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Frostborn',
                        description: 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. You can survive in arctic conditions without shelter, but your breath creates visible frost even in warm climates, making stealth difficult.',
                        type: 'environmental'
                    },
                    {
                        name: 'Battle Fury',
                        description: 'When reduced to half hit points, enter a berserker rage (1 AP). Gain +3 damage to all attacks but take -3 to Armor and cannot cast spells for 1 minute. Once per long rest.',
                        type: 'combat'
                    },
                    {
                        name: 'Reckless Courage',
                        description: 'Immunity to fear effects, but you must make a Spirit save (DC 15) to retreat from combat or avoid a direct challenge. Your bloodlust makes tactical withdrawal nearly impossible.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30
            },
            skald: {
                id: 'skald_nordmark',
                name: 'Runescar',
                description: 'Known for runes carved into flesh during brutal vision quests, these scarred lore-keepers preserve ancient sagas that echo with the voices of forgotten gods and doomed kings.',
                culturalBackground: 'Marked by runes carved into living flesh during brutal vision quests in the endless night, these scarred lore-keepers bear the weight of their people\'s history on their very skin. Each rune tells a story of blood and betrayal, etched with bone needles during trances that last days in frozen caves. Runescar voices carry echoes of ancient kings and forgotten gods, their words capable of rallying the hopeless or breaking the strongest will. They commune with the spirits of the ice and storm, trading pieces of their sanity for glimpses of futures that claw at their minds. A Runescar\'s scars glow faintly during winter nights, pulsing like heartbeats as they recite sagas that hold their people together. They are both blessed and cursed - their prophecies can inspire legends or awaken nightmares that consume listeners\' dreams.',
                statModifiers: {
                    constitution: 1,
                    strength: -1,
                    agility: -1,
                    intelligence: 2,
                    spirit: 3,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Frostborn',
                        description: 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. You can survive in arctic conditions without shelter, but your breath creates visible frost even in warm climates, making stealth impossible in warm areas. You take +50% damage from fire attacks due to your frozen nature.',
                        type: 'environmental'
                    },
                    {
                        name: 'Inspiring Saga',
                        description: 'You can recite ancient sagas to inspire allies (2 AP). All allies within 30 feet gain advantage on their next attack or save. Once per short rest, but you MUST speak loudly (alerting all enemies within 120 feet) and cannot stop mid-recitation - if interrupted, you take 1d6 psychic damage from the broken saga.',
                        type: 'support'
                    },
                    {
                        name: 'Ancestral Memory',
                        description: 'You have advantage on History checks and can recall ancient lore, but you are COMPELLED to share these stories at length whenever the topic arises. You cannot make brief responses - must tell the full story (taking at least 1 minute), giving disadvantage on stealth group checks and often revealing information you meant to keep secret.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30
            },
            icewalker: {
                id: 'icewalker_nordmark',
                name: 'Ironfrost',
                description: 'Their flesh hardened by endless cold like living permafrost, these survivors of the deepest winters carry the chill of ancient glaciers in their very blood and breath.',
                culturalBackground: 'The true children of winter, these survivors have been claimed by the endless cold, their flesh hardening like permafrost that never thaws. They walk paths where others perish, surviving on frost-rimed berries and the flesh of creatures frozen mid-stride. Their skin cracks and bleeds in summer\'s false warmth, revealing the blue-black ice beneath that betrays their true nature. Ironfrost speak of the Deep Frost, an ancient entity that offers survival at the cost of warmth itself. They serve as scouts and guardians in the deepest wastes, their presence a constant reminder that some Nordmark belong more to the storm than to their own kind. Many Ironfrost vanish into blizzards, their bodies eventually indistinguishable from the ice formations they so resemble.',
                statModifiers: {
                    constitution: 4,
                    strength: 0,
                    agility: -1,
                    intelligence: -1,
                    spirit: 2,
                    charisma: -3
                },
                traits: [
                    {
                        name: 'Deep Frost',
                        description: 'Immunity to cold damage and exhaustion from harsh weather. You can survive in arctic conditions indefinitely, but you take vulnerability to fire damage and have disadvantage on saves against heat effects.',
                        type: 'environmental'
                    },
                    {
                        name: 'Ice Walk',
                        description: 'You can walk on ice and snow without slipping and leave no tracks in frozen terrain. However, you move at half speed on warm ground and take 1 point of damage per hour in temperatures above 70°F.',
                        type: 'mobility'
                    },
                    {
                        name: 'Frozen Heart',
                        description: 'You have advantage on saves against charm and emotion effects, but you have disadvantage on all Charisma-based social interactions due to your cold, distant demeanor.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30
            }
        }
    },

    corvani: {
        id: 'corvani',
        name: 'Corvani',
        description: 'Raven-marked folk from fog-choked mountains, their eyes seeing things others miss',
        icon: 'fas fa-crow',
        overview: 'The Corvani haunt the fog-wreathed peaks where the world grows thin and strange, their raven-black markings shifting like living shadows across weathered skin. They speak of seeing the threads of fate tangled in the mist, of hearing whispers that drive lesser folk mad. Most dismiss them as superstitious hill folk, but those who\'ve traveled the high paths know better - the Corvani see things that shouldn\'t be seen, and sometimes, those things see them back.',
        culturalBackground: `Corvani villages cling to mist-shrouded peaks like barnacles on a storm-tossed ship, their thatched roofs sagging under the weight of endless fog. The markings on their skin aren't just tattoos - they shift and darken with each glimpse of the other side, each whispered prophecy that costs a piece of the seer's sanity. They trade in secrets and warnings, their "gifts" more curse than blessing. A Corvani child who dreams too vividly might wake screaming about fires that haven't happened yet, or paths that lead to unmarked graves. Their elders speak of the old bargains made with things that wear raven shapes, promises extracted in exchange for survival in these forsaken heights. Most folk avoid Corvani paths after dark, and those who seek their counsel pay in coin, blood, or pieces of their own fate.`,
        variantDiversity: 'The Corvani have diverged into two primary paths: Oracle Corvani who embrace their prophetic gifts and peer deep into fate\'s threads, and Scout Corvani who use their connection to the mists for swift navigation and communication across treacherous terrain.',
        integrationNotes: {
            actionPointSystem: 'Corvani abilities often involve perception, divination, and mobility, offering unique tactical advantages in information gathering and positioning.',
            backgroundSynergy: 'Corvani excel in backgrounds that emphasize wisdom, perception, and supernatural connections. Their prophetic abilities complement mystical and spiritual paths.',
            classCompatibility: 'Corvani make excellent spellcasters, scouts, and support characters. Their perception bonuses and divination abilities enhance classes that rely on information and foresight.'
        },
        meaningfulTradeoffs: 'Corvani variants gain powerful perception and divination abilities but often suffer from physical frailty or vulnerability to specific damage types. Their gifts come with compulsions and drawbacks.',
        baseTraits: {
            languages: ['Common', 'Corvid'],
            lifespan: '90-110 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            oracle: {
                id: 'oracle_corvani',
                name: 'Ravenmark',
                description: 'Marked by shifting raven-black patterns that foretell futures, these seers glimpse fate\'s threads in mist and storm, their visions both blessing and curse.',
                culturalBackground: 'Bearers of the raven\'s gift of foresight, these marked seers peer deep into fate\'s tangled threads, their black markings shifting like smoke as they glimpse futures that claw at their sanity. They see the threads of fate woven through mist and storm, visions that come unbidden during tempest nights or the quiet hours before dawn. A Ravenmark\'s eyes darken to pure black when the sight takes them, their voices carrying echoes of things that haven\'t happened yet. They trade in prophecies and warnings, but each vision chips away at their grip on reality. Children born with the ravenmark are feared and revered, for they might predict a village\'s doom or guide a lost caravan through treacherous paths. But the gift demands payment - nightmares of alternate lives, the weight of choices never made. Many Ravenmark lose themselves to the mist, becoming wandering prophets who speak only in riddles and raven calls, their forms fading into the fog that birthed their visions.',
                statModifiers: {
                    constitution: -2,
                    strength: -2,
                    agility: 1,
                    intelligence: 3,
                    spirit: 4,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Prophetic Vision',
                        description: 'Once per long rest, can glimpse the future to reroll any d20 roll (yours or an ally\'s) within 60 feet. However, seeing the future is physically taxing - you take 1d4 psychic damage and gain disadvantage on Constitution saves for 1 hour after using this ability.',
                        type: 'divination'
                    },
                    {
                        name: 'Raven Sight',
                        description: 'Can see through illusions and detect hidden creatures within 30 feet, but you suffer -2 to Constitution saves against disease and poison. Your eyes are constantly strained from seeing multiple layers of reality - you have disadvantage on Perception checks in bright light.',
                        type: 'perception'
                    },
                    {
                        name: 'Fate\'s Warning',
                        description: 'Allies within 30 feet gain +1 Armor against the first attack each round, but you take 2 psychic damage (not 1) when they\'re hit. You feel their pain as your own - when an ally is critically hit, you must make a Spirit save (DC 15) or be stunned for 1 round.',
                        type: 'protection'
                    }
                ],
                languages: ['Common', 'Corvid', 'Ethereal'],
                speed: 30
            },
            scout: {
                id: 'scout_corvani',
                name: 'Fogbound',
                description: 'Bound to eternal mist that guides their steps through impossible paths, these guides navigate fog-shrouded peaks where the world grows thin and strange.',
                culturalBackground: 'Bound eternally to the mist that guides their steps through impossible paths, these guides navigate fog-shrouded peaks where the world grows thin and strange. They carry messages through territories where maps fail and compasses spin madly, guided by instincts that border on the uncanny. A Fogbound\'s eyes pierce fog that blinds others, seeing paths that shouldn\'t exist and hearing whispers that carry for miles. But the mist takes its toll - prolonged exposure leaves them disoriented, seeing ghosts in the fog or hearing voices that aren\'t there. They serve as messengers and guides, but their reliability is questioned, for who can trust someone who walks between worlds? Many Fogbound vanish into particularly thick banks of mist, leaving behind only raven feathers and the echo of footsteps that fade into nothing. They speak of the fog as a living entity that chooses its own, binding itself to their blood in exchange for the ability to navigate its endless paths.',
                statModifiers: {
                    constitution: 0,
                    strength: -1,
                    agility: 4,
                    intelligence: 2,
                    spirit: 2,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Highland Navigation',
                        description: 'Cannot become lost in natural terrain and can move at full speed through difficult terrain.',
                        type: 'movement'
                    },
                    {
                        name: 'Raven Messenger',
                        description: 'Can send messages via ravens to any location you\'ve visited, but messages can be intercepted by those who speak Corvid.',
                        type: 'communication'
                    },
                    {
                        name: 'Mist Walker',
                        description: 'Can become partially incorporeal for 1 round (resistant to bludgeoning, piercing, and slashing damage - takes half damage), but become vulnerable to radiant damage (takes double damage) for 1 minute.',
                        type: 'defense'
                    }
                ],
                languages: ['Common', 'Corvid', 'Sylvan'],
                speed: 35
            }
        }
    },

    grimheart: {
        id: 'grimheart',
        name: 'Grimheart',
        description: 'Hardened miners whose bodies have grown unnaturally tough from years in the deep earth',
        icon: 'fas fa-hammer',
        overview: 'The Grimheart are the broken remnants of miners who dug too greedily and too deep, their flesh slowly turning to unyielding stone as punishment for their hubris. They speak in gravelly voices of the things they woke in the deep dark, ancient hungers that still call to them in fever dreams. Most Grimheart live with the constant temptation to return to the mines, to keep digging until their bodies finally match the stone they\'ve become. They\'re master craftsmen because they must be - the earth demands perfection from those it claims.',
        culturalBackground: `Grimheart settlements are built around sinkholes and abandoned mines, their stone houses carved from the same rock that slowly claims their flesh. The transformation is agonizing and slow - first the skin roughens like pumice, then the bones grow heavy, and finally the heart itself begins to beat with the slow rhythm of the deep earth. They speak of the Old Dark, ancient things that sleep beneath the mountains, woken by foolish greed. A Grimheart child might show the first signs during adolescence: skin that doesn't bleed when cut, a voice that echoes strangely in caverns. Their craftsmen are unmatched because the earth itself guides their hands, demanding perfection or crushing failure. But the whispers never stop - the call to dig deeper, to find what should remain buried. Many Grimheart disappear into the mines one final time, their bodies eventually indistinguishable from the stone around them.`,
        variantDiversity: 'Grimheart variants reflect different responses to their curse: Delver Grimheart embrace the obsession and dig ever deeper, Forgemaster Grimheart channel their compulsion into crafting, and Stoneward Grimheart resist the whispers and protect others from the deep.',
        integrationNotes: {
            actionPointSystem: 'Grimheart abilities focus on durability, crafting, and earth manipulation. Their stone-like nature provides defensive options but limits mobility.',
            backgroundSynergy: 'Grimheart work well with backgrounds emphasizing crafting, endurance, and physical prowess. Their obsessive nature can complement dedicated specialist paths.',
            classCompatibility: 'Grimheart excel as tanks, crafters, and earth-based casters. Their high constitution and defensive abilities make them natural frontliners, though their reduced speed requires tactical positioning.'
        },
        meaningfulTradeoffs: 'Grimheart gain exceptional durability and crafting abilities but suffer from reduced speed, mental compulsions, and social penalties. Their curse is both blessing and burden.',
        baseTraits: {
            languages: ['Common', 'Terran'],
            lifespan: '180-220 years',
            baseSpeed: 25,
            size: 'Medium'
        },
        subraces: {
            delver: {
                id: 'delver_grimheart',
                name: 'Earthscar',
                description: 'Scarred by endless digging into forbidden depths, these miners hear the earth\'s ancient whispers promising treasures and secrets buried in stone.',
                culturalBackground: 'Consumed by the endless hunger to dig deeper into forbidden depths, these miners hear the earth\'s ancient whispers promising treasures and secrets buried in stone. Their stone-hardened flesh cracks as they burrow into places where the mountain\'s blood still flows, their tools fused with rock that grows from their own bodies. The deeper they go, the more the earth claims them - skin turning to granite, eyes adapting to darkness that blinds surface dwellers. An Earthscar\'s dreams are filled with tunnels that go on forever, of being buried alive in the rock they love. They are master miners because the earth itself teaches them, but they can never stop digging, never return to the surface for long. Many vanish into sinkholes that appear overnight, following whispers that lead to places no one returns from. The earth sings to them constantly, a siren\'s call that drowns out all other voices.',
                statModifiers: {
                    constitution: 4,
                    strength: 3,
                    agility: -2,
                    intelligence: 1,
                    spirit: -2,
                    charisma: -3
                },
                traits: [
                    {
                        name: 'Earth Whispers',
                        description: 'Can sense valuable minerals and hidden passages within 60 feet, but hear constant whispers that impose disadvantage on Wisdom saves.',
                        type: 'detection'
                    },
                    {
                        name: 'Stone Skin',
                        description: 'Natural armor provides +2 Armor, but movement speed reduced by 5 feet.',
                        type: 'defense'
                    },
                    {
                        name: 'Deep Delving',
                        description: 'Can tunnel through stone at half movement speed, but become obsessed with digging and must make Wisdom saves to stop.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Terran', 'Undercommon'],
                speed: 25
            },
            warden: {
                id: 'warden_grimheart',
                name: 'Stoneblood',
                description: 'Their blood runs thick as cooling magma through stone-hardened veins, these guardians stand as living fortifications against the horrors awakened by their kin.',
                culturalBackground: 'Their blood runs thick as cooling magma through stone-hardened veins, these guardians stand as living fortifications against the horrors awakened by their kin. They bear the weight of their people\'s sins, protecting settlements from the things that crawl up from deep places. Their hearts beat with the rhythm of distant earthquakes, their skin as unyielding as the mountains they guard. A Stoneblood can stand unmoving for days, their stone flesh resisting blades and claws that would fell lesser warriors. But they hear the same whispers as their Earthscar kin - calls to return to the depths, to abandon the surface world entirely. They serve as wardens and protectors, but their presence is a constant reminder of what lies beneath. Many Stoneblood eventually succumb to the call, walking into caves that collapse behind them, becoming part of the very earth they once protected others from.',
                statModifiers: {
                    constitution: 3,
                    strength: 1,
                    agility: -2,
                    intelligence: 0,
                    spirit: 3,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Guardian\'s Resolve',
                        description: 'Can absorb damage intended for allies within 10 feet, but take +50% of the absorbed damage.',
                        type: 'protection'
                    },
                    {
                        name: 'Deep Sight',
                        description: 'Darkvision 120 feet and can see through magical darkness, but bright light causes disadvantage on attack rolls.',
                        type: 'perception'
                    },
                    {
                        name: 'Stone Ward',
                        description: 'Can create protective stone barriers, but each use drains 1 point of Constitution until long rest.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Terran', 'Primordial'],
                speed: 25
            },
            mountaindwarf: {
                id: 'mountaindwarf_grimheart',
                name: 'Forgeborn',
                description: 'Born of volcanic forges where stone curse meets geothermal fire, these artisans shape metal with precision that borders on the unnatural, their creations echoing the deep earth.',
                culturalBackground: 'Born of volcanic forges where stone curse meets geothermal fire, these artisans shape metal with precision that borders on the unnatural, their creations echoing the deep earth. They work tirelessly in cavern workshops where the mountain\'s heat meets their inner fire, crafting weapons and armor that carry whispers of the depths. A Forgeborn\'s touch can heat metal to impossible temperatures, their stone skin conducting energies that lesser smiths can only dream of. But the fire within demands constant feeding - they must create or be consumed by it. Their workshops are places of wonder and terror, filled with glowing runes that shouldn\'t exist and tools that seem to move on their own. Many Forgeborn disappear during particularly ambitious projects, their bodies eventually indistinguishable from the masterworks they leave behind. They are both blessed and cursed artisans, their creations carrying pieces of the makers\' souls and the earth\'s ancient fury.',
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: -2,
                    intelligence: 1,
                    spirit: 2,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Mountain Born',
                        description: 'Acclimated to high altitude and resistant to cold. Advantage on saves against altitude sickness and cold weather.',
                        type: 'resistance'
                    },
                    {
                        name: 'Dwarven Resilience',
                        description: 'Advantage on saving throws against poison and resistance to poison damage.',
                        type: 'resistance'
                    },
                    {
                        name: 'Stonecunning',
                        description: 'Whenever you make an Intelligence check related to the origin of stonework, you are considered proficient and add double your proficiency bonus.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Dwarvish', 'Terran'],
                speed: 25
            }
        }
    },

    veilborn: {
        id: 'veilborn',
        name: 'Veilborn',
        description: 'Pale wanderers from forgotten border regions, their skin never tanning no matter the sun',
        icon: 'fas fa-ghost',
        overview: 'The Veilborn drift through border regions like ghosts in their own bodies, their pale skin translucent enough to see the veins pulsing beneath. They speak of thin places where the world wears away, of seeing shapes that move just out of sight. Most folk cross themselves when Veilborn pass, whispering about how their shadows sometimes seem to walk alone. The Veilborn don\'t choose their gifts - they\'re born with them, and the weight of what they can see ages them before their time.',
        culturalBackground: `Veilborn nomads follow the thin places, never settling long in one spot lest the veil thicken and trap them. Their camps are silent affairs, lit by pale lanterns that cast no heat. Children are taught from birth to recognize the signs: the way mist lingers too long, how shadows sometimes have their own shadows, the chill that settles in bones when something unseen watches. A Veilborn might wake screaming from dreams of drowning in mist, or spend days staring at nothing while their mind walks paths no other can see. They serve as guides for the dead and mediators for the restless, but their services come at a price - a touch of warmth from their cold hands, a moment of peace from their haunted eyes. Most folk avoid Veilborn, for they bring the other side with them wherever they go.`,
        variantDiversity: 'Veilborn variants reflect different relationships with the ethereal: Medium Veilborn communicate with spirits and serve as intermediaries, while Walker Veilborn traverse between planes and explore the boundaries of reality.',
        integrationNotes: {
            actionPointSystem: 'Veilborn abilities focus on perception, communication with otherworldly entities, and brief planar transitions. Their ethereal nature provides unique utility and defensive options.',
            backgroundSynergy: 'Veilborn excel in backgrounds emphasizing wisdom, spirituality, and supernatural knowledge. Their connection to other planes complements mystical and divine paths.',
            classCompatibility: 'Veilborn make excellent clerics, mediums, and support casters. Their ability to perceive hidden threats and communicate with spirits provides valuable party utility.'
        },
        meaningfulTradeoffs: 'Veilborn gain powerful perception and planar abilities but suffer from physical frailty and mental strain from constant exposure to multiple realities. Their gifts can be overwhelming.',
        baseTraits: {
            languages: ['Common', 'Ethereal'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            medium: {
                id: 'medium_veilborn',
                name: 'Whisperkin',
                description: 'They hear whispers from beyond the veil, their pale forms serving as conduits for restless spirits and entities that drift through thin places between worlds.',
                culturalBackground: 'They hear whispers from beyond the veil, their pale forms serving as conduits for restless spirits and entities that drift through thin places between worlds. A Whisperkin\'s voice carries unnatural echoes, making normal conversation unsettling to those who listen. They speak with the dead and wandering spirits, negotiating bargains that leave both sides changed. Children born as Whisperkin often speak to empty rooms for hours, learning the names of things that don\'t exist in our world. Their pale skin grows paler with each spirit they converse with, their eyes darkening until they reflect only what lies beyond. Many Whisperkin eventually fade entirely, becoming bridges rather than people, their forms lingering as warnings to those who would bargain with the other side. They are mediators between the living and unseen, but each conversation chips away at their own humanity, leaving them more ghost than person.',
                statModifiers: {
                    constitution: -2,
                    strength: -2,
                    agility: 1,
                    intelligence: 2,
                    spirit: 4,
                    charisma: 3
                },
                traits: [
                    {
                        name: 'Spirit Communication',
                        description: 'Can speak with spirits and undead, gaining valuable information, but spirits may demand favors or become hostile. You cannot refuse a spirit\'s request once communication begins - failing to complete their task causes 2d6 psychic damage and disadvantage on all rolls for 24 hours. Spirits are drawn to you - random encounters with undead/spirits are 3x more likely.',
                        type: 'communication'
                    },
                    {
                        name: 'Ethereal Sight',
                        description: 'Can see into the Ethereal Plane and detect invisible creatures, but suffer constant visions that impose -2 to Perception in combat and -1 to all attack rolls (you see too many layers of reality). In areas with strong spiritual activity, you must make Spirit saves (DC 12) each round or be frightened by the overwhelming visions.',
                        type: 'perception'
                    },
                    {
                        name: 'Spiritual Guidance',
                        description: 'Once per day, can ask spirits for guidance on a decision, gaining advantage on next ability check, but you MUST follow their advice exactly or suffer a curse that causes disadvantage on all rolls of that type for 1 week. The spirits are not always benevolent - their advice may lead you into danger.',
                        type: 'divination'
                    }
                ],
                languages: ['Common', 'Ethereal', 'Celestial'],
                speed: 30
            },
            walker: {
                id: 'walker_veilborn',
                name: 'Shadowstep',
                description: 'Bound to the shadows that walk alone, these Veilborn move like ghosts through the world, their forms blurring at the edges where reality wears thin.',
                culturalBackground: 'Bound to the shadows that walk alone, these Veilborn move like ghosts through the world, their forms blurring at the edges where reality wears thin. They step through darkness that shouldn\'t exist, guided by instincts that border on the predatory. A Shadowstep\'s presence makes shadows deeper, their footsteps silent on stone that should echo. But the darkness takes its toll - prolonged time in shadows leaves them disoriented, seeing shapes in the dark that aren\'t there, hearing voices that whisper secrets they wish they hadn\'t learned. They serve as unseen messengers and thieves, but their reliability is questioned, for who can trust someone who walks between worlds? Many Shadowstep vanish into particularly deep shadows, leaving behind only a chill and the faint outline of a form that fades into nothing. They speak of the darkness as a living thing that chooses its own, binding itself to their blood in exchange for the ability to navigate its endless depths.',
                statModifiers: {
                    constitution: -1,
                    strength: -1,
                    agility: 3,
                    intelligence: 3,
                    spirit: 3,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Plane Shift',
                        description: 'Can briefly step into the Ethereal Plane to avoid attacks (once per short rest), but risk getting lost between planes.',
                        type: 'movement'
                    },
                    {
                        name: 'Reality Anchor',
                        description: 'Immune to forced planar travel and can stabilize dimensional rifts, but you are vulnerable to force damage (take double damage from force attacks).',
                        type: 'utility'
                    },
                    {
                        name: 'Veil Walker',
                        description: 'Can phase through walls for 1 round (once per long rest), but become vulnerable to all damage types (take double damage from all sources) for 1 minute afterward as your form struggles to fully rematerialize.',
                        type: 'movement'
                    }
                ],
                languages: ['Common', 'Ethereal', 'Abyssal'],
                speed: 30
            }
        }
    },

    mirrorkin: {
        id: 'mirrorkin',
        name: 'Mirrorkin',
        description: 'Wanderers with fluid identities, their features shifting with the shadows and light',
        icon: 'fas fa-mask',
        overview: 'The Mirrorkin are tragic shapeshifters who have lost their original forms. They exist as blank slates, able to copy others but never truly themselves. Each transformation chips away at their sense of self.',
        culturalBackground: `Mirrorkin drift through the cracks of society like shadows that don't know their own shape, their faces shifting with every glance in a reflective surface. They gather in hidden enclaves beneath cities or in abandoned mirror factories, places where reflections multiply endlessly. A Mirrorkin might wear your face for weeks, living your life better than you ever could, before fading away with your secrets. Their children are taught to avoid mirrors entirely, for a single glance can shatter their fragile sense of self. They trade in deception and stolen identities, but every transformation erodes another piece of their original soul. Most Mirrorkin have forgotten their true names, their true faces - if they ever had them. They are walking voids, beautiful and terrifying, capable of becoming anyone except themselves.`,
        variantDiversity: 'Mirrorkin variants reflect different responses to identity loss: Doppel Mirrorkin perfect the art of impersonation and embrace their shapeshifting nature, while Broken Mirrorkin struggle with fragmented identities and mental instability.',
        integrationNotes: {
            actionPointSystem: 'Mirrorkin abilities focus on deception, adaptation, and identity manipulation. Their shapeshifting provides unique infiltration and social options.',
            backgroundSynergy: 'Mirrorkin excel in backgrounds emphasizing deception, adaptability, and social manipulation. Their identity crisis can create compelling roleplay opportunities.',
            classCompatibility: 'Mirrorkin make excellent rogues, spies, and social characters. Their shapeshifting abilities enhance classes that rely on deception and infiltration.'
        },
        meaningfulTradeoffs: 'Mirrorkin gain powerful shapeshifting and deception abilities but suffer from identity loss, mental instability, and the constant risk of losing themselves in their disguises.',
        baseTraits: {
            languages: ['Common', 'Changeling'],
            lifespan: '70-90 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            doppel: {
                id: 'doppel_mirrorkin',
                name: 'Facechanger',
                description: 'Masters of deception who reshape their flesh like living clay, these Mirrorkin perfect the art of impersonation, their features shifting with unnatural fluidity.',
                culturalBackground: 'Masters of deception who reshape their flesh like living clay, these Mirrorkin perfect the art of impersonation, their features shifting with unnatural fluidity. They claim mirrors show them their true potential - infinite faces, infinite lives. A Facechanger might wear a noble\'s visage to infiltrate courts, or a beggar\'s rags to move unseen through slums. But each transformation costs a piece of their original self - memories fade, habits change, until they wonder if any face is truly theirs. They are master spies and infiltrators, capable of becoming anyone they touch. But prolonged disguise leads to personality bleed, where the copied person\'s traits overwrite their own. Many Facechanger lose themselves entirely, becoming permanent copies of others, their original identity shattered like a dropped mirror. They speak of the Mirror Self, the perfect face that waits beneath all others, but few ever find it.',
                statModifiers: {
                    constitution: -2,
                    strength: -2,
                    agility: 3,
                    intelligence: 2,
                    spirit: 0,
                    charisma: 4
                },
                traits: [
                    {
                        name: 'Perfect Mimicry',
                        description: 'Can perfectly copy appearance and voice of observed creatures, but each use causes you to lose 1 point of your original identity permanently. After 5 uses without resting, you must make a Spirit save (DC 15) or forget who you originally were for 1d4 hours, believing yourself to be the last person you copied.',
                        type: 'illusion'
                    },
                    {
                        name: 'Adaptive Form',
                        description: 'Can alter physical features to gain advantage on disguise checks, but suffer severe identity confusion - you have -2 to Wisdom saves and cannot remember your own original appearance without looking in a mirror. Extended use (more than 4 hours in a single form) risks becoming permanently stuck in that form.',
                        type: 'utility'
                    },
                    {
                        name: 'Mirror Memory',
                        description: 'Can access surface memories of copied forms, but risk personality bleed that affects decision-making. Each memory you access has a 20% chance to overwrite one of your own memories permanently. You may forget important personal details, loyalties, or goals.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Changeling', 'Thieves\' Cant'],
                speed: 30
            },
            broken: {
                id: 'broken_mirrorkin',
                name: 'Splintered',
                description: 'Fragmented souls whose identities shattered like broken glass, these Mirrorkin struggle with the pieces of who they once were.',
                culturalBackground: 'Fragmented souls whose identities shattered like broken glass, these Mirrorkin struggle with the pieces of who they once were. Their minds are kaleidoscopes of stolen memories and fading recollections, their personalities shifting with the light. They see reflections as accusations, each mirror showing a different version of themselves - some beautiful, some monstrous, all incomplete. A Splintered might act like a child one moment and a sage the next, their fractured mind making them unpredictable and dangerous. They hoard shards of identity like precious gems, desperately trying to piece together who they were before the breaking. Many Splintered become hermits, avoiding reflective surfaces entirely, speaking in fragments and riddles. They are both pitied and feared, for their condition is contagious - prolonged exposure to a Splintered can cause others to question their own identity. In the end, most Splintered fade away entirely, becoming nothing more than echoes in empty rooms.',
                statModifiers: {
                    constitution: -2,
                    strength: -2,
                    agility: 2,
                    intelligence: 3,
                    spirit: 2,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Fractured Mind',
                        description: 'Resistance to charm and fear effects due to mental fragmentation, but suffer random personality shifts during stress.',
                        type: 'mental'
                    },
                    {
                        name: 'Identity Crisis',
                        description: 'Can temporarily adopt aspects of nearby allies\' abilities, but lose access to own racial traits while doing so.',
                        type: 'adaptive'
                    },
                    {
                        name: 'Shattered Reflection',
                        description: 'Can split into multiple illusory copies for 1 round, but each copy shares damage taken.',
                        type: 'illusion'
                    }
                ],
                languages: ['Common', 'Changeling', 'Deep Speech'],
                speed: 30
            }
        }
    },

    thornkin: {
        id: 'thornkin',
        name: 'Thornkin',
        description: 'Thorn-covered folk bound by unbreakable promises, their word carrying unnatural weight',
        icon: 'fas fa-leaf',
        overview: 'The Thornkin are fae-touched mortals bound by ancient bargains and supernatural contracts. Thorns grow from their skin, and they are compelled to follow strict codes of behavior dictated by their fae heritage.',
        culturalBackground: `Thornkin courts are labyrinths of etiquette and obligation, where a misplaced word can draw blood and a broken promise can cost a life. Their skin sprouts thorns like living contracts, beautiful and deadly reminders of bargains made in moonlit groves with beings who don't forget. A Thornkin child learns the dance of words before they can walk - every promise must be honored, every slight avenged, every favor repaid threefold. They build their societies around great thorn hedges that bloom with impossible flowers, their halls filled with the scent of blood and roses. Breaking a bargain with a Thornkin isn't just dishonorable - it's physically painful, the thorns turning inward to punish the oathbreaker. They are master manipulators, their words binding tighter than any chain, but they pay dearly for this power. Many Thornkin bear scars from their own thorns, reminders of promises they couldn't keep.`,
        variantDiversity: 'Thornkin variants reflect different fae court affiliations and paths: Courtly Thornkin are bound to the noble courts and excel in diplomacy, Wild Thornkin rejected civilization for primal freedom and savage power, and Dusk Thornkin walk the twilight boundary between light and shadow.',
        integrationNotes: {
            actionPointSystem: 'Thornkin abilities focus on social manipulation, nature magic, and binding contracts. Their fae nature provides unique diplomatic and magical options.',
            backgroundSynergy: 'Thornkin excel in backgrounds emphasizing charisma, nature magic, and social interaction. Their binding contracts create interesting roleplay opportunities.',
            classCompatibility: 'Thornkin make excellent diplomats, nature casters, and support characters. Their social abilities and nature magic enhance classes that rely on charisma and natural magic.'
        },
        meaningfulTradeoffs: 'Thornkin gain powerful social and nature abilities but are bound by strict behavioral codes and supernatural contracts. Their thorns cause them pain when using their powers.',
        baseTraits: {
            languages: ['Common', 'Sylvan'],
            lifespan: '250-350 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            courtly: {
                id: 'courtly_thornkin',
                name: 'Oathbound',
                description: 'Bound by promises that grow thorns from their skin, these Thornkin are living embodiments of unbreakable vows.',
                culturalBackground: 'Bound by promises that grow thorns from their skin, these Thornkin are living embodiments of unbreakable vows, their flesh sprouting barbs that bloom when oaths are made or broken. They claim their thorns are gifts from the fae courts, reminders that words have weight and consequences. An Oathbound\'s handshake can draw blood if their intentions are false, their skin serving as living lie detectors. They are master diplomats and deal-makers, capable of binding others with words alone. But they pay dearly - breaking their own promises causes their thorns to turn inward, tearing at their flesh from within. Children born Oathbound are raised in strict codes of honor, taught that a promise given is a life given. Many Oathbound become hermit scholars of ancient contracts, their bodies living libraries of binding magic. They speak of the Thorn Price, the blood and pain that validates every bargain, and pity those who make promises lightly.',
                statModifiers: {
                    constitution: -2,
                    strength: -2,
                    agility: 2,
                    intelligence: 3,
                    spirit: 1,
                    charisma: 4
                },
                traits: [
                    {
                        name: 'Fae Bargain',
                        description: 'Can make magical contracts that compel truth and compliance, but you are MAGICALLY BOUND to honor every agreement you make or witness. Breaking a bargain causes 2d6 psychic damage and you cannot regain HP until you fulfill your obligation. You cannot lie under any circumstances - attempting to do so causes physical pain.',
                        type: 'social'
                    },
                    {
                        name: 'Court Etiquette',
                        description: 'Advantage on social interactions with nobility and fae, but you MUST follow strict behavioral codes (no direct insults, proper titles, formal greetings). Violating etiquette causes disadvantage on all social rolls for 24 hours and thorns grow from your skin dealing 1d4 damage per violation.',
                        type: 'social'
                    },
                    {
                        name: 'Thorn Crown',
                        description: 'Can command plant growth and entangle enemies, but each use causes thorns to grow from your skin dealing 1d4 damage and giving you -1 to Constitution saves for 1 hour. In combat, this stacks quickly.',
                        type: 'nature'
                    }
                ],
                languages: ['Common', 'Sylvan', 'Celestial'],
                speed: 30
            },
            wild: {
                id: 'wild_thornkin',
                name: 'Thornscar',
                description: 'Marked by scars from thorns that have turned against their own flesh, these Thornkin bear the evidence of broken promises and failed bargains.',
                culturalBackground: 'Marked by scars from thorns that have turned against their own flesh, these Thornkin bear the evidence of broken promises and failed bargains. Their skin is a tapestry of old wounds, each scar telling a story of obligation unmet. They claim their scars are badges of wisdom, reminders that all contracts have hidden costs. A Thornscar might have beautiful, blooming thorns on one arm and jagged scars on the other - the mark of a bargain that went wrong. They are wary negotiators, always looking for the hidden thorns in any deal. But they are also healers of a sort, using their scars to teach others about the dangers of binding words. Many Thornscar become wandering judges, settling disputes with their scarred hands as evidence of the consequences of broken faith. They speak of the Scarred Path, where every broken promise leaves its mark, and warn that some scars never truly heal.',
                statModifiers: {
                    constitution: 3,
                    strength: 3,
                    agility: 3,
                    intelligence: -2,
                    spirit: 1,
                    charisma: -3
                },
                traits: [
                    {
                        name: 'Briar Form',
                        description: 'Can transform into a mass of thorny vines, gaining resistance to bludgeoning and slashing damage (takes half damage), but becoming completely immobile and vulnerable to fire damage (takes double damage). Costs 3 AP, lasts 1 minute.',
                        type: 'transformation'
                    },
                    {
                        name: 'Savage Growth',
                        description: 'Your attacks cause bleeding damage over time, but you cannot use healing magic on yourself.',
                        type: 'combat'
                    },
                    {
                        name: 'Untamed',
                        description: 'Immune to charm and compulsion effects, but disadvantage on all social interactions in civilized settings.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Sylvan'],
                speed: 35
            },
            dusk: {
                id: 'dusk_thornkin',
                name: 'Duskblood',
                description: 'Their blood flows with the rhythm of twilight, these Thornkin are bound to the boundary between day and night.',
                culturalBackground: 'Their blood flows with the rhythm of twilight, these Thornkin are bound to the boundary between day and night, their thorns blooming only when shadows lengthen. They claim dusk is when the fae courts are closest, when bargains carry the most weight. A Duskblood\'s thorns glow faintly in twilight, their blood running darker as the sun sets. They are creatures of transition, most active during dawn and dusk when the world shifts. But this boundary existence comes at a cost - they are weakened by both pure daylight and deepest night, thriving only in the liminal hours. Many Duskblood become mediators between rival factions, negotiating truces that last only as long as twilight. They speak of the Twilight Bargain, ancient pacts made when day meets night, and warn that some boundaries, once crossed, can never be recrossed. Their blood carries the chill of coming night, leaving frost patterns on anything they touch during their peak hours.',
                statModifiers: {
                    constitution: -2,
                    strength: -2,
                    agility: 4,
                    intelligence: 3,
                    spirit: 3,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Twilight Step',
                        description: 'Can teleport short distances through shadows, but only during dawn or dusk hours. Costs 2 AP.',
                        type: 'movement'
                    },
                    {
                        name: 'Duality',
                        description: 'Gain advantage on stealth and perception checks, but suffer disadvantage in bright light or total darkness.',
                        type: 'perception'
                    },
                    {
                        name: 'Thorn Veil',
                        description: 'Can create illusory duplicates made of shadow and thorns, but each use drains 2 HP.',
                        type: 'illusion'
                    }
                ],
                languages: ['Common', 'Sylvan', 'Umbral'],
                speed: 35
            }
        }
    },

    wildkin: {
        id: 'wildkin',
        name: 'Wildkin',
        description: 'Antlered forest folk whose bodies have adapted to the wilds in strange ways',
        icon: 'fas fa-tree',
        overview: 'The Wildkin are forest guardians with antlers growing from their heads and bark-like skin. They are bonded to ancient groves and the primal forces of nature, serving as protectors of the wild places.',
        culturalBackground: `Wildkin groves are living fortresses of ancient trees and wandering spirits, their bark-homes growing from the same roots that sprout their antlers. They speak with the old voices of the forest - not in words, but in the rustle of leaves and the creak of branches. A Wildkin child might be raised by wolves or taught the secrets of healing by the trees themselves. Their courts are held in sacred circles where the boundary between flesh and bark blurs, and outsiders who witness these rituals often leave changed. Wildkin warriors don't wield swords - they become weapons, their bodies twisting into living wood and thorn. But the wild calls constantly, and many Wildkin vanish into the deep woods, becoming part of the forest they once protected. They view civilization as a thin veneer over savagery, and pity those who cannot hear the songs the earth sings.`,
        variantDiversity: 'Wildkin variants reflect different aspects of nature: Guardian Wildkin are fierce protectors of ancient forests, Wanderer Wildkin are restless nomads following seasonal migrations, and Shaman Wildkin channel primal spirits and ancient nature magic.',
        integrationNotes: {
            actionPointSystem: 'Wildkin abilities focus on nature magic, physical prowess, and environmental manipulation. Their connection to nature provides unique tactical options in natural settings.',
            backgroundSynergy: 'Wildkin excel in backgrounds emphasizing nature, protection, and primal power. Their grove bonds create strong territorial motivations.',
            classCompatibility: 'Wildkin make excellent druids, rangers, and nature warriors. Their physical bonuses and nature magic enhance classes that operate in wilderness settings.'
        },
        meaningfulTradeoffs: 'Wildkin gain powerful nature abilities and physical prowess but are bound to their groves and suffer when separated from nature. Their wild nature makes urban environments uncomfortable.',
        baseTraits: {
            languages: ['Common', 'Druidic'],
            lifespan: '180-220 years',
            baseSpeed: 35,
            size: 'Medium'
        },
        subraces: {
            guardian: {
                id: 'guardian_wildkin',
                name: 'Woodwarden',
                description: 'Guardians of ancient forests whose flesh grows bark and whose antlers crown like living trees.',
                culturalBackground: 'Guardians of ancient forests whose flesh grows bark and whose antlers crown like living trees, these Wildkin stand as the forest\'s immune system. They claim the woods speak to them directly, warning of threats days before they arrive. A Woodwarden\'s presence causes plants to grow unnaturally fast, their footsteps leaving fertile soil in their wake. They are living fortresses, capable of calling roots from the earth to ensnare enemies or thorns to impale them. But this connection demands sacrifice - they cannot abide the cutting of living wood, and proximity to dead forests causes them physical pain. Many Woodwarden become hermits in sacred groves, their bodies slowly becoming indistinguishable from the trees they protect. They speak of the Forest Heart, an ancient consciousness that flows through all growing things, and warn that harming the woods is like stabbing one\'s own heart.',
                statModifiers: {
                    constitution: 3,
                    strength: 3,
                    agility: 1,
                    intelligence: -1,
                    spirit: 3,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Forest Guardian',
                        description: 'Can sense threats to natural areas within 1 mile and gain combat bonuses when defending nature, but become enraged when witnessing environmental destruction.',
                        type: 'nature'
                    },
                    {
                        name: 'Antler Charge',
                        description: 'Can make devastating charge attacks with antlers, but become stuck if you miss and hit a wall or tree.',
                        type: 'combat'
                    },
                    {
                        name: 'Nature\'s Ally',
                        description: 'Can communicate with and request aid from forest animals, but must provide favors in return.',
                        type: 'communication'
                    }
                ],
                languages: ['Common', 'Druidic', 'Beast Speech'],
                speed: 35
            },
            wanderer: {
                id: 'wanderer_wildkin',
                name: 'Trailborn',
                description: 'Born to the endless migration of herds and seasons, these Wildkin carry the wanderlust of the wild in their blood.',
                culturalBackground: 'Born to the endless migration of herds and seasons, these Wildkin carry the wanderlust of the wild in their blood, their antlers pointing always toward the horizon. They claim the earth itself shows them the paths, ley lines of natural energy that guide their journeys. A Trailborn can navigate any wilderness unerringly, finding water in deserts and shelter in storms. Their bodies adapt to long travel, their feet becoming calloused and sure, their senses sharpening to detect threats miles away. But the call to wander never stops - they become restless in settlements, dreaming of open skies and untamed lands. Many Trailborn spend their lives on perpetual pilgrimage, following ancient migration routes that their ancestors walked. They speak of the Endless Trail, a spiritual path that connects all wild places, and pity those bound to single homes.',
                statModifiers: {
                    constitution: 1,
                    strength: -1,
                    agility: 4,
                    intelligence: 2,
                    spirit: 3,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Seasonal Migration',
                        description: 'Gain different bonuses based on current season, but suffer penalties when staying in one place too long.',
                        type: 'adaptive'
                    },
                    {
                        name: 'Pathfinder',
                        description: 'Cannot become lost and can find the fastest route to any destination, but feel compelled to keep moving.',
                        type: 'movement'
                    },
                    {
                        name: 'Weather Sense',
                        description: 'Can predict weather changes and natural disasters, but become restless and distracted during storms.',
                        type: 'divination'
                    }
                ],
                languages: ['Common', 'Druidic', 'Primordial'],
                speed: 35
            },
            shaman: {
                id: 'shaman_wildkin',
                name: 'Bonecaller',
                description: 'Shamans who commune with the spirits of beasts and ancestors, their antlers serving as conduits for primal energies.',
                culturalBackground: 'Shamans who commune with the spirits of beasts and ancestors, their antlers serving as conduits for primal energies that echo through the wild. They claim to hear the voices of every animal that ever died, their wisdom drawn from the collective memory of the wild. A Bonecaller\'s chants can summon spirit beasts or divine the future from animal bones. They wear necklaces of animal teeth and bones, each one a connection to the spirits they call upon. But this communion comes at a cost - they share the beasts\' primal instincts, sometimes losing themselves to animal rage or cunning. Many Bonecaller live in isolation, their minds filled with too many voices to maintain normal relationships. They speak of the Bone Choir, the endless song of every creature that ever lived, and warn that some spirits, once called, never truly depart.',
                statModifiers: {
                    constitution: 0,
                    strength: -2,
                    agility: 1,
                    intelligence: 3,
                    spirit: 4,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Spirit Communion',
                        description: 'Can speak with nature spirits for guidance and aid, but you MUST perform daily rituals and offerings (costing 50gp in materials per day) or the spirits become hostile. Neglecting spirits for more than 2 days causes them to curse you - disadvantage on all rolls until you make amends. Spirits often demand favors that may conflict with your goals.',
                        type: 'spiritual'
                    },
                    {
                        name: 'Elemental Affinity',
                        description: 'Can channel elemental forces for various effects, but you become VULNERABLE (take double damage) to opposing elements. Using fire magic makes you vulnerable to cold, water makes you vulnerable to lightning, etc. The vulnerability lasts for 1 hour after using elemental powers.',
                        type: 'elemental'
                    },
                    {
                        name: 'Ancestral Wisdom',
                        description: 'Can access memories of previous shamans for knowledge, but risk being overwhelmed by ancient experiences. Each use requires a Spirit save (DC 15) or you become confused for 1d4 rounds, unable to distinguish between your memories and those of ancestors. Extended use can cause permanent personality shifts.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Druidic', 'Elemental'],
                speed: 35
            },
            lightfoot: {
                id: 'lightfoot_wildkin',
                name: 'Rootrunner',
                description: 'Small, nimble folk who blend into crowds and move with supernatural stealth',
                statModifiers: {
                    constitution: 1,
                    strength: -3,
                    agility: 4,
                    intelligence: 2,
                    spirit: 2,
                    charisma: 3
                },
                traits: [
                    {
                        name: 'Naturally Stealthy',
                        description: 'Can attempt to hide even when only obscured by a creature that is at least one size larger than you. However, your small size makes you vulnerable - you take +50% damage from Large or larger creatures and have disadvantage on Strength-based saves.',
                        type: 'stealth'
                    },
                    {
                        name: 'Lucky',
                        description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll. However, you cannot benefit from this again until you complete a short rest. Over-relying on luck leaves you exhausted.',
                        type: 'luck'
                    },
                    {
                        name: 'Brave',
                        description: 'You have advantage on saving throws against being frightened, but your bravery can become recklessness - you must make a Spirit save (DC 12) to retreat from dangerous situations, often leading you into harm.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Halfling', 'Druidic'],
                speed: 25
            }
        }
    },

    ashmark: {
        id: 'ashmark',
        name: 'Ashmark',
        description: 'Ash-covered survivors from volcanic badlands, their skin marked by endless fire',
        icon: 'fas fa-fire',
        overview: 'The Ashmark are a fire-touched people who dwell in volcanic wastelands. Their bodies burn with inner heat, and they are immune to flames but vulnerable to cold. They are master smiths and fierce warriors.',
        culturalBackground: `Ashmark forges burn day and night in volcanic calderas, their flames fed by the blood of those who fail the trials. Their children are tempered in lava baths from birth, the weak burning away while the strong emerge with skin like cooled slag and eyes that glow with inner fire. They speak of the Fire Within, a gift and curse that demands constant feeding through creation or destruction. Ashmark warriors don't just fight - they burn, their strikes leaving cinders in their wake. Their smiths craft weapons that remember the fires of their forging, becoming more deadly with each life they take. But the cold is their great enemy, sapping their inner flames and leaving them brittle and weak. Many Ashmark die not in battle, but in the long, slow fade when their fires finally go out. Their society is a meritocracy of flame - those who burn brightest rise highest, while the dim become fuel for the forges.`,
        variantDiversity: 'Ashmark variants reflect different aspects of fire: Forgeborn Ashmark are master smiths whose bodies burn with forge heat, Cinderborn Ashmark are swift scouts leaving trails of embers, and War Orcs are fierce warriors tempered by fire and battle.',
        integrationNotes: {
            actionPointSystem: 'Ashmark abilities focus on fire damage, crafting, and aggressive combat. Their inner flames provide offensive options but create environmental hazards.',
            backgroundSynergy: 'Ashmark excel in backgrounds emphasizing strength, crafting, and combat prowess. Their fire nature complements aggressive and creative paths.',
            classCompatibility: 'Ashmark make excellent warriors, smiths, and fire-based casters. Their fire immunity and physical bonuses enhance classes that engage in direct combat.'
        },
        meaningfulTradeoffs: 'Ashmark gain fire immunity and powerful offensive abilities but suffer from cold vulnerability and their inner heat can damage equipment and allies. They struggle in cold environments.',
        baseTraits: {
            languages: ['Common', 'Ignan'],
            lifespan: '100-140 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            forgeborn: {
                id: 'forgeborn_ashmark',
                name: 'Fireheart',
                description: 'Born with hearts that burn like living forges, these Ashmark carry volcanic fire in their veins.',
                culturalBackground: 'Born with hearts that burn like living forges, these Ashmark carry volcanic fire in their veins, their skin hot to the touch and their eyes glowing like banked coals. They claim their fire is a gift from the mountain gods, a piece of the earth\'s inner fury given form. A Fireheart\'s presence can warm a room in winter or ignite dry tinder with a glance. They are master craftsmen, capable of shaping metal with bare hands heated to impossible temperatures. But the fire demands constant fuel - they must create or destroy, or the flames consume them from within. Many Fireheart become hermit smiths in volcanic caverns, their bodies slowly becoming one with the lava flows. They speak of the Heart Flame, an inner fire that connects them to the earth\'s core, and warn that those who ignore its call risk becoming cold and lifeless.',
                statModifiers: {
                    constitution: 3,
                    strength: 4,
                    agility: -2,
                    intelligence: 3,
                    spirit: 0,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Forge Heart',
                        description: 'Can heat metal with touch and work without tools, but body temperature damages equipment and allies.',
                        type: 'crafting'
                    },
                    {
                        name: 'Fire Immunity',
                        description: 'Immune to fire damage (takes no damage) and can walk through lava unharmed, but you are vulnerable to cold damage (take double damage from cold attacks).',
                        type: 'resistance'
                    },
                    {
                        name: 'Molten Strike',
                        description: 'Weapons become red-hot dealing extra fire damage, but have chance to break from heat stress.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Ignan', 'Terran'],
                speed: 30
            },
            cinderborn: {
                id: 'cinderborn_ashmark',
                name: 'Cinderfoot',
                description: 'Swift scouts who leave trails of smoking embers, moving like living wildfires through volcanic wastes.',
                culturalBackground: 'Swift scouts who leave trails of smoking embers, these Ashmark move like living wildfires through the volcanic wastes, their footsteps scorching the earth behind them. They claim the ashes guide their paths, showing them safe routes through lava flows and hidden geothermal vents. A Cinderfoot can dash across molten rock unharmed, leaving cooling footprints that mark their passage for days. They are masters of ambush, capable of hiding in smoke clouds or ash storms that they themselves create. But this speed comes at a cost - their feet are always hot, leaving burns on anything they touch for too long. Many Cinderfoot become solitary wanderers, following geothermal hotspots that shift with the earth\'s moods. They speak of the Cinder Path, trails of cooled lava that connect all volcanic regions, and pity those who cannot feel the earth\'s heat pulsing beneath their feet.',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: 4,
                    intelligence: 2,
                    spirit: 2,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Ember Trail',
                        description: 'Leave a trail of harmless embers that can be followed or used for signaling, but also makes you easy to track.',
                        type: 'movement'
                    },
                    {
                        name: 'Ash Cloud',
                        description: 'Can create concealing ash clouds for escape, but the ash irritates allies\' eyes and breathing.',
                        type: 'utility'
                    },
                    {
                        name: 'Heat Dash',
                        description: 'Can move at double speed leaving fire damage in your wake, but become exhausted afterward.',
                        type: 'movement'
                    }
                ],
                languages: ['Common', 'Ignan', 'Auran'],
                speed: 35
            },
        }
    },

    skinwalker: {
        id: 'skinwalker',
        name: 'Skinwalker',
        description: 'Tribal hunters whose rituals have left them changed, their eyes gleaming with animal cunning',
        icon: 'fas fa-paw',
        overview: 'The Skinwalkers are cursed shamans who can transform into beasts. They walk the line between human and animal, struggling to maintain their humanity while embracing their bestial nature.',
        culturalBackground: `Skinwalker packs roam the wild borders between civilization and savagery, their howls echoing through moonless nights. They broke the old taboos, drank from forbidden springs, and now carry beasts within their skins like parasites waiting to emerge. A Skinwalker's first change is agony - bones cracking, flesh tearing, the human mind drowning in animal instinct. Some learn to master the beast, using its strength while keeping their humanity intact. Others lose themselves entirely, becoming monsters that hunt their own kind. Their camps are hidden in caves or ruined towers, places where the boundary between man and animal frays. Children are taught to recognize the signs: the yellow gleam in the eyes, the sudden hunger for raw meat, the dreams of running on four legs through endless forests. Many Skinwalkers end their days in self-imposed exile, chaining themselves during full moons to prevent the change that would claim them forever.`,
        variantDiversity: 'Skinwalker variants reflect different responses to their curse: Hunter Skinwalkers embrace their predatory nature and bestial instincts, while Penitent Skinwalkers seek redemption and struggle to maintain control over their transformations.',
        integrationNotes: {
            actionPointSystem: 'Skinwalker abilities focus on transformation, tracking, and bestial combat. Their shapeshifting provides versatile tactical options but carries risks.',
            backgroundSynergy: 'Skinwalkers excel in backgrounds emphasizing nature, survival, and primal power. Their curse creates compelling internal conflicts and roleplay opportunities.',
            classCompatibility: 'Skinwalkers make excellent druids, rangers, and primal warriors. Their transformation abilities enhance classes that benefit from versatility and physical prowess.'
        },
        meaningfulTradeoffs: 'Skinwalkers gain powerful transformation and tracking abilities but risk losing control to their beast nature. They suffer social penalties and struggle with their dual identity.',
        baseTraits: {
            languages: ['Common', 'Beast Speech'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            hunter: {
                id: 'hunter_skinwalker',
                name: 'Beastkin',
                description: 'Those who embrace their inner beast completely, becoming perfect predators whose humanity is just a thin veneer.',
                culturalBackground: 'Those who embrace their inner beast completely, becoming perfect predators whose humanity is just a thin veneer over animal instinct. They claim the beast is their true self, humanity a cage they willingly shatter. A Beastkin\'s eyes gleam with animal cunning, their movements fluid and predatory. They can call upon their beast form at will, becoming perfect hunters capable of tracking prey for days. But the beast demands tribute - they must hunt regularly, or the animal rage consumes their remaining humanity. Many Beastkin become solitary predators, living in the wild and only visiting settlements to trade pelts for necessities. They speak of the Beast Within as a noble spirit, not a curse, and pity those who fear their true nature.',
                statModifiers: {
                    constitution: 3,
                    strength: 3,
                    agility: 3,
                    intelligence: -2,
                    spirit: 1,
                    charisma: -3
                },
                traits: [
                    {
                        name: 'Beast Form',
                        description: 'Can transform into a predatory animal gaining its abilities, but risk losing human consciousness.',
                        type: 'transformation'
                    },
                    {
                        name: 'Predator\'s Instinct',
                        description: 'Can track creatures by scent and sense fear, but become aggressive toward weak or injured beings.',
                        type: 'hunting'
                    },
                    {
                        name: 'Pack Bond',
                        description: 'Gain bonuses when fighting alongside beast companions, but suffer penalties when alone.',
                        type: 'social'
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Primal'],
                speed: 30
            },
            penitent: {
                id: 'penitent_skinwalker',
                name: 'Scarred',
                description: 'Marked by the trauma of their first change, these Skinwalkers bear physical and mental scars from the beast that nearly consumed them.',
                culturalBackground: 'Marked by the trauma of their first change, these Skinwalkers bear physical and mental scars from the beast that nearly consumed them. They fight constantly to maintain control, their bodies covered in self-inflicted wounds from chains and restraints. A Scarred\'s flesh is a map of old bites and claw marks, reminders of battles won against their inner beast. They are wary survivors, teaching others how to recognize and resist the change. But their control is fragile - stress or injury can cause partial transformations, leaving them stuck between forms. Many Scarred become healers of a sort, using their experience to help others through their first changes. They speak of the Scarred Path, where every wound is a lesson, and warn that some scars never truly heal, they just become stronger.',
                statModifiers: {
                    constitution: 1,
                    strength: -1,
                    agility: 2,
                    intelligence: 2,
                    spirit: 3,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Controlled Transformation',
                        description: 'Can partially transform for specific abilities while maintaining control, but transformations cause pain.',
                        type: 'transformation'
                    },
                    {
                        name: 'Curse Resistance',
                        description: 'Resistant to curses and lycanthropy due to existing curse, but you are vulnerable to radiant damage (take double damage from radiant attacks) due to your cursed nature.',
                        type: 'resistance'
                    },
                    {
                        name: 'Redemptive Sacrifice',
                        description: 'Can take on others\' curses or afflictions to help them, but worsen your own condition.',
                        type: 'sacrifice'
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Celestial'],
                speed: 30
            }
        }
    },

    graveworn: {
        id: 'graveworn',
        name: 'Graveworn',
        description: 'Ancient guardians whose bodies refuse to decay, bound by oaths to protect what they watch over',
        icon: 'fas fa-skull',
        overview: 'The Graveworn are undead beings bound by ancient oaths to guard treasures and tombs. They are immortal but cursed, unable to rest until their duty is fulfilled or their oath is broken.',
        culturalBackground: `Graveworn tombs are silent libraries of the dead, their walls inscribed with oaths that bind souls long after bodies have failed. They swore impossible vows - to guard treasures until the mountains crumble, to protect secrets until the stars fall from the sky. Death was supposed to release them, but their promises held tighter than any grave. Now they shuffle through eternal night, their flesh rotting but never failing, their minds sharp as the day they died. They speak of the living with distant pity, remembering warmth and emotion like half-forgotten dreams. Their courts are held in mausoleums by torchlight, where the dead debate philosophy and strategy with voices like crumbling parchment. Some Graveworn embrace their immortality, becoming patient strategists who outlast any enemy. Others claw at their own tombs, desperate to complete their duties and finally rest. But the oaths never loosen, and the dead keep their promises, even when the world that made them has forgotten why.

**Vaultkeeper Graveworn**: Eternal guardians bound by oaths to protect treasures that have long lost their value, these Graveworn stand as living vaults in forgotten tombs. They swore to guard gold and jewels until death, but death only strengthened their resolve. A Vaultkeeper's presence wards against thieves, their mere gaze causing shadows to deepen and locks to strengthen. They are master appraisers, able to sense the worth and history of any treasure. But their obsession grows - they begin to see people as potential thieves, their protective instincts turning paranoid. Many Vaultkeeper live in isolation, their tombs becoming prisons of their own making. They speak of the Treasure Oath, vows that transcend death itself, and warn that some treasures are too valuable to ever be touched by living hands.

**Dustscribe Graveworn**: Scholars whose minds were preserved by binding oaths to preserve knowledge, these Graveworn carry libraries in their decaying flesh. They swore to protect scrolls and secrets until the end of time, their memories becoming perfect archives. A Dustscribe can recall any text they've read, their minds vast repositories of forgotten lore. They are patient researchers, capable of spending centuries deciphering ancient mysteries. But this knowledge comes at a cost - they lose touch with current events, their minds filled with too many voices from the past. Many Dustscribe become reclusive scholars in forgotten libraries, their bodies slowly crumbling like the pages they protect. They speak of the Knowledge Oath, promises that preserve wisdom beyond death, and pity the living who waste their brief time on trivial matters.`,
        variantDiversity: 'Graveworn variants reflect different aspects of undeath: Hoarder Graveworn are consumed by greed and obsessively guard treasures, while Scholar Graveworn are undead academics obsessed with collecting and preserving knowledge.',
        integrationNotes: {
            actionPointSystem: 'Graveworn abilities focus on durability, undead resilience, and obsessive dedication. Their immortal nature provides unique advantages but comes with compulsions.',
            backgroundSynergy: 'Graveworn excel in backgrounds emphasizing knowledge, dedication, and endurance. Their undead nature creates unique roleplay challenges and opportunities.',
            classCompatibility: 'Graveworn make excellent tanks, knowledge specialists, and undead-themed casters. Their immunities and resilience enhance classes that benefit from durability.'
        },
        meaningfulTradeoffs: 'Graveworn gain undead immunities and immortality but are bound by compulsions, vulnerable to radiant damage, and disconnected from the living world. They struggle with their cursed existence.',
        baseTraits: {
            languages: ['Common', 'Necril'],
            lifespan: 'Immortal (cursed)',
            baseSpeed: 25,
            size: 'Medium'
        },
        subraces: {
            hoarder: {
                id: 'hoarder_graveworn',
                name: 'Vaultkeeper',
                description: 'Ancient guardians consumed by insatiable greed',
                statModifiers: {
                    constitution: 4,
                    strength: 3,
                    agility: -3,
                    intelligence: 1,
                    spirit: -2,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Treasure Sense',
                        description: 'Can detect valuable items within 120 feet and know their approximate worth, but become obsessed with acquiring them.',
                        type: 'detection'
                    },
                    {
                        name: 'Undead Resilience',
                        description: 'Immune to poison and disease damage, and immune to exhaustion. However, you are vulnerable to radiant damage (take double damage from radiant attacks) and vulnerable to turn undead effects (disadvantage on saves).',
                        type: 'undead'
                    },
                    {
                        name: 'Hoard Guardian',
                        description: 'Gain combat bonuses when protecting treasure, but suffer penalties when separated from valuables.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Necril', 'Draconic'],
                speed: 25
            },
            scholar: {
                id: 'scholar_graveworn',
                name: 'Dustscribe',
                description: 'Undead academics obsessed with collecting knowledge',
                statModifiers: {
                    constitution: 2,
                    strength: -2,
                    agility: -2,
                    intelligence: 4,
                    spirit: 2,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Eternal Study',
                        description: 'Perfect memory and can learn any language or skill given time, but become obsessed with acquiring knowledge.',
                        type: 'knowledge'
                    },
                    {
                        name: 'Deathless Vigil',
                        description: 'Don\'t need sleep and can work continuously, but lose connection to living world and emotions.',
                        type: 'undead'
                    },
                    {
                        name: 'Forbidden Lore',
                        description: 'Access to dangerous knowledge that can solve problems, but using it risks corruption or madness.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Necril', 'All Ancient Languages'],
                speed: 25
            }
        }
    },

    stormborn: {
        id: 'stormborn',
        name: 'Stormborn',
        description: 'Storm-battered survivors whose births coincided with terrible tempests, their hair forever wild',
        icon: 'fas fa-bolt',
        overview: 'The Stormborn are mortals born during catastrophic storms, struck by lightning in the womb and forever changed. They crackle with electrical energy and can call down thunder and lightning.',
        culturalBackground: `Stormborn caravans follow the thunderheads across the skies, their wagons crackling with built-up lightning that makes the air taste of ozone. They are born in the heart of tempests, their mothers' wombs struck by bolts that should end them both. Those who survive emerge changed - veins glowing like lightning beneath translucent skin, voices that rumble like distant thunder. Stormborn believe the storms choose them, marking them as avatars of chaos and freedom. They gather in temporary camps during lightning season, sharing stories of the great tempests and the powers they grant. But the storm's gift is fickle - a Stormborn might call down lightning that strikes their allies, or summon winds that scatter their own caravan. They are passionate lovers and terrible enemies, their emotions as volatile as the weather they embody. Many Stormborn die young, consumed by the very storms they command, their bodies becoming part of the lightning they once controlled.

**Stormscar Stormborn**: Marked by lightning scars that glow during thunderstorms, these Stormborn bear the storm's favor like living weather vanes. They claim thunder speaks to them directly, warning of approaching tempests and guiding their travels. A Stormscar's scars pulse with inner lightning, capable of shocking those who touch them uninvited. They are master weather-readers, able to predict storms days in advance and call down thunder to deafen enemies. But the scars demand tribute - during calm weather, they grow restless and irritable, their power waning. Many Stormscar become wandering prophets of the storm, their bodies living barometers. They speak of the Thunder Mark, scars that connect them to the sky's fury, and warn that those who bear them are never truly safe from the heavens.

**Crackleborn Stormborn**: Born with electricity crackling in their veins like living storms, these Stormborn move with unnatural speed during tempests. They claim the lightning flows through them like blood, granting reflexes faster than thought. A Crackleborn can dodge lightning strikes that would fell others, their movements leaving trails of static discharge. They are brilliant tacticians in battle, their minds racing with storm-born insights. But this speed comes at a cost - during calm weather, they become sluggish and indecisive, their thoughts clouded. Many Crackleborn become mercenaries who follow storm fronts, their services available only when the skies darken. They speak of the Crackle Blood, electricity that thinks and chooses, and pity those whose blood flows slow and steady.

**Galeborn Stormborn**: Embodying the destructive freedom of hurricane winds, these Stormborn carry tempests in their souls, their presence heralding sudden gales. They claim to be born of the storm's heart, their lungs filled with the breath of hurricanes. A Galeborn can summon winds that uproot trees or carry them aloft for short flights. They are passionate freedom fighters, their emotions manifesting as literal weather changes. But this power is uncontrollable - strong feelings can summon unintended storms that harm allies and allies alike. Many Galeborn become outcasts, living on the edges of civilization where their emotional outbursts cause less damage. They speak of the Gale Soul, winds that blow through their spirit, and warn that some freedoms come at too high a price.`,
        variantDiversity: 'Stormborn variants reflect different aspects of the storm: Thundercaller Stormborn command thunder and sound, Lightningborn channel pure electrical energy, and Tempest Stormborn embody the chaotic fury of the storm itself.',
        integrationNotes: {
            actionPointSystem: 'Stormborn abilities focus on lightning damage, mobility, and area control. Their electrical nature provides powerful offensive options but can be unpredictable.',
            backgroundSynergy: 'Stormborn excel in backgrounds emphasizing freedom, chaos, and elemental power. Their storm nature complements aggressive and mobile playstyles.',
            classCompatibility: 'Stormborn make excellent elemental casters, mobile strikers, and chaotic warriors. Their lightning abilities enhance classes that deal burst damage.'
        },
        meaningfulTradeoffs: 'Stormborn gain powerful lightning abilities and high mobility but are vulnerable to grounding effects and struggle with fine control. Their chaotic nature makes them unreliable.',
        baseTraits: {
            languages: ['Common', 'Auran', 'Primordial'],
            lifespan: '60-90 years',
            baseSpeed: 35,
            size: 'Medium'
        },
        subraces: {
            thundercaller: {
                id: 'thundercaller_stormborn',
                name: 'Stormscar',
                description: 'Masters of thunder and sonic devastation',
                statModifiers: {
                    constitution: 3,
                    strength: 3,
                    agility: 1,
                    intelligence: -1,
                    spirit: 2,
                    charisma: 3
                },
                traits: [
                    {
                        name: 'Thunder Voice',
                        description: 'Your voice carries the power of thunder, dealing sonic damage and stunning enemies. Costs 2 AP, but deafens you temporarily.',
                        type: 'combat'
                    },
                    {
                        name: 'Storm Presence',
                        description: 'Allies within 30 feet gain bonus to intimidation, but you cannot use stealth effectively.',
                        type: 'social'
                    },
                    {
                        name: 'Resonance',
                        description: 'Can shatter objects and barriers with sonic vibrations, but suffer damage from loud noises.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 30
            },
            lightningborn: {
                id: 'lightningborn_stormborn',
                name: 'Crackleborn',
                description: 'Living conduits of pure electrical energy',
                statModifiers: {
                    constitution: 1,
                    strength: -1,
                    agility: 4,
                    intelligence: 3,
                    spirit: 3,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Lightning Reflexes',
                        description: 'Can move at lightning speed in short bursts, but become exhausted after use. Costs 3 AP.',
                        type: 'movement'
                    },
                    {
                        name: 'Chain Lightning',
                        description: 'Your attacks can arc to nearby enemies, but also risk hitting allies.',
                        type: 'combat'
                    },
                    {
                        name: 'Grounded',
                        description: 'Immune to lightning damage (takes no damage). However, you are vulnerable to cold damage when wet (take double damage from cold attacks). Additionally, you take 1d4 lightning damage per round when standing in water or during rain.',
                        type: 'resistance'
                    }
                ],
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 40
            },
            tempest: {
                id: 'tempest_stormborn',
                name: 'Galeborn',
                description: 'Embodiments of chaotic storm fury',
                statModifiers: {
                    constitution: 3,
                    strength: 4,
                    agility: 3,
                    intelligence: -2,
                    spirit: 2,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Storm Rage',
                        description: 'Enter a berserk state gaining +3 to attack rolls and +2d6 lightning damage to all attacks, plus resistance to bludgeoning, piercing, and slashing damage (takes half damage). However, you must attack the nearest creature each turn (friend or foe) - you cannot choose targets. Lasts 1 minute or until unconscious. Once per long rest.',
                        type: 'combat'
                    },
                    {
                        name: 'Eye of the Storm',
                        description: 'Create a zone of calm around you that protects allies, but you cannot move while maintaining it.',
                        type: 'protection'
                    },
                    {
                        name: 'Unpredictable',
                        description: 'Your actions have random bonus effects, but also random penalties.',
                        type: 'chaos'
                    }
                ],
                languages: ['Common', 'Auran'],
                speed: 35
            }
        }
    },

    deepkin: {
        id: 'deepkin',
        name: 'Deepkin',
        description: 'Deep-sea folk whose skin bears strange glowing patterns from lives spent in crushing darkness',
        icon: 'fas fa-water',
        overview: 'The Deepkin are aquatic beings from the deepest ocean trenches where sunlight never reaches. They have adapted to crushing pressure and total darkness, with bioluminescent patterns that glow across their skin.',
        culturalBackground: `Deepkin cities sprawl across abyssal plains where the weight of endless ocean would pulverize surface bones, their bioluminescent patterns painting living murals across endless darkness. They speak through light and pressure, their conversations visible dances of color and unseen vibrations that carry for miles. Time flows differently in the deep - what seems like moments to surface folk might be years to a Deepkin contemplating the void. Their minds work in three dimensions, seeing paths through water that surface dwellers can't comprehend. Deepkin children are taught to read the ocean's moods, to feel the subtle changes in current and temperature that signal approaching storms or migrating prey. They view surface dwellers as ephemeral things, here one moment and gone the next, like bubbles rising to the surface. When Deepkin venture to the shallows, they bring the cold calculus of the abyss - patience that outlasts any siege, ruthlessness born of eternal night. Many never return to the surface, their bodies adapting permanently to the crushing deep.

**Deepscar Deepkin**: Scarred by the crushing pressures of the abyss, these Deepkin bear the marks of depths that would shatter surface bones. They claim the scars are maps of the ocean's hidden places, glowing patterns that guide them through underwater labyrinths. A Deepscar can withstand pressures that would crush submarines, their bodies adapted to the endless dark. They are master navigators of underwater currents, capable of sensing approaching predators miles away. But the pressure changes their minds - they think in slow, deliberate patterns, viewing haste as a surface dweller's folly. Many Deepscar become hermit guardians of deep places, their scars telling stories of battles with things that should not exist. They speak of the Deep Mark, scars that connect them to the ocean's heart, and warn that some pressures change you forever.

**Abysswalker Deepkin**: Walkers of the endless abyssal plains, these Deepkin move through crushing darkness with the certainty of those who know every current and crevice. They claim the abyss speaks to them through pressure changes, warning of distant earthquakes or approaching leviathans. An Abysswalker's bioluminescence can mimic any deep-sea creature, allowing perfect camouflage in the eternal night. They are patient hunters, capable of waiting months for the perfect moment to strike. But this deep knowledge isolates them - they struggle to understand surface concepts like "hurry" or "day." Many Abysswalker become solitary wanderers of the deep, their minds filled with too much abyssal wisdom. They speak of the Abyss Path, endless trails that connect all deep places, and pity those who live their brief lives on the surface.

**Pressureborn Deepkin**: Born of the boundary waters where deep meets shallow, these Deepkin adapt to changing pressures with fluid grace. They claim the pressure teaches them the value of boundaries, showing them where one world ends and another begins. A Pressureborn can survive both crushing depths and surface air, their bodies adapting to any environment. They are natural mediators, comfortable in any realm. But this adaptability comes at a cost - they belong nowhere fully, always feeling the pull of other depths. Many Pressureborn become travelers between worlds, their bioluminescence shifting with their moods. They speak of the Pressure Boundary, the perfect balance between worlds, and warn that those who cross too many boundaries lose themselves entirely.`,
        variantDiversity: 'Deepkin variants reflect different depth zones: Abyssal Deepkin from the crushing depths are nearly indestructible, Trench Deepkin are ambush predators, and Twilight Deepkin bridge the gap between deep and surface waters.',
        integrationNotes: {
            actionPointSystem: 'Deepkin abilities focus on pressure manipulation, bioluminescence, and aquatic superiority. Their deep-sea adaptations provide unique tactical options.',
            backgroundSynergy: 'Deepkin excel in backgrounds emphasizing patience, hunting, and alien perspectives. Their aquatic nature creates interesting challenges on land.',
            classCompatibility: 'Deepkin make excellent ambush specialists, pressure mages, and patient strategists. Their abilities enhance classes that rely on positioning and control.'
        },
        meaningfulTradeoffs: 'Deepkin gain powerful aquatic abilities and pressure resistance but suffer on land and in bright light. Their alien nature makes social interaction difficult.',
        baseTraits: {
            languages: ['Common', 'Aquan', 'Deep Speech'],
            lifespan: '150-200 years',
            baseSpeed: 25,
            size: 'Medium'
        },
        subraces: {
            abyssal: {
                id: 'abyssal_deepkin',
                name: 'Deepscar',
                description: 'Beings from the crushing depths, nearly indestructible',
                statModifiers: {
                    constitution: 4,
                    strength: 2,
                    agility: -3,
                    intelligence: 0,
                    spirit: 2,
                    charisma: -3
                },
                traits: [
                    {
                        name: 'Pressure Adaptation',
                        description: 'Resistant to bludgeoning damage (takes half damage) due to deep-sea adaptation. Can survive at any ocean depth without pressure effects. However, you move at HALF speed on land (10 feet base) and have disadvantage on all agility-based rolls when not in water. Extended time on land (more than 4 hours) causes 1d4 bludgeoning damage per hour from gravity strain.',
                        type: 'defense'
                    },
                    {
                        name: 'Abyssal Resilience',
                        description: 'Resistant to cold and acid damage (takes half damage). High Constitution grants substantial HP. However, bright light (sunlight or magical light) causes you to take 1d4 radiant damage per minute and gives disadvantage on all rolls while exposed. You must make Constitution saves (DC 12) each hour in bright light or become exhausted.',
                        type: 'defense'
                    },
                    {
                        name: 'Deep Sight',
                        description: 'Perfect vision in darkness and can see through murky water up to 120 feet. However, you are BLINDED by daylight (treat as blind condition). In bright light, all Perception checks are made with disadvantage and you cannot see creatures more than 30 feet away.',
                        type: 'perception'
                    }
                ],
                languages: ['Aquan', 'Deep Speech'],
                speed: 20
            },
            trench: {
                id: 'trench_deepkin',
                name: 'Abysswalker',
                description: 'Ambush predators from the ocean trenches',
                statModifiers: {
                    constitution: 1,
                    strength: 2,
                    agility: 4,
                    intelligence: 3,
                    spirit: 2,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Bioluminescent Lure',
                        description: 'Can create hypnotic light patterns to lure and confuse prey, but reveals your position.',
                        type: 'illusion'
                    },
                    {
                        name: 'Ambush Predator',
                        description: 'Deal double damage on surprise attacks and attacks from hiding, but you have disadvantage on attack rolls and damage rolls in direct, face-to-face combat. This represents your reliance on ambush tactics rather than frontal assaults.',
                        type: 'combat'
                    },
                    {
                        name: 'Pressure Sense',
                        description: 'Can detect movement through water pressure changes, but overwhelmed in crowded areas.',
                        type: 'perception'
                    }
                ],
                languages: ['Common', 'Aquan', 'Deep Speech'],
                speed: 30
            },
            twilight: {
                id: 'twilight_deepkin',
                name: 'Pressureborn',
                description: 'Adaptable beings who bridge deep and surface waters',
                statModifiers: {
                    constitution: 2,
                    strength: 0,
                    agility: 3,
                    intelligence: 3,
                    spirit: 2,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Adaptive Gills',
                        description: 'Can breathe both water and air, but need to stay moist or suffer penalties.',
                        type: 'utility'
                    },
                    {
                        name: 'Chromatic Display',
                        description: 'Can change bioluminescent patterns for communication and camouflage, costs 1 AP.',
                        type: 'utility'
                    },
                    {
                        name: 'Depth Diver',
                        description: 'Can rapidly change depth without injury, but sudden pressure changes disorient you.',
                        type: 'movement'
                    }
                ],
                languages: ['Common', 'Aquan'],
                speed: 30
            }
        }
    },

    starborn: {
        id: 'starborn',
        name: 'Starborn',
        description: 'Strange wanderers bearing scars from a catastrophic fall, their eyes reflecting unfamiliar constellations',
        icon: 'fas fa-star',
        overview: 'The Starborn are beings who literally fell from the stars, crashing to earth in meteors and comets. They carry cosmic energy within them and possess knowledge of distant worlds and alien geometries.',
        culturalBackground: `Starborn craters scar the wilderness like divine wounds, their occupants emerging from the smoke with eyes that reflect constellations never seen from this world. They speak of the great fall, of being cast out from realms where mathematics paint reality and time flows backward. Their minds fracture under the weight of cosmic truths - seeing futures that haven't happened, remembering lives never lived. Starborn gatherings are silent affairs in crater-rims, where they share visions that would break mortal minds. They bear the cold of the void in their bones, their touch leaving frost patterns that linger for days. Some Starborn become wandering prophets, speaking truths that sound like madness to those who hear them. Others hoard their cosmic knowledge, becoming enigmatic advisors to kings and warlords. But all carry the scars of their fall - crater-pocked skin, eyes that see too much, voices that echo with the sounds of dying stars. Many Starborn vanish during meteor showers, called back to the voids that birthed them, leaving behind only glowing craters and half-understood prophecies.

**Voidscar Starborn**: Marked by the endless void that birthed them, these Starborn carry the cold emptiness between stars in their souls. They claim the void speaks to them in the silence between heartbeats, showing them paths through reality that others cannot see. A Voidscar can step through shadows that aren't there, becoming invisible to all senses. They are master navigators of hidden ways, capable of finding lost places or people. But the void hungers - prolonged use of their gifts leaves them feeling empty and disconnected. Many Voidscar become reclusive seekers of hidden knowledge, their minds filled with too much cosmic silence. They speak of the Void Mark, scars that connect them to the spaces between, and warn that some emptinesses can never be filled.

**Sunborn Starborn**: Children of dying stellar fires, these Starborn carry the heat of collapsing stars in their flesh, their skin warm to the touch even in winter. They claim the sun's death screams taught them the value of light and warmth, making them radiant beacons in dark times. A Sunborn can ignite dry tinder with a glance or heal wounds with solar warmth. They are natural leaders, their presence inspiring hope in the darkest moments. But the stellar fire consumes them - they must rest in darkness to avoid burning out completely. Many Sunborn become wandering healers or warriors of light, their inner fire both blessing and burden. They speak of the Solar Heart, flames that sustain them from within, and warn that some lights burn too brightly to last.

**Constellation Starborn**: Living maps of the stars themselves, these Starborn bear the patterns of constellations etched into their skin and souls. They claim the stars guide their fates, showing them destinies written in the heavens. A Constellation can read the future in star patterns or navigate unerringly by the night sky. They are wise counselors, capable of seeing the grand patterns in seemingly random events. But this cosmic awareness overwhelms them - they struggle to focus on immediate concerns, their minds always reaching for the bigger picture. Many Constellation become astronomers or prophets, living under open skies. They speak of the Star Pattern, constellations that map both the heavens and the soul, and warn that some patterns, once seen, cannot be unseen.`,
        variantDiversity: 'Starborn variants reflect different cosmic origins: Voidwalker Starborn come from the empty spaces between stars, Sunborn carry the fire of dying suns, and Constellation Starborn embody the patterns written in the stars.',
        integrationNotes: {
            actionPointSystem: 'Starborn abilities focus on cosmic energy, gravity manipulation, and reality warping. Their alien nature provides unique tactical options.',
            backgroundSynergy: 'Starborn excel in backgrounds emphasizing knowledge, cosmic power, and alien perspectives. Their otherworldly nature creates compelling roleplay.',
            classCompatibility: 'Starborn make excellent cosmic casters, gravity manipulators, and knowledge seekers. Their abilities enhance classes that warp reality.'
        },
        meaningfulTradeoffs: 'Starborn gain incredible cosmic powers and alien knowledge but struggle to relate to mortals and risk madness from their own insights.',
        baseTraits: {
            languages: ['Common', 'Celestial', 'Cosmic'],
            lifespan: 'Unknown',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            voidwalker: {
                id: 'voidwalker_starborn',
                name: 'Voidscar',
                description: 'Beings from the empty void between stars',
                statModifiers: {
                    constitution: 0,
                    strength: -2,
                    agility: 3,
                    intelligence: 4,
                    spirit: 4,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Void Step',
                        description: 'Can teleport through the void between spaces, but risk getting lost in the emptiness. Costs 3 AP.',
                        type: 'movement'
                    },
                    {
                        name: 'Cosmic Isolation',
                        description: 'Immune to mind-affecting effects and fear, but cannot form emotional bonds.',
                        type: 'mental'
                    },
                    {
                        name: 'Gravity Manipulation',
                        description: 'Can alter gravity in small areas, but affects yourself as well.',
                        type: 'utility'
                    }
                ],
                languages: ['Celestial', 'Cosmic', 'Deep Speech'],
                speed: 30
            },
            sunborn: {
                id: 'sunborn_starborn',
                name: 'Sunborn',
                description: 'Carriers of dying stellar fire',
                statModifiers: {
                    constitution: 2,
                    strength: 3,
                    agility: 0,
                    intelligence: 2,
                    spirit: 2,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Stellar Radiance',
                        description: 'Emit intense light and heat, damaging nearby enemies (including allies!) but also revealing your position. The heat damages equipment and causes exhaustion in extended exposure. You glow brightly, making stealth impossible.',
                        type: 'combat'
                    },
                    {
                        name: 'Solar Flare',
                        description: 'Release devastating bursts of stellar energy, but you take HALF the damage dealt (minimum 2d6) as backlash. Each use reduces your maximum HP by 1 until long rest. Costs 4 AP.',
                        type: 'combat'
                    },
                    {
                        name: 'Photosynthesis',
                        description: 'Regenerate health in sunlight, but you WEAKEN in darkness - take -2 to all stats and cannot regenerate HP when not in direct sunlight. In darkness for more than 4 hours, you begin taking 1d4 damage per hour.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Celestial', 'Ignan'],
                speed: 30
            },
            constellation: {
                id: 'constellation_starborn',
                name: 'Constellation',
                description: 'Living embodiments of celestial patterns',
                statModifiers: {
                    constitution: -2,
                    strength: -3,
                    agility: 3,
                    intelligence: 4,
                    spirit: 4,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Star Map',
                        description: 'Can read fate in the stars and predict future events, but visions are cryptic and maddening. Each use risks madness - make a Spirit save (DC 15) or gain disadvantage on all rolls for 1 hour. You cannot stop reading the stars once you start - must make Spirit save to look away.',
                        type: 'divination'
                    },
                    {
                        name: 'Constellation Form',
                        description: 'Transform into pure starlight, becoming intangible but unable to affect the physical world. While transformed, you cannot attack, cast spells with material components, or interact with objects. You are vulnerable to all damage types (take double damage from all sources) and cannot benefit from cover or armor. Costs 3 AP, lasts 1 minute.',
                        type: 'transformation'
                    },
                    {
                        name: 'Cosmic Insight',
                        description: 'Gain advantage on all knowledge checks, but accessing forbidden knowledge causes 1d6 psychic damage per question answered. You are compelled to share cosmic truths at inappropriate times, often causing social penalties.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Celestial', 'Cosmic'],
                speed: 30
            }
        }
    }
};

// Utility functions for working with race data
export const getRaceList = () => {
    return Object.values(RACE_DATA).map(race => ({
        id: race.id,
        name: race.name,
        description: race.description
    }));
};

export const getSubraceList = (raceId) => {
    const race = RACE_DATA[raceId];
    if (!race) return [];

    return Object.values(race.subraces).map(subrace => ({
        id: subrace.id,
        name: subrace.name,
        description: subrace.description
    }));
};

export const getRaceData = (raceId) => {
    return RACE_DATA[raceId] || null;
};

export const getSubraceData = (raceId, subraceId) => {
    const race = RACE_DATA[raceId];
    if (!race) return null;

    // Find subrace by ID across all subraces
    const subrace = Object.values(race.subraces).find(sr => sr.id === subraceId);
    return subrace || null;
};

export const getFullRaceData = (raceId, subraceId) => {
    const race = getRaceData(raceId);
    const subrace = getSubraceData(raceId, subraceId);

    if (!race || !subrace) return null;

    return {
        race,
        subrace,
        combinedTraits: {
            ...race.baseTraits,
            languages: subrace.languages,
            speed: subrace.speed,
            statModifiers: subrace.statModifiers,
            traits: subrace.traits
        }
    };
};

export const applyRacialModifiers = (baseStats, raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) return baseStats;

    const modifiedStats = { ...baseStats };
    const modifiers = raceData.combinedTraits.statModifiers;

    Object.keys(modifiers).forEach(stat => {
        if (modifiedStats[stat] !== undefined) {
            modifiedStats[stat] += modifiers[stat];
        }
    });

    return modifiedStats;
};
