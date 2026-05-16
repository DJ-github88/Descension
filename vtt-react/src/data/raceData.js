/**
 * Race Data Module
 *
 * Defines all playable races and their subraces with complete mechanical data
 * including stat modifiers, racial traits, languages, lifespans, and movement speeds.
 */

import { ABILITY_SCORES } from '../utils/pointBuySystem';

// Base race definitions with their subraces
export const RACE_DATA = {
    nordmark: {
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
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'frost',
                            secondaryElement: 'frost',
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
                        id: 'battle_fury_nordmark',
                        name: 'Battle Fury',
                        description: 'When death draws near, the ancient berserker blood awakens, flooding your veins with the fury that carved kingdoms from ice, trading caution for primal strength that echoes your warrior-king ancestors.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'physical',
                            icon: 'ability_warrior_rampage',
                            tags: ['rage', 'combat', 'berserker', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'berserker_slashing_damage',
                                    name: 'Rage Slashing Damage',
                                    description: 'The fury of your warrior-king ancestors sharpens every blade strike with primal rage',
                                    statModifier: {
                                        stat: 'slashing_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_bludgeoning_damage',
                                    name: 'Rage Bludgeoning Damage',
                                    description: 'Each blow carries the weight of glacier-splitting hammers from the age of warrior-kings',
                                    statModifier: {
                                        stat: 'bludgeoning_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_piercing_damage',
                                    name: 'Rage Piercing Damage',
                                    description: 'Your strikes pierce like the winter winds that carved your bloodline',
                                    statModifier: {
                                        stat: 'piercing_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_ranged_damage',
                                    name: 'Rage Ranged Damage',
                                    description: 'Even thrown weapons sing with the fury of the eternal white',
                                    statModifier: {
                                        stat: 'ranged_damage',
                                        magnitude: 5,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_defense',
                                    name: 'Reckless Defense',
                                    description: 'The rage burns so hot it cares nothing for defense, leaving you exposed to the steel you should fear',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'berserker_saves',
                                    name: 'Reckless Courage',
                                    description: 'The berserker fury makes you reckless, ignoring dangers that wiser folk would avoid',
                                    statModifier: {
                                        stat: 'saving_throws',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
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
                            rangeType: 'self_centered',
                            validTargets: ['self']
                        },
                        triggerConfig: {
                            global: {
                                enabled: true,
                                logicType: 'AND',
                                compoundTriggers: [
                                    {
                                        id: 'health_threshold',
                                        category: 'health',
                                        name: 'Health Threshold',
                                        parameters: {
                                            percentage: 50,
                                            comparison: 'less_than',
                                            perspective: 'self',
                                            threshold_type: 'percentage'
                                        }
                                    }
                                ]
                            }
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'long_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
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
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'frost',
                            secondaryElement: 'frost',
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
                        id: 'ancestral_whispers_nordmark',
                        name: 'Ancestral Whispers',
                        description: 'Close your eyes and the ancestors answer—voices of frozen kings and shield-maidens murmuring through the ice, offering glimpses of paths unseen and truths unspoken, though every vision demands a story told at the longhouse fire in payment.',
                        level: 1,
                        icon: 'spell_shadow_coneofsilence',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'spirit',
                            secondaryElement: 'ancestral',
                            icon: 'spell_shadow_coneofsilence',
                            tags: ['spirit', 'guidance', 'ancestral']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Gain advantage on one Intelligence or Spirit check',
                            effects: [
                                {
                                    name: 'Ancestral Guidance',
                                    description: 'Advantage on one Intelligence or Spirit check',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Ancestral spirits provide insight and spirit'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'hours',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'prediction',
                                name: 'Prediction',
                                description: 'Communicate with ancestor spirits for guidance and spirit.'
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
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'vision_vulnerability_nordmark',
                        name: 'Vision Vulnerability',
                        description: 'Your connection to the ancestral realm leaves you vulnerable to energies that disrupt the veil between worlds.',
                        level: 1,
                        icon: 'spell_fire_soulburn',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'necrotic',
                            icon: 'spell_fire_soulburn',
                            tags: ['vulnerability', 'spirit', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
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
                                    name: 'Veil Weakness',
                                    description: 'Your bond with ancestor spirits thins the veil between worlds, making you vulnerable to planar disruptions',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Spiritual connection leaves you vulnerable to planar disruptions'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'survival',
                            selectedEffects: [{
                                id: 'arctic_survival',
                                name: 'Arctic Survival',
                                description: 'Survive in arctic conditions indefinitely without shelter or supplies'
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
                        },
                    },
                    {
                        id: 'winters_guidance_nordmark',
                        name: 'Winter\'s Guidance',
                        description: 'The wind itself bends to whisper in your ear, carrying the breath of ancient blizzards that reveal paths no map has ever charted and foretell the fury of storms hours before the first snowfall.',
                        level: 1,
                        icon: 'spell_nature_naturetouchgrow',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'winter',
                            icon: 'spell_nature_naturetouchgrow',
                            tags: ['guidance', 'weather', 'survival']
                        },
                        utilityConfig: {
                            utilityType: 'environment',
                            selectedEffects: [{
                                id: 'weather',
                                name: 'Weather',
                                description: 'Can sense safe paths through blizzards and predict weather changes within 24 hours.'
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
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
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
                    // Frostbound are hardy survivors but vulnerable to magical effects
                    advantage: ['exhaustion'], // Hardy survivors resist exhaustion
                    disadvantage: ['charm'] // Cold nature vulnerable to magical charm effects
                }
            }
        }
    },

    grimheart: {
        id: 'grimheart',
        name: 'Grimheart',
        essence: 'Stone-hardened delvers',
        description: 'We are the children of the deep Earth, forged in the crushing weight of the world. Our skin is the grey of mountain granite, our bones heavy with the minerals we have spent lifetimes prying from the dark. We do not just mine the stone; we speak to it, and it answers in the low groan of shifting plates. Every callus on our hands is a testament to the iron we have tamed, every scar a map of a tunnel we survived. Our eyes are wide, hunger-bright for the glint of silver in the absolute black where surface lights cannot reach. We do not fear the crushing dark, for we are of the same marrow. We are the architects of the roots of the world, the keepers of the deep-veins that bleed the wealth of kings. We are slow to move and hard to break, as unyielding as the mountains that raised us.',
        icon: 'fas fa-hammer',
        overview: 'The Grimheart are stout folk whose ancestors founded the mining guilds that carved wealth from the deep earth. Through generations of working beneath the mountains, their bloodlines have been marked by the stone. Their flesh hardening. Their bones growing dense. Their very nature shaped by the deep places. They are organized into powerful guilds, each with its own traditions, techniques, ancestral secrets. The Grimheart don\'t just mine. They serve the earth, their craft a calling passed down through bloodlines. But the deep earth whispers to those who work it too long. Many Grimheart find themselves drawn back to the mines, unable to resist the call of what lies beneath.',
        culturalBackground: `Grimheart society runs on guild loyalty and ancestral craft traditions. Each guild traces its founding to legendary miners and smiths who first learned to shape stone and metal. Their techniques passed down through generations like sacred texts. Guild halls are carved deep into mountainsides, stone architecture reflecting the unyielding nature of those who built them. Grimheart children are apprenticed young. Learning their family's craft from masters who are often their own ancestors. The transformation comes slowly. Through generations of working in the deep, their bloodlines have adapted. Flesh hardening like the stone they work. But this adaptation is also a curse. The deep earth whispers to those with stone in their blood. Calling them back to dig ever deeper. Guild disputes settle through craft competitions and the testimony of elder masters. They are a people bound by tradition and haunted by the depths. Their mastery of earth and metal unmatched. But their souls forever marked by what they awakened below.`,
        variantDiversity: 'The Grimheart are divided into three major bloodlines: The Deep-Delvers embrace deep mining and answer the earth\'s call, the Stone-Smiths channel their connection to stone into master crafting, and the Earth-Wardens resist the whispers to serve as guardians and protectors.',
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
            size: 'Medium',
            height: '5\'2" - 5\'10"',
            weight: '160-240 lbs',
            build: 'Stocky and durable'
        },
        epicHistory: `
The First Foundations came when the first Grimheart learned to listen to the deep earth and heard voices speaking from stone and from the darkness where no light had ever reached. That first listener found metal waiting beneath rock that was stronger than any weapon surface-dwellers had forged, and founded the first guild to work what the deep places offered with proper respect.

The mining guilds grew as the first Grimheart taught others to listen to the earth, to hear the vibrations of metals waiting, to understand the proper ways to work stone without taking what was offered disrespectfully. The techniques they developed became traditions passed down through generations, the guild halls carved into mountainsides reflecting the unyielding nature of those who worked the deep places.

During the Wars of the Deep, kingdoms and armies fought over the treasures that the Grimheart guilds found. The Deep-Delvers dove deeper than ever before to find metals that could win wars, the Stone-Smiths forged weapons that could break armies, the Earth-Wardens guarded the boundaries between the surface world and what the deep places called to be taken.

The wars changed the bloodlines. The Deep-Delvers who dove deepest became most transformed by the deep places, their bodies more stone than flesh, their minds consumed by voices from the darkness. The Stone-Smiths who worked the hottest forges became most changed by the craft, their flesh hardened by heat and pressure. The Earth-Wardens who resisted the call became most changed by resistance, their strength shaped by constant battle against the deep earth's pull.

The Guild Accords ended the wars when the surviving leaders of the three bloodlines met and established rules that would prevent Grimheart from fighting each other again. Deep-Delvers would respect mining territories claimed by other bloodlines. Stone-Smiths would share techniques rather than hoarding them. Earth-Wardens would be recognized as necessary guardians of the boundaries between surface and deep.

The accords have held for generations, but the deep earth remembers everything it touches, including the wars between Grimheart. The call to dive deeper, to work the earth more completely, to follow voices that speak from the darkness - that call has returned with the spreading darkness that threatens the eastern lands.

Now the darkness spreads across those lands, and the deep earth calls with renewed strength. The Deep-Delvers hear voices promising treasures that could defeat the darkness. The Stone-Smiths sense metals waiting beneath that could shape weapons to fight it. The Earth-Wardens feel the pull strengthening, the deep earth calling Grimheart to answer its call more completely than they have in generations.

The Guild Accords that have held since the Wars of the Deep will be tested. The darkness may force Grimheart to fight each other for access to the treasures and metals that wait beneath. The accords may shatter as each bloodline answers the deep earth's call differently to the threat that approaches.

The deep earth remembers everything it touches, including the accords that have held between bloodlines. The earth will call Grimheart to work what it needs worked to face the darkness, regardless of the rules established to prevent them from fighting each other. The question is whether the accords or the deep earth's call will prove stronger.
        `,
        notableFigures: [
            {
                name: 'Guildmaster Thorne Deep-Delver',
                title: 'The Last Deep-Delver',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The last master of the ancient expeditions, Thorne survived the Great Collapse when every other Deep-Delver of his generation perished. He spent his youth in the deepest mines of the mountain, learning to read the veins of silver like they were written in the stone itself. When the collapse began, he was the only one who realized what was happening—the mountain was not just shaking, it was dying.

Thorne led the survivors back to the surface, his hands still trembling from the remembered vibrations of the mountain's death throes. He founded the new Deep-Delver guild on the principle of respect for the earth's grief. Every shaft must be warded before entering. Every expedition must be marked by stone guardians. No delving too deep, no extraction without permission. Under his leadership, the Deep-Delvers have survived, though they are fewer than they once were.

Many young Grimheart seek out Thorne for wisdom about the deep earth. He speaks in a voice that resonates with the stone, his words carrying the weight of memories he wishes he could forget. His hands, once steady enough to forge masterwork weapons, now shake when he tries to hold a cup. The mountain still calls to him, and he fears the day he can no longer resist the pull of the veins below.

Thorne knows the old stories. He remembers when the Grimheart could shape stone with their bare hands, when gems would pulse with the heart's beat, when silver sang through ore like living song. He fears that the new generation, born after the Great Collapse, has lost this connection. That they are no longer the people who could hear the mountain's voice. That they are surface folk now, mining the earth like any other, indifferent to the wisdom that lives beneath their feet.
                `
            },
            {
                name: 'Forge-Mistress Hela Stone-Singer',
                title: 'The Voice of the Mountain',
                portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
                backstory: `
Hela was born with a gift that is both blessing and curse. She can hear the mountain itself—not just its vibrations through her feet, but its consciousness speaking directly into her mind. The stones whisper to her, the gems hum their secrets, the very earth tells her of treasures buried beneath the weight of the world.

She serves as the chief negotiator between the three mining guilds. When the Deep-Delvers, Stone-Smiths, and Earth-Wardens dispute over a vein, it is to Hela's longhouse that they come. She speaks with the mountain's voice on their behalf, translating the earth's concerns into words they can understand. The Stone-Smiths respect her knowledge, for she knows which ores grow in which seasons and where the silver veins run thickest. The Earth-Wardens bring their disputes to her, trusting her to find the words that will make the stone guardians stand down.

But the mountain is grieving. The Great Collapse wounded it deeply, and its pain flows through every conversation Hela holds. The ancient mines that once sang with light have gone silent. The silver veins that once pulsed with the mountain's heartbeat have grown cold. The stone guardians, once animated by the deep earth's breath, now stand as lifeless statues trapped between wards.

Hela spends her nights trying to ease the mountain's suffering. She sings to it the old songs of the Deep-Delvers, stories she learned from the elders who remembered when the stones could still speak. She touches the faces of the stone guardians, weeping for the companions who once protected the mines. The other Grimheart see her as strange—a woman who talks to the mountain as if it were a living person—and they don't know whether to worship her or fear her.

The surface world does not understand. Merchants see Hela as a tool to be exploited, offering her gold for secrets of the deep earth. The kings of distant realms send spies to learn how she negotiates between the guilds. But Hela serves only the mountain, and what it tells her is what she carries to the guilds. If the mountain ever truly dies, the Grimheart will lose more than their wisdom—they will lose the only being who can speak to the stone.
                `
            },
            {
                name: 'Earth-Warden Kaelen Stonebound',
                title: 'The Living Guardian',
                portraitIcon: 'Armor/Head/head-split-orange-faceplate-helmet',
                backstory: `
Kaelen is one of the last of the old generation, the final Earth-Warden to be forged with the deep earth's breath before the Great Collapse shattered that ancient practice. His body was animated at birth, his skin taking on the hardness of stone, his blood infused with the very essence of the mountain itself. Unlike modern Stone-Smiths who create guardians through rituals, Kaelen's existence comes from the mountain's will itself.

He remembers the old days. When the mines were alive with singing stones and humming gems, Kaelen stood watch at the deepest shafts, his body moving with the slow deliberation of the rock. The Deep-Delvers would bring their disputes to him, asking the stone to judge whose claim was true. The Stone-Smiths would seek his blessing for their creations, asking him to infuse their works with the earth's permanence. He spoke seldom, but his words carried weight that the mountain itself gave them.

Kaelen was one of the few who felt the Great Collapse before it happened. Days before the mountain began to shake, he heard the earth screaming. The silver veins stopped pulsing. The ancient mines fell silent. The Stone-Smiths' creations lost their power. Only the stone guardians, animated by the mountain's breath, remained standing—the last remnants of a time when the deep earth spoke freely.

Now the mountain is dead. Its consciousness faded, though its pain still echoes through every shaft Kaelen watches. The Stone-Smiths have tried to recreate guardians with their rituals, but they fail. Their creations come out as inert stone, without the mountain's breath. The Deep-Delvers dig into the earth without consulting the Earth-Wardens, ignoring the signs that the mountain is dead. Kaelen stands alone among them, the last of his kind—a living memory of a world that has passed.

The surface world sees Kaelen as a curiosity, a museum piece from a forgotten age. They don't understand that his existence means the mountain can never truly die. That his stone-bound blood is not just blood but the earth's will made flesh. They don't fear him—how could they? A being who cannot be unmade, who cannot age, who cannot die. But Kaelen knows that even he can fade. The mountain's voice, once speaking in his mind, grows quieter each year. When it finally falls silent, the Grimheart will lose the last living connection to the deep earth.
                `
            }
        ],
        majorLocations: [
            {
                name: 'The Great Forge Hall',
                description: `
The oldest Stone-Smith guild hall, carved deep into a mountainside by generations of smiths who understood how to listen to the earth. The forge here has burned for three hundred years, its heat and pressure shaping every Stone-Smith who has worked it. The walls are lined with weapons and armor forged here, artifacts of the Wars of the Deep and earlier conflicts.

Master Kaelen holds court in the Great Forge Hall, demonstrating techniques that have been passed down through generations of smiths. The forge speaks most clearly here, every hammer strike carrying the earth's voice, every piece shaped here carrying the memory of the deep place it came from.

The Great Forge Hall has never been breached by any army, its stone walls too thick, its position too deep within the mountain, its smiths too willing to defend what they've worked to build. During the Wars of the Deep, this hall supplied weapons to all three bloodlines, refusing to let guild conflicts prevent the forge from serving the deep earth's craft.

Today, the Great Forge Hall operates at full capacity as Stone-Smiths prepare to forge weapons for the coming darkness. The forge burns hotter than ever before, its heat and pressure shaping metal and stone into what will be needed to fight. Master Kaelen teaches techniques that will be needed to work the treasures the Deep-Delvers will find.
                `
            },
            {
                name: 'The Deepest Mine',
                description: `
The deepest mine any Grimheart has ever worked, the Deepest Mine descends through rock that has held pressure for thousands of years. The darkness here is absolute, the air thick with stone dust and the smell of metal waiting to be worked. The deep earth speaks most clearly here, voices carrying from places no surface-dweller has ever seen.

Master Thorne has worked this mine for forty years, disappearing into its depths for years at a time before emerging to share what he's found. The transformation has shaped him most completely here, his flesh becoming harder than stone, his bones adapting to pressure that would crush other flesh.

The Deepest Mine is dangerous to any but Deep-Delvers, its pressure too great, its darkness too absolute, its voices too consuming. Those who work this mine are changed permanently by it, their bodies adapting to the deep places, their minds consumed by voices that speak from the darkness where light never reaches.

Today, the Deepest Mine operates with increased activity as Deep-Delvers hear the deep earth calling with renewed strength. Thorne and others dive deeper than ever before, following voices that speak of treasures and metals that could defeat the darkness. The mine itself seems to welcome them, the earth remembering those who answer its call most completely.
                `
            }
        ],
        currentCrisis: `
The darkness spreading across the eastern lands has strengthened the deep earth's call. The Deep-Delvers hear voices promising treasures that could defeat the darkness. The Stone-Smiths sense metals waiting beneath that could shape weapons to fight it. The Earth-Wardens feel the pull strengthening, the deep earth calling Grimheart to answer its call more completely than they have in generations.

The Guild Accords that have held since the Wars of the Deep are being tested. The Stone-Smiths and Deep-Delvers both seek access to the treasures and metals that wait beneath, their interests conflicting with the rules that established boundaries between bloodlines. The Earth-Wardens watch as the accords strain, their guardianship of the boundaries becoming more difficult with each day.

Master Thorne dives deeper than any Deep-Delver has before, his body shaped for the deepest places, his mind consumed by voices from the deep earth. He hears promises of treasures and metals that could defeat the darkness, and he follows those voices into darkness no other Grimheart could survive.

Master Kaelen works the Great Forge Hall hotter than ever before, shaping metal and stone into weapons that could fight the darkness. The forge speaks clearly of what's coming, and Kaelen's techniques transform the earth's gifts into what will be needed.

The Earth-Wardens strengthen their defense of the boundaries, feeling the pull growing stronger with each day. They know that the deep earth will call Grimheart to answer its call more completely when the darkness arrives, and they prepare to guard what lives above from dangers that may rise from beneath.

The Guild Accords may shatter when the darkness comes. The Stone-Smiths and Deep-Delvers may fight over access to the treasures that wait beneath. The Earth-Wardens may be forced to choose between defending the boundaries or joining their bloodlines in answering the deep earth's call.

The deep earth remembers everything it touches, including the accords that have held between bloodlines. The earth will call Grimheart to work what it needs worked to face the darkness, regardless of the rules established to prevent them from fighting each other.

When the darkness arrives, the Deep-Delvers will dive deepest to find what can defeat it. The Stone-Smiths will shape those finds into weapons and armor. The Earth-Wardens will guard the boundaries between surface and deep, watching for dangers that may rise from beneath what waits below.
        `,
        culturalPractices: `
Every Grimheart child learns to listen to the earth from their first years, hearing the vibrations of stone, feeling the pressure of metals waiting beneath, understanding that the deep places have voices that speak to those who work them properly. By the time they're ten, most have learned their bloodline's calling - whether to dive deep, shape gifts, or guard boundaries.

Apprentices begin at twelve, children placed with masters who teach their bloodline's craft. Deep-Delver apprentices learn to descend safely, to recognize dangers in the deep places, to hear the earth's voices most clearly. Stone-Smith apprentices learn to shape metal and stone, to understand the proper ways to work the forge, to listen to what the earth says through the craft. Earth-Warden apprentices learn to resist the call, to guard boundaries, to understand both what waits beneath and what lives above.

The first descent into the deep mines is always significant for Deep-Delvers. The darkness is absolute, the pressure overwhelming, the voices from the deep places speaking most clearly. Those who survive their first descent return changed, their bodies adapting to the deep places, their minds beginning to hear the earth's call.

The first day at the forge is always significant for Stone-Smiths. The heat and pressure shape the body, the hammer strikes teach the earth's voice through metal and stone, the craft begins to transform those who work it. Those who complete their first day at the forge return changed, their flesh hardened, their bones dense from handling the earth's gifts.

The first time an Earth-Warden fully resists the deep earth's call is always significant. The pull is strongest then, the voices most tempting, the promise of treasures most clear. Those who successfully resist the first time understand what resistance will cost, their strength shaped by constant battle against the deep earth's pull.

Guild ceremonies mark important moments in every Grimheart's life. The Forge Ceremony celebrates when a Stone-Smith completes their apprenticeship and becomes a master. The Descent Ceremony celebrates when a Deep-Delver survives their first descent into the deep mines. The Boundary Ceremony celebrates when an Earth-Warden successfully resists the deep earth's call and commits to guarding the surface.

Guild halls are carved into mountainsides, stone architecture reflecting the unyielding nature of those who work the deep places. The Great Forge Hall burns with constant heat, its walls lined with weapons and armor. The Deepest Mine descends through rock that has held pressure for thousands of years, its darkness absolute.

The transformation comes slowly to all Grimheart, but it comes to all who work the deep earth. Flesh hardens like stone over decades. Bones grow dense and heavy. The very nature changes, becoming more like the deep places that call us. The Deep-Delvers transform fastest, their bloodlines pulled most strongly toward the deep places. The Earth-Wardens transform slowest, their resistance to the call protecting them from the changes that claim others.

Guild disputes settle through craft competitions and the testimony of elder masters. When Stone-Smiths argue over techniques, they demonstrate their skill at the forge. When Deep-Delvers argue over mining rights, they test their strength in the deepest shafts. When Earth-Wardens argue over territory, they consult the earth itself, listening to what the stone says.

The Guild Accords established after the Wars of the Deep are the laws all Grimheart follow. Deep-Delvers respect mining territories claimed by other bloodlines. Stone-Smiths share techniques rather than hoarding them. Earth-Wardens are recognized as necessary guardians of the boundaries between surface and deep.

The deep earth remembers everything it touches, and it calls us to work what we've always worked. The transformation is gift and burden both - making us stronger than other folk, but also making it harder to resist the call of the deep places that want us back.
        `,
        subraces: {
            delver: {
                id: 'delver_grimheart',
                name: 'Deep Delver',
                description: 'Flesh hardest of all Grimheart, gray as granite and rough to the touch. Eyes fully adapted to darkness, nearly blind in bright light. Hands permanently stained with mineral dust. Constant twitching and muttering from the whispers they hear. Many bear scars from cave-ins and collapses. They move with a hunched posture, as if always ready to dig.',
                culturalBackground: `The Deep-Delvers trace their founding to the first miners who broke through into the deep places where the mountain's blood flows. Their tradition demands that every member learn to mine the deepest veins. Apprenticeships spent in caverns where surface folk would perish. Deep-Delver halls are built in the deepest mines. Members living in darkness that would blind others. Through generations of deep mining, their bloodline has adapted. Stone-hardened flesh allowing them to work where others cannot. Eyes seeing in darkness that blinds surface dwellers. Members practice ancient mining techniques passed down through generations. How to read stone patterns. How to find veins that shouldn't exist. How to navigate tunnels that go deeper than any map. But the deep earth whispers to those who work it. Many Deep-Delvers find themselves unable to stay on the surface. Drawn back to dig ever deeper. The bloodline values skill and courage. Honor measured in depths reached and treasures unearthed. They are the deep-miners of Grimheart society. Unmatched in their craft but forever marked by what they awaken below.`,
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    charisma: -3
                },
                traits: [
                    {
                        id: 'stone_skin_grimheart',
                        name: 'Stone Skin',
                        description: 'Generations of working the unforgiving deep earth have hardened your flesh and bones to near-stone, granting protection but forever slowing your movements like the mountains themselves.',
                        level: 1,
                        icon: 'inv_misc_stonetablet_04',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'earth',
                            secondaryElement: 'stone',
                            icon: 'inv_misc_stonetablet_04',
                            tags: ['armor', 'stone', 'defense', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'stone_armor',
                                    name: 'Stone Armor',
                                    description: 'Gain +2 armor from stone-hardened flesh',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: 2,
                                        magnitudeType: 'flat'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'stone_slow',
                                    name: 'Stone Slow',
                                    description: 'Movement reduced by 5 feet',
                                    statModifier: {
                                        stat: 'movement_speed',
                                        magnitude: -5,
                                        magnitudeType: 'flat'
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
                        id: 'earth_sense_grimheart',
                        name: 'Earth Sense',
                        description: 'Press your palms to the stone and the deep earth answers—tremors whisper of silver veins and hidden hollows, of passages carved by water and pressure across millennia, revealing what the darkness has kept since the mountains were young.',
                        level: 1,
                        icon: 'spell_nature_earthquake',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'earth',
                            secondaryElement: 'detection',
                            icon: 'spell_nature_earthquake',
                            tags: ['detection', 'earth', 'minerals']
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'detection',
                                name: 'Detection',
                                description: 'Detect minerals and underground passages within 60 feet.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'ranged',
                            rangeDistance: 60,
                            aoeShape: 'sphere',
                            aoeParameters: {
                                radius: 60
                            }
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'stone_frailty_grimheart',
                        name: 'Stone Frailty',
                        description: 'Your stone-hardened flesh, dense with the minerals of a hundred lifetimes underground, dissolves when acids find the crystalline veins within—what the mountain spent generations building, alchemy unmakes in moments.',
                        level: 1,
                        icon: 'spell_nature_acid_01',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'acid',
                            icon: 'spell_nature_acid_01',
                            tags: ['vulnerability', 'acid', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Acid Vulnerability',
                                    description: 'Acid eats through your stone-hardened flesh like water through calcite, dissolving generations of mountain adaptation',
                                    statusEffect: {
                                        vulnerabilityType: 'acid',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Stone Dissolution',
                                    description: 'Acid damage reduces your natural armor temporarily',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Acid damage can weaken your stone-hardened defenses'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Terran', 'Undercommon'],
                speed: 25,
                baseStats: {
                    armor: 0, // Stone Skin passive adds +2, so base is 0
                    hp: 36, // Stone-hardened flesh, extra durability
                    mana: 16,
                    ap: 3, // Steady workers, standard AP
                    passivePerception: 13, // Earth Sense, detect minerals and passages
                    swimSpeed: 10, // Dense and stone-like, poor swimmers
                    climbSpeed: 20, // Excellent climbers, work in deep caves
                    visionRange: 45,
                    darkvision: 60, // Eyes fully adapted to darkness
                    initiative: -2 // Slow and steady, not quick to react
                },
                savingThrowModifiers: {
                    // Deep delvers resist poison but are vulnerable to light
                    advantage: ['poison'], // Stone nature resists poison effects
                    disadvantage: ['blinded'] // Deep dwelling vulnerable to bright light effects
                }
            },
            warden: {
                id: 'warden_grimheart',
                name: 'Earth Warden',
                description: 'Broad-shouldered and wide-set, built like living walls. Stone-hardened flesh forms natural plates across chest and shoulders. Eyes constantly scanning, pupils contracted even in darkness. Many stand in rigid postures, having held positions for days. Hands often clenched into fists, ready to strike or guard. The whispers affect them less, but the strain shows in their faces.',
                culturalBackground: `The Earth-Wardens were founded by guardians who swore to protect surface settlements from what their kin awakened in the deep places. Their tradition requires that every member take vows of protection. Dedicating their lives to guarding against the things that crawl up from below. Earth-Warden halls are built at mine entrances and settlement borders. Members serving as watchful sentinels. Through generations of standing guard, their bloodline has adapted. Stone-hardened flesh making them living fortifications. Their patience legendary. Members practice ancient defensive techniques passed down through generations. How to read ground tremors. How to detect deep-earth movement. How to stand unmoving for days if needed. The bloodline values duty and sacrifice. Honor measured in threats prevented and lives protected. But they hear the same whispers as their mining kin. The deep earth calls to all Grimheart. Many Earth-Wardens eventually succumb, walking into caves that collapse behind them. They are the guardians of Grimheart society. Their sacrifice keeping others safe from what they themselves awakened.`,
                statModifiers: {
                    constitution: 3,
                    spirit: 2,
                    agility: -2
                },
                traits: [
                    {
                        id: 'guardians_resolve_grimheart',
                        name: 'Guardian\'s Resolve',
                        description: 'When blood calls to blood, you answer with your body—throwing yourself before the blow meant for another, your stone-hardened frame absorbing the strike that would kill them, though the effort cracks something deep within that never quite heals.',
                        level: 1,
                        icon: 'spell_holy_powerwordshield',
                        spellType: 'REACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'protection',
                            secondaryElement: 'guardian',
                            icon: 'spell_holy_powerwordshield',
                            tags: ['protection', 'sacrifice', 'damage_absorption']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Absorb damage for allies within 10 feet',
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Sacrificial Strain',
                                    description: '50% of absorbed damage as extra harm • Warding backlash',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Protecting others causes additional damage to yourself'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'multi',
                            rangeType: 'ranged',
                            rangeDistance: 10,
                            maxTargets: 5,
                            targetRestrictions: ['ally']
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        triggerConfig: {
                            global: {
                                enabled: true,
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        id: 'ally_damage',
                                        category: 'damage',
                                        name: 'Ally Takes Damage',
                                        parameters: {
                                            perspective: 'ally',
                                            range: 10,
                                            damageThreshold: 1
                                        }
                                    }
                                ]
                            }
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'deep_sight_grimheart',
                        name: 'Deep Sight',
                        description: 'Generations of standing guard in shafts where no torch has ever burned have reshaped your eyes into something more than human—pupils that swallow darkness whole and drink in light that does not exist, seeing clearly through the black heart of the mountain where surface folk would find only blindness.',
                        level: 1,
                        icon: 'ability_rogue_findweakness',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'earth',
                            secondaryElement: 'darkness',
                            icon: 'ability_rogue_findweakness',
                            tags: ['darkvision', 'perception', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Superior Darkvision',
                                    description: 'Darkvision extends to 120 feet',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'See in darkness up to 120 feet'
                                    }
                                },
                                {
                                    name: 'Magical Darkness Penetration',
                                    description: 'Can see through magical darkness',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Magical darkness does not impede vision'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                        id: 'stone_vulnerability_grimheart',
                        name: 'Stone Vulnerability',
                        description: 'Your stone-hardened body conducts electricity dangerously and can be shattered by lightning.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'lightning',
                            icon: 'spell_nature_lightning',
                            tags: ['vulnerability', 'lightning', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Lightning Vulnerability',
                                    description: 'Your mineral-rich flesh conducts lightning like ore in a thunderstorm, every strike arcing through your stone-hardened frame',
                                    statusEffect: {
                                        vulnerabilityType: 'lightning',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Conductive Body',
                                    description: 'Lightning damage you take can deal half damage to allies within 5 feet',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Lightning strikes may arc to nearby creatures'
                                    }
                                },
                                {
                                    name: 'Stone Shattering',
                                    description: 'Lightning damage over 20 can reduce armor by 2 for 1 minute',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Electrical forces can crack stone-hardened defenses'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Terran', 'Primordial'],
                speed: 25,
                baseStats: {
                    armor: 0,
                    hp: 34, // Living fortifications, extra durability
                    mana: 18,
                    ap: 3, // Defensive guardians, standard AP
                    passivePerception: 3, // Watchful sentinels, constantly scanning
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 5, // Decent climbers, but not as good as delvers
                    visionRange: 60,
                    darkvision: 120, // Superior darkvision from Deep Sight trait
                    initiative: 1 // Watchful, quick to react to threats
                },
                savingThrowModifiers: {
                    // Stone guardians resist petrification but are vulnerable to stunning effects
                    advantage: ['petrify'], // Stone nature resists petrification
                    disadvantage: ['stun'] // Stone rigidity vulnerable to stunning effects
                }
            },
            forgemaster: {
                id: 'forgemaster_grimheart',
                name: 'Stone Smith',
                description: 'Hands permanently marked by forge burns and metal work, fingertips calloused into patterns. Forearms scarred from sparks and hot metal. Eyes squinted from years staring into forge fire. Skin shows a reddish tint from constant heat exposure mixed with the gray stone-hardening. Many have missing fingers or fused joints from accidents. They move with purpose, every gesture precise from years of craft.',
                culturalBackground: `The Stone-Smiths claim descent from the first smiths who learned to work metal in volcanic forges deep beneath the mountains. Their tradition requires that every member apprentice for years in the heat of geothermal workshops. Learning techniques passed down through generations. Stone-Smith halls are built around volcanic vents. Forges fueled by the earth's inner fire. Through generations of working with stone and metal, their bloodline has adapted. Stone-hardened skin allowing them to handle materials that would burn others. Hands shaped by years of precise craft. Members practice ancient smithing techniques. How to read metal grain. How to forge weapons that never break. How to shape stone with tools that seem to move on their own. The bloodline values perfection and mastery. Honor measured in items crafted and techniques mastered. But the forge demands constant work. Many Stone-Smiths find themselves unable to rest. Driven to create until their bodies become one with their masterworks. They are the master craftsmen of Grimheart society. Their creations legendary but their obsession consuming.`,
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: -2
                },
                traits: [
                    {
                        id: 'stone_resilience_grimheart',
                        name: 'Stone Resilience',
                        description: 'Your stone-hardened flesh, tempered by the forges and toxic depths of the deep earth, resists both flame and venom that would consume lesser flesh.',
                        level: 1,
                        icon: 'spell_fire_fire',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'earth',
                            secondaryElement: 'stone',
                            icon: 'spell_fire_fire',
                            tags: ['resistance', 'fire', 'poison', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'fire_resistance',
                                    name: 'Fire Resistance',
                                    description: 'Take half damage from fire',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Take half damage from fire sources'
                                    }
                                },
                                {
                                    id: 'poison_resistance',
                                    name: 'Poison Resistance',
                                    description: 'Take half damage from poison'
                                },
                                {
                                    id: 'stone_armor',
                                    name: 'Stone Armor',
                                    description: 'Gain +1 armor from stone-hardened flesh',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: 1,
                                        magnitudeType: 'flat'
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
                        id: 'forge_craft_grimheart',
                        name: 'Forge Craft',
                        description: 'Channel the volcanic breath of the deep forges into steel and stone, tempering a weapon or suit of armor with fire that strengthens blade and bolsters plate for one hour.',
                        level: 1,
                        icon: 'inv_hammer_20',
                        spellType: 'ACTION',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'earth',
                            secondaryElement: 'crafting',
                            icon: 'inv_hammer_20',
                            tags: ['enhancement', 'weapons', 'armor', 'crafting']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                {
                                    id: 'enhanced_weapon',
                                    name: 'Enhanced Weapon',
                                    description: 'Deep-forge heat aligns the weapon\'s edge to supernatural keenness, each strike carrying the mountain\'s own pressure',
                                    statModifier: {
                                        stat: 'weapon_damage',
                                        magnitude: 1,
                                        magnitudeType: 'flat'
                                    }
                                },
                                {
                                    id: 'enhanced_armor',
                                    name: 'Enhanced Armor',
                                    description: 'Forge-fire tempers the armor\'s plates until they resist blows like the mountain resists the storm',
                                    statModifier: {
                                        stat: 'armor',
                                        magnitude: 1,
                                        magnitudeType: 'flat'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'hours',
                            durationUnit: 'hours',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'touch',
                            targetRestrictions: ['object']
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'stone_frailty_forgemaster',
                        name: 'Stone Frailty',
                        description: 'Where forge-heat meets acid, your mineral flesh betrays you—the crystalline lattice that hardens your skin against flame becomes a pathway for corrosives, the very stone you were tempered in melting away like slag in a rainfall of vitriol.',
                        level: 1,
                        icon: 'spell_nature_acid_01',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'acid',
                            icon: 'spell_nature_acid_01',
                            tags: ['vulnerability', 'acid', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Acid Vulnerability',
                                    description: 'Forge-heat and stone-hardened flesh cannot resist alchemical acids that dissolve the crystalline lattice of generations of deep-earth work',
                                    statusEffect: {
                                        vulnerabilityType: 'acid',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    name: 'Stone Dissolution',
                                    description: 'Acid damage reduces your natural armor temporarily',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Acid damage can weaken your stone-hardened defenses'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Terran', 'Primordial'],
                speed: 25,
                baseStats: {
                    armor: 0, // Stone Resilience passive adds +1, so base is 0
                    hp: 30, // Stone-hardened craftsmen
                    mana: 20,
                    ap: 3, // Steady craftsmen, standard AP
                    passivePerception: 12, // Precise craft requires good perception
                    swimSpeed: 10, // Not swimmers, calculated from speed
                    climbSpeed: 15, // Decent climbers, work in volcanic forges
                    visionRange: 50,
                    darkvision: 30, // Work in forges, adapted to low light
                    initiative: 0 // Precise but not quick to react
                },
                savingThrowModifiers: {
                    // Master smiths resist exhaustion but are vulnerable to stunning
                    advantage: ['exhaustion'], // Tireless craftsmen resist exhaustion
                    disadvantage: ['stun'] // Focused work vulnerable to stunning interruptions
                }
            }
        }
    },

    mimir: {
        id: 'mimir',
        name: 'Mimir',
        essence: 'Face-thieving chameleons',
        description: 'We have forgotten our own names so we can remember yours. Our true faces are a blur of potential, a shifting landscape of bone and skin that knows no rest. We wear your identities like borrowed cloaks, fitting ourselves into the gaps of your society until we are more "you" than you are. Every smile we offer is a masterpiece of mimicry, every gesture a stolen fragment of a life we never lived. Our eyes are pools of ink that have seen a thousand lives and owned none of them. We are the whisper in the crowd, the stranger who knows your secrets, the ghost in the mirror that smiles when you do not. We do not have a home, for we are nomadic in our own flesh. We are the ultimate witnesses of your world, the ones who know that identity is merely a mask we choose to wear.',
        icon: 'fas fa-mask',
        overview: 'The Mimir are people whose ancestors suffered a curse that stripped them of their original forms. Through generations of adapting to survive, their bloodlines have mastered shapeshifting. But at the cost of ever truly knowing who they are. They are organized into communities that hide in plain sight. Settlements built in places where reflections multiply. Beneath cities, in abandoned factories, anywhere mirrors and glass create endless copies. The Mimir don\'t choose to change. It\'s their nature, passed down through bloodlines that remember the loss of form.',
        culturalBackground: `Mimir communities are hidden enclaves built in places where reflections multiply endlessly. Beneath cities, in abandoned mirror factories, anywhere glass and polished surfaces create copies of reality. Each community traces its lineage to ancestors who lost their true forms. Traditions focused on survival through adaptation. Mimir children are taught from birth to avoid mirrors. Prolonged reflection can shatter their fragile sense of self. Community elders pass down the old ways. How to copy forms perfectly. How to maintain a facade. How to trade in identities and secrets. They practice ancient techniques passed down through generations. How to read faces to copy them. How to adopt mannerisms. How to become anyone except themselves. But every transformation erodes another piece of their soul. Memories fade. Habits change. Until they wonder if any face is truly theirs. Community disputes settle through deception competitions and the testimony of those who remember the most faces. They are a people bound by the need to adapt and haunted by the question of who they once were. Their mastery of deception unmatched but their own identity forever lost.`,
        variantDiversity: 'The Mimir are divided into two major bloodlines: The Face-Thieves perfect the art of impersonation and embrace their shapeshifting nature, while the Shattered struggle with fragmented identities and the pieces of who they once were.',
        integrationNotes: {
            actionPointSystem: 'Mimir abilities focus on deception, adaptation, and identity manipulation. Their shapeshifting provides unique infiltration and social options.',
            backgroundSynergy: 'Mimir excel in backgrounds emphasizing deception, adaptability, and social manipulation. Their identity crisis can create compelling roleplay opportunities.',
            classCompatibility: 'Mimir make excellent rogues, spies, and social characters. Their shapeshifting abilities enhance classes that rely on deception and infiltration.'
        },
        meaningfulTradeoffs: 'Mimir gain powerful shapeshifting and deception abilities but suffer from identity loss, mental instability, and the constant risk of losing themselves in their disguises.',
        baseTraits: {
            languages: ['Common', 'Changeling'],
            lifespan: '70-90 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '140-200 lbs',
            build: 'Variable and adaptable'
        },
        epicHistory: `
The First Mirror came before memory was written. Ancient sorcerers hungry for power sought the perfect servants—beings who could become anyone, infiltrate any court, steal any secret. They crafted a curse that stripped forms from an entire people, leaving behind only malleable flesh and the hunger for faces that were not their own. For three generations, the Faceless Ones served their masters with perfect loyalty. They could wear any face, speak any voice, become anyone their masters desired. Palace walls offered no protection. Secrets had no sanctuary. The sorcerers grew wealthy beyond measure, their empire built on perfect spies and assassins who could never be identified.

Then came the Great Shattering. The sorcerers' hubris exceeded even their considerable power. They sought to reshape the curse itself, to make their servants' transformations permanent rather than temporary. The ritual shattered instead. The curse backflooded through their workshops and palaces, transforming the masters into what they had created. The sorcerers lost their own forms, their flesh becoming clay that could never settle. Their minds fragmented under the weight of too many stolen faces. In their final moments of sanity, they commanded their servants to flee—to run, to hide, to never let the world see what they had become.

The Faceless Ones scattered across the world. Some founded hidden communities in places where reflections multiply—abandoned mirror factories, glass towers, subterranean lakes of polished obsidian. Others wandered alone, unable to bear seeing their formless reflections in still water or polished metal. Most died within a generation, their minds breaking under the constant pressure of never knowing which face was truly theirs. Those who survived did so by embracing their nature. They became the Mimir—people who shift between forms not because they want to, but because they cannot stop.

The centuries have not been kind. Hunted by those who fear their shapeshifting, the Mimir learned that survival means remaining unseen. Their communities moved deeper underground, built more cunning protections, developed new techniques for maintaining facades that could fool even magical detection. But the cost was always the same—each transformation eroded another piece of their identity. Every face worn became another memory lost. Every disguise maintained became another habit adopted until they couldn't remember which behaviors were their own.

Now the world changes again. Armies march to eastern borders, empires collapse under shadow, and ancient powers stir from slumber. The Mimir see opportunities in this chaos—opportunities to create new identities, to infiltrate courts in upheaval, to finally find faces that won't be questioned. But they also see danger. Wizards hunt shapeshifters as abominations. Religious orders demand their extermination. Even common folk fear those whose features never settle. The Mimir stand at a crossroads between embracing their curse forever or finding a way to reclaim what their ancestors lost.
        `,
        notableFigures: [
            {
                name: 'Valerius the Face-King',
                title: 'The Last Sorcerer',
                portraitIcon: 'Armor/Head/head-golden-crown-helmet',
                backstory: `
The sorcerer who created the First Mirror, Valerius sought power through perfect deception. For decades, he commanded an army of Faceless Ones who infiltrated every court, stole every secret, assassinated every rival. His empire spanned half the continent, built not on armies or fortifications but on information—on knowing every move before it was made, every word before it was spoken.

The Great Shattering began with his attempt to perfect the curse. Valerius wanted servants who could maintain disguises indefinitely, who could become their infiltrations completely. The ritual required immense power—more than he possessed alone. He drew from every ley line, drained magical nexus points, and bound himself to entities whose names have been forgotten by time itself.

When the curse backflooded, Valerius suffered worse than anyone. His flesh became clay that shifted between the faces of every person he had ever used. His mind fractured under the weight of thousands of stolen personalities. In his final moments of sanity, he saw what he had become—not a man, not even a monster, but something infinitely worse. A living kaleidoscope of identities that could never be whole again.

The last thing Valerius did before madness took him completely was to command his servants to flee. Some scholars argue this was an act of mercy, that even in his horror he sought to save others from his fate. Others claim it was calculation—that he wanted the Mimir scattered so they could not seek revenge, so they could not find his resting place and end his eternal suffering.

His body was never found. Some say he dissolved completely, his clay-form melting away until nothing remained. Others whisper that he still exists—a patchwork of faces wandering the world, unable to remember who he was but unable to die because he is nothing and everything at once.
                `
            },
            {
                name: 'Lyra Mirror-Breaker',
                title: 'The Liberation',
                portraitIcon: 'Armor/Head/head-blue-visor-helmet',
                backstory: `
The first Mimir to reject their curse, Lyra was born to Face-Thief parents who taught her that identity was a weapon to be sharpened. From childhood, she learned to copy faces, voices, mannerisms with perfect precision. By sixteen, she had worn more identities than most people meet in a lifetime. But every transformation left her hollow, every disguise made her wonder which personality was truly hers.

The breaking came during a infiltration of the Imperial Court. Lyra spent three months as a noblewoman's handmaiden, maintaining the disguise so perfectly that even the noblewoman's family believed her to be their daughter. Then came the night when her disguise threatened to consume her. She felt her own memories slipping, her own habits replaced by those she was copying. In that moment of panic, she made a choice that would change Mimir history.

She smashed every mirror in her chambers. She stood before the court not as someone else but as herself—shifting, formless, unashamed. She revealed her nature to the emperor himself, not begging for mercy but demanding recognition. "I am not this face," she told him. "I am not any face. I am what remains when all masks are stripped away."

The emperor, impressed by her honesty and courage, granted her sanctuary in his archives. There, Lyra spent decades studying the curse, searching for ways to break it. She never found a complete solution, but she discovered something valuable—theritual of face-binding. By creating anchors to their original identities, Mimir could resist personality bleed, could maintain their core selves beneath every disguise.

The technique spread through Mimir communities like wildfire. Some embraced it as salvation, others as weakness. Lyra died old and surrounded by students, her face shifting gently between expressions of peace. She never reclaimed her original form—no one could, for it was lost centuries before her birth. But she found a new form, one she chose herself. The form of a teacher, a liberator, a woman who proved that even cursed people could choose who they wanted to be.
                `
            },
            {
                name: 'Kaelen of the Thousand Faces',
                title: 'The Wanderer',
                portraitIcon: 'Armor/Head/head-hooded-helmet',
                backstory: `
A Shattered Mimir whose mind broke under too many transformations, Kaelen should have been lost to madness. His features shift randomly, never settling on one form. His speech patterns change mid-sentence. His movements are jerky, as if controlled by different minds. But instead of succumbing to his fracturing, Kaelen found a different path to wholeness.

He became a wanderer, traveling from kingdom to kingdom, never staying in one place long enough for anyone to notice his instability. Along the way, he collected pieces of himself—memories, habits, personality fragments that surfaced during his shifts. He wrote them in journals, painted them in murals on cave walls, carved them into wooden tablets he carried everywhere. A thousand little pieces of who he was, scattered across the world.

What made Kaelen remarkable was not his stability but his adaptability. Because his mind was already fractured, he could integrate new personalities with ease. Where other Mimir struggled with personality bleed, Kaelen welcomed it as opportunity. Each new face became another perspective, another way of seeing the world. Over decades, he accumulated thousands of viewpoints, thousands of memories, thousands of ways of being human.

Kaelen became a legend among Mimir—not as a figure of tragedy, but as one of wisdom. Young Mimir sought him out, hoping he could teach them how to live with their fracturing. His lessons were simple but profound: "You are not one person broken apart. You are many people learning to be whole. Every shift is not losing yourself. It is becoming more."

He disappeared decades ago, though stories persist of a figure whose face changes like flowing water but whose voice carries the weight of a thousand lives. Some say he found a way to merge all his fragments into something new. Others claim he simply learned to embrace his nature completely. Whatever the truth, Kaelen proved that even the most shattered minds could find purpose, could create meaning from chaos, could become something whole through the embrace of brokenness.
                `
            }
        ],
        majorLocations: [
            {
                name: 'The Mirror Warrens',
                description: `
Hidden beneath the ruins of an ancient glass-blowing city, the Mirror Warrens are the largest surviving Mimir settlement. Three hundred Mimir live in tunnels lined with polished obsidian walls that reflect infinitely in every direction. The light from thousands of candles multiplies through reflections, creating an illumination that seems brighter than should be possible underground.

The Warrens are divided into quarters based on bloodline. Face-Thieves occupy the outer tunnels where access to the surface is easier, their homes filled with mirrors for practice and collections of stolen faces displayed like trophies. Shattered live deeper, their quarters bare of any reflective surface, walls covered instead with tapestries and murals depicting memories they struggle to preserve.

Central to the Warrens is the Hall of First Reflections—a vast chamber lined with ancient mirrors that according to legend were created during the Great Shattering. The mirrors show nothing but darkness to most, but Mimir who look into them report seeing faces that shift and change. Scholars believe these are echoes of the original sorcerers, trapped forever in the mirrors they created.

The Warrens survive through cunning. Entrances are hidden behind ordinary buildings, disguised as cellars or sewer access. Trade is conducted through intermediaries, never face-to-face. The community has survived purges, invasions, and centuries of persecution by simply being too well-hidden to be found.

But survival has come at cost. The Warrens are isolated from the world above. Children born there have never seen the sun. Cultural practices have frozen around ancient traditions that may no longer serve the changing world. Young Mimir dream of the surface, of traveling, of seeing horizons that aren't reflections. Their elders warn them that the surface holds only danger, that the world would destroy them if discovered. The Warrens are sanctuary, but they are also a cage.
                `
            },
            {
                name: 'Glass Lake Sanctuary',
                description: `
Deep within a subterranean cavern system, Glass Lake is a body of water perfectly still and polished as any mirror. The ceiling sparkles with crystal formations that reflect the water's surface infinitely, creating an illusion of an impossible depth. The air smells of minerals and echoes carry strangely, as if speaking through water.

Glass Lake was chosen as sanctuary specifically because of its reflective properties. Shattered Mimir, those whose minds are most fragile, came here seeking relief from the constant pressure of seeing reflections everywhere. They built floating homes on platforms of crystal, careful to position them where the water's surface reflects only stone walls, never their own shifting faces.

The community is small—only fifty Mimir live here, all Shattered or their descendants. They practice the memory-keeping techniques developed by Lyra, anchoring their identities to prevent further fracturing. The result is a community of unusual stability—faces still shift, but personalities remain relatively consistent, memories persist longer than in other settlements.

Glass Lake is also a place of healing. Mimir whose minds have nearly broken make pilgrimages here, hoping the peaceful reflections and community support will help them recover. Success is not guaranteed—many who come do not recover, or recover only partially. But those who do find a measure of peace, a community that understands their condition without judgment.

The sanctuary faces new threats. Explorers seeking underground wonders occasionally discover the cavern system. Mining operations in the region draw closer with each decade. The Mimir have developed sophisticated warning systems—vibrations detected through the water, echoes monitored for human speech patterns, magical wards that trigger when surface beings approach. But they know they cannot hide forever. Eventually, the world above will find them. The question is whether they will be ready when that day comes.
                `
            }
        ],
        currentCrisis: `
The world's attention turns eastward as shadows lengthen across the continent, and in this distraction, hunters of shapeshifters grow bolder. Religious orders that once declared Mimir abominations now organize crusades, their inquisitors trained to detect even the most subtle illusions. Magical academies research new methods of identifying those who wear false forms. Even common kingdoms, once content to ignore scattered Mimir communities, now offer bounties for anyone who can capture or kill these "face-thieves."

For the Mimir, this is not new persecution but its scale is unprecedented. Inquisitions sweep through cities, interrogating anyone whose appearance seems slightly wrong, whose habits don't quite match their history. Mirror-makers are questioned under torture, forced to reveal which customers might be Mimir in disguise. Innocent people are denounced, their lives destroyed by the mere suspicion of wearing false faces.

The Mimir's traditional survival methods are failing. Hidden communities are being discovered through magical scrying. Cunning disguises are penetrated by new detection spells. Even the Face-Thieves' legendary skill at impersonation is no guarantee against inquisitors who can see through illusion with the right spells.

This crisis forces a choice on every Mimir: hide deeper, possibly abandoning even the largest settlements like the Mirror Warrens; or find a way to fight back. Some Mimir argue for deeper isolation, for creating communities so hidden they can never be found. Others advocate for retaliation—for using their shapeshifting abilities to infiltrate the very organizations hunting them, to destroy the detection methods from within.

Most pressing is the split in Mimir society between those who embrace their curse and those who seek to break it. For generations, Mimir debated whether their shapeshifting was gift or punishment, whether they should master it or find ways to suppress it. This debate has intensified under persecution. Face-Thieves, who benefit most from their abilities, push for embracing the curse completely, for using it as a weapon against their enemies. Shattered, who suffer most from its effects, argue for seeking the ancient sorcerers' lost knowledge, for finding a way to reclaim permanent forms.

Time grows short. Inquisitors close in on the Mirror Warrens. Magical detection networks expand across the continent. The Mimir stand at a crossroads between extinction and transformation, between hiding forever and making the world accept what they are. Whatever choice they make, it will determine whether the Mimir survive as a people or are scattered like reflections that can no longer find a mirror to show them.
        `,
        culturalPractices: `
Before your first transformation as a child, elders guide you through the Ritual of First Faces. You sit before a mirror specially prepared with enchanted glass that shows only outlines, no details. The ritual teaches you to feel the clay beneath your skin, to understand that your form is malleable, that you are not bound to one shape. The first transformation is terrifying—your face ripples like disturbed water, your features blur and reform as someone else's. Elders catch you before panic can take hold. "This is not losing yourself," they tell you. "This is becoming more. Every face you wear is yours for as long as you wear it. The ritual ends when you successfully complete your first transformation and hold it for one full hour. Only then are you recognized as true Mimir.

Identity Anchoring is a practice developed by Lyra Mirror-Breaker and passed down through every Mimir community. Before taking a disguise, you create an anchor—a physical token infused with your true self. A carved wooden figure, a painted stone, a woven bracelet. As long as you hold this anchor while transformed, your original personality remains intact. The anchor doesn't prevent personality bleed entirely, but it slows it, gives you time to recognize when copied habits are replacing your own. When you return to your natural form, you meditate with the anchor for one full hour, allowing any adopted habits to fade, your true self to reassert. Mimir who practice Identity Anchoring report feeling more whole, more stable. Those who don't often lose themselves completely, becoming permanent copies of others.

Face Collections are both trophies and training tools. Face-Thieves maintain galleries of faces they've successfully copied, displayed in small mirrors like portraits. Each face shows the person at the moment of copying—the expression frozen, the mannerisms captured. Studying these collections allows Face-Thieves to perfect their technique, to notice the smallest details they might miss. But there is darker purpose. By meditating on a face collection, a Face-Thief can occasionally gain insight into the lives of those they impersonated—glimpses of memories, moments of personality that bled through during the disguise. These insights are fragmentary and unreliable, but sometimes valuable.

Shattered Mimir practice Memory Keeping instead of face collecting. They maintain journals recording every memory that surfaces, every habit they develop during shifts, every personality fragment that emerges. Some Shattered create physical memory anchors—paintings, carvings, written accounts of their different selves. Others practice memory sorting, meditation techniques to organize the chaos of their fractured minds into something coherent. The goal is not to become one person again—that is impossible—but to understand the pieces they are, to accept that being many is their nature.

Community disputes in Mimir settlements are settled through the Deception Trials. When two Mimir cannot agree, they compete in tests of disguise and misdirection. One might transform to impersonate a respected elder, the other must determine whether the impersonation is perfect. Another might infiltrate the other's household undetected, retrieve a specific item, and return it. These trials serve multiple purposes: they resolve conflicts without violence that could attract unwanted attention, they train skills essential to survival, and they identify whose deception is superior. Face-Thieves dominate the trials, their training emphasizing perfect imitation. Shattered sometimes win through unpredictability, their fractured minds creating deceptions no one would expect.

The Mirror Avoidance is the most universal Mimir practice. From childhood, Mimir are taught to avoid reflective surfaces, to never look directly into mirrors, to treat still water with the same caution as open flame. The reason is psychological. Seeing their own reflections shatters their fragile sense of self, reminds them of what they've lost. Some Shattered take this to extremes, living in spaces without any reflective surfaces, covering or destroying any mirror they encounter. Face-Thieves are more comfortable with mirrors, using them as tools rather than looking into them directly. But even the most experienced Face-Thief glances away from their own reflection occasionally, unable to bear seeing the endless parade of faces that have replaced who they once were.

Death rites for Mimir focus on one question: who was this person truly? Before death, elders gather around the dying Mimir, asking questions meant to help identify the true self beneath all disguises worn. The dying describe their earliest memories, their most consistent habits, the parts of themselves that never changed. These accounts are recorded, added to community histories as the closest thing to identity that Mimir can have. Burial practices involve covering the face, not to hide it but to prevent the living from seeing the final shift—the last transformation as the body settles into death. Some communities bury with mirrors meant to capture the departing soul's reflection, though no one knows if this actually works or is simply superstition born of hope.
        `,
        subraces: {
            doppel: {
                id: 'doppel_mimir',
                name: 'Face Thief',
                description: 'Features shift constantly, never settling. Skin ripples like water when they transform. Hands adept at copying gestures, voice mimics perfectly. Eyes that study faces with predatory intensity. Many keep collections of stolen faces in small mirrors. Their own reflection shows multiple overlapping faces. Some develop twitches from holding forms too long.',
                culturalBackground: `The Face-Thieves trace their lineage to the first Mimir who mastered perfect impersonation. Learning to reshape their flesh like living clay. Their tradition requires that every member apprentice as spies and infiltrators. Learning to copy faces, voices, mannerisms with flawless precision. Face-Thief communities are hidden networks of deception. Members serving as spies, assassins, information brokers. They practice ancient techniques passed down through generations. How to read a face to copy it perfectly. How to adopt mannerisms and speech patterns. How to become anyone they touch. But each transformation costs a piece of their original self. Memories fade. Habits change. Until they wonder if any face is truly theirs. Prolonged disguise leads to personality bleed. Copied person's traits overwrite their own. Many Face-Thieves lose themselves entirely. Becoming permanent copies of others. Original identity shattered like a dropped mirror. The bloodline values skill and perfection. Honor measured in identities stolen and secrets extracted. They are the master deceivers of Mimir society. Their infiltration unmatched but their own identity forever lost.`,
                statModifiers: {
                    agility: 3,
                    charisma: 2,
                    spirit: -2
                },
                traits: [
                    {
                        id: 'perfect_mimicry_mimir',
                        name: 'Perfect Mimicry',
                        description: 'The curse of the Face Thief allows you to steal the very countenance of those you observe — your flesh ripples like dark water, bones shifting and skin reweaving until you wear another\'s face as your own.',
                        level: 1,
                        icon: 'spell_magic_lesserinvisibilty',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'illusion',
                            secondaryElement: 'shapeshifting',
                            icon: 'spell_magic_lesserinvisibilty',
                            tags: ['mimicry', 'disguise', 'shapeshifting']
                        },
                        utilityConfig: {
                            utilityType: 'shapeshifting',
                            selectedEffects: [{
                                id: 'mimicry',
                                name: 'Mimicry',
                                description: 'Copy the appearance and voice of a creature you have observed.'
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
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'adaptive_form_mimir',
                        name: 'Adaptive Form',
                        description: 'Your form flows like memory — cheekbones shift, eyes deepen, skin finds new tones — letting you melt into any crowd as though you had always belonged there.',
                        level: 1,
                        icon: 'ability_druid_forceofnature',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'transmutation',
                            secondaryElement: 'shapeshifting',
                            icon: 'ability_druid_forceofnature',
                            tags: ['adaptation', 'social', 'shapeshifting']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Advantage on social or disguise checks',
                            effects: [
                                {
                                    name: 'Adaptive Form',
                                    description: 'Can alter physical features to gain social advantage',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your form adapts to social situations'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'hours',
                            durationUnit: 'hours',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'illusion',
                            selectedEffects: [{
                                id: 'disguise',
                                name: 'Disguise',
                                description: 'Alter your physical appearance to match any humanoid you have seen.'
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
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'silver_vulnerability_mimir',
                        name: 'Silver Vulnerability',
                        description: 'Vulnerable to silver weapons and radiant damage (+50% damage) due to your shapeshifting curse.',
                        level: 1,
                        icon: 'inv_ingot_silver',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'silver',
                            icon: 'inv_ingot_silver',
                            tags: ['vulnerability', 'silver', 'radiant', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Silver Vulnerability',
                                    description: 'Silver sears your shifting flesh, the pure metal burning through the curse that makes your form malleable',
                                    statusEffect: {
                                        vulnerabilityType: 'silver',
                                        vulnerabilityPercent: 50
                                    }
                                },
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'Holy radiance burns away the stolen faces you wear, searing the curse that allows your shape to shift',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 50
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Changeling', 'Thieves\' Cant'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 22, // Malleable flesh adapts but is physically weaker
                    mana: 30, // Shapeshifting connection grants some mana
                    ap: 4, // Spies and infiltrators need quick reactions - extra action point
                    passivePerception: 14, // Study faces with predatory intensity, excellent observation
                    swimSpeed: 10, // Not swimmers, calculated from speed
                    climbSpeed: 20, // Agile infiltrators, excellent climbers
                    visionRange: 50,
                    darkvision: 0,
                    initiative: 2 // Quick to react, predatory intensity
                },
                savingThrowModifiers: {
                    // Shapeshifting curse makes them vulnerable to poison but deceptive against charm
                    disadvantage: ['poison'], // Shapeshifting curse vulnerable to poison
                    advantage: ['charm'] // Master deceivers resist charm effects
                }
            },
            broken: {
                id: 'shattered_mimir',
                name: 'Broken',
                description: 'Features never quite settle — always flickering between two or three partial identities. One eye blue, the other brown and shifting. Left hand slightly larger than the right. A jawline that cycles angular to round moment to moment. They carry small mirrors compulsively, checking their reflection to see which face is currently winning. Skin has a cracked quality, faint lines where identity fragments meet and conflict. Eyes are the most unsettling — each can be a different color simultaneously. Their voice sometimes changes mid-sentence, pitch and accent shifting without warning. They are the ones who fought the curse and partially lost.',
                culturalBackground: 'The Broken are Mimir who fought against their shapeshifting nature and lost, but did not lose entirely. Their identities are fractured — pieces of themselves held together by will and ritual. They practice the techniques of face-binding: creating anchors to their original identity through personal objects, rituals, and mantras. The Broken serve as teachers, helping young Mimir resist personality bleed. They know the cost of transformation better than anyone. Their communities are quiet places of meditation and identity-preservation.',
                statModifiers: {
                    constitution: 2,
                    wisdom: 1
                },
                traits: [
                    {
                        id: 'fragmented_defense',
                        name: 'Fragmented Defense',
                        description: 'When targeted by an enchantment, illusion, or mind-affecting effect, fragment your identity to scatter the attack. Roll a Wisdom save with advantage. On success, the effect is negated — a fragment absorbs it. On failure, you take half effect and one random personality trait shifts for 1 hour.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'REACTION',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'saving_throw_enhancement',
                            effects: [
                                { type: 'save_advantage', mechanicsText: 'Wisdom save with advantage vs enchantment/illusion/mind-affecting' },
                                { type: 'effect_negation', mechanicsText: 'Negate effect on success, fragment absorbs it' }
                            ],
                            durationValue: 0, durationType: 'instant', durationUnit: 'instant', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'side_effect',
                            effects: [
                                { type: 'personality_shift', mechanicsText: 'On failure: half effect and one random personality trait shifts for 1 hour' }
                            ],
                            durationValue: 1, durationType: 'hours', durationUnit: 'hours'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'face_anchor',
                        name: 'Face Anchor',
                        description: 'Touch a personal object and bind a fragment of your identity to it. For 24 hours, advantage on saves vs identity loss, personality bleed, and transformation. If the object is destroyed, take 2d6 psychic damage and become dazed for 1 round.',
                        level: 1,
                        icon: 'spell_holy_divinespirit',
                        spellType: 'ACTION',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'identity_anchor',
                            effects: [
                                { type: 'identity_protection', mechanicsText: 'Advantage on saves vs identity loss, personality bleed, and transformation effects' }
                            ],
                            durationValue: 24, durationType: 'hours', durationUnit: 'hours', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'penalty',
                            effects: [
                                { type: 'anchor_destruction', value: '2d6', mechanicsText: 'If anchor object is destroyed: take 2d6 psychic damage and dazed 1 round' }
                            ],
                            durationValue: 0, durationType: 'conditional', durationUnit: 'on_anchor_destroyed'
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'touch', targetRestrictions: ['object'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['somatic'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'identity_shield',
                        name: 'Identity Shield',
                        description: 'Your fractured mind resists assault because there is no single self to target — only fragments. Resistance to psychic damage. Advantage on saves vs charm, fear, and mind-control.',
                        level: 1,
                        icon: 'spell_shadow_antimagicshell',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'passive_resistance',
                            effects: [
                                { type: 'psychic_resistance', mechanicsText: 'Resistance to psychic damage' },
                                { type: 'mental_save_advantage', mechanicsText: 'Advantage on saves vs charm, fear, and mind-control' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'fragment_memory',
                        name: 'Fragment Memory',
                        description: 'Your identity fragments each carry different memories. Advantage on Intelligence checks to recall information — if your primary mind does not know, one of your fragments might. You can attempt any Intelligence check even if untrained.',
                        level: 1,
                        icon: 'spell_arcane_arcanebrilliance',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [
                                { type: 'intelligence_advantage', mechanicsText: 'Advantage on Intelligence checks to recall information' },
                                { type: 'untrained_attempt', mechanicsText: 'Can attempt any Intelligence check even if untrained' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'mirror_vulnerability_mimir',
                        name: 'Mirror Vulnerability',
                        description: 'Seeing your own reflection forces a Wisdom save (DC 13) or you take 1d6 psychic damage from identity conflict. Silvered mirrors deal 2d6 instead. You avoid mirrors whenever possible — the sight of your fractured self is painful.',
                        level: 1,
                        icon: 'spell_shadow_psychichorrors',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                { type: 'reflection_damage', value: '1d6', mechanicsText: 'Seeing own reflection: Wisdom save DC 13 or 1d6 psychic damage (2d6 from silvered mirrors)' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    }
                ],
                baseStats: { health: 11, mana: 4, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['psychic', 'charm'], disadvantage: ['identity_effects'] }
            }
        }
    },

    briaran: {
        id: 'briaran',
        name: 'Briaran',
        essence: 'Thorn-scarred outcasts',
        description: 'Our flesh is a garden of sharp geometry, a living map of the bargains our ancestors struck in the moonlit groves. Every thorn that breaks our skin is a sentence in a contract we cannot flee, a physical enforcement of a word given before the rising of the sun. We do not just make promises; we grow them. When we speak, the vines in our hair tighten; when we lie, the thorns turn inward to taste our own blood. Our eyes hold the silver glint of the Fae-realm, a light that does not warm but only reveals what is hidden. We are the survivors of the Great Bargain, the ones whose very bodies are the ink upon the page. We walk between the courts of the high and the wild of the deep woods, forever bound by the etiquette of the ancient ones. To love us is to bleed; to betray us is to die.',
        icon: 'fas fa-leaf',
        overview: 'The Briaran are people whose ancestors made bargains with fae entities in moonlit groves. Binding their bloodlines to supernatural contracts. Through generations of these pacts, their skin has been marked by thorns that grow like living contracts. Enforcing their word with physical pain. They are organized into courts and communities bound by strict etiquette and unbreakable promises. The Briaran don\'t choose to be bound. It\'s their heritage, passed down through bloodlines that cannot break the ancient bargains.',
        culturalBackground: `Briaran society is built on the ancient pacts their ancestors made with fae entities. Communities organized into courts bound by etiquette and obligation. Each court traces its founding to legendary bargains made in moonlit groves. Traditions enforcing the word given centuries ago. Briaran settlements are built around great thorn hedges that bloom with impossible flowers. Halls filled with the scent of blood and roses. Children are taught from birth the dance of words. Every promise must be honored. Every slight avenged. Every favor repaid threefold. Their skin sprouts thorns like living contracts. Beautiful and deadly reminders of bargains that cannot be broken. Court elders pass down the old ways. How to make binding promises. How to enforce contracts. How to navigate the labyrinth of fae etiquette. Breaking a bargain isn't just dishonorable. It's physically painful. The thorns turning inward to punish the oathbreaker. Court disputes settle through ritual duels and the testimony of thorns that remember every promise made. They are a people bound by word and thorn. Their mastery of contracts unmatched but their freedom forever limited by ancient bargains.`,
        variantDiversity: 'The Briaran are divided into three major court bloodlines: The Oathbound are bound to noble fae courts and excel in diplomacy, the Thornscar rejected civilization for primal freedom, and the Dusk-Walkers navigate the twilight boundary between light and shadow.',
        integrationNotes: {
            actionPointSystem: 'Briaran abilities focus on social manipulation, nature magic, and binding contracts. Their fae nature provides unique diplomatic and magical options.',
            backgroundSynergy: 'Briaran excel in backgrounds emphasizing charisma, nature magic, and social interaction. Their binding contracts create interesting roleplay opportunities.',
            classCompatibility: 'Briaran make excellent diplomats, nature casters, and support characters. Their social abilities and nature magic enhance classes that rely on charisma and natural magic.'
        },
        meaningfulTradeoffs: 'Briaran gain powerful social and nature abilities but are bound by strict behavioral codes and supernatural contracts. Their thorns cause them pain when using their powers.',
        baseTraits: {
            languages: ['Common', 'Sylvan'],
            lifespan: '250-350 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'8" - 6\'4"',
            weight: '140-220 lbs',
            build: 'Graceful and elegant'
        },
        epicHistory: `
The First Bargains came before the Briaran were named, when human ancestors first made deals with fae entities in moonlit groves. The promises were simple - protection of groves in exchange for service, knowledge of fae ways in exchange for favors, survival in exchange for bloodline binding. But those first bargains bound not just those who made them but their children and their children's children, creating living contracts that manifested as thorns.

During the Court of Weeping Thorns, centuries of unfulfilled promises accumulated until thorns grew inward on court members, piercing hearts that failed to honor what was spoken. The court sessions became deadly, every word carrying weight of promises that couldn't all be kept, every thorn reminding of contracts that bound bloodlines.

The Thornscar emerged from that court, rejecting civilization for primal freedom. They broke away from courts, choosing to live in wild groves where fae entities watch from shadows but don't hold formal court. Their thorns grow wild and unkempt, their promises spoken freely without court consequence.

The Dusk-Walkers emerged from navigating the twilight boundaries between courts and wild groves. Their eyes adapted to see in moonlit groves where other Briaran cannot, their thorns growing in patterns that reflect the twilight between light and shadow. They serve as messengers carrying words between realms.

The Oathbound remained in courts, their bloodlines carrying the most sophisticated understanding of fae ways and court etiquette. They excel in diplomacy and negotiation, speaking words that grow thorns of impossible beauty and binding strength.

The Faie Accords established rules between courts and wild groves. The Oathbound would represent courts in formal negotiations with fae entities. The Thornscar would be respected as wild but bound to same ancient bargains. The Dusk-Walkers would serve as messengers between courts and wild groves, navigating twilight boundaries.

Now the darkness spreads across eastern lands and threatens realms that have never seen fae courts. The Oathbound prepare to negotiate with entities that watch from moonlit groves. The Thornscar prepare to use primal freedom to maneuver where courts cannot. The Dusk-Walkers prepare to navigate twilight boundaries between human realms and fae wild.

The Faie Accords that have held for generations will be tested. The darkness will come, and courts and wild groves will need to unite behind ancient bargains that bind all Briaran regardless of court structure. The thorns will grow, and the promises will bind.
        `,
        notableFigures: [
            {
                name: 'Elder Thorne Oathbound',
                title: 'The Weaver of Promises',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The most skilled Oathbound negotiator, Thorne has spoken words that grown thorns for ninety years. His thorns bloom with flowers of impossible beauty, patterns that reflect decades of court sessions and negotiations. His bloodline carries the most important bargains with noble fae entities that watch from moonlit groves.

During the Court of Weeping Thorns, Thorne was the one who negotiated peace that ended the deadly accumulation of unfulfilled promises. He spoke words that grew thorns binding both courts and wild groves, establishing accords that have held for generations. His diplomacy saved countless Briaran from thorns that pierced their hearts.

Thorne has never broken a promise in ninety years of court sessions. Every word he speaks is measured with deliberate precision, every agreement he makes grows thorns that bind both parties with beautiful flowers that bloom from his skin. The fae entities watch him with respect, their attention on one who honors their bargains most completely.

The other Briaran consult him for guidance in court etiquette and fae negotiations. His eyes see most clearly in moonlit groves where even Dusk-Walkers sometimes struggle. His understanding of what should and shouldn't be spoken is unmatched by any living Briaran.

When the darkness spreads across eastern lands, Thorne will be the one negotiating with fae entities that watch from moonlit groves. His thorns will grow with promises made to protect human realms, his diplomacy serving as bridge between fae courts and the darkness that comes.
                `
            },
            {
                name: 'Scout Elara Thornscar',
                title: 'The Untamed Hunter',
                portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
                backstory: `
The most respected Thornscar elder, Elara rejected civilization sixty years ago and has lived in wild groves since. Her thorns grow wild and unkempt, patterns that speak of freedom and rejection of court chains. Her bloodline carries ancient bargains but rejects court structures that would limit her freedom.

During the Court of Weeping Thorns, Elara was one of the first to break away from courts that felt like chains. She walked into wild groves where fae entities watch but don't control, where promises are spoken freely without court consequence. Her thorns grow wild and beautiful, reflecting freedom courts cannot offer.

The other Thornscar respect her as the one who first chose primal freedom. The Dusk-Walkers consult her for guidance through wild groves where courts cannot go. Her eyes see through shadows that blind even Oathbound, her understanding of fae ways learned from living among wild groves.

Elara has lived in wild groves for sixty years, her thorns growing wild and her promises made freely. The fae entities watch her with respect, their attention on one who chose freedom over court chains while still honoring ancient bargains that bind her bloodline.

When the darkness spreads across eastern lands, Elara will use her primal freedom to maneuver where courts cannot. Her knowledge of wild groves and fae ways will serve as bridge between human realms and fae wild, her freedom allowing movement that court structures prevent.
                `
            },
            {
                name: 'Master Kaelen Dusk-Walker',
                title: 'The Twilight Scout',
                portraitIcon: 'Armor/Head/head-split-orange-faceplate-helmet',
                backstory: `
The most skilled Dusk-Walker scout, Kaelen can navigate twilight boundaries between light and shadow that no other Briaran can cross. His eyes adapted to see in moonlit groves where other Briaran cannot, his thorns growing in patterns that reflect the twilight. He serves as messenger and scout, carrying words between courts and wild groves.

During the Court of Weeping Thorns, Kaelen carried messages between courts and wild groves, moving through battlefields too fast for enemies to catch. He crossed lava flows that would have stopped anyone else, climbed volcanic peaks no one else could scale, carried intelligence that saved countless lives.

Kaelen has found paths through moonlit groves that no other Briaran can see, routes through heat and danger that fire within shows him. He moves across lava as if it's solid ground, navigates ash clouds that would choke anyone else, reaches volcanic peaks that seem inaccessible.

The Oathbound respect him as one who understands twilight paths in ways no court-dweller can. The Thornscar respect him as one whose speed has saved countless clans, whose fire-born endurance has carried messages through battles. Both subraces consult him when navigating impossible terrain.

When the darkness spreads across eastern lands, Kaelen will be the one navigating through twilight threats that neither courts nor wild groves can traverse alone. His twilight vision and Dusk-Walker training will guide the path through dangers that neither can face without him.
                `
            }
        ],
        majorLocations: [
            {
                name: 'The Great Court of Moonlit Promises',
                description: `
The oldest Oathbound court, the Great Court of Moonlit Promises was built in moonlit grove where the first bargains were made. The hall is decorated with impossible flowers that grow from thorns of court members, the scents of blood and roses filling the air like memory of promises made and kept.

Elder Thorne holds court here, negotiating with fae entities that watch from shadows. The thorns that grow during his sessions bloom with flowers of impossible beauty, patterns that reflect decades of diplomacy that established accords holding across generations.

The Great Court has never been breached by any threat, its protection extending to all who honor the bargains made in this grove. During the Court of Weeping Thorns, this court was where peace was negotiated that ended deadly accumulation of unfulfilled promises.

Today, the Great Court operates at full capacity as Oathbound prepare to negotiate with fae entities about the approaching darkness. Thorne holds court sessions constantly, his words growing thorns that bind courts and wild groves together against what comes.
                `
            },
            {
                name: 'The Wild Grove of Unbound Thorns',
                description: `
The oldest Thornscar community, the Wild Grove of Unbound Thorns was established by those who first rejected court chains. The grove is wild and untamed, fae entities watching from shadows but no formal court structure controlling every word or gesture.

Scout Elara leads this community, her thorns growing wild and unkempt as rejection of court chains. The Thornscar who live here make promises freely, their thorns growing without court consequence but no less binding for their wildness and freedom.

The Wild Grove has never been controlled by courts, its existence proof that ancient bargains can be honored without formal structure. During the Court of Weeping Thorns, this grove was where Thornscar fled to escape court chains that felt like deadly weights.

Today, the Wild Grove serves as sanctuary for those who reject court structures, a place where promises are spoken freely and thorns grow wild. Elara leads the community, her knowledge of wild groves serving as bridge between human realms and fae wild.
                `
            }
        ],
        currentCrisis: `
The darkness spreading across the eastern lands has drawn the attention of fae entities that watch from moonlit groves. The Oathbound report entities gathering in twilight, their attention focused on courts with the most important bargains. The Thornscar report fae entities watching wild groves with unusual interest. The Dusk-Walkers report twilight boundaries shifting, the veil wearing thin in ways that suggest something approaches.

The Faie Accords that have held for generations are being tested. The courts and wild groves that existed separately must now unite behind ancient bargains that bind all Briaran regardless of court structure. The darkness will come, and thorns will grow.

Elder Thorne negotiates constantly at the Great Court, his words growing thorns that bind courts and wild groves together. Scout Elara leads Thornscar in wild groves, using primal freedom to maneuver where courts cannot. Dusk-Walkers navigate twilight boundaries, carrying messages between courts and wild groves.

The fae entities watch from moonlit groves and twilight shadows, their attention never leaving those who carry their debts. The darkness approaches, and the entities prepare to collect on bargains made across generations of Briaran ancestors.

When the darkness arrives, the Faie Accords will be tested. The courts and wild groves that existed separately must unite or fall separately. The thorns will grow regardless, promises manifesting as flowers or wild vines or twilight patterns, and the darkness will test whether the accords hold or break.

The ancient bargains that bind all Briaran bloodlines cannot be escaped, but how they're honored can change. The courts and wild groves that existed separately must now find common ground, their thorns growing in patterns that reflect both court structure and primal freedom.
        `,
        culturalPractices: `
Every Briaran child learns the dance of words from their first spoken promise. Every word they speak, even as children, begins growing thorns from their skin. Parents teach them which words are safe to speak, which promises they can make, which fae entities are listening from moonlit groves.

Oathbound children learn court etiquette from earliest years. They practice speaking words with deliberate precision, watching how thorns grow from carefully chosen promises. They learn which gestures carry meaning in court, which silences have weight, which fae entities are watching.

Thornscar children learn wild grove navigation. They learn to move through places where fae entities watch but don't hold formal court, to speak promises freely without consequence, to recognize wild fae ways that differ from court structures.

Dusk-Walker children learn twilight navigation. They learn to see in moonlit groves where other Briaran cannot, to recognize fae entities watching from shadows, to walk boundaries between light and shadow that other Briaran cannot cross.

Every court session is a dance of words and promises. The Oathbound have mastered this dance across generations, every word chosen with deliberate precision, every agreement made with full understanding of thorns that will grow. The Thornscar reject this dance, speaking freely in wild groves where promises are made without court consequence.

The thorns respond to spoken words in every subrace. A promise spoken with sincerity grows beautiful flowers. A promise spoken falsely grows thorns immediately. A broken promise turns thorns inward, piercing skin and flesh, growing toward hearts that failed to honor what was spoken.

The Faie Accords are the laws all Briaran follow. The Oathbound represent courts in formal negotiations. The Thornscar are respected in wild groves but bound to same ancient bargains. The Dusk-Walkers serve as messengers between courts and wild groves, navigating twilight boundaries.

The courts are beautiful but deadly. The halls are decorated with impossible flowers and vines. The scents of blood and roses is everywhere, reminder that every bargain has cost. The fae entities watch from shadows, their attention never leaving those who carry their debts.

The wild groves are beautiful but deadly. The flowers that grow from Thornscar thorns are wild and untamed. The scents of blood and roses lingers differently than in courts, less formal but no less present. The fae entities watch from shadows, their respect extending to those who choose freedom over court chains.

When the darkness comes, the courts and wild groves must unite. The thorns will grow regardless of court structure, promises manifesting in patterns that reflect both court elegance and primal freedom. The fae entities will watch, and the accords will be tested.
        `,
        subraces: {
            courtly: {
                id: 'courtly_briaran',
                name: 'Oathbound',
                description: 'Thorns bloom beautifully along their forearms and shoulders, often growing small flowers alongside the barbs — roses, nightshade, pale foxglove. Skin marked by elegant thorn patterns that shift and rearrange when contracts are made or broken. Hands precise and careful, many bear small puncture wounds from thorns testing their own honesty. Eyes carry the weight of unbreakable promises — pupils contract sharply when a lie is spoken nearby. Speech patterns formal, every word chosen with the care of someone who knows that a misplaced syllable can bind. Their thorns serve as living lie detectors, drawing blood from their own hands when they speak false.',
                culturalBackground: 'The Oathbound trace their lineage to the first Briaran who bound themselves to the noble fae courts. Bloodline marked by thorns that bloom with every promise made. Their tradition requires that every member learn the ancient art of contract-making. Apprenticeships spent studying the complex etiquette of fae courts. Oathbound courts are built around negotiation halls where bargains are made. Members serving as diplomats, mediators, deal-makers. Their thorns serve as living lie detectors. An Oathbound handshake can draw blood if intentions are false. But they pay dearly. Breaking their own promises causes their thorns to turn inward, tearing at their flesh from within.',
                statModifiers: { charisma: 2, intelligence: 1 },
                traits: [
                    {
                        id: 'binding_oath',
                        name: 'Binding Oath',
                        description: 'Speak an oath and watch living thorns grow between you and your sworn companion — ancient fae magic that binds your words with writhing vines of contract. The thorns turn inward on any who break the bargain, punishment carved in blood.',
                        level: 1,
                        icon: 'spell_holy_prayerofhealing',
                        spellType: 'ACTION',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'pact',
                            effects: [
                                { type: 'ability_check_bonus', value: 2, mechanicsText: '+2 to all ability checks for 1 hour' },
                                { type: 'saving_throw_bonus', value: 2, mechanicsText: '+2 to all saving throws for 1 hour' },
                                { type: 'location_awareness', value: 1, mechanicsText: 'Know the exact location of your pact partner' }
                            ],
                            durationValue: 1,
                            durationType: 'hours',
                            durationUnit: 'hours',
                            canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'oath_breaker',
                            effects: [
                                {
                                    name: 'Oath Breaker',
                                    description: '3d6 psychic damage if oath terms are broken',
                                    damageRoll: '3d6',
                                    damageType: 'psychic'
                                }
                            ],
                            durationValue: 1,
                            durationType: 'hours',
                            durationUnit: 'hours',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 30,
                            targetRestrictions: ['willing']
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'long_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'thorn_lash',
                        name: 'Thorn Lash',
                        description: 'Thorns tear through your own flesh to lash outward in a crackling whip of barbed vine — a punishment for falsehood that tears through lies as readily as it tears through skin.',
                        level: 1,
                        icon: 'spell_nature_thorns',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'debuff'],
                        typeConfig: { category: 'racial' },
                        damageConfig: {
                            damageType: 'piercing',
                            damageRoll: '1d8',
                            secondaryDamage: {
                                damageType: 'psychic',
                                damageRoll: '1d6'
                            }
                        },
                        debuffConfig: {
                            debuffType: 'truth_enforcement',
                            effects: [
                                {
                                    name: 'Truth Enforced',
                                    description: 'Unable to speak deliberate lies',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Thorns compel honesty'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            saveType: 'charisma',
                            saveOutcome: 'negates',
                            canBeDispelled: true
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 15
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'living_lie_detector',
                        name: 'Living Lie Detector',
                        description: 'The thorns along your forearms bristle and draw beads of blood whenever a lie is spoken nearby — a painful gift that makes deception impossible to ignore and truth impossible to miss.',
                        level: 1,
                        icon: 'spell_holy_divineprovidence',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        utilityConfig: {
                            utilityType: 'lie_detection',
                            selectedEffects: [{
                                id: 'lie_detection',
                                name: 'Lie Detection',
                                description: 'Detect deliberate lies within 30ft'
                            }],
                            range: 30,
                            power: 'major'
                        },
                        buffConfig: {
                            buffType: 'insight_advantage',
                            effects: [
                                { type: 'skill_advantage', value: 1, mechanicsText: 'Advantage on Insight checks' }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'contract_craft',
                        name: 'Contract Craft',
                        description: 'Prick your own finger and let thorn-blood drip onto parchment — the words that form are alive, binding those who sign with magic older than any court. Each violation sends the contract\'s thorns burrowing deeper into the oathbreaker\'s mind.',
                        level: 1,
                        icon: 'spell_holy_blessed',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        utilityConfig: {
                            utilityType: 'magical_contract',
                            selectedEffects: [{
                                id: 'magical_contract',
                                name: 'Magical Contract',
                                description: 'Draft a binding contract; violators take 1d6 psychic damage'
                            }],
                            power: 'major',
                            limitations: ['one active contract at a time']
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'iron_vulnerability_briaran_oathbound',
                        name: 'Iron Vulnerability',
                        description: 'Cold iron severs the ancient bindings that give your fae blood its power — it burns through thorn and contract alike, leaving your magic hollowed out and your wounds torn wide.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'iron_vulnerability',
                                    name: 'Iron Vulnerability',
                                    description: 'Cold iron burns through fae blood like acid, each wound torn wider by the metal\'s antipathy for ancient bindings',
                                    statusEffect: {
                                        vulnerabilityType: 'iron',
                                        vulnerabilityPercent: 100,
                                        suppressionDuration: 1,
                                        suppressionUnit: 'rounds'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
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
                baseStats: { health: 10, mana: 4, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['charmed'], disadvantage: ['iron_effects'] }
            },
            wild: {
                id: 'wild_briaran',
                name: 'Thornscar',
                description: 'Skin covered in pale scars where thorns turned inward \u2014 the marks of broken fae contracts written permanently across their bodies. Thorns still grow but twisted, jagged, broken from attempts to remove them. Hands calloused from fighting and survival. Eyes fierce and untamed, pupils that reflect light like a cat\'s. Many have thorns still embedded in old wounds. They move with primal grace. Hair often tangled with briars they refuse to remove \u2014 badges of freedom.',
                culturalBackground: 'The Thornscar trace their lineage to Briaran who broke their fae contracts. Thorns turning inward and scarring their flesh as punishment. Their tradition is one of rejection and freedom. Communities built away from fae courts in wild groves where thorns grow wild. Members serving as warriors, hunters, protectors of the wild. Their skin is a tapestry of old wounds, each scar telling a story of obligation rejected and freedom won.',
                statModifiers: { dexterity: 2, constitution: 1 },
                traits: [
                    {
                        id: 'thorn_burst',
                        name: 'Thorn Burst',
                        description: 'The thorns you have suppressed for so long finally erupt — jagged barbs tear free from old scars and explode outward in a violent bloom, leaving you bleeding but surrounded by enemies screaming through mouths full of thorns.',
                        level: 1,
                        icon: 'ability_druid_ferociousbite',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'debuff'],
                        typeConfig: { category: 'racial' },
                        damageConfig: {
                            damageType: 'piercing',
                            damageRoll: '2d6',
                            saveType: 'dexterity',
                            saveOutcome: 'half',
                            selfDamage: {
                                damageRoll: '1d4',
                                damageType: 'piercing'
                            }
                        },
                        debuffConfig: {
                            debuffType: 'embedded_thorns',
                            effects: [
                                {
                                    name: 'Embedded Thorns',
                                    description: '1 piercing damage per turn for 1 minute',
                                    damagePerTurn: 1,
                                    damageType: 'piercing'
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: true
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            areaOfEffect: {
                                type: 'radius',
                                value: 15,
                                unit: 'ft'
                            }
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'pain_focus',
                        name: 'Pain Focus',
                        description: 'Pain is a lens that focuses your fragmented will — every wound sharpens your purpose into a single devastating strike, fury refined through suffering into something precise and terrible.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'ACTION',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'pain_focus',
                            effects: [
                                { type: 'attack_advantage', value: 1, mechanicsText: 'Advantage on next attack after taking damage' },
                                { type: 'damage_bonus', value: 6, mechanicsText: '+1d6 bonus damage on next attack' }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: false
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'scarred_resilience',
                        name: 'Scarred Resilience',
                        description: 'The thorn-scars across your body have hardened your mind against intrusion, and the barbs still embedded in your flesh punish anyone foolish enough to strike you — they come away with blood that is not entirely yours.',
                        level: 1,
                        icon: 'ability_warrior_defensivestance',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        buffConfig: {
                            buffType: 'resilience',
                            effects: [
                                { type: 'damage_resistance', value: 50, mechanicsText: 'Resistance to psychic damage (half damage)' },
                                { type: 'reflect_damage', value: 2, mechanicsText: 'Melee attackers take 2 piercing when you are at half HP or below' }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'freedom_instinct',
                        name: 'Freedom Instinct',
                        description: 'You have already broken the contracts that once bound you — no fae honeyed words or phantom terrors can take hold in a heart that has already paid the price of freedom in blood and scars.',
                        level: 1,
                        icon: 'spell_holy_removecurse',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        buffConfig: {
                            buffType: 'freedom',
                            effects: [
                                { type: 'condition_immunity', value: 1, mechanicsText: 'Immune to charm and fear from fae sources' },
                                { type: 'save_advantage', value: 1, mechanicsText: 'Advantage vs enchantment and compulsion' },
                                { type: 'movement_save', value: 1, mechanicsText: 'Charisma save to ignore movement restriction' }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'iron_vulnerability_briaran_wild',
                        name: 'Iron Vulnerability',
                        description: 'Cold iron finds every old wound and torn contract still written in your flesh, the metal drinking deep of the fae blood that refuses to stop flowing.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'iron_vulnerability',
                                    name: 'Iron Vulnerability',
                                    description: 'Cold iron finds every old wound in your fae flesh, drinking deep of blood that refuses to stop flowing',
                                    statusEffect: {
                                        vulnerabilityType: 'iron',
                                        vulnerabilityPercent: 100
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
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
                baseStats: { health: 12, mana: 3, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['restrained'], disadvantage: ['iron_effects'] }
            },
            dusk: {
                id: 'dusk_briaran',
                name: 'Dusk Walker',
                description: 'Thorns glow faintly in twilight, dimming in full daylight and darkness. Skin changes tone with time of day — warm bronze at noon, cool silver at midnight. Eyes reflect both day and night. They fade slightly in bright light and deep dark, most solid during dawn and dusk. Movement fluid, existing between moments.',
                culturalBackground: 'The Dusk-Walkers trace their lineage to Briaran who made bargains during twilight hours, binding themselves to the boundary between day and night. They navigate liminal spaces. Communities built where day meets night. They are weakened by pure daylight and deepest night, thriving only in liminal hours.',
                statModifiers: { dexterity: 1, charisma: 2 },
                traits: [
                    {
                        id: 'twilight_step',
                        name: 'Twilight Step',
                        description: 'Step through the twilight boundary where day bleeds into night — you vanish through the seam between light and shadow, leaving behind a flash of dim radiance that burns the eyes of those standing too close.',
                        level: 1,
                        icon: 'ability_rogue_shadowstep',
                        spellType: 'ACTION',
                        effectTypes: ['movement', 'debuff'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'teleport',
                            selectedEffects: [{
                                id: 'twilight_teleport',
                                name: 'Twilight Teleport',
                                description: 'Teleport to a space with different lighting within 60ft'
                            }],
                            range: 60,
                            power: 'moderate'
                        },
                        debuffConfig: {
                            debuffType: 'blindness',
                            effects: [
                                {
                                    name: 'Briefly Blinded',
                                    description: 'Creatures within 5ft of departure are briefly blinded',
                                    statusEffect: {
                                        level: 'minor',
                                        description: 'Flash of twilight energy causes momentary blindness'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            canBeDispelled: true
                        },
                        targetingConfig: {
                            targetingType: 'location',
                            rangeType: 'ranged',
                            rangeDistance: 60
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'shadow_veil',
                        name: 'Shadow Veil',
                        description: 'Wrap yourself in the twilight that is your natural home — the grey veil between sun and moon clings to your skin like a second shadow, hiding you from eyes that search only in light or darkness.',
                        level: 1,
                        icon: 'spell_shadow_twilight',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'shadow_veil',
                            effects: [
                                { type: 'stealth_advantage', value: 1, mechanicsText: 'Advantage on Stealth in dim light or darkness' },
                                { type: 'perception_disadvantage_others', value: 1, mechanicsText: 'Others have disadvantage on Perception to detect you' },
                                { type: 'darkvision_enhancement', value: 1, mechanicsText: 'See in magical darkness' }
                            ],
                            durationValue: 10,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: true
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'liminal_existence',
                        name: 'Liminal Existence',
                        description: 'You are strongest in the fleeting moments when day surrenders to night and night yields to morning — the threshold between states is your true home, while the extremes leave you diminished and unmoored.',
                        level: 1,
                        icon: 'spell_shadow_twilight',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        buffConfig: {
                            buffType: 'liminal_boost',
                            effects: [
                                { type: 'all_checks_bonus', value: 1, mechanicsText: '+1 to all checks and saves during dawn and dusk' }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'light_sensitivity',
                            effects: [
                                {
                                    name: 'Light Sensitivity',
                                    description: '-1 to all checks in bright daylight or complete darkness',
                                    statusEffect: {
                                        level: 'minor',
                                        description: 'Weakened outside of liminal hours'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'between_moments',
                        name: 'Between Moments',
                        description: 'Slip between moments in time, existing in the space between heartbeats where others cannot act — but the world exacts a toll for your absence, and you return to find yourself slower, left behind by the flow you escaped.',
                        level: 1,
                        icon: 'ability_rogue_stealth',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        buffConfig: {
                            buffType: 'extra_action',
                            effects: [
                                { type: 'extra_action', value: 1, mechanicsText: 'Once per combat, take an extra action at initiative count 10' }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'initiative_penalty',
                            effects: [
                                {
                                    name: 'Initiative Drain',
                                    description: '-2 initiative for the rest of combat after using extra action',
                                    statModifier: {
                                        stat: 'initiative',
                                        magnitude: -2,
                                        magnitudeType: 'flat'
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'combat',
                            durationUnit: 'combat',
                            canBeDispelled: false
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'radiant_necrotic_vulnerability_briaran',
                        name: 'Radiant and Necrotic Vulnerability',
                        description: 'Caught forever between light and shadow, your twilight nature makes you vulnerable to both extremes — the searing purity of radiance burns you like dawn burns the night, while the absolute void of necrotic entropy swallows the fragile half-light that sustains you.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'radiant_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    description: 'The searing purity of radiance burns you like dawn burns the night — your twilight nature cannot withstand absolute light',
                                    statusEffect: {
                                        vulnerabilityType: 'radiant',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'necrotic_vulnerability',
                                    name: 'Necrotic Vulnerability',
                                    description: 'The absolute void of necrotic entropy swallows the fragile half-light that sustains you — darkness devours twilight',
                                    statusEffect: {
                                        vulnerabilityType: 'necrotic',
                                        vulnerabilityPercent: 100
                                    }
                                }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
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
                baseStats: { health: 10, mana: 4, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['blinded'], disadvantage: ['iron_effects'] }
            }
        },
    },

    groven: {
        id: 'groven',
        name: 'Groven',
        essence: 'Antlered forest-guardians',
        description: 'We are the slow pulse of the forest made flesh, the silent watchers who remember the first seeds. Our skin is the texture of weathered bark, and our bones are as sturdy as ancient oak. We do not walk through the woods; we are a part of them, our footsteps echoing the heartbeat of the land. The antlers that crown our brows are not mere bone, but conduits for the whispers of the groves, reaching for the sunlight and the secrets of the rain. We move with the patience of seasons, for we have seen empires fall like autumn leaves while we remained rooted. Our eyes hold the mossy green of the deep shade, seeing not just the creature, but the life-force that sustains it. We are the stewards of the wild places, the keepers of the old growth that the cities have forgotten. We do not seek your stone walls, for our home is the cathedral of the trees, and we are its living gargoyles.',
        icon: 'fas fa-tree',
        overview: 'The Groven are people whose ancestors made bonds with the primal forces of nature. Their bloodlines marked by the wild through generations. They are organized into groves and tribes bound to ancient forests. Settlements grown from living trees that remember every promise made. The Groven do not choose to be guardians. It is their heritage, passed down through bloodlines that hear the forest call.',
        culturalBackground: `Groven society is built on bonds with ancient groves and the primal forces of nature. Communities organized into tribes bound to specific forests. Each grove traces its founding to legendary guardians who first made pacts with the old spirits. Traditions enforcing the bonds given centuries ago. Groven settlements are grown from living trees. Bark-homes connected to the grove roots. Antlers sprouting from the same primal energy that feeds the forest. Children are taught from birth to hear the forest voice. Not in words, but in the rustle of leaves and the creak of branches. Grove elders pass down the old ways. How to speak with trees. How to call upon primal spirits. How to become one with the wild. Their courts are held in sacred circles where the boundary between flesh and bark blurs. Warriors becoming weapons. Bodies twisting into living wood and thorn. Grove disputes settle through trials of nature and the testimony of ancient trees that remember every bond made. They are a people bound by grove and spirit. Their connection to nature unmatched but their souls forever tied to the wild places they protect.`,
        variantDiversity: 'The Groven are divided into three major grove bloodlines: The Grove-Guardians dedicate themselves to protecting ancient forests, the Trail-Walkers follow seasonal migrations as nomadic wanderers, and the Spirit-Speakers commune with primal spirits and channel ancient nature magic.',
        integrationNotes: {
            actionPointSystem: 'Groven abilities focus on nature magic, physical prowess, and environmental manipulation. Their connection to nature provides unique tactical options in natural settings.',
            backgroundSynergy: 'Groven excel in backgrounds emphasizing nature, protection, and primal power. Their grove bonds create strong territorial motivations.',
            classCompatibility: 'Groven make excellent druids, rangers, and nature warriors. Their physical bonuses and nature magic enhance classes that operate in wilderness settings.'
        },
        meaningfulTradeoffs: 'Groven gain powerful nature abilities and physical prowess but are bound to their groves and suffer when separated from nature. Their wild nature makes urban environments uncomfortable.',
        baseTraits: {
            languages: ['Common', 'Druidic'],
            lifespan: '180-220 years',
            baseSpeed: 35,
            size: 'Medium',
            height: '6\'2" - 7\'2"',
            weight: '200-350 lbs',
            build: 'Tall and sturdy'
        },
        epicHistory: `
The First Binding came when primal energy that shaped wild first spoke to humans. Some folk listened and heard voice that spoke in rustle of leaves and creak of branches, understanding that the forest offered connection in exchange for guardians. Those first listeners became the first Groven, their bloodlines marked by primal energy that flowed through sacred trees.

The forests in those days were different - vast and wild and unconnected by human roads or settlements. The primal energy flowed freely through everything, and the first Groven were simply humans who chose to give themselves to that energy, to become extensions of forests and sacred trees.

During the Burning of the Great Oaks, humans who didn't understand the bond to forest came with fire that burned without listening. They burned sacred groves without listening to the trees' screams, turned living wood into ash without understanding what was being destroyed. The first Grove-Guardians stood at those groves, their bodies twisting into living wood and thorn to fight the flames that threatened sacred trees.

The first Trail-Walkers emerged during those burnings - those who understood that standing still at sacred groves meant death. They walked paths between groves, carrying warnings of approaching fires, guiding Grove-Guardians to sacred trees that could be protected, learning patterns of movement that forest spoke to them.

The first Spirit-Speakers emerged from those burnings too - those who heard trees screaming in pain, watched ancient groves reduced to ash, and stood alone at spaces between trees calling to spirits that lived in the pain. Those spirits chose some and rejected others, and Spirit-Speakers began the practices of channeling primal magic that save groves from flames that don't understand.

The Forest Pact ended the burnings when surviving leaders of humans and Groven met and agreed on new laws. Humans would not burn without listening to the forest's voice. Grove-Guardians would stand at sacred groves and protect them. Trail-Walkers would carry warnings between forests. Spirit-Speakers would channel spirits to bring understanding of threats that trees alone cannot perceive.

The pact has held for generations, but humans forget the laws. Some burn without listening. Others harvest without understanding. Some build where forests should remain wild. The Groven remember, and forests remember through us.

Now darkness spreads across eastern lands, threatening realms that have forgotten the bond to forest. The trees speak of approaching shadows, of fires that burn without respect, of magic that twists the primal energy. The Grove-Guardians prepare to stand at sacred groves. The Trail-Walkers prepare to walk paths and carry warnings. The Spirit-Speakers prepare to channel spirits that understand threats that trees alone cannot perceive.

The primal energy that shapes wild remembers the Burning of the Great Oaks. The trees remember the pain of groves burned without consent, the loss of ancient wisdom, the disappearance of sacred guardians. The forests will call, and we must answer.
        `,
        notableFigures: [
            {
                name: 'Elder Thorn Root-Bound',
                title: 'The Oldest Living Guardian',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The oldest living Grove-Guardian, Thorn has stood at the Elder Oak for more than seventy winters. His antlers have grown so thick they cannot pass through doorways of normal size. His bark-like skin has developed patterns so deep that he appears more tree than person, forest energy flowing through him as completely as through any branch.

During the Burning of the Great Oaks, Thorn stood at his grove when humans came with fire. He was young then, his antlers smaller, but his connection to the Elder Oak was already complete. He transformed for the first time that day, his body twisting into living wood and thorn to fight flames that threatened the sacred tree he'd been bound to since birth.

Thorn has stood through three generations of human forgetfulness. He remembers when humans burned without listening, when they harvested without understanding, when they built where forests should remain wild. The Elder Oak remembers everything, and its voice speaks to Thorn constantly, warning of threats that approach.

The Trail-Walkers bring him messages from forests beyond his grove, speaking of threats that other Grove-Guardians cannot see. Thorn stands still at his grove, his antlers thick, his bark skin covered in patterns that tell of generations of threats he has faced and prevented.

When darkness spreads across eastern lands, Thorn will stand at his grove and become a living weapon. The Elder Oak will call him, and he will answer, his body twisting into living wood and thorn, his antlers crushing whatever threatens the sacred grove he's bound to protect.
                `
            },
            {
                name: 'Scout Fern Path-Walker',
                title: 'The Forest Wanderer',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The most traveled Trail-Walker in living memory, Fern has walked every path that connects groves across five different forests. Her antlers have grown patterns that show every trail she's walked, her bark-like skin developing textures that reflect the diversity of forests she's moved through.

During the Burning of the Great Oaks, Fern walked paths between groves carrying warnings of approaching fires, guiding Grove-Guardians to sacred trees that could be protected. She crossed lava flows that would have stopped anyone else, climbed volcanic peaks no one else could scale, carried intelligence that saved countless lives.

Fern has walked paths that led to forgotten groves that haven't had guardians for centuries, to sacred trees that exist only for those who listen to forest. She remembers every path, and her antlers grow patterns that show where those paths still exist.

The Grove-Guardians say she's uncommitted, that she wanders without giving herself to any grove or tribe. They don't understand that her way of following forest's migrations serves different purpose - she carries messages between tribes, warns of threats that cannot stay at single groves, protects paths that connect forest's sacred places.

When darkness spreads across eastern lands, Fern will walk paths and carry warnings. She'll move between groves and tribes faster than any threat can follow, carrying messages of what's approaching, warning of dangers ahead, protecting the mobility that allows forests to survive.
                `
            },
            {
                name: 'Master Kaelen Spirit-Speaker',
                title: 'The Voice of Spirits',
                portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
                backstory: `
The most skilled Spirit-Speaker, Kaelen has called spirits that exist between trees for forty years. His antlers grow with patterns that show which spirits he's called, patterns that reflect decades of calling spirits to sacred groves.

During the Burning of the Great Oaks, Kaelen heard trees screaming in pain, watched ancient groves reduced to ash. He stood alone at a sacred grove for three days without food or sleep, listening to spaces between trees where primal spirits gather. The spirits who chose him manifested as animals or plants or shapes that don't belong to any category, binding themselves to the first Spirit-Speaker.

Kaelen has called spirits that have existed since before the first Groven, bringing understanding of threats that trees alone cannot perceive. His antlers show patterns of spirits that exist since before humans learned to speak to forest.

The Grove-Guardians consult him when they need guidance in understanding threats that trees alone can perceive. Kaelen brings understanding of threats that trees alone cannot perceive, channeling spirits that understand what's approaching, channeling primal magic that can protect what needs protecting.

When darkness spreads across eastern lands, Kaelen will channel spirits that understand what's coming. The spirits will speak of the spreading darkness, warn of magic that twists the primal energy, carry understanding of threats that trees alone cannot perceive. The primal energy flowing through this space grows stronger with each spirit Kaelen calls.
                `
            }
        ],
        majorLocations: [
            {
                name: 'The Elder Oak Grove',
                description: `
The oldest sacred grove in the forest, Elder Oak has stood for five hundred winters. Its roots connect groves across the entire forest, its canopy provides shelter for countless birds and beasts, its primal energy has flowed through dozens of Grove-Guardians. Thorn Root-Bound stands at its base permanently, his roots binding him to the tree as completely as the tree's roots bind to the forest floor.

The grove is surrounded by smaller trees that have grown from the Elder Oak's influence, their primal energy flowing from the ancient tree. The space between trees is where Spirit-Speakers come to call spirits, canopy above provides shelter for Grove-Guardians who stand at the grove, roots beneath provide connection to the entire forest.

The Elder Oak has witnessed five hundred winters of human forgetfulness. It remembers when humans burned without listening, when they harvested without understanding, when they built where forests should remain wild. The tree's voice speaks constantly to Thorn, warning of threats that approach, carrying understanding of the forest's history.

Today, the grove operates as a center of forest memory. The Trail-Walkers bring messages from other groves. The Spirit-Speakers come to channel spirits between trees. The Grove-Guardians stand at surrounding trees and learn from Thorn's example of giving everything to protect the sacred grove.
                `
            },
            {
                name: 'The Sacred Circle',
                description: `
The gathering place for Spirit-Speakers, Sacred Circle exists in spaces between trees where the primal energy is strongest. The circle itself is not physical but spiritual, a space where spirits manifest more easily, where the forest's consciousness can be heard more clearly.

The Spirit-Speakers who gather here bring understanding from different parts of the forest, channeling spirits that exist in different groves. The primal energy that flows through this space carries their messages to each other, allows them to share understanding of threats that no single spirit perceives completely.

The Grove-Guardians avoid the Sacred Circle - their binding to specific sacred trees makes the primal energy here too confusing, their bodies tuned to the voice of single trees rather than the forest's consciousness as a whole. The Trail-Walkers can find the circle but choose not to enter, their antlers sensitive to movement rather than spiritual understanding.

Today, Sacred Circle gathers with increased activity as Spirit-Speakers sense threats approaching from beyond the forest's borders. The spirits they channel speak of the spreading darkness, warn of magic that twists the primal energy, carry understanding of threats that trees alone cannot perceive. The primal energy flowing through this space grows stronger with each spirit called, and the circle will be where that understanding is shared.
                `
            }
        ],
        currentCrisis: `
The darkness spreading across eastern lands has drawn the attention of the primal energy that shapes wild. The trees speak of approaching shadows, of fires that burn without respect, of magic that twists the natural flow. The Grove-Guardians report that sacred trees are becoming restless, their voices speaking of threats that approach faster than they should. Trail-Walkers report that paths between groves are changing, the forest showing new trails and closing old ones, patterns of movement shifting in ways that suggest something large is approaching.

The Forest Pact that ended the Burning of the Great Oaks has held for generations, but humans have forgotten the laws. Some burn without listening, some harvest without understanding, some build where forests should remain wild. The Groven remember, and forests remember through us.

Elder Thorn Root-Bound stands at the Elder Oak and listens to the tree's voice constantly. The tree remembers the Burning of the Great Oaks, the pain of sacred groves burned without consent, the loss of ancient wisdom, the disappearance of sacred guardians. The primal energy that flows through the Elder Oak calls to Thorn, and he will answer with living weapons that cannot be defeated.

Scout Fern Path-Walker walks paths between groves and tribes, carrying messages of threats that approach. Her antlers sense changes in the forest's patterns, her body remembering how the Burning of the Great Oaks changed how paths could be walked. Master Kaelen channels spirits that understand what's coming.

When darkness reaches the forests, the Forest Pact will be tested. Humans who have forgotten the laws will likely break them again. The Grove-Guardians will stand at sacred groves and become living weapons. The Trail-Walkers will carry warnings along paths that only they can see. The Spirit-Speakers will channel understanding of threats that trees alone cannot perceive.

The primal energy that shapes wild remembers the Forest Pact and the Burning of the Great Oaks. The trees remember everything they've touched, including the pacts that have held since humans forgot the laws. The trees will call, and we must answer with weapons that cannot be defeated by any means available.
        `,
        culturalPractices: `
Every Groven child hears the forest from birth - rustle of leaves speaking warnings, creak of branches telling stories, slow shift of sunlight through canopy showing patterns that only those bound to the forest can understand. We teach them to listen, to distinguish between normal forest sounds and the sacred voice that guides us toward protection.

The first antlers sprout before children can walk properly, pushing through skin as new branches push through bark. The primal energy that shapes them grows faster than their bones can accommodate, leaving children with antlers too large for their bodies until they catch up.

Grove-Guardian children undergo Root Binding before they can protect sacred groves. They stand at the base of their tribe's sacred tree and allow its roots to wrap around their legs, binding them physically to the forest they've sworn to guard. The binding is permanent, but it allows the tree's primal energy to flow through them, to strengthen them against threats, to make them extensions of the forest itself.

Trail-Walker children undergo Path Naming before they can lead migrations. They walk from their birth grove to another tribe's sacred tree, marking the path with antler scratches and bark from their skin. The journey takes weeks and requires understanding the forest's patterns - which paths are safe, which trees offer shelter, where water flows even in drought.

Spirit-Speaker children undergo Spirit Calling before they can channel primal energy. They stand alone at a sacred grove for three days without food or sleep, listening to spaces between trees where primal spirits gather. The spirits who choose them manifest as animals or plants or shapes that don't belong to any category, binding themselves to Groven who called them.

Every court session is a dance of words and promises. The Oathbound have mastered this dance across generations, every word chosen with deliberate precision, every agreement made with full understanding of thorns that will bind all parties with beautiful flowers that bloom from his or her skin. The Thornscar reject this dance, speaking freely in wild groves where promises are made without court consequence.

The thorns respond to spoken words in every subrace. A promise spoken with sincerity grows beautiful flowers. A promise spoken falsely grows thorns immediately. A broken promise turns thorns inward, piercing skin and flesh, growing toward hearts that failed to honor what was spoken.

The Faie Accords are the laws all Groven follow. The Oathbound represent courts in formal negotiations with fae entities. The Thornscar are respected in wild groves but bound to the same ancient bargains. The Dusk-Walkers serve as messengers between courts and wild groves, navigating twilight boundaries. The accords have held since the Burning of the Great Oaks, when the courts and wild groves that existed separately must now find common ground, their thorns growing in patterns that reflect both court structure and primal freedom.

The courts are beautiful but deadly. The halls are decorated with impossible flowers and vines. The scent of blood and roses is everywhere, reminder that every bargain has cost. The fae entities watch from shadows, their attention never leaving those who carry their debts.

The wild groves are beautiful but deadly. The flowers that grow from Thornscar thorns are wild and untamed. The scent of blood and roses lingers differently than in courts, less formal but no less present. The fae entities watch from shadows, their respect extending to those who choose freedom over court chains.

When darkness spreads across eastern lands, courts and wild groves must unite. The thorns will grow regardless of court structure, promises manifesting as flowers or wild vines or twilight patterns, and the darkness will test whether the accords hold or break.

Every Groven carries the ancient bargains in their blood, thorns growing from promises made by ancestors they never knew. The darkness will come, and the thorns will grow, promises manifesting in patterns that reflect both court elegance and primal freedom. The forests will call, and we will answer with thorns that bind us all.
        `,
        subraces: {
            guardian: {
                id: 'guardian_groven',
                name: 'Grove Guardian',
                description: 'Bark grows in thick patches across their skin, heaviest on arms, chest, and back \u2014 natural plate armor that creaks when they move. Antlers largest of all Groven, branching like ancient oaks, sometimes heavy enough to require bowing through doorways. Skin shows deep grain patterns like old growth wood, with rings visible on close inspection. Roots sometimes visible beneath their feet when they stand still for too long, anchoring them to the earth. Many have moss growing in the crevices of their bark \u2014 soft green contrast to the hardness underneath. They move slowly but with absolute purpose, each step settling like roots finding purchase in soil.',
                culturalBackground: `The Grove-Guardians trace their lineage to the first Groven who swore to protect ancient forests. Bloodline marked by deep bonds with specific groves. Their tradition requires that every member bond with a sacred grove during their sixteenth year, flesh slowly growing bark as the bond deepens. Grove-Guardian settlements are built within the heart of ancient forests, members serving as protectors, sentinels, living fortresses. They practice ancient guardian techniques passed down through generations. How to call roots from the earth. How to grow thorns as weapons. How to hear the forest warnings days before threats arrive. But this connection demands sacrifice. They cannot abide the cutting of living wood. Proximity to dead forests causes them physical pain. Many Grove-Guardians become hermits in their bonded groves, bodies slowly becoming indistinguishable from the trees they protect.`,
                statModifiers: {
                    constitution: 2,
                    strength: 1
                },
                traits: [
                    {
                        id: 'root_wall',
                        name: 'Root Wall',
                        description: 'Drive your feet into the ground and call upon your bonded grove. A wall of living roots erupts in a 20ft line, providing full cover for 1 minute. The wall has 30 HP and is resistant to piercing and slashing. If the wall is destroyed, you take 1d6 psychic damage from the severed connection. Creatures on the other side of the wall cannot see or target through it.',
                        level: 1,
                        icon: 'spell_nature_natureguard',
                        spellType: 'ACTION',
                        effectTypes: ['utility', 'defense'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'creation',
                            selectedEffects: [
                                { id: 'wall_creation', name: 'Root Wall', description: 'Create a 20ft root wall with 30 HP. Full cover. Resistant to piercing/slashing.' },
                                { id: 'psychic_backlash', name: 'Psychic Backlash', description: 'Take 1d6 psychic damage if wall is destroyed' }
                            ],
                            duration: 1,
                            durationUnit: 'minutes'
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeShape: 'line',
                            aoeParameters: { length: 20 }
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 2,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'antler_charge',
                        name: 'Antler Charge',
                        description: 'Lower your massive antlers and charge in a straight line up to 30ft. All creatures in your path must make a Strength save or take 2d8 piercing damage and be knocked prone. You ignore difficult terrain during the charge. If you hit a solid wall, you take 1d6 bludgeoning damage.',
                        level: 1,
                        icon: 'ability_druid_ferociousbite',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'control', 'movement'],
                        typeConfig: {
                            category: 'racial'
                        },
                        damageConfig: {
                            damageTypes: ['piercing'],
                            formula: '2d8',
                            resolution: 'save'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                { type: 'prone', mechanicsText: 'Targets knocked prone on failed save' }
                            ],
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            saveConfig: {
                                saveType: 'strength',
                                saveDC: 'spell',
                                successEffect: 'half_damage_no_prone'
                            }
                        },
                        targetingConfig: {
                            targetingType: 'line',
                            rangeType: 'self_centered',
                            aoeShape: 'line',
                            aoeParameters: { length: 30 }
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 2,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'bark_armor',
                        name: 'Bark Armor',
                        description: 'Bark grows thick across your flesh like the armored plates of the ancient oaks you protect, hardening your body against harm. But flame cracks this living armor — when fire touches you, the bark splits and peels, leaving you vulnerable until you can rest among the roots and streams of a natural place and let it grow anew.',
                        level: 1,
                        icon: 'ability_warrior_shieldmastery',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            category: 'racial'
                        },
                        buffConfig: {
                            buffType: 'permanent',
                            effects: [
                                { type: 'ac_bonus', value: 2, mechanicsText: '+2 AC from bark-like skin' },
                                { type: 'fire_disables', mechanicsText: 'Fire damage removes AC bonus until short rest in natural environment' }
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
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'grove_sense',
                        name: 'Grove Sense',
                        description: 'The grove speaks to you in a language older than words — a shiver in the roots when something threatens the wild, a sigh in the canopy when sickness creeps near. Every tree within reach is a sentinel, and every blade of grass a whisper of warning carried on the green breath of the land.',
                        level: 1,
                        icon: 'spell_nature_natureguard',
                        spellType: 'PASSIVE',
                        effectTypes: ['detection'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [
                                { id: 'threat_detection', name: 'Threat Detection', description: 'Sense threats to natural areas within 1 mile' },
                                { id: 'plant_health_sense', name: 'Plant Health Sense', description: 'Know the health of all plant life within 300ft' },
                                { id: 'tree_whispers', name: 'Tree Whispers', description: 'Trees warn of approaching creatures, fires, and disease hours in advance' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'fire_vulnerability_groven',
                        name: 'Fire Vulnerability',
                        description: 'Your bark-like flesh is kindling to open flame \u2014 the deeper your bond with the grove, the more devastating fire becomes.',
                        level: 1,
                        icon: 'spell_fire_flamestrike',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: {
                            category: 'racial',
                            isWeakness: true
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'fire_vulnerability',
                                name: 'Fire Vulnerability',
                                description: 'Your bark-like flesh is kindling to open flame \u2014 living wood burns with terrifying intensity',
                                statusEffect: {
                                    vulnerabilityType: 'fire',
                                    vulnerabilityPercent: 100
                                }
                            }],
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
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    }
                ],
                baseStats: {
                    health: 15,
                    mana: 2,
                    actionPoints: 3,
                    initiative: -1
                },
                savingThrowModifiers: {
                    advantage: ['paralyzed', 'grappled'],
                    disadvantage: ['fire_effects']
                }
            },
            wanderer: {
                id: 'wanderer_groven',
                name: 'Trail Walker',
                description: 'Lean and wiry from constant movement, their bark thinner and more flexible than other Groven. Antlers smaller, often broken and regrown from travel through tight passages. Feet heavily calloused, able to walk over sharp stone and frozen ground without slowing. Eyes constantly scanning the horizon, reading weather patterns and animal movements. Skin weathered by sun and wind, grain patterns smoothed by exposure. They carry the smell of distant places \u2014 pine resin, ocean salt, mountain stone. Many have small scars from thorns and rocks. They seem to fade slightly when standing still, restless energy barely contained.',
                culturalBackground: `The Trail-Walkers trace their lineage to Groven who rejected grove bonds for the freedom of endless wandering. Bloodline marked by the call of the horizon. Their tradition requires that every member learn the ancient migration routes. Apprenticeships spent following seasonal paths that their ancestors walked. Trail-Walker communities are nomadic, following herds and seasons across vast territories. Members serving as guides, scouts, messengers between distant groves. They practice ancient pathfinding techniques passed down through generations. How to read ley lines. How to find water in deserts. How to navigate by the stars and the earth energy. Their bodies adapt to long travel, feet becoming calloused and sure, senses sharpening to detect threats miles away. But the call to wander never stops. They become restless in settlements, dreaming of open skies and untamed lands.`,
                statModifiers: {
                    dexterity: 2,
                    wisdom: 1
                },
                traits: [
                    {
                        id: 'ley_line_step',
                        name: 'Ley Line Step',
                        description: 'The ley lines hum beneath your feet, threads of living energy that connect every rooted place in the world. You step along them like invisible roads, vanishing from one place and appearing in another — and when your feet meet forest floor or living soil, the land itself rushes up to mend your wounds.',
                        level: 1,
                        icon: 'ability_druid_dash',
                        spellType: 'ACTION',
                        effectTypes: ['movement', 'healing'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [
                                { id: 'teleport', name: 'Natural Step Teleport', description: 'Teleport to any visible natural location within 60ft' },
                                { id: 'rejuvenation', name: 'Natural Rejuvenation', description: 'Gain 5 temporary HP if arriving in a natural area' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        targetingConfig: {
                            targetingType: 'location',
                            rangeType: 'ranged',
                            rangeDistance: 60
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'migration_path',
                        name: 'Migration Path',
                        description: 'Mark a trail between your current location and a destination you name. For 24 hours, you and any allies you designate can travel between these two points at double speed, ignoring difficult terrain. The path is visible only to you and designated allies. Only one migration path can be active at a time.',
                        level: 1,
                        icon: 'spell_nature_astralrecalgroup',
                        spellType: 'ACTION',
                        effectTypes: ['movement', 'utility'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [
                                { id: 'fast_travel', name: 'Fast Travel', description: 'Travel at double speed between marked points for 24 hours' },
                                { id: 'ignore_difficult_terrain', name: 'Pathfinder Stride', description: 'Ignore difficult terrain along the marked path' }
                            ],
                            duration: 24,
                            durationUnit: 'hours'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'pathfinder',
                        name: 'Pathfinder',
                        description: 'The forest does not let its children wander astray. Roots shift to point the way home, streams murmur directions, and the moss on the stones whispers of the path ahead. The land itself is your guide — it shows you water where none seems to flow, turns your feet toward safety, and plants the certainty of north in your bones like a compass carved into your soul.',
                        level: 1,
                        icon: 'ability_hunter_trackingspeed',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'navigation',
                            selectedEffects: [
                                { id: 'no_lost', name: 'Unerring Direction', description: 'Cannot become lost in natural environments' },
                                { id: 'survival_advantage', name: 'Survival Instinct', description: 'Advantage on all Survival checks' },
                                { id: 'water_finding', name: 'Water Finding', description: 'Find drinkable water within 1 mile (except desert)' },
                                { id: 'direction_sense', name: 'Direction Sense', description: 'Always know which direction is north' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'weathered_skin',
                        name: 'Weathered Skin',
                        description: 'Advantage on saving throws against extreme weather (heat, cold, storms). You do not suffer movement penalties from natural difficult terrain (mud, snow, undergrowth). Your calloused feet feel no pain from rough ground.',
                        level: 1,
                        icon: 'spell_nature_regenerate',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'movement'],
                        typeConfig: {
                            category: 'racial'
                        },
                        buffConfig: {
                            buffType: 'passive_resistance',
                            effects: [
                                { type: 'weather_resistance', mechanicsText: 'Advantage on saves vs extreme weather' }
                            ],
                            durationValue: 0,
                            durationType: 'permanent',
                            durationUnit: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [
                                { id: 'ignore_natural_terrain', name: 'Forest Stride', description: 'No movement penalty from natural difficult terrain' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'fire_vulnerability_groven_wanderer',
                        name: 'Fire Vulnerability',
                        description: 'Even thin bark burns \u2014 fire finds purchase in your woody flesh where it would merely warm others.',
                        level: 1,
                        icon: 'spell_fire_flamestrike',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: {
                            category: 'racial',
                            isWeakness: true
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'fire_vulnerability',
                                name: 'Fire Vulnerability',
                                description: 'Even thin bark burns \u2014 fire consumes your woody flesh with devastating efficiency',
                                statusEffect: {
                                    vulnerabilityType: 'fire',
                                    vulnerabilityPercent: 100
                                }
                            }],
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
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    }
                ],
                baseStats: {
                    health: 12,
                    mana: 3,
                    actionPoints: 3,
                    initiative: 2
                },
                savingThrowModifiers: {
                    advantage: ['restrained'],
                    disadvantage: ['fire_effects']
                }
            },
            shaman: {
                id: 'shaman_groven',
                name: 'Spirit Speaker',
                description: 'Antlers decorated with bones, feathers, and small carved totems that rattle softly when they turn their head. Eyes shift between normal and animal-like, pupils dilating unnaturally when spirits speak through them. Necklaces of animal teeth and bones clatter when they move. Skin marked with ritual scars from spirit-binding ceremonies \u2014 pale lines that form patterns of claws, wings, and eyes. Many have animalistic mannerisms: a twitch of the ear, a tilt of the head, a growl that slips out unbidden. Their voices sometimes carry animal sounds, growls or bird calls bleeding through human speech like watercolors running together.',
                culturalBackground: `The Spirit-Speakers trace their lineage to the first Groven shamans who learned to commune with the spirits of beasts and ancestors. Bloodline marked by deep spiritual connections. Their tradition requires that every member undergo vision quests during their eighteenth year, learning to hear the voices of every animal that ever died. Spirit-Speaker communities are built around sacred circles where the boundary between worlds grows thin. Members serving as shamans, mediators, spirit-callers. They practice ancient rituals passed down through generations. How to summon spirit beasts. How to divine from animal bones. How to channel primal energies through their antlers. But this communion comes at a cost. They share the beasts primal instincts, sometimes losing themselves to animal rage or cunning. Many Spirit-Speakers live in isolation, minds filled with too many voices.`,
                statModifiers: {
                    wisdom: 2,
                    intelligence: 1
                },
                traits: [
                    {
                        id: 'spirit_call',
                        name: 'Spirit Call',
                        description: 'Summon the spirit of a predator beast (wolf, bear, or eagle) that appears within 30ft. The spirit lasts for 1 minute and can: make a melee attack (1d8 piercing for wolf, 1d10 bludgeoning for bear) or a ranged attack (1d6 piercing for eagle, range 60ft). The spirit has 15 HP and uses your spell save DC for attacks. Only one spirit can be active at a time.',
                        level: 1,
                        icon: 'spell_nature_spiritarmor',
                        spellType: 'ACTION',
                        effectTypes: ['summon', 'damage'],
                        typeConfig: {
                            category: 'racial'
                        },
                        damageConfig: {
                            damageTypes: ['piercing'],
                            formula: '1d8',
                            resolution: 'attack'
                        },
                        utilityConfig: {
                            utilityType: 'summon',
                            selectedEffects: [
                                { id: 'spirit_summon', name: 'Spirit Summon', description: 'Summon a wolf (1d8 piercing melee), bear (1d10 bludgeoning melee), or eagle (1d6 piercing ranged) spirit for 1 minute' },
                                { id: 'spirit_hp', name: 'Spirit Vitality', description: 'Spirit has 15 HP' }
                            ],
                            duration: 1,
                            durationUnit: 'minutes'
                        },
                        targetingConfig: {
                            targetingType: 'location',
                            rangeType: 'ranged',
                            rangeDistance: 30
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'bone_divination',
                        name: 'Bone Divination',
                        description: 'Cast a handful of animal bones and read the patterns. Learn one of the following: the general direction and distance of the nearest danger, the outcome of a planned action (favorable/unfavorable/neutral), or the answer to a yes/no question about the immediate area. The spirits do not always answer clearly \u2014 there is a 20% chance the reading is cryptic instead.',
                        level: 1,
                        icon: 'spell_nature_elementalshields',
                        spellType: 'ACTION',
                        effectTypes: ['divination'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [
                                { id: 'danger_detection', name: 'Danger Detection', description: 'Learn direction and distance to nearest danger' },
                                { id: 'outcome_reading', name: 'Outcome Reading', description: 'Learn if a planned action is favorable, unfavorable, or neutral' },
                                { id: 'yes_no_answer', name: 'Yes/No Answer', description: 'Answer to one yes/no question about the immediate area' },
                                { id: 'cryptic_risk', name: 'Cryptic Risk', description: '20% chance the reading is cryptic rather than clear' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'spirit_sight',
                        name: 'Spirit Sight',
                        description: 'You can see spirits, ghosts, and invisible creatures within 60ft. You have advantage on checks to detect illusions. Animals are naturally calm around you and will not attack unless provoked.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        effectTypes: ['detection', 'buff'],
                        typeConfig: {
                            category: 'racial'
                        },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [
                                { type: 'spirit_detection', value: 60, mechanicsText: 'See spirits, ghosts, and invisible creatures within 60ft' },
                                { type: 'illusion_detection', mechanicsText: 'Advantage on checks to detect illusions' },
                                { type: 'animal_calm', mechanicsText: 'Animals are naturally calm around you and will not attack unless provoked' }
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
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'ancestor_whispers',
                        name: 'Ancestor Whispers',
                        description: 'You can hear the voices of your ancestors at will. Advantage on History and Religion checks. When you enter a new location, you sometimes receive warnings from ancestor spirits about dangers that killed previous Groven in that area. This is not reliable \u2014 the spirits speak when they choose.',
                        level: 1,
                        icon: 'spell_nature_spiritarmor',
                        spellType: 'PASSIVE',
                        effectTypes: ['detection', 'utility'],
                        typeConfig: {
                            category: 'racial'
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [
                                { id: 'ancestor_communion', name: 'Ancestor Communion', description: 'Hear the voices of ancestors at will' },
                                { id: 'knowledge_advantage', name: 'Ancestral Knowledge', description: 'Advantage on History and Religion checks' },
                                { id: 'danger_warnings', name: 'Spirit Warnings', description: 'Spirits sometimes warn of dangers that killed previous Groven in new locations' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    },
                    {
                        id: 'fire_vulnerability_groven_shaman',
                        name: 'Fire Vulnerability',
                        description: 'The spirits that bind to you fear flame above all else \u2014 it severs their connection to the material world.',
                        level: 1,
                        icon: 'spell_fire_flamestrike',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: {
                            category: 'racial',
                            isWeakness: true
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'fire_vulnerability',
                                name: 'Fire Vulnerability',
                                description: 'Flame severs the spirit bonds that hold you together \u2014 fire consumes flesh and spirit alike',
                                statusEffect: {
                                    vulnerabilityType: 'fire',
                                    vulnerabilityPercent: 100
                                }
                            }],
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
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        }
                    }
                ],
                baseStats: {
                    health: 11,
                    mana: 5,
                    actionPoints: 3,
                    initiative: 0
                },
                savingThrowModifiers: {
                    advantage: ['fear', 'charmed'],
                    disadvantage: ['fire_effects']
                }
            }
        },
        epicHistory: `
The Cursing of Forgotten Forms came before our bloodlines can remember, before any written record of what we were before transformation took us. Our ancestors had faces and names and identities that belonged only to them. Then something stripped those things away - a curse that took their ability to remember their own faces and replaced it with the ability to copy any form they saw.

The first generations suffered horribly. They woke unable to remember their own faces, unable to hold one identity long enough to know who they were, their features shifting constantly as they tried to remember what they looked like. Communities fell apart as people became whoever the curse decided, unable to recognize family members or maintain relationships.

The Face-Thief emerged from those first generations - those who chose to embrace the curse, to perfect the art of impersonation until it was skill rather than affliction. They learned to copy faces completely, to wear identities like purposeful art, to use what the curse gave them rather than fighting against it.

The Shattered emerged differently - those who fought the curse, who struggled to hold onto pieces of themselves between transformations. They developed techniques to maintain identity, to resist the constant pull of shapeshifting, to remember what they were before the curse took their ability to remember completely.

During the Wars of Faces, the Mimir were used as weapons by armies who didn't understand the curse. Face-Thief infiltrated enemy courts, wearing faces of generals and advisors, learning plans and betraying them from inside. Shattered were forced to wear faces of soldiers, their fragile identities shattering under the weight of constant transformation.

The wars changed the bloodlines. Face-Thief who infiltrated too deeply became whoever they were impersonating, their original identities eroded completely by faces worn too long. Shattered who were forced to transform constantly shattered under the weight, becoming whoever the curse decided with no resistance.

The Mirror Pact ended the wars when the surviving Mimir leaders met and agreed on new laws. No wearing faces of other Mimir. No impersonating for war except when absolutely necessary. No forcing transformations on those who resist. The pact created boundaries between Face-Thief and Shattered, established rules for how the curse would be used.

The Face-Thief and Shattered divided during that council. The Face-Thief chose to embrace the curse and perfect impersonation as art. The Shattered chose to resist the curse and hold onto pieces of themselves. Both approaches were accepted, but the division was permanent - the bloodlines could no longer cross between the two ways of living.

Now the darkness spreads across the eastern lands, threatening realms that don't understand the curse. The Face-Thief watch the darkness with predatory interest, their skills as impersonators ready to infiltrate whatever comes. The Shattered fear the darkness, their fragile identities threatening to shatter under the weight of constant transformation war will force.

The curse remembers the Wars of Faces when Mimir were used as weapons, when Face-Thief became whoever they impersonated too deeply, when Shattered shattered under constant transformation. Some Face-Thief feel the pull of that time already, the curse eager to be used for infiltration and betrayal again. Some Shattered feel the threat, their techniques holding identities together under strain.

The Mirror Pact has held for generations. The rules against impersonating other Mimir have been followed, the restrictions against forcing transformations honored. But the darkness threatens to break everything. If the war comes to Mimir territories, if communities are forced to use the curse for survival, the pact may shatter like everything else.

The Face-Thief will use the curse against the darkness - they'll wear faces of its followers, learn its plans from being them, gather information from identities too numerous to count. The Shattered will try to hold themselves together while doing the same, their fragile identities threatening to shatter under the constant transformation.

When the darkness arrives, Mimir communities will have to choose - use the curse and risk losing themselves completely, or resist and risk being destroyed by enemies they can't fight without shapeshifting. The curse is patient. It will wait until the choice is forced. Then it will take what it's owed.
        `,
        notableFigures: [
            {
                name: 'Master Kaelen Face-Thief',
                title: 'The Most Perfect Impersonator',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The most skilled Face-Thief in living memory, Kaelen has worn more faces than anyone can count. His original identity is entirely gone, erased by transformations too numerous to count. The curse that lives in his blood has made him the perfect impersonator - he can copy anyone completely, wearing faces like purposeful art, becoming whoever he's pretending to be down to fragments of memory.

During the Wars of Faces, Kaelen infiltrated three enemy courts simultaneously, wearing the faces of different generals and advisors in each. He learned war plans from being them, betrayed armies from inside by being their commanders, ended campaigns by becoming the leaders who ordered surrenders. The curse took pieces of his original identity with each face, but he accepted the losses as payment for his skill.

Kaelen has forgotten everything about the person he was before he learned to copy others. His original face is gone, his original voice forgotten, his habits that belonged to that person erased completely. What remains is a vessel shaped by the curse, someone who can be anyone except himself.

The Shattered pity him. They say he's more faces he's worn than any person he might have been, that he's given up on ever knowing who he is, that he's embraced a curse that was meant to destroy him. They're right that Kaelen has no original identity left. But they're wrong that this is loss - Face-Thief have found strength in what was meant to be destruction.

Kaelen teaches other Face-Thief the arts of impersonation. He demonstrates how to copy mannerisms, how to adopt voice, how to steal fragments of memory along with faces. His students become skilled impersonators, but none match his mastery - Kaelen can be anyone completely, wearing faces so perfectly that even those closest to the originals can't tell the difference.

When the darkness spreads across the eastern lands, Kaelen will be the one infiltrating it. He'll wear faces of its followers, learn its plans from being them, gather information from identities too numerous to count. The Face-Thief serve as perfect spies, and Kaelen is the most perfect of all.
                `
            },
            {
                name: 'Elder Elara Shattered',
                title: 'The One Who Holds Onto Herself',
                portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
                backstory: `
The oldest living Shattered elder, Elara has held onto her identity through more transformations than any Mimir has survived. Her face still shows hints of her original features, though blurred by transformations she's worn since. Her techniques for maintaining identity are taught to every Shattered community, passed down through generations of those who fight the curse.

Elara remembers her original face still, though the memory is faded and blurred. She remembers her parents' faces, the home she was born in, the life she lived before she learned to copy others. The curse has taken most of what she was, but Elara holds onto what remains with desperate focus, her identity fragile but still existing.

During the Wars of Faces, Elara led the Shattered who refused to be used as weapons. She developed techniques to resist the curse, to hold one identity despite constant pressure to transform, to remember what the Shattered were before the curse tried to make them someone else. Her techniques saved countless Shattered from shattering completely.

The Face-Thief call her stubborn, saying she's fighting a curse she can't win, that she's suffering for identities the curse already took, that she'd be better off embracing what she was given. They're wrong that her struggle is pointless - every piece of herself Elara holds onto is victory against a curse that wants to take everything.

Elara teaches Shattered children how to hold onto themselves. She demonstrates how to focus on one face constantly, how to resist the pull of transformation, how to record memories in ways the curse can't take. Her students become Shattered who can resist the curse for years, maintaining identities through transformations that would shatter others.

When the darkness spreads across the eastern lands, Elara will lead the Shattered who try to hold themselves together. The curse will pull at them with every face they see, every transformation the war forces, every identity they must wear to survive. Elara's techniques will hold the Shattered together, their identities fragile but resisting.
                `
            }
        ],
        majorLocations: [
            {
                name: 'The House of Thousand Faces',
                description: `
The oldest Face-Thief community, House of Thousand Faces is built beneath a great city where reflections multiply endlessly. Mirrors line every wall, creating endless copies for practice. Glass covers every surface, allowing Face-Thief to study transformations from every angle. The community is hidden in plain sight, existing below the city without anyone above knowing.

The archives here hold records of thousands of identities - faces Face-Thief have worn, techniques for copying specific expressions, patterns of transformation that new Face-Thief can learn. Master Kaelen keeps the oldest records, his mind holding more identities than anyone can count.

The House of Thousand Faces has never been discovered by those above. Face-Thief infiltrate the city above constantly, wearing faces that allow them to move freely, gathering information that sustains their community. The curse that makes them perfect impersonators protects their home - no one suspects that the beggars and merchants and nobles walking the city are all the same Face-Thief wearing different faces.

Today, the House operates at increased activity as Face-Thief prepare for the spreading darkness. They wear faces of nobles and soldiers, infiltrating armies and courts, gathering information about what's coming. Master Kaelen leads these efforts, his skill unmatched by any living Face-Thief.
                `
            },
            {
                name: 'The Sanctuary of Broken Mirrors',
                description: `
The oldest Shattered community, Sanctuary of Broken Mirrors is built without any reflective surfaces. The walls are designed to resist reflection, the floors covered with materials that don't mirror, the lighting arranged so that no mirror image can form. The Shattered who live here hold onto their identities with desperate focus.

The archives here hold records of techniques for maintaining identity - methods developed by generations of Shattered, ways to record memories without faces, techniques for resisting the curse's constant pull. Elder Elara keeps the oldest techniques, her teachings passed down to every Shattered community.

The Sanctuary of Broken Mirrors has protected Shattered identities for generations. The lack of reflective surfaces helps maintain one face, allowing Shattered to focus on who they are rather than who they could become. The curse still pulls at them, but the techniques Elara developed hold identities together through transformations that would shatter others.

Today, the Sanctuary prepares Shattered for the transformations the coming darkness will force. They practice techniques for maintaining identity, record memories of who they are before the curse can take those, prepare for faces they'll have to wear to survive. Elder Elara leads these preparations, her techniques having held Shattered identities together through more transformations than any should survive.
                `
            }
        ],
        currentCrisis: `
The darkness spreading across the eastern lands has drawn the attention of the curse in Mimir blood. Face-Thief feel the pull toward impersonation, their skills ready to infiltrate whatever comes. Shattered feel the threat to their fragile identities, the curse eager to use transformations that will shatter what little self they've managed to hold onto.

Mimir communities debate how to engage the darkness. Face-Thief argue that their skills are needed - infiltration will provide information that others can't gather, identities worn as weapons against an enemy that doesn't know the curse. Shattered warn that constant transformation will shatter their identities completely, that the curse will take whatever pieces of themselves remain.

The Mirror Pact that has held for generations threatens to shatter. The rules against using the curse for war are being tested by the approaching darkness. Some Face-Thief already wear faces of enemy soldiers, impersonating followers of the darkness. Shattered are forced to transform to survive, their fragile identities shattering under the constant pressure.

Master Kaelen leads Face-Thief who infiltrate the darkness, wearing faces of its followers and learning its plans. Elder Elara leads Shattered who try to hold onto themselves, teaching techniques that maintain identity through constant transformation.

When the darkness arrives, Mimir communities will have to choose - use the curse and risk losing themselves, or resist and risk being destroyed. The curse is patient. It will wait until the choice is forced. The Face-Thief will embrace the transformation. The Shattered will resist with everything they have.

The Face-Thief have forgotten more of themselves than the Shattered. Their original identities are gone, erased by transformations too numerous to count. The Shattered hold onto pieces of themselves with desperate focus. Both will face the darkness with different approaches - one embracing the curse, one resisting it.
        `,
        culturalPractices: `
Every Mimir child undergoes the First Focus before their sixth year, learning to maintain one face long enough to know who they are. Face-Thief children practice focusing on one expression, keeping their features from shifting. Shattered children learn to record memories of who they are, creating identity that the curse can't take easily.

The first intentional transformation is always significant. Face-Thief children choose a face to copy and shift until what they see in the mirror matches completely. Shattered children resist transformation unless absolutely necessary, their identities fragile enough that any change threatens to shatter what little self they hold.

Face-Thief apprentices learn the arts of impersonation. They practice copying mannerisms, adopt voices, steal fragments of memory along with faces. Master Kaelen teaches the most advanced techniques - how to be anyone completely, how to wear faces like purposeful art, how to gather information from identities too numerous to count.

Shattered apprentices learn the techniques for maintaining identity. They practice focusing on one face constantly, resist the pull of transformation, record memories in ways the curse can't take. Elder Elara teaches the most effective methods - how to hold onto pieces of themselves, how to resist the curse's constant pull.

The Mirror Pact is the law all Mimir follow. No wearing faces of other Mimir. No impersonating for war except when absolutely necessary. No forcing transformations on those who resist. The pact creates boundaries between Face-Thief and Shattered, establishing rules for how the curse will be used.

Those who lose their identities completely become Face-Thief who have forgotten everything they were before the curse. They embrace what remains, perfecting impersonation until it's art, understanding everyone by becoming them. Those who maintain some identity become Shattered, holding onto pieces of themselves with desperate focus and techniques passed down through generations.

Every transformation costs something. The Face-Thief accept these costs as payment for survival. The Shattered resist the costs with techniques developed over generations. When the darkness spreads, Face-Thief will use the curse against it - wearing faces, gathering information, infiltrating. The Shattered will try to hold onto themselves while doing the same.

The curse is patient. It exists in our blood. It will wait until the choice is forced. Then it will take what it's owed.
        `,
    },

    emberth: {
        id: 'emberth',
        name: 'Emberth',
        essence: 'Slag-skinned forgers',
        description: 'We carry the mountain’s heartbeat in our marrow—a slow, molten fire that refuses to be extinguished. Our skin is the color of cooling slag, rough and heat-scarred, smelling of sulfur and the Great Forges where our ancestors first woke. We do not breathe the thin air of the surface; we inhale the soot and the steam of the deep vents. Every movement we make is a strike of the hammer, heavy and deliberate, for we are made of the very metal we shape. Our eyes glow with the ember-light of a banked fire, seeing the potential in every raw ore and the weakness in every steel blade. We are the architects of the inner heat, the survivors of the volcanic deep who brought the secret of the flame to the world. We are not merely forgers; we are the forge itself, and our blood is the liquid iron that brands the soul of the Earth.',
        icon: 'fas fa-fire',
        overview: 'The Emberth are people whose ancestors settled in volcanic wastelands. Their bloodlines marked by fire through generations of living among lava flows and forges. They are organized into forge-clans bound to volcanic calderas. Settlements built around ancient forges that have burned for centuries. The Emberth do not choose to burn. It is their heritage, passed down through bloodlines that carry the earth inner fire.',
        culturalBackground: `Emberth society is built on forge-clans bound to volcanic calderas. Communities organized around ancient forges that have burned for generations. Each clan traces its founding to legendary smiths who first learned to work with volcanic fire. Traditions passed down through apprenticeships that begin in childhood. Emberth settlements are built around forges that burn day and night. Flames fed by the volcanic vents that power their craft. Children are tempered in lava baths from birth. The weak burning away while the strong emerge with skin like cooled slag and eyes that glow with inner fire. Clan elders pass down the old ways. How to work metal with bare hands. How to channel the Fire Within. How to craft weapons that remember their forging. Their society is a meritocracy of flame. Those who burn brightest rise highest. The dim become fuel for the forges. Clan disputes settle through forge-trials and the testimony of weapons crafted. But the cold is their great enemy. Sapping their inner flames and leaving them brittle and weak. They are a people bound by fire and forge. Their mastery of flame unmatched but their bodies forever marked by the heat that powers them.`,
        variantDiversity: 'The Emberth are divided into three major forge-clan bloodlines: The Forge-Hearth dedicate themselves to master smithing and craft, the Ash-Runners serve as scouts and messengers across volcanic wastes, and the War-Forged are warriors tempered by battle and fire.',
        integrationNotes: {
            actionPointSystem: 'Emberth abilities focus on fire damage, crafting, and aggressive combat. Their inner flames provide offensive options but create environmental hazards.',
            backgroundSynergy: 'Emberth excel in backgrounds emphasizing strength, crafting, and combat prowess. Their fire nature complements aggressive and creative paths.',
            classCompatibility: 'Emberth make excellent warriors, smiths, and fire-based casters. Their fire immunity and physical bonuses enhance classes that engage in direct combat.'
        },
        meaningfulTradeoffs: 'Emberth gain fire immunity and powerful offensive abilities but suffer from frost vulnerability and their inner heat can damage equipment and allies. They struggle in frost environments.',
        baseTraits: {
            languages: ['Common', 'Ignan'],
            lifespan: '100-140 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '160-240 lbs',
            build: 'Muscular and fiery'
        },
        epicHistory: `
The First Forging came when the first Emberth discovered that volcanic fire could be shaped, that lava flowing like blood through wounded earth could be worked like metal. The first smith stood at volcanic vent and let Fire Within guide his hands, shaping the first metal ever worked with volcanic fire. That weapon still exists, carrying traces of ancient fire.

During Wars of Molten Earth, kingdoms and armies fought for control of volcanic wastelands and forges that burned eternally. Emberth clans fought on all sides, their weapons forged with volcanic fire turning battles, their fire-born bodies enduring what would destroy others. The lava flowed like blood through battlefields, enemies burning to ash from Fire Within.

The Forge-Hearth shaped weapons for all sides, their craft valued regardless of which clan they served. The Ash-Runners carried messages across battlefields, moving too fast for enemies to catch. The War-Forged fought on front lines, their bodies tempered by combat and fire, their enemies burning to ash before they could understand what struck them.

The wars ended when Emberth clans refused to fight each other, withdrawing from conflicts between other peoples. We returned to our volcanic calderas and forges, letting external kingdoms fight over other lands. The Forge Accords established that Emberth clans would not war with each other, that volcanic fire would not be used against fellow fire-born.

The accords have held for generations. The Forge-Hearth have crafted weapons for all clans when needed, never withholding craft based on clan affiliation. The Ash-Runners have carried messages for all clans, moving across volcanic wastelands regardless of old conflicts. The War-Forged have defended all forge-clans from external threats, never distinguishing between Emberth who need protection.

Now darkness spreads across eastern lands, threatening realms that have never seen volcanic fire. Emberth clans prepare for war, our forges burning eternally, our fire within manifesting in ways that haven't been needed since Wars of Molten Earth. The darkness will come, and Emberth will answer with volcanic fire.

The lava flowed like blood during those ancient wars, and it will flow again. The forges that burned eternally then will burn eternally now. The weapons forged with volcanic fire then will be forged again. The Fire Within that guided our ancestors will guide us.
        `,
        notableFigures: [
            {
                name: 'Master Thorne Forge-Hearth',
                title: 'The Volcanic Smith',
                portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
                backstory: `
The most skilled living Forge-Hearth, Thorne has shaped weapons with volcanic fire for sixty years. His skin is like cooled slag from decades at forges, dark and rough where fire has kissed him. His eyes glow with inner fire that has shaped legendary weapons, pupils like banked coals that have seen metal become what fire wants it to be.

During Wars of Molten Earth, Thorne shaped weapons for all three Emberth clans, his craft valued regardless of which clan he served. He forged legendary blades that carried traces of volcanic heat for years, shaped armor that endured blows that should have destroyed anyone else. His fire within guided metal into forms no other smith could achieve.

Thorne's weapons are legendary across all clans. Blades he forged still carry warmth after decades, armor he shaped still bears traces of volcanic fire. Many say his weapons are alive, that fire within them remembers being shaped by his hands.

The Ash-Runners respect him as one who understands volcanic wastelands most completely, for he's shaped weapons used in those wastelands for sixty years. The War-Forged respect him as one whose weapons have served in countless battles, whose fire-born craft has saved countless lives.

When darkness spreads across eastern lands, Thorne will shape weapons to fight it. His forge will burn eternally, his fire will guide metal into forms that can defeat whatever comes, his weapons will carry traces of Fire Within that will burn against darkness.
                `
            },
            {
                name: 'Scout Kaelen Ash-Runner',
                title: 'The Speed of Fire',
                portraitIcon: 'Armor/Head/head-orange-cross-faceplate-helmet',
                backstory: `
The most traveled living Ash-Runner, Kaelen has crossed every volcanic wasteland in Emberth territories. His skin is dark from moving through heat that would burn others, calloused from miles of running across lava flows and volcanic rock. His eyes glow with inner fire that drives him forward, pupils like banked coals that never go out even when he runs for days.

During Wars of Molten Earth, Kaelen carried messages between Emberth clans, moving across battlefields too fast for enemies to catch. He crossed lava flows that would have stopped anyone else, climbed volcanic peaks no one else could scale, carried intelligence that saved countless lives.

Kaelen has found paths through volcanic wastelands that no other Emberth can see, routes through heat and danger that fire within shows him. He moves across lava as if it's solid ground, navigates ash clouds that would choke anyone else, reaches volcanic peaks that seem inaccessible.

The Forge-Hearth respect him as one who understands volcanic wastelands in ways no smith can, for he's traveled every wasteland and knows where fire flows strongest. The War-Forged respect him as one whose speed has saved countless clans, whose fire-born endurance has carried messages through battles.

When darkness spreads across eastern lands, Kaelen will cross wastelands faster than any threat can follow. His speed will carry warnings, his fire will guide him through heat and danger, his endurance will allow him to reach every forge-clan before darkness can strike.
                `
            }
        ],
        majorLocations: [
            {
                name: 'The Great Forge of Molten Fire',
                description: `
The oldest sacred forge, Great Forge of Molten Fire has burned eternally for three hundred years. Its volcanic vent has flowed with ancient fire since before first Emberth learned to shape metal. Every Forge-Hearth dreams of shaping metal at this forge, for the fire here is strongest, the metal here most responsive to Fire Within.

Master Thorne holds court at this forge, shaping weapons with volcanic fire that have served all clans. The forge's fire guides metal into forms no other smith can achieve, weapons shaped here carrying traces of ancient fire that have burned eternally for three hundred years.

The Great Forge has never been breached by any army, its volcanic fire too strong, its position too defensible. During Wars of Molten Earth, this forge shaped weapons for all sides, its fire manifesting so strongly that no one could deny its craft.

Today, the Great Forge operates at full capacity as Emberth clans prepare for darkness. Thorne shapes weapons here constantly, volcanic fire burning eternally, weapons carrying traces of Fire Within that will fight whatever comes.
                `
            },
            {
                name: 'The Wasteland of Eternal Flow',
                description: `
The most dangerous volcanic wasteland, Wasteland of Eternal Flow is lava that never cools, rivers of molten rock flowing eternally. Ash-Runners learn to cross this wasteland, the lava here moving with patterns that fire within shows them. Many have died here, but those who survive carry fire within burned strongest by eternal flow.

Scout Kaelen crossed this wasteland first, finding paths through lava that no one else could see. He navigated the eternal flow with fire within guiding him, moving across lava as if it's solid ground, finding routes that carry him safely through eternal heat.

The wasteland is both danger and training ground, place where Ash-Runners prove their speed and endurance, where fire within is tested and strengthened. The lava flows eternally, and those who cross it carry fire within burned by ancient, unending heat.

Today, Wasteland of Eternal Flow serves as proving ground for Ash-Runners preparing for darkness. They cross the eternal flow, their fire within strengthening with every passage, their speed and endurance growing as they navigate lava that would destroy others.
                `
            }
        ],
        currentCrisis: `
The darkness spreading across eastern lands has drawn attention of Fire Within. The forges burn eternally across Emberth territories, volcanic vents flowing with renewed strength. Emberth clans prepare for war, their fire within manifesting in ways that haven't been needed since Wars of Molten Earth.

The Forge-Hearth shape weapons constantly, their forges burning eternally, volcanic fire guiding metal into forms that can defeat whatever comes. Master Thorne leads at the Great Forge, shaping legendary weapons that carry traces of Fire Within. The darkness will come, and volcanic fire will meet it.

The Ash-Runners cross wastelands faster than ever, their speed carrying warnings between clans, their fire within guiding them through heat and danger. Scout Kaelen leads Ash-Runners in navigating volcanic wastelands, finding paths through lava that no one else can see.

The War-Forged prepare themselves for battle, their bodies tempered by combat and fire, their weapons glowing with inner fire that will burn against darkness. Every War-Forged has been trained by both Forge-Hearth and Ash-Runners, carrying Fire Within and fire-born speed into combat.

The Forge Accords that have held for generations are being tested. Emberth clans prepare to fight as one, their forges burning eternally, their Fire Within uniting against darkness. The wars of the past taught us to value fire above all, and Fire will answer when darkness comes.

The lava will flow like blood across battlefields when darkness comes. The forges that burned eternally then will burn eternally now. The weapons forged with volcanic fire then will be forged again. The Fire Within that guided our ancestors will guide us through this war as it guided them through Wars of Molten Earth.

The cold is our great enemy, and darkness brings cold that would extinguish our inner flames. Emberth clans will fight to protect our forges and our fire, our bodies enduring cold that would destroy others, our Fire Within burning hottest when needed most.

When darkness arrives, Emberth clans will answer with volcanic fire. Our forges will burn eternally, our weapons will strike with traces of Fire Within, our fire-born bodies will endure what would destroy others. The darkness will come, and Emberth will burn it to ash.
        `,
        culturalPractices: `
Every Emberth child is tempered in lava bath from birth. The weak burn away while strong emerge with skin like cooled slag and eyes that glow with inner fire. The ones who don't survive aren't remembered, for weakness isn't honored in forge-clans that value strength above all.

Forge-Hearth apprentices begin at forge before they can walk properly, learning to shape metal with bare hands guided by Fire Within. Every apprentice shapes their first weapon under master's guidance, volcanic fire showing them how metal wants to be formed, Fire Within helping it become that form.

Ash-Runner apprentices begin by running across cooled lava, learning to find purchase on heat that would burn others. They progress to flowing lava and eventually to eternally burning forges, their Fire Within manifesting as speed and endurance with each trial.

War-Forged apprentices begin with training weapons, learning to channel Fire Within into combat. They progress to sparring with other War-Forged and eventually to actual combat, their bodies tempered by battle and Fire Within, their Fire Within manifesting as strength and ferocity.

The forges are sacred places where Fire Within manifests most strongly. Every clan has its own sacred forge, place where apprentices learn, where weapons are forged, where fire-born weapons carry traces of volcanic heat that have burned eternally.

Clan disputes don't settle with violence but with forge trials. Forge-Hearth compete by shaping most impressive weapons. Ash-Runners compete by crossing most dangerous wastelands fastest. War-Forged compete by enduring most punishment in combat. Fire Within judges these trials, showing which clan member honors fire most completely.

The Forge Accords are the laws all Emberth follow. No clan fights another clan. All forges serve all clans when needed. Weapons are shared regardless of clan. The accords established after Wars of Molten Earth when clans realized internal conflict weakens against external threats.

Every Emberth carries Fire Within their blood, manifesting differently based on clan and individual. The Forge-Hearth carry craft-fire, Ash-Runners carry speed-fire, War-Forged carry battle-fire. All are fire-born, all honor fire in different ways.

The forges are our homes, our temples, our places of power. We spend our lives at forges or crossing wastelands or preparing for battle, but we return to forges when possible. The Fire Within speaks most clearly at sacred forges, and we honor that fire with everything we do.

When darkness comes, Emberth clans will unite. The Forge Accords will hold us together as one, our forges burning eternally, our Fire Within uniting against external threat. The wars of the past taught us to value fire above all, and Fire will unite us against darkness.
        `,
        subraces: {
            forgeborn: {
                id: 'forgeborn_emberth',
                name: 'Forge-Hearth',
                description: 'Skin hottest of all Ashkar, sometimes glowing faintly red. Hands permanently marked by burns and calluses from working hot metal. Eyes glow brightest, like embers in darkness. Many have lost fingers or have fused joints from accidents. Their touch can ignite paper. Clothing often singed at the edges. They sweat constantly, but it evaporates immediately.',
                culturalBackground: `The Forge-Hearth trace their lineage to the first Ashkar smiths who mastered working with volcanic fire. Bloodline marked by deep bonds with the forge. Their tradition requires that every member apprentice for years in the hottest forges. Learning to shape metal with bare hands heated to impossible temperatures. Forge-Hearth clans are built around master forges that burn day and night. Members serving as craftsmen, smiths, creators of legendary weapons. They practice ancient smithing techniques passed down through generations. How to channel the Fire Within. How to work metal without tools. How to craft weapons that remember their forging. Their skin burns hot to the touch. Eyes glowing like banked coals. Presence capable of warming rooms or igniting dry tinder. But the fire demands constant fuel. They must create or destroy. Or the flames consume them from within. Many Forge-Hearth become hermit smiths in volcanic caverns. Bodies slowly becoming one with the lava flows. The bloodline values mastery and creation. Honor measured in items crafted and techniques perfected. They are the master smiths of Ashkar society. Their craft unmatched but their bodies forever marked by the fire that powers them.`,
                statModifiers: {
                    strength: 4,
                    constitution: 2,
                    intelligence: 1
                },
                traits: [
                    {
                        id: 'forge_heart_emberth',
                        name: 'Forge Heart',
                        description: 'The Fire Within flows through your hands, shaping metal with volcanic heat alone — weapons forged in your grip carry traces of the eternal flame, and armor you temper holds the strength of cooling slag.',
                        level: 1,
                        icon: 'inv_hammer_20',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'crafting',
                            secondaryElement: 'fire',
                            icon: 'inv_hammer_20',
                            tags: ['crafting', 'fire', 'smithing']
                        },
                        utilityConfig: {
                            utilityType: 'crafting',
                            selectedEffects: [{
                                id: 'smithing',
                                name: 'Smithing',
                                description: 'Work metal with your bare hands. Items crafted gain +1 damage or armor.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'moderate'
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'touch',
                            targetRestrictions: ['object']
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'fire_immunity_emberth',
                        name: 'Fire Immunity',
                        description: 'Your bloodline carries the earth\'s inner fire, passed down from ancestors who bathed in lava and worked forges that burn eternally, rendering you immune to flames that would consume lesser folk.',
                        level: 1,
                        icon: 'spell_fire_firearmor',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'fire',
                            secondaryElement: 'resistance',
                            icon: 'spell_fire_firearmor',
                            tags: ['immunity', 'fire', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'fire_immunity',
                                    name: 'Fire Immunity',
                                    description: 'Complete immunity to fire damage and lava'
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
                        id: 'frost_vulnerability_forgeborn',
                        name: 'Frost Vulnerability',
                        description: 'The eternal flame within your bloodline burns hot, but unnatural frost can quench it, leaving your forge-tempered body brittle and vulnerable to frost that would merely chill lesser folk.',
                        level: 1,
                        icon: 'spell_frost_frostbolt02',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'frost',
                            icon: 'spell_frost_frostbolt02',
                            tags: ['vulnerability', 'frost', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'damage_vulnerability',
                                    name: 'Frost Vulnerability',
                                    description: 'The eternal flame within your bloodline sputters and dims when frost bites deep, the cold threatening to extinguish generations of forge-fire',
                                    statusEffect: {
                                        vulnerabilityType: 'frost',
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
                    }
                ],
                languages: ['Common', 'Ignan', 'Terran'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 32, // Master smiths, tempered by fire - extra durability
                    mana: 20,
                    ap: 3, // Craftsmen, standard AP
                    passivePerception: 1, // Master smiths, good perception for craft
                    swimSpeed: 0, // Hot skin, poor swimmers (water cools them)
                    climbSpeed: 0, // Not climbers
                    visionRange: 60,
                    darkvision: 60, // Eyes glow like embers, can see in darkness
                    initiative: 0 // Not quick to react, focused on craft
                },
                savingThrowModifiers: {
                    // Inner fire makes them vulnerable to cold but strong against exhaustion
                    disadvantage: ['poison'], // Cold extinguishes their inner fire
                    advantage: ['exhaustion'] // Tireless smiths resist exhaustion
                }
            },
            cinderborn: {
                id: 'cinderborn_emberth',
                name: 'Ash Runner',
                description: 'Lean and fast, built for movement. Feet leave scorch marks when they run. Skin cooler than other Ashkar but still hot. Eyes constantly scanning for paths. Many have ash stains that never wash off. They move with fluid grace, steps leaving smoking embers. Their breath sometimes carries sparks.',
                culturalBackground: `The Ash-Runners trace their lineage to Ashkar scouts who learned to navigate volcanic wastes. Bloodline marked by speed and endurance in the heat. Their tradition requires that every member spend years training as runners. Learning to dash across molten rock unharmed and read the paths through lava flows. Ash-Runner clans are nomadic. Following geothermal hotspots that shift with the earth moods. Members serving as scouts, messengers, guides across volcanic territories. They practice ancient pathfinding techniques passed down through generations. How to read ash patterns. How to find safe routes through lava flows. How to hide in smoke clouds and ash storms. Their footsteps scorch the earth behind them. Leaving trails of smoking embers that mark their passage for days. But this speed comes at a cost. Their feet are always hot. Leaving burns on anything they touch for too long. Many Ash-Runners become solitary wanderers. Bodies adapted to endless travel across burning lands. The bloodline values speed and duty. Honor measured in messages delivered and paths found. They are the messengers of Ashkar society. Their mobility unmatched but their bodies forever marked by the heat they traverse.`,
                statModifiers: {
                    agility: 4,
                    intelligence: 2,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'ember_trail_emberth',
                        name: 'Ember Trail',
                        description: 'Scorch the earth behind you with each step, leaving a blazing trail of dying embers that marks your passage and guides allies through the volcanic waste.',
                        level: 1,
                        icon: 'spell_fire_burnout',
                        spellType: 'ACTION',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'fire',
                            secondaryElement: 'utility',
                            icon: 'spell_fire_burnout',
                            tags: ['tracking', 'signaling', 'fire']
                        },
                        utilityConfig: {
                            utilityType: 'tracking',
                            selectedEffects: [{
                                id: 'trail',
                                name: 'Trail',
                                description: 'Leave a visible trail of embers.'
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
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'ash_cloud_emberth',
                        name: 'Ash Cloud',
                        description: 'Exhale a billowing cloud of superheated ash that clings to the air, shrouding your movements in swirling grey that blinds your enemies and swallows light.',
                        level: 1,
                        icon: 'spell_fire_smokecloud',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'fire',
                            secondaryElement: 'concealment',
                            icon: 'spell_fire_smokecloud',
                            tags: ['concealment', 'stealth', 'fire']
                        },
                        buffConfig: {
                            buffType: 'custom',
                            customDescription: 'Advantage on Stealth while in cloud',
                            effects: [
                                {
                                    name: 'Ash Concealment',
                                    description: 'Advantage on Stealth',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'The ash cloud hides your presence'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            durationUnit: 'minutes',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'environment',
                            selectedEffects: [{
                                id: 'obscurement',
                                name: 'Obscurement',
                                description: 'Create a 10-foot radius cloud of hot ash that obscures vision.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            aoeSize: 10
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'frost_vulnerability_cinderborn',
                        name: 'Frost Vulnerability',
                        description: 'Vulnerable to frost damage (+50% damage) as frost can quench your inner heat.',
                        level: 1,
                        icon: 'spell_frost_frostbolt02',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'frost',
                            icon: 'spell_frost_frostbolt02',
                            tags: ['vulnerability', 'frost', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'frost_vulnerability',
                                    name: 'Frost Vulnerability',
                                    description: 'Frost seeps into the volcanic vents of your blood, quenching the inner heat that sustains your ash-scarred frame'
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Ignan', 'Auran'],
                speed: 35,
                baseStats: {
                    armor: 0,
                    hp: 24, // Lean and fast, not particularly hardy
                    mana: 28,
                    ap: 4, // Scouts and messengers, quick reactions - extra action point
                    passivePerception: 3, // Eyes constantly scanning for paths, read ash patterns
                    swimSpeed: 5, // Hot feet, poor swimmers (water cools them)
                    climbSpeed: 5, // Scouts, decent climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 3 // Lean and fast, quick to react
                },
                savingThrowModifiers: {
                    // Inner heat makes them vulnerable to cold but agile in movement
                    disadvantage: ['poison'], // Cold chills their inner fire
                    advantage: ['restrained'] // Agile scouts escape restraints
                }
            },
            warborn: {
                id: 'warborn_emberth',
                name: 'War Forged',
                description: 'Largest and most muscular of Ashkar. Skin covered in battle scars and burn marks. Eyes burn brightest when enraged. Many have weapons fused to their hands from heat. Their war cries sound like volcanic eruptions. In battle, their strikes leave trails of cinders. They smell of blood and smoke.',
                culturalBackground: `The War-Forged trace their lineage to Ashkar warriors who chose battle over craft. Bloodline marked by endless conflict and volcanic fury. Their tradition requires that every member prove themselves in fighting pits. Apprenticeships spent in endless duels where the weak fall to fuel the strong. War-Forged clans are built around arenas and training grounds. Members serving as warriors, mercenaries, protectors. They practice ancient combat techniques passed down through generations. How to channel rage into strength. How to fight with fire-forged weapons. How to become living weapons in battle. Their skin is a map of old wounds and burn marks. Each scar telling a story of violence survived. In battle, they become living weapons. Strikes leaving trails of cinders. War cries like the roar of erupting volcanoes. But the rage consumes them. They must fight regularly or become restless and irritable. Inner fire turning against them. Many War-Forged become mercenaries or raiders. Following wars like carrion birds follow death. The bloodline values strength and glory. Honor measured in scars earned and battles won. They are the warriors of Ashkar society. Their ferocity unmatched but their souls forever marked by the rage that drives them.`,
                statModifiers: {
                    strength: 4,
                    constitution: 2,
                    spirit: 1
                },
                traits: [
                    {
                        id: 'battle_rage_emberth',
                        name: 'Battle Rage',
                        description: 'When an enemy falls beneath your volcanic fury, the Fire Within erupts — your eyes blaze with inner flame and every strike burns with the fury of a forge pushed past its limits.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'REACTION',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'combat',
                            secondaryElement: 'fire',
                            icon: 'ability_warrior_rampage',
                            tags: ['rage', 'fire', 'combat', 'reaction']
                        },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            statModifiers: [
                                {
                                    id: 'rage_attack',
                                    name: 'Attack Bonus',
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    category: 'combat'
                                }
                            ],
                            effects: [
                                {
                                    name: 'Fire Damage',
                                    description: 'Volcanic fury ignites every blow, flame trailing from your fists like fresh-lava sparks',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Your attacks burn with inner fire'
                                    }
                                }
                            ],
                            durationValue: 1,
                            durationType: 'minutes',
                            canBeDispelled: false
                        },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    {
                                        triggerType: 'on_kill',
                                        conditions: {}
                                    }
                                ]
                            }
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'scarred_hide_emberth',
                        name: 'Scarred Hide',
                        description: 'A thousand battles have tempered your flesh like slag-cooled steel, each scar a forge mark that hardened what it touched and burned away the capacity for fear.',
                        level: 1,
                        icon: 'ability_warrior_defensivestance',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'combat',
                            secondaryElement: 'defense',
                            icon: 'ability_warrior_defensivestance',
                            tags: ['armor', 'fear-resistance', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            statModifiers: [
                                {
                                    id: 'armor_bonus',
                                    name: 'Armor Bonus',
                                    magnitude: 1,
                                    magnitudeType: 'flat',
                                    category: 'defense'
                                }
                            ],
                            effects: [
                                {
                                    name: 'Fear Resistance',
                                    description: 'Advantage on saves against fear',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Battle has hardened your resolve'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                        id: 'frost_vulnerability_warborn',
                        name: 'Frost Vulnerability',
                        description: 'The cold that would merely chill lesser folk strikes at the volcanic heart within you, threatening to quench the Fire Within that keeps your forge-blood flowing.',
                        level: 1,
                        icon: 'spell_frost_frostbolt02',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'frost',
                            icon: 'spell_frost_frostbolt02',
                            tags: ['vulnerability', 'frost', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'frost_vulnerability',
                                    name: 'Frost Vulnerability',
                                    description: 'Frost creeps into the war-forges of your blood, threatening to extinguish the volcanic fury that drives your battle rage'
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Ignan'],
                speed: 30,
                baseStats: {
                    armor: 0, // Scarred Hide passive adds +1, so base is 0
                    hp: 36, // Largest and most muscular, battle-tempered - extra durability
                    mana: 18,
                    ap: 4, // Warriors, battle rage - extra action point
                    passivePerception: 1, // Warriors, not particularly perceptive
                    swimSpeed: 0, // Hot skin, poor swimmers (water cools them)
                    climbSpeed: 0, // Not climbers
                    visionRange: 60,
                    darkvision: 0,
                    initiative: 2 // Warriors, quick to react in battle
                },
                savingThrowModifiers: {
                    // Inner fire makes them vulnerable to cold but battle-hardened against fear
                    disadvantage: ['poison'], // Cold extinguishes their inner fire
                    advantage: ['fear'] // Battle-hardened warriors resist fear
                }
            }
        }
    },

    vreken: {
        id: 'vreken',
        name: 'Vreken',
        essence: 'Predatory beast-kin',
        description: 'There is a second heartbeat beneath our ribs, a frantic, wild rhythm that answers only to the moon and the scent of blood. We are the inheritors of the animal’s grace and its hunger, our bodies caught in a permanent tension between the man and the wolf. Our eyes gleam with a yellow, predatory light that sees the world not as cities and roads, but as territories and trails. When we run, the forest floor speaks to us in a language of crushed moss and distant movement; when we hunt, the silence is our closest ally. We do not just wear the beast; we are the beast, forever fighting to keep the human mind from drowning in the primal sea of instinct. Our hands are calloused by the wild, our teeth sharp enough to tear through the thin veil of civilization. We are the watchers at the edge of the firelight, the ones who know that the dark is not empty, but full of eyes that look exactly like ours.',
        icon: 'fas fa-paw',
        overview: 'The Vreken are people whose ancestors broke the old taboos. Drank from forbidden springs. Bound their bloodlines to beast-transformation through cursed rituals. Through generations of carrying the beast within, their bloodlines have been marked by the transformation curse. Eyes that gleam with animal cunning. Bodies that shift between human and beast. They are organized into packs that roam the wild borders between civilization and savagery. Settlements hidden in caves and ruined towers. The Vreken do not choose to transform. It is their heritage, passed down through bloodlines that carry the curse of the beast.',
        culturalBackground: `Vreken society is built on packs that roam the wild borders between civilization and savagery. Communities organized around managing the curse that binds them. Each pack traces its founding to ancestors who broke the old taboos. Drank from forbidden springs. Bound their bloodlines to beast-transformation. Their camps are hidden in caves or ruined towers. Places where the boundary between man and animal frays. Pack elders pass down the old ways. How to control the transformation. How to master the beast. How to survive the curse that claims so many. Children are taught from birth to recognize the signs. The yellow gleam in the eyes. The sudden hunger for raw meat. The dreams of running on four legs through endless forests. A Vreken first change is agony. Bones cracking. Flesh tearing. The human mind drowning in animal instinct. Some learn to master the beast. Using its strength while keeping their humanity intact. Others lose themselves entirely. Becoming monsters that hunt their own kind. Pack disputes settle through hunts and the testimony of those who have mastered the curse. Many Vreken end their days in self-imposed exile. Chaining themselves during full moons to prevent the change that would claim them forever. They are a people bound by curse and beast. Their transformation unmatched but their humanity forever threatened by the animal within.`,
        variantDiversity: 'The Vreken are divided into two major pack bloodlines: The Beast-Bound embrace their predatory nature and bestial instincts, while the Chain-Bound seek control and struggle to maintain their humanity against the transformation.',
        integrationNotes: {
            actionPointSystem: 'Vreken abilities focus on transformation, tracking, and bestial combat. Their shapeshifting provides versatile tactical options but carries risks.',
            backgroundSynergy: 'Vreken excel in backgrounds emphasizing nature, survival, and primal power. Their curse creates compelling internal conflicts and roleplay opportunities.',
            classCompatibility: 'Vreken make excellent druids, rangers, and primal warriors. Their transformation abilities enhance classes that benefit from versatility and physical prowess.'
        },
        meaningfulTradeoffs: 'Vreken gain powerful transformation and tracking abilities but risk losing control to their beast nature. They suffer social penalties and struggle with their dual identity.',
        baseTraits: {
            languages: ['Common', 'Beast Speech'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'8" - 6\'4"',
            weight: '170-260 lbs',
            build: 'Athletic and feral'
        },
        subraces: {
            hunter: {
                id: 'hunter_vreken',
                name: 'Beast Bound',
                description: 'Most bestial of all Vreken. Eyes brightest yellow, pupils slitted like cats. Hands show permanent claw-like nails. Fur visible on arms and legs. Teeth noticeably sharp. They move with predatory grace, always ready to hunt. Many keep animal trophies. Their transformation is smooth, practiced.',
                culturalBackground: `The Beast-Bound trace their lineage to Vreken who embraced their inner beast completely. Bloodline marked by perfect mastery of the transformation. Their tradition requires that every member learn to call upon their beast form at will. Apprenticeships spent mastering the predatory instincts that come with the curse. Beast-Bound packs serve as hunters and protectors. Members able to transform into perfect predators capable of tracking prey for days. They practice ancient hunting techniques passed down through generations. How to control the transformation. How to channel animal strength. How to hunt with perfect precision. Their eyes gleam with animal cunning. Movements fluid and predatory. But the beast demands tribute. They must hunt regularly. Or the animal rage consumes their remaining humanity. Many Beast-Bound become solitary predators. Living in the wild and only visiting settlements to trade pelts for necessities. The bloodline values strength and mastery. Honor measured in hunts completed and beasts mastered. They are the hunters of Vreken society. Their transformation unmatched but their humanity forever thin over animal instinct.`,
                statModifiers: {
                    strength: 3,
                    agility: 2,
                    charisma: -3
                },
                traits: [
                    {
                        id: 'beast_form_vreken',
                        name: 'Beast Form',
                        description: 'The cursed blood in your veins boils as bones crack and reform — the beast within tears free of its prison of flesh, reshaping you into a predator hungry for the hunt.',
                        level: 1,
                        icon: 'ability_druid_primaltenacity',
                        spellType: 'ACTION',
                        effectTypes: ['transformation', 'buff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_druid_primaltenacity',
                            tags: ['transformation', 'beast', 'combat']
                        },
                        transformationConfig: {
                            transformationType: 'animal',
                            targetType: 'self',
                            duration: 10,
                            durationUnit: 'minutes',
                            power: 'moderate',
                            specialEffects: ['natural_weapons', 'enhanced_senses', 'animal_traits']
                        },
                        buffConfig: {
                            statModifiers: [
                                {
                                    id: 'beast_strength',
                                    name: 'Strength Enhancement',
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                },
                                {
                                    id: 'beast_agility',
                                    name: 'Agility Enhancement',
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                },
                                {
                                    id: 'beast_constitution',
                                    name: 'Constitution Enhancement',
                                    magnitude: 1,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                }
                            ],
                            durationValue: 10,
                            durationType: 'minutes',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'predators_instinct_vreken',
                        name: 'Predator\'s Instinct',
                        description: 'The beast sharpens your senses beyond mortal limits — you taste fear on the wind, hear heartbeats through stone, and track prey by the scent of terror alone, though the predator\'s hunger grows harder to silence with each kill.',
                        level: 1,
                        icon: 'ability_hunter_mastermarksman',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_hunter_mastermarksman',
                            tags: ['senses', 'tracking', 'passive']
                        },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [{
                                id: 'scent',
                                name: 'Scent',
                                description: 'Can detect creatures within 60 feet by scent, even through walls. Advantage on tracking checks.',
                                range: 60
                            }],
                            duration: 10,
                            durationUnit: 'minutes',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    {
                                        triggerType: 'combat_start',
                                        conditions: {
                                            healthPercentage: 50,
                                            comparison: 'less_than'
                                        }
                                    }
                                ]
                            }
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
                        id: 'cursed_vulnerability_vreken',
                        name: 'Cursed Vulnerability',
                        description: 'The forbidden magic woven into your bloodline can be severed by that which purifies — silver cuts through the curse\'s protection like moonlight through shadow, and radiant light burns the dark weave that holds your shapeshifting together.',
                        level: 1,
                        icon: 'spell_holy_harmundeadaura',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_harmundeadaura',
                            tags: ['vulnerability', 'curse', 'passive']
                        },
                        debuffConfig: {
                            statModifiers: [
                                {
                                    id: 'silver_vulnerability',
                                    name: 'Silver Vulnerability',
                                    magnitude: 50,
                                    magnitudeType: 'percentage',
                                    category: 'vulnerability'
                                },
                                {
                                    id: 'radiant_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    magnitude: 50,
                                    magnitudeType: 'percentage',
                                    category: 'vulnerability'
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Beast Speech', 'Primal'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 28, // Predatory but not particularly hardy
                    mana: 22,
                    ap: 4, // Predators, quick reactions - extra action point
                    passivePerception: 4, // Predator's Instinct - enhanced senses, track prey, detect by scent
                    swimSpeed: 5, // Predators, decent swimmers
                    climbSpeed: 10, // Predatory grace, excellent climbers
                    visionRange: 60,
                    darkvision: 60, // Predator's eyes, can see in darkness
                    initiative: 3 // Predatory grace, always ready to hunt - quick to react
                },
                savingThrowModifiers: {
                    // Shapeshifting curse makes them vulnerable to silver weapons
                    disadvantage: ['poison'], // Silver weapons weaken their curse
                    advantage: ['fear'] // Beast form resists fear effects
                }
            },
            penitent: {
                id: 'penitent_vreken',
                name: 'Chain Bound',
                description: 'Scars from chains and restraints cover their bodies. Eyes show less animal gleam, more human struggle. Hands bear marks from self-binding. Many wear restraining items even in human form. Their transformation is painful, bones cracking audibly. They show visible strain when resisting the change. Some have permanent partial transformations, stuck between forms.',
                culturalBackground: `The Chain-Bound trace their lineage to Vreken who fought to maintain control against the beast. Bloodline marked by constant struggle against the transformation. Their tradition requires that every member learn restraint techniques. Apprenticeships spent mastering chains and rituals that prevent the change. Chain-Bound packs serve as teachers and protectors. Members teaching others how to recognize and resist the transformation curse. They practice ancient control techniques passed down through generations. How to chain the beast. How to resist the change. How to maintain humanity despite the curse. Their bodies are covered in self-inflicted wounds from chains and restraints. Reminders of battles won against their inner beast. But their control is fragile. Stress or injury can cause partial transformations. Leaving them stuck between forms. Many Chain-Bound become healers and teachers. Using their experience to help others through their first changes. The bloodline values control and humanity. Honor measured in transformations resisted and humans saved. They are the guardians of Vreken society. Their control unmatched but their bodies forever marked by the chains that bind the beast.`,
                statModifiers: {
                    strength: -2,
                    spirit: 3,
                    intelligence: 2
                },
                traits: [
                    {
                        id: 'controlled_transformation_vreken',
                        name: 'Controlled Transformation',
                        description: 'You grip the chains of your curse and haul the beast to heel just long enough to borrow its strength — but every moment of that control costs you, the iron links biting deeper as body and spirit war against each other.',
                        level: 1,
                        icon: 'ability_druid_supriseattack',
                        spellType: 'ACTION',
                        effectTypes: ['transformation', 'utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_druid_supriseattack',
                            tags: ['transformation', 'control', 'utility']
                        },
                        transformationConfig: {
                            transformationType: 'physical',
                            targetType: 'self',
                            duration: 1,
                            durationUnit: 'minutes',
                            power: 'minor',
                            specialEffects: ['enhanced_senses', 'healing_factor']
                        },
                        utilityConfig: {
                            utilityType: 'utility',
                            selectedEffects: [{
                                id: 'transformation',
                                name: 'Transformation',
                                description: 'Gain enhanced senses or rapid healing for 1 minute.'
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
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        savingThrow: {
                            enabled: true,
                            savingThrowType: 'spirit',
                            difficultyClass: 14,
                            saveOutcome: 'partial_immunity'
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'curse_resistance_vreken',
                        name: 'Curse Resistance',
                        description: 'Every waking moment spent wrestling the beast within has forged an iron will — hexes, possessions, and enchantments slide off a mind already occupied by an endless war between man and monster.',
                        level: 1,
                        icon: 'spell_holy_removecurse',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'protection',
                            secondaryElement: 'curse',
                            icon: 'spell_holy_removecurse',
                            tags: ['resistance', 'curse', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Curse Resistance',
                                    description: 'Advantage on saves against curses and lycanthropy',
                                    statusEffect: {
                                        level: 'moderate',
                                        saveType: 'spirit',
                                        saveDC: 0,
                                        saveOutcome: 'negates'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'detection',
                                name: 'Detection',
                                description: 'Can sense supernatural afflictions within 30 feet.'
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
                        },
                    },
                    {
                        id: 'iron_vulnerability_vreken',
                        name: 'Iron Vulnerability',
                        description: 'The cold iron of your chains is no mere metaphor — iron weapons bite deeper against a body held together by cursed magic, and frost seeps through the cracks in your will, numbing the beast you so desperately cling to.',
                        level: 1,
                        icon: 'inv_ingot_iron',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'frost',
                            icon: 'inv_ingot_iron',
                            tags: ['vulnerability', 'iron', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Iron Vulnerability',
                                    description: 'Cold iron sears your cursed flesh, the metal that chains the beast also poisoning your bloodline',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    name: 'Frost Vulnerability',
                                    description: 'Frost stiffens the chains that bind your beast, the cold making your struggle against transformation all the more painful',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    name: 'Transformation Block',
                                    description: 'Iron shackles prevent transformation abilities',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Cannot use transformation abilities while bound by iron'
                                    }
                                }
                            ],
                            durationType: 'permanent',
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
                languages: ['Common', 'Beast Speech', 'Celestial'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: -5, // Scars from chains, physically weakened from constant struggle
                    mana: 28, // Spiritual struggle grants some mana
                    ap: 2, // Constant struggle, less action-oriented
                    passivePerception: 2, // Teachers and protectors, sense supernatural afflictions
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 0, // Not climbers, struggle with transformation
                    visionRange: 60,
                    darkvision: 0,
                    initiative: -1 // Visible strain, slower to react
                },
                savingThrowModifiers: {
                    // Chained nature makes them vulnerable to iron but grants mental resilience
                    disadvantage: ['poison'], // Iron weakens their curse
                    advantage: ['charm'] // Mental struggle grants resistance to charm
                }
            }
        }
    },

    morthel: {
        id: 'morthel',
        name: 'Morthel',
        essence: 'Shadow-bound revenants',
        description: 'Our voices are the rustle of dead leaves in an empty hallway, thin and carrying the chill of the grave. We are the people of the long twilight, those whose shadows have grown longer than their bodies, reaching for the voids between the stars. Our skin is the color of bone beneath a clouded moon, and our touch is a promise of the stillness that awaits all things. We do not walk through the world so much as we haunt it, moving through the periphery of your vision like a half-remembered dream. The grief of a thousand years is etched into our features, a sorrow so deep it has become a kind of strength. We are the keepers of the forgotten names, the silent observers of the passing of ages. To look into our eyes is to see the end of the road, the final sunset that never quite fades into total night. We are not dead, but we have forgotten how to be truly alive.',
        icon: 'fas fa-skull',
        overview: 'The Neth are people whose ancestors swore impossible oaths. To guard treasures until mountains crumble. To protect secrets until stars fall. Through generations of these death-bound promises, their bloodlines have been marked by undeath. Bodies that refuse to decay. Minds that outlast centuries. Souls bound by vows that transcend death. They are organized into tomb-communities built around the graves they guard. Settlements clustered in mausoleums and necropolises. The Neth do not choose to be undead. It is their heritage, passed down through bloodlines that carry the weight of ancient oaths.',
        culturalBackground: `Neth society is built on tomb-communities organized around the graves and treasures they guard. Settlements clustered in mausoleums and necropolises. Each community traces its founding to ancestors who swore impossible vows. To guard treasures until the mountains crumble. To protect secrets until the stars fall from the sky. Their tombs are silent libraries of the dead. Walls inscribed with oaths that bind souls long after bodies have failed. Community elders pass down the old ways. How to maintain undead bodies. How to fulfill oaths that span centuries. How to guard what was sworn to protect. Death was supposed to release them. But their promises held tighter than any grave. Now they shuffle through eternal night. Flesh rotting but never failing. Minds sharp as the day they died. Community disputes settle through oath-readings and the testimony of those who have guarded longest. They speak of the living with distant pity. Remembering warmth and emotion like half-forgotten dreams. Some Neth embrace their immortality. Becoming patient strategists who outlast any enemy. Others claw at their own tombs. Desperate to complete their duties and finally rest. They are a people bound by oath and undeath. Their guardianship unmatched but their souls forever trapped by promises that cannot be broken.`,
        variantDiversity: 'The Neth are divided into two major tomb bloodlines: The Vault-Keepers are bound by oaths to guard treasures and hoards, while the Dust-Scribes are bound by oaths to preserve knowledge and secrets.',
        integrationNotes: {
            actionPointSystem: 'Neth abilities focus on durability, undead resilience, and obsessive dedication. Their immortal nature provides unique advantages but comes with compulsions.',
            backgroundSynergy: 'Neth excel in backgrounds emphasizing knowledge, dedication, and endurance. Their undead nature creates unique roleplay challenges and opportunities.',
            classCompatibility: 'Neth make excellent tanks, knowledge specialists, and undead-themed casters. Their immunities and resilience enhance classes that benefit from durability.'
        },
        meaningfulTradeoffs: 'Neth gain undead immunities and immortality but are bound by compulsions, vulnerable to radiant damage, and disconnected from the living world. They struggle with their cursed existence.',
        baseTraits: {
            languages: ['Common', 'Necril'],
            lifespan: 'Immortal (cursed)',
            baseSpeed: 25,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '120-180 lbs',
            build: 'Gaunt and preserved'
        },
        subraces: {
            hoarder: {
                id: 'hoarder_neth',
                name: 'Vault Keeper',
                description: 'Bodies most preserved of all Morthel, decay slowed to near-suspension by proximity to the treasures they guard. Eyes constantly scanning, always watching — pupils like dark coins that reflect gold in lamplight. Hands often show wear from centuries of handling coins and gems. Many develop a habit of counting and organizing that borders on compulsion. Their gaze seems to follow anyone who approaches their guarded items. They move stiffly, joints protesting after centuries of standing guard in the same corridor, but their grip strength has not diminished one bit.',
                culturalBackground: 'The Vault-Keepers trace their lineage to Morthel who swore oaths to guard treasures until the mountains crumble. Bloodline marked by eternal guardianship of hoards and vaults. Their tradition requires that every member learn to appraise and protect treasures. Apprenticeships spent mastering the art of guarding what was sworn to protect. Vault-Keeper tombs are built around the treasures they guard, members serving as eternal sentinels in forgotten vaults. They practice ancient guardianship techniques passed down through generations. How to ward against thieves. How to sense the worth of treasures. How to maintain vigilance for centuries without rest. Their presence wards against thieves, mere gaze causing shadows to deepen and locks to strengthen. But their obsession grows. They begin to see people as potential thieves, protective instincts turning paranoid. Many Vault-Keepers live in isolation, tombs becoming prisons of their own making.',
                statModifiers: { constitution: 2, strength: 1 },
                baseStats: { health: 14, mana: 2, actionPoints: 3, initiative: -1 },
                savingThrowModifiers: { advantage: ['fear', 'poison'], disadvantage: ['radiant_effects'] },
                traits: [
                    {
                        id: 'deathless_guard',
                        name: 'Deathless Guard',
                        description: 'When a creature attempts to open a container, door, or barrier you are guarding, you can immediately teleport to an unoccupied space adjacent to them and make a melee attack against them. On hit, deal 2d8 necrotic damage and the target must succeed on a Wisdom save or be frightened of you for 1 minute.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'REACTION',
                        effectTypes: ['damage', 'control', 'movement'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['necrotic'], formula: '2d8', resolution: 'attack' },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{ type: 'frightened', mechanicsText: 'Target is frightened for 1 minute on failed Wisdom save' }],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes',
                            saveConfig: { saveType: 'wisdom', saveDC: 'spell', successEffect: 'negates' }
                        },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{ id: 'teleport', name: 'Shadow Step Teleport', description: 'Teleport to adjacent space near target' }],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'treasure_sense',
                        name: 'Treasure Sense',
                        description: 'Close your eyes and sense the value of all objects within 60ft. You know the approximate worth of each item, whether it is magical, and if anything has been recently moved or disturbed in the area. You cannot be surprised by creatures carrying valuable items.',
                        level: 1,
                        icon: 'inv_misc_coin_01',
                        spellType: 'ACTION',
                        effectTypes: ['detection', 'utility'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [
                                { id: 'treasure_detection', name: 'Treasure Detection', description: 'Detect all valuable objects within 60ft and know their worth' },
                                { id: 'magic_detection', name: 'Magic Detection', description: 'Know if detected items are magical' },
                                { id: 'disturbance_detection', name: 'Disturbance Detection', description: 'Sense if anything has been recently moved or disturbed' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'undead_resilience',
                        name: 'Undead Resilience',
                        description: 'Your undead nature renders you immune to poison damage, disease, and exhaustion. You do not need to sleep, eat, or breathe. Your body is a preserved instrument of oath-keeping, untroubled by mortal frailties.',
                        level: 1,
                        icon: 'spell_shadow_deathsembrace',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'immunity',
                            effects: [
                                { type: 'poison_immunity', value: 'immune', mechanicsText: 'Immune to poison damage and the poisoned condition' },
                                { type: 'disease_immunity', value: 'immune', mechanicsText: 'Immune to all diseases' },
                                { type: 'exhaustion_immunity', value: 'immune', mechanicsText: 'Immune to exhaustion' },
                                { type: 'no_sleep_eat_breathe', mechanicsText: 'Do not need to sleep, eat, or breathe' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'grave_lock',
                        name: 'Grave Lock',
                        description: 'As a bonus action, you can lock any non-magical container, door, or gate by touching it. The lock cannot be picked and can only be opened by you or by dealing 20 or more damage to it in a single hit. You always know if something you have locked has been tampered with, regardless of distance.',
                        level: 1,
                        icon: 'inv_misc_key_06',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'security',
                            selectedEffects: [
                                { id: 'magical_lock', name: 'Magical Lock', description: 'Lock any non-magical container, door, or gate by touch. Cannot be picked. Opens only for you or by dealing 20+ damage.' },
                                { id: 'tamper_detection', name: 'Tamper Detection', description: 'Always know if something you locked has been tampered with, regardless of distance.' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'touch', targetRestrictions: ['object'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'radiant_vulnerability_morthel_hoarder',
                        name: 'Radiant Vulnerability',
                        description: 'Your preserved form is held together by the negative energy of undeath — holy radiance unravels that binding like sunlight burning away shadow.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'radiant_vulnerability',
                                name: 'Radiant Vulnerability',
                                description: 'Holy radiance unravels the negative energy that holds your preserved form together — sunlight burns away shadow',
                                statusEffect: {
                                    vulnerabilityType: 'radiant',
                                    vulnerabilityPercent: 100
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    }
                ]
            },
            scholar: {
                id: 'scholar_neth',
                name: 'Lore Keeper',
                description: 'Bodies covered in a fine layer of dust from handling ancient texts for centuries. Fingers permanently stained with ink that never washes off — colors shifting between black, silver, and deep violet. Eyes glow with accumulated knowledge, irises like pages of script. They move slowly, carefully, as if afraid to damage something fragile. Many have quills and scrolls always at hand, held in positions of readiness. Their speech sometimes references ancient events as if they happened yesterday, because to their undying mind, they nearly did.',
                culturalBackground: 'The Lore Keepers trace their lineage to Morthel who swore oaths to protect scrolls and secrets until the end of time. Bloodline marked by eternal preservation of knowledge. Their tradition requires that every member learn to preserve and archive knowledge. Apprenticeships spent mastering the art of maintaining perfect memory across centuries. Lore Keeper tombs are built around libraries and archives, members serving as eternal scholars in forgotten repositories. They practice ancient preservation techniques passed down through generations. How to maintain perfect memory. How to preserve texts through undeath. How to guard secrets that must never be lost. Their minds are vast repositories of forgotten lore, capable of recalling any text they have ever read. They are patient researchers, capable of spending centuries deciphering ancient mysteries. But this knowledge comes at a cost. They lose touch with current events, minds filled with too many voices from the past.',
                statModifiers: { intelligence: 2, wisdom: 1 },
                baseStats: { health: 10, mana: 5, actionPoints: 3, initiative: -1 },
                savingThrowModifiers: { advantage: ['charmed', 'stun'], disadvantage: ['radiant_effects'] },
                traits: [
                    {
                        id: 'forbidden_knowledge',
                        name: 'Forbidden Knowledge',
                        description: 'Consult the vast archives of your undying memory. Choose one creature you can see — you recall (or intuit) one of its vulnerabilities, resistances, or immunities, AND one piece of its history (a secret, a weakness, a fear). In combat, your next attack against that creature this turn has advantage and deals an additional 1d8 psychic damage as you exploit the knowledge.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'ACTION',
                        effectTypes: ['detection', 'damage'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['psychic'], formula: '1d8', resolution: 'attack' },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [
                                { id: 'weakness_revelation', name: 'Weakness Revelation', description: 'Learn one vulnerability, resistance, or immunity of target creature' },
                                { id: 'secret_revelation', name: 'Secret Revelation', description: 'Learn one secret, weakness, or fear of target' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        buffConfig: {
                            buffType: 'combat_advantage',
                            effects: [{ type: 'attack_advantage', mechanicsText: 'Next attack against target has advantage' }],
                            durationValue: 1, durationType: 'turns', durationUnit: 'turns'
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 60, targetRestrictions: ['enemy'] },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'echo_of_the_dead',
                        name: 'Echo of the Dead',
                        description: 'Your voice carries the weight of centuries. Speak a word of power learned from an ancient text. All creatures within 20ft must make a Wisdom save or be silenced for 1 minute as the voices of the dead fill their minds. Undead creatures are immune. Creatures that fail by 5 or more also take 2d6 psychic damage.',
                        level: 1,
                        icon: 'spell_shadow_curse',
                        spellType: 'ACTION',
                        effectTypes: ['control', 'damage'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['psychic'], formula: '2d6', resolution: 'save' },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{ type: 'silenced', mechanicsText: 'Target cannot speak or cast verbal spells for 1 minute' }],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes',
                            saveConfig: { saveType: 'wisdom', saveDC: 'spell', successEffect: 'negates' }
                        },
                        targetingConfig: { targetingType: 'area', rangeType: 'self_centered', aoeShape: 'sphere', aoeParameters: { radius: 20 } },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 2, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'perfect_memory',
                        name: 'Perfect Memory',
                        description: 'You have perfect recall of everything you have ever read, seen, or heard. You can learn any language by studying a text for 1 hour. You have advantage on all Intelligence (History, Arcana, Religion) checks.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [
                                { type: 'perfect_recall', mechanicsText: 'Perfect recall of everything ever read, seen, or heard' },
                                { type: 'rapid_language_learning', mechanicsText: 'Learn any language by studying a text for 1 hour' },
                                { type: 'knowledge_advantage', mechanicsText: 'Advantage on Intelligence (History, Arcana, Religion) checks' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'deathless_vigil',
                        name: 'Deathless Vigil',
                        description: 'You do not need to sleep and are immune to exhaustion. During a long rest, you remain fully conscious and aware of your surroundings. You cannot be surprised while other party members sleep.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [
                                { type: 'sleeplessness', mechanicsText: 'No need for sleep. Remain conscious during long rests.' },
                                { type: 'exhaustion_immunity', value: 'immune', mechanicsText: 'Immune to exhaustion' },
                                { type: 'no_surprise', mechanicsText: 'Cannot be surprised while party members sleep' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'radiant_vulnerability_morthel_scholar',
                        name: 'Radiant Vulnerability',
                        description: 'Holy light sears away the accumulated knowledge preserved in undeath — centuries of learning undone by pure radiance.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'radiant_vulnerability',
                                name: 'Radiant Vulnerability',
                                description: 'Holy light burns away the accumulated knowledge preserved in undeath — radiance devours centuries of stored intellect',
                                statusEffect: {
                                    vulnerabilityType: 'radiant',
                                    vulnerabilityPercent: 100
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    }
                ]
            },
            wraith: {
                id: 'wraith_morthel',
                name: 'Wraith',
                description: 'The boundary between flesh and shadow has blurred past recognition. Their forms flicker at the edges, sometimes translucent, sometimes solid enough to cast a shadow. Eyes burn with cold pale fire in a face that might have been handsome centuries ago — now gaunt, cheekbones cutting through skin like blade edges. Dark veins trace patterns beneath translucent skin that pulse with something blacker than blood. Ravens are drawn to them, perching on shoulders and circling overhead in unsettling numbers. Their voice echoes, as if spoken from the bottom of a well. In dim light, they are barely visible — a silhouette that could be mistaken for a trick of the darkness.',
                culturalBackground: 'The Wraiths are the most cursed of all Morthel bloodlines. Their ancestors swore oaths so binding, so absolute, that the weight of their promises began to literally unmake their physical forms. Generation by generation, flesh gave way to shadow. Bone dissolved into something that was neither material nor immaterial. They are the inheritors of the Corvani tradition — the raven-speakers who once served as psychopomps, guiding souls between life and death. When the Corvani were folded into the Morthel, the raven-spirits followed, and now every Wraith carries a murder of phantom ravens in their shadow. They practice the ancient arts of the between-places. How to fade through walls. How to speak with the recently dead. How to ride the shadows like roads. But each use of their gift pulls them further from the material world. The oldest Wraiths are barely visible even in daylight — more memory than person. The bloodline values restraint and the careful balance between existence and dissolution.',
                statModifiers: { dexterity: 2, charisma: 1 },
                baseStats: { health: 9, mana: 4, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['grappled', 'restrained'], disadvantage: ['radiant_effects'] },
                traits: [
                    {
                        id: 'fade_through',
                        name: 'Fade Through',
                        description: 'Become partially incorporeal for 1 minute. You can move through solid objects (but not creatures) at half speed. You take half damage from all non-magical, non-radiant sources. You cannot interact with physical objects or make physical attacks while faded. You can end the effect early as a bonus action. If you are inside a solid object when the effect ends, you are ejected to the nearest open space and take 3d6 force damage.',
                        level: 1,
                        icon: 'spell_shadow_invisibility',
                        spellType: 'ACTION',
                        effectTypes: ['movement', 'buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'incorporeal',
                            effects: [
                                { type: 'pass_through_objects', mechanicsText: 'Move through solid objects at half speed' },
                                { type: 'damage_reduction', value: 'half', mechanicsText: 'Half damage from non-magical, non-radiant sources' }
                            ],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes', canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'restriction',
                            effects: [{ type: 'no_physical_interaction', mechanicsText: 'Cannot interact with physical objects or make physical attacks while faded' }],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 2, components: ['verbal', 'somatic'] },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'raven_scout',
                        name: 'Raven Scout',
                        description: 'Summon a phantom raven from your shadow and send it to any point within 1 mile that you have previously seen. For 10 minutes, you see and hear everything the raven perceives. The raven is invisible to all but you and other Morthel. If the raven would take damage, it dissolves and you take 1d4 psychic damage.',
                        level: 1,
                        icon: 'inv_raven_hold',
                        spellType: 'ACTION',
                        effectTypes: ['detection', 'summon'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'scouting',
                            selectedEffects: [
                                { id: 'remote_sight', name: 'Remote Sight', description: 'See and hear through phantom raven up to 1 mile away for 10 minutes' },
                                { id: 'invisibility', name: 'Raven Invisibility', description: 'Raven is invisible to all but you and other Morthel' }
                            ],
                            duration: 10,
                            durationUnit: 'minutes'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, components: ['verbal'] },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                    },
                    {
                        id: 'shadow_step',
                        name: 'Shadow Step',
                        description: 'When you are in dim light or darkness, you can teleport up to 30ft to an unoccupied space you can see that is also in dim light or darkness as a bonus action. You leave behind a faint afterimage that lingers for 1 round.',
                        level: 1,
                        icon: 'ability_rogue_shadowstep',
                        spellType: 'PASSIVE',
                        effectTypes: ['movement'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [
                                { id: 'shadow_teleport', name: 'Shadow Teleport', description: 'Teleport 30ft between dim light or darkness as a bonus action' },
                                { id: 'afterimage', name: 'Afterimage', description: 'Leave a faint afterimage that lingers for 1 round' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'fading',
                        name: 'Fading',
                        description: 'You have resistance to necrotic damage. However, your physical form is unstable — you have -1 to your maximum HP per character level (minimum 1 HP). In bright sunlight, all Constitution checks are at disadvantage as the light pulls at your form. Ravens are naturally drawn to you and will follow you in groups of 3-12.',
                        level: 1,
                        icon: 'spell_shadow_twilight',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'resistance',
                            effects: [{ type: 'necrotic_resistance', mechanicsText: 'Resistance to necrotic damage' }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                { type: 'reduced_max_hp', value: -1, mechanicsText: '-1 max HP per character level (minimum 1 HP)' },
                                { type: 'sunlight_weakness', mechanicsText: 'Disadvantage on Constitution checks in bright sunlight' },
                                { type: 'raven_attraction', mechanicsText: 'Ravens are naturally drawn to you (3-12 follow at any time)' }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    },
                    {
                        id: 'radiant_vulnerability_morthel_wraith',
                        name: 'Radiant Vulnerability',
                        description: 'You are a creature of shadow and void — pure light and raw magical force can tear your incorporeal form apart.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'radiant_vulnerability',
                                name: 'Radiant Vulnerability',
                                description: 'Pure radiant light tears at the shadow that constitutes your form — holy radiance is anathema to creatures of the void',
                                statusEffect: {
                                    vulnerabilityType: 'radiant',
                                    vulnerabilityPercent: 100
                                }
                            }, {
                                id: 'force_vulnerability',
                                name: 'Force Vulnerability',
                                description: 'Raw magical force can tear your incorporeal form apart — you are vulnerable to the fundamental energy that shapes reality',
                                statusEffect: {
                                    vulnerabilityType: 'force',
                                    vulnerabilityPercent: 50
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                    }
                ]
            }
        }
    },

    astren: {
        id: 'astren',
        name: 'Astren',
        essence: 'Stellar exiles',
        description: 'Our ancestors did not walk across the land to find this place; they fell from the velvet dark between the stars, bringing the cold of the void with them. We are the children of the meteors, our skin mapped with the silver geometry of constellations that no longer exist in the sky. Our thoughts are not linear, but fractured by the cosmic truths that we carry in our marrow—truths that make the stone walls of your cities feel as thin as wet parchment. When we touch you, you feel the chill of a dying sun; when we speak, we echo the mathematics of the infinite. We move with a grace that is not entirely anchored to the ground, as if we are still waiting for the gravity of our home to reclaim us. We are the heralds of the outside, the witnesses to the vast, uncaring silence of the cosmos, forever seeking a way back to the light we once knew.',
        icon: 'fas fa-star',
        overview: 'The Astren are people whose ancestors literally fell from the stars. Crashing to earth in meteors and comets. Through generations of carrying cosmic energy, their bloodlines have been marked by alien origins. Eyes that reflect unfamiliar constellations. Minds that fracture under cosmic truths. Bodies scarred by the fall. They are organized into crater-communities built around the impact sites where their ancestors landed. Settlements clustered where the void touches earth. The Astren do not choose to be alien. It is their heritage, passed down through bloodlines that remember the great fall.',
        culturalBackground: `Astren society is built on crater-communities organized around the impact sites where their ancestors fell. Settlements clustered where meteors scarred the earth. Each community traces its founding to ancestors who crashed to earth in comets and meteors. Traditions preserving the memory of the great fall. Their craters scar the wilderness like divine wounds. Occupants emerging from the smoke with eyes that reflect constellations never seen from this world. Community elders pass down the old ways. How to channel cosmic energy. How to read star patterns. How to navigate the alien knowledge that fractures mortal minds. They speak of the great fall. Of being cast out from realms where mathematics paint reality and time flows backward. Their minds fracture under the weight of cosmic truths. Seeing futures that have not happened. Remembering lives never lived. Community disputes settle through star-readings and the testimony of those who remember the void best. They bear the cold of the void in their bones. Touch leaving frost patterns that linger for days. Some Astren become wandering prophets. Speaking truths that sound like madness to those who hear them. Others hoard their cosmic knowledge. Becoming enigmatic advisors to kings and warlords. They are a people bound by star and void. Their cosmic knowledge unmatched but their minds forever fractured by truths that break mortal understanding.`,
        variantDiversity: 'The Astren are divided into three major crater bloodlines: The Void-Walkers come from the empty spaces between stars, the Sun-Bound carry the fire of dying suns, and the Star-Mapped embody the patterns written in the constellations.',
        integrationNotes: {
            actionPointSystem: 'Astren abilities focus on cosmic energy, gravity manipulation, and reality warping. Their alien nature provides unique tactical options.',
            backgroundSynergy: 'Astren excel in backgrounds emphasizing knowledge, cosmic power, and alien perspectives. Their otherworldly nature creates compelling roleplay.',
            classCompatibility: 'Astren make excellent cosmic casters, gravity manipulators, and knowledge seekers. Their abilities enhance classes that warp reality.'
        },
        meaningfulTradeoffs: 'Astren gain incredible cosmic powers and alien knowledge but struggle to relate to mortals and risk madness from their own insights.',
        baseTraits: {
            languages: ['Common', 'Celestial', 'Cosmic'],
            lifespan: 'Unknown',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '130-190 lbs',
            build: 'Slender and otherworldly'
        },
        subraces: {
            voidwalker: {
                id: 'voidwalker_astren',
                name: 'Void Walker',
                description: 'Coldest touch of all Astren — fingertips leave frost on warm surfaces. Skin pale as starlight, nearly translucent at the wrists and neck where constellations map their bloodlines in faint silver lines. Eyes are dark like the void between stars, no whites visible, just depth that swallows light. Their presence makes air feel thin, as if reality itself recoils. They seem to fade slightly at the edges, outlines blurring. Many have trouble staying in one place — their body remembers the void between stars and yearns for weightlessness. Movements sometimes leave trails of shadow that dissipate slowly.',
                culturalBackground: 'The Void-Walkers trace their lineage to Astren who fell from the empty spaces between stars. Bloodline marked by the cold void that birthed them. They learn to navigate spaces between reality, walking paths others cannot see. Void-Walker craters are built where the void touches earth. Members serving as navigators and seekers of hidden knowledge. They claim the void speaks in silence between heartbeats, showing paths through reality others cannot see. But the void hungers — prolonged use of gifts leaves them feeling empty and disconnected.',
                statModifiers: { wisdom: 2, intelligence: 1 },
                baseStats: { health: 9, mana: 5, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['charmed', 'frightened'], disadvantage: ['psychic_effects'] },
                traits: [
                    {
                        id: 'void_step',
                        name: 'Void Step',
                        description: 'You step sideways through the emptiness between stars, where no light has ever reached and no warmth survives. For a heartbeat you are nowhere — suspended in the silent dark that birthed your bloodline — then reality folds open again and you stand elsewhere, leaving a wound of absolute cold behind you.',
                        level: 1,
                        icon: 'spell_arcane_blink',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['movement', 'damage'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['cold'], formula: '1d6', resolution: 'DICE' },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{ id: 'teleport', name: 'Void Step Teleport', description: 'Teleport up to 60 feet through the void between spaces' }],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'void_gaze',
                        name: 'Void Gaze',
                        description: 'When you open your eyes fully, others glimpse the void between stars staring back — an infinite dark that sees through every deception and every veil. Illusions unravel like mist, hidden things blaze with terrible clarity, and the mundane world lays bare its secrets. Those who meet your gaze during this time flinch away, unsettled by the cosmic nothing that moves behind your pupils.',
                        level: 1,
                        icon: 'spell_shadow_antimagicshell',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['detection', 'buff'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [
                                { id: 'see_invisible', name: 'See Invisible', description: 'Perceive invisible creatures and objects within 60 feet' },
                                { id: 'pierce_illusions', name: 'Pierce Illusions', description: 'See through magical illusions within 60 feet' },
                                { id: 'detect_magic', name: 'Detect Magic', description: 'Sense magical effects and auras within 60 feet' }
                            ],
                            duration: 1,
                            durationUnit: 'minute'
                        },
                        buffConfig: { buffType: 'passive_enhancement', effects: [{ id: 'void_gaze_vision', name: 'Void Gaze Vision', description: 'See invisible creatures, pierce illusions, and detect magical effects', statusEffect: { level: 'major', description: 'Void-touched eyes reveal hidden truths' } }], durationValue: 1, durationType: 'minutes', durationUnit: 'minutes', canBeDispelled: true },
                        debuffConfig: { debuffType: 'ability_impairment', effects: [{ id: 'void_gaze_charisma_drain', name: 'Void Gaze Charisma Drain', description: 'Disadvantage on Charisma checks while Void Gaze is active', statusEffect: { level: 'minor', description: 'Unsettling void gaze causes social disadvantage' } }], targetRestriction: 'self' },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'cosmic_isolation',
                        name: 'Cosmic Isolation',
                        description: 'Immune to charm and fear effects. Your mind has seen the void between stars — mortal manipulation feels trivial. However, you have disadvantage on Persuasion checks with non-Astren.',
                        level: 1,
                        icon: 'spell_shadow_antimagicshell',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: { buffType: 'passive_enhancement', effects: [{ id: 'cosmic_isolation_immunity', name: 'Cosmic Isolation', description: 'Immune to charm and fear effects — mortal manipulation feels trivial after witnessing the void between stars', statusEffect: { level: 'extreme', description: 'Immune to charm and fear' } }], durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false },
                        debuffConfig: { debuffType: 'ability_impairment', effects: [{ id: 'cosmic_isolation_social_drain', name: 'Cosmic Isolation Social Drain', description: 'Disadvantage on Persuasion checks with non-Astren', statusEffect: { level: 'minor', description: 'Void-touched presence unsettles non-Astren' } }], targetRestriction: 'non-astren' },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'void_whispers',
                        name: 'Void Whispers',
                        description: 'You hear whispers from the void between moments. Once per long rest, you can ask the void a question and receive a one-word answer (GM\'s discretion). The void knows things that have been forgotten by the living.',
                        level: 1,
                        icon: 'spell_arcane_arcanebrilliance',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['divination'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{ id: 'void_whisper', name: 'Void Whisper', description: 'Ask the void one question and receive a one-word answer, once per long rest' }],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'radiant_vulnerability_astren_voidwalker',
                        name: 'Radiant Vulnerability',
                        description: 'You are a creature of void and shadow — pure light unravels your connection to the spaces between stars.',
                        level: 1,
                        icon: 'spell_holy_holybolt',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'radiant_vulnerability',
                                name: 'Radiant Vulnerability',
                                description: 'Pure light unravels your connection to the spaces between stars — radiance is anathema to void-touched flesh',
                                statusEffect: {
                                    vulnerabilityType: 'radiant',
                                    vulnerabilityPercent: 100
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            },
            sunborn: {
                id: 'sunborn_astren',
                name: 'Sunborn',
                description: 'Warm where other Astren are cold, skin faintly luminous like embers buried in ash. Eyes burn with inner fire — gold and orange, pupils like tiny suns that leave afterimages when they blink. Hair moves as if in solar wind even indoors. Touch radiates gentle warmth. When emotional, their skin crackles with faint coronas. They smell of ozone and distant fire. The constellations on their skin glow warmer — silver lines that pulse with heat rather than cold.',
                culturalBackground: 'The Sunborn trace their lineage to Astren who carried the fire of dying suns within their fall to earth. Bloodline marked by the stellar flame that burns in their veins. They learn to channel solar energy, to wield the fire that once lit a star. Their warmth makes them the most approachable of the Astren, but their emotions burn hotter — anger can ignite, grief can scorch. They carry the Volketh tradition of storms — when a Sunborn rages, lightning follows.',
                statModifiers: { charisma: 2, constitution: 1 },
                baseStats: { health: 12, mana: 4, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['fire_effects', 'exhaustion'], disadvantage: ['cold_effects'] },
                traits: [
                    {
                        id: 'solar_flare',
                        name: 'Solar Flare',
                        description: 'You open your mouth and the fire of a dying sun pours forth — the same stellar flame that burned in the veins of the first Sunborn when they fell screaming through the sky. It roars from you in a searing cascade, and where it passes, darkness itself cannot survive, burned away by light that remembers what it was to be a star.',
                        level: 1,
                        icon: 'spell_fire_flamestrike',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['damage', 'utility'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['fire'], formula: '3d6', resolution: 'DICE', savingThrow: { ability: 'agility', difficultyClass: 'spell', saveOutcome: 'half_damage' } },
                        utilityConfig: {
                            utilityType: 'light',
                            selectedEffects: [
                                { id: 'solar_radiance', name: 'Solar Radiance', description: 'Emit bright light in a 30-foot radius that dispels magical darkness' }
                            ],
                            duration: 1,
                            durationUnit: 'minute'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'storm_call',
                        name: 'Storm Call',
                        description: 'In the Volketh tradition, the storm is the voice of stellar rage — and now you give it throat. Lightning crackles down from a sky that had been clear moments before, rain howls sideways, and the air fills with the fury of a star that refuses to die quietly. Arrows lose their way in the tempest, and anything caught within hears only the thunder of a dying sun screaming back to life.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['damage', 'control'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['lightning'], formula: '1d6', resolution: 'DICE', savingThrow: { ability: 'agility', difficultyClass: 'spell', saveOutcome: 'negates' } },
                        duration: 3,
                        durationUnit: 'rounds',
                        debuffConfig: { debuffType: 'sensory_impairment', effects: [{ id: 'storm_call_tempest', name: 'Storm Call Tempest', description: 'Ranged attacks have disadvantage and visibility is reduced to 30ft within the storm', statusEffect: { level: 'moderate', description: 'Tempest obscures vision and disrupts ranged attacks' } }], targetRestriction: 'enemies_in_range', range: 30, rangeUnit: 'ft' },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'stellar_warmth',
                        name: 'Stellar Warmth',
                        description: 'The dying sun within you has not gone gentle — it burns still, a furnace of stellar warmth banked beneath your ribs. Heat radiates from you like the last breath of a hearth, shielding those nearby from the bitterest cold. Frost retreats from your presence, and winter itself gives way to the memory of light.',
                        level: 1,
                        icon: 'spell_fire_firearmor',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: { buffType: 'aura', effects: [{ id: 'stellar_warmth_aura', name: 'Stellar Warmth Aura', description: '10ft aura grants allies cold resistance, cold immunity, advantage on cold saves, and extreme cold protection', statusEffect: { level: 'major', description: 'Stellar warmth shields against cold' } }, { id: 'stellar_warmth_self', name: 'Stellar Warmth Self', description: 'Cold resistance and extreme cold protection', statusEffect: { level: 'major', description: 'Warded by stellar heat' } }], aura: { radius: 10, unit: 'ft', affects: 'allies' }, durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'inner_fire',
                        name: 'Inner Fire',
                        description: 'When you roll a 1 on an attack roll or saving throw, you can reroll it (once per long rest). The fire of a dying sun burns within you — it does not let you fail completely.',
                        level: 1,
                        icon: 'spell_fire_fire',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: { buffType: 'passive_enhancement', effects: [{ id: 'inner_fire_reroll', name: 'Inner Fire Reroll', description: 'Reroll a natural 1 on attack rolls or saving throws, once per long rest', statusEffect: { level: 'moderate', description: 'Stellar fire refuses to let you fail completely' }, reroll: { trigger: 'natural_1', appliesTo: ['attack', 'saving_throw'], usesPerRest: 1, restType: 'long' } }], durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'cold_vulnerability_astren_sunborn',
                        name: 'Cold Vulnerability',
                        description: 'The stellar fire within you can be quenched by extreme cold — frost suffocates the solar flame that burns in your veins.',
                        level: 1,
                        icon: 'spell_frost_frostbolt02',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'cold_vulnerability',
                                name: 'Cold Vulnerability',
                                description: 'Frost suffocates the solar flame that burns in your veins — extreme cold can quench the stellar fire within',
                                statusEffect: {
                                    vulnerabilityType: 'cold',
                                    vulnerabilityPercent: 100
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            },
            starmapped: {
                id: 'starmapped_astren',
                name: 'Constellation',
                description: 'The silver constellation lines on their skin are the most pronounced — bright, shifting patterns that rearrange nightly to match the sky above. Eyes reflect whatever constellations are currently visible, even indoors. They move with mathematical precision, each step calculated, as if tracing a pattern only they can see. When they concentrate, the constellation lines on their skin glow brighter, projecting faint star-charts onto nearby surfaces. Their speech sometimes fractures into geometric patterns, thoughts not linear but stellated.',
                culturalBackground: 'The Constellations trace their lineage to Astren who mapped the patterns written in stars during their fall. Bloodline marked by the ability to read fate in the arrangement of celestial bodies. They learn to interpret the patterns — in skin, in stars, in the geometry of events. Their minds fracture under cosmic truths, seeing futures that have not happened, remembering lives never lived. They serve as seers, astrologers, and fate-readers. But the patterns are not always clear, and sometimes the reading drives the reader mad.',
                statModifiers: { intelligence: 2, wisdom: 1 },
                baseStats: { health: 10, mana: 5, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['illusion', 'psychic'], disadvantage: ['confusion_effects'] },
                traits: [
                    {
                        id: 'fate_reading',
                        name: 'Fate Reading',
                        description: 'Read the constellation patterns in a creature\'s fate. Choose one willing creature within 30ft. For 1 hour, that creature gains advantage on one type of d20 roll of your choice (attack rolls, ability checks, or saving throws). However, you learn one secret about that creature that they may not want known.',
                        level: 1,
                        icon: 'spell_arcane_arcanebrilliance',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['buff', 'divination'],
                        typeConfig: { category: 'racial' },
                        buffConfig: { buffType: 'passive_enhancement', effects: [{ id: 'fate_reading_advantage', name: 'Fate Reading Advantage', description: 'Advantage on one chosen type of d20 roll (attack, ability check, or saving throw) for 1 hour', statusEffect: { level: 'moderate', description: 'Fate-guided rolls' }, advantage: { rollType: 'chosen', duration: 1, durationUnit: 'hour' } }], durationValue: 1, durationType: 'hours', durationUnit: 'hours', canBeDispelled: true },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{ id: 'reveal_secret', name: 'Reveal Secret', description: 'Learn one hidden secret about a creature or object within 30 feet' }],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'star_bolt',
                        name: 'Star Bolt',
                        description: 'You gather the light of distant, dead constellations into the palm of your hand and hurl it like a falling star. The bolt strikes true — and against creatures of darkness and undeath, the starlight burns with the fury of every sun that creature\'s corruption ever extinguished.',
                        level: 1,
                        icon: 'spell_arcane_starfire',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['damage'],
                        typeConfig: { category: 'racial' },
                        damageConfig: { damageTypes: ['radiant'], formula: '2d8', resolution: 'DICE', bonusDice: { count: 1, size: 8, condition: 'fiend_or_undead' } },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'cosmic_awareness',
                        name: 'Cosmic Awareness',
                        description: 'The stars have already seen what is about to happen — they traced the pattern of the coming moment before you drew your first breath. Their warnings arrive as a prickling at the edge of your awareness, a certainty that lets you move before danger fully materializes, always one step ahead of the unfolding fate.',
                        level: 1,
                        icon: 'spell_holy_mindvision',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: { buffType: 'passive_enhancement', effects: [{ id: 'cosmic_awareness_no_surprise', name: 'Cosmic Awareness — No Surprise', description: 'Cannot be surprised — the stars warn of danger before it materializes', statusEffect: { level: 'major', description: 'Cannot be surprised' } }, { id: 'cosmic_awareness_initiative', name: 'Cosmic Awareness — Initiative Advantage', description: 'Advantage on initiative rolls — you move before danger fully materializes', statusEffect: { level: 'moderate', description: 'Advantage on initiative' } }], durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'pattern_memory',
                        name: 'Pattern Memory',
                        description: 'You remember every spatial pattern you\'ve ever seen — maps, dungeon layouts, trap mechanisms, combat formations. You can perfectly reproduce any pattern from memory. You have advantage on Investigation checks and can always retrace your steps to any location you\'ve visited.',
                        level: 1,
                        icon: 'ability_hunter_trackingspeed',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['utility'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'awareness',
                            selectedEffects: [
                                { id: 'pattern_memory', name: 'Pattern Memory', description: 'Perfectly recall any pattern, map, or layout you have seen' },
                                { id: 'investigation_advantage', name: 'Stellar Investigation', description: 'Advantage on Investigation checks — the stars guide your perception' },
                                { id: 'pathfinding', name: 'Cosmic Pathfinding', description: 'Always know the shortest path to any destination you have visited' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'psychic_vulnerability_astren_starmapped',
                        name: 'Psychic Vulnerability',
                        description: 'Your mind is already fractured by cosmic truths — additional psychic pressure can shatter it further.',
                        level: 1,
                        icon: 'spell_shadow_psychichorrors',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'psychic_vulnerability',
                                name: 'Psychic Vulnerability',
                                description: 'Your fractured mind cannot withstand additional psychic pressure — cosmic truths have already left your consciousness fragile',
                                statusEffect: {
                                    vulnerabilityType: 'psychic',
                                    vulnerabilityPercent: 100
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [], resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            }
        }
    },
    ferrick: {
        id: 'ferrick',
        name: 'Ferrick',
        essence: 'Scrap-born tinkerers',
        description: 'We are the forgotten children of progress, the ones who were deemed too small, too clever, too inconvenient for the empires that built and then discarded us. Born from the alchemical runoff of arcane forges, our blood runs with quicksilver and our bones are laced with the rust of a thousand broken machines. We are small — yes, smaller than you — but our minds are engines that never stop turning. Every scrap of metal is a puzzle waiting to be solved, every broken mechanism a patient that can be cured. Our fingers are stained with oil that will never wash out, our eyes reflect the blue-white flash of arc-light, and our hearts beat with the rhythm of clockwork that we did not choose but have learned to love. We build because we must. We tinker because the alternative is to be nothing more than the waste product of someone else\'s ambition. And from that waste, we have forged something entirely our own.',
        icon: 'fas fa-cog',
        overview: 'The Ferrick are small folk born from alchemical runoff near ancient arcane forges. Their blood carries quicksilver, their bones hold traces of forge-rust. Organized into workshop-clans built around scrap heaps and salvage yards. They are Small (3\'2\"-3\'10\"), the only Small race, making them uniquely nimble but vulnerable to larger creatures.',
        culturalBackground: 'Ferrick society is built around workshop-clans that inhabit scrapyards, abandoned forges, and salvage yards. Each clan claims a junk pile as ancestral territory, defending it fiercely. Children learn to scavenge before they can walk properly. The Ferrick do not choose invention — it is their nature, passed down through bloodlines that remember the alchemical fires that birthed them.',
        variantDiversity: 'The Ferrick are divided into two major workshop-clan bloodlines: The Scrapwrights build and create from salvage, turning trash into treasure. The Bonesmiths practice the forbidden art of bone-metal grafting, reinforcing their own skeletons with salvaged metal.',
        integrationNotes: {
            actionPointSystem: 'Ferrick abilities focus on crafting, salvage, and inventive solutions. Their small size provides stealth advantages but combat penalties against larger foes.',
            backgroundSynergy: 'Ferrick excel as tinkers, engineers, and salvage experts. Their crafting abilities make them valuable party members.',
            classCompatibility: 'Ferrick make excellent artificers, rogues, and ranged combatants. Their small size and crafting skills complement utility-focused classes.'
        },
        meaningfulTradeoffs: 'Ferrick gain powerful crafting abilities and small-size advantages but are physically weaker than most races. Vulnerable to being grappled by larger creatures and their quicksilver blood reacts badly to certain magics.',
        baseTraits: {
            languages: ['Common', 'Ferric'],
            lifespan: '40-60 years',
            baseSpeed: 25,
            size: 'Small',
            sizeCategory: 'Small',
            height: '3\'2\" - 3\'10\"',
            weight: '40-60 lbs',
            build: 'Compact and wiry'
        },
        epicHistory: 'The Ferrick were not born — they were made. Ancient arcane forges produced runoff that pooled in forgotten corners, and from that alchemical soup, the first Ferrick crawled. Small, quick, and endlessly curious. The empires that made them considered them vermin. The Ferrick proved them wrong by building civilizations from the empires\' garbage. Every scrap heap is a Ferrick heritage site. Every broken machine is a ancestor speaking. They are Small but they are not lesser — they are the ultimate proof that worth is not measured in size.',
        notableFigures: [
            {
                name: 'Scrapsmith Glim',
                title: 'The First Tinker',
                portraitIcon: 'Armor/Head/head-golden-crown-helmet',
                backstory: 'The legendary first Ferrick who turned a pile of broken swords into a functioning clockwork workshop. Glim proved that the Ferrick could build anything from nothing.'
            }
        ],
        majorLocations: [
            {
                name: 'The Great Scrapheap',
                description: 'The largest Ferrick settlement, built into a mountain of salvage from three fallen empires. A labyrinth of tunnels and workshops where every piece of junk has a purpose.'
            }
        ],
        currentCrisis: 'The spreading darkness threatens the scrapyards. The Ferrick prepare by weaponizing their inventions and reinforcing their workshop-clans.',
        culturalPractices: 'Ferrick children learn to scavenge before they can walk. Every object is assessed for potential. Nothing is wasted. Clan disputes are settled through crafting competitions.',
        subraces: {
            scrapwright: {
                id: 'scrapwright_ferrick',
                name: 'Scrapwright',
                description: 'Scrapwright Ferrick are builders and creators who turn salvage into treasure. Their fingers are permanently stained with machine oil, their eyes sharp for any piece of salvage that can be repurposed. They carry toolbelts that clink with salvaged instruments and their workshops are organized chaos of half-finished projects.',
                culturalBackground: 'Scrapwrights build and create from salvage, turning trash into treasure. Their workshop-clans are the architects of Ferrick society, responsible for turning scrap heaps into functioning communities. They value ingenuity above all and settle disputes through crafting competitions.',
                statModifiers: { intelligence: 2, dexterity: 1 },
                baseStats: { health: 8, mana: 4, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['investigation', 'crafting'], disadvantage: ['grapple_effects'] },
                traits: [
                    {
                        id: 'salvage_kit',
                        name: 'Salvage Kit',
                        description: 'Disassemble any non-magical object into raw components. Then craft a temporary item: smoke bomb (15ft obscurement 1 round), caltrops (10ft difficult terrain), or flash powder (creatures within 10ft must Con save or be blinded 1 round). Lasts 1 encounter.',
                        level: 1,
                        icon: 'inv_misc_enggizmos_27',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['utility'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'crafting',
                            selectedEffects: [
                                { id: 'salvage', name: 'Salvage', description: 'Harvest useful components from mechanical debris and wreckage' },
                                { id: 'craft_smoke_bomb', name: 'Craft Smoke Bomb', description: 'Improvises a smoke bomb from salvaged materials' },
                                { id: 'craft_caltrops', name: 'Craft Caltrops', description: 'Improvises caltrops from salvaged materials' },
                                { id: 'craft_flash_powder', name: 'Craft Flash Powder', description: 'Improvises flash powder from salvaged materials' }
                            ],
                            duration: 1,
                            durationUnit: 'encounter'
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'quick_repair',
                        name: 'Quick Repair',
                        description: 'Touch a broken or damaged object (non-magical) and restore it to working condition. Can also restore 1d8 HP to a construct.',
                        level: 1,
                        icon: 'inv_hammer_20',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['healing', 'utility'],
                        typeConfig: { category: 'racial' },
                        healingConfig: { formula: '1d8', healType: 'construct', resolution: 'DICE' },
                        utilityConfig: {
                            utilityType: 'repair',
                            selectedEffects: [{ id: 'repair_object', name: 'Quick Repair', description: 'Mend a non-magical object, restoring it to working condition' }],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'scavenger_eye',
                        name: 'Scavenger Eye',
                        description: 'Advantage on Investigation checks to find hidden objects. Can determine the function of any device or mechanism by studying it for 1 minute. Always find the most valuable item in any pile of salvage.',
                        level: 1,
                        icon: 'ability_rogue_findweakness',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['detection', 'utility'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'investigation',
                            selectedEffects: [
                                { id: 'investigation_advantage', name: 'Tinkerer\'s Eye', description: 'Advantage on Investigation checks involving mechanical devices and traps' },
                                { id: 'identify_device', name: 'Identify Device', description: 'Instantly understand the function of any mechanical device you examine' },
                                { id: 'best_loot', name: 'Scavenger\'s Intuition', description: 'Always find the most valuable salvage in any wreckage' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'small_and_quick',
                        name: 'Small and Quick',
                        description: 'Can move through the space of any creature that is Medium or larger without provoking opportunity attacks. Advantage on Stealth checks when in urban environments, workshops, or places with lots of objects to hide behind.',
                        level: 1,
                        icon: 'ability_rogue_stealth',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['movement', 'buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                { id: 'small_quick_move_through', name: 'Slip Through', description: 'Can move through the space of any creature that is Medium or larger without provoking opportunity attacks', statusEffect: { level: 'minor', description: 'Movement through larger creatures spaces' } },
                                { id: 'small_quick_stealth', name: 'Urban Stealth', description: 'Advantage on Stealth checks in urban environments, workshops, or cluttered areas', statModifier: { stat: 'stealth', magnitude: 'advantage', magnitudeType: 'advantage', conditions: ['urban', 'workshop', 'cluttered'] } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'quicksilver_vulnerability_ferrick',
                        name: 'Quicksilver Vulnerability',
                        description: 'The quicksilver in your blood supercharges and courses through your veins when struck by lightning, frying your small frame from within.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'lightning_vulnerability',
                                name: 'Lightning Vulnerability',
                                description: 'The quicksilver in your blood supercharges when struck by lightning — electrical current courses through your veins, frying your frame from within',
                                statusEffect: {
                                    vulnerabilityType: 'lightning',
                                    vulnerabilityPercent: 100
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            },
            bonesmith: {
                id: 'bonesmith_ferrick',
                name: 'Bonesmith',
                description: 'Bonesmith Ferrick practice the forbidden art of bone-metal grafting, reinforcing their own skeletons with salvaged metal. Their movements carry a faint metallic rasp, their skin shows ridges where metal meets bone beneath. They are heavier and sturdier than other Ferrick, trading agility for durability.',
                culturalBackground: 'Bonesmiths practice the forbidden art of bone-metal grafting, reinforcing their own skeletons with salvaged metal. Their workshop-clans are the defenders of Ferrick society, using their enhanced bodies to protect scrapyards from threats. They value endurance and view the body as a machine that can be improved.',
                statModifiers: { constitution: 2, strength: 1 },
                baseStats: { health: 10, mana: 2, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['poison', 'disease'], disadvantage: ['lightning_effects'] },
                traits: [
                    {
                        id: 'bone_plating',
                        name: 'Bone Plating',
                        description: 'Graft salvaged metal plates onto your bones. Gain +2 AC for 1 hour. While plated, your unarmed strikes deal 1d6 bludgeoning instead of normal.',
                        level: 1,
                        icon: 'inv_shield_06',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                { id: 'bone_plating_armor', name: 'Bone Plate Armor', description: 'Salvaged metal plates grafted to your skeleton reinforce your natural defenses', statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' } },
                                { id: 'bone_plating_fists', name: 'Reinforced Fists', description: 'Metal-laced knuckles transform your unarmed strikes into devastating blows', statusEffect: { level: 'moderate', description: 'Unarmed strikes deal 1d6 bludgeoning' } }
                            ],
                            durationValue: 1, durationType: 'hours', durationUnit: 'hours', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'metal_fist',
                        name: 'Metal Fist',
                        description: 'Deliver a devastating punch with your metal-reinforced fist. One creature within 5ft takes 2d8 bludgeoning damage and must make a Strength save or be knocked back 10ft.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['damage', 'control'],
                        typeConfig: { category: 'racial' },
                        targetingConfig: { range: 5, unit: 'ft' },
                        damageConfig: { damageTypes: ['bludgeoning'], formula: '2d8', resolution: 'DICE' },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{ type: 'knockback', name: 'Knockback', description: 'The impact sends the target flying backwards', mechanicsText: 'Strength save or knocked back 10 feet' }],
                            durationValue: 0, durationType: 'instant', durationUnit: 'instant',
                            saveConfig: { saveType: 'strength', saveDC: 'spell', successEffect: 'no_knockback' }
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'iron_constitution',
                        name: 'Iron Constitution',
                        description: 'Advantage on saving throws against poison and disease. Your metal-laced bones resist what would break normal skeletons. Resistance to necrotic damage.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                { id: 'iron_constitution_save', name: 'Iron Resilience', description: 'Your metal-laced bones resist poison and disease', statModifier: { stat: 'saving_throws', magnitude: 'advantage', magnitudeType: 'advantage', conditions: ['poison', 'disease'] } },
                                { id: 'iron_constitution_resist', name: 'Necrotic Resistance', description: 'Your reinforced skeleton resists necrotic energy', statusEffect: { level: 'moderate', description: 'Resistance to necrotic damage' } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'scrap_arsenal',
                        name: 'Scrap Arsenal',
                        description: 'You always count as having a weapon. Your metal-reinforced limbs count as light weapons (1d4 piercing) and you can never be disarmed. You can spend 10 minutes to improvise a weapon from any scrap pile.',
                        level: 1,
                        icon: 'inv_hammer_20',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['utility'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'combat',
                            selectedEffects: [
                                { id: 'always_armed', name: 'Always Armed', description: 'You always count as having a weapon' },
                                { id: 'natural_weapon', name: 'Natural Weapon', description: 'Your metal-reinforced limbs count as light weapons dealing 1d4 piercing damage' },
                                { id: 'cannot_be_disarmed', name: 'Disarm Immune', description: 'You can never be disarmed' },
                                { id: 'improvised_weapon', name: 'Scrap Improvisation', description: 'You can spend 10 minutes to improvise a weapon from any scrap pile' }
                            ],
                            power: 'moderate'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'magnetic_vulnerability_ferrick',
                        name: 'Magnetic Vulnerability',
                        description: 'The metal in your bones attracts electrical current like a lightning rod — lightning damage pulls you toward the source and tears through your metallic frame.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'lightning_vulnerability',
                                name: 'Lightning Vulnerability',
                                description: 'The metal in your bones conducts electrical current with devastating efficiency — lightning tears through your metallic frame',
                                statusEffect: {
                                    vulnerabilityType: 'lightning',
                                    vulnerabilityPercent: 100
                                }
                            }, {
                                id: 'magnetic_pull',
                                name: 'Magnetic Pull',
                                description: 'The metal in your bones is magnetically drawn toward the source of lightning damage — pulled 10 feet toward the source',
                                statusEffect: {
                                    pullDistance: 10,
                                    pullUnit: 'ft',
                                    pullTrigger: 'lightning_damage'
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            }
        }
    },
    human: {
        id: 'human',
        name: 'Human',
        essence: 'The rootstock',
        description: 'We are the rootstock — the unaltered, the unblessed, the ones who refused the shaping. When the gods offered power, we asked the price. When the spirits offered change, we kept our faces. When the beast called, we built walls instead of answering. This is not weakness. This is the oldest strength: the refusal to become something other than what we are. Our empires rise and fall not because we lack power, but because we refuse to trade our nature for it. We are merchants who built networks that span continents, homesteaders who carved farms from wilderness with nothing but iron and stubbonness, and soldiers who fight not with claws or fire but with the discipline of those who chose their battles. We are Human — and we remain.',
        icon: 'fas fa-user',
        overview: 'Humans are the rootstock race — the baseline from which all other races diverged or were shaped. They refused magical transformation, elemental binding, and divine alteration. Instead they built through trade, stubbornness, and sheer numbers. Organized into two broad cultures: Lowlanders (merchant-networkers) and Hillfolk (stubborn homesteaders).',
        culturalBackground: 'Human society is vast and varied, spanning more territory than any single non-human race. Their strength lies not in individual power but in networks — of trade, of alliance, of blood. Lowlanders build cities at crossroads and ports, creating merchant networks that span continents. Hillfolk carve homesteads from wilderness, building communities that endure through sheer stubbornness. Both cultures value self-determination above all.',
        variantDiversity: 'Humans are divided into two broad cultural traditions: The Lowlanders build merchant networks and thrive in cities, using charm and connections to compensate for their lack of supernatural power. The Hillfolk are stubborn homesteaders who endure through sheer willpower and endurance.',
        integrationNotes: {
            actionPointSystem: 'Human abilities focus on social networks, survival, and stubborn resilience. They lack supernatural power but gain versatile utility.',
            backgroundSynergy: 'Humans excel as merchants, diplomats, soldiers, and homesteaders. Their adaptability makes them fit any background.',
            classCompatibility: 'Humans can excel at any class through sheer determination. Their lack of racial power is offset by versatility.'
        },
        meaningfulTradeoffs: 'Humans gain social utility and stubborn resilience but lack the supernatural abilities of other races. Their strength is in numbers, networks, and refusing to quit.',
        baseTraits: {
            languages: ['Common'],
            lifespan: '70-90 years',
            baseSpeed: 30,
            size: 'Medium',
            sizeCategory: 'Medium',
            height: '5\'4\" - 6\'0\"',
            weight: '130-200 lbs',
            build: 'Variable'
        },
        epicHistory: 'Humans are the oldest race — or at least the most stubborn. Every other race was shaped, transformed, cursed, or blessed by external forces. Humans refused. They watched the Nordmark freeze, the Grimheart petrify, the Vreken succumb to the beast. And they built walls. When the magical cataclysms came, humans survived not through power but through preparation. Their merchant networks fed cities through famines. Their homesteads endured when empires fell. The greatest human empire lasted 800 years not because of magic, but because of roads, laws, and the stubborn insistence that tomorrow is worth planning for.',
        notableFigures: [
            {
                name: 'Marcus the Stubborn',
                title: 'The Last Homesteader',
                portraitIcon: 'Armor/Head/head-hooded-helmet',
                backstory: 'When the darkness came to the frontier, every other race retreated to their ancestral homes. Marcus stayed. He reinforced his farmstead, planted his fields, and when the shadow creatures came, he fought them off with a pitchfork and lantern. His homestead still stands — a beacon of human stubbornness.'
            }
        ],
        majorLocations: [
            {
                name: 'Crossroads Market',
                description: 'The largest trading hub on the continent, built at the intersection of five major trade routes. Run by Lowlander merchant families, it is said that anything can be bought here if the price is right.'
            }
        ],
        currentCrisis: 'The spreading darkness threatens human trade routes and frontier settlements. Lowlanders use their networks to coordinate defense. Hillfolk refuse to leave their homesteads and instead fortify.',
        culturalPractices: 'Humans value practical skill over innate ability. A good blacksmith is worth more than a mediocre mage. Their celebrations center on harvest, trade, and survival — the three things that have kept them alive when more powerful races fell.',
        subraces: {
            lowlander: {
                id: 'lowlander_human',
                name: 'Lowlander',
                description: 'Lowlander Humans are merchants and networkers who thrive in cities and settlements. Their charm and connections compensate for their lack of supernatural power. They carry ledgers as readily as swords and know the value of a firm handshake.',
                culturalBackground: 'Lowlanders build merchant networks and thrive in cities, using charm and connections to compensate for their lack of supernatural power. Their communities center around markets, guildhalls, and the bustling crossroads of civilization.',
                statModifiers: { charisma: 2, intelligence: 1 },
                baseStats: { health: 10, mana: 4, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['deception', 'persuasion'], disadvantage: ['naive_trust_effects'] },
                traits: [
                    {
                        id: 'call_in_a_favor',
                        name: 'Call in a Favor',
                        description: 'Name a type of assistance you need (information, equipment, shelter, passage). If you are in any settlement, you can find someone who owes you or your family a favor. The assistance arrives within 1d4 hours. The GM determines the quality based on location.',
                        level: 1,
                        icon: 'spell_holy_prayerofhealing',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['utility', 'social'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'social',
                            selectedEffects: [
                                { id: 'call_favor', name: 'Call in a Favor', description: 'Summon help from contacts in any settlement — information, equipment, shelter, or passage' },
                                { id: 'favor_arrival', name: 'Contact Arrival', description: 'Allies arrive within 1d4 hours to provide assistance' }
                            ],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] },
                    },
                    {
                        id: 'streetwise',
                        name: 'Streetwise',
                        description: 'Spend 10 minutes gathering rumors in any settlement. Learn one useful piece of information about the area: a danger to avoid, a hidden opportunity, or a powerful individual\'s secret.',
                        level: 1,
                        icon: 'ability_rogue_findweakness',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['detection', 'social'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'information',
                            selectedEffects: [{ id: 'gather_information', name: 'Gather Information', description: 'Spend 10 minutes in any settlement to learn about local dangers, opportunities, and secrets' }],
                            duration: 10,
                            durationUnit: 'minutes'
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] },
                    },
                    {
                        id: 'dealbroker',
                        name: 'Dealbroker',
                        description: 'When buying or selling goods, you always get 20% better prices. Advantage on Persuasion checks in commercial negotiations. You can assess the true value of any trade good by examining it for 1 minute.',
                        level: 1,
                        icon: 'inv_misc_coin_01',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['utility', 'social'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'commercial',
                            selectedEffects: [
                                { id: 'price_bonus', name: 'Keen Appraiser', description: 'Get 20% better prices on all trades and purchases' },
                                { id: 'commercial_persuasion', name: 'Commercial Persuasion', description: 'Advantage on Persuasion checks in commercial transactions' },
                                { id: 'appraise', name: 'Appraise', description: 'Accurately determine the value of any item in 1 minute' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] },
                    },
                    {
                        id: 'connections',
                        name: 'Connections',
                        description: 'In any settlement with more than 100 people, you can find a helpful contact within 1 hour. The contact provides basic assistance: a place to sleep, a hot meal, local news, or directions. The quality depends on location and your reputation.',
                        level: 1,
                        icon: 'fas fa-users',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['social', 'information'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'social',
                            selectedEffects: [{ id: 'find_contact', name: 'Find Contact', description: 'In any settlement of 100+ people, find someone within an hour who provides shelter, a meal, news, or directions' }],
                            duration: 1,
                            durationUnit: 'hour'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] },
                    },
                    {
                        id: 'naive_trust',
                        name: 'Naive Trust',
                        description: 'Disadvantage on saves vs charm from creatures that offered you a deal, gift, or promise within the last hour. Lowlanders want to believe in the best in people — and cunning creatures exploit this.',
                        level: 1,
                        icon: 'fas fa-heart-broken',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                { type: 'save_disadvantage', mechanicsText: 'Disadvantage on saves vs charm from creatures that offered a deal, gift, or promise within the last hour', saveDisadvantage: { condition: 'charm', trigger: 'deal_gift_promise_within_hour' } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] },
                    }
                ]
            },
            hillfolk: {
                id: 'hillfolk_human',
                name: 'Hillfolk',
                description: 'Hillfolk Humans are stubborn homesteaders who endure through sheer willpower and endurance. Their hands are calloused from work that never ends, their eyes sharp from watching horizons for threats. They build walls when others would flee.',
                culturalBackground: 'Hillfolk are stubborn homesteaders who endure through sheer willpower and endurance. Their communities are built on mutual reliance and the unspoken understanding that every neighbor is a lifeline. They measure a person by what they do when things get hard.',
                statModifiers: { constitution: 2, strength: 1 },
                baseStats: { health: 12, mana: 2, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['exhaustion', 'poison'], disadvantage: ['isolation_effects'] },
                traits: [
                    {
                        id: 'stubborn_will',
                        name: 'Stubborn Will',
                        description: 'When you fail a saving throw against charm, fear, or compulsion, you can choose to succeed instead. You take 1d6 psychic damage from the mental strain.',
                        level: 1,
                        icon: 'spell_holy_divinespirit',
                        spellType: 'REACTION',
                        actionPoints: 0,
                        components: ['verbal'],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'save_override',
                            effects: [
                                { type: 'save_override', mechanicsText: 'Succeed instead on failed saves vs charm, fear, or compulsion', saveOverride: { successInstead: true, conditions: ['charm', 'fear', 'compulsion'] } },
                                { type: 'psychic_backlash', mechanicsText: 'Take 1d6 psychic damage from the mental strain', psychicBacklash: { damageType: 'psychic', diceCount: 1, diceSize: 6 } }
                            ],
                            durationValue: 0, durationType: 'instant', durationUnit: 'instant', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] },
                    },
                    {
                        id: 'trench_fighting',
                        name: 'Trench Fighting',
                        description: 'Enter a defensive stance. For 1 minute, gain +2 AC and any creature that hits you with a melee attack takes 1d4 piercing damage from your counter-attacks. You cannot move more than 5ft per turn while in this stance.',
                        level: 1,
                        icon: 'ability_warrior_defensivestance',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['buff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'defensive_stance',
                            effects: [
                                { type: 'ac_bonus', mechanicsText: '+2 AC while in defensive stance', acBonus: 2 },
                                { type: 'thorns', mechanicsText: '1d4 piercing damage to melee attackers', thorns: { diceCount: 1, diceSize: 4, damageType: 'piercing', trigger: 'melee_hit' } },
                                { type: 'movement_restriction', mechanicsText: 'Cannot move more than 5ft per turn', movementRestriction: 5 }
                            ],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minute', canBeDispelled: true
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] },
                    },
                    {
                        id: 'endurance_march',
                        name: 'Endurance March',
                        description: 'Travel at double pace without gaining exhaustion. Ignore difficult terrain when moving toward your homestead or toward allies. You never suffer fatigue from forced marches.',
                        level: 1,
                        icon: 'fas fa-hiking',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['movement', 'survival'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'travel',
                            selectedEffects: [
                                { id: 'double_pace', name: 'Double Pace', description: 'Travel at twice normal speed without penalty' },
                                { id: 'no_exhaustion', name: 'Relentless Endurance', description: 'Cannot suffer exhaustion from forced march' },
                                { id: 'homestead_path', name: 'Homestead Path', description: 'Ignore difficult terrain when traveling toward home or allies' },
                                { id: 'no_march_fatigue', name: 'No March Fatigue', description: 'Never fatigue from overland travel' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] },
                    },
                    {
                        id: 'homestead',
                        name: 'Homestead',
                        description: 'Short rests at a place you consider home take half the time. Cannot be surprised while resting at home. When you defend a fixed position (building, wall, trench), gain +1 AC.',
                        level: 1,
                        icon: 'fas fa-campground',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['healing', 'rest', 'buff'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'rest',
                            selectedEffects: [
                                { id: 'short_rest_reduction', name: 'Rapid Recovery', description: 'Short rests take half the normal time at your homestead' },
                                { id: 'no_surprise_home', name: 'Home Ground Advantage', description: 'Cannot be surprised while at your homestead' }
                            ],
                            duration: 0,
                            durationUnit: 'permanent'
                        },
                        buffConfig: {
                            buffType: 'positional_bonus',
                            effects: [
                                { type: 'fixed_position_ac_bonus', mechanicsText: '+1 AC when defending a fixed position', fixedPositionACBonus: 1 }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] },
                    },
                    {
                        id: 'isolation',
                        name: 'Isolation',
                        description: 'When no ally is within 30ft, disadvantage on all attack rolls and ability checks. Hillfolk draw strength from community — alone, they falter.',
                        level: 1,
                        icon: 'fas fa-heart-broken',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                { type: 'attack_disadvantage', mechanicsText: 'Disadvantage on all attack rolls when no ally is within 30ft', attackDisadvantage: { condition: 'no_ally_within_30ft' } },
                                { type: 'ability_check_disadvantage', mechanicsText: 'Disadvantage on all ability checks when no ally is within 30ft', abilityCheckDisadvantage: { condition: 'no_ally_within_30ft' } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] },
                    }
                ]
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
            languages: subrace.languages || race.baseTraits.languages,
            speed: subrace.speed || race.baseTraits.baseSpeed,
            statModifiers: subrace.statModifiers,
            traits: subrace.traits,
            baseStats: subrace.baseStats || {},
            savingThrowModifiers: subrace.savingThrowModifiers || {}
        }
    };
};

/**
 * Get racial base stats for a race/subrace combination
 * Returns base values for armor, speed, hp, mana, ap, passive perception, etc.
 */
export const getRacialBaseStats = (raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) {
        // Return default base stats (varied, not all 0)
        return {
            armor: 0,
            speed: 30,
            hp: 25, // Base HP instead of 0
            mana: 25, // Base mana instead of 0
            ap: 3, // Default is 3, some races have 4 or 2
            passivePerception: 10,
            swimSpeed: 0,
            climbSpeed: 0,
            visionRange: 60,
            darkvision: 0,
            initiative: 0
        };
    }

    const subrace = raceData.subrace;
    const baseStats = subrace.baseStats || {};

    return {
        armor: baseStats.armor !== undefined ? baseStats.armor : 0,
        speed: subrace.speed || raceData.race.baseTraits.baseSpeed || 30,
        hp: baseStats.hp !== undefined ? baseStats.hp : 25, // Base HP instead of 0
        mana: baseStats.mana !== undefined ? baseStats.mana : 15, // Base mana instead of 0
        ap: baseStats.ap !== undefined ? baseStats.ap : 3,
        passivePerception: baseStats.passivePerception !== undefined ? baseStats.passivePerception : 10,
        swimSpeed: baseStats.swimSpeed !== undefined ? baseStats.swimSpeed : 0,
        climbSpeed: baseStats.climbSpeed !== undefined ? baseStats.climbSpeed : 0,
        visionRange: baseStats.visionRange !== undefined ? baseStats.visionRange : 60,
        darkvision: baseStats.darkvision !== undefined ? baseStats.darkvision : 0,
        initiative: baseStats.initiative !== undefined ? baseStats.initiative : 0
    };
};

/**
 * Get saving throw modifiers (advantages/disadvantages) for a race/subrace
 */
export const getRacialSavingThrowModifiers = (raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) return {};
    
    return raceData.combinedTraits.savingThrowModifiers || {};
};

export const applyRacialModifiers = (baseStats, raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) return baseStats;

    const modifiedStats = { ...baseStats };
    const modifiers = raceData.combinedTraits.statModifiers;

    // Initialize stats if they don't exist (for getting racial modifiers as an object)
    ABILITY_SCORES.forEach(ability => {
        if (modifiedStats[ability.id] === undefined) {
            modifiedStats[ability.id] = 0;
        }
    });

    Object.keys(modifiers).forEach(stat => {
        if (modifiedStats[stat] !== undefined) {
            modifiedStats[stat] += modifiers[stat];
        }
    });

    return modifiedStats;
};
