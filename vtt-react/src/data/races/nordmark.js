export const nordmark = {
        id: 'nordmark',
        name: 'Nordmark',
        description: 'We stand taller than other folk because the north demands it. Shoulders broad enough to carry what winter takes. Our skin bears the map of our lives-scars from blades, wind-burn from storms, pale mark of cold that never leaves. Frost falls from our lips even in the warmth of southern lands, a breath that crystallizes into ghosts of white we survived. We braid our hair with bone and iron because we are made of both. Our eyes hold the color of the winter sky: blue when storm breaks, gray when blizzard holds, pale green when aurora dances. We trace our blood to warrior-kings who carved their names into glacier ice with hammers stained red. But we remember them not as stories, but as debts. Every clan carries burdens from before common speech was born. Some carry ancient feuds, others sacred vows, still others the weight of kings who refused to die even when ice claimed their flesh. We are not merely human. The north remade us. Each winter hardened our flesh like steel. Each storm forged our will like weapons. We became something the cold recognizes as its own.',
        essence: 'Frost-hardened warriors',
        gradient: 'linear-gradient(135deg, #8B7355 0%, #A0522D 100%)',
        icon: 'fas fa-mountain',
        overview: `The wind screams outside our longhouse, carrying the voice of the glacier that buried my father and his father before him. Inside, the fire burns low-enough to see, not enough to warm. This is how we live. This is how we survive. My grandfather used to say that warmth makes you soft, that the north demands hardness because it intends to kill you. He survived five winters alone in the wastes before returning with his mind changed and his skin marked by frost that never faded. Now he's buried beneath the cairn stones outside, where the snow refuses to settle properly. The stones whisper if you listen close. Not lies exactly, but truths that would break lesser folk.

Our clans bind everything. You might think clan is family, but it's deeper. It's which ancestor you claim, which debts your blood owes, which feuds demand your death. The Bloodhammer clan traces to the first warrior-king who stood against the endless white and carved his kingdom from frozen waste with nothing but rage and a red-stained hammer. The Rune-Keepers claim descent from shaman-kings who walked into the deepest winter and returned with eyes that saw past and future woven together. The Frostbound... they say their scouts went too far into the eternal winter and came back changed, flesh hardened and cold become part of them. Each clan hates the others. Bloodhammers call Rune-Keepers whispering cowards who hide behind spirits. Rune-Keepers mock Bloodhammers as mindless beasts who've forgotten what it means to be human. Frostbound pity us both, looking down from their glacier peaks with eyes that barely remember what humanity feels like. But when the white comes, we all share the same fire and the same longhouse walls. The north doesn't care about clan feuds. It just kills anyone it can.

Children learn the clan web before they know their own names. Which bloodlines are bound by marriage-kin, which ones have spilled blood for five generations, which debts must be paid before honor can rest. I've seen six-year-olds recite feuds older than their grandfathers. We don't write things down often. The cold destroys paper. We carve our histories into runestones and speak them in tongues that predate common speech. Every rune tells a story. Every burial mound holds a debt. The longhouse fire doesn't just warm. It shows who owes what, which stories must be told tonight, which spirits need appeasing. When you sit at a Nordmark fire, you're sitting with everyone who ever sat there before you.

We don't take land. We claim it. Clan banners mark territory won through blood and winter, each banner a grave marker for those who died holding the ground. Survival requires strength in the north. Respect requires honor. But honor is a debt that grows heavier each generation. Wrongs unavenged. Sagas left unfinished. Blood debts passed down like heirlooms. I've seen marriages end over a blood-debt from three generations back. I've seen clan wars that lasted until everyone involved had forgotten why they started fighting. The traditions outlive empires because they work. Winter kills the weak. Only harsh ways keep folk alive up here.

When a Nordmark dies far from the longhouse fire, their spirit wanders the wastes seeking the light that leads to the ancestor halls. My grandmother claimed she saw her uncle's spirit, trapped in the ice for fifty years because he died raiding southern lands. She said the frost preserved his memory like meat in a cellar. But if you break a clan oath, that light never comes. Just endless white, wandering until the ice takes your name from memory itself. I've seen oathbreakers-they don't fear death. They fear being forgotten. They fear the cold that waits outside the longhouse walls, the cold that knows us all by name.`,
        variantDiversity: 'The Nordmark are divided into three major bloodlines, each with distinct traditions and values: The Bloodhammer value martial prowess and honor warriors above all, the Rune-Keepers preserve ancient lore and shamanic traditions, and the Frostbound have adapted to the deepest wastes through generations of hardship.',
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
            size: 'Medium',
            height: '6\'0" - 7\'0"',
            weight: '180-280 lbs',
            build: 'Tall and muscular'
        },
        sharedTraits: [
            {
                id: 'blood_debt_nordmark',
                name: 'Blood Debt',
                description: 'At character creation, declare one Blood Debt: an unresolved feud, a sacred vow, or an unpaid favor. When facing a situation directly related to your debt, gain +2 to all rolls. When facing a situation that contradicts or dishonors the debt, suffer -2 to all rolls. This debt can never be fully resolved — only replaced by a new one of equal weight.',
                level: 1,
                icon: 'spell_shadow_deathcoil',
                spellType: 'PASSIVE',
                effectTypes: ['buff', 'debuff'],
                typeConfig: {
                    school: 'spirit',
                    secondaryElement: 'ancestral',
                    icon: 'spell_shadow_deathcoil',
                    tags: ['debt', 'oath', 'social', 'passive', 'shared']
                },
                buffConfig: {
                    buffType: 'custom',
                    customDescription: '+2 to all rolls when acting in accordance with your Blood Debt',
                    effects: [
                        {
                            id: 'blood_debt_boon',
                            name: 'Debt Fulfilled',
                            description: '+2 to all rolls when facing a situation directly related to your declared Blood Debt',
                            statModifier: {
                                stat: 'all_rolls',
                                magnitude: 2,
                                magnitudeType: 'flat'
                            },
                            conditions: {
                                bloodDebtAligned: true
                            }
                        }
                    ],
                    durationValue: 0,
                    durationType: 'permanent',
                    durationUnit: 'permanent',
                    canBeDispelled: false
                },
                debuffConfig: {
                    debuffType: 'oathbreaker',
                    effects: [
                        {
                            id: 'blood_debt_penalty',
                            name: 'Oathbreaker Shame',
                            description: '-2 to all rolls when facing a situation that contradicts your declared Blood Debt',
                            statModifier: {
                                stat: 'all_rolls',
                                magnitude: -2,
                                magnitudeType: 'flat'
                            },
                            conditions: {
                                bloodDebtContradicted: true
                            }
                        }
                    ],
                    durationValue: 0,
                    durationType: 'permanent',
                    durationUnit: 'permanent',
                    canBeDispelled: false
                },
                targetingConfig: {
                    targetingType: 'self',
                    rangeType: 'self_centered'
                },
                resourceCost: {
                    actionPoints: 0,
                    mana: 0,
                    components: []
                },
                cooldownConfig: {
                    cooldownType: 'none',
                    cooldownValue: 0
                }
            },
            {
                id: 'northern_pride_nordmark',
                name: 'Northern Pride',
                description: 'Your debt-based culture reads as transparent aggression to southerners. You do not lie — you owe. Disadvantage on Deception checks against non-Nordmark NPCs.',
                level: 1,
                icon: 'spell_holy_auramastery',
                spellType: 'PASSIVE',
                effectTypes: ['debuff'],
                typeConfig: {
                    school: 'physical',
                    icon: 'spell_holy_auramastery',
                    tags: ['social', 'deception', 'friction', 'passive', 'shared']
                },
                debuffConfig: {
                    debuffType: 'socialPenalty',
                    effects: [
                        {
                            id: 'deception_penalty',
                            name: 'Honest as Iron',
                            description: 'Disadvantage on Deception checks against non-Nordmark NPCs',
                            statusEffect: {
                                level: 'moderate',
                                description: 'Disadvantage on Deception vs non-Nordmark NPCs',
                                appliesTo: 'deception_checks',
                                condition: 'target_is_not_nordmark'
                            }
                        }
                    ],
                    durationValue: 0,
                    durationType: 'permanent',
                    durationUnit: 'permanent',
                    canBeDispelled: false
                },
                targetingConfig: {
                    targetingType: 'self',
                    rangeType: 'self_centered'
                },
                resourceCost: {
                    actionPoints: 0,
                    mana: 0,
                    components: []
                },
                cooldownConfig: {
                    cooldownType: 'none',
                    cooldownValue: 0
                }
            },
            {
                id: 'longhouse_fire_nordmark',
                name: 'Longhouse Fire',
                description: 'When resting near an open flame with at least one other Nordmark character, both gain +2 HP recovered during a short rest. The longhouse fire is memory and belonging. A random campfire in the south provides no benefit.',
                level: 1,
                icon: 'spell_fire_flameblades',
                spellType: 'PASSIVE',
                effectTypes: ['buff', 'utility'],
                typeConfig: {
                    school: 'fire',
                    secondaryElement: 'spirit',
                    icon: 'spell_fire_flameblades',
                    tags: ['rest', 'healing', 'social', 'passive', 'shared']
                },
                buffConfig: {
                    buffType: 'custom',
                    customDescription: '+2 HP recovered during short rest when near open flame with another Nordmark character',
                    effects: [
                        {
                            id: 'longhouse_rest_bonus',
                            name: 'Fire-Kin Bond',
                            description: '+2 HP recovered during short rest when near open flame with at least one other Nordmark',
                            statModifier: {
                                stat: 'short_rest_hp_recovery',
                                magnitude: 2,
                                magnitudeType: 'flat'
                            },
                            conditions: {
                                nearOpenFlame: true,
                                withNordmarkAlly: true
                            }
                        }
                    ],
                    durationValue: 0,
                    durationType: 'permanent',
                    durationUnit: 'permanent',
                    canBeDispelled: false
                },
                targetingConfig: {
                    targetingType: 'self',
                    rangeType: 'self_centered'
                },
                resourceCost: {
                    actionPoints: 0,
                    mana: 0,
                    components: []
                },
                cooldownConfig: {
                    cooldownType: 'none',
                    cooldownValue: 0
                }
            }
        ],
        epicHistory: `
The First Breaking came before memory was written. Ancient frost lords descended from the eternal ice, their hunger for warmth absolute and terrible. For three generations, the southern kingdoms fell one by one—castle walls shattered like glass, armies frozen in mid-charge, entire bloodlines extinguished in a single night of screaming winds. Only the forge-clans of the deep holds survived, hammering sacred wards into iron until their bones rattled with the rhythm of war.

During the War of Thousand Screams, my grandfather watched his father and three brothers die defending the Frostgate Pass. They fell not to steel, but to the cold that waited until they had killed every enemy before turning on them. The survivors returned changed. Their skin held the pale mark of frost that never faded. Their eyes saw things in the blizzard that were not snow—shapes moving between the flakes, voices that weren't wind, memories that didn't belong to the living.

The northern clans united once, under the banner of the Last Alliance. Together they pushed the frost lords back, reclaiming territories lost for a century. But the victory came at a cost. The Rune-Keepers who led the alliance went mad from the rituals, their minds fractured by the whispers of the frozen dead. The Bloodhammers who fought beside them lost too many warriors, their bloodlines thinning with each campaign. The Frostbound scouts returned from the deepest wastes changed, their flesh now half-ice, their hearts beating with unnatural slowness. The alliance shattered. The feuds returned. The frost lords retreated to bide their time.

Now the Grand Alliance calls the armies east to face a new shadow. The mountain passes stand undefended. The forge-clans send their warriors away, leaving only the elderly and the young to hold the ancestral lands. The merchants of the southern cities grow bold, their caravans testing the northern borders, their spies seeking the secrets of the deep holds. The frost lords stir again beneath the ice, their hunger undiminished by the passage of centuries.
        `,
        notableFigures: [
            {
                name: 'King Magni Frostborn',
                title: 'The Unbroken King',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The last of the Unbroken Kings, Magni bears the weight of five generations of sacrifice. During the War of Thousand Screams, he watched his father and three brothers die defending the Frostgate Pass. Their bodies were encased in ice that still stands as monument, preserved by the very cold that claimed them. Now he rules from the Iron Throne of Dun Morogh, his beard white as the snows that took everything he loved.

Though his people whisper that his heart grows cold with age, none question his right to rule. The iron does not lie. The iron remembers. He spends his days hearing disputes between the Bloodhammer and Rune-Keeper clans, his judgments harsh but fair, his authority absolute. At night, he descends to the deepest forges alone, hammering at the same anvil his father used, as if the metal might remember the voice it once knew.

He has refused every call to join the Grand Alliance's eastern campaign. Someone must hold the north. Someone must watch the passes. Someone must remember the cost of breaking the frost lords' hunger. That burden falls to him, as it fell to his father, and to his father before him.
                `
            },
            {
                name: 'Bromar Frostfinder',
                title: 'The Lost Explorer',
                portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
                backstory: `
One of the greatest explorers to ever walk the frozen wastes, Bromar Frostfinder made friends in every charted land and presumably those uncharted as well. He spent forty years mapping the northern territories, discovering forgotten vaults of the ancients, uncovering weapons from before the frost lords, and documenting the customs of clans that had vanished entirely.

Then came the expedition north. Bromar sought the source of the frost lords' power, believing that understanding their origins might prevent their return. He took only a small company of trusted scouts, leaving a final message: "I return with answers or not at all." Three years passed. Then five. Then ten.

The northern hunters speak of him sometimes—sightings of a lone figure in armor too ancient to be modern, a campfire burning with impossible warmth in the depths of winter, footsteps that don't vanish in the snow. They say he found something beneath the ice. They say he learned why the frost lords hunger. They say he chose not to return, because what he learned would break the world's heart.
                `
            },
            {
                name: 'Elder Matriarch Halvarna',
                title: 'Voice of the Ancients',
                portraitIcon: 'Armor/Head/head-split-orange-faceplate-helmet',
                backstory: `
The oldest living Rune-Keeper, Halvarna has seen twelve winters beyond what any thought possible. Her skin is the color of parchment, her eyes clouded with cataracts of white, but when she speaks, the entire clan goes silent. She remembers the First Breaking. She witnessed the War of Thousand Screams. She holds the histories that other clans lost when their libraries burned and their elders fell.

Children are brought to her longhouse from across the northern territories. She touches their faces and names their ancestors back seven generations, reciting debts and feuds that the children never knew existed. She performs the binding rituals that unite bloodlines through marriage-kin, and the severing rituals that declare blood feuds beyond reconciliation.

The merchants from the south offer her gold for the secrets of the deep holds. The spies of foreign kings ask about the forge-wards and the runes of protection. She answers all of them the same way: "The north remembers what you choose to forget. The iron keeps what the paper cannot survive." Then she returns to her fire and waits for the next voice to call from the ice.
                `
            }
        ],
        majorLocations: [
            {
                name: 'Ironhold Mountain',
                description: `
The mightiest fortress of the northern clans, Ironhold Mountain was never breached by the frost lords. Carved directly into the living rock of Dun Maragh, its gates are thick enough to stop an army, its forges hot enough to melt enchanted ice, its halls deep enough to hold the entire population of three Bloodhammer clans combined.

The mountain itself is more than a fortress. It's a weapon. Its anvils ring with the sound of war hammers day and night, producing the iron that broke the frost lords' advance. Its vaults hold weapons forged by ancestors whose names are forgotten, blades that hunger for battle, armor that remembers every blow it's ever taken.

Currently, Ironhold operates at half-capacity. The journeyman smiths marched east with the Grand Alliance, leaving only the masters and their apprentices. The great gates that once admitted caravans of trade now open rarely, their watchful eyes scanning the horizon for the first sign of the frost lords' return.
                `
            },
            {
                name: 'Frostgate Pass',
                description: `
The narrowest crossing through the northern mountains, Frostgate Pass has been defended for three hundred years. Its walls are lined with the armor of those who died holding it—plate rusted by centuries, shields shattered by countless blows, helmets dented by frost lord steel. The wind screams through the pass eternally, a voice that echoes the battle cries of all who've fallen.

During the War of Thousand Screams, King Magni's father and three brothers perished here. Their bodies were left where they fell, becoming the first line of defense against any who would attack from the north. Now their frozen remains serve as monument and warning, a reminder that the cost of holding the pass is measured in blood.

Today, only a token garrison mans Frostgate. The real armies march east. The pass waits, empty and howling, for the frost lords to test its defenses once more.
                `
            }
        ],
        currentCrisis: `
The armies of the Grand Alliance have marched east to face a growing shadow, leaving the mountain passes undefended. You must defend the forge-lands from those who would steal the sacred iron. Subversive traitors among the merchant clans sell the secrets of the deep holds to enemies who lurk beyond the frozen horizon, trading away the wards that protected their ancestors for gold they don't need.

The frost lords stir again beneath the eternal ice. The northern scouts report strange lights in the deepest wastes, footprints that don't match any known creature, whispers on the wind that speak of hunger undiminished by the passage of centuries. The Rune-Keepers perform rituals of divination, their bones rattling with visions of a war to come.

The forge-clans send their best warriors east, leaving the mountain holds populated by elders who can no longer fight and children who have not yet learned. The southern cities grow bold, their caravans probing the northern borders, their spies seeking weaknesses in the ancient defenses.

Now is the time for heroes. The north stands at the edge of another breaking, and this time there may be no alliance to call upon. You must defend the ancestral lands. You must uncover the traitors who sell their own people. You must stand at Frostgate Pass and hold until your blood freezes upon the walls. Now the Nordmark's greatest chapter can be told—or its last.
        `,
        culturalPractices: `
Before your sixteenth winter, you forge your own weapon. The tradition is older than memory, born in the days when the first warrior-kings had no steel to spare and every warrior needed to fight with the same blade they would die with. The forging happens in silence under the aurora, with no fire but the heat of your own hands and the cold of the northern air. When the steel cools, you mark it with your own blood. Then it goes to battle. Only when it tastes an enemy's life does the ritual complete. The weapon becomes you. Every notch in the handle is a memory. Every chip is a story for the longhouse fire.

Bloodhammer longhouses are armories. The walls are lined with hammers and axes from warriors long dead, each weapon telling the story of a life lived in the shadow of the eternal ice. Old warriors say these weapons still hunger—that sometimes in deep winter you hear them whisper of battles yet to come. Or maybe that's just the wind through old steel.

The berserker rituals are passed down through generations, secret rites that change you. Trance states where you enter a fury so complete that wounds that would kill others become nothing. Pain becomes fuel. When the rage takes hold, your muscles swell, your veins stand out like cords, your breathing turns to a growl. But when it breaks, you return to yourself hollowed out. Your humanity burned away, left pale and shaking. Many Bloodhammer die young—not from enemy steel, but from the rage itself.

Honor is measured in kills counted, enemies crushed, songs sung about your deeds where the ancestors listen. Blood feuds are settled in dawn duels, fought with weapons that've never lost. Insults get answered with steel. Mercy is shown only to those who've earned it through their own strength.

When a Nordmark dies far from the longhouse fire, their spirit wanders the wastes seeking the light that leads to the ancestor halls. My grandmother claimed she saw her uncle's spirit, trapped in the ice for fifty years because he died raiding southern lands. She said the frost preserved his memory like meat in a cellar. But if you break a clan oath, that light never comes. Just endless white, wandering until the ice takes your name from memory itself.
        `,

        subraces: {
            berserker: {
                id: 'berserker_nordmark',
                name: 'Bloodhammer',
                description: 'Muscle built from swinging hammers through bone. Brands burned into forearms during weapon rites. Scars map every fight they\'ve survived. Eyes burn red when the fury takes them. Hair braided with leather strips and old iron rings. Every warrior forges their own weapon before adulthood, hammer or axe marked with their blood, then an enemy\'s.',
                culturalBackground: `The sagas tell of the first warrior-king who stood alone against the endless white and carved his name into glacier ice with a hammer stained red. That hammer still hangs in the oldest Bloodhammer longhouse, handle wrapped in leather from his enemies' hides, metal dark with the rust of centuries. The Bloodhammer claim direct descent. Their blood carries the fury that birthed kingdoms from frozen waste. Before your sixteenth winter, you forge your own weapon. Not a sword. Hammer or axe. It becomes your life. The forging happens in silence under the aurora. When the steel cools, you mark it with your own blood. Then it goes to battle. Only when it tastes an enemy's life does the ritual complete. The weapon becomes you. Every notch in the handle is a memory. Every chip is a story for the longhouse fire. Bloodhammer longhouses are armories. Walls lined with hammers and axes from warriors long dead. Each weapon tells a story. The hammer with wolf-fur handle belonged to someone who fought three days through a blizzard. The axe with the broken haft marks the weapon of one who held a pass alone against fifty. Old warriors say these weapons still hunger. Sometimes in deep winter you hear them whisper of battles yet to come. Or maybe that's just the wind through old steel. The berserker rituals pass down through generations. Secret rites that change you. Trance states where you enter a fury so complete that wounds that would kill others become nothing. Pain becomes fuel. When the rage takes hold, muscles swell, veins stand out like cords, breathing turns to a growl. But when it breaks, you return to yourself hollowed out. Your humanity burned away, left pale and shaking. Many Bloodhammer die young. Not from enemy steel but from the rage itself. Hearts give out. Honor's measured in kills counted, enemies crushed, songs sung about your deeds where the ancestors listen. Blood feuds settle in dawn duels. Weapons that've never lost. Insults get answered with steel, not words. They're the shield-wall. First line against whatever threatens the clans. Fight beside one and you'll see something that unsettles you. Their fury knows no bounds. Their honor demands death before retreat. When a Bloodhammer dies in true battle-fury, their spirit joins the warrior-ancestors. Their weapon takes its place among the honored dead, ready for the next war.`,
                statModifiers: {
                    strength: 3,
                    constitution: 2,
                    charisma: -3
                },
                traits: [
                    {
                        id: 'frostborn_nordmark',
                        name: 'Frostborn',
                        description: 'Generations of surviving the endless white have forged your bloodline into something almost glacial, your very essence tempered by the cold that would shatter lesser folk.',
                        level: 1,
                        icon: 'spell_frost_frostarmor',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'frost',
                            icon: 'spell_frost_frostarmor',
                            tags: ['resistance', 'frost', 'environmental', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'frost_resistance',
                                    name: 'Frost Resistance',
                                    description: 'Your bloodline, shaped by endless winters, naturally resists the frost that would freeze others',
                                    statModifier: {
                                        stat: 'frost_resistance',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    id: 'ice_strider',
                                    name: 'Ice Strider',
                                    description: 'Snow and ice are never difficult terrain for you',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Ignore difficult terrain from snow and ice'
                                    }
                                },
                                {
                                    id: 'frostborn_armor',
                                    name: 'Frozen Stance',
                                    description: 'Standing still on snow or ice for 1 round grants +2 armor until you move more than 10ft',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: 2,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        terrain: ['snow', 'ice'],
                                        stationary: true,
                                        duration: 1,
                                        breaksOn: { moveDistance: 10 }
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'stealth',
                            selectedEffects: [{
                                id: 'snow_tracks',
                                name: 'Trackless Snow',
                                description: 'Leave no tracks in snow'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'frost_rage_nordmark',
                        name: 'Frost Rage',
                        description: 'When death draws near, the ancient berserker blood awakens, flooding your veins with glacial fury that turns your strikes to ice and hardens your flesh against steel.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'frost',
                            icon: 'ability_warrior_rampage',
                            tags: ['rage', 'combat', 'berserker', 'frost']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'frost_melee_damage',
                                    name: 'Frost Strikes',
                                    description: 'Your melee attacks deal an additional 1d8 frost damage',
                                    statModifier: {
                                        stat: 'frost_damage_melee',
                                        magnitude: '1d8',
                                        magnitudeType: 'dice'
                                    }
                                },
                                {
                                    id: 'physical_resistance',
                                    name: 'Frozen Hide',
                                    description: 'Your flesh hardens like ice, granting 50% resistance to physical damage',
                                    statModifier: {
                                        stat: 'physical_resistance',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    id: 'prone_immunity',
                                    name: 'Unshakable',
                                    description: 'You are immune to being knocked prone while the rage endures',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Immune to prone'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'restriction',
                            effects: [
                                {
                                    id: 'healing_blocked',
                                    name: 'Frost Haze',
                                    description: 'Healing spells cannot target you; only potions from an adjacent ally, regeneration, or killing blows restore health',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Healing blocked except potions from adjacent ally, regen, and killing blows'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: false
                        },
                        triggerConfig: {
                            requiredConditions: {
                                healthBelow: 50
                            }
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 1,
                            mana: 0,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'long_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'blood_on_snow_nordmark',
                        name: 'Blood on the Snow',
                        description: 'When the cold has taken hold of your enemy and their blood begins to slow, a single well-placed strike can end them \u2014 crimson on white, mercy in the ice.',
                        level: 1,
                        icon: 'spell_frost_frostbolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'frost',
                            icon: 'spell_frost_frostbolt',
                            tags: ['combat', 'critical', 'frost', 'passive']
                        },
                        buffConfig: {
                            buffType: 'combatAdvantage',
                            effects: [
                                {
                                    id: 'auto_crit_wounded',
                                    name: 'Executioner\'s Strike',
                                    description: 'Melee attacks automatically critically hit enemies below 30% HP who have a frost debuff. Once per target per combat.',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Auto-crit enemies below 30% HP with frost debuff, once per target per combat'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'rage_burn_nordmark',
                        name: 'Rage Burn',
                        description: 'The berserker fury that fuels your bloodline leaves you hollow when it fades, your spirit scarred and vulnerable to flames that echo the burning rage within, and psychic forces that prey upon your fractured mind.',
                        level: 1,
                        icon: 'spell_fire_soulburn',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'fire',
                            icon: 'spell_fire_soulburn',
                            tags: ['vulnerability', 'rage', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Fire Vulnerability',
                                    description: 'The inner rage that sustains you makes you vulnerable to external flames that mirror your burning fury',
                                    statusEffect: {
                                        vulnerabilityType: 'fire',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Psychic Vulnerability',
                                    description: 'Your fractured mind, shaped by berserker rages, cannot resist psychic intrusions that echo your internal turmoil',
                                    statusEffect: {
                                        vulnerabilityType: 'psychic',
                                        vulnerabilityPercent: 50
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    },
                    {
                        id: 'oath_of_steel_nordmark',
                        name: 'Oath of Steel',
                        description: 'A Bloodhammer cannot refuse a formal challenge to single combat. If challenged and they refuse, they suffer -2 to all rolls for 24 hours as oathbreaker\'s shame eats at their soul. Only a Blood Debt of higher priority can override this compulsion.',
                        level: 1,
                        icon: 'ability_warrior_weaponmastery',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff', 'utility'],
                        typeConfig: {
                            school: 'physical',
                            secondaryElement: 'spirit',
                            icon: 'ability_warrior_weaponmastery',
                            tags: ['oath', 'duel', 'honor', 'social', 'friction', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'oathbreaker',
                            effects: [
                                {
                                    id: 'oathbreaker_shame',
                                    name: 'Oathbreaker\'s Shame',
                                    description: '-2 to all rolls for 24 hours if a formal challenge to single combat is refused',
                                    statModifier: {
                                        stat: 'all_rolls',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        refusedChallenge: true,
                                        duration: 24,
                                        durationUnit: 'hours'
                                    }
                                }
                            ],
                            durationValue: 24,
                            durationType: 'hours',
                            durationUnit: 'hours',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'social',
                            selectedEffects: [{
                                id: 'forced_duel',
                                name: 'Duel Compulsion',
                                description: 'Must accept formal challenges to single combat. Only a higher Blood Debt overrides this.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'major'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'feud_memory_nordmark',
                        name: 'Feud Memory',
                        description: 'At character creation, choose one faction or family that your clan holds a blood feud against. NPCs of that faction start as Hostile and their disposition cannot be improved through Persuasion — only through duel resolution, completing a blood-debt quest, or direct intervention by a Nordmark elder.',
                        level: 1,
                        icon: 'spell_shadow_unholystrength',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'ancestral',
                            icon: 'spell_shadow_unholystrength',
                            tags: ['feud', 'social', 'friction', 'faction', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'socialPenalty',
                            effects: [
                                {
                                    id: 'feud_hostility',
                                    name: 'Blood Feud',
                                    description: 'NPCs of the chosen feud faction start as Hostile. Cannot be improved via Persuasion. Only resolved through duel, blood-debt quest, or Nordmark elder intervention.',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Hostile disposition with feud faction. Persuasion blocked.',
                                        appliesTo: 'faction_npc_disposition',
                                        factionHostile: true,
                                        resolutionMethods: ['duel', 'blood_debt_quest', 'nordmark_elder_intervention']
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 32, // Hardy warriors with battle scars and cold resistance
                    mana: 18, // Limited spiritual connection
                    ap: 4, // Aggressive warriors, extra action point from battle readiness
                    passivePerception: 12, // Warriors need to spot enemies
                    swimSpeed: 15, // Not great swimmers, calculated from speed
                    climbSpeed: 15, // Mountain folk, decent climbers
                    visionRange: 55,
                    darkvision: 0,
                    initiative: 2 // Warriors who fight first, quick to react
                },
                savingThrowModifiers: {
                    // Battle-hardened warriors resist fear but are vulnerable to being stunned
                    disadvantage: ['stun'], // Berserker rage makes them susceptible to being stunned
                    advantage: ['fear'] // Battle-hardened, resist fear effects
                }
            },
            skald: {
                id: 'skald_nordmark',
                name: 'Rune Keeper',
                description: 'Many Nordmark secrets were lost to the endless winters, but the ancient libraries of the Rune-Keepers, carved into frozen caves deep within the wastes, have never surrendered their knowledge to the cold. A marvel to the Nordmark\'s skill at preserving memory in ice and stone, Rune-Keeper sanctuaries were constructed in places where ice has never melted: vast underground networks of seers, historians, and spirit-speakers. While the northern traditions have been weakened by centuries of change, the Rune-Keepers of the Frozen Halls, led by Seer Mara Rune-Touched, are weaving a new understanding of the eternal winter.',
                culturalBackground: `The oldest sagas speak of the first shaman-king who walked alone into the deepest winter and returned changed-their eyes saw not the present but threads of past and future woven together. That first keeper learned to read omens in ice patterns on glass, to hear dead ancestors in the aurora's dance, to carve runes that hold memory itself. The Rune-Keepers trace their bloodline to this ancestor, carrying what they call a gift, though some whisper it is a curse.

Before their eighteenth winter, every Rune-Keeper undertakes the vision quest-not a rite of passage, but a breaking, a remaking. They are taken to frozen caves deep in the wastes, places where ice has never melted, where cold burns with an intensity that sears. Here, alone in darkness broken only by aurora-light through cracks in the ice, they spend days without food or fire, sustained only by visions granted by the ancestors.

When the visions come, and they always come, the runes get carved into their flesh with needles made from the bones of previous keepers. Each rune marks a story learned, a secret kept, a debt owed to the dead. The carving is slow, deliberate, and permanent-knowledge that cannot be unlearned. These runes don't fade. They grow deeper with age, scars piling up like pages in a book written in flesh. Sometimes overlapping, creating new patterns and new meanings.

Rune-Keeper longhouses are libraries rather than armories. Their walls are lined with shelves of carved bone tablets. Their floors are marked with runic circles that glow faintly in firelight. Here, sagas are preserved not just in words but in memory-stones that whisper if you know how to listen. They are historians keeping records spanning millennia, judges whose rulings carry the weight of ancestral precedent, mediators who see disputes through dead eyes.

Rituals let them commune with spirits bound to ice and storm, speaking with ancestors who haven't passed on but linger in the spaces between breaths, in the silence of deep winter. But it costs. Every time a Rune-Keeper peers into fate or communes with the dead, they lose a piece of themselves-a memory burned away, a feeling they can no longer name. Some forget what warmth feels like. Others forget what it meant to love or hate. The ancestors don't care about their souls. They care about what can be seen for them.

The Rune-Keepers view the Bloodhammer as mindless beasts who have forgotten what it means to be human, whose rage is just an excuse to avoid thinking about how empty their lives become between battles. When the fury fades, what is left? Bloodhammer become hollow. The Rune-Keepers, through their transformations, become something else-something that sees beyond the hunger, beyond the cold, beyond the endless white.

They view the Frostbound with a complex mixture of pity and recognition. The Frostbound look at their runes and say they're marked by the same cold that marked them, just in a different way. The Rune-Keepers see kinship-their runes come from visions and ancestors, the Frostbound's scars come from surviving where nothing should survive. Both are marked by the eternal winter, but while the Frostbound let the cold remake their flesh, the Rune-Keepers let it remake their minds.`,
                statModifiers: {
                    spirit: 3,
                    intelligence: 2,
                    strength: -2
                },
                traits: [
                    {
                        id: 'frostborn_rune_keeper',
                        name: 'Frostborn',
                        description: 'The endless winters that shaped your ancestors have woven frost into your very being, your blood flowing like glacial water that laughs at the cold lesser folk fear.',
                        level: 1,
                        icon: 'spell_frost_frostarmor',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'frost',
                            icon: 'spell_frost_frostarmor',
                            tags: ['resistance', 'frost', 'environmental', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'frost_resistance',
                                    name: 'Frost Resistance',
                                    description: 'Your ancestral blood, forged in endless winter, naturally shrugs off the frost that would freeze others',
                                    statModifier: {
                                        stat: 'frost_resistance',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    id: 'ice_strider',
                                    name: 'Ice Strider',
                                    description: 'Snow and ice are never difficult terrain for you',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Ignore difficult terrain from snow and ice'
                                    }
                                },
                                {
                                    id: 'frostborn_armor',
                                    name: 'Frozen Stance',
                                    description: 'Standing still on snow or ice for 1 round grants +2 armor until you move more than 10ft',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: 2,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        terrain: ['snow', 'ice'],
                                        stationary: true,
                                        duration: 1,
                                        breaksOn: { moveDistance: 10 }
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'stealth',
                            selectedEffects: [{
                                id: 'snow_tracks',
                                name: 'Trackless Snow',
                                description: 'Leave no tracks in snow'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'runic_inscription_nordmark',
                        name: 'Runic Inscription',
                        description: 'Close your eyes and the runes answer \u2014 ancient symbols of power carved into the world\'s bones, each stroke a word of creation that reshapes reality itself.',
                        level: 1,
                        icon: 'spell_shadow_coneofsilence',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'frost',
                            secondaryElement: 'arcane',
                            icon: 'spell_shadow_coneofsilence',
                            tags: ['rune', 'warding', 'divination', 'arcane']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Carve a rune into a surface. Choose one: Rune of Warding (10ft zone, ally entering gains immunity to next status effect, 1 min), Rune of Wrath (attach to weapon, next attack deals 2d8 frost + slow 10ft for 1 round), or Rune of Sight (see through from 1 mile, max 2 active).',
                            effects: [
                                {
                                    id: 'rune_of_warding',
                                    name: 'Rune of Warding',
                                    description: 'Carve a protective rune. Allies entering the 10ft zone gain immunity to the next status effect. Lasts 1 minute or absorbs one effect.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Immunity to next status effect within 10ft zone'
                                    }
                                },
                                {
                                    id: 'rune_of_wrath',
                                    name: 'Rune of Wrath',
                                    description: 'Enchant a weapon with frost. Next attack deals 2d8 frost damage and slows target 10ft for 1 round. One-use.',
                                    statModifier: {
                                        stat: 'frost_damage_weapon',
                                        magnitude: '2d8',
                                        magnitudeType: 'dice'
                                    }
                                },
                                {
                                    id: 'rune_of_sight',
                                    name: 'Rune of Sight',
                                    description: 'Carve a scrying rune. See through it from up to 1 mile away. Maximum 2 active runes.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Remote vision from up to 1 mile, max 2 active'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: true
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'runic_inscription',
                                name: 'Runic Inscription',
                                description: 'Carve a rune into a surface to create a magical effect'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 2,
                            mana: 8,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'ancestral_echo_nordmark',
                        name: 'Ancestral Echo',
                        description: 'The spirits of your ancestors linger at the edge of fate, and when fortune turns against you with the cruelest roll, they reach through the veil to grant you one more chance.',
                        level: 1,
                        icon: 'spell_holy_divineintervention',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'frost',
                            secondaryElement: 'spirit',
                            icon: 'spell_holy_divineintervention',
                            tags: ['reroll', 'saving_throw', 'ancestral', 'passive']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Reroll a natural 1 on any saving throw. Must take the new result. Once per long rest.',
                            effects: [
                                {
                                    id: 'ancestral_reroll',
                                    name: 'Ancestral Intervention',
                                    description: 'When you roll a natural 1 on a saving throw, you may reroll it. You must take the new result. Once per long rest.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Reroll natural 1 on saving throws, once per long rest'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'long_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'ancestral_toll_nordmark',
                        name: 'Ancestral Toll',
                        description: 'Every time you use Runic Inscription or Ancestral Echo, you permanently forget one minor memory. After 5 forgotten memories, you gain a permanent -1 to all Charisma-based checks as your humanity erodes. This stacks: every 5 forgotten memories adds another -1. There is no way to recover lost memories. Additionally, your connection to the ancestral realm leaves you vulnerable to fire and necrotic energies.',
                        level: 1,
                        icon: 'spell_shadow_soulleech',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'necrotic',
                            icon: 'spell_shadow_soulleech',
                            tags: ['vulnerability', 'spirit', 'memory', 'passive', 'stacking']
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Fire Vulnerability',
                                    description: 'Your ancestral connection makes you vulnerable to purifying flames that burn away the veil between worlds',
                                    statusEffect: {
                                        vulnerabilityType: 'fire',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Necrotic Vulnerability',
                                    description: 'The spirits you commune with leave you susceptible to necrotic energies that echo the death they have transcended',
                                    statusEffect: {
                                        vulnerabilityType: 'necrotic',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    id: 'memory_erosion',
                                    name: 'Memory Erosion',
                                    description: 'Permanently forget one minor memory each time Runic Inscription or Ancestral Echo is used. After 5 forgotten memories, gain permanent -1 to all Charisma-based checks. Stacks every 5 memories.',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Humanity erodes with each use of ancestral powers',
                                        stacking: true,
                                        threshold: 5,
                                        penaltyPerStack: -1,
                                        affectedStat: 'charisma_checks',
                                        trackingType: 'forgotten_memories'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    },
                    {
                        id: 'spirit_debt_nordmark',
                        name: 'Spirit Debt',
                        description: 'After using Ancestral Echo, the ancestors demand tribute. If you do not perform a 10-minute ritual recounting a deed at a longhouse fire or runestone within 24 hours, your next Runic Inscription costs double mana. Each unpaid debt compounds. Three unpaid debts and the ancestors withhold guidance entirely — Ancestral Echo is disabled until debts are paid through a 1-hour Seance ritual.',
                        level: 1,
                        icon: 'spell_shadow_mindrot',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'ancestral',
                            icon: 'spell_shadow_mindrot',
                            tags: ['debt', 'spirit', 'resource', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'resourcePenalty',
                            effects: [
                                {
                                    id: 'compounding_mana_debt',
                                    name: 'Unpaid Tribute',
                                    description: 'Next Runic Inscription costs double mana if 10-minute tribute ritual not performed within 24 hours of using Ancestral Echo. Compounds with each unpaid debt.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Runic Inscription mana cost doubles per unpaid debt',
                                        resourceAffected: 'mana',
                                        costMultiplier: 2,
                                        stacking: true,
                                        tributeRitualDuration: 10,
                                        tributeRitualDurationUnit: 'minutes',
                                        tributeDeadline: 24,
                                        tributeDeadlineUnit: 'hours'
                                    }
                                },
                                {
                                    id: 'ancestral_abandonment',
                                    name: 'Ancestral Abandonment',
                                    description: 'After 3 unpaid debts, Ancestral Echo is disabled until a 1-hour Seance ritual is performed at a longhouse fire or runestone.',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Ancestral Echo disabled. Requires 1-hour Seance ritual to restore.',
                                        abilityLocked: 'ancestral_echo',
                                        debtThreshold: 3,
                                        restorationRitual: 'seance',
                                        restorationDuration: 1,
                                        restorationDurationUnit: 'hours'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'runescarred_nordmark',
                        name: 'Runescarred',
                        description: 'The bone-needle scars covering your flesh are visible and unsettling. Non-Nordmark NPCs react with Suspicion — disadvantage on the first Persuasion or Deception check with any NPC who can see your scars. Nordmark NPCs are unaffected.',
                        level: 1,
                        icon: 'spell_shadow_fumble',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'physical',
                            icon: 'spell_shadow_fumble',
                            tags: ['social', 'friction', 'appearance', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'socialPenalty',
                            effects: [
                                {
                                    id: 'suspicion',
                                    name: 'Suspicion',
                                    description: 'Disadvantage on first Persuasion or Deception check with non-Nordmark NPCs who can see your runescars',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Disadvantage on first Persuasion/Deception vs non-Nordmark NPCs who can see scars',
                                        appliesTo: ['persuasion', 'deception'],
                                        condition: 'target_is_not_nordmark_and_can_see_scars',
                                        firstInteractionOnly: true
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 16, // Frail from spiritual communion
                    mana: 38, // Strong spiritual connection
                    ap: 2, // More contemplative, less action-oriented
                    passivePerception: 14, // Enhanced perception from seeing threads others can't
                    swimSpeed: 10, // Not swimmers, calculated from speed
                    climbSpeed: 20, // They go to frozen caves, decent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: -1 // Not warriors, slower to react
                },
                savingThrowModifiers: {
                    // Ethereal connection provides advantage against necrotic effects and mental control
                    advantage: ['fear'], // Spirit communion resists fear effects
                    disadvantage: ['charm'] // Ethereal nature vulnerable to magical control
                }
            },
            icewalker: {
                id: 'icewalker_nordmark',
                name: 'Frostbound',
                description: 'Many Nordmark settlements were abandoned to the endless white, but the outposts of the Frostbound, built on the very edge of the eternal winter where reality itself begins to freeze, have never surrendered to the storm alone. A testament to the Nordmark\'s skill at adapting to the impossible, Frostbound fortifications were constructed in glacier peaks where wind never stops and the sun barely reaches: vast networks of underground tunnels carved into living ice. While other Nordmark clans have been weakened by their feuds and traditions, the Frostbound of the Deep Ice, led by Scout Elder Nal Ice-Walker, are forging an existence that the north itself recognizes.',
                culturalBackground: `Many Nordmark settlements were abandoned to the endless white, but the outposts of the Frostbound, built on the very edge of the eternal winter where reality itself begins to freeze, have never surrendered to the storm alone. A testament to the Nordmark's skill at adapting to the impossible, Frostbound fortifications were constructed in glacier peaks where wind never stops and the sun barely reaches: vast networks of underground tunnels carved into living ice. While the other Nordmark clans have been weakened by their feuds and traditions, the Frostbound of the Deep Ice, led by Scout Elder Nal Ice-Walker, are forging an existence that the north itself recognizes.

The sagas tell of scouts who went too far into the eternal winter, into places where cold doesn't just kill but transforms. They didn't return as they left-they came back changed, flesh hardened, breath no longer visible because their lungs learned to breathe the cold itself. The Frostbound claim descent from those altered scouts. Their bloodline carries the mark. Their tradition is one of the harshest.

Before they can take their place in the longhouse, every Frostbound spends three winters alone in the deepest wastes-places even Rune-Keepers won't go. These are not survival tests but initiations, a communion with cold so absolute it remakes the body. Through generations of this rite, their bloodline has adapted in ways that border on unnatural. Flesh grows harder each winter. Cold tolerance becomes legendary. Bodies shaped by the land itself.

Some say the eternal winter recognizes them, that the cold welcomes them home. Frostbound longhouses rise in the worst places-glacier peaks where wind never stops, valleys the sun barely reaches, places other Nordmark won't build. They are outposts, forward positions. Frostbound scout ahead, guide paths that only exist in winter, guard borders most can't even see. Their survival arts are passed down not from books, but from the land itself-how to read ice stories as they form, how to find food in frozen ground, how to endure cold that would shatter steel.

Endurance matters most. Honor is measured in winters survived, paths found through terrain that kills. Independence matters. In the deepest cold, relying on others means death.

But it costs. Each generation tolerates warmth less. Their hardened flesh cracks in temperatures others find comfortable. Skin splits wider. Bodies betray them in summer lands. Many Frostbound cannot leave the north-the transformation is too complete. Warmth becomes poison. Skin cracks and bleeds. Lungs struggle with air that holds heat. Some say their blood runs cold as ice, their hearts beat with glacier rhythm.

They are edge-dwellers, respected for their resilience but kept at distance. Something about the way their eyes barely focus on anything that isn't snow. The way their skin feels like stone that's been left out too long. Other Nordmark look at them and see what the cold does to those who stay too long. The Frostbound look back and see folk who have never truly met the north-not really. They fight it, bargain with it, live in its shadow. The Frostbound have let it in.

The Frostbound view the Bloodhammer as short-sighted warriors who fight the winter with rage and steel, but rage burns out and weapons break. The cold lasts forever. The Bloodhammer don't fight the white-they endure it for a while, then it takes them. The Frostbound became it.

They view the Rune-Keepers with a strange kinship, recognizing that both are marked by something that changes what it means to be human. The Rune-Keepers chose their transformation, went seeking visions. The Frostbound were sent into the wastes, and the wastes changed them whether they wanted them to or not. In the end, both are forever marked by the eternal winter.`,
                statModifiers: {
                    constitution: 3,
                    spirit: 2,
                    charisma: -3
                },
                traits: [
                    {
                        id: 'deep_frost_nordmark',
                        name: 'Deep Frost',
                        description: 'The deepest wastes have claimed your bloodline as their own, your flesh becoming one with the eternal cold that would consume lesser folk, surviving where others perish.',
                        level: 1,
                        icon: 'spell_frost_frozenorb',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'frost',
                            secondaryElement: 'deep_frost',
                            icon: 'spell_frost_frozenorb',
                            tags: ['immunity', 'frost', 'environmental', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'frost_immunity',
                                    name: 'Frost Immunity',
                                    description: 'Complete immunity to frost damage',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Take no damage from frost sources'
                                    }
                                },
                                {
                                    id: 'weather_endurance',
                                    name: 'Weather Endurance',
                                    description: 'Immunity to exhaustion from frost weather',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Never suffer exhaustion from frost weather'
                                    }
                                },
                                {
                                    id: 'ice_strider',
                                    name: 'Ice Strider',
                                    description: 'Snow and ice are never difficult terrain for you',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Ignore difficult terrain from snow and ice'
                                    }
                                },
                                {
                                    id: 'deep_frost_armor',
                                    name: 'Frozen Stance',
                                    description: 'Standing still on ice for 1 round grants +2 armor until you move more than 10ft',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: 2,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        terrain: ['ice'],
                                        stationary: true,
                                        duration: 1,
                                        breaksOn: { moveDistance: 10 }
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'survival',
                            selectedEffects: [
                                {
                                    id: 'arctic_survival',
                                    name: 'Arctic Survival',
                                    description: 'Survive in arctic conditions indefinitely without shelter or supplies'
                                },
                                {
                                    id: 'snow_tracks',
                                    name: 'Trackless Snow',
                                    description: 'Leave no tracks in snow'
                                }
                            ],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'major'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    },
                    {
                        id: 'flash_freeze_nordmark',
                        name: 'Flash Freeze',
                        description: 'With a gesture, the world around you surrenders to the deep cold \u2014 water snaps to ice, ground crystallizes, and your enemies find themselves locked in a prison of frost.',
                        level: 1,
                        icon: 'spell_frost_frozenorb',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'debuff', 'utility'],
                        typeConfig: {
                            school: 'frost',
                            icon: 'spell_frost_frozenorb',
                            tags: ['aoe', 'frost', 'terrain', 'restraint']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'restrain_enemies',
                                    name: 'Frozen Bonds',
                                    description: 'Enemies in 30ft radius: CON DC14 save or Restrained. Takes 1d6 frost damage per round. STR DC14 action to break free. Half effect on successful save.',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Restrained, 1d6 frost/round, STR DC14 action to break free'
                                    }
                                },
                                {
                                    id: 'ice_terrain_debuff',
                                    name: 'Frozen Ground',
                                    description: 'Ground becomes ice terrain for 10 minutes. Difficult terrain for enemies. AGI save or prone when running. Frost-resistant allies unaffected.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Ice terrain, enemies difficult terrain, AGI save or prone when running'
                                    }
                                }
                            ],
                            durationValue: 10,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: false
                        },
                        damageConfig: {
                            damageType: 'frost',
                            dice: '1d6',
                            saveStat: 'constitution',
                            dc: 14,
                            halfOnSave: true
                        },
                        utilityConfig: {
                            utilityType: 'environment',
                            selectedEffects: [
                                {
                                    id: 'freeze_water',
                                    name: 'Freeze Water',
                                    description: 'All water within 30ft becomes solid ice, creating bridges and sealing doors'
                                },
                                {
                                    id: 'ice_terrain_utility',
                                    name: 'Ice Terrain',
                                    description: 'Ground becomes ice terrain for 10 minutes'
                                }
                            ],
                            duration: 10,
                            durationUnit: 'minutes',
                            power: 'major'
                        },
                        triggerConfig: {
                            requiredConditions: {
                                terrain_type: ['cold', 'arctic', 'temperate', 'underground']
                            }
                        },
                        targetingConfig: {
                            targetingType: 'self_centered',
                            rangeType: 'aoe',
                            radius: 30,
                            aoeType: 'sphere'
                        },
                        resourceCost: {
                            actionPoints: 2,
                            mana: 10,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'long_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'frozen_heart_nordmark',
                        name: 'Frozen Heart',
                        description: 'The cold has taken too much. Your heart beats once every ten seconds. You cannot benefit from morale effects — Bardic Inspiration, Paladin auras, Guidance, Bless, and any ability that provides a buff based on emotional or spiritual connection. The cold does not amplify. It only takes.',
                        level: 1,
                        icon: 'spell_frost_chainsofice',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'frost',
                            secondaryElement: 'spirit',
                            icon: 'spell_frost_chainsofice',
                            tags: ['morale', 'immunity', 'debuff', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'moraleBlock',
                            effects: [
                                {
                                    id: 'morale_immunity',
                                    name: 'Emotional Void',
                                    description: 'Cannot benefit from morale effects: Bardic Inspiration, Paladin auras, Guidance, Bless, and any emotional/spiritual buff',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Immune to all morale and emotional buffs',
                                        blockedEffectTypes: ['bardic_inspiration', 'paladin_aura', 'guidance', 'bless', 'morale_buff', 'emotional_buff']
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'glacier_pulse_nordmark',
                        name: 'Glacier Pulse',
                        description: 'During the first round of combat, the Frostbound suffers -2 to initiative as their frozen body thaws into combat readiness. After Round 1, initiative normalizes. The cold always needs a moment to remember what warmth felt like.',
                        level: 1,
                        icon: 'spell_frost_stun',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'frost',
                            icon: 'spell_frost_stun',
                            tags: ['initiative', 'combat', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'initiativePenalty',
                            effects: [
                                {
                                    id: 'slow_thaw',
                                    name: 'Slow Thaw',
                                    description: '-2 to initiative during the first round of combat only. Normalizes after Round 1.',
                                    statModifier: {
                                        stat: 'initiative',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        combatRound: 1,
                                        duration: 1,
                                        durationUnit: 'rounds'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'edge_dweller_nordmark',
                        name: 'Edge-Dweller',
                        description: 'Non-Nordmark NPCs who interact with a Frostbound for more than a few moments must make a WIS DC12 save or become Unsettled — treating the Frostbound with wariness and refusing voluntary help. The save is made once per NPC, ever. Other Nordmark are immune to this effect.',
                        level: 1,
                        icon: 'spell_shadow_mindshear',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'physical',
                            secondaryElement: 'spirit',
                            icon: 'spell_shadow_mindshear',
                            tags: ['social', 'friction', 'aura', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'socialPenalty',
                            effects: [
                                {
                                    id: 'unsettling_presence',
                                    name: 'Unsettling Presence',
                                    description: 'Non-Nordmark NPCs must make WIS DC12 save or become permanently Unsettled: no voluntary help, no discounts, no shelter offered. Save once per NPC ever. Success is permanent immunity.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Unsettled NPCs refuse voluntary help',
                                        saveStat: 'wisdom',
                                        saveDC: 12,
                                        saveFrequency: 'once_per_npc_ever',
                                        affectedActions: ['voluntary_help', 'discounts', 'shelter', 'rumor_sharing'],
                                        immuneRaces: ['nordmark'],
                                        npcDisposition: 'unsettled'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'heat_frailty_nordmark',
                        name: 'Heat Frailty',
                        description: 'Your bloodline, forged in eternal winter, cannot endure the unnatural warmth that melts the glaciers, your frost-tempered flesh vulnerable to fires that would never touch the endless white.',
                        level: 1,
                        icon: 'spell_fire_fire',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'heat',
                            icon: 'spell_fire_fire',
                            tags: ['vulnerability', 'heat', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Fire Vulnerability',
                                    description: 'Your frostbound blood, adapted to the deepest cold, boils and ruptures when exposed to flames that would merely warm lesser folk',
                                    statusEffect: {
                                        vulnerabilityType: 'fire',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'heat_damage',
                                    name: 'Heat Damage',
                                    description: '1d4 fire damage per hour in warm climates'
                                },
                                {
                                    id: 'climate_disorientation',
                                    name: 'Climate Disorientation',
                                    description: 'Disadvantage on checks and saves in warm climates'
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 28, // Frostbound are hardier from their transformation
                    mana: 20,
                    ap: 4, // Scouts need mobility and quick reactions
                    passivePerception: 14, // Excellent scouts, read ice patterns, find paths
                    swimSpeed: 20, // Survival in harsh conditions includes water
                    climbSpeed: 20, // Mountain scouts, excellent climbers
                    visionRange: 60, // Enhanced vision from scouting
                    darkvision: 30, // Adapted to low-light conditions in deep winter
                    initiative: 1 // Scouts, quick to react
                },
                savingThrowModifiers: {
                    advantage: ['exhaustion'],
                    disadvantage: ['charm']
                }
            },
            hollow: {
                id: 'hollow_nordmark',
                name: 'Duskborn',
                description: 'Pale as cave fish. Eyes like wounds that never healed. They speak in whispers because in the deep, sound attracts. Their skin tears like wet parchment and sunlight burns them like confession burns a liar. The mountain took them generations ago and gave them back something that wears their shape but sees through stone.',
                culturalBackground: `The sagas do not speak of the seventh clan. Not because the histories were lost — because they were carved away, chiseled from the runestones by elders who decided some debts were better forgotten. The seventh clan of Ironhold did not march to the passes during the First Breaking. They did not stand at Frostgate. They descended. Past the forges. Past the mines. Past the last pickaxe scar on the last tunnel wall, into the roots of the mountain where the stone is older than the sky and the silence has a weight you can feel pressing against your eardrums.

Something spoke to them in that silence. Not the ancestors. Not the frost lords. Something older, something that had been waiting in the deep stone since before the first Nordmark drew breath in the northern wind. It didn't offer survival. It offered belonging. It said: "The mountain remembers you. Come home." And they went.

Generations passed. The seventh clan forgot the sun. Their children were born in chambers where no light had ever reached, and their eyes changed — not blind, but wrong. They see things that surface folk cannot. Movement in total darkness. The tremor of a heartbeat through thirty feet of granite. The shape of a lie in the vibration of a voice. Their skin went pale as bone, thin as parchment, because in the deep there is nothing to grow hard against. Their bodies stretch long and lean, built for squeezing through cracks in the stone that no human should fit through.

They navigate by echo and by the whispers that come from beneath the stone. The whispers are not always helpful. Sometimes they show you where the water flows behind a wall, where a creature sleeps in the dark, where the tunnel opens into a chamber no one has entered in a thousand years. Sometimes they show you things that look back. The Duskborn call this "the mountain speaking" and they treat it the way surface folk treat weather — dangerous, uncontrollable, and simply part of existence.

When they emerge — and they do, rarely, driven by debts that still bind them to the surface clans — the sun is an open wound. Their skin blisters in direct light. Their eyes, adapted to absolute blackness, weep and burn. Warmth makes their thin flesh crack and split like old ice. They wrap themselves in heavy cloth and travel by night, moving through settlements like ghosts that the locals pretend not to see.

The Bloodhammer call them "Stone-Grubbers" and refuse to acknowledge them at clan gatherings. The Rune Keepers are fascinated and horrified in equal measure — the things the Duskborn hear in the deep are not ancestors, and the Rune Keepers know enough about what dwells beyond the veil to find that deeply troubling. The Frostbound, alone among the clans, treat them with something approaching respect. The Frostbound understand what it means to be changed by the land. They look at the Duskborn's pale, hollow-eyed faces and see kin — not by blood, but by the shared experience of becoming something the north recognizes as its own.

The Duskborn view the Bloodhammer with a kind of patient pity. Hammers break stone. The deep stone does not break. The Bloodhammer's rage is a surface fire that will burn out. The mountain endures. The Rune Keepers they regard with caution — the spirits the Rune Keepers commune with are known quantities, bound by oath and ritual. What speaks to the Duskborn from beneath the stone is not bound by anything, and the Rune Keepers' attempts to categorize and name it are, in the Duskborn's view, profoundly dangerous. The Frostbound they treat as distant cousins — both are what the land made of them, rather than what they made of themselves.

Children born to the Duskborn undergo the Descending before their tenth year. They are taken to the deepest chamber the clan has found — always deeper, always darker — and left there for three days with no light, no sound but the stone, and no company but the whispers. When they emerge, their eyes have changed. The pupil widens. The color drains. They can see in the dark forever after, but they can no longer look at the surface world without pain. This is not considered a tragedy. This is considered waking up.
                `,
                statModifiers: {
                    agility: 3,
                    spirit: 2,
                    constitution: -3
                },
                traits: [
                    {
                        id: 'stones_echo_duskborn',
                        name: "Stone's Echo",
                        description: 'Your ancestors learned to see with their skin, to feel the world through the bones of the mountain itself. Light is a lie the surface tells itself. Vibration is the only truth that matters in the deep.',
                        level: 1,
                        icon: 'spell_shadow_shadowgaze',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'shadow',
                            secondaryElement: 'nature',
                            icon: 'spell_shadow_shadowgaze',
                            tags: ['darkvision', 'perception', 'tremorsense', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'darkvision_duskborn',
                                    name: 'Deepsight',
                                    description: 'You see in absolute darkness as though it were dim light. Range: 90 feet. No color, only shape, movement, and the tremor of living things.',
                                    statModifier: {
                                        stat: 'darkvision',
                                        magnitude: 90,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'tremorsense_duskborn',
                                    name: 'Stone Feeling',
                                    description: 'In complete darkness or while blinded, you sense vibrations through solid stone within 30 feet. Creatures, moving water, collapsing tunnels — the mountain speaks through your bones.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Tremorsense 30ft in complete darkness or while blinded'
                                    }
                                },
                                {
                                    id: 'depth_perception_duskborn',
                                    name: 'Deep Awareness',
                                    description: 'Your senses sharpen to killing precision in the absence of light. +4 to passive Perception when in complete darkness.',
                                    statModifier: {
                                        stat: 'passivePerception',
                                        magnitude: 4,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        lighting: 'complete_darkness'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [{
                                id: 'vibration_detection',
                                name: 'Vibration Detection',
                                description: 'Detect invisible and hidden creatures within 15ft through stone vibration'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'void_step_duskborn',
                        name: 'Void Step',
                        description: 'You fold yourself into the space between shadows where the stone remembers it was once lightless and welcomes you home like a wound closing around a splinter.',
                        level: 1,
                        icon: 'spell_shadow_stealth',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'shadow',
                            icon: 'spell_shadow_stealth',
                            tags: ['stealth', 'shadow', 'repositioning', 'escape']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'shadow_meld',
                                    name: 'Shadow Meld',
                                    description: 'Become invisible for 1 round. Only functions in dim light or darkness. You dissolve into the space between the light and the stone.',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'Invisible for 1 round in dim light or darkness'
                                    }
                                },
                                {
                                    id: 'agility_surge',
                                    name: 'Depth Reflexes',
                                    description: '+3 Agility for the duration. The darkness makes you faster — it always has.',
                                    statModifier: {
                                        stat: 'agility',
                                        magnitude: 3,
                                        magnitudeType: 'flat'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'restriction',
                            effects: [
                                {
                                    id: 'void_restraint',
                                    name: 'Void Binding',
                                    description: 'You cannot attack while dissolved into shadow. Attacking breaks the meld immediately. The stone does not share — it swallows.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Cannot attack while invisible. Attacking ends the effect.'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 2,
                            mana: 0,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'sun_cursed_duskborn',
                        name: 'Sun-Cursed',
                        description: 'Your flesh has forgotten what the sun looks like. Six generations in the deep have thinned your skin to something that tears when the wind blows and blisters when the sky opens. Warmth does not comfort you. It unmakes you, slowly, like watching ice crack across a frozen lake knowing the water below is black and final.',
                        level: 1,
                        icon: 'spell_holy_sunstreak',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'radiant',
                            secondaryElement: 'physical',
                            icon: 'spell_holy_sunstreak',
                            tags: ['vulnerability', 'sunlight', 'slashing', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'sunlight_sensitivity',
                                    name: 'Sunlight Agony',
                                    description: 'Direct sunlight burns your cave-adapted eyes and sears your parchment skin. -2 to ALL rolls while in direct sunlight. Not dim light. Not overcast. Sunlight.',
                                    statModifier: {
                                        stat: 'all_rolls',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
                                    },
                                    conditions: {
                                        lighting: 'direct_sunlight'
                                    }
                                },
                                {
                                    id: 'surface_blight',
                                    name: 'Surface Blight',
                                    description: 'In warm or hot environments, your skin blisters and cracks like old paper held too close to flame. 1d4 radiant damage per hour of exposure. The damage is slow, patient, and inevitable — like the thing that waits beneath the mountain.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: '1d4 radiant damage per hour in warm/hot environments',
                                        damageType: 'radiant',
                                        damageFormula: '1d4',
                                        frequency: 'hourly',
                                        trigger: 'warm_hot_environment'
                                    }
                                },
                                {
                                    id: 'slashing_vulnerability',
                                    name: 'Parchment Flesh',
                                    description: 'Generations without sunlight have thinned your skin to translucence. Blades that would graze a surface Nordmark open you to the bone. 50% vulnerability to slashing damage.',
                                    statusEffect: {
                                        vulnerabilityType: 'slashing',
                                        vulnerabilityPercent: 50
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'depths_whisper_duskborn',
                        name: "Depths' Whisper",
                        description: 'The thing beneath the mountain does not forget those who belong to it. It speaks in the voice of stone grinding against stone, of water eating through granite one drip at a time over ten thousand years. Sometimes it shows you what lies beyond the next wall. Sometimes it shows you what lies beneath your own thoughts. It always takes something back. It never gives without remembering the debt.',
                        level: 1,
                        icon: 'spell_shadow_mindshear',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'shadow',
                            secondaryElement: 'spirit',
                            icon: 'spell_shadow_mindshear',
                            tags: ['divination', 'madness', 'stacking', 'passive']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Spirit check DC 14 to perceive creatures, structures, and water through up to 60ft of solid rock. Once per long rest. The mountain tells you what the stone remembers.',
                            effects: [
                                {
                                    id: 'stone_sense',
                                    name: 'Stone Sense',
                                    description: 'Make a Spirit check DC 14 to perceive creatures, structures, and flowing water through up to 60ft of solid rock. Once per long rest. The mountain whispers what the stone has seen.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Perceive through 60ft of solid rock, Spirit DC 14, once per long rest'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'curse',
                            effects: [
                                {
                                    id: 'stone_whisper_madness',
                                    name: 'Stone Whispers',
                                    description: 'At the start of each long rest, make a Spirit save DC 12. On failure, gain 1 Stone Whisper stack. Each stack: -1 to all Charisma checks as the whispers erode what remains of your surface self. At 5 stacks: also suffer disadvantage on your next saving throw — the whispers are too loud to hear anything else. Stacks never decrease. There is no cure. The mountain does not give back what it takes.',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Creeping madness from the deep. SPI DC 12 save at each long rest or gain a permanent stack.',
                                        stacking: true,
                                        penaltyPerStack: {
                                            stat: 'charisma_checks',
                                            magnitude: -1,
                                            magnitudeType: 'flat'
                                        },
                                        thresholdEffects: {
                                            threshold: 5,
                                            effect: 'disadvantage_on_next_saving_throw'
                                        },
                                        saveStat: 'spirit',
                                        saveDC: 12,
                                        saveFrequency: 'long_rest',
                                        trackingType: 'stone_whisper_stacks',
                                        permanent: true
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    },
                    {
                        id: 'hollow_gaze_duskborn',
                        name: 'Hollow Gaze',
                        description: 'Your eyes are not windows to the soul. They are holes. Other folk look into them and see the depth that swallowed your ancestors whole — the weight of six generations of stone pressing down, the silence that learned to speak, the dark that learned to watch. They see all of it, for one terrible moment, and they know with animal certainty that the depth is still hungry and that it knows their name.',
                        level: 1,
                        icon: 'ability_rogue_shadowdancer',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'shadow',
                            secondaryElement: 'spirit',
                            icon: 'ability_rogue_shadowdancer',
                            tags: ['social', 'fear', 'gaze', 'friction', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'socialPenalty',
                            effects: [
                                {
                                    id: 'gaze_frighten',
                                    name: 'The Depth Stares Back',
                                    description: 'Non-Nordmark NPCs who meet your gaze during face-to-face interaction must make a Spirit save DC 13 or become Frightened for 1 round and permanently Unsettled. Frightened creatures cannot approach you. Unsettled NPCs refuse voluntary help, offer no discounts, provide no shelter, share no rumors. Save once per NPC, ever. Success grants permanent immunity to this effect.',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Frightened 1 round + permanently Unsettled on failed SPI DC 13 save',
                                        saveStat: 'spirit',
                                        saveDC: 13,
                                        saveFrequency: 'once_per_npc_ever',
                                        frightened: {
                                            duration: 1,
                                            durationUnit: 'rounds'
                                        },
                                        npcDisposition: 'unsettled',
                                        affectedActions: ['voluntary_help', 'discounts', 'shelter', 'rumor_sharing'],
                                        immuneRaces: [],
                                        condition: 'direct_eye_contact'
                                    }
                                },
                                {
                                    id: 'kin_unsettled',
                                    name: 'Even Stone Remembers',
                                    description: 'Even Nordmark NPCs must make a Spirit save DC 13 or become Unsettled — your own kin flinch from what stares out from behind your eyes. They will work with you. They will share your fire. But they will not meet your gaze, and they will not stay in a room alone with you. The save is once per NPC, ever.',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Nordmark NPCs become Unsettled on failed SPI DC 13 save',
                                        saveStat: 'spirit',
                                        saveDC: 13,
                                        saveFrequency: 'once_per_npc_ever',
                                        npcDisposition: 'unsettled',
                                        affectedActions: ['voluntary_help', 'discounts'],
                                        appliesOnlyToRaces: ['nordmark'],
                                        condition: 'direct_eye_contact'
                                    }
                                },
                                {
                                    id: 'involuntary_gaze',
                                    name: 'The Eyes Do Not Close',
                                    description: 'This effect cannot be suppressed, hidden, or controlled. It is involuntary and permanent. Sunglasses, blindfolds, or closed eyes negate it — but you cannot see, and the tremors of those around you will tell you exactly when they looked.',
                                    statusEffect: {
                                        level: 'minor',
                                        description: 'Effect is always active during face-to-face interaction. Cannot be suppressed. Only negated by covering your eyes (which blinds you).'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        }
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic', 'Terran'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 14,
                    mana: 28,
                    ap: 3,
                    passivePerception: 16,
                    swimSpeed: 10,
                    climbSpeed: 25,
                    visionRange: 60,
                    darkvision: 90,
                    initiative: 3
                },
                savingThrowModifiers: {
                    advantage: ['charm'],
                    disadvantage: ['poison']
                }
            }
        }
};
